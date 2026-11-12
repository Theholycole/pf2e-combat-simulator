// The E7 max and gear builds (tools/e7-max.mjs, tools/e7-gear.mjs) with each PC's best class feats above 7th level (Cole, 2026-11-12, on
// why the maxed fighter "plays like" the lowest level: give the maxed builds their strong class feats and see how the comparison changes).
// Same foes, days and ladder; the ladder and the feat-less builds are read from e7-max's and e7-gear's own rows.
//
//   node tools/e7-featmax.mjs <out folder> run [--ids=<regex> --name=<file suffix>] [--workers=N]   the feat builds against every tier and encounter
//   node tools/e7-featmax.mjs <out folder> rate [--workers=N]   GWS as a single purchase: <out>/e7-gws-rate.jsonl
//   node tools/e7-featmax.mjs <out folder> report <e7-max out folder> <e7-gear out folder>   <out>/e7-featmax.md
//
// The feats: each PC's class feats of levels 8–15 (Veteran and Exceptional Hero) rated above zero in docs/e7-ratings.json's classFeats,
// the best four, played at 7th level by the feat module as the E7 feats phase plays them; none that swaps the PC's weapons for a loadout
// (Two-Weapon Flurry and Twin Riposte need two one-handed weapons in place of the fighter's greatsword). AI picks, not forced use
// (FEAT_FORCE=0), so a PC with several feats chooses among them and its other actions. Each feat's additions to the PC — its actions,
// Strike activities, reactions, stance, pools — are taken from the feat module's party with that feat alone, and added to the build's PC.
//   fighter: Haft Beatdown (in Haft Striker Stance), Certain Strike, Rock the Boat, Brutal Finish
//   rogue:   Coordinated Distraction, Nimble Strike, Opportune Backstab, Sly Striker
//   wizard:  Quickened Casting (its only class feat of 8–15 rated above zero)
//   cleric:  none (its best, Sapping Symbol −0.003 and Replenishment of War −0.005, rate at or below zero)
process.env.FEAT_FIGHTS ??= "100";
process.env.FEAT_FORCE = "0";
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

const LADDER = Array.from({ length: 14 }, (_, i) => 7 + i);
const PCS = ["fighter", "rogue", "wizard", "cleric"];
const FEATS = {
    fighter: ["Haft Beatdown", "Certain Strike", "Rock The Boat", "Brutal Finish"],
    rogue: ["Coordinated Distraction", "Nimble Strike", "Opportune Backstab", "Sly Striker"],
    wizard: ["Quickened Casting"],
    cleric: []
};
const SCROLL_RANKS = [5, 6, 7, 8, 9];
const CLASS_IWP = ["magus", "gunslinger"];
const CLASS_LADDER = [7, 8, 9, 10, 11, 12, 13];
const BUFF_SCROLLS = [["Heroism", 9, 2], ["Girzanje's March", 7, 2]];
const ENERGY_RUNES = [["greaterFlaming", "fire"], ["greaterFrost", "cold"], ["greaterShock", "electricity"]];

// Each feat's additions to its PC: the fields of the feat module's PC with the feat that differ from the plain 7th-level PC — new entries
// of a list, new keys of an object (its pools), anything else as it is. The feat on its own class's seat; a feat of several classes'
// traits (Quickened Casting: bard first) on the PC named.
const S = (x) => JSON.stringify(x);
let additions = null;
async function featAdditions() {
    if (additions) return additions;
    const lib = await import("./lib/feat-power.mjs");
    const { classFeatRefs, CAP } = await import("./lib/e7-power.mjs");
    const { partyFor } = await import("./lib/deadliness.mjs");
    const refs = classFeatRefs();
    additions = {};
    for (const pc of PCS) {
        additions[pc] = [];
        for (const name of FEATS[pc]) {
            const ref = refs.find((r) => r.name === name);
            if (!ref) throw new Error(`${name}: not among the class feats`);
            const doc = lib.docsOf(ref.path).get(ref.id);
            let built = lib.partyWithFeat(doc, CAP);
            if (built.skipped || built.host !== pc) built = lib.partyWithFeat(doc, CAP, { party: partyFor(CAP), hostId: pc });
            if (built.skipped) throw new Error(`${name}: ${built.reason}`);
            if (built.loadout) throw new Error(`${name}: needs the ${built.loadout} loadout`);
            const base = partyFor(CAP).find((c) => c.id === pc), withFeat = built.party.find((c) => c.id === pc);
            const add = {};
            for (const key of Object.keys(withFeat)) {
                if (S(base[key]) === S(withFeat[key])) continue;
                if (key === "strikes") throw new Error(`${name}: changes the Strikes`);
                const was = base[key], now = withFeat[key];
                if (Array.isArray(now)) add[key] = { list: now.filter((e) => !(was ?? []).some((b) => S(b) === S(e))) };
                else if (now && typeof now === "object" && was && typeof was === "object") add[key] = { keys: Object.fromEntries(Object.entries(now).filter(([k, v]) => S(was[k]) !== S(v))) };
                else add[key] = { value: now };
            }
            additions[pc].push({ name, played: built.played, add });
        }
    }
    return additions;
}
function withFeats(c, list) {
    for (const { add } of list) {
        for (const [key, how] of Object.entries(add)) {
            if (how.list) c[key] = [...(c[key] ?? []), ...structuredClone(how.list)];
            else if (how.keys) c[key] = { ...(c[key] ?? {}), ...structuredClone(how.keys) };
            else c[key] = structuredClone(how.value);
        }
    }
}

async function builds() {
    const { withPC, addSlots, spellBonus, strikeUp, conUp, CAP } = await import("./lib/e7-power.mjs");
    const { partyFor, spell } = await import("./lib/deadliness.mjs");
    const feats = await featAdditions();
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
    const maxed = (pc) => (c) => {
        max[pc](c);
        for (const [save, rank] of Object.entries(SAVE_RANKS[pc])) c.saves[save] += 2 * (2 - rank);
        c.ac += ARMOR_UP[pc];
        hp(c, c.level + RESILIENCY[pc]);
    };
    // The gear, as e7-gear.mjs gives it.
    const weapon = (c) => {
        const cleric = c.id === "cleric";
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
    // (The feats last: added to the PC as the build leaves it, gear's strikes included.)
    const featMax = (pc) => (c) => { maxed(pc)(c); withFeats(c, feats[pc]); };
    const featGear = (pc) => (c) => { maxed(pc)(c); geared(pc)(c); withFeats(c, feats[pc]); };

    const list = {};
    for (const pc of PCS) {
        list[`feat-max-${pc}`] = () => withPC(pc, featMax(pc));
        list[`feat-gear-max-${pc}`] = () => withPC(pc, featGear(pc));
    }
    list["feat-max-party"] = () => PCS.reduce((party, pc) => withPC(pc, featMax(pc), party), partyFor(CAP));
    list["feat-gear-max-party"] = () => PCS.reduce((party, pc) => withPC(pc, featGear(pc), party), partyFor(CAP));
    // Greater Weapon Specialization as an E7 post-cap feat (Cole, 2026-11-12: "try Greater Weapon Specialization as an E7 feat"): weapon
    // specialization's damage doubled on every Strike — the fighter's master +3 to +6, the rogue's expert +2 to +4 (the cleric and wizard,
    // trained, have none to double).
    const GWS = { fighter: 3, rogue: 2 };
    const gws = (pc) => (c) => strikeUp(c, 0, { damage: GWS[pc] });
    const then = (...steps) => (c) => steps.forEach((step) => step(c));
    for (const pc of Object.keys(GWS)) {
        list[`gws-feat-max-${pc}`] = () => withPC(pc, then(featMax(pc), gws(pc)));
        list[`gws-feat-gear-max-${pc}`] = () => withPC(pc, then(featGear(pc), gws(pc)));
    }
    list["gws-feat-gear-max-party"] = () => PCS.reduce((party, pc) => withPC(pc, GWS[pc] ? then(featGear(pc), gws(pc)) : featGear(pc), party), partyFor(CAP));
    // (The single purchase on the plain 7th-level party, rated by the "rate" phase as e7-power rates an E7 feat.)
    for (const pc of Object.keys(GWS)) list[`gws-plain-${pc}`] = () => withPC(pc, gws(pc));
    // Improved Weapon Proficiency as an E7 post-cap feat (Cole, 2026-11-12: "increase the proficiency bonus on only 1 weapon type and can
    // only be taken once. All martials should benefit from this but only fighter and gunslinger can go to Legendary with it"): one rank up
    // in the PC's main weapon only (its first Strike: the fighter's greatsword, master to legendary; the rogue's rapier, expert to master):
    // +2 to hit, and weapon specialization a step up with the rank (+3 to +4, +2 to +3). Its backups, other weapons, stay as they were.
    const IWP = { fighter: { hit: 2, damage: 1 }, rogue: { hit: 2, damage: 1 } };
    const iwp = (pc) => (c) => {
        c.strikes = c.strikes.map((s, i) => (i ? s : { ...s, bonus: s.bonus + IWP[pc].hit, damage: s.damage.map((d, j) => (j ? d : { ...d, bonus: (d.bonus ?? 0) + IWP[pc].damage })) }));
    };
    for (const pc of Object.keys(IWP)) {
        list[`iwp-feat-max-${pc}`] = () => withPC(pc, then(featMax(pc), iwp(pc)));
        list[`iwp-feat-gear-max-${pc}`] = () => withPC(pc, then(featGear(pc), iwp(pc)));
        list[`iwp-plain-${pc}`] = () => withPC(pc, iwp(pc));
    }
    // (Exploratory, not proposed as written: what it would take to bring the fighter up. "legend": legendary in every weapon it carries — the
    // 13th-level fighter's Weapon Legend — +2 to hit and specialization +3 to +4 on each; "legend-gws": that, and the 15th-level fighter's
    // greater weapon specialization, legendary's +4 doubled to +8.)
    const legend = (c) => (c.strikes = c.strikes.map((s) => ({ ...s, bonus: s.bonus + 2, damage: s.damage.map((d, j) => (j ? d : { ...d, bonus: (d.bonus ?? 0) + 1 })) })));
    const legendGws = (c) => { legend(c); strikeUp(c, 0, { damage: 4 }); };
    for (const [name, step] of [["legend", legend], ["legend-gws", legendGws]]) {
        list[`${name}-feat-max-fighter`] = () => withPC("fighter", then(featMax("fighter"), step));
        list[`${name}-feat-gear-max-fighter`] = () => withPC("fighter", then(featGear("fighter"), step));
    }
    // (Exploratory: Improved Weapon Proficiency and the fighter in all seven Resiliency archetypes, as the 8-HP classes are — the HP limit
    // waived for it: 7 × 20 × 3 HP in place of 2 × 20 × 3, +300.)
    const allResiliency = (c) => hp(c, (7 - 2) * 20 * 3);
    list["iwp-res7-feat-max-fighter"] = () => withPC("fighter", then(featMax("fighter"), iwp("fighter"), allResiliency));
    list["iwp-res7-feat-gear-max-fighter"] = () => withPC("fighter", then(featGear("fighter"), iwp("fighter"), allResiliency));
    // (Exploratory, the partial fix: the fighter counting N of the seven Resiliency archetypes — N × 20 × 3 HP in place of 2 × 20 × 3 — with
    // Improved Weapon Proficiency; and the whole party so, IWP on the fighter and the rogue.)
    for (const n of [3, 4, 5]) {
        const resN = (c) => hp(c, (n - 2) * 20 * 3);
        list[`iwp-res${n}-feat-max-fighter`] = () => withPC("fighter", then(featMax("fighter"), iwp("fighter"), resN));
        list[`iwp-res${n}-feat-gear-max-fighter`] = () => withPC("fighter", then(featGear("fighter"), iwp("fighter"), resN));
        list[`iwp-res${n}-feat-gear-max-party`] = () => PCS.reduce((party, pc) => withPC(pc, pc === "fighter" ? then(featGear(pc), iwp(pc), resN) : IWP[pc] ? then(featGear(pc), iwp(pc)) : featGear(pc), party), partyFor(CAP));
    }
    // Improved Weapon Proficiency on other weapon users (Cole, 2026-11-12: "can you test IWP for half caster that use weapons too such as
    // Magus"), seated in the 7th-level party as the class ratings seat them (classPartyFor: the fighter's seat): the magus's greatsword expert
    // to master (+2 to hit, specialization +2 to +3), the gunslinger's arquebus master to legendary (+2, +3 to +4). No maxed E7 build for
    // them: the plain 7th-level PC, and its own ladder (that class leveled up in the 7th-level party) for the level it plays like.
    const { classPartyFor } = await import("./lib/deadliness.mjs");
    for (const cls of CLASS_IWP) {
        const at7 = () => classPartyFor(cls, CAP);
        list[`iwp-plain-${cls}`] = () => withPC(cls, (c) => { c.strikes = c.strikes.map((s, i) => (i ? s : { ...s, bonus: s.bonus + 2, damage: s.damage.map((d, j) => (j ? d : { ...d, bonus: (d.bonus ?? 0) + 1 })) })); }, at7());
        for (const L of CLASS_LADDER) list[`${cls}-${L}`] = () => at7().map((c) => (c.id === cls ? classPartyFor(cls, L).find((x) => x.id === cls) : c));
    }
    list["iwp-feat-gear-max-party"] = () => PCS.reduce((party, pc) => withPC(pc, IWP[pc] ? then(featGear(pc), iwp(pc)) : featGear(pc), party), partyFor(CAP));
    return list;
}

// A single purchase rated as e7-power rates an E7 feat: against the plain 7th-level party on the same seeds, the gap in levels of the foes
// (e7ScaleTask's step), each tier's two encounters averaged; its share of the 8th-level yardstick (that PC a level up, VARIANTS'
// level-8-{pc}) the tiers' mean over the yardstick's; XP as 1,000 × share.
async function rateTask({ ids, tier, encounter }) {
    const { dayFights, casterFoes, TIERS, VARIANTS, e7ScaleTask } = await import("./lib/e7-power.mjs");
    const plain = e7ScaleTask({ tier, encounter });
    const foes = casterFoes(encounter, TIERS[tier]);
    const all = await builds();
    const out = {};
    for (const id of ids) {
        const party = all[id] ? all[id]() : VARIANTS.find((v) => v.id === id).party();
        const scores = dayFights(party, foes, 0, plain.scores.length);
        const diffs = scores.map((x, i) => x - plain.scores[i]);
        const m = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        const sd = Math.sqrt(diffs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, diffs.length - 1));
        out[id] = { levels: -m / plain.step, se: sd / Math.sqrt(diffs.length) / plain.step };
    }
    return { kind: "rate", tier, encounter, step: plain.step, out };
}

// The same for a class seated in the 7th-level party (classPartyFor): its own plain scores and scale step (foes a level up and down), and
// its own 8th-level yardstick (`${cls}-8`).
async function rateClassTask({ cls, tier, encounter }) {
    const { dayFights, casterFoes, TIERS, FIGHTS } = await import("./lib/e7-power.mjs");
    const { classPartyFor } = await import("./lib/deadliness.mjs");
    const all = await builds();
    const base = classPartyFor(cls, 7);
    const level = TIERS[tier];
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const plain = dayFights(base, casterFoes(encounter, level), 0, FIGHTS);
    const step = Math.max(0.02, (avg(dayFights(base, casterFoes(encounter, level + 1), 0, FIGHTS)) - avg(dayFights(base, casterFoes(encounter, level - 1), 0, FIGHTS))) / 2);
    const out = {};
    for (const id of [`iwp-plain-${cls}`, `${cls}-8`]) {
        const scores = dayFights(all[id](), casterFoes(encounter, level), 0, FIGHTS);
        const diffs = scores.map((x, i) => x - plain[i]);
        const m = avg(diffs);
        const sd = Math.sqrt(diffs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, diffs.length - 1));
        out[id] = { levels: -m / step, se: sd / Math.sqrt(diffs.length) / step };
    }
    return { kind: "rate-class", cls, tier, encounter, step, out };
}

async function runTask(task) {
    if (task.kind === "rate") return rateTask(task);
    if (task.kind === "rate-class") return rateClassTask(task);
    const { id, tier, encounter } = task;
    const { dayFights, casterFoes, TIERS, FIGHTS } = await import("./lib/e7-power.mjs");
    const party = (await builds())[id]();
    const scores = dayFights(party, casterFoes(encounter, TIERS[tier]), 0, FIGHTS);
    return { id, tier, encounter, mean: scores.reduce((s, x) => s + x, 0) / scores.length, fights: scores.length };
}

if (!isMainThread) workerLoop(runTask);
else {
    const [out, phase, maxOut, gearOut] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
    const WORKERS = Number(process.argv.find((a) => a.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    fs.mkdirSync(out, { recursive: true });
    const { TIERS, KINDS } = await import("./lib/e7-power.mjs");
    if (phase === "run") {
        const only = process.argv.find((a) => a.startsWith("--ids="))?.slice(6);
        const ids = Object.keys(await builds()).filter((id) => !/-plain-(fighter|rogue)$/.test(id) && (!only || new RegExp(only).test(id)));
        const tasks = ids.flatMap((id) => Object.keys(TIERS).flatMap((tier) => KINDS.map((encounter) => ({ id, tier, encounter }))));
        // (A run of some builds only, --ids=<regex>, to a file of its own beside the others: e7-featmax-<name>.jsonl, --name= or "ids".)
        const name = process.argv.find((a) => a.startsWith("--name="))?.slice(7) ?? (only ? "ids" : null);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-featmax${name ? `-${name}` : ""}.jsonl` });
    } else if (phase === "rate") {
        // (--feat=gws|iwp: that feat's single purchase on the fighter and the rogue, beside each one's 8th-level yardstick.)
        const feat = process.argv.find((a) => a.startsWith("--feat="))?.slice(7) ?? "gws";
        const ids = [`${feat}-plain-fighter`, "level-8-fighter", `${feat}-plain-rogue`, "level-8-rogue"];
        const tasks = Object.keys(TIERS).flatMap((tier) => KINDS.map((encounter) => ({ kind: "rate", ids, tier, encounter })));
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-${feat}-rate.jsonl` });
    } else if (phase === "rate-class") {
        const tasks = CLASS_IWP.flatMap((cls) => Object.keys(TIERS).flatMap((tier) => KINDS.map((encounter) => ({ kind: "rate-class", cls, tier, encounter }))));
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-iwp-class-rate.jsonl` });
    } else if (phase === "report") {
        if (!maxOut || !gearOut) throw new Error("report needs the e7-max and e7-gear out folders");
        const read = (path) => fs.readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
        const own = fs.readdirSync(out).filter((f) => /^e7-featmax.*\.jsonl$/.test(f)).flatMap((f) => read(`${out}/${f}`));
        const rows = [...own, ...read(`${maxOut}/e7-max.jsonl`), ...read(`${gearOut}/e7-gear.jsonl`)];
        const score = (id) => { const r = rows.filter((x) => x.id === id && !x.error); return r.length ? r.reduce((s, x) => s + x.mean, 0) / r.length : null; };
        const playsLike = (s, rung) => {
            const pts = LADDER.map((L) => [L, score(rung(L))]).filter(([, v]) => v != null);
            if (s >= pts[0][1]) return `≤${pts[0][0]}`;
            for (let i = 1; i < pts.length; i++) if (s >= pts[i][1]) { const [L0, a] = pts[i - 1], [L1, b] = pts[i]; return (L0 + (a - s) / Math.max(1e-9, a - b) * (L1 - L0)).toFixed(1); }
            return `>${pts.at(-1)[0]} (best rung ${Math.min(...pts.map((p) => p[1])).toFixed(3)})`;
        };
        const cell = (id, rung) => { const s = score(id); return `${s?.toFixed(3) ?? "—"} | ${s == null ? "—" : playsLike(s, rung)}`; };
        const feats = await featAdditions();
        const lines = ["# E7: the maxed builds with their best class feats above 7th level", "", `Made by \`node tools/e7-featmax.mjs <out> run|report\` on ${new Date().toISOString().slice(0, 10)}. The e7-max and e7-gear builds with each PC's best-rated class feats of levels 8–15 (docs/e7-ratings.json), played by the AI's own picks (FEAT_FORCE=0), against the same foes and days. **Score**: damage taken over the party's Hit Points, downs, deaths and wipes (lower is stronger). **Plays like**: the level of that PC (in a 7th-level party) or of a plain party that scores the same.`, "", "| Build | Max | Plays like | Max + feats | Plays like | Gear max | Plays like | Gear max + feats | Plays like |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|"];
        for (const pc of PCS) { const rung = (L) => `${pc}-${L}`; lines.push(`| ${pc} | ${cell(`max-${pc}`, rung)} | ${cell(`feat-max-${pc}`, rung)} | ${cell(`gear-max-${pc}`, rung)} | ${cell(`feat-gear-max-${pc}`, rung)} |`); }
        const party = (L) => `party-${L}`;
        lines.push(`| Whole party | ${cell("max-party", party)} | ${cell("feat-max-party", party)} | ${cell("gear-max-party", party)} | ${cell("feat-gear-max-party", party)} |`);
        const featSection = (feat, title) => {
            if (!rows.some((x) => String(x.id).startsWith(`${feat}-`))) return;
            lines.push("", title, "", `| Build | Without | Plays like | With ${feat.toUpperCase()} | Plays like |`, "|---|---:|---:|---:|---:|");
            for (const pc of ["fighter", "rogue"]) {
                const rung = (L) => `${pc}-${L}`;
                lines.push(`| ${pc}: max + feats | ${cell(`feat-max-${pc}`, rung)} | ${cell(`${feat}-feat-max-${pc}`, rung)} |`);
                lines.push(`| ${pc}: max + gear + feats | ${cell(`feat-gear-max-${pc}`, rung)} | ${cell(`${feat}-feat-gear-max-${pc}`, rung)} |`);
            }
            lines.push(`| Whole party: max + gear + feats | ${cell("feat-gear-max-party", party)} | ${cell(`${feat}-feat-gear-max-party`, party)} |`);
            if (!fs.existsSync(`${out}/e7-${feat}-rate.jsonl`)) return;
            const rate = read(`${out}/e7-${feat}-rate.jsonl`).filter((x) => !x.error);
            const lv = (id, tier) => { const r = rate.filter((x) => x.tier === tier && x.out?.[id]); return r.reduce((a, x) => a + x.out[id].levels, 0) / r.length; };
            const se = (id, tier) => { const r = rate.filter((x) => x.tier === tier && x.out?.[id]); return Math.sqrt(r.reduce((a, x) => a + x.out[id].se ** 2, 0)) / r.length; };
            lines.push("", "As a single purchase on the plain 7th-level party (levels of foe, as e7-power rates an E7 feat; share of the 8th-level yardstick, XP = 1,000 × share):", "", "| PC | At the cap | Above it | Mean | Yardstick (a level) | Share | XP |", "|---|---:|---:|---:|---:|---:|---:|");
            for (const pc of ["fighter", "rogue"]) {
                const g = (tier) => lv(`${feat}-plain-${pc}`, tier), y = (tier) => lv(`level-8-${pc}`, tier);
                const mean = (g("cap") + g("above")) / 2, yard = (y("cap") + y("above")) / 2;
                lines.push(`| ${pc} | ${g("cap").toFixed(3)} ± ${se(`${feat}-plain-${pc}`, "cap").toFixed(3)} | ${g("above").toFixed(3)} ± ${se(`${feat}-plain-${pc}`, "above").toFixed(3)} | ${mean.toFixed(3)} | ${yard.toFixed(3)} | ${(mean / yard).toFixed(2)} | ${Math.round(mean / yard * 100) * 10} |`);
            }
        };
        featSection("gws", "Greater Weapon Specialization as an E7 feat (weapon specialization doubled: fighter master +3 to +6, rogue expert +2 to +4):");
        if (rows.some((x) => String(x.id).startsWith("legend"))) {
            const fr = (L) => `fighter-${L}`;
            lines.push("", "Exploratory: what it would take for the fighter (legendary in every weapon; and that with the 15th-level greater weapon specialization):", "", "| Build | Plain | Plays like | All weapons legendary | Plays like | Legendary + GWS | Plays like |", "|---|---:|---:|---:|---:|---:|---:|");
            lines.push(`| fighter: max + feats | ${cell("feat-max-fighter", fr)} | ${cell("legend-feat-max-fighter", fr)} | ${cell("legend-gws-feat-max-fighter", fr)} |`);
            lines.push(`| fighter: max + gear + feats | ${cell("feat-gear-max-fighter", fr)} | ${cell("legend-feat-gear-max-fighter", fr)} | ${cell("legend-gws-feat-gear-max-fighter", fr)} |`);
            if (rows.some((x) => String(x.id).startsWith("iwp-res7"))) {
                lines.push("", "Exploratory: Improved Weapon Proficiency, and the fighter allowed all seven Resiliency archetypes (+300 HP, as the 8-HP classes get):", "", "| Build | With IWP | Plays like | IWP + all Resiliency | Plays like |", "|---|---:|---:|---:|---:|");
                lines.push(`| fighter: max + feats | ${cell("iwp-feat-max-fighter", fr)} | ${cell("iwp-res7-feat-max-fighter", fr)} |`);
                lines.push(`| fighter: max + gear + feats | ${cell("iwp-feat-gear-max-fighter", fr)} | ${cell("iwp-res7-feat-gear-max-fighter", fr)} |`);
            }
            const counts = [3, 4, 5].filter((n) => rows.some((x) => x.id === `iwp-res${n}-feat-gear-max-fighter`));
            if (counts.length) {
                lines.push("", "Exploratory, the partial fix: Improved Weapon Proficiency, and the fighter counting N of the seven Resiliency archetypes (N × 60 HP; 2 as now, 7 as the 8-HP classes):", "", "| Archetypes | Resiliency HP | Max + feats | Plays like | Max + gear + feats | Plays like | Whole party (gear + feats, IWP) | Plays like |", "|---:|---:|---:|---:|---:|---:|---:|---:|");
                lines.push(`| 2 | 120 | ${cell("iwp-feat-max-fighter", fr)} | ${cell("iwp-feat-gear-max-fighter", fr)} | ${cell("iwp-feat-gear-max-party", party)} |`);
                for (const n of counts) lines.push(`| ${n} | ${n * 60} | ${cell(`iwp-res${n}-feat-max-fighter`, fr)} | ${cell(`iwp-res${n}-feat-gear-max-fighter`, fr)} | ${cell(`iwp-res${n}-feat-gear-max-party`, party)} |`);
                lines.push(`| 7 | 420 | ${cell("iwp-res7-feat-max-fighter", fr)} | ${cell("iwp-res7-feat-gear-max-fighter", fr)} | — | — |`);
            }
        }
        featSection("iwp", "Improved Weapon Proficiency as an E7 feat (one weapon, one rank, once: fighter's greatsword master to legendary, rogue's rapier expert to master; +2 to hit, specialization a step up):");
        if (fs.existsSync(`${out}/e7-iwp-class-rate.jsonl`)) {
            const rate = read(`${out}/e7-iwp-class-rate.jsonl`).filter((x) => !x.error);
            const lv = (cls, id, tier) => { const r = rate.filter((x) => x.cls === cls && x.tier === tier && x.out?.[id]); return r.reduce((a, x) => a + x.out[id].levels, 0) / r.length; };
            lines.push("", "Improved Weapon Proficiency on other weapon users, the plain 7th-level PC seated in the fighter's place (magus: greatsword expert to master; gunslinger: arquebus master to legendary):", "", "| Class | Without | Plays like | With IWP | Plays like | Levels of foe (cap / above) | Yardstick (a level) | Share | XP |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|");
            for (const cls of CLASS_IWP) {
                const rung = (L) => `${cls}-${L}`;
                const g = (tier) => lv(cls, `iwp-plain-${cls}`, tier), y = (tier) => lv(cls, `${cls}-8`, tier);
                const mean = (g("cap") + g("above")) / 2, yard = (y("cap") + y("above")) / 2;
                const pts = CLASS_LADDER.map((L) => [L, score(rung(L))]).filter(([, v]) => v != null);
                const pl = (s) => { if (s == null) return "—"; if (s >= pts[0][1]) return `≤${pts[0][0]}`; for (let i = 1; i < pts.length; i++) if (s >= pts[i][1]) { const [L0, a] = pts[i - 1], [L1, b] = pts[i]; return (L0 + (a - s) / Math.max(1e-9, a - b) * (L1 - L0)).toFixed(1); } return `>${pts.at(-1)[0]}`; };
                lines.push(`| ${cls} | ${score(`${cls}-7`)?.toFixed(3)} | ${pl(score(`${cls}-7`))} | ${score(`iwp-plain-${cls}`)?.toFixed(3)} | ${pl(score(`iwp-plain-${cls}`))} | ${g("cap").toFixed(3)} / ${g("above").toFixed(3)} | ${yard.toFixed(3)} | ${(mean / yard).toFixed(2)} | ${Math.round(mean / yard * 100) * 10} |`);
            }
        }
        lines.push("", "The feats (rating: levels of foe, docs/e7-ratings.json's classFeats; what the fights play):", "");
        const ratings = JSON.parse(fs.readFileSync(new URL("../docs/e7-ratings.json", import.meta.url), "utf8")).classFeats;
        for (const pc of PCS) {
            if (!feats[pc].length) { lines.push(`- ${pc}: none rated above zero`); continue; }
            for (const f of feats[pc]) { const r = ratings.find((x) => x.name === f.name && x.seat === pc); lines.push(`- ${pc}: ${f.name} (level ${r?.level}, ${r?.levels >= 0 ? "+" : ""}${r?.levels?.toFixed(3)}): ${f.played}`); }
        }
        fs.writeFileSync(`${out}/e7-featmax.md`, lines.join("\n") + "\n");
        console.log(lines.slice(4).join("\n"));
    }
}
