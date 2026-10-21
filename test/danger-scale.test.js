import test from "node:test";
import assert from "node:assert/strict";

import { canFight, dangerFights, dangerSummary, ladderCurves, mergeSummaries, rankRows, rateAlone, ratingsOf, scaleFromJSON, scaleOf, scaleToJSON } from "../src/engine/danger-scale.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { standardParty } from "../src/engine/party.js";

// Danger for its level, the counting and the ranking both the offline tool and the in-Foundry run use (src/engine/danger-scale.js).

test("fights in parts (a run's workers) sum to the same as in one", () => {
    const party = standardParty(3);
    const foes = [moderateCreatureAt(5, "monster")];
    const whole = dangerSummary(dangerFights(party, foes, 1, 21));
    const parts = mergeSummaries([dangerSummary(dangerFights(party, foes, 1, 11)), dangerSummary(dangerFights(party, foes, 11, 21))]);
    assert.equal(parts.n, 20);
    for (const key of ["score", "damage", "downs", "deaths", "wipes", "rounds", "killed", "se"]) assert.ok(Math.abs(parts[key] - whole[key]) < 1e-9, key);
    assert.deepEqual(parts.scores, whole.scores);
    assert.ok(canFight(foes[0]));
    assert.equal(canFight({ strikes: [], spells: [{ kind: "basic" }] }), false);
});

test("ranked by effective level over the typical creature's; a level with fewer than five against a moderate creature", () => {
    // Party 5's curve: offsets −3…3 score 0.1 apart from 0.2; party 10's the same.
    const ladder = [5, 10].flatMap((party) => [-3, -2, -1, 0, 1, 2, 3].map((offset) => ({ party, level: party + offset, n: 100, score: 0.5 + offset * 0.1 })));
    const row = (key, level, score, extra = {}) => ({ key, group: "p", collection: "pack", id: key, name: key, level, n: 100, score, ...extra });
    const screen = [
        row("a", 5, 0.5), row("b", 5, 0.6), row("c", 5, 0.7), row("d", 5, 0.4), row("e", 5, 0.5), row("f", 5, 0.9),
        row("lone", 10, 0.7),
        row("slip", 5, 0.8, { profile: { damage: { steps: 9 } } }),
        row("joke", 5, 0.8, { publication: "Pathfinder Blog: April Fools" }),
        row("broken", 5, 0.8, { error: "read: no" })
    ];
    const ranked = rankRows(screen, { screen, ladder });
    const excess = Object.fromEntries(ranked.map((entry) => [entry.key, Math.round(entry.excess * 10) / 10]));
    // Effective levels at 5: a 5, b 6, c 7, d 4, e 5, f 9 (past the top, on at its rise), slip and joke 8 — those two left out of the
    // ranking but not of the typical creature: the median, 6.5. Level 10 has one creature (offset +2): against a moderate one, 10.
    assert.deepEqual(excess, { f: 2.5, lone: 2, c: 0.5, b: -0.5, a: -1.5, e: -1.5, d: -2.5 });
    assert.equal(ranked[0].key, "f");
    const { ratings, bounds } = ratingsOf(ranked, ladder);
    assert.equal(ratings.pack.f, 2.5);
    assert.equal(ratings.pack.lone, 2, "alone at its level: against a moderate creature (offset 0)");
    assert.equal(bounds.pack.f, "above", "past the curve's top: an estimate");
    assert.equal(bounds.pack?.a, undefined);
    assert.equal(ladderCurves(ladder).get(5).length, 7);
    // One creature rated again alone, on the scale kept with the numbers (as JSON): the number the whole ranking gives it.
    const kept = scaleFromJSON(JSON.parse(JSON.stringify(scaleToJSON(scaleOf({ screen, ladder })))));
    for (const key of ["f", "c", "d", "lone"]) {
        const alone = rateAlone(kept, screen.find((entry) => entry.key === key));
        assert.equal(alone.value, ratings.pack[key], key);
        assert.equal(alone.bound, bounds.pack?.[key] ?? null, key);
    }
    assert.equal(rateAlone(kept, screen.find((entry) => entry.key === "slip")), null, "a data slip: none");
    assert.equal(rateAlone(kept, screen.find((entry) => entry.key === "broken")), null, "an error: none");
    assert.equal(scaleFromJSON(null), null);
});
