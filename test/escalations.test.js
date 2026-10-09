import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, escalate, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { checkEscalations, helpPending } from "../src/engine/escalations.js";
import { mergeMoraleRules } from "../src/engine/morale-rules.js";

// Escalations (E1–E2): "when → then" rules, arrivals, the alarm and morale.
const tough = (id, name, extra = {}) => ({ ...moderateCreature(5, id, name), hp: { value: 300, max: 300 }, ...extra });
const best = (state, c) => scoreOptions(state, c).options.sort((a, b) => b.score - a.score)[0];
const arrive = (when, ids, extra = {}) => ({ when, then: { kind: "arrive", creatureIds: ids, delay: 0, band: "near", ...extra } });

test("E1 round N: the rule's creatures wait, then come in as that round begins (a delay adds rounds)", () => {
    const [fighter, champion] = martialParty(5);
    const escalations = { rules: [arrive({ kind: "round", round: 2 }, ["orc"]), arrive({ kind: "round", round: 2 }, ["ogre"], { delay: 1, band: "far" })] };
    const result = simulate({ combatants: [fighter, champion, tough("foe", "Foe"), tough("orc", "Orc"), tough("ogre", "Ogre")], setup: { escalations } }, { roundCap: 4, morale: false }, 3, { log: true });
    const text = result.log.join("\n");
    assert.match(text, /— Round 2 —\n  Escalation: round 2 → Orc arrive\n  Escalation: round 2 → Ogre arrive 1 round later\n  Orc arrives \(near\)/);
    assert.match(text, /— Round 3 —\n  Ogre arrives \(far\)/);
    assert.ok(!/— Round 1 —[\s\S]*Orc \(/.test(text.split("— Round 2 —")[0]), "the orc doesn't act in round 1");
});

test("E1 a creature falls, the foes at half HP, a foe flees, the party enters a Region", () => {
    const [fighter] = martialParty(5);
    const rules = [
        arrive({ kind: "falls", creatureId: "boss" }, ["guard1"]),
        arrive({ kind: "foesHalf" }, ["guard2"]),
        arrive({ kind: "firstFlee" }, ["guard3"]),
        arrive({ kind: "enters", region: "hall" }, ["guard4"])
    ];
    const state = createFightState({ combatants: [{ ...fighter, regionFeet: { hall: { to: 10, edge: 0 } } }, tough("boss", "Boss"), tough("minion", "Minion"), ...[1, 2, 3, 4].map((n) => tough(`guard${n}`, `Guard ${n}`))], setup: { escalations: { rules } } }, {}, 1);
    const fired = () => state.escalation.rules.map((rule) => rule.fired !== null);
    checkEscalations(state);
    assert.deepEqual(fired(), [false, false, false, false]);
    assert.equal(state.byId.get("guard1").status, "pending");
    state.byId.get("boss").status = "dead";
    state.byId.get("boss").hp.value = 0;
    checkEscalations(state);
    assert.deepEqual(fired(), [true, true, false, false], "the boss's 300 HP were half the foes'");
    assert.equal(state.byId.get("guard1").arrivesRound, 2, "next round");
    state.byId.get("minion").status = "fled";
    state.byId.get("fighter").regionFeet.hall.to = 0;
    checkEscalations(state);
    assert.deepEqual(fired(), [true, true, true, true]);
});

test("E1 the gong: a raiser at the gong sounds it when the help is worth it; the alarm rule brings the help, and foes are steadier meanwhile", () => {
    const [fighter, champion] = martialParty(5);
    const escalations = { rules: [arrive({ kind: "alarm" }, ["guard1", "guard2"])] };
    const combatants = [fighter, champion, tough("sentry", "Sentry", { alarm: "gong", gongFeet: 0 }), tough("guard1", "Guard 1"), tough("guard2", "Guard 2")];
    const state = createFightState({ combatants, setup: { escalations } }, {}, 1);
    const sentry = state.byId.get("sentry");
    sentry.actionsLeft = 3;
    assert.equal(best(state, sentry).action.type, "soundGong");
    performAction(state, sentry, { type: "soundGong" });
    assert.ok(state.escalation.alarm.raised);
    checkEscalations(state);
    assert.ok(helpPending(state));
    assert.equal(state.byId.get("guard1").arrivesRound, 2);
    // Further off, it Strides to the gong first.
    const far = createFightState({ combatants: [fighter, champion, tough("sentry", "Sentry", { alarm: "gong", gongFeet: 40 }), tough("guard1", "Guard 1"), tough("guard2", "Guard 2")], setup: { escalations } }, {}, 1);
    const s2 = far.byId.get("sentry");
    s2.actionsLeft = 3;
    assert.deepEqual(best(far, s2).action, { type: "stride", move: { kind: "toGong" } });
    // With no help behind it, the gong is worth nothing.
    const none = createFightState({ combatants: [fighter, champion, tough("sentry", "Sentry", { alarm: "gong", gongFeet: 0 })], setup: { escalations: { rules: [] } } }, {}, 1);
    const s3 = none.byId.get("sentry");
    s3.actionsLeft = 3;
    assert.notEqual(best(none, s3).action.type, "soundGong");
});

test("E1 a runner leaves the battlefield to raise the alarm; it isn't counted as a loss", () => {
    const [fighter] = martialParty(5);
    const escalations = { rules: [arrive({ kind: "alarm" }, ["guard1", "guard2", "guard3"])] };
    const runner = { ...moderateCreature(1, "runner", "Runner"), alarm: "runner", band: "far" };
    const state = createFightState({ combatants: [fighter, runner, tough("guard1", "Guard 1"), tough("guard2", "Guard 2"), tough("guard3", "Guard 3"), tough("boss", "Boss")], setup: { escalations } }, {}, 1);
    const c = state.byId.get("runner");
    c.actionsLeft = 3;
    assert.deepEqual(best(state, c).action, { type: "stride", move: { kind: "leave" } });
    performAction(state, c, { type: "stride", move: { kind: "leave" } });
    assert.equal(c.status, "fled");
    assert.ok(c.ranForHelp && state.escalation.alarm.raised);
});

test("E1 the PCs go after an alarm-raiser before an equal foe", () => {
    const [fighter] = martialParty(5);
    const escalations = { rules: [arrive({ kind: "alarm" }, ["guard1", "guard2"])] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, tough("brute", "Brute", { engagement: 1 }), tough("sentry", "Sentry", { engagement: 1, alarm: "gong", gongFeet: 30 }), tough("guard1", "Guard 1"), tough("guard2", "Guard 2")], setup: { escalations } }, {}, 1);
    const c = state.byId.get("fighter");
    c.actionsLeft = 3;
    assert.equal(best(state, c).action.targetId, "sentry");
});

test("E2 help arriving steadies wavering foes", async () => {
    const { helpArrives } = await import("../src/engine/morale.js");
    const [fighter] = martialParty(5);
    // Improved Morale's wavering (before M24, when this trigger was on).
    const state = createFightState({ combatants: [fighter, tough("foe", "Foe")] }, { moraleRules: mergeMoraleRules({ triggers: { helpArrives: { enabled: true } } }) }, 1);
    const foe = state.byId.get("foe");
    foe.moraleState.wavering = true;
    foe.mustWithdraw = true;
    state.log = [];
    helpArrives(state);
    assert.equal(foe.moraleState.wavering, false);
    assert.ok(state.log.some((line) => /foes steady/.test(line)));
});

test("E1 live play: a rule that fired already keeps its arrival round; creatures already here don't wait", () => {
    const [fighter] = martialParty(5);
    const escalations = { rules: [{ ...arrive({ kind: "foesHalf" }, ["guard1", "guard2"], { delay: 1 }), fired: 2 }] };
    const state = createFightState({ combatants: [fighter, tough("foe", "Foe"), tough("guard1", "Guard 1"), { ...tough("guard2", "Guard 2"), arrived: true }], setup: { escalations }, round: 3 }, {}, 1);
    assert.equal(state.byId.get("guard1").arrivesRound, 4, "fired in round 2, a round's delay: round 4");
    assert.equal(state.byId.get("guard2").status, "active");
});

test("E3 danger: from its round, damage to everyone at each round's end, growing; a basic save halves it", () => {
    const [fighter, champion] = martialParty(5);
    const fire = { when: { kind: "round", round: 1 }, then: { kind: "danger", damage: "10", type: "fire", grow: "5", targets: "all" } };
    const result = simulate({ combatants: [fighter, champion, tough("foe", "Foe")], setup: { escalations: { rules: [fire] } } }, { roundCap: 2, morale: false }, 4, { log: true });
    const text = result.log.join("\n");
    assert.match(text, /Escalation: round 1 → danger starts \(10 fire\)/);
    assert.match(text, /  10 fire: 10 fire\n  Fighter takes 10/);
    assert.match(text, /  10 fire: 15 fire\n/, "5 more in round 2");
});

test("E3 a basic save: a critical success takes none, a failure all, a critical failure double; only the side it names", async () => {
    const { startDanger, dangerAtRoundEnd } = await import("../src/engine/escalations.js");
    const [fighter] = martialParty(5);
    const saved = { when: { kind: "round", round: 1 }, then: { kind: "danger", damage: "10", type: "fire", save: { type: "reflex", dc: 20 }, targets: "party" } };
    const taken = (natural) => {
        const state = createFightState({ combatants: [fighter, tough("foe", "Foe")], setup: { escalations: { rules: [saved] } } }, {}, 1);
        checkEscalations(state, { danger: startDanger });
        state.rng.d20 = () => natural;
        const before = [state.byId.get("fighter").hp.value, state.byId.get("foe").hp.value];
        dangerAtRoundEnd(state);
        assert.equal(state.byId.get("foe").hp.value, before[1], "the foes aren't in it");
        return before[0] - state.byId.get("fighter").hp.value;
    };
    assert.equal(taken(20), 0);
    assert.equal(taken(2), 10, "reflex +11 + 2 = 13: a failure");
    assert.equal(taken(1), 20);
});

test("E3 a danger Region: only those inside are hurt; a creature inside Strides out when it's worth it", async () => {
    const { startDanger, dangerAtRoundEnd } = await import("../src/engine/escalations.js");
    const [fighter, champion] = martialParty(5);
    const pit = { when: { kind: "round", round: 1 }, then: { kind: "danger", damage: "40", type: "fire", targets: "region", region: "pit" } };
    const combatants = [{ ...fighter, regionFeet: { pit: { to: 0, edge: 10 } } }, { ...champion, regionFeet: { pit: { to: 15, edge: 0 } } }, tough("foe", "Foe", { band: "far", regionFeet: { pit: { to: 30, edge: 0 } } })];
    const state = createFightState({ combatants, setup: { escalations: { rules: [pit] } } }, {}, 1);
    checkEscalations(state, { danger: startDanger });
    const fighterHp = state.byId.get("fighter").hp.value;
    const championHp = state.byId.get("champion").hp.value;
    const c = state.byId.get("fighter");
    c.actionsLeft = 3;
    assert.deepEqual(best(state, c).action, { type: "stride", move: { kind: "outOf", region: "pit" } });
    dangerAtRoundEnd(state);
    assert.equal(fighterHp - state.byId.get("fighter").hp.value, 40);
    assert.equal(state.byId.get("champion").hp.value, championHp, "outside");
    performAction(state, c, { type: "stride", move: { kind: "outOf", region: "pit" } });
    assert.deepEqual(c.regionFeet.pit, { to: 5, edge: 0 });
});

// A complex trap: two blade Strikes a turn, no multiple attack penalty; Thievery DC 21 twice to disable.
const bladeTrap = (extra = {}) => ({
    id: "trap", name: "Blade Trap", side: "foes", kind: "hazard", level: 5, hp: { value: 50, max: 50 }, ac: 22, hardness: 8, immunities: ["critical-hits", "precision"], weaknesses: [], resistances: [],
    saves: { fortitude: 12, reflex: 8, will: 0 }, perception: 14, speed: 0, traits: [],
    strikes: [{ name: "Blade", bonus: 15, melee: false, increment: null, noMap: true, damage: [{ dice: 2, die: 8, bonus: 5, type: "slashing" }] }],
    hazard: { complex: true, routineActions: 2, disable: [{ skill: "thievery", dc: 21, needed: 2 }], trigger: { strikes: true, abilities: [] } },
    ...extra
});

test("E4 a complex hazard acts from round 1: its routine's Strikes, no multiple attack penalty, at anyone on the field", () => {
    const [fighter] = martialParty(5);
    const result = simulate({ combatants: [{ ...fighter, band: "far", skills: {} }, bladeTrap(), tough("foe", "Foe", { band: "far" })] }, { roundCap: 1, morale: false }, 2, { log: true });
    const turn = result.log.join("\n").split("Blade Trap (50/50 HP")[1]?.split(/\n(?! )/)[0] ?? "";
    const strikes = turn.match(/Blade Trap Blade → Fighter: (\d+)/g) ?? [];
    assert.equal(strikes.length, 2, turn);
});

test("E4 a simple hazard waits for its rule and fires once at whoever set it off; a complex one then rolls initiative", () => {
    const [fighter, champion] = martialParty(5);
    const simple = bladeTrap({ hazard: { complex: false, routineActions: 0, disable: [], trigger: { strikes: true, abilities: [] } } });
    const rules = [{ when: { kind: "enters", region: "hall" }, then: { kind: "hazard", hazardId: "trap" } }];
    const combatants = [{ ...fighter, regionFeet: { hall: { to: 10, edge: 0 } } }, { ...champion, regionFeet: { hall: { to: 30, edge: 0 } } }, simple, tough("foe", "Foe")];
    const state = createFightState({ combatants, setup: { escalations: { rules } } }, {}, 1);
    const trap = state.byId.get("trap");
    assert.equal(trap.status, "pending");
    state.log = [];
    state.byId.get("fighter").regionFeet.hall.to = 0;
    state.rng.d20 = () => 15;
    escalate(state);
    assert.ok(state.log.some((line) => /Blade Trap is triggered/.test(line)), state.log.join("\n"));
    assert.ok(state.log.some((line) => /Blade Trap Blade → Fighter/.test(line)), "at the one who entered");
    assert.ok(trap.spent && trap.status === "dead");
    // A complex hazard with a rule: pending, then in the initiative order once set off.
    const complex = createFightState({ combatants: [fighter, bladeTrap(), tough("foe", "Foe")], setup: { escalations: { rules: [{ when: { kind: "round", round: 2 }, then: { kind: "hazard", hazardId: "trap" } }] } } }, {}, 1);
    assert.equal(complex.byId.get("trap").status, "pending");
});

test("E4 the PCs Disable a hazard (twice for this one) or smash it through its Hardness; it can't be critically hit", async () => {
    const { expectedHitDamage } = await import("../src/engine/actions.js");
    const [fighter, , , rogue] = martialParty(5);
    const state = createFightState({ combatants: [fighter, { ...rogue, skills: { thievery: 14 } }, bladeTrap(), tough("foe", "Foe", { band: "far" })] }, {}, 1);
    const c = state.byId.get(rogue.id);
    const trap = state.byId.get("trap");
    c.actionsLeft = 3;
    const disable = scoreOptions(state, c).options.find((option) => option.action.type === "disableHazard");
    assert.ok(disable, "offered");
    state.rng.d20 = () => 12;
    performAction(state, c, { type: "disableHazard", targetId: "trap" });
    assert.equal(trap.status, "active", "1 of 2");
    performAction(state, c, { type: "disableHazard", targetId: "trap" });
    assert.ok(trap.disabled && trap.status === "dead");
    // Hardness 8 comes off each hit, and a critical hit is a hit.
    const smasher = state.byId.get("fighter");
    const greatsword = smasher.strikes[0];
    const plain = expectedHitDamage(smasher, greatsword, { ...trap, hardness: 0, immunities: [] }, false);
    assert.ok(Math.abs(expectedHitDamage(smasher, greatsword, trap, false) - (plain - 8)) < 1e-9);
    assert.equal(expectedHitDamage(smasher, greatsword, trap, true), expectedHitDamage(smasher, greatsword, trap, false));
});

test("E4 a fight with only a hazard ends when it's disabled or destroyed", () => {
    const [fighter, , , rogue] = martialParty(5);
    const result = simulate({ combatants: [fighter, { ...rogue, skills: { thievery: 16 } }, bladeTrap()] }, { roundCap: 10 }, 3, { log: true });
    assert.equal(result.outcome, "decisive", result.log.slice(-6).join("\n"));
});

// (The hazard text readers are the core's: its test/hazard-text.test.js.)
test("a Region's edge: from inside, the feet to the nearest square outside", async () => {
    const { edgeFeet } = await import("../src/adapter/map.js");
    // A 5×5 Region from (0,0): from its middle square, 3 squares to the outside.
    const region = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) region.push({ i, j });
    assert.equal(edgeFeet([{ i: 2, j: 2 }], region), 15);
    assert.equal(edgeFeet([{ i: 0, j: 2 }], region), 5);
    assert.equal(edgeFeet([{ i: 7, j: 7 }], region), 0);
});

test("E1 a round-1 rule's creatures come in round 1, though the rule fires in the fight's first check", () => {
    const [fighter] = martialParty(5);
    const result = simulate({ combatants: [fighter, tough("foe", "Foe"), tough("orc", "Orc")], setup: { escalations: { rules: [arrive({ kind: "round", round: 1 }, ["orc"])] } } }, { roundCap: 1, morale: false }, 1, { log: true });
    assert.match(result.log.join("\n"), /— Round 1 —\n  Orc arrives/);
});

test("E4 a simple hazard that fired is reported spent, not killed", () => {
    const [fighter] = martialParty(5);
    const simple = bladeTrap({ hazard: { complex: false, routineActions: 0, disable: [], trigger: { strikes: true, abilities: [] } } });
    const result = simulate({ combatants: [fighter, simple, tough("foe", "Foe")], setup: { escalations: { rules: [{ when: { kind: "round", round: 1 }, then: { kind: "hazard", hazardId: "trap" } }] } } }, { roundCap: 2 }, 1);
    assert.equal(result.foes.find((c) => c.id === "trap").status, "spent");
});
