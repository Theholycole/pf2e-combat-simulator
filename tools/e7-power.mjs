// The E7 home rule's post-cap feats in combat (tools/lib/e7-power.mjs has the method and the variants), on worker threads:
//
//   node tools/e7-power.mjs <out folder> scale     the 7th-level party's plain fights against each tier of foes, and a level up and down
//   node tools/e7-power.mjs <out folder> rate      every variant against every tier and encounter (--only=<id,id>)
//   node tools/e7-power.mjs <out folder> feats     the fighter's, rogue's, wizard's and cleric's class feats above 7th level, on its PC
//   node tools/e7-power.mjs <out folder> report    <out>/e7-power.md and <out>/e7-ratings.json
//
//   --workers N (default: the cores less two); FEAT_FIGHTS=200 fights an encounter.
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

if (!isMainThread) {
    const lib = await import("./lib/e7-power.mjs");
    workerLoop((task) => lib.e7RunTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    const only = process.argv.find((arg) => arg.startsWith("--only="))?.split("=")[1]?.split(",");
    if (!out || !phase) {
        console.error("node tools/e7-power.mjs <out folder> scale|rate|report [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    const read = (name) => (fs.existsSync(`${out}/${name}`) ? fs.readFileSync(`${out}/${name}`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : []);
    const run = (tasks, file, options = {}) => runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/${file}`, ...options });
    const { VARIANTS, TIERS, KINDS } = await import("./lib/e7-power.mjs");
    const tiers = Object.keys(TIERS);
    if (phase === "scale") {
        await run(tiers.flatMap((tier) => KINDS.map((encounter) => ({ kind: "e7-scale", tier, encounter }))), "scale.jsonl");
    } else if (phase === "rate") {
        const scale = new Map(read("scale.jsonl").map((row) => [`${row.tier}|${row.encounter}`, row]));
        if (!scale.size) throw new Error("Run the scale phase first.");
        const ids = VARIANTS.map((v) => v.id).filter((id) => !only || only.includes(id));
        await run(ids.flatMap((id) => tiers.flatMap((tier) => KINDS.map((encounter) => ({ kind: "e7", id, tier, encounter, plain: scale.get(`${tier}|${encounter}`) })))), "rate.jsonl", { append: !!only });
    } else if (phase === "feats") {
        const scale = new Map(read("scale.jsonl").map((row) => [`${row.tier}|${row.encounter}`, row]));
        if (!scale.size) throw new Error("Run the scale phase first.");
        const { classFeatRefs } = await import("./lib/e7-power.mjs");
        const refs = classFeatRefs().map(({ ref, path, id, name, level, traits }) => ({ ref, path, id, name, level, traits }));
        await run(refs.flatMap((ref) => tiers.flatMap((tier) => KINDS.map((encounter) => ({ kind: "e7-feat", ref, tier, encounter, plain: scale.get(`${tier}|${encounter}`) })))), "feats.jsonl");
    } else if (phase === "report") {
        const { markdown, json } = e7Report(read("rate.jsonl"), VARIANTS, tiers, KINDS, read("feats.jsonl"));
        fs.writeFileSync(`${out}/e7-power.md`, markdown);
        fs.writeFileSync(`${out}/e7-ratings.json`, JSON.stringify(json, null, 1));
        console.log(`${json.rated.length} variants → ${out}/e7-power.md`);
    }
}

// The table: each variant's levels at each tier (the boss's and the group's averaged), and against its PC's yardstick (that PC a level up):
// the share of a level it is worth, and so its XP price at 1,000 XP a level.
function e7Report(rows, variants, tiers, kinds, featRows = []) {
    const latest = new Map();
    for (const row of rows) latest.set(`${row.id}|${row.tier}|${row.encounter}`, row);
    const at = (id, tier) => {
        const parts = kinds.map((kind) => latest.get(`${id}|${tier}|${kind}`)).filter(Boolean);
        if (parts.length < kinds.length) return null;
        return { levels: parts.reduce((s, p) => s + p.levels, 0) / parts.length, se: Math.sqrt(parts.reduce((s, p) => s + p.se ** 2, 0)) / parts.length, boss: parts[0].levels, group: parts[1].levels };
    };
    const rated = variants.map((v) => {
        const byTier = Object.fromEntries(tiers.map((tier) => [tier, at(v.id, tier)]));
        // (The yardstick: a PC's level, averaged over the four PCs — one PC's alone is noisy, and XP buys the same for every class.)
        const yard = Object.fromEntries(tiers.map((tier) => {
            const each = ["fighter", "rogue", "wizard", "cleric"].map((pc) => at(`level-8-${pc}`, tier)).filter(Boolean);
            return [tier, each.length ? { levels: each.reduce((s, y) => s + y.levels, 0) / each.length } : null];
        }));
        const both = tiers.filter((tier) => byTier[tier] && yard[tier]);
        const levels = both.reduce((s, t) => s + byTier[t].levels, 0) / both.length;
        const share = both.reduce((s, t) => s + byTier[t].levels / Math.max(0.01, yard[t].levels), 0) / both.length;
        return { ...v, party: undefined, byTier, yardstick: yard, levels, share, xp: Math.round((share * 1000) / 50) * 50 };
    }).filter((row) => Number.isFinite(row.levels));
    const sorted = [...rated].sort((a, b) => b.levels - a.levels);
    const f = (x) => (x == null ? "—" : `${x >= 0 ? "+" : "−"}${Math.abs(x).toFixed(2)}`);
    const lines = [
        "# E7 feats in combat",
        "",
        `Made by \`node tools/e7-power.mjs <out> scale|rate|report\` on ${new Date().toISOString().slice(0, 10)}. Each post-cap feat of the E7 rules goes on one PC of the standard 7th-level party (fighter, rogue, wizard, cleric), which then fights the same encounters on the same dice as the plain party, in days of four fights (spell slots spent stay spent; Hit Points fresh each fight). The foes cast a Reflex, a Will and a Fortitude spell beside their Strikes, so saves count. **Levels** is how much stronger the party is, in levels of the foes (the feat ratings' scale). **At the cap**: a 9th-level boss or four 5th-level foes; **above**: an 11th-level boss or four 7th-level foes. **Share of a level** divides by a PC raised to 8th level (what 1,000 XP buys before the cap), averaged over the four PCs, so **XP** is the price that makes the feat as good per XP as a level.`,
        "",
        "| # | Feat | PC | What it does here | At the cap | Above the cap | Average | Share of a level | XP |",
        "|---:|---|---|---|---:|---:|---:|---:|---:|",
        ...sorted.map((r, i) => `| ${i + 1} | ${r.feat} | ${r.pc} | ${r.note} | ${f(r.byTier.cap?.levels)} | ${f(r.byTier.above?.levels)} | ${f(r.levels)} ± ${(Math.sqrt(tiers.reduce((s, t) => s + (r.byTier[t]?.se ?? 0) ** 2, 0)) / tiers.length).toFixed(2)} | ${(r.share * 100).toFixed(0)}% | ${r.xp} |`)
    ];
    // The class feats above the cap: each feat's levels over both tiers and encounters, then by class and access feat.
    const yardAll = tiers.reduce((sum, tier) => sum + (rated[0]?.yardstick?.[tier]?.levels ?? 0), 0) / tiers.length;
    const feats = new Map();
    for (const row of featRows) {
        const key = row.ref.ref;
        if (!feats.has(key)) feats.set(key, { name: row.name, level: row.level, seat: row.seat, played: row.played, rows: [], skipped: row.skipped ? row.reason : null });
        if (!row.skipped && Number.isFinite(row.levels)) feats.get(key).rows.push(row);
    }
    const featList = [...feats.values()].filter((f) => f.rows.length === tiers.length * kinds.length).map((f) => {
        const byTier = Object.fromEntries(tiers.map((tier) => [tier, f.rows.filter((r) => r.tier === tier).reduce((s, r) => s + r.levels, 0) / kinds.length]));
        const levels = tiers.reduce((s, t) => s + byTier[t], 0) / tiers.length;
        return { ...f, rows: undefined, byTier, levels, share: levels / Math.max(0.01, yardAll) };
    }).sort((a, b) => b.levels - a.levels);
    const band = (level) => (level <= 10 ? "Veteran Hero (8th–10th)" : level <= 15 ? "Exceptional Hero (12th–15th)" : "Legendary Hero (16th+)");
    const groups = new Map();
    for (const f of featList) {
        const key = `${f.seat}|${band(f.level)}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(f);
    }
    const unplayed = [...feats.values()].filter((f) => f.skipped).length;
    if (featList.length) lines.push(
        "",
        "## Class feats above the cap",
        "",
        `Each fighter, rogue, wizard and cleric class feat above 7th level on its class's PC of the 7th-level party, played as the feat ratings play it (its use forced), in the same days against the same foes. ${featList.length} were played; ${unplayed} are feats the simulator doesn't play yet. **Share** divides by a PC's level (the yardstick above).`,
        "",
        "| Class | Access feat | Feats played | Average | Best | Best feat |",
        "|---|---|---:|---:|---:|---|",
        ...[...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, list]) => {
            const [seat, name] = key.split("|");
            const avg = list.reduce((s, f) => s + f.levels, 0) / list.length;
            return `| ${seat} | ${name} | ${list.length} | ${f(avg)} (${((avg / Math.max(0.01, yardAll)) * 100).toFixed(0)}%) | ${f(list[0].levels)} (${(list[0].share * 100).toFixed(0)}%) | ${list[0].name} (${list[0].level}) |`;
        }),
        "",
        "| # | Feat | Level | Class | At the cap | Above the cap | Average | Share of a level |",
        "|---:|---|---:|---|---:|---:|---:|---:|",
        ...featList.map((x, i) => `| ${i + 1} | ${x.name} | ${x.level} | ${x.seat} | ${f(x.byTier.cap)} | ${f(x.byTier.above)} | ${f(x.levels)} | ${(x.share * 100).toFixed(0)}% |`)
    );
    return { markdown: `${lines.join("\n")}\n`, json: { made: new Date().toISOString(), rated: sorted, classFeats: featList } };
}
