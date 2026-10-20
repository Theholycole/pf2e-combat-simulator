// Runs simulation jobs on a pool of Web Workers, one per spare core: each batch is split into slices of its fights, run
// side by side, and put back in order, so the report is the one a single thread would give. Falls back to the main thread.

import { COMPARE_PRESETS, adjustmentRunVariants, adjustmentsFromReports, batchReport, compareFromReports, moraleImpactFromReports, moraleImpactVariants, runAdjustments, runBatch, runCompare, runMoraleImpact } from "../src/engine/batch.js";
import { dangerFights, dangerSummary, mergeSummaries } from "../src/engine/danger-scale.js";

const POOL_SIZE = Math.max(1, Math.min(8, (globalThis.navigator?.hardwareConcurrency ?? 2) - 1));

let pool = null;
let poolFailed = false;
let nextId = 1;
const waiting = [];
const running = new Map();

function workers() {
    if (pool || poolFailed) return pool;
    try {
        pool = Array.from({ length: POOL_SIZE }, () => {
            const entry = { worker: new Worker(new URL("../src/engine/worker.js", import.meta.url), { type: "module" }), task: null };
            entry.worker.onmessage = (event) => answer(entry, event.data);
            entry.worker.onerror = (event) => fail(event);
            return entry;
        });
    } catch (error) {
        fail(error);
    }
    return pool;
}

// A worker that can't run (no module workers here): the jobs go to the main thread.
function fail(error) {
    if (poolFailed) return;
    console.warn("pf2e-combat-simulator | workers failed, using the main thread", error);
    poolFailed = true;
    for (const entry of pool ?? []) entry.worker.terminate();
    pool = null;
    const tasks = [...running.values(), ...waiting.splice(0)];
    running.clear();
    for (const task of tasks) task.reject(new Error("workers failed"));
}

function answer(entry, data) {
    const task = running.get(data.id);
    if (!task) return;
    if (data.type === "progress") return task.onProgress?.(data.done);
    running.delete(data.id);
    entry.task = null;
    if (data.type === "done") task.resolve(data.result);
    else task.reject(new Error(data.message));
    dispatch();
}

function dispatch() {
    for (const entry of pool ?? []) {
        if (entry.task || !waiting.length) continue;
        const task = waiting.shift();
        entry.task = task;
        running.set(task.id, task);
        entry.worker.postMessage({ id: task.id, ...(task.message ?? { snapshot: task.snapshot, settings: task.settings }) });
    }
}

// One slice of a batch's fights on the next free worker.
function runSlice(snapshot, settings, onProgress) {
    return new Promise((resolve, reject) => {
        waiting.push({ id: nextId++, snapshot, settings, onProgress, resolve, reject });
        dispatch();
    });
}

// A batch: its fights cut into one slice per worker (the first holds fight 0, the sample log), the report from them all.
// The odds check's time budget and minimum count apply to each slice by its share.
async function batchOnWorkers(snapshot, { runs = 500, seed = 1, options = {}, logSample = true, timeBudgetMs = null, minRuns = 50 } = {}, progress) {
    const started = Date.now();
    const size = Math.ceil(runs / POOL_SIZE);
    const slices = [];
    for (let from = 0; from < runs; from += size) slices.push([from, Math.min(runs, from + size)]);
    const parts = await Promise.all(slices.map(([from, to]) => runSlice(snapshot, { runs, seed, options, logSample, from, to, timeBudgetMs, minRuns: Math.ceil((minRuns * (to - from)) / runs) }, progress.slice())));
    return batchReport(snapshot, parts.flat(), { seed, options, elapsedMs: Date.now() - started });
}

// Progress over a job's batches: each slice reports its own count.
function progressOf(total, onProgress) {
    let done = 0;
    return {
        slice() {
            let last = 0;
            return (count) => {
                done += count - last;
                last = count;
                onProgress?.(done, total);
            };
        }
    };
}

async function onWorkers(kind, snapshot, settings, onProgress) {
    const runs = settings.runs ?? (kind === "moraleImpact" ? 300 : kind === "adjustments" ? 150 : 500);
    const batches = (variants) => {
        const progress = progressOf(variants.length * runs, onProgress);
        return Promise.all(variants.map((variant) => batchOnWorkers(snapshot, { runs, seed: settings.seed, options: variant.options, logSample: false }, progress)));
    };
    if (kind === "batch") return batchOnWorkers(snapshot, settings, progressOf(runs, onProgress));
    if (kind === "compare") {
        const variants = settings.variants ?? COMPARE_PRESETS[settings.preset]();
        return compareFromReports(variants, await batches(variants));
    }
    if (kind === "moraleImpact") {
        const variants = moraleImpactVariants(snapshot);
        return moraleImpactFromReports(snapshot, variants, compareFromReports(variants, await batches(variants)), { runs, flagThreshold: settings.flagThreshold });
    }
    if (kind === "adjustments") {
        const variants = adjustmentRunVariants(snapshot);
        return adjustmentsFromReports(variants, compareFromReports(variants, await batches(variants)), { runs });
    }
    throw new Error(`Unknown job ${kind}`);
}

async function runOnMainThread(kind, snapshot, settings, onProgress) {
    // Let the UI paint before blocking.
    await new Promise((resolve) => setTimeout(resolve, 20));
    if (kind === "batch") return runBatch(snapshot, { ...settings, onProgress });
    if (kind === "compare") return runCompare(snapshot, settings.variants ?? COMPARE_PRESETS[settings.preset](), { ...settings, onProgress });
    if (kind === "moraleImpact") return runMoraleImpact(snapshot, { ...settings, onProgress });
    if (kind === "adjustments") return runAdjustments(snapshot, { ...settings, onProgress });
    throw new Error(`Unknown job ${kind}`);
}

// kind: "batch" | "compare" | "moraleImpact" | "adjustments"
export async function runJob(kind, snapshot, settings = {}, onProgress = null) {
    if (!workers()) return runOnMainThread(kind, snapshot, settings, onProgress);
    try {
        return await onWorkers(kind, snapshot, settings, onProgress);
    } catch (error) {
        if (!poolFailed) throw error;
        return runOnMainThread(kind, snapshot, settings, onProgress);
    }
}

// How many fight tasks run side by side: the workers, or the main thread alone.
export const parallelFights = () => (workers() ? POOL_SIZE : 1);

// One creature's danger fights (src/engine/danger-scale.js; seeds [from, to)) on the next free worker; without workers, on the main thread
// ten at a time, letting the UI breathe between them.
export async function runDangerFights(party, foes, from, to) {
    if (workers()) {
        try {
            return await new Promise((resolve, reject) => {
                waiting.push({ id: nextId++, message: { kind: "danger", party, foes, from, to }, resolve, reject });
                dispatch();
            });
        } catch (error) {
            if (!poolFailed) throw error;
        }
    }
    const parts = [];
    for (let start = from; start < to; start += 10) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        parts.push(dangerSummary(dangerFights(party, foes, start, Math.min(to, start + 10))));
    }
    return mergeSummaries(parts);
}

