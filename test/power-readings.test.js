import test from "node:test";
import assert from "node:assert/strict";

import { ROUND_WEIGHT, approach, approachLoss, castableReading, powerReading } from "../src/engine/power-readings.js";
import { RATED_POOL, powerFoes, readingPower } from "../src/engine/spell-power.js";
import { standardParty } from "../src/engine/party.js";

// The spell ratings' readings of spells the engine can't cast in a fight (2026-10-21, the user: "Work through the cant cast spells. I know
// based on personal experience that Web is a surprisingly strong spell").

const foe = { speed: 25, reach: 5 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`);

test("a foe 30 feet off: a Stride, then its Strikes (the third at half) — over three turns", () => {
    assert.equal(ROUND_WEIGHT, 2.5);
    close(approach(foe, null, 3).weight, 2 + 2.5 + 2.5);
    close(approach(foe, null, 1).weight, 2);
    close(approach({ speed: 25, reach: 10 }, null, 1).weight, 2, "20 feet at reach 10: still a Stride");
});

test("difficult terrain on its way costs it a Stride; leftover Speed goes on past it", () => {
    // 10 feet inside (20 to cross) and 15 outside: 35 feet of 25 a Stride — two Strides, one Strike the first turn.
    close(approach(foe, { inside: 10, difficult: true }, 3).weight, 1 + 2.5 + 2.5);
    close(approachLoss(foe, { inside: 10, difficult: true }, 3).worth, 1 / 2.5);
    // 5 feet inside: 10 + 20 = 30 — still two Strides.
    close(approach(foe, { inside: 5, difficult: true }, 1).weight, 1);
});

test("Web's checks: a critical failure holds it all turn, a failure slows it 10 feet; a success only the terrain", () => {
    const always = (index) => [0, 1, 2, 3].map((each) => (each === index ? 1 : 0));
    close(approach(foe, { inside: 10, difficult: true, check: always(2) }, 3).weight, approach(foe, { inside: 10, difficult: true }, 3).weight);
    close(approach(foe, { inside: 10, difficult: true, check: always(0) }, 3).weight, 0);
    const failing = approach(foe, { inside: 10, difficult: true, check: always(1) }, 3).weight;
    assert.ok(failing < approach(foe, { inside: 10, difficult: true }, 3).weight && failing > 0, `${failing}`);
    const odds = [0.1, 0.4, 0.4, 0.1];
    assert.ok(approachLoss(foe, { inside: 10, difficult: true, check: odds }, 3).worth > approachLoss(foe, { inside: 10, difficult: true }, 3).worth);
});

test("a held foe Escapes before it moves; damage for each square moved through a hazard", () => {
    close(approach(foe, { inside: 20, held: { start: 1, escape: [0, 0, 1, 0] } }, 1).weight, 1, "Escape, Stride, Strike");
    close(approach(foe, { inside: 20, held: { start: 1, escape: [1, 0, 0, 0] } }, 3).weight, 0);
    close(approach(foe, { inside: 10, hurt: 2 }, 1).damage, 4, "two squares, 2 each");
    close(approach(foe, { inside: 10, difficult: true, hurt: 2 }, 1).damage, 4, "two squares in difficult terrain too");
});

const plan = (kind, payload, area = { type: "burst", value: 10 }) => ({ modelVersion: 13, source: { name: "Test" }, rank: 2, traits: [], activation: { time: "3" }, targeting: { target: null, range: "120 feet", area }, trigger: { event: "use" }, lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } }, resolution: { kind, ...payload } });
const entry = (rank, thePlan) => ({ name: "Test", castRank: rank, dc: 10 + 2 * rank + 13, attack: 2 * rank + 13, pool: RATED_POOL, tradition: "arcane", effects: {}, plan: thePlan });

test("Web read for the rating: every foe it holds slowed on its way; bigger when heightened", () => {
    const web = plan("web-area", { webArea: { area: [{ minRank: 2, feet: 10 }, { minRank: 4, feet: 20 }], durationSeconds: 60, skill: "athletics", statistic: "reflex" } });
    assert.ok(powerReading(web));
    const group = readingPower(standardParty(3), powerFoes("group", 3), entry(2, web));
    const boss = readingPower(standardParty(3), powerFoes("boss", 3), entry(2, web));
    assert.ok(group && boss && group.targets === 4 && boss.targets === 1);
    assert.ok(group.share > 0.1 && boss.share > 0.05, `${group.share} ${boss.share}`);
    const wide = readingPower(standardParty(7), powerFoes("group", 7), entry(4, web));
    assert.ok(wide.share > group.share, "a 20-foot web at the 4th rank");
});

test("a hazard: damage for the squares crossed; a cloud over the party conceals it as the foes come", () => {
    const spikes = plan("hazard-area", { hazardArea: { area: { type: "burst", value: 20 }, durationSeconds: 3600, terrain: true, baseRank: 4, control: { kind: "per-square", flat: 3, type: "piercing", step: { interval: 1, flat: 1 } } } }, { type: "burst", value: 20 });
    const hurt = readingPower(standardParty(7), powerFoes("group", 7), entry(4, spikes));
    const plain = readingPower(standardParty(7), powerFoes("group", 7), entry(4, plan("terrain-area", { terrainArea: { radius: 20, durationSeconds: 60 } }, { type: "burst", value: 20 })));
    assert.ok(hurt && plain && hurt.share > plain.share, "spikes besides the terrain");
    const mist = readingPower(standardParty(3), powerFoes("boss", 3), entry(2, plan("concealing-area", { concealingArea: { area: { type: "burst", value: 20 }, durationSeconds: 60 } }, { type: "burst", value: 20 })));
    assert.ok(mist && mist.share > 0 && mist.targets === 4);
    assert.equal(powerReading(plan("unknown-kind", {})), null);
});

test("castable as written another way: a reaction on its trigger as an action, an ally's words, an area from the data, an effect note's effect", () => {
    const base = (target, kind = "save", extra = {}) => ({ modelVersion: 13, source: { name: "Test" }, rank: 1, traits: [], activation: { time: "reaction" }, targeting: { target, range: "30 feet", area: null }, trigger: { event: "use" }, resolution: { kind, ...extra } });
    const doc = (time, extra = {}) => ({ system: { time: { value: time }, description: { value: "" }, ...extra } });
    const trigger = castableReading(base("the triggering creature"), doc("reaction"));
    assert.deepEqual([trigger.targeting.target, trigger.activation.time], ["1 creature", "1"]);
    assert.equal(castableReading(base("the triggering ally"), doc("reaction")).targeting.target, "1 willing creature");
    assert.equal(castableReading(base("you and up to 9 allies", "effect"), doc("2")).targeting.target, "up to 9 willing creatures");
    assert.deepEqual(castableReading(base("", "save"), doc("2", { area: { type: "cone", value: 15 } })).targeting.area, { type: "cone", value: 15 });
    assert.deepEqual(castableReading(base("", "save"), { system: { time: { value: "2" }, description: { value: "<p>@Template[burst|distance:10]</p>" } } }).targeting.area, { type: "burst", value: 10 });
    assert.equal(castableReading(base("", "save"), doc("1 or 2")).activation.time, "2");
    assert.equal(castableReading(base("1 creature"), doc("10 minutes")), null, "cast in minutes: not in a fight");
    assert.equal(castableReading(base("1 magic item", "affliction-care"), doc("2")), null, "not a creature");
    const note = castableReading(base("1 willing creature", "effect-note", { effectNote: { recipient: "target", effect: { uuid: "Compendium.pf2e.spell-effects.Item.x", label: "Spell Effect: X" } } }), doc("2"));
    assert.deepEqual(note.resolution, { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: "Compendium.pf2e.spell-effects.Item.x", label: "Spell Effect: X", recipients: "target" }] });
});

test("in a choke point (the foes coming down a corridor): every foe crosses Web end to end; a wall stops them all; a cloud stays in their way", async () => {
    const { castRepeats, wallShare } = await import("../src/engine/spell-power.js");
    const web = plan("web-area", { webArea: { area: [{ minRank: 2, feet: 10 }], durationSeconds: 60, skill: "athletics", statistic: "reflex" } });
    const open = readingPower(standardParty(3), powerFoes("group", 3), entry(2, web));
    const choke = readingPower(standardParty(3), powerFoes("group", 3), entry(2, web), { choke: true });
    assert.ok(choke.share > open.share, `${choke.share} vs ${open.share}`);
    const cloud = { resolution: { lingering: { events: ["turn-start"], durationSeconds: 60 } } };
    assert.deepEqual([castRepeats(cloud), castRepeats(cloud, 3, { choke: true })], [1, 2]);
    const stone = { name: "Test Wall", castRank: 5, dc: 27, attack: 19, pool: RATED_POOL, tradition: "arcane", effects: {}, plan: { resolution: { kind: "spell-note" }, lifecycle: { durationSpec: { mode: "instantaneous" } } } };
    const party = standardParty(9);
    assert.ok(wallShare(party, powerFoes("boss", 9), stone, "barrier", { choke: true }).share > wallShare(party, powerFoes("boss", 9), stone, "barrier").share);
});

test("an incarnate spell: its phases added up, the best of its options; phases a die picks among weighted by their faces", () => {
    const save = (statistic, formula) => ({ modelVersion: 13, source: { name: "Phase" }, rank: 5, traits: [], activation: { time: "3" }, targeting: { target: null, range: "120 feet", area: { type: "burst", value: 20 } }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic, basic: true, against: { dc: "spell" } }, sharedDamage: { components: [{ id: "c0", formula, type: "fire", kinds: ["damage"] }] }, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0 } }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["c0"] } }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["c0"] } }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["c0"] } } } } });
    const incarnate = (payload) => entry(5, plan("incarnate", { incarnate: payload }, { type: "burst", value: 20 }));
    const party = standardParty(9);
    const one = readingPower(party, powerFoes("group", 9), incarnate({ phases: [{ key: "arrive", plan: save("reflex", "6d6") }] }));
    const two = readingPower(party, powerFoes("group", 9), incarnate({ phases: [{ key: "arrive", plan: save("reflex", "6d6") }, { key: "depart", plan: save("reflex", "6d6") }] }));
    assert.ok(one && two && two.share > one.share * 1.5, "arrival and departure");
    const options = readingPower(party, powerFoes("group", 9), incarnate({ phases: [], options: { choices: [{ phases: [{ key: "a", plan: save("reflex", "2d6") }] }, { phases: [{ key: "b", plan: save("reflex", "6d6") }] }] } }));
    assert.ok(Math.abs(options.share - one.share) < 1e-9, "the better option");
    const rolled = readingPower(party, powerFoes("group", 9), incarnate({ phases: [{ key: "roll", die: 2, table: { 1: "hot" } }, { key: "hot", hidden: true, plan: save("reflex", "6d6") }] }));
    assert.ok(Math.abs(rolled.share - one.share / 2) < 0.02, `a face in two: half (${rolled.share} vs ${one.share})`);
});

test("a battle form: its bracket for the rank over its overrides; the wizard in it worth its Strikes over its cantrips", async () => {
    const { battleFormAt } = await import("../src/engine/effects.js");
    const { formAC, formShare } = await import("../src/engine/spell-power.js");
    const rule = { key: "BattleForm", overrides: { strikes: { jaws: { damage: { dice: 2, die: "d8", damageType: "piercing" }, traits: ["unarmed"] } }, speeds: { land: 30 } },
        brackets: [{ start: 2, value: { armorClass: { modifier: "16 + @actor.level" }, strikes: { jaws: { damage: { modifier: 1 }, modifier: 9 } }, tempHP: 5 } }, { start: 3, value: { armorClass: { modifier: "17 + @actor.level" }, strikes: { jaws: { damage: { modifier: 5 }, modifier: 14 } }, tempHP: 10 } }] };
    const at2 = battleFormAt(rule, 2);
    assert.deepEqual([at2.strikes[0].bonus, at2.strikes[0].dice, at2.strikes[0].die, at2.strikes[0].damageBonus, at2.tempHp, at2.speed], [9, 2, 8, 1, 5, 30]);
    assert.equal(battleFormAt(rule, 4).strikes[0].bonus, 14, "the highest bracket it reaches");
    assert.equal(formAC(at2, 3), 19);
    const form = formShare(standardParty(5), powerFoes("group", 5), battleFormAt(rule, 3));
    assert.ok(form && form.share > 0);
});

test("Power Words by the target's level: death at the low tier (level 13 foes), 50 damage at the high (a level 17 boss)", () => {
    const kill = plan("level-tiers", { levelTiers: { tiers: [{ min: null, max: 14, outcome: { kind: "death" } }, { min: 15, max: null, outcome: { kind: "damage-or-death", amount: 50 } }], baseRank: 9 } }, null);
    kill.targeting = { target: "1 creature", range: "30 feet", area: null };
    const low = readingPower(standardParty(15), powerFoes("group", 15), entry(9, kill));
    const high = readingPower(standardParty(15), powerFoes("boss", 15), entry(9, kill));
    assert.ok(Math.abs(low.share - 0.25) < 1e-9, "one of four foes gone");
    assert.ok(high.share > 0 && high.share < 0.25, "50 of the boss's Hit Points");
});
