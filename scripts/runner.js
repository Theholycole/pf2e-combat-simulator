// Runs simulation jobs in a Web Worker, falling back to the main thread.

import { COMPARE_PRESETS, runAdjustments, runBatch, runCompare, runMoraleImpact } from "../src/engine/batch.js";

let worker = null;
let workerFailed = false;
let nextId = 1;
const pending = new Map();

function getWorker() {
    if (worker || workerFailed) return worker;
    try {
        worker = new Worker(new URL("../src/engine/worker.js", import.meta.url), { type: "module" });
        worker.onmessage = (event) => {
            const { id, type } = event.data;
            const job = pending.get(id);
            if (!job) return;
            if (type === "progress") job.onProgress?.(event.data.done, event.data.total);
            else if (type === "done") {
                pending.delete(id);
                job.resolve(event.data.result);
            } else if (type === "error") {
                pending.delete(id);
                job.reject(new Error(event.data.message));
            }
        };
        worker.onerror = (event) => {
            console.warn("pf2e-combat-simulator | worker failed, using the main thread", event);
            workerFailed = true;
            worker = null;
            for (const [id, job] of pending) {
                pending.delete(id);
                runOnMainThread(job.kind, job.snapshot, job.settings, job.onProgress).then(job.resolve, job.reject);
            }
        };
    } catch (error) {
        console.warn("pf2e-combat-simulator | no worker, using the main thread", error);
        workerFailed = true;
        worker = null;
    }
    return worker;
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
export function runJob(kind, snapshot, settings = {}, onProgress = null) {
    const active = getWorker();
    if (!active) return runOnMainThread(kind, snapshot, settings, onProgress);
    const id = nextId++;
    return new Promise((resolve, reject) => {
        pending.set(id, { kind, snapshot, settings, onProgress, resolve, reject });
        active.postMessage({ id, kind, snapshot, settings });
    });
}
