import test from "node:test";
import assert from "node:assert/strict";

import { simulate } from "../src/engine/fight.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";

// Delay (2026-10-21, the user: "Add the option to delay in case moving closer would allow the enemy to strike you first. Let players
// delay so the enemy moves closer then the player can stride and strike in the same turn").

const pc = (perception = 30, extra = {}) => ({ ...moderateCreatureAt(3, "p", "Fighter PC"), side: "party", kind: "pc", perception, ...extra });
const brute = (perception = -10) => ({ ...moderateCreatureAt(3, "x", "Brute"), side: "foes", perception });
const grid = (pcAt = [2, 2], foeAt = [12, 2]) => ({ map: { width: 20, height: 6, blocked: [], walls: [], difficult: {}, spawns: { party: [], foes: [] } }, squares: { p: pcAt, x: foeAt } });
const firstRound = (log) => log.slice(0, log.findIndex((line, index) => index > 0 && /^— Round 2/.test(line)));

test("a PC two Strides off a melee foe that acts after it Delays, and comes back as the foe reaches it: Strikes, no Strides", () => {
    const { log } = simulate({ combatants: [pc(), brute()] }, { maxRounds: 3, grid: grid(), morale: false }, 1, { log: true });
    const round = firstRound(log).join("\n");
    assert.match(round, /Fighter PC Delays, for Brute to come to it/);
    assert.match(round, /Brute Strides toward Fighter PC[^\n]*in reach/);
    assert.match(round, /Fighter PC returns from Delay \([^)]*engaged\)\n  Fighter PC Strike → Brute/);
    // (Its place in the order is after the Brute's from then on.)
    const second = log.slice(log.findIndex((line) => /^— Round 2/.test(line)) + 1).find((line) => /^\S/.test(line));
    assert.match(second, /^Brute/);
});

test("no Delay: the foe already acted this round, the option off, or a foe within a Stride", () => {
    const after = simulate({ combatants: [pc(-10), brute(30)] }, { maxRounds: 2, grid: grid(), morale: false }, 1, { log: true });
    assert.doesNotMatch(after.log.join("\n"), /Delays/);
    const off = simulate({ combatants: [pc(), brute()] }, { maxRounds: 2, grid: grid(), morale: false, delay: false }, 1, { log: true });
    assert.doesNotMatch(off.log.join("\n"), /Delays/);
    const close = simulate({ combatants: [pc(), brute()] }, { maxRounds: 2, grid: grid([2, 2], [7, 2]), morale: false }, 1, { log: true });
    assert.doesNotMatch(firstRound(close.log).join("\n"), /Delays/);
});

test("a PC with a better start than walking up (a bow) doesn't Delay", () => {
    const archer = pc(30, { strikes: [{ name: "Longbow", bonus: 11, melee: false, increment: 100, damage: [{ dice: 1, die: 8, bonus: 3, type: "piercing" }] }] });
    const { log } = simulate({ combatants: [archer, brute()] }, { maxRounds: 2, grid: grid(), morale: false }, 1, { log: true });
    assert.doesNotMatch(firstRound(log).join("\n"), /Delays/);
});
