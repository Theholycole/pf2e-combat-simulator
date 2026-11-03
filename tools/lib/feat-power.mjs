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
const { partyFor, classPartyFor, classesPartyFor } = await import("./deadliness.mjs");
const { CLASS_SLUGS, classArmor, seatOf } = await import("../../src/engine/classes.js");
const { compileFeat } = await import(new URL("src/compiler/index.js", FEAT_ROOT).href);
export const itemReaders = ITEM_ROOT ? await (async () => {
    try {
        const [move, rerolls, spend, fortune] = await Promise.all(["move", "rerolls", "spend", "fortune"].map((name) => import(new URL(`src/compiler/${name}.js`, ITEM_ROOT).href)));
        return { movePlan: move.movePlan, rerollPlan: rerolls.rerollPlan, withSpend: spend.withSpend, rollTwicePlan: fortune.rollTwicePlan };
    } catch {
        return null;
    }
})() : null;
const { featEntries, featInfo, meetsWielding, requiredEffectFeat, requiredStances, withResolvedEffects, worthSomething } = await import("../../src/engine/feat-abilities.js");
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
            return Object.fromEntries(uuids.map((uuid) => [uuid, effectDoc(uuid)]).filter(([, doc]) => doc).map(([uuid, doc]) => [uuid, effectModel(doc, { rank: level, actorLevel: level, conditionSlug })]));
        },
        rulesModel: (effect) => effectModel({ name: effect.name, type: "effect", system: { rules: effect.rules ?? [], duration: effect.duration ?? { value: -1, unit: "unlimited" } } }, { rank: level, actorLevel: level, conditionSlug }),
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
        ranged: !main.melee, reload0: !main.melee && !main.reload, firearm: Boolean(main.firearm), thrown: Boolean(main.thrown), shield: Boolean(c.shield),
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
export function innateSpells(doc, level) {
    const text = String(doc.system?.description?.value ?? "");
    if (!/\binnate\b/i.test(text)) return [];
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
        const fixed = new RegExp(`${ORDINAL}[- ](?:rank|level)`, "i").exec(sentence)?.[1];
        const heightened = /half your level|heightened to a spell rank equal to half/i.test(sentence) || cantrip;
        const own = Number(spell.system?.level?.value) || 1;
        const castRank = Number(fixed) || (heightened ? half : own);
        if (castRank > half && !fixed) continue;
        const uses = cantrip || /at will/i.test(sentence) ? 0 : /twice per day/i.test(sentence) ? 2 : 1;
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
    for (const { spell, castRank, uses } of spells) {
        let plan;
        try {
            plan = spellPack.compileSpell(spell);
        } catch {
            continue;
        }
        if (!plan?.resolution || ["unsupported", "no-effect"].includes(plan.resolution.kind)) continue;
        const pool = uses ? `innate:${doc._id}:${spell._id}` : null;
        if (pool) pools[pool] = uses;
        entries.push({ name: `${spell.name} (${doc.name})`, plan, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) });
    }
    if (!entries.length) return null;
    return { spells: entries, pools, gap: null, played: `innate spell${entries.length > 1 ? "s" : ""}: ${spells.map(({ spell, castRank }) => `${spell.name} (rank ${castRank})`).join(", ")}` };
}

// (2026-11-03, the class feats no fight played: Farabellus Flip, Sense the Strike — a reaction's bonus to AC against the attack that sets it
// off.) The engine's acReaction: "targets you with a (melee|ranged) Strike/attack" → as it's targeted, "hits you" → after the hit (it may turn
// it); its "+N circumstance bonus to AC against the triggering attack". Nothing else in the reaction is played.
function acReactionEntry(doc, builtins) {
    if ((doc.system?.actionType?.value ?? "passive") !== "reaction" || requirementText(doc)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const trigger = /<strong>\s*Trigger\s*<\/strong>\s*([^<]*)/i.exec(html)?.[1]?.trim().replace(/\.$/, "") ?? "";
    const bonus = /\+(\d) circumstance bonus to (?:your )?AC against (?:the )?(?:triggering|that) (?:attack|Strike)/i.exec(html);
    if (!bonus) return null;
    const targeted = /^(?:An? (?:enemy|creature|foe|opponent)(?: you can see| you're observing| you are observing)? (?:targets you with|attempts) an? (melee |ranged )?(?:weapon )?(?:Strike|attack)(?: against you)?|You are targeted (?:with|by) an? (melee |ranged )?(?:Strike|attack)(?: by an? (?:observed )?(?:attacker|enemy|creature))?|An? creature targets you with an attack and you can see the attacker)$/i.exec(trigger);
    const hit = /^An? (?:enemy|creature|foe) hits you with an? (melee |ranged )?(?:Strike|attack)$/i.exec(trigger);
    const read = targeted ?? hit;
    if (!read) return null;
    const kind = (read[1] ?? read[2] ?? "").trim();
    builtins.acReaction = { value: Number(bonus[1]), when: targeted ? "targeted" : "hit", name: doc.name, ...(kind ? { against: kind } : {}) };
    return { spells: [], pools: {}, gap: null, played: `+${bonus[1]} AC as a reaction ${targeted ? "when targeted" : "against a hit"}${kind ? ` (${kind})` : ""}` };
}

// (2026-11-03, the class feats no fight played: Dragon's Rage Breath, Megavolt, Stomp Ground — a save in an area written with PF2e's inline
// rolls, which the feat module reads nothing for.) The feat as a spell the spell compiler reads: its @Template's area, its @Check's save, its
// first @Damage's dice at the PC's level (a type PF2e fills in from the actor — a dragon instinct's — is fire), at the PC's class DC, from a
// pool of its frequency. Only an action without a requirement.
const LEVEL_MATH = { floor: Math.floor, ceil: Math.ceil, max: Math.max, min: Math.min, ternary: (test, a, b) => (test ? a : b), gte: (a, b) => a >= b, gt: (a, b) => a > b, lte: (a, b) => a <= b, lt: (a, b) => a < b };
function inlineFormula(raw, level) {
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
    if ((doc.system?.actionType?.value ?? "passive") !== "action" || requirementText(doc)) return null;
    const html = String(doc.system?.description?.value ?? "");
    const template = /@Template\[(?:type:)?(\w+)\|distance:(\d+)/.exec(html);
    const check = /@Check\[(?:type:)?(reflex|fortitude|will)\b([^\]]*)\]/.exec(html);
    // (One creature instead — Fling Head's "an enemy within 30 feet", Witchwood Seed's touch.)
    const reach = template ? null : /\b(?:an? (?:creature|enemy|foe|target)|a creature you target|Select a creature|Choose a creature) within (\d+) feet\b/i.exec(html) ? { range: `${/within (\d+) feet/i.exec(html)[1]} feet` } : /\bYou touch a creature\b/i.test(html) ? { range: "touch" } : null;
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
    const uses = Number(doc.system?.frequency?.max) || 0;
    const pool = uses ? `feat:${doc._id}` : null;
    const entry = { name: doc.name, plan, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
    return { spells: [entry], pools: pool ? { [pool]: uses } : {}, gap: null, played: `inline save: ${template ? `${template[2]}-foot ${template[1]}` : `1 creature, ${reach.range}`}, ${check[1]}${damage ? `, ${damage.formula} ${damage.type}` : ""} (DC ${dc}${uses ? `, ${uses}/fight` : ""})` };
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
        if (!plan?.resolution || ["unsupported", "no-effect"].includes(plan.resolution.kind)) continue;
        const cantrip = (spell.system?.traits?.value ?? []).includes("cantrip");
        entries.push({ name: `${spell.name} (${doc.name})`, plan, castRank, dc, attack: dc - 10, pool: cantrip ? null : pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) });
    }
    if (!entries.length) return null;
    const pools = entries.some((entry) => entry.pool) ? { [pool]: Math.min(3, (host.spellPools?.[pool] ?? 0) + 1) } : {};
    return { spells: entries, pools, gap: null, played: `focus spell${entries.length > 1 ? "s" : ""}: ${entries.map((entry) => `${entry.name.replace(/ \(.*$/, "")} (rank ${castRank})`).join(", ")}` };
}

// (2026-11-03, the class feats no fight played: passives that change a class feature, read by hand where neither the feat module nor PF2e's
// rules have anything — the builtins they put on the PC.)
const HAND = {
    // A precision die on a hit at a creature that isn't off-guard, two from 14th when its sneak attack is 3d6 or more.
    "sly-striker": (level) => ({ builtins: { strikeExtras: [{ when: "not-off-guard", dice: level >= 14 ? 2 : 1, die: 6, precision: true, type: null, source: "Sly Striker" }] }, played: "precision damage on a hit (always on)" }),
    // A melee critical hit's extra weapon die (not doubled) and persistent bleed of two of its dice.
    // (A frightened creature off-guard to the PC — actions.js.)
    "dread-striker": () => ({ builtins: { dreadStriker: true }, played: "frightened foes are off-guard to it (always on)" }),
    // (Reactive Strike, as a fighter's.)
    "reactive-striker": () => ({ builtins: { reactions: { aoo: true } }, played: "Reactive Strike" }),
    // (The rogue's Sneak Attack at 1d4, 1d6 from 6th.)
    "sneak-attacker": (level) => ({ builtins: { strikeExtras: [{ when: "off-guard", dice: 1, die: level >= 6 ? 6 : 4, precision: true, type: null, source: "Sneak Attacker" }] }, played: "Sneak Attack (always on)" }),
    // (3 Hit Points for each of the archetype's class feats: its dedication and this one.)
    ...Object.fromEntries(["barbarian", "champion", "fighter", "guardian", "monk", "ranger", "rogue", "swashbuckler", "investigator", "gunslinger", "inventor", "thaumaturge", "exemplar", "commander", "kineticist", "magus", "summoner", "alchemist"].map((cls) => [`${cls}-resiliency`, () => ({ builtins: { maxHpBonus: 6 }, played: "6 more Hit Points" })])),
    // (A melee Strike at a creature in reach an ally critically hits — the engine's ally-hit trigger, critical hits only.)
    "opportune-opening": () => ({ builtins: { reactionStrikes: [{ name: "Opportune Opening", triggers: ["ally-hit"], critOnly: true, strike: null, penalty: 0, disrupts: false, melee: true }] }, played: "reaction Strike on an ally's critical hit" }),
    "brutal-critical": () => ({ builtins: { strikeExtras: [{ when: "critical", dice: 1, weaponDie: true, noDouble: true, melee: true, type: null, source: "Brutal Critical" }, { when: "critical", dice: 2, weaponDie: true, melee: true, persistent: true, type: "bleed", source: "Brutal Critical" }] }, played: "more on a critical hit (always on)" })
};
function handEntry(doc, level, builtins) {
    const read = HAND[slugOf(doc)]?.(level);
    if (!read) return null;
    for (const [field, value] of Object.entries(read.builtins)) builtins[field] = Array.isArray(value) ? [...(builtins[field] ?? []), ...value] : value && typeof value === "object" ? { ...(builtins[field] ?? {}), ...value } : value;
    return { spells: [], pools: {}, gap: null, played: read.played };
}

// (2026-11-02, the same ask: staying up at 0 Hit Points, which the engine plays for monsters — Ferocity's kin and an ally's rescue,
// actions.js knockOut —, and the feats that raise maximum Hit Points by the PC's level.)
const ZERO_HP = {
    "orc-ferocity": { ferocity: { hp: 1, wounded: true, uses: 1 } },
    // (Its Strike as it uses Orc Ferocity — which it needs, so with it.)
    "rampaging-ferocity": { ferocity: { hp: 1, wounded: true, uses: 1, strike: true, free: true } },
    "the-cycle-continues": { ferocity: { hp: (level) => `6d8+${Math.floor(level / 2)}`, wounded: false, uses: 1, free: true } },
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
    return { ...plan, trigger: { ...(plan.trigger ?? {}), event: "use" } };
}

// The party with the feat on its PC, or { skipped, reason }.
// options: { hostId, party } — the PC to give it to (else its class's, or the fighter, or the PC best at its skill) and the party to start from
// (else the standard one: an ancestry's PC with its feats so far, tools/lib/ancestry-power.mjs).
// (2026-11-03, Cole: "begin working on implementing them" — the class feats no fight played. A feat that needs a stance, Tiger Slash's "You
// are in Tiger Stance": the stance is the PC's on both sides, the feat's party against the same party with the stance alone.)
export function partyWithFeat(doc, level, options = {}) {
    // (Or the feat whose Effect it needs: Dueling Riposte's "You are benefiting from Dueling Parry".)
    const needed = requiredEffectFeat(requirementText(doc) ?? "");
    const stances = requiredStances(requirementText(doc) ?? "") ?? (needed && featByName(needed) ? [needed] : null);
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
    if (!featsByName.size) for (const doc of docsOf(`${PACK_ROOT}/feats`).values()) featsByName.set(doc.name.toLowerCase(), doc);
    return featsByName.get(String(name).toLowerCase()) ?? null;
}

function partyWithFeatAlone(doc, level, { hostId = null, party: start = null } = {}) {
    const classTrait = (doc.system?.traits?.value ?? []).find((trait) => HOSTS[trait] || CLASS_SLUGS.includes(trait));
    // (2026-11-02, the user: "Get the simulator working with all classes": a class's feat on its own class — classes.js — the standard party
    // with that class's PC in its seat, rated against the same party without the feat.)
    const classPC = !start && !hostId && classTrait && CLASS_SLUGS.includes(classTrait) && !["fighter", "rogue", "wizard", "cleric"].includes(classTrait) && process.env.FEAT_OWN_CLASS !== "0";
    const party = start ?? (classPC ? classPartyFor(classTrait, level) : partyFor(level));
    if (classPC) hostId = classTrait;
    const compileFor = (host) => {
        try {
            return { plan: compileFeat(doc, { dcs: dcsOf(host), basicActions, itemReaders }) };
        } catch (error) {
            return { error: error.message };
        }
    };
    let host = party.find((c) => c.id === (hostId ?? (classTrait ? HOSTS[classTrait] : "fighter")));
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
    const plan = withResolvedEffects(impulse ?? compiled.plan, resolveUuid);
    // Its entries with what the PC wields: the party's own, or (a requirement it doesn't meet — Double Slice's two weapons) a loadout that does,
    // the plain party then fought with the same loadout.
    const attempt = (wields) => {
        const builtins = {};
        let entries = featEntries(plan, featInfo(doc, level), builtins, { ...helpersAt(level), meets: (text) => meetsWielding(text, wields) });
        // (An impulse's save at its class DC.)
        if (impulse && !entries.gap) {
            const dc = dcsOf(host).class ?? 10 + level + 2;
            entries = { ...entries, spells: entries.spells.map((entry) => ({ ...entry, dc, attack: dc - 10, castRank: Math.max(1, Math.ceil(level / 2)) })) };
        }
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
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = acReactionEntry(doc, builtins) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = innateSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = focusSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = handEntry(doc, level, builtins) ?? entries;
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
    let tried = attempt({ ...wieldsOf(host), strikes: host.strikes });
    let base = party;
    let loadout = null;
    if (tried.entries.gap && /doesn't meet/.test(tried.entries.gap.name)) {
        for (const [name, way] of Object.entries(LOADOUTS)) {
            // (2026-11-03: a class PC in a seat the loadout fits — a ranger's bow traded for two blades for Twin Takedown.)
            if (!way.hosts.includes(host.id) && !(classPC && way.hosts.includes(seatOf(host.id)) && (host.strikes?.[0]?.held || !host.strikes?.[0]?.melee))) continue;
            const again = attempt({ ...wieldsOf(host), ...way.wields, strikes: way.strikes(host.strikes) });
            if (again.entries.gap) continue;
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
    const withFeat = clone(base);
    const pc = withFeat.find((c) => c.id === host.id);
    pc.spells = [...(pc.spells ?? []), ...entries.spells];
    pc.spellPools = { ...(pc.spellPools ?? {}), ...entries.pools };
    joinBuiltins(pc, builtins);
    if (tried.strikes) pc.strikes = tried.strikes;
    return { party: withFeat, ...(loadout || classPC ? { plain: base } : {}), ...(loadout ? { loadout } : {}), host: host.id, played: entries.played, situational: Boolean(entries.situational), plan };
}

// Loadouts for a feat's requirement the party's own weapons don't meet: the PC's main weapon changed for others of the same runes.
// (A ranged main weapon — a ranger's bow — made a melee one: no range, reload or ammunition.)
const oneHanded = (strike, name, die, extra = {}) => ({ ...strike, name, hands: 1, versatile: undefined, melee: true, held: true, increment: undefined, range: undefined, reload: undefined, volley: undefined, ammo: undefined, damage: strike.damage.map((part, index) => (index === 0 ? { ...part, die } : part)), ...extra });
const LOADOUTS = {
    "two weapons (longsword and shortsword)": { hosts: ["fighter", "rogue"], wields: { twoHanded: false, oneHanded: true, twoWeapons: true, freeHand: false, damage: ["slashing", "piercing"] }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), oneHanded(strikes[0], "Shortsword", 6, { agile: true, finesse: true, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 6, type: "piercing" } : part)) }), ...strikes.slice(1)] },
    "a one-handed weapon and a free hand": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: true }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), ...strikes.slice(1)] },
    // (Shield Warfare's shield bash: a longsword and a steel shield, raised when the PC has an action to spare.)
    "a weapon and a shield": { hosts: ["fighter"], wields: { twoHanded: false, oneHanded: true, freeHand: false, shield: true }, strikes: (strikes) => [oneHanded(strikes[0], "Longsword", 8, { versatile: ["piercing"] }), oneHanded(strikes[0], "Shield Bash", 4, { versatile: undefined, iwr: { group: "shield" }, damage: strikes[0].damage.map((part, index) => (index === 0 ? { ...part, die: 4, type: "bludgeoning" } : part)) }), ...strikes.slice(1)], extra: (pc) => { pc.shield = { ac: 2, hardness: 5 + Math.floor(pc.level / 2), hp: 20 + pc.level * 4, bt: 10 + pc.level * 2 }; } },
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
export const loadScaleOnce = (path) => {
    if (!scale) loadScale(path);
};
// The plain party's fights at a level against an encounter: { scores, step, … }, or null.
export const scaleAt = (level, kind) => scale?.get(`${level}|${kind}`) ?? null;

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

// A party's fight scores (a class's plain party's kept by its key: every feat of that class at that level fights it).
const plainCache = new Map();
function plainScores(party, foes, cacheKey) {
    if (cacheKey && plainCache.has(cacheKey)) return plainCache.get(cacheKey);
    const scores = dangerSummary(dangerFights(party, foes, 0, FIGHTS, { grid: GRID })).scores;
    if (cacheKey) plainCache.set(cacheKey, scores);
    return scores;
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
        const plain = built.plain ? { ...scaled, scores: plainScores(built.plain, foes, built.loadout ? null : `${built.host}|${level}|${kind}`) } : scaled;
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

// A party's rating against the plain party at a level, the feat ratings' way: { levels, se, boss, group, uses: { name: per fight } }
// (tools/lib/combo-power.mjs, two feats together).
export function partyRating(party, level, names = []) {
    const results = {};
    const uses = {};
    for (const kind of KINDS) {
        const scaled = scale?.get(`${level}|${kind}`);
        if (!scaled) throw new Error(`no scale for level ${level} ${kind}`);
        const foes = powerFoes(kind, level);
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
    return featTask(task);
}
