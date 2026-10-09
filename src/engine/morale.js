// Morale engine: cleanup morale (M24), from "Morale.md" and "Improved
// Morale.md". Rules come from morale-rules.js; the Mn notes refer to
// docs/morale-decisions.md.

import { SURRENDERED, baseWill, canAct, hpFraction, isActive, statusPenalty } from "./combatant.js";
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeDistribution, degreeOf, levelDC } from "./checks.js";
import { engagedAllies, engagedEnemies, removeFromSpace } from "./space.js";
import { helpPending } from "./escalations.js";

export const GROUP_STATES = ["steady", "shaken", "wavering", "broken"];

// Default morale profile for a foe, before per-actor and per-run overrides.
export function defaultMoraleProfile(spec, { foes, partyLevel, objective }) {
    const traits = new Set(spec.traits ?? []);
    const profile = { template: "typical", boss: false, group: null, leader: false };
    if (traits.has("mindless") || traits.has("construct") || traits.has("ooze")) profile.template = "none";
    else if (traits.has("animal")) profile.template = "bestial";
    const sameName = foes.filter((other) => other.name === spec.name).length;
    if (sameName >= 3) profile.group = spec.name;
    if (sameName === 1 && spec.level >= partyLevel + 2) profile.boss = true;
    if (foes.length > 1) {
        const leader = [...foes].sort((a, b) => (b.level - a.level) || (b.hp.max - a.hp.max))[0];
        if (leader.id === spec.id && foes.some((other) => other.level < spec.level)) profile.leader = true;
    }
    if (objective?.kind === "target" && objective.targetId === spec.id && profile.template !== "none") profile.template = "cowardly";
    return profile;
}

// A runner gone to fetch help (escalations) isn't a loss.
function fighters(state, side) {
    return state.list.filter((c) => c.side === side && c.kind !== "object" && c.kind !== "hazard" && c.status !== "pending" && !c.ranForHelp);
}

// Lanchester's square law: a side's fighting strength is its remaining HP
// times its damage per round. Above 1 the party is ahead.
export function partyAdvantage(state) {
    let partyHp = 0;
    let partyDamage = 0;
    let foeHp = 0;
    let foeDamage = 0;
    for (const c of state.list) {
        if (!isActive(c) || c.kind === "object" || c.kind === "hazard") continue;
        const threat = state.threat?.get(c.id) ?? 0;
        if (c.side === "party") {
            partyHp += Math.max(0, c.hp.value);
            partyDamage += threat;
        } else {
            foeHp += Math.max(0, c.hp.value);
            foeDamage += threat;
        }
    }
    const partyStrength = partyHp * partyDamage;
    const foeStrength = foeHp * foeDamage;
    if (foeStrength <= 0) return Infinity;
    return partyStrength / foeStrength;
}

// The losing gate (M2, on since M24): the party is clearly winning.
export function foesLosing(state) {
    return partyAdvantage(state) >= state.moraleRules.losingGateRatio;
}

// Each side's HP left, as a share of what it started with (creatures down, fled or
// surrendered count as none; those still to arrive aren't counted).
export function hpShares(state) {
    const share = (side) => {
        let now = 0;
        let max = 0;
        for (const c of state.list) {
            if (c.side !== side || c.kind === "object" || c.kind === "hazard" || c.status === "pending") continue;
            max += c.hp.max;
            if (isActive(c)) now += Math.max(0, c.hp.value);
        }
        return max ? now / max : 0;
    };
    return { party: share("party"), foes: share("foes") };
}

// Whether the party is clearly winning, by the gate's measure.
function partyWinning(state) {
    const rules = state.moraleRules;
    if (rules.gateMode !== "hpShare") return foesLosing(state);
    const { party, foes } = hpShares(state);
    if (rules.hpGate?.kind === "margin") return party - foes >= rules.hpGate.value;
    return foes <= 0 || party / foes >= (rules.hpGate?.value ?? 2);
}

// Whether the gate holds checks back now: it's on and the party isn't clearly winning.
const gated = (state) => state.moraleRules.losingGate && !partyWinning(state);

function activeCount(state, side) {
    return fighters(state, side).filter(isActive).length;
}

function eligible(state, c) {
    if (c.side !== "foes" || c.kind === "pc" || c.kind === "object" || c.kind === "hazard") return false;
    if (!canAct(c)) return false;
    if (c.morale?.template === "none" || !c.morale) return false;
    if (c.cond.fleeing || c.moraleState.broken) return false;
    return true;
}

function groupOf(state, c) {
    const key = c.morale?.group;
    if (!key) return null;
    return state.groups.get(key) ?? null;
}

// Called once when the fight starts.
export function initMorale(state) {
    state.groups = new Map();
    // M24: each creature checks for itself.
    if (state.moraleRules.group.enabled === false) for (const c of state.list) if (c.morale?.group) c.morale = { ...c.morale, group: null };
    const counts = new Map();
    for (const c of state.list) {
        if (c.side === "foes" && c.morale?.group) counts.set(c.morale.group, (counts.get(c.morale.group) ?? 0) + 1);
    }
    for (const [key, count] of counts) {
        if (count < state.moraleRules.group.minSize) {
            for (const c of state.list) if (c.morale?.group === key) c.morale = { ...c.morale, group: null };
            continue;
        }
        state.groups.set(key, { key, state: 0, failed: 0, checkedRound: -1, extraUsed: false });
    }
    state.moraleFlags = {
        firstDropSeen: false,
        halfStrength: false,
        quarterStrength: false,
        leaderDownRound: -1,
        allyDroppedSingleRound: -1,
        strongestDown: false
    };
    state.foeStartCount = fighters(state, "foes").length;
}

function leaderOf(state) {
    return state.list.find((c) => c.side === "foes" && c.morale?.leader) ?? null;
}

function triggerEnabled(state, id) {
    return state.moraleRules.triggers[id]?.enabled !== false;
}

function modifierValue(state, id) {
    const entry = state.moraleRules.modifiers[id];
    return entry && entry.enabled ? entry.value : 0;
}

// Collects morale triggers from the events of the last action, then rolls the
// checks they cause.
export function processMorale(state) {
    const events = state.pendingEvents;
    state.pendingEvents = [];
    if (!state.options.morale) return;
    const triggered = new Map();
    const add = (c, reason) => {
        if (!eligible(state, c)) return;
        if (!triggerEnabled(state, reason)) return;
        if (state.moraleRules.triggers[reason]?.oncePerCreature) {
            const used = (c.moraleState.usedTriggers ??= new Set());
            if (used.has(reason)) return;
            used.add(reason);
        }
        if (!triggered.has(c.id)) triggered.set(c.id, reason);
    };
    const foes = () => state.list.filter((c) => c.side === "foes");
    const flags = state.moraleFlags;
    for (const event of events) {
        if (event.type === "dropped" && event.victim.side === "foes") {
            const victim = event.victim;
            // Morale.md: a companion slain after half the side has fallen.
            if (flags.halfStrength) for (const c of foes()) if (c !== victim) add(c, "companionAfterHalf");
            if (event.overwhelming) flags.allyDroppedSingleRound = state.round;
            if (!flags.firstDropSeen) {
                flags.firstDropSeen = true;
                if (event.critical || event.overwhelming) for (const c of foes()) add(c, "firstMemberOverwhelmed");
            }
            if (victim.morale?.leader) {
                flags.leaderDownRound = state.round;
                for (const c of foes()) add(c, "leaderDown");
            }
            if (!flags.strongestDown && victim.id === state.strongestFoeId) {
                flags.strongestDown = true;
                for (const c of foes()) if (c !== victim) add(c, "strongestAllyDown");
            }
        }
        if (event.type === "fled" && event.who.side === "foes" && event.who.morale?.leader) {
            flags.leaderDownRound = state.round;
            for (const c of foes()) add(c, "leaderDown");
        }
        if (event.type === "halfHp" && event.victim.side === "foes") add(event.victim, "halfHp");
        if (event.type === "frightened" && event.victim.side === "foes" && event.byEnemy) {
            event.victim.moraleState.fearThisRound = true;
            // M25: only from frightened 2 or more (a Demoralize's critical success, stronger fear).
            if ((event.value ?? Infinity) >= (state.moraleRules.triggers.frightenedByEnemy?.minValue ?? 0)) add(event.victim, "frightenedByEnemy");
        }
        if (event.type === "surprised") for (const c of foes()) add(c, "surprised");
        if (event.type === "cantAffect") add(event.who, "cantAffect");
    }
    // Side strength crossings.
    const start = state.foeStartCount;
    const removed = fighters(state, "foes").filter((c) => !isActive(c)).length;
    if (!flags.quarterFallen && start > 1 && removed >= start / 4) {
        flags.quarterFallen = true;
        for (const c of foes()) add(c, "quarterFallen");
    }
    if (!flags.halfStrength && start > 1 && removed >= start / 2) {
        flags.halfStrength = true;
        for (const c of foes()) add(c, "halfStrength");
    }
    if (!flags.quarterStrength && start > 1 && start - removed <= start / 4) {
        flags.quarterStrength = true;
        for (const c of foes()) add(c, "quarterStrength");
    }
    // Outnumbered 3:1 (Morale.md) is edge-triggered too.
    const partyUp = activeCount(state, "party");
    const foesUp = activeCount(state, "foes");
    const outnumbered = foesUp > 0 && partyUp >= 3 * foesUp;
    if (outnumbered && !flags.outnumbered3to1) for (const c of foes()) add(c, "outnumbered3to1");
    flags.outnumbered3to1 = outnumbered;
    // Surrounded is edge-triggered.
    for (const c of foes()) {
        if (!isActive(c)) continue;
        const surrounded = isSurrounded(state, c);
        if (surrounded && !c.wasSurrounded) add(c, "surrounded");
        c.wasSurrounded = surrounded;
    }
    // The gate (M24): only while the party is clearly winning, except fear from the party. A check it
    // blocks is lost, unless holdGatedChecks (off, M27) keeps it for when the gate opens; one per creature.
    const held = (state.moraleHeld ??= new Map());
    if (gated(state)) {
        for (const [id, reason] of [...triggered]) {
            if (reason === "frightenedByEnemy") continue;
            triggered.delete(id);
            state.stats.moraleGated++;
            if (state.moraleRules.holdGatedChecks && !held.has(id)) held.set(id, reason);
        }
    } else {
        for (const [id, reason] of [...held]) {
            const c = state.byId.get(id);
            if (!c || !eligible(state, c)) {
                held.delete(id);
                continue;
            }
            // Already checked this round: it waits for the next.
            if (triggered.has(id) || (groupOf(state, c) ?? c.moraleState).checkedRound === state.round) continue;
            triggered.set(id, reason);
            held.delete(id);
        }
    }
    if (!triggered.size) return;
    const doneGroups = new Set();
    for (const [id, reason] of triggered) {
        const c = state.byId.get(id);
        if (!eligible(state, c)) continue;
        const group = groupOf(state, c);
        if (group) {
            if (doneGroups.has(group.key)) continue;
            doneGroups.add(group.key);
            groupCheck(state, group, reason);
        } else {
            individualCheck(state, c, reason);
        }
    }
}

function mayCheck(state, holder) {
    if (holder.checkedRound !== state.round) return true;
    if (state.moraleRules.extraCheckOnLeaderDeath && state.moraleFlags.leaderDownRound === state.round && !holder.extraUsed) {
        holder.extraUsed = true;
        return true;
    }
    return false;
}

function situational(state, key) {
    return !!state.setup.situational?.[key];
}

function sharedModifiers(state, c) {
    const parts = [];
    const push = (id, value) => {
        if (value) parts.push({ id, value });
    };
    const foesActive = activeCount(state, "foes");
    const partyActive = activeCount(state, "party");
    if (situational(state, "defendingHome")) push("defendingHome", modifierValue(state, "defendingHome"));
    if (situational(state, "noRetreat")) push("noRetreat", modifierValue(state, "noRetreat"));
    if (situational(state, "hatedEnemy")) push("hatedEnemy", modifierValue(state, "hatedEnemy"));
    if (foesActive > partyActive) push("outnumbersEnemies", modifierValue(state, "outnumbersEnemies"));
    if (partyActive >= 2 * foesActive) push("outnumbered2to1", modifierValue(state, "outnumbered2to1"));
    if (foesActive >= 3 * partyActive) push("outnumber3to1", modifierValue(state, "outnumber3to1"));
    if (partyActive >= 3 * foesActive) push("outnumbered3to1", modifierValue(state, "outnumbered3to1"));
    const leader = leaderOf(state);
    if (leader && leader !== c && !isActive(leader)) push("leaderDown", modifierValue(state, "leaderDown"));
    if (state.moraleFlags.allyDroppedSingleRound === state.round) push("allyDroppedBySingleAttack", modifierValue(state, "allyDroppedBySingleAttack"));
    if (state.foeStartCount > 1 && foesActive <= state.foeStartCount / 4) push("quarterStrength", modifierValue(state, "quarterStrength"));
    // M24 (Morale.md): the side's losses, −2 from a quarter fallen and −4 from half.
    const lost = state.foeStartCount - foesActive;
    if (state.foeStartCount > 1 && lost >= state.foeStartCount / 2) push("sideLost50", modifierValue(state, "sideLost50"));
    else if (state.foeStartCount > 1 && lost >= state.foeStartCount / 4) push("sideLost25", modifierValue(state, "sideLost25"));
    if (state.moraleFlags.strongestDown) push("mostPowerfulAllyKilled", modifierValue(state, "mostPowerfulAllyKilled"));
    if (!state.list.some((other) => other.side === "party" && other.kind === "pc" && other.everDown)) push("noEnemySlain", modifierValue(state, "noEnemySlain"));
    if (state.round === 1 && state.surprisedSide === "foes") push("surprisedPenalty", modifierValue(state, "surprisedPenalty"));
    if (helpPending(state)) push("helpComing", modifierValue(state, "helpComing"));
    if (state.partyLevel && c.level !== undefined) push("levelDifference", modifierValue(state, "levelDifference") * (c.level - state.partyLevel));
    return parts;
}

// Foe reinforcements arrive (escalations): wavering foes steady, and a shaken or wavering group too.
export function helpArrives(state) {
    if (!state.options.morale || !triggerEnabled(state, "helpArrives")) return;
    let steadied = 0;
    for (const c of state.list) {
        if (!eligible(state, c) || !c.moraleState.wavering || c.morale.group) continue;
        c.moraleState.wavering = false;
        c.mustWithdraw = false;
        c.dropAggression = false;
        steadied++;
    }
    for (const group of state.groups?.values() ?? []) {
        if (group.state <= 0 || group.state >= 3) continue;
        group.state = 0;
        applyGroupState(state, group, state.list.filter((c) => c.morale?.group === group.key && isActive(c)));
        steadied++;
    }
    if (steadied) state.log?.push("  Help arrives: the foes steady");
}

function personalModifiers(state, c) {
    const parts = [];
    const push = (id, value) => {
        if (value) parts.push({ id, value });
    };
    const template = state.moraleRules.templates[c.morale.template] ?? state.moraleRules.templates.typical;
    push(`template.${c.morale.template}`, template.modifier ?? 0);
    if (c.hp.value >= c.hp.max) push("undamaged", modifierValue(state, "undamaged"));
    if (c.cond.frightened > 0) push("frightened", modifierValue(state, "frightened"));
    if (hpFraction(c) <= 0.5) push("halfHp", modifierValue(state, "halfHp"));
    if (c.cantAffect) push("cantBypassDefense", modifierValue(state, "cantBypassDefense"));
    if (c.moraleState.failed > 0) push("alreadyFailed", modifierValue(state, "alreadyFailed"));
    if (isIsolated(state, c)) push("isolated", modifierValue(state, "isolated"));
    const allies = state.list.filter((other) => other.side === "foes" && other !== c && other.kind !== "object");
    if (allies.some((other) => other.status === "fled") && !allies.some(isActive)) push("abandoned", modifierValue(state, "abandoned"));
    if (c.morale.template === "bestial") {
        if (situational(state, "defendingLair")) push("template.bestial.lair", template.defendingLair ?? 0);
        if (hpFraction(c) <= state.moraleRules.measures.bloodiedFraction && !isSurrounded(state, c)) push("template.bestial.bloodied", template.bloodied ?? 0);
    }
    if (c.morale.template === "mercenary") {
        if (partyAdvantage(state) < 1) push("template.mercenary.winning", template.winning ?? 0);
        if (situational(state, "unpaid")) push("template.mercenary.unpaid", template.unpaid ?? 0);
    }
    return parts;
}

// M12: in an abstract Melee everyone is engaged with everyone, so a big brawl
// alone doesn't count; the enemies must also clearly outnumber the creature's side.
export function isSurrounded(state, c) {
    const measures = state.moraleRules.measures;
    const enemies = engagedEnemies(state, c).length;
    const friends = 1 + engagedAllies(state, c).length;
    return enemies >= measures.surroundedCount && enemies - friends >= (measures.surroundedMargin ?? 0);
}

// M13
function isIsolated(state, c) {
    const allies = state.list.filter((other) => other.side === c.side && other !== c && isActive(other) && other.kind !== "object");
    if (c.band === "far") return !allies.some((other) => other.band === "far");
    return !allies.some((other) => other.band === "engaged" || other.band === "near");
}

// The morale check's DC (see dcMode in morale-rules.js).
function moraleDC(state, will) {
    const rules = state.moraleRules;
    if (rules.dcMode === "partyLevel") return levelDC(state.partyLevel ?? 1) + (rules.levelOffset ?? 0);
    return rules.thresholdBase + will;
}

function rollMorale(state, will, penalty, parts) {
    const modifier = parts.reduce((sum, part) => sum + part.value, 0);
    const natural = state.rng.d20();
    const total = natural + will - penalty + modifier;
    const dc = moraleDC(state, will);
    return { natural, total, dc, degree: degreeOf(total, dc, natural), modifier };
}

function individualCheck(state, c, reason) {
    if (!mayCheck(state, c.moraleState)) return;
    c.moraleState.checkedRound = state.round;
    state.stats.moraleChecks++;
    if (c.morale.boss && !c.moraleState.autoPassed) {
        c.moraleState.autoPassed = true;
        state.log?.push(`  ${c.name} morale (${reason}): Boss Resolve, holds`);
        return;
    }
    const parts = [...sharedModifiers(state, c), ...personalModifiers(state, c)];
    // M1: the threshold uses Will without condition penalties; the check takes them.
    const roll = rollMorale(state, baseWill(c), statusPenalty(c, "will"), parts);
    let degree = roll.degree;
    const template = state.moraleRules.templates[c.morale.template] ?? state.moraleRules.templates.typical;
    if (degree <= FAILURE && template.ignoreFirstFailure && !c.moraleState.ignoredFirstFailure) {
        c.moraleState.ignoredFirstFailure = true;
        degree = SUCCESS;
    }
    // Boss Resolve: it can't break yet. Under M24 (a failure gives up) it holds; before, it wavered.
    if (c.morale.boss && degree <= FAILURE && !bossMayBreak(state, c)) degree = state.moraleRules.failureGivesUp ? SUCCESS : FAILURE;
    state.log?.push(`  ${c.name} morale (${reason}): ${roll.total} vs ${roll.dc} → ${["critical failure", "failure", "success", "critical success"][degree]}`);
    applyIndividualResult(state, c, degree, template, reason);
}

// Simulated PCs who play for morale (a setup tick, M23; it changes how they act,
// not the rules, M26): what a check set off now would likely do to a foe, for the planner. extra: modifiers the cause adds (a leader
// down); frightened: the value fear would give it. { breaks, wavers } chances.
export function moraleOdds(state, c, { trigger, frightened = 0, extra = 0 }) {
    const none = { breaks: 0, wavers: 0 };
    if (!state.options.morale || !triggerEnabled(state, trigger) || !eligible(state, c)) return none;
    if (trigger !== "frightenedByEnemy" && gated(state)) return none;
    if (trigger === "frightenedByEnemy" && frightened < (state.moraleRules.triggers.frightenedByEnemy?.minValue ?? 0)) return none;
    const group = groupOf(state, c);
    if ((group ?? c.moraleState).checkedRound === state.round) return none;
    if (c.morale.boss && !c.moraleState.autoPassed) return none;
    let modifier = [...sharedModifiers(state, c), ...personalModifiers(state, c)].reduce((sum, part) => sum + part.value, 0) + extra;
    if (frightened > 0 && !(c.cond.frightened > 0)) modifier += modifierValue(state, "frightened");
    const penalty = Math.max(statusPenalty(c, "will"), frightened);
    const odds = degreeDistribution(baseWill(c) + modifier - penalty, moraleDC(state, baseWill(c)));
    const template = state.moraleRules.templates[c.morale.template] ?? state.moraleRules.templates.typical;
    if (template.ignoreFirstFailure && !c.moraleState.ignoredFirstFailure) return none;
    // A check fear set off gives up only on a critical failure (M29).
    const crackOnly = state.moraleRules.triggers[trigger]?.onFailure === "frighten";
    let breaks = odds[CRITICAL_FAILURE] + (state.moraleRules.failureGivesUp && !crackOnly ? odds[FAILURE] : 0);
    let wavers = state.moraleRules.failureGivesUp ? 0 : odds[FAILURE];
    if (c.morale.boss && !bossMayBreak(state, c)) {
        wavers = state.moraleRules.failureGivesUp ? 0 : wavers + breaks;
        breaks = 0;
    }
    // A berserk break keeps it fighting.
    if (template.break === "berserk") breaks = 0;
    return { breaks, wavers };
}

// What dropping the foes' leader is worth when the party plays for morale: the other
// foes' threat times the chance their "leader down" checks break them.
export function leaderDownWorth(state, leader) {
    if (!state.setup.situational?.playsForMorale || !leader.morale?.leader) return 0;
    let worth = 0;
    for (const c of state.list) {
        if (c === leader || c.side !== leader.side || !isActive(c)) continue;
        const odds = moraleOdds(state, c, { trigger: "leaderDown", extra: modifierValue(state, "leaderDown") });
        worth += (state.threat?.get(c.id) ?? 0) * (odds.breaks + 0.3 * odds.wavers);
    }
    return worth;
}

function bossMayBreak(state, c) {
    if (hpFraction(c) < state.moraleRules.boss.breakBelowHp) return true;
    const guards = state.list.filter((other) => other.side === "foes" && other !== c && other.kind !== "object");
    if (guards.length && !guards.some(isActive)) return true;
    if (state.objective?.status === "success") return true; // M15
    return false;
}

function applyIndividualResult(state, c, degree, template, reason = null) {
    if (degree === CRITICAL_SUCCESS) {
        c.cond.frightened = Math.max(0, c.cond.frightened - 1);
        return;
    }
    if (degree === SUCCESS) return;
    c.moraleState.failed++;
    state.stats.moraleFailures++;
    // M29: fear only cracks morale. A failure on a check fear set off raises frightened by 1
    // (not an enemy effect, so no new check); only a critical failure gives up.
    if (degree === FAILURE && state.moraleRules.triggers[reason]?.onFailure === "frighten") {
        c.cond.frightened = Math.min(4, (c.cond.frightened ?? 0) + 1);
        state.log?.push(`  ${c.name} is shaken: frightened ${c.cond.frightened}`);
        return;
    }
    // M24: a failure gives up too; before, it wavered and only a critical failure broke.
    if (degree === FAILURE && !state.moraleRules.failureGivesUp) {
        waver(state, c, template.waver);
        return;
    }
    breakCreature(state, c, template.break);
}

function waver(state, c, kind) {
    c.moraleState.wavering = true;
    if (c.cond.frightened === 0) c.cond.frightened = 1;
    c.mustWithdraw = kind === "withdraw";
    c.dropAggression = kind === "defensive";
}

function breakKind(c, kind) {
    if (c.morale.boss) return "rout";
    if (kind !== "auto") return kind;
    return (c.traits ?? []).includes("humanoid") ? "collapse" : "rout";
}

export function breakCreature(state, c, kind) {
    const resolved = breakKind(c, kind);
    state.stats.moraleBreaks++;
    if (resolved === "berserk") {
        c.cond.frightened = Math.max(c.cond.frightened, 1);
        c.berserkUntilRound = state.round + 1;
        c.moraleState.wavering = false;
        return;
    }
    c.moraleState.broken = true;
    c.moraleState.wavering = false;
    if (resolved === "collapse") {
        surrender(state, c);
        return;
    }
    c.cond.fleeing = true;
    if (resolved === "rout") c.cond.frightened = Math.max(c.cond.frightened, 2);
    state.log?.push(`  ${c.name} breaks and flees`);
}

export function surrender(state, c) {
    c.status = SURRENDERED;
    c.captured = true;
    removeFromSpace(state, c);
    state.log?.push(`  ${c.name} surrenders`);
    state.pendingEvents.push({ type: "removed", who: c });
}

function groupCheck(state, group, reason) {
    if (!mayCheck(state, group)) return;
    group.checkedRound = state.round;
    state.stats.moraleChecks++;
    const members = state.list.filter((c) => c.morale?.group === group.key && isActive(c));
    if (!members.length) return;
    const best = members.reduce((a, b) => (baseWill(b) > baseWill(a) ? b : a));
    const parts = [...sharedModifiers(state, best), ...personalModifiers(state, best)].filter((part) => part.id !== "alreadyFailed");
    const leader = leaderOf(state);
    if (leader && isActive(leader) && leader.morale?.group !== group.key) {
        const difference = leader.level - best.level;
        const entry = state.moraleRules.group.leaderBonus.find(([minimum]) => difference >= minimum);
        if (entry) parts.push({ id: "group.leader", value: entry[1] });
    }
    if (group.failed > 0) parts.push({ id: "alreadyFailed", value: modifierValue(state, "alreadyFailed") });
    const roll = rollMorale(state, baseWill(best), statusPenalty(best, "will"), parts);
    const before = group.state;
    if (roll.degree === CRITICAL_SUCCESS) group.state = Math.max(0, group.state - 1);
    else if (roll.degree === FAILURE) group.state = Math.min(3, group.state + 1);
    else if (roll.degree === CRITICAL_FAILURE) group.state = Math.min(3, group.state + state.moraleRules.group.criticalFailureSteps);
    if (roll.degree <= FAILURE) {
        group.failed++;
        state.stats.moraleFailures++;
    }
    state.log?.push(`  ${group.key} group morale (${reason}): ${roll.total} vs ${roll.dc} → ${GROUP_STATES[group.state]}`);
    if (group.state !== before) applyGroupState(state, group, members);
}

function applyGroupState(state, group, members) {
    const name = GROUP_STATES[group.state];
    for (const c of members) {
        c.groupState = name;
        c.moraleState.wavering = name === "wavering";
        if (name === "broken") {
            const template = state.moraleRules.templates[c.morale.template] ?? state.moraleRules.templates.typical;
            breakCreature(state, c, template.break);
        }
    }
}

// Recovery at the end of a creature's turn (M16).
export function moraleRecovery(state, c) {
    if (!state.options.morale || !state.moraleRules.recovery.enabled) return;
    if (!eligible(state, c) || !c.moraleState.wavering || c.morale.group) return;
    if (c.moraleState.fearThisRound) return;
    const allies = state.list.filter((other) => other.side === c.side && other !== c && other.kind !== "object");
    if (!allies.some((other) => isActive(other) && !other.moraleState.wavering && !other.cond.fleeing)) return;
    const leader = leaderOf(state);
    if (leader && leader !== c && !isActive(leader)) return;
    const roll = rollMorale(state, baseWill(c), statusPenalty(c, "will"), personalModifiers(state, c));
    state.stats.moraleRecoveries++;
    if (roll.degree >= SUCCESS) {
        c.moraleState.wavering = false;
        c.mustWithdraw = false;
        c.dropAggression = false;
        if (roll.degree === CRITICAL_SUCCESS) c.cond.frightened = Math.max(0, c.cond.frightened - 1);
        state.log?.push(`  ${c.name} steadies`);
    }
}

// Start-of-turn check for "can't meaningfully affect an opponent" (M11).
export function checkCantAffect(state, c, bestHitChance, bestDamage) {
    if (c.side !== "foes" || c.cantAffect) return;
    const measures = state.moraleRules.measures;
    if (bestHitChance <= measures.cantAffectHitChance || bestDamage < measures.cantAffectDamage) {
        c.cantAffect = true;
        state.pendingEvents.push({ type: "cantAffect", who: c });
    }
}

export function isShaken(c) {
    return c.groupState === "shaken";
}

