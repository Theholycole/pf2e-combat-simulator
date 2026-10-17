// Range bands: engaged (inside a Melee), near, far and gone.
//
// A Melee is a set of creatures from both sides who can all reach each other.
// Joining one takes a Stride; leaving one takes a Step or a Stride.

import { isActive } from "./combatant.js";

export const DISTANCE_FEET = Object.freeze({ engaged: 5, near: 30, far: 60 });

export function sameMelee(a, b) {
    return a.meleeId !== null && a.meleeId === b.meleeId;
}

export function engagedEnemies(state, c) {
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
export function stridesToEngage(attacker, target) {
    if (sameMelee(attacker, target)) return 0;
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

// Steps leave a Melee only if no engaged enemy has reach over 5 feet.
export function canStepOut(state, c) {
    if (c.meleeId === null) return false;
    return engagedEnemies(state, c).every((enemy) => (enemy.reach ?? 5) <= 5);
}
