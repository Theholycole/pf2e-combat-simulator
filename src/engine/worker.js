// Web Worker entry: runs a slice of a batch's fights off Foundry's main thread (scripts/runner.js puts the slices together).

import { runFights } from "./batch.js";

self.onmessage = (event) => {
    const { id, snapshot, settings } = event.data;
    const onProgress = (done, total) => self.postMessage({ id, type: "progress", done, total });
    try {
        self.postMessage({ id, type: "done", result: runFights(snapshot, { ...settings, onProgress }) });
    } catch (error) {
        self.postMessage({ id, type: "error", message: error?.message ?? String(error), stack: error?.stack });
    }
};
