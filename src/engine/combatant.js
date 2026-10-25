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
    immobilized: false, restrained: false, grabbed: false, confused: false
});

// A condition the creature always has (B50: the zombie's Slow, "permanently Slowed 1"): back at least to its value whenever its
// turn starts, and as the fight starts (frightened would otherwise fade at the end of each turn).
export function keepPermanent(c) {
    for (const entry of c.permanent ?? []) {
        if (entry.slug === "quickened") c.cond.quickened = true;
        // (Naturally invisible, B58: as hidden, the way attackers find it.)
        else if (entry.slug === "invisible") c.cond.hidden = true;
        else c.cond[entry.slug] = Math.max(Number(c.cond[entry.slug]) || 0, Number(entry.value) || 1);
    }
}

// (B302, Extra Reaction: that many reactions a round — reactionUsed is true once they're all spent; set false at its turn's start, they're back.)
function countReactions(c) {
    c.reactionsSpent = 0;
    Object.defineProperty(c, "reactionUsed", {
        get() {
            return this.reactionsSpent >= this.reactionsPerRound;
        },
        set(used) {
            this.reactionsSpent = used ? this.reactionsSpent + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    return c;
}

// Shield, the spell (2026-10-14): a creature without a shield of its own that knows it has a magic shield it raises by casting it (+1 AC
// until its next turn; Shield Block with it, without the feat, against spells too). No Hit Points: blocking ends the spell, and it
// can't be cast again for 10 minutes (the fight), so the shield counts as broken after.
function spellShield(spec) {
    const spell = (spec.spells ?? []).find((entry) => entry.spellShield);
    if (!spell) return null;
    return { name: spell.name, ac: spell.spellShield.ac ?? 1, hardness: spell.spellShield.hardness ?? 5, hp: 1e9, maxHp: 1e9, bt: 0, raised: false, broken: false, spell: true };
}

export function createCombatant(spec) {
    const conditions = { ...EMPTY_CONDITIONS, ...(spec.conditions ?? {}) };
    const persistent = (spec.conditions?.persistent ?? []).map((entry) => ({ ...entry }));
    delete conditions.persistent;
    let status = ACTIVE;
    if (spec.status === DEAD) status = DEAD;
    else if (spec.arrivesRound && spec.arrivesRound > 0) status = PENDING;
    // (B298: a summon's creature waits off the field until it's summoned.)
    else if (spec.reserve) status = PENDING;
    else if (spec.hp.value <= 0 || conditions.dying > 0 || conditions.unconscious) status = spec.kind === "pc" ? DOWN : DEAD;
    const c = {
        ...spec,
        // (H1: a hydra's heads, this fight's own; its spare reactions too, which severed heads take.)
        ...(spec.hydra ? { hydra: { ...spec.hydra, heads: spec.hydra.heads ?? spec.hydra.count, stumps: spec.hydra.stumps ?? 0, headDamage: 0 }, regeneration: spec.regeneration ? { ...spec.regeneration } : spec.regeneration } : {}),
        ...(spec.spareReactions?.length ? { spareReactions: spec.spareReactions.map((entry) => ({ ...entry, names: [...entry.names] })) } : {}),
        // (T4: immunities its abilities add, Protean Anatomy's polymorph.)
        ...(spec.addedImmunities?.length ? { immunities: [...new Set([...(spec.immunities ?? []), ...spec.addedImmunities])] } : {}),
        // (A familiar's own state, this fight's: Familiar Focus used.)
        ...(spec.familiar ? { familiar: { ...spec.familiar } } : {}),
        hp: { value: spec.hp.value, max: spec.hp.max, temp: spec.hp.temp ?? 0 },
        startHp: spec.hp.max,
        cond: conditions,
        persistent,
        shield: spec.shield ? { ...spec.shield, raised: !!spec.shield.raised } : spellShield(spec),
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
        // (U2: a bomb not in hand is taken out — or made with Quick Alchemy — before the first throw.)
        ...((spec.strikes ?? []).some((strike) => strike.ammo?.startsEmpty) ? { unloaded: new Set(spec.strikes.filter((strike) => strike.ammo?.startsEmpty).map((strike) => strike.name)) } : {}),
        // A free critical-hit defence's uses are the fight's own.
        ...(spec.critDowngrade ? { critDowngrade: { ...spec.critDowngrade } } : {}),
        // A magus starts a fight with Spellstrike charged.
        ...(spec.spellstrike ? { spellstrikeCharged: spec.spellstrikeCharged ?? true } : {}),
        timers: []
    };
    return spec.reactionsPerRound > 1 ? countReactions(c) : c;
}

// Swallowed creatures (Swallow Whole) are still fighting, but out of everyone else's reach; so is an incorporeal one inside the floor or a
// wall (space.js isIncorporeal).
export function isActive(c) {
    // (2026-10-22, Containment: in its field, out of reach — spells.js heldTurnStart.)
    // (2026-10-22, Maze of Locked Doors: in its maze, out of the fight.)
    return c.status === ACTIVE && !c.swallowedBy && !c.insideObject && !c.contained && !(c.hindrances?.length && hinderedBy(c, "mazed"));
}

// asleep: a spell's unconsciousness (Sleep), which damage ends; the creature stays in the fight.
export function canAct(c) {
    return c.status === ACTIVE && !c.cond.unconscious && !c.cond.paralyzed && !c.cond.asleep && c.acts !== false;
}

// Immobilized, restrained and grabbed creatures can't Stride or Step; nor can a hazard.
export function canMove(c) {
    return !c.cond.immobilized && !c.cond.restrained && !c.cond.grabbed && c.kind !== "hazard";
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
    if (kind === "will" || kind === "spell" || kind === "perception") penalty = Math.max(penalty, k.stupefied ?? 0);
    // (Fascinated: -2 to Perception and skill checks.)
    if (k.fascinated && (kind === "perception" || kind === "skill")) penalty = Math.max(penalty, 2);
    if (k.fatigued && (kind === "ac" || kind === "fortitude" || kind === "reflex" || kind === "will")) penalty = Math.max(penalty, 1);
    // Status penalties from spell effects don't stack with the conditions' either.
    if (c.effects?.length) penalty = Math.max(penalty, effectStatusPenalty(c, kind === "melee" || kind === "ranged" ? "attack" : kind));
    return penalty;
}

export function isOffGuard(c) {
    // (T4: attached to a creature, as most Attach say.)
    if (c?.attachedTo && c.attach?.offGuard) return true;
    // (2026-10-22, under water without a swim Speed — void.js.)
    if (c?.inWater && !(c.swimSpeed > 0)) return true;
    const k = c.cond;
    // (2026-10-22, the battlefields: on uneven ground or a narrow surface, or climbing — grid-fight.js regroup, actions.js climb.)
    // (2026-10-25: the whole field's uneven ground or narrow surface — weather.js.)
    if (c.footing || c.climbing || c.groundFooting) return true;
    return k.offGuard || k.prone || k.unconscious || k.paralyzed || k.asleep || k.blinded || k.restrained || k.grabbed || k.confused || c.status === DOWN;
}

// A Strike a disarmed creature can't make until it picks its weapon up (Disarm),
// or a two-handed one while a hand carries an objective's item.
export function strikeUsable(c, strike) {
    return !strike.underwaterBlocked && !strike.weatherBlocked && !c.dropped?.has(strike.name) && !(c.carrying && strike.hands === 2) && (!strike.ammo || ammoLeft(c, strike) > 0) && !(c.hindrances?.length && hinderedBy(c, "muzzled") && MOUTH.test(String(strike.name ?? "")));
}

// (2026-10-22, family 4: what a spell keeps the creature from — spells.js applyHinder, lasting.js "hindrances". Binding Muzzle: an attack
// from the mouth.)
export const hinderedBy = (c, kind) => (c?.hindrances ?? []).find((entry) => entry.kind === kind) ?? null;
// (2026-10-22, family 5: a defence a spell gives it — spells.js applyDefence, lasting.js "defences".)
export const defenceOf = (c, kind) => (c?.defences ?? []).find((entry) => entry.kind === kind) ?? null;
export const MOUTH = /\b(?:jaws?|bite|beak|fangs?|mandibles?|tongue|maw|proboscis|mouth)\b/i;

// U2 (2026-10-15), bombs: a Strike with a thrown consumable (strike.ammo: { pool, reagents, startsEmpty }) — its stack, and for an alchemist
// with Quick Alchemy the infused reagents that make more.
export function ammoLeft(c, strike) {
    return (c.spellPools?.[strike.ammo.pool] ?? 0) + (strike.ammo.reagents ? c.spellPools?.reagents ?? 0 : 0);
}

// One thrown: from the stack first, then a reagent. Returns where it came from ("stock" or "reagent"), or null.
export function spendAmmo(c, strike) {
    if (!strike?.ammo) return null;
    if ((c.spellPools?.[strike.ammo.pool] ?? 0) > 0) {
        c.spellPools[strike.ammo.pool]--;
        return "stock";
    }
    if (strike.ammo.reagents && (c.spellPools?.reagents ?? 0) > 0) {
        c.spellPools.reagents--;
        return "reagent";
    }
    return null;
}

// The circumstance penalty a weakened grip gives a Strike (Disarm's success).
export function gripPenalty(c, strike) {
    return c.weakGrip?.get(strike.name) ?? 0;
}

// Off-guard to one attacker only (Feint, Create a Diversion): the target is
// off-guard against that creature's attacks (melee ones, for Feint).
export function offGuardTo(target, attacker, melee) {
    return (target.offGuardTo ?? []).some((entry) => entry.attacker === attacker?.id && (entry.attacks !== "melee" || melee) && (entry.uses ?? 1) > 0);
}

export function multipleAttackPenalty(strike, attacksMade) {
    // A hazard's Strike: "No multiple attack penalty".
    if (attacksMade <= 0 || strike.noMap) return 0;
    if (attacksMade === 1) return strike.agile ? 4 : 5;
    return strike.agile ? 8 : 10;
}

// AC against a specific attack. flanked: whether the attacker is flanking.
// options: the attack's roll options, for an effect's conditional AC (Tempest Cloak's against ranged physical attacks).
export function armorClass(defender, { ranged = false, coverBonus = 0, flanked = false, shieldRaised, options = null } = {}) {
    let ac = defender.ac - statusPenalty(defender, "ac") + effectBonus(defender, "ac", options);
    const raised = shieldRaised ?? defender.shield?.raised;
    const shieldBonus = raised && defender.shield && !defender.shield.broken ? defender.shield.ac : 0;
    // (2026-10-25: the whole field's cover — heavy undergrowth — against ranged attacks; weather.js.)
    const cover = ranged && defender.band !== "engaged" ? Math.max(coverBonus, defender.groundCover ?? 0) : 0;
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

// (Diehard: dying 5, as PF2e's sheet has it — c.deathAt.)
// (2026-10-15, Death Ward: an effect that suppresses Doomed — its value doesn't count while it lasts.)
export function deathThreshold(c) {
    const suppressed = c.effects?.some((effect) => effect.suppress?.includes("doomed"));
    return (c.deathAt ?? 4) - (suppressed ? 0 : c.cond.doomed ?? 0);
}

export function hpFraction(c) {
    return c.hp.max > 0 ? Math.max(0, c.hp.value) / c.hp.max : 0;
}
