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
