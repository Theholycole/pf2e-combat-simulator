// Morale checks in play (user, 2026-10-09): the simulator's own morale rules
// (src/engine/morale.js) run against the real encounter, so the GM gets the
// same checks at the table as the simulator rolls. Pure: scripts/morale-live.js
// builds the snapshot from the combat, keeps the memory on it and posts the cards.
//
// Memory (kept on the combat between events):
//   roster:    the foes as the encounter began { id: { name, hpMax } } (one that leaves the
//              tracker still counts as fallen)
//   flags:     the side's crossings (a quarter fallen, outnumbered 3:1, …), as the engine keeps them
//   creatures: each foe's check state (checked this round, Boss Resolve used, gave up, …)
//   seen:      what each foe looked like at the last look (up, frightened, fleeing, HP), to tell
//              what changed

import { createFightState } from "../engine/fight.js";
import { FLED, baseWill, isActive } from "../engine/combatant.js";
import { bossAutoPasses, checkCantAffect, claimCheck, collectMoraleChecks, finalMoraleDegree, moraleDC, moraleModifierParts, moraleOutcome, readsTheFight, routReady, speaks } from "../engine/morale.js";
import { SUCCESS } from "../engine/checks.js";
import { bestOffense } from "../engine/planner.js";

// (M38: yielding, leaving and fighting to the death are kept too.)
const CREATURE_KEYS = ["checkedRound", "extraUsed", "autoPassed", "ignoredFirstFailure", "broken", "failed", "yielding", "leaving", "toTheDeath"];

export function emptyMemory() {
    return { roster: null, flags: null, creatures: {}, seen: {}, routPosted: false };
}

// The engine's fight state for the encounter as it is, with the memory put back.
function stateFor(snapshot, memory, { round, rules }) {
    const state = createFightState(snapshot, { moraleRules: rules });
    state.round = round;
    const roster = memory.roster ?? {};
    // A foe that left the tracker: gone from the fight, still one of its side's losses.
    for (const [id, entry] of Object.entries(roster)) {
        if (state.byId.has(id)) continue;
        const stub = { id, name: entry.name, side: "foes", kind: "npc", level: entry.level ?? 0, status: FLED, hp: { value: 0, max: entry.hpMax ?? 0, temp: 0 }, cond: {}, traits: [], morale: null, moraleState: {}, band: "gone", meleeId: null, strikes: [], spells: [] };
        state.list.push(stub);
        state.byId.set(id, stub);
    }
    if (memory.roster) state.foeStartCount = Object.keys(roster).length;
    if (memory.flags) state.moraleFlags = { ...state.moraleFlags, ...memory.flags };
    for (const c of state.list) {
        const saved = memory.creatures?.[c.id];
        if (!saved || !c.moraleState) continue;
        for (const key of CREATURE_KEYS) if (saved[key] !== undefined) c.moraleState[key] = saved[key];
        if (saved.usedTriggers) c.moraleState.usedTriggers = new Set(saved.usedTriggers);
        if (saved.wasSurrounded !== undefined) c.wasSurrounded = saved.wasSurrounded;
        if (saved.cantAffect) c.cantAffect = true;
    }
    return state;
}

function remember(state, memory) {
    const creatures = {};
    for (const c of state.list) {
        if (c.side !== "foes" || !c.moraleState) continue;
        const entry = {};
        for (const key of CREATURE_KEYS) if (c.moraleState[key] !== undefined) entry[key] = c.moraleState[key];
        if (c.moraleState.usedTriggers?.size) entry.usedTriggers = [...c.moraleState.usedTriggers];
        if (c.wasSurrounded !== undefined) entry.wasSurrounded = c.wasSurrounded;
        if (c.cantAffect) entry.cantAffect = true;
        creatures[c.id] = entry;
    }
    return { ...memory, flags: { ...state.moraleFlags }, creatures };
}

const look = (c) => ({ up: isActive(c), hp: Math.max(0, c.hp?.value ?? 0), frightened: c.cond?.frightened ?? 0, fleeing: !!c.cond?.fleeing });

// The checks the encounter calls for now. turnStart: the combatant whose turn just began (fleeing
// again, and "can't meaningfully affect an opponent", are looked at then).
// → { checks: [{ reason, rows }], memory }. A row: { id, name, dc, will, parts: [{ id, value }], bossHolds, read }; read (M38):
// { dc, perception, signs } when it also reads the fight — its bonus is the ticked morale modifiers among the signs, turned around.
export function liveMoraleChecks({ snapshot, memory = emptyMemory(), round = 1, turnStart = null, rules }) {
    const state = stateFor(snapshot, memory, { round, rules });
    const foes = state.list.filter((c) => c.side === "foes" && c.kind !== "object" && c.kind !== "hazard");
    const roster = memory.roster ?? Object.fromEntries(foes.map((c) => [c.id, { name: c.name, hpMax: c.hp.max, level: c.level }]));
    // What changed since the last look.
    for (const c of foes) {
        const before = memory.seen?.[c.id];
        const now = look(c);
        if (!before) continue;
        // One that gave up and is then marked defeated or taken off the tracker sets off nothing new.
        if (before.up && !now.up && !c.moraleState?.broken) {
            if (c.status === FLED) state.pendingEvents.push({ type: "fled", who: c });
            // One hit taking it from half its HP or more to nothing reads as an overwhelming attack.
            else state.pendingEvents.push({ type: "dropped", victim: c, overwhelming: before.hp >= c.hp.max * (state.moraleRules.measures.overwhelmingFraction ?? 0.5) });
        }
        if (now.frightened > before.frightened) state.pendingEvents.push({ type: "frightened", victim: c, byEnemy: true, value: now.frightened });
        if (now.fleeing && !before.fleeing) state.pendingEvents.push({ type: "fleeing", victim: c });
    }
    // Its turn begins: still fleeing (M32), or no way to hurt anyone (M11).
    const starting = turnStart ? state.byId.get(turnStart) : null;
    if (starting?.side === "foes" && isActive(starting)) {
        const before = memory.seen?.[starting.id];
        if (starting.cond.fleeing && before?.fleeing) state.pendingEvents.push({ type: "fleeing", victim: starting });
        if (!starting.cantAffect) {
            const offense = bestOffense(state, starting);
            checkCantAffect(state, starting, offense.hit, offense.damage);
        }
    }
    const triggered = collectMoraleChecks(state);
    const byReason = new Map();
    for (const [id, reason] of triggered) {
        const c = state.byId.get(id);
        if (!claimCheck(state, c)) continue;
        const read = readsTheFight(state, c, reason) ? { dc: moraleDC(state, Number(c.perception) || 0), perception: Number(c.perception) || 0, signs: [...(state.moraleRules.readTheFight?.signs ?? [])] } : null;
        const row = bossAutoPasses(c)
            ? { id, name: c.name, bossHolds: true }
            : { id, name: c.name, dc: moraleDC(state, baseWill(c)), will: baseWill(c), parts: moraleModifierParts(state, c), template: c.morale?.template ?? "typical", ...(read ? { read } : {}) };
        if (!byReason.has(reason)) byReason.set(reason, []);
        byReason.get(reason).push(row);
    }
    const seen = Object.fromEntries(foes.map((c) => [c.id, look(c)]));
    const next = remember(state, { ...memory, roster, seen });
    return { checks: [...byReason].map(([reason, rows]) => ({ reason, rows })), memory: next };
}

// The GM applies rolled checks: each row's final degree (a fanatic's first failure, Boss Resolve)
// and what it does. rows: [{ id, reason, degree (0–3), readDegree }] → { results: [{ id, degree, outcome, read }], memory }.
// A held check with a successful read (M38): outcome "yields" (it talks; the GM accepts or refuses) or "leaves".
export function liveMoraleApply({ snapshot, memory = emptyMemory(), round = 1, rules, rows }) {
    const state = stateFor(snapshot, memory, { round, rules });
    const results = [];
    for (const row of rows) {
        const c = state.byId.get(row.id);
        if (!c?.moraleState) continue;
        const fanaticBefore = c.moraleState.ignoredFirstFailure;
        const degree = finalMoraleDegree(state, c, row.degree);
        const outcome = moraleOutcome(state, c, degree, row.reason);
        // Why a failure held: a fanatic's first one, or Boss Resolve.
        const held = degree === row.degree ? null : c.moraleState.ignoredFirstFailure && !fanaticBefore ? "fanatic" : "boss";
        if (outcome.kind !== "holds" && outcome.kind !== "steady") c.moraleState.failed = (c.moraleState.failed ?? 0) + 1;
        // A berserk break keeps it fighting (and checking); every other way of giving up is final.
        if (outcome.kind === "giveUp" && outcome.how !== "berserk") c.moraleState.broken = true;
        // M38: it held, but read the fight: it yields or leaves, and has given up.
        let final = outcome;
        const read = Number.isInteger(row.readDegree) ? { degree: row.readDegree } : null;
        if ((outcome.kind === "holds" || outcome.kind === "steady") && read && row.readDegree >= SUCCESS) {
            final = { kind: speaks(c) ? "yields" : "leaves", morale: outcome.kind };
            c.moraleState.broken = true;
            c.moraleState[final.kind === "yields" ? "yielding" : "leaving"] = true;
        }
        // (B303: Bravery's lower frightened, for the card's line; the ability module lowers what PF2e applies.)
        results.push({ id: row.id, name: c.name, degree, outcome: final, held, ...(read ? { read } : {}), ...(c.lessFrightened ? { lessFrightened: c.lessFrightened } : {}) });
    }
    return { results, memory: remember(state, memory) };
}

// After Apply or the rout card: what the GM's changes left each creature looking like, so the next look
// doesn't take its own frightened +1 or fleeing for new fear (M29), and the given-up as broken.
// changes: { id: { frightened?, fleeing?, up?, broken? } }.
export function noteChanges(memory, changes) {
    const seen = { ...(memory.seen ?? {}) };
    const creatures = { ...(memory.creatures ?? {}) };
    for (const [id, change] of Object.entries(changes)) {
        const { broken, ...looks } = change;
        if (seen[id]) seen[id] = { ...seen[id], ...looks };
        if (broken) creatures[id] = { ...(creatures[id] ?? {}), broken: true };
    }
    return { ...memory, seen, creatures };
}

// The rout ("Improved Morale.md", M30): half or more of the surviving foes broken (the rules' rout fraction), counting
// those who gave up (fled or surrendered) and those fleeing from anything. → { routs, rest: [ids still fighting] }.
export function liveRout({ snapshot, memory = emptyMemory(), rules }) {
    const state = stateFor(snapshot, memory, { round: 1, rules });
    const foes = state.list.filter((c) => c.side === "foes" && c.kind !== "object" && c.kind !== "hazard");
    const gaveUp = (c) => !!c.moraleState?.broken;
    const fighting = foes.filter((c) => isActive(c));
    const broken = fighting.filter((c) => c.cond?.fleeing || gaveUp(c)).length + foes.filter((c) => !isActive(c) && gaveUp(c)).length;
    const survivors = fighting.length + foes.filter((c) => !isActive(c) && gaveUp(c)).length;
    // (M38: those fighting to the death don't flee with the rest.)
    const rest = fighting.filter((c) => !c.cond?.fleeing && !gaveUp(c) && !c.moraleState?.toTheDeath).map((c) => c.id);
    return { routs: fighting.length > 0 && routReady(state, broken, survivors), rest };
}

// M38: the GM accepted a yield: it surrenders (still given up).
export function liveAccept(memory, id) {
    const creatures = { ...(memory.creatures ?? {}) };
    creatures[id] = { ...(creatures[id] ?? {}), yielding: false, broken: true };
    return { ...memory, creatures };
}

// M38: no quarter — the creature the party refused or harmed, and the allies who saw, fight to the death: no more checks.
export function liveNoQuarter(memory, ids) {
    const creatures = { ...(memory.creatures ?? {}) };
    for (const id of ids) creatures[id] = { ...(creatures[id] ?? {}), yielding: false, leaving: false, broken: false, toTheDeath: true };
    return { ...memory, creatures };
}
