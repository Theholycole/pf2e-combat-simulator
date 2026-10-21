import test from "node:test";
import assert from "node:assert/strict";

import { RATED_POOL, castPower, partyLevelForRank, partyWithSpell, powerConditions, powerFoes, powerRanks, rankSpells, shareToLevels, spellRatingsOf } from "../src/engine/spell-power.js";
import { standardParty } from "../src/engine/party.js";

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
