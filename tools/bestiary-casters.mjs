// Bestiary spellcasters through the simulator: every NPC with spellcasting in
// the given PF2e packs (Monster Core 1-2 and NPC Core by default) gets its
// spells, compiled by the spell module (read only), on a moderate creature of
// its level, and fights a martial party three times. Reports how many spells
// the simulation casts, how many it models fully, what it leaves out, and any
// errors. Needs Node, the spell module's folder and Foundry's PF2e data.
//
//   node tools/bestiary-casters.mjs [pack …]
const W = decodeURIComponent(new URL("../../PF2e AUTOMATIC SPELL RESOLUTION", import.meta.url).pathname);
const { compileAbility } = await import(`${W}/src/compiler/index.js`);
const { readDocuments } = await import(new URL("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { simulate } = await import("../src/engine/fight.js");
const { moderateCreature, martialParty } = await import("../src/engine/benchmarks.js");
const { canCast, isUtility, spellGaps } = await import("../src/engine/spells.js");
const { effectModel } = await import("../src/engine/effects.js");
const PACK_ROOT = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
// As the spell module's official compile does: its native-effect catalog and
// the spells others reference, so plans match live play.
const effectItems = readDocuments(`${PACK_ROOT}/spell-effects`).filter((d) => d.collection === "items");
const nativeEffectCatalog = new Map(effectItems.map((effect) => [effect.name, {
  id: effect._id ?? null, name: effect.name, type: effect.type,
  automation: { ruleKeys: [...new Set((effect.system?.rules ?? []).map((rule) => rule.key).filter(Boolean))], requiresConfiguration: (effect.system?.rules ?? []).some((rule) => rule.key === "ChoiceSet"), removesAfterRoll: (effect.system?.rules ?? []).some((rule) => rule.removeAfterRoll != null) },
  mechanics: { rules: effect.system?.rules ?? [], duration: effect.system?.duration ?? null, start: effect.system?.start ?? null },
  ...(effect.system?.badge ? { badge: effect.system.badge } : {})
}]));
const referencedSpells = new Map(readDocuments(`${PACK_ROOT}/spells`).filter((d) => d.collection === "items" && d._id).map((spell) => [`Compendium.pf2e.spells-srd.Item.${spell._id}`, spell]));
const effectsById = new Map(effectItems.map((effect) => [effect._id, effect]));
const conditionNames = new Map(readDocuments(`${PACK_ROOT}/conditions`).filter((d) => d.collection === "items").map((condition) => [condition._id, condition.system?.slug ?? condition.name.toLowerCase().replace(/\s+/g, "-")]));
const conditionSlug = (uuid) => conditionNames.get(String(uuid ?? "").split(".").pop()) ?? null;
// The effect models a plan's PF2e spell effects make, at the cast rank.
const effectModels = (plan, castRank) => Object.fromEntries([...new Set(JSON.stringify(plan).match(/Compendium\.pf2e\.spell-effects\.Item\.[A-Za-z0-9]{16}/g) ?? [])]
  .map((uuid) => [uuid, effectsById.get(uuid.split(".").pop())]).filter(([, item]) => item).map(([uuid, item]) => [uuid, effectModel(item, { rank: castRank, conditionSlug })]));
const PACKS = process.argv.slice(2).length ? process.argv.slice(2) : ["pathfinder-monster-core", "pathfinder-monster-core-2", "pathfinder-npc-core"];
const stats = { npcs: 0, casters: 0, spells: 0, castable: 0, full: 0, fights: 0, casts: 0, errors: [] };
const missing = new Map();
const t0 = Date.now();
const kinds = new Map();
for (const pack of PACKS) {
  const npcs = readDocuments(`${PACK_ROOT}/${pack}`).filter((d) => d.collection === "actors" && d.type === "npc");
  for (const npc of npcs) {
    stats.npcs++;
    const level = Math.max(-1, Math.min(14, npc.system?.details?.level?.value ?? 1));
    const entries = (npc.items ?? []).filter((i) => i.type === "spellcastingEntry" && !["ritual", "items"].includes(i.system?.prepared?.value));
    if (!entries.length) continue;
    const spells = [];
    const spellPools = {};
    const cantripRank = Math.min(10, Math.max(1, Math.ceil((npc.system?.details?.level?.value ?? 1) / 2)));
    for (const entry of entries) {
      const kind = entry.system?.prepared?.value;
      const dc = entry.system?.spelldc?.dc ?? 20;
      const attack = entry.system?.spelldc?.value ?? 10;
      const own = (npc.items ?? []).filter((i) => i.type === "spell" && i.system?.location?.value === entry._id && !(i.system?.traits?.value ?? []).includes("ritual"));
      const byId = new Map(own.map((s) => [s._id, s]));
      const add = (spell, castRank, pool) => {
        let plan;
        try { plan = compileAbility(spell, { nativeEffectCatalog, referencedSpells }); } catch (e) { stats.errors.push(`${npc.name}/${spell.name}: compile ${e.message}`); return; }
        spells.push({ name: spell.name, plan, castRank, dc, attack, pool, effects: effectModels(plan, castRank) });
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
    if (!spells.length) continue;
    stats.casters++;
    for (const spell of spells) {
      stats.spells++;
      if (isUtility(spell.plan)) stats.utility = (stats.utility ?? 0) + 1;
      kinds.set(spell.plan.resolution?.kind, (kinds.get(spell.plan.resolution?.kind) ?? 0) + 1);
      if (!canCast({ spellPools: { [spell.pool]: 1 } }, spell)) continue;
      stats.castable++;
      const gaps = spellGaps(spell);
      if (!gaps.length) stats.full++;
      for (const g of gaps) missing.set(g.replace(/^(note|effect): .*/, "$1: …"), (missing.get(g.replace(/^(note|effect): .*/, "$1: …")) ?? 0) + 1);
    }
    const base = moderateCreature(level, "caster", npc.name);
    const snapshot = { combatants: [...martialParty(Math.max(1, level)), { ...base, spells, spellPools, band: "far" }, { ...moderateCreature(level, "brute", "Brute") }] };
    for (let seed = 1; seed <= 3; seed++) {
      try {
        const r = simulate(snapshot, {}, seed, { log: true });
        stats.fights++;
        stats.casts += r.log.filter((l) => l.includes("Caster casts") || l.includes(`${npc.name} casts`)).length;
      } catch (e) { stats.errors.push(`${npc.name} seed ${seed}: ${e.message}\n${e.stack.split("\n").slice(1, 3).join("\n")}`); }
    }
  }
}
console.log({ ...stats, errors: stats.errors.length, seconds: (Date.now() - t0) / 1000 });
console.log(stats.errors.slice(0, 8).join("\n"));
console.log([...missing].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => `${n}\t${k}`).join("\n"));
console.log("kinds:", [...kinds].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `${k}:${n}`).join("  "));
