import test from "node:test";
import assert from "node:assert/strict";

import { CLASS_SLUGS, classPC, classParty, seatOf } from "../src/engine/classes.js";
import { standardParty } from "../src/engine/party.js";
import { simulate } from "../src/engine/fight.js";
import { moderateCreature } from "../src/engine/benchmarks.js";

// Every class's PC (2026-11-02, the user: "Get the simulator working with all classes").
const fake = (name) => ({ name, plan: { source: { name }, resolution: { kind: "save" } }, effects: {} });

test("every class has a PC at every level, with its seat in the standard party", () => {
    assert.equal(CLASS_SLUGS.length, 29);
    for (const slug of CLASS_SLUGS) {
        for (const level of [1, 7, 20]) {
            const c = classPC(slug, level, { spell: fake });
            assert.equal(c.id, slug);
            assert.equal(c.level, level);
            assert.ok(c.hp.max > 0 && c.ac > 10 + level && c.strikes.length > 0, `${slug} ${level}`);
        }
        const party = classParty(slug, 5, { spell: fake });
        assert.equal(party.length, 4);
        assert.ok(party.some((c) => c.id === slug));
        assert.ok(["fighter", "rogue", "wizard", "cleric"].includes(seatOf(slug)));
    }
});

test("the four standard classes are the standard party's own PCs", () => {
    const [fighter] = standardParty(9, { spell: fake });
    assert.deepEqual(classPC("fighter", 9, { spell: fake }).strikes, fighter.strikes);
    assert.deepEqual(classParty("fighter", 9, { spell: fake }).map((c) => c.id), ["fighter", "rogue", "wizard", "cleric"]);
});

test("class engines: Rage, Hunt Prey, Flurry, panache, Exploit Vulnerability, Spellstrike, bombs, Elemental Blast", () => {
    const barbarian = classPC("barbarian", 7);
    assert.equal(barbarian.selfBuffs[0].name, "Rage");
    assert.equal(barbarian.selfBuffs[0].strikeDeltas.Greataxe[0].bonus, 6);
    assert.equal(classPC("ranger", 11).huntPrey.precisionDice, 2);
    assert.equal(classPC("monk", 1).multiStrikes[0].name, "Flurry of Blows");
    assert.deepEqual([classPC("swashbuckler", 9).panacheStyle.precise, classPC("swashbuckler", 9).panacheStyle.finisherDice], [4, 4]);
    assert.equal(classPC("thaumaturge", 6).exploit.antithesis, 5);
    assert.ok(classPC("magus", 5, { spell: fake }).spellstrike);
    // A magus's slots: two of each of its two highest ranks.
    const magus = classPC("magus", 9, { spell: fake });
    assert.deepEqual([...new Set(magus.spells.filter((entry) => entry.pool).map((entry) => entry.castRank))].sort(), [4, 5]);
    const alchemist = classPC("alchemist", 11);
    assert.equal(alchemist.strikes[0].splashKind, "bomb");
    assert.equal(alchemist.strikes[0].damage[0].dice, 3);
    const kineticist = classPC("kineticist", 9);
    assert.equal(kineticist.strikes[0].damage[0].dice, 3);
    assert.equal(kineticist.strikeActivities[0].actions, 2);
    // Casters of the other two traditions: a druid's primal spells, a bard's occult ones and Courageous Anthem.
    assert.equal(classPC("druid", 5, { spell: fake }).spells.find((entry) => !entry.kind).tradition, "primal");
    assert.ok(classPC("bard", 5, { spell: fake }).spells.some((entry) => entry.name === "Courageous Anthem"));
});

test("every class's party fights to an end", () => {
    for (const slug of CLASS_SLUGS) {
        const party = classParty(slug, 5, { spell: () => null });
        const result = simulate({ combatants: [...party.map((c) => ({ ...c, engagement: 1 })), { ...moderateCreature(6, "foe", "Foe"), engagement: 1 }] }, { morale: false, roundCap: 8 }, 1);
        assert.ok(result.rounds >= 1, slug);
    }
});
