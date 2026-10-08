// Web Worker entry: runs batches off Foundry's main thread.

import { COMPARE_PRESETS, runAdjustments, runBatch, runCompare, runMoraleImpact } from "./batch.js";

const presetVariants = (name) => COMPARE_PRESETS[name]?.() ?? null;

self.onmessage = (event) => {
    const { id, kind, snapshot, settings } = event.data;
    const onProgress = (done, total) => self.postMessage({ id, type: "progress", done, total });
    try {
        let result;
        if (kind === "batch") result = runBatch(snapshot, { ...settings, onProgress });
        else if (kind === "compare") result = runCompare(snapshot, settings.variants ?? presetVariants(settings.preset), { ...settings, onProgress });
        else if (kind === "moraleImpact") result = runMoraleImpact(snapshot, { ...settings, onProgress });
        else if (kind === "adjustments") result = runAdjustments(snapshot, { ...settings, onProgress });
        else throw new Error(`Unknown job ${kind}`);
        self.postMessage({ id, type: "done", result });
    } catch (error) {
        self.postMessage({ id, type: "error", message: error?.message ?? String(error), stack: error?.stack });
    }
};
