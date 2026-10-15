// Built-in PF2e actions: Strike, Stride, Step, Stand, Raise a Shield, and the
// reactions Attack of Opportunity and Shield Block. Also damage, dying and
// hero points.

import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeOf, flatCheck, rollCheck } from "./checks.js";
import { approach, isMapObjective, leftItem, moveTo, moveToward, reachItem } from "./map-objectives.js";
import { raiseAlarm, strideOutOf, strideToGong } from "./escalations.js";
import { DEAD, DOWN, FLED, armorClass, canAct, canMove, deathThreshold, effectBonus, gripPenalty, isActive, isOffGuard, multipleAttackPenalty, offGuardTo, saveModifier, spendAmmo, statusPenalty, strikeUsable } from "./combatant.js";
import { adjustDamage, adjustPart, concussiveType, expectedStrikeDamage, adjustInstance, onceWeakness, resistancesOf, rollStrikeDamage, strikeContext } from "./damage.js";
import { canStepOut, distanceBetween, engage, engagedEnemies, flankChance, leaveMelee, rangePenalty, removeFromSpace, sameMelee } from "./space.js";
import { harmedAfterGivingUp, isShaken } from "./morale.js";
import { canReact, chargeStrike, extraApplies, hasOwnEffect, reactionMark, regenerating, restoreReaction, sizeRank, spendReaction, strikeNamed } from "./abilities.js";
import { adjustedSaveDegree, constructArmorDamaged, flankableBy, mobileStride, offGuardFrom } from "./passives.js";
import { applyEffect, hasConditional, strikeRollOptions, removeEffect, takeAttackFortune } from "./effects.js";
import { applyCondition, applyMove, castPlan, castSpell, deathThroes, nearbyDeathAnswers, downsAnswers, hitByAnswers, mishapAnswers, provokedReaction, reactToAttack, reactToDamage, reactToHit, reactToMiss, reactToOwnHit, rollCount, rollInstances } from "./spells.js";
import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";
import { summonerFalls, summonsOnDamage, summonsOnDeath } from "./summons.js";
import { hiddenMovementOffGuard, sightDC, unseen } from "./environment.js";
import { aimsAtHead, attachAfterHit, bestStrikeType, cauterizeStumps, critRiderAnswer, critSpecEffect, elementalAnswers, proteanAfterDamage, splitAfterHit, strikeHead, troopAfterDamage } from "./creature-rules.js";
import { log } from "./log.js";
import { afterAttackFortune, attackFortune } from "./fortune-items.js";
import { hostility, ownHostility } from "./pacify.js";
import { wardBlocks } from "./wards.js";
import { hiddenFrom } from "./sight.js";
import { lifelinkMaster } from "./familiars.js";
import { keenCritical, runeCritEffects } from "./runes.js";
import { championTriggered, demoralize, exaltedStrikes, heroesDefiance, lastStand, retributionAfter } from "./champion.js";
import { luminanceStrikesBack } from "./luminance.js";
import { canSpendHero, spendHeroPoint } from "./heroes.js";

export function coverFor(state, defender) {
    return state.setup.cover?.[defender.side] ?? 0;
}

export function nonlethalAgainst(state, attacker, target) {
    const objective = state.objective;
    return attacker.side === "party" && objective?.kind === "target" && objective.mode === "capture" && objective.targetId === target.id;
}

// Weapon traits that depend on earlier attacks this turn. history holds this
// turn's Strikes as { strike, targetId, hit }.
function traitAttackBonus(strike, target, history) {
    const earlier = history.filter((entry) => entry.strike === strike.name);
    let bonus = 0;
    if (strike.sweep && earlier.some((entry) => entry.targetId !== target.id)) bonus = 1;
    if (strike.backswing && earlier.some((entry) => !entry.hit)) bonus = 1;
    return bonus;
}

// Forceful: + weapon dice on the second attack with the weapon, double on later ones.
export function forcefulBonus(strike, earlierAttacks) {
    if (!strike.forceful || earlierAttacks <= 0) return 0;
    return (strike.damage[0]?.dice ?? 1) * Math.min(2, earlierAttacks);
}

// Attack modifier for a Strike, excluding the target's AC.
// The multiple attack penalty, with the Flurry hunter's edge against the prey (−3/−6, agile −2/−4).
export function attackPenalty(attacker, strike, target, attacksMade) {
    const penalty = multipleAttackPenalty(strike, attacksMade);
    if (attacker.huntPrey?.edge !== "flurry" || attacker.prey !== target?.id || attacksMade <= 0) return penalty;
    return attacksMade === 1 ? (strike.agile ? 2 : 3) : strike.agile ? 4 : 6;
}

export function attackModifier(state, attacker, target, strike, attacksMade, { prone, history = attacker.turnAttacks ?? [] } = {}) {
    // (2026-10-15: an effect's conditional attack bonus — against a trait, with this kind of attack.)
    const options = hasConditional(attacker) ? strikeRollOptions(attacker, strike, target, strikeContext(attacker, strike)) : null;
    let modifier = strike.bonus - attackPenalty(attacker, strike, target, attacksMade) + effectBonus(attacker, "attack", options) - gripPenalty(attacker, strike);
    // A stance's change to this Strike, as PF2e made it (C13).
    for (const effect of attacker.effects ?? []) modifier += effect.model?.attackDeltas?.[strike.name] ?? 0;
    modifier -= statusPenalty(attacker, strike.melee ? "melee" : "ranged");
    modifier -= circumstancePenalty(state, attacker, target, strike, { prone });
    modifier += traitAttackBonus(strike, target, history);
    if (!strike.melee) modifier -= rangePenalty(strike, distanceBetween(attacker, target)) ?? 0;
    return modifier;
}

// The circumstance penalty to a creature's attack: prone, shaken, a nonlethal attack with a lethal weapon (the highest applies).
export function circumstancePenalty(state, attacker, target, strike, { prone } = {}) {
    let circumstance = 0;
    if (prone ?? attacker.cond.prone) circumstance = Math.max(circumstance, 2);
    if (isShaken(attacker)) circumstance = Math.max(circumstance, state.moraleRules.group.shakenAttackPenalty);
    if (nonlethalAgainst(state, attacker, target) && !strike.nonlethal) circumstance = Math.max(circumstance, 2);
    return circumstance;
}

export function flankersAgainst(state, target, attacker) {
    if (!sameMelee(attacker, target)) return 0;
    return engagedEnemies(state, target).filter((enemy) => canAct(enemy)).length;
}

function berserkPenalty(state, c) {
    return c.berserkUntilRound !== undefined && c.berserkUntilRound >= state.round ? 1 : 0;
}

export function targetAC(state, attacker, target, strike, flanked) {
    // Feinted or diverted: off-guard to this attacker alone.
    const feinted = !isOffGuard(target) && offGuardTo(target, attacker, strike.melee);
    // The Outwit hunter's edge: +1 AC against the prey.
    const outwit = target.huntPrey?.edge === "outwit" && target.prey === attacker.id ? 1 : 0;
    // (T4: attached — the pickled punk's +2 while not held itself; the bee borer's target off-guard to it too.)
    const attached = target.attachedTo && target.attach?.acBonus && !target.cond.grabbed && !target.cond.restrained ? target.attach.acBonus : 0;
    const borne = !isOffGuard(target) && state.list.some((other) => other.attachedTo === target.id && other.attach?.both && isActive(other));
    // (2026-10-15: an effect's conditional AC — against ranged attacks, auditory ones, an unholy creature's.)
    const options = hasConditional(target) ? strikeRollOptions(attacker, strike, target, strikeContext(attacker, strike)) : null;
    return armorClass(target, { ranged: !strike.melee, coverBonus: coverFor(state, target), flanked: flanked || feinted || borne, options }) - berserkPenalty(state, target) + outwit + attached;
}

// Cache of expected hit damage per Strike object (shared by every run of a
// batch), keyed by the target's defences and the situational modifiers.
const hitDamageCache = new WeakMap();
const defenceIds = new Map();

// A small number per distinct set of resistances, weaknesses and immunities.
function defenceId(target) {
    // (T3–T4: resistances that change with its Hit Points or the damage it took aren't kept.)
    const changing = Boolean(target.hpRules?.length || target.protean);
    if (target.defenceId === undefined || changing) {
        const text = JSON.stringify([resistancesOf(target), target.weaknesses ?? [], target.immunities ?? []]);
        if (!defenceIds.has(text)) defenceIds.set(text, defenceIds.size);
        if (changing) return defenceIds.get(text);
        target.defenceId = defenceIds.get(text);
    }
    return target.defenceId;
}

// Expected damage of one hit or critical hit after the defender's adjustments.
// bonus: a circumstance damage bonus (forceful); offGuardChance: for backstabber
// and Sneak Attack; packAllies: the attacker's allies within reach of the target (Pack Attack).
export function expectedHitDamage(attacker, strike, target, critical, { bonus = 0, offGuardChance = 0, packAllies = 0 } = {}) {
    // Hazards and objects: immune to critical hits, and Hardness off each hit.
    if (critical && target.immunities?.includes("critical-hits")) critical = false;
    // (I2: the Strike's context — its traits, materials, group and runes — for the weaknesses and resistances they set off.)
    const context = strikeContext(attacker, strike, critical);
    let total = baseHitDamage(attacker, strike, target, critical, bonus, offGuardChance);
    if (attacker.strikeExtras?.length) total += expectedExtras(attacker, strike, target, critical, offGuardChance, packAllies);
    for (const part of featureParts(attacker, strike, target, { offGuard: offGuardChance })) {
        const amount = ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (critical && !part.noCrit ? 2 : 1);
        total += part.chance * adjustInstance(target, part.type ?? strike.damage[0]?.type ?? "untyped", amount, !!part.precision, context);
    }
    // (B309, I2: a weakness once a hit — a holy or unholy Strike's on a creature weak to it, an axe's, a tradition's.)
    total += onceWeakness(target, context);
    return target.hardness ? Math.max(0, total - target.hardness) : total;
}

// Extra damage parts a PC's class features add to a Strike, each with the
// chance it applies: the off-guard dice PF2e gives the Strike (Sneak Attack),
// an active buff's (Rage), and the Precision hunter's edge on the first hit on the prey.
export function featureParts(attacker, strike, target, { offGuard = 0, firstPreyHit = true } = {}) {
    const parts = [];
    if (offGuard && strike.offGuardExtra?.length) for (const part of strike.offGuardExtra) parts.push({ ...part, chance: offGuard });
    for (const buff of attacker.activeBuffs ?? []) for (const part of buff.strikeDeltas?.[strike.name] ?? []) parts.push({ ...part, chance: 1 });
    // (B241: a part only against creatures with a trait, Imbue Righteousness's.)
    for (const effect of attacker.effects ?? []) for (const part of effect.model?.strikeDeltas?.[strike.name] ?? []) if (!part.vsTrait || (target.traits ?? []).includes(part.vsTrait)) parts.push({ ...part, chance: 1 });
    // (B308: a mark's extra damage — Smite's +4, +8 against an unholy target.)
    if (attacker.huntPrey?.edge === "parts" && attacker.prey === target.id) for (const part of attacker.huntPrey.parts) parts.push({ dice: part.dice, die: part.die, bonus: part.upgrade && (target.traits ?? []).includes(part.upgrade.trait) ? Math.max(part.bonus, part.upgrade.value) : part.bonus, multiplier: 1, type: part.type ?? strike.damage?.[0]?.type, precision: false, persistent: false, chance: 1 });
    if (attacker.huntPrey?.edge === "precision" && attacker.prey === target.id && (firstPreyHit || attacker.huntPrey.every)) parts.push({ dice: attacker.huntPrey.precisionDice ?? 1, die: attacker.huntPrey.die ?? 8, bonus: 0, type: strike.damage[0]?.type, precision: true, chance: 1 });
    // Panache: Precise Strike's damage on agile or finesse melee Strikes; a finisher's dice instead.
    const precise = attacker.panacheStyle && strike.melee && (strike.agile || strike.finesse);
    if (precise && strike.finisher) parts.push({ dice: attacker.panacheStyle.finisherDice, die: 6, bonus: 0, type: strike.damage[0]?.type, precision: true, chance: 1 });
    else if (precise && attacker.panache) parts.push({ dice: 0, die: 0, bonus: attacker.panacheStyle.precise, type: strike.damage[0]?.type, precision: true, chance: 1 });
    // (C31, Oath of the Slayer: spirit damage against its sworn kind, doubled after one set off its reaction, through its next turn.)
    if (attacker.oath && (target.traits ?? []).includes(attacker.oath.trait)) parts.push({ dice: 0, die: 0, bonus: attacker.oath.value * ((attacker.oathDoubled ?? -Infinity) >= (attacker.round ?? 0) ? 2 : 1), type: "spirit", precision: false, chance: 1 });
    // (C32, Fearsome Brute: double — triple, a master in Intimidation — the target's frightened value to the damage.)
    if (attacker.fearsomeBrute && target.cond?.frightened > 0) parts.push({ dice: 0, die: 0, bonus: attacker.fearsomeBrute * target.cond.frightened, type: strike.damage?.[0]?.type, precision: false, chance: 1 });
    // Exploit Vulnerability: the weakness it found or imposed, once per hit (not doubled).
    if (attacker.exploited?.targetId === target.id) parts.push({ dice: 0, die: 0, bonus: attacker.exploited.value, type: "untyped", precision: false, noCrit: true, chance: 1 });
    // Gunslinger deeds (C18): One Shot, One Kill's precision dice on the first hit with a
    // firearm or crossbow; Energy Shot's 1 per weapon die, of the energy the target resists least.
    if (strike.firearm && attacker.firstShotReady) parts.push({ dice: attacker.firstShotReady, die: 6, bonus: 0, type: strike.damage[0]?.type, precision: true, chance: 1 });
    if (strike.firearm && attacker.energyShotsLeft > 0) parts.push({ dice: 0, die: 0, bonus: strike.damage[0]?.dice ?? 1, type: bestEnergy(target), precision: false, chance: 1 });
    return parts;
}

const ENERGIES = ["fire", "cold", "electricity", "acid"];
const bestEnergy = (target) => ENERGIES.reduce((best, type) => (adjustInstance(target, type, 4) > adjustInstance(target, best, 4) ? type : best), ENERGIES[0]);

// The extra dice of abilities such as Sneak Attack, on average (doubled on a critical hit).
function expectedExtras(attacker, strike, target, critical, offGuardChance, packAllies) {
    let total = 0;
    for (const extra of attacker.strikeExtras) {
        const chance = extra.when === "off-guard" ? offGuardChance : extraApplies(extra, target, { offGuard: false, packAllies, attacker }) ? 1 : 0;
        if (!chance) continue;
        const amount = (extra.dice * (extra.die + 1) / 2 + (extra.bonus ?? 0)) * (critical ? 2 : 1);
        total += chance * adjustInstance(target, extra.type ?? strike.damage[0]?.type ?? "untyped", amount, extra.precision, strikeContext(attacker, strike, critical));
    }
    return total;
}

function baseHitDamage(attacker, strike, target, critical, bonus, offGuardChance) {
    const penalty = (strike.melee ? attacker.cond.enfeebled : 0) - bonus - effectBonus(attacker, "damage");
    let cache = hitDamageCache.get(strike);
    if (!cache) {
        cache = new Map();
        hitDamageCache.set(strike, cache);
    }
    const offGuard = strike.backstabber ? Math.round(offGuardChance * 100) : 0;
    const key = ((defenceId(target) * 2 + (critical ? 1 : 0)) * 2048 + (penalty + 1024)) * 101 + offGuard;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const total = computeHitDamage(attacker, strike, target, critical, penalty, offGuardChance);
    cache.set(key, total);
    return total;
}

function computeHitDamage(attacker, strike, target, critical, penalty, offGuardChance) {
    const context = strikeContext(attacker, strike, critical);
    let total = 0;
    for (const instance of expectedStrikeDamage(strike, { critical, penalty })) {
        let type = strike.concussive ? concussiveType(target, instance.type, instance.amount, instance.precision) : instance.type;
        // (T3: a type it can deal instead — versatile, Phantom Touch — the one this target minds most.)
        if (instance.weapon) type = bestStrikeType(attacker, strike, target, type, instance.amount, instance.precision);
        const amount = adjustPart(target, { ...instance, type }, context);
        // Persistent damage is counted for about two rounds.
        total += instance.persistent ? amount * 2 : amount;
    }
    if (strike.backstabber && offGuardChance > 0) total += offGuardChance * adjustInstance(target, strike.damage[0].type, critical ? 2 : 1, true);
    return total;
}

// An AC reaction for only melee or only ranged attacks ("An adjacent enemy targets the swarm with a Strike", "targeted by a
// physical ranged Strike"; B45).
// (B289, Meat Shield: only while it holds a creature — requires "grabbed".)
const dodges = (reaction, strike, state = null, c = null) => (!reaction.against || (reaction.against === "melee") === Boolean(strike.melee))
    && (reaction.requires !== "grabbed" || Boolean(state?.list?.some((other) => other.grabbedBy === c?.id && (other.cond.grabbed || other.cond.restrained))));

// (M38: harm in a reaction — a Reactive Strike at a creature leaving — doesn't count as refusing its surrender.)
export function performStrike(state, attacker, target, strike, options = {}) {
    if (!options.reaction) {
        const result = strikeOnce(state, attacker, target, strike, options);
        // (Invisibility: it ends once the attack is done.)
        ownHostility(state, attacker);
        return result;
    }
    const before = state.inReaction;
    state.inReaction = true;
    try {
        return strikeOnce(state, attacker, target, strike, options);
    } finally {
        state.inReaction = before;
        ownHostility(state, attacker);
    }
}

function strikeOnce(state, attacker, target, strike, { reaction = false, trigger = null, fortune = false } = {}) {
    if (!strikeUsable(attacker, strike)) return null;
    // (Sanctuary: a save first; stopped, the action is wasted.)
    if (wardBlocks(state, attacker, target)) return null;
    // (U2: a bomb is used up as it's thrown, hit or miss.)
    spendAmmo(attacker, strike);
    // (An attack, hit or miss, is hostility: it ends Calm, and a charm the attacker put on the target.)
    hostility(state, target, attacker);
    // (B255, Generate Bomb: the die picks the row — its damage, the save and conditions a hit brings.)
    if (strike.randomDamage?.length) {
        const face = state.rng.die(strike.randomDie);
        const row = strike.randomDamage.find((entry) => entry.faces.includes(face)) ?? strike.randomDamage[0];
        log(state, `  ${attacker.name} rolls ${face}: ${row.name}`);
        strike = { ...strike, randomDamage: null, critDamage: null, damage: row.damage.length ? row.damage : [{ dice: 0, die: 4, bonus: 0, multiplier: 1, type: "untyped", persistent: false, precision: false }], ...(row.damage.length ? {} : { noDamage: true }), hitSpell: row.hitSpell ?? null, hitName: row.name, hitConditions: row.conditions ?? null };
    }
    // (B164, Mark for Death: deadly on its Strikes against its mark.)
    const mark = attacker.huntPrey;
    if (mark?.edge === "deadly" && attacker.prey === target?.id && !strike.deadly && (!mark.strike || String(strike.name ?? "").toLowerCase().startsWith(mark.strike))) strike = { ...strike, deadly: { dice: 1, die: mark.die } };
    // (B191, Hop-Dodge: a melee Strike at it sent at another of the attacker's side beside both, as it's made.)
    if (!reaction && strike.melee && target.redirectAttack?.when === "targeted" && isActive(target) && canReact(target, target.redirectAttack.name) && canAct(target)) {
        const other = state.list.find((c) => c !== attacker && c !== target && c.side === attacker.side && isActive(c) && sameMelee(c, target) && sameMelee(c, attacker));
        if (other) {
            spendReaction(target, target.redirectAttack.name);
            state.stats.reactions++;
            log(state, `  ${target.name} uses ${target.redirectAttack.name}: the Strike goes to ${other.name}`);
            return performStrike(state, attacker, other, strike, { reaction, trigger, fortune });
        }
    }
    const attacksMade = reaction ? 0 : attacker.attacksThisTurn;
    if (!reaction) attacker.attacksThisTurn++;
    if (!reaction && !strike.melee && attacker.meleeId !== null) {
        provoke(state, attacker, "ranged");
        if (!canAct(attacker)) return null;
        if (!isActive(target)) return null;
    }
    // Superconductor (B84): a creature targeted by an attack Strikes back at the attacker, at any range, before the attack.
    if (!reaction && target.side !== attacker.side && isActive(target)) {
        const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("targeted"));
        if (answer && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing) {
            const back = reactionStrikeAt(state, target, attacker, answer, "targeted");
            if (!isActive(attacker) || !canAct(attacker) || !isActive(target)) return null;
            // (B122, Shoot First: a critical hit disrupts the Strike.)
            if (answer.disrupts && back?.degree >= (answer.disrupts === "critical" ? CRITICAL_SUCCESS : SUCCESS)) {
                log(state, `  ${attacker.name}'s Strike is disrupted`);
                return null;
            }
        }
    }
    let flanked = false;
    // (B302: not All-Around Vision; not Deny Advantage against a flanker of its level or lower.)
    if (strike.melee && flankableBy(target, attacker)) {
        const flankers = flankersAgainst(state, target, attacker);
        // (T1, Gang Up: within reach of it and an ally is enough.)
        const chance = attacker.flanking?.gangUp && flankers >= 2 ? 1 : flankChance(state, flankers);
        if (chance > 0) flanked = state.rng.chance(chance);
    }
    // (B302: off-guard to it by its own passive — Surprise Attack's first round, Dread Striker's frightened target.)
    const surprised = offGuardFrom(state, attacker, target, { melee: strike.melee });
    // Blinded or dazzled: a flat check to find the target first; a concealed or hidden target too (B41). (L1: the light and the weather.)
    // (Truesight: an invisible creature it sees through isn't hidden to it.)
    // (S59, Sure Strike's attack: no flat check for the target being concealed or hidden.)
    const finds = !reaction && attacker.fortuneFinds && (attacker.effects ?? []).some((effect) => effect.model?.fortune?.on === "attack");
    const findDC = Math.max(attacker.cond.blinded ? 11 : attacker.cond.dazzled ? 5 : 0, finds ? 0 : hiddenFrom(state, attacker, target) ? 11 : target.cond?.concealed ? 5 : 0, sightDC(state, attacker, target));
    if (findDC && flatCheck(state.rng, findDC) < SUCCESS) {
        log(state, `  ${attacker.name} ${strike.name} → ${target.name}: fails the DC ${findDC} flat check`);
        // Counterattack (B94): a miss from beside it because it's concealed, a Strike back.
        const answer = !reaction && (target.cond?.concealed || target.cond?.hidden) && (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("concealed-miss"));
        if (answer && isActive(target) && canReact(target, answer.name) && canAct(target) && sameMelee(target, attacker)) reactionStrikeAt(state, target, attacker, answer, "concealed-miss");
        return { degree: FAILURE, damage: 0, trigger };
    }
    // Reactions happen outside the attacker's turn, so this turn's history doesn't apply.
    const history = reaction ? [] : (attacker.turnAttacks ?? []);
    const modifier = attackModifier(state, attacker, target, strike, attacksMade, { history });
    // (L1, L4: off-guard to an attacker it can't see — darkness without darkvision — or one that started its turn hidden, Hidden Movement.)
    const unseenAttacker = unseen(state, target, attacker) || hiddenMovementOffGuard(state, attacker, target);
    // (H1: a party member aiming at a hydra's head it can sever in one hit.)
    const headAimed = !reaction && aimsAtHead(attacker, target, strike, { expectedHitDamage });
    const ac = targetAC(state, attacker, target, strike, flanked || surprised || unseenAttacker);
    // Off-guard to this attack: for Sneak Attack and backstabber.
    const offGuard = flanked || surprised || unseenAttacker || isOffGuard(target) || offGuardTo(target, attacker, strike.melee);
    // A one-attack feint or diversion is used up by this attack.
    const scoped = (target.offGuardTo ?? []).find((entry) => entry.attacker === attacker.id && (entry.attacks !== "melee" || strike.melee) && entry.uses);
    // Spent by this attack; Set-Up Strike's off-guard is shared by the allies and spent by the first (its group).
    if (scoped && --scoped.uses <= 0) target.offGuardTo = target.offGuardTo.filter((entry) => entry !== scoped && (!scoped.group || entry.group !== scoped.group));
    // Hypnotic Tattoos, Venom Spit: its reaction to the Strike, before the roll (B47); one that stops the attacker stops it.
    if (!reaction) {
        reactToAttack(state, target, attacker, strike);
        if (!isActive(attacker) || !canAct(attacker)) return null;
        // Tail Lash, Avenging Bite (B70): a Strike back at a creature that Strikes in its reach, or that attacks its ally.
        const stopped = strikeProvokes(state, attacker, target, strike);
        if (stopped || !isActive(attacker) || !canAct(attacker) || !isActive(target)) return null;
    }
    // Defensive reactions as the attack comes: the attacker rolls twice (Challenge
    // Fate), or +AC (Nimble Dodge); kept for Attacks of Opportunity when it has them.
    let defence = 0;
    // (B228: a lower AC its own reaction cost it against this Strike.)
    if (!reaction && target.pendingAcPenalty) {
        defence -= target.pendingAcPenalty;
        target.pendingAcPenalty = 0;
    }
    let misfortune = false;
    if (target.misfortuneReaction && !target.misfortuneReaction.spell && canReact(target, target.misfortuneReaction.name)) {
        misfortune = true;
        spendReaction(target, target.misfortuneReaction.name);
        log(state, `  ${target.name} uses ${target.misfortuneReaction.name}`);
    } else if (!target.acReaction?.spellOnly && target.acReaction?.when === "targeted" && canReact(target, target.acReaction.name) && !target.reactions?.aoo && dodges(target.acReaction, strike, state, target)) {
        defence = target.acReaction.value;
        spendReaction(target, target.acReaction.name);
        log(state, `  ${target.name} uses ${target.acReaction.name}`);
    }
    // (S54, Sure Strike: its next attack roll twice, the better kept.)
    const own = reaction ? null : takeAttackFortune(attacker);
    if (own) attacker.fortuneFinds = false;
    if (own) log(state, `  ${attacker.name} rolls twice (${own === "higher" ? "the better" : "the worse"} kept)`);
    if (own === "higher") fortune = true;
    else if (own === "lower") misfortune = true;
    // (U11, Gorum's Tear: an attack talisman used now — twice, the better kept, ignoring circumstance penalties.)
    const talisman = !reaction && !fortune && !misfortune && attacker.fortuneItems?.length
        ? attackFortune(state, attacker, target, strike, { modifier, circumstance: circumstancePenalty(state, attacker, target, strike) + (attacker.rollPenalty ?? 0), ac: ac + defence, damage: [expectedHitDamage(attacker, strike, target, false), expectedHitDamage(attacker, strike, target, true)] })
        : null;
    if (talisman) fortune = true;
    // (A fortune Strike, B90: twice, the better; with misfortune too, neither.)
    const roll = () => (misfortune && !fortune ? Math.min(state.rng.d20(), state.rng.d20()) : fortune && !misfortune ? Math.max(state.rng.d20(), state.rng.d20()) : state.rng.d20());
    let natural = roll();
    // (Tail Lash's hit, B70: "the creature takes a –2 circumstance penalty to the triggering roll".)
    // (U11: Gorum's Tear ignores the circumstance penalties — the attack's, and this one.)
    let bonus = reaction ? 0 : -(attacker.rollPenalty ?? 0) + (talisman ? talisman.bonus : 0);
    if (!reaction) attacker.rollPenalty = 0;
    // Taunted: attacking someone other than the guardian costs −1, and leaves it off-guard.
    const taunter = attacker.tauntedBy ? state.byId.get(attacker.tauntedBy) : null;
    if (taunter && isActive(taunter) && taunter.id !== target.id && !reaction) {
        bonus -= 1;
        attacker.cond.offGuard = true;
        (attacker.timers ??= []).push({ key: "offGuard", value: true, round: attacker.round === state.round ? state.round + 1 : state.round, turnOf: attacker.id, at: "start" });
    }
    // Devise a Stratagem: the d20 rolled in advance, and Intelligence, for the first Strike at that creature.
    const stratagem = attacker.stratagem;
    const strategic = !reaction && stratagem && !stratagem.used && stratagem.targetId === target.id && stratagem.round === state.round && (attacker.stratagemFeature?.strikeBonus?.[strike.name] !== undefined);
    if (strategic) {
        natural = stratagem.natural;
        bonus += attacker.stratagemFeature.strikeBonus[strike.name];
        stratagem.used = true;
        log(state, `  ${attacker.name} uses its stratagem (${natural})`);
    }
    let degree = degreeOf(natural + modifier + bonus, ac + defence, natural);
    // (Sacred Defender: a natural 20 against it doesn't improve the result. Keen: a natural 19 that hits is a critical hit.)
    if (natural === 20 && target.noNaturalTwenty) degree = degreeOf(natural + modifier + bonus, ac + defence, 10);
    if (keenCritical(strike, natural, degree)) degree = CRITICAL_SUCCESS;
    // (U11: Gorum's Tear leaves its user off-guard to that creature until its next turn.)
    if (talisman) afterAttackFortune(state, attacker, target, talisman);
    // Hammer Block, Stygian Guardian (B94): an ally's +AC once the attack hits, when that turns it aside (its Strike back after, Reactive
    // Defense's).
    if (degree >= SUCCESS && !reaction) {
        for (const guard of state.list) {
            const entry = guard.allyAcReaction;
            if (!entry || (guard === target && !entry.self) || guard.side !== target.side || !isActive(guard) || !canReact(guard, entry.name) || !canAct(guard) || (entry.ranged && strike.melee)) continue;
            if (guard !== target && (entry.within <= 10 ? !sameMelee(guard, target) : entry.within < 60 && target.band === "far" && guard.band !== "far")) continue;
            const lower = degreeOf(natural + modifier + bonus, ac + defence + entry.value, natural);
            if (lower >= degree) continue;
            degree = lower;
            defence += entry.value;
            spendReaction(guard, entry.name);
            state.stats.reactions++;
            log(state, `  ${guard.name} uses ${entry.name}: ${target.name} +${entry.value} AC`);
            if (entry.strike && sameMelee(guard, attacker) && isActive(attacker)) {
                const index = enemyStrikeIndex(guard, attacker, entry.strike);
                if (index >= 0) performStrike(state, guard, attacker, guard.strikes[index], { reaction: true, trigger: "ally-guarded" });
            }
            break;
        }
    }
    // Retract Body: +AC once the attack hits, when that turns it aside.
    if (degree >= SUCCESS && !target.acReaction?.spellOnly && target.acReaction?.when === "hit" && canReact(target, target.acReaction.name) && dodges(target.acReaction, strike, state, target)) {
        const lower = degreeOf(natural + modifier, ac + target.acReaction.value, natural);
        if (lower < degree) {
            defence = target.acReaction.value;
            degree = lower;
            spendReaction(target, target.acReaction.name);
            log(state, `  ${target.name} uses ${target.acReaction.name}`);
        }
    }
    // Shadow Evade and the like: when the attack hits, its reaction makes the attacker roll a flat check; a failure misses.
    const conceal = target.concealReaction;
    if (degree >= SUCCESS && conceal && (!conceal.ranged || !strike.melee) && canReact(target, conceal.name)) {
        spendReaction(target, conceal.name);
        const flat = state.rng.d20();
        log(state, `  ${target.name} uses ${conceal.name} (${attacker.name}'s flat ${flat} vs DC ${conceal.dc})`);
        if (flat < conceal.dc) degree = FAILURE;
    }
    // Resilient Form and the like: a critical hit on it becomes a normal hit on a flat check.
    const downgrade = target.critDowngrade;
    if (degree === CRITICAL_SUCCESS && downgrade && (Number.isFinite(downgrade.uses) ? downgrade.uses > 0 : canReact(target, downgrade.name))) {
        if (Number.isFinite(downgrade.uses)) downgrade.uses--;
        else spendReaction(target, downgrade.name);
        // (No check, B59: Collapse, Twist Fate; Collapse leaves it immobilized and off-guard until it re-forms.)
        // (B86, Unbidden Thoughts: the attacker's choice, a normal hit or the critical hit and Frightened 2. It keeps the critical hit
        // unless a normal hit's damage is expected to finish the target anyway.)
        if (downgrade.dc == null && downgrade.or && expectedHitDamage(attacker, strike, target, false) < target.hp.value + (target.hp.temp ?? 0)) {
            log(state, `  ${target.name} uses ${downgrade.name}: ${attacker.name} keeps the critical hit and is ${downgrade.or.slug} ${downgrade.or.value}`);
            applyCondition(state, attacker, downgrade.or.slug, downgrade.or.value, null, target);
        } else if (downgrade.dc == null) {
            log(state, `  ${target.name} uses ${downgrade.name}: a normal hit`);
            degree = SUCCESS;
            if (downgrade.collapse) {
                target.cond.immobilized = true;
                target.cond.offGuard = true;
                target.collapsed = true;
            }
        } else {
            const flat = state.rng.d20();
            log(state, `  ${target.name} uses ${downgrade.name} (flat ${flat} vs DC ${downgrade.dc})`);
            if (flat >= downgrade.dc) degree = SUCCESS;
        }
    }
    // (Hero points, 2026-10-15 "when it matters": a missed Strike that would have dropped its target, rerolled — with the first point too,
    // unless the PC is below a third of its Hit Points and keeps its last for Heroic Recovery. Before, only with two points or more.)
    if (degree <= FAILURE && canSpendHero(state, attacker)) {
        const wouldDrop = expectedHitDamage(attacker, strike, target, false) >= target.hp.value + target.hp.temp;
        if (wouldDrop) {
            spendHeroPoint(state, attacker, "its attack");
            natural = roll();
            degree = degreeOf(natural + modifier + bonus, ac + defence, natural);
        }
    }
    // Flash of Brutality (B118): once a day (again after its Ferocity, where it says so), its first hit a critical one.
    if (degree === SUCCESS && !reaction && attacker.critUpgrade && (attacker.critUpgradesUsed ?? 0) < attacker.critUpgrade.uses) {
        degree = CRITICAL_SUCCESS;
        attacker.critUpgradesUsed = (attacker.critUpgradesUsed ?? 0) + 1;
        log(state, `  ${attacker.name} uses ${attacker.critUpgrade.name}: the hit becomes a critical hit`);
    }
    if (!reaction) {
        attacker.turnAttacks ??= [];
        attacker.turnAttacks.push({ strike: strike.name, targetId: target.id, hit: degree >= SUCCESS });
        // Its last Strike, hit or miss, for a follow-up's ("last action was a greatclub Strike that missed", B68).
        attacker.lastStrike = { strike: strike.name, melee: !!strike.melee, targetId: target.id, degree, action: attacker.actionCount ?? 0, round: state.round };
    }
    const label = ["critically misses", "misses", "hits", "critically hits"][degree];
    // (B166, Trick Attack: an effect for its next Strike only — spent by this one, hit or miss, once its damage is counted.)
    const spent = (attacker.effects ?? []).filter((effect) => effect.model?.nextStrike && effect.model.strikeDeltas?.[strike.name]);
    if (degree < SUCCESS) for (const effect of spent) removeEffect(attacker, effect);
    if (degree < SUCCESS) {
        log(state, `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier + bonus} vs AC ${ac + defence}, ${label}`);
        // Energy Shot counts its first three Strikes, hit or miss.
        if (strike.firearm && attacker.energyShotsLeft > 0) attacker.energyShotsLeft--;
        // A bomb that misses (not critically) still splashes the target and those around it.
        if (degree === FAILURE && strike.splashKind === "bomb") splashAround(state, attacker, target, splashOf(strike, rollStrikeDamage(state.rng, strike, { critical: false }), strikeContext(attacker, strike)), { includeTarget: true });
        // (B171, Sidestep, Glide Aside: the attack sent at another of the attacker's side beside it, the attacker rerolling against that one at
        // the same multiple attack penalty.)
        // (B286, Bouncy: when "critical", only a critically failed Strike.)
        if (!reaction && target.redirectAttack && target.redirectAttack.when !== "targeted" && (target.redirectAttack.when !== "critical" || degree === CRITICAL_FAILURE) && isActive(attacker) && isActive(target) && canReact(target, target.redirectAttack.name) && canAct(target)) {
            const other = state.list.find((c) => c !== attacker && c !== target && c.side === attacker.side && isActive(c) && sameMelee(c, target));
            if (other) {
                spendReaction(target, target.redirectAttack.name);
                log(state, `  ${target.name} uses ${target.redirectAttack.name}: the attack goes to ${other.name}`);
                attacker.attacksThisTurn--;
                performStrike(state, attacker, other, strike);
                return { degree, damage: 0, trigger };
            }
        }
        // Opportune Riposte: a Strike back at a foe in reach that critically fails against it.
        if (degree === CRITICAL_FAILURE && !reaction && target.opportuneRiposte && canReact(target, "Opportune Riposte") && sameMelee(target, attacker)) {
            const riposte = bestMeleeStrike(target, attacker);
            if (riposte) {
                spendReaction(target, "Opportune Riposte");
                log(state, `  ${target.name} uses Opportune Riposte`);
                performStrike(state, target, attacker, riposte, { reaction: true });
            }
        }
        // Opportune Bite, Gnawing Retort (B84): a monster's Strike back at a creature in its reach that critically fails a Strike against it;
        // B90: one that fails or critically fails.
        if (!reaction && isActive(attacker) && isActive(target)) {
            const answer = (target.reactionStrikes ?? []).find((entry) => (entry.triggers.includes("critical-miss") && degree === CRITICAL_FAILURE) || entry.triggers.includes("missed"));
            if (answer && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing && sameMelee(target, attacker)) reactionStrikeAt(state, target, attacker, answer, degree === CRITICAL_FAILURE ? "critical-miss" : "missed");
        }
        // (B116, Skitter: a miss on it, answered by moving off.)
        if (!reaction && isActive(attacker) && isActive(target)) withdrawAnswer(state, target, attacker, { melee: !!strike.melee });
        // (B246, Robe Tangle: a plan of its own on a miss.)
        if (!reaction && isActive(attacker) && isActive(target)) reactToMiss(state, target, attacker, strike, degree);
        if (degree === CRITICAL_FAILURE && !reaction && attacker.weaponPoisoned && strike.held) attacker.weaponPoisoned = false;
        // Jeer at Failure (B85): a critically failed Strike near a monster with it.
        if (degree === CRITICAL_FAILURE && !reaction) mishapAnswers(state, attacker, target);
        return { degree, damage: 0, trigger };
    }
    // (Poison Weapon, B72: the poison goes with this hit, below; a critical miss wastes it.)
    // A hazard's or an object's immunity to critical hits: a hit's damage.
    const critical = degree === CRITICAL_SUCCESS && !target.immunities?.includes("critical-hits");
    // A hit on its own turn, for Strike, Breathe, Rend's "last action was a successful Strike" (C26).
    if (!reaction) attacker.lastHit = { strike: strike.name, targetId: target.id, action: attacker.actionCount ?? 0, round: state.round };
    const earlier = history.filter((entry) => entry.strike === strike.name).length;
    // (2026-10-15: an effect's conditional damage — unarmed Strikes' extra dice, melee ones', against a trait.)
    const damageOptions = hasConditional(attacker) ? strikeRollOptions(attacker, strike, target, strikeContext(attacker, strike)) : null;
    const penalty = (strike.melee ? attacker.cond.enfeebled : 0) - forcefulBonus(strike, earlier) - effectBonus(attacker, "damage", damageOptions);
    const instances = rollStrikeDamage(state.rng, strike, { critical, penalty });
    if (strike.backstabber && offGuard) {
        instances.push({ type: strike.damage[0].type, amount: critical ? 2 : 1, precision: true, persistent: false });
    }
    // Class features: Sneak Attack's off-guard dice, Rage, the Precision edge.
    const firstPreyHit = attacker.preyHitRound !== state.round;
    const parts = featureParts(attacker, strike, target, { offGuard: offGuard ? 1 : 0, firstPreyHit });
    for (const effect of spent) removeEffect(attacker, effect);
    if (strike.firearm) {
        attacker.firstShotReady = 0;
        if (attacker.energyShotsLeft > 0) attacker.energyShotsLeft--;
    }
    if (strategic) parts.push({ dice: attacker.stratagemFeature.dice ?? 1, die: 6, bonus: 0, type: strike.damage[0].type, precision: true });
    for (const part of parts) {
        let amount = part.bonus ?? 0;
        for (let die = 0; die < (part.dice ?? 0); die++) amount += state.rng.die(part.die);
        instances.push({ type: part.type ?? strike.damage[0].type, amount: Math.max(0, critical && !part.noCrit ? amount * 2 : amount), precision: !!part.precision, persistent: !!part.persistent });
    }
    // (B309, twin: another attack with the pair this turn — a bonus of its damage dice.)
    if (strike.twin && (attacker.turnAttacks ?? []).filter((entry) => entry.strike === strike.name).length >= 2) instances.push({ type: strike.damage[0].type, amount: strike.damage[0].dice ?? 1, precision: false, persistent: false });
    if (attacker.huntPrey?.edge === "precision" && attacker.prey === target.id) attacker.preyHitRound = state.round;
    // Sneak Attack, Pack Attack and the like (monsters).
    if (attacker.strikeExtras?.length) {
        const packAllies = engagedEnemies(state, target).filter((other) => other !== attacker).length;
        for (const extra of attacker.strikeExtras) {
            if (!extraApplies(extra, target, { offGuard, packAllies, attacker })) continue;
            let amount = extra.bonus ?? 0;
            for (let die = 0; die < extra.dice; die++) amount += state.rng.die(extra.die);
            instances.push({ type: extra.type ?? strike.damage[0].type, amount: critical ? amount * 2 : amount, precision: !!extra.precision, persistent: false });
        }
    }
    // (B153, Draining Touch: a Strike that deals no damage on a hit.)
    if (strike.noDamage) instances.length = 0;
    if (strike.concussive) for (const instance of instances) instance.type = concussiveType(target, instance.type, instance.amount, instance.precision);
    for (const instance of instances) if (instance.weapon) instance.type = bestStrikeType(attacker, strike, target, instance.type, instance.amount, instance.precision);
    // (T5: an elemental dragon's jaws countered — without their energy — or fed, a die more.)
    if (/\bjaws\b/i.test(strike.name ?? "")) {
        for (const effect of attacker.effects ?? []) {
            if (effect.model.jawsLose) for (let index = instances.length - 1; index >= 0; index--) if (instances[index].type === effect.model.jawsLose) instances.splice(index, 1);
            const part = effect.model.jawsDie ? strike.damage.find((entry) => entry.type === effect.model.jawsDie && entry.die) : null;
            if (part) instances.push({ type: part.type, amount: state.rng.die(part.die) * (critical ? 2 : 1), persistent: false, precision: false });
        }
    }
    // (B309, I2: the Strike's context on its damage — a holy Strike on a fiend weak to holy, a silver one on a werewolf.)
    const context = strikeContext(attacker, strike, critical);
    for (const instance of instances) instance.context = context;
    // Wished Away, Withhold Death (B60): its reaction to the critical hit, resistance to all damage against this attack.
    const before = target.resistances;
    if (critical && target.critResistance && canReact(target, target.critResistance.name)) {
        spendReaction(target, target.critResistance.name);
        target.resistances = [...(before ?? []), { type: "all-damage", value: target.critResistance.value, exceptions: [] }];
        log(state, `  ${target.name} uses ${target.critResistance.name}: resistance ${target.critResistance.value} against the attack`);
    }
    // Logged before the damage so consequences (Shield Block, going down) follow it.
    const line = state.log ? state.log.push("") - 1 : -1;
    // (H1: a hit aimed at one of a hydra's heads — on the head, not its body.)
    const dealt = headAimed ? strikeHead(state, attacker, target, instances, { adjustDamage, killCreature: kill }) : applyDamage(state, target, instances, {
        source: attacker,
        critical,
        nonlethal: strike.nonlethal || nonlethalAgainst(state, attacker, target),
        physical: true
    });
    target.resistances = before;
    if (line >= 0) state.log[line] = `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier + bonus} vs AC ${ac + defence}, ${label} for ${dealt} (${target.name} ${Math.max(0, target.hp.value)}/${target.hp.max})`;
    // (T1, T6: a critical hit's rider — Brutal Beating's — and its weapon group's critical specialization.)
    if (critical && attacker.critRider) critRiderAnswer(state, attacker, target, { applyCondition, applyMove });
    if (critical) critSpecEffect(state, attacker, target, strike, natural + modifier + bonus, { applyCondition, applyMove, applyDamage, rollDie: (size) => state.rng.die(size) });
    // (Its weapon's runes on a critical hit: frost's slowed, brilliant's blinded, fearsome's frightened …)
    if (critical) runeCritEffects(state, attacker, target, strike, { applyCondition, applyMove });
    // (C32, Battle Cry: legendary in Intimidation, its reaction to Demoralize the creature it critically hit.)
    if (critical && !reaction && attacker.battleCry?.reaction && isActive(target)) demoralize(state, attacker, target, { castPlan, reaction: true });
    // (T4: attached to a larger creature it hits.)
    if (attacker.attach && isActive(attacker)) attachAfterHit(state, attacker, target, sizeRank);
    // A bomb's or a scatter weapon's splash on the creatures around the target, allies too.
    if (strike.splashKind) splashAround(state, attacker, target, splashOf(strike, instances, strikeContext(attacker, strike)), { includeTarget: false });
    // (B255: a table row's conditions and save on the creature hit.)
    for (const { slug, value, duration } of strike.hitConditions ?? []) if (isActive(target) && applyCondition(state, target, slug, value ?? null, duration ?? null, attacker)) log(state, `  ${target.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""}`);
    if (strike.hitSpell && isActive(target)) castPlan(state, attacker, { name: strike.hitName ?? strike.name, plan: strike.hitSpell, castRank: 1, pool: null, kind: "ability" }, [target.id]);
    // Draconic Momentum: a critical hit recharges the breath weapon.
    if (critical && attacker.momentum && !attacker.suppressMomentum) rechargeOnCritical(state, attacker);
    // Grab, Knockdown and Push follow a hit (free ones at once, the others as the next action).
    if (!reaction && isActive(target)) state.onStrikeHit?.(attacker, target, strike, degree);
    // Blood Frenzy, Hungry Rage (B65): bleed damage it deals to a living creature, its named Strike's damage on one.
    if (dealt > 0 && isActive(attacker) && !["undead", "construct"].some((trait) => (target.traits ?? []).includes(trait))) {
        const bleeds = instances.some((instance) => instance.type === "bleed" && instance.amount > 0);
        const name = String(strike.name ?? "").toLowerCase();
        triggeredSelfEffect(state, attacker, (trigger) => (trigger.kind === "deals-bleed" && bleeds) || (trigger.kind === "own-hit" && (name === trigger.strike || name.startsWith(trigger.strike))));
    }
    // Defensive Quills, Searing Heat: the monster's passive answers a melee hit on it (B43).
    const dealtTypes = dealt > 0 ? instances.map((instance) => instance.type) : [];
    if (isActive(attacker)) hitByAnswers(state, target, attacker, strike, degree, dealtTypes);
    // Shrapnel Splash, Reactive Thrash: the monster's reaction to the hit (B44).
    if (isActive(attacker)) reactToHit(state, target, attacker, strike, degree, dealtTypes);
    // Pin Prey, Storm Smite: the attacker's reaction to its own hit (B47).
    if (isActive(attacker)) reactToOwnHit(state, attacker, target, strike, degree, { offGuard });
    // Poison Weapon (B72): a weapon Strike that hits and deals damage delivers the poison on it.
    if (!reaction && attacker.weaponPoisoned && strike.held && dealt > 0 && isActive(target) && attacker.poisonWeapon) {
        attacker.weaponPoisoned = false;
        state.onPoison?.(attacker, target);
    }
    // (B236, Swift Claw: its second hit this turn with the Strike it names on the same creature — its other Strike at it, outside its multiple attack
    // penalty.)
    if (degree >= SUCCESS && !reaction && isActive(attacker) && isActive(target) && canReact(attacker, "*") && canAct(attacker)) {
        const twice = (attacker.turnAttacks ?? []).filter((entry) => entry.targetId === target.id && entry.hit && entry.strike === strike.name).length === 2;
        const answer = twice ? (attacker.reactionStrikes ?? []).find((entry) => entry.triggers.includes("two-hits") && String(strike.name ?? "").toLowerCase().includes(entry.after ?? "")) : null;
        if (answer) {
            const attacks = attacker.attacksThisTurn;
            attacker.attacksThisTurn = 0;
            reactionStrikeAt(state, attacker, target, answer, "two-hits");
            attacker.attacksThisTurn = attacks;
        }
    }
    // (B114, Opportune Backstab: a melee hit by one of its allies on a creature in its reach, followed by its own Strike at that creature.)
    if (degree >= SUCCESS && !reaction && strike.melee && isActive(attacker) && isActive(target)) {
        // (B228, Deadly Duo: only after another of its kind's Strike of that name, and one answer to it.)
        const kind = (c) => String(c.name ?? "").toLowerCase().replace(/\s*\(\d+\)$|\s+\d+$/, "");
        let kinAnswered = false;
        for (const ally of state.list) {
            if (ally === attacker || ally.side !== attacker.side || !isActive(ally) || !isActive(target)) continue;
            const answer = (ally.reactionStrikes ?? []).find((entry) => entry.triggers.includes("ally-hit") && (!entry.kin || (!kinAnswered && kind(ally) === kind(attacker))) && (!entry.allyStrike || String(strike.name ?? "").toLowerCase().includes(entry.allyStrike)));
            if (answer && canReact(ally, answer.name) && canAct(ally) && !ally.cond.fleeing && sameMelee(ally, target)) {
                reactionStrikeAt(state, ally, target, answer, "ally-hit");
                if (answer.kin) kinAnswered = true;
            }
        }
    }
    // (B111, Absorb Weapon, Sticky: a melee hit on it, answered — with a maneuver.)
    if (degree >= SUCCESS && !reaction && strike.melee && isActive(attacker) && isActive(target)) {
        // (B129, Reactive Splash: only an attack of the damage types it names.)
        const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("hit") && strikeOfTypes(strike, entry.damageTypes));
        if (answer && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing && sameMelee(target, attacker)) reactionStrikeAt(state, target, attacker, answer, "hit");
    }
    // (B286, Conductive Shell: while its effect lasts, a creature that hits it in melee takes the damage it names.)
    if (degree >= SUCCESS && strike.melee && isActive(attacker)) {
        for (const effect of (target.effects ?? []).filter((entry) => entry.model?.hitBack)) {
            log(state, `  ${attacker.name} is hurt by ${target.name}'s ${effect.model.name ?? effect.name}`);
            applyDamage(state, attacker, rollInstances(state, parseDamage(effect.model.hitBack)), { source: target });
            if (!isActive(attacker)) break;
        }
    }
    // Violent Retort (B70): a critical hit on it, answered with a Strike.
    if (degree === CRITICAL_SUCCESS && !reaction && isActive(attacker) && isActive(target)) {
        const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("critical-hit"));
        if (answer && canReact(target, answer.name) && !target.cond.fleeing && sameMelee(target, attacker)) reactionStrikeAt(state, target, attacker, answer);
    }
    // Wing Thrash (B81): an adjacent enemy that damages it with a Strike, a Strike back, and one at another adjacent foe.
    if (dealt > 0 && !reaction && strike.melee && isActive(attacker) && isActive(target)) {
        // (B129, Reactive Gnaw: only damage of the type it names.)
        const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("damaged-adjacent") && strikeOfTypes(strike, entry.damageTypes));
        if (answer && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing && sameMelee(target, attacker)) {
            reactionStrikeAt(state, target, attacker, answer);
            const other = answer.second ? engagedEnemies(state, target).find((foe) => foe !== attacker) : null;
            const index = other ? strikeNamed(target, answer.strike) : -1;
            if (other && index >= 0 && isActive(target) && canAct(target)) performStrike(state, target, other, target.strikes[index], { reaction: true });
        }
    }
    // (B121, Avenging Claws: a melee hit that damages one of its allies, by a creature within its reach or a Step of it: a Step and a Strike.)
    if (dealt > 0 && !reaction && strike.melee && isActive(attacker) && isActive(target)) {
        for (const ally of state.list) {
            if (ally === target || ally.side !== target.side || !isActive(ally) || !isActive(attacker)) continue;
            const answer = (ally.reactionStrikes ?? []).find((entry) => entry.triggers.includes("ally-damaged"));
            if (!answer || !canReact(ally, answer.name) || !canAct(ally) || ally.cond.fleeing || !(sameMelee(ally, attacker) || (answer.step && sameMelee(ally, target) && canMove(ally)))) continue;
            reactionStrikeAt(state, ally, attacker, answer, "ally-damaged");
        }
    }
    // (B121, Vengeful Throw: damage from a creature away from its Melee, a ranged Strike back.)
    if (dealt > 0 && !reaction && isActive(attacker) && isActive(target) && !sameMelee(target, attacker)) {
        const answer = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("damaged-far"));
        if (answer && canReact(target, answer.name) && canAct(target) && !target.cond.fleeing) reactionStrikeAt(state, target, attacker, answer, "damaged-far");
    }
    // (B118, Hellish Revenge, Spitting Rage: a critical hit on it, its breath recharged and used at once.)
    if (critical && !reaction && target.critRecharge && isActive(target)) critRechargeAnswer(state, target);
    // (B116, Skittish, Bolt: a hit on it, or its damage, answered by moving off.)
    if (!reaction && isActive(attacker) && isActive(target)) withdrawAnswer(state, target, attacker, { melee: !!strike.melee, hit: true, dealt, strike });
    return { degree, damage: dealt, trigger };
}

// Skitter, Skittish, Bolt, Scurry, Flit Back (B116): a reaction that moves it off, out of the Melee it shares with the foe — while that
// foe still has actions to spend this turn (or it fights from range, or it's fleeing), and not while it holds a creature. A Step, or a move
// that "doesn't trigger reactions", provokes nothing; another Stride or a flight is a move out of the Melee.
export function withdrawAnswer(state, c, from, { melee = true, hit = false, dealt = 0, approach = false, strike = null } = {}) {
    const rule = c.withdraw;
    if (!rule || !canReact(c, rule.name) || !canAct(c) || !canMove(c) || !sameMelee(c, from)) return false;
    // (B135, Crumble: not again until it recharges.)
    if (rule.recharge && (c.withdrawUntil ?? -Infinity) > state.round) return false;
    const fits = approach
        ? rule.on === "approach" && (!rule.foe || rule.foe.some((slug) => from.cond[slug]))
        : (!rule.melee || melee) && (rule.on === "attacked" || (rule.on === "hit" && hit) || (rule.on === "missed" && !hit) || (rule.on === "damaged" && dealt > 0))
            // (B308: only a holy Strike's damage, Instinctive Teleportation.)
            && (!rule.damageTrait || Boolean(strike?.[rule.damageTrait]));
    if (!fits) return false;
    const ranged = (c.strikes ?? []).some((strike) => !strike.melee && strikeUsable(c, strike));
    const foeActing = state.acting === from.id && (from.actionsLeft ?? 0) > 0;
    if ((!foeActing && !ranged && !c.cond.fleeing) || state.list.some((other) => other.grabbedBy === c.id)) return false;
    spendReaction(c, rule.name);
    if (rule.recharge) c.withdrawUntil = state.round + rollCount(state, rule.recharge);
    log(state, `  ${c.name} uses ${rule.name}`);
    if (rule.safe) {
        releaseGrabs(state, c);
        leaveMelee(state, c, "near");
    } else stride(state, c, { kind: "toNear" });
    return true;
}

// A reaction Strike (Twisting Tail, Tail Lash, Avenging Bite): its named Strike at the creature, at its penalty; its hit can
// hinder the creature's own roll (B70). The result, or null when it has no such Strike.
// A Strike by its name, or its best melee Strike for "melee" or none.
function enemyStrikeIndex(enemy, mover, name) {
    const any = !name || /^(?:melee|weapon|unarmed)$/i.test(name);
    return any ? enemy.strikes.indexOf(bestMeleeStrike(enemy, mover)) : strikeNamed(enemy, name);
}

// A Strike that deals one of these damage types (any when none are named).
function strikeOfTypes(strike, types) {
    return !types?.length || (strike?.damage ?? []).some((part) => types.includes(part.type));
}

// A Strike at the creature its maneuver was at (B146: Noble's Ruse's "On a success, the noble Strikes the target", Bully's Shove then a tentacle
// Strike at the same multiple attack penalty, Sacrificial Takedown's fatal d10 after a Trip that succeeds, Distracting Trick's precision dice
// after a Feint that succeeds, Terrorizing Swing's 2d10 and Prone at a Frightened creature it damages). then: { strike, onSuccess, sameMap,
// follow, fatal, successDamage, ifFrightened }.
export function followUpStrike(state, c, target, then, degree) {
    if (!then || !isActive(c) || !canAct(c) || !isActive(target) || target.side === c.side) return null;
    const success = degree === "success" || degree === "criticalSuccess";
    if (then.onSuccess && !success) return null;
    const index = enemyStrikeIndex(c, target, then.strike);
    const base = index >= 0 ? c.strikes[index] : null;
    if (!base || !strikeUsable(c, base)) return null;
    // (Bully: "Strides after it into the nearest adjacent square if successful".)
    if (base.melee && !sameMelee(c, target)) {
        if (!(then.follow && success && canMove(c))) return null;
        engage(state, c, target);
        log(state, `  ${c.name} Strides after ${target.name}`);
    }
    const strike = then.fatal ? chargeStrike(base, { name: "follow-up", fatal: then.fatal }) : base;
    const before = c.attacksThisTurn;
    if (then.sameMap) c.attacksThisTurn = Math.max(0, before - 1);
    const frightened = (target.cond.frightened ?? 0) > 0;
    const hpBefore = target.hp.value;
    const result = performStrike(state, c, target, strike);
    if (then.sameMap) c.attacksThisTurn = before + 1;
    const hit = (result?.degree ?? 0) >= SUCCESS;
    const dealt = hit && target.hp.value < hpBefore;
    const type = base.damage?.[0]?.type ?? "untyped";
    if (hit && success && then.successDamage && isActive(target)) {
        const dice = /^(\d+d\d+)/.exec(then.successDamage)?.[1] ?? "1d6";
        const extra = applyDamage(state, target, [{ type, amount: rollCount(state, dice), persistent: false, precision: /precision/.test(then.successDamage) }], { source: c });
        log(state, `  ${target.name} takes ${extra} more from the feint`);
    }
    if (dealt && frightened && then.ifFrightened && isActive(target)) {
        const extra = applyDamage(state, target, [{ type, amount: rollCount(state, then.ifFrightened.damage ?? "2d10"), persistent: false }], { source: c });
        log(state, `  ${target.name} takes ${extra} more while frightened`);
        if (then.ifFrightened.prone && isActive(target)) applyCondition(state, target, "prone", null, null, c);
    }
    return result;
}

export function reactionStrikeAt(state, enemy, mover, reaction, kind = null) {
    // (B308, Twin Riposte: only while the stance it names is on it.)
    if (reaction.requiresEffect && !hasOwnEffect(enemy, reaction.requiresEffect)) return null;
    // (B111, Ripping Disarm: its own basic action at the creature, with the reaction's penalty or bonus on the check.)
    if (reaction.skill) {
        const basic = (enemy.spells ?? []).find((spell) => spell.kind === "basic" && (spell.plan?.source?.slug === reaction.skill || String(spell.name ?? "").toLowerCase() === reaction.skill));
        if (!basic?.plan?.resolution?.check || !isActive(mover)) return null;
        spendReaction(enemy, reaction.name);
        state.stats.reactions++;
        log(state, `  ${enemy.name} uses ${reaction.name}`);
        const shift = (reaction.bonus ?? 0) - (reaction.penalty ?? 0);
        const plan = shift ? { ...basic.plan, resolution: { ...basic.plan.resolution, check: { ...basic.plan.resolution.check, bonus: { value: (Number(basic.plan.resolution.check.bonus?.value) || 0) + shift, type: "circumstance" } } } } : basic.plan;
        // (Not on its turn: no multiple attack penalty, and its own count left as it was.)
        const attacks = enemy.attacksThisTurn;
        enemy.attacksThisTurn = 0;
        castPlan(state, enemy, { ...basic, name: reaction.name, plan }, [mover.id]);
        enemy.attacksThisTurn = attacks;
        return { degree: null };
    }
    // (A "melee Strike" with no name, B90: its best melee Strike.)
    // (B121, Vengeful Throw: a ranged Strike by that name — the thrown spear, not the one in hand.)
    const ranged = reaction.ranged ? (enemy.strikes ?? []).findIndex((strike) => !strike.melee && String(strike.name ?? "").toLowerCase().includes(String(reaction.strike ?? ""))) : -1;
    const index = reaction.ranged ? ranged : enemyStrikeIndex(enemy, mover, reaction.strike);
    if (index < 0 || !strikeUsable(enemy, enemy.strikes[index])) return null;
    spendReaction(enemy, reaction.name);
    state.stats.reactions++;
    log(state, `  ${enemy.name} uses ${reaction.name}`);
    // (B121, Avenging Claws: a Step to the creature first.)
    if (reaction.step && !sameMelee(enemy, mover)) {
        releaseGrabs(state, enemy);
        engage(state, enemy, mover);
        log(state, `  ${enemy.name} ${reaction.teleport ? "teleports" : "Steps"} to ${mover.name}`);
    }
    const base = enemy.strikes[index];
    // (B121, Retaliatory Strike: its extra dice on a hit, a part of the Strike's damage.)
    const extra = /^(\d+)d(\d+)$/.exec(String(reaction.extraDamage ?? ""));
    const extended = extra ? { ...base, damage: [...base.damage, { dice: Number(extra[1]), die: Number(extra[2]), bonus: 0, type: base.damage[0]?.type ?? "untyped" }] } : base;
    // (B129, Vengeful Sting: "+2 bonus on the damage roll if the Strike hits".)
    const strike = reaction.damageBonus && extended.damage?.length ? { ...extended, damage: extended.damage.map((part, index) => (index === 0 ? { ...part, bonus: (part.bonus ?? 0) + reaction.damageBonus } : part)) } : extended;
    const result = performStrike(state, enemy, mover, reaction.penalty ? { ...strike, bonus: strike.bonus - reaction.penalty } : strike, { reaction: true, trigger: kind, fortune: !!reaction.fortune });
    if (reaction.hinders && result?.degree >= SUCCESS) mover.rollPenalty = (mover.rollPenalty ?? 0) + reaction.hinders;
    // (B207, Repartee Riposte: Frightened 1 on a hit, 2 on a critical hit.)
    if (reaction.onHit && result?.degree >= SUCCESS && isActive(mover)) {
        const critical = result.degree === CRITICAL_SUCCESS && reaction.onHit.critical?.length;
        for (const entry of critical ? reaction.onHit.critical : reaction.onHit.conditions ?? []) {
            // (B227, Lashing Kick: Stomp on Shadow's conditions until its next turn — their durations.)
            if (applyCondition(state, mover, entry.slug, entry.value ?? null, entry.duration ?? null, enemy)) log(state, `  ${mover.name} is ${entry.slug}${Number.isFinite(entry.value) ? ` ${entry.value}` : ""}`);
        }
    }
    // (B123, Quick Capture: "If it hits, the creature is Grabbed in that leaf.")
    if (reaction.grab && result?.degree >= SUCCESS && isActive(mover) && isActive(enemy)) applyCondition(state, mover, "grabbed", null, { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" }, enemy);
    return result;
}

// A creature ending its turn in its Melee (B82: Biting Snakes' "A creature ends its turn adjacent to the medusa"): its Strike at it.
export function turnEndAnswers(state, c) {
    for (const enemy of engagedEnemies(state, c)) {
        if (!isActive(c)) break;
        if (!canReact(enemy, "*") || !canAct(enemy) || enemy.cond.fleeing) continue;
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes("turn-end-adjacent"));
        if (reaction) reactionStrikeAt(state, enemy, c, reaction, "turn-end");
    }
}

// A creature starting its turn in its Melee (B245, Whirling Hands: "A creature starts its turn in the capritellix's melee reach"): its Strike at it;
// a free action's leaves its reaction.
export function turnStartAnswers(state, c) {
    for (const enemy of engagedEnemies(state, c)) {
        if (!isActive(c)) break;
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes("turn-start-adjacent"));
        if (!reaction || !(reaction.free || canReact(enemy, reaction.name)) || !canAct(enemy) || enemy.cond.fleeing) continue;
        const used = reactionMark(enemy);
        reactionStrikeAt(state, enemy, c, reaction, "turn-start");
        if (reaction.free) restoreReaction(enemy, used);
    }
}

// A creature coming into its reach (B81: Telekinetic Defense's "approaches within 10 feet", Wing Rebuff's "moves … to within the reach of
// the roc's wing"): as it engages, each enemy in that Melee with the reaction Strikes it.
function approachAnswers(state, mover) {
    for (const enemy of engagedEnemies(state, mover)) {
        if (!canAct(mover) || !isActive(mover)) break;
        if (!canReact(enemy, "*") || enemy.cond.fleeing) continue;
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes("approach"));
        if (reaction) reactionStrikeAt(state, enemy, mover, reaction, "approach");
    }
}

// A Strike in its reach (Tail Lash) or an attack on its ally (Avenging Bite), B70: the reactions that answer it.
// (B227: a ranged attack at it from outside its Melee, a Demoralize back from 30 feet — the bands, as a trigger's.)
function rangedProvokes(state, mover, target, strike) {
    if (!strike || strike.melee || target === mover || target.side === mover.side || sameMelee(target, mover) || !isActive(target) || !canReact(target, "*") || target.cond.fleeing) return;
    if (mover.band === "far" && target.band !== "far") return;
    const reaction = (target.reactionStrikes ?? []).find((entry) => entry.triggers.includes("attacked") && entry.rangedAttack);
    if (reaction) reactionStrikeAt(state, target, mover, reaction, "strike");
}

function strikeProvokes(state, mover, target, strike = null) {
    rangedProvokes(state, mover, target, strike);
    for (const enemy of engagedEnemies(state, mover)) {
        if (!canAct(mover) || !isActive(mover)) break;
        if (!canReact(enemy, "*") || enemy.cond.fleeing) continue;
        // (Cutting Rebuke, Bite Back, B84: a Strike at it.)
        // (B122: Knowing Glance's "targeted by a melee Strike": melee ones only.)
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes("strike") || (entry.triggers.includes("ally-attacked") && target !== enemy && target.side === enemy.side) || (entry.triggers.includes("attacked") && target === enemy && (!entry.melee || !strike || strike.melee) && (!entry.rangedAttack || (strike && !strike.melee))));
        // (B228, Endangering Lunge: its AC lower against the Strike that set it off.)
        if (reaction?.selfAcPenalty && enemy === target && canReact(enemy, reaction.name)) target.pendingAcPenalty = reaction.selfAcPenalty;
        const result = reaction ? reactionStrikeAt(state, enemy, mover, reaction, "strike") : null;
        // (B123, Wrappings Lash: a critical hit disrupts the Strike.)
        if (reaction?.disrupts && result?.degree >= (reaction.disrupts === "critical" ? CRITICAL_SUCCESS : SUCCESS)) {
            log(state, `  ${mover.name}'s Strike is disrupted`);
            return true;
        }
    }
    return false;
}

// Spell Interception (B122): a creature casting a spell in its Melee, its Strike at it; a hit disrupts the spell. Whether the spell is
// disrupted.
export function castAnswers(state, caster) {
    let disrupted = false;
    for (const enemy of engagedEnemies(state, caster)) {
        if (!canAct(caster) || !isActive(caster)) break;
        if (!canReact(enemy, "*") || !canAct(enemy) || enemy.cond.fleeing) continue;
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes("cast"));
        const result = reaction ? reactionStrikeAt(state, enemy, caster, reaction, "cast") : null;
        if (reaction?.disrupts && result?.degree >= (reaction.disrupts === "critical" ? CRITICAL_SUCCESS : SUCCESS)) disrupted = true;
    }
    return disrupted;
}

// A rage or frenzy its trigger sets off (B65): once a fight (it ends fatigued), the reaction spent when it's one.
function triggeredSelfEffect(state, c, matches) {
    for (const entry of c.selfEffects ?? []) {
        if (!entry.trigger || !matches(entry.trigger) || c.buffsUsed?.has(entry.name)) continue;
        if (entry.trigger.reaction && !canReact(c, entry.name)) continue;
        if (entry.trigger.reaction) spendReaction(c, entry.name);
        c.buffsUsed = new Set([...(c.buffsUsed ?? []), entry.name]);
        applyEffect(state, c, entry.model, c, { key: `self:${entry.name}` });
        log(state, `  ${c.name} uses ${entry.name}`);
        // (B220, Blood Fury: Hit Points back with it.)
        if (entry.heal > 0 && isActive(c)) {
            const before = c.hp.value;
            c.hp.value = Math.min(c.hp.max, c.hp.value + entry.heal);
            if (c.hp.value > before) log(state, `  ${c.name} regains ${c.hp.value - before} HP`);
        }
    }
}

// A Strike's splash: its known amount (the snapshot reads it from the item), or its parts flagged splash.
// (I2: in the Strike's context, for a swarm's weakness to splash damage.)
const splashOf = (strike, instances, context = null) => (strike.splashAmount ? [{ type: strike.damage[0]?.type ?? "untyped", amount: strike.splashAmount, persistent: false, precision: false, splash: true }] : instances.filter((instance) => instance.splash)).map((instance) => ({ ...instance, weapon: false, context }));

// Splash damage (the instances flagged splash) on the creatures in the target's
// Melee (within the splash's few feet in range bands), and the target itself after a bomb's miss.
function splashAround(state, attacker, target, splash, { includeTarget }) {
    if (!splash.length || target.meleeId === null || target.meleeId === undefined) {
        if (includeTarget && splash.length && isActive(target)) applyDamage(state, target, splash.map((instance) => ({ ...instance })), { source: attacker });
        return;
    }
    const around = state.list.filter((other) => isActive(other) && other.meleeId === target.meleeId && (includeTarget || other !== target));
    for (const other of around) {
        const dealt = applyDamage(state, other, splash.map((instance) => ({ ...instance })), { source: attacker });
        if (dealt > 0) log(state, `  ${other.name} takes ${dealt} splash (${Math.max(0, other.hp.value)}/${other.hp.max})`);
    }
}

// Hellish Revenge, Spitting Rage (B118): a critical hit on it recharges the ability it names and it uses it at once, as the reaction, at
// the best targets for it now (state.onReactionCast). Spent only when the recharge or the use is worth something; Spitting Rage's not
// again until the ability's own recharge has run out.
function critRechargeAnswer(state, c) {
    const rule = c.critRecharge;
    if (!canReact(c, rule.name) || !canAct(c) || (rule.untilNatural && (c.round ?? 0) < (c.critRechargeBlockedUntil ?? -Infinity))) return;
    // (The ability, or its ways: "Breathe Energy (Acid Maw)", their rechargeGroup "Breathe Energy".)
    const named = rule.recharges.toLowerCase();
    const indices = (c.spells ?? []).map((spell, index) => (String(spell.rechargeGroup ?? spell.name ?? spell.plan?.source?.name ?? "").toLowerCase() === named ? index : -1)).filter((index) => index >= 0);
    if (!indices.length) return;
    const key = c.spells[indices[0]].rechargeGroup ?? c.spells[indices[0]];
    const recharging = (c.rechargeUntil?.get(key) ?? -Infinity) > (c.round ?? 0);
    const before = recharging ? c.rechargeUntil.get(key) : null;
    if (recharging) c.rechargeUntil.delete(key);
    const pick = state.pickCastNow?.(c, indices) ?? null;
    if (!recharging && !pick) return;
    spendReaction(c, rule.name);
    state.stats.reactions++;
    log(state, `  ${c.name} uses ${rule.name}${recharging ? `: ${rule.recharges} recharges` : ""}`);
    if (pick) castSpell(state, c, pick.spellIndex, pick.targetIds, pick.actions);
    if (rule.untilNatural) c.critRechargeBlockedUntil = c.rechargeUntil?.get(key) ?? before ?? -Infinity;
}

// (T5, Fed by Wood: the ability it names recharges.)
function rechargeNamed(c, name) {
    for (const key of [...(c.rechargeUntil?.keys() ?? [])]) if (String(typeof key === "string" ? key : key.name).toLowerCase() === String(name).toLowerCase()) c.rechargeUntil.delete(key);
}

function rechargeOnCritical(state, c) {
    if (!c.rechargeUntil?.size) return;
    const names = (c.momentum.recharges ?? []).map((name) => name.toLowerCase());
    // A key is the ability, or the name its ways share (rechargeGroup).
    for (const key of [...c.rechargeUntil.keys()]) {
        const name = typeof key === "string" ? key : key.name;
        if (names.length && !names.includes(String(name).toLowerCase())) continue;
        c.rechargeUntil.delete(key);
        log(state, `  ${c.name}'s ${name} recharges`);
    }
}

function shouldShieldBlock(defender, total) {
    const shield = defender.shield;
    if (!shield || shield.broken || !shield.raised) return false;
    // (Shield, the spell: Shield Block with it, without the feat.)
    if (!(defender.reactions?.shieldBlock || shield.spell) || !canReact(defender, "Shield Block")) return false;
    // Not worth the reaction for a hit the shield would mostly ignore anyway.
    if (total < Math.max(1, shield.hardness)) return false;
    const taken = Math.max(0, total - shield.hardness);
    if (shield.hp - taken > shield.bt) return true;
    return total >= defender.hp.value + defender.hp.temp;
}

// Whether a monster's guard (B124) takes this damage for the creature: its ward (the boss, master or ward its text names: its highest-level
// ally) or any ally, beside it (or within 15 feet for Interposition's Stride); a Strike's damage only where it says so. For any ally, only
// when the ally would drop or is the more hurt of the two.
function guards(state, c, target, { physical = false, critical = false } = {}) {
    const rule = c.intercept;
    if ((rule.strikes || rule.attacks) && !physical) return false;
    // (B228: a critical hit only.)
    if (rule.critical && !critical) return false;
    const near = sameMelee(c, target) || ((rule.within ?? 0) >= 15 && c.band !== "far" && target.band !== "far");
    if (!near) return false;
    if (rule.ward === "ally") {
        const fraction = (other) => Math.max(0, other.hp.value) / Math.max(1, other.hp.max);
        return fraction(c) > fraction(target) + 0.2 || target.hp.value <= Math.max(1, target.hp.max * 0.25);
    }
    const ward = state.list.filter((other) => other !== c && other.side === c.side && isActive(other) && other.kind !== "object").sort((a, b) => (b.level ?? 0) - (a.level ?? 0) || b.hp.max - a.hp.max)[0];
    return ward === target;
}

// (B193: spell { rank, targeted } — the damage of a spell aimed at it, for Divert Essence.)
export function applyDamage(state, target, instances, { source = null, critical = false, nonlethal = false, physical = false, intercepted = false, spell = null } = {}) {
    // M38: the party harming a foe that gave up and is leaving refuses its surrender.
    if (!intercepted) {
        harmedAfterGivingUp(state, target, source);
        hostility(state, target, source);
    }
    // (A familiar's Lifelink: damage that would drop it, its master takes instead.)
    if (!intercepted && target.familiar?.lifelink) {
        const master = lifelinkMaster(state, target, adjustDamage(target, instances).total, { canReact });
        if (master) {
            spendReaction(master, "Lifelink");
            state.stats.reactions++;
            log(state, `  ${master.name} uses Lifelink for ${target.name}`);
            return applyDamage(state, master, instances, { source, critical, nonlethal, physical, intercepted: true });
        }
    }
    // Intercept Attack: a guardian next to the ally takes physical damage meant for it,
    // when the ally would drop or is the more hurt of the two.
    if (!intercepted && source && source.side !== target.side && instances.some((instance) => ["bludgeoning", "piercing", "slashing"].includes(instance.type))) {
        const guardian = state.list.find((c) => c.interceptAttack && c !== target && c.side === target.side && canReact(c, c.interceptAttack.name) && sameMelee(c, target));
        if (guardian) {
            const total = adjustDamage(target, instances).total;
            const fraction = (c) => Math.max(0, c.hp.value) / Math.max(1, c.hp.max);
            if (total >= target.hp.value + (target.hp.temp ?? 0) || fraction(guardian) > fraction(target) + 0.2) {
                spendReaction(guardian, guardian.interceptAttack.name);
                state.stats.reactions++;
                log(state, `  ${guardian.name} uses Intercept Attack for ${target.name}`);
                return applyDamage(state, guardian, instances, { source, critical, nonlethal, physical, intercepted: true });
            }
        }
    }
    // (B124: Human Shield, Mortal Shield, Interposition — a monster's guard takes its ward's damage, or half of it.)
    if (!intercepted && source && source.side !== target.side) {
        const guard = state.list.find((c) => c.intercept && c !== target && c.side === target.side && isActive(c) && canReact(c, c.intercept.name) && canAct(c) && !c.cond.fleeing && guards(state, c, target, { physical, critical }));
        if (guard) {
            spendReaction(guard, guard.intercept.name);
            state.stats.reactions++;
            log(state, `  ${guard.name} uses ${guard.intercept.name} for ${target.name}`);
            if (guard.intercept.share >= 1) return applyDamage(state, guard, instances, { source, critical, nonlethal, physical, intercepted: true });
            const half = instances.map((instance) => ({ ...instance, amount: Math.floor(instance.amount / 2) }));
            applyDamage(state, guard, half, { source, critical, nonlethal, physical, intercepted: true });
            return applyDamage(state, target, instances.map((instance, index) => ({ ...instance, amount: instance.amount - half[index].amount })), { source, critical, nonlethal, physical, intercepted: true });
        }
    }
    // Regeneration turns off before damage of a listed type is dealt.
    if (target.regeneration && instances.some((instance) => instance.amount > 0 && target.regeneration.deactivatedBy.includes(instance.type))) turnOffRegeneration(state, target);
    // Liquefy, Chipping Scales (B99): its reaction's resistance against this damage, and what it leaves.
    const resisting = resistReaction(state, target, instances, { source, physical, spell });
    const adjusted = adjustDamage(target, instances);
    if (resisting?.half) adjusted.total = Math.floor(adjusted.total / 2);
    if (resisting) afterResisting(state, target, resisting, source);
    // A champion's reaction: resistance 2 + its level against the triggering damage, and more.
    const champion = adjusted.total > 0 ? championFor(state, target, source) : null;
    let retribution = null;
    if (champion) {
        const reaction = champion.championReaction;
        spendReaction(champion, reaction.name);
        state.stats.reactions++;
        log(state, `  ${champion.name} uses ${reaction.name}`);
        // (C30: Blessed Counterstrike's enemy, Swift Retribution, Oath of the Slayer doubled, Divine Fervor.)
        championTriggered(state, champion, source);
        if (reaction.slug === "glimpse-of-redemption" && adjusted.total <= reaction.resistance) {
            // The enemy repents: the ally is unharmed.
            log(state, `  ${source.name} repents: ${target.name} is unharmed`);
            return 0;
        }
        adjusted.total = Math.max(0, adjusted.total - reaction.resistance);
        // (B143, Destructive Vengeance: more damage on itself, the same back at the enemy.)
        if (reaction.slug === "destructive-vengeance") {
            const more = rollCount(state, reaction.selfDamage ?? "2d6");
            adjusted.total += more;
            log(state, `  ${champion.name} takes ${more} more`);
        }
        if (reaction.slug === "glimpse-of-redemption") {
            source.cond.enfeebled = Math.max(source.cond.enfeebled ?? 0, 2);
            (source.timers ??= []).push({ key: "enfeebled", value: 2, round: source.round === state.round ? state.round + 1 : state.round, turnOf: source.id, at: "end" });
            log(state, `  ${source.name} refuses and is enfeebled 2`);
        }
        if (reaction.slug === "retributive-strike") retribution = champion;
        if (reaction.slug === "destructive-vengeance") retribution = { vengeance: champion };
        if (reaction.slug === "iron-command") retribution = { ironCommand: champion };
    }
    // Swallow Whole: piercing or slashing damage of at least the Rupture value from one attack frees who's inside.
    if (state.list.some((other) => other.swallowedBy === target.id)) {
        const cutting = instances.filter((instance) => instance.type === "piercing" || instance.type === "slashing").reduce((sum, instance) => sum + adjustInstance(target, instance.type, instance.amount, instance.precision), 0);
        for (const other of state.list) {
            if (other.swallowedBy === target.id && other.swallow?.rupture && cutting >= other.swallow.rupture) releaseSwallowed(state, other, "cuts itself free");
        }
    }
    let total = adjusted.total;
    // (Shield, the spell: it blocks a spell's damage too, physical or not.)
    if ((physical || (spell && target.shield?.spell)) && shouldShieldBlock(target, total)) {
        const shield = target.shield;
        // The shield prevents up to its Hardness; it and the creature each take the rest.
        const blocked = Math.min(total, shield.hardness);
        total -= blocked;
        shield.hp -= total;
        if (shield.hp <= shield.bt) shield.broken = true;
        spendReaction(target, "Shield Block");
        // (The spell ends once it blocks, and can't be cast again this fight.)
        if (shield.spell) {
            shield.broken = true;
            shield.raised = false;
        }
        log(state, `  ${target.name} Shield Blocks (${blocked} prevented${shield.spell ? `, ${shield.name} ends` : shield.broken ? ", shield broken" : ""})`);
    }
    for (const instance of adjusted.persistent) addPersistent(target, instance);
    const dealt = dealDamage(state, target, total, { source, critical, nonlethal });
    // Vengeful Rage (B65): damage that leaves it at that many Hit Points or fewer.
    // (B244, Enraged Growth: any damage it takes.)
    if (dealt > 0 && isActive(target)) triggeredSelfEffect(state, target, (trigger) => (trigger.kind === "hp-at-most" && target.hp.value <= trigger.value) || trigger.kind === "damaged");
    // Solar Flare, Caustic Blood: the monster's reaction to damage on it (B44).
    if (dealt > 0) reactToDamage(state, target, source, instances.filter((instance) => instance.amount > 0).map((instance) => instance.type));
    // (T4–T7: what the damage sets off on it — Protean Anatomy, a troop's thresholds, Split ("would deal": its types, immune or not), an
    // elemental dragon's Countered by and Fed by.)
    const types = instances.filter((instance) => instance.amount > 0 && !instance.persistent).map((instance) => instance.type);
    if (dealt > 0 && target.protean) proteanAfterDamage(state, target, types);
    if (dealt > 0 && target.troop) troopAfterDamage(state, target);
    if (source && target.split) splitAfterHit(state, target, types, { critical });
    // (H1: acid or fire on a hydra with stumps — cauterized.)
    if (target.hydra?.stumps) cauterizeStumps(state, target, instances, instances.find((instance) => instance.context)?.context ?? null, { killCreature: kill });
    if (dealt > 0 && target.elemental) elementalAnswers(state, target, "damage", { types, context: instances.find((instance) => instance.context)?.context ?? null, applyCondition, recharge: rechargeNamed });
    // (B143: Destructive Vengeance's damage at the enemy.)
    if (retribution?.vengeance && isActive(source)) {
        const [, dice, type] = /^(\d+d\d+)\[(\w+)\]$/.exec(retribution.vengeance.championReaction.damage ?? "2d6[spirit]") ?? [null, "2d6", "spirit"];
        const back = applyDamage(state, source, [{ type, amount: rollCount(state, dice), persistent: false }], { source: retribution.vengeance });
        log(state, `  ${source.name} takes ${back} ${type} from ${retribution.vengeance.championReaction.name}`);
    }
    // Retributive Strike: a melee Strike at the enemy within reach. Iron Command: the enemy kneels (prone) or takes mental damage.
    if (retribution?.ironCommand && isActive(source)) {
        const dice = (retribution.ironCommand.championReaction.dice ?? 1);
        if (dice * 3.5 >= source.hp.value * 0.1) {
            source.cond.prone = true;
            log(state, `  ${source.name} kneels (prone)`);
        } else {
            let mental = 0;
            for (let die = 0; die < dice; die++) mental += state.rng.die(6);
            log(state, `  ${source.name} refuses and takes ${dealDamage(state, source, adjustInstance(source, "mental", mental), { source: retribution.ironCommand })} mental`);
        }
    } else if (retribution && isActive(source) && canAct(retribution) && sameMelee(retribution, source)) {
        const strike = bestMeleeStrike(retribution, source);
        // (C30: Relentless Reaction's persistent spirit damage, Instrument of Zeal's critical hit, Exalted Reaction's allies.)
        if (strike) retributionAfter(state, retribution, source, strike, performStrike(state, retribution, source, strike, { reaction: true }), { applyDamage, applyCondition });
        exaltedStrikes(state, retribution, source, { bestMeleeStrike, performStrike });
    }
    return dealt;
}

// A reaction that resists the damage setting it off (B99): damage of the types it names (any, when none), an attack's only ("hit with an
// attack that deals physical damage"), an enemy's only; its uses. Its resistance (to the types it names, or to all the triggering damage)
// is on the creature while this damage is adjusted; returns what to put back, or null.
const PHYSICAL_TYPES = new Set(["bludgeoning", "piercing", "slashing"]);
function resistReaction(state, target, instances, { source, physical, spell = null }) {
    const resist = target.resistReaction;
    if (!resist || !isActive(target) || !canReact(target, resist.name) || !((target.resistUses ?? Infinity) > 0)) return null;
    // (T5, Countered by Earth: Liquefy can't be used until the end of its next turn.)
    if ((target.disabledUntil?.[String(resist.name).toLowerCase()] ?? -Infinity) >= state.round) return null;
    if ((resist.attack && !physical) || (resist.foe && !(source && source.side !== target.side))) return null;
    // (B237: a melee attack from beside it — a Strike from a creature in its Melee.)
    if (resist.melee && !(physical && source && sameMelee(target, source))) return null;
    // (B193, Divert Essence: only a spell aimed at it, its rank the resistance.)
    if (resist.spell && !(spell?.targeted && spell.rank > 0 && source && source.side !== target.side)) return null;
    // (B213, Shadow Siphon: "a spell or magical effect" — a spell's damage.)
    if (resist.magical && !spell) return null;
    const value = resist.value === "rank" ? spell.rank : resist.value;
    const sets = (instance) => !instance.persistent && instance.amount > 0 && (!resist.on || resist.on.includes(instance.type) || (resist.on.includes("physical") && PHYSICAL_TYPES.has(instance.type)));
    if (adjustDamage(target, instances.filter(sets)).total <= 0) return null;
    spendReaction(target, resist.name);
    state.stats.reactions++;
    if (Number.isFinite(target.resistUses)) target.resistUses--;
    const before = target.resistances;
    const plain = adjustDamage(target, instances).total;
    // (B213: half the damage, applied after its resistances.)
    if (resist.value === "half") {
        log(state, `  ${target.name} uses ${resist.name}: half the damage`);
        return { before, resist, entries: [], resisted: 0, type: "untyped", half: true };
    }
    // (B213, Runic Resistance: "one damage type dealt by the triggering attack" — the type it takes most of.)
    const main = instances.filter(sets).reduce((best, instance) => (!best || instance.amount > best.amount ? instance : best), null)?.type ?? "untyped";
    const entries = (resist.types ?? ["all-damage"]).map((type) => ({ type: type === "triggering" ? main : type, value, exceptions: [] }));
    target.resistances = [...(before ?? []), ...entries];
    log(state, `  ${target.name} uses ${resist.name}: resistance ${value}${resist.types ? ` to ${entries.map((entry) => entry.type).join(", ")}` : ""} against it`);
    // (B155: what it kept off, and of which type, for a lash back.)
    const resisted = Math.max(0, plain - adjustDamage(target, instances).total);
    const type = instances.find((instance) => !instance.persistent && instance.amount > 0 && PHYSICAL_TYPES.has(instance.type))?.type ?? instances[0]?.type ?? "untyped";
    return { before, resist, entries, resisted, type };
}

// After it: the resistance gone, or kept until the end of its next turn (Liquefy); its AC lower for the day (Chipping Scales).
function afterResisting(state, target, { before, resist, entries, resisted = 0, type = "untyped" }, source = null) {
    target.resistances = before;
    // (B155, a Battlezoo dragon's lash back: an attack roll at the attacker with its own modifier; a hit deals what it resisted, of that type.)
    if (resist.lashBack && resisted > 0 && source && source !== target && isActive(source) && isActive(target)) {
        const natural = state.rng.d20();
        const degree = degreeOf(natural + resist.lashBack.bonus, armorClass(source), natural);
        log(state, `  ${target.name} lashes back at ${source.name}: ${natural + resist.lashBack.bonus} vs AC ${armorClass(source)}`);
        if (degree >= SUCCESS) applyDamage(state, source, [{ type, amount: resisted, persistent: false, precision: false }], { source: target });
    }
    // (B237, Sharp Riposte: the attacker takes its damage back when the attack hits.)
    if (resist.retort && source && source !== target && isActive(source) && isActive(target)) {
        const dealt = applyDamage(state, source, rollInstances(state, parseDamage(resist.retort)), { source: target });
        log(state, `  ${source.name} takes ${dealt} from ${resist.name}`);
    }
    const model = (name, rounds, modifiers, resistances) => ({ name, rounds, modifiers, tempHp: 0, fastHealing: 0, resistances, weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 });
    if (resist.lasts) applyEffect(state, target, model(resist.name, resist.lasts, [], entries), target);
    if (resist.acPenalty) applyEffect(state, target, model(`${resist.name} (AC)`, Infinity, [{ on: "ac", type: "untyped", value: -resist.acPenalty }], []), target);
    // (B152, Overcharge: "… and becomes Quickened for 1d4 rounds".)
    if (resist.quickened && isActive(target)) {
        const rounds = rollCount(state, resist.quickened);
        if (applyCondition(state, target, "quickened", null, { mode: "fixed", value: rounds, unit: "rounds" }, target)) log(state, `  ${target.name} is quickened for ${rounds} round${rounds === 1 ? "" : "s"}`);
    }
}

// The champion (of the target's side) whose reaction this damage triggers:
// an enemy damaging its ally (or, for Selfish Shield and Iron Command, itself),
// all in its aura (taken as in the same Melee).
function championFor(state, target, source) {
    if (!source || source.side === target.side) return null;
    for (const c of state.list) {
        const reaction = c.championReaction;
        if (!reaction || c.side !== target.side || !canReact(c, reaction.name)) continue;
        if (reaction.self ? c !== target : c === target) continue;
        if (!sameMelee(c, source) || (c !== target && !sameMelee(c, target))) continue;
        return c;
    }
    return null;
}

// "Deactivates until the end of its next turn": this turn's end if it hasn't acted this round.
function turnOffRegeneration(state, c) {
    c.regenerationOff = true;
    const round = c.round === state.round ? state.round + 1 : state.round;
    c.timers = (c.timers ?? []).filter((timer) => !timer.regenerationOff);
    c.timers.push({ regenerationOff: true, round, turnOf: c.id, at: "end" });
    log(state, `  ${c.name}'s regeneration stops`);
}

// Swallow Whole: the creature comes out (Escape, Rupture, or the swallower dropping or leaving).
export function releaseSwallowed(state, c, how) {
    const swallower = state.byId.get(c.swallowedBy);
    const swallow = c.swallow;
    c.swallowedBy = null;
    c.swallow = null;
    c.cond.grabbed = false;
    c.grabbedBy = null;
    if (swallow?.slowed) c.cond.slowed = Math.max(0, (c.cond.slowed ?? 0) - 1);
    if (swallower) swallower.offGuardTo = (swallower.offGuardTo ?? []).filter((entry) => entry !== swallow?.offGuard);
    if (c.status === "active" && swallower && isActive(swallower)) engage(state, c, swallower);
    else c.band = "near";
    log(state, `  ${c.name} ${how} from ${swallower?.name ?? "the swallower"}`);
}

function releaseAllSwallowed(state, swallower, how) {
    for (const other of state.list) if (other.swallowedBy === swallower.id) releaseSwallowed(state, other, how);
}

function addPersistent(target, instance) {
    if ((target.immunities ?? []).includes(instance.type)) return;
    const existing = target.persistent.find((entry) => entry.type === instance.type);
    const candidate = { type: instance.type, dice: instance.dice, die: instance.die, bonus: instance.bonus ?? 0, multiplier: instance.multiplier ?? 1, amount: instance.amount };
    if (!existing) target.persistent.push(candidate);
    else if ((candidate.amount ?? 0) > (existing.amount ?? 0)) Object.assign(existing, candidate);
}

// Applies already-adjusted damage.
export function dealDamage(state, target, amount, { source = null, critical = false, nonlethal = false } = {}) {
    if (amount <= 0) return 0;
    if (target.cond.asleep) {
        target.cond.asleep = false;
        log(state, `  ${target.name} wakes up`);
    }
    if (target.status === DEAD) return 0;
    // Confused: damage from an attack or spell gives a DC 11 flat check to snap out of it.
    if (target.cond.confused && source && flatCheck(state.rng, 11) >= SUCCESS) {
        target.cond.confused = false;
        target.timers = (target.timers ?? []).filter((timer) => timer.key !== "confused");
        log(state, `  ${target.name} is no longer confused`);
    }
    if (target.status === DOWN) {
        if (target.kind === "pc") increaseDying(state, target, critical ? 2 : 1);
        // Regeneration: dying never goes past 3 while it works.
        else if (regenerating(target, state)) target.cond.dying = Math.min(3, (target.cond.dying ?? 0) + (critical ? 2 : 1));
        else if (!nonlethal) kill(state, target);
        return 0;
    }
    let remaining = amount;
    if (target.hp.temp > 0) {
        const absorbed = Math.min(target.hp.temp, remaining);
        target.hp.temp -= absorbed;
        remaining -= absorbed;
        // (B196, Reef Armor: an effect that lasts while its temporary Hit Points do.)
        if (target.hp.temp <= 0) for (const effect of (target.effects ?? []).filter((entry) => entry.model?.endsWithTempHp)) {
            removeEffect(target, effect);
            log(state, `  ${target.name}'s ${effect.model.name} ends`);
        }
    }
    // (C33, Hero's Defiance: an attack that would drop it — its Hit Points first.)
    if (target.heroesDefiance && remaining >= target.hp.value) heroesDefiance(state, target, remaining, source);
    const before = target.hp.value;
    const dealt = Math.min(before, remaining);
    target.hp.value -= remaining;
    if (source) {
        source.damageDealt += dealt;
        if (state.damageBy) state.damageBy[source.side] += dealt;
    }
    if (before > target.hp.max / 2 && target.hp.value <= target.hp.max / 2 && target.hp.value > 0) {
        state.pendingEvents.push({ type: "halfHp", victim: target });
    }
    // (M41: wounded from full, for a cowardly creature's first blood.)
    if (before >= target.hp.max && target.hp.value < target.hp.max && target.hp.value > 0) state.pendingEvents.push({ type: "hurt", victim: target });
    // (C35, Vital Luminance: an undead that damaged its caster in its light takes half the reservoir.)
    if (target.luminance && dealt > 0 && source) luminanceStrikesBack(state, target, source, { applyDamage });
    // (B298: a summon set off by damage on it, Splinter Sycophant's.)
    if (target.hp.value > 0 && target.summons?.length) summonsOnDamage(state, target, amount);
    // (B302: Construct Armor breaking below half its Hit Points, or on a critical hit.)
    if (target.constructArmor) constructArmorDamaged(state, target, critical);
    // (C33, Immortal Bastion: 1 Hit Point and 100 temporary ones instead, once a day.)
    if (target.hp.value <= 0 && !(target.lastStand && lastStand(state, target))) {
        const overwhelming = amount >= target.hp.max * state.moraleRules.measures.overwhelmingFraction;
        const massive = amount >= target.hp.max * 2;
        knockOut(state, target, { source, critical, nonlethal, overwhelming, massive, before });
    }
    return dealt;
}

// Who a creature is grabbing or restraining lets go when it moves, drops or dies.
export function releaseGrabs(state, grabber) {
    for (const other of state.list) {
        // A swallowed creature stays inside when its swallower moves.
        if (other.grabbedBy !== grabber.id || other.swallowedBy) continue;
        other.grabbedBy = null;
        other.cond.grabbed = false;
        other.cond.restrained = false;
        other.timers = (other.timers ?? []).filter((timer) => timer.key !== "grabbed" && timer.key !== "restrained");
    }
}

function knockOut(state, target, { source, critical, nonlethal, overwhelming, massive, before = null }) {
    // Ferocity's kin (B95): Orc Ferocity once a day, Mythic Ferocity at half its Hit Points for a Mythic Point, Never Fall at 25 (and not
    // wounded), Indomitable Beast's Strike after.
    // (B286, Fractions of Life: only from 1 Hit Point — atOne — and once on each creature's turn — perTurn.)
    const rule = target.kind !== "pc" ? target.ferocityRule : null;
    const turnKey = `${state.round}:${state.acting ?? ""}`;
    // (B294, Bravo's Determination: never from 1 Hit Point — notAtOne.)
    const allowed = rule && (!rule.atOne || before === 1) && (!rule.notAtOne || before !== 1) && (!rule.perTurn || target.ferocityTurn !== turnKey);
    if (rule && allowed && !massive && (rule.free || canReact(target, rule.name)) && (!rule.wounded || (target.cond.wounded ?? 0) < 3) && (target.ferocityUsed ?? 0) < (rule.uses ?? Infinity) && (!rule.mythic || (target.mythicPoints ?? 0) > 0)) {
        if (rule.perTurn) target.ferocityTurn = turnKey;
        const hp = rule.hp === "half" ? Math.floor(target.hp.max / 2) : typeof rule.hp === "string" ? rollCount(state, rule.hp) : Number(rule.hp) || 1;
        target.hp.value = Math.max(1, Math.min(target.hp.max, hp));
        if (rule.wounded) target.cond.wounded = (target.cond.wounded ?? 0) + 1;
        if (!rule.free) spendReaction(target, rule.name);
        if (rule.mythic) target.mythicPoints--;
        target.ferocityUsed = (target.ferocityUsed ?? 0) + 1;
        log(state, `  ${target.name} uses ${rule.name} and stays up at ${target.hp.value} HP`);
        if (target.critUpgrade?.ferocityRecharges) target.critUpgradesUsed = 0;
        if (rule.strike) {
            const foe = (source && source.side !== target.side && isActive(source) && sameMelee(source, target) ? source : null) ?? engagedEnemies(state, target)[0] ?? null;
            const named = strikeNamed(target, rule.strike);
            if (foe && named >= 0) performStrike(state, target, foe, target.strikes[named], { reaction: true });
        }
        return;
    }
    // Ferocity (a monster's reaction): it stays at 1 HP, wounded +1, until wounded 3.
    if (target.kind !== "pc" && target.reactions?.ferocity && !target.ferocityRule && canReact(target, "Ferocity") && (target.cond.wounded ?? 0) < 3 && !massive) {
        target.hp.value = 1;
        target.cond.wounded = (target.cond.wounded ?? 0) + 1;
        spendReaction(target, "Ferocity");
        log(state, `  ${target.name} uses Ferocity and stays up at 1 HP`);
        // (B118: Flash of Brutality's "recharges when the great cyclops uses Ferocity".)
        if (target.critUpgrade?.ferocityRecharges) target.critUpgradesUsed = 0;
        return;
    }
    // Undying Myth (B72): all its Mythic Points, and it stays standing with half its Hit Points (or the number it names).
    if (target.kind !== "pc" && target.mythic?.undying && (target.mythicPoints ?? 0) > 0) {
        const undying = target.mythic.undying;
        target.mythicPoints = 0;
        target.hp.value = Math.max(1, Math.min(target.hp.max, undying.amount ?? Math.floor(target.hp.max * (undying.fraction ?? 0.5))));
        log(state, `  ${target.name} uses ${undying.name} and stays up at ${target.hp.value} HP`);
        return;
    }
    // (B124: You Don't Have My Permission to Die!, Soul Anchor, Recall the Fallen — an ally's reaction keeps it up: at 1 HP (Soul Anchor's
    // doomed too), or back at the Hit Points it restores, prone and wounded as one who dropped and was healed.)
    for (const friend of state.list) {
        const rule = friend.rescue;
        if (!rule || friend === target || friend.side !== target.side || !isActive(friend) || !canReact(friend, rule.name) || !canAct(friend) || massive) continue;
        if ((rule.uses ?? Infinity) <= (friend.rescuesUsed ?? 0) || (rule.oncePerTarget && friend.rescued?.has(target.id))) continue;
        if (rule.living && (target.traits ?? []).some((trait) => trait === "undead" || trait === "construct")) continue;
        // (B195: as it dies — a creature dropping at 0 is a PC that isn't dead.)
        if (rule.onDeath && target.kind === "pc") continue;
        if (!(rule.within >= 60 || sameMelee(friend, target) || (rule.within > 10 && target.band !== "far") || friend.band === target.band)) continue;
        spendReaction(friend, rule.name);
        friend.rescuesUsed = (friend.rescuesUsed ?? 0) + 1;
        (friend.rescued ??= new Set()).add(target.id);
        state.stats.reactions++;
        if (rule.heal) {
            target.hp.value = Math.max(1, Math.min(target.hp.max, rollCount(state, rule.heal)));
            target.cond.prone = true;
            target.cond.wounded = (target.cond.wounded ?? 0) + 1;
        } else target.hp.value = rule.hp === "half" ? Math.max(1, Math.floor(target.hp.max / 2)) : 1;
        if (rule.doomed) target.cond.doomed = Math.max(target.cond.doomed ?? 0, rule.doomed);
        log(state, `  ${friend.name} uses ${rule.name}: ${target.name} ${rule.onDeath ? "returns to life" : "stays up"} at ${target.hp.value} HP`);
        return;
    }
    // Death Frenzy: a last Strike as it drops.
    if (target.deathStrike && target.kind !== "pc" && canReact(target, target.deathStrike.name)) {
        const foe = (source && source.side !== target.side && isActive(source) && sameMelee(source, target) ? source : null) ?? engagedEnemies(state, target)[0] ?? null;
        const named = strikeNamed(target, target.deathStrike.strike);
        const strike = named >= 0 ? target.strikes[named] : foe ? bestMeleeStrike(target, foe) : null;
        if (foe && strike) {
            spendReaction(target, target.deathStrike.name);
            log(state, `  ${target.name} uses ${target.deathStrike.name}`);
            performStrike(state, target, foe, strike, { reaction: true });
        }
    }
    releaseGrabs(state, target);
    releaseAllSwallowed(state, target, "is freed");
    target.hp.value = 0;
    if (source && target.kind === "pc") source.downedCount++;
    // (You're Next, B79: the reaction of the creature that downed it.)
    if (source && source !== target && source.side !== target.side && isActive(source)) downsAnswers(state, source, target);
    // (B123, Deadly Cleave: its named Strike downed it — another at a different creature once the action ends, at that Strike's penalty.)
    const cleave = source && source !== target && source.side !== target.side ? (source.reactionStrikes ?? []).find((entry) => entry.triggers.includes("downs")) : null;
    if (cleave && source.lastStrike && String(source.lastStrike.strike ?? "").toLowerCase().includes(String(cleave.strike ?? "")) && source.lastStrike.targetId === target.id) {
        (state.afterAction ??= []).push({ kind: "cleave", sourceId: source.id, targetId: target.id, attacks: Math.max(0, (source.attacksThisTurn ?? 1) - 1) });
    }
    state.pendingEvents.push({ type: "dropped", victim: target, by: source, critical, overwhelming });
    if (massive && !nonlethal) {
        kill(state, target);
        return;
    }
    // Rage ends when the creature falls unconscious, and its temporary HP with it; so does a stance.
    if (target.activeBuffs?.length) target.activeBuffs = [];
    for (const entry of (target.selfEffects ?? []).filter((self) => self.stance)) for (const effect of (target.effects ?? []).filter((active) => active.key === `self:${entry.name}`)) removeEffect(target, effect);
    // (B305: who was beside it as it fell, for "an adjacent creature … is reduced to 0 Hit Points".)
    const besideIt = new Set(target.meleeId !== null && target.meleeId !== undefined ? state.melees?.get(target.meleeId) ?? [] : []);
    if (target.kind === "pc") {
        target.status = DOWN;
        target.everDown = true;
        target.downRound = state.round;
        target.cond.unconscious = true;
        target.cond.prone = true;
        removeFromSpace(state, target);
        // (Nonlethal damage, B88's Bully's Bludgeon: unconscious, not dying.)
        if (nonlethal) {
            log(state, `  ${target.name} is knocked out`);
            return;
        }
        log(state, `  ${target.name} is down`);
        increaseDying(state, target, (critical ? 2 : 1) + target.cond.wounded);
        // (B305: a reaction to a creature reduced to 0 Hit Points nearby — Preserve Prey; dying from it is kill's.)
        if (target.status !== DEAD) nearbyDeathAnswers(state, target, { died: false, melee: besideIt });
        return;
    }
    // Regeneration: a monster at 0 HP is dying (at most 3) and gets back up at the start of its turn.
    if (regenerating(target, state) && !nonlethal) {
        target.status = DOWN;
        target.cond.unconscious = true;
        target.cond.prone = true;
        target.cond.dying = Math.min(3, (critical ? 2 : 1) + (target.cond.wounded ?? 0));
        removeFromSpace(state, target);
        log(state, `  ${target.name} is down (regenerating)`);
        return;
    }
    if (nonlethal) {
        target.status = DOWN;
        target.captured = true;
        target.cond.unconscious = true;
        removeFromSpace(state, target);
        log(state, `  ${target.name} is knocked out`);
        return;
    }
    kill(state, target);
}

function kill(state, target) {
    // Who's in its Melee as it dies: its death throes' nearest victims (B42).
    const melee = new Set(target.meleeId !== null && target.meleeId !== undefined ? state.melees?.get(target.meleeId) ?? [] : []);
    releaseGrabs(state, target);
    releaseAllSwallowed(state, target, "is freed");
    target.status = DEAD;
    target.cond.unconscious = true;
    removeFromSpace(state, target);
    log(state, `  ${target.name} dies`);
    // (B305: reactions to a creature dying nearby — Soul Feast, Absorb Soul.)
    nearbyDeathAnswers(state, target, { died: true, melee });
    if (target.kind !== "pc") deathThroes(state, target, melee);
    // (B298: a summon as it dies, Final Spite's horn; the creatures that go with it.)
    if (target.kind !== "pc") summonsOnDeath(state, target);
    summonerFalls(state, target);
}

export function increaseDying(state, c, amount) {
    const threshold = deathThreshold(c);
    if (c.cond.dying + amount >= threshold) {
        if (state.options.heroPoints && c.heroPoints > 0) {
            state.stats.heroPointsSpent += c.heroPoints;
            c.heroPoints = 0;
            c.cond.dying = 0;
            c.stable = true;
            log(state, `  ${c.name} uses Heroic Recovery and stabilizes`);
            return;
        }
        c.cond.dying = threshold;
        kill(state, c);
        return;
    }
    c.cond.dying += amount;
    c.stable = false;
}

// Recovery check at the start of a dying PC's turn.
export function recoveryCheck(state, c) {
    if (c.cond.dying <= 0) return;
    const degree = flatCheck(state.rng, 10 + c.cond.dying);
    if (degree === CRITICAL_SUCCESS) c.cond.dying -= 2;
    else if (degree === SUCCESS) c.cond.dying -= 1;
    else if (degree === FAILURE) increaseDying(state, c, 1);
    else increaseDying(state, c, 2);
    if (c.status === DEAD) return;
    if (c.cond.dying <= 0) {
        c.cond.dying = 0;
        c.cond.wounded++;
        c.stable = true;
        log(state, `  ${c.name} stabilizes`);
    }
}

// Attack of Opportunity from every engaged enemy that has it.
// kind: "move" | "ranged" | "manipulate". Returns true if a manipulate action was disrupted.
// Also the Strikes some monsters make when a creature moves by them (Twisting
// Tail), which disrupt the move when they hit.
// (B225: an auditory or a healing action — Auditory Swipe, Disruptive Screech, Clinch Victory: only the reaction Strikes that name it. B227: a
// concentrate action and Standing up too.)
const OWN_KINDS = new Set(["auditory", "healing", "concentrate", "stand", "linguistic", "emotion"]);

// (B227: a hit that disrupts the action unless the creature passes a save.)
function disruptedBy(state, reaction, result, mover) {
    if (!reaction?.disrupts || !(result?.degree >= (reaction.disrupts === "critical" ? CRITICAL_SUCCESS : SUCCESS))) return false;
    if (!reaction.disruptSave) return true;
    const rolled = rollCheck(state.rng, saveModifier(mover, reaction.disruptSave.statistic), reaction.disruptSave.dc);
    const roll = { ...rolled, degree: adjustedSaveDegree(mover, reaction.disruptSave.statistic, rolled.degree) };
    log(state, `  ${mover.name} ${roll.degree >= SUCCESS ? "keeps" : "loses"} its action (${reaction.disruptSave.statistic} save ${roll.total} vs DC ${reaction.disruptSave.dc})`);
    return roll.degree < SUCCESS;
}

export function provoke(state, mover, kind) {
    let disrupted = false;
    const own = OWN_KINDS.has(kind);
    // (A concentrate action provokes only the reactions that say so, B51: no Reactive Strike.)
    for (const enemy of engagedEnemies(state, mover)) {
        if (!canAct(mover)) break;
        // (B302–B303: a reaction kept for Reactive Strikes, or another it has, counts — spent on its own reaction first.)
        if (!canReact(enemy, "*") || enemy.cond.fleeing) continue;
        if (enemy.reactions?.aoo && !own) {
            const strike = bestMeleeStrike(enemy, mover);
            if (!strike || !canReact(enemy, "Reactive Strike")) continue;
            spendReaction(enemy, "Reactive Strike");
            state.stats.reactions++;
            log(state, `  ${enemy.name} Attack of Opportunity`);
            // (B176, Call to Arms: an ally that uses the Reactive Strike it gave is immune to it afterward.)
            if (enemy.grantedAoo?.usedOnce) (state.byId.get(enemy.grantedAoo.by).grantAooImmune ??= new Set()).add(enemy.id);
            const result = performStrike(state, enemy, mover, strike, { reaction: true, trigger: kind });
            if (result?.degree === CRITICAL_SUCCESS && kind === "manipulate") disrupted = true;
            continue;
        }
        // (B123: "attempts to move away", "leaves a square within its reach": a move out of its Melee.)
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes(kind) || (kind === "move" && entry.triggers.includes("leave")));
        const result = reaction ? reactionStrikeAt(state, enemy, mover, reaction, kind) : null;
        // (B96: "If the attack is a critical hit …, it disrupts that action": a critical hit only.)
        if (disruptedBy(state, reaction, result, mover)) disrupted = true;
    }
    // (B225: from afar, a ranged Strike within its distance — Disruptive Screech's 30 feet: the bands, as a trigger's.)
    // (B242, Lurking Death: a teleport to the creature first, then a melee Strike — any kind it names, from within its distance.)
    for (const enemy of state.list) {
        if (!canAct(mover)) break;
        if (enemy.side === mover.side || !isActive(enemy) || sameMelee(enemy, mover) || !canReact(enemy, "*") || enemy.cond.fleeing) continue;
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.within > 10 && (entry.teleport ? entry.triggers.includes(kind) || (kind === "move" && entry.triggers.includes("leave")) : own && entry.triggers.includes(kind)));
        if (!reaction || !(reaction.within >= 60 || mover.band !== "far" || enemy.band === "far")) continue;
        const result = reactionStrikeAt(state, enemy, mover, reaction.teleport ? { ...reaction, step: true } : { ...reaction, ranged: true }, kind);
        if (disruptedBy(state, reaction, result, mover)) disrupted = true;
    }
    // Tentacle Trip, Ectoplasmic Filaments, Baleful Gaze: a reaction with results of its own (B51). One that leaves the creature
    // unable to act, or held, stops what it was doing.
    for (const enemy of state.list) {
        if (enemy.side === mover.side || !isActive(enemy) || !canAct(mover)) continue;
        if (provokedReaction(state, enemy, mover, kind) && (!canAct(mover) || mover.cond.grabbed || mover.cond.restrained || mover.cond.immobilized || (kind === "move" && mover.cond.prone))) disrupted = true;
    }
    return disrupted;
}

export function bestMeleeStrike(attacker, target) {
    let best = null;
    let bestValue = -Infinity;
    for (const strike of attacker.strikes ?? []) {
        if (!strike.melee || !strikeUsable(attacker, strike)) continue;
        const value = strike.bonus * 2 + expectedHitDamage(attacker, strike, target, false);
        if (value > bestValue) {
            bestValue = value;
            best = strike;
        }
    }
    return best;
}

// Movement. move: { kind: "engage", targetId } | { kind: "toNear" } | { kind: "toFar" } | { kind: "leave" }
// A stance that lasts until it moves (B137: Cower's "until the pusk moves from its current space", Entrench's "… as soon as the bastion
// archon uses another move action"): ended as it moves.
function endMoveEffects(state, c) {
    for (const entry of (c.selfEffects ?? []).filter((self) => self.endsOnMove)) {
        for (const effect of (c.effects ?? []).filter((active) => active.key === `self:${entry.name}`)) {
            removeEffect(c, effect);
            log(state, `  ${c.name}'s ${entry.name} ends as it moves`);
        }
    }
}

export function stride(state, c, move) {
    if (!canMove(c)) return;
    endMoveEffects(state, c);
    // Grapple: "unless you move".
    releaseGrabs(state, c);
    const leavingMelee = c.meleeId !== null && !(move.kind === "engage" && state.byId.get(move.targetId)?.meleeId === c.meleeId);
    // (B117: those it moves away from, for No Escape.)
    // (B302, Mobility: a short Stride triggers no reactions.)
    const safe = move.safe || mobileStride(c, move);
    const left = leavingMelee && !safe ? engagedEnemies(state, c) : [];
    if (leavingMelee && !safe) {
        const disrupted = provoke(state, c, "move");
        if (!canAct(c)) return;
        if (disrupted) {
            log(state, `  ${c.name}'s move is disrupted`);
            return;
        }
    }
    if (left.length && move.kind !== "leave") {
        strideTo(state, c, move);
        followAnswers(state, c, left);
        return;
    }
    strideTo(state, c, move);
}

// No Escape, Reactive Pursuit (B117): a creature that moved away from monsters with one, followed — each Strides after it and stays in its
// reach, when it's as fast and holds no one (Pursuing Strike's Strike after). A Step too; not a move that triggers no reactions.
function followAnswers(state, mover, left) {
    for (const enemy of left) {
        const rule = enemy.follow;
        if (!rule || !isActive(enemy) || !isActive(mover) || sameMelee(enemy, mover)) continue;
        if (!canReact(enemy, rule.name) || !canAct(enemy) || !canMove(enemy) || enemy.cond.fleeing || (rule.prey && enemy.prey !== mover.id)) continue;
        // (B242, Primal Hunt: a teleport, whatever its Speed.)
        if ((!rule.teleport && (enemy.speed ?? 25) < (mover.speed ?? 25)) || state.list.some((other) => other.grabbedBy === enemy.id)) continue;
        spendReaction(enemy, rule.name);
        log(state, `  ${enemy.name} uses ${rule.name}`);
        if (rule.teleport) {
            engage(state, enemy, mover);
            log(state, `  ${enemy.name} teleports to ${mover.name}`);
        } else stride(state, enemy, { kind: "engage", targetId: mover.id });
        const strike = rule.strike && sameMelee(enemy, mover) && canAct(enemy) ? bestMeleeStrike(enemy, mover) : null;
        if (strike) performStrike(state, enemy, mover, strike, { reaction: true });
    }
}

function strideTo(state, c, move) {
    if (move.kind === "engage") {
        const target = state.byId.get(move.targetId);
        if (!target || !isActive(target)) return;
        engage(state, c, target);
        log(state, `  ${c.name} Strides to engage ${target.name}`);
        // (Telekinetic Defense, Wing Rebuff, B81: a reaction Strike as it comes into their reach.)
        approachAnswers(state, c);
        // (B116, Scurry, Flit Back: a reaction that moves off as it comes beside them.)
        for (const enemy of engagedEnemies(state, c)) if (isActive(c) && canAct(c)) withdrawAnswer(state, enemy, c, { approach: true });
        // Map objectives: it's where the target is now.
        if (isMapObjective(state.objective)) {
            moveTo(c, target);
            leftItem(state, c);
        }
        // Escalation Regions (E1, E3): in or out of them as the target is.
        if (c.regionFeet && target.regionFeet) c.regionFeet = structuredClone(target.regionFeet);
    } else if (move.kind === "approach") {
        // Toward a creature, or a dropped item (targetId "item"), too far to reach this Stride.
        const item = state.objective?.item;
        const target = move.targetId === "item" ? (item?.dropped ? { name: "the item", areaFeet: item.area, exitFeet: item.exit } : null) : state.byId.get(move.targetId);
        if (!target || (move.targetId !== "item" && !isActive(target))) return;
        leaveMelee(state, c, c.band === "engaged" ? "near" : c.band);
        approach(state, c, target);
        leftItem(state, c);
    } else if (move.kind === "outOf") {
        leaveMelee(state, c, c.band === "engaged" ? "near" : c.band);
        strideOutOf(state, c, move.region);
    } else if (move.kind === "toGong") {
        leaveMelee(state, c, c.band === "engaged" ? "near" : c.band);
        strideToGong(state, c);
    } else if (move.kind === "toArea" || move.kind === "toExit") {
        leaveMelee(state, c, c.band === "engaged" ? "near" : c.band);
        moveToward(state, c, move.kind === "toArea" ? "area" : "exit");
        leftItem(state, c);
    } else if (move.kind === "toItem") {
        const item = state.objective?.item;
        if (!item?.dropped) return;
        // The Melee where the item fell, if it's still there; otherwise its band.
        const foe = item.meleeId !== null ? [...(state.melees.get(item.meleeId) ?? [])].map((id) => state.byId.get(id)).find((other) => other.side !== c.side && isActive(other)) : null;
        if (foe) engage(state, c, foe);
        else leaveMelee(state, c, item.band);
        reachItem(state, c);
    } else if (move.kind === "toNear") {
        leaveMelee(state, c, "near");
        log(state, `  ${c.name} Strides to near`);
    } else if (move.kind === "toFar") {
        leaveMelee(state, c, "far");
        log(state, `  ${c.name} Strides to far`);
    } else if (move.kind === "leave") {
        leaveField(state, c);
    }
}

export function leaveField(state, c) {
    releaseGrabs(state, c);
    releaseAllSwallowed(state, c, "is freed");
    leaveMelee(state, c, "gone");
    c.status = FLED;
    log(state, `  ${c.name} leaves the battlefield`);
    // A runner (E1): gone to fetch help.
    if (c.alarm === "runner" && state.escalation && !state.escalation.alarm.raised) {
        c.ranForHelp = true;
        raiseAlarm(state, c);
    }
    state.pendingEvents.push({ type: "fled", who: c });
}

export function step(state, c) {
    if (!canMove(c) || !canStepOut(state, c)) return false;
    endMoveEffects(state, c);
    releaseGrabs(state, c);
    const left = engagedEnemies(state, c);
    leaveMelee(state, c, "near");
    log(state, `  ${c.name} Steps away`);
    followAnswers(state, c, left);
    return true;
}

export function stand(state, c) {
    // (B227, Tail Sweep: a reaction Strike at Standing up.)
    const disrupted = provoke(state, c, "move") || (canAct(c) && provoke(state, c, "stand"));
    if (!canAct(c)) return;
    if (disrupted) {
        log(state, `  ${c.name} fails to stand`);
        return;
    }
    c.cond.prone = false;
    log(state, `  ${c.name} Stands`);
}

export function raiseShield(state, c) {
    if (c.shield && !c.shield.broken) {
        c.shield.raised = true;
        log(state, c.shield.spell ? `  ${c.name} casts ${c.shield.name}` : `  ${c.name} Raises a Shield`);
    }
}

export { kill as killCreature, log };

// Rend: the listed Strike's damage again, automatically, after two hits with it on the same enemy this round.
export function performRend(state, attacker, target, strike) {
    const instances = rollStrikeDamage(state.rng, strike, { critical: false, penalty: (strike.melee ? attacker.cond.enfeebled : 0) - effectBonus(attacker, "damage") }).map((instance) => ({ ...instance, context: strikeContext(attacker, strike) }));
    const dealt = applyDamage(state, target, instances, { source: attacker, physical: true });
    log(state, `  ${attacker.name} rends ${target.name} for ${dealt}`);
    attacker.rendUsed = true;
}

// Interact to pick up a dropped weapon, or to change grip after a Disarm weakened it.
export function interact(state, c, what, strikeName) {
    provoke(state, c, "manipulate");
    if (!canAct(c)) return;
    if (what === "pickup") {
        c.dropped?.delete(strikeName);
        log(state, `  ${c.name} picks up its ${strikeName}`);
    } else if (what === "regrip") {
        c.weakGrip?.delete(strikeName);
        log(state, `  ${c.name} gets a firm grip on its ${strikeName}`);
    }
}
