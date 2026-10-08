// Monster abilities the engine plays as its own rules. The ability module
// compiles them as { builtin } (no plan to resolve): Ferocity, Rend, Sneak
// Attack, Pack Attack, Regeneration, Fast Healing, Draconic Frenzy, Pounce,
// Draconic Momentum, bonuses to saves against magic, and reactions (Nimble
// Dodge, Challenge Fate, Twisting Tail, Death Frenzy).

const SIZES = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
const SIZE_WORDS = { tiny: "tiny", sm: "small", med: "medium", lg: "large", huge: "huge", grg: "gargantuan" };

// A size ("med", "medium", "lg" …) as a number: tiny 0 … gargantuan 5; medium when unknown.
export function sizeRank(size) {
    const index = SIZES.indexOf(SIZE_WORDS[size] ?? size);
    return index < 0 ? 2 : index;
}

// Adds an ability compiled as { builtin } to a combatant spec (the snapshot's
// or a test's). name: the ability's name. Returns false for a builtin the
// engine doesn't play.
export function addBuiltin(spec, plan, name) {
    switch (plan?.builtin) {
        case "ferocity":
            spec.reactions = { ...(spec.reactions ?? {}), ferocity: true };
            return true;
        case "rend":
            spec.rend = { strike: plan.strike ?? null };
            return true;
        case "attack-of-opportunity":
        case "reactive-strike":
            spec.reactions = { ...(spec.reactions ?? {}), aoo: true };
            return true;
        case "shield-block":
            spec.reactions = { ...(spec.reactions ?? {}), shieldBlock: true };
            return true;
        // A rock is one of the creature's Strikes already; Change Shape changes nothing in a fight.
        case "throw-rock":
        case "no-effect":
            return true;
        case "strike-extra":
            spec.strikeExtras = [...(spec.strikeExtras ?? []), ...plan.extras.map((extra) => ({ ...extra, source: name }))];
            return true;
        case "save-bonus":
            spec.saveBonuses = [...(spec.saveBonuses ?? []), ...plan.bonuses];
            return true;
        case "regeneration":
            spec.regeneration = { value: plan.value, deactivatedBy: [...(plan.deactivatedBy ?? [])] };
            return true;
        case "fast-healing":
            spec.fastHealing = Math.max(spec.fastHealing ?? 0, plan.value);
            return true;
        case "multi-strike":
            spec.multiStrikes = [...(spec.multiStrikes ?? []), { name, actions: plan.actions, strikes: [...plan.strikes] }];
            return true;
        case "charge":
            spec.charges = [...(spec.charges ?? []), { name, actions: plan.actions, strides: plan.strides, strike: plan.strike ?? null, attackBonus: plan.attackBonus ?? 0, damage: plan.damage ?? null }];
            return true;
        case "momentum":
            spec.momentum = { recharges: [...(plan.recharges ?? [])] };
            return true;
        // Reactions: Nimble Dodge and Retract Body, Challenge Fate, Twisting Tail, Death Frenzy.
        case "ac-reaction":
            spec.acReaction = { value: plan.value, when: plan.when, name };
            return true;
        case "attack-misfortune":
            spec.misfortuneReaction = { name };
            return true;
        case "reaction-strike":
            spec.reactionStrikes = [...(spec.reactionStrikes ?? []), { name, triggers: [...plan.triggers], strike: plan.strike, penalty: plan.penalty ?? 0, disrupts: !!plan.disrupts }];
            return true;
        case "death-strike":
            spec.deathStrike = { name, strike: plan.strike ?? null };
            return true;
        default:
            return false;
    }
}

// The index of the creature's Strike a text names ("claw" for "Claw", "fangs" for "Fangs").
export function strikeNamed(c, name) {
    if (!name) return -1;
    const wanted = name.toLowerCase();
    const strikes = c.strikes ?? [];
    let index = strikes.findIndex((strike) => strike.name.toLowerCase() === wanted);
    if (index < 0) index = strikes.findIndex((strike) => strike.name.toLowerCase().startsWith(wanted) || wanted.startsWith(strike.name.toLowerCase()));
    if (index < 0) index = strikes.findIndex((strike) => strike.name.toLowerCase().includes(wanted));
    return index;
}

// The Strikes of a multi-Strike ability (Draconic Frenzy), as indices, in the
// order that loses least to the multiple attack penalty (agile ones last).
// null when one of them isn't among the creature's Strikes.
export function multiStrikeOrder(c, ability) {
    const indices = ability.strikes.map((name) => strikeNamed(c, name));
    if (indices.some((index) => index < 0)) return null;
    return indices.sort((a, b) => (c.strikes[a].agile ? 1 : 0) - (c.strikes[b].agile ? 1 : 0));
}

// The Strike a charge makes: its bonus to the attack roll for moving 20 feet, or
// its bigger damage ("the Strike's damage is increased to 3d10+20").
export function chargeStrike(strike, charge) {
    if (!charge.attackBonus && !charge.damage) return strike;
    const changed = { ...strike, name: `${strike.name} (${charge.name})`, bonus: strike.bonus + (charge.attackBonus ?? 0) };
    const dice = charge.damage ? /(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/.exec(charge.damage) : null;
    if (dice) {
        const type = /\[([a-z]+)\]/.exec(charge.damage)?.[1] ?? strike.damage[0]?.type ?? "untyped";
        changed.damage = [{ dice: Number(dice[1]), die: Number(dice[2]), bonus: (dice[3] === "-" ? -1 : 1) * Number(dice[4] ?? 0), multiplier: 1, type, persistent: false, precision: false }, ...strike.damage.slice(1)];
    }
    return changed;
}

// Roll options of a spell or ability, for predicates such as "item:magical" or "item:trait:mental".
const TRADITIONS = new Set(["arcane", "divine", "occult", "primal"]);

export function sourceOptions(spell) {
    const traits = [...(spell?.plan?.traits ?? []), ...(spell?.tradition ? [spell.tradition] : [])];
    const options = new Set();
    for (const trait of traits) {
        options.add(trait);
        options.add(`item:trait:${trait}`);
    }
    // Spells are magical; an ability is when it has the magical trait or a tradition's.
    const ability = spell?.kind === "ability" || spell?.kind === "basic";
    if (!ability || traits.some((trait) => trait === "magical" || TRADITIONS.has(trait))) {
        options.add("magical");
        options.add("item:magical");
    }
    return options;
}

// PF2e's predicate syntax: an array (all), { or }, { and }, { not }, or a roll option.
export function testPredicate(predicate, options) {
    if (Array.isArray(predicate)) return predicate.every((term) => testPredicate(term, options));
    if (typeof predicate === "string") return options.has(predicate);
    if (predicate?.or) return predicate.or.some((term) => testPredicate(term, options));
    if (predicate?.and) return predicate.and.every((term) => testPredicate(term, options));
    if (predicate?.not !== undefined) return !testPredicate(predicate.not, options);
    return false;
}

// A creature's bonus to one save against a spell or ability (+1 status to all saves vs. magic):
// the highest of each bonus type, summed.
export function saveBonusAgainst(c, save, spell) {
    if (!c.saveBonuses?.length || !spell) return 0;
    const options = sourceOptions(spell);
    const best = new Map();
    let untyped = 0;
    for (const bonus of c.saveBonuses) {
        if (!bonus.saves.includes(save) || !testPredicate(bonus.predicate, options)) continue;
        if (bonus.type === "untyped") untyped += bonus.value;
        else best.set(bonus.type, Math.max(best.get(bonus.type) ?? 0, bonus.value));
    }
    return untyped + [...best.values()].reduce((sum, value) => sum + value, 0);
}

export function isUndead(c) {
    return (c.traits ?? []).includes("undead") || !!c.voidHealing;
}

// Whether an extra-damage ability applies to this hit. offGuard: the target is
// off-guard to the attack; packAllies: the attacker's allies within reach of the target.
export function extraApplies(extra, target, { offGuard, packAllies }) {
    switch (extra.when) {
        case "off-guard":
            return offGuard;
        case "pack":
            return packAllies >= 2;
        case "living":
            return !isUndead(target) && !(target.traits ?? []).includes("construct");
        case "undead":
            return isUndead(target);
        case "frightened":
            return (target.cond?.frightened ?? 0) > 0;
        default:
            return false;
    }
}

// Regeneration works unless damage of a listed type turned it off.
export function regenerating(c) {
    return !!c.regeneration && !c.regenerationOff;
}

// Whether a creature can use a reaction now (confused creatures can't).
export function canReact(c) {
    return c.status === "active" && !c.reactionUsed && !c.cond.confused && !c.cond.unconscious && !c.cond.paralyzed && !c.cond.asleep && c.acts !== false;
}
