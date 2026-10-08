// Builds an engine snapshot from Foundry: a Combat in progress, or tokens.
// This is the only place that reads PF2e documents.

import { parseReadableDamage } from "../src/adapter/formula.js";
import { eliteAdjust, weakAdjust } from "../src/engine/adjust.js";
import { canCast, isUtility, spellGaps } from "../src/engine/spells.js";
import { effectModel } from "../src/engine/effects.js";
import { addBuiltin } from "../src/engine/abilities.js";

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
    "two-hand", "propulsive", "concealable", "monk", "free-hand", "orichalcum", "mithral", "dawnsilver", "duskwood",
    "acid", "bludgeoning", "cold", "electricity", "fire", "force", "mental", "piercing", "poison", "slashing", "sonic",
    "spirit", "vitality", "void", "air", "earth", "metal", "water", "wood", "arcane", "divine", "occult", "primal"
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
    const traits = traitList(action.traits);
    const ranged = item?.isRanged ?? !!item?.range?.increment;
    const melee = !ranged || item?.isMelee === true;
    const increment = ranged ? (item?.range?.increment ?? null) : null;
    const reachTrait = traits.find((trait) => /^reach-\d+$/.test(trait));
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
    const enfeebled = conditionValue(actor, "enfeebled");
    if (enfeebled && melee && damage[0]) {
        // PF2e's formula already has the enfeebled penalty; the engine applies its own.
        damage[0] = { ...damage[0], bonus: damage[0].bonus + enfeebled };
        if (critDamage?.[0]) critDamage[0] = { ...critDamage[0], bonus: critDamage[0].bonus + enfeebled };
    }
    for (const trait of traits) {
        if (!MODELLED_TRAITS.has(traitRoot(trait))) gaps.push({ kind: "strike trait", name: trait });
    }
    return {
        name: action.label,
        // Riders the Strike lists (grab, knockdown, push); a gap unless an ability plays them.
        attackEffects: [...(item?.system?.attackEffects?.value ?? [])],
        // A weapon in hand (Disarm can knock it away); jaws and claws can't be.
        held: !traits.includes("unarmed") && (item?.type === "weapon" || (item?.type === "melee" && !NATURAL_ATTACK.test(action.label ?? item?.name ?? ""))),
        // Light Bulk or less: usable from inside a swallower.
        light: item?.type === "weapon" && Number(item?.system?.bulk?.value ?? 1) <= 0.1,
        bonus: stripConditions(action.totalModifier, action.modifiers),
        melee: melee && !increment,
        increment,
        reach: reachTrait ? Number(reachTrait.split("-")[1]) : null,
        agile: traits.includes("agile"),
        nonlethal: traits.includes("nonlethal"),
        forceful: traits.includes("forceful"),
        sweep: traits.includes("sweep"),
        backswing: traits.includes("backswing"),
        backstabber: traits.includes("backstabber"),
        volley: Number(traits.find((trait) => /^volley-\d+$/.test(trait))?.split("-")[1] ?? 0) || null,
        damage,
        critDamage
    };
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
        if (BUILT_IN_ACTIONS.has(slug)) continue;
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
async function readAbilities(actor, { fresh = false } = {}) {
    const result = { abilities: [], handled: new Set(), builtins: { reactions: {}, rend: null } };
    const core = game.modules.get(CORE_ID)?.active ? game.modules.get(CORE_ID).api : null;
    const abilityModule = game.modules.get(ABILITY_MODULE_ID);
    if (!core || !abilityModule?.active) return result;
    const items = actorKind(actor) === "npc" ? [...(actor.itemTypes?.action ?? [])] : [];
    const prepared = items.length ? await core.registry.preparePlans(items) : [];
    for (const { item, result: compiled } of prepared) {
        const plan = compiled?.plan;
        if (!plan) continue;
        if (plan.builtin) {
            if (addBuiltin(result.builtins, plan, item.name)) result.handled.add(item);
            continue;
        }
        if (!plan.resolution) continue;
        result.handled.add(item);
        result.abilities.push({ name: item.name, plan: leanPlan(plan), castRank: 1, dc: null, attack: null, pool: null, kind: "ability" });
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

// The engine's models of the PF2e spell effects a plan applies, at the cast rank.
async function effectModels(plan, castRank) {
    const uuids = [...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}/g) ?? [])];
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
async function readSpells(actor, gaps, { fresh = false } = {}) {
    const spells = [];
    const spellPools = {};
    const entries = (actor.spellcasting?.regular ?? actor.spellcasting?.contents ?? []).filter((entry) => !entry.isRitual);
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
                if (!spell || spell.isRitual) continue;
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
        const spec = { name: entry.name, plan, castRank: entry.castRank, dc: entry.dc, attack: entry.attack, pool: entry.pool, tradition: entry.tradition, effects: plan ? await effectModels(plan, entry.castRank) : {} };
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
    if (["hazard", "vehicle", "loot", "party"].includes(actor.type)) return "object";
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
    const abilities = await readAbilities(actor, { fresh });
    readGaps(actor, gaps, abilities.handled);
    const { spells, spellPools } = await readSpells(actor, gaps, { fresh });
    spells.push(...abilities.abilities);
    // A Strike's riders are gaps unless an ability plays them.
    const riders = new Set(abilities.abilities.flatMap((ability) => (ability.plan?.trigger?.event === "strike" ? [ability.plan.trigger.attackEffect, ability.plan.source?.slug] : [])).filter(Boolean));
    for (const strike of strikes) for (const effect of strike.attackEffects ?? []) if (!riders.has(effect)) gaps.push({ kind: "attack effect", name: effect });
    if (!strikes.length && !spells.length && actorKind(actor) !== "object") {
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
    return {
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
        reactions: { aoo: hasItemSlug(actor, AOO_SLUGS), shieldBlock: hasItemSlug(actor, new Set(["shield-block"])), ...abilities.builtins.reactions },
        size: actor.size ?? actor.system?.traits?.size?.value ?? "med",
        resistances: readIwr(actor.attributes?.resistances),
        weaknesses: readIwr(actor.attributes?.weaknesses),
        immunities: (actor.attributes?.immunities ?? []).map((entry) => entry.type),
        voidHealing: !!(actor.system?.attributes?.hp?.negativeHealing ?? actor.attributes?.hp?.negativeHealing),
        strikes,
        spells,
        spellPools,
        conditions,
        gaps
    };
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
