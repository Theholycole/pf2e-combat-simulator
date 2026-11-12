// Every class the simulator plays, at the E7 cap with everything (Cole, 2026-11-12: "test every class in the game please"): each class's PC
// seated in the 7th-level party as the class ratings seat it (classPartyFor), maxed under the current E7 rules, then with the best
// non-mythic gear; the level of that class (leveled up in the same seat) each plays like. Same foes, days, tiers and FEAT_FIGHTS as e7-max.
//
//   node tools/e7-allclasses.mjs <out> pick                  each class's class feats (picks.json): read by run and report
//   node tools/e7-allclasses.mjs <out> run [--workers=N] [--ids=<regex>]   the ladders (7–20) and the two builds per class
//   node tools/e7-allclasses.mjs <out> report                <out>/e7-allclasses.md
//
// The generic maxed build (the e7-max builds generalised; e7-max's own hand builds for the fighter, rogue, wizard and cleric differ in
// small ways, and are run here in the generic form too):
//   attributes: Ability Advancement on every attribute once — Strikes +1 to hit (+1 damage on the key attribute's), Fortitude, Reflex and
//     Will +1, Perception +1, Hit Points +level (Constitution), AC +1 where the armor's Dexterity cap allows; a caster's spell DC and attack
//     +1, a martial's class-DC abilities +1;
//   saves: each to master (Something of an Expert, the master-save feats): +2 a step below master;
//   armor: one step (+2 AC), as e7-max;
//   Improved Weapon Proficiency on the main weapon (weapon users: WEAPON_RANK below): +2 to hit, specialization a step up where the class
//     has weapon specialization at 7th (not the kineticist's, from 13th); master to legendary for the fighter and gunslinger;
//   casters with slots: Master Spellcasting Proficiency (+2; +4 for the magus and summoner, trained at 7th), a slot of each rank 5–9 and ten
//     4th-rank slots, each the first spell that rank's caster of its class prepares (a level able to cast it: 2 × rank + 1);
//   Hit Points: Toughness (+level) and the Resiliency feats its Hit Points a level allow (Champion, Exemplar, Fighter, Monk and Ranger
//     Resiliency: 8 HP a level or less; Barbarian and Guardian Resiliency: 10 or less), 60 HP each (20 feats of that archetype × 3);
//   class feats: picks.json — the four best class feats of levels 8–15 rated above zero (docs/e7-ratings.json's classFeats for the four
//     standard classes, src/data/feat-ratings.json for the others) that the feat module plays at 7th level on that class without a
//     loadout swap, added as e7-featmax adds them, AI picks (FEAT_FORCE=0).
// The gear (e7-gear's): weapons +3 major striking with greater flaming, frost and shock (an alchemist's bombs: major bombs' +3 item and four
//   dice; not impulses: the kineticist's gate attenuator to +2 item on its impulse attacks instead); armor +3 major resilient (AC +2,
//   saves +3); an apex item (the key attribute's +1 again); casters with slots: 3 scrolls of each rank 5–9 (that rank's first three
//   spells) and a platinum power ring (+2 spell attack); divine and occult casters 2 scrolls each of Heroism at 9th and Girzanje's March
//   at 7th.
// The summoner: its eidolon (a body of its own sharing its Hit Points) takes the weapon changes and the defenses as the summoner does.
// Approximations: slot picks are each rank's first prepared spells (no most-cast probe); the cleric gets no weapon training here; greater
// flaming's persistent fire and greater shock's arcs aren't modelled; non-standard classes' feat ratings come from src/data/feat-ratings.json
// (rated at their own level, forced use); flat ladders (gunslinger, thaumaturge, alchemist) inflate "plays like".
process.env.FEAT_FIGHTS ??= "100";
process.env.FEAT_FORCE = "0";
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { defaultWorkers, runPool, workerLoop } from "./lib/pool.mjs";

const LADDER = Array.from({ length: 14 }, (_, i) => 7 + i);
const STANDARD = ["fighter", "rogue", "wizard", "cleric"];
const T = 2, E = 4, M = 6, L = 8;
// The main weapon's proficiency at 7th (src/engine/classes.js and party.js), and whether weapon specialization applies at 7th.
const WEAPON_RANK = {
    fighter: M, gunslinger: M, rogue: E, alchemist: E, barbarian: E, champion: E, commander: E, exemplar: E, guardian: E, inventor: E,
    investigator: E, kineticist: E, magus: E, monk: E, ranger: E, runesmith: E, swashbuckler: E, thaumaturge: E, summoner: E
};
const NO_SPEC = new Set(["kineticist"]);
const TRAINED_CASTERS = new Set(["magus", "summoner"]);
const ARMOR_CAP = { heavy: 0, medium: 1, light: 3, unarmored: 99 };
const STANDARD_ARMOR = { fighter: "heavy", rogue: "light", wizard: "unarmored", cleric: "medium" };
const STANDARD_HP = { fighter: 10, rogue: 8, wizard: 6, cleric: 8 };
const resiliencyArchetypes = (hpPerLevel) => (hpPerLevel <= 8 ? 7 : hpPerLevel <= 10 ? 2 : 0);
const ENERGY_RUNES = [["greaterFlaming", "fire"], ["greaterFrost", "cold"], ["greaterShock", "electricity"]];
const BUFF_SCROLLS = [["Heroism", 9, 2], ["Girzanje's March", 7, 2]];
const S = (x) => JSON.stringify(x);

async function libs() {
    const { CLASS_SLUGS, classArmor } = await import("../src/engine/classes.js");
    const { classPartyFor, spell } = await import("./lib/deadliness.mjs");
    const e7 = await import("./lib/e7-power.mjs");
    return { CLASS_SLUGS, classArmor, classPartyFor, spell, ...e7 };
}

// A class at level L in its seat of the 7th-level party: its PC (and its companions) at L, the others at 7th.
function seated(lib, slug, level) {
    const at7 = lib.classPartyFor(slug, 7);
    if (level === 7) return at7;
    const own = (c) => c.id === slug || c.sharesHpWith === slug;
    const atL = lib.classPartyFor(slug, level).filter(own);
    return [...atL, ...at7.filter((c) => !own(c))];
}

// The class feats: the four best of 8–15 rated above zero that play at 7th on that class (no loadout, no Strikes changed).
async function pickFeats(lib, slug) {
    const fp = await import("./lib/feat-power.mjs");
    const refs = fp.featRefs().filter((r) => r.source === "pf2e" && r.category === "class" && r.level >= 8 && r.level <= 15 && r.traits.includes(slug));
    let rated;
    if (STANDARD.includes(slug)) {
        const cf = JSON.parse(fs.readFileSync(new URL("../docs/e7-ratings.json", import.meta.url), "utf8")).classFeats.filter((r) => r.seat === slug && !r.skipped);
        rated = refs.map((r) => ({ ref: r, rating: cf.find((x) => x.name === r.name)?.levels })).filter((x) => x.rating != null);
    } else {
        const fr = JSON.parse(fs.readFileSync(new URL("../src/data/feat-ratings.json", import.meta.url), "utf8")).ratings["pf2e.feats-srd"];
        rated = refs.map((r) => ({ ref: r, rating: fr[r.id] })).filter((x) => x.rating != null);
    }
    rated = rated.filter((x) => x.rating > 0).sort((a, b) => b.rating - a.rating);
    const base = lib.classPartyFor(slug, 7).find((c) => c.id === slug);
    const picks = [], skipped = [];
    for (const { ref, rating } of rated) {
        if (picks.length >= 4) break;
        const doc = fp.docsOf(ref.path).get(ref.id);
        let built;
        try {
            built = fp.partyWithFeat(doc, 7);
            if (built.skipped || built.host !== slug) built = fp.partyWithFeat(doc, 7, { party: lib.classPartyFor(slug, 7), hostId: slug });
        } catch (error) { skipped.push(`${ref.name}: ${error.message}`); continue; }
        if (built.skipped) { skipped.push(`${ref.name}: ${built.reason}`); continue; }
        if (built.loadout) { skipped.push(`${ref.name}: needs the ${built.loadout} loadout`); continue; }
        const withFeat = built.party.find((c) => c.id === slug);
        if (!withFeat) { skipped.push(`${ref.name}: not on the ${slug}`); continue; }
        const add = {};
        let bad = null;
        for (const key of Object.keys(withFeat)) {
            if (S(base[key]) === S(withFeat[key])) continue;
            if (key === "strikes") { bad = "changes the Strikes"; break; }
            const was = base[key], now = withFeat[key];
            if (Array.isArray(now)) add[key] = { list: now.filter((e) => !(was ?? []).some((b) => S(b) === S(e))) };
            else if (now && typeof now === "object" && was && typeof was === "object") add[key] = { keys: Object.fromEntries(Object.entries(now).filter(([k, v]) => S(was[k]) !== S(v))) };
            else add[key] = { value: now };
        }
        if (bad) { skipped.push(`${ref.name}: ${bad}`); continue; }
        if (!Object.keys(add).length) { skipped.push(`${ref.name}: adds nothing at 7th`); continue; }
        picks.push({ name: ref.name, level: ref.level, rating, played: built.played, add });
    }
    return { picks, skipped };
}
function withFeats(c, list) {
    for (const { add } of list) for (const [key, how] of Object.entries(add)) {
        if (how.list) c[key] = [...(c[key] ?? []), ...structuredClone(how.list)];
        else if (how.keys) c[key] = { ...(c[key] ?? {}), ...structuredClone(how.keys) };
        else c[key] = structuredClone(how.value);
    }
}

let picksCache = null;
const picksOf = (out) => (picksCache ??= JSON.parse(fs.readFileSync(`${out}/picks.json`, "utf8")));

// The class's numbers at 7th, read from its PC.
function profile(lib, slug, c) {
    const a = c.abilities ?? { fighter: { con: 2, dex: 0, wis: 1 }, rogue: { con: 1, dex: 4, wis: 1 }, wizard: { con: 2, dex: 2, wis: 1 }, cleric: { con: 2, dex: 2, wis: 4 } }[slug];
    const hpPerLevel = STANDARD_HP[slug] ?? Math.round((c.hp.max - 8) / 7 - a.con);
    const armor = STANDARD_ARMOR[slug] ?? lib.classArmor(slug);
    const ranks = { fortitude: c.saves.fortitude - 7 - a.con, reflex: c.saves.reflex - 7 - a.dex, will: c.saves.will - 7 - a.wis };
    const slots = Object.keys(c.spellPools ?? {}).some((p) => new RegExp(`^${slug}:\\d+:\\d+$`).test(p));
    return { a, hpPerLevel, armor, ranks, slots, weapon: WEAPON_RANK[slug] ?? null };
}

let buildsCache = null;
async function builds(out) {
    if (buildsCache) return buildsCache;
    const lib = await libs();
    const { withPC, spellBonus, strikeUp, conUp, CLASS_SLUGS, classPartyFor, spell } = lib;
    const picks = picksOf(out);
    const list = {};
    for (const slug of CLASS_SLUGS) {
        const at7 = () => classPartyFor(slug, 7);
        const pc0 = at7().find((c) => c.id === slug);
        if (!pc0) continue;
        const p = profile(lib, slug, pc0);
        const companions = (party) => party.filter((c) => c.sharesHpWith === slug);
        const weaponHolders = (c, party) => (slug === "summoner" ? companions(party) : [c]);
        // Slots from the class's own caster at a level that casts the rank.
        const addClassSlots = (c, ranks, perRank) => {
            const base = c.spells.find((e) => !e.kind && e.pool && new RegExp(`^${slug}:\\d+:\\d+$`).test(e.pool));
            if (!base) return;
            for (const r of ranks) {
                const source = classPartyFor(slug, Math.min(20, 2 * r + 1)).find((x) => x.id === slug);
                const entries = (source?.spells ?? []).filter((e) => !e.kind && e.castRank === r && e.pool && new RegExp(`^${slug}:\\d+:\\d+$`).test(e.pool));
                for (let i = 0; i < perRank && entries.length; i++) {
                    const pool = `${slug}:e7-${r}:${Object.keys(c.spellPools).length}`;
                    c.spells.push({ ...entries[i % entries.length], dc: base.dc, attack: base.attack, pool });
                    c.spellPools[pool] = 1;
                }
            }
        };
        const keyMartial = !p.slots;
        const attributes = (c, holders) => {
            for (const h of holders) strikeUp(h, 1, { damage: keyMartial ? 1 : 0 });
            conUp(c);
            c.saves.reflex += 1; c.saves.will += 1; c.perception += 1;
            if ((p.a.dex ?? 0) + 1 <= ARMOR_CAP[p.armor]) c.ac += 1;
            if (p.slots) spellBonus(c, 1);
            else c.spells = (c.spells ?? []).map((e) => (!e.kind && e.dc != null ? { ...e, dc: e.dc + 1, ...(e.attack != null ? { attack: e.attack + 1 } : {}) } : e));
            if (c.classDC != null) c.classDC += 1;
        };
        const iwp = (holders) => {
            if (p.weapon == null) return;
            const spec = NO_SPEC.has(slug) ? 0 : 1;
            for (const h of holders) h.strikes = h.strikes.map((s, i) => ((slug === "kineticist" ? s.impulse : i === 0) ? { ...s, bonus: s.bonus + 2, damage: s.damage.map((d, j) => (j ? d : { ...d, bonus: (d.bonus ?? 0) + spec })) } : s));
        };
        const maxed = (party) => {
            const c = party.find((x) => x.id === slug);
            const holders = weaponHolders(c, party);
            attributes(c, holders);
            for (const [save, r] of Object.entries(p.ranks)) c.saves[save] += Math.max(0, M - r);
            c.ac += 2;
            iwp(holders);
            // (Master Spellcasting Proficiency: +2 from expert; the magus and summoner, trained at 7th, +4.)
            if (p.slots) { spellBonus(c, TRAINED_CASTERS.has(slug) ? 4 : 2); addClassSlots(c, [5, 6, 7, 8, 9], 1); addClassSlots(c, [4], 10); }
            const extra = c.level + resiliencyArchetypes(p.hpPerLevel) * 60;
            c.hp = { value: c.hp.max + extra, max: c.hp.max + extra };
            withFeats(c, picks[slug]?.picks ?? []);
            for (const comp of companions(party)) { comp.saves = { ...c.saves }; comp.ac += c.ac - pc0.ac; }
        };
        const geared = (party) => {
            const c = party.find((x) => x.id === slug);
            const holders = weaponHolders(c, party);
            for (const h of holders) h.strikes = h.strikes.map((s) => {
                if (s.impulse) return { ...s, bonus: s.bonus + 2 };
                // (An alchemist's bombs: the major bomb's +3 item bonus and four dice.)
                if (s.splashKind === "bomb") return { ...s, bonus: s.bonus + 3 - (s.itemBonus ?? 1), damage: s.damage.map((d, j) => (j ? d : { ...d, dice: Math.max(d.dice ?? 0, 4) })) };
                if (s.splashKind === "bomb" || s.potency == null && slug !== "summoner") return s;
                const had = s.potency ?? 1;
                const [first, ...rest] = s.damage;
                return {
                    ...s, bonus: s.bonus + (3 - had), potency: 3,
                    iwr: { ...(s.iwr ?? {}), traits: [...new Set([...(s.iwr?.traits ?? []), "magical"])], runes: [...(s.iwr?.runes ?? []), ...ENERGY_RUNES.map(([rune]) => rune)] },
                    damage: [{ ...first, dice: 4 }, ...rest, ...ENERGY_RUNES.map(([, type]) => ({ dice: 1, die: 6, bonus: 0, type }))]
                };
            });
            c.ac += 2;
            for (const save of Object.keys(c.saves)) c.saves[save] += 3;
            // (Apex: the key attribute again.)
            if (p.slots) spellBonus(c, 1);
            else { for (const h of holders) strikeUp(h, 1, { damage: 1 }); c.spells = (c.spells ?? []).map((e) => (!e.kind && e.dc != null ? { ...e, dc: e.dc + 1 } : e)); }
            if (p.slots) {
                addClassSlots(c, [5, 6, 7, 8, 9], 3);
                const base = c.spells.find((e) => !e.kind && e.pool);
                if (["divine", "occult"].includes(base?.tradition)) for (const [name, castRank, uses] of BUFF_SCROLLS) {
                    const found = spell(name, castRank);
                    if (!found) continue;
                    const pool = `${slug}:scroll:${name}`;
                    c.spells.push({ ...found, name: found.name ?? name, castRank, dc: base.dc, attack: base.attack, pool, tradition: base.tradition });
                    c.spellPools[pool] = uses;
                }
                c.spells = c.spells.map((e) => (!e.kind && e.attack != null ? { ...e, attack: e.attack + 2 } : e));
            }
            for (const comp of companions(party)) { comp.saves = { ...c.saves }; comp.ac += 2; }
        };
        const fresh = () => structuredClone(at7());
        list[`all-max-${slug}`] = () => { const party = fresh(); maxed(party); return party; };
        list[`all-gear-max-${slug}`] = () => { const party = fresh(); maxed(party); geared(party); return party; };
        for (const Lv of LADDER) list[`${slug}-${Lv}`] = () => seated(lib, slug, Lv);
    }
    return (buildsCache = list);
}

async function runTask({ out, id, tier, encounter }) {
    const { dayFights, casterFoes, TIERS, FIGHTS } = await import("./lib/e7-power.mjs");
    const party = (await builds(out))[id]();
    const scores = dayFights(party, casterFoes(encounter, TIERS[tier]), 0, FIGHTS);
    return { id, tier, encounter, mean: scores.reduce((s, x) => s + x, 0) / scores.length, fights: scores.length };
}

if (!isMainThread) workerLoop(runTask);
else {
    const [out, phase] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
    const WORKERS = Number(process.argv.find((a) => a.startsWith("--workers="))?.split("=")[1]) || defaultWorkers();
    fs.mkdirSync(out, { recursive: true });
    const lib = await libs();
    if (phase === "pick") {
        const all = {};
        for (const slug of lib.CLASS_SLUGS) {
            if (!lib.classPartyFor(slug, 7).some((c) => c.id === slug)) { all[slug] = { unseated: true, picks: [], skipped: [] }; continue; }
            all[slug] = await pickFeats(lib, slug);
            console.log(slug, all[slug].picks.map((x) => `${x.name} (${x.rating.toFixed(2)})`).join(", ") || "none");
        }
        fs.writeFileSync(`${out}/picks.json`, JSON.stringify(all, null, 1));
    } else if (phase === "run") {
        const only = process.argv.find((a) => a.startsWith("--ids="))?.slice(6);
        const ids = Object.keys(await builds(out)).filter((id) => !only || new RegExp(only).test(id));
        const tasks = ids.flatMap((id) => Object.keys(lib.TIERS).flatMap((tier) => lib.KINDS.map((encounter) => ({ out, id, tier, encounter }))));
        const name = process.argv.find((a) => a.startsWith("--name="))?.slice(7);
        await runPool({ workerUrl: new URL(import.meta.url), workers: WORKERS, tasks, path: `${out}/e7-allclasses${name ? `-${name}` : ""}.jsonl` });
    } else if (phase === "report") {
        const rows = fs.readdirSync(out).filter((f) => /^e7-allclasses.*\.jsonl$/.test(f)).flatMap((f) => fs.readFileSync(`${out}/${f}`, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)));
        const errors = rows.filter((x) => x.error);
        const score = (id) => { const r = rows.filter((x) => x.id === id && !x.error); return r.length ? r.reduce((s, x) => s + x.mean, 0) / r.length : null; };
        const playsLike = (s, slug) => {
            if (s == null) return null;
            const pts = LADDER.map((Lv) => [Lv, score(`${slug}-${Lv}`)]).filter(([, v]) => v != null);
            if (!pts.length) return null;
            if (s >= pts[0][1]) return pts[0][0];
            for (let i = 1; i < pts.length; i++) if (s >= pts[i][1]) { const [L0, a] = pts[i - 1], [L1, b] = pts[i]; return L0 + (a - s) / Math.max(1e-9, a - b) * (L1 - L0); }
            return 20.5;
        };
        const fmt = (v) => (v == null ? "—" : v >= 20.5 ? ">20" : v <= 7 ? "≤7" : v.toFixed(1));
        const picks = picksOf(out);
        const table = lib.CLASS_SLUGS.map((slug) => {
            const max = score(`all-max-${slug}`), gear = score(`all-gear-max-${slug}`);
            return { slug, max, gear, maxL: playsLike(max, slug), gearL: playsLike(gear, slug), plain: score(`${slug}-7`) };
        }).sort((x, y) => (y.gearL ?? -1) - (x.gearL ?? -1));
        const lines = ["# E7: every class at the cap, with everything", "", `Made by \`node tools/e7-allclasses.mjs <out> pick|run|report\` on ${new Date().toISOString().slice(0, 10)}. Each class seated in the 7th-level party (classPartyFor), maxed under the current E7 rules (see the tool's header), then with the best non-mythic gear; **plays like**: the level of that class, leveled up in the same seat, that scores the same. **Score**: damage taken over the party's Hit Points, downs, deaths and wipes (lower is stronger). ${rows.length} rows, ${errors.length} errors.`, "", "| Class | Plain 7th score | Maxed score | Plays like | Maxed + gear score | Plays like | Class feats |", "|---|---:|---:|---:|---:|---:|---|"];
        for (const r of table) lines.push(`| ${r.slug} | ${r.plain?.toFixed(3) ?? "—"} | ${r.max?.toFixed(3) ?? "—"} | ${fmt(r.maxL)} | ${r.gear?.toFixed(3) ?? "—"} | ${fmt(r.gearL)} | ${(picks[r.slug]?.picks ?? []).map((x) => `${x.name} (${x.level}th, ${x.rating.toFixed(2)})`).join("; ") || "none"} |`);
        lines.push("", "Class feats skipped (rated above zero but not played at 7th on that class, or not added):", "");
        for (const slug of lib.CLASS_SLUGS) if (picks[slug]?.skipped?.length) lines.push(`- ${slug}: ${picks[slug].skipped.slice(0, 6).join("; ")}${picks[slug].skipped.length > 6 ? "; …" : ""}`);
        const unseated = lib.CLASS_SLUGS.filter((slug) => picks[slug]?.unseated);
        lines.push("", `Classes the simulator can't seat: ${unseated.join(", ") || "none"}.`);
        if (errors.length) lines.push("", "Errors:", "", ...errors.slice(0, 10).map((e) => `- ${e.id} ${e.tier} ${e.encounter}: ${String(e.error).slice(0, 200)}`));
        fs.writeFileSync(`${out}/e7-allclasses.md`, lines.join("\n") + "\n");
        console.log(lines.slice(4).join("\n"));
    }
}
