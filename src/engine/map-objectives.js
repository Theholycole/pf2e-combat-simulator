// Map-based objectives (O1–O3): hold an area, escort a creature to the exit,
// retrieve an item and escape.
//
// Fights stay on range bands. Each creature also keeps its distance in feet to
// the area and to the exit (read from scene Regions, or typed as Strides). A
// Stride toward one of them brings it a Speed closer; its distance to the
// other follows from the triangle the three distances make (Stewart's theorem).
// Engaging a creature moves you to where it is.

import { DEAD, DOWN, canAct, canMove, isActive } from "./combatant.js";
import { mapGap, stridesToEngage } from "./space.js";
import { log } from "./log.js";

export const MAP_KINDS = new Set(["hold", "escort", "retrieve"]);
export const isMapObjective = (objective) => MAP_KINDS.has(objective?.kind);

// Feet in one typed Stride, for the distance from the area to the exit.
const TYPED_STRIDE = 25;
// Typed Strides when nothing else is given.
const DEFAULT_STRIDES = Object.freeze({ party: { area: 1, exit: 2 }, foes: { area: 1, exit: 2 } });

// Strides a creature needs to cover some feet.
export const stridesFor = (c, feet) => (feet > 0 ? Math.ceil(feet / Math.max(5, c.speed ?? 25)) : 0);

// The objective's own state, from its definition (see createObjective).
export function createMapObjective(objective, definition) {
    objective.areaToExit = definition.areaToExit ?? (definition.strides?.areaToExit ?? 2) * TYPED_STRIDE;
    objective.deadline = definition.deadline ?? null;
    if (definition.kind === "hold") {
        objective.needed = definition.needed ?? 3;
        // Rounds already held (live play tracks them at each new round).
        objective.held = definition.held ?? 0;
    }
    if (definition.kind === "retrieve") {
        objective.item = { carrierId: definition.carrierId ?? null, dropped: false, area: 0, exit: objective.areaToExit, band: "near", meleeId: null, at: new Set() };
    }
}

// Each creature's distances: read from the scene (mapFeet), or the side's typed Strides.
export function placeOnMap(state) {
    const objective = state.objective;
    if (!isMapObjective(objective)) return;
    const typed = state.setup.objective?.strides ?? {};
    for (const c of state.list) {
        const strides = { ...DEFAULT_STRIDES[c.side] ?? DEFAULT_STRIDES.foes, ...(typed[c.side] ?? {}) };
        const speed = Math.max(5, c.speed ?? 25);
        c.areaFeet = c.mapFeet?.area ?? strides.area * speed;
        c.exitFeet = c.mapFeet?.exit ?? strides.exit * speed;
    }
    if (objective.kind === "escort") {
        const escort = state.byId.get(objective.escortId);
        // It moves itself, whether or not it would act in a fight.
        if (escort) escort.acts = true;
    }
    if (objective.kind === "retrieve" && objective.item.carrierId) {
        const carrier = state.byId.get(objective.item.carrierId);
        if (carrier && isActive(carrier)) takeItem(objective, carrier);
        else objective.item.carrierId = null;
    }
}

// A Stride's new distances: `where` ("area" or "exit") a Speed closer, the other from the triangle.
export function strideToward(distances, where, speed, areaToExit) {
    const [toward, other] = where === "area" ? [distances.area, distances.exit] : [distances.exit, distances.area];
    if (toward <= 0) return distances;
    const t = Math.min(1, speed / toward);
    const closer = Math.max(0, toward - speed);
    const rest = Math.sqrt(Math.max(0, (1 - t) * other ** 2 + t * areaToExit ** 2 - t * (1 - t) * toward ** 2));
    return where === "area" ? { area: closer, exit: rest } : { area: rest, exit: closer };
}

export function moveToward(state, c, where) {
    const moved = strideToward({ area: c.areaFeet, exit: c.exitFeet }, where, Math.max(5, c.speed ?? 25), state.objective.areaToExit);
    c.areaFeet = moved.area;
    c.exitFeet = moved.exit;
    const left = stridesFor(c, where === "area" ? c.areaFeet : c.exitFeet);
    log(state, `  ${c.name} Strides toward the ${where}${left ? ` (${left} more)` : where === "area" ? " and is inside" : " and reaches it"}`);
}

// A Stride toward a creature too far away to engage this turn: a Speed closer
// to it, and its distances to the area and the exit from the triangles.
export function approachPlace(place, toward, speed) {
    const gap = Math.max(place.area === undefined ? 0 : Math.abs(place.area - toward.area), Math.abs(place.exit - toward.exit));
    if (gap <= 0) return place;
    const t = Math.min(1, speed / gap);
    const along = (from, to) => Math.sqrt(Math.max(0, (1 - t) * from ** 2 + t * to ** 2 - t * (1 - t) * gap ** 2));
    return { area: along(place.area, toward.area), exit: along(place.exit, toward.exit) };
}

export function approach(state, c, target) {
    const moved = approachPlace({ area: c.areaFeet, exit: c.exitFeet }, { area: target.areaFeet, exit: target.exitFeet }, Math.max(5, c.speed ?? 25));
    c.areaFeet = moved.area;
    c.exitFeet = moved.exit;
    log(state, `  ${c.name} Strides toward ${target.name} (${Math.round(mapGap(c, target))} feet away)`);
}

// Engaging a creature, or reaching a dropped item: you're where it is.
export function moveTo(c, place) {
    if (place?.areaFeet === undefined && place?.area === undefined) return;
    c.areaFeet = place.areaFeet ?? place.area;
    c.exitFeet = place.exitFeet ?? place.exit;
}

export const inArea = (c) => c.areaFeet !== undefined && c.areaFeet <= 0;

// Who's in the area and able to act there.
export function areaCount(state) {
    const count = { party: 0, foes: 0 };
    for (const c of state.list) if (c.kind !== "object" && canAct(c) && !c.swallowedBy && inArea(c)) count[c.side]++;
    return count;
}

// The item: lying in the area, dropped where a carrier fell, or carried.
export function atItem(state, c) {
    const item = state.objective?.item;
    if (!item || item.carrierId) return false;
    return item.dropped ? item.at.has(c.id) : inArea(c);
}

// Strides from a band (and a place on the map) to a dropped item, as to a creature there.
export const stridesToItem = (item, band, speed, place = null) => stridesToEngage({ band, meleeId: null, speed, areaFeet: place?.area, exitFeet: place?.exit }, { band: item.band, meleeId: null, areaFeet: item.area, exitFeet: item.exit });

export function canCarry(state, c) {
    return state.objective?.kind === "retrieve" && c.side === "party" && c.kind === "pc" && canAct(c) && !c.cond.restrained;
}

function takeItem(objective, c) {
    const item = objective.item;
    item.carrierId = c.id;
    item.dropped = false;
    item.at = new Set();
    c.carrying = true;
    // A hand for the item: a two-handed weapon or a shield is let go (O3). (Not the Shield spell's: no hand.)
    if (c.shield && !c.shield.spell) c.shield.raised = false;
}

// Interact (1 action, manipulate): it provokes, and a critical hit disrupts it.
export function pickUpItem(state, c, provoke) {
    const objective = state.objective;
    if (!atItem(state, c)) return;
    if (provoke(state, c, "manipulate")) {
        log(state, `  ${c.name}'s attempt to pick up the item is disrupted`);
        return;
    }
    if (!canAct(c)) return;
    const item = objective.item;
    if (item.dropped) moveTo(c, item);
    takeItem(objective, c);
    log(state, `  ${c.name} picks up the item`);
}

// The carrier went down (or out of reach): the item drops where it fell.
function dropItem(state, carrier) {
    const item = state.objective.item;
    carrier.carrying = false;
    item.carrierId = null;
    item.dropped = true;
    item.area = carrier.areaFeet;
    item.exit = carrier.exitFeet;
    item.band = carrier.band === "far" ? "far" : "near";
    item.meleeId = carrier.lastMeleeId ?? null;
    item.at = new Set(state.list.filter((other) => other.side === "party" && isActive(other) && item.meleeId !== null && other.meleeId === item.meleeId).map((other) => other.id));
    log(state, `  ${carrier.name} drops the item`);
}

// Moving off: no longer at a dropped item.
export function leftItem(state, c) {
    state.objective?.item?.at?.delete(c.id);
}

export function reachItem(state, c) {
    const item = state.objective.item;
    moveTo(c, item);
    item.at.add(c.id);
    log(state, `  ${c.name} Strides to the dropped item`);
}

// Re-evaluates a map objective after anything that might settle it.
export function updateMapObjective(state) {
    const objective = state.objective;
    if (objective.kind === "escort") {
        const escort = state.byId.get(objective.escortId);
        if (!escort || escort.status === DEAD || escort.status === DOWN || !isActive(escort) && !escort.swallowedBy) objective.status = "failed";
        else if (escort.exitFeet <= 0) objective.status = "success";
    } else if (objective.kind === "retrieve") {
        const carrier = objective.item.carrierId ? state.byId.get(objective.item.carrierId) : null;
        if (carrier && !isActive(carrier)) dropItem(state, carrier);
        else if (carrier && carrier.exitFeet <= 0) objective.status = "success";
    }
}

// The end of a round: a held round, and the deadline.
export function endOfRoundMap(state) {
    const objective = state.objective;
    if (objective.kind === "hold") {
        const count = areaCount(state);
        if (count.party > 0 && count.foes === 0) {
            objective.held++;
            log(state, `  The party holds the area (${objective.held}/${objective.needed})`);
        } else if (count.foes > 0 && count.party > 0) log(state, "  The area is contested");
        if (objective.held >= objective.needed) objective.status = "success";
    }
    if (objective.status === "open" && objective.deadline && state.round >= objective.deadline) objective.status = "failed";
}

// After a won fight: the party finishes it unopposed, unless the deadline comes first.
// Moving takes whole turns of 3 actions, starting next round.
export function settleMapAfterWin(state) {
    const objective = state.objective;
    const movers = state.list.filter((c) => c.side === "party" && c.kind !== "object" && canAct(c) && canMove(c));
    const turns = (actions) => Math.ceil(actions / 3);
    let finishRound = null;
    if (objective.kind === "hold") {
        const strides = movers.length ? Math.min(...movers.map((c) => stridesFor(c, c.areaFeet))) : null;
        // Inside already: this round counts.
        if (strides !== null) finishRound = state.round + (strides ? turns(strides) : 0) + Math.max(0, objective.needed - objective.held) - 1;
    } else if (objective.kind === "escort") {
        const escort = state.byId.get(objective.escortId);
        if (escort && isActive(escort)) finishRound = state.round + turns(stridesFor(escort, escort.exitFeet));
    } else if (objective.kind === "retrieve") {
        const item = objective.item;
        const carrier = item.carrierId ? state.byId.get(item.carrierId) : null;
        if (carrier && isActive(carrier)) finishRound = state.round + turns(stridesFor(carrier, carrier.exitFeet));
        else {
            const options = movers.filter((c) => c.kind === "pc").map((c) => {
                const reach = atItem(state, c) ? 0 : item.dropped ? stridesToItem(item, c.band, c.speed, { area: c.areaFeet, exit: c.exitFeet }) : stridesFor(c, c.areaFeet);
                return reach + 1 + stridesFor(c, item.dropped ? item.exit : objective.areaToExit);
            });
            if (options.length) finishRound = state.round + turns(Math.min(...options));
        }
    }
    if (finishRound === null || (objective.deadline && finishRound > objective.deadline)) objective.status = "failed";
    else objective.status = "success";
    if (objective.kind === "hold" && objective.status === "success") objective.held = objective.needed;
}

// The outcome when the objective's success ends the fight.
export const mapOutcome = (objective) => (objective.kind === "hold" ? "held" : "escaped");
