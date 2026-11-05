// Animal companions (2026-11-05, Cole's pick "Companions in the simulator"): a druid's or ranger's animal companion — or an archetype's —
// as its own body in the fight, beside its master. Player Core's rules, played simply:
//   - It acts when its master Commands it: the master's turn is two actions (Command spent), the companion's two of its own, on its own
//     turn (as the eidolon's — classes.js; the companion's Support benefit isn't played).
//   - A bear (Player Core's): Strength +3, Dexterity +2, Constitution +2, Wisdom +1, 8 ancestry Hit Points and 6 + Constitution a level,
//     Jaws 1d8 piercing and an agile Claw 1d6 slashing, Speed 35. Its Strikes have no runes.
//   - Its stage, from the feats that grow it: young; mature (+1 Strength, Dexterity, Constitution and Wisdom, two damage dice, expert saves
//     and Perception); incredible, played as savage (+2 Strength, +1 the others, three damage dice, expert unarmed attacks); specialized
//     (+1 to each again, expert unarmored defense, master saves, +2 damage on its Strikes — a specialization's edge, roughly).
// Its Hit Points are its own: the ratings' party Hit Points count them, as they count a hit on it (danger-scale.js); its fall isn't a PC's.
// Mature and later companions' action without a Command isn't played: the master always Commands.
import { E, M, T, rank } from "./party.js";

export const COMPANION_STAGES = Object.freeze(["young", "mature", "incredible", "specialized"]);

const STAGE_STATS = {
    young: { str: 3, dex: 2, con: 2, wis: 1, dice: 1, attack: T, defense: T, saves: T, perception: T, damage: 0 },
    mature: { str: 4, dex: 3, con: 3, wis: 2, dice: 2, attack: T, defense: T, saves: E, perception: E, damage: 0 },
    incredible: { str: 6, dex: 4, con: 4, wis: 3, dice: 3, attack: E, defense: T, saves: E, perception: E, damage: 0 },
    specialized: { str: 7, dex: 5, con: 5, wis: 4, dice: 3, attack: E, defense: E, saves: M, perception: E, damage: 2 }
};

// The stage a feat's companion has by the master's level when the feat doesn't say: young.
export function companionStats(level, stage = "young") {
    const lv = Math.max(1, Math.min(20, Number(level) || 1));
    const s = STAGE_STATS[stage] ?? STAGE_STATS.young;
    const hp = 8 + (6 + s.con) * lv;
    const attack = lv + s.attack + s.str;
    return {
        hp, ac: 10 + lv + s.defense + s.dex,
        saves: { fortitude: lv + s.saves + s.con, reflex: lv + s.saves + s.dex, will: lv + s.saves + s.wis },
        perception: lv + s.perception + s.wis,
        athletics: lv + rank(lv, [[1, T]]) + s.str + (stage === "young" ? 0 : 2),
        strikes: [
            { name: "Jaws", bonus: attack, potency: 0, melee: true, agile: false, unarmed: true, held: false, iwr: { group: "brawling" }, damage: [{ dice: s.dice, die: 8, bonus: s.str + s.damage, type: "piercing" }] },
            { name: "Claw", bonus: attack, potency: 0, melee: true, agile: true, unarmed: true, held: false, iwr: { group: "brawling" }, damage: [{ dice: s.dice, die: 6, bonus: s.str + s.damage, type: "slashing" }] }
        ],
        str: s.str, con: s.con
    };
}

// The companion as a combatant for its master (a PC): its own id, side and turn.
export function animalCompanion(master, stage = "young") {
    const stats = companionStats(master.level, stage);
    return {
        id: `${master.id}-companion`, name: `${master.name}'s Animal Companion`, side: master.side, kind: "npc", level: master.level,
        traits: ["animal", "minion"], senses: ["low-light-vision", "scent"], companionOf: master.id, companionStage: stage,
        hp: { value: stats.hp, max: stats.hp }, con: stats.con, str: stats.str, ac: stats.ac, saves: stats.saves, perception: stats.perception,
        skills: { athletics: stats.athletics }, speed: 35, reach: 5, heroPoints: 0, shield: null, reactions: { aoo: false, shieldBlock: false },
        strikes: stats.strikes, spells: (master.spells ?? []).filter((entry) => entry.kind === "basic"), spellPools: {}, classDC: null,
        actionsPerTurn: 2, critSpec: false, cond: {}
    };
}

// The party with the master's companion beside it (the master's turn two actions, one spent to Command it). A companion it has is
// replaced.
export function withCompanion(party, masterId, stage = "young") {
    const master = party.find((c) => c.id === masterId);
    if (!master) return party;
    const out = party.filter((c) => c.companionOf !== masterId).map((c) => (c.id === masterId ? { ...c, actionsPerTurn: Math.min(c.actionsPerTurn ?? 3, 2), companionStage: stage } : c));
    const index = out.findIndex((c) => c.id === masterId);
    out.splice(index + 1, 0, animalCompanion(out[index], stage));
    return out;
}

// (2026-11-05) A familiar beside its master: PF2e's numbers for one (5 Hit Points a level, its master's AC and saves), no Strikes and no
// turns of its own (familiars.js plays what it does). spec: { hexAbility, lifelink, focus } — familiars.js.
export function familiarFor(master, spec = {}) {
    const hp = 5 * Math.max(1, Number(master.level) || 1);
    return {
        id: `${master.id}-familiar`, name: `${master.name}'s Familiar`, side: master.side, kind: "npc", acts: false, level: master.level,
        traits: ["animal", "minion"], senses: ["low-light-vision"], hp: { value: hp, max: hp, temp: 0 }, ac: master.ac, hardness: 0,
        saves: { ...master.saves }, perception: master.perception, skills: {}, speed: 25, reach: 5, heroPoints: 0, shield: null,
        reactions: { aoo: false, shieldBlock: false }, strikes: [], spells: [], spellPools: {}, cond: {},
        familiar: { masterId: master.id, hexAbility: spec.hexAbility ?? null, lifelink: Boolean(spec.lifelink), focus: Boolean(spec.focus) }
    };
}
