// Every feat's and action's power in combat (tools/lib/feat-power.mjs has the method: whole fights with it and without, on the same seeds),
// on worker threads (tools/lib/pool.mjs):
//
//   node tools/feat-power.mjs <out folder> scale     the plain party's fights at each level, and a level up and down (the step in levels)
//   node tools/feat-power.mjs <out folder> screen    every feat and action the feat module compiles into something a fight plays;
//                                                    --resume goes on with a stopped run; --only=<a name, an id or a ref; or a file of them>
//   node tools/feat-power.mjs <out folder> basics    the basic actions, each left out of every PC
//   node tools/feat-power.mjs <out folder> report    docs/feat-power.md and <out>/ratings.json (--write=<path> for the json)
//   node tools/feat-power.mjs <out folder> deviant   the deviant abilities: plain, without backlash, each awakening (deviant-report: the table)
//
//   --workers N (default: the cores less two); FEAT_FIGHTS=200 fights an encounter (the default)
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/feat-power.mjs");
    workerLoop((task) => lib.runFeatTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    if (!out || !phase) {
        console.error("node tools/feat-power.mjs <out folder> scale|screen|basics|report [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const run = (tasks, file, { append = false } = {}) => runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, append });
    const scalePath = fs.realpathSync(out) + "/scale.jsonl";

    if (phase === "scale") {
        const { KINDS } = await import("./lib/feat-power.mjs");
        const tasks = Array.from({ length: 20 }, (_, index) => index + 1).flatMap((level) => KINDS.map((encounter) => ({ kind: "scale", level, encounter })));
        await run(tasks, "scale.jsonl");
    } else if (phase === "screen") {
        if (!fs.existsSync(scalePath)) {
            console.error("Run the scale phase first.");
            process.exit(1);
        }
        const { featRefs } = await import("./lib/feat-power.mjs");
        const refs = featRefs().sort((a, b) => a.ref.localeCompare(b.ref));
        const only = process.argv.filter((arg) => arg.startsWith("--only=")).flatMap((arg) => {
            const value = arg.slice("--only=".length);
            return fs.existsSync(value) && fs.statSync(value).isFile() ? fs.readFileSync(value, "utf8").split("\n").map((line) => line.trim()).filter(Boolean) : [value];
        });
        const chosen = only.length ? refs.filter((ref) => only.some((value) => value === ref.ref || value === ref.id || value.toLowerCase() === ref.name.toLowerCase())) : refs;
        const tasks = chosen.map((ref) => ({ kind: "feat", ref, scalePath }));
        if (only.length) {
            await run(tasks, "screen-only.jsonl");
            const fresh = read("screen-only.jsonl");
            const again = new Set(fresh.map((row) => row.ref?.ref));
            fs.writeFileSync(`${out}/screen.jsonl`, `${[...read("screen.jsonl").filter((row) => !again.has(row.ref?.ref)), ...fresh].map((row) => JSON.stringify(row)).join("\n")}\n`);
            for (const row of fresh) console.log(`${row.name} (${row.host}, level ${row.level}): ${row.error ?? (row.skipped ? `not rated, ${row.reason}` : `${row.levels.toFixed(2)} ± ${row.se.toFixed(2)} levels (boss ${row.results.boss.levels.toFixed(2)}, ${row.results.boss.uses.toFixed(1)} uses; group ${row.results.group.levels.toFixed(2)}, ${row.results.group.uses.toFixed(1)} uses)`)}`);
            process.exit(0);
        }
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("screen.jsonl").map((row) => row.ref?.ref)) : new Set();
        console.log(`${tasks.length} feats and actions`);
        await run(tasks.filter((task) => !done.has(task.ref.ref)), "screen.jsonl", { append: resume });
    } else if (phase === "basics") {
        const { basicActionList } = await import("./lib/feat-power.mjs");
        await run(basicActionList().map((entry) => ({ kind: "basic", ...entry, scalePath })), "basics.jsonl");
    } else if (phase === "deviant") {
        // (Deviant abilities: each plain, without its backlash, and with each awakening — tools/lib/feat-power.mjs deviantTask.)
        const { deviantList } = await import("./lib/feat-power.mjs");
        const tasks = deviantList().map((entry) => ({ kind: "deviant", ...entry, scalePath }));
        console.log(`${tasks.length} deviant variants`);
        await run(tasks, "deviant.jsonl");
    } else if (phase === "deviant-report") {
        const { deviantReport } = await import("./lib/feat-report.mjs");
        const { markdown, json } = deviantReport(read("deviant.jsonl"));
        fs.writeFileSync(`${out}/deviant-ratings.json`, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/deviant-power.md`, markdown);
        console.log(`${json.rated.length} rated → ${out}/deviant-power.md`);
    } else if (phase === "report") {
        const { featReport } = await import("./lib/feat-report.mjs");
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? `${out}/ratings.json`;
        const { markdown, json } = featReport({ feats: read("screen.jsonl"), basics: read("basics.jsonl"), scale: read("scale.jsonl") });
        fs.writeFileSync(target, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/feat-power.md`, markdown);
        console.log(`${json.rated.length} rated, ${json.skipped} not simulated → ${out}/feat-power.md, ${target}`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
