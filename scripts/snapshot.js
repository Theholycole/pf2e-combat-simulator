// Builds an engine snapshot from Foundry: a Combat in progress, or tokens.
// This is the only place that reads PF2e documents.

import { extraDamageParts, parseReadableDamage } from "../src/adapter/formula.js";
import { eliteAdjust, weakAdjust } from "../src/engine/adjust.js";
import { canCast, isUtility, spellGaps } from "../src/engine/spells.js";
import { effectModel } from "../src/engine/effects.js";
import { addBuiltin } from "../src/engine/abilities.js";
import { MAP_KINDS, readMapFeet, readRegionFeet, regionToRegions, roundsHeld } from "./map.js";
import { hazardSpec } from "./hazards.js";

export const MODULE_ID = "pf2e-combat-simulator";

// Modifiers that come from conditions. The engine applies conditions itself,
// so they are taken out of snapshot values.
const CONDITION_SLUGS = new Set([
    "frightened", "sickened", "clumsy", "enfeebled", "drained", "stupefied", "off-guard",
    "prone", "fatigued", "blinded", "dazzled", "grabbed", "restrained", "paralyzed", "unconscious", "encumbered"
]);

const BUILT_IN_ACTIONS = new Set(["reactive-strike", "attack-of-opportunity", "shield-block", "raise-a-shield", "stride", "step", "strike"]);
const AOO_SLUGS = new Set(["reactive-strike", "attack-of-opportunity"]);
const NOTABLE_PASSIVE = /sneak-attack|regeneration|fast-healing|frightful-presence|pack-attack|ferocity|deny-advantage|aura|swarm-mind|rage/;
// Strike traits that need no simulation: modelled by the engine, already in
// PF2e's damage formula (two-hand, propulsive, versatile), or only labels
// (damage types, elements, materials).
const MODELLED_TRAITS = new Set([
    "attack", "agile", "finesse", "magical", "unarmed", "deadly", "fatal", "nonlethal", "brutal", "reach",
    "forceful", "sweep", "backswing", "backstabber", "volley",
    "thrown", "reload", "range", "versatile", "light", "holy", "unholy", "adamantine", "cold-iron", "silver",
    // Firearms (C16): kickback is in PF2e's own numbers; concussive, scatter and splash are played.
    "concussive", "kickback", "scatter", "splash",
    "two-hand", "propulsive", "concealable", "monk", "free-hand", "orichalcum", "mithral", "dawnsilver", "duskwood",
    "acid", "bludgeoning", "cold", "electricity", "fire", "force", "mental", "piercing", "poison", "slashing", "sonic",
    "spirit", "vitality", "void", "air", "earth", "metal", "water", "wood", "arcane", "divine", "occult", "primal",
    // Weapon traits that change nothing about a Strike in range bands, and labels
    "staff", "parry", "disarm", "trip", "shove", "grapple", "alchemical", "consumable", "bomb", "uncommon", "rare", "unique",
    "dwarf", "elf", "gnome", "goblin", "halfling", "human", "orc", "catfolk", "kobold", "leshy", "ratfolk", "tengu", "kitsune", "lizardfolk", "fetchling", "nagaji", "vanara", "vishkanya", "hobgoblin"
]);

function traitRoot(trait) {
    return trait.replace(/-(\d+d)?\d+$/, "").replace(/-d\d+$/, "").replace(/-[a-z]$/, "");
}

// Takes condition modifiers out of a total, restoring any same-type modifier
// that a condition had displaced under PF2e's stacking rules.
export function stripConditions(total, modifiers = []) {
    let value = total;
    const fromConditions = modifiers.filter((m) => m.enabled && CONDITION_SLUGS.has(m.slug));
    for (const m of fromConditions) value -= m.modifier;
    for (const type of new Set(fromConditions.map((m) => m.type))) {
        if (type === "untyped") continue;
        const others = modifiers.filter((m) => m.type === type && !CONDITION_SLUGS.has(m.slug) && !m.ignored);
        const enabled = others.filter((m) => m.enabled);
        const displaced = others.filter((m) => !m.enabled);
        const worst = (list) => Math.min(0, ...list.map((m) => m.modifier));
        const best = (list) => Math.max(0, ...list.map((m) => m.modifier));
        if (worst(displaced) < worst(enabled)) value += worst(displaced) - worst(enabled);
        if (best(displaced) > best(enabled)) value += best(displaced) - best(enabled);
    }
    return value;
}

function statValue(statistic) {
    if (!statistic) return 0;
    const total = statistic.mod ?? statistic.totalModifier ?? statistic.value ?? 0;
    return stripConditions(total, statistic.modifiers ?? statistic.check?.modifiers ?? []);
}

function conditionValue(actor, slug) {
    const condition = actor.itemTypes?.condition?.find((c) => c.slug === slug);
    if (!condition) return 0;
    return condition.value ?? 1;
}

function hasCondition(actor, slug) {
    return !!actor.itemTypes?.condition?.some((c) => c.slug === slug);
}

function readConditions(actor) {
    const persistent = [];
    for (const condition of actor.itemTypes?.condition ?? []) {
        if (condition.slug !== "persistent-damage") continue;
        const data = condition.system?.persistent ?? {};
        const parts = parseReadableDamage(`${data.formula ?? "0"} ${data.damageType ?? "untyped"}`);
        const part = parts[0];
        if (part) persistent.push({ type: data.damageType ?? part.type, dice: part.dice, die: part.die, bonus: part.bonus, multiplier: part.multiplier, amount: part.bonus });
    }
    const attributes = actor.system?.attributes ?? {};
    return {
        frightened: conditionValue(actor, "frightened"),
        sickened: conditionValue(actor, "sickened"),
        clumsy: conditionValue(actor, "clumsy"),
        enfeebled: conditionValue(actor, "enfeebled"),
        drained: conditionValue(actor, "drained"),
        slowed: conditionValue(actor, "slowed"),
        stunned: conditionValue(actor, "stunned"),
        quickened: hasCondition(actor, "quickened"),
        offGuard: hasCondition(actor, "off-guard"),
        prone: hasCondition(actor, "prone"),
        fleeing: hasCondition(actor, "fleeing"),
        unconscious: hasCondition(actor, "unconscious"),
        stupefied: conditionValue(actor, "stupefied"),
        fatigued: hasCondition(actor, "fatigued"),
        paralyzed: hasCondition(actor, "paralyzed"),
        blinded: hasCondition(actor, "blinded"),
        dazzled: hasCondition(actor, "dazzled"),
        immobilized: hasCondition(actor, "immobilized"),
        restrained: hasCondition(actor, "restrained"),
        grabbed: hasCondition(actor, "grabbed"),
        dying: attributes.dying?.value ?? conditionValue(actor, "dying"),
        wounded: attributes.wounded?.value ?? conditionValue(actor, "wounded"),
        doomed: attributes.doomed?.value ?? conditionValue(actor, "doomed"),
        persistent
    };
}

function traitList(source) {
    return (source ?? []).map((trait) => (typeof trait === "string" ? trait : trait?.name)).filter(Boolean);
}

async function readStrike(actor, action, gaps) {
    const item = action.item;
    // A character's weapon traits are on weaponTraits; an NPC's are among its Strike's traits.
    const traits = [...new Set([...traitList(action.traits), ...traitList(action.weaponTraits)])];
    const unarmed = traits.includes("unarmed") || (item?.category ?? item?.system?.category) === "unarmed";
    const ranged = item?.isRanged ?? !!item?.range?.increment;
    const melee = !ranged || item?.isMelee === true;
    const increment = ranged ? (item?.range?.increment ?? null) : null;
    const reachTrait = traits.find((trait) => /^reach-\d+$/.test(trait));
    // Reload N: the actions to load it again after each shot (PF2e's weapon reload,
    // or an NPC's "reload-1" trait). "-" needs none; "1 min" can't be done in a fight.
    const reloadValue = String(item?.reload ?? item?.system?.reload?.value ?? traits.find((trait) => /^reload-\d+$/.test(trait))?.split("-")[1] ?? "-");
    const reload = /^\d+$/.test(reloadValue) ? Number(reloadValue) : reloadValue === "-" || !reloadValue ? 0 : 99;
    let damage = [];
    let critDamage = null;
    try {
        damage = parseReadableDamage(await action.damage({ getFormula: true }));
        critDamage = parseReadableDamage(await action.critical({ getFormula: true }));
    } catch (error) {
        gaps.push({ kind: "unreadable damage", name: `${action.label}: ${error.message}` });
        return null;
    }
    if (!damage.length) return null;
    // A PC's damage that depends on the situation, read through PF2e itself with a
    // roll option on: against an off-guard target (Sneak Attack), and while raging.
    let offGuardExtra = [];
    let rageDelta = [];
    if (actorKind(actor) === "pc") {
        // PF2e's readable formula drops "precision"; damage only against an off-guard
        // target is precision damage (Sneak Attack, backstabber).
        offGuardExtra = (await situationalParts(action, damage, ["target:condition:off-guard"])).map((part) => ({ ...part, precision: true }));
        if (hasItemSlug(actor, new Set(["rage"])) && !actor.itemTypes?.effect?.some((effect) => effect.slug === "effect-rage")) rageDelta = await situationalParts(action, damage, ["self:effect:rage", "rage"]);
    }
    const enfeebled = conditionValue(actor, "enfeebled");
    if (enfeebled && melee && damage[0]) {
        // PF2e's formula already has the enfeebled penalty; the engine applies its own.
        damage[0] = { ...damage[0], bonus: damage[0].bonus + enfeebled };
        if (critDamage?.[0]) critDamage[0] = { ...critDamage[0], bonus: critDamage[0].bonus + enfeebled };
    }
    for (const trait of traits) {
        if (!MODELLED_TRAITS.has(traitRoot(trait)) && !trait.startsWith("attached")) gaps.push({ kind: "strike trait", name: trait });
    }
    return {
        name: action.label,
        // Riders the Strike lists (grab, knockdown, push); a gap unless an ability plays them.
        attackEffects: [...(item?.system?.attackEffects?.value ?? [])],
        // A weapon in hand (Disarm can knock it away); fists, jaws and claws can't be.
        held: !unarmed && (item?.type === "weapon" || (item?.type === "melee" && !NATURAL_ATTACK.test(action.label ?? item?.name ?? ""))),
        // Two hands to wield: not while a hand carries an objective's item (O3).
        ...(item?.type === "weapon" && item.system?.usage?.value === "held-in-two-hands" ? { hands: 2 } : {}),
        // Light Bulk or less: usable from inside a swallower.
        light: item?.type === "weapon" && Number(item?.system?.bulk?.value ?? 1) <= 0.1,
        unarmed,
        finesse: traits.includes("finesse"),
        thrown: traits.some((trait) => trait.startsWith("thrown")),
        ...(offGuardExtra.length ? { offGuardExtra } : {}),
        ...(rageDelta.length ? { rageDelta } : {}),
        bonus: stripConditions(action.totalModifier, action.modifiers),
        melee: melee && !increment,
        increment,
        reach: reachTrait ? Number(reachTrait.split("-")[1]) : null,
        agile: traits.includes("agile"),
        nonlethal: traits.includes("nonlethal"),
        forceful: traits.includes("forceful"),
        sweep: traits.includes("sweep"),
        backswing: traits.includes("backswing"),
        // (PF2e's own off-guard damage already has it for a PC.)
        backstabber: traits.includes("backstabber") && !offGuardExtra.length,
        volley: Number(traits.find((trait) => /^volley-\d+$/.test(trait))?.split("-")[1] ?? 0) || null,
        ...(reload > 0 ? { reload } : {}),
        // C16: firearms' and bombs' traits; the group for gunslinger deeds.
        ...(traits.includes("concussive") ? { concussive: true } : {}),
        ...(traits.includes("splash") ? { splashKind: "bomb" } : traits.some((trait) => /^scatter-\d+$/.test(trait)) ? { splashKind: "scatter" } : {}),
        // How much splash: PF2e's readable formula folds it into the total, so it's read from the item
        // (a scatter weapon's 1 per weapon die; a bomb's listed splash; an NPC's splash damage roll).
        ...(splashAmount(item, traits) > 0 ? { splashAmount: splashAmount(item, traits) } : {}),
        ...(["firearm", "crossbow"].includes(item?.group ?? item?.system?.group) ? { firearm: true } : {}),
        ...(traits.includes("parry") ? { parry: true } : {}),
        damage,
        critDamage
    };
}

function splashAmount(item, traits) {
    if (traits.some((trait) => /^scatter-\d+$/.test(trait))) return Number(item?.system?.damage?.dice ?? 1) || 1;
    if (!traits.includes("splash")) return 0;
    const npcSplash = Object.values(item?.system?.damageRolls ?? {}).filter((roll) => roll?.category === "splash").reduce((sum, roll) => sum + (Number(roll.damage) || 0), 0);
    return npcSplash || Number(item?.system?.splashDamage?.value ?? 0) || 0;
}

// The extra damage parts of a Strike with roll options on, or [] when PF2e can't say.
async function situationalParts(action, damage, options) {
    try {
        return extraDamageParts(parseReadableDamage(await action.damage({ getFormula: true, options })), damage);
    } catch {
        return [];
    }
}

// The flourish trait: one flourish action a turn.
const flourish = (item) => (item?.system?.traits?.value ?? []).includes("flourish");

const CHAMPION_REACTIONS = new Set(["retributive-strike", "glimpse-of-redemption", "liberating-step", "flash-of-grandeur", "selfish-shield", "iron-command"]);

// A PC's class features the engine plays: Rage, Hunt Prey with its hunter's
// edge, Flurry of Blows, Double Slice and a champion's reaction. Returns
// combatant fields, and the items they cover (not gaps).
function readClassFeatures(actor, strikes) {
    const result = { fields: {}, handled: new Set() };
    if (actorKind(actor) !== "pc") return result;
    const items = [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])];
    const find = (slug) => items.find((item) => item.slug === slug) ?? null;
    const has = (slug) => items.some((item) => item.slug === slug);
    const level = actor.level ?? 1;
    const fields = result.fields;
    const rage = items.find((item) => item.slug === "rage" && item.type === "action");
    if (rage) {
        // The class feature that grants it too.
        for (const item of items) if (item.slug === "rage") result.handled.add(item);
        const buff = { name: "Rage", actions: 1, tempHp: level + (actor.abilities?.con?.mod ?? actor.system?.abilities?.con?.mod ?? 0), noConcentrate: true, strikeDeltas: Object.fromEntries(strikes.filter((strike) => strike.rageDelta?.length).map((strike) => [strike.name, strike.rageDelta])) };
        // Raging already: its damage is in the Strikes; it can't rage again this fight.
        if (actor.itemTypes?.effect?.some((effect) => effect.slug === "effect-rage")) fields.activeBuffs = [{ ...buff, strikeDeltas: {} }];
        else fields.selfBuffs = [buff];
    }
    const hunt = find("hunt-prey");
    if (hunt && hunt.type === "action") {
        result.handled.add(hunt);
        fields.huntPrey = { edge: has("flurry") ? "flurry" : has("precision") ? "precision" : has("outwit") ? "outwit" : null, precisionDice: level >= 19 ? 3 : level >= 11 ? 2 : 1 };
    }
    const value = (strike) => strike.bonus * 2 + strike.damage.reduce((sum, part) => sum + ((part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0)) * (part.multiplier ?? 1), 0);
    const flurry = find("flurry-of-blows");
    const unarmed = strikes.filter((strike) => strike.unarmed && strike.melee).sort((a, b) => value(b) - value(a))[0];
    if (flurry && unarmed) {
        result.handled.add(flurry);
        (fields.multiStrikes ??= []).push({ name: "Flurry of Blows", actions: 1, strikes: [unarmed.name.toLowerCase(), unarmed.name.toLowerCase()], oncePerTurn: true, ...(flourish(flurry) ? { flourish: true } : {}) });
    }
    const doubleSlice = find("double-slice");
    const weapons = strikes.filter((strike) => strike.held && strike.melee && !strike.name.includes("(")).sort((a, b) => value(b) - value(a));
    if (doubleSlice && weapons.length >= 2) {
        result.handled.add(doubleSlice);
        (fields.multiStrikes ??= []).push({ name: "Double Slice", actions: 2, strikes: [weapons[0].name.toLowerCase(), weapons[1].name.toLowerCase()], sameMap: true, sameTarget: true, secondPenalty: true });
    }
    // Feats with actions, as the engine's Strike activities, charges and multi-Strikes.
    const activity = (item, fields) => {
        result.handled.add(item);
        (result.fields.strikeActivities ??= []).push({ name: item.name, actions: Number(item.system?.actions?.value) || 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null, ...(flourish(item) ? { flourish: true } : {}), ...fields });
    };
    const meleeWeapons = strikes.filter((strike) => strike.melee && !strike.name.includes("(")).sort((a, b) => value(b) - value(a));
    const rangedWeapons = strikes.filter((strike) => !strike.melee && strike.held && !strike.name.includes("(")).sort((a, b) => value(b) - value(a));
    for (const item of items) {
        switch (item.slug) {
            case "vicious-swing":
                activity(item, { countsAs: 2, extraWeaponDice: level >= 18 ? 3 : level >= 10 ? 2 : 1 });
                break;
            case "intimidating-strike":
                activity(item, { onHit: { conditions: [{ slug: "frightened", value: 1, duration: null }], critical: [{ slug: "frightened", value: 2, duration: null }], push: null, damage: [], save: null, size: null } });
                break;
            case "snagging-strike":
                activity(item, { onHit: { conditions: [{ slug: "off-guard", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start", anchor: "source-turn" } }], critical: null, push: null, damage: [], save: null, size: null } });
                break;
            case "exacting-strike":
                activity(item, { exacting: true });
                break;
            case "sudden-charge":
                result.handled.add(item);
                (result.fields.charges ??= []).push({ name: item.name, actions: 2, strides: 2, strike: null, attackBonus: 0, damage: null, oncePerTurn: true, ...(flourish(item) ? { flourish: true } : {}) });
                break;
            case "hunted-shot":
                if (rangedWeapons[0]) {
                    result.handled.add(item);
                    (result.fields.multiStrikes ??= []).push({ name: item.name, actions: 1, strikes: [rangedWeapons[0].name.toLowerCase(), rangedWeapons[0].name.toLowerCase()], oncePerTurn: true, preyOnly: true, sameTarget: true, ...(flourish(item) ? { flourish: true } : {}) });
                }
                break;
            case "twin-takedown":
                if (meleeWeapons.filter((strike) => strike.held).length >= 2) {
                    const [first, second] = meleeWeapons.filter((strike) => strike.held);
                    result.handled.add(item);
                    (result.fields.multiStrikes ??= []).push({ name: item.name, actions: 1, strikes: [first.name.toLowerCase(), second.name.toLowerCase()], oncePerTurn: true, preyOnly: true, sameTarget: true, ...(flourish(item) ? { flourish: true } : {}) });
                }
                break;
            default:
                break;
        }
    }
    // Battle Medicine: needs a healer's toolkit; the Treat Wounds DCs its Medicine rank allows.
    const medicine = find("battle-medicine");
    if (medicine && actor.items.some((item) => /^healers-toolkit/.test(item.slug ?? ""))) {
        const rank = actor.skills?.medicine?.rank ?? 1;
        result.handled.add(medicine);
        fields.battleMedicine = { name: medicine.name, modifier: statValue(actor.skills?.medicine), tiers: [{ dc: 15, bonus: 0 }, { dc: 20, bonus: 10 }, { dc: 30, bonus: 30 }, { dc: 40, bonus: 50 }].slice(0, Math.max(1, rank)) };
    }
    const ability = (key) => actor.abilities?.[key]?.mod ?? actor.system?.abilities?.[key]?.mod ?? 0;
    const steps = [5, 9, 13, 17].filter((step) => level >= step).length;
    // Thaumaturge: Exploit Vulnerability (an Esoteric Lore check against the target's level DC).
    const exploit = items.find((item) => item.slug === "exploit-vulnerability" && item.type === "action");
    if (exploit) {
        for (const item of items) if (item.slug === "exploit-vulnerability") result.handled.add(item);
        const lore = Object.values(actor.skills ?? {}).find((skill) => /esoteric/i.test(skill.slug ?? skill.label ?? ""));
        fields.exploit = { name: exploit.name, modifier: statValue(lore ?? actor.skills?.occultism), antithesis: 2 + Math.floor(level / 2) };
    }
    // Investigator: Devise a Stratagem (Intelligence for agile, finesse and ranged Strikes; Strategic Strike's precision dice).
    const stratagem = items.find((item) => item.slug === "devise-a-stratagem" && item.type === "action");
    if (stratagem) {
        for (const item of items) if (item.slug === "devise-a-stratagem" || item.slug === "strategic-strike") result.handled.add(item);
        const bonus = {};
        for (const strike of strikes) {
            const eligible = strike.melee ? strike.agile || strike.finesse : !strike.thrown;
            if (eligible) bonus[strike.name] = Math.max(0, ability("int") - (strike.melee ? Math.max(ability("str"), ability("dex")) : ability("dex")));
        }
        fields.stratagemFeature = { name: stratagem.name, dice: 1 + steps, strikeBonus: bonus };
    }
    // Swashbuckler: panache from its style's bravado actions, Precise Strike, finishers and Opportune Riposte.
    if (has("panache")) {
        for (const item of items) if (["panache", "precise-strike", "confident-finisher"].includes(item.slug)) result.handled.add(item);
        const styles = { fencer: ["feint", "create-a-diversion"], braggart: ["demoralize"], gymnast: ["grapple", "reposition", "shove", "trip"], wit: ["bon-mot"], rascal: ["dirty-trick"], battledancer: ["perform"] };
        const style = Object.keys(styles).find((slug) => has(slug));
        fields.panacheStyle = { bravado: style ? styles[style] : [], precise: 2 + steps, finisherDice: 2 + steps };
        if (style) for (const item of items) if (item.slug === style) result.handled.add(item);
        for (const item of items) {
            if (item.type !== "action" && item.system?.actionType?.value !== "action") continue;
            if (item.slug === "confident-finisher") activity(item, { finisher: "confident" });
            if (item.slug === "unbalancing-finisher") activity(item, { finisher: "unbalancing", onHit: { conditions: [{ slug: "off-guard", value: null, duration: { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-end", anchor: "source-turn" } }], critical: null, push: null, damage: [], save: null, size: null } });
        }
        const riposte = items.find((item) => item.slug === "opportune-riposte" && item.type === "action");
        if (riposte) {
            for (const item of items) if (item.slug === "opportune-riposte") result.handled.add(item);
            fields.opportuneRiposte = true;
        }
    }
    // Guardian: Intercept Attack and Taunt.
    for (const item of items) {
        if (item.slug === "intercept-attack" && item.type === "action") fields.interceptAttack = true;
        if (item.slug === "taunt" && item.type === "action") fields.taunt = { name: item.name };
        if (["intercept-attack", "taunt"].includes(item.slug)) result.handled.add(item);
    }
    // Inventor: Overdrive (a Crafting check against its level's DC; extra damage on its Strikes).
    const overdrive = items.find((item) => item.slug === "overdrive" && item.type === "action");
    if (overdrive) {
        for (const item of items) if (item.slug === "overdrive") result.handled.add(item);
        fields.overdrive = { name: overdrive.name, modifier: statValue(actor.skills?.crafting), intMod: ability("int"), level };
    }
    // Gunslinger (C17–C19): its slinger's reload (one action that reloads and does
    // something else), its deed when initiative is rolled, and Cover Fire.
    const SLINGERS_RELOADS = { "clear-a-path": "shove", "reloading-strike": "strike", "raconteurs-reload": "demoralize-or-diversion", "covered-reload": null, "thoughtful-reload": null, "touch-and-go": null };
    for (const item of items) {
        if (item.type === "action" && Object.hasOwn(SLINGERS_RELOADS, item.slug)) {
            fields.slingersReload = { name: item.name, then: SLINGERS_RELOADS[item.slug] };
            result.handled.add(item);
        }
        if (item.slug === "living-fortification") {
            fields.livingFortification = strikes.some((strike) => strike.firearm && strike.parry) ? 2 : 1;
            result.handled.add(item);
        }
        if (item.slug === "one-shot-one-kill") {
            fields.firstShot = { dice: level >= 15 ? 3 : level >= 9 ? 2 : 1 };
            result.handled.add(item);
        }
        if (item.slug === "energy-shot") {
            fields.energyShots = 3;
            result.handled.add(item);
        }
        if (item.slug === "ten-paces") {
            fields.initiativeBonus = 2;
            result.handled.add(item);
        }
        if (item.slug === "cover-fire" && strikes.some((strike) => strike.firearm && !strike.melee)) activity(item, { coverFire: true, oncePerRound: true });
    }
    // Magus (C20): Spellstrike, with the PC's own spells; Arcane Cascade is a stance (C13).
    const spellstrike = items.find((item) => item.slug === "spellstrike" && item.type === "action");
    if (spellstrike) {
        for (const item of items) if (["spellstrike", "recharge-spellstrike"].includes(item.slug)) result.handled.add(item);
        fields.spellstrike = { name: spellstrike.name };
    }
    // Commander (C21–C24): tactics answered by allies in the banner's aura (30 feet):
    // Strike Hard!, Pincer Attack; Set-Up Strike; Banner's Inspiration; Drilled Reactions.
    if (has("commanders-banner") || items.some((item) => (item.system?.traits?.value ?? []).includes("tactic"))) {
        const commander = { banner: 30, drilled: has("drilled-reactions") };
        for (const item of items) {
            if (item.slug === "strike-hard") commander.strikeHard = item.name;
            if (item.slug === "pincer-attack") commander.pincerAttack = item.name;
            if (item.slug === "banners-inspiration") {
                commander.bannersInspiration = item.name;
                commander.inspirationFlourish = flourish(item);
            }
            if (item.slug === "set-up-strike") activity(item, { setUp: true });
            if (["strike-hard", "pincer-attack", "banners-inspiration", "drilled-reactions", "commanders-banner", "tactics"].includes(item.slug)) result.handled.add(item);
        }
        fields.commander = commander;
    }
    // Sneak Attack and the like: their dice are read with each Strike.
    if (strikes.some((strike) => strike.offGuardExtra?.length)) for (const item of items) if (item.slug === "sneak-attack") result.handled.add(item);
    const reaction = items.find((item) => CHAMPION_REACTIONS.has(item.slug) && item.type === "action");
    if (reaction) {
        result.handled.add(reaction);
        // Its aura is where the reaction reaches.
        for (const item of items) if (item.slug === "champions-aura") result.handled.add(item);
        const slug = reaction.slug;
        fields.championReaction = {
            slug,
            name: reaction.name,
            self: slug === "selfish-shield" || slug === "iron-command",
            resistance: slug === "iron-command" ? 0 : slug === "selfish-shield" ? 2 + Math.floor(level / 2) : 2 + level,
            dice: level >= 19 ? 6 : level >= 16 ? 5 : level >= 12 ? 4 : level >= 9 ? 3 : level >= 5 ? 2 : 1
        };
    }
    return result;
}

function readGaps(actor, gaps, handled = new Set()) {
    for (const item of actor.itemTypes?.action ?? []) {
        const slug = item.slug ?? item.name.slugify?.() ?? item.name;
        // (A sheet's own copy of a basic action, such as Demoralize, is played as the basic action.)
        if (BUILT_IN_ACTIONS.has(slug) || handled.has(item) || (handled.basicSlugs?.has(slug))) continue;
        const type = item.system?.actionType?.value;
        if (type === "passive") {
            if (NOTABLE_PASSIVE.test(slug) || (item.system?.traits?.value ?? []).includes("aura")) gaps.push({ kind: "passive ability", name: item.name });
            continue;
        }
        gaps.push({ kind: type === "reaction" ? "reaction" : "ability", name: item.name });
    }
    for (const item of actor.itemTypes?.feat ?? []) {
        const type = item.system?.actionType?.value;
        const slug = item.slug ?? "";
        if (BUILT_IN_ACTIONS.has(slug) || handled.has(item)) continue;
        if (!type || type === "passive") {
            if (NOTABLE_PASSIVE.test(slug)) gaps.push({ kind: "passive ability", name: item.name });
            continue;
        }
        gaps.push({ kind: type === "reaction" ? "reaction" : "feat action", name: item.name });
    }
    for (const item of actor.itemTypes?.consumable ?? []) {
        const category = item.system?.category;
        if (["potion", "elixir", "scroll", "wand", "bomb", "oil", "talisman", "poison"].includes(category)) gaps.push({ kind: "consumable", name: item.name });
    }
}

const CORE_ID = "pf2e-resolution-core";
const ABILITY_MODULE_ID = "pf2e-automatic-ability-resolution";
const BASIC_ACTION_SKILLS = { demoralize: "intimidation", trip: "athletics", grapple: "athletics", shove: "athletics", disarm: "athletics", reposition: "athletics", feint: "deception", "create-a-diversion": "deception", "administer-first-aid": "medicine" };
// Natural attacks that lack PF2e's "unarmed" trait on some stat blocks: not held, so not disarmable.
const NATURAL_ATTACK = /\b(?:jaws?|bite|claws?|talons?|tail|tusks?|horns?|hoof|hooves|slam|fist|tentacles?|wings?|sting|stinger|pincers?|mandibles?|beak|foot|feet|body|antlers?|spines?|quills?|fangs?|tongue|tendrils?|vines?|branch|roots?|pseudopods?)\b/i;

// A creature's abilities with their plans (the ability module registers its
// compiler with the core), the basic actions it uses, and the rules the engine
// plays itself (Ferocity, Rend, Sneak Attack, Regeneration …). Returns
// { abilities, handled, builtins }, builtins being combatant fields (abilities.js addBuiltin).
async function readAbilities(actor, { fresh = false, gaps = [] } = {}) {
    const result = { abilities: [], handled: new Set(), builtins: { reactions: {}, rend: null }, castSpells: new Set() };
    const core = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api : null;
    const abilityModule = game.modules.get(ABILITY_MODULE_ID);
    if (!core || !abilityModule?.active) return result;
    const pc = actorKind(actor) === "pc";
    // A monster's abilities; a PC's feat actions that are a check or a save against a creature (Bon Mot, Dirty Trick; C15).
    const items = pc
        ? [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])].filter((item) => item.system?.actionType?.value === "action" && !BASIC_ACTION_SKILLS[item.slug] && item.slug !== "escape")
        : [...(actor.itemTypes?.action ?? [])];
    const prepared = items.length ? await core.registry.preparePlans(items) : [];
    result.pools = {};
    for (const { item, result: compiled } of prepared) {
        const plan = compiled?.plan;
        if (!plan) continue;
        // "Frequency once per minute" and longer: once a fight.
        const frequency = item.system?.frequency;
        const pool = frequency?.max && !["turn", "round"].includes(frequency.per) ? `frequency:${item.id}` : null;
        // Used in one of several ways (a dragon's two breath weapons): each way an ability of its own, sharing the
        // ability's recharge and frequency.
        if (plan.builtin === "modes") {
            const ways = pc ? [] : plan.modes.filter((mode) => mode.plan?.resolution);
            if (!ways.length) continue;
            if (pool) result.pools[pool] = frequency.value ?? frequency.max;
            result.handled.add(item);
            for (const mode of ways) result.abilities.push({ name: `${item.name} (${mode.name})`, plan: leanPlan(mode.plan), castRank: 1, dc: null, attack: null, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name });
            continue;
        }
        // It casts a spell or has its effects (Dominate, Turn to Mist; B37): one of its spells, at the ability's rank and DC.
        if (plan.builtin === "cast-spell") {
            const cast = pc ? null : await castAbility(actor, item, plan, core, gaps);
            if (!cast) continue;
            result.handled.add(item);
            result.castSpells.add(plan.spell.uuid);
            if (pool) result.pools[pool] = frequency.value ?? frequency.max;
            result.abilities.push({ ...cast, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null });
            continue;
        }
        if (plan.builtin) {
            if (!pc && addBuiltin(result.builtins, plan, item.name)) result.handled.add(item);
            continue;
        }
        if (!plan.resolution) continue;
        // (Not one with requirements the simulation can't check: "Requirements The bush is adjacent to a corpse", B52; it
        // checks a frightened or dying enemy nearby, Feed on Fear's, B83.)
        if (plan.requires && !plan.requiresFoe) continue;
        if (pc && !(["check", "save"].includes(plan.resolution.kind) && (plan.trigger?.event ?? "use") === "use")) continue;
        if (pool) result.pools[pool] = frequency.value ?? frequency.max;
        result.handled.add(item);
        // A PF2e effect it applies (Battle Cry), modelled at the creature's level.
        const effects = plan.resolution.kind === "effect" || Object.values(plan.resolution.outcomes ?? {}).some((row) => row?.nativeEffects?.length) ? await effectModels(plan, actor.level ?? 1) : undefined;
        result.abilities.push({ name: item.name, plan: leanPlan(plan), castRank: 1, dc: null, attack: null, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, ...(effects ? { effects } : {}) });
    }
    // Basic actions: every PC; a monster only those it's trained for (its stat block lists the skill). Anyone can Escape.
    const basics = abilityModule.api?.basicActions ?? {};
    result.handled.basicSlugs = new Set(Object.keys(basics));
    // (A monster's prepared data lists every skill; its source lists only the ones in its stat block.)
    const trained = actorKind(actor) === "pc" ? null : new Set(Object.keys(actor._source?.system?.skills ?? {}));
    // Administer First Aid needs a healer's toolkit: a PC's inventory shows it (a monster trained in Medicine is assumed to carry one).
    const toolkit = !trained && actor.items.some((item) => /^healers-toolkit/.test(item.slug ?? item.system?.slug ?? ""));
    for (const [slug, plan] of Object.entries(basics)) {
        if (!plan) continue;
        const skill = BASIC_ACTION_SKILLS[slug];
        if (skill && trained && !trained.has(skill)) continue;
        if (slug === "administer-first-aid" && !trained && !toolkit) continue;
        result.abilities.push({ name: plan.source?.name ?? slug, plan, castRank: 1, dc: null, attack: null, pool: null, kind: "basic" });
    }
    return result;
}
// An ability that casts a spell or has its effects (B37): the spell's plan from the core's registry (the spell module's),
// cast at the ability's rank and DC, or else the creature's: half its level rounded up (not below the spell's rank) and its
// best spell DC. null (a gap) for a spell the engine can't cast, or one needing a DC or an attack the creature hasn't got.
async function castAbility(actor, item, plan, core, gaps) {
    const spell = await fromUuid(plan.spell?.uuid ?? "").catch(() => null);
    if (!spell) return null;
    const [prepared] = await core.registry.preparePlans([spell]);
    const spellPlan = prepared?.result?.plan;
    if (!spellPlan) return null;
    const half = Math.min(10, Math.max(1, Math.ceil((actor.level ?? 1) / 2)));
    const castRank = plan.rank ?? (spell.isCantrip ? half : Math.max(Number(spell.system?.level?.value ?? 1), half));
    const best = bestSpellStatistic(actor);
    const dc = plan.dc ?? best?.dc ?? null;
    const attack = plan.attack ?? (plan.dc ? plan.dc - 10 : best?.attack ?? null);
    const check = spellPlan.resolution?.check;
    if ((check?.roll === "save" && dc == null) || (check?.roll === "attack" && attack == null)) return null;
    // (Its tradition, so it counts as magic: the text's, the creature's own innate magic's, or the spell's first.)
    const own = (actor.spellcasting?.regular ?? actor.spellcasting?.contents ?? []).find((entry) => !entry.isRitual && !entry.flags?.[ABILITY_MODULE_ID]?.abilityCast)?.tradition ?? null;
    const spec = { name: item.name, plan: leanPlan(spellPlan), castRank, dc, attack, tradition: plan.tradition ?? own ?? spell.system?.traits?.traditions?.[0] ?? null };
    // On itself only ("The vampire turns into a cloud of vapor, as the Vapor Form spell"): no target or range of the spell's.
    // (Before anything reads the plan: the engine keeps what it read of each plan.)
    if (plan.self) spec.plan.targeting = { ...(spec.plan.targeting ?? {}), area: null, range: null, target: null };
    if (!canCast({ spellPools: {} }, spec)) return null;
    spec.castsSpell = true;
    spec.effects = formLimits(spell, await effectModels(spellPlan, castRank));
    const missing = spellGaps(spec);
    if (missing.length) gaps.push({ kind: "ability, partly simulated", name: `${item.name}: ${missing.join(", ")}` });
    return spec;
}

// A form whose target can't attack or cast (Vapor Form: "It can't cast spells, activate items, or use actions that have the
// attack or manipulate trait"): its effects keep the creature from both. Returns the models.
const FORM_LOCK = /\bcan't cast spells\b[^.]*\battack\b/i;
function formLimits(spell, models) {
    if (FORM_LOCK.test(spell?.system?.description?.value ?? "")) for (const model of Object.values(models ?? {})) Object.assign(model, { noAttacks: true, noSpells: true });
    return models;
}

// The creature's best spell DC and attack, from its spellcasting entries (without its conditions), or null.
function bestSpellStatistic(actor) {
    let best = null;
    for (const entry of actor.spellcasting?.regular ?? actor.spellcasting?.contents ?? []) {
        const statistic = entry.statistic;
        if (!statistic || entry.isRitual || entry.flags?.[ABILITY_MODULE_ID]?.abilityCast) continue;
        const dc = stripConditions(statistic.dc?.value ?? 10, statistic.dc?.modifiers ?? statistic.modifiers ?? []);
        const attack = stripConditions(statistic.check?.mod ?? statistic.mod ?? 0, statistic.check?.modifiers ?? statistic.modifiers ?? []);
        if (!best || dc > best.dc) best = { dc, attack };
    }
    return best;
}

// Plan fields the engine never reads: left out of the snapshot sent to the worker.
const PLAN_EXTRAS = new Set(["compilerEvidence", "diagnostics", "delegations", "semanticCoverage", "rawText", "sourceText", "raw"]);

function leanPlan(plan) {
    return JSON.parse(JSON.stringify(plan, (key, value) => (PLAN_EXTRAS.has(key) ? undefined : value)));
}

// PF2e spell effects a plan applies, read once per session.
const effectItems = new Map();

async function effectItem(uuid) {
    if (!effectItems.has(uuid)) effectItems.set(uuid, await fromUuid(uuid).catch(() => null));
    return effectItems.get(uuid);
}

function conditionSlug(uuid) {
    const entry = fromUuidSync?.(uuid);
    return entry?.system?.slug ?? entry?.slug ?? entry?.name?.slugify?.() ?? null;
}

// The engine's models of the PF2e spell effects a plan applies, at the cast rank, and of the effects an effect
// plan applies (a monster's Battle Cry: PF2e's bestiary effects or a module's).
async function effectModels(plan, castRank) {
    const applied = [
        ...(plan?.resolution?.kind === "effect" ? plan.resolution.applications ?? [] : []).map((application) => application?.uuid),
        // …and the effects a save's or check's results apply (an ability's "Effect: Downcast" on a failure).
        ...Object.values(plan?.resolution?.outcomes ?? {}).flatMap((row) => (row?.nativeEffects ?? []).map((native) => native?.uuid))
    ].filter(Boolean);
    const uuids = [...new Set([...(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}/g) ?? []), ...applied])];
    const models = {};
    for (const uuid of uuids) {
        const item = await effectItem(uuid);
        if (item) models[uuid] = effectModel(item, { rank: castRank, conditionSlug });
    }
    return models;
}

// The creature's spells with their compiled plans, from its spellcasting
// entries (PF2e's own sheet data: prepared slots, spontaneous slots per rank,
// innate uses, focus points, cantrips). Plans come from the resolution core's
// registry; without it, or for a spell no family resolves, the spell is a gap.
// castSpells: the compendium spells its abilities cast (a vampire's Dominate ability): the ability is that spell, so its own
// copy in an entry (its innate Dominate) is left out.
async function readSpells(actor, gaps, { fresh = false, castSpells = new Set() } = {}) {
    const spells = [];
    const spellPools = {};
    // (Not the entries the ability module makes for an ability's casting: the ability is read with the abilities.)
    const entries = (actor.spellcasting?.regular ?? actor.spellcasting?.contents ?? []).filter((entry) => !entry.isRitual && !entry.flags?.[ABILITY_MODULE_ID]?.abilityCast);
    const registry = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api?.registry : null;
    const cantripRank = Math.min(10, Math.max(1, Math.ceil((actor.level ?? 1) / 2)));
    const listed = [];
    for (const entry of entries) {
        let data;
        try {
            data = await entry.getSheetData?.();
        } catch (error) {
            console.warn(`${MODULE_ID} | Couldn't read ${entry.name} on ${actor.name}.`, error);
        }
        if (!data?.groups) continue;
        const statistic = entry.statistic;
        const dc = stripConditions(statistic?.dc?.value ?? 10, statistic?.dc?.modifiers ?? statistic?.modifiers ?? []);
        const attack = stripConditions(statistic?.check?.mod ?? statistic?.mod ?? 0, statistic?.check?.modifiers ?? statistic?.modifiers ?? []);
        for (const group of data.groups) {
            const cantrips = group.id === "cantrips";
            const groupRank = cantrips ? cantripRank : Number(group.id) || 1;
            // Spontaneous casters share a rank's slots among its spells.
            const sharedPool = !cantrips && entry.isSpontaneous && group.uses ? `${entry.id}:${group.id}` : null;
            if (sharedPool) spellPools[sharedPool] = fresh ? group.uses.max ?? 0 : group.uses.value ?? 0;
            for (const [index, active] of (group.active ?? []).entries()) {
                const spell = active?.spell;
                if (!spell || spell.isRitual || castSpells.has(spell.sourceId ?? spell._stats?.compendiumSource)) continue;
                let pool = null;
                if (cantrips || spell.isCantrip) pool = null;
                else if (entry.isFocusPool || spell.isFocusSpell) {
                    pool = "focus";
                    spellPools.focus = fresh ? actor.system?.resources?.focus?.max ?? 0 : actor.system?.resources?.focus?.value ?? 0;
                } else if (sharedPool) pool = sharedPool;
                else if (entry.isPrepared) {
                    pool = `${entry.id}:${group.id}:${index}`;
                    spellPools[pool] = !fresh && active.expended ? 0 : 1;
                } else if (active.uses?.max) {
                    // Innate spells with a number of uses a day; without one, at will.
                    pool = `${entry.id}:${spell.id}`;
                    spellPools[pool] = fresh ? active.uses.max : active.uses.value ?? 0;
                }
                const castRank = active.castRank ?? (spell.isCantrip || spell.isFocusSpell ? cantripRank : groupRank);
                listed.push({ spell, name: spell.name, castRank, dc, attack, pool, tradition: entry.tradition ?? entry.system?.tradition?.value ?? null });
            }
        }
    }
    if (!listed.length) return { spells, spellPools };
    if (!registry) {
        for (const entry of listed) gaps.push({ kind: "spell", name: entry.name });
        return { spells, spellPools };
    }
    const unique = [...new Map(listed.map((entry) => [entry.spell.uuid, entry.spell])).values()];
    const prepared = new Map((await registry.preparePlans(unique)).map(({ item, result, error }) => [item.uuid, { result, error }]));
    for (const entry of listed) {
        const { result, error } = prepared.get(entry.spell.uuid) ?? {};
        const plan = result?.plan ? leanPlan(result.plan) : null;
        const spec = { name: entry.name, plan, castRank: entry.castRank, dc: entry.dc, attack: entry.attack, pool: entry.pool, tradition: entry.tradition, effects: plan ? formLimits(entry.spell, await effectModels(plan, entry.castRank)) : {} };
        if (!plan || !canCast({ spellPools: { [entry.pool]: 1 } }, spec)) {
            // Detect Magic, Translocate and the like: listed, but they don't count against the result.
            // (On the full plan: the slimmed one may have lost its effect references.)
            const utility = isUtility(result?.plan ?? plan);
            gaps.push({ kind: utility ? "utility spell" : "spell", name: error ? `${entry.name} (${error.message})` : entry.name });
            continue;
        }
        const missing = spellGaps(spec);
        if (missing.length) gaps.push({ kind: "spell, partly simulated", name: `${entry.name}: ${missing.join(", ")}` });
        spells.push(spec);
    }
    return { spells, spellPools };
}

// Actions that put an effect on the PC (stances such as Tiger Stance or
// Mountain Stance, Bespell Strikes): the effect's rules as the engine's effect
// model, as for spells, and any Strike it adds (Tiger Stance's tiger claw)
// read from PF2e with the effect on a copy of the PC. Raise a Shield, Rage,
// Hunt Prey and Devise a Stratagem have rules of their own. A free action with
// a trigger or a requirement isn't the planner's to choose; nor is a reaction.
const OWN_RULES = new Set(["raise-a-shield", "rage", "hunt-prey", "devise-a-stratagem"]);

async function readSelfEffects(actor, strikes, handled, gaps) {
    if (actorKind(actor) !== "pc") return [];
    const found = [];
    const level = actor.level ?? 1;
    for (const item of [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])]) {
        const uuid = item.system?.selfEffect?.uuid;
        const type = item.system?.actionType?.value;
        if (!uuid || handled.has(item) || OWN_RULES.has(item.slug) || !["action", "free"].includes(type)) continue;
        if (type === "free" && /<strong>\s*(?:Trigger|Requirements?)\s*<\/strong>/i.test(item.system?.description?.value ?? "")) continue;
        const effect = await effectItem(uuid);
        if (!effect) continue;
        const model = effectModel(effect, { rank: level, conditionSlug });
        // The PC's Strikes read from PF2e with the effect on: Strikes it adds (Tiger Claw), and how it
        // changes the others (Arcane Cascade's force damage, through rules the model can't read).
        const { added, attackDeltas, strikeDeltas } = await strikesWithEffect(actor, effect, strikes, gaps);
        const measured = Object.keys(attackDeltas).length || Object.keys(strikeDeltas).length;
        if (measured) {
            // PF2e's own numbers replace the model's attack and damage modifiers (counted once).
            model.modifiers = model.modifiers.filter((modifier) => !["attack", "damage"].includes(modifier.on));
            model.attackDeltas = attackDeltas;
            model.strikeDeltas = strikeDeltas;
            model.unsupported = model.unsupported.filter((key) => !["AdjustStrike", "ActiveEffectLike", "DamageDice", "FlatModifier"].includes(key));
        }
        model.unsupported = model.unsupported.filter((key) => key !== "Strike");
        const helps = model.modifiers.length || added.length || measured || model.tempHp || model.fastHealing || model.resistances.length || model.conditions.length;
        if (!helps) continue;
        handled.add(item);
        if (model.unsupported.length) gaps.push({ kind: "class feature, partly simulated", name: `${item.name}: ${model.unsupported.join(", ")}` });
        found.push({ name: item.name, actions: type === "free" ? 0 : Number(item.system?.actions?.value) || 1, stance: (item.system?.traits?.value ?? []).includes("stance"), model, strikes: added });
    }
    return found;
}

// The PC's Strikes as PF2e makes them with an effect on: those it doesn't have
// without it (added), and for the others the change to the attack bonus
// (attackDeltas) and the extra damage parts (strikeDeltas), by Strike name.
async function strikesWithEffect(actor, effect, strikes, gaps) {
    const result = { added: [], attackDeltas: {}, strikeDeltas: {} };
    // A choice the effect asks for when it's used (Arcane Cascade's damage type) is made
    // here: force, the stance's own, when offered, otherwise the first option.
    const source = effect.toObject();
    for (const rule of source.system?.rules ?? []) {
        if (rule?.key === "ChoiceSet" && rule.selection === undefined && Array.isArray(rule.choices) && rule.choices.length) rule.selection = (rule.choices.find((choice) => choice?.value === "force") ?? rule.choices[0])?.value;
    }
    let copy;
    try {
        copy = actor.clone({ items: [...actor._source.items, { ...source, _id: foundry.utils.randomID() }] }, { keepId: true });
    } catch (error) {
        gaps.push({ kind: "class feature, partly simulated", name: `${effect.name}: its Strikes (${error.message})` });
        return result;
    }
    const known = new Map(strikes.map((strike) => [strike.name, strike]));
    for (const action of copy.system?.actions ?? []) {
        if (action.type && action.type !== "strike") continue;
        const base = known.get(action.label);
        if (!base) {
            const strike = await readStrike(copy, action, gaps);
            if (strike) result.added.push({ ...strike, reach: strike.reach ?? copy.getReach?.({ action: "attack" }) ?? 5 });
            continue;
        }
        const bonus = stripConditions(action.totalModifier, action.modifiers) - base.bonus;
        if (bonus) result.attackDeltas[base.name] = bonus;
        try {
            const extra = extraDamageParts(parseReadableDamage(await action.damage({ getFormula: true })), base.damage);
            if (extra.length) result.strikeDeltas[base.name] = extra;
        } catch {
            // Its damage unreadable with the effect on: left as it is.
        }
    }
    return result;
}

// An exemplar's ikons (C25–C27). Its divine spark sits in one ikon at a time
// (PF2e's toggle roll option "divine-spark:<ikon>"). Each ikon's immanence is
// read from PF2e with that option on: extra damage on the PC's Strikes, and
// numeric bonuses its rules give under the option (Scar of the Survivor's +1
// Fortitude). Transcendence actions: Strike, Breathe, Rend (the ikon weapon's
// dice as spirit damage after a hit with it) and No Scar but This (healing).
async function readExemplar(actor, actions, strikes, handled) {
    if (actorKind(actor) !== "pc") return null;
    const items = [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])];
    const ikons = [];
    for (const item of items) {
        const spark = (item.system?.rules ?? []).find((rule) => rule?.key === "RollOption" && rule.option === "divine-spark");
        const slug = spark?.suboptions?.[0]?.value;
        if (!slug) continue;
        const option = `divine-spark:${slug}`;
        const strikeDeltas = {};
        for (const action of actions) {
            const base = strikes.find((strike) => strike.name === action.label);
            if (!base) continue;
            const extra = await situationalParts(action, base.damage, [option]);
            if (extra.length) strikeDeltas[base.name] = extra;
        }
        // Numeric bonuses its rules give with the spark in it (saves, AC).
        const modifiers = [];
        for (const rule of item.system?.rules ?? []) {
            if (rule?.key !== "FlatModifier" || !Number.isFinite(Number(rule.value))) continue;
            const predicate = JSON.stringify(rule.predicate ?? []);
            if (!predicate.includes(option)) continue;
            for (const selector of [].concat(rule.selector ?? [])) {
                const on = { ac: ["ac"], "saving-throw": ["fortitude", "reflex", "will"], fortitude: ["fortitude"], reflex: ["reflex"], will: ["will"] }[selector] ?? [];
                for (const stat of on) modifiers.push({ on: stat, type: rule.type ?? "untyped", value: Number(rule.value) });
            }
        }
        handled.add(item);
        ikons.push({ slug, name: item.name, model: { name: item.name, rounds: Infinity, modifiers, tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, attackDeltas: {}, strikeDeltas } });
    }
    if (!ikons.length) return null;
    const level = actor.level ?? 1;
    const transcendences = [];
    for (const item of items) {
        if (!(item.system?.traits?.value ?? []).includes("transcendence")) continue;
        const ikonItem = item.grantedBy ?? actor.items.get(item.flags?.pf2e?.grantedBy?.id ?? "");
        const ikon = ikons.find((entry) => entry.name === ikonItem?.name)?.slug ?? null;
        if (item.slug === "strike-breathe-rend") {
            const weapon = strikes.find((strike) => Object.keys(ikons.find((entry) => entry.slug === ikon)?.model.strikeDeltas ?? {}).includes(strike.name)) ?? null;
            if (weapon) transcendences.push({ kind: "rend", name: item.name, ikon, strike: weapon.name, dice: weapon.damage[0]?.dice ?? 1, die: weapon.damage[0]?.die ?? 6 });
        } else if (item.slug === "no-scar-but-this") transcendences.push({ kind: "heal", name: item.name, ikon, dice: Math.ceil(level / 2), die: 8 });
        else continue;
        handled.add(item);
    }
    for (const item of items) if (["shift-immanence", "divine-spark-and-ikons"].includes(item.slug)) handled.add(item);
    return { ikons, transcendences };
}

function hasItemSlug(actor, slugs) {
    return [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])].some((item) => slugs.has(item.slug));
}

function readShield(actor) {
    const shield = actor.attributes?.shield ?? actor.system?.attributes?.shield;
    if (!shield?.itemId || shield.destroyed) return null;
    return {
        ac: shield.ac ?? 2,
        hardness: shield.hardness ?? 0,
        hp: shield.hp?.value ?? 0,
        bt: shield.brokenThreshold ?? 0,
        broken: !!shield.broken,
        raised: !!shield.raised
    };
}

function readIwr(list) {
    return (list ?? []).map((entry) => ({
        type: entry.type,
        value: entry.value ?? 0,
        exceptions: (entry.exceptions ?? []).map((exception) => (typeof exception === "string" ? exception : exception?.label ?? exception?.type)).filter(Boolean)
    }));
}

export function actorKind(actor) {
    if (actor.type === "character") return "pc";
    if (actor.type === "hazard") return "hazard";
    if (["vehicle", "loot", "party"].includes(actor.type)) return "object";
    return "npc";
}

// Reads one actor into an engine combatant (without position or setup).
export async function readActor(actor, { id, name, fresh = false } = {}) {
    const gaps = [];
    const strikes = [];
    // Weapons that are carried but not held count too: a PC draws them when the
    // fight starts (the Interact action is not simulated).
    for (const action of actor.system?.actions ?? []) {
        if (action.type && action.type !== "strike") continue;
        const strike = await readStrike(actor, action, gaps);
        if (strike) strikes.push(strike);
        for (const alt of action.altUsages ?? []) {
            const altStrike = await readStrike(actor, alt, gaps);
            if (altStrike) strikes.push({ ...altStrike, name: `${altStrike.name} (${alt.item?.isThrown ? "thrown" : "alt"})` });
        }
    }
    const abilities = await readAbilities(actor, { fresh, gaps });
    const features = readClassFeatures(actor, strikes);
    for (const item of features.handled) abilities.handled.add(item);
    // A PC feat a class feature already plays (Battle Medicine) isn't also an ability; the item itself stays out of the snapshot.
    abilities.abilities = abilities.abilities.filter((ability) => !(ability.sourceItem && features.handled.has(ability.sourceItem)));
    for (const ability of abilities.abilities) delete ability.sourceItem;
    const selfEffects = await readSelfEffects(actor, strikes, abilities.handled, gaps);
    const exemplar = await readExemplar(actor, (actor.system?.actions ?? []).filter((action) => !action.type || action.type === "strike"), strikes, abilities.handled);
    readGaps(actor, gaps, abilities.handled);
    const { spells, spellPools } = await readSpells(actor, gaps, { fresh, castSpells: abilities.castSpells });
    spells.push(...abilities.abilities);
    // A Strike's riders are gaps unless an ability plays them.
    const riders = new Set(abilities.abilities.flatMap((ability) => (ability.plan?.trigger?.event === "strike" ? [ability.plan.trigger.attackEffect, ability.plan.source?.slug] : [])).filter(Boolean));
    for (const strike of strikes) for (const effect of strike.attackEffects ?? []) if (!riders.has(effect)) gaps.push({ kind: "attack effect", name: effect });
    if (!strikes.length && !spells.length && !["object", "hazard"].includes(actorKind(actor))) {
        // Swarms and troops attack with area abilities, which aren't simulated yet.
        gaps.push({ kind: "no Strikes", name: "can't attack in the simulation" });
    }
    const hp = actor.system?.attributes?.hp ?? { value: 0, max: 0, temp: 0 };
    const skills = {};
    for (const [slug, statistic] of Object.entries(actor.skills ?? {})) skills[slug] = statValue(statistic);
    const traits = [...(actor.traits ?? actor.system?.traits?.value ?? [])];
    const actorReach = actor.getReach?.({ action: "attack" }) ?? 5;
    for (const strike of strikes) if (strike.reach === null) strike.reach = actorReach;
    const kind = actorKind(actor);
    const conditions = fresh ? {} : readConditions(actor);
    const shield = readShield(actor);
    const spec = {
        id: id ?? actor.id,
        actorId: actor.id,
        actorUuid: actor.uuid,
        name: name ?? actor.name,
        kind,
        acts: kind !== "object",
        level: actor.level ?? 0,
        traits,
        hp: fresh ? { value: hp.max, max: hp.max, temp: 0 } : { value: hp.value ?? 0, max: hp.max ?? 0, temp: hp.temp ?? 0 },
        ac: stripConditions(actor.armorClass?.value ?? actor.system?.attributes?.ac?.value ?? 10, actor.armorClass?.modifiers ?? []),
        saves: {
            fortitude: statValue(actor.saves?.fortitude),
            reflex: statValue(actor.saves?.reflex),
            will: statValue(actor.saves?.will)
        },
        perception: statValue(actor.perception),
        stealth: skills.stealth ?? null,
        skills,
        speed: actor.attributes?.speed?.total ?? actor.system?.attributes?.speed?.value ?? 25,
        reach: actorReach,
        heroPoints: actor.system?.resources?.heroPoints?.value ?? 0,
        shield: fresh && shield ? { ...shield, broken: false, raised: false } : shield,
        ...abilities.builtins,
        ...features.fields,
        multiStrikes: [...(abilities.builtins.multiStrikes ?? []), ...(features.fields.multiStrikes ?? [])],
        ...(selfEffects.length ? { selfEffects } : {}),
        ...(exemplar ? { exemplar } : {}),
        reactions: { aoo: hasItemSlug(actor, AOO_SLUGS), shieldBlock: hasItemSlug(actor, new Set(["shield-block"])), ...abilities.builtins.reactions },
        size: actor.size ?? actor.system?.traits?.size?.value ?? "med",
        resistances: readIwr(actor.attributes?.resistances),
        weaknesses: readIwr(actor.attributes?.weaknesses),
        immunities: (actor.attributes?.immunities ?? []).map((entry) => entry.type),
        voidHealing: !!(actor.system?.attributes?.hp?.negativeHealing ?? actor.attributes?.hp?.negativeHealing),
        strikes,
        spells,
        spellPools: { ...spellPools, ...(abilities.pools ?? {}) },
        conditions,
        gaps
    };
    // A hazard (E4): its routine, Disable options and reactions.
    return kind === "hazard" ? hazardSpec(actor, spec) : spec;
}

// Default side from the actor and token disposition.
export function defaultSide(actor, disposition) {
    if (actor.type === "character") return "party";
    if (disposition === 1) return "party";
    return "foes";
}

function tokenObject(tokenDocument) {
    return tokenDocument?.object ?? null;
}

function distanceFeet(a, b) {
    if (!a || !b) return null;
    try {
        if (typeof a.distanceTo === "function") return a.distanceTo(b);
    } catch {
        // fall through
    }
    try {
        return canvas.grid.measurePath([a.center, b.center]).distance;
    } catch {
        return null;
    }
}

// Engagement groups and bands from token positions (spec: within reach →
// engaged, within 30 feet → near, otherwise far).
export function placeFromTokens(entries) {
    const parent = new Map(entries.map((entry) => [entry.combatant.id, entry.combatant.id]));
    const find = (id) => {
        while (parent.get(id) !== id) id = parent.get(id);
        return id;
    };
    const nearest = new Map();
    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const a = entries[i];
            const b = entries[j];
            if (a.combatant.side === b.combatant.side) continue;
            const distance = distanceFeet(tokenObject(a.token), tokenObject(b.token));
            if (distance === null) continue;
            for (const self of [a, b]) {
                const best = nearest.get(self.combatant.id);
                if (best === undefined || distance < best) nearest.set(self.combatant.id, distance);
            }
            const reach = Math.max(a.combatant.reach ?? 5, b.combatant.reach ?? 5);
            if (distance <= reach) parent.set(find(a.combatant.id), find(b.combatant.id));
        }
    }
    const groups = new Map();
    for (const entry of entries) {
        const root = find(entry.combatant.id);
        groups.set(root, (groups.get(root) ?? 0) + 1);
    }
    for (const entry of entries) {
        const c = entry.combatant;
        const root = find(c.id);
        const distance = nearest.get(c.id);
        if (groups.get(root) > 1) {
            c.band = "engaged";
            c.engagement = root;
        } else if (distance === undefined || distance <= 30) {
            c.band = "near";
        } else {
            c.band = "far";
        }
    }
}

// Flags are read directly so a read never throws, even before the module is active.
export function readFlag(document, key) {
    return document?.flags?.[MODULE_ID]?.[key] ?? null;
}

function profileFlag(actor) {
    return readFlag(actor, "profile") ?? {};
}

// The setup saved on an encounter, for the odds check and the logger. Elite and
// Weak trials are dropped: those use the actors as they are.
export function savedSetup(combat) {
    const saved = readFlag(combat, "setup") ?? {};
    const overrides = Object.fromEntries(Object.entries(saved.overrides ?? {}).map(([id, override]) => {
        const { adjust, ...rest } = override ?? {};
        void adjust;
        return [id, rest];
    }));
    return { setup: saved.setup ?? {}, overrides };
}

// The side a combatant fights on, from the saved setup or its disposition.
export function sideOf(combatant, overrides = {}) {
    return overrides[combatant.id]?.side ?? readFlag(combatant.actor, "profile")?.side ?? defaultSide(combatant.actor, combatant.token?.disposition);
}

// Applies saved creature settings: actor defaults, then per-run overrides.
function applyProfile(c, actorProfile, override) {
    const merged = { ...actorProfile, ...(override ?? {}) };
    if (merged.side) c.side = merged.side;
    if (merged.role) c.role = merged.role;
    if (merged.acts !== undefined) c.acts = merged.acts;
    const morale = {};
    for (const key of ["template", "boss", "leader", "group"]) if (merged[key] !== undefined && merged[key] !== "") morale[key] = merged[key];
    if (Object.keys(morale).length) c.morale = morale;
    // An alarm-raiser (escalations): "gong" or "runner".
    if (merged.alarm) c.alarm = merged.alarm;
    if (merged.arrivesRound) {
        c.arrivesRound = Number(merged.arrivesRound);
        c.arrivesBand = merged.arrivesBand ?? "near";
    }
}

// entries: [{ id, actor, token, name, initiative }]
export async function buildSnapshot(entries, { setup = {}, overrides = {}, fresh = false, combat = null, moraleRules = null } = {}) {
    const combatants = [];
    const placed = [];
    for (const entry of entries) {
        if (!entry.actor) continue;
        if (overrides[entry.id]?.include === false) continue;
        const c = await readActor(entry.actor, { id: entry.id, name: entry.name, fresh });
        c.side = defaultSide(entry.actor, entry.token?.disposition);
        if (entry.defeated && c.kind !== "pc") c.status = "dead";
        applyProfile(c, profileFlag(entry.actor), overrides[entry.id]);
        // Elite or Weak chosen for this run only (never saved on the actor).
        const adjust = overrides[entry.id]?.adjust;
        const adjusted = adjust === "elite" ? eliteAdjust(c) : adjust === "weak" ? weakAdjust(c) : c;
        combatants.push(adjusted);
        placed.push({ combatant: adjusted, token: entry.token });
    }
    if (canvas?.ready) placeFromTokens(placed.filter((entry) => tokenObject(entry.token)));
    const snapshot = { combatants, setup, moraleRules };
    // Map objectives (O1–O3): each creature's distance to the area and the exit, from the
    // scene's Regions; in play, the rounds already held.
    if (MAP_KINDS.has(setup.objective?.kind)) {
        const scene = combat?.scene ?? placed.find((entry) => entry.token?.parent)?.token.parent ?? canvas?.scene;
        const { feet, areaToExit } = readMapFeet(scene, setup.objective, placed);
        for (const c of combatants) if (feet.has(c.id)) c.mapFeet = feet.get(c.id);
        const objective = { ...setup.objective };
        if (areaToExit !== null) objective.areaToExit = areaToExit;
        if (objective.kind === "hold" && combat?.started) objective.held = roundsHeld(combat);
        snapshot.setup = { ...setup, objective };
    }
    if (setup.escalations?.rules?.length || combatants.some((c) => c.alarm)) readEscalations(snapshot, placed, combat);
    const pcs = combatants.filter((c) => c.kind === "pc");
    if (pcs.length) snapshot.partyLevel = Math.round(pcs.reduce((sum, c) => sum + c.level, 0) / pcs.length);
    if (combat && combat.started && combat.round > 0) {
        snapshot.round = combat.round;
        snapshot.turn = Math.max(0, combat.turn ?? 0);
        snapshot.order = combat.turns.map((turn) => turn.id).filter((id) => combatants.some((c) => c.id === id));
        const current = combat.turns[combat.turn]?.id;
        snapshot.turn = Math.max(0, snapshot.order.indexOf(current));
    }
    return snapshot;
}

// Escalations (E1–E4) from the scene and the tracker: each creature's place
// relative to the rules' Regions, the gong's distance, which of a rule's
// creatures are here already (visible tokens), and what has fired in play.
function readEscalations(snapshot, placed, combat) {
    const escalations = snapshot.setup.escalations ?? {};
    const scene = combat?.scene ?? placed.find((entry) => entry.token?.parent)?.token.parent ?? canvas?.scene;
    const rules = (escalations.rules ?? []).map((rule) => ({ ...rule, when: { ...rule.when }, then: { ...rule.then } }));
    const regions = new Set();
    for (const rule of rules) {
        if (rule.when.kind === "enters" && rule.when.region) regions.add(rule.when.region);
        if (rule.then.kind === "danger" && rule.then.targets === "region" && rule.then.region) regions.add(rule.then.region);
    }
    const gongRegion = escalations.gong?.region ?? null;
    const feet = readRegionFeet(scene, [...regions, ...(gongRegion ? [gongRegion] : [])], placed);
    for (const { combatant: c, token } of placed) {
        const own = feet.get(c.id) ?? {};
        if (regions.size) c.regionFeet = Object.fromEntries([...regions].map((region) => [region, own[region] ?? { to: Infinity, edge: 0 }]));
        if (c.alarm === "gong") c.gongFeet = gongRegion && own[gongRegion] ? own[gongRegion].to : (escalations.gong?.strides ?? 2) * (c.speed || 25);
        // A rule's creature whose token is showing is here already.
        if (rules.some((rule) => rule.then.kind === "arrive" && (rule.then.creatureIds ?? []).includes(c.id)) && token && !token.hidden) c.arrived = true;
    }
    // Coming in at a Region, with a map objective: that Region's distances to the area and the exit.
    const objective = snapshot.setup.objective;
    if (MAP_KINDS.has(objective?.kind)) {
        for (const rule of rules) {
            if (rule.then.kind !== "arrive" || !rule.then.placeRegion) continue;
            rule.then.placeFeet = regionToRegions(scene, rule.then.placeRegion, objective);
        }
    }
    // In play: the rounds the rules fired, and the alarm the GM ticked.
    const fired = combat?.started ? readFlag(combat, "escalationProgress")?.fired ?? {} : {};
    for (const rule of rules) if (rule.id && fired[rule.id] !== undefined) rule.fired = fired[rule.id];
    const alarm = combat?.started && escalations.alarm?.raisedRound ? { raisedRound: Number(escalations.alarm.raisedRound) } : null;
    snapshot.setup = { ...snapshot.setup, escalations: { ...escalations, rules, alarm } };
}

export function entriesFromCombat(combat) {
    return combat.turns.map((combatant) => ({
        id: combatant.id,
        actor: combatant.actor,
        token: combatant.token,
        name: combatant.name,
        defeated: combatant.isDefeated ?? combatant.defeated
    }));
}

export function entriesFromTokens(tokens) {
    return tokens.map((token) => ({
        id: token.document?.id ?? token.id,
        actor: token.actor,
        token: token.document ?? token,
        name: token.name ?? token.document?.name
    }));
}
