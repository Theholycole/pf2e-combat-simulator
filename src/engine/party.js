// The standard party (2026-10-13; the user's call: "The average team should be Fighter, Rogue, Wizard and Cleric with a diverse set of
// skills and spells so they can handle most situations"): four PCs of a level from 1 to 20, built close to Player Core's progressions
// with the GM Core treasure table's runes. Their numbers are here; their spells come from the caller (a resolver of PF2e spells by
// name, compiled by the spell module), so the engine stays free of packs.
//   Fighter: greatsword, full plate; expert-to-legendary weapon, Reactive Strike, Bravery, critical specialization from 5th level.
//   Rogue (thief): rapier, leather; sneak attack, Surprise Attack, Evasion, critical specialization against off-guard targets.
//   Wizard: arcane prepared spells (three a rank, a curriculum slot more, one 10th-rank slot from 19th level), damage and control.
//   Cleric (cloistered): divine prepared spells, Divine Font's heals at its highest rank, Battle Medicine.
// Skills for the combat actions the simulation plays: Athletics, Intimidation, Deception, Acrobatics, Medicine.

const T = 2, E = 4, M = 6, L = 8;
const rank = (level, steps) => steps.reduce((value, [from, prof]) => (level >= from ? prof : value), steps[0][1]);
const key = (level) => (level >= 20 ? 7 : level >= 17 ? 6 : level >= 10 ? 5 : 4);
const potency = (level) => (level >= 16 ? 3 : level >= 10 ? 2 : level >= 2 ? 1 : 0);
const striking = (level) => (level >= 19 ? 4 : level >= 12 ? 3 : level >= 4 ? 2 : 1);
// A weapon's runes at a level, as the party has them (GM Core's treasure table): { potency, dice } (dice: the striking runes' damage dice).
export const weaponRunesAt = (level) => ({ potency: potency(level), dice: striking(level) });
const armorPotency = (level) => (level >= 18 ? 3 : level >= 11 ? 2 : level >= 5 ? 1 : 0);
const resilient = (level) => (level >= 20 ? 3 : level >= 14 ? 2 : level >= 8 ? 1 : 0);
const primarySkill = (level) => rank(level, [[1, T], [3, E], [7, M], [15, L]]);
const secondarySkill = (level) => rank(level, [[1, T], [9, E]]);
const spellProf = (level) => rank(level, [[1, T], [7, E], [15, M], [19, L]]);
// Weapon specialization: +2, +3, +4 for expert, master, legendary from 7th level; doubled by greater specialization from 15th.
const specialization = (level, prof, greater = true) => (level < 7 ? 0 : (prof === E ? 2 : prof === M ? 3 : prof === L ? 4 : 0) * (greater && level >= 15 ? 2 : 1));

// The spells each caster prepares, best first for each rank; a rank's slots take them in turn. (The ones the simulation can't cast —
// utilities, reactions, walls it doesn't place — are left out: the resolver gives nothing for them.)
export const SPELLBOOKS = Object.freeze({
    wizard: {
        tradition: "arcane",
        cantrips: ["Electric Arc", "Ignition", "Frostbite", "Daze", "Telekinetic Projectile"],
        ranks: {
            1: ["Force Barrage", "Fear", "Breathe Fire", "Thunderstrike", "Enfeeble"],
            2: ["Blazing Bolt", "Stupefy", "Acid Grip", "Mirror Image", "Noise Blast"],
            3: ["Fireball", "Slow", "Haste", "Lightning Bolt", "Paralyze", "Blindness"],
            4: ["Confusion", "Ice Storm", "Weapon Storm", "Fire Shield"],
            5: ["Cone of Cold", "Banishment", "Toxic Cloud", "Howling Blizzard", "Impaling Spike"],
            6: ["Chain Lightning", "Disintegrate", "Petrify", "Dominate"],
            7: ["Eclipse Burst", "Warp Mind", "Fiery Body"],
            8: ["Polar Ray", "Desiccate", "Uncontrollable Dance", "Arctic Rift"],
            9: ["Massacre", "Weird"],
            10: ["Massacre", "Weird"]
        },
        curriculum: true
    },
    cleric: {
        tradition: "divine",
        cantrips: ["Divine Lance", "Vitality Lash", "Forbidding Ward", "Daze", "Void Warp"],
        ranks: {
            1: ["Bless", "Fear", "Command", "Harm", "Runic Weapon"],
            2: ["Spiritual Armament", "Noise Blast", "Resist Energy", "Calm"],
            3: ["Heroism", "Holy Light", "Blindness", "Chilling Darkness", "Crisis of Faith"],
            4: ["Divine Wrath", "Holy Cascade", "Fly"],
            5: ["Divine Immolation", "Flame Strike", "Banishment"],
            6: ["Spirit Blast", "Blade Barrier", "Dominate"],
            7: ["Divine Decree", "Eclipse Burst", "Execute", "Regenerate"],
            8: ["Divine Aura", "Spiritual Epidemic", "Spirit Song"],
            9: ["Massacre", "Overwhelming Presence", "Wails of the Damned"],
            10: ["Massacre", "Wails of the Damned"]
        },
        font: "Heal"
    }
});

// A prepared caster's spells: cantrips at its cantrip rank, three slots a rank (two the level it gains one; a curriculum slot more for a
// wizard), one 10th-rank slot from 19th level; a cleric's Divine Font heals at its highest rank. spell(name, castRank) → { name, plan,
// effects } or null.
function preparedSpells(c, book, level, attribute, spell) {
    const prof = spellProf(level);
    const dc = 10 + level + prof + attribute;
    const attack = level + prof + attribute;
    const spells = [];
    const pools = {};
    const cantripRank = Math.min(10, Math.ceil(level / 2));
    const entry = (name, castRank, pool) => {
        const found = spell(name, castRank);
        if (!found) return false;
        spells.push({ ...found, name: found.name ?? name, castRank, dc, attack, pool, tradition: book.tradition });
        return true;
    };
    for (const name of book.cantrips) entry(name, cantripRank, null);
    const highest = Math.min(9, Math.ceil(level / 2));
    for (let r = 1; r <= highest; r++) {
        const slots = (level === 2 * r - 1 ? 2 : 3) + (book.curriculum ? 1 : 0);
        const names = book.ranks[r].filter((name) => spell(name, r));
        for (let index = 0; index < slots && names.length; index++) {
            const pool = `${c.id}:${r}:${index}`;
            if (entry(names[index % names.length], r, pool)) pools[pool] = 1;
        }
    }
    if (level >= 19) {
        const name = book.ranks[10].find((each) => spell(each, 10));
        if (name && entry(name, 10, `${c.id}:10:0`)) pools[`${c.id}:10:0`] = 1;
    }
    if (book.font) {
        const uses = level >= 15 ? 6 : level >= 5 ? 5 : 4;
        if (entry(book.font, highest, `${c.id}:font`)) pools[`${c.id}:font`] = uses;
    }
    return { spells, spellPools: pools };
}

// A PC's frame: Hit Points, saves, Perception, skills, AC, its Strike.
// (Backups, 2026-10-13, found in the deadliest-creatures study: a weapon of another damage type and a bow, as a party ready for most
// situations carries — oozes immune to slashing and piercing, creatures in the air. Same runes as the main weapon; drawing it is free here.)
function pc({ id, name, level, hpPerLevel, con, ac, fort, ref, will, dex, wis, perception, skills, strike, backups = [], classDC, extra = {} }) {
    const hp = 8 + (hpPerLevel + con) * level;
    const res = resilient(level);
    return {
        id, name, side: "party", kind: "pc", level, traits: ["humanoid", "human"], senses: [],
        hp: { value: hp, max: hp },
        // (Its Constitution modifier: the Hit Points a rest restores, B482 — the spell ratings' Moment of Renewal.)
        con,
        ac,
        saves: { fortitude: level + fort + con + res, reflex: level + ref + dex + res, will: level + will + wis + res },
        perception: level + perception + wis,
        skills,
        speed: 25, reach: 5, heroPoints: 1, shield: null,
        reactions: { aoo: false, shieldBlock: false },
        strikes: [strike, ...backups].map((each) => ({ ...each, held: true, ...(potency(level) ? { iwr: { ...(each.iwr ?? {}), traits: ["magical"] } } : {}) })),
        classDC,
        ...extra
    };
}

export function standardParty(level, { spell = () => null, basics = [] } = {}) {
    const lv = Math.max(1, Math.min(20, level));
    const k = key(lv);
    const dice = striking(lv);
    const martialCon = lv >= 20 ? 4 : lv >= 10 ? 3 : 2;
    const casterCon = lv >= 15 ? 3 : lv >= 5 ? 2 : 1;
    const minor = lv >= 10 ? 2 : 1;
    const casterDex = lv >= 10 ? 3 : 2;
    const basicSpells = basics.map((plan) => ({ name: plan.source?.name ?? plan.name, plan, castRank: 1, pool: null, kind: "basic" }));

    // Fighter.
    const fWeapon = rank(lv, [[1, E], [5, M], [13, L]]);
    const fighter = pc({
        id: "fighter", name: "Fighter", level: lv, hpPerLevel: 10, con: martialCon, dex: 0, wis: minor,
        ac: 10 + lv + rank(lv, [[1, T], [11, E], [17, M]]) + 6 + armorPotency(lv),
        fort: rank(lv, [[1, E], [9, M]]), ref: rank(lv, [[1, E], [15, M]]), will: rank(lv, [[1, T], [3, E]]),
        perception: rank(lv, [[1, E], [7, M]]),
        skills: { athletics: lv + primarySkill(lv) + k, intimidation: lv + secondarySkill(lv), acrobatics: lv + secondarySkill(lv) },
        strike: { name: "Greatsword", bonus: lv + fWeapon + k + potency(lv), potency: potency(lv), melee: true, agile: false, versatile: ["piercing"], iwr: { group: "sword" }, hands: 2, damage: [{ dice, die: 12, bonus: k + specialization(lv, fWeapon), type: "slashing" }] },
        backups: [
            { name: "Warhammer", bonus: lv + fWeapon + k + potency(lv), potency: potency(lv), melee: true, agile: false, iwr: { group: "hammer" }, damage: [{ dice, die: 8, bonus: k + specialization(lv, fWeapon), type: "bludgeoning" }] },
            { name: "Longbow", bonus: lv + fWeapon + 1 + potency(lv), potency: potency(lv), melee: false, increment: 100, iwr: { group: "bow" }, hands: 2, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 10 }, damage: [{ dice, die: 8, bonus: specialization(lv, fWeapon), type: "piercing" }] }
        ],
        classDC: 10 + lv + rank(lv, [[1, T], [11, E]]) + k,
        extra: {
            reactions: { aoo: true, shieldBlock: false },
            ...(lv >= 5 ? { critSpec: true } : {}),
            ...(lv >= 3 ? { lessFrightened: 1 } : {}),
            ...(lv >= 9 ? { saveDegrees: [{ saves: ["fortitude"], adjustment: { success: "one-degree-better" } }] } : {})
        }
    });

    // Rogue (thief: Dexterity to damage).
    const rWeapon = rank(lv, [[1, T], [5, E], [13, M]]);
    const cha = lv >= 20 ? 4 : lv >= 10 ? 3 : 2;
    const rogue = pc({
        id: "rogue", name: "Rogue", level: lv, hpPerLevel: 8, con: martialCon - 1, dex: k, wis: minor,
        ac: 10 + lv + rank(lv, [[1, T], [13, E], [19, M]]) + 1 + Math.min(k, 4) + armorPotency(lv),
        fort: rank(lv, [[1, T], [9, E]]), ref: rank(lv, [[1, E], [7, M], [13, L]]), will: rank(lv, [[1, E], [17, M]]),
        perception: rank(lv, [[1, E], [7, M], [13, L]]),
        skills: { deception: lv + primarySkill(lv) + cha, stealth: lv + primarySkill(lv) + k, acrobatics: lv + primarySkill(lv) + k, thievery: lv + primarySkill(lv) + k, intimidation: lv + secondarySkill(lv) + cha, athletics: lv + T },
        strike: { name: "Rapier", bonus: lv + rWeapon + k + potency(lv), potency: potency(lv), melee: true, agile: false, finesse: true, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 8 }, iwr: { group: "sword" }, damage: [{ dice, die: 6, bonus: k + specialization(lv, rWeapon), type: "piercing" }] },
        backups: [
            { name: "Light Mace", bonus: lv + rWeapon + k + potency(lv), potency: potency(lv), melee: true, agile: true, finesse: true, iwr: { group: "club" }, damage: [{ dice, die: 4, bonus: k + specialization(lv, rWeapon), type: "bludgeoning" }] },
            { name: "Shortbow", bonus: lv + rWeapon + k + potency(lv), potency: potency(lv), melee: false, increment: 60, iwr: { group: "bow" }, hands: 2, deadly: { dice: lv >= 19 ? 3 : lv >= 12 ? 2 : 1, die: 10 }, damage: [{ dice, die: 6, bonus: specialization(lv, rWeapon), type: "piercing" }] }
        ],
        classDC: 10 + lv + rank(lv, [[1, T], [11, E]]) + k,
        extra: {
            strikeExtras: [{ when: "off-guard", dice: lv >= 17 ? 4 : lv >= 11 ? 3 : lv >= 5 ? 2 : 1, die: 6, precision: true, type: null, source: "Sneak Attack" }],
            makesOffGuard: [{ when: { round: 1, notActed: true }, strikes: "all", spells: true, source: "Surprise Attack" }],
            ...(lv >= 5 ? { critSpec: { offGuard: true } } : {}),
            ...(lv >= 7 ? { saveDegrees: [{ saves: ["reflex"], adjustment: { success: "one-degree-better" } }] } : {})
        }
    });

    // Wizard.
    const wizard = pc({
        id: "wizard", name: "Wizard", level: lv, hpPerLevel: 6, con: casterCon, dex: casterDex, wis: minor,
        ac: 10 + lv + rank(lv, [[1, T], [13, E], [17, M]]) + casterDex + armorPotency(lv),
        fort: rank(lv, [[1, T], [9, E]]), ref: rank(lv, [[1, T], [13, E]]), will: rank(lv, [[1, E], [17, M]]),
        perception: rank(lv, [[1, T], [11, E]]),
        skills: { arcana: lv + primarySkill(lv) + k, athletics: lv + T },
        strike: { name: "Staff", bonus: lv + T, melee: true, agile: false, iwr: { group: "club" }, damage: [{ dice: 1, die: 4, bonus: 0, type: "bludgeoning" }] },
        classDC: 10 + lv + spellProf(lv) + k,
        extra: lv >= 17 ? { saveDegrees: [{ saves: ["will"], adjustment: { success: "one-degree-better" } }] } : {}
    });
    Object.assign(wizard, preparedSpells(wizard, SPELLBOOKS.wizard, lv, k, spell));

    // Cleric (cloistered).
    const medicine = lv + primarySkill(lv) + k;
    const cleric = pc({
        id: "cleric", name: "Cleric", level: lv, hpPerLevel: 8, con: casterCon, dex: casterDex, wis: k,
        ac: 10 + lv + rank(lv, [[1, T], [13, E]]) + 1 + casterDex + armorPotency(lv),
        fort: rank(lv, [[1, T], [9, E]]), ref: rank(lv, [[1, T], [11, E]]), will: rank(lv, [[1, E], [9, M], [17, L]]),
        perception: rank(lv, [[1, T], [11, E]]),
        skills: { medicine, religion: lv + primarySkill(lv) + k, diplomacy: lv + secondarySkill(lv) + 1, athletics: lv + T + 1 },
        strike: { name: "Mace", bonus: lv + rank(lv, [[1, T], [11, E]]) + 1 + potency(lv), melee: true, agile: false, iwr: { group: "club" }, damage: [{ dice, die: 6, bonus: 1, type: "bludgeoning" }] },
        classDC: 10 + lv + spellProf(lv) + k,
        extra: {
            battleMedicine: { name: "Battle Medicine", modifier: medicine, tiers: [{ dc: 15, bonus: 0 }, { dc: 20, bonus: 10 }, { dc: 30, bonus: 30 }, { dc: 40, bonus: 50 }].slice(0, primarySkill(lv) / 2) },
            ...(lv >= 9 ? { saveDegrees: [{ saves: ["will"], adjustment: { success: "one-degree-better" } }] } : {})
        }
    });
    Object.assign(cleric, preparedSpells(cleric, SPELLBOOKS.cleric, lv, k, spell));

    // The basic actions each is trained for (Demoralize, Trip, Feint, First Aid …) as their spells, beside their own.
    for (const c of [fighter, rogue, wizard, cleric]) c.spells = [...(c.spells ?? []), ...basicSpells];
    return [fighter, rogue, wizard, cleric];
}
