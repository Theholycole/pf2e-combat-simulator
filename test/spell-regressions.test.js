import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { simulate } from "../src/engine/fight.js";
import { martialParty, moderateCreature } from "../src/engine/benchmarks.js";

const SPELLS = "../../PF2e AUTOMATIC SPELL RESOLUTION/src/compiler/index.js";
const PACKS = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const available = existsSync(new URL(SPELLS, import.meta.url)) && existsSync(`${PACKS}/pathfinder-bestiary`);

// (2026-10-13: a plan that has its persistent damage in a formula and also links PF2e's Persistent Damage condition — Spellwrack's success —
// gave the fight a persistent-damage condition with no damage, and the planner's estimate of it crashed the fight: the Night Hag, the annis hag.)
test("a spell linking PF2e's Persistent Damage condition beside its own persistent damage is cast without a crash", { skip: !available && "the spell module or PF2e's packs not found" }, async () => {
    const { compileAbility } = await import(SPELLS);
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    // (The Night Hag's own copy, from the first bestiary: its text links the condition.)
    const hag = readDocuments(`${PACKS}/pathfinder-bestiary`).find((doc) => doc.collection === "actors" && doc.name === "Night Hag");
    const spell = hag.items.find((item) => item.type === "spell" && item.name === "Spellwrack");
    const plan = compileAbility(spell, {});
    assert.match(JSON.stringify(plan), /"slug":"persistent-damage"/);
    const caster = { ...moderateCreature(9, "hag", "Test Hag"), spells: [{ name: "Spellwrack", plan, castRank: 6, dc: 28, attack: 20, pool: null }], band: "far" };
    for (let seed = 1; seed <= 3; seed++) {
        const result = simulate({ combatants: [...martialParty(9), caster] }, {}, seed, { log: true });
        assert.ok(result.outcome);
    }
});
