#!/usr/bin/env node
// Low-value options (2026-10-15; the user: "Make a note of that and any other item, spell or ability that is low value in the simulator for
// testing later"): how often the planner picks each option when it has it.
//   items:     every consumable the simulation plays (tools/lib/pack-items.mjs), two of it for each PC of the standard party of its level,
//              against a severe benchmark encounter; uses a fight at the consumable margin (1.5) and with none (1).
//   spells:    every spell the simulation casts, two casts of it for the party's wizard (the cleric for a divine spell) in place of its
//              own spells, at the level that casts its rank; casts a fight (never cast: the planner would rather Strike or wait).
//   abilities: every bestiary creature's abilities the planner chooses (actions, Strike activities, multi-Strikes), two of the creature
//              against the standard party of its level; uses a fight for each ability name.
// node tools/low-value.mjs <out.json> [items,spells,abilities] [fights]   (Battlezoo creatures are measured, but not written to the docs.)
// node tools/low-value.mjs doc <in.json> <docs/low-value.md>               (the list, from a run's results)
import fs from "node:fs";

if (process.argv[2] === "doc") {
    writeDoc(JSON.parse(fs.readFileSync(process.argv[3], "utf8")), process.argv[4] ?? "docs/low-value.md");
    process.exit(0);
}

const { creatureRefs, npcOf, partyFor, buildMonster } = await import("./lib/deadliness.mjs");
const { npcItems } = await import("./lib/pack-items.mjs");
const { compileSpell, effectModels, readDocuments, PACK_ROOT } = await import("./lib/pack-spells.mjs");
const { simulate, prepareSnapshot } = await import("../src/engine/fight.js");
const { benchmarkEncounter } = await import("../src/engine/benchmarks.js");
const { canCast, describeSpell, isUtility, spellGaps } = await import("../src/engine/spells.js");
const { spellSummonEntry } = await import("../src/engine/summons.js");

const [out = "low-value.json", parts = "items,spells,abilities", fightsArg = "12"] = process.argv.slice(2);
const FIGHTS = Number(fightsArg) || 12;
const clamp = (level) => Math.max(1, Math.min(20, Math.round(level)));
const escape = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// (The benchmark's creature tables end at level 14: higher items and spells are measured there, at their own rank.)
const foesAt = (level) => benchmarkEncounter(Math.min(14, level), "severe").combatants.filter((c) => c.side === "foes");
const studyLevel = (level) => Math.min(14, clamp(level));
const result = { date: new Date().toISOString().slice(0, 10), fights: FIGHTS, items: [], spells: [], abilities: [] };

// How many times a fight's log has one of these creatures use the option ("casts", "uses", "drinks", "feeds").
function uses(logs, actors, name) {
    const line = new RegExp(`^  (?:${actors.map(escape).join("|")})(?:'s)? (?:casts|uses|drinks|feeds|applies) ${escape(name)}(?: |$)`);
    return logs.reduce((sum, log) => sum + log.filter((entry) => line.test(entry)).length, 0);
}

function fights(combatants, options, count = FIGHTS) {
    const snapshot = prepareSnapshot({ combatants });
    const logs = [];
    for (let seed = 1; seed <= count; seed++) logs.push(simulate(snapshot, { morale: false, ...options }, seed, { log: true }).log ?? []);
    return logs;
}

if (parts.includes("items")) {
    const docs = readDocuments(`${PACK_ROOT}/equipment`).filter((doc) => doc.collection === "items" && doc.type === "consumable");
    for (const doc of docs) {
        const own = npcItems({ items: [doc] });
        const entries = [...own.spells.map((spell) => ({ name: spell.name, gaps: spellGaps(spell) })), ...own.activities.map((activity) => ({ name: activity.name, gaps: [] }))];
        // (Played only as a Strike's rider: no PC's Strike lists it.)
        const usable = own.spells.filter((spell) => spell.plan?.trigger?.event !== "strike");
        if (!usable.length && !own.activities.length && !own.fortunes.length) continue;
        const level = studyLevel(doc.system?.level?.value ?? 1);
        const party = partyFor(level).map((pc) => ({ ...pc, spells: [...(pc.spells ?? []), ...usable.map((spell) => ({ ...spell }))], strikeActivities: [...(pc.strikeActivities ?? []), ...own.activities.map((activity) => ({ ...activity }))], fortuneItems: [...(pc.fortuneItems ?? []), ...own.fortunes.map((fortune) => ({ ...fortune }))], spellPools: { ...(pc.spellPools ?? {}), ...Object.fromEntries(Object.keys(own.spellPools).map((pool) => [pool, 2])) } }));
        const combatants = [...party, ...foesAt(level)];
        const actors = party.map((pc) => pc.name);
        const row = { name: doc.name, category: doc.system?.category ?? null, level, gaps: [...new Set(entries.flatMap((entry) => entry.gaps))] };
        for (const margin of [1.5, 1]) row[`margin${margin}`] = uses(fights(combatants, { consumableMargin: margin }), actors, doc.name) / FIGHTS;
        result.items.push(row);
    }
    console.log("items", result.items.length);
}

if (parts.includes("spells")) {
    const party5 = partyFor(5);
    const docs = readDocuments(`${PACK_ROOT}/spells`).filter((doc) => doc.collection === "items" && doc.type === "spell" && !(doc.system?.traits?.value ?? []).includes("ritual"));
    for (const doc of docs) {
        let plan = null;
        try {
            plan = compileSpell(doc);
        } catch {
            plan = null;
        }
        if (!plan || isUtility(plan)) continue;
        const traits = doc.system?.traits?.value ?? [];
        const cantrip = traits.includes("cantrip");
        const focus = traits.includes("focus");
        const rank = cantrip ? 3 : Number(doc.system?.level?.value) || 1;
        const level = cantrip ? 5 : studyLevel(rank * 2 - 1);
        const entry = { name: doc.name, plan, castRank: rank, pool: cantrip ? null : "study", effects: effectModels(plan, rank) };
        if (spellSummonEntry(entry, 2) || !canCast({ spellPools: { study: 2 }, covenReady: true }, entry)) continue;
        const party = (level === 5 ? party5 : partyFor(level)).map((pc) => ({ ...pc }));
        const divine = (doc.system?.traits?.traditions ?? []).includes("divine") && !(doc.system?.traits?.traditions ?? []).includes("arcane");
        const caster = party.find((pc) => pc.name === (divine ? "Cleric" : "Wizard"));
        const known = (caster.spells ?? []).find((spell) => !spell.kind);
        // (Alone: its own spells out, so the spell is weighed against Strikes and basic actions, not against a better spell.)
        caster.spells = [...(caster.spells ?? []).filter((spell) => spell.kind), { ...entry, dc: known?.dc ?? 20, attack: known?.attack ?? 10 }];
        caster.spellPools = { ...(caster.spellPools ?? {}), study: 2 };
        const casts = uses(fights([...party, ...foesAt(level)], {}), [caster.name], doc.name) / FIGHTS;
        result.spells.push({ name: doc.name, rank: cantrip ? 0 : rank, focus, level, caster: caster.name, casts, gaps: spellGaps({ ...entry, dc: 20, attack: 10 }) });
    }
    console.log("spells", result.spells.length);
}

if (parts.includes("abilities")) {
    const byName = new Map();
    for (const ref of creatureRefs()) {
        const npc = npcOf(ref);
        if (!npc) continue;
        let built = null;
        try {
            built = buildMonster(npc);
        } catch {
            built = null;
        }
        if (!built) continue;
        const { monster, reserves } = built;
        // (The options the planner picks on its turn: an action-ability, a Strike activity, a multi-Strike.)
        const options = [
            ...(monster.spells ?? []).filter((spell) => spell.kind === "ability" && describeSpell(spell.plan).event === "use" && describeSpell(spell.plan).actions).map((spell) => spell.name),
            ...(monster.strikeActivities ?? []).filter((activity) => !activity.initiative).map((activity) => activity.name),
            ...(monster.multiStrikes ?? []).map((multi) => multi.name)
        ];
        if (!options.length) continue;
        const level = clamp(ref.level ?? monster.level ?? 1);
        const foes = [0, 1].map((k) => ({ ...structuredClone(monster), id: `m${k}`, side: "foes" }));
        let logs = [];
        try {
            logs = fights([...partyFor(level), ...foes, ...reserves], {}, 2);
        } catch {
            continue;
        }
        for (const name of new Set(options)) {
            const key = `${ref.ref.startsWith("battlezoo") ? "bz" : "pf2e"}|${name}`;
            const row = byName.get(key) ?? { name, battlezoo: ref.ref.startsWith("battlezoo"), creatures: 0, fights: 0, uses: 0, examples: [] };
            row.creatures++;
            row.fights += logs.length;
            row.uses += uses(logs, [monster.name], name);
            if (row.examples.length < 3) row.examples.push(`${monster.name} (${level})`);
            byName.set(key, row);
        }
    }
    result.abilities = [...byName.values()].map((row) => ({ ...row, perFight: row.uses / Math.max(1, row.fights) }));
    console.log("abilities", result.abilities.length);
}

fs.writeFileSync(out, JSON.stringify(result));

// The list for testing later: what the planner (almost) never picks when it has it. Below LOW uses a fight is low.
function writeDoc(data, path) {
    const LOW = 0.05;
    const fixed = (value) => Number(value ?? 0).toFixed(2);
    const gaps = (row) => (row.gaps?.length ? row.gaps.join("; ").replace(/\|/g, "/") : "");
    const byName = (a, b) => String(a.name).localeCompare(String(b.name));
    const items = data.items ?? [];
    const never = items.filter((row) => row.margin1 < LOW).sort((a, b) => String(a.category).localeCompare(String(b.category)) || byName(a, b));
    const margined = items.filter((row) => row.margin1 >= 0.2 && row["margin1.5"] < LOW).sort(byName);
    const spells = (data.spells ?? []).filter((row) => row.casts < LOW).sort((a, b) => a.rank - b.rank || byName(a, b));
    const abilities = (data.abilities ?? []).filter((row) => !row.battlezoo && row.fights >= 4 && row.perFight < LOW).sort((a, b) => b.creatures - a.creatures || byName(a, b));
    const singles = (data.abilities ?? []).filter((row) => !row.battlezoo && row.fights < 4 && row.uses === 0).sort(byName);
    // (The other end: items used almost every time they can be — possibly over-valued, not healing.)
    const most = items.filter((row) => row["margin1.5"] >= 4 && !/\b(?:Healing Potion|Elixir of Life)\b/i.test(row.name)).sort((a, b) => b["margin1.5"] - a["margin1.5"]);
    const bzLow = (data.abilities ?? []).filter((row) => row.battlezoo && (row.fights >= 4 ? row.perFight < LOW : row.uses === 0)).length;
    const lines = [
        "# Low-value options",
        "",
        `The user asked on 2026-10-15: "Make a note of that and any other item, spell or ability that is low value in the simulator for testing later". These are the options the planner almost never picks when it has them (under ${LOW} uses a fight). Low value in the simulator can mean the option is weak in PF2e too (Fear Gem), that the simulation lacks its situation (darkness, poison, travel, a creature it names), or that it's only partly simulated (the gaps column). Each one is worth a look when testing.`,
        "",
        `Measured ${data.date} with \`node tools/low-value.mjs\` (${data.fights} fights for each item and spell, 2 for each creature), and written by \`node tools/low-value.mjs doc <results.json> docs/low-value.md\`.`,
        "- **Items:** two of the item for each PC of the standard party (Fighter, Rogue, Wizard, Cleric) at its level (at most 14, the benchmark's tables), against a severe benchmark encounter. Uses a fight at the consumable margin (1.5) and with none (1).",
        "- **Spells:** two casts for the Wizard (the Cleric for a divine-only spell) at the level that casts its rank (at most 14); cantrips at level 5.",
        "- **Monster abilities:** two of each bestiary creature against the standard party of its level; only the options the planner picks on its turn (actions, Strike activities, multi-Strikes). Battlezoo creatures are measured but not listed here.",
        "",
        "## Noted by hand",
        "",
        "- **Fear Gem** (U7): 2 actions for a Strike and frightened 1 (2 on a critical hit). At level 5 it's worth 4.05 at no margin, less than a Strike and a second one at the attack penalty (about 6.7), so at the consumable margin of 1.5 the benchmark party never uses it; with no margin, about 0.7 a fight (1.0 with Intimidating Strike). Weak in PF2e's action economy too.",
        "- **Counteract consumables** (U10: Surging Serum, Bottled Catharsis, Panacea, Contagion Metabolizer, Salve of Antiparalysis, Moon Radish Soup, Dragon's Blood Pudding …): the benchmark's foes give no conditions or afflictions, so here they show as never used. Against bestiary creatures they work: Salve of Antiparalysis (Greater) was applied to paralyzed PCs 8 times in 12 fights against two Ghoul Razorclaws (level 13), all counteracted, and the basic salve 2 times against Ghasts; the basic salve can't reach a level-13 ghoul's paralysis (rank 7) and isn't used. Surging Serum (Moderate) isn't drunk against Siora Fallowglade's enfeebled 3: the simulation values enfeebled at 0.16 of a round of threat a point, so ending it rarely beats a turn's other options at the 1.5 margin. Worth testing whether enfeebled and clumsy are valued too low.",
        "- **Persistent damage recovery items** (U12: Quenching Potion, Antivenom Potion, Searing Suture, Cauterizing Torch): the benchmark's foes deal no persistent damage, so here they show as never used. Against two Tallow Guardians (persistent fire), the party drank or fed its Quenching Potions 24 times in 12 fights.",
        "",
        `## Items never used, even with no margin (${never.length} of ${items.length})`,
        "",
        "| Item | Category | Level | Uses a fight (1.5 / none) | Not simulated |",
        "|---|---|---|---|---|",
        ...never.map((row) => `| ${row.name} | ${row.category ?? ""} | ${row.level} | ${fixed(row["margin1.5"])} / ${fixed(row.margin1)} | ${gaps(row)} |`),
        "",
        `## Items used only with no margin (${margined.length})`,
        "",
        "Used at least 0.2 times a fight with no margin, but (almost) never at 1.5: what the consumable rule holds back.",
        "",
        "| Item | Category | Level | Uses a fight (1.5 / none) |",
        "|---|---|---|---|",
        ...margined.map((row) => `| ${row.name} | ${row.category ?? ""} | ${row.level} | ${fixed(row["margin1.5"])} / ${fixed(row.margin1)} |`),
        "",
        `## Items used the most (${most.length}): possibly over-valued`,
        "",
        "Not low value, the other end: used 4 or more times a fight of the 8 the party carries, even at the 1.5 margin (healing potions and Elixirs of Life aside). Worth checking that the planner isn't over-rating them: an Invisibility Potion's invisibility ends with the drinker's first hostile action, which its value doesn't count.",
        "",
        "| Item | Category | Level | Uses a fight (1.5 / none) |",
        "|---|---|---|---|",
        ...most.map((row) => `| ${row.name} | ${row.category ?? ""} | ${row.level} | ${fixed(row["margin1.5"])} / ${fixed(row.margin1)} |`),
        "",
        `## Spells never cast (${spells.length} of ${(data.spells ?? []).length})`,
        "",
        "Each spell measured alone: the caster's other spells taken out, so it's weighed against its Strikes and basic actions.",
        "",
        "| Spell | Rank | Caster | Casts a fight | Not simulated |",
        "|---|---|---|---|---|",
        ...spells.map((row) => `| ${row.name} | ${row.rank === 0 ? "cantrip" : row.rank}${row.focus ? " (focus)" : ""} | ${row.caster} | ${fixed(row.casts)} | ${gaps(row)} |`),
        "",
        `## Monster abilities never used (${abilities.length} PF2e ability names; ${bzLow} Battlezoo ones not listed)`,
        "",
        "| Ability | Creatures with it | Fights | Uses a fight | For example |",
        "|---|---|---|---|---|",
        ...abilities.map((row) => `| ${row.name} | ${row.creatures} | ${row.fights} | ${fixed(row.perFight)} | ${row.examples.join(", ")} |`),
        "",
        `## Monster abilities of one creature never used (${singles.length}; less certain)`,
        "",
        "On one creature only, so 2 fights (two of it each). Not used in either.",
        "",
        "| Ability | Creature |",
        "|---|---|",
        ...singles.map((row) => `| ${row.name} | ${row.examples.join(", ")} |`),
        ""
    ];
    fs.writeFileSync(path, lines.join("\n"));
    console.log("written", path, { never: never.length, margined: margined.length, spells: spells.length, abilities: abilities.length, bzLow });
}

