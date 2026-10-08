// Degrees of success, d20 probabilities and flat checks.

export const CRITICAL_FAILURE = 0;
export const FAILURE = 1;
export const SUCCESS = 2;
export const CRITICAL_SUCCESS = 3;

export const DEGREE_NAMES = Object.freeze(["criticalFailure", "failure", "success", "criticalSuccess"]);

export function degreeOf(total, dc, natural) {
    let degree;
    if (total >= dc + 10) degree = CRITICAL_SUCCESS;
    else if (total >= dc) degree = SUCCESS;
    else if (total <= dc - 10) degree = CRITICAL_FAILURE;
    else degree = FAILURE;
    if (natural === 20) degree = Math.min(CRITICAL_SUCCESS, degree + 1);
    else if (natural === 1) degree = Math.max(CRITICAL_FAILURE, degree - 1);
    return degree;
}

const distributionCache = new Map();

// Probability of each degree for d20 + modifier against dc, as
// [criticalFailure, failure, success, criticalSuccess].
export function degreeDistribution(modifier, dc) {
    const key = (dc - modifier) | 0;
    let cached = distributionCache.get(key);
    if (cached) return cached;
    cached = [0, 0, 0, 0];
    for (let natural = 1; natural <= 20; natural++) {
        cached[degreeOf(natural + modifier, dc, natural)] += 0.05;
    }
    distributionCache.set(key, cached);
    return cached;
}

export function rollCheck(rng, modifier, dc) {
    const natural = rng.d20();
    return { natural, total: natural + modifier, degree: degreeOf(natural + modifier, dc, natural) };
}

export function flatCheck(rng, dc) {
    const natural = rng.d20();
    return degreeOf(natural, dc, natural);
}

// PF2e DCs by level (GM Core table 10-5).
const LEVEL_DCS = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];

export function levelDC(level) {
    const index = Math.max(0, Math.min(LEVEL_DCS.length - 1, Math.round(level)));
    return LEVEL_DCS[index];
}
