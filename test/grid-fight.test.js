import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { stride } from "../src/engine/actions.js";
import { gridAreaSets, gridFlanked, gridStrides, forcedMove } from "../src/engine/grid-fight.js";
import { canAct } from "../src/engine/combatant.js";
import { engagedEnemies, sameMelee } from "../src/engine/space.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { distanceFeet } from "../src/engine/grid.js";
import { standardParty } from "../src/engine/party.js";

// Fights on the square grid (2026-10-21, grid-fight.js).

const foe = (id, level = 3) => ({ ...moderateCreatureAt(level, id, `Foe ${id}`), side: "foes" });
const pc = (id, level = 3) => ({ ...moderateCreatureAt(level, id, `PC ${id}`), side: "party", kind: "pc", reactions: { aoo: true, shieldBlock: false } });
const open = (squares) => ({ map: { width: 20, height: 10, blocked: [], walls: [], difficult: {}, spawns: { party: [], foes: [] } }, squares });
const fight = (combatants, grid, seed = 1) => createFightState({ combatants }, { morale: false, grid }, seed);

test("on the grid: the sides at their spawns, 30 feet apart; bands and Melees from the squares", () => {
    const state = fight([...standardParty(3), foe("a"), foe("b")], { layout: "open" });
    assert.ok(state.grid && state.list.every((c) => Array.isArray(c.square)));
    assert.ok(state.list.every((c) => c.band === "near" || c.band === "far"));
    assert.equal(state.melees.size, 0, "no one in reach yet");
    const near = fight([pc("p"), foe("x")], open({ p: [5, 5], x: [6, 5] }));
    assert.ok(sameMelee(near.byId.get("p"), near.byId.get("x")) && near.byId.get("p").band === "engaged");
    assert.equal(engagedEnemies(near, near.byId.get("p")).length, 1);
});

test("a Stride to a foe: along its way, as far as its Speed; in reach, a Melee", () => {
    const state = fight([pc("p"), foe("x")], open({ p: [2, 5], x: [9, 5] }));
    const x = state.byId.get("x");
    assert.equal(gridStrides(state, x, state.byId.get("p")), 2, "30 feet to come beside it: two Strides at 25");
    stride(state, x, { kind: "engage", targetId: "p" });
    assert.equal(distanceFeet(x, state.byId.get("p")), 10, "25 feet on: one square short");
    assert.ok(!sameMelee(x, state.byId.get("p")));
    stride(state, x, { kind: "engage", targetId: "p" });
    assert.ok(sameMelee(x, state.byId.get("p")) && x.band === "engaged");
});

test("leaving a foe's reach sets off its Reactive Strike; a Step out doesn't", () => {
    const state = createFightState({ combatants: [pc("p"), foe("x")] }, { morale: false, grid: open({ p: [5, 5], x: [6, 5] }) }, 3);
    state.log = [];
    stride(state, state.byId.get("x"), { kind: "toNear" });
    assert.match(state.log.join("\n"), /PC p Attack of Opportunity/);
    assert.ok(!sameMelee(state.byId.get("x"), state.byId.get("p")));
});

test("an area on the grid catches those its template covers: the bunched foes, not the one apart", () => {
    const state = fight([pc("p"), foe("a"), foe("b"), foe("c")], open({ p: [1, 5], a: [8, 5], b: [9, 5], c: [17, 1] }));
    const [best] = gridAreaSets(state, state.byId.get("p"), { type: "burst", value: 10 }, 120);
    assert.deepEqual(best.targets.map((c) => c.id).sort(), ["a", "b"]);
    const line = gridAreaSets(state, state.byId.get("p"), { type: "line", value: 60 }, null);
    assert.ok(line.some((set) => set.targets.length === 2), "a line through both");
});

test("pushed away and pulled in along the line between them; flanked across from an ally", () => {
    const state = fight([pc("p"), pc("q"), foe("x")], open({ p: [4, 5], q: [6, 5], x: [5, 5] }));
    const [p, q, x] = ["p", "q", "x"].map((id) => state.byId.get(id));
    assert.equal(gridFlanked(state, p, x, canAct), true);
    q.square = [5, 4];
    assert.equal(gridFlanked(state, p, x, canAct), false, "a corner apart");
    assert.equal(forcedMove(state, x, p, 1, 10), 10);
    assert.deepEqual(x.square, [7, 5]);
});

test("a wall between: no line of effect for a ranged Strike's planning; whole fights run on each layout", () => {
    const walled = { map: { width: 20, height: 10, blocked: ["8,3", "8,4", "8,5", "8,6", "8,7"], walls: [], difficult: {}, spawns: { party: [], foes: [] } }, squares: { p: [2, 5], x: [14, 5] } };
    const state = fight([pc("p"), foe("x")], walled);
    assert.equal(gridStrides(state, state.byId.get("x"), state.byId.get("p")) >= 3, true, "around the wall");
    for (const layout of ["open", "corridor", "doorway", "bridge"]) {
        const result = simulate({ combatants: [...standardParty(5), foe("a", 3), foe("b", 3), foe("c", 3), foe("d", 3)] }, { maxRounds: 10, grid: { layout } }, 2);
        assert.ok(result.outcome, layout);
    }
});

test("a scene as a grid: its walls between squares, a shut door's too; difficult regions; tokens' squares and spawns about them", async () => {
    const { sceneGrid, wallEdges } = await import("../src/adapter/map.js");
    const frame = { size: 100, x: 0, y: 0, width: 4, height: 3 };
    // A wall along the line x = 200 (between columns 1 and 2), from y 0 to 200: rows 0 and 1.
    assert.deepEqual(wallEdges([[200, 0, 200, 200]], frame).sort(), ["1,0|2,0", "1,1|2,1"]);
    const grid = sceneGrid({ frame, segments: [[200, 0, 200, 200]], difficult: [{ squares: [[3, 2]], factor: 2 }], tokens: { p: { square: [0, 2], side: "party" }, x: { square: [3, 0], side: "foes" } } });
    assert.deepEqual([grid.map.width, grid.map.height, grid.map.difficult], [4, 3, { "3,2": 2 }]);
    assert.deepEqual(grid.squares, { p: [0, 2], x: [3, 0] });
    assert.equal(grid.map.spawns.party[0], "0,2");
    const state = fight([pc("p"), foe("x")], grid);
    assert.equal(gridStrides(state, state.byId.get("x"), state.byId.get("p")) >= 1, true);
    assert.deepEqual(state.byId.get("x").square, [3, 0]);
});
