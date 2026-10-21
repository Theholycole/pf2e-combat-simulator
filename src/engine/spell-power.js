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
//   threat over a three-round fight, by its share of its side; healing (the party starts at half, so healing has room), and harm to its own
//   side, as a share of the foes' harm over the fight; over its duration (castRepeats). In levels: a fight that much smaller is that many
//   levels easier, as encounter XP goes (0.7 a level). Summons (summonShare), walls (wallShare), shields (shieldShare) and the damage a
//   utility spell's text deals (textDamageShare) have their own measures, below.
//   Its power: the average over the boss and the group, less the typical spell's of the same rank (the median; cantrips among cantrips).
//   Against a trait (undead for Sunburst; the traits its extra damage, its vitality damage or its targets name): the same with foes of that
//   trait.

import { moderateCreatureAt } from "./creature-tables.js";
import { createFightState } from "./fight.js";
import { armorClass, isActive, multipleAttackPenalty, saveModifier, strikeUsable } from "./combatant.js";
import { degreeDistribution } from "./checks.js";
import { expectedHitDamage } from "./actions.js";
import { adjustDamage, spellContext } from "./damage.js";
import { computeThreats, potentialDamage, spellDamages } from "./planner.js";
import { describeSpell, spellExpectation, spellVariants, targetSets } from "./spells.js";
import { powerReading } from "./power-readings.js";

export const POWER_KINDS = Object.freeze(["boss", "group"]);
// The choke point the ratings try area spells in: the corridor layout.
export const CHOKE = Object.freeze({ layout: "corridor" });
// The wizard's slot for the rated spell.
export const RATED_POOL = "wizard:rated";
// The rounds a fight lasts, for what conditions and spell effects are worth; the share of a fight that's as good as all of it.
export const POWER_ROUNDS = 3;
const MOST = 0.95;
const LEVEL_STEP = 0.7;

// The party's level for a rank: the lowest that casts it.
export const partyLevelForRank = (rank) => Math.max(1, Math.min(20, 2 * (Number(rank) || 1) - 1));

// Traits a foe can be given, each with what such creatures usually have (undead: the Monster Core undead's immunities; fiends and
// celestials: their weakness to holy, or unholy — 57 of the Monster Core's 73 fiends, 29 of its 37 celestials — at about its level).
const TRAIT_PACKAGES = {
    undead: { traits: ["undead", "unholy"], immunities: ["death-effects", "disease", "paralyzed", "poison", "unconscious", "bleed"] },
    fiend: { traits: ["fiend", "unholy"], immunities: [], weaknesses: ["holy"] },
    celestial: { traits: ["celestial", "holy"], immunities: [], weaknesses: ["unholy"] },
    construct: { traits: ["construct"], immunities: ["bleed", "death-effects", "disease", "doomed", "drained", "fatigued", "healing", "nonlethal", "paralyzed", "poison", "sickened", "spirit", "unconscious", "vitality", "void"] },
    elemental: { traits: ["elemental"], immunities: ["bleed", "paralyzed", "poison", "sleep"] }
};
const TRAIT_ALIASES = { unholy: "fiend", holy: "celestial" };
export const POWER_TRAITS = Object.freeze(Object.keys(TRAIT_PACKAGES));

// A weakness's usual value at a level (the Monster Core's fiends and celestials: 3 at 1st and 2nd, 5 to 8th, 10 to 14th, 15 to 20th).
const typicalWeakness = (level) => (level <= 2 ? 3 : level <= 8 ? 5 : level <= 14 ? 10 : level <= 20 ? 15 : 20);

// The foes of an encounter: kind "boss" (one, 2 levels up) or "group" (four, 2 levels down), of a trait.
export function powerFoes(kind, level, trait = null) {
    const pack = trait ? TRAIT_PACKAGES[trait] : null;
    const make = (lv, id) => {
        const foe = moderateCreatureAt(Math.max(-1, Math.min(25, lv)), id);
        return pack ? { ...foe, traits: [...pack.traits], immunities: [...pack.immunities], weaknesses: (pack.weaknesses ?? []).map((type) => ({ type, value: typicalWeakness(foe.level) })) } : foe;
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
// listed — or, without it, its text's "Heightened (+N)" and "Heightened (Nth)"; a summon heightened as its trait lists, every rank: the
// creature's level goes up with each). doc: the spell's data.
export function powerRanks(doc) {
    const base = Math.max(1, Math.min(10, Number(doc?.system?.level?.value) || 1));
    const ranks = new Set([base]);
    const heightening = doc?.system?.heightening;
    const text = String(doc?.system?.description?.value ?? "");
    if ((doc?.system?.traits?.value ?? []).includes("summon") && /Heightened(?:<\/strong>)?\s*As listed/i.test(text)) {
        for (let rank = base + 1; rank <= 10; rank++) ranks.add(rank);
    } else if (heightening?.type === "interval" && Number(heightening.interval) > 0) {
        for (let rank = base + Number(heightening.interval); rank <= 10; rank += Number(heightening.interval)) ranks.add(rank);
    } else if (heightening?.type === "fixed" && heightening.levels) {
        for (const rank of Object.keys(heightening.levels)) if (Number(rank) > base && Number(rank) <= 10) ranks.add(Number(rank));
    } else {
        const every = /Heightened \(\+(\d+)\)/i.exec(text);
        if (every) for (let rank = base + Number(every[1]); rank <= 10; rank += Number(every[1])) ranks.add(rank);
        for (const match of text.matchAll(/Heightened \((\d+)(?:st|nd|rd|th)\)/gi)) if (Number(match[1]) > base && Number(match[1]) <= 10) ranks.add(Number(match[1]));
    }
    return [...ranks].sort((a, b) => a - b);
}

// The traits a spell does more against (or works only against): its extra damage's, vitality damage's (undead), a holy spell's (fiends,
// weak to it) and an unholy one's (celestials), and its targets'.
export function powerConditions(plan) {
    const traits = new Set();
    if ((plan?.traits ?? []).includes("holy")) traits.add("fiend");
    if ((plan?.traits ?? []).includes("unholy")) traits.add("celestial");
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

// The Hit Points the foes can be expected to take off side over the fight: each one's damage potential a round (the planner's: its best
// Strikes, or a spell or ability while it has them), over POWER_ROUNDS. Hit Points on the party's side are measured against it — healing
// a tenth of it is as good as a tenth of the foes gone.
export function foeHarm(state, side) {
    return damageRate(state, (c) => c.side !== side) * POWER_ROUNDS;
}

// The damage creatures (those `which` takes) can be expected to do a round: each one's damage potential, the planner's.
export function damageRate(state, which) {
    if (!state.potential) computeThreats(state);
    return state.list.filter((c) => isActive(c) && which(c)).reduce((sum, c) => sum + (state.potential.get(c.id) ?? 0), 0);
}

// The rounds a fight lasts, about: the foes' Hit Points at side's damage a round, from one round to POWER_ROUNDS.
export function fightRounds(state, side) {
    const foeHp = state.list.filter((c) => c.side !== side && isActive(c)).reduce((sum, c) => sum + Math.max(0, c.hp.value), 0);
    const rate = damageRate(state, (c) => c.side === side);
    return rate > 0 ? Math.max(1, Math.min(POWER_ROUNDS, foeHp / rate)) : POWER_ROUNDS;
}

// --- Duration (2026-10-21, the user: "Make sure to rate spells based on their duration too so you dont give walls a bad rating by
// evaluating effects upon cast only") ---------------------------------------------------------------------------------------------------

// The rounds of the fight a spell lasts: its duration, up to POWER_ROUNDS (Sustained: all of them); 1 for an instant one, or one whose
// outcome or text says (its conditions carry their own).
export function durationRounds(plan) {
    const spec = plan?.lifecycle?.durationSpec;
    if (plan?.lifecycle?.sustained || ["sustained", "unlimited", "daily-preparations"].includes(spec?.mode)) return POWER_ROUNDS;
    if (spec?.mode === "fixed" || spec?.mode === "turn-boundary") {
        const per = { rounds: 1, minutes: 10 }[spec.unit] ?? (spec.unit ? Infinity : 1);
        return Math.max(1, Math.min(POWER_ROUNDS, (Number(spec.value) || 1) * per));
    }
    return 1;
}

// How much more a cast does over its duration, in casts, in a fight of `rounds` rounds: a lingering area's effect again each round it
// lasts, as often as foes stay in it (half the time; a quarter for one that acts only as they enter; three quarters for one the caster aims
// each Sustain; in a choke point, every time — they can't go around it); a spell Sustained to strike again, or used again each turn, once more a round (once more in all, one that must recharge).
export function castRepeats(plan, rounds = POWER_ROUNDS, { choke = false } = {}) {
    const fight = Math.max(1, Math.min(POWER_ROUNDS, rounds));
    let again = 0;
    const lingering = plan?.resolution?.lingering;
    if (lingering?.events?.length) {
        const lasts = Math.max(1, Math.min(fight, Math.floor((Number(lingering.durationSeconds) || 0) / 6)));
        // (In a choke point the foes can't go around it: all of them, every time, as they come.)
        const stay = choke ? 1 : lingering.events.includes("sustain") ? 0.75 : lingering.events.every((event) => event === "enter") ? 0.25 : 0.5;
        again = Math.max(again, (lasts - 1) * stay);
    }
    const repeatable = plan?.resolution?.repeatable;
    let more = 0;
    if (["sustain", "duration"].includes(repeatable?.window)) more = Math.min(fight, durationRounds(plan)) - 1;
    else if (repeatable?.window === "subsequent-turns") more = Math.min(fight - 1, Number(repeatable.attacks) || 1);
    if (repeatable?.recharge) more = Math.min(1, more);
    return Math.max(again, more);
}

// A cast's expectation ([{ target, damage, worth, heal, benefit }], spellExpectation's) as a share of the fight for side: damage over the
// foes' Hit Points; conditions on a foe, and spell effects on an ally, in rounds of its threat over the fight's rounds, by its share of its
// side (of allies: one of them); healing, and damage on its own side, over the foes' harm. Over its duration (again, castRepeats'): its
// damage and healing each time it comes, up to what the creature has, or lacks; conditions and spell effects half as much again each time,
// as some are on still. { share, alliesHit }.
export function entriesShare(entries, { side, foeHp, harm, allies, again = 0 }) {
    let share = 0;
    let alliesHit = 0;
    for (const { target, damage = 0, worth = 0, heal = 0, benefit = 0 } of entries) {
        const foe = target.side !== side;
        if (!foe && damage > 0) alliesHit++;
        const part = foe ? target.hp.max / foeHp : 1 / Math.max(1, allies);
        const sign = foe ? 1 : -1;
        const lasting = 1 + again / 2;
        const dealt = Math.min(Math.max(0, damage) * (1 + again), Math.max(0, target.hp.value));
        const healed = Math.min(Math.max(0, heal) * (1 + again), Math.max(0, target.hp.max - Math.max(0, target.hp.value)));
        share += foe ? dealt / foeHp : -dealt / harm;
        share += sign * Math.min(POWER_ROUNDS, worth * lasting) * part / POWER_ROUNDS;
        share -= sign * benefit * lasting * part / POWER_ROUNDS;
        share += foe ? -healed / foeHp : healed / harm;
    }
    return { share, alliesHit };
}

// One cast of entry (the rated spell) by the party's wizard into foes: { share, levels, bound, actions, targets, alliesHit? } at its best
// (below zero when its area can't help catching allies, and hurts them more than the foes), or null when it can do nothing there. The party starts at half its Hit Points; everyone stands in the near band, a touch spell's target within reach.
// choke (2026-10-21, the user: "add choke points to simulate situations where area spells are forced to be interacted with vs being able to
// stride around"): the same fights in a 10-foot corridor on the grid (grid.js's), the foes coming down it — an area catches whoever its
// template covers there, and a lingering one is crossed by every foe.
// minion: a creature of the wizard's already out, as hurt as the party (a spell on one's minion, companion or eidolon — the user: "minion
// spells assuming you already have a minion out"), the one ally the spell can go to; lost: the spell spends it (Final Sacrifice explodes
// it), what it would have done the rest of the fight taken off (summonShare).
export function castPower(party, foes, entry, { minion = null, lost = false, choke = false } = {}) {
    const helper = minion ? [{ ...minion, id: "minion", side: "party", kind: "npc", reserve: false, summons: undefined, minion: true, controlledBy: "wizard" }] : [];
    const combatants = [...[...partyWithSpell(party, entry), ...helper].map((c) => ({ ...c, hp: { ...c.hp, value: Math.ceil(c.hp.max / 2) } })), ...foes];
    const state = createFightState({ combatants }, { morale: false, retreat: false, ...(choke ? { grid: CHOKE } : {}) }, 1);
    const caster = state.byId.get("wizard");
    const spell = (caster?.spells ?? []).find((each) => each.name === entry.name && (each.pool ?? null) === (entry.pool ?? null));
    if (!spell) return null;
    const enemies = state.list.filter((c) => c.side !== caster.side && isActive(c));
    const allies = state.list.filter((c) => c.side === caster.side && isActive(c));
    const aimed = minion ? allies.filter((c) => c.id === "minion") : allies;
    const foeHp = enemies.reduce((sum, c) => sum + c.hp.max, 0);
    if (!(foeHp > 0)) return null;
    const harm = foeHarm(state, caster.side);
    const again = castRepeats(spell.plan, fightRounds(state, caster.side), { choke });
    let best = null;
    for (const actions of spellVariants(spell)) {
        let sets = [];
        try {
            // (A touch spell reaches its target: the wizard steps up to cast it.)
            sets = targetSets(state, caster, spell, { enemies, allies: aimed, inMelee: () => true, distance: () => 30, meleeId: null }, actions);
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
            const { share, alliesHit } = entriesShare(entries, { side: caster.side, foeHp, harm, allies: allies.length, again });
            if (!best || share > best.share) best = { share, actions: actions ?? describeSpell(spell.plan).actions ?? null, targets: set.targets.length, ...(alliesHit ? { alliesHit } : {}) };
        }
    }
    if (best && minion && lost) best.share -= summonShare(partyWithSpell(party), foes, minion)?.share ?? 0;
    // (Nothing at all: none. Worse than nothing — an area that catches allies standing near the caster, their Hit Points counted against
    // it as the foes' would be: below zero.)
    if (!best || !best.share || !(best.share > 0 || best.alliesHit)) return null;
    return { ...best, ...shareToLevels(best.share) };
}

// One cast of a spell the engine can't cast in a fight, as its reading has it (power-readings.js, 2026-10-21): the same fights and the same
// share as castPower's. { share, levels, bound, actions, targets }, or null when the reading finds nothing it does.
export function readingPower(party, foes, entry, { choke = false } = {}) {
    const read = powerReading(entry.plan);
    if (!read) return null;
    const combatants = [...partyWithSpell(party).map((c) => ({ ...c, hp: { ...c.hp, value: Math.ceil(c.hp.max / 2) } })), ...foes];
    const state = createFightState({ combatants }, { morale: false, retreat: false }, 1);
    const caster = state.byId.get("wizard");
    if (!caster) return null;
    const enemies = state.list.filter((c) => c.side !== caster.side && isActive(c));
    const allies = state.list.filter((c) => c.side === caster.side && isActive(c));
    const foeHp = enemies.reduce((sum, c) => sum + c.hp.max, 0);
    if (!(foeHp > 0)) return null;
    const actions = describeSpell(entry.plan).actions ?? null;
    const found = read({ state, caster, enemies, allies, entry, rank: Number(entry.castRank) || 1, rounds: fightRounds(state, caster.side), actions, choke });
    const harm = foeHarm(state, caster.side);
    let best = null;
    for (const option of found?.options ?? (found ? [found] : [])) {
        if (!option?.entries?.length) continue;
        const { share, alliesHit } = entriesShare(option.entries, { side: caster.side, foeHp, harm, allies: allies.length });
        if (!best || share > best.share) best = { share, alliesHit, actions: option.actions ?? found.actions ?? actions, targets: option.targets ?? option.entries.length };
    }
    if (!best || !best.share || !(best.share > 0 || best.alliesHit)) return null;
    return { share: best.share, ...shareToLevels(best.share), actions: best.actions, targets: best.targets };
}

// --- Summons (2026-10-21, the user: "get the simulator to run summons picking the best possible summoned creature") -------------------

// The damage a creature's Strikes can be expected to do to a target in a round of `attacks` Strikes (its best one, the multiple attack
// penalty counted).
export function strikeRound(attacker, target, attacks = 2) {
    let best = 0;
    const ac = armorClass(target);
    for (const strike of attacker.strikes ?? []) {
        if (!strikeUsable(attacker, strike)) continue;
        const hit = expectedHitDamage(attacker, strike, target, false);
        const crit = expectedHitDamage(attacker, strike, target, true);
        let total = 0;
        for (let attack = 0; attack < attacks; attack++) {
            const odds = degreeDistribution(strike.bonus - multipleAttackPenalty(strike, attack), ac);
            total += odds[2] * hit + odds[3] * crit;
        }
        best = Math.max(best, total);
    }
    return best;
}

// The share of its rounds a summoned creature fights: it acts as it comes (its two actions), the first round partly spent closing in, then
// each round it's Sustained.
export const SUMMON_ROUNDS = POWER_ROUNDS - 0.5;

// What summoned creatures (creature, count of them) are worth to the party against foes, as a share of the fight: their damage a round
// (the planner's damage potential at two actions — two Strikes, or a spell or ability it has, a breath weapon as it recharges) as a share
// of the party's with it, the fight that much shorter; and the foes' attacks they draw as more bodies on the party's side, up to their Hit
// Points, against the foes' harm. { share, levels, bound, targets }, or null for one that does nothing.
export function summonShare(party, foes, creature, count = 1) {
    const summoned = Array.from({ length: count }, (_, index) => ({ ...creature, id: `summoned-${index}`, side: "party", kind: "npc", reserve: false, summons: undefined }));
    const state = createFightState({ combatants: [...party, ...summoned, ...foes] }, { morale: false, retreat: false }, 1);
    const enemies = state.list.filter((c) => c.side !== "party" && isActive(c));
    const helpers = state.list.filter((c) => c.id.startsWith("summoned-"));
    const side = state.list.filter((c) => c.side === "party" && isActive(c)).length;
    const harm = foeHarm(state, "party");
    if (!helpers.length || !enemies.length) return null;
    const own = damageRate(state, (c) => c.side === "party" && !c.id.startsWith("summoned-"));
    const drawn = harm / POWER_ROUNDS * SUMMON_ROUNDS / Math.max(1, side);
    let rate = 0;
    let soaked = 0;
    for (const helper of helpers) {
        rate += potentialDamage(helper, spellDamages(state, helper, enemies[0]), strikeRound(helper, enemies[0], 2)) * SUMMON_ROUNDS / POWER_ROUNDS;
        soaked += Math.min(helper.hp.max, drawn);
    }
    const share = (rate > 0 ? rate / (own + rate) : 0) + (harm > 0 ? soaked / harm : 0);
    return share > 0 ? { share, ...shareToLevels(share), targets: helpers.length } : null;
}

// --- Battle forms (2026-10-21, can't-cast spells): the wizard in the form, valued as a summon that takes its place -----------------

// A battle form's AC for a creature of a level (PF2e's formula "16 + @actor.level", or a number).
export function formAC(form, level) {
    const text = String(form?.ac ?? "").replace(/@actor\.level/g, String(Number(level) || 0));
    if (!/^[\d\s+\-*()]+$/.test(text)) return null;
    const parts = text.match(/[+-]?\s*\d+/g) ?? [];
    return parts.reduce((sum, part) => sum + Number(part.replace(/\s+/g, "")), 0) || null;
}

// What casting a battle form (form: battleFormAt's) is worth to the party against foes, as a share of the fight: the wizard's Strikes in
// it a round (its best two — Striding in, the first round partly spent) in place of its own damage a round (its cantrips, given up), as a
// share of the party's; its temporary Hit Points, and the foes' hits a better AC keeps off it (its share of their attacks, one of its
// side's), against the foes' harm. { share, levels, bound, targets }, or null when it does nothing more.
export function formShare(party, foes, form) {
    if (!form?.strikes?.length) return null;
    const state = createFightState({ combatants: [...partyWithSpell(party).map((c) => ({ ...c, hp: { ...c.hp, value: Math.ceil(c.hp.max / 2) } })), ...foes] }, { morale: false, retreat: false }, 1);
    const wizard = state.byId.get("wizard");
    const enemies = state.list.filter((c) => c.side !== "party" && isActive(c));
    if (!wizard || !enemies.length) return null;
    const harm = foeHarm(state, "party");
    const side = state.list.filter((c) => c.side === "party" && isActive(c)).length;
    const own = damageRate(state, (c) => c.side === "party" && c.id !== "wizard");
    const before = state.potential?.get("wizard") ?? 0;
    const ac = Math.max(armorClass(wizard), formAC(form, wizard.level) ?? 0);
    const shaped = { ...wizard, ac, strikes: form.strikes.map((strike) => ({ name: strike.name, bonus: Math.max(strike.bonus, 0), melee: strike.melee, agile: strike.traits.includes("agile"), traits: strike.traits, damage: [{ dice: strike.dice, die: strike.die, bonus: strike.damageBonus, type: strike.type }] })) };
    const rate = enemies.reduce((best, enemy) => Math.max(best, strikeRound(shaped, enemy, 2)), 0) * SUMMON_ROUNDS / POWER_ROUNDS;
    const gain = rate - before;
    const kept = ac > armorClass(wizard) ? enemies.reduce((sum, enemy) => sum + strikeRound(enemy, wizard, 2) - strikeRound(enemy, { ...wizard, ac }, 2), 0) * SUMMON_ROUNDS / Math.max(1, side) : 0;
    const share = gain / Math.max(1e-9, own + Math.max(rate, before)) + (harm > 0 ? (Math.min(form.tempHp, wizard.hp.max) + kept) / harm : 0);
    return share > 0 ? { share, ...shareToLevels(share), actions: null, targets: 1 } : null;
}

// --- Walls (2026-10-21, the user: "walls and shield"): the simulator doesn't play them — a rule of thumb, over the wall's duration ------

// Of the foes, the share a wall put between them and the party stands in the way of (a line 60 feet long, or a ring, cast where they'd
// come).
const WALL_PAST = 0.75;

// A wall's kind, from its plan and text: "hinder" (creatures cross it slowly — damage each move into it, difficult terrain, water to Swim
// through), "barrier" (it stops them until they go around or break through: it has Hardness or Hit Points), "damaging" (they cross it,
// hurt), "screen" (it only hides).
export function wallKind(plan, text = "") {
    const wall = plan?.resolution?.damagingWall?.control;
    if (wall?.perAction) return "hinder";
    if (/\bhardness\b|\bHit Points\b/i.test(text)) return "barrier";
    if (/difficult terrain|\bSwim through\b/i.test(text)) return "hinder";
    if (wall) return "damaging";
    if (/\b(?:blocks? (?:movement|creatures)|can't (?:pass|move) through|impassable|solid)\b/i.test(text)) return "barrier";
    return "screen";
}

// What a wall (entry, of kind) is worth against foes, as a share of the fight. It's raised between the party and the foes as the fight
// starts, in the way of most of them (WALL_PAST): a barrier costs each of those a round going around or through it (while it lasts, up to
// one), a hindering wall an action crossing it and its damage each of the two moves through it, a damaging wall its damage as they cross
// it and a tenth of a round (it hides the party), a screen that tenth only. Its damage at its rank, by each foe's weaknesses and
// resistances.
export function wallShare(party, foes, entry, kind, { choke = false } = {}) {
    const state = createFightState({ combatants: [...partyWithSpell(party), ...foes] }, { morale: false, retreat: false }, 1);
    const enemies = state.list.filter((c) => c.side !== "party" && isActive(c));
    const foeHp = enemies.reduce((sum, c) => sum + c.hp.max, 0);
    if (!(foeHp > 0)) return null;
    const wall = entry.plan?.resolution?.damagingWall?.control;
    const rank = Number(entry.castRank) || Number(entry.plan?.resolution?.damagingWall?.baseRank) || 1;
    const base = Number(entry.plan?.resolution?.damagingWall?.baseRank) || rank;
    const dice = wall ? (Number(wall.count) || 0) + (wall.step ? Math.floor(Math.max(0, rank - base) / (Number(wall.step.interval) || 1)) * (Number(wall.step.dice) || 0) : 0) : 0;
    const context = spellContext(entry, { isSpell: true, area: true });
    // (In a choke point: across it, in the way of every foe — a barrier keeps them two rounds, breaking through.)
    const past = choke ? 1 : WALL_PAST;
    const lasts = Math.min(choke ? 2 : 1, durationRounds(entry.plan));
    let share = 0;
    for (const foe of enemies) {
        const part = foe.hp.max / foeHp;
        const hurt = wall && dice ? adjustDamage(foe, [{ type: wall.type, amount: dice * ((Number(wall.faces) || 0) + 1) / 2, persistent: false, context }]).total : 0;
        let worth = 0;
        let damage = 0;
        if (kind === "barrier") worth = past * lasts;
        else if (kind === "hinder") {
            worth = past / 3;
            damage = past * hurt * (wall?.perAction ? 2 : 1);
        } else if (kind === "damaging") {
            worth = past * 0.1;
            damage = past * hurt;
        } else worth = past * 0.1;
        share += Math.min(damage, Math.max(0, foe.hp.value)) / foeHp + worth * part / POWER_ROUNDS;
    }
    return share > 0 ? { share, ...shareToLevels(share), actions: describeSpell(entry.plan).actions ?? null, targets: enemies.length } : null;
}

// --- Text (2026-10-21, the user: "utility spells"): a spell the simulator reads only as text, rated from it where its fight effect is
// plain damage ---------------------------------------------------------------------------------------------------------------------------

// What damage from a spell's text ({ dice, faces, bonus, type, save: "reflex" | "fortitude" | "will" | null, attack, targets }) does to
// foes, as a share of the fight: at each foe's basic save against the caster's spell DC (or its spell attack against AC; else in full),
// by its weaknesses and resistances, up to its Hit Points — every foe in an area (targets Infinity), else as many as it names.
export function textDamageShare(party, foes, entry, damage) {
    const state = createFightState({ combatants: [...partyWithSpell(party), ...foes] }, { morale: false, retreat: false }, 1);
    const enemies = state.list.filter((c) => c.side !== "party" && isActive(c));
    const foeHp = enemies.reduce((sum, c) => sum + c.hp.max, 0);
    if (!(foeHp > 0) || !(damage?.dice > 0)) return null;
    const amount = damage.dice * ((Number(damage.faces) || 0) + 1) / 2 + (Number(damage.bonus) || 0);
    const context = spellContext(entry, { isSpell: true, area: !Number.isFinite(damage.targets) });
    const hit = enemies.map((foe) => {
        const full = adjustDamage(foe, [{ type: damage.type ?? "untyped", amount, persistent: false, context }]).total;
        let times = 1;
        if (damage.save) {
            const [critFail, fail, success] = degreeDistribution(saveModifier(foe, damage.save), Number(entry.dc) || 10);
            times = 2 * critFail + fail + 0.5 * success;
        } else if (damage.attack) {
            const odds = degreeDistribution(Number(entry.attack) || 0, armorClass(foe));
            times = odds[2] + 2 * odds[3];
        }
        return { foe, dealt: Math.min(full * times, Math.max(0, foe.hp.value)) };
    }).sort((a, b) => b.dealt - a.dealt).slice(0, Number.isFinite(damage.targets) ? Math.max(1, damage.targets) : Infinity);
    const share = hit.reduce((sum, { dealt }) => sum + dealt, 0) / foeHp;
    return share > 0 ? { share, ...shareToLevels(share), actions: describeSpell(entry.plan).actions ?? null, targets: hit.length } : null;
}

// --- Shield (the cantrip, and spells like it: a spell shield raised) -------------------------------------------------------------------

// What a spell shield ({ ac, hardness, hp }) raised is worth to the caster over `rounds` rounds, as a share of the fight: the foes' Strikes
// at it less likely to hit (its share of their attacks, one of its side's), and a Shield Block a round — a hit's damage less, up to the
// hardness, as likely as it's hit that round — while the shield's Hit Points last; against the foes' harm.
export function shieldShare(party, foes, shield, rounds = 1) {
    const state = createFightState({ combatants: [...partyWithSpell(party).map((c) => ({ ...c, hp: { ...c.hp, value: Math.ceil(c.hp.max / 2) } })), ...foes] }, { morale: false, retreat: false }, 1);
    const wizard = state.byId.get("wizard");
    const enemies = state.list.filter((c) => c.side !== "party" && isActive(c));
    const side = state.list.filter((c) => c.side === "party" && isActive(c)).length;
    const harm = foeHarm(state, "party");
    if (!wizard || !enemies.length || !(harm > 0)) return null;
    const hardness = Number(shield.hardness) || 0;
    const bare = enemies.reduce((sum, enemy) => sum + strikeRound(enemy, wizard, 2), 0);
    wizard.shield = { name: "Shield", ac: Number(shield.ac) || 1, hardness, hp: 1e9, maxHp: 1e9, bt: 0, raised: true, broken: false, spell: true };
    const raised = enemies.reduce((sum, enemy) => sum + strikeRound(enemy, wizard, 2), 0);
    let hits = 0;
    let perHit = 0;
    for (const enemy of enemies) {
        const strike = (enemy.strikes ?? []).filter((each) => strikeUsable(enemy, each)).sort((a, b) => b.bonus - a.bonus)[0];
        if (!strike) continue;
        for (let attack = 0; attack < 2; attack++) {
            const odds = degreeDistribution(strike.bonus - multipleAttackPenalty(strike, attack), armorClass(wizard));
            hits += odds[2] + odds[3];
        }
        perHit = Math.max(perHit, expectedHitDamage(enemy, strike, wizard, false));
    }
    const lasts = Math.max(1, Math.min(POWER_ROUNDS, rounds));
    const blocks = Number.isFinite(Number(shield.hp)) ? Math.max(1, Math.ceil(Number(shield.hp) / Math.max(1, perHit - hardness))) : Infinity;
    const blocked = Math.min(1, hits / Math.max(1, side)) * Math.min(hardness, perHit) * Math.min(lasts, blocks);
    const share = (lasts * (bare - raised) / Math.max(1, side) + blocked) / harm;
    return share > 0 ? { share, ...shareToLevels(share), actions: 1, targets: 1 } : null;
}

const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

// Screen rows { collection, id, name, rank, cantrip, level, traits, results: { "<encounter>|<trait or ''>": { share, levels, bound } }, and
// a summon's creature and creatures: { "<trait>": its best against them } } →
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
// (heightened), vs: { "<trait>": power }, creature? (a summon's best), creatures? { "<trait>": its best against them }, summons? { "<rank>":
// its best heightened }, estimate? (what the simulator doesn't play, rated by a rule of thumb: "shield", "wall (<kind>)", "text damage",
// "terrain"), minion? (cast on a minion already out), alliesHit? (its area catches allies near the caster) } } }.
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
            vs: Object.fromEntries(Object.entries(own.vs ?? {}).map(([trait, value]) => [trait, tenth(value)])),
            ...(own.creature ? { creature: own.creature, ...(Object.keys(own.creatures ?? {}).length ? { creatures: own.creatures } : {}) } : {}),
            ...(higher.some((row) => row.creature) ? { summons: Object.fromEntries(higher.filter((row) => row.creature && Number.isFinite(row.power)).map((row) => [row.rank, row.creature])) } : {}),
            ...(own.estimate ? { estimate: own.estimate } : {}),
            ...(own.minion ? { minion: true } : {}),
            ...(POWER_KINDS.some((kind) => own.results?.[`${kind}|`]?.alliesHit) ? { alliesHit: true } : {})
        };
    }
    return { ratings, bounds, detail };
}
