// Range bands: engaged (inside a Melee), near, far and gone.
//
// A Melee is a set of creatures from both sides who can all reach each other.
// Joining one takes a Stride; leaving one takes a Step or a Stride.

//   On the grid (2026-10-21, grid-fight.js): creatures keep squares, and those who reach one another are in each other's Melee — the
// Melees and bands follow from the squares after every move.

import { isActive } from "./combatant.js";
import { distanceFeet, reaches } from "./grid.js";
import { placeBeside, planStep, regroup } from "./grid-fight.js";

export const DISTANCE_FEET = Object.freeze({ engaged: 5, near: 30, far: 60 });

// (On the grid: one reaches the other.)
export function sameMelee(a, b) {
    if (a?.square && b?.square) return a !== b && (reaches(a, b) || reaches(b, a));
    return a.meleeId !== null && a.meleeId === b.meleeId;
}

const gridNeighbours = (state, c, enemies) => state.list.filter((other) => other !== c && (enemies ? other.side !== c.side : other.side === c.side) && isActive(other) && other.square && sameMelee(c, other));

export function engagedEnemies(state, c) {
    if (state.grid && c.square) return gridNeighbours(state, c, true);
    if (c.meleeId === null) return [];
    const members = state.melees.get(c.meleeId);
    if (!members) return [];
    const result = [];
    for (const id of members) {
        const other = state.byId.get(id);
        if (other.side !== c.side && isActive(other)) result.push(other);
    }
    return result;
}

export function engagedAllies(state, c) {
    if (state.grid && c.square) return gridNeighbours(state, c, false);
    if (c.meleeId === null) return [];
    const members = state.melees.get(c.meleeId);
    if (!members) return [];
    const result = [];
    for (const id of members) {
        const other = state.byId.get(id);
        if (other !== c && other.side === c.side && isActive(other)) result.push(other);
    }
    return result;
}

function dissolveIfOneSided(state, meleeId) {
    const members = state.melees.get(meleeId);
    if (!members) return;
    const sides = new Set();
    for (const id of members) {
        const member = state.byId.get(id);
        if (isActive(member)) sides.add(member.side);
    }
    if (sides.size >= 2) return;
    for (const id of members) {
        const member = state.byId.get(id);
        member.meleeId = null;
        if (member.band === "engaged") member.band = "near";
    }
    state.melees.delete(meleeId);
}

export function leaveMelee(state, c, band = "near") {
    // (On the grid its square says where it is: only leaving the field changes that; its Melee follows its square.)
    if (state.grid && c.square) {
        c.band = band === "gone" ? "gone" : c.band === "gone" ? "near" : c.band;
        regroup(state);
        return;
    }
    if (c.meleeId !== null) {
        const meleeId = c.meleeId;
        state.melees.get(meleeId)?.delete(c.id);
        c.meleeId = null;
        // Where an item carrier fell (map objectives).
        c.lastMeleeId = meleeId;
        dissolveIfOneSided(state, meleeId);
    }
    c.band = band;
}

export function engage(state, c, target) {
    // (On the grid: at once beside it — a teleport, an arrival into its Melee; a Stride takes its way, grid-fight.js.)
    if (state.grid && c.square && target.square) {
        if (!sameMelee(c, target)) placeBeside(state, c, target);
        return;
    }
    if (c.meleeId !== null && c.meleeId === target.meleeId) return;
    if (c.meleeId !== null) leaveMelee(state, c, "near");
    let meleeId = target.meleeId;
    if (meleeId === null) {
        meleeId = state.nextMeleeId++;
        state.melees.set(meleeId, new Set([target.id]));
        target.meleeId = meleeId;
        target.band = "engaged";
    }
    state.melees.get(meleeId).add(c.id);
    c.meleeId = meleeId;
    c.band = "engaged";
}

// Called when a creature stops being active (down, dead, fled, surrendered).
export function removeFromSpace(state, c, band) {
    leaveMelee(state, c, band ?? (c.band === "engaged" ? "near" : c.band));
}

// Map objectives: how far apart two creatures are at least, from their
// distances to the area and the exit (0 without a map objective).
export function mapGap(a, b) {
    if (a.areaFeet === undefined || b.areaFeet === undefined) return 0;
    return Math.max(Math.abs(a.areaFeet - b.areaFeet), Math.abs(a.exitFeet - b.exitFeet));
}

// Distance in feet between two creatures for range increments.
export function distanceBetween(a, b) {
    if (a?.square && b?.square) return distanceFeet(a, b);
    if (sameMelee(a, b)) return DISTANCE_FEET.engaged;
    const band = a.band === "far" || b.band === "far" ? DISTANCE_FEET.far : DISTANCE_FEET.near;
    return Math.max(band, mapGap(a, b));
}

// Range increments, plus volley's −2 against close targets. null: out of range.
export function rangePenalty(strike, distance) {
    if (!strike.increment) return 0;
    const increments = Math.max(1, Math.ceil(distance / strike.increment));
    if (increments > 6) return null;
    const volley = strike.volley && distance <= strike.volley ? 2 : 0;
    // (2026-10-16: no penalty out to rangeFree increments — Sniper's Bead.)
    return (strike.rangeFree && increments <= strike.rangeFree ? 0 : 2 * (increments - 1)) + volley;
}

// Strides needed to engage the target from the attacker's current band; with
// a map objective, at least those its distance on the map takes.
// Flying (2026-10-21, the user's foe traits: flying and incorporeal). A creature flies by its own fly Speed or an effect's (Fly's).
// (Earthbind, 2026-10-22: brought down — landed until its own next turn, when it can take off again; grounded, it can't fly at all while
// that lasts.)
export const fliesNow = (c) => (Boolean(c?.flies) || (c?.effects ?? []).some((effect) => effect.model?.flies)) && !c?.cond?.grounded && !c?.cond?.landed;

// Incorporeal (2026-10-21, the user: "They should always have the option to fly into the floor for safety but gain slowed 1 if they end in
// the floor/wall"; PF2e's trait): it passes through solid things — on the grid, walls, blocked squares and others' spaces, ending in none
// of them (grid.js reachable) — and can sink into the floor or a wall as a Stride: there it is out of everyone's reach and sight, and they
// out of its (c.insideObject; isActive is false). Starting a turn inside, it's slowed 1 and comes out with its first move; staying in
// from one turn to the next (the user: "Long stay = fled") is leaving the fight (fight.js insideTurnStart). The other side waits it out.
export const isIncorporeal = (c) => (c?.traits ?? []).includes("incorporeal");

// Aloft: a flier in no Melee (not prone, held or immobilized) — out of reach of a creature that doesn't fly; it comes down to Strike, and
// can be struck while it's in a Melee.
export function aloft(c) {
    return fliesNow(c) && (c.meleeId === null || c.meleeId === undefined) && !c.cond?.prone && !c.cond?.grabbed && !c.cond?.restrained && !c.cond?.immobilized && !c.cond?.paralyzed;
}

export function stridesToEngage(attacker, target) {
    if (sameMelee(attacker, target)) return 0;
    // (Aloft, out of reach of one that doesn't fly: none.)
    if (!fliesNow(attacker) && aloft(target)) return Infinity;
    const attackerFar = attacker.band === "far";
    const targetFar = target.band === "far";
    const bands = attackerFar === targetFar || (attacker.speed ?? 25) >= 50 ? 1 : 2;
    const gap = mapGap(attacker, target) - Math.max(5, attacker.reach ?? 5);
    return gap > 0 ? Math.max(bands, Math.ceil(gap / Math.max(5, attacker.speed ?? 25))) : bands;
}

// Flanking chance by the number of able enemies engaged with the target.
export function flankChance(state, count) {
    const table = state.options.flankChances;
    if (count <= 1) return 0;
    return table[Math.min(count, table.length - 1)];
}

// Steps leave a Melee only if no engaged enemy has reach over 5 feet. (On the grid: a square 5 feet off out of every foe's reach.)
export function canStepOut(state, c) {
    if (state.grid && c.square) return engagedEnemies(state, c).length > 0 && planStep(state, c) !== null;
    if (c.meleeId === null) return false;
    return engagedEnemies(state, c).every((enemy) => (enemy.reach ?? 5) <= 5);
}
