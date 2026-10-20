// GM Core's creature-building tables (Building Creatures), levels −1 to 24, as near as the book has them; level 25 carries on their steps.
// For a creature's stat profile (where each number sits for its level) and for the moderate creature a level's baseline fights.

const LEVELS = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
// [extreme, high, moderate, low] by level.
const AC = [[18, 15, 14, 12], [19, 16, 15, 13], [19, 16, 15, 13], [21, 18, 17, 15], [22, 19, 18, 16], [24, 21, 20, 18], [25, 22, 21, 19], [27, 24, 23, 21], [28, 25, 24, 22], [30, 27, 26, 24], [31, 28, 27, 25], [33, 30, 29, 27], [34, 31, 30, 28], [36, 33, 32, 30], [37, 34, 33, 31], [39, 36, 35, 33], [40, 37, 36, 34], [42, 39, 38, 36], [43, 40, 39, 37], [45, 42, 41, 39], [46, 43, 42, 40], [48, 45, 44, 42], [49, 46, 45, 43], [51, 48, 47, 45], [52, 49, 48, 46], [54, 51, 50, 48]];
// [extreme, high, moderate, low, terrible] — saves and Perception share it.
const SAVE = [[9, 8, 5, 2, 0], [10, 9, 6, 3, 1], [11, 10, 7, 4, 2], [12, 11, 8, 5, 3], [14, 12, 9, 6, 4], [15, 14, 11, 8, 6], [17, 15, 12, 9, 7], [18, 17, 14, 11, 8], [20, 18, 15, 12, 10], [21, 19, 16, 13, 11], [23, 21, 18, 15, 12], [24, 22, 19, 16, 14], [26, 24, 21, 18, 15], [27, 25, 22, 19, 16], [29, 26, 23, 20, 18], [30, 28, 25, 22, 19], [32, 29, 26, 23, 20], [33, 30, 28, 25, 22], [35, 32, 29, 26, 23], [36, 33, 30, 27, 24], [38, 35, 32, 29, 26], [39, 36, 33, 30, 27], [41, 38, 35, 32, 28], [43, 39, 36, 33, 30], [44, 40, 37, 34, 31], [46, 42, 38, 36, 32]];
// [high, moderate, low] — the middle of each range.
const HP = [[9, 8, 6], [18, 15, 12], [25, 20, 15], [38, 30, 23], [56, 45, 34], [75, 60, 45], [94, 75, 56], [119, 95, 71], [144, 115, 86], [169, 135, 101], [194, 155, 116], [219, 175, 131], [244, 195, 146], [269, 215, 161], [294, 235, 176], [319, 255, 191], [344, 275, 206], [369, 295, 221], [394, 315, 236], [419, 335, 251], [444, 355, 266], [469, 375, 281], [500, 400, 300], [538, 430, 323], [575, 460, 345], [625, 500, 375]];
// [extreme, high, moderate, low]
const ATTACK = [[10, 8, 6, 4], [10, 8, 6, 4], [11, 9, 7, 5], [13, 11, 9, 7], [14, 12, 10, 8], [16, 14, 12, 9], [17, 15, 13, 11], [19, 17, 15, 12], [20, 18, 16, 13], [22, 20, 18, 15], [23, 21, 19, 16], [25, 23, 21, 17], [27, 24, 22, 19], [28, 26, 24, 20], [29, 27, 25, 21], [31, 29, 27, 23], [32, 30, 28, 24], [34, 32, 30, 25], [35, 33, 31, 27], [37, 35, 33, 28], [38, 36, 34, 29], [40, 38, 36, 31], [41, 39, 37, 32], [43, 41, 39, 33], [44, 42, 40, 35], [46, 44, 42, 36]];
// Strike damage averages: [extreme, high, moderate, low]
const DAMAGE = [[4, 3, 3, 2], [6, 5, 4, 3], [8, 6, 5, 4], [11, 9, 8, 6], [15, 12, 10, 8], [18, 14, 12, 9], [20, 16, 13, 11], [23, 18, 15, 12], [25, 20, 17, 13], [28, 22, 18, 15], [30, 24, 20, 16], [33, 26, 22, 17], [35, 28, 23, 19], [38, 30, 25, 20], [40, 32, 27, 21], [43, 34, 28, 23], [45, 36, 30, 24], [48, 37, 31, 25], [50, 38, 32, 26], [53, 40, 33, 27], [55, 42, 35, 28], [58, 44, 37, 29], [60, 46, 38, 31], [63, 48, 40, 32], [65, 50, 42, 33], [68, 52, 44, 35]];
// Spell DC: [extreme, high, moderate]
const SPELL_DC = [[19, 16, 13], [19, 16, 13], [20, 17, 14], [22, 18, 15], [23, 20, 17], [25, 21, 18], [26, 22, 19], [27, 24, 21], [29, 25, 22], [30, 26, 23], [32, 28, 25], [33, 29, 26], [34, 30, 27], [36, 32, 29], [37, 33, 30], [39, 34, 31], [40, 36, 33], [41, 37, 34], [43, 38, 35], [44, 40, 37], [46, 41, 38], [47, 42, 39], [48, 44, 41], [50, 45, 42], [51, 46, 43], [52, 48, 45]];

const TABLES = { ac: [AC, ["extreme", "high", "moderate", "low"]], save: [SAVE, ["extreme", "high", "moderate", "low", "terrible"]], hp: [HP, ["high", "moderate", "low"]], attack: [ATTACK, ["extreme", "high", "moderate", "low"]], damage: [DAMAGE, ["extreme", "high", "moderate", "low"]], spellDC: [SPELL_DC, ["extreme", "high", "moderate"]] };

// A table's row for a level (25 and up: 24's, stepped on by the last level's change).
function row(table, level) {
    const index = LEVELS.indexOf(Math.max(-1, Math.min(24, level)));
    const base = table[index];
    if (level <= 24) return base;
    const step = base.map((value, i) => value - table[index - 1][i]);
    return base.map((value, i) => value + step[i] * (level - 24));
}

export function moderate(stat, level) {
    const [table, names] = TABLES[stat];
    return row(table, level)[names.indexOf("moderate")];
}

// Where a value sits for its level: the highest column it reaches ("extreme" … "low", or below the lowest: the last column's name, "-").
export function tier(stat, level, value) {
    if (!Number.isFinite(value)) return null;
    const [table, names] = TABLES[stat];
    const values = row(table, level);
    for (let index = 0; index < values.length; index++) if (value >= values[index]) return names[index];
    return `below ${names.at(-1)}`;
}

// How far above moderate a value is, in steps of the table's moderate-to-high gap (0 moderate, 1 high, about 2 extreme).
export function steps(stat, level, value) {
    const [table, names] = TABLES[stat];
    const values = row(table, level);
    const mid = values[names.indexOf("moderate")];
    const high = values[names.indexOf("moderate") - 1];
    const gap = Math.max(1, high - mid);
    return (value - mid) / gap;
}

// A moderate creature of a level (−1 to 25): moderate AC, HP, saves, Perception and one Strike of moderate attack and damage.
export function moderateCreatureAt(level, id = "baseline", name = `Moderate level ${level} creature`) {
    const damage = moderate("damage", level);
    const die = level >= 10 ? 10 : level >= 4 ? 8 : 6;
    const dice = Math.max(1, Math.round(damage * 0.55 / ((die + 1) / 2)));
    const bonus = Math.max(0, Math.round(damage - dice * (die + 1) / 2));
    const save = moderate("save", level);
    return {
        id, name, side: "foes", kind: "npc", level, traits: ["humanoid"],
        hp: { value: moderate("hp", level), max: moderate("hp", level) },
        ac: moderate("ac", level),
        saves: { fortitude: save, reflex: save, will: save },
        perception: save,
        speed: 25, reach: 5,
        strikes: [{ name: "Strike", bonus: moderate("attack", level), melee: true, agile: false, damage: [{ dice, die, bonus, type: "slashing" }] }],
        reactions: { aoo: false, shieldBlock: false }
    };
}
