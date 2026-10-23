// Danger for its level (the deadliest-creatures study's method, 2026-10-13/14; the compendium numbers, 2026-10-20): what both the offline
// tool (tools/deadliest.mjs, tools/lib/deadliness.mjs) and the in-Foundry run (scripts/danger-run.js, the user: "add a button in the settings
// for people to run the simulator again for the compendium danger numbers") count and rank with, so they agree. Pure.
//   A fight: one creature (and its summons) against the standard party of its level, clamped to 1–20, to the end (no morale, no retreat).
//   Its deadliness: the share of the party's Hit Points it took (with what it made the party deal itself — confused members striking
//   their own, the party fighting a member it controls: damageBy.foesInduced, 2026-10-21), +0.25 for each PC it downed, +1 for each it killed (a death is four downs:
//   the user's call, 2026-10-14), +1 for a wipe.
//   The ladder: moderate creatures (GM Core's tables) from 3 levels below each party level to 10 above, the yardstick for "fights like a
//   creature N levels higher" — a creature's effective level. "For its level": its effective level less the typical (median) creature's
//   of the same level. Data slips (numbers far past GM Core's extreme) and April Fools creatures are left out.
//   Rows: screen { key, group (its compendium: a Society subtier version is looked for beside its base), name, level, n, score, profile,
//   publication, error?, skipped? }; baseline { level, n, score } (a moderate creature against its own level's party); ladder { party,
//   level, n, score }.

import { simulate } from "./fight.js";
import { moderate, steps, tier } from "./creature-tables.js";

export const DANGER_OPTIONS = Object.freeze({ morale: false, retreat: false });
// (2026-10-22, the user: danger rates the creature's own threat wherever it's met — the party doesn't prepare Banishment: in its home plane a
// fiend can't be banished, and a party won't always have it. The standard party's other spells stay; Banishment plays in other fights.)
export const DANGER_PARTY_LEAVES_OUT = Object.freeze(["Banishment"]);
export const dangerPartySpell = (spell) => (name, rank) => (DANGER_PARTY_LEAVES_OUT.includes(name) ? null : spell(name, rank));
export const DEATH_WEIGHT = 1;
// The ladder's party levels and its offsets from them; its yardstick creatures (and each level's baseline) fight LADDER_FIGHTS_PER times a
// creature's fights (400 against 100).
export const LADDER_PARTIES = Object.freeze(Array.from({ length: 20 }, (_, index) => index + 1));
export const LADDER_OFFSETS = Object.freeze(Array.from({ length: 14 }, (_, index) => index - 3));
export const LADDER_FIGHTS_PER = 4;

const average = (part) => ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (part.multiplier ?? 1);
export const strikeAverage = (strike) => (strike.damage ?? []).filter((part) => !part.splash && !part.persistent).reduce((sum, part) => sum + average(part), 0);
export const realSpells = (monster) => (monster.spells ?? []).filter((entry) => !entry.kind);

// The party's level for a creature's.
export const partyLevelFor = (level) => Math.max(1, Math.min(20, Number(level) || 0));

// Whether a creature has anything to fight with (a Strike, a spell or an ability it casts).
export const canFight = (monster) => !!(monster?.strikes?.length || (monster?.spells ?? []).some((entry) => !entry.kind || entry.kind === "ability"));

// The fights: seeds [from, to). Per fight: the party's damage share, PCs downed and killed, a wipe; rounds; the creature killed.
export function dangerFights(party, foes, from, to, { setup = null } = {}) {
    const partyHp = party.reduce((sum, c) => sum + c.hp.max, 0);
    const sum = { n: 0, damage: 0, downs: 0, deaths: 0, wipes: 0, rounds: 0, killed: 0, timeouts: 0, score: 0, scores: [] };
    for (let seed = from; seed < to; seed++) {
        // (setup: a creature's preferences' fights — preferences.js: the light, the cover, a battlefield.)
        const result = simulate({ combatants: [...party, ...foes], ...(setup ? { setup } : {}) }, DANGER_OPTIONS, seed);
        const damage = ((result.damageBy?.foes ?? 0) + (result.damageBy?.foesInduced ?? 0)) / partyHp;
        const downs = result.party.filter((c) => c.down).length;
        const deaths = result.party.filter((c) => c.dead).length;
        const wipe = result.outcome === "defeat" ? 1 : 0;
        const score = damage + 0.25 * downs + DEATH_WEIGHT * deaths + wipe;
        sum.n++;
        sum.damage += damage;
        sum.downs += downs;
        sum.deaths += deaths;
        sum.wipes += wipe;
        sum.rounds += result.rounds;
        sum.killed += result.foes.some((c) => c.id === "monster" && c.status === "dead") ? 1 : 0;
        sum.timeouts += result.outcome === "decisive" || result.outcome === "defeat" ? 0 : 1;
        sum.score += score;
        sum.scores.push(Math.round(score * 1000) / 1000);
    }
    return sum;
}

export function dangerSummary(sum) {
    const n = Math.max(1, sum.n);
    const mean = sum.score / n;
    const variance = sum.scores.reduce((total, value) => total + (value - mean) ** 2, 0) / Math.max(1, n - 1);
    return { n: sum.n, score: mean, se: Math.sqrt(variance / n), damage: sum.damage / n, downs: sum.downs / n, deaths: sum.deaths / n, wipes: sum.wipes / n, rounds: sum.rounds / n, killed: sum.killed / n, timeouts: sum.timeouts / n, scores: sum.scores };
}

// Summaries of the same fights in parts (seed ranges), as one.
export function mergeSummaries(parts) {
    const sum = { n: 0, damage: 0, downs: 0, deaths: 0, wipes: 0, rounds: 0, killed: 0, timeouts: 0, score: 0, scores: [] };
    for (const part of parts) {
        for (const key of ["damage", "downs", "deaths", "wipes", "rounds", "killed", "timeouts", "score"]) sum[key] += (part[key] ?? 0) * part.n;
        sum.n += part.n;
        sum.scores.push(...(part.scores ?? []));
    }
    return dangerSummary(sum);
}

// Where its numbers sit for its level.
export function dangerProfile(monster) {
    const level = monster.level;
    const bestStrike = (monster.strikes ?? []).reduce((best, strike) => (!best || strikeAverage(strike) > strikeAverage(best) ? strike : best), null);
    const attack = Math.max(-Infinity, ...(monster.strikes ?? []).map((strike) => strike.bonus));
    const damage = bestStrike ? strikeAverage(bestStrike) : 0;
    const dc = Math.max(-Infinity, ...realSpells(monster).map((entry) => entry.dc ?? -Infinity));
    const saves = Object.values(monster.saves ?? {});
    const stat = (name, value) => (Number.isFinite(value) ? { value, tier: tier(name, level, value), steps: Math.round(steps(name, level, value) * 100) / 100 } : null);
    return {
        ac: stat("ac", monster.ac), hp: stat("hp", monster.hp.max), attack: stat("attack", attack), damage: stat("damage", damage),
        fortitude: stat("save", monster.saves?.fortitude), reflex: stat("save", monster.saves?.reflex), will: stat("save", monster.saves?.will),
        bestSave: stat("save", Math.max(...saves)), worstSave: stat("save", Math.min(...saves)), perception: stat("save", monster.perception),
        spellDC: stat("spellDC", dc),
        strikes: (monster.strikes ?? []).length, abilities: monster.usedAbilities?.size ?? 0, spells: realSpells(monster).length,
        regeneration: monster.regeneration?.value ?? 0, fastHealing: monster.fastHealing ?? 0, resistances: (monster.resistances ?? []).length,
        immunities: (monster.immunities ?? []).length, weaknesses: (monster.weaknesses ?? []).length, reach: monster.reach, speed: monster.speed, flies: !!monster.flies
    };
}

// --- The ranking -----------------------------------------------------------------

export const usable = (row) => !row.error && !row.skipped && Number.isFinite(row.score);
const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

// A Society scenario's subtier version, "Krosovahn Mendesil (7-8)", that keeps its base creature's level with AC and attack 2 or more
// higher: a level that wasn't updated. The keys of those.
export function subtierSlips(screen) {
    const rows = screen.filter((row) => !row.error && !row.skipped);
    const index = new Map(rows.map((row) => [`${row.group}|${row.name}`, row]));
    return new Set(rows.filter((row) => {
        const named = /^(.*) \((\d+)-(\d+)\)$/.exec(row.name ?? "");
        const base = named ? index.get(`${row.group}|${named[1]}`) : null;
        const more = (key) => (row.profile?.[key]?.value ?? 0) - (base?.profile?.[key]?.value ?? 0);
        return base && base.level === row.level && more("ac") >= 2 && more("attack") >= 2;
    }).map((row) => row.key));
}

// A Strike far past GM Core's extreme damage (a data slip, 2d8+154), an attack or an AC far past extreme, or a subtier slip.
export const suspect = (row, slips = new Set()) => (row.profile?.damage?.steps ?? 0) > 8 || (row.profile?.attack?.steps ?? 0) > 5.5 || (row.profile?.ac?.steps ?? 0) > 6 || slips.has(row.key);
// Paizo's April Fools blog creatures (the Nonsequitaur): jokes, not built to the tables.
export const joke = (row) => /april fool|foolish/i.test(row.publication ?? "");

// Each level's yardstick before a ladder: the median screened creature of that level (a moderate creature's score where fewer than five).
export function baselineScores(screen, baseline) {
    const moderateScores = new Map();
    for (const row of baseline) {
        const entry = moderateScores.get(row.level) ?? { n: 0, score: 0 };
        entry.score += row.score * row.n;
        entry.n += row.n;
        moderateScores.set(row.level, entry);
    }
    const scores = new Map();
    for (const row of screen.filter(usable)) scores.set(row.level, [...(scores.get(row.level) ?? []), row.score]);
    const levels = new Set([...moderateScores.keys(), ...scores.keys()]);
    return new Map([...levels].map((level) => [level, (scores.get(level)?.length ?? 0) >= 5 ? median(scores.get(level)) : (moderateScores.get(level)?.score ?? 0) / Math.max(1, moderateScores.get(level)?.n ?? 1)]));
}

// The ladder's curves: for each party level, [offset, mean score] up to its peak.
export function ladderCurves(ladder) {
    const sums = new Map();
    for (const row of ladder) {
        const key = `${row.party}|${row.level - row.party}`;
        const entry = sums.get(key) ?? { party: row.party, offset: row.level - row.party, n: 0, score: 0 };
        entry.score += row.score * row.n;
        entry.n += row.n;
        sums.set(key, entry);
    }
    const curves = new Map();
    for (const entry of sums.values()) curves.set(entry.party, [...(curves.get(entry.party) ?? []), [entry.offset, entry.score / entry.n]]);
    for (const [party, curve] of curves) {
        curve.sort((a, b) => a[0] - b[0]);
        const peak = curve.reduce((best, point, index) => (point[1] > curve[best][1] ? index : best), 0);
        curves.set(party, curve.slice(0, peak + 1));
    }
    return curves;
}

// The offset a score fights like on a curve. Past the ladder's top (a creature that kills PCs outright as no by-the-book creature does): on
// at the ladder's average rise from its own level to the top, an estimate.
export function offsetOn(curve, score) {
    if (score <= curve[0][1]) return curve[0][0];
    for (let index = 1; index < curve.length; index++) {
        const [low, high] = [curve[index - 1], curve[index]];
        if (score <= high[1]) return low[0] + (high[1] > low[1] ? (score - low[1]) / (high[1] - low[1]) : 0) * (high[0] - low[0]);
    }
    const zero = curve.find(([offset]) => offset === 0)?.[1] ?? curve[0][1];
    const [top, best] = curve.at(-1);
    const rise = top > 0 && best > zero ? (best - zero) / top : null;
    return top + (rise ? (score - best) / rise : 0);
}

export function effectiveLevel(curves, row) {
    const party = partyLevelFor(row.level);
    return curves.has(party) ? party + offsetOn(curves.get(party), row.score) : null;
}

// "above": past the ladder's top (its number an estimate); "below": at or under its foot (its number the most it could be); else null.
export function boundOf(curves, row) {
    const curve = curves.get(partyLevelFor(row.level));
    return curve && row.score > curve.at(-1)[1] ? "above" : curve && row.score <= curve[0][1] ? "below" : null;
}

// A run's scale: the ladder's curves, and each level's typical creature — the median effective level of the screen's (the whole run's)
// creatures of that level, where it has five or more (else a moderate creature: its own level).
export function scaleOf({ screen, ladder }) {
    const curves = ladderCurves(ladder);
    const byLevel = new Map();
    for (const row of screen.filter(usable)) byLevel.set(row.level, [...(byLevel.get(row.level) ?? []), effectiveLevel(curves, row)]);
    const typical = new Map([...byLevel].filter(([, values]) => values.length >= 5).map(([level, values]) => [level, median(values)]));
    return { curves, typical };
}

// A creature ({ level, score }) on a scale: { excess, bound }, or null where the scale has no curve for its party.
export function rateOn(scale, row) {
    const effective = effectiveLevel(scale.curves, row);
    if (effective === null) return null;
    return { excess: effective - (scale.typical.get(row.level) ?? row.level), bound: boundOf(scale.curves, row) };
}

// A scale kept with the numbers (src/data/danger-ratings.json's, a world's run): { curves: { "<party>": [[offset, score]] }, typical:
// { "<level>": effective level } } — so one creature can be rated again on it, alone (2026-10-20, the user: "so in the future if we
// update 1 monster we can run them alone and not have to simulate every monster in the game again").
export function scaleToJSON(scale) {
    // (To a billionth: a creature rated alone lands where the whole ranking put it, a number on the edge of a tenth too.)
    const round = (value) => Math.round(value * 1e9) / 1e9;
    return {
        curves: Object.fromEntries([...scale.curves].sort((a, b) => a[0] - b[0]).map(([party, curve]) => [party, curve.map(([offset, score]) => [offset, round(score)])])),
        typical: Object.fromEntries([...scale.typical].sort((a, b) => a[0] - b[0]).map(([level, value]) => [level, round(value)]))
    };
}

export function scaleFromJSON(json) {
    if (!json?.curves) return null;
    return {
        curves: new Map(Object.entries(json.curves).map(([party, curve]) => [Number(party), curve.map(([offset, score]) => [Number(offset), Number(score)])])),
        typical: new Map(Object.entries(json.typical ?? {}).map(([level, value]) => [Number(level), Number(value)]))
    };
}

// One creature rated alone, on a kept scale: { value (rounded to a tenth), bound } — or null when it gets none (a data slip, an April Fools
// creature, a score the scale can't place).
export function rateAlone(scale, row) {
    if (!usable(row) || suspect(row) || joke(row)) return null;
    const rated = rateOn(scale, row);
    return rated && Number.isFinite(rated.excess) ? { value: Math.round(rated.excess * 10) / 10, bound: rated.bound } : null;
}

// rows ranked by danger for their level, most dangerous first, each with its excess (levels above the typical creature of its level, or
// before a ladder the score above the level's yardstick) on the run's scale. Slips and jokes left out.
export function rankRows(rows, { screen, baseline = [], ladder = [] }) {
    const slips = subtierSlips(screen);
    const kept = rows.filter((row) => usable(row) && !suspect(row, slips) && !joke(row));
    const scale = scaleOf({ screen, ladder });
    if (!scale.curves.size) {
        const base = baselineScores(screen, baseline);
        return kept.map((row) => ({ ...row, excess: row.score - (base.get(row.level) ?? 0) })).sort((a, b) => b.excess - a.excess);
    }
    return kept.map((row) => ({ ...row, excess: rateOn(scale, row).excess })).sort((a, b) => b.excess - a.excess);
}

// The compendium numbers (src/data/danger-ratings.json's ratings and bounds) from ranked rows, each with its collection and id.
export function ratingsOf(ranked, ladder) {
    const curves = ladderCurves(ladder);
    const ratings = {};
    const bounds = {};
    for (const row of ranked) {
        if (!Number.isFinite(row.excess) || !row.collection || !row.id) continue;
        (ratings[row.collection] ??= {})[row.id] = Math.round(row.excess * 10) / 10;
        const bound = boundOf(curves, row);
        if (bound) (bounds[row.collection] ??= {})[row.id] = bound;
    }
    return { ratings, bounds };
}
