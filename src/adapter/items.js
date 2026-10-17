// S22, scrolls, wands and staves (the user: "can we get the simulator to treat scrolls, wands and staffs as spells the creature
// can cast?"): what the snapshot and the bestiary tools read from them, without Foundry.

import { zoneSpell } from "../engine/zones.js";
import { lastingRounds } from "../engine/lasting.js";
import { RUNE_LOANS, runeLoanKey } from "../engine/runes.js";

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
// (U10: the resolution of an item that only counteracts: nothing more, its counteract played beside it.)
const NOTHING = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
const COUNTERACT_ONLY = Object.freeze({ kind: "check", check: { roll: "automatic" }, outcomes: { criticalSuccess: NOTHING, success: NOTHING, failure: NOTHING, criticalFailure: NOTHING } });

// (U15: a retaliation potion's damage — the item module's plan.retaliation, its sharedDamage: "1", "2d4", "3d6+2" — as dice, a minute;
// from the moderate grade, plan.retaliation.adjacentMelee: "or is adjacent to you and hits you with a melee weapon strike". null: none read.)
function retaliationOf(plan) {
    const parts = (plan.resolution?.sharedDamage?.components ?? []).map((component) => {
        const match = String(component.formula ?? "").replace(/\s+/g, "").match(/^(?:(\d+)d(\d+))?(?:\+?(\d+))?$/);
        return match && (match[1] || match[3]) && component.type ? { dice: Number(match[1]) || 0, die: Number(match[2]) || 0, bonus: Number(match[3]) || 0, type: component.type } : null;
    });
    if (!parts.length || parts.some((part) => !part)) return null;
    return { parts, adjacentMelee: Boolean(plan.retaliation?.adjacentMelee), rounds: Number(plan.retaliation?.rounds) || 10 };
}

// (2026-10-16: an item activated in answer to something — its Activate's "Trigger You successfully Trip a foe" (Wolf Fang), "You lose
// the Dying condition" (Snarling Badger) — whose plan doesn't say so (trigger.event "use", the plan read without its trigger): not an
// action to take at will. Those the simulation plays have their own paths — Lion Badge's, the roll-twice talismans', a plan whose trigger
// is kept (Rhino Hide Brooch's "damaged"). Only its Activate's own Trigger, before the text's first rule: a reaction an item grants
// (Prey Mutagen's Timely Dodge) has one further down, and the item is still drunk.)
export const hasTrigger = (html) => /<strong>\s*Trigger\s*<\/strong>/i.test(String(html ?? "").split(/<hr\b/i)[0]);

// U22 (2026-10-16; the item module's compileBomb): a bomb's riders on a hit — "On a hit, the target becomes off-guard until the start of your
// next turn", Frost Vial's Speed penalty, Atrophy Bomb's enfeebled — as a free rider of the bomb's Strike (spells.js triggerRiders), its
// degree the Strike's. null when it has none: PF2e's own Strike deals the damage, persistent damage and splash. Its save (a bomb that
// blinds on a failed save) isn't played yet.
export function bombRider(plan, strikeName) {
    const rows = plan?.resolution?.outcomes ?? {};
    const does = (row) => (row?.effects ?? []).length || (row?.modifiers ?? []).length;
    if (!strikeName || (!does(rows.success) && !does(rows.criticalSuccess))) return null;
    // (Who it's for, plan.item.riderOnly: "void-healing" — Ghost Charge's enfeebled, undead and void-healing creatures —, "living" — Tallow
    // Bomb's sickened, not undead or constructs.)
    return { name: plan.source?.name ?? strikeName, plan: { ...plan, trigger: { ...(plan.trigger ?? {}), event: "strike", cost: "free", strikes: [String(strikeName).toLowerCase()] } }, castRank: 1, pool: null, kind: "ability", bombRider: true, ...(plan.item?.riderOnly ? { riderOnly: plan.item.riderOnly } : {}) };
}

// U21 (2026-10-16): the triggers the simulation plays, by the item module's triggerOn event; an item for one is its entry with triggerOn,
// kept apart from the creature's actions (c.triggeredItems, triggered-items.js). Only one that acts on the creature its trigger names (a
// save or a check at it): an Effect its user puts on itself (Bloodseeker Beak's on the Strike's damage) isn't read yet.
const PLAYED_TRIGGERS = new Set(["after-strike"]);
export function itemTriggered(plan, options = {}) {
    const on = plan?.item?.activations?.[0]?.triggerOn;
    if (!PLAYED_TRIGGERS.has(on?.event) || plan.builtin || !["save", "check"].includes(plan.resolution?.kind)) return null;
    if (!/\bcreature\b/i.test(String(plan.targeting?.target ?? ""))) return null;
    // (A row that does something played: not Grinning Pugwampi's misfortune, a GM's instruction for now.)
    const does = (row) => (row?.damage?.mode ?? "none") !== "none" || ["effects", "nativeEffects", "modifiers"].some((part) => (row?.[part] ?? []).length);
    if (!Object.values(plan.resolution.outcomes ?? {}).some(does)) return null;
    const entry = itemEntry(plan, { ...options, triggered: false });
    return entry ? { ...entry, triggerOn: { ...on } } : null;
}

// (2026-10-16: the item module's damageChoices — Explosive Missive's "4d6 acid, cold, electricity, fire or sonic" — when they differ only in
// their type, as the core's own damage-type choice (resolution.native.damageTypeChoices), which the simulation answers with the type its
// targets mind most. Choices of other dice (Moonlit Spellgun's at night or not) stay the plan's own, its first.)
function withTypeChoices(plan) {
    const choices = plan?.damageChoices ?? [];
    const components = plan?.resolution?.sharedDamage?.components ?? [];
    if (choices.length < 2 || components.length !== 1) return plan;
    const read = choices.map((choice) => /^(.+)\[([a-z-]+)\]$/.exec(String(choice.formula ?? "").replace(/\s+/g, "")));
    if (read.some((match) => !match) || new Set(read.map((match) => match[1])).size !== 1) return plan;
    const types = [...new Set(read.map((match) => match[2]))];
    const [component] = components;
    return {
        ...plan,
        resolution: {
            ...plan.resolution,
            sharedDamage: { ...plan.resolution.sharedDamage, components: [{ ...component, formula: `${read[0][1]}[untyped]`, type: null }] },
            native: { ...(plan.resolution.native ?? {}), damageTypeChoices: { ...(plan.resolution.native?.damageTypeChoices ?? {}), [component.id]: types } }
        }
    };
}

const resistOf = (item) => (item?.resist ?? []).flatMap((entry) => {
    const value = Number(entry.value) || 0;
    const choose = (entry.choose ?? []).filter((type) => typeof type === "string");
    if (!(value > 0) || entry.type === "custom" || (!entry.type && !choose.length)) return [];
    return [{ ...(entry.type ? { type: entry.type } : { choose }), value, rounds: lastingRounds(entry.duration).rounds }];
});

// (2026-10-16: the item module's plan.item.strikeDamage — Martial Mayhem Mutagen's "your melee Strikes deal 1d4 additional precision damage to
// off-guard creatures", its predicate ["item:melee", "target:condition:off-guard"] — as extra damage parts on its user's Strikes for its
// duration: { parts: [{ dice, die, bonus, type, precision, persistent, whenOffGuard }], melee, ranged, rounds }. An entry whose predicate
// says more than these isn't read.)
const STRIKE_PREDICATES = new Set(["item:melee", "item:ranged", "target:condition:off-guard"]);
function strikeDamageOf(item) {
    return (item?.strikeDamage ?? []).flatMap((entry) => {
        const predicate = entry.predicate ?? [];
        if (predicate.some((term) => typeof term !== "string" || !STRIKE_PREDICATES.has(term))) return [];
        const dice = Number(entry.diceNumber) || 0;
        const die = Number(String(entry.dieSize ?? "").replace(/^d/, "")) || 0;
        const bonus = Number(entry.value) || 0;
        if (!(dice && die) && !bonus) return [];
        return [{ parts: [{ dice: dice && die ? dice : 0, die: dice && die ? die : 0, bonus: dice && die ? 0 : bonus, multiplier: 1, type: entry.damageType ?? null, precision: entry.category === "precision", persistent: entry.category === "persistent", ...(predicate.includes("target:condition:off-guard") ? { whenOffGuard: true } : {}) }],
            melee: !predicate.includes("item:ranged"), ranged: !predicate.includes("item:melee"), rounds: lastingRounds(entry.duration).rounds }];
    });
}

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
export function itemEntry(plan, { id, name = null, quantity = 1, uses = null, draw = 0, fresh = false, cast = null, onStrike = null, zone = null, triggered = false } = {}) {
    if (triggered && [undefined, null, "use"].includes(plan?.trigger?.event) && !onStrike) return null;
    if (plan?.builtin === "zone") return zoneEntry(plan, { id, name, quantity, uses, draw, fresh, zone });
    plan = withTypeChoices(plan);
    // (U17: an item used as part of one of PF2e's actions — the item module's plan.action, the Alchemists+ plants' Shove and Grapple: that
    // action's own plan (the ability module's), at the higher of its user's skill and the item's value (action.minimum), with the item's
    // bonus (action.bonus) or another skill (action.statistic). A choice of actions, not yet.)
    let itemAction = null;
    if (plan?.builtin === "item-action") {
        const action = plan.action ?? {};
        if ((action.slugs?.length ?? 0) > 1 || !action.basic?.resolution?.check || action.basic.builtin) return null;
        const check = action.statistic ? { ...action.basic.resolution.check, statistic: action.statistic } : action.basic.resolution.check;
        // (2026-10-17: action.minimum.ownBonus — Greater Ravenous Flytrap's +2 item to the user's own Athletics when that's the higher.)
        itemAction = { slug: action.slug, ...(action.minimum ? { minimum: { value: Number(action.minimum.value) || 0, skill: action.minimum.skill, ...(Number(action.minimum.ownBonus?.value) ? { ownBonus: Number(action.minimum.ownBonus.value) } : {}) } } : {}), ...(action.bonus?.value ? { bonus: Number(action.bonus.value) || 0 } : {}) };
        plan = { ...action.basic, source: plan.source, item: plan.item, builtin: undefined, resolution: { ...action.basic.resolution, check } };
    }
    // (U10: an item that only counteracts — Surging Serum, Panacea: nothing of its own on the drinker, its counteract the item's rider below.)
    const counteractOnly = plan?.builtin === "counteract" && Boolean(plan.item?.counteract);
    if (counteractOnly) plan = { ...plan, builtin: undefined, resolution: COUNTERACT_ONLY };
    // (U15: a retaliation potion — nothing at once on the drinker, its damage kept for whoever touches it, spells.js touchRetaliation.)
    const retaliation = plan?.retaliation ? retaliationOf(plan) : null;
    if (plan?.retaliation && !retaliation) return null;
    if (retaliation) plan = { ...plan, resolution: COUNTERACT_ONLY, targeting: { target: "the drinker", range: null, area: null } };
    // (U16: an oil lending its user's weapon a property rune for a while — plan.item.rune: one the simulator knows (runes.js RUNE_LOANS),
    // on its user, nothing else at once; another, left out.)
    const rune = plan?.item?.rune ? { key: runeLoanKey(plan.item.rune.key), name: plan.item.rune.name ?? plan.item.rune.key, rounds: lastingRounds(plan.item.rune.duration).rounds } : null;
    if (rune && !RUNE_LOANS[rune.key]) return null;
    if (rune) plan = { ...plan, resolution: COUNTERACT_ONLY, targeting: { target: "self", range: null, area: null } };
    // (One of the user's own Strikes with riders added — Fear Gem, plan.strike: not yet.)
    if (plan?.strike) return null;
    const casting = plan?.builtin === "cast-spell" && cast?.plan?.resolution ? cast : null;
    // (U13: a note-only item that lowers a condition — Serene Smelling Salts: its reduction is what's played.)
    const extras = Boolean(plan?.item?.reduce?.length || plan?.item?.recovery?.types?.length);
    if (!casting && (!plan?.resolution || plan.builtin || (plan.noteOnly && !extras))) return null;
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
    // (U10: one that only counteracts goes on whoever it's used on, as a drink does — Salve of Antiparalysis, an oil, applied.)
    // (U13: one for the creatures it names, "targets", whose plan names no number of them — Therapeutic Snap Peas: one, as a drink is,
    // until the plan says how many.)
    const named = Boolean(plan.targeting?.range || plan.targeting?.area) || /\b(?:creature|ally|allies|target|enemy|foe)s?\b/i.test(String(plan.targeting?.target ?? "").replace(/\bthe drinker\b/i, ""));
    // (U16: a lent rune is on its user's own weapon.)
    const drinker = !rune && (item.recipient === "drinker" || counteractOnly || (item.recipient === "targets" && !named));
    // (U13: one that lowers its user's own condition and names no target — Pepper Poultice: on its user.)
    const onUser = item.recipient === "user" && Boolean(item.reduce?.length) && !named && !(plan.resolution?.applications ?? []).length;
    // (Its own Activate line's cost and traits — "Activate [one-action] (manipulate)": a manipulate action provokes. A copy whose text has
    // none, a bestiary creature's short one: PF2e's usual Activate for what's drunk or applied.)
    const own = item.activations?.[0] ?? (DRUNK_OR_APPLIED.includes(item.category) ? { time: "1", traits: ["manipulate"] } : null);
    // (A cast takes the item's activation, not the spell's casting.)
    const base = casting ? { ...casting.plan, item } : plan;
    const activation = casting
        ? { ...(base.activation ?? {}), time: own?.time ?? base.activation?.time ?? null, traits: [...(own?.traits ?? [])] }
        : { ...(plan.activation ?? {}), time: plan.activation?.time ?? own?.time ?? null, traits: [...new Set([...(plan.activation?.traits ?? []), ...(own?.traits ?? [])])] };
    // (Drunk: by the user or a creature beside it, fed to it. A cast "on you" that isn't drunk: on the user.)
    const targeting = drinker ? { ...(base.targeting ?? {}), target: "1 willing creature", range: "touch" } : (casting && plan.self) || onUser ? { ...(base.targeting ?? {}), target: "self", range: null } : null;
    // (U14: an attack its user makes with its own attack — a spellgun's, "a spell attack roll or a firearm attack roll": an attack, the
    // creature's better one set as the fight is prepared, consumables.js ownAttacks.)
    const ownAttack = plan.ownCheck?.kind === "attack" && !Number.isFinite(plan.ownCheck.modifier) ? [...(plan.ownCheck.choose ?? ["spell", "firearm"])] : null;
    // (U19: a save against its owner's own DC — PF2e's "against:class-spell", the item module's check.against { dc: "owner", statistic },
    // or a cast at it, plan.ownerDC: "class", "spell" or "class-spell", set as the fight is prepared, consumables.js ownerDCs.)
    const ownerDC = plan.ownerDC ?? (plan.resolution?.check?.against?.dc === "owner" ? plan.resolution.check.against.statistic ?? "class-spell" : null);
    const fitted = coated
        ? { ...base, activation, trigger: { ...(base.trigger ?? {}), event: "strike", attackEffect: coated, cost: "free" } }
        : { ...base, activation, ...(targeting ? { targeting } : {}), ...(ownAttack ? { traits: [...new Set([...(base.traits ?? []), "attack"])] } : {}) };
    return {
        name: name ?? plan.source?.name ?? "Item",
        plan: fitted,
        // (U18: the item module's Generic Spellgun — a spell's rows heightened to the rank picked, plan.rank: played at that rank.)
        castRank: casting ? Math.max(1, Number(casting.castRank) || 1) : plan.spellgun?.spell ? Math.max(1, Number(plan.rank) || 1) : Math.max(1, Number(item.level) || 1),
        dc: casting?.dc ?? null,
        attack: casting?.attack ?? null,
        pool: `item:${id}`,
        casts,
        kind: "item",
        item: id,
        category: item.category ?? null,
        consumable: !reusable,
        ...(drinker ? { drinker: true } : {}),
        ...(ownAttack ? { ownAttack } : {}),
        ...(ownerDC ? { ownerDC } : {}),
        ...(draw > 0 && !coated ? { draw: { actions: draw, each: !reusable } } : {}),
        // (U10: its counteract check — the item module's plan.item.counteract, beside a plan of its own or alone.)
        ...(item.counteract ? { counteract: { ...item.counteract } } : {}),
        // (U13: the conditions it lowers — on whoever it's used on for a drink or one for others ("targets"), else on its user.)
        ...(item.reduce?.length ? { reduce: item.reduce.map((entry) => ({ ...entry, on: drinker || entry.who === "targets" ? "targets" : "user" })) } : {}),
        ...(retaliation ? { retaliation } : {}),
        ...(rune ? { rune } : {}),
        ...(itemAction ? { itemAction } : {}),
        ...(strikeDamageOf(item).length ? { strikeDamage: strikeDamageOf(item) } : {}),
        // (2026-10-17: the item module's plan.item.resist — Potion of Resistance's "resistance 5 to acid, cold, electricity, fire or sonic",
        // Maelstromic Destabilizer's spirit: [{ type | choose, value, rounds }]; a custom one, against some creatures only, not yet.)
        ...(resistOf(item).length ? { resist: resistOf(item) } : {}),
        // (2026-10-16: the item module's plan.item.restore — Elixir of Rejuvenation: all its Hit Points, its afflictions of that level or lower gone.)
        ...(item.restore ? { restore: { hp: item.restore.hp === "max" ? "max" : null, afflictionLevel: Number.isFinite(Number(item.restore.afflictions?.level)) ? Number(item.restore.afflictions.level) : null } } : {}),
        // (U12: a flat check to end persistent damage of its types at once — Quenching Potion's — used freely, the user's call.)
        ...(item.recovery?.types?.length ? { recovery: { types: [...item.recovery.types], dc: Number(item.recovery.dc) || 15 }, free: true } : {})
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

// U7 (2026-10-15; the user: "Work on the fear gem so it works in the simulator"): an item used by Striking (Fear Gem's plan.strike): one
// of its user's own Strikes (melee, ranged or either, as it says) with the item's riders on a hit and on a critical hit, and a save for the
// creature hit when it has one — a Strike activity, as Intimidating Strike is, the item's stack its pool. A feat that raises the item's
// condition (FEAT_BOOSTS: Fear Gem with Intimidating Strike, frightened 1 more) when the user has it (feats: its slugs). null: not that kind
// of item, none left, or a rider the activity can't carry.
const FEAT_BOOSTS = Object.freeze({ "fear-gem": { feat: "intimidating-strike", slug: "frightened", by: 1 } });
// ammunition: the weapons' ammo base types it fits when the plan doesn't say (an ammo item's PF2e system.craftableAs, "sling-bullets").
export function itemStrikeActivity(plan, { id, name = null, quantity = 1, uses = null, fresh = false, feats = [], ammunition = null } = {}) {
    if (!plan?.strike || !plan.resolution?.outcomes) return null;
    // (2026-10-17: what a hit does only in words — Magekiller Bullet's curse, strike.fromNotes —: the GM's, not played.)
    if (plan.strike.fromNotes) return null;
    // (Extras on the Strike itself — an attack bonus, an alteration: not yet, so not played without them. 2026-10-17: more damage dice —
    // Shatterpoint Ammunition's persistent sonic — added to its damage, when they're plain dice or a number of a type.)
    if (plan.strike.attack || plan.strike.alteration) return null;
    const extraDamage = (plan.strike.damage ?? []).map((entry) => {
        const dice = Number(entry.diceNumber) || 0;
        const die = Number(String(entry.dieSize ?? "").replace(/^d/, "")) || 0;
        const bonus = Number(entry.value) || 0;
        if (!entry.damageType || (!(dice && die) && !bonus) || ![null, undefined, "persistent", "precision"].includes(entry.category)) return null;
        return { dice: dice && die ? dice : 0, die: dice && die ? die : 0, bonus: dice && die ? 0 : bonus, multiplier: 1, type: entry.damageType, persistent: entry.category === "persistent", precision: entry.category === "precision" };
    });
    if (extraDamage.some((part) => !part)) return null;
    const item = plan.item ?? {};
    const reusable = (uses?.autoDestroy ?? item.uses?.autoDestroy) === false;
    const casts = itemCasts({ category: reusable ? "wand" : "consumable", quantity, uses: { max: Math.max(1, Number(uses?.max ?? item.uses?.max) || 1), value: uses?.value }, fresh: reusable && fresh });
    if (!casts) return null;
    const boost = FEAT_BOOSTS[plan.source?.slug];
    const raised = boost && feats.includes(boost.feat) ? boost : null;
    // (A hit's riders: its conditions only — anything else on the row and the item isn't played.)
    const riders = (row) => {
        if (!row) return [];
        if ((row.modifiers ?? []).length || (row.nativeEffects ?? []).length || (row.damage && row.damage.mode !== "none")) return null;
        const effects = row.effects ?? [];
        if (effects.some((effect) => effect.kind !== "condition")) return null;
        return effects.map(({ slug, value, duration }) => ({ slug, value: Number.isFinite(value) && raised?.slug === slug ? value + raised.by : value ?? null, duration: duration ?? null }));
    };
    const { success, criticalSuccess } = plan.resolution.outcomes;
    const onHit = riders(success);
    const onCritical = riders(criticalSuccess ?? success);
    if (!onHit || !onCritical) return null;
    // (A push on a hit — Battering Ammunition's 5 feet — the activity's own push; another forced movement isn't played.)
    const pushOf = (row) => (row?.forcedMovement ? (row.forcedMovement.kind === "push" && Number(row.forcedMovement.distance) > 0 ? Number(row.forcedMovement.distance) : NaN) : null);
    const push = pushOf(success);
    const criticalPush = pushOf(criticalSuccess ?? success);
    if (Number.isNaN(push) || Number.isNaN(criticalPush)) return null;
    const own = item.activations?.[0] ?? null;
    const save = plan.strike.save?.resolution ? plan.strike.save : null;
    // (2026-10-16: PF2e's roll options on its Strike — Sniper's Bead's "ignore-range-penalty:2", no range penalty out to the second
    // increment —; another option, or a modifier it drops (Alchemist's Damper's kickback), isn't played.)
    const rangeFree = Math.max(0, ...(plan.strike.options ?? []).map((option) => Number(/^ignore-range-penalty:(\d+)$/.exec(option)?.[1]) || 0));
    // (2026-10-16: damage in place of the weapon's — Big Rock Bullet's 4d6 on a hit, 2d6 on a failure: plan.strike.instead.)
    const dice = (entry) => {
        const match = /^(\d+)d(\d+)(?:\+(\d+))?$/.exec(String(entry?.formula ?? "").replace(/\s+/g, ""));
        return match && entry.type ? { dice: Number(match[1]), die: Number(match[2]), bonus: Number(match[3] ?? 0), multiplier: 1, type: entry.type, persistent: false, precision: false } : null;
    };
    const instead = plan.strike.instead?.hit && dice(plan.strike.instead.hit) ? { hit: dice(plan.strike.instead.hit), failure: dice(plan.strike.instead.failure) } : null;
    // (One that adds nothing played — no rider, push, save, option or damage of its own — isn't an activity: it would only spend the item.)
    if (!onHit.length && !onCritical.length && !push && !criticalPush && !save && !rangeFree && !instead && !extraDamage.length) return null;
    // (Ammunition — an arrow, a bullet: activated, then shot with a Strike — the activation's actions and the Strike's.)
    const loads = plan.strike.ammunition?.length ? plan.strike.ammunition : ammunition?.length ? ammunition : null;
    const isAmmo = Boolean(plan.strike.ammo || loads);
    const time = own?.time ?? plan.activation?.time;
    const activationActions = ["free", "reaction"].includes(String(time)) ? 0 : Number(time) || 1;
    return {
        name: name ?? plan.source?.name ?? "Item",
        actions: isAmmo ? activationActions + 1 : Number(time) || 1,
        strides: 0,
        strike: null,
        range: plan.strike.range === "ranged" ? "ranged" : plan.strike.range === "melee" ? "melee" : "any",
        ...(rangeFree ? { rangeFree } : {}),
        ...(instead ? { instead } : {}),
        ...(extraDamage.length ? { extraDamage } : {}),
        // (2026-10-16: ammunition — Roc-Shaft Arrow's "arrows": PF2e's ammo base types it fits, with a weapon that takes them.)
        ...(loads ? { ammunition: [...loads] } : {}),
        attackBonus: 0,
        damageBonus: 0,
        damage: null,
        offGuard: false,
        requires: null,
        oncePerFight: false,
        onHit: { conditions: onHit, critical: onCritical, push, ...(criticalPush !== push ? { criticalPush } : {}), damage: [], save: null, size: null },
        riderSpell: save ? { name: name ?? plan.source?.name ?? "Item", plan: save, castRank: Math.max(1, Number(item.level) || 1), dc: null, attack: null, pool: null, kind: "item", effects: {} } : null,
        traits: [...(own?.traits ?? plan.activation?.traits ?? [])],
        pool: `item:${id}`,
        casts,
        item: id,
        consumable: !reusable
    };
}

// (2026-10-15, the item module's third-party Effects: an application with `verify`, the item's text, is a module's own Effect, played only
// when its rules match what the text says — the item module's verifyEffectRules, which the caller runs: passes(application) → true.)
// The plan without the applications that don't pass; an effect plan left with none plays nothing.
export function verifiedPlan(plan, passes) {
    const applications = plan?.resolution?.applications;
    if (!Array.isArray(applications) || !applications.some((application) => application?.verify)) return plan;
    const kept = applications.filter((application) => !application?.verify || passes(application));
    return { ...plan, resolution: { ...plan.resolution, applications: kept } };
}

// U11 (2026-10-15; the user: "add gorum's tear and eye of apprehension to the simulator"): the item module's "roll-twice" talismans as the
// creature's fortune items (src/engine/fortune-items.js): { name, selector, pool, casts, item, consumable, … } for an attack roll or
// initiative, the item's own extras by its slug (FORTUNE_EXTRAS). null: another roll (a save, a skill) — not yet — or none left.
const FORTUNE_EXTRAS = Object.freeze({
    // "ignoring any circumstance penalties. You then become Off-Guard to the creature you targeted until the beginning of your next turn";
    // "You make an attack with the affixed weapon".
    "gorums-tear": { ignoreCircumstance: true, offGuardAfter: true, weapon: true },
    // "Requirements You are a master in Perception": the snapshot checks it.
    "eye-of-apprehension": { requires: "master-perception" }
});
export function itemFortune(plan, { id, name = null, quantity = 1, uses = null, fresh = false } = {}) {
    if (plan?.builtin !== "roll-twice" || plan.rollTwice?.keep !== "higher" || !["attack-roll", "initiative"].includes(plan.rollTwice.selector)) return null;
    const item = plan.item ?? {};
    const reusable = (uses?.autoDestroy ?? item.uses?.autoDestroy) === false;
    const casts = itemCasts({ category: reusable ? "wand" : "consumable", quantity, uses: { max: Math.max(1, Number(uses?.max ?? item.uses?.max) || 1), value: uses?.value }, fresh: reusable && fresh });
    if (!casts) return null;
    return { name: name ?? plan.source?.name ?? "Item", selector: plan.rollTwice.selector, pool: `item:${id}`, casts, item: id, consumable: !reusable, ...(FORTUNE_EXTRAS[plan.source?.slug] ?? {}) };
}

// U13 (2026-10-16; the user: "Yes add them"): a talisman that lowers a condition as it's gained — Lion Badge ("Trigger You gain the
// Frightened condition as a result of a Will save … reduce the value of your frightened condition by 1"; a PC expert in Will saves) — as the
// creature's reduce trigger: { name, on, save, by, pool, casts, item, consumable, requires }. Its trigger by its slug (REDUCE_TRIGGERS).
const REDUCE_TRIGGERS = Object.freeze({ "lion-badge": { on: "frightened", save: "will", requires: "expert-will" } });
export function itemReduceTrigger(plan, { id, name = null, quantity = 1, uses = null, fresh = false } = {}) {
    const trigger = REDUCE_TRIGGERS[plan?.source?.slug];
    const reduce = (plan?.item?.reduce ?? []).find((entry) => entry.slug === trigger?.on);
    if (!trigger || !reduce) return null;
    const item = plan.item ?? {};
    const reusable = (uses?.autoDestroy ?? item.uses?.autoDestroy) === false;
    const casts = itemCasts({ category: reusable ? "wand" : "consumable", quantity, uses: { max: Math.max(1, Number(uses?.max ?? item.uses?.max) || 1), value: uses?.value }, fresh: reusable && fresh });
    if (!casts) return null;
    return { name: name ?? plan.source?.name ?? "Item", ...trigger, by: reduce.by, pool: `item:${id}`, casts, item: id, consumable: !reusable };
}
