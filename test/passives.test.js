import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage, performStrike, provoke, stride } from "../src/engine/actions.js";
import { addBuiltin, canReact, spareReaction } from "../src/engine/abilities.js";
import { applyCondition, castSpell } from "../src/engine/spells.js";
import { saveModifier } from "../src/engine/combatant.js";
import { adjustedSaveDegree, adjustedSaveOdds, flankableBy, offGuardFrom } from "../src/engine/passives.js";

// Passives PF2e's own rules hold (B302, 2026-10-13; the user's call: "the crash, traps and then passives"): the ability module's passive-rules plans.
const passive = (extra) => ({ builtin: "passive-rules", ...extra });
const EVASION = { saves: ["reflex"], adjustment: { success: "one-degree-better" } };
const BRAVERY = { saves: ["will"], adjustment: { success: "one-degree-better" }, predicate: ["item:trait:fear"] };

test("B302 passive-rules plans as combatant fields; a reaction for one thing only played for Reactive Strikes and Shield Block alone", () => {
    const spec = {};
    assert.ok(addBuiltin(spec, passive({ saveDegrees: [EVASION] }), "Evasion"));
    assert.ok(addBuiltin(spec, passive({ flanking: { offGuardable: "level" } }), "Deny Advantage"));
    assert.ok(addBuiltin(spec, passive({ offGuardTo: [{ when: { round: 1, notActed: true }, strikes: "all", spells: true }] }), "Surprise Attack"));
    assert.ok(addBuiltin(spec, passive({ constructArmor: { hardness: 9, losesHardness: true, ac: -4, below: 50 } }), "Construct Armor"));
    assert.ok(addBuiltin(spec, passive({ saveDegrees: [BRAVERY], lessFrightened: 1 }), "Bravery"));
    assert.ok(addBuiltin(spec, passive({ mobility: { moves: ["stride"] } }), "Mobility"));
    assert.ok(addBuiltin(spec, passive({ reactions: { perRound: 3 } }), "Extra Reaction"));
    assert.ok(addBuiltin(spec, passive({ reactions: { extra: 1, only: "Shield Block" } }), "Quick Shield Block"));
    assert.deepEqual([spec.saveDegrees.length, spec.flanking, spec.makesOffGuard[0].source, spec.hardness, spec.lessFrightened, spec.mobility, spec.reactionsPerRound, spec.spareReactions], [2, { offGuardable: "level" }, "Surprise Attack", 9, 1, { moves: ["stride"] }, 3, { "shield-block": 1 }]);
    assert.equal(addBuiltin({}, passive({ reactions: { extra: 1, only: "Divert Strike" } }), "Extra Reaction"), false);
    assert.deepEqual(addBuiltin((spec.other = {}), passive({ reactions: { extra: 2, only: "Attacks of Opportunity" } }), "Opportunist") && spec.other.spareReactions, { aoo: 2 });
});

test("B302 save degrees: Evasion's success a critical success, Bravery's only against fear, the odds moved with them; a Fireball that misses an evasive rogue", () => {
    const rogue = { saveDegrees: [EVASION, BRAVERY] };
    assert.equal(adjustedSaveDegree(rogue, "reflex", 2), 3);
    assert.equal(adjustedSaveDegree(rogue, "reflex", 1), 1);
    assert.equal(adjustedSaveDegree(rogue, "will", 2, { kind: "spell", plan: { traits: ["fear", "emotion"] } }), 3);
    assert.equal(adjustedSaveDegree(rogue, "will", 2, { kind: "spell", plan: { traits: ["mental"] } }), 2);
    assert.equal(adjustedSaveDegree({ saveDegrees: [{ saves: ["will"], adjustment: { all: "one-degree-better" } }] }, "will", 3), 3);
    assert.deepEqual(adjustedSaveOdds(rogue, "reflex", [0.1, 0.3, 0.4, 0.2]).map((value) => Math.round(value * 10) / 10), [0.1, 0.3, 0, 0.6]);
    // A Fireball whose save the rogue succeeds at: no damage with Evasion, half without.
    const plan = { modelVersion: 12, source: { name: "Fireball" }, rank: 3, traits: ["fire", "manipulate"], activation: { time: "2", traits: [] }, targeting: { target: null, range: "500 feet", area: { type: "burst", value: 20 } },
        resolution: { kind: "save", check: { statistic: "reflex", basic: true }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d6", type: "fire" }] },
            outcomes: Object.fromEntries([["criticalSuccess", 0], ["success", 0.5], ["failure", 1], ["criticalFailure", 2]].map(([degree, multiplier]) => [degree, { damage: multiplier ? { mode: "shared", multiplier, sourceComponentIds: ["0"] } : { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }])) } };
    const taken = (extra) => {
        const [, , , rogueSpec] = martialParty(5);
        const mage = { ...moderateCreature(5, "mage", "Mage"), band: "near", spells: [{ name: "Fireball", plan, castRank: 3, dc: 25, attack: 15, pool: null }] };
        const state = createFightState({ combatants: [{ ...rogueSpec, ...extra }, mage] }, {}, 1);
        const target = state.byId.get(rogueSpec.id);
        // (A roll that just makes the DC: a success.)
        state.rng.d20 = () => 25 - saveModifier(target, "reflex");
        castSpell(state, state.byId.get("mage"), 0, [target.id]);
        return target.hp.max - target.hp.value;
    };
    assert.equal(taken({ saveDegrees: [EVASION] }), 0);
    assert.ok(taken({}) > 0);
});

test("B302 flanking and off-guard to it: All-Around Vision, Deny Advantage's level; Surprise Attack before the target acts, Dread Striker's frightened target", () => {
    assert.equal(flankableBy({ flanking: { flankable: false } }, { level: 1 }), false);
    assert.equal(flankableBy({ level: 5, flanking: { offGuardable: "level" } }, { level: 5 }), false);
    assert.equal(flankableBy({ level: 5, flanking: { offGuardable: "level" } }, { level: 6 }), true);
    assert.equal(flankableBy({}, { level: 1 }), true);
    const [fighter] = martialParty(5);
    const sneak = { ...moderateCreature(5, "sneak", "Sneak"), makesOffGuard: [{ when: { round: 1, notActed: true }, strikes: "all", spells: true }, { when: { conditions: [["frightened"]] }, strikes: "melee" }] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...sneak, engagement: 1 }] }, {}, 1);
    const [pc, foe] = [state.byId.get("fighter"), state.byId.get("sneak")];
    state.round = 1;
    assert.equal(offGuardFrom(state, foe, pc), true);
    pc.round = 1;
    assert.equal(offGuardFrom(state, foe, pc), false, "it has acted");
    pc.cond.frightened = 1;
    assert.equal(offGuardFrom(state, foe, pc), true, "frightened");
    assert.equal(offGuardFrom(state, foe, pc, { melee: false }), false, "melee only");
    // Deny Advantage of its level stops the surprise.
    delete pc.round;
    pc.cond.frightened = 0;
    pc.flanking = { offGuardable: 6 };
    assert.equal(offGuardFrom(state, foe, pc), false);
    // A Strike sees the AC 2 lower.
    delete pc.flanking;
    state.log = [];
    state.rng.d20 = () => 10;
    performStrike(state, foe, pc, foe.strikes[0]);
    assert.match(state.log.join("\n"), new RegExp(`vs AC ${pc.ac - 2}\\b`));
    // A Surprise Attack that needs a Stealth initiative: only with one.
    foe.makesOffGuard = [{ when: { round: 1, notActed: true, initiative: ["deception", "stealth"] }, strikes: "all" }];
    assert.equal(offGuardFrom(state, foe, pc), false);
    state.stealthInitiative = new Set(["sneak"]);
    assert.equal(offGuardFrom(state, foe, pc), true);
});

test("B302 Construct Armor: its Hardness off each hit; below half its Hit Points, or on a critical hit, its AC drops and its Hardness goes", () => {
    const statue = { ...moderateCreature(5, "statue", "Statue"), hp: { value: 80, max: 80 }, ac: 24, hardness: 9, constructArmor: { hardness: 9, losesHardness: true, ac: -4, below: 50 } };
    const state = createFightState({ combatants: [...martialParty(5), statue] }, {}, 1);
    const c = state.byId.get("statue");
    applyDamage(state, c, [{ type: "slashing", amount: 20, persistent: false, precision: false }]);
    assert.deepEqual([c.hp.value, c.ac, c.hardness], [69, 24, 9]);
    applyDamage(state, c, [{ type: "slashing", amount: 39, persistent: false, precision: false }]);
    assert.deepEqual([c.hp.value, c.ac, c.hardness, c.armorBroken], [39, 20, 0, true]);
    assert.ok(state.log.some((line) => /Statue's construct armor breaks: AC 20, no Hardness/.test(line)));
    // A critical hit breaks it at once.
    const other = createFightState({ combatants: [...martialParty(5), statue] }, {}, 1).byId.get("statue");
    applyDamage({ ...state, log: [] }, other, [{ type: "slashing", amount: 12, persistent: false, precision: false }], { critical: true });
    assert.deepEqual([other.hp.value, other.ac], [77, 20]);
});

test("B302 Bravery's frightened one lower, Mobility's short Stride without Reactive Strikes, Extra Reaction's count and a reaction for one thing only", () => {
    const [fighter, champion] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "foe", "Foe"), lessFrightened: 1, mobility: { moves: ["stride"] }, engagement: 1 }] }, {}, 1);
    const foe = state.byId.get("foe");
    assert.equal(applyCondition(state, foe, "frightened", 1, null, state.byId.get("fighter")), false);
    applyCondition(state, foe, "frightened", 2, null, state.byId.get("fighter"));
    assert.equal(foe.cond.frightened, 1);
    stride(state, foe, { kind: "toNear" });
    assert.ok(!state.log.some((line) => line.includes("Attack of Opportunity")), state.log.join("\n"));
    // (Without it, or for a long move — to the exit: provoked.)
    const plain = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    stride(plain, plain.byId.get("foe"), { kind: "toNear" });
    assert.ok(plain.log.some((line) => line.includes("Fighter Attack of Opportunity")));
    const far = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "foe", "Foe"), mobility: { moves: ["stride"] }, engagement: 1 }] }, {}, 1);
    stride(far, far.byId.get("foe"), { kind: "leave" });
    assert.ok(far.log.some((line) => line.includes("Fighter Attack of Opportunity")));
    // Three reactions a round, back at its turn's start.
    const dragon = createFightState({ combatants: [fighter, { ...moderateCreature(5, "dragon", "Dragon"), reactionsPerRound: 3 }] }, {}, 1).byId.get("dragon");
    dragon.reactionUsed = true;
    dragon.reactionUsed = true;
    assert.equal(canReact(dragon), true);
    dragon.reactionUsed = true;
    assert.equal(canReact(dragon), false);
    dragon.reactionUsed = false;
    assert.equal(canReact(dragon), true);
    // One more for Reactive Strikes only: two creatures leaving its Melee both provoke, the spare spent first.
    const guard = { ...moderateCreature(5, "guard", "Guard"), reactions: { aoo: true, shieldBlock: false }, spareReactions: { aoo: 1 }, engagement: 1 };
    const two = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1 }, guard] }, {}, 1);
    const g = two.byId.get("guard");
    two.rng.d20 = () => 2;
    provoke(two, two.byId.get("fighter"), "move");
    assert.equal(spareReaction(g, "aoo"), false);
    assert.equal(canReact(g), true);
    provoke(two, two.byId.get(champion.id), "move");
    assert.equal(two.log.filter((line) => line.includes("Guard Attack of Opportunity")).length, 2);
    assert.equal(canReact(g), false);
});
