// Requirements the simulation checks (B304, 2026-10-13; the user's call: "work through your recommendations in order", item 1): the
// ability module's needs (its src/compiler/needs.js), each of which must hold for the creature to use the ability now.

import { DEAD, isActive, isOffGuard } from "./combatant.js";
import { distanceBetween, engagedEnemies, sameMelee } from "./space.js";
import { castJustNow, followsStrike, sizeRank } from "./abilities.js";

const KNOWN = new Set(["corpse", "grabbing", "swallowing", "hpAtLeast", "hpBelow", "hpBelowHalf", "hurt", "regeneration", "notFatigued", "self", "shieldRaised", "enemyAdjacent", "allyAdjacent", "freeHand", "allyTrait", "afterCast", "afterStrike", "firstAction", "foe", "target", "any"]);

// Whether every need is one the simulation checks.
export function needsKnown(needs) {
    return Array.isArray(needs) && needs.length > 0 && needs.every((need) => Object.keys(need).every((key) => KNOWN.has(key)) && (!need.any || needsKnown(need.any)));
}

const holding = (state, c) => state.list.filter((other) => other.grabbedBy === c.id && (other.cond.grabbed || other.cond.restrained));
const within = (c, other, feet) => (feet <= 10 ? sameMelee(c, other) : distanceBetween(c, other) <= feet);
const inState = (other, condition) => (condition === "dying" ? other.status === "down" : isActive(other) && Boolean(other.cond?.[condition]));

function holds(state, c, need, { fresh = true } = {}) {
    if (need.any) return need.any.some((each) => holds(state, c, each, { fresh }));
    // (One corpse a use: Consume Flesh's "from any given corpse only once".)
    if (need.corpse) return state.list.filter((other) => other.status === DEAD && !other.vanished && !other.reserve && other.kind !== "object" && other.kind !== "hazard"
        && (!need.corpse.traits?.length || need.corpse.traits.some((trait) => (other.traits ?? []).includes(trait)))).length > (c.corpsesUsed ?? 0);
    if (need.grabbing) return holding(state, c).some((other) => !need.grabbing.trait || (other.traits ?? []).includes(need.grabbing.trait));
    if (need.swallowing !== undefined) return state.list.some((other) => other.swallowedBy === c.id && isActive(other)) === need.swallowing;
    if (need.hpAtLeast) return c.hp.value >= need.hpAtLeast;
    if (need.hpBelow) return c.hp.value < need.hpBelow;
    if (need.hpBelowHalf) return c.hp.value < c.hp.max / 2;
    if (need.hurt) return c.hp.value < c.hp.max;
    if (need.regeneration) return Boolean(c.regeneration) && !c.regenerationOff;
    if (need.notFatigued) return !c.cond.fatigued;
    if (need.self) return need.self.every((condition) => (condition === "offGuard" ? isOffGuard(c) : Boolean(c.cond[condition])));
    if (need.shieldRaised) return Boolean(c.shield?.raised && !c.shield.broken);
    if (need.enemyAdjacent) return engagedEnemies(state, c).length > 0;
    if (need.allyAdjacent) return state.list.some((other) => other !== c && other.side === c.side && isActive(other) && sameMelee(other, c));
    if (need.freeHand) return holding(state, c).length === 0;
    if (need.allyTrait) return state.list.some((other) => other !== c && other.side === c.side && isActive(other) && (other.traits ?? []).includes(need.allyTrait.trait) && within(c, other, need.allyTrait.within ?? 10));
    if (need.afterCast) return fresh && castJustNow(state, c, Boolean(need.afterCast.nonCantrip));
    if (need.afterStrike) {
        if (!fresh || !followsStrike(state, c, need.afterStrike)) return false;
        const size = need.afterStrike.size;
        const target = size ? state.byId.get(c.lastStrike?.targetId) : null;
        if (!size) return true;
        if (!target) return false;
        const rank = sizeRank(target.size);
        return (!size.larger || rank > sizeRank(c.size)) && (!size.min || rank >= sizeRank(size.min)) && (!size.max || rank <= sizeRank(size.max));
    }
    if (need.firstAction) return fresh && (c.actionCount ?? 0) === 0;
    if (need.foe) return state.list.some((other) => other.side !== c.side && within(c, other, need.foe.within ?? 30)
        && (need.foe.conditions ?? []).every((condition) => inState(other, condition))
        && (!need.foe.persistent || (other.persistent ?? []).some((entry) => entry.type === need.foe.persistent)));
    // (A target in a state: one such creature within reach; the targets themselves are checked by targetNeeds.)
    if (need.target) return state.list.some((other) => other.side !== c.side && targetMeets(c, other, need.target));
    return false;
}

function targetMeets(c, other, rule) {
    return (rule.conditions ?? []).some((condition) => inState(other, condition) || (condition === "unconscious" && other.status === "down")) && within(c, other, rule.within ?? 5);
}

// needs: the plan's; fresh: this would be its next action (for "its last action was …").
export function needsMet(state, c, needs, options = {}) {
    return needsKnown(needs) && needs.every((need) => holds(state, c, need, options));
}

// The targets it may act on with it: those in the state a target need names (Drag's Prone creature), or any.
export function targetNeedsMet(c, target, needs) {
    const rule = (needs ?? []).find((need) => need.target)?.target;
    return !rule || targetMeets(c, target, rule);
}

// Whether the simulation plays an ability with this requirement: none, a foe nearby in a state, one it tracks itself (after a cast,
// raging, its breath recharging), or needs it checks.
export function requirementPlayable(plan, played) {
    // (B312: never one whose requirement the ability module couldn't read.)
    if (plan?.requirementUnread) return false;
    return !plan?.requires || Boolean(plan.requiresFoe) || played.has(plan.requires) || needsKnown(plan.needs);
}
