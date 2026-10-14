// Spells for the bestiary tools: a creature's own spellcasting compiled by the spell module (read only) into the simulator's spell
// entries, and PF2e's spells by name for the benchmark party's spellbooks. Shared by bestiary-casters.mjs and deadliest.mjs.
const W = decodeURIComponent(new URL("../../../PF2e AUTOMATIC SPELL RESOLUTION", import.meta.url).pathname);
const { compileAbility } = await import(`${W}/src/compiler/index.js`);
const { readDocuments } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { effectModel } = await import("../../src/engine/effects.js");

export const PACK_ROOT = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
// As the spell module's official compile does: its native-effect catalog and
// the spells others reference, so plans match live play.
const effectItems = readDocuments(`${PACK_ROOT}/spell-effects`).filter((d) => d.collection === "items");
const nativeEffectCatalog = new Map(effectItems.map((effect) => [effect.name, {
  id: effect._id ?? null, name: effect.name, type: effect.type,
  automation: { ruleKeys: [...new Set((effect.system?.rules ?? []).map((rule) => rule.key).filter(Boolean))], requiresConfiguration: (effect.system?.rules ?? []).some((rule) => rule.key === "ChoiceSet"), removesAfterRoll: (effect.system?.rules ?? []).some((rule) => rule.removeAfterRoll != null) },
  mechanics: { rules: effect.system?.rules ?? [], duration: effect.system?.duration ?? null, start: effect.system?.start ?? null },
  ...(effect.system?.badge ? { badge: effect.system.badge } : {})
}]));
const spellDocs = readDocuments(`${PACK_ROOT}/spells`).filter((d) => d.collection === "items" && d._id);
const referencedSpells = new Map(spellDocs.map((spell) => [`Compendium.pf2e.spells-srd.Item.${spell._id}`, spell]));
const spellsByName = new Map(spellDocs.map((spell) => [spell.name.toLowerCase(), spell]));
const effectsById = new Map(effectItems.map((effect) => [effect._id, effect]));
const conditionNames = new Map(readDocuments(`${PACK_ROOT}/conditions`).filter((d) => d.collection === "items").map((condition) => [condition._id, condition.system?.slug ?? condition.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;

// The effect models a plan's PF2e spell effects make, at the cast rank.
export const effectModels = (plan, castRank) => Object.fromEntries([...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}/g) ?? [])]
  .map((uuid) => [uuid, effectsById.get(uuid.split(".").pop())]).filter(([, item]) => item).map(([uuid, item]) => [uuid, effectModel(item, { rank: castRank, conditionSlug })]));

export function compileSpell(spell) {
  return compileAbility(spell, { nativeEffectCatalog, referencedSpells });
}

// A PF2e spell by its name (remaster names), or null.
export function spellNamed(name) {
  return spellsByName.get(String(name).toLowerCase()) ?? null;
}

// A creature's spells as the simulator's entries, with their pools: cantrips at its cantrip rank, focus spells, innate uses, spontaneous
// slots per rank, prepared slots. A coven's spells only with its coven (L5). onError(spell, error) for a spell that doesn't compile.
export function npcSpells(npc, { onError = () => {} } = {}) {
  const entries = (npc.items ?? []).filter((i) => i.type === "spellcastingEntry" && !["ritual", "items"].includes(i.system?.prepared?.value));
  const spells = [];
  const spellPools = {};
  if (!entries.length) return { spells, spellPools };
  const cantripRank = Math.min(10, Math.max(1, Math.ceil((npc.system?.details?.level?.value ?? 1) / 2)));
  for (const entry of entries) {
    const kind = entry.system?.prepared?.value;
    const dc = entry.system?.spelldc?.dc ?? 20;
    const attack = entry.system?.spelldc?.value ?? 10;
    const own = (npc.items ?? []).filter((i) => i.type === "spell" && i.system?.location?.value === entry._id && !(i.system?.traits?.value ?? []).includes("ritual"));
    const byId = new Map(own.map((s) => [s._id, s]));
    const add = (spell, castRank, pool) => {
      let plan;
      try { plan = compileSpell(spell); } catch (e) { onError(spell, e); return; }
      // (L5: a coven's spells, castable only with its coven — not by a lone caster here.)
      spells.push({ name: spell.name, plan, castRank, dc, attack, pool, ...(/\bcoven\b/i.test(entry.name ?? "") ? { coven: true } : {}), effects: effectModels(plan, castRank) });
    };
    for (const spell of own) {
      const traits = spell.system?.traits?.value ?? [];
      const rank = spell.system?.location?.heightenedLevel ?? spell.system?.level?.value ?? 1;
      if (traits.includes("cantrip")) add(spell, cantripRank, null);
      else if (kind === "focus" || traits.includes("focus")) { spellPools.focus = npc.system?.resources?.focus?.max ?? 1; add(spell, cantripRank, "focus"); }
      else if (kind === "innate") { const max = spell.system?.location?.uses?.max; const pool = max ? `${entry._id}:${spell._id}` : null; if (pool) spellPools[pool] = max; add(spell, rank, pool); }
      else if (kind === "spontaneous") { const slot = entry.system?.slots?.[`slot${rank}`]; const pool = `${entry._id}:${rank}`; spellPools[pool] = slot?.max ?? 1; add(spell, rank, pool); }
    }
    if (kind === "prepared") {
      for (const [key, slot] of Object.entries(entry.system?.slots ?? {})) {
        const rank = Number(key.replace("slot", ""));
        if (!rank) continue;
        for (const [index, prepared] of (slot.prepared ?? []).entries()) {
          const spell = byId.get(prepared.id);
          if (!spell || (spell.system?.traits?.value ?? []).includes("cantrip")) continue;
          const pool = `${entry._id}:${rank}:${index}`;
          spellPools[pool] = 1;
          add(spell, rank, pool);
        }
      }
    }
  }
  return { spells, spellPools };
}

export { readDocuments };
