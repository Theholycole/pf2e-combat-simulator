// (2026-11-05, Cole: "keep working on the real gaps we have".) A feat's reaction or free action played at its trigger: the feat module
// compiles what it does (a save, a check, an effect), and the feat ratings read when it goes from the feat's own Trigger line
// (tools/lib/feat-power.mjs featTriggerOf) — entry.featTrigger { on, melee?, unarmed?, whileDown? } on the PC's spell entry, and
// c.featTriggers on the PC. The events:
// - "turn-start": its turn begins (Blazing Aura, High-Speed Regeneration, Harness Natural Magic). "initiative": as initiative is
//   rolled (All This Has Happened Before).
// - "damaged": a foe damages it (Impose Order, Gaping Flesh, Calcifying Sand, Inscribed Blast) — melee: by a melee attack or from beside it.
// - "foe-down": it drops a foe (Victorious Vigor, Cranial Detonation).
// - "would-damage": before damage from a foe lands (Adamantine Body, Terrain Shield) — strike: only a Strike's; type: only that type's.
// - "crit": it critically hits with a Strike (Echoing Violence) — unarmed: an unarmed one.
// - "self-down" / "ally-down": a foe drops it, or it or an ally within 30 feet (Bleak Humorist, Final Spite) — at that foe.
// - "hit": a foe's Strike hits it (Cautious Word, Dazzling Dragonet Disappearance) — critOnly: a critical hit (Tragic Lament).
// - "strike-hit": its Strike hits (Lethal Edge). "shield-block": it Shield Blocks a foe's attack (Aggressive Block; Flashing Shield —
//   creature: only that trait's, undead).
// - "frightened": it becomes frightened (Creature Comforts). "ally-frightened": an ally within its trigger's range does (Reassuring
//   Presence; toTrigger: the card goes on that ally). withCondition: only while it has that condition (Mask of Fear's turn start).
// - "foe-attack": a foe within its range is about to attack (Harbinger's Caw). "foe-crit-fail": a foe within its range critically misses
//   (Ill Tide). Both at that foe. atYou: only an attack on it (Lucky Escape's "A creature targets you with an attack").
// The entry's own targeting picks who: itself, its allies or foes about it for an area (its Melee for 10 feet or less), or the creature
// of the trigger. A reaction spends its reaction; a pool, its use.
import { canReact, spendReaction } from "./abilities.js";
import { ACTIVE, DOWN, isActive } from "./combatant.js";
import { sameMelee } from "./space.js";
import { castPlan, describeSpell, poolReady } from "./spells.js";

function whoFor(state, c, spell, creature) {
    const plan = spell.plan ?? {};
    const info = describeSpell(plan);
    const text = String(plan.targeting?.target ?? "");
    if (info.self || /^(?:you|self)$/i.test(text)) return [c];
    const helpful = info.helpful || info.healing;
    const side = state.list.filter((other) => isActive(other) && (helpful ? other.side === c.side : other.side !== c.side));
    if (info.area) {
        const radius = Number(info.area.value) || 0;
        const near = (other) => other === c || (radius <= 10 ? sameMelee(c, other) : radius >= 60 || other.band !== "far" || c.band === "far");
        return side.filter(near);
    }
    if (creature && isActive(creature) && (helpful ? creature.side === c.side : creature.side !== c.side)) return [creature];
    const close = side.filter((other) => other !== c && sameMelee(c, other));
    return (close.length ? close : side).slice(0, 1);
}

// Plays the PC's entries for this event. ctx: { by (the creature that set it off), strike, target }.
export function featTriggers(state, c, on, ctx = {}) {
    if (!c?.featTriggers || state.inFeatTrigger) return;
    for (const spell of c.spells ?? []) {
        const trigger = spell.featTrigger;
        if (!trigger || trigger.on !== on) continue;
        if (c.status !== ACTIVE && !(trigger.whileDown && c.status === DOWN)) continue;
        if (trigger.melee && ctx.by && !(ctx.strike?.melee || sameMelee(c, ctx.by))) continue;
        if (trigger.unarmed && !ctx.strike?.unarmed) continue;
        if (trigger.critOnly && !ctx.critical) continue;
        if (trigger.creature && ctx.by && !(ctx.by.traits ?? []).includes(trigger.creature)) continue;
        if (trigger.strike && !ctx.physical) continue;
        if (trigger.type && !(ctx.types ?? []).includes(trigger.type)) continue;
        if (trigger.withCondition && !(c.cond?.[trigger.withCondition] > 0)) continue;
        if (trigger.atYou && ctx.attacked !== c) continue;
        const about = ctx.target ?? ctx.by ?? null;
        if (trigger.within && about && about !== c && !withinFeet(c, about, trigger.within)) continue;
        if (!poolReady(c, spell)) continue;
        const reaction = spell.plan?.activation?.time === "reaction";
        if (reaction && !canReact(c, spell.name)) continue;
        const who = trigger.toTrigger && ctx.target ? (isActive(ctx.target) ? [ctx.target] : []) : whoFor(state, c, spell, ctx.by ?? ctx.target ?? null);
        if (!who.length) continue;
        if (reaction) spendReaction(c, spell.name);
        state.inFeatTrigger = true;
        try {
            castPlan(state, c, spell, who.map((other) => other.id), undefined, { evenDown: true });
        } finally {
            state.inFeatTrigger = false;
        }
    }
}

// Within that many feet, roughly: 5, side by side; up to 30, not far apart; more, anywhere.
const withinFeet = (a, b, feet) => (feet <= 5 ? sameMelee(a, b) : feet <= 30 ? a.band !== "far" || b.band !== "far" : true);

// A creature became frightened (spells.js applyCondition): "frightened" for it, "ally-frightened" for its allies.
export function fearTriggers(state, target) {
    featTriggers(state, target, "frightened", { target });
    for (const ally of state.list) if (ally !== target && ally.side === target.side && ally.featTriggers) featTriggers(state, ally, "ally-frightened", { target });
}

// A foe's roll: each PC on the other side with a reaction for it (a quick check first: most have none).
export function foeRollTriggers(state, foe, on, more = {}) {
    if (!(state.anyFeatTriggers ??= state.list.some((other) => other.featTriggers || other.bloodPool))) return;
    for (const pc of state.list) if (pc.featTriggers && pc.side !== foe.side) featTriggers(state, pc, on, { by: foe, ...more });
}

// A creature dropped (fight.js-free: actions.js knockOut calls it): "foe-down" for the one that dropped it, "self-down" for it, and
// "ally-down" for its allies within 30 feet (about: not far apart).
export function dropTriggers(state, target, source) {
    if (!source || source.side === target.side) return;
    // (2026-11-07, Blood Pool: a creature with blood dying within 30 feet — its pool absorbed by the most hurt ally standing, Hit Points equal
    // to the necromancer's level (its reaction; the ally's walk over taken as made).)
    if (!["undead", "construct", "elemental"].some((trait) => (target.traits ?? []).includes(trait))) {
        for (const pool of state.list) {
            if (!pool.bloodPool || pool.side === target.side || pool.status !== ACTIVE || !canReact(pool, "Blood Pool")) continue;
            const ally = state.list.filter((other) => other.side === pool.side && other.status === ACTIVE && other.kind !== "object" && other.hp.value < other.hp.max).sort((a, b) => a.hp.value / a.hp.max - b.hp.value / b.hp.max)[0];
            if (!ally) continue;
            spendReaction(pool, "Blood Pool");
            const healed = Math.min(pool.bloodPool, ally.hp.max - ally.hp.value);
            ally.hp.value += healed;
            state.log?.push(`  ${pool.name} uses Blood Pool: ${ally.name} regains ${healed} HP`);
        }
    }
    featTriggers(state, source, "foe-down", { target });
    featTriggers(state, target, "self-down", { by: source });
    for (const ally of state.list) if (ally.side === target.side && ally.featTriggers && (ally === target || ally.band !== "far" || target.band !== "far")) featTriggers(state, ally, "ally-down", { by: source });
}
