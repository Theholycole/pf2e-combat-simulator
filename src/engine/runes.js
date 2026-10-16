// Weapon property runes on a critical hit, keen's critical range and the greater runes' ignored resistances (2026-10-15, from PF2e's own
// rune data; found with the user's champion Riah: "Can we try to simulate her whole character sheet as much as possible"). A Strike carries
// its property runes in strike.iwr.runes (the snapshot's strikeIwr).
import { CRITICAL_SUCCESS, DEGREE_NAMES, FAILURE, SUCCESS, degreeOf } from "./checks.js";
import { isActive, saveModifier } from "./combatant.js";
import { isUndead, saveBonusAgainst } from "./abilities.js";
import { adjustedSaveDegree } from "./passives.js";
import { log } from "./log.js";

const UNTIL_SOURCE_TURN_END = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" };
const ONE_ROUND = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" };
const MINUTE = { mode: "fixed", value: 1, unit: "minutes" };
// (Greater Vitalizing's "as long as it has the persistent damage from this rune".)
const WHILE_VITALITY = { mode: "while", persistent: "vitality" };

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
    greaterImpactful: { save: "fortitude", dc: 37, push: 10 },
    // (U16: Vitalizing and Greater Vitalizing, PF2e's disrupting runes — on undead and void-healing creatures only.)
    disrupting: { undead: true, conditions: [["enfeebled", 1, UNTIL_SOURCE_TURN_END]] },
    greaterDisrupting: { undead: true, conditions: [["enfeebled", 1, WHILE_VITALITY], ["stupefied", 1, WHILE_VITALITY]] },
    // (2026-10-16, the rest PF2e's rune text gives a critical hit — the item module's list: Flickering's dazzled for 1 round; Merciful's
    // fascinated for 1 minute (its wielder's choice over critical specialization, taken); Nightmare's stupefied 1, frightened 2 as well
    // on one already stupefied; Bloodthirsty's drained 1 on a target taking persistent bleed; Giant-Killing's enfeebled 1 on a giant, the
    // greater rune's Fortitude save instead, by degree with mental damage — its "ignores mental resistance" not kept.)
    flickering: { conditions: [["dazzled", null, ONE_ROUND]] },
    merciful: { conditions: [["fascinated", null, MINUTE]] },
    nightmare: { conditions: [["stupefied", 1, null]], already: { stupefied: [["frightened", 2, null]] } },
    bloodthirsty: { bleeding: true, conditions: [["drained", 1, null]] },
    giantKilling: { trait: "giant", conditions: [["enfeebled", 1, UNTIL_SOURCE_TURN_END]] },
    greaterGiantKilling: { trait: "giant", save: "fortitude", dc: 34, rows: {
        criticalSuccess: { conditions: [["enfeebled", 1, UNTIL_SOURCE_TURN_END]] },
        success: { conditions: [["enfeebled", 2, UNTIL_SOURCE_TURN_END]], damage: { dice: 1, die: 10, type: "mental" } },
        failure: { conditions: [["enfeebled", 2, MINUTE]], damage: { dice: 2, die: 10, type: "mental" } },
        criticalFailure: { conditions: [["enfeebled", 4, MINUTE]], damage: { dice: 4, die: 10, type: "mental" } }
    } }
};

// U16 (2026-10-16; the item module's plan.item.rune): a property rune an item lends a weapon for a while — Burial Oil's Vitalizing,
// Greater Burial Oil's Greater Vitalizing, Oil of Swiftness's Quickstrike — by PF2e's rune key. Its damage from PF2e's rune data (an
// effect's extra damage on that Strike, effect.model.strikeDeltas, against undead and void-healing creatures: vsUndead), its critical hit
// by RUNE_CRITS (effect.model.runeLoans), Quickstrike's quickened while it lasts — its extra action not kept to that weapon's Strikes, as
// Haste's isn't kept to Strike and Stride. Another rune: not yet (the item's left out).
const persistentVitality = (dice) => ({ dice, die: 6, bonus: 0, multiplier: 1, type: "vitality", persistent: true, precision: false, vsUndead: true });
export const RUNE_LOANS = {
    disrupting: { parts: [persistentVitality(1)] },
    greaterDisrupting: { parts: [persistentVitality(2)] },
    speed: { quickened: true }
};
// (The item module's key in PF2e's spelling: "greater-disrupting" is greaterDisrupting.)
export const runeLoanKey = (key) => String(key ?? "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

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
// (U16: with those an item lent it for now.)
const runesHeld = (attacker, strike) => [...runesOf(strike), ...(attacker?.effects ?? []).flatMap((effect) => effect.model?.runeLoans?.[strike?.name] ?? [])];

// Keen: a natural 19 that hits with a slashing or piercing weapon is a critical hit.
export function keenCritical(strike, natural, degree) {
    return degree === SUCCESS && natural === 19 && runesOf(strike).includes("keen") && ["slashing", "piercing"].includes(strike?.damage?.[0]?.type);
}

// The resistance types a Strike's property runes ignore — null for none (damage.js keeps it on the Strike's context).
export function runeIgnores(runes) {
    let out = null;
    for (const rune of runes ?? []) for (const type of RUNE_IGNORES[rune] ?? []) (out ??= new Set()).add(type);
    return out;
}

// The same from a context's roll options (a test's, or one made without strikeContext).
export function ignoredResistances(context) {
    if (context?.ignored !== undefined) return context.ignored;
    return runeIgnores(Object.keys(RUNE_IGNORES).filter((rune) => context?.has?.(`item:rune:property:${rune}`)));
}

// Who a rune's critical hit is for: undead, a giant, a target taking persistent bleed damage.
const critFits = (effect, target) => (!effect.undead || isUndead(target)) && (!effect.trait || (target.traits ?? []).includes(effect.trait))
    && (!effect.bleeding || (target.persistent ?? []).some((entry) => entry.type === "bleed"));

// A critical hit's rune effects on the target. applyCondition, applyMove and applyDamage: the engine's.
export function runeCritEffects(state, attacker, target, strike, { applyCondition, applyMove, applyDamage = null }) {
    // (Merciful's fascinated last: the same hit's other riders aren't a hostile action after it.)
    for (const rune of [...runesHeld(attacker, strike)].sort((a, b) => (a === "merciful") - (b === "merciful"))) {
        const effect = RUNE_CRITS[rune];
        if (!effect || !isActive(target) || !critFits(effect, target)) continue;
        const label = rune.replace(/([A-Z])/g, " $1").toLowerCase();
        // (Nightmare: what it adds on one that's already stupefied, as it was before this hit.)
        const already = Object.entries(effect.already ?? {}).filter(([slug]) => (target.cond?.[slug] ?? 0) > 0).flatMap(([, conditions]) => conditions);
        let conditions = effect.conditions ?? [];
        if (effect.save) {
            const natural = state.rng.d20();
            const modifier = saveModifier(target, effect.save) + saveBonusAgainst(target, effect.save, { kind: "ability", plan: { traits: ["magical"] } });
            const degree = adjustedSaveDegree(target, effect.save, degreeOf(natural + modifier, effect.dc, natural), { kind: "ability", plan: { traits: ["magical"] } });
            log(state, `  ${target.name} saves against ${attacker.name}'s ${label} rune (${effect.save}, DC ${effect.dc}): ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
            // (Greater Giant-Killing: a row for each degree.)
            const row = effect.rows?.[DEGREE_NAMES[degree]];
            if (row) {
                conditions = row.conditions ?? [];
                if (row.damage && applyDamage) {
                    let amount = 0;
                    for (let die = 0; die < row.damage.dice; die++) amount += state.rng.die(row.damage.die);
                    const dealt = applyDamage(state, target, [{ type: row.damage.type, amount, persistent: false, precision: false }], { source: attacker });
                    log(state, `  ${target.name} takes ${dealt} ${row.damage.type} (${label} rune)`);
                }
            } else {
                if (degree >= SUCCESS) continue;
                // (Thundering: an hour on a critical failure — past the fight either way.)
                if (degree === CRITICAL_SUCCESS || degree > FAILURE) continue;
            }
        }
        for (const [slug, value, duration] of [...conditions, ...already]) {
            if (!isActive(target)) break;
            if (applyCondition(state, target, slug, value, duration, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""} (${label} rune)`);
        }
        if (effect.push) applyMove(state, target, { kind: "push", distance: effect.push });
    }
}
