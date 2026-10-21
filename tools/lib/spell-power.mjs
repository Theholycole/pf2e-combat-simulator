// A spell's power for its rank, offline (src/engine/spell-power.js has the method): the spells of every installed compendium — PF2e's and
// each module's Item compendiums, not Starfinder's; rituals left out — and one task for a worker (tools/spell-power.mjs).
import fs from "node:fs";
const { readDocuments, PACK_ROOT } = await import("./pack-creatures.mjs");
const { compileSpell, effectModels } = await import("./pack-spells.mjs");
const { partyFor } = await import("./deadliness.mjs");
const { POWER_KINDS, RATED_POOL, castPower, partyLevelForRank, powerConditions, powerFoes, powerRanks, wizardCasting } = await import("../../src/engine/spell-power.js");
const { canCast, isUtility, spellGaps } = await import("../../src/engine/spells.js");

const MODULES = `${process.env.HOME}/.local/share/FoundryVTT/Data/modules`;

const isRitual = (doc) => Boolean(doc.system?.ritual) || (doc.system?.traits?.value ?? []).includes("ritual");
const OWN_CREATURE = /\b(minion|companion|eidolon|familiar)\b|\byou summoned\b/i;

// Every spell: { ref, source, collection, path, id, name, rank, cantrip, focus }.
export function spellRefs() {
    const sources = [];
    const system = JSON.parse(fs.readFileSync(`${PACK_ROOT}/../system.json`, "utf8"));
    for (const pack of system.packs ?? []) if (pack.type === "Item") sources.push({ source: "pf2e", collection: `pf2e.${pack.name}`, path: `${PACK_ROOT}/${String(pack.path).replace(/\/$/, "").split("/").at(-1)}` });
    for (const mod of fs.readdirSync(MODULES)) {
        let manifest;
        try {
            manifest = JSON.parse(fs.readFileSync(`${MODULES}/${mod}/module.json`, "utf8"));
        } catch {
            continue;
        }
        for (const pack of manifest.packs ?? []) if (pack.type === "Item" && (!pack.system || pack.system === "pf2e")) sources.push({ source: mod, collection: `${manifest.id ?? mod}.${pack.name}`, path: `${MODULES}/${mod}/${pack.path}` });
    }
    const refs = [];
    for (const { source, collection, path } of sources) {
        let docs;
        try {
            docs = readDocuments(path);
        } catch {
            continue;
        }
        for (const doc of docs.filter((entry) => entry.collection === "items" && entry.type === "spell" && !isRitual(entry))) {
            const traits = doc.system?.traits?.value ?? [];
            refs.push({ ref: `${collection}:${doc._id}`, source, collection, path, id: doc._id, name: doc.name, rank: Math.max(1, Math.min(10, Number(doc.system?.level?.value) || 1)), cantrip: traits.includes("cantrip"), focus: traits.includes("focus") });
        }
    }
    return refs;
}

const packCache = new Map();
export function spellOf(ref) {
    if (!packCache.has(ref.path)) {
        if (packCache.size > 3) packCache.delete(packCache.keys().next().value);
        packCache.set(ref.path, new Map(readDocuments(ref.path).filter((doc) => doc.collection === "items").map((doc) => [doc._id, doc])));
    }
    return packCache.get(ref.path).get(ref.id) ?? null;
}

const plans = new Map();
function planOf(ref, doc) {
    if (!plans.has(ref.ref)) {
        let plan = null;
        try {
            plan = compileSpell(doc);
        } catch {
            plan = null;
        }
        if (plans.size > 200) plans.delete(plans.keys().next().value);
        plans.set(ref.ref, plan);
    }
    return plans.get(ref.ref);
}

// The ranks a spell is rated at (powerRanks), from its data.
export function ranksOf(ref) {
    const doc = spellOf(ref);
    return doc ? powerRanks(doc) : [];
}

// One task: { ref, rank } — the spell at that rank, cast once into both encounters (and those of each trait it does more against).
export function runPowerTask(task) {
    const { ref, rank } = task;
    const doc = spellOf(ref);
    if (!doc) return { ...task, error: "not found" };
    const plan = planOf(ref, doc);
    if (!plan) return { ...task, error: "doesn't compile" };
    const level = partyLevelForRank(rank);
    const party = partyFor(level);
    const casting = wizardCasting(party);
    const entry = { name: doc.name, plan, castRank: rank, dc: casting?.dc ?? 10 + level, attack: casting?.attack ?? level, pool: ref.cantrip ? null : RATED_POOL, tradition: "arcane", effects: effectModels(plan, rank) };
    const head = { kind: "screen", ref: { ref: ref.ref, collection: ref.collection, path: ref.path, id: ref.id, name: ref.name, cantrip: ref.cantrip, focus: ref.focus }, collection: ref.collection, id: ref.id, name: ref.name, rank, cantrip: ref.cantrip, level };
    // (A spell on one's own minion, companion, eidolon or familiar — Final Sacrifice explodes one — has nothing to work on in the party.)
    if (OWN_CREATURE.test(String(doc.system?.target?.value ?? ""))) return { ...head, skipped: true, reason: "needs a minion, companion, eidolon or familiar" };
    if (isUtility(plan) || !canCast({ spellPools: { [RATED_POOL]: 1 } }, entry)) return { ...head, skipped: true, reason: isUtility(plan) ? "utility" : "the simulator can't cast it" };
    const traits = powerConditions(plan);
    const results = {};
    for (const encounter of POWER_KINDS) {
        for (const trait of [null, ...traits]) {
            const found = castPower(party, powerFoes(encounter, level, trait), entry);
            if (found) results[`${encounter}|${trait ?? ""}`] = { share: Math.round(found.share * 1e4) / 1e4, levels: Math.round(found.levels * 1e4) / 1e4, ...(found.bound ? { bound: found.bound } : {}), actions: found.actions, targets: found.targets };
        }
    }
    const gaps = spellGaps(entry);
    return { ...head, traits, results, ...(gaps.length ? { partial: gaps } : {}) };
}
