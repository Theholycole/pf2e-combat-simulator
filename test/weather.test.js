import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { sightDC } from "../src/engine/environment.js";
import { isOffGuard, strikeUsable } from "../src/engine/combatant.js";
import { weatherTurnStart } from "../src/engine/weather.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { standardParty } from "../src/engine/party.js";

// GM Core's environment in a fight (2026-10-25, weather.js): the resolution core's rules, the live module's toggles as fight options.

const foe = (level = 3, extra = {}) => ({ ...moderateCreatureAt(level, "monster", "Brute"), side: "foes", ...extra });
const fight = (environment, combatants = [...standardParty(3), foe()], seed = 1) => createFightState({ combatants, setup: { environment } }, { morale: false, retreat: false }, seed);

test("sight: thick fog conceals past 10 feet — a far target, not one in its Melee; murky water hides past 10 feet", () => {
    const state = fight({ levels: { fog: { level: "thick" } } });
    const [fighter] = state.list;
    const brute = state.byId.get("monster");
    brute.band = "far";
    assert.equal(sightDC(state, fighter, brute), 5);
    Object.assign(brute, { band: "engaged", meleeId: "m1" });
    fighter.meleeId = "m1";
    fighter.band = "engaged";
    assert.equal(sightDC(state, fighter, brute), 0, "5 feet away: seen");
    const murky = fight({ levels: { underwater: { level: "murky" } } });
    const far = murky.byId.get("monster");
    far.band = "far";
    assert.equal(sightDC(murky, murky.list[0], far), 11);
    assert.equal(sightDC(fight({}), fight({}).list[0], brute), 0, "no weather, no flat check");
});

test("wind: −2 to physical ranged Strikes in a strong wind, none at all in a windstorm", () => {
    const archer = (state) => state.list.find((c) => (c.strikes ?? []).some((strike) => !strike.melee));
    const calm = fight({});
    const before = archer(calm).strikes.find((strike) => !strike.melee);
    const strong = archer(fight({ levels: { wind: { level: "strong" } } })).strikes.find((strike) => !strike.melee && strike.name === before.name);
    assert.equal(strong.bonus, before.bonus - 2);
    const storm = archer(fight({ levels: { wind: { level: "windstorm" } } }));
    const blocked = storm.strikes.find((strike) => !strike.melee && strike.name === before.name);
    assert.equal(strikeUsable(storm, blocked), false);
    assert.ok(storm.strikes.filter((strike) => strike.melee).every((strike) => !strike.weatherBlocked));
});

test("a heavy sandstorm: slashing as each turn starts, and breath held", () => {
    const state = fight({ levels: { sandstorm: { level: "heavy" } } });
    const c = state.list[0];
    assert.ok(Number.isFinite(c.air), "holds its breath");
    const before = c.hp.value;
    weatherTurnStart(state, c, { applyDamage: (s, target, instances) => { const amount = instances.reduce((sum, i) => sum + i.amount, 0); target.hp.value -= amount; return amount; }, applyCondition: () => {} });
    assert.ok(c.hp.value < before);
    assert.equal(fight({ levels: { sandstorm: { level: "heavy", harm: "damage" } } }).list[0].air, undefined);
});

test("under water by the weather, in the bands: the water's rules — off-guard without a swim Speed", () => {
    const state = fight({ levels: { underwater: { level: "clear" } } });
    const c = state.list[0];
    assert.equal(c.inWater, true);
    assert.equal(isOffGuard(c), true);
    assert.ok(Number.isFinite(c.air));
});

test("ground: ice is uneven — off-guard on it, and a failed Balance leaves no Stride that turn", () => {
    const state = fight({ ground: { key: "ice", dc: 40 } });
    const c = state.list[0];
    assert.equal(isOffGuard(c), true);
    const speed = c.speed;
    weatherTurnStart(state, c, { applyDamage: () => 0, applyCondition: () => {} });
    assert.equal(c.speed, 0, "DC 40: it fails");
    assert.equal(c.weatherSpeeds.speed, speed);
});

test("a disaster as an escalation: an avalanche at round 2 buries those it catches; incredible cold bites each minute", () => {
    const party = standardParty(3);
    const escalations = { rules: [{ when: { kind: "round", round: 2 }, then: { kind: "disaster", key: "avalanche", options: { category: "major", dc: 40 }, targets: "foes" } }] };
    const result = simulate({ combatants: [...party, foe(3, { hp: { value: 500, max: 500, temp: 0 } })], setup: { escalations } }, { morale: false, retreat: false, maxRounds: 3 }, 2, { log: true });
    const text = result.log.join("\n");
    assert.match(text, /Avalanche, landslide or mudslide: \d+ bludgeoning/);
    assert.match(text, /Brute is buried/);
    const cold = simulate({ combatants: [...party, foe(3, { hp: { value: 2000, max: 2000, temp: 0 } })], setup: { environment: { levels: { temperature: "incredible-cold" } } } }, { morale: false, retreat: false, maxRounds: 10 }, 3, { log: true });
    assert.match(cold.log.join("\n"), /Incredible cold: .* takes \d+ cold/);
});
