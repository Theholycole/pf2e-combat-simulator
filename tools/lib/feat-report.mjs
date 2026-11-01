// The feat ratings' report (tools/feat-power.mjs report): the rated feats and actions ranked, the basic actions, and what isn't simulated and
// why. Markdown for docs/feat-power.md and a JSON of every row.

const fmt = (value, digits = 2) => (Number.isFinite(value) ? `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}` : "—");
const escape = (text) => String(text ?? "").replace(/\|/g, "\\|");
const CATEGORY_NAMES = { class: "Class", ancestry: "Ancestry", skill: "Skill", general: "General", archetype: "Archetype", bonus: "Bonus", classfeature: "Class feature", pfsboon: "PFS boon", calling: "Calling", deityboon: "Deity boon", curse: "Curse", "class-action": "Class action", "skill-action": "Skill action", "ancestry-action": "Ancestry action", offensive: "Action", defensive: "Action", interaction: "Action", action: "Action" };
const CLASSES = ["alchemist", "animist", "barbarian", "bard", "champion", "cleric", "commander", "druid", "exemplar", "fighter", "guardian", "gunslinger", "inventor", "investigator", "kineticist", "magus", "monk", "oracle", "psychic", "ranger", "rogue", "sorcerer", "summoner", "swashbuckler", "thaumaturge", "witch", "wizard"];

// Played as something always on, with no use of its own to log (a save bonus, a passive's rules, fast healing).
const ALWAYS_ON = new Set(["save-bonus", "passive-rules", "fast-healing"]);

// A rating's word: how much it moves a fight, in levels of the foes.
export function verdict(row) {
    const { levels, se } = row;
    if (Math.abs(levels) < 2 * se || Math.abs(levels) < 0.05) return "no clear effect";
    if (levels >= 0.5) return "very strong";
    if (levels >= 0.25) return "strong";
    if (levels >= 0.1) return "good";
    if (levels > 0) return "minor";
    return "hurts";
}

export function featReport({ feats, basics, scale }) {
    const rated = feats.filter((row) => !row.skipped && !row.error && Number.isFinite(row.levels));
    const skippedRows = feats.filter((row) => row.skipped);
    const errors = feats.filter((row) => row.error);
    const ofClass = (row) => (row.ref?.traits ?? []).find((trait) => CLASSES.includes(trait)) ?? null;
    const category = (row) => CATEGORY_NAMES[row.ref?.category] ?? row.ref?.category ?? "Feat";
    const used = (row) => Math.max(row.results?.boss?.uses ?? 0, row.results?.group?.uses ?? 0);
    const rows = rated.map((row) => ({
        name: row.name, ref: row.ref.ref, source: row.ref.source, level: row.ref.level, category: category(row), class: ofClass(row), host: row.host, played: row.played,
        levels: row.levels, se: row.se, boss: row.results.boss.levels, group: row.results.group.levels, uses: used(row), situational: !!row.situational, loadout: row.loadout ?? null, verdict: verdict(row)
    })).sort((a, b) => b.levels - a.levels);
    const notes = (row) => [row.situational ? "always on (its moment isn't checked)" : null, row.loadout ? `with ${row.loadout}` : null, row.uses < 0.05 && !ALWAYS_ON.has(row.played) && !row.situational ? "the AI never used it" : null].filter(Boolean).join("; ");
    const table = (list) => [
        "| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |",
        "|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|",
        ...list.map((row, index) => `| ${index + 1} | ${escape(row.name)}${row.source !== "pf2e" ? ` (${escape(row.source)})` : ""} | ${row.level} | ${row.category} | ${row.class ?? "—"} | ${escape(row.played)} | ${fmt(row.levels)} ± ${row.se.toFixed(2)} | ${fmt(row.boss)} | ${fmt(row.group)} | ${row.uses.toFixed(1)} | ${row.verdict} | ${escape(notes(row))} |`)
    ].join("\n");
    const reasons = {};
    for (const row of skippedRows) {
        const reason = String(row.reason ?? "").replace(/\s*\(.*\)$/, "");
        reasons[reason] = (reasons[reason] ?? 0) + 1;
    }
    const basicRows = basics.filter((row) => !row.error).sort((a, b) => b.levels - a.levels);
    const byVerdict = {};
    for (const row of rows) byVerdict[row.verdict] = (byVerdict[row.verdict] ?? 0) + 1;
    const fights = scale[0]?.scores?.length ?? 0;
    const lines = [
        "# Feat and action power in combat",
        "",
        `Made by \`node tools/feat-power.mjs\` on ${new Date().toISOString().slice(0, 10)}: ${rows.length} feats and actions rated, ${skippedRows.length} not simulated${errors.length ? `, ${errors.length} errors` : ""}.`,
        "",
        "## How it's measured",
        "",
        "- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.",
        `- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), ${fights} fights each, with the feat and without it, on the same dice. Fights go to the end (no morale, no retreat).`,
        "- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.",
        "- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.",
        "- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.",
        "- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; \"no clear effect\" when within two standard errors of zero.",
        "",
        "## Summary",
        "",
        ...Object.entries(byVerdict).sort((a, b) => b[1] - a[1]).map(([name, count]) => `- ${name}: ${count}`),
        "",
        "## Top 40",
        "",
        table(rows.slice(0, 40)),
        "",
        "## Basic actions",
        "",
        "Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.",
        "",
        "| Action | Rating (levels) | Uses a fight (level 10 boss) |",
        "|---|---:|---:|",
        ...basicRows.map((row) => `| ${escape(row.name)} | ${fmt(row.levels)} ± ${row.se.toFixed(2)} | ${(row.rows?.["10|boss"]?.uses ?? 0).toFixed(1)} |`),
        "",
        "## Every rated feat and action",
        "",
        table(rows),
        "",
        "## Not simulated, by reason",
        "",
        "| Reason | Count |",
        "|---|---:|",
        ...Object.entries(reasons).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `| ${escape(reason)} | ${count} |`),
        ""
    ];
    return {
        markdown: lines.join("\n"),
        json: { version: 1, kind: "feats", method: "whole fights, with vs without", generated: new Date().toISOString(), fights, rated: rows, basics: basicRows.map((row) => ({ name: row.name, slug: row.slug, levels: row.levels, se: row.se })), skipped: skippedRows.length, notSimulated: skippedRows.map((row) => ({ name: row.name, ref: row.ref?.ref, reason: row.reason })), reasons }
    };
}
