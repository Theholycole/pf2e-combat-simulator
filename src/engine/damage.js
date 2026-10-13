// Strike damage: rolling, expectations, and resistances, weaknesses and
// immunities.
//
// A damage part is { dice, die, bonus, multiplier, type, persistent, precision }
// and is worth (dice + bonus) × multiplier. A strike's first part is its weapon
// dice, which enfeebled, deadly and fatal act on. A strike taken from PF2e
// carries critDamage, PF2e's own critical formula, which is used as-is.

import { sourceOptions, testPredicate } from "./abilities.js";

const PHYSICAL = new Set(["bludgeoning", "piercing", "slashing"]);

// (I2: weaknesses and resistances to more than a damage type — area and splash damage, cold iron and silver, axes, holy and unholy, spells,
// magical and non-magical — tested as PF2e tests them, on the damage's roll options; a resistance's exceptions and its doubling the same way.
// A damage's context is its source's roll options: a Strike's traits, materials, weapon group and runes (strikeContext), a spell's traits
// and its area (spellContext). PF2e's materials go with a weapon's own damage; a weakness to a trait, a tradition, a weapon group or ghost
// touch counts once for the whole hit, the others once an instance, the highest one.)
const CATEGORY = {
    bludgeoning: "physical", piercing: "physical", slashing: "physical", bleed: "physical",
    acid: "energy", cold: "energy", electricity: "energy", fire: "energy", sonic: "energy", vitality: "energy", void: "energy", force: "energy"
};
const DAMAGE_TYPES = new Set([...Object.keys(CATEGORY), "mental", "poison", "spirit", "untyped"]);
const TRADITIONS = ["arcane", "divine", "occult", "primal"];
const ONCE = new Set([...TRADITIONS, "air", "arrow-vulnerability", "axe-vulnerability", "earth", "ghost-touch", "holy", "metal", "plant", "radiation", "salt-water", "salt", "spells", "unholy", "water", "wood"]);
export const MATERIALS = new Set(["abysium", "adamantine", "cold-iron", "dawnsilver", "djezet", "duskwood", "inubrix", "keep-stone", "noqual", "orichalcum", "peachwood", "siccatite", "silver", "sisterstone-dusk", "sisterstone-scarlet", "sovereign-steel", "warpglass"]);
// The traits a Strike's damage carries for them.
const IWR_TRAITS = new Set(["magical", "holy", "unholy", ...TRADITIONS, "air", "alchemical", "earth", "light", "metal", "olfactory", "radiation", "visual", "auditory", "water", "wood", "disease", "impulse"]);
const CRITICAL = "check:outcome:critical-success";

// PF2e's own reading of a weakness's, resistance's or exception's type (IWR#describe), as a predicate.
function describeType(type, kind) {
    switch (type) {
        case "air": case "alchemical": case "earth": case "light": case "metal": case "olfactory": case "prediction": case "radiation": case "time": case "visual": case "water": case "wood": return [`item:trait:${type}`];
        case "all-damage": case "all": return ["damage"];
        case "arcane": case "divine": case "occult": case "primal": return [{ or: [`item:trait:${type}`, `origin:action:trait:${type}`] }];
        case "area-damage": return ["area-damage"];
        case "arrow-vulnerability": return ["item:group:bow"];
        case "auditory": return ["item:trait:auditory"];
        case "axes": case "axe-vulnerability": return ["item:group:axe"];
        case "critical-hits": return [CRITICAL];
        case "disease": return ["item:trait:disease"];
        case "energy": case "physical": return [`damage:category:${type}`];
        case "ghost-touch": return [{ or: ["item:rune:property:astral", "item:rune:property:ghost-touch", "item:rune:property:greater-astral"] }];
        case "holy": case "unholy": return [{ or: [`origin:action:trait:${type}`, `item:trait:${type}`] }];
        case "magic": return [{ or: ["origin:action:trait:impulse", "item:from-spell", "item:type:spell"] }];
        case "magical": return [{ or: ["item:magical", "origin:action:trait:magical", ...TRADITIONS.map((trait) => `origin:action:trait:${trait}`)] }];
        case "mental": return ["damage:type:mental"];
        case "non-magical": return [{ not: "item:magical" }];
        case "persistent-damage": return ["damage:category:persistent"];
        case "precision": return ["damage:component:precision"];
        case "splash-damage": return ["damage:component:splash"];
        case "spells": case "damage-from-spells": return ["damage", { or: ["item:type:spell", "item:from-spell", "item:trait:impulse"] }];
        case "unarmed-attacks": return ["item:category:unarmed"];
        case "weapons": return ["item:type:weapon", { not: "item:category:unarmed" }];
        default:
            if (DAMAGE_TYPES.has(type)) return [`damage:type:${type}`];
            if (type === "adamantine" && kind === "resistance") return [{ or: ["damage:material:adamantine", "damage:material:keep-stone"] }];
            if (type === "cold-iron" && kind === "weakness") return [{ or: ["damage:material:cold-iron", "damage:material:sovereign-steel"] }];
            if (type === "silver" && kind === "weakness") return [{ or: ["damage:material:silver", "damage:material:dawnsilver"] }];
            if (type === "duskwood") return ["damage:material:duskwood"];
            if (MATERIALS.has(type)) return [`damage:material:${type}`];
            // (Salt, plant, vorpal and the like: PF2e leaves them unhandled, so they never apply.)
            return [`unhandled:${type}`];
    }
}

const DESCRIBED = new Map();
function describe(type, kind) {
    const key = `${kind}|${type}`;
    if (!DESCRIBED.has(key)) DESCRIBED.set(key, describeType(type, kind));
    return DESCRIBED.get(key);
}

// One damage instance's roll options over its source's: its type, category and components; a material only on a weapon's own damage.
function optionsOf(instance, context) {
    return {
        has(option) {
            if (option === "damage") return true;
            if (!option.startsWith("damage:")) return !!context?.has(option);
            if (option === `damage:type:${instance.type}`) return true;
            if (option.startsWith("damage:category:")) return option === `damage:category:${CATEGORY[instance.type]}` || (option === "damage:category:persistent" && !!instance.persistent);
            if (option === "damage:component:precision") return !!instance.precision;
            if (option === "damage:component:splash") return !!instance.splash;
            if (option.startsWith("damage:material:")) return !!instance.weapon && !!context?.has(option);
            return false;
        }
    };
}

// A custom type's or exception's own predicate (PF2e's definition: a vampire's "magical silver"); never one without it.
const definitionOf = (custom) => (Array.isArray(custom?.definition) && custom.definition.length ? custom.definition : ["unhandled:custom"]);

// Whether a weakness or resistance applies: its type, and none of its exceptions.
function applies(entry, kind, options) {
    if (!testPredicate(entry.type === "custom" ? definitionOf(entry) : describe(entry.type, kind), options)) return false;
    return !(entry.exceptions ?? []).some((exception) => testPredicate((typeof exception === "string" ? describe(exception, kind) : definitionOf(exception)).filter((term) => term !== "damage"), options));
}

// A resistance doubled against what it names (doubleVs: "non-magical").
function resistanceValue(entry, options) {
    const value = Number(entry.value) || 0;
    return (entry.doubleVs ?? []).some((type) => testPredicate(describe(type, "resistance"), options)) ? value * 2 : value;
}

// Its resistances now: its own, those its share of Hit Points gives (T3, Abandon Armor), and Protean Anatomy's to the type it last took (T4).
export function resistancesOf(defender) {
    const own = defender?.resistances ?? [];
    if (!defender?.hpRules?.length && !defender?.proteanType) return own;
    const share = 100 * Math.max(0, defender.hp?.value ?? 0) / Math.max(1, defender.hp?.max ?? 1);
    const held = (defender.hpRules ?? []).filter((rule) => (rule.below === undefined || share < rule.below) && (rule.atLeast === undefined || share >= rule.atLeast)).flatMap((rule) => rule.resistances ?? []);
    const protean = defender.proteanType && defender.protean?.value ? [{ type: defender.proteanType, value: defender.protean.value, exceptions: [] }] : [];
    return [...own, ...held, ...protean];
}

// A Strike's context: its traits (holy for good, unholy for evil; a sanctified one's by its creature's own), materials, weapon group, runes,
// and the critical hit. Cached per Strike.
const strikeContexts = new WeakMap();
export function strikeContext(attacker, strike, critical = false) {
    if (!strike) return null;
    let cached = strikeContexts.get(strike);
    if (!cached) {
        const options = new Set();
        const iwr = strike.iwr ?? {};
        const traits = new Set(iwr.traits ?? []);
        if (strike.holy || strike.good) traits.add("holy");
        if (strike.unholy || strike.evil) traits.add("unholy");
        if (strike.sanctified) for (const trait of ["holy", "unholy"]) if ((attacker?.traits ?? []).includes(trait)) traits.add(trait);
        for (const trait of traits) options.add(`item:trait:${trait}`);
        if (traits.has("magical") || TRADITIONS.some((trait) => traits.has(trait))) options.add("item:magical");
        for (const material of iwr.materials ?? []) options.add(`damage:material:${material}`);
        if (iwr.group) options.add(`item:group:${iwr.group}`);
        for (const rune of iwr.runes ?? []) options.add(`item:rune:property:${rune}`);
        if (strike.unarmed) options.add("item:category:unarmed");
        // (T5: a weapon in hand, and one of wood — a bow, a club, a staff, duskwood or peachwood — for an elemental dragon's answers.)
        if (strike.held) options.add("held-weapon");
        if ((iwr.materials ?? []).some((material) => ["duskwood", "peachwood"].includes(material)) || ["bow", "club"].includes(iwr.group) || /\b(?:staff|club|wooden|cudgel|bo)\b/i.test(strike.name ?? "")) options.add("wooden");
        cached = { normal: options, critical: new Set([...options, CRITICAL]) };
        strikeContexts.set(strike, cached);
    }
    return critical ? cached.critical : cached.normal;
}

// A spell's or an ability's context: its traits (and magical, as sourceOptions says), a spell's own type, its area.
export function spellContext(spell, { isSpell = true, area = false } = {}) {
    const options = sourceOptions(spell);
    if (isSpell) options.add("item:type:spell");
    if (area) options.add("area-damage");
    return options;
}

// Its versatile traits' damage types: "versatile-p" piercing, "versatile-fire" fire (T3).
const VERSATILE = { b: "bludgeoning", p: "piercing", s: "slashing" };
export function versatileTypes(traits) {
    return [...new Set((traits ?? []).map((trait) => /^versatile-([a-z]+)$/.exec(trait)?.[1]).filter(Boolean).map((key) => VERSATILE[key] ?? key))];
}

// A Strike's fields for its context, from its traits and its item (the snapshot's and the bestiary tool's): the traits that count, its
// materials (a weapon's own, or among an NPC's traits), its weapon group (a weapon's; an NPC's named an axe or a hatchet), its property runes.
export function strikeIwr(traits, { material = null, group = null, runes = [], name = "" } = {}) {
    const listed = [...new Set(traits.map((trait) => (trait === "good" ? "holy" : trait === "evil" ? "unholy" : trait)).filter((trait) => IWR_TRAITS.has(trait)))];
    const materials = [...new Set([...traits.filter((trait) => MATERIALS.has(trait)), ...(MATERIALS.has(material) ? [material] : [])])];
    const weaponGroup = group || (/\b(?:battle ?|great|hand ?|war ?|double ?)?axe\b|\bhatchet\b/i.test(name) && !/pick/i.test(name) ? "axe" : null);
    const property = (runes ?? []).filter(Boolean);
    if (!listed.length && !materials.length && !weaponGroup && !property.length) return null;
    return { ...(listed.length ? { traits: listed } : {}), ...(materials.length ? { materials } : {}), ...(weaponGroup ? { group: weaponGroup } : {}), ...(property.length ? { runes: property } : {}) };
}

// A weakness to a trait, a tradition, a weapon group or ghost touch: once for the whole damage, every one that applies (PF2e's applyOnce).
export function onceWeakness(defender, context) {
    if (!context) return 0;
    const options = optionsOf({ type: "untyped" }, context);
    let total = 0;
    for (const entry of defender?.weaknesses ?? []) if (ONCE.has(entry.type) && applies(entry, "weakness", options)) total += Number(entry.value) || 0;
    return total;
}

function averageDice(dice, die) {
    return dice * (die + 1) / 2;
}

function rollDice(rng, dice, die) {
    let total = 0;
    for (let i = 0; i < dice; i++) total += rng.die(die);
    return total;
}

// The parts to use and the extra multiplier for this degree.
function partsFor(strike, critical) {
    if (!critical) return { parts: strike.damage, factor: 1, extras: false };
    if (strike.critDamage) return { parts: strike.critDamage, factor: 1, extras: false };
    const parts = strike.fatal
        ? strike.damage.map((part, index) => (index === 0 ? { ...part, die: strike.fatal } : part))
        : strike.damage;
    return { parts, factor: 2, extras: true };
}

function build(strike, critical, penalty, roll) {
    const { parts, factor, extras } = partsFor(strike, critical);
    const result = [];
    let first = true;
    for (const part of parts) {
        // Splash damage isn't doubled on a critical hit.
        const multiplier = (part.multiplier ?? 1) * (part.splash ? 1 : factor);
        let base = (part.dice ? roll(part.dice, part.die) : 0) + (part.bonus ?? 0);
        if (first && penalty) base -= penalty;
        if (first) base = Math.max(1, base);
        first = false;
        result.push({
            type: part.type,
            amount: base * multiplier,
            persistent: !!part.persistent,
            precision: !!part.precision,
            ...(part.splash ? { splash: true } : {}),
            // (I2: the weapon's own damage, which its material goes with.)
            ...(result.length === 0 ? { weapon: true } : {}),
            dice: part.dice,
            die: part.die,
            bonus: part.bonus ?? 0,
            multiplier
        });
    }
    if (extras && result.length) {
        const weaponType = strike.damage[0].type;
        if (strike.deadly) result.push({ type: weaponType, amount: roll(strike.deadly.dice, strike.deadly.die), persistent: false, precision: false, weapon: true });
        if (strike.fatal) result.push({ type: weaponType, amount: roll(1, strike.fatal), persistent: false, precision: false, weapon: true });
    }
    return result;
}

// Returns damage instances as [{ type, amount, persistent, precision, ... }].
export function rollStrikeDamage(rng, strike, { critical = false, penalty = 0 } = {}) {
    return build(strike, critical, penalty, (dice, die) => rollDice(rng, dice, die));
}

export function expectedStrikeDamage(strike, { critical = false, penalty = 0 } = {}) {
    return build(strike, critical, penalty, averageDice);
}

// Applies immunities, weaknesses and resistances. Instances of the same type
// are combined first, as PF2e does. Persistent instances are left out of the
// immediate total and returned separately. (I2: the damage's context rides on
// its instances — instance.context, a Set of roll options.)
export function adjustDamage(defender, instances) {
    const immediate = new Map();
    const persistent = [];
    let context = null;
    for (const instance of instances) {
        context ??= instance.context ?? null;
        if (instance.persistent) {
            persistent.push(instance);
            continue;
        }
        const key = instance.precision ? `${instance.type}|precision` : instance.type;
        const entry = immediate.get(key) ?? { type: instance.type, precision: instance.precision, amount: 0, splash: false, weapon: false };
        entry.amount += instance.amount;
        // (Splash damage and a weapon's own are components of the instance they join.)
        entry.splash ||= !!instance.splash;
        entry.weapon ||= !!instance.weapon;
        immediate.set(key, entry);
    }
    let total = 0;
    for (const entry of immediate.values()) total += adjustPart(defender, entry, context);
    if ([...immediate.values()].some((entry) => entry.amount > 0)) total += onceWeakness(defender, context);
    // Hardness (hazards, objects) comes off the damage.
    if (defender.hardness) total -= defender.hardness;
    return { total: Math.max(0, total), persistent };
}

// A concussive weapon (firearms): piercing or bludgeoning, whichever the
// defender resists less. Other types stay as they are.
export function concussiveType(defender, type, amount, precision = false) {
    if (type !== "piercing" && type !== "bludgeoning") return type;
    return adjustInstance(defender, "bludgeoning", amount, precision) > adjustInstance(defender, "piercing", amount, precision) ? "bludgeoning" : "piercing";
}

// Void healing (PF2e's hp.negativeHealing; undead without the flag read):
// vitality damage harms only creatures that have it, void damage only those that don't.
export function hasVoidHealing(defender) {
    return defender.voidHealing ?? (defender.traits ?? []).includes("undead");
}

export function adjustInstance(defender, type, amount, precision = false, context = null) {
    return adjustPart(defender, { type, amount, precision }, context);
}

// One instance ({ type, amount, precision, splash, weapon, persistent }) in its context: the highest weakness that applies (not those once
// a hit), less the highest resistance (a critical-hits one up to the critical's extra damage).
export function adjustPart(defender, instance, context = null) {
    const { type, amount, precision } = instance;
    if (type === "vitality" && !hasVoidHealing(defender)) return 0;
    if (type === "void" && hasVoidHealing(defender)) return 0;
    const immunities = defender.immunities ?? [];
    if (immunities.includes(type) || (precision && immunities.includes("precision"))) return 0;
    if (PHYSICAL.has(type) && immunities.includes("physical")) return 0;
    const options = optionsOf(instance, context);
    let result = amount;
    let weakness = 0;
    for (const entry of defender.weaknesses ?? []) {
        if (!ONCE.has(entry.type) && applies(entry, "weakness", options)) weakness = Math.max(weakness, Number(entry.value) || 0);
    }
    let resistance = 0;
    for (const entry of resistancesOf(defender)) {
        if (!applies(entry, "resistance", options)) continue;
        const value = resistanceValue(entry, options);
        resistance = Math.max(resistance, entry.type === "critical-hits" ? Math.min(value, Math.floor(amount / 2)) : value);
    }
    if (result > 0) result += weakness;
    result -= resistance;
    return Math.max(0, result);
}

export function averagePersistent(instance) {
    if (instance.dice && instance.die) return (averageDice(instance.dice, instance.die) + (instance.bonus ?? 0)) * (instance.multiplier ?? 1);
    return instance.amount ?? 0;
}

export function rollPersistent(rng, instance) {
    if (instance.dice && instance.die) return (rollDice(rng, instance.dice, instance.die) + (instance.bonus ?? 0)) * (instance.multiplier ?? 1);
    return instance.amount ?? 0;
}

