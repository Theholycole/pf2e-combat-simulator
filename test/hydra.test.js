import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { expectedHitDamage } from "../src/engine/actions.js";
import { adjustDamage } from "../src/engine/damage.js";
import { addBuiltin, regenerating } from "../src/engine/abilities.js";
import { aimsAtHead, cauterizeStumps, hydraRegrow, hydraScaled, strikeHead } from "../src/engine/creature-rules.js";

// H1 (2026-10-13; the user's call: "build everything you brought up", tier 3): a hydra's heads.

function hydraSpec() {
    const hydra = { ...moderateCreature(6, "hydra", "Hydra"), hp: { value: 90, max: 90 } };
    assert.ok(addBuiltin(hydra, { builtin: "creature-rules", heads: { count: 5, hp: 15, cauterize: ["acid", "fire"], weaknesses: [{ type: "slashing", value: 5 }] } }, "Head Regrowth"));
    assert.ok(addBuiltin(hydra, { builtin: "creature-rules", hydraRegeneration: { perHead: 3, dc: 25, perSuccess: 2, double: true } }, "Hydra Regeneration"));
    assert.ok(addBuiltin(hydra, { builtin: "passive-rules", reactions: { extra: 4, only: "Reactive Strikes" } }, "Reactive Heads"));
    return hydra;
}
const kill = (state, c) => {
    c.status = "dead";
};

test("H1 a hydra's regeneration by its heads; a party member aims at a head it severs in one hit", () => {
    const spec = hydraSpec();
    assert.deepEqual(spec.regeneration, { value: 15, deactivatedBy: [], hydra: true });
    const [fighter] = martialParty(9);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...spec, engagement: 1 }] }, {}, 1);
    state.log = [];
    const h = state.byId.get("hydra");
    assert.deepEqual([h.hydra.heads, h.hydra.stumps], [5, 0]);
    const pc = state.byId.get("fighter");
    // A middling slashing hit: it severs a head, which is worth more than the hit on the body; a big one goes at the body.
    const middling = { ...pc.strikes[0], bonus: 30, damage: [{ dice: 2, die: 6, bonus: 6, type: "slashing" }] };
    assert.equal(aimsAtHead(pc, h, middling, { expectedHitDamage }), true);
    assert.equal(aimsAtHead(pc, h, { ...middling, damage: [{ dice: 6, die: 12, bonus: 20, type: "slashing" }] }, { expectedHitDamage }), false);
    // Severed: one head fewer, a stump, its regeneration and its Reactive Strikes down with it.
    strikeHead(state, pc, h, [{ type: "slashing", amount: 12, persistent: false }], { adjustDamage, killCreature: kill });
    assert.deepEqual([h.hydra.heads, h.hydra.stumps, h.regeneration.value], [4, 1, 12]);
    assert.equal(h.spareReactions[0].count, 3);
    // Not by damage short of the head's Hit Points (gone at the end of the turn).
    strikeHead(state, pc, h, [{ type: "piercing", amount: 6, persistent: false }], { adjustDamage, killCreature: kill });
    assert.equal(h.hydra.heads, 4);
    // Its own count doesn't change for a Strike activity's dice until it loses heads.
    assert.equal(hydraScaled(h, "4d6[strike]"), "3d6[strike]");
});

test("H1 stumps: cauterized by fire (all of them by an area), regrown on a Fortitude save; no heads and no stumps, it dies", () => {
    const spec = hydraSpec();
    const state = createFightState({ combatants: [{ ...martialParty(9)[0], engagement: 1 }, { ...spec, engagement: 1 }] }, {}, 1);
    state.log = [];
    const h = state.byId.get("hydra");
    h.hydra.heads = 2;
    h.hydra.stumps = 3;
    cauterizeStumps(state, h, [{ type: "fire", amount: 5 }], new Set(), { killCreature: kill });
    assert.equal(h.hydra.stumps, 2);
    state.rng.d20 = () => 15;
    h.saves.fortitude = 12;
    hydraRegrow(state, h);
    assert.deepEqual([h.hydra.heads, h.hydra.stumps], [4, 1]);
    cauterizeStumps(state, h, [{ type: "fire", amount: 5 }], new Set(["area-damage"]), { killCreature: kill });
    assert.equal(h.hydra.stumps, 0);
    h.hydra.heads = 0;
    assert.equal(regenerating(h), false);
    h.hydra.heads = 1;
    h.hydra.stumps = 0;
    assert.equal(regenerating(h), true);
});

test("H1 in fights: heads severed, its Strikes by the heads it has", () => {
    let severed = 0;
    for (let seed = 1; seed <= 6; seed++) {
        const { log } = simulate({ combatants: [...martialParty(9).map((pc) => ({ ...pc, engagement: 1 })), { ...hydraSpec(), engagement: 1 }] }, {}, seed, { log: true });
        if (log.some((line) => /Hydra's head is severed/.test(line))) severed++;
    }
    assert.ok(severed > 0, `severed in ${severed} of 6`);
});
