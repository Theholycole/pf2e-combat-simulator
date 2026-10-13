// Creature rules (T1–T7, 2026-10-13; the user's call: "build everything you brought up", tier 2): what the ability module's creature-rules
// reading gives a creature (its batch 306), played here.
//   T1 Strike bonuses against a condition (Gang Up, Mauler, Punch Down) are strike extras (abilities.js); Brutal Beating's critical rider.
//   T2 Swiftness (its movement triggers no reactions), Relentless (permanently quickened), Inexorable (slowed and stunned gone at the end
//      of its turn, no difficult terrain).
//   T3 A damage type its Strikes can deal instead (Phantom Touch's spirit, versatile weapons), the one its target minds most; resistances
//      and Speed by its share of Hit Points (Abandon Armor).
//   T4 Split, Attach, a flesh golem's Berserk, Protean Anatomy.
//   T5 The elemental dragons' Countered by and Fed by.
//   T6 Critical specialization (Weapon Master; a PC's from its class), by weapon group.
//   T7 Troop Defenses: thresholds lower its maximum Hit Points; immune to non-damaging effects aimed at one creature; one that takes a
//      segment out of the fight costs it a threshold.

import { createCombatant, isActive, isOffGuard } from "./combatant.js";
import { CRITICAL_SUCCESS, DEGREE_NAMES, FAILURE, SUCCESS, degreeOf, flatCheck, levelDC } from "./checks.js";
import { applyEffect } from "./effects.js";
import { adjustInstance } from "./damage.js";
import { saveBonusAgainst, sourceOptions } from "./abilities.js";
import { saveModifier } from "./combatant.js";
import { adjustedSaveDegree } from "./passives.js";
import { engage } from "./space.js";

const log = (state, line) => state.log?.push(line);
const camel = (slug) => String(slug).replace(/-([a-z])/g, (_all, letter) => letter.toUpperCase());

// Whether a creature has a condition, by PF2e's slug.
export function conditionHeld(c, slug) {
    if (slug === "off-guard") return isOffGuard(c);
    if (slug === "unconscious") return Boolean(c.cond?.unconscious || c.cond?.asleep);
    const value = c.cond?.[camel(slug)];
    return value === true || Number(value) > 0;
}

// Its turn: "until the end (start) of its next turn" — this round if it hasn't acted yet, else the next.
function nextTurnRound(state, c) {
    return c.round === state.round ? state.round + 1 : state.round;
}
const SOURCE_TURN_START = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" };
const SOURCE_TURN_END = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" };

// A save the attacker forces, against its class DC (or its level's).
function saveAgainst(state, attacker, target, statistic) {
    const dc = attacker.classDC ?? levelDC(attacker.level ?? 1);
    const modifier = saveModifier(target, statistic) + saveBonusAgainst(target, statistic, { kind: "ability", plan: { traits: [] } });
    const natural = state.rng.d20();
    const degree = adjustedSaveDegree(target, statistic, degreeOf(natural + modifier, dc, natural), { kind: "ability", plan: { traits: [] } });
    log(state, `  ${target.name} saves (${statistic}, DC ${dc}): ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
    return degree;
}

// --- T1: Brutal Beating ----------------------------------------------------------

// A critical hit's rider on all its Strikes: its conditions, and a push.
export function critRiderAnswer(state, attacker, target, { applyCondition, applyMove }) {
    const rider = attacker.critRider;
    if (!rider || !isActive(target)) return;
    log(state, `  ${attacker.name}'s critical hit: its ${rider.name ?? "rider"}`);
    for (const { slug, value } of rider.conditions ?? []) if (applyCondition(state, target, slug, value ?? null, null, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""}`);
    if (rider.push && isActive(target)) applyMove(state, target, { kind: "push", distance: rider.push });
}

// --- T2: Inexorable ------------------------------------------------------------------

// At the end of its turn: the conditions it recovers from.
export function inexorableTurnEnd(state, c) {
    for (const slug of c.inexorable?.recover ?? []) {
        if (!conditionHeld(c, slug)) continue;
        c.cond[camel(slug)] = typeof c.cond[camel(slug)] === "number" ? 0 : false;
        c.timers = (c.timers ?? []).filter((timer) => timer.key !== camel(slug));
        log(state, `  ${c.name} recovers from ${slug} (${c.inexorable.name ?? "Inexorable"})`);
    }
}

// --- T3: a damage type of its choice ------------------------------------------------
// (Resistances by its share of Hit Points, Abandon Armor's, are damage.js's resistancesOf; its Speed bonus has no use in range bands.)

// The damage type its Strike deals this time: its own, or one it can deal instead (versatile, Phantom Touch), whichever this target
// minds most.
export function bestStrikeType(attacker, strike, target, type, amount = 6, precision = false) {
    const choices = [...new Set([type, ...(strike?.versatile ?? []), ...(attacker?.strikeTypes ?? [])])];
    if (choices.length < 2) return type;
    return choices.reduce((best, choice) => (adjustInstance(target, choice, amount, precision) > adjustInstance(target, best, amount, precision) ? choice : best), type);
}


// --- T4: Protean Anatomy, Split, Attach, Berserk ----------------------------------------

// After acid, electricity or sonic damage: resistance to that type, until damage of another of them (damage.js's resistancesOf).
export function proteanAfterDamage(state, c, types) {
    if (!c.protean?.value) return;
    const type = [...types].reverse().find((entry) => ["acid", "electricity", "sonic"].includes(entry));
    if (!type || c.proteanType === type) return;
    c.proteanType = type;
    log(state, `  ${c.name}'s Protean Anatomy: resistance ${c.protean.value} to ${type}`);
}

let splitCount = 0;
// Hit by damage of a type it names (a critical hit, where it says so) with enough Hit Points left: two of it, each with half.
export function splitAfterHit(state, c, types, { critical = false } = {}) {
    const rule = c.split;
    if (!rule || !isActive(c) || c.hp.value < rule.minHp || (rule.critical && !critical)) return null;
    if (!types.some((type) => rule.types.includes(type))) return null;
    const half = Math.floor(c.hp.value / 2);
    if (half < 1) return null;
    c.hp.value -= half;
    const id = `${c.id}~split${++splitCount}`;
    let copy;
    try {
        copy = structuredClone(c);
    } catch {
        copy = { ...c };
    }
    const twin = createCombatant({ ...copy, id, name: `${c.name} (split)`, hp: { value: half, max: c.hp.max, temp: 0 }, conditions: {}, status: undefined, reserve: false, arrivesRound: 0, engagement: undefined, band: c.band, defenceId: undefined, grabbedBy: null, attachedTo: null, swallowedBy: null, splitFrom: c.id });
    twin.round = c.round;
    state.list.push(twin);
    state.byId.set(id, twin);
    state.initiative?.set(id, state.initiative.get(c.id) ?? 0);
    // (Its turn straight after the original's, on its initiative.)
    if (state.order) {
        const at = state.order.indexOf(c.id);
        state.order.splice(at < 0 ? state.order.length : at + 1, 0, id);
    }
    // Beside it: in its Melee, against the foe it fights.
    const foe = state.list.find((other) => other.side !== c.side && isActive(other) && other.meleeId !== null && other.meleeId === c.meleeId);
    if (foe) engage(state, twin, foe);
    state.stats.splits = (state.stats.splits ?? 0) + 1;
    log(state, `  ${c.name} splits: ${twin.name} (${twin.hp.value} HP) and ${c.name} (${c.hp.value} HP)`);
    return twin;
}

// A hit on a larger creature: attached to it — it moves with that creature, off-guard while attached (or +2 AC, the pickled punk's).
export function attachAfterHit(state, c, target, sizeRank) {
    if (!c.attach || c.attachedTo || !isActive(target) || sizeRank(target.size) <= sizeRank(c.size)) return;
    c.attachedTo = target.id;
    log(state, `  ${c.name} attaches to ${target.name}`);
}

// Still attached: its target is on the field, and so is it.
export function attachedTarget(state, c) {
    const target = c.attachedTo ? state.byId.get(c.attachedTo) : null;
    if (!target || !isActive(target) || !isActive(c)) {
        if (c.attachedTo) c.attachedTo = null;
        return null;
    }
    return target;
}

// Where its target goes, it goes: into its Melee, or its band.
export function followAttached(state) {
    for (const c of state.list) {
        const target = c.attachedTo ? attachedTarget(state, c) : null;
        if (!target) continue;
        if (target.meleeId !== null && target.meleeId !== c.meleeId) engage(state, c, target);
        else if (target.meleeId === null) c.band = target.band;
    }
}

// Blinded or deafened: Protean Anatomy grows new senses by the end of its next turn.
export function proteanTurnEnd(state, c) {
    if (!c.protean?.recover?.length) return;
    for (const slug of c.protean.recover) {
        if (!c.cond[slug]) {
            if (c.proteanSince?.[slug] !== undefined) delete c.proteanSince[slug];
            continue;
        }
        c.proteanSince ??= {};
        if (c.proteanSince[slug] === undefined) c.proteanSince[slug] = state.round;
        else if (c.proteanSince[slug] < state.round) {
            c.cond[slug] = false;
            c.timers = (c.timers ?? []).filter((timer) => timer.key !== slug);
            delete c.proteanSince[slug];
            log(state, `  ${c.name} grows new senses: no longer ${slug}`);
        }
    }
}

// At the start of its turn while attached: its named Strike's damage on the creature (the pickled punk's).
export function attachedTurnStart(state, c, { applyDamage, rollStrikeDamage, strikeNamed }) {
    const target = attachedTarget(state, c);
    if (!target || !c.attach?.strike) return;
    const index = strikeNamed(c, c.attach.strike);
    if (index < 0) return;
    const dealt = applyDamage(state, target, rollStrikeDamage(state.rng, c.strikes[index], { critical: false }), { source: c });
    log(state, `  ${c.name}, attached, deals ${dealt} to ${target.name}`);
}

// At the start of its turn: a flat check below its Hit Points, or berserk for the fight (it attacks the nearest creature, any side).
export function berserkTurnStart(state, c) {
    const rule = c.golemBerserk;
    if (!rule || c.goneBerserk || c.hp.value > rule.atMost) return;
    if (flatCheck(state.rng, rule.dc) >= SUCCESS) return;
    c.goneBerserk = true;
    if (rule.losesMental) c.immunities = (c.immunities ?? []).filter((type) => type !== "mental");
    log(state, `  ${c.name} goes berserk`);
}

// --- T5: an elemental dragon's Countered by and Fed by ------------------------------------

// Damage or a spell aimed at it: the rules it has that this sets off. event: "damage" (types dealt, the damage's context) or "targeted"
// (the spell).
export function elementalAnswers(state, c, event, { types = [], context = null, spell = null, applyCondition, recharge } = {}) {
    for (const rule of c.elemental ?? []) {
        if (rule.on !== event || !isActive(c)) continue;
        const options = context ?? (spell ? sourceOptions(spell) : new Set());
        const isSpell = spell ? !["ability", "basic"].includes(spell.kind) : Boolean(options.has?.("item:type:spell"));
        let fits = false;
        if (rule.types?.length) fits = types.some((type) => rule.types.includes(type));
        if (rule.traits?.length && (!rule.spell || isSpell)) fits ||= rule.traits.some((trait) => options.has?.(`item:trait:${trait}`) || options.has?.(trait));
        // (A spell or unarmed Strike of a metal creature, or a metal weapon: a weapon held, not one of wood.)
        if (rule.metal) fits ||= options.has?.("item:trait:metal") || (options.has?.("held-weapon") && !options.has?.("wooden"));
        if (rule.wood) fits ||= options.has?.("wooden");
        if (!fits) continue;
        const effect = rule.effect ?? {};
        const rounds = effect.rounds ?? 1;
        const model = { name: rule.name ?? "Elemental answer", rounds, modifiers: [...(effect.modifiers ?? [])], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [...(effect.conditions ?? [])], ...(effect.jawsLose ? { jawsLose: effect.jawsLose } : {}), ...(effect.jawsDie ? { jawsDie: effect.jawsDie } : {}) };
        const applied = applyEffect(state, c, { ...model, rounds: Infinity }, c, { applyCondition, key: `elemental:${rule.name}` });
        // (Until the end, or the start, of its next turn; "1 minute" as its rounds.)
        if (effect.until) (c.timers ??= []).push({ effect: applied, round: nextTurnRound(state, c), turnOf: c.id, at: effect.until === "start-of-next-turn" ? "start" : "end" });
        else (c.timers ??= []).push({ effect: applied, round: state.round + rounds, turnOf: c.id, at: "start" });
        if (effect.disable) c.disabledUntil = { ...(c.disabledUntil ?? {}), [effect.disable.toLowerCase()]: nextTurnRound(state, c) };
        if (effect.recharge) recharge?.(c, effect.recharge);
        log(state, `  ${c.name}: ${rule.name}`);
    }
}

// --- T6: critical specialization -------------------------------------------------------

// Whether this Strike's critical hit carries its group's effect: the Strike's own (a PC's, from PF2e), or all its weapons' (Weapon Master).
export function critSpecGroup(attacker, strike, target) {
    const group = strike?.iwr?.group;
    if (!group) return null;
    if (strike.critSpec) return group;
    if (attacker.critSpec === true) return group;
    // (A rogue's, against an off-guard target.)
    if (attacker.critSpec?.offGuard && isOffGuard(target)) return group;
    return null;
}

// Its effect on the target (and, for an axe, a creature beside it). PF2e's own critical formula already carries the damage ones (pick,
// knife, dart, crossbow, an energy weapon's); a Strike without it (the bestiary sweeps) gets them here.
export function critSpecEffect(state, attacker, target, strike, total, { applyCondition, applyMove, applyDamage, rollDie }) {
    const group = critSpecGroup(attacker, strike, target);
    if (!group || !isActive(target)) return;
    const dice = strike.damage?.[0]?.dice ?? 1;
    const die = strike.damage?.[0]?.die ?? 6;
    const own = !strike.critDamage;
    const save = (statistic) => saveAgainst(state, attacker, target, statistic) <= FAILURE;
    const condition = (slug, value, duration) => {
        if (applyCondition(state, target, slug, value, duration, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""} (critical specialization)`);
    };
    const bleed = (type, size) => applyDamage(state, target, [{ type, persistent: true, dice: 1, die: size, bonus: 0, multiplier: 1, amount: (size + 1) / 2 }], { source: attacker });
    switch (group) {
        case "sword": return condition("off-guard", null, SOURCE_TURN_START);
        case "spear": case "cryo": return condition("clumsy", 1, SOURCE_TURN_START);
        case "flail": return save("reflex") && condition("prone", null, null);
        case "hammer": return save("fortitude") && condition("prone", null, null);
        case "brawling": return save("fortitude") && condition("slowed", 1, SOURCE_TURN_END);
        case "firearm": case "sling": return save("fortitude") && condition("stunned", 1, null);
        case "shock": return save("fortitude") && condition("stunned", 1, SOURCE_TURN_START);
        case "projectile": return save("fortitude") && condition("slowed", 1, SOURCE_TURN_START);
        case "mental": return save("will") && condition("stupefied", 1, SOURCE_TURN_START);
        case "poison": return save("fortitude") && condition("sickened", 1, SOURCE_TURN_START);
        case "laser": return save("fortitude") && condition("dazzled", null, SOURCE_TURN_START);
        case "club": return applyMove(state, target, { kind: "push", distance: 10 });
        case "polearm": case "shield": return applyMove(state, target, { kind: "push", distance: 5 });
        case "axe": {
            const other = state.list.find((entry) => entry !== target && entry.side === target.side && isActive(entry) && entry.meleeId !== null && entry.meleeId === target.meleeId && (entry.ac ?? 99) < total);
            if (!other) return;
            let amount = 0;
            for (let index = 0; index < dice; index++) amount += rollDie(die);
            const dealt = applyDamage(state, other, [{ type: strike.damage[0].type, amount, persistent: false, precision: false }], { source: attacker });
            return log(state, `  ${other.name} takes ${dealt} (axe critical specialization)`);
        }
        case "pick": case "sniper": {
            if (!own) return;
            const dealt = applyDamage(state, target, [{ type: strike.damage[0].type, amount: 2 * dice, persistent: false, precision: false }], { source: attacker });
            return log(state, `  ${target.name} takes ${dealt} more (critical specialization)`);
        }
        case "knife": case "dart": return own ? bleed("bleed", 6) : undefined;
        case "crossbow": return own ? bleed("bleed", 8) : undefined;
        case "corrosive": return own ? bleed("acid", 6) : undefined;
        case "flame": return own ? bleed("fire", 6) : undefined;
        case "plasma": return own ? bleed("electricity", 6) : undefined;
        default: return undefined;
    }
}

// --- T7: Troop Defenses ----------------------------------------------------------------

// Its thresholds: the ones it lists, or two thirds and a third of its Hit Points.
export function troopThresholds(c) {
    if (!c.troop) return [];
    if (c.troop.thresholds?.length) return c.troop.thresholds;
    const max = c.troop.startMax ?? c.hp.max;
    return [{ hp: Math.floor(max * 2 / 3), segments: 3 }, { hp: Math.floor(max / 3), segments: 2 }];
}

// Below a threshold: it loses a segment, and the threshold is its maximum Hit Points.
export function troopAfterDamage(state, c) {
    if (!c.troop) return;
    c.troop.startMax ??= c.hp.max;
    for (const threshold of troopThresholds(c)) {
        if (c.hp.value < threshold.hp && c.hp.max > threshold.hp) {
            c.hp.max = threshold.hp;
            c.troop.segments = threshold.segments;
            log(state, `  ${c.name} loses a segment (${threshold.segments} left)`);
        }
    }
}

// A non-damaging effect aimed at one creature does nothing to a troop.
export function troopIgnores(c, { damaging, targets }) {
    return Boolean(c?.troop) && !damaging && targets <= 1;
}

// A non-damaging effect that takes a segment out of the fight for a round or more (paralyzed, stunned, fleeing, asleep …): the troop
// loses the Hit Points to its next threshold instead.
const DISABLING = new Set(["paralyzed", "petrified", "stunned", "fleeing", "unconscious", "asleep", "confused", "controlled", "immobilized", "restrained"]);
export function troopSegmentLost(state, c, slug) {
    if (!c?.troop || !DISABLING.has(slug)) return false;
    const next = troopThresholds(c).find((threshold) => threshold.hp < c.hp.value) ?? { hp: 0 };
    log(state, `  ${c.name}: a segment is out of the fight (${slug}) — down to ${next.hp} HP`);
    c.hp.value = next.hp;
    if (next.hp > 0) {
        c.troop.startMax ??= c.hp.max;
        c.hp.max = Math.min(c.hp.max, next.hp);
        c.troop.segments = next.segments;
    }
    return true;
}
