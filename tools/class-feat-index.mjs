// An index of the class feats neither the feat module nor the simulator plays (2026-11-03, Cole: "do an index of all class feats not
// handled by the Feat module or the simulator then begin working on implementing them"):
//
//   node tools/class-feat-index.mjs <screen jsonl>... [--md=docs/class-feat-gaps.md] [--json=<path>]
//
// Reads the feat screen's rows (tools/feat-power.mjs screen; a later file's row wins) for PF2e's class-category feats, and sorts each one the
// screen didn't rate into a bucket by what it does, so the combat ones come first.
import fs from "node:fs";

const { readDocuments, PACK_ROOT } = await import("./lib/pack-creatures.mjs");
const { CLASS_SLUGS } = await import("../src/engine/classes.js");

const args = process.argv.slice(2);
const files = args.filter((arg) => !arg.startsWith("--"));
const opt = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const mdPath = opt("md", "docs/class-feat-gaps.md");
const jsonPath = opt("json", "docs/class-feat-gaps.json");

const rows = new Map();
for (const file of files) for (const line of fs.readFileSync(file, "utf8").split("\n")) if (line) {
    const row = JSON.parse(line);
    rows.set(row.ref.ref, row);
}
const docs = new Map(readDocuments(`${PACK_ROOT}/feats`).filter((doc) => doc.collection === "items").map((doc) => [doc._id, doc]));
const plain = (html) => String(html ?? "").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@UUID\[[^\]]*?([^.\]]+)\]/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// What a class's feats build on: a passive naming one changes how the class feature plays.
const FEATURES = /\b(Rage|raging|Hunt Prey|hunted prey|Panache|finisher|Spellstrike|Arcane Cascade|Overdrive|Exploit Vulnerability|Flurry of Blows|Ki Strike|Elemental Blast|overflow|impulse|bomb|eidolon|Act Together|Sneak Attack|Devise a Stratagem|Champion's reaction|Retributive Strike|Lay on Hands|blessed (?:armament|shield|swiftness)|Channel Smite|Divine Font|composition|Courageous Anthem|Unleash (?:your )?Psyche|amp|hex|patron|Cursebound|curse|mystery|implement|Esoteric Antithesis|tactic|banner|Strike Hard|Taunt|Guardian's|ikon|Spark|Transcendence|Shift Immanence|apparition|vessel|thrall|Create Thrall|rune|Invoke|Trace|Fake Out|Reload|Risky Reload|deed|Weapon Innovation|Armor Innovation|Construct Innovation|Unstable|Explode|order spell|wild shape|Untamed Form|familiar|Spirit Trance|Overdrive)\b/i;
const OUT_OF_COMBAT = /\b(during exploration|exploration activity|downtime|daily preparations|you spend (?:10 minutes|1 hour|an hour|1 minute)|takes? (?:10 minutes|1 hour|an hour|1 day)|Earn Income|Craft|Subsist|Treat Wounds|Refocus|Decipher Writing|Identify Magic|Learn a Spell|Recall Knowledge|Gather Information|Make an Impression|Request|Sense Direction|Track|Coerce|Lie|Impersonate|Forge|Borrow an Arcane Spell|formula|travel speed|overland)\b/i;
const COMPANION = /\b(animal companion|your companion|familiar|eidolon|construct companion|your minion|your mount|undead companion|your bonded)\b/i;
const SPELLCASTING = /\b(spell slot|Cast a Spell|focus spell|focus point|cantrip|spellshape|metamagic|spell repertoire|spellbook|prepared spells?|signature spell)\b/i;
const COMBAT = /\b(Strike|damage|attack roll|AC\b|saving throw|Fortitude|Reflex|Will save|frightened|off-guard|prone|grabbed|stunned|slowed|Hit Points|temporary Hit Points|resistance|weakness|Stride|Step|reaction|enemy|enemies|foe)\b/i;

const BUCKETS = [
    ["dedication", "Archetype dedications (grant class features)"],
    ["combat-action", "Combat actions and reactions"],
    ["feature-upgrade", "Passives that change a class feature"],
    ["combat-passive", "Other combat passives"],
    ["spellcasting", "Spellcasting (slots, focus, spellshapes)"],
    ["companion", "Companions, familiars and eidolons"],
    ["out-of-combat", "Out of combat (exploration, downtime, skills)"],
    ["other", "Nothing a fight would use"]
];
const bucketOf = (doc, text) => {
    const traits = doc.system?.traits?.value ?? [];
    const actionType = doc.system?.actionType?.value ?? "passive";
    if (/Dedication$/.test(doc.name) || traits.includes("dedication")) return "dedication";
    if (traits.some((trait) => ["exploration", "downtime"].includes(trait)) || (OUT_OF_COMBAT.test(text) && !/\bStrike\b|attack roll|saving throw/.test(text))) return "out-of-combat";
    if (COMPANION.test(text) && !/\byou make a Strike|you Strike\b/i.test(text)) return "companion";
    if (traits.some((trait) => ["spellshape", "metamagic"].includes(trait)) || (SPELLCASTING.test(text) && !/\bStrike\b/.test(text))) return "spellcasting";
    if (actionType !== "passive") return COMBAT.test(text) ? "combat-action" : "other";
    if (FEATURES.test(text)) return "feature-upgrade";
    return COMBAT.test(text) ? "combat-passive" : "other";
};

const gaps = [];
let rated = 0;
for (const row of rows.values()) {
    if (row.ref.pack !== "feats" || row.ref.category !== "class") continue;
    if (!row.skipped) {
        rated++;
        continue;
    }
    const doc = docs.get(row.ref.id);
    if (!doc) continue;
    const traits = doc.system?.traits?.value ?? [];
    const text = plain(doc.system?.description?.value);
    const owner = traits.find((trait) => CLASS_SLUGS.includes(trait)) ?? (traits.includes("archetype") ? "archetype" : "other");
    const reason = String(row.reason ?? "");
    const featModule = reason === "the feat module reads nothing for it" ? "no plan" : /^compile error/.test(reason) ? "error" : "plan";
    gaps.push({ id: doc._id, name: doc.name, level: Number(doc.system?.level?.value ?? 0), owner, classes: traits.filter((trait) => CLASS_SLUGS.includes(trait)), archetype: traits.includes("archetype"), actionType: doc.system?.actionType?.value ?? "passive", actions: doc.system?.actions?.value ?? null, traits, rarity: doc.system?.traits?.rarity ?? "common", remaster: Boolean(doc.system?.publication?.remaster), bucket: bucketOf(doc, text), featModule, reason: featModule === "no plan" ? null : reason.replace(/ \(.*$/, ""), detail: featModule === "no plan" ? null : reason, text: text.slice(0, 240) });
}
gaps.sort((a, b) => BUCKETS.findIndex(([key]) => key === a.bucket) - BUCKETS.findIndex(([key]) => key === b.bucket) || a.owner.localeCompare(b.owner) || a.level - b.level || a.name.localeCompare(b.name));
fs.writeFileSync(jsonPath, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), rated, gaps }, null, 1));

const count = (list, key) => list.reduce((acc, row) => ((acc[key(row)] = (acc[key(row)] ?? 0) + 1), acc), {});
const owners = [...CLASS_SLUGS, "archetype", "other"];
const lines = [];
lines.push("# Class feats neither the feat module nor the simulator plays", "");
lines.push(`Made by \`node tools/class-feat-index.mjs\` on ${new Date().toISOString().slice(0, 10)} from the feat screen's rows: PF2e's class-category feats (class and archetype feats). ${rated} are rated; ${gaps.length} aren't. **No plan** means the feat module compiles nothing for it and PF2e's own rules give the simulator nothing a fight counts; **plan** means the feat module has a card for it the simulator doesn't play (the reason column). Teams+ and other module packs aren't in this copy, so they aren't here.`, "");
lines.push("Buckets go by the feat's text: dedications first, then what a fight would use, then the rest. A feat that is only a combination of basic actions is still listed; it's discarded when it comes up.", "");
lines.push("## By bucket", "", "| Bucket | No plan | Plan, not played | Total |", "|---|---:|---:|---:|");
for (const [key, label] of BUCKETS) {
    const list = gaps.filter((row) => row.bucket === key);
    lines.push(`| ${label} | ${list.filter((row) => row.featModule === "no plan").length} | ${list.filter((row) => row.featModule !== "no plan").length} | ${list.length} |`);
}
lines.push(`| **All** | ${gaps.filter((row) => row.featModule === "no plan").length} | ${gaps.filter((row) => row.featModule !== "no plan").length} | ${gaps.length} |`, "");
lines.push("## By class", "", `| Class | ${BUCKETS.map(([key]) => key).join(" | ")} | Total |`, `|---|${BUCKETS.map(() => "---:").join("|")}|---:|`);
for (const owner of owners) {
    const list = gaps.filter((row) => row.owner === owner);
    if (!list.length) continue;
    const by = count(list, (row) => row.bucket);
    lines.push(`| ${owner} | ${BUCKETS.map(([key]) => by[key] ?? "").join(" | ")} | ${list.length} |`);
}
lines.push("", "## Why the simulator doesn't play the ones with a plan", "", "| Reason | Count |", "|---|---:|");
for (const [reason, n] of Object.entries(count(gaps.filter((row) => row.featModule !== "no plan"), (row) => row.reason)).sort((a, b) => b[1] - a[1])) lines.push(`| ${reason} | ${n} |`);
for (const [key, label] of BUCKETS) {
    const list = gaps.filter((row) => row.bucket === key);
    if (!list.length) continue;
    lines.push("", `## ${label} (${list.length})`, "", "| Feat | Lvl | Class | Type | Feat module | Simulator's reason |", "|---|---:|---|---|---|---|");
    for (const row of list) lines.push(`| ${row.name} | ${row.level} | ${row.owner} | ${row.actionType === "action" ? `${row.actions ?? 1} action${(row.actions ?? 1) > 1 ? "s" : ""}` : row.actionType} | ${row.featModule} | ${(row.detail ?? "").replace(/\|/g, "/").slice(0, 120)} |`);
}
fs.writeFileSync(mdPath, lines.join("\n") + "\n");
console.log(`${gaps.length} class feats not played (${rated} rated) → ${mdPath}, ${jsonPath}`);
console.log(count(gaps, (row) => row.bucket));
