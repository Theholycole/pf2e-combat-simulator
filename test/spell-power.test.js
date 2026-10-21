import test from "node:test";
import assert from "node:assert/strict";

import { RATED_POOL, partyLevelForRank, partyWithSpell, powerConditions, powerCurves, powerFoes, powerRanks, powerValue, rankSpells, spellRatingsOf, unusedSpell } from "../src/engine/spell-power.js";

// A spell's power for its rank (2026-10-21, src/engine/spell-power.js): the method's parts.

test("the encounters: a boss two levels up, a group of four two down (fewer below level −1), and foes of a trait", () => {
    assert.equal(partyLevelForRank(3), 5);
    assert.equal(partyLevelForRank(10), 19);
    const boss = powerFoes("boss", 5);
    assert.deepEqual([boss.length, boss[0].level], [1, 7]);
    const group = powerFoes("group", 5, -1);
    assert.deepEqual([group.length, group[0].level, new Set(group.map((foe) => foe.id)).size], [4, 2, 4]);
    assert.equal(powerFoes("boss", 1, -5), null, "no boss below level −1");
    assert.deepEqual([1, 0, -1, -2, -3, -4].map((offset) => powerFoes("group", 1, offset).length), [4, 4, 3, 2, 1, 1], "a level-1 party's easier groups: fewer level −1 creatures");
    const undead = powerFoes("boss", 13, 0, "undead")[0];
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

test("a spell's value on the ladder, and its power over the typical spell of its rank", () => {
    // Level 5's curves: the foes' score 0.1 a level, 0.4 at the encounter's own level.
    const ladder = [5, 9].flatMap((level) => ["boss", "group"].flatMap((encounter) => [-6, -5, -4, -3, -2, -1, 0, 1, 2].map((offset) => ({ level, encounter, trait: null, offset, n: 100, score: 0.4 + 0.05 * offset }))));
    ladder.push({ level: 5, encounter: "boss", trait: "undead", offset: 0, n: 100, score: 0.45 }, { level: 5, encounter: "group", trait: "undead", offset: 0, n: 100, score: 0.45 });
    const curve = powerCurves(ladder).get("5|boss|");
    const round = ({ value, bound }) => ({ value: Math.round(value * 1e6) / 1e6, bound });
    assert.deepEqual(round(powerValue(curve, 0.3)), { value: 2, bound: null }, "two levels easier");
    assert.deepEqual(round(powerValue(curve, 0.05)), { value: 6, bound: "atLeast" }, "past the easiest rung: at least");
    const row = (id, boss, group, extra = {}) => ({ collection: "pf2e.spells-srd", id, name: id, rank: 3, level: 5, cantrip: false, traits: [], results: { "boss|": { n: 100, score: boss }, "group|": { n: 100, score: group } }, ...extra });
    const rows = [row("a", 0.35, 0.35), row("b", 0.3, 0.3), row("c", 0.25, 0.3), row("d", 0.35, 0.3), row("e", 0.3, 0.25),
        row("sun", 0.2, 0.2, { traits: ["undead"], results: { "boss|": { n: 100, score: 0.2 }, "group|": { n: 100, score: 0.2 }, "boss|undead": { n: 100, score: 0.15 }, "group|undead": { n: 100, score: 0.15 } } }),
        row("sun", 0.25, 0.25, { rank: 5, level: 9 }), row("bad", 0, 0, { skipped: true })];
    const ranked = rankSpells(rows, ladder);
    const sun = ranked.find((entry) => entry.id === "sun" && entry.rank === 3);
    // Values: a 1, b 2, c 2.5, d 1.5, e 2.5, sun 4 — the typical rank-3 spell 2.25 (the median of six); against undead: 0.45 → 0.15 is
    // 6 levels, 3.75 over the typical spell.
    assert.equal(Math.round(sun.typical * 1e6) / 1e6, 2.25);
    assert.equal(Math.round(sun.power * 1e6) / 1e6, 1.75);
    assert.equal(Math.round(sun.vs.undead * 1e6) / 1e6, 3.75);
    const { ratings, detail } = spellRatingsOf(ranked);
    assert.equal(ratings["pf2e.spells-srd"].sun, Math.round(sun.power * 10) / 10);
    assert.equal(detail["pf2e.spells-srd"].sun.vs.undead, Math.round(sun.vs.undead * 10) / 10);
    assert.deepEqual(Object.keys(detail["pf2e.spells-srd"].sun.ranks), ["5"], "its heightened rank, apart");
    assert.equal(detail["pf2e.spells-srd"].sun.rank, 3);
    assert.equal(ratings["pf2e.spells-srd"].bad, undefined, "skipped: no number");
});

test("a spell never cast (its fights the party's own, score for score) gets no number; one used only against undead does", () => {
    const ladder = [{ level: 5, encounter: "boss", trait: null, offset: 0, from: 1, n: 100, score: 0.35 }, { level: 5, encounter: "group", trait: null, offset: 0, from: 1, n: 100, score: 0.15 }, { level: 5, encounter: "boss", trait: "undead", offset: 0, from: 1, n: 100, score: 0.31 }, { level: 5, encounter: "group", trait: "undead", offset: 0, from: 1, n: 100, score: 0.2 }];
    const row = (results) => ({ level: 5, results });
    assert.equal(unusedSpell(row({ "boss|": { n: 100, score: 0.35 }, "group|": { n: 100, score: 0.15 } }), ladder), true);
    assert.equal(unusedSpell(row({ "boss|": { n: 100, score: 0.35 }, "group|": { n: 100, score: 0.14 } }), ladder), false);
    assert.equal(unusedSpell(row({ "boss|": { n: 100, score: 0.35 }, "group|": { n: 100, score: 0.15 }, "boss|undead": { n: 100, score: 0.2 }, "group|undead": { n: 100, score: 0.2 } }), ladder), false, "used against undead");
});

