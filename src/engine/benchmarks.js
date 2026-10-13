// Benchmark encounters: moderate creatures from the GM Core creature-building
// tables against a level-matched martial party, at each threat level of the
// encounter-building guide.

// [level]: [AC, HP, Strike bonus, damage dice, die, damage bonus, save, perception] (moderate columns)
const MODERATE_CREATURE = {
    "-1": [14, 8, 6, 1, 4, 0, 5, 5],
    0: [15, 15, 6, 1, 4, 2, 6, 6],
    1: [15, 20, 7, 1, 6, 2, 7, 7],
    2: [17, 30, 9, 1, 8, 4, 8, 8],
    3: [18, 45, 10, 1, 8, 6, 9, 9],
    4: [20, 60, 12, 2, 6, 5, 11, 11],
    5: [21, 75, 13, 2, 6, 6, 12, 12],
    6: [23, 95, 15, 2, 6, 8, 14, 14],
    7: [24, 115, 16, 2, 8, 8, 15, 15],
    8: [26, 135, 18, 2, 8, 9, 16, 16],
    9: [27, 155, 19, 2, 8, 11, 18, 18],
    10: [29, 175, 21, 2, 10, 11, 19, 19],
    11: [30, 195, 22, 2, 10, 12, 20, 20],
    12: [32, 215, 24, 3, 8, 12, 22, 22],
    13: [33, 235, 25, 3, 8, 14, 23, 23],
    14: [35, 255, 27, 3, 8, 15, 25, 25]
};

export function moderateCreature(level, id, name = `Level ${level} creature`) {
    const row = MODERATE_CREATURE[level];
    if (!row) throw new Error(`No creature-building row for level ${level}`);
    const [ac, hp, bonus, dice, die, damageBonus, save, perception] = row;
    return {
        id,
        name,
        side: "foes",
        kind: "npc",
        level,
        traits: ["humanoid"],
        hp: { value: hp, max: hp },
        ac,
        saves: { fortitude: save, reflex: save, will: save },
        perception,
        speed: 25,
        reach: 5,
        strikes: [{ name: "Strike", bonus, melee: true, agile: false, damage: [{ dice, die, bonus: damageBonus, type: "slashing" }] }],
        reactions: { aoo: false, shieldBlock: false }
    };
}

function attributeFor(level) {
    if (level >= 20) return 6;
    if (level >= 10) return 5;
    return 4;
}

function potency(level) {
    if (level >= 16) return 3;
    if (level >= 10) return 2;
    if (level >= 2) return 1;
    return 0;
}

function strikingDice(level) {
    if (level >= 19) return 4;
    if (level >= 12) return 3;
    if (level >= 4) return 2;
    return 1;
}

function armorPotency(level) {
    if (level >= 18) return 3;
    if (level >= 11) return 2;
    if (level >= 5) return 1;
    return 0;
}

// Weapon proficiency bonus: fighters start expert, others trained.
function weaponProficiency(level, fighter) {
    if (fighter) return level >= 13 ? 8 : level >= 5 ? 6 : 4;
    return level >= 13 ? 6 : level >= 5 ? 4 : 2;
}

function specialization(level, fighter) {
    if (level < 7) return 0;
    if (fighter) return level >= 15 ? 4 : 3;
    return level >= 13 ? 3 : 2;
}

function pc({ id, name, level, hpPerLevel, acBonus, strike, shield = null, aoo = false, perceptionBonus = 2 }) {
    const con = level >= 10 ? 4 : level >= 5 ? 3 : 2;
    const hp = 8 + (hpPerLevel + con) * level;
    const attribute = attributeFor(level);
    const armorProficiency = level >= 13 ? 6 : level >= 11 ? 4 : 2;
    const save = level + 2 + (level >= 9 ? 2 : 0) + 2;
    return {
        id,
        name,
        side: "party",
        kind: "pc",
        level,
        traits: ["humanoid"],
        hp: { value: hp, max: hp },
        ac: 10 + level + armorProficiency + 5 + acBonus + armorPotency(level),
        saves: { fortitude: save, reflex: save, will: save },
        perception: level + perceptionBonus + 2,
        skills: { athletics: level + 2 + attribute, thievery: level + 2 + 2, crafting: level + 2 + 1 },
        speed: 25,
        reach: 5,
        heroPoints: 1,
        shield,
        reactions: { aoo, shieldBlock: !!shield },
        // A held weapon: Disarm can knock it away. (I2: magical from its first potency rune, for a resistance doubled against non-magical damage.)
        strikes: [{ ...strike(attribute), held: true, ...(potency(level) ? { iwr: { traits: ["magical"] } } : {}) }]
    };
}

export function martialParty(level) {
    const dice = strikingDice(level);
    const bonusFor = (fighter, attribute) => level + weaponProficiency(level, fighter) + attribute + potency(level);
    return [
        pc({
            id: "fighter", name: "Fighter", level, hpPerLevel: 10, acBonus: 0, aoo: true,
            strike: (attribute) => ({ name: "Greatsword", bonus: bonusFor(true, attribute), melee: true, damage: [{ dice, die: 12, bonus: attribute + specialization(level, true), type: "slashing" }] })
        }),
        pc({
            id: "champion", name: "Champion", level, hpPerLevel: 10, acBonus: 1,
            shield: { ac: 2, hardness: 5 + Math.floor(level / 2), hp: 20 + level * 4, bt: 10 + level * 2 },
            strike: (attribute) => ({ name: "Longsword", bonus: bonusFor(false, attribute), melee: true, damage: [{ dice, die: 8, bonus: attribute + specialization(level, false), type: "slashing" }] })
        }),
        pc({
            id: "ranger", name: "Ranger", level, hpPerLevel: 10, acBonus: 0, perceptionBonus: 4,
            strike: (attribute) => ({ name: "Shortbow", bonus: bonusFor(false, attribute), melee: false, increment: 60, deadly: { dice: level >= 19 ? 3 : level >= 12 ? 2 : 1, die: 10 }, damage: [{ dice, die: 6, bonus: specialization(level, false), type: "piercing" }] })
        }),
        pc({
            id: "rogue", name: "Rogue", level, hpPerLevel: 8, acBonus: 0, perceptionBonus: 4,
            strike: (attribute) => ({ name: "Rapier", bonus: bonusFor(false, attribute), melee: true, deadly: { dice: 1, die: 8 }, damage: [{ dice, die: 6, bonus: attribute + specialization(level, false), type: "piercing" }] })
        })
    ];
}

// Party of four, 40/60/80/120/160 XP budgets.
const THREATS = {
    trivial: [-2, -2],
    low: [-2, -2, -2],
    moderate: [0, 0],
    severe: [0, 0, 0],
    extreme: [0, 0, 0, 0],
    severeBoss: [3],
    extremeBoss: [4]
};

export function benchmarkEncounter(level, threat) {
    const offsets = THREATS[threat];
    if (!offsets) throw new Error(`Unknown threat ${threat}`);
    const foes = offsets.map((offset, index) => moderateCreature(level + offset, `foe${index + 1}`, offset >= 3 ? "Boss" : `Foe ${index + 1}`));
    return {
        partyLevel: level,
        combatants: [...martialParty(level), ...foes],
        setup: {}
    };
}

export const BENCHMARK_THREATS = Object.freeze(Object.keys(THREATS));
