// Danger for its level, in a compendium (2026-10-20, the user: "rank each monster in the compendium based on how dangerous they are for their
// level … a number next to their name in the compendium that we can also sort by"): src/data/danger-ratings.json, written by
// `node tools/deadliest.mjs <run> ratings` — each creature's levels above (or below) the typical creature of its level, against a party of
// four at its level (fighter, rogue, wizard, cleric) fighting to the end, as in the deadliest-creatures study. Pure.
//   data { version, source? ("world": a world's own run, scripts/danger-run.js), generated, fights, party, ratings: { "<compendium id>": { "<actor id>": 2.3 } }, bounds?: { "<compendium id>": { "<actor id>":
//   "above" | "below" } } } — above: deadlier than the ladder's deadliest yardstick (10 levels up), its number an estimate; below: weaker than its
//   weakest (3 levels down), its number the most it could be.

// A set of numbers' stamp: its run (a timestamp), or for older files its date.
export const stampOf = (data) => data?.run ?? data?.generated ?? null;

// The numbers with the creatures rated again on their own (scripts/danger-run.js) laid over them — only those rated on these same numbers
// (alone { base: stamp, entries: { "<compendium id>": { "<actor id>": { value (null: none now), bound, generated, fights, name } } } }).
// The result marks them: aloneOn { "<compendium id>": { "<actor id>": "<date>" } }.
export function withAlone(data, alone) {
    if (!data || !alone?.entries || alone.base !== stampOf(data)) return data;
    const ratings = { ...(data.ratings ?? {}) };
    const bounds = { ...(data.bounds ?? {}) };
    const aloneOn = {};
    for (const [collection, entries] of Object.entries(alone.entries)) {
        ratings[collection] = { ...(ratings[collection] ?? {}) };
        bounds[collection] = { ...(bounds[collection] ?? {}) };
        for (const [id, entry] of Object.entries(entries ?? {})) {
            if (Number.isFinite(entry?.value)) ratings[collection][id] = entry.value;
            else delete ratings[collection][id];
            if (entry?.bound === "above" || entry?.bound === "below") bounds[collection][id] = entry.bound;
            else delete bounds[collection][id];
            (aloneOn[collection] ??= {})[id] = entry?.generated ?? null;
        }
    }
    return { ...data, ratings, bounds, aloneOn };
}

// A creature's rating, or null when it has none (a data slip, a joke creature, one the run didn't reach).
export function ratingOf(data, collection, id) {
    const value = data?.ratings?.[collection]?.[id];
    return Number.isFinite(value) ? value : null;
}

// A creature's (or spell's) rating by its compendium uuid ("Compendium.pf2e.pathfinder-monster-core.Actor.<id>", "….Item.<id>", as PF2e's
// Compendium Browser keeps its entries): { value, bound }, or null.
export function ratingOfUuid(data, uuid) {
    const match = /^Compendium\.(.+)\.(?:Actor|Item)\.([^.]+)$/.exec(String(uuid ?? ""));
    if (!match) return null;
    const value = ratingOf(data, match[1], match[2]);
    return value === null ? null : { value, bound: boundOf(data, match[1], match[2]) };
}

// Whether its number is an estimate past the ladder's top ("above") or the most it could be ("below"), or null.
export function boundOf(data, collection, id) {
    const bound = data?.bounds?.[collection]?.[id];
    return bound === "above" || bound === "below" ? bound : null;
}

// "+2.3", "−0.4", "0.0"; "≈+9.1" past the ladder's top, "≤−5.1" under its foot.
export function dangerLabel(value, bound = null) {
    if (!Number.isFinite(value)) return "";
    const rounded = Math.round(value * 10) / 10;
    const number = rounded === 0 ? "0.0" : `${rounded > 0 ? "+" : "−"}${Math.abs(rounded).toFixed(1)}`;
    return `${bound === "above" ? "≈" : bound === "below" ? "≤" : ""}${number}`;
}

// Its words when hovered: "Fights like a creature 2.3 levels above a typical one of its level (Combat Simulator, 2026-10-20, 100 fights)."
export function dangerTooltip(value, data, bound = null, { alone = undefined } = {}) {
    if (!Number.isFinite(value)) return "";
    const rounded = Math.round(value * 10) / 10;
    const how = rounded === 0 ? "like a typical creature of its level" : `like a creature ${Math.abs(rounded).toFixed(1)} level${Math.abs(rounded) === 1 ? "" : "s"} ${rounded > 0 ? "above" : "below"} a typical one of its level`;
    const run = [data?.source === "world" ? "this world's run" : null, data?.generated, Number(data?.fights) > 0 ? `${data.fights} fights` : null].filter(Boolean).join(", ");
    const note = bound === "above" ? " It's deadlier than any by-the-book creature the scale goes up to, so this is an estimate." : bound === "below" ? " It's weaker than the weakest creature on the scale, so it's at most this." : "";
    const again = alone !== undefined ? ` Rated again on its own${alone ? ` on ${alone}` : ""}.` : "";
    return `Danger for its level: fights ${how}, against a party of four at its level (Combat Simulator${run ? `, ${run}` : ""}).${note}${again}`;
}

// A band for its colour: "high" (+1.5 and up), "up" (+0.5), "even", "down" (−0.5), "low" (−1.5 and below).
export function dangerBand(value) {
    if (!Number.isFinite(value)) return null;
    return value >= 1.5 ? "high" : value >= 0.5 ? "up" : value > -0.5 ? "even" : value > -1.5 ? "down" : "low";
}

// Entries [{ id, name, value, order }] most dangerous first; those with no rating after, in their first order.
export function dangerOrder(entries) {
    return [...entries].sort((a, b) => {
        const rated = Number.isFinite(b.value) - Number.isFinite(a.value);
        if (rated) return rated;
        if (Number.isFinite(a.value) && b.value !== a.value) return b.value - a.value;
        return (a.order ?? 0) - (b.order ?? 0);
    });
}

// PF2e's Compendium Browser's entries ({ name, … }) by danger, as its own sorts go: ascending (the least dangerous first) or descending, ties
// by name; those with no rating after either way, by name. valueOf(entry): its rating or null.
export function sortByDanger(entries, valueOf, { descending = false, compare = (a, b) => a.localeCompare(b) } = {}) {
    const values = new Map(entries.map((entry) => [entry, valueOf(entry)]));
    const byName = (a, b) => compare(String(a.name ?? ""), String(b.name ?? ""));
    const rated = entries.filter((entry) => Number.isFinite(values.get(entry)));
    const unrated = entries.filter((entry) => !Number.isFinite(values.get(entry)));
    rated.sort((a, b) => (descending ? values.get(b) - values.get(a) : values.get(a) - values.get(b)) || byName(a, b));
    return [...rated, ...unrated.sort(byName)];
}

// --- Spells (2026-10-21: src/data/spell-ratings.json, from `node tools/spell-power.mjs <run> ratings`; src/engine/spell-power.js) -------
//   data { version, kind: "spells", run, generated, fights, ratings: { "<compendium id>": { "<item id>": power } }, bounds: { …:
//   "atLeast" | "atMost" }, detail: { …: { rank, boss, group, typical, cantrip?, partial?, ranks: { "<rank>": power }, vs: { "<trait>":
//   power } } } } — power: levels above (or below) the typical spell of its rank; boss, group, typical: how many levels easier one cast makes
//   those fights.

export const powerDetailOf = (data, collection, id) => data?.detail?.[collection]?.[id] ?? null;

// "+0.8"; "≥+6.0" when it eased fights past the scale's easiest (at least that), "≤−2.0" when it made them harder than its hardest.
export function powerLabel(value, bound = null) {
    if (!Number.isFinite(value)) return "";
    return `${bound === "atLeast" ? "≥" : bound === "atMost" ? "≤" : ""}${dangerLabel(value)}`;
}

const ordinal = (n) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;
const levels = (value) => `${Math.abs(Math.round(value * 10) / 10).toFixed(1)} level${Math.abs(Math.round(value * 10) / 10) === 1 ? "" : "s"}`;

// Its words when hovered: how it compares with the typical spell of its rank, what one cast does to each fight, its heightened ranks that
// differ by half a level or more, and the traits it does more against.
export function powerTooltip(value, data, bound = null, detail = null) {
    if (!Number.isFinite(value)) return "";
    const rank = detail?.rank ?? 1;
    const what = detail?.cantrip ? `a typical cantrip at rank ${rank}` : `a typical rank-${rank} spell`;
    const rounded = Math.round(value * 10) / 10;
    const how = rounded === 0 ? `about as strong as ${what}` : `${levels(rounded)} ${rounded > 0 ? "stronger" : "weaker"} than ${what}`;
    const eases = (amount) => (amount >= 0 ? `${levels(amount)} easier` : `${levels(amount)} harder`);
    const fights = detail && Number.isFinite(detail.boss) && Number.isFinite(detail.group)
        ? ` ${detail.cantrip ? "Cast at will" : "One cast"} by the wizard of a party of four at level ${2 * rank - 1} makes a fight with a boss ${eases(detail.boss)} and one with a group ${eases(detail.group)}${Number.isFinite(detail.typical) ? ` (${what}: ${eases(detail.typical)} on average)` : ""}.`
        : "";
    const run = [data?.generated, Number(data?.fights) > 0 ? `${data.fights} fights` : null].filter(Boolean).join(", ");
    const note = bound === "atLeast" ? " It eased fights past the scale's easiest, so it's at least this." : bound === "atMost" ? " It made fights harder than the scale's hardest, so it's at most this." : "";
    const heightened = Object.entries(detail?.ranks ?? {}).map(([at, power]) => [Number(at), Number(power)]).filter(([, power]) => Number.isFinite(power));
    const differ = heightened.filter(([, power]) => Math.abs(power - value) >= 0.5);
    const higher = heightened.length ? (differ.length ? ` Heightened: ${differ.map(([at, power]) => `${ordinal(at)} ${dangerLabel(power)}`).join(", ")}.` : " Heightened: within half a level of this at every rank.") : "";
    const against = Object.entries(detail?.vs ?? {}).filter(([, power]) => Number.isFinite(power)).map(([trait, power]) => ` Against ${trait}: ${dangerLabel(power)}.`).join("");
    const partial = detail?.partial ? " Partly simulated: the simulator doesn't play all of it." : "";
    return `Power for its rank: ${how} (Combat Simulator${run ? `, ${run}` : ""}).${fights}${note}${higher}${against}${partial}`;
}

