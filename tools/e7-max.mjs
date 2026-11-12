// How strong can a capped E7 character get? (Cole, 2026-11-12: "What is the highest possible player power level when their actual level
// is capped at 7 with these rules".) Each PC of the 7th-level party with every E7 purchase that raises a number, and the four together, in
// the same days against the same foes as tools/e7-power.mjs; then the level of a plain party (or of that one PC) that does as well.
//
//   node tools/e7-max.mjs <out folder> run      every build and every rung of the ladder (levels 7–20) against every tier and encounter
//   node tools/e7-max.mjs <out folder> report   <out>/e7-max.md: each build's score and the level it plays like
//   --workers N; FEAT_FIGHTS (default 100) fights an encounter; E7_DAY (4) fights a day.
//
// The builds (what a level-7 character can buy, however much XP):
//   attribute: +1 to each attribute once (Ability Advancement); saves: master in all three (Something of an Expert, then the archetype
//   master-save feats; a save already at master stays); armor: expert (Something of an Expert / Armored Exercise); weapons: expert
//   (Diverse Weapon Expert; the fighter is master already); spellcasting: master proficiency and a slot each of 5th–9th rank, and
//   ten more 4th-rank slots (Expanded Caster Stamina is unlimited); Hit Points: Toughness, and the Resiliency feats of the seven
//   archetypes that have one (+3 HP for each of that archetype's feats, about 20 feats each with Advanced X retaken) where the class
//   qualifies (8 HP a level or less for five of them, 10 or less for two).
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

process.env.FEAT_FIGHTS ??= "100";
const LADDER = Array.from({ length: 14 }, (_, i) => 7 + i);
const PCS = ["fighter", "rogue", "wizard", "cleric"];

async function builds() {
    const { withPC, addSlots, spellBonus, strikeUp, conUp, CAP } = await import("./lib/e7-power.mjs");
    const { partyFor } = await import("./lib/deadliness.mjs");
    const RESILIENCY = { wizard: 7 * 20 * 3, cleric: 7 * 20 * 3, rogue: 7 * 20 * 3, fighter: 2 * 20 * 3 };
    const hp = (c, n) => (c.hp = { value: c.hp.max + n, max: c.hp.max + n });
    // Each save up to master: +2 a rank from where the 7th-level class has it (trained 0, expert 1, master 2).
    const SAVE_RANKS = { fighter: { fortitude: 1, reflex: 1, will: 1 }, rogue: { fortitude: 0, reflex: 2, will: 1 }, wizard: { fortitude: 0, reflex: 0, will: 1 }, cleric: { fortitude: 0, reflex: 0, will: 1 } };
    const ARMOR_UP = { fighter: 2, rogue: 2, wizard: 2, cleric: 2 };
    const max = {
        fighter: (c) => { strikeUp(c, 1, { damage: 1, melee: true }); strikeUp(c, 1, { melee: false }); c.classDC += 1; conUp(c); c.ac += 1; c.saves.reflex += 1; c.saves.will += 1; },
        rogue: (c) => { strikeUp(c, 1, { damage: 1 }); c.saves.reflex += 1; conUp(c); strikeUp(c, 0); c.saves.will += 1; },
        wizard: (c) => { spellBonus(c, 1 + 2); conUp(c); c.ac += 1; c.saves.reflex += 1; c.saves.will += 1; addSlots(c, [5, 6, 7, 8, 9]); addSlots(c, [4], 10); },
        cleric: (c) => { spellBonus(c, 1 + 2); c.saves.will += 1; c.perception += 1; conUp(c); c.ac += 1; c.saves.reflex += 1; strikeUp(c, 2); addSlots(c, [5, 6, 7, 8, 9]); addSlots(c, [4], 10); }
    };
    const maxed = (pc) => (c) => {
        max[pc](c);
        for (const [save, rank] of Object.entries(SAVE_RANKS[pc])) c.saves[save] += 2 * (2 - rank);
        c.ac += ARMOR_UP[pc];
        hp(c, c.level + RESILIENCY[pc]); // Toughness, and the Resiliency stack
    };
    const list = {};
    for (const pc of PCS) list[`max-${pc}`] = () => withPC(pc, maxed(pc));
    list["max-party"] = () => PCS.reduce((party, pc) => withPC(pc, maxed(pc), party), partyFor(CAP));
    list["max-party-no-resiliency"] = () => PCS.reduce((party, pc) => withPC(pc, (c) => { maxed(pc)(c); hp(c, -RESILIENCY[pc]); }, party), partyFor(CAP));
    for (const L of LADDER) {
        list[`party-${L}`] = () => partyFor(L);
        for (const pc of PCS) list[`${pc}-${L}`] = () => partyFor(CAP).map((c) => (c.id === pc ? partyFor(L).find((x) => x.id === pc) : c));
    }
    return list;
}

async function runTask({ id, tier, encounter }) {
    const { dayFights, casterFoes, TIERS, FIGHTS } = await import("./lib/e7-power.mjs");
    const party = (await builds())[id]();
    const scores = dayFights(party, casterFoes(encounter, TIERS[tier]), 0, FIGHTS);
    return { id, tier, encounter, mean: scores.reduce((s, x) => s + x, 0) / scores.length, fights: scores.length };
}

if (!isMainThread) workerLoop(runTask);
else {
    const [out, phase] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
    const WORKERS = Number(process.argv.find((a) => a.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    fs.mkdirSync(out, { recursive: true });
    const { TIERS, KINDS } = await import("./lib/e7-power.mjs");
    if (phase === "run") {
        const ids = Object.keys(await builds());
        const tasks = ids.flatMap((id) => Object.keys(TIERS).flatMap((tier) => KINDS.map((encounter) => ({ id, tier, encounter }))));
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-max.jsonl` });
    } else if (phase === "report") {
        const rows = fs.readFileSync(`${out}/e7-max.jsonl`, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
        const score = (id) => { const r = rows.filter((x) => x.id === id && !x.error); return r.length ? r.reduce((s, x) => s + x.mean, 0) / r.length : null; };
        // The level it plays like: where the ladder's score (lower is stronger) crosses the build's, interpolated.
        const playsLike = (s, rung) => {
            const pts = LADDER.map((L) => [L, score(rung(L))]).filter(([, v]) => v != null);
            if (s >= pts[0][1]) return `≤${pts[0][0]}`;
            for (let i = 1; i < pts.length; i++) if (s >= pts[i][1]) { const [L0, a] = pts[i - 1], [L1, b] = pts[i]; return (L0 + (a - s) / Math.max(1e-9, a - b) * (L1 - L0)).toFixed(1); }
            return `>${pts.at(-1)[0]} (best rung ${Math.min(...pts.map((p) => p[1])).toFixed(2)})`;
        };
        const lines = ["# E7: the most a capped character can be", "", `Made by \`node tools/e7-max.mjs <out> run|report\` on ${new Date().toISOString().slice(0, 10)}. Each build is the 7th-level party with every E7 purchase that raises a number (see the tool's header), against the E7 ratings' foes (casters: a 9th- or 11th-level boss, four 5th- or 7th-level foes) in days of fights. **Score**: damage taken over the party's Hit Points, downs, deaths and wipes (lower is stronger). **Plays like**: the level of a plain party (or of that one PC, in a 7th-level party) that scores the same.`, "", "| Build | Score | Plain 7th-level score | Plays like level |", "|---|---:|---:|---:|"];
        for (const pc of PCS) { const s = score(`max-${pc}`); lines.push(`| Maxed ${pc} | ${s?.toFixed(3)} | ${score(`${pc}-7`)?.toFixed(3)} | ${s == null ? "—" : playsLike(s, (L) => `${pc}-${L}`)} |`); }
        for (const id of ["max-party", "max-party-no-resiliency"]) { const s = score(id); lines.push(`| ${id === "max-party" ? "Whole party maxed" : "Whole party maxed, no Resiliency HP"} | ${s?.toFixed(3)} | ${score("party-7")?.toFixed(3)} | ${s == null ? "—" : playsLike(s, (L) => `party-${L}`)} |`); }
        lines.push("", "Ladder (plain party at each level, same foes):", "", "| Level | Score |", "|---:|---:|", ...LADDER.map((L) => `| ${L} | ${score(`party-${L}`)?.toFixed(3)} |`));
        fs.writeFileSync(`${out}/e7-max.md`, lines.join("\n") + "\n");
        console.log(lines.slice(4, 12).join("\n"));
    }
}
