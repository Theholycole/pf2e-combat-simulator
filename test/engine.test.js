import test from "node:test";
import assert from "node:assert/strict";

import { createRng } from "../src/engine/rng.js";
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeDistribution, degreeOf } from "../src/engine/checks.js";
import { adjustDamage, expectedStrikeDamage } from "../src/engine/damage.js";
import { createCombatant, armorClass, multipleAttackPenalty } from "../src/engine/combatant.js";
import { prepareSnapshot, simulate } from "../src/engine/fight.js";
import { benchmarkEncounter, moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { runBatch } from "../src/engine/batch.js";

test("seeded rng replays exactly", () => {
    const a = createRng(7);
    const b = createRng(7);
    for (let i = 0; i < 100; i++) assert.equal(a.d20(), b.d20());
});

test("degrees of success follow PF2e, including natural 20 and 1", () => {
    assert.equal(degreeOf(25, 15, 10), CRITICAL_SUCCESS);
    assert.equal(degreeOf(15, 15, 10), SUCCESS);
    assert.equal(degreeOf(14, 15, 10), FAILURE);
    assert.equal(degreeOf(5, 15, 3), CRITICAL_FAILURE);
    assert.equal(degreeOf(14, 15, 20), SUCCESS);
    assert.equal(degreeOf(15, 15, 1), FAILURE);
    const dist = degreeDistribution(10, 20);
    assert.ok(Math.abs(dist.reduce((sum, p) => sum + p, 0) - 1) < 1e-9);
    assert.ok(Math.abs(dist[SUCCESS] + dist[CRITICAL_SUCCESS] - 0.55) < 1e-9);
});

test("critical damage doubles, then adds deadly and fatal dice", () => {
    const strike = { damage: [{ dice: 1, die: 8, bonus: 4, type: "piercing" }], deadly: { dice: 1, die: 10 } };
    const hit = expectedStrikeDamage(strike).reduce((sum, part) => sum + part.amount, 0);
    const crit = expectedStrikeDamage(strike, { critical: true }).reduce((sum, part) => sum + part.amount, 0);
    assert.equal(hit, 8.5);
    assert.equal(crit, 17 + 5.5);
    const fatal = { damage: [{ dice: 1, die: 8, bonus: 0, type: "piercing" }], fatal: 12 };
    assert.equal(expectedStrikeDamage(fatal, { critical: true }).reduce((sum, part) => sum + part.amount, 0), 13 + 6.5);
});

test("resistances, weaknesses and immunities apply per damage type", () => {
    const defender = { resistances: [{ type: "physical", value: 5 }], weaknesses: [{ type: "fire", value: 3 }], immunities: ["poison"] };
    const result = adjustDamage(defender, [
        { type: "slashing", amount: 12 },
        { type: "fire", amount: 2 },
        { type: "poison", amount: 6 }
    ]);
    assert.equal(result.total, 7 + 5);
});

test("multiple attack penalty respects agile", () => {
    assert.equal(multipleAttackPenalty({ agile: false }, 1), 5);
    assert.equal(multipleAttackPenalty({ agile: true }, 2), 8);
});

test("frightened lowers AC, a raised shield and off-guard change it", () => {
    const c = createCombatant({ ...moderateCreature(1, "x"), conditions: { frightened: 2 }, shield: { ac: 2, hardness: 5, hp: 20, bt: 10, raised: true } });
    assert.equal(armorClass(c), 15 - 2 + 2);
    assert.equal(armorClass(c, { flanked: true }), 15 - 2 + 2 - 2);
});

test("a fight replays identically from its seed", () => {
    const snapshot = prepareSnapshot(benchmarkEncounter(3, "severe"));
    const a = simulate(snapshot, {}, 99, { log: true });
    const b = simulate(snapshot, {}, 99, { log: true });
    assert.deepEqual(a.log, b.log);
    assert.equal(a.outcome, b.outcome);
});

test("every fight ends with a known outcome", () => {
    const report = runBatch(benchmarkEncounter(4, "extreme"), { runs: 120 });
    const total = Object.values(report.outcomes).reduce((sum, value) => sum + value, 0);
    assert.ok(Math.abs(total - 1) < 1e-9);
    assert.ok(report.sampleLog.length > 5);
});

test("a dying PC follows recovery checks and hero points prevent death", () => {
    // The second PC keeps the fight going while the first is dying.
    const [fragile, sturdy] = martialParty(1);
    const party = [{ ...fragile, hp: { value: 1, max: fragile.hp.max } }, { ...sturdy, hp: { value: 200, max: 200 } }];
    const foes = [moderateCreature(3, "brute", "Brute")];
    const withHero = runBatch({ combatants: [...party, ...foes] }, { runs: 200, options: { heroPoints: true, retreat: false } });
    const without = runBatch({ combatants: [...party, ...foes] }, { runs: 200, options: { heroPoints: false, retreat: false } });
    assert.ok(withHero.anyPcDeath < without.anyPcDeath);
});

test("odds check resumes a fight in progress at the current turn", () => {
    const snapshot = benchmarkEncounter(2, "moderate");
    snapshot.round = 3;
    snapshot.turn = 2;
    snapshot.order = snapshot.combatants.map((c) => c.id);
    snapshot.combatants = snapshot.combatants.map((c) => (c.side === "foes" ? { ...c, hp: { value: 1, max: c.hp.max } } : c));
    const report = runBatch(snapshot, { runs: 100 });
    assert.ok(report.winRate > 0.95);
    assert.ok(report.averageRounds >= 3);
});
