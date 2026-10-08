import test from "node:test";
import assert from "node:assert/strict";

import { adjustmentVariants, applyAdjustments, eliteAdjust, weakAdjust } from "../src/engine/adjust.js";
import { benchmarkEncounter, moderateCreature } from "../src/engine/benchmarks.js";
import { runAdjustments } from "../src/engine/batch.js";

test("Elite and Weak follow PF2e's adjustments", () => {
    const foe = moderateCreature(5, "f", "Foe"); // AC 21, HP 75, Strike +13, 2d6+6
    const elite = eliteAdjust(foe);
    assert.equal(elite.ac, 23);
    assert.equal(elite.hp.max, 95);
    assert.equal(elite.strikes[0].bonus, 15);
    assert.equal(elite.strikes[0].damage[0].bonus, 8);
    assert.equal(elite.saves.will, foe.saves.will + 2);
    assert.equal(elite.level, 6);
    const weak = weakAdjust(foe);
    assert.equal(weak.ac, 19);
    assert.equal(weak.hp.max, 60);
    assert.equal(weak.strikes[0].damage[0].bonus, 4);
    assert.equal(weak.level, 4);
});

test("a doubled critical formula gains +4 from Elite, a plain one +2", () => {
    const foe = { ...moderateCreature(3, "f", "Foe"), strikes: [{ name: "Claw", bonus: 10, melee: true, damage: [{ dice: 1, die: 8, bonus: 6, multiplier: 1, type: "slashing" }], critDamage: [{ dice: 1, die: 8, bonus: 6, multiplier: 2, type: "slashing" }] }] };
    const elite = eliteAdjust(foe).strikes[0];
    assert.equal(elite.damage[0].bonus, 8);
    assert.equal(elite.critDamage[0].bonus * elite.critDamage[0].multiplier, 16);
});

test("an already hurt creature keeps its damage taken", () => {
    const foe = { ...moderateCreature(5, "f", "Foe"), hp: { value: 30, max: 75 } };
    assert.equal(eliteAdjust(foe).hp.value, 50);
    assert.equal(weakAdjust(foe).hp.value, 15);
});

test("adjustments apply by name; remove takes out one", () => {
    const snapshot = benchmarkEncounter(3, "low"); // three level-1 foes with distinct names
    const named = { ...snapshot, combatants: snapshot.combatants.map((c) => (c.side === "foes" ? { ...c, name: "Bandit" } : c)) };
    const weak = applyAdjustments(named, [{ kind: "weak", name: "Bandit" }]);
    assert.equal(weak.combatants.filter((c) => c.adjusted === "weak").length, 3);
    const removed = applyAdjustments(named, [{ kind: "remove", name: "Bandit" }]);
    assert.equal(removed.combatants.filter((c) => c.side === "foes").length, 2);
    const variants = adjustmentVariants(named);
    assert.deepEqual(variants.map((v) => v.name), ["Weak Bandit ×3", "Elite Bandit ×3", "Remove one Bandit"]);
});

test("Weak helps the party, Elite hurts it", () => {
    const data = runAdjustments(benchmarkEncounter(5, "extreme"), { runs: 200 });
    const row = (prefix) => data.rows.find((entry) => entry.name.startsWith(prefix));
    assert.ok(row("Weak").winRate > data.base.winRate);
    assert.ok(row("Elite").winRate < data.base.winRate);
});
