// Spells for the bestiary tools: a creature's own spellcasting compiled by the spell module (read only) into the simulator's spell
// entries, and PF2e's spells by name for the benchmark party's spellbooks. Shared by bestiary-casters.mjs and deadliest.mjs.
const W = decodeURIComponent(new URL("../../../PF2e AUTOMATIC SPELL RESOLUTION", import.meta.url).pathname);
const { compileAbility } = await import(`${W}/src/compiler/index.js`);
const { readDocuments } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { effectModel } = await import("../../src/engine/effects.js");
const { isStaffItem, itemCasts, SPELL_ITEMS, staffCharges, staffSpellList } = await import("../../src/adapter/items.js");
const { withReading } = await import("../../src/engine/readings.js");
const { spellSummonEntry, summonEntries } = await import("../../src/engine/summons.js");

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

// (2026-10-14: with the simulator's own reading of a spell the compiler leaves without a plan — Evil Eye.)
export function compileSpell(spell) {
  return withReading(compileAbility(spell, { nativeEffectCatalog, referencedSpells }));
}

// A PF2e spell by its name (remaster names), or null.
export function spellNamed(name) {
  return spellsByName.get(String(name).toLowerCase()) ?? null;
}

// A creature's spells as the simulator's entries, with their pools: cantrips at its cantrip rank, focus spells, innate uses, spontaneous
// slots per rank, prepared slots. A coven's spells only with its coven (L5). onError(spell, error) for a spell that doesn't compile.
// (S22: and its scrolls, wands and staff, npcItemSpells.)
export function npcSpells(npc, { onError = () => {} } = {}) {
  const entries = (npc.items ?? []).filter((i) => i.type === "spellcastingEntry" && !["ritual", "items"].includes(i.system?.prepared?.value));
  const spells = [];
  const spellPools = {};
  // (Summon spells: entries for the engine's summons — npcSpells' summons, made into reserves by summonReserves.)
  const summoned = [];
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
      if (plan?.resolution?.kind === "summon") {
        summoned.push(spellSummonEntry({ name: spell.name, plan, castRank }, pool ? spellPools[pool] : 2));
        return;
      }
      const effects = effectModels(plan, castRank);
      // (Shield, the spell: the magic shield the creature raises by casting it.)
      const shield = Object.values(effects).find((model) => model?.spellShield)?.spellShield;
      spells.push({ name: spell.name, plan, castRank, dc, attack, pool, ...(/\bcoven\b/i.test(entry.name ?? "") ? { coven: true } : {}), effects, ...(shield ? { spellShield: shield } : {}) });
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
  npcItemSpells(npc, spells, spellPools, { onError });
  return { spells, spellPools, summons: summonEntries(summoned) };
}

// S22, as PF2e has it for an NPC: a scroll, wand or spell gem cast by the spellcasting that can cast its spell (prepared or spontaneous
// of its tradition or with the spell, or an entry for items; the best DC), wands fresh and overcharged once while the fight goes
// badly; a staff (one, the highest level) read as PF2e Dailies reads it, its charges the creature's highest spell rank, a spell its
// rank in charges, a cantrip free.
function npcItemSpells(npc, spells, spellPools, { onError }) {
  const casting = (npc.items ?? []).filter((i) => i.type === "spellcastingEntry" && i.system?.prepared?.value !== "ritual");
  if (!casting.length) return;
  const level = npc.system?.details?.level?.value ?? 1;
  const cantripRank = Math.min(10, Math.max(1, Math.ceil(level / 2)));
  const traditionsOf = (spell) => spell.system?.traits?.traditions ?? [];
  const listed = (entry) => new Set((npc.items ?? []).filter((i) => i.type === "spell" && i.system?.location?.value === entry._id).map((i) => i.system?.slug ?? i.name.toLowerCase()));
  const slotCasting = (entry) => ["prepared", "spontaneous"].includes(entry.system?.prepared?.value);
  // As PF2e's SpellcastingEntryPF2e#canCast with an item.
  const canCastFrom = (entry, spell, scroll) => {
    if (entry.system?.prepared?.value === "items") return entry.system?.prepared?.validItems !== "scroll" || scroll;
    if (!slotCasting(entry)) return false;
    return traditionsOf(spell).includes(entry.system?.tradition?.value) || listed(entry).has(spell.system?.slug ?? spell.name.toLowerCase());
  };
  const best = (entries) => entries.reduce((top, entry) => (!top || (entry.system?.spelldc?.dc ?? 0) > (top.system?.spelldc?.dc ?? 0) ? entry : top), null);
  const add = (spell, castRank, entry, extra) => {
    let plan;
    try { plan = compileSpell(spell); } catch (e) { onError(spell, e); return; }
    spells.push({ name: spell.name, plan, castRank, dc: entry.system?.spelldc?.dc ?? 20, attack: entry.system?.spelldc?.value ?? 10, ...extra, effects: effectModels(plan, castRank) });
  };
  for (const item of (npc.items ?? []).filter((i) => i.type === "consumable" && SPELL_ITEMS.includes(i.system?.category) && i.system?.spell)) {
    const spell = item.system.spell;
    const entry = best(casting.filter((each) => canCastFrom(each, spell, item.system.category === "scroll")));
    if (!entry) continue;
    const castRank = spell.system?.location?.heightenedLevel ?? spell.system?.level?.value ?? 1;
    const pool = `item:${item._id}`;
    spellPools[pool] = itemCasts({ category: item.system.category, quantity: item.system?.quantity, uses: item.system?.uses, fresh: true });
    const base = { pool, from: item.name, item: item._id };
    add(spell, castRank, entry, base);
    if (item.system.category === "wand") {
      spellPools[`overcharge:${item._id}`] = 1;
      add(spell, castRank, entry, { ...base, pool: `overcharge:${item._id}`, from: `${item.name} (overcharged)`, overcharge: pool });
    }
  }
  // (A staff with a spellcasting entry of its own name is that entry's.)
  const named = (value) => String(value ?? "").trim().toLowerCase();
  const magical = (item) => (item.system?.traits?.value ?? []).some((trait) => ["magical", "arcane", "divine", "occult", "primal"].includes(trait));
  const staves = (npc.items ?? []).filter((item) => isStaffItem({ type: item.type, traits: item.system?.traits?.value ?? [], magical: magical(item) }));
  const staffNames = new Set(staves.map((item) => named(item.name)));
  const entryNames = new Set(casting.map((entry) => named(entry.name)));
  const charges = staffCharges(casting.filter((entry) => slotCasting(entry) && !staffNames.has(named(entry.name))).map((entry) => entry.system?.slots), level);
  const staff = charges ? staves.filter((item) => !entryNames.has(named(item.name))).sort((a, b) => (b.system?.level?.value ?? 0) - (a.system?.level?.value ?? 0))[0] : null;
  if (!staff) return;
  const pool = `staff:${staff._id}`;
  for (const { rank, uuid } of staffSpellList(staff.system?.description?.value, charges)) {
    const spell = referencedSpells.get(uuid);
    const entry = spell ? best(casting.filter((each) => slotCasting(each) && canCastFrom(each, spell, false))) : null;
    if (!entry) continue;
    const cantrip = rank === 0 || (spell.system?.traits?.value ?? []).includes("cantrip");
    add(spell, cantrip ? cantripRank : rank, entry, { pool: cantrip ? null : pool, from: staff.name, item: staff._id, ...(cantrip ? {} : { poolCost: rank }) });
    if (!cantrip) spellPools[pool] = charges;
  }
}

export { readDocuments };
