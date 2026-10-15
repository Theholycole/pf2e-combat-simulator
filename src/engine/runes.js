// Weapon property runes on a critical hit, keen's critical range and the greater runes' ignored resistances (2026-10-15, from PF2e's own
// rune data; found with the user's champion Riah: "Can we try to simulate her whole character sheet as much as possible"). A Strike carries
// its property runes in strike.iwr.runes (the snapshot's strikeIwr).
import { CRITICAL_SUCCESS, DEGREE_NAMES, FAILURE, SUCCESS, degreeOf } from "./checks.js";
import { isActive, saveModifier } from "./combatant.js";
import { saveBonusAgainst } from "./abilities.js";
import { adjustedSaveDegree } from "./passives.js";
import { log } from "./log.js";

const UNTIL_SOURCE_TURN_END = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" };
const ONE_ROUND = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" };
const MINUTE = { mode: "fixed", value: 1, unit: "minutes" };

// A critical hit's effect, by rune: a save at the rune's DC first where it has one; conditions; a push.
export const RUNE_CRITS = {
    frost: { save: "fortitude", dc: 24, conditions: [["slowed", 1, UNTIL_SOURCE_TURN_END]] },
    greaterFrost: { save: "fortitude", dc: 34, conditions: [["slowed", 1, UNTIL_SOURCE_TURN_END]] },
    brilliant: { save: "fortitude", dc: 29, conditions: [["blinded", null, ONE_ROUND]] },
    greaterBrilliant: { save: "fortitude", dc: 41, conditions: [["blinded", null, ONE_ROUND]] },
    thundering: { save: "fortitude", dc: 24, conditions: [["deafened", null, MINUTE]] },
    greaterThundering: { save: "fortitude", dc: 34, conditions: [["deafened", null, null]] },
    fearsome: { conditions: [["frightened", 1, null]] },
    greaterFearsome: { conditions: [["frightened", 2, null]] },
    crushing: { conditions: [["clumsy", 1, UNTIL_SOURCE_TURN_END], ["enfeebled", 1, UNTIL_SOURCE_TURN_END]] },
    greaterCrushing: { conditions: [["clumsy", 2, UNTIL_SOURCE_TURN_END], ["enfeebled", 2, UNTIL_SOURCE_TURN_END]] },
    impactful: { save: "fortitude", dc: 27, push: 5 },
    greaterImpactful: { save: "fortitude", dc: 37, push: 10 }
};

// The damage types a greater rune's damage ignores resistance to.
export const RUNE_IGNORES = {
    greaterFrost: ["cold"],
    greaterBrilliant: ["fire", "spirit", "vitality"],
    greaterFlaming: ["fire"],
    greaterThundering: ["sonic"],
    greaterShock: ["electricity"],
    greaterCorrosive: ["acid"]
};

const runesOf = (strike) => strike?.iwr?.runes ?? [];

// Keen: a natural 19 that hits with a slashing or piercing weapon is a critical hit.
export function keenCritical(strike, natural, degree) {
    return degree === SUCCESS && natural === 19 && runesOf(strike).includes("keen") && ["slashing", "piercing"].includes(strike?.damage?.[0]?.type);
}

// The resistance types a damage's context ignores (its Strike's runes, as roll options).
export function ignoredResistances(options) {
    const out = new Set();
    for (const [rune, types] of Object.entries(RUNE_IGNORES)) if (options?.has?.(`item:rune:property:${rune}`)) for (const type of types) out.add(type);
    return out;
}

// A critical hit's rune effects on the target. applyCondition and applyMove: the engine's.
export function runeCritEffects(state, attacker, target, strike, { applyCondition, applyMove }) {
    for (const rune of runesOf(strike)) {
        const effect = RUNE_CRITS[rune];
        if (!effect || !isActive(target)) continue;
        if (effect.save) {
            const natural = state.rng.d20();
            const modifier = saveModifier(target, effect.save) + saveBonusAgainst(target, effect.save, { kind: "ability", plan: { traits: ["magical"] } });
            const degree = adjustedSaveDegree(target, effect.save, degreeOf(natural + modifier, effect.dc, natural), { kind: "ability", plan: { traits: ["magical"] } });
            log(state, `  ${target.name} saves against ${attacker.name}'s ${rune.replace(/([A-Z])/g, " $1").toLowerCase()} rune (${effect.save}, DC ${effect.dc}): ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
            if (degree >= SUCCESS) continue;
            // (Thundering: an hour on a critical failure — past the fight either way.)
            if (degree === CRITICAL_SUCCESS || degree > FAILURE) continue;
        }
        for (const [slug, value, duration] of effect.conditions ?? []) {
            if (applyCondition(state, target, slug, value, duration, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""} (${rune.replace(/([A-Z])/g, " $1").toLowerCase()} rune)`);
        }
        if (effect.push) applyMove(state, target, { kind: "push", distance: effect.push });
    }
}
