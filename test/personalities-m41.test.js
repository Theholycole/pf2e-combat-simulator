import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, shouldRetreat } from "../src/engine/fight.js";
import { computeThreats } from "../src/engine/planner.js";
import { partyAdvantage } from "../src/engine/morale.js";
import { benchmarkEncounter, moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { processMorale, readTheFightParts } from "../src/engine/morale.js";
import { mergeMoraleRules } from "../src/engine/morale-rules.js";
import { emptyMemory, liveMoraleApply, liveMoraleChecks } from "../src/live/morale.js";
import { createMoraleCard, moraleCardHTML, toRoll } from "../src/live/morale-card.js";

// The HP-share gate (simple to open by HP); foes at `share` of their HP against an unhurt party; Read the fight off.
function setUp(foes, { share = 0.3, rules = {} } = {}) {
    const state = createFightState({ combatants: [...martialParty(3), ...foes] }, { moraleRules: mergeMoraleRules({ gateMode: "hpShare", readTheFight: { enabled: false }, triggers: { hopeless: { enabled: false } }, ...rules }) });
    for (const c of state.list.filter((each) => each.side === "foes")) c.hp.value = Math.round(c.hp.max * share);
    state.rng.d20 = () => 15;
    return state;
}
const named = (level, id, name, extra = {}) => ({ ...moderateCreature(level, id, name), ...extra });
const reasons = (state) => state.log.filter((line) => / morale \(|gives up:/.test(line));

test("M41 bestial: it checks once its own HP falls below half", () => {
    const state = setUp([named(3, "b", "Bear", { traits: ["animal"] }), named(3, "c", "Clerk")]);
    state.pendingEvents.push({ type: "halfHp", victim: state.byId.get("b") }, { type: "halfHp", victim: state.byId.get("c") });
    processMorale(state);
    assert.deepEqual(reasons(state).map((line) => line.trim().split(":")[0]), ["Bear morale (hurtBadly)"]);
});

test("M41 mercenary: its paymaster falls and it gives up without a roll; it reads the fight with +4", () => {
    const state = setUp([named(5, "boss", "Bandit Chief"), named(3, "b1", "Bandit"), named(3, "b2", "Bandit")], { share: 1 });
    const chief = state.byId.get("boss");
    chief.status = "dead";
    state.pendingEvents.push({ type: "dropped", victim: chief });
    processMorale(state);
    // The party isn't ahead (both sides unhurt), but the pay is gone.
    assert.equal(state.byId.get("b1").status, "surrendered");
    assert.equal(state.byId.get("b2").status, "surrendered");
    assert.ok(state.log.some((line) => line.includes("Bandit gives up: its paymaster (the leader) dropped or fled")), state.log.join("\n"));
    const read = setUp([named(3, "b3", "Bandit"), named(3, "o", "Other")], { rules: { readTheFight: { enabled: true } } });
    assert.ok(readTheFightParts(read, read.byId.get("b3")).some((part) => part.id === "template.mercenary.read" && part.value === 4));
});

test("M41 disciplined: it holds formation while its leader stands, then checks at −4 once the leader is gone", () => {
    const state = setUp([named(5, "cap", "Guard Captain"), named(3, "g1", "Guard"), named(3, "g2", "Guard"), named(3, "g3", "Guard")]);
    // A guard falls: a quarter of the side; the captain (not under its own command) checks, the guards hold formation.
    state.byId.get("g1").status = "dead";
    state.pendingEvents.push({ type: "dropped", victim: state.byId.get("g1") });
    processMorale(state);
    assert.deepEqual(reasons(state).map((line) => line.trim().split(" morale")[0]), ["Guard Captain"]);
    // The captain falls: the guards check, leader down −2 and leaderless −2.
    state.round = 2;
    state.log.length = 0;
    state.byId.get("cap").status = "dead";
    state.pendingEvents.push({ type: "dropped", victim: state.byId.get("cap") });
    processMorale(state);
    assert.equal(reasons(state).filter((line) => line.includes("Guard morale (leaderDown)")).length, 2);
});

test("M41 cowardly: first blood and its side's first fall, before the party is ahead too", () => {
    const state = setUp([named(3, "k", "Kobold", { morale: { template: "cowardly" } }), named(3, "o", "Other"), named(3, "p", "Third")], { share: 1 });
    state.pendingEvents.push({ type: "hurt", victim: state.byId.get("k") });
    processMorale(state);
    assert.ok(state.log.some((line) => line.includes("Kobold morale (firstBlood)")), state.log.join("\n"));
    const second = setUp([named(3, "k", "Kobold", { morale: { template: "cowardly" } }), named(3, "o", "Other"), named(3, "p", "Third")], { share: 1 });
    second.byId.get("o").status = "dead";
    second.pendingEvents.push({ type: "dropped", victim: second.byId.get("o") });
    processMorale(second);
    assert.ok(second.log.some((line) => line.includes("Kobold morale (firstFall)")), second.log.join("\n"));
    // Not a typical creature's trigger (it checks for a quarter fallen, the gate open with one of three down).
    assert.ok(!second.log.some((line) => line.includes("Third morale (firstFall)")));
});

test("M41 in play: the paymaster's fall brings a card whose mercenaries give up without a roll", () => {
    const rules = mergeMoraleRules({});
    const encounter = (dead = false) => {
        const base = benchmarkEncounter(5, "extreme");
        return { ...base, combatants: base.combatants.map((c) => (c.side !== "foes" ? c : c.id === "foe1" ? { ...c, name: "Bandit Chief", level: 7, hp: { ...c.hp, value: dead ? 0 : c.hp.value } } : { ...c, name: "Bandit" })) };
    };
    const first = liveMoraleChecks({ snapshot: encounter(), memory: emptyMemory(), round: 1, rules });
    const fallen = liveMoraleChecks({ snapshot: encounter(true), memory: first.memory, round: 1, rules });
    const check = fallen.checks.find((each) => each.reason === "paymasterDown");
    assert.ok(check, JSON.stringify(fallen.checks.map((each) => each.reason)));
    assert.ok(check.rows.every((row) => row.automatic));
    const card = createMoraleCard({ rules, combatId: "c", round: 1, check });
    assert.deepEqual(toRoll(card), []);
    assert.match(moraleCardHTML(card), /gives up \(no roll\)/);
    const applied = liveMoraleApply({ snapshot: encounter(true), memory: fallen.memory, round: 1, rules, rows: check.rows.map((row) => ({ id: row.id, reason: check.reason, degree: 0 })) });
    assert.ok(applied.results.every((result) => result.outcome.kind === "giveUp" && result.outcome.how === "collapse"));
});

test("the party retreats once two PCs are down and the foes are more than twice as strong, by damage potential", () => {
    const state = createFightState({ combatants: [...martialParty(5), moderateCreature(5, "a", "Brute"), moderateCreature(5, "b", "Brute")] });
    const pcs = state.list.filter((c) => c.kind === "pc");
    pcs[0].status = "down";
    pcs[1].status = "down";
    computeThreats(state);
    const foes = state.list.filter((c) => c.side === "foes");
    // Scale the foes' HP to put the party at a given strength against them.
    const at = (ratio) => {
        for (const c of foes) c.hp.value = c.hp.max;
        const full = partyAdvantage(state, { potential: true });
        for (const c of foes) c.hp.value = Math.round(c.hp.max * full / ratio);
        return shouldRetreat(state);
    };
    assert.equal(at(0.7), false, "behind, but not twice outmatched: it fights on");
    assert.equal(at(0.4), true);
    pcs[1].status = "active";
    assert.equal(at(0.4), false, "one PC down: it fights on");
});
