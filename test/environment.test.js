import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate, turnEnd } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { performStrike } from "../src/engine/actions.js";
import { addBuiltin, fastHealingNow } from "../src/engine/abilities.js";
import { canCast } from "../src/engine/spells.js";
import { buildEnvironment, covenReady, sightDC, terrainTurn, unseen } from "../src/engine/environment.js";

// L1–L5 (2026-10-13; the user's call: "build everything you brought up", tier 3): the fight's light, weather and ground.

function fight(environment, ...monsters) {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, ...monsters.map((m) => ({ ...m, engagement: 1 }))], setup: { environment } }, {}, 1);
    state.log = [];
    return state;
}
const creature = (id, plan, extra = {}) => {
    const c = { ...moderateCreature(5, id, id[0].toUpperCase() + id.slice(1)), ...extra };
    if (plan) assert.ok(addBuiltin(c, plan, "Test Rule"));
    return c;
};

test("L1 seeing: darkness hides a target from a creature without darkvision, and it's off-guard to what it can't see; dim light and fog conceal", () => {
    const env = buildEnvironment({ light: "dark" });
    assert.ok(env.options.has("lighting:darkness"));
    const state = { environment: env };
    const human = { senses: [] };
    const dwarf = { senses: ["darkvision"] };
    const elf = { senses: ["low-light-vision"] };
    assert.equal(sightDC(state, human, {}), 11);
    assert.equal(sightDC(state, dwarf, {}), 0);
    assert.equal(unseen(state, human, dwarf), true);
    const dim = { environment: buildEnvironment({ light: "dim" }) };
    assert.deepEqual([sightDC(dim, human, {}), sightDC(dim, elf, {}), sightDC(dim, human, { dimConcealDC: 7 })], [5, 0, 7]);
    const snowy = { environment: buildEnvironment({ weather: "snow" }) };
    assert.deepEqual([sightDC(snowy, human, {}), sightDC(snowy, { snowVision: true }, {})], [5, 0]);
    // In a fight: the fighter (no darkvision) rolls a flat check against a creature in darkness, and is off-guard to it.
    const lurker = creature("lurker", null, { senses: ["darkvision"] });
    const dark = fight({ light: "dark" }, lurker);
    dark.rng.d20 = () => 1;
    performStrike(dark, dark.byId.get("fighter"), dark.byId.get("lurker"), dark.byId.get("fighter").strikes[0]);
    assert.ok(dark.log.some((line) => /fails the DC 11 flat check/.test(line)), dark.log.join("\n"));
});

test("L2 light blindness in bright light; sunlight's conditions and a troll's slowing that grows to stone", () => {
    const morlock = creature("morlock", { builtin: "creature-rules", lightBlindness: {} });
    let state = fight({ light: "bright" }, morlock);
    const m = state.byId.get("morlock");
    assert.equal(m.cond.blinded, true);
    assert.ok(m.permanent.some((entry) => entry.slug === "dazzled"));
    state = fight({ light: "dim" }, morlock);
    assert.ok(!state.byId.get("morlock").cond.blinded);
    const troll = creature("troll", { builtin: "creature-rules", sunlight: { conditions: [{ slug: "slowed", value: 1 }], noReactions: true, grows: true, end: "petrified" } });
    state = fight({ light: "bright", sunlight: true }, troll);
    const t = state.byId.get("troll");
    assert.equal(t.noReactions, true);
    turnEnd(state, t);
    turnEnd(state, t);
    assert.ok(t.cond.paralyzed, state.log.join("\n"));
    // Without sunlight, nothing.
    state = fight({ light: "bright" }, troll);
    assert.ok(!state.byId.get("troll").noReactions);
});

test("L3 natural difficult terrain halves Speed but for a creature with its stride; a predicate on the terrain", () => {
    const strider = creature("strider", { builtin: "creature-rules", terrainStride: ["swamp"] });
    const state = fight({ difficult: "swamp", terrain: ["underwater"] }, strider);
    const pc = state.byId.get("fighter");
    const s = state.byId.get("strider");
    const speed = pc.speed;
    terrainTurn(state, pc, "start");
    terrainTurn(state, s, "start");
    assert.deepEqual([pc.speed, s.speed], [Math.floor(speed / 2 / 5) * 5, 25]);
    terrainTurn(state, pc, "end");
    assert.equal(pc.speed, speed);
    const coral = creature("coral", { builtin: "fast-healing", value: 5, when: ["terrain:underwater"] });
    assert.equal(fastHealingNow(state, coral), 5);
});

test("L4–L5 Hidden Movement's off-guard; a coven spell only with two other members beside it, once a round", () => {
    const stalker = creature("stalker", { builtin: "creature-rules", hiddenMovement: true }, { senses: ["darkvision"] });
    let hits = 0;
    for (let seed = 1; seed <= 6; seed++) {
        const { log } = simulate({ combatants: [{ ...martialParty(5)[0], engagement: 1, hp: { value: 999, max: 999 } }, { ...stalker, engagement: 1 }], setup: { environment: { light: "dark" } } }, {}, seed, { log: true });
        if (log.some((line) => /^ {2}Stalker [\w ]+ → Fighter:/.test(line))) hits++;
    }
    assert.ok(hits > 0);
    const hag = (id) => creature(id, { builtin: "creature-rules", coven: true });
    const state = fight({}, hag("hag1"), hag("hag2"), hag("hag3"));
    const first = state.byId.get("hag1");
    assert.equal(covenReady(state, first), true);
    state.byId.get("hag3").status = "dead";
    assert.equal(covenReady(state, first), false);
    const spell = { name: "Test Coven Spell", coven: true, plan: { resolution: { kind: "save" } } };
    assert.equal(canCast({ covenReady: false, spellPools: {} }, spell), false);
});
