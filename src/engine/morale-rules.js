// Morale rules as data, from the user's "Improved Morale.md". The optional
// "Morale.md" (AD&D) modifiers are present but disabled. Decisions marked Mn
// are listed in docs/morale-decisions.md for the user to confirm.
//
// Every entry can be overridden by a world setting (mergeMoraleRules) and
// switched off per compare variant, which is how the per-rule impact report
// measures each rule.

// Cleanup morale (the user's system, 2026-10-08, M24; inspired by "Morale.md"
// and "Improved Morale.md"): shorten fights the party is winning without
// changing who wins. Foes check only once their side is losing (losses, the
// leader, hopelessness) or the party frightens them; a failed check means the
// creature gives up (flees or surrenders by its template); the DC is PF2e's
// for the party's level, so weaker foes give up sooner and stronger ones hold.
export const MORALE_RULES = Object.freeze({
    // The gate (user, 2026-10-08, M24; M2 had it off): checks happen only while the
    // party is clearly winning, party HP × damage per round at least
    // losingGateRatio times the foes' (Lanchester's square law). Fear from the
    // party (frightened 2+, M25) counts anyway. The rules are the same whether
    // or not the players play for morale (user, 2026-10-08, M26).
    losingGate: true,
    losingGateRatio: 2,
    // How the gate tells the party is winning (user, 2026-10-08, M28): "hpShare", the share of
    // its starting HP each side has left, the party's at least hpGate.value times the foes'
    // ("ratio") or that many points above it ("margin"); simple to judge at the table. "strength"
    // (before M28): HP × a forecast of damage per round (Lanchester), at least losingGateRatio times the foes'.
    gateMode: "hpShare",
    hpGate: { kind: "ratio", value: 1.25 },
    // Whether a check the gate blocks waits to be rolled once the gate opens. Off (user,
    // 2026-10-08, M27): held checks piled up in close fights and fired together.
    holdGatedChecks: false,
    thresholdBase: 10,
    // The check's DC. "partyLevel" (user, 2026-10-08, M24): PF2e's DC for the party's level +
    // levelOffset, against the creature's own Will, so foes weaker than the party give up more easily
    // and stronger ones less. "threshold" (M1, before): thresholdBase + its own Will, so its Will
    // cancelled and only the modifiers counted.
    dcMode: "partyLevel",
    levelOffset: 0,
    checksPerRound: 1,
    extraCheckOnLeaderDeath: true,
    // M24: a failed check means the creature gives up (no wavering stage); false is Improved Morale's waver-then-break.
    failureGivesUp: true,

    triggers: {
        // Off (user, 2026-10-08, M22): it decided close fights (+2.1 points there) for 0.11 rounds.
        firstMemberOverwhelmed: { enabled: false, label: "Side loses its first member to a critical hit or overwhelming attack" },
        // M24 (Morale.md): 25%, 50% and 75% of its side fallen; a companion slain after half have fallen.
        quarterFallen: { enabled: true, label: "A quarter of its side has fallen" },
        halfStrength: { enabled: true, label: "Side falls to half its starting creatures" },
        quarterStrength: { enabled: true, label: "Side falls to one-quarter its starting creatures" },
        companionAfterHalf: { enabled: true, label: "A companion falls after half the side has" },
        outnumbered3to1: { enabled: true, label: "Side outnumbered 3:1" },
        leaderDown: { enabled: true, label: "Leader dropped or fled" },
        cantAffect: { enabled: true, label: "Can't meaningfully affect an opponent" },
        surrounded: { enabled: true, label: "Surrounded" },
        // oncePerCreature (user, 2026-10-07): a creature checks for these at most once per fight.
        // Off (user, 2026-10-08, M20): it decided close fights more than it shortened won ones.
        halfHp: { enabled: false, label: "Falls to half HP", oncePerCreature: true },
        // Off (user, 2026-10-08, M21): +1 point of win rate for 0.03 rounds.
        strongestAllyDown: { enabled: false, label: "Sees its strongest ally destroyed", oncePerCreature: true },
        // minValue (user, 2026-10-08, M25): only when an enemy's effect takes it to frightened 2 or more.
        // onFailure "frighten" (M29): a failure raises frightened by 1; only a critical failure gives up.
        frightenedByEnemy: { enabled: true, label: "Becomes frightened 2+ from an enemy effect", minValue: 2, onFailure: "frighten" },
        // Off (M24): an early check that decides fights.
        surprised: { enabled: false, label: "Surprised (first round)", source: "Morale.md" },
        // Escalations (user, 2026-10-08): not a check; foe reinforcements arriving steady wavering foes
        // (off with M24: nothing wavers).
        helpArrives: { enabled: false, label: "Help arrives: wavering foes steady" }
    },

    modifiers: {
        defendingHome: { enabled: true, value: 1, label: "Defending home, nest, altar or commander", situational: true },
        outnumbersEnemies: { enabled: true, value: 1, label: "Side outnumbers enemies" },
        undamaged: { enabled: true, value: 2, label: "Has not yet taken damage" },
        noRetreat: { enabled: true, value: 2, label: "No retreat and surrender means death", situational: true },
        frightened: { enabled: true, value: -1, label: "Currently frightened" },
        halfHp: { enabled: true, value: -1, label: "At half HP" },
        allyDroppedBySingleAttack: { enabled: true, value: -2, label: "Witnessed an ally dropped by a single attack" },
        // −4 and −6 (user, 2026-10-08, M21): they save the most rounds for the least win rate.
        outnumbered2to1: { enabled: true, value: -4, label: "Side outnumbered 2:1 or worse" },
        leaderDown: { enabled: true, value: -2, label: "Leader down or fled" },
        cantBypassDefense: { enabled: true, value: -2, label: "Can't bypass the enemy's main defence" },
        // Off (M24): a failed check takes the creature out, so there's no second one.
        alreadyFailed: { enabled: false, value: -2, label: "Already failed a morale check this encounter" },
        // M24 (Morale.md): its side's losses.
        sideLost25: { enabled: true, value: -2, label: "Its side's losses: a quarter fallen" },
        sideLost50: { enabled: true, value: -4, label: "Its side's losses: half fallen" },
        quarterStrength: { enabled: true, value: -4, label: "Side reduced to one-quarter strength" },
        isolated: { enabled: true, value: -6, label: "Isolated from allies" },
        // Per level the creature is above the party (below: negative), M24.
        levelDifference: { enabled: true, value: 1, label: "Its level against the party's (per level)" },
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
        // Off (M24): each creature checks for itself; one roll would take whole groups out at once.
        enabled: false,
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

    // Off (M24): a creature that fails has given up.
    recovery: { enabled: false }
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
