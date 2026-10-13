import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { performStrike, reactionStrikeAt } from "../src/engine/actions.js";
import { addBuiltin } from "../src/engine/abilities.js";
import { applyEffect } from "../src/engine/effects.js";
import { scoreOptions } from "../src/engine/planner.js";
import { markParts } from "../src/engine/toggles.js";

// B308 (2026-10-13; the user's call: "work through your recommendations in order", item 3): abilities the simulation had no way to play.

test("B308 a shell: offered only badly hurt in a foe's reach, the rest of its turn in it, an action to come out", () => {
    const [fighter] = martialParty(5);
    const turtle = { ...moderateCreature(5, "turtle", "Turtle"), engagement: 1 };
    assert.ok(addBuiltin(turtle, { builtin: "self-effect", actions: 1, model: { name: "Test Shell", rounds: null, modifiers: [{ on: "ac", type: "circumstance", value: 4 }], tempHp: 0, resistances: [{ type: "physical", value: 10, exceptions: [] }] }, stance: true, shell: true }, "Test Shell"));
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, turtle] }, {}, 1);
    const c = state.byId.get("turtle");
    c.actionsLeft = 3;
    const shells = () => scoreOptions(state, c).options.filter((option) => option.action?.type === "selfEffect");
    assert.equal(shells().length, 0, "unhurt");
    c.hp.value = Math.floor(c.hp.max * 0.3);
    const [offer] = shells();
    assert.equal(offer?.action.actions, 3, "the rest of its turn");
    performAction(state, c, offer.action);
    assert.equal(c.inShell, true);
    assert.ok(c.resistances.some((entry) => entry.type === "physical" && entry.value === 10));
});

test("B308 a riposte only in its parry stance; a teleport only from a holy Strike; Reflect Spell on spell attacks only; Smite's damage on its mark", () => {
    const [fighter] = martialParty(5);
    const duelist = { ...moderateCreature(5, "duelist", "Duelist"), engagement: 1 };
    assert.ok(addBuiltin(duelist, { builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, requires: "requirement", requiresEffect: "Twin Parry" }, "Twin Riposte"));
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, duelist] }, {}, 1);
    const d = state.byId.get("duelist");
    const pc = state.byId.get("fighter");
    assert.equal(reactionStrikeAt(state, d, pc, d.reactionStrikes[0], "critical-miss"), null, "no parry");
    applyEffect(state, d, { name: "Effect: Twin Parry", rounds: 1, modifiers: [{ on: "ac", type: "circumstance", value: 1 }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [] }, d);
    assert.notEqual(reactionStrikeAt(state, d, pc, d.reactionStrikes[0], "critical-miss"), null, "while it parries");
    // Instinctive Teleportation: only a holy Strike's damage.
    const fiend = { ...moderateCreature(5, "fiend", "Fiend"), engagement: 1 };
    assert.ok(addBuiltin(fiend, { builtin: "withdraw", on: "damaged", damageTrait: "holy", move: "Teleport", feet: 60, safe: true }, "Test Blink"));
    const fight = createFightState({ combatants: [{ ...fighter, engagement: 1 }, fiend] }, {}, 1);
    const f = fight.byId.get("fiend");
    const hero = fight.byId.get("fighter");
    fight.acting = hero.id;
    hero.actionsLeft = 2;
    fight.rng.d20 = () => 19;
    performStrike(fight, hero, f, hero.strikes[0]);
    assert.ok(!fight.log.some((line) => /uses Test Blink/.test(line)), "an ordinary Strike");
    performStrike(fight, hero, f, { ...hero.strikes[0], holy: true });
    assert.ok(fight.log.some((line) => /Fiend uses Test Blink/.test(line)), fight.log.join("\n"));
    // Smite: +4 status damage, +8 against an unholy creature.
    const parts = markParts([{ name: "Smite", system: { rules: [{ key: "RollOption", option: "smite", toggleable: true }, { key: "FlatModifier", predicate: ["smite"], selector: "damage", slug: "smite-damage", type: "status", value: 4 }, { key: "AdjustModifier", mode: "upgrade", predicate: ["target:trait:unholy"], selector: "damage", slug: "smite-damage", value: 8 }] } }], "smite");
    assert.deepEqual(parts, [{ dice: 0, die: 0, bonus: 4, type: null, slug: "smite-damage", upgrade: { trait: "unholy", value: 8 } }]);
    assert.deepEqual(markParts([{ name: "Punish", system: { rules: [{ key: "FlatModifier", predicate: ["punish", "action:seek"], selector: "perception", value: 2 }] } }], "punish"), []);
});

test("B308 Reflect Spell: its AC higher against a ranged spell attack, as a reaction; never against a Strike", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const bolt = { modelVersion: 12, source: { name: "Test Bolt" }, rank: 1, traits: ["attack", "fire"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "60 feet", area: null },
        resolution: { kind: "save", check: { statistic: "spell-attack" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "2d6", type: "fire" }] }, outcomes: { criticalSuccess: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: none, effects: [] }, criticalFailure: { damage: none, effects: [] } } } };
    const drake = { ...moderateCreature(5, "drake", "Drake"), band: "near" };
    assert.ok(addBuiltin(drake, { builtin: "ac-reaction", value: 4, when: "targeted", against: "ranged", spellOnly: true }, "Test Wing"));
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", band: "near", spells: [{ name: "Test Bolt", plan: bolt, castRank: 1, dc: 22, attack: 14, pool: null }] };
    const state = createFightState({ combatants: [mage, drake] }, {}, 1);
    castSpell(state, state.byId.get("mage"), 0, ["drake"]);
    assert.ok(state.log.some((line) => /Drake uses Test Wing: \+4 AC against Test Bolt/.test(line)), state.log.join("\n"));
    // A Strike: not.
    const [fighter] = martialParty(5);
    const fight = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...drake, engagement: 1 }] }, {}, 1);
    performStrike(fight, fight.byId.get("fighter"), fight.byId.get("drake"), fight.byId.get("fighter").strikes[0]);
    assert.ok(!fight.log.some((line) => /Test Wing/.test(line)));
});
