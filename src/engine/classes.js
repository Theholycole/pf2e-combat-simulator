// Every class's PC (2026-11-02; the user: "Get the simulator working with all classes"): a PC of any of PF2e's 29 classes at a level from
// 1 to 20, built like the standard party's four (party.js): Player Core's and the other rulebooks' proficiency steps, GM Core's runes, a
// typical build's weapon and armor, and the class's own engine as the simulation plays it (the same fields scripts/snapshot.js reads from a
// real character: Rage, Hunt Prey, Flurry of Blows, panache, Devise a Stratagem, Exploit Vulnerability, Overdrive, Spellstrike, tactics,
// the divine spark, a champion's reaction, Taunt and Intercept Strike, a gunslinger's way, bombs, Elemental Blast and so on).
//   classParty(slug, level): the standard party with that class's PC in the seat of the PC who fights most like it (a martial for the
//   fighter, a skirmisher for the rogue, an arcane or occult caster for the wizard, a divine or primal one for the cleric), so a class's
//   feats are rated on their own class.
// What isn't played yet is listed in CLASS_GAPS.
import { STAND_ABILITIES, STAND_ABILITY_BYSTANDERS, STAND_ABILITY_FORCED, STAND_ABILITY_TYPE, standAbilitySlug } from "./stand-abilities/index.js";
import { savePlan } from "./deviant.js";
import { E, L, M, T, armorPotency, key, pc, potency, preparedSpells, primarySkill, rank, SPELLBOOKS, specialization, spellProf, standardParty, striking } from "./party.js";
import { animalCompanion, familiarFor } from "./companions.js";

// The two traditions the standard party doesn't cast (the wizard's arcane and the cleric's divine are party.js's), best first for each rank.
export const MORE_SPELLBOOKS = Object.freeze({
    primal: {
        tradition: "primal",
        cantrips: ["Electric Arc", "Ignition", "Frostbite", "Caustic Blast", "Tangle Vine", "Gouging Claw"],
        ranks: {
            1: ["Breathe Fire", "Thunderstrike", "Fear", "Gust of Wind", "Heal", "Runic Weapon"],
            2: ["Acid Grip", "Noise Blast", "Blazing Bolt", "Heal", "Resist Energy"],
            3: ["Fireball", "Lightning Bolt", "Slow", "Heal", "Haste"],
            4: ["Hydraulic Torrent", "Ice Storm", "Fly", "Heal"],
            5: ["Cone of Cold", "Toxic Cloud", "Howling Blizzard", "Heal"],
            6: ["Chain Lightning", "Petrify", "Tangling Creepers", "Heal"],
            7: ["Eclipse Burst", "Fiery Body", "Volcanic Eruption", "Regenerate"],
            8: ["Polar Ray", "Desiccate", "Arctic Rift"],
            9: ["Storm of Vengeance", "Meteor Swarm", "Massacre"],
            10: ["Cataclysm", "Massacre"]
        }
    },
    occult: {
        tradition: "occult",
        cantrips: ["Daze", "Telekinetic Projectile", "Void Warp", "Figment"],
        ranks: {
            1: ["Fear", "Command", "Force Barrage", "Enfeeble", "Soothe"],
            2: ["Stupefy", "Noise Blast", "Mirror Image", "Laughing Fit", "Soothe"],
            3: ["Slow", "Haste", "Paralyze", "Heroism", "Vampiric Feast"],
            4: ["Confusion", "Phantasmal Killer", "Fly", "Weapon Storm"],
            5: ["Synesthesia", "Shadow Blast", "Banishment"],
            6: ["Spirit Blast", "Dominate", "Phantasmal Calamity"],
            7: ["Warp Mind", "Eclipse Burst", "Visions of Danger"],
            8: ["Uncontrollable Dance", "Spirit Song", "Disappearance"],
            9: ["Weird", "Wails of the Damned", "Overwhelming Presence"],
            10: ["Fabricated Truth", "Wails of the Damned"]
        }
    }
});
const BOOKS = { ...SPELLBOOKS, ...MORE_SPELLBOOKS };
const bookOf = (tradition) => (tradition === "arcane" ? BOOKS.wizard : tradition === "divine" ? { ...BOOKS.cleric, font: undefined } : BOOKS[tradition]);

// The four steps of an ability's scaling dice (Sneak Attack's, Precise Strike's, Strategic Strike's): 5th, 9th, 13th and 17th level.
const steps = (level) => [5, 9, 13, 17].filter((step) => level >= step).length;
// A martial's second-best attributes by level (party.js's fighter): Constitution, and a minor one.
const martialCon = (lv) => (lv >= 20 ? 4 : lv >= 10 ? 3 : 2);
const casterCon = (lv) => (lv >= 15 ? 3 : lv >= 5 ? 2 : 1);
const minor = (lv) => (lv >= 10 ? 2 : 1);
const second = (lv) => (lv >= 20 ? 4 : lv >= 10 ? 3 : 2);
// Armor: its item bonus and Dexterity cap (full plate, a breastplate, studded leather, none).
const ARMOR = { heavy: { item: 6, cap: 0 }, medium: { item: 4, cap: 1 }, light: { item: 2, cap: 3 }, unarmored: { item: 0, cap: 99 } };
const magical = (level) => (potency(level) ? { iwr: { traits: ["magical"] } } : {});

// A weapon Strike: { name, die, type, attribute (to hit), damageAttribute, prof, ... } at a level.
function weaponStrike(level, { name, die, type, toHit, damageAttr = 0, prof, item = potency(level), dice = striking(level), extra = {}, group, greater = true }) {
    return {
        name, bonus: level + prof + toHit + item, potency: item, melee: true, agile: false, iwr: { group }, ...extra,
        damage: [{ dice, die, bonus: damageAttr + specialization(level, prof, greater), type }]
    };
}

// A runesmith's traced and invoked runes (2026-11-02, the user's Archives of Nethys rune list, Impossible Magic): Trace Rune (1 action on
// an adjacent creature, 2 within 30 feet) then Invoke Rune (1 action, up to two runes), each invocation a basic Fortitude save against its
// class DC. Atryl, rune of fire (1d8 fire, a die more every 2 levels; dazzled 1 round on a critical failure) and ranshu, rune of thunder
// (1d8 electricity, the same steps), as abilities: one rune traced and invoked (2 actions; 3 from 30 feet), or both traced and invoked
// together (3 actions; one save stands in for the two). Their passive effects before the invocation are left out: they're invoked at once.
function runesmithRunes(lv, dc) {
    const dice = 1 + Math.floor((lv - 1) / 2);
    const traits = ["magical", "concentrate", "manipulate"];
    const rune = (name, actions, range, components, effects = {}, { save = "fortitude", area = null, extraTraits = [], pool = null, basic = true, immune = false } = {}) => {
        const plan = savePlan(name, { actions, traits, range, area, target: "1 creature", save, dc, damage: components[0]?.formula ?? null, effects, basic });
        if (area && range) plan.targeting.range = range;
        // (Its target immune to it after — for the fight.)
        if (immune) plan.trigger = { ...plan.trigger, immunity: true };
        plan.traits = plan.activation.traits = [...traits, "runesmith", ...extraTraits, ...components.map((part) => part.type)];
        plan.source.type = "action";
        if (components.length) {
            plan.resolution.sharedDamage.components = components.map((part, index) => ({ id: String(index), formula: part.formula, type: part.type, category: null }));
            for (const outcome of Object.values(plan.resolution.outcomes)) if (outcome.damage.sourceComponentIds?.length) outcome.damage.sourceComponentIds = components.map((_, index) => String(index));
        }
        return { name, plan, castRank: Math.ceil(lv / 2), dc, attack: null, pool, kind: "ability", actionType: "action", rechargeGroup: name, runesmithRune: true };
    };
    const round1 = { mode: "fixed", value: 1, unit: "rounds" };
    const fire = { formula: `${dice}d8[fire]`, type: "fire" };
    const thunder = { formula: `${dice}d8[electricity]`, type: "electricity" };
    const dazzled = { criticalFailure: [["dazzled", null, { mode: "fixed", value: 1, unit: "rounds" }]] };
    // (2026-11-10, Cole: "get them working" — more of its repertoire, from the rune list he gave (Impossible Magic pp. 55-61): thullax, rune
    // of corrosion (1d6 acid a die more every 2 levels, 1 persistent acid more every 2 on a critical failure); from 9th trolistri, rune of
    // forlorn sorrow, traced on itself (each enemy in a 15-foot emanation: Will, slowed 1 for a round, 2 on a critical failure; immune for
    // an hour after); from 17th ochyghol, the Poisoned Star (8d6 fire in a 40-foot burst about the bearer, basic Reflex;
    // its 3d10 at the centre and doom not played) and rovan, seal of the Dead Vault (incapacitation, Fortitude: slowed 1 on a success, 2 on
    // a failure, restrained, blinded and slowed 2 on a critical failure). Diacritics cost a Trace more on a traced rune and come to less
    // than a second rune for the same action, so they're left out; the etched holtrik and kojastri are in its build.)
    const acid = { formula: `${1 + Math.floor((lv - 1) / 2)}d6[acid]`, type: "acid" };
    const thullax = rune("Thullax, Rune of Corrosion (Trace and Invoke)", 2, "touch", [acid]);
    const persistent = 1 + Math.floor((lv - 1) / 2);
    thullax.plan.resolution.outcomes.criticalFailure.damage = { mode: "mixed", shared: { multiplier: 2, sourceComponentIds: ["0"] }, formulas: [{ formula: `${persistent}[persistent,acid]` }], rollScope: "outcome" };
    const later = [];
    if (lv >= 9) later.push(rune("Trolistri, Rune of Forlorn Sorrow (Trace on itself and Invoke)", 2, null, [], { failure: [["slowed", 1, round1]], criticalFailure: [["slowed", 2, round1]] }, { save: "will", area: { type: "emanation", value: 15, foes: true }, extraTraits: ["emotion", "mental"], basic: false, immune: true }));
    if (lv >= 17) {
        later.push(rune("Ochyghol, the Poisoned Star (Trace from afar and Invoke)", 3, "30 feet", [{ formula: "8d6[fire]", type: "fire" }], {}, { save: "reflex", area: { type: "burst", value: 40 } }));
        later.push(rune("Rovan, Seal of the Dead Vault (Trace and Invoke)", 2, "touch", [], { success: [["slowed", 1, round1]], failure: [["slowed", 2, round1]], criticalFailure: [["restrained", null, null], ["blinded", null, null], ["slowed", 2, null]] }, { extraTraits: ["incapacitation", "earth"], basic: false, immune: true }));
    }
    return [
        thullax, ...later,
        rune("Atryl, Rune of Fire (Trace and Invoke)", 2, "touch", [fire], dazzled),
        rune("Ranshu, Rune of Thunder (Trace and Invoke)", 2, "touch", [thunder]),
        rune("Ranshu, Rune of Thunder (Trace from afar and Invoke)", 3, "30 feet", [thunder]),
        rune("Atryl and Ranshu (Trace both, Invoke both)", 3, "touch", [fire, thunder], dazzled)
    ];
}

// What each class is (Player Core 1 and 2, Guns & Gears, Dark Archive, Rage of Elements, War of Immortals, Battlecry!, Impossible Lands):
//   seat: the standard party's PC it stands in for; hp a level; attrs (key k) → its modifiers; armor kind and proficiency steps;
//   saves and Perception steps; build(level, ctx) → its Strikes and its engine's fields.
const ARMORED = (steps_) => steps_;
const CLASSES = {
    alchemist: {
        seat: "rogue", hp: 8, attrs: (k, lv) => ({ str: 1, dex: second(lv), con: martialCon(lv) - 1, int: k, wis: minor(lv), cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [11, M]], ref: [[1, E], [15, M]], will: [[1, T], [7, E]], perception: [[1, T], [9, E]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a, { alchemy = null, field: chosenField = null } = {}) {
            // (2026-11-10, Cole's pick "All four, each its own build": its research field — bomber, chirurgeon, mutagenist or toxicologist —
            // options.field, else SIM_FIELD, else bomber.)
            const field = chosenField ?? globalThis.process?.env?.SIM_FIELD ?? "bomber";
            const bomber = field === "bomber";
            // (2026-11-04, Cole: "Yes, bombs, elixirs and vial limit".) Player Core 2's alchemist, a bomber: versatile vials, 2 + its
            // Intelligence a day (2 back for each 10 minutes of exploration, so a full stock each fight); Quick Alchemy (1 action, a vial)
            // makes a bomb in hand, so each throw is Quick Alchemy then the Strike; Advanced Alchemy's 4 + Intelligence items a day, a
            // quarter of them each fight (four fights a day), as ready alchemist's fire (still drawn, 1 Interact). Its bombs: alchemist's
            // fire, frost vial and bottled lightning at its level's type (lesser, moderate at 3rd, greater at 11th, major at 17th), the one
            // its target minds most; Field Discovery (5th): splash equal to its Intelligence. Alchemical Weapon Expertise at 7th, Mastery
            // at 15th. With the tools' kit (options.alchemy, tools/lib/alchemy.mjs alchemistKit): the bombs' riders, elixir of life from
            // Quick Alchemy, and with SIM_ALCHEMY=full every bomb family and save item in its formula book.
            const prof = rank(lv, [[1, T], [7, E], [15, M]]);
            const grade = lv >= 17 ? 4 : lv >= 11 ? 3 : lv >= 3 ? 2 : 1;
            const kit = alchemy?.(lv) ?? null;
            const bombs = kit?.bombs ?? [
                { name: "Alchemist's Fire", itemBonus: grade - 1, damage: { dice: grade, die: 8, bonus: 0, type: "fire" }, splash: grade, persistent: { dice: 0, die: 0, bonus: grade, type: "fire" } },
                { name: "Frost Vial", itemBonus: grade - 1, damage: { dice: grade, die: 6, bonus: 0, type: "cold" }, splash: grade, persistent: null },
                { name: "Bottled Lightning", itemBonus: grade - 1, damage: { dice: grade, die: 6, bonus: 0, type: "electricity" }, splash: grade, persistent: null }
            ];
            // (2026-11-10, Cole: "double check Alchemist to see if they are getting a fair score". Weapon Specialization comes at 13th for an
            // alchemist, and it has no greater specialization: before, +2 from 7th and doubled from 15th.)
            const spec = lv >= 13 ? (prof === M ? 3 : prof === L ? 4 : 2) : 0;
            // (Bomber field benefit: its splash on the primary target only when it would catch itself or an ally — splashPrimaryOnly.)
            const strikes = bombs.map((bomb) => ({
                name: bomb.name, bonus: lv + prof + a.dex + (bomb.itemBonus ?? 0), melee: false, increment: 20, thrown: true, held: true, splashKind: "bomb",
                splashAmount: lv >= 5 && bomber ? Math.max(bomb.splash ?? 0, a.int) : bomb.splash ?? 0, iwr: { group: "bomb", traits: ["alchemical"] },
                damage: [{ dice: bomb.damage.dice, die: bomb.damage.die, bonus: (bomb.damage.bonus ?? 0) + spec, type: bomb.damage.type }, ...(bomb.persistent ? [{ ...bomb.persistent, persistent: true }] : [])],
                ammo: { pool: `alchemist:${bomb.name}`, reagents: true, startsEmpty: true }, reload: 1
            }));
            // Quick Alchemy's quick vial: a versatile vial made for nothing (1 action), thrown the same turn — a bomber's in acid, cold,
            // electricity or fire. The vial's type is its level's: 1d6 and 1 splash; 2d6, 2 and +1 to hit from 4th; 3d6, 3 and +2 from 12th;
            // 4d6, 4 and +3 from 18th.
            const vialDice = lv >= 18 ? 4 : lv >= 12 ? 3 : lv >= 4 ? 2 : 1;
            // (A bomber's in acid, cold, electricity or fire; a toxicologist's in acid or poison; the others' acid.)
            const vialTypes = bomber ? ["acid", "fire", "cold", "electricity"] : field === "toxicologist" ? ["acid", "poison"] : ["acid"];
            const vials = vialTypes.map((type) => ({
                name: `Quick Vial (${type})`, bonus: lv + prof + a.dex + vialDice - 1, melee: false, increment: 20, thrown: true, held: true, splashKind: "bomb", quickVial: true,
                splashAmount: lv >= 5 && bomber ? Math.max(vialDice, a.int) : vialDice, iwr: { group: "bomb", traits: ["alchemical"] },
                damage: [{ dice: vialDice, die: 6, bonus: spec, type }],
                ammo: { pool: "alchemist:quick-vial", startsEmpty: true }, reload: 1
            }));
            const dagger = weaponStrike(lv, { name: "Dagger", die: 4, type: "piercing", toHit: a.dex, damageAttr: a.str, prof: rank(lv, [[1, T], [7, E], [15, M]]), group: "knife", extra: { agile: true, finesse: true } });
            dagger.damage[0].bonus = a.str + spec;
            // A toxicologist's field vial as an injury poison: a quick vial on its dagger as one action (its field benefit), the vial's damage
            // on the hit (poison, or acid where that's worse for the foe — both offered), from 11th its splash as persistent poison too.
            const envenomed = field === "toxicologist" ? ["poison", "acid"].map((type) => ({ ...structuredClone(dagger), name: `Envenomed Dagger (${type})`, quickVial: true, ammo: { pool: "alchemist:quick-vial", startsEmpty: true }, reload: 1,
                damage: [...structuredClone(dagger.damage), { dice: vialDice, die: 6, bonus: 0, type }, ...(lv >= 11 ? [{ dice: 0, die: 0, bonus: vialDice, type: "poison", persistent: true }] : [])] })) : [];
            const ready = Math.floor((4 + a.int) / 4);
            // Mutagens from Quick Alchemy, drunk at once (2 actions, a vial; one mutagen at a time): drakeheart (its item bonus to AC over its
            // armor's and a Dexterity cap of +2; -1 to Reflex and Will), juggernaut (temporary Hit Points and Fortitude; -2 to Will and
            // Perception), stone body from 5th (resistance 5 to piercing and slashing, 10 from 15th; -2 to Reflex).
            // A mutagenist: temporary Hit Points equal to its Intelligence plus half its level as it drinks one (the higher of those and the
            // mutagen's own), a quick vial drunk with it to suppress the drawback (an action more), from 11th that vial's resistance to
            // physical damage equal to half its level, and from 13th two mutagens at once.
            const mutagenist = field === "mutagenist";
            const fieldTemp = mutagenist ? a.int + Math.floor(lv / 2) : 0;
            const mutagen = (name, { drawback = [], tempHp = 0, ...fields }) => ({ name, actions: mutagenist ? 3 : 2, pool: "reagents", mutagen: true, model: { name, rounds: 10, modifiers: [], tempHp: Math.max(tempHp, fieldTemp), fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, attackDeltas: {}, strikeDeltas: {}, ...fields, ...(mutagenist ? {} : { modifiers: [...(fields.modifiers ?? []), ...drawback] }), ...(mutagenist && lv >= 11 ? { resistances: [...(fields.resistances ?? []).filter((each) => !["bludgeoning", "piercing", "slashing"].includes(each.type)), ...["bludgeoning", "piercing", "slashing"].map((type) => ({ type, value: Math.max(Math.floor(lv / 2), (fields.resistances ?? []).find((each) => each.type === type)?.value ?? 0), exceptions: [] }))] } : {}) } });
            const drakeAC = Math.max(0, (lv >= 17 ? 7 : lv >= 3 ? 5 : 4) - 4 - armorPotency(lv)) + Math.max(0, Math.min(a.dex, 2) - Math.min(a.dex, 1));
            const juggernaut = lv >= 17 ? [4, 45] : lv >= 11 ? [3, 30] : lv >= 3 ? [2, 10] : [1, 5];
            const selfEffects = [
                ...(drakeAC > 0 || mutagenist ? [mutagen("Drakeheart Mutagen", { modifiers: drakeAC > 0 ? [{ on: "ac", type: "item", value: drakeAC }] : [], drawback: [{ on: "reflex", type: "untyped", value: -1 }, { on: "will", type: "untyped", value: -1 }] })] : []),
                mutagen("Juggernaut Mutagen", { tempHp: juggernaut[1], modifiers: [{ on: "fortitude", type: "item", value: juggernaut[0] }], drawback: [{ on: "will", type: "untyped", value: -2 }] }),
                ...(lv >= 5 ? [mutagen("Stone Body Mutagen", { resistances: ["piercing", "slashing"].map((type) => ({ type, value: lv >= 15 ? 10 : 5, exceptions: [] })), drawback: [{ on: "reflex", type: "untyped", value: -2 }] })] : [])
            ];
            // A chirurgeon: Crafting for Medicine; its field vials heal (between waves, solo waves — chirurgeonVials).
            const crafting = lv + primarySkill(lv) + a.int;
            return {
                strikes: [...strikes, ...vials, ...envenomed, dagger], skills: { crafting, ...(field === "chirurgeon" ? { medicine: crafting } : {}) },
                spellPools: { reagents: 2 + a.int, [`alchemist:${strikes[0].name}`]: ready, "alchemist:quick-vial": 9999 },
                ...(kit?.spells?.length ? { spells: kit.spells } : {}),
                // Double Brew (9th): Quick Alchemy makes two, so every second bomb a turn needs none; Abundant Vials (17th): quickened for a quick
                // vial, so its first quick vial a turn needs none (planner.js emptyNow). Advanced Alchemy's vials back between fights: 2 each 10
                // minutes, 3 from 9th (solo waves).
                fields: { researchField: field, ...(bomber ? { splashPrimaryOnly: true } : {}), selfEffects, mutagensAtOnce: mutagenist && lv >= 13 ? 2 : 1,
                    ...(field === "toxicologist" && lv >= 5 ? { resistances: [{ type: "poison", value: Math.floor(lv / 2), exceptions: [] }] } : {}),
                    ...(field === "chirurgeon" ? { chirurgeonVials: { dice: vialDice, uncapped: lv >= 11, maxElixir: lv >= 13 } } : {}), vialRegain: lv >= 9 ? 3 : 2, vialMax: 2 + a.int, ...(lv >= 9 ? { doubleBrew: true } : {}), ...(lv >= 17 ? { abundantVials: true } : {}) }
            };
        }
    },
    animist: {
        seat: "cleric", hp: 8, attrs: (k, lv) => ({ str: 1, dex: 2, con: casterCon(lv), int: 0, wis: k, cha: 1 }),
        armor: "light", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [3, E]], ref: [[1, T], [11, E]], will: [[1, E], [13, M]], perception: [[1, T], [9, E]],
        // (2026-11-10, Cole: "get them working" — its apparitions. Primary apparition the Steward of Stone and Fire: its apparition spells
        // (signature spells, so Fireball heightened into its higher slots) first in its slots, its cantrip Ignition, and its vessel spell
        // Earth's Bile — 1 action, a 10-foot burst of fire, bludgeoning and persistent fire, its area again each round it's Sustained (the
        // engine's zone spells). Focus Points: 1, 2 with its third apparition (7th), 3 with its fourth (15th). Its practice, the
        // liturgist's, gives Circle of Spirits (changing its primary apparition: nothing in one fight) and Dancing Invocation's Sustain on a
        // Step (not played).)
        caster: { tradition: "divine", attr: "wis", slots: 4, extra: ["Ignition"], lead: { 1: ["Interposing Earth"], 2: ["Exploding Earth"], 3: ["Fireball"], 4: ["Fireball", "Wall of Fire"], 5: ["Fireball", "Wall of Stone"], 6: ["Fireball", "Petrify"], 7: ["Volcanic Eruption", "Fireball"], 8: ["Earthquake", "Fireball"], 9: ["Falling Stars", "Fireball"] } },
        focus: { names: ["Earth's Bile"], attr: "wis", points: (lv) => (lv >= 15 ? 3 : lv >= 7 ? 2 : 1) }
    },
    barbarian: {
        seat: "fighter", hp: 12, attrs: (k, lv) => ({ str: k, dex: 2, con: martialCon(lv), int: 0, wis: minor(lv), cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [7, M], [13, L]], ref: [[1, T], [9, E]], will: [[1, E], [15, M]], perception: [[1, E], [17, M]],
        classDC: [[1, T], [11, E], [19, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const axe = weaponStrike(lv, { name: "Greataxe", die: 12, type: "slashing", toHit: a.str, damageAttr: a.str, prof, group: "axe", extra: { hands: 2, sweep: true, held: true } });
            // Rage (fury): +2 damage, its specialization's +6 at 7th and +12 at 15th; temporary Hit Points of its level and Constitution.
            const bonus = lv >= 15 ? 12 : lv >= 7 ? 6 : 2;
            const rage = { name: "Rage", actions: 1, tempHp: lv + a.con, noConcentrate: true, acPenalty: 1, strikeDeltas: { [axe.name]: [{ dice: 0, die: 0, bonus, multiplier: 1, type: "slashing", precision: false, persistent: false }] } };
            return { strikes: [axe], fields: { selfBuffs: [rage], reactions: { aoo: false, shieldBlock: false } } };
        }
    },
    bard: {
        seat: "wizard", hp: 8, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "light", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [9, E]], ref: [[1, T], [3, E]], will: [[1, E], [17, M]], perception: [[1, E], [11, M]],
        caster: { tradition: "occult", attr: "cha", slots: 4, extra: ["Courageous Anthem"] },
        // (2026-11-10, Cole: "get them working" — its other compositions: Counter Performance (every bard's focus spell: its reaction as an
        // ally within 60 feet saves against an auditory or visual effect, its Performance check standing in for the save if higher; a Focus
        // Point) and, as a maestro, Lingering Composition (its anthem for 3 or 4 rounds on a Performance check; spells.js castPlan). Two
        // focus spells, 2 Focus Points. Performance: expert at 3rd, master at 7th, legendary at 15th.)
        build(lv, a) {
            const performance = lv + rank(lv, [[1, T], [3, E], [7, M], [15, L]]) + a.cha;
            return { skills: { performance }, spellPools: { "bard:focus": 2 }, fields: { critSpec: false, lingeringComposition: "bard:focus", saveSkill: { name: "Counter Performance", skill: "performance", save: null, against: ["auditory", "visual"], ally: true, within: 60, allyTrait: null, pool: "bard:focus" } } };
        }
    },
    champion: {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: k, dex: 0, con: martialCon(lv), int: 0, wis: minor(lv), cha: second(lv) - 1 }),
        armor: "heavy", armorSteps: [[1, T], [7, E], [13, M], [17, L]],
        fort: [[1, E], [9, M]], ref: [[1, T], [9, E]], will: [[1, E], [11, M]], perception: [[1, T], [11, E]],
        classDC: [[1, T], [9, E], [17, M]],
        focus: { names: ["Lay on Hands"], attr: "cha", points: 1 },
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const sword = weaponStrike(lv, { name: "Longsword", die: 8, type: "slashing", toHit: a.str, damageAttr: a.str, prof, group: "sword", extra: { versatile: ["piercing"], held: true } });
            // A paladin's Retributive Strike: resistance 2 + its level for the ally, a Strike back; Relentless Reaction's dice from 9th.
            const reaction = { slug: "retributive-strike", name: "Retributive Strike", self: false, resistance: 2 + lv, dice: lv >= 19 ? 6 : lv >= 16 ? 5 : lv >= 12 ? 4 : lv >= 9 ? 3 : lv >= 5 ? 2 : 1, ...(lv >= 9 ? { relentless: { type: "spirit", amount: lv >= 13 ? 3 : 2 } } : {}) };
            const hardness = lv >= 13 ? 10 : lv >= 7 ? 8 : 5;
            return { strikes: [sword], fields: { championReaction: reaction, shield: { ac: 2, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false }, reactions: { aoo: false, shieldBlock: true } } };
        }
    },
    commander: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: second(lv), dex: 1, con: martialCon(lv), int: k, wis: minor(lv), cha: 1 }),
        armor: "medium", armorSteps: [[1, T], [11, E], [17, M]],
        fort: [[1, T], [9, E]], ref: [[1, E]], will: [[1, E], [11, M]], perception: [[1, E], [13, M]],
        classDC: [[1, T], [7, E], [15, M], [19, L]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const sword = weaponStrike(lv, { name: "Longsword", die: 8, type: "slashing", toHit: a.str, damageAttr: a.str, prof, group: "sword", extra: { held: true } });
            return { strikes: [sword], fields: { commander: { banner: 30, drilled: true, strikeHard: "Strike Hard!", pincerAttack: "Pincer Attack" }, reactions: { aoo: false, shieldBlock: true } } };
        }
    },
    druid: {
        seat: "cleric", hp: 8, attrs: (k, lv) => ({ str: 1, dex: 2, con: casterCon(lv), int: 0, wis: k, cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [3, E]], ref: [[1, T], [5, E]], will: [[1, E], [11, M]], perception: [[1, T], [3, E]],
        caster: { tradition: "primal", attr: "wis", slots: 3 }, focus: { names: ["Tempest Surge"], attr: "wis", points: 1 }
    },
    exemplar: {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: k, dex: 2, con: martialCon(lv), int: 0, wis: minor(lv), cha: 0 }),
        armor: "light", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [9, M]], ref: [[1, E]], will: [[1, E], [7, M], [13, L]], perception: [[1, T], [9, E], [17, M]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const spear = weaponStrike(lv, { name: "Noble Branch Spear", die: 8, type: "piercing", toHit: a.str, damageAttr: a.str, prof, group: "spear", extra: { held: true, hands: 2 } });
            // Noble Branch (a weapon ikon): 2 spirit damage per weapon damage die (2026-11-06: was 2 and 1 more a die); Scar of the Survivor (a body ikon): +1 status to Fortitude.
            const spirit = 2 * spear.damage[0].dice;
            const model = (name, fields) => ({ name, rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, attackDeltas: {}, strikeDeltas: {}, ...fields });
            return {
                strikes: [spear],
                fields: {
                    exemplar: {
                        ikons: [
                            { slug: "noble-branch", name: "Noble Branch", model: model("Noble Branch", { strikeDeltas: { [spear.name]: [{ dice: 0, die: 0, bonus: spirit, multiplier: 1, type: "spirit", precision: false, persistent: false }] } }) },
                            { slug: "scar-of-the-survivor", name: "Scar of the Survivor", model: model("Scar of the Survivor", { modifiers: [{ on: "fortitude", type: "status", value: 1 }] }) }
                        ],
                        transcendences: [
                            { kind: "rend", name: "Strike, Breathe, Rend", ikon: "noble-branch", strike: spear.name, dice: striking(lv), die: 8 },
                            { kind: "heal", name: "No Scar but This", ikon: "scar-of-the-survivor", dice: Math.ceil(lv / 2), die: 8 }
                        ]
                    }
                }
            };
        }
    },
    guardian: {
        seat: "fighter", hp: 12, attrs: (k, lv) => ({ str: k, dex: 0, con: martialCon(lv), int: 0, wis: minor(lv), cha: 0 }),
        armor: "heavy", armorSteps: [[1, T], [5, E], [11, M], [15, L]],
        fort: [[1, E], [9, M]], ref: [[1, T], [7, E]], will: [[1, E], [17, M]], perception: [[1, T], [7, E]],
        classDC: [[1, T], [9, E], [19, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const hammer = weaponStrike(lv, { name: "Warhammer", die: 8, type: "bludgeoning", toHit: a.str, damageAttr: a.str, prof, group: "hammer", extra: { held: true, shove: true } });
            const hardness = lv >= 13 ? 10 : lv >= 7 ? 8 : 5;
            return { strikes: [hammer], fields: { interceptAttack: { name: "Intercept Strike" }, taunt: { name: "Taunt" }, shield: { ac: 2, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false }, reactions: { aoo: false, shieldBlock: true } } };
        }
    },
    gunslinger: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: 1, dex: k, con: martialCon(lv), int: 0, wis: second(lv) - 1, cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [17, M]], ref: [[1, E], [11, M]], will: [[1, T], [3, E]], perception: [[1, E], [7, M], [19, L]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            // Way of the Sniper: an arquebus (kickback's +1 damage), One Shot, One Kill's dice when it shoots first, Covered Reload.
            const prof = rank(lv, [[1, E], [5, M], [13, L]]);
            const gun = { ...weaponStrike(lv, { name: "Arquebus", die: 8, type: "piercing", toHit: a.dex, damageAttr: 1, prof, group: "firearm", extra: { held: true, hands: 2 } }), melee: false, increment: 150, reload: 1, firearm: true, concussive: true, fatal: 12 };
            const dagger = weaponStrike(lv, { name: "Dagger", die: 4, type: "piercing", toHit: a.dex, damageAttr: a.str, prof: rank(lv, [[1, T], [5, E], [13, M]]), group: "knife", extra: { agile: true, finesse: true } });
            return { strikes: [gun, dagger], fields: { slingersReload: { name: "Covered Reload", then: null }, firstShot: { dice: lv >= 15 ? 3 : lv >= 9 ? 2 : 1 } } };
        }
    },
    inventor: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: second(lv), dex: 1, con: martialCon(lv), int: k, wis: minor(lv), cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [11, E], [19, M]],
        fort: [[1, E], [17, M]], ref: [[1, T], [7, E]], will: [[1, E], [11, M]], perception: [[1, T], [13, E]],
        classDC: [[1, T], [9, E], [17, M]],
        // (2026-11-10, Cole's pick "Fix 1 to 7, rerun": the inventor's innovation — weapon, armor or construct — options.innovation, else
        // SIM_INNOVATION, else weapon; each rated as its own build.)
        build(lv, a, { innovation = null } = {}) {
            const kind = innovation ?? globalThis.process?.env?.SIM_INNOVATION ?? "weapon";
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            // A weapon innovation's modifications: Razor Prongs (1st; trip, versatile S), Aerodynamic Construction (7th breakthrough; sweep),
            // Enhanced Damage (15th revolutionary; d8 to d10). Another innovation's warhammer is a plain one.
            const weapon = kind === "weapon";
            const hammer = weaponStrike(lv, { name: "Warhammer", die: weapon && lv >= 15 ? 10 : 8, type: "bludgeoning", toHit: a.str, damageAttr: a.str, prof, group: "hammer", extra: { held: true, ...(weapon ? { trip: true } : {}), ...(weapon && lv >= 7 ? { sweep: true } : {}) } });
            // Offensive Boost (9th, 2026-11-06): the innovation's Strikes deal 1d6 more (Ignition, fire) — the weapon's, the armor's wearer's,
            // or the construct's.
            if (lv >= 9 && kind !== "construct") hammer.damage.push({ dice: 1, die: 6, bonus: 0, type: "fire" });
            const crafting = lv + primarySkill(lv) + a.int;
            const classDC = 10 + lv + rank(lv, [[1, T], [9, E], [17, M]]) + a.int;
            // Expert, Master and Legendary Overdrive (3rd, 7th, 15th): 1, 2, 3 more damage on a success or critical success.
            const tier = lv >= 15 ? 3 : lv >= 7 ? 2 : lv >= 3 ? 1 : 0;
            // Explode (2 actions, unstable): max(2, level)d6 fire, basic Reflex against its class DC, a 5-foot emanation (10 feet from the
            // breakthrough at 7th, 15 from the revolutionary at 15th); then a DC 17 flat check, or no unstable actions until it Refocuses.
            const explode = { name: "Explode", plan: savePlan("Explode", { actions: 2, traits: ["fire", "manipulate", "unstable", "inventor"], area: { type: "emanation", value: lv >= 15 ? 15 : lv >= 7 ? 10 : 5 }, save: "reflex", dc: classDC, damage: `${Math.max(2, lv)}d6[fire]`, basic: true }), castRank: Math.ceil(lv / 2), dc: classDC, attack: null, pool: "inventor:unstable", kind: "ability", actionType: "action", rechargeGroup: "Explode", unstable: true };
            explode.plan.source.type = "action";
            const hardness = lv >= 13 ? 10 : lv >= 7 ? 8 : 5;
            const fields = {
                overdrive: { name: "Overdrive", modifier: crafting, intMod: a.int, level: lv, tier },
                shield: { ac: 2, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false }, reactions: { aoo: false, shieldBlock: true },
                innovation: kind
            };
            // An armor innovation: Metallic Reactance (acid and electricity 3 + half its level, 2 more in overdrive), Dense Plating (7th;
            // slashing half its level), Physical Protections (15th; bludgeoning, piercing and slashing half its level).
            if (kind === "armor") {
                const half = Math.floor(lv / 2);
                const resist = [{ type: "acid", value: 3 + half, exceptions: [] }, { type: "electricity", value: 3 + half, exceptions: [] }];
                if (lv >= 15) resist.push(...["bludgeoning", "piercing", "slashing"].map((type) => ({ type, value: half, exceptions: [] })));
                else if (lv >= 7) resist.push({ type: "slashing", value: half, exceptions: [] });
                fields.resistances = resist;
                fields.metallicReactance = 2;
            }
            if (kind === "construct") {
                // A construct companion (the bear's numbers at its stage: young, mature from Advanced Construct Companion at 8th, incredible
                // from Incredible Construct Companion at 14th; Offensive Boost on its Strikes), its master's turn two actions (one to
                // Command it); Explode about it, its own two actions.
                const stage = lv >= 14 ? "incredible" : lv >= 8 ? "mature" : "young";
                fields.actionsPerTurn = 2;
                const construct = (master) => {
                    const it = animalCompanion(master, stage);
                    Object.assign(it, { name: `${master.name}'s Construct Companion`, traits: ["construct", "minion"], senses: ["darkvision"], spells: [...it.spells, structuredClone(explode)], spellPools: { "inventor:unstable": 1 } });
                    if (lv >= 9) for (const strike of it.strikes) strike.damage = [...strike.damage, { dice: 1, die: 6, bonus: 0, type: "fire" }];
                    return it;
                };
                return { strikes: [hammer], skills: { crafting }, fields, companions: [construct] };
            }
            return { strikes: [hammer], skills: { crafting }, spells: [explode], spellPools: { "inventor:unstable": 1 }, fields };
        }
    },
    investigator: {
        seat: "rogue", hp: 8, attrs: (k, lv) => ({ str: 1, dex: second(lv), con: martialCon(lv) - 1, int: k, wis: minor(lv), cha: 0 }),
        armor: "light", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, T], [9, E]], ref: [[1, E], [15, M]], will: [[1, E], [11, M], [17, L]], perception: [[1, E], [7, M], [13, L]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const rapier = weaponStrike(lv, { name: "Rapier", die: 6, type: "piercing", toHit: a.dex, damageAttr: a.str, prof, group: "sword", extra: { finesse: true, held: true, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 8 } } });
            return { strikes: [rapier], fields: { stratagemFeature: { name: "Devise a Stratagem", dice: 1 + steps(lv), strikeBonus: { [rapier.name]: Math.max(0, a.int - a.dex) } } } };
        }
    },
    kineticist: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: 1, dex: second(lv), con: k, int: 0, wis: minor(lv), cha: 0 }),
        armor: "light", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [7, M], [15, L]], ref: [[1, E], [11, M]], will: [[1, T], [3, E]], perception: [[1, T], [9, E]],
        classDC: [[1, T], [7, E], [15, M], [19, L]],
        build(lv, a) {
            // Elemental Blast (fire): an impulse attack (Constitution, its gate attenuator's item bonus), a die more at 5th, 9th, 13th and 17th;
            // two actions add its Constitution to the damage. Its Weapon Specialization at 13th.
            const prof = rank(lv, [[1, T], [7, E], [15, M], [19, L]]);
            const dice = 1 + steps(lv);
            // (2026-11-10: no greater weapon specialization for a kineticist — it was doubled from 15th.)
            const spec = lv >= 13 ? specialization(lv, prof, false) : 0;
            const blast = { name: "Elemental Blast", bonus: lv + prof + a.con + potency(lv), potency: potency(lv), melee: false, increment: 60, held: false, impulse: true, iwr: { group: "blast", traits: ["magical", "fire"] }, damage: [{ dice, die: 6, bonus: spec, type: "fire" }] };
            // (2026-11-10, Cole's pick "All fixes, with impulses": a melee blast adds its Strength; a single fire gate's impulse junction — a
            // 2-action blast's fire dice a step bigger, d6 to d8, played as a point more a die —; its gate junctions at the Gate's Thresholds:
            // the aura junction (5th: weakness to its fire impulses equal to half its level for foes in its 10-foot aura — on its melee blast,
            // the one that's always in it), the critical blast junction (9th: 1d6 persistent fire on a critical hit, plus its attenuator's item
            // bonus), the elemental resistance (13th: cold and fire equal to its level). Its impulse feats: tools/lib/feat-power.mjs.)
            if (lv >= 9) blast.critExtra = [{ dice: 1, die: 6, bonus: potency(lv), type: "fire", persistent: true }];
            const melee = { ...blast, name: "Elemental Blast (melee)", melee: true, increment: null, damage: [{ ...blast.damage[0], bonus: blast.damage[0].bonus + a.str + (lv >= 5 ? Math.floor(lv / 2) : 0) }] };
            const twoAction = (strike) => ({ name: `${strike.name}, two actions`, actions: 2, strides: 0, strike: strike.name.toLowerCase(), attackBonus: 0, damageBonus: a.con + dice, damage: null, offGuard: false, requires: null, oncePerFight: false, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null, traits: ["impulse", "attack"] });
            // (Kinetic Quickness: Reflex master at 11th. Greater Kinetic Durability (15th): a critical failure on a Fortitude save a failure — with
            // Kinetic Durability's success a critical success; the half damage on a failure against damage isn't played.)
            return { strikes: [blast, melee], fields: { kineticAura: true, strikeActivities: [twoAction(blast), twoAction(melee)], ...(lv >= 13 ? { resistances: ["cold", "fire"].map((type) => ({ type, value: lv, exceptions: [] })) } : {}), ...(lv >= 15 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better", criticalFailure: "one-degree-better" } }] } : {}) } };
        }
    },
    magus: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: k, dex: 2, con: martialCon(lv), int: second(lv), wis: minor(lv) - 1, cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [11, E], [17, M]],
        fort: [[1, E], [9, M]], ref: [[1, T], [5, E]], will: [[1, E], [9, M]], perception: [[1, T], [9, E]],
        caster: { tradition: "arcane", attr: "int", topTwo: 2, prof: (lv) => rank(lv, [[1, T], [9, E], [17, M]]) },
        // (Inexorable Iron: a two-handed weapon and its conflux spell, Thunderous Strike.)
        focus: { names: ["Thunderous Strike"], attr: "int", points: 1 },
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const sword = weaponStrike(lv, { name: "Greatsword", die: 12, type: "slashing", toHit: a.str, damageAttr: a.str, prof, group: "sword", extra: { held: true, hands: 2 } });
            // (2026-11-05, Arcane Cascade: its stance — 1 extra damage on its Strikes, 2 with weapon expertise (5th), 3 with mastery (13th).
            // Its "after a spell or Spellstrike" requirement isn't checked: a magus enters it after its first Spellstrike anyway.)
            const cascade = prof >= M ? 3 : prof >= E ? 2 : 1;
            const arcaneCascade = { name: "Arcane Cascade", actions: 1, stance: true, model: { name: "Arcane Cascade", rounds: Infinity, modifiers: [{ on: "damage", type: "untyped", value: cascade }], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0 } };
            return { strikes: [sword], fields: { spellstrike: { name: "Spellstrike" }, arcaneCascade: cascade, selfEffects: [arcaneCascade], ...(lv >= 19 ? { doubleSpellstrike: true } : {}) } };
        }
    },
    monk: {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: k, dex: second(lv), con: martialCon(lv), int: 0, wis: minor(lv), cha: 0 }),
        armor: "unarmored", armorSteps: [[1, E], [13, M], [17, L]],
        fort: [[1, E]], ref: [[1, E], [7, M], [15, L]], will: [[1, E], [11, M]], perception: [[1, T], [5, E]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            // Fists (Powerful Fist's d6) with handwraps' runes; Flurry of Blows.
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const fist = weaponStrike(lv, { name: "Fist", die: 6, type: "bludgeoning", toHit: a.str, damageAttr: a.str, prof, group: "brawling", extra: { agile: true, finesse: true, unarmed: true } });
            return { strikes: [fist], speed: 25 + (lv >= 19 ? 30 : lv >= 15 ? 25 : lv >= 11 ? 20 : lv >= 7 ? 15 : lv >= 3 ? 10 : 0), fields: { multiStrikes: [{ name: "Flurry of Blows", actions: 1, strikes: [null, null], oncePerTurn: true, flourish: true }] } };
        }
    },
    necromancer: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: k, wis: minor(lv), cha: 0 }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, E], [11, M], [17, L]], ref: [[1, T], [5, E]], will: [[1, E]], perception: [[1, T], [7, E]],
        caster: { tradition: "occult", attr: "int", slots: 3 }, focus: { names: ["Necrotic Bomb", "Bone Spear"], attr: "int", points: 2 },
        build(lv, a) {
            // (2026-11-02, the user: "the spell module handles Necromancer thralls". Its thrall rules, scripts/thrall-tokens.js: a thrall is a
            // level -1 creature that acts only when commanded; its Strike uses the caster's spell attack modifier and deals 1d6 bludgeoning,
            // piercing or slashing, a die more at 5th level and every 4 after.) A puppeteer of bone: each turn's first thrall Strike is Create
            // Thrall's command option (1 action: a thrall that Strikes at once, and Thrall Proliferation's second one), later ones Command a
            // Thrall; the thralls left over feed the grave spells that destroy one (Necrotic Bomb, Bone Spear: fight.js, planner.js). The
            // Strike counts toward the necromancer's multiple attack penalty; thralls are a count, not bodies on the field.
            const dice = 1 + Math.max(0, Math.floor((lv - 1) / 4));
            const thrall = { name: "Thrall", bonus: lv + spellProf(lv) + a.int, melee: false, increment: 30, held: false, thrall: true, proxy: true, versatile: ["bludgeoning", "piercing"], iwr: { group: "brawling", traits: ["unarmed"] }, damage: [{ dice, die: 6, bonus: 0, type: "slashing" }] };
            const staff = { name: "Staff", bonus: lv + T + a.str, melee: true, agile: false, iwr: { group: "club" }, damage: [{ dice: 1, die: 4, bonus: a.str, type: "bludgeoning" }] };
            // (2026-11-10: the puppeteer's Consume Thrall (fight.js), Inevitable Return (3rd, thralls.js), Undying Resilience (17th: legendary
            // Fortitude, a critical failure a failure; its half damage on a failure not played).)
            return { strikes: [thrall, staff], fields: { critSpec: false, thrallMaker: { proliferation: 1 }, consumeThrall: "necromancer:focus", ...(lv >= 3 ? { inevitableReturn: true } : {}), ...(lv >= 17 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better", criticalFailure: "one-degree-better" } }] } : {}) } };
        }
    },
    oracle: {
        seat: "cleric", hp: 8, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "light", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [9, E]], ref: [[1, T], [13, E]], will: [[1, E], [7, M], [17, L]], perception: [[1, T], [11, E]],
        // (2026-11-10, Cole: "get them working" — its tempest mystery: its granted spells first at their ranks (Electric Arc, Thunderstrike,
        // Hydraulic Torrent, Chain Lightning), its cursebound oracle feat Foretell Harm, and its curse, Curse of Inclement Headwinds
        // (fight.js oracleCurse). Mysterious Resolve (7th) and its greater form: a success on a Will save a critical success (SAVE_UPGRADES'
        // Will at 7th), a critical failure on one a failure at 17th.)
        caster: { tradition: "divine", attr: "cha", slots: 4, extra: ["Electric Arc"], lead: { 1: ["Thunderstrike"], 4: ["Hydraulic Torrent"], 6: ["Chain Lightning"] } }, focus: { names: ["Tempest Touch"], attr: "cha", points: 1 },
        build: (lv) => ({ fields: { critSpec: false, foretellHarm: true, curse: { mystery: "tempest", max: lv >= 17 ? 4 : lv >= 11 ? 3 : 2 }, ...(lv >= 17 ? { saveDegrees: [{ saves: ["will"], adjustment: { success: "one-degree-better", criticalFailure: "one-degree-better" } }] } : {}) } })
    },
    psychic: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: k, wis: minor(lv), cha: 1 }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [9, E]], ref: [[1, T], [5, E]], will: [[1, E], [11, M], [17, L]], perception: [[1, T], [11, E]],
        caster: { tradition: "occult", attr: "int", slots: 2, extra: ["Imaginary Weapon"] }, psyche: true,
        // (2026-11-10, Fortress of Will (17th): a critical failure at a Will save a failure — its half damage on a failure not played.)
        build: (lv) => ({ fields: { critSpec: false, ...(lv >= 17 ? { saveDegrees: [{ saves: ["will"], adjustment: { success: "one-degree-better", criticalFailure: "one-degree-better" } }] } : {}) } })
    },
    ranger: {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: second(lv) - 1, dex: k, con: martialCon(lv), int: 0, wis: minor(lv), cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [11, E], [19, M]],
        fort: [[1, E], [11, M]], ref: [[1, E], [7, M], [15, L]], will: [[1, T], [3, E]], perception: [[1, E], [7, M], [15, L]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            // An archer with the precision edge: a longbow, Hunt Prey's precision dice on the first hit each round; Hunted Shot.
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const bow = { ...weaponStrike(lv, { name: "Longbow", die: 8, type: "piercing", toHit: a.dex, damageAttr: 0, prof, group: "bow", extra: { held: true, hands: 2, volley: 30, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 10 } } }), melee: false, increment: 100 };
            const sword = weaponStrike(lv, { name: "Shortsword", die: 6, type: "piercing", toHit: a.dex, damageAttr: a.str, prof, group: "sword", extra: { agile: true, finesse: true } });
            return { strikes: [bow, sword], fields: { huntPrey: { edge: "precision", precisionDice: lv >= 19 ? 3 : lv >= 11 ? 2 : 1, die: 8 }, multiStrikes: [{ name: "Hunted Shot", actions: 1, strikes: ["longbow", "longbow"], oncePerTurn: true, preyOnly: true, sameTarget: true, flourish: true }] } };
        }
    },
    runesmith: {
        // (2026-11-02, the user's Archives of Nethys page, Impossible Magic: expert Fortitude and Will, trained Reflex; Shield Block; Forged
        // Endurance at 11th — master Fortitude, a success a critical success —; no weapon specialization, Runic Optimization at 7th in its
        // place: 2/3/4 damage with a striking/greater/major striking weapon, 4/6/8 from 15th. Its runes (Trace Rune, Invoke Rune) wait on
        // the rune list, which neither the page nor PF2e's data has.)
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: second(lv), dex: 1, con: martialCon(lv), int: k, wis: minor(lv), cha: 0 }),
        armor: "medium", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, E], [11, M]], ref: [[1, T], [7, E]], will: [[1, E]], perception: [[1, T], [13, E]],
        classDC: [[1, T], [7, E], [15, M], [19, L]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const steps = striking(lv) - 1;
            const optimization = lv >= 15 ? 2 * steps + 2 : lv >= 7 && steps > 0 ? steps + 1 : 0;
            const hammer = weaponStrike(lv, { name: "Warhammer", die: 8, type: "bludgeoning", toHit: a.str, damageAttr: a.str, prof, group: "hammer", extra: { held: true } });
            // Offensive Boost (9th, 2026-11-06): a weapon innovation's Strikes deal 1d6 more (Ignition, fire).
            if (lv >= 9) hammer.damage.push({ dice: 1, die: 6, bonus: 0, type: "fire" });
            hammer.damage[0].bonus = a.str + optimization;
            // (2026-11-02, the user's rune list.) Etched on the warhammer: marssyl, rune of impact — 1 bludgeoning splash damage per weapon
            // damage die.
            hammer.damage.push({ dice: 0, die: 0, bonus: striking(lv), type: "bludgeoning", splash: true });
            const hardness = lv >= 13 ? 10 : lv >= 7 ? 8 : 5;
            // (2026-11-10: etched too — holtrik, rune of dwarven ramparts, on its shield: +1 status bonus to AC while raised (taken into the
            // shield's bonus); from 9th, when it etches three, kojastri, rune of insulation, on its armor: fire resistance 4, 1 more every 2
            // levels (its 2 damage to creatures that touch it not played).)
            return { strikes: [hammer], spells: runesmithRunes(lv, 10 + lv + rank(lv, [[1, T], [7, E], [15, M], [19, L]]) + a.int), fields: { shield: { ac: 3, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false }, reactions: { aoo: false, shieldBlock: true },
                ...(lv >= 9 ? { resistances: [{ type: "fire", value: 4 + Math.floor((lv - 9) / 2), exceptions: [] }] } : {}),
                ...(lv >= 11 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better" } }] } : {}) } };
        }
    },
    sorcerer: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [5, E]], ref: [[1, T], [9, E]], will: [[1, E], [17, M]], perception: [[1, T], [11, E]],
        // (2026-11-10, Cole: "get them working" — its bloodline, the elemental (fire) one its Elemental Toss is from: primal spells, not arcane;
        // its sorcerous gifts first at their ranks (Ignition, Breathe Fire, Fireball, Earthquake, Wrathful Storm) and its blood magic,
        // Elemental Fury: a bloodline spell deals one target 1 fire damage a rank more (spells.js withCasterDamage).)
        caster: { tradition: "primal", attr: "cha", slots: 4, extra: ["Ignition"], lead: { 1: ["Breathe Fire"], 3: ["Fireball"], 8: ["Earthquake"], 9: ["Wrathful Storm"] } }, focus: { names: ["Elemental Toss"], attr: "cha", points: 1 }, potency: true,
        build: () => ({ fields: { critSpec: false, bloodMagic: { type: "fire", spells: ["Ignition", "Breathe Fire", "Fireball", "Earthquake", "Wrathful Storm", "Elemental Toss"] } } })
    },
    summoner: {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: 0, dex: 2, con: martialCon(lv), int: 0, wis: minor(lv), cha: k }),
        // (2026-11-10: Defensive Robes — expert unarmored at 13th, never master; Twin Juggernauts — Fortitude master at 11th.)
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, E], [11, M]], ref: [[1, T], [9, E]], will: [[1, E], [15, M]], perception: [[1, T], [3, E]],
        caster: { tradition: "arcane", attr: "cha", topTwo: 2, prof: (lv) => rank(lv, [[1, T], [9, E], [17, M]]) },
        build(lv, a) {
            // The eidolon (a beast eidolon: Strength 4 and up, its unarmed steps, its own AC) as its own body beside the summoner, sharing
            // its Hit Points (fight.js), two actions each (three between them and Act Together's one more); Boost Eidolon among its cantrips.
            const str = key(lv) + (lv >= 17 ? 1 : 0); // (Eidolon Transcendence: +1 to its Strength at 17th.)
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const jaws = weaponStrike(lv, { name: "Jaws", die: 8, type: "piercing", toHit: str, damageAttr: str, prof, group: "brawling", extra: { unarmed: true } });
            const claw = weaponStrike(lv, { name: "Claw", die: 6, type: "slashing", toHit: str, damageAttr: str, prof, group: "brawling", extra: { unarmed: true, agile: true } });
            const eidolonAC = 10 + lv + rank(lv, [[1, T], [11, E], [19, M]]) + 2 + 3 + armorPotency(lv);
            // (Boost Eidolon, the summoner's one action each turn: +2 status damage a weapon die, to +8 — on the eidolon's Strikes; Act Together's
            // fourth action: the eidolon's two, the summoner's one.)
            const boost = Math.min(8, 2 * striking(lv));
            for (const strike of [jaws, claw]) strike.damage = [...strike.damage, { dice: 0, die: 0, bonus: boost, type: strike.damage[0].type, source: "Boost Eidolon" }];
            const eidolon = (summoner) => ({
                ...structuredClone(summoner), id: "eidolon", name: "Eidolon", kind: "npc", traits: ["eidolon", "beast"], sharesHpWith: summoner.id, actionsPerTurn: 2, actTogether: false, boostEidolon: 0,
                ac: eidolonAC, strikes: [jaws, claw].map((strike) => ({ ...strike, ...(potency(lv) ? { iwr: { ...strike.iwr, traits: ["magical"] } } : {}) })), spells: (summoner.spells ?? []).filter((entry) => entry.kind === "basic"), spellPools: {},
                skills: { athletics: lv + rank(lv, [[1, T], [5, E], [13, M]]) + str, intimidation: lv + T }, classDC: null, heroPoints: 0, reactions: { aoo: false, shieldBlock: false }, critSpec: lv >= 7,
                // (2026-11-10, Cole's pick "All fixes, with impulses": a beast eidolon's abilities — Beast's Charge (1st: Stride twice, then
                // Strike; its straight-line +1 not played), Primal Roar (7th, Eidolon Symbiosis: Demoralize at each foe within 30 feet with one
                // Intimidation check, as their Will save against its DC; once a fight for Demoralize's immunity), Whirlwind Maul (17th, Eidolon
                // Transcendence: a Strike at up to four foes in reach, the same penalty for each).)
                charges: [{ name: "Beast's Charge", actions: 2, strides: 2, strike: null, attackBonus: 0, damage: null }],
                ...(lv >= 17 ? { multiStrikes: [{ name: "Whirlwind Maul", actions: 2, strikes: [null], each: true, sameMap: true, max: 4 }] } : {}),
                ...(lv >= 7 ? { spells: [...(summoner.spells ?? []).filter((entry) => entry.kind === "basic"), roar], spellPools: { "eidolon:roar": 1 } } : {})
            });
            const roar = lv >= 7 ? { name: "Primal Roar", plan: savePlan("Primal Roar", { actions: 2, traits: ["auditory", "emotion", "fear", "mental", "eidolon"], area: { type: "emanation", value: 30, foes: true }, save: "will", dc: 10 + lv + T, effects: { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null]] } }), castRank: Math.ceil(lv / 2), dc: 10 + lv + T, attack: null, pool: "eidolon:roar", kind: "ability", actionType: "action", rechargeGroup: "Primal Roar" } : null;
            return { strikes: [], fields: { actionsPerTurn: 2, actTogether: true, boostEidolon: boost }, companions: [eidolon] };
        }
    },
    // (2026-11-24, Cole: "get the stand class archetype working in the simulator and run it to see how well it performs in teams and
    // solo"; then, his pick "Test the other 6 stand types first".) A summoner with the Stand User class archetype (homebrew, the PF2e Stand
    // Class Archetype module, Cole's design doc "JoJo Stands in PF2e"): no spell slots, no Boost Eidolon, no beast eidolon abilities; a
    // ghostly stand (resistance to all damage, half its level, but force, spirit and ghost touch) of one of the seven types, its stat grades
    // (the doc's stats sketch: Durability A +2 AC and ghostly resistance +2, E −2 AC; Precision A +1 to stand Strikes and Stand Ability DCs,
    // E −1; B and D halfway, rounded toward C; the Power grade shifts the primary die; Speed's initiative isn't played) and a Stand Ability
    // against its stand DC (the summoner's spell DC steps). Stand Points: 2 (focus). See standUser below for each type.
    //   "stand-user" (the close-range power stand, as first run) and "stand-user-rush" (with Barrage Rush, its 1st-level class feat: 2
    //   actions, three stand Strikes at one target at the normal multiple attack penalty, once a turn).
    "stand-user": standUser("close"),
    "stand-user-rush": standUser("close", { rush: true }),
    "stand-long": standUser("long"),
    "stand-automatic": standUser("automatic"),
    "stand-automatic-dart": standUser("automatic", { ability: "dart" }),
    // (2026-11-24, Cole: "Simulate the automatic stand with these changes with the user present".) The same two with the user kept out of
    // the stand's sight and out of the fight from 7th (Relentless Program): untargetable, no actions but Feed the Program each turn (the
    // stand's second action — an absent user can't Act Together); the stand Autonomous (autonomousStand below). Its Stand Ability is the
    // user's: not used while it hides. Levels 1 to 6 as the stand beside its user.
    "stand-automatic-hidden": standUser("automatic", { hidden: true }),
    "stand-automatic-dart-hidden": standUser("automatic", { ability: "dart", hidden: true }),
    "stand-colony": standUser("colony"),
    "stand-bound": standUser("bound"),
    "stand-integrated": standUser("integrated"),
    "stand-evolving": standUser("evolving"),
    // (2026-11-24, Cole: "Be sure to test the mythic heaven stand too".) The close-range stand with Barrage Rush that ascends: the Heaven
    // Ascension mythic destiny (the module's content/feats.mjs) at 12th, three Mythic Points a fight (the simulator's mythic rule, B72), its
    // user's and its stand's one pool. Its feats, one at each even level it can take one: 12th the Dedication (ghostly resistance doubled; its
    // "next Strike or DC at mythic proficiency" not played — the points go to the feats below) and DIO's Bone's free Universal Acceleration
    // (1 action, 1 Mythic Point: quickened for the fight; foes' reactions against it not played); 14th Mythic Stand (free, 1 Mythic Point at
    // the stand's turn: its Strikes at mythic proficiency, +4 over master, till its next turn; ignoring non-mythic resistance not played);
    // 16th Eternal Will (reaction, 1 Mythic Point: stays at 1 HP — its stand's 2 actions then not played); 18th Infinite Rotation (1 Mythic
    // Point when the stand hits: the Strike's damage dice again at the start of each of the target's turns until it dies); 20th Restore Truth
    // (nothing in these fights to counteract). Points: Universal Acceleration first, then Infinite Rotation on a hit at a creature with a third
    // or more of its HP, one kept for Eternal Will, Mythic Stand with what's left.
    "stand-heaven": standUser("close", { rush: true, heaven: true }),
    swashbuckler: {
        seat: "rogue", hp: 10, attrs: (k, lv) => ({ str: second(lv) - 1, dex: k, con: martialCon(lv), int: 0, wis: minor(lv), cha: second(lv) - 1 }),
        armor: "light", armorSteps: [[1, T], [13, E], [19, M]],
        fort: [[1, T], [3, E]], ref: [[1, E], [7, M], [13, L]], will: [[1, E], [17, M]], perception: [[1, E], [11, M]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const rapier = weaponStrike(lv, { name: "Rapier", die: 6, type: "piercing", toHit: a.dex, damageAttr: a.str, prof, group: "sword", extra: { finesse: true, held: true, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 8 } } });
            const finisher = { name: "Confident Finisher", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, finisher: "confident", onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null, traits: ["finisher"] };
            return { strikes: [rapier], skills: { deception: lv + primarySkill(lv) + a.cha }, fields: { panacheStyle: { bravado: ["feint", "create-a-diversion"], precise: 2 + steps(lv), finisherDice: 2 + steps(lv) }, strikeActivities: [finisher], ...(lv >= 3 ? { opportuneRiposte: true } : {}) } };
        }
    },
    thaumaturge: {
        seat: "fighter", hp: 8, attrs: (k, lv) => ({ str: second(lv), dex: 1, con: martialCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "medium", armorSteps: [[1, T], [11, E], [19, M]],
        fort: [[1, E]], ref: [[1, T], [3, E]], will: [[1, E], [7, M]], perception: [[1, E], [9, M]],
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const sword = weaponStrike(lv, { name: "Longsword", die: 8, type: "slashing", toHit: a.str, damageAttr: a.str, prof, group: "sword", extra: { held: true } });
            // Implement's Empowerment (2026-11-06): 2 more damage per weapon damage die with a one-handed weapon and the implement in the other hand.
            sword.empowerment = 2 * sword.damage[0].dice;
            sword.damage[0].bonus += sword.empowerment;
            return { strikes: [sword], fields: { exploit: { name: "Exploit Vulnerability", modifier: lv + primarySkill(lv) + a.cha, antithesis: 2 + Math.floor(lv / 2) } } };
        }
    },
    witch: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: k, wis: minor(lv), cha: 0 }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [5, E]], ref: [[1, T], [9, E]], will: [[1, E], [17, M]], perception: [[1, T], [11, E]],
        // (2026-11-10, Cole: "get them working" — The Resentment's spell list is occult, not primal; its lesson's spell, Enfeeble, its familiar
        // knows. Its familiar's abilities beyond its patron's: Lifelink (1st), Spell Battery (6th: a slot three ranks below its highest);
        // its 12th- and 18th-level ones (Damage Avoidance, Tough and the like) change nothing a fight reads. Patron's Puppet and Phase
        // Familiar, its familiar's own actions and defence, aren't played: the familiar takes no actions here.)
        caster: { tradition: "occult", attr: "int", slots: 3, extra: ["Evil Eye"], lead: { 1: ["Enfeeble"] }, battery: 6 },
        // (2026-11-05: its familiar — The Resentment's, whose lesson gives Evil Eye: Familiar of Ongoing Misery —, beside it.)
        companions: [(c) => familiarFor(c, { hexAbility: "familiar-of-ongoing-misery", lifelink: true })]
    }
};
// The Stand User (CLASSES "stand-user" and the other "stand-…"): the summoner chassis with a stand of a type, and Flame (Magician's Red,
// open to every type: 1 action, a creature within 30 feet, D fire — 1d6, a die more at 5/9/13/17 — basic Reflex; a surge for a Stand
// Point from 5th, 2 actions, a 15-foot cone of S fire — 2d6, 2d6 more every odd level —; from 13th six ankhs at up to 6 creatures within
// 30 feet, half S each; a critical failure on the ankh grabs it a round from 9th; from 17th 2d6 persistent fire on any failed save), so
// the types are compared on one ability. The types (the doc's "Stand types" and the module's type features):
//   close       Power A (fist d10), Speed B, Durability C, Precision C, Potential D, Range E. Point-Blank Power: forceful (within 10 feet of
//               the user, taken as always); Point-Blank Fury (7th): a die more on a creature adjacent to the user; Blinding Speed (13th): a
//               reaction Strike at a creature that comes into its reach.
//   long        Range A, Precision B, Power C (tendril d8), Speed C, Durability D, Potential E. Remote Eyes and Far Eyes: senses, nothing a
//               fight here plays; Long Arm (13th): its Stand Ability's range doubles (Flame at 60 feet).
//   automatic   Durability A, Power B (ram d8), Speed C, Range C, Potential D, Precision E. Its Program's end-of-turn action and Feed the
//               Program come to Act Together's actions here; Relentless and Undying Program (out of sight, destroyed) nothing a fight
//               here plays. "stand-automatic-dart": its own Melting Dart (Ratt, automatic only) for Flame: 1 action, 30 feet, D acid with
//               an attack roll; persistent 1d6 acid on a hit from 5th; a surge from 9th, darts at up to 3 creatures, half S each; clumsy 1
//               on a critical hit from 13th.
//   colony      Precision A, Speed B, Power C (many hands d8), Durability C, Range D, Potential E. Many Hands: weakness to area damage, half
//               its level; Spread Thin (7th): resistance to Strikes, half its level (as physical damage); Overwhelm (13th): 2 actions,
//               its fist's damage at each foe in a 15-foot area, basic Reflex against the stand DC (allies left out of it here).
//   bound       Durability A, Power B (blade d8), Precision C, Range C, Speed D, Potential E. Vessel: the user Strikes with the bound
//               weapon at the stand's attack modifier and damage; the stand acts through it (its body, the animated vessel, beside it).
//   integrated  Power A (fist d10), Durability B, Speed C, Precision C, Potential D, Range E. Worn Stand: merged, one body — the user,
//               its unarmed Strikes at the stand's numbers, the stand's Act Together actions its own (3 a turn, one attack penalty) —, no
//               stand to hit and no ghostly resistance; Second Skin (7th): +1 status to AC; Full Merge (13th): a stand action costs no
//               action once a turn (4 actions).
//   evolving    Precision A, Power B (fist d8), Speed C, Durability C, Range D, Potential E. No type perk; Acts from Flame's theme (Force
//               and Energy): Act Two (7th) Ice (Horus: 1 action, 30 feet, D cold basic Reflex; a surge from 9th, a 10-foot burst of S cold;
//               its −10-foot Speed on a critical failure from 13th not played), Act Three (13th) Air Shots (Stray Cat: 1 action, 30 feet, D
//               bludgeoning with an attack roll; a surge, 3 bubbles at up to 3 creatures, S/2 each). Switching Acts (1 action) isn't
//               played: every Act is ready.
// (2026-11-25 BOUND_GUARD, on by default since 2026-11-25 (Cole adopted it; BOUND_GUARD=0 turns it off): Vessel Guard — when a Strike hits the user, the vessel takes the blow: its Hardness
// (half the user's level, minimum 1; its level from 7th) off the damage, the user's reaction, once a round. Played as Shield Block with the
// vessel as a shield always raised (a stance entered as initiative is rolled; no AC bonus, no Hit Points to break). "Can't be disarmed while
// the stand is manifested": not played — foes don't Disarm in the sim.)
function vesselGuard(lv, user) {
    const hardness = lv >= 7 ? lv : Math.max(1, Math.floor(lv / 2));
    const model = { name: "Vessel Guard", rounds: Infinity, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, shieldUp: true };
    return {
        shield: { name: "Vessel", ac: 0, hardness, hp: 1e9, maxHp: 1e9, bt: 0, broken: false, raised: true },
        reactions: { ...(user?.reactions ?? { aoo: false }), shieldBlock: true },
        selfEffects: [...(user?.selfEffects ?? []), { name: "Vessel Guard", actions: 1, stance: true, model }],
        stanceAtStart: "Vessel Guard"
    };
}
function standUser(type, { rush = false, ability = "flame", heaven = false, hidden = false, standAbility = null, bystanders = false, buffedBuild = false } = {}) {
    const GRADES = {
        close: { power: "A", durability: "C", precision: "C" }, long: { power: "C", durability: "D", precision: "B" },
        automatic: { power: "B", durability: "A", precision: "D" }, colony: { power: "C", durability: "C", precision: "A" },
        bound: { power: "B", durability: "A", precision: "C" }, integrated: { power: "A", durability: "B", precision: "C" },
        evolving: { power: "B", durability: "C", precision: "A" }
    };
    const grade = GRADES[type];
    const durAC = { A: 2, B: 1, C: 0, D: -1, E: -2 }[grade.durability];
    const durRes = { A: 2, B: 1 }[grade.durability] ?? 0;
    // (2026-11-24, Cole's pick "Raise the weak types": a stand of Durability A or B guards its user too — +2 or +1 circumstance to the
    // user's AC while the stand is adjacent, taken as always: the stand fights beside it.)
    const guard = Math.max(0, durAC);
    const prec = { A: 1, B: 0, C: 0, D: 0, E: -1 }[grade.precision];
    const primaryDie = { A: 10, B: 8, C: 8, D: 6, E: 6 }[grade.power];
    const names = { close: ["Fist", "Kick"], long: ["Tendril", "Whip"], automatic: ["Ram", "Bite"], colony: ["Many Hands", "Tiny Weapons"], bound: ["Blade", "Hilt"], integrated: ["Fist", "Body Weapon"], evolving: ["Fist", "Tail"] }[type];
    return {
        seat: "fighter", hp: 10, attrs: (k, lv) => ({ str: 0, dex: 2, con: martialCon(lv), int: 0, wis: minor(lv), cha: k }), noBackupBow: true,
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, E], [11, M]], ref: [[1, T], [9, E]], will: [[1, E], [15, M]], perception: [[1, T], [3, E]],
        // (Stand DC: the summoner's spellcasting steps — expert at 9th, master at 17th — with Charisma.)
        classDC: [[1, T], [9, E], [17, M]],
        build(lv, a) {
            const str = key(lv) + (lv >= 17 ? 1 : 0); // (Stand Transcendence: +1 to its Strength at 17th.)
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            // (2026-11-24, Cole's pick "Give both an earlier combat perk": a long-range stand's Distant Precision at 7th, close-range's Point-Blank
            // Fury mirrored — a die more on a creature not adjacent to the user.)
            // (2026-11-24, Cole: "Make the heaven stands stronger. I want a mythic class but [to] beat all non mythic classes in combat" — at every
            // level from 12th, where it ascends; levels 1 to 11 as the close-range stand with Barrage Rush.) The Heaven buffs, tried in tiers
            // until it beat every other class at each level 12 to 20 (team and solo) — tier 6, all of them, is the one played:
            //   1  the Dedication: its stand's Strikes and its Stand Ability DC always at mythic proficiency, 10 + level (AoN Rules.aspx?ID=3322),
            //      no Mythic Point needed.
            //   2  Heaven's Grace, also the Dedication's: the user and the stand resist non-mythic creatures' Strikes and spells, half its level
            //      (the monsters' Mythic Resistance, AoN Rules.aspx?ID=3341) — on the stand added to its ghostly resistance.
            //   3  Mythic Stand (14th) passive: its stand's Strikes deal weapon specialization damage 12 (Mythic Weapon Specialization, AoN
            //      Feats.aspx?ID=7387).
            //   4  Eternal Will (16th) as Undying Myth (AoN Rules.aspx?ID=3341): free, once a fight, at 0 HP it spends all its Mythic Points
            //      (none needed) and stays up at half its maximum HP (its stand's 2 actions then not played).
            //   5  Mythic regeneration: a Mythic Point back (3 at most, AoN Rules.aspx?ID=3323) when its stand drops a foe.
            //   6  Eternal Will, as Undying Myth, from 12th with the Dedication.
            const HT = heaven ? 6 : 0;
            const myth = heaven && lv >= 12 && HT >= 1 ? 10 - prof : 0;
            const fury = type === "close" && lv >= 7 ? { partnerDie: true } : type === "long" && lv >= 7 ? { partnerDie: "far" } : {};
            const runes = (strike) => ({ ...strike, iwr: { ...strike.iwr, ...(potency(lv) ? { traits: ["magical"] } : {}), runes: ["ghost-touch"] } });
            const main = runes(weaponStrike(lv, { name: names[0], die: primaryDie, type: "bludgeoning", toHit: str + prec + myth, damageAttr: str, prof, group: "brawling", extra: { unarmed: true, ...(type === "close" ? { forceful: true } : {}), ...fury } }));
            const second = runes(weaponStrike(lv, { name: names[1], die: 6, type: type === "bound" ? "bludgeoning" : type === "automatic" ? "piercing" : "bludgeoning", toHit: str + prec + myth, damageAttr: str, prof, group: "brawling", extra: { unarmed: true, agile: true, finesse: true, ...fury } }));
            if (heaven && lv >= 14 && HT >= 3) for (const strike of [main, second]) strike.damage = strike.damage.map((part, index) => (index === 0 ? { ...part, bonus: str + 12 } : part));
            if (type === "bound") Object.assign(main, { damage: main.damage.map((part, index) => (index === 0 ? { ...part, type: "slashing" } : part)), iwr: { ...main.iwr, group: "sword" } });
            const standAC = 10 + lv + rank(lv, [[1, T], [11, E], [19, M]]) + 2 + 3 + armorPotency(lv) + durAC;
            const half = Math.max(1, Math.floor(lv / 2));
            const ascended = heaven && lv >= 12;
            const grace = ascended && HT >= 2 ? half : 0;
            const ghostly = [{ type: "all-damage", value: (half + durRes) * (ascended ? 2 : 1) + grace, exceptions: ["force", "ghost-touch", "spirit"] }];
            const undying = HT >= 4;
            const willAt = HT >= 6 ? 12 : 16;
            const reserve = lv >= willAt && !undying ? 1 : 0;
            const eternalWill = lv >= willAt ? { ferocityRule: undying ? { name: "Eternal Will", hp: "half", wounded: false, free: true, pc: true, spendAllMythic: true, oncePerPool: true } : { name: "Eternal Will", hp: 1, wounded: false, mythic: true, pc: true } } : {};
            const heavenStand = ascended ? { sharedMythic: true, universalAcceleration: false, heavenReserve: reserve, ...(lv >= 14 && HT < 1 ? { mythicStand: 4 } : {}), ...eternalWill, ...(lv >= 18 ? { infiniteRotation: true } : {}), ...(HT >= 5 ? { mythicRegen: true } : {}) } : {};
            const heavenUser = ascended ? { mythicPoints: 3, universalAcceleration: true, heavenReserve: reserve, ...eternalWill, ...(grace ? { resistances: [{ type: "all-damage", value: grace, exceptions: [] }] } : {}) } : {};
            const dc = 10 + lv + (myth ? 10 : rank(lv, [[1, T], [9, E], [17, M]])) + a.cha + prec;
            const attack = dc - 10;
            const D = (kind) => `${1 + steps(lv)}d6[${kind}]`;
            const S = (kind) => `${2 * Math.ceil(lv / 2)}d6[${kind}]`;
            const halfS = (kind) => `${Math.ceil(lv / 2)}d6[${kind}]`;
            const range = type === "long" && lv >= 13 ? "60 feet" : "30 feet";
            const pool = "stand-user:focus";
            const make = (name, { actions, damage, kind, area = null, target = "1 creature", surge = false, effects = {}, save = "reflex", attackRoll = false, extra = {} }) => {
                const plan = savePlan(name, { actions, traits: ["concentrate", "occult", "stand", kind], area, target, range, save, attack: attackRoll, dc, damage, basic: true, extra, effects });
                if (area && area.type === "burst") plan.targeting.range = range;
                plan.source.type = "action";
                plan.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
                return { name, plan, castRank: Math.ceil(lv / 2), dc, attack: attackRoll ? attack : null, pool: surge ? pool : null, kind: "ability", actionType: "action", rechargeGroup: name };
            };
            const round1 = { mode: "fixed", value: 1, unit: "rounds" };
            const spells = [];
            // (2026-11-24, a Stand Ability of the module in Flame's place — stand-abilities/index.js.)
            let custom = null;
            if (standAbility) {
                const rounds = (n) => ({ mode: "fixed", value: n, unit: "rounds" });
                const effectModel = (name, roundsOf, parts) => ({ name, rounds: roundsOf, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...parts });
                const entry = (name, plan, { surge = false, actionType = "action", attackRoll = false, pool: own = null } = {}) => {
                    plan.source.type = "action";
                    return { name, plan, castRank: Math.ceil(lv / 2), dc, attack: attackRoll ? attack : null, pool: own ?? (surge ? pool : null), kind: "ability", actionType, rechargeGroup: name };
                };
                // (2026-11-24, Cole: "Any stand that can turn others into a source of damage such as the Dinosaurify add noncombatants that
                // they could use their stand on as potential weapons.") Bystanders, in those abilities' fights only (bystanders: true): 2 commoners
                // and 2 Tiny animals (level −1, GM Core Low numbers) that foes ignore and that do nothing — off the field as the user's reserves
                // (summons.js), so no one can touch them until the stand converts one: convert(name, …) is a summon entry that brings one in
                // on the user's side, as the ability makes it (a dinosaur, a raptor minion, a controlled creature). Each kind is used up once
                // converted. (Approximation: a converted creature is played as fighting the foes — the text's "attacks the nearest creature"
                // or one controlled action is played as its turn on the user's side —, and a surge conversion has its own single use instead of
                // drawing on the 2 Stand Points.)
                const BYSTANDERS = { commoner: { count: 2, name: "Commoner", ac: 12, hp: 6, saves: { fortitude: 2, reflex: 2, will: 2 }, speed: 25, traits: ["humanoid"], strikes: [{ name: "Fist", bonus: 4, melee: true, agile: true, unarmed: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] }] }, animal: { count: 2, name: "Tiny animal", ac: 13, hp: 4, saves: { fortitude: 3, reflex: 5, will: 1 }, speed: 20, traits: ["animal"], strikes: [{ name: "Bite", bonus: 4, melee: true, unarmed: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] }] } };
                const used = { commoner: 0, animal: 0 };
                const reserves = [];
                const summons = [];
                const convert = (name, { from, count = 1, actions = 2, lasts = 10, uses = 1, initiative = "minion", as = (base) => base, surge = false, forced = false }) => {
                    if (!bystanders) return null;
                    const free = BYSTANDERS[from].count - used[from];
                    const n = Math.min(count, free);
                    if (n <= 0) return null;
                    const ids = [];
                    for (let index = 0; index < n; index++) {
                        const k = used[from]++;
                        const base = BYSTANDERS[from];
                        const made = as({ id: `bystander-${from}-${k}`, name: `${base.name} ${k + 1}`, kind: "npc", level: -1, traits: [...base.traits], hp: { value: base.hp, max: base.hp }, ac: base.ac, saves: { ...base.saves }, perception: 2, speed: base.speed, reach: 5, strikes: structuredClone(base.strikes), reactions: { aoo: false, shieldBlock: false }, senses: [] });
                        reserves.push(made);
                        ids.push(made.id);
                    }
                    const summon = { name, actions, count: n, perUse: n, uses, lasts, initiative, reserveIds: ids, ...(surge ? { surge: true } : {}), ...(forced ? { featForced: true } : {}) };
                    summons.push(summon);
                    return summon;
                };
                // (2026-11-27, Invisible Dead, Cole: "does the sim actually look for nearby corpses for the ability price?" — raise(name, …): a
                // summon entry of real zombies, off the field as the user's reserves until raised — 2 actions each, one at a time, up to count —,
                // then targetable minions (level − 2, GM Core Low AC, HP, saves and Strike; invisible) that act after the user when commanded,
                // one action a turn for all of them (summons.js sustained), for 1 minute. corpse: "start" (a graveyard or a battlefield: bodies
                // from round 1) or "fight" (none at first: each needs a creature that died this fight — summons.js canSummon). fromCorpse (17th):
                // the zombie takes that creature's size and reach.)
                const zombieReserves = [];
                const raise = (name, { count = 1, corpse = "fight", fromCorpse = false, strike, ac, hp, saves, level, mass = false, free = false, riseOnDeath = false, riseStrike = false, minionActions = 2, prefix = "zombie", label = "Invisible zombie", traits = ["minion", "mindless", "undead", "zombie"], invisible = true, more = {}, spare = 0 }) => {
                    const ids = [];
                    for (let index = 0; index < count + spare; index++) {
                        const made = { id: `${prefix}-${index}`, name: `${label} ${index + 1}`, kind: "npc", level, traits: [...traits], hp: { value: hp, max: hp }, ac, saves: { ...saves }, perception: saves.will, speed: 25, reach: 5, strikes: [structuredClone(strike)], reactions: { aoo: false, shieldBlock: false }, senses: [], ...(invisible ? { permanent: [{ slug: "invisible" }], immunities: ["death-effects", "disease", "mental", "paralyzed", "poison", "unconscious"] } : {}), ...(minionActions !== 2 ? { minionActions } : {}), ...structuredClone(more) };
                        zombieReserves.push(made);
                        ids.push(made.id);
                    }
                    const summon = { name, actions: 2, count: mass ? count : 1, perUse: mass ? count : 1, uses: count + spare + (corpse === "fight" ? 2 : 0), lasts: 10, initiative: "minion", sustained: !free, max: count, corpse, ...(mass ? { mass: true } : {}), ...(riseOnDeath ? { riseOnDeath: true } : {}), ...(riseStrike ? { riseStrike: true } : {}), ...(fromCorpse ? { fromCorpse: true } : {}), reserveIds: ids };
                    summons.push(summon);
                    return summon;
                };
                // (2026-11-24, Cole: "Buff all the stand abilities to be closer in power with each other. Dont lower any yet." — the buffed
                // rule text, ctx.buffed: STAND_BUFFED=1, or a build named "<slug>-buffed"; the stand10 balance.)
                const ctx = { lv, dc, attack, D, S, halfS, range, pool, make, entry, savePlan, effectModel, rounds, minutes: (n) => rounds(10 * n), round1, steps: steps(lv), main, second, bystanders, convert, raise, buffed: buffedBuild || globalThis.process?.env?.STAND_BUFFED === "1" };
                custom = STAND_ABILITIES[standAbility].build(ctx) ?? {};
                // (A conversion the planner never picks — a commoner's fist, worth nothing to it — is forced, the brief's rule: forceUse with its
                // entry's featForced, planner.js's forcedSummon.)
                if (summons.length) custom = { ...custom, user: { ...(custom.user ?? {}), summons: [...(custom.user?.summons ?? []), ...summons], ...(summons.some((each) => each.featForced) ? { forceUse: true } : {}) }, bystanderReserves: [...reserves, ...zombieReserves] };
                if (STAND_ABILITY_FORCED.includes(standAbility) && custom.spells?.length) custom = { ...custom, spells: custom.spells.map((each) => ({ ...each, featForced: true })), user: { ...(custom.user ?? {}), forceUse: true } };
                spells.push(...(custom.spells ?? []));
            }
            if (ability === "flame" && !standAbility) {
                const burn = lv >= 17 ? { failure: ["2d6[persistent,fire]"], criticalFailure: ["2d6[persistent,fire]"] } : {};
                spells.push(make("Flame (ankh)", { actions: 1, damage: D("fire"), kind: "fire", extra: burn, effects: lv >= 9 ? { criticalFailure: [["grabbed", null, round1]] } : {} }));
                if (lv >= 5) spells.push(make("Flame (surge cone)", { actions: 2, damage: S("fire"), kind: "fire", area: { type: "cone", value: 15 }, surge: true, extra: burn }));
                if (lv >= 13) spells.push(make("Flame (surge ankhs)", { actions: 2, damage: halfS("fire"), kind: "fire", target: "up to 6 creatures", surge: true, extra: burn }));
            } else if (ability === "dart") {
                const acid = lv >= 5 ? { success: ["1d6[persistent,acid]"], criticalSuccess: ["1d6[persistent,acid]"] } : {};
                const clumsy = lv >= 13 ? { criticalSuccess: [["clumsy", 1, { mode: "fixed", value: 10, unit: "rounds" }]] } : {};
                spells.push(make("Melting Dart", { actions: 1, damage: D("acid"), kind: "acid", attackRoll: true, extra: acid, effects: clumsy }));
                if (lv >= 9) spells.push(make("Melting Dart (surge, three darts)", { actions: 1, damage: halfS("acid"), kind: "acid", attackRoll: true, target: "up to 3 creatures", surge: true, extra: acid, effects: clumsy }));
            }
            if (type === "evolving" && lv >= 7) {
                spells.push(make("Ice (shard)", { actions: 1, damage: D("cold"), kind: "cold" }));
                if (lv >= 9) spells.push(make("Ice (surge spears)", { actions: 2, damage: S("cold"), kind: "cold", area: { type: "burst", value: 10 }, surge: true }));
            }
            if (type === "evolving" && lv >= 13) {
                spells.push(make("Air Shots", { actions: 1, damage: D("bludgeoning"), kind: "bludgeoning", attackRoll: true }));
                spells.push(make("Air Shots (surge, three bubbles)", { actions: 2, damage: halfS("bludgeoning"), kind: "bludgeoning", attackRoll: true, target: "up to 3 creatures", surge: true }));
            }
            // (Overwhelm, the colony's 13th: the stand's own 2-action area Strike.)
            const overwhelm = type === "colony" && lv >= 7 ? (() => {
                const part = main.damage[0];
                const entry = make("Overwhelm", { actions: 2, damage: `${part.dice}d${part.die}+${part.bonus}[bludgeoning]`, kind: "bludgeoning", area: { type: "burst", value: lv >= 13 ? 20 : 15, foes: true } });
                return { ...entry, rechargeGroup: null };
            })() : null;
            const spellPools = { ...(spells.some((entry) => entry.pool === pool) ? { [pool]: 2 } : {}), ...(custom?.spellPools ?? {}) };
            const join = (target, more) => {
                for (const [field, value] of Object.entries(more ?? {})) target[field] = Array.isArray(value) && Array.isArray(target[field]) ? [...target[field], ...value] : value;
                return target;
            };
            // (2026-11-25, four Stand User feats Cole adopted, each behind its own switch, off by default — the stand10 measurement:
            //   STAND_FEAT_STARFINGER=1  Star Finger (6th, close-range): once a round, one stand Strike (its primary one here) with 10 feet
            //     more reach, dealing piercing damage — a 1-action Strike activity (planner.js activity.reach; on the grid only).
            //   STAND_FEAT_FLICK=1  Flick Shot (2nd, any stand): 1 action, a small object flicked as a ranged Strike with its primary attack,
            //     range increment 30 feet, its damage dice only (no Strength or specialization), bludgeoning or piercing (versatile).
            //   STAND_FEAT_PINPOINT=1  Pinpoint Strike (4th, close-range; the module's Precision B or better — the close-range stand is C, taken
            //     as allowed): 2 actions, a Strike at -2; on a hit the target drops its best held weapon (picked up again with an Interact, as
            //     the engine's Disarm), or the Strike ignores 5 of its resistance — two Strike activities, the planner picks one.
            //   STAND_FEAT_PULL=1  Pull to Safety (6th, any stand but the integrated): 1 action, an ally within 15 feet of the stand yanked to
            //     a space beside it, no reactions — played on the grid for a hurt ally in a foe's reach, to a space beside the stand no foe
            //     reaches (planner.js / fight.js pullToSafety; the Escape for a grabbed ally not played).)
            const featOn = (flag) => globalThis.process?.env?.[flag] === "1";
            const featActivity = (name, more) => ({ name, actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["stand"], riderSpell: null, ...more, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, ...(more.onHit ?? {}) } });
            const featActivities = [];
            const featStrikes = [];
            if (featOn("STAND_FEAT_STARFINGER") && type === "close" && lv >= 6) {
                const part = main.damage[0];
                featActivities.push(featActivity("Star Finger", { strike: names[0], oncePerTurn: true, reach: 10, damage: `${part.dice}d${part.die}${part.bonus < 0 ? "-" : "+"}${Math.abs(part.bonus)}[piercing]` }));
            }
            if (featOn("STAND_FEAT_PINPOINT") && type === "close" && lv >= 4) {
                featActivities.push(featActivity("Pinpoint Strike (past resistance)", { actions: 2, attackBonus: -2, ignoreResistances: 5 }));
                featActivities.push(featActivity("Pinpoint Strike (disarm)", { actions: 2, attackBonus: -2, onHit: { disarm: true } }));
            }
            if (featOn("STAND_FEAT_FLICK") && lv >= 2) {
                const part = main.damage[0];
                featStrikes.push({ name: "Flick Shot", bonus: main.bonus, potency: main.potency, melee: false, agile: false, increment: 30, held: false, versatile: ["piercing"], iwr: { ...(main.iwr?.traits ? { traits: main.iwr.traits } : {}), runes: ["ghost-touch"] }, ...(main.partnerDie ? { partnerDie: main.partnerDie } : {}), damage: [{ dice: part.dice, die: part.die, bonus: 0, type: "bludgeoning" }] });
            }
            const featFields = { ...(featStrikes.length ? { strikes: featStrikes } : {}), ...(featActivities.length ? { strikeActivities: featActivities } : {}), ...(featOn("STAND_FEAT_PULL") && lv >= 6 ? { pullToSafety: { name: "Pull to Safety", actions: 1, within: 15 } } : {}) };
            if (type === "integrated") {
                // Merged: the user is the one body.
                return {
                    strikes: [main, second, ...featStrikes].map((strike) => ({ ...strike, iwr: { ...strike.iwr, runes: ["ghost-touch"] } })), spells, spellPools,
                    ac: 10 + lv + rank(lv, [[1, T], [13, E]]) + Math.min(a.dex, 99) + armorPotency(lv) + (lv >= 7 ? 1 : 0) + guard, fields: { ...(lv >= 13 ? { extraActions: 1 } : {}), ...(custom?.user ?? {}),
                        // (2026-11-25 INTEGRATED_GHOST, on by default since 2026-11-25 (Cole adopted it; INTEGRATED_GHOST=0 turns it off): merged, the user has the stand's ghostly resistance — half its level, minimum 1, to all damage but force, spirit and ghost touch.)
                        ...(process.env.INTEGRATED_GHOST !== "0" ? { resistances: [...(custom?.user?.resistances ?? []), { type: "all-damage", value: Math.max(1, Math.floor(lv / 2)), exceptions: ["force", "ghost-touch", "spirit"] }] } : {}) }
                };
            }
            const stand = (user) => join(join({
                ...structuredClone(user), summons: [], id: "stand", name: "Stand", kind: "npc", traits: ["eidolon", "stand"], sharesHpWith: user.id, actionsPerTurn: 2, actTogether: false, boostEidolon: 0,
                ac: standAC,
                resistances: [...(user.resistances ?? []), ...ghostly, ...(type === "colony" ? ["bludgeoning", "piercing", "slashing"].map((kind) => ({ type: kind, value: half + durRes + half, exceptions: [] })) : [])],
                ...(type === "colony" ? { weaknesses: [...(user.weaknesses ?? []), { type: "area-damage", value: half, exceptions: [] }] } : {}),
                strikes: [main, second],
                spells: [...(user.spells ?? []).filter((entry) => entry.kind === "basic"), ...(overwhelm ? [overwhelm] : [])], spellPools: {},
                skills: { athletics: lv + prof + str, intimidation: lv + T }, classDC: null, heroPoints: 0, reactions: { aoo: false, shieldBlock: false }, critSpec: lv >= 7,
                ...(type === "close" && lv >= 13 ? { reactionStrikes: [{ name: "Blinding Speed", triggers: ["approach"], strike: null, penalty: 0, disrupts: false }] } : {}),
                ...(rush ? { multiStrikes: [{ name: "Barrage Rush", actions: 2, strikes: [names[0], names[1], names[1]], oncePerTurn: true, sameTarget: true }] } : {}),
                ...heavenStand
            }, custom?.stand), featFields);
            // (The hidden user: out of the fight, its stand Autonomous — Feed the Program each turn, 2 actions.)
            if (hidden && lv >= 7) {
                const loose = (user) => {
                    const own = stand(user);
                    delete own.sharesHpWith;
                    return { ...applyAutonomous({ ...own, reserve: false, heroPoints: 0 }, lv), actionsPerTurn: 2, autonomousOf: user.id };
                };
                return { strikes: [], spells: [], spellPools: {}, fields: { reserve: true, actionsPerTurn: 2, actTogether: false, boostEidolon: 0 }, companions: [loose] };
            }
            // (The bound vessel: the user's own Strike at the stand's numbers.)
            const strikes = type === "bound" ? [{ ...main, iwr: { ...main.iwr } }] : [];
            return { strikes, spells, spellPools, ...(guard ? { ac: 10 + lv + rank(lv, [[1, T], [13, E]]) + Math.min(a.dex, 99) + armorPotency(lv) + guard } : {}), fields: { actionsPerTurn: 2, actTogether: true, boostEidolon: 0, ...heavenUser, ...(custom?.user ?? {}), ...(type === "bound" && process.env.BOUND_GUARD !== "0" ? vesselGuard(lv, custom?.user) : {}) }, companions: [stand, ...(custom?.bystanderReserves ?? []).map((spec) => (user) => ({ ...structuredClone(spec), side: user.side ?? "party", reserve: true, summonedBy: user.id, bystander: true, ...(spec.interceptAttack ? { interceptAttack: { ...spec.interceptAttack, maker: user.id } } : {}) }))] };
        }
    };
}
// (2026-11-24, Cole: "Automatic stands should be more dangerous. They should feel almost impossible to deal with unless you starve the
// program or deal with the user directly.") An automatic stand on its own — its user away, out of its sight: the Autonomous package
// (homebrew, after Sheer Heart Attack — near-indestructible, beaten by cold and by going after Kira), as a lone foe for the simulator.
//   Relentless Program (7th), while it doesn't share damage: its own Hit Points, 5 × its level (the module's rule); +2 to saves; resistance
//   to all damage twice its level (force, spirit and ghost touch: half that); immune to mental, fear and death effects and to grabbed,
//   restrained, paralyzed, slowed and stunned; +3 to its Strikes, their damage dice its level (8 at least — the module's text since); it
//   never backs off;
//   destroyed, it reforms with half its Hit Points at the start of its own next turn.
//   Undying Program (13th): it reforms with full Hit Points (UNDYING_AT; the module: at its user's next turn), endlessly.
//   Its counters: starve the program — no creature that matches it within its 60-foot program sense at the start of its turn, it's
//   dormant and does nothing; two dormant turns in a row, it unmanifests (program.starvedFrom: the round its program starves) —; or its
//   user — knocked out, killed or made to call it off, the stand loses all this and unmanifests (autonomousOf; damage to the user is
//   unaffected).
// (Tuned 2026-11-24 against the standard party, 50 fights at 7th to 20th, one stand action a turn: the party can't win in 10 rounds at
// any of those levels; it deals 8 to 9% of the party's total Hit Points a round from 9th, downs about 2 PCs a fight, and no fight ended
// in a defeat. RES 2: resistance twice its level; DICE 1 + DICE_PER_LEVEL 0.75: a die more and three more every four levels; HIT +3: its
// program locks on; REFORM_FROM 7: from 7th it already reforms, with half its Hit Points (REFORM_EARLY_HP), full from UNDYING_AT.)
export const AUTONOMOUS = Object.freeze({ RES: 2, DICE_MIN: 8, HIT: 3, HP_PER_LEVEL: 5, UNDYING_AT: 13, REFORM_FROM: 7, REFORM_EARLY_HP: 0.5 });
export function autonomousStand(lv, { actions = 1, slug = "stand-automatic", starvedFrom = null, tune = {} } = {}) {
    const stand = structuredClone(classPC(slug, lv).companions[0]);
    delete stand.sharesHpWith;
    const out = applyAutonomous(stand, lv, tune);
    return { ...out, id: "auto-stand", name: "Automatic stand", side: "foes", actionsPerTurn: actions, actTogether: false, program: { ...out.program, ...(starvedFrom != null ? { starvedFrom } : {}) } };
}
// The Autonomous package on a stand that no longer shares damage (from 7th; below that it's the stand as it was, its own Hit Points its
// user's).
function applyAutonomous(stand, lv, tune = {}) {
    const k = { ...AUTONOMOUS, ...tune };
    const relentless = lv >= 7;
    const res = Math.max(1, Math.round(lv * k.RES));
    const hp = relentless ? k.HP_PER_LEVEL * lv : stand.hp.max;
    return {
        ...stand, kind: "npc", traits: [...new Set([...(stand.traits ?? []), "mindless"])], noRetreat: true, hp: { value: hp, max: hp, temp: 0 }, actTogether: false,
        ...(relentless ? {
            resistances: [{ type: "all-damage", value: res, exceptions: ["force", "spirit", "ghost-touch"] }, { type: "all-damage", value: Math.max(1, Math.floor(res / 2)), exceptions: [] }],
            immunities: [...new Set([...(stand.immunities ?? []), "mental", "fear-effects", "death-effects", "grabbed", "restrained", "paralyzed", "slowed", "stunned"])],
            strikes: stand.strikes.map((strike) => ({ ...strike, bonus: strike.bonus + k.HIT, damage: strike.damage.map((part, index) => (index === 0 ? { ...part, dice: Math.max(k.DICE_MIN, lv) } : part)) })),
            saves: Object.fromEntries(Object.entries(stand.saves).map(([save, value]) => [save, value + 2]))
        } : {}),
        ...(lv >= k.UNDYING_AT ? { undyingProgram: true } : lv >= k.REFORM_FROM ? { undyingProgram: true, reformHp: k.REFORM_EARLY_HP } : {}),
        program: { sense: 60, dormant: 0 }
    };
}
// Class features that make a save's success a critical success: [level, save] (the pf2e system's class items, 2026-11-06; the monk's Path
// to Perfection on Reflex, Second Path on Will, as its saves above).
const SAVE_UPGRADES = {
    alchemist: [[11, "fortitude"], [15, "reflex"]], animist: [[13, "will"]], barbarian: [[7, "fortitude"], [15, "will"]], bard: [[9, "will"]],
    champion: [[9, "fortitude"], [11, "will"]], commander: [[11, "will"], [15, "reflex"]], druid: [[11, "will"]], exemplar: [[7, "will"], [15, "fortitude"]],
    guardian: [[9, "fortitude"], [17, "will"]], gunslinger: [[11, "reflex"], [17, "fortitude"]], inventor: [[11, "will"], [17, "fortitude"]],
    investigator: [[11, "will"], [15, "reflex"]], kineticist: [[7, "fortitude"], [11, "reflex"]], magus: [[9, "will"], [15, "fortitude"]],
    monk: [[7, "reflex"], [11, "will"]], necromancer: [[3, "will"], [11, "fortitude"]], oracle: [[7, "will"]], psychic: [[11, "will"]],
    ranger: [[7, "reflex"], [11, "fortitude"]], runesmith: [[11, "fortitude"]], sorcerer: [[17, "will"]], summoner: [[11, "fortitude"], [15, "will"]], ...Object.fromEntries(["stand-user", "stand-user-rush", "stand-long", "stand-automatic", "stand-automatic-dart", "stand-colony", "stand-bound", "stand-integrated", "stand-evolving", "stand-heaven", "stand-automatic-hidden", "stand-automatic-dart-hidden"].map((slug) => [slug, [[11, "fortitude"], [15, "will"]]])),
    swashbuckler: [[7, "reflex"], [17, "will"]], thaumaturge: [[7, "will"], [15, "fortitude"]], witch: [[17, "will"]]
};
// (2026-11-24: each Stand Ability as its own build — stand-abilities/index.js —, and the plain stand user with none, what they're measured
// against.)
CLASSES["stand-ab-none"] = standUser("close", { ability: "none" });
// (And the types the type-locked abilities run on, with none — what Disassemble/Melting Dart and Ice Armor/Devouring Flesh are measured against.)
CLASSES["stand-ab-none-automatic"] = standUser("automatic", { ability: "none" });
CLASSES["stand-ab-none-integrated"] = standUser("integrated", { ability: "none" });
for (const name of Object.keys(STAND_ABILITIES)) CLASSES[standAbilitySlug(name)] = standUser(STAND_ABILITY_TYPE[name] ?? "close", { standAbility: name });
// (With bystanders to turn into weapons — the abilities that can, stand-abilities/index.js STAND_ABILITY_BYSTANDERS: "<slug>-nc".)
for (const name of STAND_ABILITY_BYSTANDERS) CLASSES[`${standAbilitySlug(name)}-nc`] = standUser(STAND_ABILITY_TYPE[name] ?? "close", { standAbility: name, bystanders: true });
// (2026-11-24, the stand10 class comparison: each stand type with a chosen Stand Ability in Flame's place, buffed —
// "stand-t-<type>-<ability slug>", from stand-abilities/compare.json: [[type, ability, { rush, heaven }], …].)
{
    const pairs = (() => { try { return JSON.parse(globalThis.process?.getBuiltinModule?.("node:fs")?.readFileSync(new URL("./stand-abilities/compare.json", import.meta.url), "utf8") ?? "[]"); } catch { return []; } })();
    for (const [type, name, extra = {}] of pairs) {
        if (!STAND_ABILITIES[name]) continue;
        const tag = extra.heaven ? "heaven" : extra.rush ? "rush" : type;
        CLASSES[`stand-t-${tag}-${standAbilitySlug(name).replace(/^stand-ab-/, "")}`] = standUser(type, { standAbility: name, buffedBuild: true, ...extra });
    }
    for (const slug of Object.keys(CLASSES)) if (slug.startsWith("stand-t-")) SAVE_UPGRADES[slug] = SAVE_UPGRADES["stand-user"];
}
// (The buffed text as builds of their own, "<slug>-buffed" and "<slug>-nc-buffed", so a run holds both.)
for (const name of Object.keys(STAND_ABILITIES)) CLASSES[`${standAbilitySlug(name)}-buffed`] = standUser(STAND_ABILITY_TYPE[name] ?? "close", { standAbility: name, buffedBuild: true });
for (const name of STAND_ABILITY_BYSTANDERS) CLASSES[`${standAbilitySlug(name)}-nc-buffed`] = standUser(STAND_ABILITY_TYPE[name] ?? "close", { standAbility: name, bystanders: true, buffedBuild: true });
for (const slug of Object.keys(CLASSES)) if (slug.startsWith("stand-ab-")) SAVE_UPGRADES[slug] = SAVE_UPGRADES["stand-user"];
// (Builds that aren't one of PF2e's classes — a class archetype, homebrew: the Stand User — run only when named: --only=.)
export const VARIANT_SLUGS = Object.freeze(Object.keys(CLASSES).filter((slug) => slug.startsWith("stand-")));
export const CLASS_SLUGS = Object.freeze([...Object.keys(CLASSES).filter((slug) => !VARIANT_SLUGS.includes(slug)), "fighter", "rogue", "wizard", "cleric"].sort());
// What a class's PC doesn't play yet (its chassis, spells and weapon are played).
// (2026-11-10, Cole: "get them working": the class features once listed here are played now — the animist's apparitions, the necromancer's
// thralls, Consume Thrall and Inevitable Return, the runesmith's runes, the bard's compositions, the sorcerer's blood magic, the psychic's
// Unleash Psyche and amps, the witch's familiar, the oracle's curse, the kineticist's aura, Rage's -1 AC, the alchemist's research fields,
// the magus's Arcane Cascade. Left: feats a player picks (an eidolon's evolution feats, a 1st-level class feat) are rated as feats, and the
// druid is a storm druid — Untamed Form is the untamed order's.)
export const CLASS_GAPS = Object.freeze({
    summoner: "its evolution feats (rated as feats)"
});
// The standard party's seat each class sits in (the PC it replaces in classParty).
export const seatOf = (slug) => (["fighter", "rogue", "wizard", "cleric"].includes(slug) ? slug : CLASSES[slug]?.seat ?? null);
// Its attribute modifiers at a level (the feat module's DCs read them: tools/lib/feat-power.mjs dcsOf).
export const classAttributes = (slug, level) => CLASSES[slug]?.attrs(key(level), level) ?? null;
export const classArmor = (slug) => CLASSES[slug]?.armor ?? null;

// A PC of a class at a level (null: a class this doesn't know). options: { spell, basics } as standardParty's.
export function classPC(slug, level, { spell = () => null, basics = [], alchemy = null, innovation = null, field = null } = {}) {
    const lv = Math.max(1, Math.min(20, level));
    if (["fighter", "rogue", "wizard", "cleric"].includes(slug)) return standardParty(lv, { spell, basics }).find((c) => c.id === slug);
    const def = CLASSES[slug];
    if (!def) return null;
    const k = key(lv);
    const a = def.attrs(k, lv);
    const armor = ARMOR[def.armor];
    const ac = 10 + lv + rank(lv, def.armorSteps) + armor.item + Math.min(a.dex, armor.cap) + armorPotency(lv);
    const built = def.build?.(lv, a, { alchemy, innovation, field }) ?? {};
    const casterStaff = { name: "Staff", bonus: lv + T + a.str, melee: true, agile: false, iwr: { group: "club" }, damage: [{ dice: 1, die: 4, bonus: a.str, type: "bludgeoning" }] };
    const [strike, ...backups] = built.strikes?.length ? built.strikes : [casterStaff];
    const spellAttr = def.caster ? a[def.caster.attr] : 0;
    const classDC = def.classDC ? 10 + lv + rank(lv, def.classDC) + k : 10 + lv + (def.caster?.prof ?? spellProf)(lv) + spellAttr;
    const c = pc({
        id: slug, name: slug[0].toUpperCase() + slug.slice(1), level: lv, hpPerLevel: def.hp, con: a.con, str: a.str, dex: a.dex, wis: a.wis,
        ac: built.ac ?? ac,
        fort: rank(lv, def.fort), ref: rank(lv, def.ref), will: rank(lv, def.will), perception: rank(lv, def.perception),
        skills: { athletics: lv + T + a.str, acrobatics: lv + T + a.dex, intimidation: lv + T + a.cha, ...(built.skills ?? {}) },
        strike, backups, classDC,
        extra: {
            ...(lv >= 5 && def.build ? { critSpec: true } : {}),
            ...(built.fields ?? {})
        }
    });
    // (Saves pc() reads with Dexterity and Wisdom; Constitution for Fortitude it has.)
    if (built.speed) c.speed = built.speed;
    // (2026-11-06) The class features that turn a save's success into a critical success (Juggernaut, Evasion's kin, Resolve's kin), from
    // the pf2e system's class items; the class PCs here had none of them (the runesmith's Forged Endurance aside).
    const upgrades = (SAVE_UPGRADES[slug] ?? []).filter(([at]) => lv >= at).map(([, save]) => save).filter((save) => !(c.saveDegrees ?? []).some((each) => each.saves.includes(save)));
    if (upgrades.length) c.saveDegrees = [...(c.saveDegrees ?? []), { saves: upgrades, adjustment: { success: "one-degree-better" } }];
    // (2026-11-06, Cole's pick "Re-check weak class ratings": the standard party's fighter carries a longbow as well as its greatsword, but
    // the martial classes built here had only their melee weapon — a flier or a foe across a gap left them nothing to do, and every class in
    // the fighter's seat rated low for it. A martial with no ranged Strike gets the fighter's backup: a longbow at its weapon proficiency
    // and Dexterity, its runes, its weapon specialization.)
    // (2026-11-24: not a Stand User's — its Stand Ability is its reach.)
    if (built.strikes?.length && !def.noBackupBow && !c.strikes.some((each) => !each.melee)) {
        const main = c.strikes[0];
        const attr = main.finesse ? Math.max(a.str, a.dex) : a.str;
        const prof = main.bonus - lv - attr - (main.potency ?? 0);
        const spec = Math.max(0, (main.damage?.[0]?.bonus ?? 0) - (main.empowerment ?? 0) - a.str);
        const dice = main.damage?.[0]?.dice ?? striking(lv);
        c.strikes = [...c.strikes, { name: "Longbow", bonus: lv + prof + a.dex + (main.potency ?? 0), potency: main.potency ?? 0, melee: false, agile: false, increment: 100, held: true, hands: 2, iwr: { group: "bow", ...(main.iwr?.traits ? { traits: main.iwr.traits } : {}) }, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 10 }, damage: [{ dice, die: 8, bonus: spec, type: "piercing" }], backupBow: true }];
    }
    c.classSlug = slug;
    c.abilities = a;
    if (def.caster) {
        const base = bookOf(def.caster.tradition);
        const ranks = def.caster.lead ? Object.fromEntries(Object.entries(base.ranks).map(([r, names]) => [r, [...new Set([...(def.caster.lead[r] ?? []), ...names])]])) : base.ranks;
        const book = { ...base, ranks, slots: def.caster.slots, topTwo: def.caster.topTwo, prof: def.caster.prof, cantrips: [...new Set([...(def.caster.extra ?? []), ...base.cantrips])] };
        Object.assign(c, preparedSpells(c, book, lv, spellAttr, spell));
        // (Spell Battery, a familiar's master ability: one more slot, three ranks below its highest.)
        const top = Math.min(9, Math.ceil(lv / 2));
        if (def.caster.battery && lv >= def.caster.battery && top >= 4) {
            const name = (book.ranks[top - 3] ?? []).find((each) => spell(each, top - 3));
            const found = name ? spell(name, top - 3) : null;
            const prof = (book.prof ?? spellProf)(lv);
            if (found) {
                c.spells.push({ ...found, name: found.name ?? name, castRank: top - 3, dc: 10 + lv + prof + spellAttr, attack: lv + prof + spellAttr, pool: `${slug}:battery`, tradition: book.tradition });
                c.spellPools[`${slug}:battery`] = 1;
            }
        }
    }
    // Focus spells (a champion's Lay on Hands, a druid's order spell, a bloodline's, a revelation, a conflux, grave spells): at half its level
    // rounded up, from a pool of its Focus Points.
    if (def.focus) {
        const prof = def.caster ? (def.caster.prof ?? spellProf)(lv) : rank(lv, def.classDC ?? [[1, T]]);
        const attr = a[def.focus.attr] ?? 0;
        const castRank = Math.ceil(lv / 2);
        const pool = `${slug}:focus`;
        c.spells ??= [];
        for (const name of def.focus.names) {
            const found = spell(name, castRank);
            if (!found) continue;
            const entry = { ...found, name: found.name ?? name, castRank, dc: 10 + lv + prof + attr, attack: lv + prof + attr, pool, tradition: def.caster?.tradition ?? "divine" };
            c.spells.push(entry);
        }
        const points = typeof def.focus.points === "function" ? def.focus.points(lv) : def.focus.points;
        if (c.spells.some((entry) => entry.pool === pool)) c.spellPools = { ...(c.spellPools ?? {}), [pool]: points };
    }
    // (Sorcerous Potency: a slot spell's rank more damage. A psychic's Unleash Psyche — twice the rank for its 2 rounds, then a round off —
    // as its rank on every spell, the fight's average.)
    if (def.potency) c.spellDamageBonus = { perRank: 1, slotsOnly: true };
    // (2026-11-10: the psychic's Unleash Psyche played as it comes and goes — fight.js —; its psi cantrip's amp — The Tangible Dream's
    // Imaginary Weapon: 2d6 a rank above the 1st, not 1d6, and two targets — for a Focus Point: 2, 3 from Clarity of Focus (5th).)
    if (def.psyche) {
        c.unleashPsyche = true;
        const weapon = (c.spells ?? []).find((entry) => entry.name === "Imaginary Weapon" && !entry.pool);
        const shared = weapon?.plan?.resolution?.sharedDamage;
        if (shared?.heightening?.damage) {
            const amped = structuredClone(weapon.plan);
            for (const id of Object.keys(amped.resolution.sharedDamage.heightening.damage)) amped.resolution.sharedDamage.heightening.damage[id] = "2d6";
            amped.targeting = { ...amped.targeting, target: "2 creatures", actorConstraints: { ...amped.targeting.actorConstraints, sourceText: "2 creatures" } };
            c.spells.push({ ...weapon, name: "Imaginary Weapon (amped)", plan: amped, pool: "psychic:focus" });
            c.spellPools = { ...(c.spellPools ?? {}), "psychic:focus": lv >= 5 ? 3 : 2 };
        }
    }
    // (A runesmith's runes: abilities of its own, runesmithRunes.)
    if (built.spells?.length) c.spells = [...(c.spells ?? []), ...built.spells];
    // (An alchemist's versatile vials and ready bombs.)
    if (built.spellPools) c.spellPools = { ...(c.spellPools ?? {}), ...built.spellPools };
    c.spells = [...(c.spells ?? []), ...basics.map((plan) => ({ name: plan.source?.name ?? plan.name, plan, castRank: 1, pool: null, kind: "basic" }))];
    // (Creatures that come with it — the summoner's eidolon —, for classParty.)
    const makes = [...(built.companions ?? []), ...(def.companions ?? [])];
    if (makes.length) Object.defineProperty(c, "companions", { value: makes.map((make) => make(c)), enumerable: false });
    return c;
}

// The standard party with a class's PC in its seat (the PC whose id is its seat's), or the standard party for one of the four.
// (2026-11-02, Cole: "Does it appear any combination of classes perform better than when alone?") The standard party with several classes'
// PCs, each in its own seat (two in one seat: null).
export function classesParty(slugs, level, options = {}) {
    let party = standardParty(level, options);
    const seats = slugs.map(seatOf);
    if (seats.some((seat) => !seat) || new Set(seats).size !== seats.length) return null;
    for (const slug of slugs) {
        if (seatOf(slug) === slug) continue;
        const pcOf = classPC(slug, level, options);
        party = party.flatMap((c) => (c.id === seatOf(slug) ? [pcOf, ...(pcOf.companions ?? [])] : [c]));
    }
    return party;
}

export function classParty(slug, level, options = {}) {
    const party = standardParty(level, options);
    const seat = seatOf(slug);
    if (!seat || seat === slug) return party;
    const pcOf = classPC(slug, level, options);
    return party.flatMap((c) => (c.id === seat ? [pcOf, ...(pcOf.companions ?? [])] : [c]));
}
