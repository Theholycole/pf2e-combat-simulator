// Hazards (E4): PF2e hazards on the foes' side.
//
// A complex hazard takes a turn in initiative (rolled with its Stealth) with
// its routine's actions: its Strikes (no multiple attack penalty when its
// text says so) and the actions the ability module compiles. It acts from
// round 1, unless a rule switches it on; then its reaction fires first and it
// rolls initiative. A simple hazard fires its reaction once, when a rule
// triggers it. A hazard can't move, and its Strikes reach anyone on the field.
//
// The PCs Disable it (its own skill and DC, worked like a task: success +1,
// critical success +2, critical failure triggers it; some need several
// successes) or smash it (AC, Hardness, HP; immune to critical hits).

import { ACTIVE, DEAD, PENDING, canAct, isActive, statusPenalty } from "./combatant.js";
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, SUCCESS, rollCheck } from "./checks.js";

const log = (state, line) => state.log?.push(line);

export const isHazard = (c) => c?.kind === "hazard";

// The hazard's reaction: its compiled trigger abilities (an area one at the whole
// party), and its Strikes when the text says it Strikes. target: the creature
// that set it off, or a random one.
function fireReaction(state, c, triggerer, { castPlan, describeSpell, performStrike }) {
    const party = state.list.filter((other) => other.side !== c.side && isActive(other));
    if (!party.length) return;
    const target = triggerer && isActive(triggerer) ? triggerer : party[Math.floor(state.rng.next() * party.length)];
    for (const ability of c.hazard.trigger?.abilities ?? []) {
        const area = describeSpell(ability.plan).area;
        castPlan(state, c, ability, area ? party.map((other) => other.id) : [target.id]);
    }
    if (c.hazard.trigger?.strikes) for (const strike of c.strikes ?? []) if (isActive(target)) performStrike(state, c, target, strike, { reaction: true });
}

// A rule switches the hazard on (E4).
export function activateHazard(state, c, triggerer, helpers) {
    if (!isHazard(c) || c.status !== PENDING) return;
    c.status = ACTIVE;
    log(state, `  ${c.name} is triggered`);
    fireReaction(state, c, triggerer, helpers);
    if (c.hazard.complex) helpers.joinInitiative(state, c);
    else {
        // A simple hazard is spent once it fires.
        c.status = DEAD;
        c.spent = true;
    }
}

// Before the fight: a simple hazard waits for a rule (and never fires without one);
// a complex hazard a rule switches on waits too. Live play: a rule that fired
// already has set it off (a complex hazard is in the fight, a simple one spent).
export function setUpHazards(state, definition) {
    const rules = definition?.rules ?? [];
    for (const c of state.list) {
        if (!isHazard(c) || c.status !== ACTIVE) continue;
        c.hazard ??= { complex: false, routineActions: 1, disable: [], trigger: null };
        const index = rules.findIndex((rule) => rule?.then?.kind === "hazard" && rule.then.hazardId === c.id);
        const rule = index >= 0 ? state.escalation?.rules?.[index] : null;
        if (rule?.fired != null) {
            if (!c.hazard.complex) {
                c.status = DEAD;
                c.spent = true;
            }
            continue;
        }
        if (rule || !c.hazard.complex) c.status = PENDING;
    }
}

// The creature that set a rule off, when it's one (a party creature entering its Region).
export function triggererOf(state, rule) {
    if (rule.when.kind === "enters") return state.list.find((c) => c.side === "party" && isActive(c) && c.regionFeet?.[rule.when.region]?.to <= 0) ?? null;
    if (rule.when.kind === "falls") return null;
    return null;
}

// The Disable option a PC is best at: { option, modifier }, or null.
export function bestDisable(c, hazard) {
    let best = null;
    for (const option of hazard.hazard?.disable ?? []) {
        const value = c.skills?.[option.skill];
        if (typeof value !== "number") continue;
        const modifier = value - statusPenalty(c, "skill");
        if (!best || modifier - option.dc > best.modifier - best.option.dc) best = { option, modifier };
    }
    return best;
}

// Disable a Device (2 actions, manipulate): progress toward the successes it needs.
export function disableHazard(state, c, hazard, { provoke, performStrike }) {
    const pick = bestDisable(c, hazard);
    if (!pick || !isActive(hazard)) return;
    if (provoke(state, c, "manipulate")) {
        log(state, `  ${c.name}'s attempt to disable ${hazard.name} is disrupted`);
        return;
    }
    if (!canAct(c)) return;
    const roll = rollCheck(state.rng, pick.modifier, pick.option.dc);
    const progress = hazard.hazard.progress ??= {};
    const key = `${pick.option.skill}:${pick.option.dc}`;
    if (roll.degree === CRITICAL_SUCCESS) progress[key] = (progress[key] ?? 0) + 2;
    else if (roll.degree === SUCCESS) progress[key] = (progress[key] ?? 0) + 1;
    log(state, `  ${c.name} works to disable ${hazard.name}: ${roll.total} vs DC ${pick.option.dc}, ${progress[key] ?? 0}/${pick.option.needed}`);
    if ((progress[key] ?? 0) >= pick.option.needed) {
        hazard.status = DEAD;
        hazard.disabled = true;
        log(state, `  ${hazard.name} is disabled`);
        return;
    }
    // A critical failure sets it off: its Strikes at the one tampering with it.
    if (roll.degree === CRITICAL_FAILURE) {
        log(state, `  ${c.name} sets ${hazard.name} off`);
        for (const strike of hazard.strikes ?? []) if (isActive(c)) performStrike(state, hazard, c, strike, { reaction: true });
    }
}
