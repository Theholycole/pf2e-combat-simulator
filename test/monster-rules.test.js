import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { createFightState, performAction, simulate, turnEnd } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage, dealDamage, expectedHitDamage, featureParts, performStrike, provoke as provokeFor, step, stride } from "../src/engine/actions.js";
import { armorClass, isActive, isOffGuard } from "../src/engine/combatant.js";
import { addBuiltin, chargeOn, chargeStrike, deltasFor, multiStrikeOrder, saveBonusAgainst, strikeNamed, withExtraDamage } from "../src/engine/abilities.js";
import { applyAuras, applyCondition, applyStrikeRider, bothHitRider, castPlan, castSpell, deathThroes, downsAnswers, expireTimers, grabTurnAnswers, ownTurnStart, retch, targetSets as targetSetsFor, triggerRiders } from "../src/engine/spells.js";
import { engage, sameMelee } from "../src/engine/space.js";

// Monster abilities the engine plays as its own rules ({ builtin }), and the
// ones compiled from PF2e's packs (Swallow Whole, Trample, Stench).
const ABILITIES = "../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js";
const PACKS = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const available = existsSync(new URL(ABILITIES, import.meta.url)) && existsSync(`${PACKS}/pathfinder-monster-core`);
const skip = !available && "the ability module or PF2e's packs not found";

let compiled = null;
async function packAbilities() {
    if (compiled) return compiled;
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileBasicActions, compileMonsterAbility } = await import(ABILITIES);
    const basicActions = compileBasicActions(readDocuments(`${PACKS}/actions`).filter((doc) => doc.collection === "items"));
    const npcs = readDocuments(`${PACKS}/pathfinder-monster-core`).filter((doc) => doc.collection === "actors" && doc.type === "npc");
    const npc = (name) => npcs.find((entry) => entry.name === name);
    const monster = (creature, name) => compileMonsterAbility(npc(creature).items.find((item) => item.name.startsWith(name)), { basicActions, actor: npc(creature) });
    compiled = {
        basic: basicActions,
        improvedGrab: monster("Megalodon", "Improved Grab"),
        swallow: monster("Megalodon", "Swallow Whole"),
        trample: monster("Elephant", "Trample"),
        stench: monster("Ghoul Soldier", "Stench"),
        venom: monster("Giant Scorpion", "Giant Scorpion Venom"),
        hellfire: monster("Greater Hell Hound", "Hellfire Breath")
    };
    return compiled;
}
const entry = (name, plan, kind = "ability") => ({ name, plan, castRank: 1, dc: null, attack: null, pool: null, kind });
const withBuiltins = (spec, ...builtins) => {
    for (const [name, plan] of builtins) assert.ok(addBuiltin(spec, plan, name), name);
    return spec;
};

test("Sneak Attack adds its dice against an off-guard target; Pack Attack with two allies by the target", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "wolf", "Wolf");
    const wolf = withBuiltins({ ...base, engagement: 1 }, ["Sneak Attack", { builtin: "strike-extra", extras: [{ when: "off-guard", dice: 2, die: 6, precision: true, type: null }] }], ["Pack Attack", { builtin: "strike-extra", extras: [{ when: "pack", dice: 1, die: 8, precision: false, type: null }] }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, wolf] });
    const c = state.byId.get("wolf");
    const target = state.byId.get("fighter");
    const strike = c.strikes[0];
    const plain = expectedHitDamage(c, strike, target, false);
    assert.equal(expectedHitDamage(c, strike, target, false, { offGuardChance: 1 }), plain + 7, "2d6 precision");
    assert.equal(expectedHitDamage(c, strike, target, true, { offGuardChance: 1 }) - expectedHitDamage(c, strike, target, true), 14, "doubled on a critical hit");
    assert.equal(expectedHitDamage(c, strike, target, false, { packAllies: 2 }), plain + 4.5);
    assert.equal(expectedHitDamage(c, strike, target, false, { packAllies: 1 }), plain);
    // Precision immunity ignores Sneak Attack.
    target.immunities = ["precision"];
    target.defenceId = undefined;
    assert.equal(expectedHitDamage(c, strike, target, false, { offGuardChance: 1 }), expectedHitDamage(c, strike, target, false));
});

test("Regeneration: a monster at 0 HP is dying (never past 3), not dead; damage of a listed type turns it off, and then it can die", () => {
    const [fighter] = martialParty(5);
    const troll = withBuiltins({ ...moderateCreature(5, "troll", "Troll"), engagement: 1 }, ["Regeneration 20", { builtin: "regeneration", value: 20, deactivatedBy: ["fire"] }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, troll, { ...moderateCreature(5, "ogre", "Ogre"), engagement: 1 }] });
    state.round = 1;
    const c = state.byId.get("troll");
    dealDamage(state, c, c.hp.value + 5);
    assert.deepEqual([c.status, c.cond.dying], ["down", 1], "dying, not dead");
    dealDamage(state, c, 30, { critical: true });
    dealDamage(state, c, 30, { critical: true });
    assert.deepEqual([c.status, c.cond.dying], ["down", 3], "never past dying 3");
    // Fire turns it off; then damage while down kills it.
    applyDamage(state, c, [{ type: "fire", amount: 5, persistent: false, precision: false }]);
    assert.equal(c.regenerationOff, true);
    dealDamage(state, c, 5);
    assert.equal(c.status, "dead");
});

test("Regeneration in a fight: a downed troll gets back up while another monster fights on", () => {
    const troll = withBuiltins({ ...moderateCreature(5, "troll", "Troll") }, ["Regeneration 20", { builtin: "regeneration", value: 20, deactivatedBy: ["fire"] }]);
    let ups = 0;
    for (let seed = 1; seed <= 20; seed++) {
        const party = martialParty(5).map((pc) => ({ ...pc }));
        const result = simulate({ combatants: [...party, troll, { ...moderateCreature(7, "boss", "Boss") }] }, {}, seed, { log: true });
        ups += result.log.filter((line) => /regenerates and wakes/.test(line)).length;
    }
    assert.ok(ups > 0, "it gets back up");
});

test("Regeneration timing: turned off before the troll's turn, it's back at the end of that turn", () => {
    const [fighter] = martialParty(5);
    const troll = withBuiltins({ ...moderateCreature(5, "troll", "Troll"), engagement: 1 }, ["Regeneration 20", { builtin: "regeneration", value: 20, deactivatedBy: ["fire", "acid"] }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, troll] });
    state.round = 2;
    const c = state.byId.get("troll");
    c.round = 1;
    applyDamage(state, c, [{ type: "acid", amount: 3, persistent: false, precision: false }]);
    assert.equal(c.regenerationOff, true);
    expireTimers(state, c, "start");
    assert.equal(c.regenerationOff, true, "still off during its turn");
    expireTimers(state, c, "end");
    assert.equal(c.regenerationOff, false, "back at the end of it");
    // Damaged during its own turn: off through its next one.
    c.round = 2;
    applyDamage(state, c, [{ type: "fire", amount: 3, persistent: false, precision: false }]);
    expireTimers(state, c, "end");
    assert.equal(c.regenerationOff, true);
    state.round = 3;
    expireTimers(state, c, "end");
    assert.equal(c.regenerationOff, false);
});

test("Fast Healing heals at the start of the monster's turn", () => {
    const [fighter] = martialParty(5);
    const imp = withBuiltins({ ...moderateCreature(5, "imp", "Imp"), band: "far" }, ["Fast Healing 5", { builtin: "fast-healing", value: 5 }]);
    const result = simulate({ combatants: [{ ...fighter }, { ...imp, hp: { value: 10, max: imp.hp.max } }] }, {}, 1, { log: true });
    assert.ok(result.log.some((line) => /Imp regains 5 HP/.test(line)));
});

test("Draconic Frenzy: three Strikes for two actions, agile ones last; Draconic Momentum recharges the breath on a critical hit", () => {
    const [fighter] = martialParty(8);
    const base = moderateCreature(8, "dragon", "Dragon");
    const strike = base.strikes[0];
    const dragon = withBuiltins({
        ...base,
        engagement: 1,
        strikes: [{ ...strike, name: "Jaws" }, { ...strike, name: "Claw", agile: true, bonus: strike.bonus }, { ...strike, name: "Tail", bonus: strike.bonus - 2 }]
    }, ["Draconic Frenzy", { builtin: "multi-strike", actions: 2, strikes: ["claw", "claw", "tail"] }], ["Draconic Momentum", { builtin: "momentum", recharges: ["Breath"] }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 9999, max: 9999 } }, dragon] });
    const c = state.byId.get("dragon");
    c.actionsLeft = 3;
    const frenzy = scoreOptions(state, c).options.find((option) => option.action.type === "multiStrike");
    assert.deepEqual([frenzy?.action.targetId, frenzy?.action.actions], ["fighter", 2]);
    const strike2 = scoreOptions(state, c).options.find((option) => option.action.type === "strike" && option.action.strikeIndex === 0);
    assert.ok(frenzy.value > strike2.value, "three Strikes are worth more than one");
    // Three Strikes, the multiple attack penalty rising; a critical hit recharges the breath.
    const breath = { name: "Breath" };
    c.rechargeUntil = new Map([[breath, 99]]);
    state.rng.d20 = () => 20;
    c.strikes.forEach((s) => (s.bonus = 30));
    for (const index of [1, 1, 2]) performStrike(state, c, state.byId.get("fighter"), c.strikes[index]);
    assert.equal(c.attacksThisTurn, 3);
    assert.equal(c.rechargeUntil.has(breath), false, "a critical hit recharged it");
    // In whole fights, the action makes its three Strikes (fewer when the target drops and no one else is in reach).
    let complete = 0;
    for (let seed = 1; seed <= 10; seed++) {
        const { log } = simulate({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, seed, { log: true });
        for (const [index, line] of log.entries()) {
            if (!/Dragon uses Draconic Frenzy/.test(line)) continue;
            const strikes = log.slice(index + 1, index + 4).map((next) => /Dragon (Claw|Tail) →/.exec(next)?.[1]).filter(Boolean);
            assert.deepEqual(strikes, ["Tail", "Claw", "Claw"].slice(0, strikes.length));
            if (strikes.length === 3) complete++;
        }
    }
    assert.ok(complete > 0);
});

test("Pounce: Stride and Strike as one action, from the near band", () => {
    const [fighter] = martialParty(5);
    const cat = withBuiltins({ ...moderateCreature(5, "cat", "Cat"), band: "near" }, ["Pounce", { builtin: "charge", actions: 1, strides: 1, strike: null }]);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, cat] });
    const c = state.byId.get("cat");
    c.actionsLeft = 1;
    const pounce = scoreOptions(state, c).options.find((option) => option.action.type === "charge");
    assert.equal(pounce?.action.targetId, "fighter");
    const result = simulate({ combatants: [{ ...fighter, band: "near", hp: { value: 9999, max: 9999 } }, cat] }, { morale: false, roundCap: 1 }, 1, { log: true });
    const turn = result.log.slice(result.log.findIndex((line) => line.startsWith("Cat (")));
    assert.ok(turn.some((line) => /Cat uses Pounce/.test(line)));
});

test("+1 status to all saves vs. magic: against spells and magical abilities, not a plain monster ability", () => {
    const yamaraj = withBuiltins({ ...moderateCreature(5, "y", "Y") }, ["+1 Status to All Saves vs. Magic", { builtin: "save-bonus", bonuses: [{ saves: ["fortitude", "reflex", "will"], value: 1, type: "status", predicate: ["item:magical"] }] }], ["+2 Status vs. Mental", { builtin: "save-bonus", bonuses: [{ saves: ["will"], value: 2, type: "status", predicate: ["item:trait:mental"] }] }]);
    const fireball = { name: "Fireball", kind: undefined, plan: { traits: ["fire"] }, tradition: "arcane" };
    const breath = { name: "Breath", kind: "ability", plan: { traits: ["poison"] } };
    const charm = { name: "Charm", plan: { traits: ["mental", "incapacitation"] } };
    assert.equal(saveBonusAgainst(yamaraj, "reflex", fireball), 1);
    assert.equal(saveBonusAgainst(yamaraj, "fortitude", breath), 0, "not magical");
    assert.equal(saveBonusAgainst(yamaraj, "fortitude", { ...breath, plan: { traits: ["arcane", "poison"] } }), 1, "a tradition's trait makes it magical");
    assert.equal(saveBonusAgainst(yamaraj, "will", charm), 2, "status bonuses don't stack: the higher");
});

test("Improved Grab from a real stat block: the Strike lists improved-grab", { skip }, async () => {
    const { improvedGrab } = await packAbilities();
    const [fighter] = martialParty(10);
    const shark = { ...moderateCreature(10, "shark", "Shark"), engagement: 1, skills: { athletics: 60 } };
    shark.strikes = [{ ...shark.strikes[0], name: "Jaws", attackEffects: ["improved-grab"] }];
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...shark, spells: [entry("Improved Grab", improvedGrab)] }] });
    const c = state.byId.get("shark");
    triggerRiders(state, c, state.byId.get("fighter"), c.strikes[0]);
    assert.equal(state.byId.get("fighter").grabbedBy, "shark");
});

test("Swallow Whole: inside the swallower, crushed each turn, out by Escape, a Rupture cut, or the swallower dying", { skip }, async () => {
    const { swallow, basic } = await packAbilities();
    const [fighter, champion] = martialParty(10);
    const shark = { ...moderateCreature(10, "shark", "Shark"), engagement: 1, size: "grg", skills: { athletics: 60 }, spells: [entry("Swallow Whole", swallow)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, size: "med", spells: [entry("Escape", basic.escape, "basic")] }, { ...champion, engagement: 1 }, shark] });
    state.round = 1;
    const c = state.byId.get("shark");
    const pc = state.byId.get("fighter");
    const other = state.byId.get("champion");
    c.actionsLeft = 3;
    assert.equal(scoreOptions(state, c).options.filter((option) => option.action.type === "cast").length, 0, "only a creature it holds");
    pc.cond.grabbed = true;
    pc.grabbedBy = "shark";
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "cast");
    assert.deepEqual(option?.action.targetIds, ["fighter"]);
    const hp = pc.hp.value;
    castSpell(state, c, 0, ["fighter"]);
    assert.equal(pc.swallowedBy, "shark");
    assert.ok(pc.hp.value < hp, "the damage when first swallowed");
    assert.deepEqual([pc.cond.grabbed, pc.cond.slowed, isActive(pc)], [true, 1, false]);
    assert.ok(!scoreOptions(state, other).options.some((entry) => entry.action.targetId === "fighter" || entry.action.targetIds?.includes("fighter")), "nobody else can reach it");
    // The swallower moving doesn't let it out.
    const { stride } = await import("../src/engine/actions.js");
    stride(state, c, { kind: "toNear" });
    assert.equal(pc.swallowedBy, "shark");
    // A hit of at least Rupture 20 piercing or slashing cuts it free.
    applyDamage(state, c, [{ type: "slashing", amount: 25, persistent: false, precision: false }]);
    assert.deepEqual([pc.swallowedBy, pc.cond.grabbed, pc.cond.slowed, isActive(pc)], [null, false, 0, true]);
    // Escape: the grabbed condition ends, and it comes out through the mouth.
    pc.cond.grabbed = true;
    pc.grabbedBy = "shark";
    castSpell(state, c, 0, ["fighter"]);
    assert.equal(pc.swallowedBy, "shark");
    pc.skills = { ...pc.skills, athletics: 80 };
    castSpell(state, pc, 0, ["shark"]);
    assert.equal(pc.swallowedBy, null, "escaped");
    // The swallower dies: free.
    pc.cond.grabbed = true;
    pc.grabbedBy = "shark";
    castSpell(state, c, 0, ["fighter"]);
    dealDamage(state, c, c.hp.max * 3);
    assert.equal(pc.swallowedBy, null);
});

test("Swallow Whole in whole fights: the swallowed creature is crushed at the end of its turns and gets out", { skip }, async () => {
    const { swallow, improvedGrab, basic } = await packAbilities();
    const party = martialParty(10).map((pc) => ({ ...pc, spells: Object.entries(basic).map(([name, plan]) => entry(name, plan, "basic")) }));
    const base = moderateCreature(10, "shark", "Shark");
    const shark = { ...base, size: "grg", skills: { athletics: 22 }, strikes: [{ ...base.strikes[0], name: "Jaws", attackEffects: ["improved-grab"] }], spells: [entry("Improved Grab", improvedGrab), entry("Swallow Whole", swallow)] };
    let swallowed = 0;
    let crushed = 0;
    let out = 0;
    for (let seed = 1; seed <= 30; seed++) {
        const result = simulate({ combatants: [...party, shark] }, {}, seed, { log: true });
        swallowed += result.log.filter((line) => /swallows/.test(line)).length;
        crushed += result.log.filter((line) => /is crushed inside/.test(line)).length;
        out += result.log.filter((line) => /escapes from|cuts itself free|is freed from/.test(line)).length;
    }
    assert.ok(swallowed > 0 && crushed > 0 && out > 0, `${swallowed} swallowed, ${crushed} crushed, ${out} out`);
});

test("Trample: the enemies of the listed size or smaller in one Melee save against the Strike's damage", { skip }, async () => {
    const { trample } = await packAbilities();
    const [fighter, champion] = martialParty(7);
    const elephant = { ...moderateCreature(7, "elephant", "Elephant"), band: "near", size: "huge", spells: [entry("Trample", trample)] };
    const ogre = { ...moderateCreature(7, "ogre", "Ogre"), engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, size: "med" }, { ...champion, engagement: 1, size: "huge" }, elephant, ogre] });
    const c = state.byId.get("elephant");
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "cast");
    assert.deepEqual(option?.action.targetIds, ["fighter"], "Large or smaller: not the Huge champion, nor its own ally");
    const hp = state.byId.get("fighter").hp.value;
    state.byId.get("fighter").saves = { fortitude: 0, reflex: -40, will: 0 };
    castSpell(state, c, 0, ["fighter"]);
    assert.ok(state.byId.get("fighter").hp.value < hp);
    assert.equal(c.meleeId, state.byId.get("fighter").meleeId, "it ends beside them");
});

test("Stench: each enemy in the aura saves as the fight starts; a critical failure also slows", { skip }, async () => {
    const { stench } = await packAbilities();
    const party = martialParty(3).map((pc) => ({ ...pc, band: "near", saves: { ...pc.saves, fortitude: -40 } }));
    const ghoul = { ...moderateCreature(3, "ghoul", "Ghoul"), band: "near", spells: [entry("Stench", stench)] };
    const state = createFightState({ combatants: [...party, ghoul] });
    applyAuras(state);
    for (const pc of party) assert.deepEqual([state.byId.get(pc.id).cond.sickened, state.byId.get(pc.id).cond.slowed], [1, 1]);
});

// A poison as the ability module compiles one (Giant Scorpion Venom, DC 18):
// stage 1 1d10 poison and enfeebled 1, stage 2 2d10, stage 3 2d10 and enfeebled 2; 1 round each, 6 rounds at most.
test("Afflictions: a failed save afflicts at stage 1 (2 on a critical failure); each stage's save moves it; a poison again raises the stage", { skip }, async () => {
    const { venom } = await packAbilities();
    const [fighter] = martialParty(3);
    const scorpion = { ...moderateCreature(3, "scorpion", "Scorpion"), engagement: 1, spells: [entry("Giant Scorpion Venom", venom)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, scorpion] });
    state.round = 1;
    const c = state.byId.get("scorpion");
    const pc = state.byId.get("fighter");
    // Saves: d20 10 + Fortitude 0 against DC 18 is a failure; -10 a critical failure; +10 a success.
    state.rng.d20 = () => 10;
    pc.saves = { ...pc.saves, fortitude: 0 };
    let hp = pc.hp.value;
    castSpell(state, c, 0, ["fighter"]);
    assert.deepEqual([pc.afflictions[0].stage, pc.cond.enfeebled], [1, 1]);
    assert.ok(pc.hp.value < hp, "stage 1's poison damage");
    // Exposed again (a poison): up one stage, the maximum duration unchanged.
    castSpell(state, c, 0, ["fighter"]);
    assert.deepEqual([pc.afflictions.length, pc.afflictions[0].stage, pc.cond.enfeebled], [1, 2, 1], "stage 2: more damage, enfeebled 1");
    // The stage runs out at the start of the scorpion's next turn: a failed save, stage 3.
    state.round = 2;
    hp = pc.hp.value;
    expireTimers(state, c, "start");
    assert.deepEqual([pc.afflictions[0].stage, pc.cond.enfeebled], [3, 2]);
    assert.ok(pc.hp.value < hp);
    // A critical success lowers it by 2, a success by 1: cured.
    pc.saves.fortitude = 20;
    state.round = 3;
    expireTimers(state, c, "start");
    assert.deepEqual([pc.afflictions[0].stage, pc.cond.enfeebled], [1, 1]);
    pc.saves.fortitude = 10;
    state.round = 4;
    expireTimers(state, c, "start");
    assert.deepEqual([pc.afflictions.length, pc.cond.enfeebled], [0, 0], "recovered");
    // A critical failure: stage 2 at once.
    pc.saves.fortitude = -10;
    castSpell(state, c, 0, ["fighter"]);
    assert.equal(pc.afflictions[0].stage, 2);
    // Past the maximum duration (6 rounds), it ends.
    state.round = 99;
    expireTimers(state, c, "start");
    assert.equal(pc.afflictions.length, 0);
});

test("Afflictions: immunity to poison, a disease measured in days, a stage that kills", () => {
    const [fighter, champion] = martialParty(3);
    const plan = (data) => ({
        modelVersion: 13, source: { name: data.name, slug: data.name }, rank: 1, traits: data.traits,
        targeting: { target: "a creature", range: "touch" },
        trigger: { event: "strike", attackEffect: data.name, cost: "free" },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 20 } }, outcomes: { criticalSuccess: { effects: [] }, success: { effects: [] }, failure: { effects: [], affliction: { stage: 1 } }, criticalFailure: { effects: [], affliction: { stage: 2 } } }, afflictionHandoff: data }
    });
    const disease = { name: "rot", traits: ["disease"], statistic: "fortitude", dc: 20, maximumDuration: null, onset: null, stages: [{ stage: 1, damage: [], conditions: [{ slug: "sickened", value: 1 }], duration: { value: 1, unit: "days" } }, { stage: 2, damage: [], conditions: [], duration: null, death: true }] };
    const poison = { name: "venom", traits: ["poison"], statistic: "fortitude", dc: 20, maximumDuration: { value: 6, unit: "rounds" }, onset: null, stages: [{ stage: 1, damage: ["2d6[poison]"], conditions: [], duration: { value: 1, unit: "rounds" } }] };
    const monster = { ...moderateCreature(3, "m", "M"), engagement: 1, spells: [entry("rot", plan(disease)), entry("venom", plan(poison))] };
    // d20 10 + Fortitude 5 against DC 20: a failure; a natural 1, a critical failure.
    const fortitude = { fortitude: 5, reflex: 5, will: 5 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, saves: fortitude }, { ...champion, engagement: 1, saves: fortitude, immunities: ["poison"] }, monster] });
    state.rng.d20 = () => 10;
    state.round = 1;
    const c = state.byId.get("m");
    castSpell(state, c, 1, ["champion"]);
    assert.equal(state.byId.get("champion").afflictions?.length ?? 0, 0, "immune to poison");
    castSpell(state, c, 0, ["fighter"]);
    const pc = state.byId.get("fighter");
    assert.deepEqual([pc.afflictions[0].stage, pc.cond.sickened], [1, 1]);
    assert.equal(pc.timers.some((timer) => timer.affliction), false, "a day-long stage has no save in the fight");
    castSpell(state, c, 0, ["fighter"]);
    assert.equal(pc.afflictions[0].stage, 1, "a disease it already has does nothing more");
    // A critical failure straight to the final stage: dead.
    state.rng.d20 = () => 1;
    const other = createFightState({ combatants: [{ ...fighter, engagement: 1, saves: fortitude }, monster] });
    other.rng.d20 = () => 1;
    castSpell(other, other.byId.get("m"), 0, ["fighter"]);
    assert.equal(other.byId.get("fighter").status, "dead");
});

test("Afflictions in fights: a scorpion Strikes with the venomous Stinger rather than its Pincer", { skip }, async () => {
    const { venom } = await packAbilities();
    const [fighter] = martialParty(3);
    const base = moderateCreature(3, "scorpion", "Scorpion");
    const scorpion = { ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Pincer" }, { ...base.strikes[0], name: "Stinger", damage: base.strikes[0].damage.map((part) => ({ ...part, bonus: part.bonus - 2 })), attackEffects: ["giant-scorpion-venom"] }], spells: [entry("Giant Scorpion Venom", venom)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, scorpion] });
    const c = state.byId.get("scorpion");
    c.actionsLeft = 3;
    const best = scoreOptions(state, c).options.filter((option) => option.action.type === "strike").sort((a, b) => b.value - a.value)[0];
    assert.equal(c.strikes[best.action.strikeIndex].name, "Stinger", "the venom outweighs 2 damage");
});

// d20 results in turn, for exact rolls.
const dice = (...rolls) => () => rolls.shift() ?? 10;

test("Nimble Dodge: +2 AC as the attack comes; Retract Body: +2 AC once it hits, only when that turns it aside", () => {
    const [fighter] = martialParty(5);
    const wererat = withBuiltins({ ...moderateCreature(5, "rat", "Rat"), engagement: 1, ac: 20 }, ["Nimble Dodge", { builtin: "ac-reaction", value: 2, when: "targeted" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, wererat] }, {}, 1);
    state.log = [];
    const pc = state.byId.get("fighter");
    const rat = state.byId.get("rat");
    const strike = { ...pc.strikes[0], bonus: 10 };
    state.rng.d20 = dice(11);
    assert.equal(performStrike(state, pc, rat, strike).degree, 1, "21 against AC 22: a miss");
    assert.ok(state.log.some((line) => /Rat uses Nimble Dodge/.test(line)));
    pc.attacksThisTurn = 0;
    state.rng.d20 = dice(11);
    assert.equal(performStrike(state, pc, rat, strike).degree, 2, "the reaction is spent");

    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, ac: 20 }, ["Retract Body", { builtin: "ac-reaction", value: 2, when: "hit" }]);
    const other = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    const d = other.byId.get("dragon");
    const attacker = other.byId.get("fighter");
    other.rng.d20 = dice(15);
    assert.equal(performStrike(other, attacker, d, { ...strike, bonus: 10 }).degree, 2, "25 against AC 22: still a hit, so it's kept");
    assert.equal(d.reactionUsed, false);
    attacker.attacksThisTurn = 0;
    other.rng.d20 = dice(11);
    assert.equal(performStrike(other, attacker, d, strike).degree, 1, "21 against 20 + 2: turned aside");
    assert.equal(d.reactionUsed, true);
});

test("Challenge Fate: the attacker rolls twice and takes the worse", () => {
    const [fighter] = martialParty(5);
    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, ac: 20 }, ["Challenge Fate", { builtin: "attack-misfortune" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    const pc = state.byId.get("fighter");
    state.rng.d20 = dice(20, 3);
    assert.equal(performStrike(state, pc, state.byId.get("dragon"), { ...pc.strikes[0], bonus: 10 }).degree, 1, "13 against AC 20: the 3, not the 20");
});

test("Twisting Tail: a Strike at a creature moving away, which stops the move when it hits; Death Frenzy: a last Strike at 0 HP", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "dragon", "Dragon");
    const dragon = withBuiltins({ ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Jaws" }, { ...base.strikes[0], name: "Tail", bonus: 40 }] },
        ["Twisting Tail", { builtin: "reaction-strike", triggers: ["move"], strike: "tail", penalty: 2, disrupts: true }],
        ["Death Frenzy", { builtin: "death-strike", strike: "jaws" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, dragon] }, {}, 1);
    state.log = [];
    const pc = state.byId.get("fighter");
    const c = state.byId.get("dragon");
    stride(state, pc, { kind: "toNear" });
    assert.ok(state.log.some((line) => /Dragon uses Twisting Tail/.test(line)));
    assert.ok(state.log.some((line) => /Dragon Tail → Fighter: .* vs AC \d+, (?:critically )?hits/.test(line)), "with the Tail, at -2");
    assert.equal(pc.meleeId, c.meleeId, "the move is disrupted");
    c.reactionUsed = false;
    dealDamage(state, c, c.hp.value + 5, { source: pc });
    assert.ok(state.log.some((line) => /Dragon uses Death Frenzy/.test(line)));
    assert.ok(state.log.some((line) => /Dragon Jaws → Fighter/.test(line)));
    assert.equal(c.status, "dead");
});

test("Confused: off-guard, no reactions, its actions Strike random creatures (allies too); damage gives a DC 11 flat check to end it", () => {
    const [fighter] = martialParty(5);
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1 };
    const ally = { ...moderateCreature(5, "ally", "Ally"), engagement: 1, hp: { value: 999, max: 999 } };
    let allyHit = 0;
    for (let seed = 1; seed <= 20; seed++) {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, brute, ally] }, {}, seed);
        const c = state.byId.get("brute");
        applyCondition(state, c, "confused", null, { mode: "fixed", value: 3, unit: "rounds" }, null);
        assert.ok(isOffGuard(c));
        const { log } = simulate({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, { ...brute, conditions: { confused: true } }, ally] }, { roundCap: 1, morale: false }, seed, { log: true });
        allyHit += log.filter((line) => /Brute .* → Ally/.test(line)).length;
    }
    assert.ok(allyHit > 0, "it hits its own side");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...brute, reactions: { aoo: true } }] }, {}, 1);
    const c = state.byId.get("brute");
    c.cond.confused = true;
    state.rng.d20 = dice(20);
    dealDamage(state, c, 1, { source: state.byId.get("fighter") });
    assert.equal(c.cond.confused, false, "a 20 on the flat check");
});

test("Retch: a sickened creature's Fortitude save against the DC that sickened it", async () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, saves: { fortitude: 10, reflex: 0, will: 0 } }, { ...moderateCreature(5, "ghoul", "Ghoul"), engagement: 1 }] }, {}, 1);
    const pc = state.byId.get("fighter");
    pc.cond.sickened = 2;
    pc.sickenedDC = 20;
    pc.actionsLeft = 3;
    assert.ok(scoreOptions(state, pc).options.some((option) => option.action.type === "retch"));
    // Fortitude 10, -2 for sickened 2: 12 + 8 against DC 20 is a success.
    state.rng.d20 = dice(12);
    retch(state, pc);
    assert.equal(pc.cond.sickened, 1);
    state.rng.d20 = dice(20);
    retch(state, pc);
    assert.deepEqual([pc.cond.sickened, pc.sickenedDC], [0, null]);
    // The DC comes from what sickened it (Stench's fixed DC).
    if (skip) return;
    const { stench } = await packAbilities();
    const other = createFightState({ combatants: [{ ...fighter, band: "near", saves: { fortitude: -40, reflex: 0, will: 0 } }, { ...moderateCreature(3, "g", "G"), band: "near", spells: [entry("Stench", stench)] }] });
    applyAuras(other);
    const sick = other.byId.get("fighter");
    assert.equal(sick.sickenedDC, stench.resolution.check.against.value);
    // A critical failure's slowed 1 lasts as long as it's sickened.
    assert.deepEqual([sick.cond.sickened, sick.cond.slowed], [1, 1]);
    other.rng.d20 = dice(20);
    sick.saves.fortitude = 40;
    retch(other, sick);
    assert.deepEqual([sick.cond.sickened, sick.cond.slowed], [0, 0]);
});

test("Charges: Boar Charge's +2 to the attack roll, Powerful Charge's bigger damage", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "boar", "Boar");
    const boar = withBuiltins({ ...base, band: "near", strikes: [{ ...base.strikes[0], name: "Tusk" }] }, ["Boar Charge", { builtin: "charge", actions: 2, strides: 2, strike: "tusk", attackBonus: 2 }]);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, boar] }, {}, 1);
    state.log = [];
    const c = state.byId.get("boar");
    c.actionsLeft = 2;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "charge");
    assert.equal(option?.action.actions, 2);
    const charged = chargeStrike(c.strikes[0], c.charges[0]);
    assert.deepEqual([charged.name, charged.bonus], ["Tusk (Boar Charge)", c.strikes[0].bonus + 2]);
    const powerful = chargeStrike({ ...c.strikes[0], name: "Horn" }, { name: "Powerful Charge", damage: "3d10+20" });
    assert.deepEqual(powerful.damage[0], { dice: 3, die: 10, bonus: 20, multiplier: 1, type: c.strikes[0].damage[0].type, persistent: false, precision: false });
    // In fights against an archer who keeps away, it charges.
    const ranger = martialParty(5)[2];
    let charges = 0;
    for (let seed = 1; seed <= 10; seed++) {
        const result = simulate({ combatants: [{ ...ranger, band: "near", hp: { value: 999, max: 999 } }, boar] }, { roundCap: 2, morale: false }, seed, { log: true });
        charges += result.log.filter((entry) => /Boar Tusk \(Boar Charge\) →/.test(entry)).length;
    }
    assert.ok(charges > 0, "the charge's own Strike in a fight");
});

test("Strike activities: Wrestle knocks a grabbed creature prone on a hit; a save rider only for creatures small enough", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "tiger", "Tiger");
    const tiger = withBuiltins({ ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Claw", bonus: 40 }] },
        ["Wrestle", { builtin: "strike-activity", actions: 1, strides: 0, strike: "claw", attackBonus: 0, damageBonus: 0, offGuard: false, requires: "grabbed", oncePerFight: false, onHit: { conditions: [{ slug: "prone", value: null, duration: null }], critical: null, push: null, damage: [], save: null, size: null } }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, tiger] }, {}, 1);
    const c = state.byId.get("tiger");
    const pc = state.byId.get("fighter");
    c.actionsLeft = 1;
    assert.equal(scoreOptions(state, c).options.some((option) => option.action.type === "strikeActivity"), false, "only on a creature it holds");
    pc.cond.grabbed = true;
    pc.grabbedBy = "tiger";
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "strikeActivity");
    assert.equal(option?.action.targetId, "fighter");
    applyStrikeRider(state, c, pc, c.strikeActivities[0], false);
    assert.equal(pc.cond.prone, true);
    // A save rider for a Medium or smaller creature: not for a Large one.
    const shove = { ...c.strikeActivities[0], onHit: { conditions: [{ slug: "frightened", value: 1, duration: null }], critical: null, push: null, damage: [], save: null, size: "medium" } };
    pc.size = "large";
    applyStrikeRider(state, c, pc, shove, false);
    assert.equal(pc.cond.frightened, 0);
    pc.size = "med";
    applyStrikeRider(state, c, pc, shove, false);
    assert.equal(pc.cond.frightened, 1);
});

test("Engulf: an engulfed creature Escapes against the listed DC, not the monster's Athletics DC", { skip }, async () => {
    const { basic } = await packAbilities();
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileMonsterAbility } = await import(ABILITIES);
    const tarData = readDocuments(`${PACKS}/pathfinder-monster-core`).find((doc) => doc.collection === "actors" && doc.name === "Living Tar");
    const engulf = compileMonsterAbility(tarData.items.find((item) => item.name === "Engulf"), { actor: tarData });
    const [fighter] = martialParty(7);
    const tar = { ...moderateCreature(7, "tar", "Tar"), band: "near", size: "huge", skills: { athletics: 60 }, spells: [entry("Engulf", engulf)] };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", saves: { fortitude: 0, reflex: -40, will: 0 }, skills: { athletics: 12 }, spells: [entry("Escape", basic.escape, "basic")] }, tar] }, {}, 1);
    const c = state.byId.get("tar");
    const pc = state.byId.get("fighter");
    castSpell(state, c, 0, ["fighter"]);
    assert.equal(pc.swallowedBy, "tar");
    assert.equal(pc.swallow.escapeDC, 22);
    // 10 + 12 = 22 against DC 22 (the tar's Athletics DC would be 70): out.
    state.rng.d20 = dice(10);
    castSpell(state, pc, 0, ["tar"]);
    assert.equal(pc.swallowedBy, null);
});

test("a monster's Retributive Strike (the glossary's): its ally resists 2 + its level, and it Strikes the attacker", () => {
    const warden = { ...moderateCreature(6, "warden", "Warden"), engagement: 1 };
    assert.equal(addBuiltin(warden, { builtin: "retributive-strike", resistance: 8 }, "Retributive Strike"), true);
    assert.equal(addBuiltin({}, { builtin: "retributive-strike", resistance: null }, "Retributive Strike"), false, "no level, no resistance");
    const [fighter] = martialParty(6);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, warden, { ...moderateCreature(6, "brute", "Brute"), engagement: 1 }] }, {}, 1);
    state.log = [];
    const brute = state.byId.get("brute");
    const hp = brute.hp.value;
    applyDamage(state, brute, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: state.byId.get("fighter") });
    assert.equal(hp - brute.hp.value, 12, "20 - 8");
    assert.ok(state.log.some((line) => /Warden uses Retributive Strike/.test(line)));
    assert.ok(state.log.some((line) => /Warden .* → Fighter/.test(line)), "a Strike at the attacker");
});

test("Resilient Form and the like: a critical hit on it becomes a normal hit on a flat check", () => {
    const dragon = { ...moderateCreature(10, "dragon", "Dragon"), engagement: 1, ac: 10 };
    assert.equal(addBuiltin(dragon, { builtin: "crit-downgrade", dc: 2, uses: 1 }, "Cushioned Blow"), true);
    const [fighter] = martialParty(10);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    state.log = [];
    const f = state.byId.get("fighter");
    const d = state.byId.get("dragon");
    // A natural 20 against AC 10: a critical hit, downgraded once (DC 2 succeeds on anything but a 1).
    state.rng.d20 = (() => { const rolls = [20, 15, 20]; return () => rolls.shift() ?? 10; })();
    performStrike(state, f, d, f.strikes[0]);
    performStrike(state, f, d, f.strikes[0]);
    const lines = state.log.filter((line) => /Cushioned Blow|critical/i.test(line));
    assert.ok(state.log.some((line) => /Dragon uses Cushioned Blow \(flat 15 vs DC 2\)/.test(line)), lines.join("\n"));
    assert.equal(d.critDowngrade.uses, 0, "its one use spent");
    assert.equal(createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1).byId.get("dragon").critDowngrade.uses, 1, "a fresh fight has it again");
});

test("a follow-up to a Strike that hit (Skull Twist): only straight after a hit with that Strike, at that creature", () => {
    const plan = { modelVersion: 13, source: { name: "Test Follow-up" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null },
        trigger: { event: "use", followUp: { strike: "claw", melee: false, on: ["success", "criticalSuccess"] } },
        resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: false, against: { dc: "fixed", value: 21 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "immobilized", value: null, duration: null }] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "immobilized", value: null, duration: null }] } } } };
    const hag = { ...moderateCreature(3, "hag", "Hag"), engagement: 1, spells: [{ name: "Test Follow-up", plan, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    hag.strikes = [{ ...hag.strikes[0], name: "Claw" }, { ...hag.strikes[0], name: "Jaws" }];
    const [fighter] = martialParty(3);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, hag] }, {}, 1);
    const h = state.byId.get("hag");
    h.round = 1;
    h.actionsLeft = 2;
    const offered = () => scoreOptions(state, h).options.some((entry) => entry.action.type === "cast");
    assert.equal(offered(), false, "not without a hit");
    triggerRiders(state, h, state.byId.get("fighter"), h.strikes[1], 2);
    assert.equal(h.riderReady?.index, undefined, "a jaws hit doesn't ready it");
    triggerRiders(state, h, state.byId.get("fighter"), h.strikes[0], 2);
    assert.deepEqual(h.riderReady, { index: 0, targetId: "fighter", degree: 2 });
    assert.equal(offered(), true, "straight after the claw hit");
});

test("several Strikes in one action, read from more wordings, and a Strike at every enemy in its Melee (2026-10-10)", () => {
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1 };
    brute.strikes = [{ ...brute.strikes[0], name: "Vine" }];
    assert.equal(addBuiltin(brute, { builtin: "multi-strike", actions: 2, strikes: ["vine"], each: true, sameMap: true }, "Vine Lash"), true);
    const [fighter, champion, rogue] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1 }, { ...rogue, engagement: 1 }, brute] }, {}, 1);
    state.log = [];
    const b = state.byId.get("brute");
    b.round = 1;
    b.actionsLeft = 3;
    const option = scoreOptions(state, b).options.find((entry) => entry.action.type === "multiStrike");
    assert.ok(option, "on offer with three foes in its Melee");
    performAction(state, b, option.action);
    assert.deepEqual(["Fighter", "Champion", "Ranger"].map((name) => state.log.some((line) => new RegExp(`Brute .*→ ${name}:`).test(line))), [true, true, true], state.log.join("\n"));
    assert.equal(b.attacksThisTurn, 3, "three attacks for the penalty, after all of them");
    // An unnamed Strike is its best melee Strike.
    assert.deepEqual(multiStrikeOrder({ strikes: [{ name: "Fist", melee: true, bonus: 10 }, { name: "Jaws", melee: true, bonus: 12 }, { name: "Bow", melee: false, bonus: 15 }] }, { strikes: [null, null] }), [1, 1]);
});

test("a monster's Power Attack-like Strike activity keeps its extra weapon die and counts as two attacks (2026-10-10)", () => {
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1 };
    assert.equal(addBuiltin(brute, { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, countsAs: 2, extraWeaponDice: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }, "Power Attack"), true);
    assert.deepEqual([brute.strikeActivities[0].countsAs, brute.strikeActivities[0].extraWeaponDice], [2, 1]);
    const strike = { name: "Fist", bonus: 10, melee: true, damage: [{ dice: 1, die: 8, bonus: 4, type: "bludgeoning" }] };
    assert.equal(chargeStrike(strike, { name: "Power Attack", ...brute.strikeActivities[0] }).damage[0].dice, 2, "one more die");
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, brute] }, {}, 1);
    const b = state.byId.get("brute");
    b.round = 1;
    b.actionsLeft = 3;
    const option = scoreOptions(state, b).options.find((entry) => entry.action.type === "strikeActivity");
    assert.ok(option, "on offer");
    performAction(state, b, option.action);
    assert.equal(b.attacksThisTurn, 2, "two attacks for the penalty");
});

test("Strikes at a number of different foes, a Grab after a hit, a Strike outside the penalty, once a turn (2026-10-10, B39)", () => {
    // "makes up to two claw Strikes, each against a different target" / Swipe: at most that many of the foes in its Melee.
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1 };
    brute.strikes = [{ ...brute.strikes[0], name: "Claw" }];
    assert.equal(addBuiltin(brute, { builtin: "multi-strike", actions: 1, strikes: ["claw", "claw"], each: true, max: 2, sameMap: true }, "Swipe"), true);
    assert.equal(brute.multiStrikes[0].max, 2);
    const [fighter, champion, rogue] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1 }, { ...rogue, engagement: 1 }, brute] }, {}, 1);
    state.log = [];
    const b = state.byId.get("brute");
    b.round = 1;
    b.actionsLeft = 3;
    const option = scoreOptions(state, b).options.find((entry) => entry.action.type === "multiStrike");
    assert.ok(option, "on offer");
    performAction(state, b, option.action);
    assert.equal(state.log.filter((line) => /Brute Claw →/.test(line)).length, 2, state.log.join("\n"));
    assert.equal(b.attacksThisTurn, 2);
    // A Strike outside the penalty, once a turn (Wriggling Beard).
    const devil = { ...moderateCreature(5, "devil", "Devil"), engagement: 1 };
    devil.strikes = [{ ...devil.strikes[0], name: "Beard" }];
    addBuiltin(devil, { builtin: "strike-activity", actions: 1, strides: 0, strike: "beard", attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, oncePerTurn: true, noMap: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }, "Wriggling Beard");
    const fight = createFightState({ combatants: [{ ...fighter, engagement: 1 }, devil] }, {}, 1);
    const d = fight.byId.get("devil");
    d.round = 1;
    d.actionsLeft = 3;
    d.attacksThisTurn = 2;
    const beard = scoreOptions(fight, d).options.find((entry) => entry.action.type === "strikeActivity");
    assert.ok(beard, "on offer");
    performAction(fight, d, beard.action);
    assert.equal(d.attacksThisTurn, 2, "it doesn't count toward the penalty");
    assert.equal(scoreOptions(fight, d).options.some((entry) => entry.action.type === "strikeActivity"), false, "once a turn");
});

test("an ability with no roll: its damage and conditions on the target, valued as certain (2026-10-10, B40)", () => {
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const plan = {
        modelVersion: 13, source: { name: "Digest" }, rank: 1, traits: [], activation: { time: "1", traits: [] },
        targeting: { target: "1 creature", range: "touch", area: null }, trigger: { event: "use" },
        resolution: {
            kind: "check", check: { roll: "automatic", statistic: "automatic" },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "(2d12+6)[acid]" }] },
            outcomes: { criticalSuccess: none, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [{ kind: "condition", slug: "drained", value: 1, duration: null }] }, failure: none, criticalFailure: none }
        }
    };
    const [fighter] = martialParty(5);
    const star = { ...moderateCreature(5, "star", "Star"), engagement: 1, spells: [{ name: "Digest", plan, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, star] }, {}, 1);
    state.round = 1;
    const c = state.byId.get("star");
    c.actionsLeft = 3;
    const option = scoreOptions(state, c).options.find((entry) => entry.action.type === "cast");
    assert.ok(option, "on offer");
    const pc = state.byId.get("fighter");
    const hp = pc.hp.value;
    castSpell(state, c, 0, ["fighter"]);
    assert.ok(pc.hp.value <= hp - 8, "at least the damage's minimum");
    assert.equal(pc.cond.drained, 1);
});

test("concealment against a hit: the attacker's flat check, a miss on a failure (2026-10-10, B41)", () => {
    const drake = { ...moderateCreature(5, "drake", "Drake"), engagement: 1 };
    assert.equal(addBuiltin(drake, { builtin: "conceal-reaction", dc: 11, ranged: false, when: "targeted" }, "Shadow Evade"), true);
    const [fighter] = martialParty(5);
    let misses = 0;
    let used = 0;
    for (let seed = 1; seed <= 200; seed++) {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, drake] }, {}, seed);
        state.log = [];
        const f = state.byId.get("fighter");
        const d = state.byId.get("drake");
        // A sure hit before the flat check.
        const strike = { ...f.strikes[0], bonus: 60 };
        const result = performStrike(state, f, d, strike);
        if (state.log.some((line) => /uses Shadow Evade/.test(line))) used++;
        if (result.degree < 2) misses++;
        assert.equal(d.reactionUsed, true);
    }
    assert.equal(used, 200);
    assert.ok(misses > 70 && misses < 130, `about half miss on DC 11: ${misses}`);
    // A concealed target: a DC 5 flat check for every attack.
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, conditions: { concealed: true } }] }, {}, 3);
    state.log = [];
    for (let i = 0; i < 100 && isActive(state.byId.get("foe")); i++) performStrike(state, state.byId.get("fighter"), state.byId.get("foe"), { ...state.byId.get("fighter").strikes[0], bonus: 60 });
    assert.ok(state.log.some((line) => /fails the DC 5 flat check/.test(line)), "some attacks lose the target");
});

test("death throes: a monster's ability that acts as it dies, on the creatures around it (2026-10-10, B42)", () => {
    const burst = {
        modelVersion: 13, source: { name: "Explosive Death" }, rank: 1, traits: [], activation: { time: "passive", traits: [] },
        targeting: { target: null, range: null, area: { type: "emanation", value: 5 } }, trigger: { event: "death" },
        resolution: {
            kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 40 } },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d6[slashing]" }] },
            outcomes: { criticalSuccess: { damage: { mode: "shared", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } }
        }
    };
    const [fighter, champion] = martialParty(5);
    const skeleton = { ...moderateCreature(5, "skeleton", "Skeleton"), engagement: 1, spells: [entry("Explosive Death", burst)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, band: "far" }, skeleton] }, {}, 2);
    state.log = [];
    const s = state.byId.get("skeleton");
    assert.equal(scoreOptions(state, s).options.some((option) => option.action.type === "cast"), false, "never an action of its own");
    const f = state.byId.get("fighter");
    const c = state.byId.get("champion");
    const [hpF, hpC] = [f.hp.value, c.hp.value];
    applyDamage(state, s, [{ type: "untyped", amount: 999, persistent: false }], { source: f });
    assert.equal(s.status, "dead");
    assert.ok(state.log.some((line) => /Skeleton casts Explosive Death at Fighter/.test(line)), state.log.join("\n"));
    assert.ok(f.hp.value < hpF, "the fighter beside it takes the burst");
    assert.equal(c.hp.value, hpC, "not the champion far off");
});

test("a passive that answers a melee hit on the monster, on the attacker (2026-10-10, B43)", () => {
    const quills = (unarmed) => ({
        modelVersion: 13, source: { name: "Defensive Quills" }, rank: 1, traits: [], activation: { time: "passive", traits: [] },
        targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "hit-by", melee: true, ...(unarmed ? { unarmed: true } : {}) },
        resolution: {
            kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 60 } },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "3d8[piercing]" }] },
            outcomes: { criticalSuccess: { damage: { mode: "shared", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } }
        }
    });
    const [fighter] = martialParty(5);
    const run = (plan, strike) => {
        const pukwudgie = { ...moderateCreature(5, "puk", "Pukwudgie"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Defensive Quills", plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, pukwudgie] }, {}, 4);
        state.log = [];
        const f = state.byId.get("fighter");
        const hp = f.hp.value;
        performStrike(state, f, state.byId.get("puk"), { ...f.strikes[0], bonus: 60, ...strike });
        return { hit: hp - f.hp.value, log: state.log.join("\n") };
    };
    assert.ok(run(quills(false), { melee: true }).hit > 0, "a melee hit sets it off");
    assert.equal(run(quills(false), { melee: true, bonus: -60 }).hit, 0, "not a miss");
    assert.equal(run(quills(false), { melee: false }).hit, 0, "not a ranged one");
    assert.equal(run(quills(true), { melee: true, unarmed: false }).hit, 0, "an unarmed-only one: not a weapon");
    assert.ok(run(quills(true), { melee: true, unarmed: true }).hit > 0, "an unarmed-only one: a fist");
});

test("a monster's reaction to a hit, a critical hit or damage on it (2026-10-10, B44)", () => {
    const row = (multiplier) => ({ damage: { mode: "shared", multiplier, sourceComponentIds: multiplier ? ["0"] : [] }, effects: [] });
    const reaction = (name, trigger, targeting = { target: "the attacker", range: "touch", area: null }) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting, trigger: { event: "use", reaction: true, ...trigger },
        resolution: {
            kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 60 } },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "4d6[fire]" }] },
            outcomes: { criticalSuccess: row(0), success: row(0.5), failure: row(1), criticalFailure: row(2) }
        }
    });
    const [fighter] = martialParty(5);
    const run = (plan, strike, { used = false } = {}) => {
        const dragon = { ...moderateCreature(5, "drg", "Dragon"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry(plan.source.name, plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 4);
        state.log = [];
        if (used) state.byId.get("drg").reactionUsed = true;
        const f = state.byId.get("fighter");
        const hp = f.hp.value;
        performStrike(state, f, state.byId.get("drg"), { ...f.strikes[0], ...strike });
        return { hurt: hp - f.hp.value, used: !used && state.byId.get("drg").reactionUsed === true, log: state.log.join("\n") };
    };
    // A critical hit only.
    const splash = reaction("Shrapnel Splash", { event: "hit-by", melee: true, critical: true });
    const crit = run(splash, { melee: true, bonus: 200 });
    assert.ok(crit.hurt > 0 && crit.used, crit.log);
    assert.match(crit.log, /reacts with Shrapnel Splash/);
    assert.equal(run(splash, { melee: true, bonus: -9 }).used, false, "not a miss");
    assert.equal(run(splash, { melee: false, bonus: 200 }).used, false, "not a ranged critical hit");
    assert.equal(run(splash, { melee: true, bonus: 200 }, { used: true }).hurt, 0, "not with its reaction spent");
    // Piercing or slashing damage only.
    const blood = reaction("Freezing Blood", { event: "hit-by", melee: true, damageTypes: ["piercing", "slashing"] });
    const type = fighter.strikes[0].damage[0].type;
    assert.equal(run(blood, { melee: true, bonus: 200 }).used, ["piercing", "slashing"].includes(type), `a ${type} weapon`);
    assert.equal(run(blood, { melee: true, bonus: 200, damage: [{ ...fighter.strikes[0].damage[0], type: "bludgeoning" }] }).used, false, "not a bludgeoning one");
    // Any damage, on the creatures around it.
    const flare = reaction("Solar Flare", { event: "damaged" }, { target: null, range: null, area: { type: "emanation", value: 30 } });
    const flared = run(flare, { melee: true, bonus: 200 });
    assert.ok(flared.used && flared.hurt > 0, flared.log);
});

test("an AC reaction for melee or ranged attacks only (2026-10-10, B45)", () => {
    const [fighter] = martialParty(5);
    const run = (against, melee) => {
        const swarm = withBuiltins({ ...moderateCreature(5, "sw", "Swarm"), engagement: 1, ac: 20 }, ["Evade", { builtin: "ac-reaction", value: 2, when: "targeted", against }]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, swarm] }, {}, 1);
        state.log = [];
        state.rng.d20 = dice(11);
        const pc = state.byId.get("fighter");
        return performStrike(state, pc, state.byId.get("sw"), { ...pc.strikes[0], bonus: 10, melee }).degree;
    };
    assert.equal(run("melee", true), 1, "a melee Strike: dodged");
    assert.equal(run("melee", false), 2, "a ranged one: not");
    assert.equal(run("ranged", false), 1);
    assert.equal(run("ranged", true), 2);
});

test("a mental effect aimed at a monster whose ability answers it (2026-10-10, B46)", () => {
    const row = (multiplier) => ({ damage: { mode: "shared", multiplier, sourceComponentIds: multiplier ? ["0"] : [] }, effects: [] });
    const mind = (reaction) => ({
        modelVersion: 13, source: { name: "Otherworldly Mind" }, rank: 1, traits: ["mental"], activation: { time: reaction ? "reaction" : "passive", traits: [] },
        targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "targeted-by", traits: ["mental"], ...(reaction ? { reaction: true } : {}) },
        resolution: {
            kind: "save", check: { roll: "save", statistic: "will", basic: true, against: { dc: "fixed", value: 60 } },
            sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "4d6[mental]" }] },
            outcomes: { criticalSuccess: row(0), success: row(0.5), failure: row(1), criticalFailure: row(2) }
        }
    });
    const scare = (traits) => ({
        modelVersion: 13, source: { name: "Scare" }, rank: 1, traits, activation: { time: "1", traits },
        targeting: { target: "1 creature", range: "30 feet", area: null },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 10 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 1 }] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 2 }] } } }
    });
    const [fighter] = martialParty(5);
    const run = (traits, reaction = false) => {
        const hound = { ...moderateCreature(5, "hnd", "Hound"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Otherworldly Mind", mind(reaction))] };
        const pc = { ...fighter, engagement: 1, spells: [{ ...entry("Scare", scare(traits)), kind: "basic" }] };
        const state = createFightState({ combatants: [pc, hound] }, {}, 4);
        state.log = [];
        const f = state.byId.get("fighter");
        const hp = f.hp.value;
        castSpell(state, f, 0, ["hnd"]);
        return { hurt: hp - f.hp.value, log: state.log.join("\n") };
    };
    const hit = run(["mental", "emotion"]);
    assert.ok(hit.hurt > 0, hit.log);
    assert.equal(run(["auditory"]).hurt, 0, "not without the trait");
    const reacted = run(["mental"], true);
    assert.ok(reacted.hurt > 0 && /reacts with Otherworldly Mind/.test(reacted.log), reacted.log);
});

test("reactions to its own Strike, to being attacked, to a turn starting near it, and at initiative (2026-10-10, B47)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const willSave = (name, trigger, targeting, effects = [{ kind: "condition", slug: "frightened", value: 1 }]) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: trigger.free ? "free" : "reaction", traits: [] }, targeting, trigger: { event: "use", reaction: true, ...trigger },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects }, criticalFailure: { damage: { ...none }, effects } } }
    });
    const [fighter] = martialParty(5);
    const setup = (plan) => {
        const monster = { ...moderateCreature(5, "mon", "Monster"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry(plan.source.name, plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monster] }, {}, 4);
        state.log = [];
        return { state, f: state.byId.get("fighter"), m: state.byId.get("mon") };
    };
    // Its own critical hit with the named Strike, on the creature it hit.
    const eyes = willSave("Go For the Eyes", { event: "own-strike", on: ["criticalSuccess"], strike: "beak" }, { target: "the creature the Strike hits", range: "touch", area: null });
    let { state, f, m } = setup(eyes);
    performStrike(state, m, f, { ...m.strikes[0], name: "Beak", bonus: 200 });
    assert.ok(f.cond.frightened >= 1 && m.reactionUsed, state.log.join("\n"));
    ({ state, f, m } = setup(eyes));
    performStrike(state, m, f, { ...m.strikes[0], name: "Claw", bonus: 200 });
    assert.ok(!f.cond.frightened, "not another Strike");
    // A melee Strike at it: before the roll, on the attacker; one that paralyzes stops the Strike.
    const tattoos = willSave("Hypnotic Tattoos", { event: "attacked", melee: true }, { target: "the attacker", range: "touch", area: null }, [{ kind: "condition", slug: "paralyzed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }]);
    ({ state, f, m } = setup(tattoos));
    assert.equal(performStrike(state, f, m, { ...f.strikes[0], melee: true, bonus: 200 }), null, state.log.join("\n"));
    assert.ok(f.cond.paralyzed && m.hp.value === 999);
    ({ state, f, m } = setup(tattoos));
    assert.notEqual(performStrike(state, f, m, { ...f.strikes[0], melee: false, bonus: 200 }), null, "not a ranged Strike");
    // A creature starting its turn within 30 feet.
    const glance = willSave("Petrifying Glance", { event: "turn-start", within: 30 }, { target: "the attacker", range: "30 feet", area: null }, [{ kind: "condition", slug: "slowed", value: 1, duration: { mode: "fixed", value: 10, unit: "rounds" } }]);
    const glanced = simulate({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "mon", "Basilisk"), engagement: 1, spells: [entry("Petrifying Glance", glance)] }] }, { maxRounds: 1 }, 4, { log: true });
    assert.match(glanced.log.join("\n"), /Basilisk reacts with Petrifying Glance/);
    // Rolling initiative, a free action on the creatures around it.
    const cry = willSave("Chilling Cry", { event: "initiative", free: true }, { target: null, range: null, area: { type: "emanation", value: 20 } });
    const cried = simulate({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "mon", "Losko"), engagement: 1, spells: [entry("Chilling Cry", cry)] }] }, { maxRounds: 1 }, 4, { log: true });
    assert.match(cried.log.join("\n"), /Losko uses Chilling Cry/);
});

test("passives that answer its own critical hit, damage on it, or a hit of some damage types (2026-10-10, B48)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const fortSave = (name, trigger, targeting, effects) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: "passive", traits: [] }, targeting, trigger: { event: "passive", ...trigger },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects }, criticalFailure: { damage: { ...none }, effects } } }
    });
    const [fighter] = martialParty(5);
    const setup = (plan) => {
        const monster = { ...moderateCreature(5, "mon", "Monster"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry(plan.source.name, plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monster] }, {}, 4);
        state.log = [];
        return { state, f: state.byId.get("fighter"), m: state.byId.get("mon") };
    };
    // Firearms Critical Specialization: its own critical hit with a firearm.
    const spec = fortSave("Firearms Critical Specialization", { event: "own-strike", on: ["criticalSuccess"], weapon: "firearm" }, { target: "the creature the Strike hits", range: "touch", area: null }, [{ kind: "condition", slug: "stunned", value: 1 }]);
    let { state, f, m } = setup(spec);
    performStrike(state, m, f, { ...m.strikes[0], name: "Pistol", firearm: true, bonus: 200 });
    assert.ok(f.cond.stunned >= 1, state.log.join("\n"));
    ({ state, f, m } = setup(spec));
    performStrike(state, m, f, { ...m.strikes[0], name: "Club", bonus: 200 });
    assert.ok(!f.cond.stunned, "not another weapon");
    // Spewing Bile: slashing damage on it, on the creatures adjacent.
    const bile = fortSave("Spewing Bile", { event: "damaged", damageTypes: ["slashing"] }, { target: null, range: null, area: { type: "emanation", value: 5 } }, [{ kind: "condition", slug: "sickened", value: 1 }]);
    ({ state, f, m } = setup(bile));
    applyDamage(state, m, [{ type: "slashing", amount: 5 }], { source: f });
    assert.ok(f.cond.sickened >= 1, state.log.join("\n"));
    ({ state, f, m } = setup(bile));
    applyDamage(state, m, [{ type: "fire", amount: 5 }], { source: f });
    assert.ok(!f.cond.sickened, "not fire");
    // Shimmering Armor: a critical hit of physical damage, on the creatures around it.
    const armor = fortSave("Shimmering Armor", { event: "hit-by", melee: false, critical: true, damageTypes: ["physical"] }, { target: null, range: null, area: { type: "emanation", value: 10 } }, [{ kind: "condition", slug: "sickened", value: 1 }]);
    ({ state, f, m } = setup(armor));
    performStrike(state, f, m, { ...f.strikes[0], bonus: 200 });
    assert.ok(f.cond.sickened >= 1, state.log.join("\n"));
    ({ state, f, m } = setup(armor));
    state.rng.d20 = dice(10);
    const plain = performStrike(state, f, m, { ...f.strikes[0], bonus: m.ac - 10 });
    assert.equal(plain.degree, 2, "a plain hit");
    assert.ok(!f.cond.sickened, "only on a critical hit");
});

test("a passive on a creature it holds as a turn starts or ends (2026-10-10, B49)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const grasp = (trigger) => ({
        modelVersion: 13, source: { name: "Mind-Numbing Grasp" }, rank: 1, traits: [], activation: { time: "passive", traits: [] }, targeting: { target: "the held creature", range: "touch", area: null },
        trigger: { event: "grab-turn", ...trigger },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stupefied", value: 2 }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stupefied", value: 2 }] } } }
    });
    const [fighter] = martialParty(5);
    const run = (trigger, grabbed, at) => {
        const monster = { ...moderateCreature(5, "mon", "Baatamidar"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Mind-Numbing Grasp", grasp(trigger))] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monster] }, {}, 4);
        state.log = [];
        const f = state.byId.get("fighter");
        if (grabbed) {
            f.cond.grabbed = true;
            f.grabbedBy = "mon";
        }
        grabTurnAnswers(state, at === "own" ? state.byId.get("mon") : f, "start");
        return f.cond.stupefied ?? 0;
    };
    assert.equal(run({ at: "start", whose: "held", hold: "grabbed" }, true, "held"), 2, "its turn starting grabbed");
    assert.equal(run({ at: "start", whose: "held", hold: "grabbed" }, false, "held"), 0, "not when free");
    assert.equal(run({ at: "start", whose: "own", hold: "grabbed" }, true, "own"), 2, "the monster's turn: each creature it holds");
    assert.equal(run({ at: "end", whose: "held", hold: "grabbed" }, true, "held"), 0, "not at the other end of the turn");
});

test("a condition the monster always has: the zombie's Slow (2026-10-10, B50)", () => {
    const [fighter] = martialParty(3);
    const zombie = withBuiltins({ ...moderateCreature(3, "zom", "Zombie"), engagement: 1 }, ["Slow", { builtin: "permanent-condition", conditions: [{ slug: "slowed", value: 1 }], noReactions: true }, "Reactive Strike", { builtin: "reactive-strike" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, zombie] }, {}, 1);
    const z = state.byId.get("zom");
    assert.equal(z.cond.slowed, 1, "slowed from the start");
    assert.equal(z.noReactions, true);
    const result = simulate({ combatants: [{ ...fighter, engagement: 1 }, zombie] }, { maxRounds: 2 }, 3, { log: true });
    const turns = result.log.join("\n").split(/\n(?=\S)/).filter((block) => block.startsWith("Zombie ("));
    assert.ok(turns.length > 0);
    for (const block of turns) assert.ok(block.split("\n").slice(1).filter((line) => /^\s{2}Zombie /.test(line) && !/Zombie: /.test(line)).length <= 2, block);
});

test("casting a manipulate spell in a Melee provokes (S12), and reactions to acting near the monster (2026-10-10, B51)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const willSave = (name, trigger, traits = [], effects = [{ kind: "condition", slug: "immobilized", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }]) => ({
        modelVersion: 13, source: { name }, rank: 1, traits, activation: { time: trigger ? "reaction" : "2", traits }, targeting: { target: trigger ? "the attacker" : "1 creature", range: trigger ? "touch" : "30 feet", area: null },
        ...(trigger ? { trigger: { event: "provoke", reaction: true, ...trigger } } : {}),
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects }, criticalFailure: { damage: { ...none }, effects } } }
    });
    const [fighter] = martialParty(5);
    // The monster casts a manipulate spell next to the fighter (Reactive Strike).
    const caster = { ...moderateCreature(5, "mon", "Mage"), engagement: 1, spells: [entry("Hold Person", willSave("Hold Person", null, ["concentrate", "manipulate"]))] };
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, aoo: true, reactions: { aoo: true } }, caster] }, {}, 2);
    state.log = [];
    performAction(state, state.byId.get("mon"), { type: "cast", spellIndex: 0, targetIds: ["fighter"], actions: 2 });
    assert.match(state.log.join("\n"), /Fighter Attack of Opportunity/, state.log.join("\n"));
    // Leaving its reach: Ectoplasmic Filaments on the creature leaving.
    const filaments = willSave("Ectoplasmic Filaments", { triggers: ["manipulate", "move", "leave"], within: "reach" });
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "mon", "Razorbones"), engagement: 1, spells: [entry("Ectoplasmic Filaments", filaments)] }] }, {}, 2);
    state.log = [];
    const f = state.byId.get("fighter");
    provokeFor(state, f, "move");
    assert.ok(f.cond.immobilized && state.byId.get("mon").reactionUsed, state.log.join("\n"));
    // A concentrate action within 30 feet, and not Reactive Strike for it.
    const spit = willSave("Brine Spit", { triggers: ["concentrate"], within: 30 });
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [{ ...entry("Demoralize", willSave("Demoralize", null, ["concentrate", "mental"])), kind: "basic" }] }, { ...moderateCreature(5, "mon", "Dragon"), engagement: 1, reactions: { aoo: true }, spells: [entry("Brine Spit", spit)] }] }, {}, 2);
    state.log = [];
    performAction(state, state.byId.get("fighter"), { type: "cast", spellIndex: 0, targetIds: ["mon"], actions: 1 });
    const text = state.log.join("\n");
    assert.match(text, /Dragon reacts with Brine Spit/, text);
    assert.doesNotMatch(text, /Attack of Opportunity/);
});

test("a monster healing itself (2026-10-10, B52)", () => {
    const heal = {
        modelVersion: 13, source: { name: "Abyssal Healing" }, rank: 1, traits: [], activation: { time: "1", traits: [] },
        targeting: { target: "self", range: null, area: null }, trigger: { event: "use" },
        resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "6d6", kinds: ["healing"] }], recipients: "any" } } }
    };
    const [fighter] = martialParty(3);
    const quasit = { ...moderateCreature(3, "qua", "Quasit"), engagement: 1, spells: [entry("Abyssal Healing", heal)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, quasit] }, {}, 2);
    state.log = [];
    const q = state.byId.get("qua");
    q.hp.value = Math.floor(q.hp.max / 4);
    const before = q.hp.value;
    castSpell(state, q, 0, [q.id]);
    assert.ok(q.hp.value > before, state.log.join("\n"));
    // The planner reaches for it when hurt.
    const result = simulate({ combatants: [{ ...fighter, engagement: 1 }, { ...quasit, hp: { value: 5, max: quasit.hp.max } }] }, { maxRounds: 2 }, 2, { log: true });
    assert.match(result.log.join("\n"), /Quasit casts Abyssal Healing/);
});

test("a condition the monster gives itself: Invisible, Concealed, Quickened (2026-10-10, B53)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const selfCondition = (name, slug, duration = null, trigger = { event: "use" }, time = "1") => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time, traits: [] }, targeting: { target: "self", range: null, area: null }, trigger,
        resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug, value: null, duration }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } }
    });
    const [fighter] = martialParty(3);
    // Go Dark: invisible, played as hidden (a DC 11 flat check to target it); the planner reaches for it.
    const wisp = { ...moderateCreature(3, "wisp", "Wisp"), engagement: 1, spells: [entry("Go Dark", selfCondition("Go Dark", "invisible"))] };
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, wisp] }, {}, 2);
    castSpell(state, state.byId.get("wisp"), 0, ["wisp"]);
    assert.equal(state.byId.get("wisp").cond.hidden, true);
    const played = simulate({ combatants: [{ ...fighter, engagement: 1 }, wisp] }, { maxRounds: 1 }, 2, { log: true });
    assert.match(played.log.join("\n"), /Wisp casts Go Dark/);
    // Shrieking Frenzy: as its turn begins, quickened for this turn: four actions.
    const frenzy = selfCondition("Shrieking Frenzy", "quickened", { mode: "fixed", value: 0, unit: "rounds", expiry: "turn-end", anchor: "source-turn" }, { event: "own-turn-start", reaction: true, free: true }, "free");
    const result = simulate({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(3, "cha", "Charau-ka"), engagement: 1, spells: [entry("Shrieking Frenzy", frenzy)] }] }, { maxRounds: 1 }, 2, { log: true });
    const turn = result.log.join("\n").split(/\n(?=\S)/).find((block) => block.startsWith("Charau-ka ("));
    assert.match(turn, /Charau-ka uses Shrieking Frenzy/);
    const strikes = turn.split("\n").filter((line) => /^\s{2}Charau-ka \S.* → /.test(line)).length;
    assert.ok(strikes >= 1, turn);
});

test("a command that quickens its allies goes to its allies only (2026-10-10, B53)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const command = {
        modelVersion: 13, source: { name: "Royal Command" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "allies", range: null, area: null, allies: true }, trigger: { event: "use" },
        resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug: "quickened", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } }
    };
    const [fighter] = martialParty(5);
    const king = { ...moderateCreature(5, "king", "King"), engagement: 1, spells: [entry("Royal Command", command)] };
    const guard = { ...moderateCreature(5, "guard", "Guard"), engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, king, guard] }, {}, 2);
    const k = state.byId.get("king");
    const sets = targetSetsFor(state, k, k.spells[0], { enemies: [state.byId.get("fighter")], allies: [k, state.byId.get("guard")], inMelee: () => true, distance: () => 5 });
    assert.deepEqual(sets.map((set) => set.targets.map((t) => t.id)), [["guard"]]);
    castSpell(state, k, 0, ["guard"]);
    assert.equal(state.byId.get("guard").cond.quickened, true);
    assert.ok(!state.byId.get("fighter").cond.quickened);
});

test("a Strike activity's extra dice of the Strike's own type, its push on a critical hit, and damage with a save (2026-10-10, B54)", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "horse", "Horse");
    const horse = withBuiltins({ ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Hoof", bonus: 40, damage: [{ dice: 1, die: 6, bonus: 0, multiplier: 1, type: "bludgeoning", persistent: false, precision: false }] }] },
        ["Rearing Kick", { builtin: "strike-activity", actions: 2, strides: 0, strike: "hoof", attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: 5, criticalPush: 10, damage: ["2d8[strike]"], save: null, size: null } }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 }, resistances: [{ type: "bludgeoning", value: 3, exceptions: [] }] }, horse] }, {}, 1, { log: true });
    const c = state.byId.get("horse");
    const pc = state.byId.get("fighter");
    // "2d8[strike]": bludgeoning, so the fighter's resistance counts.
    applyStrikeRider(state, c, pc, c.strikeActivities[0], false, c.strikes[0]);
    assert.ok(state.log.some((line) => /Fighter takes \d+ more bludgeoning/.test(line)), state.log.join("\n"));
    assert.ok(state.log.some((line) => /pushed out of the melee/.test(line)));
    // A save after the extra damage (Shock Mind): both.
    const shock = { ...c.strikeActivities[0], onHit: { conditions: [], critical: null, push: null, damage: ["2d6[mental]"], save: null, size: null }, riderSpell: { name: "Shock Mind", plan: { modelVersion: 13, source: { name: "Shock Mind" }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null }, trigger: { event: "strike-activity" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 99 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "confused", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "confused", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }] } } } }, castRank: 1, pool: null, kind: "ability" } };
    const before = pc.hp.value;
    applyStrikeRider(state, c, pc, shock, false, c.strikes[0]);
    assert.ok(pc.hp.value < before);
    assert.equal(pc.cond.confused, true);
});

test("Steady Spellcasting, Golem Antimagic, and healing as it dies for creatures of a kind (2026-10-10, B55–B57)", async () => {
    const { spellExpectation } = await import("../src/engine/spells.js");
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const blast = (name, type, traits = [], area = null) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: ["concentrate", "manipulate", type, ...traits], activation: { time: "2", traits: ["concentrate", "manipulate"] }, targeting: { target: area ? null : "1 creature", range: "30 feet", area },
        resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 10 } }, sharedDamage: { components: [{ id: "0", formula: `4d6[${type}]`, kinds: [type] }] }, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } } }
    });
    const [fighter] = martialParty(5);
    // B55: Reactive Strike's critical hit disrupts a spell; Steady Spellcasting's flat check keeps it (DC 1: always).
    const hitter = { ...fighter, engagement: 1, aoo: true, reactions: { aoo: true }, strikes: fighter.strikes.map((strike) => ({ ...strike, bonus: 100 })), hp: { value: 999, max: 999 } };
    const caster = (steady) => ({ ...moderateCreature(5, "mon", "Mage"), engagement: 1, hp: { value: 999, max: 999 }, ...(steady ? { steadySpellcasting: 1 } : {}), spells: [entry("Spark", blast("Spark", "fire"), "spell")] });
    let disrupted = 0;
    let kept = 0;
    for (let seed = 1; seed <= 4; seed++) {
        for (const steady of [false, true]) {
            const state = createFightState({ combatants: [hitter, caster(steady)] }, {}, seed);
            state.log = [];
            performAction(state, state.byId.get("mon"), { type: "cast", spellIndex: 0, targetIds: ["fighter"], actions: 2 });
            const text = state.log.join("\n");
            if (!steady && /Spark is disrupted/.test(text)) disrupted++;
            if (steady && /keeps casting \(Steady Spellcasting\)/.test(text)) kept++;
            if (steady) assert.doesNotMatch(text, /Spark is disrupted/);
        }
    }
    assert.ok(disrupted > 0 && kept > 0, `disrupted ${disrupted}, kept ${kept}`);
    // B56: a golem harmed by fire, slowed by cold, healed by electricity, immune to the rest.
    const golem = { ...moderateCreature(5, "golem", "Golem"), engagement: 1, hp: { value: 100, max: 200 }, golemAntimagic: { harmed: { by: ["fire"], damage: "5d8", area: "2d6" }, healed: { by: ["electricity"], area: "2d4" }, slowed: { by: ["cold"] } } };
    const wizard = { ...fighter, id: "wiz", name: "Wizard", engagement: 1, spells: ["fire", "cold", "electricity", "acid"].map((type) => entry(`${type} bolt`, blast(`${type} bolt`, type), "spell")) };
    const state = createFightState({ combatants: [wizard, golem] }, {}, 3, { log: true });
    state.log = [];
    const g = state.byId.get("golem");
    const w = state.byId.get("wiz");
    castSpell(state, w, 0, ["golem"]);
    assert.match(state.log.join("\n"), /Golem is harmed by fire bolt: \d+ damage \(Golem Antimagic\)/, state.log.join("\n"));
    assert.ok(g.hp.value < 100 && g.hp.value >= 60);
    castSpell(state, w, 1, ["golem"]);
    assert.equal(g.cond.slowed, 1);
    const before = g.hp.value;
    castSpell(state, w, 2, ["golem"]);
    assert.equal(g.cond.slowed, 0);
    assert.ok(g.hp.value > before);
    const hp = g.hp.value;
    castSpell(state, w, 3, ["golem"]);
    assert.equal(g.hp.value, hp);
    assert.match(state.log.join("\n"), /Golem is immune to acid bolt/);
    // The planner: an acid bolt is worth nothing to it, a fire bolt the harm's 5d8.
    assert.equal(spellExpectation(state, w, w.spells[3], [g])[0].damage, 0);
    assert.ok(Math.abs(spellExpectation(state, w, w.spells[0], [g])[0].damage - 22.5) < 3);
    // B57: Verdant Burst heals only the plant creatures around it as it dies.
    const burst = {
        modelVersion: 13, source: { name: "Verdant Burst" }, rank: 1, traits: [], activation: { time: "passive", traits: [] },
        targeting: { target: null, range: null, area: { type: "emanation", value: 30 }, traits: { any: ["plant"] } }, trigger: { event: "death" },
        resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "10", kinds: ["healing"] }], recipients: "any" } } }
    };
    const leshy = { ...moderateCreature(3, "leshy", "Leshy"), engagement: 1, traits: ["plant", "leshy"], spells: [entry("Verdant Burst", burst)] };
    const sapling = { ...moderateCreature(3, "sap", "Sapling"), engagement: 1, traits: ["plant"], hp: { value: 5, max: 40 } };
    const wolf = { ...moderateCreature(3, "wolf", "Wolf"), engagement: 1, traits: ["animal"], hp: { value: 5, max: 40 } };
    const field = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 5, max: 80 } }, leshy, sapling, wolf] }, {}, 1);
    deathThroes(field, field.byId.get("leshy"), new Set(["fighter", "sap", "wolf"]));
    assert.deepEqual([field.byId.get("sap").hp.value, field.byId.get("wolf").hp.value, field.byId.get("fighter").hp.value], [15, 5, 5]);
});

test("riders: a critical hit's only on a critical hit, one naming its Strike; natural invisibility (2026-10-10, B58)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const rider = (name, trigger) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null },
        trigger: { event: "strike", cost: "free", map: false, ...trigger },
        resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug: "stunned", value: 1, duration: null }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } }
    });
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "stag", "Stag");
    const stag = { ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Antler", attackEffects: ["brutal-gore"] }], spells: [entry("Brutal Gore", rider("Brutal Gore", { on: ["criticalSuccess"], attackEffect: "brutal-gore" })), entry("Test Named", rider("Test Named", { on: ["success", "criticalSuccess"], strikes: ["hoof"] }))] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, stag] }, {}, 1);
    const c = state.byId.get("stag");
    const pc = state.byId.get("fighter");
    triggerRiders(state, c, pc, c.strikes[0], 2);
    assert.ok(!pc.cond.stunned, "not on a plain hit");
    triggerRiders(state, c, pc, c.strikes[0], 3);
    assert.equal(pc.cond.stunned, 1, "on a critical hit");
    pc.cond.stunned = 0;
    triggerRiders(state, c, pc, { ...c.strikes[0], name: "Hoof", attackEffects: [] }, 2);
    assert.equal(pc.cond.stunned, 1, "the Strike it names");
    // Naturally invisible: hidden to attackers from the start.
    const spirit = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "spirit", "Spirit"), engagement: 1, permanent: [{ slug: "invisible", value: null }] }] }, {}, 1);
    assert.equal(spirit.byId.get("spirit").cond.hidden, true);
});

test("Collapse makes a critical hit a hit and leaves it collapsed until it re-forms; Wished Away resists a critical hit (2026-10-10, B59, B60)", () => {
    const [fighter] = martialParty(5);
    const hitter = { ...fighter, engagement: 1, strikes: fighter.strikes.map((strike) => ({ ...strike, bonus: 100 })) };
    // B59: Collapse.
    const skeleton = { ...moderateCreature(5, "skel", "Skeleton"), engagement: 1, hp: { value: 999, max: 999 }, critDowngrade: { name: "Collapse", dc: null, collapse: true } };
    let state = createFightState({ combatants: [hitter, skeleton] }, {}, 2);
    state.log = [];
    const s = state.byId.get("skel");
    let result = null;
    for (let i = 0; i < 5 && !(result?.degree === 2 && /Collapse: a normal hit/.test(state.log.join("\n"))); i++) {
        s.reactionUsed = false;
        result = performStrike(state, state.byId.get("fighter"), s, state.byId.get("fighter").strikes[0]);
    }
    assert.match(state.log.join("\n"), /Skeleton uses Collapse: a normal hit/, state.log.join("\n"));
    assert.deepEqual([s.cond.immobilized, s.cond.offGuard, s.collapsed], [true, true, true]);
    // B60: Wished Away, resistance 20 against the critical hit.
    const dragon = { ...moderateCreature(5, "drag", "Dragon"), engagement: 1, hp: { value: 999, max: 999 }, critResistance: { name: "Wished Away", value: 20 } };
    state = createFightState({ combatants: [hitter, dragon] }, {}, 2);
    state.log = [];
    const d = state.byId.get("drag");
    for (let i = 0; i < 5 && !/Wished Away/.test(state.log.join("\n")); i++) performStrike(state, state.byId.get("fighter"), d, state.byId.get("fighter").strikes[0]);
    const text = state.log.join("\n");
    assert.match(text, /Dragon uses Wished Away: resistance 20 against the attack/, text);
    // (20 less than the critical hit's most.)
    const part = state.byId.get("fighter").strikes[0].damage[0];
    assert.ok(Number(/Wished Away[^\n]*\n[^\n]*critically hits for (\d+)/.exec(text)?.[1]) <= 2 * (part.dice * part.die + part.bonus) - 20, text);
    assert.equal(d.resistances?.some((entry) => entry.type === "all-damage") ?? false, false, "only for that attack");
});

test("temporary Hit Points; multi-Strikes: no second -2 for a monster, each at its penalty, Clumsy after, only at a creature it holds (2026-10-10, B61, B62)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (effects = []) => ({ damage: { ...none }, effects });
    // B61: temporary Hit Points on itself, the higher of its current and these.
    const fed = { modelVersion: 13, source: { name: "Fed by Water" }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "self", range: null, area: null }, trigger: { event: "use" }, resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row([{ kind: "temp-hp", amount: 40, duration: { mode: "fixed", value: 1, unit: "minutes", expiry: null, anchor: "effect-start" } }]), failure: row(), criticalFailure: row() } } };
    const [fighter] = martialParty(5);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "drag", "Dragon"), engagement: 1, spells: [entry("Fed by Water", fed)] }] }, {}, 1);
    const d = state.byId.get("drag");
    castSpell(state, d, 0, ["drag"]);
    assert.equal(d.hp.temp, 40);
    d.hp.temp = 50;
    castSpell(state, d, 0, ["drag"]);
    assert.equal(d.hp.temp, 50, "they don't stack");
    // B62: a monster's multi-Strike that doesn't raise the penalty: no -2 on the second; Frenzied Slashes' -2 on each, Clumsy 2 after.
    const base = moderateCreature(5, "imp", "Imp");
    const claw = { ...base.strikes[0], name: "Claw", bonus: 10, agile: false };
    const imp = withBuiltins({ ...base, engagement: 1, strikes: [claw] }, ["Frenzied Slashes", { builtin: "multi-strike", actions: 3, strikes: ["claw", "claw", "claw"], sameMap: true, sameTarget: true, penalty: 2, after: [{ slug: "clumsy", value: 2, until: "own-turn-start" }] }], ["Draconic Frenzy", { builtin: "multi-strike", actions: 2, strikes: ["claw", "claw"], sameMap: true }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, imp] }, {}, 1);
    state.log = [];
    const c = state.byId.get("imp");
    performAction(state, c, { type: "multiStrike", ability: 1, targetId: "fighter", actions: 2 });
    const bonuses = state.log.filter((line) => /Imp Claw → Fighter/.test(line)).map((line) => Number(/: (\d+) vs AC/.exec(line)?.[1]) - 0);
    assert.equal(bonuses.length, 2, state.log.join("\n"));
    state.log = [];
    performAction(state, c, { type: "multiStrike", ability: 0, targetId: "fighter", actions: 3 });
    assert.equal(c.cond.clumsy, 2, state.log.join("\n"));
    // Maul: only at a creature it holds.
    const cat = withBuiltins({ ...moderateCreature(5, "cat", "Cat"), engagement: 1, strikes: [claw] }, ["Maul", { builtin: "multi-strike", actions: 1, strikes: ["claw", "claw"], sameMap: true, sameTarget: true, requires: "grabbed" }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, cat] }, {}, 1);
    const k = state.byId.get("cat");
    k.actionsLeft = 1;
    assert.equal(scoreOptions(state, k).options.some((option) => option.action.type === "multiStrike"), false, "not at a creature it doesn't hold");
    const pc = state.byId.get("fighter");
    pc.cond.grabbed = true;
    pc.grabbedBy = "cat";
    assert.equal(scoreOptions(state, k).options.some((option) => option.action.type === "multiStrike" && option.action.targetId === "fighter"), true);
});

test("Blood Drain: damage on the creature it holds, temporary Hit Points equal to it; a heal's excess as temporary Hit Points (2026-10-10, B63)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (effects = [], damage = { ...none }) => ({ damage, effects });
    const drain = { modelVersion: 13, source: { name: "Blood Drain" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "the creature it holds", range: "touch", area: null, grabbed: true }, trigger: { event: "use" }, resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row([{ kind: "condition", slug: "drained", value: 1, duration: null }, { kind: "temp-hp", fromDamage: true, recipient: "self" }, { kind: "heal", amount: 50, excessAsTemp: true, recipient: "self" }], { mode: "formulas", formulas: [{ formula: "4d6[untyped]" }], rollScope: "outcome" }), failure: row(), criticalFailure: row() } } };
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, { ...moderateCreature(5, "leech", "Leech"), engagement: 1, spells: [entry("Blood Drain", drain)] }] }, {}, 1);
    const leech = state.byId.get("leech");
    const pc = state.byId.get("fighter");
    leech.hp.value = leech.hp.max - 10;
    castSpell(state, leech, 0, ["fighter"]);
    const dealt = 999 - pc.hp.value;
    assert.ok(dealt >= 4 && dealt <= 24);
    assert.equal(pc.cond.drained, 1);
    // Back to full (10 of the 50), the other 40 as temporary Hit Points, more than the drain's.
    assert.deepEqual([leech.hp.value, leech.hp.temp], [leech.hp.max, 40]);
});

test("a rage on itself: its effect's damage, AC and temporary Hit Points; a frenzy only once hurt (2026-10-10, B64)", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "brute", "Brute");
    const brute = withBuiltins({ ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Club", melee: true }] },
        ["Rage", { builtin: "self-effect", actions: 1, model: { name: "Rage", rounds: 10, modifiers: [{ on: "damage", type: "untyped", value: 2 }, { on: "ac", type: "untyped", value: -1 }], tempHp: 6 }, extraDice: "1d4[electricity]", noConcentrate: true }],
        ["Fanatical Frenzy", { builtin: "self-effect", actions: 1, model: { name: "Fanatical Frenzy", rounds: 10, modifiers: [{ on: "attack", type: "status", value: 1 }], tempHp: 0 }, whenHurt: true }]);
    assert.deepEqual(brute.selfEffects[0].model.strikeDeltas, { Club: [{ dice: 1, die: 4, bonus: 0, multiplier: 1, type: "electricity", precision: false, persistent: false }] });
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, brute] }, {}, 1);
    const c = state.byId.get("brute");
    c.actionsLeft = 3;
    const options = scoreOptions(state, c).options.filter((option) => option.action.type === "selfEffect");
    assert.deepEqual(options.map((option) => option.action.index), [0], "the frenzy waits until it's hurt");
    performAction(state, c, { type: "selfEffect", index: 0, actions: 1 });
    assert.equal(c.hp.temp, 6);
    assert.ok((c.effects ?? []).some((effect) => effect.key === "self:Rage"));
    c.hp.value -= 5;
    assert.ok(scoreOptions(state, c).options.some((option) => option.action.type === "selfEffect" && option.action.index === 1));
});

test("triggered rages: Blood Frenzy on bleed it deals, Vengeful Rage at its HP threshold with its reaction (2026-10-10, B65)", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "shark", "Shark");
    const bleeding = { ...base.strikes[0], name: "Jaws", bonus: 100, damage: [...base.strikes[0].damage, { dice: 1, die: 6, bonus: 0, multiplier: 1, type: "bleed", persistent: true, precision: false }] };
    const shark = withBuiltins({ ...base, engagement: 1, strikes: [bleeding] }, ["Blood Frenzy", { builtin: "self-effect", actions: 0, model: { name: "Blood Frenzy", rounds: 10, modifiers: [{ on: "damage", type: "status", value: 4 }], tempHp: 8 }, trigger: { kind: "deals-bleed" } }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999 } }, shark] }, {}, 1);
    state.log = [];
    const s = state.byId.get("shark");
    assert.equal(scoreOptions(state, s).options.some((option) => option.action.type === "selfEffect"), false, "not an action");
    performStrike(state, s, state.byId.get("fighter"), s.strikes[0]);
    assert.ok((s.effects ?? []).some((effect) => effect.key === "self:Blood Frenzy"), state.log.join("\n"));
    assert.equal(s.hp.temp, 8);
    // Vengeful Rage: damage that leaves it at 100 HP or fewer, as its reaction.
    const chief = withBuiltins({ ...moderateCreature(5, "chief", "Chief"), engagement: 1, hp: { value: 110, max: 150 } }, ["Vengeful Rage", { builtin: "self-effect", actions: 0, model: { name: "Vengeful Rage", rounds: 10, modifiers: [{ on: "attack", type: "status", value: 1 }], tempHp: 0 }, trigger: { kind: "hp-at-most", value: 100, reaction: true } }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, chief] }, {}, 1);
    const c = state.byId.get("chief");
    applyDamage(state, c, [{ type: "slashing", amount: 5, persistent: false, precision: false }], { source: state.byId.get("fighter") });
    assert.ok(!(c.effects ?? []).length, "still above 100");
    applyDamage(state, c, [{ type: "slashing", amount: 10, persistent: false, precision: false }], { source: state.byId.get("fighter") });
    assert.deepEqual([(c.effects ?? []).some((effect) => effect.key === "self:Vengeful Rage"), c.reactionUsed], [true, true]);
});

test("a rider by its Strike's degree: the critical hit's own row (2026-10-10, B66)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (value) => ({ damage: { ...none }, effects: [{ kind: "condition", slug: "enfeebled", value, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }] });
    const weakening = { modelVersion: 13, source: { name: "Weakening Strike" }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null }, trigger: { event: "strike", on: ["success", "criticalSuccess"], attackEffect: "weakening-strike", cost: "free", map: false }, resolution: { kind: "check", check: { roll: "skill", statistic: "strike", against: { dc: "target", statistic: "ac" } }, sharedDamage: null, outcomes: { criticalSuccess: row(2), success: row(1), failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "lizard", "Lizard");
    const lizard = { ...base, engagement: 1, strikes: [{ ...base.strikes[0], name: "Jaws", attackEffects: ["weakening-strike"] }], spells: [entry("Weakening Strike", weakening)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, lizard] }, {}, 1);
    const c = state.byId.get("lizard");
    const pc = state.byId.get("fighter");
    triggerRiders(state, c, pc, c.strikes[0], 2);
    assert.equal(pc.cond.enfeebled, 1);
    pc.cond.enfeebled = 0;
    triggerRiders(state, c, pc, c.strikes[0], 3);
    assert.equal(pc.cond.enfeebled, 2);
});

test("a skill action after a Strike activity's hit: its own basic action (2026-10-10, B67)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const demoralize = { modelVersion: 13, source: { name: "Demoralize", slug: "demoralize" }, rank: 1, traits: ["mental", "emotion"], activation: { time: "1", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, resolution: { kind: "check", check: { roll: "skill", statistic: "intimidation", against: { dc: "target", statistic: "will" } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "skel", "Skeleton");
    const skeleton = { ...base, engagement: 1, skills: { ...(base.skills ?? {}), intimidation: 100 }, spells: [{ ...entry("Demoralize", demoralize), kind: "basic" }] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, skeleton] }, {}, 1);
    const c = state.byId.get("skel");
    const pc = state.byId.get("fighter");
    applyStrikeRider(state, c, pc, { onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, follow: "demoralize" } }, false, c.strikes[0]);
    assert.ok(pc.cond.frightened >= 1);
});

test("follow-ups: by the Strike's degree, after a Strike listing a rider, a second Strike only straight after its Strike (2026-10-10, B68)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (value) => ({ damage: { ...none }, effects: value ? [{ kind: "condition", slug: "enfeebled", value, duration: null }] : [] });
    const plan = { modelVersion: 13, source: { name: "Test Shadow Tug" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null },
        trigger: { event: "use", followUp: { strike: "hand", melee: false, on: ["success", "criticalSuccess"] } },
        resolution: { kind: "check", check: { roll: "skill", statistic: "strike", against: { dc: "target", statistic: "ac" } }, sharedDamage: null, outcomes: { criticalSuccess: row(2), success: row(1), failure: row(0), criticalFailure: row(0) } } };
    const shade = { ...moderateCreature(5, "shade", "Shade"), engagement: 1, spells: [{ name: "Test Shadow Tug", plan, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    shade.strikes = [{ ...shade.strikes[0], name: "Hand" }];
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, shade] }, {}, 1);
    const s = state.byId.get("shade");
    const pc = state.byId.get("fighter");
    s.round = 1;
    s.actionsLeft = 2;
    // A critical hit: the critical hit's row.
    triggerRiders(state, s, pc, s.strikes[0], 3);
    assert.equal(s.riderReady.degree, 3);
    const option = scoreOptions(state, s).options.find((entry) => entry.action.type === "cast");
    assert.ok(option, "on offer straight after the hit");
    performAction(state, s, option.action);
    assert.equal(pc.cond.enfeebled, 2);
    // "a success with a Strike that lists Push in its damage entry": only after such a Strike.
    s.spells[0].plan = { ...plan, trigger: { event: "use", followUp: { strike: null, melee: false, on: ["success", "criticalSuccess"], listing: "push" } } };
    s.riderReady = null;
    triggerRiders(state, s, pc, { ...s.strikes[0], attackEffects: [] }, 2);
    assert.equal(s.riderReady, null, "not after a Strike without it");
    triggerRiders(state, s, pc, { ...s.strikes[0], attackEffects: ["improved-push"] }, 2);
    assert.equal(s.riderReady?.index, 0);
});

test("a follow-up's Strike after a miss, at that Strike's penalty (2026-10-10, B68)", () => {
    const thrall = { ...moderateCreature(5, "thrall", "Thrall"), engagement: 1 };
    thrall.strikes = [{ ...thrall.strikes[0], name: "Club" }];
    assert.equal(addBuiltin(thrall, { builtin: "strike-activity", actions: 1, strides: 0, strike: "club", attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, previousMap: true, after: { strike: "club", melee: false, on: ["failure", "criticalFailure"] }, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }, "Swing Back"), true);
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, thrall] }, {}, 1);
    const t = state.byId.get("thrall");
    t.round = 1;
    t.actionsLeft = 2;
    t.actionCount = 1;
    t.attacksThisTurn = 1;
    const offered = () => scoreOptions(state, t).options.find((entry) => entry.action.type === "strikeActivity");
    assert.equal(offered(), undefined, "not without a Strike just before");
    t.lastStrike = { strike: "Club", melee: true, targetId: "fighter", degree: 0, action: 1, round: state.round };
    assert.equal(offered(), undefined, "not when the Strike before wasn't its last action");
    t.lastStrike = { ...t.lastStrike, action: 0 };
    const option = offered();
    assert.ok(option, "straight after the club missed");
    performAction(state, t, option.action);
    assert.equal(t.attacksThisTurn, 1, "no more penalty after it");
    // Every Strike on its turn, hit or miss, is its last Strike.
    assert.deepEqual([t.lastStrike.strike, t.lastStrike.targetId, t.lastStrike.action], ["Club", "fighter", 1]);
});

test("more damage on its own Strikes: on the Strike it names, for its time; fatal and half damage on a charge (2026-10-10, B69)", () => {
    const strikes = [{ name: "Fangs", melee: true, bonus: 10, damage: [{ dice: 1, die: 8, bonus: 4, type: "piercing" }] }, { name: "Claw", melee: true, bonus: 10, damage: [{ dice: 1, die: 6, bonus: 4, type: "slashing" }] }, { name: "Spit", melee: false, bonus: 10, damage: [{ dice: 1, die: 4, bonus: 0, type: "acid" }] }];
    assert.deepEqual(Object.keys(deltasFor(strikes, { formulas: ["2d8[sonic]"], strike: "fangs", scope: "all" })), ["Fangs"]);
    assert.deepEqual(Object.keys(deltasFor(strikes, { formulas: ["1d6[fire]"], strike: null, scope: "melee" })), ["Fangs", "Claw"]);
    assert.deepEqual(deltasFor(strikes, { formulas: ["1d10[persistent,bleed]", "2[acid]", "2d8[precision]", "die"], strike: "claw", scope: "all" }).Claw, [
        { dice: 1, die: 10, bonus: 0, multiplier: 1, type: "bleed", precision: false, persistent: true },
        { dice: 0, die: 0, bonus: 2, multiplier: 1, type: "acid", precision: false, persistent: false },
        { dice: 2, die: 8, bonus: 0, multiplier: 1, type: "slashing", precision: true, persistent: false },
        { dice: 1, die: 6, bonus: 0, multiplier: 1, type: "slashing", precision: false, persistent: false }
    ]);
    // Added before the Strikes are known (as the snapshot does): resolved as the fight is prepared; a stance has no end.
    const bat = { ...moderateCreature(5, "bat", "Bat"), engagement: 1 };
    const builtins = {};
    assert.equal(addBuiltin(builtins, { builtin: "self-effect", actions: 1, model: { name: "Test Hum", rounds: 1, modifiers: [], tempHp: 0 }, damage: ["2d8[sonic]"], strike: "fangs", melee: false }, "Test Hum"), true);
    assert.equal(addBuiltin(builtins, { builtin: "self-effect", actions: 1, model: { name: "Test Stance", rounds: null, modifiers: [], tempHp: 0 }, damage: ["1d6[fire]"], strike: null, melee: true, stance: true }, "Test Stance"), true);
    bat.strikes = strikes;
    bat.selfEffects = builtins.selfEffects;
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, bat] }, {}, 1);
    const b = state.byId.get("bat");
    assert.deepEqual([Object.keys(b.selfEffects[0].model.strikeDeltas), b.selfEffects[1].model.rounds, Object.keys(b.selfEffects[1].model.strikeDeltas)], [["Fangs"], Infinity, ["Fangs", "Claw"]]);
    assert.equal(bat.selfEffects[0].model.strikeDeltas, undefined, "the snapshot's own entry left as it was");
    // A charge's fatal trait and half damage.
    const horn = chargeStrike(strikes[0], { name: "Test Charge", fatal: 12, halfDamage: true });
    assert.deepEqual([horn.fatal, horn.damage[0].multiplier], [12, 0.5]);
    assert.deepEqual(chargeStrike(strikes[0], { name: "Test Aim", deadly: 4 }).deadly, { dice: 1, die: 4 });
});

test("reaction Strikes to a Strike in reach, an attack on an ally and a critical hit; Fast Swallow; a move without reactions; a once-a-fight ambush (2026-10-10, B70)", () => {
    const [fighter] = martialParty(5);
    const hitter = { ...fighter, engagement: 1, strikes: fighter.strikes.map((strike) => ({ ...strike, bonus: 100 })) };
    const beast = (id, name, extra) => {
        const base = moderateCreature(5, id, name);
        return { ...base, engagement: 1, hp: { value: 999, max: 999 }, strikes: [{ ...base.strikes[0], name: "Tail", bonus: 100 }, { ...base.strikes[0], name: "Jaws", bonus: 100 }], ...extra };
    };
    // Tail Lash: the fighter's Strike in its reach; the hit costs the fighter 2 on that roll.
    let state = createFightState({ combatants: [hitter, beast("drake", "Drake", { reactionStrikes: [{ name: "Tail Lash", triggers: ["strike", "skill"], strike: "tail", penalty: 2, disrupts: false, hinders: 2 }] })] }, {}, 1);
    state.log = [];
    const f = state.byId.get("fighter");
    performStrike(state, f, state.byId.get("drake"), f.strikes[0]);
    let text = state.log.join("\n");
    assert.match(text, /Drake uses Tail Lash[\s\S]*Fighter [^\n]*→ Drake/, text);
    assert.equal(f.rollPenalty, 0, "spent on the roll");
    // Avenging Bite: an attack on its ally, not on itself.
    state = createFightState({ combatants: [hitter, beast("wolf", "Wolf", { reactionStrikes: [{ name: "Avenging Bite", triggers: ["ally-attacked"], strike: "jaws", penalty: 0, disrupts: false }] }), beast("pal", "Packmate", {})] }, {}, 1);
    state.log = [];
    performStrike(state, state.byId.get("fighter"), state.byId.get("wolf"), state.byId.get("fighter").strikes[0]);
    assert.doesNotMatch(state.log.join("\n"), /Avenging Bite/);
    performStrike(state, state.byId.get("fighter"), state.byId.get("pal"), state.byId.get("fighter").strikes[0]);
    assert.match(state.log.join("\n"), /Wolf uses Avenging Bite/);
    // Violent Retort: a critical hit on it.
    state = createFightState({ combatants: [hitter, beast("dragon", "Dragon", { reactionStrikes: [{ name: "Violent Retort", triggers: ["critical-hit"], strike: "tail", penalty: 0, disrupts: false }] })] }, {}, 1);
    state.log = [];
    for (let i = 0; i < 5 && !/Violent Retort/.test(state.log.join("\n")); i++) performStrike(state, state.byId.get("fighter"), state.byId.get("dragon"), state.byId.get("fighter").strikes[0]);
    text = state.log.join("\n");
    assert.match(text, /critically hits[^\n]*\n\s+Dragon uses Violent Retort/, text);
    // Fast Swallow: grabbed, then swallowed as its reaction once the action ends.
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const swallowed = { damage: { mode: "formulas", formulas: [{ formula: "2d6[bludgeoning]" }], rollScope: "outcome" }, effects: [{ kind: "swallow", damage: "2d6[bludgeoning]", rupture: 10, size: "large" }] };
    const swallow = { modelVersion: 13, source: { name: "Swallow Whole" }, rank: 1, traits: ["attack"], activation: { time: "1", traits: ["attack"] }, targeting: { target: "a creature it has grabbed or restrained", range: "touch", area: null, grabbed: true, size: "large" }, trigger: { event: "use" }, resolution: { kind: "check", check: { roll: "skill", statistic: "athletics", against: { dc: "target", statistic: "reflex" } }, sharedDamage: null, outcomes: { criticalSuccess: swallowed, success: swallowed, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    const worm = beast("worm", "Worm", { fastSwallow: { name: "Fast Swallow" }, skills: { athletics: 100 }, spells: [{ name: "Swallow Whole", plan: swallow, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] });
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, worm] }, {}, 1);
    state.log = [];
    const w = state.byId.get("worm");
    applyCondition(state, state.byId.get("fighter"), "grabbed", null, null, w);
    performAction(state, w, { type: "raiseShield" });
    assert.match(state.log.join("\n"), /Worm uses Fast Swallow/, state.log.join("\n"));
    assert.equal(state.byId.get("fighter").swallowedBy, "worm");
    // A move without reactions: out of a Melee where a Step can't go (a foe with reach).
    const ghoul = { ...moderateCreature(5, "ghoul", "Ghoul"), engagement: 1, safeMove: { name: "Swift Leap", actions: 1 } };
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, reach: 10 }, ghoul] }, {}, 1);
    const g = state.byId.get("ghoul");
    g.round = 1;
    g.actionsLeft = 3;
    const leap = scoreOptions(state, g).options.find((entry) => entry.action.type === "safeMove");
    assert.ok(leap, "on offer");
    state.log = [];
    performAction(state, g, leap.action);
    assert.deepEqual([g.meleeId, /Attack of Opportunity/.test(state.log.join("\n"))], [null, false]);
    // A once-a-fight ambush (Aquatic Ambush): not again.
    const lurker = { ...moderateCreature(5, "lurker", "Lurker"), charges: [{ name: "Aquatic Ambush", actions: 1, strides: 1, strike: null, offGuard: true, oncePerFight: true }] };
    state = createFightState({ combatants: [{ ...fighter }, lurker] }, {}, 1);
    const l = state.byId.get("lurker");
    l.round = 1;
    l.actionsLeft = 3;
    assert.ok(scoreOptions(state, l).options.some((entry) => entry.action.type === "charge"), "on offer once");
    l.chargesUsed = new Set(["Aquatic Ambush"]);
    assert.equal(scoreOptions(state, l).options.some((entry) => entry.action.type === "charge"), false);
});

test("a monster's Hunt Prey with its own die, and a bonus to its own AC until its next turn (2026-10-10, B71)", () => {
    const hunter = { ...moderateCreature(5, "hunter", "Hunter"), engagement: 1 };
    assert.equal(addBuiltin(hunter, { builtin: "hunt-prey", edge: "precision", dice: 2, die: 6 }, "Hunt Prey"), true);
    assert.deepEqual(hunter.huntPrey, { edge: "precision", precisionDice: 2, die: 6 });
    assert.equal(addBuiltin({}, { builtin: "hunt-prey", edge: "flurry" }, "Hunt Prey"), false);
    const [fighter] = martialParty(5);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, hunter] }, {}, 1);
    const h = state.byId.get("hunter");
    h.prey = "fighter";
    // (A hit on its prey: 2d6 more precision damage the first time this round.)
    const parts = expectedHitDamage(h, h.strikes[0], state.byId.get("fighter"), false) - expectedHitDamage({ ...h, prey: null }, h.strikes[0], state.byId.get("fighter"), false);
    assert.ok(parts > 6 && parts < 8, String(parts));
    // Dueling Parry: +2 AC until the start of its next turn.
    const duelist = { ...moderateCreature(5, "duelist", "Duelist"), engagement: 1 };
    assert.equal(addBuiltin(duelist, { builtin: "self-effect", actions: 1, model: { name: "Dueling Parry", rounds: 1, modifiers: [{ on: "ac", type: "circumstance", value: 2 }], tempHp: 0 }, duration: { value: 1, unit: "rounds", expiry: "turn-start" } }, "Dueling Parry"), true);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, duelist] }, {}, 1);
    const d = state.byId.get("duelist");
    d.round = 1;
    d.actionsLeft = 1;
    const before = d.ac;
    const option = scoreOptions(state, d).options.find((entry) => entry.action.type === "selfEffect");
    assert.ok(option, "on offer");
    performAction(state, d, option.action);
    assert.equal(d.effects.some((effect) => effect.key === "self:Dueling Parry"), true);
    assert.equal(armorClass(d) - before, 2);
});

test("Mythic Points (Remove a Condition, Undying Myth, Recharge), Quickened Casting, Speed Surge, Poison Weapon (2026-10-11, B72)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (effects = [], damage = { ...none }) => ({ damage, effects });
    const [fighter] = martialParty(5);
    // Remove a Condition: a Mythic Point for its worst condition; Undying Myth: all of them, and up at half its Hit Points.
    const mythic = { ...moderateCreature(5, "myth", "Myth"), engagement: 1 };
    for (const plan of [{ builtin: "mythic", kind: "remove-condition", actions: 1 }, { builtin: "mythic", kind: "undying", fraction: 0.5 }, { builtin: "mythic", kind: "recharge", actions: 1 }]) assert.equal(addBuiltin(mythic, plan, plan.kind), true);
    assert.equal(mythic.mythicPoints, 3);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, mythic] }, {}, 1);
    const m = state.byId.get("myth");
    m.round = 1;
    m.actionsLeft = 3;
    m.cond.slowed = 1;
    m.cond.frightened = 1;
    const removal = scoreOptions(state, m).options.find((entry) => entry.action.type === "mythicRemove");
    assert.equal(removal?.action.slug, "slowed");
    performAction(state, m, removal.action);
    assert.deepEqual([m.cond.slowed, m.mythicPoints], [0, 2]);
    state.log = [];
    dealDamage(state, m, m.hp.value + 5, { source: state.byId.get("fighter") });
    assert.deepEqual([m.hp.value, m.mythicPoints, isActive(m)], [Math.floor(m.hp.max / 2), 0, true]);
    dealDamage(state, m, m.hp.value + 5, { source: state.byId.get("fighter") });
    assert.equal(isActive(m), false, "no Mythic Points left");
    // Quickened Casting: a 2-action spell with one action left.
    const spell = { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: ["concentrate", "manipulate"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 30 } }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row([], { mode: "formulas", formulas: [{ formula: "3d6[fire]" }], rollScope: "outcome" }), failure: row([], { mode: "formulas", formulas: [{ formula: "6d6[fire]" }], rollScope: "outcome" }), criticalFailure: row([], { mode: "formulas", formulas: [{ formula: "12d6[fire]" }], rollScope: "outcome" }) } } };
    const caster = { ...moderateCreature(5, "mage", "Mage"), engagement: 1, spells: [{ name: "Test Blast", plan: spell, castRank: 3, dc: 30, attack: null, pool: null }] };
    assert.equal(addBuiltin(caster, { builtin: "quickened-casting", maxRank: 4 }, "Quickened Casting"), true);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, caster] }, {}, 1);
    const c = state.byId.get("mage");
    c.round = 1;
    c.actionsLeft = 1;
    const quick = scoreOptions(state, c).options.find((entry) => entry.action.type === "cast" && entry.action.quickened);
    assert.ok(quick, "a 2-action spell with one action, quickened");
    performAction(state, c, quick.action);
    assert.equal(c.quickenedUsed, true);
    // Speed Surge: a foe two Strides away, engaged in one action.
    const drake = { ...moderateCreature(5, "drake", "Drake"), band: "far" };
    assert.equal(addBuiltin(drake, { builtin: "speed-surge", actions: 1, uses: 3 }, "Speed Surge"), true);
    state = createFightState({ combatants: [{ ...fighter, band: "near" }, drake] }, {}, 1);
    const d = state.byId.get("drake");
    d.round = 1;
    d.actionsLeft = 3;
    const surge = scoreOptions(state, d).options.find((entry) => entry.action.surge);
    assert.ok(surge, "on offer");
    performAction(state, d, surge.action);
    assert.deepEqual([d.surgesUsed, d.meleeId !== null], [1, true]);
    // Poison Weapon: its poison with the next weapon Strike that hits and deals damage.
    const poison = { modelVersion: 13, source: { name: "Test Venom" }, rank: 1, traits: ["poison"], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 100 } }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row(), failure: row([{ kind: "condition", slug: "enfeebled", value: 1, duration: null }]), criticalFailure: row([{ kind: "condition", slug: "enfeebled", value: 2, duration: null }]) } } };
    const assassin = { ...moderateCreature(5, "assassin", "Assassin"), engagement: 1 };
    assassin.strikes = [{ ...assassin.strikes[0], name: "Kukri", held: true, bonus: 100 }];
    assert.equal(addBuiltin(assassin, { builtin: "poison-weapon", actions: 1, poison: { name: "Test Venom", plan: poison }, doses: 2 }, "Poison Weapon"), true);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, assassin] }, {}, 1);
    state.log = [];
    const a = state.byId.get("assassin");
    a.round = 1;
    a.actionsLeft = 3;
    const apply = scoreOptions(state, a).options.find((entry) => entry.action.type === "poisonWeapon");
    assert.ok(apply, "on offer");
    performAction(state, a, apply.action);
    assert.deepEqual([a.weaponPoisoned, a.poisonDoses], [true, 1]);
    performStrike(state, a, state.byId.get("fighter"), a.strikes[0]);
    assert.deepEqual([a.weaponPoisoned, state.byId.get("fighter").cond.enfeebled >= 1], [false, true], state.log.join("\n"));
});

test("Twin Feint's off-guard second attack, Three-Headed Strike's different Strikes, Focused Assault's failure (2026-10-11, B74)", () => {
    const party = martialParty(5);
    const fighter = party[0];
    const ready = (state, id) => {
        const c = state.byId.get(id);
        c.round = 1;
        c.actionsLeft = 3;
        return c;
    };
    // Twin Feint: the second Strike against an off-guard target (2 lower AC), spent by it.
    const bugbear = { ...moderateCreature(5, "bugbear", "Bugbear"), engagement: 1 };
    assert.equal(addBuiltin(bugbear, { builtin: "multi-strike", actions: 2, strikes: [null, null], sameTarget: true, secondOffGuard: true }, "Twin Feint"), true);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, bugbear] }, {}, 1);
    state.log = [];
    const b = ready(state, "bugbear");
    const feint = scoreOptions(state, b).options.find((entry) => entry.action.type === "multiStrike");
    assert.ok(feint, "on offer");
    performAction(state, b, feint.action);
    const acs = state.log.filter((line) => line.startsWith("  Bugbear ") && / vs AC \d+/.test(line)).map((line) => Number(/ vs AC (\d+)/.exec(line)[1]));
    assert.equal(acs.length, 2, state.log.join("\n"));
    assert.equal(acs[1], acs[0] - 2, state.log.join("\n"));
    assert.equal((state.byId.get("fighter").offGuardTo ?? []).some((entry) => (entry.uses ?? 1) > 0), false, "spent by the second attack");
    // Three-Headed Strike: a different Strike at each of three foes, counted as one attack.
    const chimera = { ...moderateCreature(5, "chimera", "Chimera"), engagement: 1 };
    chimera.strikes = ["Dragon Jaws", "Lion Jaws", "Goat Horns"].map((name) => ({ ...chimera.strikes[0], name }));
    assert.equal(addBuiltin(chimera, { builtin: "multi-strike", actions: 2, strikes: ["dragon jaws", "lion jaws", "goat horns"], sameMap: true, each: true, max: 3, penalty: 2, countsAs: 1 }, "Three-Headed Strike"), true);
    state = createFightState({ combatants: [...party.slice(0, 3).map((pc) => ({ ...pc, engagement: 1 })), chimera] }, {}, 1);
    state.log = [];
    const k = ready(state, "chimera");
    const heads = scoreOptions(state, k).options.find((entry) => entry.action.type === "multiStrike");
    assert.ok(heads, "on offer");
    performAction(state, k, heads.action);
    const struck = state.log.filter((line) => line.startsWith("  Chimera ") && line.includes(" → ")).map((line) => /^ {2}Chimera (.+?) → (.+?):/.exec(line)?.slice(1).join(" at "));
    assert.equal(new Set(struck.map((entry) => entry.split(" at ")[0])).size, 3, state.log.join("\n"));
    assert.equal(new Set(struck.map((entry) => entry.split(" at ")[1])).size, 3, "a different creature each");
    assert.equal(k.attacksThisTurn, 1, "counted as one attack");
    // Focused Assault: a failure (not a critical one) deals the Strike's damage; it counts as five attacks.
    const hydra = { ...moderateCreature(5, "hydra", "Hydra"), engagement: 1 };
    assert.equal(addBuiltin(hydra, { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, countsAs: 5, failureDamage: true, onHit: { conditions: [], critical: null, push: null, damage: ["4d6[strike]"], save: null, size: null } }, "Focused Assault"), true);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, hydra] }, {}, 1);
    state.log = [];
    const h = ready(state, "hydra");
    const target = state.byId.get("fighter");
    const assault = scoreOptions(state, h).options.find((entry) => entry.action.type === "strikeActivity");
    assert.ok(assault, "on offer");
    // (10 on the die, 3 short of its AC: a failure.)
    state.rng.d20 = () => 10;
    h.strikes[assault.action.strikeIndex] = { ...h.strikes[assault.action.strikeIndex], bonus: armorClass(target) - 13 };
    const before = target.hp.value;
    performAction(state, h, assault.action);
    assert.ok(state.log.some((line) => /takes \d+ from the failed Focused Assault/.test(line)), state.log.join("\n"));
    assert.ok(target.hp.value < before, "the Strike's damage");
    assert.equal(h.attacksThisTurn, 5);
});

test("Knocking Sweep: a Trip at each enemy in its reach, at the penalty it started with (2026-10-11, B75)", { skip }, async () => {
    const { basic } = await packAbilities();
    const party = martialParty(5);
    const adept = { ...moderateCreature(5, "adept", "Adept"), engagement: 1, spells: [entry("Trip", basic.trip, "basic")] };
    assert.equal(addBuiltin(adept, { builtin: "skill-sweep", actions: 2, action: "trip", sameMap: true, oncePerTurn: true }, "Knocking Sweep"), true);
    const state = createFightState({ combatants: [...party.slice(0, 3).map((pc) => ({ ...pc, engagement: 1 })), adept] }, {}, 1);
    state.log = [];
    const a = state.byId.get("adept");
    a.round = 1;
    a.actionsLeft = 3;
    const sweep = scoreOptions(state, a).options.find((option) => option.action.type === "skillSweep");
    assert.ok(sweep, "on offer with three foes in reach");
    performAction(state, a, sweep.action);
    const tripped = state.log.map((line) => /^ {2}Adept casts Trip at (.+)$/.exec(line)?.[1]).filter(Boolean);
    assert.deepEqual(new Set(tripped).size, 3, state.log.join("\n"));
    assert.equal(a.attacksThisTurn, 3, "three attempts counted after all of them");
    assert.ok(a.usedThisTurn.has("Knocking Sweep"), "once a round");
    assert.equal(scoreOptions(state, a).options.some((option) => option.action.type === "skillSweep"), false);
});

test("Consume Fear: temporary Hit Points as a creature near it stops being frightened (2026-10-11, B76)", { skip }, async () => {
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileMonsterAbility } = await import(ABILITIES);
    const dragonDoc = readDocuments(`${PACKS}/pathfinder-monster-core-2`).find((doc) => doc.collection === "actors" && (doc.items ?? []).some((item) => item.name === "Consume Fear"));
    const plan = compileMonsterAbility(dragonDoc.items.find((item) => item.name === "Consume Fear"), { actor: dragonDoc });
    assert.equal(plan?.trigger?.event, "condition-lost");
    const [fighter] = martialParty(5);
    const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, spells: [entry("Consume Fear", plan)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    state.log = [];
    const d = state.byId.get("dragon");
    const f = state.byId.get("fighter");
    f.cond.frightened = 2;
    turnEnd(state, f);
    assert.equal(d.hp.temp ?? 0, 0, "still frightened 1");
    turnEnd(state, f);
    assert.equal(f.cond.frightened, 0);
    assert.ok(d.hp.temp > 0, state.log.join("\n"));
    assert.equal(d.reactionUsed, true);
});


test("Shake It Off: the first harmful condition an enemy gives it, negated with its reaction once a fight (2026-10-11, B77)", () => {
    const [fighter] = martialParty(5);
    const worm = { ...moderateCreature(5, "worm", "Worm"), engagement: 1 };
    assert.equal(addBuiltin(worm, { builtin: "negate-condition" }, "Shake It Off"), true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, worm] }, {}, 1);
    state.log = [];
    const w = state.byId.get("worm");
    const f = state.byId.get("fighter");
    // Its own side's, or a harmless one: not negated.
    assert.equal(applyCondition(state, w, "off-guard", null, null, f), true);
    assert.equal(applyCondition(state, w, "frightened", 1, null, f), false, "negated");
    assert.deepEqual([w.cond.frightened ?? 0, w.reactionUsed, w.negateConditionUses], [0, true, 0]);
    assert.equal(applyCondition(state, w, "frightened", 1, null, f), true, "once a fight");
    // Another fight: its use back (the spec is shared, its count is the creature's own).
    const again = createFightState({ combatants: [{ ...fighter, engagement: 1 }, worm] }, {}, 2);
    assert.equal(again.byId.get("worm").negateConditionUses, 1);
});

test("Wicked Bite: both ways ready after the jaws hit, the planner weighing each (2026-10-11, B78)", { skip }, async () => {
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileMonsterAbility } = await import(ABILITIES);
    const doc = readDocuments(`${PACKS}/pathfinder-monster-core-2`).find((entry) => entry.collection === "actors" && entry.name === "Urdefhan Tormentor");
    const plan = compileMonsterAbility(doc.items.find((item) => item.name === "Wicked Bite"), { actor: doc });
    assert.equal(plan?.builtin, "modes");
    const [fighter] = martialParty(5);
    const urdefhan = { ...moderateCreature(5, "urdefhan", "Urdefhan"), engagement: 1, spells: plan.modes.map((mode) => entry(`Wicked Bite (${mode.name})`, mode.plan)) };
    urdefhan.strikes = [{ ...urdefhan.strikes[0], name: "Jaws" }];
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, urdefhan] }, {}, 1);
    const u = state.byId.get("urdefhan");
    u.round = 1;
    u.actionsLeft = 2;
    triggerRiders(state, u, state.byId.get("fighter"), u.strikes[0], 2);
    assert.deepEqual([u.riderReady.index, u.riderReady.also], [0, [1]]);
    const offered = scoreOptions(state, u).options.filter((option) => option.action.type === "cast" && option.action.rider).map((option) => option.action.spellIndex);
    assert.deepEqual([...new Set(offered)].sort(), [0, 1], "both ways on offer");
});

test("You're Next: Demoralize another foe as it downs one; Stoke the Flames: foes taking persistent fire (2026-10-11, B79)", { skip }, async () => {
    const { basic } = await packAbilities();
    const party = martialParty(5);
    // You're Next: the Demoralize with its +2, at another foe, as its reaction.
    const demoralize = structuredClone(basic.demoralize);
    demoralize.resolution.check = { ...demoralize.resolution.check, bonus: { value: 2, type: "circumstance" } };
    const prisoner = { ...moderateCreature(5, "prisoner", "Prisoner"), engagement: 1, spells: [entry("You're Next", { ...demoralize, trigger: { event: "downs", reaction: true } })] };
    let state = createFightState({ combatants: [...party.slice(0, 2).map((pc) => ({ ...pc, engagement: 1 })), prisoner] }, {}, 1);
    state.log = [];
    const p = state.byId.get("prisoner");
    const [first, second] = party.slice(0, 2).map((pc) => state.byId.get(pc.id));
    dealDamage(state, first, first.hp.value + first.hp.temp + 1, { source: p });
    assert.ok(state.log.some((line) => /Prisoner reacts with You're Next/.test(line)), state.log.join("\n"));
    assert.ok(state.log.includes(`  Prisoner casts You're Next at ${second.name}`), state.log.join("\n"));
    assert.equal(p.reactionUsed, true);
    // Stoke the Flames: only the foes taking persistent fire damage.
    const stoke = { modelVersion: 13, source: { name: "Stoke the Flames" }, rank: 1, traits: ["fire"], activation: { time: "1", traits: [] }, targeting: { target: null, range: null, area: { type: "emanation", value: 60 }, foes: true, taking: "fire" }, trigger: { event: "use" }, resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "formulas", formulas: [{ formula: "4d6[fire]" }], rollScope: "outcome" }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] } } } };
    const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, spells: [entry("Stoke the Flames", stoke)] };
    state = createFightState({ combatants: [...party.slice(0, 2).map((pc) => ({ ...pc, engagement: 1 })), dragon] }, {}, 1);
    const [burning, cool] = party.slice(0, 2).map((pc) => state.byId.get(pc.id));
    burning.persistent.push({ type: "fire", dice: 1, die: 6, bonus: 0, multiplier: 1 });
    const sets = targetSetsFor(state, state.byId.get("dragon"), state.byId.get("dragon").spells[0], { enemies: [burning, cool], allies: [], inMelee: () => true, distance: () => 5, meleeId: null });
    assert.deepEqual(sets.map((set) => set.targets.map((target) => target.name)), [[burning.name]]);
});

test("Golden Luck, Word of Wisdom, Cat's Luck: a failed save made better by a reaction (2026-10-11, B80)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (effects = []) => ({ damage: { ...none }, effects });
    // A Reflex save at DC 30 (a 10 on the die fails; a 19 succeeds for a +12).
    const save = (dc) => ({ name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, plan: { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: false, against: { dc: "fixed", value: dc } }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row(), failure: row([{ kind: "condition", slug: "frightened", value: 1, duration: null }]), criticalFailure: row([{ kind: "condition", slug: "frightened", value: 2, duration: null }]) } } } });
    const [fighter] = martialParty(5);
    const fight = (monsters, rolls) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, ...monsters.map((m) => ({ ...m, engagement: 1 }))] }, {}, 1);
        state.log = [];
        const queue = [...rolls];
        state.rng.d20 = () => queue.shift() ?? 10;
        return state;
    };
    // Golden Luck: its own failure a success; then not until its recharge.
    const gold = { ...moderateCreature(5, "gold", "Gold") };
    assert.equal(addBuiltin(gold, { builtin: "save-boost", recharge: "1d4" }, "Golden Luck"), true);
    let state = fight([gold], [10]);
    const g = state.byId.get("gold");
    const dc = 10 + g.saves.reflex + 3;
    castPlan(state, state.byId.get("fighter"), save(dc), ["gold"]);
    assert.ok(state.log.includes("  Gold uses Golden Luck: Gold's save success"), state.log.join("\n"));
    assert.equal(g.cond.frightened ?? 0, 0);
    assert.ok(g.saveBoostUntil > state.round);
    // Word of Wisdom: an ally's failure, one degree better.
    const vizier = { ...moderateCreature(5, "vizier", "Vizier") };
    assert.equal(addBuiltin(vizier, { builtin: "save-boost", ally: true, within: 60, recharge: "1d4" }, "Word of Wisdom"), true);
    const ally = { ...moderateCreature(5, "ally", "Ally") };
    state = fight([vizier, ally], [10]);
    castPlan(state, state.byId.get("fighter"), save(10 + state.byId.get("ally").saves.reflex + 3), ["ally"]);
    assert.ok(state.log.includes("  Vizier uses Word of Wisdom: Ally's save success"), state.log.join("\n"));
    assert.equal(state.byId.get("vizier").reactionUsed, true);
    // Cat's Luck: its Reflex save rerolled, the better kept, once a fight.
    const cat = { ...moderateCreature(5, "cat", "Cat") };
    assert.equal(addBuiltin(cat, { builtin: "save-reroll", save: "reflex" }, "Cat's Luck"), true);
    state = fight([cat], [10, 19]);
    castPlan(state, state.byId.get("fighter"), save(10 + state.byId.get("cat").saves.reflex + 3), ["cat"]);
    assert.ok(state.log.some((line) => /Cat uses Cat's Luck: success on the reroll/.test(line)), state.log.join("\n"));
    assert.deepEqual([state.byId.get("cat").saveRerollUses, state.byId.get("cat").cond.frightened ?? 0], [0, 0]);
});

test("Wing Thrash answers an adjacent enemy's damaging Strike; Telekinetic Defense, Wing Rebuff answer an approach (2026-10-11, B81)", () => {
    const party = martialParty(5);
    // Wing Thrash: a wing Strike back at the fighter, and one at the other adjacent foe.
    const bat = { ...moderateCreature(5, "bat", "Bat"), engagement: 1 };
    bat.strikes = [{ ...bat.strikes[0], name: "Wing" }];
    assert.equal(addBuiltin(bat, { builtin: "reaction-strike", triggers: ["damaged-adjacent"], strike: "wing", penalty: 0, disrupts: false, second: true }, "Wing Thrash"), true);
    let state = createFightState({ combatants: [...party.slice(0, 2).map((pc) => ({ ...pc, engagement: 1 })), bat] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const [fighter, second] = party.slice(0, 2).map((pc) => state.byId.get(pc.id));
    performStrike(state, fighter, state.byId.get("bat"), fighter.strikes[0]);
    assert.ok(state.log.includes("  Bat uses Wing Thrash"), state.log.join("\n"));
    const wings = state.log.filter((line) => /^ {2}Bat Wing → /.test(line)).map((line) => /→ (.+?):/.exec(line)[1]);
    assert.deepEqual(wings, [fighter.name, second.name], state.log.join("\n"));
    // Telekinetic Defense: a Strike at the creature that comes into its reach.
    const poltergeist = { ...moderateCreature(5, "ghost", "Ghost"), band: "near" };
    poltergeist.strikes = [{ ...poltergeist.strikes[0], name: "Telekinetic Object" }];
    assert.equal(addBuiltin(poltergeist, { builtin: "reaction-strike", triggers: ["approach"], strike: "telekinetic object", penalty: 0, disrupts: false, within: 10 }, "Telekinetic Defense"), true);
    state = createFightState({ combatants: [{ ...party[0], band: "near" }, poltergeist] }, {}, 1);
    state.log = [];
    stride(state, state.byId.get(party[0].id), { kind: "engage", targetId: "ghost" });
    assert.ok(state.log.includes("  Ghost uses Telekinetic Defense"), state.log.join("\n"));
    assert.equal(state.byId.get("ghost").reactionUsed, true);
});

test("Biting Snakes: a Strike at a creature ending its turn beside it (2026-10-11, B82)", () => {
    const [fighter] = martialParty(5);
    const medusa = { ...moderateCreature(5, "medusa", "Medusa"), engagement: 1 };
    medusa.strikes = [...medusa.strikes, { ...medusa.strikes[0], name: "Snake Fangs" }];
    assert.equal(addBuiltin(medusa, { builtin: "reaction-strike", triggers: ["turn-end-adjacent"], strike: "snake fangs", penalty: 0, disrupts: false }, "Biting Snakes"), true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, medusa] }, {}, 1);
    state.log = [];
    turnEnd(state, state.byId.get("fighter"));
    assert.ok(state.log.includes("  Medusa uses Biting Snakes"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /^ {2}Medusa Snake Fangs → Fighter/.test(line)), state.log.join("\n"));
    assert.equal(state.byId.get("medusa").reactionUsed, true);
});


test("Feed on Fear: healing only with a frightened or dying enemy near (2026-10-11, B83)", () => {
    const feed = {
        modelVersion: 13, source: { name: "Feed on Fear" }, rank: 1, traits: ["concentrate"], activation: { time: "1", traits: ["concentrate"] },
        targeting: { target: "self", range: null, area: null }, trigger: { event: "use" }, requires: "An enemy is under a fear effect or Dying within 15 feet",
        requiresFoe: { conditions: ["frightened", "dying"], within: 15 },
        resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "4d4", kinds: ["healing"] }], recipients: "any" } } }
    };
    const [fighter] = martialParty(3);
    const wisp = { ...moderateCreature(3, "wisp", "Will-o'-Wisp"), engagement: 1, spells: [entry("Feed on Fear", feed)] };
    const casts = (frightened, status = "active") => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, wisp] }, {}, 2);
        const w = state.byId.get("wisp");
        w.hp.value = Math.floor(w.hp.max / 3);
        w.actionsLeft = 3;
        const f = state.byId.get("fighter");
        f.cond.frightened = frightened;
        if (status === "down") Object.assign(f, { status: "down", hp: { ...f.hp, value: 0 } }, { cond: { ...f.cond, dying: 1 } });
        return scoreOptions(state, w).options.some((option) => option.action?.type === "cast" && option.action.spellIndex === 0);
    };
    assert.equal(casts(0), false);
    assert.equal(casts(1), true);
    assert.equal(casts(0, "down"), true);
});

test("Reaction Strikes: at a Strike on it, a critical miss on it, damage from beside it, an attack or spell aimed at it (2026-10-11, B84)", () => {
    const [fighter] = martialParty(5);
    const fight = (triggers, name, { engaged = true } = {}) => {
        const monster = { ...moderateCreature(5, "mon", "Monster"), engagement: engaged ? 1 : 0, hp: { value: 999, max: 999 } };
        monster.strikes = [...monster.strikes, { ...monster.strikes[0], name: "Answer", melee: !triggers.includes("targeted"), range: triggers.includes("targeted") ? 120 : undefined }];
        assert.equal(addBuiltin(monster, { builtin: "reaction-strike", triggers, strike: "answer", penalty: 0, disrupts: false }, name), true);
        const state = createFightState({ combatants: [{ ...fighter, engagement: engaged ? 1 : 0, band: engaged ? undefined : "far" }, monster] }, {}, 3);
        state.log = [];
        return state;
    };
    const answered = (state, name) => state.log.includes(`  Monster uses ${name}`) && state.log.some((line) => /^ {2}Monster Answer → Fighter/.test(line));
    // A Strike at it in its reach.
    let state = fight(["attacked"], "Cutting Rebuke");
    performStrike(state, state.byId.get("fighter"), state.byId.get("mon"), state.byId.get("fighter").strikes[0]);
    assert.ok(answered(state, "Cutting Rebuke"), state.log.join("\n"));
    // A critical miss on it: only then.
    state = fight(["critical-miss"], "Opportune Bite");
    state.rng.d20 = () => 10;
    performStrike(state, state.byId.get("fighter"), state.byId.get("mon"), state.byId.get("fighter").strikes[0]);
    assert.equal(answered(state, "Opportune Bite"), false, state.log.join("\n"));
    state = fight(["critical-miss"], "Opportune Bite");
    state.rng.d20 = () => 1;
    performStrike(state, state.byId.get("fighter"), state.byId.get("mon"), state.byId.get("fighter").strikes[0]);
    state.rng.d20 = () => 10;
    assert.ok(state.log.some((line) => /critically misses/.test(line)), state.log.join("\n"));
    assert.ok(answered(state, "Opportune Bite"), state.log.join("\n"));
    // Damage from beside it, one Strike back.
    state = fight(["damaged-adjacent"], "Squealed Outrage");
    state.rng.d20 = () => 19;
    performStrike(state, state.byId.get("fighter"), state.byId.get("mon"), state.byId.get("fighter").strikes[0]);
    assert.ok(answered(state, "Squealed Outrage"), state.log.join("\n"));
    // An attack or a spell aimed at it, at any range.
    state = fight(["targeted"], "Superconductor", { engaged: false });
    performStrike(state, state.byId.get("fighter"), state.byId.get("mon"), { ...state.byId.get("fighter").strikes[0], melee: false, range: 100 });
    assert.ok(answered(state, "Superconductor"), state.log.join("\n"));
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const spell = { modelVersion: 13, source: { name: "Test Spell" }, rank: 1, traits: ["concentrate", "manipulate"], activation: { time: "2", traits: [] }, targeting: { target: "creature", range: 120, area: null }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 10 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    state = fight(["targeted"], "Superconductor", { engaged: false });
    const caster = state.byId.get("fighter");
    caster.spells = [{ name: "Test Spell", plan: spell, castRank: 1, dc: 20, attack: null, pool: null }];
    castSpell(state, caster, 0, ["mon"]);
    assert.ok(answered(state, "Superconductor"), state.log.join("\n"));
});

test("Jeer at Failure: Demoralize a foe that falls prone or critically fails a Strike (2026-10-11, B85)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter, second] = martialParty(5);
    const jeer = { ...structuredClone(basic.demoralize), source: { name: "Jeer at Failure" }, targeting: { ...basic.demoralize.targeting, target: "the attacker" }, trigger: { event: "foe-mishap", reaction: true, within: 90 } };
    const fight = () => {
        const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Jeer at Failure", jeer)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...second, engagement: 1 }, dragon] }, {}, 1);
        state.log = [];
        return state;
    };
    // A critically failed Strike: at that foe.
    let state = fight();
    const f = state.byId.get(fighter.id);
    state.rng.d20 = () => 1;
    performStrike(state, f, state.byId.get("dragon"), f.strikes[0]);
    state.rng.d20 = () => 10;
    assert.ok(state.log.some((line) => /Dragon reacts with Jeer at Failure/.test(line)), state.log.join("\n"));
    assert.ok(state.log.includes(`  Dragon casts Jeer at Failure at ${f.name}`), state.log.join("\n"));
    assert.equal(state.byId.get("dragon").reactionUsed, true);
    // Falling prone (a Trip), and only once a round: its reaction is spent.
    state = fight();
    const s = state.byId.get(second.id);
    applyCondition(state, s, "prone", null, null, state.byId.get(fighter.id));
    assert.ok(state.log.includes(`  Dragon casts Jeer at Failure at ${s.name}`), state.log.join("\n"));
    state.log = [];
    applyCondition(state, state.byId.get(fighter.id), "prone", null, null, s);
    assert.equal(state.log.some((line) => /Jeer at Failure/.test(line)), false, state.log.join("\n"));
});

test("Unbidden Thoughts: the attacker keeps the critical hit and is frightened 2, or takes a normal hit when that's enough (2026-10-11, B86)", () => {
    const [fighter] = martialParty(5);
    const fight = (hp) => {
        const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, hp: { value: hp, max: 999 } };
        assert.equal(addBuiltin(dragon, { builtin: "crit-downgrade", dc: null, or: { slug: "frightened", value: 2 } }, "Unbidden Thoughts"), true);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => 20;
        return state;
    };
    let state = fight(999);
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("dragon"), f.strikes[0]);
    assert.ok(state.log.includes(`  Dragon uses Unbidden Thoughts: ${f.name} keeps the critical hit and is frightened 2`), state.log.join("\n"));
    assert.equal(f.cond.frightened, 2);
    assert.ok(state.log.some((line) => /critically hits/.test(line)), state.log.join("\n"));
    // A normal hit would finish it: the attacker takes that, unafraid.
    state = fight(3);
    const g = state.byId.get(fighter.id);
    performStrike(state, g, state.byId.get("dragon"), g.strikes[0]);
    assert.ok(state.log.includes("  Dragon uses Unbidden Thoughts: a normal hit"), state.log.join("\n"));
    assert.equal(g.cond.frightened ?? 0, 0);
    // (B59's no-check ones load from their plans too: Collapse.)
    const skeleton = moderateCreature(5, "skel", "Skeleton");
    assert.equal(addBuiltin(skeleton, { builtin: "crit-downgrade", dc: null, collapse: true }, "Collapse"), true);
    assert.deepEqual(skeleton.critDowngrade, { name: "Collapse", dc: null, collapse: true });
});

test("A teleport out of a Melee, then not until its recharge (2026-10-11, B87)", () => {
    const [fighter] = martialParty(5);
    const poracha = moderateCreature(5, "poracha", "Poracha");
    assert.equal(addBuiltin(poracha, { builtin: "safe-move", actions: 1, recharge: "1d4" }, "Jaunt"), true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, reach: 10 }, { ...poracha, engagement: 1 }] }, {}, 1);
    const p = state.byId.get("poracha");
    p.round = 1;
    p.actionsLeft = 3;
    const jaunt = scoreOptions(state, p).options.find((entry) => entry.action.type === "safeMove");
    assert.ok(jaunt, "on offer");
    state.rng.die = () => 3;
    performAction(state, p, jaunt.action);
    assert.equal(p.meleeId, null);
    assert.equal(p.safeMoveUntil, state.round + 3);
    // Back in the fighter's Melee next round: not yet.
    engage(state, state.byId.get("fighter"), p);
    p.round = state.round + 1;
    p.actionsLeft = 3;
    assert.equal(scoreOptions(state, p).options.some((entry) => entry.action.type === "safeMove"), false);
    p.round = state.round + 3;
    assert.ok(scoreOptions(state, p).options.some((entry) => entry.action.type === "safeMove"), "on offer again");
});

test("Bully's Bludgeon's nonlethal Strike, Savage Jaws' own damage (2026-10-11, B88)", () => {
    const giant = moderateCreature(5, "giant", "Giant");
    assert.equal(addBuiltin(giant, { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 2, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, nonlethal: true, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }, "Bully's Bludgeon"), true);
    const bludgeon = chargeStrike(giant.strikes[0], giant.strikeActivities[0]);
    assert.deepEqual([bludgeon.nonlethal, bludgeon.bonus], [true, giant.strikes[0].bonus + 2]);
    // A PC knocked out by it: unconscious, not dying.
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...giant, engagement: 1 }] }, {}, 1);
    const f = state.byId.get(fighter.id);
    f.hp.value = 1;
    state.rng.d20 = () => 19;
    performStrike(state, state.byId.get("giant"), f, bludgeon);
    assert.deepEqual([f.status, f.cond.unconscious, f.cond.dying ?? 0], ["down", true, 0], state.log?.join?.("\n"));
    const lisk = moderateCreature(5, "lisk", "Dracolisk");
    addBuiltin(lisk, { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: "(4d12+16)[piercing]", countsAs: 2, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } }, "Savage Jaws");
    const jaws = chargeStrike(lisk.strikes[0], lisk.strikeActivities[0]);
    assert.deepEqual([jaws.damage[0].dice, jaws.damage[0].die, jaws.damage[0].bonus, jaws.damage[0].type, lisk.strikeActivities[0].countsAs], [4, 12, 16, "piercing", 2]);
});

test("Furious Flailing: fire or electricity damage, a Strike at a random creature in reach and a flat check against persistent fire (2026-10-11, B89)", () => {
    const [fighter] = martialParty(5);
    const troll = { ...moderateCreature(5, "troll", "Troll"), engagement: 1, hp: { value: 999, max: 999 } };
    assert.equal(addBuiltin(troll, { builtin: "reaction-strike", triggers: ["damaged-by"], damageTypes: ["electricity", "fire"], strike: "claw", penalty: 0, disrupts: false, random: true, persistentFire: true }, "Furious Flailing"), true);
    troll.strikes = [...troll.strikes, { ...troll.strikes[0], name: "Claw" }];
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, troll] }, {}, 1);
    state.log = [];
    const t = state.byId.get("troll");
    // Cold: nothing.
    applyDamage(state, t, [{ type: "cold", amount: 5, persistent: false, precision: false }], { source: state.byId.get(fighter.id) });
    assert.equal(state.log.some((line) => /Furious Flailing/.test(line)), false, state.log.join("\n"));
    // Fire, while it burns: the Strike, then the flat check (a 20 puts it out).
    t.persistent.push({ type: "fire", dice: 1, die: 6, bonus: 0, multiplier: 1 });
    state.rng.d20 = () => 20;
    applyDamage(state, t, [{ type: "fire", amount: 5, persistent: false, precision: false }], { source: state.byId.get(fighter.id) });
    assert.ok(state.log.includes("  Troll uses Furious Flailing"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /^ {2}Troll Claw → /.test(line)), state.log.join("\n"));
    assert.ok(state.log.includes("  Troll puts out its persistent fire"), state.log.join("\n"));
    assert.equal(t.persistent.some((entry) => entry.type === "fire"), false);
    assert.equal(t.reactionUsed, true);
});

test("A Strike back at a failed attack (its best melee Strike, a fortune one), a charge that triggers no reactions (2026-10-11, B90)", () => {
    const [fighter] = martialParty(5);
    const fight = (plan) => {
        const drake = { ...moderateCreature(5, "drake", "Drake"), engagement: 1, hp: { value: 999, max: 999 } };
        assert.equal(addBuiltin(drake, plan, "Test Counter"), true);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, drake] }, {}, 1);
        state.log = [];
        return state;
    };
    // A plain miss: its best melee Strike back; a hit: nothing.
    let state = fight({ builtin: "reaction-strike", triggers: ["missed"], strike: "melee", penalty: 0, disrupts: false });
    const f = state.byId.get(fighter.id);
    state.rng.d20 = () => 2;
    performStrike(state, f, state.byId.get("drake"), { ...f.strikes[0], bonus: 0 });
    assert.ok(state.log.includes("  Drake uses Test Counter"), state.log.join("\n"));
    state = fight({ builtin: "reaction-strike", triggers: ["missed"], strike: "melee", penalty: 0, disrupts: false });
    state.rng.d20 = () => 19;
    performStrike(state, state.byId.get(fighter.id), state.byId.get("drake"), state.byId.get(fighter.id).strikes[0]);
    assert.equal(state.log.some((line) => /Test Counter/.test(line)), false, state.log.join("\n"));
    // A fortune Strike: two dice, the better.
    state = fight({ builtin: "reaction-strike", triggers: ["missed"], strike: "melee", penalty: 0, disrupts: false, fortune: true });
    const rolls = [2, 3, 17];
    let calls = 0;
    state.rng.d20 = () => (calls++, rolls.shift() ?? 10);
    performStrike(state, state.byId.get(fighter.id), state.byId.get("drake"), { ...state.byId.get(fighter.id).strikes[0], bonus: 0 });
    assert.equal(calls, 3, "the miss's die, then two for the fortune Strike");
    // A charge whose move triggers no reactions: out of one Melee into another with no Reactive Strike.
    const drake = { ...moderateCreature(5, "drake", "Drake") };
    addBuiltin(drake, { builtin: "charge", actions: 2, strides: 1, strike: null, offGuard: true, safe: true }, "Test Assault");
    assert.equal(drake.charges[0].safe, true);
    const [guard, archer] = martialParty(5);
    state = createFightState({ combatants: [{ ...guard, engagement: 1, reactions: { aoo: true } }, { ...archer, engagement: 0 }, { ...drake, engagement: 1 }] }, {}, 1);
    state.log = [];
    const d = state.byId.get("drake");
    performAction(state, d, { type: "charge", ability: 0, targetId: archer.id, strikeIndex: 0, actions: 2 });
    assert.equal(state.log.some((line) => /Attack of Opportunity|Reactive Strike/.test(line)), false, state.log.join("\n"));
    assert.ok(state.log.includes("  Drake uses Test Assault"), state.log.join("\n"));
});

test("A reaction Strike at a ranged attack in its Melee (2026-10-11, B91)", () => {
    const [fighter] = martialParty(5);
    const drake = { ...moderateCreature(5, "drake", "Drake"), engagement: 1, hp: { value: 999, max: 999 } };
    drake.strikes = [...drake.strikes, { ...drake.strikes[0], name: "Tail" }];
    assert.equal(addBuiltin(drake, { builtin: "reaction-strike", triggers: ["move", "ranged"], strike: "tail", penalty: 0, disrupts: false, criticalTrip: true }, "Test Whip"), true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, drake] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("drake"), { ...f.strikes[0], name: "Shortbow", melee: false, range: 60 });
    assert.ok(state.log.includes("  Drake uses Test Whip"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /^ {2}Drake Tail → /.test(line)), state.log.join("\n"));
});

test("A creature it holds failing to Escape: a Strike, or its damage (2026-10-11, B92)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const fight = (extra) => {
        const wyvern = { ...moderateCreature(5, "wyvern", "Wyvern"), engagement: 1, hp: { value: 999, max: 999 }, ...extra(moderateCreature(5, "wyvern", "Wyvern")) };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Escape", basic.escape, "basic")] }, wyvern] }, {}, 1);
        state.log = [];
        const f = state.byId.get(fighter.id);
        applyCondition(state, f, "grabbed", null, null, state.byId.get("wyvern"));
        return [state, f];
    };
    // Savage, on a critical failure only.
    let [state, f] = fight((base) => { const spec = { strikes: [...base.strikes, { ...base.strikes[0], name: "Stinger" }] }; addBuiltin(spec, { builtin: "reaction-strike", triggers: ["escape-critical-failure"], strike: "stinger", penalty: 0, disrupts: false }, "Savage"); return spec; });
    state.rng.d20 = () => 1;
    castSpell(state, f, 0, ["wyvern"]);
    state.rng.d20 = () => 10;
    assert.ok(state.log.includes("  Wyvern uses Savage"), state.log.join("\n"));
    // Gnashing Bite: its damage on a plain failure.
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const bite = { modelVersion: 13, source: { name: "Gnashing Bite" }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "escape-failed", reaction: true },
        resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { mode: "formulas", formulas: [{ formula: "2d6[piercing]" }], rollScope: "outcome" }, effects: [] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    [state, f] = fight(() => ({ spells: [entry("Gnashing Bite", bite)] }));
    const before = f.hp.value;
    state.rng.d20 = () => 2;
    castSpell(state, f, 0, ["wyvern"]);
    state.rng.d20 = () => 10;
    assert.ok(state.log.some((line) => /Wyvern (?:reacts with|uses) Gnashing Bite/.test(line)), state.log.join("\n"));
    assert.ok(f.hp.value < before, state.log.join("\n"));
});

test("Its own failed save: the new reroll kept, a free action's, once a fight; only a critical failure made a failure (2026-10-11, B93)", () => {
    const save = (dc) => ({ name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, plan: { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: false, against: { dc: "fixed", value: dc } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } } });
    const [fighter] = martialParty(5);
    const fight = (plan, rolls) => {
        const monster = { ...moderateCreature(5, "mon", "Monster"), engagement: 1 };
        addBuiltin(monster, plan, "Test Luck");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [save(30)] }, monster] }, {}, 1);
        state.log = [];
        const queue = [...rolls];
        state.rng.d20 = () => queue.shift() ?? 10;
        return state;
    };
    // Halfling Luck: a free reroll, the new result taken even when worse.
    let state = fight({ builtin: "save-reroll", save: null, keep: "new", uses: 1, free: true }, [5, 1]);
    const m = () => state.byId.get("mon");
    castSpell(state, state.byId.get(fighter.id), 0, ["mon"]);
    assert.ok(state.log.some((line) => /Test Luck: critical failure on the reroll/.test(line)), state.log.join("\n"));
    assert.equal(m().cond.frightened, 2);
    assert.equal(m().reactionUsed ?? false, false, "a free action");
    // Reality Twist: a failure stays one; a critical failure becomes a failure.
    state = fight({ builtin: "save-boost", criticalOnly: true }, [16]);
    castSpell(state, state.byId.get(fighter.id), 0, ["mon"]);
    assert.equal(state.log.some((line) => /Test Luck/.test(line)), false, state.log.join("\n"));
    state = fight({ builtin: "save-boost", criticalOnly: true }, [1]);
    castSpell(state, state.byId.get(fighter.id), 0, ["mon"]);
    assert.equal(m().cond.frightened, 1, state.log.join("\n"));
    // Stubborn Resolve: once a fight.
    state = fight({ builtin: "save-boost", uses: 1 }, [5, 5]);
    castSpell(state, state.byId.get(fighter.id), 0, ["mon"]);
    m().reactionUsed = false;
    castSpell(state, state.byId.get(fighter.id), 0, ["mon"]);
    assert.equal(state.log.filter((line) => /Test Luck/.test(line)).length, 1, state.log.join("\n"));
});

test("An ally's +AC that turns a hit aside, its Strike after; Counterattack at a miss from its concealment (2026-10-11, B94)", () => {
    const [fighter] = martialParty(5);
    // A hit by 1 on the guarded goblin: +2 AC from its champion beside it turns it into a miss; Reactive Defense's Strike after.
    const champion = { ...moderateCreature(5, "champ", "Champion"), engagement: 1, hp: { value: 999, max: 999 } };
    assert.equal(addBuiltin(champion, { builtin: "ally-ac-reaction", value: 2, type: "circumstance", within: "reach", strike: "melee" }, "Hammer Block"), true);
    const ward = { ...moderateCreature(5, "ward", "Ward"), engagement: 1, hp: { value: 999, max: 999 } };
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, champion, ward] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    const w = state.byId.get("ward");
    const strike = f.strikes[0];
    // A natural roll that just hits: AC − bonus.
    state.rng.d20 = () => Math.min(19, Math.max(2, armorClass(w) - strike.bonus));
    performStrike(state, f, w, strike);
    assert.ok(state.log.includes("  Champion uses Hammer Block: Ward +2 AC"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /^ {2}Champion .+ → Fighter/.test(line)), state.log.join("\n"));
    assert.equal(state.byId.get("champ").reactionUsed, true);
    // Counterattack: a concealed shae, the attacker's flat check failed.
    const shae = { ...moderateCreature(5, "shae", "Shae"), engagement: 1, hp: { value: 999, max: 999 } };
    addBuiltin(shae, { builtin: "reaction-strike", triggers: ["concealed-miss"], strike: "melee", penalty: 0, disrupts: false }, "Counterattack");
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, shae] }, {}, 1);
    state.log = [];
    state.byId.get("shae").cond.concealed = true;
    state.rng.d20 = () => 2;
    performStrike(state, state.byId.get(fighter.id), state.byId.get("shae"), state.byId.get(fighter.id).strikes[0]);
    assert.ok(state.log.some((line) => /fails the DC 5 flat check/.test(line)), state.log.join("\n"));
    assert.ok(state.log.includes("  Shae uses Counterattack"), state.log.join("\n"));
});

test("Ferocity's kin: half its HP for a Mythic Point, 25 HP once a fight, 1 HP and a Strike after (2026-10-11, B95)", () => {
    const [fighter] = martialParty(5);
    const fight = (plan, extra = {}) => {
        const base = moderateCreature(5, "mon", "Monster");
        const monster = { ...base, engagement: 1, ...extra };
        assert.equal(addBuiltin(monster, { builtin: "ferocity", ...plan }, "Test Ferocity"), true);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monster] }, {}, 1);
        state.log = [];
        return [state, state.byId.get("mon")];
    };
    // Mythic: half its maximum HP, wounded 1, a Mythic Point spent.
    let [state, m] = fight({ hp: "half", wounded: true, mythic: true });
    const points = m.mythicPoints;
    dealDamage(state, m, m.hp.value + 50, { source: state.byId.get(fighter.id) });
    assert.deepEqual([m.hp.value, m.cond.wounded, m.mythicPoints, isActive(m)], [Math.floor(m.hp.max / 2), 1, points - 1, true], state.log.join("\n"));
    // Never Fall: 25 HP, not wounded, once; free.
    [state, m] = fight({ hp: 25, wounded: false, uses: 1, free: true });
    dealDamage(state, m, m.hp.value + 50, { source: state.byId.get(fighter.id) });
    assert.deepEqual([m.hp.value, m.cond.wounded ?? 0, m.reactionUsed ?? false], [Math.min(25, m.hp.max), 0, false]);
    dealDamage(state, m, m.hp.value + 50, { source: state.byId.get(fighter.id) });
    assert.equal(isActive(m), false, "only once");
    // Indomitable Beast: 1 HP, then its stinger Strike.
    [state, m] = fight({ hp: 1, wounded: false, uses: 1, strike: "stinger" }, { strikes: [...moderateCreature(5, "mon", "Monster").strikes, { ...moderateCreature(5, "mon", "Monster").strikes[0], name: "Stinger" }] });
    dealDamage(state, m, m.hp.value + 50, { source: state.byId.get(fighter.id) });
    assert.equal(m.hp.value, 1);
    assert.ok(state.log.some((line) => /^ {2}Monster Stinger → Fighter/.test(line)), state.log.join("\n"));
});

test("A reaction Strike that disrupts a move only on a critical hit (2026-10-11, B96)", () => {
    const [fighter] = martialParty(5);
    const fight = (die) => {
        const grick = { ...moderateCreature(5, "grick", "Grick"), engagement: 1, hp: { value: 999, max: 999 } };
        grick.strikes = [...grick.strikes, { ...grick.strikes[0], name: "Tentacle", bonus: 30 }];
        addBuiltin(grick, { builtin: "reaction-strike", triggers: ["move"], strike: "tentacle", penalty: 0, disrupts: "critical" }, "Gripping Tentacle");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, grick] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        return state;
    };
    // A hit that isn't critical (a natural 1 one step worse than the +30 would make): the move goes on.
    let state = fight(1);
    let disrupted = provokeFor(state, state.byId.get(fighter.id), "move");
    assert.ok(state.log.includes("  Grick uses Gripping Tentacle"), state.log.join("\n"));
    assert.equal(disrupted, false, state.log.join("\n"));
    // A critical hit: disrupted.
    state = fight(15);
    disrupted = provokeFor(state, state.byId.get(fighter.id), "move");
    assert.equal(disrupted, true, state.log.join("\n"));
});

test("Its own hit on a creature with a condition, on its turn, with a kind of weapon, and extra damage (2026-10-11, B97)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const fortSave = (name, trigger) => ({
        modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null }, trigger: { event: "own-strike", reaction: true, on: ["success", "criticalSuccess"], strike: null, ...trigger },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "paralyzed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "paralyzed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } }] } } }
    });
    const [fighter] = martialParty(5);
    const setup = (plan) => {
        const monster = { ...moderateCreature(5, "mon", "Golem"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry(plan.source.name, plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monster] }, {}, 4);
        state.log = [];
        return { state, f: state.byId.get("fighter"), m: state.byId.get("mon") };
    };
    // "Hits a Slowed creature": only a slowed one.
    const paralysis = fortSave("Impose Paralysis", { condition: "slowed" });
    let { state, f, m } = setup(paralysis);
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(!f.cond.paralyzed && !m.reactionUsed, state.log.join("\n"));
    ({ state, f, m } = setup(paralysis));
    f.cond.slowed = 1;
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(f.cond.paralyzed && m.reactionUsed, state.log.join("\n"));
    // "Hits an off-guard creature": off-guard as the attack found it (prone here).
    const debilitate = fortSave("Master Strike", { condition: "off-guard" });
    ({ state, f, m } = setup(debilitate));
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(!f.cond.paralyzed, "not when it isn't off-guard");
    ({ state, f, m } = setup(debilitate));
    f.cond.prone = true;
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(f.cond.paralyzed, state.log.join("\n"));
    // "… on its turn": not as a reaction Strike on another's turn.
    const pyrebite = fortSave("Pyrebite", { ownTurn: true });
    ({ state, f, m } = setup(pyrebite));
    state.acting = f.id;
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(!f.cond.paralyzed, "not on another's turn");
    ({ state, f, m } = setup(pyrebite));
    state.acting = m.id;
    performStrike(state, m, f, { ...m.strikes[0], melee: true, bonus: 200 });
    assert.ok(f.cond.paralyzed, state.log.join("\n"));
    // "With a melee Strike": any melee Strike, not a ranged one.
    const melee = fortSave("Intimidating Strike", { weapon: "melee" });
    ({ state, f, m } = setup(melee));
    performStrike(state, m, f, { ...m.strikes[0], name: "Shortbow", melee: false, bonus: 200 });
    assert.ok(!f.cond.paralyzed, "not a ranged Strike");
    ({ state, f, m } = setup(melee));
    performStrike(state, m, f, { ...m.strikes[0], name: "Glaive", melee: true, bonus: 200 });
    assert.ok(f.cond.paralyzed, state.log.join("\n"));
    // Extra damage on the creature it hit, no roll ("dealing an additional 1d8 sonic damage to the creature struck").
    const reverb = { ...fortSave("Reverb", { strike: "antler" }), resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "8[sonic]", type: null, category: null }] }, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    ({ state, f, m } = setup(reverb));
    performStrike(state, m, f, { ...m.strikes[0], name: "Antler", melee: true, bonus: 200 });
    assert.match(state.log.join("\n"), /Golem reacts with Reverb/, state.log.join("\n"));
    assert.match(state.log.join("\n"), /8 sonic|sonic.*8/, state.log.join("\n"));
});

test("Charges: off-guard only to a creature that hasn't seen it, a recharge, a bonus to damage (2026-10-11, B98)", () => {
    const [fighter, archer] = martialParty(5);
    const porcupine = { ...moderateCreature(5, "porc", "Porcupine") };
    addBuiltin(porcupine, { builtin: "charge", actions: 2, strides: 2, strike: null, offGuard: "first" }, "Test Rush");
    addBuiltin(porcupine, { builtin: "charge", actions: 2, strides: 2, strike: null, recharge: "2" }, "Test Leap");
    addBuiltin(porcupine, { builtin: "charge", actions: 2, strides: 2, strike: null, damageBonus: 4 }, "Test Lance");
    assert.deepEqual(porcupine.charges.map((charge) => [charge.offGuard, charge.recharge, charge.damageBonus]), [["first", undefined, undefined], [undefined, "2", undefined], [undefined, undefined, 4]]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 0 }, { ...archer, engagement: 0 }, { ...porcupine, engagement: 0 }] }, {}, 1);
    state.log = [];
    const p = state.byId.get("porc");
    const strike = p.strikes.find((entry) => entry.melee);
    // Off-guard (+2) to a creature that hasn't seen it; not again to that one, still to another.
    assert.equal(chargeStrike(strike, chargeOn(p, p.charges[0], fighter.id)).bonus, strike.bonus + 2);
    performAction(state, p, { type: "charge", ability: 0, targetId: fighter.id, strikeIndex: p.strikes.indexOf(strike), actions: 2 });
    assert.ok(state.log.includes("  Porcupine uses Test Rush"), state.log.join("\n"));
    assert.equal(chargeStrike(strike, chargeOn(p, p.charges[0], fighter.id)).bonus, strike.bonus);
    assert.equal(chargeStrike(strike, chargeOn(p, p.charges[0], archer.id)).bonus, strike.bonus + 2);
    // Its recharge: not again until that many rounds have passed.
    performAction(state, p, { type: "charge", ability: 1, targetId: archer.id, strikeIndex: p.strikes.indexOf(strike), actions: 2 });
    assert.equal(p.chargeUntil.get("Test Leap"), state.round + 2);
    // +4 to its damage.
    assert.equal(chargeStrike(strike, p.charges[2]).damage[0].bonus, (strike.damage[0].bonus ?? 0) + 4);
});

test("A reaction's resistance against the damage that sets it off (2026-10-11, B99)", () => {
    const [fighter] = martialParty(5);
    const fight = (plan, extra = {}) => {
        const dragon = { ...moderateCreature(5, "drg", "Dragon"), engagement: 1, hp: { value: 200, max: 200 }, ...extra };
        addBuiltin(dragon, plan, "Test Resist");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
        state.log = [];
        return { state, d: state.byId.get("drg"), f: state.byId.get(fighter.id) };
    };
    const fire = (amount) => [{ type: "fire", amount, persistent: false, precision: false }];
    const slash = (amount) => [{ type: "slashing", amount, persistent: false, precision: false }];
    // Fire resistance 20 against fire damage, and until the end of its next turn; not against slashing.
    let { state, d, f } = fight({ builtin: "resist-damage", value: 20, on: ["fire"], types: ["fire"], lasts: 1 });
    assert.equal(applyDamage(state, d, slash(15), { source: f }), 15);
    assert.ok(!d.reactionUsed, "slashing doesn't set it off");
    assert.equal(applyDamage(state, d, fire(25), { source: f }), 5, state.log.join("\n"));
    assert.ok(d.reactionUsed && state.log.includes("  Dragon uses Test Resist: resistance 20 to fire against it"), state.log.join("\n"));
    assert.equal(applyDamage(state, d, fire(25), { source: f }), 5, "still resisted while it lasts");
    assert.equal(applyDamage(state, d, slash(10), { source: f }), 10);
    // Resistance to all the triggering damage, an attack's only, once a day, and its AC lower afterwards.
    ({ state, d, f } = fight({ builtin: "resist-damage", value: 15, on: ["piercing", "slashing"], types: null, attack: true, acPenalty: 2, uses: 1 }));
    const ac = armorClass(d);
    assert.equal(applyDamage(state, d, slash(12), { source: f }), 12, "not a spell's");
    // (Off each damage type: 20 − 15 slashing, 6 − 15 fire.)
    assert.equal(applyDamage(state, d, [...slash(20), ...fire(6)], { source: f, physical: true }), 5, state.log.join("\n"));
    assert.equal(armorClass(d), ac - 2);
    d.reactionUsed = false;
    assert.equal(applyDamage(state, d, slash(20), { source: f, physical: true }), 20, "its one use spent");
});

test("Demoralize as the fight starts or its turn begins, at its nearest foe (2026-10-11, B100)", { skip }, async () => {
    const { basic } = await packAbilities();
    const party = martialParty(5);
    const cry = { ...structuredClone(basic.demoralize), targeting: { target: "1 creature", range: "30 feet", area: null } };
    // Battle Cry: as initiative is rolled, at a foe in its Melee.
    const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, spells: [entry("Battle Cry", { ...cry, trigger: { event: "initiative", reaction: true, free: true } })] };
    const started = simulate({ combatants: [{ ...party[0], engagement: 1 }, dragon] }, { maxRounds: 1 }, 2, { log: true });
    assert.match(started.log.join("\n"), /Dragon uses Battle Cry/);
    assert.match(started.log.join("\n"), new RegExp(`Dragon casts Battle Cry at ${party[0].name}`));
    // Stern Glare: as its turn begins; no foe near enough, not used.
    const glare = { ...moderateCreature(5, "glare", "Director"), engagement: 1, spells: [entry("Stern Glare", { ...cry, trigger: { event: "own-turn-start", reaction: true, free: true } })] };
    const state = createFightState({ combatants: [{ ...party[0], engagement: 1 }, glare] }, {}, 2);
    state.log = [];
    ownTurnStart(state, state.byId.get("glare"));
    assert.ok(state.log.includes(`  Director casts Stern Glare at ${party[0].name}`), state.log.join("\n"));
    const alone = createFightState({ combatants: [{ ...party[0], engagement: 0 }, { ...glare, engagement: 0 }] }, {}, 2);
    alone.log = [];
    for (const c of alone.list) Object.assign(c, { band: "far", meleeId: null });
    alone.byId.get("glare").band = "near";
    ownTurnStart(alone, alone.byId.get("glare"));
    assert.ok(!alone.log.some((line) => /Stern Glare/.test(line)), alone.log.join("\n"));
});

test("Speed Surge's kin without a daily count, with a recharge; Shoo!'s push of the creature that hurt it (2026-10-11, B101)", () => {
    const [fighter] = martialParty(5);
    // Once a round (no count), or a recharge.
    const chameleon = { ...moderateCreature(5, "cham", "Chameleon") };
    addBuiltin(chameleon, { builtin: "speed-surge", actions: 1, uses: null, oncePerRound: true }, "Flickering Dash");
    assert.equal(chameleon.speedSurge.uses, Infinity);
    const tenome = { ...moderateCreature(5, "ten", "Tenome") };
    addBuiltin(tenome, { builtin: "speed-surge", actions: 1, uses: null, recharge: "2" }, "Burst of Speed");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 0 }, { ...tenome, engagement: 0 }] }, {}, 1);
    state.log = [];
    const t = state.byId.get("ten");
    performAction(state, t, { type: "stride", move: { kind: "engage", targetId: fighter.id }, surge: true });
    assert.equal(t.surgeUntil, state.round + 2, state.log.join("\n"));
    // Shoo!: a foe that damages it within 15 feet is pushed 45 feet away, out of its Melee.
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const shoo = { modelVersion: 13, source: { name: "Shoo!" }, rank: 1, traits: ["teleportation"], activation: { time: "reaction", traits: [] }, targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "hit-by", reaction: true, melee: false, within: 15 },
        resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [], forcedMovement: { kind: "push", distance: 45, upTo: true, optional: false, direction: "away" } }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    const dragon = { ...moderateCreature(5, "drg", "Dragon"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Shoo!", shoo)] };
    const fight = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    fight.log = [];
    const f = fight.byId.get(fighter.id);
    const d = fight.byId.get("drg");
    performStrike(fight, f, d, { ...f.strikes[0], melee: true, bonus: 200 });
    assert.ok(d.reactionUsed && !sameMelee(f, d), fight.log.join("\n"));
});

test("A condition that grows with each later failure, to its maximum (2026-10-11, B102)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const caress = { modelVersion: 13, source: { name: "Test Caress" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "1 creature", range: "touch", area: null }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stupefied", value: 1, duration: null, stack: { by: 1, max: 3 } }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stupefied", value: 1, duration: null, stack: { by: 1, max: 3 } }] } } } };
    const [fighter] = martialParty(5);
    const lamia = { ...moderateCreature(5, "lamia", "Lamia"), engagement: 1, spells: [entry("Test Caress", caress)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, lamia] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    const l = state.byId.get("lamia");
    castSpell(state, l, 0, [f.id]);
    assert.equal(f.cond.stupefied, 1, state.log.join("\n"));
    castSpell(state, l, 0, [f.id]);
    assert.equal(f.cond.stupefied, 2, "one more");
    castSpell(state, l, 0, [f.id]);
    castSpell(state, l, 0, [f.id]);
    assert.equal(f.cond.stupefied, 3, "to its maximum");
});

test("A worse condition for a creature that already has the first: slowed, then petrified (2026-10-11, B103)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const slowed = { kind: "condition", slug: "slowed", value: 1, duration: null, escalate: { if: "slowed", slug: "petrified", value: null, duration: null } };
    const gaze = { modelVersion: 13, source: { name: "Test Gaze" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [slowed] }, criticalFailure: { damage: { ...none }, effects: [slowed] } } } };
    const [fighter] = martialParty(5);
    const basilisk = { ...moderateCreature(5, "bas", "Basilisk"), engagement: 1, spells: [entry("Test Gaze", gaze)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, basilisk] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    castSpell(state, state.byId.get("bas"), 0, [f.id]);
    assert.ok(f.cond.slowed === 1 && !f.cond.paralyzed, state.log.join("\n"));
    castSpell(state, state.byId.get("bas"), 0, [f.id]);
    assert.ok(f.cond.paralyzed && state.log.includes(`  ${f.name} is petrified`), state.log.join("\n"));
});

test("Two Strikes that both hit the same creature: what that brings (2026-10-11, B104)", () => {
    const [fighter] = martialParty(5);
    const oni = { ...moderateCreature(5, "oni", "Oni"), engagement: 1 };
    addBuiltin(oni, { builtin: "multi-strike", actions: 1, strikes: [null, null], sameTarget: true, bothHit: { conditions: [{ slug: "slowed", value: 1, rounds: 1 }], damage: ["1d8[persistent,bleed]"] } }, "Test Combo");
    assert.deepEqual(oni.multiStrikes[0].bothHit.conditions, [{ slug: "slowed", value: 1, rounds: 1 }]);
    const fight = (die) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, oni] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        const o = state.byId.get("oni");
        o.strikes = o.strikes.map((strike) => ({ ...strike, bonus: die === 20 ? 100 : -100 }));
        performAction(state, o, { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 1 });
        return { state, f: state.byId.get(fighter.id) };
    };
    let { state, f } = fight(20);
    assert.ok(f.cond.slowed === 1 && f.persistent.some((entry) => entry.type === "bleed"), state.log.join("\n"));
    assert.ok(state.log.includes(`  Both Strikes hit ${f.name}`));
    ({ state, f } = fight(1));
    assert.ok(!f.cond.slowed, "not when they miss");
});

test("A Strike activity only at an enemy with one of its allies beside it (2026-10-11, B104)", () => {
    const [fighter, cleric] = martialParty(5);
    const smite = { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: "ally-adjacent", oncePerFight: false, onHit: { conditions: [{ slug: "frightened", value: 2, duration: null }], critical: null, push: null, damage: ["2d8[mental]"], save: null, size: null } };
    const plan = (alone) => {
        const rekhep = { ...moderateCreature(5, "rek", "Rekhep"), engagement: 1 };
        addBuiltin(rekhep, smite, "Test Smite");
        const ally = { ...moderateCreature(5, "ally", "Ally"), engagement: alone ? 0 : 1 };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, rekhep, ally] }, {}, 1);
        if (alone) Object.assign(state.byId.get("ally"), { band: "far", meleeId: null });
        state.byId.get("rek").actionsLeft = 3;
        const { options } = scoreOptions(state, state.byId.get("rek"));
        return options.some((option) => /activity/i.test(option.action?.type ?? ""));
    };
    assert.equal(plan(false), true, "with an ally beside the target");
    assert.equal(plan(true), false, "not with no ally beside it");
});

test("A reaction making an Escape from it harder (2026-10-11, B105)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const attempt = (die, guarded, reacted = false) => {
        const zinba = { ...moderateCreature(5, "zin", "Zinba"), engagement: 1, hp: { value: 999, max: 999 } };
        if (guarded) addBuiltin(zinba, { builtin: "escape-guard", value: 2 }, "Test Coils");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Escape", basic.escape, "basic")] }, zinba] }, {}, 1);
        state.log = [];
        const f = state.byId.get(fighter.id);
        const z = state.byId.get("zin");
        applyCondition(state, f, "grabbed", null, null, z);
        z.reactionUsed = reacted;
        state.rng.d20 = () => die;
        castSpell(state, f, 0, ["zin"]);
        return { state, f, z };
    };
    // A roll that escapes the plain DC, but not the DC 2 higher.
    const die = [...Array(20).keys()].map((index) => index + 1).find((value) => !attempt(value, false).f.cond.grabbed && attempt(value, true).f.cond.grabbed);
    assert.ok(die, "some roll escapes only without the reaction");
    const { state, f, z } = attempt(die, true);
    assert.ok(state.log.includes("  Zinba uses Test Coils: the Escape DC is 2 higher"), state.log.join("\n"));
    assert.equal(z.reactionUsed, true);
    assert.equal(z.escapeGuardActive, undefined, "only for that check");
    assert.ok(f.cond.grabbed);
    // Its reaction already spent: the plain DC.
    assert.equal(attempt(die, true, true).f.cond.grabbed ?? false, false);
});

test("A Strike activity only at a foe it hit earlier this turn (2026-10-11, B105)", () => {
    const [fighter] = martialParty(5);
    const stunning = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: "hit-earlier", oncePerFight: false, onHit: { conditions: [{ slug: "stunned", value: 1, duration: null }], critical: null, push: null, damage: [], save: null, size: null } };
    const plan = (attacks) => {
        const emissary = { ...moderateCreature(5, "emi", "Emissary"), engagement: 1 };
        addBuiltin(emissary, stunning, "Test Stunning");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, emissary] }, {}, 1);
        const e = state.byId.get("emi");
        e.actionsLeft = 2;
        e.turnAttacks = attacks;
        const { options } = scoreOptions(state, e);
        return options.some((option) => /activity/i.test(option.action?.type ?? ""));
    };
    assert.equal(plan([{ strike: "Fist", targetId: fighter.id, hit: true }]), true, "after a hit on that foe");
    assert.equal(plan([{ strike: "Fist", targetId: fighter.id, hit: false }]), false, "not after a miss");
    assert.equal(plan([]), false, "not before any Strike");
});

test("A second Strike only after a first that hits; never one that needs berserk (2026-10-11, B106)", () => {
    const [fighter] = martialParty(5);
    const bosun = { ...moderateCreature(5, "bos", "Bosun"), engagement: 1 };
    addBuiltin(bosun, { builtin: "multi-strike", actions: 2, strikes: [null, null], sameTarget: true, sameMap: true, ifFirstHits: true, instead: "move the target 5 feet within the pike's reach" }, "Test Pike");
    assert.equal(bosun.multiStrikes[0].ifFirstHits, true);
    const fight = (die) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, bosun] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        performAction(state, state.byId.get("bos"), { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 2 });
        return state.log.filter((line) => /Bosun .* → /.test(line)).length;
    };
    assert.equal(fight(20), 2, "both after a hit");
    assert.equal(fight(1), 1, "only the first after a miss");
    // Berserk Slam: a state the engine doesn't play.
    const slam = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: -1, damageBonus: 0, offGuard: false, requires: "berserk", oncePerFight: false, onHit: { conditions: [{ slug: "prone", value: null, duration: null }], critical: null, push: null, damage: ["1d6[strike]"], save: null, size: null } };
    const golem = { ...moderateCreature(5, "gol", "Golem"), engagement: 1 };
    addBuiltin(golem, slam, "Test Slam");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, golem] }, {}, 1);
    state.byId.get("gol").actionsLeft = 3;
    assert.equal(scoreOptions(state, state.byId.get("gol")).options.some((option) => /activity/i.test(option.action?.type ?? "")), false);
});

test("An effect for its allies as its own Strike critically hits (2026-10-11, B106)", () => {
    const [fighter] = martialParty(5);
    const uuid = "Compendium.pf2e.bestiary-effects.Item.testrally000001";
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const rally = { modelVersion: 13, source: { name: "Test Rally" }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "up to 6 creatures", range: null, area: null }, trigger: { event: "own-strike", reaction: true, on: ["criticalSuccess"], strike: null },
        resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid, label: "Effect: Test Rally", recipients: "allies-in-area" }] } };
    const model = { name: "Effect: Test Rally", rounds: 1, modifiers: [{ on: "attack", type: "circumstance", value: 1 }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
    const leader = { ...moderateCreature(5, "lead", "Leader"), engagement: 1, spells: [{ ...entry("Test Rally", rally), effects: { [uuid]: model } }] };
    const ally = { ...moderateCreature(5, "ally", "Ally"), engagement: 1 };
    const fight = (die) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, leader, ally] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        const l = state.byId.get("lead");
        performStrike(state, l, state.byId.get(fighter.id), l.strikes[0]);
        return { state, l, a: state.byId.get("ally") };
    };
    let { state, l, a } = fight(20);
    assert.ok(state.log.includes("  Leader reacts with Test Rally"), state.log.join("\n"));
    assert.ok((a.effects ?? []).some((effect) => effect.model.name === "Effect: Test Rally"), state.log.join("\n"));
    assert.equal(l.reactionUsed, true);
    ({ state, a } = fight(15));
    assert.equal((a.effects ?? []).length, 0, "not on a plain hit");
    // Curl Up: its own effect as it takes damage.
    const curl = { ...rally, source: { name: "Test Curl" }, targeting: { target: null, range: null, area: null }, trigger: { event: "damaged", reaction: true }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid, label: "Test Curl", recipients: "self", selfEffect: true }] } };
    const trilobite = { ...moderateCreature(5, "tri", "Trilobite"), engagement: 1, spells: [{ ...entry("Test Curl", curl), effects: { [uuid]: { ...model, name: "Test Curl", modifiers: [{ on: "ac", type: "circumstance", value: 2 }] } } }] };
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, trilobite] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("tri"), f.strikes[0]);
    assert.ok((state.byId.get("tri").effects ?? []).some((effect) => effect.model.name === "Test Curl"), state.log.join("\n"));
});

test("More damage on a creature already Prone; four Strikes at their own penalties, before any other attack (2026-10-11, B107)", () => {
    const [fighter] = martialParty(5);
    const stomp = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, proneDamage: ["2d6[slashing]"] } };
    const hit = (prone) => {
        const cap = { ...moderateCreature(5, "cap", "Cap"), engagement: 1 };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, cap] }, {}, 1);
        state.log = [];
        const f = state.byId.get(fighter.id);
        if (prone) f.cond.prone = true;
        const before = f.hp.value;
        applyStrikeRider(state, state.byId.get("cap"), f, stomp, false, { damage: [{ type: "bludgeoning" }] });
        return before - f.hp.value;
    };
    assert.ok(hit(true) > 0, "on a Prone creature");
    assert.equal(hit(false), 0, "not on one standing");
    // Eviscerate: the penalties per Strike, and only as its first attack this turn.
    const rivka = { ...moderateCreature(5, "riv", "Rivka"), engagement: 1 };
    addBuiltin(rivka, { builtin: "multi-strike", actions: 2, strikes: [null, null, null, null], sameTarget: true, sameMap: true, penalties: [0, 4, 4, 8], countsAs: 4, requires: "first-attack" }, "Test Eviscerate");
    assert.deepEqual(rivka.multiStrikes[0].penalties, [0, 4, 4, 8]);
    const plans = (attacks) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, rivka] }, {}, 1);
        const r = state.byId.get("riv");
        r.actionsLeft = 3;
        r.attacksThisTurn = attacks;
        return scoreOptions(state, r).options.some((option) => option.action?.type === "multiStrike");
    };
    assert.equal(plans(0), true);
    assert.equal(plans(1), false, "not after an attack");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, rivka] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 10;
    performAction(state, state.byId.get("riv"), { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 2 });
    const totals = state.log.filter((line) => /Rivka .* → .*: \d+ vs AC/.test(line)).map((line) => Number(/: (\d+) vs AC/.exec(line)[1]));
    assert.deepEqual(totals.map((total) => totals[0] - total), [0, 4, 4, 8], state.log.join("\n"));
    assert.equal(state.byId.get("riv").attacksThisTurn, 4);
});

test("A mythic reroll of its failed save; a Stride and then two Strikes (2026-10-11, B108)", () => {
    const [fighter] = martialParty(5);
    const save = { name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, plan: { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: false, against: { dc: "fixed", value: 30 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } } };
    const elder = { ...moderateCreature(5, "eld", "Elder"), engagement: 1 };
    addBuiltin(elder, { builtin: "save-reroll", save: null, keep: "new", free: true, mythic: true }, "Test Reroll");
    assert.equal(elder.mythicPoints, 3);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [save] }, elder] }, {}, 1);
    state.log = [];
    const queue = [5, 19, 5, 19, 5, 19, 5, 5];
    state.rng.d20 = () => queue.shift() ?? 5;
    const e = state.byId.get("eld");
    for (let n = 0; n < 4; n++) castSpell(state, state.byId.get(fighter.id), 0, ["eld"]);
    assert.equal(state.log.filter((line) => /Test Reroll/.test(line)).length, 3, state.log.join("\n"));
    assert.equal(e.mythicPoints, 0);
    // Chase Prey: a Stride to a creature not yet in reach, then the Strikes.
    const troll = { ...moderateCreature(5, "trl", "Troll"), engagement: 0 };
    addBuiltin(troll, { builtin: "multi-strike", actions: 2, strikes: [null, null], sameTarget: true, strides: 1 }, "Test Chase");
    assert.equal(troll.multiStrikes[0].strides, 1);
    const fight = createFightState({ combatants: [{ ...fighter, engagement: 1 }, troll] }, {}, 1);
    const t = fight.byId.get("trl");
    Object.assign(t, { band: "near", meleeId: null });
    t.actionsLeft = 3;
    assert.ok(scoreOptions(fight, t).options.some((option) => option.action?.type === "multiStrike"), "planned from nearby");
    fight.log = [];
    performAction(fight, t, { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 2 });
    assert.ok(sameMelee(t, fight.byId.get(fighter.id)), fight.log.join("\n"));
    assert.equal(fight.log.filter((line) => /Troll .* → /.test(line)).length, 2, fight.log.join("\n"));
});

test("A Stride into a Melee, then a Strike at each creature there (2026-10-11, B109)", () => {
    const [fighter, cleric] = martialParty(5);
    const beast = { ...moderateCreature(5, "kok", "Kokogiak"), engagement: 0 };
    addBuiltin(beast, { builtin: "multi-strike", actions: 3, strikes: [null], each: true, max: 4, strides: 1, sameMap: true }, "Test Rush");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, { ...cleric, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, beast] }, {}, 1);
    const k = state.byId.get("kok");
    const f = state.byId.get(fighter.id);
    const c = state.byId.get(cleric.id);
    engage(state, f, c);
    Object.assign(k, { band: "near", meleeId: null });
    k.actionsLeft = 3;
    assert.ok(scoreOptions(state, k).options.some((option) => option.action?.type === "multiStrike"), "planned from nearby");
    state.log = [];
    performAction(state, k, { type: "multiStrike", ability: 0, targetId: f.id, actions: 3 });
    assert.ok(sameMelee(k, f), state.log.join("\n"));
    assert.equal(state.log.filter((line) => /Kokogiak .* → /.test(line)).length, 2, state.log.join("\n"));
});

test("Both Strikes hit: a basic action at the creature (2026-10-11, B110)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const captain = { ...moderateCreature(5, "cap", "Captain"), engagement: 1, spells: [entry("Disarm", basic.disarm, "basic")] };
    addBuiltin(captain, { builtin: "multi-strike", actions: 2, strikes: [null, null], sameTarget: true, sameMap: true, bothHit: { conditions: [], damage: [], follow: "disarm" } }, "Test Dual");
    assert.equal(captain.multiStrikes[0].bothHit.follow, "disarm");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, captain] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    const c = state.byId.get("cap");
    c.strikes = c.strikes.map((strike) => ({ ...strike, bonus: 100 }));
    performAction(state, c, { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 2 });
    assert.ok(state.log.some((line) => /Captain (?:casts|uses) Disarm/.test(line)), state.log.join("\n"));
});

test("A bonus to its own save as it comes, against a spell, its reaction once (2026-10-11, B110)", () => {
    const [fighter] = martialParty(5);
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const blast = (kind) => ({ name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, ...(kind ? { kind } : {}), plan: { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 30 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } } });
    const fight = (kind) => {
        const padli = { ...moderateCreature(5, "pad", "Padli"), engagement: 1 };
        addBuiltin(padli, { builtin: "save-bonus-reaction", value: 2, against: "spell" }, "Test Ward");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [blast(kind)] }, padli] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => 10;
        castSpell(state, state.byId.get(fighter.id), 0, ["pad"]);
        return { state, p: state.byId.get("pad") };
    };
    let { state, p } = fight(null);
    assert.ok(state.log.includes("  Padli uses Test Ward: +2 to the save"), state.log.join("\n"));
    assert.equal(p.reactionUsed, true);
    ({ state, p } = fight("ability"));
    assert.equal(p.reactionUsed ?? false, false, "not against a monster's ability");
});

test("A maneuver back in place of a Strike: a Disarm as a Strike against it critically fails, a Shove as a melee Strike hits it (2026-10-11, B111)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const fight = (plan, die) => {
        const tree = { ...moderateCreature(5, "tre", "Tree"), engagement: 1, hp: { value: 999, max: 999, temp: 0 }, spells: [entry("Disarm", basic.disarm, "basic"), entry("Shove", basic.shove, "basic")] };
        addBuiltin(tree, plan, "Test Answer");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, tree] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        const f = state.byId.get(fighter.id);
        state.byId.get("tre").attacksThisTurn = 2;
        performStrike(state, f, state.byId.get("tre"), f.strikes[0]);
        return { state, t: state.byId.get("tre") };
    };
    let { state, t } = fight({ builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, skill: "disarm", penalty: 2, disrupts: false }, 1);
    assert.ok(state.log.includes("  Tree uses Test Answer"), state.log.join("\n"));
    assert.equal(t.reactionUsed, true);
    assert.equal(t.attacksThisTurn, 2, "its own count kept");
    ({ state } = fight({ builtin: "reaction-strike", triggers: ["hit"], strike: null, skill: "shove", penalty: 0, disrupts: false }, 15));
    assert.ok(state.log.includes("  Tree uses Test Answer"), state.log.join("\n"));
});

test("Two Strikes at full bonus; a claw's damage again when both land (2026-10-11, B112)", () => {
    const [fighter] = martialParty(5);
    const sphinx = { ...moderateCreature(5, "sph", "Sphinx"), engagement: 1 };
    addBuiltin(sphinx, { builtin: "multi-strike", actions: 3, strikes: [null, null], sameTarget: true, noMap: true, bothHit: { conditions: [], damage: [], strikeDamage: "claw" } }, "Test Rake");
    assert.equal(sphinx.multiStrikes[0].noMap, true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, sphinx] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 10;
    const s = state.byId.get("sph");
    s.strikes = s.strikes.map((strike) => ({ ...strike, name: "Claw", bonus: 100 }));
    s.attacksThisTurn = 1;
    performAction(state, s, { type: "multiStrike", ability: 0, targetId: fighter.id, actions: 3 });
    const totals = state.log.filter((line) => /Sphinx .* → .*: \d+ vs AC/.test(line)).map((line) => Number(/: (\d+) vs AC/.exec(line)[1]));
    assert.equal(totals.length, 2, state.log.join("\n"));
    assert.equal(totals[0], totals[1], "both at the same bonus");
    assert.ok(state.log.includes(`  Both Strikes hit ${fighter.name}`), state.log.join("\n"));
    assert.ok(state.log.filter((line) => new RegExp(`  ${fighter.name} takes \\d+ more`).test(line)).length >= 1, state.log.join("\n"));
    assert.equal(s.attacksThisTurn, 3);
});

test("Two Strikes only at an Off-Guard or Immobilized creature; a requirement it doesn't know, never (2026-10-11, B113)", () => {
    const [fighter] = martialParty(5);
    const plan = (requires, setUp) => {
        const zecui = { ...moderateCreature(5, "zec", "Zecui"), engagement: 1 };
        addBuiltin(zecui, { builtin: "multi-strike", actions: 1, strikes: [null, null], sameMap: true, sameTarget: true, requires }, "Test Stab");
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, zecui] }, {}, 1);
        setUp?.(state.byId.get(fighter.id));
        const z = state.byId.get("zec");
        z.actionsLeft = 3;
        return scoreOptions(state, z).options.some((option) => option.action?.type === "multiStrike");
    };
    assert.equal(plan("off-guard"), false, "not at a creature on guard");
    assert.equal(plan("off-guard", (f) => { f.cond.offGuard = true; }), true);
    assert.equal(plan("off-guard", (f) => { f.cond.immobilized = true; }), true);
    assert.equal(plan("uncontrollable"), false);
});

test("A Strike at a creature one of its allies just hit in melee (2026-10-11, B114)", () => {
    const [fighter] = martialParty(5);
    const thug = { ...moderateCreature(5, "thg", "Thug"), engagement: 1 };
    const rogue = { ...moderateCreature(5, "rog", "Rogue"), engagement: 1 };
    addBuiltin(rogue, { builtin: "reaction-strike", triggers: ["ally-hit"], strike: null, penalty: 0, disrupts: false }, "Test Backstab");
    const fight = (die) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, thug, rogue] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        const t = state.byId.get("thg");
        performStrike(state, t, state.byId.get(fighter.id), t.strikes[0]);
        return { state, r: state.byId.get("rog") };
    };
    let { state, r } = fight(19);
    assert.ok(state.log.includes("  Rogue uses Test Backstab"), state.log.join("\n"));
    assert.equal(r.reactionUsed, true);
    ({ state, r } = fight(1));
    assert.equal(r.reactionUsed ?? false, false, "not after a miss");
});

test("A Strike activity's \"ranged Strike\": its ranged Strike (2026-10-11, B115)", () => {
    const c = { strikes: [{ name: "Fist", melee: true }, { name: "Crossbow", melee: false }] };
    assert.equal(strikeNamed(c, "ranged"), 1);
    assert.equal(strikeNamed({ strikes: [{ name: "Fist", melee: true }] }, "ranged"), -1);
});

test("A reaction that moves it off: a miss on it, or a foe coming beside it (2026-10-11, B116)", () => {
    const [fighter] = martialParty(5);
    const beetle = { ...moderateCreature(5, "btl", "Beetle"), engagement: 1 };
    addBuiltin(beetle, { builtin: "withdraw", on: "missed", melee: true, move: "Step", safe: true }, "Test Skitter");
    const fight = (die, { acting = true } = {}) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, beetle] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => die;
        const f = state.byId.get(fighter.id);
        if (acting) [state.acting, f.actionsLeft] = [f.id, 2];
        performStrike(state, f, state.byId.get("btl"), f.strikes.find((strike) => strike.melee));
        return { state, b: state.byId.get("btl"), f };
    };
    let { state, b, f } = fight(2);
    assert.ok(state.log.includes("  Beetle uses Test Skitter"), state.log.join("\n"));
    assert.equal(sameMelee(b, f), false);
    assert.equal(b.reactionUsed, true);
    ({ b, f } = fight(19));
    assert.equal(sameMelee(b, f), true, "not after a hit");
    ({ b, f } = fight(2, { acting: false }));
    assert.equal(sameMelee(b, f), true, "not when the foe has nothing left to spend this turn");

    // A foe ending its move beside it.
    const sprite = { ...moderateCreature(5, "spr", "Sprite"), engagement: 0 };
    addBuiltin(sprite, { builtin: "withdraw", on: "approach", enters: true, move: "Step", safe: true }, "Test Scurry");
    state = createFightState({ combatants: [{ ...fighter, engagement: 0 }, sprite] }, {}, 1);
    state.log = [];
    f = state.byId.get(fighter.id);
    [state.acting, f.actionsLeft] = [f.id, 2];
    stride(state, f, { kind: "engage", targetId: "spr" });
    assert.ok(state.log.includes("  Sprite uses Test Scurry"), state.log.join("\n"));
    assert.equal(sameMelee(state.byId.get("spr"), f), false);
});

test("A reaction that follows a foe moving away: No Escape (2026-10-11, B117)", () => {
    const [fighter] = martialParty(5);
    const guard = { ...moderateCreature(5, "grd", "Guard"), engagement: 1, speed: 25 };
    addBuiltin(guard, { builtin: "follow", move: "Stride" }, "Test No Escape");
    const fight = (move, { speed = 25 } = {}) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, speed }, guard] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => 2;
        const f = state.byId.get(fighter.id);
        if (move === "step") step(state, f);
        else stride(state, f, { kind: "toNear" });
        return { state, g: state.byId.get("grd"), f };
    };
    let { state, g, f } = fight("stride");
    assert.ok(state.log.includes("  Guard uses Test No Escape"), state.log.join("\n"));
    assert.equal(sameMelee(g, f), true);
    assert.equal(g.reactionUsed, true);
    ({ state, g, f } = fight("step"));
    assert.equal(sameMelee(g, f), true, "a Step too");
    ({ g, f } = fight("stride", { speed: 40 }));
    assert.equal(sameMelee(g, f), false, "not a faster creature");
});

test("A critical hit on it recharges its breath, used at once; once a day, its hit a critical one (2026-10-11, B118)", { skip }, async () => {
    const { hellfire } = await packAbilities();
    const [fighter] = martialParty(5);
    const hound = withBuiltins({ ...moderateCreature(5, "hnd", "Hound"), engagement: 1, spells: [entry("Hellfire Breath", hellfire)] }, ["Test Revenge", { builtin: "crit-recharge", recharges: "Hellfire Breath", untilNatural: true }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, hound] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    const h = state.byId.get("hnd");
    const f = state.byId.get(fighter.id);
    h.rechargeUntil = new Map([[h.spells[0], 99]]);
    performStrike(state, f, h, f.strikes.find((strike) => strike.melee));
    assert.ok(state.log.includes("  Hound uses Test Revenge: Hellfire Breath recharges"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /Hellfire Breath/.test(line) && !/Test Revenge/.test(line)), "and breathes at once");
    assert.equal(h.reactionUsed, true);
    // Not again until the breath's own recharge has run out.
    h.reactionUsed = false;
    const lines = state.log.length;
    performStrike(state, f, h, f.strikes.find((strike) => strike.melee));
    assert.ok(!state.log.slice(lines).some((line) => /Test Revenge/.test(line)), state.log.slice(lines).join("\n"));

    // (B119: an ability used in ways, "Breathe Energy (Acid Maw)" and the rest, their rechargeGroup.)
    const hydra = withBuiltins({ ...moderateCreature(5, "hyd", "Hydra"), engagement: 1, spells: ["Acid Maw", "Flame Maw"].map((way) => ({ ...entry(`Test Breath (${way})`, hellfire), rechargeGroup: "Test Breath" })) }, ["Test Rage", { builtin: "crit-recharge", recharges: "Test Breath", untilNatural: true }]);
    const third = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, hydra] }, {}, 1);
    third.log = [];
    third.rng.d20 = () => 20;
    const y = third.byId.get("hyd");
    const g = third.byId.get(fighter.id);
    y.rechargeUntil = new Map([["Test Breath", 99]]);
    performStrike(third, g, y, g.strikes.find((strike) => strike.melee));
    assert.ok(third.log.includes("  Hydra uses Test Rage: Test Breath recharges"), third.log.join("\n"));
    assert.ok((y.rechargeUntil.get("Test Breath") ?? -1) < 99, "breathed again, its recharge rolled anew");
    // Flash of Brutality: its first hit a critical one, once (again after its Ferocity).
    const cyclops = withBuiltins({ ...moderateCreature(5, "cyc", "Cyclops"), engagement: 1 }, ["Test Flash", { builtin: "crit-upgrade", perDay: 1, ferocityRecharges: true }]);
    const second = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, cyclops] }, {}, 1);
    second.log = [];
    const c = second.byId.get("cyc");
    const target = second.byId.get(fighter.id);
    second.rng.d20 = () => Math.max(1, armorClass(target) - c.strikes[0].bonus + 1);
    assert.equal(performStrike(second, c, target, c.strikes[0]).degree, 3);
    c.attacksThisTurn = 0;
    assert.equal(performStrike(second, c, target, c.strikes[0]).degree, 2, "once");
});

test("Strikes at every creature in its reach but those it holds; a sweep behind a requirement it can't meet (2026-10-11, B120)", () => {
    const party = martialParty(5);
    const pit = withBuiltins({ ...moderateCreature(5, "pit", "Pit"), engagement: 1 }, ["Test Pods", { builtin: "multi-strike", actions: 2, strikes: [null], each: true, sameMap: true, notGrabbed: true }]);
    const state = createFightState({ combatants: [...party.slice(0, 3).map((pc) => ({ ...pc, engagement: 1, hp: { value: 999, max: 999, temp: 0 } })), pit] }, {}, 1);
    state.log = [];
    const c = state.byId.get("pit");
    const held = state.byId.get(party[0].id);
    held.grabbedBy = c.id;
    held.cond.grabbed = true;
    c.actionsLeft = 3;
    performAction(state, c, { type: "multiStrike", ability: 0, actions: 2 });
    const struck = state.log.filter((line) => /^ {2}Pit .+ → /.test(line)).map((line) => line.split(" → ")[1].split(":")[0]);
    assert.equal(struck.length, 2, state.log.join("\n"));
    assert.ok(!struck.includes(held.name), "not at the creature it holds");
    // Rampage's requirement: never planned.
    const golem = withBuiltins({ ...moderateCreature(5, "glm", "Golem"), engagement: 1 }, ["Test Rampage", { builtin: "multi-strike", actions: 2, strikes: [null], each: true, sameMap: true, requires: "requirement" }]);
    const second = createFightState({ combatants: [...party.slice(0, 2).map((pc) => ({ ...pc, engagement: 1 })), golem] }, {}, 1);
    const g = second.byId.get("glm");
    g.actionsLeft = 3;
    assert.ok(!scoreOptions(second, g).options.some((option) => option.action.type === "multiStrike"));
});

test("Reaction Strikes: extra dice on a hit, a Step to the creature that hurt an ally, a ranged Strike at a far attacker (2026-10-11, B121)", () => {
    const [fighter, , ranger] = martialParty(5);
    // Retaliatory Strike: its tail back, 1d6 more on a hit.
    const drake = { ...moderateCreature(5, "drk", "Drake"), engagement: 1 };
    drake.strikes = [{ ...drake.strikes[0], name: "Tail" }];
    addBuiltin(drake, { builtin: "reaction-strike", triggers: ["damaged-adjacent"], strike: "tail", penalty: 0, disrupts: false, extraDamage: "1d6" }, "Test Retaliation");
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, drake] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("drk"), f.strikes.find((strike) => strike.melee));
    assert.ok(state.log.includes("  Drake uses Test Retaliation"), state.log.join("\n"));
    // Avenging Claws: a creature that damages its ally beside it, a Step and its claws.
    const wolf = { ...moderateCreature(5, "wlf", "Wolf"), engagement: 1, hp: { value: 999, max: 999, temp: 0 } };
    const bear = { ...moderateCreature(5, "bear", "Bear"), engagement: 1 };
    bear.strikes = [{ ...bear.strikes[0], name: "Claws" }];
    addBuiltin(bear, { builtin: "reaction-strike", triggers: ["ally-damaged"], strike: "claws", penalty: 0, disrupts: false, within: 10, step: true }, "Test Avenging");
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, wolf, bear] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const g = state.byId.get(fighter.id);
    performStrike(state, g, state.byId.get("wlf"), g.strikes.find((strike) => strike.melee));
    assert.ok(state.log.includes("  Bear uses Test Avenging"), state.log.join("\n"));
    // Vengeful Throw: a ranged attacker away from its Melee, its thrown spear back.
    const marauder = { ...moderateCreature(5, "mar", "Marauder"), engagement: null, band: "near" };
    marauder.strikes = [{ ...marauder.strikes[0], name: "Spear", melee: true }, { ...marauder.strikes[0], name: "Spear", melee: false, range: 20 }];
    addBuiltin(marauder, { builtin: "reaction-strike", triggers: ["damaged-far"], strike: "spear", penalty: 0, disrupts: false, from: 20, ranged: true }, "Test Throw");
    state = createFightState({ combatants: [{ ...ranger, engagement: null, band: "far", hp: { value: 999, max: 999, temp: 0 } }, marauder] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const r = state.byId.get(ranger.id);
    const shot = r.strikes.find((strike) => !strike.melee);
    assert.ok(shot && !sameMelee(r, state.byId.get("mar")));
    performStrike(state, r, state.byId.get("mar"), shot);
    assert.ok(state.log.includes("  Marauder uses Test Throw"), state.log.join("\n"));
});

test("Spell Interception, Shoot First, Knowing Glance (2026-10-11, B122)", { skip }, async () => {
    const { hellfire } = await packAbilities();
    const [fighter] = martialParty(5);
    // Spell Interception: a spell cast in its Melee, its Strike; a hit disrupts the spell.
    const killer = withBuiltins({ ...moderateCreature(5, "kil", "Killer"), engagement: 1 }, ["Test Interception", { builtin: "reaction-strike", triggers: ["cast"], strike: null, penalty: 0, disrupts: true }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 }, spells: [entry("Test Blast", hellfire, null)] }, killer] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 19;
    let f = state.byId.get(fighter.id);
    performAction(state, f, { type: "cast", spellIndex: 0, targetIds: ["kil"], actions: 1 });
    assert.ok(state.log.includes("  Killer uses Test Interception"), state.log.join("\n"));
    // Shoot First: its firearm before the Strike; a critical hit disrupts it.
    const duelist = withBuiltins({ ...moderateCreature(5, "due", "Duelist"), engagement: 1 }, ["Test Shoot First", { builtin: "reaction-strike", triggers: ["targeted"], strike: "firearm", penalty: 0, disrupts: "critical" }]);
    duelist.strikes = [...duelist.strikes, { ...duelist.strikes[0], name: "Dueling Pistol", melee: false, firearm: true }];
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, duelist] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    f = state.byId.get(fighter.id);
    assert.equal(performStrike(state, f, state.byId.get("due"), f.strikes.find((strike) => strike.melee)), null, "disrupted");
    assert.ok(state.log.includes("  Duelist uses Test Shoot First") && state.log.some((line) => /Strike is disrupted/.test(line)), state.log.join("\n"));
    // Knowing Glance: a melee Strike at it, its Demoralize first; not a ranged one.
    const glancer = withBuiltins({ ...moderateCreature(5, "gla", "Glancer"), engagement: 1, skills: { intimidation: 14 } }, ["Test Glance", { builtin: "reaction-strike", triggers: ["attacked"], strike: null, skill: "demoralize", penalty: 0, disrupts: false, melee: true }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, glancer] }, {}, 1);
    const g = state.byId.get("gla");
    f = state.byId.get(fighter.id);
    const ranged = f.strikes.find((strike) => !strike.melee);
    if (ranged) {
        state.log = [];
        performStrike(state, f, g, ranged);
        assert.ok(!state.log.includes("  Glancer uses Test Glance"), "not at a ranged Strike");
    }
});

test("Quick Capture's grab, Wrappings Lash's disruption, Deadly Cleave's second Strike (2026-10-11, B123)", () => {
    const party = martialParty(5);
    const [fighter] = party;
    // Quick Capture: a hit on it, its leaf back, the creature Grabbed on a hit.
    const trap = withBuiltins({ ...moderateCreature(5, "fly", "Flytrap"), engagement: 1 }, ["Test Capture", { builtin: "reaction-strike", triggers: ["hit"], strike: null, penalty: 0, disrupts: false, grab: true }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, trap] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 19;
    let f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("fly"), f.strikes.find((strike) => strike.melee));
    assert.ok(state.log.includes("  Flytrap uses Test Capture"), state.log.join("\n"));
    assert.equal(f.grabbedBy, "fly");
    // Wrappings Lash: a Strike in its reach, its Strike first; a critical hit disrupts it.
    const lasher = withBuiltins({ ...moderateCreature(5, "mor", "Morrigna"), engagement: 1 }, ["Test Lash", { builtin: "reaction-strike", triggers: ["strike", "skill"], strike: null, penalty: 0, disrupts: "critical" }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, lasher] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    f = state.byId.get(fighter.id);
    assert.equal(performStrike(state, f, state.byId.get("mor"), f.strikes.find((strike) => strike.melee)), null);
    assert.ok(state.log.some((line) => /Strike is disrupted/.test(line)), state.log.join("\n"));
    // Deadly Cleave: its halberd downs one, then another at a different creature in its Melee.
    const redcap = { ...moderateCreature(5, "red", "Redcap"), engagement: 1 };
    redcap.strikes = [{ ...redcap.strikes[0], name: "Halberd", bonus: 40 }];
    addBuiltin(redcap, { builtin: "reaction-strike", triggers: ["downs"], strike: "halberd", penalty: 0, disrupts: false, sameMap: true }, "Test Cleave");
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 1, max: 50, temp: 0 } }, { ...party[1], engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, redcap] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const r = state.byId.get("red");
    r.actionsLeft = 2;
    state.acting = r.id;
    performAction(state, r, { type: "strike", strikeIndex: 0, targetId: fighter.id });
    assert.ok(state.log.includes("  Redcap uses Test Cleave"), state.log.join("\n"));
    assert.equal(r.attacksThisTurn, 2, "the second counts toward its multiple attack penalty");
});

test("A guard takes its ward's damage (all or half); an ally kept from dropping (2026-10-11, B124)", () => {
    const [fighter] = martialParty(5);
    // Human Shield: the toady takes the boss's damage.
    const boss = { ...moderateCreature(7, "boss", "Boss"), engagement: 1 };
    const toady = withBuiltins({ ...moderateCreature(3, "tdy", "Toady"), engagement: 1 }, ["Test Shield", { builtin: "intercept", ward: "boss", share: 1 }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, boss, toady] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    const b = state.byId.get("boss");
    const t = state.byId.get("tdy");
    const before = [b.hp.value, t.hp.value];
    applyDamage(state, b, [{ type: "slashing", amount: 10, persistent: false, precision: false }], { source: f, physical: true });
    assert.ok(state.log.includes("  Toady uses Test Shield for Boss"), state.log.join("\n"));
    assert.equal(b.hp.value, before[0]);
    assert.ok(t.hp.value < before[1]);
    // Mortal Shield: half each.
    const thrall = withBuiltins({ ...moderateCreature(3, "thr", "Thrall"), engagement: 1 }, ["Test Mortal", { builtin: "intercept", ward: "master", share: 0.5, attacks: true }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...boss }, thrall] }, {}, 1);
    const m = state.byId.get("boss");
    const h = state.byId.get("thr");
    const hp = [m.hp.value, h.hp.value];
    applyDamage(state, m, [{ type: "slashing", amount: 10, persistent: false, precision: false }], { source: state.byId.get(fighter.id), physical: true });
    assert.equal(hp[0] - m.hp.value, 5);
    assert.equal(hp[1] - h.hp.value, 5);
    // Not a spell's damage (Strikes and spell attacks only; played as Strikes).
    h.reactionUsed = false;
    applyDamage(state, m, [{ type: "fire", amount: 4, persistent: false, precision: false }], { source: state.byId.get(fighter.id) });
    assert.equal(hp[0] - m.hp.value, 9);
    // You Don't Have My Permission to Die!: an ally within 30 feet stays at 1 HP, once.
    const sergeant = withBuiltins({ ...moderateCreature(5, "sgt", "Sergeant"), engagement: 1 }, ["Test Rebuke", { builtin: "rescue", within: 30, hp: 1, oncePerTarget: true }]);
    const grunt = { ...moderateCreature(3, "gru", "Grunt"), engagement: 1 };
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, sergeant, grunt] }, {}, 1);
    state.log = [];
    const g = state.byId.get("gru");
    applyDamage(state, g, [{ type: "slashing", amount: g.hp.value + 5, persistent: false, precision: false }], { source: state.byId.get(fighter.id), physical: true });
    assert.ok(state.log.some((line) => line === "  Sergeant uses Test Rebuke: Grunt stays up at 1 HP"), state.log.join("\n"));
    assert.equal(isActive(g), true);
    // (Recall the Fallen: Hit Points back, prone and wounded.)
    const valkyrie = withBuiltins({ ...moderateCreature(5, "val", "Valkyrie"), engagement: 1 }, ["Test Recall", { builtin: "rescue", within: 60, heal: "5d10", living: true, perDay: 1 }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, valkyrie, { ...grunt }] }, {}, 1);
    const k = state.byId.get("gru");
    applyDamage(state, k, [{ type: "slashing", amount: k.hp.value + 5, persistent: false, precision: false }], { source: state.byId.get(fighter.id), physical: true });
    assert.ok(k.hp.value >= 5 && k.cond.prone && k.cond.wounded === 1);
});

test("An ally's save helped: a reroll keeping the better, a bonus as it comes (2026-10-11, B125)", () => {
    const [fighter] = martialParty(5);
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const scare = { modelVersion: 13, source: { name: "Test Scare" }, rank: 1, traits: ["mental", "emotion"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: null, area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 40 } }, sharedDamage: null, outcomes: { criticalSuccess: none, success: none, failure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } };
    const caster = { ...fighter, engagement: 1, spells: [entry("Test Scare", scare, null)] };
    // Distracting Frolic: an ally beside it rerolls a failed save against a mental effect.
    const dancer = withBuiltins({ ...moderateCreature(5, "dan", "Dancer"), engagement: 1 }, ["Test Frolic", { builtin: "save-reroll", ally: true, within: 10, against: ["mental", "illusion"] }]);
    const ally = { ...moderateCreature(5, "aly", "Ally"), engagement: 1 };
    let state = createFightState({ combatants: [caster, dancer, ally] }, {}, 1);
    state.log = [];
    castPlan(state, state.byId.get(fighter.id), state.byId.get(fighter.id).spells[0], ["aly"]);
    assert.ok(state.log.some((line) => /Dancer uses Test Frolic: Ally rerolls/.test(line)), state.log.join("\n"));
    // Free Mind: +4 to the save against a mental effect, when that changes the result.
    const yamah = withBuiltins({ ...moderateCreature(5, "yam", "Yamah"), engagement: 1 }, ["Test Free Mind", { builtin: "save-bonus-reaction", ally: true, value: 4, kind: "status", against: "mental", upgrade: true }]);
    state = createFightState({ combatants: [caster, yamah, { ...ally }] }, {}, 1);
    state.log = [];
    const target = state.byId.get("aly");
    state.rng.d20 = () => Math.max(1, Math.min(20, 40 - target.saves.will - 2));
    castPlan(state, state.byId.get(fighter.id), state.byId.get(fighter.id).spells[0], ["aly"]);
    assert.ok(state.log.some((line) => /Yamah uses Test Free Mind: \+4 to Ally's save/.test(line)), state.log.join("\n"));
});

test("A Strike activity behind a requirement it can't check, in the first round only, at an animal or humanoid only (2026-10-12, B126)", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "elk", "Elk");
    const plan = (extra) => ({ builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: ["1d4[piercing]"], save: null, size: null }, ...extra });
    const options = (extra, round = 1, traits = ["humanoid"]) => {
        const elk = withBuiltins({ ...base, engagement: 1 }, ["Test Rush", plan(extra)]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, traits }, elk] }, {}, 1);
        state.round = round;
        const c = state.byId.get("elk");
        c.actionsLeft = 3;
        return scoreOptions(state, c).options.filter((option) => option.action.type === "strikeActivity");
    };
    assert.ok(options({}).length > 0);
    assert.equal(options({ requires: "requirement" }).length, 0);
    assert.ok(options({ requires: "first-round" }).length > 0);
    assert.equal(options({ requires: "first-round" }, 2).length, 0);
    assert.equal(options({ targetTraits: ["animal"] }).length, 0);
    assert.ok(options({ targetTraits: ["animal", "humanoid"] }).length > 0);
});

test("Furious Throw: a ranged answer at any enemy, the flat check against its persistent acid (2026-10-12, B127)", () => {
    const [fighter, , ranger] = martialParty(5);
    const troll = { ...moderateCreature(5, "trl", "Troll"), engagement: 1 };
    troll.strikes = [{ ...troll.strikes[0], name: "Claw", melee: true }, { ...troll.strikes[0], name: "Rock", melee: false, range: 30 }];
    addBuiltin(troll, { builtin: "reaction-strike", triggers: ["damaged-by"], damageTypes: ["acid", "sonic"], strike: "rock", penalty: 0, disrupts: false, random: true, ranged: true, persistentType: "acid" }, "Test Throw");
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, { ...ranger, engagement: null, band: "far", hp: { value: 999, max: 999, temp: 0 } }, troll] }, {}, 1);
    state.log = [];
    const t = state.byId.get("trl");
    t.persistent = [{ type: "acid", amount: 3, persistent: true }];
    applyDamage(state, t, [{ type: "acid", amount: 5, persistent: false, precision: false }], { source: state.byId.get(ranger.id) });
    assert.ok(state.log.includes("  Troll uses Test Throw"), state.log.join("\n"));
    assert.ok(state.log.some((line) => /persistent acid damage/.test(line)), state.log.join("\n"));
});

test("A special attack with a fixed modifier of its own, against AC, with the multiple attack penalty (2026-10-12, B128)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const net = (modifier) => ({ modelVersion: 13, source: { name: "Test Net" }, rank: 1, traits: ["attack"], activation: { time: "1", traits: ["attack"] }, targeting: { target: "1 creature", range: "20 feet", area: null }, trigger: { event: "use" },
        resolution: { kind: "check", check: { roll: "skill", statistic: "test-net", against: { dc: "target", statistic: "ac" }, modifier }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [{ kind: "condition", slug: "restrained", value: null, duration: null }] }, success: { damage: { ...none }, effects: [{ kind: "condition", slug: "off-guard", value: null, duration: null }], modifiers: [{ selector: "all-speeds", value: -10, type: "circumstance", duration: null }] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } });
    const [fighter] = martialParty(5);
    const fight = (attacks) => {
        const probe = createFightState({ combatants: [{ ...fighter, engagement: 1 }] }, {}, 1);
        const modifier = armorClass(probe.byId.get(fighter.id)) - 10 + 2;
        const strider = { ...moderateCreature(5, "bog", "Bog Strider"), engagement: 1, spells: [entry("Test Net", net(modifier))] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, strider] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => 10;
        const c = state.byId.get("bog");
        c.attacksThisTurn = attacks;
        castSpell(state, c, 0, [fighter.id]);
        return state.byId.get(fighter.id);
    };
    assert.equal(fight(0).cond.offGuard, true, "a hit: off-guard");
    assert.equal(fight(1).cond.offGuard, false, "a miss at the multiple attack penalty");
});

test("Strikes back of more kinds: a getaway, a hit of its damage types, +2 damage on a hit (2026-10-12, B129)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    // Snagging Spines: a creature it held escaping, a Strike at it.
    const louse = withBuiltins({ ...moderateCreature(5, "louse", "Louse"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Spines", { builtin: "reaction-strike", triggers: ["escaped"], strike: null, penalty: 0, disrupts: false }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Escape", basic.escape, "basic")] }, louse] }, {}, 1);
    state.log = [];
    const f = state.byId.get(fighter.id);
    applyCondition(state, f, "grabbed", null, null, state.byId.get("louse"));
    state.rng.d20 = () => 20;
    castSpell(state, f, 0, ["louse"]);
    state.rng.d20 = () => 10;
    assert.ok(state.log.includes("  Louse uses Test Spines"), state.log.join("\n"));
    // Reactive Splash: a melee hit of a type it names (the fighter's weapon), not of another.
    const splash = (types) => {
        const bramble = withBuiltins({ ...moderateCreature(5, "bram", "Bramble"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Splash", { builtin: "reaction-strike", triggers: ["hit"], damageTypes: types, strike: null, penalty: 0, disrupts: false }]);
        const fightState = createFightState({ combatants: [{ ...fighter, engagement: 1 }, bramble] }, {}, 1);
        fightState.log = [];
        fightState.rng.d20 = () => 15;
        const attacker = fightState.byId.get(fighter.id);
        performStrike(fightState, attacker, fightState.byId.get("bram"), attacker.strikes[0]);
        return fightState.log.includes("  Bramble uses Test Splash");
    };
    const own = createFightState({ combatants: [{ ...fighter, engagement: 1 }] }, {}, 1).byId.get(fighter.id).strikes[0].damage[0].type;
    assert.equal(splash([own]), true, own);
    assert.equal(splash(["fire"]), false);
    // Vengeful Sting: its Strike's damage 2 higher.
    const sting = withBuiltins({ ...moderateCreature(5, "sting", "Stinger"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Sting", { builtin: "reaction-strike", triggers: ["damaged-adjacent"], strike: null, penalty: 2, disrupts: false, damageBonus: 2 }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, sting] }, {}, 1);
    assert.equal(state.byId.get("sting").reactionStrikes[0].damageBonus, 2);
});

test("A Strike activity's save only against an off-guard target (2026-10-12, B130)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const stun = { modelVersion: 13, source: { name: "Test Clobber" }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null }, trigger: { event: "strike-activity" },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stunned", value: 2, duration: null }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "stunned", value: 2, duration: null }] } } } };
    const [fighter] = martialParty(5);
    const run = (offGuard) => {
        const guard = withBuiltins({ ...moderateCreature(5, "grd", "Guard"), engagement: 1 }, ["Test Clobber", { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: stun, size: null, saveIf: "off-guard" } }]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 999, max: 999, temp: 0 } }, guard] }, {}, 1);
        state.log = [];
        const f = state.byId.get(fighter.id);
        if (offGuard) f.cond.offGuard = true;
        const c = state.byId.get("grd");
        applyStrikeRider(state, c, f, c.strikeActivities[0], false, c.strikes[0]);
        return f.cond.stunned;
    };
    assert.equal(run(false), 0, "not off-guard: no save");
    assert.equal(run(true), 2, "off-guard: the save, failed against DC 60");
});

test("A Grapple as a reaction to electricity damage, at a creature beside it (2026-10-12, B131)", { skip }, async () => {
    const { basic } = await packAbilities();
    const grapple = structuredClone(basic.grapple);
    grapple.resolution.outcomes.success.damage = { mode: "formulas", formulas: [{ formula: "3d6[electricity]" }], rollScope: "target" };
    const plan = { ...grapple, source: { name: "Test Reflexes" }, activation: { time: "reaction", traits: [] }, targeting: { ...grapple.targeting, target: "an adjacent creature", range: "touch" }, trigger: { event: "damaged", reaction: true, damageTypes: ["electricity"] } };
    const [fighter, , , wizard] = martialParty(5);
    const golem = { ...moderateCreature(5, "glm", "Golem"), engagement: 1, hp: { value: 999, max: 999 }, spells: [entry("Test Reflexes", plan)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...(wizard ?? fighter), id: "far", name: "Far", engagement: null, band: "far" }, golem] }, {}, 1);
    state.log = [];
    const g = state.byId.get("glm");
    applyDamage(state, g, [{ type: "fire", amount: 5, persistent: false, precision: false }], { source: state.byId.get("far") });
    assert.ok(!state.log.some((line) => /Test Reflexes/.test(line)), "not fire damage");
    applyDamage(state, g, [{ type: "electricity", amount: 5, persistent: false, precision: false }], { source: state.byId.get("far") });
    assert.ok(state.log.some((line) => /reacts with Test Reflexes/.test(line)), state.log.join("\n"));
    assert.ok(state.log.some((line) => /Golem casts Test Reflexes at Fighter|Fighter:/.test(line)), "at the fighter beside it, not the far caster");
});

test("Its failed Will save against a mental effect made a success, at the cost of damage (2026-10-12, B132)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const scare = (traits) => ({ modelVersion: 13, source: { name: "Test Scare" }, rank: 1, traits, activation: { time: "2", traits }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 25 } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { ...none }, effects: [] }, failure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }, criticalFailure: { damage: { ...none }, effects: [{ kind: "condition", slug: "frightened", value: 3, duration: null }] } } } });
    const [fighter] = martialParty(5);
    const run = (traits) => {
        const masked = withBuiltins({ ...moderateCreature(5, "msk", "Masked"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Resolve", { builtin: "save-boost", failureOnly: true, save: "will", against: ["mental", "fear"], selfDamage: "3d8[mental]" }]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Test Scare", scare(traits))] }, masked] }, {}, 1);
        state.log = [];
        const m = state.byId.get("msk");
        // A failure, not a critical failure: the save total just under the DC.
        state.rng.d20 = () => Math.max(2, Math.min(19, 24 - m.saves.will));
        castSpell(state, state.byId.get(fighter.id), 0, ["msk"]);
        return [m.cond.frightened, m.hp.value < 999];
    };
    assert.deepEqual(run(["mental", "fear"]), [0, true], "boosted to a success, its damage taken");
    assert.deepEqual(run(["fire"]), [2, false], "not against a non-mental effect");
});

test("A move first, then a maneuver: Tackle reaches a creature away from it; an unseen-only one isn't planned (2026-10-12, B133)", { skip }, async () => {
    const { basic } = await packAbilities();
    const tackle = { ...structuredClone(basic.grapple), source: { name: "Test Tackle" }, activation: { time: "2", traits: ["attack"] }, approach: { strides: 2 } };
    const [fighter] = martialParty(5);
    const brute = { ...moderateCreature(5, "gur", "Gurgist"), engagement: null, band: "near", spells: [entry("Test Tackle", tackle)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: null, band: "near" }, brute] }, {}, 1);
    state.log = [];
    const c = state.byId.get("gur");
    const f = state.byId.get(fighter.id);
    assert.equal(sameMelee(c, f), false);
    const sets = targetSetsFor(state, c, c.spells[0], { enemies: [f], inMelee: (other) => sameMelee(c, other), distance: () => 30, meleeId: null }, 2);
    assert.equal(sets.length, 1, "within two Strides");
    c.actionsLeft = 3;
    performAction(state, c, { type: "cast", spellIndex: 0, targetIds: [f.id], actions: 2 });
    assert.equal(sameMelee(c, f), true, state.log.join("\n"));
    assert.ok(state.log.some((line) => /Test Tackle/.test(line)), state.log.join("\n"));
    // Bushwhack's: only at a creature it's undetected by — not planned.
    const hidden = { ...moderateCreature(5, "bug", "Bugbear"), engagement: 1, spells: [entry("Test Bushwhack", { ...tackle, requires: "requirement" })] };
    const second = createFightState({ combatants: [{ ...fighter, engagement: 1 }, hidden] }, {}, 1);
    const b = second.byId.get("bug");
    b.actionsLeft = 3;
    assert.equal(scoreOptions(second, b).options.filter((option) => option.action.type === "cast").length, 0);
});

test("A move away on damage with a recharge: not again until it recharges (2026-10-12, B135)", () => {
    const [fighter] = martialParty(5);
    const slide = withBuiltins({ ...moderateCreature(5, "lnd", "Landslide"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Crumble", { builtin: "withdraw", on: "damaged", move: "Burrow", feet: 10, safe: true, recharge: "1d4" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, slide] }, {}, 1);
    state.log = [];
    state.round = 1;
    state.rng.d4 = () => 4;
    const c = state.byId.get("lnd");
    const f = state.byId.get(fighter.id);
    state.acting = f.id;
    f.actionsLeft = 2;
    assert.equal(c.withdraw.recharge, "1d4");
    state.rng.d20 = () => 15;
    performStrike(state, f, c, f.strikes[0]);
    assert.ok(state.log.some((line) => /uses Test Crumble/.test(line)), state.log.join("\n"));
    assert.ok(c.withdrawUntil > state.round, "recharging");
    // Back in its Melee, hit again the same round: no second use while it recharges.
    c.reactionUsed = false;
    engage(state, f, c);
    state.log = [];
    performStrike(state, f, c, f.strikes[0]);
    assert.ok(!state.log.some((line) => /uses Test Crumble/.test(line)), state.log.join("\n"));
});

test("A Medium mover only; a Strike as a creature tries to Escape; a Strike after its own Trip (2026-10-12, B136)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const prone = { kind: "condition", slug: "prone", value: null, duration: null };
    // Kneecapper: a Trip rolled with Acrobatics at a Medium creature leaving its reach — not at a Large one.
    const kneecap = { modelVersion: 13, source: { name: "Test Kneecap" }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "provoke", reaction: true, triggers: ["leave"], within: "reach", sizes: ["medium"] },
        resolution: { kind: "check", check: { roll: "skill", statistic: "acrobatics", against: { dc: "target", statistic: "reflex" } }, sharedDamage: null, outcomes: { criticalSuccess: { damage: { ...none }, effects: [prone] }, success: { damage: { ...none }, effects: [prone] }, failure: { damage: { ...none }, effects: [] }, criticalFailure: { damage: { ...none }, effects: [] } } } };
    for (const [size, reacts] of [["med", true], ["lg", false]]) {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, size }, { ...moderateCreature(5, "nug", "Nuglub"), engagement: 1, spells: [entry("Test Kneecap", kneecap)] }] }, {}, 1);
        state.log = [];
        provokeFor(state, state.byId.get(fighter.id), "move");
        assert.equal(state.log.some((line) => /Test Kneecap/.test(line)), reacts, `${size}: ${state.log.join("\n")}`);
    }
    // Punish Flight: its Strike as the held creature tries to Escape, whatever the result.
    const holder = withBuiltins({ ...moderateCreature(5, "sik", "Siktempora"), engagement: 1, hp: { value: 999, max: 999 } }, ["Test Punish", { builtin: "reaction-strike", triggers: ["escape"], strike: null, penalty: 0, disrupts: false, noGrab: true }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Escape", basic.escape, "basic")] }, holder] }, {}, 1);
    state.log = [];
    let f = state.byId.get(fighter.id);
    applyCondition(state, f, "grabbed", null, null, state.byId.get("sik"));
    state.rng.d20 = () => 19;
    castSpell(state, f, 0, ["sik"]);
    state.rng.d20 = () => 10;
    const text = state.log.join("\n");
    assert.ok(text.indexOf("Siktempora uses Test Punish") >= 0 && text.indexOf("Siktempora uses Test Punish") < text.indexOf("Fighter: "), text);
    // Sweeping Hook: its own Trip that succeeds, then its Strike at the creature it tripped.
    const ogre = withBuiltins({ ...moderateCreature(5, "ogre", "Ogre Boss"), engagement: 1, spells: [entry("Trip", basic.trip, "basic")] }, ["Test Hook", { builtin: "reaction-strike", triggers: ["tripped"], strike: null, penalty: 0, disrupts: false, using: "ogre hook" }]);
    for (const [reflex, reacts] of [[0, true], [40, false]]) {
        state = createFightState({ combatants: [{ ...fighter, engagement: 1, saves: { fortitude: 0, reflex, will: 0 } }, ogre] }, {}, 1);
        state.log = [];
        const o = state.byId.get("ogre");
        o.actionsLeft = 3;
        state.rng.d20 = () => 15;
        castSpell(state, o, o.spells.findIndex((spell) => spell.name === "Trip"), [fighter.id]);
        state.rng.d20 = () => 10;
        assert.equal(state.log.some((line) => /Ogre Boss uses Test Hook/.test(line)), reacts, `${reflex}: ${state.log.join("\n")}`);
    }
});

test("A guard that lasts until it moves: Cower's AC, ended by its Stride (2026-10-12, B137)", () => {
    const [fighter] = martialParty(5);
    const pusk = withBuiltins({ ...moderateCreature(5, "pusk", "Pusk"), engagement: 1 }, ["Test Cower", { builtin: "self-effect", actions: 1, model: { name: "Test Cower", rounds: 10, modifiers: [{ on: "ac", type: "circumstance", value: 4 }, { on: "attack", type: "untyped", value: -2 }], tempHp: 0 }, stance: true, endsOnMove: true, duration: { value: -1, unit: "unlimited", expiry: null } }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, pusk] }, {}, 1);
    state.log = [];
    const p = state.byId.get("pusk");
    const before = armorClass(p);
    p.actionsLeft = 3;
    performAction(state, p, { type: "selfEffect", index: 0, actions: 1 });
    assert.equal(armorClass(p), before + 4, state.log.join("\n"));
    stride(state, p, { kind: "away" });
    assert.equal(armorClass(p), before, state.log.join("\n"));
    assert.ok(state.log.some((line) => /Test Cower ends as it moves/.test(line)), state.log.join("\n"));
    // Tentacle Stab: two Strikes that can't Grab.
    const squid = withBuiltins({ ...moderateCreature(5, "sq", "Squid"), engagement: 1 }, ["Test Stab", { builtin: "multi-strike", actions: 1, strikes: [null, null], sameMap: true, sameTarget: true, noGrab: true }]);
    assert.equal(squid.multiStrikes[0].noGrab, true);
});

test("A reaction to rolling initiative with a skill it names: played as if it did (2026-10-12, B138)", { skip }, async () => {
    const { basic } = await packAbilities();
    const party = martialParty(5);
    const cry = { ...structuredClone(basic.demoralize), targeting: { target: "1 creature", range: "30 feet", area: null } };
    const dazzler = { ...moderateCreature(5, "dazz", "Dazzler"), engagement: 1, spells: [entry("Test Charisma", { ...cry, trigger: { event: "initiative", reaction: true, free: true, skills: ["deception", "performance"] } })] };
    const started = simulate({ combatants: [{ ...party[0], engagement: 1 }, dazzler] }, { maxRounds: 1 }, 2, { log: true });
    assert.match(started.log.join("\n"), new RegExp(`Dazzler casts Test Charisma at ${party[0].name}`));
});

test("A Strike activity that leaves it Off-Guard or guarded until its next turn (2026-10-12, B139)", () => {
    const [fighter] = martialParty(5);
    const activity = (selfAfter) => ({ builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, extraWeaponDice: 1, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, selfAfter });
    for (const [selfAfter, change] of [[[{ slug: "off-guard", until: "own-turn-start" }], -2], [[{ ac: 2, type: "circumstance" }], 2]]) {
        const brute = withBuiltins({ ...moderateCreature(5, "brute", "Brute"), engagement: 1 }, ["Test Swing", activity(selfAfter)]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, brute] }, {}, 1);
        state.log = [];
        const b = state.byId.get("brute");
        const before = armorClass(b);
        b.actionsLeft = 3;
        state.rng.d20 = () => 15;
        performAction(state, b, { type: "strikeActivity", index: 0, targetId: fighter.id, strikeIndex: 0, actions: 1 });
        assert.equal(armorClass(b), before + change, state.log.join("\n"));
    }
});

test("Hit Points back on itself as it downs a creature (Absorb Sin, 2026-10-12, B140)", () => {
    const [fighter] = martialParty(5);
    const heal = { modelVersion: 13, source: { name: "Test Absorb" }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "self", range: null, area: null }, trigger: { event: "downs", reaction: true, free: true }, resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "6d6", kinds: ["healing"] }], recipients: "any" } } } };
    const fiend = { ...moderateCreature(5, "fiend", "Fiend"), engagement: 1, spells: [entry("Test Absorb", heal)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, fiend] }, {}, 1);
    state.log = [];
    const c = state.byId.get("fiend");
    c.hp.value = 10;
    downsAnswers(state, c, state.byId.get(fighter.id));
    assert.ok(c.hp.value > 10, state.log.join("\n"));
    // Unhurt: not used.
    c.hp.value = c.hp.max;
    state.log = [];
    downsAnswers(state, c, state.byId.get(fighter.id));
    assert.ok(!state.log.some((line) => /Test Absorb/.test(line)), state.log.join("\n"));
});

test("A maneuver's own damage, doubled on a critical success (Stampeding Shove's \"2*\" formula, 2026-10-12, B141)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const shove = structuredClone(basic.shove);
    shove.resolution.outcomes.success.damage = { mode: "formulas", formulas: [{ formula: "2d10[bludgeoning]" }], rollScope: "target" };
    shove.resolution.outcomes.criticalSuccess.damage = { mode: "formulas", formulas: [{ formula: "2*2d10[bludgeoning]" }], rollScope: "target" };
    const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1, spells: [entry("Test Shove", shove)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 }, saves: { fortitude: 0, reflex: 0, will: 0 } }, brute] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    state.rng.die = () => 10;
    const f = state.byId.get(fighter.id);
    castSpell(state, state.byId.get("brute"), 0, [f.id]);
    assert.equal(f.hp.value, 500 - 40, state.log.join("\n"));
});

test("A breath whose damage type is the monster's pick: the one that does the most (Eye Beams, 2026-10-12, B142)", () => {
    const [fighter] = martialParty(5);
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const beams = { modelVersion: 13, source: { name: "Test Beams" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: null, range: null, area: { type: "line", value: 15 } }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 40 } }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "2d6[cold]", type: null, category: null }] }, casterChoice: { kind: "damage-type", label: "Damage type", values: ["cold", "fire"] },
            outcomes: { criticalSuccess: { damage: { ...none }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } } } };
    const eye = { ...moderateCreature(5, "eye", "Eye"), engagement: 1, spells: [entry("Test Beams", beams)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 }, weaknesses: [{ type: "fire", value: 10 }], resistances: [{ type: "cold", value: 10 }] }, eye] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 5;
    state.rng.die = () => 3;
    const f = state.byId.get(fighter.id);
    castSpell(state, state.byId.get("eye"), 0, [f.id]);
    // 2d6 at 3 each (6), a critical failure (12): fire with weakness 10 → 22 (cold, resisted, would be 2).
    assert.equal(f.hp.value, 500 - 22, state.log.join("\n"));
});

test("A monster's Glimpse of Redemption and Liberating Step: its ally's resistance, the foe's choice (2026-10-12, B143)", () => {
    const [fighter] = martialParty(5);
    for (const [slug, resistance] of [["glimpse-of-redemption", 7], ["liberating-step", 10]]) {
        const redeemer = withBuiltins({ ...moderateCreature(5, "red", "Redeemer"), engagement: 1 }, ["Test Champion", { builtin: "champion-reaction", slug, resistance }]);
        const ally = { ...moderateCreature(5, "ally", "Ally"), engagement: 1, hp: { value: 200, max: 200 } };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, redeemer, ally] }, {}, 1);
        state.log = [];
        const a = state.byId.get("ally");
        const f = state.byId.get(fighter.id);
        engage(state, f, a);
        engage(state, state.byId.get("red"), a);
        applyDamage(state, a, [{ type: "slashing", amount: 20, persistent: false }], { source: f });
        assert.ok(state.log.some((line) => /Redeemer uses Test Champion/.test(line)), state.log.join("\n"));
        assert.equal(a.hp.value, 200 - (20 - resistance), state.log.join("\n"));
        if (slug === "glimpse-of-redemption") assert.equal(f.cond.enfeebled, 2, state.log.join("\n"));
    }
});

test("A monster's own champion reactions: Selfish Shield, Destructive Vengeance, Iron Command (2026-10-12, B143)", () => {
    const [fighter] = martialParty(5);
    const fight = (plan) => {
        const champ = withBuiltins({ ...moderateCreature(5, "champ", "Champion"), engagement: 1, hp: { value: 200, max: 200 } }, ["Test Reaction", plan]);
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 300, max: 300 } }, champ] }, {}, 1);
        state.log = [];
        state.rng.die = () => 3;
        const c = state.byId.get("champ");
        const f = state.byId.get(fighter.id);
        applyDamage(state, c, [{ type: "slashing", amount: 20, persistent: false }], { source: f });
        return { state, c, f };
    };
    let { state, c, f } = fight({ builtin: "champion-reaction", slug: "selfish-shield", self: true, resistance: 5 });
    assert.equal(c.hp.value, 200 - 15, state.log.join("\n"));
    ({ state, c, f } = fight({ builtin: "champion-reaction", slug: "destructive-vengeance", self: true, resistance: 0, selfDamage: "2d6", damage: "2d6[spirit]" }));
    assert.equal(c.hp.value, 200 - 26, state.log.join("\n"));
    assert.ok(f.hp.value < 300, state.log.join("\n"));
    ({ state, c, f } = fight({ builtin: "champion-reaction", slug: "iron-command", self: true, resistance: 0, dice: 5 }));
    assert.ok(state.log.some((line) => /Champion uses Test Reaction/.test(line)) && (f.cond.prone || f.hp.value < 300), state.log.join("\n"));
});

test("A reaction Strike that needs a state of its own isn't played (Twin Riposte, 2026-10-12, B145)", () => {
    const spec = { ...moderateCreature(5, "duel", "Duelist") };
    assert.equal(addBuiltin(spec, { builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, requires: "requirement" }, "Test Riposte"), false);
    assert.equal(spec.reactionStrikes, undefined);
    assert.equal(addBuiltin(spec, { builtin: "reaction-strike", triggers: ["critical-miss"], strike: null, penalty: 0, disrupts: false, note: "Or it can Disarm the attacker instead." }, "Test Riposte"), true);
});

test("A maneuver, then a Strike at the same creature (Noble's Ruse, Bully, Terrorizing Swing, 2026-10-12, B146)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const fight = (slug, then, d20) => {
        const plan = { ...structuredClone(basic[slug]), then, targeting: { target: "1 creature", range: "touch", area: null } };
        const brute = { ...moderateCreature(5, "brute", "Brute"), engagement: 1, spells: [entry("Test Combo", plan)] };
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 }, saves: { fortitude: 0, reflex: 0, will: 0 } }, brute] }, {}, 1);
        state.log = [];
        state.rng.d20 = () => d20;
        const b = state.byId.get("brute");
        b.actionsLeft = 3;
        castSpell(state, b, 0, [fighter.id]);
        return { state, b, f: state.byId.get(fighter.id) };
    };
    // On a success only: a Strike after a Feint that succeeds, none after one that fails.
    let { state, f } = fight("feint", { strike: null, onSuccess: true }, 15);
    assert.ok(f.hp.value < 500, state.log.join("\n"));
    ({ state, f } = fight("feint", { strike: null, onSuccess: true }, 1));
    assert.equal(f.hp.value, 500, state.log.join("\n"));
    // Bully: Shove, Stride after it, Strike at the same multiple attack penalty (two attacks counted in all).
    let b;
    ({ state, b, f } = fight("shove", { strike: null, sameMap: true, follow: true }, 15));
    assert.ok(state.log.some((line) => /Strides after/.test(line)) || sameMelee(b, f), state.log.join("\n"));
    assert.equal(b.attacksThisTurn, 2, state.log.join("\n"));
    assert.ok(f.hp.value < 500, state.log.join("\n"));
});

test("Straight after a spell it cast: a Strike activity and a Strike buff that need it (Residual Force, Primal Weapon, 2026-10-12, B147)", () => {
    const [fighter] = martialParty(5);
    const activity = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: "after-cast", oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: ["2d4[force]"], save: null, size: null } };
    const buff = { builtin: "self-effect", actions: 0, model: { name: "Test Weapon", rounds: 2, modifiers: [], tempHp: 0 }, damage: ["1d6[slashing]"], strike: null, melee: true, duration: { value: 1, unit: "rounds", expiry: "turn-end" }, requires: "after-cast", nonCantrip: true };
    const mage = withBuiltins({ ...moderateCreature(5, "mage", "Mage"), engagement: 1 }, ["Test Force", activity], ["Test Weapon", buff]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, mage] }, {}, 1);
    const m = state.byId.get("mage");
    m.round = state.round;
    m.actionsLeft = 2;
    m.actionCount = 1;
    const offered = () => scoreOptions(state, m).options.map((option) => option.action.type);
    assert.ok(!offered().includes("strikeActivity") && !offered().includes("selfEffect"), "not without a spell just cast");
    m.lastCast = { round: state.round, action: 0, cantrip: false };
    assert.ok(offered().includes("strikeActivity"), "after a spell");
    assert.ok(offered().includes("selfEffect"), "after a spell");
    m.lastCast = { round: state.round, action: 0, cantrip: true };
    assert.ok(!offered().includes("selfEffect"), "not after a cantrip");
});

test("A Strike activity only at a frightened creature; a Shove at a creature coming into its reach (Shatter Defenses, Toss, 2026-10-12, B151)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const activity = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: "frightened", oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } };
    const guard = withBuiltins({ ...moderateCreature(5, "guard", "Guard"), engagement: 1 }, ["Test Shatter", activity]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, guard] }, {}, 1);
    const g = state.byId.get("guard");
    g.round = state.round;
    g.actionsLeft = 3;
    const offered = () => scoreOptions(state, g).options.some((option) => option.action.type === "strikeActivity");
    assert.equal(offered(), false, "not at a creature that isn't frightened");
    state.byId.get(fighter.id).cond.frightened = 1;
    assert.equal(offered(), true, "at a frightened one");
    // Toss: its Shove as a creature comes into its reach.
    const bison = withBuiltins({ ...moderateCreature(5, "bison", "Bison"), engagement: 0, spells: [entry("Shove", basic.shove, "basic")] }, ["Test Toss", { builtin: "reaction-strike", triggers: ["approach"], strike: null, skill: "shove", penalty: 0, disrupts: false }]);
    const second = createFightState({ combatants: [{ ...fighter, engagement: 0 }, bison] }, {}, 1);
    second.log = [];
    const f = second.byId.get(fighter.id);
    f.actionsLeft = 3;
    stride(second, f, { kind: "engage", targetId: "bison" });
    assert.ok(second.log.some((line) => /Bison uses Test Toss/.test(line)), second.log.join("\n"));
});

test("A flurry's extra damage and critical rider, a Demoralize after the Strikes, one flourish a turn, Quickened after a resistance (Fan of Daggers, Hellfire Flurry, Haunting Assault, Overcharge, 2026-10-12, B152)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const flurry = { builtin: "multi-strike", actions: 1, strikes: [null, null], sameTarget: true, flourish: true, extraDamage: ["1d6[fire]"], critical: { conditions: [{ slug: "blinded", value: null, rounds: 1 }], damage: ["2d6[bleed]"] }, then: "demoralize" };
    const monk = withBuiltins({ ...moderateCreature(5, "monk", "Monk"), engagement: 1, spells: [entry("Demoralize", basic.demoralize, "basic")] }, ["Test Flurry", flurry]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 900, max: 900 } }, monk] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 20;
    const m = state.byId.get("monk");
    const f = state.byId.get(fighter.id);
    m.round = state.round;
    m.actionsLeft = 3;
    m.usedThisTurn = new Set();
    assert.deepEqual(m.multiStrikes[0].extraDamage, ["1d6[fire]"]);
    assert.equal(withExtraDamage(m.strikes[0], ["1d6[fire]"]).damage.at(-1).type, "fire");
    performAction(state, m, { type: "multiStrike", ability: 0, targetId: f.id, actions: 1 });
    // Critical hits: blinded, more damage; then its Demoralize; the flourish used.
    assert.ok(f.cond.blinded, state.log.join("\n"));
    assert.ok(state.log.some((line) => /Critical hit on/.test(line)), state.log.join("\n"));
    assert.ok(f.cond.frightened > 0, state.log.join("\n"));
    assert.ok(m.usedThisTurn.has("flourish"));
    assert.ok(!scoreOptions(state, m).options.some((option) => option.action.type === "multiStrike"), "one flourish a turn");
    // Overcharge: resistance against the electricity, then Quickened for 1d4 rounds.
    const golem = withBuiltins({ ...moderateCreature(5, "golem", "Golem"), engagement: 1 }, ["Test Surge", { builtin: "resist-damage", value: 20, on: ["electricity"], types: ["electricity"], quickened: "1d4" }]);
    const second = createFightState({ combatants: [{ ...fighter, engagement: 1 }, golem] }, {}, 1);
    second.log = [];
    const g = second.byId.get("golem");
    applyDamage(second, g, [{ type: "electricity", amount: 15, persistent: false, precision: false }], { source: second.byId.get(fighter.id) });
    assert.equal(g.hp.value, g.hp.max, second.log.join("\n"));
    assert.ok(g.cond.quickened, second.log.join("\n"));
});

test("Best ranged Strikes, once a fight, a Strike that deals no damage but heals, an ally's Strike after a hit, every hit on a mark (Double Shot, Heads Will Roll!, Draining Touch, Shared Feast, Lawbringer, 2026-10-12, B153)", () => {
    const [fighter] = martialParty(5);
    const base = moderateCreature(5, "archer", "Archer");
    const archer = { ...base, strikes: [...base.strikes, { ...base.strikes[0], name: "Shortbow", melee: false, range: 60, bonus: base.strikes[0].bonus + 1 }] };
    assert.equal(multiStrikeOrder(archer, { strikes: ["ranged", "ranged"] }).every((index) => archer.strikes[index].name === "Shortbow"), true);
    // Once a fight: not offered again after its use.
    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), engagement: 1 }, ["Test Sweep", { builtin: "multi-strike", actions: 2, strikes: [null, null], each: true, max: 2, sameMap: true, strides: 2, oncePerFight: true }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...martialParty(5)[1], engagement: 1 }, dragon] }, {}, 1);
    const d = state.byId.get("dragon");
    d.round = state.round;
    d.actionsLeft = 3;
    d.usedThisTurn = new Set();
    assert.ok(scoreOptions(state, d).options.some((option) => option.action.type === "multiStrike"));
    d.multiUsed = new Set(["Test Sweep"]);
    assert.ok(!scoreOptions(state, d).options.some((option) => option.action.type === "multiStrike"), "once a fight");
    // No damage, Drained and Hit Points back; an ally's Strike with its reaction.
    const drain = { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, noDamage: true, onHit: { conditions: [{ slug: "drained", value: 1, duration: { mode: "fixed", value: 1, unit: "days" } }], critical: null, push: null, damage: [], save: null, size: null, selfHeal: 4, allyStrike: true } };
    const ghost = withBuiltins({ ...moderateCreature(5, "ghost", "Ghost"), engagement: 1 }, ["Test Drain", drain]);
    const second = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, ghost, { ...moderateCreature(5, "wolf", "Wolf"), engagement: 1 }] }, {}, 1);
    second.log = [];
    second.rng.d20 = () => 15;
    const g = second.byId.get("ghost");
    g.hp.value -= 10;
    const f = second.byId.get(fighter.id);
    const activity = g.strikeActivities[0];
    const result = performStrike(second, g, f, chargeStrike(g.strikes[0], activity));
    assert.ok(result.degree >= 2, second.log.join("\n"));
    applyStrikeRider(second, g, f, activity, false, g.strikes[0]);
    assert.equal(f.cond.drained, 1, second.log.join("\n"));
    assert.equal(g.hp.value, g.hp.max - 6, second.log.join("\n"));
    assert.ok(second.log.some((line) => /Wolf Strikes with its reaction/.test(line)), second.log.join("\n"));
    assert.ok(f.hp.value < 500, "the wolf's Strike, not the touch, did damage");
    // A mark: its precision dice on every hit, not only the first each round.
    const marshal = withBuiltins({ ...moderateCreature(5, "marshal", "Marshal"), engagement: 1 }, ["Test Mark", { builtin: "hunt-prey", edge: "precision", dice: 2, die: 8, every: true }]);
    const third = createFightState({ combatants: [{ ...fighter, engagement: 1 }, marshal] }, {}, 1);
    const m = third.byId.get("marshal");
    m.prey = fighter.id;
    const parts = (first) => featureParts(m, m.strikes[0], third.byId.get(fighter.id), { firstPreyHit: first }).filter((part) => part.precision).length;
    assert.deepEqual([parts(true), parts(false)], [1, 1]);
});

test("Only while raging; a resistance that lashes back with what it resisted (Enraged Charge, Formless Backlash, 2026-10-12, B155)", () => {
    const [fighter] = martialParty(5);
    const sweep = { builtin: "multi-strike", actions: 2, strikes: [null], each: true, sameMap: true, strides: 1, requires: "raging", noMomentum: true };
    const drake = withBuiltins({ ...moderateCreature(5, "drake", "Drake"), engagement: 1 }, ["Test Charge", sweep]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...martialParty(5)[1], engagement: 1 }, drake] }, {}, 1);
    const d = state.byId.get("drake");
    d.round = state.round;
    d.actionsLeft = 3;
    d.usedThisTurn = new Set();
    const offered = () => scoreOptions(state, d).options.some((option) => option.action.type === "multiStrike");
    assert.equal(offered(), false, "not while calm");
    d.activeBuffs = [{ name: "Test Rage", noConcentrate: true }];
    assert.equal(offered(), true, "while raging");
    // The lash back: resistance 10 to the physical damage, then that much back on a hit.
    const blob = withBuiltins({ ...moderateCreature(5, "blob", "Blob"), engagement: 1 }, ["Test Backlash", { builtin: "resist-damage", value: 10, on: ["physical"], types: ["physical"], foe: true, lashBack: { bonus: 30 } }]);
    const second = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, blob] }, {}, 1);
    second.log = [];
    second.rng.d20 = () => 15;
    const b = second.byId.get("blob");
    const f = second.byId.get(fighter.id);
    applyDamage(second, b, [{ type: "slashing", amount: 14, persistent: false, precision: false }], { source: f, physical: true });
    assert.equal(b.hp.max - b.hp.value, 4, second.log.join("\n"));
    assert.equal(f.hp.value, 490, second.log.join("\n"));
});

test("A Strike, then a Shove hit or miss; Reactive Strike behind a state isn't loaded (Battering Blow, Coiled Strike, 2026-10-12, B156)", { skip }, async () => {
    const { basic } = await packAbilities();
    const [fighter] = martialParty(5);
    const activity = { builtin: "strike-activity", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, afterStrike: "shove", onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null } };
    const guard = withBuiltins({ ...moderateCreature(5, "guard", "Guard"), engagement: 1, spells: [entry("Shove", basic.shove, "basic")] }, ["Test Blow", activity]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, guard] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 2;
    const g = state.byId.get("guard");
    g.actionsLeft = 3;
    performAction(state, g, { type: "strikeActivity", index: 0, targetId: fighter.id, strikeIndex: 0, actions: 1 });
    assert.ok(state.log.some((line) => /Shove/.test(line)), state.log.join("\n"));
    const snake = { ...moderateCreature(5, "snake", "Snake") };
    assert.equal(addBuiltin(snake, { builtin: "reactive-strike", requires: "requirement", note: "Only while coiled." }, "Test Coiled Strike"), false);
});

test("A Strike whose damage is rolled three times (Flog Mercilessly, 2026-10-12, B156)", () => {
    const base = moderateCreature(5, "flogger", "Flogger");
    const strike = { ...base.strikes[0], damage: [{ dice: 1, die: 4, bonus: 2, multiplier: 1, type: "slashing", persistent: false, precision: false }] };
    assert.equal(chargeStrike(strike, { name: "Test Flog", damageTimes: 3 }).damage[0].multiplier, 3);
    assert.equal(chargeStrike(strike, { name: "Plain" }), strike);
});

test("A guard only while its own stance is on it (Mountain Stronghold, 2026-10-12, B158)", () => {
    const [fighter] = martialParty(5);
    const guard = { builtin: "self-effect", actions: 1, model: { name: "Test Stronghold", rounds: 1, modifiers: [{ on: "ac", type: "circumstance", value: 2 }], tempHp: 0 }, duration: { value: 1, unit: "rounds", expiry: "turn-start" }, requiresEffect: "Test Stance" };
    const monk = withBuiltins({ ...moderateCreature(5, "monk", "Monk"), engagement: 1 }, ["Test Stronghold", guard]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, monk] }, {}, 1);
    const m = state.byId.get("monk");
    m.round = state.round;
    m.actionsLeft = 3;
    const offered = () => scoreOptions(state, m).options.some((option) => option.action.type === "selfEffect");
    assert.equal(offered(), false, "not out of its stance");
    m.effects = [{ key: "self:Test Stance", model: { name: "Test Stance", rounds: Infinity, modifiers: [] } }];
    assert.equal(offered(), true, "in its stance");
});

test("Fling: the creature it holds falls, takes half the fall as damage, lands Prone and is let go (2026-10-12, B160)", { skip }, async () => {
    const { compileMonsterAbility } = await import(ABILITIES);
    const [fighter] = martialParty(5);
    const plan = compileMonsterAbility({ type: "action", name: "Test Fling", system: { slug: null, actionType: { value: "action" }, actions: { value: 1 }, traits: { value: [] }, description: { value: "<p><strong>Requirements</strong> A creature is Grabbed in the test lizard's jaws</p><hr /><p><strong>Effect</strong> The test lizard flings the creature into the air up to 10 feet up from its mouth and 20 feet away. The creature falls 25 feet and takes falling damage accordingly.</p>" } } }, { basicActions: {} });
    const lizard = { ...moderateCreature(5, "lizard", "Lizard"), engagement: 1, spells: [entry("Test Fling", plan)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, lizard] }, {}, 1);
    state.log = [];
    const l = state.byId.get("lizard");
    const f = state.byId.get(fighter.id);
    applyCondition(state, f, "grabbed", null, null, l);
    castSpell(state, l, 0, [f.id]);
    assert.deepEqual([f.hp.value, Boolean(f.cond.prone), Boolean(f.cond.grabbed)], [488, true, false], state.log.join("\n"));
});

test("Dero Medicine: healing itself or an ally it touches (2026-10-12, B161)", { skip }, async () => {
    const { compileMonsterAbility } = await import(ABILITIES);
    const [fighter] = martialParty(5);
    const plan = compileMonsterAbility({ type: "action", name: "Test Medicine", system: { slug: null, actionType: { value: "action" }, actions: { value: 1 }, traits: { value: [] }, description: { value: "<p><strong>Requirements</strong> The test dero is wearing a cytillesh toolkit and has a hand free</p><hr /><p><strong>Effect</strong> The test dero stitches wounds shut, healing themself or an ally in reach for @Damage[10[healing]] Hit Points. For 1 hour, the target has slashing weakness 2 and is immune to Test Medicine.</p>" } } }, { basicActions: {} });
    const dero = { ...moderateCreature(5, "dero", "Dero"), engagement: 1, spells: [entry("Test Medicine", plan)] };
    const ally = { ...moderateCreature(5, "ally", "Ally"), engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dero, ally] }, {}, 1);
    state.log = [];
    const a = state.byId.get("ally");
    a.hp.value -= 20;
    castSpell(state, state.byId.get("dero"), 0, [a.id]);
    assert.equal(a.hp.max - a.hp.value, 10, state.log.join("\n"));
});

test("A mark whose Strikes against it gain deadly (Mark for Death, 2026-10-12, B164)", () => {
    const [fighter] = martialParty(5);
    const assassin = withBuiltins({ ...moderateCreature(5, "assassin", "Assassin"), engagement: 1 }, ["Test Mark", { builtin: "hunt-prey", edge: "deadly", strike: null, die: 8 }]);
    const run = (marked) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 900, max: 900 } }, assassin] }, {}, 1);
        state.rng.d20 = () => 20;
        state.rng.die = (sides) => sides;
        const a = state.byId.get("assassin");
        const f = state.byId.get(fighter.id);
        if (marked) a.prey = f.id;
        performStrike(state, a, f, a.strikes[0]);
        return 900 - f.hp.value;
    };
    assert.equal(run(true) - run(false), 8);
});

test("A buff for its next Strike only, spent by that Strike (Trick Attack, 2026-10-12, B166)", () => {
    const [fighter] = martialParty(5);
    const buff = { builtin: "self-effect", actions: 1, model: { name: "Test Trick", rounds: 0, modifiers: [], tempHp: 0 }, damage: ["2d6[precision]"], strike: null, melee: false, duration: { value: 0, unit: "rounds", expiry: "turn-end" }, nextStrike: true };
    const raider = withBuiltins({ ...moderateCreature(5, "raider", "Raider"), engagement: 1 }, ["Test Trick", buff]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 900, max: 900 } }, raider] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const r = state.byId.get("raider");
    r.actionsLeft = 3;
    performAction(state, r, { type: "selfEffect", index: 0, actions: 1 });
    assert.ok((r.effects ?? []).some((effect) => effect.key === "self:Test Trick"), state.log.join("\n"));
    performStrike(state, r, state.byId.get(fighter.id), r.strikes[0]);
    assert.ok(!(r.effects ?? []).some((effect) => effect.key === "self:Test Trick"), "spent by the Strike");
});

test("Attack of Opportunity for its allies of a trait until the end of their next turn (Tactical Direction, 2026-10-12, B167)", () => {
    const [fighter] = martialParty(5);
    const commander = withBuiltins({ ...moderateCreature(5, "commander", "Commander"), engagement: 1, traits: ["undead", "wight"] }, ["Test Direction", { builtin: "grant-aoo", actions: 2, within: 30, trait: "wight" }]);
    const wight = { ...moderateCreature(5, "wight", "Wight"), engagement: 1, traits: ["undead", "wight"] };
    const ghoul = { ...moderateCreature(5, "ghoul", "Ghoul"), engagement: 1, traits: ["undead", "ghoul"] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, commander, wight, ghoul] }, {}, 1);
    state.log = [];
    const c = state.byId.get("commander");
    c.actionsLeft = 3;
    assert.ok(scoreOptions(state, c).options.some((option) => option.action.type === "grantAoo"), "an option while a wight lacks it");
    performAction(state, c, { type: "grantAoo", actions: 2 });
    const w = state.byId.get("wight");
    assert.equal(w.reactions.aoo, true, state.log.join("\n"));
    assert.ok(!state.byId.get("ghoul").reactions.aoo, "only its trait");
    assert.ok(!scoreOptions(state, c).options.some((option) => option.action.type === "grantAoo"), "no option once they have it");
    turnEnd(state, w);
    assert.equal(w.reactions.aoo, false, "ends with the wight's turn");
});

test("A skill check as its allies save, the higher result resolving the effect (Drowning Drone, 2026-10-12, B168)", () => {
    const [fighter] = martialParty(5);
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const shriek = { modelVersion: 13, source: { name: "Test Shriek" }, rank: 1, traits: ["sonic"], activation: { time: "2", traits: [] }, targeting: { target: "2 creatures", range: null, area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 22 } }, sharedDamage: null, outcomes: { criticalSuccess: none, success: none, failure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } };
    const caster = { ...fighter, engagement: 1, spells: [entry("Test Shriek", shriek, null)] };
    const seer = withBuiltins({ ...moderateCreature(5, "seer", "Seer"), engagement: 1, skills: { performance: 14 } }, ["Test Drone", { builtin: "save-skill", skill: "performance", against: ["auditory", "sonic"], ally: true, within: 60, allyTrait: "boggard" }]);
    const boggard = { ...moderateCreature(5, "bog", "Boggard"), engagement: 1, traits: ["boggard", "humanoid"] };
    const other = { ...moderateCreature(5, "oth", "Other"), engagement: 1, traits: ["humanoid"] };
    const state = createFightState({ combatants: [caster, seer, boggard, other] }, {}, 1);
    state.log = [];
    const rolls = [2, 18, 2];
    state.rng.d20 = () => rolls.shift() ?? 2;
    castPlan(state, state.byId.get(fighter.id), state.byId.get(fighter.id).spells[0], ["bog", "oth"]);
    assert.ok(state.log.some((line) => /Seer uses Test Drone: performance 32/.test(line)), state.log.join("\n"));
    assert.ok(!state.byId.get("bog").cond.frightened, "the boggard keeps the Performance result");
    assert.ok(state.byId.get("oth").cond.frightened, "not its kind of ally");
    assert.equal(state.byId.get("seer").reactionUsed, true);
});

test("A success instead of a failed save, once a fight (Flash of Insight, 2026-10-12, B169)", () => {
    const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
    const row = (effects = []) => ({ damage: { ...none }, effects });
    const save = (dc) => ({ name: "Test Blast", castRank: 1, dc: null, attack: null, pool: null, plan: { modelVersion: 13, source: { name: "Test Blast" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: false, against: { dc: "fixed", value: dc } }, sharedDamage: null, outcomes: { criticalSuccess: row(), success: row(), failure: row([{ kind: "condition", slug: "frightened", value: 1, duration: null }]), criticalFailure: row([{ kind: "condition", slug: "frightened", value: 2, duration: null }]) } } } });
    const [fighter] = martialParty(5);
    const seer = { ...moderateCreature(5, "seer", "Seer"), engagement: 1 };
    assert.equal(addBuiltin(seer, { builtin: "save-boost", toSuccess: true, uses: 1, free: true }, "Test Insight"), true);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, seer] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 1;
    const s = state.byId.get("seer");
    // A critical failure made a success (not one degree better), its reaction kept.
    castPlan(state, state.byId.get("fighter"), save(10 + s.saves.reflex + 12), ["seer"]);
    assert.ok(state.log.includes("  Seer uses Test Insight: Seer's save success"), state.log.join("\n"));
    assert.equal(s.cond.frightened ?? 0, 0);
    assert.ok(!s.reactionUsed);
    castPlan(state, state.byId.get("fighter"), save(10 + s.saves.reflex + 12), ["seer"]);
    assert.equal(s.cond.frightened, 2, "once a fight");
});

test("Its allies' initiative higher when it rolls Perception (Guide's Warning, 2026-10-12, B170)", () => {
    const [fighter] = martialParty(5);
    const guide = withBuiltins({ ...moderateCreature(5, "guide", "Guide"), stealth: 10 }, ["Test Warning", { builtin: "initiative-warning", value: 50 }]);
    const ally = { ...moderateCreature(5, "ally", "Ally") };
    const { log } = simulate({ combatants: [fighter, guide, ally] }, {}, 1, { log: true });
    assert.equal(log[0], "  Guide uses Test Warning: +50 to its allies' initiative");
    assert.match(log[log.indexOf("— Round 1 —") + 1], /^Ally \(/, "the ally first");
    // Rolling Stealth for an ambush, not Perception: no warning.
    const ambush = simulate({ combatants: [fighter, guide, ally], setup: { ambush: "foes" } }, {}, 1, { log: true });
    assert.ok(!ambush.log.some((line) => /uses Test Warning/.test(line)));
});

test("A Strike that misses it sent at another creature beside it, rerolled (Sidestep, 2026-10-12, B171)", () => {
    const party = martialParty(5);
    const [fighter, other] = party;
    const assassin = withBuiltins({ ...moderateCreature(5, "assassin", "Assassin"), engagement: 1 }, ["Test Sidestep", { builtin: "redirect-attack" }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...other, engagement: 1, hp: { value: 900, max: 900 } }, assassin] }, {}, 1);
    state.log = [];
    const rolls = [2, 19];
    state.rng.d20 = () => rolls.shift() ?? 10;
    const f = state.byId.get(fighter.id);
    const a = state.byId.get("assassin");
    performStrike(state, f, a, f.strikes[0]);
    assert.ok(state.log.some((line) => line === `  Assassin uses Test Sidestep: the attack goes to ${other.name}`), state.log.join("\n"));
    assert.ok(state.byId.get(other.id).hp.value < 900, "the reroll hit the other creature");
    assert.equal(a.reactionUsed, true);
    assert.equal(f.attacksThisTurn, 1, "one attack for its multiple attack penalty");
});

test("Reactive Strike until the granter's next turn ends, an ally that uses it immune after (Call to Arms, 2026-10-12, B176)", () => {
    const [fighter] = martialParty(5);
    const vanguard = withBuiltins({ ...moderateCreature(5, "vanguard", "Vanguard"), engagement: 1, traits: ["caligni", "humanoid"] }, ["Test Call", { builtin: "grant-aoo", actions: 1, within: 30, trait: "caligni", until: "source", usedOnce: true }]);
    const caligni = { ...moderateCreature(5, "cal", "Caligni"), engagement: 1, traits: ["caligni", "humanoid"] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 900, max: 900 } }, vanguard, caligni] }, {}, 1);
    state.log = [];
    const v = state.byId.get("vanguard");
    const cal = state.byId.get("cal");
    v.actionsLeft = 3;
    performAction(state, v, { type: "grantAoo", actions: 1 });
    assert.equal(cal.reactions.aoo, true, state.log.join("\n"));
    turnEnd(state, cal);
    assert.equal(cal.reactions.aoo, true, "not with the ally's own turn");
    turnEnd(state, v);
    assert.equal(cal.reactions.aoo, true, "not with the turn it was given in");
    // Used: immune to it after.
    provokeFor(state, state.byId.get(fighter.id), "move");
    assert.ok(state.log.some((line) => /Caligni Attack of Opportunity/.test(line)), state.log.join("\n"));
    state.round++;
    turnEnd(state, v);
    assert.equal(cal.reactions.aoo, false, "ends with the granter's next turn");
    cal.reactionUsed = false;
    v.actionsLeft = 3;
    assert.ok(!scoreOptions(state, v).options.some((option) => option.action.type === "grantAoo"), "immune after using it");
});

test("A rune detonated on the creature that damaged it (Retributive Rune, 2026-10-12, B177)", () => {
    const [fighter] = martialParty(5);
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const rune = { modelVersion: 13, source: { name: "Test Rune" }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target: "the attacker", range: "touch", area: null }, trigger: { event: "hit-by", reaction: true, melee: false, within: 15 }, resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: none, success: { damage: { mode: "formulas", formulas: [{ formula: "5d6[untyped]" }], rollScope: "outcome" }, effects: [] }, failure: none, criticalFailure: none } } };
    const dragon = { ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, hp: { value: 900, max: 900 }, spells: [entry("Test Rune", rune, null)] };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 500, max: 500 } }, dragon] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 19;
    state.rng.die = (sides) => sides;
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("dragon"), f.strikes[0]);
    assert.ok(state.log.some((line) => /Dragon reacts with Test Rune/.test(line)), state.log.join("\n"));
    assert.equal(500 - f.hp.value, 30, "5d6 at its most");
});

test("An initiative bonus for its allies within 10 feet only (Warning Ears, 2026-10-12, B178)", () => {
    const [fighter] = martialParty(5);
    const courser = withBuiltins({ ...moderateCreature(5, "courser", "Courser"), engagement: 1 }, ["Test Ears", { builtin: "initiative-warning", value: 50, within: 10, free: true }]);
    const near = { ...moderateCreature(5, "near", "Near"), engagement: 1 };
    const far = { ...moderateCreature(5, "far", "Far"), band: "far" };
    const { log } = simulate({ combatants: [{ ...fighter, engagement: 1 }, courser, near, far] }, {}, 1, { log: true });
    assert.equal(log[0], "  Courser uses Test Ears: +50 to its allies' initiative");
    assert.match(log[log.indexOf("— Round 1 —") + 1], /^Near \(/, "the ally beside it first");
});

test("An ally's failed save rerolled, a critical failure on it a failure (2026-10-12, B181)", () => {
    const [fighter] = martialParty(5);
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const scare = { modelVersion: 13, source: { name: "Test Scare" }, rank: 1, traits: ["fear", "mental"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: null, area: null }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "will", basic: false, against: { dc: "fixed", value: 60 } }, sharedDamage: null, outcomes: { criticalSuccess: none, success: none, failure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }, criticalFailure: { damage: none.damage, effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] } } } };
    const caster = { ...fighter, engagement: 1, spells: [entry("Test Scare", scare, null)] };
    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), engagement: 1 }, ["Test Purify", { builtin: "save-reroll", ally: true, within: 30, against: ["fear", "poison", "disease"], keep: "new", floor: "failure" }]);
    const ally = { ...moderateCreature(5, "aly", "Ally"), engagement: 1 };
    const state = createFightState({ combatants: [caster, dragon, ally] }, {}, 1);
    state.log = [];
    castPlan(state, state.byId.get(fighter.id), state.byId.get(fighter.id).spells[0], ["aly"]);
    assert.ok(state.log.some((line) => /Dragon uses Test Purify: Ally rerolls, failure/.test(line)), state.log.join("\n"));
    assert.equal(state.byId.get("aly").cond.frightened, 1, "frightened 1, not 2");
});

test("A shield for itself or an ally as either is attacked (2026-10-12, B182)", () => {
    const [fighter] = martialParty(5);
    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), engagement: 1, hp: { value: 900, max: 900 } }, ["Test Shield", { builtin: "ally-ac-reaction", value: 2, type: "circumstance", within: 15, self: true }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon] }, {}, 1);
    state.log = [];
    const d = state.byId.get("dragon");
    const f = state.byId.get(fighter.id);
    // A roll that just hits its AC: +2 turns it aside.
    const strike = f.strikes[0];
    state.rng.d20 = () => Math.max(2, Math.min(19, armorClass(d) - strike.bonus));
    performStrike(state, f, d, strike);
    assert.ok(state.log.some((line) => /Dragon uses Test Shield: Dragon \+2 AC/.test(line)), state.log.join("\n"));
    assert.equal(d.reactionUsed, true);
});

test("An ally Strides once and Strikes once, with extra damage on a hit (Word of Advice, 2026-10-12, B183)", () => {
    const [fighter] = martialParty(5);
    const dragon = withBuiltins({ ...moderateCreature(5, "dragon", "Dragon"), band: "near" }, ["Test Advice", { builtin: "ally-advance", actions: 1, within: 60, extraDamage: ["2d6[fire]"], oncePerTurn: true }]);
    const student = { ...moderateCreature(5, "student", "Student"), band: "near" };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", hp: { value: 900, max: 900 } }, dragon, student] }, {}, 1);
    state.log = [];
    const d = state.byId.get("dragon");
    d.actionsLeft = 3;
    d.usedThisTurn = new Set();
    const option = scoreOptions(state, d).options.find((entry) => entry.action.type === "allyAdvance");
    assert.ok(option, "an option");
    state.rng.d20 = () => 15;
    state.rng.die = (sides) => sides;
    performAction(state, d, option.action);
    const f = state.byId.get(fighter.id);
    assert.ok(state.log.some((line) => /Dragon uses Test Advice: Student (?:Strides and )?Strikes/.test(line)), state.log.join("\n"));
    assert.ok(f.hp.value < 900, state.log.join("\n"));
    assert.ok(d.usedThisTurn.has("Test Advice"));
});

test("Two Strikes at its full bonus only at a helpless creature (Ravage, 2026-10-12, B186)", () => {
    const [fighter] = martialParty(5);
    const devourer = withBuiltins({ ...moderateCreature(5, "dev", "Devourer"), engagement: 1 }, ["Test Ravage", { builtin: "multi-strike", actions: 3, strikes: [null, null], sameTarget: true, noMap: true, requires: "helpless" }]);
    const options = (condition) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, devourer] }, {}, 1);
        const d = state.byId.get("dev");
        d.actionsLeft = 3;
        if (condition) state.byId.get(fighter.id).cond[condition] = condition === "unconscious" ? true : 1;
        return scoreOptions(state, d).options.filter((option) => option.action.type === "multiStrike");
    };
    assert.equal(options(null).length, 0);
    assert.ok(options("paralyzed").length > 0);
});

test("A melee Strike at it sent at another creature beside it as it's made (Hop-Dodge, 2026-10-12, B191)", () => {
    const [fighter, other] = martialParty(5);
    const bird = withBuiltins({ ...moderateCreature(5, "bird", "Bird"), engagement: 1, hp: { value: 900, max: 900 } }, ["Test Hop", { builtin: "redirect-attack", when: "targeted", melee: true }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...other, engagement: 1, hp: { value: 900, max: 900 } }, bird] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 19;
    const f = state.byId.get(fighter.id);
    performStrike(state, f, state.byId.get("bird"), f.strikes.find((strike) => strike.melee));
    assert.ok(state.log.some((line) => line === `  Bird uses Test Hop: the Strike goes to ${other.name}`), state.log.join("\n"));
    assert.equal(state.byId.get("bird").hp.value, 900);
    assert.ok(state.byId.get(other.id).hp.value < 900);
    assert.equal(f.attacksThisTurn, 1);
});

test("A ranged spell attack at it rolled twice, the worse kept; a spell aimed at it resisted by the spell's rank (Ray Displacement, Divert Essence, 2026-10-12, B193)", () => {
    const rows = (hit) => Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: { mode: hit.includes(degree) ? "shared" : "none", multiplier: hit.includes(degree) ? 1 : 0, sourceComponentIds: hit.includes(degree) ? ["0"] : [] }, effects: [] }]));
    const bolt = { name: "Test Bolt", castRank: 4, dc: 20, attack: 10, pool: null, plan: { modelVersion: 12, source: { name: "Test Bolt", uuid: "Compendium.pf2e.spells-srd.Item.aaaaaaaaaaaaaaaa" }, rank: 4, traits: ["attack", "fire"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "60 feet", area: null }, resolution: { kind: "save", check: { statistic: "spell-attack" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "30", type: "fire" }] }, outcomes: rows(["criticalSuccess", "success"]) } } };
    const fight = (builtin) => {
        const [caster] = martialParty(5);
        const dragon = withBuiltins({ ...moderateCreature(5, "drg", "Dragon"), engagement: 1, hp: { value: 300, max: 300 } }, ["Test Answer", builtin]);
        const state = createFightState({ combatants: [{ ...caster, id: "caster", spells: [bolt], spellPools: {} }, dragon] }, {}, 1);
        state.log = [];
        return { state, c: state.byId.get("caster"), d: state.byId.get("drg") };
    };
    // Twice, the worse: a 20 and a 3 — a miss.
    let { state, c, d } = fight({ builtin: "attack-misfortune", spell: true, ranged: true });
    const rolls = [20, 3];
    state.rng.d20 = () => rolls.shift() ?? 10;
    castSpell(state, c, 0, ["drg"], 2);
    assert.ok(state.log.includes("  Dragon uses Test Answer") && d.reactionUsed, state.log.join("\n"));
    assert.equal(d.hp.value, 300, "the worse roll misses");
    // Not a Strike's.
    ({ state, c, d } = fight({ builtin: "attack-misfortune", spell: true, ranged: true }));
    state.rng.d20 = () => 15;
    performStrike(state, c, d, c.strikes[0]);
    assert.ok(!d.reactionUsed);
    // Resistance 4 (the spell's rank) against the spell aimed at it; not against a Strike.
    ({ state, c, d } = fight({ builtin: "resist-damage", value: "rank", spell: true, on: null, types: ["spells"], lasts: 1, until: "turn-start" }));
    assert.equal(applyDamage(state, d, [{ type: "slashing", amount: 10, persistent: false, precision: false }], { source: c }), 10);
    assert.ok(!d.reactionUsed, "not a spell's damage");
    state.rng.d20 = () => 15;
    castSpell(state, c, 0, ["drg"], 2);
    assert.ok(state.log.includes("  Dragon uses Test Answer: resistance 4 against it"), state.log.join("\n"));
    assert.equal(d.hp.value, 300 - 10 - 26);
});

test("A free follow-up to a Strike that hit, used at once: a Dirty Trick after a tail Strike (Improved Vex, 2026-10-12, B194)", () => {
    const none = () => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] });
    const clumsy = () => ({ ...none(), effects: [{ kind: "condition", slug: "clumsy", value: 1, duration: null }] });
    const plan = { modelVersion: 13, source: { name: "Test Vex" }, rank: 1, traits: [], activation: { time: "free", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch", area: null },
        trigger: { event: "use", map: false, cost: "free", followUp: { strike: "tail", melee: false, on: ["success", "criticalSuccess"] } },
        resolution: { kind: "check", check: { roll: "skill", statistic: "thievery", against: { dc: "target", statistic: "reflex" } }, sharedDamage: null, outcomes: { criticalSuccess: clumsy(), success: clumsy(), failure: none(), criticalFailure: none() } } };
    const drake = { ...moderateCreature(5, "drake", "Drake"), engagement: 1, spells: [{ name: "Test Vex", plan, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    drake.strikes = [{ ...drake.strikes[0], name: "Jaws" }, { ...drake.strikes[0], name: "Tail" }];
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, drake] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 19;
    const d = state.byId.get("drake");
    triggerRiders(state, d, state.byId.get("fighter"), d.strikes[0], 2);
    assert.ok(!state.log.some((line) => /casts Test Vex/.test(line)), "not after a jaws hit");
    triggerRiders(state, d, state.byId.get("fighter"), d.strikes[1], 2);
    assert.ok(state.log.some((line) => /Drake casts Test Vex at Fighter/.test(line)), state.log.join("\n"));
    assert.equal(d.riderReady?.index, undefined, "not left as its next action");
    assert.equal(state.byId.get("fighter").cond.clumsy, 1);
});

test("An ally that dies back at half its Hit Points, once (Reawaken!); a foe's healing at its least, and temporary Hit Points (Siphon Life, 2026-10-12, B195)", () => {
    const [fighter, cleric] = martialParty(5);
    // Back at half, once a creature; not for a PC that drops.
    let dragon = withBuiltins({ ...moderateCreature(5, "drg", "Dragon"), engagement: 1 }, ["Test Return", { builtin: "rescue", within: null, sees: true, hp: "half", living: true, oncePerTarget: true, onDeath: true }]);
    let state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, dragon, { ...moderateCreature(5, "ogre", "Ogre"), engagement: 1, hp: { value: 10, max: 100 } }] }, {}, 1);
    state.log = [];
    const ogre = state.byId.get("ogre");
    applyDamage(state, ogre, [{ type: "slashing", amount: 15, persistent: false, precision: false }], { source: state.byId.get(fighter.id) });
    assert.ok(state.log.includes("  Dragon uses Test Return: Ogre returns to life at 50 HP") && isActive(ogre), state.log.join("\n"));
    state.byId.get("drg").reactionUsed = false;
    applyDamage(state, ogre, [{ type: "slashing", amount: 60, persistent: false, precision: false }], { source: state.byId.get(fighter.id) });
    assert.ok(!isActive(ogre), "only once");
    assert.equal(addBuiltin({ ...moderateCreature(5, "x", "X") }, { builtin: "rescue", within: null, sees: true, hp: 0, dying: 1, onDeath: true }, "Test Dying"), false, "returned dying isn't played");
    // A foe's healing at its least: 2d8+8 → 2 + 4.
    const heal = { name: "Test Mend", castRank: 1, dc: 20, attack: 10, pool: null, plan: { modelVersion: 13, source: { name: "Test Mend" }, rank: 1, traits: ["healing"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "2d8+8", kinds: ["healing"] }], recipients: "any" } } } } };
    dragon = withBuiltins({ ...moderateCreature(5, "drg", "Dragon"), engagement: 1 }, ["Test Siphon", { builtin: "heal-siphon", within: 60, tempHp: "4d8", tempRounds: 1 }]);
    state = createFightState({ combatants: [{ ...fighter, engagement: 1, hp: { value: 10, max: 80 } }, { ...cleric, id: "cleric", spells: [heal], spellPools: {} }, dragon] }, {}, 1);
    state.log = [];
    state.rng.die = (sides) => sides;
    castSpell(state, state.byId.get("cleric"), 0, [fighter.id], 2);
    assert.ok(state.log.includes("  Dragon uses Test Siphon: the healing is at its least"), state.log.join("\n"));
    assert.equal(state.byId.get(fighter.id).hp.value, 16);
    assert.equal(state.byId.get("drg").hp.temp, 32);
});

test("Resistance and temporary Hit Points on itself, ending with them (Reef Armor, 2026-10-12, B196)", () => {
    const [fighter] = martialParty(5);
    const turtle = withBuiltins({ ...moderateCreature(5, "trt", "Turtle"), engagement: 1 }, ["Test Shell", { builtin: "self-effect", actions: 2, model: { name: "Test Shell", rounds: 10, modifiers: [], tempHp: 20, resistances: [{ type: "slashing", value: 5, exceptions: [] }], endsWithTempHp: true }, duration: { value: 1, unit: "minutes", expiry: null } }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, turtle] }, {}, 1);
    state.log = [];
    const t = state.byId.get("trt");
    const f = state.byId.get(fighter.id);
    t.round = 1;
    t.actionsLeft = 3;
    const option = scoreOptions(state, t).options.find((entry) => entry.action.type === "selfEffect");
    assert.ok(option, "on offer");
    performAction(state, t, option.action);
    assert.equal(t.hp.temp, 20);
    const hp = t.hp.value;
    // 12 slashing − 5: 7 off the temporary Hit Points.
    applyDamage(state, t, [{ type: "slashing", amount: 12, persistent: false, precision: false }], { source: f });
    assert.deepEqual([t.hp.temp, t.hp.value], [13, hp]);
    // 25 more − 5: the temporary Hit Points gone, 7 through, and the effect with them.
    applyDamage(state, t, [{ type: "slashing", amount: 25, persistent: false, precision: false }], { source: f });
    assert.deepEqual([t.hp.temp, t.hp.value], [0, hp - 7]);
    assert.ok(state.log.includes("  Turtle's Test Shell ends") && !(t.effects ?? []).some((effect) => effect.key === "Test Shell"), state.log.join("\n"));
    applyDamage(state, t, [{ type: "slashing", amount: 10, persistent: false, precision: false }], { source: f });
    assert.equal(t.hp.value, hp - 17, "no resistance once it ends");
});

test("A Strike as its reaction at a creature it just grabbed, once the action ends (Deadly Mandibles, 2026-10-12, B197)", () => {
    const [fighter] = martialParty(5);
    const mantis = withBuiltins({ ...moderateCreature(5, "man", "Mantis"), engagement: 1 }, ["Test Mandibles", { builtin: "reaction-strike", triggers: ["grabs"], strike: "mandibles", penalty: 0, disrupts: false }]);
    mantis.strikes = [{ ...mantis.strikes[0], name: "Leg" }, { ...mantis.strikes[0], name: "Mandibles" }];
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, mantis] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 15;
    const m = state.byId.get("man");
    const f = state.byId.get(fighter.id);
    applyCondition(state, f, "grabbed", null, null, m);
    assert.equal(state.afterAction?.length, 1);
    performAction(state, m, { type: "strike", targetId: f.id, strikeIndex: 0 });
    assert.ok(state.log.includes("  Mantis uses Test Mandibles") && m.reactionUsed, state.log.join("\n"));
    assert.ok(state.log.some((line) => /Mantis Mandibles → Fighter/.test(line)), state.log.join("\n"));
});

test("Both hits expose the creature to the monster's affliction (Gory Rend, 2026-10-12, B198)", () => {
    const none = () => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] });
    const venom = { modelVersion: 13, source: { name: "Test Venom", slug: "test-venom" }, rank: 1, traits: ["poison"], activation: { time: "free", traits: [] }, targeting: { target: "1 creature", range: null, area: null },
        trigger: { event: "strike", on: ["success", "criticalSuccess"], attackEffect: "test-venom", cost: "free", map: false },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 40 } }, sharedDamage: null, outcomes: { criticalSuccess: none(), success: none(), failure: { ...none(), effects: [{ kind: "condition", slug: "sickened", value: 1, duration: null }] }, criticalFailure: { ...none(), effects: [{ kind: "condition", slug: "sickened", value: 2, duration: null }] } } } };
    const fiend = { ...moderateCreature(5, "fnd", "Fiend"), engagement: 1, spells: [{ name: "Test Venom", plan: venom, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, fiend] }, {}, 1);
    state.log = [];
    state.rng.d20 = () => 2;
    const f = state.byId.get(fighter.id);
    bothHitRider(state, state.byId.get("fnd"), f, { conditions: [], damage: [], affliction: "test-venom" });
    assert.ok(state.log.some((line) => /Fiend casts Test Venom at Fighter/.test(line)) && f.cond.sickened >= 1, state.log.join("\n"));
});

test("A Stride and a Strike as it rolls initiative, never planned after (Uncanny Pounce, 2026-10-12, B199)", () => {
    const [fighter] = martialParty(5);
    const cat = withBuiltins({ ...moderateCreature(5, "cat", "Cat"), engagement: 1 }, ["Test Pounce", { builtin: "strike-activity", actions: 0, strides: 1, strike: "claw", attackBonus: 0, damageBonus: 0, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, initiative: true }]);
    cat.strikes = [{ ...cat.strikes[0], name: "Claw" }];
    const result = simulate({ combatants: [{ ...fighter, engagement: 1 }, cat] }, { maxRounds: 1 }, 3, { log: true });
    const log = result.log.join("\n");
    const start = log.indexOf("— Round 1 —");
    assert.ok(log.slice(0, start).includes("Cat uses Test Pounce"), log.slice(0, 2000));
    assert.equal((log.slice(start).match(/Cat uses Test Pounce/g) ?? []).length, 0, "not planned in its turns");
});

test("Three Strikes, then Fatigued for the fight; not again while Fatigued (Power Through, 2026-10-12, B200)", () => {
    const [fighter, champion, ranger] = martialParty(5);
    const brute = withBuiltins({ ...moderateCreature(5, "brt", "Brute"), engagement: 1 }, ["Test Through", { builtin: "multi-strike", actions: 2, strikes: [null, null, null], sameMap: true, each: true, max: 3, requires: "not-fatigued", after: [{ slug: "fatigued", value: null, until: "save" }] }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1 }, { ...ranger, engagement: 1 }, brute] }, {}, 1);
    state.log = [];
    const b = state.byId.get("brt");
    b.round = 1;
    b.actionsLeft = 3;
    const option = scoreOptions(state, b).options.find((entry) => entry.action.type === "multiStrike");
    assert.ok(option, "on offer while not Fatigued");
    performAction(state, b, option.action);
    assert.equal(b.cond.fatigued, true, state.log.join("\n"));
    expireTimers(state, b, "start");
    assert.equal(b.cond.fatigued, true, "it lasts");
    b.actionsLeft = 3;
    assert.ok(!scoreOptions(state, b).options.some((entry) => entry.action.type === "multiStrike"), "not while Fatigued");
});

test("An ally's Stride and Strike as its reaction, each ally once (Kingpin's Command, 2026-10-12, B202)", () => {
    const [fighter] = martialParty(5);
    const boss = withBuiltins({ ...moderateCreature(5, "boss", "Boss"), band: "near" }, ["Test Command", { builtin: "ally-advance", actions: 1, within: 60, extraDamage: [], reaction: true, oncePerAlly: true }]);
    const thug = { ...moderateCreature(5, "thug", "Thug"), band: "near" };
    const state = createFightState({ combatants: [{ ...fighter, band: "near", hp: { value: 900, max: 900 } }, boss, thug] }, {}, 1);
    state.log = [];
    const b = state.byId.get("boss");
    const t = state.byId.get("thug");
    b.actionsLeft = 3;
    b.usedThisTurn = new Set();
    const option = scoreOptions(state, b).options.find((entry) => entry.action.type === "allyAdvance");
    assert.ok(option, "an option");
    performAction(state, b, option.action);
    assert.ok(t.reactionUsed, "the ally's reaction");
    t.reactionUsed = false;
    assert.ok(!scoreOptions(state, b).options.some((entry) => entry.action.type === "allyAdvance"), "not the same ally again");
});

test("A Strike activity only at an Off-Guard creature (Scorpion Sting, 2026-10-12, B206)", () => {
    const [fighter] = martialParty(5);
    const manticore = withBuiltins({ ...moderateCreature(5, "man", "Manticore"), engagement: 1 }, ["Test Sting", { builtin: "strike-activity", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, offGuard: false, requires: "off-guard", oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: ["4d8[poison]"], save: null, size: null } }]);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, manticore] }, {}, 1);
    const m = state.byId.get("man");
    m.round = 1;
    m.actionsLeft = 3;
    const offered = () => scoreOptions(state, m).options.some((entry) => entry.action.type === "strikeActivity");
    assert.equal(offered(), false, "not at a creature that isn't Off-Guard");
    state.byId.get(fighter.id).cond.prone = true;
    assert.equal(offered(), true, "at a Prone (Off-Guard) creature");
});
