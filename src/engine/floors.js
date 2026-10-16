// A condition the creature can't reduce below a value while something lasts (2026-10-14; the spell module's conditionFloor): Evil Eye's
// and Buzzing Bites' sickened 1 while the spell lasts, Lift Nature's Caul's frightened 1 while it's stupefied, Horrifying Blood Loss's
// while it bleeds, Ghoulish Cravings' until it eats raw meat (not in a fight). Entries in c.condFloors: { slug, value, by, spell,
// lifetime, whileCondition, persistent, untilRound, sustained }.
import { lastingRounds } from "./lasting.js";

const FLAG_CONDITIONS = new Set(["quickened", "offGuard", "prone", "fleeing", "unconscious", "fatigued", "paralyzed", "asleep", "blinded", "dazzled", "immobilized", "restrained", "grabbed", "confused"]);

export function addFloor(state, target, caster, spell, floor) {
    // (2026-10-16, the item module's floors: "fixed", for its own duration — Timpani of Panic's 1 round or 1 minute.)
    const { rounds, sustained } = floor.lifetime === "spell" ? lastingRounds(spell.plan?.lifecycle?.durationSpec ?? null)
        : floor.lifetime === "fixed" && floor.duration ? lastingRounds({ mode: "fixed", ...floor.duration }) : { rounds: Infinity, sustained: false };
    const list = (target.condFloors ??= []).filter((held) => !(held.by === caster.id && held.spell === spell.name && held.slug === floor.slug));
    list.push({ slug: floor.slug, value: Number(floor.value) || 1, by: caster.id, spell: spell.name, lifetime: floor.lifetime ?? null, whileCondition: floor.whileCondition?.slug ?? null, persistent: floor.persistentDamage ?? null, untilRound: state.round + rounds, sustained });
    target.condFloors = list;
}

// The lowest the condition can go now (0: no floor).
export function floorOf(c, slug) {
    let floor = 0;
    for (const entry of c.condFloors ?? []) {
        if (entry.slug !== slug) continue;
        if (entry.lifetime === "while-condition" && entry.whileCondition && !(FLAG_CONDITIONS.has(entry.whileCondition) ? c.cond?.[entry.whileCondition] : (c.cond?.[entry.whileCondition] ?? 0) > 0)) continue;
        if (entry.lifetime === "while-persistent" && !(c.persistent ?? []).some((held) => !entry.persistent || held.type === entry.persistent)) continue;
        floor = Math.max(floor, entry.value);
    }
    return floor;
}
