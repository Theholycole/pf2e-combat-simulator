import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { martialParty, moderateCreature } from "../src/engine/benchmarks.js";
import { addBuiltin } from "../src/engine/abilities.js";
import { activateSummons, asReserve, bestOption, bestPick, summonSpec, summonTurnStart } from "../src/engine/summons.js";

// Summons in the simulation (2026-10-13, B298; the user's call): the ability module's conjure plans for creatures that fight.
const conjure = (extra) => ({ builtin: "conjure", actions: 2, creatures: [{ name: "Test Wolf", count: 2, size: null, stats: null, from: { name: "Test Wolf" } }], lasts: null, notes: [], ...extra });

test("summon entries from conjure plans: the creature found, options and picks, uses, triggers; merges and markers not played (B298)", () => {
    const wolves = summonSpec(conjure(), "Call Wolves");
    assert.deepEqual([wolves.creature.from, wolves.count, wolves.perUse, wolves.uses, wolves.initiative, wolves.trigger], [{ name: "Test Wolf" }, 2, 2, 2, "minion", undefined]);
    const horn = summonSpec(conjure({ actions: 0, trigger: { event: "death", reaction: true }, creatures: [{ name: "Wight", count: { formula: "1d4" }, from: { uuid: "Compendium.pf2e.pathfinder-monster-core.Actor.x" }, initiative: "roll" }], notes: ["Move each one onto a corpse."] }), "Final Horn");
    assert.deepEqual([horn.trigger, horn.perUse, horn.uses, horn.initiative], [{ event: "death" }, 4, 1, "roll"]);
    const pair = summonSpec(conjure({ creatures: [], options: [{ label: "A", creatures: [{ name: "A", count: 1, from: { name: "A" } }] }, { label: "B", creatures: [{ name: "B", count: 3, from: { name: "B" } }] }], notes: ["Once a day."], lasts: { value: 10, unit: "minutes" } }), "Raise");
    assert.deepEqual([pair.creature.options.length, pair.perUse, pair.uses, pair.lasts], [2, 3, 1, 100]);
    assert.equal(summonSpec(conjure({ sustained: true, notes: ["Sustained, up to the time."] }), "Guardian").sustained, true);
    // Not played: a merge, and creatures with only numbers (markers, entities).
    assert.equal(summonSpec(conjure({ merge: { count: 9 } }), "Gestalt"), null);
    assert.equal(summonSpec(conjure({ creatures: [{ name: "Probe", count: 6, stats: { ac: 26, hp: 1 }, from: null }] }), "Probes"), null);
    // The best of the options and of a pick.
    assert.equal(bestOption([{ index: 0, level: 3, count: 1 }, { index: 1, level: 2, count: 3 }]), 1);
    const entries = [{ uuid: "a", name: "Eel", level: 0, traits: ["animal", "aquatic"], type: "npc" }, { uuid: "b", name: "Ray", level: 1, traits: ["animal", "aquatic"], type: "npc" }, { uuid: "c", name: "Wolf", level: 1, traits: ["animal"], type: "npc" }];
    assert.equal(bestPick(entries, { any: ["animal"], all: ["aquatic"], maxLevel: 1 }).uuid, "b");
    assert.equal(bestPick(entries, { any: ["fey"], rank: { base: 1, max: 7 } }), null);
});

// A summoner with its reserves: a creature of its side's level, two wolves waiting off the field.
function summoner(plan, name, { level = 5, wolfLevel = 3 } = {}) {
    const maker = { ...moderateCreature(level, "summoner", "Summoner"), side: "foes" };
    assert.ok(addBuiltin(maker, plan, name));
    const entry = maker.summons[0];
    const reserves = [];
    for (let index = 0; index < 2; index++) {
        const reserve = asReserve({ ...moderateCreature(wolfLevel, "wolf", "Wolf"), side: "foes" }, maker, entry, index);
        entry.reserveIds.push(reserve.id);
        reserves.push(reserve);
    }
    return { maker, reserves };
}

test("a summon in a fight: its creatures come off the field and fight, minions right after their maker with two actions (B298)", () => {
    const { maker, reserves } = summoner(conjure(), "Call Wolves");
    let used = 0;
    let acted = 0;
    for (let seed = 1; seed <= 6; seed++) {
        const { log } = simulate({ combatants: [...martialParty(5), maker, ...reserves] }, {}, seed, { log: true });
        if (log.some((line) => / uses Call Wolves: Summoner's Wolf 1, Summoner's Wolf 2 come$/.test(line))) used++;
        if (log.some((line) => /^Summoner's Wolf \d \(/.test(line))) acted++;
    }
    assert.ok(used >= 3, `summoned in ${used} of 6`);
    assert.equal(acted, used);
    // Straight after its maker in the turns, with two actions.
    const state = createFightState({ combatants: [...martialParty(5), maker, ...reserves] }, {}, 1);
    const fighting = state.byId.get(maker.id);
    const [first] = activateSummons(state, fighting, fighting.summons[0]);
    assert.equal(state.order[state.order.indexOf(fighting.id) + 1], first.id);
    first.actionsLeft = 3;
    summonTurnStart(state, first);
    assert.equal(first.actionsLeft, 2);
    // Its uses are the fighting creature's, not the snapshot's: a second fight starts with them all.
    assert.equal(createFightState({ combatants: [...martialParty(5), maker, ...reserves] }, {}, 2).byId.get(maker.id).summonUses, undefined);
});

test("a summon as its maker dies, its creatures rolling initiative; a sustained one costs its maker an action; their time ends (B298)", () => {
    const { maker, reserves } = summoner(conjure({ actions: 0, trigger: { event: "death", reaction: true }, creatures: [{ name: "Wolf", count: 2, from: { name: "Wolf" }, initiative: "roll" }] }), "Last Howl", { level: 1, wolfLevel: 1 });
    let howled = 0;
    for (let seed = 1; seed <= 4; seed++) {
        const { log } = simulate({ combatants: [...martialParty(5), maker, ...reserves] }, {}, seed, { log: true });
        const dies = log.findIndex((line) => /^ {2}Summoner dies$/.test(line));
        if (dies >= 0 && / uses Last Howl: .* come and roll initiative$/.test(log[dies + 1] ?? "")) howled++;
    }
    assert.equal(howled, 4);
    const sustained = summoner(conjure({ notes: ["Sustained, up to the time."], lasts: { value: 1, unit: "minutes" } }), "Guardian");
    const state = createFightState({ combatants: [...martialParty(5), sustained.maker, ...sustained.reserves] }, {}, 1);
    const sustaining = state.byId.get(sustained.maker.id);
    const coming = activateSummons(state, sustaining, sustaining.summons[0]);
    sustaining.actionsLeft = 3;
    summonTurnStart(state, sustaining);
    assert.equal(sustaining.actionsLeft, 2);
    state.round += 10;
    summonTurnStart(state, sustaining);
    assert.ok(coming.every((c) => c.vanished && !state.order.includes(c.id)));
});
