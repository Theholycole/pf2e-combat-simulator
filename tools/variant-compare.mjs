// Ancestry Paragon against Free Archetype (2026-11-13, Cole: "compare ancestry paragon and free archetype to each other's power. Which
// is strongest potentially, weakest potentially and which has a higher average").
//
//   node tools/variant-compare.mjs <root> [--write=<file.md>]
//
// <root> holds the ancestry-power runs (each its ancestry.jsonl): std-best, std-worst, std-random (the standard ancestry feat slots,
// ANCESTRY_PICK=best|worst|random), para-best, para-worst, para-random (ANCESTRY_PARAGON=1) and fa (--kind=free-archetype). Every number
// is in levels of the foes against the standard party (all humans, no variant), the mean over the four PCs, at levels 5, 11 and 17
// (Free Archetype has no slot at 1st; Paragon's 1st-level numbers are shown on their own).
import fs from "node:fs";

const root = process.argv[2];
const write = process.argv.find((arg) => arg.startsWith("--write="))?.split("=")[1];
const LEVELS = [5, 11, 17];
const read = (dir) => {
    const path = `${root}/${dir}/ancestry.jsonl`;
    return fs.existsSync(path) ? fs.readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)) : null;
};
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const f = (x) => (Number.isFinite(x) ? `${x >= 0 ? "+" : ""}${x.toFixed(3)}` : "—");

// An ancestry with its feats, per ancestry: { name, byLevel: {level: mean over PCs}, levels (5/11/17), feats at 17 on the fighter }.
function withFeats(rows) {
    if (!rows) return null;
    const own = rows.filter((row) => row.kind === "ancestry" && Number.isFinite(row.levels));
    const feated = rows.filter((row) => row.kind === "ancestry-feats" && !row.error);
    const out = new Map();
    for (const row of own) {
        const hit = feated.find((each) => each.id === row.id && each.level === row.level && each.host === row.host);
        const value = hit && !hit.noFeats && Number.isFinite(hit.levels) ? hit.levels : row.levels;
        const entry = out.get(row.id) ?? { name: row.name, cells: [], feats: [] };
        entry.cells.push({ level: row.level, host: row.host, value, feats: hit?.feats ?? [] });
        out.set(row.id, entry);
    }
    for (const entry of out.values()) {
        entry.byLevel = Object.fromEntries([1, ...LEVELS].map((level) => [level, mean(entry.cells.filter((c) => c.level === level).map((c) => c.value))]));
        entry.levels = mean(entry.cells.filter((c) => LEVELS.includes(c.level)).map((c) => c.value));
        entry.feats17 = entry.cells.find((c) => c.level === 17 && c.host === "fighter")?.feats ?? [];
    }
    return out;
}
const runs = Object.fromEntries(["std-best", "std-worst", "std-random", "para-best", "para-worst", "para-random"].map((dir) => [dir, withFeats(read(dir))]));
const fa = (read("fa") ?? []).filter((row) => row.kind === "free-archetype" && !row.error);

const lines = ["# Ancestry Paragon vs Free Archetype", "", `Made ${new Date().toISOString().slice(0, 10)} by tools/variant-compare.mjs from the runs in ${root}. Levels of the foes against the standard party (fighter, rogue, wizard, cleric; all humans, no variant): +0.25 is like fighting foes a quarter of a level lower. Each number is the mean over the four PCs at levels 5, 11 and 17, the variant on one PC at a time.`, ""];
lines.push("- **Ancestry Paragon**: an ancestry and its ancestry feats in Paragon's slots (two at 1st, then every odd level) against the same ancestry in the standard slots (1st, 5th, 9th, 13th, 17th). **Best**: the best-rated feats the PC plays; **worst**: the worst-rated; **random**: shuffled (a player not picking for power).");
lines.push("- **Free Archetype**: archetype feats in the extra slots at every even level, against the PC without them. **Best**: the archetypes whose helpful feats add up highest (a second one once the first has two feats); **worst**: the most harmful; **random**: a random archetype and feats, 8 draws per PC and level.");
lines.push("- Only feats the full re-rate rated count; a slot with nothing rated takes a feat no fight uses. Picks use each feat's own rating (forced use), so \"worst\" is a PC that keeps using its bad feats.", "");

const summary = [];
if (runs["para-best"] && runs["std-best"]) {
    lines.push("## Ancestry Paragon", "");
    const table = [];
    for (const [id, para] of runs["para-best"]) {
        const row = { name: para.name };
        for (const pick of ["best", "worst", "random"]) {
            const p = runs[`para-${pick}`]?.get(id);
            const s = runs[`std-${pick}`]?.get(id);
            row[pick] = p?.levels;
            row[`${pick}Gain`] = p && s ? p.levels - s.levels : NaN;
            row[`${pick}L1`] = p && s ? p.byLevel[1] - s.byLevel[1] : NaN;
        }
        row.feats = para.feats17;
        table.push(row);
    }
    table.sort((a, b) => b.bestGain - a.bestGain);
    lines.push("Sorted by what Paragon adds with the best picks. **With** is the ancestry and its Paragon feats against a human; **adds** is Paragon over the standard slots for the same ancestry and picks.", "");
    lines.push("| # | Ancestry | Best: with | Best: adds | Random: adds | Worst: adds | Best adds at 1st | Best feats (fighter, 17th) |", "|---:|---|---:|---:|---:|---:|---:|---|");
    table.forEach((r, i) => lines.push(`| ${i + 1} | ${r.name} | ${f(r.best)} | ${f(r.bestGain)} | ${f(r.randomGain)} | ${f(r.worstGain)} | ${f(r.bestL1)} | ${r.feats.join(", ")} |`));
    lines.push("");
    const ok = (key) => table.filter((r) => Number.isFinite(r[key]));
    const top = ok("bestGain")[0];
    const bottom = [...ok("worstGain")].sort((a, b) => a.worstGain - b.worstGain)[0];
    summary.push({ variant: "Ancestry Paragon", strongest: top?.bestGain, strongestWhat: top?.name, weakest: bottom?.worstGain, weakestWhat: bottom?.name, average: mean(ok("randomGain").map((r) => r.randomGain)), bestAverage: mean(ok("bestGain").map((r) => r.bestGain)) });
}
if (fa.length) {
    lines.push("## Free Archetype", "");
    lines.push("| Pick | Level | Fighter | Rogue | Wizard | Cleric | Mean | Archetypes (fighter) |", "|---|---:|---:|---:|---:|---:|---:|---|");
    const cell = (pick, level, host) => mean(fa.filter((r) => r.pick === pick && r.level === level && r.host === host).map((r) => r.levels));
    const by = {};
    for (const pick of ["best", "random", "worst"]) {
        for (const level of LEVELS) {
            const vals = ["fighter", "rogue", "wizard", "cleric"].map((host) => cell(pick, level, host));
            const arch = [...new Set(fa.filter((r) => r.pick === pick && r.level === level && r.host === "fighter").map((r) => r.archetype).filter(Boolean))].slice(0, 3).join("; ");
            lines.push(`| ${pick} | ${level} | ${vals.map(f).join(" | ")} | ${f(mean(vals.filter(Number.isFinite)))} | ${arch} |`);
        }
        by[pick] = mean(fa.filter((r) => r.pick === pick && LEVELS.includes(r.level) && Number.isFinite(r.levels)).map((r) => r.levels));
    }
    lines.push("");
    summary.push({ variant: "Free Archetype", strongest: by.best, strongestWhat: "best archetypes", weakest: by.worst, weakestWhat: "worst archetypes", average: by.random, bestAverage: by.best });
}
if (summary.length) {
    lines.splice(6, 0, "## Head to head", "", "What each variant adds over the standard rules (levels of the foes, the mean over PCs at levels 5, 11 and 17).", "", "| Variant | Strongest (best picks) | Average (random picks) | Weakest (worst picks) |", "|---|---:|---:|---:|", ...summary.map((s) => `| ${s.variant} | ${f(s.strongest)} (${s.strongestWhat}) | ${f(s.average)} | ${f(s.weakest)} (${s.weakestWhat}) |`), "", ...(summary.length === 2 ? [`Best picks on an average ancestry: Paragon adds ${f(summary[0].bestAverage)}.`, ""] : []));
}
const text = lines.join("\n") + "\n";
if (write) fs.writeFileSync(write, text);
console.log(text);
