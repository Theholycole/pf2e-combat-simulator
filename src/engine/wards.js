// Sanctuary (2026-10-14, the core's attack-ward family): a creature attempting to attack the warded one saves first (Will, against the
// caster's spell DC), once a turn. A critical success ends the ward; a success lets it attack the creature this turn; a failure wastes the
// action and it can't attack the creature this turn; a critical failure wastes it and bars it for the ward's time. The ward ends when its
// creature uses a hostile action. c.ward = { by, spell, dc, save, untilRound, endsOnHostile, passed: { id: round }, failed: { id: round },
// barred: [id] }. An attack: a Strike, or a spell with the attack trait.
import { degreeDistribution, rollCheck, CRITICAL_FAILURE, CRITICAL_SUCCESS, SUCCESS } from "./checks.js";
import { saveModifier } from "./combatant.js";

export function applyWard(state, target, caster, spell, ward, dc) {
    const rounds = Number(ward.durationSeconds) > 0 ? Math.max(1, Math.round(Number(ward.durationSeconds) / 6)) : 10;
    target.ward = { by: caster.id, spell: spell.name, dc: Number(dc) || 10, save: ward.save ?? "will", untilRound: state.round + rounds, endsOnHostile: ward.endsOnHostile !== false, passed: {}, failed: {}, barred: [] };
    state.log?.push(`  ${target.name} is warded by ${spell.name}`);
}

function wardOn(state, target) {
    const ward = target?.ward;
    if (!ward) return null;
    if (state.round >= ward.untilRound) {
        target.ward = null;
        return null;
    }
    return ward;
}

// Whether the attack is stopped before it's made (its action wasted); rolls the attacker's save when this turn needs one.
export function wardBlocks(state, attacker, target) {
    const ward = wardOn(state, target);
    if (!ward || !attacker || attacker === target || attacker.side === target.side) return false;
    if (ward.barred.includes(attacker.id) || ward.failed[attacker.id] === state.round) {
        state.log?.push(`  ${attacker.name} can't attack ${target.name} (${ward.spell})`);
        return true;
    }
    if (ward.passed[attacker.id] === state.round) return false;
    const { total, degree } = rollCheck(state.rng, saveModifier(attacker, ward.save), ward.dc);
    state.log?.push(`  ${attacker.name} saves against ${ward.spell} on ${target.name}: ${total} vs ${ward.dc} → ${["critical failure", "failure", "success", "critical success"][degree]}`);
    if (degree === CRITICAL_SUCCESS) {
        target.ward = null;
        state.log?.push(`  ${ward.spell} on ${target.name} ends`);
        return false;
    }
    if (degree === SUCCESS) {
        ward.passed[attacker.id] = state.round;
        return false;
    }
    if (degree === CRITICAL_FAILURE) ward.barred.push(attacker.id);
    else ward.failed[attacker.id] = state.round;
    return true;
}

// The chance the attacker gets to attack it (for the planner).
export function wardChance(state, attacker, target) {
    const ward = wardOn(state, target);
    if (!ward || attacker === target || attacker.side === target.side) return 1;
    if (ward.barred.includes(attacker.id) || ward.failed[attacker.id] === state.round) return 0;
    if (ward.passed[attacker.id] === state.round) return 1;
    const odds = degreeDistribution(saveModifier(attacker, ward.save), ward.dc);
    return odds[SUCCESS] + odds[CRITICAL_SUCCESS];
}

// What a ward is worth to the creature it's on, in rounds of its threat: the attacks it turns aside — a typical foe's chance to fail
// the save — over up to three rounds; a fifth of that for a creature that fights with attacks (its first attack ends the ward).
export function wardWorth(state, target, caster, ward, dc) {
    const foes = state.list.filter((other) => other.side !== target.side && other.status === "active");
    if (!foes.length) return 0;
    const stopped = foes.reduce((sum, foe) => {
        const odds = degreeDistribution(saveModifier(foe, ward.save ?? "will"), Number(dc) || 10);
        return sum + odds[0] + odds[1];
    }, 0) / foes.length;
    const rounds = Math.min(3, Number(ward.durationSeconds) > 0 ? Math.round(Number(ward.durationSeconds) / 6) : 3);
    const attacker = (target.strikes ?? []).length > 0 && (target.spells ?? []).every((spell) => !spell.plan?.resolution?.healing);
    return 0.4 * stopped * rounds * (attacker ? 0.2 : 1);
}

// The warded creature's own hostile action ends its ward.
export function wardOwnHostility(state, c) {
    if (!c?.ward?.endsOnHostile) return;
    state.log?.push(`  ${c.ward.spell} on ${c.name} ends`);
    c.ward = null;
}
