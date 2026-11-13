// Ancestries, heritages and backgrounds in combat (2026-11-01, Cole: "Next evaluate the power of each ancestry and background"), the feat
// ratings' method (tools/lib/feat-power.mjs): whole fights with it and without it, on the same dice, the gap in levels of the foes.
//
//   An ancestry on one PC of the standard party (each PC in turn, at levels 1, 5, 11 and 17), against the same PC as the standard party has
//   it — a human's 8 Hit Points, 25 feet, Medium, no special senses —: its Hit Points, Speed, size, vision and the rules of its features
//   (claws and the like). Its ability boosts aren't counted: the party's scores are a class's usual ones, which any ancestry's free boosts
//   reach.
//   A heritage on top of its ancestry (a versatile heritage on a human), against the ancestry alone: its own PF2e rules, always on.
//   A background: the skill feat it grants (on the PC the feat's ratings put it on), its own rules and the skills it trains, against the
//   party without them.
import fs from "node:fs";
const lib = await import("./feat-power.mjs");
const { PACK_ROOT } = await import("./pack-creatures.mjs");
const { partyFor } = await import("./deadliness.mjs");
const { effectModel } = await import("../../src/engine/effects.js");
const { worthSomething } = await import("../../src/engine/feat-abilities.js");
const { dangerFights, dangerSummary } = await import("../../src/engine/danger-scale.js");
const { powerFoes } = await import("../../src/engine/spell-power.js");

export const LEVELS = Object.freeze([1, 5, 11, 17]);
export const HOSTS = Object.freeze(["fighter", "rogue", "wizard", "cleric"]);
// (100 fights an encounter: each rating is the mean of many PCs and levels, so it's steady with fewer.)
const FIGHTS = Number(process.env.ANCESTRY_FIGHTS) || 100;
// (A heritage at two levels: its fights are twice an ancestry's, with its ancestry alone and with it.)
export const HERITAGE_LEVELS = Object.freeze([1, 11]);

const docs = (pack) => [...lib.docsOf(`${PACK_ROOT}/${pack}`).values()];
const byName = (pack) => new Map(docs(pack).map((doc) => [doc.name.toLowerCase(), doc]));
let cache = null;
const packs = () => (cache ??= {
    ancestries: docs("ancestries").filter((doc) => doc.type === "ancestry"),
    heritages: docs("heritages").filter((doc) => doc.type === "heritage"),
    backgrounds: docs("backgrounds").filter((doc) => doc.type === "background"),
    features: byName("ancestry-features"),
    feats: byName("feats")
});
const lastName = (uuid) => String(uuid ?? "").split(/\.Item\./).pop()?.toLowerCase() ?? "";

// --- What it changes on a PC ----------------------------------------------------

const SIZES = { tiny: "tiny", sm: "sm", med: "med", lg: "lg", huge: "huge", grg: "grg" };
const VISION = { darkvision: "darkvision", "low-light-vision": "low-light-vision" };
// A document's own rules as an always-on Effect model, or null when they hold nothing a fight counts (an open choice isn't the fight's).
function rulesModel(doc, level) {
    if (!(doc?.system?.rules ?? []).length) return null;
    const { choices, choiceByDegree, ...model } = effectModel(doc, { rank: level, actorLevel: level });
    return worthSomething(model) ? { ...model, rounds: Infinity } : null;
}
const withPassive = (c, model) => {
    if (model) c.passiveEffects = [...(c.passiveEffects ?? []), model];
};

// The ancestry on this PC: its Hit Points (for the human's 8), Speed, size, vision, traits, and its features' rules.
export function applyAncestry(c, ancestry, level) {
    const hp = Number(ancestry.system?.hp) || 8;
    c.hp = { value: c.hp.max + hp - 8, max: c.hp.max + hp - 8 };
    c.speed = Number(ancestry.system?.speed) || 25;
    const size = SIZES[ancestry.system?.size] ?? "med";
    if (size !== "med") c.size = size;
    const vision = VISION[ancestry.system?.vision];
    if (vision) c.senses = [...new Set([...(c.senses ?? []), vision])];
    c.traits = [...new Set([...(c.traits ?? []).filter((trait) => trait !== "human"), ...(ancestry.system?.traits?.value ?? [])])];
    const features = Object.values(ancestry.system?.items ?? {}).map((item) => packs().features.get(lastName(item.uuid))).filter(Boolean);
    for (const feature of features) withPassive(c, rulesModel(feature, level));
    withPassive(c, rulesModel(ancestry, level));
    return c;
}

// A heritage's rules on this PC (and a sense it names: Cavern Elf's darkvision is a rule; some carry a feature).
export function applyHeritage(c, heritage, level) {
    withPassive(c, rulesModel(heritage, level));
    for (const item of Object.values(heritage.system?.items ?? {})) withPassive(c, rulesModel(packs().features.get(lastName(item.uuid)), level));
    return c;
}

// --- The fights -------------------------------------------------------------------

function pairedResults(withIt, without, level) {
    const results = {};
    for (const kind of lib.KINDS) {
        const scaled = lib.scaleAt(level, kind);
        if (!scaled) return { error: `no scale for level ${level} ${kind}: run the feat scale phase first` };
        const foes = powerFoes(kind, level);
        const plain = without ? dangerSummary(dangerFights(without, foes, 0, FIGHTS, { grid: lib.GRID })).scores : scaled.scores.slice(0, FIGHTS);
        const fights = dangerSummary(dangerFights(withIt, foes, 0, FIGHTS, { grid: lib.GRID }));
        const diffs = fights.scores.map((score, index) => score - plain[index]);
        const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
        results[kind] = { delta: mean, levels: -mean / scaled.step, levelsSe: sd / Math.sqrt(diffs.length) / scaled.step };
    }
    const levels = lib.KINDS.reduce((sum, kind) => sum + results[kind].levels, 0) / lib.KINDS.length;
    const se = Math.sqrt(lib.KINDS.reduce((sum, kind) => sum + results[kind].levelsSe ** 2, 0)) / lib.KINDS.length;
    return { results, levels, se };
}

const findDoc = (list, id) => list.find((doc) => doc._id === id) ?? null;
// What a fight plays of a party (its traits aside, which no foe here reads): for "it changes nothing".
const fightSignature = (party) => JSON.stringify(party.map(({ traits, ...rest }) => rest));

export function ancestryTask(task) {
    const { ancestries, heritages } = packs();
    const party = partyFor(task.level);
    const head = { kind: task.kind, id: task.id, name: task.name, level: task.level, host: task.host };
    if (task.kind === "ancestry") {
        const ancestry = findDoc(ancestries, task.id);
        const withIt = structuredClone(party);
        applyAncestry(withIt.find((c) => c.id === task.host), ancestry, task.level);
        // (A human: the standard party itself.)
        if (fightSignature(withIt) === fightSignature(party)) return { ...head, levels: 0, se: 0, results: {}, same: true };
        return { ...head, ...pairedResults(withIt, null, task.level) };
    }
    // A heritage: on its ancestry's PC, against that ancestry alone.
    const heritage = findDoc(heritages, task.id);
    const ancestry = ancestries.find((doc) => doc.system?.slug === heritage.system?.ancestry?.slug) ?? ancestries.find((doc) => doc.name === "Human");
    const without = structuredClone(party);
    applyAncestry(without.find((c) => c.id === task.host), ancestry, task.level);
    const withIt = structuredClone(without);
    applyHeritage(withIt.find((c) => c.id === task.host), heritage, task.level);
    if (fightSignature(withIt) === fightSignature(without)) return { ...head, skipped: true, reason: "nothing a fight uses" };
    return { ...head, ancestry: ancestry.name, ...pairedResults(withIt, without, task.level) };
}

// --- An ancestry with its ancestry feats (2026-11-02, Cole: "rank ancestry power by including their ancestry feats") -------------

// The ancestry feat slots a PC has by a level: 1st, 5th, 9th, 13th and 17th.
// (2026-11-13, Cole: "rank the ancestry feats based on the ancestry Paragon rules". ANCESTRY_PARAGON=1: GM Core's Ancestry Paragon
// variant — two at 1st, then one at every odd level, 11 in all.)
export const PARAGON = process.env.ANCESTRY_PARAGON === "1";
export const ANCESTRY_FEAT_SLOTS = Object.freeze(PARAGON ? [1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19] : [1, 5, 9, 13, 17]);
let featRatings = null;
// The feat ratings' rated ancestry feats ({ name, level, levels }), best first: <out>/ratings.json, next to the scale. Only feats
// better than none beyond the noise (rating at least its standard error): a +0.01 within the noise, rated on the fighter, put a
// Strike or Rage feat on the wizard (Human's Multitalented, Dwarf's Clan's Edge) and cost it far more than the noise it won.
function ratedAncestryFeats(scalePath) {
    if (!featRatings) {
        const path = scalePath.replace(/scale\.jsonl$/, "ratings.json");
        featRatings = JSON.parse(fs.readFileSync(path, "utf8")).rated.filter((row) => row.category === "Ancestry" && row.levels > 0 && row.levels >= (row.se ?? 0)).sort((a, b) => b.levels - a.levels);
    }
    return featRatings;
}

// The ancestry's PC with the best of its feats the ratings found (by their rating, a slot at a time from the 1st, each feat of the slot's
// level or lower that this PC plays without a change of weapons; its prerequisites aside, a heritage's among them): { party, feats }.
export function ancestryWithFeats(ancestry, level, hostId, scalePath) {
    let party = structuredClone(partyFor(level));
    applyAncestry(party.find((c) => c.id === hostId), ancestry, level);
    const slug = ancestry.system?.slug ?? ancestry.name.toLowerCase();
    const candidates = ratedAncestryFeats(scalePath)
        .map((row) => ({ row, doc: packs().feats.get(row.name.toLowerCase()) }))
        .filter(({ doc }) => doc && (doc.system?.traits?.value ?? []).includes(slug));
    const used = new Set();
    const feats = [];
    for (const slot of ANCESTRY_FEAT_SLOTS.filter((each) => each <= level)) {
        for (const { row, doc } of candidates) {
            if (used.has(row.name) || row.level > slot) continue;
            used.add(row.name);
            const built = lib.partyWithFeat(doc, level, { hostId, party });
            if (built.skipped || built.loadout) continue;
            party = built.party;
            feats.push(row.name);
            break;
        }
    }
    return { party, feats };
}

function ancestryFeatsTask(task) {
    const ancestry = findDoc(packs().ancestries, task.id);
    const head = { kind: task.kind, id: task.id, name: task.name, level: task.level, host: task.host };
    const { party, feats } = ancestryWithFeats(ancestry, task.level, task.host, task.scalePath);
    // (No feat it plays here: the ancestry's own rating stands, the report takes it.)
    if (!feats.length) return { ...head, feats, noFeats: true };
    return { ...head, feats, ...pairedResults(party, null, task.level) };
}

// --- Backgrounds --------------------------------------------------------------------

// The skills a fight's basic actions use (Demoralize, Trip, Grapple, Shove, Feint, Tumble Through, Battle Medicine with its feat).
const COMBAT_SKILLS = new Set(["athletics", "intimidation", "deception", "acrobatics", "medicine"]);
const trainedAt = (level) => level + 2 + 1;

// The party with the background on its PC: { party, host, feats, skills }, or { skipped, reason }.
export function backgroundParty(background, level) {
    const { feats } = packs();
    const featDocs = Object.values(background.system?.items ?? {}).map((item) => feats.get(lastName(item.uuid))).filter(Boolean);
    // (Its skill feat, played as the feat ratings play it, on the PC they put it on; a feat that isn't simulated adds nothing.)
    let withIt = null;
    let host = null;
    const played = [];
    for (const feat of featDocs) {
        const built = lib.partyWithFeat(feat, level);
        if (built.skipped || built.plain) continue;
        withIt = built.party;
        host = built.host;
        played.push(feat.name);
        break;
    }
    const party = partyFor(level);
    withIt ??= structuredClone(party);
    // (Battle Medicine, which the feat module leaves to the simulator's own action — party.js gives the cleric it —: on a PC without it,
    // trained, at DC 15.)
    if (!played.length && featDocs.some((feat) => feat.name === "Battle Medicine")) {
        const medic = withIt.find((c) => !c.battleMedicine && c.id === "fighter") ?? withIt.find((c) => !c.battleMedicine);
        if (medic) {
            host = medic.id;
            medic.battleMedicine = { name: "Battle Medicine", modifier: medic.skills?.medicine ?? trainedAt(level), tiers: [{ dc: 15, bonus: 0 }] };
            played.push("Battle Medicine");
        }
    }
    const skills = (background.system?.trainedSkills?.value ?? []).filter((skill) => COMBAT_SKILLS.has(skill));
    const missing = (c) => skills.filter((skill) => !(skill in (c.skills ?? {}))).length;
    host ??= withIt.reduce((best, c) => (missing(c) > missing(best) ? c : best), withIt[0]).id;
    const pc = withIt.find((c) => c.id === host);
    for (const skill of skills) if (!(skill in (pc.skills ?? {}))) pc.skills = { ...(pc.skills ?? {}), [skill]: trainedAt(level) };
    withPassive(pc, rulesModel(background, level));
    if (fightSignature(withIt) === fightSignature(party)) return { host, skipped: true, reason: featDocs.length ? `its feat (${featDocs.map((feat) => feat.name).join(", ")}) isn't simulated, and nothing else a fight uses` : "nothing a fight uses" };
    return { party: withIt, host, feats: played, skills: skills.filter((skill) => !(skill in (party.find((c) => c.id === host).skills ?? {}))) };
}

// One set of backgrounds that come to the same party (the same feat, skills and rules): their fights once.
export function backgroundTask(task) {
    const { backgrounds } = packs();
    const background = findDoc(backgrounds, task.ids[0]);
    const built = backgroundParty(background, task.level);
    const head = { kind: "background", ids: task.ids, names: task.names, level: task.level, host: built.host };
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    return { ...head, feats: built.feats, skills: built.skills, ...pairedResults(built.party, null, task.level) };
}

// --- The tasks ---------------------------------------------------------------------

export function ancestryTasks(scalePath) {
    const { ancestries, heritages, backgrounds } = packs();
    const tasks = [];
    for (const doc of ancestries) for (const level of LEVELS) for (const host of HOSTS) tasks.push({ kind: "ancestry", id: doc._id, name: doc.name, level, host, scalePath });
    for (const doc of ancestries) for (const level of LEVELS) for (const host of HOSTS) tasks.push({ kind: "ancestry-feats", id: doc._id, name: doc.name, level, host, scalePath });
    for (const doc of heritages) for (const level of HERITAGE_LEVELS) for (const host of HOSTS) tasks.push({ kind: "heritage", id: doc._id, name: doc.name, level, host, scalePath });
    // (Backgrounds that come to the same party — Field Medic's and another's Battle Medicine and Medicine — share their fights; one with
    // nothing a fight uses is a task of its own that ends at once, with why.)
    for (const level of LEVELS) {
        const groups = new Map();
        for (const doc of backgrounds) {
            const built = backgroundParty(doc, level);
            const key = built.skipped ? `skip|${doc._id}` : fightSignature(built.party);
            const group = groups.get(key) ?? { kind: "background", ids: [], names: [], level, scalePath };
            group.ids.push(doc._id);
            group.names.push(doc.name);
            groups.set(key, group);
        }
        tasks.push(...groups.values());
    }
    return tasks;
}

export function runAncestryTask(task) {
    if (task.scalePath) lib.loadScaleOnce(task.scalePath);
    return task.kind === "background" ? backgroundTask(task) : task.kind === "ancestry-feats" ? ancestryFeatsTask(task) : ancestryTask(task);
}
