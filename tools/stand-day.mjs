// Stand Abilities over an adventuring day (2026-11-26, Cole: "resim any ability that has less than 3 uses per day but sim them across
// four fights with recovery time in between in one day to see how well they do").
//
//   node tools/stand-day.mjs <out folder> --only=<slug,slug> --levels=1,5,9,13,17,20 [--workers=8] [--per-fight]
//
// The classes method (tools/lib/feat-power.mjs partyRating: the class's PC in the fighter seat of the standard party, the same foes, the
// same 200 seeds a kind, scored against <out>/scale.jsonl in levels of the foes), with the fights played as 50 days of 4 (seeds 4d … 4d+3).
// Between a day's fights, a 10-minute rest: every creature fresh (full Hit Points, no conditions — each fight builds its combatants anew);
// the stand user's Stand Points ("stand-user:focus") carried, +1 for Refocus, at most 3 (the day starts at its 2); Time Stop's charges and
// every other per-fight pool back; the daily pieces carried, not refreshed: the daily pools (DAILY below), Time Skip's 17th-level reroll
// (saveCurse), Shared Fate's halvings (resistUses), and Spin's nails (10 a day; the sim's nail shot is otherwise at will) — its 1st-level
// regrowth surge played between fights (1 Stand Point for 5 nails when 2 or fewer are left; the engine has no refill action in a fight).
// The other PCs are fresh each fight: only the stand user's day is measured. --per-fight: no carry (each fight as the classes phase plays it,
// a check that the harness matches it). Writes <out>/day.jsonl: { slug, level, levels, se, boss, group, perFight }.
import fs from "node:fs";
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const DAY = 4;
const SP = "stand-user:focus";
const SP_START = 2, SP_MAX = 3;
const DAILY = ["loop-daily", "accelerate-daily", "stand-weather:heavy", "stand-spin:infinite", "spin-nails"];
const NAILS = 10;
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const [out] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const perFight = process.argv.includes("--per-fight");

async function runTask(slug, level) {
    const lib = await import("./lib/feat-power.mjs");
    const { classPartyFor } = await import("./lib/deadliness.mjs");
    const { simulate } = await import("../src/engine/fight.js");
    const { powerFoes } = await import("../src/engine/spell-power.js");
    const { DANGER_OPTIONS, DEATH_WEIGHT } = await import("../src/engine/danger-scale.js");
    lib.loadScaleOnce(`${out}/scale.jsonl`);
    const base = classPartyFor(slug, level);
    const userId = slug;
    // (Spin's nails: the nail shot draws on a pool of 10 a day.)
    const nails = (c) => (c.spells ?? []).some((s) => s.name === "Spin (nail shot)");
    const prepared = base.map((c) => (!perFight && nails(c) ? { ...c, spells: c.spells.map((s) => (s.name === "Spin (nail shot)" ? { ...s, pool: "spin-nails" } : s)), spellPools: { ...(c.spellPools ?? {}), "spin-nails": NAILS } } : c));
    const owners = new Set(prepared.filter((c) => c.id === userId || c.id === "stand").map((c) => c.id));
    const results = {};
    for (const kind of lib.KINDS) {
        const scaled = lib.scaleAt(level, kind);
        if (!scaled) throw new Error(`no scale for ${level} ${kind}`);
        const foes = powerFoes(kind, level, process.env.FEAT_FOE_TRAIT || null);
        const partyHp = prepared.filter((c) => !c.sharesHpWith && !c.reserve).reduce((sum, c) => sum + c.hp.max, 0);
        const scores = [];
        let carry = null;
        for (let seed = 0; seed < lib.FIGHTS; seed++) {
            if (seed % DAY === 0) carry = null;
            const today = carry ? prepared.map((c) => (carry.has(c.id) ? { ...c, ...carry.get(c.id) } : c)) : prepared;
            const result = simulate({ combatants: [...today, ...foes] }, lib.GRID ? { ...DANGER_OPTIONS, grid: lib.GRID } : DANGER_OPTIONS, seed);
            const damage = ((result.damageBy?.foes ?? 0) + (result.damageBy?.foesInduced ?? 0)) / partyHp;
            const downs = result.party.filter((c) => c.down && !c.linked).length;
            const deaths = result.party.filter((c) => c.dead && !c.linked).length;
            scores.push(Math.round((damage + 0.25 * downs + DEATH_WEIGHT * deaths + (result.outcome === "defeat" ? 1 : 0)) * 1000) / 1000);
            if (perFight) continue;
            // (The rest: what carries to the day's next fight.)
            carry = new Map();
            for (const id of owners) {
                const start = today.find((c) => c.id === id);
                const after = result.party.find((c) => c.id === id);
                if (!start || !after) continue;
                const pools = { ...(start.spellPools ?? {}) };
                const left = after.spellPools ?? {};
                for (const name of DAILY) if (name in pools) pools[name] = left[name] ?? pools[name];
                if (SP in pools) pools[SP] = Math.min(SP_MAX, (left[SP] ?? pools[SP]) + 1);
                if ("spin-nails" in pools && pools["spin-nails"] <= 2 && (pools[SP] ?? 0) >= 1) {
                    pools["spin-nails"] += 5;
                    pools[SP] -= 1;
                }
                const next = { spellPools: pools };
                if (Number.isFinite(after.resistUsesLeft)) next.resistUses = after.resistUsesLeft;
                if (start.saveCurse && after.saveCurseUsed) next.saveCurse = null;
                carry.set(id, next);
            }
            // (Stand Points on the other of the pair: the pool lives on whichever carries it.)
        }
        const diffs = scores.map((score, index) => score - scaled.scores[index]);
        const mean = diffs.reduce((sum, v) => sum + v, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((sum, v) => sum + (v - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
        results[kind] = { levels: -mean / scaled.step, se: sd / Math.sqrt(diffs.length) / scaled.step };
    }
    const kinds = lib.KINDS;
    const levels = kinds.reduce((sum, k) => sum + results[k].levels, 0) / kinds.length;
    const se = Math.sqrt(kinds.reduce((sum, k) => sum + results[k].se ** 2, 0)) / kinds.length;
    return { slug, level, levels, se, boss: results.boss?.levels, group: results.group?.levels, perFight };
}

if (arg("task")) {
    const [slug, level] = arg("task").split("@");
    console.log(JSON.stringify(await runTask(slug, Number(level))));
} else {
    const slugs = arg("only").split(",");
    const levels = (arg("levels") ?? "1,5,9,13,17,20").split(",").map(Number);
    const workers = Number(arg("workers")) || Math.max(1, os.cpus().length - 2);
    const file = `${out}/${perFight ? "per-fight" : "day"}.jsonl`;
    const done = new Set(fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => { const r = JSON.parse(l); return `${r.slug}@${r.level}`; }) : []);
    const tasks = slugs.flatMap((s) => levels.map((l) => `${s}@${l}`)).filter((t) => !done.has(t));
    console.log(`${tasks.length} tasks (${done.size} done) → ${file}`);
    const self = fileURLToPath(import.meta.url);
    let next = 0, finished = 0, failed = 0;
    const t0 = Date.now();
    await new Promise((resolve) => {
        const launch = () => {
            if (next >= tasks.length) { if (finished === tasks.length) resolve(); return; }
            const task = tasks[next++];
            const child = spawn(process.execPath, [self, out, `--task=${task}`, ...(perFight ? ["--per-fight"] : [])], { stdio: ["ignore", "pipe", "pipe"] });
            let text = "", err = "";
            child.stdout.on("data", (d) => (text += d));
            child.stderr.on("data", (d) => (err += d));
            child.on("close", (code) => {
                finished++;
                const line = text.trim().split("\n").pop();
                if (code === 0 && line?.startsWith("{")) fs.appendFileSync(file, `${line}\n`);
                else { failed++; console.log(`FAILED ${task} (exit ${code}): ${err.trim().split("\n").slice(-3).join(" | ")}`); }
                console.log(`${file.split("/").pop()}: ${finished}/${tasks.length} in ${Math.round((Date.now() - t0) / 1000)} s`);
                if (finished === tasks.length) resolve(); else launch();
            });
        };
        for (let i = 0; i < Math.min(workers, tasks.length); i++) launch();
    });
    console.log(`done, ${failed} failed`);
}
