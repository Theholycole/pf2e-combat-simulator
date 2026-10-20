// Web Worker entry: runs a slice of a batch's fights off Foundry's main thread (scripts/runner.js puts the slices together).

import { runFights } from "./batch.js";
import { dangerFights, dangerSummary } from "./danger-scale.js";

// (kind "danger": one creature's danger fights, src/engine/danger-scale.js — the in-Foundry danger run, scripts/danger-run.js.)
self.onmessage = (event) => {
    const { id, kind, snapshot, settings } = event.data;
    const onProgress = (done, total) => self.postMessage({ id, type: "progress", done, total });
    try {
        if (kind === "danger") {
            const { party, foes, from, to } = event.data;
            self.postMessage({ id, type: "done", result: dangerSummary(dangerFights(party, foes, from, to)) });
            return;
        }
        self.postMessage({ id, type: "done", result: runFights(snapshot, { ...settings, onProgress }) });
    } catch (error) {
        self.postMessage({ id, type: "error", message: error?.message ?? String(error), stack: error?.stack });
    }
};
