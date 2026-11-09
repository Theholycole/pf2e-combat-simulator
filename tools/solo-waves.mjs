// Every class's PC alone against endless waves, ranked by how long it lasts (tools/lib/solo-waves.mjs has the rules):
//
//   node tools/solo-waves.mjs <out folder>          the runs (<out>/solo.jsonl; --resume goes on with a stopped run), then the report
//   node tools/solo-waves.mjs <out folder> report   <out>/solo-waves.md and solo-waves.json from what's run
//   --workers=N, --only=<class,class>; SOLO_RUNS=20 runs a class and level, SOLO_LEVELS=1,5,10,15,20, SOLO_CAP=1000 waves at most.
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/solo-waves.mjs");
    workerLoop((task) => lib.soloTask(task));
} else {
    const [out, phase = "run"] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    if (!out) {
        console.error("node tools/solo-waves.mjs <out folder> [report] [--workers=N] [--only=a,b]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    const read = () => (fs.existsSync(`${out}/solo.jsonl`) ? fs.readFileSync(`${out}/solo.jsonl`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const lib = await import("./lib/solo-waves.mjs");
    if (phase === "run") {
        const { CLASS_SLUGS } = await import("../src/engine/classes.js");
        const only = process.argv.find((arg) => arg.startsWith("--only="))?.split("=")[1]?.split(",");
        const slugs = only ?? CLASS_SLUGS;
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read().filter((r) => !r.error).map((r) => `${r.slug}|${r.level}|${r.run}`)) : new Set();
        const tasks = slugs.flatMap((slug) => lib.LEVELS.flatMap((level) => Array.from({ length: lib.RUNS }, (_, run) => ({ kind: "solo", slug, level, run })))).filter((t) => !done.has(`${t.slug}|${t.level}|${t.run}`));
        console.log(`${tasks.length} runs`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/solo.jsonl`, append: resume });
    }
    const { markdown, json } = lib.soloReport(read());
    fs.writeFileSync(`${out}/solo-waves.md`, markdown);
    fs.writeFileSync(`${out}/solo-waves.json`, `${JSON.stringify(json)}\n`);
    console.log(`${json.table.length} classes → ${out}/solo-waves.md`);
}
