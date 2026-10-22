// Spells for the bestiary tools: a creature's own spellcasting compiled by the spell module (read only) into the simulator's spell
// entries, and PF2e's spells by name for the benchmark party's spellbooks. Shared by bestiary-casters.mjs and deadliest.mjs.
const fs = await import("node:fs");
const W = decodeURIComponent(new URL("../../../PF2e AUTOMATIC SPELL RESOLUTION", import.meta.url).pathname);
const { compileAbility } = await import(`${W}/src/compiler/index.js`);
const { readDocuments } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { effectModel, looseRetaliation, resolveAuraGrants, withSpellText } = await import("../../src/engine/effects.js");
const { isStaffItem, itemCasts, SPELL_ITEMS, staffCharges, staffSpellList } = await import("../../src/adapter/items.js");
const { maneuverWays, withReading } = await import("../../src/engine/readings.js");
const { spellSummonEntry, summonEntries } = await import("../../src/engine/summons.js");

export const PACK_ROOT = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
// As the spell module's official compile does: its native-effect catalog and
// the spells others reference, so plans match live play.
const effectItems = readDocuments(`${PACK_ROOT}/spell-effects`).filter((d) => d.collection === "items");
// (2026-10-21: by name and by id, as the spell module's live catalog is — the installed packs link most effects by their id, Mirror
// Image's among them; by name only, those plans compiled without their effect.)
const nativeEffectCatalog = new Map(effectItems.flatMap((effect) => {
  const profile = {
    id: effect._id ?? null, name: effect.name, type: effect.type,
    automation: { ruleKeys: [...new Set((effect.system?.rules ?? []).map((rule) => rule.key).filter(Boolean))], requiresConfiguration: (effect.system?.rules ?? []).some((rule) => rule.key === "ChoiceSet"), removesAfterRoll: (effect.system?.rules ?? []).some((rule) => rule.removeAfterRoll != null) },
    mechanics: { rules: effect.system?.rules ?? [], duration: effect.system?.duration ?? null, start: effect.system?.start ?? null },
    ...(effect.system?.badge ? { badge: effect.system.badge } : {})
  };
  return [[effect.name, profile], ...(effect._id ? [[effect._id, profile]] : [])];
}));
const spellDocs = readDocuments(`${PACK_ROOT}/spells`).filter((d) => d.collection === "items" && d._id);
const referencedSpells = new Map(spellDocs.map((spell) => [`Compendium.pf2e.spells-srd.Item.${spell._id}`, spell]));
const spellsByName = new Map(spellDocs.map((spell) => [spell.name.toLowerCase(), spell]));
// (2026-10-22: and the installed modules' effect items — a module's spell links its own effect as PF2e's, "Compendium.pf2e.spell-effects.
// Item.…" with the id of one in the module's pack: Dynamic Fly's, Melt in Sunlight's, Aura of Violent Light's. PF2e's own first.)
const moduleEffects = (() => {
  const root = `${process.env.HOME}/.local/share/FoundryVTT/Data/modules`;
  const out = [];
  let mods = [];
  try { mods = fs.readdirSync(root); } catch { return out; }
  for (const mod of mods) {
    let manifest;
    try { manifest = JSON.parse(fs.readFileSync(`${root}/${mod}/module.json`, "utf8")); } catch { continue; }
    for (const pack of (manifest.packs ?? []).filter((each) => each.type === "Item")) {
      try { out.push(...readDocuments(`${root}/${mod}/${pack.path}`).filter((doc) => doc.type === "effect" && doc._id)); } catch { /* unreadable */ }
    }
  }
  return out;
})();
const effectsById = new Map([...moduleEffects, ...effectItems].map((effect) => [effect._id, effect]));
const conditionNames = new Map(readDocuments(`${PACK_ROOT}/conditions`).filter((d) => d.collection === "items").map((condition) => [condition._id, condition.system?.slug ?? condition.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;

// The effect models a plan's PF2e spell effects make, at the cast rank.
// (2026-10-22: a module's own effect link too — "Compendium.pf2e-team-plus-magic.misc.<id>", the aspect Shifts' —, when it's an effect item.
// And the shapes of the spells it lets the creature take — Untamed Form's: plan.formsFrom, withFormsFrom.)
export const effectModels = (plan, castRank) => withFormsFrom(plan, castRank, Object.fromEntries([...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[A-Za-z0-9]{16}(?=["\]}\s])/g) ?? [])]
  .map((uuid) => [uuid, effectsById.get(uuid.split(".").pop())]).filter(([, item]) => item).map(([uuid, item]) => [uuid, resolveAuraGrants(effectModel(item, { rank: castRank, conditionSlug }), (granted) => effectsById.get(String(granted).split(".").pop()) ?? null, { rank: castRank, conditionSlug })])));

// (2026-10-22, family 6: Untamed Form — "You can transform into shapes listed in Animal Form" from 2nd rank —: the battle forms of the spells
// its text names, at its rank, on its own effect, which the creature takes the best of.)
function withFormsFrom(plan, rank, models) {
  // (A choice of battle forms read as one effect — withChoiceForms —: every choice's forms on the first's, the others' left out, so the cast
  // applies the one.)
  if (plan?.choiceForms?.length && models[plan.choiceForms[0]]) {
    const forms = plan.choiceForms.flatMap((uuid) => models[uuid]?.battleForms ?? []);
    models[plan.choiceForms[0]] = { ...models[plan.choiceForms[0]], name: plan.source?.name ?? models[plan.choiceForms[0]].name, battleForms: forms, battleForm: forms[0] ?? null };
    for (const uuid of plan.choiceForms.slice(1)) delete models[uuid];
  }
  const from = (plan?.formsFrom ?? []).filter((entry) => entry.minRank <= rank);
  if (!from.length) return models;
  const forms = from.flatMap((entry) => {
    const doc = spellNamed(entry.spell);
    return doc ? Object.values(effectModels(compileSpell(doc), rank)).flatMap((model) => model?.battleForms ?? []) : [];
  });
  if (!forms.length) return models;
  for (const model of Object.values(models)) {
    if (!model) continue;
    model.battleForms = [...(model.battleForms ?? []), ...forms];
    model.battleForm ??= forms[0];
  }
  return models;
}

// (2026-10-22: what a spell's text says of its effect that its rules don't — effects.js withSpellText; withTextConditions, as it was named.)
export const withTextConditions = (models, doc, rank = 1) => withSpellText(models, doc, rank);

// A PF2e spell effect item by its uuid (or id), or null.
export const effectItemById = (uuid) => effectsById.get(String(uuid ?? "").split(".").pop()) ?? null;

// (2026-10-14: with the simulator's own reading of a spell the compiler leaves without a plan — Evil Eye.)
// (2026-10-22: and its heightened entries' targets — Fear's 5 creatures at 3rd, Slow's 10 at 6th —, which the compiler leaves out: the
// plan's heightenedTargets, each fight's entries taking theirs at their rank, spells.js atCastRank. From the text where the data has none:
// "Heightened (8th) You can target up to 10 creatures".)
const HEIGHTENED_TARGETS = /Heightened \((\d+)(?:st|nd|rd|th)\)\s*(?:<\/strong>)?\s*(?:<\/p>)?\s*(?:<p>)?\s*You can target (up to (?:\d+|one|two|three|four|five|six|ten) creatures|\d+ creatures)/gi;
export function compileSpell(spell) {
  const plan = withChoiceForms(withReading(compileAbility(spell, { nativeEffectCatalog, referencedSpells })));
  const heightening = spell?.system?.heightening;
  let steps = heightening?.type === "fixed" ? Object.entries(heightening.levels ?? {}).filter(([, entry]) => entry?.target?.value).map(([rank, entry]) => ({ minRank: Number(rank), target: String(entry.target.value) })) : [];
  if (!steps.length) steps = [...String(spell?.system?.description?.value ?? "").matchAll(HEIGHTENED_TARGETS)].map((hit) => ({ minRank: Number(hit[1]), target: hit[2] }));
  steps.sort((a, b) => a.minRank - b.minRank);
  const text = String(spell?.system?.description?.value ?? "");
  const formsFrom = [...text.matchAll(FORMS_FROM)].map((hit) => ({ minRank: Number(hit[1]), spell: hit[2] }));
  return !plan ? plan : { ...plan, ...(steps.length ? { heightenedTargets: steps } : {}), ...(formsFrom.length ? { formsFrom } : {}) };
}
// (2026-10-22, family 6: a choice of battle forms — Animal Form's animals, Dinosaur Form's dinosaurs, each its own effect —, which no core
// family resolves: as one effect on use, Elemental Form's shape — its first choice's, carrying every choice's forms (withFormsFrom) —, the
// creature taking the best.)
// (A creature's own copy of such a spell, compiled "unsupported" with the forms unscoped — a Grippli Greenspeaker's Animal Form —: the same.)
function withChoiceForms(plan) {
  const kind = plan?.resolution?.kind;
  if (kind !== "effect-choice" && kind !== "unsupported") return plan;
  const variants = kind === "effect-choice" ? plan.nativeEffects?.choiceVariants ?? [] : plan.nativeEffects?.unscoped ?? [];
  const isForm = (variant) => (effectsById.get(String(variant?.uuid ?? "").split(".").pop())?.system?.rules ?? []).some((rule) => rule?.key === "BattleForm");
  if (variants.length < (kind === "effect-choice" ? 1 : 2) || !variants.every(isForm) || (kind === "unsupported" && plan.resolution.check)) return plan;
  const { choiceId, ...application } = { ...(plan.resolution.applications?.[0] ?? { kind: "native-spell-effect", uuid: variants[0].uuid }), source: "nativeEffects.onUse" };
  const { selector, native, ...resolution } = plan.resolution;
  return { ...plan, choiceForms: variants.map((variant) => variant.uuid), nativeEffects: { ...plan.nativeEffects, onUse: [{ ...variants[0], scope: "on-use" }], choiceVariants: [], unscoped: [] }, resolution: { ...resolution, kind: "effect", applications: [application] } };
}
// (Untamed Form's heightened entries: "Heightened (2nd) You can transform into shapes listed in @UUID[…]{Animal Form}".)
const FORMS_FROM = /Heightened \((\d+)(?:st|nd|rd|th)\)\s*(?:<\/strong>)?\s*You can transform into (?:the )?shapes listed in @UUID\[[^\]]+\]\{([^}]+)\}/gi;

// A PF2e spell by its name (remaster names), or null.
export function spellNamed(name) {
  return spellsByName.get(String(name).toLowerCase()) ?? null;
}

// A creature's spells as the simulator's entries, with their pools: cantrips at its cantrip rank, focus spells, innate uses, spontaneous
// slots per rank, prepared slots. A coven's spells only with its coven (L5). onError(spell, error) for a spell that doesn't compile.
// (S22: and its scrolls, wands and staff, npcItemSpells.)
export function npcSpells(npc, { onError = () => {}, basics = null } = {}) {
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
      // (Telekinetic Maneuver: a way per basic action, with the spell attack; basics: the ability module's basic actions.)
      const ways = maneuverWays(plan, basics);
      if (ways.length) {
        for (const way of ways) spells.push({ name: way.name, plan: way.plan, castRank, dc, attack, pool, effects: {} });
        return;
      }
      if (plan?.resolution?.kind === "summon") {
        summoned.push(spellSummonEntry({ name: spell.name, plan, castRank }, pool ? spellPools[pool] : 2));
        return;
      }
      const effects = withTextConditions(effectModels(plan, castRank), spell, castRank);
      // (Shield, the spell: the magic shield the creature raises by casting it.)
      const shield = Object.values(effects).find((model) => model?.spellShield)?.spellShield;
      // (A touch burn its text gives the caster with no effect to carry it — Shroud of Flame's.)
      const selfRetaliation = plan?.resolution?.kind === "retaliation" ? null : looseRetaliation(effects, spell, castRank);
      spells.push({ name: spell.name, plan, castRank, dc, attack, pool, ...(/\bcoven\b/i.test(entry.name ?? "") ? { coven: true } : {}), effects, ...(shield ? { spellShield: shield } : {}), ...(selfRetaliation ? { selfRetaliation } : {}) });
    };
    for (const spell of own) {
      const traits = spell.system?.traits?.value ?? [];
      const rank = spell.system?.location?.heightenedLevel ?? spell.system?.level?.value ?? 1;
      if (traits.includes("cantrip")) add(spell, cantripRank, null);
      else if (kind === "focus" || traits.includes("focus")) { spellPools.focus = npc.system?.resources?.focus?.max ?? 1; add(spell, cantripRank, "focus"); }
      // (2026-10-22: an innate spell with no uses in its data is once a day — PF2e's own reading, its rest giving it `uses.max ?? 1` —; at
      // will only when it says so, "(At Will)", or constant. Before, every one was at will: 6,268 innate spells in the bestiaries — Dominate,
      // Paralyze, Indestructibility — cast every round.)
      else if (kind === "innate") { const unlimited = /\((?:At Will|Constant)\)/i.test(spell.name ?? ""); const max = Number(spell.system?.location?.uses?.max) || (unlimited ? 0 : 1); const pool = max ? `${entry._id}:${spell._id}` : null; if (pool) spellPools[pool] = max; add(spell, rank, pool); }
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
    // (Worn, 1 Interact to take out, the user 2026-10-15; held, none.)
    const draw = item.system?.equipped?.carryType === "held" ? null : { actions: 1, each: item.system.category !== "wand" };
    const base = { pool, from: item.name, item: item._id, ...(item.system.category !== "wand" ? { consumable: true } : {}), ...(draw ? { draw } : {}) };
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
