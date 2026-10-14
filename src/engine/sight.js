// Seeing through an illusion (2026-10-14: Truesight against Invisibility). A creature with true sight (c.trueSight: { modifier, rank,
// untilRound, seen: { id: boolean } }) attempts PF2e's counteract check against the spell that hid a creature (its Invisibility:
// c.condSources.invisible) the first time it matters; on a success that creature isn't hidden to it for the fight.
import { counterRoll } from "./counteract.js";

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

// Hidden from this viewer: hidden, and not seen through.
export function hiddenFrom(state, viewer, target) {
    return Boolean(target?.cond?.hidden) && !seesThrough(state, viewer, target);
}
