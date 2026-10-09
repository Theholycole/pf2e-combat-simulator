import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { createFightState, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { interact, performStrike, stride } from "../src/engine/actions.js";
import { DOWN, canMove, gripPenalty, offGuardTo, strikeUsable } from "../src/engine/combatant.js";
import { applyAuras, canCast, castSpell, expireTimers, spellExpectation, targetSets } from "../src/engine/spells.js";

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
        breath: monster("Adamantine Dragon (Adult)", "Avalanche Breath"),
        captivating: monster("Mirage Dragon (Adult)", "Captivating Display"),
        frightening: monster("Gorilla", "Frightening Display")
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

// A level-5 foe with a sword in hand and a fist, every defence DC 20.
function swordsman() {
    const base = moderateCreature(5, "foe", "Foe");
    return {
        ...base,
        engagement: 1,
        saves: { fortitude: 10, reflex: 10, will: 10 },
        perception: 10,
        strikes: [{ ...base.strikes[0], name: "Longsword", held: true }, { ...base.strikes[0], name: "Fist", bonus: base.strikes[0].bonus - 4, held: false }]
    };
}
const cast = (state, c) => scoreOptions(state, c).options.filter((option) => option.action.type === "cast");

test("Disarm: a success weakens the grip (-2, +2 to the next Disarm), a critical success drops the weapon; it's picked up again", { skip }, async () => {
    const { basic } = await abilities();
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, skills: { athletics: 18 }, spells: [entry("Disarm", basic.disarm, "basic")] }, swordsman()] });
    state.rng.d20 = () => 10;
    const pc = state.byId.get("fighter");
    const foe = state.byId.get("foe");
    const [sword, fist] = foe.strikes;
    const [first] = spellExpectation(state, pc, pc.spells[0], [foe]);
    assert.ok(first.worth > 0, "worth something against a weapon in hand");
    // 10 + 18 = 28 against Reflex DC 20: a success.
    castSpell(state, pc, 0, ["foe"]);
    assert.equal(gripPenalty(foe, sword), 2);
    assert.equal(gripPenalty(foe, fist), 0);
    assert.equal(pc.attacksThisTurn, 1, "Disarm has the attack trait");
    foe.actionsLeft = 3;
    assert.ok(scoreOptions(state, foe).options.some((option) => option.action.type === "interact" && option.action.what === "regrip"));
    // The same 28 against DC 20 - 2: a critical success.
    pc.attacksThisTurn = 0;
    castSpell(state, pc, 0, ["foe"]);
    assert.equal(strikeUsable(foe, sword), false, "dropped");
    assert.equal(gripPenalty(foe, sword), 0, "a dropped weapon has no grip to weaken");
    assert.equal(strikeUsable(foe, fist), true);
    const [none] = spellExpectation(state, pc, pc.spells[0], [foe]);
    assert.equal(none.worth, 0, "nothing left in hand: the fist can't be disarmed");
    assert.ok(scoreOptions(state, foe).options.some((option) => option.action.type === "interact" && option.action.what === "pickup"));
    interact(state, foe, "pickup", "Longsword");
    assert.equal(strikeUsable(foe, sword), true);
});

test("Feint: off-guard to the feinter's melee attacks only; one attack on a success; the feinter on a critical failure", { skip }, async () => {
    const { basic } = await abilities();
    const [fighter, champion] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1, skills: { deception: 20 }, spells: [entry("Feint", basic.feint, "basic")] }, { ...champion, engagement: 1 }, swordsman()] });
    state.rng.d20 = () => 10;
    state.round = 1;
    const pc = state.byId.get("fighter");
    const other = state.byId.get("champion");
    const foe = state.byId.get("foe");
    pc.actionsLeft = 3;
    assert.ok(cast(state, pc).some((option) => option.action.targetIds?.[0] === "foe"), "Feint is on offer in melee");
    // 30 against Perception DC 20: a critical success, until the end of the fighter's next turn.
    castSpell(state, pc, 0, ["foe"]);
    assert.equal(pc.attacksThisTurn, 0, "Feint has no attack trait");
    assert.equal(offGuardTo(foe, pc, true), true);
    assert.equal(offGuardTo(foe, pc, false), false, "not to ranged attacks");
    assert.equal(offGuardTo(foe, other, true), false, "not to anyone else");
    expireTimers(state, pc, "end");
    assert.equal(offGuardTo(foe, pc, true), true, "still this turn and the next");
    state.round = 2;
    expireTimers(state, pc, "end");
    assert.equal(offGuardTo(foe, pc, true), false);
    // 20 against 20: a success, for the next melee attack only.
    pc.skills.deception = 10;
    castSpell(state, pc, 0, ["foe"]);
    assert.deepEqual(foe.offGuardTo.map((entry) => entry.uses), [1]);
    performStrike(state, pc, foe, pc.strikes[0]);
    assert.equal(offGuardTo(foe, pc, true), false, "used up");
    // 0 against 20: a critical failure; the fighter is off-guard to the foe's melee attacks.
    pc.skills.deception = -10;
    castSpell(state, pc, 0, ["foe"]);
    assert.equal(offGuardTo(pc, foe, true), true);
    assert.equal(offGuardTo(foe, pc, true), false);
});

test("Create a Diversion: each watcher whose Perception DC it beats is off-guard to the next attack; one try per creature", { skip }, async () => {
    const { basic } = await abilities();
    const [, , , rogue] = martialParty(5);
    const sharp = { ...swordsman(), id: "sharp", name: "Sharp", perception: 25 };
    const state = createFightState({ combatants: [{ ...rogue, engagement: 1, skills: { deception: 15 }, spells: [entry("Create a Diversion", basic["create-a-diversion"], "basic")] }, swordsman(), sharp] });
    state.rng.d20 = () => 10;
    const pc = state.byId.get("rogue");
    const foe = state.byId.get("foe");
    pc.actionsLeft = 3;
    const option = cast(state, pc)[0];
    assert.deepEqual(option?.action.targetIds?.sort(), ["foe", "sharp"], "everyone around it at once");
    // 25 against DCs 20 and 35.
    castSpell(state, pc, 0, ["foe", "sharp"]);
    assert.deepEqual(foe.offGuardTo, [{ attacker: "rogue", attacks: "any", uses: 1 }]);
    assert.equal(state.byId.get("sharp").offGuardTo?.length ?? 0, 0);
    assert.equal(cast(state, pc).length, 0, "both now know the trick");
});

test("Administer First Aid: stabilizes a dying ally on a success; dying +1 on a critical failure", { skip }, async () => {
    const { basic } = await abilities();
    const [fighter, champion] = martialParty(5);
    const state = createFightState({ combatants: [{ ...champion, skills: { medicine: 11 }, spells: [entry("Administer First Aid", basic["administer-first-aid"], "basic")] }, fighter, swordsman()] });
    state.rng.d20 = () => 10;
    const medic = state.byId.get("champion");
    const pc = state.byId.get("fighter");
    medic.actionsLeft = 3;
    assert.equal(cast(state, medic).length, 0, "nobody is dying");
    Object.assign(pc, { status: DOWN, band: "near" });
    pc.hp.value = 0;
    pc.cond.dying = 1;
    pc.cond.unconscious = true;
    const option = cast(state, medic)[0];
    assert.deepEqual(option?.action.targetIds, ["fighter"]);
    const [aid] = spellExpectation(state, medic, medic.spells[0], [pc]);
    assert.ok(aid.benefit > 0);
    // 21 against 5 + 15 + dying 1: a success.
    castSpell(state, medic, 0, ["fighter"]);
    assert.deepEqual([pc.status, pc.cond.dying, pc.stable, pc.cond.unconscious], [DOWN, 0, true, true]);
    // 1 against 21: a critical failure.
    pc.cond.dying = 1;
    pc.stable = false;
    medic.skills.medicine = -9;
    castSpell(state, medic, 0, ["fighter"]);
    assert.equal(pc.cond.dying, 2);
});

test("an area ability's temporary immunity keeps creatures out of its next use, after the results it names", { skip }, async () => {
    const { captivating, frightening } = await abilities();
    const run = (plan, natural) => {
        const party = martialParty(8).map((pc) => ({ ...pc, engagement: 1 }));
        const state = createFightState({ combatants: [...party, { ...moderateCreature(10, "m", "Monster"), engagement: 1, spells: [entry("Display", plan)] }] });
        state.rng.d20 = () => natural;
        const m = state.byId.get("m");
        const pcs = () => targetSets(state, m, m.spells[0], { enemies: state.list.filter((c) => c.side === "party"), inMelee: () => true, distance: () => 5, meleeId: m.meleeId }).flatMap((set) => set.targets.filter((c) => c.side === "party").map((c) => c.id));
        const before = pcs();
        castSpell(state, m, 0, before);
        return { before, after: pcs() };
    };
    // Captivating Display: immune for 1 minute whatever the result (before, an area reached them again).
    const captivated = run(captivating, 10);
    assert.equal(captivated.before.length, 4);
    assert.deepEqual(captivated.after, []);
    // Frightening Display: immune only after a critical success.
    assert.equal(run(frightening, 2).after.length, 4, "after failures it can display again");
    assert.deepEqual(run(frightening, 20).after, [], "after critical successes they're immune");
});

