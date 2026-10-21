// Every spell's power for its rank (src/engine/spell-power.js has the method; tools/lib/spell-power.mjs finds the spells), in phases, each
// reading the ones before it from the output folder, on worker threads (tools/lib/pool.mjs):
//
//   node tools/spell-power.mjs <out folder> ladder    the party with the wizard's cantrips alone against the boss and the group of each rank's
//                                                     level, 6 levels easier to 2 harder, 400 fights each; and against each trait's foes
//   node tools/spell-power.mjs <out folder> screen    every spell at its rank and each heightened rank, both encounters (and each trait's it
//                                                     does more against), 100 fights each (--fights=N); --resume goes on with a stopped run;
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
    const FIGHTS = Number(process.argv.find((arg) => arg.startsWith("--fights="))?.split("=")[1]) || 100;
    if (!out || !phase) {
        console.error("node tools/spell-power.mjs <out folder> ladder|screen|ratings [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const run = (tasks, file, { append = false } = {}) => runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, append });
    const { POWER_KINDS, POWER_OFFSETS, POWER_RANKS, POWER_TRAITS, partyLevelForRank, rankSpells, spellRatingsOf, unusedSpell } = await import("../src/engine/spell-power.js");
    const chunks = (task, from, to, size = 100) => {
        const list = [];
        for (let start = from; start < to; start += size) list.push({ ...task, from: start, to: Math.min(to, start + size) });
        return list;
    };

    if (phase === "ladder") {
        const tasks = [];
        for (const rank of POWER_RANKS) {
            const level = partyLevelForRank(rank);
            for (const encounter of POWER_KINDS) {
                for (const offset of POWER_OFFSETS) tasks.push(...chunks({ kind: "ladder", level, encounter, offset, trait: null }, 1, 401));
                // (Each trait's foes at the encounter's own level: the party's fights with such foes, for "against undead".)
                for (const trait of POWER_TRAITS) tasks.push(...chunks({ kind: "ladder", level, encounter, offset: 0, trait }, 1, 401));
            }
        }
        await run(tasks, "ladder.jsonl");
    } else if (phase === "screen") {
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
        const tasks = chosen.flatMap((ref) => ranksOf(ref).map((rank) => ({ kind: "screen", ref, rank, from: 1, to: 1 + FIGHTS })));
        if (only.length) {
            // (Those spells again, their rows replaced and the others kept.)
            await run(tasks, "screen-only.jsonl");
            const fresh = read("screen-only.jsonl");
            const again = new Set(fresh.map((row) => row.ref?.ref));
            const rows = read("screen.jsonl").filter((row) => !again.has(row.ref?.ref));
            fs.writeFileSync(`${out}/screen.jsonl`, `${[...rows, ...fresh].map((row) => JSON.stringify(row)).join("\n")}\n`);
            for (const row of fresh) console.log(`${row.name} at rank ${row.rank}: ${row.error ?? (row.skipped ? row.reason : Object.entries(row.results).map(([key, value]) => `${key.replace(/\|$/, "")} ${value.score.toFixed(3)}`).join(", "))}`);
            console.log("Then: ratings --write=src/data/spell-ratings.json");
            process.exit(0);
        }
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("screen.jsonl").map((row) => `${row.ref?.ref}|${row.rank}`)) : new Set();
        console.log(`${tasks.length} spells at their ranks`);
        await run(tasks.filter((task) => !done.has(`${task.ref.ref}|${task.rank}`)), "screen.jsonl", { append: resume });
    } else if (phase === "ratings") {
        const rows = read("screen.jsonl");
        const ladder = read("ladder.jsonl");
        const ranked = rankSpells(rows, ladder);
        const { ratings, bounds, detail } = spellRatingsOf(ranked);
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? `${out}/ratings.json`;
        const fights = Math.max(0, ...rows.flatMap((row) => Object.values(row.results ?? {}).map((result) => result.n ?? 0)));
        const now = new Date().toISOString();
        fs.writeFileSync(target, `${JSON.stringify({ version: 1, kind: "spells", run: now, generated: now.slice(0, 10), fights, party: ["fighter", "rogue", "wizard", "cleric"], ratings, bounds, detail })}\n`);
        const rated = Object.values(ratings).reduce((sum, pack) => sum + Object.keys(pack).length, 0);
        const skipped = rows.filter((row) => row.skipped).length;
        const unused = rows.filter((row) => !row.skipped && !row.error && unusedSpell(row, ladder)).length;
        console.log(`${rated} spells rated in ${Object.keys(ratings).length} compendiums (spell ranks left out: ${skipped} utility or not castable, ${unused} never cast or no use in these fights) → ${target}`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
