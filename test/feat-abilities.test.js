import test from "node:test";
import assert from "node:assert/strict";

import { featEntries, mappedRequirement, meetsWielding, withResolvedEffects, worthSomething } from "../src/engine/feat-abilities.js";
import { standardParty } from "../src/engine/party.js";
import { simulate } from "../src/engine/fight.js";
import { powerFoes } from "../src/engine/spell-power.js";

const info = (name, actionType = "action", actions = 1, extra = {}) => ({ name, id: name, actionType, actions, frequency: null, traits: [], level: 5, ...extra });

test("a feat module Strike activity: an action's, its requirement checked; a plain Strike, a reaction's and an unread requirement are gaps", () => {
    const charge = { builtin: "strike-activity", actions: 2, strides: 2, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, onHit: { conditions: [], damage: [] }, plain: true };
    const builtins = {};
    const played = featEntries(charge, info("Sudden Charge", "action", 2), builtins);
    assert.equal(played.gap, null);
    assert.equal(builtins.strikeActivities.length, 1);
    assert.equal(builtins.strikeActivities[0].strides, 2);
    assert.match(featEntries({ ...charge, strides: 0 }, info("Plain"), {}).gap.name, /nothing more/);
    assert.match(featEntries(charge, info("Sailfish", "reaction"), {}).gap.name, /reaction's Strike/);
    assert.match(featEntries({ ...charge, requires: "Your nimbus is active." }, info("Army of One", "action", 3), {}).gap.name, /requirement/);
    // (A requirement the PC's weapons meet: played, with no requirement left.)
    const brutish = {};
    assert.equal(featEntries({ ...charge, requires: "You are wielding a two-handed melee weapon." }, info("Brutish Shove", "action", 1), brutish, { meets: (text) => meetsWielding(text, { twoHanded: true }) }).gap, null);
    assert.equal(brutish.strikeActivities[0].requires, null);
    // (One the planner checks under its own name.)
    const grab = {};
    featEntries({ ...charge, requires: "You have a creature grabbed or restrained." }, info("Grab On"), grab);
    assert.equal(grab.strikeActivities[0].requires, "grabbed");
});

test("checks and saves used as actions are abilities; their pool by frequency; a passive's or a reaction's roll is a gap", () => {
    const save = { resolution: { kind: "save", check: { statistic: "fortitude" }, outcomes: {} }, trigger: { event: "use" } };
    const entries = featEntries(save, info("Dust Cloud", "action", 1, { frequency: { max: 1, per: "PT1M" } }), {});
    assert.equal(entries.spells.length, 1);
    assert.equal(entries.spells[0].kind, "ability");
    assert.equal(entries.spells[0].pool, "frequency:Dust Cloud");
    assert.equal(entries.pools["frequency:Dust Cloud"], 1);
    assert.match(featEntries(save, info("Aura", "passive"), {}).gap.name, /passive's roll/);
    assert.match(featEntries({ ...save, trigger: { event: "hit-by" } }, info("Riposte", "reaction"), {}).gap.name, /reaction/);
    assert.match(featEntries({ ...save, requirementUnread: "Your waking world is active" }, info("Dream"), {}).gap.name, /requirement/);
});

test("the module's own Effect from a feat's rules is a self effect (a stance's lasts); a timer, an ally's toggle and an empty one are gaps", () => {
    const rules = [{ key: "FlatModifier", selector: "ac", value: 1, type: "circumstance" }];
    const model = { name: "Guard", rounds: 1, modifiers: [{ on: "ac", value: 1, type: "circumstance" }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
    const builtins = {};
    const entries = featEntries({ builtin: "feat-effect", effect: { name: "Guard", rules, stance: true } }, info("Guard Stance"), builtins, { rulesModel: () => model });
    assert.equal(entries.played, "stance");
    assert.equal(builtins.selfEffects[0].stance, true);
    assert.equal(builtins.selfEffects[0].model.rounds, Infinity);
    assert.match(featEntries({ builtin: "feat-effect", timer: true, effect: { name: "T", rules: [] } }, info("Timer"), {}).gap.name, /timer/);
    assert.match(featEntries({ builtin: "feat-effect", who: "target", effect: { name: "P", rules } }, info("Protect"), {}, { rulesModel: () => model }).gap.name, /another creature/);
    assert.match(featEntries({ builtin: "feat-effect", effect: { name: "E", rules } }, info("Empty"), {}, { rulesModel: () => ({ name: "E", rounds: 1, modifiers: [], unsupported: [] }) }).gap.name, /nothing a fight counts/);
    assert.equal(worthSomething({ name: "x", rounds: 2, modifiers: [], unsupported: ["Note"] }), false);
});

test("a passive's PF2e Effect is on from the start (free, lasting); the feat module's teleports and rerolls are gaps; builtins go to addBuiltin", () => {
    const model = { name: "Formation", rounds: 10, modifiers: [{ on: "ac", value: 1, type: "circumstance" }], unsupported: [] };
    const builtins = {};
    const entries = featEntries({ builtin: "passive-effect", who: "you", effect: "Compendium.pf2e.feat-effects.Item.x" }, info("Formation Training", "passive"), builtins, { passiveModel: () => model });
    assert.equal(entries.situational, true);
    assert.equal(builtins.selfEffects[0].actions, 0);
    assert.equal(builtins.selfEffects[0].model.rounds, Infinity);
    assert.match(featEntries({ builtin: "teleport" }, info("Dart Between"), {}).gap.name, /teleport/);
    assert.match(featEntries({ builtin: "reroll" }, info("Lucky"), {}).gap.name, /reroll/);
    const saves = {};
    featEntries({ builtin: "save-bonus", bonuses: [{ saves: ["will"], value: 1, type: "circumstance", predicate: ["fear"] }] }, info("Brave", "passive"), saves);
    assert.equal(saves.saveBonuses.length, 1);
});

test("requirements in the feat's words: mapped to the planner's, or met by what the PC wields", () => {
    assert.equal(mappedRequirement("You aren't Fatigued or raging"), "not-fatigued");
    assert.equal(mappedRequirement("You have a creature grabbed or restrained."), "grabbed");
    assert.equal(mappedRequirement("Your nimbus is active."), null);
    const fighter = { twoHanded: true, oneHanded: false, twoWeapons: false, freeHand: false, armor: "heavy", damage: ["slashing"], groups: ["sword"] };
    assert.equal(meetsWielding("You are wielding a melee weapon in two hands.", fighter), true);
    assert.equal(meetsWielding("You are wielding two melee weapons, each in a different hand.", fighter), false);
    assert.equal(meetsWielding("You are wearing medium or heavy armor.", fighter), true);
    assert.equal(meetsWielding("You have one hand free, and your target is within reach of that hand.", fighter), false);
    assert.equal(meetsWielding("You have one hand free, and your target is within reach of that hand.", { ...fighter, freeHand: true }), null, "more than the hand");
    assert.equal(meetsWielding("Your nimbus is active.", fighter), null);
});

test("Effects linked by name are resolved to ids", () => {
    const plan = { resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: "Compendium.pf2e.feat-effects.Item.Stance: Disarming Stance" }] } };
    const fixed = withResolvedEffects(plan, (uuid) => (/Disarming/.test(uuid) ? "Compendium.pf2e.feat-effects.Item.AAAAAAAAAAAAAAAA" : null));
    assert.equal(fixed.resolution.applications[0].uuid, "Compendium.pf2e.feat-effects.Item.AAAAAAAAAAAAAAAA");
});

test("a fight plays a feat's Strike activity and its self effect for a PC", () => {
    const party = standardParty(5);
    const fighter = party.find((c) => c.id === "fighter");
    featEntries({ builtin: "strike-activity", actions: 2, strides: 2, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, onHit: { conditions: [], damage: [] } }, info("Sudden Charge", "action", 2), fighter);
    let used = 0;
    for (let seed = 1; seed <= 20; seed++) {
        const result = simulate({ combatants: [...party, ...powerFoes("boss", 5)] }, { morale: false, retreat: false }, seed, { log: true });
        used += result.log.filter((line) => /Sudden Charge/.test(line)).length;
    }
    assert.ok(used > 0, "the fighter Sudden Charges in some fights");
});

test("a Strike feat's press trait: only after an attack this turn (Exacting Strike, found in the Foundry test opening turns)", () => {
    const builtins = {};
    featEntries({ builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, exacting: true, traits: ["fighter", "press"], onHit: { conditions: [], damage: [] } }, info("Exacting Strike"), builtins);
    assert.equal(builtins.strikeActivities[0].press, true);
});
