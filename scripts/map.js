// Map objectives on the scene (O1–O3): the area and the exit are scene
// Regions; each creature's distance to them is measured from its token, and
// in live play the active GM counts the rounds the party holds the area.

import { edgeFeet, heldRounds, nearestFeet, recordRound, squareFeet } from "../src/adapter/map.js";
import { MODULE_ID, readFlag, savedSetup, sideOf } from "./snapshot.js";

export const MAP_KINDS = new Set(["hold", "escort", "retrieve"]);

// The scene's Regions, for the setup's choices.
export const regionChoices = (scene) => (scene?.regions?.contents ?? []).map((region) => ({ id: region.id, name: region.name || region.id }));

// The grid squares a Region covers (centers inside it, as Foundry decides for a token).
export function regionSquares(scene, regionId) {
    const region = regionId ? scene?.regions?.get(regionId) : null;
    const grid = scene?.grid;
    if (!region || !grid || grid.isGridless) return null;
    const squares = [];
    const [i0, j0, i1, j1] = grid.getOffsetRange(region.bounds);
    for (let i = i0; i < i1; i++) {
        for (let j = j0; j < j1; j++) {
            const center = grid.getCenterPoint({ i, j });
            if (region.polygonTree.testPoint(center, 0.75)) squares.push({ i, j });
        }
    }
    return squares;
}

const tokenSquares = (token) => token?.getOccupiedGridSpaceOffsets?.() ?? [];

// Feet from a token to a Region's nearest square; a square grid uses PF2e's diagonals.
function feetTo(scene, token, squares) {
    if (!squares?.length || !token) return null;
    const grid = scene.grid;
    const gridFeet = grid.distance ?? 5;
    const feet = grid.isSquare ? squareFeet : (a, b) => Math.hypot(grid.getCenterPoint(a).x - grid.getCenterPoint(b).x, grid.getCenterPoint(a).y - grid.getCenterPoint(b).y) / grid.size * gridFeet;
    return nearestFeet(tokenSquares(token), squares, gridFeet, feet);
}

// Distances for a snapshot: { feet: Map(id → { area?, exit? }), areaToExit } from the
// objective's Regions; what a Region doesn't give stays to the typed Strides.
export function readMapFeet(scene, objective, placed) {
    const area = regionSquares(scene, objective.areaRegion);
    const exit = regionSquares(scene, objective.exitRegion);
    const feet = new Map();
    for (const { combatant, token } of placed) {
        const entry = {};
        const toArea = feetTo(scene, token, area);
        const toExit = feetTo(scene, token, exit);
        if (toArea !== null) entry.area = toArea;
        if (toExit !== null) entry.exit = toExit;
        if (Object.keys(entry).length) feet.set(combatant.id, entry);
    }
    let areaToExit = null;
    if (area?.length && exit?.length) areaToExit = scene.grid.isSquare ? nearestFeet(area, exit, scene.grid.distance ?? 5) : null;
    return { feet, areaToExit };
}

// Each combatant's place relative to some Regions: Map(id → { [region]: { to, edge } }):
// feet to the Region (0 inside), and from inside, feet to its nearest edge.
export function readRegionFeet(scene, regionIds, placed) {
    const result = new Map();
    const squaresOf = new Map(regionIds.map((id) => [id, regionSquares(scene, id)]));
    for (const { combatant, token } of placed) {
        const entry = {};
        for (const [id, squares] of squaresOf) {
            if (!squares?.length || !token) continue;
            const to = feetTo(scene, token, squares);
            if (to === null) continue;
            entry[id] = { to, edge: to > 0 ? 0 : edgeFeet(tokenSquares(token), squares, scene.grid.distance ?? 5) };
        }
        result.set(combatant.id, entry);
    }
    return result;
}

// From one Region to a map objective's area and exit: { area?, exit? } feet.
export function regionToRegions(scene, regionId, objective) {
    const from = regionSquares(scene, regionId);
    if (!from?.length || !scene.grid.isSquare) return null;
    const result = {};
    for (const [key, id] of [["area", objective.areaRegion], ["exit", objective.exitRegion]]) {
        const squares = regionSquares(scene, id);
        if (squares?.length) result[key] = nearestFeet(from, squares, scene.grid.distance ?? 5);
    }
    return Object.keys(result).length ? result : null;
}

// Rounds the party has held the area in this encounter (live play).
export const roundsHeld = (combat) => heldRounds(readFlag(combat, "mapProgress")?.rounds);

// Whether a combatant can hold the area: up, not defeated, not unconscious.
function able(combatant) {
    const actor = combatant.actor;
    if (!actor || combatant.isDefeated) return false;
    if ((actor.hitPoints?.value ?? actor.system?.attributes?.hp?.value ?? 1) <= 0) return false;
    return !actor.hasCondition?.("unconscious") && !actor.hasCondition?.("dying");
}

// At each new round the active GM counts who's in the area: the party with no foe there holds it.
async function trackRound(combat, changed) {
    if (changed.round === undefined || !game.user.isGM || !(game.users.activeGM?.isSelf ?? true)) return;
    const { setup, overrides } = savedSetup(combat);
    const objective = setup.objective;
    if (objective?.kind !== "hold" || !objective.areaRegion) return;
    const scene = combat.scene ?? canvas.scene;
    const squares = regionSquares(scene, objective.areaRegion);
    if (!squares?.length) return;
    const inside = new Set(squares.map((square) => `${square.i},${square.j}`));
    const count = { party: 0, foes: 0 };
    for (const combatant of combat.combatants) {
        const token = combatant.token;
        if (!token || !able(combatant)) continue;
        if (!tokenSquares(token).some((square) => inside.has(`${square.i},${square.j}`))) continue;
        count[sideOf(combatant, overrides)]++;
    }
    const before = readFlag(combat, "mapProgress")?.rounds ?? {};
    const rounds = recordRound(before, combat.round, count.party > 0 && count.foes === 0);
    if (JSON.stringify(rounds) === JSON.stringify(before)) return;
    // Foundry merges flag updates, so unset first or dropped rounds would survive.
    await combat.unsetFlag(MODULE_ID, "mapProgress");
    await combat.setFlag(MODULE_ID, "mapProgress", { rounds });
}

export function setUpMapTracking() {
    Hooks.on("updateCombat", (combat, changed) => {
        trackRound(combat, changed).catch((error) => console.error(`${MODULE_ID} | map objective tracking`, error));
    });
}
