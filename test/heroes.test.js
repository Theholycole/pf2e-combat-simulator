import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { performStrike } from "../src/engine/actions.js";
import { castSpell } from "../src/engine/spells.js";
import { canSpendHero, saveWorthReroll } from "../src/engine/heroes.js";

// Hero points "when it matters" (2026-10-15; the user: "how are hero points decided to be used? It seems low even on deadly encounters").
const row = (extra = {}) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...extra });
const PARALYZE = { modelVersion: 12, source: { name: "Paralyze" }, rank: 3, traits: ["incapacitation", "mental"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" },
    resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: row(), success: row({ effects: [{ kind: "condition", slug: "stunned", value: 1, duration: null }] }), failure: row({ effects: [{ kind: "condition", slug: "paralyzed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }] }), criticalFailure: row({ effects: [{ kind: "condition", slug: "paralyzed", value: null, duration: { mode: "fixed", value: 4, unit: "rounds" } }] }) } } };
const SICKEN = { ...PARALYZE, source: { name: "Sicken" }, traits: ["mental"], resolution: { ...PARALYZE.resolution, outcomes: { criticalSuccess: row(), success: row(), failure: row({ effects: [{ kind: "condition", slug: "sickened", value: 1, duration: null }] }), criticalFailure: row({ effects: [{ kind: "condition", slug: "sickened", value: 2, duration: null }] }) } } };

function setUp() {
    const [fighter] = martialParty(5);
    const witch = { ...moderateCreature(5, "witch", "Witch"), spells: [{ name: "Paralyze", plan: PARALYZE, castRank: 3, dc: 24, attack: 14, pool: null }, { name: "Sicken", plan: SICKEN, castRank: 3, dc: 24, attack: 14, pool: null }], spellPools: {}, band: "near", engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", engagement: 1, heroPoints: 1 }, witch] }, {}, 1);
    state.log = [];
    return { state, pc: state.byId.get(fighter.id), witch: state.byId.get("witch") };
}

test("a failed save against something that would take the PC out is rerolled with a hero point; a minor one isn't; a critical failure always is", () => {
    let { state, pc, witch } = setUp();
    const rolls = [5, 19];
    state.rng.d20 = () => rolls.shift() ?? 10;
    castSpell(state, witch, 0, [pc.id]);
    assert.ok(state.log.some((line) => line.includes("spends a hero point to reroll its will save")), state.log.join("\n"));
    assert.equal(pc.heroPoints, 0);
    assert.equal(pc.cond.paralyzed, false);
    // Sickened 1 on a failure: not worth it.
    ({ state, pc, witch } = setUp());
    state.rng.d20 = () => 8;
    castSpell(state, witch, 1, [pc.id]);
    assert.equal(pc.heroPoints, 1, state.log.join("\n"));
    // A critical failure: always.
    assert.equal(saveWorthReroll(pc, 0, []), true);
});

test("a missed Strike that would drop its target is rerolled with the first point; below a third of its HP a PC keeps its last point", () => {
    const { state, pc, witch } = setUp();
    witch.hp.value = 3;
    const rolls = [2, 18];
    state.rng.d20 = () => rolls.shift() ?? 10;
    performStrike(state, pc, witch, pc.strikes[0]);
    assert.ok(state.log.some((line) => line.includes("spends a hero point to reroll its attack")), state.log.join("\n"));
    assert.equal(pc.heroPoints, 0);
    pc.heroPoints = 1;
    pc.hp.value = Math.floor(pc.hp.max / 4);
    assert.equal(canSpendHero(state, pc), false, "kept for Heroic Recovery");
    pc.heroPoints = 2;
    assert.equal(canSpendHero(state, pc), true);
});
