// One simulated fight from a snapshot.

import { createRng } from "./rng.js";
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, flatCheck, rollCheck, SUCCESS } from "./checks.js";
import { ACTIVE, DEAD, DOWN, FLED, PENDING, SURRENDERED, canAct, canMove, createCombatant, isActive, isOffGuard, keepPermanent, strikeUsable } from "./combatant.js";
import { engage, engagedEnemies, leaveMelee, sameMelee } from "./space.js";
import { placeArrival, setUpGrid } from "./grid-fight.js";
import { applyDamage, castAnswers, dealDamage, expectedHitDamage, interact, killCreature, leaveField, performRend, performStrike, provoke, raiseShield, recoveryCheck, releaseGrabs, stand, step, stride, turnEndAnswers, turnStartAnswers } from "./actions.js";
import { canReact, spendReaction, chargeOn, chargeStrike, deltasFor, ducksFromCoverFire, grantAooAllies, multiStrikeOrder, fastHealingNow, isUndead, regenerating, rolledStrikes, strikeNamed, sweepActionIndex, withExtraDamage } from "./abilities.js";
import { adjustInstance, adjustPart, rollPersistent, rollStrikeDamage, strikeContext } from "./damage.js";
import { MORALE_RULES, mergeMoraleRules } from "./morale-rules.js";
import { checkCantAffect, defaultMoraleProfile, fleeingAtTurnStart, helpArrives, initMorale, moraleRecovery, partyAdvantage, processMorale, routReady } from "./morale.js";
import { createObjective, endOfRoundObjective, performTask, settleObjectiveAfterLoss, settleObjectiveAfterWin, updateObjective } from "./objectives.js";
import { bestCastNow, bestOffense, chooseAction, computeThreats, guessRole } from "./planner.js";
import { spendPool, applyAuras, provokedReaction, applyCondition, saveEndsAtTurnEnd, applyConstantSpells, applyHeal, applyStrikeRider, battleMedicine, bothHitRider, castPlan, castSpell, conditionLostAnswers, describeSpell, endConditions, endWhileConditions, expireTimers, exploitVulnerability, grabTurnAnswers, hexSustains, initiativeReactions, overdrive, ownTurnStart, retch, rollCount, rollInstances, triggerRiders, turnStartReactions } from "./spells.js";
import { applyEffect, removeEffect } from "./effects.js";
import { chooseToggles } from "./toggles.js";
import { allyAdvance, bannersInspiration, pincerAttack, setUp, strikeHard } from "./commander.js";
import { shiftImmanence, sparkAtInitiative, transcend } from "./exemplar.js";
import { isMapObjective, mapOutcome, pickUpItem, placeOnMap } from "./map-objectives.js";
import { checkEscalations, dangerAtRoundEnd, setUpEscalations, soundGong, startDanger } from "./escalations.js";
import { activateHazard, disableHazard, isHazard, setUpHazards, triggererOf } from "./hazards.js";
import { zoneTurn } from "./zones.js";
import { activateSummons, summonTurnStart } from "./summons.js";
import { lastingTurnStart } from "./lasting.js";
import { noteStatesTurnStart } from "./note-states.js";
import { floorOf } from "./floors.js";
import { buildEnvironment, covenCast, covenTurnStart, hiddenAtTurnStart, lightAtStart, sunlightTurnEnd, terrainTurn } from "./environment.js";
import { attachedTurnStart, berserkTurnStart, followAttached, headsMend, hydraRegrow, inexorableTurnEnd, proteanTurnEnd } from "./creature-rules.js";
import { controlTurnStart } from "./control.js";
import { familiarFocus, familiarKeepsUp } from "./familiars.js";
import { championOpening, marchOfLaw, shatterDefenses, zealCritical } from "./champion.js";
import { castLuminance, dismissLuminance, luminanceTurnStart } from "./luminance.js";
import { initiativeFortune } from "./fortune-items.js";
import { ownAttacks, ownerDCs } from "./consumables.js";

export const DEFAULT_OPTIONS = Object.freeze({
    morale: true,
    heroPoints: true,
    objective: true,
    retreat: true,
    // The party retreats once retreatDowns PCs are down and its strength is below retreatRatio times the foes'
    // (retreatBy: "potential", what it can still deal, as morale's gate; "thisRound", the damage it deals this round).
    // Potential and half (user, 2026-10-14; was this round's damage and 1×): needless retreats from fights the party
    // would have won 2.6% → 1.5% of fights, the same parties saved from a wipe.
    retreatDowns: 2,
    retreatRatio: 0.5,
    retreatBy: "potential",
    roundCap: 20,
    flankChances: [0, 0, 0.5, 0.75, 0.9]
});

const MAX_ACTIONS_PER_TURN = 6;

// Fills in the defaults the engine derives from the snapshot: morale
// profiles, roles and party level. Overrides already on a combatant win.
export function prepareSnapshot(snapshot) {
    const combatants = snapshot.combatants.map((spec) => ({ ...spec }));
    const pcs = combatants.filter((c) => c.kind === "pc");
    const partyLevel = snapshot.partyLevel ?? (pcs.length ? Math.round(pcs.reduce((sum, c) => sum + c.level, 0) / pcs.length) : 1);
    const foes = combatants.filter((c) => c.side === "foes" && c.kind !== "object");
    const objective = snapshot.setup?.objective ?? null;
    for (const c of combatants) {
        if (!c.role) c.role = guessRole(c);
        if (c.side === "foes" && c.kind !== "pc") {
            const auto = defaultMoraleProfile(c, { foes, partyLevel, objective });
            c.morale = { ...auto, ...(c.morale ?? {}) };
        }
        c.reactions = { aoo: false, shieldBlock: false, ...(c.reactions ?? {}) };
        // (U14: a spellgun's attack, the creature's better spell or firearm attack.)
        if (c.spells?.some((spell) => spell.ownAttack)) c.spells = ownAttacks(c);
        // (U19: a save against its owner's own DC.)
        if (c.spells?.some((spell) => spell.ownerDC)) c.spells = ownerDCs(c);
        // A self-effect's extra damage, on the Strikes it names (B69).
        if (c.selfEffects?.some((entry) => entry.model?.strikeParts)) c.selfEffects = c.selfEffects.map((entry) => (entry.model?.strikeParts ? { ...entry, model: { ...entry.model, strikeDeltas: deltasFor(c.strikes ?? [], entry.model.strikeParts) } } : entry));
    }
    return { ...snapshot, partyLevel, combatants };
}

// A prepared fight state without initiative, for tests that set up exact situations.
export function createFightState(snapshot, options = {}, seed = 1) {
    const merged = { ...DEFAULT_OPTIONS, ...options, moraleRules: options.moraleRules ?? mergeMoraleRules(snapshot.moraleRules) };
    const state = createState(prepareSnapshot(snapshot), merged, seed, true);
    state.round = 1;
    computeThreats(state);
    return state;
}

// A spell's outcomes on one target at each degree don't change from one fight of a snapshot to the next (its creatures and
// spells are the same), so the fights of a batch share them (spells.js outcomesFor).
const OUTCOME_CACHES = new WeakMap();
function outcomeCache(snapshot) {
    let cache = OUTCOME_CACHES.get(snapshot);
    if (!cache) {
        cache = new WeakMap();
        OUTCOME_CACHES.set(snapshot, cache);
    }
    return cache;
}

function createState(snapshot, options, seed, withLog) {
    const list = snapshot.combatants.map(createCombatant);
    for (const c of list) keepPermanent(c);
    const state = {
        rng: createRng(seed),
        seed,
        round: snapshot.round ?? 0,
        list,
        byId: new Map(list.map((c) => [c.id, c])),
        melees: new Map(),
        nextMeleeId: 1,
        options,
        setup: snapshot.setup ?? {},
        moraleRules: options.moraleRules ?? MORALE_RULES,
        objective: options.objective ? createObjective(snapshot.setup?.objective, snapshot.partyLevel) : null,
        pendingEvents: [],
        log: withLog ? [] : null,
        damageBy: { party: 0, foes: 0 },
        stats: { moraleChecks: 0, moraleFailures: 0, moraleBreaks: 0, moraleRecoveries: 0, moraleGated: 0, heroPointsSpent: 0, reactions: 0, partyItemsUsed: 0, foeItemsUsed: 0 },
        outcome: null,
        spellOutcomes: outcomeCache(snapshot),
        surprisedSide: null,
        // The party's level (the morale DC in "partyLevel" mode).
        partyLevel: snapshot.partyLevel ?? Math.max(1, Math.round(list.filter((c) => c.kind === "pc").reduce((sum, c, _, pcs) => sum + c.level / pcs.length, 0)))
    };
    if (!options.heroPoints) for (const c of list) c.heroPoints = 0;
    // Grab, Knockdown and Push after a hit (spells.js resolves them).
    state.onStrikeHit = (attacker, target, strike, degree) => triggerRiders(state, attacker, target, strike, degree);
    // (B118, Hellish Revenge: an ability used out of its turn, at the targets the planner likes best.)
    state.pickCastNow = (c, spellIndices) => bestCastNow(state, c, spellIndices);
    // Poison Weapon (B72): the poison's affliction on the creature hit.
    state.onPoison = (attacker, target) => {
        state.log?.push(`  ${attacker.poisonWeapon.spell.name} from ${attacker.name}'s weapon`);
        castPlan(state, attacker, attacker.poisonWeapon.spell, [target.id]);
    };
    // (B298: a summon's creatures join the turns as it says.)
    state.joinInitiative = (c) => insertArrival(state, c);
    // Before placing: an escalation's creatures wait off the field, and so do hazards not yet set off.
    setUpEscalations(state, snapshot.setup?.escalations);
    setUpHazards(state, snapshot.setup?.escalations);
    placeCombatants(state);
    placeOnMap(state);
    // (2026-10-21: on the square grid, an option of the run — its layout, or the scene's map and squares; not with a map objective's
    // distances, which have their own.)
    const grid = options.grid ?? snapshot.setup?.grid ?? null;
    if (grid && !isMapObjective(state.objective)) setUpGrid(state, grid);
    initMorale(state);
    // (L1–L5: the fight's light, weather and ground; light blindness and sunlight as it starts.)
    state.environment = buildEnvironment(snapshot.setup?.environment);
    lightAtStart(state, { applyCondition });
    const strongest = list.filter((c) => c.side === "foes" && c.kind !== "object").sort((a, b) => b.level - a.level || b.hp.max - a.hp.max)[0];
    state.strongestFoeId = strongest?.id ?? null;
    return state;
}

// Rebuilds Melees from the snapshot's engagement groups.
function placeCombatants(state) {
    const groups = new Map();
    for (const c of state.list) {
        if (c.status === PENDING) {
            c.band = c.arrivesBand ?? "near";
            continue;
        }
        if (c.engagement !== undefined && c.engagement !== null && isActive(c)) {
            if (!groups.has(c.engagement)) groups.set(c.engagement, []);
            groups.get(c.engagement).push(c);
        } else if (c.band === "engaged") {
            c.band = "near";
        }
    }
    for (const members of groups.values()) {
        const sides = new Set(members.map((c) => c.side));
        if (sides.size < 2) {
            for (const c of members) c.band = "near";
            continue;
        }
        const [first, ...rest] = members;
        const opponent = rest.find((c) => c.side !== first.side);
        engage(state, first, opponent);
        for (const c of rest) if (c !== opponent) engage(state, c, first);
    }
}

// (B303: the skill its abilities name for its own initiative — "rolls Deception or Stealth for initiative" — that's best and better than its
// Perception: { stat, value }, or null.)
export function initiativeSkill(c) {
    let best = null;
    for (const stat of c.initiativeSkills ?? []) {
        const value = stat === "stealth" ? c.stealth ?? c.skills?.stealth : c.skills?.[stat];
        if (typeof value === "number" && value > (c.perception ?? 0) && (!best || value > best.value)) best = { stat, value };
    }
    return best;
}

function rollInitiative(state, snapshot) {
    const ambush = snapshot.setup?.ambush ?? null;
    if (ambush === "party") state.surprisedSide = "foes";
    else if (ambush === "foes") state.surprisedSide = "party";
    state.stealthInitiative = new Set();
    // What each rolls: Stealth for an ambushing side; else the best skill its abilities name for its initiative (Surprise Attack's Deception,
    // Roaring Initiative's Intimidation; B303) when it's better than its Perception; else Perception.
    const usesStealth = (c) => ambush && ambush === c.side && typeof c.stealth === "number";
    state.initiativeStat = new Map(state.list.map((c) => [c.id, usesStealth(c) ? { stat: "stealth", value: c.stealth } : initiativeSkill(c) ?? { stat: "perception", value: c.perception ?? 0 }]));
    // (B170, Guide's Warning: its allies' initiative rolls a circumstance bonus higher, when it rolls Perception (or a skill it names) — its
    // reaction, or a free action.)
    const warned = new Map();
    for (const c of state.list) {
        const stat = state.initiativeStat.get(c.id).stat;
        if (!c.initiativeWarning || (stat !== "perception" && !(c.initiativeWarning.skills ?? []).includes(stat)) || (!c.initiativeWarning.free && !canReact(c, c.initiativeWarning.name))) continue;
        if (!c.initiativeWarning.free) spendReaction(c, c.initiativeWarning.name);
        state.log?.push(`  ${c.name} uses ${c.initiativeWarning.name}: +${c.initiativeWarning.value} to its ${c.initiativeWarning.self ? "own" : "allies'"} initiative`);
        // (B260, All This Has Happened Before: its own roll.)
        if (c.initiativeWarning.self) {
            warned.set(c.id, Math.max(warned.get(c.id) ?? 0, c.initiativeWarning.value));
            continue;
        }
        // (B178, Warning Ears: within 10 feet, the allies in its melee.)
        const near = (ally) => !c.initiativeWarning.within || c.initiativeWarning.within > 10 || sameMelee(ally, c);
        for (const ally of state.list) if (ally !== c && ally.side === c.side && near(ally)) warned.set(ally.id, Math.max(warned.get(ally.id) ?? 0, c.initiativeWarning.value));
    }
    // (U11: whose side is the weaker, for a PC's initiative talisman.)
    if (state.list.some((c) => c.fortuneItems?.some((entry) => entry.selector === "initiative"))) computeThreats(state);
    const rolled = state.list.map((c) => {
        const roll = state.initiativeStat.get(c.id);
        if (roll.stat === "stealth") state.stealthInitiative.add(c.id);
        if (roll.stat !== "perception" && !usesStealth(c)) state.log?.push(`  ${c.name} rolls ${roll.stat.replace(/-/g, " ")} for initiative`);
        // Ten Paces: +2 circumstance to the initiative roll (C18); not with another circumstance bonus.
        const modifier = roll.value + Math.max(c.initiativeBonus ?? 0, warned.get(c.id) ?? 0);
        // (U11, Eye of Apprehension: Perception for initiative rolled twice, the higher kept.)
        const twice = roll.stat === "perception" && c.fortuneItems?.length && initiativeFortune(state, c);
        return { c, total: (twice ? Math.max(state.rng.d20(), state.rng.d20()) : state.rng.d20()) + modifier, modifier };
    });
    rolled.sort((a, b) => (b.total - a.total) || ((a.c.side === "foes" ? 0 : 1) - (b.c.side === "foes" ? 0 : 1)) || (b.modifier - a.modifier));
    state.order = rolled.map((entry) => entry.c.id);
    state.initiative = new Map(rolled.map((entry) => [entry.c.id, entry.total]));
}

// Gunslinger deeds when initiative is rolled (C18): Living Fortification's AC until
// the end of its first turn; One Shot, One Kill after a Stealth initiative; Energy Shot's three Strikes.
function initiativeDeeds(state) {
    for (const c of state.list) {
        if (c.status !== ACTIVE) continue;
        if (c.livingFortification) {
            const effect = applyEffect(state, c, { name: "Living Fortification", rounds: Infinity, modifiers: [{ on: "ac", type: "circumstance", value: c.livingFortification }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 }, c, { key: "living-fortification" });
            (c.timers ??= []).push({ effect, round: state.round, turnOf: c.id, at: "end" });
            state.log?.push(`  ${c.name} uses Living Fortification (+${c.livingFortification} AC until the end of its first turn)`);
        }
        if (c.firstShot && state.stealthInitiative?.has(c.id)) c.firstShotReady = c.firstShot.dice;
        // An exemplar's free Shift Immanence (C25).
        if (c.exemplar) sparkAtInitiative(state, c);
        if (c.energyShots) c.energyShotsLeft = c.energyShots;
    }
}

function insertArrival(state, c) {
    const total = state.rng.d20() + (c.perception ?? 0);
    state.initiative.set(c.id, total);
    state.order = state.order.filter((id) => id !== c.id);
    let index = state.order.findIndex((id) => (state.initiative.get(id) ?? 0) < total);
    if (index < 0) index = state.order.length;
    state.order.splice(index, 0, c.id);
}

function arrivals(state) {
    let foesArrived = false;
    for (const c of state.list) {
        if (c.status === PENDING && c.arrivesRound <= state.round) {
            c.status = ACTIVE;
            c.band = c.arrivesBand === "engaged" ? "near" : (c.arrivesBand ?? "near");
            // At a Region (an escalation's arrival): its place on the map.
            if (c.arrivePlace && c.areaFeet !== undefined) {
                c.areaFeet = c.arrivePlace.area ?? c.areaFeet;
                c.exitFeet = c.arrivePlace.exit ?? c.exitFeet;
            }
            insertArrival(state, c);
            placeArrival(state, c);
            state.log?.push(`  ${c.name} arrives (${c.band})`);
            if (c.side === "foes" && c.kind !== "object") foesArrived = true;
        }
    }
    // Help arriving steadies wavering foes (E2).
    if (foesArrived) helpArrives(state);
}

// What a rule does besides bringing creatures (danger, hazards: E3, E4).
const ESCALATION_EFFECTS = {
    danger: startDanger,
    hazard: (state, rule) => activateHazard(state, state.byId.get(rule.then.hazardId), triggererOf(state, rule), { castPlan, describeSpell, performStrike, joinInitiative: insertArrival })
};

function pcs(state) {
    return state.list.filter((c) => c.side === "party" && c.kind === "pc");
}

function checkEnd(state) {
    if (state.outcome) return true;
    updateObjective(state);
    checkEscalations(state, ESCALATION_EFFECTS);
    // Holding the area, or getting away with the escort or the item, ends the fight.
    if (isMapObjective(state.objective) && state.objective.status === "success") {
        finish(state, mapOutcome(state.objective));
        return true;
    }
    // (2026-10-13: a PC swallowed or engulfed is still in the fight — it can cut itself free or Escape; the party is beaten only when none is
    // up, inside a creature or out.)
    if (!pcs(state).some((c) => isActive(c) || (c.status === ACTIVE && c.swallowedBy))) {
        finish(state, "defeat");
        return true;
    }
    // Hazards don't hold a fight open once the creatures are beaten, unless they're all there is.
    const creatures = state.list.filter((c) => c.side === "foes" && c.kind !== "object" && !isHazard(c));
    const foes = creatures.length ? creatures : state.list.filter((c) => c.side === "foes" && isHazard(c));
    // Creatures waiting on an escalation rule that hasn't fired may never come: they don't hold a fight open.
    const coming = (c) => c.status === PENDING && c.arrivesRound != null;
    const remaining = foes.filter((c) => c.status === ACTIVE || coming(c));
    if (!remaining.length) {
        finish(state, foes.some((c) => c.status === FLED) ? "rout" : "decisive");
        return true;
    }
    if (state.options.morale) {
        const surviving = foes.filter((c) => c.status === ACTIVE);
        let broken = surviving.filter((c) => c.cond.fleeing || c.moraleState.broken).length;
        let survivors = surviving.length;
        // M30: those who already gave up (surrendered, or fled on a failed check) are surviving and broken too.
        if (state.moraleRules.routCountsGivenUp) {
            const gaveUp = foes.filter((c) => c.status === SURRENDERED || (c.status === FLED && c.moraleState?.broken)).length;
            broken += gaveUp;
            survivors += gaveUp;
        }
        if (surviving.length && !foes.some(coming) && routReady(state, broken, survivors)) {
            // M38: those fighting to the death hold out; the rest flee, and the fight goes on.
            const holdouts = surviving.filter((c) => c.moraleState?.toTheDeath && !c.cond.fleeing);
            if (!holdouts.length) {
                pursuit(state, surviving);
                finish(state, "rout");
                return true;
            }
            for (const c of surviving) {
                if (holdouts.includes(c) || c.cond.fleeing || c.moraleState?.broken || !c.moraleState) continue;
                c.moraleState.broken = true;
                c.cond.fleeing = true;
                state.log?.push(`  ${c.name} flees with the rout; ${holdouts.map((each) => each.name).join(", ")} fight${holdouts.length === 1 ? "s" : ""} on to the death`);
            }
        }
    }
    return false;
}

// A group rout: each active PC gets one Strike at a fleeing foe it can reach,
// then every foe still standing escapes.
function pursuit(state, surviving) {
    state.log?.push(`Round ${state.round}: the foes rout; pursuit`);
    state.stats.groupRout = true;
    const objectiveTarget = state.objective?.kind === "target" ? state.objective.targetId : null;
    for (const pc of pcs(state)) {
        if (!canAct(pc)) continue;
        const fleeing = surviving.filter((c) => c.status === ACTIVE && (c.cond.fleeing || c.moraleState.broken));
        fleeing.sort((a, b) => (b.id === objectiveTarget) - (a.id === objectiveTarget) || a.hp.value - b.hp.value);
        for (const target of fleeing) {
            const strike = (pc.strikes ?? []).find((s) => (s.melee ? engagedEnemies(state, pc).includes(target) : true));
            if (!strike) continue;
            performStrike(state, pc, target, strike, { reaction: true });
            break;
        }
    }
    for (const c of surviving) {
        if (c.status === ACTIVE) {
            leaveMelee(state, c, "gone");
            c.status = FLED;
        }
    }
    state.pendingEvents = [];
}

function finish(state, outcome) {
    state.outcome = outcome;
    if (["decisive", "rout", "survived", "held", "escaped"].includes(outcome)) settleObjectiveAfterWin(state);
    else settleObjectiveAfterLoss(state);
    state.log?.push(`Outcome: ${outcome}${state.objective ? `; objective ${state.objective.status}` : ""}`);
}

// Frenzied Slashes (B62): "The pusk gains the Clumsy 2 condition until the beginning of its next turn."
function multiStrikeAfter(state, c, ability) {
    for (const entry of ability.after ?? []) {
        // (B200, Power Through: Fatigued until it saves — for the rest of the fight here.)
        const duration = entry.until === "save" ? null : { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" };
        if (applyCondition(state, c, entry.slug, entry.value ?? null, duration, c)) state.log?.push(`  ${c.name} is ${entry.slug}${Number.isFinite(entry.value) ? ` ${entry.value}` : ""}`);
    }
}

function startTurn(state, c) {
    keepPermanent(c);
    // (2026-10-20: a new save at the start of its turn, the item module's.)
    if (c.saveEnds?.some((entry) => entry.timing === "start") && c.status === ACTIVE) saveEndsAtTurnEnd(state, c, "start");
    c.reactionUsed = false;
    c.spareUsed = null;
    // (C30: Divine Fervor's extra reaction is gone as its turn starts; C33: temporary HP that last to its next turn — Immortal Bastion's.)
    if (c.spareReactions?.some((entry) => entry.untilTurn)) c.spareReactions = c.spareReactions.filter((entry) => !entry.untilTurn);
    if (c.tempHpUntilTurn) {
        c.hp.temp = 0;
        c.tempHpUntilTurn = false;
    }
    c.attacksThisTurn = 0;
    c.round = state.round;
    c.riderReady = null;
    c.rendUsed = false;
    c.withdrewThisTurn = false;
    // (B313: a grip a Disarm weakened is firm again at the start of the creature's turn, as PF2e has it. Before, it stayed weak until the
    // creature spent an action to regrip.)
    c.weakGrip?.clear();
    // Flourishes (Flurry of Blows): once a turn. A finisher ends Strikes for the turn.
    c.usedThisTurn = new Set();
    // (What it Sustains as the turn starts — a hex its familiar answers.)
    c.sustainedNow = [];
    // (C35: Vital Luminance's reservoir grows.)
    if (c.luminance) luminanceTurnStart(state, c);
    // (Its familiar beside it.)
    familiarKeepsUp(state, c);
    // (S22: a wand it may overcharge, only while the fight goes badly for its side.)
    if (c.spells?.some((spell) => spell.overcharge)) c.desperate = desperate(state, c);
    // Actions this turn, and its last hit (Strike, Breathe, Rend needs one just before).
    c.actionCount = 0;
    c.lastHit = null;
    c.lastStrike = null;
    c.noAttacksThisTurn = false;
    c.turnAttacks = [];
    if (c.shield) c.shield.raised = false;
    // A complex hazard: its routine's actions.
    let actions = isHazard(c) ? (c.hazard?.routineActions ?? 1) : 3 + (c.cond.quickened ? 1 : 0);
    if (c.cond.stunned > 0) {
        const lost = Math.min(c.cond.stunned, actions);
        c.cond.stunned -= lost;
        actions -= lost;
    }
    actions -= Math.min(actions, c.cond.slowed);
    c.actionsLeft = Math.min(actions, isHazard(c) ? 9 : MAX_ACTIONS_PER_TURN);
    // (B298: a minion's two actions; its summons' time, and a sustained one's action.)
    summonTurnStart(state, c);
    // (Calm, the charm spells, a condition floor: those that ran out end; a sustained one, an action.)
    lastingTurnStart(state, c);

    // (Command's actions, a dance's: spent as its turn starts.)
    noteStatesTurnStart(state, c);
    // (B308: coming out of its shell takes an action.)
    if (c.inShell) {
        c.inShell = false;
        if (c.actionsLeft > 0) c.actionsLeft -= 1;
        state.log?.push(`  ${c.name} comes out of its shell`);
    }
    // Collapsed (B59): it re-forms with its first action.
    if (c.collapsed && c.actionsLeft > 0 && isActive(c)) {
        c.actionsLeft -= 1;
        c.collapsed = false;
        c.cond.immobilized = false;
        c.cond.offGuard = false;
        state.log?.push(`  ${c.name} re-forms`);
    }
    // Fast healing (the creature's own, or from spell effects) and regeneration.
    const fastHealing = fastHealingNow(state, c);
    if (fastHealing > 0) applyHeal(state, c, fastHealing);
    if (regenerating(c, state) && c.regeneratedRound !== state.round) applyHeal(state, c, c.regeneration.value);
    // (H1: a hydra's stumps regrow heads after it regenerates.)
    if (c.hydra?.stumps && regenerating(c, state)) hydraRegrow(state, c);
}

// Regeneration: a downed monster regains its HP at the start of its turn, loses
// dying (wounded +1) and gets back into the fight, prone.
function regenerateUp(state, c) {
    c.status = ACTIVE;
    c.hp.value = Math.min(c.hp.max, c.regeneration.value);
    c.cond.dying = 0;
    c.cond.wounded = (c.cond.wounded ?? 0) + 1;
    c.cond.unconscious = false;
    c.cond.prone = true;
    c.band = "near";
    c.regeneratedRound = state.round;
    state.log?.push(`${c.name} regenerates and wakes (${c.hp.value}/${c.hp.max})`);
}

// Confused: every action is a Strike at a random creature it can reach, friend
// or foe; with no one in reach it Strides to a random creature (or babbles, unable to move).
// (T4) Berserk: it attacks the nearest living creature, whichever side — one in its Melee (Berserk Slam when it has it), or it moves to one.
function berserkTurn(state, c) {
    let guard = 0;
    const living = (other) => other !== c && isActive(other) && !isUndead(other) && !(other.traits ?? []).includes("construct");
    const pick = (list) => list[Math.floor(state.rng.next() * list.length)];
    while (c.actionsLeft > 0 && canAct(c) && guard++ < 8) {
        const near = state.list.filter((other) => living(other) && sameMelee(c, other));
        const melee = (c.strikes ?? []).filter((strike) => strike.melee && strikeUsable(c, strike));
        const slam = (c.strikeActivities ?? []).findIndex((activity) => activity.requires === "berserk" && activity.actions <= c.actionsLeft);
        // (Its Berserk Slam needs a Strike to make: none left, none to slam with.)
        if (near.length && slam >= 0 && melee.length) {
            const activity = c.strikeActivities[slam];
            const strikeIndex = activity.strike ? strikeNamed(c, activity.strike) : c.strikes.indexOf(melee[0]);
            c.actionsLeft -= activity.actions;
            act(state, c, { type: "strikeActivity", index: slam, targetId: pick(near).id, strikeIndex: Math.max(0, strikeIndex) });
        } else if (near.length && melee.length) {
            c.actionsLeft--;
            performStrike(state, c, pick(near), melee.reduce((best, strike) => (strike.bonus > best.bonus ? strike : best), melee[0]));
        } else {
            const others = state.list.filter(living);
            const nearest = others.filter((other) => other.band !== "far");
            if (!others.length || !canMove(c)) break;
            c.actionsLeft--;
            stride(state, c, { kind: "engage", targetId: pick(nearest.length ? nearest : others).id });
        }
        afterAction(state);
        processMorale(state);
        if (checkEnd(state)) return;
    }
}

function confusedTurn(state, c) {
    let guard = 0;
    while (c.actionsLeft > 0 && canAct(c) && c.cond.confused && guard++ < 8) {
        const others = state.list.filter((other) => other !== c && isActive(other));
        const near = others.filter((other) => sameMelee(c, other));
        const melee = (c.strikes ?? []).filter((strike) => strike.melee && strikeUsable(c, strike));
        const ranged = (c.strikes ?? []).filter((strike) => !strike.melee && strikeUsable(c, strike));
        const pick = (list) => list[Math.floor(state.rng.next() * list.length)];
        c.actionsLeft--;
        if (near.length && melee.length) performStrike(state, c, pick(near), pick(melee));
        else if (others.length && ranged.length) performStrike(state, c, pick(others), pick(ranged));
        else if (others.length && canMove(c)) stride(state, c, { kind: "engage", targetId: pick(others).id });
        else state.log?.push(`  ${c.name} babbles, confused`);
        processMorale(state);
        if (checkEnd(state)) return;
    }
}

// Swallowed: it can only Escape or attack its swallower with an unarmed attack
// or a light weapon. It attacks when a hit would cut it free (Rupture), and
// otherwise tries to Escape.
function swallowedTurn(state, c) {
    const escape = (c.spells ?? []).findIndex((spell) => describeSpell(spell.plan).escape);
    let guard = 0;
    while (c.actionsLeft > 0 && canAct(c) && c.swallowedBy && guard++ < 8) {
        const swallower = state.byId.get(c.swallowedBy);
        let strikeIndex = -1;
        let best = 0;
        for (const [index, strike] of (c.strikes ?? []).entries()) {
            if (!strike.melee || (strike.held && !strike.light)) continue;
            const damage = expectedHitDamage(c, strike, swallower, false);
            if (damage > best) {
                best = damage;
                strikeIndex = index;
            }
        }
        const cutting = strikeIndex >= 0 && ["piercing", "slashing"].includes(c.strikes[strikeIndex].damage[0]?.type) && best >= (c.swallow?.rupture ?? Infinity);
        if (strikeIndex >= 0 && (cutting || escape < 0)) {
            c.actionsLeft--;
            performStrike(state, c, swallower, c.strikes[strikeIndex]);
        } else if (escape >= 0) {
            c.actionsLeft--;
            castSpell(state, c, escape, [swallower.id]);
        } else break;
        processMorale(state);
        if (checkEnd(state)) return;
    }
}

function endTurn(state, c) {
    // (C30, C34: who set off its champion's reaction, or took a hostile action against it, since its last turn — counted from this one's end.)
    c.triggeredBy?.clear();
    c.wrongedBy?.clear();
    // (B314: a new save against a condition that allows one.)
    if (c.saveEnds?.length && c.status === ACTIVE) saveEndsAtTurnEnd(state, c);
    // Panache from a failed bravado action lasts only this turn.
    if (c.panache === "turn") c.panache = false;
    // (B167: Attack of Opportunity from Tactical Direction ends with this turn; B176, Call to Arms': with the granter's next turn.)
    const ungrant = (ally) => {
        ally.grantedAoo = null;
        ally.reactions = { ...(ally.reactions ?? {}), aoo: false };
    };
    if (c.grantedAoo && !c.grantedAoo.untilSource) ungrant(c);
    for (const ally of state.list) if (ally.grantedAoo?.untilSource && ally.grantedAoo.by === c.id && ally.grantedAoo.round < state.round) ungrant(ally);
    // Wine-Soaked, Draining Roots: a passive on a creature held as a turn ends (B49).
    grabTurnAnswers(state, c, "end");
    // (B256: the zones it ends its turn in.)
    if (isActive(c)) zoneTurn(state, c, "end");
    // Swallow Whole's damage at the end of each of the swallowed creature's turns.
    if (c.swallowedBy && c.swallow?.damage?.length) {
        state.log?.push(`  ${c.name} is crushed inside ${state.byId.get(c.swallowedBy)?.name}`);
        applyDamage(state, c, rollInstances(state, c.swallow.damage), { source: state.byId.get(c.swallowedBy) });
    }
    for (const entry of [...c.persistent]) {
        if (c.status === DEAD || c.status === FLED || c.status === SURRENDERED) break;
        // (2026-10-16: with its materials — persistent fire treated as silver.)
        const amount = entry.materials?.length ? adjustPart(c, { type: entry.type, amount: rollPersistent(state.rng, entry), materials: entry.materials }) : adjustInstance(c, entry.type, rollPersistent(state.rng, entry));
        state.log?.push(`  ${c.name} takes ${amount} persistent ${entry.type}`);
        dealDamage(state, c, amount);
        if (flatCheck(state.rng, 15) >= SUCCESS) c.persistent.splice(c.persistent.indexOf(entry), 1);
    }
    // (Biting Snakes, B82: a Strike at it from a monster beside it.)
    if (isActive(c)) turnEndAnswers(state, c);
    // (T2, T4: Inexorable's slowed and stunned gone; Protean Anatomy's new senses.)
    if (isActive(c) && c.inexorable) inexorableTurnEnd(state, c);
    if (isActive(c) && c.protean) proteanTurnEnd(state, c);
    // (H1: a hydra's heads mend what didn't sever them.)
    headsMend(state);
    // (L2–L3: sunlight's slowing grows; the ground's Speed back.)
    if (c.sunlight) sunlightTurnEnd(state, c, { killCreature });
    terrainTurn(state, c, "end");
    // (A floor — Lift Nature's Caul's frightened 1 while stupefied — holds it.)
    if (c.cond.frightened > floorOf(c, "frightened")) {
        c.cond.frightened--;
        // (Consume Fear, B76: a monster's reaction to a creature near it no longer frightened.)
        if (c.cond.frightened === 0) conditionLostAnswers(state, c, "frightened");
    }
    // "Fleeing for as long as it's frightened" ends with the frightened.
    endWhileConditions(c);
    if (isActive(c)) moraleRecovery(state, c);
    // Fleeing from a spell or an ability runs out, and the creature comes back; only one that gave up
    // on a morale check leaves the field.
    if (c.cond.fleeing && isActive(c) && c.band === "far" && c.moraleState?.broken) leaveField(state, c);
    processMorale(state);
}

// (U2: a bomb taken out, or made with Quick Alchemy once the stack is gone.)
function reloadWords(c, strike) {
    if (!strike?.ammo) return `reloads ${strike?.name}`;
    return (c.spellPools?.[strike.ammo.pool] ?? 0) > 0 ? `takes out ${strike.name}` : `makes ${strike.name} with Quick Alchemy`;
}

function act(state, c, action) {
    // A rider (Grab, Knockdown) must follow the Strike straight away.
    const rider = c.riderReady;
    c.riderReady = null;
    switch (action.type) {
        // (B298: a summon.)
        case "summon":
            activateSummons(state, c, c.summons[action.index]);
            break;
        case "strike": {
            const target = state.byId.get(action.targetId);
            const strike = c.strikes[action.strikeIndex];
            // Reloading it first (Interact, the weapon's reload actions), then the shot empties it again.
            if (action.reload) {
                state.log?.push(`  ${c.name} ${reloadWords(c, strike)}`);
                c.unloaded?.delete(strike.name);
            }
            performStrike(state, c, target, strike);
            if (strike?.reload) (c.unloaded ??= new Set()).add(strike.name);
            break;
        }
        case "reload": {
            const strike = c.strikes[action.strikeIndex];
            state.log?.push(`  ${c.name} ${reloadWords(c, strike)}`);
            if (strike) c.unloaded?.delete(strike.name);
            break;
        }
        // An exemplar's spark (C25–C27).
        case "shiftImmanence":
            shiftImmanence(state, c, action.slug);
            break;
        case "transcend":
            transcend(state, c, c.exemplar.transcendences[action.index], action.targetId);
            break;
        // A commander's tactics (C21–C24).
        case "strikeHard":
            strikeHard(state, c, action);
            break;
        // (B183, Word of Advice.)
        case "allyAdvance":
            if (c.allyAdvance?.oncePerTurn) c.usedThisTurn?.add(c.allyAdvance.name);
            allyAdvance(state, c, action);
            break;
        case "pincerAttack":
            pincerAttack(state, c);
            break;
        case "bannersInspiration":
            if (c.commander?.inspirationFlourish) c.usedThisTurn?.add("flourish");
            bannersInspiration(state, c);
            break;
        // Spellstrike (C20): the Strike, then the spell it carries; two attacks for the penalty.
        case "spellstrike": {
            const target = state.byId.get(action.targetId);
            const spell = c.spells[action.spellIndex];
            state.log?.push(`  ${c.name} uses ${c.spellstrike.name} with ${spell?.name}`);
            c.spellstrikeCharged = false;
            if (!target || !spell) break;
            const result = performStrike(state, c, target, c.strikes[action.strikeIndex]);
            const attackSpell = spell.plan?.resolution?.check?.statistic === "spell-attack";
            // A save spell doesn't add to the penalty by itself; the Spellstrike still counts as two attacks.
            if (!attackSpell) c.attacksThisTurn++;
            if (!result) break;
            if (attackSpell) castSpell(state, c, action.spellIndex, [target.id], undefined, { forcedDegree: result.degree });
            else castSpell(state, c, action.spellIndex, [target.id], undefined, { disrupted: result.degree === 0 });
            break;
        }
        case "rechargeSpellstrike":
            c.spellstrikeCharged = true;
            state.log?.push(`  ${c.name} recharges ${c.spellstrike?.name ?? "Spellstrike"}`);
            break;
        // A slinger's reload (C17): reloading, and a Shove, a melee Strike, or Demoralize or Create a Diversion.
        case "slingersReload": {
            const strike = c.strikes[action.strikeIndex];
            state.log?.push(`  ${c.name} uses ${c.slingersReload.name}, reloading ${strike?.name}`);
            if (strike) c.unloaded?.delete(strike.name);
            const target = action.targetId ? state.byId.get(action.targetId) : null;
            if (!target || !isActive(target)) break;
            if (action.side === "strike") performStrike(state, c, target, c.strikes[action.sideIndex]);
            else if (action.side) castSpell(state, c, action.sideIndex, [target.id]);
            break;
        }
        case "stride":
            // (Speed Surge, B72: both moves in this action.)
            if (action.surge) {
                c.surgesUsed = (c.surgesUsed ?? 0) + 1;
                if (c.speedSurge?.recharge) c.surgeUntil = state.round + rollCount(state, c.speedSurge.recharge);
                state.log?.push(`  ${c.name} uses ${c.speedSurge?.name ?? "Speed Surge"}`);
            }
            stride(state, c, action.move);
            if (action.move.kind !== "engage") c.withdrewThisTurn = true;
            break;
        case "step":
            step(state, c);
            c.withdrewThisTurn = true;
            break;
        // Mythic (B72): a Mythic Point to end its worst condition, or to regain a spent spell (or Quickened Casting, or a recharge).
        case "mythicRemove":
            if ((c.mythicPoints ?? 0) > 0 && action.slug) {
                c.mythicPoints--;
                endConditions(c, [action.slug]);
                state.log?.push(`  ${c.name} uses ${c.mythic["remove-condition"].name}: no longer ${action.slug}`);
            }
            break;
        case "mythicRecharge":
            if ((c.mythicPoints ?? 0) > 0) {
                c.mythicPoints--;
                if (action.pool) c.spellPools[action.pool] = (c.spellPools[action.pool] ?? 0) + 1;
                else if (action.quickened) c.quickenedUsed = false;
                else if (Number.isInteger(action.spellIndex)) c.rechargeUntil?.delete(c.spells[action.spellIndex]?.rechargeGroup ?? c.spells[action.spellIndex]);
                state.log?.push(`  ${c.name} uses ${c.mythic.recharge.name}`);
            }
            break;
        // Poison Weapon (B72): an Interact (it provokes), then its weapon carries the poison.
        case "poisonWeapon":
            provoke(state, c, "manipulate");
            if (!canAct(c)) break;
            c.weaponPoisoned = true;
            c.poisonDoses = Math.max(0, (c.poisonDoses ?? c.poisonWeapon.doses) - 1);
            state.log?.push(`  ${c.name} uses ${c.poisonWeapon.name} (${c.poisonWeapon.spell.name})`);
            break;
        // Swift Leap, Jet (B70): out of the Melee without provoking.
        case "safeMove":
            if (canMove(c)) {
                releaseGrabs(state, c);
                leaveMelee(state, c, "near");
                state.log?.push(`  ${c.name} uses ${c.safeMove.name}`);
                c.withdrewThisTurn = true;
                if (c.safeMove.recharge) c.safeMoveUntil = state.round + rollCount(state, c.safeMove.recharge);
            }
            break;
        case "raiseShield":
            raiseShield(state, c);
            break;
        case "familiarFocus":
            familiarFocus(state, c);
            break;
        case "luminance":
            castLuminance(state, c);
            break;
        case "dismissLuminance":
            dismissLuminance(state, c, state.byId.get(action.targetId), { applyHeal, applyDamage });
            break;
        case "marchOfLaw":
            marchOfLaw(state, c, state.byId.get(action.targetId), { applyCondition, stride });
            break;
        case "stand":
            stand(state, c);
            break;
        case "task":
            performTask(state, c);
            break;
        case "pickUp":
            pickUpItem(state, c, provoke);
            break;
        case "soundGong":
            soundGong(state, c, provoke);
            break;
        case "disableHazard":
            disableHazard(state, c, state.byId.get(action.targetId), { provoke, performStrike });
            break;
        // (S22: a stowed scroll or wand taken out, for a cast that doesn't fit after it this turn.)
        case "drawItem": {
            const spell = c.spells[action.spellIndex];
            if (!spell?.draw) break;
            state.log?.push(`  ${c.name} takes out ${spell.from ?? spell.name} (${spell.draw.actions} action${spell.draw.actions === 1 ? "" : "s"})`);
            (c.itemsAtHand ??= new Set()).add(spell.item);
            break;
        }
        case "cast": {
            if (action.rider && !(rider && (rider.index === action.spellIndex || rider.also?.includes(action.spellIndex)))) break;
            if (action.quickened) {
                c.quickenedUsed = true;
                state.log?.push(`  ${c.name} uses ${c.quickenedCasting?.name ?? "Quickened Casting"}`);
            }
            // Casting with the manipulate trait provokes (S12; Reactive Strike's critical hit disrupts it), and with the
            // concentrate trait, the reactions that say so (B51).
            const spell = c.spells[action.spellIndex];
            // (S22: Trick Magic Item first. A failure costs its own action, not the cast's, and the item can't be tried again this turn;
            // a critical failure, not again this fight.)
            // (S22: a stowed item taken out first; it's at hand after, until a scroll is used up.)
            if (action.draw && spell?.draw) {
                state.log?.push(`  ${c.name} takes out ${spell.from ?? spell.name} (${spell.draw.actions} action${spell.draw.actions === 1 ? "" : "s"})`);
                (c.itemsAtHand ??= new Set()).add(spell.item);
            }
            if (action.trick && spell?.trick) {
                const { total, degree } = rollCheck(state.rng, spell.trick.modifier, spell.trick.dc);
                state.log?.push(`  ${c.name} tries Trick Magic Item on ${spell.from} (${spell.trick.skill}): ${total} vs ${spell.trick.dc} → ${["critical failure", "failure", "success", "critical success"][degree]}`);
                if (degree < SUCCESS) {
                    c.actionsLeft += castActions(c, action);
                    (c.usedThisTurn ??= new Set()).add(`trick:${spell.item}`);
                    if (degree === CRITICAL_FAILURE) (c.itemsLocked ??= new Set()).add(spell.item);
                    break;
                }
                (c.usedThisTurn ??= new Set()).add(`tricked:${spell.item}`);
            }
            // (B133, Tackle: its move first, to the creature.)
            const goal = spell?.plan?.approach?.strides ? state.byId.get(action.targetIds?.[0]) : null;
            if (goal && isActive(goal) && !sameMelee(c, goal) && canMove(c)) stride(state, c, { kind: "engage", targetId: goal.id });
            if (goal && (!isActive(goal) || !sameMelee(c, goal))) break;
            const traits = spell?.plan?.activation?.traits ?? spell?.plan?.traits ?? [];
            // (Deafened: an auditory action needs a DC 5 flat check, or it's lost — a spell's slot with it.)
            if (c.cond.deafened && traits.includes("auditory") && flatCheck(state.rng, 5) < SUCCESS) {
                spendPool(c, spell);
                state.log?.push(`  ${c.name} loses ${spell?.name ?? "the action"} (deafened)`);
                break;
            }
            let disrupted = traits.includes("manipulate") ? provoke(state, c, "manipulate") : false;
            if (canAct(c) && traits.includes("concentrate")) disrupted = provoke(state, c, "concentrate") || disrupted;
            // (B225: an auditory or a healing action, the reaction Strikes that say so.)
            // (B254, Objection!: a linguistic one too; B287, Protect the Scene: an emotion one.)
            for (const kind of ["auditory", "healing", "linguistic", "emotion"]) if (canAct(c) && traits.includes(kind)) disrupted = provoke(state, c, kind) || disrupted;
            // (B122, Spell Interception: a spell, not an ability.)
            if (canAct(c) && spell && (!spell.kind || spell.castsSpell)) disrupted = castAnswers(state, c) || disrupted;
            // (B265, Elegy of the Faithless: a spell cast near a foe whose reaction it sets off — its save card at the caster.)
            if (spell && (!spell.kind || spell.castsSpell)) for (const enemy of state.list) if (canAct(c) && enemy.side !== c.side && isActive(enemy)) provokedReaction(state, enemy, c, "cast", { tradition: spell.tradition ?? null });
            if (!canAct(c)) break;
            // Steady Spellcasting (B55): a flat check, and on a success the spell isn't disrupted.
            if (disrupted && c.steadySpellcasting && flatCheck(state.rng, c.steadySpellcasting) >= SUCCESS) {
                disrupted = false;
                state.log?.push(`  ${c.name} keeps casting (Steady Spellcasting)`);
            }
            // (A follow-up by the Strike's degree, "Enfeebled 2 (or Enfeebled 3 on a critical hit)": that Strike's degree, B68.)
            const byStrike = action.rider && spell?.plan?.resolution?.check?.statistic === "strike" && Number.isFinite(rider?.degree);
            castSpell(state, c, action.spellIndex, action.targetIds, action.actions, { ...(disrupted ? { disrupted: true } : {}), ...(byStrike ? { forcedDegree: rider.degree } : {}) });
            if (spell?.draw?.each) c.itemsAtHand?.delete(spell.item);
            // (L5: a coven spell — the coven's one this round, and its helpers' actions.)
            if (spell?.coven) {
                covenCast(state, c);
                c.covenReady = false;
            }
            // (B147: a spell just cast, for what needs it as its last action — Residual Force, Primal Weapon.)
            if (spell && (!spell.kind || spell.castsSpell)) c.lastCast = { round: state.round, action: c.actionCount ?? 0, cantrip: (spell.plan?.traits ?? []).includes("cantrip") };
            break;
        }
        case "interact":
            interact(state, c, action.what, action.strikeName);
            break;
        case "retch":
            retch(state, c);
            break;
        // Wrestle, Rhinoceros Charge: Stride if it must, Strike, then what a hit adds.
        case "strikeActivity": {
            const activity = c.strikeActivities[action.index];
            const target = state.byId.get(action.targetId);
            state.log?.push(`  ${c.name} uses ${activity.name}`);
            // (U7: an item used by Striking is used up.)
            if (activity.pool) {
                c.spellPools[activity.pool] = Math.max(0, (c.spellPools[activity.pool] ?? 0) - 1);
                if (activity.item && state.stats) state.stats[c.side === "party" ? "partyItemsUsed" : "foeItemsUsed"]++;
            }
            // (2026-10-15, its own traits — Fear Gem's concentrate activation, Hunter's Aim: as a spell's, a deafened creature's auditory one
            // needs a DC 5 flat check, and it provokes the reactions its traits set off (a manipulate one, Reactive Strike). Disrupted, it
            // ends with nothing more: its actions and its item are spent, as PF2e has it.)
            const activityTraits = activity.traits ?? [];
            if (c.cond.deafened && activityTraits.includes("auditory") && flatCheck(state.rng, 5) < SUCCESS) {
                state.log?.push(`  ${c.name} loses ${activity.name} (deafened)`);
                break;
            }
            let disrupted = activityTraits.includes("manipulate") ? provoke(state, c, "manipulate") : false;
            for (const kind of ["concentrate", "auditory", "linguistic", "emotion"]) if (canAct(c) && activityTraits.includes(kind)) disrupted = provoke(state, c, kind) || disrupted;
            if (!canAct(c)) break;
            if (disrupted) {
                state.log?.push(`  ${c.name}'s ${activity.name} is disrupted`);
                break;
            }
            if (activity.oncePerFight) (c.activitiesUsed ??= new Set()).add(action.index);
            if (activity.flourish) c.usedThisTurn?.add("flourish");
            if (activity.oncePerTurn) (c.usedThisTurn ??= new Set()).add(activity.name);
            if (!target || !isActive(target)) break;
            if (activity.strides && !sameMelee(c, target)) {
                stride(state, c, { kind: "engage", targetId: action.targetId });
                if (!canAct(c) || !isActive(target) || !sameMelee(c, target)) break;
            }
            // Cover Fire (C19): the target ducks (+2 AC against it) unless its best attack is ranged; then +1 to hit.
            const fired = c.strikes[action.strikeIndex];
            if (activity.coverFire) {
                c.usedThisTurn?.add("cover-fire");
                state.log?.push(`  ${target.name} ${ducksFromCoverFire(target) ? "ducks" : "stands firm"}`);
            }
            // "This Strike ignores their multiple attack penalty and doesn't count toward that penalty."
            const attacksBefore = c.attacksThisTurn;
            if (activity.noMap) c.attacksThisTurn = 0;
            // "using the previous Strike's multiple attack penalty" (B68): that Strike's penalty, and no more after it.
            if (activity.previousMap) c.attacksThisTurn = Math.max(0, attacksBefore - 1);
            // (C34, Shatter Defenses: whether it was off-guard to it before the hit.)
            const offGuardBefore = activity.shatter ? isOffGuard(target) : false;
            const result = performStrike(state, c, target, chargeStrike(fired, activity.coverFire ? { ...activity, attackBonus: ducksFromCoverFire(target) ? -2 : 1 } : activity));
            if (activity.noMap || activity.previousMap) c.attacksThisTurn = attacksBefore;
            if (fired?.reload) (c.unloaded ??= new Set()).add(fired.name);
            // A finisher spends panache, and no more attacks this turn; Confident Finisher's miss still deals half its dice.
            if (activity.finisher) {
                c.panache = false;
                c.noAttacksThisTurn = true;
                if (activity.finisher === "confident" && result?.degree === 1 && !result.image && isActive(target)) {
                    let amount = 0;
                    for (let die = 0; die < (c.panacheStyle?.finisherDice ?? 2); die++) amount += state.rng.die(6);
                    const dealt = applyDamage(state, target, [{ type: c.strikes[action.strikeIndex].damage[0].type, amount: Math.floor(amount / 2), persistent: false, precision: true, context: strikeContext(c, c.strikes[action.strikeIndex]) }], { source: c });
                    state.log?.push(`  ${target.name} takes ${dealt} from the finisher's miss`);
                }
            }
            // Vicious Swing counts as two attacks; Exacting Strike's miss doesn't count.
            if (result && activity.countsAs > 1) c.attacksThisTurn += (c.hydra?.count === activity.countsAs ? Math.max(1, c.hydra.heads) : activity.countsAs) - 1;
            if (result && activity.exacting && result.degree === 1) c.attacksThisTurn = Math.max(0, c.attacksThisTurn - 1);
            // Focused Assault (B74): a failure (not a critical one) still deals the Strike's damage, as a hit's.
            // (Not one Mirror Image's image took: "no additional effect".)
            if (result && activity.failureDamage && result.degree === FAILURE && !result.image && isActive(target)) {
                const instances = rollStrikeDamage(state.rng, fired, { critical: false, penalty: fired.melee ? c.cond.enfeebled ?? 0 : 0 }).map((instance) => ({ ...instance, context: strikeContext(c, fired) }));
                const dealt = applyDamage(state, target, instances, { source: c, physical: true });
                state.log?.push(`  ${target.name} takes ${dealt} from the failed ${activity.name}`);
            }
            if (result && result.degree >= SUCCESS && isActive(target)) applyStrikeRider(state, c, target, activity, result.degree === 3, fired);
            // (C30: Instrument of Zeal's critical hit with Blessed Counterstrike.)
            if (activity.zeal && result?.degree === CRITICAL_SUCCESS && isActive(target)) zealCritical(state, c, target, fired, { applyDamage, applyCondition });
            // (2026-10-16: Big Rock Bullet's failure — not a critical one — still deals its own damage.)
            if (activity.instead?.failure && result?.degree === FAILURE && !result.image && isActive(target)) {
                const part = activity.instead.failure;
                let amount = part.bonus ?? 0;
                for (let die = 0; die < part.dice; die++) amount += state.rng.die(part.die);
                const dealt = applyDamage(state, target, [{ type: part.type, amount, persistent: false, precision: false, context: strikeContext(c, fired) }], { source: c, physical: true });
                state.log?.push(`  ${target.name} takes ${dealt} from the failed ${activity.name}`);
            }
            // (C34, Brutal Finish: a failure still deals a die or two of the weapon's; then its turn ends.)
            if (activity.failureDice && result?.degree === FAILURE && !result.image && isActive(target) && fired?.damage?.[0]?.die) {
                let amount = 0;
                for (let die = 0; die < activity.failureDice; die++) amount += state.rng.die(fired.damage[0].die);
                const dealt = applyDamage(state, target, [{ type: fired.damage[0].type, amount, persistent: false, precision: false, context: strikeContext(c, fired) }], { source: c, physical: true });
                state.log?.push(`  ${target.name} takes ${dealt} from the failed ${activity.name}`);
            }
            // (C34, Shatter Defenses: a hit that deals damage leaves it off-guard while it's frightened; already off-guard to it, its frightened
            // can't drop below 1 until the attacker's next turn.)
            if (activity.shatter && result?.degree >= SUCCESS && (result.damage ?? 1) > 0 && isActive(target)) shatterDefenses(state, c, target, offGuardBefore, { applyCondition });
            if (activity.endsTurn) c.actionsLeft = 0;
            // (B156, Battering Blow: "then Shoves the same creature" — hit or miss.)
            if (result && activity.afterStrike && isActive(target) && canAct(c)) bothHitRider(state, c, target, { follow: activity.afterStrike }, { said: null });
            // Set-Up Strike: its hit leaves the target off-guard to an ally's next attack.
            if (activity.setUp && result && result.degree >= SUCCESS && isActive(target)) setUp(state, c, target);
            // (B139: Off-Guard or a guard on itself until its next turn starts.)
            if (activity.selfAfter?.length && isActive(c)) {
                multiStrikeAfter(state, c, { after: activity.selfAfter.filter((entry) => entry.slug) });
                const guards = activity.selfAfter.filter((entry) => entry.ac);
                if (guards.length) {
                    applyEffect(state, c, { name: activity.name, rounds: 1, modifiers: guards.map((entry) => ({ on: "ac", type: entry.type ?? "circumstance", value: entry.ac })), tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 }, c, { applyCondition, key: `self:${activity.name}` });
                    state.log?.push(`  ${c.name} gains +${guards[0].ac} AC until its next turn`);
                }
            }
            break;
        }
        // Battle Medicine: a Medicine check against the Treat Wounds DC it chose.
        case "battleMedicine": {
            const target = state.byId.get(action.targetId);
            // (B225: a healing action, Clinch Victory's trigger; disrupted, it's lost.)
            const disrupted = target ? provoke(state, c, "healing") : false;
            if (target && !disrupted && canAct(c)) battleMedicine(state, c, target, action.tier);
            break;
        }
        case "rend": {
            const target = state.byId.get(action.targetId);
            if (target && isActive(target)) performRend(state, c, target, c.strikes[action.strikeIndex]);
            break;
        }
        // Knocking Sweep (B75): its basic action at each enemy in its Melee, each at the penalty it started with when it doesn't rise.
        case "skillSweep": {
            const sweep = c.skillSweeps[action.index];
            state.log?.push(`  ${c.name} uses ${sweep.name}`);
            if (sweep.oncePerTurn) (c.usedThisTurn ??= new Set()).add(sweep.name);
            const index = sweepActionIndex(c, sweep);
            const attacks = c.attacksThisTurn;
            const foes = engagedEnemies(state, c);
            for (const foe of foes) {
                if (!canAct(c) || index < 0) break;
                if (sweep.sameMap) c.attacksThisTurn = attacks;
                if (isActive(foe)) castSpell(state, c, index, [foe.id]);
            }
            if (sweep.sameMap) c.attacksThisTurn = attacks + foes.length;
            break;
        }
        // Draconic Frenzy, Flurry of Blows, Double Slice: its Strikes in turn, at another
        // enemy within reach if the first drops. Double Slice: both at the current
        // multiple attack penalty (then it counts as two), the second -2 unless agile.
        case "multiStrike": {
            const ability = c.multiStrikes[action.ability];
            state.log?.push(`  ${c.name} uses ${ability.name}`);
            if (ability.oncePerTurn) c.usedThisTurn?.add(ability.name);
            if (ability.flourish) c.usedThisTurn?.add("flourish");
            // (B153, Heads Will Roll!: once a minute — once a fight.)
            if (ability.oncePerFight) (c.multiUsed ??= new Set()).add(ability.name);
            if (ability.recharge) (c.multiUntil ??= new Map()).set(ability.name, state.round + rollCount(state, ability.recharge));
            let target = state.byId.get(action.targetId);
            // (B108, Chase Prey: a Stride to the creature first; B109, Mauling Rush: to its Melee, then a Strike at each there.)
            if (ability.strides && target && isActive(target) && !sameMelee(c, target) && canMove(c)) {
                stride(state, c, { kind: "engage", targetId: target.id });
                if (!canAct(c)) break;
            }
            const attacks = c.attacksThisTurn;
            // (B155, Enraged Charge: these Strikes don't recharge its Breath Weapon through Draconic Momentum.)
            if (ability.noMomentum) c.suppressMomentum = true;
            // A Strike at every enemy in its Melee (Vine Lash, Thrash), or at that many of them (Dual Tusks, Swipe); a ranged
            // one at any enemies (Cannonade).
            if (ability.each) {
                const order = multiStrikeOrder(c, ability) ?? [];
                const ranged = order.length > 0 && c.strikes[order[0]] && !c.strikes[order[0]].melee;
                // (H1: a hydra's Strikes up to its heads now.)
                const foes = (ranged ? state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone") : engagedEnemies(state, c)).filter((other) => !(ability.notGrabbed && other.grabbedBy === c.id)).slice(0, Math.min(ability.max ?? Infinity, c.hydra?.count ? c.hydra.heads : Infinity));
                for (const [step, foe] of foes.entries()) {
                    // (Three-Headed Strike, B74: a different Strike at each creature, in turn.)
                    const index = order[Math.min(step, order.length - 1)];
                    if (!canAct(c) || index === undefined) break;
                    // Each at the penalty it started with, when it doesn't rise until all are made.
                    if (ability.sameMap) c.attacksThisTurn = attacks;
                    // (Hungry Flurry, Double Shot: each at a -2 penalty, B62.)
                    const strike = withExtraDamage(c.strikes[index], ability.extraDamage);
                    const result = isActive(foe) ? performStrike(state, c, foe, ability.penalty ? { ...strike, bonus: strike.bonus - ability.penalty } : strike) : null;
                    // (B152, Fan of Daggers: what each critical hit brings.)
                    if (ability.critical && result?.degree === CRITICAL_SUCCESS) bothHitRider(state, c, foe, ability.critical, { said: "Critical hit on" });
                    // (B213, Hundred-Handed Whirlwind: damage even on a failed attack, not a critical failure.)
                    if (ability.missDamage?.length && result?.degree === FAILURE && !result.image) bothHitRider(state, c, foe, { conditions: [], damage: ability.missDamage }, { said: "A failed attack still hurts" });
                    // (B220, Cleanse the Forest: the next only after a hit.)
                    if (ability.chain && (result?.degree ?? 0) < SUCCESS) break;
                }
                // ("These Strikes count as only one attack for its multiple attack penalty", B74.)
                if (ability.sameMap) c.attacksThisTurn = attacks + (ability.countsAs ?? foes.length);
                c.suppressMomentum = false;
                multiStrikeAfter(state, c, ability);
                break;
            }
            let grabbed = false;
            let firstHit = false;
            // (B104: what both hits bring, on the creature they both hit.)
            let made = 0;
            let hits = 0;
            let struck = null;
            // (B255: a random multi-Strike's dice pick its Strikes.)
            for (const [step, index] of ((ability.random ? rolledStrikes(state, c, ability) : multiStrikeOrder(c, ability)) ?? []).entries()) {
                if (!canAct(c)) break;
                // (B106, Pike and Strike: the second only after a first that hit.)
                if (ability.ifFirstHits && step > 0 && !firstHit) break;
                let strike = withExtraDamage(c.strikes[index], ability.extraDamage);
                if (ability.sameTarget ? !target || !isActive(target) : !target || !isActive(target) || (strike.melee && !sameMelee(c, target))) target = ability.sameTarget ? null : engagedEnemies(state, c)[0] ?? null;
                if (!target) break;
                if (ability.sameMap) c.attacksThisTurn = attacks;
                // (B112, Claw Rake: each at its highest attack bonus.)
                if (ability.noMap) c.attacksThisTurn = 0;
                // Double Slice's second Strike: -2 unless agile (C4). A monster's that doesn't raise the penalty: none (B62).
                if (ability.secondPenalty && step > 0 && !strike.agile) strike = { ...strike, bonus: strike.bonus - 2 };
                if (ability.penalty) strike = { ...strike, bonus: strike.bonus - ability.penalty };
                // (B107, Eviscerate: each Strike's own penalty, "the next two with a -4 penalty …, and the last one with a -8 penalty".)
                if (ability.penalties?.[step]) strike = { ...strike, bonus: strike.bonus - ability.penalties[step] };
                // (B137, Tentacle Stab: "can't Grab with them" — the Strike without its Grab.)
                if (ability.noGrab) strike = { ...strike, attackEffects: (strike.attackEffects ?? []).filter((effect) => !/^(?:improved-)?grab$/.test(String(effect))) };
                // Twin Feint (B74): the target is off-guard against the second attack (or only after a first that hit).
                if (step === 1 && (ability.secondOffGuard === true || (ability.secondOffGuard === "hit" && firstHit))) (target.offGuardTo ??= []).push({ attacker: c.id, attacks: "all", uses: 1 });
                const result = performStrike(state, c, target, strike);
                if (ability.critical && result?.degree === CRITICAL_SUCCESS) bothHitRider(state, c, target, ability.critical, { said: "Critical hit on" });
                if (step === 0) firstHit = (result?.degree ?? 0) >= SUCCESS;
                made++;
                if ((result?.degree ?? 0) >= SUCCESS) {
                    hits++;
                    struck = struck === null || struck === target ? target : false;
                }
                // "If either Strike hits, the dragon can attempt to Grab the target … as a free action" (Coiling Frenzy): its Grab, once.
                if (ability.grab && !grabbed && result?.degree >= SUCCESS && isActive(target)) {
                    const grab = (c.spells ?? []).findIndex((spell) => ["grab", "improved-grab"].includes(spell.plan?.source?.slug) || spell.plan?.trigger?.attackEffect === "grab");
                    if (grab >= 0) {
                        castSpell(state, c, grab, [target.id]);
                        grabbed = true;
                    }
                }
            }
            if (ability.sameMap || ability.noMap) c.attacksThisTurn = attacks + (ability.countsAs ?? multiStrikeOrder(c, ability)?.length ?? 0);
            c.suppressMomentum = false;
            // (B212, a Battlezoo creature's bites: at least that many hits on one creature, not every Strike.)
            // (B213, Frightening Flurry: Frightened as many as the Strikes that hit it.)
            // (C34, Infernal Interference: what one hit brings, and what both do.)
            for (const entry of ability.hitRiders ?? []) if (struck && hits >= entry.atLeast) bothHitRider(state, c, struck, entry, { said: entry.atLeast > 1 ? undefined : `${ability.name} hits` });
            const rider = ability.bothHit?.perHit ? { ...ability.bothHit, conditions: ability.bothHit.conditions.map((entry) => ({ ...entry, value: hits })) } : ability.bothHit;
            if (ability.bothHit && struck && (ability.bothHit.atLeast ? hits >= ability.bothHit.atLeast : made >= 2 && hits === made)) bothHitRider(state, c, struck, rider, ability.bothHit.atLeast ? { said: `${hits} Strike${hits === 1 ? "" : "s"} hit` } : {});
            // (B152, Haunting Assault: "…, then Demoralizes that creature" — its basic action after the Strikes.)
            if (ability.then && made > 0 && target && isActive(target)) bothHitRider(state, c, target, { follow: ability.then }, { said: null });
            multiStrikeAfter(state, c, ability);
            break;
        }
        // Rage and the like: a buff on itself for the rest of the fight.
        case "selfBuff": {
            const buff = c.selfBuffs[action.index];
            state.log?.push(`  ${c.name} uses ${buff.name}`);
            (c.activeBuffs ??= []).push(buff);
            c.buffsUsed = new Set([...(c.buffsUsed ?? []), buff.name]);
            if (buff.tempHp) c.hp.temp = Math.max(c.hp.temp ?? 0, buff.tempHp);
            break;
        }
        // A stance or another action that puts an effect on itself (Tiger Stance):
        // the effect, a Strike it gives, and a new stance ends the old one.
        case "selfEffect": {
            const entry = c.selfEffects[action.index];
            state.log?.push(`  ${c.name} uses ${entry.name}`);
            if (entry.stance) {
                for (const other of c.selfEffects.filter((self) => self.stance && self !== entry)) for (const effect of (c.effects ?? []).filter((active) => active.key === `self:${other.name}`)) removeEffect(c, effect);
            }
            const effect = applyEffect(state, c, entry.model, c, { applyCondition, key: `self:${entry.name}` });
            // (B308: shut in its shell for the rest of its turn; coming out costs an action at its next.)
            if (entry.shell) c.inShell = true;
            if (entry.strikes?.length) c.strikes = [...(c.strikes ?? []).filter((strike) => strike.fromEffect !== effect.key), ...entry.strikes.map((strike) => ({ ...strike, fromEffect: effect.key }))];
            break;
        }
        // Exploit Vulnerability, Devise a Stratagem, Taunt, Overdrive.
        case "exploit": {
            const target = state.byId.get(action.targetId);
            c.usedThisTurn?.add("exploit");
            if (target && isActive(target)) exploitVulnerability(state, c, target);
            break;
        }
        case "stratagem":
            c.stratagem = { targetId: action.targetId, natural: state.rng.d20(), round: state.round, used: false };
            state.log?.push(`  ${c.name} uses ${c.stratagemFeature.name} on ${state.byId.get(action.targetId)?.name} (rolls ${c.stratagem.natural})`);
            break;
        case "taunt": {
            const target = state.byId.get(action.targetId);
            if (!target || !isActive(target)) break;
            for (const other of state.list) if (other.tauntedBy === c.id) other.tauntedBy = null;
            target.tauntedBy = c.id;
            (target.timers ??= []).push({ taunt: c.id, round: state.round + 1, turnOf: c.id, at: "start" });
            state.log?.push(`  ${c.name} taunts ${target.name}`);
            break;
        }
        case "overdrive":
            c.usedThisTurn?.add("overdrive");
            overdrive(state, c);
            break;
        // (B167, Tactical Direction: its allies of that trait near it gain Attack of Opportunity until the end of their next turn.)
        case "grantAoo": {
            state.log?.push(`  ${c.name} uses ${c.grantAoo.name}`);
            for (const ally of grantAooAllies(state, c)) {
                ally.reactions = { ...(ally.reactions ?? {}), aoo: true };
                ally.grantedAoo = { by: c.id, round: state.round, ...(c.grantAoo.untilSource ? { untilSource: true } : {}), ...(c.grantAoo.usedOnce ? { usedOnce: true } : {}) };
                state.log?.push(`  ${ally.name} gains Attack of Opportunity`);
            }
            break;
        }
        // Hunt Prey: the creature its hunter's edge works against.
        case "huntPrey": {
            const target = state.byId.get(action.targetId);
            if (target && isActive(target)) {
                c.prey = target.id;
                // (C31: Smite by its name.)
                state.log?.push(c.huntPrey?.name ? `  ${c.name} uses ${c.huntPrey.name} on ${target.name}` : `  ${c.name} hunts ${target.name} as its prey`);
            }
            break;
        }
        // Pounce: Stride, then Strike.
        case "charge": {
            const target = state.byId.get(action.targetId);
            state.log?.push(`  ${c.name} uses ${c.charges[action.ability].name}`);
            if (c.charges[action.ability].oncePerTurn) c.usedThisTurn?.add(c.charges[action.ability].name);
            if (c.charges[action.ability].flourish) c.usedThisTurn?.add("flourish");
            if (c.charges[action.ability].oncePerFight) (c.chargesUsed ??= new Set()).add(c.charges[action.ability].name);
            // (B98: "can't use Leap Attack for 1 round"; off-guard only to a creature that hasn't seen it before.)
            const used = chargeOn(c, c.charges[action.ability], action.targetId);
            if (used.recharge) (c.chargeUntil ??= new Map()).set(used.name, state.round + rollCount(state, used.recharge));
            if (used.offGuard !== c.charges[action.ability].offGuard) {
                c.chargeSeen ??= new Map();
                if (!c.chargeSeen.has(used.name)) c.chargeSeen.set(used.name, new Set());
                c.chargeSeen.get(used.name).add(action.targetId);
            }
            // (B90: a charge whose move triggers no reactions.)
            stride(state, c, { kind: "engage", targetId: action.targetId, ...(used.safe ? { safe: true } : {}) });
            if (canAct(c) && target && isActive(target) && sameMelee(c, target)) performStrike(state, c, target, chargeStrike(c.strikes[action.strikeIndex], used));
            break;
        }
        default:
            break;
    }
}

// The escalation rules as the turn loop checks them after each action and as a round begins, for tests.
export function escalate(state) {
    checkEscalations(state, ESCALATION_EFFECTS);
}

// The end of a creature's turn as the turn loop runs it, for tests.
export function turnEnd(state, c) {
    endTurn(state, c);
}

// Whether the fight is over (state.outcome says how), checked as after each action, for tests.
export function fightOver(state) {
    return checkEnd(state);
}

// One action as the turn loop takes it, for tests that set up exact situations.
export function performAction(state, c, action) {
    act(state, c, action);
    afterAction(state);
}

// A cast's own actions (Quickened Casting, B72: one fewer).
function castActions(c, action) {
    return Math.max(1, (action.actions ?? describeSpell(c.spells[action.spellIndex].plan).actions ?? 2) - (action.quickened ? 1 : 0));
}

function actionCost(c, action) {
    if (action.type === "strike") return 1 + (action.reload ?? 0);
    if (action.type === "reload") return action.actions;
    if (action.type === "slingersReload" || action.type === "rechargeSpellstrike") return 1;
    if (action.type === "spellstrike" || action.type === "strikeHard") return 2;
    if (action.type === "pincerAttack" || action.type === "bannersInspiration" || action.type === "shiftImmanence" || action.type === "transcend") return 1;
    if (action.type === "disableHazard") return 2;
    if (action.type === "drawItem") return action.actions ?? 1;
    if (action.type === "multiStrike" || action.type === "skillSweep" || action.type === "charge" || action.type === "strikeActivity" || action.type === "selfBuff" || action.type === "selfEffect" || action.type === "safeMove" || action.type === "mythicRemove" || action.type === "mythicRecharge" || action.type === "poisonWeapon" || action.type === "grantAoo" || action.type === "allyAdvance" || action.type === "summon") return action.actions ?? 1;
    // (Quickened Casting, B72: one action fewer.)
    // (S22: Trick Magic Item first, an action more; a stowed item taken out, its retrieve actions.)
    if (action.type === "cast") return castActions(c, action) + (action.trick ? 1 : 0) + (action.draw ? c.spells[action.spellIndex].draw?.actions ?? 1 : 0);
    return action.type === "task" ? 2 : 1;
}

// The escorted creature (O2) spends its actions getting to the exit: out of a
// Melee (a Step if it can), then Strides. It never attacks.
function escortTurn(state, c) {
    let guard = 0;
    while (c.actionsLeft > 0 && canAct(c) && state.objective.status === "open" && guard++ < 8) {
        if (c.cond.prone) stand(state, c);
        else if (!canMove(c)) break;
        else if (c.meleeId !== null && step(state, c)) {
            // stepped out
        } else stride(state, c, { kind: "toExit" });
        c.actionsLeft--;
        processMorale(state);
        if (checkEnd(state)) return;
    }
}

// A fleeing creature spends its actions getting away.
function fleeTurn(state, c) {
    while (c.actionsLeft > 0 && canAct(c) && c.status === ACTIVE && canMove(c)) {
        if (c.band === "engaged") {
            if (!step(state, c)) stride(state, c, { kind: "toNear" });
        } else if (c.band === "near") {
            stride(state, c, { kind: "toFar" });
        } else {
            break;
        }
        c.actionsLeft--;
        processMorale(state);
        if (checkEnd(state)) return;
    }
}

export function takeTurn(state, c) {
    // Conditions this creature's spells timed end at the start of its turn, whatever its state.
    expireTimers(state, c);
    // (Dominate: whoever's no longer controlled is back on its own side.)
    controlTurnStart(state);
    if (c.status === DOWN && c.kind !== "pc" && regenerating(c, state)) regenerateUp(state, c);
    if (c.status === DOWN) {
        state.log?.push(`${c.name} (down)`);
        lastingTurnStart(state, c, { canSustain: false });
        if (c.kind === "pc" && c.cond.dying > 0) recoveryCheck(state, c);
        endTurn(state, c);
        return;
    }
    // (B314: a paralyzed or sleeping creature's turn still ends — its persistent damage, a new save against the condition.)
    if (!canAct(c)) {
        lastingTurnStart(state, c, { canSustain: false });
        if (c.status === ACTIVE && c.acts !== false) {
            state.log?.push(`${c.name} (${c.cond.paralyzed ? "paralyzed" : c.cond.asleep ? "asleep" : "unconscious"})`);
            endTurn(state, c);
        }
        return;
    }
    startTurn(state, c);
    state.log?.push(`${c.name} (${c.hp.value}/${c.hp.max} HP, ${c.band})`);
    // Petrifying Glance: an enemy's reaction to this turn starting near it (B47). Mind-Numbing Grasp: its holder's passive (B49).
    state.acting = c.id;
    turnStartReactions(state, c);
    // (B245, Whirling Hands: a Strike at a creature starting its turn in its Melee.)
    turnStartAnswers(state, c);
    grabTurnAnswers(state, c, "start");
    // (B256: the zones it starts its turn in.)
    zoneTurn(state, c, "start");
    // (A hex it Sustained: its familiar's patron ability.)
    if (c.sustainedNow?.length) hexSustains(state, c);
    // Shrieking Frenzy: its own free action as its turn begins (B53).
    ownTurnStart(state, c);
    // (T4: a flesh golem's Berserk; an attached creature's Strike damage, the pickled punk's.)
    berserkTurnStart(state, c);
    // (L3–L5: the ground's difficult terrain; Hidden Movement; a coven's readiness and the actions it lent.)
    terrainTurn(state, c, "start");
    hiddenAtTurnStart(state, c);
    covenTurnStart(state, c);
    if (c.attach?.strike) attachedTurnStart(state, c, { applyDamage, rollStrikeDamage, strikeNamed });
    if (!canAct(c)) {
        endTurn(state, c);
        return;
    }
    if (state.round === 1 && state.surprisedSide === c.side && c.side === "foes" && !state.surpriseRaised) {
        state.surpriseRaised = true;
        state.pendingEvents.push({ type: "surprised" });
        processMorale(state);
    }
    fleeingAtTurnStart(state, c);
    if (c.side === "foes" && !c.cantAffect && state.options.morale) {
        const offense = bestOffense(state, c);
        checkCantAffect(state, c, offense.hit, offense.damage);
        processMorale(state);
    }
    if (c.swallowedBy) {
        swallowedTurn(state, c);
        if (state.outcome) return;
    }
    // (2026-10-20: out by an Escape with actions left — it plays the rest of its turn.)
    if (c.swallowedBy) {
        // (Still inside: its turn was its tries to get out.)
    } else if (c.cond.confused) {
        confusedTurn(state, c);
        if (state.outcome) return;
    } else if (c.cond.fleeing) {
        fleeTurn(state, c);
    } else if (c.goneBerserk) {
        berserkTurn(state, c);
        if (state.outcome) return;
    } else if (state.objective?.kind === "escort" && state.objective.escortId === c.id && state.objective.status === "open") {
        escortTurn(state, c);
    } else {
        let guard = 0;
        while (c.actionsLeft > 0 && canAct(c) && !c.cond.fleeing && guard++ < 8) {
            const action = chooseAction(state, c);
            if (!action) break;
            c.actionsLeft -= actionCost(c, action);
            act(state, c, action);
            afterAction(state);
            c.actionCount = (c.actionCount ?? 0) + 1;
            processMorale(state);
            if (checkEnd(state)) return;
        }
        if (c.cond.fleeing && canAct(c)) fleeTurn(state, c);
    }
    if (state.outcome) return;
    endTurn(state, c);
}

// What waits for the action to end (B70): Fast Swallow on a creature just grabbed (its reaction, its own Swallow Whole).
function afterAction(state) {
    // (T4: an attached creature goes where its creature went.)
    followAttached(state);
    for (const entry of (state.afterAction ?? []).splice(0)) {
        const c = state.byId.get(entry.sourceId);
        const target = state.byId.get(entry.targetId);
        // (B123, Deadly Cleave: another Strike at a different creature in its Melee, at the penalty the downing Strike had; it counts.)
        if (entry.kind === "cleave") {
            const rule = c?.reactionStrikes?.find((each) => each.triggers.includes("downs"));
            const foe = c && isActive(c) && canReact(c, rule?.name) && canAct(c) ? engagedEnemies(state, c).find((other) => other !== target && isActive(other)) : null;
            const index = foe ? strikeNamed(c, rule.strike) : -1;
            if (!foe || index < 0) continue;
            spendReaction(c, rule.name);
            state.stats.reactions++;
            state.log?.push(`  ${c.name} uses ${rule.name}`);
            const attacks = c.attacksThisTurn;
            c.attacksThisTurn = entry.attacks;
            performStrike(state, c, foe, c.strikes[index]);
            c.attacksThisTurn = attacks + 1;
            continue;
        }
        // (B197, Deadly Mandibles: its named Strike at the creature it grabbed, as its reaction; it counts toward its multiple attack penalty.)
        if (entry.kind === "grab-strike") {
            const rule = c?.reactionStrikes?.find((each) => each.triggers.includes("grabs"));
            const index = rule && isActive(c) && isActive(target) && canReact(c, rule.name) && canAct(c) && target.grabbedBy === c.id ? strikeNamed(c, rule.strike) : -1;
            if (index < 0) continue;
            spendReaction(c, rule.name);
            state.stats.reactions++;
            state.log?.push(`  ${c.name} uses ${rule.name}`);
            performStrike(state, c, target, c.strikes[index]);
            continue;
        }
        if (entry.kind !== "fast-swallow" || !c || !target || !isActive(c) || !isActive(target) || !canReact(c, c.fastSwallow.name) || target.grabbedBy !== c.id || target.swallowedBy) continue;
        const index = (c.spells ?? []).findIndex((spell) => describeSpell(spell.plan).swallow);
        if (index < 0) continue;
        spendReaction(c, c.fastSwallow.name);
        state.log?.push(`  ${c.name} uses ${c.fastSwallow.name}`);
        castSpell(state, c, index, [target.id]);
    }
}

// (B199, Uncanny Pounce: as it rolls initiative, a Stride and its Strike — free — at a foe in its Melee, or one nearby it can reach.)
function initiativeStrikes(state) {
    for (const c of state.list) {
        const index = (c.strikeActivities ?? []).findIndex((activity) => activity.initiative);
        if (index < 0 || !isActive(c) || !canAct(c)) continue;
        const activity = c.strikeActivities[index];
        const strikeIndex = strikeNamed(c, activity.strike);
        const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone");
        const target = engagedEnemies(state, c).find((other) => isActive(other)) ?? foes.find((other) => other.band !== "far" || c.band === "far") ?? null;
        if (strikeIndex < 0 || !target) continue;
        act(state, c, { type: "strikeActivity", index, targetId: target.id, strikeIndex });
    }
}

// Whether the party retreats now (exported for tests).
export function shouldRetreat(state) {
    if (!state.options.retreat) return false;
    const down = pcs(state).filter((c) => c.status === DOWN || c.status === DEAD).length;
    if (down < (state.options.retreatDowns ?? 2)) return false;
    // "Failed or can't be completed": an open objective is out of reach once the foes are ahead.
    if (state.objective?.status === "failed") return true;
    return partyAdvantage(state, { potential: state.options.retreatBy === "potential" }) < (state.options.retreatRatio ?? 1);
}

// The fight going badly for a creature's side (S22, when it overcharges a wand): one of its side down or out (fled, surrendered), or
// its side behind on strength (damage potential, as the morale gate weighs it).
export function desperate(state, c) {
    const out = [DOWN, DEAD, FLED, SURRENDERED];
    if (state.list.some((other) => other.side === c.side && other.kind !== "object" && out.includes(other.status))) return true;
    const ratio = partyAdvantage(state, { potential: true });
    return c.side === "party" ? ratio < 1 : ratio > 1;
}

export function simulate(snapshot, options = {}, seed = 1, { log = false } = {}) {
    const merged = { ...DEFAULT_OPTIONS, ...options };
    if (options.moraleRules) merged.moraleRules = options.moraleRules;
    else merged.moraleRules = mergeMoraleRules(snapshot.moraleRules);
    const state = createState(snapshot, merged, seed, log);
    const resuming = Array.isArray(snapshot.order) && snapshot.order.length > 0 && snapshot.round > 0;
    if (resuming) {
        state.order = snapshot.order.filter((id) => state.byId.has(id));
        state.initiative = new Map(state.order.map((id, index) => [id, state.order.length - index]));
        for (const c of state.list) if (!state.order.includes(c.id) && c.status !== PENDING) insertArrival(state, c);
    } else {
        rollInitiative(state, snapshot);
        state.round = 1;
    }
    // (B307: a choice PF2e holds as a toggle — its best way for this fight, set as it starts.)
    if (!resuming) chooseToggles(state, { applyEffect, applyCondition });
    // (B315: constant spells — Haste, Fly, Fire Shield — on as the fight starts.)
    if (!resuming) applyConstantSpells(state);
    // Frightful Presence and other auras: each enemy in range saves when the fight starts.
    if (!resuming) applyAuras(state);
    if (!resuming) initiativeDeeds(state);
    // (C32: a Dread Blindfold's gaze and Battle Cry's Demoralize as the fight begins.)
    if (!resuming) for (const c of state.list) if (c.dreadGaze || c.battleCry) championOpening(state, c, { applyCondition, castPlan });
    // Chilling Cry, Predestined Defeat: a monster's reaction to rolling initiative (B47).
    if (!resuming) initiativeReactions(state);
    if (!resuming) initiativeStrikes(state);
    let turnIndex = resuming ? Math.max(0, snapshot.turn ?? 0) : 0;
    if (!checkEnd(state)) {
        while (!state.outcome) {
            if (turnIndex === 0) {
                state.log?.push(`— Round ${state.round} —`);
                // Rules for this round fire as it begins, before arrivals.
                checkEscalations(state, ESCALATION_EFFECTS);
                arrivals(state);
            }
            computeThreats(state);
            for (; turnIndex < state.order.length && !state.outcome; turnIndex++) {
                const c = state.byId.get(state.order[turnIndex]);
                takeTurn(state, c);
                // "Until the end of your next turn" runs out here.
                expireTimers(state, c, "end");
                if (!state.outcome) checkEnd(state);
            }
            if (state.outcome) break;
            turnIndex = 0;
            // Danger hurts whoever it covers as the round ends (E3).
            if (state.dangers?.length) {
                dangerAtRoundEnd(state);
                processMorale(state);
                if (checkEnd(state)) break;
            }
            endOfRoundObjective(state);
            if (isMapObjective(state.objective) && state.objective.status === "success") {
                finish(state, mapOutcome(state.objective));
                break;
            }
            if (state.objective?.kind === "survive" && state.objective.status === "open" && state.round >= state.objective.rounds) {
                state.objective.status = "success";
                finish(state, "survived");
                break;
            }
            if (shouldRetreat(state)) {
                finish(state, "retreat");
                break;
            }
            if (checkEnd(state)) break;
            if (state.round >= merged.roundCap) {
                finish(state, "timeout");
                break;
            }
            state.round++;
        }
    }
    return summarize(state);
}

function summarize(state) {
    return {
        seed: state.seed,
        outcome: state.outcome,
        rounds: state.round,
        objective: state.objective ? state.objective.status : null,
        party: state.list.filter((c) => c.side === "party").map((c) => ({
            id: c.id,
            name: c.name,
            kind: c.kind,
            down: c.everDown,
            dead: c.status === DEAD,
            hp: Math.max(0, c.hp.value)
        })),
        foes: state.list.filter((c) => c.side === "foes").map((c) => ({
            id: c.id,
            name: c.name,
            // A simple hazard that fired is spent, not killed.
            status: c.spent ? "spent" : c.captured && c.status !== SURRENDERED ? "captured" : c.status,
            damageDealt: c.damageDealt,
            pcsDowned: c.downedCount
        })),
        damageBy: state.damageBy,
        stats: { ...state.stats, groupRout: !!state.stats.groupRout },
        log: state.log
    };
}
