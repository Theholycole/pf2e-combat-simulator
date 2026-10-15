// Vital Luminance (2026-10-15, the Sun domain's advanced devotion spell, on the user's champion Riah): a focus spell (1 action) that fills a
// luminance reservoir — 4 at 1st rank, a point more each rank — and as much again at the start of each of the caster's turns. An undead that
// damages the caster within its light takes half the reservoir as vitality damage (the first time each round). Dismissed (1 action), the
// reservoir heals a living ally in the light, or harms an undead there, by its whole value. Its light is the caster's bright 30 feet: its
// Melee and its band, not the far one.
import { isActive, hpFraction } from "./combatant.js";
import { isUndead } from "./abilities.js";
import { sameMelee } from "./space.js";
import { log } from "./log.js";

const inLight = (caster, other) => other === caster || sameMelee(caster, other) || (other.band === caster.band && caster.band !== "far") || (caster.band === "engaged" && other.band === "near");

// Cast: the reservoir starts, a Focus Point spent.
export function castLuminance(state, c) {
    const luminance = c.vitalLuminance;
    if (!luminance || (c.spellPools?.focus ?? 0) < 1) return;
    c.spellPools.focus -= 1;
    c.luminance = { value: luminance.start, round: state.round, struck: new Set() };
    log(state, `  ${c.name} casts ${luminance.name}: a luminance reservoir of ${luminance.start}`);
}

// Its turn starting: the reservoir grows; the undead it struck back this round may be struck again.
export function luminanceTurnStart(state, c) {
    if (!c.luminance) return;
    if (state.round - c.luminance.round >= 10) {
        c.luminance = null;
        log(state, `  ${c.name}'s ${c.vitalLuminance.name} ends`);
        return;
    }
    c.luminance.value += c.vitalLuminance.perTurn;
    c.luminance.struck = new Set();
}

// Dismissed: the reservoir into a living ally (healing) or an undead foe (vitality damage) in its light. applyHeal, applyDamage: the engine's.
export function dismissLuminance(state, c, target, { applyHeal, applyDamage }) {
    if (!c.luminance || !target) return;
    const value = c.luminance.value;
    c.luminance = null;
    log(state, `  ${c.name} Dismisses ${c.vitalLuminance.name} into ${target.name}`);
    if (isUndead(target)) applyDamage(state, target, [{ type: "vitality", amount: value, persistent: false, precision: false }], { source: c, spell: { rank: 10, targeted: true } });
    else applyHeal(state, target, value);
}

// An undead damaged it within its light: half the reservoir back, once a round each. applyDamage: the engine's.
export function luminanceStrikesBack(state, c, source, { applyDamage }) {
    if (!c.luminance || !source || !isActive(source) || !isUndead(source) || c.luminance.struck.has(source.id) || !inLight(c, source)) return;
    c.luminance.struck.add(source.id);
    const amount = Math.floor(c.luminance.value / 2);
    const dealt = applyDamage(state, source, [{ type: "vitality", amount, persistent: false, precision: false }], { source: c });
    log(state, `  ${source.name} takes ${dealt} vitality from ${c.name}'s ${c.vitalLuminance.name}`);
}

// Who it would Dismiss it into now, and what that's worth to it (the planner's): the most hurt living ally in the light, its healing valued
// as a heal is (more the nearer it is to dropping, most when it's down); or the undead foe in the light that would take the most.
export function luminanceTarget(state, c, value, targetValue) {
    if (!c.luminance) return null;
    const amount = c.luminance.value;
    let best = null;
    for (const other of state.list) {
        if (!inLight(c, other)) continue;
        if (other.side === c.side && !isUndead(other) && (other.status === "active" || (other.status === "down" && other.kind === "pc"))) {
            const missing = Math.max(0, other.hp.max - Math.max(0, other.hp.value));
            if (missing <= 0) continue;
            const urgency = other.status !== "active" ? 3 : 2.5 * (1 - hpFraction(other)) ** 1.5;
            const gain = value(other) * (Math.min(amount, missing) / other.hp.max) * urgency;
            if (!best || gain > best.gain) best = { target: other, gain };
        } else if (other.side !== c.side && isActive(other) && isUndead(other)) {
            const gain = targetValue(other) * Math.min(1, amount / Math.max(1, other.hp.value + (other.hp.temp ?? 0)));
            if (!best || gain > best.gain) best = { target: other, gain };
        }
    }
    return best;
}
