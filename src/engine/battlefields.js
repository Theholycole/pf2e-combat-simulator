// The battlefields (2026-10-22, the user: "add these battlefield types to the simulator as well as an additional battlefield with nothing in
// it at all, not even a floor. That last one would be used in pure flying battles or underwater battles"). From their notes, Battlefield
// Challenges: Balconies, Broken Ground, Burrows, Dropoff, Gates, High and Low, Narrow Path, Obscura, One Mass, Pillars and Rampart — the
// levels each suits (when PCs gain what counters it), the DCs and the materials —, and Sky and Underwater with no floor. Their choices: a
// choice in the run's setup (not the ratings); full heights; Sky (everyone flies) and Underwater (PF2e's aquatic rules); every battlefield at
// any level, its DCs, materials and drops from the party's level, marked outside its levels; at a gate or a rampart, the GM picks the
// party's side; a pillar knocked over falls in a line; foes come out of the burrows; full tactics.
//   Maps for grid.js and grid-fight.js (see grid.js for the fields), made for each fight — its dice for what's random (the 1d6 pillars,
// the rubble, the holes). Pure.

const key = (x, y) => `${x},${y}`;

export const BATTLEFIELDS = Object.freeze([
    { name: "balconies", label: "Balconies", levels: [1, 20] },
    { name: "broken", label: "Broken Ground", levels: null },
    { name: "burrows", label: "Burrows", levels: [1, 5] },
    { name: "dropoff", label: "Dropoff", levels: [1, 20] },
    { name: "gates", label: "Gates", levels: [1, 12], sides: true },
    { name: "high-low", label: "High and Low", levels: [1, 10] },
    { name: "narrow-path", label: "Narrow Path", levels: null },
    { name: "obscura", label: "Obscura", levels: [1, 10] },
    { name: "one-mass", label: "One Mass", levels: [1, 20] },
    { name: "pillars", label: "Pillars", levels: [1, 20] },
    { name: "rampart", label: "Rampart", levels: null, sides: true },
    { name: "sky", label: "Sky (no floor)", levels: null },
    { name: "underwater", label: "Underwater (no floor)", levels: null }
]);
export const isBattlefield = (name) => BATTLEFIELDS.some((entry) => entry.name === name);
export const battlefieldOf = (name) => BATTLEFIELDS.find((entry) => entry.name === name) ?? null;
// Whether a level is within the battlefield's recommended levels (one with none suits every level).
export function inLevels(name, level) {
    const levels = battlefieldOf(name)?.levels;
    return !levels || (level >= levels[0] && level <= levels[1]);
}

// The DC tier for a level, by when a PC can have the proficiency (trained from 1st, expert 3rd, master 7th, legendary 15th): the notes'
// DC 15, 20, 30, 40 — their sample Balance, Climb and Force Open tasks by proficiency.
export function tierOf(level) {
    return level >= 15 ? 3 : level >= 7 ? 2 : level >= 3 ? 1 : 0;
}
export const TIER_DC = Object.freeze([15, 20, 30, 40]);

// Dropoff's drop by level (feet; the damage half of it, PF2e's falling).
export const DROPS = Object.freeze([30, 50, 75, 100, 120, 150, 180, 200, 240, 270, 300, 330, 360, 400, 420, 450, 480, 510, 540, 570]);

// The notes' materials (GM Core Table 11-4): pillars (Pillars), the central object (One Mass), gates and doors (Gates): Hit Points,
// Hardness, AC, and the Athletics DC to topple or remove it.
const PILLARS = Object.freeze([
    { material: "glass or ice", hp: 8, hardness: 2, dc: 15 },
    { material: "thin wood", hp: 12, hardness: 3, dc: 20 },
    { material: "thin metal or wood", hp: 20, hardness: 5, dc: 30 },
    { material: "stone", hp: 28, hardness: 7, dc: 40 },
    { material: "metal", hp: 36, hardness: 9, dc: 40 }
]);
const MASSES = Object.freeze([
    { material: "glass or ice structure", hp: 8, hardness: 2, dc: 15 },
    { material: "wooden structure", hp: 40, hardness: 10, dc: 42 },
    { material: "stone structure", hp: 56, hardness: 14, dc: 42 },
    { material: "metal structure", hp: 72, hardness: 18, dc: 42 }
]);
// (Gates by level — the notes' Gates 1-12, sturdier as the party can force or break more; Force Open at "exceptionally stuck", barred.
// Bars: a portcullis — seen and shot through, with cover.)
const GATES = Object.freeze([
    { upTo: 2, material: "wood door", hp: 40, hardness: 10, climb: 20, force: 20 },
    { upTo: 4, material: "wood portcullis", hp: 40, hardness: 10, climb: 10, force: 20, bars: true },
    { upTo: 6, material: "reinforced wood door", hp: 60, hardness: 15, climb: 15, force: 20 },
    { upTo: 9, material: "stone door", hp: 56, hardness: 14, climb: 30, force: 20 },
    { upTo: 12, material: "iron portcullis", hp: 72, hardness: 18, climb: 10, force: 30, bars: true },
    { upTo: Infinity, material: "iron door", hp: 72, hardness: 18, climb: 30, force: 20 }
]);

export const pillarAt = (level) => PILLARS[Math.min(tierOf(level), 3) + (level >= 18 ? 1 : 0)];
export const massAt = (level) => MASSES[tierOf(level)];
export const gateAt = (level) => GATES.find((gate) => level <= gate.upTo);

// A blank map of a battlefield.
function blank(name, level, width = 30, height = 20) {
    return { name, battlefield: name, level, width, height, blocked: new Set(), walls: new Set(), difficult: new Map(), heights: new Map(), footing: new Map(), climbDCs: new Map(), parapets: new Set(), cover: new Set(), mist: new Map(), objects: [], holes: [], spawns: { party: [], foes: [] }, climbDC: TIER_DC[tierOf(level)] };
}
// Spawns: columns from the front back, rows from the middle out (grid.js's layouts' order).
const spawnsFrom = (front, step, rows, columns = 6) => {
    const out = [];
    for (let col = 0; col < columns; col++) for (const row of rows) out.push(key(front + step * col, row));
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
const area = (x0, y0, x1, y1, each) => {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) each(x, y);
};
const leftRight = (map, rows = middleOut(5, 14), partyFront = 12, foesFront = 18) => {
    map.spawns.party = spawnsFrom(partyFront, -1, rows);
    map.spawns.foes = spawnsFrom(foesFront, 1, rows);
};
// A blob of squares about [x, y] — random, of about `size` squares.
function blob(rng, x, y, size, inside) {
    const out = new Set([key(x, y)]);
    let at = [x, y];
    for (let tries = 0; out.size < size && tries < size * 6; tries++) {
        const step = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(rng.next() * 4)];
        const next = [at[0] + step[0], at[1] + step[1]];
        if (!inside(next[0], next[1])) continue;
        out.add(key(next[0], next[1]));
        at = next;
    }
    return [...out];
}
const randomIn = (rng, lo, hi) => lo + Math.floor(rng.next() * (hi - lo + 1));

// Balconies: small overlooks, ideal for ranged attackers — four 15-foot ones, two by each side's start (above and below it), a parapet on
// the edge toward the field (standard cover against those below), two steps of stairs up toward the middle (5 feet each); their faces
// climbed at the level's DC. (2026-10-24, the user: each side's ranged attackers start on its overlooks — spawns.overlook; grid-fight.js
// fightsFromAfar. Before, a ranged monster had to walk 35 feet and up to one, and in a two-round fight never did.)
function balconies(level) {
    const map = blank("balconies", level);
    const deck = (x0, x1) => [1, 2, 17, 18].flatMap((y) => [x0, x0 + 1, x0 + 2].map((x) => key(x, y))).sort((a, b) => Math.abs(Number(a.split(",")[1]) - 9.5) - Math.abs(Number(b.split(",")[1]) - 9.5));
    map.spawns.overlook = { party: deck(5, 7), foes: deck(22, 24) };
    for (const [x0, x1, steps] of [[5, 7, [[8, 10], [9, 5]]], [22, 24, [[21, 10], [20, 5]]]]) {
        for (const [y0, y1, edge] of [[1, 2, 2], [17, 18, 17]]) {
            area(x0, y0, x1, y1, (x, y) => map.heights.set(key(x, y), 15));
            area(x0, edge, x1, edge, (x, y) => map.parapets.add(key(x, y)));
            for (const [x, feet] of steps) area(x, y0, x, y1, (sx, sy) => map.heights.set(key(sx, sy), feet));
        }
    }
    leftRight(map, middleOut(5, 14));
    return map;
}

// Broken Ground: rubble (difficult terrain; deep rubble uneven ground too), hillocks of inclines (a Climb up, 10 feet high), light
// undergrowth (difficult terrain, Take Cover in it) and heavy (greater difficult terrain, standard cover).
function broken(level, rng) {
    const map = blank("broken", level);
    const dc = TIER_DC[tierOf(level)];
    const inside = (x, y) => x >= 3 && x <= 26 && y >= 0 && y < 20;
    for (let i = 0; i < 6; i++) for (const square of blob(rng, randomIn(rng, 5, 24), randomIn(rng, 1, 18), 8, inside)) map.difficult.set(square, 2);
    for (let i = 0; i < 3; i++) for (const square of blob(rng, randomIn(rng, 6, 23), randomIn(rng, 2, 17), 6, inside)) {
        map.difficult.set(square, 2);
        map.footing.set(square, { kind: "uneven", dc, label: "deep rubble" });
    }
    for (let i = 0; i < 2; i++) {
        const [cx, cy] = [randomIn(rng, 8, 21), randomIn(rng, 4, 15)];
        area(cx - 1, cy - 1, cx + 1, cy + 1, (x, y) => map.heights.set(key(x, y), 10));
        area(cx - 2, cy - 2, cx + 2, cy + 2, (x, y) => {
            if (!map.heights.has(key(x, y))) map.footing.set(key(x, y), { kind: "incline", dc, label: "incline" });
        });
    }
    for (let i = 0; i < 3; i++) for (const square of blob(rng, randomIn(rng, 5, 24), randomIn(rng, 1, 18), 7, inside)) if (!map.footing.has(square)) map.difficult.set(square, Math.max(map.difficult.get(square) ?? 1, 2));
    for (let i = 0; i < 2; i++) for (const square of blob(rng, randomIn(rng, 6, 23), randomIn(rng, 2, 17), 6, inside)) {
        if (map.footing.has(square)) continue;
        map.difficult.set(square, 3);
        map.cover.add(square);
    }
    leftRight(map);
    for (const side of ["party", "foes"]) map.spawns[side] = map.spawns[side].filter((square) => !map.footing.has(square) && !map.heights.has(square));
    return map;
}

// Burrows: holes, hatches and access points — tight spaces (difficult terrain) with uneven footing about them; the foes come out of them
// near the party.
function burrows(level, rng) {
    const map = blank("burrows", level);
    const dc = TIER_DC[tierOf(level)];
    const holes = [];
    for (let tries = 0; holes.length < 8 && tries < 200; tries++) {
        const [x, y] = [randomIn(rng, 6, 24), randomIn(rng, 2, 17)];
        if (holes.some(([hx, hy]) => Math.abs(hx - x) < 3 && Math.abs(hy - y) < 3)) continue;
        holes.push([x, y]);
    }
    for (const [x, y] of holes) {
        map.difficult.set(key(x, y), 2);
        area(x - 1, y - 1, x + 1, y + 1, (ax, ay) => {
            if (ax < 0 || ay < 0 || ax >= map.width || ay >= map.height || (ax === x && ay === y)) return;
            map.footing.set(key(ax, ay), { kind: "uneven", dc, label: "broken footing" });
        });
    }
    map.holes = holes.map(([x, y]) => key(x, y));
    map.spawns.party = spawnsFrom(8, -1, middleOut(5, 14));
    // (Out of the holes nearest the party first, each hole's square and those about it.)
    const near = [...holes].sort((a, b) => Math.hypot(a[0] - 8, a[1] - 9.5) - Math.hypot(b[0] - 8, b[1] - 9.5));
    map.spawns.foes = near.flatMap(([x, y]) => [key(x, y), key(x + 1, y), key(x, y + 1), key(x - 1, y), key(x, y - 1)]).filter((square) => !map.spawns.party.slice(0, 12).includes(square));
    return map;
}

// Dropoff: deadly edges — a walkway along a chasm on either side, narrowing to a 10-foot neck in the middle; the chasm as deep as the
// level's drop (the notes' table), a fall into it out of the fight.
function dropoff(level) {
    const map = blank("dropoff", level);
    const depth = DROPS[Math.max(0, Math.min(DROPS.length - 1, level - 1))];
    area(0, 0, 29, 19, (x, y) => {
        const neck = x >= 12 && x <= 17;
        const path = neck ? y >= 9 && y <= 10 : y >= 6 && y <= 13;
        if (!path) map.heights.set(key(x, y), -depth);
    });
    map.fallOut = 25;
    map.drop = depth;
    leftRight(map, middleOut(6, 13), 11, 18);
    return map;
}

// The side the party is on at a gate or a rampart: "attack" (the foes hold it — the default) or "defend".
const holds = (side) => (side === "defend" ? "party" : "foes");

// Gates: a wall across the field (20 feet; Climb at the level's DC) and a gate in it, a door or portcullis for the level (the notes' Gates
// table: its Hit Points, Hardness, AC 0, Force Open and Climb DCs). Shut, it stands 15 feet high; broken or forced open, it's passage.
function gates(level, rng, side = "attack") {
    const map = blank("gates", level);
    const gate = gateAt(level);
    area(15, 0, 15, 19, (x, y) => {
        if (y === 9 || y === 10) return;
        map.heights.set(key(x, y), 20);
    });
    map.objects.push({ id: "gate", kind: "gate", name: gate.material, squares: [key(15, 9), key(15, 10)], hp: gate.hp, maxHp: gate.hp, hardness: gate.hardness, ac: 0, forceDC: gate.force, climbDC: gate.climb, height: 15, bars: Boolean(gate.bars), closed: true });
    for (const square of [key(15, 9), key(15, 10)]) {
        map.heights.set(square, 15);
        map.climbDCs.set(square, gate.climb);
    }
    const outside = spawnsFrom(10, -1, middleOut(5, 14));
    const inside = spawnsFrom(20, 1, middleOut(5, 14));
    const defenders = holds(side);
    map.spawns[defenders] = inside;
    map.spawns[defenders === "party" ? "foes" : "party"] = outside;
    map.side = side;
    return map;
}

// High and Low: two areas and a rift between — a 30-foot one to Climb (the level's DC) until 7th level, a 60-foot one from 7th (when
// fliers are about); the foes on the high ground, the party below.
function highLow(level) {
    const map = blank("high-low", level);
    const rise = level >= 7 ? 60 : 30;
    area(15, 0, 29, 19, (x, y) => map.heights.set(key(x, y), rise));
    leftRight(map, middleOut(5, 14), 11, 18);
    map.rise = rise;
    return map;
}

// Narrow Path: a long confined lane (40 by 30 feet between walls of rubble), its middle a 5-foot ledge over 20-foot drops (a narrow
// surface: Balance at the level's DC, a fall off it on a failure), with rubble and undergrowth in the wider stretches.
function narrowPath(level, rng) {
    const map = blank("narrow-path", level, 40, 8);
    const dc = TIER_DC[tierOf(level)];
    area(0, 0, 39, 7, (x, y) => {
        if (y === 0 || y === 7) map.blocked.add(key(x, y));
    });
    area(14, 1, 25, 6, (x, y) => {
        if (y === 3) map.footing.set(key(x, y), { kind: "narrow", dc, label: "ledge" });
        else map.heights.set(key(x, y), -20);
    });
    for (const x0 of [4, 29]) for (const square of blob(rng, x0 + randomIn(rng, 0, 5), randomIn(rng, 2, 5), 6, (x, y) => x >= x0 && x <= x0 + 6 && y >= 1 && y <= 6)) map.difficult.set(square, 2);
    map.spawns.party = spawnsFrom(13, -1, [3, 2, 4, 1, 5, 6], 8);
    map.spawns.foes = spawnsFrom(26, 1, [3, 2, 4, 1, 5, 6], 8);
    return map;
}

// Obscura: fog over all of it — a creature more than 5 feet away is concealed (grid-fight.js mistBetween).
function obscura(level) {
    const map = blank("obscura", level);
    area(0, 0, 29, 19, (x, y) => map.mist.set(key(x, y), "fog"));
    leftRight(map);
    return map;
}

// One Mass: a huge object at the centre (30 feet across, 30 high) — glass or ice, wood, stone or metal by the level (the notes' table) —
// that the fight goes round; broken, rubble.
function oneMass(level) {
    const map = blank("one-mass", level);
    const mass = massAt(level);
    const squares = [];
    area(12, 7, 17, 12, (x, y) => {
        squares.push(key(x, y));
        map.blocked.add(key(x, y));
    });
    map.objects.push({ id: "mass", kind: "mass", name: mass.material, squares, hp: mass.hp, maxHp: mass.hp, hardness: mass.hardness, ac: 0, dc: mass.dc, height: 30 });
    leftRight(map, middleOut(5, 14), 9, 20);
    return map;
}

// Pillars: 1d6 tall, narrow obstacles (20 feet; the level's material, the notes' table) — cover; knocked over (Athletics at its DC) or
// broken, one falls in a line as long as it's tall (grid-fight.js / actions.js topple).
function pillars(level, rng) {
    const map = blank("pillars", level);
    const pillar = pillarAt(level);
    const count = rng.die(6);
    const placed = [];
    for (let tries = 0; placed.length < count && tries < 200; tries++) {
        const [x, y] = [randomIn(rng, 9, 20), randomIn(rng, 3, 16)];
        if (placed.some(([px, py]) => Math.abs(px - x) < 3 && Math.abs(py - y) < 3)) continue;
        placed.push([x, y]);
    }
    for (const [index, [x, y]] of placed.entries()) {
        map.blocked.add(key(x, y));
        map.objects.push({ id: `pillar${index + 1}`, kind: "pillar", name: `${pillar.material} pillar`, squares: [key(x, y)], hp: pillar.hp, maxHp: pillar.hp, hardness: pillar.hardness, ac: 0, dc: pillar.dc, height: 20 });
    }
    leftRight(map);
    for (const side of ["party", "foes"]) map.spawns[side] = map.spawns[side].filter((square) => !map.blocked.has(square));
    return map;
}

// Rampart: a 10-foot-thick wall (20 feet; a wall-walk on top, a parapet on its outer edge, stairs down inside; Climb its face at the
// level's DC) and a gatehouse in it with the level's gate (as Gates). The defenders on the wall-walk and inside; the attackers outside.
function rampart(level, rng, side = "attack") {
    const map = blank("rampart", level);
    const gate = gateAt(level);
    area(15, 0, 16, 19, (x, y) => {
        if (y === 9 || y === 10) return;
        map.heights.set(key(x, y), 20);
    });
    area(15, 0, 15, 19, (x, y) => {
        if (y !== 9 && y !== 10) map.parapets.add(key(x, y));
    });
    for (const y0 of [1, 17]) {
        area(17, y0, 17, y0 + 1, (x, y) => map.heights.set(key(x, y), 15));
        area(18, y0, 18, y0 + 1, (x, y) => map.heights.set(key(x, y), 10));
        area(19, y0, 19, y0 + 1, (x, y) => map.heights.set(key(x, y), 5));
    }
    const squares = [key(15, 9), key(15, 10), key(16, 9), key(16, 10)];
    map.objects.push({ id: "gate", kind: "gate", name: gate.material, squares: [key(15, 9), key(15, 10)], hp: gate.hp, maxHp: gate.hp, hardness: gate.hardness, ac: 0, forceDC: gate.force, climbDC: gate.climb, height: 15, bars: Boolean(gate.bars), closed: true });
    for (const square of squares.slice(0, 2)) {
        map.heights.set(square, 15);
        map.climbDCs.set(square, gate.climb);
    }
    const walk = [];
    for (const y of middleOut(0, 19)) if (y !== 9 && y !== 10) walk.push(key(16, y), key(15, y));
    const inside = spawnsFrom(21, 1, middleOut(5, 14));
    const outside = spawnsFrom(10, -1, middleOut(5, 14));
    const defenders = holds(side);
    map.spawns[defenders] = [...walk.slice(0, 8), ...inside];
    map.spawns[defenders === "party" ? "foes" : "party"] = outside;
    map.side = side;
    return map;
}

// Sky and Underwater: nothing — no floor; everyone flies or swims, in three dimensions (grid-fight.js / actions.js, the void).
function emptyField(name, level) {
    const map = blank(name, level);
    map.void = name === "underwater" ? "water" : "sky";
    leftRight(map);
    return map;
}

const MAKERS = { balconies, broken, burrows, dropoff, gates, "high-low": highLow, "narrow-path": narrowPath, obscura, "one-mass": oneMass, pillars, rampart, sky: (level) => emptyField("sky", level), underwater: (level) => emptyField("underwater", level) };

// A battlefield's map for a fight: { level (the party's), side (Gates, Rampart: "attack" | "defend"), rng (the fight's) }.
export function battlefieldMap(name, { level = 1, side = "attack", rng } = {}) {
    const make = MAKERS[name];
    if (!make) return null;
    const lv = Math.max(1, Math.min(25, Math.round(Number(level) || 1)));
    const map = make(lv, rng ?? { next: Math.random, die: (sides) => 1 + Math.floor(Math.random() * sides) }, side);
    // (No one starts down a chasm or in a wall.)
    for (const team of ["party", "foes"]) map.spawns[team] = map.spawns[team].filter((square) => !map.blocked.has(square) && !((map.heights.get(square) ?? 0) < 0));
    return map;
}
