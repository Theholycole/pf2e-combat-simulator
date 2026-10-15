import test from "node:test";
import assert from "node:assert/strict";

import { prepareSnapshot, simulate } from "../src/engine/fight.js";
import { moderateCreature, martialParty, benchmarkEncounter } from "../src/engine/benchmarks.js";
import { runBatch, runCompare, COMPARE_PRESETS } from "../src/engine/batch.js";
import { defaultMoraleProfile, temperamentOf } from "../src/engine/morale.js";

test("default morale profiles follow the agreed guesses", () => {
    const zombie = { ...moderateCreature(1, "z", "Zombie"), traits: ["mindless", "undead"] };
    const wolf = { ...moderateCreature(1, "w", "Wolf"), traits: ["animal"] };
    const boss = { ...moderateCreature(5, "b", "Boss") };
    const bandits = [1, 2, 3].map((n) => moderateCreature(1, `b${n}`, "Bandit"));
    const context = { foes: [zombie, wolf, boss, ...bandits], partyLevel: 2, objective: null };
    assert.equal(defaultMoraleProfile(zombie, context).template, "none");
    assert.equal(defaultMoraleProfile(wolf, context).template, "bestial");
    assert.equal(defaultMoraleProfile(boss, context).boss, true);
    assert.equal(defaultMoraleProfile(boss, context).leader, true);
    assert.equal(defaultMoraleProfile(bandits[0], context).group, "Bandit");
    const targeted = defaultMoraleProfile(wolf, { ...context, objective: { kind: "target", targetId: "w" } });
    assert.equal(targeted.template, "cowardly");
});

test("M36: temperament by creature type", () => {
    const of = (name, traits, extra = {}) => temperamentOf({ name, traits, ...extra });
    assert.equal(of("Ghoul", ["undead"]), "fanatical");
    assert.equal(of("Zombie Shambler", ["mindless", "undead"]), "none");
    assert.equal(of("Barbazu", ["devil", "fiend"]), "disciplined");
    assert.equal(of("Vrock", ["demon", "fiend"]), "fanatical");
    assert.equal(of("Ceustodaemon", ["daemon", "fiend"]), "typical");
    assert.equal(of("Rakshasa", ["fiend", "rakshasa"]), "typical");
    assert.equal(of("Blood Wolf", ["animal", "fiend", "unholy"]), "bestial");
    assert.equal(of("Abyssal Warhound", ["animal", "demon", "fiend"]), "fanatical");
    assert.equal(of("Hellbound Attorney", ["devil", "fiend", "human", "humanoid"]), "disciplined");
    assert.equal(of("Lantern Archon", ["archon", "celestial"]), "disciplined");
    assert.equal(of("Morrigna", ["monitor", "psychopomp"]), "fanatical");
    assert.equal(of("Guard Squadron", ["human", "humanoid", "troop"]), "disciplined");
    assert.equal(of("Heavy Cavalry", ["animal", "human", "humanoid", "troop"]), "disciplined");
    assert.equal(of("Wolf Pack", ["animal", "troop"]), "bestial");
    assert.equal(of("Owlbear", ["beast"]), "bestial");
    assert.equal(of("Rat Swarm", ["animal", "swarm"]), "bestial");
    assert.equal(of("Army Ant Swarm", ["animal", "mindless", "swarm"]), "none");
    assert.equal(of("Young Red Dragon", ["dragon", "fire"]), "typical");
    assert.equal(of("Unicorn", ["fey"]), "typical");
    assert.equal(of("Guard", ["human", "humanoid"]), "disciplined");
    assert.equal(of("Hellknight Armiger", ["human", "humanoid"]), "disciplined");
    assert.equal(of("Cultist", ["human", "humanoid"]), "fanatical");
    assert.equal(of("Bandit", ["human", "humanoid"]), "mercenary");
    assert.equal(of("Pirate Captain", ["human", "humanoid"]), "mercenary");
    assert.equal(of("Pathfinder Venture-Captain", ["human", "humanoid"]), "typical");
    assert.equal(of("Watchman", ["human", "humanoid"]), "disciplined");
    assert.equal(of("Acolyte of Nethys", ["human", "humanoid"]), "typical");
    assert.equal(of("Cave Fisher", ["animal"]), "bestial");
    assert.equal(of("Wolf", ["animal"], { summonedBy: "druid" }), "none");
    assert.equal(of("Spider Minion", ["animal", "minion"]), "none");
    assert.equal(of("Skeleton", ["summoned", "undead"]), "none");
});

test("M36: a monster's summoned creatures never check morale, live and simulated", () => {
    const maker = { ...moderateCreature(3, "m", "Necromancer"), side: "foes", traits: ["human", "humanoid"] };
    const reserve = { ...moderateCreature(1, "m~Ghoul~0", "Necromancer's Ghoul"), side: "foes", traits: ["undead"], reserve: true, summonedBy: "m" };
    const prepared = prepareSnapshot({ combatants: [...martialParty(3), maker, reserve] });
    assert.equal(prepared.combatants.find((c) => c.id === "m~Ghoul~0").morale.template, "none");
    assert.equal(prepared.combatants.find((c) => c.id === "m").morale.template, "typical");
});

test("the losing gate at 3× keeps morale from deciding fights: at most 5 points in each", () => {
    for (const [level, threat] of [[1, "extreme"], [3, "severe"], [5, "extreme"], [5, "extremeBoss"]]) {
        const snapshot = { ...benchmarkEncounter(level, threat), moraleRules: { losingGate: true, gateMode: "strength", losingGateRatio: 3 } };
        const [on, off] = runCompare(snapshot, COMPARE_PRESETS.morale(), { runs: 600 });
        assert.ok(Math.abs(off.delta.winRate) <= 0.05, `L${level} ${threat}: morale moved win rate by ${(off.delta.winRate * 100).toFixed(1)} points`);
        if (on.report.averageWinRounds && off.report.averageWinRounds) {
            assert.ok(on.report.averageWinRounds <= off.report.averageWinRounds + 0.05, `L${level} ${threat}: won fights got longer with morale`);
        }
    }
});

test("morale shortens fights the party is already winning", () => {
    const [on, off] = runCompare(benchmarkEncounter(5, "severe"), COMPARE_PRESETS.morale(), { runs: 600 });
    assert.ok(on.report.averageWinRounds < off.report.averageWinRounds - 0.3);
});

test("mindless foes never check morale", () => {
    const snapshot = benchmarkEncounter(3, "severe");
    snapshot.combatants = snapshot.combatants.map((c) => (c.side === "foes" ? { ...c, traits: ["mindless"] } : c));
    const report = runBatch(snapshot, { runs: 100 });
    assert.equal(report.moraleChecks, 0);
});

test("protect objective: foes go after the ward", () => {
    const ward = { id: "ward", name: "Ward", side: "party", kind: "object", acts: false, level: 1, hp: { value: 20, max: 20 }, ac: 12, saves: { fortitude: 0, reflex: 0, will: 0 }, strikes: [] };
    const snapshot = benchmarkEncounter(3, "moderate");
    snapshot.combatants.push(ward);
    snapshot.setup = { objective: { kind: "protect", protectId: "ward" } };
    const report = runBatch(snapshot, { runs: 200 });
    assert.ok(report.objectiveRate < 0.95, "the ward should sometimes fall");
    assert.ok(report.objectiveRate > 0.05, "the ward should sometimes survive");
});

test("task objective makes progress and scores", () => {
    const snapshot = benchmarkEncounter(3, "moderate");
    snapshot.setup = { objective: { kind: "task", needed: 3, deadline: 4 } };
    const report = runBatch(snapshot, { runs: 200 });
    assert.ok(report.objectiveRate > 0.3);
});

test("survive objective ends the fight at round N", () => {
    const snapshot = benchmarkEncounter(3, "extreme");
    snapshot.setup = { objective: { kind: "survive", rounds: 2 } };
    const report = runBatch(snapshot, { runs: 200 });
    assert.ok(report.outcomes.survived > 0.5);
    assert.ok(report.averageRounds <= 2.01);
});

test("capture objective switches the party to nonlethal against the target", () => {
    const snapshot = benchmarkEncounter(3, "low");
    snapshot.setup = { objective: { kind: "target", targetId: "foe1", mode: "capture" } };
    const result = simulate(prepareSnapshot(snapshot), {}, 5, { log: true });
    const target = result.foes.find((c) => c.id === "foe1");
    assert.notEqual(target.status, "dead");
});

test("reinforcements arrive on their round", () => {
    const snapshot = benchmarkEncounter(3, "moderate");
    snapshot.combatants.push({ ...moderateCreature(3, "late", "Late"), arrivesRound: 2, arrivesBand: "near" });
    const result = simulate(prepareSnapshot(snapshot), {}, 11, { log: true });
    assert.ok(result.log.some((line) => line.includes("Late arrives")));
    assert.ok(result.rounds >= 2);
});

test("benchmarks: win rates fall in order with threat", () => {
    for (const level of [1, 5]) {
        // (The encounters' own danger, without hero points: since 2026-10-15 a PC rerolls a missed attack with its first point too.)
        const rates = ["trivial", "low", "moderate", "severe", "extreme"].map((threat) => runBatch(benchmarkEncounter(level, threat), { runs: 300, options: { heroPoints: false } }).winRate);
        assert.ok(rates[0] >= 0.95 && rates[1] >= 0.95, `L${level}: trivial/low ${rates}`);
        for (let i = 1; i < rates.length; i++) assert.ok(rates[i] <= rates[i - 1] + 0.02, `L${level}: ${rates}`);
        assert.ok(rates[4] < 0.95, `L${level}: extreme should be dangerous (${rates[4]})`);
    }
});

test("a foe that can't attack (a swarm) still gets beaten instead of stalling the fight", () => {
    const snapshot = benchmarkEncounter(3, "moderate");
    snapshot.combatants.push({ ...moderateCreature(3, "swarm", "Swarm"), strikes: [], resistances: [{ type: "physical", value: 3 }] });
    const report = runBatch(snapshot, { runs: 150 });
    assert.equal(report.outcomes.timeout, 0);
    assert.ok(report.winRate > 0.9);
});

test("monsters do not attack downed PCs by default", () => {
    const party = martialParty(1).slice(0, 2);
    for (let seed = 1; seed <= 20; seed++) {
        const result = simulate(prepareSnapshot({ combatants: [...party, moderateCreature(4, "brute", "Brute")] }), { retreat: false }, seed, { log: true });
        const downed = new Set();
        for (const line of result.log) {
            const down = line.match(/^ {2}(\w+) is down$/);
            if (down) downed.add(down[1]);
            const strike = line.match(/Brute Strike → (\w+):/);
            if (strike && !line.includes("Attack of Opportunity")) assert.ok(!downed.has(strike[1]), `seed ${seed}: struck downed ${strike[1]}`);
        }
    }
});
