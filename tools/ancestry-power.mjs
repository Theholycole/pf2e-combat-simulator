// Ancestries, heritages and backgrounds in combat (tools/lib/ancestry-power.mjs has the method), on worker threads:
//
//   node tools/ancestry-power.mjs <out folder> run       every ancestry, heritage and background (the feat ratings' scale.jsonl in <out>
//                                                        first: node tools/feat-power.mjs <out> scale); --resume goes on with a stopped run
//   node tools/ancestry-power.mjs <out folder> report    docs/ancestry-power.md's table and <out>/ancestry-ratings.json
//
//   --workers N (default: the cores less two); ANCESTRY_FIGHTS=200 fights an encounter (the default, FEAT_FIGHTS's)
//   --kind=free-archetype: the Free Archetype variant on each PC and level, best, worst and 8 random archetypes (free-archetype.jsonl's
//   rows land in ancestry.jsonl like the rest; tools/variant-compare.mjs compares them with Ancestry Paragon)
//   ANCESTRY_PICK=best|worst|random: which ancestry feats fill the slots (--kind=ancestry-feats)
//   ANCESTRY_PARAGON=1: the Ancestry Paragon variant's feat slots (two at 1st, then every odd level) for --kind=ancestry-feats
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/ancestry-power.mjs");
    workerLoop((task) => lib.runAncestryTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    if (!out || !phase) {
        console.error("node tools/ancestry-power.mjs <out folder> run|report [--workers=N]");
        process.exit(1);
    }
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const key = (task) => `${task.kind}|${task.id ?? task.ids?.join(",") ?? `${task.pick}${task.seed}`}|${task.level}|${task.host ?? ""}`;
    if (phase === "run") {
        const scalePath = fs.realpathSync(out) + "/scale.jsonl";
        if (!fs.existsSync(scalePath)) {
            console.error("Run the feat scale phase first: node tools/feat-power.mjs <out> scale");
            process.exit(1);
        }
        const { ancestryTasks, freeArchetypeTasks } = await import("./lib/ancestry-power.mjs");
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("ancestry.jsonl").map(key)) : new Set();
        const only = process.argv.find((arg) => arg.startsWith("--kind="))?.split("=")[1];
        const tasks = (only === "free-archetype" ? freeArchetypeTasks(scalePath) : ancestryTasks(scalePath)).filter((task) => !done.has(key(task)) && (!only || task.kind === only));
        console.log(`${tasks.length} tasks`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/ancestry.jsonl`, append: resume });
    } else if (phase === "report") {
        const { ancestryReport } = await import("./lib/ancestry-report.mjs");
        const { markdown, json } = ancestryReport(read("ancestry.jsonl"));
        fs.writeFileSync(`${out}/ancestry-ratings.json`, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/ancestry-power.md`, markdown);
        console.log(`→ ${out}/ancestry-power.md`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
