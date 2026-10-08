import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { endOfRoundObjective, settleObjectiveAfterWin, updateObjective } from "../src/engine/objectives.js";
import { strideToward, stridesFor } from "../src/engine/map-objectives.js";
import { strikeUsable } from "../src/engine/combatant.js";
import { buildReport } from "../src/engine/batch.js";

// Map objectives (O1–O3): hold an area, escort a creature to the exit, retrieve an item and escape.
const tough = (id, name, extra = {}) => ({ ...moderateCreature(5, id, name), hp: { value: 400, max: 400 }, ...extra });
const best = (state, c) => scoreOptions(state, c).options.sort((a, b) => b.score - a.score)[0];

test("a Stride toward the area or the exit, and the distance to the other from the triangle", () => {
    // An equilateral triangle of 50 feet: halfway along one side, the other corner is 43.3 feet away.
    const moved = strideToward({ area: 50, exit: 50 }, "area", 25, 50);
    assert.equal(moved.area, 25);
    assert.ok(Math.abs(moved.exit - 43.3) < 0.1);
    assert.deepEqual(strideToward({ area: 20, exit: 60 }, "area", 25, 50), { area: 0, exit: 50 }, "arriving: as far from the exit as the area is");
    assert.equal(stridesFor({ speed: 25 }, 30), 2);
    assert.equal(stridesFor({ speed: 30 }, 30), 1);
    assert.equal(stridesFor({ speed: 25 }, 0), 0);
});

test("O1 hold: a round counts with the party inside and no foe; contested rounds don't; enough of them succeed", () => {
    const [fighter] = martialParty(5);
    const setup = { objective: { kind: "hold", needed: 2, strides: { party: { area: 0 }, foes: { area: 3 } } } };
    const state = createFightState({ combatants: [fighter, tough("foe", "Foe")], setup }, {}, 1);
    const foe = state.byId.get("foe");
    assert.equal(state.byId.get("fighter").areaFeet, 0);
    assert.equal(foe.areaFeet, 75);
    endOfRoundObjective(state);
    assert.equal(state.objective.held, 1);
    foe.areaFeet = 0;
    endOfRoundObjective(state);
    assert.equal(state.objective.held, 1, "contested");
    assert.ok(state.log.some((line) => /contested/.test(line)));
    foe.areaFeet = 10;
    endOfRoundObjective(state);
    assert.equal(state.objective.status, "success");
});

test("O1 hold: success ends the fight as \"held\"; a deadline fails it", () => {
    const [fighter, champion] = martialParty(5);
    const objective = { kind: "hold", needed: 1, strides: { party: { area: 0 }, foes: { area: 4 } } };
    const result = simulate({ combatants: [fighter, champion, { ...tough("foe", "Foe"), band: "far" }], setup: { objective } }, {}, 3, { log: true });
    assert.equal(result.outcome, "held");
    assert.equal(result.objective, "success");
    assert.equal(result.rounds, 1);
    const late = createFightState({ combatants: [fighter, tough("foe", "Foe")], setup: { objective: { kind: "hold", needed: 3, deadline: 1, strides: { party: { area: 2 } } } } }, {}, 1);
    endOfRoundObjective(late);
    assert.equal(late.objective.status, "failed");
});

test("O1 hold: a PC with no one inside Strides in; a foe goes in to contest it", () => {
    const [fighter, champion] = martialParty(5);
    const setup = { objective: { kind: "hold", strides: { party: { area: 1 }, foes: { area: 1 } } } };
    const state = createFightState({ combatants: [{ ...fighter, band: "far" }, { ...tough("foe", "Foe"), band: "far" }], setup }, {}, 1);
    const c = state.byId.get("fighter");
    c.actionsLeft = 3;
    assert.deepEqual(best(state, c).action, { type: "stride", move: { kind: "toArea" } });
    performAction(state, c, { type: "stride", move: { kind: "toArea" } });
    assert.equal(c.areaFeet, 0);
    const foe = state.byId.get("foe");
    foe.actionsLeft = 3;
    const choice = best(state, foe).action;
    performAction(state, foe, choice);
    assert.equal(foe.areaFeet, 0, `the foe gets in (${JSON.stringify(choice)})`);
    // With a party ally already inside, the champion has much less reason to go.
    const both = createFightState({ combatants: [{ ...fighter, band: "far" }, { ...champion, band: "far" }, { ...tough("foe", "Foe"), band: "far" }], setup: { objective: { kind: "hold", strides: { party: { area: 1 }, foes: { area: 3 } } } } }, {}, 1);
    const champ = both.byId.get("champion");
    champ.actionsLeft = 3;
    const gain = () => {
        const scored = scoreOptions(both, champ);
        return scored.options.find((option) => option.action.move?.kind === "toArea").score - scored.stay;
    };
    const alone = gain();
    both.byId.get("fighter").areaFeet = 0;
    assert.ok(gain() < alone / 4, "worth less once someone holds it");
});

test("O2 escort: it Steps out of a Melee and Strides to the exit, never attacking; reaching it ends the fight as \"escaped\"", () => {
    const [fighter] = martialParty(5);
    // A sturdy merchant who wouldn't act in a fight; the foe beside it has 5-foot reach,
    // and the fighter is far off on the map.
    const merchant = { ...moderateCreature(5, "merchant", "Merchant"), hp: { value: 300, max: 300 }, side: "party", kind: "npc", speed: 25, engagement: 1, acts: false };
    const objective = { kind: "escort", escortId: "merchant", strides: { party: { exit: 2 } } };
    const result = simulate({ combatants: [{ ...fighter, band: "far", mapFeet: { area: 300, exit: 300 } }, merchant, { ...tough("foe", "Foe"), engagement: 1, reach: 5 }], setup: { objective } }, { roundCap: 4 }, 5, { log: true });
    const text = result.log.join("\n");
    assert.match(text, /Merchant Steps away\n  Merchant Strides toward the exit \(1 more\)\n  Merchant Strides toward the exit and reaches it/);
    assert.ok(!/Merchant [^\n]*→/.test(text), "never attacks");
    assert.equal(result.outcome, "escaped");
    assert.equal(result.objective, "success");
});

test("O2 escort: reaching the exit succeeds; dropping to 0 HP fails", () => {
    const [fighter] = martialParty(5);
    const merchant = { ...moderateCreature(1, "merchant", "Merchant"), side: "party", kind: "npc", speed: 25 };
    const setup = { objective: { kind: "escort", escortId: "merchant", strides: { party: { exit: 1 } } } };
    const state = createFightState({ combatants: [fighter, merchant, tough("foe", "Foe")], setup }, {}, 1);
    const m = state.byId.get("merchant");
    performAction(state, m, { type: "stride", move: { kind: "toExit" } });
    updateObjective(state);
    assert.equal(state.objective.status, "success");
    const second = createFightState({ combatants: [fighter, merchant, tough("foe", "Foe")], setup }, {}, 1);
    second.byId.get("merchant").status = "dead";
    updateObjective(second);
    assert.equal(second.objective.status, "failed");
    // Foes go after it as they would a protected creature.
    const foeState = createFightState({ combatants: [fighter, { ...merchant, engagement: 1 }, { ...tough("foe", "Foe"), engagement: 1 }, { ...fighter, id: "f2", name: "F2", engagement: 1 }], setup }, {}, 1);
    const foe = foeState.byId.get("foe");
    foe.actionsLeft = 3;
    assert.equal(best(foeState, foe).action.targetId, "merchant");
});

test("O3 retrieve: picking it up takes a hand (no two-handed Strikes, no shield), then the carrier heads for the exit", () => {
    const [fighter, champion] = martialParty(5);
    const greatsword = { ...fighter.strikes[0], hands: 2 };
    const fist = { name: "Fist", bonus: greatsword.bonus, melee: true, agile: true, damage: [{ dice: 1, die: 4, bonus: 4, type: "bludgeoning" }] };
    const setup = { objective: { kind: "retrieve", strides: { party: { area: 0, exit: 2 }, foes: { area: 3, exit: 3 }, areaToExit: 2 } } };
    const state = createFightState({ combatants: [{ ...fighter, strikes: [greatsword, fist] }, { ...champion, band: "far", strides: undefined }, { ...tough("foe", "Foe"), band: "far" }], setup }, {}, 1);
    const c = state.byId.get("fighter");
    c.actionsLeft = 3;
    const pick = scoreOptions(state, c).options.find((option) => option.action.type === "pickUp");
    assert.ok(pick, "offered inside the area");
    assert.equal(best(state, c).action.type, "pickUp");
    performAction(state, c, { type: "pickUp" });
    assert.equal(state.objective.item.carrierId, "fighter");
    assert.ok(!strikeUsable(c, greatsword) && strikeUsable(c, fist));
    c.actionsLeft = 2;
    assert.deepEqual(best(state, c).action, { type: "stride", move: { kind: "toExit" } });
    // The champion lets go of its shield to carry it.
    const other = createFightState({ combatants: [{ ...champion }, tough("foe", "Foe")], setup: { objective: { kind: "retrieve", carrierId: "champion" } } }, {}, 1);
    const carrier = other.byId.get("champion");
    carrier.actionsLeft = 3;
    assert.ok(!scoreOptions(other, carrier).options.some((option) => option.action.type === "raiseShield"));
});

test("O3 retrieve: reaching the exit ends the fight as \"escaped\"; a fallen carrier drops it where it fell", () => {
    const [fighter, champion] = martialParty(5);
    const objective = { kind: "retrieve", carrierId: "fighter", strides: { party: { area: 0, exit: 1 }, foes: { exit: 4 } } };
    const result = simulate({ combatants: [fighter, champion, { ...tough("foe", "Foe"), band: "far" }], setup: { objective } }, {}, 2, { log: true });
    assert.equal(result.outcome, "escaped");
    assert.equal(result.objective, "success");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1 }, { ...tough("foe", "Foe"), engagement: 1 }], setup: { objective: { ...objective, strides: { party: { area: 0, exit: 2 } } } } }, {}, 1);
    const carrier = state.byId.get("fighter");
    carrier.hp.value = 1;
    const foe = state.byId.get("foe");
    // Knocked out by a hit.
    state.rng.d20 = () => 19;
    performAction(state, foe, { type: "strike", targetId: "fighter", strikeIndex: 0 });
    updateObjective(state);
    const item = state.objective.item;
    assert.equal(item.carrierId, null);
    assert.ok(item.dropped && item.at.has("champion"), "the champion is beside it");
    const champ = state.byId.get("champion");
    champ.actionsLeft = 3;
    assert.ok(scoreOptions(state, champ).options.some((option) => option.action.type === "pickUp"));
});

test("after a won fight the party finishes the objective unopposed, unless the deadline comes first", () => {
    const [fighter] = martialParty(5);
    const hold = createFightState({ combatants: [fighter, tough("foe", "Foe")], setup: { objective: { kind: "hold", needed: 3, strides: { party: { area: 2 } } } } }, {}, 1);
    hold.round = 2;
    settleObjectiveAfterWin(hold);
    assert.equal(hold.objective.status, "success");
    const tight = createFightState({ combatants: [fighter, tough("foe", "Foe")], setup: { objective: { kind: "hold", needed: 3, deadline: 3, strides: { party: { area: 2 } } } } }, {}, 1);
    tight.round = 2;
    settleObjectiveAfterWin(tight);
    assert.equal(tight.objective.status, "failed", "1 round to walk in, then 3 rounds held: round 5");
});

test("held and escaped count as party wins in the report", () => {
    const [fighter] = martialParty(5);
    const snapshot = { combatants: [fighter, tough("foe", "Foe")] };
    const stats = { heroPointsSpent: 0, moraleChecks: 0, moraleBreaks: 0 };
    const report = buildReport(snapshot, [
        { outcome: "held", rounds: 3, objective: "success", party: [], foes: [], stats },
        { outcome: "escaped", rounds: 2, objective: "success", party: [], foes: [], stats },
        { outcome: "defeat", rounds: 4, objective: "failed", party: [], foes: [], stats }
    ]);
    assert.ok(Math.abs(report.winRate - 2 / 3) < 1e-9);
    assert.ok(Math.abs(report.outcomes.held - 1 / 3) < 1e-9);
});

test("on the scene: feet between squares by PF2e's diagonals, to a Region's nearest square, and rounds held", async () => {
    const { squareFeet, nearestFeet, recordRound, heldRounds } = await import("../src/adapter/map.js");
    assert.equal(squareFeet({ i: 0, j: 0 }, { i: 0, j: 3 }), 15);
    assert.equal(squareFeet({ i: 0, j: 0 }, { i: 2, j: 2 }), 15, "5 + 10");
    assert.equal(squareFeet({ i: 0, j: 0 }, { i: 3, j: 4 }), 25, "three diagonals (5, 10, 5) and one straight");
    const region = [{ i: 5, j: 5 }, { i: 5, j: 6 }];
    assert.equal(nearestFeet([{ i: 5, j: 6 }, { i: 6, j: 6 }], region), 0, "a large token partly inside");
    assert.equal(nearestFeet([{ i: 5, j: 1 }], region), 20);
    assert.equal(nearestFeet([], region), null);
    // Round 2 begins: round 1 is counted; round 3: round 2. The GM goes back to round 2: round 2 is dropped (counted again when round 3 begins).
    let record = recordRound({}, 1, true);
    assert.deepEqual(record, {});
    record = recordRound(record, 2, true);
    record = recordRound(record, 3, false);
    assert.deepEqual(record, { 1: true, 2: false });
    record = recordRound(record, 2, true);
    assert.deepEqual(record, { 1: true });
    assert.equal(heldRounds({ 1: true, 2: false, 3: true }), 2);
});
