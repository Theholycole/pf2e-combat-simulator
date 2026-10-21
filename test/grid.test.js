import test from "node:test";
import assert from "node:assert/strict";

import { LAYOUTS, burstSquares, cheapestTo, coneSquares, distanceFeet, emanationSquares, feetBetween, flanks, layout, lineSquares, placeSide, reachable, reaches, sightLine, spaceOf } from "../src/engine/grid.js";

// The square grid (2026-10-21, the user: "build an option for grid based movement in the simulator … add choke points").

const open = (width = 20, height = 20) => ({ width, height, blocked: new Set(), walls: new Set(), difficult: new Map() });
const at = (x, y, size = "medium", reach = 5) => ({ square: [x, y], size, reach });

test("PF2e distances: every second diagonal 10 feet; spaces by size; reach, and 10-foot reach's diagonal", () => {
    assert.deepEqual([feetBetween(1, 1), feetBetween(2, 2), feetBetween(3, 3), feetBetween(4, 1)], [5, 15, 20, 20]);
    assert.deepEqual(["tiny", "small", "medium", "large", "huge", "gargantuan"].map((size) => spaceOf({ size })), [1, 1, 1, 2, 3, 4]);
    assert.equal(distanceFeet(at(0, 0), at(1, 1)), 5, "diagonally beside");
    assert.equal(distanceFeet(at(0, 0, "large"), at(3, 0)), 10, "a Large space's far edge counts");
    assert.ok(reaches(at(0, 0), at(1, 1)) && !reaches(at(0, 0), at(2, 0)));
    assert.ok(reaches(at(0, 0, "medium", 10), at(2, 2)), "10-foot reach: two squares on the diagonal");
    assert.ok(!reaches(at(0, 0, "medium", 10), at(3, 0)));
});

test("paths: around blocked squares, through walls never, difficult terrain doubled; allies passed through, foes not", () => {
    const map = open(10, 10);
    const mover = at(0, 0);
    assert.equal(reachable(map, mover).get("4,0").cost, 20);
    assert.equal(reachable(map, mover).get("2,2").cost, 15, "two diagonals: 5 + 10");
    map.difficult.set("1,0", 2);
    assert.equal(reachable(map, mover).get("1,0").cost, 10, "into difficult terrain: 10 feet");
    map.difficult.set("1,0", 3);
    assert.equal(cheapestTo(map, mover, (x, y) => x === 2 && y === 0).cost, 15, "around greater difficult terrain on the diagonals (5 + 10)");
    map.blocked = new Set(["1,0", "1,1", "1,2"]);
    assert.equal(cheapestTo(map, mover, (x, y) => x === 2 && y === 0).cost, 35, "around the wall of squares: down, round and up");
    const walled = open(3, 1);
    walled.walls = new Set(["0,0|1,0"]);
    assert.equal(cheapestTo(walled, at(0, 0), (x) => x === 2), null, "a wall between two squares");
    const foes = new Set(["1,0", "1,1"]);
    const corridor = { ...open(3, 2) };
    assert.equal(cheapestTo(corridor, at(0, 0), (x) => x === 2, { blockedBy: foes }), null, "foes block the way");
    assert.ok(cheapestTo(corridor, at(0, 0), (x) => x === 2, { occupied: foes }), "allies don't");
    assert.equal(cheapestTo(corridor, at(0, 0), (x, y) => x === 1 && y === 0, { occupied: foes }), null, "but no ending in their space");
});

test("areas: a burst from an intersection, an emanation around a space, a cone and a line", () => {
    const map = open(20, 20);
    assert.equal(burstSquares(map, 10, 10, 5).length, 4, "a 5-foot burst: the four squares at the corner");
    assert.equal(burstSquares(map, 10, 10, 10).length, 12, "10 feet: 4 by 4 less the corners");
    assert.equal(emanationSquares(map, at(10, 10), 5).length, 9);
    const cone = coneSquares(map, at(10, 10), [20, 10.5], 15);
    assert.ok(cone.includes("11,10") && cone.includes("13,10") && !cone.includes("9,10") && !cone.includes("14,10"));
    const line = lineSquares(map, at(10, 10), [20, 10.5], 30);
    assert.deepEqual(line, ["11,10", "12,10", "13,10", "14,10", "15,10", "16,10"]);
});

test("flanking: opposite sides or corners; line of effect and cover", () => {
    const target = at(5, 5);
    assert.ok(flanks(at(4, 5), at(6, 5), target), "left and right");
    assert.ok(flanks(at(4, 4), at(6, 6), target), "opposite corners");
    assert.ok(!flanks(at(4, 5), at(5, 4), target), "a corner apart");
    assert.ok(flanks(at(3, 5), at(6, 5, "large"), at(4, 5, "large")), "a Large foe's sides");
    const map = open(10, 10);
    assert.deepEqual(sightLine(map, at(0, 5), at(9, 5)), { effect: true, cover: 0 });
    assert.deepEqual(sightLine(map, at(0, 5), at(9, 5), [at(4, 5)]), { effect: true, cover: 1 }, "a creature between: lesser cover");
    map.blocked.add("4,5");
    assert.equal(sightLine(map, at(0, 5), at(9, 5)).effect, false, "a wall: no line of effect");
});

test("the layouts: the sides 30 feet apart, a choke point in each but the open field", () => {
    assert.deepEqual([...LAYOUTS], ["open", "corridor", "doorway", "bridge"]);
    for (const name of LAYOUTS) {
        const map = layout(name);
        const party = placeSide(map, [{ id: "a" }, { id: "b" }, { id: "big", size: "large" }], map.spawns.party);
        const foes = placeSide(map, [{ id: "x" }], map.spawns.foes);
        assert.equal(Object.keys(party).length, 3, name);
        assert.equal(distanceFeet({ square: party.a }, { square: foes.x }), name === "doorway" || name === "open" || name === "bridge" ? 30 : 30, name);
        const way = cheapestTo(map, { square: foes.x }, (x, y) => reaches({ square: [x, y] }, { square: party.a }));
        assert.ok(way, `${name}: a way to the party`);
    }
    // (The doorway: the way runs through the door's one square.)
    const door = layout("doorway");
    const party = placeSide(door, [{ id: "a" }], door.spawns.party);
    const way = cheapestTo(door, { square: placeSide(door, [{ id: "x" }], door.spawns.foes).x }, (x, y) => reaches({ square: [x, y] }, { square: party.a }));
    assert.ok(way.path.includes("15,9"));
});
