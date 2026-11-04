// Which alchemical item to use against a monster (2026-11-04, Cole), for an alchemist with every alchemical consumable in its formula book:
//
//   node tools/alchemy-advice.mjs "<creature name>" [--level=N] [--top=12] [--common] [--md=out.md]
//
// --level: the alchemist's level (default the creature's). --common: common items only. Power is the simulator's own value of one use on
// that monster (src/engine/alchemy.js rankItems: the planner's worth of its damage, after the monster's immunities, weaknesses and
// resistances, and of its conditions), as a share of beating it; per action counts Quick Alchemy's action. In Foundry, the same ranking
// for the targeted monsters: the module's "Alchemical advice" (scripts/alchemy.js).
import fs from "node:fs";

const { creatureFrom } = await import("./lib/pack-creatures.mjs");
const { advise } = await import("./lib/alchemy.mjs");
const { adviceMarkdown } = await import("../src/engine/alchemy-report.js");

const args = process.argv.slice(2);
const opt = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const name = args.filter((arg) => !arg.startsWith("--")).join(" ");
if (!name) {
    console.error('Usage: node tools/alchemy-advice.mjs "<creature name>" [--level=N] [--top=12] [--common] [--md=out.md]');
    process.exit(1);
}
const creature = creatureFrom({ name });
if (!creature) {
    console.error(`No creature named "${name}" in the rulebook bestiaries.`);
    process.exit(1);
}
const level = Math.max(1, Math.min(20, Number(opt("level", creature.level)) || 1));
const { numbers, rows } = advise(creature, level, args.includes("--common") ? { rarities: ["common"] } : {});
const text = adviceMarkdown(creature, numbers, rows, { top: Number(opt("top", 12)) || 12 });
const md = opt("md", null);
if (md) fs.writeFileSync(md, `${text}\n`);
console.log(text);
process.exit(0);
