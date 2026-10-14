// Bestiary creatures with their real stat blocks and abilities, through the
// simulator: every NPC in the given packs (Monster Core 1-2 and NPC Core by
// default) is read from PF2e's data (AC, HP, saves, skills, Strikes with their
// riders), gets the abilities the ability module compiles and the basic actions
// it's trained for, and fights a martial party of its level three times.
// Reports what the creatures used, what was left out, and any errors.
//
//   node tools/bestiary-abilities.mjs [--map] [--escalate] [pack …]
//
// --map: each fight also has a map objective, in turn hold an area, escort a
// creature to the exit, and retrieve an item and escape (O1–O3).
// --escalate: each fight also has an escalation, in turn a second one arriving
// in round 2, fire from round 1 (Reflex DC by level), and the monster raising
// the alarm at a gong for a second one (E1–E3).

const { simulate } = await import("../src/engine/fight.js");
const { martialParty } = await import("../src/engine/benchmarks.js");
const { PACK_ROOT, basicActions, combatant, readDocuments, summonReserves } = await import("./lib/pack-creatures.mjs");

const MAP = process.argv.includes("--map");
const ESCALATE = process.argv.includes("--escalate");
const ARGS = process.argv.slice(2).filter((arg) => arg !== "--map" && arg !== "--escalate");
const PACKS = ARGS.length ? ARGS : ["pathfinder-monster-core", "pathfinder-monster-core-2", "pathfinder-npc-core"];
// A map objective for each seed, with a merchant to escort.
const MAP_OBJECTIVES = [
    { kind: "hold", needed: 2, strides: { party: { area: 2, exit: 4 }, foes: { area: 1, exit: 4 } } },
    { kind: "escort", escortId: "merchant", strides: { party: { area: 2, exit: 3 }, foes: { area: 1, exit: 2 } } },
    { kind: "retrieve", strides: { party: { area: 2, exit: 4 }, foes: { area: 0, exit: 3 }, areaToExit: 3 } }
];

const stats = { creatures: 0, fights: 0, errors: [], withAbilities: 0 };
const uses = new Map();
const started = Date.now();
for (const pack of PACKS) {
    for (const npc of readDocuments(`${PACK_ROOT}/${pack}`).filter((doc) => doc.collection === "actors" && doc.type === "npc")) {
        const level = npc.system.details.level.value;
        if (level < 1 || level > 20) continue;
        let monster;
        try {
            monster = combatant(npc);
        } catch (error) {
            stats.errors.push(`${npc.name}: read ${error.message}`);
            continue;
        }
        if (!monster.strikes.length && !monster.spells.some((spell) => spell.kind === "ability")) continue;
        let reserves = [];
        try {
            reserves = summonReserves(monster);
        } catch (error) {
            stats.errors.push(`${npc.name}: summon reserves ${error.message}`);
        }
        stats.creatures++;
        if (monster.spells.some((spell) => spell.kind === "ability")) stats.withAbilities++;
        const party = martialParty(Math.min(20, level)).map((pc) => ({ ...pc, spells: Object.values(basicActions).map((plan) => ({ name: plan.source.name, plan, castRank: 1, pool: null, kind: "basic" })) }));
        for (let seed = 1; seed <= 3; seed++) {
            try {
                const objective = MAP ? MAP_OBJECTIVES[(seed - 1) % MAP_OBJECTIVES.length] : null;
                const merchant = objective?.kind === "escort" ? [{ ...party[3], id: "merchant", name: "Merchant", kind: "npc", acts: false }] : [];
                const second = ESCALATE && seed !== 2 ? [{ ...monster, id: "second", name: `${monster.name} 2` }] : [];
                const escalations = !ESCALATE ? null : seed === 1
                    ? { rules: [{ when: { kind: "round", round: 2 }, then: { kind: "arrive", creatureIds: ["second"], delay: 0, band: "near" } }] }
                    : seed === 2
                        ? { rules: [{ when: { kind: "round", round: 1 }, then: { kind: "danger", damage: `${Math.ceil(level / 2)}d6`, type: "fire", save: { type: "reflex", dc: 15 + level }, targets: "all" } }] }
                        : { rules: [{ when: { kind: "alarm" }, then: { kind: "arrive", creatureIds: ["second"], delay: 1, band: "far" } }] };
                const raiser = ESCALATE && seed === 3 ? { ...monster, alarm: "gong", gongFeet: 30 } : monster;
                const setup = { ...(objective ? { objective } : {}), ...(escalations ? { escalations } : {}) };
                const result = simulate({ combatants: [...party, ...merchant, raiser, ...second, ...reserves], setup }, {}, seed, { log: true });
                stats.fights++;
                for (const line of result.log) {
                    const cast = / casts (.+?)(?: \(\d actions\))?(?: at |$)/.exec(line)?.[1];
                    if (cast) uses.set(cast, (uses.get(cast) ?? 0) + 1);
                    if (/uses Ferocity/.test(line)) uses.set("Ferocity", (uses.get("Ferocity") ?? 0) + 1);
                    if (/ rends /.test(line)) uses.set("Rend", (uses.get("Rend") ?? 0) + 1);
                    const used = / uses (.+)$/.exec(line)?.[1];
                    if (used && used !== "Ferocity and stays up at 1 HP") uses.set(used, (uses.get(used) ?? 0) + 1);
                    for (const [pattern, name] of [[/swallows /, "(swallowed)"], [/regenerates and wakes/, "(regenerated up)"], [/regeneration stops/, "(regeneration stopped)"], [/recharges$/, "(momentum recharge)"], [/cuts itself free|escapes from/, "(out of a swallower)"], [/: [^:]+, stage \d+$/, "(affliction stage)"], [/ saves against /, "(affliction save)"], [/ recovers from /, "(affliction ended)"], [/ retches: /, "(retch)"], [/ is confused/, "(confused)"], [/ is no longer confused/, "(confusion ended)"], [/ move is disrupted| fails to stand/, "(move disrupted)"]]) {
                        if (pattern.test(line)) uses.set(name, (uses.get(name) ?? 0) + 1);
                    }
                }
            } catch (error) {
                stats.errors.push(`${npc.name} seed ${seed}: ${error.message}\n${error.stack.split("\n").slice(1, 3).join("\n")}`);
            }
        }
    }
}
console.log({ creatures: stats.creatures, withAbilities: stats.withAbilities, fights: stats.fights, errors: stats.errors.length, seconds: (Date.now() - started) / 1000 });
console.log(stats.errors.slice(0, 6).join("\n"));
console.log([...uses].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([name, count]) => `${count}\t${name}`).join("\n"));
