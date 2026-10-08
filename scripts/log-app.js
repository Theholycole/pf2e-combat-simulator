// The real-fight log window: logged fights against their predictions.

import { MODULE_ID } from "./snapshot.js";
import { logEntries, saveLog } from "./logger.js";
import { calibrate } from "../src/engine/calibration.js";
import { renderFightLog } from "./render.js";

const { ApplicationV2 } = foundry.applications.api;

export class FightLogApp extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
        id: "pf2e-combat-simulator-log",
        classes: ["pf2e-combat-sim"],
        tag: "div",
        window: { title: "Combat Simulator: real-fight log", resizable: true, icon: "fa-solid fa-book" },
        position: { width: 900, height: 700 },
        actions: {
            export: FightLogApp.#onExport,
            deleteEntry: FightLogApp.#onDelete,
            toggleReliable: FightLogApp.#onToggleReliable
        }
    };

    onlyReliable = false;

    async _renderHTML() {
        const entries = logEntries();
        const calibration = calibrate(entries, { onlyReliable: this.onlyReliable });
        return `<div class="sim-results">
            <div class="sim-buttons"><button type="button" data-action="export"><i class="fa-solid fa-file-export"></i> Export as JSON</button></div>
            ${renderFightLog(entries, calibration, { onlyReliable: this.onlyReliable })}
        </div>`;
    }

    _replaceHTML(result, content) {
        content.innerHTML = result;
    }

    static #onExport() {
        const save = foundry.utils.saveDataToFile ?? globalThis.saveDataToFile;
        save(JSON.stringify(logEntries(), null, 2), "application/json", `${MODULE_ID}-fight-log-${new Date().toISOString().slice(0, 10)}.json`);
    }

    static async #onDelete(event, target) {
        const id = target.dataset.id;
        const entries = logEntries();
        const entry = entries.find((candidate) => candidate.id === id);
        if (!entry) return;
        const { DialogV2 } = foundry.applications.api;
        const confirmed = await DialogV2.confirm({
            window: { title: "Remove logged fight" },
            content: `<p>Remove the fight from ${entry.date.slice(0, 10)}${entry.scene ? ` (${entry.scene})` : ""} from the log? This can't be undone, but you can export the log first.</p>`,
            rejectClose: false
        });
        if (!confirmed) return;
        await saveLog(entries.filter((candidate) => candidate.id !== id));
        this.render();
    }

    static #onToggleReliable(event, target) {
        this.onlyReliable = target.checked;
        this.render();
    }
}
