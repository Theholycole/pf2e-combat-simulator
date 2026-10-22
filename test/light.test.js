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
        if ((result.log ?? []).some((line) => /uses Test Riot/.test(line))) used++;
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

test("incorporeal: sinks into the floor out of reach; starting a turn inside, slowed 1 and out with its first move — or, fleeing, gone", async () => {
    const { takeTurn } = await import("../src/engine/fight.js");
    const { stride } = await import("../src/engine/actions.js");
    const { isActive } = await import("../src/engine/combatant.js");
    const ghost = () => ({ ...moderateCreatureAt(5, "monster"), id: "monster", name: "Test Ghost", traits: ["incorporeal", "undead"], flies: true });
    let state = createFightState({ combatants: [...standardParty(5), ghost()] }, { morale: false, retreat: false }, 1, { log: true });
    state.log = [];
    let g = state.byId.get("monster");
    g.actionsLeft = 3;
    stride(state, g, { kind: "sink" });
    assert.ok(!isActive(g) && g.insideObject && g.actionsLeft === 0, "inside: out of everyone's reach, its turn over");
    takeTurn(state, g);
    assert.ok(state.log.some((line) => /slowed 1 inside the floor/.test(line)));
    assert.ok(state.log.some((line) => /rises out of the floor/.test(line)));
    assert.ok(isActive(g) && !g.insideObject);
    // (The user: "Long stay = fled" — starting a turn inside and staying in is leaving the fight.)
    state = createFightState({ combatants: [...standardParty(5), ghost()] }, { morale: false, retreat: false }, 1);
    g = state.byId.get("monster");
    g.actionsLeft = 3;
    stride(state, g, { kind: "sink" });
    g.cond.fleeing = true;
    takeTurn(state, g);
    assert.equal(g.status, "fled");
});

test("incorporeal on the grid: through a blocked square, never ending in it", async () => {
    const { reachable } = await import("../src/engine/grid.js");
    const map = { width: 5, height: 1, blocked: new Set(["2,0"]), walls: new Set(["2,0|3,0"]), difficult: new Map() };
    assert.equal(reachable(map, { square: [0, 0], size: "med" }).has("3,0"), false);
    const ghostly = reachable(map, { square: [0, 0], size: "med", traits: ["incorporeal"] });
    assert.equal(ghostly.get("3,0")?.ends, true);
    assert.equal(ghostly.get("2,0")?.ends, false);
});

test("sinking weighs the reactions it sets off: Reactive Strike, and more for one that can stop the move (Stand Still)", async () => {
    const { scoreOptions, computeThreats } = await import("../src/engine/planner.js");
    const { engage } = await import("../src/engine/space.js");
    const sinkValue = (setup) => {
        const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster", name: "Test Ghost", traits: ["incorporeal", "undead"], flies: true }] }, { morale: false, retreat: false }, 1);
        const ghost = state.byId.get("monster");
        const fighter = state.byId.get("fighter");
        engage(state, fighter, ghost);
        setup(fighter);
        computeThreats(state);
        ghost.actionsLeft = 3;
        return scoreOptions(state, ghost).options.find((option) => option.action?.type === "stride" && option.action.move?.kind === "sink")?.value;
    };
    const none = sinkValue((fighter) => (fighter.reactions = { ...(fighter.reactions ?? {}), aoo: false }));
    const reactive = sinkValue((fighter) => (fighter.reactions = { ...(fighter.reactions ?? {}), aoo: true }));
    const standStill = sinkValue((fighter) => {
        fighter.reactions = { ...(fighter.reactions ?? {}), aoo: false };
        fighter.reactionStrikes = [{ name: "Stand Still", triggers: ["move"], strike: null, penalty: 0, disrupts: true }];
    });
    assert.ok(none > reactive, `${none} > ${reactive}`);
    assert.ok(reactive > standStill, `${reactive} > ${standStill}`);
});

test("persistent damage counted for what it adds: a target already burning with acid makes an Acid Flask's persistent acid worth less", async () => {
    const { expectedHitDamage } = await import("../src/engine/actions.js");
    const flask = { name: "Acid Flask", melee: false, increment: 30, bonus: 12, damage: [{ dice: 0, die: 0, bonus: 1, multiplier: 1, type: "acid", persistent: false, precision: false }, { dice: 3, die: 6, bonus: 0, multiplier: 1, type: "acid", persistent: true, precision: false }] };
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const thrower = state.byId.get("monster");
    const wizard = state.byId.get("wizard");
    const fresh = expectedHitDamage(thrower, flask, wizard, false);
    wizard.persistent = [{ type: "acid", dice: 3, die: 6, bonus: 0, multiplier: 1 }];
    const burning = expectedHitDamage(thrower, flask, wizard, false);
    // (1 acid, and two rounds of 3d6 persistent: 1 + 21 fresh; only the 1 once it already burns with as much.)
    assert.ok(Math.abs(fresh - 22) < 0.01, `fresh ${fresh}`);
    assert.ok(Math.abs(burning - 1) < 0.01, `burning ${burning}`);
});

test("Earthbind: a save's 'falls' rows bring a flier down — landed until its turn, grounded for a round or a minute — and its foes reach it", async () => {
    const { applyCondition, expireTimers } = await import("../src/engine/spells.js");
    const { aloft, stridesToEngage } = await import("../src/engine/space.js");
    const { groundDamage } = await import("../src/engine/actions.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const row = (rawText) => ({ damage: { mode: "none" }, effects: [], rawText });
    const plan = withReading({ resolution: { kind: "save", check: { statistic: "fortitude" }, outcomes: { criticalSuccess: row("The target is unaffected."), success: row("The target falls safely up to 120 feet."), failure: row("The target falls safely up to 120 feet. If it hits the ground, it can't Fly, levitate, or otherwise leave the ground for 1 round."), criticalFailure: row("The target falls safely up to 120 feet. If it hits the ground, it can't Fly, levitate, or otherwise leave the ground for 1 minute.") } } });
    const slugOf = (degree) => plan.resolution.outcomes[degree].effects.map((effect) => `${effect.slug}${effect.duration ? ` ${effect.duration.value} ${effect.duration.unit}` : ""}`);
    assert.deepEqual(slugOf("success"), ["landed"]);
    assert.deepEqual(slugOf("failure"), ["grounded 1 rounds"]);
    assert.deepEqual(slugOf("criticalFailure"), ["grounded 1 minutes"]);
    assert.deepEqual(slugOf("criticalSuccess"), []);
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster", name: "Test Wyvern", flies: true }] }, { morale: false, retreat: false }, 1, { log: true });
    const wyvern = state.byId.get("monster");
    const fighter = state.byId.get("fighter");
    assert.ok(aloft(wyvern) && stridesToEngage(fighter, wyvern) === Infinity);
    assert.ok(groundDamage(state, wyvern, 1) > 0, "the fighter's sword over its bow");
    applyCondition(state, wyvern, "grounded", null, { mode: "fixed", value: 1, unit: "rounds" }, state.byId.get("wizard"));
    assert.ok(!aloft(wyvern) && stridesToEngage(fighter, wyvern) === 1);
    wyvern.actionsLeft = 3;
    takeTurn(state, wyvern);
    assert.ok(wyvern.cond.grounded && wyvern.cond.landed, "still down through its own turn");
    state.round += 1;
    expireTimers(state, state.byId.get("wizard"), "start");
    assert.ok(!wyvern.cond.grounded && wyvern.cond.landed, "ungrounded, but on the ground until its next turn");
});

test("an aura's granted effect on the creatures it reaches (Protector's Sphere); an effect's own toggles as they start (Shielding Formation)", async () => {
    const { resolveAuraGrants, auraRecipients } = await import("../src/engine/effects.js");
    const granted = { name: "Effect: Protector's Sphere", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "Resistance", type: "all-damage", value: 3 }] } };
    const aura = resolveAuraGrants(effectModel({ name: "Aura: Protector's Sphere", system: { duration: { unit: "minutes", value: 1 }, rules: [{ key: "Aura", radius: 15, effects: [{ affects: "allies", uuid: "x" }] }] } }, { rank: 4 }), (uuid) => (uuid === "x" ? granted : null), { rank: 4 });
    assert.equal(aura.aura?.[0]?.model.resistances[0].value, 3);
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const cleric = state.byId.get("cleric");
    const fighter = state.byId.get("fighter");
    const { engage } = await import("../src/engine/space.js");
    engage(state, cleric, state.byId.get("monster"));
    engage(state, fighter, state.byId.get("monster"));
    assert.deepEqual(auraRecipients(state, cleric, aura.aura[0]).map((c) => c.id).sort(), ["cleric", "fighter"], "itself and the ally in its Melee — not the foe");
    applyEffect(state, cleric, aura, cleric, {});
    assert.ok(fighter.effects.some((effect) => effect.model.resistances?.[0]?.type === "all-damage"));
    const shielding = effectModel({ name: "Shielding Formation", system: { rules: [{ key: "RollOption", option: "shielding-formation-resistance", toggleable: true }, { key: "FlatModifier", predicate: [{ not: "shielding-formation-resistance" }], selector: "ac", type: "circumstance", value: 1 }, { key: "Resistance", predicate: ["shielding-formation-resistance"], type: "all-damage", value: 10 }] } }, { rank: 4 });
    assert.deepEqual(shielding.modifiers.map((m) => [m.on, m.value]), [["ac", 1]]);
    assert.equal(shielding.resistances.length, 0);
});

test("a spell for an object or a willing creature goes to no foe (Levitate)", async () => {
    const { targetSets } = await import("../src/engine/spells.js");
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const wizard = state.byId.get("wizard");
    const foe = state.byId.get("monster");
    const spell = (target) => ({ name: "Test", plan: { targeting: { target, range: "touch" }, resolution: { kind: "effect", applications: [] } } });
    const env = { enemies: [foe], allies: [], inMelee: () => true, distance: () => 5, meleeId: null };
    const reachesFoe = (target) => targetSets(state, wizard, spell(target), env).some((set) => set.targets.includes(foe));
    assert.equal(reachesFoe("1 unattended object or willing creature"), false);
    assert.equal(reachesFoe("1 creature or object"), true);
});

test("Penumbral Shroud: dimmed — light a step lower to it, read from its rows; @actor.level as the caster's level", async () => {
    const { numericValue } = await import("../src/engine/effects.js");
    const unaided = { senses: [], cond: {} };
    assert.equal(sightDCIn(unaided, { level: "bright" }), 0);
    assert.equal(sightDCIn({ ...unaided, cond: { dimmed: true } }, { level: "bright" }), 5, "bright as dim: concealed to it");
    assert.equal(sightDCIn({ senses: ["darkvision"], cond: { dimmed: true } }, { level: "dim" }), 0, "darkvision sees in the dark it perceives");
    const note = { label: "Spell's effect", text: "The target perceives light as one step lower than it actually is." };
    const row = (rawText) => ({ damage: { mode: "none" }, effects: [], rawText, noteEffects: [note] });
    const plan = withReading({ lifecycle: { durationSpec: { mode: "fixed", value: 10, unit: "minutes" } }, resolution: { kind: "save", check: { statistic: "reflex" }, outcomes: { criticalSuccess: row("The target is unaffected."), success: row("The effect lasts for 1 round."), failure: row("The effect lasts its normal duration."), criticalFailure: row("The effect lasts its normal duration.") } } });
    assert.deepEqual(plan.resolution.outcomes.success.effects[0], { kind: "condition", slug: "dimmed", value: null, duration: { mode: "fixed", value: 1, unit: "rounds" } });
    assert.equal(plan.resolution.outcomes.failure.effects[0].duration.value, 10);
    assert.equal(plan.resolution.outcomes.criticalSuccess.effects.length, 0);
    assert.equal(numericValue("@actor.level", 9), 17);
});

test("Dirge of Remembrance: damage past resistance, semi-corporeal ghosts take weapons' ghost touch; an immunity kept as a resistance", async () => {
    const { adjustDamage, spellContext } = await import("../src/engine/damage.js");
    const { expectedHitDamage, semicorporealDamage } = await import("../src/engine/actions.js");
    const { resistanceKept } = await import("../src/engine/effects.js");
    const state = createFightState({ combatants: [...standardParty(7), ...powerFoes("boss", 7, "incorporeal")] }, { morale: false, retreat: false }, 1);
    const ghost = state.list.find((c) => c.side !== "party");
    const sonic = (spell) => adjustDamage(ghost, [{ type: "sonic", amount: 20, persistent: false, precision: false, context: spellContext(spell) }]).total;
    const plain = { name: "Plain", plan: { resolution: { kind: "save" } } };
    const dirge = { name: "Dirge", plan: { resolution: { kind: "save", resistanceBypass: { ignore: "all-damage" } } } };
    assert.ok(sonic(plain) < 20, "its resistance");
    assert.equal(sonic(dirge), 20, "the bypass keeps its resistance off");
    const fighter = state.byId.get("fighter");
    const strike = fighter.strikes[0];
    const before = expectedHitDamage(fighter, strike, ghost, false);
    const after = expectedHitDamage(fighter, strike, { ...ghost, cond: { ...ghost.cond, semicorporeal: true } }, false);
    assert.ok(after > before, `${after} > ${before}`);
    assert.ok(semicorporealDamage(state, ghost, 1) > 0);
    const row = (rawText) => ({ damage: { mode: "none" }, effects: [], rawText });
    const read = withReading({ lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } }, resolution: { kind: "save", check: { statistic: "will" }, outcomes: { criticalSuccess: row("The creature is unaffected."), success: row("The creature takes half damage."), failure: row("The creature takes full damage and becomes semi-corporeal until the spell ends."), criticalFailure: row("As failure, but double damage.") } } });
    assert.equal(read.resolution.outcomes.failure.effects[0].slug, "semicorporeal");
    assert.equal(read.resolution.outcomes.criticalFailure.effects[0].slug, "semicorporeal");
    assert.equal(read.resolution.outcomes.success.effects.length, 0);
    const hound = { ...moderateCreatureAt(7, "monster"), id: "hound", strikes: [{ ...moderateCreatureAt(7, "monster").strikes[0], damage: [{ dice: 2, die: 8, bonus: 6, type: "fire" }] }] };
    const fiery = createFightState({ combatants: [...standardParty(7), hound] }, { morale: false, retreat: false }, 1);
    assert.ok(resistanceKept(fiery, { immunities: ["fire"], resistances: [] }, fiery.byId.get("wizard"), 1) > 0, "fire immunity against a fire Strike");
});

test("Light of Revelation: a light aura cast on the caster sheds bright light for its radius", async () => {
    const { lightAuraModel } = await import("../src/engine/light.js");
    const { castSpell, canCast } = await import("../src/engine/spells.js");
    const plan = withReading({ activation: { time: "2", traits: [] }, targeting: { target: null, range: null, area: null }, resolution: { kind: "light-aura", lightAura: { radius: 30, durationSeconds: 300 } } });
    assert.equal(plan.targeting.target, "self");
    const spell = { name: "Light of Revelation", plan, castRank: 2, pool: null };
    assert.deepEqual(lightAuraModel(spell).light, { bright: 30, dim: 0, rank: 2 });
    const state = createFightState({ combatants: [...standardParty(3), { ...moderateCreatureAt(3, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    state.environment = { ...(state.environment ?? {}), light: "dark" };
    const cleric = state.byId.get("cleric");
    cleric.spells = [spell];
    assert.ok(canCast(cleric, spell));
    castSpell(state, cleric, 0, [cleric.id]);
    assert.equal(lightAt(state, cleric).level, "bright");
});

test("an effect's ChoiceSet: a model each choice (Animal Feature's wings fly, owl eyes see in the dark); degree choices follow the outcome (Ill Omen)", async () => {
    const feature = effectModel({ name: "Animal Feature", system: { duration: { unit: "minutes", value: 1 }, rules: [
        { key: "ChoiceSet", rollOption: "animal-feature", choices: [{ value: "cat-eyes" }, { value: "owl-eyes", predicate: [{ gte: ["{item|level}", 4] }] }, { value: "wings", predicate: [{ gte: ["{item|level}", 4] }] }] },
        { key: "Sense", selector: "low-light-vision", predicate: ["animal-feature:cat-eyes"] },
        { key: "Sense", selector: "darkvision", predicate: ["animal-feature:owl-eyes"] },
        { key: "BaseSpeed", selector: "fly", value: 25, predicate: ["animal-feature:wings"] }] } }, { rank: 4 });
    const byValue = Object.fromEntries(feature.choices.map((choice) => [choice.value, choice.model]));
    assert.deepEqual(byValue["owl-eyes"].senses, ["darkvision"]);
    assert.equal(byValue.wings.flies, true);
    assert.ok(!feature.flies && !feature.senses, "the effect itself, before a choice: neither");
    const low = effectModel({ name: "Animal Feature", system: { rules: [{ key: "ChoiceSet", rollOption: "animal-feature", choices: [{ value: "cat-eyes" }, { value: "wings", predicate: [{ gte: ["{item|level}", 4] }] }] }, { key: "BaseSpeed", selector: "fly", value: 25, predicate: ["animal-feature:wings"] }, { key: "Sense", selector: "low-light-vision", predicate: ["animal-feature:cat-eyes"] }] } }, { rank: 2 });
    assert.equal(low.choices, undefined, "wings not yet at rank 2: one choice, nothing to pick");
    const omen = effectModel({ name: "Ill Omen", system: { rules: [{ key: "ChoiceSet", rollOption: "ill-omen", choices: [{ value: "failure" }, { value: "critical-failure" }] }, { key: "RollTwice", keep: "lower", selector: ["attack-roll"], predicate: ["ill-omen:failure"] }, { key: "RollTwice", keep: "lower", selector: ["attack-roll"], predicate: ["ill-omen:critical-failure"] }] } }, { rank: 1 });
    assert.equal(omen.choiceByDegree, true);
});

test("a light aura sheds dim light as far again (Turnip Lantern); Deluge's descent brings fliers down whatever the save", async () => {
    const lantern = effectModel({ name: "Aura: Turnip Lantern", system: { rules: [{ key: "Aura", radius: 20, traits: ["light"], effects: [] }] } }, { rank: 1 });
    assert.deepEqual(lantern.light, { bright: 20, dim: 20, rank: 1 });
    const row = (rawText) => ({ damage: { mode: "none" }, effects: [], rawText });
    const deluge = withReading({ resolution: { kind: "save", check: { statistic: "reflex" }, controls: { parts: [{ kind: "descend", feet: 50 }] }, outcomes: { criticalSuccess: row("The creature is unaffected."), success: row("The creature is unaffected."), failure: row("The creature is pushed 50 feet."), criticalFailure: row("The creature is pushed 50 feet.") } } });
    for (const degree of ["criticalSuccess", "success", "failure", "criticalFailure"]) assert.equal(deluge.resolution.outcomes[degree].effects[0].slug, "landed");
});

test("Levitate: floated out of grounded reach, no Strides across the ground; worth the hits kept off, less melee it can't make", async () => {
    const { liftKept, liftOffenseLost } = await import("../src/engine/actions.js");
    const { aloft, stridesToEngage, levitating } = await import("../src/engine/space.js");
    const { scoreOptions, computeThreats } = await import("../src/engine/planner.js");
    const lift = effectModel({ name: "Spell Effect: Levitate", system: { duration: { unit: "minutes", value: 5 }, rules: [{ key: "RollOption", option: "stabilized", toggleable: true }, { key: "FlatModifier", predicate: [{ not: "stabilized" }], selector: "attack", type: "circumstance", value: -2 }] } }, { rank: 3 });
    assert.equal(lift.levitates, true);
    const rows = { criticalSuccess: { damage: { mode: "shared", multiplier: 0, sourceComponentIds: [] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] } };
    const bolt = { name: "Test Bolt", castRank: 3, pool: null, plan: { modelVersion: 13, source: { name: "Test Bolt" }, rank: 3, traits: [], activation: { time: "2", traits: [] }, targeting: { target: "1 creature", range: "120 feet" }, resolution: { kind: "save", check: { statistic: "reflex", basic: true }, sharedDamage: { components: [{ id: "0", formula: "5d6", type: "fire" }] }, outcomes: rows } } };
    const party = standardParty(5).map((pc) => (pc.id === "wizard" ? { ...pc, spells: [bolt] } : pc));
    const state = createFightState({ combatants: [...party, { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    computeThreats(state);
    const wizard = state.byId.get("wizard");
    const fighter = state.byId.get("fighter");
    const brute = state.byId.get("monster");
    assert.ok(liftKept(state, wizard, 1) > 0, "the brute's claws kept off the wizard");
    assert.ok(liftOffenseLost(state, fighter, 1) > liftOffenseLost(state, wizard, 1), "the fighter loses its sword; the wizard little");
    applyEffect(state, wizard, lift, wizard, {});
    assert.ok(levitating(wizard) && aloft(wizard) && stridesToEngage(brute, wizard) === Infinity);
    wizard.actionsLeft = 3;
    assert.ok(!scoreOptions(state, wizard).options.some((option) => option.action?.type === "stride"), "no Strides while levitating");
});

test("Embrace Nothingness: 'when it is not your turn … you are Invisible' in its text — invisible on its effect", async () => {
    const { withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const doc = { system: { description: { value: "When it is not your turn and during your turn until you take an action with the move trait, you are @UUID[Compendium.pf2e.conditionitems.Item.x]{Invisible}." } } };
    const models = withTextConditions({ a: { name: "Embrace Nothingness", conditions: [], resistances: [] } }, doc);
    assert.deepEqual(models.a.conditions, [{ slug: "invisible", value: null }]);
    assert.deepEqual(withTextConditions({ a: { conditions: [] } }, { system: { description: { value: "You are Invisible." } } }).a.conditions, []);
});

test("a buff's weaknesses cost what the foes' Strikes add: none for weakness to area damage, some for a weakness to their own type", async () => {
    const { weaknessCost } = await import("../src/engine/effects.js");
    const state = createFightState({ combatants: [...standardParty(7), { ...moderateCreatureAt(7, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const wizard = state.byId.get("wizard");
    const type = state.byId.get("monster").strikes[0].damage[0].type;
    assert.equal(weaknessCost(state, { weaknesses: [{ type: "area-damage", value: 8 }, { type: "splash-damage", value: 8 }] }, wizard, 3), 0);
    assert.ok(weaknessCost(state, { weaknesses: [{ type, value: 5 }] }, wizard, 3) > 0);
});

test("a ChoiceSet by selection: the choice put into a rule's selector (Traveler's Transit's fly Speed from rank 5)", () => {
    const item = (rank) => effectModel({ name: "Traveler's Transit", system: { rules: [
        { key: "ChoiceSet", flag: "traveler", choices: [{ value: "climb" }, { value: "swim" }, { value: "fly", predicate: [{ gte: ["{item|level}", 5] }] }] },
        { key: "BaseSpeed", selector: "{item|flags.system.rulesSelections.traveler}", value: 25 }] } }, { rank });
    assert.deepEqual(item(5).choices.map((choice) => [choice.value, Boolean(choice.model.flies)]), [["climb", false], ["swim", false], ["fly", true]]);
    assert.ok(!item(4).choices.some((choice) => choice.model.flies));
    const resist = effectModel({ name: "Resist Energy", system: { rules: [{ key: "ChoiceSet", flag: "resistEnergy", choices: [{ value: "fire" }, { value: "cold" }] }, { key: "Resistance", type: "{item|flags.system.rulesSelections.resistEnergy}", value: 5 }] } }, { rank: 2 });
    assert.equal(resist.choices, undefined, "a resistance's type stays the 'choice' resistance");
});

test("Fiery Body: its touch's burn read from its text; a creature in a grapple with it burns once each turn, again for each touch", async () => {
    const { withSpellText } = await import("../src/engine/effects.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const { applyCondition, castSpell } = await import("../src/engine/spells.js");
    const { engage } = await import("../src/engine/space.js");
    const { basicActions } = await import("../tools/lib/pack-creatures.mjs");
    const doc = { system: { description: { value: "<p>Any creature that touches you or damages you with an unarmed attack or non-reach melee weapon takes @Damage[3d6[fire]] damage.</p><p><strong>Heightened (9th)</strong> Creatures touching you take @Damage[4d6[fire]] damage instead of 3d6.</p>" } } };
    const read = (rank) => withSpellText({ x: { name: "Spell Effect: Fiery Body", rounds: 10, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: ["fire"], conditions: [], unsupported: [], situational: 0 } }, doc, rank).x;
    assert.deepEqual(read(7).retaliation, { parts: [{ dice: 3, die: 6, bonus: 0, type: "fire" }], adjacentMelee: true, touch: true });
    assert.equal(read(9).retaliation.parts[0].dice, 4);
    const state = createFightState({ combatants: [...standardParty(7), { ...moderateCreatureAt(7, "monster"), id: "monster", name: "Test Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const brute = state.byId.get("monster");
    applyEffect(state, wizard, read(7), wizard, { applyCondition });
    engage(state, brute, wizard);
    applyCondition(state, wizard, "grabbed", null, null, brute);
    state.log = [];
    brute.actionsLeft = 0;
    takeTurn(state, brute);
    assert.equal(state.log.filter((line) => /touches Wizard's Fiery Body/.test(line)).length, 1, "holding it: once as its turn starts");
    state.log = [];
    brute.spells = [{ name: "Grapple", plan: basicActions.grapple, castRank: 1, pool: null, kind: "basic" }];
    castSpell(state, brute, 0, [wizard.id]);
    assert.ok(state.log.some((line) => /touches Wizard's Fiery Body/.test(line)), "a Grapple at it: a touch");
});

test("Blanket of Stars: a generated form's aura save read as an emanation's save that lingers at turn ends", () => {
    const plan = withReading({ targeting: { target: null }, resolution: { kind: "generated-form", generatedForm: { seconds: 600, rules: [] }, formRiders: { auras: [{ radius: 5, events: ["turn-end"], save: { statistic: "will", rows: { failure: { conditions: [{ slug: "dazzled" }], rounds: 1, expiry: "turn-end" }, criticalFailure: { conditions: [{ slug: "confused" }, { slug: "dazzled" }], rounds: 1, expiry: "turn-end" } } } }] } } });
    assert.equal(plan.resolution.kind, "save");
    assert.deepEqual(plan.targeting.area, { type: "emanation", value: 5 });
    assert.deepEqual(plan.resolution.lingering.events, ["turn-end"]);
    assert.deepEqual(plan.resolution.outcomes.criticalFailure.effects.map((effect) => effect.slug), ["confused", "dazzled"]);
    assert.equal(plan.resolution.outcomes.success.effects.length, 0);
});

test("a caster's touch made harmful: Warning Stripes' retaliation kind cast on itself; Shroud of Flame's touch read from its text", async () => {
    const { planRetaliation, castSpell } = await import("../src/engine/spells.js");
    const { textRetaliation } = await import("../src/engine/effects.js");
    const stripes = (castRank) => ({ name: "Warning Stripes", castRank, pool: null, plan: withReading({ rank: 3, activation: { time: "2", traits: [] }, targeting: { target: null }, resolution: { kind: "retaliation", retaliation: { durationSeconds: 60, triggers: [{ trigger: "A creature touches the bearer, or strikes it bare-handed.", damage: { componentId: "a", formula: "2d8", type: "poison" } }], heightening: { type: "interval", interval: 2, damage: { a: "1d8" } } } } }) });
    assert.deepEqual(planRetaliation(stripes(3)).parts, [{ dice: 2, die: 8, bonus: 0, type: "poison" }]);
    assert.equal(planRetaliation(stripes(5)).parts[0].dice, 3);
    assert.equal(planRetaliation({ ...stripes(3), plan: { ...stripes(3).plan, targeting: { target: "1 ally and 1 enemy" } } }), null, "a ward on an ally: not the caster's touch");
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    wizard.spells = [stripes(3)];
    castSpell(state, wizard, 0, [wizard.id]);
    assert.equal(wizard.retaliations?.[0]?.touch, true);
    const shroud = { system: { level: { value: 3 }, description: { value: "Each creature that hits you with an unarmed attack, Grapples you, or otherwise touches you takes @Damage[3[fire]] damage. <strong>Heightened (+1)</strong> The damage caused by touching you increases by 1, and the fire damage when you Cast the Spell or sustain it increases by 1d6." } } };
    assert.deepEqual(textRetaliation(shroud, 3).parts, [{ dice: 0, die: 0, bonus: 3, type: "fire" }]);
    assert.equal(textRetaliation(shroud, 6).parts[0].bonus, 6);
});

test("polymorph over polymorph: the new one counteracts the old to take hold, else no effect; its worth counts the chance and the old one's loss", async () => {
    const { castSpell, spellExpectation } = await import("../src/engine/spells.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => {
        const doc = spellNamed(name);
        const plan = compileSpell(doc);
        return { name, plan, castRank, dc: 25, attack: 15, pool: null, effects: withTextConditions(effectModels(plan, castRank), doc, castRank) };
    };
    const setup = () => {
        const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
        const wizard = state.byId.get("wizard");
        wizard.spells = [entry("Enlarge", 4), entry("Fiery Body", 7)];
        castSpell(state, wizard, 0, [wizard.id]);
        assert.ok(wizard.effects.some((effect) => /Enlarge/.test(effect.model.name)), "Enlarge on it");
        return { state, wizard };
    };
    const forms = (wizard) => wizard.effects.filter((effect) => effect.counter?.traits?.includes("polymorph")).map((effect) => effect.model.name.replace(/^Spell Effect: /, ""));
    const failed = setup();
    failed.state.rng.d20 = () => 1;
    castSpell(failed.state, failed.wizard, 1, [failed.wizard.id]);
    assert.deepEqual(forms(failed.wizard), ["Enlarge"], "not counteracted: Fiery Body has no effect");
    assert.ok(failed.state.log.some((line) => /Fiery Body against Enlarge on Wizard \(polymorph\).*no effect on Wizard/.test(line)));
    const won = setup();
    won.state.rng.d20 = () => 20;
    castSpell(won.state, won.wizard, 1, [won.wizard.id]);
    assert.deepEqual(forms(won.wizard), ["Fiery Body"], "counteracted: Enlarge ends, Fiery Body takes hold");
    // (Shrink on a fighter: nothing to it alone; over its Enlarge, the chance of losing that.)
    const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const wizard = state.byId.get("wizard");
    const fighter = state.byId.get("fighter");
    wizard.spells = [entry("Enlarge", 4), entry("Shrink", 4)];
    const value = (spell) => spellExpectation(state, wizard, spell, [fighter]).filter((each) => each.target === fighter).reduce((sum, each) => sum + each.benefit + each.heal, 0);
    assert.ok(value(wizard.spells[0]) > 0.2, "Enlarge's +4 status damage to melee Strikes counts on a fighter");
    assert.equal(value(wizard.spells[1]), 0);
    castSpell(state, wizard, 0, [fighter.id]);
    assert.ok(value(wizard.spells[1]) < -0.1, "Shrink over Enlarge: worse than nothing");
});

test("ChoiceSet values that are objects: a field put in for its token, the only choice a rank allows put in as it is (Enlarge)", () => {
    const enlarge = { name: "Spell Effect: Enlarge", system: { duration: { value: 5, unit: "minutes" }, rules: [
        { key: "ChoiceSet", flag: "enlarge", choices: [
            { label: "PF2E.ActorSizeHuge", predicate: [{ gte: ["parent:level", 4] }], value: { damage: 4, reach: 15, size: "huge" } },
            { label: "PF2E.ActorSizeLarge", predicate: [{ or: [{ lte: ["parent:level", 3] }, { gte: ["parent:level", 6] }] }], value: { damage: 2, reach: 10, size: "large" } }] },
        { key: "FlatModifier", selector: ["melee-strike-damage"], type: "status", value: "{item|flags.system.rulesSelections.enlarge.damage}" }] } };
    assert.deepEqual(effectModel(enlarge, { rank: 2 }).conditional, [{ on: "damage", type: "status", value: 2, predicate: ["item:melee"] }]);
    assert.equal(effectModel(enlarge, { rank: 4 }).conditional[0].value, 4);
    const six = effectModel(enlarge, { rank: 6 });
    assert.deepEqual(six.choices.map((choice) => [choice.value, choice.model.conditional[0].value]), [["ActorSizeHuge", 4], ["ActorSizeLarge", 2]]);
});

test("Vibrant Thorns: its rank's damage on a touching hit, its rank in d6 after its caster casts a vitality spell until its next turn", async () => {
    const { castSpell, planRetaliation, touchRetaliation } = await import("../src/engine/spells.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const thorns = { name: "Vibrant Thorns", castRank: 3, pool: null, plan: compileSpell(spellNamed("Vibrant Thorns")) };
    assert.deepEqual(planRetaliation(thorns).parts, [{ dice: 0, die: 0, bonus: 3, type: "piercing" }]);
    assert.deepEqual(planRetaliation(thorns).boost, { trait: "vitality", parts: [{ dice: 3, die: 6, bonus: 0, type: "piercing" }] });
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const cleric = state.byId.get("cleric");
    const monster = state.byId.get("monster");
    const heal = { name: "Heal", castRank: 3, pool: null, dc: 20, attack: 10, effects: {}, plan: compileSpell(spellNamed("Heal")) };
    cleric.spells = [thorns, heal];
    castSpell(state, cleric, 0, [cleric.id]);
    const entry = cleric.retaliations.find((each) => each.name === "Vibrant Thorns");
    assert.ok(entry && !entry.boosted);
    castSpell(state, cleric, 1, [cleric.id]);
    assert.equal(entry.boosted, true, "a vitality spell feeds the thorns");
    state.rng.die = (sides) => sides;
    state.log = [];
    touchRetaliation(state, cleric, monster, "weapon");
    assert.ok(state.log.some((line) => /touches Cleric's Vibrant Thorns: 18 piercing/.test(line)), state.log.join("\n"));
    cleric.spells = [];
    cleric.actionsLeft = 0;
    takeTurn(state, cleric);
    assert.equal(entry.boosted, false, "until the start of its next turn");
});

test("Agitate: agitated for its save's rounds; no Stride, Fly or Swim in a turn — its damage as the turn ends; a Stride around its foes keeps it in", async () => {
    const { applyCondition, castSpell } = await import("../src/engine/spells.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const { engage } = await import("../src/engine/space.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const plan = compileSpell(spellNamed("Agitate"));
    assert.deepEqual(plan.agitation, { dice: 2, die: 8, type: "mental", step: { dice: 2, interval: 1 } });
    assert.deepEqual(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => plan.resolution.outcomes[degree].effects.map((effect) => `${effect.slug} ${effect.duration.value}`).join()), ["", "agitated 1", "agitated 2", "agitated 4"]);
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const brute = state.byId.get("monster");
    wizard.spells = [{ name: "Agitate", castRank: 3, pool: null, dc: 40, attack: 30, effects: {}, plan }];
    state.rng.d20 = () => 1;
    castSpell(state, wizard, 0, [brute.id]);
    assert.equal(brute.cond.agitated, true);
    assert.deepEqual(brute.agitation.parts, [{ dice: 6, die: 8, type: "mental" }], "heightened twice: 2d8 more each");
    // (Unable to move: its damage as its turn ends.)
    state.rng.d20 = () => 10;
    engage(state, brute, state.byId.get("fighter"));
    applyCondition(state, brute, "immobilized", null, null, wizard);
    state.log = [];
    takeTurn(state, brute);
    assert.ok(state.log.some((line) => /Brute didn't move, restless from Agitate: \d+ mental/.test(line)), state.log.join("\n"));
    // (Free to move: a Stride — around its foes, staying in its Melee —, no damage.)
    brute.cond.immobilized = false;
    state.log = [];
    takeTurn(state, brute);
    assert.ok(state.log.some((line) => /Brute Strides/.test(line)), state.log.join("\n"));
    assert.ok(!state.log.some((line) => /restless from Agitate/.test(line)));
});

test("Dancing Shield: its ChoiceSet's numbers through the '@item.flags…' token — the shield's circumstance bonus to AC on the willing creature", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const doc = spellNamed("Dancing Shield");
    const plan = compileSpell(doc);
    const effects = withTextConditions(effectModels(plan, 2), doc, 2);
    assert.deepEqual(Object.values(effects)[0].choices.map((choice) => choice.model.modifiers[0].value), [1, 2, 3]);
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const fighter = state.byId.get("fighter");
    wizard.spells = [{ name: "Dancing Shield", castRank: 2, pool: null, dc: 20, attack: 10, effects, plan }];
    castSpell(state, wizard, 0, [fighter.id]);
    assert.ok((fighter.effects ?? []).some((effect) => effect.model.modifiers?.some((modifier) => modifier.on === "ac" && modifier.value === 3)), state.log.join("\n"));
});

test("effect-note spells cast in fights as effects: the caster's own, a willing creature's for an item it holds; not one tied to a creature it targets", async () => {
    const { compileSpell, effectModels, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const read = (name) => compileSpell(spellNamed(name));
    const fire = read("Fire Shield");
    assert.equal(fire.resolution.kind, "effect");
    assert.equal(fire.resolution.applications[0].recipients, "self");
    assert.equal(fire.targeting.target, "self");
    assert.equal(read("Ghostly Weapon").targeting.target, "1 willing creature", "a weapon wielded by a willing ally: that ally");
    assert.equal(read("Vision of Weakness").resolution.kind, "effect-note", "the caster's effect against a creature it targets: left as it was");
    assert.equal(read("Knock").resolution.kind, "effect-note", "an object's");
    // (Fire Shield's resistance: its type from the flag its ActiveEffectLike sets.)
    assert.deepEqual(Object.values(effectModels(fire, 6))[0].resistances, [{ type: "cold", value: 10, exceptions: [] }]);
});

test("Spiral of Horrors: its aura's frightened held at 1 on the foes it reaches while it lasts — a floor; worth each round it holds", async () => {
    const { castSpell, spellExpectation } = await import("../src/engine/spells.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const doc = spellNamed("Spiral of Horrors");
    const plan = compileSpell(doc);
    const effects = withTextConditions(effectModels(plan, 4), doc, 4);
    assert.deepEqual(Object.values(effects)[0].auraFloor, { slug: "frightened", value: 1 });
    const state = createFightState({ combatants: [...standardParty(7), { ...moderateCreatureAt(7, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const brute = state.byId.get("monster");
    wizard.spells = [{ name: "Spiral of Horrors", castRank: 4, pool: null, dc: 25, attack: 15, effects, plan }];
    const held = spellExpectation(state, wizard, wizard.spells[0], [wizard]).find((entry) => entry.target === brute);
    castSpell(state, wizard, 0, [wizard.id]);
    assert.equal(brute.cond.frightened, 1);
    brute.actionsLeft = 0;
    takeTurn(state, brute);
    assert.equal(brute.cond.frightened, 1, "not below 1 at its turn's end");
    const plain = { ...effects[Object.keys(effects)[0]], auraFloor: undefined };
    const without = spellExpectation(createFightState({ combatants: [...standardParty(7), { ...moderateCreatureAt(7, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1), wizard, { ...wizard.spells[0], effects: { [Object.keys(effects)[0]]: plain } }, [wizard]).find((entry) => entry.target.id === "monster");
    assert.ok(held.benefit < without.benefit, "the floor makes it worse for the foe");
});

test("Weapon Surge: its pick of the caster's weapon read as its Strikes'; +1 and the spirit dice on its next Strike, then gone", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const { performStrike } = await import("../src/engine/actions.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const doc = spellNamed("Weapon Surge");
    const plan = compileSpell(doc);
    const effects = withTextConditions(effectModels(plan, 5), doc, 5);
    const model = Object.values(effects)[0];
    assert.deepEqual(model.modifiers, [{ on: "attack", type: "status", value: 1 }, { on: "damage", type: "dice", value: 7 }], "2d6 from rank 5");
    assert.equal(model.nextStrike, true);
    const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const fighter = state.byId.get("fighter");
    fighter.spells = [{ name: "Weapon Surge", castRank: 5, pool: null, dc: 25, attack: 15, effects, plan }];
    castSpell(state, fighter, 0, [fighter.id]);
    assert.ok(fighter.effects.some((effect) => effect.model.nextStrike));
    performStrike(state, fighter, state.byId.get("monster"), fighter.strikes[0]);
    assert.ok(!fighter.effects.some((effect) => effect.model.nextStrike), "used up by the Strike");
});

test("Aura of Violent Light: an emanation about the ally it's cast on, its basic save on the foes that end their turn in it; the cast saves no one", async () => {
    const { castSpell, targetSets } = await import("../src/engine/spells.js");
    const { takeTurn } = await import("../src/engine/fight.js");
    const { engage } = await import("../src/engine/space.js");
    // (A witch's hex, read from the compiler's plan as the spell's text gives it.)
    const plan = withReading({ rank: 1, traits: ["aura", "cantrip", "hex", "manipulate", "witch"], activation: { time: "1" }, targeting: { target: "1 willing ally", range: "30 feet", area: null },
        lifecycle: { sustained: true, durationSpec: { mode: "sustained", maximum: { mode: "fixed", value: 1, unit: "minutes" } } },
        compilerEvidence: { simpleBasicSaveGate: { evidence: { baseText: "A 5-foot emanation of light. Each Sustain, increase the emanation by 5 feet up to a maximum of 15 feet.", saveSentence: "The ally radiates heat: @Damage[(1+@item.level)[fire],(1+@item.level)[spirit]] damage to all enemies that end their turn within it (basic Fortitude save)." } } },
        resolution: { kind: "save", check: { statistic: "fortitude", basic: true, dcSource: "source-actor" }, sharedDamage: { mode: "pf2e-item-damage", rollOnce: true, components: [{ id: "a", formula: "2", type: "fire", kinds: ["damage"] }, { id: "b", formula: "2", type: "spirit", kinds: ["damage"] }] },
            outcomes: Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree, index) => [degree, { damage: { mode: index ? "shared" : "none", multiplier: [0, 0.5, 1, 2][index], sourceComponentIds: index ? ["a", "b"] : [] }, effects: [], nativeEffects: [], modifiers: [], followUps: [], decisions: [], manualInstructions: [], terminal: null, rawText: "" }])) } });
    assert.deepEqual(plan.resolution.lingering, { area: { type: "emanation", value: 5 }, centre: "target", noInitial: true, durationSeconds: 60, events: ["turn-end"], sustained: true, grows: { by: 5, max: 15 } });
    const state = createFightState({ combatants: [...standardParty(3), { ...moderateCreatureAt(3, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const witch = state.byId.get("wizard");
    const fighter = state.byId.get("fighter");
    const brute = state.byId.get("monster");
    engage(state, brute, fighter);
    witch.spells = [{ name: "Aura of Violent Light", castRank: 1, pool: null, dc: 30, attack: 20, effects: {}, plan }];
    const sets = targetSets(state, witch, witch.spells[0], { enemies: [brute], allies: state.list.filter((c) => c.side === "party"), inMelee: () => false, distance: () => 30, meleeId: null });
    assert.ok(sets.every((set) => set.targets[0].side === "party" && set.targets[0] !== witch), "an ally, not the caster or a foe");
    state.log = [];
    castSpell(state, witch, 0, [fighter.id]);
    assert.ok(!state.log.some((line) => /Fighter takes/.test(line)), "the ally isn't hurt");
    assert.ok(state.zones.some((zone) => zone.name === "Aura of Violent Light" && zone.anchorId === fighter.id), "about the fighter");
    const { applyCondition } = await import("../src/engine/spells.js");
    applyCondition(state, brute, "immobilized", null, null, witch);
    const hp = brute.hp.value;
    state.rng.d20 = () => 1;
    takeTurn(state, brute);
    assert.ok(brute.hp.value < hp, state.log.join("\n"));
});

test("reaction spells as the damage comes: Eat Fire's fire resistance against it; Shadow Siphon's counteract halving a spell's damage for all", async () => {
    const { castSpell, spellReactions } = await import("../src/engine/spells.js");
    const { applyDamage } = await import("../src/engine/actions.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => {
        const doc = spellNamed(name);
        const plan = compileSpell(doc);
        return { name, plan, castRank, dc: 28, attack: 18, pool: null, effects: withTextConditions(effectModels(plan, castRank), doc, castRank) };
    };
    const fresh = () => createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster", name: "Mage" }] }, { morale: false, retreat: false }, 1, { log: true });
    // (Eat Fire: resistance 10 at rank 5 — 5 more every 3 ranks — against the fire, its reaction spent.)
    let state = fresh();
    let wizard = state.byId.get("wizard");
    wizard.spells = [entry("Eat Fire", 5)];
    spellReactions(wizard);
    assert.deepEqual(wizard.resistReaction, { name: "Eat Fire", value: 10, on: ["fire"], types: ["fire"], fromSpell: 0 });
    const hp = wizard.hp.value;
    applyDamage(state, wizard, [{ type: "fire", amount: 25, persistent: false, precision: false }], { source: state.byId.get("monster") });
    assert.equal(hp - wizard.hp.value, 15);
    assert.ok(state.log.some((line) => /Wizard uses Eat Fire: resistance 10 to fire/.test(line)), state.log.join("\n"));
    assert.equal(compileSpell(spellNamed("Eat Fire")).resolution.kind, "effect", "rated as its effect on the caster");
    // (Shadow Siphon: a Fireball at the party, halved for every creature it hits.)
    state = fresh();
    wizard = state.byId.get("wizard");
    const mage = state.byId.get("monster");
    wizard.spells = [entry("Shadow Siphon", 5)];
    spellReactions(wizard);
    assert.deepEqual(wizard.siphon, { index: 0, rankBonus: 2 });
    mage.spells = [entry("Fireball", 5)];
    state.rng.d20 = () => 15;
    castSpell(state, mage, 0, state.list.filter((c) => c.side === "party").map((c) => c.id));
    assert.ok(state.log.some((line) => /Wizard reacts with Shadow Siphon against Fireball: .* → half the damage/.test(line)), state.log.join("\n"));
});

test("Undermine Reality: quasi-real for its row's time — its Strikes deal half damage, saves against its spells a degree better", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const { applyDamage, expectedHitDamage } = await import("../src/engine/actions.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const plan = compileSpell(spellNamed("Undermine Reality"));
    const effect = (degree) => plan.resolution.outcomes[degree].effects.find((each) => each.slug === "quasi-real");
    assert.equal(effect("criticalSuccess"), undefined);
    assert.deepEqual(effect("success").duration, { mode: "fixed", value: 1, unit: "rounds" });
    assert.deepEqual(effect("failure").duration, { mode: "fixed", value: 10, unit: "rounds", saveEnds: { save: "will", dc: "spell" } });
    assert.equal(effect("criticalFailure").duration, null, "for good");
    const state = createFightState({ combatants: [...standardParty(15), { ...moderateCreatureAt(14, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const brute = state.byId.get("monster");
    const fighter = state.byId.get("fighter");
    const before = expectedHitDamage(brute, brute.strikes[0], fighter, false);
    wizard.spells = [{ name: "Undermine Reality", castRank: 8, pool: null, dc: 45, attack: 35, effects: {}, plan }];
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 0, [brute.id]);
    assert.equal(brute.cond.quasiReal, true);
    assert.ok(expectedHitDamage(brute, brute.strikes[0], fighter, false) <= before / 2 + 0.5, "its Strikes' damage halved, as the planner sees it");
    const hp = fighter.hp.value;
    applyDamage(state, fighter, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: brute, physical: true });
    assert.equal(hp - fighter.hp.value, 10, "half of 20");
});

test("a spell's affliction: its stages' text read into numbers (damage, conditions, time) and played with the spell's DC and rank", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const sting = compileSpell(spellNamed("Spider Sting"));
    assert.deepEqual(sting.resolution.afflictionHandoff.stages.map(({ text, ...stage }) => stage), [
        { stage: 1, damage: ["(1d4)[poison]"], conditions: [{ slug: "enfeebled", value: 1 }], duration: { value: 1, unit: "rounds" } },
        { stage: 2, damage: ["(1d4)[poison]"], conditions: [{ slug: "enfeebled", value: 2 }], duration: { value: 1, unit: "rounds" } }]);
    assert.deepEqual(sting.resolution.afflictionHandoff.maximumDuration, { value: 4, unit: "rounds" });
    const storm = compileSpell(spellNamed("Dread Mosquito Storm"));
    assert.deepEqual(["success", "failure", "criticalFailure"].map((degree) => storm.resolution.outcomes[degree].affliction?.stage), [1, 1, 2], "its rows' 'afflicted … at stage N'");
    const state = createFightState({ combatants: [...standardParty(3), { ...moderateCreatureAt(3, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const brute = state.byId.get("monster");
    wizard.spells = [{ name: "Spider Sting", castRank: 1, pool: null, dc: 20, attack: 10, effects: {}, plan: sting }];
    // (A failure, not a critical one: stage 1.)
    const { saveModifier } = await import("../src/engine/combatant.js");
    state.rng.d20 = () => 20 - saveModifier(brute, "fortitude") - 3;
    castSpell(state, wizard, 0, [brute.id]);
    assert.equal(brute.afflictions?.[0]?.data.dc, 20, "the spell's DC");
    assert.equal(brute.cond.enfeebled, 1, state.log.join("\n"));
    assert.ok(state.log.some((line) => /takes \d+ poison \(Spider Venom\)/.test(line)));
});

test("Blessing of Defiance: its action counts — one willing creature, or every ally about the caster at 3 —, its effect for the count cast with", async () => {
    const { castSpell, describeSpell, targetSets } = await import("../src/engine/spells.js");
    const { compileSpell, effectModels, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const plan = compileSpell(spellNamed("Blessing of Defiance"));
    assert.equal(describeSpell(plan, 1).targets, 1);
    assert.deepEqual(describeSpell(plan, 3).area, { type: "emanation", value: 30 });
    const effects = effectModels(plan, 5);
    const model = Object.values(effects)[0];
    assert.deepEqual(Object.keys(model.byActions), ["1", "2", "3"]);
    assert.equal(model.byActions[1].choices.find((choice) => choice.value === "will").model.resistances.length, 0);
    assert.deepEqual(model.byActions[2].choices.find((choice) => choice.value === "will").model.resistances, [{ type: "mental", value: 15, exceptions: [] }], "two actions: resistance 15 with Will");
    const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const cleric = state.byId.get("cleric");
    const fighter = state.byId.get("fighter");
    cleric.spells = [{ name: "Blessing of Defiance", castRank: 5, pool: null, dc: 28, attack: 18, effects, plan }];
    const sets = targetSets(state, cleric, cleric.spells[0], { enemies: [state.byId.get("monster")], allies: state.list.filter((c) => c.side === "party"), inMelee: () => false, distance: () => 30, meleeId: null }, 1);
    assert.ok(sets.every((set) => set.targets.every((target) => target.side === "party")), "a willing creature: not the foe");
    castSpell(state, cleric, 0, [fighter.id], 2);
    const held = fighter.effects.find((effect) => /Blessing of Defiance/.test(effect.model.name));
    assert.ok(held?.model.modifiers.some((modifier) => ["fortitude", "reflex", "will"].includes(modifier.on) && modifier.value === 4), state.log.join("\n"));
});

test("marks against the caster alone: Brand the Impenitent's -1 AC and sight through concealment, Vindicator's Judgment's weakness to its Strikes", async () => {
    const { castSpell } = await import("../src/engine/spells.js");
    const { targetAC, applyDamage, performStrike } = await import("../src/engine/actions.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const brand = compileSpell(spellNamed("Brand the Impenitent"));
    const judgment = compileSpell(spellNamed("Vindicator's Judgment"));
    assert.deepEqual(brand.marks, { branded: { ac: 1, seesConcealed: true } });
    assert.deepEqual(Object.keys(judgment.marks).sort(), ["judged", "judged-hard", "judged-once"]);
    assert.equal(judgment.targeting.target, "1 creature", "its hunted prey: any creature");
    const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const fighter = state.byId.get("fighter");
    const rogue = state.byId.get("rogue");
    const brute = state.byId.get("monster");
    const strike = fighter.strikes[0];
    const before = targetAC(state, fighter, brute, strike, false);
    fighter.spells = [{ name: "Brand the Impenitent", castRank: 2, pool: null, dc: 40, attack: 30, effects: {}, plan: brand }, { name: "Vindicator's Judgment", castRank: 7, pool: null, dc: 40, attack: 30, effects: {}, plan: judgment }];
    state.rng.d20 = () => 8;
    castSpell(state, fighter, 0, [brute.id]);
    assert.equal(targetAC(state, fighter, brute, strike, false), before - 1, "-1 AC to the brander");
    assert.equal(targetAC(state, rogue, brute, rogue.strikes[0], false), targetAC(state, rogue, brute, rogue.strikes[0], false), "not to another");
    castSpell(state, fighter, 1, [brute.id]);
    const mark = brute.marks.find((entry) => entry.spell === "Vindicator's Judgment");
    assert.equal(mark.weakness, 10, "10 at rank 7");
    const hp = brute.hp.value;
    applyDamage(state, brute, [{ type: "slashing", amount: 5, persistent: false, precision: false }], { source: fighter, physical: true });
    assert.equal(hp - brute.hp.value, 15, "the weakness on a hit");
    const hpRogue = brute.hp.value;
    applyDamage(state, brute, [{ type: "slashing", amount: 5, persistent: false, precision: false }], { source: rogue, physical: true });
    assert.equal(hpRogue - brute.hp.value, 5, "not on another's");
    performStrike(state, fighter, brute, strike);
    assert.ok(brute.marks.some((entry) => entry.spell === "Vindicator's Judgment"), "a failure's lasts beyond one Strike");
});

test("Magic Stone: a stone a action, held by the caster or an ally — a +1 striking disrupting sling Strike, loaded and used up a stone at a time", async () => {
    const { castSpell, describeSpell } = await import("../src/engine/spells.js");
    const { performStrike } = await import("../src/engine/actions.js");
    const { compileSpell, effectModels, spellNamed, withTextConditions } = await import("../tools/lib/pack-spells.mjs");
    const doc = spellNamed("Magic Stone");
    const plan = compileSpell(doc);
    assert.equal(describeSpell(plan, 3).targets, 1);
    const effects = withTextConditions(effectModels(plan, 1), doc, 1);
    const model = Object.values(effects)[0];
    assert.deepEqual(model.stones, { potency: 1, striking: 1, runes: ["disrupting"], die: 6, type: "bludgeoning" });
    assert.deepEqual(model.strikeAdds.groups, ["sling"], "disrupting on slings only");
    const state = createFightState({ combatants: [...standardParty(3), { ...moderateCreatureAt(3, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const cleric = state.byId.get("cleric");
    const rogue = state.byId.get("rogue");
    cleric.spells = [{ name: "Magic Stone", castRank: 1, pool: null, dc: 18, attack: 8, effects, plan }];
    castSpell(state, cleric, 0, [rogue.id], 2);
    const stone = rogue.strikes.find((strike) => strike.name === "Magic Stone");
    const bow = rogue.strikes.find((strike) => strike.name === "Shortbow");
    assert.equal(stone.bonus, bow.bonus - bow.potency + 1, "the rogue's ranged bonus without its bow's rune, +1");
    assert.deepEqual(stone.damage, [{ dice: 2, die: 6, bonus: 0, type: "bludgeoning" }], "propulsive: half the rogue's Strength +1, rounded down");
    assert.equal(stone.increment, 50);
    assert.equal(stone.reload, 1, "a sling's: loaded a stone at a time");
    assert.ok(rogue.unloaded.has("Magic Stone"), "the first not loaded yet");
    assert.equal(rogue.spellPools[stone.ammo.pool], 2, "two actions: two stones");
    const fighter = state.byId.get("fighter");
    castSpell(state, cleric, 0, [fighter.id], 1);
    assert.equal(fighter.strikes.find((strike) => strike.name === "Magic Stone").damage[0].bonus, 2, "the fighter's Strength +4: +2");
    performStrike(state, rogue, state.byId.get("monster"), stone);
    performStrike(state, rogue, state.byId.get("monster"), stone);
    assert.equal(rogue.spellPools[stone.ammo.pool], 0);
});

test("a spell built on its caster's own Strikes rated with the fighter casting too (the user: 'Give those spells a martial caster to rate then')", async () => {
    const { partyWithSpell } = await import("../src/engine/spell-power.js");
    const party = standardParty(5);
    const entry = { name: "Test Judgment", plan: { rank: 1 }, castRank: 1, pool: "rated", dc: 20, attack: 10, castBy: "fighter" };
    const withIt = partyWithSpell(party, entry);
    assert.ok(withIt.find((c) => c.id === "fighter").spells.includes(entry));
    assert.equal(withIt.find((c) => c.id === "fighter").spellPools.rated, 1);
    assert.ok(!withIt.find((c) => c.id === "wizard").spells.includes(entry));
});

test("weapon buffs: rune upgrades on the weapon picked, unarmed or a club or staff; Strikes an effect gives; Gravity Weapon's dice; a Reactive Strike", async () => {
    const { effectModel, applyEffect, removeEffect } = await import("../src/engine/effects.js");
    const { featureParts } = await import("../src/engine/actions.js");
    const { effectItemById } = await import("../tools/lib/pack-spells.mjs");
    const model = (id, rank = 1) => effectModel(effectItemById(id), { rank });
    const state = createFightState({ combatants: [...standardParty(1), { ...moderateCreatureAt(1, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1);
    const fighter = state.byId.get("fighter");
    const wizard = state.byId.get("wizard");
    // (Runic Weapon: +1 striking on the fighter's greatsword at 1st level — no runes of its own yet.)
    const greatsword = fighter.strikes.find((strike) => strike.name === "Greatsword");
    const runic = applyEffect(state, fighter, model("GnWkI3T3LYRlm3X8"), fighter);
    const upgraded = fighter.strikes.find((strike) => strike.name === "Greatsword");
    assert.equal(upgraded.bonus, greatsword.bonus + 1);
    assert.equal(upgraded.damage[0].dice, 2);
    assert.ok(fighter.strikes.filter((strike) => strike.name !== "Greatsword").every((strike) => fighter.strikes.includes(strike)), "the weapon picked alone");
    removeEffect(fighter, runic);
    assert.equal(fighter.strikes.find((strike) => strike.name === "Greatsword"), greatsword, "as it was");
    // (Shillelagh: the wizard's staff, a club's group.)
    const shillelagh = model("deG1dtfuQph03Kkg");
    assert.deepEqual(shillelagh.runeUpgrade, { potency: 1, striking: 1, scope: "picked", groups: ["club", "staff"] });
    applyEffect(state, wizard, shillelagh, wizard);
    assert.equal(wizard.strikes.find((strike) => strike.name === "Staff").damage[0].dice, 2);
    // (Claws of the Otter: a claw with its cold die, the wizard's while it lasts.)
    const claws = applyEffect(state, wizard, model("UPisuG2cfjMIJOPa", 2), wizard);
    assert.deepEqual(wizard.strikes.find((strike) => strike.name === "Claw")?.damage.map((part) => part.type), ["slashing", "cold"]);
    removeEffect(wizard, claws);
    assert.ok(!wizard.strikes.some((strike) => strike.name === "Claw"));
    // (Gravity Weapon: its first weapon Strike a round, twice the weapon's dice.)
    applyEffect(state, fighter, model("tNjimcyUwn8afeH6"), fighter);
    assert.equal(featureParts(fighter, greatsword, state.byId.get("monster")).find((part) => part.bonus === 2)?.bonus, 2);
    assert.ok(!featureParts(fighter, greatsword, state.byId.get("monster"), { firstWeaponStrike: false }).some((part) => part.bonus === 2));
    // (Embodiment of Battle: +1 to weapon attacks and damage, a Reactive Strike while it lasts.)
    const embodiment = model("uiXWJVwWuMS3KvkV");
    assert.ok(embodiment.modifiers.some((modifier) => modifier.on === "attack" && modifier.value === 1));
    const rogue = state.byId.get("rogue");
    const held = applyEffect(state, rogue, embodiment, rogue);
    assert.equal(rogue.reactions.aoo, true);
    removeEffect(rogue, held);
    assert.equal(rogue.reactions.aoo, false);
});

test("rating fixes: Guidance's bonus on its own name; Dispel Magic against foes under Haste; an ally's poison counteracted (Purging Toxins)", async () => {
    const { effectModel } = await import("../src/engine/effects.js");
    const { castSpell } = await import("../src/engine/spells.js");
    const { effectItemById, compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const guidance = effectModel(effectItemById("3qHKBDF7lrHw8jFK"), { rank: 1 });
    assert.ok(guidance.modifiers.some((modifier) => modifier.on === "attack" && modifier.value === 1));
    const foes = powerFoes("boss", 5, "spell-buffed");
    assert.equal(foes.spellBuffed, true);
    // (A poisoned fighter, its poison counteracted.)
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster" }] }, { morale: false, retreat: false }, 1, { log: true });
    const fighter = state.byId.get("fighter");
    const stages = [1, 2].map((stage) => ({ stage, damage: ["1d6[poison]"], conditions: [{ slug: "enfeebled", value: stage }], duration: { value: 1, unit: "rounds" } }));
    fighter.afflictions = [{ name: "Poison", source: "monster", data: { name: "Poison", traits: ["poison"], dc: 15, statistic: "fortitude", stages }, stages, stage: 2, endRound: Infinity, conditions: [{ slug: "enfeebled", value: 2 }], models: {}, stageEffects: [] }];
    fighter.cond.enfeebled = 2;
    const cleric = state.byId.get("cleric");
    cleric.spells = [{ name: "Purging Toxins", castRank: 3, pool: null, dc: 30, attack: 30, effects: {}, plan: compileSpell(spellNamed("Purging Toxins")) }];
    state.rng.d20 = () => 15;
    castSpell(state, cleric, 0, [fighter.id]);
    assert.equal(fighter.afflictions.length, 0, state.log.join("\n"));
});

test("reaction spells that guard (family 2): Protector's Sacrifice's share, Martyr's Intervention at 1 HP, Retributive Pain, Enduring Might", async () => {
    const { spellReactions, reactionGuardOf } = await import("../src/engine/spells.js");
    const { applyDamage } = await import("../src/engine/actions.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 25, attack: 15, effects: {}, plan: compileSpell(spellNamed(name)) });
    assert.deepEqual(reactionGuardOf(entry("Protector's Sacrifice", 3)), { kind: "share", amount: 9, within: 30 }, "3 a rank");
    const fresh = () => createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    // (Protector's Sacrifice: 3 of a big hit on the fighter, on the cleric.)
    let state = fresh();
    let cleric = state.byId.get("cleric");
    const fighter = state.byId.get("fighter");
    const brute = state.byId.get("monster");
    cleric.spells = [entry("Protector's Sacrifice", 1)];
    spellReactions(cleric);
    let hp = { fighter: fighter.hp.value, cleric: cleric.hp.value };
    applyDamage(state, fighter, [{ type: "slashing", amount: Math.ceil(fighter.hp.max / 2), persistent: false, precision: false }], { source: brute, physical: true });
    assert.equal(hp.cleric - cleric.hp.value, 3);
    assert.equal(hp.fighter - fighter.hp.value, Math.ceil(fighter.hp.max / 2) - 3);
    // (Martyr's Intervention: the rogue kept at 1, the rest on the cleric, both wounded.)
    state = fresh();
    cleric = state.byId.get("cleric");
    const rogue = state.byId.get("rogue");
    cleric.spells = [entry("Martyr's Intervention", 3)];
    spellReactions(cleric);
    rogue.hp.value = 10;
    hp = cleric.hp.value;
    applyDamage(state, rogue, [{ type: "slashing", amount: 14, persistent: false, precision: false }], { source: state.byId.get("monster"), physical: true });
    assert.equal(rogue.hp.value, 1);
    assert.equal(hp - cleric.hp.value, 5);
    assert.equal(rogue.cond.wounded, 1);
    // (Retributive Pain: half back as mental.)
    state = fresh();
    cleric = state.byId.get("cleric");
    cleric.spells = [entry("Retributive Pain", 4)];
    spellReactions(cleric);
    state.rng.d20 = () => 5;
    applyDamage(state, cleric, [{ type: "slashing", amount: 20, persistent: false, precision: false }], { source: state.byId.get("monster"), physical: true });
    assert.ok(state.log.some((line) => /reacts with Retributive Pain/.test(line)), state.log.join("\n"));
    // (Enduring Might: resistance 2 a rank plus its Strength.)
    state = fresh();
    cleric = state.byId.get("cleric");
    cleric.spells = [entry("Enduring Might", 4)];
    spellReactions(cleric);
    assert.equal(cleric.resistReaction?.value, 9, "8 + the cleric's Strength +1");
});

test("counterspells and rerolls (family 2): Nullify undoes a foe's spell; Spell Riposte turns it back; Lucky Break rerolls a failed save", async () => {
    const { castSpell, spellReactions } = await import("../src/engine/spells.js");
    const { compileSpell, effectModels, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => { const plan = compileSpell(spellNamed(name)); return { name, castRank, pool: null, dc: 40, attack: 30, effects: effectModels(plan, castRank), plan }; };
    const fresh = () => createFightState({ combatants: [...standardParty(19), { ...moderateCreatureAt(19, "monster"), id: "monster", name: "Mage" }] }, { morale: false, retreat: false }, 1, { log: true });
    let state = fresh();
    let wizard = state.byId.get("wizard");
    let mage = state.byId.get("monster");
    wizard.spells = [entry("Nullify", 10)];
    spellReactions(wizard);
    mage.spells = [{ ...entry("Fireball", 9), dc: 38, attack: 28 }];
    const hp = state.list.filter((c) => c.side === "party").map((c) => c.hp.value);
    castSpell(state, mage, 0, state.list.filter((c) => c.side === "party").map((c) => c.id));
    assert.ok(state.log.some((line) => /reacts with Nullify: Fireball is undone/.test(line)), state.log.join("\n"));
    assert.ok(state.list.filter((c) => c.side === "party" && c.id !== "wizard").every((c, index) => c.hp.value === hp[state.list.filter((o) => o.side === "party").indexOf(c)]), "no one burned");
    state = fresh();
    wizard = state.byId.get("wizard");
    mage = state.byId.get("monster");
    wizard.spells = [entry("Spell Riposte", 7)];
    spellReactions(wizard);
    mage.spells = [{ ...entry("Disintegrate", 6), dc: 30, attack: 20 }];
    state.rng.d20 = () => 15;
    castSpell(state, mage, 0, [wizard.id]);
    assert.ok(state.log.some((line) => /Spell Riposte against Disintegrate: .* turned back on Mage/.test(line)), state.log.join("\n"));
    // (Lucky Break: a failed save rerolled.)
    state = fresh();
    const cleric = state.byId.get("cleric");
    cleric.spells = [entry("Lucky Break", 4)];
    spellReactions(cleric);
    assert.deepEqual(cleric.saveReroll, { name: "Lucky Break", failureOnly: true, fromSpell: 0 });
});

test("family 3, damage with unread mechanics: Psychic Outburst's action counts; Kinetic Ram's push; the rated caster within a short range", async () => {
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const { describeSpell } = await import("../src/engine/spells.js");
    const outburst = compileSpell(spellNamed("Psychic Outburst"));
    assert.equal(outburst.resolution.native.variants, undefined, "its 2-round casting's variant left out");
    const ram = compileSpell(spellNamed("Kinetic Ram"));
    assert.deepEqual(ram.resolution.outcomes.criticalFailure.forcedMovement, { kind: "push", distance: 20 });
    assert.deepEqual(describeSpell(ram, 3).area, { type: "emanation", value: 5 });
    const { partyFor } = await import("../tools/lib/deadliness.mjs");
    const { partyLevelForRank, wizardCasting } = await import("../src/engine/spell-power.js");
    const party = partyFor(partyLevelForRank(1));
    const casting = wizardCasting(party);
    const puff = { name: "Puff of Poison", plan: compileSpell(spellNamed("Puff of Poison")), castRank: 1, dc: casting.dc, attack: casting.attack, pool: RATED_POOL, effects: {} };
    assert.ok(castPower(party, powerFoes("boss", partyLevelForRank(1)), puff)?.share > 0, "its 10 feet: the caster steps within them");
});

test("family 3 curses: Cycle of Retribution's hostile action, Warrior's Regret's turn end, Bloodspray Curse's big hit, Implement of Destruction's weapon", async () => {
    const { castSpell, curseOnHostile, regretTurnEnd } = await import("../src/engine/spells.js");
    const { applyDamage } = await import("../src/engine/actions.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 40, attack: 30, effects: {}, plan: compileSpell(spellNamed(name)) });
    const state = createFightState({ combatants: [...standardParty(7), { ...moderateCreatureAt(7, "monster"), id: "monster", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const fighter = state.byId.get("fighter");
    const brute = state.byId.get("monster");
    wizard.spells = [entry("Cycle of Retribution", 4), entry("Warrior's Regret", 4), entry("Bloodspray Curse", 4), entry("Implement of Destruction", 4)];
    state.rng.d20 = () => 2;
    for (const index of [0, 1, 2, 3]) castSpell(state, wizard, index, [brute.id]);
    assert.deepEqual(brute.curses.map((held) => `${held.kind}:${held.mode}`).sort(), ["bloodspray:bleed", "cycle:each", "destruction:persistent-double", "regret:fight"]);
    assert.equal(brute.curses.find((held) => held.kind === "destruction").by, "fighter", "the fighter's weapon");
    let hp = brute.hp.value;
    curseOnHostile(state, brute);
    assert.ok(brute.hp.value < hp, "its hostility hurts it");
    brute.damagedThisTurn = new Set(["fighter", "rogue"]);
    hp = brute.hp.value;
    regretTurnEnd(state, brute);
    assert.ok(brute.hp.value < hp, "two it hurt");
    hp = brute.hp.value;
    applyDamage(state, brute, [{ type: "slashing", amount: 12, persistent: false, precision: false }], { source: fighter, physical: true });
    assert.ok(hp - brute.hp.value > 12, "Bloodspray's and Implement's dice on the fighter's big hit");
    assert.ok((brute.persistent ?? []).some((held) => held.type === "mental"), "Implement's persistent mental");
});

test("family 4 control: Banishment's extraplanar target, Containment's field, Steal Voice's silence, Overwhelming Presence's tribute", async () => {
    const { castSpell, canCast, heldTurnStart } = await import("../src/engine/spells.js");
    const { isActive } = await import("../src/engine/combatant.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 40, attack: 30, effects: {}, plan: compileSpell(spellNamed(name)) });
    const foe = (id, traits = []) => ({ ...moderateCreatureAt(7, id), id, name: id, traits });
    const state = createFightState({ combatants: [...standardParty(9), foe("demon", ["fiend", "demon"]), foe("devil", ["fiend", "devil"]), foe("brute"), foe("mage"), foe("knight")] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    wizard.spells = [entry("Banishment", 5), entry("Containment", 5), entry("Steal Voice", 3), entry("Overwhelming Presence", 9)];
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 0, ["brute"]);
    assert.ok(isActive(state.byId.get("brute")), "the brute is on its home plane");
    castSpell(state, wizard, 0, ["demon"]);
    const demon = state.byId.get("demon");
    assert.ok(!isActive(demon) && demon.banished, "the demon banished");
    castSpell(state, wizard, 1, ["brute"]);
    const brute = state.byId.get("brute");
    assert.equal(brute.contained?.hp, 55, "40 Hit Points, 15 more at 5th rank");
    assert.ok(!isActive(brute), "out of reach in its field");
    state.rng.die = () => 1;
    assert.equal(heldTurnStart(state, brute), true, "its turn at the field");
    assert.ok(brute.contained, "small hits don't break it (Hardness 10)");
    brute.contained.hp = 1;
    state.rng.die = (sides) => sides;
    heldTurnStart(state, brute);
    assert.equal(brute.contained, null, "out once the field breaks");
    castSpell(state, wizard, 2, ["mage"]);
    const mage = state.byId.get("mage");
    assert.ok(mage.cond.voiceless, "voiceless");
    assert.equal(canCast(mage, { name: "Fireball", plan: compileSpell(spellNamed("Fireball")), castRank: 3, pool: null }), false, "no spell but a subtle one");
    castSpell(state, wizard, 3, ["knight"]);
    const knight = state.byId.get("knight");
    assert.equal(knight.tribute?.left, 6, "a critical failure: 6 actions");
    assert.equal(knight.tribute.all, true, "all its actions");
    knight.actionsLeft = 3;
    assert.equal(heldTurnStart(state, knight), false);
    assert.equal(knight.actionsLeft, 0, "all three paid");
    assert.equal(knight.tribute.left, 3);
    state.rng.d20 = () => 20;
    const before = wizard.cond.stunned ?? 0;
    wizard.spells[0] = { ...wizard.spells[0], dc: 10 };
    castSpell(state, wizard, 0, ["devil"]);
    assert.ok(isActive(state.byId.get("devil")), "it resists");
    assert.ok((wizard.cond.stunned ?? 0) > before || state.log.some((line) => /Wizard is stunned/i.test(line)), "a critical success: the caster stunned 1");
});

test("family 4 ratings: Containment worth little on a lone boss; Steal Voice against spellcasting foes; Banishment against fiends", async () => {
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const { partyFor } = await import("../tools/lib/deadliness.mjs");
    const { partyLevelForRank, wizardCasting } = await import("../src/engine/spell-power.js");
    const rated = (name, rank, kind, trait = null) => {
        const party = partyFor(partyLevelForRank(rank));
        const casting = wizardCasting(party);
        const spell = { name, plan: compileSpell(spellNamed(name)), castRank: rank, dc: casting.dc, attack: casting.attack, pool: RATED_POOL, effects: {} };
        return castPower(party, powerFoes(kind, partyLevelForRank(rank), trait), spell)?.share ?? 0;
    };
    assert.ok(rated("Containment", 4, "group") > 2 * rated("Containment", 4, "boss"), "a group fights on without the one held");
    assert.ok(powerConditions(compileSpell(spellNamed("Steal Voice"))).includes("spellcaster"));
    assert.equal(rated("Steal Voice", 3, "group"), 0, "against foes with only Strikes, nothing");
    assert.ok(rated("Steal Voice", 3, "group", "spellcaster") > 0);
    assert.ok(powerConditions(compileSpell(spellNamed("Banishment"))).includes("fiend"));
    assert.equal(rated("Banishment", 5, "group"), 0, "on their home plane");
    assert.ok(rated("Banishment", 5, "group", "fiend") > 0);
});

test("family 4 hindrances: Binding Muzzle's mouth, Bewilder's flat check, Vicious Jealousy's berating, Sensory Deprivation's hands", async () => {
    const { castSpell, canCast, heldTurnStart } = await import("../src/engine/spells.js");
    const { bewilderFails } = await import("../src/engine/actions.js");
    const { strikeUsable } = await import("../src/engine/combatant.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const { spellRefs, spellOf } = await import("../tools/lib/spell-power.mjs");
    const named = (name) => spellNamed(name) ?? spellOf(spellRefs().find((ref) => ref.name === name));
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 40, attack: 30, effects: {}, plan: compileSpell(named(name)) });
    const foe = (id) => ({ ...moderateCreatureAt(7, id), id, name: id });
    const state = createFightState({ combatants: [...standardParty(9), foe("wolf"), foe("mage"), foe("brute"), foe("ogre")] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    wizard.spells = [entry("Binding Muzzle", 2), entry("Bewilder", 4), entry("Vicious Jealousy", 2), entry("Sensory Deprivation", 1)];
    const wolf = state.byId.get("wolf");
    wolf.strikes = [{ ...wolf.strikes[0], name: "Jaws" }, { ...wolf.strikes[0], name: "Claw", agile: true }];
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 0, ["wolf"]);
    assert.equal(strikeUsable(wolf, wolf.strikes[0]), false, "no jaws");
    assert.equal(strikeUsable(wolf, wolf.strikes[1]), true, "its claws");
    assert.ok(wolf.cond.voiceless, "a critical failure: it can't speak");
    castSpell(state, wizard, 1, ["brute"]);
    const brute = state.byId.get("brute");
    assert.equal(brute.hindrances.find((held) => held.kind === "bewildered")?.flat, 11, "DC 11 on a critical failure");
    state.rng.d20 = () => 5;
    assert.equal(bewilderFails(state, brute), true, "a 5 fails it");
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 2, ["ogre"]);
    const ogre = state.byId.get("ogre");
    assert.ok(ogre.hindrances.some((held) => held.kind === "allyless") && ogre.hindrances.some((held) => held.kind === "jealous"));
    ogre.meleeId = brute.meleeId = "m-test";
    ogre.actionsLeft = 3;
    heldTurnStart(state, ogre);
    assert.equal(ogre.actionsLeft, 2, "its first action waving off the brute");
    const mage = state.byId.get("mage");
    state.strikeShare = new Map([["mage", 0.5]]);
    mage.spells = [entry("Fireball", 3)];
    castSpell(state, wizard, 3, ["mage"]);
    assert.deepEqual(mage.hindrances.find((held) => held.kind === "deprived")?.senses, ["hands", "eyes"], "a caster's hands first, both on a critical failure");
    assert.equal(canCast(mage, mage.spells[0]), false, "no manipulate action");
    assert.ok(mage.cond.dazzled);
    mage.actionsLeft = 3;
    state.rng.d20 = () => 20;
    heldTurnStart(state, mage);
    assert.equal(mage.actionsLeft, 2, "an action to Seek");
    assert.ok(!mage.hindrances.some((held) => held.kind === "deprived") && !mage.cond.dazzled, "disbelieved");
});

test("heightened targets: Slow's 10 creatures at 6th, Bewilder's from its text", async () => {
    const { atCastRank, describeSpell } = await import("../src/engine/spells.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const { spellRefs, spellOf } = await import("../tools/lib/spell-power.mjs");
    const slow = compileSpell(spellNamed("Slow"));
    assert.deepEqual(slow.heightenedTargets, [{ minRank: 6, target: "10 creatures" }]);
    assert.equal(describeSpell(atCastRank({ name: "Slow", castRank: 3, plan: slow }).plan).targets, 1);
    assert.equal(describeSpell(atCastRank({ name: "Slow", castRank: 6, plan: slow }).plan).targets, 10);
    assert.equal(atCastRank({ name: "Slow", castRank: 7, plan: slow }).plan, atCastRank({ name: "Slow", castRank: 6, plan: slow }).plan, "one copy, kept");
    const bewilder = compileSpell(spellOf(spellRefs().find((ref) => ref.name === "Bewilder")));
    assert.equal(describeSpell(atCastRank({ name: "Bewilder", castRank: 8, plan: bewilder }).plan).targets, 10);
    const party = standardParty(11).map((c) => (c.id === "wizard" ? { ...c, spells: [{ name: "Slow", castRank: 6, pool: null, dc: 30, attack: 20, effects: {}, plan: slow }] } : c));
    const state = createFightState({ combatants: party }, { morale: false, retreat: false }, 1);
    assert.equal(state.byId.get("wizard").spells[0].plan.targeting.target, "10 creatures", "a fight's entries at their rank");
});

test("family 5 defences: Spell Turning, Spell Immunity, Dispelling Globe, Prismatic Shield, Indestructibility, Foresight, Forbidding Ward", async () => {
    const { castSpell, castPlan } = await import("../src/engine/spells.js");
    const { applyDamage, performStrike } = await import("../src/engine/actions.js");
    const { flankableBy } = await import("../src/engine/passives.js");
    const { isActive } = await import("../src/engine/combatant.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank, extra = {}) => ({ name, castRank, pool: null, dc: 40, attack: 30, effects: {}, plan: compileSpell(spellNamed(name)), ...extra });
    const state = createFightState({ combatants: [...standardParty(17), { ...moderateCreatureAt(15, "mage"), id: "mage", name: "Mage" }, { ...moderateCreatureAt(15, "brute"), id: "brute", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const cleric = state.byId.get("cleric");
    const fighter = state.byId.get("fighter");
    const mage = state.byId.get("mage");
    const brute = state.byId.get("brute");
    mage.spells = [entry("Slow", 3, { dc: 20, attack: 5 })];
    wizard.spells = [entry("Spell Turning", 7), entry("Spell Immunity", 4), entry("Indestructibility", 10), entry("Prismatic Shield", 9), entry("Foresight", 9), entry("Forbidding Ward", 6)];
    castSpell(state, wizard, 0, [wizard.id]);
    assert.ok(wizard.defences.some((held) => held.kind === "turning"));
    state.rng.d20 = () => 15;
    castPlan(state, mage, mage.spells[0], [wizard.id], 2);
    assert.ok(state.log.some((line) => /turned back on Mage/.test(line)), "Slow turned back");
    assert.ok(!wizard.defences.some((held) => held.kind === "turning"), "spent");
    castSpell(state, wizard, 1, [cleric.id]);
    assert.equal(cleric.defences.find((held) => held.kind === "immunity")?.named, "Slow", "the foes' spell named");
    castPlan(state, mage, mage.spells[0], [cleric.id], 2);
    assert.ok(!cleric.cond.slowed, "counteracted");
    castSpell(state, wizard, 2, [wizard.id]);
    assert.equal(applyDamage(state, wizard, [{ type: "fire", amount: 50, persistent: false, precision: false }], { source: brute }), 0, "indestructible");
    wizard.defences = wizard.defences.filter((held) => held.kind !== "indestructible");
    castSpell(state, wizard, 3, [wizard.id]);
    const hp = brute.hp.value;
    state.rng.d20 = () => 2;
    state.rng.die = () => 1;
    performStrike(state, brute, wizard, brute.strikes[0]);
    assert.ok(brute.hp.value <= hp - 50, "a red shard: 50 fire");
    castSpell(state, wizard, 4, [fighter.id]);
    assert.equal(flankableBy(fighter, brute), false, "Foresight: not flanked");
    castSpell(state, wizard, 5, [fighter.id]);
    assert.ok(fighter.defences.find((held) => held.kind === "forbidding")?.bonus === 2, "+2 from 6th");
    assert.ok(isActive(brute));
});

test("family 6 battle forms in fights: Animal Form's Strikes and AC, no spells, back at its end; Primal Herd at the creature's own attack; an aspect Shift at the caster's DC", async () => {
    const { castSpell, canCast, spellExpectation } = await import("../src/engine/spells.js");
    const { removeEffect, formStrikes, formAC } = await import("../src/engine/effects.js");
    const { compileSpell, spellNamed, effectModels } = await import("../tools/lib/pack-spells.mjs");
    const { spellRefs, spellOf } = await import("../tools/lib/spell-power.mjs");
    const entry = (doc, castRank) => {
        const plan = compileSpell(doc);
        return { name: doc.name, castRank, pool: null, dc: 30, attack: 20, plan, effects: effectModels(plan, castRank) };
    };
    const state = createFightState({ combatants: [...standardParty(9), { ...moderateCreatureAt(9, "brute"), id: "brute", name: "Brute" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    const own = wizard.strikes;
    const ac = wizard.ac;
    wizard.spells = [entry(spellNamed("Animal Form"), 5), entry(spellNamed("Fireball"), 3)];
    const worth = () => spellExpectation(state, wizard, wizard.spells[0], [wizard], 0, 2).reduce((sum, each) => sum + (each.benefit ?? 0), 0);
    const threat = state.threat.get(wizard.id);
    state.threat.set(wizard.id, 60);
    assert.ok(worth() <= 0, "its spells do more: not worth it");
    state.threat.set(wizard.id, 5);
    assert.ok(worth() > 0, "a caster doing little: worth it");
    state.threat.set(wizard.id, threat);
    castSpell(state, wizard, 0, [wizard.id]);
    assert.ok(wizard.inForm, "in its form");
    assert.notEqual(wizard.strikes, own);
    assert.ok(wizard.strikes.every((strike) => strike.fromForm && strike.unarmed));
    assert.ok(wizard.ac > ac, "the form's AC");
    assert.equal(canCast(wizard, wizard.spells[1]), false, "no spells");
    removeEffect(wizard, wizard.effects.find((effect) => effect.form));
    assert.equal(wizard.strikes, own, "its own Strikes back");
    assert.equal(wizard.ac, ac);
    assert.ok(!wizard.inForm);
    const herd = effectModels(compileSpell(spellNamed("Primal Herd")), 10);
    const form = Object.values(herd).find((model) => model?.battleForm)?.battleForm;
    const fighter = state.byId.get("fighter");
    const tusk = formStrikes(form, fighter).find((strike) => /tusk/i.test(strike.name));
    assert.equal(tusk.bonus, Math.max(...fighter.strikes.map((strike) => strike.bonus)), "the fighter's own best attack");
    const fiend = spellOf(spellRefs().find((ref) => ref.name === "Fiend Shift"));
    const shift = Object.values(effectModels(compileSpell(fiend), 4)).find((model) => model?.battleForms?.length);
    assert.ok(shift.battleForms.length >= 3, "a form per fiend aspect");
    assert.equal(formAC(shift.battleForms[0], 7, 25), 25, "AC: the caster's DC");
    assert.equal(formStrikes(shift.battleForms[0], wizard, 25)[0].bonus, 15, "attack: DC − 10");
});

test("family 7 minions: Duplicate Foe's copy fights for the caster and decays; Subjugate and Bind Undead take control", async () => {
    const { castSpell, duplicateTurnEnd } = await import("../src/engine/spells.js");
    const { isActive } = await import("../src/engine/combatant.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 45, attack: 35, effects: {}, plan: compileSpell(spellNamed(name)) });
    const state = createFightState({ combatants: [...standardParty(15), { ...moderateCreatureAt(15, "giant"), id: "giant", name: "Giant" }, { ...moderateCreatureAt(5, "zombie"), id: "zombie", name: "Zombie", traits: ["undead", "mindless"] }, { ...moderateCreatureAt(5, "ghoul"), id: "ghoul", name: "Ghoul", traits: ["undead"] }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    wizard.spells = [entry("Duplicate Foe", 7), entry("Bind Undead", 6), entry("Subjugate Undead", 3)];
    state.rng.d20 = () => 5;
    castSpell(state, wizard, 0, ["giant"]);
    const copy = state.list.find((c) => c.duplicateBy === wizard.id);
    assert.ok(copy && isActive(copy), "a duplicate");
    assert.equal(copy.side, "party");
    assert.equal(copy.hp.max, 70);
    assert.equal(copy.ac, state.byId.get("giant").ac);
    assert.ok(!copy.halfStrikes, "a failure: full damage");
    state.rng.die = () => 6;
    duplicateTurnEnd(state, copy);
    assert.equal(copy.hp.value, 46, "4d6 lost after its turn");
    castSpell(state, wizard, 1, ["zombie"]);
    assert.equal(state.byId.get("zombie").side, "party", "a mindless undead bound");
    castSpell(state, wizard, 1, ["ghoul"]);
    assert.equal(state.byId.get("ghoul").side, "foes", "not mindless: unaffected");
    castSpell(state, wizard, 2, ["ghoul"]);
    assert.equal(state.byId.get("ghoul").side, "party", "subjugated");
});

test("family 8: Maze of Locked Doors holds a foe out of the fight till it's through its doors; Orb of Twisting Fate takes its first action; Collective Transposition sends it away", async () => {
    const { castSpell, heldTurnStart } = await import("../src/engine/spells.js");
    const { isActive } = await import("../src/engine/combatant.js");
    const { compileSpell, spellNamed } = await import("../tools/lib/pack-spells.mjs");
    const entry = (name, castRank) => ({ name, castRank, pool: null, dc: 45, attack: 35, effects: {}, plan: compileSpell(spellNamed(name)) });
    const state = createFightState({ combatants: [...standardParty(15), { ...moderateCreatureAt(12, "a"), id: "a", name: "A" }, { ...moderateCreatureAt(12, "b"), id: "b", name: "B" }, { ...moderateCreatureAt(12, "c"), id: "c", name: "C" }] }, { morale: false, retreat: false }, 1, { log: true });
    const wizard = state.byId.get("wizard");
    wizard.spells = [entry("Maze of Locked Doors", 7), entry("Orb of Twisting Fate", 7), entry("Collective Transposition", 6)];
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 0, ["a"]);
    const a = state.byId.get("a");
    assert.equal(a.hindrances.find((held) => held.kind === "mazed")?.doors, 3, "a critical failure: 3 doors");
    assert.ok(!isActive(a), "out of the fight");
    a.actionsLeft = 3;
    assert.equal(heldTurnStart(state, a), true, "its turn at the doors");
    state.rng.d20 = () => 20;
    a.actionsLeft = 3;
    heldTurnStart(state, a);
    assert.ok(isActive(a), "through its doors");
    state.rng.d20 = () => 2;
    castSpell(state, wizard, 1, ["b"]);
    const b = state.byId.get("b");
    b.actionsLeft = 3;
    heldTurnStart(state, b);
    assert.equal(b.actionsLeft, 2, "its first action lost");
    const c = state.byId.get("c");
    const { engage, sameMelee } = await import("../src/engine/space.js");
    engage(state, c, state.byId.get("fighter"));
    assert.ok(sameMelee(c, state.byId.get("fighter")));
    castSpell(state, wizard, 2, ["c"]);
    assert.ok(!sameMelee(c, state.byId.get("fighter")), "teleported away from the fighter");
});
