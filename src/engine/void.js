// Sky and Underwater (2026-10-22, the user: "an additional battlefield with nothing in it at all, not even a floor. That last one would be
// used in pure flying battles or underwater battles"; their choices: in the sky, a creature without a fly Speed falls out of the fight;
// under water, PF2e's aquatic rules). The grid's map has void "sky" or "water" (battlefields.js); the rest of the grid as ever, on one
// level.
//   Sky: everyone Flies at its fly Speed; one that doesn't fly (or no longer can) falls out of the fight. PF2e's Fly: airborne at the end
// of its turn without a Fly action that turn, it falls — so each turn one action goes to Flying, a Stride's or a hover's.
//   Underwater: everyone Swims — at its swim Speed, or by Swim (Athletics against DC 10, calm water: 10 feet, 5 more for each 20 feet of
// Speed past 20, 5 more on a critical success; a critical failure costs a round of air). Off-guard without a swim Speed; resistance 5 to
// acid and fire; melee Strikes dealing bludgeoning or slashing damage at −2 without a swim Speed; ranged ones dealing bludgeoning or
// slashing miss, piercing ones' range increments halved; nothing with the fire trait. An air-breather holds its breath: 5 + its
// Constitution modifier rounds, 1 off as each of its turns ends (2 when it attacked or cast a spell that turn), 1 off each time it's
// critically hit; speaking (a linguistic action) loses all of it. Out of air, it's unconscious and drowning: out of the fight.

import { degreeOf, CRITICAL_FAILURE, CRITICAL_SUCCESS, SUCCESS } from "./checks.js";
import { isActive } from "./combatant.js";
import { fliesNow } from "./space.js";
import { skillValue } from "./spells.js";
import { log } from "./log.js";

const SWIM_DC = 10;
const BREATHES_WATER = ["aquatic", "amphibious"];
const BREATHLESS = ["undead", "construct"];

const voidOf = (state) => state.grid?.void ?? null;
const physical = (strike) => strike.damage?.[0]?.type ?? null;

// A Strike under water: none with the fire trait; ranged, none dealing bludgeoning or slashing, a piercing one's range increments halved;
// melee bludgeoning or slashing at −2 without a swim Speed.
function underwaterStrike(c, strike) {
    const type = physical(strike);
    if ((strike.traits ?? []).includes("fire") || type === "fire") return { ...strike, underwaterBlocked: true };
    if (!strike.melee) {
        if (type === "bludgeoning" || type === "slashing") return { ...strike, underwaterBlocked: true };
        return strike.increment ? { ...strike, increment: strike.increment / 2 } : strike;
    }
    if ((type === "bludgeoning" || type === "slashing") && !(c.swimSpeed > 0)) return { ...strike, bonus: strike.bonus - 2 };
    return strike;
}

// Resistance of a type at least `value` (PF2e: the higher of two of the same type, not both).
function withResistance(list, type, value) {
    const own = (list ?? []).filter((entry) => entry.type === type);
    if (own.some((entry) => (Number(entry.value) || 0) >= value && !(entry.exceptions ?? []).length)) return list ?? [];
    return [...(list ?? []).filter((entry) => entry.type !== type || (entry.exceptions ?? []).length), { type, value, exceptions: [] }];
}

// Whether a creature holds its breath under water.
export const holdsBreath = (c) => !(c.traits ?? []).some((trait) => BREATHES_WATER.includes(trait) || BREATHLESS.includes(trait));

// A creature in the void as it comes into the fight (at the start, or arriving): its Speed and, under water, the water's rules.
export function voidJoin(state, c) {
    const kind = voidOf(state);
    if (!kind || c.voidJoined || c.kind === "object") return;
    c.voidJoined = true;
    if (kind === "sky") {
        if (c.flySpeed > 0) c.speed = c.flySpeed;
        return;
    }
    c.inWater = true;
    const land = Math.max(5, Number(c.speed) || 25);
    if (c.swimSpeed > 0) c.speed = c.swimSpeed;
    else {
        c.swimCheck = true;
        c.speed = 10 + Math.max(0, Math.floor((land - 20) / 20)) * 5;
    }
    if (holdsBreath(c)) c.air = c.airMax = 5 + (Number.isFinite(c.con) ? c.con : 2);
    c.resistances = withResistance(withResistance(c.resistances, "acid", 5), "fire", 5);
    c.strikes = (c.strikes ?? []).map((strike) => underwaterStrike(c, strike));
}

// The fight's start: everyone in it, and in the sky those that can't fly fall out (leaveField: actions.js's).
export function voidStart(state, { leaveField }) {
    if (!voidOf(state)) return;
    for (const c of state.list) if (c.status !== "pending") voidJoin(state, c);
    skyFalls(state, { leaveField });
}

// In the sky: whoever doesn't fly (never could, or brought down — Earthbind) falls out of the fight.
export function skyFalls(state, { leaveField }) {
    if (voidOf(state) !== "sky") return;
    for (const c of state.list) {
        if (!isActive(c) || c.kind === "object" || fliesNow(c)) continue;
        log(state, `  ${c.name} can't fly`);
        leaveField(state, c, { fell: true });
    }
}

// Sky, as a flier's turn starts: an action of its turn to Fly (given back by a Stride — actions.js gridStride —, which is its Fly).
export function hoverTurnStart(state, c) {
    if (voidOf(state) !== "sky" || !fliesNow(c) || !(c.actionsLeft > 0)) return;
    c.actionsLeft -= 1;
    c.hoverDue = true;
}

// Its Fly done by a Stride: the hover's action back.
export function flewThisTurn(c) {
    if (!c.hoverDue) return;
    c.hoverDue = false;
    c.actionsLeft += 1;
}

// Swim (under water, without a swim Speed): the feet it swims this action, or null when it makes no headway.
export function swimCheck(state, c) {
    if (!c.swimCheck) return undefined;
    const natural = state.rng.d20();
    const degree = degreeOf(natural + skillValue(c, "athletics"), SWIM_DC, natural);
    if (degree >= SUCCESS) return c.speed + (degree === CRITICAL_SUCCESS ? 5 : 0);
    if (degree === CRITICAL_FAILURE && c.air !== undefined) c.air -= 1;
    log(state, `  ${c.name} Swims: ${degree === CRITICAL_FAILURE ? "critical failure" : "no headway"}`);
    return null;
}

// Its breath as its turn ends (2 when it attacked or cast a spell this turn), out of air: unconscious, drowning — out of the fight.
export function breathTurnEnd(state, c, { leaveField }) {
    if (c.air === undefined || !isActive(c)) return;
    const busy = (c.attacksThisTurn ?? 0) > 0 || c.lastCast?.round === state.round;
    c.air -= busy ? 2 : 1;
    if (c.air > 0) {
        if (c.air <= 2) log(state, `  ${c.name} has ${c.air} round${c.air === 1 ? "" : "s"} of air left`);
        return;
    }
    breathOut(state, c, { leaveField });
}

// Out of air: unconscious and drowning.
export function breathOut(state, c, { leaveField }) {
    if (!isActive(c)) return;
    c.air = 0;
    log(state, `  ${c.name} runs out of air`);
    if (c.kind === "pc") c.everDown = true;
    leaveField(state, c, { fell: true, drowned: true });
}

// Air lost to a critical hit, or to speaking (a linguistic action: all of it).
export function airLost(state, c, { all = false } = {}) {
    if (c.air === undefined) return;
    c.air = all ? 0 : c.air - 1;
}
