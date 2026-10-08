import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { performStrike } from "../src/engine/actions.js";
import { offGuardTo } from "../src/engine/combatant.js";

// A commander's tactics (C21–C24).
const dice = (...rolls) => () => rolls.shift() ?? 10;

function squad({ drilled = false } = {}) {
    const [fighter, cleric, ranger, rogue] = martialParty(5);
    const commander = { ...fighter, id: "ulka", name: "Ulka", engagement: 1, commander: { banner: 30, drilled, strikeHard: "Strike Hard!", pincerAttack: "Pincer Attack", bannersInspiration: "Banner's Inspiration" } };
    return [commander, { ...rogue, id: "rogue", name: "Rogue", engagement: 1 }, { ...ranger, id: "ranger", name: "Ranger", band: "near" }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }];
}

test("C21 Strike Hard!: an ally Strikes at once with its reaction; Drilled Reactions lends one extra a round", () => {
    const state = createFightState({ combatants: squad({ drilled: true }) }, {}, 1);
    const c = state.byId.get("ulka");
    const rogue = state.byId.get("rogue");
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "strikeHard");
    assert.ok(option && option.value > 0);
    state.log = [];
    performAction(state, c, { ...option.action, allyId: "rogue", strikeIndex: 0 });
    assert.ok(state.log.some((line) => /uses Strike Hard!: Rogue Strikes/.test(line)) && state.log.some((line) => /Rogue .* → Foe/.test(line)));
    assert.equal(rogue.reactionUsed, true);
    assert.equal(rogue.attacksThisTurn ?? 0, 0, "a reaction: no attack penalty for its own turn");
    // Its reaction spent: Drilled Reactions lets it answer once more this round.
    performAction(state, c, { type: "strikeHard", allyId: "rogue", targetId: "foe", strikeIndex: 0, actions: 2 });
    assert.equal(c.drilledRound, state.round);
    state.log = [];
    performAction(state, c, { type: "strikeHard", allyId: "rogue", targetId: "foe", strikeIndex: 0, actions: 2 });
    assert.ok(!state.log.some((line) => /Rogue .* → Foe/.test(line)), "not a third time this round");
});

test("C22 Pincer Attack: the foe beside an answering ally is off-guard to melee from the commander and that ally, not to the others", () => {
    const state = createFightState({ combatants: squad() }, {}, 1);
    const c = state.byId.get("ulka");
    const foe = state.byId.get("foe");
    c.actionsLeft = 3;
    assert.ok(scoreOptions(state, c).options.some((entry) => entry.action.type === "pincerAttack"));
    performAction(state, c, { type: "pincerAttack", actions: 1 });
    assert.ok(offGuardTo(foe, c, true) && offGuardTo(foe, state.byId.get("rogue"), true));
    assert.ok(!offGuardTo(foe, state.byId.get("ranger"), true), "the ranger wasn't next to it");
    assert.ok(!offGuardTo(foe, c, false), "melee only");
});

test("C23 Set-Up Strike: off-guard to the next attack from any ally, spent by the first; C24 Banner's Inspiration lowers frightened", async () => {
    const { setUp } = await import("../src/engine/commander.js");
    const state = createFightState({ combatants: squad() }, {}, 1);
    const c = state.byId.get("ulka");
    const foe = state.byId.get("foe");
    const rogue = state.byId.get("rogue");
    const ranger = state.byId.get("ranger");
    setUp(state, c, foe);
    assert.ok(offGuardTo(foe, rogue, true) && offGuardTo(foe, ranger, false));
    state.rng.d20 = dice(15);
    performStrike(state, rogue, foe, rogue.strikes[0]);
    assert.ok(!offGuardTo(foe, ranger, false), "spent by the rogue's attack");
    rogue.cond.frightened = 2;
    c.actionsLeft = 3;
    assert.ok(scoreOptions(state, c).options.some((entry) => entry.action.type === "bannersInspiration"));
    performAction(state, c, { type: "bannersInspiration", actions: 1 });
    assert.equal(rogue.cond.frightened, 1);
});

test("the flourish trait: one flourish action a turn (Set-Up Strike, then no second)", () => {
    const [commander, rogue, ranger, foe] = squad();
    const activity = { name: "Set-Up Strike", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, setUp: true, flourish: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null };
    const state = createFightState({ combatants: [{ ...commander, strikeActivities: [activity] }, rogue, ranger, foe] }, {}, 1);
    const c = state.byId.get("ulka");
    c.actionsLeft = 3;
    c.usedThisTurn = new Set();
    const first = scoreOptions(state, c).options.find((entry) => entry.action.type === "strikeActivity");
    assert.ok(first);
    performAction(state, c, first.action);
    assert.ok(!scoreOptions(state, c).options.some((entry) => entry.action.type === "strikeActivity"), "not a second flourish this turn");
});
