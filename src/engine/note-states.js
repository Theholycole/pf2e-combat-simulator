// Notes the spell module leaves to the GM, played as states (2026-10-14, spell coverage): "can't use reactions" (Laughing Fit,
// Phantasmagoria, Spirit Song, Faerie Dust, Uncontrollable Dance, Roaring Applause, Hypnotize) with Uncontrollable Dance's actions
// spent dancing, and Command's "actions on its next turn" (Command, Commanding Lash, Heart's Hook) — the caster's command played as
// "drop prone": the target spends the commanded actions and ends up prone.
import { lastingRounds } from "./lasting.js";

// A note's state, or null: { kind: "no-reactions", ownTurn, dance } | { kind: "command", actions } | { kind: "no-actions" } |
// { kind: "no-casting", tradition }.
// (S52, under any label: Laughing Fit's and Roaring Applause's successes say "It can't use reactions" in a "GM note".)
const TRADITION_LOCK = /\bcan't cast (?:(arcane|divine|occult|primal) )?spells(?:\.|$)/i;
export function noteState(note) {
    const label = String(note?.label ?? "");
    const text = String(note?.text ?? note?.sourceText ?? "");
    // (Laughing Fit's critical failure: "falls Prone and can't use actions or reactions for 1 round" — its next turn's actions gone.)
    if (/can't use actions or reactions/i.test(text)) return { kind: "no-actions" };
    // (Crisis of Faith's critical failure: "It can't cast divine spells.")
    const lock = TRADITION_LOCK.exec(text);
    if (lock) return { kind: "no-casting", tradition: lock[1]?.toLowerCase() ?? null };
    if (/can't use reactions/i.test(text)) {
        const dance = /must spend (?:at least (\d+)|all its) actions? each turn dancing/i.exec(text);
        return { kind: "no-reactions", ownTurn: /until the (?:beginning|start) of its (?:next )?turn/i.test(text), dance: dance ? Number(dance[1]) || 3 : 0 };
    }
    if (/actions on its next turn/i.test(label)) return { kind: "command", actions: /all its actions/i.test(text) ? 3 : 1 };
    return null;
}

export function applyNoteState(state, target, caster, spell, entry, duration) {
    if (entry.kind === "command") {
        target.commanded = { by: caster.id, spell: spell.name, actions: entry.actions };
        state.log?.push(`  ${target.name} must obey ${caster.name}'s ${spell.name} on its next turn`);
        return;
    }
    if (entry.kind === "no-actions") {
        target.lostActions = { by: caster.id, spell: spell.name, round: state.round };
        target.reactionLocks = [...(target.reactionLocks ?? []).filter((held) => !(held.by === caster.id && held.spell === spell.name)), { by: caster.id, spell: spell.name, untilRound: state.round + 1, ownTurn: false, sustained: false }];
        state.log?.push(`  ${target.name} can't use actions or reactions for a round (${spell.name})`);
        return;
    }
    const { rounds, sustained } = lastingRounds(duration);
    if (entry.kind === "no-casting") {
        target.spellLocks = [...(target.spellLocks ?? []).filter((held) => !(held.by === caster.id && held.spell === spell.name)), { by: caster.id, spell: spell.name, tradition: entry.tradition, untilRound: state.round + rounds, ownTurn: false, sustained }];
        state.log?.push(`  ${target.name} can't cast ${entry.tradition ? `${entry.tradition} ` : ""}spells (${spell.name})`);
        return;
    }
    const base = { by: caster.id, spell: spell.name, untilRound: state.round + (entry.ownTurn ? 1 : rounds), ownTurn: entry.ownTurn, sustained };
    target.reactionLocks = [...(target.reactionLocks ?? []).filter((held) => !(held.by === caster.id && held.spell === spell.name)), base];
    if (entry.dance) target.dancing = [...(target.dancing ?? []).filter((held) => !(held.by === caster.id && held.spell === spell.name)), { ...base, actions: entry.dance }];
    state.log?.push(`  ${target.name} can't use reactions${entry.dance ? ` and dances (${entry.dance === 3 ? "all its" : entry.dance} action${entry.dance === 1 ? "" : "s"} a turn)` : ""} (${spell.name})`);
}

// Whether it has spells it casts in a fight of the tradition (any, with none named).
function castsThem(c, tradition) {
    return (c.spells ?? []).some((spell) => !spell.kind && (!tradition || spell.tradition === tradition));
}

// Whether a spell is locked for its caster (Crisis of Faith's divine spells).
export function spellLocked(c, spell) {
    return (c.spellLocks ?? []).some((held) => !held.tradition || held.tradition === spell.tradition);
}

// Whether it has reactions worth losing: an Attack of Opportunity, Shield Block, a reaction Strike or ability.
function reacts(c) {
    return Boolean(c.reactions?.aoo || c.reactions?.shieldBlock || c.reactionStrikes?.length || (c.spells ?? []).some((spell) => spell.plan?.trigger?.reaction));
}

// What the planner counts for it, in rounds of the target's threat: no reactions, 0.12 a round for a creature with them (0.03
// without); dancing, the share of its actions it loses; Command, the actions it spends and its prone.
export function noteStateWorth(target, entry, duration) {
    if (entry.kind === "command") return entry.actions / 3 + 0.15;
    if (entry.kind === "no-actions") return 1 + (reacts(target) ? 0.12 : 0.03);
    const { rounds } = lastingRounds(duration);
    // (Its spells of the tradition locked: the share of its threat they carry, about half a caster's.)
    if (entry.kind === "no-casting") return Math.min(3, rounds) * (castsThem(target, entry.tradition) ? 0.5 : 0);
    const span = Math.min(3, entry.ownTurn ? 1 : rounds);
    return span * ((reacts(target) ? 0.12 : 0.03) + (entry.dance ? entry.dance / 3 : 0));
}

// Its own turn starting (its actions set): Command's actions spent (it drops prone), dancing's.
export function noteStatesTurnStart(state, c) {
    // (Its next turn within the round: one it missed, down or paralyzed, doesn't carry the loss on.)
    if (c.lostActions) {
        if (state.round <= c.lostActions.round + 1) {
            state.log?.push(`  ${c.name} can't act (${c.lostActions.spell})`);
            c.actionsLeft = 0;
        }
        c.lostActions = null;
    }
    if (c.commanded) {
        const spent = Math.min(c.commanded.actions, c.actionsLeft);
        c.actionsLeft -= spent;
        c.cond.prone = true;
        state.log?.push(`  ${c.name} obeys ${c.commanded.spell}: drops prone${spent > 1 ? ` and stays down (${spent} actions)` : ""}`);
        c.commanded = null;
    }
    const dance = Math.max(0, ...(c.dancing ?? []).map((entry) => entry.actions));
    if (dance > 0 && c.actionsLeft > 0) {
        const spent = Math.min(dance, c.actionsLeft);
        c.actionsLeft -= spent;
        state.log?.push(`  ${c.name} dances (${spent} action${spent === 1 ? "" : "s"})`);
    }
}
