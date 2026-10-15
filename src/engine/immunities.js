// Immunities to conditions and to effects of a trait (I1, 2026-10-13; the user's call: "build everything you brought up"). Damage
// immunities (fire, bleed, precision, critical hits) are damage.js's and actions.js's; afflictions' traits, spells.js's.
//   A condition immunity (paralyzed, unconscious, blinded …): the condition doesn't land, whatever gives it.
//   A trait immunity (death effects, fear effects, mental, visual, sleep, poison …): an effect with that trait does nothing to it — no
//   save, no damage, no condition. A swarm's mind is a mental immunity; magic, every spell and magical ability (a golem's own antimagic
//   is its own rule, B56).

import { sourceOptions, testPredicate } from "./abilities.js";
import { iwrException } from "./effects.js";

const TRAITS = {
    "death-effects": ["death"], "fear-effects": ["fear"], mental: ["mental"], "swarm-mind": ["mental"], visual: ["visual"], auditory: ["auditory"],
    emotion: ["emotion"], sleep: ["sleep"], poison: ["poison"], disease: ["disease"], curse: ["curse"], polymorph: ["polymorph"],
    olfactory: ["olfactory"], inhaled: ["inhaled"], possession: ["possession"], healing: ["healing"], radiation: ["radiation"], light: ["light"]
};
// The engine's names for a condition PF2e names otherwise (Sleep's unconsciousness is "asleep" here).
const CONDITIONS = { unconscious: ["unconscious", "asleep"], petrified: ["petrified"], "off-guard": ["off-guard", "flat-footed"] };

// Whether the creature is immune to this condition (the slug a plan or the engine gives it).
export function immuneToCondition(c, slug) {
    const immunities = c?.immunities ?? [];
    if (!immunities.length || !slug) return false;
    return immunities.includes(slug) || Object.entries(CONDITIONS).some(([immunity, slugs]) => immunities.includes(immunity) && slugs.includes(slug));
}

// The trait immunity that keeps this spell or ability off the creature, or null; not one its exceptions name (a will-o'-wisp's magic
// immunity, but not to three spells).
export function effectImmunity(c, spell) {
    const immunities = c?.immunities ?? [];
    if (!immunities.length || !spell) return null;
    const options = sourceOptions(spell);
    if (!["ability", "basic", "item"].includes(spell.kind)) options.add("item:type:spell");
    const excepted = (immunity) => (c.immunityExceptions?.[immunity] ?? []).some((exception) => (typeof exception === "string" ? options.has(exception) || options.has(`item:trait:${exception}`) : testPredicate(exception.definition, options)));
    for (const immunity of immunities) {
        if ((TRAITS[immunity] ?? []).some((trait) => options.has(trait)) && !excepted(immunity)) return immunity;
        if (immunity === "magic" && !c.golemAntimagic && options.has("magical") && !excepted(immunity)) return immunity;
    }
    return null;
}

// An immunity's exceptions by its type, as a combatant's field ({} for none).
export function immunityExceptions(list) {
    const found = {};
    for (const entry of list ?? []) if (entry?.type && entry.exceptions?.length) found[entry.type] = entry.exceptions.map(iwrException);
    return Object.keys(found).length ? { immunityExceptions: found } : {};
}
