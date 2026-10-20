import test from "node:test";
import assert from "node:assert/strict";

import { boundOf, dangerBand, dangerLabel, dangerOrder, dangerTooltip, ratingOf, ratingOfUuid, sortByDanger } from "../src/live/danger.js";

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

