// Zones (B256, 2026-10-12): an ability's area that lasts, as the engine's bands allow. Its members: the creatures around its maker (an
// emanation, or a burst centred on it), or around the creature it was placed on (a burst at range); a cone's or a line's, the creatures it
// first covered. Concealed while inside (both sides); a foe's turn inside: its saves at the turn's start, and on coming in (read at the
// turn's end), damage at its end, a hazard's damage when it moved in; difficult terrain halves a foe's Speed for its turn there; PF2e's
// effect while inside (its allies only, when so). It ends with its time, at its maker's turn, or when its maker is gone. Its maker isn't
// harmed by it, nor are its allies by its saves and damage.

import { isActive } from "./combatant.js";
import { sizeRank } from "./abilities.js";
import { applyEffect, removeEffect } from "./effects.js";
import { applyDamage, log } from "./actions.js";
import { spellContext } from "./damage.js";
import { applyCondition, castPlan, rollInstances } from "./spells.js";
import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";
import { areaPlacements, inSquares, regroup } from "./grid-fight.js";
import { emanationSquares } from "./grid.js";

let nextZoneId = 1;

// The rounds a zone lasts: its time (minutes count 10 rounds), or for good (Infinity: until used again, an hour or more, no time said).
export function zoneRounds(lasts, rolled = null) {
    if (!lasts) return Infinity;
    const value = Number.isFinite(rolled) ? rolled : Number(lasts.value);
    if (lasts.unit === "rounds") return value;
    if (lasts.unit === "minutes") return value * 10;
    return Infinity;
}

// Whether a creature is within radius feet of another, as the engine's bands say: the same Melee for 10 feet or less, not far off (or both
// far) for more, everyone from 60 feet.
function near(anchor, other, radius) {
    if (anchor === other) return true;
    if (!isActive(other) || other.band === "gone") return false;
    if (radius >= 60) return true;
    if (radius <= 10) return anchor.meleeId !== null && anchor.meleeId !== undefined && anchor.meleeId === other.meleeId;
    return other.band !== "far" || anchor.band === "far";
}

// The creatures in a zone now. (On the grid: those in its squares — an emanation's about its maker as it stands now.)
export function zoneMembers(state, zone) {
    if (state.grid && zone.squares) return inSquares(state, zone.squares);
    if (state.grid && zone.around) {
        const anchor = state.byId.get(zone.anchorId);
        return anchor?.square && anchor.band !== "gone" ? inSquares(state, emanationSquares(state.grid, anchor, zone.radius)) : [];
    }
    if (zone.fixed) return state.list.filter((c) => zone.fixed.has(c.id) && isActive(c));
    const anchor = state.byId.get(zone.anchorId);
    if (!anchor || anchor.band === "gone") return [];
    return state.list.filter((c) => isActive(c) && near(anchor, c, zone.radius));
}

// A square's reach from its middle square: 15 feet across, 5 feet; at least 5.
function squareRadius(side) {
    return Math.max(5, Math.floor(((Number(side) || 15) - 5) / 10) * 5);
}

// The ability's zone, as it's made: its members concealed, its effect on them, its saves "as it's made" on its foes there.
export function startZone(state, owner, spell, targetIds) {
    const model = spell.zone;
    const area = model.area ?? {};
    const first = targetIds.map((id) => state.byId.get(id)).find(Boolean);
    const rolled = model.lasts?.valueRoll ? rollDice(state, model.lasts.valueRoll) : null;
    const rounds = zoneRounds(model.lasts, rolled);
    const zone = {
        id: nextZoneId++,
        name: spell.name,
        ownerId: owner.id,
        side: owner.side,
        model,
        // (B262: a square, "a 15-foot by 15-foot area", as the creatures within half of it from its middle square.)
        radius: area.type === "square" ? squareRadius(area.value) : Number(area.value) || 5,
        anchorId: model.centre === "target" ? (first?.id ?? owner.id) : area.type === "emanation" || (area.type === "burst" && model.centre !== "placed") ? owner.id : (first?.id ?? owner.id),
        fixed: area.type === "cone" || area.type === "line" ? new Set(targetIds) : null,
        until: Number.isFinite(rounds) ? state.round + rounds : Infinity,
        // (I2: area damage, with its source's traits.)
        context: spellContext(spell, { isSpell: !["ability", "basic", "item"].includes(spell.kind), area: true })
    };
    // (On the grid: its squares — where it was placed, the placement that holds the most of those it was cast at; an emanation about
    // its maker, as it moves; its difficult terrain on the map while it lasts.)
    if (state.grid && owner.square) placeOnGrid(state, zone, owner, area, targetIds);
    (state.zones ??= []).push(zone);
    // (A spell's light or darkness: the fight has one now — light.js.)
    if (model.light) state.lit = true;
    (owner.activeZones ??= new Set()).add(spell.name);
    log(state, `  ${owner.name}'s ${spell.name} covers the area${Number.isFinite(rounds) ? ` for ${rounds} rounds` : ""}`);
    for (const c of zoneMembers(state, zone)) {
        refresh(state, zone, c);
        if (c.side !== zone.side) for (const save of model.saves ?? []) if (save.plan && save.when.includes("initial") && onlyFits(save, c)) castPlan(state, owner, saveSpell(zone, save), [c.id]);
    }
    return zone;
}

// A zone's save as the engine casts it: an ability's at its own numbers; a lingering spell's (castAs) with the spell's rank, DC and
// attack. (fromZone: it doesn't start another zone.)
function saveSpell(zone, save) {
    const as = zone.model.castAs;
    return { name: zone.name, plan: save.plan, castRank: as?.castRank ?? 1, pool: null, ...(as ? { dc: as.dc, attack: as.attack, ...(as.kind ? { kind: as.kind } : {}) } : { kind: "ability" }), effects: zone.model.effects ?? {}, fromZone: true };
}

// A lingering spell's area (2026-10-14, spell coverage; the spell module's resolution.lingering): its later saves — at a creature's turn
// start or end, on coming in, each time its caster Sustains it — as a zone's, with the spell's own numbers; concealment and difficult
// terrain as a zone's. Its first save is the spell's own cast.
const LINGER_WHEN = { "turn-start": "start", "round-start": "start", enter: "enter", "turn-end": "end", sustain: "sustain" };
export function startLingering(state, caster, spell, targetIds) {
    const lingering = spell.plan?.resolution?.lingering;
    if (!lingering?.area) return null;
    const rounds = Number.isFinite(Number(lingering.durationSeconds)) && Number(lingering.durationSeconds) > 0 ? Math.max(1, Math.round(Number(lingering.durationSeconds) / 6)) : null;
    const when = [...new Set((lingering.events ?? []).map((event) => LINGER_WHEN[event]).filter(Boolean))];
    const model = {
        area: lingering.area,
        // (Aura of Violent Light's: about the creature it's cast on — "target" — as it moves; growing each Sustain.)
        centre: lingering.centre === "caster" ? "caster" : lingering.centre === "target" ? "target" : "placed",
        ...(lingering.grows ? { grows: lingering.grows } : {}),
        lasts: rounds ? { value: rounds, unit: "rounds" } : null,
        concealed: Boolean(lingering.concealment),
        terrain: lingering.terrain ? [lingering.terrain] : [],
        saves: when.length ? [{ plan: spell.plan, when }] : [],
        sustained: Boolean(lingering.sustained),
        castAs: { castRank: spell.castRank, dc: spell.dc, attack: spell.attack, kind: spell.kind ?? null },
        effects: spell.effects ?? {}
    };
    return startZone(state, caster, { name: spell.name, kind: spell.kind, plan: spell.plan, zone: model }, targetIds);
}

function placeOnGrid(state, zone, owner, area, targetIds) {
    if ((zone.anchorId === owner.id || zone.model.centre === "target") && area.type !== "cone" && area.type !== "line") {
        zone.around = true;
        return;
    }
    const wanted = new Set(targetIds);
    const around = targetIds.map((id) => state.byId.get(id)).filter((c) => c?.square);
    let best = null;
    for (const placement of areaPlacements(state, owner, { type: area.type ?? "burst", value: Number(area.value) || 5 }, Infinity, around.length ? around : [state.byId.get(zone.anchorId)].filter(Boolean))) {
        const caught = inSquares(state, placement.squares).filter((c) => wanted.has(c.id)).length;
        if (!best || caught > best.caught) best = { caught, squares: placement.squares };
    }
    if (!best) return;
    zone.squares = new Set(best.squares);
    zone.fixed = null;
    if ((zone.model.terrain ?? []).some((entry) => (entry.movement ?? ["walk"]).some((move) => ["walk", "climb"].includes(move)))) {
        state.gridTerrain ??= new Map();
        for (const square of zone.squares) state.gridTerrain.set(square, Math.max(state.gridTerrain.get(square) ?? 1, 2));
        regroup(state);
    }
}

// The difficult terrain the zones lay on the grid, again (one has ended).
function terrainAgain(state) {
    if (!state.grid) return;
    state.gridTerrain = new Map();
    for (const zone of state.zones ?? []) {
        if (!zone.squares || !(zone.model.terrain ?? []).length) continue;
        for (const square of zone.squares) state.gridTerrain.set(square, Math.max(state.gridTerrain.get(square) ?? 1, 2));
    }
    regroup(state);
}

function rollDice(state, formula) {
    const match = /^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/.exec(String(formula).trim());
    if (!match) return null;
    let total = Number(match[3] ?? 0);
    for (let die = 0; die < Number(match[1]); die++) total += state.rng.die(Number(match[2]));
    return total;
}

// What being inside gives: concealment (for this round, refreshed each turn), the zone's effect (once, while it stays inside).
function refresh(state, zone, c) {
    const owner = state.byId.get(zone.ownerId);
    if (zone.model.concealed && !c.cond.concealed) applyCondition(state, c, "concealed", null, { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" }, owner);
    const effect = zone.model.effectModel;
    const key = `zone:${zone.id}`;
    if (effect && (!zone.model.effect?.allies || c.side === zone.side) && !(c.effects ?? []).some((entry) => entry.key === key)) applyEffect(state, c, { ...effect, rounds: Number.isFinite(zone.until) ? Math.max(1, zone.until - state.round) : effect.rounds }, owner, { applyCondition, key });
}

// A creature's turn starting or ending: the zones' doings on it, and zones whose time is up.
// (2026-10-18: a save or damage only for creatures with some traits — entry.only.traits, any of them: Sanctified Beans' fiends, fey,
// ghosts, spirits and undead —, as live play's. 2026-10-26: or only for a size or larger — entry.only.minSize, the item module's "Small or
// larger" snares; 2026-10-27: or smaller — entry.only.maxSize, "A Medium or smaller creature".)
const onlyFits = (entry, c) => (!entry?.only?.traits?.length || entry.only.traits.some((trait) => (c.traits ?? []).includes(trait))) && (!entry?.only?.minSize || sizeRank(c.size) >= sizeRank(entry.only.minSize)) && (!entry?.only?.maxSize || sizeRank(c.size) <= sizeRank(entry.only.maxSize));

export function zoneTurn(state, c, phase) {
    if (!state.zones?.length) return;
    if (phase === "start") {
        for (const zone of [...state.zones]) {
            const owner = state.byId.get(zone.ownerId);
            if ((zone.ownerId === c.id && state.round >= zone.until) || (!Number.isFinite(zone.until) && !(owner && isActive(owner)))) {
                endZone(state, zone);
                continue;
            }
            // (A sustained lingering spell: its caster's action, or it ends; its saves "each time you Sustain".)
            if (zone.model.sustained && zone.ownerId === c.id) {
                if (!(c.actionsLeft > 0)) {
                    endZone(state, zone);
                    continue;
                }
                c.actionsLeft -= 1;
                log(state, `  ${c.name} Sustains ${zone.name}`);
                (c.sustainedNow ??= []).push(zone.name);
                if (zone.model.grows && zone.radius < zone.model.grows.max) zone.radius = Math.min(zone.model.grows.max, zone.radius + zone.model.grows.by);
                for (const save of zone.model.saves ?? []) {
                    if (!save.when.includes("sustain")) continue;
                    for (const member of zoneMembers(state, zone)) if (member.side !== zone.side && isActive(member) && onlyFits(save, member)) castPlan(state, c, saveSpell(zone, save), [member.id]);
                }
            }
        }
    }
    const members = new Set();
    for (const zone of state.zones) if (zoneMembers(state, zone).includes(c)) members.add(zone.id);
    if (phase === "start") {
        c.zonesAtStart = members;
        // (Its Speed, halved for a turn spent in difficult terrain of a foe's.)
        if (c.zoneSpeed) c.speed = c.zoneSpeed;
        c.zoneSpeed = null;
    }
    for (const zone of state.zones) {
        const inside = members.has(zone.id);
        if (!inside) {
            if (phase === "start") for (const effect of (c.effects ?? []).filter((entry) => entry.key === `zone:${zone.id}`)) removeEffect(c, effect);
            continue;
        }
        const owner = state.byId.get(zone.ownerId);
        if (phase === "start") refresh(state, zone, c);
        if (c.side === zone.side || !owner) continue;
        const cameIn = phase === "end" && !(c.zonesAtStart ?? new Set()).has(zone.id);
        // (T2, Inexorable: no difficult terrain for it; L3: a plant zone's for a creature with Woodland Stride.)
        const strides = (c.terrainStride ?? []).includes("plants") && ["plant", "fungus", "wood"].some((trait) => zone.context?.has?.(`item:trait:${trait}`));
        // (On the grid its difficult terrain is on the map: the way through it costs double.)
        if (phase === "start" && !state.grid && !strides && c.inexorable?.difficultTerrain !== false && (zone.model.terrain ?? []).some((entry) => (entry.movement ?? ["walk"]).some((move) => ["walk", "climb"].includes(move))) && !c.zoneSpeed) {
            c.zoneSpeed = c.speed ?? 25;
            c.speed = Math.max(5, Math.floor((c.speed ?? 25) / 2 / 5) * 5);
        }
        if (cameIn && zone.model.hazard?.formulas?.length && onlyFits(zone.model.hazard, c)) hurt(state, zone, owner, c, zone.model.hazard.formulas, "moves into");
        for (const save of zone.model.saves ?? []) {
            if (!save.plan || !isActive(c) || !onlyFits(save, c)) continue;
            if ((phase === "start" && save.when.includes("start")) || (cameIn && save.when.includes("enter") && !save.when.includes("start")) || (phase === "end" && save.when.includes("end"))) castPlan(state, owner, saveSpell(zone, save), [c.id]);
        }
        for (const entry of zone.model.damage ?? []) if (entry.when === (phase === "start" ? "start" : "end") && isActive(c) && onlyFits(entry, c)) hurt(state, zone, owner, c, entry.formulas, phase === "start" ? "starts its turn in" : "ends its turn in");
    }
    if (phase === "end" && c.zoneSpeed) {
        c.speed = c.zoneSpeed;
        c.zoneSpeed = null;
    }
}

function hurt(state, zone, owner, c, formulas, how) {
    const instances = formulas.flatMap((formula) => rollInstances(state, parseDamage(String(formula)))).map((instance) => ({ ...instance, context: zone.context }));
    const dealt = applyDamage(state, c, instances, { source: owner });
    log(state, `  ${c.name} ${how} ${zone.name}: ${dealt} damage`);
}

export function endZone(state, zone) {
    state.zones = (state.zones ?? []).filter((entry) => entry !== zone);
    if (zone.squares && (zone.model.terrain ?? []).length) terrainAgain(state);
    state.byId.get(zone.ownerId)?.activeZones?.delete(zone.name);
    for (const c of state.list) for (const effect of (c.effects ?? []).filter((entry) => entry.key === `zone:${zone.id}`)) removeEffect(c, effect);
    log(state, `  ${zone.name} ends`);
}

// The ability's entry for the engine (a spell entry with its zone), or null: valued as its save on the creatures in its area as it's made
// or on entering, else its damage, else concealment on itself; a zone of terrain alone isn't valued, nor one on a trigger the engine
// doesn't play. extra: what the reader adds (the effect's model).
export function zoneSpell(name, plan, extra = {}) {
    const zone = plan?.zone;
    if (plan?.builtin !== "zone" || !zone?.area || !["use", "initiative"].includes(plan.trigger?.event ?? "use")) return null;
    // (2026-10-16: or one at the end of a turn in it — Noisome Garum's, an aura's "ends its turn within" —, valued the same; zoneTurn plays it.)
    const save = (zone.saves ?? []).find((entry) => entry.plan?.resolution && entry.when.some((when) => ["initial", "start", "enter"].includes(when)))
        ?? (zone.saves ?? []).find((entry) => entry.plan?.resolution && entry.when.includes("end"));
    const trigger = { event: plan.trigger?.event ?? "use", ...(plan.trigger?.reaction ? { reaction: true } : {}), ...(plan.trigger?.free ? { free: true } : {}), ...(plan.trigger?.recharge ? { recharge: { ...plan.trigger.recharge } } : {}) };
    const activation = { time: plan.trigger?.reaction ? (plan.trigger.free ? "free" : "reaction") : String(plan.actions || 1), traits: [] };
    // (B262: a square as the burst around its middle square.)
    const area = zone.area.type === "square" ? { type: "burst", value: squareRadius(zone.area.value) } : { type: zone.area.type, value: zone.area.value };
    const base = { modelVersion: 13, source: { name }, rank: 1, traits: [], activation, automation: { level: "automatic" }, trigger };
    const none = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
    const automatic = (success, targeting) => ({ ...base, targeting, resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { ...none }, success, failure: { ...none }, criticalFailure: { ...none } } } });
    const formulas = [...(zone.damage ?? []).flatMap((entry) => entry.formulas), ...(zone.hazard?.formulas ?? [])];
    const inArea = { target: null, range: zone.range ? `${zone.range} feet` : null, area };
    // (PF2e's effect inside: on its allies there, an effect for them; on the others, as a hit's would be.)
    const effect = zone.effect && extra.effectModel ? (zone.effect.allies ? { ...base, targeting: inArea, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: zone.effect.uuid, label: zone.effect.label, recipients: "allies-in-area" }] } } : automatic({ ...none, nativeEffects: [{ uuid: zone.effect.uuid, label: zone.effect.label }] }, inArea)) : null;
    const value = save ? { ...save.plan, ...base, targeting: inArea }
        : formulas.length ? automatic({ damage: { mode: "formulas", formulas: formulas.map((formula) => ({ formula })), rollScope: "target" }, effects: [] }, inArea)
            : effect ? effect
                : zone.concealed ? automatic({ ...none, effects: [{ kind: "condition", slug: "concealed", value: null, duration: { mode: "fixed", value: Math.min(3, zoneRounds(zone.lasts)), unit: "rounds", expiry: "turn-start" } }] }, { target: "self", range: null, area: null })
                    : null;
    if (!value) return null;
    return { name, plan: value, castRank: 1, pool: null, kind: "ability", zone: { ...zone, ...extra }, ...(zone.effect && extra.effectModel ? { effects: { ...(extra.effects ?? {}), [zone.effect.uuid]: extra.effectModel } } : extra.effects ? { effects: { ...extra.effects } } : {}) };
}
