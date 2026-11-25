// (2026-11-25, Cole: "Make combat knowledge feel rewarding".) The knowledge house rules (src/engine/knowledge-rules.js) against real
// bestiary creatures: the standard party, and the party with a thaumaturge in its seat, each with the rules off (base), with Exposed and
// hidden weaknesses (ab), and with those and no critical success at a known lowest save (abc). Paired seeds across the three.
//   Encounters at party levels 3, 7, 11, 15: a boss (one creature of level +2) and a group (three copies of one creature of level -1),
// KNOW_CREATURES creatures of each (24), drawn the same way every run.
//
//   node tools/knowledge-power.mjs <out folder> run       → <out>/runs.jsonl
//   node tools/knowledge-power.mjs <out folder> report    → <out>/knowledge-power.md
//
//   --workers N (default: the cores less two); KNOW_FIGHTS=40 fights each; KNOW_CREATURES=24.
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

const FIGHTS = Number(process.env.KNOW_FIGHTS) || 40;
const CREATURES = Number(process.env.KNOW_CREATURES) || 24;
const LEVELS = (process.env.KNOW_LEVELS || "3,7,11,15").split(",").map(Number);
const CONFIGS = { base: "", ab: "exposed,hidden", abc: "exposed,hidden,nocrit" };
const PARTIES = ["standard", "thaumaturge"];

async function runTask(task) {
    const lib = await import("./lib/deadliness.mjs");
    const { simulate } = await import("../src/engine/fight.js");
    const { DANGER_OPTIONS, DEATH_WEIGHT, canFight } = await import("../src/engine/danger-scale.js");
    const npc = lib.npcOf(task.ref);
    if (!npc) return { ...task, error: "not found" };
    const built = lib.buildMonster(npc);
    if (!built || !canFight(built.monster)) return { ...task, skipped: true };
    const copies = task.encounter === "group" ? 3 : 1;
    const foes = Array.from({ length: copies }, (_, i) => ({ ...built.monster, id: copies > 1 ? `monster-${i}` : "monster" }));
    const party = task.party === "standard" ? lib.partyFor(task.level) : lib.classPartyFor(task.party, task.level);
    const partyHp = party.filter((c) => !c.sharesHpWith && !c.reserve).reduce((sum, c) => sum + c.hp.max, 0);
    const out = { ...task, ref: task.ref.ref, name: npc.name, creatureLevel: built.monster.level, hadWeakness: (built.monster.weaknesses ?? []).length > 0, n: 0, wins: 0, score: 0, rounds: 0, exposed: 0, recalls: 0, recallSuccesses: 0, revealed: 0, scores: [] };
    for (const [config, rules] of Object.entries(CONFIGS)) {
        const row = { n: 0, wins: 0, score: 0, rounds: 0, exposed: 0, recalls: 0, recallSuccesses: 0, revealed: 0, scores: [] };
        for (let seed = 1; seed <= FIGHTS; seed++) {
            const result = simulate({ combatants: [...party, ...foes, ...built.reserves] }, { ...DANGER_OPTIONS, knowledge: rules }, seed);
            const damage = ((result.damageBy?.foes ?? 0) + (result.damageBy?.foesInduced ?? 0)) / partyHp;
            const downs = result.party.filter((c) => c.down && !c.linked).length;
            const deaths = result.party.filter((c) => c.dead && !c.linked).length;
            const score = damage + 0.25 * downs + DEATH_WEIGHT * deaths + (result.outcome === "defeat" ? 1 : 0);
            row.n++;
            row.wins += result.outcome === "decisive" ? 1 : 0;
            row.score += score;
            row.rounds += result.rounds;
            row.scores.push(Math.round(score * 1000) / 1000);
            for (const key of ["exposed", "recalls", "recallSuccesses", "revealed"]) row[key] += result.knowledge?.stats?.[key] ?? 0;
        }
        out[config] = row;
    }
    delete out.n; delete out.wins; delete out.score; delete out.rounds; delete out.exposed; delete out.recalls; delete out.recallSuccesses; delete out.revealed; delete out.scores;
    return out;
}

if (!isMainThread) {
    workerLoop((task) => runTask(task));
} else {
    const [out, phase] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const WORKERS = Number(process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    if (!out || !phase) {
        console.error("node tools/knowledge-power.mjs <out folder> run|report [--workers=N]");
        process.exit(1);
    }
    fs.mkdirSync(out, { recursive: true });
    if (phase === "run") {
        const { creatureRefs } = await import("./lib/deadliness.mjs");
        const refs = creatureRefs().filter((ref) => ref.source === "pf2e");
        const seen = new Set();
        const distinct = refs.filter((ref) => (seen.has(ref.name) ? false : seen.add(ref.name)));
        // A fixed shuffle (by name), the first CREATURES of a level.
        const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
        const pick = (level) => distinct.filter((ref) => ref.level === level).sort((a, b) => hash(a.name) - hash(b.name)).slice(0, CREATURES);
        const tasks = [];
        for (const level of LEVELS) {
            for (const [encounter, foeLevel] of [["boss", level + 2], ["group", level - 1]]) {
                for (const ref of pick(foeLevel)) for (const party of PARTIES) tasks.push({ level, encounter, party, ref: { ref: ref.ref, path: ref.path, id: ref.id } });
            }
        }
        console.log(`${tasks.length} tasks × 3 rule sets × ${FIGHTS} fights`);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/runs.jsonl` });
    } else if (phase === "report") {
        const rows = fs.readFileSync(`${out}/runs.jsonl`, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line)).filter((row) => row.base);
        fs.writeFileSync(`${out}/knowledge-power.md`, report(rows));
        console.log(`${rows.length} rows → ${out}/knowledge-power.md`);
    }
}

// Mean of a key over rows' config, per fight; and the paired difference to base with its standard error (fight by fight).
function stats(rows, config) {
    let n = 0, wins = 0, score = 0, rounds = 0, exposed = 0, recalls = 0, succ = 0;
    const diffs = [];
    for (const row of rows) {
        const r = row[config];
        n += r.n; wins += r.wins; score += r.score; rounds += r.rounds; exposed += r.exposed; recalls += r.recalls; succ += r.recallSuccesses;
        r.scores.forEach((value, i) => diffs.push(value - row.base.scores[i]));
    }
    const mean = diffs.reduce((s, v) => s + v, 0) / Math.max(1, diffs.length);
    const sd = Math.sqrt(diffs.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
    return { n, win: wins / n, score: score / n, rounds: rounds / n, exposed: exposed / n, recalls: recalls / n, recallRate: recalls ? succ / recalls : 0, diff: mean, se: sd / Math.sqrt(Math.max(1, diffs.length)) };
}

function report(rows) {
    const pct = (v) => `${(v * 100).toFixed(1)}%`;
    const f2 = (v) => v.toFixed(2);
    const lines = ["# Knowledge house rules in the simulator", "", `Rows: ${rows.length} (creature × encounter × party), ${rows[0]?.base.n ?? 0} paired fights each per rule set.`, "",
        "Danger score: party damage taken as a share of its HP, +0.25 a PC down, +1 a death, +1 a wipe (lower is better for the party). Δ is against base on the same seeds.", ""];
    const table = (title, filter) => {
        lines.push(`## ${title}`, "", "| Party | Rules | Win rate | Rounds | Danger | Δ danger (±SE) | Exposed / fight | Recall actions / fight | Recall success |", "|---|---|---|---|---|---|---|---|---|");
        for (const party of PARTIES) {
            const subset = rows.filter((row) => row.party === party && filter(row));
            if (!subset.length) continue;
            for (const config of Object.keys(CONFIGS)) {
                const s = stats(subset, config);
                lines.push(`| ${party} | ${config} | ${pct(s.win)} | ${f2(s.rounds)} | ${f2(s.score)} | ${config === "base" ? "—" : `${s.diff >= 0 ? "+" : ""}${f2(s.diff)} ± ${f2(s.se)}`} | ${f2(s.exposed)} | ${f2(s.recalls)} | ${config === "base" ? "—" : pct(s.recallRate)} |`);
            }
        }
        lines.push("");
    };
    table("All encounters", () => true);
    for (const level of LEVELS) table(`Party level ${level}`, (row) => row.level === level);
    table("Bosses (one creature, level +2)", (row) => row.encounter === "boss");
    table("Groups (three creatures, level -1)", (row) => row.encounter === "group");
    table("Creatures that already had a weakness", (row) => row.hadWeakness);
    table("Creatures without a weakness (hidden weakness applies)", (row) => !row.hadWeakness);
    return lines.join("\n") + "\n";
}
