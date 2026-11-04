// The ancestry, heritage and background table (tools/ancestry-power.mjs report): docs/ancestry-power.md and its json.
import { HERITAGE_LEVELS, HOSTS, LEVELS } from "./ancestry-power.mjs";

const signed = (value, digits = 2) => (Math.round(value * 10 ** digits) === 0 ? (0).toFixed(digits) : `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`);
const verdictOf = (levels, se) => (Math.abs(levels) < Math.max(0.03, 2 * se) ? "no clear effect" : levels >= 0.25 ? "strong" : levels >= 0.1 ? "good" : levels > 0 ? "minor" : levels > -0.1 ? "slightly worse" : "hurts");

// The rows of one thing, averaged: over its PCs and levels (and the PC and level it's best at).
function summary(rows) {
    const rated = rows.filter((row) => Number.isFinite(row.levels));
    if (!rated.length) return null;
    const mean = (list) => list.reduce((sum, row) => sum + row.levels, 0) / list.length;
    const levels = mean(rated);
    const se = Math.sqrt(rated.reduce((sum, row) => sum + (row.se ?? 0) ** 2, 0)) / rated.length;
    const byHost = Object.fromEntries(HOSTS.map((host) => [host, rated.filter((row) => row.host === host)]).filter(([, list]) => list.length).map(([host, list]) => [host, mean(list)]));
    const byLevel = Object.fromEntries(LEVELS.map((level) => [level, rated.filter((row) => row.level === level)]).filter(([, list]) => list.length).map(([level, list]) => [level, mean(list)]));
    return { levels, se, byHost, byLevel, verdict: verdictOf(levels, se) };
}

const round = (value) => Math.round(value * 1000) / 1000;
const roundAll = (object) => Object.fromEntries(Object.entries(object).map(([key, value]) => [key, round(value)]));

export function ancestryReport(rows) {
    const group = (kind) => {
        const map = new Map();
        for (const row of rows.filter((each) => each.kind === kind)) {
            for (const [index, id] of (row.ids ?? [row.id]).entries()) {
                const entry = map.get(id) ?? { id, name: row.names?.[index] ?? row.name, ancestry: row.ancestry ?? null, rows: [], skipped: [], feats: row.feats ?? null, skills: row.skills ?? null, host: kind === "background" ? row.host : null };
                if (row.skipped) entry.skipped.push(row.reason);
                else if (!row.error) entry.rows.push(row);
                if (row.feats?.length) entry.feats = row.feats;
                if (row.skills?.length) entry.skills = row.skills;
                if (!row.skipped && row.host) entry.host = row.host;
                map.set(id, entry);
            }
        }
        const rated = [];
        const skipped = [];
        for (const entry of map.values()) {
            const made = summary(entry.rows);
            if (made) rated.push({ id: entry.id, name: entry.name, ...(entry.ancestry ? { ancestry: entry.ancestry } : {}), ...(entry.feats?.length ? { feats: entry.feats } : {}), ...(entry.skills?.length ? { skills: entry.skills } : {}), ...(kind === "background" ? { host: entry.host } : {}), levels: round(made.levels), se: round(made.se), byHost: roundAll(made.byHost), byLevel: roundAll(made.byLevel), verdict: made.verdict });
            else skipped.push({ id: entry.id, name: entry.name, reason: entry.skipped[0] ?? "not run" });
        }
        rated.sort((a, b) => b.levels - a.levels || a.name.localeCompare(b.name));
        return { rated, skipped };
    };
    const ancestries = group("ancestry");
    // An ancestry with its feats: on each PC and level, its feats' row (or its own, where it plays no feat there).
    const featRows = rows.filter((row) => row.kind === "ancestry-feats" && !row.error);
    const withFeats = (() => {
        if (!featRows.length) return null;
        const rated = [];
        for (const base of ancestries.rated) {
            const own = rows.filter((row) => row.kind === "ancestry" && row.id === base.id && Number.isFinite(row.levels));
            const merged = own.map((row) => {
                const feats = featRows.find((each) => each.id === row.id && each.level === row.level && each.host === row.host);
                return feats && !feats.noFeats && Number.isFinite(feats.levels) ? { ...feats } : { ...row, feats: [] };
            });
            const made = summary(merged);
            if (!made) continue;
            const top = merged.find((row) => row.level === LEVELS.at(-1) && row.host === "fighter")?.feats ?? [];
            const all = [...new Set(merged.flatMap((row) => row.feats ?? []))];
            rated.push({ id: base.id, name: base.name, levels: round(made.levels), se: round(made.se), own: base.levels, gain: round(made.levels - base.levels), byHost: roundAll(made.byHost), byLevel: roundAll(made.byLevel), feats: all, fighter17: top, verdict: made.verdict });
        }
        rated.sort((a, b) => b.levels - a.levels || a.name.localeCompare(b.name));
        return rated;
    })();
    const heritages = group("heritage");
    const backgrounds = group("background");
    const now = new Date().toISOString().slice(0, 10);
    const lines = [
        "# Ancestries, heritages and backgrounds in combat",
        "",
        `Made by \`node tools/ancestry-power.mjs <out> run\` and \`report\` on ${now}, the feat ratings' method: whole fights with it and without it, on the same dice (100 fights an encounter for each PC and level), against a moderate boss and a moderate group on the square grid, the gap in **levels of the foes** (+0.25: like fighting foes a quarter of a level lower).`,
        "",
        `- **Ancestry**: on one PC of the standard party at a time (fighter, rogue, wizard, cleric), at levels ${LEVELS.join(", ")}, against that PC as a human (8 Hit Points, 25 feet, Medium, no special senses): its Hit Points, Speed, size, vision and its features' PF2e rules. Its ability boosts aren't counted (the party's scores are a class's usual ones, which free boosts reach). The fights here are in bright light, so darkvision and low-light vision don't show.`,
        `- **Heritage**: on top of its ancestry (a versatile heritage on a human), at levels ${HERITAGE_LEVELS.join(" and ")} on each PC, against the ancestry alone on the same dice: its PF2e rules, always on.`,
        "- **Background**: the skill feat it grants (where the simulator plays it, on the PC the feat ratings put it on; Battle Medicine on the fighter), its own rules, and the combat skills it trains (Athletics, Intimidation, Deception, Acrobatics, Medicine) on a PC without them, against the party without them. Backgrounds that come to the same thing share one set of fights.",
        "",
        ...(withFeats
            ? [
                  "## Ancestries with their ancestry feats",
                  "",
                  `Each ancestry on each PC and level again, now with the best of its ancestry feats in its slots (1st, 5th, 9th, 13th and 17th level): the feats with the best feat ratings (docs/feat-power.md) that the PC plays, a slot at a time, ranked by the feat ratings and left out where they'd need another weapon or rate at 0 or worse. Their prerequisites (a heritage, another feat) aren't checked. Where the PC plays none of its feats, the ancestry's own rating stands. Against the same human without feats as below.`,
                  "",
                  "| # | Ancestry | With feats | Ancestry alone | Feats add | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Feats it plays | Verdict |",
                  "|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|",
                  ...withFeats.map((row, index) => `| ${index + 1} | ${row.name} | ${signed(row.levels)} ± ${row.se.toFixed(2)} | ${signed(row.own)} | ${signed(row.gain)} | ${HOSTS.map((host) => (Number.isFinite(row.byHost[host]) ? signed(row.byHost[host]) : "")).join(" | ")} | ${LEVELS.map((level) => (Number.isFinite(row.byLevel[level]) ? signed(row.byLevel[level]) : "")).join(" | ")} | ${row.feats.join(", ") || "none"} | ${row.verdict} |`),
                  ""
              ]
            : []),
        "## Ancestries",
        "",
        "| # | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |",
        "|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|",
        ...ancestries.rated.map((row, index) => `| ${index + 1} | ${row.name} | ${signed(row.levels)} ± ${row.se.toFixed(2)} | ${HOSTS.map((host) => (Number.isFinite(row.byHost[host]) ? signed(row.byHost[host]) : "")).join(" | ")} | ${LEVELS.map((level) => (Number.isFinite(row.byLevel[level]) ? signed(row.byLevel[level]) : "")).join(" | ")} | ${row.verdict} |`),
        "",
        "## Heritages",
        "",
        `Rated: ${heritages.rated.length}; ${heritages.skipped.length} change nothing a fight here plays (situational bonuses, senses in the light, out-of-combat uses).`,
        "",
        "| # | Heritage | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Verdict |",
        "|---:|---|---|---:|---:|---:|---:|---:|---|",
        ...heritages.rated.map((row, index) => `| ${index + 1} | ${row.name} | ${row.ancestry ?? ""} | ${signed(row.levels)} ± ${row.se.toFixed(2)} | ${HOSTS.map((host) => (Number.isFinite(row.byHost[host]) ? signed(row.byHost[host]) : "")).join(" | ")} | ${row.verdict} |`),
        "",
        "## Backgrounds",
        "",
        `Rated: ${backgrounds.rated.length}; ${backgrounds.skipped.length} give nothing a fight here plays (skills used outside combat, Lore, skill feats the simulator doesn't play).`,
        "",
        "| # | Background | What it adds | On | Rating | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |",
        "|---:|---|---|---|---:|---:|---:|---:|---:|---|",
        ...backgrounds.rated.map((row, index) => `| ${index + 1} | ${row.name} | ${[...(row.feats ?? []), ...(row.skills ?? []).map((skill) => `trained ${skill}`)].join(", ") || "its rules"} | ${row.host ?? ""} | ${signed(row.levels)} ± ${row.se.toFixed(2)} | ${LEVELS.map((level) => (Number.isFinite(row.byLevel[level]) ? signed(row.byLevel[level]) : "")).join(" | ")} | ${row.verdict} |`),
        ""
    ];
    return { markdown: lines.join("\n"), json: { version: 1, generated: now, levels: LEVELS, hosts: HOSTS, ancestries, ancestriesWithFeats: withFeats ? { rated: withFeats } : null, heritages, backgrounds } };
}
