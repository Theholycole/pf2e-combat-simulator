// The in-play odds check: the fight as it stands, a small fast batch.

import { MODULE_ID, buildSnapshot, entriesFromCombat, moraleRulesSetting, savedSetup } from "./snapshot.js";
import { rememberOdds } from "./logger.js";
import { runJob } from "./runner.js";
import { renderAdjustments, renderSummary } from "./render.js";
import { escape } from "../src/html.js";

let running = false;

// The fight as it stands, simulated. Returns null when there are no PCs.
export async function predictOdds(combat, { runs = game.settings.get(MODULE_ID, "oddsRuns") } = {}) {
    const { setup, overrides } = savedSetup(combat);
    const snapshot = await buildSnapshot(entriesFromCombat(combat), { setup, overrides, combat, moraleRules: moraleRulesSetting() });
    if (!snapshot.combatants.some((c) => c.side === "party" && c.kind === "pc")) return null;
    const report = await runJob("batch", snapshot, { runs, seed: Math.floor(Math.random() * 2 ** 31), logSample: false, timeBudgetMs: 2500, minRuns: 80 });
    return { snapshot, report };
}

export async function oddsCheck(combat = game.combat) {
    if (!combat) return ui.notifications.warn("Combat Simulator: no active encounter.");
    if (running) return;
    running = true;
    const started = Date.now();
    try {
        const predicted = await predictOdds(combat);
        if (!predicted) return ui.notifications.warn("Combat Simulator: no PCs in the encounter.");
        const { snapshot, report } = predicted;
        const runs = game.settings.get(MODULE_ID, "oddsRuns");
        // Kept for the real-fight log (in memory: see logger.js).
        if (combat.started) rememberOdds(combat, report);
        const seconds = ((Date.now() - started) / 1000).toFixed(1);
        const fights = report.runs;
        const where = combat.started ? `round ${combat.round}` : "before the fight";
        const objective = report.objectiveRate !== null ? `, objective <strong>${Math.round(report.objectiveRate * 100)}%</strong>` : "";
        ChatMessage.create({
            content: `<div class="pf2e-combat-sim-odds"><strong>Odds (${escape(where)})</strong>: party wins <strong>${Math.round(report.winRate * 100)}%</strong>${objective}; a PC goes down ${Math.round(report.anyPcDown * 100)}%, a PC dies ${Math.round(report.anyPcDeath * 100)}%. <span class="muted">${fights} fights in ${seconds}s</span></div>`,
            whisper: ChatMessage.getWhisperRecipients("GM").map((user) => user.id),
            speaker: { alias: "Combat Simulator" }
        });
        const { DialogV2 } = foundry.applications.api;
        // Not awaited, so another odds check can start while this dialog is open.
        DialogV2.wait({
            window: { title: `Odds: ${where}` },
            content: `<div class="pf2e-combat-sim">${renderSummary(report)}<p class="muted">${fights} fights from the current state in ${seconds}s${fights < runs ? " (stopped early to stay quick)" : ""}.${report.gaps.length ? ` ${report.gaps.length} abilities aren't simulated yet.` : ""}</p></div>`,
            buttons: [
                { action: "adjust", label: "What would change the odds?", icon: "fa-solid fa-sliders" },
                { action: "close", label: "Close", default: true }
            ],
            position: { width: 480 },
            rejectClose: false
        }).then((choice) => {
            if (choice === "adjust") showAdjustments(snapshot, where);
        });
    } catch (error) {
        console.error(error);
        ui.notifications.error(`Combat Simulator odds check failed: ${error.message}`);
    } finally {
        running = false;
    }
}

// Tries PF2e's Weak and Elite adjustments and removing a foe, from the same state.
async function showAdjustments(snapshot, where) {
    const notice = ui.notifications.info("Combat Simulator: testing adjustments…", { permanent: true });
    const started = Date.now();
    try {
        // About 100 fights a change keeps a big encounter's ten or so changes to a few seconds.
        const data = await runJob("adjustments", snapshot, { runs: 100, seed: Math.floor(Math.random() * 2 ** 31) });
        const seconds = ((Date.now() - started) / 1000).toFixed(1);
        const { DialogV2 } = foundry.applications.api;
        DialogV2.prompt({
            window: { title: `What would change the odds: ${where}` },
            content: `<div class="pf2e-combat-sim">${renderAdjustments(data)}<p class="muted">Tested in ${seconds}s.</p></div>`,
            ok: { label: "Close" },
            position: { width: 560 },
            rejectClose: false
        });
    } catch (error) {
        console.error(error);
        ui.notifications.error(`Combat Simulator adjustments failed: ${error.message}`);
    } finally {
        // Foundry 14 returns a notification object; older versions an id.
        try {
            if (typeof notice?.remove === "function") notice.remove();
            else if (notice !== undefined) ui.notifications.remove?.(notice);
        } catch {
            // The notice may already be gone.
        }
    }
}
