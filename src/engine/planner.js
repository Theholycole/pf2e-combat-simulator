// Expected-value planner. Each creature searches its possible plans for the
// rest of its turn with a small beam search, carries out the first action of
// the best plan, then plans again.
//
// Value units are "threat": damage to a target is worth the target's threat
// times the share of its remaining HP it removes, so a kill removes all of
// its threat. Exposure to enemy attacks costs the creature's own threat the
// same way, weighted by self-preservation.

import { degreeDistribution, CRITICAL_SUCCESS, SUCCESS, CRITICAL_FAILURE } from "./checks.js";
import { effectBenefit } from "./effects.js";
import { canAct, canMove, effectBonus, gripPenalty, hpFraction, isActive, isOffGuard, multipleAttackPenalty, offGuardTo, statusPenalty, armorClass, strikeUsable, targetingChance } from "./combatant.js";
import { canStepOut, flankChance, rangePenalty, stridesToEngage, DISTANCE_FEET } from "./space.js";
import { attackPenalty, coverFor, expectedHitDamage, forcefulBonus, nonlethalAgainst } from "./actions.js";
import { isShaken } from "./morale.js";
import { chargeStrike, multiStrikeOrder, strikeNamed } from "./abilities.js";
import { canDoTask, taskModifier } from "./objectives.js";
import { battleMedicineOdds, canCast, conditionWorth, describeSpell, exploitValue, retchOdds, spellExpectation, spellVariants, strikeRiderValue, targetSets } from "./spells.js";
import { levelDC } from "./abilities.js";

export const ROLE_PROFILES = Object.freeze({
    soldier: { aggression: 1, selfPreservation: 0.8, objective: 1 },
    brute: { aggression: 1.2, selfPreservation: 0.5, objective: 1 },
    skirmisher: { aggression: 1, selfPreservation: 1.2, objective: 1 },
    sniper: { aggression: 1, selfPreservation: 1.5, objective: 1 }
});

const BEAM_WIDTH = 5;
const NEXT_TURN_WEIGHT = 0.5;
// Conditions and spell effects are weighed in rounds of a creature's threat;
// damage as the share of its HP removed, where a kill (all of its threat for
// the rest of the fight) counts once. A fight has about three rounds left, so
// a round of threat is worth about a third of a kill.
const ROUND_TO_KILL = 1 / 3;
const BAND_CODES = Object.freeze({ engaged: 0, near: 1, far: 2, gone: 3 });

export function guessRole(spec) {
    let melee = 0;
    let ranged = 0;
    for (const strike of spec.strikes ?? []) {
        const damage = strike.damage.reduce((sum, part) => sum + part.dice * (part.die + 1) / 2 + (part.bonus ?? 0), 0);
        const value = damage + strike.bonus;
        if (strike.melee) melee = Math.max(melee, value);
        else ranged = Math.max(ranged, value);
    }
    return ranged > melee ? "sniper" : "soldier";
}

function profileOf(c) {
    const base = ROLE_PROFILES[c.role] ?? ROLE_PROFILES.soldier;
    let { aggression, selfPreservation, objective } = base;
    if (c.dropAggression) {
        aggression *= 0.5;
        selfPreservation *= 2;
    }
    if (c.morale?.template === "cowardly") selfPreservation *= 1.5;
    return { aggression, selfPreservation, objective };
}

// Per-round threat: expected damage per round against a typical enemy.
export function computeThreats(state) {
    state.threat = new Map();
    state.strikeShare = new Map();
    for (const c of state.list) {
        if (!isActive(c)) {
            state.threat.set(c.id, 0);
            continue;
        }
        const enemies = state.list.filter((other) => other.side !== c.side && isActive(other));
        if (!enemies.length || (!c.strikes?.length && !c.spells?.length) || c.acts === false) {
            state.threat.set(c.id, 0);
            continue;
        }
        const sample = enemies.reduce((sum, enemy) => sum + armorClass(enemy), 0) / enemies.length;
        const target = enemies[0];
        const strikes = roundDamage(c, target, sample);
        const spells = spellThreat(state, c, target);
        state.threat.set(c.id, Math.max(strikes, spells));
        // How much of its threat comes from Strikes: what an extra action or an attack bonus helps.
        state.strikeShare.set(c.id, strikes + spells > 0 ? strikes / Math.max(strikes, spells) : 1);
    }
    const mean = (side) => {
        const values = state.list.filter((c) => c.side === side && isActive(c) && c.kind !== "object").map((c) => state.threat.get(c.id) ?? 0);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };
    state.meanThreat = { party: mean("party"), foes: mean("foes") };
}

// Expected damage of the creature's best spell it can still cast, against one
// target (two for an area).
function spellThreat(state, c, target) {
    let best = 0;
    for (const spell of c.spells ?? []) {
        if (!canCast(c, spell)) continue;
        for (const actions of spellVariants(spell)) {
            const info = describeSpell(spell.plan, actions);
            const copies = info.area ? 2 : Math.max(1, Math.min(info.targets, 2));
            const [expected] = spellExpectation(state, c, spell, [target], 0, actions);
            if (expected) best = Math.max(best, expected.damage * copies);
        }
    }
    return best;
}

// Expected damage from a round of Strikes (the third at half weight).
// attacks: how many Strikes the creature has left after moving.
function roundDamage(c, target, ac, attacks = 3, { meleeOnly = false, rangedOnly = false } = {}) {
    let best = 0;
    for (const strike of c.strikes ?? []) {
        if (!strikeUsable(c, strike)) continue;
        if (meleeOnly && !strike.melee) continue;
        if (rangedOnly && strike.melee) continue;
        const hit = expectedHitDamage(c, strike, target, false);
        const crit = expectedHitDamage(c, strike, target, true);
        let total = 0;
        for (let attack = 0; attack < attacks; attack++) {
            const modifier = strike.bonus - multipleAttackPenalty(strike, attack) - statusPenalty(c, strike.melee ? "melee" : "ranged") + effectBonus(c, "attack");
            const dist = degreeDistribution(modifier, ac);
            total += (dist[SUCCESS] * hit + dist[CRITICAL_SUCCESS] * crit) * (attack === 2 ? 0.5 : 1);
        }
        best = Math.max(best, total * targetingChance(c));
    }
    return best;
}

function objectiveBonus(state, target, attacker) {
    const objective = state.objective;
    if (!objective || objective.status !== "open") return 0;
    const weight = (state.setup.objectivePriority ?? 1) * profileOf(attacker).objective;
    if (attacker.side === "foes") {
        if (objective.kind === "protect" && objective.protectId === target.id) return weight * state.meanThreat.party * 1.5;
        if (objective.kind === "task" && target.taskRound >= state.round - 1) return weight * state.meanThreat.party * 0.5;
    } else if (objective.kind === "target" && objective.targetId === target.id) {
        return weight * state.meanThreat.foes;
    }
    return 0;
}

function targetValue(state, target, attacker) {
    let threat = state.threat.get(target.id) ?? 0;
    // A creature the simulator can't make attack (a swarm with only area
    // attacks) still has to be beaten to end the fight, so it's never worthless.
    if (target.kind !== "object") threat = Math.max(threat, 0.5 * (state.meanThreat?.[target.side] ?? 0), 1);
    return threat + objectiveBonus(state, target, attacker);
}

function remainingHp(target) {
    return Math.max(1, target.hp.value + target.hp.temp);
}

// Position helpers. A hypothetical position is { band, melee, newWith }:
// melee is a real Melee id, or "new" when engaging a lone target (newWith).
function inMelee(pos, other) {
    if (pos.melee === null) return false;
    if (pos.melee === "new") return other.id === pos.newWith;
    return other.meleeId === pos.melee;
}

function distanceTo(pos, other) {
    if (inMelee(pos, other)) return DISTANCE_FEET.engaged;
    if (pos.band === "far" || other.band === "far") return DISTANCE_FEET.far;
    return DISTANCE_FEET.near;
}

class PlanContext {
    constructor(state, c) {
        this.state = state;
        this.c = c;
        this.profile = profileOf(c);
        this.enemies = state.list.filter((other) => other.side !== c.side && isActive(other));
        this.enemyIndex = new Map(this.enemies.map((enemy, index) => [enemy.id, index]));
        this.allies = state.list.filter((other) => other.side === c.side && isActive(other) && other !== c);
        // Healing reaches downed PCs too.
        this.alliesAndDown = state.list.filter((other) => other.side === c.side && other !== c && (isActive(other) || (other.status === "down" && other.kind === "pc")));
        this.defenders = this.allies.length + 1;
        this.strikeCache = new Map();
        this.terminalCache = new Map();
        this.roundCache = new Map();
        this.spellCache = new Map();
        this.ownValue = Math.max(targetValue(state, c, this.enemies[0] ?? c), 0.5);
        this.wavering = c.moraleState.wavering || c.groupState === "wavering";
    }

    // Numeric key for a hypothetical position, for the terminal cache.
    positionKey(node) {
        const pos = node.pos;
        let melee = 0;
        if (pos.melee === "new") melee = 1_000_000 + (this.enemyIndex.get(pos.newWith) ?? 0);
        else if (pos.melee !== null) melee = pos.melee + 1;
        return ((melee * 4 + (BAND_CODES[pos.band] ?? 3)) * 2 + (node.shield ? 1 : 0)) * 2 + (node.prone ? 1 : 0);
    }

    // roundDamage for an enemy against this creature, cached for the decision.
    enemyRound(enemy, ac, attacks, mode) {
        const key = (((this.enemyIndex.get(enemy.id) ?? 0) * 256 + (ac + 64)) * 4 + attacks) * 2 + (mode === "ranged" ? 1 : 0);
        let value = this.roundCache.get(key);
        if (value === undefined) {
            value = roundDamage(enemy, this.c, ac, attacks, mode === "ranged" ? { rangedOnly: true } : { meleeOnly: true });
            this.roundCache.set(key, value);
        }
        return value;
    }

    // Expected damage of one Strike from a hypothetical position.
    strikeExpectation(strike, strikeIndex, target, attacks, pos, prone) {
        let perTarget = this.strikeCache.get(target);
        if (!perTarget) {
            perTarget = new Map();
            this.strikeCache.set(target, perTarget);
        }
        const key = (((strikeIndex * 8 + Math.min(attacks, 7)) * 4 + (BAND_CODES[pos.band] ?? 3)) * 2 + (inMelee(pos, target) ? 1 : 0)) * 2 + (prone ? 1 : 0);
        const cached = perTarget.get(key);
        if (cached !== undefined) return cached;
        const { state, c } = this;
        let modifier = strike.bonus - attackPenalty(c, strike, target, attacks) - statusPenalty(c, strike.melee ? "melee" : "ranged") + effectBonus(c, "attack") - gripPenalty(c, strike);
        let circumstance = prone ? 2 : 0;
        // Taunted: −1 against anyone but the guardian.
        if (c.tauntedBy && c.tauntedBy !== target.id && isActive(state.byId.get(c.tauntedBy) ?? {})) circumstance = Math.max(circumstance, 1);
        if (isShaken(c)) circumstance = Math.max(circumstance, state.moraleRules.group.shakenAttackPenalty);
        if (nonlethalAgainst(state, c, target) && !strike.nonlethal) circumstance = Math.max(circumstance, 2);
        modifier -= circumstance;
        if (!strike.melee) {
            const penalty = rangePenalty(strike, distanceTo(pos, target));
            if (penalty === null) {
                perTarget.set(key, null);
                return null;
            }
            modifier -= penalty;
        }
        let flank = 0;
        if (strike.melee) {
            const others = target.meleeId !== null && inMelee(pos, target)
                ? this.allies.filter((ally) => ally.meleeId === target.meleeId && canAct(ally)).length
                : 0;
            flank = flankChance(state, others + 1);
        }
        const feinted = !isOffGuard(target) && offGuardTo(target, c, strike.melee);
        const ac = armorClass(target, { ranged: !strike.melee, coverBonus: coverFor(state, target), flanked: feinted });
        const plain = degreeDistribution(modifier, ac);
        const flanked = flank > 0 ? degreeDistribution(modifier, ac - (target.cond.offGuard || target.cond.prone ? 0 : 2)) : plain;
        const finds = targetingChance(c);
        const hitChance = finds * ((1 - flank) * plain[SUCCESS] + flank * flanked[SUCCESS]);
        const critChance = finds * ((1 - flank) * plain[CRITICAL_SUCCESS] + flank * flanked[CRITICAL_SUCCESS]);
        // Earlier attacks in the plan stand in for earlier attacks with this weapon.
        // Pack Attack: allies within reach of the target (those in its Melee).
        const packAllies = c.strikeExtras?.length && target.meleeId !== null ? this.allies.filter((ally) => ally.meleeId === target.meleeId).length : 0;
        const extras = { bonus: forcefulBonus(strike, attacks), offGuardChance: isOffGuard(target) || feinted ? 1 : flank, packAllies };
        const damage = hitChance * expectedHitDamage(c, strike, target, false, extras) + critChance * expectedHitDamage(c, strike, target, true, extras);
        const result = { damage, hitChance: hitChance + critChance };
        perTarget.set(key, result);
        return result;
    }

    // What the free riders a Strike lists (a venom, Improved Grab) add to a hit, times the chance to hit.
    freeRiderGain(strike, target, hitChance) {
        if (!strike.attackEffects?.length || !hitChance) return 0;
        let gain = 0;
        for (const [index, spell] of (this.c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (trigger?.event !== "strike" || trigger.cost !== "free") continue;
            if (!strike.attackEffects.includes(trigger.attackEffect) && !strike.attackEffects.includes(spell.plan.source?.slug)) continue;
            for (const { target: affected, damage, worth } of this.spellEffect(index, spell, [target], 0)) {
                if (affected !== target) continue;
                gain += targetValue(this.state, target, this.c) * (Math.min(1, damage / remainingHp(target)) + worth * ROUND_TO_KILL);
            }
        }
        return hitChance * gain;
    }

    // spellExpectation, cached for the decision.
    spellEffect(index, spell, targets, attacks, actions) {
        const key = `${index}|${actions ?? 0}|${Math.min(attacks, 2)}|${targets.map((target) => target.id).join(",")}`;
        let cached = this.spellCache.get(key);
        if (cached === undefined) {
            cached = spellExpectation(this.state, this.c, spell, targets, attacks, actions);
            this.spellCache.set(key, cached);
        }
        return cached;
    }

    // Expected damage this creature takes from one enemy's Attack of Opportunity.
    aooLoss(pos, node) {
        let loss = 0;
        for (const [index, enemy] of this.enemies.entries()) {
            if (!inMelee(pos, enemy) || !enemy.reactions?.aoo || enemy.reactionUsed || !canAct(enemy)) continue;
            // provoked is a bit mask of enemy indices that already used their reaction in this plan.
            const bit = index < 30 ? 1 << index : 0;
            if (bit && node.provoked & bit) continue;
            node.provoked |= bit;
            loss += this.enemyStrikeDamage(enemy, node.shield, 0);
        }
        return this.profile.selfPreservation * this.ownValue * Math.min(1, loss / remainingHp(this.c));
    }

    enemyStrikeDamage(enemy, shieldRaised, attacks) {
        const { c } = this;
        let best = 0;
        for (const strike of enemy.strikes ?? []) {
            if (!strike.melee || !strikeUsable(enemy, strike)) continue;
            const modifier = strike.bonus - multipleAttackPenalty(strike, attacks) - statusPenalty(enemy, "melee") + effectBonus(enemy, "attack");
            const ac = armorClass(c, { shieldRaised });
            const dist = degreeDistribution(modifier, ac);
            best = Math.max(best, targetingChance(enemy) * (dist[SUCCESS] * expectedHitDamage(enemy, strike, c, false) + dist[CRITICAL_SUCCESS] * expectedHitDamage(enemy, strike, c, true)));
        }
        return best;
    }

    // How much damage the creature should expect next round at this position.
    exposure(node) {
        const { state, c } = this;
        const pos = node.pos;
        const ac = armorClass(c, { shieldRaised: node.shield }) - (node.prone && !c.cond.prone ? 2 : 0) + (!node.prone && c.cond.prone ? 2 : 0);
        // Enemies spread their attention over everyone they can reach: stepping
        // back doesn't make an enemy forget you, it just costs it attacks.
        const share = 1 / Math.max(1, this.defenders);
        const cover = coverFor(state, c);
        let total = 0;
        let biggestHit = 0;
        for (const enemy of this.enemies) {
            if (!canAct(enemy) || enemy.cond.fleeing) continue;
            const engagedHere = inMelee(pos, enemy);
            // A melee enemy that must Stride first keeps its remaining Strikes, so
            // stepping back only costs it its weakest attacks.
            const strides = engagedHere ? 0 : stridesToEngage({ band: enemy.band, meleeId: null, speed: enemy.speed }, { band: pos.band, meleeId: null });
            const melee = this.enemyRound(enemy, ac, Math.max(0, 3 - strides), "melee");
            const ranged = engagedHere ? 0 : this.enemyRound(enemy, ac + cover, 3, "ranged") * (pos.band === "far" ? 0.9 : 1);
            total += share * Math.max(melee, ranged);
            if (node.shield) biggestHit = Math.max(biggestHit, this.typicalHit(enemy));
        }
        return Math.max(0, total - this.shieldBlockSaving(node, total, biggestHit));
    }

    // Damage one hit of the enemy's best Strike does to this creature.
    typicalHit(enemy) {
        let best = 0;
        for (const strike of enemy.strikes ?? []) if (strikeUsable(enemy, strike)) best = Math.max(best, expectedHitDamage(enemy, strike, this.c, false));
        return best;
    }

    // Expected damage a raised shield's Shield Block prevents next round: its
    // Hardness off one hit, if the creature has the reaction and the shield
    // would survive the block.
    shieldBlockSaving(node, exposure, typicalHit) {
        const { c } = this;
        const shield = c.shield;
        if (!node.shield || !shield || shield.broken || !c.reactions?.shieldBlock || typicalHit <= 0) return 0;
        if (shield.hp - Math.max(0, typicalHit - shield.hardness) <= shield.bt) return 0;
        const blocked = Math.min(shield.hardness, typicalHit);
        return blocked * Math.min(1, exposure / typicalHit);
    }

    // Best value of a single Strike next turn from this position.
    offenseNext(node) {
        const { c } = this;
        let best = 0;
        for (const [index, strike] of (c.strikes ?? []).entries()) {
            if (!strikeUsable(c, strike)) continue;
            for (const target of this.enemies) {
                let factor = 1;
                if (strike.melee && !inMelee(node.pos, target)) {
                    const strides = stridesToEngage({ band: node.pos.band, meleeId: null, speed: c.speed }, target);
                    factor = strides === 1 ? 0.6 : 0.25;
                }
                const pos = strike.melee ? { band: "engaged", melee: "new", newWith: target.id } : node.pos;
                const expectation = this.strikeExpectation(strike, index, target, 0, pos, false);
                if (!expectation) continue;
                const value = targetValue(this.state, target, c) * Math.min(1, expectation.damage / remainingHp(target)) * factor;
                if (value > best) best = value;
            }
        }
        return best;
    }

    terminal(node) {
        const key = this.positionKey(node);
        let cached = this.terminalCache.get(key);
        if (cached === undefined) {
            const exposureValue = this.ownValue * Math.min(1.5, this.exposure(node) / remainingHp(this.c));
            cached = NEXT_TURN_WEIGHT * this.profile.aggression * this.offenseNext(node) - this.profile.selfPreservation * exposureValue;
            this.terminalCache.set(key, cached);
        }
        return cached;
    }
}

function child(node, action, cost, value, changes = {}) {
    return {
        value: node.value + value,
        pos: changes.pos ?? node.pos,
        shield: changes.shield ?? node.shield,
        prone: changes.prone ?? node.prone,
        attacks: node.attacks + (changes.attacks ?? (changes.attack ? 1 : 0)),
        used: node.used + cost,
        damage: changes.damage ?? node.damage,
        provoked: node.provoked,
        moved: node.moved || !!changes.moved,
        casts: changes.cast !== undefined ? [...node.casts, changes.cast] : node.casts,
        first: node.first ?? action
    };
}

// Is a reload weapon empty at this point of the plan? Fired since its last reload in the plan, or empty when the turn began.
function emptyNow(c, node, index, strike) {
    const fired = node.casts.lastIndexOf(`fired${index}`);
    const loaded = node.casts.lastIndexOf(`loaded${index}`);
    if (fired === -1 && loaded === -1) return !!c.unloaded?.has(strike.name);
    return fired > loaded;
}

function expand(ctx, node, actionsLeft) {
    const { state, c } = ctx;
    const children = [];
    const remaining = actionsLeft - node.used;
    if (remaining <= 0) return children;
    const mustWithdraw = c.mustWithdraw && !node.moved && !c.withdrewThisTurn && canMove(c);
    const inAnyMelee = node.pos.melee !== null;
    const mobile = canMove(c);
    // Restrained: no actions with the attack or manipulate traits. After a finisher: no attacks this turn.
    const restrained = !!c.cond.restrained;
    const noAttacks = !!c.noAttacksThisTurn || node.casts.includes("finisher");

    if (!mustWithdraw) {
        // Strikes: only the two best weapons against each target are worth planning with.
        for (const target of ctx.enemies) {
            if (target.status !== "active" || restrained || noAttacks) continue;
            const options = [];
            for (const [index, strike] of (c.strikes ?? []).entries()) {
                if (!strikeUsable(c, strike) || (strike.melee && !inMelee(node.pos, target))) continue;
                const expectation = ctx.strikeExpectation(strike, index, target, node.attacks, node.pos, node.prone);
                if (expectation && expectation.damage > 0) options.push({ index, strike, expectation });
            }
            options.sort((a, b) => b.expectation.damage - a.expectation.damage);
            for (const { index, strike, expectation } of options.slice(0, 2)) {
                // A crossbow or firearm fired already (before this turn, or earlier in this plan): reload first (C14).
                const reload = strike.reload && emptyNow(c, node, index, strike) ? strike.reload : 0;
                if (1 + reload > remaining) continue;
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                // A venom or Improved Grab the hit delivers for free.
                const gain = targetValue(state, target, c) * (Math.min(1, (before + expectation.damage) / hp) - Math.min(1, before / hp)) + ctx.freeRiderGain(strike, target, expectation.hitChance);
                const next = child(node, { type: "strike", targetId: target.id, strikeIndex: index, ...(reload ? { reload } : {}) }, 1 + reload, ctx.profile.aggression * gain, {
                    attack: true,
                    damage: { ...node.damage, [target.id]: before + expectation.damage },
                    ...(strike.reload ? { cast: `fired${index}` } : {})
                });
                if (!strike.melee && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
        }
        // Reloading on its own (the last action of a turn, so the next one starts with a shot):
        // worth part of the shot it makes ready.
        if (!restrained) {
            for (const [index, strike] of (c.strikes ?? []).entries()) {
                if (!strike.reload || strike.reload > remaining || !emptyNow(c, node, index, strike) || !strikeUsable(c, strike)) continue;
                let best = 0;
                for (const target of ctx.enemies) {
                    if (target.status !== "active") continue;
                    const expectation = ctx.strikeExpectation(strike, index, target, 0, node.pos, node.prone);
                    if (expectation?.damage > 0) best = Math.max(best, targetValue(state, target, c) * Math.min(1, expectation.damage / remainingHp(target)));
                }
                if (best > 0) children.push(child(node, { type: "reload", strikeIndex: index, actions: strike.reload }, strike.reload, 0.6 * ctx.profile.aggression * best, { cast: `loaded${index}` }));
            }
        }
        // Spells: each action variant and target set in reach, valued like
        // Strikes (damage as a share of HP, conditions as rounds of threat).
        // Healing an ally is worth its threat times the share of HP restored,
        // more the closer it is to dropping, and most when it's down. Allies
        // caught by damage, and foes healed, count against the cast.
        // Raging: no actions with the concentrate trait unless they have the rage trait.
        const raging = (c.activeBuffs ?? []).some((buff) => buff.noConcentrate);
        for (const [index, spell] of (c.spells ?? []).entries()) {
            if (!canCast(c, spell) || node.casts.includes(index)) continue;
            if (raging && (spell.plan?.traits ?? []).includes("concentrate") && !(spell.plan?.traits ?? []).includes("rage")) continue;
            if (spell.pool && node.casts.filter((other) => typeof other === "number" && c.spells[other].pool === spell.pool).length >= (c.spellPools[spell.pool] ?? 0)) continue;
            // A rider (Grab, Knockdown, Push) only as the action straight after the Strike that allows it.
            const rider = spell.plan?.trigger?.event === "strike";
            const riderTarget = rider && c.riderReady?.index === index && node.used === 0 ? state.byId.get(c.riderReady.targetId) : null;
            if (rider && !(riderTarget && isActive(riderTarget))) continue;
            for (const actions of spellVariants(spell)) {
                const info = describeSpell(spell.plan, actions);
                if (!info.actions || info.actions > remaining || (restrained && (info.manipulate || info.attack)) || (noAttacks && info.attack)) continue;
                const sets = rider ? [{ targets: [riderTarget] }] : targetSets(state, c, spell, {
                    enemies: ctx.enemies,
                    allies: ctx.alliesAndDown,
                    inMelee: (other) => inMelee(node.pos, other),
                    distance: (other) => distanceTo(node.pos, other),
                    meleeId: typeof node.pos.melee === "number" ? node.pos.melee : null
                }, actions);
                for (const set of sets) {
                    let gain = 0;
                    const damage = { ...node.damage };
                    for (const { target, damage: expected, worth, heal, benefit } of ctx.spellEffect(index, spell, set.targets, node.attacks, actions)) {
                        const ally = target.side === c.side;
                        const sign = ally ? -1 : 1;
                        const before = damage[target.id] ?? 0;
                        const hp = remainingHp(target);
                        const value = target.status === "active" ? targetValue(state, target, c) : Math.max(1, state.meanThreat?.[target.side] ?? 1);
                        gain += sign * value * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp) + worth * ROUND_TO_KILL);
                        if (heal > 0 && target.hp.max > 0) {
                            // Topping up a barely hurt ally is worth little; saving one near 0 HP, a lot.
                            const urgency = target.status !== "active" ? 3 : 2.5 * (1 - hpFraction(target)) ** 1.5;
                            gain += (ally ? 1 : -1) * value * (heal / target.hp.max) * urgency;
                        }
                        // A spell effect: good for an ally, bad for a foe (and the reverse for hindrances).
                        if (benefit) gain += (ally ? 1 : -1) * value * benefit * ROUND_TO_KILL;
                        if (!ally) damage[target.id] = before + expected;
                    }
                    // A swashbuckler's bravado action also brings panache: Precise Strike's damage for the fight and a finisher.
                    if (!c.panache && c.panacheStyle && (c.panacheStyle.bravado.includes(spell.plan?.source?.slug) || (spell.plan?.traits ?? []).includes("bravado"))) {
                        const threat = Math.max(1, state.threat?.get(c.id) ?? 1);
                        gain += 0.6 * ctx.ownValue * ROUND_TO_KILL * (3 * c.panacheStyle.precise + c.panacheStyle.finisherDice * 3.5 * 0.6) / threat;
                    }
                    if (gain <= 0) continue;
                    const next = child(node, { type: "cast", spellIndex: index, targetIds: set.targets.map((target) => target.id), actions, ...(rider ? { rider: true } : {}) }, info.actions, ctx.profile.aggression * gain, { attack: info.attack, damage, cast: index });
                    // Casting is a manipulate action: it provokes Attacks of Opportunity.
                    if (info.manipulate && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                    children.push(next);
                }
            }
        }
        // Rend: after two hits with the listed Strike on the same enemy this round, its damage again.
        if (c.rend && !c.rendUsed && node.used === 0) {
            const hits = (c.turnAttacks ?? []).slice(-2);
            const strikeIndex = (c.strikes ?? []).findIndex((strike) => strike.name.toLowerCase().includes(String(c.rend.strike ?? "").toLowerCase()));
            const target = hits.length === 2 && hits.every((hit) => hit.hit && hit.targetId === hits[0].targetId && hit.strike === c.strikes[strikeIndex]?.name) ? state.byId.get(hits[0].targetId) : null;
            if (strikeIndex >= 0 && target && isActive(target) && inMelee(node.pos, target)) {
                const expected = expectedHitDamage(c, c.strikes[strikeIndex], target, false);
                const hp = remainingHp(target);
                const before = node.damage[target.id] ?? 0;
                const gain = targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp));
                children.push(child(node, { type: "rend", targetId: target.id, strikeIndex }, 1, ctx.profile.aggression * gain, { damage: { ...node.damage, [target.id]: before + expected } }));
            }
        }
        // Draconic Frenzy and the like: several Strikes for fewer actions, at one target.
        for (const [abilityIndex, ability] of (c.multiStrikes ?? []).entries()) {
            if (restrained || noAttacks || ability.actions > remaining) continue;
            // A flourish (Flurry of Blows): once a turn.
            if (ability.oncePerTurn && (c.usedThisTurn?.has(ability.name) || node.casts.includes(`ms${abilityIndex}`))) continue;
            const order = multiStrikeOrder(c, ability);
            if (!order || order.some((index) => !strikeUsable(c, c.strikes[index]))) continue;
            for (const target of ctx.enemies) {
                if (target.status !== "active" || order.some((index) => c.strikes[index].melee && !inMelee(node.pos, target))) continue;
                // Hunted Shot, Twin Takedown: against the hunted prey only.
                if (ability.preyOnly && c.prey !== target.id) continue;
                let expected = 0;
                for (const [step, index] of order.entries()) {
                    // Double Slice: both at the current penalty, the second -2 unless agile.
                    const strike = ability.sameMap && step > 0 && !c.strikes[index].agile ? { ...c.strikes[index], bonus: c.strikes[index].bonus - 2 } : c.strikes[index];
                    expected += ctx.strikeExpectation(strike, strike === c.strikes[index] ? index : 3000 + abilityIndex * 64 + index, target, ability.sameMap ? node.attacks : node.attacks + step, node.pos, node.prone)?.damage ?? 0;
                }
                if (expected <= 0) continue;
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                const gain = targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp));
                children.push(child(node, { type: "multiStrike", ability: abilityIndex, targetId: target.id, actions: ability.actions }, ability.actions, ctx.profile.aggression * gain, {
                    attacks: order.length,
                    damage: { ...node.damage, [target.id]: before + expected },
                    ...(ability.oncePerTurn ? { cast: `ms${abilityIndex}` } : {})
                }));
            }
        }
        // Pounce: Stride to an enemy and Strike, as one action.
        for (const [abilityIndex, ability] of (c.charges ?? []).entries()) {
            if (restrained || noAttacks || !mobile || ctx.wavering || ability.actions > remaining) continue;
            if (ability.oncePerTurn && (c.usedThisTurn?.has(ability.name) || node.casts.includes(`ch${abilityIndex}`))) continue;
            const named = strikeNamed(c, ability.strike);
            const candidates = named >= 0 ? [named] : (c.strikes ?? []).map((strike, index) => index).filter((index) => c.strikes[index].melee);
            for (const target of ctx.enemies) {
                if (target.status !== "active" || inMelee(node.pos, target)) continue;
                if (stridesToEngage({ band: node.pos.band, meleeId: null, speed: c.speed }, target) > ability.strides) continue;
                const pos = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
                let best = null;
                for (const index of candidates) {
                    if (!strikeUsable(c, c.strikes[index])) continue;
                    // A charge's own Strike (its bonus or bigger damage) has a cache slot of its own.
                    const charged = chargeStrike(c.strikes[index], ability);
                    const expectation = ctx.strikeExpectation(charged, charged === c.strikes[index] ? index : 1000 + abilityIndex * 64 + index, target, node.attacks, pos, node.prone);
                    if (expectation && (!best || expectation.damage > best.damage)) best = { index, damage: expectation.damage };
                }
                if (!best || best.damage <= 0) continue;
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                const gain = targetValue(state, target, c) * (Math.min(1, (before + best.damage) / hp) - Math.min(1, before / hp));
                const next = child(node, { type: "charge", ability: abilityIndex, targetId: target.id, strikeIndex: best.index, actions: ability.actions }, ability.actions, ctx.profile.aggression * gain, {
                    attack: true,
                    pos,
                    damage: { ...node.damage, [target.id]: before + best.damage },
                    ...(ability.oncePerTurn ? { cast: `ch${abilityIndex}` } : {})
                });
                if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
        }
        // Strike activities (Wrestle, Intimidating Strike, Rhinoceros Charge): the Strike,
        // plus what a hit adds times the chance to hit; with Strides, only from outside the target's Melee.
        for (const [activityIndex, activity] of (c.strikeActivities ?? []).entries()) {
            if (restrained || noAttacks || activity.actions > remaining || (activity.oncePerFight && c.activitiesUsed?.has(activityIndex))) continue;
            // A finisher needs panache.
            if (activity.finisher && !c.panache) continue;
            if (activity.strides && (!mobile || ctx.wavering)) continue;
            const named = strikeNamed(c, activity.strike);
            const candidates = named >= 0 ? [named] : (c.strikes ?? []).map((strike, index) => index).filter((index) => c.strikes[index].melee);
            for (const target of ctx.enemies) {
                if (target.status !== "active") continue;
                if (activity.requires === "grabbed" && !(target.grabbedBy === c.id && (target.cond.grabbed || target.cond.restrained))) continue;
                if (activity.requires === "prone" && !target.cond.prone) continue;
                if (activity.requires === "free-hand" && state.list.some((other) => other.grabbedBy === c.id && (other.cond.grabbed || other.cond.restrained))) continue;
                let pos = node.pos;
                if (activity.strides) {
                    if (inMelee(node.pos, target) || stridesToEngage({ band: node.pos.band, meleeId: null, speed: c.speed }, target) > activity.strides) continue;
                    pos = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
                }
                let best = null;
                for (const index of candidates) {
                    const strike = c.strikes[index];
                    if (!strikeUsable(c, strike) || (strike.melee && !inMelee(pos, target))) continue;
                    const changed = chargeStrike(strike, activity);
                    const expectation = ctx.strikeExpectation(changed, changed === strike ? index : 2000 + activityIndex * 64 + index, target, node.attacks, pos, node.prone);
                    if (expectation && (!best || expectation.damage > best.expectation.damage)) best = { index, expectation };
                }
                if (!best) continue;
                const rider = strikeRiderValue(state, c, target, activity);
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                const expected = best.expectation.damage + best.expectation.hitChance * rider.damage;
                const gain = targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp) + best.expectation.hitChance * rider.worth * ROUND_TO_KILL);
                if (gain <= 0) continue;
                // Exacting Strike: a miss doesn't raise the penalty for what follows (worth a little).
                const exacting = activity.exacting ? 0.15 * (1 - best.expectation.hitChance) * gain : 0;
                const next = child(node, { type: "strikeActivity", index: activityIndex, targetId: target.id, strikeIndex: best.index, actions: activity.actions }, activity.actions, ctx.profile.aggression * (gain + exacting), {
                    attacks: activity.countsAs ?? 1,
                    pos,
                    damage: { ...node.damage, [target.id]: before + expected },
                    ...(activity.finisher ? { cast: "finisher" } : {})
                });
                if (activity.strides && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
        }
        // Rage and the like: once a fight, for its temporary HP and the damage it adds
        // over the rest of the fight (about three rounds of Strikes).
        for (const [buffIndex, buff] of (c.selfBuffs ?? []).entries()) {
            if (buff.actions > remaining || c.buffsUsed?.has(buff.name) || (c.activeBuffs ?? []).includes(buff) || node.casts.includes(`buff${buffIndex}`)) continue;
            const threat = Math.max(1, state.threat?.get(c.id) ?? 1);
            let perRound = 0;
            for (const strike of c.strikes ?? []) {
                const parts = buff.strikeDeltas?.[strike.name] ?? [];
                const average = parts.reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0);
                perRound = Math.max(perRound, average * 1.3);
            }
            const gain = ctx.ownValue * (ROUND_TO_KILL * 3 * perRound / threat + 0.5 * (buff.tempHp ?? 0) / Math.max(1, c.hp.max));
            if (gain > 0) children.push(child(node, { type: "selfBuff", index: buffIndex, actions: buff.actions }, buff.actions, gain, { cast: `buff${buffIndex}` }));
        }
        // A stance or another action that puts an effect on itself (C13): the
        // effect's benefit, as a spell's on itself, and a better Strike it brings.
        for (const [index, entry] of (c.selfEffects ?? []).entries()) {
            if (entry.actions > remaining || (c.effects ?? []).some((effect) => effect.key === `self:${entry.name}`) || node.casts.includes(`self${index}`)) continue;
            let benefit = effectBenefit(entry.model, c, conditionWorth, state.strikeShare?.get(c.id) ?? 1);
            if (entry.strikes?.length && ctx.enemies.length) {
                const ac = ctx.enemies.reduce((sum, enemy) => sum + armorClass(enemy), 0) / ctx.enemies.length;
                const expected = (strike) => {
                    const hit = Math.min(0.95, Math.max(0.05, (21 - (ac - strike.bonus)) / 20));
                    return hit * strike.damage.reduce((sum, part) => sum + ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (part.multiplier ?? 1), 0);
                };
                const best = (list) => Math.max(0, ...list.filter((strike) => strike.melee && strikeUsable(c, strike)).map(expected));
                // About three rounds of the better Strike, twice a round.
                benefit += 3 * 2 * Math.max(0, best(entry.strikes) - best(c.strikes ?? [])) / Math.max(1, state.threat?.get(c.id) ?? 1);
            }
            const gain = ctx.ownValue * benefit * ROUND_TO_KILL;
            if (gain > 0) children.push(child(node, { type: "selfEffect", index, actions: entry.actions }, entry.actions, gain, { cast: `self${index}` }));
        }
        const threatOf = Math.max(1, state.threat?.get(c.id) ?? 1);
        // Exploit Vulnerability (once a round): the weakness it'd bring on about three rounds of hits.
        if (c.exploit && node.used === 0 && !c.usedThisTurn?.has("exploit")) {
            for (const target of ctx.enemies) {
                if (target.status !== "active" || c.exploited?.targetId === target.id) continue;
                const gain = ctx.ownValue * ROUND_TO_KILL * 3 * 1.2 * exploitValue(c, target) / threatOf;
                children.push(child(node, { type: "exploit", targetId: target.id }, 1, gain));
            }
        }
        // Devise a Stratagem (once a round): the next Strike at the creature, rolled in advance with Intelligence and Strategic Strike's dice.
        if (c.stratagemFeature && node.used === 0 && c.stratagem?.round !== state.round && !noAttacks) {
            for (const target of ctx.enemies) {
                if (target.status !== "active") continue;
                const bonus = Math.max(0, ...Object.values(c.stratagemFeature.strikeBonus));
                const gain = targetValue(state, target, c) * Math.min(1, (c.stratagemFeature.dice * 3.5 * 0.65 + bonus * 0.05 * 10) / remainingHp(target));
                children.push(child(node, { type: "stratagem", targetId: target.id }, 1, gain));
            }
        }
        // Taunt (a guardian): an enemy within 30 feet attacks anyone else at −1, and off-guard.
        if (c.taunt && !raging && ctx.allies.length) {
            for (const target of ctx.enemies) {
                if (target.status !== "active" || target.tauntedBy === c.id || target.band === "far" || node.casts.includes("taunt")) continue;
                children.push(child(node, { type: "taunt", targetId: target.id }, 1, targetValue(state, target, c) * 0.2 * ROUND_TO_KILL, { cast: "taunt" }));
            }
        }
        // Overdrive (once a round, until it works): its Strikes' extra damage over about three rounds.
        if (c.overdrive && !c.overdriveDone && !c.usedThisTurn?.has("overdrive") && node.used === 0) {
            const odds = degreeDistribution(c.overdrive.modifier, levelDC(c.overdrive.level));
            const current = (c.activeBuffs ?? []).some((buff) => buff.name === c.overdrive.name) ? 1 : 0;
            const bonus = odds[3] * c.overdrive.intMod + odds[2] * Math.floor(c.overdrive.intMod / 2) + odds[1] * 1 - current;
            if (bonus > 0) children.push(child(node, { type: "overdrive" }, 1, ctx.ownValue * ROUND_TO_KILL * 3 * 1.2 * bonus / threatOf));
        }
        // Hunt Prey: a new prey when the current one is gone or a better target is in reach.
        if (c.huntPrey && node.used === 0 && !raging) {
            const current = c.prey ? state.byId.get(c.prey) : null;
            if (!current || !isActive(current)) {
                const threat = Math.max(1, state.threat?.get(c.id) ?? 1);
                const perRound = c.huntPrey.edge === "precision" ? 0.65 * 4.5 * (c.huntPrey.precisionDice ?? 1) : c.huntPrey.edge === "flurry" ? 0.25 * threat : 0.05 * threat;
                const prey = ctx.enemies.filter((enemy) => enemy.status === "active").sort((a, b) => targetValue(state, b, c) - targetValue(state, a, c))[0];
                if (prey) children.push(child(node, { type: "huntPrey", targetId: prey.id }, 1, ctx.ownValue * ROUND_TO_KILL * 3 * perRound / threat));
            }
        }
        // Engage a target.
        if (!ctx.wavering && mobile) {
            for (const target of ctx.enemies) {
                if (inMelee(node.pos, target)) continue;
                if (stridesToEngage({ band: node.pos.band, meleeId: null, speed: c.speed }, target) !== 1) continue;
                const pos = target.meleeId !== null
                    ? { band: "engaged", melee: target.meleeId, newWith: null }
                    : { band: "engaged", melee: "new", newWith: target.id };
                const next = child(node, { type: "stride", move: { kind: "engage", targetId: target.id } }, 1, 0, { pos, moved: false });
                if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
            if (node.pos.band === "far") {
                children.push(child(node, { type: "stride", move: { kind: "toNear" } }, 1, 0, { pos: { band: "near", melee: null, newWith: null } }));
            }
        }
        // A dropped weapon (Disarm): picking it up gives back its Strikes; a weakened grip, its -2.
        if (node.used === 0) {
            const best = (list) => Math.max(0, ...list.map((strike) => strike.bonus * 2 + strike.damage.reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0)));
            for (const name of c.dropped ?? []) {
                const all = best(c.strikes ?? []);
                const usable = best((c.strikes ?? []).filter((strike) => strikeUsable(c, strike)));
                const gain = all > 0 ? (all - usable) / all : 0;
                if (gain > 0) children.push(child(node, { type: "interact", what: "pickup", strikeName: name }, 1, 0.5 * ctx.ownValue * gain));
            }
            for (const [name] of c.weakGrip ?? []) children.push(child(node, { type: "interact", what: "regrip", strikeName: name }, 1, 0.1 * ctx.ownValue));
        }
        if (c.shield && !c.shield.broken && !node.shield) {
            children.push(child(node, { type: "raiseShield" }, 1, 0, { shield: true }));
        }
        // Battle Medicine: on a hurt ally in reach (or a downed one, or itself), once
        // per ally, at its best Treat Wounds DC, valued as healing.
        if (c.battleMedicine && !restrained) {
            const best = battleMedicineOdds(c).sort((a, b) => b.heal - a.heal)[0];
            for (const ally of [c, ...ctx.alliesAndDown]) {
                if (c.battleMedicineGiven?.has(ally.id) || ally.hp.value >= ally.hp.max || node.casts.includes(`bm${ally.id}`)) continue;
                const near = ally === c || ally.status !== "active" || (typeof node.pos.melee === "number" ? ally.meleeId === node.pos.melee : ally.meleeId === null && ally.band === node.pos.band);
                if (!near || best.heal <= 0) continue;
                const value = ally.status === "active" ? targetValue(state, ally, c) : Math.max(1, state.meanThreat?.[ally.side] ?? 1);
                const urgency = ally.status !== "active" ? 3 : 2.5 * (1 - hpFraction(ally)) ** 1.5;
                const gain = value * (Math.min(best.heal, ally.hp.max - Math.max(0, ally.hp.value)) / ally.hp.max) * urgency;
                const next = child(node, { type: "battleMedicine", targetId: ally.id, tier: best.tier }, 1, gain, { cast: `bm${ally.id}` });
                if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
        }
        // Retch: a sickened creature's Fortitude save to shake it off. Each point
        // of sickened is about a quarter of a round of its threat over the fight.
        if (node.used === 0 && c.cond.sickened > 0 && c.sickenedDC) {
            const [success, critical] = retchOdds(c);
            const points = success + critical * Math.min(2, c.cond.sickened);
            children.push(child(node, { type: "retch" }, 1, ctx.ownValue * 0.24 * points * ROUND_TO_KILL));
        }
        if (node.prone) {
            const next = child(node, { type: "stand" }, 1, 0, { prone: false });
            if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
        if (remaining >= 2 && canDoTask(state, c) && node.pos.band !== "far") {
            const objective = state.objective;
            const modifier = taskModifier(objective, c);
            const dist = degreeDistribution(modifier, objective.dc);
            const progress = dist[SUCCESS] + 2 * dist[CRITICAL_SUCCESS] - dist[CRITICAL_FAILURE] * (objective.needed / objective.dangerLimit);
            const worth = (state.setup.objectivePriority ?? 1) * ctx.profile.objective * Math.max(state.meanThreat.foes, 1) * 3;
            const next = child(node, { type: "task" }, 2, worth * Math.max(0, progress) / objective.needed);
            if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
    }
    // Moving away.
    if (!mobile) {
        // Immobilized, restrained or grabbed: nowhere to go.
    } else if (inAnyMelee) {
        const realMelee = node.pos.melee === c.meleeId && c.meleeId !== null;
        const stepOk = realMelee ? canStepOut(state, c) : (node.pos.melee === "new" && (state.byId.get(node.pos.newWith)?.reach ?? 5) <= 5);
        if (stepOk) children.push(child(node, { type: "step" }, 1, 0, { pos: { band: "near", melee: null, newWith: null }, moved: true }));
        else {
            const next = child(node, { type: "stride", move: { kind: "toNear" } }, 1, 0, { pos: { band: "near", melee: null, newWith: null }, moved: true });
            next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
    } else if (node.pos.band === "near") {
        children.push(child(node, { type: "stride", move: { kind: "toFar" } }, 1, 0, { pos: { band: "far", melee: null, newWith: null }, moved: true }));
    }
    return children;
}

// The scored one-step options for the creature right now (for tests and tuning).
export function scoreOptions(state, c) {
    const ctx = new PlanContext(state, c);
    const root = { value: 0, pos: { band: c.band, melee: c.meleeId, newWith: null }, shield: !!c.shield?.raised, prone: !!c.cond.prone, attacks: c.attacksThisTurn, used: 0, damage: {}, provoked: 0, moved: false, casts: [], first: null };
    const rootTerminal = ctx.terminal(root);
    return {
        stay: rootTerminal,
        options: expand(ctx, root, c.actionsLeft).map((node) => ({ action: node.first, value: node.value, terminal: ctx.terminal(node), score: node.value + ctx.terminal(node) }))
    };
}

// Returns the next action for the creature, or null to end its turn.
export function chooseAction(state, c) {
    const ctx = new PlanContext(state, c);
    const root = {
        value: 0,
        pos: { band: c.band, melee: c.meleeId, newWith: null },
        shield: !!c.shield?.raised,
        prone: !!c.cond.prone,
        attacks: c.attacksThisTurn,
        used: 0,
        damage: {},
        provoked: 0,
        moved: false,
        casts: [],
        first: null
    };
    const rootScore = ctx.terminal(root);
    let best = null;
    let bestScore = rootScore + 0.01;
    let beam = [root];
    const actionsLeft = c.actionsLeft;
    while (beam.length) {
        const children = [];
        for (const node of beam) children.push(...expand(ctx, node, actionsLeft));
        if (!children.length) break;
        for (const node of children) {
            node.score = node.value + ctx.terminal(node);
            if (node.score > bestScore) {
                bestScore = node.score;
                best = node;
            }
        }
        children.sort((a, b) => b.score - a.score);
        beam = children.slice(0, BEAM_WIDTH);
    }
    if (!best && c.mustWithdraw && !c.withdrewThisTurn) {
        // A withdrawing creature must move away even when it looks worse.
        const moves = expand(ctx, root, actionsLeft).filter((node) => node.moved);
        if (moves.length) best = moves[0];
    }
    return best?.first ?? null;
}

// Best hit chance and expected damage against any enemy, for the
// "can't meaningfully affect an opponent" morale trigger.
export function bestOffense(state, c) {
    const ctx = new PlanContext(state, c);
    let hit = 0;
    let damage = 0;
    for (const [index, strike] of (c.strikes ?? []).entries()) {
        if (!strikeUsable(c, strike)) continue;
        for (const target of ctx.enemies) {
            const pos = strike.melee ? { band: "engaged", melee: "new", newWith: target.id } : { band: c.band, melee: c.meleeId, newWith: null };
            const expectation = ctx.strikeExpectation(strike, index, target, 0, pos, false);
            if (!expectation) continue;
            hit = Math.max(hit, expectation.hitChance);
            damage = Math.max(damage, expectation.hitChance > 0 ? expectation.damage / expectation.hitChance : 0);
        }
    }
    return { hit, damage };
}
