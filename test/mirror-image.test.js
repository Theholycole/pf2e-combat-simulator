import test from "node:test";
import assert from "node:assert/strict";

import { createFightState, simulate } from "../src/engine/fight.js";
import { castSpell } from "../src/engine/spells.js";
import { performStrike } from "../src/engine/actions.js";
import { moderateCreature, martialParty } from "../src/engine/benchmarks.js";
import { scoreOptions } from "../src/engine/planner.js";
import { imageOdds, imageShare, imagesWorth } from "../src/engine/images.js";
import { expectedHitDamage } from "../src/engine/actions.js";

// Mirror Image (the user, 2026-10-21: "have the simulator model mirror image"), as the spell module compiles it (PF2e 8.6.1's text): three
// images, 1 in 4 to hit the caster with three (1 on 1d4), 1 in 3 with two (1-2 on 1d6), 1 in 2 with one (1-3 on 1d6), for a minute.
const CHANCES = { 1: { die: 6, max: 3 }, 2: { die: 6, max: 2 }, 3: { die: 4, max: 1 } };
const MIRROR = { modelVersion: 12, source: { name: "Mirror Image", slug: "mirror-image" }, rank: 2, traits: ["concentrate", "illusion", "manipulate", "visual"], activation: { time: "2" },
    targeting: { target: null, range: null, area: null }, lifecycle: { durationSpec: { mode: "fixed", value: 1, unit: "minutes" } },
    resolution: { kind: "image-decoys", imageDecoys: { images: 3, chances: CHANCES, durationSeconds: 60, effect: { uuid: "Compendium.pf2e.spell-effects.Item.0PO5mFRhh9HxGAtv", label: "Spell Effect: Mirror Image" } } } };
const COLORS = { die: 4, rows: [{ face: 1, label: "Red", damage: ["5[fire]", "5[mental]"] }, { face: 2, label: "Orange", damage: ["5[acid]", "5[mental]"] }, { face: 3, label: "Yellow", damage: ["5[electricity]", "5[mental]"] },
    { face: 4, label: "Green", damage: ["5[poison]", "5[mental]"], condition: { slug: "frightened", value: 1 } }] };
const CHROMATIC = { ...MIRROR, source: { name: "Chromatic Image", slug: "chromatic-image" }, rank: 4, resolution: { ...MIRROR.resolution, imageDecoys: { ...MIRROR.resolution.imageDecoys, colors: COLORS } } };

function fight(plan = MIRROR) {
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "npc", spells: [{ name: plan.source.name, plan, castRank: plan.rank, dc: 22, attack: 14, pool: "s" }], spellPools: { s: 1 }, engagement: 1, hp: { value: 200, max: 200 } };
    const state = createFightState({ combatants: [mage, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }] }, {}, 1);
    state.log = [];
    return { state, mage: state.byId.get("mage"), brute: state.byId.get("brute") };
}

// The d20 at a fixed face, and the next dice from a list (then the stream's own).
function dice(state, natural, faces) {
    const queue = [...faces];
    const own = state.rng.die.bind(state.rng);
    state.rng.d20 = () => natural;
    state.rng.die = (sides) => (queue.length ? queue.shift() : own(sides));
}

test("Mirror Image: cast on the caster for its minute, three images", () => {
    const { state, mage } = fight();
    castSpell(state, mage, 0, ["mage"]);
    assert.deepEqual([mage.images.count, mage.images.untilRound, mage.images.spell], [3, state.round + 10, "Mirror Image"]);
    assert.ok(state.log.includes("  Mage has 3 images (Mirror Image)"), state.log.join("\n"));
});

test("Mirror Image: a hit on an image destroys it and does nothing; one that finds the caster hits; a failure destroys one with no effect; a critical failure passes them by", () => {
    const { state, mage, brute } = fight();
    castSpell(state, mage, 0, ["mage"]);
    const hp = mage.hp.value;
    // A hit (d20 15), 2 on the 1d4: an image.
    dice(state, 15, [2]);
    const result = performStrike(state, brute, mage, brute.strikes[0]);
    assert.deepEqual([result.degree, result.damage, result.image, mage.images.count, mage.hp.value], [1, 0, true, 2, hp], state.log.join("\n"));
    assert.ok(state.log.some((line) => line.includes("Brute rolls 2 on 1d4 against Mage's images: it hits an image")), state.log.join("\n"));
    // A hit, 1 on the 1d6 with two left: the caster.
    brute.attacksThisTurn = 0;
    dice(state, 15, [1]);
    assert.equal(performStrike(state, brute, mage, brute.strikes[0]).degree, 2);
    assert.ok(mage.hp.value < hp);
    assert.equal(mage.images.count, 2);
    // A failure (d20 2 + the Strike's bonus short of the AC, not a natural 1): an image gone, no roll for it.
    brute.attacksThisTurn = 0;
    dice(state, 2, []);
    const miss = performStrike(state, brute, mage, brute.strikes[0]);
    assert.deepEqual([miss.degree, miss.image, mage.images.count], [1, true, 1]);
    // A natural 1: a critical failure, the images untouched.
    dice(state, 1, []);
    assert.equal(performStrike(state, brute, mage, brute.strikes[0]).degree, 0);
    assert.equal(mage.images.count, 1);
    // The last image hit: the spell ends.
    brute.attacksThisTurn = 0;
    dice(state, 15, [5]);
    performStrike(state, brute, mage, brute.strikes[0]);
    assert.equal(mage.images, null);
    assert.ok(state.log.includes("  Mirror Image on Mage ends"), state.log.join("\n"));
});

test("Mirror Image: a critical hit on an image destroys it and hits the caster; a blinded attacker isn't fooled", () => {
    const { state, mage, brute } = fight();
    castSpell(state, mage, 0, ["mage"]);
    dice(state, 20, [3]);
    assert.equal(performStrike(state, brute, mage, brute.strikes[0]).degree, 2);
    assert.equal(mage.images.count, 2);
    brute.attacksThisTurn = 0;
    brute.cond.blinded = true;
    dice(state, 15, [6]);
    // (Blinded: a flat check of 11 first — the die list's 6 isn't it, the d20 is; then no images.)
    state.rng.d20 = () => 15;
    performStrike(state, brute, mage, brute.strikes[0]);
    assert.equal(mage.images.count, 2);
    assert.equal(imageShare(state, brute, mage), 1);
});

test("Mirror Image against a spell attack: a hit on an image does nothing to the caster", () => {
    const { state, mage, brute } = fight();
    castSpell(state, mage, 0, ["mage"]);
    const bolt = { modelVersion: 12, source: { name: "Bolt" }, rank: 1, traits: ["attack", "fire"], activation: { time: "2" }, targeting: { target: "1 creature", range: "60 feet" },
        resolution: { kind: "save", check: { statistic: "spell-attack" }, sharedDamage: { rollOnce: true, components: [{ id: "0", formula: "4d6", type: "fire" }] },
            outcomes: { criticalSuccess: { damage: { mode: "shared", multiplier: 2, sourceComponentIds: ["0"] }, effects: [] }, success: { damage: { mode: "shared", multiplier: 1, sourceComponentIds: ["0"] }, effects: [] }, failure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] }, criticalFailure: { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] } } } };
    brute.spells = [{ name: "Bolt", plan: bolt, castRank: 1, dc: 22, attack: 14, pool: null }];
    const hp = mage.hp.value;
    // (The core rolls the 4d6 first, then the attack: the image's die after them.)
    dice(state, 15, [3, 3, 3, 3, 4]);
    castSpell(state, brute, 0, ["mage"]);
    assert.deepEqual([mage.hp.value, mage.images.count], [hp, 2], state.log.join("\n"));
    dice(state, 15, [3, 3, 3, 3, 1]);
    castSpell(state, brute, 0, ["mage"]);
    assert.ok(mage.hp.value < hp, state.log.join("\n"));
});

test("Chromatic Image: each image a foe destroys is a color — its damage on the attacker, Green's frightened", () => {
    const { state, mage, brute } = fight(CHROMATIC);
    castSpell(state, mage, 0, ["mage"]);
    const hp = brute.hp.value;
    // A hit on an image (2 on the 1d4), then the color: Green (4).
    dice(state, 15, [2, 4]);
    performStrike(state, brute, mage, brute.strikes[0]);
    assert.equal(hp - brute.hp.value, 10, state.log.join("\n"));
    assert.equal(brute.cond.frightened, 1);
});

test("Mirror Image in the planner: the odds against it (a failure and a hit on an image do nothing), its worth, and the caster casting it", () => {
    assert.deepEqual(imageOdds([0.1, 0.3, 0.4, 0.2], 0.25).map((value) => Math.round(value * 1000) / 1000), [0.7, 0, 0.25, 0.05]);
    assert.deepEqual(imageOdds([0.1, 0.3, 0.4, 0.2], 1), [0.1, 0.3, 0.4, 0.2]);
    const { state, mage, brute } = fight();
    const worth = imagesWorth(state, mage, MIRROR.resolution.imageDecoys, { expectedHitDamage });
    assert.ok(worth > 0, String(worth));
    mage.actionsLeft = 3;
    assert.ok(scoreOptions(state, mage).options.some((option) => option.action.type === "cast" && option.value > 0), "worth casting beside a foe");
    castSpell(state, mage, 0, ["mage"]);
    assert.equal(imageShare(state, brute, mage), 0.25);
    assert.equal(imagesWorth(state, mage, MIRROR.resolution.imageDecoys, { expectedHitDamage }), 0, "not again with all three up");
});

test("Mirror Image in whole fights: cast by a caster the foe attacks, and images take its attacks; not by one the foes leave alone", () => {
    const mirror = { name: "Mirror Image", plan: MIRROR, castRank: 2, dc: 22, attack: 14, pool: "s" };
    const mage = { ...moderateCreature(5, "mage", "Mage"), side: "party", kind: "pc", spells: [mirror], spellPools: { s: 1 }, engagement: 1, hp: { value: 120, max: 120 } };
    const duel = { combatants: [mage, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }] };
    const lines = [];
    let wins = 0;
    for (let seed = 1; seed <= 12; seed++) {
        const result = simulate(duel, {}, seed, { log: true });
        lines.push(...result.log);
        if (result.outcome === "decisive") wins++;
    }
    assert.ok(lines.filter((line) => line.includes("casts Mirror Image")).length >= 6, lines.join("\n"));
    assert.ok(lines.some((line) => line.includes("an image of Mage is destroyed")));
    // Beside a fighter and a champion the brute goes for, it Strikes instead.
    const party = { combatants: [...martialParty(5).slice(0, 2), { ...mage, kind: "npc" }, { ...moderateCreature(5, "brute", "Brute"), engagement: 1 }] };
    const others = [];
    for (let seed = 1; seed <= 6; seed++) others.push(...simulate(party, {}, seed, { log: true }).log);
    assert.ok(!others.some((line) => line.includes("casts Mirror Image")));
});

test("images spent over a round's attacks: one attack at the first odds, a party's round strips them (2026-10-21)", async () => {
    const { imageShareOverRound } = await import("../src/engine/images.js");
    const chances = { 3: { die: 4, max: 1 }, 2: { die: 6, max: 2 }, 1: { die: 6, max: 3 } };
    const odds = [0.05, 0.35, 0.5, 0.1];
    assert.equal(imageShareOverRound(3, chances, odds, 1), 0.25, "the first attack: 1 in 4");
    const two = imageShareOverRound(3, chances, odds, 2);
    const party = imageShareOverRound(3, chances, odds, 8);
    assert.ok(two > 0.25 && party > two, `${two} then ${party}: each attack after the first finds fewer images`);
    assert.ok(party > 0.6, `eight attacks: most find the caster (${party})`);
    assert.equal(imageShareOverRound(0, chances, odds, 4), 1, "no images");
    assert.equal(imageShareOverRound(3, chances, [1, 0, 0, 0], 6), 0.25, "critical failures spend none");
});

