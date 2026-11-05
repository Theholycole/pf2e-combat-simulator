// The E7 home rule's post-cap feats (Cole's "E6 Rules — Level 7 Cap": the party stops at 7th level and buys feats with XP instead): each
// feat on one PC of the standard 7th-level party, rated as the feat ratings are — whole fights with it and without on the same seeds, the
// gap in levels of the foes — against two tiers of foes: at the cap (the ratings' own: a 9th-level boss, or four 5th-level foes) and
// above it (an 11th-level boss, or four 7th-level foes: the PL+4 fights the rule expects a capped party to prepare for).
// The yardstick: the same PC a level up (8th), what 1,000 XP buys before the cap.
//   Two changes from the feat ratings, both because the E7 feats are numbers and slots rather than actions: the fights come in days of DAY
// (spell slots and focus points spent stay spent until the day's end; Hit Points fresh each fight, as after Treat Wounds), so a slot is
// worth what it is over a day; and the foes cast spells that call for saves (casterFoes) beside their Strikes, so a better save counts.
const { DANGER_OPTIONS, DEATH_WEIGHT } = await import("../../src/engine/danger-scale.js");
const { simulate } = await import("../../src/engine/fight.js");
const { moderate } = await import("../../src/engine/creature-tables.js");
const { powerFoes } = await import("../../src/engine/spell-power.js");
const { partyFor, spell } = await import("./deadliness.mjs");
const { GRID, KINDS } = await import("./feat-power.mjs");

export const FIGHTS = Number(process.env.FEAT_FIGHTS) || 200;
export const DAY = Number(process.env.E7_DAY) || 4;

// Each foe's spells, a save each (one use apiece, at its rank and the moderate spell DC for its level): a boss has all three, a group's
// foes one each in turn.
const FOE_SPELLS = [["Fireball", "reflex"], ["Fear", "will"], ["Blindness", "fortitude"]];
// The harder test: E7_FOE_USES casts of each spell, and E7_FOE_ALL=1 gives every group foe all three.
export const FOE_USES = Number(process.env.E7_FOE_USES) || 1;
const FOE_ALL = process.env.E7_FOE_ALL === "1";
export function casterFoes(kind, level) {
    return powerFoes(kind, level).map((foe, index) => {
        const castRank = Math.max(1, Math.min(10, Math.ceil(foe.level / 2)));
        const dc = moderate("spellDC", foe.level);
        const picks = kind === "boss" || FOE_ALL ? FOE_SPELLS : [FOE_SPELLS[index % FOE_SPELLS.length]];
        const spells = [];
        const spellPools = {};
        for (const [name] of picks) {
            const found = spell(name, castRank);
            if (!found) continue;
            const pool = `${foe.id}:${name}`;
            spells.push({ ...found, name, castRank, dc, attack: dc - 8, pool, tradition: "arcane" });
            spellPools[pool] = FOE_USES;
        }
        return { ...foe, spells: [...(foe.spells ?? []), ...spells], spellPools: { ...(foe.spellPools ?? {}), ...spellPools } };
    });
}

// Fights on seeds [from, to) in days of DAY (a day starts on a multiple of DAY): each PC's spell and focus pools carried from the fight
// before; the score of each fight as the danger scale's (damage taken over the party's Hit Points, downs, deaths, a wipe).
export function dayFights(party, foes, from, to) {
    const partyHp = party.filter((c) => !c.sharesHpWith).reduce((sum, c) => sum + c.hp.max, 0);
    const scores = [];
    let pools = null;
    for (let seed = from; seed < to; seed++) {
        if (seed % DAY === 0) pools = null;
        const today = pools ? party.map((c) => (pools.has(c.id) ? { ...c, spellPools: { ...pools.get(c.id) } } : c)) : party;
        const result = simulate({ combatants: [...today, ...foes] }, GRID ? { ...DANGER_OPTIONS, grid: GRID } : DANGER_OPTIONS, seed);
        const damage = ((result.damageBy?.foes ?? 0) + (result.damageBy?.foesInduced ?? 0)) / partyHp;
        const downs = result.party.filter((c) => c.down && !c.linked).length;
        const deaths = result.party.filter((c) => c.dead && !c.linked).length;
        const score = damage + 0.25 * downs + DEATH_WEIGHT * deaths + (result.outcome === "defeat" ? 1 : 0);
        scores.push(Math.round(score * 1000) / 1000);
        pools = new Map(result.party.filter((c) => c.spellPools).map((c) => [c.id, c.spellPools]));
    }
    return scores;
}
const mean = (list) => list.reduce((sum, value) => sum + value, 0) / Math.max(1, list.length);

export const CAP = 7;
// The foe tiers: the level powerFoes builds its encounters around.
export const TIERS = Object.freeze({ cap: CAP, above: CAP + 2 });

// One PC of the 7th-level party changed (the others as they are): change(copy) edits a copy with its own strikes, saves, skills, spells.
function withPC(id, change, base = partyFor(CAP)) {
    return base.map((c) => {
        if (c.id !== id) return c;
        const copy = { ...c, hp: { ...c.hp }, saves: { ...c.saves }, skills: { ...c.skills }, strikes: c.strikes.map((s) => ({ ...s, damage: s.damage.map((p) => ({ ...p })) })), spells: [...(c.spells ?? [])], spellPools: { ...(c.spellPools ?? {}) } };
        change(copy);
        return copy;
    });
}
const realSpell = (entry) => !entry.kind;
// Spell DC and spell attack (not the basic actions').
const spellBonus = (c, n) => (c.spells = c.spells.map((e) => (realSpell(e) && e.dc != null ? { ...e, dc: e.dc + n, attack: e.attack + n } : e)));
// Slots of a rank taken from a higher-level party's same caster, at this caster's DC and attack. Each added slot holds the spell at that
// rank the caster spends most over a probe of days (E7_SLOT_PICK=first keeps the old pick: the first spell it prepares at that rank) —
// a player prepares the extra slot with what they cast, not with what they leave unspent.
const SLOT_PICK = process.env.E7_SLOT_PICK || "used";
const spentCache = new Map();
function spentByName(party, id, level) {
    const key = `${id}|${level}`;
    if (spentCache.has(key)) return spentCache.get(key);
    const caster = party.find((each) => each.id === id);
    const spent = new Map();
    for (const kind of KINDS) {
        let pools = null;
        for (let seed = 0; seed < 5 * DAY; seed++) {
            if (seed % DAY === 0) pools = null;
            const today = pools ? party.map((c) => (pools.has(c.id) ? { ...c, spellPools: { ...pools.get(c.id) } } : c)) : party;
            const result = simulate({ combatants: [...today, ...casterFoes(kind, level + 2)] }, GRID ? { ...DANGER_OPTIONS, grid: GRID } : DANGER_OPTIONS, 9000 + seed);
            const before = today.find((c) => c.id === id).spellPools ?? {};
            const after = result.party.find((c) => c.id === id)?.spellPools ?? {};
            for (const e of caster.spells.filter((e) => realSpell(e) && e.pool)) {
                const used = (before[e.pool] ?? 0) - (after[e.pool] ?? 0);
                if (used > 0) spent.set(`${e.castRank}|${e.name}`, (spent.get(`${e.castRank}|${e.name}`) ?? 0) + used);
            }
            pools = new Map(result.party.filter((c) => c.spellPools).map((c) => [c.id, c.spellPools]));
        }
    }
    spentCache.set(key, spent);
    return spent;
}
function addSlots(c, ranks, perRank = 1) {
    const dc = c.spells.find((e) => realSpell(e) && e.pool)?.dc;
    const attack = c.spells.find((e) => realSpell(e) && e.pool)?.attack;
    const sourceLevel = Math.min(20, Math.max(...ranks) * 2 - 1 + 2);
    const sourceParty = partyFor(sourceLevel);
    const source = sourceParty.find((each) => each.id === c.id);
    for (const r of ranks) {
        let entries = source.spells.filter((e) => realSpell(e) && e.castRank === r && e.pool && !e.pool.endsWith(":font"));
        if (SLOT_PICK === "used" && entries.length) {
            const spent = spentByName(sourceParty, c.id, sourceLevel);
            entries = [...entries].sort((a, b) => (spent.get(`${r}|${b.name}`) ?? 0) - (spent.get(`${r}|${a.name}`) ?? 0));
        }
        for (let i = 0; i < perRank && entries.length; i++) {
            const pool = `${c.id}:e7-${r}:${Object.keys(c.spellPools).length}`;
            c.spells.push({ ...entries[i % entries.length], dc, attack, pool });
            c.spellPools[pool] = 1;
        }
    }
}
const strikeUp = (c, n, { damage = 0, melee = null } = {}) =>
    (c.strikes = c.strikes.map((s) => (melee !== null && s.melee !== melee ? s : { ...s, bonus: s.bonus + n, damage: s.damage.map((p, i) => (i === 0 ? { ...p, bonus: (p.bonus ?? 0) + damage } : p)) })));
const conUp = (c) => {
    c.hp = { value: c.hp.max + c.level, max: c.hp.max + c.level };
    c.saves.fortitude += 1;
    c.con += 1;
};

// The variants: { id, feat, pc, note, party() }.
export const VARIANTS = [
    // The yardstick: 1,000 XP before the cap.
    ...["fighter", "rogue", "wizard", "cleric"].map((pc) => ({ id: `level-8-${pc}`, feat: "Yardstick: a level (8th)", pc, note: "the same PC at 8th level", party: () => partyFor(CAP).map((c) => (c.id === pc ? partyFor(CAP + 1).find((each) => each.id === pc) : c)) })),

    // Ability Advancement (with Ability Training before it).
    { id: "ability-str-fighter", feat: "Ability Advancement (key)", pc: "fighter", note: "Strength +1: Strikes +1 to hit and damage (melee), Athletics, class DC", party: () => withPC("fighter", (c) => { strikeUp(c, 1, { damage: 1, melee: true }); strikeUp(c, 1, { melee: false }); c.skills.athletics += 1; c.classDC += 1; c.str += 1; }) },
    { id: "ability-dex-rogue", feat: "Ability Advancement (key)", pc: "rogue", note: "Dexterity +1: Strikes +1 to hit and damage (thief), Reflex, Dexterity skills (leather's cap keeps AC)", party: () => withPC("rogue", (c) => { strikeUp(c, 1, { damage: 1 }); c.saves.reflex += 1; for (const s of ["stealth", "acrobatics", "thievery"]) c.skills[s] += 1; }) },
    { id: "ability-int-wizard", feat: "Ability Advancement (key)", pc: "wizard", note: "Intelligence +1: spell DC and spell attack", party: () => withPC("wizard", (c) => { spellBonus(c, 1); c.classDC += 1; c.skills.arcana += 1; }) },
    { id: "ability-wis-cleric", feat: "Ability Advancement (key)", pc: "cleric", note: "Wisdom +1: spell DC and attack, Will, Perception, Medicine", party: () => withPC("cleric", (c) => { spellBonus(c, 1); c.classDC += 1; c.saves.will += 1; c.perception += 1; c.skills.medicine += 1; c.skills.religion += 1; if (c.battleMedicine) c.battleMedicine = { ...c.battleMedicine, modifier: c.battleMedicine.modifier + 1 }; }) },
    { id: "ability-con-fighter", feat: "Ability Advancement (other)", pc: "fighter", note: "Constitution +1: +7 HP, Fortitude +1", party: () => withPC("fighter", conUp) },
    { id: "ability-con-wizard", feat: "Ability Advancement (other)", pc: "wizard", note: "Constitution +1: +7 HP, Fortitude +1", party: () => withPC("wizard", conUp) },
    { id: "ability-dex-wizard", feat: "Ability Advancement (other)", pc: "wizard", note: "Dexterity +1: AC +1, Reflex +1", party: () => withPC("wizard", (c) => { c.ac += 1; c.saves.reflex += 1; }) },

    // Something of an Expert, Canny Acumen and the master-save archetype feats: a save's rank up one step (+2).
    { id: "expert-fort-wizard", feat: "Something of an Expert (save)", pc: "wizard", note: "Fortitude trained → expert (+2); Canny Acumen is the same", party: () => withPC("wizard", (c) => (c.saves.fortitude += 2)) },
    { id: "expert-ref-wizard", feat: "Something of an Expert (save)", pc: "wizard", note: "Reflex trained → expert (+2)", party: () => withPC("wizard", (c) => (c.saves.reflex += 2)) },
    { id: "expert-fort-rogue", feat: "Something of an Expert (save)", pc: "rogue", note: "Fortitude trained → expert (+2)", party: () => withPC("rogue", (c) => (c.saves.fortitude += 2)) },
    { id: "master-fort-fighter", feat: "Juggernaut's Fortitude (master save)", pc: "fighter", note: "Fortitude expert → master (+2)", party: () => withPC("fighter", (c) => (c.saves.fortitude += 2)) },
    { id: "master-will-cleric", feat: "Resolute (master save)", pc: "cleric", note: "Will expert → master (+2)", party: () => withPC("cleric", (c) => (c.saves.will += 2)) },
    { id: "expert-armor-fighter", feat: "Something of an Expert (armor) / Armored Exercise", pc: "fighter", note: "heavy armor trained → expert: AC +2", party: () => withPC("fighter", (c) => (c.ac += 2)) },
    { id: "expert-armor-wizard", feat: "Something of an Expert (armor)", pc: "wizard", note: "unarmored trained → expert: AC +2", party: () => withPC("wizard", (c) => (c.ac += 2)) },
    { id: "expert-weapon-cleric", feat: "Diverse Weapon Expert", pc: "cleric", note: "mace trained → expert: +2 to hit", party: () => withPC("cleric", (c) => strikeUp(c, 2)) },

    // Spell slots.
    { id: "stamina-wizard", feat: "Expanded Caster Stamina", pc: "wizard", note: "one more 4th-rank slot", party: () => withPC("wizard", (c) => addSlots(c, [4])) },
    { id: "stamina-cleric", feat: "Expanded Caster Stamina", pc: "cleric", note: "one more 4th-rank slot", party: () => withPC("cleric", (c) => addSlots(c, [4])) },
    { id: "stamina-2-wizard", feat: "Expanded Caster Stamina ×2", pc: "wizard", note: "two more 4th-rank slots", party: () => withPC("wizard", (c) => addSlots(c, [4], 2)) },
    { id: "expert-casting-wizard", feat: "Expert Spellcasting Advancement", pc: "wizard", note: "a 5th- and a 6th-rank slot (spells assumed earned)", party: () => withPC("wizard", (c) => addSlots(c, [5, 6])) },
    { id: "expert-casting-cleric", feat: "Expert Spellcasting Advancement", pc: "cleric", note: "a 5th- and a 6th-rank slot (spells assumed earned)", party: () => withPC("cleric", (c) => addSlots(c, [5, 6])) },
    { id: "master-casting-wizard", feat: "Master Spellcasting Advancement", pc: "wizard", note: "with Expert's: 5th- to 8th-rank slots, spell DC and attack +2", party: () => withPC("wizard", (c) => { spellBonus(c, 2); addSlots(c, [5, 6, 7, 8]); }) },
    { id: "master-casting-cleric", feat: "Master Spellcasting Advancement", pc: "cleric", note: "with Expert's: 5th- to 8th-rank slots, spell DC and attack +2", party: () => withPC("cleric", (c) => { spellBonus(c, 2); addSlots(c, [5, 6, 7, 8]); }) },
    { id: "master-prof-only-wizard", feat: "(Master proficiency alone)", pc: "wizard", note: "spell DC and attack +2, no slots: how much of Master is the proficiency", party: () => withPC("wizard", (c) => spellBonus(c, 2)) },
    { id: "apex-wizard", feat: "Apex Spellcasting", pc: "wizard", note: "with Master's: 5th- to 9th-rank slots, spell DC and attack +2", party: () => withPC("wizard", (c) => { spellBonus(c, 2); addSlots(c, [5, 6, 7, 8, 9]); }) },
    { id: "apex-cleric", feat: "Apex Spellcasting", pc: "cleric", note: "with Master's: 5th- to 9th-rank slots, spell DC and attack +2", party: () => withPC("cleric", (c) => { spellBonus(c, 2); addSlots(c, [5, 6, 7, 8, 9]); }) }
];

// The scale for the 7th-level party against a tier: its plain fights, and the foes a level up and down (the step, a level of the foes).
export function e7ScaleTask({ tier, encounter: kind }) {
    const party = partyFor(CAP);
    const foeLevel = TIERS[tier];
    const scores = dayFights(party, casterFoes(kind, foeLevel), 0, FIGHTS);
    const up = mean(dayFights(party, casterFoes(kind, foeLevel + 1), 0, FIGHTS));
    const down = mean(dayFights(party, casterFoes(kind, foeLevel - 1), 0, FIGHTS));
    return { kind: "e7-scale", tier, encounter: kind, base: mean(scores), scores, up, down, step: Math.max(0.02, (up - down) / 2) };
}

// A variant against a tier's encounter: the mean gap to the plain party, in levels of the foes.
export function e7Task({ id, tier, encounter: kind, plain }) {
    const variant = VARIANTS.find((each) => each.id === id);
    const party = variant.party();
    const scores = dayFights(party, casterFoes(kind, TIERS[tier]), 0, plain.scores.length);
    const diffs = scores.map((score, index) => score - plain.scores[index]);
    const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
    const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, diffs.length - 1));
    return { kind: "e7", id, tier, encounter: kind, levels: -mean / plain.step, se: sd / Math.sqrt(diffs.length) / plain.step, fights: scores.length };
}

export const e7RunTask = (task) => (task.kind === "e7-scale" ? e7ScaleTask(task) : task.kind === "e7-feat" ? e7FeatTask(task) : e7Task(task));
export { KINDS };


// --- Class feats above the cap (Veteran, Exceptional and Legendary Hero): each on its class's PC of the 7th-level party, played as the
// feat ratings play it (the feat module's plan, its use forced), in the same days against the same foes.
const SEATS = ["fighter", "rogue", "wizard", "cleric"];
export function classFeatRefs() {
    return featLib.featRefs().filter((r) => r.source === "pf2e" && r.category === "class" && r.level > CAP && SEATS.some((seat) => r.traits.includes(seat)));
}
const featLib = await import("./feat-power.mjs");
const plainDays = new Map();
export function e7FeatTask({ ref, tier, encounter: kind, plain }) {
    const doc = featLib.docsOf(ref.path).get(ref.id);
    const head = { kind: "e7-feat", ref, name: ref.name, level: ref.level, seat: SEATS.find((seat) => ref.traits.includes(seat)), tier, encounter: kind };
    if (!doc) return { ...head, skipped: true, reason: "not found" };
    const built = featLib.partyWithFeat(doc, CAP);
    if (built.skipped) return { ...head, skipped: true, reason: built.reason };
    const foes = casterFoes(kind, TIERS[tier]);
    let against = plain.scores;
    if (built.plain) {
        const key = `${featLib.partyHash(built.plain)}|${tier}|${kind}`;
        if (!plainDays.has(key)) plainDays.set(key, dayFights(built.plain, foes, 0, plain.scores.length));
        against = plainDays.get(key);
    }
    const scores = dayFights(built.party, foes, 0, against.length);
    const diffs = scores.map((score, index) => score - against[index]);
    const m = mean(diffs);
    const sd = Math.sqrt(diffs.reduce((sum, value) => sum + (value - m) ** 2, 0) / Math.max(1, diffs.length - 1));
    return { ...head, host: built.host, played: built.played, levels: -m / plain.step, se: sd / Math.sqrt(diffs.length) / plain.step };
}
