// Calm and the charm spells (2026-10-14; the user: "Spells like shield, Wails of the damned, evil eye, calm"): the spell module's
// "No hostile actions" notes as a state the engine plays. Calm: no hostile actions at all, and any hostility toward the creature
// ends it (a critical failure: nothing does). Charm, Charming Touch, Charming Push, Kiss the Ring, Debilitating Terror, Glimmer of
// Charm: none against the caster; Charm ends when the caster turns hostile to it, Glimmer of Charm when the caster does to it or its
// allies. The entries are c.pacified: [{ by, spell, all, endsOn, allies, untilRound, sustained }].

import { endEntries, lastingRounds } from "./lasting.js";

const HOSTILE_NOTE = /\bno hostile actions\b/i;

// A note's pacification, or null: { all, endsOn: "any" | "caster" | null, allies }. rowText: its outcome row's own words (Calm's
// critical failure says only "As failure, but hostility doesn't end the effect").
export function pacifyOf(note, rowText = "") {
    if (!HOSTILE_NOTE.test(String(note?.label ?? ""))) return null;
    const text = String(note.text ?? note.sourceText ?? "");
    const all = !/\bagainst you\b/i.test(text);
    if (/hostility (?:doesn't|does not) end/i.test(String(rowText ?? ""))) return { all, endsOn: null, allies: false };
    if (/subject to hostility from any/i.test(text)) return { all, endsOn: "any", allies: false };
    if (/hostile action against the creature or its allies/i.test(text)) return { all, endsOn: "caster", allies: true };
    if (/\byou (?:use|take) (?:a )?hostile actions? against (?:the target|it|the creature)\b/i.test(text)) return { all, endsOn: "caster", allies: false };
    return { all, endsOn: null, allies: false };
}

// How long a note lasts, in rounds (until the caster's turn starts that many rounds on), and whether it's sustained.
export const noteRounds = lastingRounds;

export function pacify(state, target, caster, spell, entry, duration) {
    const { rounds, sustained } = noteRounds(duration);
    const list = (target.pacified ??= []).filter((held) => !(held.by === caster.id && held.spell === spell.name));
    list.push({ by: caster.id, spell: spell.name, all: entry.all, endsOn: entry.endsOn, allies: entry.allies, untilRound: state.round + rounds, sustained });
    target.pacified = list;
    state.log?.push(`  ${target.name} ${entry.all ? "can't use hostile actions" : `can't use hostile actions against ${caster.name}`} (${spell.name})`);
}

// No hostile actions at all.
export function pacifiedAll(c) {
    return (c.pacified ?? []).some((entry) => entry.all);
}

// Calmed until any hostility wakes it (Calm's failure).
export function calmedUntilHostility(c) {
    return (c.pacified ?? []).some((entry) => entry.all && entry.endsOn === "any");
}

// Whether c can't use hostile actions against other.
export function spares(c, other) {
    return (c.pacified ?? []).some((entry) => !entry.all && entry.by === other.id);
}

const end = (state, c, entries, why) => endEntries(state, c, "pacified", entries, why);

// Hostility toward target from source (an attack, damage, a harmful spell or condition): what it ends.
export function hostility(state, target, source) {
    if (!source || source === target) return;
    if (target.pacified?.length) {
        end(state, target, target.pacified.filter((entry) => entry.endsOn === "any" || (entry.endsOn === "caster" && entry.by === source.id)), `${source.name} turned on it`);
    }
    // Glimmer of Charm: the caster's hostility toward its allies too.
    for (const other of state.list) {
        if (other === target || other.side !== target.side || !other.pacified?.length) continue;
        end(state, other, other.pacified.filter((entry) => entry.endsOn === "caster" && entry.allies && entry.by === source.id), `${source.name} turned on its allies`);
    }
}

// What the planner counts for it, in rounds of the target's threat: Calm's kind like sleep until damaged (0.7 a round, up to 3; 0.9
// when nothing ends it); the charm kind only the share of its attacks that would go at the caster.
export function pacifyWorth(state, target, caster, entry, duration) {
    const { rounds } = noteRounds(duration);
    const span = Math.min(3, rounds);
    const per = entry.endsOn === "any" ? 0.7 : 0.9;
    if (entry.all) return per * span;
    const foes = state.list.filter((other) => other.side === caster.side && other.status === "active").length;
    return (per * span) / Math.max(1, foes);
}

// Its own hostile action, done (2026-10-14; Invisibility: "If the target uses a hostile action, the spell ends after that hostile action is
// completed"): the conditions that end with it (c.endsOnHostile, engine flags) go.
export function ownHostility(state, c) {
    if (!c?.endsOnHostile?.size) return;
    for (const flag of c.endsOnHostile) {
        if (!c.cond?.[flag]) continue;
        c.cond[flag] = false;
        state.log?.push(`  ${c.name} is no longer ${flag === "hidden" ? "invisible" : flag}`);
    }
    c.endsOnHostile.clear();
}
