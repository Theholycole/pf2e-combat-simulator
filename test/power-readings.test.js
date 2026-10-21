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

test("a family with no reading of its own: the plan its payload carries, cast at its best targets", () => {
    const inner = { modelVersion: 13, source: { name: "Inner" }, rank: 3, traits: [], activation: { time: "2" }, targeting: { target: null, range: "60 feet", area: { type: "burst", value: 20 } }, trigger: { event: "use" },
        resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "spell" } }, sharedDamage: { components: [{ id: "c0", formula: "6d6", type: "acid", kinds: ["damage"] }] }, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0 } }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["c0"] } }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["c0"] } }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["c0"] } } } } };
    const odd = plan("some-new-kind", { somethingNew: { savePlan: inner, notes: ["…"] } });
    assert.ok(powerReading(odd), "read through the plan it carries");
    const found = readingPower(standardParty(5), powerFoes("group", 5), entry(3, odd));
    assert.ok(found && found.share > 0 && found.targets >= 3);
    assert.equal(powerReading(plan("some-new-kind", { somethingNew: { notes: [] } })), null);
});

test("healing, temporary Hit Points and AC from text: Hit Points to the most hurt, an AC bonus as the Strikes it keeps off", async () => {
    const { textHelpShare } = await import("../src/engine/spell-power.js");
    const party = standardParty(5);
    const one = textHelpShare(party, powerFoes("boss", 5), { heal: 20, targets: 1, rounds: 1 });
    const all = textHelpShare(party, powerFoes("boss", 5), { heal: 20, targets: Infinity, rounds: 1 });
    assert.ok(one && all && Math.abs(all.share - 4 * one.share) < 1e-9);
    const ac = textHelpShare(party, powerFoes("boss", 5), { ac: 1, targets: Infinity, rounds: 3 });
    assert.ok(ac.share > textHelpShare(party, powerFoes("boss", 5), { ac: 1, targets: Infinity, rounds: 1 }).share);
    assert.equal(textHelpShare(party, powerFoes("boss", 5), { targets: 1 }), null);
});

test("one-offs: a mark's weakness and off-guard on a foe; a tree's Hit Points in an ally's place; Circle of Protection only against holy or unholy foes", () => {
    const mark = readingPower(standardParty(1), powerFoes("boss", 1), entry(1, plan("spell-mark", { spellMark: { strikeWeakness: { base: 1, perRank: 1 }, durationSeconds: 60 } }, null)));
    assert.ok(mark && mark.share > 0);
    const tree = readingPower(standardParty(1), powerFoes("boss", 1), entry(1, plan("strike-absorber", { strikeAbsorber: { ac: 10, hp: 10, step: { interval: 1, hp: 10 }, durationSeconds: 60 } }, null)));
    assert.ok(tree && tree.share > 0);
    const circle = plan("protection-circle", { protectionCircle: { radius: 10, seconds: 60, low: 1, high: 3 } }, null);
    assert.equal(readingPower(standardParty(5), powerFoes("group", 5), entry(3, circle)), null, "plain foes: nothing");
    assert.ok(readingPower(standardParty(5), powerFoes("group", 5, "fiend"), entry(3, circle)).share > 0, "against fiends");
});

test("Strike spells at their best: the party's best Strike — two against two foes, off-guard where it can be, a shield raised first", () => {
    const strike = (spec) => entry(1, plan("spell-strike", { spellStrike: { range: "melee", count: 1, ...spec } }, null));
    const one = readingPower(standardParty(1), powerFoes("group", 1), strike({}));
    const two = readingPower(standardParty(1), powerFoes("group", 1), strike({ count: 2, differentTargets: true }));
    assert.ok(one && two && one.targets === 1 && two.targets === 2 && two.share > one.share, `${one?.share} ${two?.share}`);
    assert.equal(readingPower(standardParty(1), powerFoes("boss", 1), strike({ count: 2, differentTargets: true })).targets, 1, "one foe: one Strike");
    const boss = readingPower(standardParty(1), powerFoes("boss", 1), strike({})).share;
    assert.ok(readingPower(standardParty(1), powerFoes("boss", 1), strike({ offGuardQuestion: { question: "?" } })).share > boss, "a group's foes go down to one hit anyway: the boss");
    assert.ok(readingPower(standardParty(1), powerFoes("group", 1), strike({ preAction: "raise-a-shield" })).share > one.share, "the shield's AC");
    const grabbing = strike({ unarmed: true, hitConditions: [{ slug: "grabbed", minutes: 1, escapeEnds: true }] });
    assert.ok(readingPower(standardParty(1), powerFoes("group", 1), grabbing).share > readingPower(standardParty(1), powerFoes("group", 1), strike({ unarmed: true })).share);
});

test("a Strike's effects: their bonuses on it (a flurry's two Strikes), and on the caster's Strikes after it while they last", () => {
    const effects = (spec, models) => ({ ...entry(1, plan("strike-effects", spec, null)), effects: models });
    const bare = { strike: { rules: ["Make an unarmed Strike or Flurry of Blows."] }, applications: [] };
    const before = { ...bare, applications: [{ kind: "native-spell-effect", uuid: "now", phase: "before" }] };
    const after = { strike: { rules: ["Make a melee Strike."] }, applications: [{ kind: "native-spell-effect", uuid: "later", phase: "after" }] };
    const plain = readingPower(standardParty(1), powerFoes("boss", 1), effects(bare, {}));
    const added = readingPower(standardParty(1), powerFoes("boss", 1), effects(before, { now: { rounds: 1, modifiers: [{ on: "attack", type: "status", value: 1 }, { on: "damage", type: "dice", value: 4 }] } }));
    assert.ok(plain && added && added.share > plain.share);
    const lasting = (rounds) => readingPower(standardParty(1), powerFoes("boss", 1), effects(after, { later: { rounds, modifiers: [], conditional: [{ on: "damage", type: "untyped", value: 2, predicate: ["item:melee"] }] } })).share;
    assert.ok(lasting(10) > lasting(1), "the rest of the fight's Strikes");
});

test("thralls out at their best: Thrall Charge's Strike more as it heightens; Conglomerate of Limbs' Strikes and Hit Points; Blossoming Gore more in a choke point", () => {
    const charge = plan("thrall-strike", { thrallStrike: { dieSize: "d6", ranks: [{ rank: 1, dice: 1 }, { rank: 2, dice: 2 }, { rank: 6, dice: 3 }, { rank: 10, dice: 4 }], destroyBonus: "rank", range: 30 } }, null);
    const low = readingPower(standardParty(11), powerFoes("boss", 11), entry(1, charge));
    const high = readingPower(standardParty(11), powerFoes("boss", 11), entry(6, charge));
    assert.ok(low && high && high.share > low.share);
    const giant = plan("giant-thrall", { giantThrall: { seconds: 60, hp: 40, hpStep: { every: 1, add: 10 }, baseRank: 4, thrall: { strike: { die: 6, types: ["bludgeoning"], firstStepLevel: 5, every: 4 } } } }, null);
    assert.ok(readingPower(standardParty(7), powerFoes("group", 7), entry(4, giant)).share > 0);
    const gore = plan("gore-field", { goreField: { seconds: 60, radius: 20, bleed: { amount: 10, type: "bleed", step: 2 }, statistic: "fortitude", rows: { success: { value: 1 }, failure: { value: 1 }, criticalFailure: { value: 2 } } } }, null);
    const open = readingPower(standardParty(9), powerFoes("group", 9), entry(5, gore));
    const choke = readingPower(standardParty(9), powerFoes("group", 9), entry(5, gore), { choke: true });
    assert.ok(open && choke && choke.share > open.share && open.share > 0, "bleed counted each round");
});

test("a conjured weapon: worth its runes over the party's own — a striking rune at 3rd level, only the wizard's staff where the party has one", () => {
    const armory = plan("conjured-weapons", { conjuredWeapons: { damageType: "fire", durationSeconds: 300, runes: [{ minRank: 2, potency: 1, striking: 1, property: [] }], targets: [{ minRank: 2, limit: 1 }] } }, null);
    const early = readingPower(standardParty(3), powerFoes("boss", 3), entry(2, armory));
    const later = readingPower(standardParty(5), powerFoes("boss", 5), entry(2, armory));
    assert.ok(early && later && early.share > 3 * later.share, `${early?.share} ${later?.share}`);
});

test("rules on the caster: concealment keeps a fifth of the foes' hits off it; Strikes made holy hurt foes weak to holy, the best of its choices", () => {
    const scarves = plan("rule-set", { ruleSet: { recipient: "self", seconds: 60, rules: [{ key: "GrantItem", uuid: "Compendium.pf2e.conditionitems.Item.DmAIPqOBomZ7H95W" }] } }, null);
    assert.ok(readingPower(standardParty(5), powerFoes("boss", 5), entry(3, scarves)).share > 0);
    const planes = plan("rule-set", { ruleSet: { recipient: "self", seconds: 60, rules: [], choice: { options: [{ key: "none", rules: [] }, { key: "heaven", rules: [{ key: "AdjustStrike", mode: "add", property: "traits", value: "holy" }] }] } } }, null);
    assert.equal(readingPower(standardParty(7), powerFoes("group", 7), entry(4, planes)), null, "plain foes: no weakness");
    assert.ok(readingPower(standardParty(7), powerFoes("group", 7, "fiend"), entry(4, planes)).share > 0, "fiends weak to holy");
});

test("an incarnate spell's phases with no plan, by their kind: the word of death after the touch, a fumarole's colors, a cage, a day's rest", () => {
    const incarnate = (phases, extra = {}) => plan("incarnate", { incarnate: { phases, ...extra } }, null);
    const touch = incarnate([{ key: "mark", kind: "death-mark" }, { key: "word", kind: "word", statistic: "fortitude", success: { slug: "stunned", value: 1, perRank: 5 }, failure: { slug: "stunned", value: 3, perRank: 10 } }]);
    const strikeOnly = incarnate([{ key: "mark", kind: "death-mark" }]);
    const word = readingPower(standardParty(15), powerFoes("boss", 15), entry(8, touch));
    assert.ok(word && word.share > readingPower(standardParty(15), powerFoes("boss", 15), entry(8, strikeOnly)).share, "the word adds to the Strike");
    const fumarole = incarnate([{ key: "fumarole", kind: "fumarole", die: 8, statistic: "reflex", area: { type: "cylinder", value: 20 }, seconds: 60, colors: { 1: { formula: "50[fire]" }, 2: { formula: "30[fire]", effect: { conditions: [{ slug: "slowed", value: 1 }], rounds: 10 } } } }]);
    const open = readingPower(standardParty(15), powerFoes("group", 15), entry(8, fumarole));
    const choke = readingPower(standardParty(15), powerFoes("group", 15), entry(8, fumarole), { choke: true });
    assert.ok(open && choke && open.targets === 4 && choke.share > open.share);
    const cage = incarnate([{ key: "trap", kind: "save" }], { conjure: { object: true, ac: 10, hp: 40, resistances: [{ type: "all-damage", value: 20 }], durationSeconds: 60 } });
    assert.ok(readingPower(standardParty(13), powerFoes("group", 13), entry(7, cage)).share > 0, "foes shut in");
    const rest = readingPower(standardParty(15), powerFoes("boss", 15), entry(8, incarnate([{ key: "renewal", kind: "renewal", count: 6 }])));
    assert.ok(rest && rest.targets === 4 && rest.share > 0);
});

test("castable as read: an action count's area sized from the text, and the count its data casts it with (Spiritual Torrent)", () => {
    const torrent = { ...plan("save", { check: { statistic: "fortitude", basic: true }, sharedDamage: { components: [{ id: "c0", formula: "10d6", type: "fire", kinds: ["damage"] }] }, native: { byActions: { 3: { targeting: { area: { areaType: "cone" } } } } } }, null), activation: { time: "2" } };
    const doc = { system: { time: { value: "2" }, area: { type: "line", value: 60 }, description: { value: "<p><strong>2</strong> The spell targets all creatures in a 60-foot line.</p><p><strong>3</strong> The spell targets all creatures in a 60-foot cone.</p>" } } };
    const read = castableReading(torrent, doc, 5);
    assert.deepEqual(read.resolution.native.byActions[3].targeting.area, { areaType: "cone", type: "cone", value: 60 });
    assert.deepEqual(read.resolution.native.byActions[2].targeting.area, { type: "line", value: 60 });
});

test("Repulsion's save as the foes come: those that fail can't come closer, the rest through difficult terrain; Reaper's Lantern only on undead", () => {
    const repulsion = plan("lantern-aura", { lanternAura: { radius: 40, durationSeconds: 60, statistic: "will", rows: { success: { conditions: [], notes: ["The creature treats each square in the area as difficult terrain when moving closer to you."] }, failure: { conditions: [], notes: ["The creature can't move closer to you within the area."] } } } }, null);
    const found = readingPower(standardParty(11), powerFoes("group", 11), entry(6, repulsion));
    assert.ok(found && found.targets === 4 && found.share > 0.2, `${found?.share}`);
    const lantern = plan("lantern-aura", { lanternAura: { radius: 5, durationSeconds: 60, statistic: "fortitude", failed: { living: { halfHealing: true }, undead: { condition: "enfeebled", value: 1 } } } }, null);
    assert.equal(readingPower(standardParty(3), powerFoes("group", 3), entry(2, lantern)), null, "living foes: healing halved, not counted");
    assert.ok(readingPower(standardParty(3), powerFoes("group", 3, "undead"), entry(2, lantern)).share > 0);
});

test("retaliation: Echoing Weapon's damage for each of the best Striker's hits; Incendiary Aura's burning from the turn after it's cast", () => {
    const echo = plan("retaliation", { retaliation: { durationSeconds: 60, triggers: [{ trigger: "The wielder's turn ends", damage: { byCount: ["(ceil(@item.rank/2))", "(ceil(@item.rank/2)*2)"], type: "sonic" } }] } }, null);
    assert.ok(readingPower(standardParty(1), powerFoes("boss", 1), entry(1, echo)).share > 0);
    const aura = plan("retaliation", { retaliation: { durationSeconds: 60, triggers: [{ trigger: "A creature within the emanation takes fire damage.", damage: { formula: "(ceil(@item.level/2)+1)d4", type: "fire", persistent: true } }] } }, null);
    assert.ok(readingPower(standardParty(9), powerFoes("group", 9), entry(5, aura)).targets >= 2);
});

test("healing as it lasts and the party's Strikes made better: Garden of Healing's pulses, Rallying Banner's bonus, Shepherd of Souls' sacrifice", () => {
    const garden = plan("healing-pulse", { healingPulse: { formula: "1d4", heightening: { interval: 1, dice: "1d4" }, area: { type: "emanation", value: 10 }, durationSeconds: 60 } }, null);
    const low = readingPower(standardParty(5), powerFoes("boss", 5), entry(1, garden));
    const high = readingPower(standardParty(5), powerFoes("boss", 5), entry(3, garden));
    assert.ok(low && high && high.share > low.share, "a die more each rank");
    const banner = plan("rally-banner", { rallyBanner: { durationSeconds: 60, member: { rules: [{ key: "FlatModifier", selector: "attack-roll", type: "status", value: 1 }] } } }, null);
    assert.ok(readingPower(standardParty(9), powerFoes("boss", 9), entry(5, banner)).share > 0);
    const shepherd = plan("sacrifice-heal", { sacrificeHeal: { max: 15, multiplier: 2, step: { interval: 2, add: 5 } } }, null);
    assert.ok(readingPower(standardParty(9), powerFoes("boss", 9), entry(5, shepherd)).share > 0);
});

test("the foes' better answer: Horde of Underlings left be or cut down, Albatross Curse kept or killed; Death's Call only among a group", () => {
    const horde = plan("minion-horde", { minionHorde: { count: 6, step: { interval: 1, count: 2 }, types: ["bludgeoning", "slashing"], formula: "1d4", seconds: 60 } }, null);
    const boss = readingPower(standardParty(5), powerFoes("boss", 5), entry(3, horde));
    const many = readingPower(standardParty(5), powerFoes("boss", 5), entry(5, horde));
    assert.ok(boss && many && boss.share > 0 && many.share > boss.share && many.share < 1, `${boss?.share} ${many?.share}`);
    const curse = plan("deferred-save", { deferredSave: { statistic: "will", rows: { success: { condition: { slug: "stupefied", value: 1 } } } } }, null);
    assert.ok(readingPower(standardParty(3), powerFoes("boss", 3), entry(2, curse)).share > 0);
    const call = plan("temp-hp", { tempHp: { doubleIfUndead: true } }, null);
    assert.equal(readingPower(standardParty(1), powerFoes("boss", 1), entry(1, call)), null, "a boss's fall ends the fight");
    assert.ok(readingPower(standardParty(1), powerFoes("group", 1), entry(1, call)).share > 0);
});

test("a boast, a challenge, a ward on a Strike: Demoralize and the penalty it brings, the challenged foe worse at others, AC by the Strike's degree", () => {
    const boast = plan("boast", { boast: { radius: 30, seconds: 60, penalty: { value: 1 }, step: { rank: 8, value: 2 } } }, null);
    assert.ok(readingPower(standardParty(9), powerFoes("group", 9), entry(5, boast)).share > 0);
    const challenge = plan("challenge", { challenge: { value: 1, step: { interval: 3, add: 1 }, statistic: "will", seconds: 60 } }, null);
    assert.ok(readingPower(standardParty(7), powerFoes("boss", 7), entry(4, challenge)).share > 0);
    const ward = plan("strike-ward", { strikeWard: {} }, null);
    const found = readingPower(standardParty(5), powerFoes("boss", 5), entry(3, ward));
    assert.ok(found && found.targets === 2);
});

test("a mark's extra dice on the next hit, again each turn where it says; Ravening Maw only among a group; Bottle the Storm kept and flung back", () => {
    const doc = { system: { description: { value: "<p>If you succeed, the next time you deal piercing or slashing damage to the target with a Strike or spell, you deal 4d6 additional precision damage.</p><p>Heightened (+1) The precision damage increases by 1d6.</p>" } } };
    const mark = (repeat) => ({ ...entry(3, plan("check-mark", { checkMark: { statistic: "recall-knowledge", skill: "medicine", against: "level-dc", ...(repeat ? { repeat: "once-per-later-turn" } : {}) } }, null)), doc });
    const once = readingPower(standardParty(5), powerFoes("boss", 5), mark(false));
    const again = readingPower(standardParty(5), powerFoes("boss", 5), mark(true));
    assert.ok(once && again && again.share > once.share);
    const maw = plan("cannibal-hunger", { cannibalHunger: { statistic: "will", seconds: 18, baseRank: 5, ally: { dice: 5, die: 8, step: 1 }, starve: { dice: 5, die: 4, type: "mental", step: 1 } } }, null);
    assert.equal(readingPower(standardParty(9), powerFoes("boss", 9), entry(5, maw)), null, "no other foe to fall");
    const storm = plan("stored-charge", { storedCharge: { type: "electricity", resistance: { base: 10, fixed: [{ rank: 7, value: 15 }] } } }, null);
    assert.equal(readingPower(standardParty(7), powerFoes("boss", 7), entry(4, storm)).targets, 2);
});

test("a mantle's options from its text, and the best pair of them for a battle caster", async () => {
    const { mantleOptions } = await import("../src/engine/power-readings.js");
    const text = "<p>Pick two.</p><p><strong>Big Form</strong> You're Clumsy 1. You gain a +2 status bonus to melee damage.</p><p><strong>Lava Hands</strong> You gain a lava fist unarmed attack in the brawling weapon group. Your lava fists deal 1d8 bludgeoning damage as their base damage, plus an additional 2d6 fire damage and 1d6 persistent fire damage.</p><p><strong>Green Life</strong> You gain fast healing 3.</p><p><strong>Calm</strong> Nothing in a fight.</p>";
    const options = mantleOptions(text, ["Big Form", "Lava Hands", "Green Life", "Calm"]);
    assert.deepEqual(options.map((option) => option.label), ["Big Form", "Lava Hands", "Green Life", "Calm"]);
    assert.equal(options[0].meleeDamage, 2);
    assert.deepEqual(options[1].strike.extra, ["2d6[fire]"]);
    assert.equal(options[2].fastHealing, 3);
    const mantle = { ...entry(5, plan("option-mantle", { optionMantle: { seconds: 60, options: options.map((option) => ({ label: option.label })) } }, null)), doc: { system: { description: { value: text } } } };
    const found = readingPower(standardParty(9), powerFoes("boss", 9), mantle);
    assert.ok(found && found.share > 0);
});
