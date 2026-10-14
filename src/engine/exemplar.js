// An exemplar's divine spark and ikons (C25–C27). The spark sits in one ikon
// at a time and gives its immanence (the ikon's effect model, read from PF2e:
// Strike damage, save bonuses). Shift Immanence (1 action, once a round; free
// when initiative is rolled) moves it. A transcendence action (1 action) needs
// the spark in its ikon and casts the spark out until the next Shift:
// - Strike, Breathe, Rend: right after a hit with the ikon weapon, the weapon's damage dice again as spirit damage;
// - No Scar but This: healing, (half the level, rounded up)d8.

import { applyEffect, removeEffect } from "./effects.js";
import { applyDamage } from "./actions.js";
import { applyHeal } from "./spells.js";
import { isActive } from "./combatant.js";
import { log } from "./log.js";

export const ikonOf = (c, slug) => c.exemplar?.ikons.find((ikon) => ikon.slug === slug) ?? null;

// Puts the spark in an ikon (or nowhere, slug null).
export function placeSpark(state, c, slug) {
    for (const effect of (c.effects ?? []).filter((active) => active.key === "immanence")) removeEffect(c, effect);
    c.spark = slug;
    const ikon = ikonOf(c, slug);
    if (ikon) applyEffect(state, c, ikon.model, c, { key: "immanence" });
}

// The ikon whose immanence adds most to its Strikes (a weapon ikon), else the first.
export function bestIkon(c) {
    const extra = (ikon) => Math.max(0, ...Object.values(ikon.model.strikeDeltas ?? {}).map((parts) => parts.reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0)));
    return [...(c.exemplar?.ikons ?? [])].sort((a, b) => extra(b) - extra(a))[0] ?? null;
}

// Shift Immanence as a free action when initiative is rolled.
export function sparkAtInitiative(state, c) {
    const ikon = bestIkon(c);
    if (!ikon) return;
    placeSpark(state, c, ikon.slug);
    log(state, `  ${c.name} shifts its spark into ${ikon.name}`);
}

export function shiftImmanence(state, c, slug) {
    c.usedThisTurn?.add("shift-immanence");
    placeSpark(state, c, slug);
    log(state, `  ${c.name} uses Shift Immanence: its spark into ${ikonOf(c, slug)?.name ?? "itself"}`);
}

// Strike, Breathe, Rend's requirement: its last action this turn was a hit with the ikon weapon.
export const rendReady = (state, c, entry) => c.spark === entry.ikon && c.lastHit?.strike === entry.strike && c.lastHit.action === (c.actionCount ?? 0) - 1 && c.lastHit.round === state.round;

export function transcend(state, c, entry, targetId) {
    log(state, `  ${c.name} uses ${entry.name}`);
    if (entry.kind === "rend") {
        const target = state.byId.get(targetId);
        if (target && isActive(target)) {
            let amount = 0;
            for (let die = 0; die < entry.dice; die++) amount += state.rng.die(entry.die);
            const dealt = applyDamage(state, target, [{ type: "spirit", amount, persistent: false, precision: false }], { source: c });
            log(state, `  ${target.name} takes ${dealt} spirit (${Math.max(0, target.hp.value)}/${target.hp.max})`);
        }
    } else if (entry.kind === "heal") {
        let amount = 0;
        for (let die = 0; die < entry.dice; die++) amount += state.rng.die(entry.die);
        applyHeal(state, c, amount);
    }
    // The force of the act casts the spark out of the ikon.
    placeSpark(state, c, null);
    log(state, `  ${c.name}'s spark leaves the ikon`);
}
