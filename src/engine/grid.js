// The square grid (2026-10-21, the user: "build an option for grid based movement in the simulator for effects that rely on that. We
// should also add choke points to simulate situations where area spells are forced to be interacted with vs being able to stride
// around"; their choices: generated layouts and the Foundry scene, PF2e's positional rules in full, an option per run with the range
// bands the default). Pure geometry: maps, creatures' spaces, PF2e distances, paths, area templates, line of effect and cover, flanking,
// and the layouts. A fight on the grid keeps its creatures' squares (c.square: the top-left square of its space) and reads the rest
// from here.
//   Squares are [x, y] in 5-foot units; a creature's space is size × size squares (Tiny to Medium 1, Large 2, Huge 3, Gargantuan 4).
//   A map: { width, height, blocked: Set of "x,y" (walls, pillars, chasms: no one stands or moves there), walls: Set of "x,y|x,y"
//   (a wall between two orthogonal neighbours), difficult: Map of "x,y" → 2 (difficult) or 3 (greater difficult), spawns: { party,
//   foes: ["x,y" …] in order of who stands at the front }, name }.
//   (2026-10-22, the user's battlefields — battlefields.js:) heights: Map of "x,y" → the ground's height in feet (0 without one); footing:
//   Map of "x,y" → { kind: "uneven" | "narrow" | "incline", dc } (Balance, or Climb for an incline); climbDC: the DC to Climb between
//   heights; and more the fight reads (battlefields.js). A creature's z: the height in feet its space's bottom is at (its ground's, or
//   higher flying or climbing); creatures without one stand at 0.

import { sizeRank } from "./abilities.js";

export const SQUARE_FEET = 5;
const key = (x, y) => `${x},${y}`;
const unkey = (text) => text.split(",").map(Number);
const edge = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// The squares across a creature's space.
export function spaceOf(c) {
    const rank = sizeRank(c?.size);
    return rank <= 2 ? 1 : rank - 1;
}

// PF2e's count for dx squares across and dy down: every second diagonal 10 feet. (2026-10-22: and dz up — the same count again between
// the flat distance and the height.)
export function feetBetween(dx, dy, dz = 0) {
    const across = Math.abs(dx);
    const down = Math.abs(dy);
    const diagonal = Math.min(across, down);
    const flat = Math.max(across, down) + Math.floor(diagonal / 2);
    const up = Math.abs(dz);
    return SQUARE_FEET * (Math.max(flat, up) + Math.floor(Math.min(flat, up) / 2));
}

// (2026-10-22, heights.) The squares between two creatures' spaces upward: 0 when they overlap in height (on the same ground), else 1
// when one's bottom is at the other's top, and a square more each 5 feet between — a creature's space as tall as it's wide.
function zGap(a, b) {
    const za = Number(a?.z) || 0;
    const zb = Number(b?.z) || 0;
    if (za === zb) return 0;
    const ha = spaceOf(a) * SQUARE_FEET;
    const hb = spaceOf(b) * SQUARE_FEET;
    if (zb >= za + ha) return (zb - (za + ha)) / SQUARE_FEET + 1;
    if (za >= zb + hb) return (za - (zb + hb)) / SQUARE_FEET + 1;
    return 0;
}

// The squares between two spaces at their nearest ([dx, dy]: 1 when they touch).
function gap(a, b) {
    const [ax, ay] = a.square;
    const [bx, by] = b.square;
    const an = spaceOf(a);
    const bn = spaceOf(b);
    const dx = ax > bx + bn - 1 ? ax - (bx + bn - 1) : bx > ax + an - 1 ? bx - (ax + an - 1) : 0;
    const dy = ay > by + bn - 1 ? ay - (by + bn - 1) : by > ay + an - 1 ? by - (ay + an - 1) : 0;
    return [dx, dy];
}

// Feet between two creatures' spaces (5 when they're side by side), their heights counted.
export function distanceFeet(a, b) {
    const [dx, dy] = gap(a, b);
    return feetBetween(dx, dy, zGap(a, b));
}

// Whether `who` reaches `other` with `reach` feet (its own, by default): PF2e's 10-foot reach reaches two squares on the diagonal too.
export function reaches(who, other, reach = who?.reach ?? 5) {
    const [dx, dy] = gap(who, other);
    const dz = zGap(who, other);
    if (Math.max(dx, dy, dz) === 0) return true;
    if (reach >= 10 && reach < 15 && dx <= 2 && dy <= 2 && dz <= 2) return true;
    return feetBetween(dx, dy, dz) <= Math.max(5, reach);
}

// (2026-10-22, heights.) The ground's height under a space at [x, y] of n squares: the highest of its squares'.
export function groundZ(map, x, y, n = 1) {
    if (!map?.heights?.size) return 0;
    let top = -Infinity;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) top = Math.max(top, map.heights.get(key(x + i, y + j)) ?? 0);
    return top === -Infinity ? 0 : top;
}

// The footing under a space: the hardest of its squares' ({ kind, dc }), or null on firm ground.
export function footingAt(map, x, y, n = 1) {
    if (!map?.footing?.size) return null;
    let worst = null;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const here = map.footing.get(key(x + i, y + j));
        if (here && (!worst || (Number(here.dc) || 0) > (Number(worst.dc) || 0))) worst = here;
    }
    return worst;
}

// Whether a step between two heights is a climb (more than 5 feet up or down) for one that doesn't fly.
export const isClimb = (from, to) => Math.abs((Number(to) || 0) - (Number(from) || 0)) > SQUARE_FEET;

// The squares a space covers at [x, y], or null when one is off the map or blocked.
export function coveredSquares(map, x, y, n) {
    const out = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const sx = x + i;
        const sy = y + j;
        if (sx < 0 || sy < 0 || sx >= map.width || sy >= map.height || map.blocked?.has(key(sx, sy))) return null;
        out.push(key(sx, sy));
    }
    return out;
}

// Whether a step from [x, y] to [x + dx, y + dy] (one square, maybe diagonal) for a space of n crosses a wall: an orthogonal step crosses
// the walls along its side; a diagonal one both of its orthogonal ways (no cutting a wall's corner).
function crossesWall(map, x, y, dx, dy, n) {
    if (!map.walls?.size) return false;
    const through = (fx, fy, sx, sy) => {
        for (let i = 0; i < n; i++) {
            // The leading squares of the space across the step.
            if (sx !== 0) {
                const from = sx > 0 ? fx + n - 1 : fx;
                if (map.walls.has(edge(key(from, fy + i), key(from + sx, fy + i)))) return true;
            }
            if (sy !== 0) {
                const from = sy > 0 ? fy + n - 1 : fy;
                if (map.walls.has(edge(key(fx + i, from), key(fx + i, from + sy)))) return true;
            }
        }
        return false;
    };
    if (dx === 0 || dy === 0) return through(x, y, dx, dy);
    return through(x, y, dx, 0) || through(x + dx, y, 0, dy) || through(x, y, 0, dy) || through(x, y + dy, dx, 0);
}

// The cost to enter the squares a space covers: 5, 10 in difficult terrain, 15 in greater (the worst of them).
function enterCost(map, squares) {
    let factor = 1;
    for (const square of squares) factor = Math.max(factor, map.difficult?.get(square) ?? 1);
    return SQUARE_FEET * factor;
}

const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

// A binary heap of (cost, index) pairs, cheapest first.
function heap() {
    const costs = [];
    const indexes = [];
    const swap = (i, j) => {
        [costs[i], costs[j]] = [costs[j], costs[i]];
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    };
    return {
        get size() {
            return costs.length;
        },
        push(cost, index) {
            costs.push(cost);
            indexes.push(index);
            for (let i = costs.length - 1; i > 0;) {
                const parent = (i - 1) >> 1;
                if (costs[parent] <= costs[i]) break;
                swap(parent, i);
                i = parent;
            }
        },
        pop() {
            const top = [costs[0], indexes[0]];
            const lastCost = costs.pop();
            const lastIndex = indexes.pop();
            if (costs.length) {
                costs[0] = lastCost;
                indexes[0] = lastIndex;
                for (let i = 0; ;) {
                    const l = 2 * i + 1;
                    const r = l + 1;
                    let low = i;
                    if (l < costs.length && costs[l] < costs[low]) low = l;
                    if (r < costs.length && costs[r] < costs[low]) low = r;
                    if (low === i) break;
                    swap(low, i);
                    i = low;
                }
            }
            return top;
        }
    };
}

// Every place a creature can get to from its square: Map of "x,y" → { cost, ends } — the feet it takes (difficult terrain double,
// greater triple, every second diagonal 10), through its allies' spaces but not its foes' (blockedBy: a Set of the squares it can't
// enter), ending only where no one else stands (ends false where its space would take one of `occupied`'s squares); none past maxCost.
// Its wayTo(place): [{ square, cost } …] from the start along the cheapest way there.
// (2026-10-22, heights: a step more than 5 feet up or down is a climb for one that doesn't fly — each 5 feet of it a Climb action, its whole
// Speed's worth of feet here; an incline's square the same, a Climb to enter; uneven ground or a narrow surface difficult terrain — the
// Balance it takes. flying: over all of it, heights and footing as nothing.)
export function reachable(map, mover, { blockedBy = new Set(), occupied = new Set(), maxCost = Infinity, flying = false } = {}) {
    const n = spaceOf(mover);
    const width = map.width;
    const height = map.height;
    const cells = width * height;
    const climbFeet = Math.max(SQUARE_FEET, Number(mover.speed) || 25);
    const heights = !flying && map.heights?.size ? new Float64Array(cells) : null;
    // (Incorporeal, 2026-10-21: through walls, blocked squares and others' spaces — ending in none of them.)
    const through = (mover.traits ?? []).includes("incorporeal");
    // (Each top-left square: whether the space fits there, what entering it costs, whether it may end there.)
    const fits = new Uint8Array(cells);
    const enter = new Uint8Array(cells);
    const free = new Uint8Array(cells);
    for (let x = 0; x <= width - n; x++) {
        for (let y = 0; y <= height - n; y++) {
            let ok = 1;
            let factor = 1;
            let clear = 1;
            for (let i = 0; i < n && ok; i++) for (let j = 0; j < n; j++) {
                const square = key(x + i, y + j);
                if (map.blocked?.has(square) || blockedBy.has(square)) {
                    if (through) {
                        clear = 0;
                        continue;
                    }
                    ok = 0;
                    break;
                }
                factor = Math.max(factor, map.difficult?.get(square) ?? 1);
                const footing = flying ? null : map.footing?.get(square);
                if (footing?.kind === "incline") factor = Math.max(factor, climbFeet / SQUARE_FEET);
                else if (footing) factor = Math.max(factor, 2);
                if (occupied.has(square)) clear = 0;
            }
            const at = y * width + x;
            fits[at] = ok;
            enter[at] = Math.min(255, SQUARE_FEET * factor);
            free[at] = clear;
            if (heights) heights[at] = groundZ(map, x, y, n);
            // (Down a drop no one comes back from in this fight — Dropoff's chasm —: only a fall.)
            if (heights && map.fallOut && heights[at] < -map.fallOut) fits[at] = 0;
        }
    }
    // (States: the square and the parity of diagonals taken — the next diagonal's cost depends on it.)
    const cost = new Float64Array(cells * 2).fill(Infinity);
    const from = new Int32Array(cells * 2).fill(-1);
    const [sx, sy] = mover.square;
    const start = (sy * width + sx) * 2;
    cost[start] = 0;
    const queue = heap();
    queue.push(0, start);
    const walls = Boolean(map.walls?.size);
    while (queue.size) {
        const [here, state] = queue.pop();
        if (here > cost[state]) continue;
        const parity = state & 1;
        const cell = state >> 1;
        const x = cell % width;
        const y = (cell - x) / width;
        for (const [dx, dy] of STEPS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx > width - n || ny > height - n) continue;
            const next = ny * width + nx;
            if (!fits[next] || (walls && !through && crossesWall(map, x, y, dx, dy, n))) continue;
            const diagonal = dx !== 0 && dy !== 0;
            const rise = heights ? Math.abs(heights[next] - heights[cell]) : 0;
            const climb = rise > SQUARE_FEET ? Math.ceil(rise / SQUARE_FEET) * climbFeet : 0;
            const total = here + enter[next] + (diagonal && parity === 1 ? SQUARE_FEET : 0) + climb;
            if (total > maxCost) continue;
            const nextState = next * 2 + (diagonal ? 1 - parity : parity);
            if (cost[nextState] <= total) continue;
            cost[nextState] = total;
            from[nextState] = state;
            queue.push(total, nextState);
        }
    }
    const best = new Map();
    const bestState = new Map();
    for (let cell = 0; cell < cells; cell++) {
        const a = cost[cell * 2];
        const b = cost[cell * 2 + 1];
        if (a === Infinity && b === Infinity) continue;
        const x = cell % width;
        const y = (cell - x) / width;
        const place = key(x, y);
        const pick = a <= b ? cell * 2 : cell * 2 + 1;
        best.set(place, { cost: Math.min(a, b), ends: cell === sy * width + sx || free[cell] === 1 });
        bestState.set(place, pick);
    }
    best.wayTo = (place) => {
        const way = [];
        for (let state = bestState.get(place) ?? -1; state >= 0; state = from[state]) {
            const cell = state >> 1;
            const x = cell % width;
            way.unshift({ square: key(x, (cell - x) / width), cost: cost[state] });
            if (state === start) break;
        }
        return way;
    };
    return best;
}

// The way to a place in a reachable() map: ["x,y" …] from the start.
export function pathTo(found, place) {
    return found.wayTo(place).map((step) => step.square);
}

// The cheapest place a creature can stand where `goal(x, y)` holds: { place, cost, path } or null.
export function cheapestTo(map, mover, goal, options = {}) {
    const found = reachable(map, mover, options);
    let best = null;
    for (const [place, entry] of found) {
        if (!entry.ends) continue;
        const [x, y] = unkey(place);
        if (!goal(x, y)) continue;
        if (!best || entry.cost < best.cost) best = { place, cost: entry.cost };
    }
    return best ? { ...best, path: pathTo(found, best.place) } : null;
}

// --- Areas --------------------------------------------------------------------------------------------------------------------------

// A burst's squares: from a grid intersection [cx, cy] (the corner shared by squares cx−1..cx, cy−1..cy), those within radius feet.
export function burstSquares(map, cx, cy, radius) {
    const out = [];
    const span = Math.ceil(radius / SQUARE_FEET);
    for (let x = cx - span; x < cx + span; x++) for (let y = cy - span; y < cy + span; y++) {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
        const dx = x >= cx ? x - cx + 1 : cx - x;
        const dy = y >= cy ? y - cy + 1 : cy - y;
        if (feetBetween(dx, dy) <= radius) out.push(key(x, y));
    }
    return out;
}

// An emanation's squares: within radius feet of a creature's space (its own squares too).
export function emanationSquares(map, c, radius) {
    const out = [];
    const n = spaceOf(c);
    const [x0, y0] = c.square;
    const span = Math.ceil(radius / SQUARE_FEET);
    for (let x = x0 - span; x < x0 + n + span; x++) for (let y = y0 - span; y < y0 + n + span; y++) {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
        if (distanceFeet(c, { square: [x, y], size: "medium" }) <= radius || (x >= x0 && x < x0 + n && y >= y0 && y < y0 + n)) out.push(key(x, y));
    }
    return out;
}

// A cone's squares: from a creature's space toward an aim point (square units), within length feet and a quarter turn (45° either side).
export function coneSquares(map, c, aim, length) {
    const n = spaceOf(c);
    const [x0, y0] = c.square;
    const origin = [x0 + n / 2, y0 + n / 2];
    const angle = Math.atan2(aim[1] - origin[1], aim[0] - origin[0]);
    const out = [];
    const span = Math.ceil(length / SQUARE_FEET) + n;
    for (let x = x0 - span; x <= x0 + n + span; x++) for (let y = y0 - span; y <= y0 + n + span; y++) {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height || (x >= x0 && x < x0 + n && y >= y0 && y < y0 + n)) continue;
        const centre = [x + 0.5, y + 0.5];
        let turn = Math.abs(Math.atan2(centre[1] - origin[1], centre[0] - origin[0]) - angle);
        if (turn > Math.PI) turn = 2 * Math.PI - turn;
        if (turn > Math.PI / 4 + 1e-9) continue;
        if (distanceFeet(c, { square: [x, y], size: "medium" }) <= length) out.push(key(x, y));
    }
    return out;
}

// The squares a straight line from one point to another (square units) passes through, in order.
export function lineThrough(from, to) {
    const out = [];
    const steps = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) * 4));
    let last = null;
    for (let i = 0; i <= steps; i++) {
        const x = Math.floor(from[0] + (to[0] - from[0]) * i / steps);
        const y = Math.floor(from[1] + (to[1] - from[1]) * i / steps);
        const at = key(x, y);
        if (at !== last) out.push(at);
        last = at;
    }
    return out;
}

// A line's squares: 5 feet wide from a creature's space toward an aim point, length feet long (stopped by what blocks it).
export function lineSquares(map, c, aim, length) {
    const n = spaceOf(c);
    const origin = [c.square[0] + n / 2, c.square[1] + n / 2];
    const angle = Math.atan2(aim[1] - origin[1], aim[0] - origin[0]);
    const reachOut = n / 2 + length / SQUARE_FEET - 1e-6;
    const end = [origin[0] + Math.cos(angle) * reachOut, origin[1] + Math.sin(angle) * reachOut];
    const out = [];
    for (const square of lineThrough(origin, end)) {
        const [x, y] = unkey(square);
        if (x < 0 || y < 0 || x >= map.width || y >= map.height || map.blocked?.has(square)) break;
        if (x >= c.square[0] && x < c.square[0] + n && y >= c.square[1] && y < c.square[1] + n) continue;
        out.push(square);
    }
    return out;
}

// --- Seeing and flanking ------------------------------------------------------------------------------------------------------------

const centreOf = (c) => {
    const n = spaceOf(c);
    return [c.square[0] + n / 2, c.square[1] + n / 2];
};

// From one creature to another: { effect (false: a wall or a blocked square stands between: no line of effect), cover: 0, 1 (lesser:
// a creature between) or 2 (standard: a blocked square's corner or a wall it grazes) }, by the line between their spaces' centres.
export function sightLine(map, from, to, others = []) {
    const a = centreOf(from);
    const b = centreOf(to);
    const own = new Set([...occupiedBy(from), ...occupiedBy(to)]);
    const squares = lineThrough(a, b).filter((square) => !own.has(square));
    let cover = 0;
    for (const square of squares) if (map.blocked?.has(square)) return { effect: false, cover: 0 };
    // (A wall between two of its squares: blocked.)
    const all = lineThrough(a, b);
    for (let i = 1; i < all.length; i++) {
        const [x1, y1] = unkey(all[i - 1]);
        const [x2, y2] = unkey(all[i]);
        if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1 && map.walls?.has(edge(all[i - 1], all[i]))) return { effect: false, cover: 0 };
        if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 2 && (map.blocked?.has(key(x1, y2)) || map.blocked?.has(key(x2, y1)) || map.walls?.has(edge(all[i - 1], key(x1, y2))) || map.walls?.has(edge(all[i - 1], key(x2, y1))))) cover = 2;
    }
    // (2026-10-22, heights: ground higher than the line between their middles — a wall, a cliff — blocks it; within 5 feet under it, a
    // ledge's lip, standard cover. A parapet: standard cover for one behind it against those below.)
    if (map.heights?.size) {
        const za = (Number(from.z) || 0) + (spaceOf(from) * SQUARE_FEET) / 2;
        const zb = (Number(to.z) || 0) + (spaceOf(to) * SQUARE_FEET) / 2;
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        for (const square of squares) {
            const ground = map.heights.get(square) ?? 0;
            if (ground <= Math.min(za, zb) - SQUARE_FEET) continue;
            const [x, y] = unkey(square);
            const along = Math.min(1, Math.max(0, Math.hypot(x + 0.5 - a[0], y + 0.5 - a[1]) / length));
            const line = za + (zb - za) * along;
            if (ground >= line) return { effect: false, cover: 0 };
            if (ground > line - SQUARE_FEET) cover = 2;
        }
    }
    if (map.parapets?.size && (Number(from.z) || 0) < (Number(to.z) || 0) && occupiedBy(to).some((square) => map.parapets.has(square))) cover = 2;
    if (!cover) {
        const between = new Set(others.filter((other) => other !== from && other !== to && other.square).flatMap(occupiedBy));
        if (squares.some((square) => between.has(square))) cover = 1;
    }
    return { effect: true, cover };
}

// The squares a creature takes.
export function occupiedBy(c) {
    if (!c?.square) return [];
    const n = spaceOf(c);
    const out = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out.push(key(c.square[0] + i, c.square[1] + j));
    return out;
}

// Whether two creatures flank a third: the line between their spaces' centres passes through opposite sides, or opposite corners, of
// its space (PF2e).
export function flanks(a, b, target) {
    const [ax, ay] = centreOf(a);
    const [bx, by] = centreOf(b);
    const n = spaceOf(target);
    const [tx, ty] = target.square;
    const crossing = (along, at, lo, hi) => {
        // Where the line crosses x = at (along "x") or y = at, within [lo, hi] of the other.
        const [p, q, r, s] = along === "x" ? [ax, bx, ay, by] : [ay, by, ax, bx];
        if (p === q || (at - p) * (at - q) > 0) return false;
        const t = (at - p) / (q - p);
        const other = r + (s - r) * t;
        return other >= lo - 1e-9 && other <= hi + 1e-9;
    };
    const leftRight = crossing("x", tx, ty, ty + n) && crossing("x", tx + n, ty, ty + n);
    const topBottom = crossing("y", ty, tx, tx + n) && crossing("y", ty + n, tx, tx + n);
    return leftRight || topBottom;
}

// --- Layouts ------------------------------------------------------------------------------------------------------------------------

// A layout by name: "open" (a field), "corridor" (a 10-foot hall: a choke point the whole way), "doorway" (two rooms, a 5-foot door
// between), "bridge" (a 10-foot bridge over a chasm). The party starts at the left, the foes at the right, 30 feet apart in the open (the
// near band's distance: six squares between their fronts), their front ranks first in each side's spawns.
export const LAYOUTS = Object.freeze(["open", "corridor", "doorway", "bridge"]);
export function layout(name = "open") {
    const map = { name, width: 30, height: 20, blocked: new Set(), walls: new Set(), difficult: new Map(), spawns: { party: [], foes: [] } };
    const fill = (x0, y0, x1, y1) => {
        for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) map.blocked.add(key(x, y));
    };
    // Spawns: columns from the front back, rows from the middle out.
    const spawns = (front, step, rows) => {
        const out = [];
        for (let col = 0; col < 6; col++) for (const row of rows) out.push(key(front + step * col, row));
        return out;
    };
    const middleOut = (lo, hi) => {
        const mid = Math.floor((lo + hi) / 2);
        const out = [];
        for (let d = 0; out.length < hi - lo + 1; d++) {
            if (mid + d <= hi) out.push(mid + d);
            if (d > 0 && mid - d >= lo) out.push(mid - d);
        }
        return out;
    };
    if (name === "corridor") {
        map.height = 6;
        map.width = 40;
        fill(0, 0, 39, 1);
        fill(0, 4, 39, 5);
        map.spawns.party = spawns(16, -1, [2, 3]);
        map.spawns.foes = spawns(22, 1, [2, 3]);
    } else if (name === "doorway") {
        // A wall down the middle (x 15), its door the square at y 9.
        fill(15, 0, 15, 8);
        fill(15, 10, 15, 19);
        map.spawns.party = spawns(12, -1, middleOut(5, 14));
        map.spawns.foes = spawns(18, 1, middleOut(5, 14));
    } else if (name === "bridge") {
        // Banks at either end, a 20-foot chasm between (x 13–16) but for a 10-foot bridge (y 9–10).
        fill(13, 0, 16, 8);
        fill(13, 11, 16, 19);
        map.spawns.party = spawns(12, -1, middleOut(6, 13));
        map.spawns.foes = spawns(18, 1, middleOut(6, 13));
    } else {
        map.spawns.party = spawns(12, -1, middleOut(5, 14));
        map.spawns.foes = spawns(18, 1, middleOut(5, 14));
    }
    return map;
}

// Squares for a side's creatures, in order (each list: its creatures, front first): the first spawn its whole space fits at, clear of
// those placed before. { id: [x, y] }.
export function placeSide(map, creatures, spawns, taken = new Set()) {
    const out = {};
    for (const c of creatures) {
        const n = spaceOf(c);
        for (const spawn of spawns) {
            const [x, y] = unkey(spawn);
            const squares = coveredSquares(map, x, y, n);
            if (!squares || squares.some((square) => taken.has(square))) continue;
            for (const square of squares) taken.add(square);
            out[c.id] = [x, y];
            break;
        }
    }
    return out;
}

export { key as squareKey, unkey as squareOf };
