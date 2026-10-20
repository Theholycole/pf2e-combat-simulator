import test from "node:test";
import assert from "node:assert/strict";

import { averageOf, parseReadableDamage } from "../src/adapter/formula.js";
import { stripConditions } from "../scripts/snapshot.js";

// The plain-arithmetic average of a readable formula, for checking the parser.
function referenceAverage(text) {
    const arithmetic = text
        .replace(/(\d+)d(\d+)/g, (_, n, m) => `(${n}*(${m}+1)/2)`)
        .replace(/[a-z][a-z\s-]*/gi, " ");
    return Function(`"use strict"; return (${arithmetic.replace(/\)\s+\(/g, ")+(").replace(/(\d|\))\s+(\(|\d)/g, "$1+$2")});`)();
}

// Patterns seen across all 492 Monster Core creatures (1,027 formulas, all
// parsed exactly in the live check of 2026-10-07).
const FORMULAS = [
    "1d8 + 3 slashing",
    "1d8 - 3 piercing",
    "2 * (1d8 - 3) piercing",
    "2 * 1d6 + 1d10 piercing",
    "(2 * (2d8 + 6)) piercing + (2 * 2d6) fire",
    "(2 * (4d4 + 15) + 2d8) slashing + (2 * 6d6) void",
    "(2d6 + 2) acid + 2 persistent acid",
    "(2 * 2d6 + 2) acid + (2 * 2) persistent acid",
    "(2 * (2d6 + 16)) piercing + (2 * 1d6) bleed",
    "(2 * 1d8) mental + (2 * (3d8 + 14)) piercing"
];

test("readable damage formulas keep their average", () => {
    for (const formula of FORMULAS) assert.equal(averageOf(parseReadableDamage(formula)), referenceAverage(formula), formula);
});

test("persistent, bleed and doubled parts are recognised", () => {
    const acid = parseReadableDamage("(2d6 + 2) acid + 2 persistent acid");
    assert.equal(acid.filter((part) => part.persistent).length, 1);
    const bleed = parseReadableDamage("(2 * (2d6 + 16)) piercing + (2 * 1d6) bleed");
    assert.ok(bleed.find((part) => part.type === "bleed").persistent);
    assert.equal(bleed[0].multiplier, 2);
});

test("a dash for a minus reads as one; a type with no amount is no damage", () => {
    assert.deepEqual(parseReadableDamage("1d4\u20131 piercing"), parseReadableDamage("1d4 - 1 piercing"));
    assert.deepEqual(parseReadableDamage(" bludgeoning"), []);
    assert.equal(averageOf(parseReadableDamage("1d6 + 1d6 fire")), 7);
});

test("the weapon's own damage comes first", () => {
    const parts = parseReadableDamage("(2 * 1d8) mental + (2 * (3d8 + 14)) piercing");
    assert.equal(parts[0].type, "piercing");
});

test("condition modifiers are removed and displaced ones restored", () => {
    const modifiers = [
        { slug: "base", type: "untyped", modifier: 8, enabled: true },
        { slug: "frightened", type: "status", modifier: -2, enabled: true },
        { slug: "bane", type: "status", modifier: -1, enabled: false }
    ];
    // PF2e total: 8 - 2 = 6. Without frightened, the bane penalty applies: 7.
    assert.equal(stripConditions(6, modifiers), 7);
    assert.equal(stripConditions(8, [{ slug: "base", type: "untyped", modifier: 8, enabled: true }]), 8);
});

test("extra damage parts: a Strike's damage with a roll option on, against without it", async () => {
    const { extraDamageParts, parseReadableDamage } = await import("../src/adapter/formula.js");
    const base = parseReadableDamage("(1d6 + 4) piercing");
    assert.deepEqual(extraDamageParts(parseReadableDamage("(1d6 + 4) piercing + 2d6 precision"), base), [{ dice: 2, die: 6, bonus: 0, multiplier: 1, type: "piercing", persistent: false, precision: true }], "Sneak Attack");
    assert.deepEqual(extraDamageParts(parseReadableDamage("(1d6 + 6) piercing"), base), [{ dice: 0, die: 0, bonus: 2, multiplier: 1, type: "piercing", precision: false, persistent: false }], "Rage's +2");
    assert.deepEqual(extraDamageParts(base, base), []);
});
