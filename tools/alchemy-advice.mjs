// Which alchemical item to use against a monster (2026-11-04, Cole: "add a recommendation item for players to use against a monster. Take
// into account any saves or ac the item may target and any weaknesses the item may trigger"), for an alchemist with every alchemical
// consumable in its formula book (tools/lib/alchemy.mjs):
//
//   node tools/alchemy-advice.mjs "<creature name>" [--level=N] [--top=10] [--common] [--md=out.md]
//
// --level: the alchemist's level (default the creature's). --common: common items only. Damage is the expected damage of one use (its
// odds against the AC or save it targets, after the creature's immunities, weaknesses and resistances; persistent damage counted for 2
// rounds), and per action counts Quick Alchemy's action.
import fs from "node:fs";

const { creatureFrom } = await import("./lib/pack-creatures.mjs");
const { advise } = await import("./lib/alchemy.mjs");

const args = process.argv.slice(2);
const opt = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const name = args.filter((arg) => !arg.startsWith("--")).join(" ");
if (!name) {
    console.error('Usage: node tools/alchemy-advice.mjs "<creature name>" [--level=N] [--top=10] [--common] [--md=out.md]');
    process.exit(1);
}
const creature = creatureFrom({ name });
if (!creature) {
    console.error(`No creature named "${name}" in the rulebook bestiaries.`);
    process.exit(1);
}
const level = Math.max(1, Math.min(20, Number(opt("level", creature.level)) || 1));
const top = Number(opt("top", 10)) || 10;
const result = advise(creature, level, args.includes("--common") ? { rarities: ["common"] } : {});

const pct = (value) => `${Math.round(value * 100)}%`;
const cell = (text) => String(text ?? "").replace(/\|/g, "/");
const iwr = (list) => (list ?? []).map((entry) => `${entry.type}${entry.value != null ? ` ${entry.value}` : ""}`).join(", ") || "none";
const lines = [
    `# Alchemical items against ${creature.name} (level ${creature.level})`,
    "",
    `A level ${level} alchemist: bombs +${result.numbers.bomb} before the bomb's item bonus, class DC ${result.numbers.classDC}${result.numbers.powerfulAlchemy ? " (Powerful Alchemy: Quick Alchemy items use it)" : ""}.`,
    `${creature.name}: AC ${creature.ac}, Fortitude +${creature.saves?.fortitude ?? 0}, Reflex +${creature.saves?.reflex ?? 0}, Will +${creature.saves?.will ?? 0}. Weaknesses: ${iwr(creature.weaknesses)}. Resistances: ${iwr(creature.resistances)}. Immunities: ${(creature.immunities ?? []).join(", ") || "none"}.`,
    "",
    "## Best for damage",
    "",
    "| # | Item | Targets | Lands | Damage | Per action | Weakness, resistance | Also |",
    "|---|---|---|---|---|---|---|---|",
    ...result.damage.slice(0, top).map((row, index) => `| ${index + 1} | ${cell(row.item.name)} | ${cell(row.targets)} | ${pct(row.chance)} | ${row.value.toFixed(1)} | ${row.perAction.toFixed(1)} | ${cell(row.notes.join(", "))} | ${cell(row.effects)} |`),
    "",
    "## Best for control (no damage)",
    "",
    "| # | Item | Targets | Lands | Effect |",
    "|---|---|---|---|---|",
    ...result.control.slice(0, top).map((row, index) => `| ${index + 1} | ${cell(row.item.name)} | ${cell(row.targets)} | ${pct(row.chance)} | ${cell(row.effects)} |`),
    "",
    `Avoid (no damage on it): ${result.useless.map((row) => row.item.name).join(", ") || "none"}.`
];
const text = lines.join("\n");
const md = opt("md", null);
if (md) fs.writeFileSync(md, `${text}\n`);
console.log(text);
process.exit(0);
