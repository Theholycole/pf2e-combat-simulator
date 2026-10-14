import test from "node:test";
import assert from "node:assert/strict";

import { SPELLBOOKS, standardParty } from "../src/engine/party.js";
import { simulate } from "../src/engine/fight.js";
import { moderateCreature } from "../src/engine/benchmarks.js";

// The standard party (2026-10-13; the user's call: "Fighter, Rogue, Wizard and Cleric with a diverse set of skills and spells").
const fake = (name) => ({ name, plan: { source: { name }, resolution: { kind: "save" } }, effects: {} });

test("the standard party: four PCs of the level, 1 to 20, with their classes' numbers and features", () => {
    const [fighter, rogue, wizard, cleric] = standardParty(1, { spell: fake });
    assert.deepEqual([fighter.id, rogue.id, wizard.id, cleric.id], ["fighter", "rogue", "wizard", "cleric"]);
    // Level 1: fighter HP 8 + 10 + 2, expert Strike +4 +4, full plate AC 18; rogue sneak attack 1d6; cleric four heals.
    assert.deepEqual([fighter.hp.max, fighter.strikes[0].bonus, fighter.ac], [20, 9, 19]);
    assert.equal(rogue.strikeExtras[0].dice, 1);
    assert.equal(cleric.spellPools["cleric:font"], 4);
    // A rank's slots: two at the level it comes, three after; a wizard's curriculum slot more.
    assert.equal(wizard.spells.filter((entry) => entry.castRank === 1 && entry.pool).length, 3);
    assert.equal(cleric.spells.filter((entry) => entry.castRank === 1 && entry.pool && entry.pool !== "cleric:font").length, 2);
    assert.equal(standardParty(2, { spell: fake })[2].spells.filter((entry) => entry.castRank === 1 && entry.pool).length, 4);
    // 20th level: legendary fighter weapon, sneak attack 4d6, a 10th-rank slot, six heals; clamped beyond.
    const high = standardParty(25, { spell: fake });
    assert.equal(high[0].level, 20);
    assert.equal(high[0].strikes[0].bonus, 20 + 8 + 7 + 3);
    assert.equal(high[1].strikeExtras[0].dice, 4);
    assert.ok(high[2].spells.some((entry) => entry.castRank === 10));
    assert.equal(high[3].spellPools["cleric:font"], 6);
    // Spells the resolver doesn't give are left out.
    const none = standardParty(5, { spell: () => null });
    assert.equal(none[2].spells.length, 0);
    assert.ok(SPELLBOOKS.wizard.ranks[3].includes("Fireball"));
});

test("the standard party fights: a moderate creature of its level", () => {
    let wins = 0;
    for (let seed = 1; seed <= 5; seed++) if (simulate({ combatants: [...standardParty(5), { ...moderateCreature(5, "foe", "Foe") }] }, { morale: false }, seed).outcome === "decisive") wins++;
    assert.equal(wins, 5);
});
