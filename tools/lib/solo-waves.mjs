// A class's PC alone against endless waves (2026-11-09, Cole: "each class is solo fighting infinite waves of enemies. Each fight should be
// winnable with 10 minutes in between to do any single 10 minute activity such as refocusing. This should loop until the class PC dies and
// rank them based on how long they went").
//
// The PC (src/engine/classes.js, with its eidolon, companion or familiar) fights a wave, keeps its Hit Points, spent slots and Focus
// Points, then rests 10 minutes doing one thing: Treat Wounds on itself (once an hour: PF2e's immunity) or Refocus (1 Focus Point). It
// goes on until it's down — alone, no one brings it back — or WAVE_CAP waves.
//
// A wave is a moderate encounter for one PC (Monster Core: 80 XP less 20 for each PC fewer than four = 20 XP): one creature 3 levels
// below it, or (from 4th level, every other wave) two creatures 4 levels below (10 XP each) — creatures of the feat ratings' build (a moderate
// creature's numbers, darkvision, a natural attack), at level −1 at least.
const { classPartyFor } = await import("./deadliness.mjs");
const { simulate } = await import("../../src/engine/fight.js");
const { DANGER_OPTIONS } = await import("../../src/engine/danger-scale.js");
const { moderateCreatureAt } = await import("../../src/engine/creature-tables.js");

export const WAVE_CAP = Number(process.env.SOLO_CAP) || 1000;
export const RUNS = Number(process.env.SOLO_RUNS) || 20;
export const LEVELS = Object.freeze((process.env.SOLO_LEVELS || "1,5,10,15,20").split(",").map(Number));
const GRID = process.env.FEAT_GRID === "none" ? null : process.env.FEAT_GRID || "open";
const OPTIONS = GRID ? { ...DANGER_OPTIONS, grid: GRID } : DANGER_OPTIONS;

function foe(level, id) {
    const made = { ...moderateCreatureAt(Math.max(-1, Math.min(25, level)), id), senses: ["darkvision"] };
    made.strikes = (made.strikes ?? []).map((strike) => (strike.melee !== false ? { ...strike, unarmed: true } : strike));
    return made;
}
// (2026-11-09, Cole: "after wave 10 have each subsequent wave be slightly stronger. The enemy waves should scale infinitely" — so no class
// with endless recovery goes on forever.) From wave 11, each wave past 10 adds 2% to the foes' Hit Points and Strike damage (compounding),
// and every fifth one +1 to their attack, AC, saves and Perception — about an elite creature's step every 10 waves, with no end.
export const SCALE_FROM = 10;
export function scaled(made, wave) {
    const k = Math.max(0, wave - SCALE_FROM);
    if (!k) return made;
    const grow = 1.02 ** k;
    const plus = Math.floor(k / 5);
    const hp = Math.round(made.hp.max * grow);
    const avg = (part) => (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0);
    return {
        ...made,
        hp: { value: hp, max: hp },
        ac: made.ac + plus,
        saves: Object.fromEntries(Object.entries(made.saves).map(([key, value]) => [key, value + plus])),
        perception: made.perception + plus,
        strikes: made.strikes.map((strike) => ({ ...strike, bonus: strike.bonus + plus, damage: strike.damage.map((part, index) => (index ? part : { ...part, bonus: (part.bonus ?? 0) + Math.round(avg(part) * (grow - 1)) })) })),
        waveScale: { wave, hp: grow, plus }
    };
}
export function waveFoes(level, wave) {
    if (level - 4 >= -1 && wave % 2 === 0) return [scaled(foe(level - 4, "monster"), wave), scaled(foe(level - 4, "monster-1"), wave)];
    return [scaled(foe(level - 3, "monster"), wave)];
}

// The PC alone: its own creature and what comes with it (an eidolon sharing its Hit Points, a companion, a familiar).
export function soloOf(slug, level) {
    const party = classPartyFor(slug, level);
    const pc = party.find((c) => c.id === slug) ?? party.find((c) => c.classSlug === slug);
    return party.filter((c) => c === pc || c.sharesHpWith === pc.id || c.companionOf === pc.id || c.familiarOf === pc.id || c.master === pc.id || (pc.companions ?? []).includes(c));
}

// A small seeded die for the rests (the fights roll their own).
function dice(seed) {
    let s = seed >>> 0 || 1;
    return (sides) => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return 1 + Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * sides);
    };
}

// Treat Wounds (Player Core): DC 15 trained (2d8), 20 expert (+10), 30 master (+30), 40 legendary (+50); a critical success doubles it, a
// critical failure deals 1d8. The tier with the most healing on average at its modifier: Medicine if it has it, else trained with Wisdom.
function treatWounds(pc, roll) {
    const mod = pc.skills?.medicine ?? pc.level + 2 + (pc.abilities?.wis ?? pc.wis ?? 0);
    const tiers = pc.battleMedicine?.tiers?.length ? pc.battleMedicine.tiers : [{ dc: 15, bonus: 0 }];
    const expect = (tier) => {
        let total = 0;
        for (let d = 1; d <= 20; d++) {
            const r = d + mod;
            let degree = r >= tier.dc + 10 ? 3 : r >= tier.dc ? 2 : r <= tier.dc - 10 ? 0 : 1;
            if (d === 20) degree = Math.min(3, degree + 1);
            if (d === 1) degree = Math.max(0, degree - 1);
            total += degree === 3 ? 2 * (9 + tier.bonus) : degree === 2 ? 9 + tier.bonus : degree === 0 ? -4.5 : 0;
        }
        return total / 20;
    };
    const tier = tiers.reduce((best, each) => (expect(each) > expect(best) ? each : best), tiers[0]);
    const d = roll(20);
    const r = d + mod;
    let degree = r >= tier.dc + 10 ? 3 : r >= tier.dc ? 2 : r <= tier.dc - 10 ? 0 : 1;
    if (d === 20) degree = Math.min(3, degree + 1);
    if (d === 1) degree = Math.max(0, degree - 1);
    const heal = roll(8) + roll(8) + tier.bonus;
    return degree === 3 ? 2 * heal : degree === 2 ? heal : degree === 0 ? -roll(8) : 0;
}

export function soloTask({ slug, level, run }) {
    const start = soloOf(slug, level);
    const pc = start[0].id === slug ? start[0] : start.find((c) => c.classSlug === slug) ?? start[0];
    const focusMax = Object.fromEntries(Object.entries(pc.spellPools ?? {}).filter(([key]) => /focus/.test(key)));
    const roll = dice(run * 7919 + level * 104729 + slug.length * 31);
    let state = new Map(start.map((c) => [c.id, { hp: c.hp.max, pools: { ...(c.spellPools ?? {}) } }]));
    let minutes = 0;
    let lastTreat = -Infinity;
    const rests = { treat: 0, refocus: 0, none: 0 };
    let hpLeft = [];
    for (let wave = 1; wave <= WAVE_CAP; wave++) {
        const team = start.map((c) => ({ ...c, hp: { ...c.hp, value: state.get(c.id).hp, temp: 0 }, spellPools: { ...state.get(c.id).pools } }));
        const result = simulate({ combatants: [...team, ...waveFoes(level, wave)] }, OPTIONS, run * 1000 + wave);
        const mine = result.party.find((c) => c.id === pc.id);
        if (!mine || mine.down || mine.dead || result.outcome === "defeat") return { kind: "solo", slug, level, run, waves: wave - 1, rests, hpAt: hpLeft };
        minutes += Math.ceil((result.rounds * 6) / 60) + 10;
        state = new Map(start.map((c) => {
            const after = result.party.find((each) => each.id === c.id);
            const was = state.get(c.id);
            return [c.id, { hp: after ? (after.dead || after.down ? 0 : after.hp) : was.hp, pools: after?.spellPools ? { ...after.spellPools } : was.pools }];
        }));
        // (A companion that fell stays down — alone, nothing raises it — but the PC goes on.)
        const own = state.get(pc.id);
        if (wave <= 10) hpLeft.push(Math.round((100 * own.hp) / pc.hp.max));
        // The 10 minutes: Treat Wounds when it's hurt to three quarters or less and it can (an hour since the last), else Refocus when a
        // Focus Point is spent, else Treat Wounds if hurt at all and it can.
        const ready = minutes - lastTreat >= 60;
        const spentFocus = Object.entries(focusMax).filter(([key, max]) => (own.pools[key] ?? 0) < max);
        const hurt = own.hp < pc.hp.max;
        const treat = () => {
            own.hp = Math.max(1, Math.min(pc.hp.max, own.hp + treatWounds(pc, roll)));
            lastTreat = minutes;
            rests.treat++;
        };
        if (ready && own.hp <= 0.75 * pc.hp.max) treat();
        else if (spentFocus.length) {
            for (const [key] of spentFocus) own.pools[key] = (own.pools[key] ?? 0) + 1;
            rests.refocus++;
        } else if (ready && hurt) treat();
        else rests.none++;
    }
    return { kind: "solo", slug, level, run, waves: WAVE_CAP, capped: true, rests, hpAt: hpLeft };
}

// The ranking: each class's mean waves at each level, its place among the classes at each level, and the classes ordered by the average of
// those places (so a level where everyone lasts long — 1st, 5th — doesn't outweigh one where no one does — 20th).
export function soloReport(rows) {
    const by = new Map();
    for (const row of rows.filter((r) => r.kind === "solo" && !r.error)) {
        const key = `${row.slug}|${row.level}`;
        if (!by.has(key)) by.set(key, []);
        by.get(key).push(row);
    }
    const slugs = [...new Set(rows.map((r) => r.slug))].sort();
    const levels = [...new Set(rows.map((r) => r.level))].sort((a, b) => a - b);
    const mean = (list) => list.reduce((s, v) => s + v, 0) / Math.max(1, list.length);
    const median = (list) => {
        const s = [...list].sort((a, b) => a - b);
        return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0;
    };
    const cell = {};
    for (const slug of slugs) for (const level of levels) {
        const list = by.get(`${slug}|${level}`) ?? [];
        cell[`${slug}|${level}`] = { mean: mean(list.map((r) => r.waves)), median: median(list.map((r) => r.waves)), capped: list.filter((r) => r.capped).length, n: list.length };
    }
    const rankAt = {};
    for (const level of levels) {
        const order = [...slugs].sort((a, b) => cell[`${b}|${level}`].mean - cell[`${a}|${level}`].mean);
        order.forEach((slug, index) => (rankAt[`${slug}|${level}`] = index + 1));
    }
    const table = slugs.map((slug) => ({ slug, mean: mean(levels.map((level) => cell[`${slug}|${level}`].mean)), rank: mean(levels.map((level) => rankAt[`${slug}|${level}`])), cells: levels.map((level) => cell[`${slug}|${level}`]) }));
    table.sort((a, b) => a.rank - b.rank || b.mean - a.mean);
    const name = (slug) => slug[0].toUpperCase() + slug.slice(1);
    const lines = [
        "# Classes alone against endless waves",
        "",
        `Made by \`node tools/solo-waves.mjs <out>\` (tools/lib/solo-waves.mjs). Each class's PC fights alone (with its eidolon, companion or familiar) against wave after wave of a moderate encounter for one PC (one creature 3 levels below it, or from 4th level every other wave two creatures 4 levels below, 10 XP each). From wave 11 each wave is a little stronger, with no end: +2% Hit Points and damage a wave, compounding, and +1 to attack, AC, saves and Perception every fifth wave. Between waves it keeps its Hit Points, spell slots and Focus Points and spends 10 minutes on one activity: Treat Wounds on itself (once an hour) or Refocus. It stops when the PC goes down, or at ${WAVE_CAP} waves. The numbers are the waves survived, the mean of ${RUNS} runs at each level.`,
        "",
        "Classes are ordered by their average place across the levels (1st = lasted longest at that level), so every level counts the same. A number in brackets is how many runs reached the cap.",
        "",
        `| # | Class | Average place (1st = best) | ${levels.map((l) => `Waves at lvl ${l}`).join(" | ")} | Average waves |`,
        `|---:|---|---:|${levels.map(() => "---:").join("|")}|---:|`,
        ...table.map((row, index) => `| ${index + 1} | ${name(row.slug)} | ${row.rank.toFixed(1)} | ${row.cells.map((c) => `${c.mean.toFixed(1)}${c.capped ? ` (${c.capped} capped)` : ""}`).join(" | ")} | ${row.mean.toFixed(1)} |`)
    ];
    return { markdown: `${lines.join("\n")}\n`, json: { levels, cap: WAVE_CAP, runs: RUNS, table } };
}
