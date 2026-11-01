// The feat ratings (2026-11-01, the user: "integrate the feat module into the combat simulator … then rate how effective every feat and
// action is in combat"; their pick for the method: "Whole fights, with vs without"). The worker side of tools/feat-power.mjs.
//   A feat: the feat module (pf2e-automatic-feat-resolution) compiles it with the numbers of the standard party's PC who'd have it
//   (src/engine/party.js: the fighter, rogue, wizard or cleric; hostFor), at the feat's level; src/engine/feat-abilities.js turns the plan
//   into what that PC plays. The party then fights a moderate boss (one creature 2 levels up) and a moderate group (four 2 levels down) on
//   the same seeds with the feat and without it, fighting to the end (no morale, no retreat). A fight's score is the danger scale's
//   (src/engine/danger-scale.js: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe).
//   In levels: the scale's own step there — the same party against those foes a level up and a level down (the "scale" phase) —, so +0.5
//   means having the feat is like fighting foes half a level lower.
//   A basic action (Demoralize, Trip …): the other way round, every PC without it.
import fs from "node:fs";

const SIBLING = (names) => {
    for (const name of names) {
        const url = new URL(`../../../${name}/`, import.meta.url);
        if (fs.existsSync(url)) return url;
    }
    return null;
};
const FEAT_ROOT = process.env.FEAT_MODULE ? new URL(`file://${process.env.FEAT_MODULE.replace(/\/?$/, "/")}`) : SIBLING(["pf2e-automatic-feat-resolution", "PF2e AUTOMATIC FEAT RESOLUTION"]);
if (!FEAT_ROOT) throw new Error("The feat module's repository wasn't found beside the simulator's (pf2e-automatic-feat-resolution); set FEAT_MODULE to its folder.");
const ITEM_ROOT = SIBLING(["pf2e-automatic-item-resolution", "PF2e AUTOMATIC ITEM RESOLUTION"]);

const { readDocuments, basicActions, PACK_ROOT } = await import("./pack-creatures.mjs");
const { partyFor } = await import("./deadliness.mjs");
const { compileFeat } = await import(new URL("src/compiler/index.js", FEAT_ROOT).href);
const itemReaders = ITEM_ROOT ? await (async () => {
    try {
        const [move, rerolls, spend, fortune] = await Promise.all(["move", "rerolls", "spend", "fortune"].map((name) => import(new URL(`src/compiler/${name}.js`, ITEM_ROOT).href)));
        return { movePlan: move.movePlan, rerollPlan: rerolls.rerollPlan, withSpend: spend.withSpend, rollTwicePlan: fortune.rollTwicePlan };
    } catch {
        return null;
    }
})() : null;
const { featEntries, featInfo, meetsWielding, withResolvedEffects } = await import("../../src/engine/feat-abilities.js");
const { effectModel } = await import("../../src/engine/effects.js");
const { addBuiltin } = await import("../../src/engine/abilities.js");
const { dangerFights, dangerSummary, DANGER_OPTIONS, DEATH_WEIGHT } = await import("../../src/engine/danger-scale.js");
const { powerFoes } = await import("../../src/engine/spell-power.js");
const { simulate } = await import("../../src/engine/fight.js");
const { DEVIANT, deviantFields } = await import("../../src/engine/deviant.js");

const MODULES = `${process.env.HOME}/.local/share/FoundryVTT/Data/modules`;
export const KINDS = Object.freeze(["boss", "group"]);
export const FIGHTS = Number(process.env.FEAT_FIGHTS) || 200;
// (2026-11-01, the user: "the combat simulator should be able to do grid based simulations, it should not be abstract": the fights on the
// square grid, an open field — FEAT_GRID=corridor, doorway or bridge for another, FEAT_GRID=none for the range bands.)
export const GRID = process.env.FEAT_GRID === "none" ? null : process.env.FEAT_GRID || "open";
// (Fights logged to count how often the PC uses the feat.)
const LOGGED = 12;

// --- The feats ------------------------------------------------------------------

// The feat and action compendiums: PF2e's, and the installed modules' Item packs of feats and actions (Teams+ and the like; not SF2e's).
export function featSources() {
    const sources = ["feats", "actions"].map((pack) => ({ source: "pf2e", pack, path: `${PACK_ROOT}/${pack}` })).filter((entry) => fs.existsSync(entry.path));
    let mods = [];
    try {
        mods = fs.readdirSync(MODULES);
    } catch {
        mods = [];
    }
    for (const mod of mods.filter((name) => !/^sf2e/.test(name) && !/^pf2e-automatic|^pf2e-resolution|^pf2e-combat-simulator/.test(name))) {
        let manifest;
        try {
            manifest = JSON.parse(fs.readFileSync(`${MODULES}/${mod}/module.json`, "utf8"));
        } catch {
            continue;
        }
        for (const pack of (manifest.packs ?? []).filter((entry) => entry.type === "Item" && entry.system !== "sf2e")) sources.push({ source: mod, pack: `${mod}/${pack.name}`, path: `${MODULES}/${mod}/${pack.path}` });
    }
    return sources;
}

const docsCache = new Map();
export function docsOf(path) {
    if (!docsCache.has(path)) {
        let docs = [];
        try {
            docs = readDocuments(path).filter((doc) => doc.collection === "items");
        } catch {
            docs = [];
        }
        docsCache.set(path, new Map(docs.map((doc) => [doc._id, doc])));
    }
    return docsCache.get(path);
}

// Every feat and action to rate: { ref, source, pack, path, id, name, level, category, actionType }.
export function featRefs() {
    const refs = [];
    for (const { source, pack, path } of featSources()) {
        for (const doc of docsOf(path).values()) {
            if (!["feat", "action"].includes(doc.type)) continue;
            refs.push({ ref: `${source}:${pack}:${doc._id}`, source, pack, path, id: doc._id, name: doc.name, level: Number(doc.system?.level?.value ?? 0) || 0, category: doc.system?.category ?? doc.type, actionType: doc.system?.actionType?.value ?? "passive", traits: [...(doc.system?.traits?.value ?? [])] });
        }
    }
    return refs;
}

// --- Effects by uuid or name ----------------------------------------------------

const EFFECT_PACKS = ["feat-effects", "spell-effects", "other-effects", "equipment-effects", "bestiary-effects", "campaign-effects"];
const effectsById = new Map();
const effectsByName = new Map();
for (const pack of EFFECT_PACKS) {
    for (const doc of docsOf(`${PACK_ROOT}/${pack}`).values()) {
        if (doc.type !== "effect") continue;
        effectsById.set(doc._id, doc);
        effectsByName.set(doc.name.toLowerCase(), doc);
    }
}
for (const { path } of featSources().filter((entry) => entry.source !== "pf2e")) for (const doc of docsOf(path).values()) if (doc.type === "effect") effectsById.set(doc._id, doc);
const conditionNames = new Map([...docsOf(`${PACK_ROOT}/conditions`).values()].map((doc) => [doc._id, doc.system?.slug ?? doc.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;

// An effect's document from its UUID, by id ("Compendium.pf2e.feat-effects.Item.<id>") or by name, the feat module's ("…Item.Stance: Disarming
// Stance").
export function effectDoc(uuid) {
    const last = String(uuid ?? "").split(/\.Item\./).pop() ?? "";
    return effectsById.get(last) ?? effectsByName.get(last.toLowerCase()) ?? effectsByName.get(`effect: ${last.toLowerCase()}`) ?? null;
}
const resolveUuid = (uuid) => {
    const doc = effectDoc(uuid);
    return doc ? `Compendium.pf2e.feat-effects.Item.${doc._id}` : null;
};
function helpersAt(level) {
    return {
        effectModels: (plan) => {
            const uuids = [...(plan?.resolution?.applications ?? []).map((application) => application?.uuid), ...Object.values(plan?.resolution?.outcomes ?? {}).flatMap((row) => (row?.nativeEffects ?? []).map((native) => native?.uuid))].filter(Boolean);
            return Object.fromEntries(uuids.map((uuid) => [uuid, effectDoc(uuid)]).filter(([, doc]) => doc).map(([uuid, doc]) => [uuid, effectModel(doc, { rank: level, conditionSlug })]));
        },
        rulesModel: (effect) => effectModel({ name: effect.name, type: "effect", system: { rules: effect.rules ?? [], duration: effect.duration ?? { value: -1, unit: "unlimited" } } }, { rank: level, conditionSlug }),
        passiveModel: (uuid) => {
            const doc = effectDoc(uuid);
            return doc ? effectModel(doc, { rank: level, conditionSlug }) : null;
        }
    };
}

// --- Who has it -----------------------------------------------------------------

// A class's stand-in in the standard party: its own PC, or the one closest to how it fights.
const HOSTS = {
    fighter: "fighter", barbarian: "fighter", champion: "fighter", monk: "fighter", ranger: "fighter", gunslinger: "fighter", inventor: "fighter", thaumaturge: "fighter", exemplar: "fighter", guardian: "fighter", commander: "fighter", magus: "fighter", kineticist: "fighter",
    rogue: "rogue", swashbuckler: "rogue", investigator: "rogue", alchemist: "rogue",
    wizard: "wizard", sorcerer: "wizard", witch: "wizard", psychic: "wizard", summoner: "wizard", bard: "wizard",
    cleric: "cleric", druid: "cleric", oracle: "cleric", animist: "cleric"
};
const ABILITIES = {
    fighter: (k, minor) => ({ str: k, dex: 0, con: 2, int: 0, wis: minor, cha: 0 }),
    rogue: (k, minor) => ({ str: 1, dex: k, con: 1, int: 0, wis: minor, cha: k >= 5 ? 3 : 2 }),
    wizard: (k, minor) => ({ str: 0, dex: 2, con: 1, int: k, wis: minor, cha: 0 }),
    cleric: (k) => ({ str: 1, dex: 2, con: 1, int: 0, wis: k, cha: 1 })
};
// What each PC wields and wears (src/engine/party.js), for a feat's requirement about it.
const WIELDS = {
    fighter: { twoHanded: true, oneHanded: false, twoWeapons: false, freeHand: false, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "heavy", damage: ["slashing", "piercing"], groups: ["sword"] },
    rogue: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "light", damage: ["piercing"], groups: ["sword"] },
    wizard: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "unarmored", damage: ["bludgeoning"], groups: ["club"] },
    cleric: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "light", damage: ["bludgeoning"], groups: ["club"] }
};
export const requirementText = (doc) => /<strong>\s*Requirements?\s*<\/strong>\s*([^<]*)/i.exec(doc.system?.description?.value ?? "")?.[1]?.trim() ?? null;
const key = (level) => (level >= 20 ? 7 : level >= 17 ? 6 : level >= 10 ? 5 : 4);

// The PC's numbers as the feat module's compiler reads a character's (its scripts/character.js characterDCs).
export function dcsOf(c) {
    const level = c.level;
    const spellDC = (c.spells ?? []).find((entry) => !entry.kind && Number.isFinite(entry.dc))?.dc ?? null;
    const tradition = (c.spells ?? []).find((entry) => !entry.kind && entry.tradition)?.tradition ?? null;
    const abilities = ABILITIES[c.id]?.(key(level), level >= 10 ? 2 : 1) ?? {};
    const melee = (c.strikes ?? []).find((strike) => strike.melee);
    const proficiency = melee ? melee.bonus - (c.id === "rogue" ? abilities.dex : abilities.str) - (melee.potency ?? 0) : level + 2;
    return {
        level,
        class: Number.isFinite(c.classDC) ? c.classDC : null,
        spell: spellDC,
        perception: 10 + (c.perception ?? 0),
        byClass: {},
        byTradition: spellDC && tradition ? { [tradition]: spellDC } : {},
        statistics: Object.fromEntries(Object.entries(c.skills ?? {}).map(([slug, mod]) => [slug, 10 + mod])),
        abilities,
        attacks: { spell: spellDC ? spellDC - 10 : null, strikes: (c.strikes ?? []).map((strike) => ({ group: strike.iwr?.group ?? null, ranged: !strike.melee, mod: strike.bonus })), proficiency: { simple: proficiency, martial: proficiency, unarmed: proficiency, advanced: proficiency - 2 } }
    };
}

// The skill a plan's check or save uses, when it's a skill.
const SKILLS = new Set(["acrobatics", "arcana", "athletics", "crafting", "deception", "diplomacy", "intimidation", "medicine", "nature", "occultism", "performance", "religion", "society", "stealth", "survival", "thievery"]);
const planSkill = (plan) => {
    const statistic = plan?.resolution?.check?.statistic ?? plan?.resolution?.check?.skill ?? null;
    return SKILLS.has(statistic) ? statistic : null;
};

const clone = (value) => structuredClone(value);
// Builtin fields joined onto a combatant: lists added to, objects merged, the rest set.
function joinBuiltins(c, builtins) {
    for (const [field, value] of Object.entries(builtins)) {
        if (Array.isArray(value)) c[field] = [...(c[field] ?? []), ...value];
        else if (value && typeof value === "object" && c[field] && typeof c[field] === "object" && !Array.isArray(c[field])) c[field] = { ...c[field], ...value };
        else c[field] = value;
    }
}

// An action's own PF2e Effect on its user (system.selfEffect), as the live snapshot reads it: a stance or a buff, or null.
function selfEffectEntry(doc, level, builtins, wields) {
    const uuid = doc.system?.selfEffect?.uuid;
    const type = doc.system?.actionType?.value;
    if (!uuid || !["action", "free"].includes(type)) return null;
    // (Its requirement, Mountain Stance's "You are unarmored": what the PC wears and wields meets it, or it isn't played.)
    const requirement = requirementText(doc);
    if (requirement && meetsWielding(requirement, wields) !== true) return meetsWielding(requirement, wields) === false ? { unmet: requirement } : null;
    if (type === "free" && /<strong>\s*(?:Trigger|Requirements?)\s*<\/strong>/i.test(doc.system?.description?.value ?? "")) return null;
    const effect = effectDoc(uuid);
    if (!effect) return null;
    const model = effectModel(effect, { rank: level, conditionSlug });
    if (!(model.modifiers.length || model.tempHp || model.fastHealing || model.resistances.length || model.conditions.length || model.strikeParts)) return null;
    const stance = (doc.system?.traits?.value ?? []).includes("stance");
    addBuiltin(builtins, { builtin: "self-effect", actions: type === "free" ? 0 : Number(doc.system?.actions?.value) || 1, stance, model }, doc.name);
    return { spells: [], pools: {}, gap: null, played: stance ? "PF2e's stance Effect" : "PF2e's self Effect" };
}

// The party with the feat on its PC, or { skipped, reason }.
export function partyWithFeat(doc, level) {
    const party = partyFor(level);
    const classTrait = (doc.system?.traits?.value ?? []).find((trait) => HOSTS[trait]);
    const compileFor = (host) => {
        try {
            return { plan: compileFeat(doc, { dcs: dcsOf(host), basicActions, itemReaders }) };
        } catch (error) {
            return { error: error.message };
        }
    };
    let host = party.find((c) => c.id === (classTrait ? HOSTS[classTrait] : "fighter"));
    let compiled = compileFor(host);
    // (A feat of no class: the PC best at the skill its check uses.)
    if (!classTrait && planSkill(compiled.plan)) {
        const skill = planSkill(compiled.plan);
        const best = party.reduce((top, c) => ((c.skills?.[skill] ?? -99) > (top.skills?.[skill] ?? -99) ? c : top), host);
        if (best !== host) {
            host = best;
            compiled = compileFor(host);
        }
    }
    if (compiled.error) return { skipped: true, reason: `compile error: ${compiled.error}`, host: host.id };
    const plan = withResolvedEffects(compiled.plan, resolveUuid);
    // Its entries with what the PC wields: the party's own, or (a requirement it doesn't meet — Double Slice's two weapons) a loadout that does,
    // the plain party then fought with the same loadout.
    const attempt = (wields) => {
        const builtins = {};
        let entries = featEntries(plan, featInfo(doc, level), builtins, { ...helpersAt(level), meets: (text) => meetsWielding(text, wields) });
        // (What the feat module leaves, PF2e's own Effect an action links for its user — Dragon Stance's —: as the live snapshot plays it,
        // scripts/snapshot.js readSelfEffects.)
        if (entries.gap) {
            const own = selfEffectEntry(doc, level, builtins, wields);
            if (own?.unmet) entries = { ...entries, gap: { ...entries.gap, name: `${doc.name}: its requirement, which the PC doesn't meet (${own.unmet})` } };
            else if (own) entries = own;
        }
        // (A requirement on what the PC wields the plan doesn't carry — Dueling Dance's "a single one-handed melee weapon and nothing else in
        // your hands", a stance's —: the feat's own text, so the PC that can't use it gets the loadout that can, both sides.)
        const required = requirementText(doc);
        if (!entries.gap && plan?.builtin !== "strike-activity" && required && meetsWielding(required, wields) === false) {
            entries = { ...entries, gap: { kind: "feat, not simulated", name: `${doc.name}: its requirement, which the PC doesn't meet (${required})` } };
        }
        return { entries, builtins };
    };
    let tried = attempt(WIELDS[host.id]);
    let base = party;
    let loadout = null;
    if (tried.entries.gap && /doesn't meet/.test(tried.entries.gap.name)) {
        for (const [name, way] of Object.entries(LOADOUTS)) {
            if (!way.hosts.includes(host.id)) continue;
            const again = attempt({ ...WIELDS[host.id], ...way.wields });
            if (again.entries.gap) continue;
            tried = again;
            loadout = name;
            base = clone(party);
            const pc = base.find((c) => c.id === host.id);
            pc.strikes = way.strikes(pc.strikes);
            break;
        }
    }
    const { entries, builtins } = tried;
    if (entries.gap) return { skipped: true, reason: entries.gap.name.slice(doc.name.length + 2), host: host.id };
    const withFeat = clone(base);
    const pc = withFeat.find((c) => c.id === host.id);
    pc.spells = [...(pc.spells ?? []), ...entries.spells];
    pc.spellPools = { ...(pc.spellPools ?? {}), ...entries.pools };
    joinBuiltins(pc, builtins);
    return { party: withFeat, ...(loadout ? { plain: base, loadout } : {}), host: host.id, played: entries.played, situational: Boolean(entries.situational), plan };
}

// Loadouts for a feat's requirement the party's own weapons don't meet: the PC's main weapon changed for others of the same runes.
const oneHanded = (strike, name, die, extra = {}) => ({ ...strike, name, hands: 1, versatile: undefined, damage: strike.damage.map((part, index) => (index === 0 ? { ...part, die } : part)), ...extra });
const LOADOUTS = {
    "two weapons (longsword and shortsword)": { hosts: ["fighter", "rogue"], wields: { twoHanded: false, oneHanded: true, twoWeapons: true, freeHand: false, damage: ["slashing", "piercing"] }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), oneHanded(strikes[0], "Shortsword", 6, { agile: true, finesse: true, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 6, type: "piercing" } : part)) }), ...strikes.slice(1)] },
    "a one-handed weapon and a free hand": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: true }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), ...strikes.slice(1)] },
    "a bow in hand": { hosts: ["fighter", "rogue"], wields: { ranged: true, reload0: true, twoHanded: false, freeHand: false }, strikes: (strikes) => [...strikes.filter((strike) => !strike.melee), ...strikes.filter((strike) => strike.melee)] }
};

// --- The fights -----------------------------------------------------------------

export const partyLevelOf = (level) => Math.max(1, Math.min(20, Number(level) || 1));

// The scale at a level for an encounter: the plain party's scores on seeds [0, FIGHTS), and against foes a level up and a level down.
export function scaleTask({ level, encounter: kind }) {
    const party = partyFor(level);
    const base = dangerSummary(dangerFights(party, powerFoes(kind, level), 0, FIGHTS, { grid: GRID }));
    const up = dangerSummary(dangerFights(party, powerFoes(kind, level + 1), 0, FIGHTS, { grid: GRID }));
    const down = dangerSummary(dangerFights(party, powerFoes(kind, level - 1), 0, FIGHTS, { grid: GRID }));
    return { kind: "scale", level, encounter: kind, base: base.score, scores: base.scores, up: up.score, down: down.score, step: Math.max(0.02, (up.score - down.score) / 2), rounds: base.rounds };
}

let scale = null;
// (The step smoothed over the levels around — two either side —: one level's own is noisy, and at 1st level the group's foes can't go a
// level lower, the tables ending at −1.)
export function smoothedScale(rows) {
    const out = new Map();
    for (const row of rows) {
        const near = rows.filter((other) => other.encounter === row.encounter && Math.abs(other.level - row.level) <= 2);
        out.set(`${row.level}|${row.encounter}`, { ...row, rawStep: row.step, step: Math.max(0.05, near.reduce((sum, other) => sum + other.step, 0) / near.length) });
    }
    return out;
}
export function loadScale(path) {
    scale = smoothedScale(fs.readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)));
}

// How often the PC uses it in a fight, from a few logged fights: the log lines that name it.
function usesPerFight(party, foes, name) {
    let uses = 0;
    // (Not \b: a name that ends in "!" or "?" — Do You Know Who I Am?, To Me! — has no word boundary after it.)
    const pattern = new RegExp(`(?<![\\w'])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w'])`);
    for (let seed = 0; seed < LOGGED; seed++) {
        const result = simulate({ combatants: [...party, ...foes] }, { ...DANGER_OPTIONS, ...(GRID ? { grid: GRID } : {}) }, seed, { log: true });
        uses += (result.log ?? []).filter((line) => pattern.test(typeof line === "string" ? line : line?.text ?? "")).length;
    }
    return uses / LOGGED;
}

// One feat: its rows for the boss and the group, paired with the scale's plain fights.
export function featTask(task) {
    const doc = docsOf(task.ref.path).get(task.ref.id);
    if (!doc) return { ...task, skipped: true, reason: "not found" };
    const level = partyLevelOf(task.ref.level);
    const built = partyWithFeat(doc, level);
    const head = { kind: "feat", ref: task.ref, name: doc.name, level, host: built.host, ...(built.loadout ? { loadout: built.loadout } : {}) };
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    const results = {};
    for (const kind of KINDS) {
        const scaled = scale?.get(`${level}|${kind}`);
        if (!scaled) return { ...head, error: `no scale for level ${level} ${kind}: run the scale phase first` };
        const foes = powerFoes(kind, level);
        // (With a loadout of its own: the plain party with that loadout too, on the same seeds; the scale's step.)
        const plain = built.plain ? { ...scaled, scores: dangerSummary(dangerFights(built.plain, foes, 0, FIGHTS, { grid: GRID })).scores } : scaled;
        const fights = dangerSummary(dangerFights(built.party, foes, 0, FIGHTS, { grid: GRID }));
        const diffs = fights.scores.map((score, index) => score - plain.scores[index]);
        const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
        results[kind] = { score: fights.score, delta: mean, se: sd / Math.sqrt(diffs.length), levels: -mean / plain.step, levelsSe: sd / Math.sqrt(diffs.length) / plain.step, uses: usesPerFight(built.party, foes, doc.name) };
    }
    const levels = KINDS.reduce((sum, kind) => sum + results[kind].levels, 0) / KINDS.length;
    const se = Math.sqrt(KINDS.reduce((sum, kind) => sum + results[kind].levelsSe ** 2, 0)) / KINDS.length;
    return { ...head, played: built.played, situational: built.situational, results, levels, se };
}

// A basic action: every PC without it, at the levels it's rated at (BASIC_LEVELS).
export const BASIC_LEVELS = Object.freeze([1, 5, 10, 15, 20]);
export function basicTask(task) {
    const rows = {};
    for (const level of BASIC_LEVELS) {
        const party = clone(partyFor(level)).map((c) => ({ ...c, spells: (c.spells ?? []).filter((entry) => !(entry.kind === "basic" && (entry.plan?.source?.slug === task.slug || entry.name === task.name))) }));
        for (const kind of KINDS) {
            const plain = scale?.get(`${level}|${kind}`);
            if (!plain) return { ...task, error: `no scale for level ${level} ${kind}` };
            const fights = dangerSummary(dangerFights(party, powerFoes(kind, level), 0, FIGHTS, { grid: GRID }));
            const diffs = plain.scores.map((score, index) => score - fights.scores[index]);
            const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
            const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
            rows[`${level}|${kind}`] = { delta: mean, levels: -mean / plain.step, levelsSe: sd / Math.sqrt(diffs.length) / plain.step, uses: usesPerFight(partyFor(level), powerFoes(kind, level), task.name) };
        }
    }
    const values = Object.values(rows);
    const levels = values.reduce((sum, row) => sum + row.levels, 0) / values.length;
    const se = Math.sqrt(values.reduce((sum, row) => sum + row.levelsSe ** 2, 0)) / values.length;
    return { kind: "basic", name: task.name, slug: task.slug, rows, levels, se };
}

export const basicActionList = () => Object.entries(basicActions).filter(([, plan]) => plan).map(([slug, plan]) => ({ slug, name: plan.source?.name ?? slug }));

// --- Deviant abilities (2026-11-01, the user: "make all deviant abilities and their backlashes work in the simulator and rank them") ---
// Each deviant feat on the fighter (its deviation DC the higher of its class and spell DCs): plain at the feat's level, then without its
// backlash (what the backlash costs), then each awakening alone at the level Awakened Power (4th) or Greater Awakened Power (10th) brings
// it, against the plain feat there. A feat that needs a free hand: the fighter with a one-handed weapon and a free hand, both sides.
export function deviantList() {
    const out = [];
    for (const ref of featRefs()) {
        const doc = docsOf(ref.path).get(ref.id);
        if (!(doc?.system?.traits?.value ?? []).includes("deviant") || ref.source !== "pf2e") continue;
        const slug = (doc.name ?? "").toLowerCase().replace(/\(deviant\)/, "deviant").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const entry = DEVIANT[slug];
        if (!entry) continue;
        const level = partyLevelOf(doc.system?.level?.value);
        const awakenAt = Math.max(level, level <= 4 ? 4 : 10);
        out.push({ name: doc.name, slug, level, variant: "plain", awakenings: [] });
        out.push({ name: doc.name, slug, level, variant: "no backlash", awakenings: [], noBacklash: true });
        for (const key of entry.awakenings) out.push({ name: doc.name, slug, level: awakenAt, variant: `awakening: ${key}`, awakenings: [key], against: true });
    }
    return out;
}

export function deviantParty(task, awakenings, { noBacklash = false, hand = false } = {}) {
    const party = partyFor(task.level);
    const host = party.find((c) => c.id === "fighter");
    const dcs = dcsOf(host);
    const dc = Math.max(dcs.class ?? 0, dcs.spell ?? 0) || 10 + task.level + 4;
    const made = deviantFields(task.slug, task.level, dc, awakenings);
    if (made.gap) return { skipped: true, reason: made.gap };
    // (Or the plain feat it's measured against needed one: the same loadout, so the weapons aren't what's measured.)
    const needsHand = (hand || (made.fields.spells ?? []).some((entry) => entry.deviantRequires === "free hand")) && !WIELDS.fighter.freeHand;
    const base = needsHand ? clone(party) : party;
    if (needsHand) {
        const pc = base.find((c) => c.id === "fighter");
        pc.strikes = LOADOUTS["a one-handed weapon and a free hand"].strikes(pc.strikes);
    }
    const withIt = clone(base);
    const pc = withIt.find((c) => c.id === "fighter");
    joinBuiltins(pc, made.fields);
    if (noBacklash) pc.noBacklash = true;
    return { party: withIt, plain: needsHand ? base : null, played: made.played, loadout: needsHand ? "a one-handed weapon and a free hand" : null };
}

// (2026-11-01, the user: "the backlashes can be devastating" — a day of fights: DAY fights in a row on seeds DAY·d … DAY·d + DAY − 1, the
// fighter's deviation carried from one to the next (its flat-check DC, its backlash so far, spent or not, and what outlasts a fight —
// deviant.js lastingBacklash); Hit Points fresh each fight, as after a rest. The scores, a fight each, as dangerFights'.)
export const DAY = 4;
function dayFights(party, foes, count, { log = false } = {}) {
    const partyHp = party.reduce((sum, c) => sum + c.hp.max, 0);
    const scores = [];
    let uses = 0;
    let backlashes = 0;
    let severe = 0;
    let carried = null;
    for (let seed = 0; seed < count; seed++) {
        if (seed % DAY === 0) carried = null;
        const today = carried ? party.map((c) => (c.id === "fighter" ? { ...c, deviationCarried: carried } : c)) : party;
        const result = simulate({ combatants: [...today, ...foes] }, { ...DANGER_OPTIONS, ...(GRID ? { grid: GRID } : {}) }, seed, log ? { log: true } : undefined);
        const damage = ((result.damageBy?.foes ?? 0) + (result.damageBy?.foesInduced ?? 0)) / partyHp;
        const score = damage + 0.25 * result.party.filter((c) => c.down).length + DEATH_WEIGHT * result.party.filter((c) => c.dead).length + (result.outcome === "defeat" ? 1 : 0);
        scores.push(Math.round(score * 1000) / 1000);
        carried = result.party.find((c) => c.id === "fighter")?.deviation ?? carried;
        if (log) for (const line of result.log ?? []) {
            const text = typeof line === "string" ? line : line?.text ?? "";
            if (/^\s+Fighter (?:uses|suffers) /.test(text)) {
                if (/suffers \w+ backlash/.test(text)) {
                    backlashes++;
                    if (/suffers severe/.test(text)) severe++;
                } else if (log.test(text)) uses++;
            }
        }
    }
    return { scores, uses: uses / count, backlashes: backlashes / count, severe: severe / count };
}

export function deviantTask(task) {
    const head = { kind: "deviant", name: task.name, slug: task.slug, level: task.level, variant: task.variant, host: "fighter" };
    // (An awakening: against the plain feat at that level, on the same loadout.)
    let against = task.against ? deviantParty(task, []) : null;
    const built = deviantParty(task, task.awakenings, { noBacklash: task.noBacklash, hand: !!against?.loadout });
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    if (against && !against.skipped && built.loadout && !against.loadout) against = deviantParty(task, [], { hand: true });
    // (An awakening that changes nothing a fight plays — moving creatures about, senses, out-of-fight uses.)
    if (against && !against.skipped && JSON.stringify(against.party) === JSON.stringify(built.party)) return { ...head, skipped: true, reason: "the awakening only does what a fight here doesn't play" };
    const results = {};
    for (const kind of KINDS) {
        const scaled = scale?.get(`${task.level}|${kind}`);
        if (!scaled) return { ...head, error: `no scale for level ${task.level} ${kind}` };
        const foes = powerFoes(kind, task.level);
        // (Days of fights, both sides: the plain feat's days when it's an awakening, the plain party's fights otherwise.)
        const plainScores = against && !against.skipped ? dayFights(against.party, foes, FIGHTS).scores : built.plain ? dangerSummary(dangerFights(built.plain, foes, 0, FIGHTS, { grid: GRID })).scores : scaled.scores;
        const pattern = new RegExp(`(?<![\\w'])${task.name.replace(/\s*\(Deviant\)/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
        // (Uses, backlashes and severe ones a fight, read from the logs of every fight.)
        const fights = dayFights(built.party, foes, FIGHTS, { log: pattern });
        const diffs = fights.scores.map((score, index) => score - plainScores[index]);
        const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
        results[kind] = { delta: mean, levels: -mean / scaled.step, levelsSe: sd / Math.sqrt(diffs.length) / scaled.step, uses: fights.uses, backlashes: fights.backlashes, severe: fights.severe, score: fights.scores.reduce((sum, value) => sum + value, 0) / fights.scores.length, plainScore: plainScores.reduce((sum, value) => sum + value, 0) / plainScores.length };
    }
    const levels = KINDS.reduce((sum, kind) => sum + results[kind].levels, 0) / KINDS.length;
    const se = Math.sqrt(KINDS.reduce((sum, kind) => sum + results[kind].levelsSe ** 2, 0)) / KINDS.length;
    return { ...head, played: built.played, ...(built.loadout ? { loadout: built.loadout } : {}), results, levels, se };
}

export async function runFeatTask(task) {
    if (task.kind === "scale") return scaleTask(task);
    if (task.scalePath && !scale) loadScale(task.scalePath);
    if (task.kind === "basic") return basicTask(task);
    if (task.kind === "deviant") return deviantTask(task);
    return featTask(task);
}
