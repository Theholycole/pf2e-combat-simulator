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

// PF2e's count for dx squares across and dy down: every second diagonal 10 feet.
export function feetBetween(dx, dy) {
    const across = Math.abs(dx);
    const down = Math.abs(dy);
    const diagonal = Math.min(across, down);
    return SQUARE_FEET * (Math.max(across, down) + Math.floor(diagonal / 2));
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

// Feet between two creatures' spaces (5 when they're side by side).
export function distanceFeet(a, b) {
    const [dx, dy] = gap(a, b);
    return feetBetween(dx, dy);
}

// Whether `who` reaches `other` with `reach` feet (its own, by default): PF2e's 10-foot reach reaches two squares on the diagonal too.
export function reaches(who, other, reach = who?.reach ?? 5) {
    const [dx, dy] = gap(who, other);
    if (Math.max(dx, dy) === 0) return true;
    if (reach >= 10 && reach < 15 && dx <= 2 && dy <= 2) return true;
    return feetBetween(dx, dy) <= Math.max(5, reach);
}

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

// A small binary heap of [cost, …] entries, cheapest first.
function heap() {
    const items = [];
    return {
        get size() {
            return items.length;
        },
        push(entry) {
            items.push(entry);
            for (let i = items.length - 1; i > 0;) {
                const parent = (i - 1) >> 1;
                if (items[parent][0] <= items[i][0]) break;
                [items[parent], items[i]] = [items[i], items[parent]];
                i = parent;
            }
        },
        pop() {
            const top = items[0];
            const last = items.pop();
            if (items.length) {
                items[0] = last;
                for (let i = 0; ;) {
                    const l = 2 * i + 1;
                    const r = l + 1;
                    let low = i;
                    if (l < items.length && items[l][0] < items[low][0]) low = l;
                    if (r < items.length && items[r][0] < items[low][0]) low = r;
                    if (low === i) break;
                    [items[low], items[i]] = [items[i], items[low]];
                    i = low;
                }
            }
            return top;
        }
    };
}

// Every place a creature can get to from its square: Map of "x,y" → { cost, from, ends } — the feet it takes (difficult terrain double,
// greater triple, every second diagonal 10), through its allies' spaces but not its foes' (blockedBy: a Set of the squares it can't
// enter), ending only where no one else stands (ends false where its space would take one of `occupied`'s squares). maxCost: none past
// it. from: the place before it on the cheapest way.
export function reachable(map, mover, { blockedBy = new Set(), occupied = new Set(), maxCost = Infinity } = {}) {
    const n = spaceOf(mover);
    const [sx, sy] = mover.square;
    // (States by square and the parity of diagonals taken: the next diagonal's cost depends on it.)
    const states = new Map([[`${key(sx, sy)}|0`, { cost: 0, from: null }]]);
    const best = new Map([[key(sx, sy), { cost: 0, from: null, state: `${key(sx, sy)}|0`, ends: true }]]);
    const queue = heap();
    queue.push([0, sx, sy, 0]);
    while (queue.size) {
        const [cost, x, y, parity] = queue.pop();
        const here = `${key(x, y)}|${parity}`;
        if ((states.get(here)?.cost ?? Infinity) < cost) continue;
        for (const [dx, dy] of STEPS) {
            const nx = x + dx;
            const ny = y + dy;
            const squares = coveredSquares(map, nx, ny, n);
            if (!squares || squares.some((square) => blockedBy.has(square)) || crossesWall(map, x, y, dx, dy, n)) continue;
            const diagonal = dx !== 0 && dy !== 0;
            const total = cost + enterCost(map, squares) + (diagonal && parity === 1 ? SQUARE_FEET : 0);
            if (total > maxCost) continue;
            const nextParity = diagonal ? 1 - parity : parity;
            const state = `${key(nx, ny)}|${nextParity}`;
            if ((states.get(state)?.cost ?? Infinity) <= total) continue;
            states.set(state, { cost: total, from: here });
            queue.push([total, nx, ny, nextParity]);
            const known = best.get(key(nx, ny));
            if (!known || known.cost > total) best.set(key(nx, ny), { cost: total, state, ends: !squares.some((square) => occupied.has(square)) });
        }
    }
    for (const entry of best.values()) entry.from = entry.state;
    best.states = states;
    return best;
}

// The way to a place in a reachable() map: ["x,y" …] from the start.
export function pathTo(found, place) {
    const path = [];
    for (let at = found.get(place)?.state; at; at = found.states.get(at)?.from) path.unshift(at.split("|")[0]);
    return path;
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
