// Every feat's and action's power in combat (tools/lib/feat-power.mjs has the method: whole fights with it and without, on the same seeds),
// on worker threads (tools/lib/pool.mjs):
//
//   node tools/feat-power.mjs <out folder> scale     the plain party's fights at each level, and a level up and down (the step in levels)
//   node tools/feat-power.mjs <out folder> screen    every feat and action the feat module compiles into something a fight plays;
//                                                    --resume goes on with a stopped run; --only=<a name, an id or a ref; or a file of them>
//   node tools/feat-power.mjs <out folder> basics    the basic actions, each left out of every PC
//   node tools/feat-power.mjs <out folder> report    docs/feat-power.md and <out>/ratings.json (--write=<path> for the json)
//   (compendium, which writes src/data/feat-ratings.json, then refits the rough power score on it: tools/rough-power.mjs; ROUGH_REFIT=0 skips)
//   node tools/feat-power.mjs <out folder> classes   every class's PC in its seat of the standard party, levels 1–20 (classes-report: the table; --only=<class,class>)
//   node tools/feat-power.mjs <out folder> deviant   the deviant abilities: plain, without backlash, each awakening (deviant-report: the table)
//
//   node tools/feat-power.mjs <out folder> probe     after a code change: every stored rating's first seeds replayed (FEAT_PROBE=8 an
//                                                    encounter); <out>/changed.txt lists the feats whose fights changed (--strict: or whose
//                                                    party did), the new ones and the ones played or skipped now
//   node tools/feat-power.mjs <out folder> refresh   the probe, then a screen of only what it found (--only=<out>/changed.txt)
//   node tools/feat-power.mjs <out folder> canary    before a long batch: ~40 stored ratings replayed on their first 50 seeds (FEAT_CANARY),
//                                                    then and now side by side (<out>/canary.md); --only=… for a list of your own
//
//   --workers N (default: the cores less two); FEAT_FIGHTS=200 fights an encounter at most (the default). A feat's fights stop early once its
//   answer is clear (tools/lib/feat-power.mjs stopReason; FEAT_EARLY=0 for every fight, FEAT_BATCH=25, FEAT_SE=0.03). The screen runs the
//   feats most likely to matter first (their stored rating, else docs/rough-power.json's score; --order=name for the old order).
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
    // (2026-11-03: the feats most likely to matter first — by their stored rating's size, else the rough power score's —, so the top of
    // the table is ready early in a long batch.)
    const ordered = (refs) => {
        if (process.argv.includes("--order=name")) return refs;
        const weight = new Map();
        try {
            for (const row of JSON.parse(fs.readFileSync(new URL("../docs/rough-power.json", import.meta.url), "utf8")).scores ?? []) weight.set(row.ref, Math.abs(row.rough ?? 0));
        } catch {
            // (No rough scores: the stored ratings alone.)
        }
        for (const row of read("screen.jsonl")) if (row.ref?.ref && Number.isFinite(row.levels)) weight.set(row.ref.ref, Math.abs(row.levels) + 1);
        return [...refs].sort((a, b) => (weight.get(b.ref) ?? 0) - (weight.get(a.ref) ?? 0));
    };
    const latest = () => {
        const byRef = new Map();
        for (const row of read("screen.jsonl")) if (row.ref?.ref) byRef.set(row.ref.ref, row);
        return byRef;
    };
    const probe = async () => {
        if (!fs.existsSync(scalePath)) {
            console.error("Run the scale phase first.");
            process.exit(1);
        }
        const { KINDS, PROBE } = await import("./lib/feat-power.mjs");
        const started = Date.now();
        await run(Array.from({ length: 20 }, (_, index) => index + 1).flatMap((level) => KINDS.map((encounter) => ({ kind: "scale-probe", level, encounter, scalePath }))), "scale-probe.jsonl");
        const staleScale = read("scale-probe.jsonl").filter((row) => row.changed);
        if (staleScale.length) {
            console.log(`The plain party's own fights changed at ${staleScale.map((row) => `${row.level} ${row.encounter}`).join(", ")}: rerun the scale phase, then the whole screen (every rating stands on the scale).`);
            process.exit(2);
        }
        const rows = latest();
        await run([...rows.values()].map((row) => ({ kind: "probe", row, seeds: PROBE, scalePath })), "probe.jsonl");
        const probed = read("probe.jsonl");
        const strict = process.argv.includes("--strict");
        const changed = probed.filter((row) => row.changed || (strict && row.party));
        const { featRefs } = await import("./lib/feat-power.mjs");
        const fresh = featRefs().filter((ref) => !rows.has(ref.ref));
        const list = [...changed.map((row) => row.ref.ref), ...fresh.map((ref) => ref.ref)];
        fs.writeFileSync(`${out}/changed.txt`, list.length ? `${list.join("\n")}\n` : "");
        const why = new Map();
        for (const row of changed) why.set(row.why ?? "party changed", (why.get(row.why ?? "party changed") ?? 0) + 1);
        console.log(`Probe: ${probed.length} stored, ${changed.length} changed, ${fresh.length} new, in ${Math.round((Date.now() - started) / 1000)} s → ${out}/changed.txt`);
        for (const [reason, count] of [...why].sort((a, b) => b[1] - a[1])) console.log(`  ${count} ${reason}`);
        const partyOnly = probed.filter((row) => !row.changed && row.party).length;
        if (partyOnly && !strict) console.log(`  (${partyOnly} more have a changed party but the same fights on the probe's seeds: --strict reruns them too)`);
        return list;
    };

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
        const tasks = ordered(chosen).map((ref) => ({ kind: "feat", ref, scalePath }));
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
    } else if (phase === "probe" || phase === "refresh") {
        // (2026-11-03: after a code change, only the feats whose fights changed — tools/lib/feat-power.mjs probeTask.)
        const list = await probe();
        if (phase === "refresh" && list.length) {
            const { featRefs } = await import("./lib/feat-power.mjs");
            const wanted = new Set(list);
            await run(ordered(featRefs().filter((ref) => wanted.has(ref.ref))).map((ref) => ({ kind: "feat", ref, scalePath })), "screen-only.jsonl");
            const fresh = read("screen-only.jsonl");
            const again = new Set(fresh.map((row) => row.ref?.ref));
            fs.writeFileSync(`${out}/screen.jsonl`, `${[...read("screen.jsonl").filter((row) => !again.has(row.ref?.ref)), ...fresh].map((row) => JSON.stringify(row)).join("\n")}\n`);
            console.log(`${fresh.length} rerun → ${out}/screen.jsonl (now the report phase)`);
        }
    } else if (phase === "canary") {
        // (2026-11-03: a sample of the stored ratings replayed before a long batch, to see what a change moved — canaryTask.)
        const rows = [...latest().values()].filter((row) => Number.isFinite(row.levels));
        const only = process.argv.filter((arg) => arg.startsWith("--only=")).flatMap((arg) => {
            const value = arg.slice("--only=".length);
            return fs.existsSync(value) && fs.statSync(value).isFile() ? fs.readFileSync(value, "utf8").split("\n").map((line) => line.trim()).filter(Boolean) : [value];
        });
        const { canarySample } = await import("./lib/feat-report.mjs");
        const sample = only.length ? rows.filter((row) => only.some((value) => value === row.ref.ref || value === row.ref.id || value.toLowerCase() === row.name.toLowerCase())) : canarySample(rows);
        const started = Date.now();
        await run(sample.map((row) => ({ kind: "canary", row, scalePath })), "canary.jsonl");
        const { canaryReport } = await import("./lib/feat-report.mjs");
        const { markdown, moved } = canaryReport(read("canary.jsonl"), Math.round((Date.now() - started) / 1000));
        fs.writeFileSync(`${out}/canary.md`, markdown);
        console.log(`Canary: ${sample.length} feats, ${moved} moved by 0.05 levels or more → ${out}/canary.md`);
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
    } else if (phase === "classes") {
        // (Every class's PC in its seat of the standard party, levels 1 to 20 — src/engine/classes.js.)
        const { CLASS_SLUGS, seatOf } = await import("../src/engine/classes.js");
        const onlyClasses = process.argv.find((arg) => arg.startsWith("--only="))?.split("=")[1]?.split(",");
        const tasks = CLASS_SLUGS.filter((slug) => seatOf(slug) !== slug && (!onlyClasses || onlyClasses.includes(slug))).flatMap((slug) => Array.from({ length: 20 }, (_, index) => ({ kind: "class", slug, level: index + 1, scalePath })));
        const done = process.argv.includes("--resume") ? new Set(read("classes.jsonl").map((row) => `${row.slug}|${row.level}`)) : new Set();
        console.log(`${tasks.length} class and level pairs`);
        await run(tasks.filter((task) => !done.has(`${task.slug}|${task.level}`)), "classes.jsonl", { append: process.argv.includes("--resume") });
    } else if (phase === "class-pairs") {
        // (Every two classes in different seats, neither the seat's own, at --levels (5, 11, 17).)
        const { CLASS_SLUGS, seatOf } = await import("../src/engine/classes.js");
        const levels = (process.argv.find((arg) => arg.startsWith("--levels="))?.split("=")[1] ?? "5,11,17").split(",").map(Number);
        const own = CLASS_SLUGS.filter((slug) => seatOf(slug) !== slug);
        const pairs = own.flatMap((a, index) => own.slice(index + 1).filter((b) => seatOf(a) !== seatOf(b)).map((b) => [a, b]));
        const tasks = pairs.flatMap((slugs) => levels.map((level) => ({ kind: "pair", slugs, level, scalePath })));
        const done = process.argv.includes("--resume") ? new Set(read("pairs.jsonl").map((row) => `${row.slugs.join("+")}|${row.level}`)) : new Set();
        console.log(`${pairs.length} pairs, ${tasks.length} runs`);
        await run(tasks.filter((task) => !done.has(`${task.slugs.join("+")}|${task.level}`)), "pairs.jsonl", { append: process.argv.includes("--resume") });
    } else if (phase === "pairs-report") {
        const { pairReport } = await import("./lib/feat-report.mjs");
        const { markdown, json } = pairReport(read("pairs.jsonl"), read("classes.jsonl"));
        fs.writeFileSync(`${out}/pair-ratings.json`, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/class-pairs.md`, markdown);
        console.log(`${json.pairs.length} pairs → ${out}/class-pairs.md`);
    } else if (phase === "classes-report") {
        const { classReport } = await import("./lib/feat-report.mjs");
        const { markdown, json } = classReport(read("classes.jsonl"));
        fs.writeFileSync(`${out}/class-ratings.json`, `${JSON.stringify(json)}\n`);
        fs.writeFileSync(`${out}/class-power.md`, markdown);
        console.log(`${json.rated.length} classes → ${out}/class-power.md`);
    } else if (phase === "compendium") {
        // (2026-11-01, Cole: "put every feat's power next to it in the compendium browser": src/data/feat-ratings.json, which
        // scripts/danger.js shows beside each feat and action in compendium windows and PF2e's Compendium Browser.)
        const { featRefs, docsOf } = await import("./lib/feat-power.mjs");
        const { featCompendiumData } = await import("./lib/feat-report.mjs");
        const ratings = JSON.parse(fs.readFileSync(`${out}/ratings.json`, "utf8"));
        const deviant = fs.existsSync(`${out}/deviant-ratings.json`) ? JSON.parse(fs.readFileSync(`${out}/deviant-ratings.json`, "utf8")) : null;
        const refs = featRefs();
        const slugOf = (ref) => docsOf(ref.path).get(ref.id)?.system?.slug ?? null;
        const ancestry = fs.existsSync(`${out}/ancestry-ratings.json`) ? JSON.parse(fs.readFileSync(`${out}/ancestry-ratings.json`, "utf8")) : null;
        const data = featCompendiumData({ rated: ratings.rated, deviant, ancestry, refs, slugOf });
        const target = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1] ?? "src/data/feat-ratings.json";
        fs.writeFileSync(target, `${JSON.stringify(data)}\n`);
        console.log(`${Object.values(data.ratings).reduce((sum, pack) => sum + Object.keys(pack).length, 0)} feats and actions → ${target}`);
        // (2026-11-13, Cole: "adjust the rough rating scoring method so they are more accurate in the future as simulations are done":
        // the committed ratings changed, so the rough score refits on them — its blocks' values and its neighbours' corrections.
        // ROUGH_REFIT=0 skips it.)
        if (target === "src/data/feat-ratings.json" && process.env.ROUGH_REFIT !== "0") {
            const { spawnSync } = await import("node:child_process");
            const refit = spawnSync(process.execPath, [new URL("./rough-power.mjs", import.meta.url).pathname], { stdio: "inherit" });
            if (refit.status !== 0) console.error("The rough power refit failed; docs/rough-power.json is the old one.");
        }
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
