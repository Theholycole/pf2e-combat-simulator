// A commander's tactics (C21–C24), answered by allies (squadmates) in the
// banner's aura (30 feet; in range bands, near or closer):
// - Strike Hard! (2 actions): one ally Strikes at once, as a reaction.
// - Pincer Attack (1 action): allies Step as a reaction; a foe next to any of
//   them is off-guard to melee attacks from the commander and those allies
//   until the start of the commander's next turn.
// - Set-Up Strike (a Strike activity): on a hit, the target is off-guard to the
//   next attack one of the commander's allies makes before its next turn.
// - Banner's Inspiration (1 action): allies in the aura lose 1 frightened (once a fight each).
// - Drilled Reactions: once a round, one ally answering a tactic gets an extra reaction for it.

import { CRITICAL_SUCCESS, SUCCESS, degreeDistribution } from "./checks.js";
import { armorClass, canAct, isActive, strikeUsable } from "./combatant.js";
import { attackModifier, expectedHitDamage, performStrike, stride } from "./actions.js";
import { canReact, withExtraDamage } from "./abilities.js";
import { distanceBetween, rangePenalty, sameMelee, stridesToEngage } from "./space.js";

const log = (state, line) => state.log?.push(line);

export const inBanner = (commander, ally) => ally !== commander && distanceBetween(commander, ally) <= (commander.commander?.banner ?? 30);

// Whether an ally can answer a tactic now: its reaction, or the commander's Drilled Reactions this round.
export const canAnswer = (state, commander, ally) => isActive(ally) && (canReact(ally) || (commander.commander?.drilled && commander.drilledRound !== state.round && ally.status === "active" && !ally.cond.unconscious && !ally.cond.paralyzed));

function useAnswer(state, commander, ally) {
    if (canReact(ally)) ally.reactionUsed = true;
    else commander.drilledRound = state.round;
}

const squad = (state, commander) => state.list.filter((ally) => ally.side === commander.side && inBanner(commander, ally));

// An ally's best Strike at a foe now, as { index, expected } (expected damage, no attack penalty), or null.
export function allyStrike(state, ally, target) {
    let best = null;
    for (const [index, strike] of (ally.strikes ?? []).entries()) {
        if (!strikeUsable(ally, strike)) continue;
        if (strike.melee ? !sameMelee(ally, target) : rangePenalty(strike, distanceBetween(ally, target)) === null) continue;
        const odds = degreeDistribution(attackModifier(state, ally, target, strike, 0), armorClass(target, { ranged: !strike.melee }));
        const expected = odds[SUCCESS] * expectedHitDamage(ally, strike, target, false) + odds[CRITICAL_SUCCESS] * expectedHitDamage(ally, strike, target, true);
        if (!best || expected > best.expected) best = { index, expected };
    }
    return best;
}

// Strike Hard!: the ally and foe whose Strike would do most: { allyId, targetId, strikeIndex, expected } or null.
export function bestStrikeHard(state, commander, enemies) {
    let best = null;
    for (const ally of squad(state, commander)) {
        if (!canAnswer(state, commander, ally)) continue;
        for (const target of enemies) {
            if (!isActive(target)) continue;
            const strike = allyStrike(state, ally, target);
            if (strike && (!best || strike.expected > best.expected)) best = { allyId: ally.id, targetId: target.id, strikeIndex: strike.index, expected: strike.expected };
        }
    }
    return best;
}

export function strikeHard(state, commander, action) {
    const ally = state.byId.get(action.allyId);
    const target = state.byId.get(action.targetId);
    log(state, `  ${commander.name} uses ${commander.commander.strikeHard}${ally ? `: ${ally.name} Strikes` : ""}`);
    if (!ally || !target || !isActive(target) || !canAnswer(state, commander, ally)) return;
    useAnswer(state, commander, ally);
    performStrike(state, ally, target, ally.strikes[action.strikeIndex], { reaction: true });
}

// Pincer Attack: the allies who'd answer (in melee with a foe, a reaction to spend) and the foes beside them.
export function pincerPlan(state, commander) {
    const responders = squad(state, commander).filter((ally) => ally.meleeId !== null && canAnswer(state, commander, ally));
    const melees = new Set(responders.map((ally) => ally.meleeId));
    const foes = state.list.filter((other) => other.side !== commander.side && isActive(other) && other.meleeId !== null && melees.has(other.meleeId));
    return { responders, foes };
}

export function pincerAttack(state, commander) {
    const { responders, foes } = pincerPlan(state, commander);
    log(state, `  ${commander.name} uses ${commander.commander.pincerAttack}${responders.length ? ` (${responders.map((ally) => ally.name).join(", ")} Step)` : ""}`);
    let drilledUsed = false;
    for (const ally of responders) {
        if (canReact(ally)) ally.reactionUsed = true;
        else if (!drilledUsed) {
            commander.drilledRound = state.round;
            drilledUsed = true;
        }
    }
    const attackers = [commander, ...responders];
    // Until the start of the commander's next turn.
    const round = state.round + 1;
    for (const foe of foes) {
        for (const attacker of attackers) {
            const entry = { attacker: attacker.id, attacks: "melee", uses: null };
            foe.offGuardTo = [...(foe.offGuardTo ?? []), entry];
            (foe.timers ??= []).push({ offGuardTo: entry, round, turnOf: commander.id, at: "start" });
        }
        log(state, `  ${foe.name} is off-guard to melee attacks from ${attackers.map((attacker) => attacker.name).join(", ")}`);
    }
}

// Set-Up Strike's hit: off-guard to the next attack any of the commander's allies makes, until its next turn.
export function setUp(state, commander, target) {
    const group = `setup-${commander.id}-${state.round}`;
    for (const ally of state.list.filter((other) => other.side === commander.side && other !== commander)) {
        const entry = { attacker: ally.id, attacks: "any", uses: 1, group };
        target.offGuardTo = [...(target.offGuardTo ?? []), entry];
        (target.timers ??= []).push({ offGuardTo: entry, round: state.round + 1, turnOf: commander.id, at: "start" });
    }
    log(state, `  ${target.name} is off-guard to the next attack from ${commander.name}'s allies`);
}

// Banner's Inspiration: allies in the aura who are frightened and haven't had it this fight.
export const inspirable = (state, commander) => squad(state, commander).filter((ally) => isActive(ally) && (ally.cond.frightened ?? 0) > 0 && !commander.inspired?.has(ally.id));

export function bannersInspiration(state, commander) {
    const allies = inspirable(state, commander);
    log(state, `  ${commander.name} uses ${commander.commander.bannersInspiration}`);
    for (const ally of allies) {
        ally.cond.frightened = Math.max(0, ally.cond.frightened - 1);
        (commander.inspired ??= new Set()).add(ally.id);
        log(state, `  ${ally.name} is frightened ${ally.cond.frightened}`);
    }
}

// Word of Advice (B183): an ally within its distance Strides once and Strikes once, the extra damage on a hit — the ally's best Strike at a foe
// in its reach or one Stride away: { allyId, targetId, strikeIndex, stride, expected } or null.
export function bestAdvance(state, c, enemies) {
    const rule = c.allyAdvance;
    let best = null;
    for (const ally of state.list) {
        if (ally === c || ally.side !== c.side || !isActive(ally) || !canAct(ally) || (rule.within < 60 && distanceBetween(c, ally) > rule.within)) continue;
        // (B202, Kingpin's Command: its reaction, and each ally once.)
        if ((rule.reaction && !canReact(ally)) || (rule.oncePerAlly && c.advancedAllies?.has(ally.id))) continue;
        for (const target of enemies) {
            if (!isActive(target)) continue;
            const strides = stridesToEngage(ally, target);
            for (const [index, strike] of (ally.strikes ?? []).entries()) {
                if (!strikeUsable(ally, strike) || (strike.melee && strides > 1) || (!strike.melee && rangePenalty(strike, distanceBetween(ally, target)) === null)) continue;
                const boosted = withExtraDamage(strike, rule.extraDamage);
                const odds = degreeDistribution(attackModifier(state, ally, target, boosted, 0), armorClass(target, { ranged: !strike.melee }));
                const expected = odds[SUCCESS] * expectedHitDamage(ally, boosted, target, false) + odds[CRITICAL_SUCCESS] * expectedHitDamage(ally, boosted, target, true);
                if (!best || expected > best.expected) best = { allyId: ally.id, targetId: target.id, strikeIndex: index, stride: strike.melee && strides === 1, expected };
            }
        }
    }
    return best;
}

export function allyAdvance(state, c, action) {
    const ally = state.byId.get(action.allyId);
    const target = state.byId.get(action.targetId);
    log(state, `  ${c.name} uses ${c.allyAdvance.name}${ally ? `: ${ally.name} ${action.stride ? "Strides and " : ""}Strikes` : ""}`);
    if (!ally || !target || !isActive(ally) || !isActive(target) || !canAct(ally)) return;
    if (c.allyAdvance.reaction) ally.reactionUsed = true;
    if (c.allyAdvance.oncePerAlly) (c.advancedAllies ??= new Set()).add(ally.id);
    if (action.stride && !sameMelee(ally, target)) stride(state, ally, { kind: "engage", targetId: target.id });
    if (!isActive(ally) || !isActive(target) || !canAct(ally)) return;
    const strike = ally.strikes?.[action.strikeIndex];
    if (strike && (!strike.melee || sameMelee(ally, target))) performStrike(state, ally, target, withExtraDamage(strike, c.allyAdvance.extraDamage), { reaction: true });
}
