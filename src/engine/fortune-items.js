// U11 (2026-10-15; the user: "add gorum's tear and eye of apprehension to the simulator"): the item module's "roll-twice" talismans, used as
// free actions when they trigger, each one used up:
//   Gorum's Tear (selector "attack-roll"): an attack with the affixed weapon rolled twice, the better kept, ignoring circumstance penalties;
//     then the user is off-guard to the creature it attacked until its next turn starts.
//   Eye of Apprehension (selector "initiative"): Perception for initiative rolled twice, the higher used (a master in Perception, which the
//     snapshot checks).
// A monster uses one whenever it helps; a PC (U1's rule) only when it's worth the consumable margin more than it costs: Gorum's Tear when what
// rolling twice adds to the attack outweighs the off-guard by that much, Eye of Apprehension in a hard fight (the foes would last at least
// two thirds as long as its side).
import { degreeOf, CRITICAL_SUCCESS, SUCCESS } from "./checks.js";
import { CONSUMABLE_MARGIN } from "./consumables.js";
import { log } from "./log.js";

// (A hard fight: the foes last at least two thirds as long as the PC's side.)
export const HARD_FIGHT = 2 / 3;
const margin = (state, c) => (c.kind === "pc" ? Math.max(1, Number(state.options?.consumableMargin) || CONSUMABLE_MARGIN) : 1);
const ready = (c, entry) => (c.spellPools?.[entry.pool] ?? 0) > 0;

function spend(state, c, entry, what) {
    c.spellPools[entry.pool] = Math.max(0, (c.spellPools[entry.pool] ?? 0) - 1);
    if (state.stats) state.stats[c.side === "party" ? "partyItemsUsed" : "foeItemsUsed"]++;
    log(state, `  ${c.name} uses ${entry.name}: ${what}`);
}

// The expected damage of an attack at this modifier against this AC, rolled once or twice (the higher kept). damage: [hit, critical].
function expected(modifier, ac, damage, twice) {
    let sum = 0;
    for (let natural = 1; natural <= 20; natural++) {
        const chance = twice ? (2 * natural - 1) / 400 : 1 / 20;
        const degree = degreeOf(natural + modifier, ac, natural);
        sum += chance * (degree === CRITICAL_SUCCESS ? damage[1] : degree === SUCCESS ? damage[0] : 0);
    }
    return sum;
}

// Before an attack roll (not a reaction's, nor one already rolled twice): the attack-roll talisman it uses, or null. modifier: the attack's,
// circumstance: the circumstance penalties it would ignore, ac, damage: [hit, critical] expected.
export function attackFortune(state, attacker, target, strike, { modifier, circumstance = 0, ac, damage }) {
    const entry = (attacker.fortuneItems ?? []).find((item) => item.selector === "attack-roll" && ready(attacker, item) && (!item.weapon || !strike.unarmed));
    if (!entry) return null;
    const freed = entry.ignoreCircumstance ? circumstance : 0;
    const gain = expected(modifier + freed, ac, damage, true) - expected(modifier, ac, damage, false);
    if (gain <= 0) return null;
    // (Off-guard to the target until its next turn: about a tenth of a round of the target's damage more, if it's beside it.)
    const cost = entry.offGuardAfter ? 0.1 * (state.threat?.get(target.id) ?? 0) * (attacker.meleeId !== null && attacker.meleeId === target.meleeId ? 1 : 0.5) : 0;
    const worth = (gain / Math.max(1, target.hp.value)) * Math.max(1, state.threat?.get(target.id) ?? 1);
    const price = (cost / Math.max(1, attacker.hp.value)) * Math.max(1, state.threat?.get(attacker.id) ?? 1);
    if (worth <= price * margin(state, attacker)) return null;
    spend(state, attacker, entry, "rolls twice, the better kept");
    return { entry, bonus: freed };
}

// After the attack: Gorum's Tear's off-guard to that creature, until the user's next turn starts.
export function afterAttackFortune(state, attacker, target, used) {
    if (!used?.entry.offGuardAfter) return;
    const entry = { attacker: target.id, attacks: "all", uses: Infinity };
    attacker.offGuardTo = [...(attacker.offGuardTo ?? []), entry];
    (attacker.timers ??= []).push({ offGuardTo: entry, round: state.round + 1, turnOf: attacker.id, at: "start" });
    log(state, `  ${attacker.name} is off-guard to ${target.name} (${used.entry.name})`);
}

// As initiative is rolled: whether it rolls twice (an initiative talisman it uses).
export function initiativeFortune(state, c) {
    const entry = (c.fortuneItems ?? []).find((item) => item.selector === "initiative" && ready(c, item));
    if (!entry) return false;
    // (A PC's: in a hard fight — the foes would last against its side's damage at least HARD_FIGHT of the time its side lasts against
    // theirs. Nothing else competes with it as initiative is rolled, so the margin doesn't apply: it's the fight that has to be worth it.)
    if (c.kind === "pc") {
        const foes = c.side === "party" ? "foes" : "party";
        const members = (side) => state.list.filter((other) => other.side === side && other.status === "active");
        const hp = (side) => members(side).reduce((sum, other) => sum + other.hp.value + (other.hp.temp ?? 0), 0);
        const damage = (side) => Math.max(1, members(side).reduce((sum, other) => sum + (state.threat?.get(other.id) ?? 0), 0));
        if (hp(foes) / damage(c.side) < HARD_FIGHT * (hp(c.side) / damage(foes))) return false;
    }
    spend(state, c, entry, "rolls initiative twice, the higher kept");
    return true;
}
