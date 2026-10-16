// U1 (2026-10-15), consumables for the bestiary tools: a creature's potions, elixirs, talismans and the like, compiled by the item module
// (read only) into the simulator's item entries (src/adapter/items.js), with the PF2e effects they apply modelled at the item's level.
// Without the item module beside the simulator, none.
const I = decodeURIComponent(new URL("../../../PF2e AUTOMATIC ITEM RESOLUTION", import.meta.url).pathname);
let compiler = null;
try {
    compiler = await import(`${I}/src/compiler/index.js`);
} catch {
    compiler = null;
}
// (An item the spell module acts on — Djezet Dose, an item spellshape — isn't the item module's, as live: its claims(item), pure.)
let claims = null;
try {
    ({ claims } = await import(new URL("../../../PF2e AUTOMATIC SPELL RESOLUTION/src/compiler/item-claims.js", import.meta.url).href));
} catch {
    claims = null;
}
const { basicActions, readDocuments, PACK_ROOT } = await import("./pack-creatures.mjs");
const { hasTrigger, itemEntry, itemFortune, itemReduceTrigger, itemStrikeActivity, verifiedPlan } = await import("../../src/adapter/items.js");
// (A third-party item's own Effect only when its rules match its text: the item module's check, as its live play.)
let verifyEffectRules = null;
try {
    ({ verifyEffectRules } = await import(`${I}/src/compiler/verify-effect.js`));
} catch {
    verifyEffectRules = null;
}
const { effectModel } = await import("../../src/engine/effects.js");
const { canCast, isUtility } = await import("../../src/engine/spells.js");
const { levelDC } = await import("../../src/engine/checks.js");
const { compileSpell, spellNamed } = await import("./pack-spells.mjs");

const docs = (name) => readDocuments(`${PACK_ROOT}/${name}`).filter((doc) => doc.collection === "items");
const spellEffects = compiler ? compiler.spellEffectIndex(docs("spell-effects")) : {};
// (Casts named in words — Oil of Mending's — by PF2e's spells, as the item module's live compile reads them.)
const spells = compiler?.spellIndex ? compiler.spellIndex(docs("spells")) : null;
// (A creature's copy has a short text, often without its Activate line: the equipment pack's own, when it has one.)
const equipment = new Map(compiler ? docs("equipment").map((doc) => [`Compendium.pf2e.equipment-srd.Item.${doc._id}`, doc]) : []);
const EFFECT_PACKS = ["spell-effects", "equipment-effects", "other-effects", "bestiary-effects"];
const effects = new Map(compiler ? EFFECT_PACKS.flatMap((pack) => docs(pack).map((effect) => [`Compendium.pf2e.${pack}.Item.${effect._id}`, effect])) : []);
const conditionNames = new Map(docs("conditions").map((condition) => [condition._id, condition.system?.slug ?? condition.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;
// (PF2e's conditions by id → name, for the item module's check of a GrantItem rule.)
const CONDITION_NAMES = Object.fromEntries(docs("conditions").map((condition) => [condition._id, condition.name]));

// The models of the PF2e effects a plan applies, at the item's level.
export const itemEffectModels = (plan, rank) => Object.fromEntries([...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.[a-z-]+-effects\.Item\.[A-Za-z0-9]{16}/g) ?? [])]
    .map((uuid) => [uuid, effects.get(uuid)]).filter(([, effect]) => effect).map(([uuid, effect]) => [uuid, effectModel(effect, { rank, conditionSlug })]));

// (An NPC's ability modifiers: { str: 4, … }.)
const ownerAbilities = (npc) => Object.fromEntries(Object.entries(npc.system?.abilities ?? {}).map(([key, value]) => [key, Number(value?.mod) || 0]));

// A creature's consumables the simulation plays: { spells, spellPools, activities }. Held ones at hand; others taken out first (1 Interact).
// (U7: activities, its items used by Striking — Fear Gem — as Strike activities.)
export function npcItems(npc, { fresh = true } = {}) {
    const spells = [];
    const spellPools = {};
    const activities = [];
    // (U11: roll-twice talismans, used as their roll comes.)
    const fortunes = [];
    // (U13: talismans that lower a condition as it's gained.)
    const reduceTriggers = [];
    if (!compiler) return { spells, spellPools, activities, fortunes, reduceTriggers };
    const feats = (npc.items ?? []).filter((entry) => ["feat", "action"].includes(entry.type)).map((entry) => entry.system?.slug ?? entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    // (U4: the attack effects its Strikes list — an injury poison among them is delivered by their hits.)
    const listed = new Set(npc.items.filter((entry) => entry.type === "melee").flatMap((entry) => entry.system?.attackEffects?.value ?? []));
    const options = claims ? { claims } : {};
    for (const item of (npc.items ?? []).filter((entry) => entry.type === "consumable" && compiler.handlesItem(entry, options))) {
        let plan = null;
        const uuid = item._stats?.compendiumSource ?? item.flags?.core?.sourceId ?? null;
        const source = equipment.get(uuid);
        const description = source?.system?.description ?? item.system?.description;
        try {
            // (Its owner's level and ability modifiers, as live play passes them: Wolf Fang's Strength damage, "if you're at least 15th level".)
            plan = compiler.compileItem({ ...item, ...(source ? { system: { ...item.system, description } } : {}), uuid, ownerLevel: Number(npc.system?.details?.level?.value) || 0, ownerAbilities: ownerAbilities(npc) }, { spellEffects, basicActions, ...(spells ? { spells } : {}), ...options });
        } catch {
            plan = null;
        }
        if (plan) plan = verifiedPlan(plan, (application) => {
            const effect = effects.get(application.uuid);
            return Boolean(effect && verifyEffectRules && verifyEffectRules(effect.system?.rules ?? [], application.verify, { conditionNames: CONDITION_NAMES }).ok);
        });
        const reducing = plan ? itemReduceTrigger(plan, { id: item._id, name: item.name, quantity: item.system?.quantity ?? 1, uses: item.system?.uses, fresh }) : null;
        if (reducing) {
            spellPools[reducing.pool] = reducing.casts;
            reduceTriggers.push(reducing);
            continue;
        }
        if (plan?.builtin === "roll-twice") {
            const fortune = itemFortune(plan, { id: item._id, name: item.name, quantity: item.system?.quantity ?? 1, uses: item.system?.uses, fresh });
            if (fortune) {
                spellPools[fortune.pool] = fortune.casts;
                fortunes.push(fortune);
            }
            continue;
        }
        if (plan?.strike) {
            const activity = itemStrikeActivity(plan, { id: item._id, name: item.name, quantity: item.system?.quantity ?? 1, uses: item.system?.uses, fresh, feats });
            if (!activity) continue;
            if (activity.riderSpell) activity.riderSpell.effects = itemEffectModels(activity.riderSpell.plan, activity.riderSpell.castRank);
            spellPools[activity.pool] = activity.casts;
            activities.push(activity);
            continue;
        }
        const draw = item.system?.equipped?.carryType === "held" ? 0 : 1;
        // (U3: one that casts a spell — the spell module's plan for it, at the item's rank; its DC the item's own, else its level's.)
        let cast = null;
        if (plan?.builtin === "cast-spell") {
            const spell = spellNamed(plan.spell?.name ?? "");
            let spellPlan = null;
            try {
                spellPlan = spell ? compileSpell(spell) : null;
            } catch {
                spellPlan = null;
            }
            const dc = plan.dc ?? levelDC(Number(plan.item?.level) || 1);
            if (spellPlan) cast = { plan: spellPlan, castRank: plan.rank ?? spell.system?.level?.value ?? 1, dc, attack: plan.attack ?? dc - 10 };
        }
        const slug = item.system?.slug ?? plan?.source?.slug ?? null;
        // (U5: a lasting area's effects, for its zone.)
        const zoneEffects = plan?.builtin === "zone" ? itemEffectModels(plan, Number(plan.item?.level) || 1) : null;
        const zone = zoneEffects ? { effectModel: plan.zone?.effect ? zoneEffects[plan.zone.effect.uuid] ?? null : null, effects: zoneEffects } : null;
        const entry = itemEntry(plan, { id: item._id, name: item.name, quantity: item.system?.quantity ?? 1, uses: item.system?.uses, draw, fresh, cast, onStrike: slug && listed.has(slug) ? slug : null, zone, triggered: hasTrigger(description?.value) });
        if (!entry) continue;
        const spec = { ...entry, effects: { ...(entry.effects ?? {}), ...itemEffectModels(entry.plan, entry.castRank) } };
        // (A poison its Strikes deliver isn't an action of its own: its hits play it.)
        const rider = entry.plan.trigger?.event === "strike";
        if (isUtility(plan) || (!rider && !canCast({ spellPools: { [entry.pool]: entry.casts }, covenReady: true }, spec))) continue;
        spellPools[entry.pool] = entry.casts;
        spells.push(spec);
    }
    return { spells, spellPools, activities, fortunes, reduceTriggers };
}
