// An index of every feat that the feat module doesn't automate or the simulator doesn't rate, grouped by why (2026-11-04, Cole: "index every
// feat not automated by the feat module or not simulated in the simulator module and group them by why they are not in these modules"):
//
//   node tools/feat-gap-index.mjs <screen jsonl>... [--md=docs/feat-gaps.md] [--json=docs/feat-gaps.json]
//
// The feat module's side: what it does for the feat — a card (compileFeat's plan), the feat named by hand in its plans, rules or scripts, a
// reminder at its trigger — or nothing; with nothing, whether PF2e's own rule elements already do it, else what the feat does, from its text.
// The simulator's side: the feat screen's row (tools/feat-power.mjs screen; a later file's row wins) — rated, or the reason it wasn't.
import fs from "node:fs";
import path from "node:path";

const { readDocuments, basicActions, PACK_ROOT } = await import("./lib/pack-creatures.mjs");
const { itemReaders } = await import("./lib/feat-power.mjs");
const { CLASS_SLUGS } = await import("../src/engine/classes.js");
// (2026-11-07: a combo feat — only basic actions — is rated from its actions, not in fights: tools/combo-feats.mjs, docs/combo-feats.md.)
const { COMBOS, comboValue } = await import("./combo-feats.mjs");
const COMBO_VALUE = new Map(COMBOS.map((entry) => [entry.name, comboValue(entry)]));
const FEAT_ROOT = path.resolve(process.env.FEAT_MODULE ?? new URL("../../pf2e-automatic-feat-resolution", import.meta.url).pathname);
const { compileFeat } = await import(path.join(FEAT_ROOT, "src/compiler/index.js"));
const { turnTrigger } = await import(path.join(FEAT_ROOT, "src/compiler/turn-reminders.js"));
const { eventTrigger, preRollTrigger, ownUseTrigger } = await import(path.join(FEAT_ROOT, "src/compiler/event-reminders.js"));
// A kineticist impulse feat the kineticist module (pf2e-automatic-kineticist-resolution) reads plays from there, not the feat module.
const KIN_ROOT = path.resolve(process.env.KINETICIST_MODULE ?? new URL("../../pf2e-automatic-kineticist-resolution", import.meta.url).pathname);
const readImpulse = fs.existsSync(path.join(KIN_ROOT, "src/reader/impulse-reader.js")) ? (await import(path.join(KIN_ROOT, "src/reader/impulse-reader.js"))).readImpulse : null;
const impulseRead = (doc, level) => {
    if (!readImpulse || !(doc.system?.traits?.value ?? []).includes("impulse")) return false;
    try {
        return Boolean(readImpulse(doc, { level }));
    } catch {
        return false;
    }
};

const args = process.argv.slice(2);
const files = args.filter((arg) => !arg.startsWith("--"));
const opt = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const mdPath = opt("md", "docs/feat-gaps.md");
const jsonPath = opt("json", "docs/feat-gaps.json");

const rows = new Map();
for (const file of files) for (const line of fs.readFileSync(file, "utf8").split("\n")) if (line) {
    const row = JSON.parse(line);
    if (row.ref?.pack === "feats") rows.set(row.ref.id, row);
}

// Every feats-srd id the feat module's source names: a hand plan, a rule batch, a script's list.
const named = new Set();
const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".js")) for (const match of fs.readFileSync(full, "utf8").matchAll(/(?:feats-srd\.Item\.|pf2e\(")([A-Za-z0-9]{16})\b/g)) named.add(match[1]);
    }
};
for (const dir of ["src", "scripts"]) if (fs.existsSync(path.join(FEAT_ROOT, dir))) walk(path.join(FEAT_ROOT, dir));
// (And by slug: the assessment feats — Battle Assessment, Combat Reading — the module's src/plans/assessment.js names so.)
const namedSlugs = new Set();
const assessments = path.join(FEAT_ROOT, "src", "plans", "assessment.js");
if (fs.existsSync(assessments)) for (const match of fs.readFileSync(assessments, "utf8").matchAll(/"([a-z-]+)": \{ statistic/g)) namedSlugs.add(match[1]);

const plain = (html) => String(html ?? "").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@UUID\[[^\]]*?([^.\]]+)\]/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const dcsFor = (level) => {
    const dc = 14 + level + Math.min(4, 3 + Math.floor(level / 10));
    return { level, class: dc, spell: dc, perception: dc, byClass: Object.fromEntries(CLASS_SLUGS.map((slug) => [slug, dc])), byTradition: { arcane: dc, divine: dc, occult: dc, primal: dc }, statistics: {}, abilities: { str: 4, dex: 4, con: 2, int: 2, wis: 2, cha: 2 }, attacks: { spell: dc - 10, strikes: [{ group: "sword", ranged: false, mod: dc - 10 }], proficiency: { simple: level + 4, martial: level + 4, unarmed: level + 4, advanced: level + 2 } } };
};

// PF2e's own rule elements that do something on their own (a Note only shows text; a ChoiceSet only asks).
const DOING = new Set(["FlatModifier", "Resistance", "Weakness", "Immunity", "DamageDice", "AdjustModifier", "AdjustDegreeOfSuccess", "Sense", "BaseSpeed", "ActiveEffectLike", "CriticalSpecialization", "Strike", "FastHealing", "TempHP", "Striking", "WeaponPotency", "MartialProficiency", "AdjustStrike", "DexterityModifierCap", "RollTwice", "SubstituteRoll", "CreatureSize", "LoseHitPoints", "MultipleAttackPenalty", "CraftingAbility", "Aura", "EphemeralEffect", "AdjustDamage", "DamageAlteration", "ItemAlteration", "SpecialStatistic", "RollOption", "TokenLight", "Proficiency"]);
const GRANTS = new Set(["GrantItem"]);
const ruleKinds = (doc) => [...new Set((doc.system?.rules ?? []).map((rule) => rule.key))];

const OUT_OF_COMBAT = /\b(during exploration|exploration activity|downtime|daily preparations|you spend (?:10 minutes|1 hour|an hour|1 minute)|takes? (?:10 minutes|1 hour|an hour|1 day)|Earn Income|Craft|Subsist|Treat Wounds|Refocus|Decipher Writing|Identify Magic|Learn a Spell|Recall Knowledge|Gather Information|Make an Impression|Request|Sense Direction|Track|Coerce|Lie|Impersonate|Forge|Borrow an Arcane Spell|formula|travel speed|overland|Lore|languages?)\b/i;
const COMPANION = /\b(animal companion|your companion|familiar|eidolon|construct companion|your minion|your mount|undead companion|your bonded)\b/i;
const SPELLCASTING = /\b(spell slot|Cast a Spell|focus spell|focus point|cantrip|spellshape|metamagic|spell repertoire|spellbook|prepared spells?|signature spell|innate spell)\b/i;
const COMBAT = /\b(Strike|damage|attack roll|AC\b|saving throw|Fortitude|Reflex|Will save|frightened|off-guard|prone|grabbed|stunned|slowed|Hit Points|temporary Hit Points|resistance|weakness|Stride|Step|enemy|enemies|foe)\b/i;
const CHOICE = /\b(you gain (?:a|an|one) (?:\d+(?:st|nd|rd|th)-level )?(?:class|skill|general|ancestry) feat|you gain the [A-Z][\w' -]+ (?:feat|action|reaction)|select (?:one|a|an)|choose (?:one|a|an|two))\b/i;

const WHAT = [
    ["dedication", "Archetype dedications and feats that grant other feats or class features"],
    ["combat-action", "Combat actions and reactions"],
    ["combat-passive", "Combat passives"],
    ["spellcasting", "Spellcasting (slots, focus, spellshapes, innate spells)"],
    ["companion", "Companions, familiars and eidolons"],
    ["out-of-combat", "Out of combat (exploration, downtime, skills, languages)"],
    ["other", "Roleplay and other (nothing a fight or check would use)"]
];
const whatOf = (doc, text, kinds) => {
    const traits = doc.system?.traits?.value ?? [];
    const actionType = doc.system?.actionType?.value ?? "passive";
    if (/Dedication$/.test(doc.name) || traits.includes("dedication") || kinds.some((kind) => GRANTS.has(kind)) || CHOICE.test(text)) return "dedication";
    if (traits.some((trait) => ["exploration", "downtime"].includes(trait)) || (OUT_OF_COMBAT.test(text) && !/\bStrike\b|attack roll|saving throw/.test(text))) return "out-of-combat";
    if (COMPANION.test(text) && !/\byou make a Strike|you Strike\b/i.test(text)) return "companion";
    if (traits.some((trait) => ["spellshape", "metamagic"].includes(trait)) || (SPELLCASTING.test(text) && !/\bStrike\b/.test(text))) return "spellcasting";
    if (actionType !== "passive" && COMBAT.test(text)) return "combat-action";
    if (COMBAT.test(text)) return "combat-passive";
    return "other";
};

const CATEGORY = { ancestry: "ancestry", class: "class", general: "general", skill: "skill", bonus: "bonus", pfsboon: "PFS boon", calling: "calling", mythic: "mythic", ancestryfeature: "ancestry feature", classfeature: "class feature", curse: "curse", deityboon: "deity boon" };
const categoryOf = (doc) => {
    const category = doc.system?.category ?? "other";
    if (category === "class" && (doc.system?.traits?.value ?? []).includes("archetype")) return "archetype";
    return CATEGORY[category] ?? category;
};
// The simulator's reason, short: its wording without the feat's own details in brackets.
const reasonOf = (reason) => String(reason ?? "").replace(/\s*\(.*$/, "").replace(/: .*$/, "").replace(/^its stance$/, "its stance's own gap").trim() || "no reason given";

const docs = readDocuments(`${PACK_ROOT}/feats`).filter((doc) => doc.collection === "items" && doc.type === "feat");
const all = [];
for (const doc of docs) {
    const level = Math.max(1, Number(doc.system?.level?.value ?? 1) || 1);
    const text = plain(doc.system?.description?.value);
    const kinds = ruleKinds(doc);
    const sourced = { ...doc, sourceId: `Compendium.pf2e.feats-srd.Item.${doc._id}` };
    let plan = null;
    let error = null;
    try {
        plan = compileFeat(sourced, { dcs: dcsFor(level), basicActions, itemReaders });
    } catch (caught) {
        error = caught.message;
    }
    let reminder = null;
    try {
        reminder = turnTrigger(sourced) ?? eventTrigger(sourced) ?? preRollTrigger(sourced) ?? ownUseTrigger(sourced) ?? null;
    } catch {
        reminder = null;
    }
    const featModule = plan ? "card" : named.has(doc._id) || namedSlugs.has(doc.system?.slug ?? String(doc.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) ? "by hand" : impulseRead(doc, level) ? "kineticist module" : reminder ? "reminder" : error ? "error" : "none";
    const pf2e = kinds.filter((kind) => DOING.has(kind));
    const row = rows.get(doc._id) ?? null;
    const combo = (!row || row.skipped || row.error) && COMBO_VALUE.has(doc.name);
    const simulator = combo ? "rated" : !row ? "not screened" : row.skipped || row.error ? "not rated" : "rated";
    all.push({
        id: doc._id, name: doc.name, level: Number(doc.system?.level?.value ?? 0), category: categoryOf(doc), actionType: doc.system?.actionType?.value ?? "passive", actions: doc.system?.actions?.value ?? null,
        rarity: doc.system?.traits?.rarity ?? "common", selfEffect: Boolean(doc.system?.selfEffect), traits: doc.system?.traits?.value ?? [], featModule, pf2eRules: pf2e, grants: kinds.some((kind) => GRANTS.has(kind)), what: whatOf(doc, text, kinds),
        simulator, simReason: simulator === "rated" ? null : simulator === "not screened" ? "not in the feat screen" : reasonOf(row.error ? `error: ${row.error}` : row.reason), simDetail: row?.reason ?? row?.error ?? null,
        rating: combo ? Number(COMBO_VALUE.get(doc.name).toFixed(2)) : simulator === "rated" ? Number(row.levels.toFixed(2)) : null, ...(combo ? { valued: "from its actions (combo-feats.md)" } : {}), text: text.slice(0, 200)
    });
}

// (2026-11-07, batches 30-: feats the text sorter took for combat that aren't: what each is, read by hand.)
const OOC = "out of combat (exploration, downtime, skills)", CASTING = "spellcasting the spell module or PF2e handles", NOTHING = "roleplay or nothing to automate", NOTED = "PF2e's own Note shows it on its roll";
const WHY_BY_ID = {
    uhU0KajD09h5bw4e: OOC, SXaQi6cZ58mvz9rV: OOC, f6k9lIrIS4SfnCnG: OOC, mnH68QcFRtkMbNE0: OOC, OuEIsBtQD1Fgx6Gz: OOC, vqxKsnFhzWv7AykV: OOC, BQzExsEZrwGsJD66: OOC, u6tLp3zTBweq7CxO: OOC,
    kQbv3yCW1yhaKSJU: CASTING, hqasqwjrTzOFkDY3: CASTING, gMPnLWLlHoNU9Lqv: CASTING,
    TXXrkkFfNSWgHrn5: NOTHING, "45F4nNN8gxoBdSnk": NOTHING,
    Wx12NUjqTOjFrEoW: NOTED, QZ00D2xdJnbWFzml: NOTED, OWhTAowdMvBZnCrT: NOTED
};
const NO_CREATURE = new Set(["XLoRtMn48f2KKvsu", "G6aNxXTIJYIGeicK", "5lqVFVTA98M6E80o", "Ar6W97iun6yYI8Df", "LNyTKhIZlM17026W", "xT593tHyPkumPuzz", "MbvPuMVy2VhftJgd", "969mPoiYANzV2261", "jSZJWYHZU3hnGRcp", "1re3J4hWW7raXIRB", "dUnT3HWMFD3d2eBJ"]);
// Why the feat module leaves a feat, in order: PF2e already does it; it only grants other things; then what it does.
const moduleWhy = (row) => {
    if (row.featModule !== "none" && row.featModule !== "error") return null;
    if (row.featModule === "error") return "compile error";
    // (2026-10-31 Cole's rule: a feat that only combines basic actions leaves the automation queue — tools/combo-feats.mjs.)
    if (COMBO_VALUE.has(row.name)) return "only basic actions combined (no automation, Cole's rule)";
    // (2026-11-07, batch 30: actions on objects, locks, traps or slopes, or on a variant rule's Stamina — nothing on a fight's creatures.)
    if (NO_CREATURE.has(row.id)) return "objects, locks, traps, slopes or variant rules";
    if (WHY_BY_ID[row.id]) return WHY_BY_ID[row.id];
    if (row.pf2eRules.length) return "PF2e's own rule elements already do it";
    // (Its own Effect PF2e puts on from the feat's Use button — docs/feats.md D9 leaves it to PF2e.)
    if (row.selfEffect) return "PF2e's own Effect, from the feat's Use button";
    if (row.grants || row.what === "dedication") return "only grants other feats, features or choices";
    return {
        "out-of-combat": "out of combat (exploration, downtime, skills)",
        "spellcasting": "spellcasting the spell module or PF2e handles",
        "companion": "companions, familiars and eidolons",
        "combat-action": "a combat action no reader or hand plan covers yet",
        "combat-passive": "a combat passive no reader or hand plan covers yet",
        "other": "roleplay or nothing to automate"
    }[row.what];
};
for (const row of all) {
    row.moduleWhy = moduleWhy(row);
    // (The simulator plays the feat module's cards and PF2e's rules: "reads nothing" is split by why there's no card.)
    if (row.simReason === "the feat module reads nothing for it") row.simReason = row.moduleWhy === "PF2e's own rule elements already do it" ? "no card, and PF2e's rule elements on it change nothing a fight counts" : row.moduleWhy ? `no card: ${row.moduleWhy}` : `no card: the feat module's ${row.featModule === "by hand" ? "hand-written handling (a script, rule batch or list)" : "reminder"}, which a fight doesn't play`;
}

const count = (list, key) => list.reduce((counts, row) => ({ ...counts, [key(row)]: (counts[key(row)] ?? 0) + 1 }), {});
const sorted = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1]);
const notModule = all.filter((row) => row.moduleWhy);
const notSim = all.filter((row) => row.simulator !== "rated");
const neither = all.filter((row) => row.moduleWhy && row.simulator !== "rated");
const categories = [...new Set(all.map((row) => row.category))].sort((a, b) => all.filter((row) => row.category === b).length - all.filter((row) => row.category === a).length);
const type = (row) => (row.actionType === "action" ? `${row.actions ?? 1} action${(row.actions ?? 1) > 1 ? "s" : ""}` : row.actionType);
const cell = (value) => String(value ?? "").replace(/\|/g, "/");

const lines = [];
lines.push("# Feats the feat module doesn't automate or the simulator doesn't rate", "");
lines.push(`Made by \`node tools/feat-gap-index.mjs\` on ${new Date().toISOString().slice(0, 10)}. It covers all ${all.length} feats in PF2e's feats pack (Teams+ and other module packs aren't in this copy, so they aren't here).`, "");
lines.push(`- **The feat module** automates ${all.length - notModule.length}: a card it compiles, a feat named in its hand plans, rules or scripts, or a reminder at its trigger. **${notModule.length} it doesn't.**`);
lines.push(`- **The simulator** rates ${all.length - notSim.length}: in whole fights, or ${all.filter((row) => row.valued).length} combo feats from the basic actions they fold in (docs/combo-feats.md). **${notSim.length} it doesn't.**`);
lines.push(`- **${neither.length}** are in neither.`, "");
lines.push("## Summary by category", "", "| Category | Feats | Not automated by the feat module | Not rated by the simulator | Neither |", "|---|---:|---:|---:|---:|");
for (const category of categories) {
    const list = all.filter((row) => row.category === category);
    lines.push(`| ${category} | ${list.length} | ${list.filter((row) => row.moduleWhy).length} | ${list.filter((row) => row.simulator !== "rated").length} | ${list.filter((row) => row.moduleWhy && row.simulator !== "rated").length} |`);
}
lines.push(`| **All** | ${all.length} | ${notModule.length} | ${notSim.length} | ${neither.length} |`, "");

const moduleReasons = sorted(count(notModule, (row) => row.moduleWhy));
lines.push("## Why the feat module doesn't automate them", "", `| Reason | ${categories.join(" | ")} | Total |`, `|---|${categories.map(() => "---:").join("|")}|---:|`);
for (const [reason, n] of moduleReasons) lines.push(`| ${reason} | ${categories.map((category) => notModule.filter((row) => row.moduleWhy === reason && row.category === category).length || "").join(" | ")} | ${n} |`);
lines.push("");
const simReasons = sorted(count(notSim, (row) => row.simReason));
lines.push("## Why the simulator doesn't rate them", "", "The simulator's own reason, from the feat screen. \"The feat module reads nothing for it\" means there's no card and no PF2e rule a fight counts, so it's mostly the same feats as the feat module's list above.", "", `| Reason | ${categories.join(" | ")} | Total |`, `|---|${categories.map(() => "---:").join("|")}|---:|`);
for (const [reason, n] of simReasons) lines.push(`| ${reason} | ${categories.map((category) => notSim.filter((row) => row.simReason === reason && row.category === category).length || "").join(" | ")} | ${n} |`);
lines.push("");

lines.push("## The feat module's gaps, feat by feat", "");
for (const [reason] of moduleReasons) {
    const list = notModule.filter((row) => row.moduleWhy === reason).sort((a, b) => a.category.localeCompare(b.category) || a.level - b.level || a.name.localeCompare(b.name));
    lines.push(`### ${reason} (${list.length})`, "", "| Feat | Lvl | Category | Type | Simulator |", "|---|---:|---|---|---|");
    for (const row of list) lines.push(`| ${cell(row.name)} | ${row.level} | ${row.category} | ${type(row)} | ${row.simulator === "rated" ? `rated ${row.rating}` : cell(row.simReason)} |`);
    lines.push("");
}
lines.push("## The simulator's gaps among feats the feat module automates, feat by feat", "", "(The feat module's gaps above are mostly the simulator's too; these are the ones the feat module plays and the simulator doesn't.)", "");
const simOnly = notSim.filter((row) => !row.moduleWhy);
for (const [reason] of sorted(count(simOnly, (row) => row.simReason))) {
    const list = simOnly.filter((row) => row.simReason === reason).sort((a, b) => a.category.localeCompare(b.category) || a.level - b.level || a.name.localeCompare(b.name));
    lines.push(`### ${reason} (${list.length})`, "", "| Feat | Lvl | Category | Type | Feat module | Detail |", "|---|---:|---|---|---|---|");
    for (const row of list) lines.push(`| ${cell(row.name)} | ${row.level} | ${row.category} | ${type(row)} | ${row.featModule} | ${cell((row.simDetail ?? "").slice(0, 110))} |`);
    lines.push("");
}
fs.writeFileSync(mdPath, lines.join("\n"));
fs.writeFileSync(jsonPath, `${JSON.stringify({ generated: new Date().toISOString(), counts: { feats: all.length, notModule: notModule.length, notSimulator: notSim.length, neither: neither.length }, feats: all.filter((row) => row.moduleWhy || row.simulator !== "rated").map(({ text, traits, simDetail, ...row }) => row) })}\n`);
console.log(`${all.length} feats: ${notModule.length} not automated, ${notSim.length} not rated, ${neither.length} neither → ${mdPath}, ${jsonPath}`);
console.log("module:", Object.fromEntries(moduleReasons));
console.log("simulator:", Object.fromEntries(simReasons.slice(0, 25)));
process.exit(0);
