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
}
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
function alchemistOf() {
    const actor = canvas?.tokens?.controlled?.find((token) => token.actor?.type === "character")?.actor ?? game.user.character ?? null;
    const level = actor?.level ?? Math.max(1, Math.round(game.actors.filter((each) => each.type === "character" && each.hasPlayerOwner).reduce((sum, each, _, all) => sum + each.level / all.length, 0)) || 1);
    const alchemist = actor?.class?.slug === "alchemist";
    const classDC = alchemist ? Number(actor.system?.attributes?.classDC?.value ?? actor.classDC?.dc?.value) || null : null;
    return { actor, numbers: alchemistNumbers(level, { classDC }) };
}

export async function alchemyAdvice() {
    const targets = [...game.user.targets].filter((token) => token.actor && token.actor.type !== "character");
    if (!targets.length) return ui.notifications.warn("Alchemical advice: target one or more monsters first.");
    const { actor, numbers } = alchemistOf();
    const items = await itemsFor(numbers.level);
    if (!items.length) return ui.notifications.warn("Alchemical advice: PF2e's equipment compendium or the item module wasn't found.");
    const sections = [];
    for (const token of targets) {
        const creature = await readActor(token.actor, { id: token.id, name: token.name });
        sections.push(adviceHtml({ ...creature, name: token.name, level: token.actor.level }, numbers, rankItems(creature, items, numbers)));
    }
    const who = actor ? `${actor.name}, level ${numbers.level}` : `an alchemist of level ${numbers.level}`;
    return ChatMessage.create({ speaker: { alias: "Alchemical advice" }, whisper: [game.user.id], content: `<p><strong>Alchemical advice</strong> for ${foundry.utils.escapeHTML?.(who) ?? who}: power per action is the simulator's worth of one use on the monster, as a share of beating it.</p>${sections.join("")}` });
}

export function setUpAlchemyAdvice() {
    if (!enabled()) return;
    Hooks.on("getSceneControlButtons", (controls) => {
        const tool = { name: "alchemy-advice", title: "Alchemical advice for the targeted monsters", icon: "fa-solid fa-flask-vial", button: true, onClick: () => alchemyAdvice(), onChange: () => alchemyAdvice() };
        // (Foundry 13+: controls is a record by name, tools a record; before, arrays.)
        const tokens = Array.isArray(controls) ? controls.find((control) => control.name === "token") : controls.tokens ?? controls.token;
        if (!tokens) return;
        if (Array.isArray(tokens.tools)) tokens.tools.push(tool);
        else tokens.tools[tool.name] = { ...tool, order: Object.keys(tokens.tools).length };
    });
}
