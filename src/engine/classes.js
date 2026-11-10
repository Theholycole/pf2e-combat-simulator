// Every class's PC (2026-11-02; the user: "Get the simulator working with all classes"): a PC of any of PF2e's 29 classes at a level from
// 1 to 20, built like the standard party's four (party.js): Player Core's and the other rulebooks' proficiency steps, GM Core's runes, a
// typical build's weapon and armor, and the class's own engine as the simulation plays it (the same fields scripts/snapshot.js reads from a
// real character: Rage, Hunt Prey, Flurry of Blows, panache, Devise a Stratagem, Exploit Vulnerability, Overdrive, Spellstrike, tactics,
// the divine spark, a champion's reaction, Taunt and Intercept Strike, a gunslinger's way, bombs, Elemental Blast and so on).
//   classParty(slug, level): the standard party with that class's PC in the seat of the PC who fights most like it (a martial for the
//   fighter, a skirmisher for the rogue, an arcane or occult caster for the wizard, a divine or primal one for the cleric), so a class's
//   feats are rated on their own class.
// What isn't played yet is listed in CLASS_GAPS (the animist's apparitions and the
// runesmith's runes aren't played, only their spells and weapons; the necromancer's thralls are a count, by the spell module's thrall rules).
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
    const rune = (name, actions, range, components, effects = {}) => {
        const plan = savePlan(name, { actions, traits, range, target: "1 creature", save: "fortitude", dc, damage: components[0].formula, effects });
        plan.traits = plan.activation.traits = [...traits, "runesmith", ...components.map((part) => part.type)];
        plan.source.type = "action";
        plan.resolution.sharedDamage.components = components.map((part, index) => ({ id: String(index), formula: part.formula, type: part.type, category: null }));
        for (const outcome of Object.values(plan.resolution.outcomes)) if (outcome.damage.sourceComponentIds?.length) outcome.damage.sourceComponentIds = components.map((_, index) => String(index));
        return { name, plan, castRank: Math.ceil(lv / 2), dc, attack: null, pool: null, kind: "ability", actionType: "action", rechargeGroup: name, runesmithRune: true };
    };
    const fire = { formula: `${dice}d8[fire]`, type: "fire" };
    const thunder = { formula: `${dice}d8[electricity]`, type: "electricity" };
    const dazzled = { criticalFailure: [["dazzled", null, { mode: "fixed", value: 1, unit: "rounds" }]] };
    return [
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
        caster: { tradition: "divine", attr: "wis", slots: 4 }
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
        caster: { tradition: "occult", attr: "cha", slots: 4, extra: ["Courageous Anthem"] }
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
            return { strikes: [blast, melee], fields: { strikeActivities: [twoAction(blast), twoAction(melee)], ...(lv >= 13 ? { resistances: ["cold", "fire"].map((type) => ({ type, value: lv, exceptions: [] })) } : {}), ...(lv >= 15 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better", criticalFailure: "one-degree-better" } }] } : {}) } };
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
        fort: [[1, E], [11, M]], ref: [[1, T], [5, E]], will: [[1, E]], perception: [[1, T], [7, E]],
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
            return { strikes: [thrall, staff], fields: { critSpec: false, thrallMaker: { proliferation: 1 } } };
        }
    },
    oracle: {
        seat: "cleric", hp: 8, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "light", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [9, E]], ref: [[1, T], [13, E]], will: [[1, E], [7, M], [17, L]], perception: [[1, T], [11, E]],
        caster: { tradition: "divine", attr: "cha", slots: 4 }, focus: { names: ["Tempest Touch"], attr: "cha", points: 1 }
    },
    psychic: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: k, wis: minor(lv), cha: 1 }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [9, E]], ref: [[1, T], [5, E]], will: [[1, E], [11, M], [17, L]], perception: [[1, T], [11, E]],
        caster: { tradition: "occult", attr: "int", slots: 2, extra: ["Imaginary Weapon"] }, psyche: true
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
            return { strikes: [hammer], spells: runesmithRunes(lv, 10 + lv + rank(lv, [[1, T], [7, E], [15, M], [19, L]]) + a.int), fields: { shield: { ac: 2, hardness, hp: hardness * 4, bt: hardness * 2, broken: false, raised: false }, reactions: { aoo: false, shieldBlock: true },
                ...(lv >= 11 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better" } }] } : {}) } };
        }
    },
    sorcerer: {
        seat: "wizard", hp: 6, attrs: (k, lv) => ({ str: 0, dex: 2, con: casterCon(lv), int: 0, wis: minor(lv), cha: k }),
        armor: "unarmored", armorSteps: [[1, T], [13, E]],
        fort: [[1, T], [5, E]], ref: [[1, T], [9, E]], will: [[1, E], [17, M]], perception: [[1, T], [11, E]],
        caster: { tradition: "arcane", attr: "cha", slots: 4 }, focus: { names: ["Elemental Toss"], attr: "cha", points: 1 }, potency: true
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
            const str = key(lv);
            const prof = rank(lv, [[1, T], [5, E], [13, M]]);
            const jaws = weaponStrike(lv, { name: "Jaws", die: 8, type: "piercing", toHit: str, damageAttr: str, prof, group: "brawling", extra: { unarmed: true } });
            const claw = weaponStrike(lv, { name: "Claw", die: 6, type: "slashing", toHit: str, damageAttr: str, prof, group: "brawling", extra: { unarmed: true, agile: true } });
            const eidolonAC = 10 + lv + rank(lv, [[1, T], [13, E]]) + 2 + 3 + armorPotency(lv);
            // (Boost Eidolon, the summoner's one action each turn: +2 status damage a weapon die, to +8 — on the eidolon's Strikes; Act Together's
            // fourth action: the eidolon's two, the summoner's one.)
            const boost = Math.min(8, 2 * striking(lv));
            for (const strike of [jaws, claw]) strike.damage = [...strike.damage, { dice: 0, die: 0, bonus: boost, type: strike.damage[0].type, source: "Boost Eidolon" }];
            const eidolon = (summoner) => ({
                ...structuredClone(summoner), id: "eidolon", name: "Eidolon", kind: "npc", traits: ["eidolon", "beast"], sharesHpWith: summoner.id, actionsPerTurn: 2,
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
            const roar = lv >= 7 ? { name: "Primal Roar", plan: savePlan("Primal Roar", { actions: 2, traits: ["auditory", "emotion", "fear", "mental", "eidolon"], area: { type: "emanation", value: 30 }, save: "will", dc: 10 + lv + T, effects: { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null]] } }), castRank: Math.ceil(lv / 2), dc: 10 + lv + T, attack: null, pool: "eidolon:roar", kind: "ability", actionType: "action", rechargeGroup: "Primal Roar" } : null;
            return { strikes: [], fields: { actionsPerTurn: 1 }, companions: [eidolon] };
        }
    },
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
        caster: { tradition: "primal", attr: "int", slots: 3, extra: ["Evil Eye"] },
        // (2026-11-05: its familiar — The Resentment's, whose lesson gives Evil Eye: Familiar of Ongoing Misery —, beside it.)
        companions: [(c) => familiarFor(c, { hexAbility: "familiar-of-ongoing-misery" })]
    }
};
// Class features that make a save's success a critical success: [level, save] (the pf2e system's class items, 2026-11-06; the monk's Path
// to Perfection on Reflex, Second Path on Will, as its saves above).
const SAVE_UPGRADES = {
    alchemist: [[11, "fortitude"], [15, "reflex"]], animist: [[13, "will"]], barbarian: [[7, "fortitude"], [15, "will"]], bard: [[9, "will"]],
    champion: [[9, "fortitude"], [11, "will"]], commander: [[11, "will"], [15, "reflex"]], druid: [[11, "will"]], exemplar: [[7, "will"], [15, "fortitude"]],
    guardian: [[9, "fortitude"], [17, "will"]], gunslinger: [[11, "reflex"], [17, "fortitude"]], inventor: [[11, "will"], [17, "fortitude"]],
    investigator: [[11, "will"], [15, "reflex"]], kineticist: [[7, "fortitude"], [11, "reflex"]], magus: [[9, "will"], [15, "fortitude"]],
    monk: [[7, "reflex"], [11, "will"]], necromancer: [[3, "will"], [11, "fortitude"]], oracle: [[7, "will"]], psychic: [[11, "will"]],
    ranger: [[7, "reflex"], [11, "fortitude"]], runesmith: [[11, "fortitude"]], sorcerer: [[17, "will"]], summoner: [[11, "fortitude"], [15, "will"]],
    swashbuckler: [[7, "reflex"], [17, "will"]], thaumaturge: [[7, "will"], [15, "fortitude"]], witch: [[17, "will"]]
};
export const CLASS_SLUGS = Object.freeze([...Object.keys(CLASSES), "fighter", "rogue", "wizard", "cleric"].sort());
// What a class's PC doesn't play yet (its chassis, spells and weapon are played).
export const CLASS_GAPS = Object.freeze({
    animist: "apparitions", necromancer: "thralls as bodies on the field (foes can't strike them or catch them in areas), Thrall Charge and Consume Thrall", runesmith: "runes other than atryl, ranshu and marssyl (diacritics, shield and support runes, higher-level runes)", summoner: "evolution feats on the eidolon",
    bard: "compositions other than Courageous Anthem", sorcerer: "blood magic and Sorcerous Potency", psychic: "Unleash Psyche and amps", witch: "familiar abilities other than its patron's and Familiar Focus/Lifelink", oracle: "the curse", druid: "Untamed Form",
    barbarian: "Rage's -1 AC", alchemist: "mutagens, poisons and the research fields other than bomber", kineticist: "the kinetic aura and impulses other than Elemental Blast", magus: "Arcane Cascade and conflux spells"
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
    if (built.strikes?.length && !c.strikes.some((each) => !each.melee)) {
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
        const book = { ...base, slots: def.caster.slots, topTwo: def.caster.topTwo, prof: def.caster.prof, cantrips: [...(def.caster.extra ?? []), ...base.cantrips] };
        Object.assign(c, preparedSpells(c, book, lv, spellAttr, spell));
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
            if (found) c.spells.push({ ...found, name: found.name ?? name, castRank, dc: 10 + lv + prof + attr, attack: lv + prof + attr, pool, tradition: def.caster?.tradition ?? "divine" });
        }
        if (c.spells.some((entry) => entry.pool === pool)) c.spellPools = { ...(c.spellPools ?? {}), [pool]: def.focus.points };
    }
    // (Sorcerous Potency: a slot spell's rank more damage. A psychic's Unleash Psyche — twice the rank for its 2 rounds, then a round off —
    // as its rank on every spell, the fight's average.)
    if (def.potency) c.spellDamageBonus = { perRank: 1, slotsOnly: true };
    if (def.psyche) c.spellDamageBonus = { perRank: 1, slotsOnly: false };
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
