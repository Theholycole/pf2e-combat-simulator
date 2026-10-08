// What the report says about the encounter itself: PF2e's threat rating, and
// how far the simulation can be trusted given what it can't simulate yet.

// GM Core: XP per creature by level difference, and budgets for four PCs.
const CREATURE_XP = { "-4": 10, "-3": 15, "-2": 20, "-1": 30, 0: 40, 1: 60, 2: 80, 3: 120, 4: 160 };
const THREATS = [
    ["trivial", "Trivial", 40, 10],
    ["low", "Low", 60, 15],
    ["moderate", "Moderate", 80, 20],
    ["severe", "Severe", 120, 30],
    ["extreme", "Extreme", 160, 40]
];

export function creatureXp(level, partyLevel) {
    const difference = level - partyLevel;
    if (difference < -4) return 0;
    if (difference > 4) return 160 + 40 * (difference - 4);
    return CREATURE_XP[difference];
}

export function threatRating(snapshot) {
    const pcs = snapshot.combatants.filter((c) => c.side === "party" && c.kind === "pc");
    const partyLevel = snapshot.partyLevel ?? (pcs.length ? Math.round(pcs.reduce((sum, c) => sum + c.level, 0) / pcs.length) : 1);
    const foes = snapshot.combatants.filter((c) => c.side === "foes" && c.kind !== "object" && c.status !== "dead");
    const xp = foes.reduce((sum, c) => sum + creatureXp(c.level, partyLevel), 0);
    const size = Math.max(1, pcs.length);
    let rating = THREATS[0];
    for (const threat of THREATS) if (xp >= threat[2] + (size - 4) * threat[3]) rating = threat;
    const extremeBudget = THREATS[4][2] + (size - 4) * THREATS[4][3];
    const beyond = xp > extremeBudget * 1.25;
    return { xp, partyLevel, partySize: pcs.length, key: beyond ? "beyond" : rating[0], label: beyond ? "Beyond Extreme" : rating[1] };
}

const SPELL_HEAVY = 3;

// Which way unsimulated abilities push the result, and how much to trust it.
export function reliability(snapshot) {
    const reasons = [];
    const foes = snapshot.combatants.filter((c) => c.side === "foes" && c.kind !== "object");
    const pcs = snapshot.combatants.filter((c) => c.side === "party" && c.kind === "pc");
    const count = (c, kind) => (c.gaps ?? []).filter((gap) => gap.kind === kind).length;
    // Rough share of each side's offense the simulation leaves out: all of it
    // for a creature that can't attack, about half for a spellcaster (it still
    // swings a weapon).
    let foeMissing = 0;
    let partyMissing = 0;

    const harmless = foes.filter((c) => !(c.strikes ?? []).length);
    if (harmless.length) {
        foeMissing += harmless.length;
        reasons.push(`${harmless.length} foe${harmless.length > 1 ? "s" : ""} can't attack here (area attacks such as swarms' and troops' aren't simulated yet): results favour the party.`);
    }
    const foeCasters = foes.filter((c) => (c.strikes ?? []).length && count(c, "spell") >= SPELL_HEAVY);
    if (foeCasters.length) {
        foeMissing += 0.5 * foeCasters.length;
        reasons.push(`${foeCasters.length} foe${foeCasters.length > 1 ? "s rely" : " relies"} on spells, which aren't simulated yet: results favour the party.`);
    }
    const foeAbilities = foes.reduce((sum, c) => sum + count(c, "ability") + count(c, "attack effect"), 0);
    if (foeAbilities >= Math.max(2, foes.length)) {
        foeMissing += 0.15 * foes.length;
        reasons.push(`Foes have ${foeAbilities} special abilities or Strike effects (such as Grab) that aren't simulated: results lean towards the party.`);
    }
    const protectedId = snapshot.setup?.objective?.kind === "protect" ? snapshot.setup.objective.protectId : null;
    const hazards = snapshot.combatants.filter((c) => c.side === "foes" && c.kind === "object" && c.id !== protectedId);
    if (hazards.length) {
        foeMissing += hazards.length;
        reasons.push(`${hazards.map((c) => c.name).join(", ")} ${hazards.length > 1 ? "are hazards or objects" : "is a hazard or object"} on the foes' side; their routines aren't simulated: results favour the party.`);
    }
    const pcCasters = pcs.filter((c) => count(c, "spell") >= SPELL_HEAVY);
    if (pcCasters.length) {
        partyMissing += 0.5 * pcCasters.length;
        reasons.push(`${pcCasters.map((c) => c.name).join(", ")} rel${pcCasters.length > 1 ? "y" : "ies"} on spells, which aren't simulated yet: results favour the foes.`);
    }
    const healers = pcs.filter((c) => (c.gaps ?? []).some((gap) => /heal|medicine|elixir of life|healing potion/i.test(gap.name)));
    if (healers.length) reasons.push("The party's healing isn't simulated yet: PC deaths and defeats are overstated.");

    const foeShare = Math.min(1, foeMissing / Math.max(1, foes.length + hazards.length));
    const partyShare = Math.min(1, partyMissing / Math.max(1, pcs.length));
    const worst = Math.max(foeShare, partyShare);
    let level = worst >= 0.4 ? "low" : worst >= 0.15 ? "medium" : "high";
    if (level === "high" && healers.length) level = "medium";
    let leans = null;
    if (foeShare - partyShare > 0.1) leans = "party";
    else if (partyShare - foeShare > 0.1) leans = "foes";
    else if (worst >= 0.15) leans = "both";
    return { level, leans, reasons, missing: { foes: foeShare, party: partyShare } };
}
