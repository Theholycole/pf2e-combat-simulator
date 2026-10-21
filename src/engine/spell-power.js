// A spell's power for its rank (2026-10-21, the user: "rate spells and give them a score just like creatures. be sure to include
// different scores for heightened versions if significantly different as well as a conditional score for spells that sometimes do more such
// as Sunburst doing more damage against undead"; their choices: in the party caster's hands, against a boss and a group, every installed
// spell compendium; then, the fights' numbers proving noisy and shaped by the AI's play, "Effect of one cast"). Pure.
//   One cast: the wizard of the standard party (src/engine/party.js) at the lowest level that casts the rank (2 × rank − 1), with its spell
//   DC and attack, casts the spell once into two moderate encounters standing in the near band — a boss (one creature 2 levels above the
//   party) and a group (four creatures 2 levels below) — at its best: the target set and action count that do the most. What it does is the
//   simulator's own expectation of it (spells.js spellExpectation: saves against its DC, resistances and immunities, heightened damage, extra
//   damage by a target's traits, conditions and spell effects at the simulator's worth for them).
//   Its share of the fight: damage as a share of the foes' Hit Points; conditions on a foe, and spell effects on an ally, in rounds of its
//   threat over a three-round fight, by its share of its side; healing as Hit Points (the party starts at half, so healing has room), counted
//   like damage; harm to its own side taken off; a lingering area half as much again, as the planner counts it. In levels: a fight that
//   much smaller is that many levels easier, as encounter XP goes (0.7 a level).
//   Its power: the average over the boss and the group, less the typical spell's of the same rank (the median; cantrips among cantrips).
//   Against a trait (undead for Sunburst; the traits its extra damage, its vitality damage or its targets name): the same with foes of that
//   trait.

import { moderateCreatureAt } from "./creature-tables.js";
import { createFightState } from "./fight.js";
import { isActive } from "./combatant.js";
import { describeSpell, spellExpectation, spellVariants, targetSets } from "./spells.js";

export const POWER_KINDS = Object.freeze(["boss", "group"]);
// The wizard's slot for the rated spell.
export const RATED_POOL = "wizard:rated";
// The rounds a fight lasts, for what conditions and spell effects are worth; the share of a fight that's as good as all of it.
export const POWER_ROUNDS = 3;
const MOST = 0.95;
const LEVEL_STEP = 0.7;

// The party's level for a rank: the lowest that casts it.
export const partyLevelForRank = (rank) => Math.max(1, Math.min(20, 2 * (Number(rank) || 1) - 1));

// Traits a foe can be given, each with what such creatures usually have (undead: the Monster Core undead's immunities).
const TRAIT_PACKAGES = {
    undead: { traits: ["undead", "unholy"], immunities: ["death-effects", "disease", "paralyzed", "poison", "unconscious", "bleed"] },
    fiend: { traits: ["fiend", "unholy"], immunities: [] },
    celestial: { traits: ["celestial", "holy"], immunities: [] },
    construct: { traits: ["construct"], immunities: ["bleed", "death-effects", "disease", "doomed", "drained", "fatigued", "healing", "nonlethal", "paralyzed", "poison", "sickened", "spirit", "unconscious", "vitality", "void"] },
    elemental: { traits: ["elemental"], immunities: ["bleed", "paralyzed", "poison", "sleep"] }
};
const TRAIT_ALIASES = { unholy: "fiend", holy: "celestial" };
export const POWER_TRAITS = Object.freeze(Object.keys(TRAIT_PACKAGES));

// The foes of an encounter: kind "boss" (one, 2 levels up) or "group" (four, 2 levels down), of a trait.
export function powerFoes(kind, level, trait = null) {
    const pack = trait ? TRAIT_PACKAGES[trait] : null;
    const make = (lv, id) => {
        const foe = moderateCreatureAt(Math.max(-1, Math.min(25, lv)), id);
        return pack ? { ...foe, traits: [...pack.traits], immunities: [...pack.immunities] } : foe;
    };
    if (kind === "boss") return [make(level + 2, "monster")];
    return [0, 1, 2, 3].map((index) => make(level - 2, index ? `monster-${index}` : "monster"));
}

// The party with the wizard's slot spells taken away — its cantrips and basic actions kept, as a caster always has them. With entry: that
// spell as one cast more; a cantrip in place of the wizard's own.
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

// A share of a fight as levels: that much smaller is that many levels easier (0.7 a level); "atLeast" from MOST of it on.
export function shareToLevels(share) {
    const capped = Math.min(MOST, share);
    return { levels: Math.log(1 - capped) / Math.log(LEVEL_STEP), bound: share >= MOST ? "atLeast" : null };
}

// One cast of entry (the rated spell) by the party's wizard into foes: { share, levels, bound, actions, targets } at its best, or null when it
// can do nothing there. The party starts at half its Hit Points; everyone stands in the near band, a touch spell's target within reach.
export function castPower(party, foes, entry) {
    const combatants = [...partyWithSpell(party, entry).map((c) => ({ ...c, hp: { ...c.hp, value: Math.ceil(c.hp.max / 2) } })), ...foes];
    const state = createFightState({ combatants }, { morale: false, retreat: false }, 1);
    const caster = state.byId.get("wizard");
    const spell = (caster?.spells ?? []).find((each) => each.name === entry.name && (each.pool ?? null) === (entry.pool ?? null));
    if (!spell) return null;
    const enemies = state.list.filter((c) => c.side !== caster.side && isActive(c));
    const allies = state.list.filter((c) => c.side === caster.side && isActive(c));
    const foeHp = enemies.reduce((sum, c) => sum + c.hp.max, 0);
    if (!(foeHp > 0)) return null;
    const lingering = spell.plan?.resolution?.lingering?.events?.length && (Number(spell.plan.resolution.lingering.durationSeconds) || 0) >= 12 ? 1.5 : 1;
    let best = null;
    for (const actions of spellVariants(spell)) {
        let sets = [];
        try {
            // (A touch spell reaches its target: the wizard steps up to cast it.)
            sets = targetSets(state, caster, spell, { enemies, allies, inMelee: () => true, distance: () => 30, meleeId: null }, actions);
        } catch {
            sets = [];
        }
        for (const set of sets) {
            let entries = [];
            try {
                entries = spellExpectation(state, caster, spell, set.targets, 0, actions);
            } catch {
                entries = [];
            }
            let share = 0;
            for (const { target, damage = 0, worth = 0, heal = 0, benefit = 0 } of entries) {
                const foe = target.side !== caster.side;
                const part = foe ? target.hp.max / foeHp : 1 / Math.max(1, allies.length);
                const sign = foe ? 1 : -1;
                share += sign * Math.min(Math.max(0, damage), Math.max(0, target.hp.value)) / foeHp;
                share += sign * worth * part / POWER_ROUNDS;
                share -= sign * benefit * part / POWER_ROUNDS;
                share -= sign * Math.max(0, heal) / foeHp;
            }
            share *= lingering;
            if (!best || share > best.share) best = { share, actions: actions ?? describeSpell(spell.plan).actions ?? null, targets: set.targets.length };
        }
    }
    if (!best || !(best.share > 0)) return null;
    return { ...best, ...shareToLevels(best.share) };
}

const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

// Screen rows { collection, id, name, rank, cantrip, level, traits, results: { "<encounter>|<trait or ''>": { share, levels, bound } } } →
// each spell rank's { …, boss, group, value, bound, power, vs: { <trait>: power }, typical }: levels a cast makes each fight easier, their
// average, and power relative to the typical spell (cantrip) of its rank. A spell that does nothing in either fight, or against its traits'
// foes, gets none.
export function rankSpells(rows) {
    const rated = [];
    for (const row of rows) {
        if (row.error || row.skipped) continue;
        const parts = Object.fromEntries(POWER_KINDS.map((kind) => [kind, row.results?.[`${kind}|`]?.levels ?? null]));
        const traitHelps = (row.traits ?? []).some((trait) => POWER_KINDS.some((kind) => row.results?.[`${kind}|${trait}`]));
        if (POWER_KINDS.every((kind) => parts[kind] === null) && !traitHelps) continue;
        const bound = POWER_KINDS.some((kind) => row.results?.[`${kind}|`]?.bound === "atLeast") ? "atLeast" : null;
        const vs = {};
        for (const trait of row.traits ?? []) {
            const values = POWER_KINDS.map((kind) => row.results?.[`${kind}|${trait}`]?.levels ?? 0);
            vs[trait] = (values[0] + values[1]) / 2;
        }
        const boss = parts.boss ?? 0;
        const group = parts.group ?? 0;
        rated.push({ ...row, boss, group, value: (boss + group) / 2, bound, vs });
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

// The compendium numbers (src/data/spell-ratings.json): ratings { "<compendium id>": { "<item id>": power at its own rank } }, bounds
// ("atLeast"), and detail { "<compendium id>": { "<item id>": { rank, boss, group, typical, cantrip?, partial?, ranks: { "<rank>": power }
// (heightened), vs: { "<trait>": power } } }.
export function spellRatingsOf(ranked) {
    const ratings = {};
    const bounds = {};
    const detail = {};
    const bySpell = new Map();
    for (const row of ranked) bySpell.set(`${row.collection}|${row.id}`, [...(bySpell.get(`${row.collection}|${row.id}`) ?? []), row]);
    for (const rows of bySpell.values()) {
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
