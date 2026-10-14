// Calm and the charm spells (2026-10-14; the user: "Spells like shield, Wails of the damned, evil eye, calm"): the spell module's
// "No hostile actions" notes as a state the engine plays. Calm: no hostile actions at all, and any hostility toward the creature
// ends it (a critical failure: nothing does). Charm, Charming Touch, Charming Push, Kiss the Ring, Debilitating Terror, Glimmer of
// Charm: none against the caster; Charm ends when the caster turns hostile to it, Glimmer of Charm when the caster does to it or its
// allies. The entries are c.pacified: [{ by, spell, all, endsOn, allies, untilRound, sustained }].

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
export function noteRounds(duration) {
    if (!duration) return { rounds: 10, sustained: false };
    const sustained = Boolean(duration.sustained);
    if (duration.mode === "turn-boundary" || /start of your next turn/i.test(String(duration.sourceText ?? ""))) return { rounds: 1, sustained };
    const value = Number(duration.value) || 1;
    if (duration.unit === "rounds") return { rounds: value, sustained };
    if (duration.unit === "minutes") return { rounds: value * 10, sustained };
    return { rounds: Infinity, sustained };
}

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

// Whether c can't use hostile actions against other.
export function spares(c, other) {
    return (c.pacified ?? []).some((entry) => !entry.all && entry.by === other.id);
}

function end(state, c, entries, why) {
    if (!entries.length) return;
    c.pacified = c.pacified.filter((entry) => !entries.includes(entry));
    for (const entry of entries) state.log?.push(`  ${c.name} is no longer under ${entry.spell}${why ? ` (${why})` : ""}`);
}

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

// The caster's turn starting: its spells that ran out end; one it sustains costs it an action, or ends when it can't act.
export function pacifyTurnStart(state, c, { canSustain = true } = {}) {
    const sustained = new Set();
    for (const other of state.list) {
        if (!other.pacified?.length) continue;
        // (A sustained one whose caster is dead or gone: nobody sustains it.)
        end(state, other, other.pacified.filter((entry) => entry.sustained && !["active", "down"].includes(state.byId.get(entry.by)?.status)), null);
        const mine = other.pacified.filter((entry) => entry.by === c.id);
        end(state, other, mine.filter((entry) => state.round >= entry.untilRound || (entry.sustained && !canSustain)), null);
        for (const entry of other.pacified.filter((held) => held.by === c.id && held.sustained)) sustained.add(entry.spell);
    }
    if (!canSustain) return;
    for (const spell of sustained) {
        if (c.actionsLeft > 0) {
            c.actionsLeft -= 1;
            state.log?.push(`  ${c.name} Sustains ${spell}`);
        }
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
