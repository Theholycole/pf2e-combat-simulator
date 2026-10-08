// Runtime combatants and the PF2e numbers derived from their conditions and effects.
//
// Snapshot values (AC, Strike bonuses, saves) are base values without
// condition penalties; the engine applies conditions itself so they can change
// during a fight.

import { effectBonus, effectStatusPenalty } from "./effects.js";

export { effectBonus };

export const ACTIVE = "active";
export const DOWN = "down";
export const DEAD = "dead";
export const FLED = "fled";
export const SURRENDERED = "surrendered";
export const PENDING = "pending";

const EMPTY_CONDITIONS = Object.freeze({
    frightened: 0, sickened: 0, clumsy: 0, enfeebled: 0, drained: 0,
    slowed: 0, stunned: 0, quickened: false, offGuard: false, prone: false,
    fleeing: false, dying: 0, wounded: 0, doomed: 0, unconscious: false,
    stupefied: 0, fatigued: false, paralyzed: false, asleep: false, blinded: false, dazzled: false,
    immobilized: false, restrained: false, grabbed: false
});

export function createCombatant(spec) {
    const conditions = { ...EMPTY_CONDITIONS, ...(spec.conditions ?? {}) };
    const persistent = (spec.conditions?.persistent ?? []).map((entry) => ({ ...entry }));
    delete conditions.persistent;
    let status = ACTIVE;
    if (spec.status === DEAD) status = DEAD;
    else if (spec.arrivesRound && spec.arrivesRound > 0) status = PENDING;
    else if (spec.hp.value <= 0 || conditions.dying > 0 || conditions.unconscious) status = spec.kind === "pc" ? DOWN : DEAD;
    return {
        ...spec,
        hp: { value: spec.hp.value, max: spec.hp.max, temp: spec.hp.temp ?? 0 },
        startHp: spec.hp.max,
        cond: conditions,
        persistent,
        shield: spec.shield ? { ...spec.shield, raised: !!spec.shield.raised } : null,
        heroPoints: spec.heroPoints ?? 0,
        band: spec.band ?? "near",
        meleeId: null,
        status,
        reactionUsed: false,
        attacksThisTurn: 0,
        actionsLeft: 0,
        captured: false,
        everDown: status === DOWN,
        damageDealt: 0,
        downedCount: 0,
        moraleState: { failed: 0, wavering: false, broken: false, checkedRound: -1, extraUsed: false, ignoredFirstFailure: false, autoPassed: false, fearThisRound: false },
        taskRound: -1,
        spells: spec.spells ?? [],
        effects: [],
        spellPools: { ...(spec.spellPools ?? {}) },
        timers: []
    };
}

export function isActive(c) {
    return c.status === ACTIVE;
}

export function isPresent(c) {
    return c.status === ACTIVE || c.status === DOWN;
}

// asleep: a spell's unconsciousness (Sleep), which damage ends; the creature stays in the fight.
export function canAct(c) {
    return c.status === ACTIVE && !c.cond.unconscious && !c.cond.paralyzed && !c.cond.asleep && c.acts !== false;
}

// Immobilized, restrained and grabbed creatures can't Stride or Step.
export function canMove(c) {
    return !c.cond.immobilized && !c.cond.restrained && !c.cond.grabbed;
}

// The chance a creature's targeted attack or spell finds its target: blinded,
// everything is hidden to it (DC 11 flat check); dazzled, concealed (DC 5).
export function targetingChance(c) {
    if (c.cond.blinded) return 0.5;
    if (c.cond.dazzled) return 0.8;
    return 1;
}

export function isDown(c) {
    return c.status === DOWN || c.status === DEAD;
}

// The single worst status penalty that applies to a roll or DC.
// kind: "melee" | "ranged" | "ac" | "fortitude" | "reflex" | "will" | "perception" | "skill" | "spell"
export function statusPenalty(c, kind) {
    const k = c.cond;
    let penalty = Math.max(k.frightened, k.sickened);
    if (kind === "ranged" || kind === "ac" || kind === "reflex") penalty = Math.max(penalty, k.clumsy);
    if (kind === "melee") penalty = Math.max(penalty, k.enfeebled);
    if (kind === "fortitude") penalty = Math.max(penalty, k.drained);
    if (kind === "will" || kind === "spell") penalty = Math.max(penalty, k.stupefied ?? 0);
    if (k.fatigued && (kind === "ac" || kind === "fortitude" || kind === "reflex" || kind === "will")) penalty = Math.max(penalty, 1);
    // Status penalties from spell effects don't stack with the conditions' either.
    if (c.effects?.length) penalty = Math.max(penalty, effectStatusPenalty(c, kind === "melee" || kind === "ranged" ? "attack" : kind));
    return penalty;
}

export function isOffGuard(c) {
    const k = c.cond;
    return k.offGuard || k.prone || k.unconscious || k.paralyzed || k.asleep || k.blinded || k.restrained || k.grabbed || c.status === DOWN;
}

export function multipleAttackPenalty(strike, attacksMade) {
    if (attacksMade <= 0) return 0;
    if (attacksMade === 1) return strike.agile ? 4 : 5;
    return strike.agile ? 8 : 10;
}

// AC against a specific attack. flanked: whether the attacker is flanking.
export function armorClass(defender, { ranged = false, coverBonus = 0, flanked = false, shieldRaised } = {}) {
    let ac = defender.ac - statusPenalty(defender, "ac") + effectBonus(defender, "ac");
    const raised = shieldRaised ?? defender.shield?.raised;
    const shieldBonus = raised && defender.shield && !defender.shield.broken ? defender.shield.ac : 0;
    const cover = ranged && defender.band !== "engaged" ? coverBonus : 0;
    ac += Math.max(shieldBonus, cover);
    if (flanked || isOffGuard(defender)) ac -= 2;
    return ac;
}

export function saveModifier(c, save) {
    return (c.saves?.[save] ?? 0) - statusPenalty(c, save) + effectBonus(c, save);
}

// The Will modifier used for the morale threshold: no condition penalties.
export function baseWill(c) {
    return c.saves?.will ?? 0;
}

export function deathThreshold(c) {
    return 4 - (c.cond.doomed ?? 0);
}

export function hpFraction(c) {
    return c.hp.max > 0 ? Math.max(0, c.hp.value) / c.hp.max : 0;
}

export function enemiesOf(state, c) {
    return state.list.filter((other) => other.side !== c.side);
}

export function alliesOf(state, c) {
    return state.list.filter((other) => other.side === c.side && other !== c);
}
