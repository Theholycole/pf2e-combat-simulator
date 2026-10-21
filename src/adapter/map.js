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

// --- The scene as a grid for a fight (2026-10-21, src/engine/grid.js) ------------------------------------------------------------------

// Whether segment a–b crosses segment c–d (touching counts).
function crosses([ax, ay], [bx, by], [cx, cy], [dx, dy]) {
    const side = (px, py, qx, qy, rx, ry) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
    const d1 = side(cx, cy, dx, dy, ax, ay);
    const d2 = side(cx, cy, dx, dy, bx, by);
    const d3 = side(ax, ay, bx, by, cx, cy);
    const d4 = side(ax, ay, bx, by, dx, dy);
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
    const on = (px, py, qx, qy, rx, ry) => Math.min(px, qx) - 1e-9 <= rx && rx <= Math.max(px, qx) + 1e-9 && Math.min(py, qy) - 1e-9 <= ry && ry <= Math.max(py, qy) + 1e-9;
    return (d1 === 0 && on(cx, cy, dx, dy, ax, ay)) || (d2 === 0 && on(cx, cy, dx, dy, bx, by)) || (d3 === 0 && on(ax, ay, bx, by, cx, cy)) || (d4 === 0 && on(ax, ay, bx, by, dx, dy));
}

// The walls between squares a scene's walls make: "x,y|x,y" for each two side-by-side squares whose centres' line a wall crosses.
// segments: [[x0, y0, x1, y1] …] in pixels; frame: { size (pixels a square), x, y (the pixels of square 0,0's corner), width, height }.
export function wallEdges(segments, frame) {
    const edges = new Set();
    const centre = (x, y) => [frame.x + (x + 0.5) * frame.size, frame.y + (y + 0.5) * frame.size];
    const key = (x, y) => `${x},${y}`;
    for (const [x0, y0, x1, y1] of segments) {
        const lo = [Math.floor((Math.min(x0, x1) - frame.x) / frame.size) - 1, Math.floor((Math.min(y0, y1) - frame.y) / frame.size) - 1];
        const hi = [Math.floor((Math.max(x0, x1) - frame.x) / frame.size) + 1, Math.floor((Math.max(y0, y1) - frame.y) / frame.size) + 1];
        for (let x = Math.max(0, lo[0]); x <= Math.min(frame.width - 1, hi[0]); x++) {
            for (let y = Math.max(0, lo[1]); y <= Math.min(frame.height - 1, hi[1]); y++) {
                for (const [nx, ny] of [[x + 1, y], [x, y + 1]]) {
                    if (nx >= frame.width || ny >= frame.height) continue;
                    if (!crosses(centre(x, y), centre(nx, ny), [x0, y0], [x1, y1])) continue;
                    const a = key(x, y);
                    const b = key(nx, ny);
                    edges.add(a < b ? `${a}|${b}` : `${b}|${a}`);
                }
            }
        }
    }
    return [...edges];
}

// Spawns about a side's squares: their own, then the rings around them, nearest first (for a creature without a token: a familiar, a
// summon).
export function spawnsAround(squares, width, height, rings = 3) {
    const out = [];
    const seen = new Set();
    for (let ring = 0; ring <= rings; ring++) {
        for (const [sx, sy] of squares) {
            for (let dx = -ring; dx <= ring; dx++) for (let dy = -ring; dy <= ring; dy++) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
                const x = sx + dx;
                const y = sy + dy;
                const at = `${x},${y}`;
                if (x < 0 || y < 0 || x >= width || y >= height || seen.has(at)) continue;
                seen.add(at);
                out.push(at);
            }
        }
    }
    return out;
}

// A run's grid from what a scene has: { map: { width, height, blocked, walls, difficult, spawns }, squares } (grid-fight.js reads it).
// frame (see wallEdges); segments: the walls that stop movement (a door that's shut); difficult: [{ squares: [[x, y] …], factor }] (a
// Region's movement cost: 2 difficult, 3 greater); tokens: { "<combatant id>": { square: [x, y], side } }.
export function sceneGrid({ frame, segments = [], difficult = [], tokens = {} }) {
    const width = Math.max(1, Math.ceil(frame.width));
    const height = Math.max(1, Math.ceil(frame.height));
    const cost = {};
    for (const region of difficult) {
        const factor = Math.max(1, Math.min(3, Math.round(Number(region.factor) || 1)));
        if (factor <= 1) continue;
        for (const [x, y] of region.squares) cost[`${x},${y}`] = Math.max(cost[`${x},${y}`] ?? 1, factor);
    }
    const sideSquares = (side) => Object.values(tokens).filter((token) => token.side === side).map((token) => token.square);
    return {
        map: { name: "scene", width, height, blocked: [], walls: wallEdges(segments, { ...frame, width, height }), difficult: cost, spawns: { party: spawnsAround(sideSquares("party"), width, height), foes: spawnsAround(sideSquares("foes"), width, height) } },
        squares: Object.fromEntries(Object.entries(tokens).map(([id, token]) => [id, token.square]))
    };
}
