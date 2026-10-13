// The fight's light, weather and ground, and what creatures make of them (L1–L5, 2026-10-13; the user's call: "build everything you
// brought up", tier 3). Setup: { light: "bright" | "dim" | "dark", sunlight, weather: "fog" | "snow" | "rain", difficult: the natural
// difficult terrain ("plants", "swamp", "snow", "ice", "water", "rubble", "sand"), terrain: ["underwater", "underground" …], climate:
// "severe-cold" | "extreme-cold" | "severe-heat" | "extreme-heat" }.
//   L1 Seeing: in darkness a creature without darkvision finds its target hidden (DC 11) and is off-guard to it; in dim light one without
//      low-light vision or darkvision finds it concealed (DC 5; Shadow Blending's DC 7); fog, rain and falling snow conceal (Snow Vision
//      ignores snow's).
//   L2 Light Blindness (blinded through its first turn in bright light, dazzled while in it) and sunlight (Sunlight Powerlessness, a
//      cavern troll's or a vampire's slowing: worse each turn it ends in sunlight, petrified or destroyed when it can no longer act).
//   L3 Natural difficult terrain halves the Speed of a creature without the stride for it (Woodland Stride, Swamp Stride, Ice Stride).
//   L4 Hidden Movement: starting its turn hidden from a creature, that creature is off-guard to its attacks that turn.
//   L5 Covens: a coven spell needs two other members of its coven on the field beside it; one a round for the coven, and each helper gives
//      an action of its next turn.
// The fight's roll options (lighting, terrain, climate) are the creatures' own predicates' (abilities.js's selfOptions).

import { isActive } from "./combatant.js";

const log = (state, line) => state.log?.push(line);
const LIGHT_OPTIONS = { bright: "lighting:bright-light", dim: "lighting:dim-light", dark: "lighting:darkness" };

export function buildEnvironment(setup = {}) {
    const light = LIGHT_OPTIONS[setup.light] ? setup.light : "bright";
    const sunlight = Boolean(setup.sunlight) && light === "bright";
    const terrain = [...new Set((setup.terrain ?? []).map((entry) => String(entry).trim().toLowerCase()).filter(Boolean))];
    const options = new Set([LIGHT_OPTIONS[light], ...(sunlight ? ["lighting:sunlight"] : []), ...terrain.map((entry) => `terrain:${entry}`), ...(setup.climate ? [`environment:${setup.climate}`] : [])]);
    return { light, sunlight, terrain, difficult: setup.difficult || null, weather: setup.weather || null, climate: setup.climate || null, options };
}

const hasSense = (c, ...types) => types.some((type) => (c?.senses ?? []).includes(type));

// L1: the flat check the viewer needs to find the target, by the light and the weather (0 for none).
export function sightDC(state, viewer, target) {
    const env = state?.environment;
    if (!env || !viewer || !target) return 0;
    let dc = 0;
    const dark = hasSense(viewer, "darkvision", "greater-darkvision");
    if (env.light === "dark" && !dark) dc = 11;
    else if (env.light === "dim" && !dark && !hasSense(viewer, "low-light-vision")) dc = target.dimConcealDC ?? 5;
    if (env.weather === "fog" || env.weather === "rain" || (env.weather === "snow" && !viewer.snowVision)) dc = Math.max(dc, 5);
    return dc;
}

// L1: the viewer can't see the target at all (darkness without darkvision): off-guard to it.
export function unseen(state, viewer, target) {
    return sightDC(state, viewer, target) >= 11;
}

// L2: as the fight starts — light blindness, sunlight's conditions.
export function lightAtStart(state, { applyCondition }) {
    const env = state.environment;
    if (!env) return;
    for (const c of state.list) {
        if (!isActive(c) && c.status !== "pending") continue;
        if (c.lightBlindness && env.light === "bright" && (!c.lightBlindness.sunlightOnly || env.sunlight)) {
            c.cond.blinded = true;
            (c.timers ??= []).push({ key: "blinded", value: true, round: Math.max(1, state.round ?? 1), turnOf: c.id, at: "end" });
            c.permanent = [...(c.permanent ?? []), { slug: "dazzled", value: null }];
            c.cond.dazzled = true;
            log(state, `  ${c.name} is blinded by the light (Light Blindness)`);
        }
        if (c.sunlight && env.sunlight) {
            for (const { slug, value } of c.sunlight.conditions ?? []) {
                if (slug === "stunned") applyCondition(state, c, slug, value, null, c);
                else c.permanent = [...(c.permanent ?? []), { slug, value }];
            }
            if (c.sunlight.noReactions) c.noReactions = true;
            log(state, `  ${c.name} is in sunlight (${(c.sunlight.conditions ?? []).map((entry) => `${entry.slug}${entry.value ? ` ${entry.value}` : ""}`).join(", ")})`);
        }
    }
}

// L2: the end of its turn in sunlight — slowed 1 more where it says so; past its actions, petrified or destroyed.
export function sunlightTurnEnd(state, c, { killCreature }) {
    if (!c.sunlight?.grows || !state.environment?.sunlight || !isActive(c)) return;
    const slowed = (c.permanent ?? []).find((entry) => entry.slug === "slowed");
    if (!slowed) return;
    slowed.value = (slowed.value ?? 1) + 1;
    c.cond.slowed = Math.max(c.cond.slowed ?? 0, slowed.value);
    log(state, `  ${c.name} slows in the sunlight (slowed ${slowed.value})`);
    if (slowed.value < 3) return;
    if (c.sunlight.end === "destroyed") {
        log(state, `  ${c.name} is destroyed by the sunlight`);
        killCreature(state, c);
    } else {
        c.cond.paralyzed = true;
        c.permanent = [...c.permanent, { slug: "paralyzed", value: null }];
        log(state, `  ${c.name} turns to stone in the sunlight`);
    }
}

// L3: natural difficult terrain on its turn: half its Speed unless it has the stride for it (or it flies over it).
export function terrainTurn(state, c, phase) {
    const kind = state.environment?.difficult;
    if (!kind) return;
    if (phase === "start") {
        if (c.terrainSpeed || c.zoneSpeed || (c.terrainStride ?? []).includes(kind) || c.inexorable?.difficultTerrain === false || c.flies) return;
        c.terrainSpeed = c.speed ?? 25;
        c.speed = Math.max(5, Math.floor((c.speed ?? 25) / 2 / 5) * 5);
    } else if (c.terrainSpeed) {
        c.speed = c.terrainSpeed;
        c.terrainSpeed = null;
    }
}

// L4: as its turn starts, the creatures it's hidden from.
export function hiddenAtTurnStart(state, c) {
    if (!c.hiddenMovement) return;
    c.hiddenFrom = new Set(state.list.filter((other) => other.side !== c.side && isActive(other) && (c.cond.hidden || unseen(state, other, c))).map((other) => other.id));
    c.hiddenRound = state.round;
}
export function hiddenMovementOffGuard(state, attacker, target) {
    return Boolean(attacker.hiddenMovement && attacker.hiddenRound === state.round && state.acting === attacker.id && attacker.hiddenFrom?.has(target.id));
}

// L5: whether its coven can cast through it now — two other members on its side, not far apart, and no coven spell yet this round.
export function covenReady(state, c) {
    if (!c.coven || !isActive(c)) return false;
    const key = `${c.side}`;
    if ((state.covenCast?.[key] ?? -1) === state.round) return false;
    return covenHelpers(state, c).length >= 2;
}
function covenHelpers(state, c) {
    return state.list.filter((other) => other !== c && other.coven && other.side === c.side && isActive(other) && (other.band === "far") === (c.band === "far"));
}
// After a coven spell: the coven's one for the round, and an action of each helper's next turn.
export function covenCast(state, c) {
    (state.covenCast ??= {})[c.side] = state.round;
    for (const helper of covenHelpers(state, c).slice(0, 2)) {
        helper.covenDebt = (helper.covenDebt ?? 0) + 1;
        log(state, `  ${helper.name} lends its coven an action`);
    }
}
export function covenTurnStart(state, c) {
    c.covenReady = covenReady(state, c);
    if (c.covenDebt > 0) {
        c.actionsLeft = Math.max(0, (c.actionsLeft ?? 0) - c.covenDebt);
        c.covenDebt = 0;
    }
}
