// Feat combos in combat (tools/lib/combo-power.mjs has the method), on worker threads:
//
//   node tools/combo-power.mjs <out folder> find      the candidate pairs from <out>/screen.jsonl → <out>/combo-pairs.json
//   node tools/combo-power.mjs <out folder> run       their fights → <out>/combos.jsonl (--resume goes on with a stopped run)
//   node tools/combo-power.mjs <out folder> report    → <out>/combo-power.md and <out>/combo-ratings.json
//
//   --workers N; --max=N candidate pairs (150); FEAT_FIGHTS fights an encounter
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/combo-power.mjs");
    workerLoop((task) => lib.runComboTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const option = (name) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1];
    const WORKERS = Number(option("workers")) || defaultWorkers();
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const lib = await import("./lib/combo-power.mjs");
    if (phase === "find") {
        const pairs = lib.comboCandidates(read("screen.jsonl"), { max: Number(option("max")) || 150 });
        fs.writeFileSync(`${out}/combo-pairs.json`, `${JSON.stringify(pairs)}\n`);
        console.log(`${pairs.length} pairs → ${out}/combo-pairs.json`);
    } else if (phase === "run") {
        const pairs = JSON.parse(fs.readFileSync(`${out}/combo-pairs.json`, "utf8"));
        const resume = process.argv.includes("--resume");
        const key = (task) => (task.kind === "single" ? lib.singleKey(task) : `${task.a.ref ?? task.a}+${task.b.ref ?? task.b}|${task.level}`);
        const doneKeys = new Set(resume ? read("combos.jsonl").map((row) => (row.kind === "single" ? row.key : `${row.keys?.[0]?.split("|")[0]}+${row.keys?.[1]?.split("|")[0]}|${row.level}`)) : []);
        const tasks = lib.comboTasks(pairs, fs.realpathSync(out) + "/scale.jsonl").filter((task) => !doneKeys.has(key(task)));
        console.log(`${tasks.length} tasks`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/combos.jsonl`, append: resume });
    } else if (phase === "report") {
        const { markdown, json } = lib.comboReport(read("combos.jsonl"));
        fs.writeFileSync(`${out}/combo-ratings.json`, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/combo-power.md`, markdown);
        console.log(`${json.rated.length} combos → ${out}/combo-power.md`);
    } else {
        console.error("node tools/combo-power.mjs <out folder> find|run|report");
        process.exit(1);
    }
}
