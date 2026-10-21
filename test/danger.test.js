import test from "node:test";
import assert from "node:assert/strict";

import { boundOf, dangerBand, dangerLabel, dangerOrder, dangerTooltip, powerDetailOf, powerLabel, powerTooltip, ratingOf, ratingOfUuid, sortByDanger, stampOf, withAlone } from "../src/live/danger.js";

// Danger for its level in compendium windows (2026-10-20, src/live/danger.js; scripts/danger.js draws it).

test("a creature's rating by compendium and id, its label, band and words", () => {
    const data = { generated: "2026-10-20", fights: 100, ratings: { "pf2e.pathfinder-monster-core": { a: 2.34, b: -0.4, c: 0 } } };
    assert.deepEqual(["a", "b", "c", "z"].map((id) => ratingOf(data, "pf2e.pathfinder-monster-core", id)), [2.34, -0.4, 0, null]);
    assert.equal(ratingOf(data, "pf2e.other", "a"), null);
    assert.deepEqual([dangerLabel(2.34), dangerLabel(-0.4), dangerLabel(0.04), dangerLabel(null)], ["+2.3", "−0.4", "0.0", ""]);
    assert.deepEqual([2, 0.7, 0.2, -0.8, -2].map(dangerBand), ["high", "up", "even", "down", "low"]);
    assert.equal(dangerTooltip(2.34, data), "Danger for its level: fights like a creature 2.3 levels above a typical one of its level, against a party of four at its level (Combat Simulator, 2026-10-20, 100 fights).");
    assert.match(dangerTooltip(-1, data), /1\.0 level below/);
    assert.match(dangerTooltip(0, data), /like a typical creature of its level/);
    assert.match(dangerTooltip(1, { ...data, source: "world" }), /\(Combat Simulator, this world's run, 2026-10-20, 100 fights\)/);
});

test("sorted most dangerous first, unrated after in their first order", () => {
    const entries = [{ id: "a", value: 0.5, order: 0 }, { id: "b", value: null, order: 1 }, { id: "c", value: 3.1, order: 2 }, { id: "d", value: -1, order: 3 }, { id: "e", value: null, order: 4 }, { id: "f", value: 0.5, order: 5 }];
    assert.deepEqual(dangerOrder(entries).map((entry) => entry.id), ["c", "a", "f", "d", "b", "e"]);
});

test("an estimate past the scale's top, and the most it could be under its foot: their marks and words", () => {
    const data = { ratings: { p: { a: 9.06, b: -5.1 } }, bounds: { p: { a: "above", b: "below" } } };
    assert.deepEqual([boundOf(data, "p", "a"), boundOf(data, "p", "b"), boundOf(data, "p", "c")], ["above", "below", null]);
    assert.deepEqual([dangerLabel(9.06, "above"), dangerLabel(-5.1, "below")], ["≈+9.1", "≤−5.1"]);
    assert.match(dangerTooltip(9.06, data, "above"), /an estimate\.$/);
    assert.match(dangerTooltip(-5.1, data, "below"), /at most this\.$/);
});

test("PF2e's Compendium Browser: a rating by compendium uuid, and its sort by danger", () => {
    const data = { ratings: { "pf2e.pathfinder-monster-core": { a: 2.3, b: -5.1 }, "battlezoo-bestiary-pf2e.pf2e-battlezoo-bestiary": { c: 1 } }, bounds: { "pf2e.pathfinder-monster-core": { b: "below" } } };
    assert.deepEqual(ratingOfUuid(data, "Compendium.pf2e.pathfinder-monster-core.Actor.a"), { value: 2.3, bound: null });
    assert.deepEqual(ratingOfUuid(data, "Compendium.pf2e.pathfinder-monster-core.Actor.b"), { value: -5.1, bound: "below" });
    assert.deepEqual(ratingOfUuid(data, "Compendium.battlezoo-bestiary-pf2e.pf2e-battlezoo-bestiary.Actor.c"), { value: 1, bound: null });
    assert.equal(ratingOfUuid(data, "Compendium.pf2e.pathfinder-monster-core.Actor.z"), null);
    assert.equal(ratingOfUuid(data, "Actor.a"), null);
    const values = { Ogre: 1, Bat: null, Lich: 3, Rat: -1, Ant: null, Bear: 1 };
    const entries = Object.keys(values).map((name) => ({ name }));
    const order = (options) => sortByDanger(entries, (entry) => values[entry.name], options).map((entry) => entry.name);
    assert.deepEqual(order(), ["Rat", "Bear", "Ogre", "Lich", "Ant", "Bat"]);
    assert.deepEqual(order({ descending: true }), ["Lich", "Bear", "Ogre", "Rat", "Ant", "Bat"]);
    assert.deepEqual(entries.map((entry) => entry.name), Object.keys(values), "the entries themselves left as they were");
});

test("creatures rated again on their own, laid over the numbers they were rated on — not over others", () => {
    const data = { run: "2026-10-21T01:00:00.000Z", generated: "2026-10-21", fights: 100, ratings: { p: { a: 3.9, b: 1, c: -5 } }, bounds: { p: { c: "below" } } };
    const alone = { base: "2026-10-21T01:00:00.000Z", entries: { p: { a: { value: 1.4, bound: null, generated: "2026-10-22" }, c: { value: null, generated: "2026-10-22" } }, q: { d: { value: 2, bound: "above", generated: "2026-10-22" } } } };
    const merged = withAlone(data, alone);
    assert.deepEqual(merged.ratings, { p: { a: 1.4, b: 1 }, q: { d: 2 } });
    assert.deepEqual(merged.bounds, { p: {}, q: { d: "above" } });
    assert.equal(merged.aloneOn.p.a, "2026-10-22");
    assert.equal(data.ratings.p.a, 3.9, "the numbers themselves untouched");
    const other = { ...data, run: "another run" };
    assert.equal(withAlone(other, alone), other, "rated on other numbers: left out");
    assert.equal(stampOf({ generated: "2026-10-20" }), "2026-10-20");
    assert.match(dangerTooltip(1.4, data, null, { alone: "2026-10-22" }), /Rated again on its own on 2026-10-22\.$/);
});

test("a spell's power: its label, and its words with its fights, heightened ranks that differ and traits it does more against", () => {
    const data = { kind: "spells", generated: "2026-10-21", fights: 100, ratings: { "pf2e.spells-srd": { sun: 0.8 } }, detail: { "pf2e.spells-srd": { sun: { rank: 7, boss: 1.1, group: 2.3, typical: 0.9, ranks: { 8: 0.6, 9: 0.1, 10: -0.4 }, vs: { undead: 2.6 } } } } };
    assert.deepEqual(ratingOfUuid(data, "Compendium.pf2e.spells-srd.Item.sun"), { value: 0.8, bound: null });
    assert.deepEqual(ratingOfUuid({ ...data, bounds: { "pf2e.spells-srd": { sun: "atLeast" } } }, "Compendium.pf2e.spells-srd.Item.sun"), { value: 0.8, bound: "atLeast" }, "a spell's bound kept");
    assert.deepEqual([powerLabel(0.8), powerLabel(6, "atLeast"), powerLabel(-2, "atMost")], ["+0.8", "≥+6.0", "≤−2.0"]);
    const words = powerTooltip(0.8, data, null, powerDetailOf(data, "pf2e.spells-srd", "sun"));
    assert.match(words, /^Power for its rank in combat: 0\.8 levels stronger than a typical rank-7 spell \(Combat Simulator, 2026-10-21, 100 fights\)\./);
    assert.match(words, /Rated for combat only: what it does outside a fight isn't counted\.$/);
    assert.match(words, /a party of four at level 13 makes a fight with a boss 1\.1 levels easier and one with a group 2\.3 levels easier \(a typical rank-7 spell: 0\.9 levels easier on average\)/);
    assert.match(words, /Heightened: 9th \+0\.1, 10th −0\.4\./, "only the ranks half a level or more from it");
    assert.doesNotMatch(words, /8th/);
    assert.match(words, /\* More useful against undead: \+2\.6\. Rated for combat only/);
    assert.match(powerTooltip(0.8, data, null, { ...powerDetailOf(data, "pf2e.spells-srd", "sun"), outOfCombat: true }), /Its healing over its long duration, outside a fight, isn't counted\.$/);
    assert.match(powerTooltip(0, data, null, { rank: 1, cantrip: true, boss: 0.2, group: 0.4, ranks: { 2: 0.1 } }), /about as strong as a typical cantrip at rank 1.*Cast at will.*Heightened: within half a level of this at every rank\./);
});

test("a spell's label marks an estimate and a spell more useful against some foes; its words name a summon's creatures", () => {
    const sun = { rank: 7, boss: 1.1, group: 2.3, typical: 0.9, ranks: {}, vs: { undead: 2.6, construct: -1 } };
    assert.equal(powerLabel(0.8, null, sun), "+0.8*");
    assert.equal(powerLabel(0.8, null, { ...sun, vs: { construct: -1 } }), "+0.8", "only when it does more somewhere");
    assert.equal(powerLabel(-0.4, null, { rank: 4, estimate: "wall (damaging)" }), "~−0.4");
    const words = powerTooltip(0.8, null, null, sun);
    assert.match(words, /\* More useful against undead: \+2\.6\. Against constructs: −1\.0\./);
    const summon = { rank: 1, boss: 0.9, group: 0.9, typical: 1, ranks: { 2: 0.1, 5: 1.2 }, vs: { fiend: 0.4 }, creature: "Soulrider (Celestial)", creatures: { fiend: "Soulrider (Celestial)" }, summons: { 2: "Wolf", 5: "Bear" } };
    const summonWords = powerTooltip(-0.1, null, null, summon);
    assert.match(summonWords, /Its best summon here: Soulrider \(Celestial\)\./);
    assert.match(summonWords, /Heightened: 5th \+1\.2 \(Bear\)\./);
    assert.match(summonWords, /More useful against fiends: \+0\.4 \(summoning Soulrider \(Celestial\)\)\./);
    assert.match(powerTooltip(-0.4, null, null, { rank: 4, boss: 0.3, group: 0.5, estimate: "wall (damaging)" }), /~ Estimated by a rule of thumb, as the simulator doesn't play it: a wall in the way of most foes, its damage as they cross it\./);
    assert.match(powerTooltip(0.2, null, null, { rank: 2, boss: 0.3, group: 0.5, minion: true }), /Cast on a minion of the caster's already out\./);
    assert.match(powerTooltip(0.4, null, null, { rank: 2, boss: 0.6, group: 0.9, estimate: "reading (web-area)" }), /~ Read for the rating, as fights don't cast it yet: foes held up on their way to the party \(its checks, its difficult terrain\)\./);
    assert.match(powerTooltip(0.4, null, null, { rank: 2, boss: 0.6, group: 0.9, vs: { choke: 0.8 } }), /\* More useful in a choke point \(the foes coming down a corridor\): \+0\.8\./);
    assert.equal(powerLabel(0.4, null, { vs: { choke: 0.8 } }), "+0.4*");
});


test("a rule the rules leave open, the GM's choice: Moment of Renewal's numbers as a day's rest when chosen, the other way in its words", async () => {
    const { withRuleChoices, powerTooltip } = await import("../src/live/danger.js");
    const data = {
        ratings: { "pf2e.spells-srd": { renewal: 4.2, other: 1 } },
        bounds: {},
        detail: { "pf2e.spells-srd": { renewal: { rank: 8, boss: 6.5, group: 2.4, typical: 0.3, ranks: { 9: 4 }, vs: {}, alternatives: { "renewalHealing:day": { power: 8.1, boss: 8.4, group: 8.4, bound: "atLeast", ranks: { 9: 8 } } } }, other: { rank: 1, boss: 1, group: 1, typical: 0, ranks: {}, vs: {} } } }
    };
    assert.equal(withRuleChoices(data, { renewalHealing: "rest" }).ratings["pf2e.spells-srd"].renewal, 4.2, "the default: as made");
    const day = withRuleChoices(data, { renewalHealing: "day" });
    assert.equal(day.ratings["pf2e.spells-srd"].renewal, 8.1);
    assert.equal(day.bounds["pf2e.spells-srd"].renewal, "atLeast");
    assert.equal(day.ratings["pf2e.spells-srd"].other, 1);
    assert.equal(data.ratings["pf2e.spells-srd"].renewal, 4.2, "the data left as it was");
    const detail = day.detail["pf2e.spells-srd"].renewal;
    assert.match(powerTooltip(8.1, day, "atLeast", detail), /The GM's setting counts its healing as a day of long-term rest .*; as one rest .*: \+4\.2\./);
    assert.match(powerTooltip(4.2, data, null, data.detail["pf2e.spells-srd"].renewal), /The GM's setting counts its healing as one rest .*; as a day of long-term rest .*: \+8\.1\./);
});
