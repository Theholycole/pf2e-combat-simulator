import test from "node:test";
import assert from "node:assert/strict";

import { canFight, dangerFights, dangerSummary, ladderCurves, mergeSummaries, rankRows, rateAlone, ratingsOf, scaleFromJSON, scaleOf, scaleToJSON } from "../src/engine/danger-scale.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { standardParty } from "../src/engine/party.js";
import { createFightState, simulate, turnEnd } from "../src/engine/fight.js";
import { applyDamage, dealDamage } from "../src/engine/actions.js";
import { takeControl } from "../src/engine/control.js";

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

test("what the foes made the party deal itself counts as theirs: a confused member's damage on its own side, the party's on a member they control (2026-10-21)", () => {
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), side: "foes" }] }, { morale: false }, 1);
    const [fighter, rogue, wizard, cleric] = ["fighter", "rogue", "wizard", "cleric"].map((id) => state.byId.get(id));
    const monster = state.byId.get("monster");
    const counted = () => ({ ...state.damageBy });
    // Ordinary friendly fire (a party area spell catching an ally): the party's, not the foes'.
    dealDamage(state, rogue, 5, { source: wizard });
    assert.deepEqual(counted(), { party: 5, foes: 0, foesInduced: 0 });
    // A confused Fighter striking the Rogue: the party's damage, and the foes' doing.
    fighter.cond.confused = true;
    dealDamage(state, rogue, 7, { source: fighter });
    assert.deepEqual(counted(), { party: 12, foes: 0, foesInduced: 7 });
    // A confused Fighter striking the foe: only the party's.
    dealDamage(state, monster, 4, { source: fighter });
    assert.deepEqual(counted(), { party: 16, foes: 0, foesInduced: 7 });
    // The Cleric dominated: its damage on the party is on the foes' side already; the party's on it, the foes' doing.
    cleric.cond.controlled = true;
    takeControl(state, cleric, monster);
    dealDamage(state, wizard, 6, { source: cleric });
    assert.deepEqual(counted(), { party: 16, foes: 6, foesInduced: 7 });
    fighter.cond.confused = false;
    dealDamage(state, cleric, 3, { source: rogue });
    assert.deepEqual(counted(), { party: 19, foes: 6, foesInduced: 10 });
    // A party creature its own side controls (a caster's minion): the party's friendly fire, not the foes'.
    const minion = { ...rogue, id: "minion", controlledBy: "wizard", originalSide: undefined, hp: { value: 50, max: 50, temp: 0 } };
    state.list.push(minion);
    state.byId.set("minion", minion);
    dealDamage(state, minion, 2, { source: wizard });
    assert.deepEqual(counted(), { party: 21, foes: 6, foesInduced: 10 });
});

test("the danger score's damage share has the foes' damage and what they made the party deal itself", () => {
    // The party starts confused against a moderate creature: some fights it strikes its own.
    const party = standardParty(5).map((c) => ({ ...c, conditions: { ...(c.conditions ?? {}), confused: true } }));
    const foes = [moderateCreatureAt(5, "monster")];
    const partyHp = party.reduce((sum, c) => sum + c.hp.max, 0);
    const summary = dangerSummary(dangerFights(party, foes, 1, 11));
    let share = 0;
    let induced = 0;
    for (let seed = 1; seed < 11; seed++) {
        const { damageBy } = simulate({ combatants: [...party, ...foes] }, { morale: false, retreat: false }, seed);
        share += (damageBy.foes + damageBy.foesInduced) / partyHp;
        induced += damageBy.foesInduced;
    }
    assert.ok(induced > 0, "the confused party hit its own");
    assert.ok(Math.abs(summary.damage - share / 10) < 1e-9);
});

test("persistent damage counts for whoever put it on: the foes', the party's, a confused member's on its own side as the foes' doing (2026-10-21)", () => {
    const state = createFightState({ combatants: [...standardParty(5), { ...moderateCreatureAt(5, "monster"), side: "foes" }] }, { morale: false }, 1);
    const [fighter, rogue, wizard, cleric] = ["fighter", "rogue", "wizard", "cleric"].map((id) => state.byId.get(id));
    const monster = state.byId.get("monster");
    const persistent = (type, amount) => [{ type, persistent: true, dice: 0, die: 0, bonus: 0, multiplier: 1, amount }];
    // Each tick: what it took off and what was counted.
    const tick = (c) => {
        const before = { ...state.damageBy };
        const hp = c.hp.value;
        turnEnd(state, c);
        return { took: hp - c.hp.value, counted: Object.fromEntries(Object.keys(before).map((key) => [key, state.damageBy[key] - before[key]])) };
    };
    // The foe's bleed on the Rogue: the foes'.
    applyDamage(state, rogue, persistent("bleed", 5), { source: monster });
    assert.deepEqual(tick(rogue), { took: 5, counted: { party: 0, foes: 5, foesInduced: 0 } });
    // A confused Fighter's fire on the Wizard: the party's, and the foes' doing.
    fighter.cond.confused = true;
    applyDamage(state, wizard, persistent("fire", 4), { source: fighter });
    fighter.cond.confused = false;
    assert.deepEqual(tick(wizard), { took: 4, counted: { party: 4, foes: 0, foesInduced: 4 } });
    // The Wizard's own acid on the Cleric, then the foe's stronger acid: the higher applies, and it's the foe's; a weaker one after changes nothing.
    applyDamage(state, cleric, persistent("acid", 2), { source: wizard });
    applyDamage(state, cleric, persistent("acid", 6), { source: monster });
    applyDamage(state, cleric, persistent("acid", 1), { source: wizard });
    assert.deepEqual(tick(cleric), { took: 6, counted: { party: 0, foes: 6, foesInduced: 0 } });
    // Persistent damage the fight began with (no one's): counted for no one.
    fighter.persistent.push({ type: "cold", dice: 0, die: 0, bonus: 0, multiplier: 1, amount: 3 });
    assert.deepEqual(tick(fighter), { took: 3, counted: { party: 0, foes: 0, foesInduced: 0 } });
});
