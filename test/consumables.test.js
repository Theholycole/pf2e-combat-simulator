import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

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
    // (A Strike of the user's own with riders added, Fear Gem's: not yet.)
    assert.equal(itemEntry({ ...POTION, strike: { range: null, save: null } }, { id: "x" }), null);
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

test("U5: an item's lasting area is the simulation's zone, as an ability's — with its stack, its draw and its own activation; a snare isn't", () => {
    const ICE = { builtin: "zone", actions: 1, zone: { area: { type: "burst", value: 5 }, centre: "placed", range: 20, lasts: { mode: "fixed", value: 1, unit: "minutes", expiry: "turn-start" }, concealed: false, terrain: [{ movement: ["walk"], difficulty: 2 }], hazard: null, saves: [], damage: [{ when: "initial", formulas: ["1d6[cold]"] }], effect: null, modifiers: [], notes: [] }, item: { ...itemInfo("gadget", 1), recipient: "user" } };
    const entry = itemEntry(ICE, { id: "ice", name: "Test Mister", quantity: 2, draw: 1 });
    assert.deepEqual([entry.kind, entry.pool, entry.casts, entry.consumable, Boolean(entry.zone), entry.draw], ["item", "item:ice", 2, true, true, { actions: 1, each: true }]);
    assert.deepEqual(entry.plan.activation, { time: "1", traits: ["manipulate"] });
    assert.equal(itemEntry({ ...ICE, zone: { ...ICE.zone, once: true } }, { id: "snare" }), null);
    assert.equal(itemEntry({ ...ICE, item: { ...ICE.item, category: "snare" } }, { id: "snare" }), null);
});

test("U6: worn items take an Interact to take out, held ones none, stowed PF2e's retrieve cost; a worn belt's four light consumables none", async () => {
    const { beltHeld, drawActions, isBelt } = await import("../src/adapter/items.js");
    assert.deepEqual([drawActions({ carryType: "held" }), drawActions({ carryType: "worn" }), drawActions({ carryType: "stowed", stowed: true, retrieve: 2 }), drawActions({ carryType: "stowed", stowed: true, belted: true })], [0, 1, 2, 0]);
    assert.equal(isBelt({ name: "Belt", carryType: "worn" }), true);
    assert.equal(isBelt({ name: "Belt (Adventures+)", carryType: "worn" }), true);
    assert.equal(isBelt({ name: "Belt Pouch", carryType: "worn" }), false, "PF2e's belt pouch is any container");
    assert.equal(isBelt({ name: "Belt", carryType: "stowed" }), false, "carried or stowed, not worn");
    const held = beltHeld([{ id: "a", bulk: 0.1, consumable: true }, { id: "rope", bulk: 1, consumable: false }, { id: "b", bulk: 0.1, consumable: true }, { id: "big", bulk: 1, consumable: true }, { id: "c", bulk: 0, consumable: true }, { id: "d", bulk: 0.1, consumable: true }, { id: "e", bulk: 0.1, consumable: true }]);
    assert.deepEqual(held, ["a", "b", "c", "d"]);
});

// U7 (2026-10-15; the user: "Work on the fear gem so it works in the simulator"): Fear Gem's plan, as the item module compiles it.
const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], modifiers: [] };
const FEAR_GEM = { source: { name: "Fear Gem", slug: "fear-gem" }, traits: ["consumable", "emotion", "fear", "magical", "mental", "talisman"], activation: { time: "2", traits: ["concentrate"] }, targeting: { target: "the creature the Strike hits" }, trigger: { event: "strike", on: ["success", "criticalSuccess"], cost: "free" },
    resolution: { kind: "save", check: { roll: "attack", statistic: "strike", against: { dc: "target", statistic: "ac" } }, outcomes: { criticalSuccess: { ...none, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }, success: { ...none, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, failure: none, criticalFailure: none } },
    strike: { range: "melee", save: null }, item: { ...itemInfo("talisman", 4), recipient: "user", activations: [{ name: null, time: "2", traits: ["concentrate"] }] } };

test("U7: an item used by Striking is a Strike activity — its riders on a hit and a critical hit, its stack its pool; Intimidating Strike raises Fear Gem's", async () => {
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const gem = itemStrikeActivity(FEAR_GEM, { id: "gem", quantity: 2 });
    assert.deepEqual([gem.name, gem.actions, gem.range, gem.pool, gem.casts, gem.consumable, gem.traits], ["Fear Gem", 2, "melee", "item:gem", 2, true, ["concentrate"]]);
    assert.deepEqual([gem.onHit.conditions, gem.onHit.critical], [[{ slug: "frightened", value: 1, duration: null }], [{ slug: "frightened", value: 2, duration: null }]]);
    const raised = itemStrikeActivity(FEAR_GEM, { id: "gem", feats: ["intimidating-strike"] });
    assert.deepEqual([raised.onHit.conditions[0].value, raised.onHit.critical[0].value], [2, 3]);
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, strike: { range: null, save: null } }, { id: "g" }).range, "any");
    // (A rider it can't carry: not played. Not that kind of item, or none left: none.)
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, resolution: { ...FEAR_GEM.resolution, outcomes: { ...FEAR_GEM.resolution.outcomes, success: { ...none, modifiers: [{ selector: "ac", value: -1 }] } } } }, { id: "g" }), null);
    assert.equal(itemStrikeActivity(POTION, { id: "p" }), null);
    assert.equal(itemStrikeActivity(FEAR_GEM, { id: "g", quantity: 0 }), null);
    // (A push on a hit, Battering Ammunition's: the activity's push; a pull isn't played.)
    const shove = (kind) => ({ ...FEAR_GEM, resolution: { ...FEAR_GEM.resolution, outcomes: { ...FEAR_GEM.resolution.outcomes, success: { ...FEAR_GEM.resolution.outcomes.success, forcedMovement: { kind, distance: 5 } }, criticalSuccess: { ...FEAR_GEM.resolution.outcomes.criticalSuccess, forcedMovement: { kind, distance: 5 } } } } });
    assert.equal(itemStrikeActivity(shove("push"), { id: "g" }).onHit.push, 5);
    assert.equal(itemStrikeActivity(shove("pull"), { id: "g" }), null);
    // (Extras on the Strike itself: an attack bonus isn't played without it; 2026-10-17, plain extra damage dice are carried — Shatterpoint
    // Ammunition's persistent sonic.)
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, strike: { ...FEAR_GEM.strike, attack: { value: 2 } } }, { id: "g" }), null);
    assert.deepEqual(itemStrikeActivity({ ...FEAR_GEM, strike: { ...FEAR_GEM.strike, damage: [{ diceNumber: 1, dieSize: "d8", category: "persistent", damageType: "sonic" }] } }, { id: "g" }).extraDamage, [{ dice: 1, die: 8, bonus: 0, multiplier: 1, type: "sonic", persistent: true, precision: false }]);
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, strike: { ...FEAR_GEM.strike, damage: [{ diceNumber: 1, dieSize: "d8", category: "splash", damageType: "sonic" }] } }, { id: "g" }), null, "a kind of damage it doesn't carry");
    // And not an action of its own: itemEntry leaves it to the activity.
    assert.equal(itemEntry(FEAR_GEM, { id: "g" }), null);
});

test("U7: in a fight the gem's Strike frightens on a hit, uses one up, and stops when they're gone", async () => {
    const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const [fighter] = martialParty(5);
    const gem = itemStrikeActivity(FEAR_GEM, { id: "gem", quantity: 2 });
    // (A monster's: used freely; plenty of Hit Points on both sides so the gems run out.)
    const brute = { ...moderateCreature(5, "brute", "Brute"), band: "near", side: "foes", strikeActivities: [gem], spellPools: { [gem.pool]: 2 } };
    const pc = { ...fighter, band: "near", side: "party", hp: { value: 600, max: 600, temp: 0 } };
    brute.hp = { value: 600, max: 600, temp: 0 };
    let frightened = 0;
    for (let seed = 1; seed <= 6; seed++) {
        const result = simulate(prepareSnapshot({ combatants: [pc, brute] }), { morale: false }, seed, { log: true });
        assert.equal(result.log.filter((line) => line.includes("Brute uses Fear Gem")).length, 2, result.log.slice(0, 40).join("\n"));
        assert.equal(result.stats.foeItemsUsed, 2);
        frightened += result.log.filter((line) => /Fighter is frightened [12]/.test(line)).length;
    }
    assert.ok(frightened > 0, "a hit frightens");
});

// The concentrate trait (2026-10-15; the user: "Work on the concentrate trait interactions").
test("concentrate: an action's traits are its own, its plan's and its activation's; none while raging (unless rage) or fascinated", async () => {
    const { actionTraits, traitsAllowed } = await import("../src/engine/spells.js");
    assert.deepEqual(actionTraits({ traits: ["fear"], plan: { traits: ["talisman"], activation: { traits: ["concentrate"] } } }).sort(), ["concentrate", "fear", "talisman"]);
    const calm = { cond: {} };
    assert.equal(traitsAllowed(calm, ["concentrate"]), true);
    assert.equal(traitsAllowed(calm, ["concentrate"], { raging: true }), false);
    assert.equal(traitsAllowed(calm, ["concentrate", "rage"], { raging: true }), true);
    assert.equal(traitsAllowed({ cond: { fascinated: true } }, ["concentrate"]), false);
    assert.equal(traitsAllowed({ cond: { fascinated: true } }, ["manipulate"]), true);
});

test("concentrate: a Fear Gem isn't used while raging or fascinated, and a reaction to concentrate that disrupts it spends it with no Strike", async () => {
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const [fighter] = martialParty(5);
    const gem = itemStrikeActivity(FEAR_GEM, { id: "gem", quantity: 1 });
    const brute = { ...moderateCreature(5, "brute", "Brute"), band: "near", engagement: 1 };
    // (Its reaction: a Strike at a creature using a concentrate action within its reach, which disrupts it on a hit.)
    brute.reactionStrikes = [{ name: "Test Disruption", triggers: ["concentrate"], strike: null, penalty: 0, disrupts: true }];
    const state = createFightState({ combatants: [{ ...fighter, band: "near", engagement: 1, strikeActivities: [gem], spellPools: { [gem.pool]: 1 } }, brute] }, { consumableMargin: 1 }, 1);
    state.log = [];
    state.round = 1;
    const pc = state.byId.get(fighter.id);
    pc.actionsLeft = 3;
    computeThreats(state);
    const offered = () => scoreOptions(state, pc).options.some((option) => option.action?.type === "strikeActivity");
    assert.equal(offered(), true);
    pc.activeBuffs = [{ name: "Rage", noConcentrate: true }];
    assert.equal(offered(), false, "raging");
    pc.activeBuffs = [];
    pc.cond.fascinated = true;
    assert.equal(offered(), false, "fascinated");
    pc.cond.fascinated = false;
    // Used: the brute's reaction hits (every d20 a 15) and disrupts it.
    const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
    let disrupted = 0;
    for (let seed = 1; seed <= 8 && !disrupted; seed++) {
        const result = simulate(prepareSnapshot({ combatants: [{ ...fighter, band: "near", side: "party", strikeActivities: [gem], spellPools: { [gem.pool]: 1 } }, { ...brute, side: "foes" }] }), { morale: false, consumableMargin: 1 }, seed, { log: true });
        const at = result.log.findIndex((line) => line.includes("uses Fear Gem"));
        if (at < 0) continue;
        const end = result.log.findIndex((line, index) => index > at && line.includes("Fear Gem is disrupted"));
        if (end < 0) continue;
        disrupted++;
        // (The reaction first, then the disruption — and no Strike of the gem's between.)
        assert.ok(result.log.slice(at, end).some((line) => line.includes("uses Test Disruption")), result.log.slice(at, end + 1).join("\n"));
        assert.ok(!result.log.slice(at, end).some((line) => line.includes("Fighter Greatsword")), result.log.slice(at, end + 1).join("\n"));
    }
    assert.ok(disrupted > 0, "disrupted in some fight");
});

test("a third-party item's own Effect (an application with verify) is kept only when the item module's check passes", async () => {
    const { verifiedPlan } = await import("../src/adapter/items.js");
    const own = { kind: "native-spell-effect", uuid: "Compendium.plus.effects.Item.own000000000001", recipients: "target", verify: "<p>+1 item bonus</p>" };
    const pf2e = { kind: "native-spell-effect", uuid: BUFF, recipients: "target" };
    const plan = { ...ELIXIR, resolution: { kind: "effect", applications: [pf2e, own] } };
    assert.deepEqual(verifiedPlan(plan, () => true).resolution.applications, [pf2e, own]);
    assert.deepEqual(verifiedPlan(plan, () => false).resolution.applications, [pf2e]);
    assert.equal(verifiedPlan(ELIXIR, () => false), ELIXIR, "nothing to check");
});

// U10 (2026-10-15; the user: "add the counteract consumables to the simulator"): the item module's plan.item.counteract.
const counteractItem = (name, slug, counteract, extra = {}) => ({ modelVersion: 13, source: { name, slug, uuid: `Compendium.pf2e.equipment-srd.Item.${slug}`, type: "consumable" }, rank: 1, traits: ["consumable", "healing"], activation: { time: "1", traits: ["manipulate"] }, builtin: "counteract", targeting: { target: "the drinker" }, trigger: { event: "use" },
    item: { ...itemInfo("other", 4), recipient: extra.recipient ?? "drinker", counteract: { traits: [], afflictions: [], conditions: [], pick: "each", ...counteract } } });
const SERUM = counteractItem("Test Serum", "test-serum", { modifier: 8, rank: 2, conditions: ["clumsy", "enfeebled"], pick: "each" });
const METABOLIZER = counteractItem("Test Metabolizer", "test-metabolizer", { modifier: 11, rank: 3, afflictions: ["disease", "poison"], pick: "highest" });
const SOUP = counteractItem("Test Soup", "test-soup", { modifier: 6, rank: 1, conditions: ["stupefied"], pick: "one", reduce: { success: 1, criticalSuccess: 2 } });
const SALVE = counteractItem("Test Salve", "test-salve", { modifier: 22, rank: 3, conditions: ["paralyzed"], pick: "one" }, { recipient: "user" });

function withItem(plan, quantity = 1) {
    const setup = setUp({ potions: 0 });
    const entry = itemEntry(plan, { id: plan.source.slug, quantity });
    setup.pc.spells = [...setup.pc.spells, entry];
    setup.pc.spellPools[entry.pool] = entry.casts;
    setup.index = setup.pc.spells.length - 1;
    setup.state.rng.d20 = () => 15;
    return setup;
}

test("U10: an item that only counteracts is a drink (or an oil applied) with its counteract beside it; nothing to counteract, nothing worth it", async () => {
    const { itemCounteractWorth } = await import("../src/engine/spells.js");
    const serum = itemEntry(SERUM, { id: "s" });
    assert.deepEqual([serum.kind, serum.plan.resolution.kind, serum.drinker, serum.counteract.modifier, serum.counteract.conditions], ["item", "check", true, 8, ["clumsy", "enfeebled"]]);
    assert.equal(itemEntry(SALVE, { id: "v" }).drinker, true, "an oil goes on whoever it's used on");
    const { state, pc } = withItem(SERUM);
    assert.equal(itemCounteractWorth(state, serum, pc), 0);
    // Clumsy 2 from a spell (its DC and rank recorded): worth the chance of ending it.
    pc.cond.clumsy = 2;
    pc.condSources = { clumsy: { dc: 18, rank: 2, spell: true, name: "Test Hex", traits: [] } };
    assert.ok(itemCounteractWorth(state, serum, pc) > 0);
});

test("U10: drunk, it counteracts each condition it names that a spell gave; an affliction of its kinds; a soup lowers the value instead", () => {
    let { state, pc, index } = withItem(SERUM);
    pc.cond.clumsy = 2;
    pc.cond.enfeebled = 1;
    pc.condSources = { clumsy: { dc: 18, rank: 2, spell: true, name: "Test Hex", traits: [] }, enfeebled: { dc: 18, rank: 2, spell: true, name: "Test Hex", traits: [] } };
    castSpell(state, pc, index, [pc.id]);
    assert.deepEqual([pc.cond.clumsy, pc.cond.enfeebled], [0, 0], state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Test Serum against clumsy (Test Hex)") && line.includes("counteracted")));
    // A poison: its DC, and half its source's level as its rank.
    ({ state, pc, index } = withItem(METABOLIZER));
    const brute = state.byId.get("brute");
    pc.afflictions = [{ name: "Test Venom", source: brute.id, data: { name: "Test Venom", dc: 20, traits: ["poison"], stages: [{ conditions: [{ slug: "enfeebled", value: 1 }] }] }, stages: [{ conditions: [] }], stage: 1, conditions: [{ slug: "enfeebled", value: 1 }] }];
    pc.cond.enfeebled = 1;
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.afflictions.length, 0, state.log.join("\n"));
    assert.equal(pc.cond.enfeebled, 0);
    // Moon Radish Soup: stupefied 3 → 2 on a success (15 + 6 = 21 vs DC 18).
    ({ state, pc, index } = withItem(SOUP));
    pc.cond.stupefied = 3;
    pc.condSources = { stupefied: { dc: 18, rank: 1, spell: true, name: "Test Curse", traits: [] } };
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.cond.stupefied, 2, state.log.join("\n"));
});

test("U10: a PC beside a paralyzed ally applies the salve to it", () => {
    const { state, pc, ally, index } = withItem(SALVE);
    ally.cond.paralyzed = true;
    ally.condSources = { paralyzed: { dc: 22, rank: 3, spell: true, name: "Test Paralyze", traits: [] } };
    const action = chooseAction(state, pc);
    assert.deepEqual([action?.type, action?.spellIndex, action?.targetIds], ["cast", index, [ally.id]]);
    castSpell(state, pc, action.spellIndex, action.targetIds);
    assert.ok(state.log.some((line) => line.includes(`${pc.name} applies Test Salve to ${ally.name}`)), state.log.join("\n"));
    assert.equal(ally.cond.paralyzed, false);
});

// U11 (2026-10-15; the user: "add gorum's tear and eye of apprehension to the simulator"): the item module's roll-twice talismans.
const rollTwice = (name, slug, selector) => ({ builtin: "roll-twice", source: { name, slug }, rollTwice: { selector, keep: "higher" }, notes: [], item: { ...itemInfo("talisman", 8), recipient: "user", activations: [{ time: "free", traits: ["concentrate", "fortune"] }] } });
const TEAR = rollTwice("Gorum's Tear", "gorums-tear", "attack-roll");
const EYE = rollTwice("Eye of Apprehension", "eye-of-apprehension", "initiative");

test("U11: a roll-twice talisman as a fortune item — Gorum's Tear's extras, Eye of Apprehension's requirement; other rolls not yet", async () => {
    const { itemFortune } = await import("../src/adapter/items.js");
    const tear = itemFortune(TEAR, { id: "t", quantity: 2 });
    assert.deepEqual([tear.selector, tear.pool, tear.casts, tear.ignoreCircumstance, tear.offGuardAfter, tear.weapon], ["attack-roll", "item:t", 2, true, true, true]);
    assert.deepEqual([itemFortune(EYE, { id: "e" }).selector, itemFortune(EYE, { id: "e" }).requires], ["initiative", "master-perception"]);
    assert.equal(itemFortune(rollTwice("Test Charm", "test-charm", "saving-throw"), { id: "s" }), null);
    assert.equal(itemFortune(TEAR, { id: "t", quantity: 0 }), null);
});

test("U11: Gorum's Tear — rolled twice, then off-guard to the target until its user's next turn; a PC only when it's worth the margin more than the off-guard", async () => {
    const { itemFortune } = await import("../src/adapter/items.js");
    const { attackFortune } = await import("../src/engine/fortune-items.js");
    const { performStrike } = await import("../src/engine/actions.js");
    const { state, pc, brute } = setUp({ potions: 0 });
    const tear = itemFortune(TEAR, { id: "t", quantity: 1 });
    brute.fortuneItems = [tear];
    brute.spellPools[tear.pool] = 1;
    state.rng.d20 = () => 12;
    performStrike(state, brute, pc, brute.strikes[0]);
    assert.ok(state.log.some((line) => line.includes("Brute uses Gorum's Tear: rolls twice")), state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Brute is off-guard to Fighter (Gorum's Tear)")));
    assert.equal(brute.spellPools[tear.pool], 0);
    assert.ok(brute.offGuardTo.some((entry) => entry.attacker === pc.id));
    // A PC's: weighed. Worth it against a dangerous foe while it has Hit Points to spare; not when the off-guard could drop it.
    pc.fortuneItems = [{ ...tear }];
    pc.spellPools[tear.pool] = 1;
    state.threat = new Map([[pc.id, 10], [brute.id, 10]]);
    const ask = () => attackFortune(state, pc, brute, pc.strikes[0], { modifier: 10, ac: 20, damage: [20, 40] });
    pc.hp.value = 5;
    state.threat.set(brute.id, 100);
    assert.equal(ask(), null);
    pc.hp.value = pc.hp.max;
    state.threat.set(brute.id, 10);
    assert.ok(ask());
});

test("U11: Eye of Apprehension — a monster rolls initiative twice; a PC only in a hard fight (the foes last two thirds as long as its side)", async () => {
    const { itemFortune } = await import("../src/adapter/items.js");
    const { initiativeFortune } = await import("../src/engine/fortune-items.js");
    const { state, pc, ally, brute } = setUp({ potions: 0 });
    const eye = itemFortune(EYE, { id: "e" });
    for (const c of [pc, brute]) {
        c.fortuneItems = [{ ...eye }];
        c.spellPools[eye.pool] = 1;
    }
    assert.equal(initiativeFortune(state, brute), true);
    // (The brute alone against two PCs: it lasts its HP over their damage; they, theirs over its.)
    brute.hp.value = 40;
    state.threat = new Map([[pc.id, 10], [ally.id, 10], [brute.id, 10]]);
    assert.equal(initiativeFortune(state, pc), false, "an easy fight");
    brute.hp.value = 400;
    assert.equal(initiativeFortune(state, pc), true);
    assert.equal(pc.spellPools[eye.pool], 0);
    assert.ok(state.log.some((line) => line.includes("uses Eye of Apprehension: rolls initiative twice")));
});

// U12 (2026-10-16; the user: "Add the persistent damage recovery items freely"): the item module's plan.item.recovery.
const QUENCH = { modelVersion: 13, source: { name: "Test Quench", slug: "test-quench" }, rank: 1, traits: ["consumable", "potion"], activation: { time: "1", traits: ["manipulate"] }, targeting: { target: null }, trigger: { event: "use" },
    resolution: { kind: "check", check: { roll: "automatic" }, outcomes: { success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] } } }, item: { ...itemInfo("potion", 3), recovery: { types: ["acid", "fire"], dc: 10 } } };

test("U12: a recovery item — its flat check ends persistent damage of its types; used freely, worth the damage it saves", async () => {
    const { itemRecoveryWorth } = await import("../src/engine/spells.js");
    const entry = itemEntry(QUENCH, { id: "q", quantity: 1 });
    assert.deepEqual([entry.recovery, entry.free, entry.drinker], [{ types: ["acid", "fire"], dc: 10 }, true, true]);
    const { state, pc } = withItem(QUENCH);
    const quench = pc.spells.at(-1);
    assert.equal(consumableWeight(state, pc, quench, [pc]), 1, "used freely");
    assert.equal(itemRecoveryWorth(quench, pc), 0);
    // Burning badly (6d6 fire): drunk, and on a 15 (DC 10) the fire ends; bleed stays.
    pc.persistent = [{ type: "fire", dice: 6, die: 6, bonus: 0, multiplier: 1 }, { type: "bleed", dice: 1, die: 6, bonus: 0, multiplier: 1 }];
    assert.ok(Math.abs(itemRecoveryWorth(quench, pc) - 0.55 * 2 * 21) < 1e-9);
    const action = chooseAction(state, pc);
    assert.deepEqual([action?.type, action?.spellIndex], ["cast", pc.spells.length - 1], JSON.stringify(action));
    castSpell(state, pc, action.spellIndex, action.targetIds);
    assert.deepEqual(pc.persistent.map((each) => each.type), ["bleed"], state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("persistent fire: flat check DC 10 → ended (Test Quench)")));
});

// U13 (2026-10-16; the user: "Yes add them"): plan.item.reduce, the "targets" recipient, and Lion Badge's trigger.
const fearRow = (value) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: value ? [{ kind: "condition", slug: "frightened", value, duration: null }] : [] });
const PARALYZE_LIKE = { modelVersion: 12, source: { name: "Test Scare" }, rank: 3, traits: ["mental"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" },
    resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: fearRow(0), success: fearRow(1), failure: fearRow(2), criticalFailure: fearRow(3) } } };
const reducer = (name, slug, reduce, extra = {}) => ({ modelVersion: 13, source: { name, slug }, rank: 1, traits: ["consumable"], activation: { time: "1", traits: ["manipulate"] }, targeting: { target: extra.target ?? null }, trigger: { event: "use" },
    resolution: { kind: "check", check: { roll: "automatic" }, outcomes: { success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] } } }, ...(extra.noteOnly ? { noteOnly: true } : {}),
    item: { ...itemInfo("other", 3), recipient: extra.recipient ?? "drinker", reduce } });

test("U13: an item lowers the conditions it names — on the one it's used on (a drink), or its user; the step that helps most for a choice; all for \"all\"", async () => {
    const { itemReduceWorth } = await import("../src/engine/spells.js");
    // A bun, drunk (note-only text aside: its reduction is played).
    let { state, pc, index } = withItem(reducer("Test Bun", "test-bun", [{ slug: "frightened", by: 1 }], { noteOnly: true }));
    const bun = pc.spells[index];
    assert.deepEqual([bun.drinker, bun.reduce], [true, [{ slug: "frightened", by: 1, on: "targets" }]]);
    assert.equal(itemReduceWorth(bun, pc, pc), 0);
    pc.cond.frightened = 2;
    assert.ok(itemReduceWorth(bun, pc, pc) > 0);
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.cond.frightened, 1, state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("frightened 2 → 1 (Test Bun)")));
    // A poultice on its user: no target named, on itself.
    ({ state, pc, index } = withItem(reducer("Test Poultice", "test-poultice", [{ slug: "sickened", by: 1 }], { recipient: "user" })));
    assert.equal(pc.spells[index].plan.targeting.target, "self");
    pc.cond.sickened = 2;
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.cond.sickened, 1);
    // One of several (the one that helps most) and "all".
    ({ state, pc, index } = withItem(reducer("Test Salts", "test-salts", [{ choose: ["clumsy", "frightened"], by: 1 }, { slug: "stupefied", by: "all" }])));
    // (Frightened 3 → 2 is worth more than clumsy 1 → 0.)
    Object.assign(pc.cond, { clumsy: 1, frightened: 3, stupefied: 2 });
    castSpell(state, pc, index, [pc.id]);
    assert.deepEqual([pc.cond.clumsy, pc.cond.frightened, pc.cond.stupefied], [1, 2, 0]);
});

test("U13: an item for \"targets\" that names none plays on one creature, as a drink; Lion Badge lowers frightened from a Will save, used up", async () => {
    const { itemReduceTrigger } = await import("../src/adapter/items.js");
    const peas = itemEntry({ ...POTION, targeting: { target: "the drinker" }, item: { ...POTION.item, recipient: "targets" } }, { id: "p" });
    assert.equal(peas.drinker, true);
    const lantern = itemEntry({ ...ELIXIR, targeting: { target: "1 creature", range: "15 feet" }, item: { ...ELIXIR.item, recipient: "targets" } }, { id: "l" });
    assert.equal(lantern.drinker, undefined, "it names its own targets");
    const badge = itemReduceTrigger(reducer("Lion Badge", "lion-badge", [{ slug: "frightened", by: 1 }], { recipient: "user" }), { id: "b" });
    assert.deepEqual([badge.on, badge.save, badge.by, badge.requires], ["frightened", "will", 1, "expert-will"]);
    const { state, pc, brute } = setUp({ potions: 0 });
    pc.reduceTriggers = [badge];
    pc.spellPools[badge.pool] = 1;
    brute.spells = [{ name: "Test Scare", plan: { ...PARALYZE_LIKE, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "will", basic: false } } }, castRank: 3, dc: 40, attack: 30, pool: null }];
    pc.heroPoints = 0;
    state.rng.d20 = () => 2;
    castSpell(state, brute, 0, [pc.id]);
    // (A critical failure, frightened 3: one lower.)
    assert.equal(pc.cond.frightened, 2, state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("uses Lion Badge: frightened 3 → 2")));
    assert.equal(pc.spellPools[badge.pool], 0);
    // Used up: the next fright stays.
    castSpell(state, brute, 0, [pc.id]);
    assert.equal(pc.cond.frightened, 3);
});

// U14 (2026-10-16; the item module's spellguns): "a spell attack roll or a firearm attack roll" — its user's better one.
const shot = (multiplier) => ({ damage: { mode: "shared", multiplier, sourceComponentIds: ["0"] }, effects: [], modifiers: [] });
const SPELLGUN = { modelVersion: 13, source: { name: "Test Spellgun", slug: "test-spellgun" }, rank: 1, traits: ["consumable", "magical", "spellgun"], activation: { time: "1", traits: ["manipulate"] }, automation: { level: "automatic" },
    targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, ownCheck: { kind: "attack", modifier: null, choose: ["spell", "firearm"] },
    resolution: { kind: "check", check: { roll: "skill", statistic: "attack", against: { dc: "target", statistic: "ac" } }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "4d6", type: "fire", category: null }] },
        outcomes: { criticalSuccess: shot(2), success: shot(1), failure: { ...none }, criticalFailure: { ...none } } }, item: { ...itemInfo("other", 5), recipient: "user" } };

function gunner({ firearm = null, spellAttack = null } = {}) {
    const [fighter] = martialParty(5);
    const entry = itemEntry(SPELLGUN, { id: "gun", quantity: 2 });
    const strikes = [...fighter.strikes, ...(firearm !== null ? [{ name: "Test Pistol", bonus: firearm, melee: false, increment: 30, firearm: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] }, { name: "Test Crossbow", bonus: firearm + 5, melee: false, increment: 120, firearm: true, crossbow: true, damage: [{ dice: 1, die: 8, bonus: 0, type: "piercing" }] }] : [])];
    const known = spellAttack !== null ? [{ name: "Test Ray", plan: PARALYZE_LIKE, castRank: 1, dc: spellAttack + 10, attack: spellAttack, pool: null }] : [];
    const pc = { ...fighter, band: "near", engagement: 1, strikes, spells: [...known, entry], spellPools: { [entry.pool]: entry.casts } };
    const brute = { ...moderateCreature(5, "brute", "Brute"), band: "near", engagement: 1 };
    const state = createFightState({ combatants: [pc, brute] }, {}, 1);
    state.log = [];
    state.round = 1;
    return { state, pc: state.byId.get(fighter.id), brute: state.byId.get("brute") };
}

test("U14: a spellgun is an attack with its user's better attack — a spell attack or a firearm's (not a crossbow's); with neither it's left out", () => {
    const entry = itemEntry(SPELLGUN, { id: "gun" });
    assert.deepEqual([entry.ownAttack, entry.plan.traits.includes("attack")], [["spell", "firearm"], true]);
    assert.equal(itemEntry({ ...SPELLGUN, ownCheck: { kind: "attack", modifier: 14 } }, { id: "c" }).ownAttack, undefined, "an item's own +14 isn't its user's");
    const gun = (pc) => pc.spells.find((spell) => spell.ownAttack);
    assert.deepEqual(gun(gunner({ firearm: 14, spellAttack: 11 }).pc).ownAttacks, { spell: 11, firearm: 14 });
    assert.deepEqual(gun(gunner({ spellAttack: 11 }).pc).ownAttacks, { spell: 11 });
    assert.equal(gun(gunner().pc), undefined, "no spell attack, no firearm: not usable");
});

test("U14: fired, it rolls the better after each one's penalties — clumsy lowers the firearm's, stupefied the spell's", async () => {
    const { ownAttackModifier } = await import("../src/engine/consumables.js");
    const { state, pc, brute } = gunner({ firearm: 14, spellAttack: 12 });
    const index = pc.spells.findIndex((spell) => spell.ownAttack);
    const gun = pc.spells[index];
    assert.equal(ownAttackModifier(gun, pc), 14);
    pc.cond.clumsy = 3;
    assert.equal(ownAttackModifier(gun, pc), 12, "the spell attack's 12 beats the clumsy firearm's 11");
    pc.cond.stupefied = 2;
    assert.equal(ownAttackModifier(gun, pc), 11);
    pc.cond.clumsy = 0;
    pc.cond.stupefied = 0;
    // A 10 on the die: 10 + 14 = 24 against its AC.
    state.rng.d20 = () => 10;
    const hp = brute.hp.value;
    castSpell(state, pc, index, [brute.id]);
    assert.ok(state.log.some((line) => /Test Spellgun/.test(line)), state.log.join("\n"));
    assert.equal(brute.hp.value < hp, 24 >= brute.ac, state.log.join("\n"));
    assert.equal(pc.spellPools[gun.pool], 1);
});

// U15 (2026-10-16; the item module's plan.retaliation): Potions of Fire Retaliation and the like.
const retaliationPotion = (formula, extra = {}) => ({ modelVersion: 13, source: { name: "Test Retaliation", slug: "test-retaliation" }, rank: 1, traits: ["consumable", "magical", "potion"], activation: { time: "1", traits: ["manipulate"] },
    automation: { level: "automatic" }, targeting: { target: "the creature that touches you", range: null, area: null }, trigger: { event: "use" }, retaliation: true,
    resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula, type: "fire", category: null }] },
        outcomes: { criticalSuccess: { ...none }, success: shot(1), failure: { ...none }, criticalFailure: { ...none } } }, item: itemInfo("potion", 3), ...extra });

test("U15: a retaliation potion is a drink with nothing at once — its damage kept for whoever touches the drinker; the moderate grade's adjacent melee hits too", () => {
    const lesser = itemEntry(retaliationPotion("1d4"), { id: "r" });
    assert.deepEqual([lesser.drinker, lesser.plan.resolution.kind, lesser.retaliation], [true, "check", { parts: [{ dice: 1, die: 4, bonus: 0, type: "fire" }], adjacentMelee: false, rounds: 10 }]);
    assert.deepEqual(itemEntry(retaliationPotion("1"), { id: "m" }).retaliation.parts, [{ dice: 0, die: 0, bonus: 1, type: "fire" }]);
    assert.equal(itemEntry(retaliationPotion("2d4", { retaliation: { adjacentMelee: true } }), { id: "o" }).retaliation.adjacentMelee, true);
    assert.equal(itemEntry(retaliationPotion("lots"), { id: "x" }), null, "damage it can't read: left out");
});

test("U15: drunk, an unarmed hit on the drinker burns the attacker for a minute; a weapon hit only with the moderate grade, a miss never", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    for (const adjacentMelee of [false, true]) {
        const { state, pc, index, brute } = withItem(retaliationPotion("2d4", { retaliation: { adjacentMelee } }));
        castSpell(state, pc, index, [pc.id]);
        assert.ok(state.log.some((line) => line.includes("Fighter glows with Test Retaliation")), state.log.join("\n"));
        state.rng.die = (size) => size;
        const claw = { ...brute.strikes[0], name: "Claw", unarmed: true };
        const sword = { ...brute.strikes[0], name: "Sword", unarmed: false };
        const hp = () => brute.hp.value;
        let before = hp();
        state.rng.d20 = () => 19;
        performStrike(state, brute, pc, claw);
        assert.equal(before - hp(), 8, state.log.join("\n"));
        before = hp();
        performStrike(state, brute, pc, sword);
        assert.equal(before - hp(), adjacentMelee ? 8 : 0);
        before = hp();
        state.rng.d20 = () => 1;
        performStrike(state, brute, pc, claw);
        assert.equal(before - hp(), 0, "a miss doesn't touch");
        // A minute later, gone.
        state.round += 10;
        state.rng.d20 = () => 19;
        before = hp();
        performStrike(state, brute, pc, claw);
        assert.equal(before - hp(), 0);
    }
});

test("U15: worth the burns its drinker's foes can expect — none from a foe with only weapons (lesser), some from one with claws", async () => {
    const { spellExpectation } = await import("../src/engine/spells.js");
    const { state, pc, index, brute } = withItem(retaliationPotion("2d4"));
    const potion = pc.spells[index];
    const onBrute = () => spellExpectation(state, pc, potion, [pc]).find((entry) => entry.target === brute);
    brute.strikes = [{ ...brute.strikes[0], unarmed: false }];
    assert.equal(onBrute(), undefined);
    brute.strikes = [{ ...brute.strikes[0], unarmed: true }];
    const entry = onBrute();
    // Three rounds, two Strikes a round on the fighter (shared with the ally in its Melee), each 5 fire at its chance to hit.
    assert.ok(entry && entry.damage > 0 && entry.damage <= 3 * 2 * 5, JSON.stringify(entry));
    // Already glowing for long enough: nothing more.
    castSpell(state, pc, index, [pc.id]);
    assert.equal(onBrute(), undefined);
});

// U16 (2026-10-16; the item module's plan.item.rune): oils lending a weapon a property rune for a while.
const runeOil = (name, key, runeName, level = 3) => ({ modelVersion: 13, source: { name, slug: name.toLowerCase().replace(/[^a-z]+/g, "-") }, rank: 1, traits: ["consumable", "magical", "oil"], activation: { time: "1", traits: ["manipulate"] },
    automation: { level: "automatic" }, targeting: { target: null, range: null, area: null }, trigger: { event: "use" },
    resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, outcomes: { criticalSuccess: { ...none }, success: { ...none }, failure: { ...none }, criticalFailure: { ...none } } },
    item: { ...itemInfo("oil", level), recipient: "user", rune: { key, name: runeName, duration: { mode: "fixed", value: 1, unit: "minutes", expiry: "turn-start" }, own: false } } });
const BURIAL = runeOil("Burial Oil", "disrupting", "Vitalizing");
const GREATER_BURIAL = runeOil("Burial Oil (Greater)", "greater-disrupting", "Greater Vitalizing", 11);
const SWIFTNESS = runeOil("Oil of Swiftness", "speed", "Quickstrike", 6);

test("U16: a rune oil is used on its user's own weapon, the rune it lends by PF2e's key; one the simulator doesn't know is left out", () => {
    const entry = itemEntry(GREATER_BURIAL, { id: "g" });
    assert.deepEqual([entry.rune, entry.drinker, entry.plan.targeting.target], [{ key: "greaterDisrupting", name: "Greater Vitalizing", rounds: 10 }, undefined, "self"]);
    assert.equal(itemEntry(runeOil("Test Oil", "ghost-touch", "Ghost Touch"), { id: "t" }), null);
});

test("U16: Burial Oil — its weapon deals 1d6 persistent vitality to undead only, and a critical hit enfeebles the undead until the end of its user's next turn", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    const { state, pc, index, brute } = withItem(BURIAL);
    castSpell(state, pc, index, [pc.id]);
    const weapon = pc.strikes.find((strike) => !strike.unarmed);
    assert.ok(state.log.some((line) => line.includes(`${weapon.name} gains Vitalizing (Burial Oil)`)), state.log.join("\n"));
    state.rng.d20 = () => 15;
    performStrike(state, pc, brute, weapon);
    assert.deepEqual(brute.persistent.map((entry) => entry.type), [], "not undead: nothing");
    brute.traits = [...(brute.traits ?? []), "undead"];
    performStrike(state, pc, brute, weapon);
    assert.deepEqual(brute.persistent.map((entry) => entry.type), ["vitality"], state.log.join("\n"));
    assert.equal(brute.cond.enfeebled ?? 0, 0);
    state.rng.d20 = () => 20;
    performStrike(state, pc, brute, weapon);
    assert.equal(brute.cond.enfeebled, 1, state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("enfeebled 1 (disrupting rune)")));
});

test("U16: Greater Burial Oil — a critical hit on undead: enfeebled 1 and stupefied 1 as long as the persistent vitality lasts", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    const { endWhileConditions } = await import("../src/engine/spells.js");
    const { state, pc, index, brute } = withItem(GREATER_BURIAL);
    brute.traits = [...(brute.traits ?? []), "undead"];
    castSpell(state, pc, index, [pc.id]);
    state.rng.d20 = () => 20;
    performStrike(state, pc, brute, pc.strikes.find((strike) => !strike.unarmed));
    assert.deepEqual([brute.cond.enfeebled, brute.cond.stupefied], [1, 1], state.log.join("\n"));
    endWhileConditions(brute);
    assert.deepEqual([brute.cond.enfeebled, brute.cond.stupefied], [1, 1], "still burning");
    brute.persistent = brute.persistent.filter((entry) => entry.type !== "vitality");
    endWhileConditions(brute);
    assert.deepEqual([brute.cond.enfeebled, brute.cond.stupefied], [0, 0]);
});

test("U16: Oil of Swiftness — quickened for the minute, its extra action from the next turn; worth nothing more once lent, Burial Oil nothing against the living", async () => {
    const { spellExpectation } = await import("../src/engine/spells.js");
    let { state, pc, index } = withItem(SWIFTNESS);
    state.acting = pc.id;
    pc.actionsLeft = 3;
    const worth = () => spellExpectation(state, pc, pc.spells[index], [pc]).find((entry) => entry.target === pc)?.benefit ?? 0;
    assert.ok(worth() > 0);
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.cond.quickened, true);
    assert.equal(pc.actionsLeft, 3, "no extra action added this turn");
    assert.equal(worth(), 0);
    ({ state, pc, index } = withItem(BURIAL));
    const burial = () => spellExpectation(state, pc, pc.spells[index], [pc]).find((entry) => entry.target === pc)?.benefit ?? 0;
    assert.equal(burial(), 0);
    state.byId.get("brute").traits = ["undead"];
    assert.ok(burial() > 0);
});

// U17 (2026-10-16; the item module's plan.action): an item used as part of one of PF2e's actions — the Alchemists+ plants.
const BASIC_PACKS = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const basicsAvailable = existsSync(`${BASIC_PACKS}/actions`) && existsSync(new URL("../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js", import.meta.url));
test("U17: a plant used as part of a Grapple — PF2e's Grapple at the higher of its user's Athletics and the item's +5; a choice of actions not yet", { skip: !basicsAvailable && "the ability module or PF2e's packs not found" }, async () => {
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileBasicActions } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js");
    const basics = compileBasicActions(readDocuments(`${BASIC_PACKS}/actions`).filter((doc) => doc.collection === "items"));
    const flytrap = { modelVersion: 13, source: { name: "Test Flytrap", slug: "test-flytrap" }, rank: 1, traits: ["alchemical", "consumable", "plant"], activation: { time: "1", traits: [] }, builtin: "item-action", automation: { level: "automatic" },
        targeting: { target: "the creature targeted", range: null, area: null }, trigger: { event: "use" }, action: { slug: "grapple", name: "Grapple", bonus: null, minimum: { value: 5, skill: "athletics" }, targeted: true, basic: basics.grapple }, item: { ...itemInfo("other", 1), recipient: "user" } };
    const entry = itemEntry(flytrap, { id: "f" });
    assert.deepEqual([entry.itemAction, entry.plan.resolution.check.statistic, entry.plan.activation.traits.includes("attack")], [{ slug: "grapple", minimum: { value: 5, skill: "athletics" } }, "athletics", true]);
    assert.equal(itemEntry({ ...flytrap, action: { ...flytrap.action, slugs: ["grapple", "trip"], basics: { grapple: basics.grapple, trip: basics.trip } } }, { id: "c" }), null);
    const { state, pc, index, brute } = withItem(flytrap);
    pc.skills = { ...(pc.skills ?? {}), athletics: 2 };
    // Fortitude DC 18: a 13 fails at +2 but succeeds at +5.
    brute.saves = { ...brute.saves, fortitude: 8 };
    state.rng.d20 = () => 13;
    castSpell(state, pc, index, [brute.id]);
    assert.equal(brute.cond.grabbed, true, state.log.join("\n"));
    // Without the item's +5, the same 13 fails.
    const plain = withItem({ ...flytrap, action: { ...flytrap.action, minimum: null } });
    plain.pc.skills = { ...(plain.pc.skills ?? {}), athletics: 2 };
    plain.brute.saves = { ...plain.brute.saves, fortitude: 8 };
    plain.state.rng.d20 = () => 13;
    castSpell(plain.state, plain.pc, plain.index, [plain.brute.id]);
    assert.equal(Boolean(plain.brute.cond.grabbed), false, plain.state.log.join("\n"));
    // Its own Athletics when higher: +12 against the same die.
    const second = withItem(flytrap);
    second.pc.skills = { ...(second.pc.skills ?? {}), athletics: 12 };
    second.brute.saves = { ...second.brute.saves, fortitude: 8 };
    second.state.rng.d20 = () => 6;
    castSpell(second.state, second.pc, second.index, [second.brute.id]);
    assert.equal(second.brute.cond.grabbed, true);
});

test("U18: the item module's Generic Spellgun — a spell's rows heightened to the rank picked, played at that rank (not the item's level)", () => {
    const generic = { ...SPELLGUN, rank: 3, spellgun: { spell: { uuid: null, name: "Test Fear", rank: 1 }, mapping: "save" }, item: { ...SPELLGUN.item, level: 5 } };
    assert.equal(itemEntry(generic, { id: "g" }).castRank, 3);
    assert.equal(itemEntry(SPELLGUN, { id: "p" }).castRank, 5, "PF2e's own spellguns: the item's level");
});

// U19 (2026-10-16; the item module): a save against its owner's own DC — PF2e's "against:class-spell" (Chroma Kaleidoscope).
test("U19: a save against its owner's DC — its class DC, its best spell DC, or the higher; a creature without either, its level's", async () => {
    const { ownerDC } = await import("../src/engine/consumables.js");
    const { levelDC } = await import("../src/engine/checks.js");
    const kaleidoscope = { ...PARALYZE_LIKE, source: { name: "Test Kaleidoscope" }, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "will", basic: false, against: { dc: "owner", statistic: "class-spell" } } }, item: { ...itemInfo("other", 7), recipient: "user" } };
    const entry = itemEntry(kaleidoscope, { id: "k" });
    assert.deepEqual([entry.ownerDC, entry.dc], ["class-spell", null]);
    const caster = { level: 7, classDC: 25, spells: [{ name: "Test Ray", dc: 27 }, { ...entry, dc: 99 }] };
    assert.deepEqual([ownerDC(caster, "class"), ownerDC(caster, "spell"), ownerDC(caster, "class-spell")], [25, 27, 27]);
    assert.deepEqual([ownerDC({ level: 7, classDC: 25, spells: [] }, "spell"), ownerDC({ level: 7, spells: [] }, "class-spell")], [25, levelDC(7)]);
    // In a fight: set as it's prepared (before, its save was against DC 10), the item's own DC from then on.
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, spells: [...(fighter.spells ?? []), entry], spellPools: { [entry.pool]: 1 } }, moderateCreature(5, "brute", "Brute")] }, {}, 1);
    const pc = state.byId.get(fighter.id);
    const held = pc.spells.find((spell) => spell.ownerDC);
    assert.equal(held.dc, ownerDC(pc, "class-spell"));
    assert.equal(held.dc, fighter.classDC);
});

// U20 (2026-10-16): items activated in answer to something.
test("U20: an item whose Activate has a Trigger its plan doesn't keep isn't used at will; a granted reaction's Trigger, further down, doesn't count", async () => {
    const { hasTrigger } = await import("../src/adapter/items.js");
    assert.equal(hasTrigger("<p><strong>Activate</strong> <span>F</span> (concentrate)</p> <p><strong>Trigger</strong> You successfully Trip a foe</p> <hr /> <p>This wolf fang…</p>"), true);
    assert.equal(hasTrigger("<p><strong>Activate</strong> <span>1</span> Interact</p><hr /><p><strong>Benefit</strong> … the following reaction:</p> <p><strong>Trigger</strong> You are targeted by a Strike</p>"), false);
    assert.equal(itemEntry(ELIXIR, { id: "t", triggered: true }), null);
    assert.ok(itemEntry(ELIXIR, { id: "u" }));
    assert.ok(itemEntry({ ...ELIXIR, trigger: { event: "damaged" } }, { id: "d", triggered: true }), "a trigger its plan keeps");
});

// U21 (2026-10-16): items played as their trigger comes — a hit with a Strike (the item module's triggerOn "after-strike").
const DAZING = { modelVersion: 13, source: { name: "Test Coil", slug: "test-coil" }, rank: 1, traits: ["consumable", "magical", "talisman"], activation: { time: "free", traits: ["concentrate"] }, automation: { level: "automatic" },
    targeting: { target: "1 creature", range: null, area: null }, trigger: { event: "use" },
    resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 40 } }, outcomes: { criticalSuccess: { ...none }, success: { ...none }, failure: { ...none, effects: [{ kind: "condition", slug: "stunned", value: 1, duration: null }] }, criticalFailure: { ...none, effects: [{ kind: "condition", slug: "stunned", value: 1, duration: null }] } } },
    item: { ...itemInfo("talisman", 14), recipient: "user", activations: [{ time: "free", traits: ["concentrate"], trigger: "You deal damage to an off-guard creature with the affixed weapon", triggerOn: { event: "after-strike", degrees: ["success", "criticalSuccess"], target: { condition: "off-guard" }, weapon: "affixed" } }] } };

function coiled({ monster = false } = {}) {
    const { itemTriggered } = itemsModule;
    const entry = itemTriggered(DAZING, { id: "coil", quantity: 2 });
    const [fighter, second] = martialParty(5);
    const pc = { ...fighter, band: "near", engagement: 1, kind: monster ? "npc" : fighter.kind, triggeredItems: [entry], spellPools: { ...(fighter.spellPools ?? {}), [entry.pool]: entry.casts } };
    const brute = { ...moderateCreature(5, "brute", "Brute"), band: "near", engagement: 1, saves: { fortitude: 10, reflex: 10, will: 5 } };
    // (No ally beside it: a flanked brute would be off-guard.)
    const state = createFightState({ combatants: [pc, { ...second, band: "far", engagement: 0 }, brute] }, {}, 1);
    state.log = [];
    state.round = 1;
    computeThreats(state);
    return { state, pc: state.byId.get(fighter.id), brute: state.byId.get("brute"), entry };
}
const itemsModule = await import("../src/adapter/items.js");

test("U21: an item set off by a hit is kept apart from the creature's actions, only when its plan acts on the creature hit", () => {
    const { itemTriggered } = itemsModule;
    const entry = itemTriggered(DAZING, { id: "c" });
    assert.deepEqual([entry.triggerOn.event, entry.triggerOn.target, entry.consumable], ["after-strike", { condition: "off-guard" }, true]);
    assert.equal(itemTriggered({ ...DAZING, resolution: { kind: "effect", applications: [{ uuid: "x", recipients: "self" }] }, targeting: { target: null } }, { id: "s" }), null, "an Effect on its user: not yet");
    assert.equal(itemTriggered({ ...DAZING, item: { ...DAZING.item, activations: [{ ...DAZING.item.activations[0], triggerOn: { event: "damaged" } }] } }, { id: "d" }), null, "another trigger: not yet");
});

test("U21: a monster's coil stuns an off-guard creature its weapon hits — not one that isn't off-guard, not with an unarmed attack, not when raging; used up", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    const { state, pc, brute } = coiled({ monster: true });
    const weapon = pc.strikes.find((strike) => !strike.unarmed);
    state.rng.d20 = () => 15;
    performStrike(state, pc, brute, weapon);
    assert.equal(brute.cond.stunned ?? 0, 0, "not off-guard");
    brute.cond.offGuard = true;
    performStrike(state, pc, brute, { ...weapon, unarmed: true, name: "Fist" });
    assert.equal(brute.cond.stunned ?? 0, 0, "an unarmed attack isn't the affixed weapon");
    // The save: a 15 + 5 against DC 40 fails.
    performStrike(state, pc, brute, weapon);
    assert.equal(brute.cond.stunned, 1, state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Fighter uses Test Coil on Brute")));
    assert.equal(pc.spellPools["item:coil"], 1, "one of two used");
    assert.equal(state.log.filter((line) => line.includes("Test Coil")).length, 1, "logged once");
});

test("U21: a PC uses its coil only in a hard fight", async () => {
    const { performStrike } = await import("../src/engine/actions.js");
    const { hardFight } = await import("../src/engine/fortune-items.js");
    const { state, pc, brute } = coiled();
    brute.cond.offGuard = true;
    state.rng.d20 = () => 15;
    const weapon = pc.strikes.find((strike) => !strike.unarmed);
    // An easy fight first (a brute with 5 Hit Points left): kept.
    brute.hp.value = 5;
    brute.hp.max = 500;
    assert.equal(hardFight(state, pc), false);
    performStrike(state, pc, brute, { ...weapon, damage: [{ dice: 0, die: 0, bonus: 0, type: weapon.damage[0].type }] });
    assert.equal(Boolean(brute.cond.stunned), false, state.log.join("\n"));
    // A hard one (the brute's 500): used.
    brute.hp.value = 500;
    assert.equal(hardFight(state, pc), true);
    performStrike(state, pc, brute, weapon);
    assert.equal(brute.cond.stunned, 1, state.log.join("\n"));
});

// U22 (2026-10-16; the item module's compileBomb): a bomb's riders on a hit.
test("U22: a bomb's riders play on its Strike's hit — Frost Vial's Speed penalty, Atrophy Bomb's enfeebled 1 — not on a miss; none without a rider", async () => {
    const { bombRider } = await import("../src/adapter/items.js");
    const { performStrike } = await import("../src/engine/actions.js");
    const row = (extra) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], modifiers: [], ...extra });
    const bombPlan = (name, success) => ({ modelVersion: 13, source: { name, slug: null }, rank: 1, traits: ["alchemical", "bomb", "consumable"], activation: { time: "1", traits: ["manipulate"] }, automation: { level: "automatic" },
        targeting: { target: "the creature the bomb hits", range: 20, area: null }, trigger: { event: "strike", on: ["success", "criticalSuccess"], cost: "free" },
        resolution: { kind: "save", check: { roll: "attack", statistic: "strike", against: { dc: "target", statistic: "ac" } }, outcomes: { criticalSuccess: row(success), success: row(success), failure: row({}), criticalFailure: row({}) } }, item: { type: "weapon", group: "bomb", level: 1, splash: null, save: null } });
    const atrophy = bombPlan("Test Atrophy Bomb", { effects: [{ kind: "condition", slug: "enfeebled", value: 1, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" } }] });
    assert.equal(bombRider(bombPlan("Test Flask", {}), "Test Flask"), null, "nothing but PF2e's damage");
    const rider = bombRider(atrophy, "Test Atrophy Bomb");
    assert.deepEqual([rider.plan.trigger.event, rider.plan.trigger.cost, rider.plan.trigger.strikes], ["strike", "free", ["test atrophy bomb"]]);
    const [fighter] = martialParty(5);
    const bomb = { name: "Test Atrophy Bomb", bonus: 14, melee: false, increment: 20, thrown: true, damage: [{ dice: 1, die: 6, bonus: 0, type: "void" }], attackEffects: [] };
    const pc = { ...moderateCreature(5, "chemist", "Chemist"), band: "near", engagement: 1, strikes: [bomb], spells: [rider] };
    const state = createFightState({ combatants: [pc, { ...fighter, band: "near", engagement: 1 }] }, {}, 1);
    state.log = [];
    state.round = 1;
    const thrower = state.byId.get("chemist");
    const target = state.byId.get(fighter.id);
    state.rng.d20 = () => 1;
    performStrike(state, thrower, target, thrower.strikes[0]);
    assert.equal(target.cond.enfeebled ?? 0, 0, "a miss");
    state.rng.d20 = () => 15;
    performStrike(state, thrower, target, thrower.strikes[0]);
    assert.equal(target.cond.enfeebled, 1, state.log.join("\n"));
});

test("2026-10-16: an item that's ammunition (Roc-Shaft Arrow's arrows) is shot only from a weapon that takes it", async () => {
    const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const arrow = itemStrikeActivity({ ...FEAR_GEM, source: { name: "Test Arrow", slug: "test-arrow" }, activation: { time: "1", traits: [] }, strike: { ...FEAR_GEM.strike, range: "ranged", ammunition: ["arrows"] } }, { id: "arrow", quantity: 2 });
    assert.deepEqual(arrow.ammunition, ["arrows"]);
    const [fighter] = martialParty(5);
    const used = (strike) => {
        const archer = { ...moderateCreature(5, "archer", "Archer"), band: "far", side: "foes", strikes: [strike], strikeActivities: [arrow], spellPools: { [arrow.pool]: 2 }, hp: { value: 600, max: 600, temp: 0 } };
        const result = simulate(prepareSnapshot({ combatants: [{ ...fighter, band: "far", side: "party", hp: { value: 600, max: 600, temp: 0 } }, archer] }), { morale: false }, 1, { log: true });
        return result.log.filter((line) => line.includes("uses Test Arrow")).length;
    };
    const ranged = { name: "Test Bow", bonus: 14, melee: false, increment: 60, damage: [{ dice: 1, die: 8, bonus: 3, type: "piercing" }], attackEffects: [] };
    assert.ok(used({ ...ranged, ammoType: "arrows" }) > 0);
    assert.equal(used({ ...ranged, name: "Test Knife", thrown: true, increment: 10 }), 0, "a thrown knife takes no arrows");
});

test("U22: a bomb's rider only for some creatures (plan.item.riderOnly) — Ghost Charge's for undead, Tallow Bomb's for the living", async () => {
    const { bombRider } = await import("../src/adapter/items.js");
    const { performStrike } = await import("../src/engine/actions.js");
    const row = (extra) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], modifiers: [], ...extra });
    const enfeebling = { effects: [{ kind: "condition", slug: "enfeebled", value: 1, duration: null }] };
    const plan = (riderOnly) => ({ modelVersion: 13, source: { name: "Test Charge" }, rank: 1, traits: ["bomb"], activation: { time: "1", traits: ["manipulate"] }, targeting: { target: "the creature the bomb hits" }, trigger: { event: "strike", on: ["success", "criticalSuccess"], cost: "free" },
        resolution: { kind: "save", check: { roll: "attack", statistic: "strike", against: { dc: "target", statistic: "ac" } }, outcomes: { criticalSuccess: row(enfeebling), success: row(enfeebling), failure: row({}), criticalFailure: row({}) } }, item: { type: "weapon", group: "bomb", level: 1, riderOnly } });
    const throwAt = (riderOnly, traits) => {
        const [fighter] = martialParty(5);
        const bomb = { name: "Test Charge", bonus: 14, melee: false, increment: 20, damage: [{ dice: 1, die: 6, bonus: 0, type: "vitality" }], attackEffects: [] };
        const state = createFightState({ combatants: [{ ...moderateCreature(5, "chemist", "Chemist"), band: "near", engagement: 1, strikes: [bomb], spells: [bombRider(plan(riderOnly), "Test Charge")] }, { ...fighter, band: "near", engagement: 1, traits }] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => 15;
        performStrike(state, state.byId.get("chemist"), state.byId.get(fighter.id), bomb);
        return state.byId.get(fighter.id).cond.enfeebled ?? 0;
    };
    assert.equal(throwAt("void-healing", ["undead"]), 1);
    assert.equal(throwAt("void-healing", ["humanoid"]), 0);
    assert.equal(throwAt("living", ["construct"]), 0);
    assert.equal(throwAt("living", ["humanoid"]), 1);
});

test("2026-10-16: an item's damage choices that differ only in type (Explosive Missive's) are the core's damage-type choice — the type its target minds most", () => {
    const shared = { rollOnce: true, components: [{ id: "0", formula: "4d6[untyped]", type: null, category: null }] };
    const MISSIVE = { ...POTION, source: { name: "Test Missive" }, targeting: { target: "1 creature", range: "30 feet", area: null }, item: { ...POTION.item, recipient: "user" },
        resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 30 } }, sharedDamage: shared, outcomes: { criticalSuccess: { ...none }, success: { ...none, damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } }, failure: { ...none, damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } }, criticalFailure: { ...none, damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } } } },
        damageChoices: ["acid", "cold", "fire"].map((type) => ({ label: type, formula: `4d6[${type}]` })) };
    const entry = itemEntry(MISSIVE, { id: "m" });
    assert.deepEqual(entry.plan.resolution.native.damageTypeChoices, { 0: ["acid", "cold", "fire"] });
    assert.equal(itemEntry({ ...MISSIVE, damageChoices: [{ label: "At night", formula: "7d8[fire]" }, { label: "Else", formula: "7d6[fire]" }] }, { id: "n" }).plan.resolution.native, undefined, "other dice: the plan's own");
    const { state, pc, brute } = withItem(MISSIVE);
    brute.weaknesses = [{ type: "cold", value: 5, exceptions: [] }];
    state.rng.d20 = () => 2;
    castSpell(state, pc, pc.spells.length - 1, [brute.id]);
    assert.ok(state.log.some((line) => / takes \d+ cold/.test(line)), state.log.join("\n"));
});

test("2026-10-16: an item's condition floor for a fixed time (Timpani of Panic's) lasts that long, not for good", async () => {
    const { addFloor, floorOf } = await import("../src/engine/floors.js");
    const { state, pc, brute } = setUp({ potions: 0 });
    addFloor(state, brute, pc, { name: "Test Timpani", plan: {} }, { slug: "frightened", value: 1, lifetime: "fixed", duration: { value: 1, unit: "minutes" } });
    addFloor(state, brute, pc, { name: "Test Drum", plan: {} }, { slug: "sickened", value: 1, lifetime: "fixed", duration: { value: 1, unit: "rounds" } });
    assert.deepEqual(brute.condFloors.map((entry) => entry.untilRound - state.round), [10, 1]);
    assert.equal(floorOf(brute, "frightened"), 1);
});

test("2026-10-16: a zone whose only save is at the end of a turn in it (Noisome Garum's) is played: the creature saves as its turn ends", async () => {
    const { zoneSpell, zoneTurn } = await import("../src/engine/zones.js");
    const savePlan = { ...PARALYZE_LIKE, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 40 } } } };
    const plan = { builtin: "zone", trigger: { event: "use" }, actions: 1, zone: { area: { type: "emanation", value: 5 }, centre: "self", lasts: { mode: "fixed", value: 1, unit: "minutes" }, saves: [{ when: ["end"], plan: savePlan }] } };
    const spell = zoneSpell("Test Garum", plan, {});
    assert.ok(spell, "played");
    const { state, pc, brute } = setUp({ potions: 0 });
    pc.spells = [...pc.spells, { ...spell, pool: null }];
    state.rng.d20 = () => 2;
    castSpell(state, pc, pc.spells.length - 1, [pc.id]);
    zoneTurn(state, brute, "start");
    assert.equal(brute.cond.frightened ?? 0, 0, "not at its turn's start");
    zoneTurn(state, brute, "end");
    assert.ok((brute.cond.frightened ?? 0) > 0, state.log.join("\n"));
});

test("2026-10-16: a Strike activity's roll options — Sniper's Bead's no range penalty out to the second increment; one that adds nothing played isn't an activity", async () => {
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const { rangePenalty } = await import("../src/engine/space.js");
    const { chargeStrike } = await import("../src/engine/abilities.js");
    const plain = { ...FEAR_GEM, resolution: { ...FEAR_GEM.resolution, outcomes: { criticalSuccess: none, success: none, failure: none, criticalFailure: none } } };
    const bead = itemStrikeActivity({ ...plain, source: { name: "Test Bead" }, strike: { range: "ranged", save: null, options: ["ignore-range-penalty:2"] } }, { id: "b" });
    assert.equal(bead.rangeFree, 2);
    assert.equal(itemStrikeActivity({ ...plain, source: { name: "Test Damper" }, strike: { range: "ranged", save: null, suppress: ["kickback"] } }, { id: "d" }), null, "nothing played: not an activity");
    const bow = { name: "Test Bow", bonus: 10, melee: false, increment: 30, damage: [{ dice: 1, die: 6, bonus: 0, type: "piercing" }] };
    assert.deepEqual([rangePenalty(bow, 50), rangePenalty(bow, 80)], [2, 4]);
    const aimed = chargeStrike(bow, bead);
    assert.deepEqual([rangePenalty(aimed, 50), rangePenalty(aimed, 80)], [0, 4], "the second increment free, the third not");
});

test("2026-10-16: an item's extra Strike damage (Martial Mayhem Mutagen's precision die on melee Strikes at off-guard creatures) on its drinker", async () => {
    const { featureParts } = await import("../src/engine/actions.js");
    const strikeDamage = [{ diceNumber: 1, dieSize: "d6", category: "precision", damageType: null, predicate: ["item:melee", "target:condition:off-guard"], duration: { mode: "fixed", value: 10, unit: "minutes" } }];
    const mutagen = { ...ELIXIR, source: { name: "Test Mutagen" }, item: { ...ELIXIR.item, category: "mutagen", strikeDamage } };
    const entry = itemEntry(mutagen, { id: "m" });
    assert.deepEqual(entry.strikeDamage[0].parts[0], { dice: 1, die: 6, bonus: 0, multiplier: 1, type: null, precision: true, persistent: false, whenOffGuard: true });
    assert.equal(itemEntry({ ...mutagen, item: { ...mutagen.item, strikeDamage: [{ ...strikeDamage[0], predicate: ["target:trait:dragon"] }] } }, { id: "n" }).strikeDamage, undefined, "a predicate it doesn't read");
    const { state, pc, brute } = withItem(mutagen);
    const index = pc.spells.length - 1;
    castSpell(state, pc, index, [pc.id]);
    const melee = pc.strikes.find((strike) => strike.melee);
    assert.equal(featureParts(pc, melee, brute, { offGuard: 0 }).filter((part) => part.precision).length, 0, "not off-guard: nothing");
    assert.deepEqual(featureParts(pc, melee, brute, { offGuard: 0.5 }).filter((part) => part.precision).map((part) => [part.dice, part.die, part.chance]), [[1, 6, 0.5]]);
});

test("2026-10-16: an item that restores (Elixir of Rejuvenation) — all its drinker's Hit Points, its afflictions of that level or lower ended; urgent healing for a PC", async () => {
    const { urgentHealing } = await import("../src/engine/consumables.js");
    const elixir = { ...ELIXIR, source: { name: "Test Rejuvenation" }, resolution: { kind: "check", check: { roll: "automatic" }, outcomes: { success: { ...none } } }, item: { ...ELIXIR.item, recipient: "drinker", restore: { hp: "max", afflictions: { level: 5 } } } };
    const entry = itemEntry(elixir, { id: "r" });
    assert.deepEqual(entry.restore, { hp: "max", afflictionLevel: 5 });
    const { state, pc, index } = withItem(elixir);
    pc.hp.value = 3;
    pc.afflictions = [{ name: "Low Poison", source: "brute", data: { level: 3, traits: ["poison"] }, stages: [{ conditions: [] }], stage: 1, conditions: [], endRound: 99 }, { name: "High Curse", source: "brute", data: { level: 9, traits: ["curse"] }, stages: [{ conditions: [] }], stage: 1, conditions: [], endRound: 99 }];
    state.threat?.set?.("brute", 50);
    assert.equal(urgentHealing(state, pc, pc.spells[index], [pc]), true, "about to go down");
    castSpell(state, pc, index, [pc.id]);
    assert.equal(pc.hp.value, pc.hp.max);
    assert.deepEqual(pc.afflictions.filter((held) => held.stage > 0).map((held) => held.name), ["High Curse"], state.log.join("\n"));
});

// 2026-10-16: ammunition (PF2e's "ammo" items, the item module's compileActivations) — Big Rock Bullet's damage in place of the sling's.
test("2026-10-16: Big Rock Bullet — activated then shot (2 actions), from a sling; its 4d6 in place of the sling's on a hit, 2d6 on a failure", async () => {
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    const { chargeStrike } = await import("../src/engine/abilities.js");
    const quiet = { criticalSuccess: none, success: none, failure: none, criticalFailure: none };
    const bullet = { source: { name: "Test Rock" }, traits: ["consumable", "magical"], activation: { time: "1", traits: [] }, trigger: { event: "use" }, resolution: { kind: "check", check: { roll: "automatic" }, outcomes: quiet },
        strike: { range: "ranged", save: null, ammo: true, instead: { hit: { formula: "4d6", type: "bludgeoning" }, failure: { formula: "2d6", type: "bludgeoning" } } }, item: { ...itemInfo("other", 7), recipient: "user", activations: [{ time: "1", traits: [] }] } };
    const activity = itemStrikeActivity(bullet, { id: "rock", quantity: 2, ammunition: ["sling-bullets"] });
    assert.deepEqual([activity.actions, activity.ammunition, activity.instead.hit.dice, activity.instead.failure.dice], [2, ["sling-bullets"], 4, 2]);
    const sling = { name: "Test Sling", bonus: 12, melee: false, increment: 50, ammoType: "sling-bullets", damage: [{ dice: 1, die: 6, bonus: 2, type: "bludgeoning" }], critDamage: [{ dice: 2, die: 6, type: "bludgeoning" }] };
    const loaded = chargeStrike(sling, activity);
    assert.deepEqual([loaded.damage, loaded.critDamage], [[{ dice: 4, die: 6, bonus: 0, multiplier: 1, type: "bludgeoning", persistent: false, precision: false }], undefined]);
    // In a fight: a monster slinger throws it (a miss of 1 on the die: nothing; a failure: the 2d6).
    const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
    const [fighter] = martialParty(5);
    const slinger = { ...moderateCreature(5, "slinger", "Slinger"), band: "far", side: "foes", strikes: [sling], strikeActivities: [activity], spellPools: { [activity.pool]: 2 }, hp: { value: 600, max: 600, temp: 0 } };
    const result = simulate(prepareSnapshot({ combatants: [{ ...fighter, band: "far", side: "party", hp: { value: 600, max: 600, temp: 0 } }, slinger] }), { morale: false }, 3, { log: true });
    assert.ok(result.log.some((line) => /Test Sling \(Test Rock\)/.test(line)), result.log.slice(0, 30).join("\n"));
});

test("2026-10-17: a Strike activity's extra damage dice (Shatterpoint Ammunition's persistent sonic) join its damage and its critical formula; an item action's ownBonus (Greater Ravenous Flytrap)", async () => {
    const { chargeStrike } = await import("../src/engine/abilities.js");
    const extra = [{ dice: 1, die: 8, bonus: 0, multiplier: 1, type: "sonic", persistent: true, precision: false }];
    const bow = { name: "Test Bow", bonus: 10, melee: false, increment: 60, damage: [{ dice: 1, die: 8, bonus: 0, type: "piercing" }], critDamage: [{ dice: 1, die: 8, type: "piercing", multiplier: 2 }] };
    const shot = chargeStrike(bow, { name: "Test Shatterpoint", extraDamage: extra });
    assert.deepEqual(shot.damage.map((part) => `${part.dice}d${part.die} ${part.persistent ? "persistent " : ""}${part.type}`), ["1d8 piercing", "1d8 persistent sonic"]);
    assert.deepEqual(shot.critDamage.at(-1), { ...extra[0], multiplier: 2 });
    const entry = itemEntry({ modelVersion: 13, source: { name: "Test Trap" }, rank: 1, traits: [], builtin: "item-action", targeting: { target: "the creature targeted" }, trigger: { event: "use" },
        action: { slug: "grapple", name: "Grapple", minimum: { value: 16, skill: "athletics", ownBonus: { value: 2, type: "item" } }, targeted: true, basic: { resolution: { kind: "save", check: { roll: "skill", statistic: "athletics", against: { dc: "target", statistic: "fortitude" } }, outcomes: {} }, targeting: { target: "1 creature" }, activation: { time: "1", traits: ["attack"] } } }, item: { ...itemInfo("other", 8), recipient: "user" } }, { id: "t" });
    assert.deepEqual(entry.itemAction.minimum, { value: 16, skill: "athletics", ownBonus: 2 });
});

test("2026-10-17: an item's resistance (Potion of Resistance's choice of energy) on its drinker, the type its foes deal; worth nothing against foes that don't", async () => {
    const { spellExpectation } = await import("../src/engine/spells.js");
    const potion = { ...POTION, source: { name: "Test Resistance" }, resolution: { kind: "check", check: { roll: "automatic" }, outcomes: { success: { ...none } } },
        item: { ...POTION.item, resist: [{ type: null, choose: ["acid", "cold", "fire"], value: 10, duration: { mode: "fixed", value: 1, unit: "hours" } }] } };
    const entry = itemEntry(potion, { id: "r" });
    assert.deepEqual(entry.resist, [{ choose: ["acid", "cold", "fire"], value: 10, rounds: Infinity }]);
    assert.equal(itemEntry({ ...potion, item: { ...potion.item, resist: [{ type: "custom", value: 5, from: ["unholy"], damage: ["spirit"] }] } }, { id: "c" }).resist, undefined, "a custom one: not yet");
    const { state, pc, index, brute } = withItem(potion);
    const worth = () => spellExpectation(state, pc, pc.spells[index], [pc]).find((row) => row.target === pc)?.benefit ?? 0;
    assert.equal(worth(), 0, "the brute's slashing: none of its types");
    brute.strikes = brute.strikes.map((strike) => ({ ...strike, damage: strike.damage.map((part) => ({ ...part, type: "cold" })) }));
    assert.ok(worth() > 0);
    castSpell(state, pc, index, [pc.id]);
    assert.ok((pc.resistances ?? []).some((entry) => entry.type === "cold" && entry.value === 10), JSON.stringify(pc.resistances));
    assert.ok(state.log.some((line) => line.includes("gains resistance 10 to cold")));
});

test("2026-10-17: a Strike plan whose hit does only what its words say (strike.fromNotes) isn't an activity", async () => {
    const { itemStrikeActivity } = await import("../src/adapter/items.js");
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, strike: { ...FEAR_GEM.strike, fromNotes: true } }, { id: "g" }), null);
});

test("2026-10-18: a zone's save only for creatures with some traits (Sanctified Beans' undead and the like) passes the others by", async () => {
    const { zoneSpell, zoneTurn } = await import("../src/engine/zones.js");
    const savePlan = { ...PARALYZE_LIKE, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 40 } } } };
    const plan = { builtin: "zone", trigger: { event: "use" }, actions: 1, zone: { area: { type: "emanation", value: 5 }, centre: "self", lasts: { mode: "fixed", value: 1, unit: "minutes" }, saves: [{ when: ["end"], plan: savePlan, only: { traits: ["undead", "fiend"] } }] } };
    for (const [traits, frightened] of [[["humanoid"], false], [["undead"], true]]) {
        const { state, pc, brute } = setUp({ potions: 0 });
        brute.traits = traits;
        pc.spells = [...pc.spells, { ...zoneSpell("Test Beans", plan, {}), pool: null }];
        state.rng.d20 = () => 2;
        castSpell(state, pc, pc.spells.length - 1, [pc.id]);
        zoneTurn(state, brute, "start");
        zoneTurn(state, brute, "end");
        assert.equal((brute.cond.frightened ?? 0) > 0, frightened, JSON.stringify(traits));
    }
});

test("2026-10-26: a zone's save only for a size or larger (only.minSize, the item module's 'Large or larger' snares) passes a smaller creature by", async () => {
    const { zoneSpell, zoneTurn } = await import("../src/engine/zones.js");
    const savePlan = { ...PARALYZE_LIKE, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 40 } } } };
    const plan = { builtin: "zone", trigger: { event: "use" }, actions: 1, zone: { area: { type: "emanation", value: 5 }, centre: "self", lasts: { mode: "fixed", value: 1, unit: "minutes" }, saves: [{ when: ["end"], plan: savePlan, only: { minSize: "lg" } }] } };
    for (const [size, frightened, only] of [["med", false], ["lg", true], ["grg", true], ["lg", false, { maxSize: "med" }], ["sm", true, { maxSize: "med" }]]) {
        const { state, pc, brute } = setUp({ potions: 0 });
        brute.size = size;
        const used = only ? { ...plan, zone: { ...plan.zone, saves: [{ ...plan.zone.saves[0], only }] } } : plan;
        pc.spells = [...pc.spells, { ...zoneSpell("Test Stakes", used, {}), pool: null }];
        state.rng.d20 = () => 2;
        castSpell(state, pc, pc.spells.length - 1, [pc.id]);
        zoneTurn(state, brute, "start");
        zoneTurn(state, brute, "end");
        assert.equal((brute.cond.frightened ?? 0) > 0, frightened, `${size} ${JSON.stringify(only ?? {})}`);
    }
});

test("2026-10-18: a thrown item (Sack of Rotten Fruit) — its user's thrown Strike's attack, then its save at the creature hit; no save on a miss", () => {
    const save = { ...PARALYZE_LIKE, resolution: { ...PARALYZE_LIKE.resolution, check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 40 } } } };
    const sack = { ...SPELLGUN, source: { name: "Test Sack" }, ownCheck: { kind: "attack", modifier: null, choose: ["thrown"] }, thenSave: save };
    const entry = itemEntry(sack, { id: "s", quantity: 2 });
    assert.deepEqual([entry.ownAttack, Boolean(entry.thenSave)], [["thrown"], true]);
    for (const [die, frightened] of [[15, true], [1, false]]) {
        const [fighter] = martialParty(5);
        const knife = { name: "Test Knife", bonus: 13, melee: false, thrown: true, increment: 10, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] };
        const state = createFightState({ combatants: [{ ...fighter, band: "near", engagement: 1, strikes: [...fighter.strikes, knife], spells: [entry], spellPools: { [entry.pool]: 2 } }, { ...moderateCreature(5, "brute", "Brute"), band: "near", engagement: 1 }] }, {}, 1);
        state.log = [];
        state.round = 1;
        const pc = state.byId.get(fighter.id);
        assert.deepEqual(pc.spells[0].ownAttacks, { thrown: 13 });
        state.rng.d20 = () => die;
        castSpell(state, pc, 0, ["brute"]);
        assert.equal((state.byId.get("brute").cond.frightened ?? 0) > 0, frightened, state.log.join("\n"));
    }
});
