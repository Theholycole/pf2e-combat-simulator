// Bestiary spellcasters through the simulator: every NPC with spellcasting in
// the given PF2e packs (Monster Core 1-2 and NPC Core by default) gets its
// spells, compiled by the spell module (read only), on a moderate creature of
// its level, and fights a martial party three times. Reports how many spells
// the simulation casts, how many it models fully, what it leaves out, and any
// errors. Needs Node, the spell module's folder and Foundry's PF2e data.
//
//   node tools/bestiary-casters.mjs [pack …]
const { simulate } = await import("../src/engine/fight.js");
const { moderateCreature, martialParty } = await import("../src/engine/benchmarks.js");
const { canCast, isUtility, spellGaps } = await import("../src/engine/spells.js");
const { PACK_ROOT, npcSpells, readDocuments } = await import("./lib/pack-spells.mjs");
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
    const { spells, spellPools } = npcSpells(npc, { onError: (spell, e) => stats.errors.push(`${npc.name}/${spell.name}: compile ${e.message}`) });
    if (!spells.length) continue;
    stats.casters++;
    for (const spell of spells) {
      stats.spells++;
      if (isUtility(spell.plan)) stats.utility = (stats.utility ?? 0) + 1;
      kinds.set(spell.plan.resolution?.kind, (kinds.get(spell.plan.resolution?.kind) ?? 0) + 1);
      if (!canCast({ spellPools: { [spell.pool]: 1 }, covenReady: true }, spell)) continue;
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
