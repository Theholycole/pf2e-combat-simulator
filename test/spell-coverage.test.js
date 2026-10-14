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
