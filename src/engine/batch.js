// Batches of simulations and the reports built from them.

import { runSeed } from "./rng.js";
import { prepareSnapshot, simulate } from "./fight.js";
import { listRuleIds, mergeMoraleRules, withLosingGate, withRulesDisabled } from "./morale-rules.js";
import { adjustmentVariants, applyAdjustments } from "./adjust.js";
import { reliability, threatRating } from "./encounter.js";

// Held and escaped: a map objective's success ended the fight (O1–O3).
export const WIN_OUTCOMES = new Set(["decisive", "rout", "survived", "held", "escaped"]);
const OUTCOMES = ["decisive", "rout", "survived", "held", "escaped", "defeat", "retreat", "timeout"];

function interval(successes, runs) {
    if (!runs) return [0, 0];
    const p = successes / runs;
    const margin = 1.96 * Math.sqrt(p * (1 - p) / runs);
    return [Math.max(0, p - margin), Math.min(1, p + margin)];
}

// timeBudgetMs: stop early once this much time has passed and at least minRuns
// fights are done (the odds check uses it so big fights stay quick).
export function runBatch(snapshot, { runs = 500, seed = 1, options = {}, logSample = true, onProgress = null, timeBudgetMs = null, minRuns = 50 } = {}) {
    const started = Date.now();
    const results = runFights(snapshot, { runs, seed, options, logSample, onProgress, timeBudgetMs, minRuns });
    return batchReport(snapshot, results, { seed, options, elapsedMs: Date.now() - started });
}

const prepareFor = (snapshot, options) => prepareSnapshot(options.adjust?.length ? applyAdjustments(snapshot, options.adjust) : snapshot);

// The fights of a batch numbered from to to - 1 (each one's dice come from the batch's seed and its number alone, so
// slices run apart, in Foundry's workers, give the same fights). onProgress(done, count) counts this slice's.
export function runFights(snapshot, { runs = 500, seed = 1, options = {}, logSample = true, onProgress = null, timeBudgetMs = null, minRuns = 50, from = 0, to = runs } = {}) {
    const prepared = prepareFor(snapshot, options);
    const runOptions = { ...options, moraleRules: options.moraleRules ?? mergeMoraleRules(prepared.moraleRules) };
    const results = [];
    const started = Date.now();
    const count = to - from;
    for (let index = from; index < to; index++) {
        results.push(simulate(prepared, runOptions, runSeed(seed, index), { log: logSample && index === 0 }));
        const done = index - from + 1;
        if (onProgress && (done % 25 === 0 || done === count)) onProgress(done, count);
        if (timeBudgetMs && done >= minRuns && Date.now() - started > timeBudgetMs) break;
    }
    return results;
}

// The report of a batch from its fights, in their order.
export function batchReport(snapshot, results, { seed = 1, options = {}, elapsedMs = 0 } = {}) {
    const report = buildReport(prepareFor(snapshot, options), results);
    report.elapsedMs = elapsedMs;
    report.seed = seed;
    report.options = { ...options, moraleRules: undefined };
    return report;
}

export function buildReport(snapshot, results) {
    const runs = results.length;
    const outcomes = Object.fromEntries(OUTCOMES.map((key) => [key, 0]));
    let wins = 0;
    let rounds = 0;
    let winRounds = 0;
    let objectiveRuns = 0;
    let objectiveSuccesses = 0;
    let anyDown = 0;
    let anyDeath = 0;
    let heroSpent = 0;
    let moraleChecks = 0;
    let moraleBreaks = 0;
    let groupRouts = 0;
    const party = new Map();
    const foes = new Map();
    for (const result of results) {
        outcomes[result.outcome] = (outcomes[result.outcome] ?? 0) + 1;
        rounds += result.rounds;
        if (WIN_OUTCOMES.has(result.outcome)) {
            wins++;
            winRounds += result.rounds;
        }
        if (result.objective) {
            objectiveRuns++;
            if (result.objective === "success") objectiveSuccesses++;
        }
        if (result.party.some((c) => c.kind === "pc" && c.down)) anyDown++;
        if (result.party.some((c) => c.kind === "pc" && c.dead)) anyDeath++;
        heroSpent += result.stats.heroPointsSpent;
        moraleChecks += result.stats.moraleChecks;
        moraleBreaks += result.stats.moraleBreaks;
        if (result.stats.groupRout) groupRouts++;
        for (const c of result.party) {
            const entry = party.get(c.id) ?? { id: c.id, name: c.name, kind: c.kind, down: 0, dead: 0 };
            if (c.down) entry.down++;
            if (c.dead) entry.dead++;
            party.set(c.id, entry);
        }
        for (const c of result.foes) {
            const entry = foes.get(c.id) ?? { id: c.id, name: c.name, damage: 0, pcsDowned: 0, fled: 0, surrendered: 0, captured: 0, dead: 0 };
            entry.damage += c.damageDealt;
            entry.pcsDowned += c.pcsDowned;
            if (c.status === "fled") entry.fled++;
            if (c.status === "surrendered") entry.surrendered++;
            if (c.status === "captured") entry.captured++;
            if (c.status === "dead") entry.dead++;
            foes.set(c.id, entry);
        }
    }
    const foeRows = [...foes.values()].map((entry) => ({
        ...entry,
        damage: entry.damage / runs,
        pcsDowned: entry.pcsDowned / runs,
        fled: entry.fled / runs,
        surrendered: entry.surrendered / runs,
        captured: entry.captured / runs,
        dead: entry.dead / runs
    }));
    const dangerous = [...foeRows].sort((a, b) => (b.pcsDowned - a.pcsDowned) || (b.damage - a.damage))[0] ?? null;
    return {
        runs,
        winRate: wins / runs,
        winInterval: interval(wins, runs),
        outcomes: Object.fromEntries(Object.entries(outcomes).map(([key, value]) => [key, value / runs])),
        objectiveRate: objectiveRuns ? objectiveSuccesses / objectiveRuns : null,
        averageRounds: rounds / runs,
        averageWinRounds: wins ? winRounds / wins : null,
        anyPcDown: anyDown / runs,
        anyPcDeath: anyDeath / runs,
        party: [...party.values()].map((entry) => ({ ...entry, down: entry.down / runs, dead: entry.dead / runs })),
        foes: foeRows,
        mostDangerous: dangerous,
        heroPointsSpent: heroSpent / runs,
        moraleChecks: moraleChecks / runs,
        moraleBreaks: moraleBreaks / runs,
        groupRoutRate: groupRouts / runs,
        gaps: collectGaps(snapshot),
        threat: threatRating(snapshot),
        reliability: reliability(snapshot),
        sampleLog: results.find((result) => result.log)?.log ?? null
    };
}

function collectGaps(snapshot) {
    const gaps = new Map();
    for (const c of snapshot.combatants) {
        for (const gap of c.gaps ?? []) {
            const key = `${gap.kind}|${gap.name}`;
            const entry = gaps.get(key) ?? { kind: gap.kind, name: gap.name, actors: [] };
            if (!entry.actors.includes(c.name)) entry.actors.push(c.name);
            gaps.set(key, entry);
        }
    }
    return [...gaps.values()].sort((a, b) => b.actors.length - a.actors.length || a.name.localeCompare(b.name));
}

// Variants: [{ name, options }]. Every variant uses the same seeds.
export function runCompare(snapshot, variants, { runs = 500, seed = 1, onProgress = null } = {}) {
    const total = variants.length * runs;
    let done = 0;
    const reports = variants.map((variant) => {
        const report = runBatch(snapshot, {
            runs,
            seed,
            options: variant.options,
            logSample: false,
            onProgress: onProgress ? (count) => onProgress(done + count, total) : null
        });
        done += runs;
        return report;
    });
    return compareFromReports(variants, reports);
}

// A comparison from each variant's batch report (in the variants' order).
export function compareFromReports(variants, batchReports) {
    const reports = variants.map((variant, index) => ({ name: variant.name, report: batchReports[index] }));
    const base = reports[0].report;
    for (const entry of reports) {
        entry.delta = {
            winRate: entry.report.winRate - base.winRate,
            averageRounds: entry.report.averageRounds - base.averageRounds,
            averageWinRounds: (entry.report.averageWinRounds ?? 0) - (base.averageWinRounds ?? 0),
            anyPcDown: entry.report.anyPcDown - base.anyPcDown,
            anyPcDeath: entry.report.anyPcDeath - base.anyPcDeath,
            objectiveRate: entry.report.objectiveRate === null ? null : entry.report.objectiveRate - base.objectiveRate
        };
    }
    return reports;
}

export const COMPARE_PRESETS = Object.freeze({
    morale: () => [
        { name: "Morale on", options: { morale: true } },
        { name: "Morale off", options: { morale: false } }
    ],
    heroPoints: () => [
        { name: "Hero points", options: { heroPoints: true } },
        { name: "No hero points", options: { heroPoints: false } }
    ],
    objective: () => [
        { name: "With objective", options: { objective: true } },
        { name: "Without objective", options: { objective: false } }
    ],
    retreat: () => [
        { name: "Party can retreat", options: { retreat: true } },
        { name: "Party fights on", options: { retreat: false } }
    ]
});

// Per-rule morale impact: the baseline, morale off, and each enabled rule
// switched off on its own. Rules that move the win rate by more than
// flagThreshold are flagged, since morale should not decide fights.
export function runMoraleImpact(snapshot, { runs = 300, seed = 1, flagThreshold = 0.02, onProgress = null } = {}) {
    const variants = moraleImpactVariants(snapshot);
    return moraleImpactFromReports(snapshot, variants, runCompare(snapshot, variants, { runs, seed, onProgress }), { runs, flagThreshold });
}

// Its batches: the baseline, morale off, the gate switched, and each enabled rule switched off.
export function moraleImpactVariants(snapshot) {
    const rules = mergeMoraleRules(snapshot.moraleRules);
    return [
        { name: "Morale on", options: { morale: true, moraleRules: rules } },
        { name: "Morale off", options: { morale: false, moraleRules: rules } },
        { name: "Losing gate", id: "losingGate", options: { morale: true, moraleRules: withLosingGate(rules, !rules.losingGate) } },
        ...listRuleIds(rules).map((rule) => ({ name: rule.label, id: rule.id, options: { morale: true, moraleRules: withRulesDisabled(rules, [rule.id]) } }))
    ];
}

// The impact report from the comparison of those batches.
export function moraleImpactFromReports(snapshot, variants, reports, { runs = 300, flagThreshold = 0.02 } = {}) {
    const rules = mergeMoraleRules(snapshot.moraleRules);
    const baseline = reports[0];
    const off = reports[1];
    const rows = reports.slice(2).map((entry, index) => {
        const variant = variants[index + 2];
        // The gate row shows what switching the optional gate would do; it is not a rule to flag.
        const isGate = variant.id === "losingGate";
        const gateName = rules.losingGate ? "Losing gate (now on; row shows turning it off)" : "Losing gate (now off; row shows turning it on)";
        return {
            id: variant.id,
            name: isGate ? gateName : entry.name,
            winRateChange: baseline.report.winRate - entry.report.winRate,
            roundsChange: baseline.report.averageRounds - entry.report.averageRounds,
            flagged: !isGate && Math.abs(baseline.report.winRate - entry.report.winRate) > flagThreshold
        };
    });
    rows.sort((a, b) => Math.abs(b.winRateChange) - Math.abs(a.winRateChange) || Math.abs(b.roundsChange) - Math.abs(a.roundsChange));
    return {
        runs,
        baseline: baseline.report,
        moraleOff: off.report,
        moraleEffect: {
            winRate: baseline.report.winRate - off.report.winRate,
            averageRounds: baseline.report.averageRounds - off.report.averageRounds,
            averageWinRounds: (baseline.report.averageWinRounds ?? 0) - (off.report.averageWinRounds ?? 0)
        },
        rules: rows
    };
}

// "What would change the odds?": the encounter as it is, then each foe made
// Weak, made Elite, or one of them removed, all on the same dice.
export function runAdjustments(snapshot, { runs = 150, seed = 1, onProgress = null } = {}) {
    const variants = adjustmentRunVariants(snapshot);
    return adjustmentsFromReports(variants, runCompare(snapshot, variants, { runs, seed, onProgress }), { runs });
}

// Its batches: as it is, then each adjustment.
export function adjustmentRunVariants(snapshot) {
    return [{ name: "As it is", options: {} }, ...adjustmentVariants(snapshot).map((variant) => ({ name: variant.name, options: { adjust: variant.adjust } }))];
}

// The "what would change the odds?" report from the comparison of those batches.
export function adjustmentsFromReports(variants, reports, { runs = 150 } = {}) {
    const base = reports[0].report;
    return {
        runs,
        base: { winRate: base.winRate, objectiveRate: base.objectiveRate, anyPcDown: base.anyPcDown, anyPcDeath: base.anyPcDeath },
        rows: reports.slice(1).map((entry, index) => ({
            name: entry.name,
            adjust: variants[index + 1].options.adjust,
            winRate: entry.report.winRate,
            winChange: entry.report.winRate - base.winRate,
            objectiveRate: entry.report.objectiveRate,
            anyPcDown: entry.report.anyPcDown,
            anyPcDeath: entry.report.anyPcDeath
        })).sort((a, b) => b.winRate - a.winRate)
    };
}
