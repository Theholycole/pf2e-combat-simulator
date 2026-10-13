// Morale checks in play (user, 2026-10-09): during a running encounter the
// simulator's morale rules (src/live/morale.js, on the engine's own code) watch
// the fight; when foes must check, the GM gets one whispered card per event
// ("A quarter of its side has fallen") with a row per foe: DC, modifiers as tick
// boxes, Roll (the foe's Will, GM-only) and Apply. Giving up applies the
// conditions and a marker; when half the surviving foes are broken, a rout card
// offers to make the rest flee. The gate (the party clearly ahead) is silent.
//
// Only the active GM's client acts. A world setting turns it off. The memory
// (src/live/morale.js) is kept here between looks and saved on the combat when a
// card is posted or applied, not on every hit.

import { MODULE_ID, buildSnapshot, entriesFromCombat, readFlag, savedSetup } from "./snapshot.js";
import { mergeMoraleRules } from "../src/engine/morale-rules.js";
import { emptyMemory, liveMoraleApply, liveMoraleChecks, liveRout, noteChanges } from "../src/live/morale.js";
import { allRolled, createMoraleCard, moraleCardHTML, outcomeLine, outcomeOps, recordMoraleRoll, routCardHTML, toRoll, toggleModifier } from "../src/live/morale-card.js";

const MEMORY = "moraleMemory";
const CARD = "moraleCard";
const ROUT = "moraleRout";
const SETTLE_MS = 300;

const memories = new Map();
const pending = new Map();
// Looks, Apply and the rout card run one at a time, so none reads a memory another is changing.
let queue = Promise.resolve();
const serially = (task) => (queue = queue.then(task, task).catch((error) => console.error(`${MODULE_ID} | morale in play`, error)));

export function registerMoraleSetting() {
    game.settings.register(MODULE_ID, "moraleInPlay", {
        name: "Morale checks in play",
        hint: "During an encounter, whisper the GM a card when foes must check morale (the simulator's rules): the DC, the modifiers, Roll and Apply.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
}

function enabled() {
    try {
        return game.settings.get(MODULE_ID, "moraleInPlay");
    } catch {
        return false;
    }
}

// Only one GM client acts, so nothing happens twice with two GMs connected.
const isLeadGM = () => game.user.isGM && (game.users.activeGM ? game.users.activeGM.isSelf : true);
const gmIds = () => ChatMessage.getWhisperRecipients("GM").map((user) => user.id);

function overrides() {
    try {
        const text = game.settings.get(MODULE_ID, "moraleRules");
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
}

const rulesNow = () => mergeMoraleRules(overrides() ?? {});

function memoryOf(combat) {
    return memories.get(combat.id) ?? readFlag(combat, MEMORY) ?? emptyMemory();
}

async function keep(combat, memory, { save = false } = {}) {
    memories.set(combat.id, memory);
    if (save && game.combats.has(combat.id)) await combat.setFlag(MODULE_ID, MEMORY, memory);
}

async function snapshotOf(combat) {
    const { setup, overrides: perRun } = savedSetup(combat);
    return buildSnapshot(entriesFromCombat(combat), { setup, overrides: perRun, combat, moraleRules: overrides() });
}

// --- Watching the fight -------------------------------------------------------------

function combatsWith(test) {
    return game.combats.filter((combat) => combat.started && combat.combatants.some(test));
}

// A change in a running encounter: look again once things settle. turnStart: whose turn began.
function schedule(combat, turnStart = null) {
    if (!combat?.started || !enabled() || !isLeadGM()) return;
    const entry = pending.get(combat.id) ?? { turnStart: null, timer: null };
    if (turnStart) entry.turnStart = turnStart;
    clearTimeout(entry.timer);
    entry.timer = setTimeout(() => {
        pending.delete(combat.id);
        serially(() => look(combat, entry.turnStart));
    }, SETTLE_MS);
    pending.set(combat.id, entry);
}

async function look(combat, turnStart) {
    if (!game.combats.has(combat.id) || !combat.started) return;
    const snapshot = await snapshotOf(combat);
    if (!snapshot.combatants.some((c) => c.side === "party") || !snapshot.combatants.some((c) => c.side === "foes")) return;
    const before = memoryOf(combat);
    const rules = rulesNow();
    const { checks, memory } = liveMoraleChecks({ snapshot, memory: before, round: Math.max(1, combat.round ?? 1), turnStart, rules });
    await keep(combat, memory, { save: !before.roster || checks.length > 0 });
    for (const check of checks) await postCard(combat, rules, check);
    // Foes fleeing from spells count as broken too: the rout can come without a card's Apply.
    if (before.roster) await maybeRout(combat, rules);
}

async function postCard(combat, rules, check) {
    const who = {};
    for (const row of check.rows) {
        const combatant = combat.combatants.get(row.id);
        who[row.id] = { actorUuid: combatant?.actor?.uuid ?? null, tokenUuid: combatant?.token?.uuid ?? null };
    }
    const card = createMoraleCard({ rules, combatId: combat.id, round: combat.round, check, who });
    await ChatMessage.create({ content: moraleCardHTML(card), speaker: { alias: "Morale" }, whisper: gmIds(), flags: { [MODULE_ID]: { [CARD]: card } } });
}

export function setUpMoraleInPlay() {
    const forActor = (actor) => {
        if (!actor) return;
        for (const combat of combatsWith((combatant) => combatant.actor?.uuid === actor.uuid || combatant.actorId === actor.id)) schedule(combat);
    };
    Hooks.on("updateActor", (actor) => forActor(actor));
    Hooks.on("updateToken", (token) => {
        for (const combat of combatsWith((combatant) => combatant.tokenId === token.id)) schedule(combat);
    });
    for (const hook of ["createItem", "updateItem", "deleteItem"]) {
        Hooks.on(hook, (item) => {
            if (["condition", "effect"].includes(item.type)) forActor(item.parent);
        });
    }
    for (const hook of ["createCombatant", "updateCombatant", "deleteCombatant"]) Hooks.on(hook, (combatant) => schedule(combatant.parent));
    Hooks.on("combatStart", (combat) => schedule(combat));
    Hooks.on("updateCombat", (combat, changed) => {
        if ("round" in changed || "started" in changed) schedule(combat);
    });
    // PF2e calls it on the active GM's client as a creature's turn begins.
    Hooks.on("pf2e.startTurn", (combatant, encounter) => schedule(encounter ?? combatant?.parent, combatant?.id ?? null));
    Hooks.on("deleteCombat", (combat) => {
        memories.delete(combat.id);
        clearTimeout(pending.get(combat.id)?.timer);
        pending.delete(combat.id);
    });
    Hooks.on("renderChatMessageHTML", (message, html) => wire(message, html));
    for (const element of document.querySelectorAll("[data-message-id]")) {
        if (element.querySelector(".pf2e-sim-morale")) wire(game.messages.get(element.dataset.messageId), element);
    }
}

// --- The cards -------------------------------------------------------------------------

function wire(message, html) {
    if (!message || !game.user.isGM) return;
    const card = message.getFlag?.(MODULE_ID, CARD);
    const rout = message.getFlag?.(MODULE_ID, ROUT);
    if (!card && !rout) return;
    for (const element of html.querySelectorAll("[data-sim-morale]")) {
        if (element.dataset.simWired) continue;
        element.dataset.simWired = "true";
        const action = element.dataset.simMorale;
        const handler = async (event) => {
            if (action !== "toggle") event.preventDefault();
            element.disabled = true;
            try {
                await press(message, action, element.dataset);
            } catch (error) {
                ui.notifications.error(`Morale: ${error.message}`);
                console.error(`${MODULE_ID} | morale card`, error);
                element.disabled = false;
            }
        };
        element.addEventListener(action === "toggle" ? "change" : "click", handler);
    }
}

async function press(message, action, data) {
    if (action === "toggle") return updateCard(message, toggleModifier(cardOf(message), data.rowId, data.modId));
    if (action === "roll") return rollRow(message, data.rowId);
    if (action === "roll-all") {
        for (const row of toRoll(cardOf(message))) await rollRow(message, row.id);
        return null;
    }
    if (action === "apply") return serially(() => applyCard(message));
    if (action === "rout") return serially(() => routTheRest(message));
    return null;
}

const cardOf = (message) => game.messages.get(message.id)?.getFlag(MODULE_ID, CARD) ?? message.getFlag(MODULE_ID, CARD);

function updateCard(message, card) {
    return message.update({ content: moraleCardHTML(card), [`flags.${MODULE_ID}.${CARD}`]: card });
}

async function actorOf(row) {
    const token = row.tokenUuid ? await fromUuid(row.tokenUuid).catch(() => null) : null;
    return token?.actor ?? (row.actorUuid ? await fromUuid(row.actorUuid).catch(() => null) : null);
}

// The foe's Will, with the ticked modifiers, against the DC; rolled for the GM only (PF2e 8.5 on Foundry 14
// takes messageMode, not rollMode, and makes a "secret" roll GM-only).
async function rollRow(message, rowId) {
    const row = cardOf(message).rows.find((entry) => entry.id === rowId);
    if (!row || row.bossHolds || row.degree !== null) return;
    const actor = await actorOf(row);
    if (!actor?.saves?.will) throw new Error(`${row.name}'s Will isn't available.`);
    const modifiers = row.modifiers.filter((modifier) => modifier.on).map((modifier) => new game.pf2e.Modifier({ slug: `morale-${modifier.id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`, label: modifier.label, modifier: modifier.value, type: "untyped" }));
    const roll = await actor.saves.will.roll({ dc: { value: row.dc, label: "Morale DC" }, modifiers, skipDialog: true, messageMode: "gm", extraRollOptions: ["morale-check", "secret"], title: "Morale check" });
    if (!roll) return;
    const natural = roll.dice?.[0]?.total ?? null;
    let degree = roll.degreeOfSuccess ?? roll.options?.degreeOfSuccess ?? null;
    if (degree === null || degree === undefined) {
        degree = roll.total >= row.dc + 10 ? 3 : roll.total >= row.dc ? 2 : roll.total <= row.dc - 10 ? 0 : 1;
        if (natural === 20) degree = Math.min(3, degree + 1);
        if (natural === 1) degree = Math.max(0, degree - 1);
    }
    await updateCard(message, recordMoraleRoll(cardOf(message), rowId, { total: roll.total, natural, degree }));
}

async function setFrightened(actor, value) {
    const existing = actor.itemTypes.condition.find((condition) => condition.slug === "frightened" && condition.active);
    const now = existing?.value ?? 0;
    if (value === now) return value;
    if (value <= 0) await actor.decreaseCondition("frightened", { forceRemove: true });
    else if (existing) await game.pf2e.ConditionManager.updateConditionValue(existing.id, actor, value);
    else await actor.increaseCondition("frightened", { value });
    return value;
}

const marker = (name, slug, extra = {}) => ({
    name,
    type: "effect",
    img: "icons/svg/terror.svg",
    system: { slug, description: { value: "<p>From a failed morale check (Combat Simulator).</p>" }, duration: { value: -1, unit: "unlimited", expiry: null, sustained: false }, rules: [], tokenIcon: { show: true }, ...extra },
    flags: { [MODULE_ID]: { morale: slug } }
});

// Carries out one result's operations (src/live/morale-card.js outcomeOps). → what the creature looks like after.
async function carryOut(ops, actor, combatant) {
    const after = {};
    const frightenedNow = () => actor.itemTypes.condition.find((condition) => condition.slug === "frightened" && condition.active)?.value ?? 0;
    for (const op of ops) {
        if (op.op === "frightened") {
            const now = frightenedNow();
            const target = op.atLeast !== undefined ? Math.max(now, op.atLeast) : Math.max(0, Math.min(op.max ?? 4, now + op.delta));
            after.frightened = await setFrightened(actor, target);
        } else if (op.op === "condition") {
            if (!actor.hasCondition?.(op.slug)) await actor.increaseCondition(op.slug);
            if (op.slug === "fleeing") after.fleeing = true;
        } else if (op.op === "surrender") {
            await actor.createEmbeddedDocuments("Item", [marker("Surrendered", "surrendered-morale")]);
            if (combatant && !combatant.defeated) await combatant.update({ defeated: true });
            after.up = false;
        } else if (op.op === "berserk") {
            await actor.createEmbeddedDocuments("Item", [marker("Berserk (morale)", "berserk-morale", { duration: { value: 1, unit: "rounds", expiry: "turn-end", sustained: false }, rules: [{ key: "FlatModifier", selector: "ac", value: -1, label: "Berserk (morale)" }] })]);
        }
    }
    return after;
}

async function applyCard(message) {
    const card = cardOf(message);
    if (!card || card.status !== "open") return;
    if (!allRolled(card)) throw new Error("Not every foe has rolled yet.");
    const combat = game.combats.get(card.combatId);
    if (!combat) throw new Error("The encounter is gone.");
    const rules = rulesNow();
    const rows = card.rows.filter((row) => !row.bossHolds).map((row) => ({ id: row.id, reason: card.reason, degree: row.degree }));
    const { results, memory } = liveMoraleApply({ snapshot: await snapshotOf(combat), memory: memoryOf(combat), round: card.round, rules, rows });
    const lines = card.rows.filter((row) => row.bossHolds).map((row) => `${row.name}: Boss Resolve, it holds.`);
    const changes = {};
    for (const result of results) {
        const row = card.rows.find((entry) => entry.id === result.id);
        const note = result.held === "fanatic" ? " (a fanatic ignores its first failure)" : result.held === "boss" ? " (Boss Resolve: a failure holds)" : "";
        try {
            const actor = await actorOf(row);
            if (!actor) throw new Error("its actor is gone");
            changes[result.id] = await carryOut(outcomeOps(result.outcome), actor, combat.combatants.get(result.id));
            lines.push(outcomeLine(result.name, result.outcome, { lessFrightened: result.lessFrightened ?? 0 }) + note);
        } catch (error) {
            lines.push(`Couldn't apply to ${result.name}: ${error.message}`);
        }
    }
    await keep(combat, noteChanges(memory, changes), { save: true });
    await updateCard(message, { ...card, status: "applied", results: lines });
    await maybeRout(combat, rules);
}

async function maybeRout(combat, rules) {
    const memory = memoryOf(combat);
    if (memory.routPosted) return;
    const { routs, rest } = liveRout({ snapshot: await snapshotOf(combat), memory, rules });
    if (!routs) return;
    const named = rest.map((id) => ({ id, name: combat.combatants.get(id)?.name ?? id, tokenUuid: combat.combatants.get(id)?.token?.uuid ?? null, actorUuid: combat.combatants.get(id)?.actor?.uuid ?? null }));
    await keep(combat, { ...memory, routPosted: true }, { save: true });
    await ChatMessage.create({ content: routCardHTML({ rest: named }), speaker: { alias: "Morale" }, whisper: gmIds(), flags: { [MODULE_ID]: { [ROUT]: { combatId: combat.id, rest: named, done: false } } } });
}

// "Make the rest flee": a rout for each foe still fighting (fleeing, frightened 2); they've given up.
async function routTheRest(message) {
    const state = message.getFlag(MODULE_ID, ROUT);
    if (!state || state.done) return;
    const combat = game.combats.get(state.combatId);
    const changes = {};
    for (const entry of state.rest) {
        const actor = await actorOf(entry);
        if (!actor) continue;
        changes[entry.id] = { ...(await carryOut(outcomeOps({ kind: "giveUp", how: "rout" }), actor, combat?.combatants.get(entry.id))), broken: true };
    }
    if (combat) await keep(combat, noteChanges(memoryOf(combat), changes), { save: true });
    await message.update({ content: routCardHTML({ rest: state.rest, done: true }), [`flags.${MODULE_ID}.${ROUT}.done`]: true });
}
