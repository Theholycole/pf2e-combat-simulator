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
