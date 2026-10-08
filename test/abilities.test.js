import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { createFightState, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { performStrike, stride } from "../src/engine/actions.js";
import { canMove } from "../src/engine/combatant.js";
import { applyAuras, canCast, castSpell, expireTimers, spellExpectation } from "../src/engine/spells.js";

// Abilities compiled by the ability module from PF2e's own packs (read only).
const ABILITIES = "../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js";
const PACKS = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const available = existsSync(new URL(ABILITIES, import.meta.url)) && existsSync(`${PACKS}/actions`) && existsSync(`${PACKS}/pathfinder-monster-core`);
const skip = !available && "the ability module or PF2e's packs not found";

let compiled = null;
async function abilities() {
    if (compiled) return compiled;
    const { readDocuments } = await import("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs");
    const { compileBasicActions, compileMonsterAbility } = await import(ABILITIES);
    const basicActions = compileBasicActions(readDocuments(`${PACKS}/actions`).filter((doc) => doc.collection === "items"));
    const npcs = readDocuments(`${PACKS}/pathfinder-monster-core`).filter((doc) => doc.collection === "actors" && doc.type === "npc");
    const monster = (creature, name) => compileMonsterAbility(npcs.find((npc) => npc.name === creature).items.find((item) => item.name.startsWith(name)), { basicActions });
    compiled = {
        basic: basicActions,
        grab: monster("Giant Anaconda", "Grab"),
        improvedGrab: monster("Tor Linnorm", "Improved Grab"),
        constrict: monster("Sargassum Heap", "Constrict"),
        presence: monster("Adamantine Dragon (Adult)", "Frightful Presence"),
        breath: monster("Adamantine Dragon (Adult)", "Avalanche Breath")
    };
    return compiled;
}
const entry = (name, plan, kind = "ability") => ({ name, plan, castRank: 1, dc: null, attack: null, pool: null, kind });

// A level-5 constrictor: Jaws with Grab, then Constrict.
function constrictor(list, extra = {}) {
    const base = moderateCreature(5, "snake", "Snake");
    return {
        ...base,
        skills: { athletics: 14 },
        strikes: [{ ...base.strikes[0], name: "Jaws", attackEffects: ["grab"], bonus: 30 }],
        spells: list,
        engagement: 1,
        ...extra
    };
}

test("Grab: after a hit, the next action can grapple; the target is held until the end of the snake's next turn", { skip }, async () => {
    const { grab, basic } = await abilities();
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, spells: [entry("Escape", basic.escape, "basic")] }, constrictor([entry("Grab", grab)])] });
    const snake = state.byId.get("snake");
    const pc = state.byId.get("fighter");
    snake.round = 1;
    snake.actionsLeft = 2;
    performStrike(state, snake, pc, snake.strikes[0]);
    assert.deepEqual(snake.riderReady, { index: 0, targetId: "fighter" });
    const best = scoreOptions(state, snake).options.filter((option) => option.action.type === "cast");
    assert.equal(best[0]?.action.rider, true, "Grab is on offer as the next action");
    pc.saves = { ...pc.saves, fortitude: -40 };
    castSpell(state, snake, 0, ["fighter"]);
    assert.ok(pc.cond.grabbed || pc.cond.restrained);
    assert.equal(pc.grabbedBy, "snake");
    assert.equal(canMove(pc), false);
    // It lasts through the start of the snake's next turn, and ends at its end.
    state.round = 2;
    expireTimers(state, snake, "start");
    assert.ok(pc.cond.grabbed || pc.cond.restrained);
    expireTimers(state, snake, "end");
    assert.ok(!pc.cond.grabbed && !pc.cond.restrained && pc.grabbedBy === null);
});

test("the grabbed creature can Escape; the grabber lets go when it moves", { skip }, async () => {
    const { grab, basic } = await abilities();
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, skills: { athletics: 60 }, spells: [entry("Escape", basic.escape, "basic")] }, constrictor([entry("Grab", grab)])] });
    const snake = state.byId.get("snake");
    const pc = state.byId.get("fighter");
    pc.cond.grabbed = true;
    pc.grabbedBy = "snake";
    pc.actionsLeft = 3;
    const escape = scoreOptions(state, pc).options.find((option) => option.action.type === "cast");
    assert.deepEqual(escape?.action.targetIds, ["snake"]);
    castSpell(state, pc, 0, ["snake"]);
    assert.equal(pc.cond.grabbed, false, "an Athletics of +60 always escapes");
    pc.cond.grabbed = true;
    pc.grabbedBy = "snake";
    stride(state, snake, { kind: "toNear" });
    assert.equal(pc.cond.grabbed, false);
});

test("Improved Grab is free at once; Constrict then hits whoever is held", { skip }, async () => {
    const { improvedGrab, constrict } = await abilities();
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, saves: { fortitude: -40, reflex: 0, will: 0 } }, constrictor([entry("Improved Grab", improvedGrab), entry("Constrict", constrict)])] });
    const snake = state.byId.get("snake");
    const pc = state.byId.get("fighter");
    snake.round = 1;
    performStrike(state, snake, pc, snake.strikes[0]);
    assert.ok(pc.cond.grabbed || pc.cond.restrained, "grabbed straight after the hit");
    snake.actionsLeft = 1;
    const constrictOption = scoreOptions(state, snake).options.find((option) => option.action.type === "cast" && option.action.spellIndex === 1);
    assert.deepEqual(constrictOption?.action.targetIds, ["fighter"]);
    const hp = pc.hp.value;
    castSpell(state, snake, 1, ["fighter"]);
    assert.ok(pc.hp.value < hp);
});

test("Trip and Demoralize: valued by the odds; Demoralize can't target the same creature twice", { skip }, async () => {
    const { basic } = await abilities();
    const [fighter] = martialParty(5);
    const foe = { ...moderateCreature(5, "foe", "Foe"), engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, skills: { athletics: 14, intimidation: 12 }, spells: [entry("Trip", basic.trip, "basic"), entry("Demoralize", basic.demoralize, "basic")] }, foe] });
    const pc = state.byId.get("fighter");
    const target = state.byId.get("foe");
    const [trip] = spellExpectation(state, pc, pc.spells[0], [target]);
    assert.ok(trip.worth > 0);
    pc.actionsLeft = 3;
    assert.ok(scoreOptions(state, pc).options.some((option) => option.action.type === "cast" && option.action.spellIndex === 1));
    castSpell(state, pc, 1, ["foe"]);
    assert.ok(!scoreOptions(state, pc).options.some((option) => option.action.type === "cast" && option.action.spellIndex === 1), "immune for 10 minutes");
    assert.equal(pc.attacksThisTurn, 0, "Demoralize has no attack trait");
    castSpell(state, pc, 0, ["foe"]);
    assert.equal(pc.attacksThisTurn, 1, "Trip does");
});

test("a breath weapon recharges; Frightful Presence frightens the party as the fight starts", { skip }, async () => {
    const { breath, presence } = await abilities();
    const dragon = { ...moderateCreature(12, "dragon", "Dragon"), spells: [entry("Avalanche Breath", breath), entry("Frightful Presence", presence)], band: "near" };
    const party = martialParty(5).map((pc) => ({ ...pc, band: "near", saves: { ...pc.saves, will: -40 } }));
    const state = createFightState({ combatants: [...party, dragon] });
    applyAuras(state);
    for (const pc of party) assert.equal(state.byId.get(pc.id).cond.frightened, 4, "critical failures");
    const c = state.byId.get("dragon");
    c.round = 1;
    assert.equal(canCast(c, c.spells[0]), true);
    castSpell(state, c, 0, party.map((pc) => pc.id));
    assert.equal(canCast(c, c.spells[0]), false, "recharging");
    c.round = 6;
    assert.equal(canCast(c, c.spells[0]), true, "at most 1d4 rounds");
});

test("Ferocity keeps a monster up once; whole fights with monster abilities run", { skip }, async () => {
    const { grab, constrict, basic } = await abilities();
    const [fighter] = martialParty(3);
    const boar = { ...moderateCreature(3, "boar", "Boar"), reactions: { ferocity: true }, engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, boar] });
    const c = state.byId.get("boar");
    const { dealDamage } = await import("../src/engine/actions.js");
    dealDamage(state, c, c.hp.value + 5);
    assert.deepEqual([c.status, c.hp.value, c.cond.wounded], ["active", 1, 1]);
    c.reactionUsed = false;
    dealDamage(state, c, c.hp.max * 3);
    assert.equal(c.status, "dead", "massive damage still kills");
    const party = martialParty(5).map((pc) => ({ ...pc, spells: Object.entries(basic).map(([name, plan]) => entry(name, plan, "basic")) }));
    // The creature-building table's own attack bonus (the other tests' +30 makes a second Strike worth more than Grab).
    const jaws = { ...moderateCreature(5, "x", "x").strikes[0], name: "Jaws", attackEffects: ["grab"] };
    const snapshot = { combatants: [...party, constrictor([entry("Grab", grab), entry("Constrict", constrict)], { engagement: undefined, strikes: [jaws] }), { ...moderateCreature(5, "brute", "Brute") }] };
    let grabs = 0;
    for (let seed = 1; seed <= 30; seed++) {
        const result = simulate(snapshot, {}, seed, { log: true });
        assert.ok(result.outcome);
        grabs += result.log.filter((line) => /casts Grab/.test(line)).length;
    }
    assert.ok(grabs > 0, "the snake grabs");
});
