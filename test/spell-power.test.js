import test from "node:test";
import assert from "node:assert/strict";

import { POWER_ROUNDS, RATED_POOL, castPower, castRepeats, durationRounds, partyLevelForRank, partyWithSpell, powerConditions, powerFoes, powerRanks, rankSpells, shareToLevels, shieldShare, spellRatingsOf, summonShare, textDamageShare, wallKind, wallShare } from "../src/engine/spell-power.js";
import { standardParty } from "../src/engine/party.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";

// A spell's power for its rank (2026-10-21, src/engine/spell-power.js): one cast's effect, and the method's parts.

test("the encounters: a boss two levels up, a group of four two down, and foes of a trait", () => {
    assert.equal(partyLevelForRank(3), 5);
    assert.equal(partyLevelForRank(10), 19);
    const boss = powerFoes("boss", 5);
    assert.deepEqual([boss.length, boss[0].level], [1, 7]);
    const group = powerFoes("group", 5);
    assert.deepEqual([group.length, group[0].level, new Set(group.map((foe) => foe.id)).size], [4, 3, 4]);
    assert.equal(powerFoes("group", 1)[0].level, -1);
    const undead = powerFoes("boss", 13, "undead")[0];
    assert.ok(undead.traits.includes("undead") && undead.immunities.includes("death-effects"));
});

test("the wizard keeps its cantrips and basic actions; a spell is one cast more, a cantrip in place of its own", () => {
    const wizard = { id: "wizard", spells: [{ name: "Escape", kind: "basic" }, { name: "Daze", pool: null }, { name: "Fear", pool: "wizard:1:0" }], spellPools: { "wizard:1:0": 1, "cleric:1:0": 1 } };
    const [plain] = partyWithSpell([wizard]);
    assert.deepEqual([plain.spells.map((spell) => spell.name), plain.spellPools], [["Escape", "Daze"], { "cleric:1:0": 1 }]);
    const [armed] = partyWithSpell([wizard], { name: "Fireball", pool: RATED_POOL });
    assert.deepEqual([armed.spells.map((spell) => spell.name), armed.spellPools[RATED_POOL]], [["Escape", "Daze", "Fireball"], 1]);
    const [cantrip] = partyWithSpell([wizard], { name: "Electric Arc", pool: null });
    assert.deepEqual(cantrip.spells.map((spell) => spell.name), ["Escape", "Electric Arc"]);
});

test("heightened ranks from PF2e's data or the text; the traits a spell does more against", () => {
    assert.deepEqual(powerRanks({ system: { level: { value: 3 }, heightening: { type: "interval", interval: 2 } } }), [3, 5, 7, 9]);
    assert.deepEqual(powerRanks({ system: { level: { value: 2 }, heightening: { type: "fixed", levels: { 4: {}, 7: {} } } } }), [2, 4, 7]);
    assert.deepEqual(powerRanks({ system: { level: { value: 1 }, description: { value: "<p><strong>Heightened (3rd)</strong> …</p><p><strong>Heightened (5th)</strong></p>" } } }), [1, 3, 5]);
    assert.deepEqual(powerRanks({ system: { level: { value: 9 } } }), [9]);
    assert.deepEqual(powerConditions({ resolution: { conditionalDamage: [{ trait: "undead", formula: "8d10[vitality]" }] } }), ["undead"]);
    assert.deepEqual(powerConditions({ resolution: { sharedDamage: { components: [{ type: "vitality" }] } }, targeting: { target: "1 willing living creature or 1 undead" } }), ["undead"]);
    assert.deepEqual(powerConditions({ resolution: { conditionalDamage: [{ trait: "unholy" }] } }), ["fiend"]);
    assert.deepEqual(powerConditions({ resolution: { sharedDamage: { components: [{ type: "fire" }] } } }), []);
});

test("a share of a fight in levels: 30% smaller is a level easier; most of it, at least the cap", () => {
    assert.equal(Math.round(shareToLevels(0.3).levels * 100) / 100, 1);
    assert.equal(Math.round(shareToLevels(0.51).levels * 100) / 100, 2);
    assert.deepEqual([shareToLevels(0.97).bound, shareToLevels(0.5).bound], ["atLeast", null]);
});

test("one cast's share of a fight: a burst into the group takes more than into the boss, with no harm to the party", () => {
    const party = standardParty(5);
    const burst = { name: "Test Burst", castRank: 3, dc: 22, attack: 14, pool: RATED_POOL, tradition: "arcane", effects: {},
        plan: { modelVersion: 13, source: { name: "Test Burst", slug: "test-burst" }, rank: 3, traits: ["fire"], activation: { time: "2" }, targeting: { target: null, range: { value: 500 }, area: { type: "burst", value: 20 } }, trigger: { event: "use" },
            resolution: { kind: "save", check: { roll: "save", statistic: "reflex", basic: true, against: { dc: "spell" } }, sharedDamage: { components: [{ id: "c0", formula: "6d6", type: "fire", kinds: ["damage"] }] }, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0 } }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["c0"] } }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["c0"] } }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["c0"] } } } } } };
    const boss = castPower(party, powerFoes("boss", 5), burst);
    const group = castPower(party, powerFoes("group", 5), burst);
    assert.ok(boss && group, "it does something to both");
    assert.equal(boss.targets, 1);
    assert.ok(group.targets >= 3, `the burst catches the group (${group.targets})`);
    assert.ok(group.share > boss.share, `${group.share} > ${boss.share}`);
    assert.ok(group.levels > boss.levels);
});

test("power over the typical spell of its rank; heightened ranks and traits kept apart; a spell that does nothing gets none", () => {
    const row = (id, boss, group, extra = {}) => ({ collection: "pf2e.spells-srd", id, name: id, rank: 3, level: 5, cantrip: false, traits: [], results: { ...(boss === null ? {} : { "boss|": { share: 0, levels: boss } }), ...(group === null ? {} : { "group|": { share: 0, levels: group } }) }, ...extra });
    const rows = [row("a", 1, 1), row("b", 2, 2), row("c", 3, 2), row("d", 1, 2), row("e", 2, 3),
        row("sun", 4, 4, { traits: ["undead"], results: { "boss|": { levels: 4 }, "group|": { levels: 4 }, "boss|undead": { levels: 6 }, "group|undead": { levels: 7 } } }),
        row("sun", 1, 1, { rank: 5, level: 9 }), row("bad", null, null), row("skip", 1, 1, { skipped: true })];
    const ranked = rankSpells(rows);
    const sun = ranked.find((entry) => entry.id === "sun" && entry.rank === 3);
    // Values: a 1, b 2, c 2.5, d 1.5, e 2.5, sun 4 — the typical rank-3 spell 2.25 (the median of six).
    assert.equal(sun.typical, 2.25);
    assert.equal(sun.power, 1.75);
    assert.equal(sun.vs.undead, 6.5 - 2.25);
    assert.equal(ranked.some((entry) => entry.id === "bad" || entry.id === "skip"), false);
    const { ratings, detail } = spellRatingsOf(ranked);
    assert.equal(ratings["pf2e.spells-srd"].sun, Math.round(1.75 * 10) / 10);
    assert.deepEqual(Object.keys(detail["pf2e.spells-srd"].sun.ranks), ["5"], "its heightened rank, apart");
    assert.deepEqual([detail["pf2e.spells-srd"].sun.rank, detail["pf2e.spells-srd"].sun.boss, detail["pf2e.spells-srd"].sun.group], [3, 4, 4]);
});

// --- 2026-10-21, the user: "get the simulator to run summons picking the best possible summoned creature, walls and shield, utility
// spells, minion spells assuming you already have a minion out"; "rate spells based on their duration too"; "list when a spell is
// conditionally more useful. Include summons in this for when a specific creature is especially useful". ---

test("fiends and celestials are weak to holy and unholy at their level's usual value; a holy spell does more against fiends", () => {
    const fiend = powerFoes("boss", 5, "fiend")[0];
    assert.deepEqual(fiend.weaknesses, [{ type: "holy", value: 5 }]);
    assert.deepEqual(powerFoes("group", 1, "celestial")[0].weaknesses, [{ type: "unholy", value: 3 }]);
    assert.equal(powerFoes("boss", 5)[0].weaknesses, undefined, "plain foes have none");
    assert.deepEqual(powerConditions({ traits: ["holy", "fire"], resolution: {} }), ["fiend"]);
    assert.deepEqual(powerConditions({ traits: ["unholy"], resolution: {} }), ["celestial"]);
});

test("a summon is rated at every rank, as its trait heightens it", () => {
    const doc = { system: { level: { value: 4 }, traits: { value: ["concentrate", "manipulate", "summon"] }, description: { value: "<p>You summon a creature…</p><hr /><p><strong>Heightened</strong> As listed in the summon trait.</p>" } } };
    assert.deepEqual(powerRanks(doc), [4, 5, 6, 7, 8, 9, 10]);
});

test("duration: a lingering area again each round foes stay in it, a Sustained repeat each round, up to the fight's length", () => {
    assert.equal(durationRounds({ lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } } }), POWER_ROUNDS);
    assert.equal(durationRounds({ lifecycle: { durationSpec: { mode: "fixed", value: 2, unit: "rounds" } } }), 2);
    assert.equal(durationRounds({ lifecycle: { durationSpec: { mode: "instantaneous" } } }), 1);
    assert.equal(durationRounds({ lifecycle: { durationSpec: { mode: "sustained" }, sustained: true } }), POWER_ROUNDS);
    const cloud = { resolution: { lingering: { events: ["turn-start"], durationSeconds: 60 } } };
    assert.equal(castRepeats(cloud), 1, "two more rounds, foes in it half the time");
    assert.equal(castRepeats(cloud, 2), 0.5, "a two-round fight: one more round");
    assert.equal(castRepeats({ resolution: { lingering: { events: ["enter"], durationSeconds: 60 } } }), 0.5, "only as they enter: a quarter");
    assert.equal(castRepeats({ resolution: { lingering: { events: ["turn-start"], durationSeconds: 6 } } }), 0, "gone before it comes again");
    const weapon = { lifecycle: { durationSpec: { mode: "sustained" }, sustained: true }, resolution: { repeatable: { window: "sustain", attacks: 11 } } };
    assert.equal(castRepeats(weapon), 2, "struck again with each Sustain");
    assert.equal(castRepeats({ ...weapon, resolution: { repeatable: { window: "sustain", recharge: { formula: "1d4" } } } }), 1, "once more, when it must recharge");
    assert.equal(castRepeats({ resolution: {} }), 0);
});

test("a lingering burst is worth more than the same burst once", () => {
    const party = standardParty(5);
    const plan = { modelVersion: 13, source: { name: "Test Cloud", slug: "test-cloud" }, rank: 3, traits: ["poison"], activation: { time: "2" }, targeting: { target: null, range: { value: 500 }, area: { type: "burst", value: 20 } }, trigger: { event: "use" },
        lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } },
        resolution: { kind: "save", check: { roll: "save", statistic: "fortitude", basic: true, against: { dc: "spell" } }, sharedDamage: { components: [{ id: "c0", formula: "2d6", type: "poison", kinds: ["damage"] }] }, outcomes: { criticalSuccess: { damage: { mode: "none", multiplier: 0 } }, success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["c0"] } }, failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["c0"] } }, criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["c0"] } } } } };
    const entry = (resolution) => ({ name: "Test Cloud", castRank: 3, dc: 22, attack: 14, pool: RATED_POOL, tradition: "arcane", effects: {}, plan: { ...plan, resolution } });
    const once = castPower(party, powerFoes("boss", 5), entry(plan.resolution));
    const lingering = castPower(party, powerFoes("boss", 5), entry({ ...plan.resolution, lingering: { events: ["turn-start"], durationSeconds: 60 } }));
    assert.ok(once && lingering);
    assert.ok(lingering.share > once.share * 1.4, `${lingering.share} vs ${once.share}`);
});

test("a summon: its damage a round beside the party's and the attacks it draws; a holy one does more against fiends", () => {
    const party = partyWithSpell(standardParty(5));
    const angel = { ...moderateCreatureAt(3, "angel", "Test Angel"), side: "party", strikes: [{ name: "Sword", bonus: 12, melee: true, holy: true, damage: [{ dice: 1, die: 8, bonus: 6, type: "slashing" }] }] };
    const plain = summonShare(party, powerFoes("boss", 5), angel);
    const fiends = summonShare(party, powerFoes("boss", 5, "fiend"), angel);
    assert.ok(plain && fiends);
    assert.ok(plain.share > 0 && plain.share < 0.5, `a level-3 creature beside a level-5 party: ${plain.share}`);
    assert.ok(fiends.share > plain.share * 1.1, `its holy Strikes on fiends weak to holy: ${fiends.share} vs ${plain.share}`);
    const stronger = summonShare(party, powerFoes("boss", 5), { ...moderateCreatureAt(5, "big", "Test Big"), side: "party" });
    assert.ok(stronger.share > summonShare(party, powerFoes("boss", 5), { ...moderateCreatureAt(1, "small", "Test Small"), side: "party" }).share, "a stronger creature is worth more");
});

test("walls: their kind from their text, and their worth in the way of most foes; damage at the rank they're cast", () => {
    assert.equal(wallKind({ resolution: { damagingWall: { control: { perAction: true } } } }, "Each section has Hardness 10."), "hinder");
    assert.equal(wallKind({ resolution: {} }, "Each 10-foot section has AC 10, Hardness 14 and 50 Hit Points."), "barrier");
    assert.equal(wallKind({ resolution: {} }, "A creature traversing the wall needs to Swim through."), "hinder");
    assert.equal(wallKind({ resolution: { damagingWall: { control: { count: 4, faces: 6 } } } }, "Flames."), "damaging");
    assert.equal(wallKind({ resolution: {} }, "The wall prevents light from passing through."), "screen");
    const party = standardParty(7);
    const fire = (rank) => ({ name: "Test Wall", castRank: rank, dc: 25, attack: 17, pool: RATED_POOL, tradition: "arcane", effects: {}, plan: { traits: ["fire"], lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } }, resolution: { kind: "damaging-wall", damagingWall: { baseRank: 4, control: { count: 4, faces: 6, type: "fire", step: { interval: 1, dice: 1 } } } } } });
    const at4 = wallShare(party, powerFoes("group", 7), fire(4), "damaging");
    const at6 = wallShare(party, powerFoes("group", 7), fire(6), "damaging");
    assert.ok(at4 && at6 && at6.share > at4.share, "two dice more at the 6th rank");
    const barrier = wallShare(party, powerFoes("boss", 7), { ...fire(4), plan: { resolution: { kind: "spell-note" }, lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } } } }, "barrier");
    assert.ok(Math.abs(barrier.share - 0.25) < 1e-9, `a round lost by three in four: ${barrier.share}`);
    assert.ok(wallShare(party, powerFoes("boss", 7), fire(4), "screen").share < barrier.share);
});

test("a shield raised: more AC and a Shield Block; more hardness, more worth; held longer, more", () => {
    const party = standardParty(3);
    const shield = shieldShare(party, powerFoes("boss", 3), { ac: 1, hardness: 5 });
    const harder = shieldShare(party, powerFoes("boss", 3), { ac: 1, hardness: 10 });
    const held = shieldShare(party, powerFoes("boss", 3), { ac: 1, hardness: 5 }, 3);
    assert.ok(shield && shield.share > 0 && shield.share < 0.2, `${shield?.share}`);
    assert.ok(harder.share > shield.share && held.share > shield.share);
});

test("a utility spell's damage from its text: every foe in an area, else the creatures it names", () => {
    const party = standardParty(5);
    const entry = { name: "Test Quake", castRank: 3, dc: 22, attack: 14, pool: RATED_POOL, tradition: "arcane", effects: {}, plan: { traits: [], resolution: { kind: "spell-note" } } };
    const area = textDamageShare(party, powerFoes("group", 5), entry, { dice: 4, faces: 6, type: "bludgeoning", save: "reflex", targets: Infinity });
    const one = textDamageShare(party, powerFoes("group", 5), entry, { dice: 4, faces: 6, type: "bludgeoning", save: "reflex", targets: 1 });
    assert.deepEqual([area.targets, one.targets], [4, 1]);
    assert.ok(Math.abs(area.share - 4 * one.share) < 1e-9);
    assert.equal(textDamageShare(party, powerFoes("group", 5), entry, { dice: 0, faces: 6 }), null);
});

test("a minion spell goes to the minion already out, and only to it", () => {
    const party = standardParty(3);
    const plan = { modelVersion: 13, source: { name: "Test Mend" }, rank: 1, traits: [], activation: { time: "1", traits: [] }, targeting: { target: "1 willing creature", range: { value: 30 }, area: null }, trigger: { event: "use" },
        resolution: { kind: "healing", native: { healing: { components: [{ id: "0", formula: "4d8", kinds: ["healing"] }], recipients: "any" } } } };
    const entry = { name: "Test Mend", castRank: 2, dc: 19, attack: 11, pool: RATED_POOL, tradition: "arcane", effects: {}, plan };
    const minion = moderateCreatureAt(1, "minion", "Minion");
    const healed = castPower(party, powerFoes("boss", 3), entry, { minion });
    assert.ok(healed && healed.share > 0 && healed.targets === 1, JSON.stringify(healed));
});

test("the compendium detail: a summon's best creature, at each rank and against each trait; an estimate; a minion spell", () => {
    const row = (id, rank, extra = {}) => ({ collection: "pf2e.spells-srd", id, name: id, rank, level: 2 * rank - 1, cantrip: false, traits: [], results: { "boss|": { share: 0, levels: 1 }, "group|": { share: 0, levels: 1 } }, ...extra });
    const rows = [...["a", "b", "c", "d"].map((id) => row(id, 1)),
        row("summon", 1, { creature: "Test Wolf", traits: ["fiend"], creatures: { fiend: "Test Archon" }, results: { "boss|": { levels: 1 }, "group|": { levels: 1 }, "boss|fiend": { levels: 1.5 }, "group|fiend": { levels: 1.5 } } }),
        row("summon", 2, { creature: "Test Bear" }), row("wall", 1, { estimate: "wall (barrier)" }), row("pet", 1, { minion: true })];
    const { detail } = spellRatingsOf(rankSpells(rows));
    const summon = detail["pf2e.spells-srd"].summon;
    assert.deepEqual([summon.creature, summon.creatures, summon.summons, summon.vs.fiend], ["Test Wolf", { fiend: "Test Archon" }, { 2: "Test Bear" }, 0.5]);
    assert.equal(detail["pf2e.spells-srd"].wall.estimate, "wall (barrier)");
    assert.equal(detail["pf2e.spells-srd"].pet.minion, true);
    assert.equal(detail["pf2e.spells-srd"].a.creature, undefined);
});
