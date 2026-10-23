import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { breachGate, fall, footingShaken, leaveField, stride, toppleObject } from "../src/engine/actions.js";
import { breathTurnEnd, hoverTurnStart } from "../src/engine/void.js";
import { canCast } from "../src/engine/spells.js";
import { sightDC } from "../src/engine/environment.js";
import { scoreOptions } from "../src/engine/planner.js";
import { isOffGuard } from "../src/engine/combatant.js";
import { BATTLEFIELDS, DROPS, battlefieldMap, inLevels, isBattlefield, tierOf, TIER_DC } from "../src/engine/battlefields.js";
import { coveredSquares, distanceFeet, feetBetween, reachable, sightLine, squareOf } from "../src/engine/grid.js";
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
    for (const { name } of BATTLEFIELDS) {
        for (const [level, foeLevel] of [[2, 1], [9, 8]]) {
            const result = simulate({ combatants: [...standardParty(level), foe("a", foeLevel), foe("b", foeLevel), foe("c", foeLevel), foe("d", foeLevel)] }, { maxRounds: 8, grid: { layout: name } }, 3);
            assert.ok(result.outcome, `${name} ${level}`);
        }
    }
});

test("a closed gate: paths go through it at the cost of forcing it; Force Open (or Strikes) opens it, a critical failure jams it", () => {
    const gate = { id: "gate", kind: "gate", name: "wood door", squares: ["10,5"], hp: 40, maxHp: 40, hardness: 10, ac: 0, forceDC: 5, climbDC: 20, height: 15, closed: true };
    const wall = {};
    for (let y = 0; y < 10; y++) wall[`10,${y}`] = y === 5 ? 15 : 20;
    const state = fight([pc("p"), foe("x")], field({ heights: wall, climbDCs: { "10,5": 20 }, objects: [gate], battlefield: "gates", level: 3 }, { p: [9, 5], x: [15, 5] }), 3);
    const p = state.byId.get("p");
    p.skills = { ...(p.skills ?? {}), athletics: 20 };
    const g = state.grid.objects[0];
    stride(state, p, { kind: "engage", targetId: "x" });
    assert.equal(g.closed, false, "forced open");
    assert.equal(state.grid.heights.has("10,5"), false, "its square passage");
    stride(state, p, { kind: "engage", targetId: "x" });
    assert.ok(p.square[0] > 10, "through it");
    const jam = fight([pc("p"), foe("x")], field({ heights: wall, objects: [{ ...gate, forceDC: 60 }], battlefield: "gates", level: 3 }, { p: [9, 5], x: [15, 5] }), 3);
    const q = jam.byId.get("p");
    q.strikes = [];
    for (let i = 0; i < 20 && !jam.grid.objects[0].jammed; i++) {
        q.attacksThisTurn = 0;
        breachGate(jam, q, jam.grid.objects[0]);
    }
    assert.equal(jam.grid.objects[0].jammed, true);
    assert.equal(jam.grid.objects[0].closed, true);
});

test("a pillar knocked over falls in a line away from the creature: a basic Reflex save there, rubble after", () => {
    const pillar = { id: "pillar1", kind: "pillar", name: "stone pillar", squares: ["6,5"], hp: 28, maxHp: 28, hardness: 7, ac: 0, dc: 5, height: 20 };
    const state = fight([pc("p"), foe("x"), foe("y")], field({ blocked: ["6,5"], objects: [pillar], battlefield: "pillars", level: 5 }, { p: [5, 5], x: [8, 5], y: [8, 8] }), 2);
    const [p, x, y] = ["p", "x", "y"].map((id) => state.byId.get(id));
    p.skills = { ...(p.skills ?? {}), athletics: 20 };
    const before = [x.hp.value, y.hp.value];
    state.log = [];
    toppleObject(state, p, state.grid.objects[0]);
    assert.equal(state.grid.objects[0].fallen, true);
    assert.equal(state.grid.blocked.has("6,5"), false);
    assert.deepEqual(["6,5", "7,5", "10,5"].map((square) => state.grid.difficult.get(square)), [2, 2, 2], "its square and four beyond: rubble");
    assert.match(state.log.join("\n"), /falls on Foe x/);
    assert.ok(x.hp.value < before[0] || /Foe x: critical success/.test(state.log.join("\n")), "the one in the line");
    assert.equal(y.hp.value, before[1], "not the one beside it");
    // (The planner: worth knocking over onto foes, from beside it.)
    const plan = fight([pc("p"), foe("x"), foe("y")], field({ blocked: ["6,5"], objects: [{ ...pillar }], battlefield: "pillars", level: 5 }, { p: [5, 5], x: [8, 5], y: [9, 5] }), 2);
    plan.byId.get("p").skills = { athletics: 20 };
    const pp = plan.byId.get("p");
    pp.actionsLeft = 3;
    const { options } = scoreOptions(plan, pp);
    assert.ok(options.some((option) => option.action?.type === "topple"), "offered");
});

test("Obscura's fog conceals beyond 5 feet; heavy undergrowth gives cover", () => {
    const mist = {};
    for (let x = 0; x < 20; x++) for (let y = 0; y < 10; y++) mist[`${x},${y}`] = "fog";
    const state = fight([pc("p"), foe("x"), foe("y")], field({ mist, battlefield: "obscura", level: 3 }, { p: [5, 5], x: [6, 5], y: [12, 5] }));
    const [p, x, y] = ["p", "x", "y"].map((id) => state.byId.get(id));
    assert.equal(sightDC(state, p, x), 0, "beside it: seen");
    assert.equal(sightDC(state, p, y), 5, "further: concealed");
    const brush = fight([pc("p"), foe("x")], field({ cover: ["10,5"], difficult: { "10,5": 3 }, battlefield: "broken", level: 3 }, { p: [5, 5], x: [10, 5] }));
    assert.equal(sightLine(brush.grid, brush.byId.get("p"), brush.byId.get("x")).cover, 2);
});

test("Sky: no fly Speed, out of the fight; a flier's turn spends an action to Fly unless it Strides", () => {
    const flier = (c) => ({ ...c, flies: true, flySpeed: 40 });
    const state = createFightState({ combatants: [flier(pc("p")), pc("q"), flier(foe("x"))] }, { morale: false, grid: { layout: "sky" } }, 1);
    const [p, q, x] = ["p", "q", "x"].map((id) => state.byId.get(id));
    assert.notEqual(q.status, "active", "fell");
    assert.equal(p.speed, 40, "its fly Speed");
    p.actionsLeft = 3;
    hoverTurnStart(state, p);
    assert.equal(p.actionsLeft, 2);
    stride(state, p, { kind: "engage", targetId: "x" });
    assert.equal(p.actionsLeft, 3, "its Stride its Fly: the action back");
    assert.ok(x);
});

test("Underwater: Swim without a swim Speed, off-guard, resistance 5 to acid and fire, the Strikes' rules, no fire; breath runs out", () => {
    const fish = { ...foe("x"), swimSpeed: 30, traits: ["aquatic"] };
    const archer = { ...pc("p"), strikes: [{ name: "Sling", bonus: 10, melee: false, increment: 50, damage: [{ dice: 1, die: 6, type: "bludgeoning" }] }, { name: "Bow", bonus: 10, melee: false, increment: 60, damage: [{ dice: 1, die: 8, type: "piercing" }] }, { name: "Club", bonus: 10, melee: true, damage: [{ dice: 1, die: 6, type: "bludgeoning" }] }], con: 1 };
    const state = createFightState({ combatants: [archer, fish] }, { morale: false, grid: { layout: "underwater" } }, 1);
    const [p, x] = ["p", "x"].map((id) => state.byId.get(id));
    assert.deepEqual([p.speed, p.swimCheck, x.speed, x.swimCheck ?? false], [10, true, 30, false]);
    assert.equal(isOffGuard(p), true);
    assert.equal(isOffGuard(x), false);
    assert.ok(["acid", "fire"].every((type) => p.resistances.some((entry) => entry.type === type && entry.value === 5)));
    const [sling, bow, club] = p.strikes;
    assert.equal(sling.underwaterBlocked, true, "a bludgeoning ranged Strike misses");
    assert.equal(bow.increment, 30, "piercing: range increments halved");
    assert.equal(club.bonus, 8, "melee bludgeoning: −2 without a swim Speed");
    assert.equal(x.air, undefined, "an aquatic creature breathes");
    assert.equal(p.air, 6, "5 + Constitution");
    assert.equal(canCast(p, { name: "Fire Ray", plan: { traits: ["fire", "attack"], targeting: { kind: "creature" } } }), false);
    p.air = 2;
    p.attacksThisTurn = 1;
    breathTurnEnd(state, p, { leaveField });
    assert.notEqual(p.status, "active", "out of air: drowning");
});
