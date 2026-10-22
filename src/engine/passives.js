// Passives PF2e's own rules hold (B302, 2026-10-13; the user's call: "the crash, traps and then passives"). The ability module compiles them
// as { builtin: "passive-rules" } (abilities.js addBuiltin makes them combatant fields):
//   saveDegrees: Evasion, Juggernaut, Bravery … — a save's degree, adjusted.
//   flanking: All-Around Vision (can't be flanked), Deny Advantage (not off-guard to flankers of its level or lower).
//   makesOffGuard: Surprise Attack (the first round, before the target acts), Dread Striker (a frightened target) — off-guard to it.
//   constructArmor: Hardness, and AC lost below half its Hit Points or on a critical hit.
//   lessFrightened (Bravery), mobility (a short Stride triggers no reactions), extra reactions (abilities.js, combatant.js).

import { CRITICAL_SUCCESS, CRITICAL_FAILURE } from "./checks.js";
import { readSourceOptions, testPredicate } from "./abilities.js";
import { log } from "./log.js";
import { seesThrough } from "./sight.js";

const DEGREE_KEYS = ["criticalFailure", "failure", "success", "criticalSuccess"];
const STEPS = {
    "one-degree-better": (degree) => degree + 1,
    "one-degree-worse": (degree) => degree - 1,
    "two-degrees-better": (degree) => degree + 2,
    "two-degrees-worse": (degree) => degree - 2,
    "to-critical-success": () => CRITICAL_SUCCESS,
    "to-success": () => 2,
    "to-failure": () => 1,
    "to-critical-failure": () => CRITICAL_FAILURE
};

// A save's degree (0–3) with the creature's adjustments for that save against this spell or ability (its traits for the predicate).
// Each adjustment is the one for the degree rolled, in turn.
export function adjustedSaveDegree(c, save, degree, spell = null) {
    if (!c?.saveDegrees?.length) return degree;
    let options = null;
    let adjusted = degree;
    for (const entry of c.saveDegrees) {
        if (!entry.saves.includes(save)) continue;
        if (entry.predicate && !testPredicate(entry.predicate, (options ??= readSourceOptions(spell)))) continue;
        const step = STEPS[entry.adjustment[DEGREE_KEYS[degree]] ?? entry.adjustment.all];
        if (step) adjusted = Math.max(CRITICAL_FAILURE, Math.min(CRITICAL_SUCCESS, step(adjusted)));
    }
    return adjusted;
}

// The odds of each degree [critical failure … critical success], adjusted the same way.
export function adjustedSaveOdds(c, save, odds, spell = null) {
    if (!c?.saveDegrees?.length) return odds;
    const adjusted = [0, 0, 0, 0];
    for (let degree = 0; degree < 4; degree++) adjusted[adjustedSaveDegree(c, save, degree, spell)] += odds[degree];
    return adjusted;
}

// Deny Advantage's level: a number, or its own level.
function denyLevel(c) {
    const value = c.flanking?.offGuardable;
    return value === "level" ? c.level ?? 0 : Number.isFinite(value) ? value : null;
}

// Whether the attacker's flanking makes the target off-guard: not All-Around Vision; not Deny Advantage against a creature of its level or lower.
export function flankableBy(target, attacker) {
    if (target.flanking?.flankable === false) return false;
    // (2026-10-22, Foresight: not off-guard when flanked.)
    if ((target.defences ?? []).some((entry) => entry.kind === "foresight")) return false;
    const level = denyLevel(target);
    return level === null || (attacker?.level ?? 0) > level;
}

function hasCondition(c, slug) {
    if (slug.startsWith("persistent-damage")) {
        const type = slug.split(":")[1];
        return (c.persistent ?? []).some((entry) => !type || entry.type === type);
    }
    return Boolean(c.cond?.[slug]);
}

// Whether the target is off-guard to this attacker by the attacker's own passive: Surprise Attack in the first round before the target acts
// (with a Stealth initiative when it says so; Deny Advantage of its level or higher stops it), Dread Striker on a frightened creature.
// spell: a spell attack; melee: a melee Strike.
export function offGuardFrom(state, attacker, target, { melee = true, spell = false } = {}) {
    // (2026-10-14: a hidden attacker — Invisibility — leaves its target off-guard, PF2e's rule; not one that sees through it, Truesight.)
    if (attacker?.cond?.hidden && !seesThrough(state, target, attacker)) return true;
    for (const entry of attacker?.makesOffGuard ?? []) {
        if (spell ? !entry.spells : (entry.strikes === "melee" && !melee) || (entry.strikes === "ranged" && melee)) continue;
        const when = entry.when ?? {};
        if (when.round && state.round !== when.round) continue;
        if (when.notActed && target.round !== undefined) continue;
        // (The skill it rolled for initiative: Stealth for an ambushing side, else the best its abilities name — B303.)
        if (when.initiative && !when.initiative.includes(state.initiativeStat?.get(attacker.id)?.stat ?? (state.stealthInitiative?.has(attacker.id) ? "stealth" : "perception"))) continue;
        if (when.conditions && !when.conditions.every((any) => any.some((slug) => hasCondition(target, slug)))) continue;
        if (when.notTraits?.some((trait) => (target.traits ?? []).includes(trait))) continue;
        if (when.notActed && denyLevel(target) !== null && (attacker.level ?? 0) <= denyLevel(target)) continue;
        return true;
    }
    return false;
}

// Construct Armor: below its share of Hit Points, or damaged by a critical hit — its AC drops and its Hardness goes (once).
export function constructArmorDamaged(state, c, critical) {
    const armor = c.constructArmor;
    if (!armor || c.armorBroken || c.hp.value <= 0) return;
    if (!critical && c.hp.value >= c.hp.max * (armor.below ?? 50) / 100) return;
    c.armorBroken = true;
    c.ac += armor.ac;
    if (armor.losesHardness) c.hardness = 0;
    log(state, `  ${c.name}'s construct armor breaks: AC ${c.ac}${armor.losesHardness ? ", no Hardness" : ""}`);
}

// Bravery: "any time it gains the Frightened condition, reduce its value by 1" — the frightened it has after gaining frightened `value`
// (B302; B303: the morale rules' frightened too, the user's call: "even if it changes how morale works on that creature").
export function frightenedAfter(c, value) {
    return Math.max(c.cond?.frightened ?? 0, (Number.isFinite(value) ? value : 1) - (c.lessFrightened ?? 0));
}

// Mobility: a Stride of half its Speed or less triggers no reactions — any but a long move (leaving the field, to the exit, an area, a gong).
const LONG_MOVES = new Set(["leave", "toExit", "toArea", "toGong"]);
export function mobileStride(c, move) {
    // (T2, Swiftness: none of its movement triggers reactions.)
    if (c.swiftness) return true;
    return Boolean(c.mobility?.moves?.includes("stride")) && !LONG_MOVES.has(move?.kind);
}
