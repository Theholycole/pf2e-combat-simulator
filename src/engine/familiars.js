// Familiars (2026-10-14; the user: "The simulator doesnt add familiars since they cant be added to initiative, so that makes classes
// like witch seem weaker than expected"). A PC's familiar joins the fight beside its master (the snapshot finds it by its master link):
// a minion with no turns of its own — it can't Strike, and a command costs its master an action, worth it only for Familiar Focus. It
// keeps to its master's space, so foes can reach it and an area can catch it.
//   - A witch's patron familiar ability, each time its master Casts or Sustains a hex (the hex trait): Balanced Luck, Restored Spirit,
//     Paired Perplexity, Parasitic Might, Enticing Negotiation, Swarm's Heart, Overwhelming Tides, Flowing Script, Ongoing Misery.
//   - Lifelink: damage that would drop it, its master takes instead (a reaction).
//   - Familiar Focus: commanded, it restores a Focus Point, once a day.
// Its reach from its master's space: adjacent and 10 feet, the master's Melee; 15 and 20 feet, also the Melees its master's allies fight
// in while the master stands near (the bands can't tell 15 feet from 30).
import { degreeOf, SUCCESS } from "./checks.js";
import { isActive, saveModifier } from "./combatant.js";
import { applyEffect, modifierModel } from "./effects.js";
import { distanceBetween, leaveMelee, sameMelee } from "./space.js";

const ONE_ROUND = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" };
// (Not negative conditions: Ongoing Misery doesn't prolong them.)
const HELPFUL = new Set(["quickened", "concealed", "hidden", "invisible"]);

// The patron familiar abilities the simulation plays, by slug: what each does when its master Casts or Sustains a hex.
export const HEX_FAMILIARS = new Set(["familiar-of-balanced-luck", "familiar-of-restored-spirit", "familiar-of-paired-perplexity", "familiar-of-parasitic-might", "familiar-of-enticing-negotiation", "familiar-of-swarms-heart", "familiar-of-overwhelming-tides", "familiar-of-flowing-script", "familiar-of-ongoing-misery"]);

// Its master's familiar that's in the fight and up, or null.
export function familiarOf(state, master) {
    return state.list.find((c) => c.familiar?.masterId === master.id && isActive(c)) ?? null;
}

// Creatures within so many feet of the familiar (in its master's space), of one side or the other.
function near(state, master, feet, wanted) {
    return state.list.filter((other) => other !== master && isActive(other) && !other.familiar && wanted(other)
        && (sameMelee(master, other) || (feet >= 15 && master.band !== "far" && other.meleeId !== null && state.list.some((ally) => ally.side === master.side && ally !== master && isActive(ally) && sameMelee(ally, other)))
            || distanceBetween(master, other) <= feet));
}

const threatOf = (state, c) => state.potential?.get(c.id) ?? state.threat?.get(c.id) ?? c.level ?? 0;
const mostThreatening = (state, list) => [...list].sort((a, b) => threatOf(state, b) - threatOf(state, a))[0] ?? null;

// Its master's spell DC, the best of its spells'.
function spellDC(master) {
    return Math.max(10, ...(master.spells ?? []).filter((spell) => !spell.kind).map((spell) => Number(spell.dc) || 0));
}

// Its master Cast or Sustained a hex: the familiar's patron ability.
// applyCondition: the spells layer's (passed in, as effects.js takes it).
export function hexFamiliar(state, master, hexName, { applyCondition }) {
    const familiar = familiarOf(state, master);
    const ability = familiar?.familiar?.hexAbility;
    if (!ability) return;
    const foe = (other) => other.side !== master.side;
    const friend = (other) => other.side === master.side;
    const say = (what) => state.log?.push(`  ${familiar.name} (${hexName}): ${what}`);
    switch (ability) {
        case "familiar-of-balanced-luck": {
            // (An enemy's -1 to AC where the party is attacking it; with none in reach, its master's +1.)
            const target = mostThreatening(state, near(state, master, 15, foe));
            if (target) {
                applyEffect(state, target, modifierModel("Familiar of Balanced Luck", { selector: "ac", type: "status", value: -1, duration: ONE_ROUND }), master, { key: "balanced-luck" });
                say(`${target.name} takes -1 to AC`);
            } else {
                applyEffect(state, master, modifierModel("Familiar of Balanced Luck", { selector: "ac", type: "status", value: 1, duration: ONE_ROUND }), master, { key: "balanced-luck" });
                say(`${master.name} gains +1 to AC`);
            }
            return;
        }
        case "familiar-of-restored-spirit": {
            const amount = 2 + Math.floor((Number(master.level) || 0) / 2);
            const target = [master, ...near(state, master, 15, friend)].filter((ally) => (ally.hp.temp ?? 0) < amount).sort((a, b) => a.hp.value / Math.max(1, a.hp.max) - b.hp.value / Math.max(1, b.hp.max))[0];
            if (!target) return;
            target.hp.temp = Math.max(target.hp.temp ?? 0, amount);
            say(`${target.name} gains ${amount} temporary HP`);
            return;
        }
        case "familiar-of-paired-perplexity": {
            // (A caster first: stupefied is its spells' DCs and its flat check.)
            const target = mostThreatening(state, near(state, master, 20, foe).filter((other) => (other.spells ?? []).some((spell) => !spell.kind))) ?? mostThreatening(state, near(state, master, 20, foe));
            if (target && applyCondition(state, target, "stupefied", 1, ONE_ROUND, master)) say(`${target.name} is stupefied 1`);
            return;
        }
        case "familiar-of-parasitic-might": {
            const target = mostThreatening(state, near(state, master, 15, (other) => foe(other) && other.hp.value < other.hp.max / 2 && !(other.cond.sickened > 0)));
            if (!target) return;
            const natural = state.rng.d20();
            const degree = degreeOf(natural + saveModifier(target, "fortitude"), spellDC(master), natural);
            if (degree >= SUCCESS) say(`${target.name} resists`);
            else if (applyCondition(state, target, "sickened", 1, null, master)) say(`${target.name} is sickened 1`);
            return;
        }
        case "familiar-of-enticing-negotiation": {
            const target = mostThreatening(state, near(state, master, 10, foe));
            if (target && applyCondition(state, target, "off-guard", null, ONE_ROUND, master)) say(`${target.name} is off-guard`);
            return;
        }
        case "familiar-of-swarms-heart": {
            if (master.cond.concealed) return;
            applyCondition(state, master, "concealed", null, ONE_ROUND, master);
            say(`${master.name} is concealed`);
            return;
        }
        case "familiar-of-overwhelming-tides": {
            // (Pushed 5 feet from the familiar: out of its master's Melee.)
            const target = mostThreatening(state, state.list.filter((other) => foe(other) && isActive(other) && sameMelee(master, other)));
            if (!target) return;
            leaveMelee(state, target, master.band === "far" ? "far" : "near");
            say(`${target.name} is pushed away`);
            return;
        }
        case "familiar-of-flowing-script": {
            // (It flanks with an ally: the enemy that ally fights is off-guard to the ally's melee attacks.)
            const target = mostThreatening(state, near(state, master, 15, (other) => foe(other) && other.meleeId !== null));
            const ally = target && state.list.find((other) => friend(other) && isActive(other) && sameMelee(other, target) && (other.strikes ?? []).some((strike) => strike.melee));
            if (ally && applyCondition(state, target, "off-guard", null, ONE_ROUND, master, { attacker: ally.id, attacks: "melee" })) say(`${target.name} is flanked for ${ally.name}`);
            return;
        }
        case "familiar-of-ongoing-misery": {
            // (One timed negative condition on a creature within 15 feet lasts a round longer, once for each case.)
            for (const target of near(state, master, 15, foe).sort((a, b) => threatOf(state, b) - threatOf(state, a))) {
                const timer = (target.timers ?? []).find((entry) => entry.key && !entry.prolonged && !HELPFUL.has(entry.key) && (entry.value === true ? target.cond[entry.key] : (target.cond[entry.key] ?? 0) > 0));
                if (!timer) continue;
                timer.round += 1;
                timer.prolonged = true;
                say(`${target.name}'s ${timer.key} lasts a round longer`);
                return;
            }
            return;
        }
        default:
    }
}

// Lifelink: damage that would drop the familiar, its master takes instead (its reaction), when it's up and can react.
export function lifelinkMaster(state, familiar, total, { canReact }) {
    if (!familiar.familiar?.lifelink || total < familiar.hp.value + (familiar.hp.temp ?? 0)) return null;
    const master = state.byId.get(familiar.familiar.masterId);
    return master && isActive(master) && canReact(master, "Lifelink") ? master : null;
}

// Familiar Focus: whether its master can command it to restore a Focus Point now (its pool spent, once a day).
export function familiarFocusReady(state, master) {
    const familiar = familiarOf(state, master);
    return Boolean(familiar?.familiar?.focus && !familiar.familiar.focusUsed && (master.focusMax ?? 0) > 0 && (master.spellPools?.focus ?? 0) <= 0 && (master.spells ?? []).some((spell) => spell.pool === "focus"));
}

export function familiarFocus(state, master) {
    const familiar = familiarOf(state, master);
    if (!familiar) return;
    familiar.familiar.focusUsed = true;
    master.spellPools.focus = Math.min(master.focusMax ?? 1, (master.spellPools.focus ?? 0) + 1);
    state.log?.push(`  ${master.name} commands ${familiar.name}: a Focus Point restored (Familiar Focus)`);
}

// As its master's turn starts, the familiar is beside it.
export function familiarKeepsUp(state, master) {
    const familiar = state.list.find((c) => c.familiar?.masterId === master.id && isActive(c));
    if (familiar && familiar.meleeId === null) familiar.band = master.band;
}
