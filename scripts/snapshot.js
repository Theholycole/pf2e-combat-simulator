// Builds an engine snapshot from Foundry: a Combat in progress, or tokens.
// This is the only place that reads PF2e documents.

import { extraDamageParts, parseReadableDamage, randomDamageRows } from "../src/adapter/formula.js";
import { eliteAdjust, weakAdjust } from "../src/engine/adjust.js";
import { canCast, isUtility, poolCost, spellGaps } from "../src/engine/spells.js";
import { levelDC } from "../src/engine/checks.js";
import { beltHeld, bombRider, drawActions, hasTrigger, isBelt, itemTriggered, isStaffItem, itemCasts, itemEntry, itemFortune, itemReduceTrigger, itemStrikeActivity, verifiedPlan, SPELL_ITEMS, staffCharges, staffSpellList, trickSkills } from "../src/adapter/items.js";
import { maneuverWays, withReading } from "../src/engine/readings.js";
import { effectModel, iwrException, looseRetaliation, resolveAuraGrants, withSpellText } from "../src/engine/effects.js";
import { addBuiltin, PLAYED_REQUIRES, predicateOptions, shareRecharges } from "../src/engine/abilities.js";
import { requirementPlayable } from "../src/engine/needs.js";
import { markParts, toggleWays } from "../src/engine/toggles.js";
import { zoneSpell } from "../src/engine/zones.js";
import { strikeIwr, versatileTypes } from "../src/engine/damage.js";
import { immunityExceptions } from "../src/engine/immunities.js";
import { MAP_KINDS, readMapFeet, readRegionFeet, readSceneGrid, regionToRegions, roundsHeld } from "./map.js";
import { hazardSpec } from "./hazards.js";
import { asReserve, bestOption, bestPick, reserveCount, spellSummonEntry, summonEntries as spellSummons } from "../src/engine/summons.js";
import { HEX_FAMILIARS } from "../src/engine/familiars.js";

export const MODULE_ID = "pf2e-combat-simulator";

// Modifiers that come from conditions. The engine applies conditions itself,
// so they are taken out of snapshot values.
const CONDITION_SLUGS = new Set([
    "frightened", "sickened", "clumsy", "enfeebled", "drained", "stupefied", "off-guard",
    "prone", "fatigued", "blinded", "dazzled", "grabbed", "restrained", "paralyzed", "unconscious", "encumbered"
]);

// (S22: Trick Magic Item, played with the scrolls and wands it lets the creature use.)
const BUILT_IN_ACTIONS = new Set(["reactive-strike", "attack-of-opportunity", "shield-block", "raise-a-shield", "stride", "step", "strike", "trick-magic-item"]);
const AOO_SLUGS = new Set(["reactive-strike", "attack-of-opportunity"]);
const NOTABLE_PASSIVE = /sneak-attack|regeneration|fast-healing|frightful-presence|pack-attack|ferocity|deny-advantage|aura|swarm-mind|rage/;
// Strike traits that need no simulation: modelled by the engine, already in
// PF2e's damage formula (two-hand, propulsive, versatile), or only labels
// (damage types, elements, materials).
const MODELLED_TRAITS = new Set([
    "attack", "agile", "finesse", "magical", "unarmed", "deadly", "fatal", "nonlethal", "brutal", "reach",
    "forceful", "sweep", "backswing", "backstabber", "volley",
    // (B306: "range-increment-30" — the range the Strike's weapon carries, read with it.)
    "thrown", "reload", "range", "range-increment", "versatile", "light", "holy", "unholy", "adamantine", "cold-iron", "silver",
    // (B309: sacred traits and twin, played; legacy alignments as holy and unholy, lawful and chaotic as labels; and traits that change
    // nothing about a Strike in range bands — no mounts, objects, or reloading pace here — or only name the effect's kind.)
    "sanctified", "good", "evil", "lawful", "chaotic", "twin", "infused", "tethered", "jousting", "razing", "modular",
    "death", "disease", "auditory", "time", "plant", "fungus", "radiation", "concentrate", "impulse", "illusion", "visual", "emotion", "light", "darkness",
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
    // (T3: "versatile-fire" — a versatile trait of any type — is versatile's.)
    return trait.replace(/-(\d+d)?\d+$/, "").replace(/-d\d+$/, "").replace(/-[a-z]$/, "").replace(/^versatile-[a-z]+$/, "versatile");
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

// (B255, tableDamage: a Strike with no damage of its own whose damage a table gives — Generate Bomb's bomb.)
async function readStrike(actor, action, gaps, { tableDamage = null } = {}) {
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
    // (U2: a bomb — a thrown consumable weapon, a PC's or the one an NPC's Strike links to: its stack a pool (strike.ammo), taken out before
    // each throw unless in hand (a reload of 1), or with Quick Bomber as part of the Strike; an alchemist's infused reagents make more with
    // Quick Alchemy.)
    const weapon = item?.type === "weapon" ? item : item?.linkedWeapon ?? null;
    const weaponTraits = traitList(weapon?.system?.traits?.value);
    const bomb = Boolean(weapon) && weaponTraits.includes("consumable") && ((weapon.group ?? weapon.system?.group) === "bomb" || weaponTraits.includes("bomb"));
    // (U6: from a worn belt, every throw's draw is free, as Quick Bomber's.)
    const quickBomber = bomb && (hasItemSlug(actor, new Set(["quick-bomber"])) || belted(weapon));
    const bombDraw = bomb && !quickBomber ? (weapon.isStowed ? retrieveActions(weapon) : 1) : 0;
    let damage = [];
    let critDamage = null;
    if (tableDamage) {
        // (Doubled on a critical hit as the engine doubles: no formula of PF2e's own.)
        damage = tableDamage;
    } else try {
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
    // (T6: the critical specialization PF2e gives this Strike — a fighter's weapon mastery, a rogue's tricks, Weapon Master.)
    const critSpec = critSpecialization(actor, item);
    // (I2: what its damage carries for weaknesses and resistances — magical, holy, a tradition; its material, group and property runes.)
    const iwr = strikeIwr([...traits, ...(item?.isMagical ? ["magical"] : [])], { material: item?.system?.material?.type ?? null, group: item?.group ?? item?.system?.group ?? null, runes: item?.system?.runes?.property ?? [], name: action.label ?? item?.name ?? "" });
    return {
        name: action.label,
        // Riders the Strike lists (grab, knockdown, push); a gap unless an ability plays them.
        attackEffects: [...(item?.system?.attackEffects?.value ?? [])],
        // A weapon in hand (Disarm can knock it away); fists, jaws and claws can't be.
        // (B313: a Strike PF2e links to a weapon item, or named as the creature's weapon or one of PF2e's base weapons; not a lava bomb,
        // a force blast or a rock.)
        held: !unarmed && (item?.type === "weapon" || (item?.type === "melee" && heldWeapon(actor, item, action.label ?? item?.name ?? ""))),
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
        ...(bomb ? { ammo: { pool: `item:${weapon.id}`, count: Number(weapon.quantity ?? weapon.system?.quantity ?? 1) || 0, reagents: quickAlchemy(actor) && weaponTraits.includes("alchemical"), startsEmpty: !quickBomber && weapon.system?.equipped?.carryType !== "held" }, consumable: true, ...(quickBomber ? {} : { reload: bombDraw }) } : {}),
        // C16: firearms' and bombs' traits; the group for gunslinger deeds.
        ...(traits.includes("concussive") ? { concussive: true } : {}),
        // (B308: holy or unholy, for a reaction to damage of that trait; B309: and the weakness to it — sanctified by the creature's own,
        // legacy good and evil as holy and unholy — and twin's bonus.)
        ...(traits.includes("holy") || traits.includes("good") ? { holy: true } : {}), ...(traits.includes("unholy") || traits.includes("evil") ? { unholy: true } : {}),
        ...(traits.includes("sanctified") ? { sanctified: true } : {}), ...(traits.includes("twin") ? { twin: true } : {}),
        ...(traits.includes("splash") ? { splashKind: "bomb" } : traits.some((trait) => /^scatter-\d+$/.test(trait)) ? { splashKind: "scatter" } : {}),
        // How much splash: PF2e's readable formula folds it into the total, so it's read from the item
        // (a scatter weapon's 1 per weapon die; a bomb's listed splash; an NPC's splash damage roll).
        ...(splashAmount(item, traits) > 0 ? { splashAmount: splashAmount(item, traits) } : {}),
        ...(["firearm", "crossbow"].includes(item?.group ?? item?.system?.group) ? { firearm: true } : {}),
        // (2026-10-16: its ammunition, PF2e's ammo base type — for an arrow used with it, Roc-Shaft Arrow's.)
        ...((weapon ?? item)?.system?.ammo?.baseType ? { ammoType: (weapon ?? item).system.ammo.baseType } : {}),
        // (U14: a crossbow, the gunslinger's but not a firearm — a spellgun's "firearm attack roll" isn't its.)
        ...((item?.group ?? item?.system?.group) === "crossbow" ? { crossbow: true } : {}),
        ...(traits.includes("parry") ? { parry: true } : {}),
        ...(iwr ? { iwr } : {}),
        // (T3: the types its versatile traits let it deal instead; T6: its critical specialization.)
        ...(versatileTypes(traits).length ? { versatile: versatileTypes(traits) } : {}),
        ...(critSpec ? { critSpec: true } : {}),
        damage,
        critDamage
    };
}

// Its senses' types ("darkvision", "low-light-vision" …), however PF2e holds them.
export function readSenses(actor) {
    const held = actor?.perception?.senses ?? actor?.system?.perception?.senses ?? [];
    const list = Array.isArray(held) ? held : typeof held.values === "function" ? [...held.values()] : Array.isArray(held.contents) ? held.contents : [];
    return [...new Set(list.map((sense) => (typeof sense === "string" ? sense : sense?.type)).filter(Boolean))];
}

function readFlies(actor) {
    // (PF2e 8.6: system.movement.speeds — Eternal Wings' fly Speed; the older attributes.speed.otherSpeeds before it.)
    if ((Number(actor?.system?.movement?.speeds?.fly?.value) || 0) > 0) return true;
    const speeds = actor?.attributes?.speed?.otherSpeeds ?? actor?.system?.attributes?.speed?.otherSpeeds ?? [];
    return speeds.some((speed) => speed?.type === "fly" && (Number(speed.total ?? speed.value) || 0) > 0);
}

// Its land Speed with everything PF2e counts (2026-10-15: PF2e 8.6 moved it to system.movement.speeds.land; before, attributes.speed).
function landSpeed(actor) {
    const moved = Number(actor?.system?.movement?.speeds?.land?.value);
    if (Number.isFinite(moved) && moved > 0) return moved;
    return actor.attributes?.speed?.total ?? actor.system?.attributes?.speed?.value ?? 25;
}

function deathAt(actor, kind) {
    const max = Number(actor?.system?.attributes?.dying?.max);
    return kind === "pc" && Number.isFinite(max) ? max + (Number(actor.system?.attributes?.doomed?.value) || 0) : 4;
}

// What its initiative adds to its Perception (Incredible Initiative's +2), when it rolls Perception for initiative.
function initiativeOver(actor, perception) {
    const initiative = actor?.system?.initiative ?? actor?.initiative;
    if ((initiative?.statistic ?? "perception") !== "perception") return 0;
    const total = Number(initiative?.totalModifier ?? initiative?.mod);
    return Number.isFinite(total) && Number.isFinite(perception) ? Math.max(0, total - perception) : 0;
}

// (L1: the scene's light, for an environment set to "auto": its darkness level.)
export function sceneLight(scene) {
    const level = Number(scene?.environment?.darknessLevel ?? scene?.darkness ?? 0);
    return level >= 0.75 ? "dark" : level >= 0.25 ? "dim" : "bright";
}

// Whether PF2e's critical specialization synthetics give this Strike its group's effect (they return its notes and dice, none when not).
function critSpecialization(actor, item) {
    const synthetics = actor?.synthetics?.criticalSpecializations;
    if (!synthetics || !item?.group) return false;
    let options;
    try {
        options = new Set([...(actor.getRollOptions?.(["all", "strike-damage", "damage"]) ?? []), ...(item.getRollOptions?.("item") ?? [])]);
    } catch {
        return false;
    }
    return [...(synthetics.standard ?? []), ...(synthetics.alternate ?? [])].some((synthetic) => {
        try {
            const effect = synthetic?.(item, options);
            return Array.isArray(effect) && effect.length > 0;
        } catch {
            return false;
        }
    });
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
        (result.fields.strikeActivities ??= []).push({ name: item.name, actions: Number(item.system?.actions?.value) || 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null, traits: [...(item.system?.traits?.value ?? [])], ...(flourish(item) ? { flourish: true } : {}), ...fields });
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
        // (C29, Sacred Defender: its resistances are PF2e's rules; a natural 20 against it doesn't improve the result.)
        if (item.slug === "sacred-defender") {
            fields.noNaturalTwenty = true;
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
    readChampionSheet(actor, { items, find, level, fields, result, activity, meleeWeapons });
    return result;
}

// A champion's sheet, and the feats a two-handed fighter takes (C30–C34, 2026-10-15; the user's champion Riah: "Can we try to simulate her
// whole character sheet as much as possible").
const ZERO_RIDER = { conditions: [], critical: null, push: null, damage: [], save: null, size: null };
function readChampionSheet(actor, { items, find, level, fields, result, activity, meleeWeapons }) {
    const take = (slug) => {
        const item = find(slug);
        if (item) result.handled.add(item);
        return item;
    };
    const intimidation = Number(actor.skills?.intimidation?.rank ?? 0);
    const equipment = [...(actor.itemTypes?.equipment ?? []), ...(actor.itemTypes?.armor ?? [])].filter((item) => item.isInvested !== false);
    const worn = (pattern) => equipment.find((item) => pattern.test(String(item.slug ?? item.name ?? "").toLowerCase()));
    // (C30: Retributive Strike's upgrades — Relentless Reaction's persistent spirit damage, Exalted Reaction's allies' Strikes, Instrument of
    // Zeal's critical hit, Swift Retribution's quickened turn, a Helm of Zeal's Divine Fervor.)
    const reaction = fields.championReaction;
    if (reaction) {
        const justice = reaction.slug === "retributive-strike";
        if (justice && take("relentless-reaction")) reaction.relentless = { amount: Math.max(1, Number(actor.abilities?.cha?.mod ?? 0)), type: "spirit" };
        if (justice && take("exalted-reaction")) reaction.exalted = { penalty: 5 };
        if (take("instrument-of-zeal")) reaction.zeal = true;
        if (take("swift-retribution")) reaction.swift = true;
        if (worn(/^helm-of-zeal/)) reaction.fervor = true;
        // (Blessed Counterstrike: at the enemy that set off its reaction since its last turn, a weapon die more; a hit leaves the enemy
        // weak to its side's Strikes — half its level — until its next turn.)
        const counter = take("blessed-counterstrike");
        if (counter) activity(counter, { requires: "champion-triggered", extraWeaponDice: 1, zeal: Boolean(reaction.zeal), onHit: { ...ZERO_RIDER, weakness: Math.floor(level / 2) } });
    }
    // (C31, Smite: a mark — +3 status damage, +4 with master proficiency, +4/+6 against the opposite sanctification — Hunt Prey's parts. It
    // lasts while the enemy keeps up its hostility, as it does in a fight; another Smite moves it.)
    const smite = take("smite");
    if (smite && !fields.huntPrey) {
        const master = Math.max(...["simple", "martial", "advanced", "unarmed"].map((key) => Number(actor.system?.proficiencies?.attacks?.[key]?.rank ?? 0))) >= 3;
        const options = actor.rollOptions?.all ?? {};
        const opposite = options["sanctification:holy"] || options["self:trait:holy"] ? "unholy" : options["sanctification:unholy"] || options["self:trait:unholy"] ? "holy" : null;
        fields.huntPrey = { edge: "parts", every: true, name: "Smite", parts: [{ dice: 0, die: 0, bonus: master ? 4 : 3, ...(opposite ? { upgrade: { trait: opposite, value: master ? 6 : 4 } } : {}) }] };
    }
    // (C31, Oath of the Slayer: 1, 2 or 3 spirit damage on Strikes against its sworn kind, doubled after one sets off its reaction.)
    const oath = find("oath-of-the-slayer");
    const sworn = oath?.flags?.pf2e?.rulesSelections?.oathOfTheSlayer;
    if (sworn) {
        result.handled.add(oath);
        fields.oath = { trait: sworn, value: level >= 14 ? 3 : level >= 7 ? 2 : 1 };
    }
    // (C32, Fearsome Brute: double — triple with master Intimidation — a frightened target's value to its Strikes' damage.)
    if (take("fearsome-brute")) fields.fearsomeBrute = intimidation >= 3 ? 3 : 2;
    // (C32, Battle Cry: a free Demoralize as initiative is rolled; legendary in Intimidation, its reaction to Demoralize after a critical hit.)
    if (take("battle-cry")) fields.battleCry = { reaction: intimidation >= 4 };
    // (C32, a Dread Blindfold: a creature that first sees it attempts a Will save at DC 37 or is frightened 1.)
    if (worn(/^dread-blindfold/)) fields.dreadGaze = { dc: 37, value: 1 };
    // (C33, Hero's Defiance: an attack that would drop it — its Hit Points first, a Focus Point, once until it Refocuses.)
    const defiance = (actor.itemTypes?.spell ?? []).find((item) => item.slug === "heros-defiance");
    const heal = /recover (\d+d\d+(?:\s*\+\s*\d+)?) Hit Points/i.exec(String(defiance?.system?.description?.value ?? "").replace(/<[^>]+>/g, " "))?.[1]?.replace(/\s+/g, "");
    if (heal) fields.heroesDefiance = { heal };
    // (C33, Immortal Bastion: its deflect — +2 circumstance to AC against melee attacks and 10 temporary HP to its next turn — and, once a
    // day, 1 Hit Point and 100 temporary ones instead of dropping.)
    if (worn(/^immortal-bastion/)) {
        fields.lastStand = { name: "Immortal Bastion", tempHp: 100 };
        fields.selfEffects = [...(fields.selfEffects ?? []), { name: "Deflect (Immortal Bastion)", actions: 1, model: { name: "Deflect (Immortal Bastion)", rounds: 1, modifiers: [{ on: "ac", type: "circumstance", value: 2 }], tempHp: 10, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 } }];
    }
    // (C34, a two-handed weapon's feats: Brutal Finish, Avalanche Strike, Shatter Defenses, Infernal Interference, March of Law.)
    const twoHanded = meleeWeapons.find((strike) => strike.hands === 2) ?? null;
    const finish = take("brutal-finish");
    if (finish && twoHanded) activity(finish, { strike: twoHanded.name, press: true, extraWeaponDice: level >= 18 ? 2 : 1, endsTurn: true, failureDice: level >= 18 ? 2 : 1 });
    const shatter = take("shatter-defenses");
    if (shatter) activity(shatter, { requires: "frightened", press: true, shatter: true });
    const avalanche = take("avalanche-strike");
    if (avalanche && twoHanded) fields.multiStrikes = [...(fields.multiStrikes ?? []), { name: avalanche.name, actions: 3, strikes: [twoHanded.name], each: true, sameMap: true, flourish: true }];
    const infernal = take("infernal-interference");
    const main = meleeWeapons[0] ?? null;
    if (infernal && main) fields.multiStrikes = [...(fields.multiStrikes ?? []), { name: infernal.name, actions: 2, strikes: [main.name, main.name], sameTarget: true, flourish: true,
        hitRiders: [{ atLeast: 1, conditions: [{ slug: "stupefied", value: 1, rounds: 1 }], noReactions: true }, { atLeast: 2, conditions: [{ slug: "stupefied", value: 3, rounds: 1 }] }] }];
    if (take("march-of-law")) fields.marchOfLaw = { name: "March of Law", frightened: 2, speedBonus: 10 };
    // (Divine Wings with Eternal Wings: the fly Speed for good, read with its Speeds. Diabolic Certitude: Recall Knowledge about devils — nothing
    // in a fight.)
    if (Number(actor.system?.movement?.speeds?.fly?.value) > 0) take("divine-wings");
    take("diabolic-certitude");
    // (C35, Vital Luminance: a focus spell, heightened to half its level; its reservoir 4 at 1st rank and a point more each rank, each turn.)
    if ((actor.itemTypes?.spell ?? []).some((item) => item.slug === "vital-luminance")) {
        const rank = Math.max(1, Math.ceil(level / 2));
        fields.vitalLuminance = { name: "Vital Luminance", start: 3 + rank, perTurn: 3 + rank };
    }
}

// (B303: the skills a creature's abilities name for its own initiative — "rolls Deception or Stealth for initiative" — by the ability
// module's reading.)
function readInitiativeSkills(actor) {
    const abilityModule = game.modules.get(ABILITY_MODULE_ID);
    const read = abilityModule?.active ? abilityModule.api?.initiativeSkills : null;
    if (!read) return [];
    const skills = new Set();
    for (const item of [...(actor.itemTypes?.action ?? []), ...(actor.itemTypes?.feat ?? [])]) {
        if (!/initiative/i.test(item.system?.description?.value ?? "")) continue;
        for (const skill of read(item)) skills.add(skill);
    }
    return [...skills];
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
    // (Scrolls and wands: readSpells' since S22. U1: those the item module's plans play, readConsumables'.)
    for (const item of actor.itemTypes?.consumable ?? []) {
        const category = item.system?.category;
        if (!handled.has(item) && ["potion", "elixir", "mutagen", "bomb", "oil", "talisman", "poison"].includes(category)) gaps.push({ kind: "consumable", name: item.name });
    }
}

export const CORE_ID = "pf2e-resolution-core";
export const ABILITY_MODULE_ID = "pf2e-automatic-ability-resolution";
const BASIC_ACTION_SKILLS = { demoralize: "intimidation", trip: "athletics", grapple: "athletics", shove: "athletics", disarm: "athletics", reposition: "athletics", feint: "deception", "create-a-diversion": "deception", "administer-first-aid": "medicine" };
// A melee Strike that is a weapon in hand (B313): PF2e links it to a weapon item, the creature carries a weapon of its name, or its name is
// one of PF2e's base weapons. (Before, any Strike not named like a natural attack — a lava bomb, a force blast, a rock.)
function heldWeapon(actor, item, name) {
    if (item.linkedWeapon || item.flags?.pf2e?.linkedWeapon) return true;
    const lower = String(name).toLowerCase();
    if ((actor.itemTypes?.weapon ?? []).some((weapon) => weapon.name.toLowerCase() === lower)) return true;
    const bases = globalThis.CONFIG?.PF2E?.baseWeaponTypes ?? {};
    const slug = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return slug in bases || Object.values(bases).some((label) => String(globalThis.game?.i18n?.localize?.(label) ?? label).toLowerCase() === lower);
}

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
        // (B312: a requirement the ability module couldn't read — "is standing in deep water": a state the simulation can't see, so not
        // played, and listed.)
        if (plan.requirementUnread) {
            result.handled.add(item);
            gaps.push({ kind: "unseen requirement", name: `${item.name}: ${plan.requirementUnread}` });
            continue;
        }
        // (B303: more reactions a reaction grants with itself — the grindylow's Reactive Strike, a hardscale's Shield Block.)
        if (!pc && plan.reactions && plan.builtin !== "passive-rules") addBuiltin(result.builtins, { builtin: "passive-rules", reactions: plan.reactions }, item.name);
        // "Frequency once per minute" and longer: once a fight.
        const frequency = item.system?.frequency;
        // (B230: once a fight in the ability's words, "can't be used again until 1 hour has passed" — plan.oncePerFight.)
        const pool = frequency?.max && !["turn", "round"].includes(frequency.per) ? `frequency:${item.id}` : plan.oncePerFight ? `once:${item.id}` : null;
        // Used in one of several ways (a dragon's two breath weapons): each way an ability of its own, sharing the
        // ability's recharge and frequency.
        // (B255: a random effect table — one ability, its die picking the way when used; a way it can't play does nothing.)
        if (plan.builtin === "modes" && plan.random) {
            const shown = pc ? null : plan.modes.find((mode) => mode.plan?.resolution);
            if (!shown) continue;
            if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
            result.handled.add(item);
            result.abilities.push({ name: item.name, plan: leanPlan(shown.plan), castRank: 1, dc: null, attack: null, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name, die: Number(/^(?:\d+)d(\d+)$/.exec(plan.random.formula)?.[1]) || 1, dice: Number(/^(\d+)d\d+$/.exec(plan.random.formula)?.[1]) || 1, randomWays: plan.modes.map((mode) => ({ name: mode.name, faces: mode.faces, plan: mode.plan?.resolution ? leanPlan(mode.plan) : null, ...(mode.again ? { again: mode.again } : {}) })) });
            continue;
        }
        // (B256: an area that lasts — one ability, its zone played over the turns.)
        if (plan.builtin === "zone") {
            const effectModel = !pc && plan.zone.effect ? (await effectModels({ resolution: { outcomes: { success: { nativeEffects: [plan.zone.effect] } } } }, actor.level ?? 1))[plan.zone.effect.uuid] ?? null : null;
            const effects = Object.assign({}, ...(await Promise.all((pc ? [] : plan.zone.saves ?? []).map((save) => effectModels(save.plan, actor.level ?? 1)))));
            const spell = pc ? null : zoneSpell(item.name, plan, { effectModel, effects });
            if (!spell) continue;
            if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
            result.handled.add(item);
            result.abilities.push({ ...spell, plan: leanPlan(spell.plan), dc: null, attack: null, pool, sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name });
            continue;
        }
        if (plan.builtin === "modes") {
            // (B286: not with a requirement the simulation can't check — the ability's own or a way's: Inject Venom's last Strike, Shifting
            // Tempo's grab.)
            // (B304: or needs it checks.)
            const unmet = (entry) => !requirementPlayable(entry, PLAYED_REQUIRES);
            if (unmet(plan)) continue;
            const ways = pc ? [] : plan.modes.filter((mode) => mode.plan?.resolution && !unmet(mode.plan));
            // (B179, the mocking dragon's Hilarious Exhalation: a way that casts a spell — that spell, as a cast-spell ability's.)
            const casts = [];
            for (const mode of pc ? [] : plan.modes.filter((entry) => entry.plan?.builtin === "cast-spell")) {
                const cast = await castAbility(actor, item, mode.plan, core, gaps);
                if (!cast) continue;
                result.castSpells.add(mode.plan.spell.uuid);
                casts.push({ ...cast, name: `${item.name} (${mode.name})` });
            }
            // (B307: ways that are zones — Trail of Runes' detonating or entangling runes: each a zone ability, sharing the ability's recharge.)
            const zoneWays = pc || ways.length || casts.length ? [] : plan.modes.filter((mode) => mode.plan?.builtin === "zone");
            for (const mode of zoneWays) {
                const way = { ...mode.plan, actions: mode.plan.actions ?? plan.actions };
                const effectModel = way.zone.effect ? (await effectModels({ resolution: { outcomes: { success: { nativeEffects: [way.zone.effect] } } } }, actor.level ?? 1))[way.zone.effect.uuid] ?? null : null;
                const effects = Object.assign({}, ...(await Promise.all((way.zone.saves ?? []).map((save) => effectModels(save.plan, actor.level ?? 1)))));
                const spell = zoneSpell(`${item.name} (${mode.name})`, way, { effectModel, effects });
                if (!spell) continue;
                if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
                result.handled.add(item);
                result.abilities.push({ ...spell, plan: leanPlan(spell.plan), dc: null, attack: null, pool, sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name });
            }
            if (zoneWays.length && result.handled.has(item)) continue;
            // (B307: a choice PF2e holds as a toggle — Ablative Adaptation's material: its ways from the creature's rules, the best taken as the
            // fight starts. Not one already switched on: PF2e's numbers have it.)
            if (!pc && plan.modes.length && plan.modes.every((mode) => mode.plan?.builtin === "roll-option") && !plan.modes.some((mode) => actor.rollOptions?.all?.[mode.plan.option])) {
                const toggle = toggleWays(actor.items, plan, item.name);
                if (toggle) {
                    result.builtins.toggles = [...(result.builtins.toggles ?? []), ...toggle];
                    result.handled.add(item);
                    continue;
                }
            }
            // (B273: ways that are builtins — stances, self-effects, sweeps — the first one, as the creature's choice.)
            const built = pc || ways.length || casts.length ? null : plan.modes.find((mode) => mode.plan?.builtin && !["no-effect", "modes"].includes(mode.plan.builtin));
            if (built) {
                if (addBuiltin(result.builtins, built.plan, item.name)) result.handled.add(item);
                continue;
            }
            if (!ways.length && !casts.length) continue;
            if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
            result.handled.add(item);
            for (const mode of ways) result.abilities.push({ name: `${item.name} (${mode.name})`, plan: leanPlan(mode.plan), castRank: 1, dc: null, attack: null, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name });
            for (const cast of casts) result.abilities.push({ ...cast, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: item.name });
            continue;
        }
        // It casts a spell or has its effects (Dominate, Turn to Mist; B37): one of its spells, at the ability's rank and DC.
        if (plan.builtin === "cast-spell") {
            const cast = pc ? null : await castAbility(actor, item, plan, core, gaps);
            if (!cast) continue;
            result.handled.add(item);
            result.castSpells.add(plan.spell.uuid);
            if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
            result.abilities.push({ ...cast, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null });
            continue;
        }
        // (The GM's — behind a state the simulator can't see, out of combat, a one-off adventure creature's; the user's choice of 2026-10-12:
        // not played here, so still listed among what the simulation leaves out.)
        if (plan.builtin === "no-effect" && plan.gm) continue;
        // (B308: a mark whose bonus is its toggle's rules — Smite's +4 damage, Spirit Hunter's +2 spirit: Hunt Prey with that damage.)
        if (!pc && plan.builtin === "hunt-prey" && !plan.edge && plan.toggle) {
            const parts = markParts(actor.items, plan.toggle);
            if (parts.length) {
                result.builtins.huntPrey = { edge: "parts", parts, every: true };
                result.handled.add(item);
            }
            continue;
        }
        if (plan.builtin) {
            // (Its traits with it, for a Strike activity's concentrate.)
            if (!pc && addBuiltin(result.builtins, { ...plan, traits: plan.traits ?? [...(item.system?.traits?.value ?? [])] }, item.name)) result.handled.add(item);
            continue;
        }
        if (!plan.resolution) continue;
        // (Not one with requirements the simulation can't check: "Requirements The bush is adjacent to a corpse", B52; it
        // checks a frightened or dying enemy nearby, Feed on Fear's, B83.)
        // (B304: a requirement read into needs the simulation checks — Consume Flesh's corpse, Suck Blood's grab.)
        if (!requirementPlayable(plan, PLAYED_REQUIRES)) continue;
        if (pc && !(["check", "save"].includes(plan.resolution.kind) && (plan.trigger?.event ?? "use") === "use")) continue;
        if (pool) result.pools[pool] = frequency?.value ?? frequency?.max ?? 1;
        result.handled.add(item);
        // A PF2e effect it applies (Battle Cry), modelled at the creature's level.
        // (2026-10-20: also an affliction's stage Effects.)
        const effects = plan.resolution.kind === "effect" || Object.values(plan.resolution.outcomes ?? {}).some((row) => row?.nativeEffects?.length) || (plan.resolution.afflictionHandoff?.stages ?? []).some((stage) => stage?.effects?.length) ? await effectModels(plan, actor.level ?? 1) : undefined;
        // (B262: its recharge by name, shared with another ability's when it says so — a reshaped Breath Weapon's.)
        result.abilities.push({ name: item.name, plan: leanPlan(plan), castRank: 1, dc: null, attack: null, pool, kind: "ability", sourceItem: item, actionType: item.system?.actionType?.value ?? null, rechargeGroup: plan.sharesRecharge ?? item.name, ...(effects ? { effects } : {}) });
    }
    // (B318: abilities that name each other's recharge, one recharge.)
    shareRecharges(result.abilities);
    // (B302: a PC's passives that PF2e's rules hold — Evasion, Juggernaut, Bravery, Deny Advantage, Surprise Attack — read as a monster's are,
    // by the ability module's own compiler: the core's registry hands it only a PC's check actions.)
    const compileAbility = abilityModule.api?.compileAbility;
    if (pc && compileAbility) {
        for (const item of (actor.itemTypes?.feat ?? []).filter((entry) => entry.system?.actionType?.value === "passive")) {
            let plan = null;
            try {
                plan = compileAbility(item);
            } catch {
                plan = null;
            }
            if (plan?.builtin === "passive-rules" && addBuiltin(result.builtins, plan, item.name)) result.handled.add(item);
        }
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
    spec.effects = formLimits(spell, withSpellText(await effectModels(spellPlan, castRank), spell, castRank));
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

export function leanPlan(plan) {
    return JSON.parse(JSON.stringify(plan, (key, value) => (PLAN_EXTRAS.has(key) ? undefined : value)));
}

// PF2e spell effects a plan applies, read once per session.
const effectItems = new Map();

async function effectItem(uuid) {
    if (!effectItems.has(uuid)) {
        let item = await fromUuid(uuid).catch(() => null);
        // (2026-10-22: a module's spell linking its own effect as PF2e's — "Compendium.pf2e.spell-effects.Item.…" with the id of one in the
        // module's pack, Dynamic Fly's —: that id in an installed module's Item pack.)
        const id = String(uuid ?? "").split(".").pop();
        if (!item && /^[A-Za-z0-9]{16}$/.test(id)) {
            for (const pack of game.packs.filter((each) => each.documentName === "Item" && each.metadata?.packageType === "module")) {
                if (!pack.index?.get?.(id)) continue;
                item = await pack.getDocument(id).catch(() => null);
                if (item) break;
            }
        }
        effectItems.set(uuid, item);
    }
    return effectItems.get(uuid);
}

function conditionSlug(uuid) {
    const entry = fromUuidSync?.(uuid);
    return entry?.system?.slug ?? entry?.slug ?? entry?.name?.slugify?.() ?? null;
}

// The engine's models of the PF2e spell effects a plan applies, at the cast rank, and of the effects an effect
// plan applies (a monster's Battle Cry: PF2e's bestiary effects or a module's).
export async function effectModels(plan, castRank) {
    // (A zone's save with no plan of its own — Trail of Runes' runes: none.)
    if (!plan) return {};
    const applied = [
        ...(plan?.resolution?.kind === "effect" ? plan.resolution.applications ?? [] : []).map((application) => application?.uuid),
        // …and the effects a save's or check's results apply (an ability's "Effect: Downcast" on a failure).
        ...Object.values(plan?.resolution?.outcomes ?? {}).flatMap((row) => (row?.nativeEffects ?? []).map((native) => native?.uuid)),
        // …and an affliction's stage Effects ("Effect: Grit (Stage 1)", 2026-10-20).
        ...(plan?.resolution?.afflictionHandoff?.stages ?? []).flatMap((stage) => (stage?.effects ?? []).map((effect) => effect?.uuid))
    ].filter(Boolean);
    const uuids = [...new Set([...(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}/g) ?? []), ...applied])];
    const models = {};
    for (const uuid of uuids) {
        const item = await effectItem(uuid);
        if (!item) continue;
        const model = effectModel(item, { rank: castRank, conditionSlug });
        // (An aura's granted effects — Protector's Sphere's —, fetched first: resolveAuraGrants reads them as they come.)
        const granted = new Map();
        for (const grant of model.auraGrants ?? []) granted.set(grant.uuid, await effectItem(grant.uuid));
        models[uuid] = resolveAuraGrants(model, (id) => granted.get(id) ?? null, { rank: castRank, conditionSlug });
    }
    return models;
}

// The creature's spells with their compiled plans, from its spellcasting
// entries (PF2e's own sheet data: prepared slots, spontaneous slots per rank,
// innate uses, focus points, cantrips). Plans come from the resolution core's
// registry; without it, or for a spell no family resolves, the spell is a gap.
// castSpells: the compendium spells its abilities cast (a vampire's Dominate ability): the ability is that spell, so its own
// copy in an entry (its innate Dominate) is left out.
// A spellcasting statistic's spell DC and attack, conditions aside.
function castingNumbers(statistic) {
    return {
        dc: stripConditions(statistic?.dc?.value ?? 10, statistic?.dc?.modifiers ?? statistic?.modifiers ?? []),
        attack: stripConditions(statistic?.check?.mod ?? statistic?.mod ?? 0, statistic?.check?.modifiers ?? statistic?.modifiers ?? [])
    };
}

async function readSpells(actor, gaps, { fresh = false, castSpells = new Set() } = {}) {
    const spells = [];
    const spellPools = {};
    const summons = [];
    // (Not the entries the ability module makes for an ability's casting: the ability is read with the abilities.)
    let entries = (actor.spellcasting?.regular ?? actor.spellcasting?.contents ?? []).filter((entry) => !entry.isRitual && !entry.flags?.[ABILITY_MODULE_ID]?.abilityCast);
    // (S22: PF2e Dailies' staves and spell servers, entries of their own beside PF2e's. A staff Dailies prepared replaces a
    // spellcasting entry of the staff's name — the iconics' "Staff of Fire" — which would cast its spells a second time.)
    const charged = [...(actor.spellcasting?.contents ?? [])].filter((entry) => entry.category === "charges" && !entries.includes(entry));
    const preparedStaves = new Set(charged.filter((entry) => entry.isStaff).map((entry) => String(entry.name ?? "").trim().toLowerCase()));
    if (preparedStaves.size) entries = entries.filter((entry) => entry.category === "charges" || !preparedStaves.has(String(entry.name ?? "").trim().toLowerCase()));
    const registry = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api?.registry : null;
    const cantripRank = Math.min(10, Math.max(1, Math.ceil((actor.level ?? 1) / 2)));
    const listed = [];
    for (const entry of [...entries, ...charged]) {
        let data;
        try {
            data = await entry.getSheetData?.(charged.includes(entry) ? { spells: actor.spellcasting.collections?.get(entry.id) } : undefined);
        } catch (error) {
            console.warn(`${MODULE_ID} | Couldn't read ${entry.name} on ${actor.name}.`, error);
        }
        if (!data?.groups) continue;
        const { dc, attack } = castingNumbers(entry.statistic);
        // (S22: charges — a staff's, as PF2e Dailies keeps them — each spell its rank in them, a cantrip free.)
        const chargePool = (data.isCharges || entry.category === "charges") && data.uses ? `charges:${entry.id}` : null;
        if (chargePool) spellPools[chargePool] = fresh ? data.uses.max ?? 0 : data.uses.value ?? 0;
        const from = charged.includes(entry) ? { from: entry.name, item: entry.item?.id ?? entry.id } : {};
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
                else if (chargePool) pool = chargePool;
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
                // (L5: a coven's spells, castable only with the coven.)
                const extra = { ...from, ...(pool && pool === chargePool ? { poolCost: castRank } : {}) };
                listed.push({ spell, name: spell.name, castRank, dc, attack, pool, tradition: entry.tradition ?? entry.system?.tradition?.value ?? null, ...(/\bcoven\b/i.test(entry.name ?? "") ? { coven: true } : {}), extra });
            }
        }
    }
    listed.push(...consumableSpells(actor, gaps, { fresh, spellPools }));
    // (Without PF2e Dailies' staff: the staff read as Dailies reads it.)
    if (!charged.some((entry) => entry.isStaff)) listed.push(...await staffSpells(actor, gaps, { spellPools, cantripRank }));
    if (!listed.length) return { spells, spellPools };
    if (!registry) {
        for (const entry of listed) gaps.push({ kind: "spell", name: entry.name });
        return { spells, spellPools };
    }
    const unique = [...new Map(listed.map((entry) => [entry.spell.uuid, entry.spell])).values()];
    const prepared = new Map((await registry.preparePlans(unique)).map(({ item, result, error }) => [item.uuid, { result, error }]));
    for (const entry of listed) {
        const { result, error } = prepared.get(entry.spell.uuid) ?? {};
        // (2026-10-14: the simulator's own reading of a spell the compiler leaves without a plan — Evil Eye.)
        // (Read before it's slimmed: the readings use the rows' own words.)
        const plan = result?.plan ? leanPlan(withReading(result.plan)) : null;
        const spec = { name: entry.name, plan, castRank: entry.castRank, dc: entry.dc, attack: entry.attack, pool: entry.pool, tradition: entry.tradition, ...(entry.coven ? { coven: true } : {}), ...entry.extra, effects: plan ? formLimits(entry.spell, withSpellText(await effectModels(plan, entry.castRank), entry.spell, entry.castRank)) : {} };
        // (A touch burn its text gives the caster with no effect to carry it — Shroud of Flame's, 2026-10-22.)
        const loose = plan && plan.resolution?.kind !== "retaliation" ? looseRetaliation(spec.effects, entry.spell, entry.castRank) : null;
        if (loose) spec.selfRetaliation = loose;
        // (Shield, the spell: the magic shield the creature raises by casting it — the engine's Raise a Shield and Shield Block.)
        const shield = Object.values(spec.effects ?? {}).find((model) => model?.spellShield)?.spellShield;
        if (shield) {
            spells.push({ ...spec, spellShield: shield });
            continue;
        }
        // (Telekinetic Maneuver: a way per basic action it names, with the caster's spell attack — one cast between them.)
        const ways = maneuverWays(plan, game.modules.get(ABILITY_MODULE_ID)?.api?.basicActions);
        if (ways.length) {
            for (const way of ways) spells.push({ ...spec, name: way.name, plan: way.plan, effects: {} });
            continue;
        }
        // (A summon spell: its creature as the engine's summons play them — its reserves made with the snapshot.)
        const summoned = spellSummonEntry(spec, entry.pool ? spellPools[entry.pool] : 2);
        if (summoned) {
            summons.push(summoned);
            continue;
        }
        if (!plan || !canCast({ spellPools: { [entry.pool]: poolCost(spec) }, covenReady: true, desperate: true }, spec)) {
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
    return { spells, spellPools, summons: spellSummons(summons) };
}

// S22, scrolls, wands and spell gems at hand (the user: "can we get the simulator to treat scrolls, wands and staffs as spells the
// creature can cast?"), as PF2e casts them: by the spellcasting that can cast the item's spell (the best DC, as PF2e picks), or for
// a PC with Trick Magic Item through its skill check first (the item level's DC; then the spell DC and attack PF2e gives a trick).
// A scroll is used up; a wand casts once a day, and once that's spent it can be overcharged once — while the fight goes badly.
function consumableSpells(actor, gaps, { fresh, spellPools }) {
    const listed = [];
    const casting = [...(actor.spellcasting?.contents ?? [])].filter((entry) => entry.statistic && !["charges", "items"].includes(entry.category));
    const tricks = (actor.itemTypes?.feat ?? []).some((feat) => feat.slug === "trick-magic-item");
    for (const item of actor.itemTypes?.consumable ?? []) {
        const category = item.category ?? item.system?.category;
        if (!SPELL_ITEMS.includes(category) || !item.system?.spell) continue;
        // (Not identified: not one PF2e lets it cast from.)
        if (item.isIdentified === false) {
            gaps.push({ kind: "item, unidentified", name: item.name });
            continue;
        }
        // (Stowed: taken out first — the user, 2026-10-14, on a stowed Scroll of Wails of the Damned listed as not simulated. PF2e's own
        // cost to retrieve a stowed item: 1 Interact, 2 from a backpack or a container meant to be held. A wand stays in hand after;
        // each scroll is taken out for its cast.)
        // (Worn too, since 2026-10-15: the user, "Worn items take an action to take out"; none from a belt.)
        const drawn = itemDraw(item);
        const draw = drawn > 0 ? { actions: drawn, each: category !== "wand" } : null;
        let spell = null;
        try {
            spell = item.embeddedSpell;
        } catch {
            spell = null;
        }
        if (!spell) continue;
        const casts = itemCasts({ category, quantity: item.quantity, uses: item.system?.uses, fresh });
        const overcharge = category === "wand" && !item.isBroken && !item.isDestroyed;
        if (!casts && !overcharge) continue;
        const canCastIt = (entry) => {
            try {
                return entry.canCast(spell, { origin: item });
            } catch {
                return false;
            }
        };
        const entry = casting.filter(canCastIt).reduce((best, each) => (!best || (each.statistic.dc?.value ?? 0) > (best.statistic.dc?.value ?? 0) ? each : best), null);
        let statistic = entry?.statistic ?? null;
        let tradition = entry?.tradition ?? [...(spell.traditions ?? [])][0] ?? null;
        let trick = null;
        if (!entry && tricks) {
            const traditions = [...(item.system?.traits?.value ?? []), ...(spell.traditions ?? [])];
            const best = trickSkills(traditions).map((skill) => {
                const check = actor.skills?.[skill]?.check ?? actor.skills?.[skill];
                return { skill, modifier: stripConditions(check?.mod ?? 0, check?.modifiers ?? []) };
            }).reduce((top, each) => (!top || each.modifier > top.modifier ? each : top), null);
            let trickEntry = null;
            try {
                trickEntry = best ? actor.spellcasting.get(`trick-${best.skill}`) : null;
            } catch {
                trickEntry = null;
            }
            if (trickEntry?.statistic) {
                statistic = trickEntry.statistic;
                tradition = trickEntry.tradition ?? tradition;
                trick = { skill: game.i18n?.localize?.(CONFIG.PF2E?.skills?.[best.skill]?.label ?? "") || best.skill, modifier: best.modifier, dc: levelDC(item.level ?? 1) };
            }
        }
        if (!statistic) {
            gaps.push({ kind: "item, can't cast its spell", name: item.name });
            continue;
        }
        const pool = `item:${item.id}`;
        spellPools[pool] = casts;
        // (U1: a scroll or a spell gem is used up — a PC's weighed as a consumable; a wand's cast comes back.)
        const base = { spell, name: spell.name, castRank: spell.rank, ...castingNumbers(statistic), pool, tradition, extra: { from: item.name, item: item.id, ...(category !== "wand" ? { consumable: true } : {}), ...(trick ? { trick } : {}), ...(draw ? { draw } : {}) } };
        listed.push(base);
        if (overcharge) {
            spellPools[`overcharge:${item.id}`] = 1;
            listed.push({ ...base, pool: `overcharge:${item.id}`, extra: { ...base.extra, from: `${item.name} (overcharged)`, overcharge: pool } });
        }
    }
    return listed;
}

// U1 (2026-10-15), consumables: the item module's plans (registered with the core) for the creature's potions, elixirs, mutagens,
// talismans and the like, as actions it can take — each stack its uses; taken out first unless held (PF2e's Interact: 1 worn, more
// stowed). A monster uses them freely; a PC weighs them (consumables.js). Without the item module, they stay among the gaps.
async function readConsumables(actor, gaps, { fresh = false, handled = new Set(), strikes = [] } = {}) {
    const result = { spells: [], spellPools: {}, activities: [], fortunes: [], reduceTriggers: [], triggered: [] };
    const feats = [...(actor.itemTypes?.feat ?? []), ...(actor.itemTypes?.action ?? [])].map((feat) => feat.slug).filter(Boolean);
    const core = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api : null;
    const items = (actor.itemTypes?.consumable ?? []).filter((item) => !SPELL_ITEMS.includes(item.category ?? item.system?.category) && (Number(item.quantity ?? item.system?.quantity ?? 1) || 0) > 0);
    // (2026-10-16: its ammunition used by Striking — Big Rock Bullet —, through the item module's compileActivations.)
    for (const activity of await ammoActivities(actor, { fresh, feats })) {
        result.spellPools[activity.pool] = activity.casts;
        result.activities.push(activity);
    }
    if (!core || !items.length) return result;
    let prepared = [];
    try {
        prepared = await core.registry.preparePlans(items);
    } catch {
        return result;
    }
    for (const { item, result: compiled } of prepared) {
        // (A third-party item's own Effect only when its rules match its text, as the item module plays it.)
        const plan = compiled?.plan ? await verifiedEffects(compiled.plan) : null;
        // (Not the item module's plan: none here.)
        if (!plan?.item) continue;
        if (item.isIdentified === false) {
            handled.add(item);
            gaps.push({ kind: "item, unidentified", name: item.name });
            continue;
        }
        // (U13: a talisman that lowers a condition as it's gained — Lion Badge, for a PC expert in Will saves.)
        const reducing = itemReduceTrigger(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, fresh });
        if (reducing) {
            if (reducing.requires === "expert-will" && actorKind(actor) === "pc" && !(Number(actor.saves?.will?.rank) >= 2)) continue;
            handled.add(item);
            result.spellPools[reducing.pool] = reducing.casts;
            result.reduceTriggers.push(reducing);
            continue;
        }
        // (U11: a roll-twice talisman — Gorum's Tear, Eye of Apprehension — used as its roll comes; Eye of Apprehension for a master in
        // Perception.)
        if (plan.builtin === "roll-twice") {
            const fortune = itemFortune(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, fresh });
            // (A monster has no proficiency ranks: its stat block carries it, so it qualifies.)
            if (!fortune || (fortune.requires === "master-perception" && actorKind(actor) === "pc" && !(Number(actor.perception?.rank) >= 3))) continue;
            handled.add(item);
            result.spellPools[fortune.pool] = fortune.casts;
            result.fortunes.push(fortune);
            continue;
        }
        // (U7: one used by Striking — Fear Gem: a Strike activity, its stack its pool.)
        if (plan.strike) {
            const activity = itemStrikeActivity(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, fresh, feats });
            if (!activity) continue;
            if (activity.riderSpell) activity.riderSpell.effects = await effectModels(activity.riderSpell.plan, activity.riderSpell.castRank);
            handled.add(item);
            result.spellPools[activity.pool] = activity.casts;
            result.activities.push(activity);
            continue;
        }
        const draw = itemDraw(item);
        // (U3: one that casts a spell — the spell module's plan for it.)
        const cast = plan.builtin === "cast-spell" ? await itemCast(item, plan, core) : null;
        // (U4: an injury poison its Strikes list among their attack effects: delivered by their hits.)
        const slug = item.slug ?? item.system?.slug ?? null;
        const onStrike = slug && strikes.some((strike) => (strike.attackEffects ?? []).includes(slug)) ? slug : null;
        // (U5: a lasting area's effects, for its zone, as an ability's.)
        const level = Number(item.level ?? item.system?.level?.value) || 1;
        const zone = plan.builtin === "zone" ? {
            effectModel: plan.zone?.effect ? (await effectModels({ resolution: { outcomes: { success: { nativeEffects: [plan.zone.effect] } } } }, level))[plan.zone.effect.uuid] ?? null : null,
            effects: Object.assign({}, ...(await Promise.all((plan.zone?.saves ?? []).map((save) => effectModels(save.plan, level)))))
        } : null;
        // (2026-10-16: one activated in answer to something its plan doesn't keep — Wolf Fang's Trip — isn't an action at will; U21: one
        // whose trigger the simulation plays, used as it comes.)
        const triggered = hasTrigger(item.system?.description?.value) || Boolean(plan.item?.activations?.[0]?.trigger);
        const trigger = triggered ? itemTriggered(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, fresh }) : null;
        if (trigger && !isUtility(trigger.plan)) {
            handled.add(item);
            result.spellPools[trigger.pool] = trigger.casts;
            result.triggered.push({ ...trigger, effects: { ...(trigger.effects ?? {}), ...(await effectModels(trigger.plan, trigger.castRank)) } });
            continue;
        }
        const entry = itemEntry(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, draw, fresh, cast, onStrike, zone, triggered });
        if (!entry) {
            if (triggered) gaps.push({ kind: "item, triggered (not simulated yet)", name: item.name });
            continue;
        }
        const spec = { ...entry, effects: { ...(entry.effects ?? {}), ...(await effectModels(entry.plan, entry.castRank)) } };
        // (A poison its Strikes deliver isn't an action of its own: its hits play it.)
        const rider = entry.plan.trigger?.event === "strike";
        if (isUtility(plan) || (!rider && !canCast({ spellPools: { [entry.pool]: entry.casts }, covenReady: true }, spec))) continue;
        const missing = spellGaps(spec);
        if (missing.length) gaps.push({ kind: "item, partly simulated", name: `${item.name}: ${missing.join(", ")}` });
        handled.add(item);
        result.spellPools[entry.pool] = entry.casts;
        result.spells.push(spec);
    }
    return result;
}

// (2026-10-16) Ammunition used by Striking — PF2e's "ammo" items, through the item module's compileActivations (Big Rock Bullet, Rattling
// Bolt): Strike activities with the weapons they fit (PF2e's craftableAs). Without the item module, none.
let activationCompiler;
async function ammoActivities(actor, { fresh = false, feats = [] } = {}) {
    const ammo = (actor.itemTypes?.ammo ?? []).filter((item) => (Number(item.quantity ?? item.system?.quantity ?? 1) || 0) > 0);
    if (!ammo.length) return [];
    activationCompiler ??= await import("../../pf2e-automatic-item-resolution/src/compiler/permanent.js").then((module) => module.compileActivations).catch(() => null);
    if (!activationCompiler) return [];
    const out = [];
    for (const item of ammo) {
        let activations = [];
        try {
            activations = activationCompiler(item) ?? [];
        } catch {
            activations = [];
        }
        const plan = activations.map((entry) => entry.plan).find((entry) => entry?.strike);
        const activity = plan ? itemStrikeActivity(leanPlan(plan), { id: item.id, name: item.name, quantity: item.quantity ?? item.system?.quantity, uses: item.system?.uses, fresh, feats, ammunition: item.system?.craftableAs ?? null }) : null;
        if (!activity) continue;
        if (activity.riderSpell) activity.riderSpell.effects = await effectModels(activity.riderSpell.plan, activity.riderSpell.castRank);
        out.push(activity);
    }
    return out;
}

// U22: a bomb Strike's riders — the item module's compileBomb on the bomb (a PC's weapon, or the one an NPC's Strike links to); without the
// item module, none.
let bombCompiler;
async function bombRiderOf(action, strikeName) {
    const weapon = action.item?.type === "weapon" ? action.item : action.item?.linkedWeapon ?? null;
    if (!weapon || (weapon.group ?? weapon.system?.group) !== "bomb") return null;
    bombCompiler ??= await import("../../pf2e-automatic-item-resolution/src/compiler/bombs.js").then((module) => module.compileBomb).catch(() => null);
    if (!bombCompiler) return null;
    let plan = null;
    try {
        plan = bombCompiler(weapon);
    } catch {
        plan = null;
    }
    return plan ? bombRider(plan, strikeName) : null;
}

// (2026-10-15) A third-party item's own linked Effect is played only when its rules match the item's text: the item module's
// verifyEffectRules (src/compiler/verify-effect.js), as its live play does. Without the item module's check, not at all.
let effectVerifier;
async function verifiedEffects(plan) {
    if (!(plan?.resolution?.applications ?? []).some((application) => application?.verify)) return plan;
    effectVerifier ??= await import("../../pf2e-automatic-item-resolution/src/compiler/verify-effect.js").then((module) => module.verifyEffectRules).catch(() => null);
    const verdicts = new Map();
    for (const application of plan.resolution.applications.filter((entry) => entry?.verify)) {
        const effect = effectVerifier ? await effectItem(application.uuid) : null;
        const rules = effect?.system?.rules ?? [];
        const conditionNames = Object.fromEntries(rules.filter((rule) => rule.key === "GrantItem" && rule.uuid).map((rule) => [String(rule.uuid).split(".").at(-1), conditionName(rule.uuid)]).filter(([, name]) => name));
        verdicts.set(application, Boolean(effect && effectVerifier(rules, application.verify, { conditionNames })?.ok));
    }
    return verifiedPlan(plan, (application) => verdicts.get(application) === true);
}

function conditionName(uuid) {
    try {
        return fromUuidSync?.(uuid)?.name ?? null;
    } catch {
        return null;
    }
}

// U3: the spell an item casts (Invisibility Potion), as the core's registry compiles it (the spell module's plan), at the item's rank; its DC
// and attack the item's own, else the DC for the item's level.
async function itemCast(item, plan, core) {
    const spell = await fromUuid(plan.spell?.uuid ?? "").catch(() => null);
    if (!spell) return null;
    const [prepared] = await core.registry.preparePlans([spell]);
    const spellPlan = prepared?.result?.plan;
    if (!spellPlan) return null;
    const dc = plan.dc ?? levelDC(Number(item.level ?? item.system?.level?.value) || 1);
    return { plan: leanPlan(withReading(spellPlan)), castRank: plan.rank ?? Number(spell.system?.level?.value) ?? 1, dc, attack: plan.attack ?? dc - 10 };
}

// The Interact actions to have an item in hand: none held or in a worn belt (U6), 1 worn, PF2e's retrieve cost stowed.
function itemDraw(item) {
    return drawActions({ carryType: item.system?.equipped?.carryType, stowed: Boolean(item.isStowed), retrieve: item.isStowed ? retrieveActions(item) : 1, belted: belted(item) });
}

// (U6: in a worn belt, among the four consumables of light Bulk it holds.)
function belted(item) {
    const belt = item.container;
    if (!belt || !isBelt({ name: belt.name, carryType: belt.system?.equipped?.carryType })) return false;
    const contents = [...(belt.contents ?? [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)).map((entry) => ({ id: entry.id, bulk: entry.system?.bulk?.value ?? 0, consumable: entry.type === "consumable" || (entry.system?.traits?.value ?? []).includes("consumable") }));
    return beltHeld(contents).includes(item.id);
}

// The Interact actions to take out a stowed item, as PF2e counts them for its weapons: 1 from a container in hand, 2 from a backpack or
// a container meant to be held, otherwise 1.
function retrieveActions(item) {
    const container = item.container;
    if (container?.isHeld) return 1;
    const usage = container?.system?.usage;
    return usage?.type === "held" || usage?.where === "backpack" ? 2 : 1;
}

// S22, a staff without PF2e Dailies, read as Dailies reads one: the spells its description lists by rank, its charges the creature's
// highest spell rank (none: it can't prepare a staff), each spell cast by the prepared or spontaneous spellcasting that can (the best
// DC), its rank in charges, a cantrip free. One staff a day: the highest level one it carries. (A staff with a spellcasting entry of
// its own name — the iconics' "Staff of Fire", spontaneous slots for its charges — is that entry's: read with the others.)
async function staffSpells(actor, gaps, { spellPools, cantripRank }) {
    const named = (value) => String(value ?? "").trim().toLowerCase();
    const entryNames = new Set((actor.spellcasting?.regular ?? []).map((entry) => named(entry.name)));
    const staves = [...(actor.itemTypes?.weapon ?? []), ...(actor.itemTypes?.equipment ?? [])]
        .filter((item) => isStaffItem({ type: item.type, traits: item.system?.traits?.value ?? [], magical: !!item.isMagical }));
    const staffNames = new Set(staves.map((item) => named(item.name)));
    const features = (actor.spellcasting?.regular ?? []).filter((entry) => (entry.isPrepared || entry.isSpontaneous) && !staffNames.has(named(entry.name)));
    const charges = staffCharges(features.map((entry) => entry.system?.slots), actor.level ?? 1);
    if (!charges) return [];
    const staff = staves.filter((item) => !entryNames.has(named(item.name))).sort((a, b) => (b.level ?? 0) - (a.level ?? 0))[0];
    if (!staff) return [];
    const listed = [];
    const pool = `staff:${staff.id}`;
    for (const { rank, uuid } of staffSpellList(staff.system?.description?.value ?? staff.description, charges)) {
        let spell = null;
        try {
            spell = await fromUuid(uuid);
        } catch {
            spell = null;
        }
        if (!spell || spell.type !== "spell") continue;
        const entry = features.filter((each) => {
            try {
                return each.canCast(spell, { origin: staff });
            } catch {
                return false;
            }
        }).reduce((best, each) => (!best || (each.statistic?.dc?.value ?? 0) > (best.statistic?.dc?.value ?? 0) ? each : best), null);
        if (!entry?.statistic) {
            gaps.push({ kind: "staff spell, not on its list", name: `${staff.name}: ${spell.name}` });
            continue;
        }
        const cantrip = !!spell.isCantrip || rank === 0;
        listed.push({ spell, name: spell.name, castRank: cantrip ? cantripRank : rank, ...castingNumbers(entry.statistic), pool: cantrip ? null : pool, tradition: entry.tradition ?? null, extra: { from: staff.name, item: staff.id, ...(cantrip ? {} : { poolCost: rank }) } });
    }
    if (listed.some((entry) => entry.pool)) spellPools[pool] = charges;
    return listed;
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

// (U2: an alchemist's Quick Alchemy, as PF2e's crafting tab finds it.)
function quickAlchemy(actor) {
    const options = actor.rollOptions?.all ?? {};
    return Boolean(options["feature:quick-alchemy"] || options["feat:quick-alchemy"]) && Boolean(actor.system?.resources?.crafting?.infusedReagents);
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
        // (I2: a custom exception with its definition, "magical silver"; a custom type with its own.)
        exceptions: (entry.exceptions ?? []).map(iwrException).filter(Boolean),
        ...(Array.isArray(entry.definition) && entry.definition.length ? { definition: entry.definition } : {}),
        // (I2: a resistance doubled against what it names — non-magical damage.)
        ...(entry.doubleVs?.length ? { doubleVs: [...entry.doubleVs] } : {}),
        // (T3: the ability that gives it, for one its share of Hit Points decides — Abandon Armor's, played from its rules instead.)
        ...(typeof entry.source === "string" ? { source: entry.source } : {})
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
    const bombRiders = [];
    // Weapons that are carried but not held count too: a PC draws them when the
    // fight starts (the Interact action is not simulated).
    for (const action of actor.system?.actions ?? []) {
        if (action.type && action.type !== "strike") continue;
        const strike = await readStrike(actor, action, gaps);
        if (strike) strikes.push(strike);
        // (U22: a bomb's riders, the item module's compileBomb.)
        const rider = strike?.ammo ? await bombRiderOf(action, strike.name) : null;
        if (rider) bombRiders.push(rider);
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
    // (B255: a table on a Strike with no damage of its own — the damage a die picks, its splash as a bomb's.)
    for (const table of abilities.builtins.randomStrikeTables ?? []) {
        const action = (actor.system?.actions ?? []).find((entry) => String(entry.label ?? entry.item?.name ?? "").toLowerCase() === String(table.strike).toLowerCase());
        const rows = randomDamageRows(table);
        const shown = rows.find((row) => row.damage.length);
        const strike = action && shown && !strikes.some((entry) => entry.name === action.label) ? await readStrike(actor, action, gaps, { tableDamage: shown.damage }) : null;
        if (strike) strikes.push({ ...strike, randomDamage: rows, randomDie: table.die, ...(rows.some((row) => row.damage.some((part) => part.splash)) ? { splashKind: "bomb" } : {}) });
    }
    delete abilities.builtins.randomStrikeTables;
    const consumables = await readConsumables(actor, gaps, { fresh, handled: abilities.handled, strikes });
    readGaps(actor, gaps, abilities.handled);
    const { spells, spellPools, summons: spellSummoned = [] } = await readSpells(actor, gaps, { fresh, castSpells: abilities.castSpells });
    // (U2: each bomb's stack; an alchemist's infused reagents, all of them after a rest.)
    for (const strike of strikes) if (strike.ammo) spellPools[strike.ammo.pool] = strike.ammo.count;
    if (strikes.some((strike) => strike.ammo?.reagents)) {
        const reagents = actor.system.resources.crafting.infusedReagents;
        spellPools.reagents = Number(fresh ? reagents.max : reagents.value) || 0;
    }
    spells.push(...consumables.spells);
    Object.assign(spellPools, consumables.spellPools);
    // (C33: Hero's Defiance, played as the champion's answer to a blow that would drop it — not a gap.)
    // (C35: Vital Luminance, played by luminance.js.)
    const played = new Set([...(features.fields.heroesDefiance ? ["Hero's Defiance"] : []), ...(features.fields.vitalLuminance ? ["Vital Luminance"] : [])]);
    if (played.size) gaps.splice(0, gaps.length, ...gaps.filter((gap) => !(gap.kind === "spell" && played.has(gap.name))));
    if (spellSummoned.length) abilities.builtins.summons = [...(abilities.builtins.summons ?? []), ...spellSummoned];
    spells.push(...abilities.abilities, ...bombRiders);
    // A Strike's riders are gaps unless an ability plays them.
    const riders = new Set([...abilities.abilities, ...consumables.spells].flatMap((ability) => (ability.plan?.trigger?.event === "strike" ? [ability.plan.trigger.attackEffect, ability.plan.source?.slug] : [])).filter(Boolean));
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
        // (L1, L3: its senses — darkvision, low-light vision — and whether it flies, over the ground's difficult terrain.)
        senses: readSenses(actor),
        ...(readFlies(actor) ? { flies: true } : {}),
        // (T6: its class DC, for a critical specialization's save.)
        ...(Number.isFinite(actor.classDC?.dc?.value) ? { classDC: actor.classDC.dc.value } : {}),
        traits,
        // (M38: a creature that speaks a language can offer to surrender.)
        ...(kind === "pc" ? {} : { languages: [...(actor.system?.details?.languages?.value ?? [])] }),
        hp: fresh ? { value: hp.max, max: hp.max, temp: 0 } : { value: hp.value ?? 0, max: hp.max ?? 0, temp: hp.temp ?? 0 },
        ac: stripConditions(actor.armorClass?.value ?? actor.system?.attributes?.ac?.value ?? 10, actor.armorClass?.modifiers ?? []),
        // (B302: PF2e takes a creature's Hardness off all its damage — Construct Armor's, an animated object's.)
        hardness: Number(actor.hardness ?? actor.system?.attributes?.hardness?.value) || 0,
        saves: {
            fortitude: statValue(actor.saves?.fortitude),
            reflex: statValue(actor.saves?.reflex),
            will: statValue(actor.saves?.will)
        },
        perception: statValue(actor.perception),
        stealth: skills.stealth ?? null,
        // (B303: the skills its abilities name for its own initiative, rolled when better than Perception.)
        initiativeSkills: readInitiativeSkills(actor),
        skills,
        speed: landSpeed(actor),
        reach: actorReach,
        heroPoints: actor.system?.resources?.heroPoints?.value ?? 0,
        // (Diehard: the dying value it dies at, as PF2e's sheet has it — its doomed added back, since PF2e takes that off and so does the engine.)
        ...(deathAt(actor, kind) !== 4 ? { deathAt: deathAt(actor, kind) } : {}),
        // (Its Focus Points' most, for a familiar's Familiar Focus.)
        ...(Number(actor.system?.resources?.focus?.max) > 0 ? { focusMax: Number(actor.system.resources.focus.max) } : {}),
        shield: fresh && shield ? { ...shield, broken: false, raised: false } : shield,
        ...abilities.builtins,
        ...features.fields,
        multiStrikes: [...(abilities.builtins.multiStrikes ?? []), ...(features.fields.multiStrikes ?? [])],
        // (U7: items used by Striking, after the creature's own activities.)
        ...(consumables.fortunes.length ? { fortuneItems: consumables.fortunes } : {}),
        ...(consumables.reduceTriggers.length ? { reduceTriggers: consumables.reduceTriggers } : {}),
        ...(consumables.triggered.length ? { triggeredItems: consumables.triggered } : {}),
        ...(consumables.activities.length ? { strikeActivities: [...(abilities.builtins.strikeActivities ?? []), ...(features.fields.strikeActivities ?? []), ...consumables.activities] } : {}),
        // (Its PF2e self-effects, and a class feature's — Immortal Bastion's deflect, C33.)
        ...(selfEffects.length || features.fields.selfEffects?.length ? { selfEffects: [...(features.fields.selfEffects ?? []), ...selfEffects] } : {}),
        ...(exemplar ? { exemplar } : {}),
        reactions: { aoo: hasItemSlug(actor, AOO_SLUGS), shieldBlock: hasItemSlug(actor, new Set(["shield-block"])), ...abilities.builtins.reactions },
        size: actor.size ?? actor.system?.traits?.size?.value ?? "med",
        resistances: readIwr(actor.attributes?.resistances),
        weaknesses: readIwr(actor.attributes?.weaknesses),
        immunities: (actor.attributes?.immunities ?? []).map((entry) => entry.type),
        ...immunityExceptions(actor.attributes?.immunities),
        voidHealing: !!(actor.system?.attributes?.hp?.negativeHealing ?? actor.attributes?.hp?.negativeHealing),
        strikes,
        spells,
        spellPools: { ...spellPools, ...(abilities.pools ?? {}) },
        conditions,
        gaps
    };
    // (B302: Construct Armor PF2e already has broken — below its share of Hit Points, or its toggle for a critical hit: PF2e's AC and Hardness
    // say so. A fresh fight mends it.)
    // (T3: a resistance its share of Hit Points decides is played from its rules, not as PF2e has it now.)
    if (spec.hpRules?.length) {
        const sources = new Set(spec.hpRules.map((rule) => rule.source));
        spec.resistances = spec.resistances.filter((entry) => !sources.has(entry.source));
    }
    // (I4: the roll options its predicated Fast Healing or regeneration names that are on now — a toggle the GM set, a form it's in.)
    const named = predicateOptions([...(spec.fastHealingWhen ?? []).map((entry) => entry.when), spec.regeneration?.when ?? []]);
    if (named.length) spec.rollOptions = [...new Set(named.filter((option) => actor.rollOptions?.all?.[option]))];
    const armor = spec.constructArmor;
    if (armor && (hp.value < (hp.max ?? 0) * (armor.below ?? 50) / 100 || actor.rollOptions?.all?.["construct-armor"])) {
        if (fresh) {
            spec.ac -= armor.ac;
            spec.hardness = Math.max(spec.hardness, armor.hardness ?? 0);
        } else {
            spec.armorBroken = true;
            spec.hardness = Number(actor.hardness) || 0;
        }
    }
    // A hazard (E4): its routine, Disable options and reactions.
    // (Incredible Initiative: what PF2e's initiative adds to its Perception, as the engine's circumstance-like initiative bonus.)
    const initiativeExtra = initiativeOver(actor, spec.perception);
    if (initiativeExtra > (spec.initiativeBonus ?? 0)) spec.initiativeBonus = initiativeExtra;
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

// The world setting's morale rule overrides (JSON), or null. warn: tell the GM when it isn't valid JSON.
export function moraleRulesSetting({ warn = false } = {}) {
    try {
        const text = game.settings.get(MODULE_ID, "moraleRules");
        return text ? JSON.parse(text) : null;
    } catch (error) {
        if (warn) ui.notifications.warn(`Combat Simulator: the morale rules setting isn't valid JSON (${error.message}); using defaults.`);
        return null;
    }
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
    // (A PC's familiar: it can't join the combat tracker, so it comes in beside its master — familiars.js. One already in the tracker is
    // the same familiar, its master's minion.)
    for (const master of combatants.filter((c) => c.kind === "pc")) {
        const actor = game.actors?.get(master.actorId);
        for (const familiar of actor ? familiarsOf(actor) : []) {
            const known = combatants.find((c) => c.actorId === familiar.id);
            if (known) Object.assign(known, { acts: false, strikes: [], side: master.side, familiar: familiarSpec(familiar, master) });
            else if (overrides[`familiar-${familiar.id}`]?.include !== false) combatants.push(readFamiliar(familiar, master, { fresh }));
        }
    }
    // (B298: a summon's creatures, made now as reserves waiting off the field.)
    for (const maker of [...combatants]) if (maker.summons?.length) combatants.push(...(await summonReserves(maker)));
    // (L1: the light "auto" — as the scene's darkness has it.)
    if (!setup.environment?.light || setup.environment.light === "auto") {
        const scene = combat?.scene ?? placed.find((entry) => entry.token?.parent)?.token.parent ?? canvas?.scene;
        setup = { ...setup, environment: { ...(setup.environment ?? {}), light: sceneLight(scene) } };
    }
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
    // (2026-10-21: the square grid — a layout, or the scene's walls, Regions and token squares; a scene without a square grid stays on
    // the range bands.)
    if (setup.grid) {
        const scene = combat?.scene ?? placed.find((entry) => entry.token?.parent)?.token.parent ?? canvas?.scene;
        const grid = setup.grid === "scene" ? readSceneGrid(scene, placed) : { layout: setup.grid };
        snapshot.setup = { ...snapshot.setup, grid };
        if (!grid) ui?.notifications?.warn?.("Combat Simulator: this scene has no square grid — the fights run on the range bands.");
    }
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

// Summons (B298): each summon's creatures as reserves — PF2e's creature it links or names, the best of its options, the best its pick allows
// (the rulebook bestiaries' creatures of that level and those traits), or another of itself; as many as its uses could bring.
const SUMMON_PACKS = ["pathfinder-monster-core", "pathfinder-monster-core-2", "pathfinder-npc-core", "pathfinder-bestiary", "pathfinder-bestiary-2", "pathfinder-bestiary-3"];
let summonIndex = null;
async function summonEntries() {
    if (summonIndex) return summonIndex;
    const entries = [];
    for (const name of SUMMON_PACKS) {
        const pack = game.packs.get(`pf2e.${name}`);
        if (!pack) continue;
        const index = await pack.getIndex({ fields: ["system.details.level.value", "system.traits.value", "type"] });
        for (const entry of index) entries.push({ uuid: entry.uuid ?? `Compendium.${pack.collection}.Actor.${entry._id}`, name: entry.name, level: Number(entry.system?.details?.level?.value), traits: entry.system?.traits?.value ?? [], type: entry.type });
    }
    summonIndex = entries;
    return entries;
}

async function summonDocument(from) {
    if (from?.uuid) return fromUuid(from.uuid).catch(() => null);
    if (from?.name) {
        const found = (await summonEntries()).find((entry) => entry.type === "npc" && entry.name.toLowerCase() === String(from.name).toLowerCase());
        return found ? fromUuid(found.uuid).catch(() => null) : null;
    }
    return null;
}

export async function summonReserves(maker) {
    const out = [];
    for (const entry of maker.summons) {
        let creature = entry.creature;
        let spec = null;
        if (creature.options) {
            const found = await Promise.all(creature.options.map((option) => summonDocument(option.from)));
            const index = bestOption(creature.options.map((option, i) => ({ index: i, level: Number(found[i]?.level ?? found[i]?.system?.details?.level?.value ?? -2), count: Number(option.count) || 1 })).filter((option) => found[option.index]));
            creature = creature.options[index];
            entry.count = creature.count ?? 1;
            entry.perUse = Math.max(1, Number(creature.count) || 1);
            spec = found[index] ? await readActor(found[index], { id: "summon", name: found[index].name, fresh: true }) : null;
        } else if (creature.pick) {
            const best = bestPick(await summonEntries(), creature.pick);
            const document = best ? await fromUuid(best.uuid).catch(() => null) : null;
            spec = document ? await readActor(document, { id: "summon", name: document.name, fresh: true }) : null;
        } else if (creature.from?.self) {
            spec = structuredClone({ ...maker, summons: undefined, gaps: [] });
        } else {
            const document = await summonDocument(creature.from);
            spec = document ? await readActor(document, { id: "summon", name: document.name, fresh: true }) : null;
        }
        if (!spec) continue;
        if (creature.adjust === "elite") spec = eliteAdjust(spec);
        else if (creature.adjust === "weak") spec = weakAdjust(spec);
        if (creature.traits?.length) spec.traits = [...new Set([...(spec.traits ?? []), ...creature.traits])];
        for (let index = 0; index < reserveCount(entry); index++) {
            const reserve = asReserve(spec, maker, entry, index);
            entry.reserveIds.push(reserve.id);
            out.push(reserve);
        }
    }
    return out;
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

// A PC's familiars (2026-10-14): the familiar actors whose master it is.
export function familiarsOf(actor) {
    return (game.actors?.contents ?? [...(game.actors ?? [])]).filter((other) => other.type === "familiar" && other.system?.master?.id === actor.id);
}

// What a familiar does for its master (familiars.js): its patron ability for hexes, Lifelink, Familiar Focus.
function familiarSpec(actor, master) {
    const slugs = [...(actor.items ?? [])].map((item) => item.system?.slug ?? String(item.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    return { masterId: master.id, hexAbility: slugs.find((slug) => HEX_FAMILIARS.has(slug)) ?? null, lifelink: slugs.includes("lifelink"), focus: slugs.includes("familiar-focus") };
}

// A familiar as a combatant: PF2e's numbers for it (its master's level, AC and saves; 5 Hit Points a level), no Strikes, no turns of
// its own; on its master's side and in its band.
export function readFamiliar(actor, master, { fresh = false } = {}) {
    const hp = actor.system?.attributes?.hp ?? { value: 0, max: 0, temp: 0 };
    return {
        id: `familiar-${actor.id}`,
        actorId: actor.id,
        actorUuid: actor.uuid,
        name: actor.name,
        kind: "npc",
        acts: false,
        level: actor.level ?? master.level ?? 0,
        senses: readSenses(actor),
        ...(readFlies(actor) ? { flies: true } : {}),
        traits: [...(actor.traits ?? actor.system?.traits?.value ?? []), "minion"],
        hp: fresh ? { value: hp.max ?? 0, max: hp.max ?? 0, temp: 0 } : { value: hp.value ?? 0, max: hp.max ?? 0, temp: hp.temp ?? 0 },
        ac: stripConditions(actor.armorClass?.value ?? actor.system?.attributes?.ac?.value ?? master.ac ?? 10, actor.armorClass?.modifiers ?? []),
        hardness: 0,
        saves: { fortitude: statValue(actor.saves?.fortitude), reflex: statValue(actor.saves?.reflex), will: statValue(actor.saves?.will) },
        perception: statValue(actor.perception),
        skills: {},
        speed: actor.attributes?.speed?.total ?? actor.system?.attributes?.speed?.value ?? 25,
        reach: 5,
        heroPoints: 0,
        shield: null,
        reactions: { aoo: false, shieldBlock: false },
        size: actor.size ?? actor.system?.traits?.size?.value ?? "tiny",
        resistances: readIwr(actor.attributes?.resistances),
        weaknesses: readIwr(actor.attributes?.weaknesses),
        immunities: (actor.attributes?.immunities ?? []).map((entry) => entry.type),
        strikes: [],
        spells: [],
        spellPools: {},
        conditions: fresh ? {} : readConditions(actor),
        side: master.side,
        band: master.band ?? "near",
        familiar: familiarSpec(actor, master),
        gaps: []
    };
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
