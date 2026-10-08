// Builds an engine snapshot from Foundry: a Combat in progress, or tokens.
// This is the only place that reads PF2e documents.

import { parseReadableDamage } from "../src/adapter/formula.js";
import { eliteAdjust, weakAdjust } from "../src/engine/adjust.js";

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
    for (const effect of item?.system?.attackEffects?.value ?? []) gaps.push({ kind: "attack effect", name: effect });
    return {
        name: action.label,
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

function readGaps(actor, gaps) {
    for (const item of actor.itemTypes?.action ?? []) {
        const slug = item.slug ?? item.name.slugify?.() ?? item.name;
        if (BUILT_IN_ACTIONS.has(slug)) continue;
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
    const spells = actor.itemTypes?.spell ?? [];
    for (const spell of spells) {
        if (spell.isRitual) continue;
        gaps.push({ kind: "spell", name: spell.name });
    }
    for (const item of actor.itemTypes?.consumable ?? []) {
        const category = item.system?.category;
        if (["potion", "elixir", "scroll", "wand", "bomb", "oil", "talisman", "poison"].includes(category)) gaps.push({ kind: "consumable", name: item.name });
    }
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
    readGaps(actor, gaps);
    if (!strikes.length && actorKind(actor) !== "object") {
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
        reactions: { aoo: hasItemSlug(actor, AOO_SLUGS), shieldBlock: hasItemSlug(actor, new Set(["shield-block"])) },
        resistances: readIwr(actor.attributes?.resistances),
        weaknesses: readIwr(actor.attributes?.weaknesses),
        immunities: (actor.attributes?.immunities ?? []).map((entry) => entry.type),
        strikes,
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
