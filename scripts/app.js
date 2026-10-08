// The Combat Simulator window: encounter setup, then results.

import { MODULE_ID, buildSnapshot, entriesFromCombat, entriesFromTokens, readActor, readFlag, defaultSide } from "./snapshot.js";
import { runJob } from "./runner.js";
import { FightLogApp } from "./log-app.js";
import { MORALE_RULES } from "../src/engine/morale-rules.js";
import { ROLE_PROFILES } from "../src/engine/planner.js";
import { renderAdjustments, renderReport, renderCompare, renderMoraleImpact, escape } from "./render.js";
import { MAP_KINDS, regionChoices, roundsHeld } from "./map.js";

const { ApplicationV2 } = foundry.applications.api;

const OBJECTIVE_KINDS = [["", "None"], ["protect", "Protect a creature or object"], ["target", "Kill or capture a target"], ["survive", "Survive N rounds"], ["task", "Do a task"], ["hold", "Hold an area"], ["escort", "Escort a creature to the exit"], ["retrieve", "Retrieve an item and escape"]];
const COMPARE_CHOICES = [["adjust", "What would change the odds (Weak, Elite, remove)"], ["morale", "Morale on / off"], ["heroPoints", "Hero points on / off"], ["objective", "Objective on / off"], ["retreat", "Party retreat on / off"]];
// Escalation rules (E1–E4): "when → then".
const WHEN_KINDS = [["round", "Round"], ["alarm", "The alarm is raised"], ["falls", "A creature falls"], ["foesHalf", "The foes are at half their HP"], ["firstFlee", "A foe flees"], ["enters", "A party creature enters a Region"]];
const THEN_KINDS = [["arrive", "Creatures arrive"], ["hazard", "A hazard starts"], ["danger", "Danger starts"]];
const DAMAGE_TYPES = ["fire", "cold", "acid", "electricity", "sonic", "force", "poison", "piercing", "slashing", "bludgeoning", "mental", "spirit", "vitality", "void", "bleed", "untyped"];
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
            back: SimulatorApp.#onBack,
            addRule: SimulatorApp.#onAddRule,
            removeRule: SimulatorApp.#onRemoveRule
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
                alarm: override.alarm ?? "",
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
        // Choices that change which fields show.
        for (const name of ["objectiveKind", "areaRegion", "exitRegion"]) {
            content.querySelector(`[name=${name}]`)?.addEventListener("change", () => {
                this.#readForm();
                this.render();
            });
        }
        content.addEventListener("change", (event) => {
            const name = event.target?.name ?? "";
            if (!/^rule\.\d+\.(when\.kind|then\.kind|then\.targets)$|^alarm$/.test(name)) return;
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
                <td>${row.side === "foes" && row.kind !== "pc" && row.kind !== "hazard" ? `<select name="alarm" title="Raises the alarm: at a gong (1 action there), or by running off the battlefield">${option("", "—", row.alarm)}${option("gong", "Gong", row.alarm)}${option("runner", "Runner", row.alarm)}</select>` : "—"}</td>
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
        if (MAP_KINDS.has(objective.kind)) objectiveFields = this.#mapFields(objective);
        const situational = SITUATIONAL.map(([key, label]) => `<label class="check"><input type="checkbox" name="situational.${key}" ${setup.situational?.[key] ? "checked" : ""}> ${escape(label)}</label>`).join("");
        return `
        <form class="sim-setup" autocomplete="off">
            <p class="muted">${escape(this.#sourceLabel())}. Nothing on the canvas changes: fights are played in memory.</p>
            <table class="sim-combatants">
                <thead><tr><th></th><th>Creature</th><th>Side</th><th>Role</th><th>Morale</th><th>Boss</th><th>Leader</th><th>Acts</th><th>Arrives rd</th><th>From</th><th title="An alarm-raiser for the escalation rules">Alarm</th><th title="PF2e's Elite or Weak adjustment, for this run only">Adjust</th></tr></thead>
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
            ${this.#escalationFields()}
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

    // The scene the encounter is on, for its Regions.
    get #scene() {
        return this.source.combat?.scene ?? canvas?.scene ?? null;
    }

    // Escalations (E1–E4): the rules, the gong for alarm-raisers, and (in play) the round the alarm was raised.
    #escalationFields() {
        const escalations = this.setup.escalations ?? {};
        const rules = escalations.rules ?? [];
        const regions = regionChoices(this.#scene);
        const regionOptions = (value) => regions.length ? regions.map((region) => option(region.id, region.name, value)).join("") : option("", "— no Regions on the scene —", "");
        const rows = (filter, value) => this.rows.filter(filter).map((row) => option(row.id, row.name, value)).join("");
        const ruleHTML = (rule, index) => {
            const name = (key) => `rule.${index}.${key}`;
            const when = rule.when ?? { kind: "round" };
            const then = rule.then ?? { kind: "arrive" };
            let whenFields = "";
            if (when.kind === "round") whenFields = `<input type="number" name="${name("when.round")}" min="1" value="${escape(when.round ?? 2)}">`;
            if (when.kind === "falls") whenFields = `<select name="${name("when.creatureId")}">${rows(() => true, when.creatureId)}</select>`;
            if (when.kind === "enters") whenFields = `<select name="${name("when.region")}">${regionOptions(when.region)}</select>`;
            let thenFields = "";
            if (then.kind === "arrive") {
                const creatures = this.rows.filter((row) => row.kind !== "pc" && row.kind !== "hazard").map((row) => `<label class="check"><input type="checkbox" name="${name("then.creature")}" value="${escape(row.id)}" ${(then.creatureIds ?? []).includes(row.id) ? "checked" : ""}> ${escape(row.name)}</label>`).join("");
                const place = then.placeRegion ? `region:${then.placeRegion}` : then.band ?? "near";
                thenFields = `<span class="sim-rule-creatures">${creatures}</span>
                    <label>after <input type="number" name="${name("then.delay")}" min="0" value="${escape(then.delay ?? 0)}"> more rounds</label>
                    <label>at <select name="${name("then.place")}">${option("near", "Near", place)}${option("far", "Far", place)}${regions.map((region) => option(`region:${region.id}`, region.name, place)).join("")}</select></label>`;
            }
            if (then.kind === "hazard") {
                const hazards = rows((row) => row.kind === "hazard", then.hazardId);
                thenFields = hazards ? `<select name="${name("then.hazardId")}">${hazards}</select>` : `<span class="muted">No hazard in the encounter.</span>`;
            }
            if (then.kind === "danger") {
                thenFields = `<label>damage <input type="text" name="${name("then.damage")}" value="${escape(then.damage ?? "2d6")}" size="6"></label>
                    <select name="${name("then.type")}">${DAMAGE_TYPES.map((type) => option(type, type, then.type ?? "fire")).join("")}</select>
                    <label>basic save <select name="${name("then.saveType")}">${option("", "none", then.save?.type ?? "")}${["fortitude", "reflex", "will"].map((save) => option(save, save, then.save?.type)).join("")}</select></label>
                    <label>DC <input type="number" name="${name("then.saveDc")}" value="${escape(then.save?.dc ?? "")}"></label>
                    <label>hits <select name="${name("then.targets")}">${option("all", "everyone", then.targets ?? "all")}${option("party", "the party", then.targets)}${option("foes", "the foes", then.targets)}${option("region", "everyone in a Region", then.targets)}</select></label>
                    ${then.targets === "region" ? `<select name="${name("then.region")}">${regionOptions(then.region)}</select>` : ""}
                    <label>grows by <input type="text" name="${name("then.grow")}" value="${escape(then.grow ?? "")}" size="5" placeholder="0"> a round</label>`;
            }
            return `<div class="sim-rule" data-index="${index}">
                <label>When <select name="${name("when.kind")}">${WHEN_KINDS.map(([value, label]) => option(value, label, when.kind)).join("")}</select></label> ${whenFields}
                <label>→ then <select name="${name("then.kind")}">${THEN_KINDS.map(([value, label]) => option(value, label, then.kind)).join("")}</select></label> ${thenFields}
                <button type="button" data-action="removeRule" data-index="${index}" title="Remove this rule"><i class="fa-solid fa-xmark"></i></button>
            </div>`;
        };
        const raisers = this.rows.filter((row) => row.alarm);
        const gong = escalations.gong ?? {};
        const gongFields = raisers.some((row) => row.alarm === "gong")
            ? `<label>Gong <select name="gong.region">${option("", regions.length ? "— type Strides —" : "— no Regions: type Strides —", gong.region ?? "")}${regions.map((region) => option(region.id, region.name, gong.region)).join("")}</select></label>
               ${gong.region ? "" : `<label>Strides from the raisers to the gong <input type="number" name="gong.strides" min="0" value="${escape(gong.strides ?? 2)}"></label>`}`
            : "";
        const combat = this.source.combat;
        const alarmTick = combat?.started && (raisers.length || rules.some((rule) => rule.when?.kind === "alarm"))
            ? `<label>Alarm raised in round <input type="number" name="alarm.raisedRound" min="1" value="${escape(escalations.alarm?.raisedRound ?? "")}" placeholder="not yet"></label>` : "";
        return `<fieldset class="sim-escalations"><legend>Escalations</legend>
            <p class="muted">When something happens, then creatures arrive, a hazard starts, or danger starts. Each rule fires once. Hide the tokens of creatures a rule brings: once visible, they count as arrived.</p>
            ${rules.map(ruleHTML).join("")}
            <button type="button" data-action="addRule"><i class="fa-solid fa-plus"></i> Add rule</button>
            ${gongFields}${alarmTick}
        </fieldset>`;
    }

    // The rules as the form shows them; ids stay, so live play's record of what fired still matches.
    #readEscalations(form, value) {
        const previous = this.setup.escalations ?? {};
        const rules = [];
        for (const element of form.querySelectorAll(".sim-rule[data-index]")) {
            const index = Number(element.dataset.index);
            const field = (key) => element.querySelector(`[name="rule.${index}.${key}"]`)?.value ?? "";
            const when = { kind: field("when.kind") || "round" };
            if (when.kind === "round") when.round = Number(field("when.round") || 2);
            if (when.kind === "falls") when.creatureId = field("when.creatureId") || this.rows[0]?.id;
            if (when.kind === "enters") when.region = field("when.region") || null;
            const kind = field("then.kind") || "arrive";
            const before = previous.rules?.[index] ?? {};
            const sameKind = before.then?.kind === kind;
            let then = { kind };
            if (kind === "arrive") {
                const place = field("then.place") || "near";
                then = { kind, creatureIds: sameKind ? [...element.querySelectorAll(`[name="rule.${index}.then.creature"]:checked`)].map((input) => input.value) : [], delay: Number(field("then.delay") || 0), band: place.startsWith("region:") ? "near" : place, placeRegion: place.startsWith("region:") ? place.slice(7) : null };
            }
            if (kind === "hazard") then = { kind, hazardId: field("then.hazardId") || this.rows.find((row) => row.kind === "hazard")?.id || null };
            if (kind === "danger") {
                const saveType = field("then.saveType");
                then = { kind, damage: field("then.damage") || "2d6", type: field("then.type") || "fire", save: saveType ? { type: saveType, dc: Number(field("then.saveDc") || 0) || null } : null, targets: field("then.targets") || "all", region: field("then.region") || null, grow: field("then.grow") || null };
            }
            rules.push({ id: before.id ?? foundry.utils.randomID(), when, then });
        }
        const raisedRound = value("alarm.raisedRound");
        return {
            rules,
            gong: { region: value("gong.region") || (form.querySelector("[name='gong.region']") ? null : previous.gong?.region ?? null), strides: Number(value("gong.strides") || previous.gong?.strides || 2) },
            alarm: { raisedRound: raisedRound ? Number(raisedRound) : (form.querySelector("[name='alarm.raisedRound']") ? null : previous.alarm?.raisedRound ?? null) }
        };
    }

    static #onAddRule() {
        this.#readForm();
        const escalations = this.setup.escalations ?? { rules: [] };
        escalations.rules = [...(escalations.rules ?? []), { id: foundry.utils.randomID(), when: { kind: "round", round: 2 }, then: { kind: "arrive", creatureIds: [], delay: 0, band: "near" } }];
        this.setup.escalations = escalations;
        this.render();
    }

    static #onRemoveRule(event, target) {
        this.#readForm();
        const index = Number(target.dataset.index);
        this.setup.escalations.rules = (this.setup.escalations.rules ?? []).filter((rule, position) => position !== index);
        this.render();
    }

    // Hold an area, escort, retrieve and escape (O1–O3): Regions for the area and the
    // exit, or Strides typed by hand when there's no Region to pick.
    #mapFields(objective) {
        const regions = regionChoices(this.#scene);
        const regionSelect = (name, label) => `<label>${label} <select name="${name}">${option("", regions.length ? "— type Strides —" : "— no Regions on the scene: type Strides —", objective[name] ?? "")}${regions.map((region) => option(region.id, region.name, objective[name])).join("")}</select></label>`;
        const strides = objective.strides ?? {};
        const typed = (key, label) => `<label>${label}: party <input type="number" name="strides.party.${key}" min="0" value="${escape(strides.party?.[key] ?? (key === "area" ? 1 : 2))}"> foes <input type="number" name="strides.foes.${key}" min="0" value="${escape(strides.foes?.[key] ?? (key === "area" ? 1 : 2))}"></label>`;
        const usesArea = objective.kind !== "escort";
        const usesExit = objective.kind !== "hold";
        let fields = "";
        if (objective.kind === "escort") {
            const escorts = this.rows.filter((row) => row.side === "party" && row.kind !== "pc");
            fields += escorts.length
                ? `<label>Escort <select name="escortId">${escorts.map((row) => option(row.id, row.name, objective.escortId)).join("")}</select></label>`
                : `<p class="muted">Put a creature that isn't a PC on the party side to escort it.</p>`;
        }
        if (usesArea) fields += regionSelect("areaRegion", objective.kind === "retrieve" ? "Item's area" : "Area");
        if (usesExit) fields += regionSelect("exitRegion", "Exit");
        if (usesArea && !objective.areaRegion) fields += typed("area", "Strides to the area");
        if (usesExit && !objective.exitRegion) fields += typed("exit", "Strides to the exit");
        if (objective.kind === "retrieve" && !(objective.areaRegion && objective.exitRegion)) fields += `<label>From the area to the exit <input type="number" name="strides.areaToExit" min="0" value="${escape(strides.areaToExit ?? 2)}"> Strides</label>`;
        if (objective.kind === "hold") {
            fields += `<label>Rounds to hold <input type="number" name="needed" min="1" value="${escape(objective.needed ?? 3)}"></label>`;
            const combat = this.source.combat;
            if (combat?.started && objective.areaRegion) fields += `<p class="muted">Held so far: ${roundsHeld(combat)} rounds (counted at each new round).</p>`;
        }
        if (objective.kind === "retrieve") {
            const pcs = this.rows.filter((row) => row.side === "party" && row.kind === "pc");
            fields += `<label>Item <select name="carrierId">${option("", "In the area", objective.carrierId ?? "")}${pcs.map((row) => option(row.id, `Carried by ${row.name}`, objective.carrierId)).join("")}</select></label>`;
        }
        fields += `<label>Deadline round <input type="number" name="deadline" min="0" value="${escape(objective.deadline ?? "")}" placeholder="none"></label>`;
        return fields;
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
            row.alarm = field("alarm")?.value ?? "";
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
            if (MAP_KINDS.has(kind)) Object.assign(objective, this.#readMapFields(kind, previous, value));
        }
        this.setup = {
            ambush: value("ambush") || null,
            cover: { party: Number(value("cover.party") || 0), foes: Number(value("cover.foes") || 0) },
            situational: Object.fromEntries(SITUATIONAL.map(([key]) => [key, checked(`situational.${key}`)])),
            objective,
            objectivePriority: Number(value("objectivePriority") || this.setup.objectivePriority || 1),
            escalations: this.#readEscalations(form, value)
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
            adjust: row.adjust || undefined,
            alarm: row.alarm || undefined
        }]));
    }

    // A map objective's fields; a field not shown keeps its earlier value. Just after the
    // objective changes, the form still shows the old one's fields: those don't count.
    #readMapFields(kind, previous, value) {
        const same = MAP_KINDS.has(previous.kind) ? previous : {};
        const shown = (name) => previous.kind === kind && !!this.element.querySelector(`form.sim-setup [name="${name}"]`);
        const pick = (name, fallback) => (shown(name) ? value(name) : same[name] ?? fallback);
        const number = (name, fallback) => {
            const raw = pick(name, null);
            return raw === "" || raw === null || raw === undefined ? fallback : Number(raw);
        };
        const typedStride = (key, side, fallback) => {
            const name = `strides.${side}.${key}`;
            return shown(name) ? Number(value(name) || 0) : same.strides?.[side]?.[key] ?? fallback;
        };
        const fields = {
            areaRegion: kind === "escort" ? null : pick("areaRegion", "") || null,
            exitRegion: kind === "hold" ? null : pick("exitRegion", "") || null,
            strides: {
                party: { area: typedStride("area", "party", 1), exit: typedStride("exit", "party", 2) },
                foes: { area: typedStride("area", "foes", 1), exit: typedStride("exit", "foes", 2) },
                areaToExit: shown("strides.areaToExit") ? Number(value("strides.areaToExit") || 0) : same.strides?.areaToExit ?? 2
            },
            deadline: number("deadline", null)
        };
        if (kind === "hold") fields.needed = number("needed", 3);
        if (kind === "escort") fields.escortId = pick("escortId", "") || this.rows.find((row) => row.side === "party" && row.kind !== "pc")?.id || null;
        if (kind === "retrieve") fields.carrierId = pick("carrierId", "") || null;
        return fields;
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
