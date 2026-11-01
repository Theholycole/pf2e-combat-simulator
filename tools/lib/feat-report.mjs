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
        `- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), ${fights} fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).`,
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

// The deviant abilities' report (tools/feat-power.mjs deviant-report): each feat plain, ranked, with what its backlash costs (its rating
// without backlash less its rating), how often it's used and how often it backlashes a fight; each awakening's gain over the plain feat at
// the level it comes; and what isn't played, and why.
export function deviantReport(rows) {
    const ok = rows.filter((row) => !row.skipped && !row.error && Number.isFinite(row.levels));
    const uses = (row) => Math.max(row.results.boss.uses, row.results.group.uses);
    const backlashes = (row) => (row.results.boss.backlashes + row.results.group.backlashes) / 2;
    const avgOf = (row, key) => (Number.isFinite(row.results.boss[key]) && Number.isFinite(row.results.group[key]) ? (row.results.boss[key] + row.results.group[key]) / 2 : NaN);
    const ranked = (variant, freeVariant) => ok.filter((row) => row.variant === variant).map((row) => {
        const free = ok.find((other) => other.slug === row.slug && other.variant === freeVariant);
        return { name: row.name, slug: row.slug, level: row.level, played: row.played, loadout: row.loadout ?? null, levels: row.levels, se: row.se, boss: row.results.boss.levels, group: row.results.group.levels, uses: uses(row), backlashes: backlashes(row), severe: avgOf(row, "severe"), danger: avgOf(row, "score"), plainDanger: avgOf(row, "plainScore"), backlashCost: free ? free.levels - row.levels : null, verdict: verdict(row) };
    }).sort((a, b) => b.levels - a.levels);
    const plain = ranked("plain", "no backlash");
    const allOut = ranked("all out", "all out, no backlash");
    const chosen = new Map(plain.map((row) => [row.slug, row]));
    const awakenings = ok.filter((row) => row.variant.startsWith("awakening")).map((row) => ({ name: row.name, slug: row.slug, awakening: row.variant.slice("awakening: ".length), level: row.level, gain: row.levels, se: row.se, uses: uses(row), backlashes: backlashes(row), verdict: verdict(row) })).sort((a, b) => b.gain - a.gain);
    const skipped = rows.filter((row) => row.skipped);
    const danger = (value) => (Number.isFinite(value) ? value.toFixed(3) : "—");
    const lines = [
        "# Deviant abilities in combat",
        "",
        `Made by \`node tools/feat-power.mjs <out> deviant\` on ${new Date().toISOString().slice(0, 10)}. Each deviant feat on the standard party's fighter (deviation DC: the higher of its class and spell DCs), at the feat's level, against a moderate boss and a moderate group, on the same square grid as the feat ratings, 200 fights each played as 50 adventuring days of 4 fights in a row, with the feat and without it on the same dice. Every use rolls the flat check (DC 5, +5 per success to 20); a failure brings the classification's backlash, mild then moderate then severe, and after severe no more deviations that day. The deviation carries from fight to fight within a day (its DC, its backlash stage, spent or not, and whatever backlash lasts beyond a fight); Hit Points are full at each fight's start, as after a rest, and frightened ticks down as usual.`,
        "",
        "**Danger score** of a fight: the share of the party's total Hit Points the foes took off, +0.25 for every PC knocked out, +1 for every PC killed, +1 more if the party is wiped out (0 is a flawless win; about 0.3 to 0.5 is a typical moderate fight). **Rating**: the average drop in danger score a fight that the feat brings, against the same party without it on the same dice, divided by how much the danger score rises when the foes are one level higher.",
        "",
        "Ratings are in levels of the foes (+0.25: like fighting foes a quarter of a level lower). **Backlash cost** is the rating without backlash less the rating with it.",
        "",
        "## All out",
        "",
        "Each ability used in every turn it can be (ahead of anything else, whatever the backlash risk), against the same party without it. **As the AI chooses** is the rating below, where the AI weighs the risk.",
        "",
        "| # | Ability | Lvl | Played as | Rating all out | Boss | Group | As the AI chooses | Danger with | Danger without | Backlash cost | Uses a fight | Backlashes a fight | Severe a fight | Verdict |",
        "|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|",
        ...allOut.map((row, index) => `| ${index + 1} | ${escape(row.name)}${row.loadout ? " (one-handed weapon, free hand)" : ""} | ${row.level} | ${row.played} | ${fmt(row.levels)} ± ${row.se.toFixed(2)} | ${fmt(row.boss)} | ${fmt(row.group)} | ${chosen.has(row.slug) ? fmt(chosen.get(row.slug).levels) : "—"} | ${danger(row.danger)} | ${danger(row.plainDanger)} | ${fmt(row.backlashCost)} | ${row.uses.toFixed(1)} | ${row.backlashes.toFixed(2)} | ${Number.isFinite(row.severe) ? row.severe.toFixed(2) : "—"} | ${row.verdict} |`),
        "",
        "## As the AI chooses",
        "",
        "| # | Ability | Lvl | Played as | Rating | Boss | Group | Danger with | Danger without | Backlash cost | Uses a fight | Backlashes a fight | Severe a fight | Verdict |",
        "|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|",
        ...plain.map((row, index) => `| ${index + 1} | ${escape(row.name)}${row.loadout ? " (one-handed weapon, free hand)" : ""} | ${row.level} | ${row.played} | ${fmt(row.levels)} ± ${row.se.toFixed(2)} | ${fmt(row.boss)} | ${fmt(row.group)} | ${danger(row.danger)} | ${danger(row.plainDanger)} | ${fmt(row.backlashCost)} | ${row.uses.toFixed(1)} | ${row.backlashes.toFixed(2)} | ${Number.isFinite(row.severe) ? row.severe.toFixed(2) : "—"} | ${row.verdict} |`),
        "",
        "## Awakenings",
        "",
        "Each awakening alone, at the level Awakened Power (4th) or Greater Awakened Power (10th) gives it, against the plain feat at that level, both used all out.",
        "",
        "| # | Ability | Awakening | Lvl | Gain over plain | Uses a fight | Backlashes a fight | Verdict |",
        "|---:|---|---|---:|---:|---:|---:|---|",
        ...awakenings.map((row, index) => `| ${index + 1} | ${escape(row.name)} | ${row.awakening} | ${row.level} | ${fmt(row.gain)} ± ${row.se.toFixed(2)} | ${row.uses.toFixed(1)} | ${row.backlashes.toFixed(2)} | ${row.verdict} |`),
        "",
        "## Not played",
        "",
        "| Ability | Variant | Why |",
        "|---|---|---|",
        ...skipped.filter((row) => !["no backlash", "all out", "all out, no backlash"].includes(row.variant)).map((row) => `| ${escape(row.name)} | ${row.variant} | ${escape(row.reason)} |`),
        ""
    ];
    return { markdown: lines.join("\n"), json: { version: 1, kind: "deviant", generated: new Date().toISOString(), rated: plain, allOut, awakenings, skipped: skipped.map((row) => ({ name: row.name, variant: row.variant, reason: row.reason })) } };
}

// --- The compendium numbers ------------------------------------------------------
// (2026-11-01, Cole: "put every feat's power next to it in the compendium browser".) The ratings by compendium and id, as
// src/data/feat-ratings.json keeps them for scripts/danger.js: { version, kind: "feats", ratings: { collection: { id: levels } },
// detail: { collection: { id: { level, host, played, boss, group, uses, se, verdict, loadout, situational, deviant } } } }.
// The PF2e system's packs by their folder (static/system.json): feats → feats-srd, actions → actionspf2e; a module's by "<module>/<name>".
const PF2E_PACKS = { feats: "feats-srd", actions: "actionspf2e" };
const collectionOf = (ref) => (ref.source === "pf2e" ? `pf2e.${PF2E_PACKS[ref.pack] ?? ref.pack}` : ref.pack.replace("/", "."));
const hundredth = (value) => Math.round(value * 100) / 100;
export function featCompendiumData({ rated, deviant = null, ancestry = null, refs = [], slugOf = () => null, now = new Date().toISOString() }) {
    const ratings = {};
    const detail = {};
    const put = (ref, value, info) => {
        const collection = collectionOf(ref);
        (ratings[collection] ??= {})[ref.id] = hundredth(value);
        (detail[collection] ??= {})[ref.id] = info;
    };
    const byRef = new Map(refs.map((ref) => [ref.ref, ref]));
    for (const row of rated ?? []) {
        const ref = byRef.get(row.ref) ?? (() => {
            const [source, pack, id] = String(row.ref).split(":");
            return { source, pack, id };
        })();
        put(ref, row.levels, { level: row.level, host: row.host, played: row.played, boss: hundredth(row.boss), group: hundredth(row.group), uses: hundredth(row.uses ?? 0), se: hundredth(row.se), verdict: row.verdict, ...(row.loadout ? { loadout: row.loadout } : {}), ...(row.situational ? { situational: true } : {}) });
    }
    // (The deviant abilities: as the AI uses them over a day of four fights, and used all out.)
    const allOut = new Map((deviant?.allOut ?? []).map((row) => [row.slug ?? row.name, row]));
    const bySlug = new Map(refs.filter((ref) => ref.source === "pf2e" && ref.pack === "feats").map((ref) => [slugOf(ref), ref]));
    for (const row of deviant?.rated ?? []) {
        const ref = bySlug.get(row.slug) ?? refs.find((each) => each.source === "pf2e" && each.pack === "feats" && each.name === row.name);
        if (!ref) continue;
        const all = allOut.get(row.slug ?? row.name);
        put(ref, row.levels, { level: row.level, host: "fighter", played: row.played, boss: hundredth(row.boss), group: hundredth(row.group), uses: hundredth(row.uses ?? 0), se: hundredth(row.se), verdict: row.verdict, ...(row.loadout ? { loadout: row.loadout } : {}), deviant: { backlashes: hundredth(row.backlashes ?? 0), severe: hundredth(row.severe ?? 0), ...(all ? { allOut: hundredth(all.levels) } : {}) } });
    }
    // (2026-11-01, Cole: "Next evaluate the power of each ancestry and background": tools/ancestry-power.mjs's, in the PF2e system's packs.)
    for (const [kind, collection] of [["ancestries", "pf2e.ancestries"], ["heritages", "pf2e.heritages"], ["backgrounds", "pf2e.backgrounds"]]) {
        for (const row of ancestry?.[kind]?.rated ?? []) {
            (ratings[collection] ??= {})[row.id] = hundredth(row.levels);
            (detail[collection] ??= {})[row.id] = { kind: kind.slice(0, -1).replace(/ie$/, "y"), se: hundredth(row.se), byHost: Object.fromEntries(Object.entries(row.byHost ?? {}).map(([host, value]) => [host, hundredth(value)])), byLevel: Object.fromEntries(Object.entries(row.byLevel ?? {}).map(([level, value]) => [level, hundredth(value)])), verdict: row.verdict, ...(row.ancestry ? { ancestry: row.ancestry } : {}), ...(row.feats?.length ? { feats: row.feats } : {}), ...(row.skills?.length ? { skills: row.skills } : {}), ...(row.host ? { host: row.host } : {}) };
        }
    }
    return { version: 1, kind: "feats", method: "whole fights, with vs without", run: now, generated: now.slice(0, 10), party: ["fighter", "rogue", "wizard", "cleric"], ratings, detail };
}
