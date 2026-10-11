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
            spec.multiStrikes = [...(spec.multiStrikes ?? []), { name, actions: plan.actions, strikes: [...plan.strikes], ...(plan.sameMap ? { sameMap: true } : {}), ...(plan.sameTarget ? { sameTarget: true } : {}), ...(plan.oncePerTurn ? { oncePerTurn: true } : {}), ...(plan.each ? { each: true } : {}), ...(Number.isFinite(plan.max) ? { max: plan.max } : {}), ...(plan.grab ? { grab: true } : {}), ...(plan.penalty ? { penalty: plan.penalty } : {}), ...(plan.requires ? { requires: plan.requires } : {}), ...(plan.after?.length ? { after: plan.after.map((entry) => ({ ...entry })) } : {}) }];
            return true;
        case "charge":
            spec.charges = [...(spec.charges ?? []), { name, actions: plan.actions, strides: plan.strides, strike: plan.strike ?? null, attackBonus: plan.attackBonus ?? 0, damage: plan.damage ?? null, ...(plan.fatal ? { fatal: plan.fatal } : {}), ...(plan.deadly ? { deadly: plan.deadly } : {}), ...(plan.halfDamage ? { halfDamage: true } : {}) }];
            return true;
        // A monster's Retributive Strike (the glossary's): a champion's, the ally's resistance 2 + the monster's level.
        case "retributive-strike":
            if (!Number.isFinite(plan.resistance)) return false;
            spec.championReaction = { slug: "retributive-strike", name, self: false, resistance: plan.resistance, dice: 1 };
            return true;
        // Slow, Weapon Supremacy: a condition it always has; "can't use reactions" (B50).
        case "permanent-condition":
            spec.permanent = [...(spec.permanent ?? []), ...(plan.conditions ?? [])];
            if (plan.noReactions) spec.noReactions = true;
            return true;
        // A rage or frenzy on itself (B64): an effect with its modifiers and temporary Hit Points, extra dice on its melee
        // Strikes; Fanatical Frenzy only once it's hurt.
        case "self-effect": {
            // Its extra damage on its melee Strikes (a rage's), or (B69) on the Strikes it names ("her fangs Strikes deal an
            // additional 2d8 sonic damage"), its melee ones, or all of them: "2d8[sonic]", "1d10[persistent,bleed]", "2[acid]",
            // "2d8[precision]", "die" (one more of the Strike's own dice).
            // (The Strikes may come after the abilities: the parts are kept, and resolved again as the fight is prepared.)
            const formulas = plan.damage ?? (plan.extraDice ? [plan.extraDice] : []);
            const strikeParts = formulas.length ? { formulas: [...formulas], strike: plan.strike ?? null, scope: plan.damage ? (plan.melee ? "melee" : "all") : "melee" } : null;
            const strikeDeltas = strikeParts && spec.strikes?.length ? deltasFor(spec.strikes, strikeParts) : null;
            // (A stance lasts until another ends it.)
            const rounds = plan.stance ? Infinity : plan.model?.rounds ?? 10;
            const model = { name, rounds, modifiers: [...(plan.model?.modifiers ?? [])], tempHp: plan.model?.tempHp ?? 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...(strikeParts ? { strikeParts } : {}), ...(strikeDeltas ? { strikeDeltas } : {}), ...(plan.noConcentrate ? { noConcentrate: true } : {}) };
            spec.selfEffects = [...(spec.selfEffects ?? []), { name, actions: plan.actions ?? 1, model, ...(plan.stance ? { stance: true } : {}), ...(plan.whenHurt ? { whenHurt: true } : {}), ...(plan.trigger ? { trigger: { ...plan.trigger } } : {}) }];
            return true;
        }
        // Golem Antimagic (B56): what others' magic does to it.
        case "golem-antimagic":
            spec.golemAntimagic = { harmed: plan.harmed ?? null, healed: plan.healed ?? null, slowed: plan.slowed ?? null };
            return true;
        // Steady Spellcasting (B55): a flat check against a reaction's disruption.
        case "steady-spellcasting":
            spec.steadySpellcasting = Number(plan.dc) || 15;
            return true;
        case "momentum":
            spec.momentum = { recharges: [...(plan.recharges ?? [])] };
            return true;
        // Reactions: Nimble Dodge and Retract Body, Challenge Fate, Twisting Tail, Death Frenzy.
        case "ac-reaction":
            spec.acReaction = { value: plan.value, when: plan.when, name, ...(plan.against ? { against: plan.against } : {}) };
            return true;
        case "attack-misfortune":
            spec.misfortuneReaction = { name };
            return true;
        // Shadow Evade, Scintillating Defense: the attacker's flat check against the hit, a miss on a failure (B41).
        case "conceal-reaction":
            if (!Number.isFinite(plan.dc)) return false;
            spec.concealReaction = { name, dc: plan.dc, ranged: !!plan.ranged };
            return true;
        // Resilient Form, Cushioned Blow: a critical hit on it becomes a normal hit on a flat check (a reaction, or a
        // free action with its uses a day).
        // Wished Away, Withhold Death (B60): resistance to all damage against a critical hit on it.
        case "crit-resistance":
            spec.critResistance = { name, value: Number(plan.value) || 0 };
            return true;
        case "crit-downgrade":
            if (!Number.isFinite(plan.dc)) return false;
            spec.critDowngrade = { name, dc: plan.dc ?? null, ...(Number.isFinite(plan.uses) ? { uses: plan.uses } : {}), ...(plan.collapse ? { collapse: true } : {}) };
            return true;
        case "reaction-strike":
            spec.reactionStrikes = [...(spec.reactionStrikes ?? []), { name, triggers: [...plan.triggers], strike: plan.strike, penalty: plan.penalty ?? 0, disrupts: !!plan.disrupts }];
            return true;
        case "death-strike":
            spec.deathStrike = { name, strike: plan.strike ?? null };
            return true;
        // Wrestle, Intimidating Strike, Rhinoceros Charge: a Strike (after Strides) with more on a hit.
        case "strike-activity":
            spec.strikeActivities = [...(spec.strikeActivities ?? []), {
                name,
                actions: plan.actions,
                strides: plan.strides,
                strike: plan.strike ?? null,
                attackBonus: plan.attackBonus ?? 0,
                damageBonus: plan.damageBonus ?? 0,
                damage: plan.damage ?? null,
                offGuard: !!plan.offGuard,
                requires: plan.requires ?? null,
                oncePerFight: !!plan.oncePerFight,
                ...(plan.countsAs > 1 ? { countsAs: plan.countsAs } : {}),
                ...(plan.noMap ? { noMap: true } : {}),
                ...(plan.oncePerTurn ? { oncePerTurn: true } : {}),
                ...(plan.extraWeaponDice ? { extraWeaponDice: plan.extraWeaponDice } : {}),
                // A follow-up's Strike (B68): only straight after a Strike that fits; previousMap, at that Strike's penalty.
                ...(plan.after ? { after: { ...plan.after } } : {}),
                ...(plan.previousMap ? { previousMap: true } : {}),
                ...(plan.fatal ? { fatal: plan.fatal } : {}),
                ...(plan.deadly ? { deadly: plan.deadly } : {}),
                ...(plan.halfDamage ? { halfDamage: true } : {}),
                onHit: plan.onHit,
                riderSpell: plan.onHit?.save ? { name, plan: plan.onHit.save, castRank: 1, pool: null, kind: "ability" } : null
            }];
            return true;
        default:
            return false;
    }
}

// Whether the creature's last action was a Strike a follow-up needs (B68): after { strike, melee, on } against its last Strike
// this turn (its name, melee or not, its degree), as its action just before.
const DEGREES = ["criticalFailure", "failure", "success", "criticalSuccess"];
export function followsStrike(state, c, after) {
    const last = c.lastStrike;
    if (!last || last.round !== state.round || last.action !== (c.actionCount ?? 0) - 1) return false;
    if (!(after.on ?? ["success", "criticalSuccess"]).includes(DEGREES[last.degree])) return false;
    if (after.melee && !last.melee) return false;
    if (!after.strike) return true;
    const name = String(last.strike ?? "").toLowerCase();
    return name === after.strike || name.startsWith(after.strike) || after.strike.startsWith(name) || name.includes(after.strike);
}

// A self-effect's extra damage on the creature's Strikes (B69), as strikeDeltas by Strike name: parts { formulas, strike, scope }
// (scope "melee" or "all" when it names no Strike). Formulas: "2d8[sonic]", "1d10[persistent,bleed]", "2[acid]",
// "2d8[precision]", "die" (one more of the Strike's own dice).
export function deltasFor(strikes, parts) {
    const named = parts.strike ? strikeNamed({ strikes }, parts.strike) : -1;
    const chosen = strikes.filter((strike, index) => (parts.strike ? index === named : parts.scope === "all" || strike.melee));
    const partOf = (formula, strike) => {
        if (formula === "die") return { dice: 1, die: strike.damage?.[0]?.die ?? 6, bonus: 0, multiplier: 1, type: strike.damage?.[0]?.type, precision: false, persistent: false };
        const match = /^\(?(?:(\d+)d(\d+))?\+?(\d+)?\)?\[([\w,]+)\]$/.exec(String(formula).replace(/\s+/g, ""));
        if (!match || (!match[1] && !match[3])) return null;
        const kinds = match[4].split(",");
        const type = kinds.find((kind) => !["persistent", "precision"].includes(kind));
        return { dice: Number(match[1] ?? 0), die: Number(match[2] ?? 0), bonus: Number(match[3] ?? 0), multiplier: 1, type: type && type !== "untyped" ? type : strike.damage?.[0]?.type, precision: kinds.includes("precision"), persistent: kinds.includes("persistent") };
    };
    return Object.fromEntries(chosen.map((strike) => [strike.name, parts.formulas.map((formula) => partOf(formula, strike)).filter(Boolean)]));
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
    // A Strike with no name ("makes two unarmed Strikes"): its best melee Strike.
    const best = () => (c.strikes ?? []).reduce((found, strike, index) => (strike.melee && (found < 0 || strike.bonus > c.strikes[found].bonus) ? index : found), -1);
    const indices = ability.strikes.map((name) => (name ? strikeNamed(c, name) : best()));
    if (indices.some((index) => index < 0)) return null;
    return indices.sort((a, b) => (c.strikes[a].agile ? 1 : 0) - (c.strikes[b].agile ? 1 : 0));
}

// The Strike a charge or Strike activity makes: its bonus to the attack roll
// (for moving 20 feet, or against a target off-guard to it), its bigger damage
// ("the Strike's damage is increased to 3d10+20"), or a bonus to damage.
// Cover Fire: a creature ducks (+2 AC against the shot, then −2 to its own ranged
// attacks) unless its best attack is ranged, when the penalty would cost it more.
export function ducksFromCoverFire(target) {
    const average = (strike) => (strike.damage ?? []).reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0) + (strike.bonus ?? 0) / 2;
    const best = [...(target.strikes ?? [])].sort((a, b) => average(b) - average(a))[0];
    return !best || best.melee;
}

export function chargeStrike(strike, charge) {
    const attackBonus = (charge.attackBonus ?? 0) + (charge.offGuard ? 2 : 0);
    if (!attackBonus && !charge.damage && !charge.damageBonus && !charge.extraWeaponDice && !charge.finisher && !charge.fatal && !charge.deadly && !charge.halfDamage) return strike;
    const changed = { ...strike, name: `${strike.name} (${charge.name})`, bonus: strike.bonus + attackBonus, ...(charge.finisher ? { finisher: charge.finisher } : {}) };
    if (charge.damageBonus) changed.damage = strike.damage.map((part, index) => (index === 0 ? { ...part, bonus: (part.bonus ?? 0) + charge.damageBonus } : part));
    // Vicious Swing: extra dice of the weapon's own damage (PF2e's critical formula would leave them out).
    if (charge.extraWeaponDice) {
        changed.damage = changed.damage.map((part, index) => (index === 0 ? { ...part, dice: (part.dice ?? 0) + charge.extraWeaponDice } : part));
        delete changed.critDamage;
    }
    const dice = charge.damage ? /(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/.exec(charge.damage) : null;
    if (dice) {
        const type = /\[([a-z]+)\]/.exec(charge.damage)?.[1] ?? strike.damage[0]?.type ?? "untyped";
        changed.damage = [{ dice: Number(dice[1]), die: Number(dice[2]), bonus: (dice[3] === "-" ? -1 : 1) * Number(dice[4] ?? 0), multiplier: 1, type, persistent: false, precision: false }, ...strike.damage.slice(1)];
    }
    // (B69: "This Strike gains the fatal d12 trait", "the deadly d4 trait for this attack"; "The Strike deals half damage".)
    if (charge.fatal) changed.fatal = charge.fatal;
    if (charge.deadly) changed.deadly = { dice: 1, die: charge.deadly };
    if (charge.halfDamage) changed.damage = (changed.damage ?? strike.damage).map((part) => ({ ...part, multiplier: (part.multiplier ?? 1) * 0.5 }));
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

// PF2e's standard DC for a level (level −1 to 25).
const LEVEL_DCS = [13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];
export function levelDC(level) {
    return LEVEL_DCS[Math.max(0, Math.min(LEVEL_DCS.length - 1, (level ?? 0) + 1))];
}

// Whether a creature can use a reaction now (confused creatures can't).
export function canReact(c) {
    return c.status === "active" && !c.reactionUsed && !c.noReactions && !c.cond.confused && !c.cond.unconscious && !c.cond.paralyzed && !c.cond.asleep && c.acts !== false;
}
