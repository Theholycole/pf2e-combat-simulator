import test from "node:test";
import assert from "node:assert/strict";

import { applyEffect, effectBenefit, effectModel, numericValue, removeEffect } from "../src/engine/effects.js";
import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { armorClass, saveModifier, statusPenalty } from "../src/engine/combatant.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyCondition, castSpell, expireTimers, spellGaps } from "../src/engine/spells.js";

// PF2e spell-effect items, as their rules read in the pf2e system's packs.
const PROTECTION = { name: "Spell Effect: Protection", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "FlatModifier", selector: ["ac", "saving-throw"], type: "status", value: 1 }] } };
const HEROISM = { name: "Spell Effect: Heroism", system: { duration: { unit: "minutes", value: 10 }, rules: [{ key: "FlatModifier", selector: ["attack", "saving-throw", "skill-check", "perception"], type: "status", value: "ternary(gte(@item.level,9),3,ternary(gte(@item.level,6),2,1))" }] } };
const MYSTIC_ARMOR = { name: "Spell Effect: Mystic Armor", system: { duration: { unit: "days", value: 1 }, rules: [
    { key: "FlatModifier", selector: "ac", type: "item", value: "ternary(gte(@item.level,10),3,ternary(gte(@item.level,6),2,1))" },
    { key: "FlatModifier", predicate: [{ gte: ["parent:level", 4] }], selector: "saving-throw", type: "item", value: "ternary(gte(@item.level,10),3,ternary(gte(@item.level,8),2,1))" },
    { key: "DexterityModifierCap", value: 5 }
] } };
const FALSE_VITALITY = { name: "Spell Effect: False Vitality", system: { duration: { unit: "hours", value: 8 }, rules: [{ key: "TempHP", value: "10 + (@item.level - 2) * 3" }] } };
const HASTE = { name: "Spell Effect: Haste", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "GrantItem", uuid: "Compendium.pf2e.conditionitems.Item.nlCjDvLMf2EkV2dl", inMemoryOnly: true }] } };
const ANTHEM = { name: "Spell Effect: Courageous Anthem", system: { duration: { unit: "rounds", value: 1 }, rules: [
    { key: "FlatModifier", selector: ["attack-roll", "damage"], type: "status", value: 1 },
    { key: "FlatModifier", predicate: ["fear"], selector: "saving-throw", type: "status", value: 1 },
    { key: "DamageDice", selector: "strike-damage", diceNumber: 1, dieSize: "d6", predicate: ["parent:origin:discordant-voice"] }
] } };
const FORM = { name: "Spell Effect: Animal Form", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "BattleForm", value: {} }, { key: "Resistance", type: "fire", value: 5 }] } };
const conditionSlug = (uuid) => ({ "Compendium.pf2e.conditionitems.Item.nlCjDvLMf2EkV2dl": "quickened" })[uuid] ?? null;

test("values: numbers and rank formulas", () => {
    assert.equal(numericValue(2, 1), 2);
    assert.equal(numericValue("10 + (@item.level - 2) * 3", 4), 16);
    assert.equal(numericValue("ternary(gte(@item.level,6),2,1)", 6), 2);
    assert.equal(numericValue("1d6", 1), null, "dice aren't a flat value");
});

test("models: modifiers by selector and rank, level predicates, granted conditions, what's left out", () => {
    assert.deepEqual(effectModel(PROTECTION).modifiers.map((m) => `${m.on} ${m.type} ${m.value}`), ["ac status 1", "fortitude status 1", "reflex status 1", "will status 1"]);
    assert.equal(effectModel(PROTECTION).rounds, 10);
    assert.deepEqual(effectModel(HEROISM, { rank: 6 }).modifiers.filter((m) => m.on === "attack").map((m) => m.value), [2]);
    assert.equal(effectModel(MYSTIC_ARMOR, { rank: 1 }).modifiers.length, 1, "no save bonus before rank 4");
    assert.deepEqual(effectModel(MYSTIC_ARMOR, { rank: 6 }).modifiers.map((m) => `${m.on} ${m.type} ${m.value}`), ["ac item 2", "fortitude item 1", "reflex item 1", "will item 1"]);
    assert.equal(effectModel(MYSTIC_ARMOR, { rank: 6 }).rounds, Infinity);
    assert.equal(effectModel(FALSE_VITALITY, { rank: 4 }).tempHp, 16);
    assert.deepEqual(effectModel(HASTE, { conditionSlug }).conditions, [{ slug: "quickened", value: null }]);
    const anthem = effectModel(ANTHEM);
    assert.deepEqual(anthem.modifiers.map((m) => `${m.on} ${m.value}`), ["attack 1", "damage 1"]);
    // (2026-10-15: the fear-only save bonus is played, as a save bonus against fear effects; Discordant Voice's dice stay conditional,
    // reported among what's left out.)
    assert.deepEqual(anthem.saveBonuses, [{ saves: ["fortitude", "reflex", "will"], type: "status", value: 1, predicate: ["item:trait:fear"] }]);
    assert.equal(anthem.situational, 1, "Discordant Voice's dice");
    assert.deepEqual(anthem.unsupported, ["DamageDice (conditional)"]);
    // (2026-10-22, family 6: a battle form is played — applyEffect's enterForm.)
    assert.deepEqual(effectModel(FORM).unsupported, []);
    assert.ok(effectModel(FORM).battleForm);
});

test("stacking: the best bonus of a type, untyped ones add, status penalties join the conditions'", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...moderateCreature(5, "foe", "Foe"), band: "near" }] });
    const pc = state.byId.get("fighter");
    const ac = armorClass(pc);
    applyEffect(state, pc, effectModel(PROTECTION), pc);
    applyEffect(state, pc, effectModel({ name: "Other", system: { rules: [{ key: "FlatModifier", selector: "ac", type: "status", value: 2 }, { key: "FlatModifier", selector: "ac", type: "circumstance", value: 1 }] } }), pc);
    assert.equal(armorClass(pc), ac + 2 + 1, "status +2 beats status +1; circumstance adds");
    assert.equal(saveModifier(pc, "will"), martialParty(5)[0].saves.will + 1);
    applyEffect(state, pc, effectModel({ name: "Hex", system: { rules: [{ key: "FlatModifier", selector: "ac", type: "status", value: -2 }] } }), pc);
    pc.cond.frightened = 1;
    assert.equal(statusPenalty(pc, "ac"), 2, "the worse status penalty only");
});

test("defences: an effect's resistance is added without touching the shared snapshot, and leaves with it", () => {
    const [fighter] = martialParty(5);
    const spec = { ...fighter, band: "near", resistances: [{ type: "cold", value: 3 }] };
    const state = createFightState({ combatants: [spec, { ...moderateCreature(5, "foe", "Foe"), band: "near" }] });
    const pc = state.byId.get("fighter");
    const effect = applyEffect(state, pc, effectModel(FORM), pc);
    assert.deepEqual(pc.resistances.map((r) => r.type), ["cold", "fire"]);
    assert.equal(spec.resistances.length, 1);
    removeEffect(pc, effect);
    assert.deepEqual(pc.resistances.map((r) => r.type), ["cold"]);
});

test("temporary HP, granted conditions, and the end of the duration", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...moderateCreature(5, "foe", "Foe"), band: "near" }] });
    const pc = state.byId.get("fighter");
    applyEffect(state, pc, effectModel(FALSE_VITALITY, { rank: 4 }), pc);
    assert.equal(pc.hp.temp, 16);
    applyEffect(state, pc, effectModel(HASTE, { conditionSlug }), pc, { applyCondition });
    assert.equal(pc.cond.quickened, true);
    applyEffect(state, pc, effectModel(ANTHEM), pc);
    assert.equal(pc.effects.length, 3);
    state.round += 1;
    expireTimers(state, pc);
    assert.deepEqual(pc.effects.map((effect) => effect.model.name), ["Spell Effect: False Vitality", "Spell Effect: Haste"], "the anthem's round is over");
});

test("benefit: buffs help, hindrances hurt", () => {
    const pc = { strikes: [{}], hp: { max: 60 } };
    const harm = () => 0.5;
    assert.ok(effectBenefit(effectModel(HEROISM, { rank: 3 }), pc, harm) > 0);
    assert.ok(effectBenefit(effectModel(HASTE, { conditionSlug }), pc, harm) > 0.5);
    assert.ok(effectBenefit(effectModel({ name: "Curse", system: { rules: [{ key: "FlatModifier", selector: "attack", type: "status", value: -2 }] } }), pc, harm) < 0);
});

test("a bard casts Heroism on the fighter, not the foe; the buff counts in the fight", () => {
    const [fighter, champion] = martialParty(5);
    const heroismPlan = { modelVersion: 12, source: { name: "Heroism" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { target: "1 creature", range: "touch" }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: "Compendium.pf2e.spell-effects.Item.l9HRQggofFGIxEse" }] } };
    const bard = { ...champion, id: "bard", name: "Bard", spells: [{ name: "Heroism", plan: heroismPlan, castRank: 3, dc: 22, attack: 12, pool: "slot3", effects: { "Compendium.pf2e.spell-effects.Item.l9HRQggofFGIxEse": effectModel(HEROISM, { rank: 3 }) } }], spellPools: { slot3: 1 } };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...bard, engagement: 1 }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] });
    const caster = state.byId.get("bard");
    caster.actionsLeft = 3;
    const casts = scoreOptions(state, caster).options.filter((option) => option.action.type === "cast");
    assert.ok(casts.length > 0);
    assert.ok(casts.every((option) => option.action.targetIds.every((id) => id !== "foe")), "never on the foe");
    assert.deepEqual(spellGaps(caster.spells[0]), []);
    const pc = state.byId.get("fighter");
    const will = saveModifier(pc, "will");
    castSpell(state, caster, 0, ["fighter"]);
    assert.equal(saveModifier(pc, "will"), will + 1);
});

test("a caster puts Haste on the fighter, not on itself: an extra Strike helps a warrior most", async () => {
    const { computeThreats } = await import("../src/engine/planner.js");
    const [fighter, champion] = martialParty(5);
    const hastePlan = { modelVersion: 12, source: { name: "Haste" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: "Compendium.pf2e.spell-effects.Item.ElkXovNrHB0Doi6O" }] } };
    const fireballRows = Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree, index) => [degree, { damage: index ? { mode: "shared", multiplier: [0, 0.5, 1, 2][index], sourceComponentIds: ["0"] } : { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }]));
    const fireballPlan = { modelVersion: 12, source: { name: "Fireball" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { range: "500 feet", area: { type: "burst", value: 20 } }, resolution: { kind: "save", check: { statistic: "reflex", basic: true }, sharedDamage: { components: [{ id: "0", formula: "6d6", type: "fire" }] }, outcomes: fireballRows } };
    const wizard = { ...champion, id: "wizard", name: "Wizard", strikes: [{ name: "Staff", bonus: 8, melee: true, agile: false, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] }],
        spells: [{ name: "Haste", plan: hastePlan, castRank: 3, dc: 22, attack: 12, pool: "slot3a", effects: { "Compendium.pf2e.spell-effects.Item.ElkXovNrHB0Doi6O": effectModel(HASTE, { rank: 3, conditionSlug }) } }, { name: "Fireball", plan: fireballPlan, castRank: 3, dc: 22, attack: 12, pool: "slot3b" }],
        spellPools: { slot3a: 1, slot3b: 1 } };
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...wizard, band: "near" }, { ...moderateCreature(5, "foe", "Foe"), band: "far" }] });
    computeThreats(state);
    const caster = state.byId.get("wizard");
    assert.ok(state.strikeShare.get("wizard") < 0.5, "the wizard's threat is its Fireball");
    caster.actionsLeft = 3;
    const hastes = scoreOptions(state, caster).options.filter((option) => option.action.type === "cast" && option.action.spellIndex === 0).sort((a, b) => b.value - a.value);
    assert.deepEqual(hastes[0].action.targetIds, ["fighter"]);
});

test("Bless (left to PF2e's card, with native applications): the cleric blesses itself and the allies near it", () => {
    const BLESS = { name: "Spell Effect: Bless", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "FlatModifier", selector: "attack-roll", type: "status", value: 1 }] } };
    const uuid = "Compendium.pf2e.spell-effects.Item.Gqy7K6FnbLtwGpud";
    const blessPlan = { modelVersion: 12, source: { name: "Bless" }, rank: 1, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { target: "you and allies in the area", range: null, area: { type: "emanation", value: 15 } }, resolution: { kind: "unsupported", native: { applications: [{ kind: "native-spell-effect", uuid, recipients: "allies-in-area", area: { type: "emanation", value: 15 } }] } } };
    const [fighter, champion, ranger] = martialParty(5);
    const cleric = { ...champion, id: "cleric", name: "Cleric", spells: [{ name: "Bless", plan: blessPlan, castRank: 1, dc: 20, attack: 10, pool: "slot1", effects: { [uuid]: effectModel(BLESS) } }], spellPools: { slot1: 1 } };
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...ranger, band: "near" }, { ...cleric, band: "near" }, { ...moderateCreature(5, "foe", "Foe"), band: "far" }] });
    assert.deepEqual(spellGaps(state.byId.get("cleric").spells[0]), []);
    const c = state.byId.get("cleric");
    c.actionsLeft = 3;
    const bless = scoreOptions(state, c).options.find((option) => option.action.type === "cast");
    assert.ok(bless, "Bless is worth casting");
    assert.deepEqual([...bless.action.targetIds].sort(), ["cleric", "fighter", "ranger"]);
    castSpell(state, c, 0, bless.action.targetIds);
    assert.equal(state.byId.get("fighter").effects.length, 1);
    assert.equal(state.byId.get("foe").effects.length, 0);
});

// B315 (2026-10-14; the user asked about the Grim Reaper): a constant spell is on from the fight's start, for good, and never cast in it.
test("B315 a constant Haste: the creature is quickened as the fight starts, for good, and never spends actions casting it", async () => {
    const { simulate } = await import("../src/engine/fight.js");
    const uuid = "Compendium.pf2e.spell-effects.Item.ElkXovNrHB0Doi6O";
    const hastePlan = { modelVersion: 12, source: { name: "Haste" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid }] } };
    const reaper = { ...moderateCreature(8, "reaper", "Reaper"), spells: [{ name: "Haste (Constant)", plan: hastePlan, castRank: 3, dc: 25, attack: 15, pool: null, effects: { [uuid]: effectModel(HASTE, { rank: 3, conditionSlug }) } }] };
    const { log } = simulate({ combatants: [...martialParty(5), reaper] }, {}, 1, { log: true });
    const start = log.indexOf("— Round 1 —");
    assert.ok(log.slice(0, start).includes("  Reaper gains Haste"), "on before the first round");
    assert.equal(log.slice(start).filter((line) => /Reaper casts Haste/.test(line)).length, 0, "never cast in the fight");
    const state = createFightState({ combatants: [...martialParty(5), reaper] }, {}, 1);
    const { applyConstantSpells } = await import("../src/engine/spells.js");
    applyConstantSpells(state);
    const r = state.byId.get("reaper");
    assert.equal(r.cond.quickened, true);
    assert.equal((r.timers ?? []).length, 0, "no timer ends it");
});
