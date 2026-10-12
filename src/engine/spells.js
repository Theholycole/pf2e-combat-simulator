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
import { degreeDistribution, degreeOf, flatCheck, CRITICAL_SUCCESS, DEGREE_NAMES, SUCCESS } from "./checks.js";
import { ACTIVE, DOWN, armorClass, canAct, canMove, effectBonus, hpFraction, isActive, isOffGuard, saveModifier, statusPenalty, strikeUsable, targetingChance } from "./combatant.js";
import { applyEffect, effectBenefit, modifierModel, removeEffect } from "./effects.js";
import { applyDamage, expectedHitDamage, increaseDying, killCreature, log, reactionStrikeAt, releaseSwallowed, stride } from "./actions.js";
import { canReact, levelDC, saveBonusAgainst, sizeRank } from "./abilities.js";
import { adjustDamage, adjustInstance } from "./damage.js";
import { engagedEnemies, leaveMelee, sameMelee } from "./space.js";
import { moraleOdds } from "./morale.js";

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
    concealed: "concealed", hidden: "hidden", invisible: "hidden"
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
    if (!/creature|enem|foe|target|object|construct|undead|animal|humanoid|beast|fiend|spirit|dragon/.test(text)) return 0;
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

// The action counts a spell can be cast with: its PF2e variants, or its one cost.
export function spellVariants(spell) {
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
    const area = areaSource?.type && Number(areaSource.value) > 0 ? { type: areaSource.type, value: Number(areaSource.value) } : null;
    // The plan's check, or for a spell left to PF2e's own card ("unsupported"),
    // the native one or its first variant's (Lay on Hands vs. undead).
    const variants = mechanicalVariants(plan);
    const nativeCheck = nativeOf(plan).check ?? variants.find((variant) => variant.check)?.check;
    const check = plan?.resolution ? readPlan(plan).resolution.check ?? (nativeCheck ? readPlan({ resolution: { check: nativeCheck } }).resolution.check : null) : null;
    const statistic = check?.statistic;
    const healingVariant = variants.find((variant) => variant.healing?.components?.length);
    const healing = healingOf(plan) ? healingOf(plan).recipients ?? "any" : healingVariant ? healingVariant.healing.recipients ?? "any" : null;
    const kind = plan?.resolution?.kind;
    return {
        actions: plan?.castActions ?? actionCost(plan?.activation?.time),
        range: rangeFeet(targeting.range),
        touch: /touch/i.test(String(targeting.range ?? "")),
        area,
        targets: area ? 0 : targeting.allies ? 1 : targetCount(targeting.target),
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
        // Administer First Aid: dying allies.
        dying: Boolean(targeting.dying),
        escape: plan?.source?.slug === "escape",
        manipulate: (plan?.activation?.traits ?? plan?.traits ?? []).includes("manipulate"),
        nonlethal: (plan?.traits ?? []).includes("nonlethal"),
        check,
        // Who its healing reaches: "living", "undead", "willing" or "any"; null when it doesn't heal.
        healing,
        // A PF2e spell effect on its targets: aimed at allies as readily as at foes.
        helpful: kind === "effect" || applications.length > 0,
        // No target, range or area: the caster itself (the battle forms).
        self: targeting.target === "self" || (kind === "effect" && !area && !targeting.target && !targeting.range) || (applications.length > 0 && !area && applications.every((application) => application.recipients === "self"))
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

function isCheckStatistic(slug) {
    return SKILLS.has(slug) || slug === "perception" || slug === "unarmed";
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
            if (slug === "ac") return { dc: armorClass(c) };
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
            // A skill check: the actor's roll (with the multiple attack penalty
            // for an attack-trait action), or another creature's DC.
            if (isCheckStatistic(slug)) {
                if (c === caster) return { modifier: skillValue(c, slug) - statusPenalty(c, "skill") - (describeSpell(spell.plan, actions).attack ? mapPenalty() : 0) };
                return { modifier: skillValue(c, slug) - statusPenalty(c, "skill"), dc: escapeDCAgainst(caster, c, spell, actions) ?? defenceDC(c, slug) };
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
            const natural = state.rng.d20();
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
function betterSave(state, statistic, options, result) {
    const saver = options?.actor;
    if (!SAVES.has(statistic) || !saver?.id || !["failure", "criticalFailure"].includes(result?.degree) || !isActive(saver)) return result;
    const reroll = saver.saveReroll;
    if (reroll && (!reroll.save || reroll.save === statistic) && (saver.saveRerollUses ?? 0) > 0 && (reroll.free || canReact(saver))) {
        saver.saveRerollUses--;
        if (!reroll.free) saver.reactionUsed = true;
        state.stats.reactions++;
        const natural = state.rng.d20();
        const total = natural + options.modifier;
        const degree = DEGREE_NAMES[degreeOf(total, options.dc, natural)];
        log(state, `  ${saver.name} uses ${reroll.name}: ${degree.replace(/([A-Z])/g, " $1").toLowerCase()} on the reroll`);
        return reroll.keep === "new" || DEGREE_NAMES.indexOf(degree) > DEGREE_NAMES.indexOf(result.degree) ? { natural, total, dc: options.dc, degree } : result;
    }
    const ready = (c) => (c.saveBoostUntil ?? -Infinity) <= state.round && (c === saver && saver.saveBoost?.free ? true : canReact(c));
    const ownBoost = saver.saveBoost && (!Number.isFinite(saver.saveBoostUses) || saver.saveBoostUses > 0) && (!saver.saveBoost.criticalOnly || result.degree === "criticalFailure");
    const helper = ownBoost && ready(saver) ? saver
        : state.list.find((c) => c !== saver && c.side === saver.side && isActive(c) && c.allySaveBoost && ready(c) && (c.allySaveBoost.within >= 60 || (c.allySaveBoost.within <= 10 ? sameMelee(c, saver) : saver.band !== "far" || c.band === "far")));
    if (!helper) return result;
    const boost = helper === saver ? saver.saveBoost : helper.allySaveBoost;
    if (!boost.free) helper.reactionUsed = true;
    if (helper === saver && Number.isFinite(saver.saveBoostUses)) saver.saveBoostUses--;
    if (boost.recharge) helper.saveBoostUntil = state.round + rollCount(state, boost.recharge);
    state.stats.reactions++;
    const degree = DEGREE_NAMES[Math.min(3, DEGREE_NAMES.indexOf(result.degree) + 1)];
    log(state, `  ${helper.name} uses ${boost.name}: ${saver.name}'s save ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
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
export function bothHitRider(state, attacker, target, rider) {
    if (!isActive(target)) return;
    log(state, `  Both Strikes hit ${target.name}`);
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
    // Shake It Off, Slough Skin (B77; the user's choice): the first harmful condition an enemy gives it, negated with its reaction.
    const negate = target.negateCondition;
    if (negate && (target.negateConditionUses ?? 0) > 0 && source && source.side !== target.side && !NOT_HARMFUL.has(slug) && (!negate.conditions || negate.conditions.includes(slug)) && isActive(target) && canReact(target)) {
        target.negateConditionUses--;
        target.reactionUsed = true;
        log(state, `  ${target.name} uses ${negate.name}: not ${slug}`);
        return false;
    }
    // "As long as it's sickened" (Stench), "fleeing as long as it's frightened": ends when that condition does.
    if (duration?.mode === "while" && duration.condition) (target.whileConditions ??= []).push({ slug, value, while: duration.condition });
    // Fleeing with no stated end (Vision of Death, Aversion Beam): while it's frightened, or else its next turn (user, 2026-10-08).
    else if (slug === "fleeing" && !duration) (target.whileConditions ??= []).push({ slug, value, while: "frightened" });
    const rounds = durationRounds(duration);
    const before = target.cond[flag ?? slug] ?? 0;
    if (flag) target.cond[flag] = true;
    else target.cond[slug] = Math.max(target.cond[slug] ?? 0, Number.isFinite(value) ? value : 1);
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
    // Fast Swallow (B70): a creature it just grabbed, swallowed as its reaction once the action ends.
    if ((slug === "grabbed" || slug === "restrained") && !before && source?.fastSwallow && source !== target && !(state.afterAction ?? []).some((entry) => entry.targetId === target.id)) (state.afterAction ??= []).push({ kind: "fast-swallow", sourceId: source.id, targetId: target.id });
    if (Number.isFinite(rounds)) {
        // "Until the end of your next turn" ends at the end of that turn; the rest at its start.
        (target.timers ??= []).push({ key: flag ?? slug, value: flag ? true : target.cond[slug], round: state.round + rounds, turnOf: source?.id ?? target.id, at: duration?.expiry === "turn-end" ? "end" : "start" });
    }
    return true;
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
    const degree = degreeOf(natural + modifier, entry.data.dc, natural);
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

export function hasTimer(c, key) {
    return (c.timers ?? []).some((timer) => timer.key === key);
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
    const magic = !["ability", "basic"].includes(spell.kind) || /spells-srd/.test(spell.plan?.source?.uuid ?? "") || traits.some((trait) => MAGIC_TRAITS.includes(trait));
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
    if (change.effect?.kind === "modifier") return { model: modifierModel(spell.name, change.effect.modifier), key: `${spell.name}:${change.effect.modifier?.selector}` };
    return { model: null, key: null };
}

function applyNativeEffect(state, caster, spell, target, change) {
    const { model, key } = outcomeEffect(spell, change);
    if (model && isActive(target)) {
        applyEffect(state, target, model, caster, { applyCondition, key });
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
    const degree = degreeOf(natural + saveModifier(c, "fortitude"), c.sickenedDC ?? 10, natural);
    const drop = degree === 3 ? 2 : degree === 2 ? 1 : 0;
    c.cond.sickened = Math.max(0, (c.cond.sickened ?? 0) - drop);
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
    const odds = degreeDistribution(saveModifier(c, "fortitude"), c.sickenedDC ?? 10);
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
    for (const { slug, value, duration } of critical && rider.critical ? rider.critical : rider.conditions) {
        if (isActive(target) && applyCondition(state, target, slug, value ?? null, duration ?? null, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""}`);
    }
    const push = critical && rider.criticalPush ? rider.criticalPush : rider.push;
    if (push && isActive(target)) applyMove(state, target, { kind: "push", distance: push });
    for (const formula of rider.damage ?? []) {
        const instances = rollInstances(state, parseDamage(ownType(formula, strike))).map((instance) => ({ ...instance, amount: critical ? instance.amount * 2 : instance.amount }));
        const dealt = applyDamage(state, target, instances, { source: attacker });
        log(state, `  ${target.name} takes ${dealt} more ${instances.map((instance) => instance.type).join("/")}`);
    }
    if (activity.riderSpell && isActive(target)) castPlan(state, attacker, activity.riderSpell, [target.id]);
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
    let damage = (rider.damage ?? []).flatMap((formula) => parseDamage(ownType(formula, strike))).reduce((sum, instance) => sum + adjustInstance(target, instance.type, averageOf(instance)), 0);
    if (activity.riderSpell) {
        const entry = spellExpectation(state, attacker, activity.riderSpell, [target]).find((item) => item.target === target);
        damage += entry?.damage ?? 0;
        worth += entry?.worth ?? 0;
    }
    return { damage, worth };
}

function applyMove(state, target, change) {
    if (!isActive(target)) return;
    if (change.kind === "push" && change.distance >= 5 && target.meleeId !== null) {
        leaveMelee(state, target, "near");
        log(state, `  ${target.name} is pushed out of the melee`);
    } else if (change.kind === "pull" && change.distance >= 30 && target.band === "far") {
        target.band = "near";
        log(state, `  ${target.name} is pulled closer`);
    }
}

function applyChanges(state, caster, spell, changes, context, io) {
    const nonlethal = describeSpell(spell.plan).nonlethal;
    for (const change of changes) {
        const target = change.target !== undefined ? state.byId.get(change.target) : null;
        if (change.target !== undefined && !target) continue;
        switch (change.op) {
            case "damage": {
                const instances = change.instances.map((instance) => ({ type: instance.type, amount: instance.amount, persistent: false, precision: instance.category === "precision" }));
                const dealt = applyDamage(state, target, instances, { source: caster, nonlethal });
                log(state, `  ${target.name} takes ${dealt} ${change.instances.map((instance) => instance.type).join("/")}`);
                break;
            }
            case "condition":
                if (change.slug === "persistent-damage") applyDamage(state, target, [persistentInstance(change.damage)], { source: caster });
                // First Aid's critical failure: dying +1.
                else if (change.slug === "dying") {
                    if (target.status === DOWN) increaseDying(state, target, change.value ?? 1);
                } else if (isActive(target) && change.escalate?.slug && (FLAGS[change.escalate.if] ? target.cond[FLAGS[change.escalate.if]] : (target.cond[change.escalate.if] ?? 0) > 0)) {
                    // (B103: already slowed — "a failed save causes it to be Petrified permanently": the worse condition.)
                    if (applyCondition(state, target, change.escalate.slug, change.escalate.value, change.escalate.duration, caster)) log(state, `  ${target.name} is ${change.escalate.slug}`);
                } else if (isActive(target) && applyCondition(state, target, change.slug, stackedValue(target, change), change.duration, caster, change.scope ?? null)) {
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
    castPlan(state, caster, caster.spells[spellIndex], targetIds, actions, options);
}

// Resolves a spell or ability (one of the creature's, or a rider's plan) at the targets.
// Spellstrike (C20): forcedDegree is the Strike's result for a spell attack; disrupted, a spell lost to a critically missed Strike.
export function castPlan(state, caster, spell, targetIds, actions, { forcedDegree = null, disrupted = false } = {}) {
    const info = describeSpell(spell.plan, actions);
    const reachable = (target) => isActive(target) || target === caster || ((info.healing || info.dying) && target.status === DOWN);
    const targets = targetIds.map((id) => state.byId.get(id)).filter((target) => target && reachable(target));
    if (spell.pool) caster.spellPools[spell.pool] = Math.max(0, (caster.spellPools[spell.pool] ?? 0) - 1);
    log(state, `  ${caster.name} casts ${spell.name}${actions && spellVariants(spell).length > 1 ? ` (${actions} actions)` : ""}${targets.length ? ` at ${targets.map((target) => target.name).join(", ")}` : ""}`);
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
    const stupefied = caster.cond.stupefied ?? 0;
    if (stupefied && flatCheck(state.rng, 5 + stupefied) < SUCCESS) {
        log(state, `  ${caster.name} loses the spell (stupefied ${stupefied})`);
        return;
    }
    // Blinded or dazzled: each target of a targeted spell needs a flat check.
    const findDC = info.area ? 0 : caster.cond.blinded ? 11 : caster.cond.dazzled ? 5 : 0;
    if (findDC) {
        const found = targets.filter(() => flatCheck(state.rng, findDC) >= SUCCESS);
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
    const context = simContext(state, caster, spell, targets, caster.attacksThisTurn - (info.attack ? 1 : 0), actions);
    const live = liveRoller(state);
    // Spellstrike: the spell attack takes the Strike's result.
    const rolled = forcedDegree !== null ? (statistic, options) => (statistic === "spell-attack" || statistic === "strike" ? { natural: null, total: null, dc: options?.dc, degree: DEGREE_NAMES[forcedDegree] } : live.roll(statistic, options)) : live.roll;
    // (A failed save a reaction makes better, B80.)
    const roll = (statistic, options) => betterSave(state, statistic, options, rolled(statistic, options));
    const io = { ...live, roll, choose: chooser(caster, targets) };
    const result = registry.resolveSync(spell.plan, context, io);
    for (const target of targets) {
        const degree = result.degrees[target.id];
        if (degree) log(state, `  ${target.name}: ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
    }
    if (info.immunity && info.immunityDegrees) markImmune(targets.filter((target) => !result.degrees[target.id] || info.immunityDegrees.includes(result.degrees[target.id])));
    applyChanges(state, caster, spell, result.changes, context, io);
    // Otherworldly Mind, Entropic Feedback: a mental effect aimed at a creature whose ability answers it (B46).
    if (!info.area) targetedAnswers(state, caster, spell, targets);
    // Savage, Gnashing Bite (B92): a failed Escape, answered by the creature holding it.
    if (info.escape) for (const target of targets) escapeAnswers(state, caster, target, result.degrees[target.id]);
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
            if ((follow.on ?? ["success", "criticalSuccess"]).includes(DEGREE_NAMES[degree]) && named && listing && (!follow.melee || strike.melee)) {
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
    passiveAnswers(state, defender, attacker, (trigger) => trigger.event === "hit-by" && (!trigger.melee || strike.melee) && (!trigger.unarmed || strike.unarmed)
        && (!trigger.critical || degree === CRITICAL_SUCCESS) && typesMatch(trigger.damageTypes, types));
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
function answerTargets(state, c, plan, other) {
    const radius = describeSpell(plan).area?.value;
    const live = other && isActive(other);
    if (["the attacker", "the creature the Strike hits", "the held creature"].includes(plan.targeting?.target)) return live ? [other] : [];
    if (radius && plan.targeting?.area?.around === "target") return live ? [other, ...around(state, other, radius, (near) => sameMelee(other, near)).filter((near) => near !== c)] : [];
    // (B100: one creature, with none setting it off — Battle Cry's Demoralize as the fight starts: its nearest foe.)
    if (!radius && !other && plan.targeting?.target === "1 creature") {
        const foe = nearestFoe(state, c, plan);
        return foe ? [foe] : [];
    }
    return radius ? around(state, c, radius, (near) => sameMelee(c, near)) : [];
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
    useReaction(state, defender, attacker, (trigger) => trigger.event === "hit-by" && (!trigger.critical || degree === CRITICAL_SUCCESS) && (!trigger.melee || strike.melee) && (!trigger.unarmed || strike.unarmed)
        && (!trigger.within || trigger.within > 10 || sameMelee(defender, attacker)) && typesMatch(trigger.damageTypes, types));
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
    if (!answer || !isActive(target) || !canAct(target) || !canReact(target) || target.cond.fleeing) return;
    const foes = engagedEnemies(state, target).filter(isActive);
    const victim = !answer.random && source && foes.includes(source) ? source : foes.length ? foes[state.rng.die(foes.length) - 1] : null;
    if (!victim) return;
    reactionStrikeAt(state, target, victim, answer, "damaged");
    if (answer.persistentFire && isActive(target) && target.persistent?.some((entry) => entry.type === "fire")) {
        const ends = flatCheck(state.rng, 15) >= SUCCESS;
        if (ends) target.persistent = target.persistent.filter((entry) => entry.type !== "fire");
        log(state, `  ${target.name} ${ends ? "puts out its persistent fire" : "still burns"}`);
    }
}

// A spell or an action with a trait a creature's ability answers when it's targeted (B46: Otherworldly Mind's "Whenever a
// creature targets the hound with a mental effect, that creature takes 8d6 mental damage"; Entropic Feedback, a reaction):
// on the caster, after its effect. Not an area's, and not one answer setting off another.
export function targetedAnswers(state, caster, spell, targets) {
    if (state.answering) return;
    const traits = spell.plan?.traits ?? [];
    const isSpell = !["ability", "basic"].includes(spell.kind) || /spells-srd/.test(spell.plan?.source?.uuid ?? "");
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
            if (answer && isActive(caster) && isActive(target) && canReact(target) && canAct(target) && !target.cond.fleeing) reactionStrikeAt(state, target, caster, answer, "targeted");
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
        if (!trigger?.reaction || !matches(trigger) || (!trigger.free && !canReact(c))) continue;
        if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0) || (spell.pool && !((c.spellPools?.[spell.pool] ?? 0) > 0))) continue;
        const targets = answerTargets(state, c, spell.plan, other);
        if (!targets.some((target) => target.side !== c.side)) continue;
        if (!trigger.free) c.reactionUsed = true;
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
        if (!trigger?.reaction || trigger.event !== "downs" || (!trigger.free && !canReact(c))) continue;
        const foes = state.list.filter((other) => other.side !== c.side && other !== downed && isActive(other) && !c.immuneTargets?.get(spell)?.has(other.id));
        const target = foes.find((other) => sameMelee(c, other)) ?? foes.find((other) => other.band !== "far") ?? null;
        if (!target) return;
        if (!trigger.free) c.reactionUsed = true;
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
            if (!trigger?.reaction || trigger.event !== "condition-lost" || trigger.condition !== slug || (!trigger.free && !canReact(c)) || !near(c, trigger.within)) continue;
            if (!trigger.free) c.reactionUsed = true;
            state.stats.reactions++;
            log(state, `  ${c.name} ${trigger.free ? "uses" : "reacts with"} ${spell.name} (${creature.name} is no longer ${slug})`);
            castSpell(state, c, index, [c.id]);
            break;
        }
    }
}

// A creature it holds failing to Escape (B92: Savage's "A creature Grabbed by the wyvern critically fails a skill check to Escape … a
// stinger Strike against the triggering creature", Gnashing Bite's "fails a check to Escape … The lizard's jaws deal 1d6 piercing and
// 1d6 acid damage to the triggering creature"): its reaction at that creature.
export function escapeAnswers(state, escaper, grabber, degree) {
    if (!["failure", "criticalFailure"].includes(degree) || !isActive(grabber) || !isActive(escaper) || !canAct(grabber)) return;
    const critical = degree === "criticalFailure";
    const answer = (grabber.reactionStrikes ?? []).find((entry) => entry.triggers.includes("escape-failed") || (critical && entry.triggers.includes("escape-critical-failure")));
    if (answer && canReact(grabber) && !grabber.cond.fleeing) {
        reactionStrikeAt(state, grabber, escaper, answer, "escape");
        return;
    }
    useReaction(state, grabber, escaper, (trigger) => trigger.event === "escape-failed" && (!trigger.critical || critical));
}

// A foe's mishap near a monster (B85: Jeer at Failure's "A foe within 90 feet becomes Prone or critically fails on a Strike"): the
// monster's reaction at it (PF2e's Demoralize). Within its distance and its action's range (30 feet): the bands, as above.
export function mishapAnswers(state, creature) {
    if (!isActive(creature)) return;
    for (const c of state.list) {
        if (c.side === creature.side || !isActive(c) || !canAct(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (!trigger?.reaction || trigger.event !== "foe-mishap" || (!trigger.free && !canReact(c)) || c.immuneTargets?.get(spell)?.has(creature.id)) continue;
            const within = Math.min(trigger.within ?? Infinity, Number.parseInt(spell.plan?.targeting?.range, 10) || Infinity);
            if (within <= 10 ? !sameMelee(c, creature) : within < 60 && creature.band === "far" && c.band !== "far") continue;
            if (!trigger.free) c.reactionUsed = true;
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
export function provokedReaction(state, c, mover, kind) {
    const near = (within) => (within === "reach" || Number(within) <= 10 ? sameMelee(c, mover) : Number(within) >= 60 || mover.band !== "far" || c.band === "far");
    return useReaction(state, c, mover, (trigger) => trigger.event === "provoke" && (trigger.triggers ?? []).some((each) => each === kind || (kind === "move" && each === "leave")) && near(trigger.within));
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
        if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0) || (spell.pool && !((c.spellPools?.[spell.pool] ?? 0) > 0))) continue;
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

export function canCast(c, spell) {
    if (!registry.familyFor(spell.plan?.resolution?.kind) || castsNothing(spell.plan)) return false;
    // Recharging (a breath weapon used a round ago).
    if ((c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0)) return false;
    if (!spellVariants(spell).some((actions) => {
        const info = describeSpell(spell.plan, actions);
        return info.area || info.targets || info.self;
    })) return false;
    return !spell.pool || (c.spellPools?.[spell.pool] ?? 0) > 0;
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
        const roll = Math.max(...[].concat(check.statistic).map((slug) => skillValue(caster, slug))) + (Number(check.bonus?.value) || 0) - statusPenalty(caster, "skill") - map;
        const dc = check.against?.dc === "fixed" ? check.against.value : escapeDCAgainst(caster, target, spell, actions) ?? defenceDC(target, check.against?.statistic ?? "will") - disarmBonus(spell, target);
        return degreeDistribution(roll, dc);
    }
    const slugs = check.saveChoice?.statistics?.length ? check.saveChoice.statistics : [check.statistic];
    const save = Math.max(...slugs.map((slug) => saveModifier(target, slug) + saveBonusAgainst(target, slug, spell)));
    const dc = check.against?.dc === "fixed" ? check.against.value : (spell.dc ?? 10) - penalty + effectBonus(caster, "spell");
    return degreeDistribution(save, dc);
}

// The changes a spell has on one target at each degree, with average damage.
// They don't change during a fight, so each pair is resolved once per fight.
function outcomesFor(state, caster, spell, target, actions) {
    state.spellOutcomes ??= new WeakMap();
    let byTarget = state.spellOutcomes.get(spell);
    if (!byTarget) {
        byTarget = new Map();
        state.spellOutcomes.set(spell, byTarget);
    }
    const key = `${target.id}|${actions ?? 0}`;
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

// Expected effect of a cast on each target: [{ target, damage, worth, heal, benefit }]:
// damage and healing in HP (after resistances; healing up to the HP missing),
// worth (harm from conditions) and benefit (from a PF2e spell effect, negative
// for a hindrance) in rounds of the target's threat.
export function spellExpectation(state, caster, spell, targets, attacks = caster.attacksThisTurn ?? 0, actions = undefined) {
    const stupefied = caster.cond.stupefied ?? 0;
    const casts = stupefied ? Math.max(0, 16 - stupefied) / 20 : 1;
    const finds = casts * (describeSpell(spell.plan, actions).area ? 1 : targetingChance(caster));
    const result = [];
    // What happens to the caster itself (Trip's critical failure, Escape's success).
    let self = null;
    for (const target of targets) {
        const entry = { target, damage: 0, worth: 0, heal: 0, benefit: 0 };
        result.push(entry);
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
        for (const [degreeIndex, changes] of outcomes.entries()) {
            const chance = finds * odds[degreeIndex];
            if (!chance) continue;
            for (const change of changes) {
                if (change.target === caster.id && target !== caster) {
                    self ??= { target: caster, damage: 0, worth: 0, heal: 0, benefit: 0 };
                    if (change.op === "condition") self.worth += chance * conditionWorth(change.slug, change.value, change.duration);
                    else if (change.op === "end") self.benefit += chance * (change.what?.conditions ?? []).reduce((sum, slug) => sum + (caster.cond[FLAGS[slug] ?? slug] ? conditionWorth(slug, null, null) : 0), 0);
                    continue;
                }
                if (change.op === "damage") {
                    entry.damage += chance * adjustDamage(target, change.instances.map((instance) => ({ type: instance.type, amount: instance.amount, persistent: false, precision: instance.category === "precision" }))).total;
                } else if (change.op === "condition" && change.slug === "persistent-damage") {
                    entry.damage += chance * 2 * adjustInstance(target, change.damage.type, change.damage.amount);
                } else if (change.op === "condition" && change.scope) {
                    // Feint, Create a Diversion: the attacker's own attacks hit more often (+2): about a
                    // tenth of a hit's damage per attack (one for a single use, three otherwise).
                    if (change.scope.attacker === caster.id) entry.damage += chance * 0.1 * bestHit(caster, target, change.scope.attacks === "melee") * (change.scope.uses ?? 3);
                } else if (change.op === "condition") {
                    entry.worth += chance * conditionWorth(change.slug, change.value, change.duration);
                    // The party plays for morale (M23): fear may break the foe, which takes it out of the fight.
                    if (change.slug === "frightened" && caster.side === "party" && target.side !== caster.side && state.setup.situational?.playsForMorale) {
                        // Only a rise in frightened sets off a check (and only to the trigger's minimum value: M25).
                        const after = Math.max(target.cond.frightened ?? 0, change.value ?? 1);
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
                    // Worth something only against a weapon in hand: a dropped one costs an action to pick up.
                    if ((target.strikes ?? []).some((strike) => strike.held && strikeUsable(target, strike))) entry.worth += chance * (change.effect.what === "drop" ? 0.5 : 0.25);
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
                } else if (change.op === "effect" && ["native", "modifier"].includes(change.effect?.kind)) {
                    const { model, key } = outcomeEffect(spell, change);
                    if (model) entry.benefit += chance * recastShare(state, target, model, key) * effectBenefit(model, target, conditionWorth, state.strikeShare?.get(target.id) ?? 1);
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
    const reaches = (other) => other === caster || (info.touch ? inMelee(other) : info.range === null || distance(other) <= info.range);
    if (!info.area) {
        const sets = [];
        // (A spell for a willing creature — Vapor Form — goes to no enemy.)
        const willing = /\bwilling\b/i.test(String(spell.plan?.targeting?.target ?? ""));
        const inRange = willing ? [] : enemies.filter((enemy) => enemy.status === "active" && reaches(enemy));
        if (inRange.length) {
            if (info.targets <= 1) sets.push(...inRange.map((enemy) => ({ targets: [enemy] })));
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
    const members = (id) => [...(state.melees.get(id) ?? [])].map((memberId) => state.byId.get(memberId)).filter((other) => other && isActive(other) && notImmune(other));
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
        const loose = enemies.filter((enemy) => enemy.status === "active" && enemy.meleeId === null && enemy.band === band && reaches(enemy));
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
    for (const gap of family.gaps?.(readPlan(plan)) ?? []) missing.add(gap.what);
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
            } else if (change.op === "effect") missing.add(change.effect?.kind === "note" ? `note: ${change.effect.note?.label ?? "effect"}` : change.effect?.kind === "native" ? `effect: ${change.effect.label ?? change.effect.uuid}` : `effect: ${change.effect?.kind}`);
            else if (change.op === "note" && change.manual) missing.add("manual step");
            else if (!["damage", "condition", "move", "death", "followUp", "note", "heal", "tempHp"].includes(change.op)) missing.add(change.op);
        }
    }
    return [...missing];
}
