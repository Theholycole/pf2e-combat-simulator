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
    // 3.25× with damage potential (2026-10-14, M40; 3.5× with this round's damage, M39; 2× before M28).
    losingGateRatio: 3.25,
    // How the gate tells the party is winning: "strength" (user, 2026-10-14, M39; it was HP share from M28, simple to
    // judge at the table): HP × a forecast of damage per round (Lanchester), at least losingGateRatio times the foes'.
    // It sees a foe that's low on HP but still hits hard, so it turns fewer losses into wins for the same rounds saved.
    // "hpShare" (M28): the share of its starting HP each side has left, the party's at least hpGate.value times the
    // foes' ("ratio") or that many points above it ("margin").
    gateMode: "strength",
    // What a creature's damage is in its strength (M40): "potential", its damage per round over the next rounds with
    // its limited spells and abilities only as often as it has uses left (a drained caster, a disarmed fighter count for
    // less); "thisRound", what it can deal this round.
    strengthBy: "potential",
    // PCs down (M37, 2026-10-14): fights morale turned from losses into wins mostly had PCs down when the first foe
    // gave up. perPcDown (HP share only; the strength gate counts a PC down as no HP and no damage): the party must be
    // that much further ahead for each PC down (0.5: 1.75× with one down, 2.25× with two). Options, off: maxPcsDown (shut while more than that many are down; 0 halved those flips but cost a
    // third of the rounds saved when the party can't heal), recentPcDownRounds (shut while a PC dropped this round or in
    // the last N), minPartyShare (shut while the party has less than that share of its HP).
    hpGate: { kind: "ratio", value: 1.25, perPcDown: 0.5, maxPcsDown: null, recentPcDownRounds: null, minPartyShare: null },
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
    // The rout ends the fight once half the surviving foes are broken ("Improved Morale.md"). M30 (user,
    // 2026-10-08): those who surrendered or fled on a failed check count as surviving and broken too.
    routCountsGivenUp: true,
    // The rout's share of surviving foes broken, and whether it waits for the gate to be open (false: it
    // ends the fight however the party is doing). A third, with the gate (user, 2026-10-14, M37; was
    // "Improved Morale.md"'s half, without): one of three broken routs the rest while the party is clearly ahead.
    rout: { fraction: 0.33, needsGate: true },
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
        // M31 (user, 2026-10-08; "Improved Morale.md": retreat or surrender becomes reasonable): each foe checks
        // when the party's share of its HP left first reaches each ratio times the foes'. Not solo bosses
        // (bosses: false): one hits as hard at 20% HP, so the party still loses some of those fights.
        // 1.5×, 2× and 3× (user, 2026-10-14, M39; 2×, 3×, 4× with M37; 3×, 4×, 6× before), behind the strength gate.
        hopeless: { enabled: true, label: "Retreat becomes reasonable (the party far ahead on HP share)", ratios: [1.5, 2, 3], bosses: false },
        // oncePerCreature (user, 2026-10-07): a creature checks for these at most once per fight.
        // Off (user, 2026-10-08, M20): it decided close fights more than it shortened won ones.
        halfHp: { enabled: false, label: "Falls to half HP", oncePerCreature: true },
        // Off (user, 2026-10-08, M21): +1 point of win rate for 0.03 rounds.
        strongestAllyDown: { enabled: false, label: "Sees its strongest ally destroyed", oncePerCreature: true },
        // minValue (user, 2026-10-08, M25): only when an enemy's effect takes it to frightened 2 or more.
        // onFailure "frighten" (M29): a failure raises frightened by 1; only a critical failure gives up.
        // ignoresGate (M24): fear counts before the party is ahead.
        // giveUpNeedsGate (user, 2026-10-14, M39): a critical failure gives up only while the gate is open; before, it
        // frightens like a failure.
        frightenedByEnemy: { enabled: true, label: "Becomes frightened 2+ from an enemy effect", minValue: 2, onFailure: "frighten", ignoresGate: true, giveUpNeedsGate: true },
        // M32 (user, 2026-10-08): fleeing for any reason (a spell, an ability; not its own broken morale) sets off a
        // check as it begins and at the start of each of its turns while it lasts. Like fear, a failure raises
        // frightened by 1, only a critical failure gives up, and it counts before the party is ahead.
        fleeing: { enabled: true, label: "Fleeing from any effect, each round it lasts", onFailure: "frighten", ignoresGate: true, giveUpNeedsGate: true },
        // Off (M24): an early check that decides fights.
        surprised: { enabled: false, label: "Surprised (first round)", source: "Morale.md" },
        // Escalations (user, 2026-10-08): not a check; foe reinforcements arriving steady wavering foes
        // (off with M24: nothing wavers).
        helpArrives: { enabled: false, label: "Help arrives: wavering foes steady" }
    },

    modifiers: {
        defendingHome: { enabled: true, value: 1, label: "Defending home, nest, altar or commander", situational: true },
        outnumbersEnemies: { enabled: true, value: 1, label: "Side outnumbers enemies" },
        // Off (user, 2026-10-14, M37): foes give up sooner in fights the party is winning.
        undamaged: { enabled: false, value: 2, label: "Has not yet taken damage" },
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
        // M24 (Morale.md): its side's losses; −4 and −6 (user, 2026-10-14, M37; were −2 and −4).
        sideLost25: { enabled: true, value: -4, label: "Its side's losses: a quarter fallen" },
        sideLost50: { enabled: true, value: -6, label: "Its side's losses: half fallen" },
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

    // Read the fight (user, 2026-10-14, M38): with each side-losing check, while the gate is open, a foe whose morale
    // held rolls Perception against the same DC; its side's losing signs (these morale modifiers) help by as much as
    // they hurt its morale. A success: it sees the fight is lost. One that speaks a language yields (offers to
    // surrender); one that can't leaves the fight (fleeing, not frightened). Not fanatics (readsTheFight: false) or
    // creatures that never check; a solo boss only once Boss Resolve would let it break. Every surrender is an offer:
    // the party accepting it captures the creature; harming it instead (setup "noQuarter", or a kill objective's
    // target) makes it and the allies who saw fight to the death, with no more morale or Perception checks.
    // On (2026-10-14): with M37 it saves more rounds than the old rules and turns fewer losses into wins.
    // dcOffset: its DC against the morale check's (0: the same).
    readTheFight: { enabled: true, dcOffset: 0, signs: ["sideLost25", "sideLost50", "quarterStrength", "outnumbered2to1", "isolated", "leaderDown"] },

    // M7, M8
    templates: {
        none: { label: "None (never checks)", modifier: 0 },
        cowardly: { label: "Cowardly / Skittish", modifier: -2, waver: "withdraw", break: "rout" },
        typical: { label: "Typical", modifier: 0, waver: "defensive", break: "auto" },
        disciplined: { label: "Disciplined", modifier: 2, waver: "formation", break: "disordered" },
        fanatical: { label: "Fanatical", modifier: 4, waver: "defensive", break: "berserk", ignoreFirstFailure: true, readsTheFight: false },
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
