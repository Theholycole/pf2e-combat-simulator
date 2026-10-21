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

test("invisible foes: hidden, concealed instead to see invisibility and while outlined; an outline takes concealment away", async () => {
    const { hiddenDC, invisibleOf } = await import("../src/engine/sight.js");
    const state = { round: 1 };
    const ghost = { id: "g", cond: { hidden: true }, permanent: [{ slug: "invisible" }] };
    assert.ok(invisibleOf(ghost));
    assert.equal(hiddenDC(state, { senses: [] }, ghost), 11);
    assert.equal(hiddenDC(state, { senses: ["see-invisibility"] }, ghost), 5);
    assert.equal(hiddenDC(state, { senses: [] }, { ...ghost, cond: { hidden: true, outlined: true } }), 5);
    assert.equal(hiddenDC(state, { senses: [] }, { id: "h", cond: { hidden: true } }), 11, "hidden another way: still hidden");
    assert.equal(hiddenDC(state, { senses: [] }, { id: "c", cond: { concealed: true, outlined: true } }), 0);
});

test("Faerie Fire read as outlining everyone in its burst; Revealing Light's rows dazzled and outlined for their time", () => {
    const faerie = withReading({ modelVersion: 13, source: { name: "Faerie Fire" }, rank: 2, traits: [], activation: { time: "2" }, targeting: { target: null, range: "120 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "outline", outline: { area: { type: "burst", value: 10 }, duration: { value: 5, unit: "minutes" } } } });
    assert.deepEqual(faerie.targeting.area, { type: "burst", value: 10 });
    assert.deepEqual(faerie.resolution.outcomes.success.effects, [{ kind: "condition", slug: "outlined", value: null, duration: { mode: "fixed", value: 5, unit: "minutes" } }]);
    const revealing = withReading({ modelVersion: 13, source: { name: "Revealing Light" }, rank: 2, traits: [], activation: { time: "2" }, targeting: { area: { type: "burst", value: 10 } }, trigger: { event: "use" }, resolution: { kind: "save", check: { statistic: "reflex" }, outcomes: { criticalSuccess: { effects: [], rawText: "The target is unaffected." }, success: { effects: [], rawText: "The light affects the creature for 2 rounds." }, failure: { effects: [], rawText: "The light affects the creature for 1 minute." } } } });
    assert.deepEqual(revealing.resolution.outcomes.success.effects.map((effect) => [effect.slug, effect.duration.value, effect.duration.unit]), [["dazzled", 2, "rounds"], ["outlined", 2, "rounds"]]);
    assert.deepEqual(revealing.resolution.outcomes.criticalSuccess.effects, []);
    assert.deepEqual(powerConditions(faerie), ["invisible"]);
    assert.ok(powerFoes("boss", 3, "invisible")[0].permanent.some((entry) => entry.slug === "invisible"));
});

test("Faerie Fire rated: nothing on foes seen plainly; against invisible foes, them concealed instead of hidden", () => {
    const faerie = withReading({ modelVersion: 13, source: { name: "Faerie Fire" }, rank: 2, traits: [], activation: { time: "2" }, targeting: { target: null, range: "120 feet", area: null }, trigger: { event: "use" }, resolution: { kind: "outline", outline: { area: { type: "burst", value: 10 }, duration: { value: 5, unit: "minutes" } } } });
    const entry = { name: "Faerie Fire", plan: faerie, castRank: 2, dc: 19, attack: 9, pool: RATED_POOL, tradition: "arcane", effects: {} };
    assert.equal(castPower(standardParty(3), powerFoes("boss", 3), entry), null);
    const found = castPower(standardParty(3), powerFoes("boss", 3, "invisible"), entry);
    assert.ok(found && found.share > 0.1, `${found?.share}`);
});

test("resistance counted as the Hit Points it keeps off the foes' Strikes of its type; a chosen type the best of its choices", async () => {
    const { resistanceKept } = await import("../src/engine/effects.js");
    const ally = { id: "ally", side: "party", status: "active", ac: 20, hp: { value: 30, max: 60 } };
    const fiery = { id: "foe", side: "foes", status: "active", strikes: [{ bonus: 15, damage: [{ dice: 2, die: 6, bonus: 4, type: "fire" }] }] };
    const state = { list: [ally, fiery] };
    const fire = { resistances: [{ type: "fire", value: 5 }] };
    assert.ok(resistanceKept(state, fire, ally, 3) > 0);
    assert.equal(resistanceKept(state, { resistances: [{ type: "cold", value: 5 }] }, ally, 3), 0, "not the type it deals");
    assert.equal(resistanceKept(state, { resistances: [{ type: "choice", choices: ["acid", "fire"], value: 5 }] }, ally, 3), resistanceKept(state, fire, ally, 3));
    const chosen = effectModel({ name: "Resist", system: { duration: { unit: "minutes", value: 10 }, rules: [{ key: "ChoiceSet", flag: "kind", choices: [{ value: "acid" }, { value: "fire" }] }, { key: "Resistance", type: "{item|flags.system.rulesSelections.kind}", value: 5 }] } }, { rank: 2 });
    assert.deepEqual(chosen.resistances, [{ type: "choice", choices: ["acid", "fire"], value: 5, exceptions: [] }]);
    const applied = applyEffect(state, ally, { ...chosen, rounds: 10 }, ally, { applyCondition: () => true });
    assert.equal(applied.model.resistances[0].type, "fire", "applied as the type its foes deal");
});

test("rated: resistance to a damage type more useful against foes whose Strikes deal it", () => {
    assert.deepEqual(powerFoes("boss", 5, "deals:fire")[0].strikes.flatMap((strike) => strike.damage.map((part) => part.type)).filter((type) => type !== "fire"), []);
    assert.deepEqual(powerConditions({ resolution: { kind: "effect" } }, { r: { resistances: [{ type: "choice", choices: ["acid", "fire"], value: 5 }] } }), ["deals:acid", "deals:fire"]);
    assert.deepEqual(powerConditions({ resolution: { kind: "effect" } }, null, "Each affected creature gains resistance 5 to bludgeoning and piercing damage."), ["deals:bludgeoning", "deals:piercing"]);
});

test("flying: a flier in no Melee is aloft, out of a grounded creature's reach; a Fly effect lets one reach it", async () => {
    const { aloft, fliesNow, stridesToEngage } = await import("../src/engine/space.js");
    const flier = { flies: true, meleeId: null, band: "near", cond: {} };
    assert.ok(aloft(flier));
    assert.equal(stridesToEngage({ band: "near", meleeId: null, speed: 25 }, flier), Infinity);
    assert.equal(stridesToEngage({ band: "near", meleeId: null, speed: 25, flies: true }, flier), 1);
    assert.ok(!aloft({ ...flier, meleeId: 1 }), "come down to Strike: in reach");
    assert.ok(!aloft({ ...flier, cond: { prone: true } }));
    const fly = effectModel({ name: "Fly", system: { duration: { unit: "minutes", value: 5 }, rules: [{ key: "BaseSpeed", selector: "fly", value: "max(20,@actor.system.movement.speeds.land.value)" }] } }, { rank: 4 });
    assert.equal(fly.flies, true);
    assert.ok(fliesNow({ effects: [{ model: fly }] }));
});

test("incorporeal: ghost touch an effect adds gets past its resistance; rated against incorporeal and flying foes", async () => {
    const { expectedHitDamage } = await import("../src/engine/actions.js");
    const ghostly = effectModel({ name: "Ghostly Weapon", system: { duration: { unit: "minutes", value: 5 }, rules: [{ key: "AdjustStrike", mode: "add", property: "property-runes", value: "ghost-touch", definition: ["item:id:x"] }, { key: "AdjustStrike", mode: "add", property: "traits", value: "magical", definition: ["item:id:x"] }] } }, { rank: 3 });
    assert.deepEqual(ghostly.strikeAdds, { runes: ["ghost-touch"], traits: ["magical"] });
    const state = createFightState({ combatants: [...standardParty(5), ...powerFoes("boss", 5, "incorporeal")] }, { morale: false, retreat: false }, 1);
    const fighter = state.byId.get("fighter");
    const ghost = state.list.find((c) => c.side !== "party");
    assert.equal(ghost.resistances[0].type, "all-damage");
    const strike = fighter.strikes[0];
    const plain = expectedHitDamage(fighter, strike, ghost, false);
    const armed = expectedHitDamage({ ...fighter, effects: [{ model: ghostly }] }, strike, ghost, false);
    assert.ok(armed > plain, `${armed} > ${plain}`);
    assert.deepEqual(powerConditions({ resolution: { kind: "effect" } }, { g: ghostly }), ["incorporeal"]);
    const [flier] = powerFoes("boss", 5, "flying");
    assert.ok(flier.flies && flier.strikes.some((each) => !each.melee));
});

test("a flier with no Strike closes in for its area about itself and uses it the same turn; grounded casters' spells weighed against it", async () => {
    const { simulate } = await import("../src/engine/fight.js");
    const { computeThreats } = await import("../src/engine/planner.js");
    const rows = { criticalSuccess: { damage: { mode: "shared", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } };
    const plan = { modelVersion: 13, source: { name: "Test Riot" }, rank: 1, traits: [], activation: { time: "2", traits: [] }, targeting: { target: null, range: null, area: { type: "emanation", value: 10 } }, trigger: { event: "use" }, resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "fixed", value: 22 } }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d6", type: "bludgeoning" }] }, outcomes: rows } };
    const troop = () => ({ ...moderateCreatureAt(5, "monster"), id: "monster", name: "Test Riot Troop", strikes: [], flies: true, spells: [{ name: "Test Riot", plan, castRank: 1, pool: null, kind: "ability" }] });
    let used = 0;
    for (let seed = 1; seed <= 8; seed++) {
        const result = simulate({ combatants: [...standardParty(5), troop()] }, { morale: false, retreat: false }, seed, { log: true });
        if ((result.log ?? []).some((line) => /casts Test Riot/.test(line))) used++;
    }
    // (Before: aloft over a party that couldn't reach it, it never came down — 0 of 8.)
    assert.ok(used >= 3, `used its area in ${used} of 8 fights`);
    const fireball = { modelVersion: 13, source: { name: "Test Fireball" }, rank: 3, traits: ["manipulate"], activation: { time: "2", traits: ["manipulate"] }, targeting: { range: "500 feet", area: { type: "burst", value: 20 } }, resolution: { kind: "save", check: { statistic: "reflex", basic: true }, sharedDamage: { components: [{ id: "0", formula: "6d6", type: "fire" }] }, outcomes: rows } };
    const party = standardParty(5).map((pc) => (pc.id === "wizard" ? { ...pc, spells: [{ name: "Test Fireball", plan: fireball, castRank: 3, pool: null }] } : pc));
    const state = createFightState({ combatants: [...party, troop()] }, { morale: false, retreat: false }, 1);
    computeThreats(state);
    assert.ok(state.spellThreat.get("wizard") > 0, "the wizard's spells reach a flier wherever it is");
    assert.equal(state.spellThreat.get("fighter"), 0);
});

test("a Strike's range read from PF2e's data (system.range) when it has no range trait", async () => {
    const { combatant } = await import("../tools/lib/pack-creatures.mjs");
    const npc = { name: "Test Thrower", type: "npc", system: { details: { level: { value: 3 } }, traits: { value: [], size: { value: "med" } }, attributes: { hp: { max: 45, value: 45 }, ac: { value: 19 }, speed: { value: 25, otherSpeeds: [] } }, saves: { fortitude: { value: 9 }, reflex: { value: 9 }, will: { value: 7 } }, perception: { mod: 8 }, skills: {} },
        items: [{ _id: "a", type: "melee", name: "Hurled Stone", system: { bonus: { value: 11 }, traits: { value: ["magical"] }, range: { increment: 60, max: null }, damageRolls: { x: { damage: "2d6+4", damageType: "bludgeoning" } }, attackEffects: { value: [] } } }] };
    const [stone] = combatant(npc).strikes;
    assert.equal(stone.melee, false);
    assert.equal(stone.increment, 60);
});
