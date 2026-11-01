// A PC's feats and actions as the feat module compiles them (2026-11-01, the user: "integrate the feat module into the combat simulator …
// Make sure the simulator can use the player options then rate how effective every feat and action is in combat"). Pure: the live snapshot
// (scripts/snapshot.js) and the feat ratings (tools/lib/feat-power.mjs) both read a feat module plan through featEntries.
//
// The feat module (pf2e-automatic-feat-resolution, api.compileFeat) reads a character's feat with the character's own DCs into the plans the
// ability module's cards play. What a fight here plays of them:
//   a check, a save, healing or a PF2e Effect it applies, used as an action (Bon Mot, Dust Cloud, Disarming Stance's Effect);
//   a Strike activity (Sudden Charge, Power Attack) — only an action's, and only with a requirement the planner checks;
//   the module's own Effect from a feat's rules (a stance, a moment's bonus), on the PC itself;
//   a passive's PF2e Effect for the PC itself, on from the start (situational: the moment it names isn't checked);
//   the ability module's builtins a monster's ability has too (passives' saves, Reactive Strike, a save bonus, fast healing …).
// Everything else (a reroll, a teleport, a Focus Point back, a timer, an ally's toggle, a spell a feat casts) is a gap with its reason.

import { addBuiltin } from "./abilities.js";

// The requirements a Strike activity's planner checks (planner.js); a feat's own words ("Your nimbus is active") aren't one.
export const ACTIVITY_REQUIRES = new Set(["berserk", "first-round", "after-cast", "grabbed", "prone", "off-guard", "frightened", "hit-earlier", "ally-adjacent", "free-hand", "champion-triggered", "raging", "first-attack", "not-fatigued", "helpless", "prone-or-immobilized"]);
// A requirement in the feat's words the planner checks under its own name, or null.
export function mappedRequirement(text) {
    const words = String(text ?? "").toLowerCase();
    if (/\b(?:a creature|an enemy|a foe) (?:grabbed|restrained)|creature grabbed or restrained|grabbed or restrained\b/.test(words) && /\byou have\b/.test(words)) return "grabbed";
    if (/aren't fatigued or raging|not fatigued/.test(words)) return "not-fatigued";
    if (/^(?:you are |you're )?raging\.?$/.test(words.trim())) return "raging";
    if (/champion's reaction since/.test(words)) return "champion-triggered";
    return null;
}

// Whether what the PC wields and wears meets a requirement about it (wields: { twoHanded, oneHanded, twoWeapons, freeHand, ranged, reload0,
// firearm, thrown, shield, armor: "unarmored"|"light"|"medium"|"heavy", damage: [types], groups: [weapon groups] }): true, false, or null
// when it's about something else.
export function meetsWielding(text, wields) {
    if (!wields) return null;
    const words = String(text ?? "").toLowerCase().replace(/@uuid\[[^\]]*\]\{([^}]*)\}/g, "$1");
    const checks = [];
    const add = (pattern, holds) => {
        if (pattern.test(words)) checks.push(Boolean(holds));
    };
    add(/two-handed melee weapon|melee weapon in two hands|weapon in two hands/, wields.twoHanded);
    add(/two (?:melee )?weapons, each in a different hand/, wields.twoWeapons);
    add(/single one-handed melee weapon|one-handed melee weapon and (?:are )?hold(?:ing)? nothing else/, wields.oneHanded && wields.freeHand);
    add(/one hand free|a free hand/, wields.freeHand);
    add(/wielding a (?:loaded )?ranged weapon|wielding a bow\b/, wields.ranged);
    add(/reload 0/, wields.reload0);
    add(/loaded firearm or crossbow|wielding a (?:loaded )?firearm/, wields.firearm);
    add(/thrown weapon/, wields.thrown);
    add(/wielding a shield|shield raised|shield in two hands/, wields.shield);
    add(/medium or heavy armor/, ["medium", "heavy"].includes(wields.armor));
    add(/unarmored or wearing light armor|wearing light armor or (?:no armor|are unarmored)/, ["unarmored", "light"].includes(wields.armor));
    add(/^you are unarmored|you're unarmored\.?$/, wields.armor === "unarmored");
    for (const type of ["slashing", "piercing", "bludgeoning"]) add(new RegExp(`deals ${type} damage`), (wields.damage ?? []).includes(type));
    add(/polearm or spear/, (wields.groups ?? []).some((group) => ["polearm", "spear"].includes(group)));
    if (!checks.length) return null;
    // (Only when the whole requirement is about this: "…, and your target is within reach of that hand" is more than a free hand.)
    if (/,? and (?:your|the) target|and you (?:are|have)\b(?! (?:no|nothing))/.test(words)) return checks.every(Boolean) ? null : false;
    return checks.every(Boolean);
}

// The feat module's plans no fight here plays, by what they are.
const NOT_PLAYED = {
    teleport: "a teleport",
    reroll: "a reroll",
    "roll-twice": "a roll twice",
    "regain-point": "a Focus or Mythic Point back",
    "spell-like": "a spell the feat casts",
    "cast-spell": "a spell the feat casts",
    "roll-option": "a choice PF2e holds",
    "no-effect": "nothing a fight uses",
    "hunt-prey": "a mark",
    zone: "a lasting area"
};

const actionCount = (plan, info) => {
    const value = Number(plan?.actions ?? info?.actions);
    return Number.isFinite(value) && value >= 0 ? value : 1;
};

// The PF2e Effects a plan links by name ("Compendium.pf2e.feat-effects.Item.Stance: Disarming Stance", the feat module's), by id: resolve(uuid)
// → the id-form UUID, or null.
export function withResolvedEffects(plan, resolve) {
    if (!plan || typeof resolve !== "function") return plan;
    const fix = (uuid) => resolve(uuid) ?? uuid;
    let resolution = plan.resolution;
    if (resolution?.kind === "effect") resolution = { ...resolution, applications: (resolution.applications ?? []).map((application) => (application?.uuid ? { ...application, uuid: fix(application.uuid) } : application)) };
    if (resolution?.outcomes) resolution = { ...resolution, outcomes: Object.fromEntries(Object.entries(resolution.outcomes).map(([degree, row]) => [degree, row?.nativeEffects ? { ...row, nativeEffects: row.nativeEffects.map((effect) => (effect?.uuid ? { ...effect, uuid: fix(effect.uuid) } : effect)) } : row])) };
    return resolution === plan.resolution ? plan : { ...plan, resolution };
}

// A feat module plan → { spells, builtins, pools, gap, played }: spells are the combatant's entries (kind "ability"), builtins is mutated
// (the combatant's builtin fields, abilities.js addBuiltin), gap { kind, name } when it isn't played.
//   info: { name, id, actionType ("action", "reaction", "free", "passive"), actions, frequency, traits, level }
//   helpers: { effectModels(plan) → { uuid: model } for its PF2e Effects; rulesModel(effect) → the model of a module Effect { name, rules,
//   duration } at the PC's level; passiveModel(uuid) → the model of a passive's PF2e Effect }
export function featEntries(plan, info, builtins, helpers = {}) {
    const result = { spells: [], pools: {}, gap: null, played: null };
    const name = info?.name ?? plan?.source?.name ?? "Feat";
    const gap = (reason) => ({ ...result, gap: { kind: "feat, not simulated", name: `${name}: ${reason}` } });
    if (!plan) return gap("the feat module reads nothing for it");
    if (plan.requirementUnread && helpers.meets?.(plan.requirementUnread) !== true) return gap(helpers.meets?.(plan.requirementUnread) === false ? `its requirement, which the PC doesn't meet (${plan.requirementUnread})` : `its requirement (${plan.requirementUnread})`);
    const actionType = info?.actionType ?? "passive";
    const frequency = info?.frequency;
    const pool = frequency?.max && !["turn", "round"].includes(frequency.per) ? `frequency:${info?.id ?? name}` : plan.oncePerFight ? `once:${info?.id ?? name}` : null;
    const usePool = () => {
        if (pool) result.pools[pool] = Number(frequency?.value ?? frequency?.max) || 1;
    };
    const traits = plan.traits ?? [...(info?.traits ?? [])];

    // The feat module's own Effect from the feat's rules: a stance, a moment's bonus — on the PC itself.
    if (plan.builtin === "feat-effect") {
        if (plan.timer || !(plan.effect?.rules ?? []).length) return gap("a timer with no rules a fight counts");
        if (plan.who === "target") return gap("an Effect on another creature");
        if (actionType === "passive") return gap("a passive's Effect posted by hand");
        const model = helpers.rulesModel?.(plan.effect) ?? null;
        if (!model || !worthSomething(model)) return gap("its Effect has nothing a fight counts");
        const stance = Boolean(plan.effect.stance) || traits.includes("stance");
        addBuiltin(builtins, { builtin: "self-effect", actions: actionCount(null, info), stance, model }, name);
        usePool();
        return { ...result, played: stance ? "stance" : "self effect" };
    }
    // A passive's PF2e Effect for its moment: on from its first turn, free (the moment isn't checked).
    if (plan.builtin === "passive-effect") {
        if (plan.who !== "you") return gap("a passive's Effect on other creatures");
        const model = helpers.passiveModel?.(plan.effect) ?? null;
        if (!model || !worthSomething(model)) return gap("its Effect has nothing a fight counts");
        addBuiltin(builtins, { builtin: "self-effect", actions: 0, stance: false, model: { ...model, rounds: Infinity } }, name);
        return { ...result, played: "passive effect (always on)", situational: true };
    }
    if (plan.builtin === "modes") {
        const ways = (plan.modes ?? []).filter((mode) => mode.plan?.resolution && (mode.plan.trigger?.event ?? "use") === "use" && actionType !== "passive");
        if (!ways.length) return gap("a choice of ways the simulator doesn't play");
        usePool();
        for (const mode of ways) result.spells.push(abilityEntry(`${name} (${mode.name})`, mode.plan, { pool, actionType, helpers, rechargeGroup: name }));
        return { ...result, played: "ways" };
    }
    if (plan.builtin === "strike-activity") {
        if (actionType !== "action") return gap(`a ${actionType}'s Strike`);
        let requires = plan.requires ?? null;
        if (requires && !ACTIVITY_REQUIRES.has(requires)) {
            const text = String(requires).replace(/^Requirements?:?\s*/i, "");
            const mapped = mappedRequirement(text);
            const met = mapped ? null : helpers.meets?.(text);
            if (!mapped && met !== true) return gap(met === false ? `its requirement, which the PC doesn't meet (${text})` : `its requirement (${text})`);
            requires = mapped;
        }
        plan = { ...plan, requires };
        if (plan.plain && !plan.strides && !plan.attackBonus && !plan.damageBonus && !plan.offGuard && !(plan.onHit?.conditions?.length || plan.onHit?.damage?.length || plan.onHit?.save || plan.onHit?.push)) return gap("a Strike with nothing more the simulator reads");
        if (!addBuiltin(builtins, { ...plan, traits }, name)) return gap("a Strike the simulator doesn't play");
        return { ...result, played: "Strike activity" };
    }
    if (plan.builtin && NOT_PLAYED[plan.builtin]) return gap(NOT_PLAYED[plan.builtin]);
    if (plan.builtin) {
        // (A passive's builtin — Reactive Strike, a save's degree, a save bonus — as a monster's.)
        if (!addBuiltin(builtins, { ...plan, traits }, name)) return gap(`its reading (${plan.builtin}) isn't played`);
        return { ...result, played: plan.builtin };
    }
    if (!plan.resolution) return gap("no roll or effect the simulator reads");
    const event = plan.trigger?.event ?? "use";
    if (event !== "use") return gap(`a reaction to "${event}"`);
    if (actionType === "passive") return gap("a passive's roll with no action to use it");
    if (!["check", "save", "effect", "healing", "damage"].includes(plan.resolution.kind)) return gap(`a ${plan.resolution.kind} the simulator doesn't play`);
    // (Damage still naming the character's data: not a number.)
    if (/"formula":"[^"]*@/.test(JSON.stringify(plan.resolution))) return gap("damage still naming the character's data");
    usePool();
    result.spells.push(abilityEntry(name, plan, { pool, actionType, helpers, rechargeGroup: plan.sharesRecharge ?? name }));
    return { ...result, played: plan.resolution.kind };
}

function abilityEntry(name, plan, { pool, actionType, helpers, rechargeGroup }) {
    const linked = plan.resolution?.kind === "effect" || Object.values(plan.resolution?.outcomes ?? {}).some((row) => row?.nativeEffects?.length);
    const effects = linked ? helpers.effectModels?.(plan) ?? undefined : undefined;
    return { name, plan, castRank: 1, dc: null, attack: null, pool, kind: "ability", actionType, rechargeGroup, feat: true, ...(effects && Object.keys(effects).length ? { effects } : {}) };
}

// Whether an effect model does anything a fight counts.
export function worthSomething(model) {
    if (!model) return false;
    const idle = new Set(["name", "rounds", "unsupported", "situational"]);
    return Object.entries(model).some(([key, value]) => !idle.has(key) && (Array.isArray(value) ? value.length > 0 : value && typeof value === "object" ? Object.keys(value).length > 0 : Boolean(value)));
}

// The PF2e item fields featEntries reads (a pack's document or a live item).
export function featInfo(item, level) {
    return {
        name: item.name,
        id: item._id ?? item.id ?? item.name,
        actionType: item.system?.actionType?.value ?? "passive",
        actions: item.system?.actions?.value ?? null,
        frequency: item.system?.frequency ?? null,
        traits: [...(item.system?.traits?.value ?? [])],
        level
    };
}
