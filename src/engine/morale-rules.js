// Morale rules as data, from the user's "Improved Morale.md". The optional
// "Morale.md" (AD&D) modifiers are present but disabled. Decisions marked Mn
// are listed in docs/morale-decisions.md for the user to confirm.
//
// Every entry can be overridden by a world setting (mergeMoraleRules) and
// switched off per compare variant, which is how the per-rule impact report
// measures each rule.

export const MORALE_RULES = Object.freeze({
    // M2: morale is always active (user, 2026-10-07): the triggers themselves
    // are the signs of losing. The optional gate limits checks to fights the
    // party is clearly winning: party HP × damage per round at least
    // losingGateRatio times the foes' (Lanchester's square law).
    losingGate: false,
    losingGateRatio: 3,
    thresholdBase: 10,
    checksPerRound: 1,
    extraCheckOnLeaderDeath: true,

    triggers: {
        firstMemberOverwhelmed: { enabled: true, label: "Side loses its first member to a critical hit or overwhelming attack" },
        halfStrength: { enabled: true, label: "Side falls to half its starting creatures" },
        quarterStrength: { enabled: true, label: "Side falls to one-quarter its starting creatures" },
        leaderDown: { enabled: true, label: "Leader dropped or fled" },
        cantAffect: { enabled: true, label: "Can't meaningfully affect an opponent" },
        surrounded: { enabled: true, label: "Surrounded" },
        // oncePerCreature (user, 2026-10-07): a creature checks for these at most once per fight.
        halfHp: { enabled: true, label: "Falls to half HP", oncePerCreature: true },
        strongestAllyDown: { enabled: true, label: "Sees its strongest ally destroyed", oncePerCreature: true },
        frightenedByEnemy: { enabled: true, label: "Becomes frightened from an enemy effect" },
        surprised: { enabled: true, label: "Surprised (first round)", source: "Morale.md" },
        // Escalations (user, 2026-10-08): not a check; foe reinforcements arriving steady wavering foes.
        helpArrives: { enabled: true, label: "Help arrives: wavering foes steady" }
    },

    modifiers: {
        defendingHome: { enabled: true, value: 1, label: "Defending home, nest, altar or commander", situational: true },
        outnumbersEnemies: { enabled: true, value: 1, label: "Side outnumbers enemies" },
        undamaged: { enabled: true, value: 2, label: "Has not yet taken damage" },
        noRetreat: { enabled: true, value: 2, label: "No retreat and surrender means death", situational: true },
        frightened: { enabled: true, value: -1, label: "Currently frightened" },
        halfHp: { enabled: true, value: -1, label: "At half HP" },
        allyDroppedBySingleAttack: { enabled: true, value: -2, label: "Witnessed an ally dropped by a single attack" },
        outnumbered2to1: { enabled: true, value: -2, label: "Side outnumbered 2:1 or worse" },
        leaderDown: { enabled: true, value: -2, label: "Leader down or fled" },
        cantBypassDefense: { enabled: true, value: -2, label: "Can't bypass the enemy's main defence" },
        alreadyFailed: { enabled: true, value: -2, label: "Already failed a morale check this encounter" },
        quarterStrength: { enabled: true, value: -4, label: "Side reduced to one-quarter strength" },
        isolated: { enabled: true, value: -4, label: "Isolated from allies" },
        // Escalations (user, 2026-10-08): the alarm was raised and its help hasn't come yet.
        helpComing: { enabled: true, value: 1, label: "Help is on its way (the alarm was raised)" },
        // Morale.md (AD&D), off by default (M3).
        hatedEnemy: { enabled: false, value: 4, label: "Fighting a hated enemy", situational: true, source: "Morale.md" },
        outnumber3to1: { enabled: false, value: 2, label: "Outnumbers opponents 3:1", source: "Morale.md" },
        outnumbered3to1: { enabled: false, value: -4, label: "Outnumbered 3:1", source: "Morale.md" },
        mostPowerfulAllyKilled: { enabled: false, value: -4, label: "Most powerful ally killed", source: "Morale.md" },
        noEnemySlain: { enabled: false, value: -2, label: "No enemy slain yet", source: "Morale.md" },
        abandoned: { enabled: false, value: -6, label: "Abandoned by friends", source: "Morale.md" },
        surprisedPenalty: { enabled: false, value: -2, label: "Was surprised", source: "Morale.md" }
    },

    // M7, M8
    templates: {
        none: { label: "None (never checks)", modifier: 0 },
        cowardly: { label: "Cowardly / Skittish", modifier: -2, waver: "withdraw", break: "rout" },
        typical: { label: "Typical", modifier: 0, waver: "defensive", break: "auto" },
        disciplined: { label: "Disciplined", modifier: 2, waver: "formation", break: "disordered" },
        fanatical: { label: "Fanatical", modifier: 4, waver: "defensive", break: "berserk", ignoreFirstFailure: true },
        bestial: { label: "Bestial", modifier: 0, waver: "defensive", break: "rout", defendingLair: 2, bloodied: -2 },
        mercenary: { label: "Mercenary", modifier: 0, waver: "defensive", break: "collapse", winning: 1, unpaid: -2 }
    },

    group: {
        minSize: 3,                       // M5
        criticalFailureSteps: 2,          // M4
        leaderBonus: [[5, 3], [3, 2], [1, 1]], // M6: [level difference, bonus]
        shakenAttackPenalty: 1
    },

    boss: {
        levelsAboveParty: 2,
        breakBelowHp: 0.25
    },

    measures: {
        overwhelmingFraction: 0.5,        // M10
        cantAffectHitChance: 0.1,         // M11
        cantAffectDamage: 1,
        surroundedCount: 3,               // M12: engaged by at least this many enemies…
        surroundedMargin: 2,              // …who outnumber the creature's side in that Melee by this many
        bloodiedFraction: 0.5             // M18
    },

    recovery: { enabled: true }
});

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function merge(base, override) {
    if (!isPlainObject(override)) return override === undefined ? base : override;
    const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
        result[key] = isPlainObject(base?.[key]) ? merge(base[key], value) : value;
    }
    return result;
}

export function mergeMoraleRules(override) {
    return merge(structuredClone(MORALE_RULES), override ?? {});
}

// Disables the named rules ("triggers.halfHp", "modifiers.isolated").
export function withRulesDisabled(rules, ids) {
    const result = structuredClone(rules);
    for (const id of ids ?? []) {
        const [group, key] = id.split(".");
        if (key && result[group]?.[key]) result[group][key].enabled = false;
    }
    return result;
}

export function withLosingGate(rules, enabled) {
    return { ...structuredClone(rules), losingGate: enabled };
}

export function listRuleIds(rules) {
    const ids = [];
    for (const [key, entry] of Object.entries(rules.triggers)) if (entry.enabled) ids.push({ id: `triggers.${key}`, label: entry.label });
    for (const [key, entry] of Object.entries(rules.modifiers)) if (entry.enabled) ids.push({ id: `modifiers.${key}`, label: entry.label });
    return ids;
}
