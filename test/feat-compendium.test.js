import test from "node:test";
import assert from "node:assert/strict";

import { characterTooltip, featBand, featLabel, featTooltip, ratingOfUuid } from "../src/live/danger.js";

// (feat-report.mjs's featCompendiumData reads the PF2e packs on import; its shape is checked through the file it writes, here by hand.)
const data = {
    generated: "2026-11-01",
    ratings: { "pf2e.feats-srd": { abc: 0.68 }, "pf2e.ancestries": { dwarf: -0.02 } },
    detail: {
        "pf2e.feats-srd": { abc: { level: 14, host: "fighter", played: "Strike activity", boss: 1.08, group: 0.29, uses: 3.92, se: 0.05, verdict: "very strong" } },
        "pf2e.ancestries": { dwarf: { kind: "ancestry", se: 0.01, byHost: { fighter: 0.01, wizard: -0.05 }, byLevel: { 1: 0.02, 17: -0.06 } } }
    }
};

test("a feat's number is to the hundredth, with the creature bands' colours", () => {
    assert.equal(featLabel(0.68), "+0.68");
    assert.equal(featLabel(-0.054), "−0.05");
    assert.equal(featLabel(0.001), "0.00");
    assert.equal(featBand(0.3), "high");
    assert.equal(featBand(0.1), "up");
    assert.equal(featBand(0), "even");
    assert.equal(featBand(-0.1), "down");
    assert.equal(featBand(-0.3), "low");
});

test("a feat's words say what it does to a fight, on whom, and how it was played", () => {
    const words = featTooltip(0.68, data, data.detail["pf2e.feats-srd"].abc);
    assert.match(words, /^\+0\.68 \(± 0\.05\)/);
    assert.match(words, /as easy as one against foes 0\.68 levels lower/);
    assert.match(words, /fighter of a party of four .* at level 14: a fight with a boss 1\.08 levels easier, one with a group 0\.29 levels easier, used 3\.9 times a fight/);
    assert.match(words, /Played as: Strike activity/);
    assert.deepEqual(ratingOfUuid(data, "Compendium.pf2e.feats-srd.Item.abc"), { value: 0.68, bound: null });
});

test("an ancestry's words give it by PC and by level", () => {
    const words = characterTooltip(-0.02, data, data.detail["pf2e.ancestries"].dwarf);
    assert.match(words, /this ancestry \(against a human\)/);
    assert.match(words, /By PC: fighter \+0\.01, wizard −0\.05/);
    assert.match(words, /By level: level 1 \+0\.02, level 17 −0\.06/);
});
