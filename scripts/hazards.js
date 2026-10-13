// PF2e hazards (E4): a hazard actor read into an engine combatant on the foes' side.

import { parseReadableDamage } from "../src/adapter/formula.js";
import { mentionsStrike, noMultipleAttackPenalty, parseDisable, routineActions } from "../../pf2e-resolution-core/src/text/hazard-text.js";

const TRIGGER_TYPES = new Set(["reaction", "free"]);

// Strikes from the hazard's melee items, when PF2e gives it no Strike actions.
function strikesFromItems(actor) {
    const strikes = [];
    for (const item of actor.itemTypes?.melee ?? []) {
        const damage = Object.values(item.system?.damageRolls ?? {}).flatMap((roll) => parseReadableDamage(`${roll.damage} ${roll.damageType ?? "untyped"}`));
        if (!damage.length) continue;
        strikes.push({ name: item.name, bonus: item.system?.bonus?.value ?? 0, melee: true, agile: false, damage, attackEffects: [...(item.system?.attackEffects?.value ?? [])] });
    }
    return strikes;
}

// spec: what readActor made of it. Its Strikes reach anyone on the field; its reactions are what a rule sets off.
export function hazardSpec(actor, spec) {
    const details = actor.system?.details ?? {};
    const attributes = actor.system?.attributes ?? {};
    const complex = !!details.isComplex;
    const routine = details.routine ?? "";
    const noMap = noMultipleAttackPenalty(routine);
    const melee = actor.itemTypes?.melee ?? [];
    const strikes = (spec.strikes.length ? spec.strikes : strikesFromItems(actor)).map((strike) => {
        const item = melee.find((entry) => entry.name === strike.name);
        return { ...strike, melee: false, increment: null, held: false, noMap: noMap || noMultipleAttackPenalty(item?.system?.description?.value) };
    });
    const reactions = (actor.itemTypes?.action ?? []).filter((item) => TRIGGER_TYPES.has(item.system?.actionType?.value));
    // Its compiled reactions fire when it's set off; abilities that ride on its Strikes (poisons) stay.
    // (B301: the ability module's reading of a trap's Strike, when it has one — which Strike, at whom, how often.)
    // (A creature it lets loose makes the Strike — an ooze from a hatch: the hazard has none, so not played; a gap.)
    const trapStrikes = strikes.length ? spec.trapStrikes ?? [] : [];
    if (!strikes.length) for (const entry of spec.trapStrikes ?? []) spec.gaps?.push({ kind: "reaction", name: entry.name });
    const trigger = { strikes: trapStrikes.length > 0 || reactions.some((item) => mentionsStrike(item.system?.description?.value)), trapStrikes, abilities: [] };
    const spells = [];
    for (const spell of spec.spells) {
        if (spell.kind === "ability" && TRIGGER_TYPES.has(spell.actionType) && (spell.plan?.trigger?.event ?? "use") === "use") trigger.abilities.push(spell);
        else if (spell.kind !== "basic") spells.push(spell);
    }
    const hasHealth = attributes.hasHealth !== false;
    return {
        ...spec,
        kind: "hazard",
        acts: true,
        speed: 0,
        // Complex hazards roll initiative with their Stealth.
        perception: attributes.stealth?.value ?? spec.perception ?? 0,
        hardness: hasHealth ? attributes.hardness ?? 0 : 999,
        // Some hazards can't be destroyed: only disabled.
        hp: hasHealth ? spec.hp : { value: 9999, max: 9999, temp: 0 },
        strikes,
        spells,
        reactions: { aoo: false, shieldBlock: false },
        hazard: { complex, routineActions: complex ? routineActions(routine) : 0, disable: parseDisable(details.disable), trigger }
    };
}
