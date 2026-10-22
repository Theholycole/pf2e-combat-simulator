import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { armorClass } from "../src/engine/combatant.js";
import { expectedHitDamage, performStrike } from "../src/engine/actions.js";

// Gunslingers and firearms (C16–C19): concussive and splash, slinger's reloads,
// deeds when initiative is rolled, and Cover Fire.
const dice = (...rolls) => () => rolls.shift() ?? 10;
const scattergun = { name: "Dwarven Scattergun", bonus: 12, melee: false, increment: 30, reload: 1, held: true, firearm: true, concussive: true, splashKind: "scatter", damage: [{ dice: 1, die: 10, bonus: 0, multiplier: 1, type: "piercing" }, { dice: 0, die: 0, bonus: 1, multiplier: 1, type: "piercing", splash: true }] };

test("C16 concussive: piercing or bludgeoning, whichever the target resists less", () => {
    const [fighter] = martialParty(5);
    const foe = { ...moderateCreature(5, "foe", "Foe"), resistances: [{ type: "piercing", value: 5, exceptions: [] }] };
    const state = createFightState({ combatants: [{ ...fighter, id: "gun", strikes: [scattergun] }, foe] }, {}, 1);
    const c = state.byId.get("gun");
    const target = state.byId.get("foe");
    const plain = { ...scattergun, concussive: false, name: "plain" };
    assert.ok(expectedHitDamage(c, scattergun, target, false) > expectedHitDamage(c, plain, target, false), "bludgeoning gets past the piercing resistance");
});

test("C16 splash: a scatter weapon's hit splashes the others around the target, allies too; a bomb's miss splashes the target and them", () => {
    const [fighter, , , rogue] = martialParty(5);
    const combatants = [
        { ...fighter, id: "gun", strikes: [scattergun], band: "near" },
        { ...rogue, id: "ally", engagement: 1 },
        { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }
    ];
    const state = createFightState({ combatants }, {}, 1);
    const c = state.byId.get("gun");
    const foe = state.byId.get("foe");
    const ally = state.byId.get("ally");
    const allyBefore = ally.hp.value;
    state.log = [];
    state.rng.d20 = dice(19);
    performStrike(state, c, foe, { ...scattergun, bonus: 30 });
    assert.equal(allyBefore - ally.hp.value, 1, "the ally beside the target takes the splash");
    // A bomb that misses: the target and the others take its splash.
    const bomb = { name: "Acid Flask", bonus: 0, melee: false, increment: 20, held: true, thrown: true, splashKind: "bomb", damage: [{ dice: 1, die: 6, bonus: 0, multiplier: 1, type: "acid" }, { dice: 0, die: 0, bonus: 2, multiplier: 1, type: "acid", splash: true }] };
    const foeBefore = foe.hp.value;
    const allyBefore2 = ally.hp.value;
    state.rng.d20 = dice(10);
    const missed = performStrike(state, c, foe, { ...bomb, bonus: armorClass(foe) - 11 });
    assert.equal(missed.degree, 1, "a miss");
    assert.equal(foeBefore - foe.hp.value, 2);
    assert.equal(allyBefore2 - ally.hp.value, 2);
});

test("C17 Clear a Path: with the scattergun empty and a foe in reach, reload and Shove in one action", () => {
    const [fighter] = martialParty(5);
    const shove = { modelVersion: 13, source: { name: "Shove", slug: "shove" }, rank: 1, traits: ["attack"], activation: { time: "1" }, targeting: { target: "1 creature", range: "touch" },
        resolution: { kind: "check", check: { roll: "skill", statistic: "athletics", against: { dc: "target", statistic: "fortitude" } }, outcomes: { criticalSuccess: { effects: [{ kind: "condition", slug: "prone", value: null }] }, success: { effects: [{ kind: "condition", slug: "off-guard", value: null }] }, failure: { effects: [] }, criticalFailure: { effects: [] } } } };
    const gunslinger = { ...fighter, id: "nhalmika", name: "Nhalmika", engagement: 1, skills: { athletics: 12 }, strikes: [scattergun], slingersReload: { name: "Clear a Path", then: "shove" }, spells: [{ name: "Shove", plan: shove, castRank: 1, pool: null, kind: "basic" }] };
    const state = createFightState({ combatants: [gunslinger, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    const c = state.byId.get("nhalmika");
    c.unloaded = new Set(["Dwarven Scattergun"]);
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "slingersReload");
    assert.ok(option, "offered");
    assert.equal(option.action.side, "shove");
    state.log = [];
    performAction(state, c, option.action);
    assert.ok(!c.unloaded.has("Dwarven Scattergun"), "reloaded");
    assert.ok(state.log.some((line) => /uses Clear a Path/.test(line)) && state.log.some((line) => /uses Shove/.test(line)));
});

test("C18 deeds when initiative is rolled: Living Fortification's AC for the first turn; One Shot, One Kill after a Stealth initiative; Energy Shot's three Strikes", () => {
    const [fighter] = martialParty(5);
    const gunslinger = { ...fighter, id: "nhalmika", name: "Nhalmika", band: "near", stealth: 15, strikes: [scattergun], livingFortification: 1, firstShot: { dice: 1 }, energyShots: 3 };
    const result = simulate({ combatants: [gunslinger, { ...moderateCreature(5, "foe", "Foe"), band: "near", hp: { value: 300, max: 300 } }], setup: { ambush: "party" } }, { roundCap: 1, morale: false }, 3, { log: true });
    assert.ok(result.log.some((line) => /uses Living Fortification \(\+1 AC/.test(line)));
    const state = createFightState({ combatants: [gunslinger, { ...moderateCreature(5, "foe", "Foe"), band: "near", hp: { value: 300, max: 300 } }] }, {}, 1);
    const c = state.byId.get("nhalmika");
    const foe = state.byId.get("foe");
    c.firstShotReady = 1;
    c.energyShotsLeft = 3;
    const plain = expectedHitDamage({ ...c, firstShotReady: 0, energyShotsLeft: 0 }, scattergun, foe, false);
    assert.ok(expectedHitDamage(c, scattergun, foe, false) - plain >= 3.5 + 1, "1d6 precision and 1 energy per weapon die");
    state.rng.d20 = dice(19, 19);
    performStrike(state, c, foe, { ...scattergun, bonus: 30 });
    assert.deepEqual([c.firstShotReady, c.energyShotsLeft], [0, 2]);
});

test("C19 Cover Fire: a melee foe ducks (+2 AC against the shot); a ranged one doesn't (+1 to hit)", async () => {
    const { ducksFromCoverFire } = await import("../src/engine/abilities.js");
    const brute = moderateCreature(5, "brute", "Brute");
    const archer = { ...brute, strikes: [{ ...brute.strikes[0], name: "Longbow", melee: false, increment: 100, damage: [{ dice: 3, die: 8, bonus: 6, multiplier: 1, type: "piercing" }] }] };
    assert.equal(ducksFromCoverFire(brute), true);
    assert.equal(ducksFromCoverFire(archer), false);
    const [fighter] = martialParty(5);
    const gunslinger = { ...fighter, id: "nhalmika", band: "far", strikes: [scattergun], strikeActivities: [{ name: "Cover Fire", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, coverFire: true, oncePerRound: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null }] };
    const state = createFightState({ combatants: [gunslinger, { ...archer, id: "archer", band: "far" }] }, {}, 1);
    const c = state.byId.get("nhalmika");
    c.actionsLeft = 3;
    c.usedThisTurn = new Set();
    const cover = scoreOptions(state, c).options.find((option) => option.action.type === "strikeActivity");
    assert.ok(cover, "offered against an archer, who won't duck");
    state.log = [];
    performAction(state, c, cover.action);
    assert.ok(state.log.some((line) => /stands firm/.test(line)));
    assert.ok(c.usedThisTurn.has("cover-fire") && c.unloaded.has("Dwarven Scattergun"));
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "strikeActivity"), "once a round, and the scattergun is empty");
});
