import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { featureParts, performStrike } from "../src/engine/actions.js";
import { saveModifier } from "../src/engine/combatant.js";
import { placeSpark } from "../src/engine/exemplar.js";

// An exemplar's spark and ikons (C25–C27).
const dice = (...rolls) => () => rolls.shift() ?? 10;
const model = (name, extra = {}) => ({ name, rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, attackDeltas: {}, strikeDeltas: {}, ...extra });

function nahoa() {
    const [fighter] = martialParty(3);
    const spear = { ...fighter.strikes[0], name: "Noble Branch Spear", damage: [{ dice: 1, die: 8, bonus: 4, multiplier: 1, type: "piercing" }] };
    return {
        ...fighter, id: "nahoa", name: "Nahoa", engagement: 1, strikes: [spear],
        exemplar: {
            ikons: [
                { slug: "noble-branch", name: "Noble Branch", model: model("Noble Branch", { strikeDeltas: { "Noble Branch Spear": [{ dice: 0, die: 0, bonus: 2, multiplier: 1, type: "spirit", precision: false, persistent: false }] } }) },
                { slug: "scar-of-the-survivor", name: "Scar of the Survivor", model: model("Scar of the Survivor", { modifiers: [{ on: "fortitude", type: "status", value: 1 }] }) }
            ],
            transcendences: [
                { kind: "rend", name: "Strike, Breathe, Rend", ikon: "noble-branch", strike: "Noble Branch Spear", dice: 1, die: 8 },
                { kind: "heal", name: "No Scar but This", ikon: "scar-of-the-survivor", dice: 2, die: 8 }
            ]
        }
    };
}

test("C25 the spark: into the weapon ikon when initiative is rolled; its immanence on the Strikes; Shift Immanence moves it", () => {
    const result = simulate({ combatants: [nahoa(), { ...moderateCreature(3, "foe", "Foe"), engagement: 1, hp: { value: 200, max: 200 } }] }, { roundCap: 1, morale: false }, 2, { log: true });
    assert.ok(result.log.some((line) => /shifts its spark into Noble Branch/.test(line)));
    const state = createFightState({ combatants: [nahoa(), { ...moderateCreature(3, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("nahoa");
    const foe = state.byId.get("foe");
    placeSpark(state, c, "noble-branch");
    assert.ok(featureParts(c, c.strikes[0], foe).some((part) => part.type === "spirit" && part.bonus === 2));
    const fortitude = saveModifier(c, "fortitude");
    performAction(state, c, { type: "shiftImmanence", slug: "scar-of-the-survivor", actions: 1 });
    assert.equal(saveModifier(c, "fortitude"), fortitude + 1);
    assert.ok(!featureParts(c, c.strikes[0], foe).some((part) => part.type === "spirit"), "the branch's immanence went with the spark");
});

test("C26 Strike, Breathe, Rend: right after a hit with the ikon weapon, its dice as spirit damage; the spark leaves the ikon", () => {
    const state = createFightState({ combatants: [nahoa(), { ...moderateCreature(3, "foe", "Foe"), engagement: 1, hp: { value: 40, max: 40 } }] }, {}, 1);
    const c = state.byId.get("nahoa");
    const foe = state.byId.get("foe");
    placeSpark(state, c, "noble-branch");
    c.actionsLeft = 3;
    c.usedThisTurn = new Set(["shift-immanence"]);
    c.actionCount = 0;
    state.rng.d20 = dice(19);
    performStrike(state, c, foe, { ...c.strikes[0], bonus: 30 });
    c.actionCount = 1;
    c.actionsLeft = 2;
    const rend = scoreOptions(state, c).options.find((entry) => entry.action.type === "transcend");
    assert.ok(rend, "offered right after the hit");
    const before = foe.hp.value;
    performAction(state, c, rend.action);
    assert.ok(before - foe.hp.value > 0);
    assert.equal(c.spark, null);
});

test("C27 No Scar but This: healing while the spark is in the scar", () => {
    const state = createFightState({ combatants: [nahoa(), { ...moderateCreature(3, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("nahoa");
    placeSpark(state, c, "scar-of-the-survivor");
    c.hp.value = 10;
    c.actionsLeft = 3;
    c.usedThisTurn = new Set();
    const heal = scoreOptions(state, c).options.find((entry) => entry.action.type === "transcend");
    assert.ok(heal);
    performAction(state, c, heal.action);
    assert.ok(c.hp.value > 10);
    assert.equal(c.spark, null);
});
