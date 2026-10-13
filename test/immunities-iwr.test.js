import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { expectedHitDamage, performStrike } from "../src/engine/actions.js";
import { applyCondition, castPlan, spellExpectation } from "../src/engine/spells.js";
import { adjustDamage, spellContext, strikeContext, strikeIwr } from "../src/engine/damage.js";
import { effectImmunity, immuneToCondition } from "../src/engine/immunities.js";

// I1–I2 (2026-10-13; the user's call: "build everything you brought up"): immunities to conditions and effect traits, and weaknesses and
// resistances to more than a damage type.

const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
const shared = (multiplier) => ({ mode: "shared", multiplier, sourceComponentIds: ["0"] });
// A Will save at DC 30 that frightens on a failure; or, with a damage type, a basic Reflex save for 4d6 of it (in an area when asked).
const blast = ({ traits = [], type = null, area = null, kind = "spell" } = {}) => ({
    name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, kind,
    plan: {
        modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits, activation: { time: "2", traits: [] }, targeting: { target: area ? null : "1 creature", range: "30 feet", area }, trigger: { event: "use" },
        resolution: type
            ? { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 30 } }, sharedDamage: { components: [{ id: "0", formula: `4d6[${type}]`, kinds: [type] }] }, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: shared(0.5), effects: [] }, failure: { damage: shared(1), effects: [] }, criticalFailure: { damage: shared(2), effects: [] } } }
            : { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 30 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } }
    }
});

function fight(monster) {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...monster, engagement: 1 }] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 2;
    return state;
}

test("I1 a condition immunity: the condition doesn't land, whatever gives it; unconscious covers asleep", () => {
    const golem = { ...moderateCreature(5, "golem", "Golem"), immunities: ["paralyzed", "unconscious"] };
    assert.equal(immuneToCondition(golem, "paralyzed"), true);
    assert.equal(immuneToCondition(golem, "asleep"), true);
    assert.equal(immuneToCondition(golem, "slowed"), false);
    const state = fight(golem);
    const g = state.byId.get("golem");
    assert.equal(applyCondition(state, g, "paralyzed", null, null, state.byId.get("fighter")), false);
    assert.ok(!g.cond.paralyzed);
    assert.equal(applyCondition(state, g, "slowed", 1, null, state.byId.get("fighter")), true);
});

test("I1 a trait immunity: a mental, death or fear effect does nothing — no save, no condition, worth nothing to its caster", () => {
    const mindless = { ...moderateCreature(5, "ooze", "Ooze"), immunities: ["mental", "death-effects"] };
    assert.equal(effectImmunity(mindless, blast({ traits: ["mental", "emotion"] })), "mental");
    assert.equal(effectImmunity(mindless, blast({ traits: ["death"] })), "death-effects");
    assert.equal(effectImmunity(mindless, blast({ traits: ["fire"] })), null);
    const state = fight(mindless);
    castPlan(state, state.byId.get("fighter"), blast({ traits: ["mental"] }), ["ooze"]);
    assert.ok(state.log.includes("  Ooze is immune (mental)"), state.log.join("\n"));
    assert.ok(!state.byId.get("ooze").cond.frightened);
    const [entry] = spellExpectation(state, state.byId.get("fighter"), blast({ traits: ["mental"] }), [state.byId.get("ooze")]);
    assert.deepEqual([entry.damage, entry.worth], [0, 0]);
    // A swarm's mind is a mental immunity.
    assert.equal(effectImmunity({ immunities: ["swarm-mind"] }, blast({ traits: ["mental"] })), "swarm-mind");
});

test("I1 immunity to magic: every spell and every magical ability, not a plain one; a golem's antimagic stays its own rule", () => {
    const warded = { immunities: ["magic"] };
    assert.equal(effectImmunity(warded, blast()), "magic");
    assert.equal(effectImmunity(warded, blast({ kind: "ability" })), null);
    assert.equal(effectImmunity(warded, blast({ kind: "ability", traits: ["magical"] })), "magic");
    assert.equal(effectImmunity(warded, blast({ kind: "ability", traits: ["divine"] })), "magic");
    assert.equal(effectImmunity({ ...warded, golemAntimagic: { harmed: { by: ["fire"] } } }, blast()), null);
});

// Damage of one source: instances with its context.
const hit = (context, ...instances) => adjustDamage(target, instances.map((instance) => ({ persistent: false, precision: false, ...instance, context })));
let target = null;

test("I2 area and splash damage: a swarm's weakness to each, once an instance, the higher of the two", () => {
    target = { weaknesses: [{ type: "area-damage", value: 5, exceptions: [] }, { type: "splash-damage", value: 3, exceptions: [] }] };
    const area = spellContext(blast({ type: "fire", area: { type: "burst", value: 10 } }), { area: true });
    const single = spellContext(blast({ type: "fire" }));
    assert.equal(hit(area, { type: "fire", amount: 10 }).total, 15);
    assert.equal(hit(single, { type: "fire", amount: 10 }).total, 10);
    const bomb = strikeContext({}, { name: "Bomb" });
    assert.equal(hit(bomb, { type: "fire", amount: 1, splash: true }).total, 4);
    // Splash joins its type's instance: one weakness for both.
    assert.equal(hit(bomb, { type: "fire", amount: 6 }, { type: "fire", amount: 1, splash: true }).total, 10);
    assert.equal(hit(area, { type: "fire", amount: 6, splash: true }).total, 11);
});

test("I2 materials: silver and cold iron (dawnsilver and sovereign steel too) on the weapon's own damage, not a rune's", () => {
    target = { weaknesses: [{ type: "silver", value: 5, exceptions: [] }, { type: "cold-iron", value: 7, exceptions: [] }] };
    const silver = strikeContext({}, { iwr: { materials: ["silver"] } });
    assert.equal(hit(silver, { type: "slashing", amount: 8, weapon: true }, { type: "fire", amount: 3 }).total, 16);
    assert.equal(hit(strikeContext({}, { iwr: { materials: ["dawnsilver"] } }), { type: "slashing", amount: 8, weapon: true }).total, 13);
    assert.equal(hit(strikeContext({}, { iwr: { materials: ["sovereign-steel"] } }), { type: "slashing", amount: 8, weapon: true }).total, 15);
    assert.equal(hit(strikeContext({}, {}), { type: "slashing", amount: 8, weapon: true }).total, 8);
});

test("I2 a resistance's exceptions and doubling: adamantine, ghost touch, magical; double against non-magical damage", () => {
    target = { resistances: [{ type: "physical", value: 5, exceptions: ["adamantine"] }, { type: "all-damage", value: 3, exceptions: ["force", "ghost-touch"], doubleVs: ["non-magical"] }] };
    const plain = strikeContext({}, {});
    const magical = strikeContext({}, { iwr: { traits: ["magical"] } });
    // Physical 5 beats all-damage 3 (6 doubled against non-magical damage would beat it).
    assert.equal(hit(magical, { type: "slashing", amount: 10, weapon: true }).total, 5);
    assert.equal(hit(plain, { type: "slashing", amount: 10, weapon: true }).total, 4);
    // Adamantine gets past the physical resistance, not the other.
    assert.equal(hit(strikeContext({}, { iwr: { traits: ["magical"], materials: ["adamantine"] } }), { type: "slashing", amount: 10, weapon: true }).total, 7);
    // Ghost touch past the all-damage one; force too.
    assert.equal(hit(strikeContext({}, { iwr: { traits: ["magical"], runes: ["ghost-touch"] } }), { type: "fire", amount: 10 }).total, 10);
    assert.equal(hit(magical, { type: "force", amount: 10 }).total, 10);
    // A resistance to spells: a spell's damage, not an ability's.
    target = { resistances: [{ type: "spells", value: 4, exceptions: [] }] };
    assert.equal(hit(spellContext(blast({ type: "fire" })), { type: "fire", amount: 10 }).total, 6);
    assert.equal(hit(spellContext(blast({ type: "fire", kind: "ability" }), { isSpell: false }), { type: "fire", amount: 10 }).total, 10);
    // Critical hits: only a critical hit's, and no more than its extra damage.
    target = { resistances: [{ type: "critical-hits", value: 10, exceptions: [] }] };
    assert.equal(hit(strikeContext({}, { name: "Claw" }, true), { type: "slashing", amount: 12, weapon: true }).total, 6);
    assert.equal(hit(strikeContext({}, { name: "Jaws" }), { type: "slashing", amount: 12, weapon: true }).total, 12);
    // Bleed is physical damage.
    target = { resistances: [{ type: "physical", value: 2, exceptions: [] }] };
    assert.equal(hit(plain, { type: "bleed", amount: 5 }).total, 3);
});

test("I2 a weakness to a trait or a weapon group counts once a hit: axes, holy spells, both at once", () => {
    target = { weaknesses: [{ type: "axe-vulnerability", value: 5, exceptions: [] }, { type: "holy", value: 10, exceptions: [] }] };
    const axe = strikeContext({}, { iwr: { group: "axe" } });
    assert.equal(hit(axe, { type: "slashing", amount: 8, weapon: true }, { type: "fire", amount: 3 }).total, 16);
    assert.equal(hit(spellContext(blast({ type: "spirit", traits: ["holy"] })), { type: "spirit", amount: 10 }).total, 20);
    // Both once-a-hit weaknesses when both apply.
    assert.equal(hit(strikeContext({}, { iwr: { group: "axe" }, holy: true }), { type: "slashing", amount: 8, weapon: true }).total, 23);
});

test("I2 a Strike's context from its traits and item: magical and holy, materials, an axe's group by name", () => {
    assert.deepEqual(strikeIwr(["magical", "good", "cold-iron", "agile"], { name: "Battle Axe" }), { traits: ["magical", "holy"], materials: ["cold-iron"], group: "axe" });
    assert.equal(strikeIwr(["agile"], { name: "Pickaxe" }), null);
    assert.deepEqual(strikeIwr([], { material: "silver", group: "sword", runes: ["ghost-touch"] }), { materials: ["silver"], group: "sword", runes: ["ghost-touch"] });
    // The benchmark party's weapons are magical from 2nd level.
    assert.equal(martialParty(1)[0].strikes[0].iwr, undefined);
    assert.deepEqual(martialParty(2)[0].strikes[0].iwr, { traits: ["magical"] });
});

test("I2 in a fight: a silver Strike on a creature weak to silver, expected and rolled; an area spell on a swarm", () => {
    const wolf = { ...moderateCreature(5, "wolf", "Wolf"), weaknesses: [{ type: "silver", value: 5, exceptions: [] }] };
    const state = fight(wolf);
    const c = state.byId.get("fighter");
    const w = state.byId.get("wolf");
    const plain = c.strikes[0];
    const silver = { ...plain, iwr: { materials: ["silver"] } };
    assert.equal(expectedHitDamage(c, silver, w, false) - expectedHitDamage(c, plain, w, false), 5);
    state.rng.d20 = () => 15;
    state.rng.die = () => 1;
    let before = w.hp.value;
    performStrike(state, c, w, plain);
    const plainDealt = before - w.hp.value;
    before = w.hp.value;
    c.attacksThisTurn = 0;
    performStrike(state, c, w, silver);
    assert.equal(before - w.hp.value, plainDealt + 5);
    // An area spell's expected damage on a swarm weak to area damage.
    const swarm = { ...moderateCreature(5, "swarm", "Swarm"), weaknesses: [{ type: "area-damage", value: 5, exceptions: [] }] };
    const other = fight(swarm);
    const caster = other.byId.get("fighter");
    const [single] = spellExpectation(other, caster, blast({ type: "fire" }), [other.byId.get("swarm")]);
    const [area] = spellExpectation(other, caster, blast({ type: "fire", area: { type: "burst", value: 10 } }), [other.byId.get("swarm")]);
    assert.ok(area.damage > single.damage + 3, `${area.damage} vs ${single.damage}`);
});

test("I4 Fast Healing or regeneration only while PF2e's predicate holds: its toggle on, not in a form or without its effect, the terrain", async () => {
    const { addBuiltin, fastHealingNow, regenerating } = await import("../src/engine/abilities.js");
    const vampire = { ...moderateCreature(5, "vampire", "Vampire") };
    assert.ok(addBuiltin(vampire, { builtin: "fast-healing", value: 7, when: [{ not: "turn-to-mist" }] }, "Fast Healing 7"));
    assert.equal(vampire.fastHealing, undefined);
    assert.equal(fastHealingNow(null, vampire), 7);
    assert.equal(fastHealingNow(null, { ...vampire, rollOptions: ["turn-to-mist"] }), 0);
    // Its own toggle: off unless on (the snapshot's, or its rule's default).
    const scamp = { ...moderateCreature(1, "scamp", "Scamp") };
    assert.ok(addBuiltin(scamp, { builtin: "fast-healing", value: 2, when: ["fast-healing"] }, "Fast Healing 2 (Test Terrain)"));
    assert.equal(fastHealingNow(null, scamp), 0);
    assert.equal(fastHealingNow(null, { ...scamp, rollOptions: ["fast-healing"] }), 2);
    // An effect it has turns it off; the fight's terrain turns it on.
    const cap = { ...moderateCreature(5, "redcap", "Redcap") };
    assert.ok(addBuiltin(cap, { builtin: "fast-healing", value: 10, when: [{ not: "self:effect:lost-red-cap" }] }, "Fast Healing 10"));
    assert.equal(fastHealingNow(null, cap), 10);
    assert.equal(fastHealingNow(null, { ...cap, effects: [{ model: { name: "Lost Red Cap", fastHealing: 0 } }] }), 0);
    const coral = { ...moderateCreature(5, "coral", "Coral") };
    assert.ok(addBuiltin(coral, { builtin: "fast-healing", value: 5, when: ["terrain:underwater"] }, "Fast Healing 5 (While Underwater)"));
    assert.equal(fastHealingNow(null, coral), 0);
    assert.equal(fastHealingNow({ environment: { options: ["terrain:underwater"] } }, coral), 5);
    // Regeneration the same way.
    const mask = { ...moderateCreature(5, "mask", "Masked") };
    assert.ok(addBuiltin(mask, { builtin: "regeneration", value: 20, deactivatedBy: ["cold"], when: ["mask-of-power"] }, "Regeneration 20 (Deactivated by Cold)"));
    assert.equal(regenerating(mask), false);
    assert.equal(regenerating({ ...mask, rollOptions: ["mask-of-power"] }), true);
    // In a fight: the fight's own state counts too.
    const state = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), { ...coral, engagement: 1 }] }, {}, 1);
    state.environment = { options: ["terrain:underwater"] };
    assert.equal(fastHealingNow(state, state.byId.get("coral")), 5);
});

test("I1–I2 custom exceptions: a vampire's resistance except magical silver; a magic immunity except named spells", () => {
    target = { resistances: [{ type: "physical", value: 7, exceptions: [{ definition: ["item:magical", { or: ["damage:material:dawnsilver", "damage:material:silver"] }], label: "Magical silver" }] }] };
    const silver = (traits) => strikeContext({}, { iwr: { traits, materials: ["silver"] } });
    assert.equal(hit(silver([]), { type: "piercing", amount: 10, weapon: true }).total, 3);
    assert.equal(hit(silver(["magical"]), { type: "piercing", amount: 10, weapon: true }).total, 10);
    const wisp = { immunities: ["magic"], immunityExceptions: { magic: [{ definition: ["item:type:spell", { or: ["item:slug:test-missile"] }] }] } };
    assert.equal(effectImmunity(wisp, { ...blast(), name: "Test Missile" }), null);
    assert.equal(effectImmunity(wisp, { ...blast(), name: "Test Blast" }), "magic");
});
