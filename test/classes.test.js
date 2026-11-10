import test from "node:test";
import assert from "node:assert/strict";

import { CLASS_SLUGS, classPC, classParty, seatOf } from "../src/engine/classes.js";
import { standardParty } from "../src/engine/party.js";
import { createFightState, simulate } from "../src/engine/fight.js";
import { applyDamage } from "../src/engine/actions.js";
import { armorClass } from "../src/engine/combatant.js";
import { withCasterDamage } from "../src/engine/spells.js";
import { moderateCreature } from "../src/engine/benchmarks.js";
import { destroyBody, thrallBodies, thrallForSpell, thrallStrikes } from "../src/engine/thralls.js";

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
        assert.equal(party.length, slug === "summoner" ? 5 : 4);
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

test("the summoner's eidolon is its own body sharing the summoner's Hit Points; both drop together", () => {
    const party = classParty("summoner", 5, { spell: () => null });
    const eidolon = party.find((c) => c.id === "eidolon");
    assert.equal(eidolon.sharesHpWith, "summoner");
    assert.deepEqual([eidolon.actionsPerTurn, party.find((c) => c.id === "summoner").actionsPerTurn], [2, 2]);
    assert.equal(party.find((c) => c.id === "summoner").actTogether, true);
    const state = createFightState({ combatants: [...party.map((c) => ({ ...c, engagement: 1 })), { ...moderateCreature(5, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const summoner = state.byId.get("summoner");
    const body = state.byId.get("eidolon");
    applyDamage(state, body, [{ type: "fire", amount: 10, persistent: false, precision: false }], { source: state.byId.get("foe") });
    assert.equal(summoner.hp.value, summoner.hp.max - 10);
    applyDamage(state, body, [{ type: "fire", amount: 500, persistent: false, precision: false }], { source: state.byId.get("foe") });
    assert.ok(summoner.status !== "active" && body.status !== "active");
});

test("Sorcerous Potency adds the rank to a slot spell's damage on each creature once; Rage costs 1 AC", () => {
    const sorcerer = classPC("sorcerer", 5, { spell: fake });
    const changes = [{ op: "damage", target: "a", instances: [{ type: "fire", amount: 10 }, { type: "fire", amount: 3 }] }, { op: "damage", target: "a", instances: [{ type: "fire", amount: 4 }] }];
    const boosted = withCasterDamage(sorcerer, { name: "Fireball", castRank: 3, pool: "sorcerer:3:0", plan: { traits: [] } }, changes);
    assert.deepEqual(boosted.map((change) => change.instances[0].amount), [13, 4]);
    assert.equal(withCasterDamage(sorcerer, { name: "Ignition", castRank: 3, pool: null, plan: { traits: ["cantrip"] } }, changes), changes);
    const state = createFightState({ combatants: [{ ...classPC("barbarian", 3), engagement: 1 }, { ...moderateCreature(3, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const barbarian = state.byId.get("barbarian");
    const before = armorClass(barbarian);
    barbarian.activeBuffs = [barbarian.selfBuffs[0]];
    assert.equal(armorClass(barbarian), before - 1);
});

test("a necromancer's thralls: Create Thrall's command option for the first Strike, a thrall spent by Necrotic Bomb, Create Thrall first with none; thralls as bodies", () => {
    const necromancer = classPC("necromancer", 9, { spell: fake });
    const thrall = necromancer.strikes.find((strike) => strike.thrall);
    assert.deepEqual([thrall.damage[0].dice, thrall.melee, necromancer.critSpec], [3, false, false]);
    const party = classParty("necromancer", 5, { spell: () => null });
    const state = createFightState({ combatants: [...party.map((c) => ({ ...c, engagement: 1 })), { ...moderateCreature(6, "foe", "Foe"), engagement: 1 }] }, {}, 1);
    const c = state.byId.get("necromancer");
    const foe = state.byId.get("foe");
    state.round = 1;
    thrallStrikes(state, c, foe);
    assert.equal(c.thralls, 2);
    // (2026-11-06: bodies on the field, beside the foe, out of the turn order; a second Strike Commands one already there.)
    const bodies = thrallBodies(state, c);
    assert.equal(bodies.length, 2);
    assert.ok(bodies.every((body) => body.hp.max === 1 && body.thrallOf === c.id && !state.order?.includes(body.id)));
    thrallStrikes(state, c, foe);
    assert.equal(c.thralls, 2);
    const bomb = { name: "Necrotic Bomb", plan: { targeting: { thrall: { origin: "emanation", radius: 10, destroyed: true } } } };
    thrallForSpell(state, c, bomb);
    assert.equal(c.thralls, 1);
    thrallForSpell(state, c, bomb, { makeThrall: true });
    assert.equal(c.thralls, 2);
    state.round = 2;
    thrallForSpell(state, c, { ...bomb, plan: { targeting: { thrall: { destroyed: false } } } });
    assert.equal(c.thralls, 2);
    // (One killed by a foe: one fewer.)
    destroyBody(state, thrallBodies(state, c)[0]);
    assert.equal(c.thralls, 1);
});

test("the runesmith: Runic Optimization in place of weapon specialization, a shield, Forged Endurance", () => {
    const at = (lv) => classPC("runesmith", lv);
    const str = (lv) => at(lv).abilities.str;
    assert.equal(at(5).strikes[0].damage[0].bonus, str(5));
    assert.equal(at(7).strikes[0].damage[0].bonus, str(7) + 2);
    assert.equal(at(15).strikes[0].damage[0].bonus, str(15) + 6);
    assert.equal(at(19).strikes[0].damage[0].bonus, str(19) + 8);
    assert.ok(at(1).shield && at(1).reactions.shieldBlock);
    assert.equal(at(11).saveDegrees[0].saves[0], "fortitude");
});

test("the runesmith's runes: atryl and ranshu traced and invoked against its class DC, both at once; marssyl's splash on the warhammer", () => {
    const runesmith = classPC("runesmith", 5);
    // (2026-11-10: thullax first, then atryl and ranshu.)
    const runes = runesmith.spells.filter((entry) => entry.runesmithRune).slice(1);
    assert.equal(runesmith.spells.find((entry) => entry.runesmithRune).plan.resolution.sharedDamage.components[0].formula, "3d6[acid]");
    assert.deepEqual(runes.map((entry) => Number(entry.plan.activation.time)), [2, 2, 3, 3]);
    assert.ok(runes.every((entry) => entry.dc === 21 && entry.plan.resolution.check.statistic === "fortitude" && entry.plan.resolution.check.basic));
    assert.deepEqual(runes[3].plan.resolution.sharedDamage.components.map((part) => part.formula), ["3d8[fire]", "3d8[electricity]"]);
    assert.ok(runesmith.strikes[0].damage.some((part) => part.splash && part.bonus === 2));
});
