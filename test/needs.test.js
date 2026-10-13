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
