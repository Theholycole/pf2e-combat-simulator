// A spell's power for its rank (2026-10-21, the user: "rate spells and give them a score just like creatures. be sure to include
// different scores for heightened versions if significantly different as well as a conditional score for spells that sometimes do more such
// as Sunburst doing more damage against undead"; their choices: in the party caster's hands, against a boss and a group, every installed
// spell compendium). Pure.
//   A spell at a rank: the standard party (src/engine/party.js) at the lowest level that casts that rank (2 × rank − 1), its wizard with
//   its cantrips and that one spell — one cast (a cantrip at will, in place of its own) — and no other slot, fighting to the end two moderate encounters: a boss (one
//   creature 2 levels above the party) and a group (four creatures 2 levels below). Each fight is counted as the creature numbers count a
//   creature's (the foes' danger: damage share, downs, deaths, a wipe; src/engine/danger-scale.js).
//   The ladder: the same encounters with the foes 6 levels easier to 2 harder, against the party with the wizard's cantrips alone. A
//   spell's value in an encounter: how many levels easier it makes it — the foes' score with the spell, placed on that ladder. Its power:
//   the average over the boss and the group, less the typical spell's of the same rank (the median; cantrips among cantrips).
//   Against a trait (undead for Sunburst; the traits its extra damage, its vitality damage or its targets name): the same fights with foes
//   of that trait, against the party's own fights with such foes.

import { moderateCreatureAt } from "./creature-tables.js";
import { offsetOn } from "./danger-scale.js";

export const POWER_OFFSETS = Object.freeze([-6, -5, -4, -3, -2, -1, 0, 1, 2]);
export const POWER_KINDS = Object.freeze(["boss", "group"]);
export const POWER_RANKS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// The wizard's slot for the rated spell.
export const RATED_POOL = "wizard:rated";

// The party's level for a rank: the lowest that casts it.
export const partyLevelForRank = (rank) => Math.max(1, Math.min(20, 2 * (Number(rank) || 1) - 1));

// Traits a foe can be given, each with what such creatures usually have (undead: the Monster Core undead's immunities).
const TRAIT_PACKAGES = {
    undead: { traits: ["undead", "unholy"], immunities: ["death-effects", "disease", "paralyzed", "poison", "unconscious", "bleed"] },
    fiend: { traits: ["fiend", "unholy"], immunities: [] },
    unholy: { traits: ["fiend", "unholy"], immunities: [] },
    celestial: { traits: ["celestial", "holy"], immunities: [] },
    holy: { traits: ["celestial", "holy"], immunities: [] },
    construct: { traits: ["construct"], immunities: ["bleed", "death-effects", "disease", "doomed", "drained", "fatigued", "healing", "nonlethal", "paralyzed", "poison", "sickened", "spirit", "unconscious", "vitality", "void"] },
    elemental: { traits: ["elemental"], immunities: ["bleed", "paralyzed", "poison", "sleep"] }
};
export const POWER_TRAITS = Object.freeze(Object.keys(TRAIT_PACKAGES).filter((trait) => !["unholy", "holy"].includes(trait)));
const TRAIT_ALIASES = { unholy: "fiend", holy: "celestial" };

// The foes of an encounter: kind "boss" (one, 2 levels up) or "group" (four, 2 levels down), offset levels harder, of a trait; null where
// there's no such encounter (a boss below level −1). A group below level −1 (a low party's easier rungs) is fewer level −1 creatures
// instead, about 0.7 as many a level, as encounter XP goes.
export function powerFoes(kind, level, offset = 0, trait = null) {
    const pack = trait ? TRAIT_PACKAGES[trait] : null;
    const make = (lv, id) => {
        const foe = moderateCreatureAt(Math.max(-1, Math.min(25, lv)), id);
        return pack ? { ...foe, traits: [...pack.traits], immunities: [...pack.immunities] } : foe;
    };
    if (kind === "boss") return level + 2 + offset < -1 ? null : [make(level + 2 + offset, "monster")];
    const at = level - 2 + offset;
    const count = at >= -1 ? 4 : Math.max(1, Math.round(4 * 0.7 ** (-1 - at)));
    return Array.from({ length: count }, (_, index) => make(Math.max(-1, at), index ? `monster-${index}` : "monster"));
}

// The party with the wizard's slot spells taken away — its cantrips and basic actions kept, as a caster always has them (a wizard with
// nothing at all draws no fire, and one spell then made it the foes' target: a spell looked worse than none). With entry: that spell as
// one cast more; a cantrip in place of the wizard's own.
export function partyWithSpell(party, entry = null) {
    return party.map((c) => {
        if (c.id !== "wizard") return c;
        const pools = Object.fromEntries(Object.entries(c.spellPools ?? {}).filter(([pool]) => !pool.startsWith("wizard:")));
        const basics = (c.spells ?? []).filter((spell) => spell.kind);
        const cantrips = (c.spells ?? []).filter((spell) => !spell.kind && !spell.pool);
        if (!entry) return { ...c, spells: [...basics, ...cantrips], spellPools: pools };
        if (!entry.pool) return { ...c, spells: [...basics, entry], spellPools: pools };
        return { ...c, spells: [...basics, ...cantrips, entry], spellPools: { ...pools, [entry.pool]: 1 } };
    });
}

// The wizard's numbers for a spell it's given: its spell DC and attack at its level.
export function wizardCasting(party) {
    const wizard = party.find((c) => c.id === "wizard");
    const own = (wizard?.spells ?? []).find((spell) => !spell.kind && Number.isFinite(spell.dc));
    return own ? { dc: own.dc, attack: own.attack } : null;
}

// The ranks a spell is rated at: its own, and those its heightening changes it at (PF2e's heightening data — every N ranks, or the ranks
// listed — or, without it, its text's "Heightened (+N)" and "Heightened (Nth)"). doc: the spell's data.
export function powerRanks(doc) {
    const base = Math.max(1, Math.min(10, Number(doc?.system?.level?.value) || 1));
    const ranks = new Set([base]);
    const heightening = doc?.system?.heightening;
    if (heightening?.type === "interval" && Number(heightening.interval) > 0) {
        for (let rank = base + Number(heightening.interval); rank <= 10; rank += Number(heightening.interval)) ranks.add(rank);
    } else if (heightening?.type === "fixed" && heightening.levels) {
        for (const rank of Object.keys(heightening.levels)) if (Number(rank) > base && Number(rank) <= 10) ranks.add(Number(rank));
    } else {
        const text = String(doc?.system?.description?.value ?? "");
        const every = /Heightened \(\+(\d+)\)/i.exec(text);
        if (every) for (let rank = base + Number(every[1]); rank <= 10; rank += Number(every[1])) ranks.add(rank);
        for (const match of text.matchAll(/Heightened \((\d+)(?:st|nd|rd|th)\)/gi)) if (Number(match[1]) > base && Number(match[1]) <= 10) ranks.add(Number(match[1]));
    }
    return [...ranks].sort((a, b) => a - b);
}

// The traits a spell does more against (or works only against): its extra damage's, vitality damage's (undead), and its targets'.
export function powerConditions(plan) {
    const traits = new Set();
    for (const entry of plan?.resolution?.conditionalDamage ?? []) if (entry?.trait) traits.add(entry.trait);
    const json = JSON.stringify({ resolution: plan?.resolution ?? null, targeting: plan?.targeting ?? null });
    if (/"type":"vitality"|\[vitality\]/.test(json)) traits.add("undead");
    for (const match of JSON.stringify(plan?.targeting?.actorConstraints ?? {}).matchAll(/trait:([a-z-]+)/g)) traits.add(match[1]);
    for (const match of String(plan?.targeting?.target ?? "").matchAll(/\b(undead|fiends?|celestials?|constructs?|elementals?)\b/gi)) traits.add(match[1].toLowerCase().replace(/s$/, ""));
    return [...new Set([...traits].map((trait) => TRAIT_ALIASES[trait] ?? trait).filter((trait) => TRAIT_PACKAGES[trait]))].sort();
}

// The ladder's curves: "<level>|<encounter>|<trait or ''>" → [[offset, mean score]] by offset, only as far as the score keeps rising.
export function powerCurves(ladder) {
    const sums = new Map();
    for (const row of ladder) {
        if (row.skipped || row.error || !Number.isFinite(row.score)) continue;
        const key = `${row.level}|${row.encounter}|${row.trait ?? ""}`;
        const points = sums.get(key) ?? new Map();
        const entry = points.get(row.offset) ?? { n: 0, score: 0 };
        entry.score += row.score * row.n;
        entry.n += row.n;
        points.set(row.offset, entry);
        sums.set(key, points);
    }
    const curves = new Map();
    for (const [key, points] of sums) {
        const curve = [...points].sort((a, b) => a[0] - b[0]).map(([offset, entry]) => [offset, entry.score / entry.n]);
        const peak = curve.reduce((best, point, index) => (point[1] > curve[best][1] ? index : best), 0);
        curves.set(key, curve.slice(0, peak + 1));
    }
    return curves;
}

// How many levels easier a score makes an encounter whose curve this is, against its own (no-spell) score: { value, bound } — bound
// "atLeast" when the spell took it past the ladder's easiest (the value the least it is), "atMost" past its hardest.
export function powerValue(curve, score, baseline = null) {
    if (!curve?.length) return null;
    const zero = baseline === null ? 0 : offsetOn(curve, baseline);
    const at = offsetOn(curve, score);
    return { value: zero - at, bound: score <= curve[0][1] ? "atLeast" : score > curve.at(-1)[1] ? "atMost" : null };
}

const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

// Screen rows { collection, id, name, rank, cantrip, level, traits, results: { "<encounter>|<trait or ''>": { score, n } } } and the
// ladder's rows { level, encounter, trait, offset, n, score } → each spell's ratings: { collection, id, rank, value, bound, boss, group, power, vs:
// { <trait>: power } }, power relative to the typical spell (cantrip) of its rank.
// Whether a spell went unused in every fight: its fights are the party's own (the same seeds, the ladder's first hundred at the encounter's
// level) to the last score — never cast, or nothing it does counts here. Such a spell gets no number rather than a weak one.
export function unusedSpell(row, ladder) {
    const results = Object.entries(row.results ?? {});
    return results.length > 0 && results.every(([key, result]) => {
        const [encounter, trait] = key.split("|");
        const own = ladder.find((entry) => entry.level === row.level && entry.encounter === encounter && (entry.trait ?? "") === trait && entry.offset === 0 && entry.from === 1 && entry.n === result.n);
        return own && Math.abs(own.score - result.score) < 1e-12;
    });
}

export function rankSpells(rows, ladder) {
    const curves = powerCurves(ladder);
    const rated = [];
    for (const row of rows) {
        if (row.error || row.skipped || unusedSpell(row, ladder)) continue;
        const parts = {};
        let bound = null;
        for (const kind of POWER_KINDS) {
            const result = row.results?.[`${kind}|`];
            const found = result && powerValue(curves.get(`${row.level}|${kind}|`), result.score);
            if (!found) continue;
            parts[kind] = found.value;
            bound ??= found.bound;
        }
        if (POWER_KINDS.some((kind) => !Number.isFinite(parts[kind]))) continue;
        const vs = {};
        for (const trait of row.traits ?? []) {
            const values = POWER_KINDS.map((kind) => {
                const result = row.results?.[`${kind}|${trait}`];
                const curve = curves.get(`${row.level}|${kind}|`);
                const baseline = ladder.filter((entry) => entry.level === row.level && entry.encounter === kind && entry.trait === trait && entry.offset === 0 && Number.isFinite(entry.score));
                const n = baseline.reduce((sum, entry) => sum + entry.n, 0);
                return result && n ? powerValue(curve, result.score, baseline.reduce((sum, entry) => sum + entry.score * entry.n, 0) / n)?.value : null;
            });
            if (values.every(Number.isFinite)) vs[trait] = (values[0] + values[1]) / 2;
        }
        rated.push({ ...row, boss: parts.boss, group: parts.group, value: (parts.boss + parts.group) / 2, bound, vs });
    }
    // The typical spell of each rank (and cantrip of each rank): the median value, where five or more were rated (else none: 0).
    const groupKey = (row) => `${row.cantrip ? "cantrip" : "spell"}|${row.rank}`;
    const byGroup = new Map();
    for (const row of rated) byGroup.set(groupKey(row), [...(byGroup.get(groupKey(row)) ?? []), row.value]);
    const typical = new Map([...byGroup].filter(([, values]) => values.length >= 5).map(([key, values]) => [key, median(values)]));
    return rated.map((row) => {
        const base = typical.get(groupKey(row)) ?? 0;
        return { ...row, typical: base, power: row.value - base, vs: Object.fromEntries(Object.entries(row.vs).map(([trait, value]) => [trait, value - base])) };
    });
}

const tenth = (value) => Math.round(value * 10) / 10;

// The compendium numbers (src/data/spell-ratings.json): ratings { "<compendium id>": { "<item id>": power at its own rank } }, bounds as the
// creature numbers' ("atLeast"/"atMost"), and detail { "<compendium id>": { "<item id>": { rank, boss, group, typical, cantrip?,
// partial?, ranks: { "<rank>": power } (heightened), vs: { "<trait>": power } } }.
export function spellRatingsOf(ranked) {
    const ratings = {};
    const bounds = {};
    const detail = {};
    const byspell = new Map();
    for (const row of ranked) byspell.set(`${row.collection}|${row.id}`, [...(byspell.get(`${row.collection}|${row.id}`) ?? []), row]);
    for (const rows of byspell.values()) {
        rows.sort((a, b) => a.rank - b.rank);
        const [own, ...higher] = rows;
        if (!Number.isFinite(own.power)) continue;
        (ratings[own.collection] ??= {})[own.id] = tenth(own.power);
        if (own.bound) (bounds[own.collection] ??= {})[own.id] = own.bound;
        (detail[own.collection] ??= {})[own.id] = {
            rank: own.rank, boss: tenth(own.boss), group: tenth(own.group), typical: tenth(own.typical), ...(own.cantrip ? { cantrip: true } : {}), ...(own.partial ? { partial: true } : {}),
            ranks: Object.fromEntries(higher.filter((row) => Number.isFinite(row.power)).map((row) => [row.rank, tenth(row.power)])),
            vs: Object.fromEntries(Object.entries(own.vs ?? {}).map(([trait, value]) => [trait, tenth(value)]))
        };
    }
    return { ratings, bounds, detail };
}
