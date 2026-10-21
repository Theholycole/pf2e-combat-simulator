// The offline tools' worker pool (tools/deadliest.mjs, tools/spell-power.mjs): tasks run on worker threads — each tool's own file, run as a
// worker, answers a task with its result — each result written as a line of a file. A worker is replaced by a fresh one after RECYCLE
// tasks (2026-10-20: a worker grows by megabytes a creature, and the full screen at 8 workers had filled the machine's memory).
//   The worker side: workerLoop(runTask) in the tool's file when it isn't the main thread.
import fs from "node:fs";
import os from "node:os";
import { Worker, parentPort } from "node:worker_threads";

export const RECYCLE = 150;

// The default number of workers: the cores less two.
export const defaultWorkers = () => Math.max(1, os.cpus().length - 2);

// A worker's loop: each task answered with runTask's result (or its error).
export function workerLoop(runTask) {
    parentPort.on("message", async (task) => {
        let result;
        try {
            result = await runTask(task);
        } catch (error) {
            result = { ...task, error: `task: ${error.message}` };
        }
        parentPort.postMessage(result);
    });
    parentPort.postMessage({ ready: true });
}

// Runs tasks on workers of workerUrl, writing each result as a line of path. append: onto what the file has (a resumed run).
export async function runPool({ workerUrl, workers = defaultWorkers(), tasks, path, append = false, label = path.split("/").at(-1) }) {
    const stream = fs.createWriteStream(path, { flags: append ? "a" : "w" });
    const started = Date.now();
    let next = 0;
    let done = 0;
    await new Promise((resolve, reject) => {
        let live = 0;
        const feed = (worker) => {
            if (next < tasks.length && worker.tasks < RECYCLE) {
                worker.tasks++;
                worker.postMessage(tasks[next++]);
                return;
            }
            worker.terminate();
            live--;
            if (next < tasks.length) start();
            else if (!live) resolve();
        };
        const start = () => {
            const worker = new Worker(workerUrl);
            worker.tasks = 0;
            live++;
            worker.on("error", reject);
            worker.on("message", (message) => {
                if (!message.ready) {
                    stream.write(`${JSON.stringify(message)}\n`);
                    done++;
                    if (done % 200 === 0 || done === tasks.length) console.log(`${label}: ${done}/${tasks.length} in ${Math.round((Date.now() - started) / 1000)} s`);
                }
                feed(worker);
            });
        };
        for (let index = 0; index < Math.min(workers, tasks.length); index++) start();
        if (!tasks.length) resolve();
    });
    await new Promise((resolve) => stream.end(resolve));
}
