import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage, dealDamage, expectedHitDamage, performStrike, stride } from "../src/engine/actions.js";
import { isActive, isOffGuard } from "../src/engine/combatant.js";
import { addBuiltin, chargeStrike, multiStrikeOrder, saveBonusAgainst } from "../src/engine/abilities.js";
import { applyAuras, applyCondition, applyStrikeRider, castSpell, expireTimers, retch, triggerRiders } from "../src/engine/spells.js";

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
    assert.deepEqual(h.riderReady, { index: 0, targetId: "fighter" });
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
