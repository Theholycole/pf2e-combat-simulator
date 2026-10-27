// (2026-10-27, as the ability module's live play reads it for the item module's Poison Fizz, Durian Bomb, Scalding Gauntlets and Phantasmal
// Doorknob.) A temporary immunity to one part of an ability, "temporarily immune to being blinded by poison fizz for 1 hour": trigger.partImmunity
// { condition, duration: { value, unit }, slug?, degrees?, against? }, or a list of them. A creature already immune gets its row without that
// condition (its damage and the rest as rolled); one given that condition on a result in degrees (any when none) is immune to it for the
// duration: rounds as they are, minutes ten rounds each, hours and days the whole fight. against "all": from anyone's; otherwise from this
// creature's only.

const PER = { rounds: 1, minutes: 10, hours: Infinity, days: Infinity };

export function planParts(plan) {
    return [plan?.trigger?.partImmunity ?? []].flat().filter((part) => part?.condition && Number(part.duration?.value) > 0 && PER[part.duration.unit]);
}

// The changes without the conditions their targets are immune to, and the immunities the rest earn (marked on the targets, c.partImmune).
// degrees: target id → its result. → { kept, dropped: [{ target, slug }] }
export function partImmunityChanges(state, caster, plan, name, changes, degrees = {}) {
    const parts = planParts(plan);
    if (!parts.length) return { kept: changes, dropped: [] };
    const keyOf = (part) => `${part.slug ?? plan?.source?.slug ?? name}:${part.condition}`;
    const holds = (target, part) => (target?.partImmune ?? []).some((held) => held.key === keyOf(part) && (!held.by || held.by === caster?.id) && held.until > state.round);
    const dropped = [];
    const kept = changes.filter((change) => {
        if (change?.op !== "condition" || !parts.some((part) => part.condition === change.slug && holds(state.byId.get(change.target), part))) return true;
        dropped.push({ target: change.target, slug: change.slug });
        return false;
    });
    for (const change of kept) {
        if (change?.op !== "condition") continue;
        const target = state.byId.get(change.target);
        for (const part of parts) {
            if (!target || part.condition !== change.slug || holds(target, part)) continue;
            if (part.degrees?.length && !part.degrees.includes(degrees[change.target])) continue;
            (target.partImmune ??= []).push({ key: keyOf(part), by: part.against === "all" ? null : caster?.id ?? null, until: state.round + Number(part.duration.value) * PER[part.duration.unit] });
        }
    }
    return { kept, dropped };
}
