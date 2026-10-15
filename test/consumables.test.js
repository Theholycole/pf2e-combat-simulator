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
    // (Extras on the Strike itself, more damage or an attack bonus: not played without them.)
    assert.equal(itemStrikeActivity({ ...FEAR_GEM, strike: { ...FEAR_GEM.strike, damage: [{ diceNumber: 4, dieSize: "d6", damageType: "mental" }] } }, { id: "g" }), null);
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
