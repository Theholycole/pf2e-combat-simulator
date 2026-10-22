// Sight and light from spells (2026-10-21, the user: "I also want spells that need foe traits since i want those to be tracked too in the
// simulator"; their choices: sight and light, invisibility, energy damage, flying and incorporeal). The fight's light (environment.js,
// L1–L5) is changed where spells put light or darkness:
//   - a zone's — Darkness, Dance of Darkness (magical darkness), Radiant Field (magical bright light) — on the creatures in it, as the
//     engine's bands or the grid have them (zones.js's members);
//   - a creature's own — an effect that sheds light (the Light cantrip's, a lantern's light aura): bright light within its radius, dim
//     light to the next.
// Of magical light and darkness on a creature, the higher rank's; darkness on a tie ("Magical light of the cast rank or lower is
// suppressed"); either over the fight's own light. Senses: a creature's own and its effects' (Darkvision's). Seeing (environment.js
// sightDC): darkness hides a target from a viewer without darkvision (DC 11), and heightened Darkness ("deep") conceals it even from one
// with darkvision short of greater darkvision (DC 5); dim light conceals it from one without low-light vision or darkvision (DC 5).
// Light blindness in a spell's bright light: blinded through its first turn there, dazzled while there.

import { isActive } from "./combatant.js";
import { distanceBetween } from "./space.js";
import { zoneMembers, zoneRounds } from "./zones.js";
import { log } from "./log.js";

const LEVELS = ["dark", "dim", "bright"];

// A creature's senses: its own and those its effects give.
export function sensesOf(c) {
    return [...(c?.senses ?? []), ...(c?.effects ?? []).flatMap((effect) => effect.model?.senses ?? [])];
}
export const hasSense = (c, ...types) => sensesOf(c).some((sense) => types.includes(sense));

// Of the lights on a creature ({ level, magical, rank, deep? }), the one that holds: magical over the fight's own; of magical ones, the
// higher rank's, darkness on a tie.
function strongest(lights) {
    const magical = lights.filter((light) => light.magical);
    if (!magical.length) return lights[0];
    return magical.sort((a, b) => b.rank - a.rank || (a.level === "dark" ? -1 : b.level === "dark" ? 1 : LEVELS.indexOf(b.level) - LEVELS.indexOf(a.level)))[0];
}

// The light a creature stands in: { level: "bright" | "dim" | "dark", magical, rank, deep? }. extra: lights to count as well (a spell
// being weighed: { light, on: Set of creature ids }).
export function lightAt(state, c, extra = []) {
    const own = { level: state?.environment?.light ?? "bright", magical: false, rank: 0 };
    // (No spell's light yet this fight — state.lit, set as one comes: the fight's own.)
    if (!state?.lit && !extra.length) return own;
    const lights = [own];
    for (const zone of state?.zones ?? []) if (zone.model?.light && zoneMembers(state, zone).includes(c)) lights.push(zone.model.light);
    for (const bearer of state?.list ?? []) {
        if (bearer.band === "gone") continue;
        for (const effect of bearer.effects ?? []) {
            const shed = effect.model?.light;
            if (!shed) continue;
            const feet = bearer === c ? 0 : distanceBetween(bearer, c);
            if (feet <= shed.bright) lights.push({ level: "bright", magical: true, rank: shed.rank ?? 1 });
            else if (feet <= shed.bright + (shed.dim ?? 0)) lights.push({ level: "dim", magical: true, rank: shed.rank ?? 1 });
        }
    }
    for (const { light, on } of extra) if (on.has(c.id)) lights.push(light);
    return strongest(lights);
}

// The flat check a viewer needs to see a target standing in a light (0 for none). extraSenses: senses to count as well.
export function sightDCIn(viewer, light, extraSenses = []) {
    // (Penumbral Shroud, 2026-10-22: dimmed — it perceives light a step lower than it is, bright as dim, dim as dark.)
    if (viewer?.cond?.dimmed && light.level !== "dark") light = { ...light, level: light.level === "bright" ? "dim" : "dark" };
    const has = (...types) => hasSense(viewer, ...types) || types.some((type) => extraSenses.includes(type));
    const dark = has("darkvision", "greater-darkvision");
    if (light.level === "dark") {
        if (!dark) return 11;
        return light.deep && !has("greater-darkvision") ? 5 : 0;
    }
    if (light.level === "dim" && !dark && !has("low-light-vision")) return 5;
    return 0;
}

// What a flat check to see a target costs the viewer's attacks on it, in rounds of its threat a round: hidden (DC 11) about half of them,
// concealed (DC 5) a fifth.
export const unseenCost = (dc) => (dc >= 11 ? 0.5 : dc >= 5 ? 0.2 : 0);

// A spell's light as a zone, or null: Darkness ("darkness-area"; deep from the rank its heightened entry says), Dance of Darkness's
// ("dance-darkness": its emanation about the caster, for a success's time), Radiant Field ("radiant-field": bright light). { area, lasts,
// centre, light }.
export function lightZoneModel(plan, rank = 1) {
    const resolution = plan?.resolution ?? {};
    const lastsOf = (seconds) => (Number(seconds) >= 60 ? { value: Math.round(Number(seconds) / 60), unit: "minutes" } : { value: Math.max(1, Math.round((Number(seconds) || 6) / 6)), unit: "rounds" });
    if (resolution.kind === "darkness-area" && resolution.darknessArea?.area) {
        const deep = (resolution.darknessArea.heightened ?? []).some((entry) => rank >= Number(entry.minRank) && /darkvision/i.test(String(entry.note ?? "")));
        return { area: resolution.darknessArea.area, lasts: lastsOf(resolution.darknessArea.durationSeconds), centre: "placed", light: { level: "dark", magical: true, rank, ...(deep ? { deep: true } : {}) } };
    }
    if (resolution.kind === "dance-darkness" && resolution.danceDarkness) {
        return { area: { type: "emanation", value: Number(resolution.danceDarkness.radius) || 10 }, lasts: lastsOf(resolution.danceDarkness.seconds?.success), light: { level: "dark", magical: true, rank } };
    }
    if (resolution.kind === "radiant-field" && resolution.radiantField?.area) {
        return { area: resolution.radiantField.area, lasts: lastsOf(resolution.radiantField.durationSeconds), centre: "placed", light: { level: "bright", magical: true, rank } };
    }
    return null;
}

// The zone a spell makes of its light, or null.
export function lightZoneOf(spell) {
    return lightZoneModel(spell?.plan, Number(spell?.castRank) || 1);
}

// What dimming a creature's sight is worth against it (Penumbral Shroud) over rounds, in rounds of its threat: how much harder it finds its
// foes, as the light they stand in looks to it a step lower — nothing to one with darkvision in bright light.
export function dimWorth(state, target, rounds) {
    const foes = (state?.list ?? []).filter((other) => other.side !== target.side && isActive(other));
    if (!foes.length || target.cond?.dimmed) return 0;
    const dimmed = { ...target, cond: { ...target.cond, dimmed: true } };
    return foes.reduce((sum, foe) => sum + unseenCost(sightDCIn(dimmed, lightAt(state, foe))) - unseenCost(sightDCIn(target, lightAt(state, foe))), 0) / foes.length * rounds;
}

// What light on creatures does to how well each side sees the other: for each creature, the change in how hard its foes find it (their
// unseenCost, mean over them) — positive: harder to see. extra: the lights to weigh ({ light, on }); extraSenses (Map id → senses).
export function sightChange(state, creatures, { extra = [], extraSenses = new Map() } = {}) {
    const out = new Map();
    for (const target of creatures) {
        const watchers = state.list.filter((other) => other.side !== target.side && isActive(other));
        if (!watchers.length) {
            out.set(target, 0);
            continue;
        }
        const now = lightAt(state, target);
        const then = lightAt(state, target, extra);
        let change = 0;
        for (const watcher of watchers) change += unseenCost(sightDCIn(watcher, then, extraSenses.get(watcher.id) ?? [])) - unseenCost(sightDCIn(watcher, now));
        out.set(target, change / watchers.length);
    }
    return out;
}

// A light zone's worth, as spellExpectation has a cast's: on each creature it covers (targets), its own side harder or easier to see —
// an ally's benefit, a foe's worth (its being harder to see: against the caster) — and light blindness in its bright light (blinded its
// first round, dazzled while there). [{ target, damage, worth, benefit }].
export function lightZoneEntries(state, caster, spell, targets, worthOf) {
    const model = lightZoneOf(spell);
    if (!model) return [];
    const rounds = Math.min(3, zoneRounds(model.lasts));
    const on = new Set(targets.map((target) => target.id));
    const change = sightChange(state, targets, { extra: [{ light: model.light, on }] });
    return targets.map((target) => {
        const hidden = (change.get(target) ?? 0) * rounds;
        const blind = model.light.level === "bright" && target.lightBlindness && lightAt(state, target).level !== "bright" ? worthOf("blinded", null, { mode: "fixed", value: 1, unit: "rounds" }) + worthOf("dazzled", null, { mode: "fixed", value: rounds, unit: "rounds" }) : 0;
        return target.side === caster.side ? { target, damage: 0, worth: 0, benefit: hidden - blind } : { target, damage: 0, worth: blind - hidden, benefit: 0 };
    });
}

// What an effect's senses and light are worth to the creature it's on, in rounds of its threat, over rounds: its own sight of its foes
// (Darkvision: about half its attacks on a hidden one); the light it sheds — on its foes about it, its side seeing them better; on its own
// side, its foes seeing them better (against it).
export function senseLightBenefit(state, model, target, rounds) {
    let benefit = 0;
    if (model.senses?.length) {
        const foes = state.list.filter((other) => other.side !== target.side && isActive(other));
        if (foes.length) benefit += foes.reduce((sum, foe) => sum + unseenCost(sightDCIn(target, lightAt(state, foe))) - unseenCost(sightDCIn(target, lightAt(state, foe), model.senses)), 0) / foes.length * rounds;
        // (See invisibility — See the Unseen —: an invisible foe concealed to it, not hidden; sight.js.)
        const invisible = (foe) => foe.cond?.hidden && (foe.condSources?.invisible || (foe.permanent ?? []).some((entry) => entry.slug === "invisible"));
        if (foes.length && model.senses.includes("see-invisibility") && !hasSense(target, "see-invisibility")) benefit += foes.filter(invisible).length * (unseenCost(11) - unseenCost(5)) / foes.length * rounds;
    }
    if (model.light?.bright > 0) {
        const lit = state.list.filter((other) => isActive(other) && (other === target || distanceBetween(target, other) <= model.light.bright + (model.light.dim ?? 0)));
        const light = (other) => ({ level: other === target || distanceBetween(target, other) <= model.light.bright ? "bright" : "dim", magical: true, rank: model.light.rank ?? 1 });
        const extra = lit.map((other) => ({ light: light(other), on: new Set([other.id]) }));
        const change = sightChange(state, lit, { extra });
        for (const [other, value] of change) benefit += (other.side === target.side ? value : -value) * rounds;
    }
    return benefit;
}

// L2 in a spell's bright light, at the start of a creature's turn: a light-blind one blinded through its first turn in it and dazzled
// while in it; out of it, no longer dazzled by it.
export function lightTurnStart(state, c, { applyCondition }) {
    if (!c.lightBlindness || !isActive(c)) return;
    const light = lightAt(state, c);
    const bright = light.level === "bright" && light.magical;
    if (bright && !c.lightDazzled) {
        c.lightDazzled = true;
        c.cond.dazzled = true;
        if (!c.lightBlinded) {
            c.lightBlinded = true;
            applyCondition(state, c, "blinded", null, { mode: "fixed", value: 1, unit: "rounds" }, c);
        }
        log(state, `  ${c.name} is in magical light (Light Blindness: dazzled)`);
    } else if (!bright && c.lightDazzled) {
        c.lightDazzled = false;
        if (!(c.permanent ?? []).some((entry) => entry.slug === "dazzled")) c.cond.dazzled = false;
    }
}
