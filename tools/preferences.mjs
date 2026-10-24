// Each creature's preferences (src/engine/preferences.js; the user, 2026-10-23: its preferred battlefield, the three things it wants most
// and the three it hates most, from fights): on worker threads, one task a creature, every factor's 40 fights in it.
//
//   node tools/preferences.mjs <out folder> run       every rated creature (src/data/danger-ratings.json's), into preferences.jsonl
//                                                      (--resume: only those not done yet; --only=<name or file of names>: just those;
//                                                      --fights=N, 40 by default; --factors=<key prefix,…>: only those factors —
//                                                      terrain: — into preferences-<the prefixes>.jsonl, a top-up the ratings merge in)
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
        const factorsArg = process.argv.find((arg) => arg.startsWith("--factors="))?.split("=")[1];
        const prefixes = factorsArg ? factorsArg.split(",").filter(Boolean) : null;
        const file = prefixes ? `preferences-${prefixes.map((prefix) => prefix.replace(/[^a-z0-9]+/gi, "")).join("-")}.jsonl` : "preferences.jsonl";
        const done = resume ? new Set(read(file).map((row) => row.ref?.ref)) : new Set();
        const tasks = refs.filter((ref) => !done.has(ref.ref)).map((ref) => ({ kind: "preferences", ref, from: 1, to: 1 + FIGHTS, ...(prefixes ? { only: prefixes } : {}) }));
        console.log(`${tasks.length} creatures (${refs.length} rated)${prefixes ? `, factors ${prefixes.join(", ")}` : ""}`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, append: resume });
    } else if (phase === "ratings") {
        // (Effective levels on the danger ratings' own scale: a factor's worth, its fights' less its base's.)
        const { effectiveLevel, scaleFromJSON } = await import("../src/engine/danger-scale.js");
        const scale = scaleFromJSON(shipped.scale);
        const levelOf = (level, score) => effectiveLevel(scale.curves, { level, score });
        const creatures = {};
        let count = 0;
        // (A damage type against the untyped die can only help a creature immune to it or resisting it, and only hurt one weak to it: a
        // "hate" of the first or a "want" of the second is noise — dropped, by its immunities, resistances and weaknesses.)
        const lib = await import("./lib/deadliness.mjs");
        const iwrOf = (ref) => {
            try {
                const { monster } = lib.buildMonster(lib.npcOf(ref));
                const types = (list) => new Set((list ?? []).map((entry) => (typeof entry === "string" ? entry : entry?.type)).filter(Boolean));
                return { helps: new Set([...types(monster.immunities), ...types(monster.resistances)]), hurts: types(monster.weaknesses) };
            } catch {
                return null;
            }
        };
        // (Top-ups — preferences-<prefixes>.jsonl — merged in: their factors' numbers replace the main run's of those prefixes.)
        const topUps = fs.readdirSync(out).filter((name) => /^preferences-.+\.jsonl$/.test(name)).flatMap((name) => read(name));
        const byRef = new Map();
        for (const row of topUps) if (!row.error && !row.skipped && row.scores) byRef.set(row.ref.ref, [...(byRef.get(row.ref.ref) ?? []), row]);
        const merged = (row) => {
            let next = row;
            for (const extra of byRef.get(row.ref.ref) ?? []) {
                const drop = (key) => (extra.only ?? []).some((prefix) => key.startsWith(prefix));
                next = { ...next, scores: { ...Object.fromEntries(Object.entries(next.scores).filter(([key]) => !drop(key))), ...extra.scores }, bases: { ...Object.fromEntries(Object.entries(next.bases ?? {}).filter(([key]) => !drop(key))), ...extra.bases } };
            }
            return next;
        };
        for (const base of read("preferences.jsonl")) {
            if (base.error || base.skipped || !base.scores) continue;
            const row = merged(base);
            const worth = {};
            for (const [key, base] of Object.entries(row.bases ?? {})) {
                const [with_, without] = [levelOf(row.level, row.scores[key]), levelOf(row.level, row.scores[base])];
                if (Number.isFinite(with_) && Number.isFinite(without)) worth[key] = with_ - without;
            }
            const iwr = Object.keys(worth).some((key) => key.startsWith("deals:")) ? iwrOf(row.ref) : null;
            if (iwr) for (const key of Object.keys(worth).filter((entry) => entry.startsWith("deals:"))) {
                const type = key.slice("deals:".length);
                if ((iwr.helps.has(type) && worth[key] < 0) || (iwr.hurts.has(type) && worth[key] > 0)) delete worth[key];
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
