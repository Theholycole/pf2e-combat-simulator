import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, desperate, performAction, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { computeThreats, potentialDamage, scoreOptions } from "../src/engine/planner.js";
import { canCast, poolReady, spendPool, trickChance } from "../src/engine/spells.js";
import { isStaffItem, itemCasts, staffCharges, staffSpellList, trickSkills } from "../src/adapter/items.js";

// S22: scrolls, wands and staves as spells the creature can cast.
const rows = (byDegree) => Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...byDegree[degree] }]));
const FIREBALL = {
    modelVersion: 12,
    source: { name: "Fireball" },
    rank: 3,
    traits: ["fire", "manipulate"],
    activation: { time: "2", traits: ["fire", "manipulate"] },
    targeting: { target: null, range: "500 feet", area: { type: "burst", value: 20 } },
    resolution: {
        kind: "save",
        check: { statistic: "reflex", basic: true },
        sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d6", type: "fire" }], heightening: { type: "interval", interval: 1, damage: { 0: "2d6" } } },
        outcomes: rows({
            success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } },
            failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } },
            criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }
        })
    }
};
const fireball = (extra) => ({ name: "Fireball", plan: FIREBALL, castRank: 3, dc: 22, attack: 12, ...extra });
const mage = (spells, pools, extra = {}) => ({ ...moderateCreature(5, "mage", "Mage"), strikes: [{ name: "Staff", bonus: 8, melee: true, agile: false, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] }], spells, spellPools: pools, band: "near", ...extra });

test("S22 reading: casts left, Trick Magic Item's skills, staves, their charges and their spells by rank", () => {
    // A stack of scrolls, one used wand (back after a rest), a wand with no uses read as full.
    assert.equal(itemCasts({ category: "scroll", quantity: 3, uses: { value: 1, max: 1 } }), 3);
    assert.equal(itemCasts({ category: "wand", quantity: 1, uses: { value: 0, max: 1 } }), 0);
    assert.equal(itemCasts({ category: "wand", quantity: 1, uses: { value: 0, max: 1 }, fresh: true }), 1);
    assert.equal(itemCasts({ category: "scroll", quantity: 2, uses: { value: 0, max: 1 }, fresh: true }), 1);
    assert.equal(itemCasts({ category: "scroll", quantity: 0 }), 0);
    assert.deepEqual(trickSkills(["arcane", "primal", "evocation", "arcane"]), ["arcana", "nature"]);
    assert.equal(isStaffItem({ type: "weapon", traits: ["staff", "magical"], magical: true }), true);
    assert.equal(isStaffItem({ type: "weapon", traits: ["staff"], magical: false }), false);
    assert.equal(isStaffItem({ type: "equipment", traits: ["staff"], magical: true }), false);
    assert.equal(isStaffItem({ type: "equipment", traits: ["staff", "coda"], magical: true }), true);
    // Highest slot it has, no higher than half its level.
    assert.equal(staffCharges([{ slot1: { max: 3 }, slot2: { max: 3 }, slot3: { max: 2 } }], 6), 3);
    assert.equal(staffCharges([{ slot1: { max: 3 }, slot5: { max: 1 } }], 6), 1);
    assert.equal(staffCharges([], 9), 0);
    const html = "<p>A staff.</p><ul><li>Not this list</li></ul><p><strong>Activate</strong></p><ul>"
        + "<li><strong>Cantrip</strong> @UUID[Compendium.pf2e.spells-srd.Item.aaa]{Ignition}</li>"
        + "<li><strong>1st</strong> @UUID[Compendium.pf2e.spells-srd.Item.bbb]{Breathe Fire}, @Compendium[pf2e.spells-srd.ccc]{Old Link}</li>"
        + "<li><strong>3rd</strong> @UUID[Compendium.pf2e.spells-srd.Item.ddd]{Fireball}</li></ul>";
    assert.deepEqual(staffSpellList(html, 2), [
        { rank: 0, uuid: "Compendium.pf2e.spells-srd.Item.aaa" },
        { rank: 1, uuid: "Compendium.pf2e.spells-srd.Item.bbb" },
        { rank: 1, uuid: "Compendium.pf2e.spells-srd.ccc" }
    ]);
    assert.equal(staffSpellList(html).length, 4);
    assert.deepEqual(staffSpellList("<p>no list</p>"), []);
});

test("S22 staves: a spell takes its rank in charges; the planner and the potential count them", () => {
    const staff = { pool: "staff:s", from: "Staff of Fire", item: "s" };
    const third = fireball({ ...staff, poolCost: 3 });
    const first = fireball({ ...staff, castRank: 1, poolCost: 1, name: "Breathe Fire" });
    const c = { spellPools: { "staff:s": 4 } };
    assert.equal(canCast(c, third), true);
    spendPool(c, third);
    assert.equal(c.spellPools["staff:s"], 1);
    assert.equal(canCast(c, third), false);
    assert.equal(canCast(c, first), true);
    // Potential (M40): 4 charges hold one 3rd-rank cast, then the 1st-rank one.
    assert.equal(potentialDamage({ spellPools: { "staff:s": 4 } }, [{ spell: third, damage: 30 }, { spell: first, damage: 12 }], 5), (30 + 12 + 5) / 3);
    // The planner: with one charge left, the 1st-rank spell and not the 3rd.
    const state = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), mage([third, first], { "staff:s": 1 })] });
    const caster = state.byId.get("mage");
    caster.actionsLeft = 3;
    const casts = scoreOptions(state, caster).options.filter((option) => option.action.type === "cast").map((option) => caster.spells[option.action.spellIndex].name);
    assert.deepEqual([...new Set(casts)], ["Breathe Fire"]);
});

test("S22 wands: overcharged once the day's cast is spent, and only while the fight goes badly for its side", () => {
    const wand = fireball({ pool: "item:w", from: "Wand of Fireball", item: "w" });
    const overcharged = fireball({ pool: "overcharge:w", from: "Wand of Fireball (overcharged)", item: "w", overcharge: "item:w" });
    const c = { spellPools: { "item:w": 1, "overcharge:w": 1 } };
    assert.equal(canCast(c, wand), true);
    assert.equal(canCast(c, overcharged), false, "the wand's own cast first");
    c.spellPools["item:w"] = 0;
    assert.equal(canCast(c, overcharged), false, "not while the fight goes well");
    c.desperate = true;
    assert.equal(canCast(c, overcharged), true);
    spendPool(c, overcharged);
    assert.equal(poolReady(c, overcharged), false, "once");
    // The fight going badly: one of its side down, or its side behind on strength.
    const state = createFightState({ combatants: [...martialParty(4), mage([wand, overcharged], { "item:w": 0, "overcharge:w": 1 })] });
    computeThreats(state);
    const foe = state.byId.get("mage");
    const pc = state.list.find((each) => each.kind === "pc");
    assert.equal(desperate(state, foe), true, "a lone level-5 mage against four PCs is behind");
    assert.equal(desperate(state, pc), false);
    pc.status = "down";
    assert.equal(desperate(state, state.list.find((each) => each.kind === "pc" && each !== pc)), true);
});

test("S22 Trick Magic Item: an action more, worth its odds; a failure costs only that action and the item this turn, a critical failure for the fight", () => {
    const trick = { skill: "Arcana", modifier: 9, dc: 18 };
    assert.ok(Math.abs(trickChance(trick) - 0.6) < 1e-9);
    const scroll = fireball({ pool: "item:s", from: "Scroll of Fireball", item: "s", trick });
    const state = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), mage([scroll], { "item:s": 1 })] });
    const caster = state.byId.get("mage");
    caster.actionsLeft = 3;
    caster.usedThisTurn = new Set();
    const cast = scoreOptions(state, caster).options.find((option) => option.action.type === "cast");
    assert.ok(cast, "it plans the cast");
    assert.equal(cast.action.trick, true);
    // Only two actions left: the trick and a two-action spell don't fit.
    caster.actionsLeft = 2;
    assert.ok(!scoreOptions(state, caster).options.some((option) => option.action.type === "cast"));
    // A failure (d20 5: 14 vs 18): the cast's two actions back, the scroll kept, not again this turn.
    caster.actionsLeft = 0;
    state.rng.d20 = () => 5;
    performAction(state, caster, cast.action);
    assert.equal(caster.actionsLeft, 2);
    assert.equal(caster.spellPools["item:s"], 1);
    assert.ok(state.log.some((line) => line.includes("Mage tries Trick Magic Item on Scroll of Fireball (Arcana): 14 vs 18 → failure")), state.log.join("\n"));
    assert.equal(canCast(caster, scroll), false);
    // Next turn it can try again; a success casts from the scroll and uses it up.
    caster.usedThisTurn = new Set();
    assert.equal(canCast(caster, scroll), true);
    state.rng.d20 = () => 12;
    performAction(state, caster, cast.action);
    assert.ok(state.log.some((line) => line.includes("Mage casts Fireball from Scroll of Fireball")), state.log.join("\n"));
    assert.equal(caster.spellPools["item:s"], 0);
    // A critical failure: not this fight.
    caster.spellPools["item:s"] = 1;
    caster.usedThisTurn = new Set();
    state.rng.d20 = () => 1;
    performAction(state, caster, cast.action);
    caster.usedThisTurn = new Set();
    assert.equal(canCast(caster, scroll), false);
});

test("S22 stowed: taken out first (PF2e's 1 or 2 actions); a wand stays at hand, each scroll is taken out; alone when the cast won't fit after it", () => {
    // A wand in a belt pouch (1 action): taken out and cast in one turn, then at hand.
    const wand = fireball({ pool: "item:w", from: "Wand of Fireball", item: "w", draw: { actions: 1, each: false } });
    const state = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), mage([wand], { "item:w": 2 })] });
    const caster = state.byId.get("mage");
    caster.actionsLeft = 3;
    caster.usedThisTurn = new Set();
    const cast = scoreOptions(state, caster).options.find((option) => option.action.type === "cast");
    assert.equal(cast.action.draw, true);
    caster.actionsLeft = 0;
    performAction(state, caster, cast.action);
    assert.ok(state.log.some((line) => line.includes("Mage takes out Wand of Fireball (1 action)")), state.log.join("\n"));
    assert.ok(caster.itemsAtHand.has("w"));
    caster.actionsLeft = 2;
    assert.ok(!scoreOptions(state, caster).options.some((option) => option.action.type === "cast" && option.action.draw), "at hand now");
    // A scroll in a backpack (2 actions) with a 2-action spell: taken out alone this turn, cast the next.
    const scroll = fireball({ pool: "item:s", from: "Scroll of Fireball", item: "s", draw: { actions: 2, each: true } });
    const other = createFightState({ combatants: [...martialParty(5).map((pc) => ({ ...pc, engagement: 1 })), mage([scroll], { "item:s": 2 })] });
    const reader = other.byId.get("mage");
    reader.actionsLeft = 3;
    reader.usedThisTurn = new Set();
    const options = scoreOptions(other, reader).options;
    assert.ok(!options.some((option) => option.action.type === "cast"));
    const take = options.find((option) => option.action.type === "drawItem");
    assert.ok(take && take.value > 0);
    performAction(other, reader, take.action);
    assert.ok(reader.itemsAtHand.has("s"));
    reader.actionsLeft = 3;
    const next = scoreOptions(other, reader).options.find((option) => option.action.type === "cast");
    assert.ok(next && !next.action.draw);
    performAction(other, reader, next.action);
    // Used up: the next scroll of the stack is taken out again.
    assert.equal(reader.itemsAtHand.has("s"), false);
});

test("S22: whole fights with a wand, a scroll and a staff run, and the casts say what they came from", () => {
    const spells = [
        fireball({ pool: "item:w", from: "Wand of Fireball", item: "w" }),
        fireball({ pool: "overcharge:w", from: "Wand of Fireball (overcharged)", item: "w", overcharge: "item:w" }),
        fireball({ pool: "staff:s", from: "Staff of Fire", item: "s", poolCost: 3 })
    ];
    const snapshot = { combatants: [...martialParty(5), { ...moderateCreature(5, "brute", "Brute") }, mage(spells, { "item:w": 1, "overcharge:w": 1, "staff:s": 3 }, { band: "far", hp: { value: 300, max: 300 } })] };
    const lines = [];
    for (let seed = 1; seed <= 20; seed++) lines.push(...(simulate(snapshot, {}, seed, { log: true }).log ?? []));
    assert.ok(lines.some((line) => line.includes("casts Fireball from Wand of Fireball")));
    assert.ok(lines.some((line) => line.includes("casts Fireball from Staff of Fire")));
    assert.ok(lines.some((line) => line.includes("casts Fireball from Wand of Fireball (overcharged)")));
    // Never more than the three it has.
    for (let seed = 1; seed <= 20; seed++) {
        const casts = (simulate(snapshot, {}, seed, { log: true }).log ?? []).filter((line) => line.includes("casts Fireball")).length;
        assert.ok(casts <= 3, `seed ${seed}: ${casts}`);
    }
});
