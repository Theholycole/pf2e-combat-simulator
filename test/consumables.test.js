import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { castSpell, targetSets } from "../src/engine/spells.js";
import { chooseAction, computeThreats, scoreOptions } from "../src/engine/planner.js";
import { effectModel } from "../src/engine/effects.js";
import { itemEntry } from "../src/adapter/items.js";
import { CONSUMABLE_MARGIN, consumableWeight, expectedIncoming, goingDown } from "../src/engine/consumables.js";

// U1 (2026-10-15), consumables. The user: "monsters should use their items freely. Players should use rechargeable or reusable items
// freely but consumables should be weighted to be used when they provide significant more value than other options. Healing items
// should be used freely if they are projected to go down soon or if they are used on another player that is already down."
// (Plans in the item module's shape: compileItem's for a healing potion and an elixir.)
const itemInfo = (category, level, extra = {}) => ({ type: "consumable", category, level, uses: { max: 1, autoDestroy: true }, recipient: "drinker", delivery: null, pf2eRoll: null, activations: [{ name: null, time: "1", traits: ["manipulate"] }], ...extra });
const POTION = { modelVersion: 13, source: { name: "Test Potion", slug: "test-potion", uuid: "Compendium.pf2e.equipment-srd.Item.testpotion000001", type: "consumable" }, rank: 1, traits: ["consumable", "healing", "magical", "potion"], activation: { time: "1", traits: ["manipulate"] }, automation: { level: "automatic" }, targeting: { target: "the drinker", range: null, area: null }, trigger: { event: "use" },
    resolution: { kind: "healing", native: { healing: { components: [{ id: "healing", formula: "3d8+10", kinds: ["healing"] }], recipients: "living" } } }, item: itemInfo("potion", 6) };
const BUFF = "Compendium.pf2e.equipment-effects.Item.testelixir000001";
const ELIXIR = { modelVersion: 13, source: { name: "Test Elixir", slug: "test-elixir", uuid: "Compendium.pf2e.equipment-srd.Item.testelixir000002", type: "consumable" }, rank: 1, traits: ["alchemical", "consumable", "elixir"], activation: { time: "1", traits: ["alchemical", "consumable", "elixir"] }, automation: { level: "automatic" }, targeting: { target: null, range: null, area: null }, trigger: { event: "use" },
    resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: BUFF, label: "Effect: Test Elixir", recipients: "target" }] }, item: itemInfo("elixir", 5) };
const buffModel = () => effectModel({ name: "Effect: Test Elixir", system: { duration: { value: 1, unit: "minutes" }, rules: [{ key: "FlatModifier", selector: "attack", type: "item", value: 1 }] } }, { rank: 5 });

function setUp({ potions = 1, elixir = false, hp = null, monster = false } = {}) {
    const [fighter, second] = martialParty(5);
    const spells = [];
    const spellPools = {};
    const add = (plan, id, quantity, effects) => {
        const entry = itemEntry(plan, { id, quantity });
        spellPools[entry.pool] = entry.casts;
        spells.push({ ...entry, ...(effects ? { effects } : {}) });
    };
    if (potions) add(POTION, "potion", potions);
    if (elixir) add(ELIXIR, "elixir", 1, { [BUFF]: buffModel() });
    const pc = { ...fighter, band: "near", engagement: 1, spells: [...(fighter.spells ?? []), ...spells], spellPools: { ...(fighter.spellPools ?? {}), ...spellPools } };
    const ally = { ...second, band: "near", engagement: 1 };
    const brute = { ...moderateCreature(7, "brute", "Brute"), band: "near", engagement: 1 };
    const state = createFightState({ combatants: [pc, ally, brute] }, {}, 1);
    state.log = [];
    state.round = 1;
    const me = state.byId.get(fighter.id);
    me.actionsLeft = 3;
    if (hp !== null) me.hp.value = hp;
    computeThreats(state);
    return { state, pc: me, ally: state.byId.get(second.id), brute: state.byId.get("brute") };
}

test("U1: the item module's plan as one of the creature's actions — drunk or fed, its stack its uses, its draw; left to the table: snares, poisons on weapons, casts, notes", () => {
    const potion = itemEntry(POTION, { id: "p1", quantity: 3, draw: 1 });
    assert.deepEqual([potion.kind, potion.pool, potion.casts, potion.consumable, potion.drinker, potion.castRank, potion.draw], ["item", "item:p1", 3, true, true, 6, { actions: 1, each: true }]);
    assert.deepEqual([potion.plan.targeting.target, potion.plan.targeting.range], ["1 willing creature", "touch"]);
    // (Its own Activate line's traits: an elixir's manipulate.)
    assert.ok(itemEntry(ELIXIR, { id: "e" }).plan.activation.traits.includes("manipulate"));
    // A reusable one (its uses come back): not a consumable; after a rest, all its uses.
    const reusable = itemEntry({ ...POTION, item: { ...POTION.item, uses: { max: 3, autoDestroy: false } } }, { id: "r", uses: { max: 3, value: 1, autoDestroy: false }, fresh: true });
    assert.deepEqual([reusable.consumable, reusable.casts], [false, 3]);
    assert.equal(itemEntry({ ...POTION, item: { ...POTION.item, delivery: "injury", recipient: "user" } }, { id: "x" }), null);
    assert.equal(itemEntry({ ...POTION, item: { ...POTION.item, category: "snare" } }, { id: "x" }), null);
    assert.equal(itemEntry({ builtin: "cast-spell", item: POTION.item }, { id: "x" }), null);
    assert.equal(itemEntry({ ...POTION, noteOnly: true }, { id: "x" }), null);
    assert.equal(itemEntry(POTION, { id: "x", quantity: 0 }), null);
    // (A keg of black powder: 5,000 doses for firearms, one explosion.)
    assert.equal(itemEntry({ ...POTION, item: { ...POTION.item, uses: { max: 5000, autoDestroy: true } } }, { id: "k", quantity: 2, uses: { max: 5000, value: 4200, autoDestroy: true } }).casts, 2);
});

test("U1: drunk by itself or fed to an ally beside it, never a foe; a healing one to the hurt only, a downed PC too", () => {
    const { state, pc, ally, brute } = setUp({ elixir: true });
    const ctx = { enemies: [brute], allies: [ally], inMelee: (other) => other.meleeId === pc.meleeId, distance: () => 5, meleeId: pc.meleeId };
    const potion = pc.spells.find((spell) => spell.item === "potion");
    const elixir = pc.spells.find((spell) => spell.item === "elixir");
    const ids = (sets) => sets.map((set) => set.targets.map((target) => target.id).join());
    assert.deepEqual(ids(targetSets(state, pc, elixir, ctx)), [pc.id, ally.id]);
    // Nobody hurt: no healing.
    assert.deepEqual(ids(targetSets(state, pc, potion, ctx)), []);
    pc.hp.value -= 10;
    ally.status = "down";
    ally.hp.value = 0;
    ally.meleeId = null;
    assert.deepEqual(ids(targetSets(state, pc, potion, ctx)), [pc.id, ally.id]);
    // (Not a downed ally for a buff.)
    assert.deepEqual(ids(targetSets(state, pc, elixir, ctx)), [pc.id]);
});

test("U1: a PC's consumable weighs 1/1.5; a monster's, a reusable one's, and urgent healing (about to go down, or a downed PC) weigh in full", () => {
    const { state, pc, ally, brute } = setUp({ elixir: true });
    const potion = pc.spells.find((spell) => spell.item === "potion");
    const elixir = pc.spells.find((spell) => spell.item === "elixir");
    assert.equal(CONSUMABLE_MARGIN, 1.5);
    assert.equal(consumableWeight(state, pc, elixir, [pc]), 1 / 1.5);
    assert.equal(consumableWeight(state, brute, elixir, [brute]), 1);
    assert.equal(consumableWeight(state, pc, { ...elixir, consumable: false }, [pc]), 1);
    assert.equal(consumableWeight({ ...state, options: { consumableMargin: 2 } }, pc, elixir, [pc]), 0.5);
    // Healing: weighed while it's safe, in full once it's about to go down or for a downed PC.
    assert.equal(consumableWeight(state, pc, potion, [pc]), 1 / 1.5);
    const incoming = expectedIncoming(state, pc);
    assert.ok(incoming > 0, "the brute's threat, shared by the two beside it");
    pc.hp.value = Math.floor(incoming);
    assert.equal(goingDown(state, pc), true);
    assert.equal(consumableWeight(state, pc, potion, [pc]), 1);
    pc.hp.value = pc.hp.max;
    ally.status = "down";
    assert.equal(consumableWeight(state, pc, potion, [ally]), 1);
});

test("U1: a PC about to go down drinks its healing potion; one that's barely hurt keeps it and Strikes", () => {
    const low = setUp({ hp: 6 });
    assert.equal(goingDown(low.state, low.pc), true);
    const action = chooseAction(low.state, low.pc);
    assert.equal(action?.type, "cast", JSON.stringify(action));
    assert.equal(low.pc.spells[action.spellIndex].item, "potion");
    const fine = setUp();
    fine.pc.hp.value = fine.pc.hp.max - 12;
    assert.notEqual(chooseAction(fine.state, fine.pc)?.type, "cast");
});

test("U1: a PC feeds its healing potion to a downed ally; drinking and feeding are logged, the stack goes down", () => {
    const { state, pc, ally } = setUp({ potions: 2 });
    ally.status = "down";
    ally.hp.value = 0;
    ally.cond.dying = 1;
    ally.cond.unconscious = true;
    ally.meleeId = null;
    const action = chooseAction(state, pc);
    assert.equal(action?.type, "cast", JSON.stringify(action));
    assert.deepEqual(action.targetIds, [ally.id]);
    castSpell(state, pc, action.spellIndex, action.targetIds);
    assert.ok(state.log.some((line) => line.includes(`${pc.name} feeds Test Potion to ${ally.name}`)), state.log.join("\n"));
    assert.equal(ally.status, "active");
    assert.equal(pc.spellPools["item:potion"], 1);
    pc.hp.value -= 20;
    castSpell(state, pc, action.spellIndex, [pc.id]);
    assert.ok(state.log.some((line) => line.includes(`${pc.name} drinks Test Potion`)));
    assert.equal(pc.spellPools["item:potion"], 0);
});

test("U1: the margin divides a PC's consumable option", () => {
    const { state, pc } = setUp({ potions: 0, elixir: true });
    const value = (margin) => {
        state.options = { ...(state.options ?? {}), consumableMargin: margin };
        return Math.max(0, ...scoreOptions(state, pc).options.filter((option) => option.action?.type === "cast" && pc.spells[option.action.spellIndex].item === "elixir").map((option) => option.value));
    };
    const full = value(1);
    assert.ok(full > 0);
    assert.ok(Math.abs(value(1.5) - full / 1.5) < 1e-9, `${value(1.5)} vs ${full / 1.5}`);
});

// U2 (2026-10-15), bombs: a thrown consumable weapon counted by its stack, taken out before each throw; an alchemist's reagents make more.
const bomb = (extra = {}) => ({ name: "Test Fire", bonus: 14, melee: false, increment: 20, thrown: true, splashKind: "bomb", splashAmount: 2, damage: [{ dice: 2, die: 6, bonus: 0, type: "fire" }], ammo: { pool: "item:bomb", count: 2, reagents: false, startsEmpty: true }, consumable: true, reload: 1, ...extra });

function bomber({ stock = 2, reagents = 0, ammo = {}, seed = 1 } = {}) {
    const [fighter] = martialParty(5);
    const strike = bomb({ ammo: { pool: "item:bomb", count: stock, reagents: reagents > 0, startsEmpty: true, ...ammo } });
    // (Hit Points enough that the throws aren't cut short.)
    const pc = { ...fighter, band: "near", hp: { value: 2000, max: 2000, temp: 0 }, strikes: [strike], spellPools: { "item:bomb": stock, ...(reagents ? { reagents } : {}) } };
    const foe = { ...moderateCreature(5, "foe", "Foe"), band: "near" };
    foe.hp = { value: 400, max: 400, temp: 0 };
    return { pc, foe, seed };
}

test("U2: a bomb starts out of hand, is taken out before each throw, and runs out; then Quick Alchemy makes more from reagents", async () => {
    const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
    const { ammoLeft, createCombatant, strikeUsable } = await import("../src/engine/combatant.js");
    const { pc, foe } = bomber();
    const made = createCombatant({ ...pc, side: "party" });
    assert.equal(made.unloaded.has("Test Fire"), true);
    assert.equal(ammoLeft(made, made.strikes[0]), 2);
    const result = simulate(prepareSnapshot({ combatants: [{ ...pc, side: "party" }, { ...foe, side: "foes" }] }), { morale: false }, 1, { log: true });
    const throws = result.log.filter((line) => line.includes(`${pc.name} Test Fire →`)).length;
    assert.equal(throws, 2, result.log.slice(0, 30).join("\n"));
    assert.equal(result.log.filter((line) => line.includes(`${pc.name} takes out Test Fire`)).length, 2);
    // With two reagents: four in all, the last two made with Quick Alchemy.
    const alchemist = bomber({ reagents: 2 });
    const more = simulate(prepareSnapshot({ combatants: [{ ...alchemist.pc, side: "party" }, { ...alchemist.foe, side: "foes" }] }), { morale: false }, 1, { log: true });
    assert.equal(more.log.filter((line) => line.includes(`${pc.name} Test Fire →`)).length, 4);
    assert.equal(more.log.filter((line) => line.includes("makes Test Fire with Quick Alchemy")).length, 2, more.log.join("\n"));
    // None left: not usable.
    made.spellPools["item:bomb"] = 0;
    assert.equal(strikeUsable(made, made.strikes[0]), false);
});

test("U2: a PC's bomb weighs as a consumable, a monster's in full", () => {
    const { state, pc, brute } = setUp({ potions: 0 });
    const thrown = bomb();
    assert.equal(consumableWeight(state, pc, thrown, [brute]), 1 / 1.5);
    assert.equal(consumableWeight(state, brute, thrown, [pc]), 1);
    assert.equal(consumableWeight(state, pc, { ...thrown, consumable: false }, [brute]), 1);
});

test("U3: an item that casts a spell plays the spell's plan at the item's rank, with the item's activation and its drinker", () => {
    const castPlan = { source: { name: "Test Veil" }, traits: ["illusion"], activation: { time: "2", traits: ["concentrate", "manipulate"] }, targeting: { target: "1 creature", range: "touch" }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: BUFF, recipients: "target" }] } };
    const potion = { builtin: "cast-spell", source: { name: "Veil Potion" }, spell: { uuid: "Compendium.pf2e.spells-srd.Item.x", name: "Test Veil" }, rank: 2, dc: null, attack: null, self: true, notes: [], item: itemInfo("potion", 4) };
    const entry = itemEntry(potion, { id: "v", name: "Veil Potion", cast: { plan: castPlan, castRank: 2, dc: 18, attack: 8 } });
    assert.deepEqual([entry.name, entry.kind, entry.castRank, entry.dc, entry.attack, entry.drinker], ["Veil Potion", "item", 2, 18, 8, true]);
    assert.deepEqual(entry.plan.activation, { time: "1", traits: ["manipulate"] });
    assert.deepEqual([entry.plan.targeting.target, entry.plan.resolution.kind], ["1 willing creature", "effect"]);
    // A cast "on you" that isn't drunk: on the user. No spell plan: left out.
    const band = itemEntry({ ...potion, item: { ...potion.item, category: "worn", recipient: "user" } }, { id: "b", cast: { plan: castPlan, castRank: 2, dc: 18, attack: 8 } });
    assert.equal(band.plan.targeting.target, "self");
    assert.equal(itemEntry(potion, { id: "n" }), null);
});

test("U4: an injury poison a Strike lists is delivered free by its hits, a dose each, until none are left; drinkable poisons and drugs are left out", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    const row = (extra = {}) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...extra });
    const VENOM = { source: { name: "Test Venom", slug: "test-venom" }, traits: ["injury", "poison"], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits" }, trigger: { event: "strike", on: ["success", "criticalSuccess"], attackEffect: "test-venom", cost: "free", map: false },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 40 } }, outcomes: { criticalSuccess: row(), success: row(), failure: row({ effects: [{ kind: "condition", slug: "sickened", value: 1, duration: null }] }), criticalFailure: row({ effects: [{ kind: "condition", slug: "sickened", value: 2, duration: null }] }) } },
        item: { ...itemInfo("poison", 3), recipient: "user", delivery: "injury" } };
    assert.equal(itemEntry(VENOM, { id: "v" }), null, "not listed by a Strike: a PC's coating, not yet");
    const venom = itemEntry(VENOM, { id: "v", quantity: 1, draw: 1, onStrike: "test-venom" });
    assert.deepEqual([venom.plan.trigger.event, venom.plan.trigger.cost, venom.draw, venom.casts], ["strike", "free", undefined, 1]);
    assert.equal(itemEntry({ ...VENOM, item: { ...VENOM.item, delivery: "ingested" } }, { id: "i", onStrike: "test-venom" }), null);
    assert.equal(itemEntry({ ...POTION, item: { ...POTION.item, category: "drug" } }, { id: "d" }), null);
    // One dose: the first hit poisons, the second doesn't.
    const [fighter] = martialParty(5);
    const brute = { ...moderateCreature(5, "brute", "Brute"), band: "near", engagement: 1 };
    brute.strikes = brute.strikes.map((strike) => ({ ...strike, attackEffects: ["test-venom"] }));
    brute.spells = [venom];
    brute.spellPools = { [venom.pool]: 1 };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", engagement: 1, hp: { value: 500, max: 500, temp: 0 } }, brute] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const me = state.byId.get(fighter.id);
    const them = state.byId.get("brute");
    performStrike(state, them, me, them.strikes[0]);
    performStrike(state, them, me, them.strikes[0]);
    assert.equal(state.log.filter((line) => line.includes("uses Test Venom on")).length, 1, state.log.join("\n"));
    assert.equal(them.spellPools[venom.pool], 0);
});
