import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { castSpell } from "../src/engine/spells.js";
import { featureParts } from "../src/engine/actions.js";

// Spellstrike (C20): a melee Strike carrying a spell; Recharge Spellstrike; a conflux spell recharges it.
const dice = (...rolls) => () => rolls.shift() ?? 10;
const rows = (byDegree) => Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...byDegree[degree] }]));
const spellPlan = (name, check, { traits = ["concentrate", "manipulate"], time = "2" } = {}) => ({
    modelVersion: 12, source: { name }, rank: 1, traits, activation: { time, traits }, targeting: { target: "1 creature", range: "touch", area: null },
    resolution: { kind: "save", check, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "4d6", type: "electricity" }] }, outcomes: rows(check.statistic === "spell-attack"
        ? { criticalSuccess: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } } }
        : { success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } } }) }
});
const SHOCK = { name: "Shocking Grasp", plan: spellPlan("Shocking Grasp", { statistic: "spell-attack" }, { traits: ["attack", "concentrate", "manipulate"] }), castRank: 1, dc: 19, attack: 9, pool: "slot1" };
const THUNDER = { name: "Thunderstrike", plan: spellPlan("Thunderstrike", { statistic: "reflex", basic: true }), castRank: 1, dc: 19, attack: 9, pool: "slot1b" };
const CONFLUX = { name: "Thunderous Strike", plan: { ...spellPlan("Thunderous Strike", { statistic: "fortitude", basic: true }, { traits: ["conflux", "concentrate", "manipulate"], time: "1" }) }, castRank: 1, dc: 19, attack: 9, pool: "focus" };

function magus(extra = {}) {
    const [fighter] = martialParty(5);
    return { ...fighter, id: "magus", name: "Magus", engagement: 1, spellstrike: { name: "Spellstrike" }, spells: [SHOCK, THUNDER, CONFLUX], spellPools: { slot1: 1, slot1b: 1, focus: 1 }, ...extra };
}

test("C20 Spellstrike: offered in melee while charged; the spell attack hits as the Strike does; two attacks; then spent", () => {
    const state = createFightState({ combatants: [magus(), { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    const c = state.byId.get("magus");
    const foe = state.byId.get("foe");
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "spellstrike");
    assert.ok(option && option.value > 0);
    state.log = [];
    state.rng.d20 = dice(19);
    const before = foe.hp.value;
    performAction(state, c, { type: "spellstrike", targetId: "foe", strikeIndex: 0, spellIndex: 0, actions: 2 });
    assert.ok(state.log.some((line) => /uses Spellstrike with Shocking Grasp/.test(line)));
    assert.ok(state.log.some((line) => /casts Shocking Grasp/.test(line)));
    assert.ok(state.log.some((line) => /Foe: (critical )?success/i.test(line)), "the spell hits as the Strike did");
    assert.ok(before - foe.hp.value > 0);
    assert.equal(c.attacksThisTurn, 2, "two attacks for the penalty");
    assert.equal(c.spellstrikeCharged, false);
    assert.equal(c.spellPools.slot1, 0, "the slot is spent");
    assert.ok(!scoreOptions(state, c).options.some((entry) => entry.action.type === "spellstrike"), "not again until recharged");
    const recharge = scoreOptions(state, c).options.find((entry) => entry.action.type === "rechargeSpellstrike");
    assert.ok(recharge);
    performAction(state, c, recharge.action);
    assert.equal(c.spellstrikeCharged, true);
});

test("C20 Spellstrike with a save spell: the target saves; a critically missed Strike loses the spell; a conflux spell recharges", () => {
    const state = createFightState({ combatants: [magus(), { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    const c = state.byId.get("magus");
    state.log = [];
    state.rng.d20 = dice(1);
    performAction(state, c, { type: "spellstrike", targetId: "foe", strikeIndex: 0, spellIndex: 1, actions: 2 });
    assert.ok(state.log.some((line) => /Thunderstrike is disrupted/.test(line)), "a critical miss loses it");
    assert.equal(c.spellPools.slot1b, 0);
    assert.equal(c.attacksThisTurn, 2);
    castSpell(state, c, 2, ["foe"]);
    assert.equal(c.spellstrikeCharged, true, "the conflux spell recharges Spellstrike");
});

test("C13 measured: a stance's change to existing Strikes (Arcane Cascade's force damage) counts while it's on, and makes the stance worth taking", () => {
    const [fighter] = martialParty(5);
    const name = fighter.strikes[0].name;
    const cascade = { name: "Arcane Cascade", actions: 1, stance: true, model: { name: "Arcane Cascade", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, attackDeltas: {}, strikeDeltas: { [name]: [{ dice: 0, die: 0, bonus: 1, multiplier: 1, type: "force", precision: false, persistent: false }] } }, strikes: [] };
    const state = createFightState({ combatants: [{ ...fighter, id: "magus", engagement: 1, selfEffects: [cascade] }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("magus");
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "selfEffect");
    assert.ok(option && option.value > 0, "worth taking for the extra damage");
    performAction(state, c, option.action);
    const parts = featureParts(c, c.strikes[0], state.byId.get("foe"));
    assert.ok(parts.some((part) => part.type === "force" && part.bonus === 1));
});
