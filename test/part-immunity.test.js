import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { castSpell } from "../src/engine/spells.js";

// (2026-10-27, the item module's Poison Fizz and Durian Bomb, as the ability module's live play reads them.) trigger.partImmunity: a target
// immune to the part gets its row without that condition, the rest as rolled.
const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
const row = (blinded) => ({ damage: { mode: "formulas", formulas: [{ formula: "2d6", type: "poison" }] }, effects: blinded ? [{ kind: "condition", slug: "blinded", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }, { kind: "condition", slug: "sickened", value: 1, duration: null }] : [] });
const fizz = (partImmunity) => ({ modelVersion: 13, source: { name: "Test Fizz", slug: "test-fizz" }, rank: 1, traits: ["consumable"], activation: { time: "1" }, targeting: { target: "1 creature", range: "30 feet" }, trigger: { event: "use", partImmunity },
    resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 40 } }, outcomes: { criticalSuccess: { damage: none, effects: [] }, success: { damage: none, effects: [] }, failure: row(true), criticalFailure: row(true) } } });

function setUp(plan) {
    const [fighter] = martialParty(5);
    const spell = { name: "Test Fizz", plan, kind: "ability", pool: null };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", engagement: 1, spells: [spell] }, { ...moderateCreature(7, "brute", "Brute"), band: "near", engagement: 1 }] }, {}, 1);
    state.log = [];
    state.round = 1;
    return { state, pc: state.byId.get(fighter.id), brute: state.byId.get("brute") };
}

const clear = (brute) => {
    delete brute.cond.blinded;
    delete brute.cond.sickened;
};

test("2026-10-27: a part immunity leaves its condition out of a later row, and only that; for its time", () => {
    const { state, pc, brute } = setUp(fizz({ condition: "blinded", duration: { value: 1, unit: "minutes" }, degrees: ["criticalFailure"], against: "all" }));
    state.rng.d20 = () => 1;
    castSpell(state, pc, 0, ["brute"]);
    assert.equal(Boolean(brute.cond.blinded), true, state.log.join("\n"));
    assert.deepEqual(brute.partImmune.map((held) => [held.key, held.by, held.until]), [["test-fizz:blinded", null, 11]]);
    clear(brute);
    const hp = brute.hp.value;
    castSpell(state, pc, 0, ["brute"]);
    assert.equal(Boolean(brute.cond.blinded), false, state.log.join("\n"));
    assert.equal((brute.cond.sickened ?? 0) > 0, true);
    assert.ok(brute.hp.value < hp, "its damage still lands");
    assert.ok(state.log.some((line) => /Brute is immune to being blinded by Test Fizz/.test(line)));
    // (Once its minute is over, blinded again.)
    clear(brute);
    state.round = 11;
    castSpell(state, pc, 0, ["brute"]);
    assert.equal(Boolean(brute.cond.blinded), true);
});

test("2026-10-27: a part immunity earned on its results only, and from one creature's unless against all", () => {
    const { state, pc, brute } = setUp(fizz({ condition: "blinded", duration: { value: 1, unit: "hours" }, degrees: ["criticalFailure"] }));
    // (A failure, 19 + 15 against 40: blinded, but no immunity.)
    state.rng.d20 = () => 19;
    castSpell(state, pc, 0, ["brute"]);
    assert.equal(Boolean(brute.cond.blinded), true, state.log.join("\n"));
    assert.equal(brute.partImmune, undefined);
    clear(brute);
    state.rng.d20 = () => 1;
    castSpell(state, pc, 0, ["brute"]);
    assert.deepEqual(brute.partImmune.map((held) => [held.by, held.until]), [[pc.id, Infinity]]);
    // (Another creature's: not immune to it.)
    clear(brute);
    castSpell(state, { ...pc, id: "other" }, 0, ["brute"]);
    assert.equal(Boolean(brute.cond.blinded), true);
});
