import test from "node:test";
import assert from "node:assert/strict";

import { backlashOf, deviantFields, deviantRisk, deviantUsed, deviantUsable } from "../src/engine/deviant.js";
import { conditionWorth } from "../src/engine/spells.js";
import { standardParty } from "../src/engine/party.js";
import { simulate } from "../src/engine/fight.js";
import { powerFoes } from "../src/engine/spell-power.js";

const fakeState = (rolls) => ({ rng: { d20: () => rolls.shift(), die: () => 1 }, log: [], list: [], byId: new Map(), pendingEvents: [], stats: {}, round: 1 });
const fighter = () => ({ id: "f", name: "Fighter", side: "party", status: "active", level: 6, hp: { value: 80, max: 80, temp: 0 }, cond: {}, effects: [], persistent: [], weaknesses: [], immunities: [], deviantClassification: "blight" });

test("a deviation's flat check: DC 5, 5 higher after each success to 20; a failure backlashes, mild then moderate then severe, and the DC goes back to 5", () => {
    const c = fighter();
    const entry = { name: "Irradiate", deviant: { classification: "blight" } };
    const state = fakeState([10, 12, 3, 4, 2]);
    deviantUsed(state, c, entry);
    assert.equal(c.deviation.dc, 10);
    deviantUsed(state, c, entry);
    assert.equal(c.deviation.dc, 15);
    deviantUsed(state, c, entry);
    assert.equal(c.deviation.stage, 1, "mild");
    assert.equal(c.deviation.dc, 5);
    assert.equal(c.hp.value, 74, "Fungal Rot's mild: damage equal to its level");
    deviantUsed(state, c, entry);
    assert.equal(c.deviation.stage, 2);
    assert.equal(c.cond.sickened, 2);
    deviantUsed(state, c, entry);
    assert.equal(c.deviation.stage, 3);
    assert.equal(deviantUsable(c), false, "no more deviations after a severe backlash");
    assert.ok(state.log.some((line) => /severe backlash/.test(line)));
});

test("each classification's backlash; the AI's price for the risk grows with the DC, and a spent deviation can't be planned", () => {
    assert.deepEqual(backlashOf("dragon", 2, 9).weakness, { type: "electricity", value: 3 });
    assert.deepEqual(backlashOf("wraith", 1, 4).conditions, [["frightened", 3]]);
    assert.equal(backlashOf("flicker", 1, 10).persistent.dice, 4);
    const c = fighter();
    const low = deviantRisk(c, conditionWorth);
    c.deviation = { dc: 20, stage: 0, spent: false };
    assert.ok(deviantRisk(c, conditionWorth) > low);
    c.deviation.spent = true;
    assert.equal(deviantRisk(c, conditionWorth), Infinity);
    c.noBacklash = true;
    assert.equal(deviantRisk(c, conditionWorth), 0);
});

test("deviant feats as a fight plays them: awakenings change the entries; one not played says why", () => {
    const plain = deviantFields("titan-swing", 10, 28, []);
    assert.equal(plain.fields.strikeActivities[0].extraWeaponDice, 2);
    assert.equal(plain.fields.strikeActivities[0].onHit.push, 10);
    const bleed = deviantFields("titan-swing", 10, 28, ["bleed"]);
    assert.deepEqual(bleed.fields.strikeActivities[0].onHit.damage, ["2d6[persistent,bleed]"]);
    const wail = deviantFields("enervating-wail", 6, 24, ["silent"]);
    assert.equal(wail.fields.spells.length, 2);
    assert.equal(wail.fields.spells[0].plan.resolution.check.against.value, 24);
    assert.match(deviantFields("consume-energy", 2, 18, []).gap, /counteracts/);
});

test("a fight plays a deviant ability, its flat check and its backlash", () => {
    let used = 0;
    let checks = 0;
    for (let seed = 0; seed < 12; seed++) {
        const party = structuredClone(standardParty(6));
        const pc = party.find((c) => c.id === "fighter");
        Object.assign(pc, deviantFields("storming-breath", 6, 23, ["prone"]).fields);
        pc.spells = [...(standardParty(6).find((c) => c.id === "fighter").spells ?? []), ...pc.spells];
        const result = simulate({ combatants: [...party, ...powerFoes("group", 6)] }, { morale: false, retreat: false }, seed, { log: true });
        used += result.log.filter((line) => /Fighter uses Storming Breath/.test(line)).length;
        checks += result.log.filter((line) => /Fighter's deviation holds|Fighter suffers \w+ backlash/.test(line)).length;
    }
    assert.ok(used > 0, "the fighter breathes in some fights");
    assert.equal(checks, used, "a flat check for each use");
});
