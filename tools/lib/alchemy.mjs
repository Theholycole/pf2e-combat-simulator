// The alchemist's formula book as every alchemical consumable (2026-11-04, Cole: "Assume the alchemist has every alchemical consumables in
// their formula book and add a recommendation item for players to use against a monster. Take into account any saves or ac the item may
// target and any weaknesses the item may trigger. Build this into the simulator module as an optional feature").
//
// catalog(level): each alchemical consumable family at its best type an alchemist of that level can make (Lesser, Moderate, Greater…), read
// from PF2e's equipment pack: bombs (an attack roll against AC, their damage, splash and persistent damage, and their riders as the item
// module's compileBomb reads them) and items with a save (poisons and the like, the item module's compileItem: the save, its DC and what a
// failure does). advise(creature, level): each one's expected result against the creature — its odds against the AC or save it targets,
// its damage after the creature's immunities, weaknesses and resistances (the simulator's own adjustInstance) — best first.
import { classAttributes } from "../../src/engine/classes.js";
import { degreeDistribution } from "../../src/engine/checks.js";
import { adjustInstance } from "../../src/engine/damage.js";
import { T, E, M } from "../../src/engine/party.js";

const { readDocuments, PACK_ROOT } = await import("./pack-creatures.mjs");
const I = decodeURIComponent(new URL("../../../PF2e AUTOMATIC ITEM RESOLUTION", import.meta.url).pathname);
const I2 = decodeURIComponent(new URL("../../../pf2e-automatic-item-resolution", import.meta.url).pathname);
const load = async (path) => (await import(`${I}/${path}`).catch(() => import(`${I2}/${path}`)).catch(() => null));
const itemCompiler = await load("src/compiler/index.js");
const bombCompiler = await load("src/compiler/bombs.js");

const GRADE = /\s*\((?:Minor|Lesser|Moderate|Greater|Major|True)\)$/;
export const familyOf = (name) => String(name).replace(GRADE, "");
const traitsOf = (doc) => doc.system?.traits?.value ?? [];

let docsCache = null;
function alchemicalDocs() {
    docsCache ??= readDocuments(`${PACK_ROOT}/equipment`).filter((doc) => doc.collection === "items" && traitsOf(doc).includes("alchemical") && traitsOf(doc).includes("consumable"));
    return docsCache;
}

// The alchemist's numbers at a level, as the simulator's alchemist (src/engine/classes.js): its bomb attack before the bomb's item bonus
// (Dexterity, alchemical bombs trained, expert at 7th, master at 15th), a weapon Strike's (its dagger, for an injury poison), and its class DC
// (Intelligence; trained, expert at 9th, master at 17th). Powerful Alchemy (5th): an item it makes with Quick Alchemy uses its class DC.
export function alchemistNumbers(level) {
    const lv = Math.max(1, Math.min(20, level));
    const a = classAttributes("alchemist", lv);
    const bombProf = lv >= 15 ? M : lv >= 7 ? E : T;
    const classProf = lv >= 17 ? M : lv >= 9 ? E : T;
    return { level: lv, bomb: lv + bombProf + a.dex, weapon: lv + bombProf + a.dex, classDC: 10 + lv + classProf + a.int, powerfulAlchemy: lv >= 5 };
}

// "2d6+3", "(1d4)[poison]" → its average.
export function averageOf(formula) {
    const text = String(formula ?? "").replace(/\[[^\]]*\]/g, "").replace(/[()\s]/g, "");
    let total = 0;
    for (const term of text.match(/[+-]?[^+-]+/g) ?? []) {
        const dice = /^([+-]?)(\d*)d(\d+)$/.exec(term);
        if (dice) total += (dice[1] === "-" ? -1 : 1) * (Number(dice[2]) || 1) * (Number(dice[3]) + 1) / 2;
        else if (Number.isFinite(Number(term))) total += Number(term);
    }
    return total;
}
const typeOf = (formula) => /\[([a-z,-]+)\]/.exec(String(formula ?? ""))?.[1]?.split(",").find((type) => !["persistent", "splash", "precision"].includes(type)) ?? "untyped";

// What a row of the item module's outcomes does, in words: its conditions and modifiers.
function rowWords(row) {
    const words = [];
    for (const effect of row?.effects ?? []) {
        const slug = effect.slug ?? effect.condition ?? effect.name ?? effect.kind;
        if (slug && !["damage", "heal"].includes(slug)) words.push(effect.value != null ? `${slug} ${effect.value}` : String(slug));
    }
    for (const modifier of row?.modifiers ?? []) words.push(`${modifier.selector} ${modifier.value > 0 ? "+" : ""}${modifier.value}${modifier.type ? ` ${modifier.type}` : ""}`);
    if (row?.affliction) words.push(`${row.affliction.name} stage ${row.affliction.stage}`);
    return words.join(", ");
}

// Every family at the best type a level-N alchemist can make: [{ kind: "bomb" | "save", family, name, level, rarity, … }].
export function catalog(level, { rarities = ["common", "uncommon", "rare", "unique"] } = {}) {
    const best = new Map();
    for (const doc of alchemicalDocs()) {
        const itemLevel = Number(doc.system?.level?.value) || 0;
        if (itemLevel > level || !rarities.includes(doc.system?.traits?.rarity ?? "common")) continue;
        const family = familyOf(doc.name);
        const kept = best.get(family);
        if (!kept || itemLevel > (Number(kept.system?.level?.value) || 0)) best.set(family, doc);
    }
    const items = [];
    for (const doc of best.values()) {
        const entry = describeItem(doc);
        if (entry) items.push(entry);
    }
    return items.sort((a, b) => a.family.localeCompare(b.family));
}

function describeItem(doc) {
    const base = { family: familyOf(doc.name), name: doc.name, level: Number(doc.system?.level?.value) || 0, rarity: doc.system?.traits?.rarity ?? "common", traits: traitsOf(doc) };
    if (doc.type === "weapon" && base.traits.includes("bomb")) {
        const damage = doc.system?.damage ?? {};
        const dice = Number(damage.dice) || 0;
        const die = Number(String(damage.die ?? "").replace("d", "")) || 0;
        const flat = dice && !die ? dice : 0;
        const persistent = damage.persistent ? { average: (Number(damage.persistent.number) || 0) * ((Number(damage.persistent.faces) || 0) + 1) / 2 || Number(damage.persistent.number) || 0, type: damage.persistent.type ?? damage.damageType } : null;
        let plan = null;
        try {
            plan = bombCompiler?.compileBomb?.(doc) ?? null;
        } catch {
            plan = null;
        }
        const outcomes = plan?.resolution?.outcomes ?? {};
        return {
            // (Quick Alchemy, then the Strike.)
            ...base, kind: "bomb", targets: "AC", actions: 2, itemBonus: Number(doc.system?.bonus?.value) || 0,
            damage: { average: die ? dice * (die + 1) / 2 : flat, type: damage.damageType ?? "untyped" }, splash: Number(doc.system?.splashDamage?.value) || 0, persistent,
            hit: rowWords(outcomes.success), crit: rowWords(outcomes.criticalSuccess)
        };
    }
    if (doc.type !== "consumable" || !itemCompiler) return null;
    let plan = null;
    try {
        plan = itemCompiler.compileItem(doc, {});
    } catch {
        plan = null;
    }
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save" || resolution.check?.roll !== "save") return null;
    // (Drunk or eaten: not something to use on a monster in a fight.)
    if (["drinker"].includes(plan.item?.recipient) || plan.item?.delivery === "ingested") return null;
    const delivery = plan.item?.delivery ?? null;
    const statistic = resolution.check.statistic;
    const dc = resolution.check.against?.dc === "fixed" ? Number(resolution.check.against.value) || null : null;
    const handoff = resolution.afflictionHandoff ?? null;
    const stageDamage = (stage) => (handoff?.stages?.[stage - 1]?.damage ?? []).map((formula) => ({ average: averageOf(formula), type: typeOf(formula) }));
    const shared = (resolution.sharedDamage?.components ?? []).map((component) => ({ average: averageOf(component.formula), type: (component.kinds ?? []).find((kind) => !["persistent", "splash"].includes(kind)) ?? typeOf(component.formula) }));
    const multiplier = (row) => (row?.damage?.mode && row.damage.mode !== "none" ? (Number.isFinite(Number(row.damage.multiplier)) ? Number(row.damage.multiplier) : 1) : 0);
    const rows = resolution.outcomes ?? {};
    const damageOn = (degree) => {
        const row = rows[degree];
        if (row?.affliction) return stageDamage(row.affliction.stage).map((part) => ({ ...part, rounds: Number(handoff?.stages?.[row.affliction.stage - 1]?.duration?.value) || 1 }));
        return shared.map((part) => ({ ...part, average: part.average * multiplier(row), rounds: 1 }));
    };
    // Made with Quick Alchemy (1 action), then its own Activate. An injury poison goes on a weapon (its Activate) and needs a Strike that hits; an inhaled one, its cloud; a contact one, a touch.
    const activation = Number(plan.item?.activations?.[0]?.time ?? plan.activation?.time) || 1;
    return {
        ...base, kind: "save", targets: statistic, delivery, dc, actions: 1 + activation + (delivery === "injury" ? 1 : 0), basic: Boolean(resolution.check.basic),
        outcomes: Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: damageOn(degree), words: rowWords(rows[degree]) }])),
        later: handoff?.stages?.length > 1 ? handoff.stages.slice(1).map((stage) => stage.text).join("; ") : null
    };
}

// The simulator's damage on a creature: immunities, weaknesses, resistances (adjustInstance), and whether a weakness or resistance changed it.
function landed(creature, type, amount, extra = {}) {
    if (amount <= 0) return { amount: 0, note: null };
    const after = adjustInstance(creature, type, amount, false, null);
    const note = after === 0 ? (type === "vitality" ? "vitality harms only undead" : type === "void" ? "void doesn't harm undead" : `immune to ${type}`) : after > amount ? `weak to ${type}` : after < amount ? `resists ${type}` : null;
    return { amount: after, note, ...extra };
}
const saveOf = (creature, statistic) => creature.saves?.[statistic] ?? creature.saves?.[{ fort: "fortitude", ref: "reflex" }[statistic] ?? statistic] ?? 0;
const PERSISTENT_ROUNDS = 2;

// An item's expected result against a creature, for a level-N alchemist (odds as degreeDistribution: [critical failure, failure, success,
// critical success] of the alchemist's roll, or of the creature's save).
export function expected(item, creature, numbers) {
    const notes = new Set();
    const add = (result) => {
        if (result.note) notes.add(result.note);
        return result.amount;
    };
    if (item.kind === "bomb") {
        const odds = degreeDistribution(numbers.bomb + item.itemBonus, creature.ac);
        const [critMiss, miss, hit, crit] = odds;
        // Splash on a hit or a miss (not a critical miss), combined with the bomb's damage for weaknesses and resistances.
        const onHit = add(landed(creature, item.damage.type, item.damage.average + item.splash));
        const onCrit = add(landed(creature, item.damage.type, item.damage.average * 2 + item.splash));
        const onMiss = add(landed(creature, item.damage.type, item.splash));
        const persistent = item.persistent ? add(landed(creature, item.persistent.type, item.persistent.average)) * PERSISTENT_ROUNDS : 0;
        const value = hit * (onHit + persistent) + crit * (onCrit + persistent * 2) + miss * onMiss;
        const effects = [item.hit && `on a hit: ${item.hit}`, item.crit && item.crit !== item.hit && `on a critical hit: ${item.crit}`].filter(Boolean).join("; ");
        return { item, targets: `AC ${creature.ac}`, chance: hit + crit, value, perAction: value / item.actions, notes: [...notes], effects, critMiss };
    }
    const immune = (creature.immunities ?? []).some((immunity) => item.traits.includes(immunity));
    const dc = Math.max(item.dc ?? 0, numbers.powerfulAlchemy || item.dc == null ? numbers.classDC : 0);
    const save = saveOf(creature, item.targets);
    // (The creature's save: its failure is the alchemist's success.)
    const [critFail, fail, success, critSuccess] = degreeDistribution(save, dc);
    const deliver = item.delivery === "injury" ? (() => {
        const [, , hit, crit] = degreeDistribution(numbers.weapon, creature.ac);
        return hit + crit;
    })() : 1;
    const worth = (degree) => (item.outcomes[degree]?.damage ?? []).reduce((sum, part) => sum + add(landed(creature, part.type, part.average)) * (part.rounds ?? 1), 0);
    const value = immune ? 0 : deliver * (critFail * worth("criticalFailure") + fail * worth("failure") + success * worth("success") + critSuccess * worth("criticalSuccess"));
    if (immune) notes.add(`immune (${item.traits.filter((trait) => (creature.immunities ?? []).includes(trait)).join(", ")})`);
    const effects = [item.outcomes.failure?.words && `on a failed save: ${item.outcomes.failure.words}`, item.outcomes.criticalFailure?.words && item.outcomes.criticalFailure.words !== item.outcomes.failure?.words && `critical failure: ${item.outcomes.criticalFailure.words}`].filter(Boolean).join("; ");
    return { item, targets: `${item.targets} +${save} vs DC ${dc}${item.delivery === "injury" ? `, after a Strike hits AC ${creature.ac}` : ""}`, chance: immune ? 0 : deliver * (critFail + fail), value, perAction: value / item.actions, notes: [...notes], effects };
}

// Every item's expected result against the creature, best first: damage per action, then the chance its effect lands.
export function advise(creature, level, options = {}) {
    const numbers = alchemistNumbers(level);
    const results = catalog(level, options).map((item) => expected(item, creature, numbers));
    return {
        numbers,
        damage: results.filter((result) => result.value > 0).sort((a, b) => b.perAction - a.perAction || b.chance - a.chance),
        control: results.filter((result) => result.value <= 0 && result.effects && result.chance > 0).sort((a, b) => b.chance - a.chance),
        useless: results.filter((result) => result.value <= 0 && result.notes.some((note) => /^immune|harms only|doesn't harm/.test(note)))
    };
}

// The simulated alchemist's kit (src/engine/classes.js alchemist, options.alchemy): its bombs as Strikes' numbers, the riders the item module
// reads on them (bombRider: frost vial's Speed penalty, bottled lightning's off-guard), and what Quick Alchemy makes beside them (elixir of
// life for healing; with full, every item with a save it can throw or release at a foe). full (2026-11-04, Cole's optional feature, the
// simulator's SIM_ALCHEMY=full): every bomb family — the best of each damage type —, not only alchemist's fire, frost vial and bottled
// lightning.
const { bombRider, itemEntry } = await import("../../src/adapter/items.js");
const STANDARD_BOMBS = ["Alchemist's Fire", "Frost Vial", "Bottled Lightning"];
const kits = new Map();
export function alchemistKit(level, { full = false } = {}) {
    const key = `${level}|${full}`;
    if (kits.has(key)) return kits.get(key);
    const items = catalog(level);
    const docs = new Map(alchemicalDocs().map((doc) => [doc.name, doc]));
    const strength = (item) => item.damage.average + item.splash + (item.persistent?.average ?? 0) * PERSISTENT_ROUNDS;
    let bombs = items.filter((item) => item.kind === "bomb" && item.damage.average > 0 && (full || STANDARD_BOMBS.includes(item.family)));
    if (full) {
        const byType = new Map();
        for (const item of bombs) if (!byType.has(item.damage.type) || strength(item) > strength(byType.get(item.damage.type))) byType.set(item.damage.type, item);
        bombs = [...byType.values()];
    }
    const spells = [];
    const strikes = bombs.map((item) => {
        const doc = docs.get(item.name);
        const damage = doc.system?.damage ?? {};
        const die = Number(String(damage.die ?? "").replace("d", "")) || 0;
        let plan = null;
        try {
            plan = bombCompiler?.compileBomb?.(doc) ?? null;
        } catch {
            plan = null;
        }
        const rider = plan ? bombRider(plan, item.family) : null;
        if (rider) spells.push(rider);
        const persistent = damage.persistent ? { dice: Number(damage.persistent.faces) ? Number(damage.persistent.number) || 0 : 0, die: Number(damage.persistent.faces) || 0, bonus: Number(damage.persistent.faces) ? 0 : Number(damage.persistent.number) || 0, type: damage.persistent.type ?? item.damage.type } : null;
        return { name: item.family, item: item.name, itemBonus: item.itemBonus, damage: { dice: die ? Number(damage.dice) || 0 : 0, die, bonus: die ? 0 : Number(damage.dice) || 0, type: item.damage.type }, splash: item.splash, persistent, traits: item.traits };
    });
    // Elixir of life: Quick Alchemy, then fed to a creature beside it (or drunk), 2 actions and a vial.
    const quick = (doc, name) => {
        let plan = null;
        try {
            plan = itemCompiler?.compileItem?.(doc, {}) ?? null;
        } catch {
            plan = null;
        }
        const entry = plan ? itemEntry(plan, { id: `alchemist-${familyOf(doc.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name }) : null;
        if (!entry) return null;
        // (One activated in actions only: not a free action, a reaction or minutes.)
        const own = Number(entry.plan.activation?.time ?? 1);
        if (!Number.isInteger(own) || own < 1 || own > 2) return null;
        const time = String(own + 1);
        return { ...entry, plan: { ...entry.plan, activation: { ...(entry.plan.activation ?? {}), time } }, pool: "reagents", casts: undefined, consumable: false, from: "Quick Alchemy" };
    };
    const elixir = alchemicalDocs().filter((doc) => familyOf(doc.name) === "Elixir of Life" && (Number(doc.system?.level?.value) || 0) <= level).sort((a, b) => b.system.level.value - a.system.level.value)[0];
    const elixirEntry = elixir ? quick(elixir, `${elixir.name} (Quick Alchemy)`) : null;
    if (elixirEntry) spells.push(elixirEntry);
    if (full) for (const item of items.filter((entry) => entry.kind === "save" && !["injury", "contact"].includes(entry.delivery))) {
        const entry = quick(docs.get(item.name), `${item.name} (Quick Alchemy)`);
        if (entry) spells.push(entry);
    }
    const kit = { bombs: strikes, spells };
    kits.set(key, kit);
    return kit;
}
