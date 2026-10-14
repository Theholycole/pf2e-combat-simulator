import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate, turnEnd } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage, expectedHitDamage, performStrike, stride } from "../src/engine/actions.js";
import { addBuiltin, extraApplies } from "../src/engine/abilities.js";
import { applyCondition, castPlan } from "../src/engine/spells.js";
import { adjustDamage, resistancesOf } from "../src/engine/damage.js";
import { berserkTurnStart, bestStrikeType, critSpecGroup, splitAfterHit, troopThresholds } from "../src/engine/creature-rules.js";

// T1–T7 (2026-10-13; the user's call: "build everything you brought up", tier 2): creature rules from the ability module's batch 306.

function fight(...monsters) {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, ...monsters.map((m) => ({ ...m, engagement: 1 }))] }, {}, 1);
    state.log = [];
    return state;
}
const creature = (id, plan, extra = {}) => {
    const c = { ...moderateCreature(5, id, id[0].toUpperCase() + id.slice(1)), ...extra };
    if (plan) assert.ok(addBuiltin(c, plan, "Test Rule"));
    return c;
};

test("T1 Strike extras against a condition: Punch Down on a prone creature, Mauler on one it holds itself; Brutal Beating's critical rider", () => {
    assert.equal(extraApplies({ when: "condition:prone" }, { cond: { prone: true } }, {}), true);
    assert.equal(extraApplies({ when: "condition:prone" }, { cond: {} }, {}), false);
    const bear = { id: "bear" };
    assert.equal(extraApplies({ when: "grabbing" }, { cond: { grabbed: true }, grabbedBy: "bear" }, { attacker: bear }), true);
    assert.equal(extraApplies({ when: "grabbing" }, { cond: { grabbed: true }, grabbedBy: "other" }, { attacker: bear }), false);
    // A +4 bonus extra counts in the expected damage.
    const mauler = creature("mauler", { builtin: "strike-extra", extras: [{ when: "condition:prone", dice: 0, die: 0, bonus: 4, precision: false, type: null }] });
    const state = fight(mauler);
    const m = state.byId.get("mauler");
    const pc = state.byId.get("fighter");
    const standing = expectedHitDamage(m, m.strikes[0], pc, false);
    pc.cond.prone = true;
    assert.ok(Math.abs(expectedHitDamage(m, m.strikes[0], pc, false) - standing - 4) < 0.01);
    // Brutal Beating: frightened 1 and a push on a critical hit.
    const ruffian = creature("ruffian", { builtin: "creature-rules", critRider: { conditions: [{ slug: "frightened", value: 1 }], push: 10 } });
    const other = fight(ruffian);
    other.rng.d20 = () => 20;
    performStrike(other, other.byId.get("ruffian"), other.byId.get("fighter"), other.byId.get("ruffian").strikes[0]);
    assert.equal(other.byId.get("fighter").cond.frightened, 1, other.log.join("\n"));
});

test("T2 Swiftness: its moves provoke nothing; Inexorable: slowed and stunned gone at its turn's end; Gang Up: off-guard with an ally", () => {
    const swift = creature("swift", { builtin: "creature-rules", swiftness: true });
    const state = fight(swift);
    const s = state.byId.get("swift");
    state.byId.get("fighter").reactions = { aoo: true };
    stride(state, s, { kind: "toNear" });
    assert.ok(!state.log.some((line) => /Attack of Opportunity/.test(line)), state.log.join("\n"));
    const tarrasque = creature("tarrasque", { builtin: "creature-rules", inexorable: { recover: ["slowed", "stunned"], speedPenalties: false, difficultTerrain: false } });
    const other = fight(tarrasque);
    const t = other.byId.get("tarrasque");
    t.cond.slowed = 1;
    t.cond.stunned = 2;
    turnEnd(other, t);
    assert.deepEqual([t.cond.slowed, t.cond.stunned], [0, 0]);
    const gang = creature("gang", { builtin: "passive-rules", flanking: { gangUp: true } });
    assert.equal(gang.flanking.gangUp, true);
});

test("T3 a type it can deal instead, the one its target minds most; Abandon Armor's resistance by its share of Hit Points", () => {
    const target = { resistances: [{ type: "slashing", value: 5, exceptions: [] }], weaknesses: [], immunities: [] };
    assert.equal(bestStrikeType({}, { versatile: ["piercing"] }, target, "slashing"), "piercing");
    assert.equal(bestStrikeType({ strikeTypes: ["spirit"] }, {}, { ...target, immunities: ["spirit"] }, "slashing"), "slashing");
    const dragon = { hp: { value: 100, max: 100 }, resistances: [], hpRules: [{ atLeast: 50, resistances: [{ type: "physical", value: 20, exceptions: ["adamantine"] }] }, { below: 50, resistances: [{ type: "physical", value: 10, exceptions: ["adamantine"] }] }] };
    assert.equal(resistancesOf(dragon)[0].value, 20);
    dragon.hp.value = 40;
    assert.equal(resistancesOf(dragon)[0].value, 10);
    assert.equal(adjustDamage(dragon, [{ type: "slashing", amount: 25 }]).total, 15);
});

test("T4 Protean Anatomy, Split, Attach and Berserk", () => {
    // Protean Anatomy: resistance to the acid, electricity or sonic damage it last took.
    const protean = creature("protean", { builtin: "creature-rules", protean: { value: 10, recover: ["blinded", "deafened"] }, immunities: ["polymorph"] }, { hp: { value: 200, max: 200 } });
    let state = fight(protean);
    const p = state.byId.get("protean");
    assert.ok(p.immunities.includes("polymorph"));
    applyDamage(state, p, [{ type: "acid", amount: 12, persistent: false }], { source: state.byId.get("fighter") });
    assert.equal(applyDamage(state, p, [{ type: "acid", amount: 12, persistent: false }], { source: state.byId.get("fighter") }), 2);
    // Split: slashing on it with 10 HP or more, two of it with half each.
    const pudding = creature("pudding", { builtin: "creature-rules", split: { types: ["slashing", "piercing"], minHp: 10 } }, { hp: { value: 60, max: 60 } });
    state = fight(pudding);
    state.order = state.list.map((c) => c.id);
    const before = state.list.length;
    applyDamage(state, state.byId.get("pudding"), [{ type: "slashing", amount: 10, persistent: false }], { source: state.byId.get("fighter") });
    assert.equal(state.list.length, before + 1);
    const twin = state.list.at(-1);
    assert.deepEqual([state.byId.get("pudding").hp.value, twin.hp.value], [25, 25]);
    assert.ok(state.order.includes(twin.id));
    assert.equal(splitAfterHit(state, state.byId.get("pudding"), ["fire"]), null);
    // Attach: a hit on a larger creature; off-guard while attached; it goes where that creature goes.
    const tick = creature("tick", { builtin: "creature-rules", attach: { offGuard: true } }, { size: "sm" });
    state = fight(tick);
    const k = state.byId.get("tick");
    state.byId.get("fighter").size = "med";
    state.rng.d20 = () => 19;
    performStrike(state, k, state.byId.get("fighter"), k.strikes[0]);
    assert.equal(k.attachedTo, "fighter");
    assert.ok(state.log.some((line) => /Tick attaches to Fighter/.test(line)));
    // Berserk: below its Hit Points, a failed flat check; then it Strikes the creature beside it, whichever side.
    const golem = creature("golem", { builtin: "creature-rules", berserk: { atMost: 40, dc: 5 } }, { hp: { value: 30, max: 120 } });
    state = fight(golem);
    state.rng.d20 = () => 1;
    berserkTurnStart(state, state.byId.get("golem"));
    assert.equal(state.byId.get("golem").goneBerserk, true);
    let hitAlly = 0;
    for (let seed = 1; seed <= 8; seed++) {
        const combatants = [{ ...martialParty(5)[0], engagement: 1, hp: { value: 999, max: 999 } }, { ...golem, engagement: 1, goneBerserk: true }, { ...creature("ally", null), engagement: 1, hp: { value: 999, max: 999 } }];
        const { log } = simulate({ combatants }, {}, seed, { log: true });
        if (log.some((line) => /^ {2}Golem [\w ]+ → Ally:/.test(line))) hitAlly++;
    }
    assert.ok(hitAlly > 0, `hit its ally in ${hitAlly} of 8`);
    // (2026-10-13: a Berserk Slam with no Strike left to make — the study's golem with its Fist left out — passes instead of failing.)
    const slammer = { ...golem, engagement: 1, goneBerserk: true, strikes: [], strikeActivities: [{ name: "Berserk Slam", actions: 2, strides: 0, strike: "fist", requires: "berserk", onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }] };
    assert.doesNotThrow(() => simulate({ combatants: [{ ...martialParty(5)[0], engagement: 1 }, slammer] }, {}, 3));
});

test("T5 an elemental dragon: Countered by Fire's penalty after fire damage; Fed by Earth concealed when an earth spell targets it", () => {
    const sky = creature("sky", { builtin: "creature-rules", elemental: [{ on: "damage", types: ["fire"], effect: { until: "end-of-next-turn", modifiers: [{ on: "attack", type: "circumstance", value: -1 }, { on: "ac", type: "circumstance", value: -1 }], jawsLose: "electricity" } }] }, { hp: { value: 200, max: 200 } });
    const state = fight(sky);
    const s = state.byId.get("sky");
    applyDamage(state, s, [{ type: "fire", amount: 5, persistent: false }], { source: state.byId.get("fighter") });
    assert.ok(s.effects.some((effect) => effect.model.modifiers.some((modifier) => modifier.on === "ac" && modifier.value === -1)), state.log.join("\n"));
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const earth = { name: "Test Stone", castRank: 1, dc: null, attack: null, pool: null, kind: "spell", plan: { modelVersion: 13, source: { name: "Test Stone" }, rank: 1, traits: ["earth"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 5 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } } };
    const fed = creature("fed", { builtin: "creature-rules", elemental: [{ on: "targeted", traits: ["earth"], effect: { rounds: 10, conditions: [{ slug: "concealed", value: null }] } }] });
    const other = fight(fed);
    castPlan(other, other.byId.get("fighter"), earth, ["fed"]);
    assert.ok(other.byId.get("fed").cond.concealed, other.log.join("\n"));
});

test("T6 critical specialization: a sword's off-guard, a hammer's prone on a failed save; only with the feature", () => {
    const [fighter] = martialParty(5);
    assert.equal(critSpecGroup(fighter, fighter.strikes[0], { cond: {} }), "sword");
    assert.equal(critSpecGroup(martialParty(3)[0], martialParty(3)[0].strikes[0], { cond: {} }), null);
    const rogue = martialParty(5)[3];
    assert.equal(critSpecGroup(rogue, rogue.strikes[0], { cond: {} }), null);
    assert.equal(critSpecGroup(rogue, rogue.strikes[0], { cond: { offGuard: true } }), "sword");
    const state = fight(creature("foe", null, { hp: { value: 999, max: 999 } }));
    state.rng.d20 = () => 20;
    performStrike(state, state.byId.get("fighter"), state.byId.get("foe"), state.byId.get("fighter").strikes[0]);
    assert.ok(state.byId.get("foe").cond.offGuard, state.log.join("\n"));
    // A Weapon Master monster with a hammer: a failed Fortitude save, prone.
    const master = creature("master", { builtin: "creature-rules", critSpec: true });
    master.strikes = [{ ...master.strikes[0], name: "Warhammer", iwr: { group: "hammer" } }];
    const other = fight(master);
    other.rng.d20 = () => 20;
    const pc = other.byId.get("fighter");
    pc.saves.fortitude = -50;
    performStrike(other, other.byId.get("master"), pc, other.byId.get("master").strikes[0]);
    assert.ok(pc.cond.prone, other.log.join("\n"));
});

test("T7 Troop Defenses: thresholds lower its maximum; a non-damaging effect aimed at it alone does nothing; a disabling one costs a segment", () => {
    const troop = creature("troop", { builtin: "creature-rules", troop: { thresholds: null } }, { hp: { value: 90, max: 90 } });
    assert.deepEqual(troopThresholds({ ...troop, hp: { value: 90, max: 90 } }), [{ hp: 60, segments: 3 }, { hp: 30, segments: 2 }]);
    const state = fight(troop);
    const t = state.byId.get("troop");
    applyDamage(state, t, [{ type: "slashing", amount: 35, persistent: false }], { source: state.byId.get("fighter") });
    assert.equal(t.hp.max, 60);
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const scare = { name: "Test Scare", castRank: 1, dc: null, attack: null, pool: null, kind: "spell", plan: { modelVersion: 13, source: { name: "Test Scare" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 50 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } } };
    castPlan(state, state.byId.get("fighter"), scare, ["troop"]);
    assert.ok(state.log.includes("  Troop is unaffected (a troop)"), state.log.join("\n"));
    assert.equal(applyCondition(state, t, "stunned", 1, null, state.byId.get("fighter")), false);
    assert.equal(t.hp.value, 30);
    assert.equal(t.hp.max, 30);
});
