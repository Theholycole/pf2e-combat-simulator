// How deadly a creature is for its level (2026-10-13; the user's call: "test each monster in the simulator to find out which 10 monsters are
// the most deadly for their level … fight a party of 4 player characters equal to the level of monster or closest they can be"): one
// creature against the standard party (src/engine/party.js) of its level, clamped to 1–20, fighting to the death (no morale, no retreat).
//   A fight's deadliness: the share of the party's Hit Points it took, +0.25 for each PC it downed, +1 for each it killed (a death is four
//   times a PC who drops and can be healed: the user's call, 2026-10-14; it was +0.5), +1 for a wipe.
//   "For its level": above the median creature of the same level (deadliest.mjs); a moderate creature of each level (GM Core's tables)
//   fights too, for reference.
//   What makes it strong: the same fights with one of its abilities, Strikes or its spellcasting left out, or one number brought down to
//   moderate for its level; what changes is that part's share.
import fs from "node:fs";
const { basicActions, combatant, readDocuments, summonReserves, PACK_ROOT } = await import("./pack-creatures.mjs");
const { compileSpell, effectModels, npcSpells, spellNamed } = await import("./pack-spells.mjs");
const { npcItems } = await import("./pack-items.mjs");
const { standardParty } = await import("../../src/engine/party.js");
const { canCast, isUtility } = await import("../../src/engine/spells.js");
const { moderate, moderateCreatureAt } = await import("./creature-tables.mjs");
// (The counting, the profile and the ranking: src/engine/danger-scale.js, shared with the in-Foundry run.)
const { DANGER_OPTIONS, DEATH_WEIGHT: SHARED_DEATH_WEIGHT, canFight, dangerFights, dangerProfile, dangerSummary, realSpells, strikeAverage } = await import("../../src/engine/danger-scale.js");

const MODULES = `${process.env.HOME}/.local/share/FoundryVTT/Data/modules`;
export const OPTIONS = DANGER_OPTIONS;

// Every NPC: PF2e's packs, and the Battlezoo bestiaries' Actor packs.
export function creatureRefs() {
    const sources = fs.readdirSync(PACK_ROOT).map((pack) => ({ source: "pf2e", pack, path: `${PACK_ROOT}/${pack}` }));
    for (const mod of fs.readdirSync(MODULES).filter((name) => name.startsWith("battlezoo"))) {
        const manifest = JSON.parse(fs.readFileSync(`${MODULES}/${mod}/module.json`, "utf8"));
        for (const pack of manifest.packs ?? []) if (pack.type === "Actor" && !/^sf/.test(pack.name) && pack.system !== "sf2e") sources.push({ source: "battlezoo", pack: `${mod}/${pack.name}`, path: `${MODULES}/${mod}/${pack.path}` });
    }
    const refs = [];
    for (const { source, pack, path } of sources) {
        let docs;
        try {
            docs = readDocuments(path);
        } catch {
            continue;
        }
        for (const doc of docs.filter((entry) => entry.collection === "actors" && entry.type === "npc")) refs.push({ ref: `${source}:${pack}:${doc._id}`, source, pack, path, id: doc._id, name: doc.name, level: Number(doc.system?.details?.level?.value ?? 0) });
    }
    return refs;
}

const packCache = new Map();
export function npcOf(ref) {
    if (!packCache.has(ref.path)) {
        if (packCache.size > 6) packCache.delete(packCache.keys().next().value);
        packCache.set(ref.path, new Map(readDocuments(ref.path).filter((doc) => doc.collection === "actors").map((doc) => [doc._id, doc])));
    }
    return packCache.get(ref.path).get(ref.id) ?? null;
}

// The party's spells: PF2e's by name, compiled once; only those the simulation casts.
const plans = new Map();
function spell(name, castRank) {
    if (!plans.has(name)) {
        const doc = spellNamed(name);
        let plan = null;
        try {
            plan = doc ? compileSpell(doc) : null;
        } catch {
            plan = null;
        }
        plans.set(name, plan && canCast({ spellPools: {} }, { name, plan, castRank: 1, pool: null }) && !isUtility(plan) ? plan : null);
    }
    const plan = plans.get(name);
    return plan ? { name, plan, effects: effectModels(plan, castRank) } : null;
}
const parties = new Map();
export function partyFor(level) {
    const lv = Math.max(1, Math.min(20, level));
    if (!parties.has(lv)) parties.set(lv, standardParty(lv, { spell, basics: Object.values(basicActions) }));
    return parties.get(lv);
}

const average = (part) => ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (part.multiplier ?? 1);

// One number brought down to moderate for its level (only when it's above).
const KNOCKDOWNS = {
    ac: (c, level) => (c.ac > moderate("ac", level) ? ((c.ac = moderate("ac", level)), true) : false),
    hp: (c, level) => (c.hp.max > moderate("hp", level) ? ((c.hp = { value: moderate("hp", level), max: moderate("hp", level) }), true) : false),
    attack: (c, level) => {
        const best = Math.max(-Infinity, ...(c.strikes ?? []).map((strike) => strike.bonus));
        const shift = best - moderate("attack", level);
        if (!(shift > 0)) return false;
        c.strikes = c.strikes.map((strike) => ({ ...strike, bonus: strike.bonus - shift }));
        return true;
    },
    damage: (c, level) => {
        const best = Math.max(0, ...(c.strikes ?? []).map(strikeAverage));
        const target = moderate("damage", level);
        if (!(best > target)) return false;
        const keep = target / best;
        c.strikes = c.strikes.map((strike) => ({ ...strike, critDamage: null, damage: strike.damage.map((part) => (part.splash || part.persistent ? part : { ...part, bonus: (part.bonus ?? 0) - Math.round(average(part) * (1 - keep)) })) }));
        return true;
    },
    saves: (c, level) => {
        const mid = moderate("save", level);
        if (!Object.values(c.saves ?? {}).some((value) => value > mid)) return false;
        c.saves = Object.fromEntries(Object.entries(c.saves).map(([key, value]) => [key, Math.min(value, mid)]));
        return true;
    },
    spellDC: (c, level) => {
        const mid = moderate("spellDC", level);
        if (!realSpells(c).some((entry) => entry.dc > mid)) return false;
        c.spells = c.spells.map((entry) => (entry.kind ? entry : { ...entry, dc: Math.min(entry.dc, mid), attack: Math.min(entry.attack, mid - 8) }));
        return true;
    }
};

// The creature as the simulation's combatant with its own spells, its summons' creatures; a variant leaves an item out (an ability, a
// Strike, a spellcasting entry with its spells) or brings a number down.
export function buildMonster(npc, variant = null) {
    let doc = npc;
    if (variant?.type === "item") doc = { ...npc, items: npc.items.filter((item) => item._id !== variant.id) };
    if (variant?.type === "spells") doc = { ...npc, items: npc.items.filter((item) => item.type !== "spellcastingEntry" && item.type !== "spell") };
    const monster = combatant(doc);
    const own = npcSpells(doc, { basics: basicActions });
    // (U1: its potions, elixirs and the like, used freely.)
    const items = npcItems(doc);
    monster.spells = [...monster.spells, ...own.spells, ...items.spells];
    monster.spellPools = { ...(monster.spellPools ?? {}), ...own.spellPools, ...items.spellPools };
    if (items.activities.length) monster.strikeActivities = [...(monster.strikeActivities ?? []), ...items.activities];
    if (items.fortunes.length) monster.fortuneItems = [...(monster.fortuneItems ?? []), ...items.fortunes];
    if (items.reduceTriggers.length) monster.reduceTriggers = [...(monster.reduceTriggers ?? []), ...items.reduceTriggers];
    if (items.triggered?.length) monster.triggeredItems = [...(monster.triggeredItems ?? []), ...items.triggered];
    if (own.summons?.length) monster.summons = [...(monster.summons ?? []), ...own.summons];
    if (variant?.type === "knockdown" && !KNOCKDOWNS[variant.id](monster, monster.level)) return null;
    let reserves = [];
    try {
        reserves = summonReserves(monster);
    } catch {
        reserves = [];
    }
    return { monster, reserves };
}

// The fights: [seed from, seed to), against the standard party of its level (src/engine/danger-scale.js counts them).
export const DEATH_WEIGHT = SHARED_DEATH_WEIGHT;
export function fight(level, foes, from, to) {
    return dangerFights(partyFor(level), foes, from, to);
}

export const summary = dangerSummary;

// Where its numbers sit for its level.
export const profile = dangerProfile;

// What to leave out, one at a time: each ability it plays, each Strike, its spellcasting, each number above moderate.
export function variantsOf(npc, monster) {
    const variants = [];
    const used = monster.usedAbilities ?? new Set();
    const spellNames = new Set((monster.spells ?? []).filter((entry) => entry.kind === "ability").map((entry) => entry.rechargeGroup ?? entry.name));
    for (const item of npc.items ?? []) {
        if (item.type === "melee") variants.push({ type: "item", id: item._id, label: `Strike: ${item.name}`, group: "strike" });
        else if (item.type === "action" && (used.has(item.name) || spellNames.has(item.name))) variants.push({ type: "item", id: item._id, label: item.name, group: "ability", actionType: item.system?.actionType?.value ?? null });
    }
    if (realSpells(monster).length) variants.push({ type: "spells", id: "spells", label: "Spellcasting", group: "spells" });
    for (const id of Object.keys(KNOCKDOWNS)) variants.push({ type: "knockdown", id, label: `${id} to moderate`, group: "stat" });
    return variants;
}

// One task for a worker.
export function runTask(task) {
    if (task.kind === "baseline") {
        const foe = moderateCreatureAt(task.level, "monster");
        return { ...task, ...summary(fight(task.level, [foe], task.from, task.to)) };
    }
    // The ladder: a moderate creature of some level against the party of another, for "fights like a creature N levels higher".
    if (task.kind === "ladder") {
        const foe = moderateCreatureAt(task.level, "monster");
        const { scores, ...rest } = summary(fight(task.party, [foe], task.from, task.to));
        return { ...task, ...rest };
    }
    const npc = npcOf(task.ref);
    if (!npc) return { ...task, error: "not found" };
    let built;
    try {
        built = buildMonster(npc, task.variant ?? null);
    } catch (error) {
        return { ...task, error: `build: ${error.message}` };
    }
    if (!built) return { ...task, skipped: true };
    const { monster, reserves } = built;
    if (!canFight(monster)) return { ...task, skipped: true, reason: "nothing to fight with" };
    try {
        const result = summary(fight(monster.level, [monster, ...reserves], task.from, task.to));
        const extra = task.kind === "screen" ? { profile: profile(monster), variants: variantsOf(npc, monster), traits: monster.traits, rarity: npc.system?.traits?.rarity ?? null, publication: npc.system?.details?.publication?.title ?? null } : {};
        return { ...task, level: monster.level, ...result, ...extra };
    } catch (error) {
        return { ...task, error: `fight: ${error.message} ${String(error.stack ?? "").split("\n")[1] ?? ""}` };
    }
}
