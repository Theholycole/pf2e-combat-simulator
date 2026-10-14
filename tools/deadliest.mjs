// The deadliest creatures for their level, and what makes them so (tools/lib/deadliness.mjs has the method; "for its level" here is above
// the median creature of the same level). Runs in phases, each
// reading the ones before it from the output folder, on worker threads:
//
//   node tools/deadliest.mjs <out folder> screen    every creature, 24 fights; and a moderate creature of each level, 400
//   node tools/deadliest.mjs <out folder> ladder    moderate creatures 3 levels below to 10 above each party level, 400 fights each
//   node tools/deadliest.mjs <out folder> confirm   the 100 deadliest for their level again, 300 fights each
//   node tools/deadliest.mjs <out folder> ablate    the 12 deadliest up to level 20 and 6 above, each ability, Strike, spellcasting and
//                                                   number left out, 300 fights
//   node tools/deadliest.mjs <out folder> broad     every creature, each of those left out, on its first 16 screening fights
//                                                   (--only=<file of refs>: just those creatures, into broad-only.jsonl)
//
//   --workers N (default: the cores less two)
import fs from "node:fs";
import os from "node:os";
import { Worker, isMainThread, parentPort } from "node:worker_threads";

if (!isMainThread) {
    const lib = await import("./lib/deadliness.mjs");
    parentPort.on("message", (task) => {
        let result;
        try {
            result = lib.runTask(task);
        } catch (error) {
            result = { ...task, error: `task: ${error.message}` };
        }
        parentPort.postMessage(result);
    });
    parentPort.postMessage({ ready: true });
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const workersArg = process.argv.find((arg) => arg.startsWith("--workers="));
    const WORKERS = Number(workersArg?.split("=")[1]) || Math.max(1, os.cpus().length - 2);
    if (!out || !phase) {
        console.error("node tools/deadliest.mjs <out folder> screen|ladder|confirm|ablate|broad [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);

    // Runs tasks on the workers, writing each result as a line of the file.
    async function run(tasks, file) {
        const stream = fs.createWriteStream(`${out}/${file}`, { flags: "w" });
        const started = Date.now();
        let next = 0;
        let done = 0;
        await new Promise((resolve, reject) => {
            const workers = [];
            const feed = (worker) => {
                if (next < tasks.length) worker.postMessage(tasks[next++]);
                else {
                    worker.terminate();
                    if (workers.every((each) => each.finished || each === worker)) resolve();
                    worker.finished = true;
                }
            };
            for (let index = 0; index < Math.min(WORKERS, tasks.length); index++) {
                const worker = new Worker(new URL(import.meta.url));
                workers.push(worker);
                worker.on("error", reject);
                worker.on("message", (message) => {
                    if (!message.ready) {
                        stream.write(`${JSON.stringify(message)}\n`);
                        done++;
                        if (done % 200 === 0 || done === tasks.length) console.log(`${file}: ${done}/${tasks.length} in ${Math.round((Date.now() - started) / 1000)} s`);
                    }
                    feed(worker);
                });
            }
            if (!tasks.length) resolve();
        });
        await new Promise((resolve) => stream.end(resolve));
    }

    // Each level's yardstick: the median screened creature of that level (a moderate creature's score where fewer than five were screened).
    // "For its level" is how far a creature's deadliness is above it. A Strike far past GM Core's extreme damage (a data slip, 2d8+154) is
    // left out of the ranking.
    const usable = (row) => !row.error && !row.skipped && Number.isFinite(row.score);
    // (Also an attack or an AC far past extreme — a level-6 creature with its level-14 version's +28 Strikes, AC 35 at level 3.)
    // (And a Society scenario's subtier version, "Krosovahn Mendesil (7-8)", that keeps its base creature's level with AC and attack 2 or more
    // higher: a level that wasn't updated.)
    let slips = null;
    const subtierSlips = () => {
        if (slips) return slips;
        const rows = read("screen.jsonl").filter((row) => !row.error && !row.skipped);
        const index = new Map(rows.map((row) => [`${row.ref.pack}|${row.ref.name}`, row]));
        slips = new Set(rows.filter((row) => {
            const named = /^(.*) \((\d+)-(\d+)\)$/.exec(row.ref.name);
            const base = named ? index.get(`${row.ref.pack}|${named[1]}`) : null;
            const more = (key) => (row.profile?.[key]?.value ?? 0) - (base?.profile?.[key]?.value ?? 0);
            return base && base.level === row.level && more("ac") >= 2 && more("attack") >= 2;
        }).map((row) => row.ref.ref));
        return slips;
    };
    const suspect = (row) => (row.profile?.damage?.steps ?? 0) > 8 || (row.profile?.attack?.steps ?? 0) > 5.5 || (row.profile?.ac?.steps ?? 0) > 6 || subtierSlips().has(row.ref.ref);
    // (Paizo's April Fools blog creatures — the Nonsequitaur — are jokes, not built to the tables: left out of the ranking too.)
    const joke = (row) => /april fool|foolish/i.test(row.publication ?? "");
    const baselines = () => {
        const moderate = new Map();
        for (const row of read("baseline.jsonl")) {
            const entry = moderate.get(row.level) ?? { n: 0, score: 0 };
            entry.score += row.score * row.n;
            entry.n += row.n;
            moderate.set(row.level, entry);
        }
        const scores = new Map();
        for (const row of read("screen.jsonl").filter(usable)) scores.set(row.level, [...(scores.get(row.level) ?? []), row.score]);
        const median = (values) => {
            const sorted = [...values].sort((a, b) => a - b);
            return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
        };
        const levels = new Set([...moderate.keys(), ...scores.keys()]);
        return new Map([...levels].map((level) => [level, (scores.get(level)?.length ?? 0) >= 5 ? median(scores.get(level)) : (moderate.get(level)?.score ?? 0) / Math.max(1, moderate.get(level)?.n ?? 1)]));
    };
    // (Once the ladder has run: "for its level" in levels — the level of the moderate creature that does as much to the party, less the
    // typical (median) creature's of the same level. Levels 21 and up fight the level-20 party, whose scores spread far wider, so levels
    // compare them fairly where the score doesn't.)
    const ladder = () => {
        const sums = new Map();
        for (const row of read("ladder.jsonl")) {
            const key = `${row.party}|${row.level - row.party}`;
            const entry = sums.get(key) ?? { party: row.party, offset: row.level - row.party, n: 0, score: 0 };
            entry.score += row.score * row.n;
            entry.n += row.n;
            sums.set(key, entry);
        }
        const curves = new Map();
        for (const entry of sums.values()) curves.set(entry.party, [...(curves.get(entry.party) ?? []), [entry.offset, entry.score / entry.n]]);
        for (const [party, curve] of curves) {
            curve.sort((a, b) => a[0] - b[0]);
            const peak = curve.reduce((best, point, index) => (point[1] > curve[best][1] ? index : best), 0);
            curves.set(party, curve.slice(0, peak + 1));
        }
        return curves;
    };
    // (Past the ladder's top — a creature that kills PCs outright as no by-the-book creature does: on at the ladder's average rise from its
    // own level to the top, an estimate.)
    const offsetOn = (curve, score) => {
        if (score <= curve[0][1]) return curve[0][0];
        for (let index = 1; index < curve.length; index++) {
            const [low, high] = [curve[index - 1], curve[index]];
            if (score <= high[1]) return low[0] + (high[1] > low[1] ? (score - low[1]) / (high[1] - low[1]) : 0) * (high[0] - low[0]);
        }
        const zero = curve.find(([offset]) => offset === 0)?.[1] ?? curve[0][1];
        const [top, best] = curve.at(-1);
        const rise = top > 0 && best > zero ? (best - zero) / top : null;
        return top + (rise ? (score - best) / rise : 0);
    };
    const effectiveLevel = (curves, row) => {
        const party = Math.max(1, Math.min(20, row.level));
        return curves.has(party) ? party + offsetOn(curves.get(party), row.score) : null;
    };
    const ranked = (rows, base) => {
        const curves = ladder();
        const kept = rows.filter((row) => usable(row) && !suspect(row) && !joke(row));
        if (!curves.size) return kept.map((row) => ({ ...row, excess: row.score - (base.get(row.level) ?? 0) })).sort((a, b) => b.excess - a.excess);
        const byLevel = new Map();
        for (const row of read("screen.jsonl").filter(usable)) byLevel.set(row.level, [...(byLevel.get(row.level) ?? []), effectiveLevel(curves, row)]);
        const median = (values) => {
            const sorted = [...values].sort((a, b) => a - b);
            return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
        };
        const typical = new Map([...byLevel].map(([level, values]) => [level, median(values)]));
        return kept.map((row) => ({ ...row, excess: effectiveLevel(curves, row) - (typical.get(row.level) ?? row.level) })).sort((a, b) => b.excess - a.excess);
    };
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
        await run(levels.flatMap((level) => chunks({ kind: "baseline", level }, 1, 401)), "baseline.jsonl");
        await run(refs.map((ref) => ({ kind: "screen", ref, from: 1, to: 25 })), "screen.jsonl");
    } else if (phase === "ladder") {
        // Moderate creatures from 3 levels below each party level (1–20) to 10 above it, 400 fights each: the yardstick for "fights like a
        // creature N levels higher".
        const tasks = [];
        for (let party = 1; party <= 20; party++) for (let offset = -3; offset <= 10; offset++) if (party + offset >= -1) tasks.push(...chunks({ kind: "ladder", party, level: party + offset }, 1, 401));
        await run(tasks, "ladder.jsonl");
    } else if (phase === "confirm") {
        const top = distinct(ranked(read("screen.jsonl"), baselines())).slice(0, 100);
        await run(top.flatMap((row) => chunks({ kind: "confirm", ref: row.ref }, 1, 301)), "confirm.jsonl");
    } else if (phase === "ablate") {
        const merged = new Map();
        for (const row of read("confirm.jsonl")) {
            const entry = merged.get(row.ref.ref) ?? { ref: row.ref, level: row.level, n: 0, score: 0 };
            entry.score += row.score * row.n;
            entry.n += row.n;
            merged.set(row.ref.ref, entry);
        }
        const base = baselines();
        const screen = new Map(read("screen.jsonl").map((row) => [row.ref.ref, row]));
        const top = ranked([...merged.values()].map((entry) => ({ ...entry, ...(screen.get(entry.ref.ref) ? { profile: screen.get(entry.ref.ref).profile, publication: screen.get(entry.ref.ref).publication } : {}), score: entry.score / entry.n })), base);
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
    } else {
        console.error(`Unknown phase ${phase}`);
        process.exit(1);
    }
}
