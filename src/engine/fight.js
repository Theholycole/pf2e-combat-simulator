// One simulated fight from a snapshot.

import { createRng } from "./rng.js";
import { flatCheck, SUCCESS } from "./checks.js";
import { ACTIVE, DEAD, DOWN, FLED, PENDING, SURRENDERED, canAct, createCombatant, isActive } from "./combatant.js";
import { engage, engagedEnemies, leaveMelee } from "./space.js";
import { dealDamage, leaveField, performStrike, raiseShield, recoveryCheck, stand, step, stride } from "./actions.js";
import { adjustInstance, rollPersistent } from "./damage.js";
import { MORALE_RULES, mergeMoraleRules } from "./morale-rules.js";
import { checkCantAffect, defaultMoraleProfile, initMorale, moraleRecovery, partyAdvantage, processMorale } from "./morale.js";
import { createObjective, endOfRoundObjective, performTask, settleObjectiveAfterLoss, settleObjectiveAfterWin, updateObjective } from "./objectives.js";
import { bestOffense, chooseAction, computeThreats, guessRole } from "./planner.js";

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
    c.withdrewThisTurn = false;
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
}

function endTurn(state, c) {
    for (const entry of [...c.persistent]) {
        if (c.status === DEAD || c.status === FLED || c.status === SURRENDERED) break;
        const amount = adjustInstance(c, entry.type, rollPersistent(state.rng, entry));
        state.log?.push(`  ${c.name} takes ${amount} persistent ${entry.type}`);
        dealDamage(state, c, amount);
        if (flatCheck(state.rng, 15) >= SUCCESS) c.persistent.splice(c.persistent.indexOf(entry), 1);
    }
    if (c.cond.frightened > 0) c.cond.frightened--;
    if (isActive(c)) moraleRecovery(state, c);
    if (c.cond.fleeing && isActive(c) && c.band === "far") leaveField(state, c);
    processMorale(state);
}

function act(state, c, action) {
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
        default:
            break;
    }
}

function actionCost(action) {
    return action.type === "task" ? 2 : 1;
}

// A fleeing creature spends its actions getting away.
function fleeTurn(state, c) {
    while (c.actionsLeft > 0 && canAct(c) && c.status === ACTIVE) {
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
    if (c.cond.fleeing) {
        fleeTurn(state, c);
    } else {
        let guard = 0;
        while (c.actionsLeft > 0 && canAct(c) && !c.cond.fleeing && guard++ < 8) {
            const action = chooseAction(state, c);
            if (!action) break;
            c.actionsLeft -= actionCost(action);
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
