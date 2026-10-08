// Encounter adjustments a GM can make on the fly, applied to a snapshot:
// PF2e's Elite and Weak adjustments (GM Core), and removing a creature.
//
// An adjustment is { kind: "elite" | "weak" | "remove", name }. Elite and Weak
// apply to every foe with that name; remove takes out one of them.

const STAT_SHIFT = 2;

function eliteHp(level) {
    if (level <= 1) return 10;
    if (level <= 4) return 15;
    if (level <= 19) return 20;
    return 30;
}

function weakHp(level) {
    if (level <= 2) return 10;
    if (level <= 5) return 15;
    if (level <= 20) return 20;
    return 30;
}

function shiftCreature(c, sign, hpChange) {
    const shift = sign * STAT_SHIFT;
    const max = Math.max(1, c.hp.max + hpChange);
    // A creature already hurt keeps its damage taken.
    const taken = c.hp.max - c.hp.value;
    const skills = Object.fromEntries(Object.entries(c.skills ?? {}).map(([key, value]) => [key, value + shift]));
    return {
        ...c,
        level: c.level + sign,
        ac: c.ac + shift,
        perception: (c.perception ?? 0) + shift,
        stealth: typeof c.stealth === "number" ? c.stealth + shift : c.stealth,
        skills,
        saves: Object.fromEntries(Object.entries(c.saves ?? {}).map(([key, value]) => [key, value + shift])),
        hp: { ...c.hp, max, value: Math.max(1, Math.min(max, max - taken)) },
        strikes: (c.strikes ?? []).map((strike) => ({
            ...strike,
            bonus: strike.bonus + shift,
            damage: bumpDamage(strike.damage, shift, 1),
            critDamage: strike.critDamage ? bumpDamage(strike.critDamage, shift, 2) : strike.critDamage
        })),
        adjusted: sign > 0 ? "elite" : "weak"
    };
}

// +2 (or −2) damage on the weapon's own part; a critical doubles it.
function bumpDamage(parts, shift, critical) {
    if (!parts?.length) return parts;
    const [first, ...rest] = parts;
    const multiplier = first.multiplier ?? 1;
    // The bonus sits inside the multiplier, so a doubled part needs only the base shift.
    const bonus = (first.bonus ?? 0) + (multiplier >= critical ? shift : shift * critical);
    return [{ ...first, bonus }, ...rest];
}

export function eliteAdjust(c) {
    return shiftCreature(c, 1, eliteHp(c.level));
}

export function weakAdjust(c) {
    return shiftCreature(c, -1, -weakHp(c.level));
}

function adjustable(c) {
    return c.side === "foes" && c.kind !== "object" && c.status !== "dead";
}

export function applyAdjustments(snapshot, adjustments = []) {
    let combatants = snapshot.combatants;
    for (const adjustment of adjustments) {
        if (adjustment.kind === "remove") {
            const victim = combatants.find((c) => adjustable(c) && c.name === adjustment.name && c.hp.value > 0);
            if (victim) combatants = combatants.filter((c) => c !== victim);
            if (victim && snapshot.order) snapshot = { ...snapshot, order: snapshot.order.filter((id) => id !== victim.id) };
        } else {
            const change = adjustment.kind === "elite" ? eliteAdjust : weakAdjust;
            combatants = combatants.map((c) => (adjustable(c) && c.name === adjustment.name && !c.adjusted ? change(c) : c));
        }
    }
    return { ...snapshot, combatants };
}

// One variant per foe name and adjustment, for "what would change the odds?".
export function adjustmentVariants(snapshot) {
    const names = [...new Set(snapshot.combatants.filter((c) => adjustable(c) && c.hp.value > 0).map((c) => c.name))];
    const foeCount = snapshot.combatants.filter((c) => adjustable(c) && c.hp.value > 0).length;
    const variants = [];
    for (const name of names) {
        const count = snapshot.combatants.filter((c) => adjustable(c) && c.name === name).length;
        const label = count > 1 ? `${name} ×${count}` : name;
        variants.push({ name: `Weak ${label}`, adjust: [{ kind: "weak", name }] });
        variants.push({ name: `Elite ${label}`, adjust: [{ kind: "elite", name }] });
        if (foeCount > 1) variants.push({ name: `Remove one ${name}`, adjust: [{ kind: "remove", name }] });
    }
    return variants;
}
