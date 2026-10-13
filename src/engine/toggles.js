// Toggles (B307, 2026-10-13; the user's call: "work through your recommendations in order", item 2): a choice PF2e holds as a roll option
// on the creature — Ablative Adaptation's material, All Made One's element, Glorious Visage's aspect, Divert Power. Each way's effect is
// the creature's own rules predicated on it (resistances, weaknesses, bonuses, Fast Healing, extra dice on its Strikes); the creature
// takes the best way for the fight as it starts. A choice with a way whose rules the simulation can't read (a ChoiceSet's selection, a
// swapped weapon, another condition on the rule) isn't offered.

import { effectModel } from "./effects.js";
import { deltasFor } from "./abilities.js";
import { adjustInstance } from "./damage.js";
import { isActive } from "./combatant.js";

const log = (state, line) => state.log?.push(line);
// Rules about a toggle with nothing for a fight here, and those its ways are read from; any other (a weapon changed, a size, an aura) leaves
// the choice unread.
const HARMLESS = new Set(["RollOption", "Note", "TokenLight", "TokenImage", "TokenEffectIcon", "BaseSpeed"]);
const READ = new Set(["Resistance", "Weakness", "Immunity", "FlatModifier", "FastHealing", "TempHP", "DamageDice"]);

// A rule's predicate for one way: null when it isn't about the toggle, false when it's off for this way, else the terms left over.
function forWay(predicate, option, suboption) {
    const terms = Array.isArray(predicate) ? predicate : predicate ? [predicate] : [];
    const about = (term) => typeof term === "string" && (term === option || term.startsWith(`${option}:`));
    const holds = (term) => term === option || term === `${option}:${suboption}`;
    let mentioned = false;
    const rest = [];
    for (const term of terms) {
        if (about(term)) {
            mentioned = true;
            if (!holds(term)) return false;
        } else if (typeof term?.not === "string" && about(term.not)) {
            mentioned = true;
            if (holds(term.not)) return false;
        } else if (Array.isArray(term?.or) && term.or.length && term.or.every(about)) {
            mentioned = true;
            if (!term.or.some(holds)) return false;
        } else rest.push(term);
    }
    return mentioned ? rest : null;
}

// A DamageDice rule's Strikes: all, melee, or the one it belongs to ("{item|_id}-damage", "black-flame-knife-damage").
function strikePart(rule, item) {
    const selector = [].concat(rule.selector ?? [])[0] ?? "";
    const dice = Math.max(1, Number(rule.diceNumber) || 1);
    // (No die size: the Strike's own die, of its type unless the rule names one — "die[fire]".)
    const formula = rule.dieSize ? `${dice}${rule.dieSize}[${rule.damageType ?? "untyped"}]` : null;
    const formulas = formula ? [formula] : Array(dice).fill(rule.damageType ? `die[${rule.damageType}]` : "die");
    if (selector === "strike-damage" || selector === "damage") return { formulas, scope: "all" };
    if (selector === "melee-strike-damage") return { formulas, scope: "melee" };
    if (selector === "{item|_id}-damage") return { formulas, strike: String(item.name ?? "").toLowerCase() };
    const named = /^([a-z0-9-]+)-damage$/.exec(selector)?.[1];
    return named ? { formulas, strike: named.replace(/-/g, " ") } : null;
}

// PF2e keeps a toggle's chosen value at rulesSelections.<option in camelCase>; a rule may name it ("{item|flags.system.rulesSelections.
// chromaticShiftResistance}") — this way's value.
const camel = (option) => String(option).replace(/-([a-z0-9])/g, (_all, letter) => letter.toUpperCase());
function filled(rule, option, value) {
    const key = camel(option);
    const text = JSON.stringify(rule).replaceAll(`{item|flags.system.rulesSelections.${key}}`, value ?? "").replaceAll(`{actor|flags.system.${key}}`, value ?? "");
    return JSON.parse(text);
}

// items: the creature's items (PF2e's documents or their data); plan: the ability's modes, roll-option ways. → [{ name, ways: [{ name, model,
// parts }] }], one a toggle (Choose Weakness: its damage and its resistance, two choices), or null.
export function toggleWays(items, plan, name) {
    const options = [...new Set((plan?.modes ?? []).map((mode) => mode.plan?.builtin === "roll-option" ? mode.plan.option : null).filter(Boolean))];
    const toggles = [];
    for (const option of options) {
        const others = options.filter((other) => other !== option);
        const ways = [];
        let unreadChoice = false;
        for (const mode of plan.modes.filter((entry) => entry.plan?.option === option)) {
            const way = mode.plan;
            const rules = [];
            const parts = [];
            let unread = false;
            for (const item of items ?? []) {
                for (const source of item.system?.rules ?? []) {
                    // (A rule about the ability's other toggle is that choice's.)
                    if (others.some((other) => forWay(source?.predicate, other, null) !== null)) continue;
                    const rest = forWay(source?.predicate, option, way.suboption ?? null);
                    // (Its bookkeeping — the choice copied to a flag — is nothing to play.)
                    if (rest === null || rest === false || HARMLESS.has(source.key) || (source.key === "ActiveEffectLike" && /^flags\./.test(source.path ?? ""))) continue;
                    const rule = filled(source, option, way.suboption);
                    if (rest.length || !READ.has(rule.key) || /\{(?:item|actor)\|flags\./.test(JSON.stringify(rule))) {
                        unread = true;
                        continue;
                    }
                    if (rule.key === "DamageDice") {
                        // (A Strike's damage type changed, not dice added: not read.)
                        const part = rule.override ? null : strikePart(rule, item);
                        if (part) parts.push(part);
                        else unread = true;
                        continue;
                    }
                    // (A resistance or weakness to several types: one each.)
                    if (["Resistance", "Weakness"].includes(rule.key) && Array.isArray(rule.type)) for (const type of rule.type) rules.push({ ...rule, type, predicate: [] });
                    else rules.push({ ...rule, predicate: [] });
                }
            }
            // (A way with rules it can't read: that choice isn't offered — Double Down's penalty side would be missed.)
            const model = unread ? null : effectModel({ name: `${name} (${mode.name})`, system: { rules, duration: { value: -1, unit: "unlimited" } } });
            if (!model || model.unsupported?.length || model.situational) {
                unreadChoice = true;
                break;
            }
            ways.push({ name: mode.name, model, parts });
        }
        if (unreadChoice) continue;
        // (Ways with nothing in its rules — "none", "Retract" — stay as the plain choice; at least one does something.)
        const doing = (way) => way.model.modifiers.length || way.model.resistances.length || way.model.weaknesses.length || way.model.immunities.length || way.model.fastHealing || way.parts.length;
        if (ways.some(doing)) toggles.push({ name: options.length > 1 ? `${name} (${option})` : name, ways });
    }
    return toggles.length ? toggles : null;
}

const average = (part) => (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0);
const bestStrike = (c) => (c.strikes ?? []).reduce((best, strike) => (strike.damage ?? []).reduce((sum, part) => sum + average(part), 0) > (best ? best.damage.reduce((sum, part) => sum + average(part), 0) : -1) ? strike : best, null);

// What a way is worth against these foes: the damage its defences keep off their best Strikes, the extra damage of its Strikes after their
// defences, and its bonuses at about a twentieth of a hit's worth each.
function worth(c, way, foes) {
    const as = { ...c, resistances: [...(c.resistances ?? []), ...way.model.resistances], weaknesses: [...(c.weaknesses ?? []), ...way.model.weaknesses], immunities: [...(c.immunities ?? []), ...way.model.immunities] };
    let value = 0;
    let incoming = 0;
    for (const foe of foes) {
        const strike = bestStrike(foe);
        for (const part of strike?.damage ?? []) {
            incoming += average(part);
            value += adjustInstance(c, part.type, average(part)) - adjustInstance(as, part.type, average(part));
        }
        const own = bestStrike(c);
        for (const part of (own ? way.deltas?.[own.name] : null) ?? []) value += adjustInstance(foe, part.type, average(part));
    }
    for (const modifier of way.model.modifiers) value += modifier.value * (modifier.on === "damage" ? foes.length * 0.6 : 0.05 * Math.max(incoming, 10));
    return value + (way.model.fastHealing ?? 0) * 3;
}

// As the fight starts: each toggle's best way against the foes, as a lasting effect on the creature.
export function chooseToggles(state, { applyEffect, applyCondition }) {
    for (const c of state.list) {
        if (!c.toggles?.length || !isActive(c)) continue;
        const foes = state.list.filter((other) => other.side !== c.side && isActive(other));
        for (const toggle of c.toggles) {
            const ways = toggle.ways.map((way) => ({ ...way, deltas: Object.assign({}, ...way.parts.map((part) => deltasFor(c.strikes ?? [], part))) }));
            const best = ways.reduce((top, way) => (!top || worth(c, way, foes) > worth(c, top, foes) ? way : top), null);
            if (!best) continue;
            applyEffect(state, c, { ...best.model, rounds: Infinity, ...(Object.keys(best.deltas).length ? { strikeDeltas: best.deltas } : {}) }, c, { applyCondition, key: `toggle:${toggle.name}` });
            log(state, `  ${c.name} uses ${toggle.name}: ${best.name}`);
        }
    }
}

// A mark's bonus (B308): Smite's "+4 status bonus to damage, or +8 if the target is unholy", Spirit Hunter's "+2 spirit damage" — the
// rules on the creature's items that its mark's toggle switches on, as extra damage against the creature it marks: [{ dice, die, bonus,
// type, upgrade? }], or [] when they give none.
export function markParts(items, option) {
    const parts = [];
    const upgrades = [];
    for (const item of items ?? []) {
        for (const rule of item.system?.rules ?? []) {
            const terms = Array.isArray(rule?.predicate) ? rule.predicate : [];
            const trait = terms.length === 1 ? /^target:trait:([a-z-]+)$/.exec(String(terms[0]))?.[1] : null;
            if (rule?.key === "AdjustModifier" && rule.mode === "upgrade" && trait && [].concat(rule.selector).includes("damage") && Number(rule.value) > 0) {
                upgrades.push({ slug: rule.slug, trait, value: Number(rule.value) });
                continue;
            }
            if (forWay(rule?.predicate, option, null)?.length !== 0) continue;
            const selectors = [].concat(rule.selector ?? []);
            if (rule.key === "FlatModifier" && selectors.some((selector) => ["damage", "strike-damage"].includes(selector)) && Number(rule.value) > 0)
                parts.push({ dice: 0, die: 0, bonus: Number(rule.value), type: rule.damageType ?? null, slug: rule.slug ?? null });
            else if (rule.key === "DamageDice" && selectors.some((selector) => ["damage", "strike-damage"].includes(selector)) && rule.dieSize)
                parts.push({ dice: Math.max(1, Number(rule.diceNumber) || 1), die: Number(String(rule.dieSize).replace("d", "")) || 6, bonus: 0, type: rule.damageType ?? null });
        }
    }
    // (+8 against an unholy target: the same bonus, upgraded.)
    return parts.map((part) => {
        const upgrade = upgrades.find((entry) => entry.slug && entry.slug === part.slug);
        return upgrade ? { ...part, upgrade: { trait: upgrade.trait, value: upgrade.value } } : part;
    });
}
