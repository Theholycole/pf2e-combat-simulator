// Live: the danger ratings made again in Foundry (2026-10-20, the user: "add a button in the settings for people to run the simulator again
// for the compendium danger numbers"). A settings menu opens a window with the numbers in use (the module's, or this world's own run), the
// fights for each creature and the compendiums to rate. Start runs the study's method (src/engine/danger-scale.js) in this browser, on the
// simulator's workers: first the ladder of moderate creatures, then every creature of the ticked compendiums against the standard party of
// its level. The result is kept in the world (a world setting), where the compendium windows and PF2e's Compendium Browser read it before
// the module's own file (scripts/danger.js). A creature is read as the simulator reads one in play (readActor); the party's spells come
// from the core's registry, its basic actions from the ability module, as the offline tool's do from the same compilers.

import { ABILITY_MODULE_ID, CORE_ID, MODULE_ID, effectModels, leanPlan, readActor, summonReserves } from "./snapshot.js";
import { parallelFights, runDangerFights } from "./runner.js";
import { SPELLBOOKS, standardParty } from "../src/engine/party.js";
import { moderateCreatureAt } from "../src/engine/creature-tables.js";
import { LADDER_FIGHTS_PER, LADDER_OFFSETS, LADDER_PARTIES, canFight, dangerProfile, mergeSummaries, partyLevelFor, rankRows, rateAlone, ratingsOf, scaleFromJSON, scaleOf, scaleToJSON } from "../src/engine/danger-scale.js";
import { canCast, isUtility } from "../src/engine/spells.js";
import { withReading } from "../src/engine/readings.js";
import { dangerRatingsInUse, shippedRatings } from "./danger.js";
import { dangerLabel, ratingOf, stampOf, withAlone } from "../src/live/danger.js";

export const WORLD_RATINGS = "dangerRatingsWorld";
// Creatures rated again on their own (the user, 2026-10-20: "add the option to simulate a single monster to update their danger rating"):
// { base: the stamp of the numbers they were rated on, entries: { "<compendium id>": { "<actor id>": { value, bound, generated, fights,
// name } } } }, laid over those numbers (src/live/danger.js withAlone).
export const ALONE_RATINGS = "dangerRatingsAlone";
const SPELL_MODULE_ID = "pf2e-automatic-resolution";
const SPELL_PACK = "pf2e.spells-srd";
const PARTY = ["fighter", "rogue", "wizard", "cleric"];
// Creatures read from a compendium this many at a time; ladder fights sent this many at a time.
const ID_CHUNK = 20;
const LADDER_CHUNK = 100;
// For the time it may take: fights a second for each worker, and seconds to read a creature (rough, from the offline runs).
const FIGHTS_PER_SECOND = 50;
const READ_SECONDS = 0.05;

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

// The run under way on this client, one at a time: { state: "running"|"done"|"stopped"|"failed", phase, done, total, creatures, read,
// started, ended, rated, message, stop }.
let current = null;
const windows = new Set();

// The last run on this client, its rows kept (ladder, screen): for a look from the console.
export const lastDangerRun = () => current;

// --- The world's numbers ------------------------------------------------------------

export function registerDangerRun() {
    game.settings.register(MODULE_ID, WORLD_RATINGS, {
        scope: "world",
        config: false,
        type: Object,
        default: {},
        onChange: () => {
            Hooks.callAll(`${MODULE_ID}.dangerRatingsChanged`);
            for (const app of windows) app.render();
        }
    });
    game.settings.register(MODULE_ID, ALONE_RATINGS, {
        scope: "world",
        config: false,
        type: Object,
        default: {},
        onChange: () => {
            Hooks.callAll(`${MODULE_ID}.dangerRatingsChanged`);
            for (const app of windows) app.render();
        }
    });
    // (A creature's own line in a compendium's right-click menu: rated again alone, on the numbers in use.)
    Hooks.on("getActorContextOptions", (app, options) => {
        if (!game.user.isGM || !(app instanceof foundry.applications.sidebar.apps.Compendium)) return;
        options.push({
            label: "Rate its danger again (Combat Simulator)",
            icon: "fa-solid fa-skull",
            visible: (li) => app.collection?.index?.get(li.dataset.entryId)?.type === "npc",
            onClick: (event, li) => rateCreatureAlone(app.collection.collection, li.dataset.entryId)
        });
    });
    game.settings.registerMenu(MODULE_ID, "dangerRunMenu", {
        name: "Danger ratings: run them again",
        label: "Run the simulator",
        hint: "Rate every creature in your compendiums again in this browser (the module's own numbers were made the same way), for a newer simulator, other bestiaries or your own creatures. The result is kept in this world.",
        icon: "fa-solid fa-skull",
        type: DangerRunApp,
        restricted: true
    });
}

// The creatures rated on their own (the setting's value), or null.
export function aloneRatings() {
    const value = game.settings.get(MODULE_ID, ALONE_RATINGS);
    return value?.entries && Object.keys(value.entries).length ? value : null;
}

// This world's own numbers, or null (the module's are used).
export function worldRatings() {
    const value = game.settings.get(MODULE_ID, WORLD_RATINGS);
    return value?.ratings && Object.keys(value.ratings).length ? value : null;
}

// --- The party ----------------------------------------------------------------------

// The standard party's spells, by name: PF2e's spells through the core's registry (the spell module's plans), as the offline tool resolves
// them (a plan the engine can cast, not a utility), with each rank's effect models ready — standardParty asks for them as it builds.
async function partySpells() {
    const registry = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api?.registry : null;
    const pack = game.packs.get(SPELL_PACK);
    if (!registry || !pack) return () => null;
    const names = new Set(Object.values(SPELLBOOKS).flatMap((book) => [...book.cantrips, ...Object.values(book.ranks).flat(), ...(book.font ? [book.font] : [])]).map((name) => name.toLowerCase()));
    const index = await pack.getIndex();
    const ids = index.filter((entry) => names.has(entry.name.toLowerCase())).map((entry) => entry._id);
    const documents = ids.length ? await pack.getDocuments({ _id__in: ids }) : [];
    const plans = new Map();
    for (const { item, result } of await registry.preparePlans(documents)) {
        const full = result?.plan ? withReading(result.plan) : null;
        const plan = full ? leanPlan(full) : null;
        plans.set(item.name.toLowerCase(), plan && canCast({ spellPools: {} }, { name: item.name, plan, castRank: 1, pool: null }) && !isUtility(full) ? plan : null);
    }
    const effects = new Map();
    for (const [name, plan] of plans) if (plan) for (let rank = 1; rank <= 10; rank++) effects.set(`${name}|${rank}`, await effectModels(plan, rank));
    return (name, castRank) => {
        const key = String(name).toLowerCase();
        const plan = plans.get(key);
        return plan ? { name, plan, effects: effects.get(`${key}|${castRank}`) ?? {} } : null;
    };
}

// (Read once a session: the full run and the creatures rated alone share them.)
let spellResolver = null;
const partySpellsOnce = () => (spellResolver ??= partySpells().catch((error) => {
    spellResolver = null;
    throw error;
}));

// The standard party of a level, its basic actions from the ability module.
async function partyBuilder() {
    const spell = await partySpellsOnce();
    const ability = game.modules.get(ABILITY_MODULE_ID);
    const basics = Object.values((ability?.active ? ability.api?.basicActions : null) ?? {}).filter(Boolean);
    const parties = new Map();
    return (level) => {
        const lv = partyLevelFor(level);
        if (!parties.has(lv)) parties.set(lv, standardParty(lv, { spell, basics }));
        return parties.get(lv);
    };
}

// --- The compendiums ----------------------------------------------------------------

let compendiumList = null;

// The Actor compendiums with PF2e creatures (not Starfinder's), each with its creatures: [{ collection, label, package, creatures: [{ id, name }] }].
async function creatureCompendiums() {
    if (compendiumList) return compendiumList;
    const list = [];
    for (const pack of game.packs) {
        if (pack.documentName !== "Actor" || (pack.metadata.system && pack.metadata.system !== "pf2e")) continue;
        let index;
        try {
            index = await pack.getIndex({ fields: ["type"] });
        } catch {
            continue;
        }
        const creatures = [...index].filter((entry) => entry.type === "npc").map((entry) => ({ id: entry._id, name: entry.name }));
        const name = pack.metadata.packageName ?? pack.metadata.package ?? "";
        // (Its module's title beside a module's compendium: several are just "Actors".)
        const source = pack.metadata.packageType === "module" ? game.modules.get(name)?.title ?? name : pack.metadata.packageType === "world" ? "this world" : null;
        if (creatures.length) list.push({ collection: pack.collection, label: pack.metadata.label ?? pack.collection, package: name, source, creatures });
    }
    // (PF2e's first, then each module's, by name.)
    compendiumList = list.sort((a, b) => (b.package === "pf2e") - (a.package === "pf2e") || a.package.localeCompare(b.package) || a.label.localeCompare(b.label));
    return compendiumList;
}

const ladderPoints = () => LADDER_PARTIES.flatMap((party) => LADDER_OFFSETS.filter((offset) => party + offset >= -1).map((offset) => ({ party, level: party + offset })));

// The time a run may take, in minutes.
function estimateMinutes(creatures, fights) {
    const total = ladderPoints().length * fights * LADDER_FIGHTS_PER + creatures * fights;
    return Math.max(1, Math.round((total / (FIGHTS_PER_SECOND * parallelFights()) + creatures * READ_SECONDS) / 60));
}

// --- The run ------------------------------------------------------------------------

async function buildCreature(actor) {
    const monster = await readActor(actor, { id: "monster", name: actor.name, fresh: true });
    monster.side = "foes";
    const reserves = monster.summons?.length ? await summonReserves(monster) : [];
    return { monster, reserves };
}

function changed() {
    for (const app of windows) app.showProgress();
}

async function startRun(collections, fights) {
    if (current?.state === "running") return;
    const run = (current = { state: "running", phase: "Getting ready", done: 0, total: 0, creatures: 0, read: 0, started: Date.now(), stop: false });
    for (const app of windows) app.render();
    try {
        const compendiums = (await creatureCompendiums()).filter((entry) => collections.includes(entry.collection));
        run.creatures = compendiums.reduce((sum, entry) => sum + entry.creatures.length, 0);
        const ladderFights = fights * LADDER_FIGHTS_PER;
        const points = ladderPoints();
        run.total = points.length * ladderFights + run.creatures * fights;
        run.phase = "Building the party";
        changed();
        const partyFor = await partyBuilder();
        // (Fights go out while the next creature is read: as many waiting as the workers can take, and as many again.)
        const limit = parallelFights() * 2;
        const inFlight = new Set();
        const submit = async (job) => {
            while (inFlight.size >= limit) await Promise.race(inFlight);
            const promise = job().finally(() => inFlight.delete(promise));
            inFlight.add(promise);
        };
        run.phase = "The yardsticks: moderate creatures against each party level";
        changed();
        const ladder = (run.ladder = []);
        for (const point of points) {
            for (let from = 1; from < 1 + ladderFights && !run.stop; from += LADDER_CHUNK) {
                const to = Math.min(1 + ladderFights, from + LADDER_CHUNK);
                await submit(async () => {
                    const { scores, ...summary } = await runDangerFights(partyFor(point.party), [moderateCreatureAt(point.level, "monster")], from, to);
                    ladder.push({ ...point, ...summary });
                    run.done += to - from;
                    changed();
                });
            }
        }
        run.phase = "The creatures";
        changed();
        const screen = (run.screen = []);
        for (const compendium of compendiums) {
            const pack = game.packs.get(compendium.collection);
            for (let start = 0; start < compendium.creatures.length && !run.stop; start += ID_CHUNK) {
                const documents = await pack.getDocuments({ _id__in: compendium.creatures.slice(start, start + ID_CHUNK).map((entry) => entry.id) });
                for (const actor of documents) {
                    if (run.stop) break;
                    const row = { key: actor.uuid, group: compendium.collection, collection: compendium.collection, id: actor.id, name: actor.name, publication: actor.system?.details?.publication?.title ?? null };
                    let built;
                    try {
                        built = await buildCreature(actor);
                    } catch (error) {
                        built = null;
                        row.error = `read: ${error.message}`;
                    }
                    run.read++;
                    if (!built || !canFight(built.monster)) {
                        screen.push(built ? { ...row, level: built.monster.level, skipped: true, reason: "nothing to fight with" } : row);
                        run.done += fights;
                        changed();
                        continue;
                    }
                    const party = partyFor(built.monster.level);
                    const foes = [built.monster, ...built.reserves];
                    const base = { ...row, level: built.monster.level, profile: dangerProfile(built.monster) };
                    await submit(async () => {
                        try {
                            const { scores, ...summary } = await runDangerFights(party, foes, 1, 1 + fights);
                            screen.push({ ...base, ...summary });
                        } catch (error) {
                            screen.push({ ...base, error: `fight: ${error.message}` });
                        }
                        run.done += fights;
                        changed();
                    });
                }
            }
        }
        await Promise.all(inFlight);
        if (run.stop) {
            run.state = "stopped";
            run.ended = Date.now();
            for (const app of windows) app.render();
            return;
        }
        run.phase = "Ranking";
        changed();
        const ranked = rankRows(screen, { screen, ladder });
        const { ratings, bounds } = ratingsOf(ranked, ladder);
        run.rated = Object.values(ratings).reduce((sum, pack) => sum + Object.keys(pack).length, 0);
        // (Its scale kept with it, for a creature rated again alone; those rated alone before are part of this run now.)
        const scale = scaleToJSON(scaleOf({ screen, ladder }));
        const stamp = new Date().toISOString();
        await game.settings.set(MODULE_ID, WORLD_RATINGS, { version: 1, source: "world", run: stamp, generated: stamp.slice(0, 10), fights, party: PARTY, compendiums: compendiums.length, creatures: run.rated, ratings, bounds, scale });
        if (aloneRatings()) await game.settings.set(MODULE_ID, ALONE_RATINGS, {});
        run.state = "done";
        run.ended = Date.now();
        const packs = Object.keys(ratings).length;
        ui.notifications.info(`Danger ratings: ${run.rated} creatures rated in ${packs} ${packs === 1 ? "compendium" : "compendiums"}, kept in this world.`);
    } catch (error) {
        console.error(`${MODULE_ID} | danger ratings run`, error);
        run.state = "failed";
        run.ended = Date.now();
        run.message = error.message;
        ui.notifications.error(`Danger ratings: the run stopped (${error.message}).`);
    }
    for (const app of windows) app.render();
}

// --- One creature alone --------------------------------------------------------------

let ratingAlone = false;

// One creature rated again on its own (its compendium id and actor id), on the numbers in use: as many fights as theirs (the same seeds a
// full run gives it), across the workers, placed on the scale kept with them; kept in the world over them.
export async function rateCreatureAlone(collection, id) {
    if (current?.state === "running") return ui.notifications.warn("Danger ratings: a run is under way; rate it once that's done.");
    if (ratingAlone) return ui.notifications.warn("Danger ratings: one creature is being rated already.");
    const base = worldRatings() ?? (await shippedRatings());
    const scale = scaleFromJSON(base?.scale);
    if (!scale) return ui.notifications.warn("Danger ratings: the numbers in use have no scale kept with them. Run the simulator for every creature first (the settings' Danger ratings button).");
    const actor = await game.packs.get(collection)?.getDocument(id);
    if (!actor || actor.type !== "npc") return;
    const fights = Number(base.fights) || 100;
    ratingAlone = true;
    ui.notifications.info(`Danger ratings: ${actor.name} fights the party ${fights} times…`);
    try {
        const partyFor = await partyBuilder();
        const { monster, reserves } = await buildCreature(actor);
        const row = { key: actor.uuid, group: collection, name: actor.name, level: monster.level, publication: actor.system?.details?.publication?.title ?? null };
        let rated = null;
        if (canFight(monster)) {
            const party = partyFor(monster.level);
            const foes = [monster, ...reserves];
            const size = Math.ceil(fights / parallelFights());
            const slices = [];
            for (let from = 1; from < 1 + fights; from += size) slices.push([from, Math.min(1 + fights, from + size)]);
            const summary = mergeSummaries(await Promise.all(slices.map(([from, to]) => runDangerFights(party, foes, from, to))));
            rated = rateAlone(scale, { ...row, ...summary, profile: dangerProfile(monster) });
        }
        const shown = await dangerRatingsInUse();
        const before = ratingOf(shown, collection, id);
        const kept = aloneRatings();
        const entries = kept?.base === stampOf(base) ? foundry.utils.deepClone(kept.entries) : {};
        (entries[collection] ??= {})[id] = { value: rated?.value ?? null, bound: rated?.bound ?? null, generated: new Date().toISOString().slice(0, 10), fights, name: actor.name };
        await game.settings.set(MODULE_ID, ALONE_RATINGS, { base: stampOf(base), entries });
        const was = before === null ? "none" : dangerLabel(before);
        if (rated) ui.notifications.info(`Danger ratings: ${actor.name} is ${dangerLabel(rated.value, rated.bound)} for its level (it was ${was}).`);
        else ui.notifications.warn(`Danger ratings: ${actor.name} gets no number (${canFight(monster) ? "a data slip or a joke creature" : "nothing to fight with"}; it was ${was}).`);
    } catch (error) {
        console.error(`${MODULE_ID} | danger rating of ${actor.name}`, error);
        ui.notifications.error(`Danger ratings: ${actor.name} couldn't be rated (${error.message}).`);
    } finally {
        ratingAlone = false;
    }
}

// --- The window ---------------------------------------------------------------------

const { ApplicationV2 } = foundry.applications.api;

const minutes = (ms) => {
    const total = Math.max(0, Math.round(ms / 60000));
    return total >= 60 ? `${Math.floor(total / 60)} h ${total % 60} min` : `${total} min`;
};

export class DangerRunApp extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
        id: "pf2e-combat-simulator-danger-{id}",
        classes: ["pf2e-combat-sim", "pcs-danger-run"],
        tag: "div",
        window: { title: "Combat Simulator: danger ratings", resizable: true, icon: "fa-solid fa-skull" },
        position: { width: 580, height: 720 },
        actions: {
            start: DangerRunApp.#onStart,
            stop: DangerRunApp.#onStop,
            useModule: DangerRunApp.#onUseModule,
            tickAll: DangerRunApp.#onTick,
            tickNone: DangerRunApp.#onTick,
            clearAlone: DangerRunApp.#onClearAlone
        }
    };

    // The choices kept between renders: fights, and the compendiums left unticked.
    fights = 100;
    unticked = new Set();

    async _renderHTML() {
        const world = worldRatings();
        const shipped = await shippedRatings();
        const count = (data) => Object.values(data?.ratings ?? {}).reduce((sum, pack) => sum + Object.keys(pack).length, 0);
        const inUse = world
            ? `<p><strong>In use: this world's own run</strong> of ${escapeHTML(world.generated)}, ${world.fights} fights a creature: ${count(world)} creatures in ${Object.keys(world.ratings).length} ${Object.keys(world.ratings).length === 1 ? "compendium" : "compendiums"}.</p>
               <div class="sim-buttons"><button type="button" data-action="useModule"${current?.state === "running" ? " disabled" : ""}><i class="fa-solid fa-rotate-left"></i> Use the module's numbers instead</button></div>`
            : `<p><strong>In use: the module's numbers</strong>${shipped ? ` of ${escapeHTML(shipped.generated)}, ${shipped.fights} fights a creature: ${count(shipped)} creatures (PF2e's bestiaries and Battlezoo's)` : ""}.</p>`;
        const missing = [
            game.modules.get(ABILITY_MODULE_ID)?.active ? null : "PF2e Automatic Ability Resolution isn't active: creatures and the party would fight without their abilities and basic actions.",
            game.modules.get(SPELL_MODULE_ID)?.active ? null : "PF2e Automatic Spell Resolution isn't active: no one would cast spells, the party's wizard and cleric included."
        ].filter(Boolean);
        const running = current?.state === "running";
        let body;
        if (running) {
            body = `<div class="pcs-run-progress"></div><div class="sim-buttons"><button type="button" data-action="stop"><i class="fa-solid fa-stop"></i> Stop</button></div>`;
        } else {
            const compendiums = await creatureCompendiums();
            const ticked = compendiums.filter((entry) => !this.unticked.has(entry.collection));
            const creatures = ticked.reduce((sum, entry) => sum + entry.creatures.length, 0);
            const last = current?.state === "done" ? `<p class="pcs-run-note">Done: ${current.rated} creatures rated in ${minutes(current.ended - current.started)}.</p>`
                : current?.state === "stopped" ? `<p class="pcs-run-note">Stopped; nothing was kept.</p>`
                : current?.state === "failed" ? `<p class="pcs-run-note">The last run stopped: ${escapeHTML(current.message)}</p>` : "";
            body = `${last}
                <label class="pcs-run-fights">Fights for each creature <input type="number" name="fights" min="10" max="400" step="10" value="${this.fights}"></label>
                <p class="pcs-run-note">The module's numbers use 100. Fewer are quicker and rougher. The yardstick creatures fight ${LADDER_FIGHTS_PER} times as many.</p>
                <div class="pcs-run-packs-head"><strong>Compendiums</strong> <span>${ticked.length} of ${compendiums.length}, ${creatures} creatures</span>
                    <button type="button" data-action="tickAll">All</button><button type="button" data-action="tickNone">None</button></div>
                <ul class="pcs-run-packs">${compendiums.map((entry) => `<li><label><input type="checkbox" name="pack" value="${escapeHTML(entry.collection)}"${this.unticked.has(entry.collection) ? "" : " checked"}> ${escapeHTML(entry.label)}${entry.source ? ` <em>${escapeHTML(entry.source)}</em>` : ""} <span>${entry.creatures.length}</span></label></li>`).join("")}</ul>
                <p class="pcs-run-note">Only the ticked compendiums get numbers. Each level's typical creature is the middle one of those rated, or a by-the-book creature where a level has fewer than five, so tick them all to compare with the module's numbers.</p>
                <p class="pcs-run-estimate">About ${minutes(estimateMinutes(creatures, this.fights) * 60000)} on this computer (${parallelFights()} at a time).</p>
                <div class="sim-buttons"><button type="button" data-action="start"${creatures ? "" : " disabled"}><i class="fa-solid fa-play"></i> Run the simulator</button></div>`;
        }
        const alone = aloneRatings();
        const aloneEntries = alone?.base === stampOf(world ?? shipped) ? Object.values(alone.entries).flatMap((entries) => Object.values(entries)) : [];
        const aloneLine = aloneEntries.length
            ? `<p>Rated again on their own: ${aloneEntries.slice(0, 8).map((entry) => `${escapeHTML(entry.name)} ${Number.isFinite(entry.value) ? dangerLabel(entry.value, entry.bound) : "(none)"}`).join(", ")}${aloneEntries.length > 8 ? `, and ${aloneEntries.length - 8} more` : ""}.</p>
               <div class="sim-buttons"><button type="button" data-action="clearAlone"${current?.state === "running" ? " disabled" : ""}><i class="fa-solid fa-eraser"></i> Back to their numbers from the run</button></div>`
            : "";
        const oneCreature = `<p class="pcs-run-note">One creature only (after a change to it, or to the simulator for it): right-click it in its compendium and choose <em>Rate its danger again</em>. It fights as many times as the numbers in use did and lands on their scale, in a few seconds.</p>`;
        return `<div class="pcs-danger-run-body">
            ${inUse}
            ${aloneLine}
            ${oneCreature}
            <p>A run rates each creature as the module's numbers were made: against a party of four at its level (fighter, rogue, wizard, cleric) to the end, then against moderate creatures of every level for the scale. It runs in this browser. Foundry stays usable, but slower, and the run stops if this tab closes or reloads. The result is kept in this world and replaces the module's numbers for everyone in it.</p>
            ${missing.map((line) => `<p class="pcs-run-warning"><i class="fa-solid fa-triangle-exclamation"></i> ${line}</p>`).join("")}
            ${body}
        </div>`;
    }

    _replaceHTML(result, content) {
        content.innerHTML = result;
        content.querySelector("input[name=fights]")?.addEventListener("change", (event) => {
            this.fights = Math.max(10, Math.min(400, Math.round(Number(event.currentTarget.value) || 100)));
            this.render();
        });
        for (const box of content.querySelectorAll("input[name=pack]")) {
            box.addEventListener("change", () => {
                if (box.checked) this.unticked.delete(box.value);
                else this.unticked.add(box.value);
                this.render();
            });
        }
        this.showProgress();
    }

    _onFirstRender(context, options) {
        super._onFirstRender?.(context, options);
        windows.add(this);
    }

    _onClose(options) {
        super._onClose?.(options);
        windows.delete(this);
    }

    // The progress line and bar, without drawing the window again.
    showProgress() {
        const box = this.element?.querySelector(".pcs-run-progress");
        if (!box || !current) return;
        const share = current.total ? current.done / current.total : 0;
        const elapsed = Date.now() - current.started;
        const left = share > 0.02 ? (elapsed / share) * (1 - share) : null;
        box.innerHTML = `<p><strong>${escapeHTML(current.phase)}</strong></p>
            <div class="pcs-run-bar"><div style="width:${(share * 100).toFixed(1)}%"></div></div>
            <p>${Math.round(share * 100)}% · ${current.read} of ${current.creatures} creatures read · ${minutes(elapsed)} so far${left !== null ? ` · about ${minutes(left)} left` : ""}</p>`;
    }

    static async #onStart() {
        const collections = [...this.element.querySelectorAll("input[name=pack]:checked")].map((box) => box.value);
        if (!collections.length) return;
        startRun(collections, this.fights);
    }

    static #onStop() {
        if (current?.state === "running") {
            current.stop = true;
            current.phase = "Stopping: the fights under way finish first";
            changed();
        }
    }

    static async #onUseModule() {
        const { DialogV2 } = foundry.applications.api;
        const confirmed = await DialogV2.confirm({
            window: { title: "Danger ratings" },
            content: "<p>Use the module's own numbers again? This world's run is deleted.</p>",
            rejectClose: false
        });
        if (!confirmed) return;
        await game.settings.set(MODULE_ID, WORLD_RATINGS, {});
        if (aloneRatings()) await game.settings.set(MODULE_ID, ALONE_RATINGS, {});
    }

    static async #onClearAlone() {
        await game.settings.set(MODULE_ID, ALONE_RATINGS, {});
    }

    static async #onTick(event, target) {
        const compendiums = await creatureCompendiums();
        this.unticked = target.dataset.action === "tickAll" ? new Set() : new Set(compendiums.map((entry) => entry.collection));
        this.render();
    }
}
