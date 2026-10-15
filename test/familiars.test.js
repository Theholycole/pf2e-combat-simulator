import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { canCast, castSpell, hexSustains } from "../src/engine/spells.js";
import { applyDamage } from "../src/engine/actions.js";
import { armorClass } from "../src/engine/combatant.js";
import { HEX_FAMILIARS, familiarOf } from "../src/engine/familiars.js";

// Familiars (2026-10-14; the user: "The simulator doesnt add familiars since they cant be added to initiative, so that makes classes
// like witch seem weaker than expected").
const row = (extra = {}) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...extra });
const hex = (name, extra = {}) => ({ name, castRank: 3, dc: 22, attack: 12, pool: null, plan: { modelVersion: 12, source: { name }, rank: 1, traits: ["cantrip", "hex", "witch"], activation: { time: "1" }, targeting: { target: "1 creature", range: "30 feet" },
    resolution: { kind: "save", check: { statistic: "will", basic: false }, outcomes: { criticalSuccess: row(), success: row(), failure: row({ effects: [{ kind: "condition", slug: "frightened", value: 1, duration: null }] }), criticalFailure: row({ effects: [{ kind: "condition", slug: "frightened", value: 2, duration: null }] }) } } }, ...extra });

function witchFight(ability, { extra = {}, familiar = {} } = {}) {
    const [fighter] = martialParty(5);
    const witch = { ...moderateCreature(5, "witch", "Witch"), side: "party", kind: "pc", spells: [hex("Hex One"), hex("Hex Two")], spellPools: {}, engagement: 1, hp: { value: 300, max: 300 }, ...extra };
    const pet = { ...moderateCreature(5, "familiar-pet", "Pet"), side: "party", kind: "npc", acts: false, strikes: [], spells: [], hp: { value: 25, max: 25 }, familiar: { masterId: "witch", hexAbility: ability, lifelink: false, focus: false, ...familiar } };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, witch, pet, { ...moderateCreature(5, "foe", "Foe"), engagement: 1, hp: { value: 300, max: 300 } }] }, {}, 1);
    state.log = [];
    return { state, witch: state.byId.get("witch"), pet: state.byId.get("familiar-pet"), foe: state.byId.get("foe") };
}

test("a hex Cast: one a turn; the familiar's patron ability answers it (Balanced Luck: the enemy's -1 to AC)", () => {
    assert.ok(HEX_FAMILIARS.has("familiar-of-balanced-luck"));
    const { state, witch, pet, foe } = witchFight("familiar-of-balanced-luck");
    assert.equal(familiarOf(state, witch), pet);
    const ac = armorClass(foe);
    witch.usedThisTurn = new Set();
    state.rng.d20 = () => 15;
    castSpell(state, witch, 0, ["foe"]);
    assert.equal(armorClass(foe), ac - 1, state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Pet (Hex One): Foe takes -1 to AC")));
    // The second hex this turn isn't castable.
    assert.equal(canCast(witch, witch.spells[1]), false);
    witch.usedThisTurn = new Set();
    assert.equal(canCast(witch, witch.spells[1]), true);
});

test("a hex Sustained answers too (Ongoing Misery: a timed condition a round longer, once); a dead familiar answers nothing", () => {
    const { state, witch, pet, foe } = witchFight("familiar-of-ongoing-misery");
    foe.cond.stupefied = 1;
    foe.timers = [{ key: "stupefied", value: 1, round: state.round + 1, turnOf: "witch", at: "start" }];
    witch.sustainedNow = ["Hex One"];
    hexSustains(state, witch);
    assert.equal(foe.timers[0].round, state.round + 2, state.log.join("\n"));
    hexSustains(state, witch);
    assert.equal(foe.timers[0].round, state.round + 2, "once for each case");
    pet.status = "dead";
    foe.timers.push({ key: "clumsy", value: 1, round: state.round + 1, turnOf: "witch", at: "start" });
    foe.cond.clumsy = 1;
    hexSustains(state, witch);
    assert.equal(foe.timers[1].round, state.round + 1);
});

test("the other patron abilities: Restored Spirit's temporary HP, Enticing Negotiation's off-guard, Paired Perplexity's stupefied, Overwhelming Tides' push", () => {
    let { state, witch, foe } = witchFight("familiar-of-restored-spirit");
    witch.hp.value = 100;
    castSpell(state, witch, 0, ["foe"]);
    assert.equal(witch.hp.temp, 4);
    ({ state, witch, foe } = witchFight("familiar-of-enticing-negotiation"));
    castSpell(state, witch, 0, ["foe"]);
    assert.equal(foe.cond.offGuard, true, state.log.join("\n"));
    ({ state, witch, foe } = witchFight("familiar-of-paired-perplexity"));
    castSpell(state, witch, 0, ["foe"]);
    assert.equal(foe.cond.stupefied, 1);
    ({ state, witch, foe } = witchFight("familiar-of-overwhelming-tides"));
    assert.ok(foe.meleeId !== null && foe.meleeId === witch.meleeId);
    castSpell(state, witch, 0, ["foe"]);
    assert.equal(foe.meleeId, null, state.log.join("\n"));
});

test("Lifelink: damage that would drop the familiar, its master takes; Familiar Focus restores a spent Focus Point once", async () => {
    const { state, witch, pet, foe } = witchFight("familiar-of-balanced-luck", { familiar: { lifelink: true, focus: true }, extra: { focusMax: 1, spellPools: { focus: 0 }, spells: [hex("Hex One"), { ...hex("Focus Hex"), pool: "focus" }] } });
    const before = witch.hp.value;
    applyDamage(state, pet, [{ type: "slashing", amount: 30 }], { source: foe });
    assert.equal(pet.hp.value, 25);
    assert.equal(witch.hp.value, before - 30);
    assert.ok(state.log.includes("  Witch uses Lifelink for Pet"));
    // A small hit, the familiar takes.
    applyDamage(state, pet, [{ type: "slashing", amount: 5 }], { source: foe });
    assert.equal(pet.hp.value, 20);
    witch.actionsLeft = 3;
    const { familiarFocusReady } = await import("../src/engine/familiars.js");
    assert.equal(familiarFocusReady(state, witch), true);
    performAction(state, witch, { type: "familiarFocus" });
    assert.equal(familiarFocusReady(state, witch), false);
    assert.equal(witch.spellPools.focus, 1);
    assert.equal(pet.familiar.focusUsed, true);
});

test("a familiar takes no turns, and its foes leave it be", async () => {
    const { simulate } = await import("../src/engine/fight.js");
    const [fighter] = martialParty(5);
    const witch = { ...moderateCreature(5, "witch", "Witch"), side: "party", kind: "pc", spells: [hex("Hex One")], spellPools: {}, band: "near" };
    const pet = { ...moderateCreature(5, "familiar-pet", "Pet"), side: "party", kind: "npc", acts: false, strikes: [], spells: [], hp: { value: 25, max: 25 }, familiar: { masterId: "witch", hexAbility: "familiar-of-balanced-luck" } };
    const result = simulate({ combatants: [fighter, witch, pet, { ...moderateCreature(5, "foe", "Foe") }] }, {}, 3, { log: true });
    assert.ok(result.outcome);
    assert.ok(!result.log.some((line) => line.startsWith("Pet (")), "no turns of its own");
    // (Its foes leave it be while there's a fight to win: it needn't be beaten.)
    assert.ok(!result.log.some((line) => line.includes("→ Pet")), result.log.join("\n"));
});
