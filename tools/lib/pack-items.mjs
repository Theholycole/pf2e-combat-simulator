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
const { basicActions, readDocuments, PACK_ROOT } = await import("./pack-creatures.mjs");
const { itemEntry } = await import("../../src/adapter/items.js");
const { effectModel } = await import("../../src/engine/effects.js");
const { canCast, isUtility } = await import("../../src/engine/spells.js");
const { levelDC } = await import("../../src/engine/checks.js");
const { compileSpell, spellNamed } = await import("./pack-spells.mjs");

const docs = (name) => readDocuments(`${PACK_ROOT}/${name}`).filter((doc) => doc.collection === "items");
const spellEffects = compiler ? compiler.spellEffectIndex(docs("spell-effects")) : {};
// (A creature's copy has a short text, often without its Activate line: the equipment pack's own, when it has one.)
const equipment = new Map(compiler ? docs("equipment").map((doc) => [`Compendium.pf2e.equipment-srd.Item.${doc._id}`, doc]) : []);
const EFFECT_PACKS = ["spell-effects", "equipment-effects", "other-effects", "bestiary-effects"];
const effects = new Map(compiler ? EFFECT_PACKS.flatMap((pack) => docs(pack).map((effect) => [`Compendium.pf2e.${pack}.Item.${effect._id}`, effect])) : []);
const conditionNames = new Map(docs("conditions").map((condition) => [condition._id, condition.system?.slug ?? condition.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;

// The models of the PF2e effects a plan applies, at the item's level.
export const itemEffectModels = (plan, rank) => Object.fromEntries([...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.[a-z-]+-effects\.Item\.[A-Za-z0-9]{16}/g) ?? [])]
    .map((uuid) => [uuid, effects.get(uuid)]).filter(([, effect]) => effect).map(([uuid, effect]) => [uuid, effectModel(effect, { rank, conditionSlug })]));

// A creature's consumables the simulation plays: { spells, spellPools }. Held ones at hand; others taken out first (1 Interact).
export function npcItems(npc, { fresh = true } = {}) {
    const spells = [];
    const spellPools = {};
    if (!compiler) return { spells, spellPools };
    // (U4: the attack effects its Strikes list — an injury poison among them is delivered by their hits.)
    const listed = new Set(npc.items.filter((entry) => entry.type === "melee").flatMap((entry) => entry.system?.attackEffects?.value ?? []));
    for (const item of (npc.items ?? []).filter((entry) => entry.type === "consumable" && compiler.handlesItem(entry))) {
        let plan = null;
        const uuid = item._stats?.compendiumSource ?? item.flags?.core?.sourceId ?? null;
        const source = equipment.get(uuid);
        try {
            plan = compiler.compileItem({ ...item, ...(source ? { system: { ...item.system, description: source.system?.description ?? item.system?.description } } : {}), uuid }, { spellEffects, basicActions });
        } catch {
            plan = null;
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
        const entry = itemEntry(plan, { id: item._id, name: item.name, quantity: item.system?.quantity ?? 1, uses: item.system?.uses, draw, fresh, cast, onStrike: slug && listed.has(slug) ? slug : null });
        if (!entry) continue;
        const spec = { ...entry, effects: itemEffectModels(entry.plan, entry.castRank) };
        // (A poison its Strikes deliver isn't an action of its own: its hits play it.)
        const rider = entry.plan.trigger?.event === "strike";
        if (isUtility(plan) || (!rider && !canCast({ spellPools: { [entry.pool]: entry.casts }, covenReady: true }, spec))) continue;
        spellPools[entry.pool] = entry.casts;
        spells.push(spec);
    }
    return { spells, spellPools };
}
