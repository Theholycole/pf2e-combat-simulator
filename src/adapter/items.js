// S22, scrolls, wands and staves (the user: "can we get the simulator to treat scrolls, wands and staffs as spells the creature
// can cast?"): what the snapshot and the bestiary tools read from them, without Foundry.

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

// U1 (2026-10-15), consumables. The user: "monsters should use their items freely. Players should use rechargeable or reusable items
// freely but consumables should be weighted to be used when they provide significant more value than other options. Healing items
// should be used freely if they are projected to go down soon or if they are used on another player that is already down."
// The item module's plan for one (plan.item: its category, level, uses, who it's for) as an action the creature can take: drunk by it or
// fed to a creature beside it, thrown, used. A stack's uses are its pool. null: one the simulator leaves to the table — a snare (set up
// beforehand), a poison put on a weapon, ammunition, a cast (the spell module's) or a note with nothing a fight plays.
// draw: the actions to have it in hand (PF2e's: none held, 1 Interact worn, more stowed); fresh: after a rest (a reusable item's uses back).
const DRUNK_OR_APPLIED = ["potion", "elixir", "mutagen", "drug", "oil"];
export function itemEntry(plan, { id, name = null, quantity = 1, uses = null, draw = 0, fresh = false } = {}) {
    if (!plan?.resolution || plan.builtin || plan.noteOnly) return null;
    const item = plan.item ?? {};
    if (item.delivery === "injury" || ["snare", "ammo", "ammunition"].includes(item.category)) return null;
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
    const activation = { ...(plan.activation ?? {}), time: plan.activation?.time ?? own?.time ?? null, traits: [...new Set([...(plan.activation?.traits ?? []), ...(own?.traits ?? [])])] };
    // (Drunk: by the user or a creature beside it, fed to it.)
    const fitted = { ...plan, activation, ...(drinker ? { targeting: { ...(plan.targeting ?? {}), target: "1 willing creature", range: "touch" } } : {}) };
    return {
        name: name ?? plan.source?.name ?? "Item",
        plan: fitted,
        castRank: Math.max(1, Number(item.level) || 1),
        dc: null,
        attack: null,
        pool: `item:${id}`,
        casts,
        kind: "item",
        item: id,
        category: item.category ?? null,
        consumable: !reusable,
        ...(drinker ? { drinker: true } : {}),
        ...(draw > 0 ? { draw: { actions: draw, each: !reusable } } : {})
    };
}
