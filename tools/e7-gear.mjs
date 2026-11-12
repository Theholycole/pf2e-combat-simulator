// The E7 max builds (tools/e7-max.mjs) with the best non-mythic gear, and scrolls (Cole, 2026-11-12: "give them the best non-mythic gear
// for their class/build in the game … Include scrolls for multiple uses of high level spells both for bonuses and combat effects").
// Same foes, days and ladder as e7-max; the ladder and the gearless builds are read from e7-max's own rows (<e7-max out>/e7-max.jsonl).
//
//   node tools/e7-gear.mjs <out folder> run [--workers=N]            each gear build against every tier and encounter
//   node tools/e7-gear.mjs <out folder> report <e7-max out folder>    <out>/e7-gear.md: each build, its gearless counterpart, the level each plays like
//
// The gear, over partyFor(7)'s (+1 striking weapon, +1 armor, no resilient):
//   weapon: +3 major striking (to hit +2, or +3 on a strike with no potency rune; 4 damage dice) with three greater energy runes — greater
//     flaming, frost and shock: 1d6 fire, cold and electricity each, ignoring those resistances, greater frost's slowed on a critical hit
//     (the engine's RUNE_CRITS; greater flaming's persistent fire and greater shock's arcs on a critical hit aren't modelled) — on every
//     strike, backups included;
//   armor: +3 major resilient (AC +2, every save +3);
//   apex item: the key attribute +1 (fighter Strength: melee hit and damage, class DC, Athletics; rogue Dexterity: hit, damage, Reflex,
//     class DC; wizard Intelligence and cleric Wisdom: spell DC and attack);
//   casters: a platinum power ring under Magic+ Unlimited Power (the E7 rules' baseline): +2 item to spell attack rolls, not DCs.
// Scrolls (wizard and cleric, a pool a day as slots are): 3 of each rank 5–9, the three spells that rank's higher-level caster casts most
// (e7-power's addSlots pick; at 9th rank the wizard has only two, so one repeats), at the caster's own DC and attack; and the cleric's buff
// scrolls: 2 of Heroism at 9th rank and 2 of Girzanje's March at 7th.
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

process.env.FEAT_FIGHTS ??= "100";
const LADDER = Array.from({ length: 14 }, (_, i) => 7 + i);
const PCS = ["fighter", "rogue", "wizard", "cleric"];
const SCROLL_RANKS = [5, 6, 7, 8, 9];
const BUFF_SCROLLS = [["Heroism", 9, 2], ["Girzanje's March", 7, 2]];
const ENERGY_RUNES = [["greaterFlaming", "fire"], ["greaterFrost", "cold"], ["greaterShock", "electricity"]];

async function builds() {
    const { withPC, addSlots, spellBonus, strikeUp, conUp, CAP } = await import("./lib/e7-power.mjs");
    const { partyFor, spell } = await import("./lib/deadliness.mjs");
    // The e7-max builds, as e7-max.mjs makes them.
    const RESILIENCY = { wizard: 7 * 20 * 3, cleric: 7 * 20 * 3, rogue: 7 * 20 * 3, fighter: 2 * 20 * 3 };
    const hp = (c, n) => (c.hp = { value: c.hp.max + n, max: c.hp.max + n });
    const SAVE_RANKS = { fighter: { fortitude: 1, reflex: 1, will: 1 }, rogue: { fortitude: 0, reflex: 2, will: 1 }, wizard: { fortitude: 0, reflex: 0, will: 1 }, cleric: { fortitude: 0, reflex: 0, will: 1 } };
    const ARMOR_UP = { fighter: 2, rogue: 2, wizard: 2, cleric: 2 };
    const max = {
        fighter: (c) => { strikeUp(c, 1, { damage: 1, melee: true }); strikeUp(c, 1, { melee: false }); c.classDC += 1; conUp(c); c.ac += 1; c.saves.reflex += 1; c.saves.will += 1; },
        rogue: (c) => { strikeUp(c, 1, { damage: 1 }); c.saves.reflex += 1; conUp(c); strikeUp(c, 0); c.saves.will += 1; },
        wizard: (c) => { spellBonus(c, 1 + 2); conUp(c); c.ac += 1; c.saves.reflex += 1; c.saves.will += 1; addSlots(c, [5, 6, 7, 8, 9]); addSlots(c, [4], 10); },
        cleric: (c) => { spellBonus(c, 1 + 2); c.saves.will += 1; c.perception += 1; conUp(c); c.ac += 1; c.saves.reflex += 1; strikeUp(c, 2); addSlots(c, [5, 6, 7, 8, 9]); addSlots(c, [4], 10); }
    };
    const maxed = (pc, resiliency = true) => (c) => {
        max[pc](c);
        for (const [save, rank] of Object.entries(SAVE_RANKS[pc])) c.saves[save] += 2 * (2 - rank);
        c.ac += ARMOR_UP[pc];
        hp(c, c.level + (resiliency ? RESILIENCY[pc] : 0));
    };

    // The gear.
    const weapon = (c) => {
        const cleric = c.id === "cleric"; // (the cleric's mace has its potency in its bonus without a potency field)
        c.strikes = c.strikes.map((s) => {
            const had = s.potency ?? (cleric ? 1 : 0);
            const [first, ...rest] = s.damage;
            return {
                ...s, bonus: s.bonus + (3 - had), potency: 3,
                iwr: { ...(s.iwr ?? {}), traits: [...new Set([...(s.iwr?.traits ?? []), "magical"])], runes: [...(s.iwr?.runes ?? []), ...ENERGY_RUNES.map(([rune]) => rune)] },
                damage: [{ ...first, dice: 4 }, ...rest, ...ENERGY_RUNES.map(([, type]) => ({ dice: 1, die: 6, bonus: 0, type }))]
            };
        });
    };
    const apex = {
        fighter: (c) => { strikeUp(c, 1, { damage: 1, melee: true }); c.classDC += 1; if (c.skills.athletics != null) c.skills = { ...c.skills, athletics: c.skills.athletics + 1 }; },
        rogue: (c) => { strikeUp(c, 1, { damage: 1 }); c.saves.reflex += 1; c.classDC += 1; },
        wizard: (c) => spellBonus(c, 1),
        cleric: (c) => spellBonus(c, 1)
    };
    const scrolls = (c) => {
        addSlots(c, SCROLL_RANKS, 3);
        if (c.id !== "cleric") return;
        const base = c.spells.find((e) => !e.kind && e.pool);
        for (const [name, castRank, uses] of BUFF_SCROLLS) {
            const found = spell(name, castRank);
            if (!found) continue;
            const pool = `${c.id}:scroll:${name}`;
            c.spells.push({ ...found, name: found.name ?? name, castRank, dc: base.dc, attack: base.attack, pool, tradition: "divine" });
            c.spellPools[pool] = uses;
        }
    };
    const ring = (c) => (c.spells = c.spells.map((e) => (!e.kind && e.attack != null ? { ...e, attack: e.attack + 2 } : e)));
    const geared = (pc) => (c) => {
        weapon(c);
        c.ac += 2;
        for (const save of Object.keys(c.saves)) c.saves[save] += 3;
        apex[pc](c);
        if (pc === "wizard" || pc === "cleric") { scrolls(c); ring(c); }
    };
    const both = (pc, resiliency = true) => (c) => { maxed(pc, resiliency)(c); geared(pc)(c); };

    const list = {};
    for (const pc of PCS) list[`gear-max-${pc}`] = () => withPC(pc, both(pc));
    list["gear-max-party"] = () => PCS.reduce((party, pc) => withPC(pc, both(pc), party), partyFor(CAP));
    list["gear-max-party-no-resiliency"] = () => PCS.reduce((party, pc) => withPC(pc, both(pc, false), party), partyFor(CAP));
    list["gear-party-7"] = () => PCS.reduce((party, pc) => withPC(pc, geared(pc), party), partyFor(CAP));
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
    const [out, phase, maxOut] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
    const WORKERS = Number(process.argv.find((a) => a.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    fs.mkdirSync(out, { recursive: true });
    const { TIERS, KINDS } = await import("./lib/e7-power.mjs");
    if (phase === "run") {
        const ids = Object.keys(await builds());
        const tasks = ids.flatMap((id) => Object.keys(TIERS).flatMap((tier) => KINDS.map((encounter) => ({ id, tier, encounter }))));
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-gear.jsonl` });
    } else if (phase === "report") {
        if (!maxOut) throw new Error("report needs the e7-max out folder (its ladder and gearless builds)");
        const read = (path) => fs.readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
        const rows = [...read(`${out}/e7-gear.jsonl`), ...read(`${maxOut}/e7-max.jsonl`)];
        const score = (id) => { const r = rows.filter((x) => x.id === id && !x.error); return r.length ? r.reduce((s, x) => s + x.mean, 0) / r.length : null; };
        const playsLike = (s, rung) => {
            const pts = LADDER.map((L) => [L, score(rung(L))]).filter(([, v]) => v != null);
            if (s >= pts[0][1]) return `≤${pts[0][0]}`;
            for (let i = 1; i < pts.length; i++) if (s >= pts[i][1]) { const [L0, a] = pts[i - 1], [L1, b] = pts[i]; return (L0 + (a - s) / Math.max(1e-9, a - b) * (L1 - L0)).toFixed(1); }
            return `>${pts.at(-1)[0]} (best rung ${Math.min(...pts.map((p) => p[1])).toFixed(3)})`;
        };
        const row = (label, gearId, plainId, rung) => {
            const g = score(gearId), p = score(plainId);
            return `| ${label} | ${p?.toFixed(3)} | ${p == null ? "—" : playsLike(p, rung)} | ${g?.toFixed(3)} | ${g == null ? "—" : playsLike(g, rung)} |`;
        };
        const party = (L) => `party-${L}`;
        const lines = ["# E7: the most a capped character can be, with the best gear", "", `Made by \`node tools/e7-gear.mjs <out> run|report\` on ${new Date().toISOString().slice(0, 10)}. The e7-max builds with the best non-mythic gear (+3 major striking weapons with greater flaming, frost and shock; +3 major resilient armor; an apex item; casters' platinum power ring, +2 spell attack) and the casters' scrolls (3 of each rank 5–9; the cleric's 2 Heroism at 9th and 2 Girzanje's March at 7th), against the same foes and days. **Score**: damage taken over the party's Hit Points, downs, deaths and wipes (lower is stronger). **Plays like**: the level of a plain party (or of that one PC, in a 7th-level party) that scores the same; plain parties carry the GM Core treasure table's gear for their level.`, "", "| Build | Score without gear | Plays like | Score with gear | Plays like |", "|---|---:|---:|---:|---:|"];
        for (const pc of PCS) lines.push(row(`Maxed ${pc}`, `gear-max-${pc}`, `max-${pc}`, (L) => `${pc}-${L}`));
        lines.push(row("Whole party maxed", "gear-max-party", "max-party", party));
        lines.push(row("Whole party maxed, no Resiliency HP", "gear-max-party-no-resiliency", "max-party-no-resiliency", party));
        lines.push(row("Plain 7th-level party (gear only)", "gear-party-7", "party-7", party));
        lines.push("", "Ladder (plain party at each level, same foes; from e7-max):", "", "| Level | Score |", "|---:|---:|", ...LADDER.map((L) => `| ${L} | ${score(party(L))?.toFixed(3)} |`));
        fs.writeFileSync(`${out}/e7-gear.md`, lines.join("\n") + "\n");
        console.log(lines.slice(4, 12).join("\n"));
    }
}
