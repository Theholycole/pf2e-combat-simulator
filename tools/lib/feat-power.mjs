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
import { createHash } from "node:crypto";

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
const { partyFor, classPartyFor, classesPartyFor } = await import("./deadliness.mjs");
const { CLASS_SLUGS, classArmor, seatOf } = await import("../../src/engine/classes.js");
const { withCompanion, mountUp, companionStats } = await import("../../src/engine/companions.js");
const { compileFeat } = await import(new URL("src/compiler/index.js", FEAT_ROOT).href);
export const itemReaders = ITEM_ROOT ? await (async () => {
    try {
        const [move, rerolls, spend, fortune] = await Promise.all(["move", "rerolls", "spend", "fortune"].map((name) => import(new URL(`src/compiler/${name}.js`, ITEM_ROOT).href)));
        return { movePlan: move.movePlan, rerollPlan: rerolls.rerollPlan, withSpend: spend.withSpend, rollTwicePlan: fortune.rollTwicePlan };
    } catch {
        return null;
    }
})() : null;
const { featEntries, featInfo, meetsWielding, pcNeeds, requiredEffectFeat, requiredStances, withResolvedEffects, worthSomething } = await import("../../src/engine/feat-abilities.js");
const { effectModel } = await import("../../src/engine/effects.js");
const { zoneSpell } = await import("../../src/engine/zones.js");
// (2026-11-03: a spell entry a feat gives only when the engine can cast it at all — Hymn of Healing's, Mantis Form's aren't.)
const { canCast } = await import("../../src/engine/spells.js");
const castable = (entry) => canCast({ cond: {}, hindrances: [], spellPools: entry.pool ? { [entry.pool]: 99 } : {} }, entry);
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
        for (const pack of (manifest.packs ?? []).filter((entry) => entry.type === "Item" && entry.system !== "sf2e")) {
            sources.push({ source: mod, pack: `${mod}/${pack.name}`, path: `${MODULES}/${mod}/${pack.path}` });
            PACK_COLLECTIONS.set(`${MODULES}/${mod}/${pack.path}`, `${mod}.${pack.name}`);
        }
    }
    return sources;
}

// (2026-11-03: the compendium each pack is in Foundry — "pf2e.feats-srd", "pf2e.actionspf2e", "<module>.<pack>" —, so a document gets the
// sourceId a world item has. The feat module looks its hand-written plans up by it (src/plans/index.js handEntry); without it the simulator
// never saw any of them — Dual-Weapon Blitz's two Strikes, Deadly Aim's penalty and damage — and read the text alone.)
const PF2E_COLLECTIONS = { feats: "pf2e.feats-srd", actions: "pf2e.actionspf2e" };
const PACK_COLLECTIONS = new Map();
const collectionOf = (path) => {
    if (PACK_COLLECTIONS.has(path)) return PACK_COLLECTIONS.get(path);
    const pf2e = /\/systems\/pf2e\/packs\/(\w+)$/.exec(path);
    return pf2e ? PF2E_COLLECTIONS[pf2e[1]] ?? null : null;
};
const docsCache = new Map();
export function docsOf(path) {
    if (!docsCache.has(path)) {
        let docs = [];
        try {
            const collection = collectionOf(path);
            docs = readDocuments(path).filter((doc) => doc.collection === "items").map((doc) => (collection && !doc.sourceId ? { ...doc, sourceId: `Compendium.${collection}.Item.${doc._id}` } : doc));
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
const pf2eEffectNamed = (name) => (process.env.FEAT_PF2E_EFFECT === "0" ? null : ["stance", "effect"].map((prefix) => effectsByName.get(`${prefix}: ${String(name ?? "").toLowerCase()}`)).find(Boolean) ?? null);
const resolveUuid = (uuid) => {
    const doc = effectDoc(uuid);
    return doc ? `Compendium.pf2e.feat-effects.Item.${doc._id}` : null;
};
function helpersAt(level) {
    return {
        effectModels: (plan) => {
            const uuids = [...(plan?.resolution?.applications ?? []).map((application) => application?.uuid), ...Object.values(plan?.resolution?.outcomes ?? {}).flatMap((row) => (row?.nativeEffects ?? []).map((native) => native?.uuid))].filter(Boolean);
            return Object.fromEntries(uuids.map((uuid) => [uuid, effectDoc(uuid)]).filter(([, doc]) => doc).map(([uuid, doc]) => [uuid, effectModel(doc, { rank: level, actorLevel: level, conditionSlug })]));
        },
        // (2026-11-03: PF2e's own Effect of that name when there is one — Sky and Heaven Stance's skyward slash and resistances that grow
        // with level, which the module's Effect from the text leaves out.)
        rulesModel: (effect) => (pf2eEffectNamed(effect.name) ? effectModel(pf2eEffectNamed(effect.name), { rank: level, actorLevel: level, conditionSlug }) : null) ?? effectModel({ name: effect.name, type: "effect", system: { rules: effect.rules ?? [], duration: effect.duration ?? { value: -1, unit: "unlimited" } } }, { rank: level, actorLevel: level, conditionSlug }),
        passiveModel: (uuid) => {
            const doc = effectDoc(uuid);
            return doc ? effectModel(doc, { rank: level, actorLevel: level, conditionSlug }) : null;
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
    rogue: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "light", damage: ["piercing"], groups: ["sword"], finesse: true },
    wizard: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "unarmored", damage: ["bludgeoning"], groups: ["club"] },
    cleric: { twoHanded: false, oneHanded: true, twoWeapons: false, freeHand: true, ranged: false, reload0: false, firearm: false, thrown: false, shield: false, armor: "light", damage: ["bludgeoning"], groups: ["club"] }
};
// What a class's PC wields (src/engine/classes.js), read from its Strikes, shield and armor.
function wieldsOf(c) {
    if (WIELDS[c.id]) return WIELDS[c.id];
    const strikes = c.strikes ?? [];
    const main = strikes[0] ?? {};
    const twoHanded = main.hands === 2 && main.melee;
    const meleeHeld = strikes.filter((strike) => strike.melee && strike.held);
    return {
        twoHanded, oneHanded: !twoHanded && meleeHeld.length > 0, twoWeapons: false, freeHand: !twoHanded && !c.shield && meleeHeld.length <= 1 && !(main.hands === 2),
        melee: strikes.some((strike) => strike.melee && strike.held !== false && !strike.unarmed) || Boolean(main.melee), finesse: strikes.some((strike) => strike.melee && strike.finesse),
        ranged: !main.melee, reload0: !main.melee && !main.reload, firearm: Boolean(main.firearm), twoHandedRanged: main.hands === 2 && !main.melee, thrown: Boolean(main.thrown), shield: Boolean(c.shield),
        armor: classArmor(c.id) ?? "unarmored", damage: [...new Set(strikes.flatMap((strike) => [strike.damage?.[0]?.type, ...(strike.versatile ?? [])]).filter(Boolean))],
        groups: [...new Set(strikes.map((strike) => strike.iwr?.group).filter(Boolean))]
    };
}
export const requirementText = (doc) => /<strong>\s*Requirements?\s*<\/strong>\s*([^<]*)/i.exec(doc.system?.description?.value ?? "")?.[1]?.trim() ?? null;
const key = (level) => (level >= 20 ? 7 : level >= 17 ? 6 : level >= 10 ? 5 : 4);

// The PC's numbers as the feat module's compiler reads a character's (its scripts/character.js characterDCs).
export function dcsOf(c) {
    const level = c.level;
    const spellDC = (c.spells ?? []).find((entry) => !entry.kind && Number.isFinite(entry.dc))?.dc ?? null;
    const tradition = (c.spells ?? []).find((entry) => !entry.kind && entry.tradition)?.tradition ?? null;
    const abilities = c.abilities ?? ABILITIES[c.id]?.(key(level), level >= 10 ? 2 : 1) ?? {};
    const melee = (c.strikes ?? []).find((strike) => strike.melee);
    // (A class PC's own attributes, src/engine/classes.js: its finesse weapon with the better of Strength and Dexterity.)
    const toHit = c.id === "rogue" ? abilities.dex : c.abilities && melee?.finesse ? Math.max(abilities.str ?? 0, abilities.dex ?? 0) : abilities.str;
    const proficiency = melee ? melee.bonus - (toHit ?? 0) - (melee.potency ?? 0) : level + 2;
    return {
        level,
        class: Number.isFinite(c.classDC) ? c.classDC : null,
        spell: spellDC,
        perception: 10 + (c.perception ?? 0),
        // (2026-11-03: its class's own DC by the class's slug, as Foundry's actor.classDCs gives it — Stunning Finisher's "against:swashbuckler".)
        byClass: Number.isFinite(c.classDC) && CLASS_SLUGS.includes(c.id) ? { [c.id]: c.classDC } : {},
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
function withRider(entry, rider) {
    const plan = structuredClone(entry.plan);
    const id = `rider-${(plan.resolution.sharedDamage?.components ?? []).length}`;
    plan.resolution.sharedDamage = { rollOnce: true, ...(plan.resolution.sharedDamage ?? {}), components: [...(plan.resolution.sharedDamage?.components ?? []), { id, formula: rider.damage, type: null, category: null }] };
    for (const [degree, multiplier] of [["success", 1], ["criticalSuccess", rider.criticalDouble ? 2 : 1]]) {
        const row = plan.resolution.outcomes[degree];
        row.damage = { mode: "shared", multiplier, sourceComponentIds: [...(row.damage?.sourceComponentIds ?? []), id] };
    }
    return { ...entry, plan, riders: [...(entry.riders ?? []), rider.source] };
}
function joinBuiltins(c, builtins) {
    for (const [field, value] of Object.entries(builtins)) {
        // (2026-11-04: a rider on a basic action's success — Crushing Grab's damage on a Grapple, Agonizing Rebuke's on a Demoralize: the
        // PC's own basic entry gets the damage on its success and critical success.)
        if (field === "basicRiders") {
            for (const rider of value) c.spells = (c.spells ?? []).map((entry) => (entry.kind === "basic" && rider.slugs.includes(entry.plan?.source?.slug) ? withRider(entry, rider) : entry));
            continue;
        }
        if (field === "maxHpBonus") {
            c.hp = { ...c.hp, value: c.hp.value + value, max: c.hp.max + value };
            continue;
        }
        if (Array.isArray(value)) c[field] = [...(c[field] ?? []), ...value];
        else if (value && typeof value === "object" && c[field] && typeof c[field] === "object" && !Array.isArray(c[field])) c[field] = { ...c[field], ...value };
        else c[field] = value;
    }
}

// (2026-11-02, Cole: "look at the ancestry feats the simulator doesnt play, do any of them look like they should effect combat?" — the
// innate spells a feat gives, ~250 ancestry feats: Breath of Calamity's Chain Lightning, Killing Stone's Toxic Cloud.)
let spellLib = null;
const spellTools = async () => (spellLib ??= await import("./pack-spells.mjs"));
const spellPack = await spellTools();
const ORDINAL = "(\\d+)(?:st|nd|rd|th)";
// The spells a feat's text has its user cast innately: [{ spell, castRank, pool uses (0: at will) }]. Its rank: the text's ("5th-rank",
// "as a 7th-rank innate spell"), else heightened to half the PC's level rounded up where it says so or for a cantrip, else the spell's own.
const FOCUS_GRANT = /\bYou (?:gain|learn)(?: either)? (?:the|a|an|your choice of the|one) [^.]*?\b(?:focus spells?|(?:composition|hex|link|conflux|grave|order|warden|devotion|ki|qi|domain|bloodline|school|revelation|apparition|eidolon) (?:cantrip|spell)s?)\b/i;
export function innateSpells(doc, level) {
    const text = String(doc.system?.description?.value ?? "");
    // (2026-11-04, Cole: "Automate the spellcasting and companion feats not handled by other modules": or a focus spell or cantrip it
    // teaches — Mantis Form's "You gain the Mantis Form focus spell", Song of Strength's composition cantrip —, heightened to half the
    // level, a focus spell once a fight, a cantrip at will. Not one on a companion: the simulator's PCs have none.)
    const focus = FOCUS_GRANT.test(text.replace(/@UUID\[[^\]]*?([^.\]]+)\](?:\{([^}]*)\})?/g, (_all, id, label) => label ?? id).replace(/<[^>]+>/g, " "));
    if (!/\binnate\b/i.test(text) && !focus) return [];
    const half = Math.max(1, Math.ceil(level / 2));
    const found = [];
    for (const hit of text.matchAll(/@UUID\[Compendium\.pf2e\.spells-srd\.Item\.([^\]]+)\](?:\{([^}]*)\})?/g)) {
        const spell = spellPack.spellNamed(hit[1]) ?? spellPack.spellNamed(hit[2] ?? "") ?? spellPack.spellById?.(hit[1]) ?? null;
        if (!spell || found.some((each) => each.spell === spell)) continue;
        // (The sentence it's in: its rank and how often.)
        const start = Math.max(0, text.lastIndexOf(".", hit.index) + 1);
        const end = text.indexOf(".", hit.index + hit[0].length);
        const sentence = text.slice(Math.max(0, start - 40), end < 0 ? undefined : end + 1).replace(/<[^>]+>/g, " ");
        const cantrip = (spell.system?.traits?.value ?? []).includes("cantrip");
        // (Not a cap: "any spell of 6th rank or lower".)
        const fixed = new RegExp(`${ORDINAL}[- ](?:rank|level)(?! or lower)`, "i").exec(sentence)?.[1];
        const heightened = /half your level|heightened to a spell rank equal to half/i.test(sentence) || cantrip;
        const own = Number(spell.system?.level?.value) || 1;
        const castRank = Number(fixed) || (heightened ? half : own);
        if (castRank > half && !fixed) continue;
        const uses = cantrip || /at will/i.test(sentence) ? 0 : /twice per day/i.test(sentence) ? 2 : 1;
        if (focus && !/\binnate\b/i.test(sentence) && /\b(?:companion|eidolon|familiar|minion|thrall|mount)\b/i.test(String(spell.system?.target?.value ?? ""))) continue;
        found.push({ spell, castRank, uses });
    }
    return found;
}
// Those spells as the PC's entries (its spell DC where it has one — a wizard's, a cleric's —, else trained Charisma's), or null.
function innateSpellEntry(doc, level, host) {
    const spells = innateSpells(doc, level);
    if (!spells.length) return null;
    const own = dcsOf(host);
    const abilities = host.abilities ?? ABILITIES[host.id]?.(key(level), level >= 10 ? 2 : 1) ?? {};
    const dc = own.spell ?? 10 + level + 2 + (abilities.cha ?? 0);
    const entries = [];
    const pools = {};
    const choice = /\b(?:chosen|choose(?: one)?) from the following\b|\bone of the following spells\b|\b(?:gain|learn) either\b|\byour choice of\b/i.test(String(doc.system?.description?.value ?? ""));
    for (const { spell, castRank, uses } of spells) {
        let plan;
        try {
            plan = spellPack.compileSpell(spell);
        } catch {
            continue;
        }
        if (!plan?.resolution || ["unsupported", "no-effect"].includes(plan.resolution.kind)) continue;
        // (2026-11-03, Avenging Runelord Dedication's "This spell must be chosen from the following list": one of them, so one use shared —
        // the fight casts the one it wants. Before, each listed spell came with its own use.)
        const pool = uses ? (choice ? `innate:${doc._id}:choice` : `innate:${doc._id}:${spell._id}`) : null;
        if (pool) pools[pool] = choice ? 1 : uses;
        const entry = { name: `${spell.name} (${doc.name})`, fromFeat: true, plan, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
        if (castable(entry)) entries.push(entry);
    }
    if (!entries.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: a spell the engine doesn't cast (${spells.map((each) => (each.spell ?? each).name).join(", ")})` } };
    return { spells: entries, pools, gap: null, played: `innate spell${entries.length > 1 ? "s" : ""}: ${spells.map(({ spell, castRank }) => `${spell.name} (rank ${castRank})`).join(", ")}` };
}

// (2026-11-03, the class feats no fight played: an action that puts its PF2e Effect on one ally — Steel Yourself!'s temporary Hit Points and
// Fortitude, Spike Skin's resistance —: cast as Heroism's compiled shape (one creature) at an ally within the text's feet (30 without),
// the Effect's own rules its model; once a fight with a frequency, else at will.)
// (Or one read by hand, with no PF2e Effect: Protect Ally's +1 AC to an adjacent ally until the start of its next turn.)
const ALLY_BUFFS = { "protect-ally": () => ({ feet: 0, model: { modifiers: [{ on: "ac", type: "circumstance", value: 1 }] }, rounds: 1, played: "+1 AC to an adjacent ally for a round" }),
    // (Spike Skin, a wood impulse: resistance 4 to physical damage but adamantine, and piercing damage on each creature that damages it in
    // melee — the engine's hitBack —, +2 each every 2 levels; 10 minutes, a fight.)
    "spike-skin": (level) => ({ feet: 0, model: { resistances: [{ type: "physical", value: 4 + 2 * Math.max(0, Math.floor((level - 8) / 2)), exceptions: ["adamantine"] }], hitBack: `${Math.max(2, Math.floor((level - 8) / 2) * 2 + 2)}[piercing]` }, rounds: 100, played: "resistance to physical damage and spikes on an ally it touches" }) };
function allyEffectEntry(doc, level) {
    const hand = ALLY_BUFFS[slugOf(doc)]?.(level);
    const type = doc.system?.actionType?.value;
    if (type !== "action" || !(Number(doc.system?.actions?.value) <= 2)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const text = html.replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/<[^>]+>/g, " ");
    if (!hand && (!/\b(?:(?:choose|select|touch|target) (?:one|an|a) (?:willing )?(?:ally|creature)|an ally (?:within|in your)|one ally (?:within|in your)|a willing creature)\b/i.test(text) || /\benem(?:y|ies)\b.*\bEffect:/i.test(text))) return null;
    // (Not one behind a check of its own — Helpful Tinkering's Crafting check and its critical failure's harm.)
    if (/<strong>\s*Requirements?\s*<\/strong>/i.test(html) || /@Check\[|Critical Failure/i.test(html)) return null;
    const uuid = /@UUID\[(Compendium\.pf2e\.feat-effects\.Item\.[^\]]+)\]/.exec(html)?.[1];
    const effect = !hand && uuid && effectDoc(uuid);
    if (!hand && !effect) return null;
    const model = hand ? { name: doc.name, rounds: hand.rounds, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...hand.model } : effectModel(effect, { rank: level, actorLevel: level, conditionSlug });
    if (model.unsupported?.length || !(model.modifiers.length || model.tempHp || model.fastHealing || model.resistances.length || model.conditions.length || model.strikeParts)) return null;
    const heroism = spellPack.spellNamed("Heroism");
    let base;
    try {
        base = heroism && spellPack.compileSpell(heroism);
    } catch {
        base = null;
    }
    if (base?.resolution?.kind !== "effect") return null;
    // (A marshal's aura: 10 feet.)
    const feet = hand ? hand.feet : Number(/\bwithin (\d+) feet\b/i.exec(text)?.[1]) || (/\btouch\b/i.test(text) ? 0 : /\bmarshal's aura\b/i.test(text) ? 10 : 30);
    const key = `feat:${doc._id}:ally`;
    const plan = { ...base, source: { ...base.source, name: doc.name }, traits: [...(doc.system?.traits?.value ?? [])], activation: { ...base.activation, time: String(doc.system?.actions?.value ?? 1) }, targeting: { ...base.targeting, range: feet ? `${feet} feet` : "touch" }, heightening: null, resolution: { ...base.resolution, applications: [{ kind: "native-spell-effect", uuid: key, source: "nativeEffects.onUse" }] } };
    const once = /\bFrequency\b/i.test(html);
    const pool = once ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc: 0, attack: 0, pool, effects: { [key]: { ...model, name: doc.name } } };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: 1 } : {}, gap: null, played: `${hand ? hand.played : `its Effect on an ally${feet ? ` within ${feet} feet` : " it touches"}`}${once ? " (once a fight)" : ""}` };
}

// (2026-11-03, the class feats no fight played: a spellcasting dedication's cantrips — Cleric, Wizard, Bard, Sorcerer Dedication and their
// kin, "two common cantrips from the divine spell list" —: one damage cantrip of its tradition, picked as a martial PC would — Electric
// Arc (arcane, primal; a bloodline's or patron's list played as arcane), Divine Lance (divine), Void Warp (occult) —, at will, heightened to half its level, its DC trained with the PC's
// Charisma, as an innate spell's.)
const DEDICATION_CANTRIP = { arcane: "Electric Arc", primal: "Electric Arc", divine: "Divine Lance", occult: "Void Warp" };
function dedicationCantripEntry(doc, level, host) {
    if (!/Dedication$/.test(doc.name)) return null;
    const text = String(doc.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1");
    const sentence = /[^.]*\b(?:one|two|four|a single|a)\s+(?:common\s+)?(?:[a-z]+\s+){0,3}cantrips?\b[^.]*\./i.exec(text)?.[0];
    if (!sentence || /\bof the following\b|\bpsi cantrip|\bHalcyon\b/i.test(sentence)) return null;
    const tradition = /\b(arcane|divine|occult|primal)\b/i.exec(sentence)?.[1]?.toLowerCase() ?? (/\b(?:tradition|spell list) of your choice\b|\bbloodline\b|\bpatron\b/i.test(sentence) ? "arcane" : null);
    const spell = tradition && spellPack.spellNamed(DEDICATION_CANTRIP[tradition]);
    if (!spell) return null;
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    const abilities = host.abilities ?? ABILITIES[host.id]?.(key(level), level >= 10 ? 2 : 1) ?? {};
    const dc = 10 + level + 2 + (abilities.cha ?? 0);
    const castRank = Math.max(1, Math.ceil(level / 2));
    const entry = { name: `${spell.name} (${doc.name})`, plan, castRank, dc, attack: dc - 10, pool: null, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: {}, gap: null, played: `cantrip: ${spell.name} (rank ${castRank}, DC ${dc})` };
}

// (Reach Spell: each 1- or 2-action spell with a range — touch counted as none — 30 feet farther, an action more.)
function reachEntry(doc, host) {
    if (slugOf(doc) !== "reach-spell") return null;
    const spells = [];
    for (const spell of host.spells ?? []) {
        const range = String(spell.plan?.targeting?.range ?? "");
        const time = String(spell.plan?.activation?.time ?? "");
        const feet = range === "touch" ? 0 : Number(/^(\d+) feet$/.exec(range)?.[1]);
        if (!range || !Number.isFinite(feet) || !["1", "2"].includes(time) || spell.kind) continue;
        const plan = { ...spell.plan, activation: { ...spell.plan.activation, time: String(Number(time) + 1) }, targeting: { ...spell.plan.targeting, range: `${feet + 30} feet` } };
        const entry = { ...spell, name: `${spell.name} (reach)`, plan };
        if (castable(entry)) spells.push(entry);
    }
    if (!spells.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: no spell of the PC's it reaches` } };
    return { spells, pools: {}, gap: null, played: `reach copies of ${spells.length} spell${spells.length > 1 ? "s" : ""}` };
}

// (2026-11-03, the class feats no fight played: Stunning Blows.) A Flurry of Blows that hits: a Fortitude save at the monk's class DC or
// stunned 1 (3 on a critical failure) — the save as a spell compiled from that text, cast by the flurry's rider (spells.js bothHitRider's
// affliction), not on its own.
// (2026-11-05, Twin Distraction: Twin Feint's two Strikes both dealing damage — a Will save at the rogue's class DC or stupefied 1 until
// the end of its next turn; the save cast by the multi-Strike's bothHit rider as Stunning Blows' is. Twin Feint itself comes with it.)
function twinDistractionEntry(doc, level, host) {
    if (slugOf(doc) !== "twin-distraction") return null;
    const stupefied = "@UUID[Compendium.pf2e.conditionitems.Item.Stupefied]";
    const html = `<p>The target must attempt a @Check[will] save.</p><hr /><p><strong>Critical Success</strong> The creature is unaffected.</p><p><strong>Success</strong> The creature is unaffected.</p><p><strong>Failure</strong> The creature is ${stupefied}{Stupefied 1} until the end of your next turn.</p><p><strong>Critical Failure</strong> The creature is ${stupefied}{Stupefied 1} until the end of your next turn.</p>`;
    const spell = { ...doc, type: "spell", system: { ...doc.system, description: { value: html }, level: { value: 1 }, heightening: undefined, time: { value: "1" }, area: null, target: { value: "1 creature" }, range: { value: "touch" }, defense: { save: { statistic: "will", basic: false } }, damage: {}, traits: { ...doc.system.traits, value: [...(doc.system.traits?.value ?? [])] } } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!plan?.resolution || plan.resolution.kind !== "save") return null;
    plan = { ...plan, trigger: { ...(plan.trigger ?? {}), event: "strike", attackEffect: "twin distraction" } };
    const dc = dcsOf(host).class ?? 10 + level + 2;
    const entry = { name: "Twin Distraction", plan, castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10, pool: null, effects: {} };
    return { spells: [entry], pools: {}, gap: null, played: "Twin Feint (forced); both Strikes hit: a Will save or stupefied 1", twinFeint: { name: "Twin Feint", actions: 2, strikes: [null, null], sameTarget: true, secondOffGuard: true, bothHit: { conditions: [], damage: [], affliction: "twin distraction" } } };
}

function stunningBlowsEntry(doc, level, host) {
    if (slugOf(doc) !== "stunning-blows") return null;
    const flurry = (host.multiStrikes ?? []).find((entry) => entry.name === "Flurry of Blows");
    if (!flurry) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: no Flurry of Blows on the PC` } };
    const stunned = "@UUID[Compendium.pf2e.conditionitems.Item.Stunned]";
    const html = `<p>The target must attempt a @Check[fortitude] save.</p><hr /><p><strong>Critical Success</strong> The creature is unaffected.</p><p><strong>Success</strong> The creature is unaffected.</p><p><strong>Failure</strong> The creature is ${stunned}{Stunned 1}.</p><p><strong>Critical Failure</strong> The creature is ${stunned}{Stunned 3}.</p>`;
    const spell = { ...doc, type: "spell", system: { ...doc.system, description: { value: html }, level: { value: 1 }, heightening: undefined, time: { value: "1" }, area: null, target: { value: "1 creature" }, range: { value: "touch" }, defense: { save: { statistic: "fortitude", basic: false } }, damage: {}, traits: { ...doc.system.traits, value: [...(doc.system.traits?.value ?? []), "incapacitation"] } } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!plan?.resolution || plan.resolution.kind !== "save") return null;
    plan = { ...plan, trigger: { ...(plan.trigger ?? {}), event: "strike", attackEffect: "stunning blows" } };
    const dc = dcsOf(host).class ?? 10 + level + 2;
    const entry = { name: "Stunning Blows", plan, castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10, pool: null, effects: {} };
    return { spells: [entry], pools: {}, gap: null, played: "a Fortitude save or stunned when a Flurry of Blows hits", flurryRider: { affliction: "stunning blows", atLeast: 1 } };
}

// (2026-11-03, the class feats' passives that answer a critical hit: Fracture Timeflow's "Whenever you achieve a critical success with a
// Strike, the target of that Strike must also attempt a … save".) The feat's own save text compiled as a spell the engine casts at the target
// after any critical Strike of the PC's (actions.js critRiders), at the higher of its class and spell DCs; a spell trigger the planner
// doesn't cast on its own.
const CRIT_RIDERS = { "fracture-timeflow": { save: "will" } };
function critRiderEntry(doc, level, host, builtins) {
    const way = CRIT_RIDERS[slugOf(doc)];
    if (!way) return null;
    const html = String(doc.system?.description?.value ?? "");
    const spell = { ...doc, type: "spell", system: { ...doc.system, description: { value: html.replace(/^[\s\S]*?(?=The target|the target)/, "<p>").replace(/@Check\[(\w+)\|[^\]]*\]/g, "@Check[$1]") }, level: { value: 1 }, heightening: undefined, time: { value: "1" }, area: null, target: { value: "1 creature" }, range: { value: "touch" }, defense: { save: { statistic: way.save, basic: false } }, damage: {}, traits: { ...doc.system.traits, value: [...(doc.system.traits?.value ?? [])] } } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!plan?.resolution || plan.resolution.kind !== "save") return null;
    const name = doc.name.toLowerCase();
    plan = { ...plan, trigger: { ...(plan.trigger ?? {}), event: "strike", attackEffect: name } };
    const dcs = dcsOf(host);
    const dc = Math.max(dcs.class ?? 0, dcs.spell ?? 0) || 10 + level + 2;
    const castRank = Math.max(1, Math.ceil(level / 2));
    const entry = { name: doc.name, plan, castRank, dc, attack: dc - 10, pool: null, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
    builtins.critRiders = [...(builtins.critRiders ?? []), { affliction: name, source: doc.name }];
    return { spells: [entry], pools: {}, gap: null, played: `a ${way.save[0].toUpperCase()}${way.save.slice(1)} save at DC ${dc} after each critical Strike` };
}

// (2026-11-03, the class feats no fight played: Widen Spell, the spellshape a blaster takes.) Each of the PC's 1- or 2-action spells with a
// burst, emanation, cone or line as a widened copy, an action more, from the same slot: a burst or emanation of 10 feet or more 5 feet
// wider, a cone or line of 15 feet or less 5 feet longer, a longer one 10 feet.
// (2026-11-03: Spiritual Expansion Spell, an animist's Widen Spell; Growth Spell, a slot spell's burst 5 feet more, a cone's 10, a line's
// 15.)
function widenEntry(doc, host) {
    const growth = slugOf(doc) === "growth-spell";
    if (!["widen-spell", "spiritual-expansion-spell"].includes(slugOf(doc)) && !growth) return null;
    const spells = [];
    for (const spell of host.spells ?? []) {
        const area = spell.plan?.targeting?.area;
        const time = String(spell.plan?.activation?.time ?? "");
        if (!area || !["1", "2"].includes(time) || spell.kind || !(Number(area.value) > 0) || (growth && !spell.pool)) continue;
        const value = Number(area.value);
        let wider = null;
        if (["burst", "emanation"].includes(area.type) && (value >= 10 || growth)) wider = value + 5;
        if (["cone", "line"].includes(area.type)) wider = value + (growth ? (area.type === "cone" ? 10 : 15) : value <= 15 ? 5 : 10);
        if (!wider) continue;
        const plan = { ...spell.plan, activation: { ...spell.plan.activation, time: String(Number(time) + 1) }, targeting: { ...spell.plan.targeting, area: { ...area, value: wider } } };
        const entry = { ...spell, name: `${spell.name} (widened)`, plan };
        if (castable(entry)) spells.push(entry);
    }
    if (!spells.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: no spell of the PC's it widens` } };
    return { spells, pools: {}, gap: null, played: `widened copies of ${spells.length} area spell${spells.length > 1 ? "s" : ""}` };
}

// (2026-11-03, the class feats no fight played: Terrifying Howl, Dazzling Display — Demoralize each enemy within 30 feet, one action.) As a
// Will save of each enemy in a 30-foot emanation against the PC's Intimidation DC (the same odds turned around), on Fear's compiled shape: a
// failure frightened 1, a critical failure frightened 2; once a fight (each foe is then immune for a minute).
const DEMORALIZE_ALL = new Set(["terrifying-howl", "dazzling-display", "terrifying-transformation", "deimatic-display", "reach-for-the-sky"]);
function demoralizeAllEntry(doc, level, host) {
    if (!DEMORALIZE_ALL.has(slugOf(doc))) return null;
    const fear = spellPack.spellNamed("Fear");
    let base;
    try {
        base = fear && spellPack.compileSpell(fear);
    } catch {
        base = null;
    }
    if (!base?.resolution?.outcomes?.failure) return null;
    const row = (value) => ({ ...structuredClone(base.resolution.outcomes.failure), effects: value ? [{ kind: "condition", slug: "frightened", name: "Frightened", value, duration: null, source: doc.name }] : [], rawText: "" });
    const plan = { ...base, source: { ...base.source, name: doc.name }, traits: [...new Set([...(doc.system?.traits?.value ?? []), "emotion", "fear", "mental"])], activation: { ...base.activation, time: String(doc.system?.actions?.value ?? 1) }, targeting: { ...base.targeting, target: null, range: null, area: { type: "emanation", value: 30, foes: true }, actorConstraints: { sourceText: "each enemy", supportsActorTargets: true, complete: true, predicates: [{ kind: "enemy-of-caster" }] } }, heightening: null, resolution: { ...base.resolution, outcomes: { criticalSuccess: row(0), success: row(0), failure: row(1), criticalFailure: row(2) } } };
    const intimidation = Number(host?.skills?.intimidation);
    const dc = 10 + (Number.isFinite(intimidation) ? intimidation : level + 2);
    const pool = `feat:${doc._id}`;
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10, pool, effects: spellPack.effectModels(plan, 1) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: { [pool]: 1 }, gap: null, played: `Demoralize each enemy within 30 feet (Intimidation DC ${dc}, once a fight)` };
}

// (2026-11-03, the class feats no fight played: quickened for the PC and its allies around it — Song of Grace and Speed, 1 minute;
// Quickening Banner, 1 round in the banner's 30-foot aura.) Built on Courageous Anthem's compiled shape (an emanation's effect on the
// PC's side), its effect quickened. Once a fight; the extra action's Strike-or-Stride limit is the engine's quickened.
const quick = { conditions: [{ slug: "quickened", value: null }] };
// (Plant Banner's temporary Hit Points, renewed each turn in the burst: played as lasting the fight. Orchard's Endurance: resistance to
// bludgeoning and piercing in the kinetic aura, its stance played as the fight; the persistent-damage fortune isn't played.)
const QUICKEN_ALL = {
    "song-of-grace-and-speed": () => ({ actions: 2, area: 30, rounds: 10, model: quick, played: "quickened for a minute" }),
    "quickening-banner": () => ({ actions: 1, area: 30, rounds: 1, model: quick, played: "quickened for a round" }),
    "plant-banner": (level) => ({ actions: 1, area: 30, rounds: 100, model: { tempHp: 4 * (1 + Math.floor(level / 4)) }, played: `${4 * (1 + Math.floor(level / 4))} temporary Hit Points` }),
    // (Sheltering Pulse: +1 status bonus to AC in a 15-foot emanation for 3 rounds — played around itself.)
    "sheltering-pulse": () => ({ actions: 2, area: 15, rounds: 3, model: { modifiers: [{ on: "ac", type: "status", value: 1 }] }, once: false, played: "+1 AC to allies near it for 3 rounds" }),
    // (2026-11-05, the bard's composition focus spells the spell module doesn't cast: Lingering Composition's Courageous Anthem for 3
    // rounds — its Performance check taken as a success, the free action and the anthem's one —; Fortissimo Composition's anthem at +2.)
    "lingering-composition": () => ({ actions: 1, area: 60, rounds: 3, model: { modifiers: [{ on: "attack", type: "status", value: 1 }, { on: "damage", type: "status", value: 1 }] }, played: "Courageous Anthem for 3 rounds" }),
    "fortissimo-composition": () => ({ actions: 1, area: 60, rounds: 1, model: { modifiers: [{ on: "attack", type: "status", value: 2 }, { on: "damage", type: "status", value: 2 }] }, played: "Courageous Anthem at +2 for a round" }),
    "orchards-endurance": (level) => ({ actions: 1, area: 10, rounds: 100, model: { resistances: ["bludgeoning", "piercing"].map((type) => ({ type, value: 5 + 2 * Math.max(0, Math.floor((level - 14) / 4)), exceptions: [] })) }, played: "resistance to bludgeoning and piercing" })
};
function quickenAllEntry(doc, level) {
    const read = QUICKEN_ALL[slugOf(doc)]?.(level);
    if (!read) return null;
    const anthem = spellPack.spellNamed("Courageous Anthem");
    let base;
    try {
        base = anthem && spellPack.compileSpell(anthem);
    } catch {
        base = null;
    }
    if (base?.resolution?.kind !== "effect") return null;
    const uuid = `feat:${doc._id}:quickened`;
    const plan = { ...base, source: { ...base.source, name: doc.name }, traits: [...(doc.system?.traits?.value ?? [])], activation: { ...base.activation, time: String(read.actions) }, targeting: { ...base.targeting, area: { type: "emanation", value: read.area }, actorConstraints: { ...base.targeting.actorConstraints, predicates: [{ kind: "ally-of-caster" }] } }, heightening: null, resolution: { ...base.resolution, applications: [{ kind: "native-spell-effect", uuid, source: "nativeEffects.onUse" }] } };
    const pool = read.once === false ? null : `feat:${doc._id}`;
    const effects = { [uuid]: { name: doc.name, rounds: read.rounds, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...read.model } };
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc: 0, attack: 0, pool, effects };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: 1 } : {}, gap: null, played: `${read.played}, the PC and its allies within ${read.area} feet${pool ? " (once a fight)" : ""}` };
}

// (2026-11-03, the class feats no fight played: a passive aura that frightens — Frightful Aura's 15-foot emanation, a Will save against the
// higher of its class or spell DC, frightened 1 on a failure, 2 on a critical failure —: the engine's monster aura (spells.js applyAuras, a
// Frightful Presence's), each enemy in range saving as the fight starts. Its enter-or-end-turn saves later aren't played.)
const SAVE_AURAS = { "frightful-aura": { radius: 15, save: "will", failure: ["frightened", 1], criticalFailure: ["frightened", 2] },
    // (Mummy's Despair: its 2 actions, once a fight, the aura's save on each enemy in 30 feet as it comes up — those entering it later,
    // and the turns after, aren't played.)
    "mummys-despair": { radius: 30, save: "will", failure: ["frightened", 1], criticalFailure: ["frightened", 2], actions: 2, once: true } };
function saveAuraEntry(doc, level, host) {
    const read = SAVE_AURAS[slugOf(doc)];
    if (!read) return null;
    const fear = spellPack.spellNamed("Fear");
    let base;
    try {
        base = fear && spellPack.compileSpell(fear);
    } catch {
        base = null;
    }
    if (!base?.resolution?.outcomes?.failure) return null;
    const row = (condition) => ({ ...structuredClone(base.resolution.outcomes.failure), effects: condition ? [{ kind: "condition", slug: condition[0], name: condition[0], value: condition[1], duration: null, source: doc.name }] : [], rawText: "" });
    const plan = { ...base, source: { ...base.source, name: doc.name }, traits: [...new Set([...(doc.system?.traits?.value ?? []), "emotion", "fear", "mental"])], ...(read.actions ? {} : { trigger: { event: "aura" } }), activation: { ...base.activation, time: String(read.actions ?? 0) }, targeting: { ...base.targeting, target: null, range: null, area: { type: "emanation", value: read.radius, foes: true }, actorConstraints: { sourceText: "each enemy", supportsActorTargets: true, complete: true, predicates: [{ kind: "enemy-of-caster" }] } }, heightening: null, resolution: { ...base.resolution, check: { ...base.resolution.check, statistic: read.save }, outcomes: { criticalSuccess: row(null), success: row(null), failure: row(read.failure), criticalFailure: row(read.criticalFailure) } } };
    const own = dcsOf(host);
    const dc = Math.max(own.class ?? 0, own.spell ?? 0) || 10 + level + 2;
    const pool = read.once ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10, pool, effects: spellPack.effectModels(plan, 1) };
    if (read.actions) return castable(entry) ? { spells: [entry], pools: pool ? { [pool]: 1 } : {}, gap: null, played: `each enemy within ${read.radius} feet saves (${read.save}, DC ${dc}) or is ${read.failure[0]} (${read.actions} actions, once a fight)` } : null;
    return { spells: [entry], pools: {}, gap: null, played: `an aura: each enemy within ${read.radius} feet saves (${read.save}, DC ${dc}) or is ${read.failure[0]} as the fight starts` };
}

// (2026-11-03, the class feats no fight played: a skill check against one foe's save DC with conditions by degree — Surgical Shock's
// Medicine against Fortitude: clumsy 2, clumsy 3 on a critical success, until the end of its next turn —, as Demoralize-each-enemy is: the
// foe's save against the PC's skill DC, the degrees turned around, on Fear's compiled shape at one creature in reach. The stupefied
// choice isn't played; the failure's +1 to its next attack isn't either.)
const SKILL_ATTACKS = {
    "surgical-shock": { skill: "medicine", save: "fortitude", range: "touch", success: ["clumsy", 2], critical: ["clumsy", 3], rounds: 1, once: true }
};
function skillAttackEntry(doc, level, host) {
    const read = SKILL_ATTACKS[slugOf(doc)];
    if (!read) return null;
    const fear = spellPack.spellNamed("Fear");
    let base;
    try {
        base = fear && spellPack.compileSpell(fear);
    } catch {
        base = null;
    }
    if (!base?.resolution?.outcomes?.failure) return null;
    const duration = { mode: "fixed", value: read.rounds, unit: "rounds" };
    const row = (condition) => ({ ...structuredClone(base.resolution.outcomes.failure), effects: condition ? [{ kind: "condition", slug: condition[0], name: condition[0], value: condition[1], duration, source: doc.name }] : [], rawText: "" });
    const plan = { ...base, source: { ...base.source, name: doc.name }, traits: [...(doc.system?.traits?.value ?? [])], activation: { ...base.activation, time: String(doc.system?.actions?.value ?? 1) }, targeting: { ...base.targeting, range: read.range, actorConstraints: { ...base.targeting.actorConstraints, predicates: [{ kind: "enemy-of-caster" }] } }, heightening: null, resolution: { ...base.resolution, check: { ...base.resolution.check, statistic: read.save }, outcomes: { criticalSuccess: row(null), success: row(null), failure: row(read.success), criticalFailure: row(read.critical) } } };
    const modifier = Number(host?.skills?.[read.skill]);
    const dc = 10 + (Number.isFinite(modifier) ? modifier : level + 2);
    const pool = read.once ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10, pool, effects: spellPack.effectModels(plan, 1) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: 1 } : {}, gap: null, played: `${read.success[0]} ${read.success[1]} on a foe that fails a ${read.save} save against its ${read.skill} DC ${dc}${read.once ? " (once a fight)" : ""}` };
}

// (2026-11-03, the class feats no fight played: more spellshapes, as Widen Spell — a copy of each of the PC's spells it shapes, an action
// more.) Intimidating Spell: an area damage spell's failure frightened 1, critical failure frightened 2. Burning Spell: a single-target
// non-cantrip damage spell's persistent fire of its rank. Reverberating Spell: an area non-cantrip damage spell's extra 1d8 sonic (its
// deafened isn't played).
const ROUND = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "effect-start", sourceText: "for 1 round" };
const SPELLSHAPES = {
    "intimidating-spell": { area: true, conditions: { failure: ["frightened", 1], criticalFailure: ["frightened", 2] } },
    "burning-spell": { area: false, nonCantrip: true, extra: (rank) => ({ formula: String(rank), type: "fire", category: "persistent" }) },
    "reverberating-spell": { area: true, nonCantrip: true, extra: () => ({ formula: "1d8", type: "sonic", category: null }) },
    // (2026-11-05, the real gaps: more spellshapes whose rider is a condition on a failed save.) Dizzying Spell: a single-target Will spell's
    // failure stupefied 2, critical failure stupefied 3, for 1 round. Scintillating Spell: a Reflex spell with no duration (and no darkness):
    // failure dazzled, critical failure blinded, for 1 round. Thunderclap Spell: an electricity spell with no duration: failure deafened for
    // 1 round, critical failure deafened and prone.
    "dizzying-spell": { save: "will", single: true, anyDamage: true, conditions: { failure: ["stupefied", 2, ROUND], criticalFailure: ["stupefied", 3, ROUND] } },
    "scintillating-spell": { save: "reflex", anyArea: true, anyDamage: true, noTrait: "darkness", conditions: { failure: ["dazzled", null, ROUND], criticalFailure: ["blinded", null, ROUND] } },
    "thunderclap-spell": { trait: "electricity", anyArea: true, conditions: { failure: ["deafened", null, ROUND], criticalFailure: [["deafened", null, ROUND], ["prone", null, null]] } }
};
function spellshapeEntry(doc, host) {
    const shape = SPELLSHAPES[slugOf(doc)];
    if (!shape) return null;
    const spells = [];
    for (const spell of host.spells ?? []) {
        const resolution = spell.plan?.resolution;
        const time = String(spell.plan?.activation?.time ?? "");
        const area = spell.plan?.targeting?.area;
        if (resolution?.kind !== "save" || (!shape.anyDamage && !resolution.sharedDamage?.components?.length) || !["1", "2"].includes(time) || spell.kind) continue;
        const single = /^1 creature\b/.test(String(spell.plan?.targeting?.target ?? "")) && !/plus|additional/.test(String(spell.plan?.targeting?.target ?? ""));
        if (shape.single ? area || !single : !shape.anyArea && (shape.area ? !area : area || !/^1 /.test(String(spell.plan?.targeting?.target ?? "")))) continue;
        const traits = spell.plan?.traits ?? [];
        if (shape.save && resolution.check?.statistic !== shape.save) continue;
        if (shape.trait && !traits.includes(shape.trait) && !(resolution.sharedDamage?.components ?? []).some((part) => part.type === shape.trait)) continue;
        if (shape.noTrait && traits.includes(shape.noTrait)) continue;
        if (shape.save === "reflex" || shape.trait) if (Object.values(resolution.outcomes ?? {}).some((row) => (row?.effects ?? []).some((effect) => effect.duration?.unit === "minutes"))) continue;
        if (shape.nonCantrip && !spell.pool) continue;
        const outcomes = structuredClone(resolution.outcomes ?? {});
        let sharedDamage = resolution.sharedDamage;
        if (shape.extra) {
            const part = shape.extra(spell.castRank ?? 1);
            sharedDamage = { ...sharedDamage, components: [...sharedDamage.components, { id: "spellshape", formula: part.formula, type: part.type, category: part.category, applyModifier: false, kinds: ["damage"], materials: [] }] };
            for (const row of Object.values(outcomes)) if (row?.damage?.mode === "shared" && row.damage.multiplier > 0) row.damage.sourceComponentIds = [...(row.damage.sourceComponentIds ?? []), "spellshape"];
        }
        for (const [degree, list] of Object.entries(shape.conditions ?? {})) {
            if (!outcomes[degree]) continue;
            for (const [slug, value, duration] of Array.isArray(list[0]) ? list : [list]) outcomes[degree].effects = [...(outcomes[degree].effects ?? []), { kind: "condition", slug, name: slug, value, duration: duration ?? null, source: doc.name }];
        }
        const plan = { ...spell.plan, activation: { ...spell.plan.activation, time: String(Number(time) + 1) }, resolution: { ...resolution, sharedDamage, outcomes } };
        const entry = { ...spell, name: `${spell.name} (${doc.name})`, plan, effects: shape.conditions ? spellPack.effectModels(plan, spell.castRank ?? 1) : spell.effects };
        if (castable(entry)) spells.push(entry);
    }
    if (!spells.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: no spell of the PC's it shapes` } };
    return { spells, pools: {}, gap: null, played: `${doc.name} copies of ${spells.length} spell${spells.length > 1 ? "s" : ""}` };
}

// (2026-11-03, the class feats no fight played: Tough Cookie, Spell Parry, Kinetic Dampening — a buff on the PC the feat module only times.)
// Its text's own "you gain …" as PF2e rules on an Effect (effects.js effectModel), put on as a self-effect: a +N bonus to AC and/or saving
// throws, resistance N to physical or all damage, temporary Hit Points of a level formula; for a round ("until the start of your next turn"),
// else a minute. Only an action or free action with no trigger or requirement.
function textSelfEffectEntry(doc, level, builtins, host, wields) {
    const type = doc.system?.actionType?.value;
    if (!["action", "free"].includes(type)) return null;
    // (A requirement the PC's loadout meets, or Tough Cookie's "at half your maximum or less" — the planner's check.)
    const requirement = requirementText(doc);
    const belowHalf = requirement ? (pcNeeds(requirement) ?? []).some((need) => need.hpBelowHalf) : false;
    if (requirement && !belowHalf && meetsWielding(requirement, wields) !== true) return null;
    const html = String(doc.system?.description?.value ?? "");
    if (/<strong>\s*Trigger\s*<\/strong>/i.test(html)) return null;
    const text = html.replace(/<[^>]+>/g, " ").replace(/@UUID\[[^\]]*?Item\.([^\]]+)\](?:\{([^}]*)\})?/g, (_all, name, label) => label ?? name).replace(/\s+/g, " ");
    const rules = [];
    // (Not a bonus only against some things or at some times — Six Pillars Stance's "+4 circumstance bonus to AC against reactions triggered
    // by …" —: that's no flat bonus.)
    const bonus = /\b(?:you (?:gain|get)|gaining|You and (?:your )?allies [^.]*? gain) an? \+(\d) (circumstance|status) bonus to (?:your )?(AC|all saving throws|saving throws|AC and (?:to )?(?:all )?saving throws(?: against spells that target you)?)\b(?!,? (?:against|when|if|versus)\b)/i.exec(text);
    if (bonus) {
        const value = Number(bonus[1]);
        if (/AC/.test(bonus[3])) rules.push({ key: "FlatModifier", selector: "ac", type: bonus[2].toLowerCase(), value });
        if (/saving throws/.test(bonus[3]) && !/against spells/.test(bonus[3])) rules.push({ key: "FlatModifier", selector: "saving-throw", type: bonus[2].toLowerCase(), value });
    }
    const resist = /\byou gain resistance (\d+) to (physical|all) damage\b/i.exec(text);
    if (resist) rules.push({ key: "Resistance", type: resist[2].toLowerCase() === "all" ? "all-damage" : "physical", value: Number(resist[1]) });
    const temp = /\byou gain (?:a number of )?temporary Hit Points equal to (half your level|your level|double your level|twice your level|half your maximum Hit Points)\b/i.exec(text);
    if (temp) {
        const f = temp[1].toLowerCase();
        rules.push({ key: "TempHP", value: f === "half your level" ? Math.max(1, Math.floor(level / 2)) : f === "your level" ? level : f.startsWith("half your maximum") ? Math.floor((host?.hp?.max ?? level * 10) / 2) : level * 2 });
    }
    if (!rules.length) return null;
    const round = /until the (?:start|beginning) of your next turn/i.test(text);
    const model = effectModel({ name: doc.name, type: "effect", system: { rules, duration: round ? { value: 1, unit: "rounds", expiry: "turn-start" } : { value: 10, unit: "rounds" } } }, { rank: level, actorLevel: level, conditionSlug });
    if (!(model.modifiers.length || model.tempHp || model.resistances.length)) return null;
    addBuiltin(builtins, { builtin: "self-effect", actions: type === "free" ? 0 : Number(doc.system?.actions?.value) || 1, stance: false, model, ...(belowHalf ? { belowHalf: true } : {}) }, doc.name);
    return { spells: [], pools: {}, gap: null, played: `its text's self buff (${rules.map((rule) => `${rule.key} ${rule.selector ?? rule.type ?? ""} ${rule.value}`.replace(/\s+/g, " ")).join(", ")})` };
}

// (2026-11-03, the class feats no fight played: Ocean's Balm, Rallying Banner — healing written as an inline @Damage[…[healing]].) The feat
// as a healing spell the spell compiler reads, as Soothe is: one willing creature (touch, or the range it names), the dice at the PC's level,
// from a pool of its frequency. Only an action without a requirement.
function inlineHealEntry(doc, level) {
    if ((doc.system?.actionType?.value ?? "passive") !== "action" || !alwaysMet(doc)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const hit = /@Damage\[((?:[^\[\]]|\[[^\]]*\])*?\[healing\])(?:\|[^\]]*)?\]/.exec(html);
    // (One creature only: Rallying Banner's "each ally in your banner's aura" isn't this.)
    if (!hit || /@Check\[(?:type:)?(?:reflex|fortitude|will)/.test(html) || /\beach (?:ally|creature|of your allies)\b|@Template/i.test(html)) return null;
    // (2026-11-03: not a heal with a condition the simulator doesn't check — You Can't Keep Us Down's dying allies, Reclaim Power's thralls,
    // Cleansing Spell's next healing spell, Vital Compound Invocation's runes.)
    if (/\b(?:Dying|Unconscious|thralls?|next action|Invoke)\b/i.test(html.replace(/<[^>]+>/g, " ").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1"))) return null;
    const read = inlineFormula(hit[1].replace(/\[healing\]$/, ""), level);
    if (!read) return null;
    const range = /\btouch\b/i.test(html) ? "touch" : /within (\d+) feet/i.exec(html) ? `${/within (\d+) feet/i.exec(html)[1]} feet` : "touch";
    // (Only the healing: the rest of the text — Ocean's Balm's fire resistance — reads as something else to the compiler.)
    const spell = { ...doc, type: "spell", system: { ...doc.system, rules: [], traits: { value: ["healing", "manipulate"], rarity: "common" }, description: { value: `<p>You heal the target's wounds. The target regains ${read.formula} Hit Points when you Cast the Spell.</p>` }, level: { value: 1 }, heightening: undefined, time: { value: String(doc.system?.actions?.value ?? 1) }, area: null, target: { value: "1 willing creature" }, range: { value: range }, defense: null, damage: { 0: { applyMod: false, category: null, formula: read.formula, kinds: ["healing"], materials: [], type: "untyped" } } } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!plan?.resolution || ["unsupported", "no-effect"].includes(plan.resolution.kind)) return null;
    const uses = Number(doc.system?.frequency?.max) || 0;
    const pool = uses ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan, castRank: Math.max(1, Math.ceil(level / 2)), dc: null, attack: null, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, 1), spell, 1) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: uses } : {}, gap: null, played: `heals ${read.formula} (${range}${uses ? `, ${uses}/fight` : ""})` };
}

// (2026-11-03, the class feats no fight played: Farabellus Flip, Sense the Strike — a reaction's bonus to AC against the attack that sets it
// off.) The engine's acReaction: "targets you with a (melee|ranged) Strike/attack" → as it's targeted, "hits you" → after the hit (it may turn
// it); its "+N circumstance bonus to AC against the triggering attack". Nothing else in the reaction is played.
// (Or a stance it needs — Stalwart Song's "You're in Tenacious Stance" —, which partyWithFeatOwn gives the PC on both sides.)
const alwaysMet = (doc) => !requirementText(doc) || pcNeeds(requirementText(doc))?.length === 0 || Boolean(requiredStances(requirementText(doc)));
function acReactionEntry(doc, builtins) {
    // (Flashy Dodge's "You aren't Encumbered": met.)
    if ((doc.system?.actionType?.value ?? "passive") !== "reaction" || !alwaysMet(doc)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const trigger = /<strong>\s*Trigger\s*<\/strong>\s*([^<]*)/i.exec(html)?.[1]?.trim().replace(/\.$/, "") ?? "";
    const bonus = /\+(\d) circumstance bonus to (?:your )?AC against (?:the )?(?:triggering|that) (?:attack|Strike)/i.exec(html);
    // (2026-11-05: "The triggering attack roll targets your Perception/Survival DC instead of your AC" — Foresee Danger, Sense the Strike.)
    const instead = /attack(?: roll)? targets your (Perception|[A-Z][a-z]+) DC instead of your AC/.exec(html.replace(/<[^>]+>/g, ""));
    if (!bonus && !instead) return null;
    // (Dodge Away's "You are the target of a melee attack", Cut From the Air's "… a physical ranged Strike", Inked Panoply's "A creature
    // targets you with an attack, and you can see the attacker".)
    const targeted = /^(?:An? (?:enemy|creature|foe|opponent)(?: you can see| you're observing| you are observing)? (?:targets you with|attempts) an? (melee |ranged )?(?:weapon )?(?:Strike|attack)(?: against you)?|You are targeted (?:with|by) an? (melee |ranged )?(?:Strike|attack)(?: by an? (?:observed )?(?:attacker|enemy|creature))?|An? creature targets you with an attack,? and you can see the attacker|An? creature you can see targets you with an attack against your AC|You(?:'re| are) the target of an? (?:physical )?(melee |ranged )?(?:Strike|attack)|An? (?:enemy|creature|foe) within your reach targets you with an? (melee )?(?:Strike|attack),? and you(?:'re| are) aware of the attack)$/i.exec(trigger);
    const hit = /^An? (?:enemy|creature|foe) hits you with an? (melee |ranged )?(?:Strike|attack)$/i.exec(trigger);
    const read = targeted ?? hit;
    if (!read) return null;
    const kind = (read[1] ?? read[2] ?? read[3] ?? read[4] ?? "").trim();
    if (instead && !bonus) {
        if (!targeted) return null;
        builtins.acReaction = { value: 0, dcInstead: instead[1].toLowerCase(), when: "targeted", name: doc.name, ...(kind ? { against: kind } : {}) };
        return { spells: [], pools: {}, gap: null, played: `its ${instead[1]} DC in place of its AC as it's targeted (reaction, when higher)` };
    }
    builtins.acReaction = { value: Number(bonus[1]), when: targeted ? "targeted" : "hit", name: doc.name, ...(kind ? { against: kind } : {}) };
    return { spells: [], pools: {}, gap: null, played: `+${bonus[1]} AC as a reaction ${targeted ? "when targeted" : "against a hit"}${kind ? ` (${kind})` : ""}` };
}

// (2026-11-03, the class feats no fight played: Charmed Life — a reaction's bonus to a save it makes before the roll.) The engine's
// saveBonusReaction (Occult Ward's): "You attempt a saving throw[ against a spell / a <trait> effect], but you haven't rolled yet" and "+N
// circumstance/status bonus to the triggering save". Only what a fight here meets (not a hazard's).
function saveBonusEntry(doc, builtins) {
    if ((doc.system?.actionType?.value ?? "passive") !== "reaction" || !alwaysMet(doc)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const trigger = (/<strong>\s*Trigger\s*<\/strong>\s*([^<]*)/i.exec(html)?.[1] ?? "").replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").trim().replace(/\.$/, "");
    const bonus = /\+(\d) (?:circumstance|status) bonus to (?:the|your) (?:triggering )?sav(?:e|ing throw)/i.exec(html);
    if (!bonus) return null;
    const read = /^You(?:'re| are)? (?:attempt|about to attempt|about to roll|roll) an? (Fortitude|Reflex|Will)? ?sav(?:e|ing throw)(?: against an? (spell|magical effect|[a-z]+ effect))?(?:,? but (?:you )?haven't rolled(?: yet)?)?$/i.exec(trigger);
    if (!read) return null;
    const against = !read[2] ? null : /^spell$/i.test(read[2]) ? "spell" : /^magical/i.test(read[2]) ? "magical" : read[2].toLowerCase().replace(/ effect$/, "");
    builtins.saveBonusReaction = { name: doc.name, value: Number(bonus[1]), against, ...(read[1] ? { kind: read[1].toLowerCase() } : {}) };
    return { spells: [], pools: {}, gap: null, played: `+${bonus[1]} to a ${read[1] ? `${read[1]} ` : ""}save as a reaction${against ? ` (against ${against})` : ""}` };
}

// (2026-11-03, the class feats no fight played: Dragon's Rage Breath, Megavolt, Stomp Ground — a save in an area written with PF2e's inline
// rolls, which the feat module reads nothing for.) The feat as a spell the spell compiler reads: its @Template's area, its @Check's save, its
// first @Damage's dice at the PC's level (a type PF2e fills in from the actor — a dragon instinct's — is fire), at the PC's class DC, from a
// pool of its frequency. Only an action without a requirement.
const LEVEL_MATH = { floor: Math.floor, ceil: Math.ceil, max: Math.max, min: Math.min, ternary: (test, a, b) => (test ? a : b), gte: (a, b) => a >= b, gt: (a, b) => a > b, lte: (a, b) => a <= b, lt: (a, b) => a < b };
function inlineFormula(raw, level) {
    // (2026-11-03, Nudge the Scales' "(2*(1+@actor.level))[healing]": a flat amount, no dice.)
    const flat = /^\(?([^\[\]]*?)\)?(?:\[([^\]]*)\])?$/.exec(raw.trim());
    if (flat && !/\dd\d|\bd\d/.test(flat[1])) {
        const expr = flat[1].replace(/@actor\.level/g, String(level)).replace(/@item\.level/g, String(level));
        if (!/^[\d\s()+\-*/,a-z]*$/.test(expr) || /[a-z]/.test(expr.replace(/\b(?:floor|ceil|max|min|ternary|gte|gt|lte|lt)\b/g, ""))) return null;
        let amount;
        try {
            amount = Function(...Object.keys(LEVEL_MATH), `return (${expr || 0});`)(...Object.values(LEVEL_MATH));
        } catch {
            return null;
        }
        if (!Number.isFinite(amount) || amount < 1) return null;
        const kinds = String(flat[2] ?? "").split(",");
        const type = kinds.find((kind) => /^[a-z]+$/.test(kind) && !["persistent", "splash", "precision"].includes(kind)) ?? "fire";
        return { formula: String(Math.floor(amount)), type, ...(kinds.includes("persistent") ? { category: "persistent" } : {}) };
    }
    const m = /^(.*?)d(\d+)(?:\[([^\]]*)\])?$/.exec(raw.trim());
    if (!m) return null;
    const expr = m[1].replace(/@actor\.level/g, String(level)).replace(/@item\.level/g, String(level));
    if (!/^[\d\s()+\-*/,a-z]*$/.test(expr) || /[a-z]/.test(expr.replace(/\b(?:floor|ceil|max|min|ternary|gte|gt|lte|lt)\b/g, ""))) return null;
    let count;
    try {
        count = Function(...Object.keys(LEVEL_MATH), `return (${expr || 1});`)(...Object.values(LEVEL_MATH));
    } catch {
        return null;
    }
    if (!Number.isFinite(count) || count < 1) return null;
    const kinds = String(m[3] ?? "").split(",");
    const type = kinds.find((kind) => /^[a-z]+$/.test(kind) && !["persistent", "splash", "precision"].includes(kind)) ?? "fire";
    return { formula: `${Math.floor(count)}d${m[2]}`, type, ...(kinds.includes("persistent") ? { category: "persistent" } : {}) };
}
function inlineSaveEntry(doc, level, host) {
    // (2026-11-03, Elemental Explosion's "You're raging, and you haven't used this ability since you last Raged": while raging, once a
    // fight — a Rage lasts it.)
    const raging = /^You(?:'re| are) raging\b/i.test(requirementText(doc) ?? "") && (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage");
    if ((doc.system?.actionType?.value ?? "passive") !== "action" || !(raging || alwaysMet(doc))) return null;
    // (2026-11-03, Deep Freeze: an inventor's Unstable Function — a bigger version with its own risk — isn't the action's own.)
    const html = String(doc.system?.description?.value ?? "").split(/Unstable Function/)[0];
    const template = /@Template\[(?:type:)?(\w+)\|distance:(\d+)/.exec(html);
    const check = /@Check\[(?:type:)?(reflex|fortitude|will)\b([^\]]*)\]/.exec(html);
    // (One creature instead — Fling Head's "an enemy within 30 feet", Witchwood Seed's touch.)
    const reach = template ? null : /\b(?:an? (?:creature|enemy|foe|target)|a creature you target|(?:Select|Choose|Target) (?:a|one) (?:creature|enemy|foe)) within (\d+) feet\b/i.exec(html) ? { range: `${/within (\d+) feet/i.exec(html)[1]} feet` } : /\bYou touch a creature\b/i.test(html) ? { range: "touch" } : null;
    if ((!template && !reach) || !check) return null;
    const damageHit = /@Damage\[((?:[^\[\]]|\[[^\]]*\])*?)(?:\|[^\]]*)?\]/.exec(html);
    const damage = damageHit ? inlineFormula(damageHit[1], level) : null;
    if (damageHit && !damage) return null;
    const text = html.replace(/@Damage\[(?:[^\[\]]|\[[^\]]*\])*\]/g, (all) => {
        const read = inlineFormula(/@Damage\[((?:[^\[\]]|\[[^\]]*\])*?)(?:\|[^\]]*)?\]/.exec(all)?.[1] ?? "", level);
        return read ? `${read.formula} ${read.category ? "persistent " : ""}${read.type}` : all;
    });
    const spell = { ...doc, type: "spell", system: { ...doc.system, description: { value: text }, level: { value: 1 }, heightening: undefined, time: { value: String(doc.system?.actions?.value ?? 1) }, area: template ? { type: template[1], value: Number(template[2]) } : null, target: { value: template ? "" : "1 creature" }, range: { value: reach?.range ?? "" }, defense: { save: { statistic: check[1], basic: /\bbasic\b/.test(check[2]) } }, damage: damage ? { 0: { applyMod: false, category: damage.category ?? null, formula: damage.formula, kinds: ["damage"], materials: [], type: damage.type } } : {} } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!plan?.resolution || ["unsupported", "no-effect"].includes(plan.resolution.kind)) return null;
    const own = dcsOf(host);
    const dc = own.class ?? own.spell ?? 10 + level + 2;
    const castRank = Math.max(1, Math.ceil(level / 2));
    const uses = Number(doc.system?.frequency?.max) || (raging ? 1 : 0);
    const pool = uses ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan: raging ? { ...plan, requires: "raging" } : plan, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: uses } : {}, gap: null, played: `inline save: ${template ? `${template[2]}-foot ${template[1]}` : `1 creature, ${reach.range}`}, ${check[1]}${damage ? `, ${damage.formula} ${damage.type}` : ""} (DC ${dc}${uses ? `, ${uses}/fight` : ""})` };
}

// (2026-11-03, the class feats no fight played: Scouring Rage — as it Rages, each enemy within 20 feet takes its level in damage, a basic
// Fortitude save at its class DC, of its Rage's damage type: its Strike's.) Compiled as an inline save is, set off by the engine's Rage
// (spells.js rageTriggers), never cast on its own.
function rageSaveEntry(doc, level, host) {
    if (slugOf(doc) !== "scouring-rage" || !(host?.selfBuffs ?? []).some((buff) => buff.name === "Rage")) return null;
    const type = (host.strikes ?? []).find((strike) => strike.melee)?.damage?.[0]?.type ?? "bludgeoning";
    const spell = { ...doc, type: "spell", system: { ...doc.system, description: { value: `<p>Each enemy in a 20-foot emanation takes ${level} ${type} damage (basic Fortitude save).</p>` }, level: { value: 1 }, heightening: undefined, time: { value: "1" }, area: { type: "emanation", value: 20 }, target: { value: "" }, range: { value: "" }, defense: { save: { statistic: "fortitude", basic: true } }, damage: { 0: { applyMod: false, category: null, formula: String(level), kinds: ["damage"], materials: [], type } } } };
    let plan;
    try {
        plan = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (plan?.resolution?.kind !== "save") return null;
    const own = dcsOf(host);
    const dc = own.class ?? 10 + level + 2;
    const castRank = Math.max(1, Math.ceil(level / 2));
    const entry = { name: doc.name, plan: { ...plan, trigger: { event: "rage" } }, castRank, dc, attack: dc - 10, pool: null, effects: spellPack.effectModels(plan, castRank) };
    return { spells: [entry], pools: {}, gap: null, played: `as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC ${dc}) or takes ${level} ${type}` };
}

// (2026-11-03, the class feats no fight played: Quaking Stomp's "Cast as Earthquake".) The feat module's spell-like plan: the spell it names at
// its rank (else half the PC's level rounded up) and DC, in the feat's own actions, from a pool of its frequency (none: at will). A reaction or
// free action's cast isn't played (the engine casts on the PC's turn).
function spellLikeEntry(doc, level, plan) {
    if (plan?.builtin !== "spell-like" || !plan.spell) return null;
    const type = doc.system?.actionType?.value ?? "passive";
    if (type !== "action") return null;
    const named = String(plan.spell.uuid ?? "").replace(/^.*\.Item\./, "");
    const spell = spellPack.spellNamed(plan.spell.name ?? named) ?? spellPack.spellNamed(named) ?? spellPack.spellById?.(named) ?? null;
    if (!spell) return null;
    let compiled;
    try {
        compiled = spellPack.compileSpell(spell);
    } catch {
        return null;
    }
    if (!compiled?.resolution || ["unsupported", "no-effect"].includes(compiled.resolution.kind)) return null;
    const actions = Number(plan.actions ?? doc.system?.actions?.value) || null;
    if (actions && compiled.activation) compiled = { ...compiled, activation: { ...compiled.activation, time: String(actions) } };
    const castRank = Number(plan.rank) || Math.max(1, Math.ceil(level / 2), Number(spell.system?.level?.value) || 1);
    const dc = Number(plan.dc) || 10 + level + 2;
    const uses = Number(doc.system?.frequency?.max) || 0;
    const pool = uses ? `feat:${doc._id}` : null;
    const entry = { name: `${spell.name} (${doc.name})`, plan: compiled, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(compiled, castRank), spell, castRank) };
    if (!castable(entry)) return null;
    return { spells: [entry], pools: pool ? { [pool]: uses } : {}, gap: null, played: `casts ${spell.name} (rank ${castRank}, DC ${dc}${uses ? `, ${uses}/fight` : ""})` };
}

// (2026-11-03, Cole: "begin working on implementing them" — the class feats no fight played: "You learn the Hymn of Healing composition spell",
// "You gain the Fungal Exhalation order spell".) A focus spell the feat teaches: cast at half the PC's level rounded up from its Focus Points,
// one more point for it (three at most), at its spell DC — else its class DC.
export function taughtFocusSpells(doc) {
    const text = String(doc.system?.description?.value ?? "");
    const found = [];
    for (const hit of text.matchAll(/\b(?:learn|gain|learns|gains)\s+(?:the\s+)?(?:@UUID\[Compendium\.pf2e\.spells-srd\.Item\.([^\]]+)\](?:\{([^}]*)\})?)\s+(?:[\w-]+\s+){0,2}?(?:spell|cantrip|hex|composition)/gi)) {
        const spell = spellPack.spellNamed(hit[1]) ?? spellPack.spellNamed(hit[2] ?? "") ?? spellPack.spellById?.(hit[1]) ?? null;
        if (!spell || !(spell.system?.traits?.value ?? []).includes("focus") || found.includes(spell)) continue;
        found.push(spell);
    }
    return found;
}
function focusSpellEntry(doc, level, host) {
    const spells = taughtFocusSpells(doc);
    if (!spells.length) return null;
    const own = dcsOf(host);
    const dc = own.spell ?? own.class ?? 10 + level + 2;
    const castRank = Math.max(1, Math.ceil(level / 2));
    const pool = `${host.id}:focus`;
    const entries = [];
    for (const spell of spells) {
        let plan;
        try {
            plan = spellPack.compileSpell(spell);
        } catch {
            continue;
        }
        // (2026-11-03: Lay on Hands, whose compiled plan says "unsupported" but which the engine heals with as it does a champion's — spells.js
        // reads its healing from the text. Not other unsupported ones: Heal Companion went to the wizard.)
        if (!plan?.resolution || plan.resolution.kind === "no-effect" || (plan.resolution.kind === "unsupported" && !["Lay on Hands", "Heal Companion"].includes(spell.name))) continue;
        const cantrip = (spell.system?.traits?.value ?? []).includes("cantrip");
        const entry = { name: `${spell.name} (${doc.name})`, fromFeat: true, plan, castRank, dc, attack: dc - 10, pool: cantrip ? null : pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
        if (castable(entry)) entries.push(entry);
    }
    if (!entries.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: a spell the engine doesn't cast (${spells.map((each) => (each.spell ?? each).name).join(", ")})` } };
    const pools = entries.some((entry) => entry.pool) ? { [pool]: Math.min(3, (host.spellPools?.[pool] ?? 0) + 1) } : {};
    return { spells: entries, pools, gap: null, played: `focus spell${entries.length > 1 ? "s" : ""}: ${entries.map((entry) => `${entry.name.replace(/ \(.*$/, "")} (rank ${castRank})`).join(", ")}` };
}

// (2026-11-03, the class feats no fight played: passives that change a class feature, read by hand where neither the feat module nor PF2e's
// rules have anything — the builtins they put on the PC.)
// (2026-11-05: a HAND Strike activity — the feat-abilities strike-activity plan, its rider on top.)
const simplePoison = (level, dice) => ({ name: "Poison Weapon", featForced: true, actions: 1, doses: level, damage: `${dice}[poison]`, spell: { name: "simple poison", plan: null, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" } });
const strikeRider = ({ onHit = {}, ...rest } = {}) => ({ builtin: "strike-activity", actions: 1, strides: 0, strike: null, ...rest, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, ...onHit } });

// (2026-11-05, the kineticist's kinetic aura: a stance impulse that works in it — a 10-foot emanation about the kineticist that moves with
// it and lasts the fight (zones.js: the creatures in its Melee). Its effect on the PC and its allies inside (model), the damage a foe
// takes as it starts its turn there (start) or moves in (enter). One action, once — its stance kept up. What it does only after a move
// action, its heals on a critical, and the Shock rune aren't played.)
// A save plan on Fear's compiled shape: its statistic, a condition on a failure and on a critical failure (Winter Sleet's prone).
function conditionSavePlan(doc, statistic, failure, criticalFailure, success = null) {
    const fear = spellPack.spellNamed("Fear");
    let base;
    try {
        base = fear && spellPack.compileSpell(fear);
    } catch {
        base = null;
    }
    if (!base?.resolution?.outcomes?.failure) return null;
    const row = (condition) => ({ ...structuredClone(base.resolution.outcomes.failure), effects: condition ? [{ kind: "condition", slug: condition[0], name: condition[0], value: condition[1], duration: condition[2] ?? null, source: doc.name }] : [], rawText: "" });
    return { ...base, source: { ...base.source, name: doc.name }, traits: [...(doc.system?.traits?.value ?? [])], heightening: null, resolution: { ...base.resolution, check: { ...base.resolution.check, statistic }, outcomes: { criticalSuccess: row(null), success: row(success), failure: row(failure), criticalFailure: row(criticalFailure) } } };
}

function kineticAura(doc, { model = null, start = null, enter = null, saves = null, castAs = null, played }) {
    const uuid = `feat:${doc._id}:aura`;
    const zone = { area: { type: "emanation", value: 10 }, lasts: null, ...(start ? { damage: [{ when: "start", formulas: [start] }] } : {}), ...(enter ? { hazard: { formulas: [enter] } } : {}), ...(model ? { effect: { allies: true, uuid, label: doc.name } } : {}), ...(saves ? { saves } : {}), ...(castAs ? { castAs } : {}) };
    const effectModel = model ? { name: doc.name, rounds: 100, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...model } : null;
    const entry = zoneSpell(doc.name, { builtin: "zone", actions: 1, trigger: { event: "use" }, zone }, effectModel ? { effectModel } : {});
    if (!entry) return null;
    entry.plan = { ...entry.plan, traits: [...(doc.system?.traits?.value ?? [])] };
    return { builtins: {}, spells: [{ ...entry, featForced: true }], played: `${played} in its 10-foot kinetic aura (stance, the fight)` };
}

function armorImpulse(level, { item, cap, speed }) {
    const dex = level >= 20 ? 4 : level >= 10 ? 3 : 2;
    const gain = item + Math.min(dex, cap) - (2 + Math.min(dex, 3));
    return { builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, model: { rounds: 100, modifiers: [...(gain ? [{ on: "ac", type: "item", value: gain }] : []), { on: "speed", type: "untyped", value: speed }] } }], played: `its impulse armor for the fight: ${gain >= 0 ? "+" : ""}${gain} AC, ${speed} feet Speed (1 action)` };
}

// (2026-11-06, thralls as bodies: a necromancer's focus spell cast through one of its thralls — thralls.js; destroyed when it says so;
// once a fight, its one focus point.)
const ONE_ROUND = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" };
function thrallFocus(doc, level, host, entry, { destroyed, actions = 2 } = {}) {
    if (!entry) return null;
    const dc = dcsOf(host).spell ?? 10 + level + 2 + 4;
    const pool = `feat:${doc._id}`;
    return { ...entry, name: entry.name ?? doc.name, castRank: Math.max(1, Math.ceil(level / 2)), dc: entry.dc ?? dc, attack: entry.attack ?? dc - 10, pool, featForced: true,
        plan: { ...entry.plan, activation: { ...(entry.plan.activation ?? {}), time: String(actions) }, targeting: { ...entry.plan.targeting, thrall: { destroyed: Boolean(destroyed) } } } };
}
function thrallSaveSpell(doc, level, host, statistic, outcomes, played, actions = 2) {
    const plan = conditionSavePlan(doc, statistic, outcomes.failure, outcomes.criticalFailure, outcomes.success);
    const entry = plan && thrallFocus(doc, level, host, { name: doc.name, plan, effects: {} }, { destroyed: true, actions });
    if (!entry || !castable(entry)) return null;
    return { builtins: {}, spells: [entry], pools: { [entry.pool]: 1 }, played: `${played} (its focus spell, a thrall destroyed, once a fight)` };
}
function thrallAllySpell(doc, level, host, { model, rounds, destroyed, played }) {
    const fake = { _id: doc._id, name: doc.name, type: "feat", system: { slug: `thrall-${slugOf(doc)}`, actionType: { value: "action" }, actions: { value: 2 }, traits: { value: ["concentrate", "manipulate"] }, description: { value: "<p>Choose an ally within 30 feet.</p>" } } };
    ALLY_BUFFS[fake.system.slug] = () => ({ feet: 30, model, rounds, played });
    const read = allyEffectEntry(fake, level);
    const entry = read?.spells?.[0] && thrallFocus(doc, level, host, read.spells[0], { destroyed });
    if (!entry) return null;
    return { builtins: {}, spells: [entry], pools: { [entry.pool]: 1 }, played: `${played} (its focus spell${destroyed ? ", a thrall destroyed" : ""}, once a fight)` };
}

const HAND = {
    // A precision die on a hit at a creature that isn't off-guard, two from 14th when its sneak attack is 3d6 or more.
    "sly-striker": (level) => ({ builtins: { strikeExtras: [{ when: "not-off-guard", dice: level >= 14 ? 2 : 1, die: 6, precision: true, type: null, source: "Sly Striker" }] }, played: "precision damage on a hit (always on)" }),
    // A melee critical hit's extra weapon die (not doubled) and persistent bleed of two of its dice.
    // (A frightened creature off-guard to the PC — actions.js.)
    // (2026-11-04: a Strike, then its target off-guard to the next one this turn — the Step to its other side not played.)
    "murderers-circle": () => ({ builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, offGuardNext: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a Strike, then the target off-guard to the next one this turn" }),
    // (2026-11-04: ranged Strikes that ignore the target's concealment and cover — Targeting Shot at the hunted prey, a press; Incredible
    // Ricochet, a press (at a creature attacked this turn, not checked here); Homing Shot.)
    "targeting-shot": () => ({ requires: "You are wielding a bow.", builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, range: "ranged", press: true, unerring: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a ranged press Strike ignoring concealment and cover" }),
    "incredible-ricochet": () => ({ requires: "You are wielding a bow.", builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, range: "ranged", press: true, unerring: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a ranged press Strike ignoring concealment and cover" }),
    "homing-shot": () => ({ requires: "You are wielding a bow.", builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, range: "ranged", unerring: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a ranged Strike ignoring concealment and cover" }),
    // (2026-11-04: a ranged Strike whose failure still deals one weapon die; a press Strike at a prone creature with a circumstance bonus
    // of its weapon dice — PF2e's rules on Advantageous Assault hold the bonus; grabbed and restrained targets aren't counted here.)
    "flesh-wound": () => ({ requires: "You are wielding a bow.", builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, range: "ranged", failureDice: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a ranged Strike whose failure deals a weapon die" }),
    "advantageous-assault": () => ({ builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, press: true, requires: "prone", damagePerWeaponDie: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a press Strike at a prone foe, + its weapon dice in damage" }),
    // (2026-11-04: Deflect Projectile, and a deflected ranged attack thrown back at the attacker.)
    "projectile-snatching": () => ({ builtins: { acReaction: { value: 4, when: "targeted", name: "Deflect Projectile", against: "ranged", snatch: true } }, played: "Deflect Projectile, a deflected attack thrown back (reaction)" }),
    // (2026-11-04, reactions' Strikes: a riposte on a critical miss with the Aldori dueling sword; a ranged Strike when an ally's ranged
    // Strike hits (–2), or with +2 when an ally — the spotter — critically hits.)
    "aldori-riposte": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "a riposte Strike on a critical miss (reaction)" }),
    "target-of-opportunity": () => ({ builtins: { reactionStrikes: [{ name: "Target of Opportunity", triggers: ["ally-hit"], allyRanged: true, ranged: true, strike: "", penalty: 2, disrupts: false }] }, played: "a ranged Strike (–2) when an ally's ranged Strike hits (reaction)" }),
    "exploit-opening": () => ({ builtins: { reactionStrikes: [{ name: "Exploit Opening", triggers: ["ally-hit"], critOnly: true, ranged: true, strike: "", penalty: -2, disrupts: false }] }, played: "a ranged Strike (+2) when an ally critically hits (reaction)" }),
    // (2026-11-05: Debilitating Strike's debilitation as clumsy 1 — the other new one, weakness 5 to a physical type, the engine has no
    // condition for; Tactical Debilitations' no reactions, as its conditions don't.)
    "tactical-debilitations": () => ({ builtins: { debilitation: { lockReactions: true } }, played: "Debilitating Strike's no reactions in place of enfeebled 1" }),
    // (2026-11-05, Precise Debilitations: off-guard in its place — what helps the rogue's own sneak attack and its allies; its other one,
    // 2d6 more precision from its attacks, isn't played.)
    "precise-debilitations": () => ({ builtins: { debilitation: { slug: "off-guard", value: null } }, played: "Debilitating Strike's off-guard in place of enfeebled 1" }),
    "vicious-debilitations": () => ({ builtins: { debilitation: { slug: "clumsy", value: 1 } }, played: "Debilitating Strike's clumsy 1 in place of enfeebled 1" }),
    // (2026-11-05: 2d6 more precision on its next sneak attack this turn, 3d6 at 11th, 4d6 at 17th — a self-effect for its next Strike
    // whose dice count only at an off-guard target, offGuardOnly. The Recall Knowledge it needs first isn't played: taken as known.)
    "analyze-weakness": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, nextStrike: true, offGuardOnly: true, damage: [`${level >= 17 ? 4 : level >= 11 ? 3 : 2}d6[precision]`], model: { rounds: 1 } }], played: "+2d6 precision on its next sneak attack (1 action)" }),
    // (2026-11-05: raging, straight after a melee Strike that missed, a Strike with backswing — +1, after that miss — and forceful — its
    // weapon dice in damage as its second attack, taken as that.)
    "follow-up-assault": () => ({ builtins: {}, plans: [{ builtin: "strike-activity", actions: 1, strides: 0, strike: null, requires: "raging", after: { on: ["failure", "criticalFailure"], melee: true }, attackBonus: 1, damagePerWeaponDie: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "after a missed melee Strike, raging: a Strike +1 with its weapon dice in damage" }),
    // (2026-11-05: three actions, a ranged Strike at maximum damage, then its turn ends. Hunted prey and the not-reloaded-since-last-turn
    // requirement aren't checked.)
    "perfect-shot": () => ({ requires: "You are wielding a loaded ranged weapon.", builtins: {}, plans: [{ builtin: "strike-activity", actions: 3, strides: 0, strike: null, range: "ranged", maxDice: true, endsTurn: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a ranged Strike at maximum damage, then its turn ends (3 actions)" }),
    // (Its full sneak attack, 4d6 at 17th, on a hit at a creature that isn't off-guard.)
    "impossible-striker": (level) => ({ builtins: { strikeExtras: [{ when: "not-off-guard", dice: level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1, die: 6, precision: true, type: null, source: "Impossible Striker" }] }, played: "full sneak attack on a creature that isn't off-guard (always on)" }),
    // (No flat check against a concealed target, DC 5 against a hidden one, and not off-guard to hidden creatures — sight.js blindFought.)
    "blind-fight": () => ({ builtins: { blindFight: true }, played: "concealed and hidden targets easier to hit, not off-guard to hidden foes (always on)" }),
    "dread-striker": () => ({ builtins: { dreadStriker: true }, played: "frightened foes are off-guard to it (always on)" }),
    // (Reactive Strike, as a fighter's.)
    "reactive-striker": () => ({ builtins: { reactions: { aoo: true } }, played: "Reactive Strike" }),
    // (The rogue's Sneak Attack at 1d4, 1d6 from 6th.)
    "sneak-attacker": (level) => ({ builtins: { strikeExtras: [{ when: "off-guard", dice: 1, die: level >= 6 ? 6 : 4, precision: true, type: null, source: "Sneak Attacker" }] }, played: "Sneak Attack (always on)" }),
    // (Its two-action way: an unarmed Strike with one more weapon die, two at 10th, three at 18th.)
    "one-inch-punch": (level) => ({ builtins: {}, plans: [{ builtin: "strike-activity", actions: 2, strides: 0, strike: null, extraWeaponDice: level >= 18 ? 3 : level >= 10 ? 2 : 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }], played: "a 2-action Strike with more weapon dice" }),
    // (Opportune Riposte: a melee Strike back at a creature in reach that critically fails a Strike against the PC.)
    "swashbucklers-riposte": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "Opportune Riposte (reaction Strike on a critical miss)" }),
    // (The champion archetype's reaction, played as a paladin's Retributive Strike — the champion PC's, classes.js.)
    "champions-reaction": (level) => ({ builtins: { championReaction: { slug: "retributive-strike", name: "Retributive Strike", self: false, resistance: 2 + level, dice: 1 } }, played: "Retributive Strike (reaction)" }),
    // (Sneak Attack at a fixed 1d6: Butterfly's Sting, Shadow Sneak Attack.)
    "butterflys-sting": () => ({ builtins: { strikeExtras: [{ when: "off-guard", dice: 1, die: 6, precision: true, type: null, source: "Butterfly's Sting" }] }, played: "Sneak Attack 1d6 (always on)" }),
    "shadow-sneak-attack": () => ({ builtins: { strikeExtras: [{ when: "off-guard", dice: 1, die: 6, precision: true, type: null, source: "Shadow Sneak Attack" }] }, played: "Sneak Attack 1d6 (always on)" }),
    // (3 Hit Points for each of the archetype's class feats: its dedication and this one.)
    ...Object.fromEntries(["barbarian", "champion", "fighter", "guardian", "monk", "ranger", "rogue", "swashbuckler", "investigator", "gunslinger", "inventor", "thaumaturge", "exemplar", "commander", "kineticist", "magus", "summoner", "alchemist"].map((cls) => [`${cls}-resiliency`, () => ({ builtins: { maxHpBonus: 6 }, played: "6 more Hit Points" })])),
    // (A melee Strike at a creature in reach an ally critically hits — the engine's ally-hit trigger, critical hits only.)
    "opportune-opening": () => ({ builtins: { reactionStrikes: [{ name: "Opportune Opening", triggers: ["ally-hit"], critOnly: true, strike: null, penalty: 0, disrupts: false, melee: true }] }, played: "reaction Strike on an ally's critical hit" }),
    // (Raise a Shield as a melee hit lands: its +2 AC may turn the hit — the engine's acReaction after a hit.)
    "reactive-shield": () => ({ builtins: { acReaction: { value: 2, when: "hit", name: "Reactive Shield", against: "melee" } }, played: "Raise a Shield against a melee hit (reaction)" }),
    // (Strikes at one enemy +3 status damage (+4 at master) until its next turn: the engine's self-effect damage on the PC's Strikes, the
    // target its own pick.)
    "smite": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, damage: [`${level >= 13 ? 4 : 3}[untyped]`], model: { rounds: 1 } }], played: "+3 damage on its Strikes for a round (1 action)" }),
    // (A spell at least two ranks under its highest slot, or a cantrip, an action fewer, once a fight — the engine's Quickened Casting, B72.)
    "quickened-casting": (level) => ({ builtins: { quickenedCasting: { name: "Quickened Casting", maxRank: Math.max(0, Math.ceil(level / 2) - 2) } }, played: "Quickened Casting (once a fight)" }),
    // (A DC 15 flat check against a reaction's disruption, B55.)
    "steady-spellcasting": () => ({ builtins: { steadySpellcasting: 15 }, played: "a DC 15 flat check against disruption" }),
    // (A critical hit that deals damage: the target frightened 1.)
    // (A critical hit's target off-guard to the PC until the end of its next turn.)
    "unbalancing-blow": () => ({ builtins: { strikeExtras: [{ when: "critical", offGuardToAttacker: true, source: "Unbalancing Blow" }] }, played: "off-guard to the PC after a critical hit (always on)" }),
    // (+4 AC against a ranged attack, a hand free — a monk's.)
    "deflect-projectile": () => ({ builtins: { acReaction: { value: 4, when: "targeted", name: "Deflect Projectile", against: "ranged" } }, played: "+4 AC against a ranged attack (reaction)" }),
    // (Its own half: frightened it gains 1 lower, as Bravery's — the end-of-turn help to allies in its aura isn't played.)
    "aura-of-courage": () => ({ builtins: { lessFrightened: 1 }, played: "frightened it gains 1 lower (always on)" }),
    // (A critical hit on it a normal hit on a DC 15 flat check — the engine's crit-downgrade.)
    "saving-slash": () => ({ builtins: {}, plans: [{ builtin: "crit-downgrade", dc: 15 }], played: "a critical hit on it a hit on a DC 15 flat check (reaction)" }),
    // (The attacker's hit rerolled, the lower kept — the engine's attack-misfortune.)
    "whispers-of-warning": () => ({ builtins: {}, plans: [{ builtin: "attack-misfortune" }], played: "an attack that hits it rolled twice, the lower kept (reaction)" }),
    // (15 less of the damage it would take — the engine's resist-damage; the unstable 50 isn't played.)
    "negate-damage": () => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: 15 }], played: "15 less damage (reaction)" }),
    // (Full sneak attack at a creature that isn't off-guard: 4d6 at 20th.)
    "impossible-striker": (level) => ({ builtins: { strikeExtras: [{ when: "not-off-guard", dice: level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1, die: 6, precision: true, type: null, source: "Impossible Striker" }] }, played: "full sneak attack at a creature that isn't off-guard (always on)" }),
    // (Rage on another class's PC — the fighter's —: +2 damage on its melee weapon (no instinct, no specialization), temporary Hit Points of
    // its level and Constitution modifier, −1 AC; the class's own Rage, classes.js.)
    "barbarian-dedication": (level, host) => {
        const weapon = (host?.strikes ?? []).find((strike) => strike.melee && !strike.unarmed);
        if (!weapon || (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage")) return null;
        const con = 2 + (level >= 5) + (level >= 10) + (level >= 20);
        return { builtins: { selfBuffs: [{ name: "Rage", actions: 1, tempHp: level + con, noConcentrate: true, acPenalty: 1, strikeDeltas: { [weapon.name]: [{ dice: 0, die: 0, bonus: 2, multiplier: 1, type: weapon.damage?.[0]?.type ?? "slashing", precision: false, persistent: false }] } }] }, played: `Rage (+2 damage with its ${weapon.name})` };
    },
    // (Half the damage of an attack that would drop it to 0 Hit Points, a free action once a fight — the engine's resist-damage "half".)
    "defensive-roll": () => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: "half", attack: true, foe: true, lethal: true, free: true, uses: 1 }], played: "half the damage of an attack that would drop it (once a fight)" }),
    // (An enemy's hit rerolled, the lower kept, or a failed save rerolled — the engine's attack-misfortune and save-reroll, one reaction.)
    "impossible-technique": () => ({ builtins: {}, plans: [{ builtin: "attack-misfortune" }, { builtin: "save-reroll", save: null }], played: "an enemy's hit rerolled lower, or a failed save rerolled (reaction)" }),
    // (+2 AC as a Strike targets it; its +2 to a save against a spell isn't played.)
    "preternatural-parry": () => ({ builtins: { acReaction: { value: 2, when: "targeted", name: "Preternatural Parry" } }, played: "+2 AC as it's targeted (reaction)" }),
    // (A Strike back at an enemy that critically misses it; the Stride for off-guard isn't played.)
    "clang": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "a reaction Strike on a critical miss" }),
    // (+2 damage on its Strikes while in the stance — a ranged PC's, the requirement's; the volley penalty it drops isn't played.)
    "point-blank-stance": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, damage: ["2[untyped]"] }], played: "stance: +2 damage on its Strikes" }),
    // (Raging at half its Hit Points or fewer: +2 attack, -1 AC and saves, a free action at its turn — the engine's self-effect while raging.)
    "desperate-wrath": (_level, host) => (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage") ? ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 0, requires: "raging", belowHalf: true, model: { rounds: 10, modifiers: [{ on: "attack", type: "circumstance", value: 2 }, { on: "ac", type: "untyped", value: -1 }, ...["fortitude", "reflex", "will"].map((on) => ({ on, type: "untyped", value: -1 }))] } }], played: "+2 attack, -1 AC and saves while raging at half Hit Points" }) : null,
    // (Damage equal to its weapon's dice on its Strikes for the fight — one dice a striking rune; the penalty against other foes and the
    // one-handed-weapon wording aren't played.)
    "duelists-challenge": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, damage: [`${level >= 19 ? 4 : level >= 12 ? 3 : level >= 4 ? 2 : 1}[untyped]`], model: { rounds: 100 } }], played: "+its weapon dice damage on its Strikes (1 action, the fight)" }),
    // (Resistance of half its level against a critical hit on it — the engine's crit-resistance; the reload or Stand and the +1 after aren't played.)
    "equitable-defense": (level) => ({ builtins: {}, plans: [{ builtin: "crit-resistance", value: Math.max(1, Math.floor(level / 2)) }], played: "resistance against a critical hit (reaction)" }),
    // (Its Constitution modifier and half its level against a critical hit on it; once a day, played as each one.)
    "scars-of-steel": (level) => ({ builtins: {}, plans: [{ builtin: "crit-resistance", value: 2 + (level >= 5) + (level >= 10) + (level >= 20) + Math.floor(level / 2) }], played: "resistance against a critical hit (reaction)" }),
    // (Temporary Hit Points of twice its level just before damage that would drop it, once a fight — as resistance of that much to the blow.)
    "deaths-door": (level) => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: 2 * level, lethal: true, uses: 1 }], played: `${2 * level} less of the damage that would drop it (once a fight)` }),
    // (The attack that would drop it does nothing, once a fight; the broken weapon and an ally's protection aren't played.)
    "transcendent-deflection": () => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: 9999, attack: true, foe: true, lethal: true, uses: 1 }], played: "an attack that would drop it negated (once a fight)" }),
    // (+2 AC against a ranged attack at it; an ally's isn't played.)
    "snap-falling-fruit": () => ({ builtins: { acReaction: { value: 2, when: "targeted", name: "Snap Falling Fruit", against: "ranged" } }, played: "+2 AC against a ranged attack (reaction)" }),
    "redirecting-draft": () => ({ builtins: { acReaction: { value: 2, when: "targeted", name: "Redirecting Draft", against: "ranged" } }, played: "+2 AC against a ranged attack (reaction)" }),
    // (+2 to a save against an emotion effect — the engine's saveBonusReaction; the temporary Hit Points and free Demoralize aren't played.)
    "stoic-as-hell": () => ({ builtins: { saveBonusReaction: { name: "Stoic as Hell", value: 2, against: "emotion" } }, played: "+2 to a save against an emotion effect (reaction)" }),
    // (Electricity and sonic equal to its weapon dice on its melee Strikes until the end of its next turn; the Grapple damage isn't played.)
    "heavens-thunder": (level) => {
        const dice = level >= 19 ? 4 : level >= 12 ? 3 : level >= 4 ? 2 : 1;
        return { builtins: {}, plans: [{ builtin: "self-effect", actions: 1, melee: true, damage: [`${dice}[electricity]`, `${dice}[sonic]`], model: { rounds: 2 } }], played: `+${dice} electricity and +${dice} sonic on its melee Strikes (1 action)` };
    },
    // (Its next melee Strike's extra spirit damage: 1d6, 2d6 at 10th, 3d6 at 18th.)
    "spirit-of-the-blade": (level) => {
        const dice = level >= 18 ? 3 : level >= 10 ? 2 : 1;
        return { builtins: {}, plans: [{ builtin: "self-effect", actions: 1, melee: true, nextStrike: true, damage: [`${dice}d6[spirit]`], model: { rounds: 1 } }], played: `+${dice}d6 spirit on its next melee Strike (1 action)` };
    },
    // (Twice the target's frightened as damage on its Strikes at a frightened creature, three times from master in Intimidation — 15th
    // here.)
    "fearsome-brute": (level) => ({ builtins: { strikeExtras: [{ when: "frightened", dice: 0, die: 0, bonus: 0, perFrightened: level >= 15 ? 3 : 2, precision: false, type: null, source: "Fearsome Brute" }] }, played: "damage of twice a foe's frightened (always on)" }),
    // (Fire damage of its level back at an adjacent creature whose melee attack hits it, once a fight — resist-damage's retort, no resistance.)
    "fiery-retort": (level) => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: 0, retort: `${level}[fire]`, melee: true, foe: true, uses: 1 }], played: `${level} fire back at a melee attacker (reaction, once a fight)` }),
    // (1d4 spirit on its weapon for the rest of its turn after a slot spell — a free action, the engine's after-cast self effect.)
    "divine-weapon": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 0, requires: "after-cast", nonCantrip: true, damage: ["1d4[spirit]"], model: { rounds: 1 } }], played: "+1d4 spirit on its Strikes after a slot spell (free)" }),
    // (1d6 force on its Strikes for the rest of its turn after a non-cantrip spell — free, the engine's after-cast self effect; the spell's own
    // damage type isn't played.)
    "bespell-strikes": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 0, requires: "after-cast", nonCantrip: true, damage: ["1d6[force]"], model: { rounds: 1 } }], played: "+1d6 force on its Strikes after a slot spell (free)" }),
    // (Raise a Shield as a Strike hits: +2 AC on that attack — the engine's acReaction after a hit; the failed save against a spell isn't
    // played.)
    "emergency-targe": () => ({ builtins: { acReaction: { value: 2, when: "hit", name: "Emergency Targe" } }, played: "+2 AC as a Strike hits (reaction)" }),
    // (+1 AC against a spell attack at it, or +1 to its save against a spell — one reaction.)
    "rune-ward": () => ({ builtins: { acReaction: { value: 1, when: "targeted", name: "Rune Ward", spellOnly: true }, saveBonusReaction: { name: "Rune Ward", value: 1, against: "spell" } }, played: "+1 AC or save against a spell (reaction)" }),
    // (Resistance of its level to an enemy's acid, bludgeoning, fire or slashing damage — its double against acid or fire isn't played.)
    "deflecting-wave": (level) => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: level, on: ["acid", "bludgeoning", "fire", "slashing"], foe: true }], played: `resistance ${level} to an enemy's acid, bludgeoning, fire or slashing damage (reaction)` }),
    // (A stance with its shield always raised — the engine's shieldUp, its shield's bonus without Raise a Shield each turn.)
    "paragons-guard": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: { shieldUp: true } }], played: "stance: its shield always raised" }),
    "buckler-dance": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: { shieldUp: true } }], played: "stance: its buckler always raised" }),
    // (Harden Flesh: resistance 3 to physical damage, but adamantine, until its next turn; +1 at 12th level and every 4 after. Its earthen
    // ground is taken as met — most battlefields' floor.)
    "harden-flesh": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, model: { rounds: 1, resistances: [{ type: "physical", value: Math.min(6, 3 + Math.max(0, Math.floor((level - 8) / 4))), exceptions: ["adamantine"] }] } }], played: "resistance to physical damage until its next turn" }),
    // (Ironblood Surge, in Ironblood Stance: +1 AC until its next turn and the stance's resistance up to its Strength — the highest
    // resistance counts, so its Strength's is enough; a Strength key's, 4, 5 at 10th, 6 at 17th.)
    "ironblood-surge": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, requiresEffect: "Ironblood Stance", model: { rounds: 1, modifiers: [{ on: "ac", type: "circumstance", value: 1 }], resistances: [{ type: "all-damage", value: level >= 17 ? 6 : level >= 10 ? 5 : 4 }] } }], played: "+1 AC and its Strength as resistance for a round" }),
    // (Wounded Rage: Rage as its reaction when it takes damage — the engine's reactionRage; Wounded Party's ally's damage isn't played.)
    "wounded-rage": (_level, host) => (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage") ? ({ builtins: { reactionRage: "Wounded Rage" }, played: "Rage as a reaction when it takes damage" }) : null,
    "wounded-party": (_level, host) => (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage") ? ({ builtins: { reactionRage: "Wounded Party" }, played: "Rage as a reaction when it takes damage (its own, not its ally's)" }) : null,
    // (Exude Demonic Corruption: until its next turn, 1d6 poison on its melee Strikes and on each creature that hits it in melee — hitBack —;
    // 2d6 at 14th level, 3d6 at 20th.)
    "exude-demonic-corruption": (level) => { const dice = level >= 20 ? 3 : level >= 14 ? 2 : 1; return { builtins: {}, plans: [{ builtin: "self-effect", actions: 1, melee: true, damage: [`${dice}d6[poison]`], model: { rounds: 1, hitBack: `${dice}d6[poison]` } }], played: `${dice}d6 poison on its melee Strikes and on who hits it, for a round` }; },
    // (Electrify Armor: for a round, 1d4 electricity on each creature that hits it in melee — hitBack —, 2d4 with the revolutionary
    // innovation, 15th level. Its unstable minute of d12s isn't played.)
    "electrify-armor": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, model: { rounds: 1, hitBack: `${level >= 15 ? 2 : 1}d4[electricity]` } }], played: "electricity on who hits it in melee, for a round" }),
    // (Surprise Attack, an archetype's: off-guard to it the first round, before they act — the rogue's makesOffGuard; its Deception or
    // Stealth initiative is taken as rolled, as the rogue's is.)
    "surprise-attack": () => ({ builtins: { makesOffGuard: [{ when: { round: 1, notActed: true }, strikes: "all", spells: true, source: "Surprise Attack" }] }, played: "foes that haven't acted are off-guard to it the first round" }),
    // (Fortified Flesh: resistance to physical damage but adamantine, its Living Monolith class feats' number — taken as 3 at 8th level,
    // the dedication, the two before this one, and 1 more every 4 levels.)
    "fortified-flesh": (level) => ({ builtins: { resistances: [{ type: "physical", value: 3 + Math.max(0, Math.floor((level - 8) / 4)), exceptions: ["adamantine"] }] }, played: "resistance to physical damage (always on)" }),
    // (Inviolable: 3d6 spirit on each creature that hits it with an attack, melee or not — hitBackAny —, always on: a free self-effect for
    // the fight.)
    "inviolable": () => ({ builtins: { passiveEffects: [{ name: "Inviolable", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, hitBack: "3d6[spirit]", hitBackAny: true }] }, played: "3d6 spirit on each creature that hits it (always on)" }),
    // (Inner Fire, in Stoked Flame Stance: cold and fire resistance half its level, and its Wisdom in fire on who hits it in melee — every
    // melee hit, not only unarmed ones; a Wisdom of 3, 4 at 10th level.)
    "inner-fire-monk": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 0, requiresEffect: "Stoked Flame Stance", model: { rounds: 100, resistances: ["cold", "fire"].map((type) => ({ type, value: Math.floor(level / 2) })), hitBack: `${level >= 10 ? 4 : 3}[fire]` } }], played: "cold and fire resistance and fire on who hits it" }),
    // (Swaggering Initiative: +2 circumstance to its initiative roll — a passive effect's, fight.js; its panache when first isn't played.)
    "swaggering-initiative": () => ({ builtins: { passiveEffects: [{ name: "Swaggering Initiative", rounds: Infinity, modifiers: [{ on: "initiative", type: "circumstance", value: 2 }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 }] }, played: "+2 to its initiative" }),
    // (Tributary Circulation: +2 circumstance to Will saves until its next turn; the poison saves and flat check aren't played.)
    "tributary-circulation": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, model: { rounds: 1, modifiers: [{ on: "will", type: "circumstance", value: 2 }] } }], played: "+2 to Will saves for a round" }),
    // (Tempo Duelist: concealed for a round.)
    "tempo-duelist": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, model: { rounds: 1, conditions: [{ slug: "concealed", value: null }] } }], played: "concealed for a round" }),
    // (Duelist's Edge: +2 circumstance to its initiative roll, as Swaggering Initiative's; drawing its weapon isn't needed — PCs start armed.)
    "duelists-edge": () => ({ builtins: { passiveEffects: [{ name: "Duelist's Edge", rounds: Infinity, modifiers: [{ on: "initiative", type: "circumstance", value: 2 }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 }] }, played: "+2 to its initiative" }),
    // (Reflexive Courage: a Reactive Strike's triggers — move, manipulate, a ranged attack — while Courageous Anthem is on it; the auditory
    // effect trigger isn't played.)
    "reflexive-courage": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["move", "manipulate", "ranged"], strike: null, penalty: 0, disrupts: false, melee: true, requiresEffect: "Spell Effect: Courageous Anthem" }], played: "a Reactive Strike while Courageous Anthem is on it" }),
    // (2026-11-05, Channel Smite: a melee Strike that, on a hit, deals a 1-action harm at its highest rank — the save failed, a critical
    // failure on a critical hit: its d8s doubled. The font spell it spends isn't counted, nor a target harm would heal.)
    "channel-smite": (level) => ({ builtins: {}, plans: [{ builtin: "strike-activity", actions: 2, strides: 0, strike: null, onHit: { conditions: [], critical: null, push: null, damage: [`${Math.ceil(level / 2)}d8[void]`], save: null, size: null } }], played: "a melee Strike with a 1-action harm on the hit (2 actions)" }),
    // (2026-11-05, Haft Beatdown: four Strikes for 3 actions, once a fight — the first two at its current multiple attack penalty, the
    // next two one step worse (5, taken as not agile). Haft Striker Stance isn't checked.)
    "haft-beatdown": () => ({ builtins: {}, plans: [{ builtin: "multi-strike", actions: 3, strikes: [null, null, null, null], sameTarget: true, sameMap: true, penalties: [0, 0, 5, 5], countsAs: 4, oncePerFight: true }], played: "four Strikes, two at its penalty and two one step worse (3 actions, once a fight)" }),
    // (2026-11-05, Great Cleave: Cleave goes on while each Strike drops its creature — fight.js. Its Cleave is played with it, as the
    // rating's barbarian doesn't have it; rage not checked.)
    "great-cleave": () => ({ builtins: { greatCleave: true, reactionStrikes: [{ name: "Cleave", triggers: ["downs"], strike: null, penalty: 0, disrupts: false }] }, played: "Cleave, going on while each Strike drops its creature (reaction)" }),
    // (2026-11-05, Nimble Strike: Nimble Dodge's +2 AC as it's targeted, and a melee Strike back with no multiple attack penalty.)
    "nimble-strike": () => ({ builtins: { acReaction: { value: 2, when: "targeted", name: "Nimble Dodge", strikeBack: "Nimble Strike" } }, played: "Nimble Dodge, then a melee Strike at the attacker (reaction)" }),
    // (2026-11-05, Shield Warden: its Shield Block for an adjacent ally — actions.js wardenBlocks.)
    "shield-warden": () => ({ builtins: { shieldWarden: true }, played: "Shield Block for an adjacent ally (reaction)" }),
    // (2026-11-05, Not So Fast!: a melee Strike at a creature leaving a square in its reach — the engine's "move" trigger. Its Speed
    // penalty isn't played, nor is Hampering Stance checked.)
    "not-so-fast": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["move"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "a reaction Strike at a creature moving out of its reach" }),
    // (Clinch Strike: an unarmed Strike on a creature that escapes its grab — the engine's "escaped" trigger.)
    "clinch-strike": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["escaped"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "a reaction Strike on a creature that escapes its grab" }),
    // (Consume Power: resistance its level to acid, electricity, fire or sonic damage it would take — the engine's resist-damage on those
    // types; the energy it holds for an impulse isn't played.)
    "consume-power": (level) => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: level, on: ["acid", "electricity", "fire", "sonic"] }], played: "resistance its level to acid, electricity, fire or sonic damage (reaction)" }),
    // (Call the Hunt: its hunted prey off-guard to everyone's melee attacks while it and an ally reach it, until its next turn — played as
    // off-guard to all, at a foe in its reach; its sanctification isn't.)
    "call-the-hunt": () => {
        const entry = offGuardToMeEntry("Call the Hunt", { range: "touch", traits: [], everyone: true });
        return entry ? { builtins: {}, plans: [], spells: [entry], played: "a foe in its reach off-guard to all until its next turn (1 action)" } : null;
    },
    // (Invented Vulnerability: Deception against the target's Will, weakness 5 for a round on a success, 3 + half its level on a critical
    // one — to the PC's own Strike's damage type, the one it picks. Once a fight at a target; the feat module's plan, its Effect read here.)
    "invented-vulnerability": (level, host) => {
        const doc = [...docsOf(`${PACK_ROOT}/feats`).values()].find((each) => each.name === "Invented Vulnerability");
        const plan = doc && compileFeat(doc, { dcs: dcsOf(host ?? {}), basicActions, itemReaders });
        if (plan?.resolution?.kind !== "check") return null;
        const type = (host?.strikes ?? []).find((strike) => strike.melee)?.damage?.[0]?.type ?? "slashing";
        const weak = (value) => ({ name: "Invented Vulnerability", rounds: 1, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [{ type, value }], immunities: [], conditions: [], unsupported: [], situational: 0 });
        const uuid = (degree) => `feat:invented-vulnerability:${degree}`;
        const outcomes = structuredClone(plan.resolution.outcomes);
        for (const degree of ["criticalSuccess", "success"]) outcomes[degree] = { ...outcomes[degree], nativeEffects: [{ kind: "native-spell-effect", uuid: uuid(degree) }], manualInstructions: [] };
        const entry = { name: "Invented Vulnerability", plan: { ...plan, resolution: { ...plan.resolution, outcomes } }, castRank: 1, dc: null, attack: null, pool: "feat:invented-vulnerability", kind: "ability", actionType: "action", rechargeGroup: "Invented Vulnerability", feat: true, effects: { [uuid("criticalSuccess")]: weak(3 + Math.floor(level / 2)), [uuid("success")]: weak(5) } };
        return { builtins: {}, plans: [], spells: [entry], pools: { "feat:invented-vulnerability": 1 }, played: `Deception against Will: weakness 5 to ${type} for a round (1 action, once a fight)` };
    },
    // (2026-11-05, the champion's reaction riders on a critical hit: Instrument of Zeal's die and slowed 1, Instrument of Slaughter's bleed.)
    "instrument-of-zeal": () => ({ builtins: { championReaction: { zeal: true } }, played: "its champion's reaction Strike: a critical hit's extra die and slowed 1" }),
    "instrument-of-slaughter": () => ({ builtins: { championReaction: { slaughter: true } }, played: "its champion's reaction Strike: a critical hit's persistent bleed" }),
    // (Body Shield: +2 AC against an attack, a thrall thrown in the way — its resistance on a hit, and the thrall lost, aren't played.)
    "body-shield": () => ({ builtins: { acReaction: { value: 2, when: "targeted", name: "Body Shield" } }, played: "+2 AC against an attack (reaction)" }),
    // (Guardian taunts: Group Taunt's three foes at once; Shielding Taunt's raised shield with it — the guardian's Taunt, fight.js.)
    "group-taunt": () => ({ builtins: { taunt: { name: "Taunt", max: 3 } }, played: "Taunt at up to three foes" }),
    "shielding-taunt": () => ({ requires: "You are wielding a shield", builtins: { taunt: { name: "Taunt", raise: true } }, played: "Taunt that raises its shield" }),
    // (Raise a Tome: a book raised as a shield, +2 AC — no Shield Block.)
    "raise-a-tome": () => ({ builtins: { shield: { ac: 2, hardness: 0, hp: 1, bt: 0, broken: false, raised: false, noBlock: true } }, played: "a book raised for +2 AC" }),
    "quick-vengeance": () => ({ builtins: { quickVengeance: true }, played: "an extra action after its Intercept Attack or Shield Block" }),
    "armored-counterattack": () => ({ builtins: { armoredCounterattack: true }, played: "a Strike back after its Intercept Attack, a Taunt on a hit (free)" }),
    // (Shield of Grace, after Shield Warden: the damage left after its Shield Block for an ally split between them.)
    "shield-of-grace": () => ({ builtins: { shieldWarden: true, shieldOfGrace: true }, played: "Shield Warden's block for an ally, the rest split with it" }),
    // (Aura of Vengeance: allies' reaction Strikes at the champion's foe at −2, not −5 — the champion's Exalt, which the class here
    // doesn't play, given with it.)
    "aura-of-vengeance": () => ({ builtins: { championReaction: { exalted: { penalty: 2 } } }, played: "allies' reaction Strikes at −2 with its Retributive Strike (its Exalt with it)" }),
    // (Shield Block, the general feat: the reaction, for a PC with a shield.)
    // (On the cleric, whose loadout has no shield: a shield given with it, a champion's at its level.)
    "shield-block": (level, host) => {
        const hardness = level >= 13 ? 10 : level >= 7 ? 8 : 5;
        return { builtins: { ...(host?.shield ? {} : { shield: { ac: 2, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false } }), reactions: { shieldBlock: true } }, played: `Shield Block (reaction)${host?.shield ? "" : ", a shield with it"}` };
    },
    // (Battle Cry: a free Demoralize as the fight begins — champion.js championOpening —, and from 15th, legendary in Intimidation, its
    // reaction Demoralize on a critical hit.)
    "battle-cry": (level) => ({ builtins: { battleCry: { reaction: level >= 15 } }, played: `a free Demoralize as the fight begins${level >= 15 ? ", and one on a critical hit (reaction)" : ""}` }),
    // (Diehard: dies at dying 5, not 4.)
    "diehard": () => ({ builtins: { deathAt: 5 }, played: "dies at dying 5" }),
    "bloody-debilitation": () => ({ builtins: { debilitation: { bleed: 3 } }, played: "Debilitating Strike's 3d6 persistent bleed in place of enfeebled 1" }),
    // (2026-11-05, Heartless Debilitations: frightened 1 — its weakness 5 to bleed and poison isn't taken.)
    // (2026-11-05, Poison Weapon: an Interact, then its next weapon hit deals a simple poison's 1d4 poison — its level in poisons a day;
    // Improved and Deadly Poison Weapon: 2d4 and 4d4, rated with Poison Weapon, which they need.)
    "poison-weapon": (level) => ({ builtins: { poisonWeapon: simplePoison(level, "1d4") }, played: "Poison Weapon: an Interact, then 1d4 poison on its next weapon hit" }),
    "improved-poison-weapon": (level) => ({ builtins: { poisonWeapon: simplePoison(level, "2d4") }, played: "Poison Weapon with 2d4 poison (Poison Weapon with it)" }),
    "deadly-poison-weapon": (level) => ({ builtins: { poisonWeapon: simplePoison(level, "4d4") }, played: "Poison Weapon with 4d4 poison (Poison Weapon with it)" }),
    "heartless-debilitations": () => ({ builtins: { debilitation: { slug: "frightened", value: 1 } }, played: "Debilitating Strike's frightened 1 in place of enfeebled 1" }),
    "eldritch-debilitations": () => ({ builtins: { debilitation: { slug: "stupefied", value: 1 } }, played: "Debilitating Strike's stupefied 1 in place of enfeebled 1" }),
    "swift-retribution": () => ({ builtins: { swiftRetribution: true }, played: "an extra action after its champion's reaction" }),
    "critical-debilitation": () => ({ builtins: { debilitation: { critSave: true } }, played: "on a critical hit, Debilitating Strike's Fortitude save: slowed 1, slowed 2 or paralyzed" }),
    "guardians-intercept": (_level, host) => (host?.interceptAttack ? null : { builtins: { interceptAttack: { name: "Intercept Attack", once: true } }, played: "Intercept Attack, once a fight (reaction)" }),
    "instant-opening": () => {
        const entry = offGuardToMeEntry("Instant Opening");
        return entry ? { builtins: {}, plans: [], spells: [entry], played: "a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action)" } : null;
    },
    // (2026-11-03, Come and Get Me, raging: off-guard (-2 AC) and +2 to damage rolls against it (played as weakness 2 to all damage) until its
    // rage ends; a creature that hits it is off-guard to it until the end of its next turn, and its hits on that creature give temporary Hit
    // Points equal to its Constitution modifier — fight.js/actions.js answerHitters.)
    "come-and-get-me": (_level, host) => (host?.selfBuffs ?? []).some((buff) => buff.name === "Rage") ? ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, requires: "raging", model: { rounds: 10, modifiers: [{ on: "ac", type: "circumstance", value: -2 }], weaknesses: [{ type: "all-damage", value: 2 }], answerHitters: { tempHp: Number.isFinite(host.con) ? host.con : 4 } } }], played: "off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back" }) : null,
    // (2026-11-04, the gap index: damage on a basic action's success — basicRiders, joinBuiltins.)
    "crushing-grab": (_level, host) => ({ builtins: { basicRiders: [{ slugs: ["grapple"], damage: `${Math.max(1, host?.abilities?.str ?? 4)}[bludgeoning]`, source: "Crushing Grab" }] }, played: "Strength damage on a successful Grapple (always on)" }),
    "punishing-shove": (level, host) => ({ builtins: { basicRiders: [{ slugs: ["shove"], damage: `${Math.max(1, host?.abilities?.str ?? 4) + (level >= 15 ? 12 : level >= 7 ? 6 : level >= 3 ? 2 : 0)}[bludgeoning]`, criticalDouble: true, source: "Punishing Shove" }] }, played: "damage on a successful Shove (always on)" }),
    "brutal-bully": (_level, host) => ({ builtins: { basicRiders: [{ slugs: ["disarm", "grapple", "reposition", "shove", "trip"], damage: `${Math.max(1, host?.abilities?.str ?? 4)}[bludgeoning]`, source: "Brutal Bully" }] }, played: "Strength damage on a successful maneuver (always on; raging not checked)" }),
    "agonizing-rebuke": (level) => ({ builtins: { basicRiders: [{ slugs: ["demoralize"], damage: `${level >= 15 ? 3 : level >= 7 ? 2 : 1}d4[mental]`, source: "Agonizing Rebuke" }] }, played: "mental damage on a successful Demoralize (always on; once, not each turn)" }),
    // (2026-11-04, the gap index's batch 2: a larger foe's Trip — the rating's foes are often larger; 2d8 once a master in Athletics, 15th here.)
    "the-harder-they-fall-kingmaker": (level) => ({ builtins: { basicRiders: [{ slugs: ["trip"], damage: `${level >= 15 ? 2 : 1}d8[bludgeoning]`, criticalDouble: true, source: "The Harder They Fall" }] }, played: "bludgeoning damage on a successful Trip (always on)" }),
    "brutal-beating": () => ({ builtins: { strikeExtras: [{ when: "critical", condition: { slug: "frightened", value: 1 }, source: "Brutal Beating" }] }, played: "frightened 1 on a critical hit (always on)" }),
    // (+2 AC to an ally in reach as an attack hits it — the engine's ally-ac-reaction, B182.)
    "guardians-deflection-fighter": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 2, within: "reach" }], played: "+2 AC to an ally in reach as it's hit (reaction)" }),
    "guardians-deflection-swashbuckler": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 2, within: "reach" }], played: "+2 AC to an ally in reach as it's hit (reaction)" }),
    // (A failed Strike at it redirected to another creature in the attacker's reach — the engine's redirect-attack, B191.)
    "sidestep": () => ({ builtins: {}, plans: [{ builtin: "redirect-attack" }], played: "a missed Strike redirected (reaction)" }),
    // (+2 initiative and temporary Hit Points of half its level for allies within 20 feet; played as the initiative.)
    // (2026-11-05: Scout's Warning, +1 to its allies' initiative as it rolls, a free action; Deflecting Shot, +2 AC to an ally its gun covers
    // as it's hit.)
    "scouts-warning": () => ({ builtins: {}, plans: [{ builtin: "initiative-warning", value: 1, free: true }], played: "+1 initiative to its allies (free action)" }),
    "certain-stratagem": () => ({ builtins: { certainStratagem: true }, played: "half its strategic strike dice on a stratagem Strike's miss (always on)" }),
    // (2026-11-05: Pact of Infernal Prowess, a critically failed save rerolled, the new result kept, a free action once a fight — its
    // attack rolls and skill checks not played; Lucky Break, Cat's Luck's better-of-two on a failed Fortitude or Will save too.)
    "pact-of-infernal-prowess": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null, keep: "new", free: true, criticalOnly: true }], played: "a critically failed save rerolled (free, once a fight)" }),
    "lucky-break": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null, free: true }], played: "a failed save rerolled, the better kept (free, once a fight)" }),
    "resounding-bravery": () => ({ builtins: { resoundingBravery: true }, played: "+1 to saves and temporary Hit Points on a critically successful Will save (doubled against fear)" }),
    // (2026-11-05, Cole's pick "Companions in the simulator": an animal companion — companions.js — beside its master, a turn of its own;
    // a feat that grows it fought against the master with the stage before.)
    "animal-companion": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "animal-companion-ranger": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "beastmaster-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "animal-trainer-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "cavalier-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "faithful-steed": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "commanders-companion": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "mature-animal-companion-druid": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "mature-animal-companion-ranger": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "mature-beastmaster-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "mature-trained-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "impressive-mount": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "battle-tested-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "incredible-companion-druid": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "incredible-companion-ranger": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "incredible-beastmaster-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "incredible-mount": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "battle-hardened-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "specialized-companion-druid": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "specialized-companion-ranger": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "specialized-beastmaster-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "specialized-companion-animal-trainer": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "peerless-mascot-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    // (Companion feats on the companion it has — the party with one on both sides.)
    "loyal-warhorse": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its animal companion mature (against one young)" }),
    "imposing-destrier": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "auspicious-mount": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "splendid-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its animal companion incredible (against one mature)" }),
    "spirit-companion": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its animal companion young (a bear, Commanded each turn)" }),
    "specialized-mount": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its animal companion specialized (against one incredible)" }),
    "companions-cry": () => ({ builtins: { companionActions: { master: 1, companion: 3 } }, played: "Commanded with 2 actions every turn: the companion's third action" }),
    "side-by-side-druid": () => ({ builtins: { tandem: true }, played: "it and its companion flank a foe both are beside" }),
    "side-by-side-ranger": () => ({ builtins: { tandem: true }, played: "it and its companion flank a foe both are beside" }),
    "heightened-instincts": () => ({ builtins: { companionFields: { saveDegrees: [{ saves: ["fortitude", "reflex", "will"], adjustment: { success: "one-degree-better" } }] } }, played: "its companion's successful saves critical successes" }),
    "tenacious-endurance": () => ({ builtins: { companionFields: { ferocityRule: { name: "Tenacious Endurance", hp: 1, wounded: true, free: true, uses: 1 } } }, played: "its companion stays up at 1 HP once (wounded 1)" }),
    "ferocious-beasts": () => ({ builtins: { companionFields: { ferocityRule: { name: "Orc Ferocity", hp: 1, wounded: true, uses: 1 }, reactions: { ferocity: true } } }, played: "its companion's Orc Ferocity" }),
    // (A construct, dragon, megafauna or undead companion: played with the bear's numbers at its stage — advanced as mature, paragon as
    // specialized.)
    "prototype-companion": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its companion young, the bear's numbers (Commanded each turn)" }),
    "drake-rider-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its companion young, the bear's numbers (Commanded each turn)" }),
    "mammoth-lord-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its companion young, the bear's numbers (Commanded each turn)" }),
    "undead-master-dedication": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its companion young, the bear's numbers (Commanded each turn)" }),
    "demon-hunting-companion": () => ({ builtins: { animalCompanion: { stage: "young" } }, played: "its companion young, the bear's numbers (Commanded each turn)" }),
    "advanced-construct-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its companion mature, the bear's numbers (against one young)" }),
    "let-my-creature-live": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its companion mature, the bear's numbers (against one young)" }),
    "advanced-reanimated-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its companion mature, the bear's numbers (against one young)" }),
    "mature-dragon-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its companion mature, the bear's numbers (against one young)" }),
    "mature-megafauna-companion": () => ({ builtins: { animalCompanion: { stage: "mature", base: "young" } }, played: "its companion mature, the bear's numbers (against one young)" }),
    "incredible-construct-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its companion incredible, the bear's numbers (against one mature)" }),
    "behold-my-creation": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its companion incredible, the bear's numbers (against one mature)" }),
    "incredible-reanimated-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its companion incredible, the bear's numbers (against one mature)" }),
    "incredible-dragon-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its companion incredible, the bear's numbers (against one mature)" }),
    "incredible-megafauna-companion": () => ({ builtins: { animalCompanion: { stage: "incredible", base: "mature" } }, played: "its companion incredible, the bear's numbers (against one mature)" }),
    "paragon-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its companion specialized, the bear's numbers (against one incredible)" }),
    "a-miracle-of-science": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its companion specialized, the bear's numbers (against one incredible)" }),
    "paragon-reanimated-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its companion specialized, the bear's numbers (against one incredible)" }),
    "specialized-megafauna-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its companion specialized, the bear's numbers (against one incredible)" }),
    "specialized-spirit-companion": () => ({ builtins: { animalCompanion: { stage: "specialized", base: "incredible" } }, played: "its companion specialized, the bear's numbers (against one incredible)" }),
    // (A summoner's eidolon — classes.js —: its evolutions. plus: added to the eidolon's own number.)
    "resilient-shell": (level) => ({ builtins: { companionFields: { resistances: [{ type: "physical", value: level >= 17 ? 6 : 5, exceptions: [] }] } }, played: "its eidolon's resistance to physical damage" }),
    "hulking-size": () => ({ builtins: { companionFields: { reach: 10, size: "large" } }, played: "its eidolon Large, reach 10 feet" }),
    "towering-size": () => ({ builtins: { companionFields: { reach: 15, size: "huge" } }, played: "its eidolon Huge, reach 15 feet" }),
    "alacritous-action": () => ({ builtins: { companionFields: { plus: { speed: 10 } } }, played: "its eidolon's Speed +10 feet" }),
    "eidolons-retort": () => ({ builtins: { companionFields: { reactions: { aoo: true } } }, played: "its eidolon's Retort (a Reactive Strike)" }),
    "ever-vigilant-senses": () => ({ builtins: { companionFields: { plus: { perception: 2 } } }, played: "its eidolon's +2 Perception" }),
    // (A companion's activity — its own multi-Strike, used as often as it can, forced.)
    "vicious-rend": (level) => ({ builtins: { companionFields: { multiStrikes: [{ name: "Vicious Rend", actions: 2, strikes: ["claw", "claw"], sameTarget: true, bothHit: { conditions: [], damage: [`${level >= 16 ? 2 : 1}d6[persistent,bleed]`] } }] } }, played: "its companion's Vicious Rend (two claws, bleed if both hit)" }),
    "ferocious-charge": (level) => ({ builtins: { companionFields: { multiStrikes: [{ name: "Ferocious Charge", actions: 2, strikes: ["jaws"], strides: 2, extraDamage: [`${level >= 16 ? 2 : 1}d8[untyped]`] }] } }, played: "its companion's Ferocious Charge (two Strides and a Strike, +1d8)" }),
    "running-kick": () => ({ builtins: { companionFields: { multiStrikes: [{ name: "Running Kick", actions: 2, strikes: ["claw"], strides: 2 }] } }, played: "its companion's Running Kick (two Strides and a Strike)" }),
    "natures-precision": (level) => ({ builtins: { companionFields: { strikeExtras: [{ when: "off-guard", dice: level >= 16 ? 2 : 1, die: 4, precision: true, type: null, agileOrFinesse: true, source: "Nature's Precision" }] } }, played: "its companion's agile Strikes +1d4 precision against an off-guard foe" }),
    // (Its own Strike and its companion's — fight.js companionStrike —: Pack Movement's Stride first; Tandem Strike out of the actions the
    // summoner and its eidolon share, two of three — the summoner's turn two actions, the eidolon's one.)
    "pack-movement": (level, host) => {
        const melee = (host?.strikes ?? []).find((strike) => strike.melee);
        return melee ? { builtins: { multiStrikes: [{ name: "Pack Movement", actions: 2, strikes: [melee.name.toLowerCase()], strides: 1, flourish: true, companionStrike: true }] }, played: "a Stride and a Strike, its companion's Strike beside it" } : null;
    },
    "tandem-strike": (level, host) => {
        const melee = (host?.strikes ?? []).find((strike) => strike.melee);
        return melee ? { builtins: { multiStrikes: [{ name: "Tandem Strike", actions: 2, strikes: [melee.name.toLowerCase()], companionStrike: true }], companionActions: { master: 2, companion: 1 } }, played: "its Strike and its eidolon's (two of their three actions)" } : null;
    },
    // (Primal Howl's advanced maneuver — the actions pack's —: the companion's 30-foot cone at its master's DC, once a fight.)
    "primal-howl": (level, host) => {
        const action = [...docsOf(`${PACK_ROOT}/actions`).values()].find((doc) => doc.name === "Primal Howl");
        const read = action && host ? inlineSaveEntry(action, level, host) : null;
        return read ? { builtins: { companionFields: { spells: read.spells.map((entry) => ({ ...entry, name: "Primal Howl" })), spellPools: read.pools } }, played: `its companion's Primal Howl (${read.played.replace(/^inline save: /, "")})` } : null;
    },
    "bloodletting-claws": () => ({ builtins: { companionFields: { strikeExtras: [{ when: "critical", dice: 1, die: 6, melee: true, persistent: true, type: "bleed", noDouble: true, source: "Bloodletting Claws" }] } }, played: "its eidolon's critical hits 1d6 persistent bleed" }),
    // (2026-11-05, mounted combat — companions.js mountUp: the rider's own activities. Their Command is the one its turn already spent:
    // a 3-action one, Shadowpiercing Charge, two of its own.)
    "cavaliers-charge": (level, host) => {
        const melee = (host?.strikes ?? []).find((strike) => strike.melee);
        return melee ? { builtins: { multiStrikes: [{ name: "Cavalier's Charge", actions: 2, strikes: [melee.name.toLowerCase()], strides: 2, flourish: true, penalty: -1 }] }, played: "its mount's two Strides and a Strike at +1" } : null;
    },
    "shadowpiercing-charge": (level, host) => {
        const melee = (host?.strikes ?? []).find((strike) => strike.melee);
        return melee ? { builtins: { multiStrikes: [{ name: "Shadowpiercing Charge", actions: 2, strikes: [melee.name.toLowerCase(), melee.name.toLowerCase()], strides: 2, sameMap: true }] }, played: "its mount's double Stride and two Strikes at one multiple attack penalty (its extra damage in darkness not played)" } : null;
    },
    "dismounting-strike": (level, host) => {
        const melee = (host?.strikes ?? []).find((strike) => strike.melee);
        const die = melee?.damage?.[0]?.die ?? 8;
        const type = melee?.damage?.[0]?.type ?? "untyped";
        return melee ? { builtins: { multiStrikes: [{ name: "Dismounting Strike", actions: 2, strikes: [melee.name.toLowerCase()], strides: 1, countsAs: 2, extraDamage: [`${level >= 14 ? 2 : 1}d${die}[${type}]`], dismount: true }] }, played: "its mount's Stride, a leap off and a Strike with an extra weapon die (counts as two attacks)" } : null;
    },
    // (2026-11-05, the Strike riders sweep — Strikes whose rider the feat module doesn't read.)
    // (Twin Feint: two Strikes at one target, off-guard to the second — the PC's one weapon twice, its two weapons not checked.)
    // (2026-11-05, Goading Feint: each Feint's success and critical success swapped for a –2 to the foe's attacks on the PC — always taken.)
    // (Antagonize: its Demoralize's frightened stays at least 1 until the foe attacks it.)
    // (The fencer swashbuckler never Demoralizes on its own — its Demoralize given again, forced.)
    // (Communal Healing: a single-target heal spell heals the most hurt other ally by its rank too.)
    // (2026-11-05, Repel Assault: resistance equal to its level against a foe's attack dealing at least that much, three times a fight (its
    // Mythic Points); an adjacent ally's attack and the mythic Strike after aren't played.)
    "repel-assault": (level) => ({ builtins: { resistReaction: { name: "Repel Assault", value: level, attack: true, foe: true, on: null, types: null, minDamage: level }, resistUses: 3 }, played: "resistance equal to its level against a big hit, 3 a fight" }),
    "communal-healing": () => ({ builtins: { communalHealing: true }, played: "each single-target heal heals the most hurt other ally by its rank" }),
    antagonize: () => ({ builtins: { antagonize: true }, spells: basicActions.demoralize ? [{ name: "Demoralize", plan: structuredClone(basicActions.demoralize), castRank: 1, pool: null, kind: "basic" }] : [], played: "Demoralize (forced); frightened from it stays at 1 or more until the foe attacks it" }),
    "goading-feint": () => ({ builtins: { goadingFeint: true }, played: "every Feint goads (–2 to the foe's next attack on the PC, all of them on a critical success) instead of off-guard" }),
    "twin-feint": () => ({ builtins: { multiStrikes: [{ name: "Twin Feint", actions: 2, strikes: [null, null], sameTarget: true, secondOffGuard: true }] }, played: "two Strikes at one foe, off-guard to the second" }),
    // (A Strike at each enemy within 30 feet, at one multiple attack penalty — fight.js within.)
    "implements-assault": () => ({ builtins: { multiStrikes: [{ name: "Implement's Assault", actions: 3, strikes: [null], each: true, within: 30, sameMap: true }] }, played: "a Strike at each enemy within 30 feet (3 actions)" }),
    "devastating-weaponry": () => ({ builtins: { multiStrikes: [{ name: "Devastating Weaponry", actions: 3, strikes: [null], each: true, within: 30, sameMap: true }] }, played: "a Strike at each enemy within 30 feet (3 actions)" }),
    // (A 30-foot line of ranged Strikes, raging: taken as two foes in it; Snakebird's Shadow's 15-foot line, two in its reach.)
    "penetrating-projectile": () => ({ builtins: { multiStrikes: [{ name: "Penetrating Projectile", actions: 2, strikes: ["ranged"], each: true, max: 2, sameMap: true, flourish: true, requires: "raging" }] }, played: "a ranged Strike at up to two foes in a line, raging" }),
    "snakebirds-shadow": () => ({ builtins: { multiStrikes: [{ name: "Snakebird's Shadow", actions: 2, strikes: [null], each: true, max: 2, sameMap: true, flourish: true }] }, played: "a Strike at up to two foes in a 15-foot line (its stance not checked)" }),
    // (Rebounding Assault: a thrown Strike and a shot at one penalty, 1d6 precision more if both hit — the two Strikes' damage as rolled.)
    "rebounding-assault": () => ({ builtins: { multiStrikes: [{ name: "Rebounding Assault", actions: 2, strikes: ["ranged", "ranged"], sameTarget: true, sameMap: true, bothHit: { conditions: [], damage: ["1d6[precision]"] } }] }, played: "two ranged Strikes at one penalty, +1d6 precision if both hit" }),
    // (Strike activities.)
    "everstand-strike": () => ({ requires: "You are wielding a shield", builtins: {}, plans: [strikeRider({ press: true, selfAfter: [{ ac: 2, type: "circumstance" }], selfAfterHit: true })], played: "a press Strike, its shield raised if it hits" }),
    "combat-grab": () => ({ builtins: {}, plans: [strikeRider({ press: true, onHit: { conditions: [{ slug: "grabbed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }] } })], played: "a press Strike that grabs on a hit" }),
    // (+1 to the next ally's attack at the target, +2 after a critical hit — commander.js setUp "aid".)
    "guiding-shot": () => ({ builtins: {}, plans: [strikeRider({ range: "ranged", flourish: true, setUp: "aid" })], played: "a ranged Strike, +1 to the next ally's attack at its target" }),
    "assisting-shot": () => ({ builtins: {}, plans: [strikeRider({ range: "ranged", press: true, setUp: "aid" })], played: "a ranged press Strike, +1 to the next ally's attack at its target" }),
    // (Its weapon die a step bigger: about one more a die.)
    "dual-handed-assault": () => ({ builtins: {}, plans: [strikeRider({ flourish: true, damagePerWeaponDie: 1 })], played: "a Strike with its weapon die a step bigger" }),
    "pivot-strike": () => ({ builtins: {}, plans: [strikeRider({ actions: 2, damagePerWeaponDie: 2, afterStrike: "trip" })], played: "a Strike with twice its weapon dice in damage, then a Trip (its Leap and staff not checked)" }),
    // (One-On-One's Feint taken as a success: the Strike at an off-guard foe, once a round.)
    "one-on-one": () => ({ builtins: {}, plans: [strikeRider({ offGuard: true, oncePerTurn: true })], played: "a Feint and a Strike, taken as off-guard, once a round (the dueling sword not checked)" }),
    // (After a missed melee Strike, another at the same penalty.)
    "follow-up-strike": () => ({ builtins: {}, plans: [strikeRider({ flourish: true, after: { on: ["failure", "criticalFailure"], melee: true }, previousMap: true })], played: "after a missed melee Strike, another at the same penalty" }),
    // (A bomb's persistent damage on a shot; the bomb it uses, its type and the misfire on a failure aren't played.)
    "alchemical-shot": (level) => ({ builtins: {}, plans: [strikeRider({ actions: 2, range: "ranged", onHit: { damage: [`${level >= 17 ? 3 : level >= 11 ? 2 : 1}d6[persistent,fire]`] } })], played: "a ranged Strike with a bomb's persistent damage (the bomb and the misfire not played)" }),
    // (A hit is a critical hit; off-guard and stunned 1 after.)
    "final-shot": () => ({ builtins: {}, plans: [strikeRider({ actions: 3, range: "ranged", hitCrits: true, selfAfter: [{ slug: "off-guard" }, { slug: "stunned", value: 1 }] })], played: "a ranged Strike whose hit is a critical hit, then off-guard and stunned 1 (3 actions)" }),
    // (Mythic proficiency, +10: about +4 over a martial's own.)
    // (2026-11-05, Shield Wallop: a flourish Strike — its shield's, or its weapon's when the guardian has none —, stupefied 1 on a hit and 2
    // on a critical hit until its next turn.)
    // (Reflexive Shield: its raised shield's bonus to Reflex saves; Shield Block against a Reflex save's damage isn't played.)
    "reflexive-shield": () => ({ builtins: { reflexiveShield: true }, played: "its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian)" }),
    "shield-wallop": () => {
        const until = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" };
        return { builtins: {}, plans: [strikeRider({ flourish: true, onHit: { conditions: [{ slug: "stupefied", value: 1, duration: until }], critical: [{ slug: "stupefied", value: 2, duration: until }] } })], played: "a flourish Strike, stupefied 1 (2 on a critical hit) until its next turn" };
    },
    // (2026-11-06, Devastating Shield Wallop: Shield Wallop with a Fortitude save after it against its class DC — prone on a failure,
    // stunned 1 on a critical failure (its prone then not played), the success's off-guard not played; rated against no Shield Wallop.)
    "devastating-shield-wallop": (_level, _host, doc) => {
        const until = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" };
        const save = conditionSavePlan(doc, "fortitude", ["prone", null], ["stunned", 1]);
        return { builtins: {}, plans: [strikeRider({ flourish: true, onHit: { conditions: [{ slug: "stupefied", value: 1, duration: until }], critical: [{ slug: "stupefied", value: 2, duration: until }], ...(save ? { save } : {}) } })], played: "Shield Wallop (stupefied 1, 2 on a critical hit), then a Fortitude save: prone, or stunned 1 on a critical failure" };
    },
    // (2026-11-05, Crashing Slam: Slam Down's Trip a critical success when its Strike hits — prone and 1d6 bludgeoning; rated as Slam Down
    // with it, against no Slam Down.)
    // (2026-11-05, Vivacious Bravado: with panache, temporary Hit Points equal to its level plus Charisma until its next turn.)
    // (Mage Hunter: a 2-action Strike, stupefied 1 (2 on a critical hit) until its next turn — "seen the target Cast a Spell" not checked.)
    // (Fight or Flight: frightened by a foe in its reach — a melee Strike at it; the Stride away isn't played.)
    // (2026-11-05, Dodging Roll: resistance equal to its level against an area effect's damage with a Reflex save (its level plus Dexterity
    // when its Step leaves the area — not played); the Step isn't.)
    // (2026-11-05, You're Next: downing a foe — a Demoralize at another, +2, as a reaction; spells.js downsAnswers.)
    // (2026-11-05, Savage Critical: a 19 that hits is a critical hit with its legendary weapons — the fighter's Strikes. Piercing Critical:
    // the same with a firearm or crossbow — the gunslinger's ranged Strikes.)
    // (2026-11-05, Deliberate Death: dropping to dying from a foe in its reach — a melee Strike at it first, once a fight.)
    // (Cornered Fury: a larger foe that critically hits it is off-guard to it for a round.)
    // (2026-11-05, Sea Swarmer: a foe in its reach and two allies' off-guard to it. Remorseless Lash: a melee weapon hit keeps a frightened
    // foe at frightened 1 until its next turn. Elemental Bulwark: resistance 5 (10, Improved) against a foe's cold, electricity or fire, a
    // reaction — the spell traits not read.)
    "sea-swarmer": () => ({ builtins: { seaSwarmer: true }, played: "a foe in its reach and two allies' reach is off-guard to it" }),
    "remorseless-lash": () => ({ builtins: { remorselessLash: true }, played: "a melee weapon hit keeps a frightened foe at frightened 1 until its next turn" }),
    "elemental-bulwark": () => ({ builtins: { resistReaction: { name: "Elemental Bulwark", value: 5, on: ["cold", "electricity", "fire"], types: ["triggering"], foe: true } }, played: "resistance 5 against a foe's cold, electricity or fire (reaction)" }),
    "improved-elemental-bulwark": () => ({ builtins: { resistReaction: { name: "Elemental Bulwark", value: 10, on: ["cold", "electricity", "fire"], types: ["triggering"], foe: true } }, played: "Elemental Bulwark's resistance 10 (with it)" }),
    "cornered-fury": () => ({ builtins: { corneredFury: "small" }, played: "a larger foe that critically hits it (a Small ratfolk: a Medium foe) is off-guard to it for a round" }),
    "deliberate-death": () => ({ builtins: { deathStrike: { name: "Deliberate Death", strike: null, pc: true } }, played: "a melee Strike at the foe that drops it (reaction, once)" }),
    "diamond-fists": (level) => ({ builtins: { diamondFists: level }, played: "its unarmed attacks forceful and deadly d10" }),
    "savage-critical": () => ({ builtins: { savageCritical: true }, played: "a natural 19 that hits is a critical hit" }),
    "piercing-critical": () => ({ builtins: { savageCritical: "ranged" }, played: "a natural 19 that hits with its gun is a critical hit" }),
    "youre-next": () => {
        const demoralize = basicActions.demoralize;
        if (!demoralize?.resolution?.check) return null;
        const check = demoralize.resolution.check;
        const plan = { ...structuredClone(demoralize), source: { ...demoralize.source, name: "You're Next" }, trigger: { reaction: true, event: "downs" }, resolution: { ...structuredClone(demoralize.resolution), check: { ...structuredClone(check), bonus: { value: (Number(check.bonus?.value) || 0) + 2, type: "circumstance" } } } };
        return { builtins: {}, spells: [{ name: "You're Next", plan, castRank: 1, pool: null, kind: "basic" }], played: "downing a foe: a Demoralize at another, +2 (reaction)" };
    },
    "dodging-roll": (level) => ({ builtins: { resistReaction: { name: "Dodging Roll", value: level, on: null, types: null, areaReflex: true } }, played: "resistance equal to its level against an area Reflex effect's damage (reaction)" }),
    "fight-or-flight": () => ({ builtins: { fightOrFlight: true }, played: "frightened by a foe in its reach: a melee Strike at it (reaction)" }),
    "mage-hunter": () => {
        const until = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" };
        return { builtins: {}, plans: [strikeRider({ actions: 2, onHit: { conditions: [{ slug: "stupefied", value: 1, duration: until }], critical: [{ slug: "stupefied", value: 2, duration: until }] } })], played: "a 2-action Strike, stupefied 1 (2 on a critical hit) until its next turn (whether it saw a spell cast isn't checked)" };
    },
    "vivacious-bravado": (level) => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, requires: "panache", model: { rounds: 1, tempHp: level + 4 + (level >= 10) + (level >= 15) + (level >= 20) } }], played: "with panache, temporary Hit Points of its level plus Charisma until its next turn" }),
    "crashing-slam": () => ({ builtins: {}, plans: [strikeRider({ actions: 2, onHit: { conditions: [{ slug: "prone", value: null }], damage: ["1d6[bludgeoning]"] } })], played: "Slam Down (with it) whose hit trips as a critical success: prone and 1d6 bludgeoning" }),
    "united-assault": () => ({ builtins: {}, plans: [strikeRider({ flourish: true, united: true })], played: "a flourish Strike, +1 damage for each other creature that hurt the target since its last turn (up to +4)" }),
    // (Overextending Feint, the rogue's Goading Feint — its Feint given again, forced, as the rogue rarely Feints.)
    "overextending-feint": () => ({ builtins: { goadingFeint: true }, spells: basicActions.feint ? [{ name: "Feint", plan: structuredClone(basicActions.feint), castRank: 1, pool: null, kind: "basic" }] : [], played: "Feint (forced), each one goading (–2 to the foe's next attack on the PC, all on a critical success) instead of off-guard" }),
    // (Temporal Fury: a Strike, a Step, another Strike for two actions and a Mythic Point — the Step not played.)
    "temporal-fury": () => ({ builtins: { multiStrikes: [{ name: "Temporal Fury", actions: 2, strikes: [null, null] }] }, played: "two Strikes for two actions (a Mythic Point)" }),
    // (Hampering Stance: its 5-foot difficult terrain for foes isn't played — on the bands, foes beside it rarely walk off; the stance is
    // here for Not So Fast!'s Strike at a foe leaving its reach (its Speed penalty and a critical hit's disruption not played).)
    "hampering-stance": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: {} }], played: "a stance (its difficult terrain not played)" }),
    "not-so-fast": () => ({ builtins: { reactionStrikes: [{ name: "Not So Fast!", triggers: ["leave"], strike: null, penalty: 0, disrupts: false, melee: true, requiresEffect: "Hampering Stance", featForced: true }] }, played: "a Strike at a foe leaving its reach, in Hampering Stance (reaction)" }),
    // (Necromancer, its thralls a count — thralls.js: The Unholy Dead's spirit damage on thrall Strikes; Anatomical Quartering's four
    // Strikes at different foes at one multiple attack penalty; Reclaim Power's healing, two thralls' worth (its level each) on itself,
    // once a fight, a thrall spent — its conditions not played.)
    "the-unholy-dead": (level) => ({ builtins: { unholyDead: level >= 10 ? 2 : 1 }, played: `+${level >= 10 ? 2 : 1} spirit damage on its thralls' Strikes` }),
    "the-hallowed-dead": (level) => ({ builtins: { unholyDead: level >= 10 ? 2 : 1 }, played: `+${level >= 10 ? 2 : 1} spirit damage on its thralls' Strikes` }),
    "anatomical-quartering": () => ({ builtins: { multiStrikes: [{ name: "Anatomical Quartering", actions: 3, strikes: [null], each: true, max: 4, sameMap: true }] }, played: "a Strike at each of up to four foes at one multiple attack penalty (3 actions)" }),
    "reclaim-power": (level, host, doc) => {
        const read = inlineHealEntry({ ...doc, system: { ...doc.system, description: { value: `<p>You regain @Damage[${2 * level}[healing]] Hit Points.</p>` } } }, level);
        if (!read?.spells?.length) return null;
        const pool = `feat:${doc._id}`;
        const entry = { ...read.spells[0], pool, plan: { ...read.spells[0].plan, targeting: { ...read.spells[0].plan.targeting, target: "self", range: null, thrall: { destroyed: true } } } };
        return { builtins: {}, spells: [entry], pools: { [pool]: 1 }, played: `regains ${2 * level} HP (two thralls destroyed, once a fight)` };
    },
    // (Desperate Surge: a Trip at its spell attack modifier instead of Athletics, once a fight — its Athletics taken as its spell attack, as
    // nothing else of the necromancer's rolls it; the other maneuvers not played.)
    "desperate-surge": (level, host, doc) => {
        const attack = (dcsOf(host).spell ?? 10 + level + 2 + 4) - 10;
        const pool = `feat:${doc._id}`;
        return basicActions.trip ? { builtins: { skills: { athletics: attack } }, spells: [{ name: "Desperate Surge", plan: { ...structuredClone(basicActions.trip), source: { ...basicActions.trip.source, name: "Desperate Surge" } }, castRank: 1, pool, kind: "basic", featForced: true }], pools: { [pool]: 1 }, played: `a Trip at its spell attack (+${attack}), once a fight` } : null;
    },
    // (Bone Burst: its d10s, basic Reflex at its spell DC, at a foe beside a thrall that moves, manipulates or shoots — actions.js provoke.)
    "bone-burst": (level, host, doc) => {
        const dice = level >= 18 ? 4 : level >= 12 ? 3 : 2;
        const html = `<p>Choose a creature within 30 feet. Bone shards fly at it: @Damage[${dice}d10[piercing]] damage, @Check[reflex|basic].</p>`;
        const read = host ? inlineSaveEntry({ _id: "boneBurst0", name: "Bone Burst", type: "feat", system: { actionType: { value: "action" }, actions: { value: 1 }, traits: { value: ["concentrate", "occult"] }, description: { value: html } } }, level, host) : null;
        if (!read?.spells?.length) return null;
        const dc = dcsOf(host).spell ?? 10 + level + 2 + 4;
        return { builtins: { boneBurst: true }, spells: read.spells.map((entry) => ({ ...entry, name: "Bone Burst", dc, attack: dc - 10, plan: { ...entry.plan, activation: { ...entry.plan.activation, time: "reaction" } } })), pools: read.pools ?? {}, played: `${read.played} — at a foe beside a thrall that moves, manipulates or shoots (reaction, a thrall destroyed)` };
    },
    // (2026-11-06, thralls as bodies: the necromancer's thrall focus spells.)
    "muscle-barrier": (level, host, doc) => { const rank = Math.max(1, Math.ceil(level / 2)); return thrallAllySpell(doc, level, host, { model: { tempHp: 10 * rank }, rounds: 10, destroyed: true, played: `${10 * rank} temporary HP on an ally` }); },
    "song-of-the-soul": (level, host, doc) => {
        const rank = Math.max(1, Math.ceil(level / 2));
        const read = inlineHealEntry({ _id: doc._id, name: doc.name, type: "feat", system: { actionType: { value: "action" }, actions: { value: 2 }, traits: { value: ["concentrate", "manipulate"] }, description: { value: `<p>A creature within 30 feet regains @Damage[${rank}d8[healing]] Hit Points.</p>` } } }, level);
        const entry = read?.spells?.[0] && thrallFocus(doc, level, host, read.spells[0], { destroyed: false });
        return entry ? { builtins: {}, spells: [entry], pools: { [entry.pool]: 1 }, played: `heals an ally ${rank}d8 (its focus spell through a thrall, once a fight; the fast healing near the thrall not played)` } : null;
    },
    "calcification": (level, host, doc) => thrallSaveSpell(doc, level, host, "fortitude", { success: ["slowed", 1, ONE_ROUND], failure: ["slowed", 1], criticalFailure: ["slowed", 2] }, "a foe slowed 1 (a round on a success; 2 on a critical failure) by its Fortitude save; its ongoing saves and bludgeoning weakness not played"),
    "temporary-possession": (level, host, doc) => thrallSaveSpell(doc, level, host, "will", { success: ["stunned", 2], failure: ["stunned", 3], criticalFailure: ["stunned", 4] }, "a foe possessed by its Will save: the actions it controls and the stunned 1 after taken as stunned 2/3/4 (what it makes the foe do not played)", 1),
    "thrall-charger": (level) => {
        const rank = Math.max(1, Math.ceil(level / 2));
        const dice = level >= 11 ? 3 : level >= 3 ? 2 : 1;
        return { builtins: {}, plans: [strikeRider({ actions: 2, strike: "Thrall", damageBonus: rank, spendThrall: true, onHit: { damage: [`${dice}d6`] } })], played: `Thrall Charge (a cantrip): a thrall Strike with ${dice}d6 more, the thrall destroyed for +${rank} (rated on a necromancer; its Stride not played)` };
    },
    "bloody-tendrils": (level, host) => {
        const rank = Math.max(3, Math.ceil(level / 2));
        const steps = Math.floor((rank - 3) / 3);
        const dc = dcsOf(host).spell ?? 10 + level + 2 + 4;
        return { builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, pool: "feat:bloody-tendrils", model: { rounds: 10 }, thrallField: { count: 3 + steps, name: "bloody tendril", immunities: ["bludgeoning", "piercing", "slashing"], aura: { on: "turn-end", reach: 10, damage: `${1 + steps}d12[bludgeoning]`, basic: true, dc } } }], pools: { "feat:bloody-tendrils": 1 }, played: `${3 + steps} tendril thralls beside foes: a foe ending its turn within 10 feet takes ${1 + steps}d12, basic Reflex DC ${dc} (its focus spell, once a fight)` };
    },
    "skeletal-lancers": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, pool: "feat:skeletal-lancers", model: { rounds: 10 }, thrallField: { count: 5, name: "skeletal lancer", aura: { on: "strike", reach: 10, damage: "5[piercing]", basic: false } } }], pools: { "feat:skeletal-lancers": 1 }, played: "5 lancer thralls beside foes: a foe's Strike within 10 feet of one costs it 5 piercing (its focus spell, once a fight; the lancers' own Strikes not played)" }),
    "rapid-recharge": () => ({ builtins: { rapidRecharge: 1 }, played: "its Spellstrike recharged free as a turn begins, once a fight" }),
    "sustaining-steel": () => ({ builtins: { sustainingSteel: true }, played: "a slot spell's Spellstrike heals it the rank (double in Arcane Cascade)" }),
    // (2026-11-06: Exploit Vulnerability's personal antithesis on every creature of the target's kind — actions.js.)
    "frightful-attrition": () => ({ builtins: { frightfulAttrition: true }, played: "a Will save or frightened 1–3 for the foes within 30 feet of each foe it drops (actions.js)" }),
    "sympathetic-vulnerabilities": () => ({ builtins: { sympatheticVulnerabilities: true }, played: "personal antithesis on every foe of the exploited one's kind" }),
    "headshot": () => ({ builtins: {}, plans: [strikeRider({ actions: 2, range: "ranged", headshot: true })], played: "a 2-action firearm Strike; a critical hit on a foe it already hurt: a Fortitude save or it dies" }),
    "phase-bullet": () => ({ builtins: {}, plans: [strikeRider({ range: "ranged", attackBonus: 4, oncePerFight: true })], played: "a firearm Strike at +4 against an armored foe, ignoring cover (once a fight)" }),
    "mythic-strike": () => ({ builtins: {}, plans: [strikeRider({ attackBonus: 4 })], played: "a Strike at mythic proficiency, about +4 (a Mythic Point)" }),
    // (Reach 10 feet: Giant's Lunge while raging, for the rage; Jotun's Battle Stance, its two-handed weapon not checked.)
    "giants-lunge": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, requires: "raging", model: { rounds: 10, reach: 10 } }], played: "reach 10 feet while raging (1 action)" }),
    "jotuns-battle-stance": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: { reach: 10 } }], played: "a stance: reach 10 feet" }),
    // (Duelist's Form: quickened while in the stance — the engine's quickened, a Strike or Stride.)
    "duelists-form": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: { conditions: [{ slug: "quickened", value: null }] } }], played: "a stance: quickened" }),
    // (+2 status to its next attack this turn — a next-Strike effect; its weaknesses learned aren't played.)
    "whispers-of-weakness": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, nextStrike: true, model: { rounds: 1, modifiers: [{ on: "attack", type: "status", value: 2 }] } }], played: "+2 to its next attack (1 action)" }),
    // (Its next claw hit's 1d6 bleed, once a fight — the claw not checked.)
    "hone-claws": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, nextStrike: true, pool: "feat:hone-claws", damage: ["1d6[persistent,bleed]"], model: { rounds: 10 } }], pools: { "feat:hone-claws": 1 }, played: "1d6 bleed on its next hit (1 action, once a fight)" }),
    "stretching-reach": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: true, model: { reach: 10 } }], played: "a stance: reach 10 feet" }),
    // (Its next fangs hit's 1d6 persistent poison, once a fight — the fangs not checked.)
    "envenom-fangs": () => ({ builtins: {}, plans: [{ builtin: "self-effect", actions: 1, stance: false, nextStrike: true, pool: "feat:envenom-fangs", damage: ["1d6[persistent,poison]"], model: { rounds: 2 } }], pools: { "feat:envenom-fangs": 1 }, played: "1d6 persistent poison on its next hit (1 action, once a fight)" }),
    "legendary-rider": () => ({ builtins: { companionActions: { master: 3, companion: 2 } }, played: "quickened for its Command: its own three actions and its mount's two" }),
    "mounted-shield": () => ({ builtins: { mountedShield: true }, requires: "You are wielding a shield", played: "its raised shield's bonus to its mount's AC too" }),
    // (Rearing Display: its mount's Strike — one action of the mount's turn, the Command its rider spent —, a hit followed by a Demoralize
    // at the rider's Intimidation +1.)
    // (The kineticist's armor impulses: its own armor for 10 minutes (the fight), at the kineticist's best armor proficiency — the AC it
    // gains over its studded leather (+2, Dex cap 3; the class's Dexterity +2, +3 from 10th, +4 at 20th) and the Speed it loses. The shield
    // Metal Carapace and Hardwood Armor can make and Armor in Earth's armor specialization aren't played.)
    "metal-carapace": (level) => armorImpulse(level, { item: 3, cap: 2, speed: -5 }),
    "hardwood-armor": (level) => armorImpulse(level, { item: 3, cap: 2, speed: -5 }),
    "armor-in-earth": (level) => armorImpulse(level, level >= 3 ? { item: 5, cap: 1, speed: -10 } : { item: 4, cap: 1, speed: -10 }),
    // (The alchemist's splash: Calculated Splash's Intelligence as the splash before Field Discovery gives it (5th); Expanded Splash's
    // Intelligence added (its 10 feet are the target's Melee here too); Directional Bombs' cone, so its allies there aren't splashed.)
    "calculated-splash": (level) => ({ builtins: level < 5 ? { splashBonus: Math.max(0, 4 - (level >= 3 ? 2 : 1)) } : {}, played: level < 5 ? "bomb splash equal to its Intelligence" : "nothing past 5th (Field Discovery does it)" }),
    "expanded-splash": (level) => ({ builtins: { splashBonus: level >= 10 ? 5 : 4 }, played: "its Intelligence added to its bombs' splash" }),
    "unstable-concoction": () => ({ builtins: { unstableConcoction: true }, played: "its bombs' damage dice a step bigger" }),
    "directional-bombs": () => ({ builtins: { splashFoesOnly: true }, played: "its bombs' splash on its foes only (a cone away from it)" }),
    // (A champion's Lay on Hands riders, on each ally it heals — spells.js touchRiders. Amplifying Touch's spirit damage played as +1 damage;
    // Rejuvenating Touch's temporary Hit Points renewed at each turn — fight.js tempHpEachTurn.)
    "amplifying-touch": () => ({ builtins: { touchRiders: [{ name: "Amplifying Touch", model: { rounds: 1, modifiers: [{ on: "attack", type: "status", value: 1 }, { on: "damage", type: "untyped", value: 1 }] } }] }, played: "+1 to attacks and 1 more damage until its next turn for an ally its Lay on Hands heals" }),
    "resilient-touch": () => ({ builtins: { touchRiders: [{ name: "Resilient Touch", model: { rounds: 1, modifiers: [{ on: "saving-throw", type: "status", value: 1 }] } }] }, played: "+1 to saves until its next turn for an ally its Lay on Hands heals" }),
    "rejuvenating-touch": () => ({ builtins: { touchRiders: [{ name: "Rejuvenating Touch", model: { rounds: 10, tempHp: 10, tempHpEachTurn: 10 } }] }, played: "10 temporary Hit Points, renewed each turn for 10 rounds, for an ally its Lay on Hands heals" }),
    "accelerating-touch": () => ({ builtins: { touchRiders: [{ name: "Accelerating Touch", model: { rounds: 1, modifiers: [{ on: "speed", type: "status", value: 10 }] } }] }, played: "+10 feet Speed until its next turn for an ally its Lay on Hands heals" }),
    "leave-an-opening": () => ({ builtins: { leaveAnOpening: true }, played: "its melee critical hit on an off-guard foe sets off an ally's Reactive Strike" }),
    // (Tangle of Battle: a Grapple at the foe it critically hits, its reaction — the basic action's plan at its trigger, triggers.js "crit".)
    "tangle-of-battle": () => ({ builtins: {}, spells: [{ name: "Tangle of Battle", plan: { ...structuredClone(basicActions.grapple), activation: { time: "reaction", traits: ["attack"] } }, castRank: 1, pool: null, kind: "basic", featTrigger: { on: "crit" } }], played: "a Grapple at a foe it critically hits (reaction)" }),
    // (Blazing Streak: two Strides with a Strike at each of up to four creatures along them — at each enemy within 60 feet, four at most,
    // each at its own multiple attack penalty; its stance and the sparks' fire not played.)
    "blazing-streak": () => ({ builtins: { multiStrikes: [{ name: "Blazing Streak", actions: 3, strikes: [null], each: true, within: 60, max: 4, flourish: true }] }, played: "a Strike at up to four enemies within 60 feet (3 actions)" }),
    "shield-of-reckoning": () => ({ builtins: { shieldOfReckoning: true }, played: "its Shield Block for the ally with its champion's reaction (once a round; its shield raised, forced)" }),
    // (Arcane Cascade riders — fight.js selfEffect: as the magus enters the stance.)
    "burning-cascade": () => ({ builtins: { burningCascade: true }, played: "its Arcane Cascade's extra damage on each enemy beside it as it enters the stance" }),
    "resounding-cascade": () => ({ builtins: { resoundingCascade: true }, played: "its Arcane Cascade's extra damage for allies beside it" }),
    "flamboyant-cruelty": () => ({ builtins: { flamboyantCruelty: true }, played: "+1 damage for each of clumsy, drained, enfeebled, frightened, sickened, stupefied on the foe, when it has two or more" }),
    "giant-slayer": () => ({ builtins: { giantSlayer: true }, played: "two critical hits on a giant in a turn: a Fortitude save or it dies" }),
    "distracting-shot": () => ({ builtins: { distractingShot: true }, played: "its prey off-guard until its next turn after a ranged critical hit or two ranged hits in a turn" }),
    "greater-distracting-shot": () => ({ builtins: { distractingShot: "greater" }, played: "its prey off-guard until its next turn after any ranged hit" }),
    "ongoing-strategy": () => ({ builtins: { ongoingStrategy: true }, played: "precision damage of its strategic strike dice's number on Strikes without a stratagem" }),
    // (Opportune Riposte's feats — actions.js.)
    "parry-and-riposte": () => ({ builtins: { parryAndRiposte: true }, played: "Opportune Riposte on a foe's failed Strike too (its finisher and parry taken as met)" }),
    "felicitous-riposte": () => ({ builtins: { felicitousRiposte: true }, played: "Opportune Riposte rolled twice, the better kept" }),
    "inexhaustible-countermoves": () => ({ builtins: { inexhaustibleCountermoves: true }, played: "an extra reaction in each foe's turn for Opportune Riposte" }),
    // (Kinetic aura stances — kineticAura.)
    "thermal-nimbus": (level, host, doc) => kineticAura(doc, { model: { resistances: [{ type: "fire", value: level, exceptions: [] }] }, start: `${Math.floor(level / 2)}[fire]`, enter: `${Math.floor(level / 2)}[fire]`, played: `fire resistance ${level} for the PC and its allies, ${Math.floor(level / 2)} fire to foes starting their turn or moving` }),
    "ghosts-in-the-storm": (level, host, doc) => kineticAura(doc, { model: { modifiers: [{ on: "reflex", type: "status", value: 2 }] }, played: "+2 Reflex for the PC and its allies" }),
    "sea-glass-guardians": (level, host, doc) => kineticAura(doc, { model: { modifiers: [{ on: "ac", type: "status", value: 1 }, { on: "saving-throw", type: "status", value: 1 }] }, played: "+1 AC and saves for the PC and its allies" }),
    "kindle-inner-flames": (level, host, doc) => kineticAura(doc, { model: { modifiers: [{ on: "reflex", type: "status", value: level >= 12 ? 2 : 1 }] }, played: `+${level >= 12 ? 2 : 1} Reflex for the PC and its allies` }),
    // (Winter Sleet: a foe that moves onto its ice — comes into the aura — falls prone unless it makes a Reflex save at its impulse DC − 2
    // (the Acrobatics choice not played); a water impulse's critical not played.)
    "winter-sleet": (level, host, doc) => {
        const plan = conditionSavePlan(doc, "reflex", ["prone", null], ["prone", null]);
        const dc = (dcsOf(host).class ?? 10 + level + 2 + 4) - 2;
        return plan ? kineticAura(doc, { saves: [{ when: ["enter"], plan }], castAs: { castRank: Math.max(1, Math.ceil(level / 2)), dc, attack: dc - 10 }, played: `a foe coming in falls prone on a failed Reflex save (DC ${dc})` }) : null;
    },
    "ravel-of-thorns": (level, host, doc) => kineticAura(doc, { enter: `${Math.floor((level - 4) / 4) + 2}[piercing]`, played: `${Math.floor((level - 4) / 4) + 2} piercing to foes moving` }),
    "rearing-display": (level, host) => ({ builtins: { companionFields: { multiStrikes: [{ name: "Rearing Display", actions: 1, strikes: ["jaws"], flourish: true, hitRiders: [{ atLeast: 1, conditions: [], damage: [], follow: "demoralize" }] }], skills: { intimidation: (host?.skills?.intimidation ?? level + 2) + 1 } } }, played: "its mount's Strike, a hit followed by a Demoralize" }),
    "defend-mount": () => ({ builtins: { defendMount: true }, played: "a Strike at its mount taken on its own AC instead (reaction)" }),
    // (Trampling Charge: its mount's double Stride through the foes in its way — a 70-foot line here, its Speed twice — each taking its
    // Jaws' damage, basic Reflex at its Athletics DC; two of the rider's actions, its Command already spent. Off-guard on a critical
    // failure not played.)
    "trampling-charge": (level, host) => {
        const stage = companionStageAt(level);
        const stats = companionStats(level, stage);
        const jaws = stats.strikes[0].damage[0];
        const html = `<p>Your mount tramples each creature in a @Template[line|distance:70]: @Damage[${jaws.dice}d${jaws.die}[${jaws.type}]] damage, @Check[reflex|basic].</p>`;
        const doc = { _id: "tramplingCharge0", name: "Trampling Charge", type: "feat", system: { actionType: { value: "action" }, actions: { value: 2 }, traits: { value: ["flourish"] }, description: { value: html } } };
        const read = host ? inlineSaveEntry(doc, level, host) : null;
        if (!read) return null;
        const dc = 10 + stats.athletics;
        // (Its Jaws' flat damage too: the inline reader takes dice alone.)
        const withBonus = (plan) => JSON.parse(JSON.stringify(plan).replaceAll(`"formula":"${jaws.dice}d${jaws.die}"`, `"formula":"${jaws.dice}d${jaws.die}+${jaws.bonus}"`));
        return { builtins: {}, spells: read.spells.map((entry) => ({ ...entry, plan: withBonus(entry.plan), dc, attack: dc - 10 })), pools: read.pools, played: `its mount through a 70-foot line, ${jaws.dice}d${jaws.die}+${jaws.bonus} ${jaws.type}, basic Reflex DC ${dc}` };
    },
    "correct-the-story": () => ({ builtins: { correctTheStory: true, mythicPoints: 3 }, played: "a foe's critical hit or critically successful save rerolled (reaction, a Mythic Point)" }),
    "black-cat-curse": () => ({ builtins: { saveCurse: { name: "Black Cat Curse" } }, played: "a foe's successful save rerolled, the worse kept (reaction, once a fight)" }),
    "forewarn": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 0, within: 30, dcInstead: "perception" }], played: "an ally's AC as its Perception DC against a hit, when higher (reaction)" }),
    "deflecting-shot": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 2, within: 60 }], played: "+2 AC to an ally within 60 feet as it's hit (reaction)" }),
    "oracular-warning": () => ({ builtins: {}, plans: [{ builtin: "initiative-warning", value: 2, within: 20, free: true }], played: "+2 initiative to allies within 20 feet" }),
    // (A failed save rerolled, the better kept, once a fight — the engine's save-reroll, B93. Grit and Tenacity's Fortitude or Will played as
    // any save.)
    "grit-and-tenacity": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null }], played: "a failed save rerolled (once a fight)" }),
    "turn-back-the-clock": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null }], played: "a failed save rerolled (once a fight)" }),
    "guarded-mind": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null, against: "mental", free: true }], played: "a failed save against a mental effect rerolled" }),
    "perfect-clarity": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: "will" }], played: "a failed Will save rerolled (once a fight)" }),
    "liberated-mind": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null, against: "mental" }], played: "a failed save against a mental effect rerolled" }),
    "stalwart-mind": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: "will" }], played: "a failed Will save rerolled" }),
    "acquired-tolerance": () => ({ builtins: {}, plans: [{ builtin: "save-reroll", save: null, against: "poison" }], played: "a failed save against poison rerolled" }),
    "brutal-critical": () => ({ builtins: { strikeExtras: [{ when: "critical", dice: 1, weaponDie: true, noDouble: true, melee: true, type: null, source: "Brutal Critical" }, { when: "critical", dice: 2, weaponDie: true, melee: true, persistent: true, type: "bleed", source: "Brutal Critical" }] }, played: "more on a critical hit (always on)" }),
    // (2026-11-03, Cole: "Look through class feats to see if any more can be automated or integrated into the simulator". An alchemist's
    // additives on every bomb it throws — the bombs come from its vials as it throws them, so the additive goes in each one; one additive
    // a bomb, but each is rated alone. Off-guard is the debilitation picked: the one the party's Strikes use.)
    "debilitating-bomb": () => ({ builtins: { strikeExtras: [{ when: "hit", bomb: true, condition: { slug: "off-guard", duration: { mode: "fixed", value: 1, unit: "rounds" } }, source: "Debilitating Bomb" }] }, played: "its bombs leave a hit foe off-guard until its next turn (always on)" }),
    // (Persistent damage of the bomb's splash, its type.)
    "sticky-bomb": () => ({ builtins: { strikeExtras: [{ when: "hit", bomb: true, splashPersistent: true, source: "Sticky Bomb" }] }, played: "its bombs' splash as persistent damage on a hit (always on)" }),
    // (A second reaction each round, for Reactive Strike only — B303's spare reaction.)
    "tactical-reflexes": (_level, host) => (host?.reactions?.aoo ? { builtins: { spareReactions: [{ names: ["reactive strike"], count: 1 }] }, played: "a second reaction each round, for Reactive Strike" } : null),
    // (A second reaction each round, for Shield Block only.)
    // (2026-11-05, Boundless Reprisals: a reaction at each enemy's turn for its fighter or guardian reactions — played as two more each round.)
    "boundless-reprisals": (_level, host) => {
        const names = [...(host?.reactions?.aoo ? ["reactive strike"] : []), ...(host?.reactions?.shieldBlock ? ["shield block"] : []), ...(host?.interceptAttack ? ["intercept attack"] : [])];
        return names.length ? { builtins: { spareReactions: [{ names, count: 2 }] }, played: `two more reactions each round, for ${names.join(", ")}` } : null;
    },
    "quick-shield-block": (_level, host) => (host?.reactions?.shieldBlock ? { builtins: { spareReactions: [{ names: ["shield block"], count: 1 }] }, played: "a second reaction each round, for Shield Block" } : null),
    // (A Reactive Strike's hit leaves its target off-guard until the start of the PC's next turn.)
    "disorienting-opening": (_level, host) => (host?.reactions?.aoo ? { builtins: { strikeExtras: [{ when: "hit", reaction: true, condition: { slug: "off-guard", duration: { mode: "fixed", value: 1, unit: "rounds" } }, source: "Disorienting Opening" }] }, played: "off-guard after its Reactive Strike hits (always on)" } : null),
    // (Permanently quickened, the extra action for a Strike — or Spellstrike's recharge —: a fighter's and a magus's turns are Strikes, so
    // played as quickened.)
    "weapon-supremacy": () => ({ builtins: { permanent: [{ slug: "quickened" }] }, played: "permanently quickened (always on)" }),
    "supreme-spellstrike": () => ({ builtins: { permanent: [{ slug: "quickened" }] }, played: "permanently quickened (always on)" }),
    // (Confident Finisher's miss deals all its precise dice, not half — fight.js.)
    "precise-finisher": (_level, host) => (host?.panacheStyle ? { builtins: { preciseFinisher: true }, played: "Confident Finisher's miss deals its full dice (always on)" } : null),
    // (A fatal firearm's critical hit: one more fatal die, after the doubling.)
    "fatal-bullet": (_level, host) => {
        const gun = (host?.strikes ?? []).find((strike) => strike.firearm && strike.fatal);
        return gun ? { builtins: { strikeExtras: [{ when: "critical", firearm: true, dice: 1, die: gun.fatal, noDouble: true, type: null, source: "Fatal Bullet" }] }, played: `one more d${gun.fatal} on a firearm's critical hit (always on)` } : null;
    },
};
// (2026-11-05, Cole: "keep working on the real gaps we have": a failed save rerolled — the feat module's reroll, a gap in a fight — read
// from the feat's Trigger and Effect: "You fail a saving throw against a mental effect" / "You fail, but don't critically fail, a Will save"
// with a reroll in its effect, as the hand readings' save-reroll (once a fight; a free action's free; the better kept unless it says to
// use the new result).)
function saveRerollEntry(doc, builtins) {
    if (!["reaction", "free"].includes(doc.system?.actionType?.value)) return null;
    const text = String(doc.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@\w+\[[^\]]*\](?:\{([^}]*)\})?/g, (all, label) => label ?? "").replace(/\s+/g, " ");
    const said = (/\bTrigger\s+(.+?)(?:\.|$)/i.exec(text)?.[1] ?? "").split(/\s(?:Effect|Frequency|Requirements?)\s/)[0].trim();
    const fail = /^You fail(?:, but don't critically fail,| or critically fail)? (?:an? )?(?:skill check or )?(Fortitude|Reflex|Will)?(?: or (?:Fortitude|Reflex|Will))?\s*(?:saving throw|save)(?: during a combat)?(?: against (?:an? )?(?:(\w+) effect|(spell)|condition or adverse effect.*))?$/i.exec(said);
    if (!fail || !/\breroll\b/i.test(text)) return null;
    const save = fail[1] && !/ or (?:Fortitude|Reflex|Will)/i.test(said) ? fail[1].toLowerCase() : null;
    const against = fail[3] ? "spell" : fail[2] && !/^(?:magical)$/i.test(fail[2]) ? fail[2].toLowerCase() : null;
    const keepNew = /\bmust use the (?:second|new) result\b|\buse the (?:second|new) result\b/i.test(text);
    addBuiltin(builtins, { builtin: "save-reroll", save, ...(against ? { against } : {}), ...(keepNew ? { keep: "new" } : {}), ...(doc.system.actionType.value === "free" ? { free: true } : {}) }, doc.name);
    return { spells: [], pools: {}, gap: null, played: `a failed ${save ? `${fail[1]} ` : ""}save${against ? ` against ${against === "spell" ? "a spell" : `a ${against} effect`}` : ""} rerolled` };
}

function handEntry(doc, level, builtins, wields, host = null) {
    const read = HAND[slugOf(doc)]?.(level, host, doc);
    if (!read) return null;
    // (Its requirement — Reactive Shield's "You are wielding a shield" —: a PC whose loadout can't meet it gets one that can.)
    // (2026-11-04: or what the hand reading says it needs — Homing Shot's bow, a ranged Strike its text doesn't make a requirement.)
    const requirement = [requirementText(doc), read.requires].find((text) => text && wields && meetsWielding(text, wields) === false) ?? requirementText(doc);
    if (requirement && wields && meetsWielding(requirement, wields) === false) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: its requirement, which the PC doesn't meet (${requirement})` } };
    for (const plan of read.plans ?? []) addBuiltin(builtins, plan, doc.name);
    for (const [field, value] of Object.entries(read.builtins)) builtins[field] = Array.isArray(value) ? [...(builtins[field] ?? []), ...value] : value && typeof value === "object" ? { ...(builtins[field] ?? {}), ...value } : value;
    return { spells: read.spells ?? [], pools: read.pools ?? {}, gap: null, played: read.played };
}

// (2026-11-03, Instant Opening's "Choose a target within 30 feet. It's Off-Guard against your attacks until the end of your next turn": Feint's
// own plan with no roll that matters — each degree the same, off-guard to the PC's attacks (all of them, any number) to the end of its next
// turn, 30 feet.)
// (2026-11-05, everyone: Call the Hunt's off-guard to all melee attacks until its next turn — played as off-guard to all.)
function offGuardToMeEntry(name, { range = "30 feet", traits = ["visual"], everyone = false } = {}) {
    const feint = basicActions.feint;
    if (!feint) return null;
    const effects = [everyone ? { kind: "condition", slug: "off-guard", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" } } : { kind: "condition", slug: "off-guard", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" }, scope: { against: "actor", attacks: "any", uses: null } }];
    const outcome = (row) => ({ ...row, effects: effects.map((effect) => structuredClone(effect)) });
    const outcomes = Object.fromEntries(Object.entries(feint.resolution.outcomes).map(([degree, row]) => [degree, outcome(row)]));
    const plan = { ...structuredClone(feint), source: { ...feint.source, name }, traits, activation: { ...feint.activation, traits }, targeting: { ...feint.targeting, range }, resolution: { ...structuredClone(feint.resolution), outcomes } };
    return { name, plan, castRank: 1, pool: null, kind: "basic" };
}

// (2026-11-02, the same ask: staying up at 0 Hit Points, which the engine plays for monsters — Ferocity's kin and an ally's rescue,
// actions.js knockOut —, and the feats that raise maximum Hit Points by the PC's level.)
const ZERO_HP = {
    "orc-ferocity": { ferocity: { hp: 1, wounded: true, uses: 1 } },
    // (Its Strike as it uses Orc Ferocity — which it needs, so with it.)
    "rampaging-ferocity": { ferocity: { hp: 1, wounded: true, uses: 1, strike: true, free: true } },
    "the-cycle-continues": { ferocity: { hp: (level) => `6d8+${Math.floor(level / 2)}`, wounded: false, uses: 1, free: true } },
    // (2026-11-03, the class feats no fight played: the reactions that keep their PC up at 0 Hit Points, once a fight — Cheat Death's
    // doomed, Ruby Resurrection's Fireball and Desperate Revival's drain aren't played.)
    "ferocity-mimicry": { ferocity: { hp: 1, wounded: true, uses: 1 } },
    unkillable: { ferocity: { hp: 1, wounded: false, uses: 1 } },
    // (2026-11-05, Iomedae's Valor: 1 Hit Point and temporary ones equal to its level — played as Hit Points; its +1 AC for a round isn't.)
    // (Cellular Reconstruction: its level in Hit Points as it would die, half its level at each of its next two turns — played as twice its
    // level at once.)
    "cellular-reconstruction": { ferocity: { hp: (level) => 2 * level, wounded: false, uses: 1 } },
    "iomedaes-valor": { ferocity: { hp: (level) => 1 + level, wounded: false, uses: 1 } },
    "cheat-death": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "sanguine-evasion": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "desperate-revival": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "ruby-resurrection": { ferocity: { hp: 30, wounded: false, uses: 1 } },
    // (10 + its level + its Constitution modifier.)
    "its-not-over": { ferocity: { hp: (level) => 10 + level + 2 + (level >= 5) + (level >= 10) + (level >= 20), wounded: false, uses: 1 } },
    // (In Tenacious Stance: and a melee Strike.)
    "cracked-mountain": { ferocity: { hp: 1, wounded: true, uses: 1, strike: true } },
    // (2026-11-04: 1 Hit Point and its level in temporary Hit Points for a round — counted as Hit Points —, wounded 1 more; once an hour.)
    "keep-up-the-good-fight": { ferocity: { hp: (level) => 1 + level, wounded: true, uses: 1 } },
    "cant-fall-here": { rescue: { within: 5, hp: 1, uses: 1 } },
    caterwaul: { rescue: { within: 30, hp: 1, uses: 1 } }
};
const slugOf = (doc) => doc.system?.slug ?? doc.name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function zeroHpEntry(doc, level, host, builtins) {
    const known = ZERO_HP[slugOf(doc)];
    if (known?.ferocity) {
        const { hp, strike, ...rest } = known.ferocity;
        const melee = (host.strikes ?? []).find((each) => each.melee);
        builtins.ferocityRule = { name: doc.name, pc: true, hp: typeof hp === "function" ? hp(level) : hp, ...rest, ...(strike && melee ? { strike: melee.name } : {}) };
        builtins.reactions = { ...(builtins.reactions ?? {}), ferocity: true };
        return { spells: [], pools: {}, gap: null, played: "staying up at 0 Hit Points" };
    }
    if (known?.rescue) {
        builtins.rescue = { name: doc.name, ...known.rescue };
        return { spells: [], pools: {}, gap: null, played: "keeping an ally up at 0 Hit Points" };
    }
    const text = String(doc.system?.description?.value ?? "");
    if ((doc.system?.actionType?.value ?? "passive") === "passive" && /(?:Increase your maximum Hit Points by (?:an amount equal to )?your level|Your maximum Hit Points increase by your level)/i.test(text) && !/Enlarge/i.test(text)) {
        builtins.maxHpBonus = (builtins.maxHpBonus ?? 0) + level;
        return { spells: [], pools: {}, gap: null, played: "more maximum Hit Points" };
    }
    return null;
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
    const model = effectModel(effect, { rank: level, actorLevel: level, conditionSlug });
    if (!(model.modifiers.length || model.tempHp || model.fastHealing || model.resistances.length || model.conditions.length || model.strikeParts || model.grantedStrikes?.length)) return null;
    const stance = (doc.system?.traits?.value ?? []).includes("stance");
    addBuiltin(builtins, { builtin: "self-effect", actions: type === "free" ? 0 : Number(doc.system?.actions?.value) || 1, stance, model }, doc.name);
    return { spells: [], pools: {}, gap: null, played: stance ? "PF2e's stance Effect" : "PF2e's self Effect" };
}

// (2026-11-01, Cole: "do feats that effect other things passively work? for example Guardian class feat Shield Warfare increases shield bash
// damage dice". A passive the feat module reads nothing for: its own PF2e rules, always on — the bonuses, resistances, Strikes and the like an
// Effect's rules give (effects.js effectModel) —, and its weapons' damage die upgrades (ItemAlteration damage-dice-faces) on the Strikes its
// predicate names.)
const STRIKE_TRAITS = new Set(["agile", "finesse", "deadly", "versatile"]);
// Whether a Strike meets an ItemAlteration's predicate on its weapon: true, false, or null (a term it can't tell).
function strikeMeets(strike, predicate) {
    for (const term of [].concat(predicate ?? [])) {
        if (typeof term !== "string") return null;
        if (term === "item:equipped" || term === "item:type:weapon") continue;
        if (term === "item:melee") { if (!strike.melee) return false; continue; }
        if (term === "item:ranged") { if (strike.melee) return false; continue; }
        const group = /^item:group:([\w-]+)$/.exec(term)?.[1];
        if (group) { if ((strike.iwr?.group ?? null) !== group) return false; continue; }
        const trait = /^item:trait:([\w-]+)$/.exec(term)?.[1];
        if (trait && STRIKE_TRAITS.has(trait)) { if (!strike[trait]) return false; continue; }
        return null;
    }
    return true;
}
// A passive's damage die upgrades on its weapons: the predicates, one step each.
const dieUpgrades = (doc) => (doc.system?.rules ?? []).filter((rule) => rule?.key === "ItemAlteration" && rule.itemType === "weapon" && rule.mode === "upgrade" && rule.property === "damage-dice-faces").map((rule) => rule.predicate ?? []);
const DIE_STEPS = [4, 6, 8, 10, 12];
const upgradeDie = (strike) => ({ ...strike, damage: strike.damage.map((part, index) => (index === 0 && DIE_STEPS.includes(part.die) ? { ...part, die: DIE_STEPS[Math.min(DIE_STEPS.length - 1, DIE_STEPS.indexOf(part.die) + 1)] } : part)) });
export function upgradedStrikes(doc, strikes) {
    const upgrades = dieUpgrades(doc);
    if (!upgrades.length) return null;
    let changed = false;
    const out = strikes.map((strike) => {
        let next = strike;
        for (const predicate of upgrades) if (strikeMeets(strike, predicate) === true) next = upgradeDie(next);
        if (next !== strike) changed = true;
        return next;
    });
    return changed ? out : null;
}
// The passive's own rules as an always-on Effect, or null when they hold nothing a fight counts.
// (2026-11-02, the same pick: a passive's resistance that waits on the PC's own choice or feature — Warding Jewel's "has-sarangay-head-gem",
// Draconic Resistance's damage type —, which a PC with the feat has: on, its type a ChoiceSet's pick (the one the foes deal most, as
// applied). One waiting on the moment — a target's, a damage's, a condition's — stays as it was.)
const MOMENT = /^(?:target|origin|item|damage|attack|check|action|self:condition|self:effect|terrain|lighting|encounter|enemy|ally)\b/;
const termsOf = (predicate) => JSON.stringify(predicate ?? []).match(/"[^"]*"/g)?.map((term) => term.slice(1, -1)) ?? [];
function ownRulesDoc(doc) {
    const rules = doc.system?.rules ?? [];
    const picks = rules.filter((rule) => rule?.key === "ChoiceSet" && Array.isArray(rule.choices)).flatMap((rule) => rule.choices.map((choice) => choice?.value).filter((value) => typeof value === "string"));
    let changed = false;
    const fixed = rules.map((rule) => {
        if (rule?.key !== "Resistance") return rule;
        let next = rule;
        // (Its predicate kept where it names a moment, or the feat's own pick — Magical Resistance's "feat:magical-resistance:cold", which
        // effectModel's choices settle.)
        if (next.predicate && !termsOf(next.predicate).some((term) => MOMENT.test(term) || picks.some((pick) => term.endsWith(`:${pick}`)))) {
            const { predicate, ...rest } = next;
            next = rest;
        }
        if (/^\{(?:actor|item)\|/.test(String(next.type ?? "")) && picks.length) next = { ...next, type: "{item|flags.system.rulesSelections.pick}" };
        changed ||= next !== rule;
        return next;
    });
    if (!changed) return doc;
    const choiceRule = picks.length ? [{ key: "ChoiceSet", flag: "pick", choices: picks.map((value) => ({ value })) }] : [];
    return { ...doc, system: { ...doc.system, rules: [...fixed.filter((rule) => !(rule?.key === "ChoiceSet" && rule.flag !== "pick" && fixed.some((each) => each?.key === "Resistance" && String(each.type).includes("rulesSelections.pick")))), ...choiceRule] } };
}

function passiveRulesEntry(doc, level, builtins) {
    if ((doc.system?.actionType?.value ?? "passive") !== "passive" || !(doc.system?.rules ?? []).length) return null;
    const model = effectModel(ownRulesDoc(doc), { rank: level, actorLevel: level, conditionSlug });
    // (A choice still open — Champion Dedication's cause —: not a fight's to make.)
    let { choices, choiceByDegree, ...rest } = model;
    // (2026-11-02, Cole's pick "Spells, 0 HP, dropped passives": a choice made when the feat is taken — Draconic Resistance's damage type,
    // Magical Resistance's —, the PC's pick: the one a fight here gets most from, a resistance to what the foes deal (their Strikes'
    // physical damage) first, else the first that holds something.)
    if (!worthSomething(rest) && choices?.length) {
        const PHYSICAL = new Set(["physical", "slashing", "piercing", "bludgeoning", "all-damage"]);
        const score = ({ model: each }) => {
            const { choices: inner, choiceByDegree: degree, ...flat } = each ?? {};
            if (!worthSomething(flat)) return -1;
            return (flat.resistances ?? []).some((entry) => PHYSICAL.has(entry.type) || entry.type === "choice") ? 2 : 1;
        };
        const best = choices.slice().sort((a, b) => score(b) - score(a))[0];
        if (best && score(best) > 0) ({ choices, choiceByDegree, ...rest } = best.model);
    }
    if (!worthSomething(rest)) return null;
    builtins.passiveEffects = [...(builtins.passiveEffects ?? []), { ...rest, rounds: Infinity }];
    return { spells: [], pools: {}, gap: null, played: "PF2e rules (always on)", situational: Boolean(rest.situational) };
}

let kineticistReader = null;
try {
    const KINETICIST_ROOT = SIBLING(["pf2e-automatic-kineticist-resolution", "PF2e AUTOMATIC KINETICIST RESOLUTION"]);
    if (KINETICIST_ROOT) kineticistReader = await import(new URL("src/reader/impulse-reader.js", KINETICIST_ROOT).href);
} catch {
    kineticistReader = null;
}
function impulsePlan(doc, level) {
    if (!kineticistReader || !(doc.system?.traits?.value ?? []).includes("impulse")) return null;
    let plan;
    try {
        plan = kineticistReader.readImpulse(doc, { level });
    } catch {
        return null;
    }
    // (A save with what a fight reads — its damage or a degree's condition —, used as an action.)
    if (plan?.resolution?.kind !== "save" || plan.trigger?.event === "reaction") return null;
    const outcomes = Object.values(plan.resolution.outcomes ?? {});
    if (!plan.resolution.sharedDamage?.components?.length && !outcomes.some((row) => row?.conditions?.length)) return null;
    // (2026-11-03: its targeting in the spell compiler's words — the kineticist reader's "target: { count: 1, range: 120 }" and "area: { …,
    // within: 60 }" read as no target by the planner, so Glacial Prison, Storm Spiral and Rain of Razors were never used.)
    const targeting = plan.targeting ?? {};
    const target = targeting.target && typeof targeting.target === "object" ? targeting.target : null;
    const range = Number(target?.range ?? targeting.area?.within ?? (typeof targeting.range === "number" ? targeting.range : NaN));
    const fixed = {
        ...targeting,
        target: target ? `${Number(target.count) > 1 ? `${target.count} creatures` : "1 creature"}` : targeting.target ?? null,
        range: Number.isFinite(range) ? `${range} feet` : typeof targeting.range === "string" ? targeting.range : null,
        area: targeting.area ? { type: targeting.area.type, value: targeting.area.value } : null
    };
    // (Its damage and degrees in the spell compiler's words too: components with ids the degrees' damage names, "shared" or "none", a
    // degree's conditions as condition effects (its generated Effects aren't played), the save at the source's DC. Read as written, every
    // impulse here dealt nothing, so none was ever used — batch 1's impulse ratings were all 0.)
    const shared = plan.resolution.sharedDamage;
    const components = (shared?.components ?? []).filter((part) => !part.healing).map((part, index) => ({ id: String(index), formula: part.formula, type: part.type ?? "untyped", category: part.category ?? null, applyModifier: false, kinds: ["damage"], materials: [] }));
    const ids = components.map((part) => part.id);
    const degrees = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, row]) => {
        const multiplier = Number(row?.damage?.multiplier) || 0;
        const effects = (row?.conditions ?? []).filter((each) => each?.slug).map((each) => ({ kind: "condition", slug: each.slug, name: each.slug, value: Number.isFinite(each.value) ? each.value : null, duration: null, source: doc.name }));
        return [degree, { damage: { mode: multiplier > 0 && ids.length ? "shared" : "none", multiplier: ids.length ? multiplier : 0, sourceComponentIds: multiplier > 0 ? ids : [] }, effects, nativeEffects: [], modifiers: [], followUps: [], decisions: [], manualInstructions: [], terminal: null, rawText: "" }];
    }));
    const check = plan.resolution.check ?? {};
    const resolution = { ...plan.resolution, check: { statistic: check.statistic, basic: Boolean(check.basic), dcSource: "source-actor" }, sharedDamage: components.length ? { mode: "pf2e-item-damage", rollOnce: true, components, heightening: null } : null, outcomes: degrees };
    return { ...plan, targeting: fixed, resolution, trigger: { ...(plan.trigger ?? {}), event: "use" } };
}

// (2026-11-03, the class feats no fight played: the impulses the kineticist module reads as something other than a save — Timber Sentinel's
// "spell" (Protector Tree), Molten Wire's and Elemental Artillery's impulse "attack", Dash of Herbs' "heal".) As a spell the spell compiler
// reads, at the PC's class DC (its impulse attack the DC − 10): the named spell at half the PC's level rounded up; an attack's first damage
// (its riders aren't played) against one creature in its range; a heal's dice on one creature. An action only.
function kineticistEntry(doc, level, host) {
    if (!kineticistReader || !(doc.system?.traits?.value ?? []).includes("impulse") || (doc.system?.actionType?.value ?? "passive") !== "action" || !alwaysMet(doc)) return null;
    let plan;
    try {
        plan = kineticistReader.readImpulse(doc, { level });
    } catch {
        return null;
    }
    const resolution = plan?.resolution;
    if (!resolution || plan.trigger?.event === "reaction") return null;
    const own = dcsOf(host);
    const dc = own.class ?? 10 + level + 2;
    const castRank = Math.max(1, Math.ceil(level / 2));
    const time = String(plan.activation?.time ?? doc.system?.actions?.value ?? 2);
    const finish = (spell, compiled, played) => {
        if (!compiled?.resolution || ["unsupported", "no-effect"].includes(compiled.resolution.kind)) return null;
        if (compiled.activation) compiled = { ...compiled, activation: { ...compiled.activation, time } };
        const entry = { name: `${spell.name === doc.name ? doc.name : `${spell.name} (${doc.name})`}`, plan: compiled, castRank, dc, attack: dc - 10, pool: null, effects: spellPack.withTextConditions(spellPack.effectModels(compiled, castRank), spell, castRank) };
        return castable(entry) ? { spells: [entry], pools: {}, gap: null, played } : null;
    };
    const compile = (spell) => {
        try {
            return spellPack.compileSpell(spell);
        } catch {
            return null;
        }
    };
    if (resolution.kind === "spell" && resolution.spell) {
        const named = String(resolution.spell.uuid ?? "").replace(/^.*\.Item\./, "");
        const spell = spellPack.spellNamed(resolution.spell.name ?? named) ?? spellPack.spellNamed(named) ?? null;
        if (!spell) return null;
        return finish(spell, compile(spell), `impulse: casts ${spell.name} (rank ${castRank}, DC ${dc})`);
    }
    const base = (traits, description, extra) => ({ ...doc, type: "spell", system: { ...doc.system, rules: [], traits: { value: traits, rarity: "common" }, description: { value: description }, level: { value: 1 }, heightening: undefined, time: { value: time }, area: null, defense: null, duration: { value: "" }, ...extra } });
    if (resolution.kind === "attack" && resolution.attack && resolution.sharedDamage?.components?.length) {
        // (Every part of its damage — Whirling Grindstone's slashing and fire —; Magnetic Pinions' three targets are one here.)
        const parts = resolution.sharedDamage.components.filter((each) => !each.healing && /^\d+d\d+(?:\+\d+)?$/.test(String(each.formula)));
        if (!parts.length || parts.length < resolution.sharedDamage.components.length) return null;
        const typeOf = (each) => each.type ?? (doc.system?.traits?.value ?? []).find((trait) => ["fire", "cold", "electricity", "acid", "sonic"].includes(trait)) ?? "bludgeoning";
        const part = { formula: parts.map((each) => each.formula).join(" + ") };
        const type = parts.map(typeOf).join(" and ");
        const range = Number(resolution.attack.range) || 30;
        // (On a spell attack cantrip's own shape, Ignition's: the compiler reads an attack from it.)
        const template = spellPack.spellNamed("Ignition");
        if (!template) return null;
        const spell = { ...template, _id: doc._id, name: doc.name, system: { ...template.system, traits: { value: ["attack", "manipulate"], rarity: "common" }, description: { value: `<p>Make a spell attack roll against the target's AC, dealing ${parts.map((each) => `${each.formula} ${typeOf(each)} damage`).join(" and ")} on a hit.</p><hr /><p><strong>Critical Success</strong> The target takes double damage.</p><p><strong>Success</strong> The target takes full damage.</p>` }, heightening: undefined, time: { value: time }, target: { value: "1 creature" }, range: { value: `${range} feet` }, damage: Object.fromEntries(parts.map((each, index) => [index, { applyMod: false, category: null, formula: each.formula, kinds: ["damage"], materials: [], type: typeOf(each) }])) } };
        return finish(spell, compile(spell), `impulse attack: ${part.formula} ${type} (${range} feet, attack +${dc - 10})`);
    }
    if (resolution.kind === "heal" && resolution.healing?.components?.length && plan.targeting?.target?.count === 1) {
        const formula = String(resolution.healing.components[0].formula);
        if (!/^\d+d\d+(?:\+\d+)?$/.test(formula)) return null;
        const range = Number(plan.targeting.target.range) || 30;
        const spell = base(["healing", "manipulate"], `<p>You heal the target's wounds. The target regains ${formula} Hit Points when you Cast the Spell.</p>`, { target: { value: "1 willing creature" }, range: { value: `${range} feet` }, damage: { 0: { applyMod: false, category: null, formula, kinds: ["healing"], materials: [], type: "untyped" } } });
        return finish(spell, compile(spell), `impulse heal: ${formula} (${range} feet)`);
    }
    return null;
}

const HOST_OVERRIDE = { "shield-block": "cleric" };
// (2026-11-05, a fighter-and-guardian feat for a shield — Reflexive Shield: on the guardian, whose loadout has one; the fighter's hasn't.)
const CLASS_OVERRIDE = { "reflexive-shield": "guardian", "fight-or-flight": "swashbuckler", "thrall-charger": "necromancer" };

// The party with the feat on its PC, or { skipped, reason }.
// options: { hostId, party } — the PC to give it to (else its class's, or the fighter, or the PC best at its skill) and the party to start from
// (else the standard one: an ancestry's PC with its feats so far, tools/lib/ancestry-power.mjs).
// (2026-11-03, Cole: "begin working on implementing them" — the class feats no fight played. A feat that needs a stance, Tiger Slash's "You
// are in Tiger Stance": the stance is the PC's on both sides, the feat's party against the same party with the stance alone.)
export function partyWithFeat(doc, level, options = {}) {
    const result = partyWithFeatOwn(doc, level, options);
    if (!result.skipped || options.granted) return result;
    // (2026-11-03, the class feats no fight played: Bastion Dedication's "You gain the Reactive Shield fighter feat", Dual-Weapon Warrior
    // Dedication's Double Slice — a feat that only grants another: played as that feat.)
    // (2026-11-03: or an action from the actions pack — Stone Brawler Dedication's "You gain the Stonestrike Stance action", Stalwart
    // Defender's Tenacious Stance.)
    const html = String(doc.system?.description?.value ?? "");
    const granted = /You gain the @UUID\[Compendium\.pf2e\.feats-srd\.Item\.([^\]]+)\](?:\{[^}]*\})? (?:[\w-]+ )?(?:feat|class feat)\b/.exec(html)?.[1]
        ?? /You gain the @UUID\[Compendium\.pf2e\.actionspf2e\.Item\.([^\]]+)\](?:\{[^}]*\})? (?:action|reaction|activity|free action)\b/.exec(html)?.[1]
        // (Or named without a link — Bullet Dancer Dedication's "You gain the Bullet Dancer Stance action", when the packs have it.)
        ?? [/You gain the ((?:[A-Z][\w'-]*)(?: (?:[A-Z][\w'-]*|of|the|a))*) (?:action|reaction|activity|free action|feat)\b/.exec(html.replace(/<[^>]+>/g, " "))?.[1]].find((name) => name && featByName(name));
    const textDoc = granted ? featByName(granted) ?? docsOf(`${PACK_ROOT}/feats`).get(granted) ?? null : null;
    // (2026-11-04, Cole: "Make sure the simulator recognizes the feats that grant feats, features or choices": PF2e's GrantItem rules — Wind
    // Pillow's Powerful Leap, Spellstriker's Spellstrike, Uncanny Dodge's Deny Advantage —, and a GrantItem of a ChoiceSet's pick — Basic
    // Shooting's — each of its options in turn. The first the fights play is the feat's.)
    const candidates = [...(textDoc ? [textDoc] : []), ...grantedItems(doc, level)].filter((each, index, all) => each !== doc && all.indexOf(each) === index);
    if (!candidates.length) return result;
    const tried = [];
    for (const grantedDoc of candidates) {
        const through = partyWithFeat(grantedDoc, level, { ...options, granted: true });
        if (!through.skipped) return { ...through, granted: grantedDoc.name, played: `${grantedDoc.name}: ${through.played}` };
        tried.push(`${grantedDoc.name}: ${through.reason}`);
    }
    return { ...result, reason: `it grants ${tried.length === 1 ? tried[0] : `one of ${tried.length} (${tried.slice(0, 4).join("; ")}${tried.length > 4 ? "; …" : ""})`}` };
}

// The items a feat's GrantItem rules give, from the packs the simulator reads (feats, actions, class features), a ChoiceSet's options for
// one that grants its pick ("{item|flags.system.rulesSelections.basicShooting}"); the ones at or below the level only. Equipment, spells
// and ancestry features aren't followed.
const GRANT_PACKS = { "feats-srd": "feats", actionspf2e: "actions", classfeatures: "class-features" };
function packDoc(uuid) {
    const hit = /^Compendium\.pf2e\.([\w-]+)\.(?:Item\.)?(.+)$/.exec(String(uuid ?? ""));
    const pack = hit && GRANT_PACKS[hit[1]];
    if (!pack) return null;
    const docs = docsOf(`${PACK_ROOT}/${pack}`);
    return docs.get(hit[2]) ?? [...docs.values()].find((each) => each.name.toLowerCase() === hit[2].toLowerCase()) ?? null;
}
function grantedItems(doc, level) {
    const rules = doc.system?.rules ?? [];
    const out = [];
    for (const rule of rules) {
        if (rule.key !== "GrantItem" || typeof rule.uuid !== "string") continue;
        const flag = /^\{item\|flags\.(?:system|pf2e)\.rulesSelections\.([\w-]+)\}$/.exec(rule.uuid)?.[1];
        if (!flag) {
            const each = packDoc(rule.uuid);
            if (each) out.push(each);
            continue;
        }
        const choice = rules.find((other) => other.key === "ChoiceSet" && (other.flag ?? "") === flag);
        // (A list of options, or a filter of the packs' feats — Basic Shooting's "item:category:class", "item:trait:gunslinger", level ≤ 2.)
        const options = Array.isArray(choice?.choices) ? choice.choices.map((option) => packDoc(option?.value)).filter(Boolean)
            : choice?.choices?.filter && (choice.choices.itemType ?? "feat") === "feat" ? [...docsOf(`${PACK_ROOT}/feats`).values()].filter((each) => itemMatches(each, choice.choices.filter)) : [];
        for (const each of options) if (Number(each.system?.level?.value ?? 0) <= level) out.push(each);
    }
    // (The pick a player would make: the option with the best rating the compendium already shows, src/data/feat-ratings.json — Basic
    // Breakthrough's first option, a weak one, rated it −1.28 —; the unrated after, the lowest level first, then by name, so the pick is the
    // same each run.)
    const rated = (each) => storedRating(each._id);
    return out.sort((a, b) => (rated(b) ?? -Infinity) - (rated(a) ?? -Infinity) || Number(a.system?.level?.value ?? 0) - Number(b.system?.level?.value ?? 0) || a.name.localeCompare(b.name)).slice(0, 24);
}
let storedRatings = null;
function storedRating(id) {
    if (!storedRatings) {
        try {
            const data = JSON.parse(fs.readFileSync(new URL("../../src/data/feat-ratings.json", import.meta.url), "utf8"));
            storedRatings = Object.assign({}, ...Object.values(data.ratings ?? {}));
        } catch {
            storedRatings = {};
        }
    }
    return Number.isFinite(storedRatings[id]) ? storedRatings[id] : null;
}
// A ChoiceSet filter on an item: its strings ("item:category:class", "item:trait:x", "item:slug:x", "item:tag:x") and { lte, gte, or, and, not }
// on "item:level"; anything else fails the item.
function itemMatches(item, filter) {
    const traits = item.system?.traits?.value ?? [];
    const level = Number(item.system?.level?.value ?? 0);
    const one = (term) => {
        if (typeof term === "string") {
            const [, kind, value] = /^item:(category|trait|slug|tag|level):(.+)$/.exec(term) ?? [];
            if (kind === "category") return item.system?.category === value;
            if (kind === "trait") return traits.includes(value);
            if (kind === "slug") return (item.system?.slug ?? slugOf(item)) === value;
            if (kind === "level") return level === Number(value);
            return false;
        }
        if (term?.lte) return term.lte[0] === "item:level" && level <= Number(term.lte[1]);
        if (term?.gte) return term.gte[0] === "item:level" && level >= Number(term.gte[1]);
        if (term?.or) return term.or.some(one);
        if (term?.and) return term.and.every(one);
        if (term?.not) return !one(term.not);
        return false;
    };
    return (Array.isArray(filter) ? filter : [filter]).every(one);
}
const STANCE_PASSIVES = { "inner-fire-monk": "Stoked Flame Stance" };
function partyWithFeatOwn(doc, level, options = {}) {
    // (Or the feat whose Effect it needs: Dueling Riposte's "You are benefiting from Dueling Parry".)
    const needed = requiredEffectFeat(requirementText(doc) ?? "");
    // (2026-11-03: or a passive that works only in a stance it names outside a requirement — Inner Fire's "While you're in Stoked Flame
    // Stance".)
    const stances = requiredStances(requirementText(doc) ?? "") ?? (needed && featByName(needed) ? [needed] : null) ?? (STANCE_PASSIVES[slugOf(doc)] ? [STANCE_PASSIVES[slugOf(doc)]] : null);
    if (!stances || options.party) return partyWithFeatAlone(doc, level, options);
    const stanceDoc = stances.map((name) => featByName(name)).find(Boolean);
    if (!stanceDoc) return { skipped: true, reason: `its stance (${stances.join(" or ")}), not in the packs` };
    const withStance = partyWithFeatAlone(stanceDoc, level, options);
    if (withStance.skipped) return { ...withStance, reason: `its stance (${stanceDoc.name}): ${withStance.reason}` };
    const result = partyWithFeatAlone(doc, level, { hostId: withStance.host, party: withStance.party });
    if (result.skipped) return result;
    // (The Effect it puts on, by its own name — Dueling Parry's is PF2e's "Effect: Parry" —: the requirement's names too.)
    const pc = result.party.find((c) => c.id === result.host);
    const aliases = [...new Set((pc?.spells ?? []).filter((entry) => entry.name === stanceDoc.name).flatMap((entry) => Object.values(entry.effects ?? {}).map((model) => String(model?.name ?? "").replace(/^(?:Effect|Stance): /, ""))).filter(Boolean))];
    if (pc && aliases.length) {
        const widen = (requires) => (typeof requires === "string" && requires.startsWith("stance:") ? `${requires}|${aliases.join("|")}` : requires);
        for (const list of ["strikeActivities", "multiStrikes"]) if (pc[list]) pc[list] = pc[list].map((entry) => ({ ...entry, requires: widen(entry.requires) }));
        pc.spells = (pc.spells ?? []).map((entry) => (entry.plan?.requires ? { ...entry, plan: { ...entry.plan, requires: widen(entry.plan.requires) } } : entry));
        if (pc.reactionStrikes) pc.reactionStrikes = pc.reactionStrikes.map((entry) => (entry.requiresEffect && entry.requiresEffect.toLowerCase() === stanceDoc.name.toLowerCase() ? { ...entry, requiresEffect: aliases[0] } : entry));
    }
    return { ...result, plain: result.plain ?? withStance.party, stance: stanceDoc.name, played: `${result.played} (in ${stanceDoc.name})` };
}
const featsByName = new Map();
function featByName(name) {
    // (2026-11-03: or an action of the packs' — Tenacious Stance, Claw Stance and Stonestrike Stance, which archetype feats need —, a feat's
    // own first.)
    if (!featsByName.size) for (const pack of ["actions", "feats"]) for (const doc of docsOf(`${PACK_ROOT}/${pack}`).values()) featsByName.set(doc.name.toLowerCase(), doc);
    return featsByName.get(String(name).toLowerCase()) ?? null;
}

// (2026-11-04, Cole: "Prioritize the combat passives and actions": Rallying Banner's "each ally within 30 feet", Torrent in the Blood's "each
// creature in a 30-foot cone" — a heal the feat module rolls for each creature it names, with no area the engine reads.) Its allies within that
// many feet, as Inspire Courage's emanation reaches them; only a plan whose every effect is a heal and which deals no damage.
// (2026-11-05: a feat's Trigger line, as src/engine/triggers.js plays it — { on, melee?, unarmed?, whileDown? } —, or null.)
export function featTriggerOf(doc) {
    // (A link with no label, "@UUID[…conditionitems.Item.Frightened]": its name, not nothing.)
    const text = String(doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@UUID\[[^\]]*?Item\.([A-Za-z][^\]]*)\](?!\{)/g, (_all, name) => (/^[A-Za-z0-9]{16}$/.test(name) ? "" : name)).replace(/@\w+\[[^\]]*\](?:\{([^}]*)\})?/g, (all, label) => label ?? "").replace(/\s+/g, " ");
    const said = (/\bTrigger\s+(.+?)(?:\.|$)/i.exec(text)?.[1] ?? "").split(/\s(?:Effect|Frequency|Requirements?)\s/)[0].trim();
    const whileDown = /\beven while\b/i.test(text);
    if (/^Your turn begins$/i.test(said)) return { on: "turn-start" };
    if (/^(?:A|An) (?:creature(?: or object)?|enemy|foe)(?: adjacent to you| you are aware of| you can see| within \d+ feet)? damages you\b/i.test(said)) return { on: "damaged", ...(/adjacent|melee|unarmed|reach/i.test(said) ? { melee: true } : {}) };
    // (2026-11-05, the one-off feats: a hit on it, its own hit, its Shield Block.)
    if (/^(?:An? )?(?:adjacent )?(?:enemy|foe|creature)(?: you're aware of| you can see| you're observing)? (?:hits you with an? (?:attack|Strike)|critically succeeds (?:on|at) an? Strike against you)/i.test(said)) return { on: "hit", ...(/adjacent/i.test(said) ? { melee: true } : {}), ...(/critically/i.test(said) ? { critOnly: true } : {}) };
    if (/^Your Strike (?:with [^,]+ )?hits\b/i.test(said)) return { on: "strike-hit" };
    if (/^You use the Shield Block reaction\b/i.test(said)) return { on: "shield-block", ...(/adjacent/i.test(said) ? { melee: true } : {}), ...(/\bis undead\b/i.test(said) ? { creature: "undead" } : {}) };
    const would = /^(?:A Strike|An attack(?: or effect)?|An? (?:creature|enemy|foe)(?:'s)? (?:attack|Strike)) would (?:deal )?damage (?:to )?you$/i.exec(said);
    if (would) return { on: "would-damage", ...(/effect/i.test(said) ? {} : { strike: true }) };
    const typed = /^You would take (\w+) damage$/i.exec(said);
    if (typed) return { on: "would-damage", type: typed[1].toLowerCase() };
    if (/^You (?:bring|reduce) (?:a|an) (?:foe|enemy|creature) to 0 Hit Points/i.test(said) || /^You successfully reduce one or more .*(?:enemies|foes|creatures) to 0 Hit Points/i.test(said)) return { on: "foe-down" };
    if (/^You critically (?:succeed|hit) (?:with|on) an? (unarmed )?Strike/i.test(said)) return { on: "crit", ...(/unarmed/i.test(said) ? { unarmed: true } : {}) };
    if (/^A creature reduces you or (?:a|an) (?:living )?ally within \d+ feet to 0 Hit Points/i.test(said)) return { on: "ally-down", ...(whileDown ? { whileDown: true } : {}) };
    if (/^You are reduced to 0 Hit Points by a creature/i.test(said)) return { on: "self-down", whileDown: true };
    // (2026-11-05, Cole's pick "both, riders first": fear lowered as it comes — its own (Creature Comforts), an ally's (Reassuring Presence,
    // Comforting Presence, Reminder of the Greater Fear) — or at the start of its turn (Mask of Fear).)
    if (/^You (?:become|gain the) frightened(?: condition)?$/i.test(said)) return { on: "frightened" };
    if (/^You start your turn with the frightened condition$/i.test(said)) return { on: "turn-start", withCondition: "frightened" };
    const allyFear = /^(?:An? )?(adjacent ally|ally within (\d+) feet(?: of you)?|Another creature within (\d+) feet of you)\b[^.]*?\b(?:gains|becomes|would gain) (?:the )?frightened\b/i.exec(said);
    // (A foe's roll: misfortune as it's about to attack — Harbinger's Caw — or after its critical failure — Ill Tide.)
    const foeRoll = /^A creature within (\d+) feet(?: of you)? (is about to attempt an attack roll|critically fails an attack roll)\b/i.exec(said);
    if (foeRoll) return { on: /critically/i.test(foeRoll[2]) ? "foe-crit-fail" : "foe-attack", within: Number(foeRoll[1]) };
    // (Lucky Escape, Wood Ward: an attack on it, before the roll.)
    if (/^An? (?:creature|enemy|foe)(?: you can see)? targets you with an attack(?:,? even if you aren't aware of it|,? and you can see the attacker)?$/i.test(said)) return { on: "foe-attack", atYou: true };
    if (allyFear) return { on: "ally-frightened", toTrigger: true, within: /adjacent/i.test(allyFear[1]) ? 5 : Number(allyFear[2] ?? allyFear[3]) };
    return null;
}

const ALLY_CONDITIONS = new Set(["quickened", "concealed", "hidden", "invisible"]);
function alliesAreaHeal(plan) {
    // (2026-11-05: "you and each ally within 5 feet", "each willing ally", and a condition only good for its allies — Cadence Call's
    // quickened, Banner Twirl's concealed — as well as a heal. Before, read as one creature and aimed at a foe, never used.)
    const said = /^(?:you and )?each (?:ally|willing ally|creature|living creature|of your allies)(?: \(including you\))? (?:within (\d+) feet|in an? (\d+)-foot (cone|emanation|burst))$/i.exec(String(plan?.targeting?.target ?? ""));
    if (!said || plan.targeting.area || plan.resolution?.sharedDamage) return plan;
    const effects = Object.values(plan.resolution?.outcomes ?? {}).flatMap((row) => row?.effects ?? []);
    if (!effects.length || !effects.every((effect) => effect.kind === "heal" || (effect.kind === "condition" && ALLY_CONDITIONS.has(effect.slug)))) return plan;
    return { ...plan, targeting: { ...plan.targeting, allies: true, area: { type: said[3]?.toLowerCase() ?? "emanation", value: Number(said[1] ?? said[2]) } } };
}

// (2026-11-05: "you" as the target of a plan whose every effect is a condition only good for its holder — Heat Wave's and Storm Shroud's
// concealed — the caster itself, as "self". Before, no target the engine reads: never played. Not other conditions on "you": the module
// reads Inner Strength's lowered enfeebled, Statue's ended off-guard and the like as the condition itself.)
// (2026-11-05, the one-off feats: a requirement that is a state of the PC the simulator doesn't track — "Your waking world is active", "You
// are overflowing", "Your swarm is outside your body", "You are riding your mount" — taken as met, so the feat rates as it is when it can be
// used; its row says so. Not one about the last action, a target, a creature or what's in reach: those the planner checks or they're
// unread. FEAT_ASSUME_STATE=0 turns it off.)
const ASSUMABLE = /^(?:Your|You're|You are|You have)\b/i;
const NOT_ASSUMABLE = /\b(?:last|previous|most recent) action\b|\btarget\b|\bcreature\b|\benemy\b|\bfoe\b|\bally\b|\badjacent\b|\breach\b|\bwithin \d+ feet\b|\bdoomed\b|\bfatigued\b|\bwounded\b|\bdying\b|\bunconscious\b|\bHit Points\b|\bthis turn\b|\bthis round\b/i;
function assumeState(text, assumed) {
    if (process.env.FEAT_ASSUME_STATE === "0") return null;
    const said = String(text ?? "").replace(/@UUID\[[^\]]*?Item\.([^\]]+)\](?:\{([^}]*)\})?/g, (_all, name, label) => label ?? name).trim();
    if (!ASSUMABLE.test(said) || NOT_ASSUMABLE.test(said)) return null;
    assumed.push(said.replace(/\.$/, ""));
    return true;
}

function youAsSelf(plan) {
    if (!/^you$/i.test(String(plan?.targeting?.target ?? "")) || plan.targeting.area) return plan;
    const effects = Object.values(plan.resolution?.outcomes ?? {}).flatMap((row) => row?.effects ?? []);
    const automatic = plan.resolution?.check?.roll === "automatic";
    // (2026-11-05, the one-off feats: a hand card's temporary Hit Points on "you" — Feast's, Absorb Strength's — the PC's too.)
    // (And a condition of its own lowered, Creature Comforts' and Mask of Fear's frightened.)
    if (!effects.length || !effects.every((effect) => (effect.kind === "condition" && (ALLY_CONDITIONS.has(effect.slug) || (automatic && Number(effect.stack?.by) < 0))) || (effect.kind === "temp-hp" && automatic))) return plan;
    return { ...plan, targeting: { ...plan.targeting, target: "self" } };
}

// (2026-11-05) The feats that give or grow a companion (HAND's animalCompanion), the text of one that needs it, the stage a PC has by its level.
const HAND_COMPANION = new Set(Object.entries(HAND).filter(([, read]) => read.toString().includes("animalCompanion")).map(([slug]) => slug));
const HAND_ON_COMPANION = new Set(Object.entries(HAND).filter(([, read]) => /companionFields|companionActions|companionStrike|tandem/.test(read.toString())).map(([slug]) => slug));
const MOUNT_SLUGS = new Set(["cavalier-dedication", "faithful-steed", "impressive-mount", "incredible-mount", "loyal-warhorse", "imposing-destrier", "auspicious-mount", "specialized-mount", "drake-rider-dedication", "mature-dragon-companion", "incredible-dragon-companion", "mammoth-lord-dedication", "mature-megafauna-companion", "incredible-megafauna-companion", "specialized-megafauna-companion"]);
const RIDING_TEXT = /\b(?:riding (?:your|a|the) |you(?:'re| are) (?:mounted|riding)|while (?:you're |you are )?mounted|when you(?:'re| are) mounted|your mount\b|your steed\b)/i;
const COMPANION_TEXT = /\byour (?:animal )?companion(?:'s|s)?\b|\byour (?:mount|steed)\b/i;
const featText = (doc) => `${doc.system?.prerequisites?.value?.map((each) => each.value).join(" ") ?? ""} ${String(doc.system?.description?.value ?? "").replace(/<[^>]+>/g, " ")}`;
const companionStageAt = (level) => (level >= 16 ? "specialized" : level >= 10 ? "incredible" : level >= 6 ? "mature" : "young");
function partyWithFeatAlone(doc, level, { hostId = null, party: start = null } = {}) {
    // (2026-11-05: Shield Block on the cleric — the fighter has it already, so on the fighter it would rate as nothing.)
    if (!hostId && !start && HOST_OVERRIDE[slugOf(doc)]) hostId = HOST_OVERRIDE[slugOf(doc)];
    const classTrait = (!start && !hostId && CLASS_OVERRIDE[slugOf(doc)]) || (doc.system?.traits?.value ?? []).find((trait) => HOSTS[trait] || CLASS_SLUGS.includes(trait));
    // (2026-11-02, the user: "Get the simulator working with all classes": a class's feat on its own class — classes.js — the standard party
    // with that class's PC in its seat, rated against the same party without the feat.)
    // (2026-11-03: an archetype's stance for the unarmored — Six Pillars Stance's, Stunt Performer Stance's "You are unarmored" — on the
    // monk, the class that fights unarmored, rather than a fighter stripped of its armor.)
    const ownClass = classTrait ?? (!start && !hostId && /\b(?:are|you're) unarmored\b/i.test(requirementText(doc) ?? "") && CLASS_SLUGS.includes("monk") ? "monk" : null);
    const classPC = !start && !hostId && ownClass && CLASS_SLUGS.includes(ownClass) && !["fighter", "rogue", "wizard", "cleric"].includes(ownClass) && process.env.FEAT_OWN_CLASS !== "0";
    const party = start ?? (classPC ? classPartyFor(ownClass, level) : partyFor(level));
    if (classPC) hostId = ownClass;
    const compileFor = (host) => {
        try {
            return { plan: compileFeat(doc, { dcs: dcsOf(host), basicActions, itemReaders }) };
        } catch (error) {
            return { error: error.message };
        }
    };
    // (An archetype's spellshape — Intimidating Spell's — on the wizard: the party's caster of area spells.)
    const spellshape = (doc.system?.traits?.value ?? []).includes("spellshape");
    let host = party.find((c) => c.id === (hostId ?? (classTrait ? HOSTS[classTrait] : spellshape ? "wizard" : "fighter")));
    let compiled = compileFor(host);
    // (A feat of no class: the PC best at the skill its check uses.)
    if (!hostId && !classTrait && planSkill(compiled.plan)) {
        const skill = planSkill(compiled.plan);
        const best = party.reduce((top, c) => ((c.skills?.[skill] ?? -99) > (top.skills?.[skill] ?? -99) ? c : top), host);
        if (best !== host) {
            host = best;
            compiled = compileFor(host);
        }
    }
    if (compiled.error) return { skipped: true, reason: `compile error: ${compiled.error}`, host: host.id };
    // (2026-11-03, the class feats no fight played: a kineticist's impulse, read by the kineticist module — pf2e-automatic-kineticist-resolution's
    // reader, the plan its cards play — where it reads a save: Aerial Boomerang's line, Rain of Razors' burst, Glacial Prison's slow. The feat
    // module read some of them as timers.)
    const impulse = impulsePlan(doc, level);
    const plan = youAsSelf(alliesAreaHeal(withResolvedEffects(impulse ?? compiled.plan, resolveUuid)));
    // Its entries with what the PC wields: the party's own, or (a requirement it doesn't meet — Double Slice's two weapons) a loadout that does,
    // the plain party then fought with the same loadout.
    // (2026-11-03: the simulator's own readings — the hand table, Quickening Banner's quickened allies, Instant Opening's off-guard — win over
    // the feat module's plan when both read the feat. Once the plans resolved by their compendium source, a plan the AI never takes —
    // Quickening Banner's check — had set them aside, and the feat rated nothing.)
    const attemptWith = (wields, useModule) => {
        const builtins = {};
        const assumed = [];
        let entries = useModule
            ? featEntries(plan, featInfo(doc, level), builtins, { ...helpersAt(level), meets: (text) => meetsWielding(text, wields) ?? assumeState(text, assumed) })
            : { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: the feat module's plan set aside` } };
        if (assumed.length && entries && !entries.gap && entries.played) entries = { ...entries, played: `${entries.played} (requirement assumed: ${assumed[0]})` };
        // (An impulse's save at its class DC.)
        if (impulse && !entries.gap) {
            const dc = dcsOf(host).class ?? 10 + level + 2;
            entries = { ...entries, spells: entries.spells.map((entry) => ({ ...entry, dc, attack: dc - 10, castRank: Math.max(1, Math.ceil(level / 2)) })) };
        }
        // (2026-11-05: a reaction or free action played at its trigger — src/engine/triggers.js —, when its Trigger line is one the engine
        // reads.)
        if (!entries.gap && entries.spells?.length) {
            const trigger = featTriggerOf(doc);
            if (trigger) entries = { ...entries, spells: entries.spells.map((entry) => (["reaction", "free"].includes(entry.plan?.activation?.time) ? { ...entry, featTrigger: trigger } : entry)) };
        }
        // (2026-11-05: a plan the engine can't cast at all — Flying Flame's path, no target or area it reads —: a gap, not a 0.00 rating
        // from fights where it was never used; the readings below may still play it.)
        if (!process.env.FEAT_KEEP_UNPLAYABLE && !entries.gap && entries.spells?.length && !Object.keys(builtins).length && entries.spells.every((entry) => !castable(entry) && !entry.featTrigger)) entries = { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: a plan the engine can't play (its targeting or what it does)` } };
        // (What the feat module leaves, PF2e's own Effect an action links for its user — Dragon Stance's —: as the live snapshot plays it,
        // scripts/snapshot.js readSelfEffects.)
        if (entries.gap) {
            const own = selfEffectEntry(doc, level, builtins, wields);
            if (own?.unmet) entries = { ...entries, gap: { ...entries.gap, name: `${doc.name}: its requirement, which the PC doesn't meet (${own.unmet})` } };
            else if (own) entries = own;
        }
        // (A passive the feat module reads nothing for: its die upgrades on the PC's Strikes, or a loadout with the weapon they name; its rules.)
        let strikes = null;
        if (entries.gap && dieUpgrades(doc).length) {
            strikes = upgradedStrikes(doc, wields.strikes ?? []);
            entries = strikes ? { spells: [], pools: {}, gap: null, played: "PF2e rules: a bigger damage die" } : { ...entries, gap: { kind: "feat, not simulated", name: `${doc.name}: its requirement, which the PC doesn't meet (the weapon its damage die upgrade names)` } };
        }
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = spellLikeEntry(doc, level, plan) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = inlineSaveEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = kineticistEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = acReactionEntry(doc, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = saveBonusEntry(doc, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = inlineHealEntry(doc, level) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = widenEntry(doc, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = spellshapeEntry(doc, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = demoralizeAllEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = quickenAllEntry(doc, level) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = dedicationCantripEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = allyEffectEntry(doc, level) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = skillAttackEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = saveAuraEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = reachEntry(doc, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = stunningBlowsEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) {
            entries = twinDistractionEntry(doc, level, host) ?? entries;
            if (entries.twinFeint) builtins.multiStrikes = [...(builtins.multiStrikes ?? []), entries.twinFeint];
        }
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = critRiderEntry(doc, level, host, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = textSelfEffectEntry(doc, level, builtins, host, wields) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = innateSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = focusSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = rageSaveEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = handEntry(doc, level, builtins, wields, { ...host, strikes: wields.strikes ?? host.strikes }) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = saveRerollEntry(doc, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = zeroHpEntry(doc, level, host, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = passiveRulesEntry(doc, level, builtins) ?? entries;
        // (A requirement on what the PC wields the plan doesn't carry — Dueling Dance's "a single one-handed melee weapon and nothing else in
        // your hands", a stance's —: the feat's own text, so the PC that can't use it gets the loadout that can, both sides.)
        const required = requirementText(doc);
        if (!entries.gap && plan?.builtin !== "strike-activity" && required && meetsWielding(required, wields) === false) {
            entries = { ...entries, gap: { kind: "feat, not simulated", name: `${doc.name}: its requirement, which the PC doesn't meet (${required})` } };
        }
        return { entries, builtins, strikes };
    };
    const attempt = (wields) => {
        const own = attemptWith(wields, true);
        if (own.entries.gap || impulse) return own;
        const simulator = attemptWith(wields, false);
        return simulator.entries.gap ? own : simulator;
    };
    let tried = attempt({ ...wieldsOf(host), strikes: host.strikes });
    let base = party;
    let loadout = null;
    if (tried.entries.gap && /doesn't meet/.test(tried.entries.gap.name)) {
        for (const [name, way] of Object.entries(LOADOUTS)) {
            // (2026-11-03: a class PC in a seat the loadout fits — a ranger's bow traded for two blades for Twin Takedown.)
            if (!way.hosts.includes(host.id) && !(classPC && way.hosts.includes(seatOf(host.id)) && (host.strikes?.[0]?.held || !host.strikes?.[0]?.melee))) continue;
            const again = attempt({ ...wieldsOf(host), ...way.wields, strikes: way.strikes(host.strikes) });
            // (The reason the loadout that meets the requirement still doesn't play — Combat Grab's Strike —, the one reported.)
            if (again.entries.gap) {
                if (!/doesn't meet/.test(again.entries.gap.name) && /doesn't meet/.test(tried.entries.gap.name)) tried = { ...tried, entries: again.entries };
                continue;
            }
            tried = again;
            loadout = name;
            base = clone(party);
            const pc = base.find((c) => c.id === host.id);
            pc.strikes = way.strikes(pc.strikes);
            way.extra?.(pc);
            break;
        }
    }
    const { entries, builtins } = tried;
    if (entries.gap) return { skipped: true, reason: entries.gap.name.slice(doc.name.length + 2), host: host.id, plan };
    // (2026-11-05: a feat for a PC with an animal companion — Pack Movement, Heal Companion's spell, Bestial Protection —: the companion on
    // both sides, at the stage a PC of the level has.)
    // (Not beside an eidolon: a summoner's feat for "your companion" is for it.)
    const companionNeeded = !HAND_COMPANION.has(slugOf(doc)) && !base.some((c) => c.sharesHpWith === host.id) && (COMPANION_TEXT.test(featText(doc)) || HAND_ON_COMPANION.has(slugOf(doc))) ? companionStageAt(level) : null;
    if (companionNeeded) base = withCompanion(base, host.id, companionNeeded);
    const withFeat = clone(base);
    const pc = withFeat.find((c) => c.id === host.id);
    // (2026-11-03: "Spend a Mythic Point" — the PC's three Mythic Points a fight, as a monster's (B72, the user's choice), shared by what
    // spends them; an entry with a pool of its own keeps it too.)
    const mythic = /\bSpend (?:a|1) Mythic Point\b/i.test(String(doc.system?.description?.value ?? ""));
    // (2026-11-03, Cole: "change the rating to be based on the ability being used often. It is not helpful to evaluate an ability with an AI
    // that does not use it": the feat's own actions marked featForced, and the PC forceUse — the planner takes one in every turn it can,
    // ahead of anything else, as the deviants' "all out". FEAT_FORCE=0 rates them as the AI would pick them.)
    const forced = FORCE ? (entry) => ({ ...entry, featForced: true }) : (entry) => entry;
    if (entries.spells.some((entry) => entry.featTrigger)) pc.featTriggers = true;
    pc.spells = [...(pc.spells ?? []), ...entries.spells.map((entry) => forced(mythic && !entry.pool ? { ...entry, pool: "mythic" } : entry))];
    // (2026-11-03, Cole's pick "share the 3 points": its Strike activities, multi-Strikes and self-effects spend them too — Decree of War,
    // Telling Blow, Godspeed, Divine Invulnerability.)
    const pooledBuiltins = mythic ? Object.fromEntries(Object.entries(builtins).map(([field, value]) => [field, ["strikeActivities", "multiStrikes", "selfEffects"].includes(field) && Array.isArray(value) ? value.map((entry) => (entry.pool || (field === "selfEffects" && !entry.actions && !entry.stance && entry.model?.rounds === Infinity) ? entry : { ...entry, pool: "mythic" })) : value])) : builtins;
    const mythicBuiltins = pooledBuiltins !== builtins && ["strikeActivities", "multiStrikes", "selfEffects"].some((field) => (pooledBuiltins[field] ?? []).some((entry) => entry.pool === "mythic"));
    pc.spellPools = { ...(pc.spellPools ?? {}), ...entries.pools, ...(mythic && (entries.spells.some((entry) => !entry.pool) || mythicBuiltins) ? { mythic: 3 } : {}) };
    if (FORCE) {
        for (const field of FORCED_FIELDS) if (Array.isArray(pooledBuiltins[field])) pooledBuiltins[field] = pooledBuiltins[field].map(forced);
        // (2026-11-05: the feat's +AC reaction used even by a PC with Reactive Strike — actions.js otherwise keeps the reaction for that,
        // and Timely Dodge, Dodge Away and the like on a fighter rated 0.00, never used.)
        if (pooledBuiltins.acReaction && typeof pooledBuiltins.acReaction === "object") pooledBuiltins.acReaction = { ...pooledBuiltins.acReaction, featForced: true };
        pc.forceUse = true;
    }
    joinBuiltins(pc, pooledBuiltins);
    if (tried.strikes) pc.strikes = tried.strikes;
    // (2026-11-05, Diamond Fists: its unarmed attacks forceful and deadly d10 — a die step bigger for one that had either; the deadly dice
    // by its striking runes, 2 at greater striking, 3 at major.)
    if (pc.diamondFists) {
        const deadlyDice = pc.diamondFists >= 19 ? 3 : 2;
        delete pc.diamondFists;
        pc.strikes = (pc.strikes ?? []).map((strike) => {
            if (!strike.unarmed) return strike;
            const had = strike.forceful || strike.deadly;
            const damage = had ? strike.damage.map((part, index) => (index === 0 ? { ...part, die: Math.min(12, (part.die ?? 6) + 2) } : part)) : strike.damage;
            return { ...strike, damage, forceful: true, deadly: strike.deadly ?? { dice: deadlyDice, die: 10 } };
        });
    }
    // (2026-11-05, a Lay on Hands rider — Amplifying Touch and kin —: its Lay on Hands used whenever it can go, as the rider's feat is rated
    // by use; cast 0.2 times a fight before.)
    if (pc.touchRiders?.length) pc.spells = (pc.spells ?? []).map((entry) => (entry.plan?.source?.slug === "lay-on-hands" ? { ...entry, featForced: true } : entry));
    // (Burning and Resounding Cascade: its Arcane Cascade entered whenever it can be — the rider's use; 0.1 a fight before.)
    if (pc.burningCascade || pc.resoundingCascade) pc.selfEffects = (pc.selfEffects ?? []).map((entry) => (entry.name === "Arcane Cascade" ? { ...entry, featForced: true } : entry));
    if (pc.unholyDead) {
        const extra = pc.unholyDead;
        delete pc.unholyDead;
        pc.strikes = (pc.strikes ?? []).map((strike) => (strike.thrall ? { ...strike, damage: [...strike.damage, { dice: 0, die: 0, bonus: extra, type: "spirit" }] } : strike));
    }
    // (2026-11-05, Unstable Concoction: its bombs' initial damage dice a step bigger.)
    if (pc.unstableConcoction) {
        delete pc.unstableConcoction;
        pc.strikes = (pc.strikes ?? []).map((strike) => (strike.splashKind === "bomb" ? { ...strike, damage: strike.damage.map((part, index) => (index === 0 && !part.persistent ? { ...part, die: Math.min(12, (part.die ?? 6) + 2) } : part)) } : strike));
    }
    // (Stunning Blows: the rider on the PC's Flurry of Blows.)
    if (entries.flurryRider) pc.multiStrikes = (pc.multiStrikes ?? []).map((entry) => (entry.name === "Flurry of Blows" ? { ...entry, bothHit: { conditions: [], damage: [], ...entries.flurryRider } } : entry));
    // (2026-11-05: its uses counted by the names its actions show in the log too — Explosion's Explode, a dedication's Rage — not its own
    // name alone, which counted 0.)
    // (2026-11-05: its animal companion, beside it; a stage upgrade's plain party has the stage before.)
    let fought = withFeat;
    let plainParty = loadout || classPC || companionNeeded ? base : null;
    if (pc.animalCompanion) {
        const { stage, base: before = null } = pc.animalCompanion;
        delete pc.animalCompanion;
        fought = withCompanion(withFeat, host.id, stage);
        if (before) plainParty = withCompanion(base, host.id, before);
    }
    // (What the feat gives the companion — companionFields: Heightened Instincts' saves, Tenacious Endurance —; companionActions: Companion's
    // Cry's 2-action Command, the master's turn one action, the companion's three; tandem: Side by Side's flanking.)
    const companion = fought.find((c) => c.companionOf === host.id || c.sharesHpWith === host.id) ?? null;
    const master = fought.find((c) => c.id === host.id);
    for (const field of ["companionFields", "companionActions", "tandem"]) {
        const value = master?.[field];
        if (value === undefined) continue;
        delete master[field];
        if (!companion) continue;
        if (field === "companionFields") {
            const { plus = {}, ...rest } = value;
            // (Its own activities used as often as they can be, as the PC's are — forced.)
            if (FORCE) for (const list of [...FORCED_FIELDS, "spells"]) if (Array.isArray(rest[list])) {
                rest[list] = rest[list].map((entry) => ({ ...entry, featForced: true }));
                companion.forceUse = true;
            }
            joinBuiltins(companion, rest);
            for (const [key, add] of Object.entries(plus)) companion[key] = (Number(companion[key]) || 0) + add;
        }
        else if (field === "companionActions") {
            master.actionsPerTurn = value.master;
            companion.actionsPerTurn = value.companion;
        } else {
            master.tandemWith = companion.id;
            companion.tandemWith = master.id;
        }
    }
    // (2026-11-05, Cole's pick "Mounted combat": a mount feat's companion ridden — the plain party's too when it has one —, and a feat for a
    // rider on a mounted PC both sides. companions.js mountUp.)
    if (MOUNT_SLUGS.has(slugOf(doc)) || RIDING_TEXT.test(featText(doc))) {
        for (const side of [fought, plainParty]) {
            const rider = side?.find((c) => c.id === host.id);
            const mount = side?.find((c) => c.companionOf === host.id);
            if (rider && mount && !rider.mountId) mountUp(rider, mount);
        }
    }
    const useNames = [...new Set([...(fought !== withFeat || companionNeeded ? ["Animal Companion"] : []), ...(companion?.sharesHpWith ? ["Eidolon"] : []), ...entries.spells, ...FORCED_FIELDS.flatMap((field) => (Array.isArray(builtins[field]) ? builtins[field] : []))].map((entry) => (typeof entry === "string" ? entry : entry?.name)).filter((name) => typeof name === "string" && name.length > 2))];
    return { party: fought, ...(plainParty ? { plain: plainParty } : {}), ...(loadout ? { loadout } : {}), host: host.id, played: entries.played, situational: Boolean(entries.situational), plan, useNames };
}

const FORCE = process.env.FEAT_FORCE !== "0";
// (2026-11-05: a benchmark of its own — FEAT_FOE_TRAIT=saves, the rating foes with save abilities, spell-power.js —, in its own run folder.)
const FOE_TRAIT = process.env.FEAT_FOE_TRAIT || null;
// (2026-11-05: reactionStrikes too — actions.js puts a forced one ahead of Reactive Strike on a move or manipulate trigger.)
const FORCED_FIELDS = ["strikeActivities", "multiStrikes", "selfEffects", "selfBuffs", "charges", "skillSweeps", "reactionStrikes"];

// Loadouts for a feat's requirement the party's own weapons don't meet: the PC's main weapon changed for others of the same runes.
// (A ranged main weapon — a ranger's bow — made a melee one: no range, reload or ammunition.)
const oneHanded = (strike, name, die, extra = {}) => ({ ...strike, name, hands: 1, versatile: undefined, melee: true, held: true, increment: undefined, range: undefined, reload: undefined, volley: undefined, ammo: undefined, damage: strike.damage.map((part, index) => (index === 0 ? { ...part, die } : part)), ...extra });
const LOADOUTS = {
    "two weapons (longsword and shortsword)": { hosts: ["fighter", "rogue"], wields: { twoHanded: false, oneHanded: true, twoWeapons: true, freeHand: false, finesse: true, damage: ["slashing", "piercing"], ranged: false, firearm: false, twoHandedRanged: false, reload0: false }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), oneHanded(strikes[0], "Shortsword", 6, { agile: true, finesse: true, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 6, type: "piercing" } : part)) }), ...strikes.slice(1)] },
    "a one-handed weapon and a free hand": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: true, ranged: false, firearm: false, twoHandedRanged: false, reload0: false }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), ...strikes.slice(1)] },
    // (Shield Warfare's shield bash: a longsword and a steel shield, raised when the PC has an action to spare.)
    "a weapon and a shield": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: false, shield: true, ranged: false, firearm: false, twoHandedRanged: false, reload0: false }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), oneHanded(strikes[0], "Shield Bash", 4, { versatile: undefined, iwr: { group: "shield" }, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 4, type: "bludgeoning" } : part)) }), ...strikes.slice(1)], extra: (pc) => { pc.shield = { ac: 2, hardness: 5 + Math.floor(pc.level / 2), hp: 20 + pc.level * 4, bt: 10 + pc.level * 2 }; } },
    // (2026-11-03: Resounding Blow's "a melee weapon that deals bludgeoning damage", Spear Dancer's and Writhing Runelord Weapon's "a
    // weapon from the spear or polearm group" — a warhammer, a spear, each with a free hand.)
    "a warhammer and a free hand": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: true, damage: ["bludgeoning"], groups: ["hammer"], ranged: false, firearm: false, twoHandedRanged: false, reload0: false }, strikes: (strikes) => [oneHanded(strikes[0], "Warhammer", 8, { iwr: { group: "hammer" }, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 8, type: "bludgeoning" } : part)) }), ...strikes.slice(1)] },
    "a spear and a free hand": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: true, damage: ["piercing"], groups: ["spear"], ranged: false, firearm: false, twoHandedRanged: false, reload0: false }, strikes: (strikes) => [oneHanded(strikes[0], "Spear", 6, { iwr: { group: "spear" }, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 6, type: "piercing" } : part)) }), ...strikes.slice(1)] },
    // (2026-11-03: an archetype's "You're wielding a loaded firearm" — Reach for the Sky, Black Powder Blaze —: an arquebus, 1d8 piercing,
    // reload 1, range 150 feet, its greatsword kept for melee.)
    "a loaded arquebus": { hosts: ["fighter"], wields: { ranged: true, firearm: true, reload0: false, twoHanded: false, twoHandedRanged: true, freeHand: false, damage: ["piercing", "slashing"] }, strikes: (strikes) => [{ ...strikes[0], name: "Arquebus", melee: false, hands: 2, held: true, firearm: true, reload: 1, increment: 150, versatile: undefined, agile: false, iwr: { group: "firearm" }, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 8, type: "piercing" } : part)) }, ...strikes] },
    "a bow in hand": { hosts: ["fighter", "rogue"], wields: { ranged: true, reload0: true, twoHanded: false, freeHand: false }, strikes: (strikes) => [...strikes.filter((strike) => !strike.melee), ...strikes.filter((strike) => strike.melee)] }
};

// --- The fights -----------------------------------------------------------------

export const partyLevelOf = (level) => Math.max(1, Math.min(20, Number(level) || 1));

// The scale at a level for an encounter: the plain party's scores on seeds [0, FIGHTS), and against foes a level up and a level down.
export function scaleTask({ level, encounter: kind }) {
    const party = partyFor(level);
    const base = dangerSummary(dangerFights(party, powerFoes(kind, level, FOE_TRAIT), 0, FIGHTS, { grid: GRID }));
    const up = dangerSummary(dangerFights(party, powerFoes(kind, level + 1, FOE_TRAIT), 0, FIGHTS, { grid: GRID }));
    const down = dangerSummary(dangerFights(party, powerFoes(kind, level - 1, FOE_TRAIT), 0, FIGHTS, { grid: GRID }));
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
export const loadScaleOnce = (path) => {
    if (!scale) loadScale(path);
};
// The plain party's fights at a level against an encounter: { scores, step, … }, or null.
export const scaleAt = (level, kind) => scale?.get(`${level}|${kind}`) ?? null;

// --- Fewer fights (2026-11-03, Cole: "reduce the amount of simulator runs as much as possible"; his pick: all of it) -----------------
// 1. A feat's fights run in batches of BATCH seeds an encounter (0, 1, 2 … as before, so every feat still meets the same dice) and stop
//    once the answer is clear (stopReason). FEAT_EARLY=0: every feat gets all FIGHTS, as before.
// 2. Its uses are counted in the fights that score it (a sink for the log lines that name it), not in a dozen more logged fights.
// 3. A rated row keeps its fights' scores seed by seed and its party's fingerprint, so the probe phase can replay a few seeds after a code
//    change and send only the feats whose fights changed to a rerun (probeTask); the canary phase replays a sample on more seeds and
//    shows how far each moved (canaryTask).
export const BATCH = Number(process.env.FEAT_BATCH) || 25;
export const EARLY = process.env.FEAT_EARLY !== "0";
// (Per encounter, in levels: the two encounters' average then has about 0.02, the median of the 200-fight ratings that weren't 0.)
export const SE_TARGET = Number(process.env.FEAT_SE) || 0.03;
// ("About zero": the report's own band, ±0.05 levels.)
export const ZERO_BAND = 0.05;
export const PROBE = Number(process.env.FEAT_PROBE) || 8;

const meanSe = (values) => {
    const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    const sd = Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, values.length - 1));
    return { mean, se: sd / Math.sqrt(Math.max(1, values.length)) };
};

// Why an encounter's fights can stop now (null: not yet). No effect: not one fight changed and the PC never used it (after one batch), or
// not one fight changed (after two). From four batches on, about zero: the rating's 95% range sits inside ±0.05 levels. Precise: its standard error is at the
// target. A strong feat's fights vary too much for either, so the top of the table still gets every fight.
export function stopReason(diffs, step, uses) {
    const n = diffs.length;
    if (n >= FIGHTS) return "all fights";
    if (!EARLY || n < BATCH) return null;
    const unchanged = diffs.every((value) => value === 0);
    if (unchanged && uses === 0) return "no effect";
    if (n < 2 * BATCH) return null;
    if (unchanged) return "no effect";
    // (2026-11-04: the other two only from 100 fights. Tried on 54 feats against all 200 fights: from 50, a standard error read off so
    // few fights ran small, and three feats ended more than one standard error from their 200-fight rating; from 100, none did.)
    if (n < 4 * BATCH) return null;
    const { mean, se } = meanSe(diffs);
    const levels = -mean / step;
    const levelsSe = se / step;
    if (Math.abs(levels) + 2 * levelsSe < ZERO_BAND) return "about zero";
    if (levelsSe <= SE_TARGET) return "precise";
    return null;
}

// A sink for a fight's log that counts the lines naming the feat. (Not \b: a name that ends in "!" or "?" — Do You Know Who I Am?,
// To Me! — has no word boundary after it.)
function useCounter(name, others = []) {
    const names = [name, ...others.filter((other) => other !== name)];
    const pattern = new RegExp(`(?<![\\w'])(?:${names.map((each) => each.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\w'])`);
    return { count: 0, push(line) { if (pattern.test(typeof line === "string" ? line : line?.text ?? "")) this.count++; } };
}

// How often the PC uses it in a fight, from a few logged fights (the basic actions' and the combos' way).
function usesPerFight(party, foes, name) {
    const sink = useCounter(name);
    for (let seed = 0; seed < LOGGED; seed++) simulate({ combatants: [...party, ...foes] }, { ...DANGER_OPTIONS, ...(GRID ? { grid: GRID } : {}) }, seed, { log: sink });
    return sink.count / LOGGED;
}

// A party's fight scores on seeds [0, count), grown as asked (a class's plain party's kept by its key: every feat of that class at that
// level fights it).
const plainCache = new Map();
function plainScores(party, foes, cacheKey, count) {
    const kept = (cacheKey && plainCache.get(cacheKey)) || [];
    if (kept.length < count) kept.push(...dangerFights(party, foes, kept.length, count, { grid: GRID }).scores);
    if (cacheKey) plainCache.set(cacheKey, kept);
    return kept.slice(0, count);
}

// A party's fingerprint: its combatants as data (functions and cycles left out), hashed.
export function partyHash(party) {
    const seen = new WeakSet();
    const text = JSON.stringify(party, (key, value) => {
        if (typeof value === "function") return undefined;
        if (value instanceof Map) return [...value.entries()];
        if (value instanceof Set) return [...value];
        if (value && typeof value === "object") {
            if (seen.has(value)) return "[seen]";
            seen.add(value);
        }
        return value;
    });
    return createHash("sha1").update(text ?? "").digest("hex").slice(0, 12);
}

// One encounter of a feat: its fights in batches until stopReason, against the plain party's on the same seeds.
function rateEncounter(built, foes, plain, cacheKey, name, { maxFights = FIGHTS, early = true } = {}) {
    const sink = useCounter(name, built.useNames ?? []);
    const scores = [];
    let plainList = [];
    let stop = null;
    while (!stop) {
        const to = Math.min(maxFights, scores.length + BATCH);
        scores.push(...dangerFights(built.party, foes, scores.length, to, { grid: GRID, log: sink }).scores);
        plainList = built.plain ? plainScores(built.plain, foes, cacheKey, scores.length) : plain.scores.slice(0, scores.length);
        const diffs = scores.map((score, index) => score - plainList[index]);
        stop = scores.length >= maxFights ? "all fights" : early ? stopReason(diffs, plain.step, sink.count) : null;
    }
    const diffs = scores.map((score, index) => score - plainList[index]);
    const { mean, se } = meanSe(diffs);
    return {
        score: scores.reduce((sum, value) => sum + value, 0) / scores.length,
        delta: mean, se, levels: -mean / plain.step, levelsSe: se / plain.step, uses: sink.count / scores.length,
        fights: scores.length, stop, scores, ...(built.plain ? { plainScores: plainList } : {})
    };
}

const builtFor = (task) => {
    const doc = docsOf(task.ref.path).get(task.ref.id);
    if (!doc) return { doc: null };
    const level = partyLevelOf(task.ref.level);
    return { doc, level, built: partyWithFeat(doc, level) };
};
// (Kept by the plain party's own fingerprint: before 2026-11-03 it was the host's, so two stance feats of one host at one level shared the
// first one's plain party, stance and all; a loadout's wasn't kept at all.)
const plainKey = (built, level, kind) => (built.plain ? `${partyHash(built.plain)}|${level}|${kind}` : null);

// One feat: its rows for the boss and the group, paired with the scale's plain fights.
export function featTask(task) {
    const { doc, level, built } = builtFor(task);
    if (!doc) return { ...task, skipped: true, reason: "not found" };
    const head = { kind: "feat", ref: task.ref, name: doc.name, level, host: built.host, ...(built.loadout ? { loadout: built.loadout } : {}) };
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    const results = {};
    for (const kind of KINDS) {
        const scaled = scale?.get(`${level}|${kind}`);
        if (!scaled) return { ...head, error: `no scale for level ${level} ${kind}: run the scale phase first` };
        results[kind] = rateEncounter(built, powerFoes(kind, level, FOE_TRAIT), scaled, plainKey(built, level, kind), doc.name);
    }
    const levels = KINDS.reduce((sum, kind) => sum + results[kind].levels, 0) / KINDS.length;
    const se = Math.sqrt(KINDS.reduce((sum, kind) => sum + results[kind].levelsSe ** 2, 0)) / KINDS.length;
    return { ...head, played: built.played, situational: built.situational, results, levels, se, fingerprint: partyHash(built.party), ...(built.plain ? { plainFingerprint: partyHash(built.plain) } : {}) };
}

// The probe: a stored row's first seeds replayed with today's code. changed: its fights (or the plain party's, when it has its own) aren't
// the same any more, it's skipped now or no longer, or its reason changed; party: its fingerprint changed (the fights may still be the same).
export function probeTask({ row, seeds = PROBE }) {
    const head = { ref: row.ref, name: row.name };
    const { doc, level, built } = builtFor(row);
    if (!doc) return { ...head, changed: true, why: "not found now" };
    if (row.error) return { ...head, changed: true, why: "an error last time" };
    if (row.skipped || built.skipped) {
        if (row.skipped && built.skipped && row.reason === built.reason) return { ...head, changed: false };
        return { ...head, changed: true, why: row.skipped ? (built.skipped ? `another reason: ${built.reason}` : "played now") : `not played now: ${built.reason}` };
    }
    const party = row.fingerprint ? partyHash(built.party) !== row.fingerprint : null;
    for (const kind of KINDS) {
        const stored = row.results?.[kind];
        if (!stored?.scores) return { ...head, changed: true, why: "no fights kept (rated before the probe existed)" };
        const n = Math.min(seeds, stored.scores.length);
        const foes = powerFoes(kind, level, FOE_TRAIT);
        const now = dangerFights(built.party, foes, 0, n, { grid: GRID }).scores;
        if (now.some((value, index) => value !== stored.scores[index])) return { ...head, changed: true, party, why: `${kind} fights differ` };
        if (Boolean(built.plain) !== Boolean(stored.plainScores)) return { ...head, changed: true, party, why: "its plain party changed" };
        if (built.plain) {
            const plainNow = plainScores(built.plain, foes, plainKey(built, level, kind), n);
            if (plainNow.some((value, index) => value !== stored.plainScores[index])) return { ...head, changed: true, party, why: `${kind} plain fights differ` };
        }
    }
    return { ...head, changed: false, party };
}

// The scale's probe: the plain party's first seeds at a level and encounter, against scale.jsonl's.
export function scaleProbeTask({ level, encounter: kind, seeds = PROBE }) {
    const stored = scale?.get(`${level}|${kind}`);
    if (!stored) return { kind: "scale-probe", level, encounter: kind, changed: true };
    const now = dangerFights(partyFor(level), powerFoes(kind, level, FOE_TRAIT), 0, Math.min(seeds, stored.scores.length), { grid: GRID }).scores;
    return { kind: "scale-probe", level, encounter: kind, changed: now.some((value, index) => value !== stored.scores[index]) };
}

// The canary: a stored row replayed with today's code on its first seeds (up to CANARY fights an encounter, no early stop), its rating
// then and now on those same seeds.
export const CANARY = Number(process.env.FEAT_CANARY) || 50;
export function canaryTask({ row }) {
    const head = { ref: row.ref, name: row.name, host: row.host, level: row.level, stored: row.levels };
    const { doc, level, built } = builtFor(row);
    if (!doc) return { ...head, now: null, why: "not found now" };
    if (built.skipped) return { ...head, now: null, why: `not played now: ${built.reason}` };
    const was = [];
    const now = [];
    for (const kind of KINDS) {
        const scaled = scale?.get(`${level}|${kind}`);
        const stored = row.results?.[kind];
        const n = Math.min(CANARY, stored?.scores?.length ?? CANARY);
        const fresh = rateEncounter(built, powerFoes(kind, level, FOE_TRAIT), scaled, plainKey(built, level, kind), doc.name, { maxFights: n, early: false });
        now.push(fresh.levels);
        if (stored?.scores) {
            const plain = stored.plainScores ?? scaled.scores;
            was.push(-meanSe(stored.scores.slice(0, n).map((score, index) => score - plain[index])).mean / scaled.step);
        }
    }
    const average = (list) => list.reduce((sum, value) => sum + value, 0) / list.length;
    return { ...head, then: was.length === KINDS.length ? average(was) : row.levels, sameSeeds: was.length === KINDS.length, now: average(now) };
}

// A party's rating against the plain party at a level, the feat ratings' way: { levels, se, boss, group, uses: { name: per fight } }
// (tools/lib/combo-power.mjs, two feats together).
export function partyRating(party, level, names = []) {
    const results = {};
    const uses = {};
    for (const kind of KINDS) {
        const scaled = scale?.get(`${level}|${kind}`);
        if (!scaled) throw new Error(`no scale for level ${level} ${kind}`);
        const foes = powerFoes(kind, level, FOE_TRAIT);
        const fights = dangerSummary(dangerFights(party, foes, 0, FIGHTS, { grid: GRID }));
        const diffs = fights.scores.map((score, index) => score - scaled.scores[index]);
        const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
        results[kind] = { levels: -mean / scaled.step, levelsSe: sd / Math.sqrt(diffs.length) / scaled.step };
        for (const name of names) uses[name] = (uses[name] ?? 0) + usesPerFight(party, foes, name) / KINDS.length;
    }
    const levels = KINDS.reduce((sum, kind) => sum + results[kind].levels, 0) / KINDS.length;
    const se = Math.sqrt(KINDS.reduce((sum, kind) => sum + results[kind].levelsSe ** 2, 0)) / KINDS.length;
    return { levels, se, boss: results.boss.levels, group: results.group.levels, uses };
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
            const fights = dangerSummary(dangerFights(party, powerFoes(kind, level, FOE_TRAIT), 0, FIGHTS, { grid: GRID }));
            const diffs = plain.scores.map((score, index) => score - fights.scores[index]);
            const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
            const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
            rows[`${level}|${kind}`] = { delta: mean, levels: -mean / plain.step, levelsSe: sd / Math.sqrt(diffs.length) / plain.step, uses: usesPerFight(partyFor(level), powerFoes(kind, level, FOE_TRAIT), task.name) };
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
        // (2026-11-01, the user: "have the simulator use them as much as possible": all out — in every turn it can, deviant.js's risk or not;
        // its awakenings measured all out too, against the plain feat all out.)
        out.push({ name: doc.name, slug, level, variant: "all out", awakenings: [], force: true });
        out.push({ name: doc.name, slug, level, variant: "all out, no backlash", awakenings: [], noBacklash: true, force: true });
        for (const key of entry.awakenings) out.push({ name: doc.name, slug, level: awakenAt, variant: `awakening: ${key}`, awakenings: [key], against: true, force: true });
    }
    return out;
}

export function deviantParty(task, awakenings, { noBacklash = false, hand = false, force = false } = {}) {
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
    if (force) pc.forceUse = true;
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
    const force = !!task.force;
    let against = task.against ? deviantParty(task, [], { force }) : null;
    const built = deviantParty(task, task.awakenings, { noBacklash: task.noBacklash, hand: !!against?.loadout, force });
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    if (against && !against.skipped && built.loadout && !against.loadout) against = deviantParty(task, [], { hand: true, force });
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

// A class's PC in its seat of the standard party (src/engine/classes.js), against the standard party on the same seeds, in levels of the foes
// (2026-11-02: "Get the simulator working with all classes").
export function classTask({ slug, level }) {
    const party = classPartyFor(slug, level);
    const rating = partyRating(party, level);
    return { kind: "class", slug, level, seat: seatOf(slug), levels: rating.levels, se: rating.se, boss: rating.boss, group: rating.group };
}

// Two classes' PCs, each in its seat, against the standard party (2026-11-02, Cole: "Does it appear any combination of classes perform
// better than when alone?"): with each one's own row (classes.jsonl, the same seeds) the pair's synergy is both − one − the other.
export function classPairTask({ slugs, level }) {
    const rating = partyRating(classesPartyFor(slugs, level), level);
    return { kind: "pair", slugs, level, levels: rating.levels, se: rating.se, boss: rating.boss, group: rating.group };
}

export async function runFeatTask(task) {
    if (task.kind === "scale") return scaleTask(task);
    if (task.scalePath && !scale) loadScale(task.scalePath);
    if (task.kind === "basic") return basicTask(task);
    if (task.kind === "deviant") return deviantTask(task);
    if (task.kind === "class") return classTask(task);
    if (task.kind === "pair") return classPairTask(task);
    if (task.kind === "probe") return probeTask(task);
    if (task.kind === "scale-probe") return scaleProbeTask(task);
    if (task.kind === "canary") return canaryTask(task);
    return featTask(task);
}
