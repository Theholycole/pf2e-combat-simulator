// PF2e spell effects (effect items with rule elements), as the engine models
// them. The snapshot reads each effect item a creature's spells apply and
// turns its rules into a model with effectModel(); the engine applies models
// to creatures and the stat functions read their modifiers.
//
// Model: {
//   name, rounds (minutes count 10 rounds; hours and longer, Infinity),
//   modifiers: [{ on: "ac" | "fortitude" | "reflex" | "will" | "attack" | "damage" | "spell", type, value }],
//   tempHp, fastHealing, resistances, weaknesses, immunities: [type…],
//   conditions: [{ slug, value }],
//   unsupported: [rule key…]   mechanics the engine doesn't model (battle forms, new Strikes…)
//   situational: n             rules that apply only in situations the engine can't see (predicates)
//   conditional: [{ on, type, value, predicate }]   (2026-10-15) a modifier to AC, attack or damage only when its PF2e predicate holds
//                              at the roll: the attack's traits and kind, its damage type, the target's traits and conditions
//   saveBonuses: [{ saves, type, value, predicate }]   a bonus to saves only against effects its predicate names (Death Ward's +4
//                              against death and void effects), joined to the creature's saveBonuses while the effect lasts
// }

import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";

// PF2e selectors the engine reads, and what they modify.
const SELECTORS = {
    ac: ["ac"],
    "saving-throw": ["fortitude", "reflex", "will"],
    fortitude: ["fortitude"],
    reflex: ["reflex"],
    will: ["will"],
    attack: ["attack"],
    "attack-roll": ["attack"],
    "strike-attack-roll": ["attack"],
    "spell-attack-roll": ["spell"],
    "spell-dc": ["spell"],
    damage: ["damage"],
    "strike-damage": ["damage"],
    // (2026-10-14: Speed — Grasping Grave's -10 feet: the creature's Speed while it lasts.)
    "all-speeds": ["speed"],
    "land-speed": ["speed"],
    speed: ["speed"],
    // (Sleep's success: -1 status to Perception for a round — a morale check's and Read the fight's Perception, statusPenalty.)
    perception: ["perception"]
};
// Rule keys with no effect on a fight as the engine plays it.
const IGNORED = new Set(["Note", "RollOption", "Sense", "BaseSpeed", "TokenLight", "TokenImage", "TokenEffectIcon", "DexterityModifierCap", "ChoiceSet", "ItemAlteration", "SubstituteRoll", "MartialProficiency", "CriticalSpecialization", "Aura"]);

// A rule's value at the effect's rank: a number, or a formula like
// "ternary(gte(@item.level,10),3,1)" or "10 + (@item.level - 2) * 3". null when it has dice or can't be read.
export function numericValue(value, rank) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return null;
    try {
        const instances = parseDamage(value, { rank });
        if (instances.some((instance) => instance.dice.length)) return null;
        return instances.reduce((sum, instance) => sum + instance.constant, 0);
    } catch {
        return null;
    }
}

// true or false for predicates on the effect's level; null for anything else
// (roll options, traits, choices: situations the engine doesn't track).
function predicateHolds(predicate, rank) {
    if (!predicate || (Array.isArray(predicate) && !predicate.length)) return true;
    const terms = Array.isArray(predicate) ? predicate : [predicate];
    for (const term of terms) {
        const held = rankTerm(term, rank);
        if (held === null) return null;
        if (!held) return false;
    }
    return true;
}

// A term the effect's rank settles — its level as PF2e writes it ("parent:origin:item:level", "{item|level}" too), or "a character or an
// NPC", which a creature in a fight is: true or false; null for another.
const COMPARE = { gte: (a, b) => a >= b, gt: (a, b) => a > b, lte: (a, b) => a <= b, lt: (a, b) => a < b, eq: (a, b) => a === b };
const RANK_ARG = /^(?:(?:parent|item|parent:origin:item):(?:level|rank)|\{item\|level\})$/;
function rankTerm(term, rank) {
    if (!term || typeof term !== "object") return null;
    if (Array.isArray(term.or) && term.or.length && term.or.every((each) => /^self:type:(?:character|npc)$/.test(String(each)))) return true;
    const [operator, args] = Object.entries(term)[0] ?? [];
    if (!COMPARE[operator] || !Array.isArray(args) || !RANK_ARG.test(String(args[0]))) return null;
    return COMPARE[operator](rank, Number(args[1]));
}

// (2026-10-15, the user: "have it play in the simulator" — Death Ward's +4 against death and void effects.) A predicate the engine can test
// when the roll is made, normalized: the incoming effect's traits (item:trait:, a bare trait word as PF2e's older predicates write it, its
// creature's origin:trait:), the attack's kind and damage, the target's and the bearer's traits and conditions; the rank's terms settled
// now. Returns the predicate (an array), false when the rank rules it out, or null for one it can't test (a caster's choice, a mark).
const TRAIT_WORDS = new Set(["fear", "emotion", "mental", "death", "void", "poison", "disease", "curse", "possession", "sleep", "auditory", "visual", "linguistic", "illusion", "incapacitation", "fire", "cold", "electricity", "acid", "sonic", "vitality", "force", "polymorph", "light", "darkness", "olfactory", "divine", "occult", "arcane", "primal", "magical", "healing", "spirit"]);
const USE_TERM = /^(?:item:trait:|origin:trait:|item:damage:type:|item:damage:category:|target:trait:|target:condition:|self:trait:|self:condition:)[a-z0-9-]+$|^item:(?:melee|ranged|magical|type:spell)$|^item:category:unarmed$/;
function useTerm(term, rank) {
    if (typeof term === "string") {
        if (TRAIT_WORDS.has(term)) return `item:trait:${term}`;
        if (term === "unarmed") return "item:category:unarmed";
        if (term === "spell") return "item:type:spell";
        return USE_TERM.test(term) ? term : null;
    }
    if (!term || typeof term !== "object") return null;
    for (const key of ["or", "and", "nor"]) {
        if (!Array.isArray(term[key])) continue;
        const parts = term[key].map((each) => useTerm(each, rank));
        return parts.every((part) => typeof part === "string" || (part && typeof part === "object")) ? { [key]: parts } : null;
    }
    if (term.not !== undefined) {
        const part = useTerm(term.not, rank);
        return typeof part === "string" || (part && typeof part === "object") ? { not: part } : null;
    }
    return null;
}
export function usePredicate(predicate, rank) {
    const out = [];
    for (const term of Array.isArray(predicate) ? predicate : [predicate]) {
        const held = rankTerm(term, rank);
        if (held === false) return false;
        if (held === true) continue;
        const part = useTerm(term, rank);
        if (part === null) return null;
        out.push(part);
    }
    return out;
}

// Whether a predicate holds for these roll options (PF2e's terms: a string, or, and, nor, not).
export function predicateTest(predicate, options) {
    if (Array.isArray(predicate)) return predicate.every((term) => predicateTest(term, options));
    if (typeof predicate === "string") return options.has(predicate);
    if (predicate?.or) return predicate.or.some((term) => predicateTest(term, options));
    if (predicate?.and) return predicate.and.every((term) => predicateTest(term, options));
    if (predicate?.nor) return !predicate.nor.some((term) => predicateTest(term, options));
    if (predicate?.not !== undefined) return !predicateTest(predicate.not, options);
    return false;
}

// Selectors a conditional modifier can take, and what they read: the engine's statistic, and the kind of attack where the selector names it.
const CONDITIONAL_SELECTORS = {
    ac: { on: "ac" }, attack: { on: "attack" }, "attack-roll": { on: "attack" }, "strike-attack-roll": { on: "attack" },
    "melee-strike-attack-roll": { on: "attack", kind: "item:melee" }, "ranged-strike-attack-roll": { on: "attack", kind: "item:ranged" },
    damage: { on: "damage" }, "strike-damage": { on: "damage" }, "melee-strike-damage": { on: "damage", kind: "item:melee" }, "ranged-strike-damage": { on: "damage", kind: "item:ranged" }
};
const SAVE_SELECTORS = { "saving-throw": ["fortitude", "reflex", "will"], fortitude: ["fortitude"], reflex: ["reflex"], will: ["will"] };
// Rules on what a fight is made of: a conditional one the engine can't test is reported, not dropped unseen.
const FIGHT_KEYS = new Set(["FlatModifier", "DamageDice", "Resistance", "Weakness", "TempHP", "FastHealing", "Immunity"]);
const FIGHT_SELECTORS = new Set([...Object.keys(CONDITIONAL_SELECTORS), ...Object.keys(SAVE_SELECTORS), "all-speeds", "land-speed", "speed", "perception", "spell-attack-roll", "spell-dc"]);
function fightRule(rule) {
    if (!FIGHT_KEYS.has(rule.key)) return false;
    const selectors = [].concat(rule.selector ?? []);
    return !selectors.length || selectors.some((selector) => FIGHT_SELECTORS.has(selector));
}

function roundsOf(duration) {
    if (!duration || duration.value === -1 || duration.unit === "unlimited" || duration.unit === "encounter") return Infinity;
    const value = Number(duration.value) || 1;
    if (duration.unit === "rounds") return value;
    if (duration.unit === "minutes") return value * 10;
    return Infinity;
}

// A penalty or bonus an outcome gives ({ selector, value, type, duration } in
// PF2e's FlatModifier terms, as the core passes it: Bon Mot's -2 status to Will),
// as an effect model. null when the engine reads none of its selectors (Perception, skill checks).
export function modifierModel(name, modifier) {
    // (2026-10-20, Gleaming Cuirass: "attack rolls against creatures other than you" — not one the engine can scope to its attacks; left out
    // rather than on its attacks at the source too.)
    if (modifier?.against === "others") return null;
    const on = SELECTORS[modifier?.selector] ?? [];
    if (!on.length || !Number.isFinite(Number(modifier.value))) return null;
    const rounds = modifier.duration?.mode === "fixed" ? roundsOf(modifier.duration) : Infinity;
    return { name, rounds, modifiers: on.map((stat) => ({ on: stat, type: modifier.type ?? modifier.modifierType ?? "untyped", value: Number(modifier.value) })), tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
}

// item: a PF2e effect item (or its source). conditionSlug(uuid): the slug of a
// condition item a GrantItem points at, or null.
// A weakness's or resistance's exception: its type, or a custom one's definition (a vampire's "magical silver").
export function iwrException(exception) {
    if (typeof exception === "string") return exception;
    if (Array.isArray(exception?.definition)) return { definition: exception.definition, ...(exception.label ? { label: exception.label } : {}) };
    return String(exception?.type ?? exception);
}

export function effectModel(item, { rank = 1, conditionSlug = () => null } = {}) {
    const model = { name: item?.name ?? "Effect", rounds: roundsOf(item?.system?.duration), modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 };
    const unsupported = new Set();
    for (const rule of item?.system?.rules ?? []) {
        if (!rule?.key || IGNORED.has(rule.key)) continue;
        // (Shield, the spell, 2026-10-14: a magic shield — its AC and Hardness — the creature raises by casting it. The rules' predicate
        // only asks for a character or an NPC.)
        if (rule.key === "ActiveEffectLike" && /^system\.attributes\.shield(\.hardness)?$/.test(String(rule.path ?? ""))) {
            model.spellShield ??= { ac: 1, hardness: 0 };
            if (String(rule.path).endsWith(".hardness")) model.spellShield.hardness = numericValue(rule.value, rank) ?? 0;
            else if (rule.value && typeof rule.value === "object") model.spellShield.ac = Number(rule.value.ac) || 1;
            continue;
        }
        const holds = predicateHolds(rule.predicate, rank);
        if (holds === false) continue;
        // (2026-10-15: a predicate the roll can settle — kept with the rule; another, reported when the rule is about a fight.)
        let when = null;
        if (holds === null) {
            when = usePredicate(rule.predicate, rank);
            if (when === false) continue;
            if (!when || !["FlatModifier", "DamageDice", "Resistance", "Weakness"].includes(rule.key)) {
                model.situational++;
                if (fightRule(rule)) unsupported.add(`${rule.key} (conditional)`);
                continue;
            }
        }
        const value = numericValue(rule.value, rank);
        switch (rule.key) {
            case "FlatModifier": {
                const selectors = [].concat(rule.selector ?? []);
                if (value === null || selectors.some((selector) => String(selector).includes("{"))) {
                    model.situational++;
                    break;
                }
                for (const selector of selectors) {
                    // (A save bonus against what its predicate names: Death Ward's +4 against death and void effects.)
                    if (when && SAVE_SELECTORS[selector]) {
                        (model.saveBonuses ??= []).push({ saves: SAVE_SELECTORS[selector], type: rule.type ?? "untyped", value, predicate: when });
                        continue;
                    }
                    // (AC, attack or damage when the predicate holds at the roll; "melee-strike-damage" and the like, for that kind of attack.)
                    const conditional = CONDITIONAL_SELECTORS[selector];
                    if (conditional && (when || conditional.kind)) {
                        (model.conditional ??= []).push({ on: conditional.on, type: rule.type ?? "untyped", value, predicate: [...(when ?? []), ...(conditional.kind ? [conditional.kind] : [])] });
                        continue;
                    }
                    if (when) {
                        model.situational++;
                        if (fightRule({ key: rule.key, selector })) unsupported.add(`${rule.key} (conditional)`);
                        continue;
                    }
                    for (const on of SELECTORS[selector] ?? []) model.modifiers.push({ on, type: rule.type ?? "untyped", value });
                }
                break;
            }
            case "DamageDice": {
                // Extra dice on Strikes, as their average.
                const selectors = [].concat(rule.selector ?? []);
                const strikeSelector = selectors.find((selector) => ["strike-damage", "damage", "melee-strike-damage", "ranged-strike-damage"].includes(selector));
                if (!strikeSelector) break;
                const dice = Number(rule.diceNumber) || 1;
                const die = Number(String(rule.dieSize ?? "d6").replace("d", "")) || 6;
                const kind = CONDITIONAL_SELECTORS[strikeSelector].kind;
                // (Only on some attacks — unarmed Strikes, against a trait, melee ones: when its predicate holds.)
                if (when || kind) (model.conditional ??= []).push({ on: "damage", type: "dice", value: Math.round(dice * (die + 1) / 2), predicate: [...(when ?? []), ...(kind ? [kind] : [])] });
                else model.modifiers.push({ on: "damage", type: "dice", value: Math.round(dice * (die + 1) / 2) });
                break;
            }
            case "TempHP":
                if (value !== null) model.tempHp = Math.max(model.tempHp, value);
                break;
            case "FastHealing":
                // (2026-10-21: regeneration as fast healing too — Regenerate's; what turns it off, acid or fire, isn't played.)
                if (value !== null && ["fast-healing", "regeneration"].includes(rule.type ?? "fast-healing")) model.fastHealing = Math.max(model.fastHealing, value);
                break;
            case "Resistance":
            case "Weakness":
                // (I2: one for each type a rule lists; a resistance doubled against what it names.)
                // (A conditional one: its predicate joins its definition, tested against the damage's options.)
                if (value !== null && rule.type) for (const type of [].concat(rule.type)) (rule.key === "Resistance" ? model.resistances : model.weaknesses).push({ type, value, exceptions: [].concat(rule.exceptions ?? []).map(iwrException), ...(rule.definition || when ? { definition: [...[].concat(rule.definition ?? []), ...(when ?? [])] } : {}), ...(rule.key === "Resistance" && [].concat(rule.doubleVs ?? []).length ? { doubleVs: [].concat(rule.doubleVs) } : {}) });
                break;
            case "Immunity":
                if (rule.type) model.immunities.push(rule.type);
                break;
            // (S54, Sure Strike: its next attack roll twice, the better kept — takeAttackFortune uses it up.)
            case "RollTwice": {
                const selectors = [].concat(rule.selector ?? []);
                if (selectors.some((selector) => ["attack-roll", "strike-attack-roll", "spell-attack-roll", "attack"].includes(selector))) model.fortune = { on: "attack", keep: rule.keep === "lower" ? "lower" : "higher" };
                else unsupported.add(rule.key);
                break;
            }
            case "GrantItem": {
                const slug = conditionSlug(rule.uuid);
                if (!slug) {
                    unsupported.add("GrantItem");
                    break;
                }
                const badge = (rule.alterations ?? []).find((alteration) => alteration.property === "badge-value");
                model.conditions.push({ slug, value: badge ? numericValue(badge.value, rank) : null });
                break;
            }
            default:
                unsupported.add(rule.key);
        }
    }
    model.unsupported = [...unsupported];
    return model;
}

// --- Applying models -----------------------------------------------------------

let nextEffectId = 1;

// The net modifier from a creature's effects to one statistic, without status
// penalties (the condition rules take the worst status penalty: effectStatusPenalty).
// options: the roll's options, for the conditional modifiers (without them, those are left out).
export function effectBonus(c, on, options = null) {
    if (!c.effects?.length) return 0;
    const byType = new Map();
    for (const effect of c.effects) {
        const conditional = options && effect.model.conditional ? effect.model.conditional.filter((modifier) => modifier.on === on && predicateTest(modifier.predicate, options)) : null;
        for (const modifier of conditional?.length ? [...effect.model.modifiers, ...conditional] : effect.model.modifiers) {
            if (modifier.on !== on) continue;
            if (modifier.type === "status" && modifier.value < 0) continue;
            if (modifier.type === "untyped" || modifier.type === "dice") {
                byType.set(`${modifier.type}:${byType.size}`, { high: modifier.value, low: 0 });
                continue;
            }
            const entry = byType.get(modifier.type) ?? { high: 0, low: 0 };
            if (modifier.value > 0) entry.high = Math.max(entry.high, modifier.value);
            else entry.low = Math.min(entry.low, modifier.value);
            byType.set(modifier.type, entry);
        }
    }
    let total = 0;
    for (const entry of byType.values()) total += entry.high + entry.low;
    return total;
}

// Whether any effect on it has conditional modifiers (the roll's options are worth making).
export function hasConditional(c) {
    return Boolean(c?.effects?.some((effect) => effect.model?.conditional?.length));
}

// A Strike's roll options for the conditional modifiers: its own (traits, runes, material — strikeContext's, its creature's traits as
// origin:trait), its kind and damage, the target's traits and conditions, the attacker's traits and conditions.
export function strikeRollOptions(attacker, strike, target, context) {
    const options = new Set(context ?? []);
    options.add(strike?.melee ? "item:melee" : "item:ranged");
    for (const part of strike?.damage ?? []) {
        options.add(`item:damage:type:${part.type}`);
        if (["bludgeoning", "piercing", "slashing"].includes(part.type)) options.add("item:damage:category:physical");
    }
    for (const trait of target?.traits ?? []) options.add(`target:trait:${trait}`);
    for (const [slug, held] of Object.entries(target?.cond ?? {})) if (held) options.add(`target:condition:${slug === "offGuard" ? "off-guard" : slug}`);
    for (const trait of attacker?.traits ?? []) options.add(`origin:trait:${trait}`);
    return options;
}

// The worst status penalty from a creature's effects to one statistic, as a positive number.
export function effectStatusPenalty(c, on) {
    if (!c.effects?.length) return 0;
    let worst = 0;
    for (const effect of c.effects) {
        for (const modifier of effect.model.modifiers) {
            if (modifier.on === on && modifier.type === "status" && modifier.value < 0) worst = Math.max(worst, -modifier.value);
        }
    }
    return worst;
}

function withDefences(target, effect, add) {
    const tag = (entry) => ({ ...entry, effectId: effect.id });
    // (Speed: changed while it lasts, never below 5 feet; the change it made undone with it.)
    const speed = (effect.model.modifiers ?? []).filter((modifier) => modifier.on === "speed").reduce((sum, modifier) => sum + modifier.value, 0);
    if (speed && add) {
        const before = target.speed ?? 25;
        target.speed = Math.max(5, before + speed);
        effect.speedDelta = target.speed - before;
    } else if (effect.speedDelta && !add) target.speed = Math.max(5, (target.speed ?? 25) - effect.speedDelta);
    if (add) {
        if (effect.model.resistances.length) target.resistances = [...(target.resistances ?? []), ...effect.model.resistances.map(tag)];
        if (effect.model.weaknesses.length) target.weaknesses = [...(target.weaknesses ?? []), ...effect.model.weaknesses.map(tag)];
        if (effect.model.immunities.length) target.immunities = [...(target.immunities ?? []), ...effect.model.immunities];
    } else {
        target.resistances = (target.resistances ?? []).filter((entry) => entry.effectId !== effect.id);
        target.weaknesses = (target.weaknesses ?? []).filter((entry) => entry.effectId !== effect.id);
        if (effect.model.immunities.length) {
            const remove = [...effect.model.immunities];
            target.immunities = (target.immunities ?? []).filter((type) => {
                const index = remove.indexOf(type);
                if (index < 0) return true;
                remove.splice(index, 1);
                return false;
            });
        }
    }
    // The Strike damage cache keys on a creature's defences.
    target.defenceId = undefined;
}

export function removeEffect(target, effect) {
    target.effects = (target.effects ?? []).filter((other) => other !== effect);
    // (Its save bonuses against what it names, gone with it.)
    if (effect.model?.saveBonuses?.length) target.saveBonuses = (target.saveBonuses ?? []).filter((bonus) => bonus.effectId !== effect.id);
    withDefences(target, effect, false);
    // A Strike the effect gave (Tiger Stance's tiger claw) goes with it.
    if ((target.strikes ?? []).some((strike) => strike.fromEffect === effect.key)) target.strikes = target.strikes.filter((strike) => strike.fromEffect !== effect.key);
}

// A roll-twice on its next attack roll (Sure Strike, S54): "higher" or "lower", the effect used up; null without one.
export function takeAttackFortune(c) {
    const effect = (c.effects ?? []).find((entry) => entry.model?.fortune?.on === "attack");
    if (!effect) return null;
    removeEffect(c, effect);
    return effect.model.fortune.keep;
}

// Puts an effect on a creature; the same effect again replaces it. A finite
// duration ends it at the start of the source's turn that many rounds later.
// applyCondition: the spells layer's, for the conditions the effect grants.
// counter: { dc, rank, spell } — what a counteract (Dispel Magic) checks against (counteract.js).
export function applyEffect(state, target, model, source, { applyCondition, key = model.name, counter = null } = {}) {
    for (const existing of (target.effects ?? []).filter((effect) => effect.key === key)) removeEffect(target, existing);
    const effect = { id: nextEffectId++, key, model, sourceId: source?.id ?? null, ...(counter ? { counter } : {}) };
    target.effects = [...(target.effects ?? []), effect];
    withDefences(target, effect, true);
    // (Death Ward's +4 against death and void effects: the creature's save bonuses, while it lasts.)
    if (model.saveBonuses?.length) target.saveBonuses = [...(target.saveBonuses ?? []), ...model.saveBonuses.map((bonus) => ({ ...bonus, effectId: effect.id }))];
    if (model.tempHp > 0) target.hp.temp = Math.max(target.hp.temp ?? 0, model.tempHp);
    const duration = Number.isFinite(model.rounds) ? { mode: "fixed", value: model.rounds, unit: "rounds" } : null;
    for (const condition of model.conditions) applyCondition?.(state, target, condition.slug, condition.value, duration, source);
    if (Number.isFinite(model.rounds)) (target.timers ??= []).push({ effect, round: state.round + model.rounds, turnOf: source?.id ?? target.id });
    return effect;
}

// How much an effect helps the creature it's on, in rounds of that creature's
// threat (negative for a hindrance). conditionHarm(slug, value, rounds) is the
// spells layer's condition weighting. strikeShare: the part of the creature's
// threat its Strikes make (1 for a warrior, little for a caster), which is all
// an attack or damage bonus, or quickened's extra Strike or Stride, can help.
export function effectBenefit(model, target, conditionHarm, strikeShare = 1) {
    const rounds = Math.min(3, model.rounds);
    let benefit = 0;
    const strikes = (target.strikes ?? []).length > 0 ? strikeShare : 0;
    for (const modifier of model.modifiers) {
        const per = { ac: 0.08, fortitude: 0.01, reflex: 0.01, will: 0.01, attack: 0.1 * strikes, damage: 0.04 * strikes, spell: 0.05 * (1 - strikes), speed: 0.003 }[modifier.on] ?? 0;
        benefit += per * modifier.value * rounds;
    }
    if (target.hp?.max > 0) {
        benefit += model.tempHp / target.hp.max;
        benefit += (model.fastHealing * rounds) / target.hp.max;
    }
    for (const entry of model.resistances) benefit += 0.02 * entry.value * rounds;
    for (const entry of model.weaknesses) benefit -= 0.03 * entry.value * rounds;
    benefit += 0.1 * model.immunities.length;
    const duration = { mode: "fixed", value: rounds, unit: "rounds" };
    for (const condition of model.conditions) {
        benefit += condition.slug === "quickened" ? 0.3 * rounds * Math.max(0.2, strikes) : -conditionHarm(condition.slug, condition.value, duration);
    }
    // (S54: one attack roll twice — about +4 on it, a Strike's or a spell attack's.)
    if (model.fortune?.on === "attack") benefit += (model.fortune.keep === "higher" ? 1 : -1) * (0.4 * strikes + 0.2 * (1 - strikes));
    // A form that keeps it from attacking or casting (Vapor Form): that part of its threat, lost for those rounds.
    if (model.noAttacks) benefit -= strikes * rounds;
    if (model.noSpells) benefit -= (1 - strikes) * rounds;
    return benefit;
}
