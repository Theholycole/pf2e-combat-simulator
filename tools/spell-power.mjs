// Every spell's power for its rank (src/engine/spell-power.js has the method: one cast's effect; tools/lib/spell-power.mjs finds the
// spells), on worker threads (tools/lib/pool.mjs):
//
//   node tools/spell-power.mjs <out folder> screen    every spell at its rank and each heightened rank, one cast into the boss and the group
//                                                     (and each trait's foes it does more against); --resume goes on with a stopped run;
//                                                     --only=<a name, an item id or a ref; or a file of them> just those again
//   node tools/spell-power.mjs <out folder> ratings   the compendium numbers (--write=src/data/spell-ratings.json)
//
//   --workers N (default: the cores less two)
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/spell-power.mjs");
    workerLoop((task) => lib.runPowerTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    if (!out || !phase) {
        console.error("node tools/spell-power.mjs <out folder> screen|ratings [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const run = (tasks, file, { append = false } = {}) => runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, append });
    const { rankSpells, spellRatingsOf } = await import("../src/engine/spell-power.js");

    if (phase === "screen") {
        const { ranksOf, spellRefs } = await import("./lib/spell-power.mjs");
        const refs = spellRefs().sort((a, b) => a.path.localeCompare(b.path));
        console.log(`${refs.length} spells`);
        const only = process.argv.filter((arg) => arg.startsWith("--only=")).flatMap((arg) => {
            const value = arg.slice("--only=".length);
            return fs.existsSync(value) && fs.statSync(value).isFile() ? fs.readFileSync(value, "utf8").split("\n").map((line) => line.trim()).filter(Boolean) : [value];
        });
        const chosen = only.length ? refs.filter((ref) => only.some((value) => value === ref.ref || value === ref.id || value.toLowerCase() === ref.name.toLowerCase())) : refs;
        if (only.length && !chosen.length) {
            console.error(`No spell is ${only.join(", ")}`);
            process.exit(1);
        }
        const tasks = chosen.flatMap((ref) => ranksOf(ref).map((rank) => ({ kind: "screen", ref, rank })));
        if (only.length) {
            // (Those spells again, their rows replaced and the others kept.)
            await run(tasks, "screen-only.jsonl");
            const fresh = read("screen-only.jsonl");
            const again = new Set(fresh.map((row) => row.ref?.ref));
            const rows = read("screen.jsonl").filter((row) => !again.has(row.ref?.ref));
            fs.writeFileSync(`${out}/screen.jsonl`, `${[...rows, ...fresh].map((row) => JSON.stringify(row)).join("\n")}\n`);
            for (const row of fresh) console.log(`${row.name} at rank ${row.rank}: ${row.error ?? (row.skipped ? row.reason : Object.entries(row.results).map(([key, value]) => `${key.replace(/\|$/, "")} ${value.levels.toFixed(2)} levels (${Math.round(value.share * 100)}%)`).join(", ") || "no effect")}`);
            console.log("Then: ratings --write=src/data/spell-ratings.json");
            process.exit(0);
        }
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("screen.jsonl").map((row) => `${row.ref?.ref}|${row.rank}`)) : new Set();
        console.log(`${tasks.length} spells at their ranks`);
        await run(tasks.filter((task) => !done.has(`${task.ref.ref}|${task.rank}`)), "screen.jsonl", { append: resume });
    } else if (phase === "ratings") {
        const rows = read("screen.jsonl");
        const ranked = rankSpells(rows);
        const { ratings, bounds, detail } = spellRatingsOf(ranked);
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? `${out}/ratings.json`;
        const now = new Date().toISOString();
        fs.writeFileSync(target, `${JSON.stringify({ version: 1, kind: "spells", method: "one cast", run: now, generated: now.slice(0, 10), party: ["fighter", "rogue", "wizard", "cleric"], ratings, bounds, detail })}\n`);
        const rated = Object.values(ratings).reduce((sum, pack) => sum + Object.keys(pack).length, 0);
        const reasons = {};
        for (const row of rows) if (row.skipped) reasons[row.reason] = (reasons[row.reason] ?? 0) + 1;
        const none = rows.filter((row) => !row.skipped && !row.error && !Object.keys(row.results ?? {}).length).length;
        console.log(`${rated} spells rated in ${Object.keys(ratings).length} compendiums. Spell ranks left out: ${Object.entries(reasons).map(([reason, count]) => `${count} ${reason}`).join(", ")}, ${none} with no effect the simulator counts → ${target}`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
