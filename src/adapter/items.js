// S22, scrolls, wands and staves (the user: "can we get the simulator to treat scrolls, wands and staffs as spells the creature
// can cast?"): what the snapshot and the bestiary tools read from them, without Foundry.

import { zoneSpell } from "../engine/zones.js";

// The consumables PF2e casts a spell from.
export const SPELL_ITEMS = Object.freeze(["scroll", "wand", "spell-gem"]);

// Trick Magic Item's skill for each tradition.
export const TRICK_SKILLS = Object.freeze({ arcane: "arcana", divine: "religion", occult: "occultism", primal: "nature" });

// Its casts left: every use of the stack (a scroll or a spell gem, one each; a wand, one a day). After a rest (fresh) a wand has
// its uses back; a scroll used is gone.
export function itemCasts({ category, quantity = 1, uses = null, fresh = false }) {
    const count = Math.max(0, Number(quantity ?? 1) || 0);
    if (!count) return 0;
    const max = Math.max(1, Number(uses?.max) || 1);
    if (fresh && category === "wand") return count * max;
    const value = Number.isFinite(Number(uses?.value)) ? Math.max(0, Math.min(max, Number(uses.value))) : max;
    return (count - 1) * max + value;
}

// The skills Trick Magic Item can use on an item (its traditions and its spell's, as PF2e has them).
export function trickSkills(traditions = []) {
    return [...new Set(traditions.map((tradition) => TRICK_SKILLS[tradition]).filter(Boolean))];
}

// A staff, as PF2e Dailies has it: a magical weapon with the staff trait, or equipment with the staff and coda traits.
export function isStaffItem({ type, traits = [], magical = false }) {
    return traits.includes("staff") && (type === "weapon" || (type === "equipment" && traits.includes("coda"))) && magical;
}

// A staff's charges without PF2e Dailies: the creature's highest spell rank (a slot it has, from its prepared or spontaneous
// spellcasting, no higher than half its level rounded up). 0: it can't prepare a staff.
export function staffCharges(slotSets = [], level = 1) {
    const limit = Math.min(10, Math.max(1, Math.ceil((Number(level) || 1) / 2)));
    let charges = 0;
    for (const slots of slotSets) {
        for (let rank = 1; rank <= limit; rank++) if ((Number(slots?.[`slot${rank}`]?.max) || 0) > 0) charges = Math.max(charges, rank);
    }
    return charges;
}

const UUID = /@(uuid|compendium)\[([a-z0-9._-]+)\]/gi;
const strip = (html) => String(html ?? "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");

// A staff's spells from its description, as PF2e Dailies reads them: its last list, a line per rank ("Cantrip", "1st", "2nd"…) and
// the spells linked in it; none above maxRank. [{ rank, uuid }], rank 0 for a cantrip.
export function staffSpellList(html, maxRank = 10) {
    const lists = [...String(html ?? "").matchAll(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi)];
    const list = lists.at(-1)?.[1];
    if (!list) return [];
    const out = [];
    for (const [, line] of list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        const text = strip(line);
        const label = text.split("@")[0];
        const rank = Number(/\d+/.exec(label)?.[0] ?? 0);
        if (rank > maxRank) continue;
        for (const match of text.matchAll(UUID)) out.push({ rank, uuid: match[1].toLowerCase() === "compendium" ? `Compendium.${match[2]}` : match[2] });
    }
    return out;
}

const DRUNK_OR_APPLIED = ["potion", "elixir", "mutagen", "drug", "oil"];

// U1 (2026-10-15), consumables. The user: "monsters should use their items freely. Players should use rechargeable or reusable items
// freely but consumables should be weighted to be used when they provide significant more value than other options. Healing items
// should be used freely if they are projected to go down soon or if they are used on another player that is already down."
// The item module's plan for one (plan.item: its category, level, uses, who it's for) as an action the creature can take: drunk by it or
// fed to a creature beside it, thrown, used. A stack's uses are its pool. null: one the simulator leaves to the table — a snare (set up
// beforehand), a poison put on a weapon, an ingested or contact poison, a drug, ammunition or a note with nothing a fight plays.
// draw: the actions to have it in hand (PF2e's: none held, 1 Interact worn, more stowed); fresh: after a rest (a reusable item's uses back).
// cast (U3): for an item that casts a spell (Invisibility Potion), { plan, castRank, dc, attack } — the spell module's plan for the spell,
// which the caller compiles: the item casts it, at its rank, as it's drunk or used.
// onStrike (U4): an injury poison a creature's Strike lists among its attack effects ("plus lethargy poison"): delivered free by a hit with it,
// a dose a hit, as the stat block has it.
// zone (U5): for an item that makes a lasting area (a smoke ball's cloud, a cryomister's ice), the models of the PF2e effects it applies,
// { effectModel, effects }: the simulation's zone, as an ability's (zones.js), thrown where it's worth it.
export function itemEntry(plan, { id, name = null, quantity = 1, uses = null, draw = 0, fresh = false, cast = null, onStrike = null, zone = null } = {}) {
    if (plan?.builtin === "zone") return zoneEntry(plan, { id, name, quantity, uses, draw, fresh, zone });
    // (One of the user's own Strikes with riders added — Fear Gem, plan.strike: not yet.)
    if (plan?.strike) return null;
    const casting = plan?.builtin === "cast-spell" && cast?.plan?.resolution ? cast : null;
    if (!casting && (!plan?.resolution || plan.builtin || plan.noteOnly)) return null;
    const item = plan.item ?? {};
    const coated = item.delivery === "injury" && onStrike ? onStrike : null;
    if ((item.delivery === "injury" && !coated) || ["snare", "ammo", "ammunition"].includes(item.category)) return null;
    // (An ingested or contact poison, or a drug: eaten, touched or taken by its user, not a fight's action.)
    if (["ingested", "contact"].includes(item.delivery) || item.category === "drug") return null;
    const reusable = (uses?.autoDestroy ?? item.uses?.autoDestroy) === false;
    // (Hundreds of uses are a stock's doses — black powder's for firearms — not activations: a keg explodes once.)
    const stock = Number(uses?.max ?? item.uses?.max) || 1;
    const max = stock > 20 ? 1 : Math.max(1, stock);
    const left = stock > 20 ? undefined : uses?.value;
    const casts = itemCasts({ category: reusable ? "wand" : "consumable", quantity, uses: { max, value: left }, fresh: reusable && fresh });
    if (!casts) return null;
    const drinker = item.recipient === "drinker";
    // (Its own Activate line's cost and traits — "Activate [one-action] (manipulate)": a manipulate action provokes. A copy whose text has
    // none, a bestiary creature's short one: PF2e's usual Activate for what's drunk or applied.)
    const own = item.activations?.[0] ?? (DRUNK_OR_APPLIED.includes(item.category) ? { time: "1", traits: ["manipulate"] } : null);
    // (A cast takes the item's activation, not the spell's casting.)
    const base = casting ? { ...casting.plan, item } : plan;
    const activation = casting
        ? { ...(base.activation ?? {}), time: own?.time ?? base.activation?.time ?? null, traits: [...(own?.traits ?? [])] }
        : { ...(plan.activation ?? {}), time: plan.activation?.time ?? own?.time ?? null, traits: [...new Set([...(plan.activation?.traits ?? []), ...(own?.traits ?? [])])] };
    // (Drunk: by the user or a creature beside it, fed to it. A cast "on you" that isn't drunk: on the user.)
    const targeting = drinker ? { ...(base.targeting ?? {}), target: "1 willing creature", range: "touch" } : casting && plan.self ? { ...(base.targeting ?? {}), target: "self", range: null } : null;
    const fitted = coated
        ? { ...base, activation, trigger: { ...(base.trigger ?? {}), event: "strike", attackEffect: coated, cost: "free" } }
        : { ...base, activation, ...(targeting ? { targeting } : {}) };
    return {
        name: name ?? plan.source?.name ?? "Item",
        plan: fitted,
        castRank: casting ? Math.max(1, Number(casting.castRank) || 1) : Math.max(1, Number(item.level) || 1),
        dc: casting?.dc ?? null,
        attack: casting?.attack ?? null,
        pool: `item:${id}`,
        casts,
        kind: "item",
        item: id,
        category: item.category ?? null,
        consumable: !reusable,
        ...(drinker ? { drinker: true } : {}),
        ...(draw > 0 && !coated ? { draw: { actions: draw, each: !reusable } } : {})
    };
}

// (U5: a lasting area: the ability zone (zoneSpell) as one of its items — its stack, its draw, its own activation. Not a snare, set up
// beforehand.)
function zoneEntry(plan, { id, name, quantity, uses, draw, fresh, zone }) {
    const item = plan.item ?? {};
    if (["snare", "ammo", "ammunition"].includes(item.category) || plan.zone?.once) return null;
    const label = name ?? plan.source?.name ?? "Item";
    const spell = zoneSpell(label, plan, zone ?? {});
    if (!spell) return null;
    const reusable = (uses?.autoDestroy ?? item.uses?.autoDestroy) === false;
    const casts = itemCasts({ category: reusable ? "wand" : "consumable", quantity, uses: { max: Math.max(1, Number(uses?.max ?? item.uses?.max) || 1), value: uses?.value }, fresh: reusable && fresh });
    if (!casts) return null;
    const own = item.activations?.[0] ?? null;
    const activation = { ...(spell.plan.activation ?? {}), time: own?.time ?? spell.plan.activation?.time ?? "1", traits: [...(own?.traits ?? [])] };
    return {
        ...spell,
        plan: { ...spell.plan, activation },
        castRank: Math.max(1, Number(item.level) || 1),
        pool: `item:${id}`,
        casts,
        kind: "item",
        item: id,
        category: item.category ?? null,
        consumable: !reusable,
        ...(draw > 0 ? { draw: { actions: draw, each: !reusable } } : {})
    };
}

// The Interact actions to have an item in hand (the user, 2026-10-15: "Worn items take an action to take out"): none held, 1 worn, PF2e's
// retrieve cost stowed (retrieve). U6, a belt (Adventures+'s variant rule, the user's: a worn belt holds up to four consumables of light
// Bulk, drawn with an Interact as a free action): none for those in it (belted).
export function drawActions({ carryType = "worn", stowed = false, retrieve = 1, belted = false } = {}) {
    if (carryType === "held" || belted) return 0;
    return stowed ? Math.max(1, Number(retrieve) || 1) : 1;
}

// Whether a container is that belt: worn, and named "Belt" (not PF2e's Belt Pouch, whose items take an Interact as any container's).
export function isBelt({ name = "", carryType = null } = {}) {
    return carryType === "worn" && /^\s*belt\b/i.test(String(name)) && !/\bpouch\b/i.test(String(name));
}

// The items a belt holds within easy reach: its first four consumables of light Bulk or less ({ id, bulk, consumable } in the belt's order).
export function beltHeld(contents = []) {
    return contents.filter((entry) => entry.consumable && (Number(entry.bulk) || 0) <= 0.1).slice(0, 4).map((entry) => entry.id);
}
