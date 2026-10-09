import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, prepareSnapshot, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage, attackModifier, expectedHitDamage, forcefulBonus, stride } from "../src/engine/actions.js";
import { canStepOut, rangePenalty } from "../src/engine/space.js";
import { processMorale } from "../src/engine/morale.js";
import { scoreOptions } from "../src/engine/planner.js";
import { benchmarkEncounter } from "../src/engine/benchmarks.js";
import { mergeMoraleRules } from "../src/engine/morale-rules.js";

function fighterAndFoe({ foe = {}, fighter = {} } = {}) {
    const [pc] = martialParty(3);
    return {
        combatants: [
            { ...pc, ...fighter, engagement: 1 },
            { ...moderateCreature(3, "foe", "Foe"), ...foe, engagement: 1 }
        ]
    };
}

test("leaving a Melee with a Stride provokes Attack of Opportunity", () => {
    const state = createFightState(fighterAndFoe());
    const foe = state.byId.get("foe");
    stride(state, foe, { kind: "toNear" });
    assert.ok(state.log.some((line) => line.includes("Fighter Attack of Opportunity")));
});

test("a reach-10 enemy stops a Step from leaving the Melee", () => {
    const short = createFightState(fighterAndFoe());
    assert.equal(canStepOut(short, short.byId.get("fighter")), true);
    const long = createFightState(fighterAndFoe({ foe: { reach: 10 } }));
    assert.equal(canStepOut(long, long.byId.get("fighter")), false);
});

test("Shield Block takes the shield's Hardness off a hit and damages the shield", () => {
    const [, champion] = martialParty(3);
    const state = createFightState({ combatants: [{ ...champion, engagement: 1 }, { ...moderateCreature(3, "foe", "Foe"), engagement: 1 }] });
    const c = state.byId.get("champion");
    c.shield.raised = true;
    const before = c.hp.value;
    const shieldBefore = c.shield.hp;
    applyDamage(state, c, [{ type: "slashing", amount: 15 }], { source: state.byId.get("foe"), physical: true });
    assert.equal(before - c.hp.value, 15 - c.shield.hardness);
    assert.equal(shieldBefore - c.shield.hp, 15 - c.shield.hardness);
    assert.equal(c.reactionUsed, true);
});

test("persistent damage is set aside and recorded on the target", () => {
    const state = createFightState(fighterAndFoe());
    const c = state.byId.get("fighter");
    const before = c.hp.value;
    applyDamage(state, c, [{ type: "slashing", amount: 6 }, { type: "fire", amount: 3, persistent: true, dice: 1, die: 6, bonus: 0, multiplier: 1 }]);
    assert.equal(before - c.hp.value, 6);
    assert.equal(c.persistent.length, 1);
    assert.equal(c.persistent[0].type, "fire");
});

// These tests check the morale mechanisms one by one: the half-HP trigger (off since M20) starts a
// check, and the gate (on since M24) is off so the check happens at the start of a fight.
function moraleState(foes, rules = {}) {
    const party = martialParty(3);
    const state = createFightState({ combatants: [...party, ...foes] }, { moraleRules: mergeMoraleRules({ losingGate: false, ...rules, triggers: { halfHp: { enabled: true }, ...(rules.triggers ?? {}) } }) });
    return state;
}

test("Boss Resolve: a solo boss passes its first morale check automatically", () => {
    const state = moraleState([moderateCreature(6, "boss", "Boss")]);
    const boss = state.byId.get("boss");
    assert.equal(boss.morale.boss, true);
    state.pendingEvents.push({ type: "halfHp", victim: boss });
    processMorale(state);
    assert.ok(state.log.some((line) => line.includes("Boss Resolve")));
});

test("triggers marked once per creature fire only once", () => {
    // Improved Morale's waver (before M24): a failure doesn't take Alpha out, so its side's losses don't trigger more.
    const state = moraleState([moderateCreature(3, "a", "Alpha"), moderateCreature(3, "b", "Beta")], { failureGivesUp: false });
    const alpha = state.byId.get("a");
    for (let round = 1; round <= 3; round++) {
        state.round = round;
        state.pendingEvents.push({ type: "halfHp", victim: alpha });
        processMorale(state);
    }
    assert.equal(state.stats.moraleChecks, 1);
});

test("a group of three with the same name checks morale once, together (groups are off since M24)", () => {
    const state = moraleState([1, 2, 3].map((n) => moderateCreature(2, `b${n}`, "Bandit")), { group: { enabled: true } });
    state.pendingEvents.push({ type: "halfHp", victim: state.byId.get("b1") });
    state.pendingEvents.push({ type: "halfHp", victim: state.byId.get("b2") });
    processMorale(state);
    assert.equal(state.stats.moraleChecks, 1);
    assert.ok(state.log.some((line) => line.includes("Bandit group morale")));
});

test("fanatical creatures ignore their first failure and go berserk instead of fleeing", () => {
    const rules = { templates: { fanatical: { modifier: -30 } } };
    const state = moraleState([{ ...moderateCreature(3, "z", "Zealot"), morale: { template: "fanatical" } }, moderateCreature(3, "o", "Other")], rules);
    const zealot = state.byId.get("z");
    state.pendingEvents.push({ type: "halfHp", victim: zealot });
    processMorale(state);
    assert.equal(zealot.moraleState.failed, 0, "first failure ignored");
    state.round = 2;
    state.pendingEvents.push({ type: "frightened", victim: zealot, byEnemy: true });
    processMorale(state);
    assert.equal(zealot.moraleState.broken, false);
    assert.equal(zealot.status, "active");
    assert.ok(zealot.berserkUntilRound >= 2);
});

test("a typical humanoid that breaks surrenders", () => {
    const rules = { templates: { typical: { modifier: -30 } } };
    const state = moraleState([moderateCreature(3, "h", "Guard"), moderateCreature(3, "o", "Other")], rules);
    const guard = state.byId.get("h");
    state.pendingEvents.push({ type: "halfHp", victim: guard });
    processMorale(state);
    assert.equal(guard.status, "surrendered");
});

test("an ambushing side rolls Stealth for initiative", () => {
    const party = martialParty(3).map((pc) => ({ ...pc, stealth: 100 }));
    // The party's Perception is about +7, so it only beats +50 by rolling Stealth.
    const foes = [moderateCreature(3, "foe", "Foe")].map((foe) => ({ ...foe, perception: 50 }));
    const result = simulate(prepareSnapshot({ combatants: [...party, ...foes], setup: { ambush: "party" } }), {}, 4, { log: true });
    const firstTurn = result.log[1];
    assert.ok(party.some((pc) => firstTurn.startsWith(pc.name)), firstTurn);
});

test("a creature with Shield Block prefers raising its shield to a third attack at −10", () => {
    const snapshot = benchmarkEncounter(5, "severe");
    snapshot.combatants = snapshot.combatants.map((c) => (["champion", "foe1", "foe2"].includes(c.id) ? { ...c, engagement: 1 } : c));
    const state = createFightState(snapshot);
    const champion = state.byId.get("champion");
    champion.attacksThisTurn = 2;
    champion.actionsLeft = 1;
    const { options } = scoreOptions(state, champion);
    const shield = options.find((option) => option.action.type === "raiseShield");
    const strike = options.filter((option) => option.action.type === "strike").sort((a, b) => b.score - a.score)[0];
    assert.ok(shield.score > strike.score, `shield ${shield.score} vs strike ${strike.score}`);
});

test("weapon traits: forceful, sweep, backswing, volley and backstabber", () => {
    const strike = { name: "Maul", bonus: 10, melee: true, damage: [{ dice: 2, die: 12, bonus: 4, type: "bludgeoning" }] };
    assert.equal(forcefulBonus({ ...strike, forceful: true }, 0), 0);
    assert.equal(forcefulBonus({ ...strike, forceful: true }, 1), 2);
    assert.equal(forcefulBonus({ ...strike, forceful: true }, 2), 4);

    const state = createFightState(fighterAndFoe());
    const fighter = state.byId.get("fighter");
    const foe = state.byId.get("foe");
    const base = attackModifier(state, fighter, foe, strike, 0, { history: [] });
    assert.equal(attackModifier(state, fighter, foe, { ...strike, sweep: true }, 0, { history: [{ strike: "Maul", targetId: "other", hit: true }] }), base + 1);
    assert.equal(attackModifier(state, fighter, foe, { ...strike, sweep: true }, 0, { history: [{ strike: "Maul", targetId: "foe", hit: true }] }), base);
    assert.equal(attackModifier(state, fighter, foe, { ...strike, backswing: true }, 0, { history: [{ strike: "Maul", targetId: "foe", hit: false }] }), base + 1);

    const longbow = { increment: 100, volley: 30 };
    assert.equal(rangePenalty(longbow, 30), 2);
    assert.equal(rangePenalty(longbow, 60), 0);

    const dagger = { name: "Dagger", melee: true, backstabber: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] };
    assert.equal(expectedHitDamage(fighter, dagger, foe, false, { offGuardChance: 1 }) - expectedHitDamage(fighter, dagger, foe, false), 1);
});

test("frightened 2+ from an enemy's effect sets off a morale check (M25; never raised before 2026-10-08)", async () => {
    const { applyCondition } = await import("../src/engine/spells.js");
    // Steady foes (they never fail, so nothing else follows from the check).
    const state = moraleState([moderateCreature(3, "g", "Guard"), moderateCreature(3, "o", "Other")], { templates: { typical: { modifier: 30 } } });
    const guard = state.byId.get("g");
    const pc = state.list.find((c) => c.kind === "pc");
    // Frightened 1 (a Demoralize's success) doesn't.
    applyCondition(state, guard, "frightened", 1, null, pc);
    processMorale(state);
    assert.equal(state.stats.moraleChecks, 0);
    // Frightened 2 (its critical success) does.
    applyCondition(state, guard, "frightened", 2, null, pc);
    processMorale(state);
    assert.ok(state.log.some((line) => /Guard morale \(frightenedByEnemy\)/.test(line)), state.log.join("\n"));
    // Frightened again at the same value, or by an ally, doesn't (the check may have changed it: set it back).
    state.round = 2;
    guard.cond.frightened = 2;
    const checks = state.stats.moraleChecks;
    applyCondition(state, guard, "frightened", 2, null, pc);
    applyCondition(state, guard, "frightened", 3, null, state.byId.get("o"));
    processMorale(state);
    assert.equal(state.stats.moraleChecks, checks);
    // Raised to 3 by an enemy, it checks again.
    guard.cond.frightened = 2;
    applyCondition(state, guard, "frightened", 3, null, pc);
    processMorale(state);
    assert.equal(state.stats.moraleChecks, checks + 1);
});

test("the party plays for morale (M23): fear is worth the chance it breaks a foe, and the foes' leader the breaks its fall brings", () => {
    const demoralize = { name: "Demoralize", plan: { traits: ["concentrate"], activation: { time: "1" }, targeting: { target: "1 creature", range: "30 feet" }, resolution: { kind: "check", check: { roll: "skill", statistic: "intimidation", against: { dc: "target", statistic: "will" } }, outcomes: { criticalSuccess: { effects: [{ kind: "condition", slug: "frightened", value: 2 }] }, success: { effects: [{ kind: "condition", slug: "frightened", value: 1 }] }, failure: { effects: [] }, criticalFailure: { effects: [] } } } }, castRank: 1, pool: null, kind: "basic" };
    const [fighter] = martialParty(3);
    const value = (plays) => {
        const state = createFightState({ combatants: [{ ...fighter, engagement: 1, skills: { ...fighter.skills, intimidation: 12 }, spells: [demoralize] }, { ...moderateCreature(3, "g", "Guard"), engagement: 1 }, moderateCreature(3, "o", "Other")], setup: { situational: { playsForMorale: plays } } });
        const pc = state.byId.get("fighter");
        pc.actionsLeft = 3;
        return scoreOptions(state, pc).options.find((option) => option.action.type === "cast")?.value ?? 0;
    };
    assert.ok(value(true) > value(false) * 1.5, `${value(true)} > 1.5 × ${value(false)}`);
    // A chief two levels above its guards leads them. (The gate, M24, is off here: the party isn't
    // ahead at the start of this fight, so the chief's fall would set off no checks yet.)
    const leader = (plays) => {
        const state = createFightState({ combatants: [fighter, moderateCreature(5, "chief", "Chief"), moderateCreature(3, "g1", "Guard"), moderateCreature(3, "g2", "Guard")], setup: { situational: { playsForMorale: plays } } }, { moraleRules: mergeMoraleRules({ losingGate: false }) });
        return state.leaderDownWorth.get("chief") ?? 0;
    };
    assert.ok(leader(true) > 0);
    assert.equal(leader(false), 0);
});

test("held (a setting, off since M27), a check the gate blocks waits and is rolled once the party pulls ahead", () => {
    const state = moraleState([moderateCreature(3, "g", "Guard"), moderateCreature(3, "o", "Other")], { losingGate: true, holdGatedChecks: true });
    const guard = state.byId.get("g");
    // Close: the foes as strong as the party.
    for (const c of state.list.filter((other) => other.side === "foes")) c.hp.value = c.hp.max = 400;
    state.pendingEvents.push({ type: "halfHp", victim: guard });
    processMorale(state);
    assert.equal(state.stats.moraleChecks, 0, "blocked");
    assert.equal(state.moraleHeld.get("g"), "halfHp");
    // The party pulls ahead: the held check is rolled with no new trigger.
    for (const c of state.list.filter((other) => other.side === "foes")) c.hp.value = 5;
    processMorale(state);
    assert.equal(state.stats.moraleChecks, 1);
    assert.ok(state.log.some((line) => /Guard morale \(halfHp\)/.test(line)));
    // By default (M27), a blocked check is lost.
    const lost = moraleState([moderateCreature(3, "g", "Guard"), moderateCreature(3, "o", "Other")], { losingGate: true });
    for (const c of lost.list.filter((other) => other.side === "foes")) c.hp.value = c.hp.max = 400;
    lost.pendingEvents.push({ type: "halfHp", victim: lost.byId.get("g") });
    processMorale(lost);
    for (const c of lost.list.filter((other) => other.side === "foes")) c.hp.value = 5;
    processMorale(lost);
    assert.equal(lost.stats.moraleChecks, 0);
});

test("the gate by HP share: each side's HP left as a share of what it started with", async () => {
    const { hpShares } = await import("../src/engine/morale.js");
    const state = moraleState([moderateCreature(3, "g", "Guard"), moderateCreature(3, "o", "Other")], { losingGate: true, gateMode: "hpShare", hpGate: { kind: "ratio", value: 2 } });
    const [guard, other] = [state.byId.get("g"), state.byId.get("o")];
    assert.deepEqual(hpShares(state), { party: 1, foes: 1 });
    guard.hp.value = guard.hp.max / 2;
    other.status = "fled";
    assert.ok(Math.abs(hpShares(state).foes - 0.25) < 1e-9, "a fled foe counts as none");
    // Ratio 2: the party at 100% against the foes' 25% is winning; a guard's check goes ahead.
    state.pendingEvents.push({ type: "halfHp", victim: guard });
    processMorale(state);
    assert.equal(state.stats.moraleChecks, 1);
});
