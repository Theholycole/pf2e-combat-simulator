import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage, expectedHitDamage, performStrike } from "../src/engine/actions.js";

// PC class features as the snapshot reads them from PF2e: Sneak Attack's
// off-guard dice on a Strike, Rage, Hunt Prey, Flurry of Blows, Double Slice,
// and a champion's reaction.
const dice = (...rolls) => () => rolls.shift() ?? 10;

test("Sneak Attack: the Strike's off-guard dice, against an off-guard target only", () => {
    const [, , , rogue] = martialParty(5);
    const sneaky = { ...rogue, engagement: 1, strikes: rogue.strikes.map((strike) => ({ ...strike, offGuardExtra: [{ dice: 2, die: 6, bonus: 0, multiplier: 1, type: "piercing", precision: true, persistent: false }] })) };
    const state = createFightState({ combatants: [sneaky, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("rogue");
    const foe = state.byId.get("foe");
    const strike = c.strikes[0];
    const plain = expectedHitDamage(c, strike, foe, false);
    assert.equal(expectedHitDamage(c, strike, foe, false, { offGuardChance: 1 }) - plain, 7);
    assert.equal(expectedHitDamage(c, strike, foe, false, { offGuardChance: 0.5 }) - plain, 3.5);
    state.log = [];
    foe.cond.prone = true;
    state.rng.d20 = dice(15);
    const hit = performStrike(state, c, foe, { ...strike, bonus: 20 });
    assert.ok(hit.damage >= (strike.damage[0].dice ?? 1) + 2, "weapon dice and 2d6 more");
});

test("Rage: once a fight, temporary HP and its damage on the Strikes; no concentrate actions while raging", () => {
    const [fighter] = martialParty(5);
    const strike = fighter.strikes[0];
    const barbarian = { ...fighter, id: "amiri", name: "Amiri", engagement: 1, selfBuffs: [{ name: "Rage", actions: 1, tempHp: 9, noConcentrate: true, strikeDeltas: { [strike.name]: [{ dice: 0, die: 0, bonus: 2, multiplier: 1, type: strike.damage[0].type, precision: false, persistent: false }] } }],
        spells: [{ name: "Demoralize-ish", plan: { traits: ["concentrate"], activation: { time: "1" }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "check", check: { roll: "skill", statistic: "intimidation", against: { dc: "target", statistic: "will" } }, outcomes: { criticalSuccess: { effects: [{ kind: "condition", slug: "frightened", value: 2 }] }, success: { effects: [{ kind: "condition", slug: "frightened", value: 1 }] }, failure: { effects: [] }, criticalFailure: { effects: [] } } } }, castRank: 1, pool: null, kind: "basic" }] };
    const state = createFightState({ combatants: [barbarian, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("amiri");
    const foe = state.byId.get("foe");
    c.actionsLeft = 3;
    const rage = scoreOptions(state, c).options.find((option) => option.action.type === "selfBuff");
    assert.ok(rage && rage.value > 0);
    const before = expectedHitDamage(c, c.strikes[0], foe, false);
    const result = simulate({ combatants: [barbarian, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, { roundCap: 1, morale: false }, 1, { log: true });
    assert.ok(result.log.some((line) => /Amiri uses Rage/.test(line)));
    c.activeBuffs = [c.selfBuffs[0]];
    assert.equal(expectedHitDamage(c, c.strikes[0], foe, false) - before, 2);
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "cast"), "no concentrate actions while raging");
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "selfBuff"), "once a fight");
});

test("Hunt Prey: the Precision edge's dice on the first hit each round; the Flurry edge's smaller multiple attack penalty", () => {
    const [, , ranger] = martialParty(5);
    const foe = { ...moderateCreature(5, "foe", "Foe"), band: "near" };
    const state = createFightState({ combatants: [{ ...ranger, huntPrey: { edge: "precision", precisionDice: 1 } }, foe] }, {}, 1);
    const c = state.byId.get("ranger");
    const target = state.byId.get("foe");
    c.actionsLeft = 3;
    const hunt = scoreOptions(state, c).options.find((option) => option.action.type === "huntPrey");
    assert.equal(hunt?.action.targetId, "foe");
    const plain = expectedHitDamage(c, c.strikes[0], target, false);
    c.prey = "foe";
    assert.equal(expectedHitDamage(c, c.strikes[0], target, false) - plain, 4.5);
    // Flurry: the second attack at -3 instead of -5 against the prey.
    const other = createFightState({ combatants: [{ ...ranger, huntPrey: { edge: "flurry" }, prey: "foe" }, foe] }, {}, 1);
    const r = other.byId.get("ranger");
    const strike = { ...r.strikes[0], bonus: 10 };
    other.rng.d20 = dice(10, 10);
    r.attacksThisTurn = 1;
    other.log = [];
    performStrike(other, r, other.byId.get("foe"), strike);
    assert.match(other.log.at(-1), /: 17 vs AC/, "10 + 10 - 3");
});

test("Flurry of Blows: two unarmed Strikes for one action, once a turn; Double Slice: both at the current penalty", () => {
    const [fighter] = martialParty(5);
    const base = fighter.strikes[0];
    const monk = { ...fighter, id: "sajan", name: "Sajan", engagement: 1, strikes: [{ ...base, name: "Fist", agile: true, unarmed: true }], multiStrikes: [{ name: "Flurry of Blows", actions: 1, strikes: ["fist", "fist"], oncePerTurn: true }] };
    const state = createFightState({ combatants: [monk, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, {}, 1);
    const c = state.byId.get("sajan");
    c.actionsLeft = 3;
    c.usedThisTurn = new Set();
    assert.ok(scoreOptions(state, c).options.some((option) => option.action.type === "multiStrike"));
    c.usedThisTurn.add("Flurry of Blows");
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "multiStrike"), "once a turn");
    const result = simulate({ combatants: [monk, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, { roundCap: 2, morale: false }, 1, { log: true });
    const turns = result.log.filter((line) => /Sajan uses Flurry of Blows/.test(line)).length;
    assert.ok(turns >= 1 && turns <= 2, "at most once a turn");

    const slicer = { ...fighter, id: "valeros", name: "Valeros", engagement: 1, strikes: [{ ...base, name: "Longsword", held: true, bonus: 10 }, { ...base, name: "Shortsword", held: true, agile: true, bonus: 10 }], multiStrikes: [{ name: "Double Slice", actions: 2, strikes: ["longsword", "shortsword"], sameMap: true, sameTarget: true }] };
    const other = createFightState({ combatants: [slicer, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, {}, 1);
    const v = other.byId.get("valeros");
    other.log = [];
    other.rng.d20 = dice(10, 10);
    performAction(other, v, { type: "multiStrike", ability: 0, targetId: "foe", actions: 2 });
    // Both at +10 with no multiple attack penalty (the Shortsword is agile: no -2); then it counts as two attacks.
    assert.deepEqual(other.log.filter((line) => / → Foe: /.test(line)).map((line) => /: (\d+) vs AC/.exec(line)?.[1]), ["20", "20"]);
    assert.equal(v.attacksThisTurn, 2);
});

test("Champion's reactions: Retributive Strike's resistance and Strike; Glimpse of Redemption's choice", () => {
    const [fighter, champion] = martialParty(5);
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1 };
    const seelah = { ...champion, engagement: 1, championReaction: { slug: "retributive-strike", name: "Retributive Strike", self: false, resistance: 7 } };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, seelah, brute] }, {}, 1);
    state.log = [];
    const ally = state.byId.get("fighter");
    const enemy = state.byId.get("brute");
    const hp = ally.hp.value;
    applyDamage(state, ally, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: enemy });
    assert.equal(hp - ally.hp.value, 13, "20 - (2 + 5)");
    assert.ok(state.log.some((line) => /Champion uses Retributive Strike/.test(line)));
    assert.ok(state.log.some((line) => /Champion .* → Brute/.test(line)), "a Strike at the enemy");
    // Glimpse: small damage is repented (none taken); big damage refused (resistance, enemy enfeebled 2).
    const glimpse = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...seelah, championReaction: { slug: "glimpse-of-redemption", name: "Glimpse of Redemption", self: false, resistance: 7 } }, brute] }, {}, 1);
    const a = glimpse.byId.get("fighter");
    const e = glimpse.byId.get("brute");
    const start = a.hp.value;
    applyDamage(glimpse, a, [{ type: "slashing", amount: 5, persistent: false, precision: false }], { source: e });
    assert.equal(a.hp.value, start, "repents");
    glimpse.byId.get("champion").reactionUsed = false;
    applyDamage(glimpse, a, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: e });
    assert.deepEqual([start - a.hp.value, e.cond.enfeebled], [13, 2]);
    // Not when the champion isn't in that Melee.
    const apart = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...seelah, engagement: undefined, band: "near" }, brute] }, {}, 1);
    const b = apart.byId.get("fighter");
    const before = b.hp.value;
    applyDamage(apart, b, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: apart.byId.get("brute") });
    assert.equal(before - b.hp.value, 20);
});
