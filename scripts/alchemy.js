// Alchemical advice in play (2026-11-04, Cole: "Have the alchemist advice work with targeted monsters and give items a power rank specific
// to that monster. Use the simulators own rankings for conditions and damage dice and anything else but add the context of the monster").
// An optional feature (the world setting "Alchemical advice"): a token-controls button that ranks every alchemical item an alchemist of the
// selected character's level can make with Quick Alchemy against each targeted monster — the engine's rankItems (src/engine/alchemy.js) on
// the monster as the simulator reads it (readActor: its AC, saves, immunities, weaknesses and resistances), whispered to the user.
import { MODULE_ID, readActor } from "./snapshot.js";
import { alchemistNumbers, bestTypes, describeItem, isAlchemicalConsumable, rankItems } from "../src/engine/alchemy.js";
import { adviceHtml } from "../src/engine/alchemy-report.js";

const SETTING = "alchemyAdvice";
const PACK = "pf2e.equipment-srd";

export function registerAlchemySetting() {
    game.settings.register(MODULE_ID, SETTING, {
        name: "Alchemical advice",
        hint: "Adds a token-controls button that ranks the alchemical items an alchemist can make against the targeted monsters, by the simulator's own worth of their damage and conditions on each one.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true
    });
    // (2026-11-04, Cole: "Add an option for the alchemy advice to happen on successful recall knowledge checks against a monster".)
    game.settings.register(MODULE_ID, RECALL_SETTING, {
        name: "Alchemical advice on Recall Knowledge",
        hint: "With Alchemical advice on: when a character succeeds at Recall Knowledge against a monster (a check with a DC, the monster targeted), whisper the advice for it to that character's players. A blind (secret) roll's advice goes to the GM only, so it doesn't give the result away.",
        scope: "world",
        config: true,
        type: String,
        choices: { off: "Off (the button only)", alchemists: "Alchemists' checks", everyone: "Every character's checks" },
        default: "off",
        requiresReload: true
    });
}
const RECALL_SETTING = "alchemyAdviceOnRecall";
const enabled = () => game.settings.get(MODULE_ID, SETTING);

// PF2e's alchemical consumables (the equipment compendium), once a session: their sources with their uuids.
let docsPromise = null;
function alchemicalDocs() {
    docsPromise ??= (async () => {
        const pack = game.packs.get(PACK);
        if (!pack) return [];
        const index = await pack.getIndex({ fields: ["system.traits", "system.level", "type"] });
        const ids = index.filter((entry) => isAlchemicalConsumable(entry)).map((entry) => entry._id);
        const documents = await pack.getDocuments({ _id__in: ids });
        return documents.map((document) => ({ ...document.toObject(), uuid: document.uuid }));
    })();
    return docsPromise;
}

// The item module's compilers, read directly as the snapshot's bomb riders are (scripts/snapshot.js bombRiderOf).
let compilers = null;
async function itemCompilers() {
    compilers ??= {
        item: await import("../../pf2e-automatic-item-resolution/src/compiler/index.js").then((module) => module.compileItem).catch(() => null),
        bomb: await import("../../pf2e-automatic-item-resolution/src/compiler/bombs.js").then((module) => module.compileBomb).catch(() => null)
    };
    return compilers;
}

const itemsByLevel = new Map();
async function itemsFor(level) {
    if (itemsByLevel.has(level)) return itemsByLevel.get(level);
    const docs = await alchemicalDocs();
    const { item, bomb } = await itemCompilers();
    const items = bestTypes(docs, level).map((doc) => {
        let itemPlan = null;
        let bombPlan = null;
        try {
            itemPlan = doc.type === "consumable" && item ? item(doc, {}) : null;
        } catch {
            itemPlan = null;
        }
        try {
            bombPlan = doc.type === "weapon" && bomb ? bomb(doc) : null;
        } catch {
            bombPlan = null;
        }
        return describeItem(doc, { itemPlan, bombPlan });
    }).filter(Boolean);
    itemsByLevel.set(level, items);
    return items;
}

// The alchemist: the selected token's character (or the user's own), its level, and as an alchemist its own class DC; else the simulator's
// alchemist at the party's level.
function alchemistOf(chosen = null) {
    const actor = chosen ?? canvas?.tokens?.controlled?.find((token) => token.actor?.type === "character")?.actor ?? game.user.character ?? null;
    const level = actor?.level ?? Math.max(1, Math.round(game.actors.filter((each) => each.type === "character" && each.hasPlayerOwner).reduce((sum, each, _, all) => sum + each.level / all.length, 0)) || 1);
    const alchemist = actor?.class?.slug === "alchemist";
    const classDC = alchemist ? Number(actor.system?.attributes?.classDC?.value ?? actor.classDC?.dc?.value) || null : null;
    return { actor, numbers: alchemistNumbers(level, { classDC }) };
}

export async function alchemyAdvice() {
    const targets = [...game.user.targets].filter((token) => token.actor && token.actor.type !== "character");
    if (!targets.length) return ui.notifications.warn("Alchemical advice: target one or more monsters first.");
    return postAdvice(targets, { whisper: [game.user.id] });
}

// The card for these monster tokens, whispered to these users; actor: the alchemist (else the selected character's, as alchemistOf).
async function postAdvice(targets, { actor: chosen = null, whisper, why = "" } = {}) {
    const { actor, numbers } = alchemistOf(chosen);
    const items = await itemsFor(numbers.level);
    if (!items.length) return ui.notifications.warn("Alchemical advice: PF2e's equipment compendium or the item module wasn't found.");
    const sections = [];
    for (const token of targets) {
        const creature = await readActor(token.actor, { id: token.id, name: token.name });
        sections.push(adviceHtml({ ...creature, name: token.name, level: token.actor.level }, numbers, rankItems(creature, items, numbers)));
    }
    const who = actor ? `${actor.name}, level ${numbers.level}` : `an alchemist of level ${numbers.level}`;
    const escape = (text) => foundry.utils.escapeHTML?.(text) ?? text;
    return ChatMessage.create({ speaker: { alias: "Alchemical advice" }, whisper, content: `<p><strong>Alchemical advice</strong> for ${escape(who)}${why ? ` (${escape(why)})` : ""}: power per action is the simulator's worth of one use on the monster, as a share of beating it.</p>${sections.join("")}` });
}

// A successful Recall Knowledge against a monster: PF2e's check message (flags.pf2e.context: a skill check with the action's roll option or
// "Recall Knowledge" in its flavor, an outcome, the target). Run once: by the active GM's client (a card a player's client made would show
// to that player even when whispered to the GM only), or with no GM on, by the roller's for a roll that isn't secret.
function recallKnowledgeOf(message) {
    const context = message.flags?.pf2e?.context;
    if (!context || !["skill-check", "check"].includes(context.type)) return null;
    const options = context.options ?? [];
    const recall = options.includes("action:recall-knowledge") || /recall knowledge/i.test(`${message.flavor ?? ""} ${context.title ?? ""}`);
    if (!recall || !["success", "criticalSuccess"].includes(context.outcome)) return null;
    const tokenUuid = context.target?.token ?? null;
    const token = tokenUuid ? fromUuidSync(tokenUuid)?.object ?? null : null;
    if (!token?.actor || token.actor.type === "character" || token.actor.hasPlayerOwner) return null;
    const actor = message.actor ?? (message.speaker?.actor ? game.actors.get(message.speaker.actor) : null);
    if (actor?.type !== "character") return null;
    return { actor, token, outcome: context.outcome, blind: !!message.blind || context.rollMode === "blindroll" };
}

async function onRecallKnowledge(message) {
    const mode = game.settings.get(MODULE_ID, RECALL_SETTING);
    if (mode === "off") return;
    const activeGM = game.users.activeGM ?? game.users.find((user) => user.isGM && user.active) ?? null;
    if (activeGM ? activeGM.id !== game.user.id : message.author?.id !== game.user.id) return;
    const recall = recallKnowledgeOf(message);
    if (recall?.blind && !game.user.isGM) return;
    if (!recall || (mode === "alchemists" && recall.actor.class?.slug !== "alchemist")) return;
    const gms = game.users.filter((user) => user.isGM && user.active).map((user) => user.id);
    const players = game.users.filter((user) => !user.isGM && recall.actor.testUserPermission(user, "OWNER")).map((user) => user.id);
    const whisper = recall.blind ? gms : [...new Set([...players, ...gms])];
    if (!whisper.length) return;
    const why = `${recall.actor.name} ${recall.outcome === "criticalSuccess" ? "critically succeeded" : "succeeded"} at Recall Knowledge${recall.blind ? "; a secret roll, so GM only" : ""}`;
    return postAdvice([recall.token], { actor: recall.actor, whisper, why });
}

let lastClick = 0;
function onceAClick() {
    const now = Date.now();
    if (now - lastClick < 500) return;
    lastClick = now;
    alchemyAdvice();
}

export function setUpAlchemyAdvice() {
    if (!enabled()) return;
    Hooks.on("createChatMessage", (message) => {
        onRecallKnowledge(message).catch((error) => console.warn("Alchemical advice on Recall Knowledge:", error));
    });
    Hooks.on("getSceneControlButtons", (controls) => {
        // (Foundry 13 calls onChange for a button, older versions onClick; some call both — once a click: 2026-11-04 Foundry test.)
        const tool = { name: "alchemy-advice", title: "Alchemical advice for the targeted monsters", icon: "fa-solid fa-flask-vial", button: true, onClick: () => onceAClick(), onChange: () => onceAClick() };
        // (Foundry 13+: controls is a record by name, tools a record; before, arrays.)
        const tokens = Array.isArray(controls) ? controls.find((control) => control.name === "token") : controls.tokens ?? controls.token;
        if (!tokens) return;
        if (Array.isArray(tokens.tools)) tokens.tools.push(tool);
        else tokens.tools[tool.name] = { ...tool, order: Object.keys(tokens.tools).length };
    });
}
