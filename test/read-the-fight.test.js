import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage } from "../src/engine/actions.js";
import { processMorale, readTheFightParts, speaks } from "../src/engine/morale.js";
import { MORALE_RULES, mergeMoraleRules } from "../src/engine/morale-rules.js";
import { POTENTIAL_ROUNDS, computeThreats, potentialDamage } from "../src/engine/planner.js";

// Two foes at 30% of their HP against an unhurt party (the gate open), Read the fight on; halfHp sets off a check.
function setUp(foes, { rules = {}, setup = {}, share = 0.3 } = {}) {
    // (The HP-share gate, M28: open or shut by HP alone.)
    const state = createFightState({ combatants: [...martialParty(3), ...foes], setup }, { moraleRules: mergeMoraleRules({ gateMode: "hpShare", readTheFight: { enabled: true }, triggers: { halfHp: { enabled: true }, hopeless: { enabled: false } }, ...rules }) });
    for (const c of state.list.filter((each) => each.side === "foes")) c.hp.value = Math.round(c.hp.max * share);
    return state;
}

const clerk = (overrides = {}) => ({ ...moderateCreature(3, "g", "Clerk"), languages: ["common"], ...overrides });
const other = () => ({ ...moderateCreature(3, "o", "Other"), languages: ["common"] });
// Morale always holds (+30), and every d20 is a 15: Perception +9 and the DC for level 3 (18), a success.
const steady = { templates: { typical: { modifier: 30 } } };

// A side-losing check for one foe (halfHp, or "can't affect" for a second check: halfHp comes once per creature).
function check(state, id = "g", type = "halfHp") {
    state.rng.d20 = () => 15;
    const c = state.byId.get(id);
    state.pendingEvents.push(type === "halfHp" ? { type, victim: c } : { type, who: c });
    processMorale(state);
}

test("M37 defaults: the party further ahead per PC down, a rout at a third behind the gate, harsher side losses, no unhurt bonus, retreat reasonable at 2×; M38 on", () => {
    assert.equal(MORALE_RULES.hpGate.perPcDown, 0.5);
    assert.equal(MORALE_RULES.hpGate.maxPcsDown, null);
    assert.equal(MORALE_RULES.readTheFight.enabled, true);
    assert.deepEqual({ ...MORALE_RULES.rout }, { fraction: 0.33, needsGate: true });
    assert.equal(MORALE_RULES.modifiers.sideLost25.value, -4);
    assert.equal(MORALE_RULES.modifiers.sideLost50.value, -6);
    assert.equal(MORALE_RULES.modifiers.undamaged.enabled, false);
    assert.deepEqual([...MORALE_RULES.triggers.hopeless.ratios], [1.5, 2, 3]);
    // M39–M40: the strength gate at 3.25×, by damage potential; fear and fleeing give up only once the party is clearly ahead.
    assert.equal(MORALE_RULES.gateMode, "strength");
    assert.equal(MORALE_RULES.strengthBy, "potential");
    assert.equal(MORALE_RULES.losingGateRatio, 3.25);
    assert.equal(MORALE_RULES.triggers.frightenedByEnemy.giveUpNeedsGate, true);
    assert.equal(MORALE_RULES.triggers.fleeing.giveUpNeedsGate, true);
});

test("M38: a foe whose morale held reads the fight; one that talks yields and the party accepts", () => {
    const state = setUp([clerk(), other()], { rules: steady });
    check(state);
    const yielded = state.byId.get("g");
    // 15 + Perception 9 + 4 (two foes against four PCs: outnumbered 2:1).
    assert.ok(state.log.some((line) => line.includes("Clerk reads the fight: 28 vs 18 → critical success")), state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Clerk sees the fight is lost and yields")));
    assert.equal(yielded.status, "surrendered");
});

test("M38: one that can't talk leaves: fleeing, not frightened, given up; the party doesn't count a Reactive Strike", () => {
    const state = setUp([clerk({ languages: [], traits: ["beast"] }), other()], { rules: { templates: { typical: { modifier: 30 }, bestial: { modifier: 30 } } } });
    check(state);
    const beast = state.byId.get("g");
    assert.equal(beast.status, "active");
    assert.equal(beast.cond.fleeing, true);
    assert.equal(beast.cond.frightened ?? 0, 0);
    assert.equal(beast.moraleState.leaving, true);
    assert.equal(beast.moraleState.broken, true);
    const pc = state.list.find((c) => c.kind === "pc");
    // A Reactive Strike as it moves away: nothing changes.
    state.inReaction = true;
    applyDamage(state, beast, [{ type: "slashing", amount: 1 }], { source: pc });
    state.inReaction = false;
    assert.equal(beast.moraleState.leaving, true);
    // A deliberate attack: it turns and fights to the death, and so does the ally who saw.
    applyDamage(state, beast, [{ type: "slashing", amount: 1 }], { source: pc });
    assert.equal(beast.moraleState.leaving, false);
    assert.equal(beast.cond.fleeing, false);
    assert.equal(beast.moraleState.toTheDeath, true);
    assert.equal(state.byId.get("o").moraleState.toTheDeath, true);
});

test("M38: who reads: not when the gate is shut, not with a fear check, not fanatics, a solo boss only once it could break", () => {
    const reads = (state) => state.log.some((line) => line.includes("reads the fight"));
    // The gate shut (both sides unhurt): the halfHp check itself doesn't happen.
    const shut = setUp([clerk(), other()], { rules: steady, share: 1 });
    check(shut);
    assert.equal(reads(shut), false);
    // A fanatic.
    const fanatic = setUp([clerk({ morale: { template: "fanatical" } }), other()], { rules: { templates: { fanatical: { modifier: 30 } } } });
    check(fanatic);
    assert.ok(fanatic.log.some((line) => line.includes("Clerk morale")));
    assert.equal(reads(fanatic), false);
    // A solo boss at 30%: Boss Resolve holds its first check, and it can't break yet, so it doesn't read.
    const boss = setUp([{ ...moderateCreature(5, "g", "Tyrant"), languages: ["common"] }]);
    check(boss);
    assert.ok(boss.log.some((line) => line.includes("Boss Resolve")));
    assert.equal(reads(boss), false);
    // Below a quarter of its HP it could break: it reads.
    boss.round = 2;
    boss.byId.get("g").hp.value = 5;
    boss.moraleRules.templates.typical.modifier = 30;
    check(boss, "g", "cantAffect");
    assert.equal(reads(boss), true);
});

test("M38: no quarter (the setup's tick, or a kill objective's target): it and the allies who saw fight to the death", () => {
    const blind = { ...moderateCreature(3, "b", "Blind"), languages: ["common"] };
    const state = setUp([clerk(), other(), blind], { rules: steady, setup: { situational: { noQuarter: true } } });
    state.byId.get("b").cond.blinded = true;
    check(state);
    assert.equal(state.byId.get("g").status, "active");
    assert.equal(state.byId.get("g").moraleState.toTheDeath, true);
    assert.equal(state.byId.get("o").moraleState.toTheDeath, true);
    assert.notEqual(state.byId.get("b").moraleState.toTheDeath, true);
    assert.ok(state.log.some((line) => line.includes("No quarter: Clerk and 1 ally who saw fight to the death")), state.log.join("\n"));
    // No more checks for them.
    const before = state.stats.moraleChecks;
    state.round = 2;
    check(state, "o");
    assert.equal(state.stats.moraleChecks, before);
    // A kill objective's target.
    const target = setUp([clerk(), other()], { rules: steady });
    target.objective = { kind: "target", mode: "kill", targetId: "g", status: "open" };
    check(target);
    assert.equal(target.byId.get("g").moraleState.toTheDeath, true);
});

test("M38: a surrender from a failed check is an offer too", () => {
    const fails = { templates: { typical: { modifier: -30 } } };
    const accepted = setUp([clerk(), other()], { rules: fails });
    check(accepted);
    assert.equal(accepted.byId.get("g").status, "surrendered");
    const refused = setUp([clerk(), other()], { rules: fails, setup: { situational: { noQuarter: true } } });
    check(refused);
    assert.equal(refused.byId.get("g").status, "active");
    assert.equal(refused.byId.get("g").moraleState.toTheDeath, true);
});

test("M38: the losing signs help Perception by as much as they hurt morale; who talks", () => {
    const state = setUp([clerk(), other(), { ...moderateCreature(3, "x", "Third"), languages: [] }, { ...moderateCreature(3, "y", "Fourth"), languages: [] }]);
    state.byId.get("x").status = "dead";
    state.byId.get("y").status = "dead";
    const parts = readTheFightParts(state, state.byId.get("g"));
    // Half its side fallen (−6 to morale) and outnumbered 2:1 (−4): +6 and +4.
    assert.deepEqual(parts.map((part) => [part.id, part.value]).sort(), [["outnumbered2to1", 4], ["sideLost50", 6]]);
    assert.equal(speaks({ languages: ["common"] }), true);
    assert.equal(speaks({ languages: [], traits: ["humanoid"] }), false);
    assert.equal(speaks({ traits: ["humanoid"] }), true);
    assert.equal(speaks({ traits: ["beast"] }), false);
});

test("M40: strength counts damage potential: limited spells only as often as they have uses, a recharge once", () => {
    assert.equal(POTENTIAL_ROUNDS, 3);
    const fireball = { name: "Fireball", pool: "r3" };
    const cantrip = { name: "Ignition" };
    const breath = { name: "Breath Weapon", rechargeGroup: "breath" };
    // Strikes 10 a round; Fireball 30 (two slots left of three rounds), a cantrip 12.
    const full = potentialDamage({ spellPools: { r3: 2 } }, [{ spell: fireball, damage: 30 }, { spell: cantrip, damage: 12 }], 10);
    assert.equal(full, (30 + 30 + 12) / 3);
    // One slot left: less potential; none left (canCast drops it): just the cantrip.
    assert.equal(potentialDamage({ spellPools: { r3: 1 } }, [{ spell: fireball, damage: 30 }, { spell: cantrip, damage: 12 }], 10), (30 + 12 + 12) / 3);
    assert.equal(potentialDamage({ spellPools: {} }, [{ spell: cantrip, damage: 12 }], 10), 12);
    // A breath weapon that recharges counts once in the three rounds; Strikes the rest.
    assert.equal(potentialDamage({}, [{ spell: breath, damage: 40, recharges: true }], 15), (40 + 15 + 15) / 3);
    // A disarmed fighter: its weapon's Strike gone, its fist left (the caller passes the best usable Strike).
    assert.ok(potentialDamage({}, [], 4) < potentialDamage({}, [], 14));
});

test("M40: in a fight, a weakened grip and a dropped weapon lower a creature's potential", () => {
    const state = setUp([clerk(), other()]);
    const pc = state.list.find((c) => c.kind === "pc" && c.strikes?.length);
    computeThreats(state);
    const armed = state.potential.get(pc.id);
    const strike = pc.strikes[0];
    pc.weakGrip = new Map([[strike.name, 2]]);
    computeThreats(state);
    const weak = state.potential.get(pc.id);
    pc.dropped = new Set(pc.strikes.map((each) => each.name));
    computeThreats(state);
    assert.ok(weak < armed, `${weak} < ${armed}`);
    assert.equal(state.potential.get(pc.id), 0);
});
