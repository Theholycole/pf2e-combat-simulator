import test from "node:test";
import assert from "node:assert/strict";

import { hasSense, lightAt, lightZoneModel, lightZoneEntries, sightDCIn } from "../src/engine/light.js";
import { sightDC } from "../src/engine/environment.js";
import { createFightState } from "../src/engine/fight.js";
import { startZone } from "../src/engine/zones.js";
import { effectModel, applyEffect } from "../src/engine/effects.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { standardParty } from "../src/engine/party.js";
import { conditionWorth } from "../src/engine/spells.js";
import { withReading } from "../src/engine/readings.js";
import { RATED_POOL, castPower, powerConditions, powerFoes } from "../src/engine/spell-power.js";

// Sight and light from spells (2026-10-21, the user: "I also want spells that need foe traits since i want those to be tracked too in the
// simulator").

const darkness = (rank, heightened = [{ minRank: 4, note: "Even creatures with darkvision (but not greater darkvision) can barely see through the darkness." }]) => ({
    modelVersion: 13, source: { name: "Darkness" }, rank: 2, traits: [], activation: { time: "3" },
    targeting: { target: null, range: "120 feet", area: { type: "burst", value: 20 } }, trigger: { event: "use" },
    resolution: { kind: "darkness-area", darknessArea: { area: { type: "burst", value: 20 }, durationSeconds: 60, heightened } }
});

test("seeing by the light: darkness hides from all but darkvision, deep darkness conceals from darkvision too, dim light from the unaided", () => {
    const plain = { senses: [] };
    const dark = { senses: ["darkvision"] };
    const greater = { senses: ["greater-darkvision"] };
    assert.equal(sightDCIn(plain, { level: "dark" }), 11);
    assert.equal(sightDCIn(dark, { level: "dark" }), 0);
    assert.equal(sightDCIn(dark, { level: "dark", deep: true }), 5);
    assert.equal(sightDCIn(greater, { level: "dark", deep: true }), 0);
    assert.equal(sightDCIn(plain, { level: "dim" }), 5);
    assert.equal(sightDCIn({ senses: ["low-light-vision"] }, { level: "dim" }), 0);
    assert.equal(sightDCIn(plain, { level: "dark" }, ["darkvision"]), 0, "senses to count as well");
    assert.ok(hasSense({ senses: [], effects: [{ model: { senses: ["darkvision"] } }] }, "darkvision"), "an effect's senses");
});

test("Darkness as a zone: deep from its heightened rank; its creatures in magical darkness over the fight's light; light of a higher rank over it", () => {
    assert.equal(lightZoneModel(darkness(), 2).light.deep, undefined);
    assert.equal(lightZoneModel(darkness(), 4).light.deep, true);
    const [fighter, rogue, wizard, cleric] = standardParty(3);
    const foe = { ...moderateCreatureAt(5, "monster"), side: "foes", senses: [] };
    const state = createFightState({ combatants: [fighter, rogue, wizard, cleric, foe] }, { morale: false, retreat: false }, 1);
    const ally = state.byId.get("fighter");
    const monster = state.byId.get("monster");
    assert.equal(sightDC(state, monster, ally), 0, "bright light: seen");
    startZone(state, state.byId.get("wizard"), { name: "Darkness", plan: darkness(), castRank: 2, zone: lightZoneModel(darkness(), 2) }, ["fighter"]);
    assert.equal(lightAt(state, ally).level, "dark");
    assert.equal(sightDC(state, monster, ally), 11, "hidden in the darkness from a foe without darkvision");
    const seer = { ...monster, senses: ["darkvision"] };
    assert.equal(sightDC(state, seer, ally), 0, "darkvision sees through rank-2 darkness");
    // (A light of a higher rank on it: bright again.)
    applyEffect(state, ally, { name: "Light", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], light: { bright: 20, dim: 40, rank: 4 } }, ally, { applyCondition: () => true });
    assert.equal(lightAt(state, ally).level, "bright");
});

test("an effect's senses and light read from its PF2e rules", () => {
    const light = effectModel({ name: "Light", system: { duration: { unit: "days", value: 1 }, rules: [{ key: "TokenLight", value: { bright: "ternary(gte(@item.level,4),60,20)", dim: "ternary(gte(@item.level,4),120,40)" } }] } }, { rank: 4 });
    assert.deepEqual(light.light, { bright: 60, dim: 120, rank: 4 });
    const sight = effectModel({ name: "Darkvision", system: { duration: { unit: "hours", value: 1 }, rules: [{ key: "Sense", selector: "darkvision" }] } }, { rank: 2 });
    assert.deepEqual(sight.senses, ["darkvision"]);
    assert.equal(sight.unsupported.length, 0);
});

test("a darkness cast weighed: over its own side, hidden from foes without darkvision — nothing against foes that see in it", () => {
    const [fighter, rogue, wizard, cleric] = standardParty(3);
    const make = (senses) => createFightState({ combatants: [fighter, rogue, wizard, cleric, { ...moderateCreatureAt(5, "monster"), side: "foes", senses }] }, { morale: false, retreat: false }, 1);
    const spell = { name: "Darkness", plan: darkness(), castRank: 2 };
    const blind = make([]);
    const entries = lightZoneEntries(blind, blind.byId.get("wizard"), spell, [blind.byId.get("fighter"), blind.byId.get("wizard")], conditionWorth);
    assert.ok(entries.every((entry) => entry.benefit > 0), "harder to see for a foe without darkvision");
    const seeing = make(["darkvision"]);
    assert.ok(lightZoneEntries(seeing, seeing.byId.get("wizard"), spell, [seeing.byId.get("fighter")], conditionWorth).every((entry) => entry.benefit === 0));
    const onFoe = lightZoneEntries(blind, blind.byId.get("wizard"), spell, [blind.byId.get("monster")], conditionWorth);
    assert.ok(onFoe[0].worth < 0, "darkness on the foe: the party, without darkvision, loses sight of it");
});

test("Shroud of Night's failure: everything concealed to it — dazzled for the spell's time", () => {
    const plan = { modelVersion: 13, source: { name: "Shroud of Night" }, rank: 1, traits: [], activation: { time: "2" }, targeting: { target: "1 creature" }, trigger: { event: "use" }, lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } },
        resolution: { kind: "save", check: { statistic: "will" }, outcomes: { success: { effects: [], rawText: "The target is unaffected." }, failure: { effects: [], rawText: "The target is shrouded in murky darkness. It treats bright light as dim light, and unless it has greater darkvision, all creatures are @UUID[Compendium.pf2e.conditionitems.Item.DmAIPqOBomZ7H95W]{Concealed} to it." } } } };
    const read = withReading(plan);
    assert.deepEqual(read.resolution.outcomes.failure.effects, [{ kind: "condition", slug: "dazzled", value: null, duration: { mode: "fixed", value: 1, unit: "minutes" } }]);
    assert.deepEqual(read.resolution.outcomes.success.effects, []);
});

test("rated: foes with darkvision by default; Darkness more useful against foes without it; light and senses in an unlit fight", () => {
    assert.deepEqual(powerFoes("boss", 3)[0].senses, ["darkvision"]);
    assert.deepEqual(powerFoes("boss", 3, "no-darkvision")[0].senses, []);
    assert.deepEqual(powerFoes("group", 3, "dark").environment, { light: "dark" });
    assert.deepEqual(powerConditions(darkness()), ["no-darkvision"]);
    assert.deepEqual(powerConditions({ resolution: { kind: "effect" } }, { light: { light: { bright: 20, dim: 40, rank: 1 } } }), ["dark", "light-blind"]);
    const entry = { name: "Darkness", plan: darkness(), castRank: 2, dc: 19, attack: 9, pool: RATED_POOL, tradition: "arcane", effects: {} };
    assert.equal(castPower(standardParty(3), powerFoes("group", 3), entry), null, "foes that see in it: nothing");
    const blind = castPower(standardParty(3), powerFoes("group", 3, "no-darkvision"), entry);
    assert.ok(blind && blind.share > 0.2 && blind.targets === 4, `${blind?.share}`);
});
