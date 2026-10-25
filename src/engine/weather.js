// GM Core's weather, climate, ground and natural disasters in a fight (2026-10-25, the user: the environment module's toggles, "both" —
// live play and the simulator's fights alike). The rules are the resolution core's src/environment (one copy, the live module's too); this
// is how a fight plays them. Setup: environment.levels (the live module's scene state: fog, precipitation, wind, thunderstorm, smoke, ash,
// sandstorm, underwater, current, temperature) and environment.ground ({ key, dc }: the whole field's feature).
//   Sight: past the weather's distance a target is concealed (DC 5), past murky water's sight hidden (DC 11) — environment.js sightDC.
//   Wind: physical ranged Strikes at its penalty, none in a windstorm; flying difficult terrain (half the fly Speed, a third when greater);
//         a flier's Maneuver in Flight each turn in a gale or worse — blown away on a failure (the grid: its feet downwind; the bands: far);
//         on the ground, a creature the wind troubles rolls Athletics to move: no Stride that turn on a failure, knocked back and prone on a
//         critical failure.
//   Each turn, as it starts: a heavy sandstorm's slashing, a wildfire's heat. Each minute (every 10th round's end): incredible cold or
//         heat, hot ash, lightning's chance.
//   Breath: ash, smoke or a sandstorm that must be held off — void.js's air; out of air, out of the fight.
//   Underwater: void.js's water rules on any field (bands too); murky water's sight. A current: each turn ends with its push (the grid).
//   Ground: its difficult terrain (half or a third of a walker's Speed); uneven ground or a narrow surface (off-guard; Balance as its turn
//         starts — no Stride on a failure, prone on a critical failure); standard cover; hazards at turn start.
//   Disasters: an escalation's "then" (rule.then.kind "disaster": { key, options, targets }): each creature it covers saves; damage, prone,
//         immobilized or restrained, buried (restrained for the rest of the fight), carried off or picked up (out of the fight), falls.

import { CRITICAL_FAILURE, CRITICAL_SUCCESS, DEGREE_NAMES, FAILURE, SUCCESS, rollCheck } from "./checks.js";
import { isActive, saveModifier } from "./combatant.js";
import { fliesNow, distanceBetween } from "./space.js";
import { skillValue } from "./spells.js";
import { sizeRank } from "./abilities.js";
import { holdsBreath } from "./void.js";
import { forcedMove } from "./grid-fight.js";
import { log } from "./log.js";
import { DIRECTIONS, categoryDice, levelOf, temperatureOf } from "../../../pf2e-resolution-core/src/environment/catalog.js";
import { breathlessIn, effectiveWeather, feltTemperature, flatCheckFor, normalizeState, rangedInWind } from "../../../pf2e-resolution-core/src/environment/weather.js";
import { turnStartDamage } from "../../../pf2e-resolution-core/src/environment/ticks.js";
import { disasterCard, fallingDamage } from "../../../pf2e-resolution-core/src/environment/disasters.js";
import { featureRules } from "../../../pf2e-resolution-core/src/environment/terrain.js";

const SIZE_KEYS = ["tiny", "sm", "med", "lg", "huge", "grg"];
const PRECISE = new Set(["echolocation"]);
const SAVES = new Set(["fortitude", "reflex", "will"]);

// The fight's weather (the core's normalized state), or null when none of it is set; its ground's rules, or null.
export function weatherOf(setup = {}) {
    if (!setup.levels) return null;
    const state = normalizeState(setup.levels);
    const any = state.temperature !== "normal" || Object.entries(state).some(([key, value]) => !["temperature", "travel"].includes(key) && value);
    return any ? state : null;
}
export const groundOf = (setup = {}) => (setup.ground?.key ? featureRules(setup.ground.key, { dc: setup.ground.dc }) : null);

// A combatant as the core's rules see a creature.
export function viewOf(c) {
    return {
        size: SIZE_KEYS[sizeRank(c?.size)] ?? "med",
        traits: c?.traits ?? [],
        senses: (c?.senses ?? []).map((sense) => (typeof sense === "string" ? { type: sense, acuity: PRECISE.has(sense) ? "precise" : "imprecise", range: null } : sense)),
        speeds: { fly: Number(c?.flySpeed) || 0, swim: Number(c?.swimSpeed) || 0 },
        flying: fliesNow(c),
        breathesWater: !holdsBreath(c),
        noBreath: (c?.traits ?? []).some((trait) => trait === "undead" || trait === "construct"),
        snowVision: Boolean(c?.snowVision)
    };
}

// Sight: the flat check the weather sets between a viewer and its target (0: none).
export function weatherSightDC(state, viewer, target) {
    const levels = state?.environment?.levels;
    if (!levels || !viewer || !target) return 0;
    return flatCheckFor(levels, { attacker: viewOf(viewer), target: viewOf(target), distance: distanceBetween(viewer, target) })?.dc ?? 0;
}

// Whether the fight is under water by its weather (void.js's water rules on any field).
export const underwaterByWeather = (state) => Boolean(state?.environment?.levels?.underwater);

// A creature coming into the fight: the wind on its ranged Strikes, its breath, its footing on the ground and the ground's cover.
export function weatherJoin(state, c) {
    const env = state.environment;
    if (!env?.levels && !env?.ground) return;
    if (c.weatherJoined || c.kind === "object") return;
    c.weatherJoined = true;
    const levels = env.levels;
    if (levels) {
        const wind = rangedInWind(levels);
        // (Physical ranged Strikes: not an impulse's.)
        if (!wind.possible || wind.penalty) c.strikes = (c.strikes ?? []).map((strike) => (strike.melee || (strike.traits ?? []).includes("impulse") ? strike : wind.possible ? { ...strike, bonus: strike.bonus + wind.penalty } : { ...strike, weatherBlocked: true }));
        if (breathlessIn(levels, viewOf(c)).some((reason) => reason !== "underwater") && holdsBreath(c) && c.air === undefined) c.air = c.airMax = 5 + (Number.isFinite(c.con) ? c.con : 2);
    }
    if (env.ground?.effect && !fliesNow(c)) {
        if (env.ground.events.balance) c.groundFooting = true;
        if (env.ground.effect.rules.some((rule) => rule.slug === "terrain-cover")) c.groundCover = 2;
    }
}

// As its turn starts: the turn's damage; the wind's checks; the ground's Balance and hazards; flying and walking at the costs they set.
export function weatherTurnStart(state, c, { applyDamage, applyCondition }) {
    const env = state.environment;
    if ((!env?.levels && !env?.ground) || !isActive(c) || c.kind === "object") return;
    const levels = env.levels;
    const view = viewOf(c);
    if (levels) for (const hit of turnStartDamage(levels, view)) hurt(state, c, hit.label, categoryDice(hit.category), hit.type, { applyDamage });
    const weather = levels ? effectiveWeather(levels) : null;
    const wind = weather?.wind ? levelOf("wind", weather.wind.level) : null;
    let speed = 1;
    if (wind?.flying && view.flying) speed = Math.min(speed, 1 / wind.flying);
    if (wind?.flightDC && view.flying) {
        const roll = rollCheck(state.rng, skillValue(c, "acrobatics"), weather.wind.flightDC);
        if (roll.degree < SUCCESS) {
            c.blownAway = { feet: weather.wind.blownFeet, direction: weather.wind.direction, now: roll.degree === CRITICAL_FAILURE };
            log(state, `  ${c.name} fails to Maneuver in Flight (${wind.label})`);
            if (c.blownAway.now) blowAway(state, c);
        }
    } else if (wind?.groundDC && !view.flying && (!wind.groundSizes || wind.groundSizes.includes(view.size))) {
        const roll = rollCheck(state.rng, skillValue(c, "athletics") + ({ tiny: -2, sm: -1 }[view.size] ?? 0), weather.wind.groundDC);
        if (roll.degree === CRITICAL_FAILURE) {
            log(state, `  ${c.name} is knocked back and prone by the ${wind.label.toLowerCase()}`);
            applyCondition(state, c, "prone", null, null, null);
            pushDownwind(state, c, 10, weather.wind.direction);
        }
        if (roll.degree < SUCCESS) speed = 0;
    }
    const ground = env.ground;
    // (Its footing as it stands now: off the ground while it flies.)
    if (ground?.events.balance) c.groundFooting = !view.flying;
    if (ground && !view.flying) {
        const cost = Math.max(ground.costs.walk ?? 1, 1);
        if (cost > 1 && !(c.terrainStride ?? []).length) speed = Math.min(speed, 1 / cost);
        if (ground.events.balance) {
            const roll = rollCheck(state.rng, skillValue(c, "acrobatics"), ground.events.balance.dc);
            if (roll.degree === CRITICAL_FAILURE) {
                log(state, `  ${c.name} falls on the ${ground.label.toLowerCase()}`);
                applyCondition(state, c, "prone", null, null, null);
            }
            if (roll.degree < SUCCESS) speed = 0;
            else if (roll.degree === SUCCESS && cost === 1) speed = Math.min(speed, 1 / 2);
        }
        if (ground.events.hazard) hurt(state, c, ground.label, ground.events.hazard.formula, ground.events.hazard.type, { applyDamage });
    }
    // (Its Speeds for this turn, back as it ends — weatherTurnEnd.)
    if (speed < 1) {
        c.weatherSpeeds = { speed: c.speed, flySpeed: c.flySpeed };
        c.speed = speed ? Math.max(5, Math.floor((c.speed ?? 25) * speed / 5) * 5) : 0;
        if (c.flySpeed) c.flySpeed = speed ? Math.max(5, Math.floor(c.flySpeed * speed / 5) * 5) : 0;
    }
}

// As its turn ends: its Speeds back; a current's push; blown away for want of a successful Maneuver in Flight.
export function weatherTurnEnd(state, c) {
    if (c.weatherSpeeds) {
        c.speed = c.weatherSpeeds.speed;
        c.flySpeed = c.weatherSpeeds.flySpeed;
        c.weatherSpeeds = null;
    }
    const levels = state.environment?.levels;
    if (!levels || !isActive(c)) return;
    if (c.blownAway && !c.blownAway.now && fliesNow(c)) blowAway(state, c);
    c.blownAway = null;
    const weather = effectiveWeather(levels);
    if (weather.current && !fliesNow(c)) pushDownwind(state, c, weather.current.feet, weather.current.direction);
}

// Each minute — as every 10th round ends —: incredible cold or heat, hot ash, lightning's chance.
export function weatherRoundEnd(state, { applyDamage }) {
    const levels = state.environment?.levels;
    if (!levels || state.round % 10 !== 0) return;
    const weather = effectiveWeather(levels);
    for (const c of state.list.filter((entry) => isActive(entry) && entry.kind !== "object")) {
        const temperature = temperatureOf(feltTemperature(levels, viewOf(c)));
        if (temperature.damage?.every === 60) hurt(state, c, temperature.label.replace(/ \(.*\)$/, ""), categoryDice(temperature.damage.category), temperature.damage.type, { applyDamage });
        if (weather.ash) hurt(state, c, "Hot volcanic ash", categoryDice("minor"), "fire", { applyDamage });
        for (const [entry, category] of [[weather.thunderstorm, weather.thunderstorm ? levelOf("thunderstorm", weather.thunderstorm.level).lightning : null], [weather.ash, "moderate"]]) {
            if (!entry?.chance || state.rng.die(entry.chance) !== 1) continue;
            const save = entry.dc ? rollCheck(state.rng, saveModifier(c, "reflex"), entry.dc).degree : FAILURE;
            const share = { [CRITICAL_SUCCESS]: 0, [SUCCESS]: 0.5, [FAILURE]: 1, [CRITICAL_FAILURE]: 2 }[save];
            hurt(state, c, "Lightning strikes", categoryDice(category), "electricity", { applyDamage, share });
        }
    }
}

// A natural disaster (an escalation's "then"): each creature it covers saves, and its degree does what the core's card says.
export function strikeDisaster(state, rule, { applyDamage, applyCondition, leaveField }) {
    const then = rule.then;
    const card = disasterCard(then.key, then.options ?? {});
    if (!card) return;
    const rolled = (card.damage ?? []).map((part) => ({ type: part.type, amount: rollFormula(state, part.formula) }));
    log(state, `  ${card.title}: ${rolled.map((part) => `${part.amount} ${part.type}`).join(" + ") || "no damage"}`);
    const covered = state.list.filter((c) => isActive(c) && c.kind !== "object" && (!then.targets || then.targets === "all" || c.side === then.targets));
    for (const c of covered) {
        let row = card.automatic;
        if (card.check) {
            const modifier = SAVES.has(card.check.statistic) ? saveModifier(c, card.check.statistic) : skillValue(c, card.check.statistic);
            row = card.degrees[DEGREE_NAMES[rollCheck(state.rng, modifier, card.check.dc).degree]];
        }
        if (!row) continue;
        const instances = rolled.map((part) => ({ type: part.type, amount: Math.floor(part.amount * (row.damage ?? 0)), persistent: false, precision: false }));
        if (row.falls) instances.push({ type: "bludgeoning", amount: fallingDamage(row.falls.feet), persistent: false, precision: false });
        if (row.pickedUp) instances.push({ type: "bludgeoning", amount: fallingDamage(row.pickedUp.falling), persistent: false, precision: false });
        if (instances.some((instance) => instance.amount > 0)) applyDamage(state, c, instances.filter((instance) => instance.amount > 0));
        if (!isActive(c)) continue;
        for (const condition of row.conditions ?? []) applyCondition(state, c, condition.slug, null, null, null);
        if (row.falls) applyCondition(state, c, "prone", null, null, null);
        if (row.persistent) c.persistent.push({ type: row.persistent.type, ...persistentDice(row.persistent.formula) });
        if (row.buried) {
            log(state, `  ${c.name} is buried`);
            applyCondition(state, c, "restrained", null, null, null);
            c.buried = true;
        }
        if (row.carried || row.pickedUp) {
            log(state, `  ${c.name} is ${row.carried ? "carried off" : "picked up by the funnel"}`);
            leaveField(state, c, { fell: true });
        } else if (row.pushed) pushDownwind(state, c, row.pushed.feet, row.pushed.direction);
    }
}

function rollFormula(state, formula) {
    const match = /^(\d+)d(\d+)$/.exec(String(formula ?? ""));
    if (!match) return 0;
    let total = 0;
    for (let index = 0; index < Number(match[1]); index++) total += state.rng.die(Number(match[2]));
    return total;
}
// (damage.js rollPersistent's shape: dice, die, bonus.)
const persistentDice = (formula) => {
    const match = /^(\d+)d(\d+)$/.exec(String(formula ?? ""));
    return match ? { dice: Number(match[1]), die: Number(match[2]), bonus: 0 } : { amount: 0 };
};

function hurt(state, c, label, formula, type, { applyDamage, share = 1 }) {
    const amount = Math.floor(rollFormula(state, formula) * share);
    if (!(amount > 0)) return;
    const dealt = applyDamage(state, c, [{ type, amount, persistent: false, precision: false }]);
    log(state, `  ${label}: ${c.name} takes ${dealt} ${type}`);
}

// Blown away: the grid, its feet downwind; the bands, far off.
function blowAway(state, c) {
    const { feet, direction } = c.blownAway;
    log(state, `  ${c.name} is blown ${feet} feet ${direction}`);
    pushDownwind(state, c, feet, direction);
    if (!c.square && c.band !== "far") {
        c.band = "far";
        c.meleeId = null;
    }
    c.blownAway = null;
}

// A push downwind (or downstream) on the grid: the grid's forced move from a point upwind of it.
function pushDownwind(state, c, feet, direction) {
    if (!c.square || !state.grid) return;
    const [dx, dy] = DIRECTIONS[direction] ?? [0, 0];
    if (!dx && !dy) return;
    const source = { square: [c.square[0] - dx * 40, c.square[1] - dy * 40], size: "tiny" };
    forcedMove(state, c, source, 1, feet);
}
