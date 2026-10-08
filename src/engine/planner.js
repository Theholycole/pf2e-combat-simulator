// Expected-value planner. Each creature searches its possible plans for the
// rest of its turn with a small beam search, carries out the first action of
// the best plan, then plans again.
//
// Value units are "threat": damage to a target is worth the target's threat
// times the share of its remaining HP it removes, so a kill removes all of
// its threat. Exposure to enemy attacks costs the creature's own threat the
// same way, weighted by self-preservation.

import { degreeDistribution, CRITICAL_SUCCESS, SUCCESS, CRITICAL_FAILURE } from "./checks.js";
import { canAct, canMove, effectBonus, hpFraction, isActive, multipleAttackPenalty, statusPenalty, armorClass, targetingChance } from "./combatant.js";
import { canStepOut, flankChance, rangePenalty, stridesToEngage, DISTANCE_FEET } from "./space.js";
import { coverFor, expectedHitDamage, forcefulBonus, nonlethalAgainst } from "./actions.js";
import { isShaken } from "./morale.js";
import { canDoTask, taskModifier } from "./objectives.js";
import { canCast, describeSpell, spellExpectation, spellVariants, targetSets } from "./spells.js";

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
        let modifier = strike.bonus - multipleAttackPenalty(strike, attacks) - statusPenalty(c, strike.melee ? "melee" : "ranged") + effectBonus(c, "attack");
        let circumstance = prone ? 2 : 0;
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
        const ac = armorClass(target, { ranged: !strike.melee, coverBonus: coverFor(state, target) });
        const plain = degreeDistribution(modifier, ac);
        const flanked = flank > 0 ? degreeDistribution(modifier, ac - (target.cond.offGuard || target.cond.prone ? 0 : 2)) : plain;
        const finds = targetingChance(c);
        const hitChance = finds * ((1 - flank) * plain[SUCCESS] + flank * flanked[SUCCESS]);
        const critChance = finds * ((1 - flank) * plain[CRITICAL_SUCCESS] + flank * flanked[CRITICAL_SUCCESS]);
        // Earlier attacks in the plan stand in for earlier attacks with this weapon.
        const extras = { bonus: forcefulBonus(strike, attacks), offGuardChance: target.cond.offGuard || target.cond.prone ? 1 : flank };
        const damage = hitChance * expectedHitDamage(c, strike, target, false, extras) + critChance * expectedHitDamage(c, strike, target, true, extras);
        const result = { damage, hitChance: hitChance + critChance };
        perTarget.set(key, result);
        return result;
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
            if (!strike.melee) continue;
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
        for (const strike of enemy.strikes ?? []) best = Math.max(best, expectedHitDamage(enemy, strike, this.c, false));
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
        attacks: node.attacks + (changes.attack ? 1 : 0),
        used: node.used + cost,
        damage: changes.damage ?? node.damage,
        provoked: node.provoked,
        moved: node.moved || !!changes.moved,
        casts: changes.cast !== undefined ? [...node.casts, changes.cast] : node.casts,
        first: node.first ?? action
    };
}

function expand(ctx, node, actionsLeft) {
    const { state, c } = ctx;
    const children = [];
    const remaining = actionsLeft - node.used;
    if (remaining <= 0) return children;
    const mustWithdraw = c.mustWithdraw && !node.moved && !c.withdrewThisTurn && canMove(c);
    const inAnyMelee = node.pos.melee !== null;
    const mobile = canMove(c);
    // Restrained: no actions with the attack or manipulate traits.
    const restrained = !!c.cond.restrained;

    if (!mustWithdraw) {
        // Strikes: only the two best weapons against each target are worth planning with.
        for (const target of ctx.enemies) {
            if (target.status !== "active" || restrained) continue;
            const options = [];
            for (const [index, strike] of (c.strikes ?? []).entries()) {
                if (strike.melee && !inMelee(node.pos, target)) continue;
                const expectation = ctx.strikeExpectation(strike, index, target, node.attacks, node.pos, node.prone);
                if (expectation && expectation.damage > 0) options.push({ index, strike, expectation });
            }
            options.sort((a, b) => b.expectation.damage - a.expectation.damage);
            for (const { index, strike, expectation } of options.slice(0, 2)) {
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                const gain = targetValue(state, target, c) * (Math.min(1, (before + expectation.damage) / hp) - Math.min(1, before / hp));
                const next = child(node, { type: "strike", targetId: target.id, strikeIndex: index }, 1, ctx.profile.aggression * gain, {
                    attack: true,
                    damage: { ...node.damage, [target.id]: before + expectation.damage }
                });
                if (!strike.melee && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
        }
        // Spells: each action variant and target set in reach, valued like
        // Strikes (damage as a share of HP, conditions as rounds of threat).
        // Healing an ally is worth its threat times the share of HP restored,
        // more the closer it is to dropping, and most when it's down. Allies
        // caught by damage, and foes healed, count against the cast.
        for (const [index, spell] of (c.spells ?? []).entries()) {
            if (!canCast(c, spell) || node.casts.includes(index)) continue;
            if (spell.pool && node.casts.filter((other) => c.spells[other].pool === spell.pool).length >= (c.spellPools[spell.pool] ?? 0)) continue;
            // A rider (Grab, Knockdown, Push) only as the action straight after the Strike that allows it.
            const rider = spell.plan?.trigger?.event === "strike";
            const riderTarget = rider && c.riderReady?.index === index && node.used === 0 ? state.byId.get(c.riderReady.targetId) : null;
            if (rider && !(riderTarget && isActive(riderTarget))) continue;
            for (const actions of spellVariants(spell)) {
                const info = describeSpell(spell.plan, actions);
                if (!info.actions || info.actions > remaining || (restrained && (info.manipulate || info.attack))) continue;
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
        if (c.shield && !c.shield.broken && !node.shield) {
            children.push(child(node, { type: "raiseShield" }, 1, 0, { shield: true }));
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
