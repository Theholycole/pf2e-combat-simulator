// Live: each creature's danger for its level beside its name in Foundry's compendium windows (src/live/danger.js; the numbers in
// src/data/danger-ratings.json, from `node tools/deadliest.mjs <run> ratings`), and a button beside the search that sorts the list by it —
// the most dangerous for their level first, unrated ones after; pressed again, the compendium's own order. A client setting turns it off.

import { MODULE_ID } from "./snapshot.js";
import { boundOf, dangerBand, dangerLabel, dangerOrder, dangerTooltip, ratingOf } from "../src/live/danger.js";

const SETTING = "dangerRatings";
let data = null;
let loading = null;
// The compendiums sorted by danger, this session.
const sorted = new Set();

async function ratings() {
    if (data) return data;
    loading ??= fetch(`modules/${MODULE_ID}/src/data/danger-ratings.json`).then((response) => (response.ok ? response.json() : null)).catch(() => null);
    data = await loading;
    return data;
}

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
        }
    });
}

export function setUpDanger() {
    Hooks.on("renderCompendium", (app, element) => {
        if (!game.settings.get(MODULE_ID, SETTING)) return;
        mark(app, element instanceof HTMLElement ? element : element?.[0]).catch((error) => console.error(`${MODULE_ID} | danger ratings`, error));
    });
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
        const badge = document.createElement("span");
        badge.className = `pcs-danger pcs-danger-${dangerBand(value)}`;
        const bound = boundOf(known, pack.collection, item.dataset.entryId);
        badge.textContent = dangerLabel(value, bound);
        badge.dataset.tooltip = dangerTooltip(value, known, bound);
        badge.setAttribute("aria-label", badge.dataset.tooltip);
        item.append(badge);
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
