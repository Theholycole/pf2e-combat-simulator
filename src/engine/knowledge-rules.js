// (2026-11-25, Cole's table: "Make combat knowledge feel rewarding".) Optional house rules, off unless the fight's options.knowledge (or
// SIM_KNOWLEDGE) names them, comma-separated:
//   exposed  The first time in a round a creature takes damage that triggers one of its weaknesses (or a thaumaturge's exploited Strike,
//            or a Vindicator's mark), it is off-guard and can't use reactions until the start of its next turn.
//   hidden   A foe with no weakness gets one hidden weakness at GM Core Table 2-8's low value for its level, of a type from its traits (else
//            slashing, piercing or bludgeoning by its name). It counts only once the party has learned what the creature is.
//   nocrit   Once the party knows a creature, it can't critically succeed at its lowest save (that save's critical success is a success).
//   break    (Octopath's shields) Every foe has Guard 2 (3 if 2+ levels above the party). Each PC turn that sets off a KNOWN weakness of it,
//            makes it critically fail its known lowest save, or lands a thaumaturge's exploited Strike takes 1 Guard. At 0 it is Broken:
//            stunned 1, off-guard and without reactions until the end of its next turn; Guard back to its start + 1.
//   press    (SMT's half turn) The first time each round a foe's KNOWN weakness is set off by a PC (not personal antithesis), that PC gets 1
//            extra action at the start of its next turn (the sim doesn't restrict what it's used for).
// Learning: a successful Exploit Vulnerability, or Recall Knowledge — the party's two best knowers (Arcana, Nature, Occultism, Religion,
// Society, the best of them; a thaumaturge is left to its Exploit Vulnerability) each spend one action at the start of their turn on a foe
// kind no one knows and they haven't tried, against the standard DC of its level. Known foes are known by name, for every copy.
// Baseline (no rule named): nothing here runs; the planner already sees every weakness and save, as before.
import { SUCCESS, degreeOf, levelDC } from "./checks.js";
import { isActive, saveModifier, statusPenalty } from "./combatant.js";

// GM Core Table 2-8, Resistances and Weaknesses: the low value by creature level (-1 .. 24).
// https://2e.aonprd.com/Rules.aspx?ID=2893
const TABLE_2_8_MIN = [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
export const hiddenWeaknessValue = (level) => TABLE_2_8_MIN[Math.max(0, Math.min(TABLE_2_8_MIN.length - 1, Math.round(level ?? 0) + 1))];

// A theme by trait, the first that fits; else a physical type by its name.
const BY_TRAIT = [["undead", "vitality"], ["fiend", "holy"], ["celestial", "unholy"], ["fey", "cold-iron"], ["fire", "cold"], ["cold", "fire"], ["plant", "fire"], ["fungus", "fire"], ["construct", "bludgeoning"], ["water", "electricity"], ["ooze", "electricity"]];
const PHYSICAL = ["slashing", "piercing", "bludgeoning"];
function hiddenType(c) {
    const traits = c.traits ?? [];
    const found = BY_TRAIT.find(([trait]) => traits.includes(trait));
    if (found) return found[1];
    let hash = 0;
    for (const ch of String(c.name ?? "")) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return PHYSICAL[hash % PHYSICAL.length];
}

const KNOW_SKILLS = ["arcana", "nature", "occultism", "religion", "society"];

export function knowledgeRulesOf(options) {
    const raw = options?.knowledge ?? globalThis.process?.env?.SIM_KNOWLEDGE ?? "";
    return new Set(String(raw).split(",").map((s) => s.trim()).filter(Boolean));
}

// As the fight is set up.
export function setUpKnowledge(state, { skillValue }) {
    const rules = knowledgeRulesOf(state.options);
    if (!rules.size) return;
    state.knowledge = { rules, known: new Set(), tried: new Map(), knowers: [], stats: { recalls: 0, recallSuccesses: 0, exposed: 0, revealed: 0, noCrit: 0, chips: 0, breaks: 0, presses: 0 } };
    if (rules.has("break")) for (const c of state.list) if (c.side !== "party" && c.kind !== "object" && !c.hazard) c.guard = c.guardMax = (c.level ?? 0) >= (state.partyLevel ?? 1) + 2 ? 3 : 2;
    if (rules.has("hidden")) {
        for (const c of state.list) {
            if (c.side === "party" || c.kind === "object" || c.hazard || (c.weaknesses ?? []).length) continue;
            c.hiddenWeakness = { type: hiddenType(c), value: hiddenWeaknessValue(c.level) };
        }
    }
    if (["hidden", "nocrit", "break", "press"].some((rule) => rules.has(rule))) {
        const best = (c) => Math.max(...KNOW_SKILLS.map((slug) => skillValue(c, slug) ?? -99));
        state.knowledge.knowers = state.list
            .filter((c) => c.side === "party" && c.kind === "pc" && !c.exploit)
            .map((c) => ({ id: c.id, modifier: best(c) }))
            .sort((a, b) => b.modifier - a.modifier)
            .slice(0, 2);
    }
}

// The party learns what a creature is: its hidden weakness turned on, its lowest save marked, for every creature of that name.
export function revealKind(state, target) {
    const k = state.knowledge;
    if (!k || !target || target.side === "party" || k.known.has(target.name)) return;
    k.known.add(target.name);
    k.stats.revealed++;
    for (const c of state.list) {
        if (c.name !== target.name || c.side === "party") continue;
        if (c.hiddenWeakness && k.rules.has("hidden")) c.weaknesses = [...(c.weaknesses ?? []), { type: c.hiddenWeakness.type, value: c.hiddenWeakness.value }];
        const saves = ["fortitude", "reflex", "will"];
        const lowest = saves.reduce((low, save) => (saveModifier(c, save) < saveModifier(c, low) ? save : low), saves[0]);
        c.knownLowestSave = lowest;
        if (k.rules.has("nocrit")) {
            c.saveDegrees = [...(c.saveDegrees ?? []), { saves: [lowest], adjustment: { criticalSuccess: "to-success" }, knowledgeRule: true }];
        }
    }
    state.log?.push(`  The party knows ${target.name}${target.hiddenWeakness && k.rules.has("hidden") ? ` (hidden weakness ${target.hiddenWeakness.value} ${target.hiddenWeakness.type})` : ""}`);
}

// At the start of a PC's turn: Recall Knowledge on a foe kind not yet known (one action), if it is one of the party's knowers. The actions spent.
export function recallTurn(state, c, actions, { skillValue }) {
    const k = state.knowledge;
    if (!k || actions < 2 || !k.knowers.some((entry) => entry.id === c.id) || !isActive(c)) return 0;
    const tried = k.tried.get(c.id) ?? new Set();
    const foe = state.list.find((other) => other.side !== c.side && other.side !== "party" && isActive(other) && other.kind !== "object" && !k.known.has(other.name) && !tried.has(other.name));
    if (!foe) return 0;
    tried.add(foe.name);
    k.tried.set(c.id, tried);
    const modifier = Math.max(...KNOW_SKILLS.map((slug) => skillValue(c, slug) ?? -99)) - statusPenalty(c, "skill");
    const natural = state.rng.d20();
    const degree = degreeOf(natural + modifier, levelDC(foe.level), natural);
    k.stats.recalls++;
    state.log?.push(`  ${c.name} uses Recall Knowledge on ${foe.name}: ${["critical failure", "failure", "success", "critical success"][degree]}`);
    if (degree >= SUCCESS) {
        k.stats.recallSuccesses++;
        revealKind(state, foe);
    }
    return 1;
}

// After damage is worked out (actions.js applyDamage): Exposed (once a round), Break's Guard, Press the Weakness.
export function exposeOnWeakness(state, target, instances, source, total, { adjustDamage, exploitCovers, judged, physical, applyCondition }) {
    const k = state.knowledge;
    if (!k || !source || source.side === target.side || total <= 0 || !isActive(target)) return;
    const exploited = physical && exploitCovers(source, target);
    const weaknessHit = (target.weaknesses ?? []).length > 0 && adjustDamage({ ...target, weaknesses: [] }, instances).total < total;
    const known = k.known.has(target.name);
    if (k.rules.has("exposed") && target.exposedRound !== state.round && (judged > 0 || exploited || weaknessHit)) {
        target.exposedRound = state.round;
        k.stats.exposed++;
        offGuardUntil(state, target, "turn-start", applyCondition);
        target.reactionUsed = true;
        state.log?.push(`  ${target.name} is Exposed (off-guard, no reactions)`);
    }
    if (source.side !== "party") return;
    if (k.rules.has("press") && known && weaknessHit && target.pressRound !== state.round) {
        target.pressRound = state.round;
        source.lostActions = (source.lostActions ?? 0) - 1;
        k.stats.presses++;
        state.log?.push(`  ${source.name} presses ${target.name}'s weakness: +1 action next turn`);
    }
    if (k.rules.has("break") && ((known && weaknessHit) || exploited)) chipGuard(state, target, source, applyCondition);
}

// A party member's spell made a known foe critically fail its known lowest save (spells.js): Break's Guard.
export function knownSaveCriticalFailure(state, target, save, caster, applyCondition) {
    const k = state.knowledge;
    if (!k?.rules.has("break") || caster?.side !== "party" || !target || target.side === "party" || !k.known.has(target.name) || target.knownLowestSave !== save || !isActive(target)) return;
    chipGuard(state, target, caster, applyCondition);
}

function chipGuard(state, target, source, applyCondition) {
    const k = state.knowledge;
    if (!Number.isFinite(target.guard)) return;
    const key = `${state.round}:${source.id}`;
    if (target.guardChipped === key) return;
    target.guardChipped = key;
    target.guard--;
    k.stats.chips++;
    if (target.guard > 0) {
        state.log?.push(`  ${target.name}'s Guard drops to ${target.guard}`);
        return;
    }
    k.stats.breaks++;
    target.guardMax++;
    target.guard = target.guardMax;
    applyCondition(state, target, "stunned", 1, null, source);
    offGuardUntil(state, target, "turn-end", applyCondition);
    target.reactionUsed = true;
    target.brokenUntilRound = (target.lastTurnRound ?? 0) >= state.round ? state.round + 1 : state.round;
    state.log?.push(`  ${target.name} is Broken (stunned 1, off-guard, no reactions; Guard back to ${target.guard})`);
}

// Off-guard until the start or end of the creature's own next turn (this round if it hasn't acted yet).
function offGuardUntil(state, target, expiry, applyCondition) {
    const acted = (target.lastTurnRound ?? 0) >= state.round;
    if (applyCondition(state, target, "off-guard", null, { mode: "fixed", value: 1, unit: "rounds", expiry }, target)) {
        const timer = (target.timers ?? []).at(-1);
        if (timer && (timer.key === "off-guard" || timer.key === "offGuard") && timer.turnOf === target.id) timer.round = acted ? state.round + 1 : state.round;
    }
}
