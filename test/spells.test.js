import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { applyDamage } from "../src/engine/actions.js";
import { canAct, saveModifier } from "../src/engine/combatant.js";
import { applyCondition, applyHeal, areaCapacity, castSpell, describeSpell, expireTimers, spellExpectation, spellGaps, spellVariants, targetSets } from "../src/engine/spells.js";

// Plans in the spell compiler's version-12 shape.
const rows = (byDegree) => Object.fromEntries(["criticalSuccess", "success", "failure", "criticalFailure"].map((degree) => [degree, { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...byDegree[degree] }]));
const basic = rows({
    success: { damage: { mode: "shared", multiplier: 0.5, sourceComponentIds: ["0"] } },
    failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } },
    criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }
});
const plan = (name, rank, { time = "2", range = "30 feet", target = null, area = null, traits = ["concentrate", "manipulate"] }, resolution) => ({
    modelVersion: 12,
    source: { name },
    rank,
    traits,
    activation: { time, traits },
    targeting: { target, range, area },
    resolution: { kind: "save", ...resolution }
});

const FIREBALL = plan("Fireball", 3, { range: "500 feet", area: { type: "burst", value: 20 }, traits: ["fire", "manipulate"] }, {
    check: { statistic: "reflex", basic: true },
    sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "6d6", type: "fire" }], heightening: { type: "interval", interval: 1, damage: { 0: "2d6" } } },
    outcomes: basic
});
const IGNITION = plan("Ignition", 1, { target: "1 creature", traits: ["attack", "cantrip", "fire", "manipulate"] }, {
    check: { statistic: "spell-attack" },
    sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "2d4", type: "fire" }], heightening: { type: "interval", interval: 1, damage: { 0: "1d4" } } },
    outcomes: rows({ criticalSuccess: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] } }, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } } })
});
const condition = (slug, value, duration = null) => ({ kind: "condition", slug, value, duration });
const FEAR = plan("Fear", 1, { target: "1 creature" }, {
    check: { statistic: "will" },
    outcomes: rows({
        success: { effects: [condition("frightened", 1)] },
        failure: { effects: [condition("frightened", 2)] },
        criticalFailure: { effects: [condition("frightened", 3), condition("fleeing", null, { mode: "fixed", value: 1, unit: "rounds" })] }
    })
});

function caster(spells, pools = {}, extra = {}) {
    return { ...moderateCreature(5, "mage", "Mage"), strikes: [{ name: "Staff", bonus: 8, melee: true, agile: false, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] }], spells, spellPools: pools, ...extra };
}

const fireball = (pool = "slot3") => ({ name: "Fireball", plan: FIREBALL, castRank: 3, dc: 22, attack: 12, pool });

test("a spell's actions, range, targets and area come from its plan", () => {
    const { check, actions, range, touch, area, targets, attack, manipulate, nonlethal, healing, helpful, self } = describeSpell(FIREBALL);
    assert.deepEqual({ actions, range, touch, area, targets, attack, manipulate, nonlethal, healing, helpful, self }, { actions: 2, range: 500, touch: false, area: { type: "burst", value: 20 }, targets: 0, attack: false, manipulate: true, nonlethal: false, healing: null, helpful: false, self: false });
    assert.equal(check.roll, "save", "read in version-13 form");
    assert.equal(describeSpell(IGNITION).attack, true);
    assert.equal(describeSpell(plan("x", 1, { time: "reaction", target: "1 creature" }, {})).actions, null);
    assert.equal(describeSpell(plan("x", 1, { time: "1 to 3", target: "up to 3 creatures" }, {})).actions, 2);
    assert.equal(describeSpell(plan("x", 1, { target: "up to 3 creatures" }, {})).targets, 3);
    assert.equal(describeSpell(plan("x", 1, { range: "touch", target: "1 creature" }, {})).touch, true);
    assert.equal(areaCapacity({ type: "burst", value: 20 }), 8);
    assert.equal(areaCapacity({ type: "cone", value: 15 }), 3);
});

test("a Fireball into the party's Melee: the slot is spent and every PC in it rolls", () => {
    const party = martialParty(5).map((pc) => ({ ...pc, engagement: 1 }));
    const state = createFightState({ combatants: [...party, { ...moderateCreature(5, "brute", "Brute"), engagement: 2 }, { ...caster([fireball()], { slot3: 1 }), band: "near" }] });
    const mage = state.byId.get("mage");
    const before = party.map((pc) => state.byId.get(pc.id).hp.value);
    castSpell(state, mage, 0, party.map((pc) => pc.id));
    assert.equal(mage.spellPools.slot3, 0);
    const after = party.map((pc) => state.byId.get(pc.id).hp.value);
    assert.ok(after.some((hp, index) => hp < before[index]), "someone took fire damage");
    assert.ok(state.log.some((line) => line.includes("casts Fireball")));
});

test("the planner casts an area spell at a cluster of enemies, and not once the slot is gone", () => {
    const party = martialParty(5).map((pc) => ({ ...pc, engagement: 1 }));
    const state = createFightState({ combatants: [...party, { ...caster([fireball()], { slot3: 1 }), band: "near" }] });
    const mage = state.byId.get("mage");
    mage.actionsLeft = 3;
    const best = scoreOptions(state, mage).options.sort((a, b) => b.score - a.score)[0];
    assert.equal(best.action.type, "cast");
    assert.equal(best.action.targetIds.length, party.length);
    mage.spellPools.slot3 = 0;
    assert.ok(!scoreOptions(state, mage).options.some((option) => option.action.type === "cast"));
});

test("an area that would catch the caster's allies is worth less than one that doesn't", () => {
    const [fighter, ...rest] = martialParty(5);
    const brute = { ...moderateCreature(5, "brute", "Brute"), hp: { value: 200, max: 200 }, engagement: 1 };
    const withAlly = createFightState({ combatants: [{ ...fighter, engagement: 1 }, brute, ...rest.map((pc) => ({ ...pc, band: "far" })), { ...caster([fireball()], { slot3: 1 }), band: "near" }] });
    const alone = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...moderateCreature(5, "other", "Other"), engagement: 2 }, ...rest.map((pc) => ({ ...pc, engagement: 1 })), { ...caster([fireball()], { slot3: 1 }), band: "near" }] });
    const valueOf = (state) => {
        const mage = state.byId.get("mage");
        mage.actionsLeft = 3;
        return Math.max(-Infinity, ...scoreOptions(state, mage).options.filter((option) => option.action.type === "cast").map((option) => option.value));
    };
    assert.ok(valueOf(alone) > valueOf(withAlly));
});

test("expected effect: degree odds times the damage at each degree, after resistances", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...caster([fireball()], { slot3: 1 }), engagement: 1 }] });
    const mage = state.byId.get("mage");
    const target = state.byId.get("fighter");
    const [plain] = spellExpectation(state, mage, fireball(), [target]);
    // 6d6 = 21 on average: at most double, at least nothing.
    assert.ok(plain.damage > 5 && plain.damage < 42);
    target.resistances = [{ type: "fire", value: 10 }];
    const [resisted] = spellExpectation(state, mage, fireball(), [target]);
    assert.ok(resisted.damage < plain.damage);
});

test("Fear: conditions apply, and a timed fleeing ends at the start of the caster's turn", () => {
    const [fighter] = martialParty(3);
    const state = createFightState({ combatants: [{ ...fighter, band: "near", saves: { fortitude: 0, reflex: 0, will: -30 } }, { ...caster([{ name: "Fear", plan: FEAR, castRank: 1, dc: 40, attack: 10, pool: null }]), band: "near" }] });
    const mage = state.byId.get("mage");
    const target = state.byId.get("fighter");
    castSpell(state, mage, 0, ["fighter"]);
    assert.equal(target.cond.frightened, 3);
    assert.equal(target.cond.fleeing, true);
    state.round += 1;
    expireTimers(state, mage);
    assert.equal(target.cond.fleeing, false);
    assert.equal(target.cond.frightened, 3, "frightened has no duration: it decays at the end of the target's turns");
});

test("a spell attack counts toward the multiple attack penalty", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...caster([{ name: "Ignition", plan: IGNITION, castRank: 3, dc: 22, attack: 12, pool: null }]), band: "near" }] });
    const mage = state.byId.get("mage");
    const target = state.byId.get("fighter");
    const first = spellExpectation(state, mage, mage.spells[0], [target], 0)[0].damage;
    const third = spellExpectation(state, mage, mage.spells[0], [target], 2)[0].damage;
    assert.ok(third < first);
    castSpell(state, mage, 0, ["fighter"]);
    assert.equal(mage.attacksThisTurn, 1);
});

test("target sets: single targets in range, areas by Melee and loose enemies", () => {
    const party = martialParty(5);
    const state = createFightState({ combatants: [{ ...party[0], engagement: 1 }, { ...party[1], engagement: 1 }, { ...party[2], band: "far" }, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }, { ...caster([]), band: "near" }] });
    const mage = state.byId.get("mage");
    const enemies = state.list.filter((c) => c.side === "party");
    const at = { enemies, inMelee: () => false, distance: (other) => (other.band === "far" ? 60 : 30), meleeId: null };
    const ignition = { plan: IGNITION, castRank: 1 };
    assert.deepEqual(targetSets(state, mage, ignition, at).map((set) => set.targets.map((c) => c.id)), [[party[0].id], [party[1].id]], "30 feet: the far PC is out of range");
    const sets = targetSets(state, mage, fireball(), at).map((set) => set.targets.map((c) => c.id).sort());
    assert.deepEqual(sets, [[party[0].id, party[1].id, "brute"].sort(), [party[2].id]]);
});

test("gaps: what of a spell the simulation can't model", () => {
    assert.deepEqual(spellGaps(fireball()), []);
    const fascinating = plan("Hypnotic Pattern", 3, { target: "1 creature" }, { check: { statistic: "will" }, outcomes: rows({ failure: { effects: [condition("fascinated", null)], noteEffects: [{ label: "Glare" }] } }) });
    assert.deepEqual(spellGaps({ plan: fascinating, castRank: 3 }), ["condition: fascinated", "note: Glare"]);
    assert.deepEqual(spellGaps({ plan: { ...FIREBALL, resolution: { kind: "summon" } }, castRank: 3 }), ['resolution kind "summon" isn\'t resolved yet']);
});

test("whole fights with a caster run, and the caster uses its spells", () => {
    const snapshot = { combatants: [...martialParty(5), { ...moderateCreature(5, "brute", "Brute") }, { ...caster([fireball(), { name: "Ignition", plan: IGNITION, castRank: 3, dc: 22, attack: 12, pool: null }], { slot3: 1 }), band: "far" }] };
    let casts = 0;
    for (let seed = 1; seed <= 20; seed++) {
        const result = simulate(snapshot, {}, seed, { log: true });
        assert.ok(result.outcome);
        casts += (result.log ?? []).filter((line) => line.includes("casts")).length;
    }
    assert.ok(casts > 0, "the mage cast something");
});

test("conditions from spells: paralysis stops a creature, sleep ends with damage, blindness halves its hits", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...caster([fireball()], { slot3: 1 }), engagement: 1 }] });
    const pc = state.byId.get("fighter");
    const mage = state.byId.get("mage");
    applyCondition(state, pc, "paralyzed", null, { mode: "fixed", value: 1, unit: "rounds" }, mage);
    assert.equal(canAct(pc), false);
    state.round += 1;
    expireTimers(state, mage);
    assert.equal(canAct(pc), true, "the paralysis ran out");

    applyCondition(state, pc, "unconscious", null, null, mage);
    assert.equal(canAct(pc), false);
    assert.equal(pc.status, "active", "asleep, not down");
    applyDamage(state, pc, [{ type: "fire", amount: 3 }], { source: mage });
    assert.equal(canAct(pc), true, "damage wakes it");

    pc.actionsLeft = 3;
    const sighted = scoreOptions(state, pc).options.filter((option) => option.action.type === "strike").map((option) => option.value);
    assert.ok(sighted.length);
    applyCondition(state, pc, "blinded", null, null, mage);
    const blind = scoreOptions(state, pc).options.filter((option) => option.action.type === "strike").map((option) => option.value);
    assert.ok(Math.max(...blind) < Math.max(...sighted) * 0.6);
});

test("immobilized creatures get no movement options; stupefied lowers Will saves and spell DCs", () => {
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...caster([fireball()], { slot3: 1 }), band: "near" }] });
    const pc = state.byId.get("fighter");
    pc.actionsLeft = 3;
    assert.ok(scoreOptions(state, pc).options.some((option) => option.action.type === "stride"));
    applyCondition(state, pc, "immobilized", null, null, pc);
    assert.ok(!scoreOptions(state, pc).options.some((option) => ["stride", "step"].includes(option.action.type)));

    const mage = state.byId.get("mage");
    const will = saveModifier(mage, "will");
    const before = spellExpectation(state, mage, fireball(), [pc])[0].damage;
    applyCondition(state, mage, "stupefied", 2, null, pc);
    assert.equal(saveModifier(mage, "will"), will - 2);
    assert.ok(spellExpectation(state, mage, fireball(), [pc])[0].damage < before, "a lower DC and a chance to lose the spell");
});

test("vitality damage harms only creatures with void healing, void damage only those without", async () => {
    const { adjustInstance } = await import("../src/engine/damage.js");
    const living = { traits: ["human"] };
    const undead = { traits: ["undead"] };
    assert.equal(adjustInstance(living, "vitality", 10), 0);
    assert.equal(adjustInstance(undead, "vitality", 10), 10);
    assert.equal(adjustInstance(living, "void", 10), 10);
    assert.equal(adjustInstance(undead, "void", 10), 0);
    assert.equal(adjustInstance({ traits: [], voidHealing: true }, "vitality", 10), 10, "the actor's own flag wins");
    // So a monster's Heal is worth nothing against living PCs, and its healing half is a gap.
    const heal = plan("Heal", 1, { time: "1 to 3", range: "30 feet", target: "1 willing living creature or 1 undead" }, {
        check: { statistic: "fortitude", basic: true },
        sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "1d8", type: "vitality", kinds: ["damage", "healing"] }] },
        outcomes: basic
    });
    const [fighter] = martialParty(3);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...caster([{ name: "Heal", plan: heal, castRank: 1, dc: 20, attack: 10, pool: null }]), band: "near" }] });
    assert.equal(spellExpectation(state, state.byId.get("mage"), state.byId.get("mage").spells[0], [state.byId.get("fighter")])[0].damage, 0);
    assert.deepEqual(spellGaps({ plan: heal, castRank: 1 }), ["healing"]);
});

// Heal and Force Barrage as the spell compiler writes them from 2026-10-08
// (healing payload, action overlays, missiles).
const HEAL = {
    ...plan("Heal", 1, { time: "1 to 3", range: "touch", target: "1 willing living creature or 1 undead", traits: ["healing", "manipulate", "vitality"] }, {
        check: { statistic: "fortitude", basic: true },
        sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "1d8", type: "vitality" }], heightening: { type: "interval", interval: 1, damage: { 0: "1d8" } } },
        native: {
            healing: { components: [{ id: "h", formula: "1d8", kinds: ["healing"] }], heightening: { type: "interval", interval: 1, damage: { h: "1d8" } }, recipients: "living" },
            byActions: {
                1: { targeting: { range: "touch" } },
                2: { targeting: { range: "30 feet" }, healing: { components: [{ id: "h", formula: "1d8+8", kinds: ["healing"] }], heightening: { type: "interval", interval: 1, damage: { h: "1d8+8" } } } },
                3: { targeting: { range: null, target: null, area: { type: "emanation", value: 30 } } }
            }
        },
        outcomes: basic
    })
};
const BARRAGE = {
    ...plan("Force Barrage", 1, { time: "1 to 3", range: "120 feet", target: "1 creature" }, {}),
    resolution: { kind: "direct-damage", sharedDamage: null, native: { sharedDamage: { components: [{ id: "0", formula: "1d4+1", type: "force" }] }, missiles: { perActions: { 1: 1, 2: 2, 3: 3 }, perRanks: { interval: 2, extra: 1 } } } }
};

test("healing: a downed PC is healed back up with wounded 1; a hurt one regains HP up to its maximum", () => {
    const [fighter, champion] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...champion, band: "near" }, { ...moderateCreature(5, "brute", "Brute"), band: "near" }] });
    const pc = state.byId.get("fighter");
    pc.status = "down";
    pc.hp.value = 0;
    pc.cond.dying = 2;
    pc.cond.unconscious = true;
    assert.equal(applyHeal(state, pc, 20), 20);
    assert.deepEqual([pc.status, pc.cond.dying, pc.cond.wounded, pc.cond.unconscious], ["active", 0, 1, false]);
    const other = state.byId.get("champion");
    other.hp.value = other.hp.max - 5;
    assert.equal(applyHeal(state, other, 20), 5);
});

test("a cleric's Heal: two actions on the downed fighter beats Strikes; variants are planned separately", () => {
    const [fighter, champion] = martialParty(5);
    const cleric = { ...champion, id: "cleric", name: "Cleric", spells: [{ name: "Heal", plan: HEAL, castRank: 3, dc: 22, attack: 12, pool: "slot3" }], spellPools: { slot3: 1 } };
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...cleric, band: "near" }, { ...moderateCreature(5, "brute", "Brute"), band: "far" }] });
    assert.deepEqual(spellVariants(state.byId.get("cleric").spells[0]), [1, 2, 3]);
    const pc = state.byId.get("fighter");
    pc.status = "down";
    pc.hp.value = 0;
    pc.cond.dying = 1;
    const c = state.byId.get("cleric");
    c.actionsLeft = 3;
    const best = scoreOptions(state, c).options.sort((a, b) => b.score - a.score)[0];
    assert.equal(best.action.type, "cast");
    assert.deepEqual(best.action.targetIds, ["fighter"]);
    assert.equal(best.action.actions, 2, "the 30-foot version reaches the fighter, who isn't adjacent");
    castSpell(state, c, 0, ["fighter"], 2);
    assert.equal(pc.status, "active");
    assert.ok(pc.hp.value >= 3 * 1 + 24);
    assert.equal(c.spellPools.slot3, 0);
});

test("Heal on undead foes is a save for vitality damage; Force Barrage hits without a roll", () => {
    const [fighter, champion] = martialParty(5);
    const zombie = { ...moderateCreature(5, "zombie", "Zombie"), traits: ["undead", "zombie"], band: "near" };
    const cleric = { ...champion, id: "cleric", name: "Cleric", spells: [{ name: "Heal", plan: HEAL, castRank: 3, dc: 40, attack: 12, pool: null }, { name: "Force Barrage", plan: BARRAGE, castRank: 3, dc: 22, attack: 12, pool: null }], spellPools: {} };
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...cleric, band: "near" }, zombie] });
    const c = state.byId.get("cleric");
    const undead = state.byId.get("zombie");
    const [heal] = spellExpectation(state, c, c.spells[0], [undead], 0, 2);
    assert.ok(heal.damage > 10 && heal.heal === 0);
    const [living] = spellExpectation(state, c, c.spells[0], [state.byId.get("fighter")], 0, 2);
    assert.equal(living.damage, 0);
    const hp = undead.hp.value;
    castSpell(state, c, 1, ["zombie"], 3);
    assert.ok(undead.hp.value <= hp - 6, "six missiles of at least 2");
});

test("a Heal with its healing payload is fully simulated", () => {
    assert.deepEqual(spellGaps({ plan: HEAL, castRank: 1 }), []);
    assert.deepEqual(spellGaps({ plan: BARRAGE, castRank: 1 }), []);
});

test("a spell PF2e's own card rolls (kind unsupported) is cast from its native numbers", () => {
    const row = (multiplier) => ({ damage: multiplier ? { mode: "shared", multiplier, sourceComponentIds: ["0"] } : { mode: "none", multiplier: 0, sourceComponentIds: [] } });
    const projectile = {
        ...plan("Telekinetic Projectile", 1, { target: "1 creature", range: "30 feet", traits: ["attack", "cantrip", "manipulate"] }, {}),
        resolution: { kind: "unsupported", check: null, sharedDamage: null, native: { check: { statistic: "spell-attack" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "2d6", type: "bludgeoning" }] }, outcomes: { criticalSuccess: row(2), success: row(1), failure: row(0), criticalFailure: row(0) } } }
    };
    const spell = { name: "Telekinetic Projectile", plan: projectile, castRank: 3, dc: 22, attack: 12, pool: null };
    assert.equal(describeSpell(projectile).attack, true);
    assert.equal(describeSpell(projectile).check.roll, "attack");
    assert.deepEqual(spellGaps(spell), []);
    const [fighter] = martialParty(5);
    const state = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...caster([spell]), band: "near" }] });
    const mage = state.byId.get("mage");
    const [expected] = spellExpectation(state, mage, spell, [state.byId.get("fighter")]);
    // 2d6 = 7 a hit: some chance to miss, so less than a certain hit.
    assert.ok(expected.damage > 1 && expected.damage < 7);
});

test("Lay on Hands: allies are healed, undead foes save; a damage-type choice goes where it hurts most", () => {
    const row = (multiplier, id) => ({ damage: multiplier ? { mode: "shared", multiplier, sourceComponentIds: [id] } : { mode: "none", multiplier: 0, sourceComponentIds: [] } });
    const layOnHands = {
        ...plan("Lay on Hands", 1, { target: "1 willing living creature or 1 undead", range: "touch", time: "1" }, {}),
        resolution: { kind: "unsupported", native: { variants: [
            { name: "Vs. Undead", check: { statistic: "fortitude", basic: true }, sharedDamage: { components: [{ id: "v", formula: "1d6", type: "vitality" }] }, outcomes: { criticalSuccess: row(0, "v"), success: row(0.5, "v"), failure: row(1, "v"), criticalFailure: row(2, "v") } },
            { name: "Healing", healing: { components: [{ id: "h", formula: "6", kinds: ["healing"] }], recipients: "living" } }
        ] } }
    };
    assert.equal(describeSpell(layOnHands).healing, "living");
    assert.equal(describeSpell(layOnHands).check.roll, "save");
    const [fighter, champion] = martialParty(3);
    const zombie = { ...moderateCreature(3, "zombie", "Zombie"), traits: ["undead"], engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, { ...champion, engagement: 1, spells: [{ name: "Lay on Hands", plan: layOnHands, castRank: 2, dc: 30, attack: 12, pool: "focus" }], spellPools: { focus: 1 } }, zombie] });
    const c = state.byId.get("champion");
    const pc = state.byId.get("fighter");
    pc.hp.value -= 20;
    const [heal] = spellExpectation(state, c, c.spells[0], [pc]);
    assert.equal(heal.heal, 6);
    const [undead] = spellExpectation(state, c, c.spells[0], [state.byId.get("zombie")]);
    assert.ok(undead.damage > 1 && undead.heal === 0);

    const projectile = {
        ...plan("Telekinetic Projectile", 1, { target: "1 creature", range: "30 feet" }, {}),
        resolution: { kind: "unsupported", native: { check: { statistic: "spell-attack" }, sharedDamage: { components: [{ id: "0", formula: "2d6", type: "bludgeoning" }] }, damageTypeChoices: { 0: ["bludgeoning", "piercing", "slashing"] }, outcomes: { criticalSuccess: row(2, "0"), success: row(1, "0"), failure: row(0), criticalFailure: row(0) } } }
    };
    const skeleton = { ...moderateCreature(3, "skeleton", "Skeleton"), resistances: [{ type: "piercing", value: 5 }, { type: "slashing", value: 5 }], band: "near" };
    const second = createFightState({ combatants: [{ ...fighter, band: "near" }, { ...caster([{ name: "Telekinetic Projectile", plan: projectile, castRank: 2, dc: 20, attack: 30, pool: null }]), side: "party", band: "near" }, skeleton] });
    const mage = second.byId.get("mage");
    const bone = second.byId.get("skeleton");
    const hp = bone.hp.value;
    castSpell(second, mage, 0, ["skeleton"]);
    assert.ok(second.log.some((line) => /takes \d+ bludgeoning/.test(line)), "bludgeoning, which it doesn't resist");
    assert.ok(bone.hp.value < hp);
});

test("Wails of the Damned (2026-10-14): only living enemies take the area's room and show as its targets; Drained 1d4 is rolled", () => {
    const wails = plan("Wails of the Damned", 9, { range: null, area: { type: "emanation", value: 40 }, traits: ["death", "void"] }, {
        check: { statistic: "fortitude", basic: false },
        sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "8d10", type: "void" }] },
        outcomes: rows({
            success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] } },
            failure: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [{ kind: "condition", slug: "drained", value: null, duration: null, valueRoll: "1d4" }] },
            criticalFailure: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [{ kind: "condition", slug: "drained", value: null, duration: null, valueRoll: "1d4" }] }
        })
    });
    wails.targeting.actorConstraints = { predicates: [{ kind: "enemy-of-caster" }, { kind: "living-creature" }] };
    const [fighter, ...rest] = martialParty(9);
    const spell = { name: "Wails of the Damned", plan: wails, castRank: 9, dc: 30, attack: 20, pool: null };
    const lich = { ...moderateCreature(9, "lich", "Lich"), spells: [spell], spellPools: {}, engagement: 1 };
    const ghoul = { ...moderateCreature(9, "ghoul", "Ghoul"), traits: ["undead"], engagement: 1 };
    const state = createFightState({ combatants: [{ ...fighter, engagement: 1 }, ...rest, lich, { ...moderateCreature(9, "ally", "Ally"), engagement: 1 }, ghoul] });
    const caster = state.byId.get("lich");
    const at = { enemies: state.list.filter((c) => c.side === "party"), allies: state.list.filter((c) => c.side === "foes" && c !== caster), inMelee: (other) => other.meleeId === caster.meleeId, distance: () => 0, meleeId: caster.meleeId };
    const ids = targetSets(state, caster, spell, at).flatMap((set) => set.targets.map((c) => c.id));
    assert.ok(ids.includes(fighter.id));
    assert.ok(!ids.includes("ally") && !ids.includes("ghoul") && !ids.includes("lich"), ids.join(","));
    // A failed save (critically): drained by the d4 (a 3).
    state.rng.d20 = () => 2;
    state.rng.die = (sides) => (sides === 4 ? 3 : 5);
    state.log = [];
    castSpell(state, caster, 0, [fighter.id]);
    assert.equal(state.byId.get(fighter.id).cond.drained, 3, JSON.stringify(state.log) + JSON.stringify(state.byId.get(fighter.id).cond));
});
