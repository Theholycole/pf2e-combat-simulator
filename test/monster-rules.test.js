import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { createFightState, performAction, simulate, turnEnd } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage, dealDamage, expectedHitDamage, performStrike, provoke as provokeFor, stride } from "../src/engine/actions.js";
import { armorClass, isActive, isOffGuard } from "../src/engine/combatant.js";
import { addBuiltin, chargeOn, chargeStrike, deltasFor, multiStrikeOrder, saveBonusAgainst } from "../src/engine/abilities.js";
import { applyAuras, applyCondition, applyStrikeRider, castPlan, castSpell, deathThroes, expireTimers, grabTurnAnswers, ownTurnStart, retch, targetSets as targetSetsFor, triggerRiders } from "../src/engine/spells.js";
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
        venom: monster("Giant Scorpion", "Giant Scorpion Venom")
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
