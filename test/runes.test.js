import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { performStrike, increaseDying } from "../src/engine/actions.js";
import { adjustDamage } from "../src/engine/damage.js";
import { deathThreshold } from "../src/engine/combatant.js";
import { ignoredResistances, keenCritical } from "../src/engine/runes.js";

// Weapon runes and the like (2026-10-15, the user's champion Riah: "Can we try to simulate her whole character sheet as much as possible").
function duel(runes, { target = {} } = {}) {
    const [fighter] = martialParty(14);
    const pc = { ...fighter, engagement: 1 };
    pc.strikes = pc.strikes.map((strike, index) => (index === 0 ? { ...strike, damage: strike.damage.map((part, i) => (i === 0 ? { ...part, type: "piercing" } : part)), iwr: { ...(strike.iwr ?? {}), runes } } : strike));
    const state = createFightState({ combatants: [pc, { ...moderateCreature(14, "foe", "Foe"), engagement: 1, hp: { value: 900, max: 900 }, ...target }] }, {}, 1);
    state.log = [];
    return { state, pc: state.byId.get(fighter.id), foe: state.byId.get("foe") };
}

test("keen: a natural 19 that hits with a piercing or slashing weapon is a critical hit", () => {
    assert.equal(keenCritical({ iwr: { runes: ["keen"] }, damage: [{ type: "piercing" }] }, 19, 2), true);
    assert.equal(keenCritical({ iwr: { runes: ["keen"] }, damage: [{ type: "bludgeoning" }] }, 19, 2), false);
    assert.equal(keenCritical({ iwr: { runes: ["keen"] }, damage: [{ type: "slashing" }] }, 19, 1), false, "a miss stays a miss");
    const { state, pc, foe } = duel(["keen"]);
    state.rng.d20 = () => 19;
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.ok(state.log.some((line) => line.includes("critically hits")), state.log.join("\n"));
});

test("a critical hit's runes: greater frost's slowed on a failed DC 34 Fortitude save, greater fearsome's frightened 2", () => {
    const { state, pc, foe } = duel(["greaterFrost", "greaterFearsome"]);
    const rolls = [20, 2];
    state.rng.d20 = () => rolls.shift() ?? 10;
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.equal(foe.cond.slowed, 1, state.log.join("\n"));
    assert.equal(foe.cond.frightened, 2);
    assert.ok(state.log.some((line) => line.includes("greater frost rune (fortitude, DC 34)")));
});

test("2026-10-16, the rest of PF2e's critical-hit runes: flickering's dazzled, merciful's fascinated, nightmare's stupefied (frightened 2 on one already stupefied)", () => {
    let { state, pc, foe } = duel(["flickering", "merciful", "nightmare"]);
    state.rng.d20 = () => 20;
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.deepEqual([foe.cond.dazzled, foe.cond.fascinated, foe.cond.stupefied, foe.cond.frightened ?? 0], [true, true, 1, 0], state.log.join("\n"));
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.equal(foe.cond.frightened, 2, "already stupefied");
});

test("2026-10-16: bloodthirsty's drained 1 only on a target taking persistent bleed; giant-killing's enfeebled 1 only on a giant, the greater rune's save by degree", () => {
    let { state, pc, foe } = duel(["bloodthirsty", "giantKilling"]);
    state.rng.d20 = () => 20;
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.deepEqual([foe.cond.drained ?? 0, foe.cond.enfeebled ?? 0], [0, 0], state.log.join("\n"));
    foe.persistent = [{ type: "bleed", dice: 1, die: 6, bonus: 0, multiplier: 1 }];
    foe.traits = [...(foe.traits ?? []), "giant"];
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.deepEqual([foe.cond.drained, foe.cond.enfeebled], [1, 1], state.log.join("\n"));
    ({ state, pc, foe } = duel(["greaterGiantKilling"], { target: { traits: ["giant"] } }));
    // A critical hit, then a critically failed DC 34 Fortitude save: enfeebled 4 and 4d10 mental.
    const rolls = [20, 1];
    state.rng.d20 = () => rolls.shift() ?? 10;
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.equal(foe.cond.enfeebled, 4, state.log.join("\n"));
    assert.ok(state.log.some((line) => /takes \d+ mental \(greater giant killing rune\)/.test(line)), state.log.join("\n"));
});

test("a greater rune's damage ignores resistance to its type; Sacred Defender: a natural 20 against it doesn't improve the result", () => {
    const options = new Set(["item:rune:property:greaterFrost"]);
    assert.deepEqual([...ignoredResistances(options)], ["cold"]);
    assert.equal(ignoredResistances(new Set(["item:rune:property:keen"])), null);
    const defender = { resistances: [{ type: "cold", value: 10, exceptions: [] }, { type: "fire", value: 10, exceptions: [] }], weaknesses: [], immunities: [] };
    const context = Object.assign(new Set(options), { ignored: ignoredResistances(options) });
    assert.equal(adjustDamage(defender, [{ type: "cold", amount: 15, context }]).total, 15);
    assert.equal(adjustDamage(defender, [{ type: "fire", amount: 15, context }]).total, 5);
    // Sacred Defender: a natural 20 that would miss stays a miss (without it, a hit).
    const { state: other, pc: pc2, foe: foe2 } = duel([], { target: { ac: 55 } });
    other.rng.d20 = () => 20;
    performStrike(other, pc2, foe2, pc2.strikes[0]);
    assert.ok(other.log.some((line) => line.includes(", hits")), other.log.join("\n"));
    const { state: third, pc: pc3, foe: foe3 } = duel([], { target: { ac: 55, noNaturalTwenty: true } });
    third.rng.d20 = () => 20;
    performStrike(third, pc3, foe3, pc3.strikes[0]);
    assert.ok(third.log.some((line) => line.includes("misses")), third.log.join("\n"));
});

test("Diehard: a PC dies at dying 5 (its sheet's), less its doomed", () => {
    const { state, pc } = duel([]);
    pc.deathAt = 5;
    assert.equal(deathThreshold(pc), 5);
    pc.cond.doomed = 1;
    assert.equal(deathThreshold(pc), 4);
    pc.cond.doomed = 0;
    pc.status = "down";
    pc.cond.dying = 4;
    state.options.heroPoints = false;
    increaseDying(state, pc, 0);
    assert.equal(pc.status, "down");
    increaseDying(state, pc, 1);
    assert.equal(pc.status, "dead");
});
