import test from "node:test";
import assert from "node:assert/strict";

import { calibrate, guessOutcome, isWin } from "../src/engine/calibration.js";

const entry = (id, winRate, outcome, { down = false, died = false, anyPcDown = 0.5, reliability = "high" } = {}) => ({
    id,
    prediction: { winRate, anyPcDown, anyPcDeath: 0.05, reliability },
    actual: { outcome, pcs: [{ name: "A", down, died }], rounds: 4 }
});

test("outcome guesses from the final state", () => {
    const up = { down: false };
    const down = { down: true };
    assert.equal(guessOutcome({ pcs: [up, up], foes: [down, down] }), "decisive");
    assert.equal(guessOutcome({ pcs: [down, down], foes: [up] }), "defeat");
    assert.equal(guessOutcome({ pcs: [up, up], foes: [down, up] }), "rout");
    assert.equal(guessOutcome({ pcs: [down, down, up], foes: [up, up, down] }), "retreat");
    assert.equal(guessOutcome({ pcs: [up], foes: [up], objectiveKind: "survive" }), "survived");
    assert.ok(isWin("rout") && !isWin("retreat"));
});

test("a perfect forecaster scores skill 1, a coin-flipper about 0", () => {
    const perfect = calibrate([entry("a", 1, "decisive"), entry("b", 0, "defeat"), entry("c", 1, "rout"), entry("d", 0, "retreat")]);
    assert.equal(perfect.win.brier, 0);
    assert.equal(perfect.win.skill, 1);
    const flat = calibrate([entry("a", 0.5, "decisive"), entry("b", 0.5, "defeat")]);
    assert.equal(flat.win.skill, 0);
});

test("buckets, surprises and the reliable-only filter", () => {
    const entries = [
        entry("sure-win", 0.97, "decisive"),
        entry("shock", 0.9, "defeat"),
        entry("long-shot", 0.2, "decisive", { reliability: "low" }),
        entry("no-prediction", 0.5, "decisive")
    ];
    entries[3].prediction = null;
    const all = calibrate(entries);
    assert.equal(all.logged, 4);
    assert.equal(all.withPrediction, 3);
    assert.deepEqual(all.surprises, ["shock", "long-shot"]);
    assert.equal(all.winBuckets.find((b) => b.label === "95% or more").count, 1);
    const reliable = calibrate(entries, { onlyReliable: true });
    assert.equal(reliable.withPrediction, 2);
});

test("PC-down predictions are scored separately", () => {
    const result = calibrate([entry("a", 0.9, "decisive", { down: true, anyPcDown: 0.8 }), entry("b", 0.9, "decisive", { down: false, anyPcDown: 0.2 })]);
    assert.ok(Math.abs(result.pcDown.brier - 0.04) < 1e-9);
});
