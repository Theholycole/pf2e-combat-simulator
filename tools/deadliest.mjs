// The deadliest creatures for their level, and what makes them so (tools/lib/deadliness.mjs has the method; "for its level" here is above
// the median creature of the same level). Runs in phases, each
// reading the ones before it from the output folder, on worker threads:
//
//   node tools/deadliest.mjs <out folder> screen    every creature, 24 fights (--fights=N); and a moderate creature of each level, 400
//   node tools/deadliest.mjs <out folder> ladder    moderate creatures 3 levels below to 10 above each party level, 400 fights each
//   node tools/deadliest.mjs <out folder> confirm   the 100 deadliest for their level again, 300 fights each
//   node tools/deadliest.mjs <out folder> ablate    the 12 deadliest up to level 20 and 6 above, each ability, Strike, spellcasting and
//                                                   number left out, 300 fights
//   node tools/deadliest.mjs <out folder> broad     every creature, each of those left out, on its first 16 screening fights
//                                                   (--only=<file of refs>: just those creatures, into broad-only.jsonl)
//   node tools/deadliest.mjs <out folder> ratings   every creature's danger for its level (levels above the typical creature of its level),
//                                                   by compendium and id: the simulator's compendium numbers (--write=src/data/danger-ratings.json)
//   node tools/deadliest.mjs <out folder> screen --only="Gibbering Mouther"   one creature (or several: more --only, or a file of them)
//                                                   screened again into a finished run, the rest kept; then ratings
//
//   --workers N (default: the cores less two)
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/deadliness.mjs");
    workerLoop((task) => lib.runTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const workersArg = process.argv.find((arg) => arg.startsWith("--workers="));
    const WORKERS = Number(workersArg?.split("=")[1]) || defaultWorkers();
    // (--fights N: the screen's fights per creature, 24 by default; 2026-10-20, the danger ratings, more.)
    const FIGHTS = Number(process.argv.find((arg) => arg.startsWith("--fights="))?.split("=")[1]) || 24;
    if (!out || !phase) {
        console.error("node tools/deadliest.mjs <out folder> screen|ladder|confirm|ablate|broad [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);

    // Runs tasks on the workers (tools/lib/pool.mjs), writing each result as a line of the file. (append: onto what the file already has — a
    // resumed screen.)
    const run = (tasks, file, { append = false } = {}) => runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, append });

    // The ranking (src/engine/danger-scale.js, shared with the in-Foundry run): each level's yardstick, the ladder's curves, a creature's
    // effective level and its excess over the typical creature of its level; data slips and April Fools creatures left out. Its rows: a
    // key, a group (the pack) and a name, from the ref.
    const { rankRows, ratingsOf, scaleOf, scaleToJSON } = await import("../src/engine/danger-scale.js");
    const asScale = (row) => ({ ...row, key: row.ref?.ref, group: row.ref?.pack, name: row.ref?.name });
    const ranked = (rows) => rankRows(rows.map(asScale), { screen: read("screen.jsonl").map(asScale), baseline: read("baseline.jsonl"), ladder: read("ladder.jsonl") });
    // One per creature: the same name, level and numbers in several packs counts once.
    const distinct = (rows) => {
        const seen = new Set();
        return rows.filter((row) => {
            const key = `${row.ref.name}|${row.level}|${row.profile?.hp?.value}|${row.profile?.ac?.value}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };
    // Tasks split into chunks of seeds, merged after.
    const chunks = (task, from, to, size = 100) => {
        const list = [];
        for (let start = from; start < to; start += size) list.push({ ...task, from: start, to: Math.min(to, start + size) });
        return list;
    };

    if (phase === "screen") {
        const { creatureRefs } = await import("./lib/deadliness.mjs");
        const refs = creatureRefs().sort((a, b) => a.path.localeCompare(b.path));
        console.log(`${refs.length} creatures`);
        const levels = [...new Set(refs.map((ref) => Math.max(-1, Math.min(25, ref.level))))].sort((a, b) => a - b);
        // (--resume: the baseline as it is, and only the creatures the screen hasn't done, after those it has — a run stopped part way.)
        // (--only=<a name, an actor id or a ref; or a file of them, one a line>, as many as wanted: just those creatures screened again, their
        // rows in screen.jsonl replaced and the others kept, the baseline and ladder as they are — one creature updated, 2026-10-20, the user:
        // "so in the future if we update 1 monster we can run them alone". Then `ratings` as ever.)
        const only = process.argv.filter((arg) => arg.startsWith("--only=")).flatMap((arg) => {
            const value = arg.slice("--only=".length);
            return fs.existsSync(value) && fs.statSync(value).isFile() ? fs.readFileSync(value, "utf8").split("\n").map((line) => line.trim()).filter(Boolean) : [value];
        });
        if (only.length) {
            const wanted = refs.filter((ref) => only.some((value) => value === ref.ref || value === ref.id || value.toLowerCase() === ref.name.toLowerCase()));
            if (!wanted.length) {
                console.error(`No creature is ${only.join(", ")}`);
                process.exit(1);
            }
            const ratingOf = (rows) => (read("ladder.jsonl").length ? new Map(ranked(rows).map((row) => [row.ref.ref, row.excess])) : new Map());
            const before = ratingOf(read("screen.jsonl"));
            await run(wanted.map((ref) => ({ kind: "screen", ref, from: 1, to: 1 + FIGHTS })), "screen-only.jsonl");
            const fresh = new Map(read("screen-only.jsonl").map((row) => [row.ref.ref, row]));
            const rows = read("screen.jsonl");
            const known = new Set(rows.map((row) => row.ref?.ref));
            const next = [...rows.map((row) => fresh.get(row.ref?.ref) ?? row), ...[...fresh.values()].filter((row) => !known.has(row.ref.ref))];
            fs.writeFileSync(`${out}/screen.jsonl`, `${next.map((row) => JSON.stringify(row)).join("\n")}\n`);
            const after = ratingOf(next);
            const shown = (value) => (Number.isFinite(value) ? `${value >= 0 ? "+" : ""}${value.toFixed(1)}` : "none");
            for (const row of fresh.values()) console.log(`${row.ref.name} (level ${row.level ?? "?"}, ${row.ref.pack}): ${row.error ?? (row.skipped ? row.reason ?? "skipped" : `${shown(before.get(row.ref.ref))} → ${shown(after.get(row.ref.ref))}`)}`);
            console.log("Then: ratings --write=src/data/danger-ratings.json");
            process.exit(0);
        }
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("screen.jsonl").map((row) => row.ref?.ref)) : new Set();
        if (!resume || !read("baseline.jsonl").length) await run(levels.flatMap((level) => chunks({ kind: "baseline", level }, 1, 401)), "baseline.jsonl");
        await run(refs.filter((ref) => !done.has(ref.ref)).map((ref) => ({ kind: "screen", ref, from: 1, to: 1 + FIGHTS })), "screen.jsonl", { append: resume });
    } else if (phase === "ladder") {
        // Moderate creatures from 3 levels below each party level (1–20) to 10 above it, 400 fights each: the yardstick for "fights like a
        // creature N levels higher".
        const tasks = [];
        for (let party = 1; party <= 20; party++) for (let offset = -3; offset <= 10; offset++) if (party + offset >= -1) tasks.push(...chunks({ kind: "ladder", party, level: party + offset }, 1, 401));
        await run(tasks, "ladder.jsonl");
    } else if (phase === "confirm") {
        const top = distinct(ranked(read("screen.jsonl"))).slice(0, 100);
        await run(top.flatMap((row) => chunks({ kind: "confirm", ref: row.ref }, 1, 301)), "confirm.jsonl");
    } else if (phase === "ablate") {
        const merged = new Map();
        for (const row of read("confirm.jsonl")) {
            const entry = merged.get(row.ref.ref) ?? { ref: row.ref, level: row.level, n: 0, score: 0 };
            entry.score += row.score * row.n;
            entry.n += row.n;
            merged.set(row.ref.ref, entry);
        }
        const screen = new Map(read("screen.jsonl").map((row) => [row.ref.ref, row]));
        const top = ranked([...merged.values()].map((entry) => ({ ...entry, ...(screen.get(entry.ref.ref) ? { profile: screen.get(entry.ref.ref).profile, publication: screen.get(entry.ref.ref).publication } : {}), score: entry.score / entry.n })));
        // The 12 deadliest of levels −1 to 20 and the 6 of 21 and up (they fight the level-20 party, the cap), by name.
        const names = new Set();
        const distinctTop = top.filter((entry) => !names.has(entry.ref.name) && names.add(entry.ref.name));
        const chosen = [...distinctTop.filter((entry) => entry.level <= 20).slice(0, 12), ...distinctTop.filter((entry) => entry.level > 20).slice(0, 6)];
        await run(chosen.flatMap((entry) => (screen.get(entry.ref.ref)?.variants ?? []).flatMap((variant) => chunks({ kind: "ablate", ref: entry.ref, variant }, 1, 301))), "ablate.jsonl");
    } else if (phase === "broad") {
        // (--only=<file>: just the creatures whose refs the file lists, one a line — after a fix that touches only them — into broad-only.jsonl.)
        const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
        const only = onlyArg ? new Set(fs.readFileSync(onlyArg.split("=")[1], "utf8").split("\n").map((line) => line.trim()).filter(Boolean)) : null;
        const rows = read("screen.jsonl").filter((row) => !row.error && !row.skipped && Number.isFinite(row.score) && (!only || only.has(row.ref.ref)));
        await run(rows.flatMap((row) => (row.variants ?? []).map((variant) => ({ kind: "broad", ref: row.ref, variant, from: 1, to: 17 }))), only ? "broad-only.jsonl" : "broad.jsonl");
    } else if (phase === "ratings") {
        // (2026-10-20, the user: every creature's danger for its level, "a number next to their name in the compendium that we can also sort
        // by" — levels above (or below) the typical creature of its level, as the ranking counts it, by compendium and id. --write=<file>: there,
        // else ratings.json in the output folder. Data slips and April Fools creatures get none, as in the ranking.)
        const { PACK_ROOT } = await import("./lib/pack-creatures.mjs");
        const system = JSON.parse(fs.readFileSync(`${PACK_ROOT}/../system.json`, "utf8"));
        const packNames = new Map(system.packs.map((pack) => [String(pack.path).replace(/\/$/, "").split("/").at(-1), pack.name]));
        const rows = ranked(read("screen.jsonl")).map((row) => ({ ...row, collection: row.ref.source === "pf2e" ? `pf2e.${packNames.get(row.ref.pack) ?? row.ref.pack}` : row.ref.pack.replace("/", "."), id: row.ref.id }));
        // (Past the ladder's top, an estimate — "above"; at or under its foot, at most — "below": bounds.)
        const { ratings, bounds } = ratingsOf(rows, read("ladder.jsonl"));
        // (Its scale kept with it: one creature rated again alone, in Foundry, lands on the same one. run: this run's stamp.)
        const scale = scaleToJSON(scaleOf({ screen: read("screen.jsonl").map(asScale), ladder: read("ladder.jsonl") }));
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? `${out}/ratings.json`;
        const fights = Math.max(0, ...rows.map((row) => row.n ?? 0));
        const now = new Date().toISOString();
        fs.writeFileSync(target, `${JSON.stringify({ version: 1, run: now, generated: now.slice(0, 10), fights, party: ["fighter", "rogue", "wizard", "cleric"], ratings, bounds, scale })}\n`);
        console.log(`${Object.values(ratings).reduce((sum, pack) => sum + Object.keys(pack).length, 0)} creatures rated in ${Object.keys(ratings).length} compendiums → ${target}`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
