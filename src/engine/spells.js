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

import { CORE_FAMILIES, createRegistry, healingOf, mechanicalVariants, nativeOf, planWithActions, readPlan } from "../../../pf2e-resolution-core/src/index.js";
import { degreeDistribution, degreeOf, flatCheck, DEGREE_NAMES, SUCCESS } from "./checks.js";
import { ACTIVE, DOWN, armorClass, effectBonus, hpFraction, isActive, saveModifier, statusPenalty, strikeUsable, targetingChance } from "./combatant.js";
import { applyEffect, effectBenefit, removeEffect } from "./effects.js";
import { applyDamage, expectedHitDamage, increaseDying, killCreature, log } from "./actions.js";
import { adjustDamage, adjustInstance } from "./damage.js";
import { leaveMelee } from "./space.js";

const registry = createRegistry();
for (const family of CORE_FAMILIES) registry.registerFamily(family);

// Conditions the engine models: valued ones keep the higher value, flags are set.
const VALUED = new Set(["frightened", "sickened", "clumsy", "enfeebled", "drained", "slowed", "stunned", "doomed", "wounded", "stupefied"]);
// A spell's unconscious (Sleep) is "asleep" in the engine: damage wakes it, and it isn't down.
const FLAGS = {
    "off-guard": "offGuard", prone: "prone", fleeing: "fleeing", quickened: "quickened", fatigued: "fatigued",
    paralyzed: "paralyzed", unconscious: "asleep", blinded: "blinded", dazzled: "dazzled",
    immobilized: "immobilized", restrained: "restrained", grabbed: "grabbed"
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
        targets: area ? 0 : targetCount(targeting.target),
        attack: statistic === "spell-attack" || statistic === "strike" || (check?.roll === "skill" && (plan?.traits ?? []).includes("attack") && plan?.trigger?.map !== false),
        // Abilities: when they're used, how often, and on whom.
        event: plan?.trigger?.event ?? "use",
        recharge: plan?.trigger?.recharge?.formula ?? null,
        immunity: Boolean(plan?.trigger?.immunity),
        grabbedTargets: Boolean(targeting.grabbed),
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
        self: (kind === "effect" && !area && !targeting.target && !targeting.range) || (applications.length > 0 && !area && applications.every((application) => application.recipients === "self"))
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
            if (slug === "reflex" && c !== caster && disarmBonus(spell, c)) return { modifier: saveModifier(c, slug), dc: 10 + saveModifier(c, slug) - disarmBonus(spell, c) };
            if (slug === "fortitude" || slug === "reflex" || slug === "will") return { modifier: saveModifier(c, slug) };
            if (slug === "stabilize") return { modifier: 0, dc: defenceDC(c, slug) };
            // A skill check: the actor's roll (with the multiple attack penalty
            // for an attack-trait action), or another creature's DC.
            if (isCheckStatistic(slug)) {
                if (c === caster) return { modifier: skillValue(c, slug) - statusPenalty(c, "skill") - (describeSpell(spell.plan, actions).attack ? mapPenalty() : 0) };
                return { modifier: skillValue(c, slug) - statusPenalty(c, "skill"), dc: defenceDC(c, slug) };
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
    const rounds = durationRounds(duration);
    if (flag) target.cond[flag] = true;
    else target.cond[slug] = Math.max(target.cond[slug] ?? 0, Number.isFinite(value) ? value : 1);
    // Who's holding it, for Escape, Constrict and letting go.
    if ((slug === "grabbed" || slug === "restrained") && source && source !== target) target.grabbedBy = source.id;
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
    for (const other of state.list) {
        if (!other.timers?.length) continue;
        other.timers = other.timers.filter((timer) => {
            if (timer.turnOf !== c.id || state.round < timer.round || (timer.at ?? "start") !== phase) return true;
            if ((timer.key === "grabbed" || timer.key === "restrained") && !other.cond.grabbed && !other.cond.restrained) other.grabbedBy = null;
            if (timer.effect) {
                removeEffect(other, timer.effect);
                return false;
            }
            if (timer.offGuardTo) {
                other.offGuardTo = (other.offGuardTo ?? []).filter((entry) => entry !== timer.offGuardTo);
                return false;
            }
            const current = other.cond[timer.key];
            if (timer.value === true) other.cond[timer.key] = false;
            else if (current <= timer.value) other.cond[timer.key] = 0;
            if ((timer.key === "grabbed" || timer.key === "restrained") && !other.cond.grabbed && !other.cond.restrained) other.grabbedBy = null;
            return false;
        });
    }
}

export function hasTimer(c, key) {
    return (c.timers ?? []).some((timer) => timer.key === key);
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

function applyNativeEffect(state, caster, spell, target, change) {
    const model = change.effect?.kind === "native" ? spell.effects?.[change.effect.uuid] : null;
    if (model && isActive(target)) {
        applyEffect(state, target, model, caster, { applyCondition, key: change.effect.uuid });
        log(state, `  ${target.name} gains ${model.name.replace(/^Spell Effect: /, "")}`);
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
                } else if (isActive(target) && applyCondition(state, target, change.slug, change.value, change.duration, caster, change.scope ?? null)) log(state, `  ${target.name} is ${change.slug}${change.scope ? ` to ${state.byId.get(change.scope.attacker)?.name ?? "one creature"}` : ""}${Number.isFinite(change.value) ? ` ${change.value}` : ""}`);
                break;
            case "move":
                applyMove(state, target, change);
                break;
            case "heal":
                applyHeal(state, target, change.amount);
                break;
            case "effect":
                if (change.effect?.kind === "disarm") {
                    applyDisarm(state, target, change.effect);
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
                break;
            }
            case "death":
                if (target.status !== "dead" && (change.ifReducedTo === undefined || target.hp.value <= change.ifReducedTo)) killCreature(state, target);
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
export function castSpell(state, caster, spellIndex, targetIds, actions) {
    const spell = caster.spells[spellIndex];
    const info = describeSpell(spell.plan, actions);
    const reachable = (target) => isActive(target) || target === caster || ((info.healing || info.dying) && target.status === DOWN);
    const targets = targetIds.map((id) => state.byId.get(id)).filter((target) => target && reachable(target));
    if (spell.pool) caster.spellPools[spell.pool] = Math.max(0, (caster.spellPools[spell.pool] ?? 0) - 1);
    log(state, `  ${caster.name} casts ${spell.name}${actions && spellVariants(spell).length > 1 ? ` (${actions} actions)` : ""}${targets.length ? ` at ${targets.map((target) => target.name).join(", ")}` : ""}`);
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
    if (info.recharge) (caster.rechargeUntil ??= new Map()).set(spell, state.round + rollCount(state, info.recharge));
    if (info.immunity) {
        const immune = (caster.immuneTargets ??= new Map()).get(spell) ?? new Set();
        for (const target of targets) immune.add(target.id);
        caster.immuneTargets.set(spell, immune);
    }
    if (!targets.length) return;
    const context = simContext(state, caster, spell, targets, caster.attacksThisTurn - (info.attack ? 1 : 0), actions);
    const io = { ...liveRoller(state), choose: chooser(caster, targets) };
    const result = registry.resolveSync(spell.plan, context, io);
    for (const target of targets) {
        const degree = result.degrees[target.id];
        if (degree) log(state, `  ${target.name}: ${degree.replace(/([A-Z])/g, " $1").toLowerCase()}`);
    }
    applyChanges(state, caster, spell, result.changes, context, io);
}

// "1d4" or "3" → a number of rounds.
function rollCount(state, formula) {
    const dice = /^(\d+)d(\d+)$/.exec(String(formula).trim());
    if (!dice) return Number(formula) || 1;
    let total = 0;
    for (let index = 0; index < Number(dice[1]); index++) total += state.rng.die(Number(dice[2]));
    return total;
}

// After a Strike hits: riders its Strike lists (Grab, Knockdown, Push). Free
// ones (Improved Grab) happen at once; the others can be the creature's next action.
export function triggerRiders(state, attacker, target, strike) {
    for (const [index, spell] of (attacker.spells ?? []).entries()) {
        const trigger = spell.plan?.trigger;
        if (trigger?.event !== "strike" || !(strike.attackEffects ?? []).includes(trigger.attackEffect)) continue;
        if (trigger.cost === "free") castSpell(state, attacker, index, [target.id]);
        else attacker.riderReady = { index, targetId: target.id };
    }
}

// Auras (Frightful Presence): when the fight starts, each enemy in range is
// affected once. Bands: from 60 feet everyone; nearer, not those far away.
export function applyAuras(state) {
    for (const c of state.list) {
        if (!isActive(c)) continue;
        for (const [index, spell] of (c.spells ?? []).entries()) {
            if (spell.plan?.trigger?.event !== "aura") continue;
            const radius = describeSpell(spell.plan).area?.value ?? 30;
            const targets = state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "gone" && (radius >= 60 || other.band !== "far" || c.band === "far"));
            if (targets.length) castSpell(state, c, index, targets.map((target) => target.id));
        }
    }
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
    if ((c.rechargeUntil?.get(spell) ?? -Infinity) > (c.round ?? 0)) return false;
    if (!spellVariants(spell).some((actions) => {
        const info = describeSpell(spell.plan, actions);
        return info.area || info.targets || info.self;
    })) return false;
    return !spell.pool || (c.spellPools?.[spell.pool] ?? 0) > 0;
}

// How much a condition is worth, as a share of one round of the target's threat.
function conditionWorth(slug, value, duration) {
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
        default:
            return 0;
    }
}

// Expected effect of a cast on each target: [{ target, damage, worth }]:
// damage in HP after resistances, worth in rounds of the target's threat.
// The odds of each degree for one target, from the same numbers the core's
// resolver rolls with (pre-roll questions at their defaults).
const CERTAIN = Object.freeze([1, 0, 0, 0]);

function oddsFor(caster, spell, target, attacks, actions) {
    const check = describeSpell(spell.plan, actions).check;
    // No check (healing, Force Barrage): the outcome doesn't depend on a degree.
    if (!check) return CERTAIN;
    const penalty = statusPenalty(caster, "spell");
    if (check.roll === "attack") {
        const map = attacks <= 0 ? 0 : attacks === 1 ? 5 : 10;
        const base = check.statistic === "strike" ? Math.max(0, ...(caster.strikes ?? []).map((strike) => strike.bonus)) : (spell.attack ?? 0) + effectBonus(caster, "spell");
        return degreeDistribution(base + effectBonus(caster, "attack") - penalty - map, armorClass(target));
    }
    if (check.roll === "skill" || check.roll === "perception") {
        const map = describeSpell(spell.plan, actions).attack ? (attacks <= 0 ? 0 : attacks === 1 ? 5 : 10) : 0;
        const roll = Math.max(...[].concat(check.statistic).map((slug) => skillValue(caster, slug))) - statusPenalty(caster, "skill") - map;
        const dc = check.against?.dc === "fixed" ? check.against.value : defenceDC(target, check.against?.statistic ?? "will") - disarmBonus(spell, target);
        return degreeDistribution(roll, dc);
    }
    const slugs = check.saveChoice?.statistics?.length ? check.saveChoice.statistics : [check.statistic];
    const save = Math.max(...slugs.map((slug) => saveModifier(target, slug)));
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
                } else if (change.op === "effect" && change.effect?.kind === "native") {
                    const model = spell.effects?.[change.effect.uuid];
                    if (model) entry.benefit += chance * effectBenefit(model, target, conditionWorth, state.strikeShare?.get(target.id) ?? 1);
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
    // Constrict: everyone the creature is holding.
    if (info.grabbedTargets) {
        const held = enemies.filter((enemy) => enemy.grabbedBy === caster.id && isActive(enemy));
        return held.length ? [{ targets: held }] : [];
    }
    // Demoralize: not those already immune to it.
    const immune = caster.immuneTargets?.get(spell);
    if (immune?.size) enemies = enemies.filter((enemy) => !immune.has(enemy.id));
    const reaches = (other) => other === caster || (info.touch ? inMelee(other) : info.range === null || distance(other) <= info.range);
    if (!info.area) {
        const sets = [];
        const inRange = enemies.filter((enemy) => enemy.status === "active" && reaches(enemy));
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
    const members = (id) => [...(state.melees.get(id) ?? [])].map((memberId) => state.byId.get(memberId)).filter((other) => other && isActive(other));
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
            around.push(...state.list.filter((other) => apart(other) && other.band === "near" && reached(other)));
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
            } else if (change.op === "effect") missing.add(change.effect?.kind === "note" ? `note: ${change.effect.note?.label ?? "effect"}` : change.effect?.kind === "native" ? `effect: ${change.effect.label ?? change.effect.uuid}` : `effect: ${change.effect?.kind}`);
            else if (change.op === "note" && change.manual) missing.add("manual step");
            else if (!["damage", "condition", "move", "death", "followUp", "note", "heal"].includes(change.op)) missing.add(change.op);
        }
    }
    return [...missing];
}
