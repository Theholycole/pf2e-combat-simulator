#!/usr/bin/env node
// Foe-type benchmarks in one page (2026-11-05, Cole's pick "Foe-type benchmarks"): feats that only matter against one kind of foe
// (undead, fiends, giants, Large foes, ...) were rated again with every foe given that type (FEAT_FOE_TRAIT=<type>, its own run
// folder /tmp/claude-build/run-<type>). This joins each run's ratings.json with the main run's (Strike-only foes) rating.
//   node tools/foe-type-report.mjs [build dir] [out.md]
import fs from "fs";
import path from "path";

const dir = process.argv[2] ?? "/tmp/claude-build";
const out = process.argv[3] ?? "docs/feat-power-foe-types.md";
const TYPES = ["undead", "incorporeal", "fiend", "celestial", "dragon", "giant", "large", "elemental", "construct"];
const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);
const main = new Map((read(path.join(dir, "run", "ratings.json"))?.rated ?? []).map((r) => [r.name, r]));
const num = (v) => (v == null ? "—" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`);
const cell = (s) => String(s ?? "").replace(/\|/g, "/");

const lines = [
  "# Feat ratings against one foe type",
  "",
  "Feats whose rules or text only pay off against one kind of creature, rated again with every foe given that type (its traits,",
  "usual immunities, and size and reach for Large foes, giants and dragons). Same method as feat-power.md: whole fights with vs",
  "without the feat, forced use, rating in levels. \"Main run\" is the same feat against the usual foes with no type.",
  "",
];
const summary = [];
for (const t of TYPES) {
  const run = read(path.join(dir, `run-${t}`, "ratings.json"));
  if (!run) continue;
  const rows = [...run.rated].sort((a, b) => b.levels - a.levels);
  summary.push(`| ${t} | ${rows.length} | ${rows.slice(0, 3).filter((r) => r.levels > 0.04).map((r) => `${r.name} ${num(r.levels)}`).join(", ") || "—"} |`);
  lines.push(`## ${t[0].toUpperCase()}${t.slice(1)} foes`, "", "| Feat | Lvl | Played as | Rating (levels) | Boss | Group | Uses a fight | Main run | Verdict |", "|---|---:|---|---:|---:|---:|---:|---:|---|");
  for (const r of rows) {
    lines.push(`| ${cell(r.name)} | ${r.level} | ${cell(r.played)} | ${num(r.levels)} ± ${(r.se ?? 0).toFixed(2)} | ${num(r.boss)} | ${num(r.group)} | ${(r.uses ?? 0).toFixed(1)} | ${num(main.get(r.name)?.levels)} | ${r.verdict} |`);
  }
  lines.push("");
}
lines.splice(6, 0, "| Foe type | Feats rated | Best |", "|---|---:|---|", ...summary, "");
fs.writeFileSync(out, lines.join("\n") + "\n");
console.log(`${summary.length} foe types → ${out}`);
