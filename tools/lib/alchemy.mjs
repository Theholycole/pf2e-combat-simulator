// The alchemist's formula book as every alchemical consumable, for the Node tools (2026-11-04, Cole): PF2e's equipment pack and the item
// module's plans for each item, read here; the ranking and the simulated alchemist's numbers are the engine's (src/engine/alchemy.js), shared
// with the live module (scripts/alchemy.js).
//
// items(level): each family at its best type for the level, described (bombs and items with a save). advise(creature, level): their power
// against the creature, best per action first. alchemistKit(level, { full }): the simulated alchemist's bombs and Quick Alchemy items
// (src/engine/classes.js alchemist, options.alchemy).
import { alchemistNumbers, bestTypes, describeItem, familyOf, isAlchemicalConsumable, rankItems, saveEntry } from "../../src/engine/alchemy.js";

const { readDocuments, PACK_ROOT } = await import("./pack-creatures.mjs");
const { bombRider, itemEntry } = await import("../../src/adapter/items.js");
const I = decodeURIComponent(new URL("../../../PF2e AUTOMATIC ITEM RESOLUTION", import.meta.url).pathname);
const I2 = decodeURIComponent(new URL("../../../pf2e-automatic-item-resolution", import.meta.url).pathname);
const load = async (path) => (await import(`${I}/${path}`).catch(() => import(`${I2}/${path}`)).catch(() => null));
const itemCompiler = await load("src/compiler/index.js");
const bombCompiler = await load("src/compiler/bombs.js");

let docsCache = null;
export function alchemicalDocs() {
    docsCache ??= readDocuments(`${PACK_ROOT}/equipment`).filter((doc) => doc.collection === "items" && isAlchemicalConsumable(doc));
    return docsCache;
}

const plans = new Map();
function plansOf(doc) {
    if (!plans.has(doc._id)) {
        let itemPlan = null;
        let bombPlan = null;
        try {
            itemPlan = doc.type === "consumable" ? itemCompiler?.compileItem?.(doc, {}) ?? null : null;
        } catch {
            itemPlan = null;
        }
        try {
            bombPlan = doc.type === "weapon" ? bombCompiler?.compileBomb?.(doc) ?? null : null;
        } catch {
            bombPlan = null;
        }
        plans.set(doc._id, { itemPlan, bombPlan });
    }
    return plans.get(doc._id);
}

export function items(level, options = {}) {
    return bestTypes(alchemicalDocs(), level, options).map((doc) => describeItem(doc, plansOf(doc))).filter(Boolean).sort((a, b) => a.family.localeCompare(b.family));
}

export function advise(creature, level, options = {}) {
    const numbers = alchemistNumbers(level);
    return { numbers, rows: rankItems(creature, items(level, options), numbers) };
}

// The simulated alchemist's kit: its bombs (alchemist's fire, frost vial and bottled lightning; with full, the strongest of each damage type)
// with the item module's riders on them, elixir of life from Quick Alchemy, and with full every item with a save it can use on a foe.
const STANDARD_BOMBS = ["Alchemist's Fire", "Frost Vial", "Bottled Lightning"];
const SELF_ELIXIRS = ["Drakeheart Mutagen", "Juggernaut Mutagen", "Bestial Mutagen", "Quicksilver Mutagen", "Stone Body Mutagen", "Energy Mutagen", "Mistform Elixir", "Bravo's Brew", "Cheetah's Elixir"];
const kits = new Map();
export function alchemistKit(level, { full = false } = {}) {
    const key = `${level}|${full}`;
    if (kits.has(key)) return kits.get(key);
    const numbers = alchemistNumbers(level);
    const described = items(level);
    const strength = (item) => {
        const persistent = item.persistent ? item.persistent.dice * (item.persistent.die + 1) / 2 + item.persistent.bonus : 0;
        return item.damage.dice * (item.damage.die + 1) / 2 + item.damage.bonus + item.splash + 2 * persistent;
    };
    let bombs = described.filter((item) => item.kind === "bomb" && strength(item) > 0 && (full || STANDARD_BOMBS.includes(item.family)));
    if (full) {
        const byType = new Map();
        for (const item of bombs) if (!byType.has(item.damage.type) || strength(item) > strength(byType.get(item.damage.type))) byType.set(item.damage.type, item);
        bombs = [...byType.values()];
    }
    const spells = bombs.map((item) => (item.bombPlan ? bombRider(item.bombPlan, item.family) : null)).filter(Boolean);
    // Elixir of life: Quick Alchemy, then fed to a creature beside it (or drunk), 2 actions and a vial.
    const elixir = alchemicalDocs().filter((doc) => familyOf(doc.name) === "Elixir of Life" && (Number(doc.system?.level?.value) || 0) <= level).sort((a, b) => b.system.level.value - a.system.level.value)[0];
    const elixirPlan = elixir ? plansOf(elixir).itemPlan : null;
    const elixirEntry = elixirPlan ? itemEntry(elixirPlan, { id: "alchemist-elixir-of-life", name: `${elixir.name} (Quick Alchemy)` }) : null;
    if (elixirEntry) spells.push({ ...elixirEntry, plan: { ...elixirEntry.plan, activation: { ...(elixirEntry.plan.activation ?? {}), time: String(Number(elixirEntry.plan.activation?.time ?? 1) + 1) } }, pool: "reagents", consumable: false, from: "Quick Alchemy" });
    // (2026-11-10, Cole: "Remember they have access to all alchemical items they can craft." With full, the mutagens and elixirs that guard
    // or strengthen it in a fight, each at its best type for the level, from Quick Alchemy and drunk at once (2 actions, a vial).)
    if (full) for (const family of SELF_ELIXIRS) {
        const doc = alchemicalDocs().filter((each) => familyOf(each.name) === family && (Number(each.system?.level?.value) || 0) <= level).sort((a, b) => b.system.level.value - a.system.level.value)[0];
        const plan = doc ? plansOf(doc).itemPlan : null;
        const entry = plan ? itemEntry(plan, { id: `alchemist-${family.toLowerCase().replace(/\W+/g, "-")}`, name: `${doc.name} (Quick Alchemy)` }) : null;
        if (entry) spells.push({ ...entry, plan: { ...entry.plan, activation: { ...(entry.plan.activation ?? {}), time: String(Number(entry.plan.activation?.time ?? 1) + 1) } }, pool: "reagents", consumable: false, from: "Quick Alchemy" });
    }
    if (full) for (const item of described.filter((entry) => entry.kind === "save")) {
        const entry = saveEntry(item, numbers);
        if (entry) spells.push(entry);
    }
    const kit = { bombs: bombs.map((item) => ({ name: item.family, item: item.name, itemBonus: item.itemBonus, damage: item.damage, splash: item.splash, persistent: item.persistent })), spells };
    kits.set(key, kit);
    return kit;
}
