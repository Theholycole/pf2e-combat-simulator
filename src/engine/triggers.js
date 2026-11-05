// (2026-11-05, Cole: "keep working on the real gaps we have".) A feat's reaction or free action played at its trigger: the feat module
// compiles what it does (a save, a check, an effect), and the feat ratings read when it goes from the feat's own Trigger line
// (tools/lib/feat-power.mjs featTriggerOf) — entry.featTrigger { on, melee?, unarmed?, whileDown? } on the PC's spell entry, and
// c.featTriggers on the PC. The events:
// - "turn-start": its turn begins (Blazing Aura, High-Speed Regeneration, Harness Natural Magic).
// - "damaged": a foe damages it (Impose Order, Gaping Flesh, Calcifying Sand, Inscribed Blast) — melee: by a melee attack or from beside it.
// - "foe-down": it drops a foe (Victorious Vigor, Cranial Detonation).
// - "crit": it critically hits with a Strike (Echoing Violence) — unarmed: an unarmed one.
// - "self-down" / "ally-down": a foe drops it, or it or an ally within 30 feet (Bleak Humorist, Final Spite) — at that foe.
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
        if (!poolReady(c, spell)) continue;
        const reaction = spell.plan?.activation?.time === "reaction";
        if (reaction && !canReact(c, spell.name)) continue;
        const who = whoFor(state, c, spell, ctx.by ?? ctx.target ?? null);
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

// A creature dropped (fight.js-free: actions.js knockOut calls it): "foe-down" for the one that dropped it, "self-down" for it, and
// "ally-down" for its allies within 30 feet (about: not far apart).
export function dropTriggers(state, target, source) {
    if (!source || source.side === target.side) return;
    featTriggers(state, source, "foe-down", { target });
    featTriggers(state, target, "self-down", { by: source });
    for (const ally of state.list) if (ally.side === target.side && ally.featTriggers && (ally === target || ally.band !== "far" || target.band !== "far")) featTriggers(state, ally, "ally-down", { by: source });
}
