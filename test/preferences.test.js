import test from "node:test";
import assert from "node:assert/strict";

import { canStopRegeneration, createFightState, fightOver, simulate } from "../src/engine/fight.js";
import { factorFight, factorLabels, factorsFor, namedTypes, picksOf } from "../src/engine/preferences.js";
import { spellStops } from "../src/engine/actions.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { standardParty } from "../src/engine/party.js";

// A creature's preferences (2026-10-23, preferences.js), and regeneration holding a fight open (fight.js checkEnd).

const troll = () => ({ ...moderateCreatureAt(5, "monster", "Troll"), side: "foes", traits: ["giant", "troll"], regeneration: { value: 20, deactivatedBy: ["acid", "fire"] }, weaknesses: [{ type: "fire", value: 10, exceptions: [] }] });

test("regeneration: a downed creature whose regeneration its foes' Strikes can stop holds the fight open and is finished; one they can't stop, they leave down; fire puts it down for good", () => {
    const party = standardParty(5);
    const fiery = party.map((c, index) => (index === 0 ? { ...c, strikes: [...c.strikes, { name: "Torch", bonus: 0, melee: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "fire" }] }] } : c));
    const downed = (members) => {
        const state = createFightState({ combatants: [...members, troll()] }, { morale: false, retreat: false }, 1);
        const t = state.byId.get("monster");
        Object.assign(t, { status: "down", hp: { ...t.hp, value: 0 }, cond: { ...t.cond, dying: 1, unconscious: true } });
        return state;
    };
    assert.equal(canStopRegeneration(downed(party), downed(party).byId.get("monster")), false, "no fire or acid among them");
    assert.equal(fightOver(downed(party)), true, "left down");
    assert.equal(canStopRegeneration(downed(fiery), downed(fiery).byId.get("monster")), true);
    assert.equal(fightOver(downed(fiery)), false, "it'll get back up: the fight goes on");
    const spell = { name: "Fire Ray", plan: { traits: ["fire"], resolution: { outcomes: { failure: { damage: { mode: "full", formula: "2d6[fire]" } } } } }, castRank: 1, pool: null };
    const casters = party.map((c) => (c.id === "wizard" ? { ...c, spells: [...(c.spells ?? []), spell] } : c));
    assert.equal(spellStops(spell, ["fire"]), true, "a damaging spell of its type finishes it too (one its caster can cast)");
    assert.equal(spellStops({ plan: { traits: ["holy"], resolution: { outcomes: { failure: { damage: { mode: "full", formula: "2d6[spirit]" } } } } } }, ["holy"]), true, "a holy damaging spell");
    assert.equal(spellStops({ plan: { traits: [], resolution: { outcomes: { failure: { conditions: [] } } } } }, ["fire"]), false, "no damage");
    assert.equal(spellStops({ plan: { traits: ["nonlethal", "mental"], resolution: { outcomes: { failure: { damage: { mode: "full", formula: "1d6[mental]" } } } } } }, ["mental"]), false, "a nonlethal spell can't kill it down (Daze)");
    // (Up three times already: its foes are taken not to manage it, and leave it down.)
    const tired = downed(fiery);
    tired.byId.get("monster").regrewCount = 3;
    assert.equal(canStopRegeneration(tired, tired.byId.get("monster")), false);
    assert.ok(casters);
    // (A Strike of a material that stops it: the downed creature finished.)
    const silvered = { ...troll(), regeneration: { value: 20, deactivatedBy: ["silver"] } };
    const daggers = party.map((c) => (c.id === "rogue" ? { ...c, strikes: [...c.strikes, { name: "Silver Dagger", bonus: c.strikes[0].bonus - 1, melee: true, agile: true, damage: [{ dice: 1, die: 4, bonus: 2, type: "piercing" }], iwr: { materials: ["silver"] } }] } : c));
    const finished = simulate({ combatants: [...daggers, silvered] }, { morale: false, retreat: false }, 1, { log: true });
    assert.equal(finished.foes[0].status, "dead");
    assert.match(finished.log.join("\\n"), /Rogue goes to finish Troll/);
    const burning = simulate({ combatants: [...party.map((c) => ({ ...c, strikes: c.strikes.map((s) => ({ ...s, damage: [...s.damage, { dice: 1, die: 6, bonus: 0, type: "fire" }] })) })), troll()] }, { morale: false, retreat: false, maxRounds: 12 }, 4);
    assert.equal(burning.foes[0].status, "dead");
});

test("the factors a creature gets: only the damage it names (against untyped), Sky only for a flier, Resist Energy for its weakness, nothing it has", () => {
    const keys = (monster) => factorsFor(monster).map((factor) => factor.key);
    const plain = keys({ traits: [] });
    assert.ok(!plain.some((key) => key.startsWith("deals:")), "no damage a plain creature names");
    assert.ok(!plain.includes("battlefield:sky"));
    const t = keys(troll());
    assert.ok(["deals:untyped", "deals:fire", "deals:acid", "ally:resist-fire"].every((key) => t.includes(key)));
    assert.equal(factorsFor(troll()).find((factor) => factor.key === "deals:fire").base, "deals:untyped");
    assert.ok(keys({ flies: true }).includes("battlefield:sky") && !keys({ flies: true }).includes("ally:fly"));
    assert.ok(!keys({ spells: [{ name: "Haste (Constant)" }] }).includes("ally:haste"));
    assert.ok(namedTypes({ traits: ["undead"] }).has("vitality"));
    assert.equal(factorLabels()["ally:fly"], "an ally's Fly");
});

test("a factor's fight: the party's changes, an ally's spell as a constant one, the setup", () => {
    const party = standardParty(3);
    const [fire] = factorsFor(troll()).filter((factor) => factor.key === "deals:fire");
    const fight = factorFight(fire, party, [troll()]);
    assert.ok(fight.combatants[0].strikes[0].damage.some((part) => part.type === "fire"));
    const dark = factorFight(factorsFor({}).find((factor) => factor.key === "light:dark"), party, [troll()]);
    assert.equal(dark.setup.environment.light, "dark");
    const haste = factorFight(factorsFor({}).find((factor) => factor.key === "ally:haste"), party, [troll()], { spell: { name: "Haste", plan: {}, castRank: 3 } });
    assert.ok(haste.combatants.at(-1).spells.some((spell) => spell.name === "Haste (Constant)"));
});

test("picks: the best battlefield; the three most wanted and most hated past 0.3 of a level; an ally's help never hated", () => {
    const picks = picksOf({ "battlefield:pillars": 0.3, "battlefield:dropoff": 0.9, "light:dark": 1.2, "deals:fire": -1.5, "deals:acid": -0.8, "ally:haste": 0.7, "ally:mirror-image": -1.9, "cover:foes": 0.35, "terrain:ice": 0.25, "weather:fog": -0.2, "deals:untyped": -3 });
    assert.deepEqual(picks.battlefield, ["battlefield:dropoff", 0.9]);
    assert.deepEqual(picks.wants.map(([key]) => key), ["light:dark", "ally:haste", "cover:foes"]);
    assert.deepEqual(picks.hates.map(([key]) => key), ["deals:fire", "deals:acid"]);
});

test("the icon's words: best battlefield, wants and hates with their levels, how they were found", async () => {
    const { preferencesOf, preferencesTooltip } = await import("../src/live/danger.js");
    const data = { fights: 40, labels: { "battlefield:dropoff": "Dropoff", "light:dark": "darkness", "deals:fire": "fire damage" }, creatures: { "pf2e.bestiary": { abc: { battlefield: ["battlefield:dropoff", 0.9], wants: [["light:dark", 1.2]], hates: [["deals:fire", -1.5]] }, none: { battlefield: null, wants: [], hates: [] } } } };
    assert.equal(preferencesOf(data, "pf2e.bestiary", "none"), null);
    const words = preferencesTooltip(preferencesOf(data, "pf2e.bestiary", "abc"), data);
    assert.match(words.text, /^Best battlefield: Dropoff \(\+0\.9\)\. Wants: darkness \(\+1\.2\)\. Hates: fire damage \(−1\.5\)\. Levels of danger/);
    assert.match(words.html, /<p><strong>Hates:<\/strong> fire damage \(−1\.5\)<\/p>/);
});
