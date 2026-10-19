// U1 (2026-10-15), consumables. The user: "monsters should use their items freely. Players should use rechargeable or reusable items
// freely but consumables should be weighted to be used when they provide significant more value than other options. Healing items
// should be used freely if they are projected to go down soon or if they are used on another player that is already down."
// A PC's consumable (a potion, a scroll, a spell gem, a talisman) is worth its value divided by CONSUMABLE_MARGIN to the planner, so it
// beats another option only when it's worth half as much again; a reusable item (a wand, a staff, one whose uses come back) and every
// item of a monster's, its full value.
import { isActive, statusPenalty } from "./combatant.js";
import { levelDC } from "./checks.js";
import { describeSpell } from "./spells.js";

export const CONSUMABLE_MARGIN = 1.5;

// The damage a creature can expect before its next turn: each active foe's threat (a round's expected damage), on the creatures in its
// Melee when this one is there, else shared by the creature's whole side; nothing from a foe busy in another Melee.
export function expectedIncoming(state, c) {
    const side = state.list.filter((other) => other.side === c.side && isActive(other) && !other.familiar && other.kind !== "object");
    let total = 0;
    for (const foe of state.list) {
        if (foe.side === c.side || !isActive(foe)) continue;
        const threat = state.threat?.get(foe.id) ?? 0;
        if (!threat) continue;
        if (foe.meleeId !== null && foe.meleeId !== undefined) {
            if (foe.meleeId !== c.meleeId) continue;
            total += threat / Math.max(1, side.filter((other) => other.meleeId === foe.meleeId).length);
        } else total += threat / Math.max(1, side.length);
    }
    return total;
}

// Projected to go down before its next turn: what it can expect at least its Hit Points.
export function goingDown(state, c) {
    return isActive(c) && c.hp.value + (c.hp.temp ?? 0) <= expectedIncoming(state, c);
}

// A healing item drunk by a PC about to go down, or fed to a PC who is down: used freely.
export function urgentHealing(state, c, spell, targets, actions) {
    // (2026-10-16: or one that restores all its Hit Points, Elixir of Rejuvenation.)
    if (!spell.plan || !(describeSpell(spell.plan, actions).healing || spell.restore?.hp === "max")) return false;
    return targets.some((target) => (target !== c && target.kind === "pc" && target.status === "down") || (target === c && goingDown(state, c)));
}

// What the planner weighs an option's value by: 1, or for a PC's consumable 1 / the margin (state.options.consumableMargin, else
// CONSUMABLE_MARGIN) unless it's urgent healing.
export function consumableWeight(state, c, spell, targets, actions) {
    // (U12: an item to be used freely, the user's call — the persistent damage recovery ones.)
    if (!spell?.consumable || spell.free || c.kind !== "pc" || urgentHealing(state, c, spell, targets, actions)) return 1;
    return 1 / Math.max(1, Number(state.options?.consumableMargin) || CONSUMABLE_MARGIN);
}

// U14 (2026-10-16, the item module's spellguns): an item attacked with its user's own attack ("a spell attack roll or a firearm attack roll",
// spell.ownAttack: the kinds it allows) — the creature's better one: its best spell attack, its best firearm Strike. A creature with
// neither can't use it, so it's left out. Set once as the fight is prepared (fight.js prepareSnapshot): spell.ownAttacks { spell, firearm },
// each its best; the roll takes the better after each one's penalties (ownAttackModifier). (A crossbow is the gunslinger's, not a firearm.)
// (2026-10-18, the item module's thrown items — Oil, Life Salt, Sack of Rotten Fruit: "thrown", Dexterity and simple weapon proficiency:
// its best thrown Strike's attack, else its best ranged one's.)
export function ownAttacks(c) {
    const spellAttack = Math.max(-Infinity, ...(c.spells ?? []).filter((other) => !other.kind && Number.isFinite(other.attack)).map((other) => other.attack));
    const firearmAttack = Math.max(-Infinity, ...(c.strikes ?? []).filter((strike) => strike.firearm && !strike.crossbow).map((strike) => strike.bonus));
    const thrown = (c.strikes ?? []).filter((strike) => strike.thrown);
    const thrownAttack = Math.max(-Infinity, ...(thrown.length ? thrown : (c.strikes ?? []).filter((strike) => !strike.melee)).map((strike) => strike.bonus));
    return (c.spells ?? []).flatMap((spell) => {
        if (!spell.ownAttack) return [spell];
        const attacks = Object.fromEntries([["spell", spellAttack], ["firearm", firearmAttack], ["thrown", thrownAttack]].filter(([kind, value]) => spell.ownAttack.includes(kind) && Number.isFinite(value)));
        return Object.keys(attacks).length ? [{ ...spell, ownAttacks: attacks, attack: Math.max(...Object.values(attacks)) }] : [];
    });
}

// The attack it rolls: the better of its user's, a spell attack less what a spell attack takes (stupefied), a firearm's less a ranged
// Strike's (clumsy); frightened and sickened either way.
export function ownAttackModifier(spell, c) {
    return Math.max(...Object.entries(spell.ownAttacks ?? { spell: spell.attack ?? 0 }).map(([kind, value]) => value - statusPenalty(c, kind === "spell" ? "spell" : "ranged")));
}

// U19 (2026-10-16, the item module): an item whose save is against its owner's own DC (PF2e's "against:class-spell" — Penultimate Heartbeat,
// Chroma Kaleidoscope — or a cast at it): its class DC (PF2e's, else its level's), its best spell DC (its spells', not its items'), or
// "class-spell" the higher; a cast's attack that DC less 10. Set once as the fight is prepared (fight.js prepareSnapshot).
export function ownerDC(c, kind) {
    const classDC = Number.isFinite(c.classDC) ? c.classDC : levelDC(Number(c.level) || 1);
    const spellDCs = (c.spells ?? []).filter((spell) => !spell.kind && Number.isFinite(spell.dc)).map((spell) => spell.dc);
    const spellDC = spellDCs.length ? Math.max(...spellDCs) : null;
    if (kind === "class") return classDC;
    if (kind === "spell") return spellDC ?? classDC;
    return Math.max(classDC, spellDC ?? -Infinity);
}

export function ownerDCs(c) {
    return (c.spells ?? []).map((spell) => {
        if (!spell.ownerDC) return spell;
        const dc = ownerDC(c, spell.ownerDC);
        return { ...spell, dc, ...(Number.isFinite(spell.attack) ? { attack: dc - 10 } : {}) };
    });
}
