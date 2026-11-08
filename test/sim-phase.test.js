// (2026-11-07, the simulator phase: engine pieces new feats rely on.)
import test from "node:test";
import assert from "node:assert/strict";
import { expectedStrikeDamage } from "../src/engine/damage.js";

test("a feat's extra dice on a critical hit (critExtra) only on a critical hit, not doubled", () => {
    const strike = { name: "Claw", melee: true, damage: [{ dice: 1, die: 6, bonus: 4, type: "slashing" }], critExtra: [{ dice: 1, die: 4, bonus: 0, type: "bleed", persistent: true }] };
    const normal = expectedStrikeDamage(strike);
    const critical = expectedStrikeDamage(strike, { critical: true });
    assert.equal(normal.some((part) => part.critExtra), false);
    const extra = critical.filter((part) => part.critExtra);
    assert.equal(extra.length, 1);
    assert.equal(extra[0].type, "bleed");
    assert.equal(extra[0].persistent, true);
    assert.equal(extra[0].amount, 2.5);
});
