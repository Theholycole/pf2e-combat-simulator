// U21 (2026-10-16; the item module's plan.item.activations[].triggerOn, U20's follow-up): items activated in answer to something, played as
// their trigger comes. First, a hit with a Strike ("after-strike": Dazing Coil, Firecracker Fulu, Putrescent Glob, Murderer's Knot) — the
// item's plan at the creature hit, when the trigger's degree, weapon ("affixed": a weapon, not an unarmed attack) and target (its
// condition — off-guard as the Strike found it —, trait, a foe) fit, and its activation's traits are allowed (a talisman's concentrate:
// not raging, not fascinated). A free action that costs nothing else: a monster uses one whenever it triggers; a PC (U1's rule) in a hard
// fight, as Eye of Apprehension (fortune-items.js hardFight). Each one used up.
import { DEGREE_NAMES } from "./checks.js";
import { isRaging } from "./abilities.js";
import { isActive } from "./combatant.js";
import { hardFight } from "./fortune-items.js";

const ready = (c, entry) => (c.spellPools?.[entry.pool] ?? 0) > 0;

// Whether the creature hit is the trigger's: { condition, trait, foe }. offGuard: as the Strike found it.
function targetFits(want, attacker, target, offGuard) {
    if (!want) return true;
    if (want.foe && target.side === attacker.side) return false;
    if (want.trait && !(target.traits ?? []).includes(want.trait)) return false;
    if (want.condition) {
        if (want.condition === "off-guard") return Boolean(offGuard);
        const held = target.cond?.[want.condition];
        if (!(held === true || Number(held) > 0)) return false;
    }
    return true;
}

// After a Strike's hit (degree: the attack's), the items it sets off. castPlan and traitsAllowed: the engine's (spells.js).
export function afterStrikeItems(state, attacker, target, strike, degree, { offGuard = false, castPlan, traitsAllowed, actionTraits }) {
    for (const entry of attacker.triggeredItems ?? []) {
        const on = entry.triggerOn;
        // (Not on a creature the hit took down.)
        if (on?.event !== "after-strike" || !ready(attacker, entry) || !isActive(target)) continue;
        if (!(on.degrees ?? ["success", "criticalSuccess"]).includes(DEGREE_NAMES[degree])) continue;
        if (on.weapon === "affixed" && strike.unarmed) continue;
        if (!targetFits(on.target, attacker, target, offGuard)) continue;
        if (!traitsAllowed(attacker, actionTraits(entry), { raging: isRaging(attacker) })) continue;
        if (attacker.kind === "pc" && !hardFight(state, attacker)) continue;
        attacker.spellPools[entry.pool] = Math.max(0, attacker.spellPools[entry.pool] - 1);
        if (state.stats) state.stats[attacker.side === "party" ? "partyItemsUsed" : "foeItemsUsed"]++;
        // (castPlan logs its use.)
        castPlan(state, attacker, entry, [target.id]);
    }
}
