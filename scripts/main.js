import { MODULE_ID } from "./snapshot.js";
import { SimulatorApp } from "./app.js";
import { oddsCheck } from "./odds.js";
import { registerLogger } from "./logger.js";
import { FightLogApp } from "./log-app.js";
import { setUpMapTracking } from "./map.js";
import { setUpEscalationTracking } from "./escalation-tracking.js";

function openSimulator({ combat = null, tokens = null } = {}) {
    if (!game.user.isGM) return ui.notifications.warn("Combat Simulator is for the GM.");
    if (!combat && !tokens) {
        const controlled = canvas?.tokens?.controlled ?? [];
        if (game.combat && !controlled.length) combat = game.combat;
        else tokens = controlled;
    }
    if (!combat && !tokens?.length) return ui.notifications.warn("Combat Simulator: start an encounter or select tokens first.");
    new SimulatorApp(combat ? { combat } : { tokens }).render(true);
}

Hooks.once("init", () => {
    game.settings.register(MODULE_ID, "defaultRuns", {
        name: "Fights per simulation",
        hint: "How many fights a full simulation plays. 500 gives win rates within about ±4 points.",
        scope: "world",
        config: true,
        type: Number,
        default: 500
    });
    game.settings.register(MODULE_ID, "oddsRuns", {
        name: "Fights per odds check",
        hint: "How many fights the in-play odds check plays. Fewer is faster; 200 gives about ±7 points.",
        scope: "world",
        config: true,
        type: Number,
        default: 200
    });
    game.settings.register(MODULE_ID, "moraleRules", {
        name: "Morale rule overrides (JSON)",
        hint: "Changes to the morale rules, merged over the defaults. Example: {\"losingGateRatio\": 2, \"modifiers\": {\"isolated\": {\"value\": -2}}}",
        scope: "world",
        config: true,
        type: String,
        default: ""
    });
    game.settings.register(MODULE_ID, "logRealFights", {
        name: "Log real fights",
        hint: "When an encounter with a player-owned PC begins, predict the odds quietly; when it ends, ask how it went. The real-fight log compares the two.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register(MODULE_ID, "fightLog", {
        scope: "world",
        config: false,
        type: Array,
        default: []
    });
    game.settings.registerMenu(MODULE_ID, "fightLogMenu", {
        name: "Real-fight log",
        label: "Open the log",
        hint: "Logged fights next to the odds the simulator predicted for them.",
        icon: "fa-solid fa-book",
        type: FightLogApp,
        restricted: true
    });
    registerLogger();
    // Rounds the party holds a map objective's area, counted at each new round (active GM).
    setUpMapTracking();
    // The round each escalation rule fires in play (active GM).
    setUpEscalationTracking();
});

function openLog() {
    if (!game.user.isGM) return ui.notifications.warn("Combat Simulator is for the GM.");
    new FightLogApp().render(true);
}

Hooks.once("ready", () => {
    game.modules.get(MODULE_ID).api = { open: openSimulator, oddsCheck, openLog };
});

Hooks.on("renderCombatTracker", (app, html) => {
    if (!game.user.isGM) return;
    const root = html instanceof HTMLElement ? html : html[0];
    if (!root) return;
    // Rebuilt every render: the buttons depend on whether an encounter exists.
    root.querySelector(".pf2e-combat-sim-bar")?.remove();
    const bar = document.createElement("div");
    bar.className = "pf2e-combat-sim-bar";
    const combat = app.viewed ?? game.combat;
    bar.innerHTML = combat
        ? `<button type="button" data-sim="odds" title="Simulate the fight as it stands and show the party's odds"><i class="fa-solid fa-dice"></i> Odds</button>
           <button type="button" data-sim="open" title="Set up and test this encounter"><i class="fa-solid fa-flask"></i> Simulate…</button>`
        : `<button type="button" data-sim="tokens" title="Test the selected tokens as an encounter"><i class="fa-solid fa-flask"></i> Simulate selected tokens</button>`;
    bar.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-sim]");
        if (!button) return;
        const action = button.dataset.sim;
        if (action === "odds") oddsCheck(combat);
        else if (action === "open") openSimulator({ combat });
        else openSimulator({ tokens: canvas?.tokens?.controlled ?? [] });
    });
    const header = root.querySelector(".combat-tracker-header, header");
    if (header) header.after(bar);
    else root.prepend(bar);
});
