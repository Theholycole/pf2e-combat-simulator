// Each creature's preferences (src/engine/preferences.js; the user, 2026-10-23: its preferred battlefield, the three things it wants most
// and the three it hates most, from fights): on worker threads, one task a creature, every factor's 40 fights in it.
//
//   node tools/preferences.mjs <out folder> run       every rated creature (src/data/danger-ratings.json's), into preferences.jsonl
//                                                      (--resume: only those not done yet; --only=<name or file of names>: just those;
//                                                      --fights=N, 40 by default)
//   node tools/preferences.mjs <out folder> ratings   each creature's picks, on the danger ratings' scale, by compendium and id
//                                                      (--write=src/data/danger-preferences.json; else preferences.json in the folder)
//
//   --workers N (default: the cores less two)
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/preferences.mjs");
    workerLoop((task) => lib.runPreferences(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    const { PREFERENCE_FIGHTS, factorLabels, picksOf } = await import("../src/engine/preferences.js");
    const FIGHTS = Number(process.argv.find((arg) => arg.startsWith("--fights="))?.split("=")[1]) || PREFERENCE_FIGHTS;
    if (!out || !phase) {
        console.error("node tools/preferences.mjs <out folder> run|ratings [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const shipped = JSON.parse(fs.readFileSync(new URL("../src/data/danger-ratings.json", import.meta.url), "utf8"));
    const { PACK_ROOT } = await import("./lib/pack-creatures.mjs");
    const system = JSON.parse(fs.readFileSync(`${PACK_ROOT}/../system.json`, "utf8"));
    const packNames = new Map(system.packs.map((pack) => [String(pack.path).replace(/\/$/, "").split("/").at(-1), pack.name]));
    const collectionOf = (ref) => (ref.source === "pf2e" ? `pf2e.${packNames.get(ref.pack) ?? ref.pack}` : ref.pack.replace("/", "."));

    if (phase === "run") {
        const { creatureRefs } = await import("./lib/deadliness.mjs");
        // (The rated ones: those the danger ratings give a number.)
        let refs = creatureRefs().filter((ref) => Number.isFinite(shipped.ratings?.[collectionOf(ref)]?.[ref.id])).sort((a, b) => a.path.localeCompare(b.path) || a.id.localeCompare(b.id));
        const only = process.argv.filter((arg) => arg.startsWith("--only=")).flatMap((arg) => {
            const value = arg.slice("--only=".length);
            return fs.existsSync(value) && fs.statSync(value).isFile() ? fs.readFileSync(value, "utf8").split("\n").map((line) => line.trim()).filter(Boolean) : [value];
        });
        if (only.length) refs = refs.filter((ref) => only.some((value) => value === ref.ref || value === ref.id || value.toLowerCase() === ref.name.toLowerCase()));
        const resume = process.argv.includes("--resume");
        const done = resume ? new Set(read("preferences.jsonl").map((row) => row.ref?.ref)) : new Set();
        const tasks = refs.filter((ref) => !done.has(ref.ref)).map((ref) => ({ kind: "preferences", ref, from: 1, to: 1 + FIGHTS }));
        console.log(`${tasks.length} creatures (${refs.length} rated)`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/preferences.jsonl`, append: resume });
    } else if (phase === "ratings") {
        // (Effective levels on the danger ratings' own scale: a factor's worth, its fights' less its base's.)
        const { effectiveLevel, scaleFromJSON } = await import("../src/engine/danger-scale.js");
        const scale = scaleFromJSON(shipped.scale);
        const levelOf = (level, score) => effectiveLevel(scale.curves, { level, score });
        const creatures = {};
        let count = 0;
        for (const row of read("preferences.jsonl")) {
            if (row.error || row.skipped || !row.scores) continue;
            const worth = {};
            for (const [key, base] of Object.entries(row.bases ?? {})) {
                const [with_, without] = [levelOf(row.level, row.scores[key]), levelOf(row.level, row.scores[base])];
                if (Number.isFinite(with_) && Number.isFinite(without)) worth[key] = with_ - without;
            }
            const picks = picksOf(worth);
            if (!picks.battlefield && !picks.wants.length && !picks.hates.length) continue;
            (creatures[collectionOf(row.ref)] ??= {})[row.ref.id] = picks;
            count++;
        }
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? `${out}/preferences.json`;
        const now = new Date().toISOString();
        fs.writeFileSync(target, `${JSON.stringify({ version: 1, run: now, generated: now.slice(0, 10), fights: FIGHTS, ratingsRun: shipped.run, labels: factorLabels(), creatures })}\n`);
        console.log(`${count} creatures' preferences → ${target}`);
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
