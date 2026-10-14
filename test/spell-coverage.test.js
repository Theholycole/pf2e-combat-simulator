import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { castSpell } from "../src/engine/spells.js";
import { performStrike } from "../src/engine/actions.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage } from "../src/engine/actions.js";
import { saveModifier, statusPenalty } from "../src/engine/combatant.js";
import { armorClass } from "../src/engine/combatant.js";
import { effectModel } from "../src/engine/effects.js";

// Spell coverage (the user, 2026-10-14: "i want more spell coverage in the simulator. Spells like shield, Wails of the damned, evil
// eye, calm").

// PF2e's Spell Effect: Shield rules.
const SHIELD_EFFECT = { name: "Spell Effect: Shield", system: { duration: { expiry: "turn-start", unit: "rounds", value: 1 }, rules: [
    { key: "ActiveEffectLike", mode: "override", path: "system.attributes.shield", predicate: [{ or: ["self:type:character", "self:type:npc"] }], value: { ac: 1, broken: false, hp: { max: 0, value: 0 }, raised: true } },
    { key: "ActiveEffectLike", mode: "override", path: "system.attributes.shield.hardness", predicate: [{ or: ["self:type:character", "self:type:npc"] }], value: "5*ceil(@item.level/2)" },
    { key: "RollOption", option: "self:shield:equipped" }
] } };

test("Shield: PF2e's effect read as a magic shield (Hardness 5 per two ranks)", () => {
    assert.deepEqual(effectModel(SHIELD_EFFECT, { rank: 1 }).spellShield, { ac: 1, hardness: 5 });
    assert.deepEqual(effectModel(SHIELD_EFFECT, { rank: 5 }).spellShield, { ac: 1, hardness: 15 });
});

test("Shield: cast to raise its magic shield (+1 AC), Shield Block without the feat, against a spell too; blocking ends it for the fight", () => {
    const shield = { name: "Shield", plan: { modelVersion: 12, source: { name: "Shield" }, rank: 1, traits: ["cantrip", "force"], activation: { time: "1" }, targeting: {}, resolution: { kind: "unsupported" } }, castRank: 3, pool: null, spellShield: { ac: 1, hardness: 10 } };
    const mage = { ...moderateCreature(5, "mage", "Mage"), spells: [shield], spellPools: {}, engagement: 1, hp: { value: 200, max: 200 }, reactions: { aoo: false, shieldBlock: false } };
    const state = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), mage] }, {}, 1);
    state.log = [];
    const c = state.byId.get("mage");
    assert.equal(c.shield.spell, true);
    const before = armorClass(c);
    c.actionsLeft = 3;
    assert.ok(scoreOptions(state, c).options.some((option) => option.action.type === "raiseShield"));
    performAction(state, c, { type: "raiseShield" });
    assert.ok(state.log.includes("  Mage casts Shield"), state.log.join("\n"));
    assert.equal(armorClass(c), before + 1);
    // A spell's 30 fire: Hardness 10 off it, and the spell ends.
    const pc = state.list.find((other) => other.kind === "pc");
    const hp = c.hp.value;
    applyDamage(state, c, [{ type: "fire", amount: 30 }], { source: pc, spell: { rank: 3, targeted: true } });
    assert.equal(hp - c.hp.value, 20);
    assert.ok(state.log.some((line) => line.includes("Mage Shield Blocks (10 prevented, Shield ends)")), state.log.join("\n"));
    assert.equal(c.shield.broken, true);
    c.actionsLeft = 3;
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "raiseShield"), "not again this fight");
});

// Calm, as the spell module compiles it: a Will save in a 10-foot burst; the success's note carries PF2e's -1 to attack rolls, the
// failure's "can't use hostile actions" ends with any hostility, the critical failure's doesn't.
const calmNote = { label: "No hostile actions against the caster", text: "Any emotion effects that would affect the creature are suppressed and the creature can't use hostile actions. If the target is subject to hostility from any other creature, it ceases to be affected by calm .", gmPlays: true, duration: { mode: "fixed", value: 1, unit: "minutes", sustained: true } };
const row = (extra = {}) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...extra });
const CALM = { modelVersion: 12, source: { name: "Calm" }, rank: 2, traits: ["concentrate", "emotion", "incapacitation", "manipulate", "mental"], activation: { time: "2", traits: ["concentrate", "manipulate"] },
    targeting: { target: null, range: "120 feet", area: { type: "burst", value: 10 } },
    resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: {
        criticalSuccess: row(),
        success: row({ noteEffects: [{ label: "Penalty", text: "Calming urges impose a -1 status penalty to the creature's attack rolls.", rules: [{ key: "FlatModifier", selector: "attack-roll", type: "status", value: -1 }], duration: { mode: "fixed", value: 1, unit: "minutes", sustained: true } }] }),
        failure: row({ noteEffects: [calmNote] }),
        criticalFailure: row({ noteEffects: [calmNote], rawText: "Critical Failure As failure, but hostility doesn't end the effect." })
    } } };

// (DC 20 against the brute's Will: rolls set for each degree by its modifier.)
const rollFor = (brute, degree) => () => Math.max(2, Math.min(19, (degree === "failure" ? 19 : 20) - saveModifier(brute, "will")));
function calmFight({ apart = false } = {}) {
    const calm = { name: "Calm", plan: CALM, castRank: 2, dc: 20, attack: 20, pool: null };
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [calm], spellPools: {}, band: "near" };
    const brute = { ...moderateCreature(5, "brute", "Brute"), ...(apart ? { band: "near" } : { engagement: 1 }), hp: { value: 300, max: 300 } };
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, ...(apart ? { band: "far" } : { engagement: 1 }) }, mage, brute] }, {}, 1);
    state.log = [];
    return { state, mage: state.byId.get("mage"), brute: state.byId.get("brute"), fighter: state.byId.get(fighter.id) };
}

test("Calm: a failure stops hostile actions until someone turns on it; the caster Sustains it; a success's -1 to attack rolls", () => {
    const { state, mage, brute, fighter } = calmFight();
    state.rng.d20 = rollFor(brute, "failure");
    castSpell(state, mage, 0, [brute.id]);
    assert.equal(brute.pacified[0].endsOn, "any", state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Brute can't use hostile actions (Calm)")), state.log.join("\n"));
    brute.actionsLeft = 3;
    const options = scoreOptions(state, brute).options.map((option) => option.action.type);
    assert.ok(!options.includes("strike") && !options.includes("cast"), options.join(","));
    // The mage's turn: an action to Sustain it.
    mage.actionsLeft = 3;
    performAction(state, mage, { type: "stride", move: { kind: "toNear" } });
    // A Strike at it, hit or miss: hostility ends it.
    performStrike(state, fighter, brute, fighter.strikes[0]);
    assert.equal(brute.pacified.length, 0);
    assert.ok(state.log.some((line) => line.includes("Brute is no longer under Calm")));
    // A success: -1 status to its attack rolls.
    const other = calmFight();
    other.state.rng.d20 = rollFor(other.brute, "success");
    castSpell(other.state, other.mage, 0, [other.brute.id]);
    assert.equal(statusPenalty(other.brute, "melee"), 1, other.state.log.join("\n"));
});

test("Calm: a critical failure's hostility doesn't end it; the caster Sustains it each turn; the planner values the cast at a foe apart", () => {
    const { state, mage, brute, fighter } = calmFight();
    state.rng.d20 = () => 1;
    castSpell(state, mage, 0, [brute.id]);
    assert.equal(brute.pacified[0].endsOn, null, state.log.join("\n"));
    state.rng.d20 = () => 10;
    performStrike(state, fighter, brute, fighter.strikes[0]);
    assert.equal(brute.pacified.length, 1, "still calm");
    // A fresh planner: casting Calm at a foe standing apart is worth something.
    const fresh = calmFight({ apart: true });
    fresh.mage.actionsLeft = 3;
    assert.ok(scoreOptions(fresh.state, fresh.mage).options.some((option) => option.action.type === "cast" && option.value > 0));
});

test("Calm in whole fights: cast, Sustained on the caster's turns, and the fight still ends", () => {
    const calm = { name: "Calm", plan: CALM, castRank: 2, dc: 24, attack: 20, pool: "c" };
    const snapshot = { combatants: [...martialParty(5), { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [calm], spellPools: { c: 1 }, band: "near" }, { ...moderateCreature(5, "brute", "Brute") }, { ...moderateCreature(5, "other", "Other"), band: "near" }] };
    const lines = [];
    for (let seed = 1; seed <= 12; seed++) {
        const result = simulate(snapshot, {}, seed, { log: true });
        assert.ok(["decisive", "defeat"].includes(result.outcome) || result.outcome, result.outcome);
        lines.push(...result.log);
    }
    assert.ok(lines.some((line) => line.includes("casts Calm")));
    assert.ok(lines.some((line) => line.includes("Sustains Calm")));
});

test("No hostile actions: the wordings — all of them (Calm) or none against the caster (the charms), and what ends each", async () => {
    const { pacifyOf, spares } = await import("../src/engine/pacify.js");
    const note = (text) => ({ label: "No hostile actions against the caster", text });
    assert.deepEqual(pacifyOf(note("Any emotion effects that would affect the creature are suppressed and the creature can't use hostile actions. If the target is subject to hostility from any other creature, it ceases to be affected by calm .")), { all: true, endsOn: "any", allies: false });
    assert.deepEqual(pacifyOf(note("The target can't use hostile actions against you.")), { all: false, endsOn: null, allies: false });
    assert.deepEqual(pacifyOf(note("It can't use hostile actions against you. If you use hostile actions against the target, the spell ends.")), { all: false, endsOn: "caster", allies: false });
    assert.deepEqual(pacifyOf(note("It can't take hostile actions against you, though the effect ends as soon as you take a hostile action against the creature or its allies.")), { all: false, endsOn: "caster", allies: true });
    assert.equal(pacifyOf({ label: "Attitude", text: "It becomes friendly." }), null);
    // A charmed brute won't target the mage, until the mage attacks it.
    const charm = { modelVersion: 12, source: { name: "Charm" }, rank: 1, traits: ["mental"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" },
        resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: row(), success: row(), failure: row({ noteEffects: [{ ...note("It can't use hostile actions against you. If you use hostile actions against the target, the spell ends."), duration: { mode: "fixed", value: 1, unit: "hours" } }] }), criticalFailure: row() } } };
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: "Charm", plan: charm, castRank: 1, dc: 20, attack: 12, pool: null }], spellPools: {}, engagement: 1, strikes: [{ name: "Staff", bonus: 8, melee: true, agile: false, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] }] };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(5, "brute", "Brute"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    const caster = state.byId.get("mage");
    const brute = state.byId.get("brute");
    state.rng.d20 = rollFor(brute, "failure");
    castSpell(state, caster, 0, [brute.id]);
    assert.equal(spares(brute, caster), true);
    brute.actionsLeft = 3;
    assert.ok(!scoreOptions(state, brute).options.some((option) => option.action.type === "strike" && option.action.targetId === "mage"));
    performStrike(state, caster, brute, caster.strikes[0]);
    assert.equal(spares(brute, caster), false);
});

test("Evil Eye: the simulator's reading when the compiler leaves it unplanned; sickened 1 that Retch can't shake while it's sustained", async () => {
    const { withReading } = await import("../src/engine/readings.js");
    const { floorOf } = await import("../src/engine/floors.js");
    const { retch } = await import("../src/engine/spells.js");
    const unplanned = { modelVersion: 12, source: { name: "Evil Eye", slug: "evil-eye" }, rank: 1, traits: ["cantrip", "curse", "hex", "manipulate"], activation: { time: "1" }, targeting: { target: "1 creature", range: "30 feet" },
        lifecycle: { durationSpec: { mode: "sustained", maximum: { mode: "fixed", value: 1, unit: "minutes" } }, sustained: true }, resolution: { kind: "unsupported", native: { check: { statistic: "will", basic: false } } } };
    const plan = withReading(unplanned);
    assert.equal(plan.resolution.kind, "save");
    assert.equal(plan.simulatorReading, true);
    // A plan the compiler did build stays as it is.
    assert.equal(withReading({ ...unplanned, resolution: { kind: "save", outcomes: {} } }).simulatorReading, undefined);
    const witch = { ...moderateCreature(5, "witch", "Witch"), spells: [{ name: "Evil Eye", plan, castRank: 3, dc: 20, attack: 12, pool: null }], spellPools: {}, band: "near" };
    const state = createFightState({ combatants: [{ ...martialParty(5)[0], band: "near" }, witch] }, {}, 1);
    const caster = state.byId.get("witch");
    const pc = state.list.find((c) => c.kind === "pc");
    state.rng.d20 = () => Math.max(2, 19 - saveModifier(pc, "will"));
    castSpell(state, caster, 0, [pc.id]);
    assert.equal(pc.cond.sickened, 1);
    assert.equal(floorOf(pc, "sickened"), 1);
    pc.sickenedDC = 20;
    state.rng.d20 = () => 20;
    retch(state, pc);
    assert.equal(pc.cond.sickened, 1, "not below 1 while it lasts");
    // Its caster gone: nobody sustains it, and Retch works again.
    caster.status = "dead";
    const { lastingTurnStart } = await import("../src/engine/lasting.js");
    lastingTurnStart(state, pc);
    assert.equal(floorOf(pc, "sickened"), 0);
    retch(state, pc);
    assert.equal(pc.cond.sickened, 0);
});

test("Condition floors: frightened 1 while stupefied (Lift Nature's Caul), while bleeding (Horrifying Blood Loss)", async () => {
    const { addFloor, floorOf } = await import("../src/engine/floors.js");
    const state = createFightState({ combatants: [...martialParty(5).slice(0, 1), { ...moderateCreature(5, "foe", "Foe") }] }, {}, 1);
    const pc = state.list.find((c) => c.kind === "pc");
    const foe = state.byId.get("foe");
    const spell = { name: "Lift Nature's Caul", plan: {} };
    pc.cond.frightened = 2;
    pc.cond.stupefied = 1;
    addFloor(state, pc, foe, spell, { slug: "frightened", value: 1, lifetime: "while-condition", whileCondition: { slug: "stupefied" } });
    assert.equal(floorOf(pc, "frightened"), 1);
    pc.cond.stupefied = 0;
    assert.equal(floorOf(pc, "frightened"), 0);
    addFloor(state, pc, foe, { name: "Horrifying Blood Loss", plan: {} }, { slug: "frightened", value: 1, lifetime: "while-persistent", persistentDamage: "bleed" });
    assert.equal(floorOf(pc, "frightened"), 0);
    pc.persistent = [{ type: "bleed", dice: 1, die: 6 }];
    assert.equal(floorOf(pc, "frightened"), 1);
});

// The core's condition-note and stabilize families (2026-10-14).
const conditionNotePlan = (name, note, durationSpec, targeting) => ({ modelVersion: 12, source: { name }, rank: 2, traits: ["illusion"], activation: { time: "2" }, targeting, lifecycle: { durationSpec },
    resolution: { kind: "condition-note", conditionNote: note } });

test("Invisibility: on an ally (the planner's pick), hidden to its foes; its attack leaves the target off-guard, then it ends", async () => {
    const { offGuardFrom } = await import("../src/engine/passives.js");
    const invisibility = conditionNotePlan("Invisibility", { recipient: "target", condition: { slug: "invisible", value: null }, text: "Illusions bend light around the target, rendering it Invisible. If the target uses a hostile action, the spell ends after that hostile action is completed.", heightened: [{ rank: 4, text: "The spell doesn't end if the target uses a hostile action." }] }, { mode: "fixed", value: 10, unit: "minutes" }, { target: "1 creature", range: "touch" });
    const [fighter, rogue] = martialParty(5);
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: "Invisibility", plan: invisibility, castRank: 2, dc: 20, attack: 12, pool: null }], spellPools: {}, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...rogue, engagement: 1 }, mage, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    const caster = state.byId.get("mage");
    caster.actionsLeft = 3;
    const cast = scoreOptions(state, caster).options.filter((option) => option.action.type === "cast");
    assert.ok(cast.length && cast.every((option) => state.byId.get(option.action.targetIds[0]).side === "party"), "aimed at its side");
    const ally = state.byId.get(fighter.id);
    castSpell(state, caster, 0, [ally.id]);
    assert.equal(ally.cond.hidden, true);
    const foe = state.byId.get("foe");
    assert.equal(offGuardFrom(state, ally, foe), true);
    performStrike(state, ally, foe, ally.strikes[0]);
    assert.equal(ally.cond.hidden, false);
    assert.ok(state.log.some((line) => line.includes(`${ally.name} is no longer invisible`)), state.log.join("\n"));
});

test("Dirge of Doom: frightened 1 on the enemies around, not below 1 while it lasts; Stabilize: a dying ally stable", async () => {
    const { floorOf } = await import("../src/engine/floors.js");
    const dirge = conditionNotePlan("Dirge of Doom", { recipient: "area-enemies", condition: { slug: "frightened", value: 1 }, text: "Enemies within the area are Frightened 1. They can't reduce their frightened value below 1 while they remain in the area." }, { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" }, { target: null, range: null, area: { type: "emanation", value: 30 } });
    const [fighter] = martialParty(5);
    const bard = { ...moderateCreature(5, "bard", "Bard"), side: "party", kind: "npc", spells: [{ name: "Dirge of Doom", plan: dirge, castRank: 3, dc: 20, attack: 12, pool: null }], spellPools: {}, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, bard, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const caster = state.byId.get("bard");
    castSpell(state, caster, 0, ["foe", fighter.id]);
    assert.equal(state.byId.get("foe").cond.frightened, 1);
    assert.equal(state.byId.get(fighter.id).cond.frightened, 0, "not its own side");
    assert.equal(floorOf(state.byId.get("foe"), "frightened"), 1);
    // Stabilize.
    const stabilize = { modelVersion: 12, source: { name: "Stabilize" }, rank: 1, traits: ["cantrip", "healing"], activation: { time: "2" }, targeting: { target: "1 dying creature", range: "30 feet" }, resolution: { kind: "stabilize", stabilize: { sourceText: "The target loses the Dying condition" } } };
    const cleric = { ...moderateCreature(5, "cleric", "Cleric"), side: "party", kind: "npc", spells: [{ name: "Stabilize", plan: stabilize, castRank: 3, dc: 20, attack: 12, pool: null }], spellPools: {}, band: "near" };
    const other = createFightState({ combatants: [{ ...fighter, band: "near" }, cleric, { ...moderateCreature(5, "foe", "Foe"), band: "far" }] }, {}, 1);
    const pc = other.byId.get(fighter.id);
    pc.hp.value = 0;
    pc.status = "down";
    pc.cond.dying = 2;
    const healer = other.byId.get("cleric");
    healer.actionsLeft = 3;
    const option = scoreOptions(other, healer).options.find((entry) => entry.action.type === "cast");
    assert.ok(option && option.value > 0);
    performAction(other, healer, option.action);
    assert.equal(pc.cond.dying, 0);
});

test("Calm: its allies leave a calmed foe alone while another foe stands, and take it on once it's the last", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "calm", "Calmed"), engagement: 1 }, { ...moderateCreature(5, "other", "Other"), engagement: 1 }] }, {}, 1);
    const calmed = state.byId.get("calm");
    calmed.pacified = [{ by: "x", spell: "Calm", all: true, endsOn: "any", allies: false, untilRound: 10, sustained: false }];
    const pc = state.byId.get(fighter.id);
    pc.actionsLeft = 3;
    const best = scoreOptions(state, pc).options.filter((option) => option.action.type === "strike").sort((a, b) => b.score - a.score)[0];
    assert.equal(best.action.targetId, "other");
    state.byId.get("other").status = "dead";
    const last = scoreOptions(state, pc).options.filter((option) => option.action.type === "strike").sort((a, b) => b.score - a.score)[0];
    assert.equal(last.action.targetId, "calm");
});

// Dispel Magic, Clear Mind (the core's affliction-care family, 2026-10-14).
const carePlan = (name, operations, target) => ({ modelVersion: 12, source: { name }, rank: 2, traits: [], activation: { time: "2" }, targeting: { target, range: "120 feet" }, resolution: { kind: "affliction-care", recipient: "counteract-target", modes: [], operations } });

test("Dispel Magic: counteracts a foe's spell effect (Haste and its quickened), by PF2e's counteract check and ranks; the planner aims it there", async () => {
    const { applyEffect } = await import("../src/engine/effects.js");
    const { counterChance } = await import("../src/engine/counteract.js");
    const dispel = carePlan("Dispel Magic", [{ op: "counteract", pick: 1, source: "spell-effect", traits: [], grantsConditions: [], otherTargets: true }], "1 spell effect or unattended magic item");
    const mage = { ...moderateCreature(7, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: "Dispel Magic", plan: dispel, castRank: 2, dc: 25, attack: 15, pool: null }], spellPools: {}, band: "near" };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(7, "foe", "Foe"), band: "near" }] }, {}, 1);
    const caster = state.byId.get("mage");
    const foe = state.byId.get("foe");
    const haste = { name: "Spell Effect: Haste", rounds: 10, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [{ slug: "quickened", value: null }], unsupported: [], situational: 0 };
    const { applyCondition } = await import("../src/engine/spells.js");
    applyEffect(state, foe, haste, foe, { applyCondition, key: "haste", counter: { dc: 22, rank: 3, spell: true } });
    assert.equal(foe.cond.quickened, true);
    // A 2nd-rank Dispel (+15) against DC 22: a 3rd-rank effect on a success or better (a 7 or more), a 4th-rank one only on a
    // critical success (17 or more), a 6th-rank one never.
    assert.ok(Math.abs(counterChance(15, 2, { dc: 22, rank: 3 }) - 0.7) < 1e-9);
    assert.ok(Math.abs(counterChance(15, 2, { dc: 22, rank: 4 }) - 0.2) < 1e-9);
    assert.equal(counterChance(15, 2, { dc: 22, rank: 6 }), 0);
    caster.actionsLeft = 3;
    assert.ok(scoreOptions(state, caster).options.some((option) => option.action.type === "cast" && option.action.targetIds[0] === "foe" && option.value > 0));
    state.rng.d20 = () => 18;
    castSpell(state, caster, 0, ["foe"]);
    assert.equal(foe.cond.quickened, false);
    assert.ok(!(foe.effects ?? []).some((effect) => effect.key === "haste"));
    assert.ok(state.log.some((line) => line.includes("Dispel Magic against Haste on Foe: 33 vs 22 → counteracted")), state.log.join("\n"));
});

test("Clear Mind: lifts an ally's frightened from a spell; nothing to counteract on a foe without one", () => {
    const fear = { modelVersion: 12, source: { name: "Fear", uuid: "Compendium.pf2e.spells-srd.Item.x" }, rank: 1, traits: ["emotion", "fear", "mental"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" },
        resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: row(), success: row({ effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }), failure: row({ effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }), criticalFailure: row({ effects: [{ kind: "condition", slug: "frightened", value: 3, duration: null }] }) } } };
    const clear = carePlan("Clear Mind", [{ op: "counteract", pick: 1, source: "effect", traits: [], grantsConditions: ["fleeing", "frightened", "stupefied"] }], "1 willing creature");
    clear.resolution.recipient = "target";
    const [fighter] = martialParty(5);
    const witch = { ...moderateCreature(5, "witch", "Witch"), spells: [{ name: "Fear", plan: fear, castRank: 1, dc: 20, attack: 12, pool: null }], spellPools: {}, band: "near" };
    const cleric = { ...moderateCreature(5, "cleric", "Cleric"), side: "party", kind: "npc", spells: [{ name: "Clear Mind", plan: clear, castRank: 3, dc: 22, attack: 14, pool: null }], spellPools: {}, band: "near" };
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, cleric, witch] }, {}, 1);
    const pc = state.byId.get(fighter.id);
    state.rng.d20 = () => 2;
    castSpell(state, state.byId.get("witch"), 0, [pc.id]);
    assert.ok(pc.cond.frightened >= 2);
    assert.equal(pc.condSources.frightened.rank, 1);
    state.rng.d20 = () => 10;
    castSpell(state, state.byId.get("cleric"), 0, [pc.id]);
    assert.equal(pc.cond.frightened, 0, state.log.join("\n"));
    state.log = [];
    castSpell(state, state.byId.get("cleric"), 0, ["witch"]);
    assert.ok(state.log.some((line) => line.includes("finds nothing to counteract on Witch")));
});

// Notes as states (2026-10-14): can't use reactions, Command, dancing; fascinated and deafened.
const noteSave = (name, byDegree, extra = {}) => ({ modelVersion: 12, source: { name }, rank: 1, traits: ["mental"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" },
    resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: row(), success: row(byDegree.success ?? {}), failure: row(byDegree.failure ?? {}), criticalFailure: row(byDegree.criticalFailure ?? byDegree.failure ?? {}) } }, ...extra });

test("Command: the target spends its next turn's first action (all of them on a critical failure) dropping prone", () => {
    const command = noteSave("Command", {
        failure: { noteEffects: [{ label: "Actions on its next turn", text: "For the first action on its next turn, the creature must use a single action to do as you command." }] },
        criticalFailure: { noteEffects: [{ label: "Actions on its next turn", text: "The target must use all its actions on its next turn to obey your command." }] }
    });
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: "Command", plan: command, castRank: 1, dc: 22, attack: 12, pool: null }], spellPools: {}, band: "near" };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(5, "foe", "Foe"), band: "near" }] }, {}, 1);
    const foe = state.byId.get("foe");
    state.rng.d20 = rollFor(foe, "failure");
    castSpell(state, state.byId.get("mage"), 0, ["foe"]);
    assert.deepEqual(foe.commanded, { by: "mage", spell: "Command", actions: 1 });
    state.byId.get("mage").actionsLeft = 3;
    assert.ok(scoreOptions(state, state.byId.get("mage")).options.some((option) => option.action.type === "cast" && option.value > 0));
});

test("Can't use reactions (Laughing Fit, Spirit Song's until its own turn); Uncontrollable Dance's actions; fascinated and deafened", async () => {
    const { canReact } = await import("../src/engine/abilities.js");
    const { noteState } = await import("../src/engine/note-states.js");
    const { statusPenalty } = await import("../src/engine/combatant.js");
    assert.deepEqual(noteState({ label: "Reactions", text: "It can't use reactions, it dances at half its Speed instead of moving normally, and it must spend at least 2 actions each turn dancing." }), { kind: "no-reactions", ownTurn: false, dance: 2 });
    assert.deepEqual(noteState({ label: "No reactions", text: "The creature can't use reactions until the beginning of its turn." }), { kind: "no-reactions", ownTurn: true, dance: 0 });
    const fit = noteSave("Laughing Fit", { failure: { noteEffects: [{ label: "Reactions", text: "The target can't use reactions.", duration: { mode: "fixed", value: 1, unit: "minutes" } }] } });
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: "Laughing Fit", plan: fit, castRank: 2, dc: 22, attack: 12, pool: null }], spellPools: {}, band: "near" };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(5, "foe", "Foe"), band: "near", reactions: { aoo: true, shieldBlock: false } }] }, {}, 1);
    const foe = state.byId.get("foe");
    assert.equal(canReact(foe), true);
    state.rng.d20 = rollFor(foe, "failure");
    castSpell(state, state.byId.get("mage"), 0, ["foe"]);
    assert.equal(canReact(foe), false);
    // Fascinated: -2 Perception, and hostility to any of its side ends it.
    foe.cond.fascinated = true;
    assert.equal(statusPenalty(foe, "perception"), 2);
    applyDamage(state, foe, [{ type: "fire", amount: 1 }], { source: state.byId.get("mage") });
    assert.equal(foe.cond.fascinated, false);
});

test("Readings of areas the compiler leaves without one: Grease's 4 contiguous squares, Shadow Blast's choice of areas", async () => {
    const { withReading } = await import("../src/engine/readings.js");
    const grease = withReading({ modelVersion: 12, source: { name: "Grease", slug: "grease" }, targeting: { target: "4 contiguous 5-foot squares", range: "30 feet", area: null }, resolution: { kind: "save", outcomes: {} } });
    assert.deepEqual(grease.targeting.area, { type: "burst", value: 10 });
    assert.equal(grease.targeting.range, "30 feet");
    const blast = withReading({ modelVersion: 12, source: { name: "Shadow Blast", slug: "shadow-blast" }, targeting: { target: null, range: "varies", area: null }, resolution: { kind: "save", outcomes: {} } });
    assert.deepEqual([blast.targeting.range, blast.targeting.area], ["120 feet", { type: "burst", value: 15 }]);
    // A plan with its own area stays as it is.
    const fireball = { modelVersion: 12, source: { name: "Fireball", slug: "fireball" }, targeting: { range: "500 feet", area: { type: "burst", value: 20 } }, resolution: { kind: "save" } };
    assert.equal(withReading(fireball), fireball);
});

test("Lingering spells (Toxic Cloud): the area stays as a zone; a foe starting its turn in it saves again with the spell's DC; no recast while it's up; a sustained one costs its caster an action", async () => {
    const { zoneTurn } = await import("../src/engine/zones.js");
    const { canCast } = await import("../src/engine/spells.js");
    const cloud = { modelVersion: 12, source: { name: "Toxic Cloud" }, rank: 5, traits: ["poison"], activation: { time: "3" }, targeting: { target: null, range: "120 feet", area: { type: "burst", value: 10 } },
        resolution: { kind: "save", check: { statistic: "fortitude", basic: true },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d8", type: "poison" }] },
            outcomes: { criticalSuccess: row(), success: row({ damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } }), failure: row({ damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } }), criticalFailure: row({ damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }) },
            lingering: { events: ["turn-start"], initial: true, oncePerRound: false, excludeCaster: false, enemiesOnly: false, area: { type: "burst", value: 10 }, centre: "placed", durationSeconds: 60, sustained: false, concealment: true } } };
    const [fighter] = martialParty(9);
    const mage = { ...moderateCreature(9, "mage", "Mage"), spells: [{ name: "Toxic Cloud", plan: cloud, castRank: 5, dc: 28, attack: 18, pool: null }], spellPools: {}, band: "far" };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(9, "brute", "Brute"), engagement: 1 }, mage] }, {}, 1);
    const caster = state.byId.get("mage");
    const pc = state.byId.get(fighter.id);
    castSpell(state, caster, 0, [pc.id]);
    assert.equal(state.zones.length, 1);
    assert.equal(state.zones[0].model.castAs.dc, 28);
    assert.equal(canCast(caster, caster.spells[0]), false, "not again while it's up");
    assert.equal(pc.cond.concealed, true);
    state.log = [];
    const before = pc.hp.value;
    zoneTurn(state, pc, "start");
    assert.ok(state.log.some((line) => line.includes("Toxic Cloud on Fighter")), state.log.join("\n"));
    assert.ok(pc.hp.value <= before);
    // Sustained: the caster's action each turn, or the area ends.
    state.zones[0].model.sustained = true;
    caster.actionsLeft = 3;
    zoneTurn(state, caster, "start");
    assert.equal(caster.actionsLeft, 2);
    caster.actionsLeft = 0;
    zoneTurn(state, caster, "start");
    assert.equal(state.zones.length, 0);
});

test("Vampiric temporary HP from the damage dealt; a Speed penalty while it lasts; Confusion's failure saves at each turn's end", async () => {
    const { applyEffect, removeEffect, modifierModel } = await import("../src/engine/effects.js");
    const { withReading } = await import("../src/engine/readings.js");
    // Vampiric Feast: half the void damage dealt as the caster's temporary HP.
    const feast = { modelVersion: 12, source: { name: "Vampiric Feast" }, rank: 6, traits: ["death", "void"], activation: { time: "2" }, targeting: { target: "1 living creature", range: "touch" },
        resolution: { kind: "save", check: { statistic: "fortitude", basic: true }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "12d6", type: "void" }] },
            casterBenefit: { kind: "temp-hp", aggregate: "single-target", condition: "always", fraction: 0.5, damageType: "void" },
            outcomes: { criticalSuccess: row(), success: row({ damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } }), failure: row({ damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } }), criticalFailure: row({ damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }) } } };
    const [fighter] = martialParty(11);
    const vampire = { ...moderateCreature(11, "vamp", "Vampire"), spells: [{ name: "Vampiric Feast", plan: feast, castRank: 6, dc: 30, attack: 20, pool: null }], spellPools: {}, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, vampire] }, {}, 1);
    const caster = state.byId.get("vamp");
    const pc = state.byId.get(fighter.id);
    state.rng.d20 = () => 2;
    state.rng.die = () => 4;
    const before = pc.hp.value;
    castSpell(state, caster, 0, [pc.id]);
    const dealt = before - pc.hp.value;
    assert.ok(dealt > 0);
    assert.equal(caster.hp.temp, Math.floor(dealt / 2), state.log.join("\n"));
    // Grasping Grave's -10 feet to its Speeds, for the effect's time.
    const slowed = modifierModel("Grasping Grave", { kind: "speed-penalty", selector: "all-speeds", modifierType: "circumstance", value: -10, duration: { mode: "fixed", value: 1, unit: "rounds" } });
    const speed = pc.speed;
    const effect = applyEffect(state, pc, slowed, caster, { key: "grave" });
    assert.equal(pc.speed, speed - 10);
    removeEffect(pc, effect);
    assert.equal(pc.speed, speed);
    // Confusion: the failure's "new save at the end of each of its turns" read as saveEnds against the spell's DC.
    const confusion = withReading({ modelVersion: 12, source: { name: "Confusion", slug: "confusion" }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "save", check: { statistic: "will" }, outcomes: {
        failure: { effects: [{ kind: "condition", slug: "confused", value: null, duration: { mode: "fixed", value: 1, unit: "minutes" } }], rawText: "The target is Confused for 1 minute. It can attempt a new save at the end of each of its turns to end the confusion." },
        criticalFailure: { effects: [{ kind: "condition", slug: "confused", value: null, duration: { mode: "fixed", value: 1, unit: "minutes" } }], rawText: "The target is Confused for 1 minute, with no save to end early.", noRecurringSave: true } } } });
    assert.deepEqual(confusion.resolution.outcomes.failure.effects[0].duration.saveEnds, { save: "will", dc: "spell" });
    assert.equal(confusion.resolution.outcomes.criticalFailure.effects[0].duration.saveEnds, undefined);
});

test("Readings that need a row's own words survive the snapshot slimming them away (Calm's critical failure, Confusion's recurring save)", async () => {
    const { withReading } = await import("../src/engine/readings.js");
    const { pacifyOf } = await import("../src/engine/pacify.js");
    const read = withReading({ ...CALM, source: { name: "Calm", slug: "calm" } });
    const slim = JSON.parse(JSON.stringify(read, (key, value) => (key === "rawText" ? undefined : value)));
    assert.deepEqual(slim.rowFlags, { criticalFailure: { hostilityPersists: true } });
    const row = (degree) => ({ ...(slim.resolution.outcomes[degree] ?? {}), ...(slim.rowFlags?.[degree] ?? {}) });
    assert.equal(pacifyOf(calmNote, row("criticalFailure")).endsOn, null);
    assert.equal(pacifyOf(calmNote, row("failure")).endsOn, "any");
});

test("Summon spells: an entry for the engine's summons — the best creature of the spell's traits at its rank's level, sustained, as a minion; one spell from several slots, one entry", async () => {
    const { spellSummonEntry, summonEntries, bestPick } = await import("../src/engine/summons.js");
    const plan = (rank) => ({ modelVersion: 12, source: { name: "Summon Animal" }, rank: 1, activation: { time: "3" }, resolution: { kind: "summon", summon: { rangeFeet: 30, durationSeconds: 60, sustained: true, traits: ["animal"], levels: { table: "summon-trait", baseRank: 1 } } } });
    const entry = spellSummonEntry({ name: "Summon Animal", plan: plan(), castRank: 3 }, 1);
    assert.deepEqual({ actions: entry.actions, pick: entry.creature.pick, lasts: entry.lasts, sustained: entry.sustained, initiative: entry.initiative, uses: entry.uses }, { actions: 3, pick: { rank: { base: 3, max: 3 }, any: ["animal"] }, lasts: 10, sustained: true, initiative: "minion", uses: 1 });
    // Rank 3: a level-2 creature at most (PF2e's summon table).
    const pick = bestPick([{ name: "Wolf", level: 1, traits: ["animal"], type: "npc" }, { name: "Leopard", level: 2, traits: ["animal"], type: "npc" }, { name: "Grizzly Bear", level: 3, traits: ["animal"], type: "npc" }, { name: "Imp", level: 1, traits: ["fiend"], type: "npc" }], entry.creature.pick);
    assert.equal(pick.name, "Leopard");
    // Two slots (ranks 3 and 5): one entry, two uses, at rank 5.
    const both = summonEntries([entry, spellSummonEntry({ name: "Summon Animal", plan: plan(), castRank: 5 }, 1)]);
    assert.equal(both.length, 1);
    assert.equal(both[0].uses, 2);
    assert.equal(both[0].creature.pick.rank.max, 5);
    assert.equal(spellSummonEntry({ name: "Fireball", plan: { resolution: { kind: "save" } }, castRank: 3 }, 1), null);
});

test("Sanctuary: an attacker saves first (once a turn); a failure wastes the action, a critical failure bars it; the ward ends with its creature's hostile action", async () => {
    const { wardChance } = await import("../src/engine/wards.js");
    const sanctuary = { modelVersion: 12, source: { name: "Sanctuary" }, rank: 1, traits: ["abjuration"], activation: { time: "2" }, targeting: { target: "1 creature", range: "touch" },
        resolution: { kind: "attack-ward", attackWard: { save: "will", durationSeconds: 60, endsOnHostile: true, rows: {} } } };
    const [fighter, , , cleric] = martialParty(5);
    const healer = { ...moderateCreature(5, "healer", "Healer"), side: "party", kind: "npc", spells: [{ name: "Sanctuary", plan: sanctuary, castRank: 1, dc: 22, attack: 12, pool: null }], spellPools: {}, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, healer, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }] }, {}, 1);
    const caster = state.byId.get("healer");
    const brute = state.byId.get("brute");
    castSpell(state, caster, 0, ["healer"]);
    assert.ok(caster.ward);
    const chance = wardChance(state, brute, caster);
    assert.ok(chance > 0 && chance < 1);
    // A failed save (d20 2 → 2 + Will vs 22): stopped, and again this turn without a new save.
    state.rng.d20 = () => 2;
    state.log = [];
    assert.equal(performStrike(state, brute, caster, brute.strikes[0]), null);
    assert.ok(state.log.some((line) => line.includes("Brute saves against Sanctuary on Healer")), state.log.join("\n"));
    assert.equal(wardChance(state, brute, caster), 0);
    assert.equal(performStrike(state, brute, caster, brute.strikes[0]), null);
    // The healer attacks: the ward ends.
    performStrike(state, caster, brute, caster.strikes[0]);
    assert.equal(caster.ward, null);
});

test("Telekinetic Maneuver: a way per basic action, with the caster's spell attack at 60 feet, one cast between them", async () => {
    const { maneuverWays } = await import("../src/engine/readings.js");
    const trip = { modelVersion: 13, source: { name: "Trip", slug: "trip" }, rank: 1, traits: ["attack"], activation: { time: "1", traits: ["attack"] }, targeting: { target: "1 creature", range: "touch" },
        resolution: { kind: "check", check: { roll: "skill", statistic: "athletics", against: { dc: "target", statistic: "reflex" } }, outcomes: { criticalSuccess: row({ effects: [{ kind: "condition", slug: "prone", value: null, duration: null }] }), success: row({ effects: [{ kind: "condition", slug: "prone", value: null, duration: null }] }), failure: row(), criticalFailure: row() } } };
    const spell = { modelVersion: 12, source: { name: "Telekinetic Maneuver", slug: "telekinetic-maneuver" }, rank: 2, traits: ["concentrate", "force", "manipulate"], activation: { time: "2" }, targeting: { target: "1 creature", range: "60 feet" }, resolution: { kind: "spell-maneuver", spellManeuver: { actions: ["trip", "grapple"], melee: false } } };
    const ways = maneuverWays(spell, { trip });
    assert.deepEqual(ways.map((way) => way.name), ["Telekinetic Maneuver (Trip)"]);
    const way = ways[0].plan;
    assert.deepEqual([way.resolution.check.statistic, way.targeting.range, way.activation.time, way.traits.includes("attack")], ["spell", "60 feet", "2", true]);
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: ways[0].name, plan: way, castRank: 2, dc: 22, attack: 14, pool: "s" }], spellPools: { s: 1 }, band: "near" };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(5, "foe", "Foe"), band: "far" }] }, {}, 1);
    state.rng.d20 = () => 18;
    castSpell(state, state.byId.get("mage"), 0, ["foe"]);
    assert.equal(state.byId.get("foe").cond.prone, true, state.log.join("\n"));
    assert.equal(state.byId.get("mage").spellPools.s, 0);
});
