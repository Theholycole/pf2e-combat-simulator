// Built-in PF2e actions: Strike, Stride, Step, Stand, Raise a Shield, and the
// reactions Attack of Opportunity and Shield Block. Also damage, dying and
// hero points.

import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeOf, flatCheck } from "./checks.js";
import { DEAD, DOWN, FLED, armorClass, canAct, canMove, deathThreshold, effectBonus, gripPenalty, isActive, isOffGuard, multipleAttackPenalty, offGuardTo, statusPenalty, strikeUsable } from "./combatant.js";
import { adjustDamage, expectedStrikeDamage, adjustInstance, rollStrikeDamage } from "./damage.js";
import { canStepOut, distanceBetween, engage, engagedEnemies, flankChance, leaveMelee, rangePenalty, removeFromSpace, sameMelee } from "./space.js";
import { isShaken } from "./morale.js";
import { canReact, extraApplies, regenerating, strikeNamed } from "./abilities.js";

function log(state, text) {
    state.log?.push(text);
}

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
    let modifier = strike.bonus - attackPenalty(attacker, strike, target, attacksMade) + effectBonus(attacker, "attack") - gripPenalty(attacker, strike);
    modifier -= statusPenalty(attacker, strike.melee ? "melee" : "ranged");
    let circumstance = 0;
    if (prone ?? attacker.cond.prone) circumstance = Math.max(circumstance, 2);
    if (isShaken(attacker)) circumstance = Math.max(circumstance, state.moraleRules.group.shakenAttackPenalty);
    if (nonlethalAgainst(state, attacker, target) && !strike.nonlethal) circumstance = Math.max(circumstance, 2);
    modifier -= circumstance;
    modifier += traitAttackBonus(strike, target, history);
    if (!strike.melee) modifier -= rangePenalty(strike, distanceBetween(attacker, target)) ?? 0;
    return modifier;
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
    return armorClass(target, { ranged: !strike.melee, coverBonus: coverFor(state, target), flanked: flanked || feinted }) - berserkPenalty(state, target) + outwit;
}

// Cache of expected hit damage per Strike object (shared by every run of a
// batch), keyed by the target's defences and the situational modifiers.
const hitDamageCache = new WeakMap();
const defenceIds = new Map();

// A small number per distinct set of resistances, weaknesses and immunities.
function defenceId(target) {
    if (target.defenceId === undefined) {
        const text = JSON.stringify([target.resistances ?? [], target.weaknesses ?? [], target.immunities ?? []]);
        if (!defenceIds.has(text)) defenceIds.set(text, defenceIds.size);
        target.defenceId = defenceIds.get(text);
    }
    return target.defenceId;
}

// Expected damage of one hit or critical hit after the defender's adjustments.
// bonus: a circumstance damage bonus (forceful); offGuardChance: for backstabber
// and Sneak Attack; packAllies: the attacker's allies within reach of the target (Pack Attack).
export function expectedHitDamage(attacker, strike, target, critical, { bonus = 0, offGuardChance = 0, packAllies = 0 } = {}) {
    let total = baseHitDamage(attacker, strike, target, critical, bonus, offGuardChance);
    if (attacker.strikeExtras?.length) total += expectedExtras(attacker, strike, target, critical, offGuardChance, packAllies);
    for (const part of featureParts(attacker, strike, target, { offGuard: offGuardChance })) {
        const amount = ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (critical && !part.noCrit ? 2 : 1);
        total += part.chance * adjustInstance(target, part.type ?? strike.damage[0]?.type ?? "untyped", amount, !!part.precision);
    }
    return total;
}

// Extra damage parts a PC's class features add to a Strike, each with the
// chance it applies: the off-guard dice PF2e gives the Strike (Sneak Attack),
// an active buff's (Rage), and the Precision hunter's edge on the first hit on the prey.
export function featureParts(attacker, strike, target, { offGuard = 0, firstPreyHit = true } = {}) {
    const parts = [];
    if (offGuard && strike.offGuardExtra?.length) for (const part of strike.offGuardExtra) parts.push({ ...part, chance: offGuard });
    for (const buff of attacker.activeBuffs ?? []) for (const part of buff.strikeDeltas?.[strike.name] ?? []) parts.push({ ...part, chance: 1 });
    if (attacker.huntPrey?.edge === "precision" && attacker.prey === target.id && firstPreyHit) parts.push({ dice: attacker.huntPrey.precisionDice ?? 1, die: 8, bonus: 0, type: strike.damage[0]?.type, precision: true, chance: 1 });
    // Panache: Precise Strike's damage on agile or finesse melee Strikes; a finisher's dice instead.
    const precise = attacker.panacheStyle && strike.melee && (strike.agile || strike.finesse);
    if (precise && strike.finisher) parts.push({ dice: attacker.panacheStyle.finisherDice, die: 6, bonus: 0, type: strike.damage[0]?.type, precision: true, chance: 1 });
    else if (precise && attacker.panache) parts.push({ dice: 0, die: 0, bonus: attacker.panacheStyle.precise, type: strike.damage[0]?.type, precision: true, chance: 1 });
    // Exploit Vulnerability: the weakness it found or imposed, once per hit (not doubled).
    if (attacker.exploited?.targetId === target.id) parts.push({ dice: 0, die: 0, bonus: attacker.exploited.value, type: "untyped", precision: false, noCrit: true, chance: 1 });
    return parts;
}

// The extra dice of abilities such as Sneak Attack, on average (doubled on a critical hit).
function expectedExtras(attacker, strike, target, critical, offGuardChance, packAllies) {
    let total = 0;
    for (const extra of attacker.strikeExtras) {
        const chance = extra.when === "off-guard" ? offGuardChance : extraApplies(extra, target, { offGuard: false, packAllies }) ? 1 : 0;
        if (!chance) continue;
        const amount = extra.dice * (extra.die + 1) / 2 * (critical ? 2 : 1);
        total += chance * adjustInstance(target, extra.type ?? strike.damage[0]?.type ?? "untyped", amount, extra.precision);
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
    const total = computeHitDamage(strike, target, critical, penalty, offGuardChance);
    cache.set(key, total);
    return total;
}

function computeHitDamage(strike, target, critical, penalty, offGuardChance) {
    let total = 0;
    for (const instance of expectedStrikeDamage(strike, { critical, penalty })) {
        const amount = adjustInstance(target, instance.type, instance.amount, instance.precision);
        // Persistent damage is counted for about two rounds.
        total += instance.persistent ? amount * 2 : amount;
    }
    if (strike.backstabber && offGuardChance > 0) total += offGuardChance * adjustInstance(target, strike.damage[0].type, critical ? 2 : 1, true);
    return total;
}

export function performStrike(state, attacker, target, strike, { reaction = false, trigger = null } = {}) {
    if (!strikeUsable(attacker, strike)) return null;
    const attacksMade = reaction ? 0 : attacker.attacksThisTurn;
    if (!reaction) attacker.attacksThisTurn++;
    if (!reaction && !strike.melee && attacker.meleeId !== null) {
        provoke(state, attacker, "ranged");
        if (!canAct(attacker)) return null;
        if (!isActive(target)) return null;
    }
    let flanked = false;
    if (strike.melee) {
        const chance = flankChance(state, flankersAgainst(state, target, attacker));
        if (chance > 0) flanked = state.rng.chance(chance);
    }
    // Blinded or dazzled: a flat check to find the target first.
    const findDC = attacker.cond.blinded ? 11 : attacker.cond.dazzled ? 5 : 0;
    if (findDC && flatCheck(state.rng, findDC) < SUCCESS) {
        log(state, `  ${attacker.name} ${strike.name} → ${target.name}: fails the DC ${findDC} flat check`);
        return { degree: FAILURE, damage: 0, trigger };
    }
    // Reactions happen outside the attacker's turn, so this turn's history doesn't apply.
    const history = reaction ? [] : (attacker.turnAttacks ?? []);
    const modifier = attackModifier(state, attacker, target, strike, attacksMade, { history });
    const ac = targetAC(state, attacker, target, strike, flanked);
    // Off-guard to this attack: for Sneak Attack and backstabber.
    const offGuard = flanked || isOffGuard(target) || offGuardTo(target, attacker, strike.melee);
    // A one-attack feint or diversion is used up by this attack.
    const scoped = (target.offGuardTo ?? []).find((entry) => entry.attacker === attacker.id && (entry.attacks !== "melee" || strike.melee) && entry.uses);
    if (scoped && --scoped.uses <= 0) target.offGuardTo = target.offGuardTo.filter((entry) => entry !== scoped);
    // Defensive reactions as the attack comes: the attacker rolls twice (Challenge
    // Fate), or +AC (Nimble Dodge); kept for Attacks of Opportunity when it has them.
    let defence = 0;
    let misfortune = false;
    if (target.misfortuneReaction && canReact(target)) {
        misfortune = true;
        target.reactionUsed = true;
        log(state, `  ${target.name} uses ${target.misfortuneReaction.name}`);
    } else if (target.acReaction?.when === "targeted" && canReact(target) && !target.reactions?.aoo) {
        defence = target.acReaction.value;
        target.reactionUsed = true;
        log(state, `  ${target.name} uses ${target.acReaction.name}`);
    }
    const roll = () => (misfortune ? Math.min(state.rng.d20(), state.rng.d20()) : state.rng.d20());
    let natural = roll();
    let bonus = 0;
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
    // Retract Body: +AC once the attack hits, when that turns it aside.
    if (degree >= SUCCESS && target.acReaction?.when === "hit" && canReact(target)) {
        const lower = degreeOf(natural + modifier, ac + target.acReaction.value, natural);
        if (lower < degree) {
            defence = target.acReaction.value;
            degree = lower;
            target.reactionUsed = true;
            log(state, `  ${target.name} uses ${target.acReaction.name}`);
        }
    }
    if (degree <= FAILURE && attacker.kind === "pc" && state.options.heroPoints && attacker.heroPoints >= 2) {
        const wouldDrop = expectedHitDamage(attacker, strike, target, false) >= target.hp.value + target.hp.temp;
        if (wouldDrop) {
            attacker.heroPoints--;
            state.stats.heroPointsSpent++;
            natural = roll();
            degree = degreeOf(natural + modifier + bonus, ac + defence, natural);
            log(state, `  ${attacker.name} spends a hero point to reroll`);
        }
    }
    if (!reaction) {
        attacker.turnAttacks ??= [];
        attacker.turnAttacks.push({ strike: strike.name, targetId: target.id, hit: degree >= SUCCESS });
    }
    const label = ["critically misses", "misses", "hits", "critically hits"][degree];
    if (degree < SUCCESS) {
        log(state, `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier + bonus} vs AC ${ac + defence}, ${label}`);
        // Opportune Riposte: a Strike back at a foe in reach that critically fails against it.
        if (degree === CRITICAL_FAILURE && !reaction && target.opportuneRiposte && canReact(target) && sameMelee(target, attacker)) {
            const riposte = bestMeleeStrike(target, attacker);
            if (riposte) {
                target.reactionUsed = true;
                log(state, `  ${target.name} uses Opportune Riposte`);
                performStrike(state, target, attacker, riposte, { reaction: true });
            }
        }
        return { degree, damage: 0, trigger };
    }
    const critical = degree === CRITICAL_SUCCESS;
    const earlier = history.filter((entry) => entry.strike === strike.name).length;
    const penalty = (strike.melee ? attacker.cond.enfeebled : 0) - forcefulBonus(strike, earlier) - effectBonus(attacker, "damage");
    const instances = rollStrikeDamage(state.rng, strike, { critical, penalty });
    if (strike.backstabber && offGuard) {
        instances.push({ type: strike.damage[0].type, amount: critical ? 2 : 1, precision: true, persistent: false });
    }
    // Class features: Sneak Attack's off-guard dice, Rage, the Precision edge.
    const firstPreyHit = attacker.preyHitRound !== state.round;
    const parts = featureParts(attacker, strike, target, { offGuard: offGuard ? 1 : 0, firstPreyHit });
    if (strategic) parts.push({ dice: attacker.stratagemFeature.dice ?? 1, die: 6, bonus: 0, type: strike.damage[0].type, precision: true });
    for (const part of parts) {
        let amount = part.bonus ?? 0;
        for (let die = 0; die < (part.dice ?? 0); die++) amount += state.rng.die(part.die);
        instances.push({ type: part.type ?? strike.damage[0].type, amount: Math.max(0, critical && !part.noCrit ? amount * 2 : amount), precision: !!part.precision, persistent: !!part.persistent });
    }
    if (attacker.huntPrey?.edge === "precision" && attacker.prey === target.id) attacker.preyHitRound = state.round;
    // Sneak Attack, Pack Attack and the like (monsters).
    if (attacker.strikeExtras?.length) {
        const packAllies = engagedEnemies(state, target).filter((other) => other !== attacker).length;
        for (const extra of attacker.strikeExtras) {
            if (!extraApplies(extra, target, { offGuard, packAllies })) continue;
            let amount = 0;
            for (let die = 0; die < extra.dice; die++) amount += state.rng.die(extra.die);
            instances.push({ type: extra.type ?? strike.damage[0].type, amount: critical ? amount * 2 : amount, precision: !!extra.precision, persistent: false });
        }
    }
    // Logged before the damage so consequences (Shield Block, going down) follow it.
    const line = state.log ? state.log.push("") - 1 : -1;
    const dealt = applyDamage(state, target, instances, {
        source: attacker,
        critical,
        nonlethal: strike.nonlethal || nonlethalAgainst(state, attacker, target),
        physical: true
    });
    if (line >= 0) state.log[line] = `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier + bonus} vs AC ${ac + defence}, ${label} for ${dealt} (${target.name} ${Math.max(0, target.hp.value)}/${target.hp.max})`;
    // Draconic Momentum: a critical hit recharges the breath weapon.
    if (critical && attacker.momentum) rechargeOnCritical(state, attacker);
    // Grab, Knockdown and Push follow a hit (free ones at once, the others as the next action).
    if (!reaction && isActive(target)) state.onStrikeHit?.(attacker, target, strike, degree);
    return { degree, damage: dealt, trigger };
}

function rechargeOnCritical(state, c) {
    if (!c.rechargeUntil?.size) return;
    const names = (c.momentum.recharges ?? []).map((name) => name.toLowerCase());
    for (const spell of [...c.rechargeUntil.keys()]) {
        if (names.length && !names.includes(String(spell.name).toLowerCase())) continue;
        c.rechargeUntil.delete(spell);
        log(state, `  ${c.name}'s ${spell.name} recharges`);
    }
}

function shouldShieldBlock(defender, total) {
    const shield = defender.shield;
    if (!shield || shield.broken || !shield.raised) return false;
    if (!defender.reactions?.shieldBlock || !canReact(defender)) return false;
    // Not worth the reaction for a hit the shield would mostly ignore anyway.
    if (total < Math.max(1, shield.hardness)) return false;
    const taken = Math.max(0, total - shield.hardness);
    if (shield.hp - taken > shield.bt) return true;
    return total >= defender.hp.value + defender.hp.temp;
}

export function applyDamage(state, target, instances, { source = null, critical = false, nonlethal = false, physical = false, intercepted = false } = {}) {
    // Intercept Attack: a guardian next to the ally takes physical damage meant for it,
    // when the ally would drop or is the more hurt of the two.
    if (!intercepted && source && source.side !== target.side && instances.some((instance) => ["bludgeoning", "piercing", "slashing"].includes(instance.type))) {
        const guardian = state.list.find((c) => c.interceptAttack && c !== target && c.side === target.side && canReact(c) && sameMelee(c, target));
        if (guardian) {
            const total = adjustDamage(target, instances).total;
            const fraction = (c) => Math.max(0, c.hp.value) / Math.max(1, c.hp.max);
            if (total >= target.hp.value + (target.hp.temp ?? 0) || fraction(guardian) > fraction(target) + 0.2) {
                guardian.reactionUsed = true;
                state.stats.reactions++;
                log(state, `  ${guardian.name} uses Intercept Attack for ${target.name}`);
                return applyDamage(state, guardian, instances, { source, critical, nonlethal, physical, intercepted: true });
            }
        }
    }
    // Regeneration turns off before damage of a listed type is dealt.
    if (target.regeneration && instances.some((instance) => instance.amount > 0 && target.regeneration.deactivatedBy.includes(instance.type))) turnOffRegeneration(state, target);
    const adjusted = adjustDamage(target, instances);
    // A champion's reaction: resistance 2 + its level against the triggering damage, and more.
    const champion = adjusted.total > 0 ? championFor(state, target, source) : null;
    let retribution = null;
    if (champion) {
        const reaction = champion.championReaction;
        champion.reactionUsed = true;
        state.stats.reactions++;
        log(state, `  ${champion.name} uses ${reaction.name}`);
        if (reaction.slug === "glimpse-of-redemption" && adjusted.total <= reaction.resistance) {
            // The enemy repents: the ally is unharmed.
            log(state, `  ${source.name} repents: ${target.name} is unharmed`);
            return 0;
        }
        adjusted.total = Math.max(0, adjusted.total - reaction.resistance);
        if (reaction.slug === "glimpse-of-redemption") {
            source.cond.enfeebled = Math.max(source.cond.enfeebled ?? 0, 2);
            (source.timers ??= []).push({ key: "enfeebled", value: 2, round: source.round === state.round ? state.round + 1 : state.round, turnOf: source.id, at: "end" });
            log(state, `  ${source.name} refuses and is enfeebled 2`);
        }
        if (reaction.slug === "retributive-strike") retribution = champion;
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
    if (physical && shouldShieldBlock(target, total)) {
        const shield = target.shield;
        // The shield prevents up to its Hardness; it and the creature each take the rest.
        const blocked = Math.min(total, shield.hardness);
        total -= blocked;
        shield.hp -= total;
        if (shield.hp <= shield.bt) shield.broken = true;
        target.reactionUsed = true;
        log(state, `  ${target.name} Shield Blocks (${blocked} prevented${shield.broken ? ", shield broken" : ""})`);
    }
    for (const instance of adjusted.persistent) addPersistent(target, instance);
    const dealt = dealDamage(state, target, total, { source, critical, nonlethal });
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
        if (strike) performStrike(state, retribution, source, strike, { reaction: true });
    }
    return dealt;
}

// The champion (of the target's side) whose reaction this damage triggers:
// an enemy damaging its ally (or, for Selfish Shield and Iron Command, itself),
// all in its aura (taken as in the same Melee).
function championFor(state, target, source) {
    if (!source || source.side === target.side) return null;
    for (const c of state.list) {
        const reaction = c.championReaction;
        if (!reaction || c.side !== target.side || !canReact(c)) continue;
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
        else if (regenerating(target)) target.cond.dying = Math.min(3, (target.cond.dying ?? 0) + (critical ? 2 : 1));
        else if (!nonlethal) kill(state, target);
        return 0;
    }
    let remaining = amount;
    if (target.hp.temp > 0) {
        const absorbed = Math.min(target.hp.temp, remaining);
        target.hp.temp -= absorbed;
        remaining -= absorbed;
    }
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
    if (target.hp.value <= 0) {
        const overwhelming = amount >= target.hp.max * state.moraleRules.measures.overwhelmingFraction;
        const massive = amount >= target.hp.max * 2;
        knockOut(state, target, { source, critical, nonlethal, overwhelming, massive });
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

function knockOut(state, target, { source, critical, nonlethal, overwhelming, massive }) {
    // Ferocity (a monster's reaction): it stays at 1 HP, wounded +1, until wounded 3.
    if (target.kind !== "pc" && target.reactions?.ferocity && canReact(target) && (target.cond.wounded ?? 0) < 3 && !massive) {
        target.hp.value = 1;
        target.cond.wounded = (target.cond.wounded ?? 0) + 1;
        target.reactionUsed = true;
        log(state, `  ${target.name} uses Ferocity and stays up at 1 HP`);
        return;
    }
    // Death Frenzy: a last Strike as it drops.
    if (target.deathStrike && target.kind !== "pc" && canReact(target)) {
        const foe = (source && source.side !== target.side && isActive(source) && sameMelee(source, target) ? source : null) ?? engagedEnemies(state, target)[0] ?? null;
        const named = strikeNamed(target, target.deathStrike.strike);
        const strike = named >= 0 ? target.strikes[named] : foe ? bestMeleeStrike(target, foe) : null;
        if (foe && strike) {
            target.reactionUsed = true;
            log(state, `  ${target.name} uses ${target.deathStrike.name}`);
            performStrike(state, target, foe, strike, { reaction: true });
        }
    }
    releaseGrabs(state, target);
    releaseAllSwallowed(state, target, "is freed");
    target.hp.value = 0;
    if (source && target.kind === "pc") source.downedCount++;
    state.pendingEvents.push({ type: "dropped", victim: target, by: source, critical, overwhelming });
    if (massive && !nonlethal) {
        kill(state, target);
        return;
    }
    // Rage ends when the creature falls unconscious, and its temporary HP with it.
    if (target.activeBuffs?.length) target.activeBuffs = [];
    if (target.kind === "pc") {
        target.status = DOWN;
        target.everDown = true;
        target.cond.unconscious = true;
        target.cond.prone = true;
        removeFromSpace(state, target);
        log(state, `  ${target.name} is down`);
        increaseDying(state, target, (critical ? 2 : 1) + target.cond.wounded);
        return;
    }
    // Regeneration: a monster at 0 HP is dying (at most 3) and gets back up at the start of its turn.
    if (regenerating(target) && !nonlethal) {
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
    releaseGrabs(state, target);
    releaseAllSwallowed(state, target, "is freed");
    target.status = DEAD;
    target.cond.unconscious = true;
    removeFromSpace(state, target);
    log(state, `  ${target.name} dies`);
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
export function provoke(state, mover, kind) {
    let disrupted = false;
    for (const enemy of engagedEnemies(state, mover)) {
        if (!canAct(mover)) break;
        if (!canReact(enemy) || enemy.cond.fleeing) continue;
        if (enemy.reactions?.aoo) {
            const strike = bestMeleeStrike(enemy, mover);
            if (!strike) continue;
            enemy.reactionUsed = true;
            state.stats.reactions++;
            log(state, `  ${enemy.name} Attack of Opportunity`);
            const result = performStrike(state, enemy, mover, strike, { reaction: true, trigger: kind });
            if (result?.degree === CRITICAL_SUCCESS && kind === "manipulate") disrupted = true;
            continue;
        }
        const reaction = (enemy.reactionStrikes ?? []).find((entry) => entry.triggers.includes(kind));
        const index = reaction ? strikeNamed(enemy, reaction.strike) : -1;
        if (index < 0 || !strikeUsable(enemy, enemy.strikes[index])) continue;
        enemy.reactionUsed = true;
        state.stats.reactions++;
        log(state, `  ${enemy.name} uses ${reaction.name}`);
        const strike = enemy.strikes[index];
        const result = performStrike(state, enemy, mover, reaction.penalty ? { ...strike, bonus: strike.bonus - reaction.penalty } : strike, { reaction: true, trigger: kind });
        if (reaction.disrupts && result?.degree >= SUCCESS) disrupted = true;
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
export function stride(state, c, move) {
    if (!canMove(c)) return;
    // Grapple: "unless you move".
    releaseGrabs(state, c);
    const leavingMelee = c.meleeId !== null && !(move.kind === "engage" && state.byId.get(move.targetId)?.meleeId === c.meleeId);
    if (leavingMelee) {
        const disrupted = provoke(state, c, "move");
        if (!canAct(c)) return;
        if (disrupted) {
            log(state, `  ${c.name}'s move is disrupted`);
            return;
        }
    }
    if (move.kind === "engage") {
        const target = state.byId.get(move.targetId);
        if (!target || !isActive(target)) return;
        engage(state, c, target);
        log(state, `  ${c.name} Strides to engage ${target.name}`);
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
    state.pendingEvents.push({ type: "fled", who: c });
}

export function step(state, c) {
    if (!canMove(c) || !canStepOut(state, c)) return false;
    releaseGrabs(state, c);
    leaveMelee(state, c, "near");
    log(state, `  ${c.name} Steps away`);
    return true;
}

export function stand(state, c) {
    const disrupted = provoke(state, c, "move");
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
        log(state, `  ${c.name} Raises a Shield`);
    }
}

export { kill as killCreature, log };

// Rend: the listed Strike's damage again, automatically, after two hits with it on the same enemy this round.
export function performRend(state, attacker, target, strike) {
    const instances = rollStrikeDamage(state.rng, strike, { critical: false, penalty: (strike.melee ? attacker.cond.enfeebled : 0) - effectBonus(attacker, "damage") });
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
