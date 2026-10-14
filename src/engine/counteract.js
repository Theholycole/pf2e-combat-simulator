// Counteracting (2026-10-14, the core's affliction-care family): Dispel Magic ends one spell effect on a creature; Clear Mind, Sound
// Body and Sure Footing an effect that gives an ally the conditions they list. What can be counteracted is what the engine recorded
// as it landed: a PF2e spell effect (effect.counter) and a condition a spell or ability gave (c.condSources), each with its DC and
// counteract rank (a spell's rank; an ability's, half its creature's level). PF2e's counteract check: the caster's counteract
// modifier (its spell attack) against that DC; a critical success counteracts up to 3 ranks higher, a success 1, a failure only a
// lower rank, a critical failure nothing.
import { degreeDistribution, degreeOf } from "./checks.js";

const REACH = [-Infinity, -1, 1, 3];

// The rank a creature counteracts with: a spell's cast rank, or (an ability) half its level rounded up.
export function counterRank(caster, spell, isSpell) {
    return isSpell ? Number(spell?.castRank ?? spell?.plan?.rank) || 1 : Math.max(1, Math.ceil((Number(caster?.level) || 1) / 2));
}

// What the counteract can end on the target: [{ kind: "effect" | "condition", entry | slug, dc, rank, name }].
export function counterables(target, change, flags) {
    const wants = change.grantsConditions ?? [];
    const out = [];
    for (const entry of target.effects ?? []) {
        if (!entry.counter) continue;
        if (change.source === "spell-effect" && !entry.counter.spell) continue;
        if (change.source === "effect" && wants.length && !(entry.model?.conditions ?? []).some((condition) => wants.includes(condition.slug))) continue;
        out.push({ kind: "effect", entry, dc: entry.counter.dc, rank: entry.counter.rank, name: String(entry.model?.name ?? "an effect").replace(/^Spell Effect: /, "") });
    }
    for (const [slug, info] of Object.entries(target.condSources ?? {})) {
        const flag = flags[slug];
        const held = flag ? Boolean(target.cond?.[flag]) : (Number(target.cond?.[slug]) || 0) > 0;
        if (!held) continue;
        if (change.source === "spell-effect" && !info.spell) continue;
        if (change.source === "effect" && wants.length && !wants.includes(slug)) continue;
        out.push({ kind: "condition", slug, dc: info.dc, rank: info.rank, name: `${slug} (${info.name})` });
    }
    return out.filter((entry) => Number.isFinite(entry.dc) && Number.isFinite(entry.rank));
}

// The chance a counteract check with this modifier and rank ends something of that DC and rank.
export function counterChance(modifier, rank, target) {
    const odds = degreeDistribution(modifier, target.dc);
    return odds.reduce((sum, chance, degree) => sum + (target.rank <= rank + REACH[degree] ? chance : 0), 0);
}

// Rolls it: true when it counteracts.
export function counterRoll(state, modifier, rank, target) {
    const natural = state.rng.d20();
    const degree = degreeOf(natural + modifier, target.dc, natural);
    return { total: natural + modifier, degree, success: target.rank <= rank + REACH[degree] };
}
