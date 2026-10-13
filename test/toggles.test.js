import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyCondition } from "../src/engine/spells.js";
import { applyEffect } from "../src/engine/effects.js";
import { chooseToggles, toggleWays } from "../src/engine/toggles.js";

// B307 (2026-10-13; the user's call: "work through your recommendations in order", item 2): choices PF2e holds as roll options.
const ways = (option, values) => ({ builtin: "modes", actions: 1, modes: values.map((value) => ({ name: value, plan: { builtin: "roll-option", option, suboption: value.toLowerCase(), value: true } })) });

test("B307 a toggle's ways from the creature's rules: resistances, extra dice, a chosen value filled in; a choice with a way it can't read isn't offered", () => {
    const items = [
        { name: "Adapt", system: { rules: [{ key: "RollOption", option: "adapt", toggleable: true, suboptions: [{ value: "silver" }, { value: "iron" }] }, { key: "Resistance", type: "physical", value: 10, exceptions: ["silver"], predicate: ["adapt:silver"] }, { key: "Resistance", type: "physical", value: 10, exceptions: ["cold-iron"], predicate: ["adapt:iron"] }] } },
        { name: "Element", system: { rules: [{ key: "DamageDice", selector: "strike-damage", diceNumber: 1, dieSize: "d6", damageType: "fire", predicate: ["element:fire"] }, { key: "DamageDice", selector: "strike-damage", diceNumber: 1, damageType: "cold", predicate: ["element:cold"] }] } },
        { name: "Pick", system: { rules: [{ key: "Resistance", type: "{item|flags.system.rulesSelections.pickWard}", value: 15, predicate: ["pick-ward"] }, { key: "ActiveEffectLike", mode: "override", path: "flags.system.pickWard", value: "x", predicate: ["pick-ward"] }] } },
        { name: "Swap", system: { rules: [{ key: "ItemAlteration", property: "traits", value: "reach", predicate: ["swap:long"] }, { key: "FlatModifier", selector: "ac", value: 1, predicate: ["swap:short"] }] } }
    ];
    const [adapt] = toggleWays(items, ways("adapt", ["Silver", "Iron"]), "Adapt");
    assert.deepEqual(adapt.ways.map((way) => [way.name, way.model.resistances]), [["Silver", [{ type: "physical", value: 10, exceptions: ["silver"] }]], ["Iron", [{ type: "physical", value: 10, exceptions: ["cold-iron"] }]]]);
    const [element] = toggleWays(items, ways("element", ["Fire", "Cold"]), "Element");
    assert.deepEqual(element.ways.map((way) => way.parts), [[{ formulas: ["1d6[fire]"], scope: "all" }], [{ formulas: ["die[cold]"], scope: "all" }]]);
    const [pick] = toggleWays(items, ways("pick-ward", ["Acid", "Fire"]), "Pick");
    assert.deepEqual(pick.ways.map((way) => way.model.resistances[0].type), ["acid", "fire"]);
    assert.equal(toggleWays(items, ways("swap", ["Long", "Short"]), "Swap"), null);
});

test("B307 as the fight starts, the best way against these foes: a resistance to the damage they deal, extra dice of a type they're weak to", () => {
    const party = martialParty(5);
    const defender = { ...moderateCreature(5, "defender", "Defender"), toggles: [{ name: "Ward", ways: [
        { name: "Fire", model: { name: "Ward (Fire)", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [{ type: "fire", value: 10, exceptions: [] }], weaknesses: [], immunities: [], conditions: [] }, parts: [] },
        { name: "Physical", model: { name: "Ward (Physical)", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [{ type: "physical", value: 10, exceptions: [] }], weaknesses: [], immunities: [], conditions: [] }, parts: [] }
    ] }] };
    const state = createFightState({ combatants: [...party, defender] }, {}, 1);
    state.log = [];
    chooseToggles(state, { applyEffect, applyCondition });
    const c = state.byId.get("defender");
    assert.ok(state.log.includes("  Defender uses Ward: Physical"), state.log.join("\n"));
    assert.ok(c.resistances.some((entry) => entry.type === "physical" && entry.value === 10));
    // Extra dice: the type its foe is weak to.
    const striker = { ...moderateCreature(5, "jann", "Jann"), toggles: [{ name: "Element", ways: [{ name: "Fire", model: { name: "Element (Fire)", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [] }, parts: [{ formulas: ["1d6[fire]"], scope: "all" }] }, { name: "Cold", model: { name: "Element (Cold)", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [] }, parts: [{ formulas: ["1d6[cold]"], scope: "all" }] }] }] };
    const chilly = party.map((pc) => ({ ...pc, weaknesses: [{ type: "cold", value: 5, exceptions: [] }] }));
    const { log } = simulate({ combatants: [...chilly, striker] }, { roundCap: 1 }, 1, { log: true });
    assert.ok(log.includes("  Jann uses Element: Cold"), log.slice(0, 5).join("\n"));
});
