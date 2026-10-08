// Secondary objectives: protect, target (kill or capture), survive N rounds,
// task (a progress tracker from the Dynamic Encounter Framework), and the map
// objectives hold, escort and retrieve (map-objectives.js).

import { CRITICAL_FAILURE, CRITICAL_SUCCESS, SUCCESS, levelDC, rollCheck } from "./checks.js";
import { DEAD, DOWN, FLED, SURRENDERED, canAct, isActive, statusPenalty } from "./combatant.js";
import { provoke } from "./actions.js";
import { createMapObjective, endOfRoundMap, isMapObjective, settleMapAfterWin, updateMapObjective } from "./map-objectives.js";

export function createObjective(definition, partyLevel) {
    if (!definition?.kind) return null;
    const objective = { ...definition, status: "open" };
    if (definition.kind === "task") {
        objective.dc = definition.dc ?? levelDC(partyLevel);
        objective.progress = 0;
        objective.danger = 0;
        objective.needed = definition.needed ?? 4;
        objective.dangerLimit = definition.dangerLimit ?? 3;
        objective.deadline = definition.deadline ?? null;
        objective.skills = definition.skills ?? ["athletics", "crafting", "thievery"];
    }
    if (definition.kind === "target") objective.mode = definition.mode ?? "either";
    if (definition.kind === "survive") objective.rounds = definition.rounds ?? 5;
    if (isMapObjective(definition)) createMapObjective(objective, definition);
    return objective;
}

export function taskModifier(objective, c) {
    let best = null;
    for (const skill of objective.skills) {
        const value = c.skills?.[skill];
        if (typeof value === "number" && (best === null || value > best)) best = value;
    }
    if (best === null) return null;
    return best - statusPenalty(c, "skill");
}

export function canDoTask(state, c) {
    const objective = state.objective;
    if (!objective || objective.kind !== "task" || objective.status !== "open") return false;
    if (c.side !== "party" || c.kind !== "pc" || !canAct(c)) return false;
    if (c.band === "far" || c.band === "gone") return false;
    return taskModifier(objective, c) !== null;
}

// Two actions with the manipulate trait.
export function performTask(state, c) {
    const objective = state.objective;
    c.taskRound = state.round;
    if (provoke(state, c, "manipulate")) {
        state.log?.push(`  ${c.name}'s task action is disrupted`);
        return;
    }
    if (!canAct(c)) return;
    const roll = rollCheck(state.rng, taskModifier(objective, c), objective.dc);
    applyTaskResult(state, c, roll.degree, roll.total);
}

function applyTaskResult(state, c, degree, total) {
    const objective = state.objective;
    if (degree === CRITICAL_SUCCESS) objective.progress += 2;
    else if (degree === SUCCESS) objective.progress += 1;
    else if (degree === CRITICAL_FAILURE) objective.danger += 1;
    state.log?.push(`  ${c.name} works the objective: ${total} vs DC ${objective.dc}, progress ${objective.progress}/${objective.needed}, danger ${objective.danger}/${objective.dangerLimit}`);
    updateObjective(state);
}

// Re-evaluates the objective after anything that might settle it.
export function updateObjective(state) {
    const objective = state.objective;
    if (!objective || objective.status !== "open") return;
    if (objective.kind === "protect") {
        const ward = state.byId.get(objective.protectId);
        if (!ward || ward.status === DEAD || ward.status === DOWN) objective.status = "failed";
    } else if (objective.kind === "target") {
        const target = state.byId.get(objective.targetId);
        if (!target) return;
        const killed = target.status === DEAD;
        const captured = target.captured || target.status === SURRENDERED;
        // A surrendered target counts in every mode: PCs always accept surrender.
        if (target.status === FLED) objective.status = "failed";
        else if (objective.mode === "capture") {
            if (captured) objective.status = "success";
            else if (killed) objective.status = "failed";
        } else if (killed || captured) objective.status = "success";
    } else if (objective.kind === "task") {
        if (objective.progress >= objective.needed) objective.status = "success";
        else if (objective.danger >= objective.dangerLimit) objective.status = "failed";
    } else if (isMapObjective(objective)) {
        updateMapObjective(state);
    }
}

export function endOfRoundObjective(state) {
    const objective = state.objective;
    if (!objective || objective.status !== "open") return;
    if (objective.kind === "task" && objective.deadline && state.round >= objective.deadline) objective.status = "failed";
    if (isMapObjective(objective)) endOfRoundMap(state);
}

// After a won fight, PCs keep working an unfinished task unopposed until the
// deadline. Other open objectives are settled by the fight being over.
export function settleObjectiveAfterWin(state) {
    const objective = state.objective;
    if (!objective || objective.status !== "open") return;
    if (objective.kind === "task") {
        const workers = state.list.filter((c) => c.side === "party" && c.kind === "pc" && isActive(c) && taskModifier(objective, c) !== null);
        if (!workers.length) {
            objective.status = "failed";
            return;
        }
        let round = state.round;
        while (objective.status === "open") {
            round++;
            if (objective.deadline && round > objective.deadline) {
                objective.status = "failed";
                break;
            }
            for (const c of workers) {
                const roll = rollCheck(state.rng, taskModifier(objective, c), objective.dc);
                applyTaskResult(state, c, roll.degree, roll.total);
                if (objective.status !== "open") break;
            }
            if (round > state.round + 50) {
                objective.status = "failed";
                break;
            }
        }
        return;
    }
    if (isMapObjective(objective)) {
        settleMapAfterWin(state);
        return;
    }
    if (objective.kind === "target") {
        // Foes that fled have escaped; a downed target is caught.
        updateObjective(state);
        if (objective.status === "open") objective.status = "failed";
        return;
    }
    objective.status = "success";
}

export function settleObjectiveAfterLoss(state) {
    const objective = state.objective;
    if (objective && objective.status === "open") objective.status = "failed";
}

export function objectiveFailedOrImpossible(state) {
    return state.objective?.status === "failed";
}
