// A fight on the square grid (2026-10-21; grid.js has the geometry and the user's words). The grid is an option of a run (state.grid):
// its creatures keep their squares (c.square), and the engine's range bands and Melees follow from them — after every move, those who
// reach one another (either way) and are foes are in a Melee together (chained: one Melee for a scrum), a creature in none is near
// within 30 feet of a foe, else far. Movement takes paths: a Stride its Speed's worth of feet (difficult terrain double), around walls
// and foes; reactions from the foes whose reach it leaves on the way.

import { isActive } from "./combatant.js";
import { burstSquares, coneSquares, distanceFeet, emanationSquares, flanks, footingAt, groundZ, layout, lineSquares, occupiedBy, placeSide, reachable, reaches, sightLine, spaceOf, squareKey, squareOf } from "./grid.js";
import { aloft, fliesNow } from "./space.js";
import { battlefieldMap, isBattlefield } from "./battlefields.js";
import { expectedStrikeDamage } from "./damage.js";
import { skillValue } from "./spells.js";
import { voidJoin } from "./void.js";

const ACTIVE_BANDS = new Set(["engaged", "near", "far"]);

// A grid spec (a run's option): { layout: "open" | "corridor" | "doorway" | "bridge" } or { map: { width, height, blocked, walls,
// difficult, spawns }, squares: { "<id>": [x, y] } } (a Foundry scene's), or a battlefield's ({ layout: "pillars", side? }: setUpGrid makes
// its map for the fight). Sets and Maps from arrays where it came as JSON.
export function gridMap(spec) {
    if (typeof spec === "string") spec = spec === "scene" ? null : { layout: spec };
    if (!spec) return null;
    const base = spec.map ?? layout(spec.layout ?? "open");
    // (2026-10-22, the battlefields — battlefields.js: heights, footing, ledges, objects, mist, holes, the void; Maps and Sets from JSON's
    // entries and arrays.)
    const asMap = (value, read = (entry) => entry) => new Map((value instanceof Map ? [...value] : Object.entries(value ?? {})).map(([square, entry]) => [square, read(entry)]));
    return {
        name: base.name ?? spec.layout ?? "scene",
        width: Number(base.width) || 30,
        height: Number(base.height) || 20,
        blocked: base.blocked instanceof Set ? new Set(base.blocked) : new Set(base.blocked ?? []),
        walls: base.walls instanceof Set ? new Set(base.walls) : new Set(base.walls ?? []),
        difficult: base.difficult instanceof Map ? new Map(base.difficult) : new Map(Object.entries(base.difficult ?? {}).map(([square, factor]) => [square, Number(factor) || 2])),
        spawns: { party: [...(base.spawns?.party ?? [])], foes: [...(base.spawns?.foes ?? [])] },
        ...(base.battlefield ? { battlefield: base.battlefield, level: Number(base.level) || 1 } : {}),
        ...(base.heights ? { heights: asMap(base.heights, Number) } : {}),
        ...(base.footing ? { footing: asMap(base.footing, (entry) => ({ ...entry })) } : {}),
        ...(base.climbDC ? { climbDC: Number(base.climbDC) } : {}),
        ...(base.parapets ? { parapets: new Set(base.parapets) } : {}),
        ...(base.mist ? { mist: asMap(base.mist) } : {}),
        ...(base.objects ? { objects: base.objects.map((object) => ({ ...object, squares: [...object.squares] })) } : {}),
        ...(base.holes ? { holes: [...base.holes] } : {}),
        ...(base.void ? { void: base.void } : {}),
        ...(base.climbDCs ? { climbDCs: asMap(base.climbDCs, Number) } : {}),
        ...(base.cover ? { cover: new Set(base.cover) } : {}),
        ...(base.side ? { side: base.side } : {}),
        ...(base.drop ? { drop: Number(base.drop) } : {}),
        ...(base.rise ? { rise: Number(base.rise) } : {}),
        ...(base.fallOut ? { fallOut: Number(base.fallOut) } : {})
    };
}

// (2026-10-22, heights.) Where a creature's space's bottom is: its ground's height, and what it's flown or climbed above it.
export function standZ(map, c, square = c.square) {
    return groundZ(map, square[0], square[1], spaceOf(c)) + (Number(c.elevation) || 0);
}

// Those who fight up close first: a creature whose best Strike is a melee one, the toughest first.
const frontFirst = (list) => [...list].sort((a, b) => Number(Boolean(b.strikes?.some((strike) => strike.melee))) - Number(Boolean(a.strikes?.some((strike) => strike.melee))) || b.hp.max - a.hp.max);

// Puts a fight on the grid: its map, and each creature's square (the spec's, else its side's spawns, the front first). Creatures yet to
// arrive get theirs as they come (placeArrival).
export function setUpGrid(state, spec) {
    if (typeof spec === "string" && spec !== "scene") spec = { layout: spec };
    // (2026-10-22, a battlefield: made for this fight — at the party's level, with its dice.)
    if (spec && !spec.map && isBattlefield(spec.layout)) spec = { ...spec, map: battlefieldMap(spec.layout, { level: spec.level ?? state.partyLevel, side: spec.side, rng: state.rng }) };
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
    voidJoin(state, c);
    const taken = new Set(state.list.filter((other) => other !== c && other.square && isActive(other)).flatMap(occupiedBy));
    const placed = placeSide(state.grid, [c], state.grid.spawns[c.side] ?? [], taken);
    if (placed[c.id]) c.square = placed[c.id];
    regroup(state);
}

// The Melees and bands from the squares (see the top). Bumps the grid's version (paths are cached by it).
export function regroup(state) {
    if (!state.grid) return;
    state.gridVersion = (state.gridVersion ?? 0) + 1;
    // (2026-10-22, the battlefields: each creature's height, and the footing it stands on — uneven ground or a narrow surface, off-guard
    // on it; climbing, off-guard too — combatant.js isOffGuard.)
    if (state.grid.heights?.size || state.grid.footing?.size) {
        for (const c of state.list) {
            if (!c.square) continue;
            // (Moved off the foot of a ledge it was climbing — a Stride, a shove —: no longer on it.)
            if (c.climbing && c.square.join(",") !== c.climbing.bottom) {
                c.climbing = null;
                c.elevation = 0;
            }
            c.z = standZ(state.grid, c);
            const footing = fliesNow(c) ? null : footingAt(state.grid, c.square[0], c.square[1], spaceOf(c));
            c.footing = footing && footing.kind !== "incline" ? footing : null;
        }
    }
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
            c.band = bandFrom(state, c, standing);
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

// Out of a Melee: near within 30 feet of a foe, else far. (2026-10-22, a battlefield: a foe behind a wall or over a cliff's lip — no line
// between — isn't near.) `at`: the creature where it stands, or where it would.
function bandFrom(state, at, standing) {
    const seen = (other) => !state.grid.battlefield || sightLine(state.grid, at, other).effect;
    const nearest = Math.min(Infinity, ...standing.filter((other) => other.side !== at.side && seen(other)).map((other) => distanceFeet(at, other)));
    return nearest <= 30 ? "near" : "far";
}

// The band a creature would be in at a square (out of any Melee), for the planner.
export function bandAt(state, c, square, z = undefined) {
    const standing = state.list.filter((other) => other !== c && isActive(other) && other.square && ACTIVE_BANDS.has(other.band ?? "near"));
    return bandFrom(state, { ...c, square, ...(z !== undefined ? { z } : {}) }, standing);
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
    if (!state.gridPaths.has(cacheKey)) {
        const flying = fliesNow(c);
        state.gridPaths.set(cacheKey, reachable(liveMap(state), { ...c, square }, { ...obstacles(state, c), flying, breach: flying ? null : breachesFor(state, c) }));
    }
    return state.gridPaths.get(cacheKey);
}

// --- Battlefield objects (2026-10-22, battlefields.js: a gate, pillars, the central mass) ------------------------------------------------

// The closed gate a square is part of, or null.
export function gateAt(map, square) {
    return map?.objects?.find((object) => object.kind === "gate" && object.closed && object.squares.includes(square)) ?? null;
}

// The chance a creature's Force Open gets a gate open (Athletics against its DC, 2 harder once jammed), and how much of its Hit Points
// left its best melee Strike takes a Strike (against AC 0, a critical hit but on a 1; less the Hardness).
export function breachOdds(c, gate) {
    const need = gate.forceDC + (gate.jammed ? 2 : 0) - skillValue(c, "athletics");
    const force = Math.min(0.95, Math.max(0.05, (21 - need) / 20));
    let strike = 0;
    for (const option of c.strikes ?? []) {
        if (!option.melee) continue;
        const damage = expectedStrikeDamage(option, { critical: true }).reduce((sum, part) => sum + (part.persistent ? 0 : part.amount), 0);
        strike = Math.max(strike, Math.min(1, (0.95 * Math.max(0, damage - gate.hardness)) / Math.max(1, gate.hp)));
    }
    return { force, strike };
}

// Getting through a closed gate, in feet of a creature's movement: the actions it expects to take there (Force Open, or Strikes) at its
// Speed's worth each, and the step; or what climbing over it costs, when that's less (no entry: it climbs).
function breachesFor(state, c) {
    const gates = (state.grid.objects ?? []).filter((object) => object.kind === "gate" && object.closed);
    if (!gates.length) return null;
    const speed = Math.max(5, c.speed ?? 25);
    const out = new Map();
    for (const gate of gates) {
        const { force, strike } = breachOdds(c, gate);
        const actions = Math.min(1 / force, strike > 0 ? Math.ceil(1 / strike) : Infinity);
        const feet = Math.ceil(actions) * speed;
        if (feet >= 2 * Math.ceil((gate.height ?? 15) / 5) * speed) continue;
        for (const square of gate.squares) out.set(square, Math.min(250, feet));
    }
    return out.size ? out : null;
}

// The line a pillar falls in, pushed from a square: as many squares as it's tall in 5-foot squares, away from the square (its nearest
// way: along a row, a column or a diagonal), stopping at the map's edge or a wall.
export function pillarLine(map, from, pillar) {
    const [px, py] = squareOf(pillar.squares[0]);
    const dx = Math.sign(px - from[0]);
    const dy = Math.sign(py - from[1]);
    if (!dx && !dy) return [];
    const out = [];
    for (let i = 1; i <= Math.max(1, Math.round((pillar.height ?? 20) / 5)); i++) {
        const x = px + dx * i;
        const y = py + dy * i;
        if (x < 0 || y < 0 || x >= map.width || y >= map.height || map.blocked.has(squareKey(x, y))) break;
        out.push(squareKey(x, y));
    }
    return out;
}

// The pillars (standing) a creature at a square reaches.
export function pillarsInReach(state, c, square = c.square, z = c.z) {
    const at = { ...c, square, ...(z !== undefined ? { z } : {}) };
    return (state.grid?.objects ?? []).filter((object) => object.kind === "pillar" && !object.fallen && reaches(at, { square: squareOf(object.squares[0]), size: "med", z: groundZ(state.grid, ...squareOf(object.squares[0])) }));
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
    // (2026-10-22, heights: a place's own height — a flier's as high as the target's, flying up to it.)
    const flying = fliesNow(c);
    const heights = Boolean(state.grid.heights?.size || target.z);
    let best = null;
    for (let x = target.square[0] - n - span; x <= target.square[0] + tn + span; x++) {
        for (let y = target.square[1] - n - span; y <= target.square[1] + tn + span; y++) {
            const place = squareKey(x, y);
            const entry = found.get(place);
            if (!entry?.ends) continue;
            probe.square = [x, y];
            if (heights) {
                const ground = groundZ(state.grid, x, y, n);
                probe.z = flying ? Math.max(ground, Number(target.z) || 0) : ground;
            }
            if (!reaches(probe, target)) continue;
            // (2026-10-22, a battlefield: firm ground over uneven ground or a narrow surface — off-guard there — by 10 feet's worth.)
            const unsure = !flying && state.grid.footing?.size && footingAt(state.grid, x, y, n)?.kind && footingAt(state.grid, x, y, n).kind !== "incline" ? 10 : 0;
            const bonus = (prefer ? prefer({ ...c, square: [x, y], ...(heights ? { z: probe.z } : {}) }) : 0) - unsure;
            if (!best || entry.cost - bonus < best.cost - best.bonus) best = { place, cost: entry.cost, bonus, ...(heights ? { z: probe.z } : {}) };
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
    // (A flier aloft, out of reach of one that doesn't fly — space.js.)
    if (!fliesNow(c) && aloft(target)) return Infinity;
    const best = bestReachPlace(state, c, target, square);
    return best ? Math.max(1, Math.ceil(best.cost / Math.max(5, c.speed ?? 25))) : Infinity;
}

// Where a creature ends a Stride toward a place: the furthest point of the way it pays for with `feet` (its Speed).
// (2026-10-22: next — the first step past what it pays for, a climb it takes a Climb for: actions.js gridStride.)
function along(found, place, feet) {
    const way = found.wayTo(place);
    let end = way[0]?.square ?? null;
    for (const step of way) {
        if (step.cost > feet) break;
        if (found.get(step.square)?.ends !== false) end = step.square;
    }
    const paid = way.filter((step) => step.cost <= feet).map((step) => step.square);
    const next = way[paid.length]?.square ?? null;
    return { end, way: paid, ...(next ? { next } : {}) };
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
// to 30 feet from the nearest — from further off, as close to 30 feet as it gets — as little moving as will do), "toFar" (as far from
// the foes as it gets).
export function planStride(state, c, move, feet = Math.max(5, c.speed ?? 25)) {
    if (!state.grid || !c.square) return null;
    const found = reachFrom(state, c);
    if (move.kind === "vantage") return vantageStride(state, c, found, feet);
    if (move.kind === "engage" || move.kind === "approach") {
        const target = state.byId.get(move.targetId);
        if (!target?.square) return null;
        const allies = state.list.filter((other) => other !== c && other.side === c.side && isActive(other) && other.square && reaches(other, target));
        const flankBonus = (at) => (allies.some((ally) => flankPair(at, ally, target)) ? 2.5 : 0);
        const best = bestReachPlace(state, c, target, c.square, flankBonus);
        if (!best) return null;
        return { ...along(found, best.place, feet), ...(best.z !== undefined && fliesNow(c) ? { z: best.z } : {}) };
    }
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.square);
    const nearest = (at) => Math.min(Infinity, ...foes.map((foe) => distanceFeet(at, foe)));
    let best = null;
    for (const [place, entry] of found) {
        if (!entry.ends || entry.cost > feet) continue;
        const at = { ...c, square: squareOf(place) };
        if (state.grid.heights?.size) at.z = standZ(state.grid, c, at.square);
        if (foes.some((foe) => reaches(foe, at))) continue;
        const gap = nearest(at);
        // (Near: 15 to 30 feet from the nearest foe — from further off, as close to 30 as it gets; away: as far as it gets.)
        const score = move.kind === "toFar" ? gap * 10 - entry.cost : gap > 30 ? 1000 - (gap - 30) * 10 - entry.cost : gap >= 15 ? 2000 - entry.cost : gap * 10 - entry.cost;
        if (!best || score > best.score) best = { place, score, gap };
    }
    // (2026-10-22, heights: no nearer within a Stride, or nowhere to go — a cliff, a wall between —: on along the way to the foe it gets
    // to soonest, up or down a ledge by Climbs.)
    if (move.kind === "toNear" && state.grid.heights?.size && !fliesNow(c) && (!best || best.gap > 30 || best.place === squareKey(...c.square))) {
        const ways = foes.map((foe) => bestReachPlace(state, c, foe)).filter(Boolean).sort((p, q) => p.cost - q.cost);
        if (ways.length) {
            const plan = along(found, ways[0].place, feet);
            // (Holding the high ground: one that shoots doesn't climb down to its foes — it comes to the edge.)
            if (obstacleNext(state, c, plan) === "climb" && shoots(c) && climbsDown(state, c, plan)) return plan.end && plan.end !== squareKey(...c.square) ? { end: plan.end, way: plan.way } : null;
            if ((plan.end && plan.end !== squareKey(...c.square)) || obstacleNext(state, c, plan)) return plan;
        }
    }
    return best ? along(found, best.place, feet) : null;
}

// (2026-10-22, Take Cover.) Whether a creature at a square has something to take cover behind on a battlefield — prone; in a parapet's,
// undergrowth's or rubble's square; beside a wall, a pillar or a ledge above it; or with a foe's line to it already giving cover.
export function canTakeCover(state, c, square = c.square, z = undefined) {
    const map = state.grid;
    if (!map?.battlefield || !square || map.void) return false;
    if (c.cond?.prone) return true;
    const n = spaceOf(c);
    const ground = groundZ(map, square[0], square[1], n);
    for (let i = -1; i <= n; i++) for (let j = -1; j <= n; j++) {
        const key = squareKey(square[0] + i, square[1] + j);
        const inside = i >= 0 && j >= 0 && i < n && j < n;
        if (inside && (map.parapets?.has(key) || map.cover?.has(key) || (map.difficult?.get(key) ?? 1) >= 2)) return true;
        if (!inside && (map.blocked.has(key) || (map.heights?.get(key) ?? 0) > ground + 5)) return true;
    }
    const at = { ...c, square, ...(z !== undefined ? { z } : {}) };
    return state.list.some((foe) => foe.side !== c.side && isActive(foe) && foe.square && sightLine(map, foe, at).cover >= 2);
}

// Whether a creature that Took Cover has it against an attacker: in undergrowth or rubble, or beside a wall, a pillar or a ledge above it
// on the attacker's side.
export function coverToward(state, c, from) {
    const map = state.grid;
    const n = spaceOf(c);
    const ground = groundZ(map, c.square[0], c.square[1], n);
    const cx = c.square[0] + n / 2;
    const cy = c.square[1] + n / 2;
    const fx = from.square[0] + spaceOf(from) / 2 - cx;
    const fy = from.square[1] + spaceOf(from) / 2 - cy;
    for (let i = -1; i <= n; i++) for (let j = -1; j <= n; j++) {
        const x = c.square[0] + i;
        const y = c.square[1] + j;
        const key = squareKey(x, y);
        if (i >= 0 && j >= 0 && i < n && j < n) {
            if (map.cover?.has(key) || (map.difficult?.get(key) ?? 1) >= 2) return true;
            continue;
        }
        if ((map.blocked.has(key) || (map.heights?.get(key) ?? 0) > ground + 5) && (x + 0.5 - cx) * fx + (y + 0.5 - cy) * fy > 0) return true;
    }
    return false;
}

// (2026-10-22, the battlefields' tactics.) Whether a creature fights from afar: a ranged Strike it can use.
export const shoots = (c) => (c.strikes ?? []).some((strike) => !strike.melee && !strike.underwaterBlocked);

// Whether a plan's next step is down a ledge.
function climbsDown(state, c, plan) {
    const from = squareOf(plan.end ?? squareKey(...c.square));
    const to = squareOf(plan.next);
    const n = spaceOf(c);
    return groundZ(state.grid, to[0], to[1], n) < groundZ(state.grid, from[0], from[1], n) - 5;
}

// How good a place is to shoot from, for a creature (a battlefield's balconies, a cliff's edge, a parapet, undergrowth): the foes it has
// a line to within two of its range increments, its cover from them, those that would have to climb to it, less uneven footing.
export function vantageScore(state, c, square) {
    const at = { ...c, square, ...(state.grid.heights?.size ? { z: standZ(state.grid, c, square) } : {}) };
    const increment = Math.max(0, ...(c.strikes ?? []).filter((strike) => !strike.melee && !strike.underwaterBlocked).map((strike) => Number(strike.increment) || 0)) || 30;
    let score = 0;
    let seen = 0;
    for (const foe of state.list) {
        if (foe.side === c.side || !isActive(foe) || !foe.square) continue;
        const line = sightLine(state.grid, at, foe);
        if (!line.effect || distanceFeet(at, foe) > 2 * increment) continue;
        seen++;
        score += 3 + sightLine(state.grid, foe, at).cover;
        if (!fliesNow(foe) && (Number(at.z) || 0) > (Number(foe.z) || 0) + 5) score += 2;
    }
    if (!seen) return -Infinity;
    const footing = fliesNow(c) ? null : footingAt(state.grid, square[0], square[1], spaceOf(c));
    return score + 10 - (footing && footing.kind !== "incline" ? 6 : 0);
}

// A Stride toward the best place to shoot from within two Strides, out of its foes' reach: a plan (goal: the place), or null when none
// beats where it is. Only places that could be better than the open ground: higher than where it stands, a parapet's, undergrowth's or
// rubble's square, or beside a wall or a ledge; on a map that has any. Cached by the grid's version.
function vantageStride(state, c, found, feet) {
    const map = state.grid;
    if (!map.heights?.size && !map.parapets?.size && !map.cover?.size && !map.blocked?.size) return null;
    const cacheKey = `vantage|${c.id}|${c.square.join(",")}|${feet}`;
    reachFrom(state, c);
    if (state.gridPaths.has(cacheKey)) return state.gridPaths.get(cacheKey);
    const plan = vantageSearch(state, c, found, feet);
    state.gridPaths.set(cacheKey, plan);
    return plan;
}

// Whether a square could be a better place to shoot from than open ground at `ground`: higher, a parapet's, undergrowth's or rubble's, or
// beside a wall or a ledge (up or down: an edge to see over).
function featured(map, x, y, ground) {
    const square = squareKey(x, y);
    if ((map.heights?.get(square) ?? 0) > ground || map.parapets?.has(square) || map.cover?.has(square) || (map.difficult?.get(square) ?? 1) >= 2) return true;
    const here = map.heights?.get(square) ?? 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const next = squareKey(x + dx, y + dy);
        if (map.blocked.has(next) || Math.abs((map.heights?.get(next) ?? 0) - here) > 5) return true;
    }
    return false;
}

function vantageSearch(state, c, found, feet) {
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.square);
    const ground = groundZ(state.grid, c.square[0], c.square[1], spaceOf(c));
    let best = { place: squareKey(...c.square), score: vantageScore(state, c, c.square) + 1 };
    for (const [place, entry] of found) {
        if (!entry.ends || entry.cost > 2 * feet || place === best.place) continue;
        const square = squareOf(place);
        if (!featured(state.grid, square[0], square[1], ground)) continue;
        const at = { ...c, square, ...(state.grid.heights?.size ? { z: standZ(state.grid, c, square) } : {}) };
        if (foes.some((foe) => reaches(foe, at))) continue;
        const score = vantageScore(state, c, square) - entry.cost / 25;
        if (score > best.score) best = { place, score };
    }
    return best.place === squareKey(...c.square) ? null : { ...along(found, best.place, feet), goal: best.place };
}

// What a Stride's plan goes on with past where it ends: "breach" (a closed gate: forced or broken — actions.js breachGate), "climb" (up or
// down a ledge, or onto an incline — actions.js climb), or null.
export function obstacleNext(state, c, plan) {
    if (!plan?.next || fliesNow(c) || !state.grid?.heights?.size) return null;
    const from = squareOf(plan.end ?? squareKey(...c.square));
    const to = squareOf(plan.next);
    const n = spaceOf(c);
    const covered = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) covered.push(squareKey(to[0] + i, to[1] + j));
    if (covered.some((square) => gateAt(state.grid, square))) return "breach";
    return Math.abs(groundZ(state.grid, to[0], to[1], n) - groundZ(state.grid, from[0], from[1], n)) > 5 || footingAt(state.grid, to[0], to[1], n)?.kind === "incline" ? "climb" : null;
}

// The closed gate a Stride's next step goes into, or null.
export function gateOnStep(state, c, next) {
    const [x, y] = squareOf(next);
    const n = spaceOf(c);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const gate = gateAt(state.grid, squareKey(x + i, y + j));
        if (gate) return gate;
    }
    return null;
}

// A Step on the grid: 5 feet to a square out of every foe's reach (no difficult terrain), or null.
export function planStep(state, c) {
    if (!state.grid || !c.square) return null;
    const found = reachFrom(state, c);
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.square);
    for (const [place, entry] of found) {
        if (!entry.ends || entry.cost !== 5) continue;
        const at = { ...c, square: squareOf(place) };
        if (state.grid.heights?.size) at.z = standZ(state.grid, c, at.square);
        if (!foes.some((foe) => reaches(foe, at))) return { end: place, way: [squareKey(...c.square), place] };
    }
    return null;
}

// Moves a creature to a square, and the Melees after it. (z: a flier's height there, as it flew up or down to it.)
export function moveTo(state, c, place, z = undefined) {
    if (!place) return;
    // (Moving ends Take Cover.)
    c.tookCover = false;
    // (A flier keeps its height over a drop, unless it's going to one: z.)
    const height = z ?? (fliesNow(c) && state.grid.heights?.size ? standZ(state.grid, c) : undefined);
    c.square = squareOf(place);
    if (height !== undefined && fliesNow(c)) c.elevation = Math.max(0, height - groundZ(state.grid, c.square[0], c.square[1], spaceOf(c)));
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
// moved (0: none). (2026-10-22, heights: one that doesn't fly is stopped by ground more than 5 feet higher, and goes over an edge more
// than 5 feet down — onFall(c, feet) for the drop — and stops there.)
export function forcedMove(state, c, source, way, feet, { onFall = null } = {}) {
    const { at, drop, edge } = forcedPath(state, c, source, way, feet);
    if (at[0] === c.square[0] && at[1] === c.square[1]) return 0;
    const moved = distanceFeet({ ...c, square: at }, { ...c, square: c.square });
    c.square = at;
    regroup(state);
    if (drop && onFall) onFall(c, drop, edge);
    return moved;
}

// Where a push (way 1) or pull (−1) of `feet` would take a creature, without moving it: { at, drop, edge } — drop, the feet it would fall
// off an edge on the way (from `edge`), 0 without one.
export function forcedPath(state, c, source, way, feet) {
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
    let drop = 0;
    let edge = null;
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
        if (state.grid.heights?.size && !fliesNow(c)) {
            const here = groundZ(state.grid, at[0], at[1], n);
            const there = groundZ(state.grid, next[0], next[1], n);
            if (there > here + 5) break;
            if (there < here - 5) {
                edge = [...at];
                at = next;
                drop = here - there;
                break;
            }
        }
        at = next;
    }
    return { at, drop, edge };
}

// (2026-10-22, the battlefields.) Off the edge it stands at — a narrow surface it lost its footing on, a ledge it was knocked from: into
// the free square beside it with the lowest ground more than 5 feet down. The feet it drops (0: no such square — it falls where it stands).
export function dropOffEdge(state, c) {
    if (!state.grid?.heights?.size || !c.square) return 0;
    const n = spaceOf(c);
    const here = groundZ(state.grid, c.square[0], c.square[1], n);
    const { occupied } = obstacles(state, c);
    let best = null;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const [x, y] = [c.square[0] + dx, c.square[1] + dy];
        if (x < 0 || y < 0 || x + n > state.grid.width || y + n > state.grid.height) continue;
        const squares = [];
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) squares.push(squareKey(x + i, y + j));
        if (squares.some((square) => state.grid.blocked.has(square) || occupied.has(square))) continue;
        const ground = groundZ(state.grid, x, y, n);
        if (ground < here - 5 && (!best || ground < best.ground)) best = { square: [x, y], ground };
    }
    if (!best) return 0;
    c.square = best.square;
    c.elevation = 0;
    regroup(state);
    return here - best.ground;
}

// Whether a Stride of that kind takes a creature anywhere on the grid (true off the grid: the bands' moves always do).
export function strideGoes(state, c, move) {
    if (!state.grid || !c.square) return true;
    const plan = planStride(state, c, move);
    return (Boolean(plan?.end) && plan.end !== c.square.join(",")) || Boolean(obstacleNext(state, c, plan));
}
