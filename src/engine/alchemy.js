// Alchemical items against a monster (2026-11-04, Cole: "Assume the alchemist has every alchemical consumables in their formula book and
// add a recommendation item for players to use against a monster. Take into account any saves or ac the item may target and any weaknesses
// the item may trigger", then "Have the alchemist advice work with targeted monsters and give items a power rank specific to that monster.
// Use the simulators own rankings for conditions and damage dice and anything else but add the context of the monster").
//
// Pure, for the Node tools (tools/lib/alchemy.mjs, tools/alchemy-advice.mjs) and the live module (scripts/alchemy.js) alike: they read
// PF2e's alchemical consumables and the item module's plans for them, this ranks them. Each item's power is the planner's own value of
// using it on the monster (planner.js scoreOptions: its damage after the monster's immunities, weaknesses and resistances as a share of its
// Hit Points, its conditions at the simulator's worth for them — a round of the monster's threat each, conditionWorth —, its bomb's splash
// and riders), as a share of beating the monster: 1.00 is the monster beaten. Per action counts Quick Alchemy's.
import { itemEntry, bombRider } from "../adapter/items.js";
import { classAttributes, classPC } from "./classes.js";
import { degreeDistribution } from "./checks.js";
import { adjustInstance } from "./damage.js";
import { adviceState } from "./fight.js";
import { profileOf, scoreOptions } from "./planner.js";
import { E, M, T, specialization } from "./party.js";

const GRADE = /\s*\((?:Minor|Lesser|Moderate|Greater|Major|True)\)$/;
export const familyOf = (name) => String(name ?? "").replace(GRADE, "");
const traitsOf = (doc) => doc.system?.traits?.value ?? [];
export const isAlchemicalConsumable = (doc) => traitsOf(doc).includes("alchemical") && traitsOf(doc).includes("consumable");
const isBomb = (doc) => doc.type === "weapon" && traitsOf(doc).includes("bomb");
export const PERSISTENT_ROUNDS = 2;

// Each family at the best type a level-N alchemist can make (Lesser, Moderate, Greater…).
export function bestTypes(docs, level, { rarities = ["common", "uncommon", "rare", "unique"] } = {}) {
    const best = new Map();
    for (const doc of docs) {
        const itemLevel = Number(doc.system?.level?.value) || 0;
        if (!isAlchemicalConsumable(doc) || itemLevel > level || !rarities.includes(doc.system?.traits?.rarity ?? "common")) continue;
        const family = familyOf(doc.name);
        const kept = best.get(family);
        if (!kept || itemLevel > (Number(kept.system?.level?.value) || 0)) best.set(family, doc);
    }
    return [...best.values()];
}

// The alchemist's numbers at a level, as the simulator's alchemist (classes.js): bomb attack before the bomb's item bonus (alchemical bombs
// trained, expert at 7th, master at 15th), its class DC (expert at 9th, master at 17th), Powerful Alchemy at 5th (Quick Alchemy items use
// the class DC). A real character's own class DC and bomb attack, when given, instead.
export function alchemistNumbers(level, { classDC = null, bomb = null } = {}) {
    const lv = Math.max(1, Math.min(20, Number(level) || 1));
    const a = classAttributes("alchemist", lv);
    const bombProf = lv >= 15 ? M : lv >= 7 ? E : T;
    const classProf = lv >= 17 ? M : lv >= 9 ? E : T;
    return { level: lv, bomb: Number.isFinite(bomb) ? bomb : lv + bombProf + a.dex, bombProf, classDC: Number.isFinite(classDC) ? classDC : 10 + lv + classProf + a.int, powerfulAlchemy: lv >= 5, int: a.int };
}

// What a row of the item module's outcomes does, in words.
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

// "2d6+3", "(1d4)[poison]" → its average; its first damage type.
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

// One item as the advice reads it: a bomb (its damage, splash, persistent damage, item bonus, the item module's compileBomb plan for its
// riders) or an item with a save (the item module's compileItem plan: its save, DC, delivery, what each degree does). null: neither (an
// elixir, a mutagen, a drug, an ingested poison — nothing used on a monster).
// What its text asks of the target or the place (2026-11-04 Foundry test: Steelscour "has no effect on living or undead flesh", Cold Comfort
// "emptied into an adjacent body of water"): a trait the target needs, or a place it works in.
export function requirementsOf(doc) {
    const text = String(doc.system?.description?.value ?? "").replace(/<[^>]+>/g, " ");
    const requires = {};
    if (/\bmetal creature\b|no effect on living or undead/i.test(text)) requires.trait = "metal";
    if (/body of water/i.test(text)) requires.place = "water";
    return requires;
}

export function describeItem(doc, { itemPlan = null, bombPlan = null } = {}) {
    const base = { family: familyOf(doc.name), name: doc.name, level: Number(doc.system?.level?.value) || 0, rarity: doc.system?.traits?.rarity ?? "common", traits: traitsOf(doc), uuid: doc.uuid ?? null, requires: requirementsOf(doc) };
    if (isBomb(doc)) {
        const damage = doc.system?.damage ?? {};
        const dice = Number(damage.dice) || 0;
        const die = Number(String(damage.die ?? "").replace("d", "")) || 0;
        const persistent = damage.persistent ? { dice: Number(damage.persistent.faces) ? Number(damage.persistent.number) || 0 : 0, die: Number(damage.persistent.faces) || 0, bonus: Number(damage.persistent.faces) ? 0 : Number(damage.persistent.number) || 0, type: damage.persistent.type ?? damage.damageType ?? "untyped" } : null;
        const outcomes = bombPlan?.resolution?.outcomes ?? {};
        return {
            ...base, kind: "bomb", targets: "AC", actions: 2, itemBonus: Number(doc.system?.bonus?.value) || 0, bombPlan,
            damage: { dice: die ? dice : 0, die, bonus: die ? 0 : dice, type: damage.damageType ?? "untyped" }, splash: Number(doc.system?.splashDamage?.value) || 0, persistent,
            effects: [rowWords(outcomes.success) && `on a hit: ${rowWords(outcomes.success)}`, rowWords(outcomes.criticalSuccess) && rowWords(outcomes.criticalSuccess) !== rowWords(outcomes.success) && `on a critical hit: ${rowWords(outcomes.criticalSuccess)}`].filter(Boolean).join("; ")
        };
    }
    const resolution = itemPlan?.resolution;
    if (doc.type !== "consumable" || resolution?.kind !== "save" || resolution.check?.roll !== "save") return null;
    if (itemPlan.item?.recipient === "drinker" || ["ingested", "contact"].includes(itemPlan.item?.delivery)) return null;
    // (Quick Alchemy, then its own Activate in actions; an injury poison then needs a Strike that hits.)
    const own = Number(itemPlan.item?.activations?.[0]?.time ?? itemPlan.activation?.time ?? 1);
    if (!Number.isInteger(own) || own < 1 || own > 2) return null;
    const handoff = resolution.afflictionHandoff ?? null;
    const rows = resolution.outcomes ?? {};
    const shared = (resolution.sharedDamage?.components ?? []).map((component) => ({ average: averageOf(component.formula), type: (component.kinds ?? []).find((kind) => !["persistent", "splash"].includes(kind)) ?? typeOf(component.formula) }));
    const multiplier = (row) => (row?.damage?.mode && row.damage.mode !== "none" ? (Number.isFinite(Number(row.damage.multiplier)) ? Number(row.damage.multiplier) : 1) : 0);
    const damageOn = (degree) => {
        const row = rows[degree];
        if (row?.affliction) return (handoff?.stages?.[row.affliction.stage - 1]?.damage ?? []).map((formula) => ({ average: averageOf(formula), type: typeOf(formula) }));
        return shared.map((part) => ({ ...part, average: part.average * multiplier(row) }));
    };
    return {
        ...base, kind: "save", targets: resolution.check.statistic, delivery: itemPlan.item?.delivery ?? null, actions: 1 + own + (itemPlan.item?.delivery === "injury" ? 1 : 0), itemPlan,
        dc: resolution.check.against?.dc === "fixed" ? Number(resolution.check.against.value) || null : null,
        outcomes: Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, damageOn(degree)])),
        effects: [rowWords(rows.failure) && `on a failed save: ${rowWords(rows.failure)}`, rowWords(rows.criticalFailure) && rowWords(rows.criticalFailure) !== rowWords(rows.failure) && `critical failure: ${rowWords(rows.criticalFailure)}`].filter(Boolean).join("; ")
    };
}

// A bomb as the alchemist's Strike (classes.js's numbers: Bomber's Field Discovery splash at 5th, weapon specialization), made with Quick
// Alchemy as it's thrown (reload 1).
export function bombStrike(item, numbers) {
    const lv = numbers.level;
    return {
        name: item.family, bonus: numbers.bomb + item.itemBonus, melee: false, increment: 20, thrown: true, held: true, splashKind: "bomb",
        splashAmount: lv >= 5 ? Math.max(item.splash, numbers.int ?? 0) : item.splash, iwr: { group: "bomb", traits: ["alchemical"] },
        damage: [{ dice: item.damage.dice, die: item.damage.die, bonus: item.damage.bonus + specialization(lv, numbers.bombProf ?? T), type: item.damage.type }, ...(item.persistent ? [{ ...item.persistent, persistent: true }] : [])],
        ammo: { pool: `alchemist:${item.family}`, reagents: true, startsEmpty: true }, reload: 1
    };
}

// An item with a save as an entry the alchemist uses (the adapter's itemEntry): Quick Alchemy's action added, its DC its class DC with
// Powerful Alchemy when that's higher.
// (inReach: for the advice, a target already within its reach — one step of the planner's, without the Stride to get there.)
export function saveEntry(item, numbers, { inReach = false } = {}) {
    const plan = item.itemPlan;
    const check = plan.resolution.check;
    const dc = Math.max(Number(check.against?.value) || 0, numbers.powerfulAlchemy || !check.against?.value ? numbers.classDC : 0);
    const fitted = { ...plan, resolution: { ...plan.resolution, check: { ...check, against: { dc: "fixed", value: dc } } } };
    // (An inhaled poison: released at a creature within reach of its cloud, not on a Strike — the item module reads its target as an injury
    // poison's; 2026-11-04 Foundry test.)
    let released = item.delivery === "inhaled" ? { ...fitted, targeting: { target: "1 creature", range: "10 feet", area: null }, trigger: { event: "use" } } : fitted;
    if (inReach && !released.targeting?.area) released = { ...released, targeting: { ...(released.targeting ?? {}), range: "30 feet" } };
    const entry = itemEntry(released, { id: `alchemist-${item.family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: item.name });
    if (!entry) return null;
    const time = String(item.actions - (item.delivery === "injury" ? 1 : 0));
    return { ...entry, dc, plan: { ...entry.plan, activation: { ...(entry.plan.activation ?? {}), time } }, pool: "reagents", consumable: false, from: "Quick Alchemy" };
}

// The monster's side of an item: immune, weak or resistant to what it deals.
function iwrNotes(creature, parts) {
    const notes = [];
    for (const { type, amount } of parts) {
        if (!(amount > 0)) continue;
        const after = adjustInstance(creature, type, amount, false, null);
        const note = after === 0 ? (type === "vitality" ? "vitality harms only undead" : type === "void" ? "void doesn't harm undead" : (creature.immunities ?? []).includes(type) ? `immune to ${type}` : `resists ${type} (all of it)`) : after > amount ? `weak to ${type} (+${after - amount})` : after < amount ? `resists ${type} (−${amount - after})` : null;
        if (note && !notes.some((other) => other.split(" (")[0].endsWith(type))) notes.push(note);
    }
    return notes;
}
const avg = (part) => (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0);
const saveOf = (creature, statistic) => creature.saves?.[statistic] ?? 0;

// Each item's power against the creature (spec: an engine combatant spec, as the tools' creatureFrom or the live readActor give), best per
// action first: { item, power, perAction, chance, targets, notes, effects, damage }.
export function rankItems(creature, items, numbers, { options = {} } = {}) {
    const base = classPC("alchemist", numbers.level);
    const foe = { ...creature, id: "advice-foe", side: "foes" };
    const rows = [];
    for (const item of items) {
        // (A trait its text needs the target to have: nothing on one without it.)
        if (item.requires?.trait && !(creature.traits ?? []).includes(item.requires.trait)) {
            rows.push({ item, power: 0, perAction: 0, chance: 0, targets: item.kind === "bomb" ? `AC ${creature.ac}` : item.targets, notes: [`only a ${item.requires.trait} creature`], effects: item.effects, verdict: "none" });
            continue;
        }
        const strike = item.kind === "bomb" ? bombStrike(item, numbers) : null;
        const entry = item.kind === "save" ? saveEntry(item, numbers, { inReach: true }) : null;
        if (!strike && !entry) continue;
        const rider = strike && item.bombPlan ? bombRider(item.bombPlan, item.family) : null;
        const alchemist = { ...base, id: "advice-alchemist", side: "party", strikes: strike ? [strike] : [], spells: entry ? [entry] : rider ? [rider] : [], spellPools: { reagents: 10 } };
        const state = adviceState({ combatants: [alchemist, foe] }, options);
        const c = state.byId.get("advice-alchemist");
        const target = state.byId.get("advice-foe");
        c.actionsLeft = 3;
        let value = 0;
        try {
            for (const option of scoreOptions(state, c).options) {
                const action = option.action ?? {};
                const uses = (action.type === "strike" && action.strikeIndex === 0 && action.targetId === target.id) || (action.type === "cast" && entry && action.spellIndex === 0 && (action.targetIds ?? []).includes(target.id));
                if (uses) value = Math.max(value, option.value);
            }
        } catch {
            value = 0;
        }
        const scale = profileOf(c).aggression * Math.max(state.threat?.get(target.id) ?? 0, 1);
        const power = Math.max(0, value / scale);
        // The odds and the monster's side of it, for the reader.
        let chance;
        let targets;
        let notes;
        if (strike) {
            const [, , hit, crit] = degreeDistribution(strike.bonus, creature.ac);
            chance = hit + crit;
            targets = `AC ${creature.ac}`;
            notes = iwrNotes(creature, [{ type: item.damage.type, amount: avg(strike.damage[0]) + strike.splashAmount }, ...(item.persistent ? [{ type: item.persistent.type, amount: avg(item.persistent) }] : [])]);
        } else {
            const [critFail, fail] = degreeDistribution(saveOf(creature, item.targets), entry.dc);
            const delivered = item.delivery === "injury" ? (() => {
                const [, , hit, crit] = degreeDistribution(base.strikes?.find((other) => other.melee)?.bonus ?? numbers.bomb, creature.ac);
                return hit + crit;
            })() : 1;
            chance = delivered * (critFail + fail);
            targets = `${item.targets} +${saveOf(creature, item.targets)} vs DC ${entry.dc}${item.delivery === "injury" ? `, after a Strike hits AC ${creature.ac}` : ""}`;
            notes = iwrNotes(creature, [...(item.outcomes.failure ?? []), ...(item.outcomes.criticalFailure ?? [])].map((part) => ({ type: part.type, amount: part.average })));
            const immune = (creature.immunities ?? []).filter((immunity) => item.traits.includes(immunity));
            if (immune.length) notes.unshift(`immune (${immune.join(", ")})`);
        }
        if (item.requires?.place) notes.push(`needs ${item.requires.place} where the monster is`);
        // Its verdict: useful, situational (a place it needs), no effect on this monster (immune, all resisted, vitality on the living), or
        // one the simulator can't rate yet.
        const noEffect = notes.some((note) => /^immune|all of it|harms only|doesn't harm/.test(note)) || chance === 0;
        const verdict = power > 0 ? (item.requires?.place ? "situational" : "useful") : noEffect ? "none" : "unrated";
        rows.push({ item, power, perAction: power / item.actions, chance, targets, notes, effects: item.effects, verdict });
    }
    return rows.sort((a, b) => b.perAction - a.perAction || b.chance - a.chance);
}
