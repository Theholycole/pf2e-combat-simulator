import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage, expectedHitDamage, performStrike } from "../src/engine/actions.js";
import { castSpell } from "../src/engine/spells.js";

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

test("Battle Medicine: heals a hurt ally once, at the best Treat Wounds DC; a critical failure hurts", () => {
    const [fighter, champion] = martialParty(5);
    const medic = { ...champion, engagement: 1, battleMedicine: { name: "Battle Medicine", modifier: 12, tiers: [{ dc: 15, bonus: 0 }, { dc: 20, bonus: 10 }] } };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, medic, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("champion");
    const ally = state.byId.get("fighter");
    c.actionsLeft = 3;
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "battleMedicine"), "nobody is hurt");
    ally.hp.value = 20;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "battleMedicine");
    assert.deepEqual([option?.action.targetId, option?.action.tier], ["fighter", 1], "+12 against DC 20 heals more on average than against DC 15");
    state.rng.d20 = dice(10);
    performAction(state, c, option.action);
    assert.ok(ally.hp.value >= 20 + 2 + 10, "2d8 + 10");
    assert.ok(!scoreOptions(state, c).options.some((entry) => entry.action.type === "battleMedicine" && entry.action.targetId === "fighter"), "immune for the day");
    // A critical failure: 1d8 damage.
    c.battleMedicineGiven = new Set();
    const hp = ally.hp.value;
    state.rng.d20 = dice(1);
    c.battleMedicine.modifier = -20;
    performAction(state, c, { type: "battleMedicine", targetId: "fighter", tier: 0 });
    assert.ok(ally.hp.value < hp);
});

test("Vicious Swing counts as two attacks and adds a weapon die; Exacting Strike's miss doesn't count; Hunted Shot only at the prey", () => {
    const [fighter, , ranger] = martialParty(5);
    const base = fighter.strikes[0];
    const swinger = { ...fighter, engagement: 1, strikes: [{ ...base, bonus: 40 }], strikeActivities: [
        { name: "Vicious Swing", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, countsAs: 2, extraWeaponDice: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null },
        { name: "Exacting Strike", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, exacting: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null }
    ] };
    const state = createFightState({ combatants: [swinger, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, {}, 1);
    const c = state.byId.get("fighter");
    state.log = [];
    state.rng.d20 = dice(10);
    performAction(state, c, { type: "strikeActivity", index: 0, targetId: "foe", strikeIndex: 0, actions: 2 });
    assert.equal(c.attacksThisTurn, 2);
    assert.ok(state.log.some((line) => /Greatsword \(Vicious Swing\) → Foe/.test(line)));
    c.attacksThisTurn = 0;
    // 10 + (AC - 11): one short of the AC, a plain miss.
    c.strikes[0].bonus = state.byId.get("foe").ac - 11;
    state.rng.d20 = dice(10);
    performAction(state, c, { type: "strikeActivity", index: 1, targetId: "foe", strikeIndex: 0, actions: 1 });
    assert.equal(c.attacksThisTurn, 0, "a miss (not a critical miss) doesn't count toward the penalty");

    const archer = { ...ranger, band: "near", prey: null, huntPrey: { edge: "flurry" }, multiStrikes: [{ name: "Hunted Shot", actions: 1, strikes: [ranger.strikes[0].name.toLowerCase(), ranger.strikes[0].name.toLowerCase()], oncePerTurn: true, preyOnly: true, sameTarget: true }] };
    const other = createFightState({ combatants: [archer, { ...moderateCreature(5, "foe", "Foe"), band: "near" }] }, {}, 1);
    const r = other.byId.get("ranger");
    r.actionsLeft = 3;
    r.usedThisTurn = new Set();
    assert.ok(!scoreOptions(other, r).options.some((option) => option.action.type === "multiStrike"), "no prey yet");
    r.prey = "foe";
    assert.ok(scoreOptions(other, r).options.some((option) => option.action.type === "multiStrike"));
});

test("Exploit Vulnerability: the target's highest weakness (or 2 + half level) on each hit; Overdrive: its Strikes' extra damage", () => {
    const [fighter, champion] = martialParty(5);
    const thaum = { ...fighter, id: "mios", name: "Mios", engagement: 1, exploit: { name: "Exploit Vulnerability", modifier: 12, antithesis: 4 } };
    const troll = { ...moderateCreature(5, "troll", "Troll"), engagement: 1, weaknesses: [{ type: "fire", value: 10, exceptions: [] }] };
    const state = createFightState({ combatants: [thaum, troll] }, {}, 1);
    const c = state.byId.get("mios");
    const target = state.byId.get("troll");
    c.actionsLeft = 3;
    c.usedThisTurn = new Set();
    assert.equal(scoreOptions(state, c).options.find((option) => option.action.type === "exploit")?.action.targetId, "troll");
    const plain = expectedHitDamage(c, c.strikes[0], target, false);
    state.rng.d20 = dice(15);
    performAction(state, c, { type: "exploit", targetId: "troll" });
    assert.deepEqual(c.exploited, { targetId: "troll", value: 10 }, "its weakness to fire is the bigger");
    assert.equal(expectedHitDamage(c, c.strikes[0], target, false) - plain, 10);
    // On a critical hit the weakness still counts once.
    const critical = expectedHitDamage(c, c.strikes[0], target, true);
    c.exploited = null;
    assert.equal(critical - expectedHitDamage(c, c.strikes[0], target, true), 10);

    const inventor = { ...champion, id: "droven", name: "Droven", engagement: 1, overdrive: { name: "Overdrive", modifier: 12, intMod: 4, level: 5 } };
    const other = createFightState({ combatants: [inventor, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const d = other.byId.get("droven");
    d.usedThisTurn = new Set();
    const before = expectedHitDamage(d, d.strikes[0], other.byId.get("foe"), false);
    other.rng.d20 = dice(20);
    performAction(other, d, { type: "overdrive" });
    assert.equal(expectedHitDamage(d, d.strikes[0], other.byId.get("foe"), false) - before, 4, "a critical success: +Int");
    assert.equal(d.overdriveDone, true);
});

test("Devise a Stratagem: the first Strike at the creature this round uses the d20 rolled in advance, Intelligence and Strategic Strike's dice", () => {
    const [, , , rogue] = martialParty(5);
    const quinn = { ...rogue, id: "quinn", name: "Quinn", engagement: 1, stratagemFeature: { name: "Devise a Stratagem", dice: 2, strikeBonus: { [rogue.strikes[0].name]: 2 } } };
    const state = createFightState({ combatants: [quinn, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, {}, 1);
    state.round = 1;
    state.log = [];
    const c = state.byId.get("quinn");
    c.actionsLeft = 3;
    assert.ok(scoreOptions(state, c).options.some((option) => option.action.type === "stratagem"));
    state.rng.d20 = dice(17, 2);
    performAction(state, c, { type: "stratagem", targetId: "foe" });
    performStrike(state, c, state.byId.get("foe"), c.strikes[0]);
    const line = state.log.find((entry) => / → Foe: /.test(entry));
    assert.match(line, new RegExp(`: ${17 + c.strikes[0].bonus + 2} vs AC`), "the 17 rolled in advance, +2 for Intelligence");
    assert.equal(c.stratagem.used, true);
});

test("Panache: a successful Feint brings it; Precise Strike's damage; a finisher spends it and ends attacks for the turn; Opportune Riposte", () => {
    const [, , , rogue] = martialParty(5);
    const base = rogue.strikes[0];
    const jirelle = { ...rogue, id: "jirelle", name: "Jirelle", engagement: 1, opportuneRiposte: true, panacheStyle: { bravado: ["feint"], precise: 3, finisherDice: 3 }, strikes: [{ ...base, finesse: true }],
        strikeActivities: [{ name: "Confident Finisher", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, finisher: "confident", onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null }] };
    const feint = { modelVersion: 13, source: { name: "Feint", slug: "feint" }, rank: 1, traits: ["mental"], activation: { time: "1" }, targeting: { target: "1 creature", range: "touch" },
        resolution: { kind: "check", check: { roll: "skill", statistic: "deception", against: { dc: "target", statistic: "perception" } }, outcomes: { criticalSuccess: { effects: [] }, success: { effects: [] }, failure: { effects: [] }, criticalFailure: { effects: [] } } } };
    const state = createFightState({ combatants: [{ ...jirelle, skills: { deception: 15 }, spells: [{ name: "Feint", plan: feint, castRank: 1, pool: null, kind: "basic" }] }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 999, max: 999 } }] }, {}, 1);
    const c = state.byId.get("jirelle");
    const foe = state.byId.get("foe");
    c.actionsLeft = 3;
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "strikeActivity"), "no finisher without panache");
    const plain = expectedHitDamage(c, c.strikes[0], foe, false);
    // A Feint that succeeds (20 + 15 against its Perception DC): panache.
    state.rng.d20 = dice(20);
    castSpell(state, c, 0, ["foe"]);
    assert.equal(c.panache, true);
    assert.equal(expectedHitDamage(c, c.strikes[0], foe, false) - plain, 3, "Precise Strike");
    const finisher = scoreOptions(state, c).options.find((option) => option.action.type === "strikeActivity");
    assert.ok(finisher);
    state.rng.d20 = dice(20);
    performAction(state, c, finisher.action);
    assert.deepEqual([c.panache, c.noAttacksThisTurn], [false, true]);
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "strike"), "no more attacks this turn");
    // Opportune Riposte: a foe's critical miss against it.
    state.log = [];
    state.rng.d20 = dice(1);
    performStrike(state, foe, c, { ...foe.strikes[0], bonus: -20 });
    assert.ok(state.log.some((line) => /Jirelle uses Opportune Riposte/.test(line)));
});

test("A guardian: Intercept Attack takes an ally's physical damage when the ally would drop; Taunt: −1 and off-guard for attacking anyone else", () => {
    const [fighter, champion] = martialParty(5);
    const grimmyr = { ...champion, id: "grimmyr", name: "Grimmyr", engagement: 1, interceptAttack: true, taunt: { name: "Taunt" } };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, grimmyr, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }] }, {}, 1);
    state.log = [];
    const ally = state.byId.get("fighter");
    const guardian = state.byId.get("grimmyr");
    const brute = state.byId.get("brute");
    ally.hp.value = 5;
    const hp = guardian.hp.value;
    applyDamage(state, ally, [{ type: "slashing", amount: 12, persistent: false, precision: false }], { source: brute });
    assert.deepEqual([ally.hp.value, hp - guardian.hp.value], [5, 12]);
    // Taunt.
    guardian.actionsLeft = 3;
    const taunt = scoreOptions(state, guardian).options.find((option) => option.action.type === "taunt");
    assert.equal(taunt?.action.targetId, "brute");
    state.round = 1;
    performAction(state, guardian, taunt.action);
    assert.equal(brute.tauntedBy, "grimmyr");
    state.log = [];
    state.rng.d20 = dice(10);
    brute.round = 1;
    performStrike(state, brute, ally, { ...brute.strikes[0], bonus: 10 });
    assert.match(state.log.find((line) => / → Fighter: /.test(line)), /: 19 vs AC/, "10 + 10 − 1");
    assert.equal(brute.cond.offGuard, true);
});

test("a caster with spell slots and a once-only option (Battle Medicine) plans without errors", () => {
    const [fighter, champion] = martialParty(5);
    const spell = { name: "Zap", castRank: 1, dc: 20, attack: 12, pool: "slot", kind: undefined, plan: { modelVersion: 13, source: { name: "Zap" }, rank: 1, traits: ["concentrate", "manipulate"], activation: { time: "2" }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "spell" } }, sharedDamage: { components: [{ id: "0", formula: "2d6[fire]" }] }, outcomes: { criticalSuccess: { damage: { mode: "shared", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } } } } };
    const cleric = { ...champion, id: "kyra", name: "Kyra", engagement: 1, spells: [spell], spellPools: { slot: 2 }, battleMedicine: { name: "Battle Medicine", modifier: 13, tiers: [{ dc: 15, bonus: 0 }] } };
    for (let seed = 1; seed <= 5; seed++) {
        const result = simulate({ combatants: [{ ...fighter, engagement: 1, hp: { value: 30, max: 80 } }, cleric, { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, seed, { log: true });
        assert.ok(result.outcome);
    }
});
