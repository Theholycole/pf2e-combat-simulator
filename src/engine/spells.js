// Spellcasting, through the resolution core (milestone 2, step 4).
//
// A creature's spells come from the snapshot with their compiled plans. The
// core's families resolve a cast into changes, and this file applies the ones
// the simulation models. The planner values a cast by resolving it once per
// degree of success with average damage, weighted by each target's odds.
// Decisions (GM questions, caster choices) take their defaults.
//
// Spell spec (from the snapshot): { name, plan, castRank, dc, attack, pool, traits? }
// pool: a key into the creature's spellPools (slots, focus points, innate
// uses), or null for cantrips and at-will spells.

import { CORE_FAMILIES, createRegistry, healingOf, mechanicalVariants, nativeOf, parseDamage, planWithActions, readPlan } from "../../../pf2e-resolution-core/src/index.js";
import { degreeDistribution, degreeOf, flatCheck, CRITICAL_FAILURE, CRITICAL_SUCCESS, DEGREE_NAMES, SUCCESS } from "./checks.js";
import { ACTIVE, DOWN, armorClass, canAct, canMove, effectBonus, hpFraction, isActive, isOffGuard, saveModifier, statusPenalty, strikeUsable, targetingChance } from "./combatant.js";
import { applyEffect, effectBenefit, effectModel, modifierModel, removeEffect, takeAttackFortune } from "./effects.js";
import { applyDamage, expectedHitDamage, followUpStrike, increaseDying, killCreature, log, performStrike, reactionStrikeAt, releaseSwallowed, stride } from "./actions.js";
import { startLingering, startZone } from "./zones.js";
import { hostility, noteRounds, ownHostility, pacify, pacifyOf, pacifyWorth } from "./pacify.js";
import { addFloor, floorOf } from "./floors.js";
import { counterables, counterChance, counterRank, counterReaches, counterRoll } from "./counteract.js";
import { applyNoteState, noteState, noteStateWorth, spellLocked } from "./note-states.js";
import { allyStrike } from "./commander.js";
import { canReact, isUndead, levelDC, saveBonusAgainst, sizeRank, spendReaction, strikeNamed } from "./abilities.js";
import { adjustedSaveDegree, adjustedSaveOdds, frightenedAfter, offGuardFrom } from "./passives.js";
import { effectImmunity, immuneToCondition } from "./immunities.js";
import { elementalAnswers, hydraScaled, troopIgnores, troopSegmentLost } from "./creature-rules.js";
import { sightDC } from "./environment.js";
import { adjustDamage, adjustInstance, rollStrikeDamage, spellContext, strikeContext } from "./damage.js";
import { distanceBetween, engagedEnemies, leaveMelee, sameMelee } from "./space.js";
import { harmedAfterGivingUp, moraleOdds } from "./morale.js";
import { applyWard, wardBlocks, wardWorth } from "./wards.js";
import { hiddenFrom } from "./sight.js";
import { lastingRounds } from "./lasting.js";
import { takeControl } from "./control.js";
import { noteKnown } from "./readings.js";
import { hexFamiliar } from "./familiars.js";
import { canSpendHero, saveWorthReroll, spendHeroPoint, takesOut } from "./heroes.js";

const SAVE_SLUGS = new Set(["fortitude", "reflex", "will"]);
const registry = createRegistry();
for (const family of CORE_FAMILIES) registry.registerFamily(family);

// Conditions the engine models: valued ones keep the higher value, flags are set.
const VALUED = new Set(["frightened", "sickened", "clumsy", "enfeebled", "drained", "slowed", "stunned", "doomed", "wounded", "stupefied"]);
// A spell's unconscious (Sleep) is "asleep" in the engine: damage wakes it, and it isn't down.
const FLAGS = {
    "off-guard": "offGuard", prone: "prone", fleeing: "fleeing", quickened: "quickened", fatigued: "fatigued",
    paralyzed: "paralyzed", unconscious: "asleep", blinded: "blinded", dazzled: "dazzled",
    // (B103: petrified plays as paralyzed — out of action, for good when it has no duration.)
    petrified: "paralyzed",
    immobilized: "immobilized", restrained: "restrained", grabbed: "grabbed", confused: "confused",
    // On itself (B53): concealed and hidden as attackers find them (Invisible plays as hidden).
    concealed: "concealed", hidden: "hidden", invisible: "hidden",
    // (2026-10-14: fascinated — -2 to Perception and skills, no concentrate actions, ends with hostility to it or its allies;
    // deafened — an auditory action needs a DC 5 flat check.)
    fascinated: "fascinated", deafened: "deafened",
    // (Dominate: it fights for its controller — control.js.)
    controlled: "controlled"
};
export const MODELLED_CONDITIONS = new Set([...VALUED, ...Object.keys(FLAGS), "persistent-damage"]);

// --- What a spell is, read from its plan --------------------------------------

function actionCost(time) {
    const text = String(time ?? "").trim().toLowerCase();
    if (/^[123]$/.test(text)) return Number(text);
    // "1 to 3" (Heal, Force Barrage): two actions, the usual choice.
    const range = /^([123]) to ([123])$/.exec(text);
    if (range) return Math.min(Math.max(2, Number(range[1])), Number(range[2]));
    return null;
}

function rangeFeet(range) {
    const text = String(range ?? "").toLowerCase();
    if (!text) return null;
    if (text.includes("touch")) return 5;
    const feet = /(\d+)\s*(?:feet|foot|ft)/.exec(text);
    if (feet) return Number(feet[1]);
    const miles = /(\d+)\s*miles?/.exec(text);
    if (miles) return Infinity;
    if (/planetary|unlimited|sight/.test(text)) return Infinity;
    return null;
}

function targetCount(target) {
    const text = String(target ?? "").toLowerCase();
    if (!text) return 0;
    // (Dispel Magic: "1 spell effect" — on a creature.)
    if (!/creature|enem|foe|target|object|construct|undead|animal|humanoid|beast|fiend|spirit|dragon|spell effect/.test(text)) return 0;
    const upTo = /up to (\d+|one|two|three|four|five|six|ten)/.exec(text);
    const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, ten: 10 };
    if (upTo) return Number(upTo[1]) || words[upTo[1]] || 1;
    const orMore = /(\d+) or (\d+)/.exec(text);
    if (orMore) return Number(orMore[2]);
    const count = /^(\d+)\s/.exec(text);
    return count ? Number(count[1]) : 1;
}

// { actions, range, touch, area, targets, attack, check } for a plan; actions
// is null when the spell can't be cast on the creature's own turn in a fight
// (reactions, free actions, long casting times). Read once per plan.
// actions: one of PF2e's action variants (resolution.byActions), if the spell has them.
const described = new WeakMap();

export function describeSpell(plan, actions) {
    if (!plan || typeof plan !== "object") return readSpell(plan);
    let byActions = described.get(plan);
    if (!byActions) {
        byActions = new Map();
        described.set(plan, byActions);
    }
    const key = actions ?? 0;
    let description = byActions.get(key);
    if (!description) {
        description = readSpell(plan, actions);
        byActions.set(key, description);
    }
    return description;
}

// The action counts a spell can be cast with: its PF2e variants, or its one cost. Read once per spell (frozen: shared).
const VARIANTS = new WeakMap();
export function spellVariants(spell) {
    if (!spell || typeof spell !== "object") return readVariants(spell);
    let variants = VARIANTS.get(spell);
    if (!variants) {
        variants = Object.freeze(readVariants(spell));
        VARIANTS.set(spell, variants);
    }
    return variants;
}

function readVariants(spell) {
    const variants = Object.keys(nativeOf(spell?.plan).byActions ?? {}).map(Number).filter((count) => count >= 1 && count <= 3).sort((a, b) => a - b);
    if (variants.length && describeSpell(spell.plan).actions !== null) return variants;
    const actions = describeSpell(spell?.plan).actions;
    return actions ? [actions] : [];
}

function readSpell(base, actions) {
    const plan = nativeOf(base).byActions ? planWithActions(base, actions) : base;
    const targeting = plan?.targeting ?? {};
    // PF2e spell effects the compiler found for a spell left to PF2e's card (Bless).
    const applications = Array.isArray(nativeOf(plan).applications) ? nativeOf(plan).applications : [];
    const areaSource = targeting.area?.type ? targeting.area : applications.find((application) => application.area)?.area;
    // (B229: "each foe within 5 feet" — an emanation on its foes only.)
    const area = areaSource?.type && Number(areaSource.value) > 0 ? { type: areaSource.type, value: Number(areaSource.value), ...(areaSource.foes ? { foes: true } : {}) } : null;
    // The plan's check, or for a spell left to PF2e's own card ("unsupported"),
    // the native one or its first variant's (Lay on Hands vs. undead).
    const variants = mechanicalVariants(plan);
    const nativeCheck = nativeOf(plan).check ?? variants.find((variant) => variant.check)?.check;
    const check = plan?.resolution ? readPlan(plan).resolution.check ?? (nativeCheck ? readPlan({ resolution: { check: nativeCheck } }).resolution.check : null) : null;
    const statistic = check?.statistic;
    const healingVariant = variants.find((variant) => variant.healing?.components?.length);
    const healing = healingOf(plan) ? healingOf(plan).recipients ?? "any" : healingVariant ? healingVariant.healing.recipients ?? "any" : null;
    const kind = plan?.resolution?.kind;
    // (2026-10-14: a condition on its recipients — Invisibility, Blur on a target; Dirge of Doom on the enemies around.)
    const conditionNote = kind === "condition-note" ? plan.resolution.conditionNote ?? null : null;
    const helpsWith = conditionNote && NOT_HARMFUL.has(conditionNote.condition?.slug) && conditionNote.recipient !== "area-enemies";
    return {
        actions: plan?.castActions ?? actionCost(plan?.activation?.time),
        range: rangeFeet(targeting.range),
        touch: /touch/i.test(String(targeting.range ?? "")),
        // (B133, Tackle: a move first — that many Strides to reach the creature.)
        approach: Number(plan?.approach?.strides) || 0,
        // (B134: less than a Stride — "up to 10 feet", "up to half its Speed".)
        approachFeet: Number(plan?.approach?.feet) || null,
        approachHalf: Boolean(plan?.approach?.half),
        area,
        // (S55, Chain Lightning: its first target and the foes it arcs on to — as many as there are.)
        targets: area ? 0 : targeting.allies ? 1 : plan?.resolution?.chain ? 12 : targetCount(targeting.target),
        attack: statistic === "spell-attack" || statistic === "strike" || (check?.roll === "skill" && (plan?.traits ?? []).includes("attack") && plan?.trigger?.map !== false),
        // Abilities: when they're used, how often, and on whom.
        event: plan?.trigger?.event ?? "use",
        recharge: plan?.trigger?.recharge?.formula ?? null,
        immunity: Boolean(plan?.trigger?.immunity),
        // The results that make a target immune ("Critical Success … temporarily immune"); null: all of them.
        immunityDegrees: plan?.trigger?.immunity?.degrees ?? null,
        grabbedTargets: Boolean(targeting.grabbed),
        // Swallow Whole: the largest size it can swallow; Trample: { size, strides }.
        swallow: Object.values(plan?.resolution?.outcomes ?? {}).some((outcome) => outcome?.effects?.some((effect) => effect.kind === "swallow")) ? targeting.size ?? "medium" : null,
        trample: targeting.trample ?? null,
        // Administer First Aid, Stabilize: dying allies.
        dying: Boolean(targeting.dying) || kind === "stabilize",
        escape: plan?.source?.slug === "escape",
        manipulate: (plan?.activation?.traits ?? plan?.traits ?? []).includes("manipulate"),
        nonlethal: (plan?.traits ?? []).includes("nonlethal"),
        check,
        // Who its healing reaches: "living", "undead", "willing" or "any"; null when it doesn't heal.
        healing,
        // A PF2e spell effect on its targets: aimed at allies as readily as at foes.
        // (Dispel Magic, Clear Mind: an ally's hindrance as readily as a foe's help.)
        // (Sanctuary: a ward on an ally.)
        helpful: kind === "effect" || applications.length > 0 || Boolean(helpsWith) || kind === "affliction-care" || kind === "attack-ward",
        // No target, range or area: the caster itself (the battle forms).
        self: targeting.target === "self" || (kind === "effect" && !area && !targeting.target && !targeting.range) || (applications.length > 0 && !area && applications.every((application) => application.recipients === "self")) || conditionNote?.recipient === "source" || (kind === "affliction-care" && plan.resolution.recipient === "self")
    };
}

// How many creatures an area catches when they're bunched in a Melee.
export function areaCapacity(area) {
    const size = area.value;
    switch (area.type) {
        case "cone":
            return size >= 60 ? 8 : size >= 30 ? 5 : size >= 15 ? 3 : 2;
        case "line":
            return size >= 120 ? 6 : size >= 60 ? 4 : size >= 30 ? 3 : 2;
        default:
            // bursts, emanations, cylinders
            return size >= 30 ? 10 : size >= 20 ? 8 : size >= 15 ? 6 : size >= 10 ? 4 : 2;
    }
}

// --- Resolving through the core ----------------------------------------------

const SKILLS = new Set(["acrobatics", "arcana", "athletics", "crafting", "deception", "diplomacy", "intimidation", "medicine", "nature", "occultism", "performance", "religion", "society", "stealth", "survival", "thievery"]);

// A creature's modifier for a skill, Perception or its unarmed attack (its
// stat block's; an unlisted skill falls back on the nearest save, −2).
export function skillValue(c, slug) {
    if (slug === "perception") return c.perception ?? 0;
    if (slug === "unarmed") return Math.max(0, ...(c.strikes ?? []).filter((strike) => strike.melee).map((strike) => strike.bonus));
    const listed = c.skills?.[slug];
    if (Number.isFinite(listed)) return listed;
    return (c.saves?.[{ athletics: "fortitude", acrobatics: "reflex" }[slug] ?? "will"] ?? 0) - 2;
}

// A creature's DC for a statistic a check is made against (its Fortitude, Reflex, Will, Perception or a skill).
export function defenceDC(c, slug) {
    if (slug === "stabilize") return 20 + (c.cond.dying ?? 0);
    if (slug === "fortitude" || slug === "reflex" || slug === "will") return 10 + saveModifier(c, slug);
    if (slug === "ac") return armorClass(c);
    return 10 + skillValue(c, slug) - statusPenalty(c, "skill");
}

// Escaping an Engulf: its listed Escape DC rather than the monster's Athletics DC.
function escapeDCAgainst(caster, target, spell, actions) {
    if (caster?.swallowedBy !== target?.id || !caster.swallow?.escapeDC) return null;
    return describeSpell(spell?.plan, actions)?.escape ? caster.swallow.escapeDC : null;
}

// Disarm against a creature whose grip it already weakened: +2 (as a DC 2 lower).
function disarmBonus(spell, target) {
    if (!target.weakGrip?.size) return 0;
    return Object.values(spell.plan?.resolution?.outcomes ?? {}).some((outcome) => outcome?.effects?.some((effect) => effect.kind === "disarm")) ? 2 : 0;
}

// (B280: a Lore, the Hellbound attorney's Legal Lore — its listed value, or the usual fallback.)
function isCheckStatistic(slug) {
    return SKILLS.has(slug) || slug === "perception" || slug === "unarmed" || /-lore$/.test(String(slug));
}

// attacks: Strikes and spell attacks made earlier this turn (planned or real).
function simContext(state, caster, spell, targets, attacks = caster.attacksThisTurn ?? 0, actions = undefined) {
    const checkPenalty = statusPenalty(caster, "spell");
    const mapPenalty = () => (attacks <= 0 ? 0 : attacks === 1 ? 5 : 10);
    return {
        caster,
        targets,
        castRank: spell.castRank,
        actions,
        id: (c) => c.id,
        statistic: (c, slug) => {
            // (B302: off-guard to the caster by its own passive — Surprise Attack's spell attacks.)
            if (slug === "ac") return { dc: armorClass(c, { flanked: c !== caster && offGuardFrom(state, caster, c, { spell: true }) }) };
            // Spell attacks have the attack trait, so the multiple attack penalty applies.
            if (slug === "spell") return { modifier: (spell.attack ?? 0) - checkPenalty - mapPenalty() + effectBonus(c, "spell") + effectBonus(c, "attack"), dc: (spell.dc ?? 10) - checkPenalty + effectBonus(c, "spell") };
            if (slug === "strike") return { modifier: Math.max(0, ...(c.strikes ?? []).map((strike) => strike.bonus)) - checkPenalty - mapPenalty() + effectBonus(c, "attack") };
            if (slug === "fortitude" || slug === "reflex" || slug === "will") {
                // +1 status to all saves vs. magic and the like, against this spell or ability.
                const modifier = saveModifier(c, slug) + (c !== caster ? saveBonusAgainst(c, slug, spell) : 0);
                if (slug === "reflex" && c !== caster && disarmBonus(spell, c)) return { modifier, dc: 10 + saveModifier(c, slug) - disarmBonus(spell, c) };
                return { modifier };
            }
            if (slug === "stabilize") return { modifier: 0, dc: defenceDC(c, slug) };
            // A check with a fixed modifier of its own (a special attack, Hurl Net; B128): the actor's penalties and the multiple attack penalty.
            if (slug === "fixed-check") return { modifier: -statusPenalty(c, "skill") - (describeSpell(spell.plan, actions).attack ? mapPenalty() : 0) };
            // A skill check: the actor's roll (with the multiple attack penalty
            // for an attack-trait action), or another creature's DC.
            if (isCheckStatistic(slug)) {
                if (c === caster) return { modifier: skillValue(c, slug) - statusPenalty(c, "skill") - (describeSpell(spell.plan, actions).attack ? mapPenalty() : 0) };
                // (B105: its reaction making the Escape harder, Tighten Coils.)
                return { modifier: skillValue(c, slug) - statusPenalty(c, "skill"), dc: (escapeDCAgainst(caster, c, spell, actions) ?? defenceDC(c, slug)) + (c.escapeGuardActive ?? 0) };
            }
            return null;
        },
        traits: (c) => c.traits ?? [],
        iwr: (c) => ({ immunities: c.immunities ?? [] }),
        voidHealing: (c) => c.voidHealing ?? (c.traits ?? []).includes("undead"),
        allied: (a, b) => a.side === b.side
    };
}

// For a damage-type decision (Telekinetic Projectile, Murmuration): the type
// that does the most to the enemy targets after their defences.
function chooser(caster, targets) {
    return (decision) => {
        if (!/^(damage-type|caster-choice:damage-type)/.test(decision.id)) return undefined;
        const foes = targets.filter((target) => target.side !== caster.side);
        if (!foes.length) return undefined;
        let best;
        let bestValue = -Infinity;
        for (const option of decision.options) {
            const value = foes.reduce((sum, target) => sum + adjustInstance(target, option.value, 10), 0);
            if (value > bestValue) {
                best = option.value;
                bestValue = value;
            }
        }
        return best;
    };
}

function liveRoller(state) {
    return {
        roll(statistic, options) {
            let natural = state.rng.d20();
            // (B286, Twice for Bad Luck: a save rolled twice, the worse kept — the core's misfortune; fortune the better.)
            if (Boolean(options?.fortune) !== Boolean(options?.misfortune)) {
                const second = state.rng.d20();
                natural = options.fortune ? Math.max(natural, second) : Math.min(natural, second);
            }
            const total = natural + options.modifier;
            return { natural, total, dc: options.dc, degree: DEGREE_NAMES[degreeOf(total, options.dc, natural)] };
        },
        damage(instance) {
            let total = instance.constant;
            for (const term of instance.dice) {
                let rolled = 0;
                for (let i = 0; i < term.count; i++) rolled += state.rng.die(term.die);
                total += term.factor * rolled;
            }
            return Math.max(0, Math.floor(total));
        }
    };
}

// The damage of a creature's best hit on a target (melee only, if asked).
function bestHit(c, target, meleeOnly) {
    let best = 0;
    for (const strike of c.strikes ?? []) {
        if ((meleeOnly && !strike.melee) || !strikeUsable(c, strike)) continue;
        best = Math.max(best, expectedHitDamage(c, strike, target, false));
    }
    return best;
}

// A failed save made better by a reaction (B80): Cat's Luck (its own save of that kind rerolled, the better kept, once a fight), Golden
// Luck (its own, one degree better), Word of Wisdom (an ally's within its distance, one degree better); those two not again for their
// recharge (1d4 rounds). The result as it stands otherwise.
const SAVES = new Set(["fortitude", "reflex", "will"]);
function betterSave(state, statistic, options, result, spell = null, { area = false } = {}) {
    const saver = options?.actor;
    // (B110, Occult Ward: a bonus to its own save as it comes, against a spell (or any): its reaction on the first such save, the bonus
    // in the result.)
    const ward = saver?.saveBonusReaction;
    if (ward && SAVES.has(statistic) && (!ward.kind || ward.kind === statistic) && (!ward.area || area) && saver?.id && isActive(saver) && canReact(saver) && Number.isFinite(result?.total) && Number.isFinite(options?.dc) && (!ward.against || (["spell", "magical"].includes(ward.against) && ((spell && (!spell.kind || spell.kind === "spell")) || (ward.against === "magical" && (spell?.plan?.traits ?? []).some((trait) => ["magical", "arcane", "divine", "occult", "primal"].includes(trait))))) || (!["spell", "magical"].includes(ward.against) && (spell?.plan?.traits ?? []).includes(ward.against)))) {
        saver.reactionUsed = true;
        state.stats.reactions++;
        const total = result.total + ward.value;
        result = { ...result, total, degree: DEGREE_NAMES[degreeOf(total, options.dc, result.natural)] };
        log(state, `  ${saver.name} uses ${ward.name}: +${ward.value} to the save`);
    }
    // (B125: an ally's bonus to the save as it comes — Stay Strong!'s animals, Free Mind's mental effects and its success made critical.)
    const traits = spell?.plan?.traits ?? [];
    const near = (c, within) => within >= 60 || (within <= 10 ? sameMelee(c, saver) : saver.band !== "far" || c.band === "far");
    if (SAVES.has(statistic) && saver?.id && isActive(saver) && Number.isFinite(result?.total) && Number.isFinite(options?.dc)) {
        const helper = state.list.find((c) => c !== saver && c.side === saver.side && c.allySaveBonus && isActive(c) && canReact(c) && near(c, c.allySaveBonus.within)
            && (!c.allySaveBonus.against || traits.includes(c.allySaveBonus.against)) && (!c.allySaveBonus.animal || (saver.traits ?? []).includes("animal")));
        if (helper) {
            const rule = helper.allySaveBonus;
            const total = result.total + rule.value;
            let degree = DEGREE_NAMES[degreeOf(total, options.dc, result.natural)];
            if (rule.upgrade && degree === "success") degree = "criticalSuccess";
            if (degree !== result.degree) {
                helper.reactionUsed = true;
                state.stats.reactions++;
                log(state, `  ${helper.name} uses ${rule.name}: +${rule.value} to ${saver.name}'s save`);
                result = { ...result, total, degree };
            }
        }
    }
    // (B168, Drowning Drone, Cautionary Tale: its skill check as the save is attempted — its reaction, once for one effect, that one result for
    // each save it covers — the higher total resolving the effect.)
    if (SAVES.has(statistic) && saver?.id && isActive(saver) && Number.isFinite(result?.total) && Number.isFinite(options?.dc)) {
        const key = `${state.round}:${spell?.name ?? statistic}`;
        const singer = state.list.find((c) => c.saveSkill && c.side === saver.side && isActive(c) && (!c.saveSkill.save || c.saveSkill.save === statistic) && (!c.saveSkill.against || c.saveSkill.against.some((trait) => traits.includes(trait)))
            && (c === saver || (c.saveSkill.ally && near(c, c.saveSkill.within) && (!c.saveSkill.allyTrait || (saver.traits ?? []).includes(c.saveSkill.allyTrait))))
            && (c.saveSkillRoll?.key === key || canReact(c)));
        if (singer) {
            if (singer.saveSkillRoll?.key !== key) {
                singer.reactionUsed = true;
                state.stats.reactions++;
                const natural = state.rng.d20();
                singer.saveSkillRoll = { key, natural, total: natural + skillValue(singer, singer.saveSkill.skill) - statusPenalty(singer, "skill") };
                log(state, `  ${singer.name} uses ${singer.saveSkill.name}: ${singer.saveSkill.skill} ${singer.saveSkillRoll.total}`);
            }
            const { natural, total } = singer.saveSkillRoll;
            if (total > result.total) result = { natural, total, dc: options.dc, degree: DEGREE_NAMES[degreeOf(total, options.dc, natural)] };
        }
    }
    if (!SAVES.has(statistic) || !saver?.id || !["failure", "criticalFailure"].includes(result?.degree) || !isActive(saver)) return result;
    // (B125: an ally's failed save rerolled, keeping the better — against the effects it names, or its kind of save.)
    // (B220, Second Chance: a free action once a round, not a reaction.)
    const rerolls = state.list.find((c) => c.allySaveReroll && (c !== saver || c.allySaveReroll.self) && c.side === saver.side && isActive(c) && (c.allySaveReroll.free ? (!c.allySaveReroll.perRound || c.allySaveRerollRound !== state.round) : canReact(c)) && (c.allySaveRerollsUsed ?? 0) < c.allySaveReroll.uses
        && (c === saver || near(c, c.allySaveReroll.within)) && (!c.allySaveReroll.save || c.allySaveReroll.save === statistic) && (!c.allySaveReroll.against || c.allySaveReroll.against.some((trait) => traits.includes(trait))));
    if (rerolls) {
        if (rerolls.allySaveReroll.free) rerolls.allySaveRerollRound = state.round;
        else rerolls.reactionUsed = true;
        rerolls.allySaveRerollsUsed = (rerolls.allySaveRerollsUsed ?? 0) + 1;
        state.stats.reactions++;
        const natural = state.rng.d20();
        const total = natural + options.modifier;
        const rolled = DEGREE_NAMES[degreeOf(total, options.dc, natural)];
        // (B181: a critical failure on the reroll a failure.)
        const degree = rerolls.allySaveReroll.floor === "failure" && rolled === "criticalFailure" ? "failure" : rolled;
        log(state, `  ${rerolls.name} uses ${rerolls.allySaveReroll.name}: ${saver.name} rerolls, ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        // (B220, Second Chance: the new result, whatever it is.)
        if (rerolls.allySaveReroll.keep === "new" || DEGREE_NAMES.indexOf(degree) > DEGREE_NAMES.indexOf(result.degree)) return { natural, total, dc: options.dc, degree };
        return result;
    }
    const reroll = saver.saveReroll;
    if (reroll && (!reroll.save || reroll.save === statistic) && (reroll.against !== "spell" || (spell && (!spell.kind || spell.kind === "spell"))) && (!reroll.againstTrait || traits.includes(reroll.againstTrait)) && (saver.saveRerollUses ?? 0) > 0 && (reroll.free || canReact(saver)) && (!reroll.mythic || (saver.mythicPoints ?? 0) > 0)) {
        saver.saveRerollUses--;
        if (reroll.mythic) saver.mythicPoints--;
        if (!reroll.free) saver.reactionUsed = true;
        state.stats.reactions++;
        const natural = state.rng.d20();
        const total = natural + options.modifier + (reroll.bonus ?? 0);
        const degree = DEGREE_NAMES[degreeOf(total, options.dc, natural)];
        log(state, `  ${saver.name} uses ${reroll.name}: ${degree.replace(/([A-Z])/g, " $1").toLowerCase()} on the reroll`);
        return reroll.keep === "new" || DEGREE_NAMES.indexOf(degree) > DEGREE_NAMES.indexOf(result.degree) ? { natural, total, dc: options.dc, degree } : result;
    }
    const ready = (c) => (c.saveBoostUntil ?? -Infinity) <= state.round && (c === saver && saver.saveBoost?.free ? true : canReact(c));
    const ownBoost = saver.saveBoost && (!Number.isFinite(saver.saveBoostUses) || saver.saveBoostUses > 0) && (!saver.saveBoost.criticalOnly || result.degree === "criticalFailure")
        && (!saver.saveBoost.failureOnly || result.degree === "failure") && (!saver.saveBoost.save || saver.saveBoost.save === statistic) && (!saver.saveBoost.against || saver.saveBoost.against.some((trait) => traits.includes(trait)));
    const helper = ownBoost && ready(saver) ? saver
        : state.list.find((c) => c !== saver && c.side === saver.side && isActive(c) && c.allySaveBoost && ready(c) && (c.allySaveBoost.within >= 60 || (c.allySaveBoost.within <= 10 ? sameMelee(c, saver) : saver.band !== "far" || c.band === "far"))
            // (B226, Light of Diligence: only a critical failure; each ally once.)
            && (!c.allySaveBoost.criticalOnly || result.degree === "criticalFailure") && !(c.allySaveBoost.perAlly && c.allySaveBoostGiven?.has(saver.id)));
    if (!helper) return result;
    const boost = helper === saver ? saver.saveBoost : helper.allySaveBoost;
    if (helper !== saver && boost.perAlly) (helper.allySaveBoostGiven ??= new Set()).add(saver.id);
    if (!boost.free) helper.reactionUsed = true;
    if (helper === saver && Number.isFinite(saver.saveBoostUses)) saver.saveBoostUses--;
    if (boost.recharge) helper.saveBoostUntil = state.round + rollCount(state, boost.recharge);
    state.stats.reactions++;
    const degree = boost.toSuccess ? "success" : DEGREE_NAMES[Math.min(3, DEGREE_NAMES.indexOf(result.degree) + 1)];
    log(state, `  ${helper.name} uses ${boost.name}: ${saver.name}'s save ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
    // (B132, Gardener's Resolve: the damage it takes for it.)
    if (boost.selfDamage) applyDamage(state, helper, rollInstances(state, parseDamage(boost.selfDamage)), { source: helper });
    return { ...result, degree };
}

// A persistent-damage change as the engine's persistent instance.
function persistentInstance(damage) {
    const terms = damage.dice ?? [];
    const die = terms[0]?.die;
    const sameDie = terms.length && terms.every((term) => term.die === die && Number.isInteger(term.factor) && term.factor > 0);
    if (sameDie) return { type: damage.type, persistent: true, dice: terms.reduce((sum, term) => sum + term.count * term.factor, 0), die, bonus: damage.constant ?? 0, multiplier: 1, amount: damage.amount };
    return { type: damage.type, persistent: true, amount: damage.amount };
}

function durationRounds(duration) {
    if (!duration || duration.mode !== "fixed") return Infinity;
    const value = Number.isFinite(Number(duration.value)) ? Number(duration.value) : 1;
    if (duration.unit === "rounds") return value;
    if (duration.unit === "minutes") return value * 10;
    return Infinity;
}

// Sets a condition from a spell; a fixed duration ends it at the start of the
// caster's turn that many rounds later. false when the engine doesn't model it.
const NOT_HARMFUL = new Set(["off-guard", "quickened", "concealed", "hidden", "invisible"]);

// What two Strikes that both hit bring (B104: "If they both hit, the target becomes Slowed 1 for 1 round", "… is also dealt 1d8 persistent
// bleed damage"): its conditions (for their rounds, on the attacker's turns) and damage, on the creature both hit.
export function bothHitRider(state, attacker, target, rider, { said = "Both Strikes hit" } = {}) {
    if (!isActive(target)) return;
    if (said) log(state, `  ${said} ${target.name}`);
    // (C34, Infernal Interference: no reactions until the attacker's next turn begins.)
    if (rider.noReactions) {
        target.reactionLocks = [...(target.reactionLocks ?? []).filter((held) => held.by !== attacker.id), { by: attacker.id, spell: "no reactions", untilRound: state.round + 1, ownTurn: false, sustained: false }];
        log(state, `  ${target.name} can't use reactions`);
    }
    for (const entry of rider.conditions ?? []) {
        const duration = entry.rounds ? { mode: "fixed", value: entry.rounds, unit: "rounds", expiry: "turn-start", anchor: "source-turn" } : null;
        if (applyCondition(state, target, entry.slug, entry.value ?? null, duration, attacker)) log(state, `  ${target.name} is ${entry.slug}${Number.isFinite(entry.value) ? ` ${entry.value}` : ""}`);
    }
    for (const formula of rider.damage ?? []) {
        const parsed = parseDamage(formula);
        const rolled = rollInstances(state, parsed);
        // (Persistent damage as the engine's persistent instance, dealt at the end of its turns.)
        const instances = parsed.map((instance, index) => (instance.category === "persistent" ? persistentInstance({ ...instance, amount: rolled[index].amount }) : rolled[index]));
        const dealt = applyDamage(state, target, instances, { source: attacker });
        log(state, `  ${target.name} ${instances.some((instance) => instance.persistent) ? `takes persistent ${instances.find((instance) => instance.persistent).type}` : `takes ${dealt} more`}`);
    }
    // (B112, Claw Rake: "the target takes extra damage equal to one claw Strike": that Strike's damage rolled again.)
    if (rider.strikeDamage && isActive(target)) {
        const index = strikeNamed(attacker, rider.strikeDamage);
        if (index >= 0) {
            const dealt = applyDamage(state, target, rollStrikeDamage(state.rng, attacker.strikes[index], { critical: false }).map((instance) => ({ ...instance, context: strikeContext(attacker, attacker.strikes[index]) })), { source: attacker });
            log(state, `  ${target.name} takes ${dealt} more`);
        }
    }
    // (B198, Gory Rend: "… and is exposed to piscovenom" — its affliction, the rider its Strikes would carry, at the creature.)
    if (rider.affliction && isActive(target)) {
        const index = (attacker.spells ?? []).findIndex((spell) => spell.plan?.trigger?.attackEffect === rider.affliction || String(spell.name ?? "").toLowerCase() === rider.affliction);
        if (index >= 0) castSpell(state, attacker, index, [target.id]);
    }
    // (B110, Dual Disarm: "If both Strikes hit, … can attempt to Disarm the target": its own basic action.)
    if (rider.follow && isActive(target) && canAct(attacker)) {
        const index = (attacker.spells ?? []).findIndex((spell) => spell.kind === "basic" && (spell.plan?.source?.slug === rider.follow || String(spell.name ?? "").toLowerCase() === rider.follow));
        if (index >= 0) castSpell(state, attacker, index, [target.id]);
    }
}

// A condition that grows with each later failure (B102: "the condition value increases by 1 (to a maximum of stupefied 4)"): what it
// already has plus the stack, to its maximum; its own value when it has none. (after: the value it has now, for the log.)
function stackedValue(target, change, after = false) {
    if (after) return target.cond[change.slug] ?? change.value;
    const now = Number(target.cond[change.slug]) || 0;
    if (!change.stack || now <= 0 || !Number.isFinite(change.value)) return change.value;
    return Math.min(change.stack.max ?? Infinity, now + (Number(change.stack.by) || 1));
}

export function applyCondition(state, target, slug, value, duration, source, scope = null) {
    // M38: a hostile condition from the party on a foe that gave up and is leaving refuses its surrender.
    if (source && source.side !== target.side) {
        harmedAfterGivingUp(state, target, source);
        hostility(state, target, source);
    }
    // Off-guard to one creature's attacks only (Feint, Create a Diversion).
    if (slug === "off-guard" && scope?.attacker) {
        const entry = { attacker: scope.attacker, attacks: scope.attacks ?? "any", uses: scope.uses ?? null };
        target.offGuardTo = [...(target.offGuardTo ?? []), entry];
        const rounds = durationRounds(duration);
        if (Number.isFinite(rounds)) (target.timers ??= []).push({ offGuardTo: entry, round: state.round + rounds, turnOf: source?.id ?? target.id, at: duration?.expiry === "turn-end" ? "end" : "start" });
        return true;
    }
    const flag = FLAGS[slug];
    if (!VALUED.has(slug) && !flag) return false;
    // (I1: a creature immune to the condition.)
    if (immuneToCondition(target, slug)) return false;
    // (T7: a condition that takes a troop's segment out of the fight costs it a threshold instead.)
    if (target.troop && troopSegmentLost(state, target, slug)) {
        if (target.hp.value <= 0 && isActive(target)) killCreature(state, target);
        return false;
    }
    // (B302, Bravery: "any time it gains the Frightened condition, reduce its value by 1".)
    if (slug === "frightened" && target.lessFrightened) {
        value = (Number.isFinite(value) ? value : 1) - target.lessFrightened;
        if (value <= 0) return false;
    }
    // Shake It Off, Slough Skin (B77; the user's choice): the first harmful condition an enemy gives it, negated with its reaction.
    const negate = target.negateCondition;
    if (negate && (target.negateConditionUses ?? 0) > 0 && source && source.side !== target.side && !NOT_HARMFUL.has(slug) && (!negate.conditions || negate.conditions.includes(slug)) && isActive(target) && canReact(target)) {
        target.negateConditionUses--;
        target.reactionUsed = true;
        // (B226, Fearless Rush: the value lower, then a Stride toward the creature that frightened it.)
        if (negate.reduceBy) {
            const lower = (Number.isFinite(value) ? value : 1) - negate.reduceBy;
            log(state, `  ${target.name} uses ${negate.name}: ${slug} ${Math.max(0, lower)}`);
            if (negate.stride && isActive(source) && !sameMelee(target, source) && canMove(target)) stride(state, target, { kind: "engage", targetId: source.id });
            if (lower <= 0) return false;
            value = lower;
        } else {
            log(state, `  ${target.name} uses ${negate.name}: not ${slug}`);
            return false;
        }
    }
    // "As long as it's sickened" (Stench), "fleeing as long as it's frightened": ends when that condition does.
    if (duration?.mode === "while" && duration.condition) (target.whileConditions ??= []).push({ slug, value, while: duration.condition });
    // Fleeing with no stated end (Vision of Death, Aversion Beam): while it's frightened, or else its next turn (user, 2026-10-08).
    else if (slug === "fleeing" && !duration) (target.whileConditions ??= []).push({ slug, value, while: "frightened" });
    const rounds = durationRounds(duration);
    const before = target.cond[flag ?? slug] ?? 0;
    if (flag) target.cond[flag] = true;
    else target.cond[slug] = Math.max(target.cond[slug] ?? 0, Number.isFinite(value) ? value : 1);
    if (slug === "controlled" && !before) takeControl(state, target, source);
    // Quickened on its own turn (Shrieking Frenzy, Alchemical Amplification): the extra action now (B53).
    if (slug === "quickened" && !before && state.acting === target.id && Number.isFinite(target.actionsLeft)) target.actionsLeft += 1;
    // Fleeing for any reason is a morale trigger (M32).
    if (slug === "fleeing" && !before) state.pendingEvents?.push({ type: "fleeing", victim: target });
    // Frightened by an enemy's effect (Demoralize, fear) is a morale trigger.
    if (slug === "frightened" && target.cond.frightened > before && source && source.side !== target.side) state.pendingEvents?.push({ type: "frightened", victim: target, byEnemy: true, value: target.cond.frightened });
    // Jeer at Failure (B85): a foe near the monster falling prone.
    if (slug === "prone" && !before && isActive(target)) mishapAnswers(state, target);
    // Who's holding it, for Escape, Constrict and letting go.
    if ((slug === "grabbed" || slug === "restrained") && source && source !== target) target.grabbedBy = source.id;
    // (B197, Deadly Mandibles: a creature it just grabbed, its reaction Strike at it once the action ends.)
    if ((slug === "grabbed" || slug === "restrained") && !before && source && source !== target && (source.reactionStrikes ?? []).some((entry) => entry.triggers.includes("grabs")) && !(state.afterAction ?? []).some((entry) => entry.kind === "grab-strike" && entry.targetId === target.id)) (state.afterAction ??= []).push({ kind: "grab-strike", sourceId: source.id, targetId: target.id });
    // Fast Swallow (B70): a creature it just grabbed, swallowed as its reaction once the action ends.
    if ((slug === "grabbed" || slug === "restrained") && !before && source?.fastSwallow && source !== target && !(state.afterAction ?? []).some((entry) => entry.targetId === target.id)) (state.afterAction ??= []).push({ kind: "fast-swallow", sourceId: source.id, targetId: target.id });
    if (Number.isFinite(rounds)) {
        // "Until the end of your next turn" ends at the end of that turn; the rest at its start.
        (target.timers ??= []).push({ key: flag ?? slug, value: flag ? true : target.cond[slug], round: state.round + rounds, turnOf: source?.id ?? target.id, at: duration?.expiry === "turn-end" ? "end" : "start" });
    }
    // (B314: "It can attempt a new save at the end of each of its turns" — the ability module's duration.saveEnds { save, dc, drop }.)
    if (Number.isFinite(Number(duration?.saveEnds?.dc))) target.saveEnds = [...(target.saveEnds ?? []).filter((entry) => entry.slug !== slug), { slug, save: duration.saveEnds.save ?? "fortitude", dc: Number(duration.saveEnds.dc), drop: Number(duration.saveEnds.drop) || 0 }];
    // (B305: its reaction to gaining the condition — Quick Escape from a grab, Melt Time when slowed or stunned.)
    if (!before && isActive(target)) useReaction(state, target, source && source !== target ? source : null, (trigger) => trigger.event === "condition-gained" && (!trigger.slugs?.length || trigger.slugs.includes(slug)));
    return true;
}

// The new saves at the end of the creature's turn against conditions that say so (B314; the ghast's paralysis: "the DC cumulatively
// decreases by 1"): a success ends the condition, a failure lowers the DC by the drop.
export function saveEndsAtTurnEnd(state, c) {
    for (const entry of [...(c.saveEnds ?? [])]) {
        const flag = FLAGS[entry.slug];
        const held = flag ? Boolean(c.cond[flag]) : (c.cond[entry.slug] ?? 0) > 0;
        if (!held) {
            c.saveEnds.splice(c.saveEnds.indexOf(entry), 1);
            continue;
        }
        const natural = state.rng.d20();
        if (degreeOf(natural + saveModifier(c, entry.save), entry.dc, natural) >= SUCCESS) {
            if (flag) c.cond[flag] = false;
            else c.cond[entry.slug] = 0;
            c.timers = (c.timers ?? []).filter((timer) => timer.key !== (flag ?? entry.slug));
            c.saveEnds.splice(c.saveEnds.indexOf(entry), 1);
            log(state, `  ${c.name} is no longer ${entry.slug} (${entry.save} save against DC ${entry.dc})`);
        } else entry.dc -= entry.drop;
    }
}

// Ends conditions (Escape): grabbed and restrained also free the creature from its grabber.
export function endConditions(target, slugs) {
    for (const slug of slugs) {
        const flag = FLAGS[slug];
        if (flag) target.cond[flag] = false;
        else if (VALUED.has(slug)) target.cond[slug] = 0;
    }
    if (slugs.includes("grabbed") || slugs.includes("restrained")) target.grabbedBy = null;
    const keys = new Set(slugs.map((slug) => FLAGS[slug] ?? slug));
    target.timers = (target.timers ?? []).filter((timer) => !keys.has(timer.key));
}

// At the start (or, for "until the end of …", the end) of a creature's turn:
// the conditions and effects it timed run out.
export function expireTimers(state, c, phase = "start") {
    const afflictions = [];
    for (const other of state.list) {
        if (!other.timers?.length) continue;
        other.timers = other.timers.filter((timer) => {
            if (timer.turnOf !== c.id || state.round < timer.round || (timer.at ?? "start") !== phase) return true;
            // An affliction's stage has run its course: a new save (after the filter, since it sets new timers).
            if (timer.affliction) {
                afflictions.push([other, timer.affliction]);
                return false;
            }
            if ((timer.key === "grabbed" || timer.key === "restrained") && !other.cond.grabbed && !other.cond.restrained) other.grabbedBy = null;
            if (timer.effect) {
                removeEffect(other, timer.effect);
                return false;
            }
            if (timer.offGuardTo) {
                other.offGuardTo = (other.offGuardTo ?? []).filter((entry) => entry !== timer.offGuardTo);
                return false;
            }
            if (timer.regenerationOff) {
                other.regenerationOff = false;
                return false;
            }
            if (timer.taunt) {
                if (other.tauntedBy === timer.taunt) other.tauntedBy = null;
                return false;
            }
            // (S58: a condition set aside comes back.)
            if (timer.restore) {
                const flag = FLAGS[timer.restore.slug];
                if (isActive(other)) {
                    if (flag) other.cond[flag] = true;
                    else other.cond[timer.restore.slug] = Math.max(other.cond[timer.restore.slug] ?? 0, Number(timer.restore.value) || 0);
                    log(state, `  ${other.name} is ${timer.restore.slug} again`);
                }
                return false;
            }
            const current = other.cond[timer.key];
            if (timer.value === true) other.cond[timer.key] = false;
            else if (current <= timer.value) other.cond[timer.key] = 0;
            if ((timer.key === "grabbed" || timer.key === "restrained") && !other.cond.grabbed && !other.cond.restrained) other.grabbedBy = null;
            return false;
        });
    }
    for (const [target, entry] of afflictions) afflictionSave(state, target, entry);
}

// --- Afflictions (poisons, diseases): stages and their saves ------------------

const SPAN_ROUNDS = { rounds: 1, minutes: 10 };
// A span in rounds; Infinity for hours and days (beyond any fight).
function spanRounds(span) {
    return span && SPAN_ROUNDS[span.unit] ? span.value * SPAN_ROUNDS[span.unit] : Infinity;
}

// Exposure: a failed save afflicts the creature at stage 1 (2 on a critical
// failure). A creature already afflicted by the same poison goes up that many
// stages; a disease or curse it already has does nothing.
function applyAffliction(state, source, target, data) {
    if (!isActive(target) || (data.traits ?? []).some((trait) => (target.immunities ?? []).includes(trait))) return;
    const existing = (target.afflictions ??= []).find((entry) => entry.name === data.name);
    if (existing) {
        if ((data.traits ?? []).includes("poison")) setAfflictionStage(state, target, existing, Math.min(existing.stages.length, existing.stage + data.stage));
        return;
    }
    const maximum = spanRounds(data.maximumDuration);
    const entry = { name: data.name, source: source.id, data, stages: data.stages, stage: 0, endRound: state.round + maximum, conditions: [] };
    target.afflictions.push(entry);
    // An onset longer than the fight: nothing happens yet.
    const onset = data.onset ? spanRounds(data.onset) : 0;
    if (onset === Infinity) return;
    if (onset > 0) {
        entry.pending = Math.min(data.stage, data.stages.length);
        (target.timers ??= []).push({ affliction: entry, round: state.round + onset, turnOf: source.id, at: "start" });
        log(state, `  ${target.name} is exposed to ${data.name}`);
        return;
    }
    setAfflictionStage(state, target, entry, Math.min(data.stage, data.stages.length));
}

// Moves an affliction to a stage: the old stage's conditions end, the new
// stage's damage and conditions apply, and its save comes when it runs out.
function setAfflictionStage(state, target, entry, stage) {
    for (const { slug, value } of entry.conditions) {
        const flag = FLAGS[slug];
        if (flag) target.cond[flag] = false;
        else if (VALUED.has(slug) && (target.cond[slug] ?? 0) <= (value ?? 1)) target.cond[slug] = 0;
    }
    entry.conditions = [];
    target.timers = (target.timers ?? []).filter((timer) => timer.affliction !== entry);
    if (stage <= 0) {
        target.afflictions = target.afflictions.filter((other) => other !== entry);
        log(state, `  ${target.name} recovers from ${entry.name}`);
        return;
    }
    entry.stage = stage;
    const current = entry.stages[stage - 1];
    log(state, `  ${target.name}: ${entry.name}, stage ${stage}`);
    if (current.death) {
        killCreature(state, target);
        return;
    }
    const source = state.byId.get(entry.source) ?? null;
    for (const formula of current.damage ?? []) {
        const instances = rollInstances(state, parseDamage(formula));
        const dealt = applyDamage(state, target, instances, { source });
        log(state, `  ${target.name} takes ${dealt} ${instances.map((instance) => instance.type).join("/")} (${entry.name})`);
    }
    if (!isActive(target)) return;
    for (const { slug, value } of current.conditions ?? []) {
        if (applyCondition(state, target, slug, value ?? null, null, source)) {
            entry.conditions.push({ slug, value });
            if (slug === "sickened") target.sickenedDC = Math.max(target.sickenedDC ?? 0, entry.data.dc ?? 0) || null;
        }
    }
    const rounds = spanRounds(current.duration);
    if (Number.isFinite(rounds)) (target.timers ??= []).push({ affliction: entry, round: state.round + Math.max(1, rounds), turnOf: entry.source, at: "start" });
}

// The save when a stage runs out: a critical success lowers the stage by 2, a
// success by 1, a failure raises it by 1, a critical failure by 2. Past the
// maximum duration, it ends.
function afflictionSave(state, target, entry) {
    if (target.status === "dead" || target.status === "fled" || !target.afflictions?.includes(entry)) return;
    if (entry.pending) {
        const stage = entry.pending;
        entry.pending = null;
        setAfflictionStage(state, target, entry, stage);
        return;
    }
    if (state.round >= entry.endRound) {
        setAfflictionStage(state, target, entry, 0);
        return;
    }
    const statistic = entry.data.statistic ?? "fortitude";
    const modifier = saveModifier(target, statistic) + saveBonusAgainst(target, statistic, { kind: "ability", plan: { traits: entry.data.traits ?? [] } });
    const natural = state.rng.d20();
    const degree = adjustedSaveDegree(target, statistic, degreeOf(natural + modifier, entry.data.dc, natural), { kind: "ability", plan: { traits: entry.data.traits ?? [] } });
    const change = [2, 1, -1, -2][degree];
    log(state, `  ${target.name} saves against ${entry.name}: ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
    setAfflictionStage(state, target, entry, Math.min(entry.stages.length, entry.stage + change));
}

// About what an affliction does to a creature in a fight: its first stage's
// damage and conditions, about twice when its stages last rounds.
function afflictionValue(target, data) {
    if ((data.traits ?? []).some((trait) => (target.immunities ?? []).includes(trait))) return { damage: 0, worth: 0 };
    if (data.onset && spanRounds(data.onset) >= 3) return { damage: 0, worth: 0 };
    const stage = data.stages?.[(data.stage ?? 1) - 1];
    if (!stage) return { damage: 0, worth: 0 };
    if (stage.death) return { damage: Math.max(1, target.hp.value), worth: 0 };
    const repeats = Number.isFinite(spanRounds(stage.duration)) ? 2 : 1;
    const damage = (stage.damage ?? []).flatMap((formula) => parseDamage(formula)).reduce((sum, instance) => sum + adjustInstance(target, instance.type, averageOf(instance)), 0);
    const worth = (stage.conditions ?? []).reduce((sum, { slug, value }) => sum + conditionWorth(slug, value, { mode: "fixed", value: repeats, unit: "rounds" }), 0);
    return { damage: damage * repeats, worth };
}

// --- Golem Antimagic (B56) ---------------------------------------------------

// A golem is immune to others' magic (spells, and abilities of a tradition or with the magical trait), but magic of the kinds
// it lists (damage types, traits or a spell's name) harms it (untyped damage instead of the usual effect), heals it (it loses
// slowed and regains half the damage the magic would deal) or slows it (slowed 1 for 2d6 rounds). An area: its parenthetical
// amounts, slowed 1 for a round (as a golem starting its turn in such an area). null: not a golem, not magic, or its own.
const MAGIC_TRAITS = ["arcane", "divine", "occult", "primal", "magical"];
function golemAnswer(caster, spell, target, area) {
    const golem = target?.golemAntimagic;
    if (!golem || target === caster) return null;
    const traits = (spell.plan?.traits ?? []).map((trait) => String(trait).toLowerCase());
    const magic = !["ability", "basic", "item"].includes(spell.kind) || /spells-srd/.test(spell.plan?.source?.uuid ?? "") || traits.some((trait) => MAGIC_TRAITS.includes(trait));
    if (!magic) return null;
    const formulas = planFormulas(spell.plan);
    const kinds = new Set([...traits, ...formulas.flatMap((formula) => parseDamage(formula).map((instance) => instance.type)), String(spell.plan?.source?.name ?? spell.name ?? "").toLowerCase()]);
    const listed = (entry) => (entry?.by ?? []).some((kind) => kinds.has(kind));
    if (listed(golem.harmed)) {
        const formula = area ? golem.harmed.area ?? golem.harmed.damage : golem.harmed.damage ?? golem.harmed.area;
        return formula ? { kind: "harmed", formula } : { kind: "immune" };
    }
    if (listed(golem.healed)) return { kind: "healed", formulas: area && golem.healed.area ? [golem.healed.area] : formulas, half: !(area && golem.healed.area) };
    if (listed(golem.slowed)) return { kind: "slowed", rounds: area ? 1 : null };
    return { kind: "immune" };
}

// The damage formulas of a plan: its shared damage, else its rows'.
function planFormulas(plan) {
    const shared = (plan?.resolution?.sharedDamage?.components ?? []).map((component) => component.formula);
    const rows = Object.values(plan?.resolution?.outcomes ?? {}).flatMap((outcome) => (outcome?.damage?.formulas ?? []).map((entry) => entry.formula));
    return [...new Set((shared.length ? shared : rows).filter(Boolean))];
}

function answerGolem(state, caster, spell, golem, answer) {
    if (answer.kind === "harmed") {
        const dealt = applyDamage(state, golem, rollInstances(state, parseDamage(`(${answer.formula})[untyped]`)), { source: caster });
        log(state, `  ${golem.name} is harmed by ${spell.name}: ${dealt} damage (Golem Antimagic)`);
    } else if (answer.kind === "healed") {
        golem.cond.slowed = 0;
        const rolled = answer.formulas.reduce((sum, formula) => sum + rollInstances(state, parseDamage(formula)).reduce((total, instance) => total + instance.amount, 0), 0);
        const healed = applyHeal(state, golem, answer.half ? Math.floor(rolled / 2) : rolled);
        log(state, `  ${golem.name} is healed by ${spell.name}: ${healed} HP (Golem Antimagic)`);
    } else if (answer.kind === "slowed") {
        const rounds = answer.rounds ?? state.rng.die(6) + state.rng.die(6);
        applyCondition(state, golem, "slowed", 1, { mode: "fixed", value: rounds, unit: "rounds", expiry: "turn-end", anchor: "effect-start" }, caster);
        log(state, `  ${golem.name} is slowed 1 by ${spell.name} for ${rounds} round(s) (Golem Antimagic)`);
    } else log(state, `  ${golem.name} is immune to ${spell.name} (Golem Antimagic)`);
}

// What the answer is worth to the caster, on average: { damage, worth }.
function golemValue(golem, answer) {
    const average = (formulas, type = null) => formulas.flatMap((formula) => parseDamage(type ? `(${formula})[${type}]` : formula)).reduce((sum, instance) => sum + adjustInstance(golem, instance.type, averageOf(instance)), 0);
    if (answer.kind === "harmed") return { damage: average([answer.formula], "untyped"), worth: 0 };
    if (answer.kind === "healed") return { damage: -(answer.half ? 0.5 : 1) * average(answer.formulas), worth: golem.cond.slowed ? -conditionWorth("slowed", golem.cond.slowed, null) : 0 };
    if (answer.kind === "slowed") return { damage: 0, worth: conditionWorth("slowed", 1, { mode: "fixed", value: answer.rounds ?? 7, unit: "rounds" }) };
    return { damage: 0, worth: 0 };
}

export function applyHeal(state, target, amount) {
    if (amount <= 0 || target.status === "dead" || target.status === "fled" || target.status === "surrendered") return 0;
    if (target.status === DOWN) {
        if (target.kind !== "pc") return 0;
        // Losing dying: wounded goes up by 1, and the creature wakes (still prone).
        target.status = ACTIVE;
        target.cond.dying = 0;
        target.cond.wounded = (target.cond.wounded ?? 0) + 1;
        target.cond.unconscious = false;
        target.stable = false;
        target.hp.value = Math.min(target.hp.max, amount);
        target.band = "near";
        log(state, `  ${target.name} is healed back up (${target.hp.value}/${target.hp.max})`);
        return target.hp.value;
    }
    const before = Math.max(0, target.hp.value);
    target.hp.value = Math.min(target.hp.max, before + amount);
    if (target.hp.value > before) log(state, `  ${target.name} regains ${target.hp.value - before} HP (${target.hp.value}/${target.hp.max})`);
    return target.hp.value - before;
}

// An effect the target already has (a Vapor Form cast last round): only the rounds a recast adds count, none while
// it has 3 or more left or lasts without end.
function recastShare(state, target, model, key) {
    const held = (target.effects ?? []).find((effect) => effect.key === key);
    if (!held) return 1;
    const full = Math.min(3, model.rounds);
    const timer = (target.timers ?? []).find((entry) => entry.effect === held);
    if (!timer || !(full > 0)) return 0;
    return Math.max(0, full - (timer.round - (state.round ?? 0))) / full;
}

// A PF2e effect the plan names (Bless), or a penalty an outcome gives (Bon Mot's -2 to Will).
function outcomeEffect(spell, change) {
    if (change.effect?.kind === "native") return { model: spell.effects?.[change.effect.uuid] ?? null, key: change.effect.uuid };
    // (2026-10-14: a note that carries PF2e rules — Calm's -1 to attack rolls — read as an effect.)
    if (change.effect?.kind === "note") return { model: noteModel(spell, change.effect.note), key: `${spell.name}:${change.effect.note?.label}` };
    if (change.effect?.kind === "modifier") return { model: modifierModel(spell.name, change.effect.modifier), key: `${spell.name}:${change.effect.modifier?.selector}` };
    return { model: null, key: null };
}

const NOTE_MODELS = new WeakMap();
function noteModel(spell, note) {
    if (!note?.rules?.length) return null;
    if (!NOTE_MODELS.has(note)) {
        const { rounds } = noteRounds(note.duration);
        const duration = rounds === Infinity ? { value: -1 } : { value: rounds, unit: "rounds" };
        const model = effectModel({ name: note.label ?? spell.name, system: { rules: note.rules, duration } }, { rank: Number(spell.castRank) || 1 });
        const any = model.modifiers.length || model.tempHp || model.fastHealing || model.resistances.length || model.weaknesses.length || model.immunities.length || model.conditions.length;
        NOTE_MODELS.set(note, any ? model : null);
    }
    return NOTE_MODELS.get(note);
}

// What a counteract is worth to its caster's side on the target: the best thing it can end there — a foe's help, an ally's
// hindrance — as { pick, value } (value in rounds of the target's threat), or null.
function bestCounter(state, caster, target, change) {
    const ally = target.side === caster.side;
    let best = null;
    for (const entry of counterables(target, change, FLAGS)) {
        let value;
        if (entry.kind === "effect") {
            const benefit = effectBenefit(entry.entry.model, target, conditionWorth, state.strikeShare?.get(target.id) ?? 1);
            value = ally ? -benefit : benefit;
        } else {
            const harm = conditionWorth(entry.slug, target.cond?.[entry.slug], null);
            value = ally ? harm : -harm;
        }
        if (value > 0 && (!best || value > best.value)) best = { pick: entry, value };
    }
    return best;
}

function applyCounteract(state, caster, spell, target, change) {
    const best = bestCounter(state, caster, target, change);
    if (!best) {
        log(state, `  ${spell.name} finds nothing to counteract on ${target.name}`);
        return;
    }
    const rank = counterRank(caster, spell, isSpellCast(spell));
    const roll = counterRoll(state, Number(spell.attack) || 0, rank, best.pick);
    // (S58, Clear Mind's near miss: a failure that would have counteracted at 2 ranks higher sets the condition aside until the
    // caster's next turn starts.)
    const near = !roll.success && change.nearMiss && best.pick.kind === "condition" && counterReaches(roll.degree, rank + (Number(change.nearMiss.ranks) || 0), best.pick);
    log(state, `  ${spell.name} against ${best.pick.name} on ${target.name}: ${roll.total} vs ${best.pick.dc} → ${roll.success ? "counteracted" : near ? "set aside until its caster's next turn" : "not counteracted"}`);
    if (near) {
        const slug = best.pick.slug;
        const value = FLAGS[slug] ? true : target.cond[slug];
        clearCondition(target, slug, { keepSource: true });
        (target.timers ??= []).push({ restore: { slug, value }, round: state.round + 1, turnOf: caster.id });
        return;
    }
    if (!roll.success) return;
    if (best.pick.kind === "effect") {
        const effect = best.pick.entry;
        removeEffect(target, effect);
        target.timers = (target.timers ?? []).filter((timer) => timer.effect !== effect);
        for (const condition of effect.model?.conditions ?? []) clearCondition(target, condition.slug);
    } else {
        clearCondition(target, best.pick.slug);
    }
}

function clearCondition(target, slug, { keepSource = false } = {}) {
    const flag = FLAGS[slug];
    if (flag) target.cond[flag] = false;
    else if (VALUED.has(slug)) target.cond[slug] = 0;
    if (target.condSources && !keepSource) delete target.condSources[slug];
}

// U10 (2026-10-15; the user: "add the counteract consumables to the simulator"): the item module's plan.item.counteract — Surging Serum,
// Bottled Catharsis, Panacea, Contagion Metabolizer, Salve of Antiparalysis, Moon Radish Soup … — the item's own counteract check (its
// modifier and rank) against what it names on the creature it's used on:
//   conditions: one a spell or ability gave (c.condSources, with that source's DC and counteract rank);
//   traits: an effect or a condition from a source with one of those traits (emotion, mental, transmutation);
//   afflictions: an affliction of those kinds (disease, poison, curse) — its DC, and half its source creature's level as its rank.
// pick: "each" (a check against each), "one" (the one worth the most), "highest" (the highest rank). reduce: a success lowers the
// condition's value instead of ending it (Moon Radish Soup: by 1, by 2 on a critical success). Only what hinders the creature.
function itemCounterables(state, target, spec) {
    const out = [];
    const traitMatch = (traits) => (spec.traits ?? []).some((trait) => (traits ?? []).includes(trait));
    for (const entry of target.effects ?? []) {
        if (!entry.counter || !traitMatch(entry.counter.traits)) continue;
        const harm = -effectBenefit(entry.model, target, conditionWorth, state.strikeShare?.get(target.id) ?? 1);
        if (harm > 0) out.push({ kind: "effect", entry, dc: entry.counter.dc, rank: entry.counter.rank, name: String(entry.model?.name ?? "an effect").replace(/^Spell Effect: /, ""), worth: harm });
    }
    for (const [slug, info] of Object.entries(target.condSources ?? {})) {
        const flag = FLAGS[slug];
        const value = flag ? (target.cond?.[flag] ? null : 0) : Number(target.cond?.[slug]) || 0;
        if ((flag && !target.cond?.[flag]) || (!flag && value <= 0)) continue;
        if (!(spec.conditions ?? []).includes(slug) && !traitMatch(info.traits)) continue;
        const worth = conditionWorth(slug, flag ? null : value, null);
        if (worth > 0) out.push({ kind: "condition", slug, value, dc: info.dc, rank: info.rank, name: `${slug} (${info.name})`, worth });
    }
    for (const entry of target.afflictions ?? []) {
        if (!(spec.afflictions ?? []).some((kind) => (entry.data?.traits ?? []).includes(kind))) continue;
        const source = state.byId.get(entry.source);
        const worth = 0.3 * Math.max(1, entry.stage) + entry.conditions.reduce((sum, held) => sum + Math.max(0, conditionWorth(held.slug, held.value ?? null, null)), 0);
        out.push({ kind: "affliction", entry, dc: entry.data?.dc, rank: Math.max(1, Math.ceil((Number(source?.level) || 1) / 2)), name: entry.name, worth });
    }
    return out.filter((entry) => Number.isFinite(entry.dc) && Number.isFinite(entry.rank));
}

// What it would end: all of them for "each", else the one worth the most ("one") or of the highest rank ("highest").
function itemCounterPicks(spec, found) {
    if (spec.pick === "each" || !found.length) return found;
    if (spec.pick === "highest") return [found.reduce((best, entry) => (entry.rank > best.rank ? entry : best))];
    return [found.reduce((best, entry) => (entry.worth > best.worth ? entry : best))];
}

// (A reduction, Moon Radish Soup's: what lowering the condition by that much is worth.)
function itemReduceWorth(spec, pick, degree) {
    const by = Number(spec.reduce?.[degree === CRITICAL_SUCCESS ? "criticalSuccess" : "success"]) || 0;
    if (pick.kind !== "condition" || !Number.isFinite(pick.value) || !by) return pick.worth;
    return pick.worth - Math.max(0, conditionWorth(pick.slug, Math.max(0, pick.value - by), null));
}

export function itemCounteractWorth(state, spell, target) {
    const spec = spell.counteract;
    let worth = 0;
    for (const pick of itemCounterPicks(spec, itemCounterables(state, target, spec))) {
        const chance = counterChance(Number(spec.modifier) || 0, Number(spec.rank) || 1, pick);
        worth += chance * (spec.reduce ? itemReduceWorth(spec, pick, SUCCESS) : pick.worth);
    }
    return worth;
}

function applyItemCounteract(state, caster, spell, target) {
    const spec = spell.counteract;
    const picks = itemCounterPicks(spec, itemCounterables(state, target, spec));
    if (!picks.length) {
        log(state, `  ${spell.name} finds nothing to counteract on ${target.name}`);
        return;
    }
    for (const pick of picks) {
        const roll = counterRoll(state, Number(spec.modifier) || 0, Number(spec.rank) || 1, pick);
        const by = spec.reduce && pick.kind === "condition" && Number.isFinite(pick.value) ? Number(spec.reduce[roll.degree === CRITICAL_SUCCESS ? "criticalSuccess" : "success"]) || 0 : 0;
        log(state, `  ${spell.name} against ${pick.name} on ${target.name}: ${roll.total} vs ${pick.dc} → ${roll.success ? (by ? `${pick.slug} ${Math.max(0, pick.value - by)}` : "counteracted") : "not counteracted"}`);
        if (!roll.success) continue;
        if (pick.kind === "affliction") setAfflictionStage(state, target, pick.entry, 0);
        else if (pick.kind === "effect") {
            removeEffect(target, pick.entry);
            target.timers = (target.timers ?? []).filter((timer) => timer.effect !== pick.entry);
            for (const condition of pick.entry.model?.conditions ?? []) clearCondition(target, condition.slug);
        } else if (by && pick.value - by > 0) target.cond[pick.slug] = pick.value - by;
        else clearCondition(target, pick.slug);
    }
}

// U12 (2026-10-16; the user: "Add the persistent damage recovery items freely"): the item module's plan.item.recovery — Quenching Potion,
// Antivenom Potion, Searing Suture, Cauterizing Torch: a flat check (the item's DC, DC 10 for "particularly appropriate help") against each
// persistent damage of its types on the creature it's used on, which ends it on a success. Worth the damage it saves: the chance times about
// two rounds of it (as a persistent damage is valued when it's dealt).
const recovering = (spell, target) => (target.persistent ?? []).filter((entry) => spell.recovery.types.includes(entry.type));
function persistentAverage(target, entry) {
    const each = Number.isFinite(entry.amount) ? entry.amount : ((entry.dice ?? 0) * ((entry.die ?? 0) + 1) / 2 + (entry.bonus ?? 0)) * (entry.multiplier ?? 1);
    return adjustInstance(target, entry.type, Math.max(0, each));
}

export function itemRecoveryWorth(spell, target) {
    const chance = Math.min(1, Math.max(0, (21 - spell.recovery.dc) / 20));
    return recovering(spell, target).reduce((sum, entry) => sum + chance * 2 * persistentAverage(target, entry), 0);
}

function applyItemRecovery(state, spell, target) {
    const entries = recovering(spell, target);
    if (!entries.length) {
        log(state, `  ${spell.name} finds no persistent damage to end on ${target.name}`);
        return;
    }
    for (const entry of entries) {
        const success = flatCheck(state.rng, spell.recovery.dc) >= SUCCESS;
        log(state, `  ${target.name}'s persistent ${entry.type}: flat check DC ${spell.recovery.dc} → ${success ? "ended" : "goes on"} (${spell.name})`);
        if (success) target.persistent.splice(target.persistent.indexOf(entry), 1);
    }
}

// Cleanse Affliction: one affliction of its traits a stage lower, not below the floor.
function applyAfflictionStage(state, target, change) {
    const entry = (target.afflictions ?? []).filter((held) => held.stage > (change.floor ?? 1) && (!(change.traits ?? []).length || (held.data?.traits ?? []).some((trait) => change.traits.includes(trait)))).sort((a, b) => b.stage - a.stage)[0];
    if (!entry) return;
    setAfflictionStage(state, target, entry, Math.max(change.floor ?? 1, entry.stage - (change.by ?? 1)));
    log(state, `  ${target.name}'s ${entry.name} eases to stage ${entry.stage}`);
}

function applyNativeEffect(state, caster, spell, target, change) {
    const { model, key } = outcomeEffect(spell, change);
    if (model && isActive(target)) {
        const isSpell = isSpellCast(spell);
        const effect = applyEffect(state, target, model, caster, { applyCondition, key, counter: { dc: effectDC(spell), rank: counterRank(caster, spell, isSpell), spell: isSpell, traits: spell.plan?.traits ?? [] } });
        // (2026-10-15, Death Ward: the conditions its text suppresses while it lasts — Doomed.)
        if (spell.plan?.suppresses?.length) effect.suppress = [...spell.plan.suppresses];
        log(state, `  ${target.name} gains ${model.name.replace(/^Spell Effect: /, "")}${change.effect?.kind === "modifier" ? ` (${change.effect.modifier.value} ${change.effect.modifier.type} to ${change.effect.modifier.selector})` : ""}`);
    }
}

// The target's best held weapon: it falls (until picked up), or its grip weakens (-2 until it regrips).
function applyDisarm(state, target, effect) {
    if (!isActive(target)) return;
    const held = (target.strikes ?? []).filter((strike) => strike.held && strikeUsable(target, strike));
    if (!held.length) return;
    const weapon = held.reduce((best, strike) => (strike.bonus > best.bonus ? strike : best));
    if (effect.what === "drop") {
        (target.dropped ??= new Set()).add(weapon.name);
        target.weakGrip?.delete(weapon.name);
        log(state, `  ${target.name} drops its ${weapon.name}`);
    } else {
        (target.weakGrip ??= new Map()).set(weapon.name, effect.penalty || 2);
        log(state, `  ${target.name}'s grip on its ${weapon.name} weakens`);
    }
}

// Swallow Whole: the creature is inside the swallower, grabbed (until it
// Escapes) and slowed 1, out of everyone else's reach. The swallower is
// off-guard to its attacks.
function applySwallow(state, swallower, target, effect) {
    if (!isActive(target) || !isActive(swallower)) return;
    target.timers = (target.timers ?? []).filter((timer) => timer.key !== "grabbed" && timer.key !== "restrained");
    target.cond.restrained = false;
    target.cond.grabbed = true;
    target.grabbedBy = swallower.id;
    const slowed = (target.cond.slowed ?? 0) < 1;
    if (slowed) target.cond.slowed = 1;
    const offGuard = { attacker: target.id, attacks: "melee", uses: null };
    swallower.offGuardTo = [...(swallower.offGuardTo ?? []), offGuard];
    leaveMelee(state, target, "near");
    target.swallowedBy = swallower.id;
    target.swallow = { damage: parseDamage(effect.damage ?? ""), rupture: effect.rupture ?? null, escapeDC: effect.escapeDC ?? null, slowed, offGuard };
    log(state, `  ${swallower.name} swallows ${target.name}`);
}

// The DC of a spell or ability's save or check (a monster ability's fixed DC, or the caster's spell DC).
function effectDC(spell) {
    const check = describeSpell(spell?.plan)?.check;
    if (check?.against?.dc === "fixed") return check.against.value;
    return spell?.dc ?? null;
}

// Conditions that last as long as another one (sickened, frightened) end once it's gone.
export function endWhileConditions(c) {
    const left = [];
    for (const entry of c.whileConditions ?? []) {
        if (c.cond[FLAGS[entry.while] ?? entry.while]) {
            left.push(entry);
            continue;
        }
        if (VALUED.has(entry.slug)) c.cond[entry.slug] = Math.max(0, (c.cond[entry.slug] ?? 0) - (entry.value ?? 1));
        else if (FLAGS[entry.slug]) c.cond[FLAGS[entry.slug]] = false;
    }
    c.whileConditions = left;
}

// Retch: a sickened creature spends an action on a Fortitude save against
// the DC that sickened it; a success lowers sickened by 1, a critical success by 2.
export function retch(state, c) {
    const natural = state.rng.d20();
    const degree = adjustedSaveDegree(c, "fortitude", degreeOf(natural + saveModifier(c, "fortitude"), c.sickenedDC ?? 10, natural));
    const drop = degree === 3 ? 2 : degree === 2 ? 1 : 0;
    // (Evil Eye: not below its floor.)
    c.cond.sickened = Math.max(floorOf(c, "sickened"), (c.cond.sickened ?? 0) - drop);
    if (!c.cond.sickened) {
        c.sickenedDC = null;
        // Conditions that lasted as long as it was sickened end with it.
        endWhileConditions(c);
    }
    log(state, `  ${c.name} retches: ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}${drop ? ` (sickened ${c.cond.sickened})` : ""}`);
}

// Battle Medicine on an ally (or itself): Medicine against a Treat Wounds DC.
// Success: 2d8 HP (+ the DC's bonus), critical success 4d8; critical failure:
// 1d8 damage. The target is then immune to this creature's Battle Medicine.
export function battleMedicine(state, c, target, tierIndex = 0) {
    const medicine = c.battleMedicine;
    const tier = medicine.tiers[tierIndex] ?? medicine.tiers[0];
    (c.battleMedicineGiven ??= new Set()).add(target.id);
    const natural = state.rng.d20();
    const degree = degreeOf(natural + medicine.modifier - statusPenalty(c, "skill"), tier.dc, natural);
    log(state, `  ${c.name} uses ${medicine.name} on ${target.name} (DC ${tier.dc}): ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
    if (degree >= 2) {
        let amount = tier.bonus;
        for (let die = 0; die < (degree === 3 ? 4 : 2); die++) amount += state.rng.die(8);
        applyHeal(state, target, amount);
    } else if (degree === 0 && target.status === "active") {
        applyDamage(state, target, [{ type: "untyped", amount: state.rng.die(8), persistent: false, precision: false }], { source: c });
    }
}

// The expected HP of Battle Medicine at each of its DCs: [{ tier, heal }].
export function battleMedicineOdds(c) {
    const medicine = c.battleMedicine;
    return medicine.tiers.map((tier, index) => {
        const odds = degreeDistribution(medicine.modifier - statusPenalty(c, "skill"), tier.dc);
        return { tier: index, heal: odds[2] * (9 + tier.bonus) + odds[3] * (18 + tier.bonus) - odds[0] * 4.5 };
    });
}

// The chance a Retch lowers sickened: [success, critical success].
export function retchOdds(c) {
    const odds = adjustedSaveOdds(c, "fortitude", degreeDistribution(saveModifier(c, "fortitude"), c.sickenedDC ?? 10));
    return [odds[2], odds[3]];
}

// Rolls parsed damage ({ type, dice, constant }) as damage instances.
export function rollInstances(state, parsed) {
    return parsed.map((instance) => {
        let amount = instance.constant ?? 0;
        for (const term of instance.dice ?? []) for (let index = 0; index < term.count; index++) amount += (term.factor ?? 1) * state.rng.die(term.die);
        return { type: instance.type ?? "untyped", amount: Math.max(0, Math.floor(amount)), persistent: false, precision: false };
    });
}

const averageOf = (instance) => (instance.constant ?? 0) + (instance.dice ?? []).reduce((sum, term) => sum + (term.factor ?? 1) * term.count * (term.die + 1) / 2, 0);

// How many more creatures a swallower can take: one of its listed size fills
// it; one size smaller, two; smaller still, four.
function swallowRoom(state, swallower, size, target) {
    const max = sizeRank(size);
    if (sizeRank(target.size) > max) return false;
    const inside = state.list.filter((other) => other.swallowedBy === swallower.id);
    if (inside.some((other) => sizeRank(other.size) >= max)) return false;
    const room = max - sizeRank(target.size) >= 2 ? 4 : max - sizeRank(target.size) === 1 ? 2 : 1;
    return inside.length < room;
}

// About how many rounds a creature stays swallowed: it tries to Escape with each action.
function swallowedRounds(target, swallower, escapeDC = null) {
    const roll = Math.max(skillValue(target, "athletics"), skillValue(target, "acrobatics"), skillValue(target, "unarmed")) - statusPenalty(target, "skill");
    const dc = escapeDC ?? defenceDC(swallower, "athletics");
    let stays = 1;
    for (const map of [0, 5, 10]) {
        const odds = degreeDistribution(roll - map, dc);
        stays *= 1 - odds[2] - odds[3];
    }
    return Math.min(3, 1 / Math.max(1 - stays, 1 / 3));
}

// An activity's Strike hit (Wrestle, Intimidating Strike, Rhinoceros Charge):
// its conditions (the critical ones on a critical hit), push, extra damage
// (doubled on a critical hit) and save. Extra dice of the Strike's own type
// ("2d8[strike]", B54): the type of the Strike that hit.
export function applyStrikeRider(state, attacker, target, activity, critical, strike = null) {
    const rider = activity.onHit;
    if (rider.size && sizeRank(target.size) > sizeRank(rider.size)) return;
    // (B107, Stomp: more damage on a creature already Prone.)
    const prone = Boolean(target.cond.prone);
    for (const { slug, value, duration } of critical && rider.critical ? rider.critical : rider.conditions) {
        if (isActive(target) && applyCondition(state, target, slug, value ?? null, duration ?? null, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""}`);
    }
    const push = critical && rider.criticalPush ? rider.criticalPush : rider.push;
    if (push && isActive(target)) applyMove(state, target, { kind: "push", distance: push });
    // (B258, Resonating Kick: more damage against a creature with a trait it names.)
    const againstTrait = (rider.vsTraits ?? []).filter((entry) => entry.traits.some((trait) => (target.traits ?? []).includes(trait))).flatMap((entry) => entry.damage);
    for (const formula of [...(rider.damage ?? []).map((entry) => hydraScaled(attacker, entry)).filter(Boolean), ...(prone ? rider.proneDamage ?? [] : []), ...againstTrait]) {
        const instances = rollInstances(state, parseDamage(ownType(formula, strike))).map((instance) => ({ ...instance, amount: critical ? instance.amount * 2 : instance.amount, context: strikeContext(attacker, strike, critical) }));
        const dealt = applyDamage(state, target, instances, { source: attacker });
        log(state, `  ${target.name} takes ${dealt} more ${instances.map((instance) => instance.type).join("/")}`);
    }
    // (B130, Clobber: its save only against an off-guard target.)
    if (activity.riderSpell && isActive(target) && (rider.saveIf !== "off-guard" || isOffGuard(target))) castPlan(state, attacker, activity.riderSpell, [target.id]);
    // (C30, Blessed Counterstrike: weak to its side's Strikes — half its level, as physical damage's weakness — until its next turn starts.)
    if (rider.weakness && isActive(target)) {
        applyEffect(state, target, { name: activity.name, rounds: 1, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [{ type: "physical", value: rider.weakness, exceptions: [] }], immunities: [], conditions: [], unsupported: [], situational: 0 }, attacker, { applyCondition, key: `weakness:${activity.name}` });
        log(state, `  ${target.name} is weak ${rider.weakness} to Strikes (${activity.name})`);
    }
    // (B153, Draining Touch: the Hit Points it regains on a hit.)
    // (B207, Devour Flesh: dice, "3d6", rolled.)
    const healed = typeof rider.selfHeal === "string" ? rollCount(state, rider.selfHeal) : rider.selfHeal;
    if (healed > 0 && isActive(attacker)) {
        applyHeal(state, attacker, healed);
        log(state, `  ${attacker.name} regains ${healed} HP`);
    }
    // (B153, Shared Feast: an ally of its choice spends its reaction to Strike the same target — the one whose Strike would do most.)
    if (rider.allyStrike && isActive(target)) {
        let best = null;
        for (const ally of state.list) {
            if (ally === attacker || ally.side !== attacker.side || !isActive(ally) || !canReact(ally) || !canAct(ally) || ally.cond.fleeing) continue;
            const strike = allyStrike(state, ally, target);
            if (strike && (!best || strike.expected > best.strike.expected)) best = { ally, strike };
        }
        if (best) {
            best.ally.reactionUsed = true;
            log(state, `  ${best.ally.name} Strikes with its reaction`);
            performStrike(state, best.ally, target, best.ally.strikes[best.strike.index], { reaction: true });
        }
    }
    // A skill action after the hit (B67: Terrifying Charge's Demoralize, Pouncing Pin's Trip): its own basic action.
    if (rider.follow && isActive(target) && canAct(attacker)) {
        const index = (attacker.spells ?? []).findIndex((spell) => spell.kind === "basic" && (spell.plan?.source?.slug === rider.follow || String(spell.name ?? "").toLowerCase() === rider.follow));
        if (index >= 0) castSpell(state, attacker, index, [target.id]);
    }
}

// "2d8[strike]": the Strike's own damage type.
function ownType(formula, strike) {
    // (Precision damage too, "4d6[precision]", B69: the Strike's type.)
    return String(formula).replace(/\[strike\]/g, `[${strike?.damage?.[0]?.type ?? "untyped"}]`).replace(/\[precision\]/g, `[precision,${strike?.damage?.[0]?.type ?? "untyped"}]`);
}

// What an activity's hit adds, on average: { damage, worth }.
export function strikeRiderValue(state, attacker, target, activity, strike = null) {
    const rider = activity.onHit;
    if (rider.size && sizeRank(target.size) > sizeRank(rider.size)) return { damage: 0, worth: 0 };
    let worth = rider.conditions.reduce((sum, { slug, value, duration }) => sum + conditionWorth(slug, value, duration), 0);
    if (rider.push && target.meleeId !== null) worth += 0.1;
    let damage = [...(rider.damage ?? []), ...(target.cond.prone ? rider.proneDamage ?? [] : [])].flatMap((formula) => parseDamage(ownType(formula, strike))).reduce((sum, instance) => sum + adjustInstance(target, instance.type, averageOf(instance), false, strikeContext(attacker, strike)), 0);
    // (B153: an ally's Strike after the hit; the Hit Points it regains.)
    if (rider.allyStrike) damage += Math.max(0, ...state.list.filter((ally) => ally !== attacker && ally.side === attacker.side && isActive(ally) && canReact(ally)).map((ally) => allyStrike(state, ally, target)?.expected ?? 0));
    const dice = /^(\d+)d(\d+)$/.exec(String(rider.selfHeal ?? ""));
    const meanHeal = dice ? Number(dice[1]) * (Number(dice[2]) + 1) / 2 : Number(rider.selfHeal) || 0;
    if (meanHeal > 0) worth += 0.02 * Math.min(meanHeal, Math.max(0, attacker.hp.max - attacker.hp.value)) / Math.max(1, attacker.hp.max) * 10;
    // (C30, Blessed Counterstrike's weakness: about two more hits from its side before it ends. C34, Shatter Defenses: off-guard while
    // frightened, a round or two.)
    if (rider.weakness) damage += 2 * rider.weakness;
    if (activity.shatter && target.cond.frightened > 0 && !isOffGuard(target)) worth += conditionWorth("off-guard", null, { mode: "fixed", value: Math.min(2, target.cond.frightened), unit: "rounds" });
    if (activity.riderSpell && (rider.saveIf !== "off-guard" || isOffGuard(target))) {
        const entry = spellExpectation(state, attacker, activity.riderSpell, [target]).find((item) => item.target === target);
        damage += entry?.damage ?? 0;
        worth += entry?.worth ?? 0;
    }
    return { damage, worth };
}

export function applyMove(state, target, change) {
    if (!isActive(target)) return;
    if (change.kind === "push" && change.distance >= 5 && target.meleeId !== null) {
        leaveMelee(state, target, "near");
        log(state, `  ${target.name} is pushed out of the melee`);
    } else if (change.kind === "pull" && change.distance >= 30 && target.band === "far") {
        target.band = "near";
        log(state, `  ${target.name} is pulled closer`);
    }
}

// Whether a plan deals damage (T7: a troop's non-damaging effects).
function planDamages(plan) {
    const resolution = plan?.resolution ?? {};
    return Boolean(resolution.sharedDamage?.components?.length) || Object.values(resolution.outcomes ?? {}).some((row) => row?.damage && row.damage.mode && row.damage.mode !== "none");
}

// A spell rather than an ability: not a monster's or a basic action, unless it is a spell from the spell list.
const DRUNK = new Set(["potion", "elixir", "mutagen", "drug"]);
function itemWords(spell, caster, targets) {
    const other = targets.find((target) => target !== caster);
    // (An oil or a salve is applied, not fed.)
    if (spell.drinker) return other ? `${DRUNK.has(spell.category) ? "feeds" : "applies"} ${spell.name} to ${other.name}` : `${DRUNK.has(spell.category) ? "drinks" : "uses"} ${spell.name}`;
    return `uses ${spell.name}${targets.length ? ` on ${targets.map((target) => target.name).join(", ")}` : ""}`;
}

function isSpellCast(spell) {
    return !["ability", "basic", "item"].includes(spell.kind) || /spells-srd/.test(spell.plan?.source?.uuid ?? "");
}

function applyChanges(state, caster, spell, changes, context, io) {
    // (I2: with its actions — Heal's three-action area.)
    const described = describeSpell(spell.plan, context?.actions);
    const nonlethal = described.nonlethal;
    // (B193: a spell aimed at its targets, with its rank, for Divert Essence.)
    const isSpell = isSpellCast(spell);
    const aimed = isSpell ? { rank: Number(spell.castRank ?? spell.plan?.rank) || 1, targeted: !described.area } : null;
    // (I2: its context on its damage — area damage on a swarm, a holy spell on a fiend, a resistance to spells.)
    const damageContext = spellContext(spell, { isSpell, area: Boolean(described.area) });
    for (let change of changes) {
        // (A value the text rolls — Wails of the Damned's "Drained 1d4" — rolled now.)
        if (change.op === "condition" && change.valueRoll && !Number.isFinite(change.value)) change = { ...change, value: rollCount(state, change.valueRoll) };
        const target = change.target !== undefined ? state.byId.get(change.target) : null;
        if (change.target !== undefined && !target) continue;
        switch (change.op) {
            case "damage": {
                const instances = change.instances.map((instance) => ({ type: instance.type, amount: instance.amount, persistent: false, precision: instance.category === "precision", splash: instance.category === "splash", context: damageContext }));
                const dealt = applyDamage(state, target, instances, { source: caster, nonlethal, spell: aimed });
                log(state, `  ${target.name} takes ${dealt} ${change.instances.map((instance) => instance.type).join("/")}`);
                // (2026-10-14, the vampiric spells: temporary Hit Points for the caster, a share of the damage dealt.)
                const benefit = spell.plan?.resolution?.casterBenefit;
                if (benefit?.kind === "temp-hp" && dealt > 0 && isActive(caster) && target.side !== caster.side) {
                    const amount = Math.floor(dealt * (Number(benefit.fraction) || 0.5));
                    if (amount > (caster.hp.temp ?? 0)) {
                        caster.hp.temp = amount;
                        log(state, `  ${caster.name} gains ${amount} temporary HP`);
                    }
                }
                break;
            }
            case "condition":
                // (A plan that also links PF2e's Persistent Damage condition, its damage in its own formula — Spellwrack: nothing more here.)
                if (change.slug === "persistent-damage") {
                    if (change.damage) applyDamage(state, target, [persistentInstance(change.damage)], { source: caster });
                }
                // First Aid's critical failure: dying +1.
                else if (change.slug === "dying") {
                    if (target.status === DOWN) increaseDying(state, target, change.value ?? 1);
                } else if (isActive(target) && change.escalate?.slug && (FLAGS[change.escalate.if] ? target.cond[FLAGS[change.escalate.if]] : (target.cond[change.escalate.if] ?? 0) > 0)) {
                    // (B103: already slowed — "a failed save causes it to be Petrified permanently": the worse condition.)
                    if (applyCondition(state, target, change.escalate.slug, change.escalate.value, change.escalate.duration, caster)) log(state, `  ${target.name} is ${change.escalate.slug}`);
                } else if (isActive(target) && applyCondition(state, target, change.slug, stackedValue(target, change), change.duration?.saveEnds?.dc === "spell" ? { ...change.duration, saveEnds: { ...change.duration.saveEnds, dc: effectDC(spell) } } : change.duration, caster, change.scope ?? null)) {
                    // (Invisibility: gone after its own hostile action.)
                    if (change.endsOnHostile) (target.endsOnHostile ??= new Set()).add(FLAGS[change.slug] ?? change.slug);
                    // (What a counteract checks against: the spell's or ability's DC and rank.)
                    (target.condSources ??= {})[change.slug] = { dc: effectDC(spell), rank: counterRank(caster, spell, isSpellCast(spell)), spell: isSpellCast(spell), name: spell.name, traits: spell.plan?.traits ?? [] };
                    log(state, `  ${target.name} is ${change.slug}${change.scope ? ` to ${state.byId.get(change.scope.attacker)?.name ?? "one creature"}` : ""}${Number.isFinite(change.value) ? ` ${stackedValue(target, change, true)}` : ""}`);
                    // Retching: a Fortitude save against the DC of what made it sickened.
                    if (change.slug === "sickened") target.sickenedDC = Math.max(target.sickenedDC ?? 0, effectDC(spell) ?? 0) || null;
                }
                break;
            case "move":
                applyMove(state, target, change);
                break;
            case "heal": {
                // (Any excess as temporary Hit Points, B63: Drink Blood's.)
                const room = Math.max(0, target.hp.max - Math.max(0, target.hp.value));
                applyHeal(state, target, change.amount);
                if (change.excessAsTemp && change.amount > room && change.amount - room > (target.hp.temp ?? 0)) target.hp.temp = change.amount - room;
                break;
            }
            // Temporary Hit Points (B61): the higher of its current and these.
            case "tempHp":
                if (isActive(target) && change.amount > (target.hp.temp ?? 0)) {
                    target.hp.temp = change.amount;
                    log(state, `  ${target.name} gains ${change.amount} temporary HP`);
                }
                break;
            case "effect":
                if (change.effect?.kind === "disarm") {
                    applyDisarm(state, target, change.effect);
                    break;
                }
                if (change.effect?.kind === "swallow") {
                    applySwallow(state, caster, target, change.effect);
                    break;
                }
                // (Dispel Magic, Clear Mind: a counteract; Cleanse Affliction: an affliction's stage.)
                if (change.effect?.kind === "counteract") {
                    if (isActive(target)) applyCounteract(state, caster, spell, target, change.effect);
                    break;
                }
                if (change.effect?.kind === "affliction-stage") {
                    if (target.status !== "dead") applyAfflictionStage(state, target, change.effect);
                    break;
                }
                // (Truesight: it sees through Invisibility.)
                if (change.effect?.kind === "true-sight") {
                    if (isActive(target)) {
                        const { rounds } = lastingRounds(change.effect.duration ? { mode: "fixed", ...change.effect.duration } : null);
                        target.trueSight = { modifier: Number(spell.attack) || 0, rank: counterRank(caster, spell, isSpellCast(spell)), untilRound: state.round + rounds, seen: {} };
                        log(state, `  ${target.name} gains ${spell.name}`);
                    }
                    break;
                }
                // (Sanctuary: its ward.)
                if (change.effect?.kind === "attack-ward") {
                    if (isActive(target)) applyWard(state, target, caster, spell, change.effect.ward, effectDC(spell));
                    break;
                }
                // (A condition it can't reduce below a value while the spell or a state lasts.)
                if (change.effect?.kind === "floor") {
                    if (isActive(target)) addFloor(state, target, caster, spell, change.effect.floor);
                    break;
                }
                // (Can't use reactions; Command's actions on its next turn.)
                if (change.effect?.kind === "note" && noteState(change.effect.note)) {
                    if (isActive(target)) applyNoteState(state, target, caster, spell, noteState(change.effect.note), change.effect.note.duration);
                    break;
                }
                // (Calm and the charm spells: "can't use hostile actions".)
                if (change.effect?.kind === "note") {
                    const entry = pacifyOf(change.effect.note, { ...(spell.plan?.resolution?.outcomes?.[change.effect.degree] ?? {}), ...(spell.plan?.rowFlags?.[change.effect.degree] ?? {}) });
                    if (entry) {
                        if (isActive(target)) pacify(state, target, caster, spell, entry, change.effect.note.duration);
                        break;
                    }
                }
                applyNativeEffect(state, caster, spell, target, change);
                break;

            case "end": {
                const slugs = change.what?.conditions ?? [];
                // First Aid: the dying creature is stable (still unconscious at 0 HP).
                if (change.what?.stabilize && target.status === DOWN && target.cond.dying > 0) {
                    target.cond.dying = 0;
                    target.stable = true;
                    log(state, `  ${target.name} is stabilized`);
                    break;
                }
                if (slugs.some((slug) => target.cond[FLAGS[slug] ?? slug])) log(state, `  ${target.name} is free of ${slugs.filter((slug) => target.cond[FLAGS[slug] ?? slug]).join(", ")}`);
                endConditions(target, slugs);
                // Escaping Swallow Whole's grab: out through the mouth.
                if (target.swallowedBy && !target.cond.grabbed) releaseSwallowed(state, target, "escapes");
                break;
            }
            case "death":
                if (target.status !== "dead" && (change.ifReducedTo === undefined || target.hp.value <= change.ifReducedTo)) killCreature(state, target);
                break;
            case "affliction":
                if (Array.isArray(change.data?.stages)) applyAffliction(state, caster, target, change.data);
                break;
            case "followUp":
                if (isActive(target) && change.plan?.resolution?.kind && registry.familyFor(change.plan.resolution.kind)) {
                    const result = registry.resolveSync(change.plan, { ...context, targets: [target] }, io);
                    applyChanges(state, caster, spell, result.changes, context, io);
                }
                break;
            default:
                // Notes, PF2e spell effects and the like: counted as gaps in the report.
                break;
        }
    }
}

// Casts spell spellIndex at the targets (ids). Spends its pool.
export function castSpell(state, caster, spellIndex, targetIds, actions, options = {}) {
    const spell = caster.spells[spellIndex];
    // (B304, Consume Flesh: "from any given corpse only once" — each use takes one of the fight's corpses.)
    if ((spell?.plan?.needs ?? []).some((need) => need.corpse || need.any?.some((each) => each.corpse))) caster.corpsesUsed = (caster.corpsesUsed ?? 0) + 1;
    castPlan(state, caster, spell, targetIds, actions, options);
    // (U10: an item's own counteract — Surging Serum, Panacea — on those it was used on.)
    if (spell?.counteract) for (const id of targetIds ?? []) {
        const target = state.byId.get(id);
        if (target && (isActive(target) || target.status === DOWN)) applyItemCounteract(state, caster, spell, target);
    }
    // (U12: its persistent damage recovery — Quenching Potion's flat check.)
    if (spell?.recovery) for (const id of targetIds ?? []) {
        const target = state.byId.get(id);
        if (target && (isActive(target) || target.status === DOWN)) applyItemRecovery(state, spell, target);
    }
    // (Invisibility: it ends once a harmful spell is cast.)
    const info = spell?.plan ? describeSpell(spell.plan, actions) : null;
    if (info && !info.helpful && !info.healing && !info.self && !spell.drinker) ownHostility(state, caster);
}

// Resolves a spell or ability (one of the creature's, or a rider's plan) at the targets.
// Spellstrike (C20): forcedDegree is the Strike's result for a spell attack; disrupted, a spell lost to a critically missed Strike.
export function castPlan(state, caster, spell, targetIds, actions, { forcedDegree = null, disrupted = false, evenDown = false } = {}) {
    // A random effect table (B255): the die picks the way, played as the ability (a face with nothing to play does nothing; "roll twice"
    // rolls twice more, without that face). The ways share the ability's recharge.
    if (spell.randomWays?.length) {
        // (B263, Roll the Bones: several dice added, spell.dice of them.)
        const roll = (ways) => {
            let face = 0;
            for (let count = 0; count < Math.max(1, Number(spell.dice) || 1); count++) face += state.rng.die(spell.die);
            return ways.find((way) => way.faces.includes(face)) ?? null;
        };
        const first = roll(spell.randomWays);
        // (A face that would roll again is rolled over, at most 20 times.)
        const again = () => {
            let way = null;
            for (let tries = 0; tries < 20 && (!way || way.again); tries++) way = roll(spell.randomWays) ?? { name: "nothing", plan: null };
            return way?.again ? null : way;
        };
        const picks = first?.again ? Array.from({ length: first.again }, again) : [first];
        log(state, `  ${caster.name} uses ${spell.name}: ${picks.map((way) => way?.name ?? "nothing").join(", ")}`);
        const recharge = describeSpell(spell.plan, actions).recharge;
        if (recharge) (caster.rechargeUntil ??= new Map()).set(spell.rechargeGroup ?? spell, state.round + rollCount(state, recharge));
        for (const way of picks) {
            if (!way?.plan?.resolution || !isActive(caster)) continue;
            const at = way.plan.targeting?.target === "self" ? [caster.id] : targetIds;
            castPlan(state, caster, { ...spell, randomWays: null, pool: null, plan: { ...way.plan, trigger: { ...(way.plan.trigger ?? {}), recharge: null } }, name: `${spell.name} (${way.name})` }, at, actions, { forcedDegree, disrupted });
        }
        return;
    }
    // A zone (B256): its area made; what it does then and over the turns is zones.js's.
    if (spell.zone) {
        spendPool(caster, spell);
        const recharge = describeSpell(spell.plan, actions).recharge;
        if (recharge) (caster.rechargeUntil ??= new Map()).set(spell.rechargeGroup ?? spell, state.round + rollCount(state, recharge));
        log(state, `  ${caster.name} uses ${spell.name}`);
        if (spell.kind === "item" && state.stats) state.stats[caster.side === "party" ? "partyItemsUsed" : "foeItemsUsed"]++;
        startZone(state, caster, spell, targetIds);
        return;
    }
    const info = describeSpell(spell.plan, actions);
    // (B316: evenDown — Death Strike at a creature the spell just dropped.)
    const reachable = (target) => isActive(target) || target === caster || ((info.healing || info.dying || evenDown) && target.status === DOWN);
    const targets = targetIds.map((id) => state.byId.get(id)).filter((target) => target && reachable(target));
    spendPool(caster, spell);
    // (A lingering area's later save: its own line, not a new cast.)
    if (spell.fromZone) log(state, `  ${spell.name} on ${targets.map((target) => target.name).join(", ")}`);
    // (U1: an item drunk, fed to an ally, or used.)
    else if (spell.kind === "item") log(state, `  ${caster.name} ${itemWords(spell, caster, targets)}`);
    if (spell.kind === "item" && state.stats) state.stats[caster.side === "party" ? "partyItemsUsed" : "foeItemsUsed"]++;
    else log(state, `  ${caster.name} casts ${spell.name}${spell.from ? ` from ${spell.from}` : ""}${actions && spellVariants(spell).length > 1 ? ` (${actions} actions)` : ""}${targets.length ? ` at ${targets.map((target) => target.name).join(", ")}` : ""}`);
    // (I1: a creature immune to the effect's trait — a mindless one to a mental effect, a construct to a death effect — is unaffected.)
    for (const target of [...targets]) {
        const immunity = effectImmunity(target, spell);
        // (B317: outside who the spell can affect.)
        const outside = immunity ? null : outsideTargets(caster, target, spell);
        if (!immunity && !outside) continue;
        targets.splice(targets.indexOf(target), 1);
        log(state, immunity ? `  ${target.name} is immune (${immunity.replace(/-/g, " ")})` : `  ${target.name} is unaffected (${outside})`);
    }
    // (T7: a troop ignores a non-damaging effect aimed at one creature — Demoralize, a Charm.)
    const damaging = planDamages(spell.plan);
    for (const target of [...targets]) {
        if (!troopIgnores(target, { damaging, targets: info.area ? Infinity : targetIds.length })) continue;
        targets.splice(targets.indexOf(target), 1);
        log(state, `  ${target.name} is unaffected (a troop)`);
    }
    // (T5: an elemental dragon's answer to a spell of an element aimed at it.)
    for (const target of targets) if (target.elemental && target !== caster) elementalAnswers(state, target, "targeted", { spell, applyCondition });
    // (Sanctuary: an attack spell at a warded creature, a save first; stopped, not at it.)
    if (info.attack) for (const target of [...targets]) if (wardBlocks(state, caster, target)) targets.splice(targets.indexOf(target), 1);
    // (A harmful spell at a foe is hostility: it ends Calm, and a charm the caster put on it.)
    if (!info.helpful && !info.healing) for (const target of targets) if (target !== caster && target.side !== caster.side) hostility(state, target, caster);
    // A magus's conflux spell recharges Spellstrike.
    if (caster.spellstrike && !caster.spellstrikeCharged && (spell.plan?.traits ?? []).includes("conflux") && (info.actions ?? 0) >= 1) {
        caster.spellstrikeCharged = true;
        log(state, `  ${caster.name}'s Spellstrike recharges`);
    }
    if (disrupted) {
        log(state, `  ${spell.name} is disrupted`);
        return;
    }
    if (info.attack) caster.attacksThisTurn++;
    // Stupefied: a DC 5 + value flat check, or the spell is lost.
    // (B313: a spell only, as PF2e has it — not an ability or a basic action such as Demoralize.)
    const stupefied = isSpellCast(spell) ? (caster.cond.stupefied ?? 0) : 0;
    if (stupefied && flatCheck(state.rng, 5 + stupefied) < SUCCESS) {
        log(state, `  ${caster.name} loses the spell (stupefied ${stupefied})`);
        return;
    }
    // (S59: a spell its caster can't cast again for minutes, once a fight; Sure Strike's attack also finds a concealed or hidden target
    // without the flat check.)
    if (castImmunityKey(spell) && !spell.fromZone) (caster.castImmune ??= new Set()).add(castImmunityKey(spell));
    if ((spell.plan?.resolution?.gmNotes ?? []).some((text) => FINDS_HIDDEN.test(String(text)))) caster.fortuneFinds = true;
    // (A hex Cast: one a turn; its caster's familiar answers it — familiars.js.)
    if (isHex(spell) && !spell.fromZone) {
        (caster.usedThisTurn ??= new Set()).add("hex");
        hexFamiliar(state, caster, spell.name, { applyCondition });
    }
    // (A lingering spell: its area stays, its later saves as a zone's — zones.js.)
    if (spell.plan?.resolution?.lingering && !spell.fromZone) startLingering(state, caster, spell, targetIds);
    // Blinded or dazzled: each target of a targeted spell needs a flat check.
    // (L1: and each one the light or the weather hides from it.)
    // (2026-10-14: a hidden or concealed target too — Invisibility, Blur — as a Strike's; Truesight sees through Invisibility.)
    // (A zone's save is the area's: nothing to find.)
    // (S59, a spell attack Sure Strike rolls twice: no flat check for the target being concealed or hidden.)
    const finds = info.attack && forcedDegree === null && caster.fortuneFinds && (caster.effects ?? []).some((effect) => effect.model?.fortune?.on === "attack");
    const findDC = (target) => (info.area || spell.fromZone || target === caster ? 0 : Math.max(caster.cond.blinded ? 11 : caster.cond.dazzled ? 5 : 0, target.side !== caster.side && !finds ? (hiddenFrom(state, caster, target) ? 11 : target.cond?.concealed ? 5 : 0) : 0, sightDC(state, caster, target)));
    if (targets.some((target) => findDC(target) > 0)) {
        const found = targets.filter((target) => !findDC(target) || flatCheck(state.rng, findDC(target)) >= SUCCESS);
        if (found.length < targets.length) log(state, `  ${caster.name} fails to find ${targets.length - found.length} target(s)`);
        targets.splice(0, targets.length, ...found);
    }
    // A recharge ("can't use it again for 1d4 rounds") and immunity (Demoralize, Frightful Presence).
    // The ways of one ability (a dragon's two breath weapons) share it: their rechargeGroup, the ability's name.
    if (info.recharge) (caster.rechargeUntil ??= new Map()).set(spell.rechargeGroup ?? spell, state.round + rollCount(state, info.recharge));
    const markImmune = (list) => {
        const immune = (caster.immuneTargets ??= new Map()).get(spell) ?? new Set();
        for (const target of list) immune.add(target.id);
        caster.immuneTargets.set(spell, immune);
    };
    if (info.immunity && !info.immunityDegrees) markImmune(targets);
    if (!targets.length) return;
    // Golem Antimagic (B56): a golem takes others' magic only as its list says.
    const golems = targets.map((target) => [target, golemAnswer(caster, spell, target, Boolean(info.area))]).filter(([, answer]) => answer);
    if (golems.length) {
        for (const [golem, answer] of golems) answerGolem(state, caster, spell, golem, answer);
        targets.splice(0, targets.length, ...targets.filter((target) => !golems.some(([golem]) => golem === target)));
        if (!targets.length) return;
    }
    // Trample: the creature moves through them, ending beside them.
    if (info.trample) {
        stride(state, caster, { kind: "engage", targetId: targets[0].id });
        if (!canAct(caster)) return;
        targets.splice(0, targets.length, ...targets.filter((target) => isActive(target)));
        if (!targets.length) return;
    }
    // (B105: an Escape from one whose reaction makes it harder, Tighten Coils.)
    if (info.escape) for (const target of targets) guardEscape(state, caster, target);
    // (B136, Punish Flight: a Strike at the creature as it tries to Escape; dropped by it, it doesn't get to try.)
    if (info.escape) for (const target of targets) escapeAttempted(state, caster, target);
    if (info.escape && !canAct(caster)) {
        for (const target of targets) delete target.escapeGuardActive;
        return;
    }
    const context = simContext(state, caster, spell, targets, caster.attacksThisTurn - (info.attack ? 1 : 0), actions);
    const live = liveRoller(state);
    // Spellstrike: the spell attack takes the Strike's result.
    const rolled = forcedDegree !== null ? (statistic, options) => (statistic === "spell-attack" || statistic === "strike" ? { natural: null, total: null, dc: options?.dc, degree: DEGREE_NAMES[forcedDegree] } : live.roll(statistic, options)) : live.roll;
    // (B193, Ray Displacement: a ranged spell attack at a creature whose reaction makes it roll twice, the worse kept.)
    const misfortune = (statistic, options) => {
        const target = options?.target;
        const rule = target?.misfortuneReaction;
        if (forcedDegree !== null || statistic !== "spell-attack" || !rule?.spell || !target.id || target.side === caster.side || !isActive(target) || !canReact(target) || (rule.ranged && info.touch)) return null;
        target.reactionUsed = true;
        state.stats.reactions++;
        log(state, `  ${target.name} uses ${rule.name}`);
        const natural = Math.min(state.rng.d20(), state.rng.d20());
        const total = natural + options.modifier;
        return { natural, total, dc: options.dc, degree: DEGREE_NAMES[degreeOf(total, options.dc, natural)] };
    };
    // (B302: Evasion, Juggernaut, Bravery … — the save's degree adjusted, before any reaction.)
    const adjusted = (statistic, options, result) => (SAVE_SLUGS.has(statistic) && options?.actor?.saveDegrees && result?.degree ? { ...result, degree: DEGREE_NAMES[adjustedSaveDegree(options.actor, statistic, DEGREE_NAMES.indexOf(result.degree), spell)] } : result);
    // (A failed save a reaction makes better, B80.)
    // (B308, Reflect Spell: a reaction raising its AC against a spell attack — a ranged one where it says so.)
    const raised = (statistic, options) => {
        const target = options?.target;
        const rule = target?.acReaction;
        if (forcedDegree !== null || statistic !== "spell-attack" || !rule?.spellOnly || !target.id || target.side === caster.side || !isActive(target) || !canReact(target, rule.name) || (rule.against === "ranged" && info.touch)) return options;
        spendReaction(target, rule.name);
        state.stats.reactions++;
        log(state, `  ${target.name} uses ${rule.name}: +${rule.value} AC against ${spell.name}`);
        return { ...options, dc: options.dc + rule.value };
    };
    // (S54, Sure Strike: the caster's next attack roll — a spell attack too — twice, the better kept.)
    let ownFortune = () => null;
    if (info.attack && forcedDegree === null) {
        const keep = takeAttackFortune(caster);
        if (keep) {
            log(state, `  ${caster.name} rolls twice (${keep === "higher" ? "the better" : "the worse"} kept)`);
            caster.fortuneFinds = false;
        }
        ownFortune = (statistic) => (statistic === "spell-attack" ? keep : null);
    }
    const roll = (statistic, given) => {
        const keep = ownFortune(statistic);
        const options = raised(statistic, keep ? { ...given, [keep === "higher" ? "fortune" : "misfortune"]: true } : given);
        const result = betterSave(state, statistic, options, adjusted(statistic, options, misfortune(statistic, options) ?? rolled(statistic, options)), spell, { area: Boolean(info.area) });
        return heroReroll(statistic, options, result) ?? result;
    };
    // (2026-10-15, hero points "when it matters": a PC's critically failed save, or a failed one that would take it out; its missed spell
    // attack that would have dropped the target — rerolled, the new result kept.)
    const heroReroll = (statistic, options, result) => {
        const degree = DEGREE_NAMES.indexOf(result?.degree);
        if (forcedDegree !== null || degree < 0 || degree > 1) return null;
        const saver = SAVE_SLUGS.has(statistic) ? options?.actor : null;
        if (saver?.id && saver !== caster && isActive(saver) && canSpendHero(state, saver) && saveWorthReroll(saver, degree, outcomesFor(state, caster, spell, saver, actions)?.[degree])) {
            spendHeroPoint(state, saver, `its ${statistic} save`);
            return adjusted(statistic, options, rolled(statistic, options));
        }
        const target = statistic === "spell-attack" ? options?.target : null;
        if (target?.id && isActive(target) && canSpendHero(state, caster)) {
            const hit = outcomesFor(state, caster, spell, target, actions)?.[2];
            if (takesOut(target, hit)) {
                spendHeroPoint(state, caster, "its spell attack");
                return rolled(statistic, options);
            }
        }
        return null;
    };
    // (B195, Siphon Life: a foe's healing at its least — each die at 1, flat values halved — then temporary Hit Points on the siphoner.)
    const siphon = info.healing ? state.list.find((c) => c.healSiphon && c.side !== caster.side && isActive(c) && canReact(c)
        && (c.healSiphon.within >= 60 || sameMelee(c, caster) || c.band === caster.band)) : null;
    if (siphon) {
        siphon.reactionUsed = true;
        state.stats.reactions++;
        log(state, `  ${siphon.name} uses ${siphon.healSiphon.name}: ${siphon.healSiphon.share ? "it takes a share of the healing" : "the healing is at its least"}`);
    }
    const least = (instance) => Math.max(0, Math.floor(Math.floor(instance.constant / 2) + instance.dice.reduce((sum, term) => sum + term.factor * term.count, 0)));
    // (B209: a share of each roll kept for the creature, the rest the siphoner's temporary Hit Points.)
    let siphoned = 0;
    let whole = 0;
    const shared = (instance) => {
        const full = live.damage(instance);
        const kept = Math.floor(full * siphon.healSiphon.share);
        siphoned += full - kept;
        whole += full;
        return kept;
    };
    const io = { ...live, ...(siphon ? { damage: siphon.healSiphon.share ? shared : least } : {}), roll, choose: chooser(caster, targets) };
    const result = registry.resolveSync(spell.plan, context, io);
    // (B220, Parasitic Healing: the siphoner regains the full amount instead.)
    if (siphon?.healSiphon.selfHeal === "full" && whole > 0 && isActive(siphon)) {
        const before = siphon.hp.value;
        siphon.hp.value = Math.min(siphon.hp.max, siphon.hp.value + whole);
        log(state, `  ${siphon.name} regains ${siphon.hp.value - before} HP`);
    }
    const temp = siphon?.healSiphon.selfHeal === "full" ? 0 : siphon?.healSiphon.share ? siphoned : siphon?.healSiphon.tempHp ? rollCount(state, siphon.healSiphon.tempHp) : 0;
    if (siphon && temp > 0 && isActive(siphon)) {
        if (temp > (siphon.hp.temp ?? 0)) siphon.hp.temp = temp;
        log(state, `  ${siphon.name} gains ${temp} temporary HP`);
    }
    // (S55, Chain Lightning: the chain ends with the first target that critically succeeds — those after it aren't reached.)
    if (spell.plan?.resolution?.chain) {
        const stop = targets.findIndex((target) => result.degrees[target.id] === spell.plan.resolution.chain.endsOn);
        if (stop >= 0 && stop < targets.length - 1) {
            const missed = new Set(targets.slice(stop + 1).map((target) => target.id));
            log(state, `  the chain ends at ${targets[stop].name}`);
            targets.splice(stop + 1);
            result.changes = result.changes.filter((change) => !missed.has(change.target));
        }
    }
    for (const target of targets) {
        const degree = result.degrees[target.id];
        if (degree) log(state, `  ${target.name}: ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
    }
    if (info.immunity && info.immunityDegrees) markImmune(targets.filter((target) => !result.degrees[target.id] || info.immunityDegrees.includes(result.degrees[target.id])));
    applyChanges(state, caster, spell, result.changes, context, io);
    // (S56, Acid Splash: a hit's splash damage on the others within 5 feet of the target — its Melee — not doubled on a critical hit.)
    if (spell.plan?.resolution?.splash) splashAround(state, caster, spell, targets, result);
    // (B316, Death Strike: "… or that critically fails against any of its spells must succeed at a … save or die" — the caster's abilities
    // that say so, at each foe that critically failed a save against one of its spells, standing or just dropped by it.)
    const onCriticalFailure = isSpellCast(spell) ? (caster.spells ?? []).filter((entry) => entry.plan?.trigger?.spellCriticalFailure) : [];
    for (const target of onCriticalFailure.length ? targets : []) {
        if (result.degrees[target.id] !== "criticalFailure" || target.side === caster.side || !(isActive(target) || target.status === DOWN)) continue;
        for (const entry of onCriticalFailure) castPlan(state, caster, entry, [target.id], undefined, { evenDown: true });
    }
    // (B273: a foe's failed save against its own spell or ability — Mass Improved Grab, Siphon Faith: its reaction at that creature.)
    if (spell.plan?.resolution?.kind === "save") for (const target of targets) {
        if (!["failure", "criticalFailure"].includes(result.degrees[target.id]) || !isActive(target) || !isActive(caster) || target.side === caster.side) continue;
        const named = String(spell.name ?? "").toLowerCase().replace(/ \(.*\)$/, "");
        useReaction(state, caster, target, (trigger) => trigger.event === "foe-failed-save" && (!trigger.ability || trigger.ability.toLowerCase() === named) && (!trigger.spell || !spell.kind || spell.kind === "spell") && (!trigger.traits?.length || trigger.traits.some((trait) => (spell.plan?.traits ?? []).includes(trait))));
    }
    // Otherworldly Mind, Entropic Feedback: a mental effect aimed at a creature whose ability answers it (B46).
    if (!info.area) targetedAnswers(state, caster, spell, targets);
    // Savage, Gnashing Bite (B92): a failed Escape, answered by the creature holding it.
    if (info.escape) for (const target of targets) {
        delete target.escapeGuardActive;
        escapeAnswers(state, caster, target, result.degrees[target.id]);
    }
    // (B146: a Strike at the same creature after the maneuver — Noble's Ruse, Bully, Sacrificial Takedown.)
    if (spell.plan?.then) for (const target of targets) followUpStrike(state, caster, target, spell.plan.then, result.degrees[target.id]);
    // (B136, Sweeping Hook: its own Trip that succeeded, its Strike at the creature it tripped.)
    if (spell.plan?.source?.slug === "trip") for (const target of targets) {
        if (!["success", "criticalSuccess"].includes(result.degrees[target.id])) continue;
        const answer = (caster.reactionStrikes ?? []).find((entry) => entry.triggers.includes("tripped"));
        if (answer && isActive(caster) && isActive(target) && canAct(caster) && canReact(caster, answer.name) && !caster.cond.fleeing) reactionStrikeAt(state, caster, target, answer, "tripped");
    }
    // A swashbuckler's bravado action: panache on a success, until the end of the turn on a failure.
    if (caster.panacheStyle && (caster.panacheStyle.bravado.includes(spell.plan?.source?.slug) || (spell.plan?.traits ?? []).includes("bravado"))) {
        const degrees = targets.map((target) => result.degrees[target.id]).filter(Boolean);
        if (degrees.some((degree) => degree === "success" || degree === "criticalSuccess")) {
            if (caster.panache !== true) log(state, `  ${caster.name} gains panache`);
            caster.panache = true;
        } else if (degrees.includes("failure") && !caster.panache) {
            caster.panache = "turn";
            log(state, `  ${caster.name} gains panache until the end of its turn`);
        }
    }
}

// Splash damage (S56): each target hit, the splash instances of its damage on every other creature in its Melee (allies too, as PF2e
// has it), halved back from a critical hit's doubling.
function splashAround(state, caster, spell, targets, result) {
    for (const target of targets) {
        const degree = result.degrees[target.id];
        if (degree !== "success" && degree !== "criticalSuccess") continue;
        const splash = result.changes.filter((change) => change.op === "damage" && change.target === target.id).flatMap((change) => change.instances ?? []).filter((instance) => instance.category === "splash");
        if (!splash.length || target.meleeId === null || target.meleeId === undefined) continue;
        const others = state.list.filter((other) => other !== target && isActive(other) && sameMelee(other, target));
        for (const other of others) {
            const instances = splash.map((instance) => ({ type: instance.type, amount: degree === "criticalSuccess" ? Math.floor(instance.amount / 2) : instance.amount, persistent: false, precision: false, splash: true })).filter((instance) => instance.amount > 0);
            if (instances.length) applyDamage(state, other, instances, { source: caster, spell: { rank: Number(spell.castRank) || 1, targeted: false } });
        }
    }
}

// Exploit Vulnerability: an Esoteric Lore check against the target's level DC.
// A success uses its highest weakness or a personal antithesis (2 + half the
// thaumaturge's level), whichever is bigger; a failure, the antithesis; a
// critical failure, nothing, and the thaumaturge is off-guard until its next turn.
export function exploitVulnerability(state, c, target) {
    const natural = state.rng.d20();
    const degree = degreeOf(natural + c.exploit.modifier - statusPenalty(c, "skill"), levelDC(target.level), natural);
    log(state, `  ${c.name} uses ${c.exploit.name} on ${target.name}: ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
    if (degree === 0) {
        c.cond.offGuard = true;
        (c.timers ??= []).push({ key: "offGuard", value: true, round: state.round + 1, turnOf: c.id, at: "start" });
        return;
    }
    const weakest = Math.max(0, ...(target.weaknesses ?? []).map((entry) => entry.value ?? 0));
    c.exploited = { targetId: target.id, value: degree >= 2 ? Math.max(weakest, c.exploit.antithesis) : c.exploit.antithesis };
}

// The weakness Exploit Vulnerability would most likely give against a target, on average.
export function exploitValue(c, target) {
    const odds = degreeDistribution(c.exploit.modifier - statusPenalty(c, "skill"), levelDC(target.level));
    const weakest = Math.max(0, ...(target.weaknesses ?? []).map((entry) => entry.value ?? 0));
    return (odds[2] + odds[3]) * Math.max(weakest, c.exploit.antithesis) + odds[1] * c.exploit.antithesis;
}

// Overdrive: a Crafting check against the inventor's level DC; its Strikes deal
// its Intelligence modifier more on a critical success, half on a success, 1
// fire on a failure; a critical failure burns it (1d6 fire per 2 levels, at least 1d6).
export function overdrive(state, c) {
    const natural = state.rng.d20();
    const degree = degreeOf(natural + c.overdrive.modifier - statusPenalty(c, "skill"), levelDC(c.overdrive.level), natural);
    log(state, `  ${c.name} uses ${c.overdrive.name}: ${DEGREE_NAMES[degree].replace(/([A-Z])/g, " $1").toLowerCase()}`);
    c.activeBuffs = (c.activeBuffs ?? []).filter((buff) => buff.name !== c.overdrive.name);
    if (degree === 0) {
        let amount = 0;
        for (let die = 0; die < Math.max(1, Math.floor(c.overdrive.level / 2)); die++) amount += state.rng.die(6);
        applyDamage(state, c, [{ type: "fire", amount, persistent: false, precision: false }], { source: c });
        c.overdriveDone = true;
        return;
    }
    const bonus = degree === 3 ? c.overdrive.intMod : degree === 2 ? Math.floor(c.overdrive.intMod / 2) : 1;
    const type = degree === 1 ? "fire" : null;
    const strikeDeltas = Object.fromEntries((c.strikes ?? []).map((strike) => [strike.name, [{ dice: 0, die: 0, bonus, multiplier: 1, type: type ?? strike.damage[0]?.type, precision: false, persistent: false }]]));
    c.activeBuffs.push({ name: c.overdrive.name, strikeDeltas });
    if (degree >= 2) c.overdriveDone = true;
}

// "1d4" or "3" → a number of rounds.
// The average of a count the text rolls ("1d4": 2.5).
function averageRoll(formula) {
    const dice = /^(\d+)d(\d+)$/.exec(String(formula).trim());
    return dice ? Number(dice[1]) * (Number(dice[2]) + 1) / 2 : Number(formula) || 1;
}

export function rollCount(state, formula) {
    const dice = /^(\d+)d(\d+)$/.exec(String(formula).trim());
    if (!dice) return Number(formula) || 1;
    let total = 0;
    for (let index = 0; index < Number(dice[1]); index++) total += state.rng.die(Number(dice[2]));
    return total;
}

// After a Strike hits: riders its Strike lists (Grab, Knockdown, Push). Free
// ones (Improved Grab) happen at once; the others can be the creature's next action.
export function triggerRiders(state, attacker, target, strike, degree = SUCCESS) {
    // (Several follow-ups the Strike allows, each a way of one ability (Wicked Bite's, B78): all ready, the planner picks.)
    let ready = null;
    for (const [index, spell] of (attacker.spells ?? []).entries()) {
        const trigger = spell.plan?.trigger;
        // A follow-up to a Strike that hit ("last action was a successful claw Strike"): ready as the next action.
        const follow = trigger?.followUp;
        if (follow) {
            const name = String(strike.name ?? "").toLowerCase();
            const named = !follow.strike || name === follow.strike || name.startsWith(follow.strike) || name.includes(follow.strike) || follow.strike.includes(name);
            // (A Strike that lists it, "a success with a Strike that has Disarm in its damage entry", B68; the Strike's degree, for
            // results by it, "Enfeebled 2 (or Enfeebled 3 on a critical hit)".)
            const listing = !follow.listing || (strike.attackEffects ?? []).some((effect) => String(effect).replace(/^improved-/, "") === follow.listing);
            // (B260, Mind-Rending Sting: after two of those Strikes in a row this turn, both hitting this creature.)
            const pair = (attacker.turnAttacks ?? []).slice(-2);
            const twice = !follow.twice || (pair.length === 2 && pair.every((attack) => attack.hit && attack.targetId === target.id && attack.strike === strike.name));
            if ((follow.on ?? ["success", "criticalSuccess"]).includes(DEGREE_NAMES[degree]) && named && listing && twice && (!follow.melee || strike.melee)) {
                // (B194, Improved Vex: a free one, at once.)
                if (trigger.cost === "free") {
                    if (isActive(target)) castSpell(state, attacker, index, [target.id]);
                    continue;
                }
                if (ready) (ready.also ??= []).push(index);
                else ready = attacker.riderReady = { index, targetId: target.id, degree };
            }
            continue;
        }
        // The Strike lists the rider by its own slug ("improved-grab") or its base one ("grab"), or the rider names the Strike
        // ("hit by the wraith's spectral hand Strike", B58); a critical hit's only on a critical hit (B58).
        const listed = strike.attackEffects ?? [];
        const named = (trigger?.strikes ?? []).includes(String(strike.name ?? "").toLowerCase());
        if (trigger?.event !== "strike" || !(listed.includes(trigger.attackEffect) || listed.includes(spell.plan.source?.slug) || named)) continue;
        // (U4: a poison on the weapon, as long as doses are left.)
        if (spell.kind === "item" && !poolReady(attacker, spell)) continue;
        if (!(trigger.on ?? ["success", "criticalSuccess"]).includes(DEGREE_NAMES[degree])) continue;
        // (Its results by the Strike's degree, "Enfeebled 1 (or Enfeebled 2 on a critical hit)": that degree, B66.)
        const byStrike = spell.plan?.resolution?.check?.statistic === "strike";
        if (trigger.cost === "free") castSpell(state, attacker, index, [target.id], undefined, byStrike ? { forcedDegree: degree } : {});
        else attacker.riderReady = { index, targetId: target.id };
    }
}

// Auras (Frightful Presence): when the fight starts, each enemy in range is
// affected once (the user's rule for live play too: being inside when combat
// starts counts as entering). Bands: from 60 feet everyone; nearer, not those far away.
export function applyAuras(state) {
    for (const c of state.list) {
        if (!isActive(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            // Not one that acts on its own when entered or at a turn (Magic-Warping Aura), nor one that runs only after another ability (Miasma).
            if (trigger?.event !== "aura" || (Array.isArray(trigger.when) && !trigger.when.length) || trigger.activeAfter) continue;
            const radius = describeSpell(spell.plan).area?.value ?? 30;
            const targets = state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone" && (radius >= 60 || other.band !== "far" || c.band === "far"));
            if (targets.length) castSpell(state, c, index, targets.map((target) => target.id));
        }
    }
}

// Death throes (B42): a monster's abilities that act as it dies ("When the skeleton is destroyed, … adjacent creatures take
// 2d6 slashing damage"), on everyone in their area: its Melee for 10 feet or less, and the creatures not far off for more (as
// auras reach), everyone from 60 feet. melee: the ids in its Melee as it died. One with no area isn't played.
export function deathThroes(state, c, melee) {
    for (const [index, spell] of (c.spells ?? []).entries()) {
        if (spell.plan?.trigger?.event !== "death") continue;
        const radius = describeSpell(spell.plan).area?.value;
        if (!radius) continue;
        // Only the creatures of the kind it names (B55: Verdant Burst's "each plant creature").
        const kind = spell.plan.targeting?.traits;
        const targets = around(state, c, radius, (other) => melee.has(other.id)).filter((other) => traitsFit(other.traits, kind));
        if (targets.length) castSpell(state, c, index, targets.map((target) => target.id));
    }
}

// A creature of the kind an ability names: filter { all, any } of trait slugs; none: any creature.
function traitsFit(traits, filter) {
    if (!filter) return true;
    const has = new Set((traits ?? []).map((trait) => String(trait).toLowerCase()));
    return (filter.all ?? []).every((trait) => has.has(trait)) && (!(filter.any ?? []).length || filter.any.some((trait) => has.has(trait)));
}

// The creatures within radius feet of c, by the bands: its Melee for 10 feet or less, those not far off for more (as auras
// reach), everyone from 60 feet.
function around(state, c, radius, inMelee) {
    return state.list.filter((other) => other !== c && isActive(other) && other.band !== "gone" && (radius >= 60 || inMelee(other) || (radius > 10 && (other.band !== "far" || c.band === "far"))));
}

// A melee hit on a creature whose passive answers it ("A creature that hits a pukwudgie with an unarmed Strike or a non-reach
// melee Strike takes 3d8 piercing damage", B43): the passive on the attacker; one for unarmed attacks or touch only when the
// Strike is unarmed.
// (Batch 19: also any attack when it says so, a critical hit only, the damage types it names, its area around the monster.)
export function hitByAnswers(state, defender, attacker, strike, degree = SUCCESS, types = []) {
    passiveAnswers(state, defender, attacker, (trigger) => trigger.event === "hit-by" && !trigger.missed && (!trigger.melee || strike.melee) && (!trigger.unarmed || strike.unarmed)
        && (!trigger.critical || degree === CRITICAL_SUCCESS) && (!trigger.notCritical || degree !== CRITICAL_SUCCESS) && typesMatch(trigger.damageTypes, types));
}

// A monster's passives that answer an event (B43, B48): each that matches, on its targets (see answerTargets).
function passiveAnswers(state, c, other, matches) {
    for (const [index, spell] of (c.spells ?? []).entries()) {
        const trigger = spell.plan?.trigger;
        if (!trigger || trigger.reaction || !matches(trigger)) continue;
        const targets = answerTargets(state, c, spell.plan, other);
        if (targets.length) castSpell(state, c, index, targets.map((target) => target.id));
    }
}

// Who an answer goes on: the creature that set it off (the attacker, the creature its Strike hit, the creature starting its
// turn), the creatures around it or around the creature it hit (Storm Smite), or none (the GM's targets in live play).
const effectFor = (plan, recipients) => plan?.resolution?.kind === "effect" && (plan.resolution.applications ?? []).some((application) => application.recipients === recipients);
const allyEffect = (plan) => effectFor(plan, "allies-in-area");
function answerTargets(state, c, plan, other) {
    const radius = describeSpell(plan).area?.value;
    const live = other && isActive(other);
    // (B265: "the triggering creature" — Elegy of the Faithless's caster, the disrupting saves' creature.)
    if (["the attacker", "the creature the Strike hits", "the held creature", "the triggering creature"].includes(plan.targeting?.target)) return live ? [other] : [];
    // (B305: on itself.)
    if (plan.targeting?.target === "self") return [c];
    // (B305, Quick Escape: "the creature grabbing you" — the one whose grab set it off.)
    if (/^the creature (?:grabbing|holding) (?:you|it|them|him|her)$/i.test(plan.targeting?.target ?? "")) return live ? [other] : [];
    // (B131, Electric Reflexes: "an adjacent creature" — the one that set it off when it's beside it, else another foe in its Melee.)
    if (plan.targeting?.target === "an adjacent creature") {
        const beside = live && other.side !== c.side && sameMelee(c, other) ? other : state.list.find((foe) => foe.side !== c.side && isActive(foe) && sameMelee(c, foe));
        return beside ? [beside] : [];
    }
    if (radius && plan.targeting?.area?.around === "target") return live ? [other, ...around(state, other, radius, (near) => sameMelee(other, near)).filter((near) => near !== c)] : [];
    // (B106: an effect for its allies with no area, Brutal Rally's "All allies that can see the gang leader": its allies in the fight.)
    // (Curl Up's "gains a +2 circumstance bonus to AC": its own effect, on itself.)
    if (!radius && effectFor(plan, "self")) return [c];
    if (!radius && allyEffect(plan)) return state.list.filter((ally) => ally !== c && ally.side === c.side && isActive(ally) && ally.band !== "gone");
    // (B100: one creature, with none setting it off — Battle Cry's Demoralize as the fight starts: its nearest foe.)
    if (!radius && !other && plan.targeting?.target === "1 creature") {
        const foe = nearestFoe(state, c, plan);
        return foe ? [foe] : [];
    }
    // (B229: an emanation on its foes only.)
    return radius ? around(state, c, radius, (near) => sameMelee(c, near)).filter((near) => !describeSpell(plan).area?.foes || near.side !== c.side) : [];
}

// A foe for one-creature ability no creature set off (B100): one in its Melee, else one not far (for a range over 10 feet).
function nearestFoe(state, c, plan) {
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone");
    const range = Number.parseInt(plan.targeting?.range ?? "", 10) || 0;
    return foes.find((other) => sameMelee(c, other)) ?? (range > 10 ? foes.find((other) => other.band !== "far" || c.band === "far") : null) ?? null;
}

// A monster's reaction to a hit, a critical hit or damage on it (B44: Shrapnel Splash's "The dragon is critically hit with a
// melee weapon or unarmed attack", Reactive Thrash, Freezing Blood's piercing or slashing damage, Solar Flare's "takes
// damage"): used whenever it can react and the ability is ready, on the attacker, or on the creatures in its area when a foe
// is among them. One with neither (the GM's targets in live play) isn't played. types: the damage types dealt.
export function reactToHit(state, defender, attacker, strike, degree, types) {
    useReaction(state, defender, attacker, (trigger) => trigger.event === "hit-by" && !trigger.missed && (!trigger.critical || degree === CRITICAL_SUCCESS) && (!trigger.melee || strike.melee) && (!trigger.unarmed || strike.unarmed)
        && (!trigger.within || trigger.within > 10 || sameMelee(defender, attacker)) && typesMatch(trigger.damageTypes, types));
}

// (B246, Robe Tangle: a miss on it — "hit-by" with missed, a critical miss with critical.)
export function reactToMiss(state, defender, attacker, strike, degree) {
    useReaction(state, defender, attacker, (trigger) => trigger.event === "hit-by" && trigger.missed && (!trigger.critical || degree === CRITICAL_FAILURE) && (!trigger.melee || strike.melee)
        && (!trigger.within || trigger.within > 10 || sameMelee(defender, attacker)));
}

export function reactToDamage(state, target, source, types) {
    const sets = (trigger) => trigger.event === "damaged" && typesMatch(trigger.damageTypes, types);
    // Spewing Bile, Diseased Pustules: its passive answers damage on it too (B48).
    if (isActive(target)) passiveAnswers(state, target, source, sets);
    useReaction(state, target, source, sets);
    damagedStrike(state, target, source, types);
}

// Furious Flailing, Splinter (B89): damage of its types, a Strike at a random creature in its reach (or the attacker when it's there);
// the trolls' flat check against their persistent fire damage too.
function damagedStrike(state, target, source, types) {
    const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("damaged-by") && typesMatch(entry.damageTypes, types));
    if (!answer || !isActive(target) || !canAct(target) || !canReact(target, answer.name) || target.cond.fleeing) return;
    // (B127, Furious Throw: a thrown rock at a random enemy within its first range increment — any foe on the field.)
    const foes = (answer.ranged ? state.list.filter((other) => other.side !== target.side && other.band !== "gone") : engagedEnemies(state, target)).filter(isActive);
    const victim = !answer.random && source && foes.includes(source) ? source : foes.length ? foes[state.rng.die(foes.length) - 1] : null;
    if (!victim) return;
    reactionStrikeAt(state, target, victim, answer, "damaged");
    // (The trolls' flat check against their persistent fire — Furious Throw's against persistent acid.)
    const kind = answer.persistentType ?? (answer.persistentFire ? "fire" : null);
    if (kind && isActive(target) && target.persistent?.some((entry) => entry.type === kind)) {
        const ends = flatCheck(state.rng, 15) >= SUCCESS;
        if (ends) target.persistent = target.persistent.filter((entry) => entry.type !== kind);
        log(state, `  ${target.name} ${kind === "fire" ? (ends ? "puts out its persistent fire" : "still burns") : ends ? `ends its persistent ${kind} damage` : `still takes persistent ${kind} damage`}`);
    }
}

// A spell or an action with a trait a creature's ability answers when it's targeted (B46: Otherworldly Mind's "Whenever a
// creature targets the hound with a mental effect, that creature takes 8d6 mental damage"; Entropic Feedback, a reaction):
// on the caster, after its effect. Not an area's, and not one answer setting off another.
export function targetedAnswers(state, caster, spell, targets) {
    if (state.answering) return;
    const traits = spell.plan?.traits ?? [];
    const isSpell = !["ability", "basic", "item"].includes(spell.kind) || /spells-srd/.test(spell.plan?.source?.uuid ?? "");
    const sets = (trigger) => trigger?.event === "targeted-by" && (trigger.traits?.some((trait) => traits.includes(trait)) || (trigger.spells && isSpell));
    state.answering = true;
    try {
        for (const target of targets) {
            if (target.side === caster.side || !isActive(target) || !isActive(caster)) continue;
            for (const [index, own] of (target.spells ?? []).entries()) {
                if (!own.plan?.trigger?.reaction && sets(own.plan?.trigger) && isActive(caster)) castSpell(state, target, index, [caster.id]);
            }
            if (isActive(caster)) useReaction(state, target, caster, sets);
            // Superconductor (B84): a spell or an attack (Trip, Grapple) aimed at it, a Strike back at the caster at any range.
            const answer = (isSpell || traits.includes("attack")) && (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("targeted"));
            if (answer && isActive(caster) && isActive(target) && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing) reactionStrikeAt(state, target, caster, answer, "targeted");
        }
    } finally {
        state.answering = false;
    }
}

const PHYSICAL_TYPES = new Set(["bludgeoning", "piercing", "slashing"]);
const typesMatch = (wanted, types) => !wanted?.length || types.some((type) => wanted.includes(type) || (wanted.includes("physical") && PHYSICAL_TYPES.has(type)));

// other: the creature that set it off (the attacker, the creature its Strike hit, the creature starting its turn), or null.
// A free action with a trigger (trigger.free) doesn't need or use the reaction.
function useReaction(state, c, other, matches) {
    if (!isActive(c) || !canAct(c)) return;
    for (const [index, spell] of (c.spells ?? []).entries()) {
        const trigger = spell.plan?.trigger;
        if (!trigger?.reaction || !matches(trigger) || (!trigger.free && !canReact(c, spell.name))) continue;
        if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0) || !poolReady(c, spell)) continue;
        const targets = answerTargets(state, c, spell.plan, other);
        // (A foe among them; or, B106, itself or its allies for an effect that helps them.)
        // (B305: or one on itself — Melt Time's quickening as it's slowed.)
        if (!targets.some((target) => target.side !== c.side) && !((allyEffect(spell.plan) || effectFor(spell.plan, "self") || spell.plan?.targeting?.target === "self") && targets.length)) continue;
        if (!trigger.free) spendReaction(c, spell.name);
        state.stats.reactions++;
        log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name}`);
        castSpell(state, c, index, targets.map((target) => target.id));
        return true;
    }
    return false;
}

// Its reaction to downing a creature (B79: You're Next's "Trigger The prisoner reduces a creature to 0 hit points Effect … Demoralize a
// single creature it can see"): at another foe, one in its Melee first, then one nearby.
export function downsAnswers(state, c, downed) {
    if (!canAct(c)) return;
    for (const [index, spell] of (c.spells ?? []).entries()) {
        const trigger = spell.plan?.trigger;
        if (!trigger?.reaction || trigger.event !== "downs" || (!trigger.free && !canReact(c, spell.name))) continue;
        // (B140, Absorb Sin: Hit Points back on itself, when it's hurt.)
        if (spell.plan?.targeting?.target === "self") {
            if (c.hp.value >= c.hp.max) continue;
            if (!trigger.free) spendReaction(c, spell.name);
            state.stats.reactions++;
            log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name}`);
            castSpell(state, c, index, [c.id]);
            return;
        }
        const foes = state.list.filter((other) => other.side !== c.side && other !== downed && isActive(other) && !c.immuneTargets?.get(spell)?.has(other.id));
        const target = foes.find((other) => sameMelee(c, other)) ?? foes.find((other) => other.band !== "far") ?? null;
        if (!target) return;
        if (!trigger.free) spendReaction(c, spell.name);
        state.stats.reactions++;
        log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name}`);
        castSpell(state, c, index, [target.id]);
        return;
    }
}

// A creature losing a condition near a monster (B76: Consume Fear's "A creature within 60 feet loses the Frightened condition"): the
// monster's reaction, on itself (the temporary Hit Points it gains). Within its distance: its Melee for 10 feet or less, the bands
// for more, anyone in the fight from 60 feet.
export function conditionLostAnswers(state, creature, slug) {
    const near = (c, within) => !within || within >= 60 || (within <= 10 ? sameMelee(c, creature) : creature.band !== "far" || c.band === "far");
    for (const c of state.list) {
        if (c === creature || !isActive(c) || !canAct(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (!trigger?.reaction || trigger.event !== "condition-lost" || trigger.condition !== slug || (!trigger.free && !canReact(c, spell.name)) || !near(c, trigger.within)) continue;
            if (!trigger.free) spendReaction(c, spell.name);
            state.stats.reactions++;
            log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name} (${creature.name} is no longer ${slug})`);
            castSpell(state, c, index, [c.id]);
            break;
        }
    }
}

// A creature it holds trying to Escape (B105: Tighten Coils' "A creature Grabbed or Restrained by the zinba attempts to Escape … The DC of
// the Escape check is increased by 2"): its reaction, the DC higher for this check.
function guardEscape(state, escaper, grabber) {
    const guard = grabber.escapeGuard;
    if (!guard || escaper.grabbedBy !== grabber.id || !isActive(grabber) || !canAct(grabber) || !canReact(grabber, guard.name) || grabber.cond.fleeing) return;
    spendReaction(grabber, guard.name);
    state.stats.reactions++;
    grabber.escapeGuardActive = guard.value;
    log(state, `  ${grabber.name} uses ${guard.name}: the Escape DC is ${guard.value} higher`);
}

// A creature it holds trying to Escape (B136, Punish Flight's "A creature attempts to Escape from the hatred siktempora"): its Strike at
// that creature first, whatever the Escape's result.
function escapeAttempted(state, escaper, grabber) {
    if (!isActive(grabber) || !isActive(escaper) || !canAct(grabber) || !canReact(grabber, "*") || grabber.cond.fleeing) return;
    const answer = (grabber.reactionStrikes ?? []).find((entry) => entry.triggers.includes("escape"));
    if (answer) reactionStrikeAt(state, grabber, escaper, answer, "escape");
}

// A creature it holds failing to Escape (B92: Savage's "A creature Grabbed by the wyvern critically fails a skill check to Escape … a
// stinger Strike against the triggering creature", Gnashing Bite's "fails a check to Escape … The lizard's jaws deal 1d6 piercing and
// 1d6 acid damage to the triggering creature"): its reaction at that creature.
export function escapeAnswers(state, escaper, grabber, degree) {
    if (!isActive(grabber) || !isActive(escaper) || !canAct(grabber)) return;
    // (B129, Snagging Spines: a creature it held getting free, a Strike at it.)
    if (["success", "criticalSuccess"].includes(degree)) {
        const answer = (grabber.reactionStrikes ?? []).find((entry) => entry.triggers.includes("escaped"));
        if (answer && canReact(grabber, answer.name) && !grabber.cond.fleeing) reactionStrikeAt(state, grabber, escaper, answer, "escape");
        // (B225, Serrated Teeth: its damage on the creature getting free.)
        else if (!grabber.cond.fleeing) useReaction(state, grabber, escaper, (trigger) => trigger.event === "escaped");
        return;
    }
    if (!["failure", "criticalFailure"].includes(degree)) return;
    const critical = degree === "criticalFailure";
    const answer = (grabber.reactionStrikes ?? []).find((entry) => entry.triggers.includes("escape-failed") || (critical && entry.triggers.includes("escape-critical-failure")));
    if (answer && canReact(grabber, answer.name) && !grabber.cond.fleeing) {
        reactionStrikeAt(state, grabber, escaper, answer, "escape");
        return;
    }
    useReaction(state, grabber, escaper, (trigger) => trigger.event === "escape-failed" && (!trigger.critical || critical));
}

// A foe's mishap near a monster (B85: Jeer at Failure's "A foe within 90 feet becomes Prone or critically fails on a Strike"): the
// monster's reaction at it (PF2e's Demoralize). Within its distance and its action's range (30 feet): the bands, as above.
// (B252: target — the creature the critically failed Strike was at, for a trigger on itself only, onSelf; none for a fall.)
export function mishapAnswers(state, creature, target = null) {
    if (!isActive(creature)) return;
    for (const c of state.list) {
        if (c.side === creature.side || !isActive(c) || !canAct(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (!trigger?.reaction || trigger.event !== "foe-mishap" || (!trigger.free && !canReact(c, spell.name)) || c.immuneTargets?.get(spell)?.has(creature.id)) continue;
            if (trigger.onSelf && target !== c) continue;
            const within = Math.min(trigger.within ?? Infinity, Number.parseInt(spell.plan?.targeting?.range, 10) || Infinity);
            if (within <= 10 ? !sameMelee(c, creature) : within < 60 && creature.band === "far" && c.band !== "far") continue;
            if (!trigger.free) spendReaction(c, spell.name);
            state.stats.reactions++;
            log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name} (${creature.name}'s mishap)`);
            castSpell(state, c, index, [creature.id]);
            break;
        }
    }
}

// Reactive Strike's triggers, with results of their own (B51: "A creature within the razorbones' reach uses a manipulate action
// or a move action or leaves a square during a move action"; "A creature within 100 feet makes a ranged attack or uses an action
// that has the concentrate trait"): kind "move" (leaving its Melee), "manipulate", "ranged" or "concentrate", within its
// distance (its reach or 10 feet or less: its Melee; more: the bands). True when it reacted.
// (B265, Elegy of the Faithless: kind "cast", a spell cast near it — of its tradition, when it names one and the spell has one.)
export function provokedReaction(state, c, mover, kind, { tradition = null } = {}) {
    const near = (within) => (within === "reach" || Number(within) <= 10 ? sameMelee(c, mover) : Number(within) >= 60 || mover.band !== "far" || c.band === "far");
    // (B136, Kneecapper: "A Medium creature …" — only a mover of that size.)
    const sized = (sizes) => !sizes?.length || sizes.some((size) => sizeRank(size) === sizeRank(mover.size));
    return useReaction(state, c, mover, (trigger) => trigger.event === "provoke" && (trigger.triggers ?? []).some((each) => each === kind || (kind === "move" && each === "leave")) && near(trigger.within) && sized(trigger.sizes) && (!trigger.tradition || !tradition || trigger.tradition === tradition));
}

// More triggers (B47): its own Strike that hits or critically hits (Pin Prey, Storm Smite, Go For the Eyes); a Strike at it,
// before the roll (Hypnotic Tattoos, Venom Spit); a creature starting its turn near it (Petrifying Glance); the fight starting
// (Chilling Cry's "rolls initiative").
// (B97: a target with a condition, "hits a Slowed creature", off-guard as the attack found it — flanked too; "on its turn".)
export function reactToOwnHit(state, attacker, target, strike, degree, { offGuard = null } = {}) {
    const name = String(strike.name ?? "").toLowerCase();
    // (A passive's kind of weapon, B48: "with a firearm", "with an unarmed attack", "a brawling weapon", "its melee Strikes".)
    const weapon = (kind) => !kind || (kind === "firearm" ? Boolean(strike.firearm) || /\b(?:pistol|musket|rifle|arquebus|blunderbuss|pepperbox|firearm|gun)\b/.test(name)
        : kind === "unarmed" ? Boolean(strike.unarmed) : kind === "brawling" ? Boolean(strike.unarmed) || /\b(?:fist|gauntlet|knuckles?|cestus)\b/.test(name) : kind === "melee" ? Boolean(strike.melee) : true);
    const sets = (trigger) => trigger.event === "own-strike" && (trigger.on ?? []).includes(DEGREE_NAMES[degree]) && weapon(trigger.weapon)
        && (!trigger.strike || name.includes(trigger.strike) || trigger.strike.includes(name)) && (!trigger.maxSize || sizeRank(target.size) <= sizeRank(trigger.maxSize))
        && (!trigger.condition || (trigger.condition === "off-guard" ? offGuard ?? isOffGuard(target) : Boolean(target.cond[FLAGS[trigger.condition] ?? trigger.condition])))
        && (!trigger.ownTurn || state.acting === attacker.id);
    // Firearms Critical Specialization, Painful Strikes: its passives (B48).
    if (isActive(target)) passiveAnswers(state, attacker, target, sets);
    useReaction(state, attacker, target, sets);
}

export function reactToAttack(state, target, attacker, strike) {
    useReaction(state, target, attacker, (trigger) => trigger.event === "attacked" && (!trigger.melee || strike.melee) && (!trigger.within || trigger.within > 10 || sameMelee(target, attacker)));
}

export function turnStartReactions(state, c) {
    const living = !(c.traits ?? []).some((trait) => trait === "undead" || trait === "construct");
    for (const other of state.list) {
        if (other.side === c.side) continue;
        useReaction(state, other, c, (trigger) => trigger.event === "turn-start" && (!trigger.living || living) && (trigger.within <= 10 ? sameMelee(other, c) : trigger.within >= 60 || c.band !== "far" || other.band === "far"));
    }
}

// A passive on a creature it holds as a turn starts or ends (B49: "A creature that starts its turn grabbed by the baatamidar
// must attempt a Will save", one at the end of the monster's own turn on every creature it has grabbed): the held
// creature's turn (its holder's passive), or the monster's own (on each creature it holds). Grabbed means grabbed or
// restrained by it and not swallowed; swallowed, inside it.
export function grabTurnAnswers(state, c, at) {
    const living = (other) => !(other.traits ?? []).some((trait) => trait === "undead" || trait === "construct");
    const holds = (trigger, held, holder) => (trigger.hold === "swallowed" ? held.swallowedBy === holder.id : held.grabbedBy === holder.id && !held.swallowedBy && Boolean(held.cond.grabbed || held.cond.restrained));
    const sets = (whose, held, holder) => (trigger) => trigger.event === "grab-turn" && trigger.at === at && trigger.whose === whose && holds(trigger, held, holder) && (!trigger.living || living(held));
    const holder = state.byId.get(c.swallowedBy ?? c.grabbedBy ?? "");
    if (holder && isActive(holder) && isActive(c)) passiveAnswers(state, holder, c, sets("held", c, holder));
    if (!isActive(c)) return;
    for (const held of state.list.filter((other) => other !== c && isActive(other) && (other.grabbedBy === c.id || other.swallowedBy === c.id))) passiveAnswers(state, c, held, sets("own", held, c));
}

// A free action as its own turn begins (Shrieking Frenzy, Sudden Surge; B53): used when ready (its uses a day, its recharge).
export function ownTurnStart(state, c) {
    for (const [index, spell] of (c.spells ?? []).entries()) {
        if (spell.plan?.trigger?.event !== "own-turn-start" || !canAct(c)) continue;
        if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0) || !poolReady(c, spell)) continue;
        // (B100: one creature, Stern Glare's Demoralize: its nearest foe; none, not used.)
        const foe = spell.plan.targeting?.target === "1 creature" && !spell.plan.targeting?.area ? nearestFoe(state, c, spell.plan) : null;
        if (spell.plan.targeting?.target === "1 creature" && !spell.plan.targeting?.area && !foe) continue;
        log(state, `  ${c.name} uses ${spell.name}`);
        castSpell(state, c, index, [foe?.id ?? c.id]);
    }
}

export function initiativeReactions(state) {
    for (const c of state.list) useReaction(state, c, null, (trigger) => trigger.event === "initiative");
}

// --- Planning ----------------------------------------------------------------

// A spell live play leaves to PF2e's card with no combat numbers in its data
// (Light, Read Aura): nothing for the simulation to cast.
export function castsNothing(plan) {
    if (plan?.resolution?.kind !== "unsupported") return false;
    const native = nativeOf(plan);
    return !(native.check || native.missiles || healingOf(plan) || mechanicalVariants(plan).length || (native.applications ?? []).length);
}

// A spell with no combat numbers that doesn't apply a PF2e spell effect either
// (Light, Read Aura, Detect Magic): utility. Bless refers to its effect, so it's
// a real gap rather than utility.
export function isUtility(plan) {
    const kind = plan?.resolution?.kind;
    if (kind === "spell-note" || kind === "message") return true;
    return castsNothing(plan) && !/Compendium\.pf2e\.spell-effects\.Item\./.test(JSON.stringify(plan));
}

// Who a spell can affect (B317; found checking the Grim Reaper's death effects for the user): the spell module's targeting.actorConstraints
// — "Each living creature of 17th level or lower in the line" (Massacre), enemies only, a trait, a size, a condition. A reason when the target
// is outside them, else null; a kind the simulation can't judge (the GM's call) lets it through. Before, Massacre killed level-20 PCs outright.
const LEVEL_KEYS = (byRank, rank) => Object.keys(byRank ?? {}).map(Number).filter((key) => key <= rank).sort((a, b) => b - a)[0];
export function outsideTargets(caster, target, spell) {
    const predicates = spell?.plan?.targeting?.actorConstraints?.predicates;
    if (!predicates?.length || !target) return null;
    const traits = target.traits ?? [];
    const construct = traits.includes("construct");
    for (const predicate of predicates) {
        switch (predicate.kind) {
            case "living-creature":
                if (isUndead(target) || construct) return "not living";
                break;
            case "living-or-undead":
                if (construct) return "not living or undead";
                break;
            case "undead-or-void-healing":
                if (!isUndead(target)) return "not undead";
                break;
            case "not-undead-or-void-healing":
                if (isUndead(target)) return "undead";
                break;
            case "enemy-of-caster":
            case "non-ally-of-caster":
                if (target.side === caster.side) return "not an enemy";
                break;
            case "not-caster":
                if (target === caster) return "the caster";
                break;
            case "trait":
                if (traits.includes(predicate.slug) !== (predicate.present !== false)) return predicate.present === false ? `${predicate.slug}` : `not ${predicate.slug}`;
                break;
            case "size-at-most":
                if (sizeRank(target.size) > sizeRank(predicate.size)) return "too big";
                break;
            case "level-at-most": {
                const key = LEVEL_KEYS(predicate.byRank, spell.castRank ?? 0);
                const level = key !== undefined ? predicate.byRank[key] : predicate.level;
                if ((target.level ?? 0) > level) return `above level ${level}`;
                break;
            }
            case "level-at-most-caster":
                if ((target.level ?? 0) > (caster.level ?? 0) + (Number(predicate.offset) || 0)) return "too high a level";
                break;
            case "condition":
                if (predicate.slug === "dying" ? target.status !== DOWN : !(target.cond?.[FLAGS[predicate.slug] ?? predicate.slug])) return `not ${predicate.slug}`;
                break;
            case "hp-zero":
                if ((target.hp?.value ?? 1) > 0) return "not at 0 Hit Points";
                break;
            case "persistent-damage":
                if (!(target.persistent ?? []).some((entry) => !predicate.damageType || entry.type === predicate.damageType)) return `no persistent ${predicate.damageType ?? "damage"}`;
                break;
            case "land-speed-above-caster":
                if ((target.speed ?? 25) <= (caster.speed ?? 25)) return "not faster";
                break;
            case "not-immune-damage":
                if ((target.immunities ?? []).includes(predicate.damageType)) return `immune to ${predicate.damageType}`;
                break;
            default:
                break;
        }
    }
    return null;
}

// Constant spells (B315): "Haste (Constant)" is always on. As the fight starts, each one the creature can aim at itself without a check
// takes effect on it for good; none is cast during the fight. (Before, a creature spent two actions casting its constant Haste.)
// ("Foresight (Constant) (Self Only)" too.)
export const isConstant = (spell) => /\(Constant\)/i.test(String(spell?.name ?? ""));
export function applyConstantSpells(state) {
    for (const c of state.list) {
        if (!isActive(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            if (!isConstant(spell) || !registry.familyFor(spell.plan?.resolution?.kind) || castsNothing(spell.plan)) continue;
            if (planDamages(spell.plan) || spell.plan?.resolution?.check?.roll || describeSpell(spell.plan).area) continue;
            const timers = new Set(c.timers ?? []);
            castSpell(state, c, index, [c.id]);
            // For good: none of the timers this cast set.
            c.timers = (c.timers ?? []).filter((timer) => timers.has(timer));
        }
    }
}

// The traits an action has (2026-10-15, the concentrate trait): its own, its plan's and its activation's — an item's "Activate (concentrate)",
// a spell's casting traits.
export function actionTraits(entry) {
    return [...new Set([...(entry?.traits ?? []), ...(entry?.plan?.traits ?? []), ...(entry?.plan?.activation?.traits ?? [])])];
}

// Whether a creature may use an action of these traits now: not a concentrate one while raging (unless it has the rage trait) or
// fascinated.
export function traitsAllowed(c, traits, { raging = false } = {}) {
    if (!traits.includes("concentrate")) return true;
    if (c.cond?.fascinated) return false;
    return !(raging && !traits.includes("rage"));
}

export function canCast(c, spell) {
    if (!castableAtAll(spell)) return false;
    // (L5: a coven spell, only with its coven beside it.)
    if (spell.coven && !c.covenReady) return false;
    // Recharging (a breath weapon used a round ago).
    if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0)) return false;
    // (B256: not a zone it already has up; nor a lingering spell's area.)
    if ((spell.zone || spell.plan?.resolution?.lingering) && c.activeZones?.has(spell.name)) return false;
    // (S22: a failed trick locks the item this turn; a critically failed one, all fight.)
    if (spell.trick && (c.itemsLocked?.has(spell.item) || c.usedThisTurn?.has(`trick:${spell.item}`))) return false;
    // (Crisis of Faith: its divine spells locked.)
    if (c.spellLocks?.length && spellLocked(c, spell)) return false;
    // (A witch's hexes: one a turn.)
    if (c.usedThisTurn?.has("hex") && isHex(spell)) return false;
    // (S59, Sure Strike: "can't cast it again for 10 minutes" — once a fight.)
    if (c.castImmune?.size && c.castImmune.has(castImmunityKey(spell))) return false;
    return poolReady(c, spell);
}

// S22, scrolls, wands and staves (the user: "can we get the simulator to treat scrolls, wands and staffs as spells the creature
// can cast?"). What a cast takes from its pool: one use, or for a staff its rank in charges (poolCost).
export function poolCost(spell) {
    return spell.poolCost ?? 1;
}

// Enough left in its pool. A wand's overcharge (spell.overcharge, the wand's own pool): only once the wand's cast for the day
// is spent, and only while the fight goes badly for the creature's side (c.desperate, set as its turn starts).
export function poolReady(c, spell) {
    if (spell.overcharge && (!c.desperate || (c.spellPools?.[spell.overcharge] ?? 0) > 0)) return false;
    return !spell.pool || (c.spellPools?.[spell.pool] ?? 0) >= poolCost(spell);
}

export function spendPool(c, spell) {
    if (spell.pool) c.spellPools[spell.pool] = Math.max(0, (c.spellPools[spell.pool] ?? 0) - poolCost(spell));
}

// Trick Magic Item (S22): the chance its skill check succeeds.
export function trickChance(trick) {
    const [, , success, critical] = degreeDistribution(trick.modifier, trick.dc);
    return success + critical;
}

// What about casting a spell never changes in a fight, read once per spell: not a constant one, a family the core
// resolves, something it does, and a way to aim it.
const CASTABLE = new WeakMap();
function castableAtAll(spell) {
    let castable = CASTABLE.get(spell);
    if (castable === undefined) {
        castable = !isConstant(spell) && Boolean(registry.familyFor(spell.plan?.resolution?.kind)) && !castsNothing(spell.plan) && spellVariants(spell).some((actions) => {
            const info = describeSpell(spell.plan, actions);
            return Boolean(info.area || info.targets || info.self);
        });
        CASTABLE.set(spell, castable);
    }
    return castable;
}

// How much a condition is worth, as a share of one round of the target's threat.
// Its worst condition, by what it costs it (Remove a Condition, B72): { slug, worth } or null.
const REMOVABLE = ["stunned", "paralyzed", "confused", "fleeing", "restrained", "grabbed", "immobilized", "slowed", "blinded", "frightened", "sickened", "clumsy", "enfeebled", "stupefied", "drained", "dazzled", "prone", "off-guard"];
export function worstCondition(c) {
    let worst = null;
    for (const slug of REMOVABLE) {
        const flag = FLAGS[slug];
        const has = flag ? c.cond?.[flag] : (c.cond?.[slug] ?? 0) > 0;
        if (!has) continue;
        const worth = conditionWorth(slug, flag ? null : c.cond[slug], null);
        if (!worst || worth > worst.worth) worst = { slug, worth };
    }
    return worst;
}

export function conditionWorth(slug, value, duration) {
    const rounds = Math.min(3, durationRounds(duration));
    const n = Number.isFinite(value) ? value : 1;
    switch (slug) {
        case "stunned":
            return Math.min(n, 3) / 3;
        case "slowed":
            return (Math.min(n, 3) / 3) * (rounds === Infinity ? 3 : rounds) * 0.6;
        case "fleeing":
            return 0.8 * Math.min(rounds === Infinity ? 3 : rounds, 2);
        case "frightened":
            return 0.06 * n * (n + 1) / 2;
        case "sickened":
        case "clumsy":
        case "enfeebled":
        case "drained":
            return 0.08 * n * 2;
        case "prone":
            return 0.15;
        case "paralyzed":
            return rounds === Infinity ? 3 : rounds;
        // It loses its turns to random attacks, which may hit its allies.
        case "confused":
            return 0.8 * (rounds === Infinity ? 2 : rounds);
        case "unconscious":
            // Asleep until damaged: worth less than paralysis.
            return 0.7 * (rounds === Infinity ? 3 : rounds);
        case "restrained":
            return 0.7 * (rounds === Infinity ? 3 : rounds);
        case "blinded":
            return 0.4 * (rounds === Infinity ? 3 : rounds);
        case "grabbed":
        case "immobilized":
            return 0.2 * (rounds === Infinity ? 3 : rounds);
        case "dazzled":
            return 0.15 * (rounds === Infinity ? 3 : rounds);
        case "stupefied":
            return 0.05 * n * 2;
        case "fatigued":
            return 0.1;
        case "dying":
            return 1.5 * n;
        case "off-guard":
            return 0.1 * Math.min(rounds === Infinity ? 3 : rounds, 3);
        // Good for whoever has them (B53): negative, so on itself or an ally they count for it.
        case "quickened":
            return -0.3 * Math.min(rounds === Infinity ? 3 : Math.max(1, rounds), 3);
        case "concealed":
            return -0.15 * Math.min(rounds === Infinity ? 3 : Math.max(1, rounds), 3);
        case "hidden":
        case "invisible":
            return -0.35 * Math.min(rounds === Infinity ? 3 : Math.max(1, rounds), 3);
        // (Fascinated ends with any hostility to it or its allies; deafened costs an auditory action now and then.)
        case "fascinated":
            return 0.1 * Math.min(rounds === Infinity ? 2 : Math.max(1, rounds), 2);
        // (Its threat gone from its side and on the controller's: more than paralysis.)
        case "controlled":
            return 1.6 * Math.min(rounds === Infinity ? 3 : Math.max(1, rounds), 3);
        case "deafened":
            return 0.03 * Math.min(rounds === Infinity ? 3 : Math.max(1, rounds), 3);
        default:
            return 0;
    }
}

// Expected effect of a cast on each target: [{ target, damage, worth }]:
// damage in HP after resistances, worth in rounds of the target's threat.
// The odds of each degree for one target, from the same numbers the core's
// resolver rolls with (pre-roll questions at their defaults).
const CERTAIN = Object.freeze([1, 0, 0, 0]);
const GIVEN_HIT = Object.freeze([0, 0, 0.8, 0.2]);

function oddsFor(caster, spell, target, attacks, actions) {
    const check = describeSpell(spell.plan, actions).check;
    // No check (healing, Force Barrage), or none rolled ("The target takes 3d8 fire damage"): the outcome doesn't depend on a degree.
    if (!check || check.roll === "automatic") return CERTAIN;
    // A rider by its Strike's degree (B66): given the hit (its chance counted apart), mostly a hit, sometimes a critical hit.
    if (check.statistic === "strike" && check.roll === "skill") return GIVEN_HIT;
    const penalty = statusPenalty(caster, "spell");
    if (check.roll === "attack") {
        const map = attacks <= 0 ? 0 : attacks === 1 ? 5 : 10;
        const base = check.statistic === "strike" ? Math.max(0, ...(caster.strikes ?? []).map((strike) => strike.bonus)) : (spell.attack ?? 0) + effectBonus(caster, "spell");
        return degreeDistribution(base + effectBonus(caster, "attack") - penalty - map, armorClass(target));
    }
    if (check.roll === "skill" || check.roll === "perception") {
        const map = describeSpell(spell.plan, actions).attack ? (attacks <= 0 ? 0 : attacks === 1 ? 5 : 10) : 0;
        // (Its own bonus, "a +4 status bonus to the Athletics check", B68.)
        // (A fixed modifier of its own, a special attack's, B128: that.)
        const roll = (Number.isFinite(check.modifier) ? check.modifier : Math.max(...[].concat(check.statistic).map((slug) => skillValue(caster, slug)))) + (Number(check.bonus?.value) || 0) - statusPenalty(caster, "skill") - map;
        // (B105: an Escape from one that can still make it harder.)
        const guarded = describeSpell(spell.plan, actions).escape && target.escapeGuard && canReact(target) && !target.cond.fleeing ? target.escapeGuard.value : 0;
        const dc = (check.against?.dc === "fixed" ? check.against.value : escapeDCAgainst(caster, target, spell, actions) ?? defenceDC(target, check.against?.statistic ?? "will") - disarmBonus(spell, target)) + guarded;
        return degreeDistribution(roll, dc);
    }
    const slugs = check.saveChoice?.statistics?.length ? check.saveChoice.statistics : [check.statistic];
    const slug = slugs.reduce((best, entry) => (saveModifier(target, entry) + saveBonusAgainst(target, entry, spell) > saveModifier(target, best) + saveBonusAgainst(target, best, spell) ? entry : best));
    const save = saveModifier(target, slug) + saveBonusAgainst(target, slug, spell);
    const dc = check.against?.dc === "fixed" ? check.against.value : (spell.dc ?? 10) - penalty + effectBonus(caster, "spell");
    // (B302: its Evasion and the like.)
    return adjustedSaveOdds(target, slug, degreeDistribution(save, dc), spell);
}

// The changes a spell has on one target at each degree, with average damage.
// They don't change during a fight, or from one fight of a snapshot to the next, so each pair is resolved once (fight.js
// gives the fights of a snapshot one cache).
function outcomesFor(state, caster, spell, target, actions) {
    state.spellOutcomes ??= new WeakMap();
    let byTarget = state.spellOutcomes.get(spell);
    if (!byTarget) {
        byTarget = new Map();
        state.spellOutcomes.set(spell, byTarget);
    }
    // (B313: by caster too — creatures sharing one action, a party's Disarm, each name themselves in "you become off-guard". Before, the
    // first caster's id was kept, and the others counted their own critical failure as a condition on their target.)
    const key = `${caster.id}|${target.id}|${actions ?? 0}`;
    let outcomes = byTarget.get(key);
    if (outcomes === undefined) {
        const context = simContext(state, caster, spell, [target], 0, actions);
        try {
            const choose = chooser(caster, [target]);
            outcomes = DEGREE_NAMES.map((degree) => registry.resolveSync(spell.plan, context, { roll: () => ({ degree }), choose }).changes.filter((change) => change.target === target.id || change.target === caster.id));
        } catch {
            outcomes = null;
        }
        byTarget.set(key, outcomes);
    }
    return outcomes;
}

// The chance a roll of `dice` dice of `die` faces, added, lands on one of these totals (B263: 2d6 tables; one die, faces / die).
function faceShare(faces, die, dice = 1) {
    let counts = new Map([[0, 1]]);
    for (let count = 0; count < dice; count++) {
        const next = new Map();
        for (const [total, ways] of counts) for (let face = 1; face <= die; face++) next.set(total + face, (next.get(total + face) ?? 0) + ways);
        counts = next;
    }
    const all = die ** dice;
    return faces.reduce((sum, face) => sum + (counts.get(face) ?? 0), 0) / all;
}

// Expected effect of a cast on each target: [{ target, damage, worth, heal, benefit }]:
// damage and healing in HP (after resistances; healing up to the HP missing),
// worth (harm from conditions) and benefit (from a PF2e spell effect, negative
// for a hindrance) in rounds of the target's threat.
export function spellExpectation(state, caster, spell, targets, attacks = caster.attacksThisTurn ?? 0, actions = undefined) {
    // A random effect table (B255): each way's expectation, weighted by its share of the die's faces (a way on itself, on itself).
    if (spell.randomWays?.length) {
        const merged = new Map();
        for (const way of spell.randomWays) {
            if (!way.plan?.resolution) continue;
            const share = faceShare(way.faces, spell.die || 1, Number(spell.dice) || 1);
            const at = way.plan.targeting?.target === "self" ? [caster] : targets;
            for (const entry of spellExpectation(state, caster, { ...spell, randomWays: null, plan: way.plan }, at, attacks, actions)) {
                const sum = merged.get(entry.target) ?? { target: entry.target, damage: 0, worth: 0, heal: 0, benefit: 0 };
                for (const key of ["damage", "worth", "heal", "benefit"]) sum[key] += share * (entry[key] ?? 0);
                merged.set(entry.target, sum);
            }
        }
        return [...merged.values()];
    }
    const stupefied = isSpellCast(spell) ? (caster.cond.stupefied ?? 0) : 0;
    const casts = stupefied ? Math.max(0, 16 - stupefied) / 20 : 1;
    const finds = casts * (describeSpell(spell.plan, actions).area ? 1 : targetingChance(caster));
    const result = [];
    // What happens to the caster itself (Trip's critical failure, Escape's success).
    let self = null;
    let damageContext = null;
    // (S55, a chain: each target counts as far as the chain reaches it — no critical success before it.)
    const chain = spell.plan?.resolution?.chain;
    let reach = 1;
    for (const target of targets) {
        const entry = { target, damage: 0, worth: 0, heal: 0, benefit: 0 };
        // (U10: an item's own counteract — the chance it ends each thing it names on the creature, times what that thing costs it.)
        if (spell.counteract) entry.benefit += itemCounteractWorth(state, spell, target);
        // (U12: its persistent damage recovery — the damage it saves the creature, as damage not taken: its share of the creature's Hit
        // Points, however hurt it is already.)
        if (spell.recovery) entry.damage -= itemRecoveryWorth(spell, target);
        result.push(entry);
        // (I1: nothing on a creature immune to it; T7: nor a non-damaging one aimed at one creature on a troop.)
        if (effectImmunity(target, spell) || outsideTargets(caster, target, spell)) continue;
        if (troopIgnores(target, { damaging: planDamages(spell.plan), targets: describeSpell(spell.plan, actions).area ? Infinity : targets.length })) continue;
        // Golem Antimagic (B56): only what its list says.
        const golem = golemAnswer(caster, spell, target, Boolean(describeSpell(spell.plan, actions).area));
        if (golem) {
            const value = golemValue(target, golem);
            entry.damage += finds * value.damage;
            entry.worth += finds * value.worth;
            continue;
        }
        const outcomes = outcomesFor(state, caster, spell, target, actions);
        const odds = outcomes && oddsFor(caster, spell, target, attacks, actions);
        if (!odds) continue;
        const reached = reach;
        if (chain) reach *= 1 - (odds[DEGREE_NAMES.indexOf(chain.endsOn ?? "criticalSuccess")] ?? 0);
        for (const [degreeIndex, changes] of outcomes.entries()) {
            const chance = finds * reached * odds[degreeIndex];
            if (!chance) continue;
            for (let change of changes) {
                // (A value the text rolls, at its average.)
                if (change.op === "condition" && change.valueRoll && !Number.isFinite(change.value)) change = { ...change, value: averageRoll(change.valueRoll) };
                if (change.target === caster.id && target !== caster) {
                    self ??= { target: caster, damage: 0, worth: 0, heal: 0, benefit: 0 };
                    if (change.op === "condition") self.worth += chance * conditionWorth(change.slug, change.value, change.duration);
                    else if (change.op === "end") self.benefit += chance * (change.what?.conditions ?? []).reduce((sum, slug) => sum + (caster.cond[FLAGS[slug] ?? slug] ? conditionWorth(slug, null, null) : 0), 0);
                    continue;
                }
                if (change.op === "damage") {
                    damageContext ??= spellContext(spell, { isSpell: isSpellCast(spell), area: Boolean(describeSpell(spell.plan, actions).area) });
                    const expected = chance * adjustDamage(target, change.instances.map((instance) => ({ type: instance.type, amount: instance.amount, persistent: false, precision: instance.category === "precision", splash: instance.category === "splash", context: damageContext }))).total;
                    entry.damage += expected;
                    // (The vampiric spells: the caster's temporary Hit Points, a share of it — as healing that may go unused.)
                    const benefit = spell.plan?.resolution?.casterBenefit;
                    if (benefit?.kind === "temp-hp" && target.side !== caster.side) {
                        self ??= { target: caster, damage: 0, worth: 0, heal: 0, benefit: 0 };
                        self.heal += 0.7 * expected * (Number(benefit.fraction) || 0.5);
                    }
                } else if (change.op === "condition" && change.slug === "persistent-damage") {
                    if (!change.damage) continue;
                    entry.damage += chance * 2 * adjustInstance(target, change.damage.type, change.damage.amount);
                } else if (change.op === "condition" && change.scope) {
                    // Feint, Create a Diversion: the attacker's own attacks hit more often (+2): about a
                    // tenth of a hit's damage per attack (one for a single use, three otherwise).
                    if (change.scope.attacker === caster.id) entry.damage += chance * 0.1 * bestHit(caster, target, change.scope.attacks === "melee") * (change.scope.uses ?? 3);
                } else if (change.op === "condition") {
                    // (B303: Bravery's frightened 1 lower — none at all from frightened 1.)
                    const brave = change.slug === "frightened" && target.lessFrightened ? (change.value ?? 1) - target.lessFrightened : null;
                    if (brave !== null && brave <= 0) continue;
                    // (B313: only what it adds to a condition the target already has — nothing for Prone on a Prone creature, the step from
                    // frightened 1 to 2. Before, the party tripped a creature already on the ground.)
                    const flag = FLAGS[change.slug];
                    const held = flag ? (target.cond?.[flag] ? 1 : 0) : Number(target.cond?.[change.slug] ?? 0) || 0;
                    const full = conditionWorth(change.slug, brave ?? change.value, change.duration);
                    entry.worth += chance * (flag ? (held ? 0 : full) : Math.max(0, full - (held ? conditionWorth(change.slug, held, change.duration) : 0)));
                    // The party plays for morale (M23): fear may break the foe, which takes it out of the fight.
                    if (change.slug === "frightened" && caster.side === "party" && target.side !== caster.side && state.setup.situational?.playsForMorale) {
                        // Only a rise in frightened sets off a check (and only to the trigger's minimum value: M25).
                        const after = frightenedAfter(target, change.value ?? 1);
                        const odds = after > (target.cond.frightened ?? 0) ? moraleOdds(state, target, { trigger: "frightenedByEnemy", frightened: after }) : { breaks: 0, wavers: 0 };
                        entry.breaks = (entry.breaks ?? 0) + chance * (odds.breaks + 0.3 * odds.wavers);
                    }
                } else if (change.op === "affliction" && Array.isArray(change.data?.stages)) {
                    const value = afflictionValue(target, change.data);
                    entry.damage += chance * value.damage;
                    entry.worth += chance * value.worth;
                } else if (change.op === "effect" && change.effect?.kind === "swallow") {
                    // Out of the fight while inside, taking the damage at the end of each of its turns.
                    const rounds = swallowedRounds(target, caster, change.effect.escapeDC ?? null);
                    const perRound = parseDamage(change.effect.damage ?? "").reduce((sum, instance) => sum + adjustInstance(target, instance.type, averageOf(instance)), 0);
                    entry.damage += chance * perRound * rounds;
                    entry.worth += chance * 0.9 * rounds;
                } else if (change.op === "effect" && change.effect?.kind === "disarm") {
                    // Worth something only against a weapon in hand: a dropped one costs an action to pick up (about a third of a round).
                    // (B313: a weakened grip lasts until the start of the creature's turn, so it only hinders its reactions and helps the
                    // next Disarm — worth about half a frightened 1; and nothing when the grip is already weak. Before, it was worth more
                    // than a drop's half and the party Disarmed creatures with extreme AC again and again.)
                    const held = (target.strikes ?? []).filter((strike) => strike.held && strikeUsable(target, strike));
                    const weapon = held.length ? held.reduce((best, strike) => (strike.bonus > best.bonus ? strike : best)) : null;
                    if (weapon && (change.effect.what === "drop" || !target.weakGrip?.has(weapon.name))) entry.worth += chance * (change.effect.what === "drop" ? 0.3 : 0.03);
                } else if (change.op === "end" && change.what?.stabilize && target.status === DOWN) {
                    // First Aid: the chance it would otherwise die.
                    entry.benefit += chance * 3 * Math.min(1, ((target.cond.dying ?? 0) + 1) / (4 - (target.cond.doomed ?? 0)));
                } else if (change.op === "death" && change.ifReducedTo === undefined) {
                    entry.damage += chance * Math.max(1, target.hp.value + target.hp.temp);
                } else if (change.op === "heal") {
                    entry.heal += chance * Math.min(change.amount, Math.max(0, target.hp.max - Math.max(0, target.hp.value)));
                } else if (change.op === "tempHp") {
                    // Temporary Hit Points (B61): what they add over its current ones, as healing that may go unused.
                    entry.heal += chance * 0.7 * Math.max(0, change.amount - (target.hp.temp ?? 0));
                } else if (change.op === "effect" && change.effect?.kind === "true-sight") {
                    // (Worth something only against foes an Invisibility hides: about a third of a round of their threat a round, up to three.)
                    const hidden = state.list.filter((other) => other.side !== target.side && other.status === "active" && other.cond?.hidden && other.condSources?.invisible?.spell).length;
                    if (hidden && !target.trueSight) entry.benefit += chance * 0.3 * 3 * hidden;
                } else if (change.op === "effect" && change.effect?.kind === "attack-ward") {
                    if (target.side === caster.side) entry.benefit += chance * wardWorth(state, target, caster, change.effect.ward, effectDC(spell));
                } else if (change.op === "effect" && change.effect?.kind === "counteract") {
                    const best = bestCounter(state, caster, target, change.effect);
                    if (best) {
                        const share = counterChance(Number(spell.attack) || 0, counterRank(caster, spell, isSpellCast(spell)), best.pick) * best.value;
                        if (target.side === caster.side) entry.benefit += chance * share;
                        else entry.worth += chance * share;
                    }
                } else if (change.op === "effect" && change.effect?.kind === "affliction-stage") {
                    // (About a third of a round of the creature's threat a stage.)
                    if ((target.afflictions ?? []).some((held) => held.stage > (change.effect.floor ?? 1))) entry.benefit += chance * 0.3 * (change.effect.by ?? 1);
                } else if (change.op === "effect" && change.effect?.kind === "note" && noteState(change.effect.note)) {
                    entry.worth += chance * noteStateWorth(target, noteState(change.effect.note), change.effect.note.duration);
                } else if (change.op === "effect" && change.effect?.kind === "note" && pacifyOf(change.effect.note)) {
                    const held = pacifyOf(change.effect.note, { ...(spell.plan?.resolution?.outcomes?.[change.effect.degree] ?? {}), ...(spell.plan?.rowFlags?.[change.effect.degree] ?? {}) });
                    entry.worth += chance * pacifyWorth(state, target, caster, held, change.effect.note.duration);
                } else if (change.op === "effect" && ["native", "modifier", "note"].includes(change.effect?.kind)) {
                    const { model, key } = outcomeEffect(spell, change);
                    // (S54, Sure Strike on itself: worth it only with an action left for the attack — it ends with the turn.)
                    const unused = model?.fortune && target === caster && (caster.actionsLeft ?? 3) - (describeSpell(spell.plan, actions).actions ?? 1) < 1;
                    if (model && !unused) entry.benefit += chance * recastShare(state, target, model, key) * effectBenefit(model, target, conditionWorth, state.strikeShare?.get(target.id) ?? 1);
                }
            }
        }
    }
    if (self) result.push(self);
    return result;
}

// The sets of creatures a spell can be aimed at from a position, as
// { targets: [creature…] }. inMelee(other) and distance(other) describe the
// caster's (possibly hypothetical) position.
export function targetSets(state, caster, spell, { enemies, allies = [], inMelee, distance, meleeId }, actions = undefined) {
    const info = describeSpell(spell.plan, actions);
    // Administer First Aid: each dying ally (a downed PC lies in the near band).
    if (info.dying) return allies.filter((ally) => ally.status === DOWN && ally.kind === "pc" && (ally.cond.dying ?? 0) > 0).map((ally) => ({ targets: [ally] }));
    // Escape: from whoever is holding the creature.
    if (info.escape) {
        const grabber = caster.grabbedBy ? state.byId.get(caster.grabbedBy) : null;
        return grabber && isActive(grabber) && (caster.cond.grabbed || caster.cond.restrained) ? [{ targets: [grabber] }] : [];
    }
    // Swallow Whole: one creature it holds, small enough and with room inside.
    if (info.grabbedTargets && info.swallow) {
        return enemies.filter((enemy) => enemy.grabbedBy === caster.id && isActive(enemy) && swallowRoom(state, caster, info.swallow, enemy)).map((enemy) => ({ targets: [enemy] }));
    }
    // Trample: the enemies of the listed size or smaller in one Melee, or standing apart nearby.
    if (info.trample) {
        if (!canMove(caster)) return [];
        const fits = (enemy) => isActive(enemy) && enemy.side !== caster.side && sizeRank(enemy.size) <= sizeRank(info.trample.size);
        const sets = [];
        for (const members of state.melees.values()) {
            const group = [...members].map((id) => state.byId.get(id)).filter((other) => other && fits(other) && enemies.includes(other));
            if (group.length) sets.push({ targets: group });
        }
        const loose = enemies.filter((enemy) => fits(enemy) && enemy.meleeId === null && enemy.band !== "far");
        if (loose.length) sets.push({ targets: loose.slice(0, Math.max(1, Math.ceil(loose.length / 2))) });
        return sets;
    }
    // Its allies (B53: "All allies who hear or see him are Quickened for 1 round"): the active ones, within its emanation when
    // it has one (its Melee for 10 feet or less; more: the bands). Never its enemies.
    if (spell.plan?.targeting?.allies) {
        const radius = Number(spell.plan.targeting.area?.value) || 0;
        const near = allies.filter((ally) => ally !== caster && isActive(ally) && (!radius || radius >= 60 || (radius <= 10 ? sameMelee(caster, ally) : ally.band !== "far" || caster.band === "far")));
        return near.length ? [{ targets: near }] : [];
    }
    // Constrict: everyone the creature is holding.
    if (info.grabbedTargets) {
        const held = enemies.filter((enemy) => enemy.grabbedBy === caster.id && isActive(enemy));
        return held.length ? [{ targets: held }] : [];
    }
    // Stoke the Flames (B79): the foes within its distance taking persistent damage of that type.
    if (spell.plan?.targeting?.foes && spell.plan.targeting.taking) {
        const radius = Number(spell.plan.targeting.area?.value) || 0;
        const taking = enemies.filter((enemy) => isActive(enemy) && (enemy.persistent ?? []).some((entry) => entry.type === spell.plan.targeting.taking) && (radius >= 60 || inMelee(enemy) || enemy.band !== "far"));
        return taking.length ? [{ targets: taking }] : [];
    }
    // Not those already immune to it (Demoralize, a screech's "temporarily immune for 1 minute"), areas included.
    const immune = caster.immuneTargets?.get(spell);
    const notImmune = (other) => !immune?.has(other.id);
    if (immune?.size) enemies = enemies.filter(notImmune);
    // (B133: a move first, Tackle's — a creature within that many Strides too.)
    const reaches = (other) => other === caster || (info.touch ? inMelee(other) || (info.approach > 0 && canMove(caster) && distance(other) <= (info.approachFeet ?? (caster.speed ?? 25) * info.approach * (info.approachHalf ? 0.5 : 1))) : info.range === null || distance(other) <= info.range);
    // (U1: an item drunk — by the creature, or fed to an ally beside it; a healing one to a downed PC too, as First Aid reaches one.)
    if (spell.drinker && !info.area) {
        const friends = [caster, ...allies].filter((ally) => ally === caster || (ally.status === ACTIVE && inMelee(ally)) || (info.healing && ally.status === DOWN && ally.kind === "pc"));
        return (info.healing ? friends.filter((ally) => ally.hp.value < ally.hp.max) : friends).map((ally) => ({ targets: [ally] }));
    }
    if (!info.area) {
        const sets = [];
        // (A spell for a willing creature — Vapor Form — goes to no enemy.)
        const willing = /\bwilling\b/i.test(String(spell.plan?.targeting?.target ?? ""));
        const inRange = willing ? [] : enemies.filter((enemy) => enemy.status === "active" && reaches(enemy));
        if (inRange.length) {
            if (info.targets <= 1) sets.push(...inRange.map((enemy) => ({ targets: [enemy] })));
            // (S55, a chain: from each first target, on to the nearest foe within its feet of the last one — the bands' distances.)
            else if (spell.plan?.resolution?.chain) sets.push(...inRange.map((first) => ({ targets: chainFrom(first, inRange, Number(spell.plan.resolution.chain.feet) || 30) })));
            else sets.push({ targets: inRange.slice(0, info.targets) });
        }
        if (info.self) return [{ targets: [caster] }];
        // Spell effects: any ally in reach, the caster included.
        if (info.helpful) {
            const friends = [caster, ...allies].filter((ally) => ally.status === ACTIVE && reaches(ally));
            if (info.targets <= 1) sets.push(...friends.map((ally) => ({ targets: [ally] })));
            else if (friends.length) sets.push({ targets: friends.slice(0, info.targets) });
        }
        // Healing: hurt or downed allies (and the caster) in reach, the most hurt first.
        if (info.healing) {
            const hurt = [caster, ...allies]
                .filter((ally) => (ally.status === ACTIVE || (ally.status === DOWN && ally.kind === "pc")) && ally.hp.value < ally.hp.max && reaches(ally))
                .sort((a, b) => hpFraction(a) - hpFraction(b));
            if (info.targets <= 1) sets.push(...hurt.slice(0, 3).map((ally) => ({ targets: [ally] })));
            else if (hurt.length) sets.push({ targets: hurt.slice(0, info.targets) });
        }
        return sets;
    }
    const capacity = areaCapacity(info.area);
    const sets = [];
    // (Not those the spell can't affect — Wails of the Damned's "each living enemy": not the caster's allies, nor undead — so they don't
    // take the area's room or show among its targets.)
    const affected = (other) => !outsideTargets(caster, other, spell);
    const members = (id) => [...(state.melees.get(id) ?? [])].map((memberId) => state.byId.get(memberId)).filter((other) => other && isActive(other) && notImmune(other) && affected(other));
    if (info.area.type === "emanation" && info.range === null) {
        // Around the caster: whoever shares its Melee. From 30 feet, also those
        // standing apart in the near band (and, for healing, downed PCs there).
        // A buff from 10 feet (Bless) also reaches allies standing apart in the
        // caster's band: a support caster keeps close to its side.
        const around = meleeId !== null && meleeId !== undefined ? members(meleeId).filter((other) => other !== caster) : [];
        const band = caster.band === "engaged" ? "near" : caster.band;
        const apart = (other) => other !== caster && !around.includes(other) && other.meleeId === null;
        if (info.area.value >= 30) {
            const reached = (other) => isActive(other) || (info.healing && other.status === DOWN && other.kind === "pc");
            around.push(...state.list.filter((other) => apart(other) && other.band === "near" && reached(other) && notImmune(other)));
        } else if (info.helpful && info.area.value >= 10) {
            around.push(...state.list.filter((other) => apart(other) && other.side === caster.side && other.band === band && isActive(other)));
        }
        if (info.healing || info.helpful) around.push(caster);
        // (B229: foes only.)
        if (info.area.foes) around.splice(0, around.length, ...around.filter((other) => other.side !== caster.side));
        around.splice(0, around.length, ...around.filter(affected));
        const helps = (info.healing && around.some((other) => other.side === caster.side && other.hp.value < other.hp.max)) || (info.helpful && around.some((other) => other.side === caster.side));
        if (helps || around.some((other) => other.side !== caster.side)) sets.push({ targets: around.slice(0, capacity) });
        return sets;
    }
    // Into a Melee: everyone in it, enemies first when the area can't hold them all.
    for (const id of state.melees.keys()) {
        const group = members(id);
        const foes = group.filter((other) => other.side !== caster.side);
        if (!foes.length || !reaches(foes[0])) continue;
        // A burst into the caster's own Melee catches the caster too; a cone or line from it doesn't.
        const friends = group.filter((other) => other.side === caster.side && (other !== caster || info.area.type === "burst"));
        sets.push({ targets: [...foes, ...friends].slice(0, capacity) });
    }
    // Enemies standing apart in a band: spread out, so the area holds half as many.
    for (const band of ["near", "far"]) {
        const loose = enemies.filter((enemy) => enemy.status === "active" && enemy.meleeId === null && enemy.band === band && reaches(enemy) && affected(enemy));
        if (loose.length) sets.push({ targets: loose.slice(0, Math.max(1, Math.ceil(capacity / 2))) });
    }
    return sets;
}

// What the simulation can't model of a spell: [text…]. Empty: fully simulated.
export function spellGaps(spell) {
    const plan = spell?.plan;
    const kind = plan?.resolution?.kind;
    const family = kind ? registry.familyFor(kind) : null;
    if (!plan) return ["no plan"];
    if (!family) return [`resolution kind "${kind}" isn't resolved yet`];
    const info = describeSpell(plan);
    const missing = new Set();
    if (!info.actions && info.event === "use") missing.add(`cast as ${plan.activation?.time ?? "?"}`);
    if (!info.area && !info.targets && !info.self) missing.add("no creature targets");
    // Heal and Harm compiled before their healing payload: the healing half is missing.
    if (!healingOf(plan) && (plan.resolution?.sharedDamage?.components ?? []).some((component) => (component.kinds ?? []).includes("healing"))) missing.add("healing");
    // (A lingering area: played as a zone; a caster's temporary Hit Points from the damage, with the damage.)
    for (const gap of family.gaps?.(readPlan(plan)) ?? []) if (gap.what !== "lingering" && !(gap.what === "casterBenefit" && plan.resolution?.casterBenefit?.kind === "temp-hp") && !playedGap(spell, gap.what)) missing.add(gap.what);
    // A dry run at each degree, for the changes the engine doesn't apply.
    const dummy = { id: "dummy", name: "dummy", traits: [], immunities: [], side: "x", saves: { fortitude: 0, reflex: 0, will: 0 }, ac: 10, cond: {}, hp: { value: 10, max: 10, temp: 0 } };
    const caster = { id: "caster", side: "y", cond: {}, strikes: [], attacksThisTurn: 0 };
    const context = { caster, targets: [dummy], castRank: spell.castRank, id: (c) => c.id, statistic: () => ({ modifier: 0, dc: 10 }), traits: () => [], iwr: () => ({ immunities: [] }), allied: () => false };
    for (const degree of DEGREE_NAMES) {
        let result;
        try {
            result = registry.resolveSync(plan, context, { roll: () => ({ degree }) });
        } catch (error) {
            missing.add(`error: ${error.message}`);
            break;
        }
        for (const change of result.changes) {
            if (change.op === "condition" && !MODELLED_CONDITIONS.has(change.slug)) missing.add(`condition: ${change.slug}`);
            else if (change.op === "effect" && change.effect?.kind === "native" && spell.effects?.[change.effect.uuid]) {
                const model = spell.effects[change.effect.uuid];
                if (model.unsupported.length) missing.add(`${model.name.replace(/^Spell Effect: /, "")}: ${model.unsupported.join(", ")}`);
            } else if (change.op === "effect" && change.effect?.kind === "modifier") {
                if (!modifierModel(spell.name, change.effect.modifier)) missing.add(`modifier to ${change.effect.modifier?.selector}`);
            } else if (change.op === "effect" && ["floor", "counteract", "affliction-stage", "attack-ward", "true-sight"].includes(change.effect?.kind)) {
                // (Played: floors.js, counteract.js, afflictions.)
            } else if (change.op === "effect" && change.effect?.kind === "note" && (pacifyOf(change.effect.note) || noteState(change.effect.note) || noteModel(spell, change.effect.note))) {
                const model = pacifyOf(change.effect.note) || noteState(change.effect.note) ? null : noteModel(spell, change.effect.note);
                if (model?.unsupported.length) missing.add(`${change.effect.note.label}: ${model.unsupported.join(", ")}`);
            } else if (change.op === "effect" && change.effect?.kind === "note" && noteKnown(plan, change.effect.note)) {
                // (Played another way, or nothing in a fight: readings.js.)
            } else if (change.op === "effect") missing.add(change.effect?.kind === "note" ? `note: ${change.effect.note?.label ?? "effect"}` : change.effect?.kind === "native" ? `effect: ${change.effect.label ?? change.effect.uuid}` : `effect: ${change.effect?.kind}`);
            else if (change.op === "note" && change.manual) missing.add("manual step");
            // (An affliction with its stages: played, applyAffliction.)
            else if (change.op === "affliction" && Array.isArray(change.data?.stages)) continue;
            else if (!["damage", "condition", "move", "death", "followUp", "note", "heal", "tempHp", "end"].includes(change.op)) missing.add(change.op);
        }
    }
    return [...missing];
}

// A spell its caster can't cast again for minutes once cast (S59, Sure Strike's temporary immunity): its key, or null.
const FINDS_HIDDEN = /ignores the flat check for the target being Concealed or Hidden/i;
function castImmunityKey(spell) {
    const immunity = spell?.plan?.resolution?.temporaryImmunity;
    if (!immunity || immunity.startsWhen !== "cast" || !["minutes", "hours", "days"].includes(immunity.duration?.unit)) return null;
    return immunity.key ?? spell.name;
}

// A spell with the hex trait (a witch's hexes: one Cast a turn; its familiar's patron ability answers each Cast and Sustain).
export function isHex(spell) {
    return isSpellCast(spell) && (spell?.plan?.traits ?? []).includes("hex");
}

// Its master Sustained hexes as its turn started (lasting.js and zones.js note what they Sustain): the familiar answers each.
export function hexSustains(state, c) {
    for (const name of c.sustainedNow ?? []) {
        const spell = (c.spells ?? []).find((entry) => entry.name === name);
        if (spell && isHex(spell)) hexFamiliar(state, c, name, { applyCondition });
    }
}

// A chain's targets from its first (S55): each next one the closest foe left within the chain's feet of the last.
function chainFrom(first, foes, feet) {
    const chain = [first];
    const left = new Set(foes.filter((foe) => foe !== first));
    while (left.size) {
        const last = chain[chain.length - 1];
        const next = [...left].filter((foe) => distanceBetween(last, foe) <= feet).sort((a, b) => distanceBetween(last, a) - distanceBetween(last, b))[0];
        if (!next) break;
        chain.push(next);
        left.delete(next);
    }
    return chain;
}

// Parts of a plan the core leaves that the simulation plays itself, or that change nothing in a fight (S55–S57): Chain Lightning's chain,
// splash damage; a rank gate's text only from its rank (Stormburst's 7th); Dispel Magic's magic items and artifacts (no unattended items
// in a fight; a spell effect it counteracts, counteract.js).
function playedGap(spell, what) {
    const resolution = spell.plan?.resolution ?? {};
    if (what === "chain" || what === "splash" || what === "magicItem" || what === "artifactFails") return true;
    // (S59, Sure Strike: used up by the next attack roll, once a fight, and its note on concealed and hidden targets.)
    if (what === "consumeOn") return resolution.consumeOn?.on === "attack-roll";
    if (what === "temporaryImmunity") return Boolean(castImmunityKey(spell));
    if (what === "gmNotes") return [].concat(resolution.gmNotes ?? []).every((text) => FINDS_HIDDEN.test(String(text)));
    if (what === "otherKinds") return [].concat(resolution.otherKinds ?? []).every((kind) => kind === "spell" || kind === "item");
    if (what === "rankGate") return (Number(spell.castRank) || Number(spell.plan?.rank) || 1) < (Number(resolution.rankGate?.minRank) || Infinity);
    return false;
}

// A creature dying, or dropping to 0 Hit Points, near it (B305; the ability module's nearby-death trigger, batch 300 — living creatures
// only when it says so): each creature's reaction to it — Soul Feast's healing and Absorb Soul's quickening on itself, Preserve Prey keeping
// the creature that went down from dying (it stays unconscious, stable). One whose effect is only on the dead (Consume Soul's soul) does
// nothing here. died: it died, not only went down; melee: who was in its Melee as it fell.
export function nearbyDeathAnswers(state, victim, { died, melee = new Set() }) {
    const living = !isUndead(victim) && !(victim.traits ?? []).includes("construct");
    for (const c of state.list) {
        if (c === victim || !isActive(c) || !canAct(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (trigger?.event !== "nearby-death" || (trigger.dies && !died) || (trigger.living && !living)) continue;
            if (!trigger.free && !canReact(c, spell.name)) continue;
            const feet = trigger.within ?? 30;
            if (!(feet <= 10 ? melee.has(c.id) : c.band === victim.band || distanceBetween(c, victim) <= feet)) continue;
            if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0) || !poolReady(c, spell)) continue;
            const target = spell.plan?.targeting?.target;
            const heals = Object.values(spell.plan?.resolution?.outcomes ?? {}).some((row) => (row?.effects ?? []).some((effect) => effect.kind === "heal")) || spell.plan?.resolution?.kind === "healing";
            if (target === "self") {
                if (heals && c.hp.value >= c.hp.max) continue;
            } else if (target === "the triggering creature" && victim.status === DOWN && (victim.cond.dying ?? 0) > 0
                && Object.values(spell.plan?.resolution?.outcomes ?? {}).some((row) => (row?.effects ?? []).some((effect) => effect.kind === "end-condition" && (effect.slugs ?? []).includes("dying")))) {
                if (!trigger.free) spendReaction(c, spell.name);
                state.stats.reactions++;
                victim.cond.dying = 0;
                victim.stable = true;
                log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name}: ${victim.name} is unconscious but not dying`);
                continue;
            } else continue;
            if (!trigger.free) spendReaction(c, spell.name);
            state.stats.reactions++;
            log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name}`);
            castSpell(state, c, index, [c.id]);
        }
    }
}
