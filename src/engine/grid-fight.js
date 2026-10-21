// A fight on the square grid (2026-10-21; grid.js has the geometry and the user's words). The grid is an option of a run (state.grid):
// its creatures keep their squares (c.square), and the engine's range bands and Melees follow from them — after every move, those who
// reach one another (either way) and are foes are in a Melee together (chained: one Melee for a scrum), a creature in none is near
// within 30 feet of a foe, else far. Movement takes paths: a Stride its Speed's worth of feet (difficult terrain double), around walls
// and foes; reactions from the foes whose reach it leaves on the way.

import { isActive } from "./combatant.js";
import { burstSquares, coneSquares, distanceFeet, emanationSquares, flanks, layout, lineSquares, occupiedBy, placeSide, reachable, reaches, sightLine, spaceOf, squareKey, squareOf } from "./grid.js";

const ACTIVE_BANDS = new Set(["engaged", "near", "far"]);

// A grid spec (a run's option): { layout: "open" | "corridor" | "doorway" | "bridge" } or { map: { width, height, blocked, walls,
// difficult, spawns }, squares: { "<id>": [x, y] } } (a Foundry scene's). Sets and Maps from arrays where it came as JSON.
export function gridMap(spec) {
    if (!spec) return null;
    const base = spec.map ?? layout(spec.layout ?? "open");
    return {
        name: base.name ?? spec.layout ?? "scene",
        width: Number(base.width) || 30,
        height: Number(base.height) || 20,
        blocked: base.blocked instanceof Set ? new Set(base.blocked) : new Set(base.blocked ?? []),
        walls: base.walls instanceof Set ? new Set(base.walls) : new Set(base.walls ?? []),
        difficult: base.difficult instanceof Map ? new Map(base.difficult) : new Map(Object.entries(base.difficult ?? {}).map(([square, factor]) => [square, Number(factor) || 2])),
        spawns: { party: [...(base.spawns?.party ?? [])], foes: [...(base.spawns?.foes ?? [])] }
    };
}

// Those who fight up close first: a creature whose best Strike is a melee one, the toughest first.
const frontFirst = (list) => [...list].sort((a, b) => Number(Boolean(b.strikes?.some((strike) => strike.melee))) - Number(Boolean(a.strikes?.some((strike) => strike.melee))) || b.hp.max - a.hp.max);

// Puts a fight on the grid: its map, and each creature's square (the spec's, else its side's spawns, the front first). Creatures yet to
// arrive get theirs as they come (placeArrival).
export function setUpGrid(state, spec) {
    const map = gridMap(spec);
    if (!map) return;
    state.grid = map;
    state.gridVersion = 0;
    const given = spec.squares ?? {};
    const taken = new Set();
    for (const c of state.list) {
        if (Array.isArray(given[c.id])) {
            c.square = [Number(given[c.id][0]), Number(given[c.id][1])];
            for (const square of occupiedBy(c)) taken.add(square);
        }
    }
    for (const side of ["party", "foes"]) {
        const waiting = frontFirst(state.list.filter((c) => c.side === side && !c.square && c.status !== "pending" && c.kind !== "object"));
        const placed = placeSide(map, waiting, map.spawns[side] ?? [], taken);
        for (const c of waiting) if (placed[c.id]) c.square = placed[c.id];
    }
    // (Objects — a hazard's, a door — stand where their side's front is.)
    for (const c of state.list.filter((other) => !other.square && other.kind === "object")) {
        const placed = placeSide(map, [c], map.spawns[c.side] ?? [], taken);
        if (placed[c.id]) c.square = placed[c.id];
    }
    regroup(state);
}

// A creature coming into the fight: its side's first free spawn.
export function placeArrival(state, c) {
    if (!state.grid || c.square) return;
    const taken = new Set(state.list.filter((other) => other !== c && other.square && isActive(other)).flatMap(occupiedBy));
    const placed = placeSide(state.grid, [c], state.grid.spawns[c.side] ?? [], taken);
    if (placed[c.id]) c.square = placed[c.id];
    regroup(state);
}

// The Melees and bands from the squares (see the top). Bumps the grid's version (paths are cached by it).
export function regroup(state) {
    if (!state.grid) return;
    state.gridVersion = (state.gridVersion ?? 0) + 1;
    const standing = state.list.filter((c) => isActive(c) && c.square && ACTIVE_BANDS.has(c.band ?? "near"));
    const parent = new Map(standing.map((c) => [c.id, c.id]));
    const find = (id) => {
        while (parent.get(id) !== id) id = parent.get(id);
        return id;
    };
    const engaged = new Set();
    for (let i = 0; i < standing.length; i++) {
        for (let j = i + 1; j < standing.length; j++) {
            const a = standing[i];
            const b = standing[j];
            if (a.side === b.side || !(reaches(a, b) || reaches(b, a))) continue;
            parent.set(find(a.id), find(b.id));
            engaged.add(a.id);
            engaged.add(b.id);
        }
    }
    // (Allies beside a Melee's members join it too: they stand in the scrum.)
    for (const c of standing) {
        if (engaged.has(c.id)) continue;
        const beside = standing.find((other) => other.side === c.side && engaged.has(other.id) && reaches(c, other, 5));
        if (beside && standing.some((foe) => foe.side !== c.side && engaged.has(foe.id) && distanceFeet(c, foe) <= 10)) parent.set(find(c.id), find(beside.id));
    }
    state.melees = new Map();
    const ids = new Map();
    for (const c of state.list) {
        if (!standing.includes(c)) {
            if (c.meleeId !== null && c.meleeId !== undefined) c.meleeId = null;
            continue;
        }
        const root = find(c.id);
        const inMelee = engaged.has(c.id) || [...parent.keys()].some((id) => id !== c.id && find(id) === root && engaged.has(id));
        if (!inMelee) {
            c.meleeId = null;
            const nearest = Math.min(Infinity, ...standing.filter((other) => other.side !== c.side).map((other) => distanceFeet(c, other)));
            c.band = nearest <= 30 ? "near" : "far";
            continue;
        }
        if (!ids.has(root)) ids.set(root, state.nextMeleeId++);
        const meleeId = ids.get(root);
        if (!state.melees.has(meleeId)) state.melees.set(meleeId, new Set());
        state.melees.get(meleeId).add(c.id);
        c.meleeId = meleeId;
        c.band = "engaged";
    }
}

// The squares foes of a creature take (it can't go through them) and everyone else's (it can't stop in them).
function obstacles(state, c) {
    const blockedBy = new Set();
    const occupied = new Set();
    for (const other of state.list) {
        if (other === c || !other.square || other.band === "gone" || other.status === "dead" || other.status === "fled") continue;
        for (const square of occupiedBy(other)) {
            occupied.add(square);
            if (other.side !== c.side && isActive(other)) blockedBy.add(square);
        }
    }
    return { blockedBy, occupied };
}

// The map as a creature moves on it now: difficult terrain from zones besides the map's own (state.gridTerrain: "x,y" → factor).
function liveMap(state) {
    if (!state.gridTerrain?.size) return state.grid;
    const difficult = new Map(state.grid.difficult);
    for (const [square, factor] of state.gridTerrain) difficult.set(square, Math.max(difficult.get(square) ?? 1, factor));
    return { ...state.grid, difficult };
}

// Where a creature can get to from a square (cached by the grid's version): reachable()'s map.
function reachFrom(state, c, square = c.square) {
    state.gridPaths ??= new Map();
    if (state.gridPaths.version !== state.gridVersion) {
        state.gridPaths = new Map();
        state.gridPaths.version = state.gridVersion;
    }
    const cacheKey = `${c.id}|${square.join(",")}`;
    if (!state.gridPaths.has(cacheKey)) state.gridPaths.set(cacheKey, reachable(liveMap(state), { ...c, square }, obstacles(state, c)));
    return state.gridPaths.get(cacheKey);
}

// The cheapest place from which a creature (at `square`) reaches a target: { place, cost } or null — of the places about the target
// (as far off as its reach), those its way gets to. prefer(at): feet less it counts a place as costing (a flank). Cached by the grid's
// version when there's no preference.
function bestReachPlace(state, c, target, square = c.square, prefer = null) {
    const cacheKey = prefer ? null : `reach|${c.id}|${square.join(",")}|${target.id}`;
    if (cacheKey) {
        reachFrom(state, c, square);
        if (state.gridPaths.has(cacheKey)) return state.gridPaths.get(cacheKey);
    }
    const found = reachFrom(state, c, square);
    const n = spaceOf(c);
    const tn = spaceOf(target);
    const span = Math.ceil(Math.max(5, c.reach ?? 5) / 5) + 1;
    const probe = { square: [0, 0], size: c.size, reach: c.reach };
    let best = null;
    for (let x = target.square[0] - n - span; x <= target.square[0] + tn + span; x++) {
        for (let y = target.square[1] - n - span; y <= target.square[1] + tn + span; y++) {
            const place = squareKey(x, y);
            const entry = found.get(place);
            if (!entry?.ends) continue;
            probe.square = [x, y];
            if (!reaches(probe, target)) continue;
            const bonus = prefer ? prefer({ ...c, square: [x, y] }) : 0;
            if (!best || entry.cost - bonus < best.cost - best.bonus) best = { place, cost: entry.cost, bonus };
        }
    }
    if (cacheKey) state.gridPaths.set(cacheKey, best);
    return best;
}

// Strides a creature (from `square`, its own by default) needs to reach a target: its cheapest way's feet over its Speed (1 at least,
// 0 when it reaches already); Infinity with no way.
export function gridStrides(state, c, target, square = c.square) {
    if (!square || !target?.square) return Infinity;
    if (reaches({ ...c, square }, target)) return 0;
    const best = bestReachPlace(state, c, target, square);
    return best ? Math.max(1, Math.ceil(best.cost / Math.max(5, c.speed ?? 25))) : Infinity;
}

// Where a creature ends a Stride toward a place: the furthest point of the way it pays for with `feet` (its Speed).
function along(found, place, feet) {
    const way = found.wayTo(place);
    let end = way[0]?.square ?? null;
    for (const step of way) {
        if (step.cost > feet) break;
        if (found.get(step.square)?.ends !== false) end = step.square;
    }
    return { end, way: way.filter((step) => step.cost <= feet).map((step) => step.square) };
}

// The foes whose reach a creature leaves on its way (its first square on: those who reach it there or anywhere it passes before its
// last square) — whose reactions a move sets off.
export function threatenedAlong(state, c, way) {
    const out = new Set();
    const passed = way.slice(0, -1);
    for (const enemy of state.list) {
        if (enemy.side === c.side || !isActive(enemy) || !enemy.square) continue;
        if (passed.some((square) => reaches(enemy, { ...c, square: squareOf(square) }))) out.add(enemy);
    }
    return [...out];
}

// A Stride on the grid: { end, way } of the move, or null when it can't go. kind "engage"/"approach" (toward a creature until it
// reaches it, as far as its Speed takes it — flanking it with an ally when that costs no more), "toNear" (out of every foe's reach, 15
// to 30 feet from the nearest when it can, as little moving as will do), "toFar" (as far from the foes as it gets).
export function planStride(state, c, move, feet = Math.max(5, c.speed ?? 25)) {
    if (!state.grid || !c.square) return null;
    const found = reachFrom(state, c);
    if (move.kind === "engage" || move.kind === "approach") {
        const target = state.byId.get(move.targetId);
        if (!target?.square) return null;
        const allies = state.list.filter((other) => other !== c && other.side === c.side && isActive(other) && other.square && reaches(other, target));
        const flankBonus = (at) => (allies.some((ally) => flankPair(at, ally, target)) ? 2.5 : 0);
        const best = bestReachPlace(state, c, target, c.square, flankBonus);
        if (!best) return null;
        return along(found, best.place, feet);
    }
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.square);
    const nearest = (at) => Math.min(Infinity, ...foes.map((foe) => distanceFeet(at, foe)));
    let best = null;
    for (const [place, entry] of found) {
        if (!entry.ends || entry.cost > feet) continue;
        const at = { ...c, square: squareOf(place) };
        if (foes.some((foe) => reaches(foe, at))) continue;
        const gap = nearest(at);
        const score = move.kind === "toFar" ? gap * 10 - entry.cost : (Math.min(gap, 30) >= 15 ? 1000 : Math.min(gap, 30) * 10) - entry.cost;
        if (!best || score > best.score) best = { place, score };
    }
    return best ? along(found, best.place, feet) : null;
}

// A Step on the grid: 5 feet to a square out of every foe's reach (no difficult terrain), or null.
export function planStep(state, c) {
    if (!state.grid || !c.square) return null;
    const found = reachFrom(state, c);
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.square);
    for (const [place, entry] of found) {
        if (!entry.ends || entry.cost !== 5) continue;
        const at = { ...c, square: squareOf(place) };
        if (!foes.some((foe) => reaches(foe, at))) return { end: place, way: [squareKey(...c.square), place] };
    }
    return null;
}

// Moves a creature to a square, and the Melees after it.
export function moveTo(state, c, place) {
    if (!place) return;
    c.square = squareOf(place);
    regroup(state);
}

// Puts a creature beside a target at once (a teleport, an arrival in its Melee): the nearest free square from which it reaches it.
export function placeBeside(state, c, target) {
    if (!state.grid || !target?.square) return false;
    const { occupied } = obstacles(state, c);
    const n = spaceOf(c);
    let best = null;
    const [tx, ty] = target.square;
    for (let x = tx - n - 3; x <= tx + spaceOf(target) + 3; x++) for (let y = ty - n - 3; y <= ty + spaceOf(target) + 3; y++) {
        const at = { ...c, square: [x, y] };
        const squares = [];
        let fits = true;
        for (let i = 0; i < n && fits; i++) for (let j = 0; j < n; j++) {
            const square = squareKey(x + i, y + j);
            if (x + i < 0 || y + j < 0 || x + i >= state.grid.width || y + j >= state.grid.height || state.grid.blocked.has(square) || occupied.has(square)) fits = false;
            squares.push(square);
        }
        if (!fits || !reaches(at, target)) continue;
        const cost = c.square ? distanceFeet(at, { square: c.square, size: c.size }) : 0;
        if (!best || cost < best.cost) best = { square: [x, y], cost };
    }
    if (!best) return false;
    c.square = best.square;
    regroup(state);
    return true;
}

// Two creatures flanking a target (grid.js flanks), each within reach of it.
function flankPair(a, b, target) {
    return reaches(a, target) && reaches(b, target) && flanks(a, b, target);
}

// Whether an attacker flanks a target with an ally that can act: the grid's own rule (null off the grid).
export function gridFlanked(state, attacker, target, canAct) {
    if (!state.grid || !attacker.square || !target.square) return null;
    return state.list.some((ally) => ally !== attacker && ally.side === attacker.side && isActive(ally) && ally.square && canAct(ally) && flankPair(attacker, ally, target));
}

// --- Areas on the grid ------------------------------------------------------------------------------------------------------------------

// The creatures in a set of squares: those standing (or, with `downed`, lying) in any of them.
export function inSquares(state, squares, { downed = false } = {}) {
    const set = squares instanceof Set ? squares : new Set(squares);
    return state.list.filter((c) => c.square && c.band !== "gone" && (isActive(c) || (downed && c.status === "down")) && occupiedBy(c).some((square) => set.has(square)));
}

// Where an area can go from a caster on the grid: [{ squares, origin }] — a burst at each grid intersection about the creatures it might
// catch (within its range of the caster, in its line of effect); a cone or a line toward each of them; an emanation where the caster
// stands. around: the creatures to aim at.
export function areaPlacements(state, caster, area, range, around) {
    const map = state.grid;
    const value = Number(area.value) || 5;
    const out = [];
    if (area.type === "emanation" && (range === null || range === undefined)) return [{ squares: emanationSquares(map, caster, value), origin: "self" }];
    if (area.type === "cone" || area.type === "line") {
        for (const other of around) {
            if (!other.square || other === caster) continue;
            const n = spaceOf(other);
            const aim = [other.square[0] + n / 2, other.square[1] + n / 2];
            out.push({ squares: area.type === "cone" ? coneSquares(map, caster, aim, value) : lineSquares(map, caster, aim, value), origin: `toward ${other.id}` });
        }
        return out;
    }
    // (A burst, a cylinder, a square or a placed emanation: from an intersection.)
    const corners = new Set();
    for (const other of around) {
        if (!other.square) continue;
        const n = spaceOf(other);
        for (let x = other.square[0] - 1; x <= other.square[0] + n + 1; x++) for (let y = other.square[1] - 1; y <= other.square[1] + n + 1; y++) corners.add(squareKey(x, y));
    }
    const radius = area.type === "square" ? Math.max(5, Math.floor(value / 2 / 5) * 5) : value;
    const others = state.list.filter((other) => isActive(other) && other.square);
    for (const corner of corners) {
        const [cx, cy] = squareOf(corner);
        const origin = { square: [cx, cy], size: "medium" };
        if (range !== null && range !== undefined && range < Infinity && distanceFeet(caster, origin) > range) continue;
        if (!sightLine(map, caster, origin, others).effect) continue;
        out.push({ squares: burstSquares(map, cx, cy, radius), origin: corner });
    }
    return out;
}

// The target sets an area spell can have on the grid, the best few: who each placement catches (`affected`: those the spell can affect;
// downed allies too for healing), most foes first and fewest of the caster's side, without repeats.
export function gridAreaSets(state, caster, area, range, { affected = () => true, healing = false, helpful = false, foesOnly = false } = {}) {
    const around = state.list.filter((other) => other.square && (isActive(other) || (healing && other.status === "down")) && (helpful || healing || other.side !== caster.side));
    const seen = new Set();
    const sets = [];
    for (const placement of areaPlacements(state, caster, area, range, around)) {
        const caught = inSquares(state, placement.squares, { downed: healing }).filter((other) => affected(other) && (!foesOnly || other.side !== caster.side));
        // (A cone or a line from the caster isn't in it; a burst on it, or an emanation, is.)
        const targets = placement.origin === "self" ? [...new Set([...caught, ...(helpful || healing ? [caster] : [])])] : caught;
        if (!targets.length) continue;
        const key = targets.map((other) => other.id).sort().join("+");
        if (seen.has(key)) continue;
        seen.add(key);
        const foes = targets.filter((other) => other.side !== caster.side).length;
        sets.push({ targets, foes, friends: targets.length - foes });
    }
    sets.sort((a, b) => (helpful || healing ? b.friends - a.friends : b.foes - a.foes || a.friends - b.friends));
    return sets.slice(0, 6).map(({ targets }) => ({ targets }));
}

// A forced move on the grid (a push: way 1, away from the source; a pull: −1, toward it): square by square along the line between their
// centres, as far as feet allows, stopping at what blocks it (a wall, a blocked square, another creature, the map's edge). The feet it
// moved (0: none).
export function forcedMove(state, c, source, way, feet) {
    const n = spaceOf(c);
    const m = spaceOf(source);
    const dx = (c.square[0] + n / 2) - (source.square[0] + m / 2);
    const dy = (c.square[1] + n / 2) - (source.square[1] + m / 2);
    const length = Math.hypot(dx, dy) || 1;
    const ux = way * dx / length;
    const uy = way * dy / length;
    const { occupied } = obstacles(state, c);
    const start = [...c.square];
    let at = [...c.square];
    for (let step = 1; step <= Math.floor(feet / 5); step++) {
        const next = [Math.round(start[0] + ux * step), Math.round(start[1] + uy * step)];
        if (next[0] === at[0] && next[1] === at[1]) continue;
        const squares = [];
        let clear = true;
        for (let i = 0; i < n && clear; i++) for (let j = 0; j < n; j++) {
            const square = squareKey(next[0] + i, next[1] + j);
            if (next[0] + i < 0 || next[1] + j < 0 || next[0] + i >= state.grid.width || next[1] + j >= state.grid.height || state.grid.blocked.has(square) || occupied.has(square)) clear = false;
            squares.push(square);
        }
        if (!clear) break;
        // (Pulled into its source's own space: stop beside it.)
        if (way < 0 && reaches({ ...c, square: at }, source, 5) && !reaches({ ...c, square: next }, source, 5)) break;
        at = next;
    }
    if (at[0] === start[0] && at[1] === start[1]) return 0;
    const moved = distanceFeet({ ...c, square: at }, { ...c, square: start });
    c.square = at;
    regroup(state);
    return moved;
}
