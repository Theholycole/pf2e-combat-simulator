import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { shareRecharges } from "../src/engine/abilities.js";
import { createFightState } from "../src/engine/fight.js";
import { martialParty } from "../src/engine/benchmarks.js";
import { canCast, castPlan } from "../src/engine/spells.js";

// One recharge for abilities that share it (B318, 2026-10-21; the ability module reads "This ability and X can't be used again until … in 1d4
// rounds" and "can't use A or B again" into sharesRecharge). Synthetic wording.
const ABILITIES = new URL("../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js", import.meta.url);
const skip = !existsSync(ABILITIES) && "the ability module not found";

test("shareRecharges: a chain to its end; two that name each other, the first name of the two", () => {
    const entry = (name, shares = null) => ({ name, plan: shares ? { sharesRecharge: shares } : {}, rechargeGroup: shares ?? name });
    const entries = [entry("Test Roar", "Breath Weapon"), entry("Breath Weapon"), entry("Double Breath", "Acid Breath"), entry("Acid Breath", "Double Breath"), entry("Test Burst", "Test Pop"), entry("Test Claw")];
    shareRecharges(entries);
    assert.deepEqual(entries.map((spell) => spell.rechargeGroup), ["Breath Weapon", "Breath Weapon", "Acid Breath", "Acid Breath", "Test Pop", "Test Claw"]);
    // A way of an ability (its group the ability's name, no share of its own) is left as it is.
    const ways = [{ name: "Test Breath (Fire)", plan: {}, rechargeGroup: "Test Breath" }];
    assert.equal(shareRecharges(ways)[0].rechargeGroup, "Test Breath");
});

test("two breaths that name each other: using one, the other recharges too", { skip }, async () => {
    const { combatant } = await import("../tools/lib/pack-creatures.mjs");
    const action = (id, name, actions, text) => ({ _id: id, type: "action", name, system: { slug: null, actionType: { value: "action" }, actions: { value: actions }, traits: { value: [] }, rules: [], description: { value: `<p>${text}</p>` } } });
    const npc = { name: "Test Wyrm", type: "npc", system: { details: { level: { value: 9 } }, traits: { value: [], size: { value: "huge" } }, attributes: { hp: { max: 190, value: 190 }, ac: { value: 28 }, speed: { value: 25, otherSpeeds: [] } }, saves: { fortitude: { value: 20 }, reflex: { value: 16 }, will: { value: 17 } }, perception: { mod: 17 }, skills: {} },
        items: [
            action("a", "Acid Breath", 2, "The test wyrm breathes acid. Each creature in a @Template[type:line|distance:60] takes @Damage[8d6[acid]] damage (@Check[reflex|dc:28|basic] save). The test wyrm can't use Acid Breath or Double Breath again for 1d4 rounds."),
            action("b", "Double Breath", 3, "The test wyrm uses Acid Breath twice. A creature attempts only one save and can take damage only once. The test wyrm can't use Acid Breath or Double Breath again for 2d4 rounds.")
        ] };
    const wyrm = combatant(npc);
    const [acid, double] = ["Acid Breath", "Double Breath"].map((name) => wyrm.spells.find((spell) => spell.name === name));
    assert.deepEqual([acid?.rechargeGroup, double?.rechargeGroup, double?.plan?.trigger?.recharge?.formula], ["Acid Breath", "Acid Breath", "2d4"]);
    const [fighter] = martialParty(9);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...wyrm, id: "wyrm", side: "foes", engagement: 1 }] }, {}, 1);
    const w = state.byId.get("wyrm");
    const [first, second] = ["Acid Breath", "Double Breath"].map((name) => w.spells.find((spell) => spell.name === name));
    assert.ok(canCast(w, first) && canCast(w, second));
    castPlan(state, w, second, [fighter.id]);
    assert.equal(canCast(w, first), false, "Double Breath set Acid Breath recharging");
    assert.equal(canCast(w, second), false);
});
