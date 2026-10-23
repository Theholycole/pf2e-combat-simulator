import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { fall, footingShaken, stride } from "../src/engine/actions.js";
import { isOffGuard } from "../src/engine/combatant.js";
import { BATTLEFIELDS, DROPS, battlefieldMap, inLevels, isBattlefield, tierOf, TIER_DC } from "../src/engine/battlefields.js";
import { coveredSquares, distanceFeet, feetBetween, reachable, squareOf } from "../src/engine/grid.js";
import { gridMap } from "../src/engine/grid-fight.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { createRng } from "../src/engine/rng.js";
import { standardParty } from "../src/engine/party.js";

// The user's battlefields (2026-10-22, battlefields.js; heights, climbs, falls and footing in grid.js, grid-fight.js and actions.js).

const foe = (id, level = 3) => ({ ...moderateCreatureAt(level, id, `Foe ${id}`), side: "foes" });
const pc = (id, level = 3) => ({ ...moderateCreatureAt(level, id, `PC ${id}`), side: "party", kind: "pc", reactions: { aoo: true, shieldBlock: false } });
const field = (extra, squares) => ({ map: { width: 20, height: 10, blocked: [], walls: [], difficult: {}, spawns: { party: [], foes: [] }, ...extra }, squares });
const fight = (combatants, grid, seed = 1) => createFightState({ combatants }, { morale: false, grid }, seed);
const heightsOver = (x0, x1, feet) => {
    const out = {};
    for (let x = x0; x <= x1; x++) for (let y = 0; y < 10; y++) out[`${x},${y}`] = feet;
    return out;
};

test("the catalog: the user's eleven battlefields and the two with no floor; levels, DC tiers by proficiency, Dropoff's drops", () => {
    assert.equal(BATTLEFIELDS.length, 13);
    assert.ok(isBattlefield("pillars") && isBattlefield("sky") && !isBattlefield("corridor"));
    assert.equal(inLevels("burrows", 5), true);
    assert.equal(inLevels("burrows", 6), false);
    assert.equal(inLevels("broken", 20), true, "no levels: every level");
    assert.deepEqual([1, 3, 7, 15].map((level) => TIER_DC[tierOf(level)]), [15, 20, 30, 40]);
    assert.deepEqual([tierOf(2), tierOf(6), tierOf(14)], [0, 1, 2]);
    assert.equal(DROPS[0], 30);
    assert.equal(DROPS[19], 570);
});

test("every battlefield's map: the same for the same dice, both sides' spawns fit, at low and high levels", () => {
    for (const { name } of BATTLEFIELDS) {
        for (const level of [1, 8, 18]) {
            const a = gridMap({ map: battlefieldMap(name, { level, rng: createRng(7) }) });
            const b = gridMap({ map: battlefieldMap(name, { level, rng: createRng(7) }) });
            assert.deepEqual([...(a.heights ?? [])], [...(b.heights ?? [])], name);
            assert.deepEqual(a.spawns, b.spawns, name);
            for (const side of ["party", "foes"]) {
                const fits = a.spawns[side].filter((spawn) => coveredSquares(a, ...squareOf(spawn), 1));
                assert.ok(fits.length >= 8, `${name} ${level} ${side}: ${fits.length}`);
                assert.ok(a.spawns[side].every((spawn) => (a.heights?.get(spawn) ?? 0) >= 0), `${name}: no one starts down a chasm`);
            }
        }
    }
    const dropoff = battlefieldMap("dropoff", { level: 20 });
    assert.equal(Math.min(...dropoff.heights.values()), -570);
    assert.equal(battlefieldMap("high-low", { level: 6 }).rise, 30);
    assert.equal(battlefieldMap("high-low", { level: 7 }).rise, 60);
    const pillars = battlefieldMap("pillars", { level: 3, rng: createRng(1) });
    assert.ok(pillars.objects.length >= 1 && pillars.objects.length <= 6 && pillars.objects.every((pillar) => pillar.hardness === 3));
    assert.equal(battlefieldMap("gates", { level: 10, side: "defend" }).spawns.party[0], "20,9", "defending: the party inside");
    assert.equal(battlefieldMap("gates", { level: 10 }).spawns.party[0], "10,9", "attacking (the default): outside");
});

test("heights: distance counts the height between; a ledge is a climb its Speed's worth a 5 feet, a flier over it", () => {
    assert.equal(feetBetween(0, 0, 3), 15);
    assert.equal(feetBetween(4, 0, 3), 25, "every second diagonal 10, up as across");
    const state = fight([pc("p"), foe("x")], field({ heights: heightsOver(10, 19, 15), climbDC: 15 }, { p: [9, 5], x: [10, 5] }));
    const [p, x] = ["p", "x"].map((id) => state.byId.get(id));
    assert.equal(x.z, 15);
    assert.equal(distanceFeet(p, x), 15, "beside it and 15 feet up: its top 10 feet below the other's bottom");
    const walk = reachable(state.grid, p, { maxCost: 25 });
    assert.equal(walk.has("10,5"), false, "15 feet up: three Climbs");
    assert.equal(reachable(state.grid, p, { maxCost: 25, flying: true }).has("10,5"), true);
});

test("Climb: Athletics against the DC, 5 feet an action; halfway, hanging off-guard; at the top, on it", () => {
    const state = fight([pc("p"), foe("x")], field({ heights: heightsOver(10, 19, 15), climbDC: 5 }, { p: [9, 5], x: [12, 5] }), 4);
    const p = state.byId.get("p");
    p.skills = { ...(p.skills ?? {}), athletics: 30 };
    stride(state, p, { kind: "engage", targetId: "x" });
    assert.ok(p.climbing && [5, 10].includes(p.elevation), "5 feet of 15 (10 on a critical success)");
    assert.equal(isOffGuard(p), true);
    for (let i = 0; i < 3 && p.climbing; i++) stride(state, p, { kind: "engage", targetId: "x" });
    assert.equal(p.climbing, null);
    assert.equal(p.z, 15);
    assert.ok(p.square[0] >= 10, "on top");
});

test("a fall: half the distance in bludgeoning, prone; Grab an Edge first off an edge; Dropoff's chasm takes it out of the fight", () => {
    const state = fight([pc("p"), foe("x")], field({}, { p: [2, 5], x: [15, 5] }));
    const p = state.byId.get("p");
    const before = p.hp.value;
    fall(state, p, 40);
    assert.equal(before - p.hp.value, 20);
    assert.equal(Boolean(p.cond.prone), true);
    const deep = fight([pc("p"), foe("x")], field({ heights: heightsOver(0, 4, -300), fallOut: 25 }, { p: [6, 5], x: [15, 5] }));
    const q = deep.byId.get("p");
    q.hp.value = q.hp.max = 500;
    q.reactionUsed = true;
    q.reactions = {};
    fall(deep, q, 300);
    assert.equal(q.banished, true, "fell out of the fight");
    assert.notEqual(q.status, "active");
});

test("footing: off-guard on uneven ground; a failed Reflex there prone, off a narrow surface a fall", () => {
    const footing = { "5,5": { kind: "narrow", dc: 40 }, "6,5": { kind: "narrow", dc: 40 } };
    const below = { "5,4": -20, "5,6": -20, "6,4": -20, "6,6": -20, "4,4": -20, "4,6": -20 };
    const state = fight([pc("p"), foe("x")], field({ footing, heights: below }, { p: [5, 5], x: [15, 5] }), 2);
    const p = state.byId.get("p");
    assert.equal(p.footing?.kind, "narrow");
    assert.equal(isOffGuard(p), true);
    p.reactionUsed = true;
    footingShaken(state, p);
    assert.equal(p.z, -20, "down off the ledge");
    assert.equal(Boolean(p.cond.prone), true);
    // (Grab an Edge: caught, back on the ledge, prone.)
    const again = fight([pc("p"), foe("x")], field({ footing, heights: below, climbDC: 5 }, { p: [5, 5], x: [15, 5] }), 2);
    const q = again.byId.get("p");
    q.skills = { ...(q.skills ?? {}), acrobatics: 30 };
    footingShaken(again, q);
    assert.deepEqual([q.z, q.square, Boolean(q.cond.prone), q.reactionUsed], [0, [5, 5], true, true]);
});

test("whole fights run on every battlefield, at its levels and outside them", () => {
    for (const { name } of BATTLEFIELDS.filter((entry) => entry.name !== "sky" && entry.name !== "underwater")) {
        for (const [level, foeLevel] of [[2, 1], [9, 8]]) {
            const result = simulate({ combatants: [...standardParty(level), foe("a", foeLevel), foe("b", foeLevel), foe("c", foeLevel), foe("d", foeLevel)] }, { maxRounds: 8, grid: { layout: name } }, 3);
            assert.ok(result.outcome, `${name} ${level}`);
        }
    }
});
