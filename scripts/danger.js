// Live: each creature's danger for its level beside its name in Foundry's compendium windows (src/live/danger.js; the numbers in
// src/data/danger-ratings.json, from `node tools/deadliest.mjs <run> ratings`), and a button beside the search that sorts the list by it —
// the most dangerous for their level first, unrated ones after; pressed again, the compendium's own order. And in PF2e's Compendium Browser
// (its Bestiary tab): the number beside each creature's level, and "Danger for level" in its sort. A client setting turns it off.
// (A world that ran the simulator again — scripts/danger-run.js — has its own numbers, used before the module's file.)

import { MODULE_ID } from "./snapshot.js";
import { aloneRatings, worldRatings } from "./danger-run.js";
import { boundOf, dangerBand, dangerLabel, dangerOrder, dangerTooltip, ratingOf, ratingOfUuid, sortByDanger, withAlone } from "../src/live/danger.js";

const SETTING = "dangerRatings";
// The numbers in use (the world's or the module's), and the module's own file once read.
let data = null;
let shipped = null;
// The compendiums sorted by danger, this session.
const sorted = new Set();

// The module's own numbers (src/data/danger-ratings.json), or null.
export function shippedRatings() {
    shipped ??= fetch(`modules/${MODULE_ID}/src/data/danger-ratings.json`).then((response) => (response.ok ? response.json() : null)).catch(() => null);
    return shipped;
}

async function ratings() {
    data = withAlone(worldRatings() ?? (await shippedRatings()), aloneRatings());
    return data;
}

// The numbers shown now (the world's or the module's, with the creatures rated again on their own).
export const dangerRatingsInUse = () => ratings();

// When a creature was rated again on its own (a date, or null when the date's unknown), or undefined when it wasn't.
const aloneOn = (known, collection, id) => known?.aloneOn?.[collection]?.[id];
const aloneOnUuid = (known, uuid) => {
    const match = /^Compendium\.(.+)\.Actor\.([^.]+)$/.exec(String(uuid ?? ""));
    return match ? aloneOn(known, match[1], match[2]) : undefined;
};

const compendiumApps = () => [...(foundry.applications.instances?.values?.() ?? [])].filter((app) => app instanceof foundry.applications.sidebar.apps.Compendium);

export function registerDangerSetting() {
    game.settings.register(MODULE_ID, SETTING, {
        name: "Danger ratings in compendiums",
        hint: "Show each creature's danger for its level beside its name in compendium windows, with a button to sort by it: levels above (+) or below (−) a typical creature of its level, from the simulator's fights against a party of four at its level.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => {
            for (const app of compendiumApps()) app.render();
            syncBrowserOrder();
            const browser = game.pf2e?.compendiumBrowser;
            if (browser?.rendered) markBrowser(browser);
        }
    });
}

export function setUpDanger() {
    Hooks.on("renderCompendium", (app, element) => {
        if (!game.settings.get(MODULE_ID, SETTING)) return;
        mark(app, element instanceof HTMLElement ? element : element?.[0]).catch((error) => console.error(`${MODULE_ID} | danger ratings`, error));
    });
    // (PF2e makes its Compendium Browser at its own ready, before a module's.)
    Hooks.once("ready", () => setUpBrowser().catch((error) => console.error(`${MODULE_ID} | danger ratings in the Compendium Browser`, error)));
    // (The world's own numbers made, or given up for the module's: every window shows the ones in use.)
    Hooks.on(`${MODULE_ID}.dangerRatingsChanged`, () => {
        ratings().then(() => {
            for (const app of compendiumApps()) app.render();
            syncBrowserOrder();
            const browser = game.pf2e?.compendiumBrowser;
            if (browser?.rendered) markBrowser(browser);
        });
    });
}

// A creature's badge: its number, coloured by band, its words when hovered.
function badgeFor(value, bound, known, alone = undefined) {
    const badge = document.createElement("span");
    badge.className = `pcs-danger pcs-danger-${dangerBand(value)}`;
    badge.textContent = dangerLabel(value, bound);
    badge.dataset.tooltip = dangerTooltip(value, known, bound, { alone });
    badge.setAttribute("aria-label", badge.dataset.tooltip);
    return badge;
}

async function mark(app, root) {
    const pack = app.collection;
    if (!root || pack?.documentName !== "Actor") return;
    const known = await ratings();
    if (!known?.ratings?.[pack.collection]) return;
    const entries = [...root.querySelectorAll("li.directory-item.entry[data-entry-id]")];
    entries.forEach((item, index) => {
        if (item.dataset.pcsOrder === undefined) item.dataset.pcsOrder = String(index);
        item.querySelector(".pcs-danger")?.remove();
        const value = ratingOf(known, pack.collection, item.dataset.entryId);
        if (value === null) {
            delete item.dataset.pcsDanger;
            return;
        }
        item.dataset.pcsDanger = String(value);
        item.append(badgeFor(value, boundOf(known, pack.collection, item.dataset.entryId), known, aloneOn(known, pack.collection, item.dataset.entryId)));
    });
    const search = root.querySelector("search");
    let button = search?.querySelector(".pcs-danger-sort");
    if (search && !button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = "inline-control icon fa-solid fa-skull pcs-danger-sort";
        button.dataset.tooltip = "Sort by danger for their level (Combat Simulator)";
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

// Each list's entries (a folder's, or the compendium's own) by danger, or back in their first order; folders stay where they are.
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
// (A Svelte app: its Bestiary tab keeps entries { name, uuid, level, … } and draws a row for each of its sorted results, in order, with no id
// on the row — so a row is its result by place, checked by name. Its sort: the tab's filterData.order { by, direction, options }, read
// through tab.sortResult.)

const BROWSER_ORDER = "pcsDanger";
const watchedBrowsers = new WeakSet();

async function setUpBrowser() {
    const browser = game.pf2e?.compendiumBrowser;
    const tab = browser?.tabs?.bestiary;
    if (!tab || typeof tab.sortResult !== "function" || tab.pcsDanger) return;
    await ratings();
    tab.pcsDanger = true;
    const ownSort = tab.sortResult.bind(tab);
    tab.sortResult = function (result) {
        const order = this.filterData?.order;
        if (order?.by !== BROWSER_ORDER) return ownSort(result);
        const lang = game.i18n.lang;
        return sortByDanger(result, (entry) => ratingOfUuid(data, entry.uuid)?.value ?? null, { descending: order.direction === "desc", compare: (a, b) => a.localeCompare(b, lang) });
    };
    syncBrowserOrder();
    Hooks.on("renderCompendiumBrowser", (app) => watchBrowser(app));
    if (browser.rendered) watchBrowser(browser);
}

// "Danger for level" among the Bestiary tab's sorts while the setting is on (its filters now and those it resets to).
function syncBrowserOrder() {
    const tab = game.pf2e?.compendiumBrowser?.tabs?.bestiary;
    if (!tab?.pcsDanger) return;
    const on = game.settings.get(MODULE_ID, SETTING);
    for (const filters of [tab.filterData, tab.defaultFilterData]) {
        const order = filters?.order;
        if (!order?.options) continue;
        if (on) order.options[BROWSER_ORDER] ??= { label: "Danger for level", type: "numeric" };
        else {
            delete order.options[BROWSER_ORDER];
            if (order.by === BROWSER_ORDER) order.by = "level";
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

// Each Bestiary row's number, in its own column before the level; none on other tabs, or with the setting off.
function markBrowser(app) {
    const root = app?.element;
    if (!root) return;
    const on = data && game.settings.get(MODULE_ID, SETTING) && app.activeTabName === "bestiary";
    const results = on ? app.tabs?.bestiary?.results ?? [] : [];
    for (const list of root.querySelectorAll("ul.result-list")) {
        [...list.children].forEach((item, index) => {
            const entry = results[index];
            const name = item.querySelector(".result-link")?.textContent?.trim();
            const rating = entry && name === String(entry.name ?? "").trim() ? ratingOfUuid(data, entry.uuid) : null;
            const key = rating ? `${entry.uuid}|${rating.value}|${rating.bound ?? ""}|${aloneOnUuid(data, entry.uuid) ?? ""}` : "";
            if ((item.dataset.pcsBrowserDanger ?? "") === key) return;
            item.querySelector(":scope > .pcs-danger-cell")?.remove();
            if (!rating) {
                delete item.dataset.pcsBrowserDanger;
                return;
            }
            item.dataset.pcsBrowserDanger = key;
            const cell = document.createElement("div");
            cell.className = "pcs-danger-cell";
            cell.append(badgeFor(rating.value, rating.bound, data, aloneOnUuid(data, entry.uuid)));
            const level = item.querySelector(":scope > .level");
            if (level) level.before(cell);
            else item.append(cell);
        });
    }
}

