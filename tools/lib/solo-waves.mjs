// A class's PC alone against endless waves (2026-11-09, Cole: "each class is solo fighting infinite waves of enemies. Each fight should be
// winnable with 10 minutes in between to do any single 10 minute activity such as refocusing. This should loop until the class PC dies and
// rank them based on how long they went").
//
// The PC (src/engine/classes.js, with its eidolon, companion or familiar) fights a wave, keeps its Hit Points, spent slots and Focus
// Points, then rests 10 minutes doing one thing: Treat Wounds on itself (once an hour: PF2e's immunity) or Refocus (1 Focus Point). It
// (2026-11-09, Cole: "casters can cast between waves for healing but they still lose their spell slots. Give everyone an appropriate Medicine
// proficiency for their level and allow them to treat wounds and Battle medicine. After lvl 2 give them Continual Recovery as well so they
// can heal from treat wound every wave. If they have the skill feat slot available also give them Risky Surgery or Mortal Healing if they
// are not a Divine Caster".) See medicineOf and rest below.
//
// It goes on until it's down — alone, no one brings it back — or WAVE_CAP waves.
//
// A wave is a moderate encounter for one PC (Monster Core: 80 XP less 20 for each PC fewer than four = 20 XP): one creature 3 levels
// below it, or (from 4th level, every other wave) two creatures 4 levels below (10 XP each) — creatures of the feat ratings' build (a moderate
// creature's numbers, darkvision, a natural attack), at level −1 at least.
const { classPartyFor } = await import("./deadliness.mjs");
// (The class features the feat tools play — the kineticist's gate impulses: feat-power.mjs registers them.)
await import("./feat-power.mjs");
const { simulate } = await import("../../src/engine/fight.js");
const { DANGER_OPTIONS } = await import("../../src/engine/danger-scale.js");
const { moderateCreatureAt } = await import("../../src/engine/creature-tables.js");
const { createFightState } = await import("../../src/engine/fight.js");
const { castPlan, describeSpell, poolReady, canCast } = await import("../../src/engine/spells.js");
const { primarySkill } = await import("../../src/engine/party.js");

export const WAVE_CAP = Number(process.env.SOLO_CAP) || 1000;
export const RUNS = Number(process.env.SOLO_RUNS) || 20;
export const LEVELS = Object.freeze((process.env.SOLO_LEVELS || "1,5,10,15,20").split(",").map(Number));
const GRID = process.env.FEAT_GRID === "none" ? null : process.env.FEAT_GRID || "open";
const OPTIONS = GRID ? { ...DANGER_OPTIONS, grid: GRID } : DANGER_OPTIONS;

function foe(level, id) {
    const made = { ...moderateCreatureAt(Math.max(-1, Math.min(25, level)), id), senses: ["darkvision"] };
    made.strikes = (made.strikes ?? []).map((strike) => (strike.melee !== false ? { ...strike, unarmed: true } : strike));
    return made;
}
// (2026-11-09, Cole: "after wave 10 have each subsequent wave be slightly stronger. The enemy waves should scale infinitely" — so no class
// with endless recovery goes on forever.) From wave 11, each wave past 10 adds 2% to the foes' Hit Points and Strike damage (compounding),
// and every fifth one +1 to their attack, AC, saves and Perception — about an elite creature's step every 10 waves, with no end.
export const SCALE_FROM = 10;
export function scaled(made, wave) {
    const k = Math.max(0, wave - SCALE_FROM);
    if (!k) return made;
    const grow = 1.02 ** k;
    const plus = Math.floor(k / 5);
    const hp = Math.round(made.hp.max * grow);
    const avg = (part) => (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0);
    return {
        ...made,
        hp: { value: hp, max: hp },
        ac: made.ac + plus,
        saves: Object.fromEntries(Object.entries(made.saves).map(([key, value]) => [key, value + plus])),
        perception: made.perception + plus,
        strikes: made.strikes.map((strike) => ({ ...strike, bonus: strike.bonus + plus, damage: strike.damage.map((part, index) => (index ? part : { ...part, bonus: (part.bonus ?? 0) + Math.round(avg(part) * (grow - 1)) })) })),
        waveScale: { wave, hp: grow, plus }
    };
}
// (2026-11-09, Cole: "Feel free to let casters have spells that their enemies are specifically weak to.") Every wave's creatures have one
// weakness, the next in WEAKNESSES each wave, at the high weakness for their level (GM Core's resistances and weaknesses table) — for every
// class, so the ranking stays a fair one. SOLO_WEAK=0 leaves the creatures without.
export const WEAKNESSES = Object.freeze(["fire", "cold", "electricity", "acid", "sonic", "vitality", "spirit", "mental", "force"]);
const WEAK_HIGH = [1, 3, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 23, 24, 25, 26, 27];
const weakValue = (level) => WEAK_HIGH[Math.max(0, Math.min(WEAK_HIGH.length - 1, level + 1))];
export const weaknessOf = (wave) => (process.env.SOLO_WEAK === "0" ? null : WEAKNESSES[(wave - 1) % WEAKNESSES.length]);
function weakened(made, wave) {
    const type = weaknessOf(wave);
    if (!type) return made;
    return { ...made, weaknesses: [...(made.weaknesses ?? []).filter((each) => each.type !== type), { type, value: weakValue(made.level ?? 0) }] };
}
// (2026-11-09, Cole's pick: fliers and shooters, so a caster's Fly isn't a wall.) Every third wave its creatures fly (waves 3, 9, 15 …) or
// have a ranged Strike too (waves 6, 12, 18 …), as spell-power.js's flying and ranged foes; every class meets them. SOLO_REACH=0 leaves
// every wave melee only.
export const reachOf = (wave) => (process.env.SOLO_REACH === "0" || wave % 3 !== 0 ? null : (wave / 3) % 2 === 1 ? "flier" : "shooter");
function reaching(made, wave) {
    const kind = reachOf(wave);
    if (!kind) return made;
    const strikes = made.strikes ?? [];
    if (kind === "flier") return { ...made, flies: true };
    return strikes.length ? { ...made, strikes: [...strikes, { ...strikes[0], name: `${strikes[0].name ?? "Strike"} (ranged)`, melee: false, increment: 60, reach: undefined }] } : made;
}
export function waveFoes(level, wave) {
    const make = (lv, id) => reaching(weakened(scaled(foe(lv, id), wave), wave), wave);
    if (level - 4 >= -1 && wave % 2 === 0) return [make(level - 4, "monster"), make(level - 4, "monster-1")];
    return [make(level - 3, "monster")];
}

// The PC alone: its own creature and what comes with it (an eidolon sharing its Hit Points, a companion, a familiar), with its solo kit.
export function soloOf(slug, level) {
    const party = classPartyFor(slug, level);
    const pc = party.find((c) => c.id === slug) ?? party.find((c) => c.classSlug === slug);
    const own = party.filter((c) => c === pc || c.sharesHpWith === pc.id || c.companionOf === pc.id || c.familiarOf === pc.id || c.master === pc.id || (pc.companions ?? []).includes(c));
    const kitted = soloKit(slug, pc);
    // (A familiar with the flier ability when its master flies by the kit's Fly: on the ground beside it, it held the master in the wave's
    // melee — space.js aloft.)
    const flier = (kitted.spells ?? []).some((each) => each.prewave);
    return own.map((c) => (c === pc ? kitted : flier && (c.familiar?.masterId === pc.id || c.familiarOf === pc.id) ? { ...c, flies: true } : c));
}

// A caster's solo kit (2026-11-09, Cole: "give them spells that last longer and give them weapons they can use well along side spells. Let
// the caster be more defensive as well … Allow them to have spells with very long durations already be cast, such as Mystic Armor. Give
// them spells that give them movement options the enemies may not have such as the Fly spell then give them ranged weapons … spells that
// their enemies are specifically weak to"). Solo only: the class PCs the party ratings use are untouched. Its parts (KIT_PARTS), each
// class's by CASTER_KITS (the best found by trying them, docs/solo-waves.md), SOLO_KIT=<parts> for every caster, SOLO_KIT=none for none:
//   book     its slots refilled from SOLO_BOOK (defenses, buffs, a damage spell of each type) for its tradition, its cantrips too
//   armor    Mystic Armor cast before the first wave (until its next preparations; a 1st-rank slot)
//   vitality False Vitality before the first wave (8 hours; a 2nd-rank slot), where on its list
//   weapon   a crossbow at its simple-weapon proficiency and Dexterity, with its runes (trained casters' weapon of choice to keep away)
//   heal     Heal in its slots where on its list (divine, primal), for its rests
//   fly      Fly in its slots from 4th rank (SOLO_FLY_SLOTS a rank, all by default), one cast just before each wave while they last
const { spell: partySpell } = await import("./deadliness.mjs");
const { spellNamed } = await import("./pack-spells.mjs");
const { T, potency, striking } = await import("../../src/engine/party.js");
const FLY_SLOTS = Number(process.env.SOLO_FLY_SLOTS ?? 9);
export const KIT_PARTS = Object.freeze(["book", "armor", "vitality", "weapon", "heal", "fly"]);
export const CASTERS = Object.freeze(["wizard", "sorcerer", "witch", "psychic", "oracle", "cleric", "druid", "bard", "animist", "necromancer", "summoner", "magus", "kineticist", "alchemist", "inventor"]);
// The parts each caster keeps; a class not here gets every part (the tuning runs of 2026-11-09: each part, left out, cost most casters
// waves — the book least, Fly most from 10th level — so every caster keeps all of them).
export const CASTER_KITS = Object.freeze({});
// A rank's picks in order: what's on the caster's list and castable here fills its slots, cycling.
const SOLO_BOOK = Object.freeze({
    1: ["Runic Weapon", "Sanctuary", "Fleet Step", "Protection", "Runic Weapon"],
    2: ["Mirror Image", "Blur", "Runic Weapon", "Resist Energy"],
    3: ["Haste", "Heroism", "Fireball", "Mirror Image"],
    4: ["Fly", "Mirror Image", "Haste", "Fireball"],
    5: ["Fly", "Cone of Cold", "Haste", "Mirror Image"],
    6: ["Chain Lightning", "Fly", "Spirit Blast", "Haste"],
    7: ["Sunburst", "Eclipse Burst", "Fly", "Haste"],
    8: ["Polar Ray", "Fly", "Haste", "Chain Lightning"],
    9: ["Polar Ray", "Fly", "Haste", "Chain Lightning"],
    10: ["Polar Ray", "Chain Lightning", "Fly"]
});
// A damage spell of each type the waves can be weak to (one prepared at the rank shown, where on the list; WEAKNESSES).
const TYPED = Object.freeze({
    fire: [["Ignition", 0], ["Breathe Fire", 1], ["Fireball", 3]], cold: [["Frostbite", 0], ["Ray of Frost", 0], ["Chilling Spray", 1]],
    electricity: [["Electric Arc", 0], ["Lightning Bolt", 3]], acid: [["Caustic Blast", 0], ["Acid Grip", 2]], sonic: [["Noise Blast", 2], ["Shatter", 2]],
    vitality: [["Vitality Lash", 0], ["Heal", 1]], spirit: [["Divine Lance", 0], ["Divine Wrath", 4], ["Spirit Blast", 6]], mental: [["Daze", 0], ["Agonizing Despair", 3]],
    force: [["Force Barrage", 1], ["Spiritual Weapon", 2]]
});
const onList = (name, tradition) => (spellNamed(name)?.system?.traits?.traditions ?? []).includes(tradition);
const partsFor = (slug) => {
    const want = process.env.SOLO_KIT;
    if (want === "none") return new Set();
    if (want) return new Set(want.split(","));
    return new Set(CASTER_KITS[slug] ?? KIT_PARTS);
};
export function soloKit(slug, made) {
    if (!CASTERS.includes(slug)) return made;
    const parts = partsFor(slug);
    if (!parts.size) return made;
    const c = { ...made, spells: [...(made.spells ?? [])], spellPools: { ...(made.spellPools ?? {}) }, strikes: [...(made.strikes ?? [])] };
    const lv = c.level;
    const slotted = c.spells.filter((entry) => /:\d+:\d+$/.test(entry.pool ?? ""));
    const model = slotted[0] ?? c.spells.find((entry) => entry.dc);
    const tradition = model?.tradition ?? null;
    const entry = (name, castRank, pool, extra = {}) => {
        const found = partySpell(name, castRank);
        return found ? { ...found, name: found.name ?? name, castRank, dc: model.dc, attack: model.attack, pool, tradition, ...extra } : null;
    };
    if (model && tradition) {
        // Its slots refilled: the defenses and buffs, Heal for its rests, then a spell of each weakness type.
        if (parts.has("book") || parts.has("heal") || parts.has("armor") || parts.has("vitality")) {
            const byRank = new Map();
            for (const each of slotted) {
                const r = Number(each.pool.split(":").at(-2));
                if (!byRank.has(r)) byRank.set(r, []);
                byRank.get(r).push(each.pool);
            }
            const precast = [];
            const take = (r) => {
                const pools = byRank.get(r) ?? [];
                return pools.length ? pools.shift() : null;
            };
            // (Before the first wave: a slot each, the spell constant for every wave.)
            if (parts.has("armor") && onList("Mystic Armor", tradition) && byRank.get(1)?.length) {
                const pool = take(1);
                const r = lv >= 16 ? 8 : lv >= 12 ? 6 : lv >= 8 ? 4 : 1;
                const made = entry("Mystic Armor", Math.min(r, Math.ceil(lv / 2)), null);
                if (made) precast.push({ pool, spell: { ...made, name: "Mystic Armor (Constant)" } });
            }
            if (parts.has("vitality") && onList("False Vitality", tradition) && byRank.get(2)?.length) {
                const pool = take(2);
                const top = Math.min(9, Math.ceil(lv / 2));
                const made = entry("False Vitality", top >= 8 ? 8 : top >= 6 ? 6 : top >= 4 ? 4 : 2, null);
                if (made) precast.push({ pool, spell: { ...made, name: "False Vitality (Constant)" } });
            }
            const picks = [];
            if (parts.has("heal") && onList("Heal", tradition)) {
                const ranks = [...byRank.keys()].sort((a, b) => a - b);
                for (const r of ranks.slice(0, 2)) if (byRank.get(r).length) picks.push([r, "Heal"]);
            }
            // (Fly at every rank from 4th, FLY_SLOTS of each rank's slots: a wave out of reach for each one.)
            if (parts.has("fly") && onList("Fly", tradition)) {
                for (const [r, pools] of byRank) if (r >= 4) for (let i = 0; i < Math.min(FLY_SLOTS, pools.length); i++) picks.push([r, "Fly"]);
            }
            if (parts.has("book")) {
                const typed = Object.values(TYPED).map((list) => list.filter(([name, at]) => at > 0 && onList(name, tradition)).at(-1)).filter(Boolean);
                for (const [name, at] of typed) {
                    const r = [...byRank.keys()].filter((each) => each >= at && byRank.get(each).length > 1).sort((a, b) => b - a)[0];
                    if (r) picks.push([r, name]);
                }
                for (const [r] of byRank) {
                    const list = (SOLO_BOOK[r] ?? []).filter((name) => onList(name, tradition) && partySpell(name, r));
                    for (let i = 0; i < list.length && byRank.get(r).length > picks.filter(([at]) => at === r).length; i++) picks.push([r, list[i]]);
                }
            }
            // Rebuild the slot spells: the picks first, then what the class had in the slots left.
            const kept = new Map(slotted.map((each) => [each.pool, each]));
            const fresh = [];
            for (const [r, name] of picks) {
                const pool = take(r);
                if (!pool) continue;
                const made = entry(name, r, pool);
                if (made) {
                    fresh.push(made);
                    kept.delete(pool);
                }
            }
            for (const { pool, spell } of precast) {
                kept.delete(pool);
                delete c.spellPools[pool];
                fresh.push(spell);
            }
            c.spells = [...c.spells.filter((each) => !/:\d+:\d+$/.test(each.pool ?? "")), ...kept.values(), ...fresh];
        }
        // Its cantrips: a damage cantrip of each weakness type on its list.
        if (parts.has("book")) {
            const have = new Set(c.spells.map((each) => each.name));
            for (const list of Object.values(TYPED)) {
                const [name] = list.find(([n, at]) => at === 0 && onList(n, tradition) && !have.has(n)) ?? [];
                if (!name) continue;
                const made = entry(name, Math.min(10, Math.ceil(lv / 2)), null);
                if (made) c.spells.push(made);
            }
        }
    }
    if (parts.has("weapon") && !c.strikes.some((strike) => strike.melee === false)) {
        const dex = c.abilities?.dex ?? 2;
        c.strikes.push({ name: "Crossbow", bonus: lv + T + dex + potency(lv), potency: potency(lv), melee: false, agile: false, increment: 120, held: true, hands: 2, iwr: { group: "crossbow" }, damage: [{ dice: striking(lv), die: 8, bonus: 0, type: "piercing" }] });
    }
    // (Fly before each wave while it has a slot for it — 5 minutes, a wave's length — spent then: the planner never casts it on its own, and
    // the wave's creatures are melee only, so aloft it's out of their reach. soloTask prewave.)
    if (parts.has("fly")) c.spells = c.spells.map((each) => (/^Fly$/.test(each.name) && each.pool ? { ...each, prewave: true } : each));
    c.soloKit = [...parts];
    return c;
}

// A small seeded die for the rests (the fights roll their own).
function dice(seed) {
    let s = seed >>> 0 || 1;
    return (sides) => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return 1 + Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * sides);
    };
}

// Medicine (2026-11-09, Cole): every PC trained, raised as a skill it keeps up (expert at 3rd, master at 7th, legendary at 15th: the party's
// primary skill), with Wisdom (the cleric's own Medicine where it has one). Battle Medicine in the fights (once a day on itself: PF2e's
// immunity), Treat Wounds in the rests. Skill feats: Continual Recovery from 2nd (Treat Wounds every rest, not once an hour); a second skill
// feat (from 4th, or from 1st for a rogue or an investigator, whose skill feats come every level) Mortal Healing (2nd level; Treat Wounds'
// success a critical success while it hasn't regained Hit Points from divine magic today) — or Risky Surgery for a divine healer (its own
// healing is divine magic, which Mortal Healing excludes) or at 1st level (1d8 slashing first, +2 circumstance, a success a critical one).
const DIVINE = new Set(["cleric", "oracle", "champion"]);
const EVERY_LEVEL = new Set(["rogue", "investigator"]);
export function medicineOf(slug, pc) {
    const lv = pc.level;
    const wis = pc.abilities?.wis ?? 1 + (lv >= 10 ? 1 : 0) + (lv >= 20 ? 1 : 0);
    const prof = primarySkill(lv);
    const modifier = Math.max(pc.skills?.medicine ?? 0, lv + prof + wis);
    const tiers = [{ dc: 15, bonus: 0 }, { dc: 20, bonus: 10 }, { dc: 30, bonus: 30 }, { dc: 40, bonus: 50 }].slice(0, prof / 2);
    const second = lv >= 4 || EVERY_LEVEL.has(slug);
    const feat = !second ? null : DIVINE.has(slug) || lv < 2 ? "Risky Surgery" : "Mortal Healing";
    return { modifier, tiers, continual: lv >= 2, feat };
}

function degreeOf(d, total, dc) {
    let degree = total >= dc + 10 ? 3 : total >= dc ? 2 : total <= dc - 10 ? 0 : 1;
    if (d === 20) degree = Math.min(3, degree + 1);
    if (d === 1) degree = Math.max(0, degree - 1);
    return degree;
}
// Treat Wounds (Player Core): DC 15 trained (2d8), 20 expert (+10), 30 master (+30), 40 legendary (+50); a critical success doubles it, a
// critical failure deals 1d8. The tier with the most healing on average. upgrade: a success counts as a critical success (Risky Surgery,
// Mortal Healing); risky: Risky Surgery's 1d8 slashing first and +2.
function treatWounds(med, roll, { upgrade = false, risky = false } = {}) {
    const mod = med.modifier + (risky ? 2 : 0);
    const expect = (tier) => {
        let total = risky ? -4.5 : 0;
        for (let d = 1; d <= 20; d++) {
            let degree = degreeOf(d, d + mod, tier.dc);
            if (upgrade && degree === 2) degree = 3;
            total += (degree === 3 ? 2 * (9 + tier.bonus) : degree === 2 ? 9 + tier.bonus : degree === 0 ? -4.5 : 0) / 20;
        }
        return total;
    };
    const tier = med.tiers.reduce((best, each) => (expect(each) > expect(best) ? each : best), med.tiers[0]);
    let change = risky ? -roll(8) : 0;
    const d = roll(20);
    let degree = degreeOf(d, d + mod, tier.dc);
    if (upgrade && degree === 2) degree = 3;
    const heal = roll(8) + roll(8) + tier.bonus;
    change += degree === 3 ? 2 * heal : degree === 2 ? heal : degree === 0 ? -roll(8) : 0;
    return change;
}

// Healing spells between waves (Cole: "casters can cast between waves for healing but they still lose their spell slots"): below three
// quarters of its Hit Points, its healing spells on itself (Focus Points first, then its lowest slots; not Harm), until it's at nine tenths
// or out of them. Cast through the engine (castPlan on a fight state of the PC alone), so the amount, the pool spent and the rank are a fight's.
const HEAL_BELOW = Number(process.env.SOLO_HEAL_BELOW) || 0.75;
const HEAL_TO = Number(process.env.SOLO_HEAL_TO) || 0.9;
function healBetween(pc, own, roll, seed) {
    // (2026-11-09: below three quarters, to nine tenths — at half, a lone PC that a wave left above it went into the next one hurt, and the
    // healers' slots went unspent: 0.1 casts a run.)
    if (own.hp >= HEAL_BELOW * pc.hp.max) return { casts: 0, divine: false };
    const state = createFightState({ combatants: [{ ...pc, hp: { ...pc.hp, value: own.hp, temp: 0 }, spellPools: { ...own.pools } }] }, {}, seed);
    const c = state.byId.get(pc.id);
    let casts = 0;
    let divine = false;
    for (let guard = 0; guard < 20 && c.hp.value < HEAL_TO * c.hp.max; guard++) {
        const options = (c.spells ?? []).filter((e) => e.kind !== "basic" && !/^Harm\b/.test(e.name) && describeSpell(e.plan)?.healing && poolReady(c, e) && (!canCast || canCast(c, e) !== false));
        if (!options.length) break;
        options.sort((a, b) => (/focus/.test(b.pool ?? "") - /focus/.test(a.pool ?? "")) || (a.castRank ?? 0) - (b.castRank ?? 0));
        const spell = options[0];
        const before = c.hp.value;
        try {
            castPlan(state, c, spell, [c.id], spell.plan?.activation?.actions ?? 2);
        } catch {
            break;
        }
        casts++;
        if (spell.tradition === "divine" || DIVINE.has(pc.classSlug ?? pc.id)) divine = true;
        if (c.hp.value <= before && JSON.stringify(c.spellPools) === JSON.stringify(own.pools)) break;
        own.pools = { ...c.spellPools };
    }
    own.hp = Math.max(own.hp, Math.min(pc.hp.max, c.hp.value));
    own.pools = { ...c.spellPools };
    return { casts, divine };
}

export function soloTask({ slug, level, run }) {
    const start = soloOf(slug, level);
    const pc = start[0].id === slug ? start[0] : start.find((c) => c.classSlug === slug) ?? start[0];
    const med = medicineOf(slug, pc);
    const focusMax = Object.fromEntries(Object.entries(pc.spellPools ?? {}).filter(([key]) => /focus|unstable/.test(key)));
    const roll = dice(run * 7919 + level * 104729 + slug.length * 31);
    let state = new Map(start.map((c) => [c.id, { hp: c.hp.max, pools: { ...(c.spellPools ?? {}) } }]));
    let minutes = 0;
    let lastTreat = -Infinity;
    let lastDivine = -Infinity;
    let battleMedicineUsed = false; // (false, or the minute it was used)
    const rests = { treat: 0, refocus: 0, none: 0, healSpells: 0, battleMedicine: 0 };
    const hpLeft = [];
    for (let wave = 1; wave <= WAVE_CAP; wave++) {
        // (Its spells cast just before the wave — the kit's Fly —, a slot each, constant for the wave.)
        const before = [];
        for (const each of pc.spells ?? []) {
            const pools = state.get(pc.id).pools;
            if (!each.prewave || before.some((done) => done.name === `${each.name} (Constant)`) || !(pools[each.pool] > 0)) continue;
            pools[each.pool] -= 1;
            before.push({ ...each, name: `${each.name} (Constant)`, pool: null, prewave: false });
            rests.prewave = (rests.prewave ?? 0) + 1;
        }
        const team = start.map((c) => ({
            ...c, hp: { ...c.hp, value: state.get(c.id).hp, temp: 0 }, spellPools: { ...state.get(c.id).pools },
            ...(c === pc && before.length ? { spells: [...c.spells, ...before] } : {}),
            // (Battle Medicine on itself, once a day.)
            ...(c === pc && battleMedicineUsed === false ? { battleMedicine: { name: "Battle Medicine", modifier: med.modifier, tiers: med.tiers } } : c === pc ? { battleMedicine: null } : {})
        }));
        const result = simulate({ combatants: [...team, ...waveFoes(level, wave)] }, OPTIONS, run * 1000 + wave);
        const mine = result.party.find((c) => c.id === pc.id);
        if (!mine || mine.down || mine.dead || result.outcome === "defeat") return { kind: "solo", slug, level, run, waves: wave - 1, rests, hpAt: hpLeft, medicine: { modifier: med.modifier, tiers: med.tiers.length, continual: med.continual, feat: med.feat } };
        if (mine.battleMedicineGiven?.includes(pc.id)) {
            battleMedicineUsed = minutes;
            rests.battleMedicine++;
        }
        minutes += Math.ceil((result.rounds * 6) / 60) + 10;
        state = new Map(start.map((c) => {
            const after = result.party.find((each) => each.id === c.id);
            const was = state.get(c.id);
            return [c.id, { hp: after ? (after.dead || after.down ? 0 : after.hp) : was.hp, pools: after?.spellPools ? { ...after.spellPools } : was.pools }];
        }));
        // (A companion that fell stays down — alone, nothing raises it — but the PC goes on.)
        const own = state.get(pc.id);
        if (wave <= 10) hpLeft.push(Math.round((100 * own.hp) / pc.hp.max));
        // (2026-11-10, an alchemist's versatile vials: 2 back for each 10 minutes of exploration, 3 from 9th, up to its 2 + Intelligence —
        // alongside whatever else it does with the 10 minutes.)
        if (pc.vialRegain && own.pools.reagents !== undefined) own.pools.reagents = Math.min(pc.vialMax ?? Infinity, (own.pools.reagents ?? 0) + pc.vialRegain);
        // (2026-11-10, a chirurgeon's field vials: quick vials, free, that heal the vial's initial damage — once a rest for coagulant, and
        // from 11th again while it's at half its Hit Points or fewer.)
        if (pc.chirurgeonVials) {
            const heal = () => Array.from({ length: pc.chirurgeonVials.dice }, () => roll(6)).reduce((sum, value) => sum + value, 0);
            own.hp = Math.min(pc.hp.max, own.hp + heal());
            for (let guard = 0; pc.chirurgeonVials.uncapped && own.hp <= pc.hp.max / 2 && guard < 50; guard++) own.hp = Math.min(pc.hp.max, own.hp + heal());
        }
        // Its healing spells first (seconds, not the 10 minutes), slots spent.
        const healed = healBetween(pc, own, roll, run * 1000 + wave + 500000);
        rests.healSpells += healed.casts;
        if (healed.divine) lastDivine = minutes;
        // The 10 minutes: Treat Wounds when it's hurt to three quarters or less and it can (every rest with Continual Recovery, else an hour
        // since the last), else Refocus when a Focus Point is spent, else Treat Wounds if hurt at all and it can.
        const ready = med.continual || minutes - lastTreat >= 60;
        const spentFocus = Object.entries(focusMax).filter(([key, max]) => (own.pools[key] ?? 0) < max);
        const hurt = own.hp < pc.hp.max;
        const treat = () => {
            const mortal = med.feat === "Mortal Healing" && minutes - lastDivine >= 24 * 60;
            const risky = med.feat === "Risky Surgery";
            own.hp = Math.max(1, Math.min(pc.hp.max, own.hp + treatWounds(med, roll, { upgrade: mortal || risky, risky })));
            lastTreat = minutes;
            rests.treat++;
        };
        if (ready && own.hp <= 0.75 * pc.hp.max) treat();
        else if (spentFocus.length) {
            for (const [key] of spentFocus) own.pools[key] = (own.pools[key] ?? 0) + 1;
            rests.refocus++;
        } else if (ready && hurt) treat();
        else rests.none++;
        // (A day after it, Battle Medicine's immunity is over.)
        if (battleMedicineUsed !== false && minutes - battleMedicineUsed >= 24 * 60) battleMedicineUsed = false;
    }
    return { kind: "solo", slug, level, run, waves: WAVE_CAP, capped: true, rests, hpAt: hpLeft, medicine: { modifier: med.modifier, tiers: med.tiers.length, continual: med.continual, feat: med.feat } };
}

// The ranking: each class's mean waves at each level, its place among the classes at each level, and the classes ordered by the average of
// those places (so a level where everyone lasts long — 1st, 5th — doesn't outweigh one where no one does — 20th).
export function soloReport(rows) {
    const by = new Map();
    for (const row of rows.filter((r) => r.kind === "solo" && !r.error)) {
        const key = `${row.slug}|${row.level}`;
        if (!by.has(key)) by.set(key, []);
        by.get(key).push(row);
    }
    const slugs = [...new Set(rows.map((r) => r.slug))].sort();
    const levels = [...new Set(rows.map((r) => r.level))].sort((a, b) => a - b);
    const mean = (list) => list.reduce((s, v) => s + v, 0) / Math.max(1, list.length);
    const median = (list) => {
        const s = [...list].sort((a, b) => a - b);
        return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0;
    };
    const cell = {};
    for (const slug of slugs) for (const level of levels) {
        const list = by.get(`${slug}|${level}`) ?? [];
        cell[`${slug}|${level}`] = { mean: mean(list.map((r) => r.waves)), median: median(list.map((r) => r.waves)), capped: list.filter((r) => r.capped).length, n: list.length };
    }
    const rankAt = {};
    for (const level of levels) {
        const order = [...slugs].sort((a, b) => cell[`${b}|${level}`].mean - cell[`${a}|${level}`].mean);
        order.forEach((slug, index) => (rankAt[`${slug}|${level}`] = index + 1));
    }
    const table = slugs.map((slug) => ({ slug, mean: mean(levels.map((level) => cell[`${slug}|${level}`].mean)), rank: mean(levels.map((level) => rankAt[`${slug}|${level}`])), cells: levels.map((level) => cell[`${slug}|${level}`]) }));
    table.sort((a, b) => a.rank - b.rank || b.mean - a.mean);
    const name = (slug) => slug[0].toUpperCase() + slug.slice(1);
    const lines = [
        "# Classes alone against endless waves",
        "",
        `Made by \`node tools/solo-waves.mjs <out>\` (tools/lib/solo-waves.mjs). Each class's PC fights alone (with its eidolon, companion or familiar) against wave after wave of a moderate encounter for one PC (one creature 3 levels below it, or from 4th level every other wave two creatures 4 levels below, 10 XP each). From wave 11 each wave is a little stronger, with no end: +2% Hit Points and damage a wave, compounding, and +1 to attack, AC, saves and Perception every fifth wave. Between waves it keeps its Hit Points, spell slots and Focus Points; below three quarters of its Hit Points it casts its healing spells on itself up to nine tenths (the slots stay spent), then spends 10 minutes on one activity: Treat Wounds on itself or Refocus. Every PC has Medicine at its level (trained, expert at 3rd, master at 7th, legendary at 15th) and uses Battle Medicine on itself once a day in the fights; Continual Recovery from 2nd (Treat Wounds every rest, else once an hour); from 4th (1st for a rogue or investigator) Mortal Healing, or Risky Surgery for a divine healer (cleric, oracle, champion) or at 1st. Each wave's creatures have one weakness, in turn fire, cold, electricity, acid, sonic, vitality, spirit, mental and force, at the high value for their level. The casters (and the kineticist, alchemist and inventor) carry a solo kit: Mystic Armor and False Vitality cast before the first wave, a crossbow, their slots refilled with defenses (Mirror Image, Blur, Haste, Heroism, Sanctuary), Runic Weapon, Heal for divine and primal casters, a spell of each weakness type, and from 4th rank Fly, cast just before a wave while the slots last (the creatures can't reach a flier). It stops when the PC goes down, or at ${WAVE_CAP} waves. The numbers are the waves survived, the mean of ${RUNS} runs at each level.`,
        "",
        "Classes are ordered by their average place across the levels (1st = lasted longest at that level), so every level counts the same. A number in brackets is how many runs reached the cap.",
        "",
        `| # | Class | Average place (1st = best) | ${levels.map((l) => `Waves at lvl ${l}`).join(" | ")} | Average waves |`,
        `|---:|---|---:|${levels.map(() => "---:").join("|")}|---:|`,
        ...table.map((row, index) => `| ${index + 1} | ${name(row.slug)} | ${row.rank.toFixed(1)} | ${row.cells.map((c) => `${c.mean.toFixed(1)}${c.capped ? ` (${c.capped} capped)` : ""}`).join(" | ")} | ${row.mean.toFixed(1)} |`)
    ];
    return { markdown: `${lines.join("\n")}\n`, json: { levels, cap: WAVE_CAP, runs: RUNS, table } };
}
