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
const { featEntries, featInfo, meetsWielding, pcNeeds, requiredEffectFeat, requiredStances, withResolvedEffects, worthSomething } = await import("../../src/engine/feat-abilities.js");
const { effectModel } = await import("../../src/engine/effects.js");
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
        // (Not a cap: "any spell of 6th rank or lower".)
        const fixed = new RegExp(`${ORDINAL}[- ](?:rank|level)(?! or lower)`, "i").exec(sentence)?.[1];
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
    const choice = /\b(?:chosen|choose(?: one)?) from the following\b|\bone of the following spells\b/i.test(String(doc.system?.description?.value ?? ""));
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
        const entry = { name: `${spell.name} (${doc.name})`, plan, castRank, dc, attack: dc - 10, pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
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
const SPELLSHAPES = {
    "intimidating-spell": { area: true, conditions: { failure: ["frightened", 1], criticalFailure: ["frightened", 2] } },
    "burning-spell": { area: false, nonCantrip: true, extra: (rank) => ({ formula: String(rank), type: "fire", category: "persistent" }) },
    "reverberating-spell": { area: true, nonCantrip: true, extra: () => ({ formula: "1d8", type: "sonic", category: null }) }
};
function spellshapeEntry(doc, host) {
    const shape = SPELLSHAPES[slugOf(doc)];
    if (!shape) return null;
    const spells = [];
    for (const spell of host.spells ?? []) {
        const resolution = spell.plan?.resolution;
        const time = String(spell.plan?.activation?.time ?? "");
        const area = spell.plan?.targeting?.area;
        if (resolution?.kind !== "save" || !resolution.sharedDamage?.components?.length || !["1", "2"].includes(time) || spell.kind) continue;
        if (shape.area ? !area : area || !/^1 /.test(String(spell.plan?.targeting?.target ?? ""))) continue;
        if (shape.nonCantrip && !spell.pool) continue;
        const outcomes = structuredClone(resolution.outcomes ?? {});
        let sharedDamage = resolution.sharedDamage;
        if (shape.extra) {
            const part = shape.extra(spell.castRank ?? 1);
            sharedDamage = { ...sharedDamage, components: [...sharedDamage.components, { id: "spellshape", formula: part.formula, type: part.type, category: part.category, applyModifier: false, kinds: ["damage"], materials: [] }] };
            for (const row of Object.values(outcomes)) if (row?.damage?.mode === "shared" && row.damage.multiplier > 0) row.damage.sourceComponentIds = [...(row.damage.sourceComponentIds ?? []), "spellshape"];
        }
        for (const [degree, [slug, value]] of Object.entries(shape.conditions ?? {})) if (outcomes[degree]) outcomes[degree].effects = [...(outcomes[degree].effects ?? []), { kind: "condition", slug, name: slug, value, duration: null, source: doc.name }];
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
    if (!bonus) return null;
    // (Dodge Away's "You are the target of a melee attack", Cut From the Air's "… a physical ranged Strike", Inked Panoply's "A creature
    // targets you with an attack, and you can see the attacker".)
    const targeted = /^(?:An? (?:enemy|creature|foe|opponent)(?: you can see| you're observing| you are observing)? (?:targets you with|attempts) an? (melee |ranged )?(?:weapon )?(?:Strike|attack)(?: against you)?|You are targeted (?:with|by) an? (melee |ranged )?(?:Strike|attack)(?: by an? (?:observed )?(?:attacker|enemy|creature))?|An? creature targets you with an attack,? and you can see the attacker|You(?:'re| are) the target of an? (?:physical )?(melee |ranged )?(?:Strike|attack)|An? (?:enemy|creature|foe) within your reach targets you with an? (melee )?(?:Strike|attack),? and you(?:'re| are) aware of the attack)$/i.exec(trigger);
    const hit = /^An? (?:enemy|creature|foe) hits you with an? (melee |ranged )?(?:Strike|attack)$/i.exec(trigger);
    const read = targeted ?? hit;
    if (!read) return null;
    const kind = (read[1] ?? read[2] ?? read[3] ?? read[4] ?? "").trim();
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
        if (!plan?.resolution || plan.resolution.kind === "no-effect" || (plan.resolution.kind === "unsupported" && spell.name !== "Lay on Hands")) continue;
        const cantrip = (spell.system?.traits?.value ?? []).includes("cantrip");
        const entry = { name: `${spell.name} (${doc.name})`, plan, castRank, dc, attack: dc - 10, pool: cantrip ? null : pool, effects: spellPack.withTextConditions(spellPack.effectModels(plan, castRank), spell, castRank) };
        if (castable(entry)) entries.push(entry);
    }
    if (!entries.length) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: a spell the engine doesn't cast (${spells.map((each) => (each.spell ?? each).name).join(", ")})` } };
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
    // (Clinch Strike: an unarmed Strike on a creature that escapes its grab — the engine's "escaped" trigger.)
    "clinch-strike": () => ({ builtins: {}, plans: [{ builtin: "reaction-strike", triggers: ["escaped"], strike: null, penalty: 0, disrupts: false, melee: true }], played: "a reaction Strike on a creature that escapes its grab" }),
    // (Consume Power: resistance its level to acid, electricity, fire or sonic damage it would take — the engine's resist-damage on those
    // types; the energy it holds for an impulse isn't played.)
    "consume-power": (level) => ({ builtins: {}, plans: [{ builtin: "resist-damage", value: level, on: ["acid", "electricity", "fire", "sonic"] }], played: "resistance its level to acid, electricity, fire or sonic damage (reaction)" }),
    "brutal-beating": () => ({ builtins: { strikeExtras: [{ when: "critical", condition: { slug: "frightened", value: 1 }, source: "Brutal Beating" }] }, played: "frightened 1 on a critical hit (always on)" }),
    // (+2 AC to an ally in reach as an attack hits it — the engine's ally-ac-reaction, B182.)
    "guardians-deflection-fighter": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 2, within: "reach" }], played: "+2 AC to an ally in reach as it's hit (reaction)" }),
    "guardians-deflection-swashbuckler": () => ({ builtins: {}, plans: [{ builtin: "ally-ac-reaction", value: 2, within: "reach" }], played: "+2 AC to an ally in reach as it's hit (reaction)" }),
    // (A failed Strike at it redirected to another creature in the attacker's reach — the engine's redirect-attack, B191.)
    "sidestep": () => ({ builtins: {}, plans: [{ builtin: "redirect-attack" }], played: "a missed Strike redirected (reaction)" }),
    // (+2 initiative and temporary Hit Points of half its level for allies within 20 feet; played as the initiative.)
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
    "brutal-critical": () => ({ builtins: { strikeExtras: [{ when: "critical", dice: 1, weaponDie: true, noDouble: true, melee: true, type: null, source: "Brutal Critical" }, { when: "critical", dice: 2, weaponDie: true, melee: true, persistent: true, type: "bleed", source: "Brutal Critical" }] }, played: "more on a critical hit (always on)" })
};
function handEntry(doc, level, builtins, wields, host = null) {
    const read = HAND[slugOf(doc)]?.(level, host);
    if (!read) return null;
    // (Its requirement — Reactive Shield's "You are wielding a shield" —: a PC whose loadout can't meet it gets one that can.)
    const requirement = requirementText(doc);
    if (requirement && wields && meetsWielding(requirement, wields) === false) return { spells: [], pools: {}, gap: { kind: "feat, not simulated", name: `${doc.name}: its requirement, which the PC doesn't meet (${requirement})` } };
    for (const plan of read.plans ?? []) addBuiltin(builtins, plan, doc.name);
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
    // (2026-11-03, the class feats no fight played: the reactions that keep their PC up at 0 Hit Points, once a fight — Cheat Death's
    // doomed, Ruby Resurrection's Fireball and Desperate Revival's drain aren't played.)
    "ferocity-mimicry": { ferocity: { hp: 1, wounded: true, uses: 1 } },
    unkillable: { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "cheat-death": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "sanguine-evasion": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "desperate-revival": { ferocity: { hp: 1, wounded: false, uses: 1 } },
    "ruby-resurrection": { ferocity: { hp: 30, wounded: false, uses: 1 } },
    // (10 + its level + its Constitution modifier.)
    "its-not-over": { ferocity: { hp: (level) => 10 + level + 2 + (level >= 5) + (level >= 10) + (level >= 20), wounded: false, uses: 1 } },
    // (In Tenacious Stance: and a melee Strike.)
    "cracked-mountain": { ferocity: { hp: 1, wounded: true, uses: 1, strike: true } },
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
    const grantedDoc = granted ? featByName(granted) ?? docsOf(`${PACK_ROOT}/feats`).get(granted) ?? null : null;
    if (!grantedDoc || grantedDoc === doc) return result;
    const through = partyWithFeat(grantedDoc, level, { ...options, granted: true });
    return through.skipped ? result : { ...through, played: `${grantedDoc.name}: ${through.played}` };
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

function partyWithFeatAlone(doc, level, { hostId = null, party: start = null } = {}) {
    const classTrait = (doc.system?.traits?.value ?? []).find((trait) => HOSTS[trait] || CLASS_SLUGS.includes(trait));
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
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = textSelfEffectEntry(doc, level, builtins, host, wields) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = innateSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = focusSpellEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = rageSaveEntry(doc, level, host) ?? entries;
        if (entries.gap && !/doesn't meet/.test(entries.gap.name)) entries = handEntry(doc, level, builtins, wields, { ...host, strikes: wields.strikes ?? host.strikes }) ?? entries;
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
    const withFeat = clone(base);
    const pc = withFeat.find((c) => c.id === host.id);
    // (2026-11-03: "Spend a Mythic Point" — the PC's three Mythic Points a fight, as a monster's (B72, the user's choice), shared by what
    // spends them; an entry with a pool of its own keeps it too.)
    const mythic = /\bSpend (?:a|1) Mythic Point\b/i.test(String(doc.system?.description?.value ?? ""));
    pc.spells = [...(pc.spells ?? []), ...entries.spells.map((entry) => (mythic && !entry.pool ? { ...entry, pool: "mythic" } : entry))];
    pc.spellPools = { ...(pc.spellPools ?? {}), ...entries.pools, ...(mythic && entries.spells.some((entry) => !entry.pool) ? { mythic: 3 } : {}) };
    joinBuiltins(pc, builtins);
    if (tried.strikes) pc.strikes = tried.strikes;
    // (Stunning Blows: the rider on the PC's Flurry of Blows.)
    if (entries.flurryRider) pc.multiStrikes = (pc.multiStrikes ?? []).map((entry) => (entry.name === "Flurry of Blows" ? { ...entry, bothHit: { conditions: [], damage: [], ...entries.flurryRider } } : entry));
    return { party: withFeat, ...(loadout || classPC ? { plain: base } : {}), ...(loadout ? { loadout } : {}), host: host.id, played: entries.played, situational: Boolean(entries.situational), plan };
}

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
