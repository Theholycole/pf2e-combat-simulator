// The foe types a feat's own rules or text key on (2026-11-05, the foe-type benchmarks): its PF2e rules' predicates on the target's traits
// ("target:trait:undead") and its text's "against undead", "a giant", "larger than you" — the feats a FEAT_FOE_TRAIT run of that type rates.
// node tools/feat-foe-traits.mjs [out dir] → <out>/b-trait-<type>.txt (feat names), and a count on stdout.
import fs from "node:fs";

const { docsOf } = await import("./lib/feat-power.mjs");
const PACKS = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const TYPES = ["undead", "fiend", "celestial", "construct", "elemental", "giant", "dragon", "incorporeal", "large"];
const ALIASES = { unholy: "fiend", holy: "celestial", demon: "fiend", devil: "fiend", daemon: "fiend", vampire: "undead" };
const TEXT = {
    undead: /\b(?:against|to|an?|any|each|the) undead\b|\bundead (?:creatures?|foes?|enem(?:y|ies)|target)\b/i,
    fiend: /\b(?:against|an?|each) fiends?\b|\bfiends?'s?\b/i,
    celestial: /\b(?:against|an?) celestials?\b/i,
    construct: /\b(?:against|an?) constructs?\b/i,
    elemental: /\b(?:against|an?) elementals?\b/i,
    giant: /\b(?:against|an?|each) giants?\b|\bgiant (?:creatures?|foes?|enem(?:y|ies))\b/i,
    dragon: /\b(?:against|an?) dragons?\b|\bdragon (?:foes?|enem(?:y|ies))\b/i,
    incorporeal: /\bincorporeal (?:creatures?|foes?|enem(?:y|ies)|undead)\b/i,
    large: /\blarger than you\b|\bat least one size (?:category )?larger\b|\bLarge or larger\b/i
};

export function foeTypesOf(doc) {
    const found = new Set();
    const rules = JSON.stringify(doc.system?.rules ?? []);
    if (/target:mode:undead/.test(rules)) found.add("undead");
    for (const match of rules.matchAll(/target:trait:([a-z-]+)/g)) {
        const type = ALIASES[match[1]] ?? match[1];
        if (TYPES.includes(type)) found.add(type);
    }
    if (/target:size|"size":/.test(rules) && /larger|>/.test(rules)) found.add("large");
    const text = String(doc.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@\w+\[[^\]]*\](?:\{([^}]*)\})?/g, (_all, label) => label ?? "");
    for (const [type, pattern] of Object.entries(TEXT)) if (pattern.test(text)) found.add(type);
    return [...found];
}

if (process.argv[1]?.endsWith("feat-foe-traits.mjs")) {
    const out = process.argv[2] ?? "/tmp/claude-build";
    const lists = Object.fromEntries(TYPES.map((type) => [type, []]));
    for (const doc of docsOf(`${PACKS}/feats`).values()) for (const type of foeTypesOf(doc)) lists[type].push(doc.name);
    for (const [type, names] of Object.entries(lists)) {
        fs.writeFileSync(`${out}/b-trait-${type}.txt`, `${[...new Set(names)].sort().join("\n")}\n`);
        console.log(`${type}: ${names.length}`);
    }
}
