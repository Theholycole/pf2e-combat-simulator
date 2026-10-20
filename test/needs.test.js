import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { castSpell } from "../src/engine/spells.js";
import { needsKnown, needsMet, requirementPlayable, targetNeedsMet } from "../src/engine/needs.js";
import { PLAYED_REQUIRES } from "../src/engine/abilities.js";

// B304 (2026-10-13; the user's call: "work through your recommendations in order", item 1): requirements the simulation checks.
// (The ability module's plan for "Requirements The test ghoul is adjacent to the corpse of a creature that died within the last hour.
// Effect … regains 3d6 Hit Points.")
const feast = { name: "Test Feast", kind: "ability", castRank: 1, pool: null, plan: { modelVersion: 13, source: { name: "Test Feast", slug: null, uuid: null, type: "action" }, rank: 1, traits: ["manipulate"], activation: { time: "1", traits: ["manipulate"] }, automation: { level: "automatic" }, targeting: { target: "self", range: null, area: null }, trigger: { event: "use" }, resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "3d6", kinds: ["healing"] }], recipients: "any" } } }, requires: "The test ghoul is adjacent to the corpse of a creature that died within the last hour.", needs: [{ corpse: {} }] } };

test("B304 needs: which the simulation checks; a requirement with them is played", () => {
    assert.equal(needsKnown([{ corpse: {} }, { any: [{ grabbing: {} }, { swallowing: true }] }]), true);
    assert.equal(needsKnown([{ inhabiting: true }]), false);
    assert.equal(requirementPlayable(feast.plan, PLAYED_REQUIRES), true);
    assert.equal(requirementPlayable({ requires: "The test worm is inhabiting a body" }, PLAYED_REQUIRES), false);
});

test("B304 needs in a fight: a corpse (one a use), a creature held, HP, its last action, a target in a state", () => {
    const [fighter, champion] = martialParty(5);
    const ghoul = { ...moderateCreature(5, "ghoul", "Ghoul"), spells: [feast], engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, champion, ghoul, { ...moderateCreature(3, "victim", "Victim"), side: "party" }] }, {}, 1);
    const c = state.byId.get("ghoul");
    c.hp.value -= 40;
    c.actionsLeft = 3;
    const feasts = () => scoreOptions(state, c).options.filter((option) => option.action?.type === "cast" && option.action.spellIndex === 0).length;
    assert.equal(needsMet(state, c, feast.plan.needs), false, "no corpse yet");
    assert.equal(feasts(), 0);
    state.byId.get("victim").status = "dead";
    assert.equal(needsMet(state, c, feast.plan.needs), true);
    assert.ok(feasts() > 0, "planned once a creature lies dead");
    castSpell(state, c, 0, [c.id]);
    assert.equal(needsMet(state, c, feast.plan.needs), false, "that corpse is used");
    // A creature it holds; HP; first action; a Prone target.
    const pc = state.byId.get("fighter");
    assert.equal(needsMet(state, c, [{ grabbing: {} }]), false);
    pc.grabbedBy = c.id;
    pc.cond.grabbed = true;
    assert.equal(needsMet(state, c, [{ grabbing: {} }, { hpBelow: c.hp.max }, { enemyAdjacent: true }]), true);
    assert.equal(needsMet(state, c, [{ hpAtLeast: c.hp.max }]), false);
    assert.equal(needsMet(state, c, [{ any: [{ hpAtLeast: c.hp.max }, { grabbing: {} }] }]), true);
    const prone = [{ target: { conditions: ["prone"], within: 5 } }];
    assert.equal(needsMet(state, c, prone), false);
    pc.cond.prone = true;
    assert.equal(needsMet(state, c, prone), true);
    assert.equal(targetNeedsMet(c, pc, prone), true);
    assert.equal(targetNeedsMet(c, state.byId.get(champion.id), prone), false);
    // Its last action: a Strike that hit just now, not one before something else.
    c.lastStrike = { strike: "Jaws", melee: true, targetId: pc.id, degree: 2, action: 0, round: state.round };
    c.actionCount = 1;
    assert.equal(needsMet(state, c, [{ afterStrike: { strike: "jaws", on: ["success", "criticalSuccess"] } }]), true);
    assert.equal(needsMet(state, c, [{ afterStrike: { strike: "jaws", on: ["success", "criticalSuccess"] } }], { fresh: false }), false);
    c.actionCount = 2;
    assert.equal(needsMet(state, c, [{ afterStrike: { strike: "jaws", on: ["success", "criticalSuccess"] } }]), false);
});

// B312 (2026-10-13, found in the deadliest-creatures study): a requirement the ability module couldn't read isn't played; below half
// its Hit Points is checked.
test("B312 an unread requirement is never played; hpBelowHalf", () => {
    assert.equal(requirementPlayable({ requirementUnread: "The test golem is standing in deep water" }, PLAYED_REQUIRES), false);
    assert.equal(requirementPlayable({ ...feast.plan, requirementUnread: "The test ghoul is in a crypt" }, PLAYED_REQUIRES), false);
    assert.equal(needsKnown([{ hpBelowHalf: true }]), true);
    const state = createFightState({ combatants: [...martialParty(5), moderateCreature(5, "troll", "Troll")] }, {}, 1);
    const c = state.byId.get("troll");
    assert.equal(needsMet(state, c, [{ hpBelowHalf: true }]), false);
    c.hp.value = Math.floor(c.hp.max / 2) - 1;
    assert.equal(needsMet(state, c, [{ hpBelowHalf: true }]), true);
});

// B314 (2026-10-13, found in the deadliest-creatures study): a new save at the end of each of the creature's turns ends a condition that
// allows one, its DC lower after each failure; a paralyzed creature's turn still ends.
test("B314 a new save at the end of each turn: ends the condition, the DC dropping; paralyzed creatures still end their turns", async () => {
    const { applyCondition, saveEndsAtTurnEnd } = await import("../src/engine/spells.js");
    const { simulate } = await import("../src/engine/fight.js");
    const state = createFightState({ combatants: [...martialParty(5), moderateCreature(5, "ghast", "Ghast")] }, {}, 1);
    const pc = state.byId.get("fighter");
    applyCondition(state, pc, "paralyzed", null, { mode: "unlimited", saveEnds: { save: "fortitude", dc: 40, drop: 1 } }, state.byId.get("ghast"));
    assert.equal(pc.cond.paralyzed, true);
    saveEndsAtTurnEnd(state, pc);
    assert.equal(pc.cond.paralyzed, true, "DC 40 isn't met");
    assert.equal(pc.saveEnds[0].dc, 39);
    pc.saveEnds[0].dc = -20;
    saveEndsAtTurnEnd(state, pc);
    assert.equal(pc.cond.paralyzed, false);
    assert.equal(pc.saveEnds.length, 0);
    // In a fight: the paralyzed fighter's turn is logged, its persistent damage taken, and the easy save ends the paralysis.
    const party = martialParty(5).map((c) => (c.id === "fighter" ? { ...c, conditions: { paralyzed: true, persistent: [{ type: "fire", dice: 1, die: 4, bonus: 0 }] }, saveEnds: [{ slug: "paralyzed", save: "fortitude", dc: -20, drop: 1 }] } : c));
    const { log } = simulate({ combatants: [...party, moderateCreature(5, "ghast", "Ghast")] }, {}, 3, { log: true });
    const turn = log.indexOf("Fighter (paralyzed)");
    assert.ok(turn >= 0, "its turn is logged");
    assert.match(log.slice(turn, turn + 4).join("\n"), /Fighter is no longer paralyzed \(fortitude save against DC -20\)/);
    assert.ok(log.slice(turn, turn + 4).some((line) => /Fighter takes \d+ persistent fire/.test(line)));
});

// (2026-10-20, for the item module) saveEnds' modes: "escalate" (its value up on a failure, down on a success, to a most; gone at 0 with what
// else it ends), "reduce" (a critical success ends it), timing "start", from "next" and a number of turns.
test("a repeated save's modes: escalate to its most and down, reduce, at the turn's start, not the first turn, for some turns", async () => {
    const { applyCondition, saveEndsAtTurnEnd } = await import("../src/engine/spells.js");
    const state = createFightState({ combatants: [...martialParty(5), moderateCreature(5, "tinker", "Tinker")] }, {}, 1);
    const pc = state.byId.get("fighter");
    const tinker = state.byId.get("tinker");
    applyCondition(state, pc, "slowed", 1, { mode: "unlimited", saveEnds: { save: "fortitude", dc: 200, mode: "escalate", escalate: { criticalFailure: 1, failure: 1, success: -1, criticalSuccess: "end" }, max: 2, alsoEnds: ["fatigued"], rounds: 3 } }, tinker);
    applyCondition(state, pc, "fatigued", null, null, tinker);
    saveEndsAtTurnEnd(state, pc);
    saveEndsAtTurnEnd(state, pc);
    assert.equal(pc.cond.slowed, 2, "up to its most");
    pc.saveEnds[0].dc = -50;
    saveEndsAtTurnEnd(state, pc);
    assert.ok(!pc.cond.slowed && !pc.cond.fatigued && !pc.saveEnds.length, "a critical success ends it and the fatigue");
    applyCondition(state, pc, "stupefied", 1, { mode: "unlimited", saveEnds: { save: "will", dc: 200, rounds: 1, timing: "start", from: "next" } }, tinker);
    saveEndsAtTurnEnd(state, pc);
    assert.equal(pc.saveEnds.length, 1, "not at the turn's end");
    saveEndsAtTurnEnd(state, pc, "start");
    saveEndsAtTurnEnd(state, pc, "start");
    assert.equal(pc.cond.stupefied, 1, "the first start skipped, the second a failure");
    saveEndsAtTurnEnd(state, pc, "start");
    assert.ok(!pc.cond.stupefied, "its one turn is over");
    applyCondition(state, pc, "clumsy", 1, { mode: "fixed", value: 4, unit: "rounds", saveEnds: { save: "reflex", dc: -50, mode: "reduce" } }, tinker);
    saveEndsAtTurnEnd(state, pc);
    assert.ok(!pc.cond.clumsy, "a critical success ends a reduce");
});

// B316 (2026-10-14; the user asked about the Grim Reaper's death effects): Death Strike also at a creature that critically fails a save
// against one of its spells — even one the spell just dropped.
test("B316 an ability on a critical failure against the creature's spells: Death Strike after a critically failed save", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const rows = (death) => Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree, index) => [degree, { damage: index ? { mode: "shared", multiplier: [0, 0.5, 1, 2][index], sourceComponentIds: ["0"] } : { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...(death && index >= 2 ? { terminal: { kind: "death" } } : {}) }]));
    const bolt = { modelVersion: 13, source: { name: "Test Bolt" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { target: "1 creature", range: "60 feet" }, resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: true, against: { dc: "fixed", value: 99 } }, sharedDamage: { components: [{ id: "0", formula: "1d4[void]" }] }, outcomes: rows(false) } };
    const strike = { modelVersion: 13, source: { name: "Death Strike", slug: "death-strike" }, rank: 1, traits: ["death"], activation: { time: "passive", traits: [] }, targeting: { target: "the creature the Strike hits", range: "touch" }, trigger: { event: "strike", on: ["criticalSuccess"], attackEffect: "death-strike", cost: "free", map: false, spellCriticalFailure: true }, resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 99 } }, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], terminal: { kind: "death" } }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], terminal: { kind: "death" } } } } };
    const reaper = { ...moderateCreature(8, "reaper", "Reaper"), spells: [{ name: "Test Bolt", plan: bolt, castRank: 3, dc: 99, attack: 20, pool: null }, { name: "Death Strike", plan: strike, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" }] };
    const state = createFightState({ combatants: [...martialParty(5), reaper] }, {}, 1, { log: true });
    state.log = [];
    state.rng.d20 = () => 1;
    castSpell(state, state.byId.get("reaper"), 0, ["fighter"]);
    assert.equal(state.byId.get("fighter").status, "dead", state.log.join("\n"));
    assert.ok(state.log.some((line) => / Reaper casts Death Strike at Fighter$/.test(line)));
});

// B317 (2026-10-14; found checking the Grim Reaper's death effects): who a spell can affect — the spell module's
// targeting.actorConstraints. Massacre's "living creature of 17th level or lower" left level-20 PCs dead.
test("B317 a spell's target limits: level caps by rank, living, enemies only, a trait, a size", async () => {
    const { outsideTargets, castSpell } = await import("../src/engine/spells.js");
    const predicates = [{ kind: "living-creature" }, { kind: "level-at-most", level: 17, byRank: { 10: 19 } }];
    const massacre = (castRank) => ({ name: "Test Massacre", castRank, plan: { targeting: { area: { type: "line", value: 60 }, actorConstraints: { predicates } } } });
    const caster = { id: "lich", side: "foes", level: 20 };
    const pc = (level, extra = {}) => ({ id: "pc", side: "party", level, traits: ["humanoid"], ...extra });
    assert.equal(outsideTargets(caster, pc(20), massacre(9)), "above level 17");
    assert.equal(outsideTargets(caster, pc(19), massacre(10)), null, "level 19 at rank 10");
    assert.equal(outsideTargets(caster, pc(20), massacre(10)), "above level 19");
    assert.equal(outsideTargets(caster, pc(12, { traits: ["undead"] }), massacre(9)), "not living");
    assert.equal(outsideTargets(caster, pc(12, { traits: ["construct"] }), massacre(9)), "not living");
    const only = (predicate) => ({ name: "Test", castRank: 3, plan: { targeting: { actorConstraints: { predicates: [predicate] } } } });
    assert.equal(outsideTargets(caster, { ...pc(5), side: "foes" }, only({ kind: "enemy-of-caster" })), "not an enemy");
    assert.equal(outsideTargets(caster, pc(5, { traits: ["fire"] }), only({ kind: "trait", slug: "fire", present: true })), null);
    assert.equal(outsideTargets(caster, pc(5), only({ kind: "trait", slug: "fire", present: true })), "not fire");
    assert.equal(outsideTargets(caster, pc(5, { size: "huge" }), only({ kind: "size-at-most", size: "lg" })), "too big");
    assert.equal(outsideTargets(caster, pc(5), only({ kind: "gm-confirmed" })), null, "the GM's call lets it through");
    // In a cast: a level-8 PC above a level-5 cap is unaffected.
    const rows = Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree, index) => [degree, { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...(index === 3 ? { terminal: { kind: "death" } } : {}) }]));
    const doom = { modelVersion: 13, source: { name: "Test Doom" }, rank: 3, traits: ["death"], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "30 feet", actorConstraints: { predicates: [{ kind: "level-at-most", level: 5 }] } }, resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: false, against: { dc: "fixed", value: 99 } }, outcomes: rows } };
    const state = createFightState({ combatants: [...martialParty(8), { ...moderateCreature(8, "lich", "Lich"), spells: [{ name: "Test Doom", plan: doom, castRank: 3, dc: 99, attack: 20, pool: null }] }] }, {}, 1, { log: true });
    state.log = [];
    state.rng.d20 = () => 1;
    castSpell(state, state.byId.get("lich"), 0, ["fighter"]);
    assert.equal(state.byId.get("fighter").status, "active");
    assert.ok(state.log.includes("  Fighter is unaffected (above level 5)"), state.log.join("\n"));
});
