// PF2e spell effects (effect items with rule elements), as the engine models
// them. The snapshot reads each effect item a creature's spells apply and
// turns its rules into a model with effectModel(); the engine applies models
// to creatures and the stat functions read their modifiers.
//
// Model: {
//   name, rounds (minutes count 10 rounds; hours and longer, Infinity),
//   modifiers: [{ on: "ac" | "fortitude" | "reflex" | "will" | "attack" | "damage" | "spell", type, value }],
//   tempHp, fastHealing, resistances, weaknesses, immunities: [type…],
//   conditions: [{ slug, value }],
//   unsupported: [rule key…]   mechanics the engine doesn't model (battle forms, new Strikes…)
//   situational: n             rules that apply only in situations the engine can't see (predicates)
// }

import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";

// PF2e selectors the engine reads, and what they modify.
const SELECTORS = {
    ac: ["ac"],
    "saving-throw": ["fortitude", "reflex", "will"],
    fortitude: ["fortitude"],
    reflex: ["reflex"],
    will: ["will"],
    attack: ["attack"],
    "attack-roll": ["attack"],
    "strike-attack-roll": ["attack"],
    "spell-attack-roll": ["spell"],
    "spell-dc": ["spell"],
    damage: ["damage"],
    "strike-damage": ["damage"]
};
// Rule keys with no effect on a fight as the engine plays it.
const IGNORED = new Set(["Note", "RollOption", "Sense", "BaseSpeed", "TokenLight", "TokenImage", "TokenEffectIcon", "DexterityModifierCap", "ChoiceSet", "ItemAlteration", "SubstituteRoll", "MartialProficiency", "CriticalSpecialization", "Aura"]);

// A rule's value at the effect's rank: a number, or a formula like
// "ternary(gte(@item.level,10),3,1)" or "10 + (@item.level - 2) * 3". null when it has dice or can't be read.
export function numericValue(value, rank) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return null;
    try {
        const instances = parseDamage(value, { rank });
        if (instances.some((instance) => instance.dice.length)) return null;
        return instances.reduce((sum, instance) => sum + instance.constant, 0);
    } catch {
        return null;
    }
}

// true or false for predicates on the effect's level; null for anything else
// (roll options, traits, choices: situations the engine doesn't track).
function predicateHolds(predicate, rank) {
    if (!predicate || (Array.isArray(predicate) && !predicate.length)) return true;
    const terms = Array.isArray(predicate) ? predicate : [predicate];
    const compare = { gte: (a, b) => a >= b, gt: (a, b) => a > b, lte: (a, b) => a <= b, lt: (a, b) => a < b, eq: (a, b) => a === b };
    for (const term of terms) {
        if (!term || typeof term !== "object") return null;
        const [operator, args] = Object.entries(term)[0] ?? [];
        if (!compare[operator] || !Array.isArray(args) || !/^(parent|item):(level|rank)$/.test(String(args[0]))) return null;
        if (!compare[operator](rank, Number(args[1]))) return false;
    }
    return true;
}

function roundsOf(duration) {
    if (!duration || duration.value === -1 || duration.unit === "unlimited" || duration.unit === "encounter") return Infinity;
    const value = Number(duration.value) || 1;
    if (duration.unit === "rounds") return value;
    if (duration.unit === "minutes") return value * 10;
    return Infinity;
}

// A penalty or bonus an outcome gives ({ selector, value, type, duration } in
// PF2e's FlatModifier terms, as the core passes it: Bon Mot's -2 status to Will),
// as an effect model. null when the engine reads none of its selectors (Perception, skill checks).
export function modifierModel(name, modifier) {
    const on = SELECTORS[modifier?.selector] ?? [];
    if (!on.length || !Number.isFinite(Number(modifier.value))) return null;
    const rounds = modifier.duration?.mode === "fixed" ? roundsOf(modifier.duration) : Infinity;
    return { name, rounds, modifiers: on.map((stat) => ({ on: stat, type: modifier.type ?? "untyped", value: Number(modifier.value) })), tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
}

// item: a PF2e effect item (or its source). conditionSlug(uuid): the slug of a
// condition item a GrantItem points at, or null.
export function effectModel(item, { rank = 1, conditionSlug = () => null } = {}) {
    const model = { name: item?.name ?? "Effect", rounds: roundsOf(item?.system?.duration), modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
    const unsupported = new Set();
    for (const rule of item?.system?.rules ?? []) {
        if (!rule?.key || IGNORED.has(rule.key)) continue;
        const holds = predicateHolds(rule.predicate, rank);
        if (holds === false) continue;
        if (holds === null) {
            model.situational++;
            continue;
        }
        const value = numericValue(rule.value, rank);
        switch (rule.key) {
            case "FlatModifier": {
                const selectors = [].concat(rule.selector ?? []);
                if (value === null || selectors.some((selector) => String(selector).includes("{"))) {
                    model.situational++;
                    break;
                }
                for (const selector of selectors) for (const on of SELECTORS[selector] ?? []) model.modifiers.push({ on, type: rule.type ?? "untyped", value });
                break;
            }
            case "DamageDice": {
                // Extra dice on Strikes, as their average.
                const selectors = [].concat(rule.selector ?? []);
                if (!selectors.some((selector) => selector === "strike-damage" || selector === "damage")) break;
                const dice = Number(rule.diceNumber) || 1;
                const die = Number(String(rule.dieSize ?? "d6").replace("d", "")) || 6;
                model.modifiers.push({ on: "damage", type: "dice", value: Math.round(dice * (die + 1) / 2) });
                break;
            }
            case "TempHP":
                if (value !== null) model.tempHp = Math.max(model.tempHp, value);
                break;
            case "FastHealing":
                if (value !== null && (rule.type ?? "fast-healing") === "fast-healing") model.fastHealing = Math.max(model.fastHealing, value);
                break;
            case "Resistance":
            case "Weakness":
                if (value !== null && rule.type) (rule.key === "Resistance" ? model.resistances : model.weaknesses).push({ type: rule.type, value, exceptions: [].concat(rule.exceptions ?? []).map(String) });
                break;
            case "Immunity":
                if (rule.type) model.immunities.push(rule.type);
                break;
            case "GrantItem": {
                const slug = conditionSlug(rule.uuid);
                if (!slug) {
                    unsupported.add("GrantItem");
                    break;
                }
                const badge = (rule.alterations ?? []).find((alteration) => alteration.property === "badge-value");
                model.conditions.push({ slug, value: badge ? numericValue(badge.value, rank) : null });
                break;
            }
            default:
                unsupported.add(rule.key);
        }
    }
    model.unsupported = [...unsupported];
    return model;
}

// --- Applying models -----------------------------------------------------------

let nextEffectId = 1;

// The net modifier from a creature's effects to one statistic, without status
// penalties (the condition rules take the worst status penalty: effectStatusPenalty).
export function effectBonus(c, on) {
    if (!c.effects?.length) return 0;
    const byType = new Map();
    for (const effect of c.effects) {
        for (const modifier of effect.model.modifiers) {
            if (modifier.on !== on) continue;
            if (modifier.type === "status" && modifier.value < 0) continue;
            if (modifier.type === "untyped" || modifier.type === "dice") {
                byType.set(`${modifier.type}:${byType.size}`, { high: modifier.value, low: 0 });
                continue;
            }
            const entry = byType.get(modifier.type) ?? { high: 0, low: 0 };
            if (modifier.value > 0) entry.high = Math.max(entry.high, modifier.value);
            else entry.low = Math.min(entry.low, modifier.value);
            byType.set(modifier.type, entry);
        }
    }
    let total = 0;
    for (const entry of byType.values()) total += entry.high + entry.low;
    return total;
}

// The worst status penalty from a creature's effects to one statistic, as a positive number.
export function effectStatusPenalty(c, on) {
    if (!c.effects?.length) return 0;
    let worst = 0;
    for (const effect of c.effects) {
        for (const modifier of effect.model.modifiers) {
            if (modifier.on === on && modifier.type === "status" && modifier.value < 0) worst = Math.max(worst, -modifier.value);
        }
    }
    return worst;
}

function withDefences(target, effect, add) {
    const tag = (entry) => ({ ...entry, effectId: effect.id });
    if (add) {
        if (effect.model.resistances.length) target.resistances = [...(target.resistances ?? []), ...effect.model.resistances.map(tag)];
        if (effect.model.weaknesses.length) target.weaknesses = [...(target.weaknesses ?? []), ...effect.model.weaknesses.map(tag)];
        if (effect.model.immunities.length) target.immunities = [...(target.immunities ?? []), ...effect.model.immunities];
    } else {
        target.resistances = (target.resistances ?? []).filter((entry) => entry.effectId !== effect.id);
        target.weaknesses = (target.weaknesses ?? []).filter((entry) => entry.effectId !== effect.id);
        if (effect.model.immunities.length) {
            const remove = [...effect.model.immunities];
            target.immunities = (target.immunities ?? []).filter((type) => {
                const index = remove.indexOf(type);
                if (index < 0) return true;
                remove.splice(index, 1);
                return false;
            });
        }
    }
    // The Strike damage cache keys on a creature's defences.
    target.defenceId = undefined;
}

export function removeEffect(target, effect) {
    target.effects = (target.effects ?? []).filter((other) => other !== effect);
    withDefences(target, effect, false);
    // A Strike the effect gave (Tiger Stance's tiger claw) goes with it.
    if ((target.strikes ?? []).some((strike) => strike.fromEffect === effect.key)) target.strikes = target.strikes.filter((strike) => strike.fromEffect !== effect.key);
}

// Puts an effect on a creature; the same effect again replaces it. A finite
// duration ends it at the start of the source's turn that many rounds later.
// applyCondition: the spells layer's, for the conditions the effect grants.
export function applyEffect(state, target, model, source, { applyCondition, key = model.name } = {}) {
    for (const existing of (target.effects ?? []).filter((effect) => effect.key === key)) removeEffect(target, existing);
    const effect = { id: nextEffectId++, key, model, sourceId: source?.id ?? null };
    target.effects = [...(target.effects ?? []), effect];
    withDefences(target, effect, true);
    if (model.tempHp > 0) target.hp.temp = Math.max(target.hp.temp ?? 0, model.tempHp);
    const duration = Number.isFinite(model.rounds) ? { mode: "fixed", value: model.rounds, unit: "rounds" } : null;
    for (const condition of model.conditions) applyCondition?.(state, target, condition.slug, condition.value, duration, source);
    if (Number.isFinite(model.rounds)) (target.timers ??= []).push({ effect, round: state.round + model.rounds, turnOf: source?.id ?? target.id });
    return effect;
}

// How much an effect helps the creature it's on, in rounds of that creature's
// threat (negative for a hindrance). conditionHarm(slug, value, rounds) is the
// spells layer's condition weighting. strikeShare: the part of the creature's
// threat its Strikes make (1 for a warrior, little for a caster), which is all
// an attack or damage bonus, or quickened's extra Strike or Stride, can help.
export function effectBenefit(model, target, conditionHarm, strikeShare = 1) {
    const rounds = Math.min(3, model.rounds);
    let benefit = 0;
    const strikes = (target.strikes ?? []).length > 0 ? strikeShare : 0;
    for (const modifier of model.modifiers) {
        const per = { ac: 0.08, fortitude: 0.01, reflex: 0.01, will: 0.01, attack: 0.1 * strikes, damage: 0.04 * strikes, spell: 0.05 * (1 - strikes) }[modifier.on] ?? 0;
        benefit += per * modifier.value * rounds;
    }
    if (target.hp?.max > 0) {
        benefit += model.tempHp / target.hp.max;
        benefit += (model.fastHealing * rounds) / target.hp.max;
    }
    for (const entry of model.resistances) benefit += 0.02 * entry.value * rounds;
    for (const entry of model.weaknesses) benefit -= 0.03 * entry.value * rounds;
    benefit += 0.1 * model.immunities.length;
    const duration = { mode: "fixed", value: rounds, unit: "rounds" };
    for (const condition of model.conditions) {
        benefit += condition.slug === "quickened" ? 0.3 * rounds * Math.max(0.2, strikes) : -conditionHarm(condition.slug, condition.value, duration);
    }
    return benefit;
}
