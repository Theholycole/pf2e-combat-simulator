// Bestiary creatures with their real stat blocks and abilities, through the
// simulator: every NPC in the given packs (Monster Core 1-2 and NPC Core by
// default) is read from PF2e's data (AC, HP, saves, skills, Strikes with their
// riders), gets the abilities the ability module compiles and the basic actions
// it's trained for, and fights a martial party of its level three times.
// Reports what the creatures used, what was left out, and any errors.
//
//   node tools/bestiary-abilities.mjs [pack …]

const { readDocuments } = await import(new URL("../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { compileBasicActions, compileMonsterAbility } = await import(new URL("../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js", import.meta.url).href);
const { simulate } = await import("../src/engine/fight.js");
const { martialParty } = await import("../src/engine/benchmarks.js");
const { parseReadableDamage } = await import("../src/adapter/formula.js");
const { addBuiltin } = await import("../src/engine/abilities.js");

const PACK_ROOT = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
const PACKS = process.argv.slice(2).length ? process.argv.slice(2) : ["pathfinder-monster-core", "pathfinder-monster-core-2", "pathfinder-npc-core"];
const basicActions = compileBasicActions(readDocuments(`${PACK_ROOT}/actions`).filter((doc) => doc.collection === "items"));
const SKILL_OF = { demoralize: "intimidation", trip: "athletics", grapple: "athletics", shove: "athletics", disarm: "athletics", reposition: "athletics", feint: "deception", "create-a-diversion": "deception", "administer-first-aid": "medicine" };
const NATURAL_ATTACK = /\b(?:jaws?|bite|claws?|talons?|tail|tusks?|horns?|hoof|hooves|slam|fist|tentacles?|wings?|sting|stinger|pincers?|mandibles?|beak|foot|feet|body|antlers?|spines?|quills?|fangs?|tongue|tendrils?|vines?|branch|roots?|pseudopods?)\b/i;

// A raw NPC (pack data) as an engine combatant.
function combatant(npc) {
    const system = npc.system;
    const strikes = [];
    for (const item of npc.items.filter((entry) => entry.type === "melee")) {
        const traits = item.system.traits?.value ?? [];
        const damage = Object.values(item.system.damageRolls ?? {}).flatMap((roll) => parseReadableDamage(`${roll.damage} ${roll.damageType ?? "untyped"}${roll.category === "persistent" ? " persistent" : roll.category === "splash" ? " splash" : ""}`));
        if (!damage.length) continue;
        const increment = Number(traits.find((trait) => /^range-increment-\d+$/.test(trait))?.split("-").pop()) || Number(traits.find((trait) => /^range-\d+$/.test(trait))?.split("-").pop()) || null;
        strikes.push({
            name: item.name,
            bonus: item.system.bonus?.value ?? 0,
            melee: !increment,
            increment,
            agile: traits.includes("agile"),
            reach: Number(traits.find((trait) => /^reach-\d+$/.test(trait))?.split("-")[1]) || 5,
            damage,
            attackEffects: item.system.attackEffects?.value ?? [],
            held: !traits.includes("unarmed") && !NATURAL_ATTACK.test(item.name),
            // As the live snapshot reads them (C14, C16).
            ...(Number(traits.find((trait) => /^reload-\d+$/.test(trait))?.split("-")[1]) > 0 ? { reload: Number(traits.find((trait) => /^reload-\d+$/.test(trait)).split("-")[1]) } : {}),
            ...(traits.includes("concussive") ? { concussive: true } : {}),
            ...(traits.includes("splash") ? { splashKind: "bomb" } : traits.some((trait) => /^scatter-\d+$/.test(trait)) ? { splashKind: "scatter" } : {})
        });
    }
    const spells = [];
    const builtins = { reactions: { aoo: false, shieldBlock: false } };
    const used = new Set();
    for (const item of npc.items.filter((entry) => entry.type === "action")) {
        const plan = compileMonsterAbility(item, { basicActions, actor: npc });
        if (!plan) continue;
        if (plan.builtin) {
            if (addBuiltin(builtins, plan, item.name)) used.add(item.name);
        } else if (plan.resolution) {
            used.add(item.name);
            spells.push({ name: item.name, plan, castRank: 1, pool: null, kind: "ability" });
        }
    }
    const skills = Object.fromEntries(Object.entries(system.skills ?? {}).map(([slug, value]) => [slug, value.base ?? 0]));
    for (const [slug, plan] of Object.entries(basicActions)) {
        if (SKILL_OF[slug] && !(SKILL_OF[slug] in skills)) continue;
        spells.push({ name: plan.source.name, plan, castRank: 1, pool: null, kind: "basic" });
    }
    const hp = system.attributes.hp.max;
    return {
        id: "monster",
        name: npc.name,
        side: "foes",
        kind: "npc",
        level: system.details.level.value,
        traits: system.traits.value ?? [],
        hp: { value: hp, max: hp },
        ac: system.attributes.ac.value,
        saves: { fortitude: system.saves.fortitude.value, reflex: system.saves.reflex.value, will: system.saves.will.value },
        perception: system.perception?.mod ?? 0,
        skills,
        speed: system.attributes.speed?.value ?? 25,
        reach: Math.max(5, ...strikes.filter((strike) => strike.melee).map((strike) => strike.reach)),
        strikes,
        spells,
        ...builtins,
        size: system.traits.size?.value ?? "med",
        resistances: (system.attributes.resistances ?? []).map((entry) => ({ type: entry.type, value: entry.value ?? 0, exceptions: entry.exceptions ?? [] })),
        weaknesses: (system.attributes.weaknesses ?? []).map((entry) => ({ type: entry.type, value: entry.value ?? 0, exceptions: entry.exceptions ?? [] })),
        immunities: (system.attributes.immunities ?? []).map((entry) => entry.type),
        usedAbilities: used
    };
}

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
        stats.creatures++;
        if (monster.spells.some((spell) => spell.kind === "ability")) stats.withAbilities++;
        const party = martialParty(Math.min(20, level)).map((pc) => ({ ...pc, spells: Object.values(basicActions).map((plan) => ({ name: plan.source.name, plan, castRank: 1, pool: null, kind: "basic" })) }));
        for (let seed = 1; seed <= 3; seed++) {
            try {
                const result = simulate({ combatants: [...party, monster] }, {}, seed, { log: true });
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
