import test from "node:test";
import assert from "node:assert/strict";

import { createFightState } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { applyDamage } from "../src/engine/actions.js";
import { applyCondition } from "../src/engine/spells.js";

// B305 (2026-10-13; the user's call: "work through your recommendations in order", item 4): the triggers the simulation didn't fire —
// a creature dying or going down nearby, and gaining a condition.
const none = { mode: "none", multiplier: 0, sourceComponentIds: [] };
const automatic = (effects) => ({ kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: none, effects: degree === "success" ? effects : [] }])) });
const reaction = (name, target, trigger, resolution) => ({ name, kind: "ability", castRank: 1, pool: null, actionType: "reaction", plan: { modelVersion: 13, source: { name }, rank: 1, traits: [], activation: { time: "reaction", traits: [] }, targeting: { target, range: null, area: null }, trigger: { reaction: true, ...trigger }, resolution } });

test("B305 a creature dying beside it: Soul Feast heals it; going down nearby: Preserve Prey keeps the creature from dying", () => {
    const [fighter, champion] = martialParty(5);
    const feast = reaction("Soul Feast", "self", { event: "nearby-death", within: 5, dies: true }, automatic([{ kind: "heal", formula: "2d8" }]));
    const leech = { ...moderateCreature(5, "leech", "Leech"), spells: [feast], engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, champion, leech, { ...moderateCreature(1, "minion", "Minion"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("leech");
    c.hp.value -= 30;
    const before = c.hp.value;
    applyDamage(state, state.byId.get("minion"), [{ type: "slashing", amount: 200, persistent: false, precision: false }]);
    assert.ok(state.log.some((line) => /Leech reacts with Soul Feast/.test(line)), state.log.join("\n"));
    assert.ok(c.hp.value > before);
    assert.equal(c.reactionUsed, true);
    // Preserve Prey: a PC going down within 30 feet — unconscious, not dying.
    const prey = reaction("Preserve Prey", "the triggering creature", { event: "nearby-death", within: 30, living: true }, automatic([{ kind: "end-condition", slugs: ["dying"] }]));
    const keeper = createFightState({ combatants: [{ ...fighter, engagement: 1 }, champion, { ...moderateCreature(5, "zecui", "Zecui"), spells: [prey], engagement: 1 }] }, {}, 1);
    const pc = keeper.byId.get("fighter");
    applyDamage(keeper, pc, [{ type: "slashing", amount: pc.hp.value + 5, persistent: false, precision: false }]);
    assert.deepEqual([pc.status, pc.cond.dying, pc.stable], ["down", 0, true]);
    assert.ok(keeper.log.some((line) => /Zecui reacts with Preserve Prey: Fighter is unconscious but not dying/.test(line)));
});

test("B305 gaining a condition: Melt Time quickens it when slowed; Quick Escape Escapes the creature grabbing it", () => {
    const [fighter] = martialParty(5);
    const melt = reaction("Melt Time", "self", { event: "condition-gained", slugs: ["slowed", "stunned"] }, automatic([{ kind: "condition", slug: "quickened", value: null, duration: { mode: "fixed", value: 1, unit: "minutes", expiry: "turn-start", anchor: "effect-start" } }]));
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "adada", "Adada"), spells: [melt], engagement: 1 }] }, {}, 1);
    const adada = state.byId.get("adada");
    applyCondition(state, adada, "slowed", 1, null, state.byId.get("fighter"));
    assert.equal(adada.cond.quickened, true);
    assert.ok(state.log.some((line) => /Adada reacts with Melt Time/.test(line)));
    // Quick Escape: on being grabbed, an Escape against the grabber.
    const escape = reaction("Quick Escape", "the creature grabbing you", { event: "condition-gained", slugs: ["grabbed"] }, {
        kind: "check", check: { roll: "skill", statistic: ["acrobatics", "athletics"], against: { dc: "target", statistic: "athletics" } }, sharedDamage: null,
        outcomes: Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: none, effects: degree.endsWith("uccess") ? [{ kind: "end-condition", slugs: ["grabbed", "restrained", "immobilized"], recipient: "self" }] : [] }]))
    });
    const grab = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "beetle", "Beetle"), skills: { acrobatics: 30 }, spells: [escape], engagement: 1 }] }, {}, 1);
    const beetle = grab.byId.get("beetle");
    grab.rng.d20 = () => 15;
    applyCondition(grab, beetle, "grabbed", null, null, grab.byId.get("fighter"));
    assert.ok(grab.log.some((line) => /Beetle reacts with Quick Escape/.test(line)), grab.log.join("\n"));
    assert.equal(Boolean(beetle.cond.grabbed), false);
});
