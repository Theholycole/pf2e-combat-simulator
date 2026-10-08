// Real-fight log: how logged fights compare with the odds predicted when they
// began. Pure functions over log entries; the Foundry side records them.
//
// An entry: { prediction: { winRate, anyPcDown, anyPcDeath, reliability } | null,
//             actual: { outcome, objective, pcs: [{ name, down, died }], rounds } }

export const OUTCOMES = Object.freeze([
    ["decisive", "Victory: every foe beaten"],
    ["rout", "Victory: the rest fled or surrendered"],
    ["survived", "Survived until the objective ended it"],
    ["held", "Held the area until the objective ended it"],
    ["escaped", "Got away: the escorted creature or the item reached the exit"],
    ["retreat", "The party retreated"],
    ["defeat", "The party was defeated"]
]);

const WINS = new Set(["decisive", "rout", "survived", "held", "escaped"]);

export function isWin(outcome) {
    return WINS.has(outcome);
}

// Best guess at how a fight ended from the creatures' final state, for the
// end-of-fight dialog. pcs/foes: [{ down: bool }] (down = 0 HP, dead or defeated).
export function guessOutcome({ pcs, foes, objectiveKind = null }) {
    const pcsDown = pcs.filter((c) => c.down).length;
    const foesDown = foes.filter((c) => c.down).length;
    if (pcs.length && pcsDown === pcs.length) return "defeat";
    if (!foes.length || foesDown === foes.length) return "decisive";
    if (objectiveKind === "survive") return "survived";
    if (pcsDown >= 2 && foesDown < foes.length / 2) return "retreat";
    return "rout";
}

function score(pairs) {
    if (!pairs.length) return null;
    const brier = pairs.reduce((sum, [p, y]) => sum + (p - y) ** 2, 0) / pairs.length;
    const base = pairs.reduce((sum, [, y]) => sum + y, 0) / pairs.length;
    const baseline = pairs.reduce((sum, [, y]) => sum + (base - y) ** 2, 0) / pairs.length;
    return {
        count: pairs.length,
        predicted: pairs.reduce((sum, [p]) => sum + p, 0) / pairs.length,
        actual: base,
        brier,
        baseline,
        // 1 is perfect, 0 is no better than always guessing the overall rate.
        skill: baseline > 0 ? 1 - brier / baseline : null
    };
}

const BUCKETS = [[0, 0.5, "under 50%"], [0.5, 0.8, "50–80%"], [0.8, 0.95, "80–95%"], [0.95, 1.01, "95% or more"]];

function buckets(pairs) {
    return BUCKETS.map(([low, high, label]) => {
        const inside = pairs.filter(([p]) => p >= low && p < high);
        return {
            label,
            count: inside.length,
            predicted: inside.length ? inside.reduce((sum, [p]) => sum + p, 0) / inside.length : null,
            actual: inside.length ? inside.reduce((sum, [, y]) => sum + y, 0) / inside.length : null
        };
    });
}

export function calibrate(entries, { onlyReliable = false } = {}) {
    const predicted = entries.filter((entry) => entry.prediction && entry.actual?.outcome)
        .filter((entry) => !onlyReliable || entry.prediction.reliability !== "low");
    const winPairs = predicted.map((entry) => [entry.prediction.winRate, isWin(entry.actual.outcome) ? 1 : 0]);
    const downPairs = predicted.map((entry) => [entry.prediction.anyPcDown, entry.actual.pcs.some((pc) => pc.down) ? 1 : 0]);
    const deathPairs = predicted.map((entry) => [entry.prediction.anyPcDeath, entry.actual.pcs.some((pc) => pc.died) ? 1 : 0]);
    const surprises = predicted
        .map((entry) => ({ entry, miss: Math.abs(entry.prediction.winRate - (isWin(entry.actual.outcome) ? 1 : 0)) }))
        .filter(({ miss }) => miss >= 0.7)
        .sort((a, b) => b.miss - a.miss)
        .map(({ entry }) => entry.id);
    return {
        logged: entries.length,
        withPrediction: predicted.length,
        win: score(winPairs),
        winBuckets: buckets(winPairs),
        pcDown: score(downPairs),
        pcDownBuckets: buckets(downPairs),
        pcDeath: score(deathPairs),
        surprises
    };
}
