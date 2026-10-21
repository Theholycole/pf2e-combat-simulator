// Summons in a fight (2026-10-13, B298; the user's call: "try to get summons working in the simulator"). The ability module's `conjure` plans for
// creatures that fight: a summoned steed, Final Spite's Wights, Spider Minions, a sycophant split off by heavy damage, another of itself.
//
// Their creatures are made before the fight, as reserves: combatants of their own that wait off the field (PENDING, `reserve`) until the
// ability brings them in (the snapshot reads them: scripts/snapshot.js, tools/bestiary-abilities.mjs). As they come:
//   - "roll": they roll initiative and take their own turns (Final Spite's Wights, a rune's creature, another of itself);
//   - "maker": they act on their maker's initiative, after it (a swarm that rises from it);
//   - "minion": they act straight after their maker with two actions (PF2e's minions and summoned creatures, which act when commanded or
//     sustained); a sustained summon costs its maker an action at the start of each of its turns while they're here.
// They go when their time is up, and with their maker when the text says so. A summon set off by its maker's death or by damage on it comes
// at that moment, as a reaction. Not played (still listed as left out): merged creatures (Gestalt), markers and creatures that can't act
// (eye probes, spirit blades, Undead, Arise!'s entities, statues, phantasms), and a mount with only the numbers its text gives.
// Pure, but for the state it changes.

import { ACTIVE, DEAD, PENDING } from "./combatant.js";
import { removeFromSpace } from "./space.js";

// (A summon used once a day or once an hour is used once a fight; any other at most twice.)
const ONCE = /\bOnce (?:a|an|per) (?:day|hour)\b/i;
const MAX_RESERVES = 8;

// What to make before the fight, from a compiled `conjure` plan: { name, actions, creature, count, uses, lasts, max, oldest, initiative,
// sustained, trigger, endsWithMaker, reserveIds: [] }, or null when it isn't one the fight plays. creature: one way to find its creature —
// { from } (a link, a name or another of itself), { options } (the best of them), { pick } (the best the compendiums offer).
export function summonSpec(plan, name) {
    if (plan?.builtin !== "conjure" || plan.merge) return null;
    const first = plan.creatures?.[0] ?? null;
    let creature = null;
    if (plan.options?.length) {
        const playable = plan.options.filter((option) => option.creatures?.[0]?.from);
        if (playable.length) creature = { options: playable.map((option) => ({ label: option.label, ...option.creatures[0] })) };
    } else if (plan.pick && first) creature = { pick: plan.pick, ...first };
    else if (first?.from) creature = { ...first };
    if (!creature) return null;
    const notes = (plan.notes ?? []).join(" ");
    const counts = creature.options ? creature.options.map((option) => countMax(option.count)) : [countMax(creature.count)];
    const rounds = plan.lasts ? (plan.lasts.unit === "minutes" ? 10 * (Number(plan.lasts.value) || 1) : plan.lasts.formula ? average(plan.lasts.formula) : Number(plan.lasts.value) || null) : null;
    const initiative = (creature.options?.[0] ?? creature).initiative ?? "minion";
    return {
        name,
        actions: Number(plan.actions) || 0,
        creature,
        count: creature.options ? null : creature.count ?? 1,
        perUse: Math.max(...counts),
        uses: ONCE.test(notes) || plan.trigger ? 1 : 2,
        lasts: rounds,
        ...(Number.isFinite(plan.max) ? { max: plan.max } : {}),
        ...(plan.oldest ? { oldest: true } : {}),
        initiative: ["roll", "maker"].includes(initiative) ? initiative : "minion",
        ...(/\bSustain/i.test(notes) ? { sustained: true } : {}),
        ...(plan.trigger?.event === "death" || plan.trigger?.event === "damaged" ? { trigger: { event: plan.trigger.event, ...(plan.trigger.min ? { min: plan.trigger.min } : {}) } } : {}),
        ...(plan.endsWithMaker ? { endsWithMaker: true } : {}),
        ...(plan.pick?.rank ? { rankFrom: plan.pick.rank } : {}),
        reserveIds: []
    };
}

function countMax(count) {
    if (count?.formula) {
        const dice = /^(\d+)d(\d+)$/.exec(String(count.formula));
        return dice ? Number(dice[1]) * Number(dice[2]) : 1;
    }
    return Math.max(1, Number(count) || 1);
}

function average(formula) {
    const dice = /^(\d+)d(\d+)$/.exec(String(formula));
    return dice ? Math.round(Number(dice[1]) * (Number(dice[2]) + 1) / 2) : Number(formula) || null;
}

// A summon spell's entry (2026-10-14, spell coverage: Summon Animal, Summon Undead, Summon Fiend…; the plan's resolution.summon): the
// best rulebook creature with one of its traits at the highest level its rank allows (PF2e's summon table), one a cast, acting as a
// minion and Sustained; as many uses as the creature has casts of it (its slots; two when it casts it at will). Entries of one spell
// cast from several slots are one entry with their uses together (summonEntries).
export function spellSummonEntry(spell, uses) {
    const summon = spell?.plan?.resolution?.summon;
    if (spell?.plan?.resolution?.kind !== "summon" || !summon?.traits?.length) return null;
    const rank = Math.max(1, Math.min(10, Number(spell.castRank) || 1));
    const time = /^[123]$/.exec(String(spell.plan?.activation?.time ?? "").trim());
    return {
        name: spell.name,
        actions: time ? Number(time[0]) : 3,
        creature: { pick: { rank: { base: rank, max: rank }, any: [...summon.traits] }, count: 1 },
        count: 1,
        perUse: 1,
        uses: Math.max(1, Math.min(MAX_RESERVES, Number(uses) || 1)),
        lasts: Number(summon.durationSeconds) > 0 ? Math.max(1, Math.round(Number(summon.durationSeconds) / 6)) : 10,
        initiative: "minion",
        ...(summon.sustained ? { sustained: true } : {}),
        fromSpell: true,
        reserveIds: []
    };
}

// The summon spells' entries, one per spell name (their uses added up, at its highest rank).
export function summonEntries(entries) {
    const byName = new Map();
    for (const entry of entries.filter(Boolean)) {
        const held = byName.get(entry.name);
        if (!held) byName.set(entry.name, { ...entry });
        else {
            held.uses = Math.min(MAX_RESERVES, held.uses + entry.uses);
            if (entry.creature.pick.rank.max > held.creature.pick.rank.max) held.creature = entry.creature;
        }
    }
    return [...byName.values()];
}

// How many reserves to make for it: a use's worth for each use, at most eight.
export function reserveCount(entry) {
    return Math.min(MAX_RESERVES, entry.perUse * entry.uses);
}

// The best of a list of index entries [{ uuid, name, level, traits, type }] for a pick: its level (or up to it), one of `any` and all of `all`
// traits; the highest level, then the first by name. The summon trait's levels by rank for a pick heightened by the damage it took: its
// highest rank (the fight can't know the damage before it's dealt).
export const SUMMON_LEVELS = Object.freeze({ 1: -1, 2: 1, 3: 2, 4: 3, 5: 5, 6: 7, 7: 9, 8: 11, 9: 13, 10: 15 });
export function bestPick(entries, pick) {
    const maxLevel = Number.isFinite(pick?.maxLevel) ? pick.maxLevel : pick?.rank ? SUMMON_LEVELS[Math.min(10, pick.rank.max ?? pick.rank.base)] : null;
    const fits = entries.filter((entry) => (!entry.type || entry.type === "npc")
        && (Number.isFinite(pick?.level) ? entry.level === pick.level : maxLevel === null || entry.level <= maxLevel)
        && (!pick?.any?.length || pick.any.some((trait) => (entry.traits ?? []).includes(trait)))
        && (!pick?.all?.length || pick.all.every((trait) => (entry.traits ?? []).includes(trait))));
    return fits.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name))[0] ?? null;
}

// The best of a summon's options, by their creatures' levels times how many come: [{ index, level, count }] → the index.
export function bestOption(options) {
    return [...options].sort((a, b) => b.level * b.count - a.level * a.count)[0]?.index ?? 0;
}

// A reserve: a creature made for its maker's summon, waiting off the field until it comes.
export function asReserve(spec, maker, entry, index) {
    return { ...spec, id: `${maker.id}~${entry.name.replace(/\W+/g, "-")}~${index}`, name: `${maker.name}'s ${spec.name}${entry.perUse * entry.uses > 1 ? ` ${index + 1}` : ""}`, side: maker.side, reserve: true, summonedBy: maker.id, summons: undefined, hp: { value: spec.hp.max, max: spec.hp.max, temp: 0 }, status: undefined, arrivesRound: undefined, conditions: {} };
}

// Its reserves still waiting.
export function summonPool(state, entry) {
    return entry.reserveIds.map((id) => state.byId.get(id)).filter((c) => c && c.status === PENDING && c.reserve);
}

// Whether it can use it now: uses left, reserves waiting, and room under its limit.
// (Its uses are the fighting creature's: the snapshot's entry is shared by every fight of a batch.)
const usesOf = (c, entry) => c.summonUses?.[entry.name] ?? 0;
export function canSummon(state, c, entry) {
    if (usesOf(c, entry) >= entry.uses || !summonPool(state, entry).length) return false;
    const here = state.list.filter((other) => other.summonedBy === c.id && other.summonName === entry.name && other.status === ACTIVE).length;
    return !Number.isFinite(entry.max) || here < entry.max || entry.oldest;
}

// The ability used: its creatures come, as many as it brings (rolled when the text rolls), into the turns as it says.
export function activateSummons(state, maker, entry, { reaction = false } = {}) {
    const pool = summonPool(state, entry);
    if (!pool.length) return [];
    maker.summonUses = { ...(maker.summonUses ?? {}), [entry.name]: usesOf(maker, entry) + 1 };
    const count = Math.min(pool.length, entry.count?.formula ? rollDice(state, entry.count.formula) : Number(entry.count) || entry.perUse);
    // (Past its limit, the oldest go — Undead, Arise!; or no more come.)
    if (Number.isFinite(entry.max)) {
        const here = state.list.filter((other) => other.summonedBy === maker.id && other.summonName === entry.name && other.status === ACTIVE).sort((a, b) => a.summonedRound - b.summonedRound);
        const over = here.length + count - entry.max;
        if (over > 0 && entry.oldest) for (const old of here.slice(0, over)) dismiss(state, old);
    }
    const coming = pool.slice(0, count);
    for (const c of coming) {
        c.status = ACTIVE;
        c.side = maker.side;
        c.band = maker.band === "engaged" ? "near" : maker.band ?? "near";
        c.summonName = entry.name;
        c.summonedRound = state.round;
        if (entry.lasts) c.summonEndsRound = state.round + entry.lasts;
        if (entry.endsWithMaker) c.endsWithMaker = true;
        if (entry.initiative === "roll") state.joinInitiative?.(c);
        else {
            // On its maker's initiative, straight after it; a minion with two actions.
            if (entry.initiative === "minion") c.minionOf = maker.id;
            state.initiative?.set(c.id, state.initiative.get(maker.id) ?? 0);
            state.order = (state.order ?? []).filter((id) => id !== c.id);
            const after = state.order.indexOf(maker.id);
            const following = state.order.slice(after + 1).findIndex((id) => state.byId.get(id)?.minionOf !== maker.id && state.byId.get(id)?.summonedBy !== maker.id);
            state.order.splice(after < 0 ? state.order.length : following < 0 ? state.order.length : after + 1 + following, 0, c.id);
        }
    }
    if (reaction) maker.reactionUsed = true;
    state.stats.summons = (state.stats.summons ?? 0) + coming.length;
    state.log?.push(`  ${maker.name} uses ${entry.name}: ${coming.map((c) => c.name).join(", ")} ${coming.length === 1 ? "comes" : "come"}${entry.initiative === "roll" ? " and roll initiative" : ""}`);
    return coming;
}

function rollDice(state, formula) {
    const dice = /^(\d+)d(\d+)$/.exec(String(formula));
    if (!dice) return Number(formula) || 1;
    let total = 0;
    for (let index = 0; index < Number(dice[1]); index++) total += state.rng.die(Number(dice[2]));
    return total;
}

// One of them gone: its time up, its maker fallen, or a newer one in its place.
export function dismiss(state, c) {
    if (c.status !== ACTIVE) return;
    removeFromSpace(state, c);
    c.status = DEAD;
    c.vanished = true;
    state.order = (state.order ?? []).filter((id) => id !== c.id);
    state.log?.push(`  ${c.name} vanishes`);
}

// Its maker's turn starting: those whose time is up go; a sustained summon costs it an action while its creatures are here.
export function summonTurnStart(state, maker) {
    if (maker.minionOf) maker.actionsLeft = Math.min(maker.actionsLeft, 2);
    let sustaining = false;
    for (const c of state.list) {
        if (c.summonedBy !== maker.id || c.status !== ACTIVE) continue;
        if (c.summonEndsRound !== undefined && state.round >= c.summonEndsRound) {
            dismiss(state, c);
            continue;
        }
        if ((maker.summons ?? []).find((entry) => entry.name === c.summonName)?.sustained) sustaining = true;
    }
    if (sustaining && maker.actionsLeft > 0) {
        maker.actionsLeft -= 1;
        state.log?.push(`  ${maker.name} Sustains its summon`);
    }
}

// Its maker fallen: those that go with it go.
export function summonerFalls(state, maker) {
    for (const c of state.list) if (c.summonedBy === maker.id && c.endsWithMaker && c.status === ACTIVE) dismiss(state, c);
}

// A summon set off by its maker's death (Final Spite's horn, the cobbled bruiser's swarm), as a reaction.
export function summonsOnDeath(state, maker) {
    for (const entry of maker.summons ?? []) {
        if (entry.trigger?.event !== "death" || maker.reactionUsed || !canSummon(state, maker, entry)) continue;
        activateSummons(state, maker, entry, { reaction: true });
    }
}

// A summon set off by damage on it (a sycophant split off by 25 or more), as a reaction.
export function summonsOnDamage(state, maker, amount) {
    if (maker.status !== ACTIVE || maker.reactionUsed) return;
    for (const entry of maker.summons ?? []) {
        if (entry.trigger?.event !== "damaged" || amount < (entry.trigger.min ?? 0) || !canSummon(state, maker, entry)) continue;
        activateSummons(state, maker, entry, { reaction: true });
        return;
    }
}
