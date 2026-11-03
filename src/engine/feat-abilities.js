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
// The stance a requirement names, "You are in Tiger Stance", "You're in either claw stance or talon stance": the stances' names, or null when
// it asks for more ("…and have Grabbed a creature").
export function requiredStances(text) {
    const said = /^(?:you are|you're) in (?:either )?(.+)$/i.exec(String(text ?? "").trim())?.[1];
    if (!said) return null;
    // (The feat module's requirement with a link runs on into the feat's text: the linked stance is the whole of it.)
    const linked = /^@UUID\[[^\]]*?Item\.([^\]]+? Stance)\](?:\{[^}]*\})?(?:\s+(?:or|and)\s+@UUID\[[^\]]*?Item\.([^\]]+? Stance)\])?(?!\s+and\b)/i.exec(said);
    if (linked) return [linked[1], linked[2]].filter(Boolean);
    const plain = /^((?:[\w'-]+ ){1,4}?stance)(?:,? or ((?:[\w'-]+ ){1,4}?stance))?\.?$/i.exec(said.trim());
    return plain ? [plain[1], plain[2]].filter(Boolean) : null;
}

// (2026-11-03, the class feats no fight played.) A PC's requirement in its own words read into the needs the planner checks (src/engine/needs.js
// needsMet: the ability module's vocabulary for a monster's), or null: "You are adjacent to an enemy", "Your last action was a successful
// Strike", "You used your previous action to make a melee Strike that missed", "Your current Hit Points are at half your maximum or less".
export function pcNeeds(text) {
    const said = String(text ?? "").replace(/@UUID\[[^\]]*?Item\.([^\]]+)\](?:\{([^}]*)\})?/g, (_all, name, label) => label ?? name).trim().replace(/\.$/, "");
    const clauses = [
        [/^You(?:'re| are) adjacent to (?:an enemy|a foe|an opponent)(?: .*)?$/i, () => ({ enemyAdjacent: true })],
        // (2026-11-03, more of the class feats' requirements: Quick Reversal's "You're flanked by at least two enemies" — two foes in reach.)
        [/^You(?:'re| are) flanked by at least two enemies$/i, () => ({ enemyAdjacent: 2 })],
        [/^Your (?:last|previous) action was a successful [\w ,-]+? Strike$/i, () => ({ afterStrike: { on: ["success", "criticalSuccess"] } })],
        [/^Your (?:last|previous) action dealt damage to a creature$/i, () => ({ afterStrike: { on: ["success", "criticalSuccess"] } })],
        [/^Your (?:last|previous) action was a missed Strike with a (melee )?(?:unarmed attack|weapon)$/i, (m) => ({ afterStrike: { on: ["failure", "criticalFailure"], ...(m[1] ? { melee: true } : {}) } })],
        [/^Your (?:last|previous) action (?:this turn )?was a successful (melee )?Strike(?: (?:against|with) [^.]*)?(?:\s+[A-Z].*)?$/, (m) => ({ afterStrike: { on: ["success", "criticalSuccess"], ...(m[1] ? { melee: true } : {}) } })],
        [/^Your (?:last|previous) action was a critically successful (melee )?Strike$/i, (m) => ({ afterStrike: { on: ["criticalSuccess"], ...(m[1] ? { melee: true } : {}) } })],
        [/^You used your previous action to make a (melee )?Strike that missed$/i, (m) => ({ afterStrike: { on: ["failure", "criticalFailure"], ...(m[1] ? { melee: true } : {}) } })],
        [/^Your (?:last|previous) action was a (melee )?Strike that missed$/i, (m) => ({ afterStrike: { on: ["failure", "criticalFailure"], ...(m[1] ? { melee: true } : {}) } })],
        [/^Your current Hit Points are (?:at )?half your maximum or (?:less|lower)$/i, () => ({ hpBelowHalf: true })],
        [/^You have (?:one or more hands|a hand|one hand) free$/i, () => ({ freeHand: true })],
        [/^An? (?:enemy|creature|foe) has you Grabbed or Restrained$/i, () => ({ any: [{ self: ["grabbed"] }, { self: ["restrained"] }] })],
        [/^You(?:'re| are) (?:Prone|prone)$/, () => ({ self: ["prone"] })],
        [/^An? (?:creature|enemy|foe) within your (?:melee )?reach is (Prone|Frightened|Off-Guard)(?: or swimming)?$/i, (m) => ({ target: { conditions: [m[1].toLowerCase().replace("off-guard", "offGuard")], within: 5 } })],
        [/^An? (Frightened|Prone) (?:creature|enemy|foe) is (?:with)?in your (?:melee )?reach$/i, (m) => ({ target: { conditions: [m[1].toLowerCase()], within: 5 } })],
        [/^You(?:'re| are) adjacent to an? (Prone) (?:enemy|creature|foe)$/i, (m) => ({ target: { conditions: [m[1].toLowerCase()], within: 5 } })]
    ];
    for (const [pattern, need] of clauses) {
        const m = pattern.exec(said);
        if (m) return [need(m)];
    }
    // (What a fight on the simulator's lit, open field always meets — the PC's own staff or favored weapon is the one it holds —: no need.)
    if (/^(?:You(?:'re| are) wielding your (?:staff|deity's favored weapon|order's favored weapon)|You aren't unholy|You aren't in dim light or darkness|You(?:'re| are) in bright light|You(?:'re| are) aware of the hostile effect, and you aren't Off-Guard against it|You aren't Encumbered|You(?:'re| are) not Encumbered|You(?:'re| are) aware of the attack(?:,| and) (?:aren't|are not|not) Off-Guard(?: against it)?(?:, and either have a hand free or are wielding a melee weapon)?)$/i.test(said)) return [];
    return null;
}

// (2026-11-03, Cole: "Prioritize what's meaningful in play (e.g. PC reaction triggers, Strike riders)".) A PC's reaction Strike trigger in its
// own words → the engine's reaction-strike triggers (actions.js), or null: "A creature within your reach critically fails a Strike against
// you" (Dueling Riposte), "… uses a move action or leaves a square during a move action it's using" (Stand Still), "A creature within your
// reach succeeds at an attack against you" (Vengeful Strike), "Your melee Strike reduces an enemy to 0 Hit Points, and another enemy is
// adjacent to that creature" (Cleave).
export function pcReactionTriggers(text) {
    const said = String(text ?? "").replace(/@UUID\[[^\]]*?Item\.([^\]]+)\](?:\{([^}]*)\})?/g, (_all, name, label) => label ?? name).trim().replace(/\.$/, "");
    if (/\b(?:ally|allies|companion|eidolon|spotter|crop|flank|Escape|frightened|turn ends|Propelled|saving throw|counteracts)\b/i.test(said) && !/^An? creature within your (?:melee )?reach is hit by a melee attack from one of your allies$/i.test(said)) return null;
    if (/^An? (?:creature|enemy|foe|opponent) within your (?:melee )?reach critically fails (?:a Strike against you|to Strike you)$/i.test(said)) return ["critical-miss"];
    if (/^An? (?:creature|enemy|foe|opponent) within your (?:melee )?reach (?:succeeds at an attack against you|hits you with a (?:melee )?(?:Strike|attack))$/i.test(said)) return ["hit"];
    if (/^An? (?:enemy|creature|foe) damages you and is within your (?:melee )?reach$/i.test(said)) return ["damaged-adjacent"];
    if (/^An? (?:enemy|creature|foe) within your (?:melee )?reach critically hits you(?: with a melee Strike)?$/i.test(said)) return ["critical-hit"];
    if (/^Your melee Strike reduces an enemy to 0 Hit Points, and another enemy is adjacent to that creature$/i.test(said)) return ["downs"];
    if (/^An? creature within your (?:melee )?reach is hit by a melee attack from one of your allies$/i.test(said)) return ["ally-hit"];
    const near = /^An? (?:creature|enemy|foe)(?: you can observe)? within (?:your (?:melee )?reach|reach of your deity's favored weapon|(?:5|10) feet of you)(?: of your deity's favored weapon)? (.+)$/i.exec(said)
        ?? /^Your hunted prey is within your reach, and it (.+)$/i.exec(said);
    if (!near) return null;
    const kinds = [];
    const rest = near[1];
    if (/\buses a move action\b/i.test(rest)) kinds.push("move");
    if (/\bleaves a square during (?:a|its) move action\b/i.test(rest)) kinds.push("leave");
    if (/\bmanipulate action\b/i.test(rest)) kinds.push("manipulate");
    if (/\bconcentrate action\b/i.test(rest)) kinds.push("concentrate");
    if (/\bmakes a ranged attack\b/i.test(rest)) kinds.push("ranged");
    if (/\bcasts a spell\b/i.test(rest)) kinds.push("cast");
    // (Only when the whole trigger is read: "uses an auditory effect" isn't.)
    const leftover = rest.replace(/\b(?:uses|an?|or|a|move action|manipulate action|concentrate action|makes a ranged attack|leaves a square during (?:a|its) move action(?: it's using)?|casts a spell|it's using)\b|[,;]/gi, "").trim();
    return kinds.length && !leftover ? [...new Set(kinds)] : null;
}

// The feat whose Effect a requirement names: "You are benefiting from Dueling Parry", "You're under the effect of Come and Get Me" → its name.
export function requiredEffectFeat(text) {
    const said = String(text ?? "").replace(/@UUID\[[^\]]*?Item\.([^\]]+)\](?:\{([^}]*)\})?/g, (_all, name, label) => label ?? name).trim().replace(/\.$/, "");
    return /^You(?:'re| are) (?:benefiting from|under the effects? of|affected by) ([A-Z][\w' -]+?)$/.exec(said)?.[1] ?? null;
}

// A requirement in the feat's words the planner checks under its own name, or null.
export function mappedRequirement(text) {
    const stances = requiredStances(text);
    if (stances) return `stance:${stances.join("|")}`;
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
    // (Snagging Strike's and Combat Grab's ", and your target is within reach of that hand": a melee Strike's target is.)
    const words = String(text ?? "").toLowerCase().replace(/@uuid\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/,? and your target is within reach of that hand/, "").replace(/ and your target is within your reach/, "");
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
    add(/polearm or spear|spear or polearm group/, (wields.groups ?? []).some((group) => ["polearm", "spear"].includes(group)));
    // (2026-11-03, the class feats no fight played: Lunge's "You are wielding a melee weapon", Revealing Stab's "a melee weapon that can deal
    // piercing damage", Sleek Reposition's "a finesse weapon or polearm", Giant's Stature's "You are Medium or smaller" — every PC here is.)
    add(/^you are wielding a melee weapon\.?$/, wields.melee ?? !wields.ranged);
    add(/melee weapon that can deal (slashing|piercing|bludgeoning) damage/, (wields.damage ?? []).includes(/can deal (\w+) damage/.exec(words)?.[1]));
    add(/finesse weapon or polearm/, Boolean(wields.finesse) || (wields.groups ?? []).includes("polearm"));
    add(/^you are medium or smaller\.?$/, true);
    // (Tenacious Stance's "You are wearing armor", Stonestrike Stance's "You are standing on the ground".)
    add(/^you are wearing armor\.?$/, wields.armor !== "unarmored");
    // (A gunslinger's: Trick Shot's "a loaded crossbow or firearm", Phalanx Breaker's "a two-handed firearm or a two-handed crossbow", Paired
    // Shots' and Twin Shot Knockdown's one in each hand; Into the Fray's weapon and shield; Dual Finisher's "two melee weapons, one in each
    // hand"; a thaumaturge's implement, which it always holds.)
    add(/loaded crossbow or (?:loaded )?firearm|kickback or scatter trait/, wields.firearm);
    add(/two-handed firearm or a two-handed crossbow/, wields.firearm && wields.twoHandedRanged !== false);
    add(/(?:crossbow or loaded firearm|firearm or crossbow) in each hand|two weapons, each of which can be either a loaded one-handed/, wields.firearm && wields.twoWeapons);
    add(/one-handed melee weapon in one hand and a shield/, wields.oneHanded && wields.shield);
    add(/wield two melee weapons, one in each hand/, wields.twoWeapons);
    add(/^you(?:'re| are) holding an implement\.?$/, true);
    add(/^you are standing on the ground\.?$/, true);
    // (Extravagant Parry's "You're wielding one or more one-handed weapons", Spell Parry's "You have one or more hands free".)
    add(/one or more one-handed weapons/, wields.oneHanded);
    add(/one or more hands free/, wields.freeHand);
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
    // (A stance it needs: the planner's check, the stance among the PC's feats — tools/lib/feat-power.mjs partyWithFeat.)
    const stanceNeeded = plan.requirementUnread ? requiredStances(plan.requirementUnread) : null;
    if (stanceNeeded) plan = { ...plan, requirementUnread: undefined, requires: plan.requires && !/^You|^Requirements?/i.test(String(plan.requires)) ? plan.requires : `stance:${stanceNeeded.join("|")}` };
    // (A requirement the planner checks as a need: on the plan, or on its Strike activity.)
    const needed = plan.requirementUnread && helpers.meets?.(plan.requirementUnread) !== true ? pcNeeds(plan.requirementUnread) : null;
    if (needed) plan = { ...plan, requirementUnread: undefined, needs: needed };
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
        addBuiltin(builtins, { builtin: "self-effect", actions: actionCount(null, info), stance, model, ...(String(plan.requires ?? "").startsWith("stance:") ? { requiresEffect: plan.requires.slice(7).split("|")[0] } : {}) }, name);
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
        // (A reaction's Strike on a trigger the engine plays: the reaction-strike builtin, as a monster's.)
        const effectNeeded = actionType === "reaction" && plan.requires ? requiredEffectFeat(String(plan.requires).replace(/^Requirements?:?\s*/i, "")) : null;
        // (2026-11-03: or a requirement the PC's loadout meets, or one a fight here always meets — Silence the Profane's deity's weapon.)
        const requirementSaid = String(plan.requires ?? "").replace(/^Requirements?:?\s*/i, "");
        const requirementMet = !plan.requires || Boolean(effectNeeded) || helpers.meets?.(requirementSaid) === true || pcNeeds(requirementSaid)?.length === 0;
        const triggers = actionType === "reaction" && requirementMet ? pcReactionTriggers(info?.trigger) : null;
        if (triggers) {
            const disrupts = /\bdisrupt/i.test(info?.text ?? "") ? "critical" : false;
            if (!addBuiltin(builtins, { builtin: "reaction-strike", triggers, strike: null, penalty: 0, disrupts, ...(plan.strike === "ranged" && !plan.melee ? { ranged: true } : {}), ...(plan.extraWeaponDice ? { extraDamage: plan.extraWeaponDice } : {}), ...(effectNeeded ? { requiresEffect: effectNeeded } : {}) }, name)) return gap("a reaction's Strike the engine doesn't play");
            return { ...result, played: `reaction Strike (${triggers.join(", ")})` };
        }
        if (actionType !== "action") return gap(`a ${actionType}'s Strike`);
        // (The feat module reads a Strike into any text that names one — Sneak's "If you attempt to Strike a creature", Command an Animal's list
        // of actions, Only You and I's foe's Strikes: only an action whose text has its user make the Strike is played; a companion's isn't.)
        if (info?.text && !userStrike(info.text)) return gap(info.companion ? "a companion's Strike" : "its text has no Strike of its user's");
        let requires = plan.requires ?? null;
        if (requires && !ACTIVITY_REQUIRES.has(requires)) {
            const text = String(requires).replace(/^Requirements?:?\s*/i, "");
            const mapped = mappedRequirement(text);
            const met = mapped ? null : helpers.meets?.(text);
            const needs = mapped || met === true ? null : pcNeeds(text);
            if (needs) plan = { ...plan, needs };
            if (!mapped && met !== true && !needs) return gap(met === false ? `its requirement, which the PC doesn't meet (${text})` : `its requirement (${text})`);
            requires = mapped;
        }
        plan = { ...plan, requires };
        // (Two or three Strikes — Double Slice, Double Shot, Twin Takedown's — : the engine's multi-strike, at the best Strikes; "your multiple
        // attack penalty doesn't increase until …" — the same penalty for each.)
        if (Array.isArray(plan.strikes) && plan.strikes.length > 1) {
            const sameMap = /\bpenalty (?:doesn't|does not) increase until\b|\bboth (?:attacks|Strikes) (?:count|use) (?:your )?(?:current )?multiple attack penalty\b/i.test(info?.text ?? "");
            const multi = { builtin: "multi-strike", actions: actionCount(plan, info), strikes: plan.strikes.map((strike) => (strike === "ranged" ? "ranged" : null)), ...(sameMap ? { sameMap: true } : {}), ...(traits.includes("flourish") ? { flourish: true } : {}), ...(Number(plan.strides) > 0 ? { strides: Number(plan.strides) } : {}), ...(requires ? { requires } : {}), ...(plan.needs?.length ? { needs: plan.needs } : {}) };
            if (!addBuiltin(builtins, multi, name)) return gap("Strikes the simulator doesn't play");
            return { ...result, played: `${plan.strikes.length} Strikes` };
        }
        // (A Strike and nothing the simulator reads on top — plain, or a rider the feat module didn't read: Overwhelming Blow, Grievous Blow —
        // is a gap: played, it's a worse Strike for more actions and the AI rightly never takes it, which would rate the feat as useless.)
        const onHit = plan.onHit ?? {};
        const adds = plan.strides || plan.attackBonus || plan.damageBonus || plan.damage || plan.offGuard || plan.exacting || plan.extraWeaponDice || plan.riderSpell
            || onHit.conditions?.length || onHit.damage?.length || onHit.save || onHit.push || onHit.size || onHit.critical || onHit.follow || onHit.criticalDamage?.length;
        if (!adds) return gap("a Strike with nothing more the simulator reads");
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
    // (A check or save whose degrees do nothing it reads — Stand Back, I'm A Doctor!'s and Muckraking's "shared" damage the feat module didn't
    // find — is a gap too, for the same reason.)
    if (["check", "save"].includes(plan.resolution.kind)) {
        const outcomes = Object.values(plan.resolution.outcomes ?? {});
        const does = (row) => row && ((row.damage?.mode === "formulas" && row.damage.formulas?.length) || row.effects?.length || row.nativeEffects?.length || row.healing);
        if (!plan.resolution.sharedDamage && !outcomes.some(does)) return gap("a roll whose results the simulator doesn't read");
    }
    // (An Effect with nothing a fight counts — Disarming Stance's, Duelist's Challenge's, Shooting Stars Stance's: what they do is in rules the
    // simulator doesn't read — is a gap: played, it's an action spent on nothing, the AI never takes it, and the feat would rate as useless.)
    if (plan.resolution.kind === "effect" && helpers.effectModels) {
        const models = Object.values(helpers.effectModels(plan) ?? {});
        if (!models.some(worthSomething)) return gap("an Effect with nothing a fight counts");
    }
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

// Whether a feat's words have its user make a Strike: "Make a melee Strike", "Stride twice, then make a Strike", "Strike twice", "You Strike".
const USER_STRIKE = /(?:^|[.:;,]\s+|\b(?:then|and|finally|or)\s+)(?:you\s+)?(?:can\s+|may\s+|then\s+)?(?:make|makes)\s+(?:a|an|one|two|three|another|a single|up to (?:two|three))\s+(?:[\w'-]+\s+){0,4}?Strikes?\b|(?:^|[.:;,]\s+|\b(?:then|and|finally)\s+)(?:you\s+)?(?:can\s+)?Strike(?!\s+a target other)(?:\s+(?:twice|three times|an?|the|one|each|it|that|your))?\b/i;
const OTHERS_STRIKE = /\b(?:your|the|an?) (?:eidolon|companion|familiar|mount|ally|minion|follower|animal|summon|construct|underling)s?\b[^.]{0,120}\bStrikes?\b/i;
export function userStrike(text) {
    const plain = String(text ?? "");
    if (!USER_STRIKE.test(plain)) return false;
    // (The Strike sentence about another creature: "Your eidolon makes a melee Strike".)
    const sentence = plain.split(/(?<=[.!?])\s+/).find((each) => USER_STRIKE.test(each)) ?? "";
    return !OTHERS_STRIKE.test(sentence);
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
        level,
        // (Its trigger's words, for a reaction: pcReactionTriggers.)
        trigger: /<strong>\s*Trigger\s*<\/strong>\s*([\s\S]*?)<\/p>/i.exec(String(item.system?.description?.value ?? ""))?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? null,
        // (Its words, plain, without its heading blocks: for a Strike activity's check, userStrike.)
        text: String(item.system?.description?.value ?? "").replace(/<p>\s*<strong>\s*(?:Requirements?|Frequency|Trigger|Cost|Access|Prerequisites?)\s*<\/strong>[\s\S]*?<\/p>/gi, " ").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@\w+\[[^\]]*\]/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        companion: /\beidolon\b|\bcompanion\b/i.test(String(item.system?.description?.value ?? "")) && (item.system?.traits?.value ?? []).some((trait) => ["eidolon", "summoner", "companion"].includes(trait))
    };
}
