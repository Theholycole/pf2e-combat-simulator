// Built-in PF2e actions: Strike, Stride, Step, Stand, Raise a Shield, and the
// reactions Attack of Opportunity and Shield Block. Also damage, dying and
// hero points.

import { CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeOf, flatCheck } from "./checks.js";
import { DEAD, DOWN, FLED, armorClass, canAct, canMove, deathThreshold, effectBonus, isActive, isOffGuard, multipleAttackPenalty, statusPenalty } from "./combatant.js";
import { adjustDamage, expectedStrikeDamage, adjustInstance, rollStrikeDamage } from "./damage.js";
import { canStepOut, distanceBetween, engage, engagedEnemies, flankChance, leaveMelee, rangePenalty, removeFromSpace, sameMelee } from "./space.js";
import { isShaken } from "./morale.js";

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
export function attackModifier(state, attacker, target, strike, attacksMade, { prone, history = attacker.turnAttacks ?? [] } = {}) {
    let modifier = strike.bonus - multipleAttackPenalty(strike, attacksMade) + effectBonus(attacker, "attack");
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
    return armorClass(target, { ranged: !strike.melee, coverBonus: coverFor(state, target), flanked }) - berserkPenalty(state, target);
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
// bonus: a circumstance damage bonus (forceful); offGuardChance: for backstabber.
export function expectedHitDamage(attacker, strike, target, critical, { bonus = 0, offGuardChance = 0 } = {}) {
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
    let natural = state.rng.d20();
    let degree = degreeOf(natural + modifier, ac, natural);
    if (degree <= FAILURE && attacker.kind === "pc" && state.options.heroPoints && attacker.heroPoints >= 2) {
        const wouldDrop = expectedHitDamage(attacker, strike, target, false) >= target.hp.value + target.hp.temp;
        if (wouldDrop) {
            attacker.heroPoints--;
            state.stats.heroPointsSpent++;
            natural = state.rng.d20();
            degree = degreeOf(natural + modifier, ac, natural);
            log(state, `  ${attacker.name} spends a hero point to reroll`);
        }
    }
    if (!reaction) {
        attacker.turnAttacks ??= [];
        attacker.turnAttacks.push({ strike: strike.name, targetId: target.id, hit: degree >= SUCCESS });
    }
    const label = ["critically misses", "misses", "hits", "critically hits"][degree];
    if (degree < SUCCESS) {
        log(state, `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier} vs AC ${ac}, ${label}`);
        return { degree, damage: 0, trigger };
    }
    const critical = degree === CRITICAL_SUCCESS;
    const earlier = history.filter((entry) => entry.strike === strike.name).length;
    const penalty = (strike.melee ? attacker.cond.enfeebled : 0) - forcefulBonus(strike, earlier) - effectBonus(attacker, "damage");
    const instances = rollStrikeDamage(state.rng, strike, { critical, penalty });
    if (strike.backstabber && (flanked || isOffGuard(target))) {
        instances.push({ type: strike.damage[0].type, amount: critical ? 2 : 1, precision: true, persistent: false });
    }
    // Logged before the damage so consequences (Shield Block, going down) follow it.
    const line = state.log ? state.log.push("") - 1 : -1;
    const dealt = applyDamage(state, target, instances, {
        source: attacker,
        critical,
        nonlethal: strike.nonlethal || nonlethalAgainst(state, attacker, target),
        physical: true
    });
    if (line >= 0) state.log[line] = `  ${attacker.name} ${strike.name} → ${target.name}: ${natural + modifier} vs AC ${ac}, ${label} for ${dealt} (${target.name} ${Math.max(0, target.hp.value)}/${target.hp.max})`;
    return { degree, damage: dealt, trigger };
}

function shouldShieldBlock(defender, total) {
    const shield = defender.shield;
    if (!shield || shield.broken || !shield.raised) return false;
    if (!defender.reactions?.shieldBlock || defender.reactionUsed || !canAct(defender)) return false;
    // Not worth the reaction for a hit the shield would mostly ignore anyway.
    if (total < Math.max(1, shield.hardness)) return false;
    const taken = Math.max(0, total - shield.hardness);
    if (shield.hp - taken > shield.bt) return true;
    return total >= defender.hp.value + defender.hp.temp;
}

export function applyDamage(state, target, instances, { source = null, critical = false, nonlethal = false, physical = false } = {}) {
    const adjusted = adjustDamage(target, instances);
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
    return dealDamage(state, target, total, { source, critical, nonlethal });
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
    if (target.status === DOWN) {
        if (target.kind === "pc") increaseDying(state, target, critical ? 2 : 1);
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

function knockOut(state, target, { source, critical, nonlethal, overwhelming, massive }) {
    target.hp.value = 0;
    if (source && target.kind === "pc") source.downedCount++;
    state.pendingEvents.push({ type: "dropped", victim: target, by: source, critical, overwhelming });
    if (massive && !nonlethal) {
        kill(state, target);
        return;
    }
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
export function provoke(state, mover, kind) {
    let disrupted = false;
    for (const enemy of engagedEnemies(state, mover)) {
        if (!canAct(mover)) break;
        if (!enemy.reactions?.aoo || enemy.reactionUsed || !canAct(enemy) || enemy.cond.fleeing) continue;
        const strike = bestMeleeStrike(enemy, mover);
        if (!strike) continue;
        enemy.reactionUsed = true;
        state.stats.reactions++;
        log(state, `  ${enemy.name} Attack of Opportunity`);
        const result = performStrike(state, enemy, mover, strike, { reaction: true, trigger: kind });
        if (result?.degree === CRITICAL_SUCCESS && kind === "manipulate") disrupted = true;
    }
    return disrupted;
}

export function bestMeleeStrike(attacker, target) {
    let best = null;
    let bestValue = -Infinity;
    for (const strike of attacker.strikes ?? []) {
        if (!strike.melee) continue;
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
    const leavingMelee = c.meleeId !== null && !(move.kind === "engage" && state.byId.get(move.targetId)?.meleeId === c.meleeId);
    if (leavingMelee) {
        provoke(state, c, "move");
        if (!canAct(c)) return;
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
    leaveMelee(state, c, "gone");
    c.status = FLED;
    log(state, `  ${c.name} leaves the battlefield`);
    state.pendingEvents.push({ type: "fled", who: c });
}

export function step(state, c) {
    if (!canMove(c) || !canStepOut(state, c)) return false;
    leaveMelee(state, c, "near");
    log(state, `  ${c.name} Steps away`);
    return true;
}

export function stand(state, c) {
    provoke(state, c, "move");
    if (!canAct(c)) return;
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
