// Expected-value planner. Each creature searches its possible plans for the
// rest of its turn with a small beam search, carries out the first action of
// the best plan, then plans again.
//
// Value units are "threat": damage to a target is worth the target's threat
// times the share of its remaining HP it removes, so a kill removes all of
// its threat. Exposure to enemy attacks costs the creature's own threat the
// same way, weighted by self-preservation.

import { degreeDistribution, degreeOf, CRITICAL_SUCCESS, SUCCESS, FAILURE, CRITICAL_FAILURE } from "./checks.js";
import { adjustInstance, strikeContext } from "./damage.js";
import { effectBenefit } from "./effects.js";
import { allyStrike, bestAdvance, bestStrikeHard, inspirable, pincerPlan } from "./commander.js";
import { ikonOf, rendReady } from "./exemplar.js";
import { ammoLeft, canAct, canMove, effectBonus, gripPenalty, hpFraction, isActive, isOffGuard, multipleAttackPenalty, offGuardTo, statusPenalty, armorClass, strikeUsable, targetingChance } from "./combatant.js";
import { canStepOut, fliesNow, flankChance, isIncorporeal, levitating, mapGap, rangePenalty, sameMelee, stridesToEngage, DISTANCE_FEET } from "./space.js";
import { gridFlanked, gridStrides, planStride, strideGoes } from "./grid-fight.js";
import { distanceFeet, reaches as gridReaches, sightLine, squareOf } from "./grid.js";
import { attackPenalty, burningNow, coverFor, expectedHitDamage, forcefulBonus, nonlethalAgainst } from "./actions.js";
import { isShaken, leaderDownWorth } from "./morale.js";
import { canReact, castJustNow, chargeOn, hasOwnEffect, chargeStrike, ducksFromCoverFire, followsStrike, grantAooAllies, isRaging, levelDC, multiStrikeOrder, randomStrikeShare, sizeRank, strikeNamed, sweepActionIndex, withExtraDamage } from "./abilities.js";
import { canDoTask, taskModifier } from "./objectives.js";
import { approachPlace, atItem, canCarry, inArea, isMapObjective, strideToward, stridesFor, stridesToItem } from "./map-objectives.js";
import { alarmOpen, expectedDanger } from "./escalations.js";
import { bestDisable, isHazard } from "./hazards.js";
import { actionTraits, isHex, battleMedicineOdds, canCast, conditionWorth, describeSpell, exploitValue, poolCost, poolReady, retchOdds, spellExpectation, spellVariants, strikeRiderValue, targetSets, trickChance, worstCondition, traitsAllowed } from "./spells.js";
import { canSummon, summonPool } from "./summons.js";
import { flankableBy, mobileStride, offGuardFrom } from "./passives.js";
import { needsMet, targetNeedsMet } from "./needs.js";
import { calmedUntilHostility, pacifiedAll, spares } from "./pacify.js";
import { floorOf } from "./floors.js";
import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";
import { wardChance } from "./wards.js";
import { fooledBy, imageShare, imageShareOverRound, imagesNow } from "./images.js";
import { familiarFocusReady, familiarOf } from "./familiars.js";
import { luminanceTarget } from "./luminance.js";
import { hasConditional, strikeRollOptions } from "./effects.js";
import { consumableWeight } from "./consumables.js";

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

export function profileOf(c) {
    const base = ROLE_PROFILES[c.role] ?? ROLE_PROFILES.soldier;
    let { aggression, selfPreservation, objective } = base;
    if (c.dropAggression) {
        aggression *= 0.5;
        selfPreservation *= 2;
    }
    if (c.morale?.template === "cowardly") selfPreservation *= 1.5;
    // (2026-10-21: controlled — Dominate's victim acts for its controller, who spends it as it likes: its own safety doesn't count. Before,
    // a dominated wizard with Mirror Image to hand cast it on itself rather than blast the party, as its controller would order.)
    if (c.controlledBy) selfPreservation = 0;
    return { aggression, selfPreservation, objective };
}

// Per-round threat: expected damage per round against a typical enemy.
export function computeThreats(state) {
    state.threat = new Map();
    // M40: what it can still deal, for the morale gate's strength.
    state.potential = new Map();
    state.strikeShare = new Map();
    // (Its spells' damage alone: what reaches a flier aloft, out of its Strikes' reach — exposure.)
    state.spellThreat = new Map();
    for (const c of state.list) {
        if (!isActive(c)) {
            state.threat.set(c.id, 0);
            continue;
        }
        const enemies = state.list.filter((other) => other.side !== c.side && isActive(other));
        // (Calm: no hostile actions while it lasts.)
        if (!enemies.length || (!c.strikes?.length && !c.spells?.length) || c.acts === false || pacifiedAll(c)) {
            state.threat.set(c.id, 0);
            continue;
        }
        const sample = enemies.reduce((sum, enemy) => sum + armorClass(enemy), 0) / enemies.length;
        const target = enemies[0];
        const strikes = roundDamage(c, target, sample);
        const castable = spellDamages(state, c, target);
        const spells = Math.max(0, ...castable.map((entry) => entry.damage));
        state.threat.set(c.id, Math.max(strikes, spells));
        state.spellThreat.set(c.id, spells);
        state.potential.set(c.id, potentialDamage(c, castable, roundDamage(c, target, sample, 3, { grip: true })));
        // How much of its threat comes from Strikes: what an extra action or an attack bonus helps.
        state.strikeShare.set(c.id, strikes + spells > 0 ? strikes / Math.max(strikes, spells) : 1);
    }
    const mean = (side) => {
        const values = state.list.filter((c) => c.side === side && isActive(c) && c.kind !== "object" && !c.familiar).map((c) => state.threat.get(c.id) ?? 0);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };
    state.meanThreat = { party: mean("party"), foes: mean("foes") };
    // Playing for morale (M23): what each foe leader's fall would break.
    state.leaderDownWorth = new Map();
    if (state.setup?.situational?.playsForMorale) for (const c of state.list) if (c.morale?.leader && isActive(c)) state.leaderDownWorth.set(c.id, leaderDownWorth(state, c));
}

// Expected damage of each spell the creature can still cast, against one target (two for an area):
// [{ spell, damage, recharges }]. Its threat takes the best.
export function spellDamages(state, c, target) {
    const out = [];
    for (const spell of c.spells ?? []) {
        if (!canCast(c, spell)) continue;
        let damage = 0;
        let recharges = false;
        for (const actions of spellVariants(spell)) {
            const info = describeSpell(spell.plan, actions);
            if (info.recharge) recharges = true;
            const copies = info.area ? 2 : Math.max(1, Math.min(info.targets, 2));
            const [expected] = spellExpectation(state, c, spell, [target], 0, actions);
            if (expected) damage = Math.max(damage, expected.damage * copies);
        }
        // (S22: from an item tricked first, as likely as its check.)
        if (spell.trick) damage *= trickChance(spell.trick);
        out.push({ spell, damage, recharges });
    }
    return out;
}

// Its damage potential (M40; the user: "Strength should take into account potential damage. A melee disarmed and a
// caster who spent their best spell slots have much lower potential than they did previously"): its damage per round
// over the next POTENTIAL_ROUNDS rounds, spending what it has left well. Each round its best way still open: a limited
// spell or ability as many times as it has uses (one that recharges, once), otherwise its best Strike (a weakened grip
// counted; a dropped weapon gone) or at-will spell.
export const POTENTIAL_ROUNDS = 3;
export function potentialDamage(c, castable, strikes) {
    const limited = [];
    let atWill = 0;
    for (const { spell, damage, recharges } of castable) {
        if (!spell.pool && !recharges) atWill = Math.max(atWill, damage);
        else if (damage > 0) limited.push({ damage, pool: spell.pool ?? null, cost: poolCost(spell), once: recharges ? (spell.rechargeGroup ?? spell) : null });
    }
    const base = Math.max(strikes, atWill, 0);
    const pools = { ...(c.spellPools ?? {}) };
    const used = new Set();
    let total = 0;
    for (let round = 0; round < POTENTIAL_ROUNDS; round++) {
        let pick = null;
        for (const option of limited) {
            if (option.damage <= base || (option.pool && !((pools[option.pool] ?? 0) >= option.cost)) || (option.once && used.has(option.once))) continue;
            if (!pick || option.damage > pick.damage) pick = option;
        }
        if (!pick) {
            total += base;
            continue;
        }
        total += pick.damage;
        if (pick.pool) pools[pick.pool] -= pick.cost;
        if (pick.once) used.add(pick.once);
    }
    return total / POTENTIAL_ROUNDS;
}

// Expected damage from a round of Strikes (the third at half weight).
// attacks: how many Strikes the creature has left after moving. grip: a weakened grip's penalty (Disarm) counted.
// you: the share of hits that find the target (Mirror Image's images take the rest; a critical hit on one is a hit).
function roundDamage(c, target, ac, attacks = 3, { meleeOnly = false, rangedOnly = false, grip = false, you = 1 } = {}) {
    let best = 0;
    for (const strike of c.strikes ?? []) {
        if (!strikeUsable(c, strike)) continue;
        if (meleeOnly && !strike.melee) continue;
        if (rangedOnly && strike.melee) continue;
        const hit = expectedHitDamage(c, strike, target, false);
        const crit = expectedHitDamage(c, strike, target, true);
        let total = 0;
        for (let attack = 0; attack < attacks; attack++) {
            const modifier = strike.bonus - multipleAttackPenalty(strike, attack) - statusPenalty(c, strike.melee ? "melee" : "ranged") + effectBonus(c, "attack") - (grip ? gripPenalty(c, strike) : 0);
            const dist = degreeDistribution(modifier, ac);
            total += (dist[SUCCESS] * hit * you + dist[CRITICAL_SUCCESS] * (crit * you + hit * (1 - you))) * (attack === 2 ? 0.5 : 1);
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
        // The escorted creature and the item's carrier, as a protected creature (O2, O3).
        if (objective.kind === "escort" && objective.escortId === target.id) return weight * state.meanThreat.party * 1.5;
        if (objective.kind === "retrieve" && objective.item.carrierId === target.id) return weight * state.meanThreat.party * 1.5;
        if (objective.kind === "hold" && inArea(target)) return weight * state.meanThreat.party * 0.5;
    } else if (objective.kind === "target" && objective.targetId === target.id) {
        return weight * state.meanThreat.foes;
    } else if (objective.kind === "hold" && inArea(target)) {
        // A foe in the area stops the party holding it (O1).
        return weight * state.meanThreat.foes;
    }
    return 0;
}

function targetValue(state, target, attacker) {
    // (A familiar needn't be beaten to end the fight: worth a little of its master's threat — a share more with a patron ability its
    // master's hexes set off.)
    if (target.familiar) return (target.familiar.hexAbility ? 0.15 : 0.05) * (state.threat.get(target.familiar.masterId) ?? 0);
    let threat = state.threat.get(target.id) ?? 0;
    // A creature the simulator can't make attack (a swarm with only area
    // attacks) still has to be beaten to end the fight, so it's never worthless.
    if (target.kind !== "object") threat = Math.max(threat, 0.5 * (state.meanThreat?.[target.side] ?? 0), 1);
    // An alarm-raiser (E1): dropping it keeps the help away, worth what the help would deal.
    if (target.alarm && attacker.side !== target.side && alarmOpen(state)) threat += state.escalation.helpThreat ?? 0;
    // Playing for morale (M23): the foes' leader first, for the breaks its fall would bring.
    if (attacker.side === "party" && target.morale?.leader) threat += state.leaderDownWorth?.get(target.id) ?? 0;
    // (Calm: a foe any hostility would wake is left alone while its side has others standing — attacking it ends the Calm.)
    const waking = attacker.side !== target.side && calmedUntilHostility(target) && state.list.some((other) => other.side === target.side && other !== target && isActive(other) && !pacifiedAll(other));
    return (threat + objectiveBonus(state, target, attacker)) * (waking ? 0.2 : 1);
}

function remainingHp(target) {
    return Math.max(1, target.hp.value + target.hp.temp);
}

// Position helpers. A hypothetical position is { band, melee, newWith }:
// melee is a real Melee id, or "new" when engaging a lone target (newWith).
// (On the grid, 2026-10-21: at, where it stands — { square, size, reach } — when that's known: where it began, where a Stride toward a
// creature took it; reaching, there, by the squares.)
function rootPos(c) {
    return { band: c.band, melee: c.meleeId, newWith: null, ...(c.square ? { at: { square: c.square, size: c.size, reach: c.reach } } : {}) };
}

// A position's Melee for targetSets: its own, or — Strode into one this turn — the creature it closed on and that one's Melee.
function meleeOfPos(state, pos) {
    if (typeof pos.melee === "number") return { meleeId: pos.melee };
    if (pos.melee !== "new") return { meleeId: null };
    const newWith = state.byId.get(pos.newWith) ?? null;
    return { meleeId: typeof newWith?.meleeId === "number" ? newWith.meleeId : null, newWith };
}

function inMelee(pos, other) {
    if (pos.at && other.square) return gridReaches(pos.at, other) || gridReaches(other, pos.at);
    if (pos.melee === null) return false;
    if (pos.melee === "new") return other.id === pos.newWith;
    return other.meleeId === pos.melee;
}

// place: where the position is on the map (map objectives), or null.
function distanceTo(pos, other, place = null) {
    if (pos.at && other.square) return distanceFeet(pos.at, other);
    if (inMelee(pos, other)) return DISTANCE_FEET.engaged;
    const band = pos.band === "far" || other.band === "far" ? DISTANCE_FEET.far : DISTANCE_FEET.near;
    return place ? Math.max(band, mapGap({ areaFeet: place.area, exitFeet: place.exit }, other)) : band;
}

class PlanContext {
    constructor(state, c) {
        this.state = state;
        this.c = c;
        this.profile = profileOf(c);
        // (M38: the party lets a foe that gave up and is leaving go.)
        // (A charm: not the creature that charmed it.)
        this.enemies = state.list.filter((other) => other.side !== c.side && isActive(other) && !(c.side === "party" && other.moraleState?.leaving) && !spares(c, other));
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
        this.map = mapPlan(state, c, this.profile);
        this.alarm = alarmPlan(state, c, this);
        // Danger Regions (E3): what staying in each would cost at the round's end.
        this.dangers = (state.dangers ?? []).filter((danger) => danger.targets === "region" && c.regionFeet?.[danger.region]).map((danger) => ({ region: danger.region, cost: this.profile.selfPreservation * this.ownValue * Math.min(1.5, expectedDanger(danger, c) / remainingHp(c)) }));
        this.rootPlace = c.areaFeet !== undefined ? { area: c.areaFeet, exit: c.exitFeet } : null;
    }

    // Where a position is on the map (map objectives; null without one): a map
    // move's place, the creature it engaged (it's where that creature is), or where it began.
    placeOf(pos) {
        if (!this.rootPlace) return null;
        if (pos.place) return pos.place;
        if (pos.melee !== null && pos.melee !== this.c.meleeId) {
            const target = pos.melee === "new" ? this.state.byId.get(pos.newWith) : this.enemies.find((enemy) => enemy.meleeId === pos.melee);
            if (target?.areaFeet !== undefined) return { area: target.areaFeet, exit: target.exitFeet };
        }
        return this.rootPlace;
    }

    // Where a position is relative to escalation Regions: a move's own record, the
    // creature it engaged (in or out of them as it is), or where it began.
    regionsOf(pos) {
        if (pos.regions) return pos.regions;
        if (pos.melee !== null && pos.melee !== this.c.meleeId) {
            const target = pos.melee === "new" ? this.state.byId.get(pos.newWith) : this.enemies.find((enemy) => enemy.meleeId === pos.melee);
            if (target?.regionFeet) return target.regionFeet;
        }
        return this.c.regionFeet ?? {};
    }

    // Staying in danger: its cost, a little less the closer the edge.
    dangerValue(node) {
        if (!this.dangers.length) return 0;
        const regions = this.regionsOf(node.pos);
        let cost = 0;
        for (const danger of this.dangers) {
            const place = regions[danger.region];
            if (!place || place.to > 0) continue;
            const strides = stridesFor(this.c, place.edge);
            cost += danger.cost * (1 + 0.5 * strides / (1 + strides));
        }
        return -cost;
    }

    // A position out of any Melee in a band, staying where it is on the map.
    away(node, band) {
        const place = this.placeOf(node.pos);
        const pos = place ? { band, melee: null, newWith: null, place } : { band, melee: null, newWith: null };
        if (this.dangers.length) pos.regions = this.regionsOf(node.pos);
        return pos;
    }

    // Where a position stands on the grid: its own square, or beside the creature it engaged (that creature's square); null off it.
    gridAt(pos) {
        if (!this.state.grid || !this.c.square) return null;
        if (pos.at) return pos.at;
        const target = pos.melee === "new" ? this.state.byId.get(pos.newWith) : pos.melee !== null ? this.enemies.find((enemy) => enemy.meleeId === pos.melee) : null;
        return { square: target?.square ?? this.c.square, size: this.c.size, reach: this.c.reach };
    }

    // Whether a Stride of that kind goes anywhere from a position (on the grid: only where its square is known, and a way leads off it).
    strideGoes(pos, kind) {
        if (!this.state.grid || !this.c.square) return true;
        return Boolean(pos.at) && strideGoes(this.state, { ...this.c, square: pos.at.square }, { kind });
    }

    // Strides from a position to reach a creature: the grid's paths there, else the bands' count.
    strides(pos, target) {
        const at = this.gridAt(pos);
        if (at && target.square) return gridStrides(this.state, this.c, target, at.square);
        return stridesToEngage(this.mover(pos), target);
    }

    // The creature at a position, for stridesToEngage (whether it flies: aloft foes are out of reach otherwise).
    mover(pos) {
        const place = this.placeOf(pos);
        return { band: pos.band, meleeId: null, speed: this.c.speed, reach: this.c.reach, flies: fliesNow(this.c), ...(place ? { areaFeet: place.area, exitFeet: place.exit } : {}) };
    }

    // Strides to the objective's item from a plan's end (0 at it).
    itemStrides(node) {
        const item = this.state.objective.item;
        if (node.atItem) return 0;
        if (item.dropped) return stridesToItem(item, node.pos.band, this.c.speed, this.placeOf(node.pos));
        return stridesFor(this.c, this.placeOf(node.pos).area);
    }

    // A map objective's worth at a plan's end (O1–O3): a potential that grows as
    // the creature gets closer to doing its part, 1/(1 + Strides) of the worth.
    mapValue(node) {
        const map = this.map;
        if (!map) return 0;
        const { c } = this;
        const near = (strides) => 1 / (1 + strides);
        if (map.kind === "hold") {
            // Only one creature of a side needs to be inside.
            const value = map.worth * Math.max(map.others, near(stridesFor(c, this.placeOf(node.pos).area)));
            // Foes block the party: worth most when the party is there too.
            return c.side === "party" ? value : value * (0.5 + 0.5 * map.partyPresence);
        }
        if (node.carrying) return map.worth * (0.5 + 0.5 * near(stridesFor(c, this.placeOf(node.pos).exit)));
        // Picking it up is one more action.
        return map.worth * 0.5 * Math.max(map.others, near(this.itemStrides(node) + 1));
    }

    // Numeric key for a hypothetical position, for the terminal cache.
    positionKey(node) {
        const pos = node.pos;
        let melee = 0;
        if (pos.melee === "new") melee = 1_000_000 + (this.enemyIndex.get(pos.newWith) ?? 0);
        else if (pos.melee !== null) melee = pos.melee + 1;
        const key = (((melee * 4 + (BAND_CODES[pos.band] ?? 3)) * 2 + (node.shield ? 1 : 0)) * 2 + (node.prone ? 1 : 0)) * 2 + (node.images ? 1 : 0);
        let alarmKey = this.alarm ? Math.min(15, stridesFor(this.c, node.gong ?? 0)) * 2 + (node.alarmRaised ? 1 : 0) : 0;
        // In or out of each danger Region, and how far from its edge.
        if (this.dangers.length) {
            const regions = this.regionsOf(pos);
            for (const danger of this.dangers.slice(0, 3)) {
                const place = regions[danger.region];
                alarmKey = alarmKey * 8 + (!place || place.to > 0 ? 0 : 1 + Math.min(6, stridesFor(this.c, place.edge)));
            }
        }
        const place = this.placeOf(pos);
        if (!place) return key * 32 * 512 + alarmKey;
        const map = ((Math.min(15, stridesFor(this.c, place.area)) * 16 + Math.min(15, stridesFor(this.c, place.exit))) * 2 + (node.carrying ? 1 : 0)) * 2 + (node.atItem ? 1 : 0);
        return (key * 1024 + map) * 32 * 512 + alarmKey;
    }

    // roundDamage for an enemy against this creature, cached for the decision. you: the share of its hits that find this creature (Mirror
    // Image's images take the rest).
    enemyRound(enemy, ac, attacks, mode, you = 1) {
        const key = ((((this.enemyIndex.get(enemy.id) ?? 0) * 256 + (ac + 64)) * 4 + attacks) * 2 + (mode === "ranged" ? 1 : 0)) * 1001 + Math.round(you * 1000);
        let value = this.roundCache.get(key);
        if (value === undefined) {
            value = roundDamage(enemy, this.c, ac, attacks, mode === "ranged" ? { rangedOnly: true, you } : { meleeOnly: true, you });
            this.roundCache.set(key, value);
        }
        return value;
    }

    // Mirror Image's images on this creature next round (those it has, or a full set cast this turn: node.images), spent down over the
    // attacks the enemies they fool can be expected to make on it (their attention shared over its side): the share of their hits that find
    // it, or 1 without images.
    imageYou(node, ac, attacksOf) {
        const decoys = node.images;
        const now = decoys ? { count: Number(decoys.images) || 0, chances: decoys.chances ?? {} } : imagesNow(this.state, this.c);
        if (!(now?.count > 0)) return 1;
        const fooled = this.enemies.filter((enemy) => canAct(enemy) && !enemy.cond.fleeing && fooledBy(this.state, enemy, this.c));
        if (!fooled.length) return 1;
        const share = 1 / Math.max(1, this.defenders);
        let attacks = 0;
        const odds = [0, 0, 0, 0];
        for (const enemy of fooled) {
            attacks += share * attacksOf(enemy);
            let best = null;
            for (const strike of enemy.strikes ?? []) if (strikeUsable(enemy, strike) && (!best || strike.bonus > best.bonus)) best = strike;
            const dist = degreeDistribution((best?.bonus ?? 0) - statusPenalty(enemy, best?.melee ? "melee" : "ranged") + effectBonus(enemy, "attack"), ac);
            dist.forEach((value, index) => (odds[index] += value / fooled.length));
        }
        return imageShareOverRound(now.count, now.chances, odds, attacks);
    }

    // Expected damage of one Strike from a hypothetical position.
    // natural: Devise a Stratagem's d20, already rolled (the user, 2026-10-14: "assume the player will know the result"), for a
    // Strike that uses it.
    strikeExpectation(strike, strikeIndex, target, attacks, pos, prone, natural = null) {
        let perTarget = this.strikeCache.get(target);
        if (!perTarget) {
            perTarget = new Map();
            this.strikeCache.set(target, perTarget);
        }
        const { state, c } = this;
        const strategic = natural !== null && c.stratagemFeature?.strikeBonus?.[strike.name] !== undefined ? natural : null;
        const distance = distanceTo(pos, target, this.placeOf(pos));
        const numeric = ((((strikeIndex * 8 + Math.min(attacks, 7)) * 64 + Math.min(63, Math.ceil(distance / 5))) * 2 + (inMelee(pos, target) ? 1 : 0)) * 2 + (prone ? 1 : 0)) * 21 + (strategic ?? 0);
        // (On the grid: where it stands too — its line to the target, the cover on it.)
        const at = pos.at && target.square ? pos.at : null;
        const key = at ? `${numeric}|${at.square[0]},${at.square[1]}` : numeric;
        const cached = perTarget.get(key);
        if (cached !== undefined) return cached;
        // (2026-10-15: an effect's conditional attack bonus, as the roll would have it.)
        const conditional = hasConditional(c) ? strikeRollOptions(c, strike, target, strikeContext(c, strike)) : null;
        let modifier = strike.bonus - attackPenalty(c, strike, target, attacks) - statusPenalty(c, strike.melee ? "melee" : "ranged") + effectBonus(c, "attack", conditional) - gripPenalty(c, strike);
        let circumstance = prone ? 2 : 0;
        // Taunted: −1 against anyone but the guardian.
        if (c.tauntedBy && c.tauntedBy !== target.id && isActive(state.byId.get(c.tauntedBy) ?? {})) circumstance = Math.max(circumstance, 1);
        if (isShaken(c)) circumstance = Math.max(circumstance, state.moraleRules.group.shakenAttackPenalty);
        if (nonlethalAgainst(state, c, target) && !strike.nonlethal) circumstance = Math.max(circumstance, 2);
        modifier -= circumstance;
        const sight = at && state.grid ? sightLine(state.grid, { ...c, square: at.square }, target, state.list.filter((other) => isActive(other) && other.square && other !== c)) : null;
        if (sight && !sight.effect) {
            perTarget.set(key, null);
            return null;
        }
        if (!strike.melee) {
            const penalty = rangePenalty(strike, distance);
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
            // (On the grid: from its square, flanked or not; engaging, half the time where an ally already reaches the target.)
            const at = this.gridAt(pos);
            const geometric = at && target.square ? (pos.at ? (gridFlanked(state, { ...c, square: at.square }, target, canAct) ? 1 : 0) : this.allies.some((ally) => ally.square && canAct(ally) && gridReaches(ally, target)) ? 0.5 : 0) : null;
            flank = flankableBy(target, c) ? (geometric ?? flankChance(state, others + 1)) : 0;
        }
        // (B302: off-guard to it by its own passive — Surprise Attack's first round, Dread Striker.)
        const feinted = !isOffGuard(target) && (offGuardTo(target, c, strike.melee) || offGuardFrom(state, c, target, { melee: strike.melee }));
        const ac = armorClass(target, { ranged: !strike.melee, coverBonus: Math.max(coverFor(state, target), sight && !strike.melee ? sight.cover : 0), flanked: feinted });
        // (A stratagem's roll: the one degree it gives, with Intelligence.)
        const odds = strategic === null ? (dc) => degreeDistribution(modifier, dc) : (dc) => {
            const total = strategic + modifier + c.stratagemFeature.strikeBonus[strike.name];
            return [0, 1, 2, 3].map((degree) => (degree === degreeOf(total, dc, strategic) ? 1 : 0));
        };
        const plain = odds(ac);
        const flanked = flank > 0 ? odds(ac - (target.cond.offGuard || target.cond.prone ? 0 : 2)) : plain;
        // (Sanctuary on it: as likely to attack as its save to get through.)
        const finds = targetingChance(c) * wardChance(state, c, target);
        // (Mirror Image on it: a hit finds it at the images' odds, a critical hit on an image is a hit, and a failure does nothing.)
        const you = imageShare(state, c, target);
        const rolledHit = finds * ((1 - flank) * plain[SUCCESS] + flank * flanked[SUCCESS]);
        const rolledCrit = finds * ((1 - flank) * plain[CRITICAL_SUCCESS] + flank * flanked[CRITICAL_SUCCESS]);
        const hitChance = rolledHit * you + rolledCrit * (1 - you);
        const critChance = rolledCrit * you;
        // Earlier attacks in the plan stand in for earlier attacks with this weapon.
        // Pack Attack: allies within reach of the target (those in its Melee).
        const packAllies = c.strikeExtras?.length && target.meleeId !== null ? this.allies.filter((ally) => ally.meleeId === target.meleeId).length : 0;
        const extras = { bonus: forcefulBonus(strike, attacks), offGuardChance: isOffGuard(target) || feinted ? 1 : flank, packAllies };
        // (Strategic Strike's precision dice with the stratagem's roll.)
        const strategicDamage = strategic === null ? 0 : adjustInstance(target, strike.damage?.[0]?.type ?? "untyped", (c.stratagemFeature.dice ?? 1) * 3.5, true);
        const hitDamage = expectedHitDamage(c, strike, target, false, extras) + strategicDamage;
        const damage = hitChance * hitDamage + critChance * (expectedHitDamage(c, strike, target, true, extras) + 2 * strategicDamage);
        // (A failure's chance and a hit's damage, for Focused Assault's failure, B74.)
        const failChance = you < 1 ? 0 : finds * ((1 - flank) * plain[FAILURE] + flank * flanked[FAILURE]);
        const result = { damage, hitChance: hitChance + critChance, critChance, failChance, hitDamage };
        perTarget.set(key, result);
        return result;
    }

    // What a Strike's persistent damage counted for (about two rounds of what it adds to what the target already takes) that an earlier
    // Strike in the plan has already put on the target — persistent damage of a type doesn't stack (2026-10-21: a creature threw three
    // Acid Flasks in a row, each one's persistent acid counted). node.burning: "targetId:type" its Strikes have set.
    repeatBurn(node, strike, target, expectation) {
        if (!node.burning?.length) return 0;
        let loss = 0;
        for (const part of strike.damage ?? []) {
            if (!part.persistent || !node.burning.includes(`${target.id}:${part.type}`)) continue;
            const each = ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (part.multiplier ?? 1);
            const amount = Math.max(0, adjustInstance(target, part.type, each) - burningNow(target, part.type));
            loss += 2 * amount * ((expectation.hitChance - expectation.critChance) + 2 * expectation.critChance);
        }
        return Math.min(loss, expectation.damage);
    }

    // What the free riders a Strike lists (a venom, Improved Grab) add to a hit, times the chance to hit.
    // Splash on the creatures around the target (a bomb's, a scatter weapon's; C16):
    // good on foes, bad on allies and on itself. A bomb splashes on a miss too.
    splashGain(strike, target, hitChance) {
        if (!strike.splashKind || target.meleeId === null || target.meleeId === undefined) return 0;
        const amount = strike.splashAmount ?? (strike.damage ?? []).filter((part) => part.splash).reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0);
        if (amount <= 0) return 0;
        const chance = strike.splashKind === "bomb" ? Math.min(0.95, hitChance + 0.35) : hitChance;
        let gain = 0;
        for (const other of this.state.list) {
            if (other === target || other.status !== "active" || other.meleeId !== target.meleeId) continue;
            const value = targetValue(this.state, other, this.c);
            gain += (other.side === this.c.side ? -1 : 1) * value * Math.min(1, amount / remainingHp(other));
        }
        return chance * gain;
    }

    freeRiderGain(strike, target, hitChance) {
        if (!hitChance) return 0;
        let gain = 0;
        const listed = strike.attackEffects ?? [];
        for (const [index, spell] of (this.c.spells ?? []).entries()) {
            const trigger = spell.plan?.trigger;
            if (trigger?.event !== "strike" || trigger.cost !== "free") continue;
            if (!listed.includes(trigger.attackEffect) && !listed.includes(spell.plan.source?.slug) && !(trigger.strikes ?? []).includes(String(strike.name ?? "").toLowerCase())) continue;
            // (U4: a poison on the weapon, as long as doses are left.)
            if (spell.kind === "item" && !poolReady(this.c, spell)) continue;
            // (A critical hit's only: about a fifth of the hits.)
            const share = (trigger.on ?? []).length === 1 && trigger.on[0] === "criticalSuccess" ? 0.2 : 1;
            for (const { target: affected, damage, worth } of this.spellEffect(index, spell, [target], 0)) {
                if (affected !== target) continue;
                gain += share * targetValue(this.state, target, this.c) * (Math.min(1, damage / remainingHp(target)) + worth * ROUND_TO_KILL);
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

    // A move's: the damage of every reaction it sets off, as actions.js provoke has them (2026-10-21, the user: ghosts sinking into the
    // floor "should still be worried about reactive strikes or any reaction ability that can damage them") — Reactive Strike; a reaction
    // Strike on a move (Tail Swipe, Stand Still; Lurking Death from afar); a provoked ability (Tentacle Trip). Before, Reactive Strike
    // alone. None for a short one with Mobility (B302). Sinking into the floor (incorporeal): also the chance one stops it — a hit that
    // disrupts the move, a grab or a trip — so it stays where it was, open to the round it meant to miss.
    moveLoss(pos, node, kind) {
        if (mobileStride(this.c, { kind })) return 0;
        const { damage, stops } = this.moveReactions(pos, node);
        const scale = this.profile.selfPreservation * this.ownValue;
        let loss = scale * Math.min(1, damage / remainingHp(this.c));
        if (kind === "sink" && stops > 0) loss += stops * scale * Math.min(1.5, this.exposure({ ...node, pos }) / remainingHp(this.c));
        return loss;
    }

    // What hitting a creature whose touch burns (Fiery Body; a retaliation potion) costs this one, a hit's chance of it: its retaliations
    // that answer the Strike (unarmed; a melee weapon without reach where it says so), their damage on this creature (2026-10-22).
    retaliationLoss(strike, target, hitChance) {
        const { state, c } = this;
        let damage = 0;
        for (const entry of target.retaliations ?? []) {
            if ((state.round ?? 0) >= entry.until) continue;
            if (!strike.unarmed && !(entry.adjacentMelee && !((strike.reach ?? 5) > 5))) continue;
            damage += (entry.parts ?? []).reduce((sum, part) => sum + adjustInstance(c, part.type, (Number(part.dice) || 0) * ((Number(part.die) || 0) + 1) / 2 + (Number(part.bonus) || 0)), 0);
        }
        return damage > 0 ? this.profile.selfPreservation * this.ownValue * Math.min(1, hitChance * damage / remainingHp(c)) : 0;
    }

    // The reactions a move from pos sets off, one an enemy: { damage (expected), stops (the chance one of them stops the move) }. Marks
    // node.provoked as aooLoss does.
    moveReactions(pos, node) {
        const { state, c } = this;
        let damage = 0;
        let kept = 1;
        for (const [index, enemy] of this.enemies.entries()) {
            if (!canAct(enemy) || enemy.cond.fleeing || !canReact(enemy, "*")) continue;
            const bit = index < 30 ? 1 << index : 0;
            if (bit && node.provoked & bit) continue;
            const near = inMelee(pos, enemy);
            let answer = null;
            if (near && enemy.reactions?.aoo) {
                if (canReact(enemy, "Reactive Strike")) answer = { damage: this.enemyStrikeDamage(enemy, node.shield, 0), stops: 0 };
            } else {
                const far = (entry) => entry.within > 10 && entry.teleport && (entry.within >= 60 || pos.band !== "far" || enemy.band === "far");
                const reaction = (enemy.reactionStrikes ?? []).find((entry) => (entry.triggers.includes("move") || entry.triggers.includes("leave")) && (near ? !(entry.within > 10 && !entry.teleport) : far(entry)));
                if (reaction) answer = this.reactionStrikeLoss(enemy, reaction, node.shield);
                else answer = this.provokedLoss(enemy, pos);
            }
            if (!answer) continue;
            if (bit) node.provoked |= bit;
            damage += answer.damage;
            kept *= 1 - answer.stops;
        }
        return { damage, stops: 1 - kept };
    }

    // A reaction Strike's expected damage on this creature and the chance it stops its move (one that disrupts on a hit or a critical hit;
    // a grab or a trip in its place, about half the time).
    reactionStrikeLoss(enemy, reaction, shieldRaised) {
        if (reaction.requiresEffect && !hasOwnEffect(enemy, reaction.requiresEffect)) return null;
        if (reaction.skill) return { damage: 0, stops: ["grapple", "trip"].includes(reaction.skill) ? 0.5 : 0 };
        const { c } = this;
        const usable = (enemy.strikes ?? []).filter((strike) => strikeUsable(enemy, strike) && (reaction.ranged ? !strike.melee : strike.melee));
        const named = usable.filter((strike) => String(strike.name ?? "").toLowerCase().includes(String(reaction.strike ?? "").toLowerCase()));
        const extra = /^(\d+)d(\d+)$/.exec(String(reaction.extraDamage ?? ""));
        const ac = armorClass(c, { shieldRaised });
        let best = null;
        for (const strike of named.length && reaction.strike ? named : usable) {
            const modifier = strike.bonus - (reaction.penalty ?? 0) - statusPenalty(enemy, strike.melee ? "melee" : "ranged") + effectBonus(enemy, "attack");
            const dist = degreeDistribution(modifier, ac);
            const added = extra ? Number(extra[1]) * (Number(extra[2]) + 1) / 2 : 0;
            const hit = targetingChance(enemy) * (dist[SUCCESS] * (expectedHitDamage(enemy, strike, c, false) + added) + dist[CRITICAL_SUCCESS] * (expectedHitDamage(enemy, strike, c, true) + 2 * added));
            const stops = !reaction.disrupts ? 0 : targetingChance(enemy) * (reaction.disrupts === "critical" ? dist[CRITICAL_SUCCESS] : dist[SUCCESS] + dist[CRITICAL_SUCCESS]);
            if (!best || hit > best.damage) best = { damage: hit, stops };
        }
        return best;
    }

    // A provoked ability of the enemy's that answers a move from pos (actions.js provoke, spells.js provokedReaction: Tentacle Trip): its
    // expected damage, and about half a chance of stopping the move when it trips, holds or stops the creature.
    provokedLoss(enemy, pos) {
        const { state, c } = this;
        const near = (within) => (within === "reach" || Number(within) <= 10 ? inMelee(pos, enemy) : Number(within) >= 60 || pos.band !== "far" || enemy.band === "far");
        for (const spell of enemy.spells ?? []) {
            const trigger = spell.plan?.trigger;
            if (trigger?.event !== "provoke" || !(trigger.triggers ?? []).some((each) => each === "move" || each === "leave") || !near(trigger.within) || !canReact(enemy, spell.name)) continue;
            const [expected] = spellExpectation(state, enemy, spell, [c], 0);
            const holds = /"(?:prone|grabbed|restrained|immobilized|paralyzed|stunned|petrified)"/.test(JSON.stringify(spell.plan.resolution ?? {}));
            return { damage: expected?.damage ?? 0, stops: holds ? 0.5 : 0 };
        }
        return null;
    }

    // Expected damage this creature takes from one enemy's Attack of Opportunity.
    aooLoss(pos, node) {
        let loss = 0;
        for (const [index, enemy] of this.enemies.entries()) {
            // (B303: one kept for Reactive Strikes counts too.)
            if (!inMelee(pos, enemy) || !enemy.reactions?.aoo || !canReact(enemy, "Reactive Strike") || !canAct(enemy)) continue;
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
        const here = this.mover(pos);
        // A melee enemy that must Stride first keeps its remaining Strikes, so
        // stepping back only costs it its weakest attacks.
        const at = this.gridAt(pos);
        const stridesOf = (enemy) => (inMelee(pos, enemy) ? 0 : at && enemy.square ? Math.min(3, gridStrides(state, enemy, { ...c, square: at.square, meleeId: pos.band === "engaged" ? "here" : null })) : stridesToEngage({ band: enemy.band, meleeId: null, speed: enemy.speed, reach: enemy.reach, flies: fliesNow(enemy), areaFeet: enemy.areaFeet, exitFeet: enemy.exitFeet }, { band: pos.band, meleeId: pos.band === "engaged" ? "here" : null, flies: fliesNow(c), areaFeet: here.areaFeet, exitFeet: here.exitFeet }));
        // (Mirror Image: the images' share over the round's attacks — two a round from each enemy that can reach it, as their Strikes go.)
        const imagesYou = this.imageYou(node, ac, (enemy) => Math.min(2, Math.max(1, 3 - stridesOf(enemy))));
        // (A flier, choosing between aloft and a Melee: an enemy that doesn't fly can't reach it aloft, but its spells reach it either way —
        // counted at every position, its best of Strikes and spells, or hovering would look safe from casters whose Strikes can't reach.)
        const flier = fliesNow(c);
        for (const enemy of this.enemies) {
            if (!canAct(enemy) || enemy.cond.fleeing) continue;
            const engagedHere = inMelee(pos, enemy);
            const strides = stridesOf(enemy);
            const you = imagesYou < 1 && fooledBy(state, enemy, c) ? imagesYou : 1;
            const melee = this.enemyRound(enemy, ac, Math.max(0, 3 - strides), "melee", you);
            const shoot = engagedHere ? 0 : this.enemyRound(enemy, ac + cover, 3, "ranged", you) * (pos.band === "far" ? 0.9 : 1);
            // (Its spells past Mirror Image's images: they fool Strikes only.)
            const ranged = flier && !fliesNow(enemy) ? Math.max(shoot, state.spellThreat?.get(enemy.id) ?? 0) : shoot;
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
        if (!node.shield || !shield || shield.broken || !(c.reactions?.shieldBlock || shield.spell) || typicalHit <= 0) return 0;
        if (shield.hp - Math.max(0, typicalHit - shield.hardness) <= shield.bt) return 0;
        const blocked = Math.min(shield.hardness, typicalHit);
        return blocked * Math.min(1, exposure / typicalHit);
    }

    // Best value of a single Strike next turn from this position.
    offenseNext(node) {
        const { c } = this;
        let best = 0;
        for (const [index, strike] of (c.strikes ?? []).entries()) {
            if (!strikeUsable(c, strike) || (node.carrying && strike.hands === 2)) continue;
            for (const target of this.enemies) {
                let factor = 1;
                if (strike.melee && !inMelee(node.pos, target)) {
                    const strides = this.strides(node.pos, target);
                    // Further off on the map: less and less (0.25 at 2 Strides, as before).
                    factor = strides === 1 ? 0.6 : 0.25 / Math.max(1, strides - 1);
                }
                const pos = strike.melee ? { band: "engaged", melee: "new", newWith: target.id } : node.pos;
                const expectation = this.strikeExpectation(strike, index, target, 0, pos, false);
                if (!expectation) continue;
                const value = targetValue(this.state, target, c) * Math.min(1, expectation.damage / remainingHp(target)) * factor;
                if (value > best) best = value;
            }
        }
        // (Its close spells and abilities, as a melee Strike: in a Melee with the foe, or Strides off with the actions to spare for it — and,
        // with any, its others that reach from here, so only what the close one adds over them draws it in: Ignition's touch over its ray.)
        const closeList = this.closeCasts();
        if (closeList.length) {
            for (const far of this.farList) {
                for (const set of targetSets(this.state, c, far.spell, this.closeEnv(node.pos), far.actions)) {
                    for (const target of set.targets) {
                        if (target.side === c.side) continue;
                        const value = targetValue(this.state, target, c) * Math.min(1, far.damage / remainingHp(target));
                        if (value > best) best = value;
                    }
                }
            }
        }
        for (const close of closeList) {
            for (const target of this.enemies) {
                let factor = 1;
                if (!inMelee(node.pos, target)) {
                    const strides = this.strides(node.pos, target);
                    if (strides + close.cost > 3 || !this.closeReaches(close, target)) continue;
                    factor = strides === 1 ? 0.6 : 0.25 / Math.max(1, strides - 1);
                }
                const value = targetValue(this.state, target, c) * Math.min(1, close.damage / remainingHp(target)) * factor;
                if (value > best) best = value;
            }
        }
        return best;
    }

    // Its damaging spells and abilities that reach a foe only from a Melee with it — a troop's area about itself (Festival of Ruin), a
    // touch — and what each deals one foe (2026-10-21: before, only Strikes drew a creature in, and a flier aloft over a party that
    // can't come up to it, with no Strike of its own, hung back).
    closeCasts() {
        if (this.closeList) return this.closeList;
        const { state, c } = this;
        this.closeList = [];
        this.farList = [];
        this.closeReach = new Map();
        const sample = this.enemies[0];
        if (!sample) return this.closeList;
        const away = { band: "near", melee: null, newWith: null };
        for (const spell of c.spells ?? []) {
            // (Not the basic actions: a Trip's fall on a critical success is no reason to close in.)
            if (!canCast(c, spell) || spell.kind === "basic" || (spell.plan?.trigger && spell.plan.trigger.event !== "use") || spell.plan?.trigger?.followUp || spell.plan?.needs || spell.plan?.requires || spell.plan?.requiresFoe) continue;
            for (const actions of spellVariants(spell)) {
                const info = describeSpell(spell.plan, actions);
                if (!info.actions || info.actions > 3 || info.helpful || info.healing || info.self) continue;
                const far = targetSets(state, c, spell, this.closeEnv(away), actions).length > 0;
                const [expected] = spellExpectation(state, c, spell, [sample], 0, actions);
                if (expected?.damage > 0) (far ? this.farList : this.closeList).push({ spell, actions, cost: info.actions, damage: expected.damage });
            }
        }
        return this.closeList;
    }

    closeEnv(pos) {
        return { enemies: this.enemies, allies: [], inMelee: (other) => inMelee(pos, other), distance: (other) => distanceTo(pos, other), ...meleeOfPos(this.state, pos) };
    }

    // Whether a close cast reaches the foe from a Melee with it.
    closeReaches(close, target) {
        const key = `${close.spell.name}:${close.actions}:${target.id}`;
        let reaches = this.closeReach.get(key);
        if (reaches === undefined) {
            const sets = targetSets(this.state, this.c, close.spell, this.closeEnv({ band: "engaged", melee: "new", newWith: target.id }), close.actions);
            reaches = sets.some((set) => set.targets.includes(target));
            this.closeReach.set(key, reaches);
        }
        return reaches;
    }

    terminal(node) {
        // A runner that left: what its help is worth, and no more fighting.
        if (node.left) return this.alarmValue(node);
        // (Inside the floor — incorporeal: no one reaches it next round; next turn, slowed 1, it rises beside a foe of its choosing for a
        // Strike — as one from a Stride off, a little less for the action the slowing takes.)
        if (node.sunk) return NEXT_TURN_WEIGHT * this.profile.aggression * 0.8 * this.offenseNext({ ...node, pos: { band: "near", melee: null, newWith: null } });
        const key = this.positionKey(node);
        let cached = this.terminalCache.get(key);
        if (cached === undefined) {
            const exposureValue = this.ownValue * Math.min(1.5, this.exposure(node) / remainingHp(this.c));
            cached = NEXT_TURN_WEIGHT * this.profile.aggression * this.offenseNext(node) - this.profile.selfPreservation * exposureValue + this.mapValue(node) + this.alarmValue(node) + this.dangerValue(node);
            this.terminalCache.set(key, cached);
        }
        return cached - this.restless(node);
    }

    // Agitated with no Stride in the plan: the spell's damage as the turn ends, as exposure.
    restless(node) {
        const c = this.c;
        if (!c.cond?.agitated || node.strode || c.movedThisTurn || !c.agitation?.parts?.length) return 0;
        const amount = c.agitation.parts.reduce((sum, part) => sum + adjustInstance(c, part.type, part.dice * (part.die + 1) / 2), 0);
        return this.profile.selfPreservation * this.ownValue * Math.min(1.5, amount / remainingHp(c));
    }

    // Raising the alarm (E1), as a potential like a map objective's: a gong's
    // worth grows as the raiser gets closer; a runner's as it gets off the field.
    alarmValue(node) {
        const alarm = this.alarm;
        if (!alarm) return 0;
        const near = (strides) => 1 / (1 + strides);
        if (node.alarmRaised || node.left) return alarm.worth;
        if (alarm.kind === "gong") return alarm.worth * near(stridesFor(this.c, node.gong) + 1);
        const toLeave = node.pos.melee !== null ? 3 : node.pos.band === "far" ? 1 : 2;
        return alarm.worth * near(toLeave);
    }
}

function child(node, action, cost, value, changes = {}) {
    return {
        value: node.value + value,
        pos: changes.pos ?? node.pos,
        shield: changes.shield ?? node.shield,
        prone: changes.prone ?? node.prone,
        // (Mirror Image cast this turn: its images, for the next round's danger.)
        images: changes.images ?? node.images,
        attacks: node.attacks + (changes.attacks ?? (changes.attack ? 1 : 0)),
        used: node.used + cost,
        damage: changes.damage ?? node.damage,
        provoked: node.provoked,
        moved: node.moved || !!changes.moved,
        // (A Stride on the way — Agitate's agitated creature: none, its damage as the turn ends.)
        strode: node.strode || action?.type === "stride",
        casts: changes.cast !== undefined ? [...node.casts, ...[].concat(changes.cast)] : node.casts,
        // Map objectives (the place is on pos: see placeOf).
        carrying: changes.carrying ?? node.carrying,
        gong: changes.gong ?? node.gong,
        alarmRaised: changes.alarmRaised ?? node.alarmRaised,
        left: changes.left ?? node.left,
        sunk: changes.sunk ?? node.sunk,
        burning: changes.burning ?? node.burning,
        atItem: changes.atItem ?? (changes.pos && changes.pos !== node.pos && changes.pos.melee !== null ? false : node.atItem),
        first: node.first ?? action
    };
}

// What raising the alarm is worth to a raiser (E1), or null: two rounds of
// the help's damage to the party, in the planner's units (like a share of a
// kill); a runner also gives up its own two rounds.
function alarmPlan(state, c, ctx) {
    if (c.side !== "foes" || !c.alarm || !alarmOpen(state)) return null;
    const party = state.list.filter((o) => o.side === "party" && isActive(o) && o.kind !== "object");
    if (!party.length) return null;
    const hp = party.reduce((sum, o) => sum + remainingHp(o), 0) / party.length;
    const perDamage = (state.meanThreat?.party ?? 1) / hp;
    let worth = 2 * perDamage * (state.escalation.helpThreat ?? 0);
    if (c.alarm === "runner") worth -= 2 * perDamage * (state.threat.get(c.id) ?? 0);
    if (worth <= 0) return null;
    return { kind: c.alarm, worth: worth * ctx.profile.objective };
}

// What a map objective is worth to this creature (O1–O3), or null when it plays no part.
function mapPlan(state, c, profile) {
    const objective = state.objective;
    if (!isMapObjective(objective) || objective.status !== "open" || c.kind === "object" || c.areaFeet === undefined) return null;
    const near = (strides) => 1 / (1 + strides);
    const other = c.side === "party" ? "foes" : "party";
    const worth = (state.setup.objectivePriority ?? 1) * profile.objective * Math.max(state.meanThreat?.[other] ?? 0, 1) * 3;
    const able = (list) => list.filter((o) => o.kind !== "object" && canAct(o) && !o.swallowedBy);
    if (objective.kind === "hold") {
        const presence = (list) => Math.max(0, ...list.map((o) => near(stridesFor(o, o.areaFeet))));
        const allies = able(state.list.filter((o) => o !== c && o.side === c.side));
        // Worth two of the rounds it needs.
        return { kind: "hold", worth: worth * 2 / Math.max(1, objective.needed), others: presence(allies), partyPresence: presence(able(state.list.filter((o) => o.side === "party"))) };
    }
    if (objective.kind === "retrieve" && canCarry(state, c)) {
        const item = objective.item;
        if (item.carrierId && item.carrierId !== c.id) return null;
        // Another PC closer to the item does that part.
        const reach = (o) => (atItem(state, o) ? 0 : item.dropped ? stridesToItem(item, o.band, o.speed) : stridesFor(o, o.areaFeet));
        const others = able(state.list.filter((o) => o !== c && canCarry(state, o))).map((o) => near(reach(o) + 1));
        return { kind: "retrieve", worth, others: Math.max(0, ...others) };
    }
    return null;
}

// The flourish trait: one flourish action a turn (this turn, or earlier in this plan).
// The maneuvers PF2e limits to a target no more than one size larger than the creature (B313).
const SIZE_LIMITED = new Set(["grapple", "reposition", "shove", "trip"]);
const flourishUsed = (c, node) => !!c.usedThisTurn?.has("flourish") || node.casts.includes("flourish");

// A spell a magus can Spellstrike with: 1 or 2 actions, one target, a spell attack or a save, and castable now.
function spellstrikeSpell(c, spell) {
    // (S22: not one from an item it must trick first.)
    if (spell.kind === "basic" || spell.kind === "ability" || spell.kind === "item" || spell.trick || !canCast(c, spell)) return false;
    const info = describeSpell(spell.plan);
    const check = info.check;
    return (info.actions === 1 || info.actions === 2) && info.targets === 1 && !info.area && (check?.statistic === "spell-attack" || check?.roll === "save");
}

// Is a reload weapon empty at this point of the plan? Fired since its last reload in the plan, or empty when the turn began.
function emptyNow(c, node, index, strike) {
    const fired = node.casts.lastIndexOf(`fired${index}`);
    const loaded = node.casts.lastIndexOf(`loaded${index}`);
    if (fired === -1 && loaded === -1) return !!c.unloaded?.has(strike.name);
    return fired > loaded;
}

function expand(ctx, node, actionsLeft) {
    const children = expandAll(ctx, node, actionsLeft);
    // (Incorporeal, starting its turn inside the floor — space.js: its first action a move, out where it is or on to where it goes.)
    if (ctx.c.emerging && node.used === 0) {
        const moves = children.filter((next) => next.first?.type === "stride" || next.first?.type === "step");
        if (canMove(ctx.c)) moves.push(child(node, { type: "stride", move: { kind: "rise" } }, 1, 0, { moved: true }));
        return moves;
    }
    return children;
}

function expandAll(ctx, node, actionsLeft) {
    const { state, c } = ctx;
    const children = [];
    const remaining = actionsLeft - node.used;
    if (remaining <= 0 || node.left || node.sunk) return children;
    const mustWithdraw = c.mustWithdraw && !node.moved && !c.withdrewThisTurn && canMove(c);
    const inAnyMelee = node.pos.melee !== null;
    // (Levitating: up and down only — no Strides across the ground.)
    const mobile = canMove(c) && !levitating(c);
    // Restrained: no actions with the attack or manipulate traits. After a finisher: no attacks this turn.
    const restrained = !!c.cond.restrained;
    // A form that forbids attacks and spells (Vapor Form: "can't cast spells … or use actions that have the attack … trait").
    const formLimits = (c.effects ?? []).map((effect) => effect.model ?? {});
    // (Calm: no hostile actions — no attacks, and below, no spells or abilities but those that help.)
    const noAttacks = !!c.noAttacksThisTurn || node.casts.includes("finisher") || formLimits.some((model) => model.noAttacks) || pacifiedAll(c);
    const noSpells = formLimits.some((model) => model.noSpells);
    // Raging: no actions with the concentrate trait unless they have the rage trait.
    const raging = (c.activeBuffs ?? []).some((buff) => buff.noConcentrate) || (c.effects ?? []).some((effect) => effect.model?.noConcentrate);
    const threatOf = Math.max(1, state.threat?.get(c.id) ?? 1);

    if (!mustWithdraw) {
        const env = { state, c, ctx, node, remaining, actionsLeft, inAnyMelee, mobile, restrained, noAttacks, noSpells, raging, threatOf, children };
        expandStrikes(env);
        expandSpells(env);
        expandMultiStrikes(env);
        expandStrikeActivities(env);
        expandClassActions(env);
        expandTactics(env);
        expandOtherActions(env);
    }
    // Moving away.
    if (!mobile) {
        // Immobilized, restrained or grabbed: nowhere to go.
    } else if (inAnyMelee) {
        const realMelee = node.pos.melee === c.meleeId && c.meleeId !== null;
        const stepOk = realMelee ? canStepOut(state, c) : (node.pos.melee === "new" && (state.byId.get(node.pos.newWith)?.reach ?? 5) <= 5);
        if (stepOk) children.push(child(node, { type: "step" }, 1, 0, { pos: ctx.away(node, "near"), moved: true }));
        // Swift Leap, Jet (B70): away without provoking, where a Step can't go.
        else if (c.safeMove && c.safeMove.actions <= remaining && realMelee && !((c.safeMoveUntil ?? -Infinity) > (c.round ?? 0))) children.push(child(node, { type: "safeMove", actions: c.safeMove.actions }, c.safeMove.actions, 0, { pos: ctx.away(node, "near"), moved: true }));
        else if (ctx.strideGoes(node.pos, "toNear")) {
            const next = child(node, { type: "stride", move: { kind: "toNear" } }, 1, 0, { pos: ctx.away(node, "near"), moved: true });
            next.value -= ctx.moveLoss(node.pos, next, "toNear");
            children.push(next);
        }
    } else if (node.pos.band === "near" && ctx.strideGoes(node.pos, "toFar")) {
        children.push(child(node, { type: "stride", move: { kind: "toFar" } }, 1, 0, { pos: ctx.away(node, "far"), moved: true }));
    }
    // (Agitate: a Stride that keeps it beside its foes — around them —, the reactions to it as a move's; only while it has yet to Stride.)
    if (mobile && c.cond?.agitated && !node.strode && !c.movedThisTurn && node.pos.melee !== null && node.pos.melee === c.meleeId) {
        const next = child(node, { type: "stride", move: { kind: "around" } }, 1, 0, {});
        next.value -= ctx.moveLoss(node.pos, next, "around");
        children.push(next);
    }
    // Incorporeal (space.js): into the floor, out of everyone's reach until its next turn — not on a turn it started inside (ending that
    // one inside again is leaving the fight).
    if (mobile && isIncorporeal(c) && !node.carrying && !c.startedInside) {
        const next = child(node, { type: "stride", move: { kind: "sink" } }, 1, 0, { pos: { band: node.pos.band === "far" ? "far" : "near", melee: null, newWith: null }, moved: true, sunk: true });
        if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "sink");
        children.push(next);
    }
    return children;
}

// Strikes, reloading and a slinger's reload. (Part of expand, split up so the optimizer takes it.)
function expandStrikes(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, restrained, noAttacks, children } = env;
    // Strikes: only the two best weapons against each target are worth planning with.
    for (const target of ctx.enemies) {
        if (target.status !== "active" || restrained || noAttacks) continue;
        // (Devise a Stratagem rolled at it this round: its first Strike at it uses the roll the investigator already knows.)
        const natural = pendingStratagem(state, c, target) && !node.casts.includes("stratagem") ? c.stratagem.natural : null;
        const options = [];
        for (const [index, strike] of (c.strikes ?? []).entries()) {
            if (!strikeUsable(c, strike) || (strike.melee && !inMelee(node.pos, target))) continue;
            // (U2: no more bombs than it has left, those this plan throws counted.)
            if (strike.ammo && node.casts.filter((mark) => mark === `fired${index}`).length >= ammoLeft(c, strike)) continue;
            const expectation = ctx.strikeExpectation(strike, index, target, node.attacks, node.pos, node.prone, natural);
            if (expectation && expectation.damage > 0) options.push({ index, strike, expectation });
        }
        options.sort((a, b) => b.expectation.damage - a.expectation.damage);
        for (const { index, strike, expectation: rolled } of options.slice(0, 2)) {
            // A crossbow or firearm fired already (before this turn, or earlier in this plan): reload first (C14).
            const reload = strike.reload && emptyNow(c, node, index, strike) ? strike.reload : 0;
            if (1 + reload > remaining) continue;
            // (Its persistent damage counted once a target a plan — repeatBurn.)
            const repeat = ctx.repeatBurn(node, strike, target, rolled);
            const expectation = repeat > 0 ? { ...rolled, damage: rolled.damage - repeat } : rolled;
            const burns = (strike.damage ?? []).filter((part) => part.persistent).map((part) => `${target.id}:${part.type}`);
            const before = node.damage[target.id] ?? 0;
            const hp = remainingHp(target);
            // A venom or Improved Grab the hit delivers for free.
            // (U2: a PC's bomb weighed as a consumable.)
            const gain = (targetValue(state, target, c) * (Math.min(1, (before + expectation.damage) / hp) - Math.min(1, before / hp)) + ctx.freeRiderGain(strike, target, expectation.hitChance) + ctx.splashGain(strike, target, expectation.hitChance)) * consumableWeight(state, c, strike, [target]);
            const usesStratagem = natural !== null && c.stratagemFeature.strikeBonus[strike.name] !== undefined;
            const marks = [...(strike.reload || strike.ammo ? [`fired${index}`] : []), ...(usesStratagem ? ["stratagem"] : [])];
            const next = child(node, { type: "strike", targetId: target.id, strikeIndex: index, ...(reload ? { reload } : {}) }, 1 + reload, ctx.profile.aggression * gain, {
                attack: true,
                damage: { ...node.damage, [target.id]: before + expectation.damage },
                ...(marks.length ? { cast: marks } : {}),
                ...(burns.length ? { burning: [...(node.burning ?? []), ...burns] } : {})
            });
            if (!strike.melee && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            // (A body that burns at a touch — Fiery Body —: what an unarmed or close melee hit on it costs the attacker.)
            if (strike.melee && target.retaliations?.length) next.value -= ctx.retaliationLoss(strike, target, expectation.hitChance);
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
        // A gunslinger's slinger's reload (C17): one action that reloads (a reload-1 weapon)
        // and, with it, a Shove or a melee Strike at a foe in reach, or Demoralize or Create a Diversion.
        if (c.slingersReload && remaining >= 1 && !noAttacks) {
            for (const [index, strike] of (c.strikes ?? []).entries()) {
                if (strike.reload !== 1 || strike.ammo || !emptyNow(c, node, index, strike) || !strikeUsable(c, strike)) continue;
                let shot = 0;
                for (const target of ctx.enemies) {
                    if (target.status !== "active") continue;
                    const expectation = ctx.strikeExpectation(strike, index, target, 0, node.pos, node.prone);
                    if (expectation?.damage > 0) shot = Math.max(shot, targetValue(state, target, c) * Math.min(1, expectation.damage / remainingHp(target)));
                }
                let side = { gain: 0, side: null, sideIndex: null, targetId: null };
                const then = c.slingersReload.then;
                for (const target of ctx.enemies) {
                    if (target.status !== "active") continue;
                    const hp = remainingHp(target);
                    const value = targetValue(state, target, c);
                    if (then === "strike" && inMelee(node.pos, target)) {
                        for (const [meleeIndex, melee] of (c.strikes ?? []).entries()) {
                            if (!melee.melee || !strikeUsable(c, melee)) continue;
                            const expectation = ctx.strikeExpectation(melee, meleeIndex, target, node.attacks, node.pos, node.prone);
                            const gain = expectation ? value * Math.min(1, expectation.damage / hp) : 0;
                            if (gain > side.gain) side = { gain, side: "strike", sideIndex: meleeIndex, targetId: target.id };
                        }
                    }
                    const slugs = then === "shove" && inMelee(node.pos, target) ? ["shove"] : then === "demoralize-or-diversion" ? ["demoralize", "create-a-diversion"] : [];
                    for (const slug of slugs) {
                        const spellIndex = (c.spells ?? []).findIndex((spell) => spell.plan?.source?.slug === slug);
                        if (spellIndex < 0) continue;
                        let gain = 0;
                        for (const { target: affected, damage, worth } of ctx.spellEffect(spellIndex, c.spells[spellIndex], [target], node.attacks)) {
                            if (affected === target) gain += value * (Math.min(1, damage / hp) + worth * ROUND_TO_KILL);
                        }
                        if (gain > side.gain) side = { gain, side: slug, sideIndex: spellIndex, targetId: target.id };
                    }
                }
                const value = 0.6 * ctx.profile.aggression * shot + ctx.profile.aggression * side.gain;
                if (value > 0) children.push(child(node, { type: "slingersReload", strikeIndex: index, side: side.side, sideIndex: side.sideIndex, targetId: side.targetId }, 1, value, { cast: `loaded${index}`, attack: side.side === "strike" || side.side === "shove" }));
            }
        }
    }
}

// Spells, abilities and basic actions. (Part of expand, split up so the optimizer takes it.)
function expandSpells(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, restrained, noAttacks, noSpells, raging, children } = env;
    // Spells: each action variant and target set in reach, valued like
    // Strikes (damage as a share of HP, conditions as rounds of threat).
    // Healing an ally is worth its threat times the share of HP restored,
    // more the closer it is to dropping, and most when it's down. Allies
    // caught by damage, and foes healed, count against the cast.
    for (const [index, spell] of (c.spells ?? []).entries()) {
        if (!canCast(c, spell) || node.casts.includes(index)) continue;
        // (Raging or fascinated: no concentrate actions — the spell's traits or an item's activation's, 2026-10-15.)
        if (!traitsAllowed(c, actionTraits(spell), { raging })) continue;
        if (noSpells && (!spell.kind || spell.castsSpell)) continue;
        // (S22: a staff's charges, each spell its rank.)
        if (spell.pool && node.casts.reduce((sum, other) => sum + (typeof other === "number" && c.spells[other].pool === spell.pool ? poolCost(c.spells[other]) : 0), poolCost(spell)) > (c.spellPools[spell.pool] ?? 0)) continue;
        // A rider (Grab, Knockdown, Push) or a follow-up ("last action was a successful claw Strike") only as the
        // action straight after the Strike that allows it.
        const rider = spell.plan?.trigger?.event === "strike" || Boolean(spell.plan?.trigger?.followUp);
        const riderTarget = rider && (c.riderReady?.index === index || c.riderReady?.also?.includes(index)) && node.used === 0 ? state.byId.get(c.riderReady.targetId) : null;
        if (rider && !(riderTarget && isActive(riderTarget))) continue;
        // Its requirement an enemy nearby in a state (B83, Feed on Fear: "An enemy is under a fear effect or Dying within
        // 15 feet"): frightened, or down and dying.
        // (B133: a requirement it can't check, Bushwhack's unseen creature: not planned.)
        if (spell.plan?.requires === "requirement" && !spell.plan.needs) continue;
        // (B304: its needs — a corpse, a creature it holds, its last action — as things stand.)
        if (spell.plan?.needs && !needsMet(state, c, spell.plan.needs, { fresh: node.used === 0 })) continue;
        // (B262, Rage-Charged Breath: only while raging.)
        if (spell.plan?.requires === "raging" && !isRaging(c)) continue;
        // (B259, Inspiring Display: straight after a spell it cast.)
        if (spell.plan?.requires === "after-cast" && !(node.used === 0 && castJustNow(state, c, spell.plan.nonCantrip))) continue;
        // (B247, a seed shot only while its breath recharges: one of its Breath Weapons waiting out its recharge.)
        if (spell.plan?.requires === "breath-recharging" && !(c.spells ?? []).some((other) => other !== spell && /\bbreath\b/i.test(String(other.name ?? "")) && (c.rechargeUntil?.get(other.rechargeGroup ?? other) ?? -Infinity) > (c.round ?? state.round ?? 0))) continue;
        const foe = spell.plan?.requiresFoe;
        if (foe && !state.list.some((other) => other.side !== c.side && distanceTo(node.pos, other, ctx.placeOf(node.pos)) <= (foe.within ?? Infinity)
            && foe.conditions.some((condition) => (condition === "dying" ? other.status === "down" : isActive(other)) && (other.cond?.[condition] ?? 0) > 0))) continue;
        // Quickened Casting (B72): a spell of its rank or lower, one action fewer, once a fight.
        const quickens = c.quickenedCasting && !c.quickenedUsed && !node.casts.includes("quickened") && (!spell.kind || spell.castsSpell) && (c.quickenedCasting.maxRank == null || (spell.castRank ?? 1) <= c.quickenedCasting.maxRank);
        // (S22: an item it can't cast from by itself, Trick Magic Item first — an action more, worth as much as its check is likely,
        // unless it tricked the item already this turn. A stowed one, taken out first: its retrieve actions.)
        const trick = spell.trick && !c.usedThisTurn?.has(`tricked:${spell.item}`) ? 1 : 0;
        const draw = spell.draw && !c.itemsAtHand?.has(spell.item) && !node.casts.includes(`drawn${index}`) ? spell.draw.actions : 0;
        const extra = trick + draw;
        // (Taking it out alone, when the cast doesn't fit after it this turn — a 2-action spell from a backpack: worth part of the cast
        // it readies, as a reload is.)
        let readies = 0;
        for (const actions of spellVariants(spell)) {
            const info = describeSpell(spell.plan, actions);
            const quickFits = quickens && info.actions >= 2 && info.actions - 1 + extra <= remaining;
            const drawOnly = draw > 0 && draw <= remaining && info.actions + extra > remaining && !quickFits && node.used === 0;
            if (pacifiedAll(c) && !(info.helpful || info.healing || info.self || spell.drinker)) continue;
            if (!info.actions || (info.actions + extra > remaining && !quickFits && !drawOnly) || (restrained && (info.manipulate || info.attack || extra)) || (noAttacks && info.attack)) continue;
            const sets = rider ? [{ targets: [riderTarget] }] : targetSets(state, c, spell, {
                enemies: ctx.enemies,
                allies: ctx.alliesAndDown,
                inMelee: (other) => inMelee(node.pos, other),
                distance: (other) => distanceTo(node.pos, other, ctx.placeOf(node.pos)),
                ...meleeOfPos(state, node.pos)
            }, actions);
            // (B304: a target need — Drag's Prone creature — only at those.)
            // (B313: Grapple, Reposition, Shove and Trip at a creature no more than one size larger.)
            // (U17: an item's action, as that action.)
            const sized = SIZE_LIMITED.has(spell.kind === "basic" ? spell.plan?.source?.slug ?? String(spell.name ?? "").toLowerCase() : spell.itemAction?.slug ?? null)
                ? sets.filter((entry) => entry.targets.every((target) => target.side === c.side || sizeRank(target.size) <= sizeRank(c.size) + 1)) : sets;
            for (const set of spell.plan?.needs ? sized.filter((entry) => entry.targets.every((target) => target.side === c.side || targetNeedsMet(c, target, spell.plan.needs))) : sized) {
                let gain = 0;
                const damage = { ...node.damage };
                for (const { target, damage: expected, worth, heal, benefit, breaks = 0 } of ctx.spellEffect(index, spell, set.targets, node.attacks, actions)) {
                    const ally = target.side === c.side;
                    const sign = ally ? -1 : 1;
                    const before = damage[target.id] ?? 0;
                    const hp = remainingHp(target);
                    const value = target.status === "active" ? targetValue(state, target, c) : Math.max(1, state.meanThreat?.[target.side] ?? 1);
                    // Playing for morale (M23): a break takes it out like a kill, beyond the damage already counted.
                    const out = Math.min(1, Math.min(1, (before + expected) / hp) + breaks);
                    gain += sign * value * (out - Math.min(1, before / hp) + worth * ROUND_TO_KILL);
                    if (heal > 0 && target.hp.max > 0) {
                        // Topping up a barely hurt ally is worth little; saving one near 0 HP, a lot.
                        const urgency = target.status !== "active" ? 3 : 2.5 * (1 - hpFraction(target)) ** 1.5;
                        gain += (ally ? 1 : -1) * value * (heal / target.hp.max) * urgency;
                    }
                    // A spell effect: good for an ally, bad for a foe (and the reverse for hindrances).
                    if (benefit) gain += (ally ? 1 : -1) * value * benefit * ROUND_TO_KILL;
                    // (B146: the Strike after the maneuver — its best expected damage, about half of it when the maneuver must succeed.)
                    let follow = 0;
                    const then = spell.plan?.then;
                    if (then && !ally && target.status === "active") {
                        const named = then.strike ? strikeNamed(c, then.strike) : -1;
                        const choices = named >= 0 ? [named] : (c.strikes ?? []).map((strike, strikeIndex) => strikeIndex).filter((strikeIndex) => c.strikes[strikeIndex].melee);
                        for (const strikeIndex of choices) {
                            const strike = c.strikes[strikeIndex];
                            if (!strikeUsable(c, strike) || (strike.melee && !inMelee(node.pos, target) && !then.follow)) continue;
                            const expectation = ctx.strikeExpectation(strike, strikeIndex, target, node.attacks + (then.sameMap ? 0 : 1), node.pos, node.prone);
                            follow = Math.max(follow, (expectation?.damage ?? 0) * (then.onSuccess ? 0.5 : 1));
                        }
                        gain += value * (Math.min(1, (before + expected + follow) / hp) - Math.min(1, (before + expected) / hp));
                    }
                    if (!ally) damage[target.id] = before + expected + follow;
                }
                // A swashbuckler's bravado action also brings panache: Precise Strike's damage for the fight and a finisher.
                if (!c.panache && c.panacheStyle && (c.panacheStyle.bravado.includes(spell.plan?.source?.slug) || (spell.plan?.traits ?? []).includes("bravado"))) {
                    const threat = Math.max(1, state.threat?.get(c.id) ?? 1);
                    gain += 0.6 * ctx.ownValue * ROUND_TO_KILL * (3 * c.panacheStyle.precise + c.panacheStyle.finisherDice * 3.5 * 0.6) / threat;
                }
                if (gain <= 0) continue;
                // (U1: a PC's consumable only when it's worth clearly more than what else the turn holds; healing freely when it's about to
                // go down, or for a PC who is down.)
                gain *= consumableWeight(state, c, spell, set.targets, actions);
                // (A hex its familiar answers with its patron ability: about a fifth of a round of a foe's threat more.)
                if (isHex(spell) && familiarOf(state, c)?.familiar?.hexAbility) gain += 0.2 * ROUND_TO_KILL * Math.max(1, state.meanThreat?.[c.side === "party" ? "foes" : "party"] ?? 1);
                if (trick) gain *= trickChance(spell.trick);
                // (A lingering area: its later saves too — about half as much again.)
                if (spell.plan?.resolution?.lingering?.events?.length && (Number(spell.plan.resolution.lingering.durationSeconds) || 0) >= 12) gain *= 1.5;
                // (S22: a wand overcharged breaks it — the last thing it reaches for when another way does about as well.)
                if (spell.overcharge) gain *= 0.95;
                if (drawOnly) {
                    readies = Math.max(readies, gain);
                    continue;
                }
                const tricks = { ...(trick ? { trick: true } : {}), ...(draw ? { draw: true } : {}) };
                // (Mirror Image on itself: the images, for the next round's danger.)
                const images = spell.plan?.resolution?.kind === "image-decoys" && set.targets.length === 1 && set.targets[0] === c ? spell.plan.resolution.imageDecoys : undefined;
                if (info.actions + extra <= remaining) {
                    const next = child(node, { type: "cast", spellIndex: index, targetIds: set.targets.map((target) => target.id), actions, ...tricks, ...(rider ? { rider: true } : {}) }, info.actions + extra, ctx.profile.aggression * gain, { attack: info.attack, damage, cast: index, images });
                    // Casting is a manipulate action: it provokes Attacks of Opportunity.
                    if (info.manipulate && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                    children.push(next);
                }
                if (quickFits) {
                    const next = child(node, { type: "cast", spellIndex: index, targetIds: set.targets.map((target) => target.id), actions, quickened: true, ...tricks, ...(rider ? { rider: true } : {}) }, info.actions - 1 + extra, ctx.profile.aggression * gain, { attack: info.attack, damage, cast: [index, "quickened"], images });
                    if (info.manipulate && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                    children.push(next);
                }
            }
        }
        if (readies > 0) children.push(child(node, { type: "drawItem", spellIndex: index, actions: draw }, draw, 0.6 * ctx.profile.aggression * readies, { cast: `drawn${index}` }));
    }
}

// Rend, several Strikes for fewer actions, and Pounce. (Part of expand, split up so the optimizer takes it.)
function expandMultiStrikes(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, mobile, restrained, noAttacks, raging, children } = env;
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
        if (ability.flourish && flourishUsed(c, node)) continue;
        if (ability.oncePerFight && c.multiUsed?.has(ability.name)) continue;
        // (B258, Gaze Upon: its recharge.)
        if ((c.multiUntil?.get(ability.name) ?? -Infinity) > state.round) continue;
        const order = multiStrikeOrder(c, ability);
        if (!order || order.some((index) => !strikeUsable(c, c.strikes[index]))) continue;
        // A Strike at every enemy in its Melee: worth the sum over them.
        if (ability.each) {
            // (B120: Rampage's "is uncontrollable", Bladestorm's "holding six spirit blades": states the engine doesn't play.)
            // (B200, Power Through: not while Fatigued.)
            if (ability.requires && !(ability.requires === "first-attack" && node.attacks === 0 && (c.attacksThisTurn ?? 0) === 0) && !(ability.requires === "raging" && isRaging(c)) && !(ability.requires === "not-fatigued" && !c.cond.fatigued)) continue;
            const ranged = !c.strikes[order[0]].melee;
            // Where it Strikes from: here, or (B109, Mauling Rush) the Melee of a creature one Stride away.
            const places = [{ pos: node.pos, first: null }];
            if (ability.strides && !ranged && mobile && !ctx.wavering) {
                for (const target of ctx.enemies) {
                    if (target.status !== "active" || inMelee(node.pos, target) || ctx.strides(node.pos, target) > ability.strides) continue;
                    places.push({ pos: target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id }, first: target });
                }
            }
            for (const { pos, first } of places) {
                // (B120, Flurry of Pods: not at the creatures it already holds.)
                const near = ctx.enemies.filter((target) => target.status === "active" && (ranged || inMelee(pos, target)) && !(ability.notGrabbed && target.grabbedBy === c.id));
                const foes = (first ? [first, ...near.filter((target) => target !== first)] : near).slice(0, ability.max ?? Infinity);
                if (foes.length < 2) continue;
                const damage = { ...node.damage };
                let gain = 0;
                for (const [step, target] of foes.entries()) {
                    // (A different Strike at each, B74.)
                    const index = order[Math.min(step, order.length - 1)];
                    const base = withExtraDamage(c.strikes[index], ability.extraDamage);
                    const struck = ability.penalty ? { ...base, bonus: base.bonus - ability.penalty } : base;
                    const expected = ctx.strikeExpectation(struck, struck === c.strikes[index] ? index : 4000 + abilityIndex * 64 + index, target, ability.sameMap ? node.attacks : node.attacks + step, pos, node.prone)?.damage ?? 0;
                    const before = damage[target.id] ?? 0;
                    const hp = remainingHp(target);
                    gain += targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp));
                    damage[target.id] = before + expected;
                }
                if (gain <= 0) continue;
                const next = child(node, { type: "multiStrike", ability: abilityIndex, targetId: foes[0].id, actions: ability.actions }, ability.actions, ctx.profile.aggression * gain, { attacks: ability.countsAs ?? foes.length, damage, ...(pos !== node.pos ? { pos } : {}) });
                if (pos !== node.pos && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
                children.push(next);
            }
            continue;
        }
        for (const target of ctx.enemies) {
            if (target.status !== "active") continue;
            // (B108, Chase Prey: a Stride to it first, when it's that close.)
            let pos = node.pos;
            if (ability.strides && !inMelee(node.pos, target)) {
                if (!mobile || ctx.wavering || ctx.strides(node.pos, target) > ability.strides) continue;
                pos = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
            }
            if (order.some((index) => c.strikes[index].melee && !inMelee(pos, target))) continue;
            // Hunted Shot, Twin Takedown: against the hunted prey only. Maul: a creature it holds (B62).
            if (ability.preyOnly && c.prey !== target.id) continue;
            if (ability.requires === "grabbed" && !(target.grabbedBy === c.id && (target.cond.grabbed || target.cond.restrained))) continue;
            // (B107, Eviscerate: "has not attacked yet this turn".)
            if (ability.requires === "first-attack" && (node.attacks > 0 || (c.attacksThisTurn ?? 0) > 0)) continue;
            // (B113, Dual Stab: "against an Immobilized or Off-Guard target"; a requirement the engine doesn't know, never.)
            if (ability.requires === "off-guard" && !(isOffGuard(target) || target.cond.immobilized)) continue;
            if (ability.requires === "raging" && !isRaging(c)) continue;
            // (B186, Ravage: at a Paralyzed, Restrained or Unconscious creature.)
            if (ability.requires === "helpless" && !(target.cond.paralyzed || target.cond.restrained || target.cond.unconscious)) continue;
            if (ability.requires === "not-fatigued" && c.cond.fatigued) continue;
            // (B287, Radical Surgery: at a Prone or Immobilized creature.)
            if (ability.requires === "prone-or-immobilized" && !(target.cond.prone || target.cond.immobilized)) continue;
            if (ability.requires && !["grabbed", "first-attack", "off-guard", "raging", "helpless", "not-fatigued", "prone-or-immobilized"].includes(ability.requires)) continue;
            let expected = 0;
            // (B106: a second Strike only after a first that hits, worth that chance.)
            let firstHits = 1;
            // (C34: each Strike's chance to hit, for riders on one hit or on both.)
            const hitChances = [];
            for (const [step, index] of order.entries()) {
                // Double Slice: both at the current penalty, the second -2 unless agile (B62: not a monster's). A penalty on each
                // (Frenzied Slashes' -2).
                const second = ability.secondPenalty && step > 0 && !c.strikes[index].agile ? 2 : 0;
                // (Twin Feint, B74: the second against an off-guard target, about +2; after a first hit only, half that.)
                const feint = step === 1 && ability.secondOffGuard ? (ability.secondOffGuard === true ? 2 : 1) : 0;
                const own = ability.penalties?.[step] ?? 0;
                const base = withExtraDamage(c.strikes[index], ability.extraDamage);
                const strike = second || feint || ability.penalty || own ? { ...base, bonus: base.bonus - second + feint - (ability.penalty ?? 0) - own } : base;
                const expectation = ctx.strikeExpectation(strike, strike === c.strikes[index] ? index : 3000 + abilityIndex * 64 + index, target, ability.noMap ? 0 : ability.sameMap || ability.random ? node.attacks : node.attacks + step, pos, node.prone);
                // (B255: a random multi-Strike's Strike, as often as its faces give it.)
                expected += (expectation?.damage ?? 0) * (ability.ifFirstHits && step > 0 ? firstHits : 1) * randomStrikeShare(ability, c, index);
                if (step === 0) firstHits = expectation?.hitChance ?? 0;
                hitChances.push(expectation?.hitChance ?? 0);
            }
            if (expected <= 0) continue;
            const before = node.damage[target.id] ?? 0;
            const hp = remainingHp(target);
            // (Infernal Interference: stupefied 1 and no reactions on one hit, stupefied 3 on both — at their chances.)
            let riderWorth = 0;
            for (const entry of ability.hitRiders ?? []) {
                const chance = entry.atLeast <= 1 ? 1 - hitChances.reduce((miss, hit) => miss * (1 - hit), 1) : hitChances.reduce((all, hit) => all * hit, 1);
                const worth = (entry.conditions ?? []).reduce((sum, { slug, value }) => sum + Math.max(0, conditionWorth(slug, value, { mode: "fixed", value: 1, unit: "rounds" }) - (slug === "stupefied" ? conditionWorth(slug, target.cond.stupefied ?? 0, null) : 0)), 0) + (entry.noReactions ? 0.05 : 0);
                riderWorth += chance * worth;
            }
            const gain = targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp) + riderWorth * ROUND_TO_KILL);
            const next = child(node, { type: "multiStrike", ability: abilityIndex, targetId: target.id, actions: ability.actions }, ability.actions, ctx.profile.aggression * gain, {
                attacks: ability.countsAs ?? (ability.random ? Math.round(order.reduce((sum, index) => sum + randomStrikeShare(ability, c, index), 0)) : order.length),
                ...(pos !== node.pos ? { pos } : {}),
                damage: { ...node.damage, [target.id]: before + expected },
                ...(ability.oncePerTurn || ability.flourish ? { cast: [...(ability.oncePerTurn ? [`ms${abilityIndex}`] : []), ...(ability.flourish ? ["flourish"] : [])] } : {})
            });
            if (pos !== node.pos && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
    }
    // Pounce: Stride to an enemy and Strike, as one action.
    for (const [abilityIndex, ability] of (c.charges ?? []).entries()) {
        if (restrained || noAttacks || !mobile || ctx.wavering || ability.actions > remaining) continue;
        if (ability.oncePerTurn && (c.usedThisTurn?.has(ability.name) || node.casts.includes(`ch${abilityIndex}`))) continue;
        // (Aquatic Ambush, B70: once a fight, from hiding.)
        if (ability.oncePerFight && c.chargesUsed?.has(ability.name)) continue;
        // (B98: its recharge.)
        if ((c.chargeUntil?.get(ability.name) ?? -Infinity) > state.round) continue;
        if (ability.flourish && flourishUsed(c, node)) continue;
        const named = strikeNamed(c, ability.strike);
        const candidates = named >= 0 ? [named] : (c.strikes ?? []).map((strike, index) => index).filter((index) => c.strikes[index].melee);
        for (const target of ctx.enemies) {
            if (target.status !== "active" || inMelee(node.pos, target)) continue;
            if (ctx.strides(node.pos, target) > ability.strides) continue;
            const pos = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
            let best = null;
            for (const index of candidates) {
                if (!strikeUsable(c, c.strikes[index])) continue;
                // A charge's own Strike (its bonus or bigger damage) has a cache slot of its own.
                const charged = chargeStrike(c.strikes[index], chargeOn(c, ability, target.id));
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
                ...(ability.oncePerTurn || ability.flourish ? { cast: [...(ability.oncePerTurn ? [`ch${abilityIndex}`] : []), ...(ability.flourish ? ["flourish"] : [])] } : {})
            });
            if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
    }
}

// Strike activities, rage and an exemplar's ikons. (Part of expand, split up so the optimizer takes it.)
function expandStrikeActivities(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, mobile, restrained, noAttacks, children } = env;
    // Strike activities (Wrestle, Intimidating Strike, Rhinoceros Charge): the Strike,
    // plus what a hit adds times the chance to hit; with Strides, only from outside the target's Melee.
    for (const [activityIndex, activity] of (c.strikeActivities ?? []).entries()) {
        if (restrained || noAttacks || activity.actions > remaining || (activity.oncePerFight && c.activitiesUsed?.has(activityIndex))) continue;
        if (activity.flourish && flourishUsed(c, node)) continue;
        // (B199, Uncanny Pounce: only as it rolls initiative.)
        if (activity.initiative) continue;
        // "Frequency once per round" (Wriggling Beard).
        if (activity.oncePerTurn && (c.usedThisTurn?.has(activity.name) || node.casts.includes(`sa${activityIndex}`))) continue;
        // A finisher needs panache.
        if (activity.finisher && !c.panache) continue;
        // A follow-up's Strike (B68): straight after a Strike that allows it.
        if (activity.after && !(node.used === 0 && followsStrike(state, c, activity.after))) continue;
        // (B106: Berserk Slam's "is berserk", a state the engine doesn't play.)
        if (activity.requires === "berserk") continue;
        // (B126: a requirement the engine doesn't play — "The dragon is burrowed", "It's the first round of combat" — not planned.)
        if (activity.requires === "requirement") continue;
        if (activity.requires === "first-round" && state.round !== 1) continue;
        // (B147: straight after a spell it cast.)
        if (activity.requires === "after-cast" && !(node.used === 0 && castJustNow(state, c, activity.nonCantrip))) continue;
        if (activity.strides && (!mobile || ctx.wavering)) continue;
        // (C34, press: only with a multiple attack penalty — an attack made this turn.)
        if (activity.press && node.attacks < 1) continue;
        // Cover Fire (C19): a loaded firearm or crossbow, once a round.
        if (activity.coverFire && (c.usedThisTurn?.has("cover-fire") || node.casts.includes("coverFire"))) continue;
        // (2026-10-15: a concentrate one — Fear Gem's activation, Hunter's Aim — not while raging or fascinated.)
        if (activity.traits?.length && !traitsAllowed(c, activity.traits, { raging: isRaging(c) })) continue;
        // (U7: an item used by Striking — Fear Gem — as long as one is left, those this plan uses counted.)
        if (activity.pool && node.casts.filter((mark) => mark === `pool:${activity.pool}`).length >= (c.spellPools?.[activity.pool] ?? 0)) continue;
        const named = strikeNamed(c, activity.strike);
        // (U7: its Strike melee, ranged or either, as the item says.)
        // (Ammunition — an arrow: a weapon whose ammunition it is, PF2e's base type or, for "rounds", one of a firearm's rounds.)
        const loads = (strike) => !activity.ammunition || activity.ammunition.some((type) => strike.ammoType === type || String(strike.ammoType ?? "").startsWith(`${type}-`));
        const fits = (strike) => loads(strike) && (activity.range === "any" ? true : activity.range === "ranged" ? !strike.melee : strike.melee);
        const candidates = activity.coverFire
            ? (c.strikes ?? []).map((strike, index) => index).filter((index) => c.strikes[index].firearm && !c.strikes[index].melee && !emptyNow(c, node, index, c.strikes[index]))
            : named >= 0 ? [named] : activity.strike === "ranged" ? [] : (c.strikes ?? []).map((strike, index) => index).filter((index) => fits(c.strikes[index]));
        for (const target of ctx.enemies) {
            if (target.status !== "active") continue;
            // (At the creature it struck, unless it moves first: "Strides up to 10 feet and Strikes".)
            if (activity.after && !activity.strides && target.id !== c.lastStrike?.targetId) continue;
            if (activity.requires === "grabbed" && !(target.grabbedBy === c.id && (target.cond.grabbed || target.cond.restrained))) continue;
            if (activity.requires === "prone" && !target.cond.prone) continue;
            // (B206, Scorpion Sting: "Strikes an Off-Guard creature".)
            if (activity.requires === "off-guard" && !(isOffGuard(target) || target.cond.immobilized)) continue;
            // (B151, Shatter Defenses: "A Frightened creature is within melee reach".)
            if (activity.requires === "frightened" && !(target.cond.frightened > 0)) continue;
            if (activity.targetTraits && !activity.targetTraits.some((trait) => (target.traits ?? []).includes(trait))) continue;
            // (B105: Stunning Strike's "hit a foe earlier this turn with a weapon Strike", at that foe; after Strikes made, not planned.)
            if (activity.requires === "hit-earlier" && !(node.used === 0 && (c.turnAttacks ?? []).some((attack) => attack.hit && attack.targetId === target.id))) continue;
            // (B104: Terrifying Smite's "an enemy that has one of its allies within its reach".)
            if (activity.requires === "ally-adjacent" && !state.list.some((other) => other !== c && other.side === c.side && isActive(other) && sameMelee(other, target))) continue;
            if (activity.requires === "free-hand" && state.list.some((other) => other.grabbedBy === c.id && (other.cond.grabbed || other.cond.restrained))) continue;
            // (C30, Blessed Counterstrike: at an enemy that set off its champion's reaction since its last turn.)
            if (activity.requires === "champion-triggered" && !c.triggeredBy?.has(target.id)) continue;
            let pos = node.pos;
            if (activity.strides) {
                // (A follow-up's, "Strides up to 10 feet and Strikes", B68: also at a creature already in reach.)
                const here = inMelee(node.pos, target);
                if ((here && !activity.after) || (!here && ctx.strides(node.pos, target) > activity.strides)) continue;
                if (!here) pos = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
            }
            let best = null;
            // Cover Fire: the target ducks (+2 AC against it) unless its best attack is ranged; then +1 to hit.
            const used = activity.coverFire ? { ...activity, attackBonus: ducksFromCoverFire(target) ? -2 : 1 } : activity;
            for (const index of candidates) {
                const strike = c.strikes[index];
                if (!strikeUsable(c, strike) || (strike.melee && !inMelee(pos, target))) continue;
                const changed = chargeStrike(strike, used);
                // ("This Strike ignores their multiple attack penalty": as a first attack.)
                // ("using the previous Strike's multiple attack penalty": one attack fewer.)
                const expectation = ctx.strikeExpectation(changed, changed === strike ? index : 2000 + activityIndex * 64 + index, target, activity.noMap ? 0 : activity.previousMap ? Math.max(0, node.attacks - 1) : node.attacks, pos, node.prone);
                if (expectation && (!best || expectation.damage > best.expectation.damage)) best = { index, expectation };
            }
            if (!best) continue;
            const rider = strikeRiderValue(state, c, target, activity, c.strikes[best.index]);
            const before = node.damage[target.id] ?? 0;
            const hp = remainingHp(target);
            // (Focused Assault, B74: a failure deals the Strike's damage too.)
            const expected = best.expectation.damage + best.expectation.hitChance * rider.damage + (activity.failureDamage ? (best.expectation.failChance ?? 0) * (best.expectation.hitDamage ?? 0) : 0);
            // Set-Up Strike: off-guard for an ally's next attack, about a tenth more of its damage.
            const setUpWorth = activity.setUp ? best.expectation.hitChance * Math.max(0, ...ctx.allies.filter((ally) => ally !== c).map((ally) => allyStrike(state, ally, target)?.expected ?? 0)) * 0.12 / hp : 0;
            // (U7: a PC's item used by Striking weighed as a consumable.)
            const gain = targetValue(state, target, c) * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp) + best.expectation.hitChance * rider.worth * ROUND_TO_KILL + setUpWorth) * consumableWeight(state, c, activity, [target]);
            if (gain <= 0) continue;
            // Exacting Strike: a miss doesn't raise the penalty for what follows (worth a little).
            const exacting = activity.exacting ? 0.15 * (1 - best.expectation.hitChance) * gain : 0;
            // (B139: Off-Guard on itself costs, a guard helps, for about a round.)
            const selfWorth = activity.selfAfter?.length ? ctx.ownValue * ROUND_TO_KILL * effectBenefit({ rounds: 1, modifiers: activity.selfAfter.map((entry) => ({ on: "ac", value: entry.ac ?? -2 })), tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [] }, c, conditionWorth, state.strikeShare?.get(c.id) ?? 1) : 0;
            // (C34, Brutal Finish: its turn ends after it — what's left of the turn goes with it.)
            const next = child(node, { type: "strikeActivity", index: activityIndex, targetId: target.id, strikeIndex: best.index, actions: activity.actions }, activity.endsTurn ? remaining : activity.actions, ctx.profile.aggression * (gain + exacting) + selfWorth, {
                attacks: activity.noMap || activity.previousMap ? 0 : activity.countsAs ?? 1,
                pos,
                damage: { ...node.damage, [target.id]: before + expected },
                ...(activity.finisher || activity.coverFire || activity.flourish || activity.oncePerTurn || activity.pool ? { cast: [...(activity.finisher ? ["finisher"] : []), ...(activity.coverFire ? ["coverFire", ...(c.strikes[best.index].reload ? [`fired${best.index}`] : [])] : []), ...(activity.flourish ? ["flourish"] : []), ...(activity.oncePerTurn ? [`sa${activityIndex}`] : []), ...(activity.pool ? [`pool:${activity.pool}`] : [])] } : {})
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
    // An exemplar (C25–C27): Shift Immanence into a better ikon (once a round), and a
    // transcendence while the spark is in its ikon (it casts the spark out).
    if (c.exemplar && node.used === 0) {
        const threatHere = Math.max(1, state.threat?.get(c.id) ?? 1);
        const ikonWorth = (ikon) => {
            if (!ikon) return 0;
            let perRound = 0;
            for (const strike of c.strikes ?? []) {
                const extra = (ikon.model.strikeDeltas?.[strike.name] ?? []).reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0);
                perRound = Math.max(perRound, extra * 1.3);
            }
            return effectBenefit(ikon.model, c, conditionWorth, state.strikeShare?.get(c.id) ?? 1) + 3 * perRound / threatHere;
        };
        if (!c.usedThisTurn?.has("shift-immanence") && remaining >= 1) {
            const current = ikonWorth(ikonOf(c, c.spark));
            for (const ikon of c.exemplar.ikons) {
                if (ikon.slug === c.spark) continue;
                const gain = ctx.ownValue * (ikonWorth(ikon) - current) * ROUND_TO_KILL;
                if (gain > 0) children.push(child(node, { type: "shiftImmanence", slug: ikon.slug, actions: 1 }, 1, gain, { cast: "shift" }));
            }
        }
        for (const [index, entry] of c.exemplar.transcendences.entries()) {
            if (remaining < 1 || c.spark !== entry.ikon) continue;
            if (entry.kind === "rend" && rendReady(state, c, entry)) {
                const target = state.byId.get(c.lastHit.targetId);
                if (!target || target.status !== "active") continue;
                const expected = entry.dice * (entry.die + 1) / 2;
                // The spark comes back with a Shift (an action, once a round): about a round of immanence lost.
                const gain = targetValue(state, target, c) * Math.min(1, expected / remainingHp(target)) - ctx.ownValue * ROUND_TO_KILL * ikonWorth(ikonOf(c, c.spark)) / 3;
                if (gain > 0) children.push(child(node, { type: "transcend", index, targetId: target.id, actions: 1 }, 1, ctx.profile.aggression * gain, { cast: "transcend" }));
            }
            if (entry.kind === "heal" && c.hp.value < c.hp.max) {
                const heal = Math.min(entry.dice * 4.5, c.hp.max - c.hp.value);
                const urgency = 2.5 * (1 - hpFraction(c)) ** 1.5;
                const gain = ctx.ownValue * (heal / c.hp.max) * urgency;
                if (gain > 0) children.push(child(node, { type: "transcend", index, targetId: c.id, actions: 1 }, 1, gain, { cast: "transcend" }));
            }
        }
    }
    // (B183, Word of Advice: an ally's Stride and Strike with its extra damage, worth what that Strike does.)
    if (c.allyAdvance && c.allyAdvance.actions <= remaining && !node.casts.includes("ally-advance") && !(c.allyAdvance.oncePerTurn && c.usedThisTurn?.has(c.allyAdvance.name))) {
        const best = bestAdvance(state, c, ctx.enemies);
        const target = best ? state.byId.get(best.targetId) : null;
        if (target) {
            const before = node.damage[target.id] ?? 0;
            const hp = remainingHp(target);
            const gain = targetValue(state, target, c) * (Math.min(1, (before + best.expected) / hp) - Math.min(1, before / hp));
            if (gain > 0) children.push(child(node, { type: "allyAdvance", allyId: best.allyId, targetId: best.targetId, strikeIndex: best.strikeIndex, stride: best.stride, actions: c.allyAdvance.actions }, c.allyAdvance.actions, ctx.profile.aggression * gain, { cast: "ally-advance", damage: { ...node.damage, [target.id]: before + best.expected } }));
        }
    }
}

// A commander's tactics, Spellstrike and actions that put an effect on itself. (Part of expand, split up so the optimizer takes it.)
function expandClassActions(env) {
    const { state, c, ctx, node, remaining, restrained, noAttacks, raging, children } = env;
    // A commander's tactics (C21–C24): Strike Hard! (an ally's Strike), Pincer Attack
    // (off-guard to melee from the commander and the allies who answer), Banner's Inspiration.
    if (c.commander) {
        if (c.commander.strikeHard && remaining >= 2 && !node.casts.includes("strikeHard")) {
            const best = bestStrikeHard(state, c, ctx.enemies);
            const target = best ? state.byId.get(best.targetId) : null;
            if (target) {
                const before = node.damage[target.id] ?? 0;
                const hp = remainingHp(target);
                const gain = targetValue(state, target, c) * (Math.min(1, (before + best.expected) / hp) - Math.min(1, before / hp));
                if (gain > 0) children.push(child(node, { type: "strikeHard", allyId: best.allyId, targetId: best.targetId, strikeIndex: best.strikeIndex, actions: 2 }, 2, ctx.profile.aggression * gain, { cast: "strikeHard", damage: { ...node.damage, [target.id]: before + best.expected } }));
            }
        }
        if (c.commander.pincerAttack && remaining >= 1 && !node.casts.includes("pincer")) {
            const { responders, foes } = pincerPlan(state, c);
            let gain = 0;
            for (const foe of foes) {
                // +2 for about a round of melee attacks at it: roughly a tenth more of each one's damage.
                const expected = [c, ...responders].filter((attacker) => attacker.meleeId === foe.meleeId).reduce((sum, attacker) => sum + (allyStrike(state, attacker, foe)?.expected ?? 0), 0);
                gain += targetValue(state, foe, c) * Math.min(1, 0.15 * expected / remainingHp(foe));
            }
            if (responders.length && gain > 0) children.push(child(node, { type: "pincerAttack", actions: 1 }, 1, ctx.profile.aggression * gain, { cast: "pincer" }));
        }
        if (c.commander.bannersInspiration && remaining >= 1 && !node.casts.includes("banners") && !(c.commander.inspirationFlourish && flourishUsed(c, node))) {
            const allies = inspirable(state, c);
            const gain = allies.reduce((sum, ally) => sum + targetValue(state, ally, c) * (conditionWorth("frightened", ally.cond.frightened, null) - conditionWorth("frightened", ally.cond.frightened - 1, null)) * ROUND_TO_KILL, 0);
            if (gain > 0) children.push(child(node, { type: "bannersInspiration", actions: 1 }, 1, gain, { cast: ["banners", ...(c.commander.inspirationFlourish ? ["flourish"] : [])] }));
        }
    }
    // Spellstrike (C20): a melee Strike carrying a 1- or 2-action spell with a spell
    // attack (it hits as the Strike does) or a save (the target saves; a critical miss
    // loses it); two attacks for the penalty. Then Recharge Spellstrike, an action, or a conflux spell.
    if (c.spellstrike && !restrained && !noAttacks && !raging) {
        if (c.spellstrikeCharged && !node.casts.includes("spellstrike") && remaining >= 2) {
            for (const target of ctx.enemies) {
                if (target.status !== "active" || !inMelee(node.pos, target)) continue;
                let strikeBest = null;
                for (const [index, strike] of (c.strikes ?? []).entries()) {
                    if (!strike.melee || !strikeUsable(c, strike)) continue;
                    const expectation = ctx.strikeExpectation(strike, index, target, node.attacks, node.pos, node.prone);
                    if (expectation && (!strikeBest || expectation.damage > strikeBest.expectation.damage)) strikeBest = { index, expectation };
                }
                if (!strikeBest) continue;
                const hp = remainingHp(target);
                const value = targetValue(state, target, c);
                const before = node.damage[target.id] ?? 0;
                for (const [spellIndex, spell] of (c.spells ?? []).entries()) {
                    if (!spellstrikeSpell(c, spell) || node.casts.includes(spellIndex)) continue;
                    let spellDamage = 0;
                    let spellWorth = 0;
                    for (const { target: affected, damage, worth } of ctx.spellEffect(spellIndex, spell, [target], node.attacks)) {
                        if (affected !== target) continue;
                        spellDamage += damage;
                        spellWorth += worth;
                    }
                    const expected = strikeBest.expectation.damage + spellDamage;
                    const gain = value * (Math.min(1, (before + expected) / hp) - Math.min(1, before / hp) + spellWorth * ROUND_TO_KILL);
                    if (gain <= 0) continue;
                    children.push(child(node, { type: "spellstrike", targetId: target.id, strikeIndex: strikeBest.index, spellIndex, actions: 2 }, 2, ctx.profile.aggression * gain, {
                        attacks: 2,
                        damage: { ...node.damage, [target.id]: before + expected },
                        cast: ["spellstrike", ...(spell.pool ? [spellIndex] : [])]
                    }));
                }
            }
        }
        // Recharge Spellstrike: worth part of the Spellstrike it makes ready.
        if (!c.spellstrikeCharged && !node.casts.includes("recharge-spellstrike") && remaining >= 1) {
            let best = 0;
            for (const [spellIndex, spell] of (c.spells ?? []).entries()) {
                if (!spellstrikeSpell(c, spell)) continue;
                for (const target of ctx.enemies) {
                    if (target.status !== "active") continue;
                    for (const { target: affected, damage, worth } of ctx.spellEffect(spellIndex, spell, [target], 0)) {
                        if (affected === target) best = Math.max(best, targetValue(state, target, c) * (Math.min(1, damage / remainingHp(target)) + worth * ROUND_TO_KILL));
                    }
                }
            }
            if (best > 0) children.push(child(node, { type: "rechargeSpellstrike", actions: 1 }, 1, 0.5 * ctx.profile.aggression * best, { cast: "recharge-spellstrike" }));
        }
    }
    // A stance or another action that puts an effect on itself (C13): the
    // effect's benefit, as a spell's on itself, and a better Strike it brings.
    for (const [index, entry] of (c.selfEffects ?? []).entries()) {
        if (entry.actions > remaining || (c.effects ?? []).some((effect) => effect.key === `self:${entry.name}`) || node.casts.includes(`self${index}`)) continue;
        // Fanatical Frenzy: once it's hurt (B64). Blood Frenzy and the like come with their trigger, not as an action (B65).
        if (entry.whenHurt && c.hp.value >= c.hp.max) continue;
        if (entry.trigger) continue;
        // (B308: a shell — only badly hurt, under 40% of its Hit Points, with a foe in its reach; it spends the rest of its turn in it.)
        if (entry.shell && !(c.hp.value < c.hp.max * 0.4 && ctx.enemies.some((enemy) => isActive(enemy) && sameMelee(c, enemy)))) continue;
        if (entry.afterCast && !(node.used === 0 && castJustNow(state, c, entry.afterCast === "non-cantrip"))) continue;
        // (B155: only while its rage lasts; B158, Mountain Stronghold: only while its own stance is on it.)
        if (entry.whileRaging && !isRaging(c)) continue;
        if (entry.requiresEffect && !(c.effects ?? []).some((effect) => effect.key === `self:${entry.requiresEffect}`)) continue;
        let benefit = effectBenefit(entry.model, c, conditionWorth, state.strikeShare?.get(c.id) ?? 1);
        // Its measured change to the Strikes (Arcane Cascade's force damage): about three rounds of it.
        const threatHere = Math.max(1, state.threat?.get(c.id) ?? 1);
        let perRound = 0;
        for (const strike of c.strikes ?? []) {
            const parts = entry.model.strikeDeltas?.[strike.name] ?? [];
            const extra = parts.reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0);
            perRound = Math.max(perRound, extra * 1.3 + 0.05 * (entry.model.attackDeltas?.[strike.name] ?? 0) * 10);
        }
        // (For as long as it lasts, up to three rounds: "until the start of its next turn", this turn's Strikes, B69.)
        const span = Number.isFinite(entry.model.rounds) ? Math.max(0.5, Math.min(3, entry.model.rounds)) : 3;
        benefit += span * perRound / threatHere;
        // (B286, Conductive Shell: its damage on each foe that hits it in melee — about one hit in two from each foe in its Melee a round.)
        if (entry.model.hitBack) {
            const average = parseDamage(entry.model.hitBack).reduce((sum, instance) => sum + (instance.constant ?? 0) + (instance.dice ?? []).reduce((total, term) => total + (term.factor ?? 1) * term.count * (term.die + 1) / 2, 0), 0);
            benefit += span * 0.5 * ctx.enemies.filter((enemy) => isActive(enemy) && sameMelee(c, enemy)).length * average / threatHere;
        }
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
        const cost = entry.shell ? remaining : entry.actions;
        if (gain > 0) children.push(child(node, { type: "selfEffect", index, actions: cost }, cost, gain, { cast: `self${index}` }));
    }
}

// Devise a Stratagem rolled at the target this round, not yet used.
function pendingStratagem(state, c, target) {
    return !!c.stratagem && !c.stratagem.used && c.stratagem.round === state.round && c.stratagem.targetId === target.id;
}

// What Devise a Stratagem at the target is worth now: the mean over the d20 of the better of its best Strike with that roll and its
// best Strike as usual, less the latter, as a share of the target's HP. A melee investigator not yet beside it: the old estimate (its
// precision dice at a typical hit chance, and Intelligence's bonus).
function stratagemGain(ctx, node, target) {
    const { state, c } = ctx;
    const usable = (c.strikes ?? []).map((strike, index) => ({ strike, index })).filter(({ strike }) => strikeUsable(c, strike) && (!strike.melee || inMelee(node.pos, target)));
    const best = (natural) => Math.max(0, ...usable.map(({ strike, index }) => ctx.strikeExpectation(strike, index, target, node.attacks, node.pos, node.prone, natural)?.damage ?? 0));
    const value = targetValue(state, target, c);
    const hp = remainingHp(target);
    if (!usable.some(({ strike }) => c.stratagemFeature.strikeBonus[strike.name] !== undefined)) {
        const bonus = Math.max(0, ...Object.values(c.stratagemFeature.strikeBonus));
        return value * Math.min(1, (c.stratagemFeature.dice * 3.5 * 0.65 + bonus * 0.05 * 10) / hp);
    }
    const usual = best(null);
    let known = 0;
    for (let natural = 1; natural <= 20; natural++) known += Math.max(best(natural), usual) / 20;
    return value * (Math.min(1, known / hp) - Math.min(1, usual / hp));
}

// Exploit Vulnerability, Devise a Stratagem, Taunt, Overdrive, Hunt Prey, engaging a target and picking up a dropped weapon. (Part of expand, split up so the optimizer takes it.)
function expandTactics(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, mobile, noAttacks, raging, threatOf, children } = env;
    // Exploit Vulnerability (once a round): the weakness it'd bring on about three rounds of hits.
    if (c.exploit && node.used === 0 && !c.usedThisTurn?.has("exploit")) {
        for (const target of ctx.enemies) {
            if (target.status !== "active" || c.exploited?.targetId === target.id) continue;
            const gain = ctx.ownValue * ROUND_TO_KILL * 3 * 1.2 * exploitValue(c, target) / threatOf;
            children.push(child(node, { type: "exploit", targetId: target.id }, 1, gain));
        }
    }
    // Devise a Stratagem (once a round): the next Strike at the creature, rolled in advance with Intelligence and Strategic Strike's dice.
    // The investigator sees the roll before it Strikes (the user, 2026-10-14: "assume the player will know the result and dont waste an
    // action if their devise a stratagem rolls poorly"): worth, over the twenty rolls, the better of a Strike with the roll and what it
    // would have done anyway (its best Strike there), less the latter.
    if (c.stratagemFeature && node.used === 0 && c.stratagem?.round !== state.round && !noAttacks) {
        for (const target of ctx.enemies) {
            if (target.status !== "active") continue;
            const gain = stratagemGain(ctx, node, target);
            if (gain > 0) children.push(child(node, { type: "stratagem", targetId: target.id }, 1, gain));
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
    // (B167, Tactical Direction: worth its allies' Attacks of Opportunity, a little each, when none has one of its own.)
    if (c.grantAoo && !node.casts.includes("grant-aoo")) {
        const allies = grantAooAllies(state, c);
        if (allies.length) children.push(child(node, { type: "grantAoo", actions: c.grantAoo.actions }, c.grantAoo.actions, ctx.ownValue * 0.04 * allies.length, { cast: "grant-aoo" }));
    }
    // (B298: a summon — its creatures' threat for as long as they last, about three rounds at most; a minion's two actions of three; a
    // sustained one less the action it costs each turn.)
    for (const [index, entry] of (c.summons ?? []).entries()) {
        if (entry.trigger || entry.actions > remaining || node.casts.includes(`summon${index}`) || !canSummon(state, c, entry) || !ctx.enemies.length) continue;
        const pool = summonPool(state, entry);
        const sample = ctx.enemies.reduce((sum, enemy) => sum + armorClass(enemy), 0) / ctx.enemies.length;
        const each = pool.length ? pool.reduce((sum, reserve) => sum + roundDamage(reserve, ctx.enemies[0], sample), 0) / pool.length : 0;
        const many = Math.min(pool.length, entry.count?.formula ? Math.max(1, Math.round(entry.perUse / 2)) : Number(entry.count) || entry.perUse);
        const span = Math.max(1, Math.min(3, entry.lasts ?? 3));
        const share = entry.initiative === "minion" ? 2 / 3 : 1;
        const gain = ctx.ownValue * ROUND_TO_KILL * span * (many * each * share - (entry.sustained ? threatOf / 3 : 0)) / threatOf;
        if (gain > 0) children.push(child(node, { type: "summon", index, actions: entry.actions }, entry.actions, gain, { cast: `summon${index}` }));
    }
    // Hunt Prey: a new prey when the current one is gone or a better target is in reach.
    if (c.huntPrey && node.used === 0 && !raging) {
        const current = c.prey ? state.byId.get(c.prey) : null;
        if (!current || !isActive(current)) {
            const threat = Math.max(1, state.threat?.get(c.id) ?? 1);
            // (B308: a mark's extra damage on each hit, about 1.1 hits a round.)
            const markDamage = c.huntPrey.edge === "parts" ? 1.1 * c.huntPrey.parts.reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0) : 0;
            const perRound = c.huntPrey.edge === "precision" ? (c.huntPrey.every ? 1.1 : 0.65) * (((c.huntPrey.die ?? 8) + 1) / 2) * (c.huntPrey.precisionDice ?? 1) : c.huntPrey.edge === "parts" ? markDamage : c.huntPrey.edge === "flurry" ? 0.25 * threat : 0.05 * threat;
            const prey = ctx.enemies.filter((enemy) => enemy.status === "active").sort((a, b) => targetValue(state, b, c) - targetValue(state, a, c))[0];
            if (prey) children.push(child(node, { type: "huntPrey", targetId: prey.id }, 1, ctx.ownValue * ROUND_TO_KILL * 3 * perRound / threat));
        }
    }
    // Engage a target.
    if (!ctx.wavering && mobile) {
        for (const target of ctx.enemies) {
            if (inMelee(node.pos, target)) continue;
            const strides = ctx.strides(node.pos, target);
            // Too far on the map to engage with one Stride: a Stride toward it.
            if (strides > 1 && ctx.rootPlace && stridesToEngage({ ...ctx.mover(node.pos), areaFeet: undefined }, target) <= 1) {
                const moved = approachPlace(ctx.placeOf(node.pos), { area: target.areaFeet, exit: target.exitFeet }, Math.max(5, c.speed ?? 25));
                const next = child(node, { type: "stride", move: { kind: "approach", targetId: target.id } }, 1, 0, { pos: { ...ctx.away(node, node.pos.band === "engaged" ? "near" : node.pos.band), place: moved }, atItem: false });
                if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "approach");
                children.push(next);
            }
            // (On the grid, too far for one Stride: a Stride toward it, to where its way takes it.)
            const from = strides > 1 && Number.isFinite(strides) ? ctx.gridAt(node.pos) : null;
            if (from) {
                const moved = planStride(state, { ...c, square: from.square }, { kind: "approach", targetId: target.id });
                if (moved?.end && moved.end !== from.square.join(",")) {
                    const next = child(node, { type: "stride", move: { kind: "approach", targetId: target.id } }, 1, 0, { pos: { ...ctx.away(node, node.pos.band === "engaged" ? "near" : node.pos.band), at: { square: squareOf(moved.end), size: c.size, reach: c.reach } }, atItem: false });
                    if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "approach");
                    children.push(next);
                }
            }
            // Speed Surge (B72): two Strides for one action, three times a fight.
            if (strides === 2 && c.speedSurge && (c.surgesUsed ?? 0) < c.speedSurge.uses && (c.surgeUntil ?? -Infinity) <= state.round && !node.casts.includes("surge")) {
                const surged = target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
                const next = child(node, { type: "stride", move: { kind: "engage", targetId: target.id }, surge: true }, 1, 0, { pos: surged, moved: false, cast: "surge" });
                if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "engage");
                children.push(next);
            }
            if (strides !== 1) continue;
            const pos = target.meleeId !== null
                ? { band: "engaged", melee: target.meleeId, newWith: null }
                : { band: "engaged", melee: "new", newWith: target.id };
            const next = child(node, { type: "stride", move: { kind: "engage", targetId: target.id } }, 1, 0, { pos, moved: false });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "engage");
            children.push(next);
        }
        if (node.pos.band === "far" && ctx.strideGoes(node.pos, "toNear")) {
            children.push(child(node, { type: "stride", move: { kind: "toNear" } }, 1, 0, { pos: ctx.away(node, "near") }));
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
    // (Shield, the spell: cast to raise its magic shield, no hand needed.)
    if (c.shield && !c.shield.broken && !node.shield && (!node.carrying || c.shield.spell)) {
        children.push(child(node, { type: "raiseShield" }, 1, 0, { shield: true }));
    }
}

// Battle Medicine, Mythic Points, Knocking Sweep, Poison Weapon, Retch, map objectives, dangers, the alarm and hazards. (Part of expand, split up so the optimizer takes it.)
function expandOtherActions(env) {
    const { state, c, ctx, node, remaining, inAnyMelee, mobile, restrained, noAttacks, children } = env;
    // (C35, Vital Luminance: cast once allies start to hurt — worth part of the healing its reservoir will hold a turn on; Dismissed into the
    // most hurt ally in its light (or an undead foe there), as a heal of its value.)
    if (c.vitalLuminance && remaining >= 1 && !restrained && !node.casts.includes("luminance")) {
        const heal = (other) => (other.status === "active" ? targetValue(state, other, c) : Math.max(1, state.meanThreat?.[other.side] ?? 1));
        if (!c.luminance && (c.spellPools?.focus ?? 0) >= 1) {
            const amount = c.vitalLuminance.start + c.vitalLuminance.perTurn;
            let best = 0;
            for (const ally of [c, ...ctx.alliesAndDown]) {
                const missing = Math.max(0, ally.hp.max - Math.max(0, ally.hp.value));
                if (missing <= 0 || ally.familiar) continue;
                best = Math.max(best, heal(ally) * (Math.min(amount, missing) / ally.hp.max) * (ally.status !== "active" ? 3 : 2.5 * (1 - hpFraction(ally)) ** 1.5));
            }
            if (best > 0) children.push(child(node, { type: "luminance" }, 1, 0.5 * ctx.profile.aggression * best, { cast: "luminance" }));
        } else if (c.luminance) {
            const best = luminanceTarget(state, c, heal, (foe) => targetValue(state, foe, c));
            if (best?.gain > 0) children.push(child(node, { type: "dismissLuminance", targetId: best.target.id }, 1, ctx.profile.aggression * best.gain, { cast: "luminance" }));
        }
    }
    // (C34, March of Law: once a round, toward an enemy that took a hostile action against it since its last turn — each enemy beside it
    // where it ends, frightened 2 (no save).)
    if (c.marchOfLaw && remaining >= 1 && !restrained && !c.usedThisTurn?.has("march-of-law") && !node.casts.includes("march")) {
        for (const target of ctx.enemies) {
            if (target.status !== "active" || !c.wrongedBy?.has(target.id)) continue;
            const here = inMelee(node.pos, target);
            if (!here && (!mobile || ctx.wavering || ctx.strides(node.pos, target) > 1)) continue;
            const pos = here ? node.pos : target.meleeId !== null ? { band: "engaged", melee: target.meleeId, newWith: null } : { band: "engaged", melee: "new", newWith: target.id };
            let gain = 0;
            for (const foe of ctx.enemies) {
                if (foe.status !== "active" || !inMelee(pos, foe) || foe.cond.blinded) continue;
                const now = foe.cond.frightened ?? 0;
                if (now >= c.marchOfLaw.frightened) continue;
                gain += targetValue(state, foe, c) * (conditionWorth("frightened", c.marchOfLaw.frightened, null) - conditionWorth("frightened", now, null)) * ROUND_TO_KILL;
            }
            if (gain <= 0) continue;
            const next = child(node, { type: "marchOfLaw", targetId: target.id }, 1, ctx.profile.aggression * gain, { cast: "march", ...(pos !== node.pos ? { pos } : {}) });
            if (pos !== node.pos && inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
    }
    // (Familiar Focus: its familiar commanded to restore a Focus Point once its pool is spent — worth part of the focus spell it readies.)
    if (c.focusMax && node.used === 0 && remaining >= 1 && !node.casts.includes("familiarFocus") && familiarFocusReady(state, c)) {
        children.push(child(node, { type: "familiarFocus" }, 1, 0.4 * ctx.profile.aggression * ctx.ownValue * ROUND_TO_KILL * 3, { cast: "familiarFocus" }));
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
    // Mythic (B72): a Mythic Point to end its worst condition, or to regain a spent spell, a recharge, Quickened Casting.
    if ((c.mythicPoints ?? 0) > 0 && remaining >= 1) {
        const worst = c.mythic?.["remove-condition"] && !node.casts.includes("mythicRemove") ? worstCondition(c) : null;
        if (worst && worst.worth > 0) children.push(child(node, { type: "mythicRemove", slug: worst.slug, actions: 1 }, 1, ctx.ownValue * 1.5 * worst.worth * ROUND_TO_KILL, { cast: "mythicRemove" }));
        const recharge = c.mythic?.recharge && !node.casts.includes("mythicRecharge") && node.used === 0 ? c.mythic.recharge : null;
        if (recharge) {
            // (S22: not a scroll, wand or staff's.)
            const pool = Object.entries(c.spellPools ?? {}).find(([name, left]) => left <= 0 && (c.spells ?? []).some((spell) => spell.pool === name && !spell.item))?.[0];
            const recharging = recharge.abilities ? (c.spells ?? []).findIndex((spell) => (c.rechargeUntil?.get(spell.rechargeGroup ?? spell) ?? -Infinity) > (c.round ?? 0)) : -1;
            const what = pool ? { pool } : recharging >= 0 ? { spellIndex: recharging } : recharge.quickened && c.quickenedUsed ? { quickened: true } : null;
            if (what) children.push(child(node, { type: "mythicRecharge", actions: 1, ...what }, 1, 0.35 * ctx.ownValue * ROUND_TO_KILL, { cast: "mythicRecharge" }));
        }
    }
    // Knocking Sweep (B75): its basic action (Trip) at every enemy in its Melee, separate checks at the penalty it started with:
    // worth what each would be.
    for (const [sweepIndex, sweep] of (c.skillSweeps ?? []).entries()) {
        if (restrained || noAttacks || sweep.actions > remaining || (sweep.oncePerTurn && (c.usedThisTurn?.has(sweep.name) || node.casts.includes(`sweep${sweepIndex}`)))) continue;
        const index = sweepActionIndex(c, sweep);
        const foes = index >= 0 ? ctx.enemies.filter((target) => target.status === "active" && inMelee(node.pos, target)) : [];
        if (foes.length < 2) continue;
        let gain = 0;
        for (const [step, target] of foes.entries()) {
            const effect = ctx.spellEffect(index, c.spells[index], [target], sweep.sameMap ? node.attacks : node.attacks + step, sweep.actions).find((entry) => entry.target === target);
            if (!effect) continue;
            const before = node.damage[target.id] ?? 0;
            const hp = remainingHp(target);
            gain += targetValue(state, target, c) * (Math.min(1, (before + (effect.damage ?? 0)) / hp) - Math.min(1, before / hp) + (effect.worth ?? 0) * ROUND_TO_KILL);
        }
        if (gain > 0) children.push(child(node, { type: "skillSweep", index: sweepIndex, actions: sweep.actions }, sweep.actions, ctx.profile.aggression * gain, { attacks: foes.length, ...(sweep.oncePerTurn ? { cast: `sweep${sweepIndex}` } : {}) }));
    }
    // Poison Weapon (B72): an Interact to poison its weapon before a Strike: the poison's worth on its best foe, times a hit's chance.
    if (c.poisonWeapon && !c.weaponPoisoned && (c.poisonDoses ?? c.poisonWeapon.doses) > 0 && remaining >= 2 && !restrained && !node.casts.includes("poisonWeapon") && (c.strikes ?? []).some((strike) => strike.held && strikeUsable(c, strike))) {
        let worth = 0;
        for (const target of ctx.enemies) {
            if (target.status !== "active") continue;
            const effect = spellExpectation(state, c, c.poisonWeapon.spell, [target]).find((entry) => entry.target === target);
            if (effect) worth = Math.max(worth, targetValue(state, target, c) * ((effect.damage ?? 0) / Math.max(1, remainingHp(target)) + (effect.worth ?? 0) * ROUND_TO_KILL));
        }
        const next = child(node, { type: "poisonWeapon", actions: 1 }, 1, ctx.profile.aggression * 0.6 * worth, { cast: "poisonWeapon" });
        if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
        if (worth > 0) children.push(next);
    }
    // Retch: a sickened creature's Fortitude save to shake it off. Each point
    // of sickened is about a quarter of a round of its threat over the fight.
    if (node.used === 0 && c.cond.sickened > 0 && c.sickenedDC) {
        const [success, critical] = retchOdds(c);
        // (Only the points above its floor — Evil Eye's sickened 1 can't be shaken off while the spell lasts.)
        const above = Math.max(0, c.cond.sickened - floorOf(c, "sickened"));
        const points = success * Math.min(1, above) + critical * Math.min(2, above);
        if (points > 0) children.push(child(node, { type: "retch" }, 1, ctx.ownValue * 0.24 * points * ROUND_TO_KILL));
    }
    if (node.prone) {
        const next = child(node, { type: "stand" }, 1, 0, { prone: false });
        if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
        children.push(next);
    }
    // Map objectives (O1–O3): toward the area, the item or the exit, and picking the item up.
    if (ctx.map && mobile) {
        const place = ctx.placeOf(node.pos);
        const band = inAnyMelee ? "near" : node.pos.band;
        const toward = (where) => {
            const moved = strideToward(place, where, Math.max(5, c.speed ?? 25), state.objective.areaToExit);
            const next = child(node, { type: "stride", move: { kind: where === "area" ? "toArea" : "toExit" } }, 1, 0, { pos: { band, melee: null, newWith: null, place: moved }, atItem: false });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "toExit");
            children.push(next);
        };
        const item = state.objective.item;
        if (place.area > 0 && (ctx.map.kind === "hold" || (!node.carrying && !item.dropped))) toward("area");
        if (node.carrying && place.exit > 0) toward("exit");
        const toItem = ctx.map.kind === "retrieve" && !node.carrying && item.dropped && !node.atItem ? stridesToItem(item, node.pos.band, c.speed, place) : 0;
        if (toItem === 1) {
            const there = item.meleeId !== null && [...(state.melees.get(item.meleeId) ?? [])].some((id) => state.byId.get(id).side !== c.side && isActive(state.byId.get(id)));
            const spot = { area: item.area, exit: item.exit };
            const next = child(node, { type: "stride", move: { kind: "toItem" } }, 1, 0, { pos: there ? { band: "engaged", melee: item.meleeId, newWith: null, place: spot } : { band: item.band, melee: null, newWith: null, place: spot }, atItem: true });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "toItem");
            children.push(next);
        } else if (toItem > 1 && stridesToItem(item, node.pos.band, c.speed) <= 1) {
            // Further than a Stride on the map: toward it.
            const next = child(node, { type: "stride", move: { kind: "approach", targetId: "item" } }, 1, 0, { pos: { band, melee: null, newWith: null, place: approachPlace(place, { area: item.area, exit: item.exit }, Math.max(5, c.speed ?? 25)) }, atItem: false });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "approach");
            children.push(next);
        }
    }
    if (ctx.map?.kind === "retrieve" && !node.carrying && !restrained && (state.objective.item.dropped ? node.atItem : ctx.placeOf(node.pos).area <= 0)) {
        const item = state.objective.item;
        const next = child(node, { type: "pickUp" }, 1, 0, { carrying: true, shield: false, ...(item.dropped ? { pos: { ...node.pos, place: { area: item.area, exit: item.exit } }, atItem: true } : {}) });
        if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
        children.push(next);
    }
    // Out of a danger Region (E3): a Stride toward its nearest edge.
    if (mobile && ctx.dangers.length) {
        const regions = ctx.regionsOf(node.pos);
        for (const danger of ctx.dangers) {
            const place = regions[danger.region];
            if (!place || place.to > 0) continue;
            const edge = Math.max(0, place.edge - Math.max(5, c.speed ?? 25));
            const pos = ctx.away(node, inAnyMelee ? "near" : node.pos.band);
            pos.regions = { ...regions, [danger.region]: { to: edge > 0 ? 0 : 5, edge } };
            const next = child(node, { type: "stride", move: { kind: "outOf", region: danger.region } }, 1, 0, { pos });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "outOf");
            children.push(next);
        }
    }
    // The alarm (E1): toward the gong and sound it, or (a runner) off the battlefield.
    if (ctx.alarm && !node.alarmRaised) {
        if (ctx.alarm.kind === "gong" && node.gong > 0 && mobile) {
            const next = child(node, { type: "stride", move: { kind: "toGong" } }, 1, 0, { pos: ctx.away(node, inAnyMelee ? "near" : node.pos.band), gong: Math.max(0, node.gong - Math.max(5, c.speed ?? 25)) });
            if (inAnyMelee) next.value -= ctx.moveLoss(node.pos, next, "toGong");
            children.push(next);
        }
        if (ctx.alarm.kind === "gong" && node.gong <= 0 && !restrained) {
            const next = child(node, { type: "soundGong" }, 1, 0, { alarmRaised: true });
            if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
        if (ctx.alarm.kind === "runner" && mobile && !inAnyMelee && node.pos.band === "far") children.push(child(node, { type: "stride", move: { kind: "leave" } }, 1, 0, { left: true, moved: true }));
    }
    // Disable a hazard (E4): 2 actions, valued as its share of putting the hazard out of the fight.
    if (remaining >= 2 && c.kind === "pc" && !restrained && node.pos.band !== "far") {
        for (const hazard of ctx.enemies) {
            if (!isHazard(hazard) || node.casts.includes(`disable${hazard.id}`)) continue;
            const pick = bestDisable(c, hazard);
            if (!pick) continue;
            const odds = degreeDistribution(pick.modifier, pick.option.dc);
            const done = hazard.hazard.progress?.[`${pick.option.skill}:${pick.option.dc}`] ?? 0;
            const left = Math.max(1, pick.option.needed - done);
            const progress = Math.min(1, (odds[SUCCESS] + 2 * odds[CRITICAL_SUCCESS]) / left) - odds[CRITICAL_FAILURE] * 0.25;
            if (progress <= 0) continue;
            const next = child(node, { type: "disableHazard", targetId: hazard.id }, 2, targetValue(state, hazard, c) * progress, { cast: `disable${hazard.id}` });
            if (inAnyMelee) next.value -= ctx.aooLoss(node.pos, next);
            children.push(next);
        }
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

// The scored one-step options for the creature right now (for tests and tuning).
export function scoreOptions(state, c) {
    const ctx = new PlanContext(state, c);
    const root = { value: 0, pos: rootPos(c), shield: !!c.shield?.raised, prone: !!c.cond.prone, attacks: c.attacksThisTurn, used: 0, damage: {}, provoked: 0, moved: false, casts: [], carrying: !!c.carrying, gong: c.gongFeet ?? 0, alarmRaised: false, left: false, atItem: ctx.map?.kind === "retrieve" && !!state.objective.item.dropped && atItem(state, c), first: null };
    const rootTerminal = ctx.terminal(root);
    return {
        stay: rootTerminal,
        options: expand(ctx, root, c.actionsLeft).map((node) => ({ action: node.first, value: node.value, terminal: ctx.terminal(node), score: node.value + ctx.terminal(node) }))
    };
}

// The best use of one of its abilities now, out of its turn (B118: Hellish Revenge's breath as the reaction; any of the ways it's used in):
// { spellIndex, targetIds, actions } of the cast worth the most, or null when none is worth anything.
export function bestCastNow(state, c, spellIndices) {
    const wanted = new Set([spellIndices].flat());
    const saved = c.actionsLeft;
    c.actionsLeft = 3;
    try {
        const ctx = new PlanContext(state, c);
        const root = { value: 0, pos: rootPos(c), shield: !!c.shield?.raised, prone: !!c.cond.prone, attacks: c.attacksThisTurn, used: 0, damage: {}, provoked: 0, moved: false, casts: [], carrying: !!c.carrying, gong: c.gongFeet ?? 0, alarmRaised: false, left: false, atItem: false, first: null };
        const best = expand(ctx, root, 3).filter((node) => node.first?.type === "cast" && wanted.has(node.first.spellIndex) && !node.first.quickened && node.value > 0).sort((a, b) => b.value - a.value)[0];
        return best ? { spellIndex: best.first.spellIndex, targetIds: best.first.targetIds, actions: best.first.actions } : null;
    } finally {
        c.actionsLeft = saved;
    }
}

// Returns the next action for the creature, or null to end its turn.
export function chooseAction(state, c) {
    const ctx = new PlanContext(state, c);
    const root = {
        value: 0,
        pos: rootPos(c),
        shield: !!c.shield?.raised,
        prone: !!c.cond.prone,
        attacks: c.attacksThisTurn,
        used: 0,
        damage: {},
        provoked: 0,
        moved: false,
        casts: [],
        carrying: !!c.carrying,
        gong: c.gongFeet ?? 0,
        alarmRaised: false,
        left: false,
        atItem: ctx.map?.kind === "retrieve" && !!state.objective.item.dropped && atItem(state, c),
        first: null
    };
    // (Incorporeal, starting its turn inside the floor: doing nothing is staying in — leaving the fight —, so some move out, whatever it's
    // worth; a creature that wants to leave stays in before planning — fight.js insideTurnStart.)
    const rootScore = c.emerging ? -Infinity : ctx.terminal(root);
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
