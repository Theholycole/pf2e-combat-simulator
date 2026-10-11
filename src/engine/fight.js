// One simulated fight from a snapshot.

import { createRng } from "./rng.js";
import { FAILURE, flatCheck, SUCCESS } from "./checks.js";
import { ACTIVE, DEAD, DOWN, FLED, PENDING, SURRENDERED, canAct, canMove, createCombatant, isActive, keepPermanent, strikeUsable } from "./combatant.js";
import { engage, engagedEnemies, leaveMelee, sameMelee } from "./space.js";
import { applyDamage, dealDamage, expectedHitDamage, interact, leaveField, performRend, performStrike, provoke, raiseShield, recoveryCheck, releaseGrabs, stand, step, stride } from "./actions.js";
import { canReact, chargeStrike, deltasFor, ducksFromCoverFire, multiStrikeOrder, regenerating } from "./abilities.js";
import { adjustInstance, rollPersistent, rollStrikeDamage } from "./damage.js";
import { MORALE_RULES, mergeMoraleRules } from "./morale-rules.js";
import { checkCantAffect, defaultMoraleProfile, fleeingAtTurnStart, initMorale, moraleRecovery, partyAdvantage, processMorale } from "./morale.js";
import { createObjective, endOfRoundObjective, performTask, settleObjectiveAfterLoss, settleObjectiveAfterWin, updateObjective } from "./objectives.js";
import { bestOffense, chooseAction, computeThreats, guessRole } from "./planner.js";
import { applyAuras, applyCondition, applyHeal, applyStrikeRider, battleMedicine, castPlan, castSpell, describeSpell, endConditions, endWhileConditions, expireTimers, exploitVulnerability, grabTurnAnswers, initiativeReactions, overdrive, ownTurnStart, retch, rollInstances, triggerRiders, turnStartReactions } from "./spells.js";
import { applyEffect, removeEffect } from "./effects.js";
import { bannersInspiration, pincerAttack, setUp, strikeHard } from "./commander.js";
import { shiftImmanence, sparkAtInitiative, transcend } from "./exemplar.js";
import { isMapObjective, mapOutcome, pickUpItem, placeOnMap } from "./map-objectives.js";
import { checkEscalations, dangerAtRoundEnd, setUpEscalations, soundGong, startDanger } from "./escalations.js";
import { helpArrives } from "./morale.js";
import { activateHazard, disableHazard, isHazard, setUpHazards, triggererOf } from "./hazards.js";

export const DEFAULT_OPTIONS = Object.freeze({
    morale: true,
    heroPoints: true,
    objective: true,
    retreat: true,
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
        stats: { moraleChecks: 0, moraleFailures: 0, moraleBreaks: 0, moraleRecoveries: 0, moraleGated: 0, heroPointsSpent: 0, reactions: 0 },
        outcome: null,
        surprisedSide: null,
        // The party's level (the morale DC in "partyLevel" mode).
        partyLevel: snapshot.partyLevel ?? Math.max(1, Math.round(list.filter((c) => c.kind === "pc").reduce((sum, c, _, pcs) => sum + c.level / pcs.length, 0)))
    };
    if (!options.heroPoints) for (const c of list) c.heroPoints = 0;
    // Grab, Knockdown and Push after a hit (spells.js resolves them).
    state.onStrikeHit = (attacker, target, strike, degree) => triggerRiders(state, attacker, target, strike, degree);
    // Poison Weapon (B72): the poison's affliction on the creature hit.
    state.onPoison = (attacker, target) => {
        state.log?.push(`  ${attacker.poisonWeapon.spell.name} from ${attacker.name}'s weapon`);
        castPlan(state, attacker, attacker.poisonWeapon.spell, [target.id]);
    };
    // Before placing: an escalation's creatures wait off the field, and so do hazards not yet set off.
    setUpEscalations(state, snapshot.setup?.escalations);
    setUpHazards(state, snapshot.setup?.escalations);
    placeCombatants(state);
    placeOnMap(state);
    initMorale(state);
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

function rollInitiative(state, snapshot) {
    const ambush = snapshot.setup?.ambush ?? null;
    if (ambush === "party") state.surprisedSide = "foes";
    else if (ambush === "foes") state.surprisedSide = "party";
    state.stealthInitiative = new Set();
    const rolled = state.list.map((c) => {
        const useStealth = ambush && ambush === c.side && typeof c.stealth === "number";
        if (useStealth) state.stealthInitiative.add(c.id);
        // Ten Paces: +2 circumstance to the initiative roll (C18).
        const modifier = (useStealth ? c.stealth : (c.perception ?? 0)) + (c.initiativeBonus ?? 0);
        return { c, total: state.rng.d20() + modifier, modifier };
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
    if (!pcs(state).some(isActive)) {
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
        if (surviving.length && !foes.some(coming) && broken >= survivors / 2 && broken > 0) {
            pursuit(state, surviving);
            finish(state, "rout");
            return true;
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
        if (applyCondition(state, c, entry.slug, entry.value ?? null, { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" }, c)) state.log?.push(`  ${c.name} is ${entry.slug}${Number.isFinite(entry.value) ? ` ${entry.value}` : ""}`);
    }
}

function startTurn(state, c) {
    keepPermanent(c);
    c.reactionUsed = false;
    c.attacksThisTurn = 0;
    c.round = state.round;
    c.riderReady = null;
    c.rendUsed = false;
    c.withdrewThisTurn = false;
    // Flourishes (Flurry of Blows): once a turn. A finisher ends Strikes for the turn.
    c.usedThisTurn = new Set();
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
    // Collapsed (B59): it re-forms with its first action.
    if (c.collapsed && c.actionsLeft > 0 && isActive(c)) {
        c.actionsLeft -= 1;
        c.collapsed = false;
        c.cond.immobilized = false;
        c.cond.offGuard = false;
        state.log?.push(`  ${c.name} re-forms`);
    }
    // Fast healing (the creature's own, or from spell effects) and regeneration.
    const fastHealing = Math.max(c.fastHealing ?? 0, ...(c.effects ?? []).map((effect) => effect.model.fastHealing ?? 0));
    if (fastHealing > 0) applyHeal(state, c, fastHealing);
    if (regenerating(c) && c.regeneratedRound !== state.round) applyHeal(state, c, c.regeneration.value);
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
    // Panache from a failed bravado action lasts only this turn.
    if (c.panache === "turn") c.panache = false;
    // Wine-Soaked, Draining Roots: a passive on a creature held as a turn ends (B49).
    grabTurnAnswers(state, c, "end");
    // Swallow Whole's damage at the end of each of the swallowed creature's turns.
    if (c.swallowedBy && c.swallow?.damage?.length) {
        state.log?.push(`  ${c.name} is crushed inside ${state.byId.get(c.swallowedBy)?.name}`);
        applyDamage(state, c, rollInstances(state, c.swallow.damage), { source: state.byId.get(c.swallowedBy) });
    }
    for (const entry of [...c.persistent]) {
        if (c.status === DEAD || c.status === FLED || c.status === SURRENDERED) break;
        const amount = adjustInstance(c, entry.type, rollPersistent(state.rng, entry));
        state.log?.push(`  ${c.name} takes ${amount} persistent ${entry.type}`);
        dealDamage(state, c, amount);
        if (flatCheck(state.rng, 15) >= SUCCESS) c.persistent.splice(c.persistent.indexOf(entry), 1);
    }
    if (c.cond.frightened > 0) c.cond.frightened--;
    // "Fleeing for as long as it's frightened" ends with the frightened.
    endWhileConditions(c);
    if (isActive(c)) moraleRecovery(state, c);
    // Fleeing from a spell or an ability runs out, and the creature comes back; only one that gave up
    // on a morale check leaves the field.
    if (c.cond.fleeing && isActive(c) && c.band === "far" && c.moraleState?.broken) leaveField(state, c);
    processMorale(state);
}

function act(state, c, action) {
    // A rider (Grab, Knockdown) must follow the Strike straight away.
    const rider = c.riderReady;
    c.riderReady = null;
    switch (action.type) {
        case "strike": {
            const target = state.byId.get(action.targetId);
            const strike = c.strikes[action.strikeIndex];
            // Reloading it first (Interact, the weapon's reload actions), then the shot empties it again.
            if (action.reload) {
                state.log?.push(`  ${c.name} reloads ${strike.name}`);
                c.unloaded?.delete(strike.name);
            }
            performStrike(state, c, target, strike);
            if (strike?.reload) (c.unloaded ??= new Set()).add(strike.name);
            break;
        }
        case "reload": {
            const strike = c.strikes[action.strikeIndex];
            state.log?.push(`  ${c.name} reloads ${strike?.name}`);
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
            }
            break;
        case "raiseShield":
            raiseShield(state, c);
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
        case "cast": {
            if (action.rider && !(rider && rider.index === action.spellIndex)) break;
            if (action.quickened) {
                c.quickenedUsed = true;
                state.log?.push(`  ${c.name} uses ${c.quickenedCasting?.name ?? "Quickened Casting"}`);
            }
            // Casting with the manipulate trait provokes (S12; Reactive Strike's critical hit disrupts it), and with the
            // concentrate trait, the reactions that say so (B51).
            const spell = c.spells[action.spellIndex];
            const traits = spell?.plan?.activation?.traits ?? spell?.plan?.traits ?? [];
            let disrupted = traits.includes("manipulate") ? provoke(state, c, "manipulate") : false;
            if (canAct(c) && traits.includes("concentrate")) disrupted = provoke(state, c, "concentrate") || disrupted;
            if (!canAct(c)) break;
            // Steady Spellcasting (B55): a flat check, and on a success the spell isn't disrupted.
            if (disrupted && c.steadySpellcasting && flatCheck(state.rng, c.steadySpellcasting) >= SUCCESS) {
                disrupted = false;
                state.log?.push(`  ${c.name} keeps casting (Steady Spellcasting)`);
            }
            // (A follow-up by the Strike's degree, "Enfeebled 2 (or Enfeebled 3 on a critical hit)": that Strike's degree, B68.)
            const byStrike = action.rider && spell?.plan?.resolution?.check?.statistic === "strike" && Number.isFinite(rider?.degree);
            castSpell(state, c, action.spellIndex, action.targetIds, action.actions, { ...(disrupted ? { disrupted: true } : {}), ...(byStrike ? { forcedDegree: rider.degree } : {}) });
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
            const result = performStrike(state, c, target, chargeStrike(fired, activity.coverFire ? { ...activity, attackBonus: ducksFromCoverFire(target) ? -2 : 1 } : activity));
            if (activity.noMap || activity.previousMap) c.attacksThisTurn = attacksBefore;
            if (fired?.reload) (c.unloaded ??= new Set()).add(fired.name);
            // A finisher spends panache, and no more attacks this turn; Confident Finisher's miss still deals half its dice.
            if (activity.finisher) {
                c.panache = false;
                c.noAttacksThisTurn = true;
                if (activity.finisher === "confident" && result?.degree === 1 && isActive(target)) {
                    let amount = 0;
                    for (let die = 0; die < (c.panacheStyle?.finisherDice ?? 2); die++) amount += state.rng.die(6);
                    const dealt = applyDamage(state, target, [{ type: c.strikes[action.strikeIndex].damage[0].type, amount: Math.floor(amount / 2), persistent: false, precision: true }], { source: c });
                    state.log?.push(`  ${target.name} takes ${dealt} from the finisher's miss`);
                }
            }
            // Vicious Swing counts as two attacks; Exacting Strike's miss doesn't count.
            if (result && activity.countsAs > 1) c.attacksThisTurn += activity.countsAs - 1;
            if (result && activity.exacting && result.degree === 1) c.attacksThisTurn = Math.max(0, c.attacksThisTurn - 1);
            // Focused Assault (B74): a failure (not a critical one) still deals the Strike's damage, as a hit's.
            if (result && activity.failureDamage && result.degree === FAILURE && isActive(target)) {
                const instances = rollStrikeDamage(state.rng, fired, { critical: false, penalty: fired.melee ? c.cond.enfeebled ?? 0 : 0 });
                const dealt = applyDamage(state, target, instances, { source: c, physical: true });
                state.log?.push(`  ${target.name} takes ${dealt} from the failed ${activity.name}`);
            }
            if (result && result.degree >= SUCCESS && isActive(target)) applyStrikeRider(state, c, target, activity, result.degree === 3, fired);
            // Set-Up Strike: its hit leaves the target off-guard to an ally's next attack.
            if (activity.setUp && result && result.degree >= SUCCESS && isActive(target)) setUp(state, c, target);
            break;
        }
        // Battle Medicine: a Medicine check against the Treat Wounds DC it chose.
        case "battleMedicine": {
            const target = state.byId.get(action.targetId);
            if (target) battleMedicine(state, c, target, action.tier);
            break;
        }
        case "rend": {
            const target = state.byId.get(action.targetId);
            if (target && isActive(target)) performRend(state, c, target, c.strikes[action.strikeIndex]);
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
            let target = state.byId.get(action.targetId);
            const attacks = c.attacksThisTurn;
            // A Strike at every enemy in its Melee (Vine Lash, Thrash), or at that many of them (Dual Tusks, Swipe); a ranged
            // one at any enemies (Cannonade).
            if (ability.each) {
                const order = multiStrikeOrder(c, ability) ?? [];
                const ranged = order.length > 0 && c.strikes[order[0]] && !c.strikes[order[0]].melee;
                const foes = (ranged ? state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone") : engagedEnemies(state, c)).slice(0, ability.max ?? Infinity);
                for (const [step, foe] of foes.entries()) {
                    // (Three-Headed Strike, B74: a different Strike at each creature, in turn.)
                    const index = order[Math.min(step, order.length - 1)];
                    if (!canAct(c) || index === undefined) break;
                    // Each at the penalty it started with, when it doesn't rise until all are made.
                    if (ability.sameMap) c.attacksThisTurn = attacks;
                    // (Hungry Flurry, Double Shot: each at a -2 penalty, B62.)
                    if (isActive(foe)) performStrike(state, c, foe, ability.penalty ? { ...c.strikes[index], bonus: c.strikes[index].bonus - ability.penalty } : c.strikes[index]);
                }
                // ("These Strikes count as only one attack for its multiple attack penalty", B74.)
                if (ability.sameMap) c.attacksThisTurn = attacks + (ability.countsAs ?? foes.length);
                multiStrikeAfter(state, c, ability);
                break;
            }
            let grabbed = false;
            let firstHit = false;
            for (const [step, index] of (multiStrikeOrder(c, ability) ?? []).entries()) {
                if (!canAct(c)) break;
                let strike = c.strikes[index];
                if (ability.sameTarget ? !target || !isActive(target) : !target || !isActive(target) || (strike.melee && !sameMelee(c, target))) target = ability.sameTarget ? null : engagedEnemies(state, c)[0] ?? null;
                if (!target) break;
                if (ability.sameMap) c.attacksThisTurn = attacks;
                // Double Slice's second Strike: -2 unless agile (C4). A monster's that doesn't raise the penalty: none (B62).
                if (ability.secondPenalty && step > 0 && !strike.agile) strike = { ...strike, bonus: strike.bonus - 2 };
                if (ability.penalty) strike = { ...strike, bonus: strike.bonus - ability.penalty };
                // Twin Feint (B74): the target is off-guard against the second attack (or only after a first that hit).
                if (step === 1 && (ability.secondOffGuard === true || (ability.secondOffGuard === "hit" && firstHit))) (target.offGuardTo ??= []).push({ attacker: c.id, attacks: "all", uses: 1 });
                const result = performStrike(state, c, target, strike);
                if (step === 0) firstHit = (result?.degree ?? 0) >= SUCCESS;
                // "If either Strike hits, the dragon can attempt to Grab the target … as a free action" (Coiling Frenzy): its Grab, once.
                if (ability.grab && !grabbed && result?.degree >= SUCCESS && isActive(target)) {
                    const grab = (c.spells ?? []).findIndex((spell) => ["grab", "improved-grab"].includes(spell.plan?.source?.slug) || spell.plan?.trigger?.attackEffect === "grab");
                    if (grab >= 0) {
                        castSpell(state, c, grab, [target.id]);
                        grabbed = true;
                    }
                }
            }
            if (ability.sameMap) c.attacksThisTurn = attacks + (ability.countsAs ?? multiStrikeOrder(c, ability)?.length ?? 0);
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
        // Hunt Prey: the creature its hunter's edge works against.
        case "huntPrey": {
            const target = state.byId.get(action.targetId);
            if (target && isActive(target)) {
                c.prey = target.id;
                state.log?.push(`  ${c.name} hunts ${target.name} as its prey`);
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
            stride(state, c, { kind: "engage", targetId: action.targetId });
            if (canAct(c) && target && isActive(target) && sameMelee(c, target)) performStrike(state, c, target, chargeStrike(c.strikes[action.strikeIndex], c.charges[action.ability]));
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

function actionCost(c, action) {
    if (action.type === "strike") return 1 + (action.reload ?? 0);
    if (action.type === "reload") return action.actions;
    if (action.type === "slingersReload" || action.type === "rechargeSpellstrike") return 1;
    if (action.type === "spellstrike" || action.type === "strikeHard") return 2;
    if (action.type === "pincerAttack" || action.type === "bannersInspiration" || action.type === "shiftImmanence" || action.type === "transcend") return 1;
    if (action.type === "disableHazard") return 2;
    if (action.type === "multiStrike" || action.type === "charge" || action.type === "strikeActivity" || action.type === "selfBuff" || action.type === "selfEffect" || action.type === "safeMove" || action.type === "mythicRemove" || action.type === "mythicRecharge" || action.type === "poisonWeapon") return action.actions ?? 1;
    // (Quickened Casting, B72: one action fewer.)
    if (action.type === "cast") return Math.max(1, (action.actions ?? describeSpell(c.spells[action.spellIndex].plan).actions ?? 2) - (action.quickened ? 1 : 0));
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

function takeTurn(state, c) {
    // Conditions this creature's spells timed end at the start of its turn, whatever its state.
    expireTimers(state, c);
    if (c.status === DOWN && c.kind !== "pc" && regenerating(c)) regenerateUp(state, c);
    if (c.status === DOWN) {
        state.log?.push(`${c.name} (down)`);
        if (c.kind === "pc" && c.cond.dying > 0) recoveryCheck(state, c);
        endTurn(state, c);
        return;
    }
    if (!canAct(c)) return;
    startTurn(state, c);
    state.log?.push(`${c.name} (${c.hp.value}/${c.hp.max} HP, ${c.band})`);
    // Petrifying Glance: an enemy's reaction to this turn starting near it (B47). Mind-Numbing Grasp: its holder's passive (B49).
    state.acting = c.id;
    turnStartReactions(state, c);
    grabTurnAnswers(state, c, "start");
    // Shrieking Frenzy: its own free action as its turn begins (B53).
    ownTurnStart(state, c);
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
    } else if (c.cond.confused) {
        confusedTurn(state, c);
        if (state.outcome) return;
    } else if (c.cond.fleeing) {
        fleeTurn(state, c);
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
    for (const entry of (state.afterAction ?? []).splice(0)) {
        const c = state.byId.get(entry.sourceId);
        const target = state.byId.get(entry.targetId);
        if (entry.kind !== "fast-swallow" || !c || !target || !isActive(c) || !isActive(target) || !canReact(c) || target.grabbedBy !== c.id || target.swallowedBy) continue;
        const index = (c.spells ?? []).findIndex((spell) => describeSpell(spell.plan).swallow);
        if (index < 0) continue;
        c.reactionUsed = true;
        state.log?.push(`  ${c.name} uses ${c.fastSwallow.name}`);
        castSpell(state, c, index, [target.id]);
    }
}

function shouldRetreat(state) {
    if (!state.options.retreat) return false;
    const down = pcs(state).filter((c) => c.status === DOWN || c.status === DEAD).length;
    if (down < 2) return false;
    // "Failed or can't be completed": an open objective is out of reach once the foes are ahead.
    if (state.objective?.status === "failed") return true;
    return partyAdvantage(state) < 1;
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
    // Frightful Presence and other auras: each enemy in range saves when the fight starts.
    if (!resuming) applyAuras(state);
    if (!resuming) initiativeDeeds(state);
    // Chilling Cry, Predestined Defeat: a monster's reaction to rolling initiative (B47).
    if (!resuming) initiativeReactions(state);
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
