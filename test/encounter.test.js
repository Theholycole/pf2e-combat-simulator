import test from "node:test";
import assert from "node:assert/strict";

import { creatureXp, reliability, threatRating } from "../src/engine/encounter.js";
import { benchmarkEncounter, martialParty, moderateCreature } from "../src/engine/benchmarks.js";

test("PF2e threat ratings match the benchmark budgets", () => {
    assert.equal(creatureXp(3, 5), 20);
    assert.equal(creatureXp(9, 5), 160);
    assert.equal(creatureXp(0, 5), 0);
    const expected = { trivial: "Trivial", low: "Low", moderate: "Moderate", severe: "Severe", extreme: "Extreme", severeBoss: "Severe", extremeBoss: "Extreme" };
    for (const [threat, label] of Object.entries(expected)) {
        assert.equal(threatRating(benchmarkEncounter(5, threat)).label, label, threat);
    }
});

test("party size moves the budget", () => {
    const three = { combatants: [...martialParty(5).slice(0, 3), moderateCreature(5, "a", "A"), moderateCreature(5, "b", "B")] };
    // 80 XP: Moderate for three PCs (budgets 60 / 90) and Low for five (75 / 100).
    assert.equal(threatRating(three).label, "Moderate");
    const five = { combatants: [...martialParty(5), { ...martialParty(5)[0], id: "extra" }, moderateCreature(5, "a", "A"), moderateCreature(5, "b", "B")] };
    assert.equal(threatRating(five).label, "Low");
});

test("reliability notes what pushes the result which way", () => {
    assert.equal(reliability(benchmarkEncounter(3, "moderate")).level, "high");
    const swarm = benchmarkEncounter(3, "moderate");
    swarm.combatants = swarm.combatants.map((c) => (c.id === "foe1" ? { ...c, strikes: [] } : c));
    const swarmy = reliability(swarm);
    assert.equal(swarmy.leans, "party");
    assert.notEqual(swarmy.level, "high");
    const casters = benchmarkEncounter(3, "moderate");
    casters.combatants = casters.combatants.map((c) => (c.side === "party" ? { ...c, gaps: [1, 2, 3, 4].map((n) => ({ kind: "spell", name: `Spell ${n}` })) } : c));
    assert.equal(reliability(casters).leans, "foes");
});
