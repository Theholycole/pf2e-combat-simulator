// (2026-11-07, the simulator phase: a check that a feat is played in fights, run on Cole's PC — Cole: "by default simulator tests are done
// on my PC".) For each feat named, what partyWithFeat reads and the fight log lines that match: the feat's name, else a pattern given.
//   node tools/feat-log.mjs "Feat A|Feat B" [pattern] [lines]      (env K=boss|group, the encounter; T=<foe trait>)
// Prints one block per feat: "== name: played" (or skipped and why), then up to N matching log excerpts and how many lines matched in
// 8 fights.
import * as fp from "./lib/feat-power.mjs";
import { simulate } from "../src/engine/fight.js";
import { powerFoes } from "../src/engine/spell-power.js";

const [names, pattern = null, count = "2"] = process.argv.slice(2);
const wanted = new Set(String(names ?? "").split("|").filter(Boolean));
for (const ref of fp.featRefs()) {
    if (!wanted.has(ref.name) || ref.source !== "pf2e") continue;
    wanted.delete(ref.name);
    const doc = fp.docsOf(ref.path).get(ref.id);
    const level = fp.partyLevelOf ? fp.partyLevelOf(ref.level) : Math.max(ref.level, 5);
    const out = fp.partyWithFeat(doc, level);
    console.log(`== ${ref.name} (level ${level}): ${out.skipped ? `SKIPPED ${out.reason}` : `played: ${out.played}`}`);
    if (out.skipped) continue;
    const re = new RegExp(pattern || ref.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ \(.*\)$/, ""), "i");
    const foes = powerFoes(process.env.K || "boss", level, process.env.T || null);
    let shown = 0;
    let matched = 0;
    for (let seed = 0; seed < 8; seed++) {
        // (A real array: a Strike reserves its line and fills it in by index once it hits — a push-only log lost every hit.)
        const log = [];
        simulate({ combatants: [...structuredClone(out.party), ...foes] }, {}, seed, { log });
        const lines = log.map((line) => (typeof line === "string" ? line : line?.text ?? ""));
        lines.forEach((text, index) => {
            if (!re.test(text)) return;
            matched++;
            if (shown < Number(count)) {
                shown++;
                console.log(lines.slice(Math.max(0, index - 1), index + 4).join("\n"));
                console.log("--");
            }
        });
    }
    console.log(`   ${matched} matching lines in 8 fights`);
}
for (const name of wanted) console.log(`== ${name}: NOT FOUND`);
