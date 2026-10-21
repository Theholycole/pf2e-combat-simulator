// Live: each creature's danger for its level beside its name in Foundry's compendium windows (src/live/danger.js; the numbers in
// src/data/danger-ratings.json, from `node tools/deadliest.mjs <run> ratings`), and a button beside the search that sorts the list by it —
// the most dangerous for their level first, unrated ones after; pressed again, the compendium's own order. And in PF2e's Compendium Browser
// (its Bestiary tab): the number beside each creature's level, and "Danger for level" in its sort. A client setting turns it off.
// (A world that ran the simulator again — scripts/danger-run.js — has its own numbers, used before the module's file.)
// Spells the same way (2026-10-21, the user: "rate spells and give them a score just like creatures"): each spell's power for its rank
// (src/data/spell-ratings.json, from `node tools/spell-power.mjs <run> ratings`) beside its name, a button to sort by it, and the
// Compendium Browser's Spells tab; a setting of their own.

import { MODULE_ID } from "./snapshot.js";
import { aloneRatings, worldRatings } from "./danger-run.js";
import { boundOf, dangerBand, dangerLabel, dangerOrder, dangerTooltip, powerDetailOf, powerLabel, powerTooltip, ratingOf, ratingOfUuid, sortByDanger, withAlone, withRuleChoices } from "../src/live/danger.js";

const SETTING = "dangerRatings";
const SPELL_SETTING = "spellPower";
// The GM's choices of rules the rules leave open, for the spell numbers (power-readings.js RULE_CHOICES; the user, 2026-10-21: "put a
// toggle in the settings for the gm to determine how it calculates healing done" — Moment of Renewal's).
const RULE_SETTINGS = { renewalHealing: "renewalHealing" };
const ruleChoices = () => Object.fromEntries(Object.entries(RULE_SETTINGS).map(([rule, setting]) => [rule, game.settings.get(MODULE_ID, setting)]));
// The numbers in use for each kind (creatures: the world's or the module's; spells: the module's), and the module's files once read.
const numbers = { creatures: null, spells: null };
const files = {};
// The compendiums sorted by their numbers, this session.
const sorted = new Set();

const fetchJSON = (name) => (files[name] ??= fetch(`modules/${MODULE_ID}/src/data/${name}`).then((response) => (response.ok ? response.json() : null)).catch(() => null));

// The module's own creature numbers (src/data/danger-ratings.json), or null.
export const shippedRatings = () => fetchJSON("danger-ratings.json");

// What each kind is: its documents, its setting, its numbers, its badge and its place in PF2e's Compendium Browser.
const KINDS = {
    creatures: {
        documentName: "Actor", type: "npc", setting: SETTING, tab: "bestiary", order: "pcsDanger", orderLabel: "Danger for level", ownOrder: "level",
        sortIcon: "fa-skull", sortTip: "Sort by danger for their level (Combat Simulator)",
        load: async () => withAlone(worldRatings() ?? (await shippedRatings()), aloneRatings()),
        badge: (value, bound, known, collection, id) => ({ className: "", label: dangerLabel(value, bound), tooltip: dangerTooltip(value, known, bound, { alone: known?.aloneOn?.[collection]?.[id] }) })
    },
    spells: {
        documentName: "Item", type: "spell", setting: SPELL_SETTING, tab: "spell", order: "pcsPower", orderLabel: "Power for rank", ownOrder: "rank",
        sortIcon: "fa-wand-sparkles", sortTip: "Sort by power for their rank (Combat Simulator)",
        load: () => fetchJSON("spell-ratings.json").then((data) => withRuleChoices(data, ruleChoices())),
        badge: (value, bound, known, collection, id) => ({ className: "pcs-power", label: powerLabel(value, bound, powerDetailOf(known, collection, id)), tooltip: powerTooltip(value, known, bound, powerDetailOf(known, collection, id)) })
    }
};
const kindOfDocument = (documentName) => Object.values(KINDS).find((kind) => kind.documentName === documentName) ?? null;
const kindOfTab = (tabName) => Object.values(KINDS).find((kind) => kind.tab === tabName) ?? null;
const keyOf = (kind) => Object.keys(KINDS).find((key) => KINDS[key] === kind);
const shown = (kind) => game.settings.get(MODULE_ID, kind.setting);

async function load(kind) {
    numbers[keyOf(kind)] = await kind.load();
    return numbers[keyOf(kind)];
}

// The creature numbers shown now (the world's or the module's, with the creatures rated again on their own).
export const dangerRatingsInUse = () => load(KINDS.creatures);

const compendiumApps = () => [...(foundry.applications.instances?.values?.() ?? [])].filter((app) => app instanceof foundry.applications.sidebar.apps.Compendium);

function refreshAll() {
    for (const app of compendiumApps()) app.render();
    syncBrowserOrders();
    const browser = game.pf2e?.compendiumBrowser;
    if (browser?.rendered) markBrowser(browser);
}

export function registerDangerSetting() {
    game.settings.register(MODULE_ID, SETTING, {
        name: "Danger ratings in compendiums",
        hint: "Show each creature's danger for its level beside its name in compendium windows, with a button to sort by it: levels above (+) or below (−) a typical creature of its level, from the simulator's fights against a party of four at its level.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: refreshAll
    });
    game.settings.register(MODULE_ID, RULE_SETTINGS.renewalHealing, {
        name: "Moment of Renewal's healing",
        hint: "How the spell power numbers count Moment of Renewal's \"as if they had taken 24 hours of rest\": one rest's Hit Points (Constitution modifier × level), or a day of long-term rest's (twice that).",
        scope: "world",
        config: true,
        type: String,
        choices: { rest: "One rest (Constitution modifier × level)", day: "A day of long-term rest (twice that)" },
        default: "rest",
        onChange: () => load(KINDS.spells).then(refreshAll)
    });
    game.settings.register(MODULE_ID, SPELL_SETTING, {
        name: "Spell power in compendiums",
        hint: "Show each spell's power for its rank beside its name in compendium windows and PF2e's Compendium Browser, with a button to sort by it: levels above (+) or below (−) a typical spell of its rank, from the simulator's fights with one cast in a party's hands.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: refreshAll
    });
}

export function setUpDanger() {
    Hooks.on("renderCompendium", (app, element) => {
        const kind = kindOfDocument(app.collection?.documentName);
        if (!kind || !shown(kind)) return;
        mark(app, element instanceof HTMLElement ? element : element?.[0], kind).catch((error) => console.error(`${MODULE_ID} | ${keyOf(kind)} numbers`, error));
    });
    // (PF2e makes its Compendium Browser at its own ready, before a module's.)
    Hooks.once("ready", () => setUpBrowser().catch((error) => console.error(`${MODULE_ID} | numbers in the Compendium Browser`, error)));
    // (The world's own numbers made, or given up for the module's: every window shows the ones in use.)
    Hooks.on(`${MODULE_ID}.dangerRatingsChanged`, () => load(KINDS.creatures).then(refreshAll));
}

// A badge: its number, coloured by band, its words when hovered.
function badgeFor(kind, value, bound, known, collection, id) {
    const made = kind.badge(value, bound, known, collection, id);
    const badge = document.createElement("span");
    badge.className = `pcs-danger pcs-danger-${dangerBand(value)}${made.className ? ` ${made.className}` : ""}`;
    badge.textContent = made.label;
    badge.dataset.tooltip = made.tooltip;
    badge.setAttribute("aria-label", made.tooltip);
    return badge;
}

async function mark(app, root, kind) {
    const pack = app.collection;
    if (!root || !pack) return;
    const known = await load(kind);
    if (!known?.ratings?.[pack.collection]) return;
    const entries = [...root.querySelectorAll("li.directory-item.entry[data-entry-id]")];
    entries.forEach((item, index) => {
        if (item.dataset.pcsOrder === undefined) item.dataset.pcsOrder = String(index);
        item.querySelector(".pcs-danger")?.remove();
        const id = item.dataset.entryId;
        // (A compendium of items of every kind: its spells only.)
        const value = pack.index?.get?.(id)?.type && pack.index.get(id).type !== kind.type ? null : ratingOf(known, pack.collection, id);
        if (value === null) {
            delete item.dataset.pcsDanger;
            return;
        }
        item.dataset.pcsDanger = String(value);
        item.append(badgeFor(kind, value, boundOf(known, pack.collection, id), known, pack.collection, id));
    });
    const search = root.querySelector("search");
    let button = search?.querySelector(".pcs-danger-sort");
    if (search && !button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = `inline-control icon fa-solid ${kind.sortIcon} pcs-danger-sort`;
        button.dataset.tooltip = kind.sortTip;
        button.setAttribute("aria-label", button.dataset.tooltip);
        button.addEventListener("click", () => {
            if (sorted.has(pack.collection)) sorted.delete(pack.collection);
            else sorted.add(pack.collection);
            button.classList.toggle("active", sorted.has(pack.collection));
            order(root, pack.collection);
        });
        const collapse = search.querySelector(".collapse-all");
        if (collapse) collapse.before(button);
        else search.append(button);
    }
    button?.classList.toggle("active", sorted.has(pack.collection));
    order(root, pack.collection);
}

// Each list's entries (a folder's, or the compendium's own) by their numbers, or back in their first order; folders stay where they are.
function order(root, collection) {
    const on = sorted.has(collection);
    const lists = new Set([...root.querySelectorAll("li.directory-item.entry[data-entry-id]")].map((item) => item.parentElement));
    for (const list of lists) {
        const entries = [...list.children].filter((child) => child.matches("li.directory-item.entry")).map((item) => ({ item, value: item.dataset.pcsDanger === undefined ? null : Number(item.dataset.pcsDanger), order: Number(item.dataset.pcsOrder) || 0 }));
        const next = on ? dangerOrder(entries) : [...entries].sort((a, b) => a.order - b.order);
        for (const { item } of next) list.append(item);
    }
}

// --- PF2e's Compendium Browser ------------------------------------------------------
// (A Svelte app: its Bestiary and Spells tabs keep entries { name, uuid, level or rank, … } and draw a row for each of their sorted results,
// in order, with no id on the row — so a row is its result by place, checked by name. A tab's sort: its filterData.order { by, direction,
// options }, read through tab.sortResult.)

const watchedBrowsers = new WeakSet();

async function setUpBrowser() {
    const browser = game.pf2e?.compendiumBrowser;
    if (!browser?.tabs) return;
    for (const kind of Object.values(KINDS)) {
        const tab = browser.tabs[kind.tab];
        if (!tab || typeof tab.sortResult !== "function" || tab[kind.order]) continue;
        await load(kind);
        tab[kind.order] = true;
        const ownSort = tab.sortResult.bind(tab);
        tab.sortResult = function (result) {
            const order = this.filterData?.order;
            if (order?.by !== kind.order) return ownSort(result);
            const lang = game.i18n.lang;
            const known = numbers[keyOf(kind)];
            return sortByDanger(result, (entry) => ratingOfUuid(known, entry.uuid)?.value ?? null, { descending: order.direction === "desc", compare: (a, b) => a.localeCompare(b, lang) });
        };
    }
    syncBrowserOrders();
    Hooks.on("renderCompendiumBrowser", (app) => watchBrowser(app));
    if (browser.rendered) watchBrowser(browser);
}

// Each kind's sort among its tab's while its setting is on (the tab's filters now and those it resets to).
function syncBrowserOrders() {
    for (const kind of Object.values(KINDS)) {
        const tab = game.pf2e?.compendiumBrowser?.tabs?.[kind.tab];
        if (!tab?.[kind.order]) continue;
        const on = shown(kind);
        for (const filters of [tab.filterData, tab.defaultFilterData]) {
            const order = filters?.order;
            if (!order?.options) continue;
            if (on) order.options[kind.order] ??= { label: kind.orderLabel, type: "numeric" };
            else {
                delete order.options[kind.order];
                if (order.by === kind.order) order.by = kind.ownOrder;
            }
        }
    }
}

// Marks its rows as they're drawn (a new tab, a search, a sort, more rows on scrolling): once for each batch of Svelte's changes (an
// observer's callback comes after them), not watching its own. (Not a frame later: a hidden window draws no frames.)
function watchBrowser(app) {
    const root = app?.element;
    if (!root) return;
    if (watchedBrowsers.has(root)) return markBrowser(app);
    watchedBrowsers.add(root);
    const observer = new MutationObserver(() => {
        observer.disconnect();
        try {
            markBrowser(app);
        } finally {
            observer.observe(root, { childList: true, subtree: true });
        }
    });
    observer.observe(root, { childList: true, subtree: true });
    markBrowser(app);
}

// Each row's number on the Bestiary and Spells tabs, in its own column before the level (or rank); none on other tabs, or with the setting off.
function markBrowser(app) {
    const root = app?.element;
    if (!root) return;
    const kind = kindOfTab(app.activeTabName);
    const known = kind ? numbers[keyOf(kind)] : null;
    const on = known && shown(kind);
    const results = on ? app.tabs?.[kind.tab]?.results ?? [] : [];
    for (const list of root.querySelectorAll("ul.result-list")) {
        [...list.children].forEach((item, index) => {
            const entry = results[index];
            const name = item.querySelector(".result-link")?.textContent?.trim();
            const rating = entry && name === String(entry.name ?? "").trim() ? ratingOfUuid(known, entry.uuid) : null;
            const match = rating ? /^Compendium\.(.+)\.(?:Actor|Item)\.([^.]+)$/.exec(entry.uuid) : null;
            const [collection, id] = match ? [match[1], match[2]] : [null, null];
            const key = rating ? `${entry.uuid}|${rating.value}|${rating.bound ?? ""}|${known?.aloneOn?.[collection]?.[id] ?? ""}` : "";
            if ((item.dataset.pcsBrowserDanger ?? "") === key) return;
            item.querySelector(":scope > .pcs-danger-cell")?.remove();
            if (!rating) {
                delete item.dataset.pcsBrowserDanger;
                return;
            }
            item.dataset.pcsBrowserDanger = key;
            const cell = document.createElement("div");
            cell.className = "pcs-danger-cell";
            cell.append(badgeFor(kind, rating.value, rating.bound, known, collection, id));
            const level = item.querySelector(":scope > .level");
            if (level) level.before(cell);
            else item.append(cell);
        });
    }
}
