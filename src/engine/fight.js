// One simulated fight from a snapshot.

import { createRng } from "./rng.js";
import { flatCheck, SUCCESS } from "./checks.js";
import { ACTIVE, DEAD, DOWN, FLED, PENDING, SURRENDERED, canAct, canMove, createCombatant, isActive, strikeUsable } from "./combatant.js";
import { engage, engagedEnemies, leaveMelee, sameMelee } from "./space.js";
import { applyDamage, dealDamage, expectedHitDamage, interact, leaveField, performRend, performStrike, raiseShield, recoveryCheck, stand, step, stride } from "./actions.js";
import { chargeStrike, multiStrikeOrder, regenerating } from "./abilities.js";
import { adjustInstance, rollPersistent } from "./damage.js";
import { MORALE_RULES, mergeMoraleRules } from "./morale-rules.js";
import { checkCantAffect, defaultMoraleProfile, initMorale, moraleRecovery, partyAdvantage, processMorale } from "./morale.js";
import { createObjective, endOfRoundObjective, performTask, settleObjectiveAfterLoss, settleObjectiveAfterWin, updateObjective } from "./objectives.js";
import { bestOffense, chooseAction, computeThreats, guessRole } from "./planner.js";
import { applyAuras, applyHeal, applyStrikeRider, castSpell, describeSpell, expireTimers, hasTimer, retch, rollInstances, triggerRiders } from "./spells.js";

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
        surprisedSide: null
    };
    if (!options.heroPoints) for (const c of list) c.heroPoints = 0;
    // Grab, Knockdown and Push after a hit (spells.js resolves them).
    state.onStrikeHit = (attacker, target, strike, degree) => triggerRiders(state, attacker, target, strike, degree);
    placeCombatants(state);
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
    const rolled = state.list.map((c) => {
        const useStealth = ambush && ambush === c.side && typeof c.stealth === "number";
        const modifier = useStealth ? c.stealth : (c.perception ?? 0);
        return { c, total: state.rng.d20() + modifier, modifier };
    });
    rolled.sort((a, b) => (b.total - a.total) || ((a.c.side === "foes" ? 0 : 1) - (b.c.side === "foes" ? 0 : 1)) || (b.modifier - a.modifier));
    state.order = rolled.map((entry) => entry.c.id);
    state.initiative = new Map(rolled.map((entry) => [entry.c.id, entry.total]));
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
    for (const c of state.list) {
        if (c.status === PENDING && c.arrivesRound <= state.round) {
            c.status = ACTIVE;
            c.band = c.arrivesBand === "engaged" ? "near" : (c.arrivesBand ?? "near");
            insertArrival(state, c);
            state.log?.push(`  ${c.name} arrives (${c.band})`);
        }
    }
}

function pcs(state) {
    return state.list.filter((c) => c.side === "party" && c.kind === "pc");
}

function checkEnd(state) {
    if (state.outcome) return true;
    updateObjective(state);
    if (!pcs(state).some(isActive)) {
        finish(state, "defeat");
        return true;
    }
    const foes = state.list.filter((c) => c.side === "foes" && c.kind !== "object");
    const remaining = foes.filter((c) => c.status === ACTIVE || c.status === PENDING);
    if (!remaining.length) {
        finish(state, foes.some((c) => c.status === FLED) ? "rout" : "decisive");
        return true;
    }
    if (state.options.morale) {
        const surviving = foes.filter((c) => c.status === ACTIVE);
        const broken = surviving.filter((c) => c.cond.fleeing || c.moraleState.broken);
        if (surviving.length && !foes.some((c) => c.status === PENDING) && broken.length >= surviving.length / 2 && broken.length > 0) {
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
    if (outcome === "decisive" || outcome === "rout" || outcome === "survived") settleObjectiveAfterWin(state);
    else settleObjectiveAfterLoss(state);
    state.log?.push(`Outcome: ${outcome}${state.objective ? `; objective ${state.objective.status}` : ""}`);
}

function startTurn(state, c) {
    c.reactionUsed = false;
    c.attacksThisTurn = 0;
    c.round = state.round;
    c.riderReady = null;
    c.rendUsed = false;
    c.withdrewThisTurn = false;
    // Flourishes (Flurry of Blows): once a turn.
    c.usedThisTurn = new Set();
    c.turnAttacks = [];
    if (c.shield) c.shield.raised = false;
    let actions = 3 + (c.cond.quickened ? 1 : 0);
    if (c.cond.stunned > 0) {
        const lost = Math.min(c.cond.stunned, actions);
        c.cond.stunned -= lost;
        actions -= lost;
    }
    actions -= Math.min(actions, c.cond.slowed);
    c.actionsLeft = Math.min(actions, MAX_ACTIONS_PER_TURN);
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
    if (isActive(c)) moraleRecovery(state, c);
    // A spell's fleeing (Fear) runs out; only morale's makes a creature leave.
    if (c.cond.fleeing && isActive(c) && c.band === "far" && !hasTimer(c, "fleeing")) leaveField(state, c);
    processMorale(state);
}

function act(state, c, action) {
    // A rider (Grab, Knockdown) must follow the Strike straight away.
    const rider = c.riderReady;
    c.riderReady = null;
    switch (action.type) {
        case "strike": {
            const target = state.byId.get(action.targetId);
            performStrike(state, c, target, c.strikes[action.strikeIndex]);
            break;
        }
        case "stride":
            stride(state, c, action.move);
            if (action.move.kind !== "engage") c.withdrewThisTurn = true;
            break;
        case "step":
            step(state, c);
            c.withdrewThisTurn = true;
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
        case "cast":
            if (action.rider && !(rider && rider.index === action.spellIndex)) break;
            castSpell(state, c, action.spellIndex, action.targetIds, action.actions);
            break;
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
            if (!target || !isActive(target)) break;
            if (activity.strides && !sameMelee(c, target)) {
                stride(state, c, { kind: "engage", targetId: action.targetId });
                if (!canAct(c) || !isActive(target) || !sameMelee(c, target)) break;
            }
            const result = performStrike(state, c, target, chargeStrike(c.strikes[action.strikeIndex], activity));
            if (result && result.degree >= SUCCESS && isActive(target)) applyStrikeRider(state, c, target, activity, result.degree === 3);
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
            let target = state.byId.get(action.targetId);
            const attacks = c.attacksThisTurn;
            for (const [step, index] of (multiStrikeOrder(c, ability) ?? []).entries()) {
                if (!canAct(c)) break;
                let strike = c.strikes[index];
                if (ability.sameTarget ? !target || !isActive(target) : !target || !isActive(target) || (strike.melee && !sameMelee(c, target))) target = ability.sameTarget ? null : engagedEnemies(state, c)[0] ?? null;
                if (!target) break;
                if (ability.sameMap) c.attacksThisTurn = attacks;
                if (ability.sameMap && step > 0 && !strike.agile) strike = { ...strike, bonus: strike.bonus - 2 };
                performStrike(state, c, target, strike);
            }
            if (ability.sameMap) c.attacksThisTurn = attacks + (multiStrikeOrder(c, ability)?.length ?? 0);
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
            stride(state, c, { kind: "engage", targetId: action.targetId });
            if (canAct(c) && target && isActive(target) && sameMelee(c, target)) performStrike(state, c, target, chargeStrike(c.strikes[action.strikeIndex], c.charges[action.ability]));
            break;
        }
        default:
            break;
    }
}

// One action as the turn loop takes it, for tests that set up exact situations.
export function performAction(state, c, action) {
    act(state, c, action);
}

function actionCost(c, action) {
    if (action.type === "multiStrike" || action.type === "charge" || action.type === "strikeActivity" || action.type === "selfBuff") return action.actions;
    if (action.type === "cast") return action.actions ?? describeSpell(c.spells[action.spellIndex].plan).actions ?? 2;
    return action.type === "task" ? 2 : 1;
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
    if (state.round === 1 && state.surprisedSide === c.side && c.side === "foes" && !state.surpriseRaised) {
        state.surpriseRaised = true;
        state.pendingEvents.push({ type: "surprised" });
        processMorale(state);
    }
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
    } else {
        let guard = 0;
        while (c.actionsLeft > 0 && canAct(c) && !c.cond.fleeing && guard++ < 8) {
            const action = chooseAction(state, c);
            if (!action) break;
            c.actionsLeft -= actionCost(c, action);
            act(state, c, action);
            processMorale(state);
            if (checkEnd(state)) return;
        }
        if (c.cond.fleeing && canAct(c)) fleeTurn(state, c);
    }
    if (state.outcome) return;
    endTurn(state, c);
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
    let turnIndex = resuming ? Math.max(0, snapshot.turn ?? 0) : 0;
    if (!checkEnd(state)) {
        while (!state.outcome) {
            if (turnIndex === 0) {
                state.log?.push(`— Round ${state.round} —`);
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
            endOfRoundObjective(state);
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
            status: c.captured && c.status !== SURRENDERED ? "captured" : c.status,
            damageDealt: c.damageDealt,
            pcsDowned: c.downedCount
        })),
        damageBy: state.damageBy,
        stats: { ...state.stats, groupRout: !!state.stats.groupRout },
        log: state.log
    };
}
