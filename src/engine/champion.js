// A champion's sheet (C30–C34, 2026-10-15; the user's champion Riah: "Can we try to simulate her whole character sheet as much as possible").
// Retributive Strike's upgrades — Relentless Reaction's persistent spirit damage, Exalted Reaction's allies' Strikes at -5, Instrument of
// Zeal's critical hit (a weapon die more, slowed 1 on its next turn), Swift Retribution's quickened turn, a Helm of Zeal's Divine Fervor;
// Oath of the Slayer's doubling; Hero's Defiance and Immortal Bastion against dropping; a Dread Blindfold's and Battle Cry's fear as the
// fight begins; March of Law.
import { CRITICAL_SUCCESS, SUCCESS, degreeOf } from "./checks.js";
import { canAct, isActive, saveModifier } from "./combatant.js";
import { canReact, spendReaction } from "./abilities.js";
import { sameMelee } from "./space.js";
import { strikeContext } from "./damage.js";
import { log } from "./log.js";

// The enemy set off its champion's reaction (as it's used).
export function championTriggered(state, champion, source) {
    const reaction = champion.championReaction;
    (champion.triggeredBy ??= new Set()).add(source.id);
    // (Swift Retribution: quickened on its next turn — this round's if it hasn't acted yet.)
    if (reaction.swift && !champion.cond.quickened) {
        champion.cond.quickened = true;
        (champion.timers ??= []).push({ key: "quickened", value: true, round: champion.round === state.round ? state.round + 1 : state.round, turnOf: champion.id, at: "end" });
        log(state, `  ${champion.name} is quickened for its next turn (Swift Retribution)`);
    }
    // (Oath of the Slayer: its sworn kind set it off — the spirit damage doubled through its next turn.)
    if (champion.oath && (source.traits ?? []).includes(champion.oath.trait)) champion.oathDoubled = champion.round === state.round ? state.round + 1 : state.round;
    // (A Helm of Zeal's Divine Fervor, once an hour — a fight: one more reaction for its champion's reaction, to its next turn.)
    if (reaction.fervor && !champion.fervorUsed) {
        champion.fervorUsed = true;
        champion.spareReactions = [...(champion.spareReactions ?? []), { names: ["champion's reaction"], count: 1, untilTurn: true }];
        log(state, `  ${champion.name}'s Helm of Zeal: another reaction for ${reaction.name}`);
    }
}

// After its Retributive Strike: Relentless Reaction's persistent spirit damage on a hit; Instrument of Zeal on a critical hit.
// applyDamage, applyCondition: the engine's.
export function retributionAfter(state, champion, target, strike, result, { applyDamage, applyCondition }) {
    const reaction = champion.championReaction;
    if (!result || !isActive(target)) return;
    if (reaction.relentless && result.degree >= SUCCESS) {
        const amount = reaction.relentless.amount;
        applyDamage(state, target, [{ type: reaction.relentless.type, persistent: true, amount, dice: 0, die: 0, bonus: amount, multiplier: 1 }], { source: champion });
        log(state, `  ${target.name} takes ${amount} persistent ${reaction.relentless.type} (Relentless Reaction)`);
    }
    if (reaction.zeal && result.degree === CRITICAL_SUCCESS) zealCritical(state, champion, target, strike, { applyDamage, applyCondition });
}

// Instrument of Zeal's critical hit: a weapon damage die more (doubled, as the critical hit's), and slowed 1 on its next turn.
export function zealCritical(state, champion, target, strike, { applyDamage, applyCondition }) {
    if (!isActive(target)) return;
    const part = strike.damage?.[0];
    if (part?.die) {
        const amount = 2 * state.rng.die(part.die);
        const dealt = applyDamage(state, target, [{ type: part.type, amount, persistent: false, precision: false, context: strikeContext(champion, strike, true) }], { source: champion });
        log(state, `  ${target.name} takes ${dealt} more (Instrument of Zeal)`);
    }
    if (isActive(target) && applyCondition(state, target, "slowed", 1, null, champion)) {
        (target.timers ??= []).push({ key: "slowed", value: 1, round: target.round === state.round ? state.round + 1 : state.round, turnOf: target.id, at: "end" });
        log(state, `  ${target.name} is slowed 1 on its next turn (Instrument of Zeal)`);
    }
}

// Exalted Reaction (Justice): each ally in its aura with the enemy in reach may spend its reaction on a Strike at it, -5.
// bestMeleeStrike, performStrike: the engine's.
export function exaltedStrikes(state, champion, target, { bestMeleeStrike, performStrike }) {
    const exalted = champion.championReaction?.exalted;
    if (!exalted) return;
    for (const ally of state.list) {
        if (!isActive(target)) return;
        if (ally === champion || ally.side !== champion.side || !isActive(ally) || !canAct(ally) || !canReact(ally) || ally.cond.fleeing || ally.familiar) continue;
        if (!sameMelee(ally, target) || !sameMelee(ally, champion)) continue;
        const strike = bestMeleeStrike(ally, target);
        if (!strike) continue;
        spendReaction(ally);
        state.stats.reactions++;
        log(state, `  ${ally.name} Strikes with its reaction (Exalted Reaction)`);
        performStrike(state, ally, target, { ...strike, bonus: strike.bonus - exalted.penalty }, { reaction: true });
    }
}

// Hero's Defiance: an attack that would drop it — its Hit Points first (a Focus Point), once until it Refocuses. remaining: the damage.
export function heroesDefiance(state, c, remaining, source) {
    const defiance = c.heroesDefiance;
    if (!defiance || c.heroesDefianceUsed || !source || source === c || remaining < c.hp.value || !isActive(c) || (c.spellPools?.focus ?? 0) < 1) return;
    c.heroesDefianceUsed = true;
    c.spellPools.focus -= 1;
    const healed = Math.min(c.hp.max - c.hp.value, rollFormula(state, defiance.heal));
    c.hp.value += healed;
    log(state, `  ${c.name} casts Hero's Defiance: ${healed} HP back before the blow`);
}

// "6d8+20", rolled.
function rollFormula(state, formula) {
    const parts = /^(\d+)d(\d+)(?:\+(\d+))?$/.exec(String(formula).replace(/\s+/g, ""));
    if (!parts) return Number(formula) || 0;
    let total = Number(parts[3]) || 0;
    for (let die = 0; die < Number(parts[1]); die++) total += state.rng.die(Number(parts[2]));
    return total;
}

// Immortal Bastion: dropped to 0 Hit Points — its reaction, once a day: 1 Hit Point and 100 temporary ones to its next turn instead.
export function lastStand(state, c) {
    const stand = c.lastStand;
    if (!stand || c.lastStandUsed || c.kind !== "pc" || c.hp.value > 0 || !canReact(c, stand.name)) return false;
    c.lastStandUsed = true;
    spendReaction(c, stand.name);
    c.hp.value = 1;
    c.hp.temp = Math.max(c.hp.temp ?? 0, stand.tempHp);
    c.tempHpUntilTurn = true;
    log(state, `  ${c.name} uses ${stand.name}: 1 HP and ${stand.tempHp} temporary HP instead`);
    return true;
}

// As the fight begins: a Dread Blindfold's gaze (a Will save or frightened 1 for each enemy that sees it) and Battle Cry's free Demoralize.
// castPlan: the engine's.
export function championOpening(state, c, { applyCondition, castPlan }) {
    if (!isActive(c)) return;
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.kind !== "object" && other.kind !== "hazard");
    if (c.dreadGaze) {
        for (const foe of foes) {
            if (foe.cond.blinded || fearless(foe)) continue;
            const natural = state.rng.d20();
            const degree = degreeOf(natural + saveModifier(foe, "will"), c.dreadGaze.dc, natural);
            if (degree < SUCCESS && applyCondition(state, foe, "frightened", c.dreadGaze.value, null, c)) log(state, `  ${foe.name} sees ${c.name}'s Dread Blindfold: frightened ${c.dreadGaze.value}`);
        }
    }
    if (c.battleCry) demoralize(state, c, null, { castPlan, reaction: false });
}

// Battle Cry's Demoralize — free as the fight begins, its reaction after a critical hit (legendary in Intimidation): at that creature, or
// the most threatening one in range. false when there's none it can Demoralize.
export function demoralize(state, c, target, { castPlan, reaction }) {
    const spell = (c.spells ?? []).find((entry) => entry.kind === "basic" && entry.plan?.source?.slug === "demoralize");
    if (!spell) return false;
    const immune = c.immuneTargets?.get(spell);
    const pick = target ?? state.list.filter((other) => other.side !== c.side && isActive(other) && other.band !== "far" && !immune?.has(other.id) && !fearless(other)).sort((a, b) => (state.threat?.get(b.id) ?? b.level ?? 0) - (state.threat?.get(a.id) ?? a.level ?? 0))[0];
    if (!pick || immune?.has(pick.id) || fearless(pick)) return false;
    if (reaction) {
        if (!canReact(c, "Battle Cry")) return false;
        spendReaction(c, "Battle Cry");
        state.stats.reactions++;
    }
    log(state, `  ${c.name} uses Battle Cry`);
    castPlan(state, c, spell, [pick.id]);
    return true;
}

// A creature fear can't reach: mindless, or immune to fear, emotion or mental effects.
function fearless(c) {
    const immune = c.immunities ?? [];
    return (c.traits ?? []).includes("mindless") || immune.some((entry) => ["fear-effects", "emotion", "mental", "frightened"].includes(entry));
}

// Shatter Defenses' hit: off-guard while it's frightened; if it was off-guard to the attacker already, its frightened can't drop below 1
// until the attacker's next turn.
export function shatterDefenses(state, attacker, target, wasOffGuard, { applyCondition }) {
    if (!isActive(target) || !(target.cond.frightened > 0)) return;
    if (applyCondition(state, target, "off-guard", null, { mode: "while", condition: "frightened" }, attacker)) log(state, `  ${target.name} is off-guard while frightened (Shatter Defenses)`);
    if (wasOffGuard) {
        target.condFloors = [...(target.condFloors ?? []).filter((held) => !(held.by === attacker.id && held.spell === "Shatter Defenses")), { slug: "frightened", value: 1, by: attacker.id, spell: "Shatter Defenses", lifetime: null, whileCondition: null, persistent: null, untilRound: state.round + 1, sustained: false }];
        log(state, `  ${target.name} can't lower its frightened below 1 until ${attacker.name}'s next turn`);
    }
}

// March of Law: once a round, a Stride (its Speed 10 feet more) toward an enemy that took a hostile action against it since its last turn;
// beside it at the end, each enemy beside it that sees it is frightened 2. stride: the engine's.
export function marchOfLaw(state, c, target, { applyCondition, stride }) {
    const march = c.marchOfLaw;
    if (!march || !target || !isActive(target)) return;
    (c.usedThisTurn ??= new Set()).add("march-of-law");
    log(state, `  ${c.name} uses ${march.name} toward ${target.name}`);
    if (!sameMelee(c, target)) {
        const speed = c.speed;
        c.speed = (Number(speed) || 25) + march.speedBonus;
        stride(state, c, { kind: "engage", targetId: target.id });
        c.speed = speed;
    }
    if (!sameMelee(c, target) || !isActive(c)) return;
    for (const foe of state.list) {
        if (foe.side === c.side || !isActive(foe) || !sameMelee(foe, c) || foe.cond.blinded || fearless(foe)) continue;
        if (applyCondition(state, foe, "frightened", march.frightened, null, c)) log(state, `  ${foe.name} is frightened ${march.frightened}`);
    }
}
