// A creature's preferences, measured (src/engine/preferences.js has the catalog and the picks): the danger fights (tools/lib/deadliness.mjs)
// with each factor and without, over the same seeds — one task a creature, every factor in it.
const lib = await import("./deadliness.mjs");
const { compileSpell, effectModels, spellNamed } = await import("./pack-spells.mjs");
const { canFight, dangerFights, dangerSummary } = await import("../../src/engine/danger-scale.js");
const { factorFight, factorsFor } = await import("../../src/engine/preferences.js");

// An ally's spell on the creature: PF2e's, compiled once, cast at the rank of a caster of the creature's level (at least its own).
const plans = new Map();
function allySpell(name, level) {
    if (!plans.has(name)) {
        const doc = spellNamed(name);
        let plan = null;
        try {
            plan = doc ? compileSpell(doc) : null;
        } catch {
            plan = null;
        }
        plans.set(name, plan ? { plan, base: Math.max(1, Number(doc.system?.level?.value) || 1) } : null);
    }
    const found = plans.get(name);
    if (!found) return null;
    const castRank = Math.max(found.base, Math.min(10, Math.ceil(Math.max(1, level) / 2)));
    return { name, plan: found.plan, castRank, pool: null, effects: effectModels(found.plan, castRank) };
}

// One creature: its score in the danger fights (seeds task.from to task.to) without a factor ("none"), on the open grid ("grid:open"),
// and with each of its factors; the base each is measured against.
export function runPreferences(task) {
    const npc = lib.npcOf(task.ref);
    if (!npc) return { ...task, error: "not found" };
    let built;
    try {
        built = lib.buildMonster(npc);
    } catch (error) {
        return { ...task, error: `build: ${error.message}` };
    }
    if (!built || !canFight(built.monster)) return { ...task, skipped: true };
    const { monster, reserves } = built;
    const party = lib.partyFor(monster.level);
    const fights = (factor) => {
        const spell = factor?.spell ? allySpell(factor.spell, monster.level) : null;
        if (factor?.spell && !spell) return null;
        const { combatants, setup } = factorFight(factor, party, [monster, ...reserves], { spell });
        return dangerSummary(dangerFights(combatants.slice(0, party.length), combatants.slice(party.length), task.from, task.to, { setup }));
    };
    const scores = {};
    const errors = {};
    const factors = factorsFor(monster);
    for (const [key, factor] of [["none", null], ["grid:open", { grid: { layout: "open" } }], ...factors.map((entry) => [entry.key, entry])]) {
        try {
            const result = fights(factor);
            if (result) scores[key] = Math.round(result.score * 10000) / 10000;
        } catch (error) {
            errors[key] = `${error.message} ${String(error.stack ?? "").split("\n")[1] ?? ""}`.trim();
        }
    }
    return { ...task, level: monster.level, scores, bases: Object.fromEntries(factors.map((factor) => [factor.key, factor.base ?? "none"])), ...(Object.keys(errors).length ? { errors } : {}) };
}
