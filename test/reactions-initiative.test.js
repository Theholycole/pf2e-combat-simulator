import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, initiativeSkill, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { performStrike } from "../src/engine/actions.js";
import { applyCondition } from "../src/engine/spells.js";
import { breakCreature } from "../src/engine/morale.js";
import { frightenedAfter, offGuardFrom } from "../src/engine/passives.js";
import { outcomeLine } from "../src/live/morale-card.js";

// B303 (2026-10-13), the user's calls: "Have Bravery apply as intended even if it changes how morale works on that creature", "use
// different initiative skills such as deception if they have a passive mentioning it and the skill is higher than their normal
// perception initiative", "Expand reactions and track monsters with multiple reactions".

test("B303 Bravery in the morale rules: a rout's frightened 2 is 1, a berserk's frightened 1 none; the live card says so", () => {
    const [fighter] = martialParty(5);
    const brave = (extra = {}) => createFightState({ combatants: [fighter, { ...moderateCreature(5, "captain", "Captain"), ...extra }] }, {}, 1);
    const state = brave({ lessFrightened: 1 });
    const captain = state.byId.get("captain");
    breakCreature(state, captain, "rout");
    assert.deepEqual([captain.cond.fleeing, captain.cond.frightened], [true, 1]);
    const plain = brave();
    breakCreature(plain, plain.byId.get("captain"), "rout");
    assert.equal(plain.byId.get("captain").cond.frightened, 2);
    const berserk = brave({ lessFrightened: 1 });
    breakCreature(berserk, berserk.byId.get("captain"), "berserk");
    assert.equal(berserk.byId.get("captain").cond.frightened, 0);
    // Shaken at frightened 1: still 1 (it gains frightened 2, 1 lower).
    assert.equal(frightenedAfter({ cond: { frightened: 1 }, lessFrightened: 1 }, 2), 1);
    // A spell's frightened 1 doesn't land at all.
    const fresh = brave({ lessFrightened: 1 });
    assert.equal(applyCondition(fresh, fresh.byId.get("captain"), "frightened", 1, null, fresh.byId.get("fighter")), false);
    assert.equal(fresh.byId.get("captain").cond.frightened, 0);
    assert.equal(outcomeLine("Captain", { kind: "giveUp", how: "rout" }, { lessFrightened: 1 }), "Captain routs: fleeing and frightened 2 (Bravery: 1 lower). Move it away; it leaves the fight.");
    assert.equal(outcomeLine("Captain", { kind: "frighten" }, { lessFrightened: 1 }), "Captain is shaken, but its Bravery holds: frightened +0.");
});

test("B303 initiative with the skill its abilities name when it beats Perception; Surprise Attack's off-guard from that roll", () => {
    assert.deepEqual(initiativeSkill({ perception: 8, skills: { deception: 12, intimidation: 10 }, initiativeSkills: ["deception", "intimidation"] }), { stat: "deception", value: 12 });
    assert.equal(initiativeSkill({ perception: 14, skills: { deception: 12 }, initiativeSkills: ["deception"] }), null);
    assert.deepEqual(initiativeSkill({ perception: 8, stealth: 13, skills: {}, initiativeSkills: ["stealth"] }), { stat: "stealth", value: 13 });
    // In a fight: it rolls Deception, and a Surprise Attack that needs Deception or Stealth works.
    const [fighter] = martialParty(5);
    const liar = { ...moderateCreature(5, "liar", "Liar"), perception: 5, skills: { deception: 16 }, initiativeSkills: ["deception", "stealth"], makesOffGuard: [{ when: { round: 1, notActed: true, initiative: ["deception", "stealth"] }, strikes: "all" }] };
    const { log } = simulate({ combatants: [fighter, liar] }, { roundCap: 1, morale: false }, 1, { log: true });
    assert.ok(log.some((line) => /Liar rolls deception for initiative/.test(line)), log.slice(0, 6).join("\n"));
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...liar, engagement: 1 }] }, {}, 1);
    state.round = 1;
    state.initiativeStat = new Map([["liar", { stat: "deception", value: 16 }]]);
    assert.equal(offGuardFrom(state, state.byId.get("liar"), state.byId.get("fighter")), true);
    state.initiativeStat.set("liar", { stat: "perception", value: 5 });
    assert.equal(offGuardFrom(state, state.byId.get("liar"), state.byId.get("fighter")), false);
});

test("B303 a reaction kept for one reaction only, used by name in a fight: Shadow Evade after its own reaction is spent", () => {
    const [fighter] = martialParty(5);
    const drake = { ...moderateCreature(5, "drake", "Drake"), concealReaction: { name: "Shadow Evade", dc: 21, ranged: false }, spareReactions: [{ names: ["shadow evade"], count: 1 }], engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, drake] }, {}, 1);
    const target = state.byId.get("drake");
    target.reactionUsed = true;
    state.rng.d20 = () => 19;
    const pc = state.byId.get("fighter");
    performStrike(state, pc, target, pc.strikes[0]);
    assert.ok(state.log.some((line) => /Drake uses Shadow Evade/.test(line)), state.log.join("\n"));
    // Spent: the next hit lands.
    state.log = [];
    performStrike(state, pc, target, pc.strikes[0]);
    assert.ok(!state.log.some((line) => /Shadow Evade/.test(line)));
});
