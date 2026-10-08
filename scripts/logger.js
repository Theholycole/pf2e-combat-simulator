// Real-fight logger. When a real encounter begins, it predicts the odds
// silently; while it runs, it notes PCs who drop to 0 HP; when it ends, it
// asks the GM how it went and keeps the result next to the prediction.
//
// A "real" fight has at least one player-owned PC and one foe, so scripted
// test fights with GM-owned characters never trigger it.

import { MODULE_ID, actorKind, readFlag, savedSetup, sideOf } from "./snapshot.js";
import { predictOdds } from "./odds.js";
import { OUTCOMES, guessOutcome } from "../src/engine/calibration.js";
import { escape } from "./render.js";

function enabled() {
    try {
        return game.settings.get(MODULE_ID, "logRealFights");
    } catch {
        return false;
    }
}

// Only one GM client acts, so nothing happens twice with two GMs connected.
function isLeadGM() {
    return game.user.isGM && (game.users.activeGM ? game.users.activeGM.isSelf : true);
}

function combatantsOf(combat) {
    return combat.combatants.contents.filter((combatant) => combatant.actor);
}

export function isRealFight(combat) {
    const { overrides } = savedSetup(combat);
    const combatants = combatantsOf(combat);
    const pcs = combatants.filter((c) => c.actor.type === "character" && sideOf(c, overrides) === "party");
    const foes = combatants.filter((c) => sideOf(c, overrides) === "foes");
    return pcs.some((c) => c.actor.hasPlayerOwner) && foes.length > 0;
}

async function predictAtStart(combat) {
    if (readFlag(combat, "prediction")) return;
    const predicted = await predictOdds(combat);
    if (!predicted) return;
    const report = predicted.report;
    await combat.setFlag(MODULE_ID, "prediction", {
        at: Date.now(),
        winRate: report.winRate,
        objectiveRate: report.objectiveRate,
        anyPcDown: report.anyPcDown,
        anyPcDeath: report.anyPcDeath,
        averageRounds: report.averageRounds,
        runs: report.runs,
        threat: report.threat,
        reliability: report.reliability?.level ?? null,
        leans: report.reliability?.leans ?? null,
        gaps: report.gaps.length
    });
}

// Odds checks and downed PCs are kept in memory rather than on the encounter:
// every encounter update runs other modules' hooks (over half a second in one
// test world), and this would update it mid-fight. A reload mid-fight loses
// them, and the GM can correct the end-of-fight dialog.
const fightMemory = new Map();

function memoryFor(combatId) {
    if (!fightMemory.has(combatId)) fightMemory.set(combatId, { odds: [], downed: new Set() });
    return fightMemory.get(combatId);
}

export function rememberOdds(combat, report) {
    const odds = memoryFor(combat.id).odds;
    odds.push({ round: combat.round, turn: combat.turn, winRate: report.winRate, anyPcDown: report.anyPcDown, runs: report.runs });
    if (odds.length > 20) odds.shift();
}

function noteDown(actor) {
    for (const combat of game.combats.contents.filter((c) => c.started)) {
        const combatant = combat.combatants.find((c) => c.actor?.id === actor.id);
        if (combatant) memoryFor(combat.id).downed.add(combatant.id);
    }
}

// The creatures' final state, read while the deleted encounter is still in memory.
function finalState(combat) {
    const { setup, overrides } = savedSetup(combat);
    const memory = memoryFor(combat.id);
    fightMemory.delete(combat.id);
    // Older encounters may still carry the flags this used to write.
    const downed = new Set([...(readFlag(combat, "downed") ?? []), ...memory.downed]);
    const rows = combatantsOf(combat).map((combatant) => {
        const actor = combatant.actor;
        const hp = actor.system?.attributes?.hp ?? {};
        const dying = actor.system?.attributes?.dying ?? {};
        const kind = actorKind(actor);
        const atZero = (hp.value ?? 1) <= 0;
        const dyingMax = dying.max ?? 4;
        return {
            id: combatant.id,
            name: combatant.name,
            level: actor.level ?? 0,
            side: sideOf(combatant, overrides),
            kind,
            down: atZero || !!combatant.isDefeated || downed.has(combatant.id),
            died: kind === "pc" ? dyingMax > 0 && (dying.value ?? 0) >= dyingMax : atZero || !!combatant.isDefeated
        };
    });
    return {
        setup,
        rounds: combat.round,
        scene: combat.scene?.name ?? "",
        prediction: readFlag(combat, "prediction"),
        oddsHistory: [...(readFlag(combat, "oddsHistory") ?? []), ...memory.odds],
        pcs: rows.filter((row) => row.side === "party" && row.kind === "pc"),
        foes: rows.filter((row) => row.side === "foes" && row.kind !== "object")
    };
}

function dialogContent(state, guess) {
    const prediction = state.prediction
        ? `<p>Predicted when it began: the party wins <strong>${Math.round(state.prediction.winRate * 100)}%</strong>, a PC goes down ${Math.round(state.prediction.anyPcDown * 100)}%${state.prediction.threat ? ` (PF2e: ${escape(state.prediction.threat.label)})` : ""}.</p>`
        : `<p class="muted">No prediction was made when this encounter began, so it will be logged without one.</p>`;
    const outcomes = OUTCOMES
        .filter(([key]) => key !== "survived" || state.setup.objective?.kind === "survive")
        .map(([key, label]) => `<label class="check"><input type="radio" name="outcome" value="${key}" ${key === guess ? "checked" : ""}> ${escape(label)}</label>`).join("");
    const objective = state.setup.objective?.kind
        ? `<fieldset><legend>Secondary objective</legend>
            <label class="check"><input type="radio" name="objective" value="success"> Completed</label>
            <label class="check"><input type="radio" name="objective" value="failed" checked> Not completed</label></fieldset>`
        : "";
    const pcs = state.pcs.map((pc) => `<tr data-id="${escape(pc.id)}"><td>${escape(pc.name)}</td>
        <td><input type="checkbox" name="down" ${pc.down ? "checked" : ""}></td>
        <td><input type="checkbox" name="died" ${pc.died ? "checked" : ""}></td></tr>`).join("");
    return `<div class="pf2e-combat-sim sim-log-dialog">
        ${prediction}
        <fieldset><legend>How did it end?</legend>${outcomes}</fieldset>
        ${objective}
        <table><thead><tr><th>PC</th><th>Went down</th><th>Died</th></tr></thead><tbody>${pcs}</tbody></table>
        <label>Notes <input type="text" name="notes" placeholder="optional"></label>
        <p class="muted">${state.rounds} rounds. The guesses come from the final HP and conditions; correct anything that's wrong.</p>
    </div>`;
}

function readDialog(form, state) {
    const value = (name) => form.querySelector(`[name="${name}"]:checked`)?.value ?? null;
    const pcs = state.pcs.map((pc) => {
        const row = form.querySelector(`tr[data-id="${CSS.escape(pc.id)}"]`);
        return { name: pc.name, level: pc.level, down: !!row?.querySelector("[name=down]")?.checked, died: !!row?.querySelector("[name=died]")?.checked };
    });
    return {
        outcome: value("outcome"),
        objective: state.setup.objective?.kind ? value("objective") : null,
        pcs,
        notes: form.querySelector("[name=notes]")?.value?.trim() ?? ""
    };
}

export function logEntries() {
    try {
        return game.settings.get(MODULE_ID, "fightLog") ?? [];
    } catch {
        return [];
    }
}

export async function saveLog(entries) {
    await game.settings.set(MODULE_ID, "fightLog", entries);
}

async function promptOutcome(combat) {
    const state = finalState(combat);
    if (!state.pcs.length || !state.foes.length) return;
    const guess = guessOutcome({ pcs: state.pcs, foes: state.foes, objectiveKind: state.setup.objective?.kind ?? null });
    const { DialogV2 } = foundry.applications.api;
    const answer = await DialogV2.wait({
        window: { title: "Combat Simulator: how did the fight go?" },
        content: dialogContent(state, guess),
        position: { width: 460 },
        rejectClose: false,
        buttons: [
            { action: "save", label: "Save to the log", icon: "fa-solid fa-book", default: true, callback: (event, button) => readDialog(button.form, state) },
            { action: "skip", label: "Don't log this fight" }
        ]
    });
    if (!answer || answer === "skip" || typeof answer !== "object" || !answer.outcome) return;
    const entries = logEntries();
    entries.push({
        id: foundry.utils.randomID(),
        date: new Date().toISOString(),
        scene: state.scene,
        rounds: state.rounds,
        objectiveKind: state.setup.objective?.kind ?? null,
        prediction: state.prediction ?? null,
        oddsHistory: state.oddsHistory,
        actual: {
            outcome: answer.outcome,
            objective: answer.objective,
            pcs: answer.pcs,
            foes: state.foes.map((foe) => ({ name: foe.name, level: foe.level, down: foe.down })),
            rounds: state.rounds
        },
        notes: answer.notes
    });
    await saveLog(entries);
    ui.notifications.info(`Combat Simulator: fight logged (${entries.length} in the real-fight log).`);
}

export function registerLogger() {
    Hooks.on("updateCombat", (combat, changed) => {
        if (changed.round !== 1 || !enabled() || !isLeadGM() || !isRealFight(combat)) return;
        predictAtStart(combat).catch((error) => console.warn("pf2e-combat-simulator | prediction at the start failed", error));
    });
    Hooks.on("updateActor", (actor, changed) => {
        if (actor.type !== "character" || !enabled() || !isLeadGM()) return;
        if (!foundry.utils.hasProperty(changed, "system.attributes.hp.value")) return;
        if ((actor.system?.attributes?.hp?.value ?? 1) > 0) return;
        noteDown(actor);
    });
    Hooks.on("deleteCombat", (combat) => {
        if (!combat.started || !enabled() || !isLeadGM() || !isRealFight(combat)) return;
        promptOutcome(combat).catch((error) => console.error("pf2e-combat-simulator | logging the fight failed", error));
    });
}
