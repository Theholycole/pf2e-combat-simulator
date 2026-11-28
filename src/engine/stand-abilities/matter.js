// Stand Abilities: matter theme ("## Matter and Life" of content/stand-abilities.md, the 2026-11-24 wording; see index.js for the contract).
// Shared pieces:
//   heal(…)      a "healing" plan (resolution.native.healing, the core's healing family): its recipients the hurt allies in reach, the
//                user included (the engine can't leave the caster out of a heal).
//   minion(…)    a minion (the module: a creature of your level − 2 with GM Core Low numbers, minion trait) played as its Strike when
//                commanded: one attack roll at its Low attack, its Low damage once for each minion the ability keeps; the 2 actions that
//                make it aren't charged (the fight has no "made it already" state) and it can't be hit or destroyed.
//   standRider() a Strike of the stand's with a rider (strikeActivities on the stand; riderSpell a save after a hit).
//   foeEffect()  an effect model put on a foe by a save's failure (outcomes nativeEffects, the entry's effects map).
// Surges: the user's pool of 2 Stand Points; when the stand has surges of its own too, the stand gets 1 and the user 1 (the two pools of
// the engine are separate).
import { key } from "../party.js";
import { low, moderate } from "../creature-tables.js";

// GM Core Low Strike attack and damage, levels −1 to 24.
const LOW_ATTACK = [4, 4, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 27, 28, 29, 31, 32, 33, 35, 36];
const LOW_DAMAGE = [2, 3, 4, 6, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 35];
// (2026-11-26, module a5ce436, Cole: "give 5th level surges for the late ones" — the 9th-level surges at 5th and new 9th steps; LATE,
// STAND_LATE_SURGE=0 for the text before it.)
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const B1 = new Set(String(globalThis.process?.env?.BAND1 ?? "").split(",").filter(Boolean));  // (2026-11-28, band batch 1a candidates)
const lowAt = (table, level) => table[Math.max(-1, Math.min(24, level)) + 1];

const heals = (lv) => `${2 + Math.floor(lv / 2)}d8+${key(lv)}`;
const avg = (formula) => {
    const m = /^(\d+)d(\d+)/.exec(formula);
    return m ? Math.floor((Number(m[1]) * (Number(m[2]) + 1)) / 2) : 0;
};
const plain = (formula) => formula.replace(/\[[^\]]*\]$/, "");

function heal(ctx, name, { actions, formula, target = "1 creature", surge = false, range = ctx.range }) {
    const plan = ctx.savePlan(name, { actions, traits: ["concentrate", "occult", "stand", "healing"], target, range, damage: null, basic: false });
    plan.resolution = { kind: "healing", check: null, sharedDamage: null, outcomes: {}, native: { healing: { components: [{ id: "0", formula, type: "untyped", category: null }], recipients: "living" } } };
    return ctx.entry(name, plan, { surge });
}

// A save with no damage (conditions only); automatic: no roll, every target gets the success row.
function saveOnly(ctx, name, { actions, save, effects, target = "1 creature", range = ctx.range, area = null, traits = [], surge = false, automatic = false, extra = {} }) {
    const plan = ctx.savePlan(name, { actions, traits: ["concentrate", "occult", "stand", ...traits], area, target, range, save, dc: ctx.dc, damage: null, basic: false, effects, extra });
    if (area && area.type === "burst") plan.targeting.range = range;
    if (automatic) plan.resolution.check = { roll: "automatic" };
    return ctx.entry(name, plan, { surge });
}

// (stand10 buffs) Damage with a basic save at a range of its own (make() is always the stand's 30 ft).
function hurt(ctx, name, { actions, damage, kind, save = "reflex", range = ctx.range, effects = {}, surge = false, extra = {}, target = "1 creature" }) {
    const plan = ctx.savePlan(name, { actions, traits: ["concentrate", "occult", "stand", kind], target, range, save, dc: ctx.dc, damage, basic: true, extra, effects });
    plan.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
    return ctx.entry(name, plan, { surge });
}
// (stand10 buffs) An effect on one ally (native-spell-effect on the target).
function allyEffect(ctx, name, { actions, model, range = ctx.range, surge = false }) {
    const uuid = `stand.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const plan = ctx.savePlan(name, { actions, traits: ["concentrate", "occult", "stand"], target: "1 ally", range, damage: null, basic: false });
    plan.resolution = { kind: "effect", check: null, sharedDamage: null, outcomes: {}, applications: [{ kind: "native-spell-effect", uuid, label: name, recipients: "target" }] };
    const out = ctx.entry(name, plan, { surge });
    out.effects = { [uuid]: model };
    return out;
}

// An effect model on the foes that fail.
function foeEffect(entry, uuid, model, degrees = ["failure", "criticalFailure"]) {
    for (const degree of degrees) (entry.plan.resolution.outcomes[degree].nativeEffects ??= []).push({ uuid, label: model.name });
    entry.effects = { ...(entry.effects ?? {}), [uuid]: model };
    return entry;
}

// Commanded minions' Strikes as one attack roll (count: how many minions; standStrike: the stand's own main Strike, 13th).
function minion(ctx, name, { count = 1, standStrike = false, attackBonus = 0, extraDamage = null, effects = {}, surge = false, kind = "bludgeoning" }) {
    let attack;
    let formula;
    if (standStrike) {
        const part = ctx.main.damage[0];
        attack = ctx.main.bonus;
        formula = `${part.dice * count}d${part.die}+${part.bonus * count}[${part.type}]`;
    } else {
        const level = ctx.lv - 2;
        const average = lowAt(LOW_DAMAGE, level);
        const die = level >= 4 ? 8 : 6;
        const dice = Math.max(1, Math.round((average * 0.55) / ((die + 1) / 2)));
        const bonus = Math.max(0, Math.round(average - (dice * (die + 1)) / 2));
        attack = lowAt(LOW_ATTACK, level);
        formula = `${dice * count}d${die}+${bonus * count}[${kind}]`;
    }
    const plan = ctx.savePlan(name, { actions: 1, traits: ["concentrate", "occult", "stand"], target: "1 creature", range: "60 feet", attack: true, dc: ctx.dc, damage: formula, effects, extra: extraDamage ? { success: [extraDamage], criticalSuccess: [extraDamage] } : {} });
    const out = ctx.entry(name, plan, { surge, attackRoll: true });
    out.attack = attack + attackBonus;
    out.oncePerTurn = true;
    return out;
}

// The stand's Strike with a rider: a save after a hit (riderSpell) or conditions and damage (onHit).
function standRider(ctx, name, { actions = 2, surge = true, rider = null, conditions = [], critical = null, damage = [] }) {
    return {
        name, actions, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false,
        traits: ["stand", "occult"], ...(surge ? { pool: ctx.pool } : {}),
        onHit: { conditions, critical, push: null, damage, save: null, size: null },
        riderSpell: rider ? { name, plan: rider, castRank: Math.ceil(ctx.lv / 2), pool: null, kind: "ability", dc: ctx.dc } : null
    };
}
// (stand10 buffs) A touch done as part of a stand Strike: 1 action, once a turn, no Stand Point; the save after a hit.
function touchStrike(ctx, name, save, effects, extra = {}) {
    const plan = ctx.savePlan(name, { actions: 1, traits: ["occult", "stand"], target: "1 creature", range: "touch", save, dc: ctx.dc, damage: null, basic: false, effects, extra });
    plan.source.type = "action";
    const out = standRider(ctx, name, { actions: 1, surge: false, rider: plan });
    out.oncePerTurn = true;
    return out;
}
function riderPlan(ctx, name, save, effects, traits = []) {
    const plan = ctx.savePlan(name, { actions: 1, traits: ["occult", "stand", ...traits], target: "1 creature", range: "touch", save, dc: ctx.dc, damage: null, basic: false, effects });
    plan.source.type = "action";
    return plan;
}
// (stand10 round 2) A 1-action stand Strike with what a hit adds (once a turn, no Stand Point unless surge): off-guard against it, more
// dice of its own weapon, damage formulas (doubled on a critical hit), conditions ({ slug, value, duration }), a save after the hit.
function strikeAct(ctx, name, { actions = 1, surge = false, offGuard = false, extraWeaponDice = 0, damage = [], conditions = [], critical = null, rider = null }) {
    const out = standRider(ctx, name, { actions, surge, rider, conditions, critical, damage });
    out.offGuard = offGuard;
    if (extraWeaponDice) out.extraWeaponDice = extraWeaponDice;
    if (!surge) out.oncePerTurn = true;
    return out;
}
const cond = (slug, value = null, duration = null) => ({ slug, value, duration });

export const MATTER = {
    Restore: {
        build(ctx) {
            if (ctx.buffed) {
                const r1 = ctx.round1;
                const guard = ctx.lv >= 5 ? [["off-guard", null, ctx.minutes(1)]] : [];
                const rows = { failure: [["immobilized", null, r1], ...guard], criticalFailure: [["restrained", null, r1], ...guard] };
                const mend = ctx.lv >= 13 ? plain(ctx.D("untyped")).replace(/^(\d+)d/, (m, n) => `${Number(n) * 2}d`) : plain(ctx.D("untyped"));
                const spells = [
                    heal(ctx, "Restore (surge heal)", { actions: ctx.lv >= 9 ? 1 : 2, formula: heals(ctx.lv), surge: true, target: ctx.lv >= 13 ? "2 creatures" : "1 creature" }),
                    heal(ctx, "Restore (mend wound)", { actions: 1, formula: mend }),
                    saveOnly(ctx, "Restore (reassemble)", { actions: 1, save: "reflex", range: "touch", effects: rows })
                ];
                return { spells, stand: { strikeActivities: [touchStrike(ctx, "Restore (reassembling strike)", "reflex", rows)] } };
            }
            const spells = [heal(ctx, "Restore (surge heal)", { actions: 2, formula: heals(ctx.lv), surge: true, target: ctx.lv >= 13 ? "2 creatures" : "1 creature" })];
            if (ctx.lv >= 5) spells.push(saveOnly(ctx, "Restore (reassemble)", { actions: 1, save: "reflex", range: "touch", effects: { failure: [["immobilized", null, ctx.round1]], criticalFailure: [["restrained", null, ctx.round1]] } }));
            return { spells };
        },
        buff: {
            "1": "1 action: stand repairs an object it touches (as a success on Repair, no tools), or mends a creature's wound it touches, healing D. Surge, 2 actions: heal a creature 2d8 + your key attribute, +1d8 per 2 levels. Can't target you or your stand. Reassemble: when your stand restores a broken object (1 action), it can fuse a creature it touches into it (Reflex): immobilized on a failure, restrained on a critical failure, for 1 round. Once per turn your stand can Reassemble the creature it hits as part of a Strike (1 action), breaking and fixing it in one blow.",
            "5": "Reassemble also leaves a creature that fails off-guard for 1 minute (its joints fused wrong).",
            "9": "Healing also ends one of persistent damage, enfeebled, clumsy or drained 1. Your surge heal takes 1 action.",
            "13": "Surge heals two creatures. Mending a wound heals 2D."
        },
        buffNotes: [
            "Round 2: 1st: the Reassembling Strike, a 1-action stand Strike (once a turn, no Stand Point) with Reassemble's Reflex save as its rider; 5th: Reassemble's off-guard 1 minute (was 1 round), on both failure rows; 13th: the mend heals 2D.",
            "1st: the 1-action mend as a healing plan of D (it can reach the user too — the engine can't leave the caster out); Reassemble from 1st (a broken object nearby assumed).",
            "5th: off-guard for a round added to Reassemble's failure row.",
            "9th: the surge heal as 1 action; the condition removal still not played."
        ],
        notes: [
            "1st: repairing an object no combat use; the surge heal (2d8 + Charisma, +1d8 per 2 levels) can also go to the user — the engine can't leave the caster and its stand out of a heal.",
            "5th Reassemble: played as 1 action (the repair it rides on) on a creature in the stand's reach; a broken object nearby assumed.",
            "9th: the heal's ending persistent damage, enfeebled, clumsy or drained 1 not played (a healing plan carries no condition removal).",
            "13th: the surge heals two creatures (the two most hurt in reach).",
            "17th: once a day revive of a dead creature not played (the fights here leave PCs dying, rarely dead)."
        ]
    },
    "Life-Giving": {
        build(ctx) {
            const count = ctx.lv >= 9 ? 2 : 1;
            // (2026-11-27, Cole: "is there any way to make use of the animal minions that reflect damage other than hope the enemy uses AoE?"
            // — LG_V: 0 as before (the animals one Strike roll, untouchable, the reflection not played); 1 real animals (summons.js, 2 actions
            // each, made from an object, level − 2 minions with GM Core Low AC, HP, saves and Strike — the stand's main Strike from 13th —,
            // targetable, 1 minute, one command a turn) that reflect half the damage they take from 9th, area damage too; 2 = 1 with Leap In
            // from 9th (a reaction once a round for all of them: an animal beside an ally hit by a Strike takes it instead, when it would deal
            // at least 30% of the ally's HP or drop it).)
            const LG = Number(globalThis.process?.env?.LG_V ?? 13);
            let spells;
            if (LG >= 1) {
                const level = ctx.lv - 2;
                const average = lowAt(LOW_DAMAGE, level);
                const die = level >= 4 ? 8 : 6;
                const dice = Math.max(1, Math.round((average * 0.55) / ((die + 1) / 2)));
                const bonus = Math.max(0, Math.round(average - (dice * (die + 1)) / 2));
                const strike = ctx.lv >= 13 ? { ...structuredClone(ctx.main), name: "Stand's Strike" } : { name: "Bite", bonus: lowAt(LOW_ATTACK, level), melee: true, agile: false, unarmed: true, reach: 5, damage: [{ dice, die, bonus, type: "piercing" }] };
                const saves = { fortitude: low("save", level), reflex: low("save", level), will: low("save", level) };
                ctx.raise("Life-Giving (animate an object)", { count, corpse: "none", strike, ac: low("ac", level), hp: [7, 8, 9].includes(LG) ? Math.max(1, Math.floor(low("hp", level) / 4)) : low("hp", level), saves, level, prefix: "lg-animal", label: "Life-Giving animal", spare: [5, 8, 12].includes(LG) ? 4 : 0, traits: ["animal", "minion"], invisible: false,
                    more: { size: "tiny", ...(ctx.lv >= 9 ? { reflectHalf: true } : {}), ...(LG >= 2 && ctx.lv >= 9 ? { interceptAttack: { name: "Leap In", share: 0.2, ...(LG === 2 || LG === 4 || globalThis.process?.env?.LG_NEAR === "1" ? { near: true } : {}), ...(LG === 4 ? { noReflect: true } : {}), ...([5, 8, 12].includes(LG) ? { mode: "destroy" } : [6, 9, 11, 13].includes(LG) ? { mode: "half" } : LG === 14 ? { mode: "cap" } : {}), ...(LG === 10 ? { never: true } : {}), ...([11, 12, 13, 14].includes(LG) ? { perFight: true } : {}), ...(LG === 13 ? { noReflect: true } : {}) } } : {}) } });
                spells = [];
            } else spells = [minion(ctx, "Life-Giving (command animals)", { count, standStrike: ctx.lv >= 13, kind: "piercing" })];
            if (ctx.lv >= 5) spells.push(heal(ctx, "Life-Giving (surge heal)", { actions: 2, formula: heals(ctx.lv), surge: true }));
            const stand = { critRider: { name: "Life-Giving", conditions: [{ slug: "stupefied", value: 1 }] } };
            let spellPools = null;
            if (ctx.lv >= 17) {
                const rider = riderPlan(ctx, "Life-Giving (surge overload)", "will", { failure: [["slowed", 1, ctx.round1], ["stupefied", 2, ctx.round1]], criticalFailure: [["slowed", 2, ctx.round1], ["stupefied", 2, ctx.round1]] }, ["incapacitation", "mental"]);
                stand.strikeActivities = [standRider(ctx, "Life-Giving (surge overload)", { rider })];
                stand.spellPools = { [ctx.pool]: 1 };
                spellPools = { [ctx.pool]: 1 };
            }
            return { spells, stand, ...(spellPools ? { spellPools } : {}) };
        },
        notes: [
            "1st: the animal minion as minion(): one Low Strike per command (1 action, once a turn), the 2 actions that make it not charged, it can't be hit.",
            "1st: the stand's critical hit's stupefied 1 as a critRider — its 'until the end of its next turn' not carried (it lasts as the engine keeps an undated condition).",
            "5th: the surge heal can target the user (as written).",
            "9th: two animals = two Strikes' damage on one roll; the damage reflected back from a hurt animal not played (animals aren't targets).",
            "13th: the animals use the stand's main Strike (its bonus and damage).",
            "17th: the overload as a 2-action stand Strike (surge) with a Will rider, incapacitation; the stand gets 1 Stand Point and the user 1 (separate pools)."
        ]
    },
    "Property Theft": {
        build(ctx) {
            if (ctx.buffed) {
                const range = ctx.lv >= 5 ? "40 feet" : "30 feet";
                // (Round 3 tone-down: two bubbles stay two at 13th — the third cut; at-will sight dazzled, blinded only on a critical failure.)
                // (2026-11-27, PT_TRIM tone-down, cumulative: 1 — two bubbles an action only as the surge; 2 — the surge's theft 3 rounds (was
                // 1 minute); 3 — no Strike pop.)
                const TRIM = Number(globalThis.process?.env?.PT_TRIM ?? 0);
                const TS = new Set(String(globalThis.process?.env?.PT_TRIMS ?? "3").split(",").filter(Boolean).map(Number));  // (PT_TRIMS=2,3: those trims alone; 2026-11-27: trim 3 adopted, +0.271 — PT_TRIMS= for none)
                const t1 = TRIM >= 1 || TS.has(1), t2 = TRIM >= 2 || TS.has(2), t3 = TRIM >= 3 || TS.has(3);
                const target = ctx.lv >= 5 && !t1 ? "up to 2 creatures" : "1 creature";
                const r1 = ctx.round1;
                const min = ctx.minutes(1);
                const spells = [
                    saveOnly(ctx, "Property Theft (friction)", { actions: 1, save: "reflex", target, range, effects: { failure: [["prone"], ["off-guard", null, r1]], criticalFailure: [["prone"], ["off-guard", null, min]] } }),
                    saveOnly(ctx, "Property Theft (sound)", { actions: 1, save: "fortitude", target, range, automatic: true, effects: { success: [["voiceless", null, r1]] } }),
                    saveOnly(ctx, "Property Theft (water)", { actions: 1, save: "fortitude", target, range, effects: { failure: [["sickened", 1]], criticalFailure: [["sickened", 2]] } })
                ];
                if (ctx.lv >= 5) spells.push(saveOnly(ctx, "Property Theft (sight)", { actions: 1, save: "fortitude", target, range, effects: { failure: [["dazzled", null, r1]], criticalFailure: [["blinded", null, r1]] } }));
                if (ctx.lv >= (LATE ? 5 : 9)) {
                    // (Round 3 tone-down: a surge's minute-long theft is one bubble, one creature.)
                    const target = t1 ? "up to 2 creatures" : "1 creature";
                    const min = t2 ? ctx.rounds(3) : ctx.minutes(1);
                    spells.push(saveOnly(ctx, "Property Theft (surge, sight)", { actions: 2, surge: true, save: "fortitude", target, range, effects: { failure: [["blinded", null, min]], criticalFailure: [["blinded", null, min]] } }));
                    spells.push(saveOnly(ctx, "Property Theft (surge, water)", { actions: 2, surge: true, save: "fortitude", target, range, effects: { failure: [["sickened", 2]], criticalFailure: [["sickened", 3]] } }));
                    spells.push(saveOnly(ctx, "Property Theft (surge, sound)", { actions: 2, surge: true, save: "fortitude", target, range, automatic: true, effects: { success: [["voiceless", null, min]] } }));
                    // (a5ce436 9th: a surge bubble steals two properties — sight and water together, one Fortitude save.)
                    if (LATE && ctx.lv >= 9) spells.push(saveOnly(ctx, "Property Theft (surge, sight and water)", { actions: 2, surge: true, save: "fortitude", target, range, effects: { failure: [["blinded", null, min], ["sickened", 2]], criticalFailure: [["blinded", null, min], ["sickened", 3]] } }));
                }
                if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Property Theft (air)", { actions: 1, save: "fortitude", target, range, effects: { failure: [["voiceless", null, r1]], criticalFailure: [["voiceless", null, r1]] } }));
                // (Round 2: a bubble popped by hand on the creature the stand hits — friction's Reflex save as its rider.)
                const pop = touchStrike(ctx, "Property Theft (bubble strike)", "reflex", { failure: [["prone"], ["off-guard", null, r1]], criticalFailure: [["prone"], ["off-guard", null, min]] });
                const stand = t3 ? {} : { strikeActivities: [pop] };
                // (2026-11-27, NCFILL2 13th: the bubbles ignore cover — spells.js, SCEN_COVER.)
                if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && ctx.lv >= 13) return { spells, stand, user: { ignoreCover: true } };
                return { spells, stand };
            }
            const range = ctx.lv >= 5 ? "40 feet" : "20 feet";
            const target = ctx.lv >= 13 ? "up to 2 creatures" : "1 creature";
            const r1 = ctx.round1;
            const min = ctx.minutes(1);
            const fails = (row) => ({ failure: row, criticalFailure: row });
            const spells = [
                saveOnly(ctx, "Property Theft (friction)", { actions: 1, save: "reflex", target, range, effects: fails([["prone"]]) }),
                saveOnly(ctx, "Property Theft (sound)", { actions: 1, save: "fortitude", target, range, automatic: true, effects: { success: [["voiceless", null, r1]] } }),
                saveOnly(ctx, "Property Theft (water)", { actions: 1, save: "fortitude", target, range, effects: fails([["sickened", 1, r1]]) })
            ];
            if (ctx.lv >= 5) spells.push(saveOnly(ctx, "Property Theft (sight)", { actions: 1, save: "fortitude", target, range, effects: fails([["blinded", null, r1]]) }));
            if (ctx.lv >= 9) {
                spells.push(saveOnly(ctx, "Property Theft (surge, sight)", { actions: 2, surge: true, save: "fortitude", target, range, effects: fails([["blinded", null, min]]) }));
                spells.push(saveOnly(ctx, "Property Theft (surge, water)", { actions: 2, surge: true, save: "fortitude", target, range, effects: fails([["sickened", 1, min]]) }));
                spells.push(saveOnly(ctx, "Property Theft (surge, sound)", { actions: 2, surge: true, save: "fortitude", target, range, automatic: true, effects: { success: [["voiceless", null, min]] } }));
            }
            if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Property Theft (air)", { actions: 1, save: "fortitude", target, range, effects: fails([["voiceless", null, r1]]) }));
            return { spells };
        },
        buff: {
            "1": "1 action: release a bubble that floats 30 ft. It pops on the first creature or object in its path and steals one property for 1 round: friction (it falls prone if it moves and is off-guard for 1 round, Reflex negates; off-guard for 1 minute on a critical failure), sound (silenced) or water (sickened 1, sickened 2 on a critical failure, Fortitude negates; the sickened lasts until it drinks or retches, as normal). Once per turn your stand can pop a bubble on the creature it hits as part of a Strike (1 action), stealing its friction.",
            "5": "Bubbles float 40 ft and you release two bubbles per action at different creatures. You can steal sight (dazzled for 1 round on a failure, blinded for 1 round on a critical failure, Fortitude negates).",
            "9": "Surge: a single bubble whose stolen property lasts 1 minute; stolen water leaves it sickened 2 (sickened 3 on a critical failure).",
        },
        buffNotes: [
            "Round 3 (tone-down): 9th's minute-long surge theft is one bubble at one creature (was two/three like the at-will bubbles); 13th's three bubbles cut (two bubbles per action stay, the module's 13th step now met at 5th); the at-will sight theft dazzled for 1 round on a failure and blinded for 1 round on a critical failure (was blinded 1 round / 1 minute).",
            "Round 2 (first buff): 1st: the bubble floats 30 ft (was 20; at 20 ft it was never used at 1st); friction adds off-guard (1 round; 1 minute on a critical failure); water's sickened kept as PF2e sickened (no duration, ends by retching), 2 on a critical failure; 5th: two bubbles (was 13th) — up to 2 targets — and sight's critical failure 1 minute; 9th: the water surge sickened 2/3; 13th: three bubbles (up to 3 targets). The Bubble Strike: a 1-action stand Strike (once a turn, no Stand Point) with friction's Reflex save as its rider."
        ],
        notes: [
            "Friction: 'falls prone if it moves' played as prone on a failed Reflex save (the foes here move to fight).",
            "Sound: silenced played as voiceless (no spells but subtle ones, nothing auditory) with no save, as written.",
            "The bubble's slow float and first-creature-in-its-path not played: it reaches its target (20 ft, 40 ft from 5th).",
            "9th surges: the minute-long versions of sight, water and sound (2 actions, 1 Stand Point); friction's has nothing to last.",
            "13th: two bubbles = up to 2 creatures a use.",
            "17th: suffocating for 1 round played as voiceless for the round (holding its breath, 1 round costs it no Hit Points)."
        ]
    },
    Duplicate: {
        build(ctx) {
            if (ctx.buffed) {
                const sticker = (name, damage, clumsy, more = []) => {
                    const plan = ctx.savePlan(name, { actions: 1, traits: ["occult", "stand"], target: "1 creature", range: "touch", save: "fortitude", dc: ctx.dc, damage: null, basic: false, extra: { success: [damage] }, effects: clumsy ? { success: [["clumsy", clumsy, ctx.round1], ...more] } : {} });
                    plan.resolution.check = { roll: "automatic" };
                    plan.source.type = "action";
                    return plan;
                };
                // (Round 2: clumsy 1 from 1st; the surge sticker 1 action from 5th; enfeebled 1 for 1 minute on it from 13th.)
                // (Round 4 cap: 13th's enfeebled 1 lasts 1 round, was 1 minute; the surge sticker clumsy 1 at every level, was clumsy 2 from 9th.)
                const quick = standRider(ctx, "Duplicate (sticker strike)", { actions: 1, surge: false, rider: sticker("Duplicate (sticker strike)", ctx.D("force"), 1) });
                quick.oncePerTurn = true;
                const activities = [quick];
                if (ctx.lv >= 5) activities.push(standRider(ctx, "Duplicate (surge sticker)", { actions: 1, rider: sticker("Duplicate (surge sticker)", ctx.S("force"), 1, ctx.lv >= 13 ? [["enfeebled", 1, ctx.round1]] : []) }));
                return { stand: { strikeActivities: activities, ...(ctx.lv >= 5 ? { spellPools: { [ctx.pool]: 2 } } : {}) } };
            }
            if (ctx.lv < 5) return null;
            const rider = ctx.savePlan("Duplicate (surge sticker)", { actions: 1, traits: ["occult", "stand"], target: "1 creature", range: "touch", save: "fortitude", dc: ctx.dc, damage: null, basic: false, extra: { success: [ctx.S("force")] }, effects: { success: [["clumsy", 1, ctx.round1]] } });
            rider.resolution.check = { roll: "automatic" };
            rider.source.type = "action";
            return { stand: { strikeActivities: [standRider(ctx, "Duplicate (surge sticker)", { rider })], spellPools: { [ctx.pool]: 2 } } };
        },
        why: "1st: splitting an object, no combat use (the creature sticker comes at 5th)",
        buff: {
            "1": "1 action: stick on an object to split it into two; removing the sticker slams them back together. Once per turn, your stand can place a sticker on a creature as it Strikes (1 action): on a hit, the split body snaps back when the sticker comes off at the start of your next turn, dealing D damage, no save. A creature with one of your stickers is clumsy 1 until it comes off.",
            "5": "Surge, 1 action: your stand Strikes and sticks on the creature it hits; it gains a clumsy 1 duplicate body. Removing it (1 action, or at your next turn) deals S damage, no save.",
            "13": "Split a creature's weapon: a creature your surge sticker hits is also enfeebled 1 until the start of your next turn."
        },
        buffNotes: [
            "Round 4 (cap): 13th's enfeebled 1 from the surge sticker lasts until the start of your next turn (was 1 minute); 9th's clumsy 2 from the surge sticker cut (clumsy 1 at every level; 9th's two stickers back to the module text, not played).",
            "Round 2: 1st: the 1-action sticker's clumsy 1 (was 9th); 5th: the surge sticker a 1-action stand Strike (was 2); 13th: the surge sticker adds enfeebled 1 for 1 minute.",
            "1st: a 1-action stand Strike (once a turn, no Stand Point) with an automatic rider of D force on a hit — the removal at your next turn played as immediate.",
            "9th: the 1-action sticker adds clumsy 1 for a round, the surge sticker clumsy 2 for a round (Round 4: clumsy 1)."
        ],
        notes: [
            "1st: splitting objects no combat use (null below 5th).",
            "5th: a 2-action stand Strike (surge) that sticks on a hit: clumsy 1 for a round and S force damage, no save, at once (the removal at your next turn played as immediate).",
            "9th: two stickers — no change played (a sticker comes off by your next turn, so one at a time covers it).",
            "13th: splitting a creature's weapon not played (no combat effect stated).",
            "17th: the duplicate's extra Stride not played (movement in range bands)."
        ]
    },
    Unravel: {
        build(ctx) {
            if (!ctx.buffed && ctx.lv < 5) return null;
            const range = ctx.lv >= 13 ? "30 feet" : "15 feet";
            const trapCrit = ctx.buffed && ctx.lv >= 5 ? [["restrained", null, ctx.round1]] : [["grabbed", null, ctx.round1]];
            const spells = [saveOnly(ctx, "Unravel (string trap)", { actions: 1, save: "reflex", range, effects: { failure: [["grabbed", null, ctx.round1]], criticalFailure: trapCrit } })];
            let stand = null;
            if (ctx.buffed) {
                // (Round 5: the lash tangles — off-guard till the end of the user's next turn on a failure, grabbed that long on a critical failure.)
                spells.push(hurt(ctx, "Unravel (string lash)", { actions: 1, damage: ctx.D("slashing"), kind: "slashing", save: "reflex", range, target: "up to 2 creatures", effects: { failure: [["off-guard", null, ctx.rounds(2)]], criticalFailure: [["grabbed", null, ctx.rounds(2)]] } }));
                // (Round 5: the binding's string bites — 1d6 persistent bleed on a failed Reflex; its extra slashing 2d6 from 5th, 3d6 from 13th.)
                const bite = "1d6[persistent,bleed]";
                const binding = touchStrike(ctx, "Unravel (binding strike)", "reflex", { failure: [["grabbed", null, ctx.rounds(2)]], criticalFailure: ctx.lv >= 5 ? [["restrained", null, ctx.rounds(2)]] : [["grabbed", null, ctx.rounds(2)]] }, { failure: [bite], criticalFailure: [bite] });
                binding.onHit.damage = [`${1 + (ctx.lv >= 5 ? 1 : 0) + (ctx.lv >= 13 ? 1 : 0)}d6[slashing]`];
                stand = { strikeActivities: [binding] };
            }
            // (a5ce436: the net at 5th, a 20-ft burst from 9th.)
            const late = ctx.buffed && LATE;
            if (ctx.lv >= (late ? 5 : 9)) spells.push(saveOnly(ctx, "Unravel (surge net)", { actions: ctx.buffed && ctx.lv >= 13 ? 1 : 2, surge: true, save: "reflex", range, area: { type: "burst", value: late && ctx.lv >= 9 ? 20 : 15 }, effects: { failure: [["restrained", null, ctx.round1]], criticalFailure: [["restrained", null, ctx.round1]] } }));
            if (ctx.lv >= 17) {
                const plan = ctx.savePlan("Unravel (sew wounds)", { actions: 1, traits: ["concentrate", "occult", "stand", "healing"], target: "1 ally", range, damage: null, basic: false });
                plan.resolution = { kind: "effect", check: null, sharedDamage: null, outcomes: {}, applications: [{ kind: "native-spell-effect", uuid: "stand.unravel.sew", label: "Unravel (sew wounds)", recipients: "target" }] };
                const entry = ctx.entry("Unravel (sew wounds)", plan);
                entry.effects = { "stand.unravel.sew": ctx.effectModel("Unravel (sew wounds)", 10, { fastHealing: avg(ctx.D("untyped")) }) };
                spells.push(entry);
            }
            return { spells, ...(stand ? { stand } : {}) };
        },
        why: "1st: reach 15 ft for Interact and Grapple and squeezing — the user's own Grapple, no combat use here (its stand fights)",
        buff: {
            "1": "Your body unravels: reach 15 ft for Interact and Grapple, and you can squeeze through any gap. 1 action: string trap on a creature within your string's reach: it's grabbed for 1 round (Reflex negates). 1 action: lash up to two creatures within your string's reach with taut string: D slashing damage (basic Reflex); on a failure the string tangles it, off-guard until the end of your next turn, and on a critical failure it's grabbed until the end of your next turn. Once per turn, your stand can bind a creature it hits with your string as part of a Strike (1 action): the string cuts for 1d6 extra slashing damage (2d6 at 5th, 3d6 at 13th), and it's grabbed until the end of your next turn (Reflex negates); on a failed save the string bites in, 1d6 persistent bleed damage.",
            "5": "The string trap restrains for 1 round on a critical failure, and the binding restrains until the end of your next turn on a critical failure.",
            "13": "String reach 30 ft. Your surge net takes 1 action."
        },
        buffNotes: [
            "Round 5: 1st: the lash's failure off-guard / critical failure grabbed, ctx.rounds(2) (till the end of the user's next turn); the binding Strike's failed Reflex adds 1d6 persistent bleed (rider extra); its extra slashing 2d6 from 5th, 3d6 from 13th (was 9th/17th); the binding's grabbed (restrained on a critical failure from 5th) ctx.rounds(2); the lash at up to 2 creatures from 1st (was 5th).",
            "Round 2: 1st: the binding Strike's extra slashing (onHit damage, doubled on a critical hit); 5th: the lash at up to 2 creatures; 13th: the surge net as 1 action.",
            "1st: the trap (was 5th) from 1st; the lash as a 1-action D slashing basic Reflex at the string's reach (15 ft, 30 ft from 13th). The price (damage to the string is yours) not played, as before. The binding as a 1-action stand Strike (once a turn, no Stand Point) with the trap's Reflex save as its rider.",
            "5th: restrained for a round on the trap's critical failure."
        ],
        notes: [
            "1st: the unravelled body's 15-ft reach for Interact/Grapple and squeezing not played (the user doesn't Grapple here); null below 5th.",
            "5th: the trap as 1 action at one creature within the string's reach (15 ft, 30 ft from 13th), grabbed for a round on a failed Reflex — set where the creature steps.",
            "9th: the net, a 15-ft burst, restrained a round on a failure (surge).",
            "13th: the string reach 30 ft for the trap and net.",
            "17th: sewing wounds as 1 action on an ally: fast healing D (its average) for 1 minute — 'while touched' kept as the whole minute."
        ]
    },
    "Fix in Place": {
        build(ctx) {
            if (ctx.buffed) {
                const r1 = ctx.round1;
                const five = ctx.lv >= 5;
                const limb = { failure: [["off-guard", null, r1], ...(five ? [["immobilized", null, r1]] : [])], criticalFailure: [["off-guard", null, five ? ctx.minutes(1) : r1], ["immobilized", null, r1]] };
                const spells = [saveOnly(ctx, "Fix in Place (fix limb)", { actions: 1, save: "fortitude", range: "touch", effects: limb })];
                const out = { spells, stand: { strikeActivities: [touchStrike(ctx, "Fix in Place (fixing strike)", "fortitude", limb)] } };
                if (ctx.lv >= 5) out.user = { allyAcReaction: { name: "Fix in Place (stop projectile)", value: 50, within: 30, self: true, ranged: true } };
                if (ctx.lv >= (LATE ? 5 : 9)) {
                    const rider = riderPlan(ctx, "Fix in Place (surge immobilize)", "fortitude", { failure: [["immobilized", null, ctx.round1], ["off-guard", null, ctx.round1]], criticalFailure: [["immobilized", null, ctx.lv >= 17 ? ctx.minutes(1) : ctx.round1], ["off-guard", null, ctx.round1]] });
                    out.stand.strikeActivities.push(standRider(ctx, "Fix in Place (surge immobilize)", { rider }));
                    // (a5ce436 9th: one surge fixes up to two creatures the stand hits that turn — played as two fixing Strikes a Stand Point.)
                    out.stand.spellPools = { [ctx.pool]: LATE && ctx.lv >= 9 ? 4 : 2 };
                }
                const momentum = ctx.lv >= 13 ? plain(ctx.D("force")).replace(/^(\d+)d/, (m, n) => `${Number(n) * 2}d`) + "[force]" : ctx.D("force");
                spells.push(ctx.make("Fix in Place (release momentum)", { actions: 1, damage: momentum, kind: "force" }));
                return out;
            }
            if (ctx.lv < 5) return null;
            const spells = [];
            const out = { spells, user: { concealReaction: { name: "Fix in Place (stop projectile)", dc: 21, ranged: true } } };
            if (ctx.lv >= 9) {
                const rider = riderPlan(ctx, "Fix in Place (surge immobilize)", "fortitude", { failure: [["immobilized", null, ctx.round1]], criticalFailure: [["immobilized", null, ctx.lv >= 17 ? ctx.minutes(1) : ctx.round1]] });
                out.stand = { strikeActivities: [standRider(ctx, "Fix in Place (surge immobilize)", { rider })], spellPools: { [ctx.pool]: 2 } };
            }
            if (ctx.lv >= 13) spells.push(ctx.make("Fix in Place (release momentum)", { actions: 1, damage: ctx.D("force"), kind: "force" }));
            return out;
        },
        why: "1st: stopping an object in place, no combat use (the projectile reaction comes at 5th)",
        buff: {
            "1": "1 action: an object your stand touches stops in place (it can't move, even in the air) until you release it as a free action or for 1 minute. Or your stand fixes a limb of a creature it touches (Fortitude): off-guard for 1 round on a failure; also immobilized for 1 round on a critical failure. Once per turn your stand can do this as part of a Strike (1 action) against the creature it hits. Stopped objects keep stored momentum: 1 action, release a stopped object at a creature within 30 ft of your stand for D force damage (basic Reflex).",
            "5": "Reaction: stop a projectile that would hit you or an ally within 30 ft of your stand (Interact); the ranged Strike misses. A creature that fails against your limb fix is also immobilized for 1 round, and one that critically fails is off-guard for 1 minute.",
            "9": "Surge: a creature your stand hits is immobilized and off-guard for 1 round (Fortitude negates).",
            "13": "Stopped objects keep stored momentum. 1 action: release a stopped object at a creature within 30 ft of your stand for 2D force damage (basic Reflex)."
        },
        buffNotes: [
            "Round 2: 1st: releasing stored momentum (was 13th) from 1st — 1 action, D force, basic Reflex, 30 ft (an object already stopped assumed; stopping it not charged); 5th: the limb fix's failure adds immobilized 1 round and its critical failure's off-guard lasts 1 minute; 13th: the release 2D.",
            "1st: the limb fix as a 1-action Fortitude save at touch (the stand's reach), and as a 1-action stand Strike (once a turn, no Stand Point) with the same save as its rider.",
            "5th: the reaction as allyAcReaction (+50 AC once the ranged Strike hits = it misses; a natural 20 still only fails) for the user, its stand and allies within 30 ft, one each round on the user and one on the stand (its clone) — replaces the user-only concealReaction of the unbuffed text.",
            "9th: off-guard added to the surge rider's failure rows."
        ],
        notes: [
            "1st: fixing an object no combat use (null below 5th).",
            "5th: the reaction as the user's concealReaction against ranged Strikes, DC 21 flat (always misses); the stand (a clone of the user) gets it too, on its own reaction — the 'adjacent ally' part covers only the stand. The smoke foes have no ranged Strikes; checked against ranged foes (it fires).",
            "9th: the immobilize as a 2-action stand Strike (surge) with a Fortitude rider, 1 round.",
            "13th: releasing a stopped object, 1 action, D force, basic Reflex — an object already stopped in the air assumed (the scene's).",
            "17th: a critical failure immobilizes for 1 minute."
        ]
    },
    "Wish Golems": {
        build(ctx) {
            // (WG1: golems use the stand's Strike from 5th (was 13th); WG2: WG1 + two golems from 5th (was 9th).)
            const count = ctx.lv >= (B1.has("WG2") ? 5 : 9) ? 2 : 1;
            // (WG3: WG2 + a golem's hit leaves its target off-guard for a round — Judgement's trick.)
            const count2 = B1.has("WG3") && ctx.lv >= 5 ? 2 : count;
            const spells = [minion(ctx, "Wish Golems (command golems)", { count: count2, standStrike: ctx.lv >= (B1.has("WG1") || B1.has("WG2") || B1.has("WG3") ? 5 : 13), ...(B1.has("WG3") ? { effects: { success: [["off-guard", null, ctx.round1]], criticalSuccess: [["off-guard", null, ctx.round1]] } } : {}) })];
            if (ctx.lv >= 5) {
                const fail = [["off-guard", null, ctx.round1], ...(ctx.lv >= 17 ? [["fascinated", null, ctx.round1]] : [])];
                spells.push(saveOnly(ctx, "Wish Golems (surge wish golem)", { actions: 2, surge: true, save: "will", traits: ["mental"], effects: { failure: fail, criticalFailure: fail } }));
            }
            return { spells };
        },
        notes: [
            "1st: the clay golem as minion(): one Low Strike per command (1 action, once a turn), the 2 actions that shape it not charged, it can't be hit.",
            "5th: the wish golem as a surge Will save: off-guard for a round on a failure (to everyone, not only the golem — the shorter time evens it); its attacks come from the command.",
            "9th: two golems = two Strikes' damage on one roll. 13th: the stand's main Strike numbers.",
            "17th: fascinated for 1 round on the same failed Will save."
        ]
    },
    Disguise: {
        build(ctx) {
            if (!ctx.buffed) return null;
            const r1 = ctx.round1;
            const guard = ctx.lv >= 13 ? ctx.minutes(1) : r1;
            const spells = [saveOnly(ctx, "Disguise (trusted face)", { actions: 1, save: "will", target: ctx.lv >= 5 ? "up to 2 creatures" : "1 creature", traits: ["mental", "visual"], effects: { failure: [["off-guard", null, guard], ["frightened", 1]], criticalFailure: [["off-guard", null, guard], ["frightened", 2], ...(ctx.lv >= 13 ? [["stupefied", 1, r1]] : [])] } })];
            // (a5ce436: the false-face surge at 5th, its burst 30 ft from 9th.)
            if (ctx.lv >= (LATE ? 5 : 9)) spells.push(saveOnly(ctx, "Disguise (surge, false face)", { actions: 2, surge: true, save: "will", traits: ["mental", "visual"], area: { type: "burst", value: LATE && ctx.lv >= 9 ? 30 : 20 }, effects: { failure: [["off-guard", null, ctx.minutes(1)]], criticalFailure: [["off-guard", null, ctx.minutes(1)], ["frightened", 1]] } }));
            // (Round 2: the masked Strike — off-guard against it; from 5th a hit frightens 1.)
            const masked = strikeAct(ctx, "Disguise (masked strike)", { offGuard: true, conditions: ctx.lv >= 5 ? [cond("frightened", 1)] : [] });
            return { spells, stand: { strikeActivities: [masked] } };
        },
        buff: {
            "1": "1 action: change your face to look like a person you've seen. +4 status to Deception to Impersonate them. In combat, flash a face a creature within 30 ft trusts or fears (Will negates; mental, visual): it hesitates, off-guard for 1 round and frightened 1 (frightened 2 on a critical failure). Once per turn your stand can Strike from behind a friendly face (1 action): the target is off-guard against that Strike.",
            "5": "Also change a willing ally's face; your trusted face can fool up to 2 creatures at once. A creature your stand's masked Strike hits is frightened 1.",
            "9": "Surge: lasts 1 day; or, in combat, the false face holds for every creature in a 20-ft burst within 30 ft that sees it: a creature that fails is off-guard for 1 minute (frightened 1 too on a critical failure).",
            "13": "Change voice too; the off-guard from your trusted face lasts 1 minute, and a creature that critically fails against it is also stupefied 1 for 1 round."
        },
        buffNotes: [
            "Round 2: 1st: the masked Strike, a 1-action stand Strike (once a turn, no Stand Point) with the target off-guard (+2) to it — the trust it needs taken as given (no check); 5th: a hit with it frightened 1; 13th: the trusted face's off-guard 1 minute.",
            "1st: the trusted face as a 1-action Will save at 30 ft from the stand, off-guard to everyone for a round and frightened 1 (2 on a critical failure) (Oingo posing as Jotaro's grandfather).",
            "5th: the trusted face targets up to 2 creatures. 9th: the surge as 2 actions, 1 Stand Point, a 20-ft burst within 30 ft, off-guard for 1 minute on a failure.",
            "13th: stupefied 1 for a round on the 1-action face's critical failure. 17th's gaze reaction still not played."
        ],
        why: "faces, voices and a reaction against gaze or recognition effects — social, and no gaze effect the fights here play",
        notes: ["17th: the reaction ending a gaze effect not played (the engine has no gaze effects to end)."]
    },
    Shapeshift: {
        build(ctx) {
            if (ctx.buffed) {
                const value = ctx.lv >= 5 ? ctx.lv : Math.max(1, Math.floor(ctx.lv / 2));
                const resist = [{ type: "all-damage", value, exceptions: [] }];
                const user = { selfEffects: [{ name: "Shapeshift (object form)", actions: 1, model: ctx.effectModel("Shapeshift (object form)", 10, { resistances: resist, conditions: [{ slug: "hidden", value: null }] }) }] };
                const tool = ctx.effectModel("Shapeshift (living tool)", 10, { modifiers: [{ on: "attack", type: "circumstance", value: 1 }, { on: "ac", type: "circumstance", value: 2 }, { on: "damage", type: "circumstance", value: ctx.lv >= 13 ? 4 : 2 }] });
                const spells = [allyEffect(ctx, "Shapeshift (living tool)", { actions: 1, model: tool, range: "touch" })];
                // (Round 2: the lunge from beside the object — off-guard against it; a die more from 5th; off-guard a round after a hit from 13th.)
                const lunge = strikeAct(ctx, "Shapeshift (lunge)", { offGuard: true, extraWeaponDice: ctx.lv >= 5 ? 1 : 0, conditions: ctx.lv >= 13 ? [cond("off-guard", null, ctx.round1)] : [] });
                const stand = { selfEffects: null, strikeActivities: [lunge] };
                // (a5ce436: the ambush surge at 5th; one more weapon die from 9th.)
                if (ctx.lv >= (LATE ? 5 : 9)) {
                    stand.strikeActivities = [lunge, { name: "Shapeshift (surge ambush)", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: true, ...(LATE && ctx.lv >= 9 ? { extraWeaponDice: 1 } : {}), requires: null, oncePerFight: false, traits: ["stand", "occult"], pool: ctx.pool, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null }];
                    stand.spellPools = { [ctx.pool]: 2 };
                }
                return { spells, user, stand };
            }
            const resist = ctx.lv >= 5 ? [{ type: "all-damage", value: ctx.lv, exceptions: [] }] : [];
            const user = { selfEffects: [{ name: "Shapeshift (object form)", actions: 2, model: ctx.effectModel("Shapeshift (object form)", 10, { resistances: resist, conditions: [{ slug: "hidden", value: null }] }) }] };
            if (ctx.lv < 9) return { user, stand: { selfEffects: null } };
            user.strikeActivities = [{ name: "Shapeshift (surge ambush)", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: true, requires: null, oncePerFight: false, traits: ["stand", "occult"], pool: ctx.pool, onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null }];
            return { user, stand: { selfEffects: null, strikeActivities: null }, spellPools: { [ctx.pool]: 2 } };
        },
        buff: {
            "1": "1 action: become a Small object. You can't move or attack; Perception DC = your stand DC to spot you; you get resistance to all damage equal to half your level while shaped. Or become a weapon, shield or tool in an adjacent ally's hand (1 action): it gets +1 circumstance to attack rolls, +2 circumstance to AC and +2 circumstance to damage for 1 minute while it holds you. While you're shaped or held, once per turn your stand can lunge out from beside you (1 action): a Strike, and the target is off-guard against it.",
            "5": "Become a Medium object; your resistance while shaped equals your level. Your stand's lunge deals one extra weapon damage die.",
            "9": "Surge: leave object form with a free Strike by your stand against an adjacent creature, which is off-guard.",
            "13": "Become a cart or small boat that up to four allies can ride; you move it at your Speed. As a living tool your damage bonus is +4. A creature your stand's lunge hits is off-guard for 1 round."
        },
        buffNotes: [
            "Round 2: 1st: the lunge, a 1-action stand Strike (once a turn, no Stand Point) with off-guard (+2) — being shaped or held not checked (object form or the tool is the user's usual first action); 5th: +1 weapon die (extraWeaponDice); 13th: off-guard 1 round on a hit.",
            "1st: object form as a 1-action self effect (resistance half level, full from 5th); the living tool as a 1-action ally effect (+1 attack, +2 AC, +2 damage, circumstance, 1 minute) — the user in an ally's hand still has its stand fight beside it (the user's own actions aren't otherwise used).",
            "9th: the ambush as a 1-action Strike of the stand's (surge) with the target off-guard, instead of the user's weak Strike.",
            "13th: the tool's damage +4."
        ],
        notes: [
            "1st: object form as a 2-action self effect for 1 minute: hidden (Perception DC to spot it not rolled); 'can't move or attack' not enforced (the user's own Strikes are weak; its stand still fights).",
            "5th: resistance to all damage equal to its level while shaped (the user's; the stand shares its HP).",
            "9th: leaving with a Strike, the target off-guard, as a 1-action user Strike (surge) — the form isn't ended by it.",
            "13th: the cart no combat use. 17th: a Large object no change."
        ]
    },
    Soften: {
        build(ctx) {
            const early = [];
            let stand = null;
            if (ctx.buffed) {
                // (Round 2: the softened hide as off-guard — 1 round on a failure, 1 minute on a critical failure, and on a failure too from
                // 13th —, also as a 1-action stand Strike; the ground D bludgeoning basic Reflex.)
                const hideRows = { failure: [["off-guard", null, ctx.lv >= 13 ? ctx.minutes(1) : ctx.round1]], criticalFailure: [["off-guard", null, ctx.minutes(1)]] };
                early.push(saveOnly(ctx, "Soften (hide)", { actions: 1, save: "fortitude", range: "touch", effects: hideRows }));
                const strike = touchStrike(ctx, "Soften (softening strike)", "fortitude", hideRows);
                if (ctx.lv >= 5) early.push(hurt(ctx, "Soften (ground)", { actions: 1, damage: ctx.D("bludgeoning"), kind: "bludgeoning", save: "reflex", range: "touch", effects: { failure: [["prone"]], criticalFailure: [["prone"]] } }));
                if (ctx.lv < (LATE ? 5 : 9)) return { spells: early, stand: { strikeActivities: [strike] } };
                stand = { strikeActivities: [strike] };
            }
            if (ctx.lv < (ctx.buffed && LATE ? 5 : 9)) return null;
            const armor = foeEffect(saveOnly(ctx, "Soften (surge armor)", { actions: 2, surge: true, save: "fortitude", effects: {} }), "stand.soften.armor", ctx.effectModel("Soften (surge armor)", 10, { modifiers: [{ on: "ac", type: "untyped", value: -2 }] }));
            const cut = Math.max(1, Math.round(moderate("damage", ctx.lv) / 2));
            const weapon = foeEffect(saveOnly(ctx, "Soften (surge weapon)", { actions: 2, surge: true, save: "fortitude", effects: {} }), "stand.soften.weapon", ctx.effectModel("Soften (surge weapon)", 10, { modifiers: [{ on: "damage", type: "untyped", value: -cut }] }));
            const spells = [...early, armor, weapon];
            // (a5ce436 9th: weapon and armor softened at once — one Fortitude save.)
            if (ctx.buffed && LATE && ctx.lv >= 9) {
                const both = saveOnly(ctx, "Soften (surge weapon and armor)", { actions: 2, surge: true, save: "fortitude", effects: {} });
                foeEffect(both, "stand.soften.armor", ctx.effectModel("Soften (surge armor)", 10, { modifiers: [{ on: "ac", type: "untyped", value: -2 }] }));
                foeEffect(both, "stand.soften.weapon", ctx.effectModel("Soften (surge weapon)", 10, { modifiers: [{ on: "damage", type: "untyped", value: -cut }] }));
                spells.push(both);
            }
            if (ctx.lv >= 17) {
                const body = saveOnly(ctx, "Soften (body)", { actions: 1, save: "fortitude", effects: { failure: [["clumsy", 2, ctx.round1]], criticalFailure: [["clumsy", 2, ctx.round1]] } });
                for (const degree of ["failure", "criticalFailure"]) body.plan.resolution.outcomes[degree].effects.push({ kind: "disarm", what: "drop", penalty: 0 });
                spells.push(body);
            }
            return { spells, ...(stand ? { stand } : {}) };
        },
        why: "softening objects and ground — no combat use before 9th's surge",
        buff: {
            "1": "1 action: your stand softens an object it touches; it's rubbery, Hardness 0, and bounces. Or it softens the armor or hide of a creature it touches (Fortitude negates): it's off-guard for 1 round, or for 1 minute on a critical failure. Once per turn your stand can soften the creature it hits as part of a Strike (1 action).",
            "5": "Softened ground: creatures falling onto it take no damage, and a creature knocked onto it bounces 10 ft. 1 action: soften the ground under a creature your stand touches: it sinks and snaps back up, taking D bludgeoning damage (basic Reflex), and falls prone on a failure.",
            "13": "Soften a 20-ft area of wall or floor: difficult terrain, and you can push through it like water. A creature that fails against your softened armor or hide is off-guard for 1 minute."
        },
        buffNotes: [
            "Round 2: 1st: the hide as off-guard (−2 circumstance AC, at least round 1's −1/−2; the planner didn't value the AC-penalty effect: never used) for 1 round, 1 minute on a critical failure, and the Softening Strike, a 1-action stand Strike (once a turn, no Stand Point) with the hide's Fortitude save as its rider; 5th: the ground D bludgeoning basic Reflex (prone on a failure kept); 13th: the hide's failure off-guard 1 minute.",
            "1st: the hide as a 1-action Fortitude save at touch, an AC −1 (−2 critical) circumstance effect for 1 round.",
            "5th: the ground as a 1-action Reflex save at touch, prone on a failure."
        ],
        notes: [
            "1st/5th: softening objects and ground no combat use (null below 9th).",
            "9th: armor: AC −2 (untyped) for 1 minute on a failed Fortitude save; weapon: 'damage halved' as −(half a moderate creature-of-your-level Strike's damage) to its Strike damage for 1 minute.",
            "13th: the softened 20-ft area (difficult terrain) not played.",
            "17th: the body softened as 1 action (cost unstated): clumsy 2 for a round and its held weapon dropped ('can't hold anything' — the drop outlasts the round until it picks it up)."
        ]
    },
    Disassemble: {
        build(ctx) {
            if (ctx.buffed) {
                // (Round 2, first buff: the chipping Strike from 1st; the surge break 1 action; its slowed 1 minute from 13th.)
                // (Round 3 tone-down: the surge break 2 actions again; chipping 1d6 at every level — was 2d6 at 9th, 3d6 at 17th; the break's slowed 1 round at 13th too; the cage 2 actions.)
                const dice = 1;
                const chip = strikeAct(ctx, "Disassemble (chipping strike)", { damage: [`${dice}d6[strike]`], conditions: [cond("clumsy", 1, ctx.round1)] });
                const out = { spells: [], stand: { strikeActivities: [chip] } };
                if (ctx.lv >= 5) {
                    const slowed = ctx.round1;
                    const rider = riderPlan(ctx, "Disassemble (surge break)", "fortitude", { failure: [["slowed", 1, slowed]], criticalFailure: [["stunned", 2]] }, ["incapacitation"]);
                    out.stand.strikeActivities.push(standRider(ctx, "Disassemble (surge break)", { actions: 2, rider }));
                    out.stand.spellPools = { [ctx.pool]: 2 };
                }
                // (Round 4 cap: the cage is a surge — 1 Stand Point.)
                if (ctx.lv >= 9) out.spells.push(saveOnly(ctx, "Disassemble (surge cage)", { actions: 2, save: "reflex", surge: true, effects: { failure: [["restrained", null, ctx.round1]], criticalFailure: [["restrained", null, ctx.round1]] } }));
                if (ctx.lv >= 13) out.spells.push(heal(ctx, "Disassemble (repair ally)", { actions: 1, formula: plain(ctx.D("untyped")) }));
                return out;
            }
            if (ctx.lv < 5) return null;
            const out = { spells: [] };
            const rider = riderPlan(ctx, "Disassemble (surge break)", "fortitude", { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["stunned", 2]] }, ["incapacitation"]);
            out.stand = { strikeActivities: [standRider(ctx, "Disassemble (surge break)", { rider })], spellPools: { [ctx.pool]: 2 } };
            if (ctx.lv >= 9) out.spells.push(saveOnly(ctx, "Disassemble (cage)", { actions: 1, save: "reflex", effects: { failure: [["restrained", null, ctx.round1]], criticalFailure: [["restrained", null, ctx.round1]] } }));
            if (ctx.lv >= 13) out.spells.push(heal(ctx, "Disassemble (repair ally)", { actions: 1, formula: plain(ctx.D("untyped")) }));
            return out;
        },
        why: "1st: breaking objects into blocks for a barrier or ladder — no combat use before 5th",
        buff: {
            "1": "Your stand's Strike breaks an object into blocks it can rebuild as a 5-ft barrier or ladder. Once per turn your stand's Strike can chip a creature it hits into loose blocks (1 action): 1d6 extra damage of the Strike's type, and it's clumsy 1 for 1 round.",
            "5": "Surge (2 actions): a hit breaks a creature into blocks (Fortitude, incapacitation): slowed 1 for 1 round on a failure, stunned 2 on a critical failure.",
            "9": "Surge (2 actions): rebuild blocks into a cage around a creature (Reflex negates, restrained for 1 round)."
        },
        buffNotes: [
            "Round 4 (cap): the cage is a surge (2 actions and 1 Stand Point; was 2 actions, no Stand Point) — it shares the stand user's Stand Points with other surges.",
            "Round 3 (tone-down): the surge break back to 2 actions (was 1); the chipping Strike's extra die 1d6 at every level (was 2d6 at 9th, 3d6 at 17th); 13th's minute-long slowed cut (the break's slowed 1 round, as the module's 5th); the cage costs 2 actions (was played as 1).",
            "Round 2 (first buff): 1st: the chipping Strike, a 1-action stand Strike (once a turn, no Stand Point) with extra dice on a hit (doubled on a critical hit) and clumsy 1 for a round — the price (the target touched you or the stand) taken as met in melee; 5th: the surge break 1 action (was 2); 13th: its failure slowed 1 for 1 minute."
        ],
        notes: [
            "1st: breaking objects for a 5-ft barrier or ladder not played (null below 5th). 17th: rebuilding a destroyed object no combat use.",
            "5th: the break as a 2-action stand Strike (surge) with a Fortitude rider, incapacitation: slowed 1 a round, stunned 2 on a critical failure.",
            "9th: the cage as 1 action (its cost unstated), restrained for 1 round on a failed Reflex; blocks from an earlier break assumed.",
            "13th: blocks repair an ally as a 1-action heal of D (can reach the user too)."
        ]
    },
    "Invisible Dead": {
        // (2026-11-27, Cole: "does the sim actually look for nearby corpses for the ability price?" — it didn't; now it does: real zombies,
        // classes.js ctx.raise / summons.js. INVDEAD_CORPSES=1: bodies from round 1 (a graveyard, a battlefield); otherwise none at first,
        // and each zombie needs a creature that died this fight.)
        build(ctx) {
            // (a5ce436: three zombies at 9th; the surge at 5th.)
            const late = ctx.buffed && LATE;
            const count = (ctx.lv >= 13 ? 4 : late && ctx.lv >= 9 ? 3 : ctx.lv >= 5 ? 2 : 1) + (B1.has("ID2") || B1.has("ID3") ? 1 : 0);  // (ID2: one more zombie)
            const level = ctx.lv - 2;
            const average = lowAt(LOW_DAMAGE, level);
            const die = level >= 4 ? 8 : 6;
            const dice = Math.max(1, Math.round((average * 0.55) / ((die + 1) / 2)));
            const bonus = Math.max(0, Math.round(average - (dice * (die + 1)) / 2));
            // (2026-11-27, Cole: "for its price it should be stronger when it goes off" — INVDEAD_BUFF, a comma list: mass (one activation
            // raises a zombie from every corpse in reach, up to the cap), free (the zombies act each turn uncommanded), hit (their Strike at
            // Moderate attack and damage).)
            const BUFF = new Set((globalThis.process?.env?.INVDEAD_BUFF ?? "").split(",").filter(Boolean));
            const strike = BUFF.has("hit")
                ? (() => { const m = moderate("damage", level); const dd = Math.max(1, Math.round((m * 0.55) / ((die + 1) / 2))); return { name: "Fist", bonus: moderate("attack", level), melee: true, agile: false, unarmed: true, reach: 5, damage: [{ dice: dd, die, bonus: Math.max(0, Math.round(m - (dd * (die + 1)) / 2)), type: "bludgeoning" }] }; })()
                : { name: "Fist", bonus: lowAt(LOW_ATTACK, level), melee: true, agile: false, unarmed: true, reach: 5, damage: [{ dice, die, bonus, type: "bludgeoning" }] };
            const saves = { fortitude: low("save", level), reflex: low("save", level), will: low("save", level) };
            // (ID3: ID2 + bodies from round 1 — Limp Bizkit raises "any corpse he has interacted with"; ID4: ID1 + bodies from round 1.)
            const corpse = globalThis.process?.env?.INVDEAD_CORPSES === "1" || B1.has("ID3") || B1.has("ID4") ? "start" : "fight";
            // (2026-11-27 variants, INVDEAD_V — default 1, Cole's pick: 0 as above; 1 rise on death — a free reaction raises a creature that just died, once a round
            // (the 2-action raise from an older corpse stays); 2 = 1 with stronger zombies — level − 1, GM Core Moderate Strike, AC, HP and
            // saves; 3 = 2 with two Strikes a command (3 actions after a command: a Stride and two Strikes); 4 = 2 with a Strike as it rises.)
            const V = Number(globalThis.process?.env?.INVDEAD_V ?? 1);
            const strong = V >= 2;
            const zl = strong ? ctx.lv - 1 : level;
            const zStrike = strong ? (() => { const m = moderate("damage", zl); const zd = zl >= 4 ? 8 : 6; const dd = Math.max(1, Math.round((m * 0.55) / ((zd + 1) / 2))); return { name: "Fist", bonus: moderate("attack", zl), melee: true, agile: false, unarmed: true, reach: 5, damage: [{ dice: dd, die: zd, bonus: Math.max(0, Math.round(m - (dd * (zd + 1)) / 2)), type: "bludgeoning" }] }; })() : strike;
            const zSaves = strong ? { fortitude: moderate("save", zl), reflex: moderate("save", zl), will: moderate("save", zl) } : saves;
            const idSummon = ctx.raise("Invisible Dead (raise a zombie)", { count, corpse, fromCorpse: ctx.lv >= 17, strike: zStrike, ac: strong ? moderate("ac", zl) : low("ac", level), hp: strong ? moderate("hp", zl) : low("hp", level), saves: zSaves, level: zl, mass: BUFF.has("mass"), free: BUFF.has("free"), riseOnDeath: V >= 1, riseStrike: V === 4 || ["ID1", "ID2", "ID3", "ID4"].some((k) => B1.has(k)), minionActions: V === 3 ? 3 : 2 });
            // (ID1: a zombie rises with a Strike, and raising one from an older corpse costs 1 action, not 2.)
            if (["ID1", "ID2", "ID3", "ID4"].some((k) => B1.has(k))) idSummon.actions = 1;
            const spells = [];
            if (ctx.lv >= (late ? 5 : 9)) {
                // (The surge, as it was: a command with D more damage a zombie — at most 2D in all, buffed — and grabbed; one roll at a zombie's
                // numbers, only with a zombie up.)
                const extraCount = ctx.buffed ? Math.min(count, 2) : count;
                const extra = plain(ctx.D("untyped")).replace(/^(\d+)d/, (m, n) => `${Number(n) * extraCount}d`) + "[bludgeoning]";
                const grab = ctx.buffed ? { criticalSuccess: [["grabbed", null, ctx.round1]] } : { success: [["grabbed", null, ctx.round1]], criticalSuccess: [["grabbed", null, ctx.round1]] };
                spells.push({ ...minion(ctx, "Invisible Dead (surge command zombies)", { count: 1, attackBonus: 2, surge: true, extraDamage: extra, effects: grab }), needsZombies: true });
            }
            return { spells };
        },
        buff: {
            "9": "Surge: zombies deal D extra damage each (at most 2D in all per command), and a creature they critically hit is grabbed."
        },
        buffNotes: [
            "Round 4 (cap): never buffed; its lowered version caps the surge's extra damage at 2D per command (two zombies' worth) — with four zombies from 13th it was 4D — and grabs only on a critical hit (was any hit). Played on the zombies' one damage roll."
        ],
        notes: [
            "2026-11-27: real zombies (summons.js): 2 actions to raise each, up to 1 (5th: 2, 13th: 4); level − 2 minions with GM Core Low AC, HP, saves and Strike, invisible (hidden: a DC 11 flat check to target), targetable, lasting 1 minute; one action a turn commands them all (they act after the user).",
            "Corpses: INVDEAD_CORPSES=1, bodies from round 1; otherwise each zombie needs a creature that died this fight (30 ft not checked).",
            "9th: the surge as before (1 action, 1 Stand Point), one roll at a zombie's numbers with the extra damage — only while a zombie is up.",
            "17th: a zombie from a creature that died this fight takes its size and melee reach; its Strike stays the zombie's."
        ]
    },
    "Flesh Spray": {
        build(ctx) {
            if (ctx.buffed) {
                const r1 = ctx.round1;
                const twice = plain(ctx.D("untyped")).replace(/^(\d+)d/, (m, n) => `${Number(n) * 2}d`);
                // (Round 2: the rip, D slashing basic Fortitude, blinded a round on a failure from 13th; the sealing at up to 2 from 5th.)
                const sealTarget = ctx.lv >= 5 ? "up to 2 creatures" : "1 creature";
                const seal = (cond) => ({ failure: [[cond, null, r1]], criticalFailure: [[cond, null, ctx.lv >= 5 ? ctx.minutes(1) : r1]] });
                const spells = [
                    // (2026-11-27: the HP the user loses now charged — FLESH_COST=0 for the old free heal.)
                    { ...heal(ctx, "Flesh Spray (close wound)", { actions: 1, formula: twice }), ...(globalThis.process?.env?.FLESH_COST === "0" ? {} : { selfCost: plain(ctx.D("untyped")) }) },
                    saveOnly(ctx, "Flesh Spray (seal eyes)", { actions: 1, save: "reflex", target: sealTarget, effects: seal("blinded") }),
                    saveOnly(ctx, "Flesh Spray (seal mouth)", { actions: 1, save: "reflex", target: sealTarget, effects: seal("voiceless") }),
                    hurt(ctx, "Flesh Spray (rip flesh)", { actions: 1, damage: ctx.D("slashing"), kind: "slashing", save: "fortitude", effects: ctx.lv >= 13 ? { failure: [["blinded", null, r1]], criticalFailure: [["blinded", null, r1]] } : {} })
                ];
                // (a5ce436: the surge heal at 5th; from 9th split between two allies — rolled once, half each as the even split.)
                if (ctx.lv >= (LATE ? 5 : 9)) spells.push(heal(ctx, "Flesh Spray (surge heal)", { actions: 1, formula: heals(ctx.lv), surge: true }));
                if (LATE && ctx.lv >= 9) spells.push(heal(ctx, "Flesh Spray (surge heal, split)", { actions: 1, formula: `${Math.ceil((2 + Math.floor(ctx.lv / 2)) / 2)}d8+${Math.floor(key(ctx.lv) / 2)}`, target: "up to 2 creatures", surge: true }));
                if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Flesh Spray (seal breath)", { actions: 1, save: "fortitude", effects: { failure: [["voiceless", null, r1]], criticalFailure: [["voiceless", null, r1]] } }));
                return { spells };
            }
            const spells = [{ ...heal(ctx, "Flesh Spray (close wound)", { actions: 1, formula: plain(ctx.D("untyped")) }), ...(globalThis.process?.env?.FLESH_COST === "0" ? {} : { selfCost: plain(ctx.D("untyped")) }) }];
            const r1 = ctx.round1;
            if (ctx.lv >= 5) {
                spells.push(saveOnly(ctx, "Flesh Spray (seal eyes)", { actions: 1, save: "reflex", effects: { failure: [["blinded", null, r1]], criticalFailure: [["blinded", null, r1]] } }));
                spells.push(saveOnly(ctx, "Flesh Spray (seal mouth)", { actions: 1, save: "reflex", effects: { failure: [["voiceless", null, r1]], criticalFailure: [["voiceless", null, r1]] } }));
            }
            if (ctx.lv >= 9) spells.push(heal(ctx, "Flesh Spray (surge heal)", { actions: 2, formula: heals(ctx.lv), surge: true }));
            if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Flesh Spray (seal breath)", { actions: 1, save: "fortitude", effects: { failure: [["voiceless", null, r1]], criticalFailure: [["voiceless", null, r1]] } }));
            return { spells };
        },
        buff: {
            "1": "1 action: spray flesh to close an ally's wound: lose up to D HP, and the ally heals twice that much. 1 action: spray a creature's mouth or eyes shut (Reflex negates): blinded or can't speak for 1 round. 1 action: spray flesh onto a creature within 30 ft of your stand and tear it away with a strip of its own: D slashing damage (basic Fortitude).",
            "5": "A creature that critically fails against your spray stays sealed for 1 minute. You can spray two creatures' mouths or eyes shut with one action.",
            "9": "Surge, 1 action: heal an ally 2d8 + your key attribute, +1d8 per 2 levels, without losing HP.",
            "13": "Disguise a creature's face with flesh, as Disguise. A creature that fails against your tearing spray is also blinded for 1 round."
        },
        buffNotes: [
            "Round 2: 1st: the tearing spray, 1 action, 30 ft, D slashing basic Fortitude (the harming side of the price); 5th: the sealing at up to 2 creatures; 13th: blinded 1 round on the tearing spray's failure.",
            "1st: the close-wound heal as 2D (the HP the user loses still not played — the healing family has no cost on the healer); the sealing (was 5th) from 1st, 1 action each.",
            "5th: the sealing's critical failure lasts 1 minute.",
            "9th: the surge heal as 1 action."
        ],
        notes: [
            "1st: closing a wound heals D (1 action) — the user's own HP loss that pays for it not played (the healing family has no cost on the healer).",
            "5th: eyes (blinded) or mouth (can't speak = voiceless) sealed for a round on a failed Reflex, 1 action each (cost unstated).",
            "9th: the surge heal, no HP lost. 13th: the flesh disguise no combat use.",
            "17th: suffocating for 1 round played as voiceless (holding its breath, 1 round costs no HP)."
        ]
    },
    Slide: {
        build(ctx) {
            if (ctx.buffed) {
                const value = ctx.lv >= 13 ? 2 : 1;
                // (Round 6: the pain stays sickened 1/2 at every level; the bleed only on a critical failure.)
                const pain = { failure: [["sickened", 1]], criticalFailure: [["sickened", 2]] };
                // (Round 2: the slid wound bleeds — 1d6 persistent bleed on a critical failure, on a failure too from 5th, 2d6 from 13th.)
                const bleed = `${ctx.lv >= 13 ? 2 : 1}d6[persistent,bleed]`;
                const bleeds = { criticalFailure: [bleed] };
                const spells = [hurt(ctx, "Slide (slide wound)", { actions: 1, damage: ctx.D("force"), kind: "force", save: "will", range: "touch", effects: pain, extra: bleeds, target: ctx.lv >= 5 ? "up to 2 creatures" : "1 creature" })];
                const sliding = touchStrike(ctx, "Slide (sliding strike)", "will", pain, { failure: [ctx.D("force"), ...(bleeds.failure ?? [])], criticalFailure: [ctx.D("force"), bleed] });
                // (Round 5 b: the wound slides into the cut — 1d6 extra force on a hit, 2d6 from 5th, 3d6 from 13th.)
                // (Round 6: trimmed — 1d6, 2d6 from 13th; no 3d6.)
                sliding.onHit.damage = [`${ctx.lv >= 13 ? 2 : 1}d6[force]`];
                // (2026-11-27: SLIDE_MOVE=1 or 0.5 — the slid wound heals its source, actions.js slideTransfer.)
                const move = Number(globalThis.process?.env?.SLIDE_MOVE ?? 1);
                const stand = { strikeActivities: [sliding], ...(move ? { slideTransfer: move } : {}) };
                // (Round 5: the surge condition from 5th (was 9th), onto up to two adjacent enemies (was 13th); the slid wound bleeds on a failure from 1st; its pain sickened 2/3 from 13th.)
                if (ctx.lv >= 5) spells.push(saveOnly(ctx, "Slide (surge condition)", { actions: 1, surge: true, save: "will", range: "touch", target: ctx.lv >= 13 ? "up to 2 creatures" : "1 creature", effects: { failure: [["frightened", value]], criticalFailure: [["frightened", value + 1]] } }));
                if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Slide (features)", { actions: 1, save: "will", range: "touch", effects: { failure: [["stupefied", 2, ctx.minutes(1)]], criticalFailure: [["stupefied", 2, ctx.minutes(1)]] } }));
                // (NCFILL 9th: a temporary suture — 1 action, an ally the stand touches regains D, once per ally per 10 minutes: 4 uses a fight.)
                const suture = (globalThis.process?.env?.NCFILL ?? "1") === "1" && ctx.lv >= 9;
                if (suture) spells.push({ ...heal(ctx, "Slide (suture)", { actions: 1, formula: plain(ctx.D("untyped")) }), pool: "slide-suture" });
                return { spells, stand, ...(move ? { user: { slideTransfer: move } } : {}), ...(suture ? { spellPools: { "slide-suture": 4 } } : {}) };
            }
            if (ctx.lv < 9) return null;
            const value = ctx.lv >= 13 ? 2 : 1;
            const spells = [saveOnly(ctx, "Slide (surge condition)", { actions: 2, surge: true, save: "will", range: "touch", effects: { failure: [["frightened", value]], criticalFailure: [["frightened", value]] } })];
            if (ctx.lv >= 17) spells.push(saveOnly(ctx, "Slide (features)", { actions: 1, save: "will", range: "touch", effects: { failure: [["stupefied", 2, ctx.minutes(1)]], criticalFailure: [["stupefied", 2, ctx.minutes(1)]] } }));
            return { spells };
        },
        why: "markings and moving a bleed onto an object — no combat effect the engine can play before 9th's surge",
        buff: {
            "1": "1 action: slide a marking, label or sign from one surface to another within reach. Or slide a shallow wound from you or an ally onto a creature your stand touches: it takes D damage (basic Will save), and the wound's pain leaves it sickened 1 on a failure (sickened 2 on a critical failure). Once per turn your stand can slide the wound as part of a Strike (1 action) against the creature it hits: the wound opens in the cut for 1d6 extra force damage (2d6 at 13th) before the save. On a critical failure the slid wound also bleeds: 1d6 persistent bleed damage.",
            "5": "Slide a shallow wound: move persistent bleed damage from an ally to an object. Your stand can slide the wound across two creatures it touches with one action (each saves). Surge, 1 action: slide an ally's condition (frightened, sickened or clumsy, value 1) onto an adjacent enemy (Will negates); on a critical failure the slid condition's value is 1 higher.",
            "9": "(The 5th-level surge, moved earlier.)",
            "13": "Slide conditions of value 2, and the surge can split the slid condition between two adjacent enemies (each attempts its own Will save). A slid wound's bleed is 2d6."
        },
        buffNotes: [
            "Round 6: the sliding Strike's onHit force cut to 1d6 (2d6 from 13th; was 2d6 at 5th, 3d6 at 13th); the surge condition onto one enemy at 5th–12th, two from 13th (was two from 5th); the slid wound bleeds only on a critical failure (was failure too); its pain stays sickened 1/2 at 13th (was 2/3).",
            "Round 5: 1st: bleed on a failure too (was 5th); 5th: the 1-action slide wound at up to 2 creatures (touch); the surge condition from 5th (was 9th) at up to 2 creatures (was 13th; each gets the full condition — split read as copied); 13th: the pain sickened 2 / 3. The sliding Strike's onHit 1d6 force (2d6 5th, 3d6 13th).",
            "Round 2: 1st: 1d6 persistent bleed on the slid wound's critical failure (the 1-action use and the Strike's rider); 5th: on a failure too; 13th: 2d6.",
            "1st: the slid wound as a 1-action D force basic Will at touch, sickened 1/2 on a failure/critical failure; also as a 1-action stand Strike (once a turn, no Stand Point) whose Will rider deals D on a failure (no half damage on a success — the rider isn't a basic save); the ally's wound it takes away (a few HP back) not played.",
            "9th: the surge as 1 action; its critical failure as frightened 2 (3 from 13th)."
        ],
        notes: [
            "1st: sliding markings no combat use. 5th: moving an ally's persistent bleed off not played (no ally-targeted condition removal for an ability) — null below 9th.",
            "9th: the slid condition played on the enemy only, as frightened 1 (an ally's frightened assumed; its end on the ally not played), Will negates; 13th frightened 2.",
            "17th: features slid off as 1 action (cost unstated): stupefied 2 for 1 minute on a failed Will; 'can't be recognized' not played."
        ]
    },
    Inflate: {
        build(ctx) {
            if (ctx.buffed) {
                const r1 = ctx.lv >= 5 ? ctx.minutes(1) : ctx.round1;
                // (Round 6: only the clumsy lasts 1 minute from 5th; the off-guard and enfeeblement stay 1 round.)
                const bloat = { failure: [["off-guard", null, ctx.round1], ["clumsy", 1, r1], ["enfeebled", 1, ctx.round1]], criticalFailure: [["off-guard", null, ctx.round1], ["clumsy", 1, r1], ["enfeebled", 2, ctx.round1], ["immobilized", null, ctx.round1]] };
                // (Round 2: the popped balloon, D bludgeoning basic Reflex, 30 ft, two at once from 5th; the bloat's conditions 1 minute from 13th.)
                const spells = [saveOnly(ctx, "Inflate (bloat)", { actions: 1, save: "fortitude", range: "touch", effects: bloat }), hurt(ctx, "Inflate (pop balloon)", { actions: 1, damage: ctx.D("bludgeoning"), kind: "bludgeoning", save: "reflex", target: ctx.lv >= 5 ? "up to 2 creatures" : "1 creature", effects: { criticalFailure: [["off-guard", null, ctx.round1], ["prone"]] } })];
                // (Round 6: no off-guard on a plain failure; a critical failure still off-guard 1 round + prone.)
                // (Round 5: the bang leaves it off-guard for a round on a failure, knocked prone too on a critical failure; three balloons from 13th.)
                // (Round 5 b: the swelling 1 minute from 5th (was 13th); the bloating Strike bruises, 1d6 extra bludgeoning on a hit, 2d6 from 13th.)
                const bloating = touchStrike(ctx, "Inflate (bloating strike)", "fortitude", bloat);
                // (Round 6: the bruise stays 1d6; no 2d6 at 13th.)
                // (Round 7: the 2d6 bruise at 13th back — 13th was the weak level, +0.07.)
                bloating.onHit.damage = [ctx.lv >= 13 ? "2d6[bludgeoning]" : "1d6[bludgeoning]"];
                const out = { spells, stand: { strikeActivities: [bloating] } };
                if (ctx.lv >= 5) out.user = { concealReaction: { name: "Inflate (balloon projectile)", dc: 21, ranged: true, uses: 2 } };
                if (ctx.lv >= 9) {
                    const weapon = saveOnly(ctx, "Inflate (weapon)", { actions: 1, save: "reflex", effects: {} });
                    for (const degree of ["failure", "criticalFailure"]) weapon.plan.resolution.outcomes[degree].effects.push({ kind: "disarm", what: "drop", penalty: 0 });
                    spells.push(weapon);
                }
                return out;
            }
            if (ctx.lv < 5) return null;
            const out = { user: { concealReaction: { name: "Inflate (balloon projectile)", dc: 21, ranged: true, uses: 1 } } };
            if (ctx.lv >= 9) {
                const weapon = saveOnly(ctx, "Inflate (weapon)", { actions: 1, save: "reflex", effects: {} });
                for (const degree of ["failure", "criticalFailure"]) weapon.plan.resolution.outcomes[degree].effects.push({ kind: "disarm", what: "drop", penalty: 0 });
                out.spells = [weapon];
            }
            return out;
        },
        why: "1st: inflating objects into balloons — no combat use before the 5th-level reaction",
        buff: {
            "1": "1 action: inflate an object you touch into a floating balloon; a balloon of Bulk 1 can carry a Small creature up slowly. Or your stand puffs up part of a creature it touches (Fortitude): off-guard, clumsy 1 and enfeebled 1 (its swollen limbs) for 1 round on a failure; on a critical failure enfeebled 2 and it also bobs off the ground, immobilized for 1 round. Once per turn your stand can do this as part of a Strike (1 action) against the creature it hits; the sudden swelling bruises it for 1d6 extra bludgeoning damage. 1 action: your stand overinflates a balloon and bursts it against a creature within 30 ft: D bludgeoning damage (basic Reflex); on a critical failure the bang knocks it prone and leaves it off-guard for 1 round.",
            "5": "Reaction, surge: inflate an incoming projectile into a harmless balloon (ranged Strike against you or an adjacent ally misses). The first use each fight costs no Stand Point. You can burst two balloons with one action, at different creatures. A creature that fails against your stand's puffing stays clumsy for 1 minute; its off-guard and enfeeblement still last 1 round.",
            "13": "Inflate a willing ally to float (fly Speed 15 ft) for 1 minute. The bloating Strike's bruise is 2d6."
        },
        buffNotes: [
            "Round 7: the bloating Strike's bruise is 2d6 from 13th again (Round 6 left Inflate at +0.216, 13th +0.07)",
            "Round 6: the 1-minute swelling from 5th keeps clumsy only (off-guard and enfeebled 1 round); the bruise stays 1d6 (no 2d6 at 13th); no third balloon at 13th (two, from 5th); the bursting balloon's plain failure no longer off-guard (critical failure off-guard 1 round + prone).",
            "Round 5: 1st: the bursting balloon's failure off-guard 1 round, critical failure off-guard + prone; the bloating Strike's onHit 1d6 bludgeoning (2d6 from 13th); 5th: the bloat's conditions 1 minute (was 13th; immobilized stays 1 round); 13th: up to 3 targets.",
            "Round 2: 1st: the bursting balloon, 1 action, 30 ft, D bludgeoning basic Reflex (a balloon at hand assumed: inflating it is the 1st-level action, not charged); 5th: two balloons (up to 2 targets); 13th: the bloat's off-guard/clumsy/enfeebled 1 minute (the critical failure's immobilized stays 1 round).",
            "1st: the bloat as a 1-action Fortitude save at touch, and as a 1-action stand Strike (once a turn, no Stand Point) with the same save as its rider.",
            "5th: the free first use as the reaction's uses 2 (on the user and on the stand, its clone: 4 a fight in all)."
        ],
        notes: [
            "1st: balloons no combat use (null below 5th).",
            "5th: the reaction as the user's concealReaction against ranged Strikes, DC 21 flat (always misses), 1 use on the user and 1 on the stand (its clone) = its 2 Stand Points; other adjacent allies not covered. Checked against ranged foes (it fires); the smoke foes have none.",
            "9th: a held weapon made harmless as dropped on a failed Reflex (1 action, cost unstated) — it spends an action picking it up instead of a round without it; natural weapons untouched, as written (the smoke foes' Strikes aren't held: never used there; checked against held-weapon foes).",
            "13th: an ally floating (fly 15 ft) not played. 17th: any projectile within 30 ft — still only the user's own (as 5th)."
        ]
    }
};
