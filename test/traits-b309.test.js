import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { expectedHitDamage, performStrike } from "../src/engine/actions.js";
import { sacredWeakness } from "../src/engine/damage.js";

// B309 (2026-10-13; the user's call: "work through your recommendations in order", item 5): Strike traits the simulation ignored.

test("B309 a holy, unholy or sanctified Strike sets off the weakness to it, once a hit; legacy good and evil count as holy and unholy", () => {
    const fiend = { weaknesses: [{ type: "holy", value: 10, exceptions: [] }] };
    assert.equal(sacredWeakness({}, { holy: true }, fiend), 10);
    assert.equal(sacredWeakness({}, { good: true }, fiend), 10);
    assert.equal(sacredWeakness({ traits: ["holy"] }, { sanctified: true }, fiend), 10);
    assert.equal(sacredWeakness({ traits: ["unholy"] }, { sanctified: true }, fiend), 0);
    assert.equal(sacredWeakness({}, { unholy: true }, fiend), 0);
    const [champion] = martialParty(5).filter((pc) => pc.id === "champion");
    const devil = { ...moderateCreature(5, "devil", "Devil"), weaknesses: [{ type: "holy", value: 10, exceptions: [] }], engagement: 1 };
    const state = createFightState({ combatants: [{ ...champion, engagement: 1 }, devil] }, {}, 1);
    const c = state.byId.get("champion");
    const plain = c.strikes[0];
    const holy = { ...plain, holy: true };
    assert.equal(expectedHitDamage(c, holy, state.byId.get("devil"), false) - expectedHitDamage(c, plain, state.byId.get("devil"), false), 10);
    // Rolled: the hit deals 10 more.
    state.rng.d20 = () => 15;
    state.rng.die = () => 1;
    const before = state.byId.get("devil").hp.value;
    performStrike(state, c, state.byId.get("devil"), plain);
    const ordinary = before - state.byId.get("devil").hp.value;
    const mid = state.byId.get("devil").hp.value;
    c.attacksThisTurn = 0;
    performStrike(state, c, state.byId.get("devil"), holy);
    assert.equal(mid - state.byId.get("devil").hp.value, ordinary + 10);
});

test("B309 twin: the second attack with the pair in a turn gains its damage dice as a bonus", () => {
    const [fighter] = martialParty(5);
    const foe = { ...moderateCreature(5, "foe", "Foe"), hp: { value: 500, max: 500 }, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, foe] }, {}, 1);
    const c = state.byId.get("fighter");
    const twin = { ...c.strikes[0], twin: true, noMap: true };
    state.rng.d20 = () => 19;
    state.rng.die = () => 1;
    const target = state.byId.get("foe");
    const hp0 = target.hp.value;
    performStrike(state, c, target, twin);
    const first = hp0 - target.hp.value;
    const hp1 = target.hp.value;
    performStrike(state, c, target, twin);
    assert.equal(hp1 - target.hp.value, first + (twin.damage[0].dice ?? 1));
});
