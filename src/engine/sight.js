// Seeing through an illusion (2026-10-14: Truesight against Invisibility). A creature with true sight (c.trueSight: { modifier, rank,
// untilRound, seen: { id: boolean } }) attempts PF2e's counteract check against the spell that hid a creature (its Invisibility:
// c.condSources.invisible) the first time it matters; on a success that creature isn't hidden to it for the fight.
import { counterRoll } from "./counteract.js";
import { hasSense, unseenCost } from "./light.js";

export function seesThrough(state, viewer, target) {
    const sight = viewer?.trueSight;
    if (!sight || state.round >= sight.untilRound) return false;
    const source = target?.condSources?.invisible;
    if (!source?.spell || !Number.isFinite(source.dc)) return false;
    if (sight.seen[target.id] !== undefined) return sight.seen[target.id];
    const roll = counterRoll(state, sight.modifier, sight.rank, { dc: source.dc, rank: source.rank });
    sight.seen[target.id] = roll.success;
    state.log?.push(`  ${viewer.name} ${roll.success ? "sees through" : "doesn't see through"} ${target.name}'s ${source.name} (${roll.total} vs ${source.dc})`);
    return roll.success;
}

// Invisible (2026-10-21, invisibility tracked — the user: "I also want spells that need foe traits since i want those to be tracked too in
// the simulator"): hidden by an Invisibility (condSources.invisible) or naturally (a permanent invisible).
export function invisibleOf(c) {
    return Boolean(c?.cond?.hidden) && (Boolean(c?.condSources?.invisible) || (c?.permanent ?? []).some((entry) => entry.slug === "invisible"));
}

// The flat check a viewer needs for a target by its own conditions (the light's is environment.js's sightDC): 11 hidden, 5 concealed, 0
// seen. An invisible one seen as concealed instead by a viewer with see invisibility (See the Unseen, a babau's sense) and while it's
// outlined (Faerie Fire, Revealing Light: "Visible creatures can't be Concealed"). roll: false — weighing, not acting: truesight only
// where it has already looked.
export function hiddenDC(state, viewer, target, { roll = true } = {}) {
    const outlined = Boolean(target?.cond?.outlined);
    const looked = viewer?.trueSight?.seen?.[target?.id];
    const through = roll ? seesThrough(state, viewer, target) : looked === true;
    if (target?.cond?.hidden && !through) return invisibleOf(target) && (outlined || hasSense(viewer, "see-invisibility")) ? 5 : 11;
    return target?.cond?.concealed && !outlined ? 5 : 0;
}

// Hidden from this viewer: hidden, and not seen through (nor seen as concealed).
export function hiddenFrom(state, viewer, target) {
    return hiddenDC(state, viewer, target) >= 11;
}

// What outlining a creature is worth against it (positive: easier to see — against it), in rounds of its threat over rounds: the change in
// how hard the other side finds it — its conditions and the light's concealment (outlined, none) — as light.js's unseenCost.
export function outlineWorth(state, target, rounds, sightDC) {
    const watchers = state.list.filter((other) => other.side !== target.side && other.status === "active");
    if (!watchers.length) return 0;
    const outlined = { ...target, cond: { ...target.cond, outlined: true } };
    const find = (watcher, who) => {
        const light = sightDC(state, watcher, target);
        return Math.max(hiddenDC(state, watcher, who, { roll: false }), who.cond.outlined && light < 11 ? 0 : light);
    };
    return watchers.reduce((sum, watcher) => sum + unseenCost(find(watcher, target)) - unseenCost(find(watcher, outlined)), 0) / watchers.length * rounds;
}
