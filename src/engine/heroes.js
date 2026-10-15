// Hero points (2026-10-15; the user: "how are hero points decided to be used? It seems low even on deadly encounters", then chose "When it
// matters"). A PC rerolls (keeping the new result, as PF2e has it):
//   - a critically failed save, or a failed one against something that would take it out — damage that would drop it, or paralyzed,
//     stunned, slowed, blinded, confused, controlled, petrified, unconscious, fleeing, a death effect;
//   - a missed attack (a Strike or a spell attack) that would have dropped its target;
// and spends them all on Heroic Recovery when its dying value would reach death. Below a third of its Hit Points it keeps its last point for
// that. Before, it rerolled only attacks, only with two points or more, and never a save.
import { log } from "./log.js";

const TAKES_OUT = new Set(["paralyzed", "stunned", "slowed", "blinded", "confused", "controlled", "petrified", "unconscious", "asleep", "fleeing"]);

// Whether it can spend a hero point on a reroll now.
export function canSpendHero(state, c) {
    if (!state.options?.heroPoints || c?.kind !== "pc" || !(c.heroPoints > 0)) return false;
    // (Its last point kept for Heroic Recovery while it's below a third of its Hit Points.)
    return !(c.heroPoints <= 1 && c.hp.value < c.hp.max / 3);
}

export function spendHeroPoint(state, c, what) {
    c.heroPoints--;
    state.stats.heroPointsSpent++;
    log(state, `  ${c.name} spends a hero point to reroll ${what}`);
}

// Whether a save's degree (0 a critical failure … 3 a critical success) is worth a reroll: a critical failure, or a failure whose changes
// on it would take it out.
export function saveWorthReroll(c, degreeIndex, changes) {
    if (degreeIndex === 0) return true;
    return degreeIndex === 1 && takesOut(c, changes);
}

// What these changes would do to the creature: drop it, or keep it from fighting.
export function takesOut(c, changes) {
    let damage = 0;
    for (const change of changes ?? []) {
        if (change.target !== c.id) continue;
        if (change.op === "death") return true;
        if (change.op === "condition" && TAKES_OUT.has(change.slug)) return true;
        if (change.op === "damage") damage += (change.instances ?? []).reduce((sum, instance) => sum + (Number(instance.amount) || 0), 0);
    }
    return damage > 0 && damage >= c.hp.value + (c.hp.temp ?? 0);
}
