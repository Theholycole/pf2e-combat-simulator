// Strike damage: rolling, expectations, and resistances, weaknesses and
// immunities.
//
// A damage part is { dice, die, bonus, multiplier, type, persistent, precision }
// and is worth (dice + bonus) × multiplier. A strike's first part is its weapon
// dice, which enfeebled, deadly and fatal act on. A strike taken from PF2e
// carries critDamage, PF2e's own critical formula, which is used as-is.

const PHYSICAL = new Set(["bludgeoning", "piercing", "slashing"]);

function averageDice(dice, die) {
    return dice * (die + 1) / 2;
}

function rollDice(rng, dice, die) {
    let total = 0;
    for (let i = 0; i < dice; i++) total += rng.die(die);
    return total;
}

// The parts to use and the extra multiplier for this degree.
function partsFor(strike, critical) {
    if (!critical) return { parts: strike.damage, factor: 1, extras: false };
    if (strike.critDamage) return { parts: strike.critDamage, factor: 1, extras: false };
    const parts = strike.fatal
        ? strike.damage.map((part, index) => (index === 0 ? { ...part, die: strike.fatal } : part))
        : strike.damage;
    return { parts, factor: 2, extras: true };
}

function build(strike, critical, penalty, roll) {
    const { parts, factor, extras } = partsFor(strike, critical);
    const result = [];
    let first = true;
    for (const part of parts) {
        // Splash damage isn't doubled on a critical hit.
        const multiplier = (part.multiplier ?? 1) * (part.splash ? 1 : factor);
        let base = (part.dice ? roll(part.dice, part.die) : 0) + (part.bonus ?? 0);
        if (first && penalty) base -= penalty;
        if (first) base = Math.max(1, base);
        first = false;
        result.push({
            type: part.type,
            amount: base * multiplier,
            persistent: !!part.persistent,
            precision: !!part.precision,
            ...(part.splash ? { splash: true } : {}),
            dice: part.dice,
            die: part.die,
            bonus: part.bonus ?? 0,
            multiplier
        });
    }
    if (extras && result.length) {
        const weaponType = strike.damage[0].type;
        if (strike.deadly) result.push({ type: weaponType, amount: roll(strike.deadly.dice, strike.deadly.die), persistent: false, precision: false });
        if (strike.fatal) result.push({ type: weaponType, amount: roll(1, strike.fatal), persistent: false, precision: false });
    }
    return result;
}

// Returns damage instances as [{ type, amount, persistent, precision, ... }].
export function rollStrikeDamage(rng, strike, { critical = false, penalty = 0 } = {}) {
    return build(strike, critical, penalty, (dice, die) => rollDice(rng, dice, die));
}

export function expectedStrikeDamage(strike, { critical = false, penalty = 0 } = {}) {
    return build(strike, critical, penalty, averageDice);
}

function matchesType(entryType, damageType, precision) {
    if (entryType === damageType) return true;
    if (entryType === "all-damage" || entryType === "all") return true;
    if (entryType === "physical" && PHYSICAL.has(damageType)) return true;
    if (entryType === "precision" && precision) return true;
    return false;
}

function exceptionApplies(entry, damageType) {
    return Array.isArray(entry.exceptions) && entry.exceptions.includes(damageType);
}

// Applies immunities, weaknesses and resistances. Instances of the same type
// are combined first, as PF2e does. Persistent instances are left out of the
// immediate total and returned separately.
export function adjustDamage(defender, instances) {
    const immediate = new Map();
    const persistent = [];
    for (const instance of instances) {
        if (instance.persistent) {
            persistent.push(instance);
            continue;
        }
        const key = instance.precision ? `${instance.type}|precision` : instance.type;
        const entry = immediate.get(key) ?? { type: instance.type, precision: instance.precision, amount: 0 };
        entry.amount += instance.amount;
        immediate.set(key, entry);
    }
    let total = 0;
    for (const entry of immediate.values()) total += adjustInstance(defender, entry.type, entry.amount, entry.precision);
    return { total: Math.max(0, total), persistent };
}

// A concussive weapon (firearms): piercing or bludgeoning, whichever the
// defender resists less. Other types stay as they are.
export function concussiveType(defender, type, amount, precision = false) {
    if (type !== "piercing" && type !== "bludgeoning") return type;
    return adjustInstance(defender, "bludgeoning", amount, precision) > adjustInstance(defender, "piercing", amount, precision) ? "bludgeoning" : "piercing";
}

// Void healing (PF2e's hp.negativeHealing; undead without the flag read):
// vitality damage harms only creatures that have it, void damage only those that don't.
export function hasVoidHealing(defender) {
    return defender.voidHealing ?? (defender.traits ?? []).includes("undead");
}

export function adjustInstance(defender, type, amount, precision = false) {
    if (type === "vitality" && !hasVoidHealing(defender)) return 0;
    if (type === "void" && hasVoidHealing(defender)) return 0;
    const immunities = defender.immunities ?? [];
    if (immunities.includes(type) || (precision && immunities.includes("precision"))) return 0;
    if (PHYSICAL.has(type) && immunities.includes("physical")) return 0;
    let result = amount;
    let weakness = 0;
    for (const entry of defender.weaknesses ?? []) {
        if (matchesType(entry.type, type, precision) && !exceptionApplies(entry, type)) weakness = Math.max(weakness, entry.value);
    }
    let resistance = 0;
    for (const entry of defender.resistances ?? []) {
        if (matchesType(entry.type, type, precision) && !exceptionApplies(entry, type)) resistance = Math.max(resistance, entry.value);
    }
    if (result > 0) result += weakness;
    result -= resistance;
    return Math.max(0, result);
}

export function averagePersistent(instance) {
    if (instance.dice && instance.die) return (averageDice(instance.dice, instance.die) + (instance.bonus ?? 0)) * (instance.multiplier ?? 1);
    return instance.amount ?? 0;
}

export function rollPersistent(rng, instance) {
    if (instance.dice && instance.die) return (rollDice(rng, instance.dice, instance.die) + (instance.bonus ?? 0)) * (instance.multiplier ?? 1);
    return instance.amount ?? 0;
}
