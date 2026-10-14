import test from "node:test";
import assert from "node:assert/strict";

import { benchmarkEncounter } from "../src/engine/benchmarks.js";
import { levelDC } from "../src/engine/checks.js";
import { mergeMoraleRules } from "../src/engine/morale-rules.js";
import { emptyMemory, liveAccept, liveMoraleApply, liveMoraleChecks, liveNoQuarter, liveRout } from "../src/live/morale.js";
import { allRolled, createMoraleCard, moraleCardHTML, noQuarterCardHTML, outcomeLine, outcomeOps, readModifiers, readTotal, recordMoraleRoll, routCardHTML, rowTotal, settleYield, toggleModifier } from "../src/live/morale-card.js";

// (The HP-share gate, M28: these encounters open and shut it by HP alone.)
const rules = mergeMoraleRules({ gateMode: "hpShare" });

// Level 5 party against four level-5 foes, as it stands now: changes by id ({ hp, conditions, status, gone }).
function encounter(changes = {}) {
    const base = benchmarkEncounter(5, "extreme");
    return {
        ...base,
        combatants: base.combatants
            .filter((c) => !changes[c.id]?.gone)
            .map((c) => {
                const change = changes[c.id];
                if (!change) return c;
                return { ...c, hp: { ...c.hp, value: change.hp ?? c.hp.value }, conditions: { ...(c.conditions ?? {}), ...(change.conditions ?? {}) }, ...(change.status ? { status: change.status } : {}) };
            })
    };
}

const look = (snapshot, memory, round = 1, turnStart = null) => liveMoraleChecks({ snapshot, memory, round, turnStart, rules });

test("in play: the first look only takes note; a quarter of the foes falling brings one card for the others", () => {
    const first = look(encounter(), emptyMemory());
    assert.deepEqual(first.checks, []);
    assert.equal(Object.keys(first.memory.roster).length, 4);
    // Foe 1 drops; the party is unhurt, so it's clearly ahead (the gate is open).
    const dropped = look(encounter({ foe1: { hp: 0 } }), first.memory);
    assert.equal(dropped.checks.length, 1);
    assert.equal(dropped.checks[0].reason, "quarterFallen");
    assert.deepEqual(dropped.checks[0].rows.map((row) => row.id).sort(), ["foe2", "foe3", "foe4"]);
    assert.equal(dropped.checks[0].rows[0].dc, levelDC(5));
    assert.ok(dropped.checks[0].rows[0].parts.some((part) => part.id === "sideLost25"));
    // Nothing new: no card. Another falls the same round: each has had its check this round.
    assert.deepEqual(look(encounter({ foe1: { hp: 0 } }), dropped.memory).checks, []);
    const again = look(encounter({ foe1: { hp: 0 }, foe2: { hp: 0 } }), dropped.memory);
    assert.deepEqual(again.checks, []);
    assert.equal(again.memory.flags.halfStrength, true, "the crossing is spent all the same");
    // Next round, the third falls: a companion after half had fallen (found first, as in the simulator); a quarter left.
    const later = look(encounter({ foe1: { hp: 0 }, foe2: { hp: 0 }, foe3: { hp: 0 } }), again.memory, 2);
    assert.deepEqual(later.checks.map((check) => [check.reason, check.rows.map((row) => row.id)]), [["companionAfterHalf", ["foe4"]]]);
    assert.equal(later.memory.flags.quarterStrength, true);
});

test("in play: the gate holds checks back while the party isn't clearly ahead; fear and fleeing count anyway", () => {
    const hurt = { fighter: { hp: 5 }, champion: { hp: 5 }, ranger: { hp: 5 }, rogue: { hp: 5 } };
    const first = look(encounter(hurt), emptyMemory());
    assert.deepEqual(look(encounter({ ...hurt, foe1: { hp: 0 } }), first.memory).checks, [], "a quarter fallen, but the party is losing");
    const scared = look(encounter({ ...hurt, foe2: { conditions: { frightened: 2 } } }), first.memory);
    assert.deepEqual(scared.checks.map((check) => [check.reason, check.rows.map((row) => row.id)]), [["frightenedByEnemy", ["foe2"]]]);
    // Fleeing: as it starts, and again as its turn starts the next round while it lasts.
    const flees = look(encounter({ ...hurt, foe3: { conditions: { fleeing: true } } }), first.memory);
    assert.deepEqual(flees.checks.map((check) => check.reason), ["fleeing"]);
    const turn = look(encounter({ ...hurt, foe3: { conditions: { fleeing: true } } }), flees.memory, 2, "foe3");
    assert.deepEqual(turn.checks.map((check) => [check.reason, check.rows.map((row) => row.id)]), [["fleeing", ["foe3"]]]);
});

test("in play: a foe that leaves the tracker counts as fallen; a solo boss's first check holds without a roll", () => {
    const first = look(encounter(), emptyMemory());
    const gone = look(encounter({ foe1: { gone: true } }), first.memory);
    assert.equal(gone.checks[0]?.reason, "quarterFallen");
    const solo = benchmarkEncounter(5, "severeBoss");
    const bossFirst = liveMoraleChecks({ snapshot: solo, memory: emptyMemory(), round: 1, rules });
    // The party far ahead on HP share (3×): retreat becomes reasonable, but not for a solo boss; frightened 2 is.
    const scared = { ...solo, combatants: solo.combatants.map((c) => (c.side === "foes" ? { ...c, conditions: { frightened: 2 } } : c)) };
    const check = liveMoraleChecks({ snapshot: scared, memory: bossFirst.memory, round: 1, rules });
    assert.equal(check.checks[0].rows[0].bossHolds, true);
});

test("in play: applying results — giving up is final, fear only shakes, a fanatic's first failure holds", () => {
    const first = look(encounter(), emptyMemory());
    const dropped = look(encounter({ foe1: { hp: 0 } }), first.memory);
    const snapshot = encounter({ foe1: { hp: 0 } });
    const applied = liveMoraleApply({ snapshot, memory: dropped.memory, round: 1, rules, rows: [{ id: "foe2", reason: "quarterFallen", degree: 1 }, { id: "foe3", reason: "quarterFallen", degree: 3 }, { id: "foe4", reason: "frightenedByEnemy", degree: 1 }] });
    const byId = Object.fromEntries(applied.results.map((result) => [result.id, result.outcome]));
    assert.equal(byId.foe2.kind, "giveUp");
    assert.equal(byId.foe3.kind, "steady");
    assert.equal(byId.foe4.kind, "frighten");
    assert.equal(applied.memory.creatures.foe2.broken, true);
    assert.ok(!applied.memory.creatures.foe4.broken);
    // Once given up, it never checks again.
    const later = look(encounter({ foe1: { hp: 0 }, foe3: { hp: 0 } }), applied.memory, 2);
    assert.ok(!later.checks.some((check) => check.rows.some((row) => row.id === "foe2")));
    // A fanatic ignores its first failure.
    const fanatic = encounter({ foe1: { hp: 0 } });
    fanatic.combatants = fanatic.combatants.map((c) => (c.id === "foe2" ? { ...c, morale: { template: "fanatical" } } : c));
    const held = liveMoraleApply({ snapshot: fanatic, memory: dropped.memory, round: 1, rules, rows: [{ id: "foe2", reason: "quarterFallen", degree: 1 }] });
    assert.equal(held.results[0].outcome.kind, "holds");
    assert.equal(held.memory.creatures.foe2.ignoredFirstFailure, true);
});

test("in play: the rout — half the surviving foes broken, those who gave up and the fleeing included", () => {
    const memory = { ...emptyMemory(), roster: { foe1: { name: "Foe 1" }, foe2: { name: "Foe 2" }, foe3: { name: "Foe 3" }, foe4: { name: "Foe 4" } }, creatures: { foe2: { broken: true } } };
    // Foe 1 dead, Foe 2 surrendered (defeated), Foe 3 fleeing from a spell, Foe 4 fighting: 2 broken of 3 survivors.
    const rout = liveRout({ snapshot: encounter({ foe1: { hp: 0 }, foe2: { status: "dead" }, foe3: { conditions: { fleeing: true } } }), memory, rules });
    assert.deepEqual(rout, { routs: true, rest: ["foe4"] });
    assert.equal(liveRout({ snapshot: encounter({ foe1: { hp: 0 } }), memory: { ...memory, creatures: {} }, rules }).routs, false);
});

test("the morale card: a row per foe, tick boxes, Roll and Apply, what Apply does", () => {
    const check = { reason: "quarterFallen", rows: [{ id: "foe2", name: "Foe 2", dc: 20, will: 12, parts: [{ id: "sideLost25", value: -2 }, { id: "undamaged", value: 2 }], template: "bestial" }, { id: "boss", name: "Boss", bossHolds: true }] };
    let card = createMoraleCard({ rules, combatId: "c1", round: 1, check, who: { foe2: { actorUuid: "Actor.a", tokenUuid: "Scene.s.Token.t" } } });
    assert.equal(card.reasonLabel, rules.triggers.quarterFallen.label);
    const row = card.rows[0];
    assert.equal(rowTotal(row), 0);
    // The GM's calls are offered unticked: defending home, no retreat, and a bestial lair.
    assert.deepEqual(row.modifiers.filter((modifier) => !modifier.on).map((modifier) => modifier.id), ["defendingHome", "noRetreat", "template.bestial.lair"]);
    card = toggleModifier(card, "foe2", "noRetreat");
    assert.equal(rowTotal(card.rows[0]), 2);
    assert.equal(allRolled(card), false);
    const html = moraleCardHTML(card);
    assert.match(html, /data-sim-morale="roll"/);
    assert.match(html, /Boss Resolve: holds/);
    assert.match(html, /data-sim-morale="apply" disabled/);
    card = recordMoraleRoll(card, "foe2", { total: 17, natural: 5, degree: 1 });
    assert.equal(allRolled(card), true);
    assert.doesNotMatch(moraleCardHTML(card), /data-sim-morale="apply" disabled/);
    assert.deepEqual(outcomeOps({ kind: "giveUp", how: "rout" }), [{ op: "condition", slug: "fleeing" }, { op: "frightened", atLeast: 2 }]);
    assert.deepEqual(outcomeOps({ kind: "giveUp", how: "collapse" }), [{ op: "surrender" }]);
    assert.deepEqual(outcomeOps({ kind: "frighten" }), [{ op: "frightened", delta: 1, max: 4 }]);
    assert.deepEqual(outcomeOps({ kind: "holds" }), []);
    assert.match(outcomeLine("Foe 2", { kind: "giveUp", how: "collapse" }), /surrenders/);
});

test("in play, Read the fight (M38): each row also rolls Perception; a held check with a successful read yields or leaves", () => {
    const reading = mergeMoraleRules({ gateMode: "hpShare", readTheFight: { enabled: true } });
    const first = liveMoraleChecks({ snapshot: encounter(), memory: emptyMemory(), round: 1, rules: reading });
    const dropped = liveMoraleChecks({ snapshot: encounter({ foe1: { hp: 0 } }), memory: first.memory, round: 1, rules: reading });
    const row = dropped.checks[0].rows.find((each) => each.id === "foe2");
    assert.equal(row.read.dc, levelDC(5));
    assert.ok(row.read.signs.includes("sideLost25"));
    // The card: the ticked losing signs, turned into Perception bonuses (a quarter fallen: −4 to morale, +4 here).
    const card = createMoraleCard({ rules: reading, combatId: "c", round: 1, check: dropped.checks[0] });
    const cardRow = card.rows.find((each) => each.id === "foe2");
    assert.deepEqual(readModifiers(cardRow).map((modifier) => [modifier.id, modifier.value]), [["sideLost25", 4]]);
    assert.equal(readTotal(toggleModifier(card, "foe2", "sideLost25").rows.find((each) => each.id === "foe2")), 0);
    assert.match(moraleCardHTML(card), /Roll Will \(−\d+\) and Perception \(\+4\)/);
    const rolled = recordMoraleRoll(card, "foe2", { total: 25, natural: 12, degree: 2, read: { total: 26, natural: 13, degree: 2 } });
    assert.match(moraleCardHTML(rolled), /25: success · Perception 26: success/);
    // Apply: held and read → yields (benchmark foes are humanoids without a language list: they talk).
    const applied = liveMoraleApply({ snapshot: encounter({ foe1: { hp: 0 } }), memory: dropped.memory, round: 1, rules: reading, rows: [{ id: "foe2", reason: "quarterFallen", degree: 2, readDegree: 2 }, { id: "foe3", reason: "quarterFallen", degree: 2, readDegree: 1 }] });
    assert.deepEqual(applied.results.map((result) => [result.id, result.outcome.kind]), [["foe2", "yields"], ["foe3", "holds"]]);
    assert.equal(applied.memory.creatures.foe2.yielding, true);
    assert.equal(applied.memory.creatures.foe2.broken, true);
    assert.deepEqual(outcomeOps({ kind: "yields" }), [{ op: "marker", slug: "yielding-morale", name: "Yielding" }]);
    assert.deepEqual(outcomeOps({ kind: "leaves" }).map((op) => op.op), ["condition", "marker"]);
    assert.match(outcomeLine("Foe 2", { kind: "yields" }), /yields\. Accept or refuse below/);
    // One that can't talk leaves.
    const mute = encounter({ foe1: { hp: 0 } });
    mute.combatants = mute.combatants.map((c) => (c.id === "foe3" ? { ...c, languages: [] } : c));
    const leaves = liveMoraleApply({ snapshot: mute, memory: dropped.memory, round: 1, rules: reading, rows: [{ id: "foe3", reason: "quarterFallen", degree: 3, readDegree: 3 }] });
    assert.equal(leaves.results[0].outcome.kind, "leaves");
    assert.equal(leaves.memory.creatures.foe3.leaving, true);
});

test("in play, surrender offers (M38): Accept, Refuse, and no quarter for it and the allies who saw", () => {
    const card = { ...createMoraleCard({ rules, combatId: "c", round: 1, check: { reason: "quarterFallen", rows: [] } }), status: "applied", yields: [{ id: "foe2", name: "Foe 2", status: "open" }] };
    assert.match(moraleCardHTML(card), /data-sim-morale="accept"/);
    assert.match(moraleCardHTML(settleYield(card, "foe2", "refused")), /refused: no quarter/);
    const memory = { ...emptyMemory(), creatures: { foe2: { yielding: true, broken: true }, foe3: { checkedRound: 1 } } };
    assert.deepEqual(liveAccept(memory, "foe2").creatures.foe2, { yielding: false, broken: true });
    const refused = liveNoQuarter(memory, ["foe2", "foe3"]);
    assert.deepEqual(refused.creatures.foe2, { yielding: false, leaving: false, broken: false, toTheDeath: true });
    assert.equal(refused.creatures.foe3.toTheDeath, true);
    assert.match(noQuarterCardHTML({ name: "Foe 2", cause: "refused", allies: [{ id: "foe3", name: "Foe 3" }] }), /Foe 2 and the ally who saw \(Foe 3\) fight to the death: the party refused its surrender/);
    // Those fighting to the death make no more checks, and don't flee with a rout.
    const first = look(encounter(), emptyMemory());
    const marked = liveNoQuarter(first.memory, ["foe2"]);
    const dropped = look(encounter({ foe1: { hp: 0 } }), marked);
    assert.ok(!dropped.checks[0].rows.some((row) => row.id === "foe2"));
    const given = { ...marked, creatures: { ...marked.creatures, foe3: { broken: true }, foe4: { broken: true } } };
    const rout = liveRout({ snapshot: encounter({ foe1: { hp: 0 } }), memory: given, rules });
    assert.equal(rout.routs, true);
    assert.deepEqual(rout.rest, []);
});

test("in play: the rout card names the rules' share (M37: a third)", () => {
    assert.match(routCardHTML({ rest: [{ id: "foe4", name: "Foe 4" }], fraction: 0.33 }), /A third or more of the surviving foes are broken: the rest flee \(Foe 4\)/);
    assert.match(routCardHTML({ rest: [] }), /Half or more of the surviving foes are broken/);
});

test("in play, the strength gate (M39, the default): HP × damage per round, counted live", () => {
    const defaults = mergeMoraleRules({});
    const first = liveMoraleChecks({ snapshot: encounter(), memory: emptyMemory(), round: 1, rules: defaults });
    // One foe falls, the rest barely hurt: the foes still hit as hard, not 3.5× behind yet.
    const close = liveMoraleChecks({ snapshot: encounter({ foe1: { hp: 0 } }), memory: first.memory, round: 1, rules: defaults });
    assert.deepEqual(close.checks, []);
    // The rest at a tenth of their HP: far behind, so the next fall brings a card.
    const low = { foe2: { hp: 8 }, foe3: { hp: 8 }, foe4: { hp: 8 } };
    const later = liveMoraleChecks({ snapshot: encounter({ foe1: { hp: 0 }, ...low, foe2: { hp: 0 } }), memory: close.memory, round: 2, rules: defaults });
    assert.ok(later.checks.length > 0, "a card once the party is far ahead");
});
