// Escalations (E1–E4): rules that change a fight partway, "when X, then Y".
//
// When: round N (as it begins), the alarm is raised, a chosen creature falls
// (drops, dies, flees, surrenders or is captured), the foes are down to half
// their total HP, the first foe flees, or a party creature enters a Region.
// Then: creatures arrive (after a delay, near, far or at a Region), a hazard
// starts, or danger starts. Each rule fires once.
//
// The alarm: a foe marked as a raiser reaches its gong and spends 1 Interact
// action, or runs off the battlefield; either raises it, once.

import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";
import { ACTIVE, DEAD, DOWN, FLED, PENDING, SURRENDERED, armorClass, canAct, isActive, saveModifier } from "./combatant.js";
import { applyDamage, expectedHitDamage } from "./actions.js";
import { degreeDistribution, rollCheck, CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS } from "./checks.js";
import { rollInstances } from "./spells.js";

const log = (state, line) => state.log?.push(line);

const FALLEN = new Set([DOWN, DEAD, FLED, SURRENDERED]);

// The escalation state, from setup.escalations: { rules, alarm: { raisedRound } }.
export function setUpEscalations(state, definition) {
    const rules = (definition?.rules ?? []).filter((rule) => rule?.when?.kind && rule?.then?.kind).map((rule, index) => ({ ...rule, id: rule.id ?? `rule${index + 1}`, fired: rule.fired ?? null }));
    const raisedRound = definition?.alarm?.raisedRound ?? null;
    state.escalation = { rules, alarm: { raised: raisedRound !== null, round: raisedRound } };
    if (!rules.length && !state.list.some((c) => c.alarm)) {
        state.escalation = null;
        return;
    }
    // The creatures a rule brings wait until it fires, unless they're here already
    // (live play: their tokens are visible); a rule that fired already has its arrival set.
    for (const rule of rules) {
        if (rule.then.kind !== "arrive") continue;
        for (const id of rule.then.creatureIds ?? []) {
            const c = state.byId.get(id);
            if (!c || c.arrived || c.status !== ACTIVE) continue;
            c.status = PENDING;
            c.awaitsRule = rule.id;
            if (rule.fired !== null) scheduleArrival(state, c, rule, rule.fired, rule.when.kind === "round" && rule.fired === rule.when.round);
        }
    }
    state.escalation.helpThreat = helpThreat(state);
}

// What the alarm's help adds a round: the damage its creatures would deal the party.
function helpThreat(state) {
    const party = state.list.filter((c) => c.side === "party" && c.kind !== "object");
    if (!party.length) return 0;
    const ac = party.reduce((sum, c) => sum + armorClass(c), 0) / party.length;
    let total = 0;
    for (const rule of state.escalation.rules) {
        if (rule.when.kind !== "alarm" || rule.then.kind !== "arrive" || rule.fired !== null) continue;
        for (const id of rule.then.creatureIds ?? []) {
            const c = state.byId.get(id);
            if (!c || c.status !== PENDING) continue;
            let best = 0;
            for (const strike of c.strikes ?? []) {
                const odds = degreeDistribution(strike.bonus, ac);
                best = Math.max(best, odds[SUCCESS] * expectedHitDamage(c, strike, party[0], false) + odds[CRITICAL_SUCCESS] * expectedHitDamage(c, strike, party[0], true));
            }
            // Two Strikes a round, the second at a penalty, roughly.
            total += 1.6 * best / (1 + (rule.then.delay ?? 0));
        }
    }
    return total;
}

function scheduleArrival(state, c, rule, firedRound, atRoundStart) {
    c.arrivesRound = firedRound + (atRoundStart ? 0 : 1) + Math.max(0, rule.then.delay ?? 0);
    c.arrivesBand = rule.then.band ?? "near";
    // Coming in at a Region: its distances to the area and the exit (map objectives).
    if (rule.then.placeFeet) c.arrivePlace = rule.then.placeFeet;
}

// Total HP the foes have left, as a share of what they started with (fled foes count as none).
function foeHpShare(state) {
    let now = 0;
    let max = 0;
    for (const c of state.list) {
        if (c.side !== "foes" || c.kind === "object" || c.kind === "hazard" || c.status === PENDING) continue;
        max += c.hp.max;
        if (c.status !== FLED && c.status !== SURRENDERED && !c.captured) now += Math.max(0, c.hp.value);
    }
    return max ? now / max : 1;
}

function triggered(state, when) {
    switch (when.kind) {
        case "round":
            return state.round >= (when.round ?? 1);
        case "alarm":
            return state.escalation.alarm.raised;
        case "falls": {
            const c = state.byId.get(when.creatureId);
            return !!c && (FALLEN.has(c.status) || !!c.captured);
        }
        case "foesHalf":
            return foeHpShare(state) <= 0.5;
        case "firstFlee":
            return state.list.some((c) => c.side === "foes" && c.status === FLED);
        case "enters":
            return state.list.some((c) => c.side === "party" && isActive(c) && c.regionFeet?.[when.region]?.to <= 0);
        default:
            return false;
    }
}

// Fires the rules whose moment has come (as a round begins, and after each action).
export function checkEscalations(state, effects = {}) {
    const escalation = state.escalation;
    if (!escalation) return;
    for (const rule of escalation.rules) {
        if (rule.fired !== null || !triggered(state, rule.when)) continue;
        rule.fired = state.round;
        log(state, `  Escalation: ${describeWhen(state, rule.when)} → ${describeThen(state, rule.then)}`);
        if (rule.then.kind === "arrive") {
            for (const id of rule.then.creatureIds ?? []) {
                const c = state.byId.get(id);
                // Round N fires as round N begins, wherever the check is.
                if (c?.status === PENDING && c.awaitsRule === rule.id) scheduleArrival(state, c, rule, state.round, rule.when.kind === "round");
            }
        } else effects[rule.then.kind]?.(state, rule);
    }
}

function nameOf(state, id) {
    return state.byId.get(id)?.name ?? id;
}

export function describeWhen(state, when) {
    if (when.kind === "round") return `round ${when.round}`;
    if (when.kind === "alarm") return "the alarm is raised";
    if (when.kind === "falls") return `${nameOf(state, when.creatureId)} falls`;
    if (when.kind === "foesHalf") return "the foes are down to half their HP";
    if (when.kind === "firstFlee") return "a foe flees";
    if (when.kind === "enters") return "the party enters a Region";
    return when.kind;
}

function describeThen(state, then) {
    if (then.kind === "arrive") return `${(then.creatureIds ?? []).map((id) => nameOf(state, id)).join(", ")} ${then.delay ? `arrive ${then.delay} round${then.delay > 1 ? "s" : ""} later` : "arrive"}`;
    if (then.kind === "hazard") return `${nameOf(state, then.hazardId)} starts`;
    if (then.kind === "danger") return `danger starts (${then.damage} ${then.type ?? ""})`.replace(" )", ")");
    return then.kind;
}

// Danger (E3): from its rule's round, at the end of each round, damage (with an
// optional basic save) to everyone, one side, or everyone in a Region; it can
// grow each round, and it lasts until the fight ends.
export function startDanger(state, rule) {
    const then = rule.then;
    const type = then.type ?? "untyped";
    (state.dangers ??= []).push({
        name: then.name ?? `${then.damage} ${type}`,
        type,
        instances: parseDamage(String(then.damage ?? "0"), { type }),
        grow: then.grow ? parseDamage(String(then.grow), { type }) : [],
        save: then.save?.type && then.save?.dc ? then.save : null,
        targets: then.targets ?? "all",
        region: then.region ?? null,
        rounds: 0
    });
}

// Whether a danger reaches a creature: up (or a downed PC, who is still there), and covered by it.
export function inDanger(danger, c) {
    if (c.kind === "object" || c.kind === "hazard" || c.swallowedBy) return false;
    if (!isActive(c) && !(c.status === DOWN && c.kind === "pc")) return false;
    if (danger.targets === "party" || danger.targets === "foes") return c.side === danger.targets;
    if (danger.targets === "region") return (c.regionFeet?.[danger.region]?.to ?? Infinity) <= 0;
    return true;
}

const BASIC = { [CRITICAL_SUCCESS]: 0, [SUCCESS]: 0.5, [FAILURE]: 1, [CRITICAL_FAILURE]: 2 };

// The dangers' damage as a round ends: rolled once a round, each creature saving on its own.
export function dangerAtRoundEnd(state) {
    for (const danger of state.dangers ?? []) {
        danger.rounds++;
        const parts = [...danger.instances, ...Array.from({ length: danger.rounds - 1 }, () => danger.grow).flat()];
        const amount = rollInstances(state, parts).reduce((sum, instance) => sum + instance.amount, 0);
        const hit = state.list.filter((c) => inDanger(danger, c));
        if (!hit.length) continue;
        log(state, `  ${danger.name}: ${amount} ${danger.type}`);
        for (const c of hit) {
            let share = 1;
            if (danger.save) {
                const roll = rollCheck(state.rng, saveModifier(c, danger.save.type), danger.save.dc);
                share = BASIC[roll.degree];
            }
            const dealt = applyDamage(state, c, [{ type: danger.type, amount: Math.floor(amount * share), persistent: false, precision: false }]);
            log(state, `  ${c.name} takes ${dealt} (${Math.max(0, c.hp.value)}/${c.hp.max})`);
        }
    }
}

// What a danger is expected to deal a creature at the next round's end (for the planner).
export function expectedDanger(danger, c) {
    const average = (list) => list.reduce((sum, instance) => sum + (instance.constant ?? 0) + (instance.dice ?? []).reduce((total, term) => total + (term.factor ?? 1) * term.count * (term.die + 1) / 2, 0), 0);
    let amount = average(danger.instances) + danger.rounds * average(danger.grow);
    if (danger.save) {
        const odds = degreeDistribution(saveModifier(c, danger.save.type), danger.save.dc);
        amount *= odds[CRITICAL_FAILURE] * 2 + odds[FAILURE] + odds[SUCCESS] * 0.5;
    }
    return amount;
}

// A Stride toward the nearest edge of a danger Region; out once it's covered.
export function strideOutOf(state, c, region) {
    const place = c.regionFeet?.[region];
    if (!place || place.to > 0) return;
    place.edge = Math.max(0, place.edge - Math.max(5, c.speed ?? 25));
    if (place.edge <= 0) place.to = 5;
    log(state, `  ${c.name} Strides ${place.to > 0 ? "out of" : "toward the edge of"} the danger`);
}

// Help is on its way: the alarm was raised and its creatures haven't come yet.
export function helpPending(state) {
    const escalation = state.escalation;
    if (!escalation?.alarm.raised) return false;
    return escalation.rules.some((rule) => rule.when.kind === "alarm" && rule.then.kind === "arrive" && (rule.then.creatureIds ?? []).some((id) => state.byId.get(id)?.status === PENDING));
}

export function alarmOpen(state) {
    return !!state.escalation && !state.escalation.alarm.raised;
}

export function raiseAlarm(state, c) {
    const alarm = state.escalation?.alarm;
    if (!alarm || alarm.raised) return;
    alarm.raised = true;
    alarm.round = state.round;
    log(state, `  ${c.name} raises the alarm`);
}

// At the gong: Interact (1 action, manipulate), so it provokes and a critical hit disrupts it.
export function soundGong(state, c, provoke) {
    if (!alarmOpen(state) || (c.gongFeet ?? 0) > 0) return;
    if (provoke(state, c, "manipulate")) {
        log(state, `  ${c.name}'s attempt to raise the alarm is disrupted`);
        return;
    }
    if (!canAct(c)) return;
    raiseAlarm(state, c);
}

export function strideToGong(state, c) {
    c.gongFeet = Math.max(0, (c.gongFeet ?? 0) - Math.max(5, c.speed ?? 25));
    log(state, `  ${c.name} Strides toward the alarm${c.gongFeet > 0 ? "" : " and reaches it"}`);
}
