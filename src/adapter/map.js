// Map objectives on the scene (O1–O3): distances between grid squares, pure
// so they can be tested without Foundry.

// Feet between two squares ({ i: row, j: column }) on a square grid, by
// PF2e's diagonal rule (5, 10, 5, 10…).
export function squareFeet(a, b, gridFeet = 5) {
    const di = Math.abs(a.i - b.i);
    const dj = Math.abs(a.j - b.j);
    const diagonal = Math.min(di, dj);
    const straight = Math.max(di, dj) - diagonal;
    return (straight + diagonal + Math.floor(diagonal / 2)) * gridFeet;
}

// The fewest feet from any square of one set to any square of the other (0 when they overlap).
export function nearestFeet(from, to, gridFeet = 5, feet = squareFeet) {
    if (!from.length || !to.length) return null;
    const inside = new Set(to.map((square) => `${square.i},${square.j}`));
    let best = Infinity;
    for (const square of from) {
        if (inside.has(`${square.i},${square.j}`)) return 0;
        for (const other of to) best = Math.min(best, feet(square, other, gridFeet));
    }
    return best;
}

// Rounds held so far, from the round-by-round record ({ round: true | false }).
export const heldRounds = (record) => Object.values(record ?? {}).filter(Boolean).length;

// The record at a new round: rounds from it on are dropped (the GM went back), and the
// round just ended is counted if it isn't already. held: whether the party held the area just now.
export function recordRound(record, round, held) {
    const next = Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => Number(key) < round));
    if (round >= 2 && next[round - 1] === undefined) next[round - 1] = held;
    return next;
}

// From inside a Region, the fewest feet to a square outside it (0 when outside).
export function edgeFeet(from, region, gridFeet = 5, feet = squareFeet) {
    const inside = new Set(region.map((square) => `${square.i},${square.j}`));
    if (!from.some((square) => inside.has(`${square.i},${square.j}`))) return 0;
    let best = Infinity;
    for (let radius = 1; radius <= 200 && radius * gridFeet < best; radius++) {
        for (const square of from) {
            for (let di = -radius; di <= radius; di++) {
                for (const dj of Math.abs(di) === radius ? range(-radius, radius) : [-radius, radius]) {
                    const other = { i: square.i + di, j: square.j + dj };
                    if (!inside.has(`${other.i},${other.j}`)) best = Math.min(best, feet(square, other, gridFeet));
                }
            }
        }
    }
    return best;
}

function range(from, to) {
    const list = [];
    for (let value = from; value <= to; value++) list.push(value);
    return list;
}
