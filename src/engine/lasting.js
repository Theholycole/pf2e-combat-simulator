// Spell states that last on a creature after the spell resolves — Calm's "can't use hostile actions" (pacify.js), a condition floor
// (floors.js) — each an entry { by, spell, untilRound, sustained } in the creature's list. At the caster's turn start those that ran
// out end, and a sustained spell costs it an action (PF2e's Sustain), or ends when it can't act or is gone.

const LISTS = { pacified: "under", condFloors: "floor of", reactionLocks: "reactions locked by", dancing: "dancing to", spellLocks: "kept from casting by", marks: "marked by", curses: "cursed by" };

export function endEntries(state, c, list, entries, why) {
    if (!entries.length) return;
    c[list] = (c[list] ?? []).filter((entry) => !entries.includes(entry));
    const what = { pacified: (entry) => `under ${entry.spell}`, condFloors: (entry) => `held by ${entry.spell}`, reactionLocks: (entry) => `kept from reacting by ${entry.spell}`, dancing: (entry) => `dancing to ${entry.spell}`, spellLocks: (entry) => `kept from casting by ${entry.spell}`, marks: (entry) => `marked by ${entry.spell}`, curses: (entry) => `cursed by ${entry.spell}` }[list];
    for (const entry of entries) state.log?.push(`  ${c.name} is no longer ${what(entry)}${why ? ` (${why})` : ""}`);
}

export function lastingTurnStart(state, c, { canSustain = true } = {}) {
    const sustained = new Set();
    for (const other of state.list) {
        for (const list of Object.keys(LISTS)) {
            if (!other[list]?.length) continue;
            // (A sustained one whose caster is dead or gone: nobody sustains it.)
            endEntries(state, other, list, other[list].filter((entry) => entry.sustained && !["active", "down"].includes(state.byId.get(entry.by)?.status)), null);
            const mine = (other[list] ?? []).filter((entry) => entry.by === c.id && !entry.ownTurn);
            endEntries(state, other, list, mine.filter((entry) => state.round >= entry.untilRound || (entry.sustained && !canSustain)), null);
            // (Spirit Song: "until the beginning of its turn" — its own.)
            if (other === c) endEntries(state, other, list, (other[list] ?? []).filter((entry) => entry.ownTurn), null);
            for (const entry of (other[list] ?? []).filter((held) => held.by === c.id && held.sustained)) sustained.add(entry.spell);
        }
    }
    if (!canSustain) return;
    for (const spell of sustained) {
        if (c.actionsLeft > 0) {
            c.actionsLeft -= 1;
            state.log?.push(`  ${c.name} Sustains ${spell}`);
            (c.sustainedNow ??= []).push(spell);
        }
    }
}

// How long a spell's state lasts from its duration (a note's, or the plan's lifecycle), in rounds, and whether it's sustained.
export function lastingRounds(duration) {
    if (!duration) return { rounds: 10, sustained: false };
    const sustained = Boolean(duration.sustained ?? duration.mode === "sustained");
    const spec = duration.mode === "sustained" && duration.maximum ? duration.maximum : duration;
    if (spec.mode === "turn-boundary" || /start of your next turn/i.test(String(spec.sourceText ?? spec.raw ?? ""))) return { rounds: 1, sustained };
    const value = Number(spec.value) || 1;
    if (spec.unit === "rounds") return { rounds: value, sustained };
    if (spec.unit === "minutes") return { rounds: value * 10, sustained };
    return { rounds: Infinity, sustained };
}
