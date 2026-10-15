import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage, performStrike, featureParts } from "../src/engine/actions.js";
import { canReact } from "../src/engine/abilities.js";
import { isOffGuard } from "../src/engine/combatant.js";
import { scoreOptions } from "../src/engine/planner.js";
import { championOpening } from "../src/engine/champion.js";
import { applyCondition, castPlan } from "../src/engine/spells.js";

// A champion's sheet (C30–C34, 2026-10-15; the user's champion Riah: "Can we try to simulate her whole character sheet as much as possible").
const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
const DEMORALIZE = { modelVersion: 13, source: { name: "Demoralize", slug: "demoralize" }, rank: 1, traits: ["mental", "emotion"], activation: { time: "1", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null },
    resolution: { kind: "check", check: { roll: "skill", statistic: "intimidation", against: { dc: "target", statistic: "will" } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
const RIDER = { conditions: [], critical: null, push: null, damage: [], save: null, size: null };

// A two-handed champion built like Riah: the benchmark fighter's greatsword, her Retributive Strike and feats.
function riah(extra = {}) {
    const [fighter] = martialParty(14);
    const sword = { ...fighter.strikes[0], hands: 2, held: true, critDamage: undefined };
    return { ...fighter, id: "riah", name: "Riah", strikes: [sword], skills: { ...(fighter.skills ?? {}), intimidation: 100 }, spellPools: { focus: 1 }, focusMax: 1,
        spells: [{ name: "Demoralize", plan: DEMORALIZE, castRank: 1, dc: 30, attack: 20, pool: null, kind: "basic" }],
        championReaction: { slug: "retributive-strike", name: "Retributive Strike", self: false, resistance: 16, dice: 4, relentless: { amount: 5, type: "spirit" }, exalted: { penalty: 5 }, zeal: true, swift: true, fervor: true },
        spareReactions: [{ names: ["champion' reaction"], count: 1 }],
        strikeActivities: [
            { name: "Blessed Counterstrike", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: "champion-triggered", oncePerFight: false, onHit: { ...RIDER, weakness: 7 }, riderSpell: null, flourish: true, extraWeaponDice: 1, zeal: true },
            { name: "Brutal Finish", actions: 1, strides: 0, strike: sword.name, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, onHit: RIDER, riderSpell: null, press: true, extraWeaponDice: 2, endsTurn: true, failureDice: 2 },
            { name: "Shatter Defenses", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: "frightened", oncePerFight: false, onHit: RIDER, riderSpell: null, press: true, shatter: true }
        ],
        multiStrikes: [
            { name: "Avalanche Strike", actions: 3, strikes: [sword.name], each: true, sameMap: true, flourish: true },
            { name: "Infernal Interference", actions: 2, strikes: [sword.name, sword.name], sameTarget: true, flourish: true, hitRiders: [{ atLeast: 1, conditions: [{ slug: "stupefied", value: 1, rounds: 1 }], noReactions: true }, { atLeast: 2, conditions: [{ slug: "stupefied", value: 3, rounds: 1 }] }] }
        ],
        oath: { trait: "aberration", value: 3 }, fearsomeBrute: 3, battleCry: { reaction: true }, dreadGaze: { dc: 37, value: 1 }, heroesDefiance: { heal: "6d8+20" }, lastStand: { name: "Immortal Bastion", tempHp: 100 },
        marchOfLaw: { name: "March of Law", frightened: 2, speedBonus: 10 }, engagement: 1, ...extra };
}

function setUp({ foes = [{}], extra = {}, ally = true } = {}) {
    const [, champion] = martialParty(14);
    const combatants = [riah(extra), ...(ally ? [{ ...champion, id: "ally", name: "Ally", engagement: 1 }] : []), ...foes.map((foe, index) => ({ ...moderateCreature(14, `foe${index}`, `Foe ${index}`), engagement: 1, hp: { value: 900, max: 900 }, ...foe }))];
    const state = createFightState({ combatants }, {}, 1);
    state.log = [];
    return { state, riah: state.byId.get("riah"), ally: state.byId.get("ally"), foe: state.byId.get("foe0") };
}

test("Retributive Strike's upgrades: resistance, Relentless Reaction's persistent spirit, Instrument of Zeal's critical hit, Exalted Reaction's ally, Swift Retribution", () => {
    const { state, riah, ally, foe } = setUp();
    // Every d20 a 20: the foe's hit, Riah's critical Retributive Strike, the ally's exalted Strike.
    state.rng.d20 = () => 20;
    state.rng.die = () => 4;
    foe.round = state.round;
    applyDamage(state, ally, [{ type: "slashing", amount: 40 }], { source: foe });
    const log = state.log.join("\n");
    assert.ok(log.includes("Riah uses Retributive Strike"), log);
    assert.ok(log.includes("Foe 0 takes 5 persistent spirit (Relentless Reaction)"), log);
    assert.ok(log.includes("(Instrument of Zeal)"), log);
    assert.equal(foe.cond.slowed, 1);
    assert.ok(log.includes("Ally Strikes with its reaction (Exalted Reaction)"), log);
    assert.equal(riah.cond.quickened, true, "Swift Retribution");
    assert.ok(riah.triggeredBy.has("foe0"));
    // Divine Reflexes (its champion's-reaction spare) and the Helm of Zeal's Divine Fervor: two more uses this round.
    assert.equal(canReact(riah, "Retributive Strike"), true);
});

test("Blessed Counterstrike at the enemy that set off its reaction: a weapon die more; a hit leaves it weak to its side's Strikes", () => {
    const { state, riah, foe } = setUp();
    riah.triggeredBy = new Set(["foe0"]);
    riah.actionsLeft = 3;
    const options = scoreOptions(state, riah).options;
    assert.ok(options.some((option) => option.action.type === "strikeActivity" && riah.strikeActivities[option.action.index].name === "Blessed Counterstrike"), JSON.stringify(options.map((option) => option.action)));
    state.rng.d20 = () => 15;
    performAction(state, riah, { type: "strikeActivity", index: 0, targetId: "foe0", strikeIndex: 0, actions: 1 });
    assert.ok((foe.weaknesses ?? []).some((entry) => entry.type === "physical" && entry.value === 7), state.log.join("\n"));
    // Not at an enemy that didn't set it off.
    riah.triggeredBy = new Set();
    riah.usedThisTurn = new Set();
    assert.ok(!scoreOptions(state, riah).options.some((option) => option.action.type === "strikeActivity" && riah.strikeActivities[option.action.index].name === "Blessed Counterstrike"));
});

test("Oath of the Slayer's spirit damage against its sworn kind, doubled after one set off its reaction; Fearsome Brute's triple frightened", () => {
    const { state, riah, foe } = setUp({ foes: [{ traits: ["aberration"] }] });
    riah.round = state.round;
    const spirit = () => featureParts(riah, riah.strikes[0], foe).filter((part) => part.type === "spirit").reduce((sum, part) => sum + part.bonus, 0);
    assert.equal(spirit(), 3);
    riah.oathDoubled = state.round;
    assert.equal(spirit(), 6);
    foe.cond.frightened = 2;
    assert.ok(featureParts(riah, riah.strikes[0], foe).some((part) => part.bonus === 6 && part.type !== "spirit"));
});

test("Hero's Defiance heals before a blow that would drop it; Immortal Bastion keeps it up at 1 HP with 100 temporary ones", () => {
    const { state, riah, foe } = setUp();
    riah.hp.value = 30;
    state.rng.die = () => 4;
    applyDamage(state, riah, [{ type: "slashing", amount: 60 }], { source: foe });
    // 6d8+20 at 4s: 44 back, then 60 off.
    assert.equal(riah.hp.value, 14, state.log.join("\n"));
    assert.equal(riah.spellPools.focus, 0);
    applyDamage(state, riah, [{ type: "slashing", amount: 60 }], { source: foe });
    assert.equal(riah.hp.value, 1, state.log.join("\n"));
    assert.equal(riah.hp.temp, 100);
    assert.equal(riah.status, "active");
});

test("as the fight begins: the Dread Blindfold's gaze and Battle Cry's Demoralize; legendary, its reaction Demoralizes after a critical hit", () => {
    const { state, riah, foe } = setUp({ foes: [{}, {}] });
    state.rng.d20 = () => 2;
    championOpening(state, riah, { applyCondition, castPlan });
    const log = state.log.join("\n");
    assert.ok(log.includes("sees Riah's Dread Blindfold: frightened 1"), log);
    assert.ok(log.includes("Riah uses Battle Cry"), log);
    const other = setUp();
    other.state.rng.d20 = () => 20;
    performStrike(other.state, other.riah, other.foe, other.riah.strikes[0]);
    assert.ok(other.state.log.some((line) => line.includes("Riah uses Battle Cry")), other.state.log.join("\n"));
    assert.equal(other.riah.reactionUsed, true);
});

test("Brutal Finish (press): two dice more, a failure still deals two dice, then its turn ends; Shatter Defenses off-guard while frightened", () => {
    const { state, riah, foe } = setUp();
    riah.actionsLeft = 3;
    assert.ok(!scoreOptions(state, riah).options.some((option) => option.action.type === "strikeActivity" && riah.strikeActivities[option.action.index].name === "Brutal Finish"), "a press action needs an attack first");
    riah.attacksThisTurn = 1;
    state.rng.d20 = () => 8;
    state.rng.die = () => 3;
    const hp = foe.hp.value;
    performAction(state, riah, { type: "strikeActivity", index: 1, targetId: "foe0", strikeIndex: 0, actions: 1 });
    assert.ok(state.log.some((line) => line.includes("from the failed Brutal Finish")), state.log.join("\n"));
    assert.ok(foe.hp.value < hp);
    assert.equal(riah.actionsLeft, 0);
    // Shatter Defenses: a frightened foe hit — off-guard while it's frightened.
    foe.cond.frightened = 2;
    riah.actionsLeft = 3;
    state.rng.d20 = () => 15;
    performAction(state, riah, { type: "strikeActivity", index: 2, targetId: "foe0", strikeIndex: 0, actions: 1 });
    assert.equal(isOffGuard(foe), true, state.log.join("\n"));
});

test("Avalanche Strike: a Strike at each enemy in reach at one penalty; Infernal Interference: stupefied and no reactions on a hit, stupefied 3 on both", () => {
    const { state, riah } = setUp({ foes: [{}, {}] });
    state.rng.d20 = () => 15;
    performAction(state, riah, { type: "multiStrike", ability: 0, targetId: "foe0", actions: 3 });
    assert.ok(state.log.some((line) => line.includes("→ Foe 0")) && state.log.some((line) => line.includes("→ Foe 1")), state.log.join("\n"));
    assert.equal(riah.attacksThisTurn, 2);
    const other = setUp();
    other.state.rng.d20 = () => 15;
    performAction(other.state, other.riah, { type: "multiStrike", ability: 1, targetId: "foe0", actions: 2 });
    assert.equal(other.foe.cond.stupefied, 3, other.state.log.join("\n"));
    assert.equal(canReact(other.foe), false);
});

test("March of Law: toward an enemy that attacked it since its last turn — frightened 2 on each enemy beside it, once a round", () => {
    const { state, riah, foe } = setUp({ foes: [{ engagement: null, band: "near" }], ally: false, extra: { engagement: null, band: "near" } });
    riah.actionsLeft = 3;
    assert.ok(!scoreOptions(state, riah).options.some((option) => option.action.type === "marchOfLaw"));
    applyDamage(state, riah, [{ type: "slashing", amount: 5 }], { source: foe });
    assert.ok(riah.wrongedBy.has("foe0"));
    assert.ok(scoreOptions(state, riah).options.some((option) => option.action.type === "marchOfLaw"));
    performAction(state, riah, { type: "marchOfLaw", targetId: "foe0" });
    assert.equal(foe.cond.frightened, 2, state.log.join("\n"));
    assert.ok(!scoreOptions(state, riah).options.some((option) => option.action.type === "marchOfLaw"), "once a round");
});
