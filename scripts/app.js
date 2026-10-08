// The Combat Simulator window: encounter setup, then results.

import { MODULE_ID, buildSnapshot, entriesFromCombat, entriesFromTokens, readActor, readFlag, defaultSide } from "./snapshot.js";
import { runJob } from "./runner.js";
import { FightLogApp } from "./log-app.js";
import { MORALE_RULES } from "../src/engine/morale-rules.js";
import { ROLE_PROFILES } from "../src/engine/planner.js";
import { renderAdjustments, renderReport, renderCompare, renderMoraleImpact, escape } from "./render.js";

const { ApplicationV2 } = foundry.applications.api;

const OBJECTIVE_KINDS = [["", "None"], ["protect", "Protect a creature or object"], ["target", "Kill or capture a target"], ["survive", "Survive N rounds"], ["task", "Do a task"]];
const COMPARE_CHOICES = [["adjust", "What would change the odds (Weak, Elite, remove)"], ["morale", "Morale on / off"], ["heroPoints", "Hero points on / off"], ["objective", "Objective on / off"], ["retreat", "Party retreat on / off"]];
const SITUATIONAL = [["defendingHome", "Foes defend their home (+1)"], ["noRetreat", "Foes have no retreat, surrender means death (+2)"], ["defendingLair", "Bestial foes defend young or lair (+2)"], ["unpaid", "Mercenaries unpaid or betrayed (−2)"], ["hatedEnemy", "Foes fight a hated enemy (+4, if enabled)"]];

function moraleRulesSetting() {
    try {
        const text = game.settings.get(MODULE_ID, "moraleRules");
        return text ? JSON.parse(text) : null;
    } catch (error) {
        ui.notifications.warn(`Combat Simulator: the morale rules setting isn't valid JSON (${error.message}); using defaults.`);
        return null;
    }
}

function option(value, label, selected) {
    return `<option value="${escape(value)}"${String(selected) === String(value) ? " selected" : ""}>${escape(label)}</option>`;
}

export class SimulatorApp extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
        id: "pf2e-combat-simulator",
        classes: ["pf2e-combat-sim"],
        tag: "div",
        window: { title: "Combat Simulator", resizable: true, icon: "fa-solid fa-dice-d20" },
        position: { width: 860, height: 760 },
        actions: {
            run: SimulatorApp.#onRun,
            compare: SimulatorApp.#onCompare,
            moraleImpact: SimulatorApp.#onMoraleImpact,
            saveProfiles: SimulatorApp.#onSaveProfiles,
            openLog: () => new FightLogApp().render(true),
            back: SimulatorApp.#onBack
        }
    };

    // source: { combat } or { tokens }
    constructor(source, options = {}) {
        super(options);
        this.source = source;
        this.view = "setup";
        this.rows = null;
        this.result = null;
        this.progress = null;
        const saved = readFlag(source.combat, "setup") ?? {};
        this.setup = saved.setup ?? {};
        this.overrides = saved.overrides ?? {};
        this.fresh = saved.fresh ?? false;
        this.runs = saved.runs ?? game.settings.get(MODULE_ID, "defaultRuns");
    }

    get entries() {
        if (this.source.combat) return entriesFromCombat(this.source.combat);
        return entriesFromTokens(this.source.tokens ?? []);
    }

    async #loadRows() {
        const rows = [];
        for (const entry of this.entries) {
            if (!entry.actor) continue;
            const base = await readActor(entry.actor, { id: entry.id, name: entry.name });
            const profile = readFlag(entry.actor, "profile") ?? {};
            const override = this.overrides[entry.id] ?? {};
            rows.push({
                id: entry.id,
                actor: entry.actor,
                name: entry.name,
                level: base.level,
                kind: base.kind,
                gaps: base.gaps.length,
                side: override.side ?? profile.side ?? defaultSide(entry.actor, entry.token?.disposition),
                include: override.include ?? true,
                role: override.role ?? profile.role ?? "",
                template: override.template ?? profile.template ?? "",
                boss: override.boss ?? profile.boss ?? "",
                leader: override.leader ?? profile.leader ?? "",
                acts: override.acts ?? profile.acts ?? base.kind !== "object",
                arrivesRound: override.arrivesRound ?? "",
                arrivesBand: override.arrivesBand ?? "near",
                adjust: override.adjust ?? ""
            });
        }
        this.rows = rows;
    }

    async _prepareContext() {
        if (!this.rows) await this.#loadRows();
        return {};
    }

    async _renderHTML() {
        if (this.view === "setup") return this.#setupHTML();
        return this.#resultHTML();
    }

    _replaceHTML(result, content) {
        content.innerHTML = result;
        content.querySelector("[name=objectiveKind]")?.addEventListener("change", () => {
            this.#readForm();
            this.render();
        });
    }

    #sourceLabel() {
        if (this.source.combat) {
            const combat = this.source.combat;
            return combat.started ? `Encounter in progress (round ${combat.round})` : "Encounter in the Combat Tracker";
        }
        return `${this.source.tokens?.length ?? 0} selected tokens`;
    }

    #setupHTML() {
        const setup = this.setup;
        const objective = setup.objective ?? {};
        const roleOptions = (value) => [option("", "Auto", value), ...Object.keys(ROLE_PROFILES).map((role) => option(role, role[0].toUpperCase() + role.slice(1), value))].join("");
        const templateOptions = (value) => [option("", "Auto", value), ...Object.entries(MORALE_RULES.templates).map(([key, entry]) => option(key, entry.label, value))].join("");
        const triState = (name, value) => `<select name="${name}">${option("", "Auto", value)}${option("true", "Yes", value)}${option("false", "No", value)}</select>`;
        const rows = this.rows.map((row) => `
            <tr data-id="${escape(row.id)}">
                <td><input type="checkbox" name="include" ${row.include ? "checked" : ""}></td>
                <td class="name">${escape(row.name)} <span class="muted">L${row.level}${row.kind === "pc" ? " PC" : ""}</span>${row.gaps ? ` <span class="gap-badge" title="Abilities the simulator can't use yet">${row.gaps} gaps</span>` : ""}</td>
                <td><select name="side">${option("party", "Party", row.side)}${option("foes", "Foes", row.side)}</select></td>
                <td><select name="role">${roleOptions(row.role)}</select></td>
                <td>${row.kind === "pc" ? "—" : `<select name="template">${templateOptions(row.template)}</select>`}</td>
                <td>${row.kind === "pc" ? "—" : triState("boss", row.boss)}</td>
                <td>${row.kind === "pc" ? "—" : triState("leader", row.leader)}</td>
                <td><input type="checkbox" name="acts" ${row.acts ? "checked" : ""}></td>
                <td><input type="number" name="arrivesRound" min="0" value="${escape(row.arrivesRound)}" placeholder="—"></td>
                <td><select name="arrivesBand">${option("near", "Near", row.arrivesBand)}${option("far", "Far", row.arrivesBand)}</select></td>
                <td>${row.kind === "pc" ? "—" : `<select name="adjust">${option("", "—", row.adjust)}${option("weak", "Weak", row.adjust)}${option("elite", "Elite", row.adjust)}</select>`}</td>
            </tr>`).join("");
        const partyOptions = this.rows.filter((row) => row.side === "party").map((row) => option(row.id, row.name, objective.protectId)).join("");
        const foeOptions = this.rows.filter((row) => row.side === "foes").map((row) => option(row.id, row.name, objective.targetId)).join("");
        let objectiveFields = "";
        if (objective.kind === "protect") objectiveFields = `<label>Protect <select name="protectId">${partyOptions}</select></label>`;
        if (objective.kind === "target") objectiveFields = `<label>Target <select name="targetId">${foeOptions}</select></label>
            <label>Mode <select name="mode">${option("either", "Kill or capture", objective.mode)}${option("kill", "Kill", objective.mode)}${option("capture", "Capture (nonlethal)", objective.mode)}</select></label>`;
        if (objective.kind === "survive") objectiveFields = `<label>Rounds <input type="number" name="rounds" min="1" value="${escape(objective.rounds ?? 5)}"></label>`;
        if (objective.kind === "task") objectiveFields = `
            <label>Progress needed <input type="number" name="needed" min="1" value="${escape(objective.needed ?? 4)}"></label>
            <label>Deadline round <input type="number" name="deadline" min="0" value="${escape(objective.deadline ?? "")}" placeholder="none"></label>
            <label>Danger limit <input type="number" name="dangerLimit" min="1" value="${escape(objective.dangerLimit ?? 3)}"></label>
            <label>DC <input type="number" name="dc" value="${escape(objective.dc ?? "")}" placeholder="level DC"></label>
            <label>Skills <input type="text" name="skills" value="${escape((objective.skills ?? ["athletics", "crafting", "thievery"]).join(", "))}"></label>`;
        const situational = SITUATIONAL.map(([key, label]) => `<label class="check"><input type="checkbox" name="situational.${key}" ${setup.situational?.[key] ? "checked" : ""}> ${escape(label)}</label>`).join("");
        return `
        <form class="sim-setup" autocomplete="off">
            <p class="muted">${escape(this.#sourceLabel())}. Nothing on the canvas changes: fights are played in memory.</p>
            <table class="sim-combatants">
                <thead><tr><th></th><th>Creature</th><th>Side</th><th>Role</th><th>Morale</th><th>Boss</th><th>Leader</th><th>Acts</th><th>Arrives rd</th><th>From</th><th title="PF2e's Elite or Weak adjustment, for this run only">Adjust</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <fieldset><legend>Encounter</legend>
                <label>Ambush <select name="ambush">${option("", "None", setup.ambush ?? "")}${option("party", "Party ambushes", setup.ambush)}${option("foes", "Foes ambush", setup.ambush)}</select></label>
                <label>Party cover <select name="cover.party">${option(0, "None", setup.cover?.party ?? 0)}${option(2, "Standard", setup.cover?.party)}${option(4, "Greater", setup.cover?.party)}</select></label>
                <label>Foe cover <select name="cover.foes">${option(0, "None", setup.cover?.foes ?? 0)}${option(2, "Standard", setup.cover?.foes)}${option(4, "Greater", setup.cover?.foes)}</select></label>
                <label class="check"><input type="checkbox" name="fresh" ${this.fresh ? "checked" : ""}> Start fresh (full HP, no conditions)</label>
                <label>Runs <input type="number" name="runs" min="20" max="5000" value="${escape(this.runs)}"></label>
            </fieldset>
            <fieldset><legend>Morale situation</legend>${situational}</fieldset>
            <fieldset><legend>Secondary objective</legend>
                <label>Objective <select name="objectiveKind">${OBJECTIVE_KINDS.map(([value, label]) => option(value, label, objective.kind ?? "")).join("")}</select></label>
                ${objectiveFields}
                ${objective.kind ? `<label>Priority <select name="objectivePriority">${option(0.5, "Low", setup.objectivePriority ?? 1)}${option(1, "Normal", setup.objectivePriority ?? 1)}${option(2, "High", setup.objectivePriority ?? 1)}</select></label>` : ""}
            </fieldset>
            <div class="sim-buttons">
                <button type="button" data-action="run"><i class="fa-solid fa-play"></i> Simulate</button>
                <select name="comparePreset">${COMPARE_CHOICES.map(([value, label]) => option(value, label, this.comparePreset ?? "adjust")).join("")}</select>
                <button type="button" data-action="compare"><i class="fa-solid fa-code-compare"></i> Compare</button>
                <button type="button" data-action="moraleImpact" title="Turns each morale rule off in turn and ranks them by how much they change the outcome"><i class="fa-solid fa-scale-balanced"></i> Morale rule impact</button>
                <button type="button" data-action="saveProfiles" title="Remember side, role and morale settings on each actor"><i class="fa-solid fa-floppy-disk"></i> Save creature settings</button>
                <button type="button" data-action="openLog" title="Real fights next to the odds predicted for them"><i class="fa-solid fa-book"></i> Real-fight log</button>
            </div>
            ${this.progress ? `<div class="sim-progress"><progress value="${this.progress.done}" max="${this.progress.total}"></progress> ${this.progress.done} / ${this.progress.total}</div>` : ""}
        </form>`;
    }

    #resultHTML() {
        let body = "";
        if (this.result.kind === "batch") body = renderReport(this.result.data);
        else if (this.result.kind === "compare") body = renderCompare(this.result.data);
        else if (this.result.kind === "adjustments") body = renderAdjustments(this.result.data);
        else body = renderMoraleImpact(this.result.data);
        return `<div class="sim-results"><div class="sim-buttons"><button type="button" data-action="back"><i class="fa-solid fa-arrow-left"></i> Back to setup</button></div>${body}</div>`;
    }

    #readForm() {
        const form = this.element.querySelector("form.sim-setup");
        if (!form) return;
        const value = (name) => form.querySelector(`[name="${name}"]`)?.value ?? "";
        const checked = (name) => !!form.querySelector(`[name="${name}"]`)?.checked;
        for (const tr of form.querySelectorAll("tbody tr[data-id]")) {
            const row = this.rows.find((entry) => entry.id === tr.dataset.id);
            const field = (name) => tr.querySelector(`[name="${name}"]`);
            row.include = field("include").checked;
            row.side = field("side").value;
            row.role = field("role").value;
            row.template = field("template")?.value ?? "";
            row.boss = field("boss")?.value ?? "";
            row.leader = field("leader")?.value ?? "";
            row.acts = field("acts").checked;
            row.arrivesRound = field("arrivesRound").value;
            row.arrivesBand = field("arrivesBand").value;
            row.adjust = field("adjust")?.value ?? "";
        }
        const kind = value("objectiveKind");
        const previous = this.setup.objective ?? {};
        let objective = null;
        if (kind) {
            objective = { kind };
            if (kind === "protect") objective.protectId = value("protectId") || previous.protectId || this.rows.find((row) => row.side === "party")?.id;
            if (kind === "target") {
                objective.targetId = value("targetId") || previous.targetId || this.rows.find((row) => row.side === "foes")?.id;
                objective.mode = value("mode") || previous.mode || "either";
            }
            if (kind === "survive") objective.rounds = Number(value("rounds") || previous.rounds || 5);
            if (kind === "task") {
                objective.needed = Number(value("needed") || previous.needed || 4);
                objective.deadline = value("deadline") ? Number(value("deadline")) : (previous.kind === "task" && !form.querySelector("[name=deadline]") ? previous.deadline : null);
                objective.dangerLimit = Number(value("dangerLimit") || previous.dangerLimit || 3);
                if (value("dc")) objective.dc = Number(value("dc"));
                const skills = value("skills") || (previous.skills ?? []).join(",");
                objective.skills = skills ? skills.split(",").map((skill) => skill.trim().toLowerCase()).filter(Boolean) : ["athletics", "crafting", "thievery"];
            }
        }
        this.setup = {
            ambush: value("ambush") || null,
            cover: { party: Number(value("cover.party") || 0), foes: Number(value("cover.foes") || 0) },
            situational: Object.fromEntries(SITUATIONAL.map(([key]) => [key, checked(`situational.${key}`)])),
            objective,
            objectivePriority: Number(value("objectivePriority") || this.setup.objectivePriority || 1)
        };
        this.fresh = checked("fresh");
        this.runs = Math.max(20, Number(value("runs") || this.runs));
        this.comparePreset = value("comparePreset") || "morale";
        this.overrides = Object.fromEntries(this.rows.map((row) => [row.id, {
            include: row.include,
            side: row.side,
            role: row.role || undefined,
            template: row.template || undefined,
            boss: row.boss === "" ? undefined : row.boss === "true",
            leader: row.leader === "" ? undefined : row.leader === "true",
            acts: row.acts,
            arrivesRound: row.arrivesRound ? Number(row.arrivesRound) : undefined,
            arrivesBand: row.arrivesBand,
            adjust: row.adjust || undefined
        }]));
    }

    async #snapshot() {
        this.#readForm();
        if (this.source.combat && game.user.isGM) {
            // Saved so the odds check uses the same setup; a failed save must not stop the run.
            try {
                // Elite/Weak trials stay in this window: saved, the odds check would apply them
                // silently, and twice if the GM then applies PF2e's own adjustment to the actor.
                const overrides = Object.fromEntries(Object.entries(this.overrides).map(([id, override]) => {
                    const { adjust, ...rest } = override;
                    void adjust;
                    return [id, rest];
                }));
                // Foundry merges flag updates, so unset first or removed keys would survive.
                await this.source.combat.unsetFlag(MODULE_ID, "setup");
                await this.source.combat.setFlag(MODULE_ID, "setup", { setup: this.setup, overrides, fresh: this.fresh, runs: this.runs });
            } catch (error) {
                console.warn("pf2e-combat-simulator | could not save the setup on the encounter", error);
            }
        }
        // A pre-fight test ignores the tracker's turn: it's a fresh encounter.
        const combat = this.source.combat?.started ? this.source.combat : null;
        return buildSnapshot(this.entries, { setup: this.setup, overrides: this.overrides, fresh: this.fresh, combat: this.fresh ? null : combat, moraleRules: moraleRulesSetting() });
    }

    async #run(kind, settings) {
        const snapshot = await this.#snapshot();
        if (!snapshot.combatants.some((c) => c.side === "party" && c.kind === "pc")) return ui.notifications.warn("Combat Simulator: no PCs on the party side.");
        if (!snapshot.combatants.some((c) => c.side === "foes")) return ui.notifications.warn("Combat Simulator: no foes.");
        this.progress = { done: 0, total: 1 };
        this.render();
        let lastPaint = 0;
        try {
            const data = await runJob(kind, snapshot, { seed: Math.floor(Math.random() * 2 ** 31), ...settings }, (done, total) => {
                this.progress = { done, total };
                const bar = this.element?.querySelector(".sim-progress");
                const now = Date.now();
                if (bar && now - lastPaint > 100) {
                    lastPaint = now;
                    bar.innerHTML = `<progress value="${done}" max="${total}"></progress> ${done} / ${total}`;
                }
            });
            this.result = { kind, data };
            this.view = "result";
        } catch (error) {
            console.error(error);
            ui.notifications.error(`Combat Simulator failed: ${error.message}`);
        }
        this.progress = null;
        this.render();
    }

    static async #onRun() {
        this.#readForm();
        await this.#run("batch", { runs: this.runs });
    }

    static async #onCompare() {
        this.#readForm();
        if (this.comparePreset === "adjust") await this.#run("adjustments", { runs: Math.min(this.runs, 300) });
        else await this.#run("compare", { runs: this.runs, preset: this.comparePreset });
    }

    static async #onMoraleImpact() {
        this.#readForm();
        await this.#run("moraleImpact", { runs: Math.min(this.runs, 300) });
    }

    static async #onSaveProfiles() {
        this.#readForm();
        // Unlinked monster tokens carry their own actor copy; saving on the world
        // actor makes the settings apply to every token of that monster.
        const targets = new Map();
        for (const row of this.rows) {
            const override = this.overrides[row.id];
            const profile = {};
            for (const key of ["side", "role", "template", "boss", "leader", "acts"]) if (override[key] !== undefined) profile[key] = override[key];
            const actor = row.actor.isToken ? (game.actors.get(row.actor.id) ?? row.actor) : row.actor;
            targets.set(actor.uuid, { actor, profile });
        }
        let saved = 0;
        for (const { actor, profile } of targets.values()) {
            await actor.setFlag(MODULE_ID, "profile", profile);
            saved++;
        }
        ui.notifications.info(`Combat Simulator: saved settings on ${saved} actors.`);
    }

    static #onBack() {
        this.view = "setup";
        this.render();
    }
}
