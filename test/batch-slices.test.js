import test from "node:test";
import assert from "node:assert/strict";

import { benchmarkEncounter } from "../src/engine/benchmarks.js";
import { COMPARE_PRESETS, batchReport, compareFromReports, runBatch, runCompare, runFights } from "../src/engine/batch.js";

// What scripts/runner.js does with its workers: a batch's fights in slices, put back in order.
function inSlices(snapshot, { runs, seed, options = {}, logSample = true }, count) {
    const size = Math.ceil(runs / count);
    const results = [];
    for (let from = 0; from < runs; from += size) results.push(...runFights(snapshot, { runs, seed, options, logSample, from, to: Math.min(runs, from + size) }));
    return batchReport(snapshot, results, { seed, options });
}

const withoutTime = (report) => ({ ...report, elapsedMs: 0 });

test("a batch run in slices gives the report one thread gives", () => {
    const snapshot = benchmarkEncounter(5, "severe");
    const whole = runBatch(snapshot, { runs: 60, seed: 7 });
    assert.deepEqual(withoutTime(inSlices(snapshot, { runs: 60, seed: 7 }, 4)), withoutTime(whole));
    assert.ok(whole.sampleLog?.length, "the sample log comes from fight 0, in the first slice");
});

test("a comparison from sliced batches is the one-thread comparison", () => {
    const snapshot = benchmarkEncounter(3, "extreme");
    const variants = COMPARE_PRESETS.morale();
    const sliced = compareFromReports(variants, variants.map((variant) => inSlices(snapshot, { runs: 40, seed: 3, options: variant.options, logSample: false }, 3)));
    const whole = runCompare(snapshot, variants, { runs: 40, seed: 3 });
    assert.deepEqual(sliced.map((entry) => ({ ...entry, report: withoutTime(entry.report) })), whole.map((entry) => ({ ...entry, report: withoutTime(entry.report) })));
});
