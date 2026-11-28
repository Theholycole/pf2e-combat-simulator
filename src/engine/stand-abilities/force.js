// Stand Abilities: force theme (see index.js for the contract). The module's "## Force and Energy" (content/stand-abilities.md, the
// 2026-11-24 buffed wording). Level steps cumulative; a surge costs 1 Stand Point and 2 actions unless the text lists its cost.
import { zoneSpell } from "../zones.js";

// (2026-11-26, module a5ce436, Cole: "give 5th level surges for the late ones" — the 9th-level surges at 5th and new 9th steps; LATE,
// STAND_LATE_SURGE=0 for the text before it.)
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const B1 = new Set(String(globalThis.process?.env?.BAND1 ?? "").split(",").filter(Boolean));  // (2026-11-28, band batch 1a candidates)
const TRAITS = (kind, more = []) => ["concentrate", "occult", "stand", ...(kind ? [kind] : []), ...more];

// A plan with no roll ("no save", "for creatures you choose"): its success row for everyone it reaches.
function autoPlan(ctx, name, { actions, kind = null, traits = [], area = null, target = "1 creature", range = ctx.range, success = {} }) {
    const plan = ctx.savePlan(name, { actions, traits: TRAITS(kind, traits), area, target, range, dc: ctx.dc, damage: null, basic: false });
    if (area?.type === "burst") plan.targeting.range = range;
    plan.resolution.check = { roll: "automatic", statistic: "automatic" };
    plan.resolution.outcomes.success = { ...plan.resolution.outcomes.success, ...success };
    return plan;
}
// A save plan of the stand DC (savePlan, set as make() sets its own): condition-only (damage null) or damage of one type.
function plan(ctx, name, { actions, kind = null, traits = [], area = null, target = "1 creature", range = ctx.range, save = "reflex", damage = null, basic = true, extra = {}, effects = {}, attack = false }) {
    const p = ctx.savePlan(name, { actions, traits: TRAITS(kind, traits), area, target, range, save, attack, dc: ctx.dc, damage, basic, extra, effects });
    if (area?.type === "burst") p.targeting.range = range;
    if (damage) p.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
    return p;
}
// Two damage types rolled together (a meteor's bludgeoning and fire): a second shared component.
function twoTypes(p, second, kind2) {
    p.resolution.sharedDamage.components.push({ id: "1", formula: second, type: kind2, category: null });
    for (const outcome of Object.values(p.resolution.outcomes)) {
        const shared = outcome.damage?.mode === "shared" ? outcome.damage : outcome.damage?.mode === "mixed" ? outcome.damage.shared : null;
        if (shared) shared.sourceComponentIds = ["0", "1"];
    }
    return p;
}
// A lasting area (zones.js): its entry, valued by its save on those inside, else its concealment.
function zoneEntry(ctx, name, { actions, area, centre = "placed", range = null, minutes = 1, concealed = false, terrain = false, saves = [], effects = null, surge = false, pool = null }) {
    const zonePlan = { builtin: "zone", actions, trigger: { event: "use" }, zone: { area, centre, range, lasts: { mode: "fixed", value: minutes, unit: "minutes", expiry: "turn-start" }, untilReused: false, concealed, terrain: terrain ? [{ movement: ["walk"], difficulty: 2 }] : [], others: false, hazard: null, saves, damage: [], effect: null, modifiers: [], notes: [], ...(effects ? { effects } : {}) } };
    const entry = zoneSpell(name, zonePlan);
    if (!entry) throw new Error(`${name}: not a zone the engine plays`);
    entry.plan.source = { ...(entry.plan.source ?? {}), name, type: "action" };
    // (Its saves are for foes alone — zones.js —: valued so, with the save's traits, incapacitation among them.)
    if (entry.plan.targeting?.area && saves.length) entry.plan.targeting.area = { ...entry.plan.targeting.area, foes: true };
    entry.plan.traits = [...new Set([...TRAITS(null), ...saves.flatMap((save) => save.plan?.traits ?? [])])];
    entry.plan.activation = { ...entry.plan.activation, traits: entry.plan.traits };
    return { ...entry, ...(effects ? { effects: { ...(entry.effects ?? {}), ...effects } } : {}), castRank: Math.ceil(ctx.lv / 2), dc: ctx.dc, attack: null, pool: pool ?? (surge ? ctx.pool : null), actionType: "action", rechargeGroup: name };
}
const speedPenalty = (value, rounds = 1) => ({ selector: "speed", type: "status", value: -value, duration: { mode: "fixed", value: rounds, unit: "rounds" } });

// (2026-11-24, stand10 — Cole: "Buff all the stand abilities to be closer in power with each other. Dont lower any yet." The buffed rule
// text — each ability's buff/buffNotes — played when ctx.buffed; the plain builds below are the text before it, untouched.)
const BUFFED = {
    "Bomb Touch"(ctx) {
        const { lv } = ctx;
        const dice = 2 + Math.floor((lv - 1) / 2) + (B1.has("BT1") ? 1 : 0);  // (BT1: a bomb is 3d6 at 1st, +1d6 per 2 levels)
        const bomb = `${dice + (lv >= 17 ? 1 : 0)}d6[force]`;
        const burst = { type: "burst", value: lv >= 13 ? 15 : lv >= 5 ? 10 : 5, foes: true };
        // (Round 2: arming is free as part of the stand's Stride or Strike — the use is the 1-action detonation.)
        const spells = [ctx.entry("Bomb Touch (arm and detonate)", plan(ctx, "Bomb Touch (arm and detonate)", { actions: 1, kind: "force", area: burst, damage: bomb }))];
        if (lv >= 5) {
            const all = [bomb];
            const weak = lv >= 13 ? { success: [`${Math.ceil(dice / 2)}d6[force]`] } : {};
            spells.push(ctx.entry("Bomb Touch (surge, creature bomb)", plan(ctx, "Bomb Touch (surge, creature bomb)", { actions: 2, kind: "force", save: "fortitude", basic: false, extra: { ...weak, failure: all, criticalFailure: [`${2 * dice}d6[force]`] } }), { surge: true }));
        }
        if (lv >= 13) spells.push(ctx.entry("Bomb Touch (surge, seeking bomb)", plan(ctx, "Bomb Touch (surge, seeking bomb)", { actions: 2, kind: "force", area: burst, range: "60 feet", damage: bomb }), { surge: true }));
        return { spells };
    },
    Flame(ctx) {
        const { lv, D, S, halfS, round1 } = ctx;
        const burn = lv >= (B1.has("FL1") ? 9 : 17) ? { failure: ["2d6[persistent,fire]"], criticalFailure: ["2d6[persistent,fire]"] } : { failure: ["1d6[persistent,fire]"], criticalFailure: ["1d6[persistent,fire]"] };  // (FL1: 2d6 persistent fire from 9th, was 17th)
        const bind = lv >= 5 ? { failure: [["grabbed", null, round1]], criticalFailure: [["grabbed", null, round1]] } : {};
        const spells = [ctx.make("Flame (ankh)", { actions: 1, damage: D("fire"), kind: "fire", extra: burn, effects: bind, target: lv >= 17 ? "up to 3 creatures" : lv >= 5 ? "up to 2 creatures" : "1 creature" })];
        if (lv >= 5) spells.push(ctx.make("Flame (surge cone)", { actions: 2, damage: lv >= 17 ? `${3 * Math.ceil(lv / 2)}d6[fire]` : S("fire"), kind: "fire", area: { type: "burst", value: 15, foes: true }, surge: true, extra: burn, effects: bind }));
        if (lv >= 13) spells.push(ctx.make("Flame (surge ankhs)", { actions: 1, damage: halfS("fire"), kind: "fire", target: "up to 6 creatures", surge: true, extra: burn }));
        // (Ranges from the stand, which fights beside the foes: the user throws its Flame from 60 ft back.)
        for (const each of spells) each.plan.targeting.range = "60 feet";
        // (2026-11-27, NCFILL2 9th: imprecise heat sense 50 ft — an invisible foe hidden, not undetected, to the user and its stand (sight.js).)
        if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 9) return { spells, user: { heatSense: 50 }, stand: { heatSense: 50 } };
        return { spells };
    },
    Weather(ctx) {
        // (2026-11-27, Oxygen Overdose and the reordering, Cole's picks — env switches for the rating runs:
        //   WEATHER_SKY  out (default: open sky, everything but the overdose) | in (an enclosed space: fog and the overdose only)
        //   WEATHER_OD   1 (default, adopted 2026-11-27) | 0: no Oxygen Overdose; at 9th (2 actions, a 10-ft burst within 30 ft, Fortitude: sickened 1 and slowed
        //                1 for 1 round; sickened 2 and slowed 1 on a critical failure — WEATHER_ODCRIT=flat: sickened 1 and slowed 1)
        //   WEATHER_OD_EVERY=1  the overdose usable outdoors too (the upper bound)
        //   WEATHER_ORDER  re (default, adopted): rain and lightning at 5th, the moisture pull at 9th | cur: the old order.)
        const { lv, S } = ctx;
        const env = globalThis.process?.env ?? {};
        const inside = env.WEATHER_SKY === "in", od = env.WEATHER_OD !== "0", every = env.WEATHER_OD_EVERY === "1", re = env.WEATHER_ORDER !== "cur";
        const spells = [zoneEntry(ctx, "Weather (fog)", { actions: 2, area: { type: "burst", value: 15 }, centre: "self", concealed: true })];
        if (!inside) {
            const offGuard = { failure: [["off-guard", null, ctx.round1]], criticalFailure: [["off-guard", null, ctx.round1]] };
            spells.push(ctx.make("Weather (hail)", { actions: 1, damage: ctx.D("cold"), kind: "cold", effects: offGuard }));
            if (lv >= 5) {
                const uuid = "stand:weather-rain";
                const model = ctx.effectModel("Weather (rain and wind)", 1, { conditional: [{ on: "attack", type: "circumstance", value: -2, predicate: ["item:ranged"] }] });
                const rain = autoPlan(ctx, "Weather (surge rain)", { actions: 2, success: { nativeEffects: [{ kind: "native-spell-effect", uuid }] } });
                spells.push(zoneEntry(ctx, "Weather (surge rain)", { actions: 2, area: { type: "burst", value: 30 }, range: 30, terrain: true, surge: true, saves: [{ when: ["initial", "start"], plan: rain }], effects: { [uuid]: model } }));
                // (WEATHER_17=1, the proposed 17th: the lightning stuns 1 on a failure, 2 on a critical failure; heavy weather once per 10 minutes —
                // the same as once a day in one fight.)
                const stun17 = lv >= 17 && env.WEATHER_17 === "1" ? { failure: [["stunned", 1, null]], criticalFailure: [["stunned", 2, null]] } : { criticalFailure: [["stunned", 1, null]] };
                spells.push(ctx.make("Weather (surge lightning)", { actions: 2, damage: S("electricity"), kind: "electricity", surge: true, target: lv >= 17 ? "up to 5 creatures" : lv >= 13 ? "up to 3 creatures" : "1 creature", effects: stun17 }));
            }
            if (lv >= (re ? 9 : 5)) spells.push(ctx.entry("Weather (moisture)", plan(ctx, "Weather (moisture)", { actions: 1, save: "fortitude", target: lv >= 13 ? "up to 3 creatures" : "1 creature", effects: { failure: [["sickened", 2, null]], criticalFailure: [["sickened", 3, null]] } })));
            if (lv >= 17) {
                // (WEATHER_17B: A — heavy weather 1 action; B — a fog version indoors (stupefied 2 only); C — both.)
                const hwActions = ["A", "C"].includes(env.WEATHER_17B) ? 1 : 2;
                // (WEATHER_HW: a — failure stupefied 2 and slowed 1, critical failure slowed 2, the save at −2 (played as DC +2); b — D electricity
                // each round instead, basic Reflex.)
                const hw = env.WEATHER_HW ?? "a";  // (2026-11-27: (a) adopted as the default; WEATHER_HW=old for the previous heavy weather)
                const heavy = hw === "b" ? plan(ctx, "Weather (heavy weather)", { actions: hwActions, kind: "electricity", save: "reflex", damage: ctx.D("electricity") })
                    : plan(ctx, "Weather (heavy weather)", { actions: hwActions, save: "will", effects: { failure: [["stupefied", 2, ctx.round1], ["slowed", 1, ctx.round1]], criticalFailure: [["stupefied", 2, ctx.round1], ["slowed", hw === "a" ? 2 : 1, ctx.round1]] } });
                if (hw === "a") heavy.resolution.check.against.value = ctx.dc + 2;
                spells.push({ ...zoneEntry(ctx, "Weather (heavy weather)", { actions: hwActions, area: { type: "emanation", value: 60 }, centre: "self", saves: [{ when: ["initial", "start"], plan: heavy }], pool: "stand-weather:heavy" }), ...(env.WEATHER_FORCE === "1" ? { forceEarly: true } : {}) });
            }
        }
        if (inside && lv >= 17 && ["B", "C"].includes(env.WEATHER_17B)) {
            const hwActions = env.WEATHER_17B === "C" ? 1 : 2;
            const fogHeavy = plan(ctx, "Weather (heavy fog)", { actions: hwActions, save: "will", effects: { failure: [["stupefied", 2, ctx.round1]], criticalFailure: [["stupefied", 2, ctx.round1]] } });
            spells.push({ ...zoneEntry(ctx, "Weather (heavy fog)", { actions: hwActions, area: { type: "emanation", value: 60 }, centre: "self", saves: [{ when: ["initial", "start"], plan: fogHeavy }], pool: "stand-weather:heavy" }), ...(env.WEATHER_FORCE === "1" ? { forceEarly: true } : {}) });
        }
        if (od && lv >= 9 && (inside || every)) {
            const crit = env.WEATHER_ODCRIT === "flat" ? [["sickened", 1, null], ["slowed", 1, ctx.round1]] : [["sickened", 2, null], ["slowed", 1, ctx.round1]];
            spells.push(ctx.entry("Weather (oxygen overdose)", plan(ctx, "Weather (oxygen overdose)", { actions: 2, save: "fortitude", area: { type: "burst", value: 10 }, range: 30, basic: false, effects: { failure: [["sickened", 1, null], ["slowed", 1, ctx.round1]], criticalFailure: crit } })));
        }
        return { spells, ...(lv >= 17 && (!inside || ["B", "C"].includes(env.WEATHER_17B)) ? { spellPools: { "stand-weather:heavy": 1 } } : {}) };
    },
    Spin(ctx) {
        const { lv, D, S } = ctx;
        const range = lv >= 13 ? "60 feet" : ctx.range;
        // (SP1: the hole's bleed from 1st (was 5th); SP2: SP1 + the nail shot deals half S (was D).)
        const hole = lv >= 5 || ["SP1", "SP2", "SP3", "SP4"].some((k) => B1.has(k)) ? (n) => ({ success: [`${n}d6[persistent,bleed]`], criticalSuccess: [`${n}d6[persistent,bleed]`] }) : () => ({});
        const bleedDice = B1.has("SP3") ? (lv >= 13 ? 3 : lv >= 5 ? 2 : 1) : lv >= 13 ? 2 : 1;  // (SP3: SP2 + the bleed 2d6 from 5th, 3d6 from 13th)
        const shot = ctx.make("Spin (nail shot)", { actions: 1, damage: B1.has("SP2") || B1.has("SP3") || B1.has("SP4") ? ctx.halfS("piercing") : D("piercing"), ...(B1.has("SP4") ? { target: "up to 2 creatures" } : {}),  /* (SP4: SP2 + two nails at up to 2 creatures) */ kind: "piercing", attackRoll: true, extra: hole(bleedDice) });
        shot.plan.targeting.range = range;
        const spells = [shot];
        // (a5ce436: the golden spin at 5th; a hit knocks prone from 9th. 1st's regrowing surge: nails aren't counted here.)
        if (lv >= (LATE ? 5 : 9)) {
            const prone = LATE && lv >= 9 ? [["prone", null, null]] : [];
            const golden = ctx.make("Spin (surge golden spin)", { actions: 2, damage: S("piercing"), kind: "piercing", attackRoll: true, surge: true, extra: hole(bleedDice * 2), effects: { success: [["slowed", 1, ctx.round1], ...prone], criticalSuccess: [["slowed", 1, ctx.minutes(1)], ...prone] } });
            golden.plan.targeting.range = range;
            golden.plan.resolution.ignoreResistance = [{ value: null, types: ["*"] }];
            spells.push(golden);
        }
        if (lv >= 17) {
            const n = 2 * Math.ceil(lv / 2);
            const p = autoPlan(ctx, "Spin (surge infinite spin)", { actions: 2, kind: "piercing", range, success: { damage: { mode: "formulas", formulas: [{ formula: `${n}d6[piercing]` }, { formula: `${n}d6[persistent,piercing]` }], rollScope: "outcome" } } });
            spells.push(ctx.entry("Spin (surge infinite spin)", p, { pool: "stand-spin:infinite" }));
        }
        return { spells, ...(lv >= 17 ? { spellPools: { "stand-spin:infinite": 1 } } : {}) };
    },
    "Gravity Flip"(ctx) {
        const { lv, S } = ctx;
        const push = { kind: "push", distance: lv >= 9 ? 10 : 5 };
        const p = plan(ctx, "Gravity Flip (push)", { actions: 1, kind: "force", save: "fortitude", area: { type: "emanation", value: lv >= 13 ? 20 : 10 }, effects: lv >= 9 ? { criticalFailure: [["prone"]] } : {} });
        p.resolution.outcomes.failure.forcedMovement = push;
        p.resolution.outcomes.criticalFailure.forcedMovement = push;
        const spells = [ctx.entry("Gravity Flip (push)", p)];
        // (Round 4 cap: the flip's prone only on a critical failure; 17th's critical-failure stunned 2 back to stunned 1.)
        const prone = { criticalFailure: [["prone"]] };
        spells.push(ctx.make("Gravity Flip (flip)", { actions: 1, damage: ctx.D("bludgeoning"), kind: "bludgeoning", effects: prone }));
        if (lv >= 5) {
            // (2026-11-27, Cole: 13th's critical failure stunned 2 — GF_V=1; 0 the old stunned 1.)
            const gf13 = Number(globalThis.process?.env?.GF_V ?? 1) === 1 ? 2 : 1;
            const stun = lv >= 13 ? { failure: [["stunned", 1, null]], criticalFailure: [["stunned", gf13, null]] } : { failure: [["sickened", 1, null]], criticalFailure: [["stunned", 1, null]] };
            spells.push(ctx.make("Gravity Flip (surge inside out)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true, effects: stun }));
        }
        // (NCFILL 17th: reverse gravity in a 30-ft emanation for creatures you choose — Reflex negates; a 20-ft fall up and back: 10
        // bludgeoning and prone.)
        // (GF17: i — a 40-ft fall, 20 bludgeoning; ii — 20 ft, 10 bludgeoning, stunned 1 on a critical failure; off unless set.)
        const gf17 = globalThis.process?.env?.GF17 ?? "ii";  // (adopted 2026-11-27)
        if (gf17 && lv >= 17) spells.push(ctx.entry("Gravity Flip (surge reverse)", plan(ctx, "Gravity Flip (surge reverse)", { actions: 2, kind: "bludgeoning", save: "reflex", area: { type: "emanation", value: 30, foes: true }, extra: { failure: [gf17 === "i" ? "20[bludgeoning]" : "10[bludgeoning]"], criticalFailure: [gf17 === "i" ? "20[bludgeoning]" : "10[bludgeoning]"] }, effects: { failure: [["prone"]], criticalFailure: [["prone"], ...(gf17 === "ii" ? [["stunned", 1, null]] : [])] } }), { surge: true }));
        return { spells };
    },
    Magnetism(ctx) {
        const { lv, S } = ctx;
        const lasts = ctx.minutes(1);
        const fail = [["clumsy", 1, lasts], ...(lv >= 17 ? [["immobilized", null, lasts]] : [])];
        const critFail = [["clumsy", 2, lasts], ...(lv >= 17 ? [["immobilized", null, lasts]] : [])];
        // (NCFILL 9th: two magnetized creatures pulled together and colliding — approximated as D more bludgeoning on a failure.)
        const pull9 = (globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 9 ? { failure: [ctx.D("bludgeoning")], criticalFailure: [ctx.D("bludgeoning")] } : {};
        const spells = [ctx.entry("Magnetism (magnetize)", plan(ctx, "Magnetism (magnetize)", { actions: 1, kind: "bludgeoning", save: "fortitude", damage: ctx.D("bludgeoning"), target: lv >= 13 ? "up to 3 creatures" : "1 creature", effects: { failure: fail, criticalFailure: critFail }, extra: pull9 }))];
        if (lv >= 5) spells.push(ctx.make("Magnetism (surge pull)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", surge: true, effects: { failure: [["clumsy", 1, lasts]], criticalFailure: [["clumsy", 2, lasts]] } }));
        return { spells };
    },
    Ice(ctx) {
        const { lv, D, S, round1 } = ctx;
        const stuck = lv >= 13 ? { failure: [["immobilized", null, round1]], criticalFailure: [["immobilized", null, round1]] } : {};
        const shard = plan(ctx, "Ice (shard)", { actions: 1, kind: "cold", damage: D("cold"), effects: stuck });
        shard.resolution.outcomes.failure.modifiers = [speedPenalty(10)];
        shard.resolution.outcomes.criticalFailure.modifiers = [speedPenalty(10)];
        const spells = [ctx.entry("Ice (shard)", shard)];
        if (lv >= 5) {
            const spearsStuck = lv >= 9 ? { failure: [["immobilized", null, round1]], criticalFailure: [["immobilized", null, round1]] } : {};
            spells.push(ctx.make("Ice (surge spears)", { actions: 2, damage: S("cold"), kind: "cold", area: { type: "burst", value: lv >= 9 ? 15 : 10, foes: true }, surge: true, effects: spearsStuck }));
        }
        if (lv >= 17) spells.push(ctx.entry("Ice (freeze)", plan(ctx, "Ice (freeze)", { actions: 2, kind: "cold", save: "fortitude", traits: ["incapacitation"], effects: { failure: [["restrained", null, ctx.minutes(1)]], criticalFailure: [["paralyzed", null, round1], ["restrained", null, ctx.minutes(1)]] } })));
        return { spells };
    },
    "Ice Armor"(ctx) {
        const { lv, S } = ctx;
        const modifiers = [{ on: "ac", type: "circumstance", value: lv >= 5 || B1.has("IA4") ? 2 : 1 },  // (IA4: IA3 + the +2 AC from 1st)
            ...(lv >= 5 ? [{ on: "speed", type: "circumstance", value: 10 }] : [])];
        // (Round 4 cap: resistance 3 at most — was 5 from 17th.)
        // (IA2: resistance 3 from 9th, 5 from 17th.)
        const resist = B1.has("IA6") ? [{ type: "physical", value: lv >= 17 ? 5 : lv >= 9 ? 3 : 2, exceptions: [] }] : lv >= 9 ? [{ type: "physical", value: B1.has("IA2") ? (lv >= 17 ? 5 : 3) : lv >= 13 ? 3 : 2, exceptions: [] }] : [];
        const armor = ctx.effectModel("Ice Armor", 100, { modifiers, resistances: resist, hitBack: `${lv}[cold]` });
        // (Round 2: frost on your fists — the armor's cold on the Strikes, played as always on: the armor goes on in the first round.)
        // (Round 4 cap: 1d6 at every level — was 2d6 from 9th, 3d6 from 17th.)
        const frost = ["IA1", "IA2", "IA3", "IA4", "IA5", "IA6"].some((k) => B1.has(k)) ? (lv >= 17 ? 3 : lv >= 9 ? 2 : 1) : 1;  // (IA1: 2d6 from 9th, 3d6 from 17th, the pre-cap scaling)
        for (const strike of [ctx.main, ctx.second]) if (strike) strike.damage = [...strike.damage, { dice: frost, die: 6, bonus: 0, type: "cold" }];
        const spells = [];
        const deepFreeze = lv >= 13 ? ctx.minutes(1) : ctx.round1;
        if (lv >= 5) spells.push(ctx.make("Ice Armor (surge freeze the air)", { actions: B1.has("IA3") || B1.has("IA4") ? 1 : 2, damage: S("cold"), kind: "cold", save: "fortitude", area: { type: "emanation", value: 10, foes: true }, surge: true, effects: { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["slowed", 1, deepFreeze]] } }));
        if (lv >= 17) {
            const cold = plan(ctx, "Ice Armor (absolute cold)", { actions: 1, kind: "cold", save: "fortitude", effects: { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["slowed", 1, ctx.round1]] } });
            const aura = zoneEntry(ctx, "Ice Armor (absolute cold)", { actions: 1, area: { type: "emanation", value: 5 }, centre: "self", minutes: 10, saves: [{ when: ["initial", "start"], plan: cold }] });
            aura.plan.targeting.area = { ...aura.plan.targeting.area, value: 10 };
            spells.push(aura);
        }
        const user = {
            // (IA5: IA1 + the armor forms as the stand manifests — always on, no action; IA6: IA5 + resistance 2 from 1st, 3 from 9th, 5 from 17th.)
            ...(B1.has("IA5") || B1.has("IA6") ? { passiveEffects: [{ ...armor, rounds: Infinity }] } : { selfEffects: [{ name: "Ice Armor", actions: 1, model: armor }] }),
            ...(lv >= 13 ? { acReaction: { value: 50, when: "hit", against: "ranged", name: "Ice Armor (shatter projectile)" } } : {})
        };
        // (2026-11-27, open to all types: a separate stand wears the ice itself — armor, retaliation, reaction on the stand.)
        if (ctx.type && ctx.type !== "integrated") return { spells, stand: user };
        return { spells, user };
    },
    "Air Shots"(ctx) {
        const { lv, D, halfS, round1 } = ctx;
        const unseen = { success: [["off-guard", null, round1]], criticalSuccess: [["off-guard", null, round1]] };
        // (AS1: the bubble deals half S (was D); AS2: AS1 + up to 2 creatures from 5th.)
        // (AS3: AS1 + a bubble out of nowhere frightens 1 on a hit; AS4: AS3 + up to 2 creatures from 5th.)
        const as1 = ["AS1", "AS2", "AS3", "AS4", "AS5", "AS6", "AS7"].some((k) => B1.has(k)), as3 = ["AS3", "AS4", "AS5", "AS6", "AS7"].some((k) => B1.has(k));  // (AS7: AS5 + a 1-action volley at up to 3 creatures from 1st)  // (AS6: AS5 + a bubble that hits stays lodged: off-guard 1 minute)  // (AS5: AS4 + the surge bubbles S each, was half S)
        const og = B1.has("AS6") ? ctx.minutes(1) : round1;
        const bubbleFx = as3 ? { success: [["off-guard", null, og], ["frightened", 1, null]], criticalSuccess: [["off-guard", null, og], ["frightened", 1, null]] } : unseen;
        const spells = [ctx.make("Air Shots (bubble)", { actions: 1, damage: as1 ? halfS("bludgeoning") : D("bludgeoning"), kind: "bludgeoning", attackRoll: true, effects: bubbleFx, ...(B1.has("AS7") ? { target: "up to 3 creatures" } : {}), ...(["AS2", "AS4", "AS5", "AS6"].some((k) => B1.has(k)) && lv >= 5 ? { target: "up to 2 creatures" } : {}) })];
        if (lv >= 5) spells.push(ctx.make("Air Shots (surge bubbles)", { actions: 2, damage: B1.has("AS5") || B1.has("AS6") || B1.has("AS7") ? ctx.S("bludgeoning") : halfS("bludgeoning"), kind: "bludgeoning", attackRoll: true, target: lv >= 13 ? "up to 5 creatures" : "up to 3 creatures", surge: true, effects: unseen }));
        if (lv >= 9) {
            const uuid = "stand:air-shots-wall";
            const model = ctx.effectModel("Air Shots (bubble wall)", ctx.minutes(1).value, { modifiers: [{ on: "reflex", type: "circumstance", value: 2 }], conditional: [{ on: "ac", type: "circumstance", value: 2, predicate: ["item:ranged"] }] });
            const p = ctx.savePlan("Air Shots (surge bubble wall)", { actions: 2, traits: TRAITS(null), area: { type: "emanation", value: 30 }, dc: ctx.dc });
            p.resolution = { kind: "effect", check: null, sharedDamage: null, applications: [{ kind: "native-spell-effect", uuid, recipients: "allies-in-area" }] };
            spells.push({ ...ctx.entry("Air Shots (surge bubble wall)", p, { surge: true }), effects: { [uuid]: model } });
        }
        return { spells, ...(lv >= 17 ? { user: { acReaction: { value: 2, when: "hit", against: "ranged", name: "Air Shots (bubble shield)" } } } : {}) };
    },
    "Meteor Call"(ctx) {
        const { lv, D } = ctx;
        const meteorite = plan(ctx, "Meteor Call (meteorite)", { actions: 2, kind: "bludgeoning", range: "60 feet", damage: D("bludgeoning") });
        const spells = [ctx.entry("Meteor Call (meteorite)", twoTypes(meteorite, D("fire"), "fire"))];
        if (lv >= 5) {
            // (Round 3 tone-down: prone only on a critical failure; 17th's second meteor half damage — 1.5 times the dice in all.)
            const n = Math.ceil(lv / 2);
            // (Round 4 cap: the fragment a quarter of the first — 1.25 times the dice; the burst 15 ft from 13th, was 20.)
            const total = lv >= 17 ? Math.floor(n * 1.25) : n;
            const prone = { criticalFailure: [["prone"]] };
            const p = plan(ctx, "Meteor Call (surge meteor)", { actions: 2, kind: "bludgeoning", area: { type: "burst", value: lv >= 13 ? 15 : 10, foes: true }, range: "60 feet", damage: `${total}d6[bludgeoning]`, effects: prone });
            spells.push(ctx.entry("Meteor Call (surge meteor)", twoTypes(p, `${total}d6[fire]`, "fire"), { surge: true }));
        }
        return { spells };
    },
    Pressure(ctx) {
        const { lv, S, round1 } = ctx;
        const area = { type: "burst", value: lv >= 13 ? 10 : 5, foes: true };
        const sick = { failure: [["sickened", 1, null]], criticalFailure: [["sickened", 2, null]] };
        // (NCFILL 17th: leaving a pressurized area — taken as most do — D persistent bleed and sickened 1 on a failure.)
        const decomp = (globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 17 ? { failure: [ctx.D("bleed").replace(/\[[^\]]*\]$/, "") + "[persistent,bleed]"], criticalFailure: [ctx.D("bleed").replace(/\[[^\]]*\]$/, "") + "[persistent,bleed]"] } : {};
        const spells = [ctx.entry("Pressure (air pressure)", plan(ctx, "Pressure (air pressure)", { actions: 1, save: "fortitude", area, effects: sick, extra: decomp }))];
        if (lv >= 5) spells.push(ctx.make("Pressure (surge blast)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", area, surge: true, effects: sick }));
        {
            const slow = lv >= 13 ? ctx.minutes(1) : round1;
            spells.push(ctx.entry("Pressure (through a wound)", plan(ctx, "Pressure (through a wound)", { actions: 1, save: "fortitude", effects: { failure: [["slowed", 1, slow]], criticalFailure: [["slowed", 1, slow]] } })));
        }
        return { spells };
    }
};

export const FORCE = {
    "Bomb Touch": {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Bomb Touch"](ctx);
            const { lv } = ctx;
            const dice = 2 + Math.floor((lv - 1) / 2);
            const bomb = `${dice + (lv >= 17 ? 1 : 0)}d6[force]`;
            const burst = { type: "burst", value: lv >= 9 ? 10 : 5 };
            const spells = [ctx.entry("Bomb Touch (arm and detonate)", plan(ctx, "Bomb Touch (arm and detonate)", { actions: 2, kind: "force", area: burst, damage: bomb }))];
            if (lv >= 5) {
                const all = [bomb];
                spells.push(ctx.entry("Bomb Touch (surge, creature bomb)", plan(ctx, "Bomb Touch (surge, creature bomb)", { actions: 2, kind: "force", save: "fortitude", basic: false, extra: { failure: all, criticalFailure: all } }), { surge: true }));
            }
            if (lv >= 13) spells.push(ctx.entry("Bomb Touch (surge, seeking bomb)", plan(ctx, "Bomb Touch (surge, seeking bomb)", { actions: 2, kind: "force", area: burst, range: "60 feet", damage: bomb }), { surge: true }));
            return { spells };
        },
        buff: {"1": "Your stand arms an unattended object it touches as part of a Stride or Strike (one bomb at a time). 1 action: detonate it for 2d6 force in a 5-ft burst, basic Reflex; the blast spares creatures you choose. +1d6 per 2 levels.", "5": "Surge: arm a creature your stand hits (Fortitude negates). Detonating it deals the damage to that creature with no save, double damage if it critically failed. Your bursts are now 10 ft.", "9": "Keep two bombs armed.", "13": "Your bursts are now 15 ft, and a creature that succeeds at its Fortitude save against the creature bomb is still armed with a weaker charge: half the damage when it detonates."},
        buffNotes: ["Blasts are foes-only (area.foes) — the unbuffed burst caught the stand and allies in the Melee too; 10-ft burst from 5th; the creature bomb's critical failure deals the bomb's dice doubled.", "Round 2: arming free (part of the stand's Stride/Strike), so arm-and-detonate is played as 1 action (was 2); 15-ft bursts from 13th; creature bomb's success row deals half the bomb's dice from 13th."],
        notes: [
            "1st: arming (the stand's Interact) and detonating (1 action) played as one 2-action use by the user, the bomb placed amid foes; damage 2d6 +1d6 every 2 levels after 1st (3rd, 5th …).",
            "5th: the creature bomb as one surge — the Fortitude save to arm it and, on a failure, the detonation's damage with no save; the stand's hit it needs isn't required.",
            "9th: two bombs armed isn't played beyond the 10-ft burst (each detonation is still an arm-and-detonate use).",
            "13th: the seeking bomb (a 20-ft-Speed minion) as an instant 10-ft burst on a creature within 60 ft; the minion's walk and its own body aren't played.",
            "17th: both bombs detonated together on the same foes: the damage once +1d6 for the second burst."
        ]
    },
    Flame: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Flame"](ctx);
            const { lv, D, S, halfS, round1 } = ctx;
            const burn = lv >= 17 ? { failure: ["2d6[persistent,fire]"], criticalFailure: ["2d6[persistent,fire]"] } : {};
            const spells = [ctx.make("Flame (ankh)", { actions: 1, damage: D("fire"), kind: "fire", extra: burn, effects: lv >= 9 ? { criticalFailure: [["grabbed", null, round1]] } : {} })];
            if (lv >= 5) spells.push(ctx.make("Flame (surge cone)", { actions: 2, damage: S("fire"), kind: "fire", area: { type: "cone", value: 15 }, surge: true, extra: burn }));
            if (lv >= 13) spells.push(ctx.make("Flame (surge ankhs)", { actions: 2, damage: halfS("fire"), kind: "fire", target: "up to 6 creatures", surge: true, extra: burn }));
            return { spells };
        },
        buff: {"price": "Full power needs the target in your stand's line of sight within 30 ft of your stand; all of your Flame's ranges and areas are measured from your stand, not from you.", "1": "1 action: your stand throws a fire ankh at a creature within 30 ft: D fire (basic Reflex); on a failure it takes 1d6 persistent fire.", "5": "Surge, 2 actions: a 30-ft cone of S fire (basic Reflex) from your stand's space, or a 15-ft burst of S fire within 30 ft (Cross Fire Hurricane); either spares creatures you choose; a creature that fails takes the ankh's persistent fire. Twin ankhs: each ankh action fires an ankh at up to 2 creatures within 30 ft (each D fire, basic Reflex). Burning binding: a creature that fails against an ankh or the surge is also grabbed by flame ropes for 1 round.", "13": "Surge, 1 action: ankhs at up to 6 creatures, each S/2 fire (basic Reflex).", "17": "Persistent fire from your Flame rises to 2d6, the ankh action fires at up to 3 creatures, and the cone or burst surge deals S plus half S fire."},
        buffNotes: ["Ranges measured from the stand: every Flame entry at 60 ft (the stand's 30 ft beyond it). In the bands this changed no choice in 20 test fights at 17th — foes Stride to the user in round 1 either way (user downed 16 of 20 with Flame, 12 with no ability); the gain comes from the damage and riders below.", "The surge played as its 15-ft burst, foes-only (the cone-from-the-stand choice isn't played: no area origin on the stand in the engine). The old cone/burst aimed into the stand's Melee also burned the stand and allies there (shared HP with the user).", "1d6 persistent fire on a failure from 5th (2d6 from 17th as before); grabbed 1 round on any failure from 9th; the 1-action ankh at up to 2 creatures from 9th, 3 from 17th (one damage roll shared, a save each — make()'s multi-target); 17th's surge 3×ceil(lv/2)d6 (S + S/2).", "Round 2: 1d6 persistent fire on a failure from 1st (was 5th); twin ankhs from 5th (was 9th); the burning binding (grabbed 1 round on a failure) from 5th (was 9th) and on the cone/burst surge too; the 13th-level ankh surge 1 action (was 2)."],
        notes: [
            "As classes.js's standard Flame. 1st: the fire-and-heat sense isn't played. Price (line of sight within 30 ft) assumed met.",
            "13th: the ankhs' surge at the default 2 actions (the text lists none)."
        ]
    },
    Lightning: {
        build(ctx) {
            const { lv, S, steps } = ctx;
            // (1st: a Strike from inside a wire, metal or water: D extra electricity — on the stand's Strikes, the price met.)
            for (const strike of [ctx.main, ctx.second]) strike.damage = [...strike.damage, { dice: 1 + steps, die: 6, bonus: 0, type: "electricity" }];
            const spells = [];
            if (lv >= 5) spells.push(ctx.make("Lightning (surge discharge)", { actions: 2, damage: S("electricity"), kind: "electricity", save: "fortitude", surge: true, ...(lv >= 13 ? { area: { type: "burst", value: 20, foes: true } } : {}) }));
            const stand = lv >= 9 ? { selfEffects: [{ name: "Lightning (drain power)", actions: 1, model: ctx.effectModel("Lightning (drain power)", ctx.minutes(1).value, { modifiers: [{ on: "damage", type: "status", value: 2 }] }) }] } : {};
            return { spells, stand };
        },
        notes: [
            "Price (wires, metal or water to travel in; a power source at 9th) assumed met everywhere.",
            "1st: the stand always Strikes from inside a conductor: D extra electricity on both of its Strikes; its double-Speed travel isn't played.",
            "13th: 'every creature touching the same metal or water' as a 20-ft burst on foes only.",
            "9th: drain power is the stand's own 1-action effect (+2 status to its Strike damage, 1 minute).",
            "17th: mile-long travel has no combat use."
        ]
    },
    Weather: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Weather"](ctx);
            const { lv, S } = ctx;
            const spells = [zoneEntry(ctx, "Weather (fog)", { actions: 2, area: { type: "burst", value: 15 }, centre: "self", concealed: true })];
            if (lv >= 5) {
                const uuid = "stand:weather-rain";
                const model = ctx.effectModel("Weather (rain and wind)", 1, { conditional: [{ on: "attack", type: "circumstance", value: -2, predicate: ["item:ranged"] }] });
                const rain = autoPlan(ctx, "Weather (surge rain)", { actions: 2, success: { nativeEffects: [{ kind: "native-spell-effect", uuid }] } });
                spells.push(zoneEntry(ctx, "Weather (surge rain)", { actions: 2, area: { type: "burst", value: 30 }, range: 30, terrain: true, surge: true, saves: [{ when: ["initial", "start"], plan: rain }], effects: { [uuid]: model } }));
            }
            if (lv >= 9) spells.push(ctx.make("Weather (surge lightning)", { actions: 2, damage: S("electricity"), kind: "electricity", surge: true }));
            if (lv >= 13) spells.push(ctx.entry("Weather (moisture)", plan(ctx, "Weather (moisture)", { actions: 1, save: "fortitude", effects: { failure: [["sickened", 2, null]], criticalFailure: [["sickened", 2, null]] } })));
            if (lv >= 17) {
                const heavy = plan(ctx, "Weather (heavy weather)", { actions: 2, save: "will", traits: ["incapacitation"], effects: { failure: [["stupefied", 2, ctx.round1], ["slowed", 1, ctx.round1]], criticalFailure: [["stupefied", 2, ctx.round1], ["slowed", 1, ctx.round1]] } });
                spells.push(zoneEntry(ctx, "Weather (heavy weather)", { actions: 2, area: { type: "emanation", value: 60 }, centre: "self", saves: [{ when: ["initial", "start"], plan: heavy }], pool: "stand-weather:heavy" }));
            }
            return { spells, ...(lv >= 17 ? { spellPools: { "stand-weather:heavy": 1 } } : {}) };
        },
        buff: {"1": "1 action, outdoors: hail on a creature within 30 ft: D cold (basic Reflex); off-guard until the start of your next turn on a failure.", "5": "Surge, outdoors: rain or wind in a 30-ft burst for 1 minute: difficult terrain and –2 to ranged attacks, for creatures you choose. Also 1 action: pull moisture from a creature's surroundings: it's sickened 2 (sickened 3 on a critical failure; Fortitude negates), once per creature per day. Surge, outdoors: lightning strike on one creature: S electricity (basic Reflex); stunned 1 on a critical failure.", "13": "The lightning strike forks to up to 3 creatures, and you can pull moisture from up to 3 creatures with one action.", "17": "Heavy weather loses the incapacitation trait, and the lightning strike forks to up to 5 creatures."},
        buffNotes: ["Moisture moved from 13th to 5th (1 action; once per creature per day not tracked); lightning stunned 1 on a critical failure; from 13th up to 3 targets.", "Round 2: 1-action hail at 1st (make(): D cold, off-guard 1 round on a failure); lightning surge from 5th (was 9th); moisture at up to 3 creatures from 13th; 17th heavy weather without incapacitation, lightning up to 5 targets."],
        notes: [
            "Outdoors / open sky assumed (the price).",
            "1st: fog as a 15-ft zone about the user for 1 minute: everyone inside concealed (both sides — zones.js); calming the wind isn't played.",
            "5th: rain or wind as a 30-ft zone at range: difficult terrain for foes and -2 circumstance to their ranged attacks while inside (refreshed each turn start); allies unaffected (you choose).",
            "13th: 1 action (the text lists none); 'once per creature per day' not tracked.",
            "17th: heavy weather at 2 actions (none listed) as a 60-ft zone about the user: a Will save on entering/each turn start; failure stupefied 2 + slowed 1 until its next turn; once a fight (a day)."
        ]
    },
    Spin: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Spin"](ctx);
            const { lv, D, S } = ctx;
            const range = lv >= 13 ? "60 feet" : ctx.range;
            const shot = ctx.make("Spin (nail shot)", { actions: 1, damage: D("piercing"), kind: "piercing", attackRoll: true });
            shot.plan.targeting.range = range;
            const spells = [shot];
            if (lv >= 9) {
                const golden = ctx.make("Spin (surge golden spin)", { actions: 2, damage: S("piercing"), kind: "piercing", attackRoll: true, surge: true });
                golden.plan.targeting.range = range;
                golden.plan.resolution.ignoreResistance = [{ value: null, types: ["*"] }];
                spells.push(golden);
            }
            if (lv >= 17) {
                const n = 2 * Math.ceil(lv / 2);
                const p = autoPlan(ctx, "Spin (surge infinite spin)", { actions: 2, kind: "piercing", range, success: { damage: { mode: "formulas", formulas: [{ formula: `${n}d6[piercing]` }, { formula: `${n}d6[persistent,piercing]` }], rollScope: "outcome" } } });
                spells.push(ctx.entry("Spin (surge infinite spin)", p, { pool: "stand-spin:infinite" }));
            }
            return { spells, ...(lv >= 17 ? { spellPools: { "stand-spin:infinite": 1 } } : {}) };
        },
        buff: {"5": "A hit leaves a hole: the nail shot also deals 1d6 persistent bleed (2d6 from 13th), and you can move through the hole with your stand, ignoring cover from that target.", "9": "Surge: golden spin shot: S piercing, ignores resistance; on a hit the target is slowed 1 for 1 round (1 minute on a critical hit), and the hole's bleed is doubled."},
        buffNotes: ["Bleed as persistent bleed on a hit (attack outcomes success/criticalSuccess); golden spin's slowed 1 as a 1-round (crit: 1-minute) condition."],
        notes: [
            "Ammo (10 nails a day) not tracked — a fight rarely spends 10.",
            "5th: the hole through a target and 13th's homing round cover: cover isn't in the band model, so nothing more is played.",
            "9th: golden spin ignores all resistance (resolution.ignoreResistance).",
            "17th: infinite spin, once a fight (a day; its own pool, no Stand Point taken), no check: S now and S as persistent piercing (the 3 rounds of S; persistent's flat check ends it on its own odds, not after 2 more rounds)."
        ]
    },
    "Gravity Flip": {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Gravity Flip"](ctx);
            const { lv, S } = ctx;
            const push = { kind: "push", distance: lv >= 9 ? 10 : 5 };
            const p = plan(ctx, "Gravity Flip (push)", { actions: 1, kind: "force", save: "fortitude", area: { type: "emanation", value: lv >= 13 ? 20 : 10 } });
            p.resolution.outcomes.failure.forcedMovement = push;
            p.resolution.outcomes.criticalFailure.forcedMovement = push;
            const spells = [ctx.entry("Gravity Flip (push)", p)];
            if (lv >= 5) {
                const stun = lv >= 17 ? { failure: [["stunned", 1, null]], criticalFailure: [["stunned", 1, null]] } : {};
                spells.push(ctx.make("Gravity Flip (surge inside out)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true, effects: stun }));
            }
            return { spells };
        },
        buff: {"1": "1 action: flip one creature's gravity within 30 ft so it falls up and back down: D bludgeoning (basic Reflex); it falls prone on a critical failure.", "5": "Surge: a creature your stand hits turns inside out: S bludgeoning (basic Fortitude); sickened 1 on a failure, stunned 1 on a critical failure.", "9": "Push 10 ft, and a creature that critically fails the push falls prone; you can walk on walls.", "13": "Surge: a target that fails the inside-out save is also stunned 1."},
        buffNotes: ["Round 4 (cap): the 1-action flip knocks prone only on a critical failure (was a failure); 17th's stunned 2 on a critical failure of the inside-out save cut (stunned 1 on a failure or critical failure from 13th, as before).", "Riders on the surge's failure rows; prone on the push's critical failure (allies still in the emanation, the price).", "Round 2: a new 1-action single-target flip from 1st (make(): D bludgeoning basic Reflex, prone on a failure); the 17th's stunned-1-on-a-failure moved to 13th (stunned 2 on a critical failure stays 17th)."],
        notes: [
            "1st: the push as a Fortitude save in the emanation (allies too, by the text — the area isn't foes-only); a push is worth little in the bands, so it's rarely picked.",
            "5th: 'a creature your stand hits' — the stand's hit isn't required before the surge.",
            "9th: walking on walls isn't played."
        ]
    },
    Magnetism: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Magnetism"](ctx);
            const { lv, S } = ctx;
            if (lv < 13) return { spells: [] };
            const lasts = ctx.minutes(1);
            const fail = [["clumsy", 1, lasts], ...(lv >= 17 ? [["immobilized", null, lasts]] : [])];
            const critFail = [["clumsy", 2, lasts], ...(lv >= 17 ? [["immobilized", null, lasts]] : [])];
            return {
                spells: [
                    ctx.entry("Magnetism (magnetize)", plan(ctx, "Magnetism (magnetize)", { actions: 1, save: "fortitude", effects: { failure: fail, criticalFailure: critFail } })),
                    ctx.make("Magnetism (surge pull)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", surge: true })
                ]
            };
        },
        buff: {"1": "10 minutes: plant a magnet trap, or 1 action: magnetize a creature your stand hits; metal objects nearby slam into it: D bludgeoning (basic Fortitude). A magnetized creature (on a failure) has metal objects stick to it (clumsy 1 if it wears metal or carries metal weapons) for 1 minute.", "5": "Magnetism grows: clumsy 2 on a critical failure (or after 3 rounds). Surge: pull every unattended metal object within 30 ft onto a creature: S bludgeoning (basic Reflex); it's magnetized on a failure.", "13": "Magnetize up to 3 creatures your stand hits with one action."},
        buffNotes: ["13th's magnetize-on-hit brought to 1st (stand's hit not required, as before); the pull surge from 5th, not gated on a prior magnetize, magnetizing (clumsy) on a failure; up to 2 targets at 13th.", "Round 2: magnetize deals D bludgeoning, basic Fortitude (its clumsy rows unchanged); up to 3 targets at 13th (was 2)."],
        notes: [
            "1st–12th: no combat use — the magnet trap takes 10 minutes to plant, and 5th's growth and 9th's pull need a creature it magnetized.",
            "13th: magnetize a creature the stand hits, as 1 action (Fortitude negates; the stand's hit not required); magnetized for 1 minute (no length given): clumsy 1 (metal armor assumed), clumsy 2 on a critical failure for 5th's growth (it can't grow over 3 rounds here).",
            "13th: the 9th-level pull surge, not gated on the target being magnetized.",
            "17th: immobilized while magnetized (metal surfaces assumed about)."
        ]
    },
    Ice: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Ice"](ctx);
            const { lv, D, S, round1 } = ctx;
            const shard = plan(ctx, "Ice (shard)", { actions: 1, kind: "cold", damage: D("cold"), effects: lv >= 13 ? { criticalFailure: [["immobilized", null, round1]] } : {} });
            shard.resolution.outcomes.failure.modifiers = [speedPenalty(10)];
            shard.resolution.outcomes.criticalFailure.modifiers = [speedPenalty(10)];
            const spells = [ctx.entry("Ice (shard)", shard)];
            if (lv >= 9) spells.push(ctx.make("Ice (surge spears)", { actions: 2, damage: S("cold"), kind: "cold", area: { type: "burst", value: 10 }, surge: true }));
            if (lv >= 17) spells.push(ctx.entry("Ice (freeze)", plan(ctx, "Ice (freeze)", { actions: 2, kind: "cold", save: "fortitude", traits: ["incapacitation"], effects: { failure: [["restrained", null, round1]], criticalFailure: [["paralyzed", null, round1]] } })));
            return { spells };
        },
        buff: {"5": "Surge, 2 actions: wall of ice, 20 ft long, Hardness 5, 20 HP per 5 ft, lasts 1 minute; or ice spears in a 10-ft burst under creatures you choose: S cold (basic Reflex).", "9": "The ice spears' burst is 15 ft, and a creature that fails against them is immobilized for 1 round.", "13": "A creature that fails against a shard is immobilized for 1 round.", "17": "Freeze a creature in ice (Fortitude, incapacitation): restrained for 1 minute (Escape against your stand DC); paralyzed for 1 round as well on a critical failure."},
        buffNotes: ["Spears from 5th, foes-only; immobilized on a failure (not only a critical failure); freeze's restrained for 1 minute (the Escape is the engine's own handling of restrained, if any)."],
        notes: [
            "Moisture in the air assumed (the price).",
            "1st: the shard's -10-ft Speed on a failure as a 1-round status penalty to Speed.",
            "5th: the wall of ice isn't played — the simulator doesn't play walls in fights.",
            "17th: freeze at 2 actions, not a surge (the text lists neither); restrained (paralyzed on a critical failure) for 1 round."
        ]
    },
    "Ice Armor": {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Ice Armor"](ctx);
            const { lv, S } = ctx;
            const modifiers = [{ on: "ac", type: "circumstance", value: lv >= 9 ? 2 : 1 }, ...(lv >= 5 ? [{ on: "speed", type: "circumstance", value: 10 }] : [])];
            const armor = ctx.effectModel("Ice Armor", 100, { modifiers, hitBack: `${lv}[cold]` });
            const spells = [];
            if (lv >= 9) spells.push(ctx.make("Ice Armor (surge freeze the air)", { actions: 2, damage: S("cold"), kind: "cold", save: "fortitude", area: { type: "emanation", value: 10, foes: true }, surge: true }));
            if (lv >= 17) {
                const cold = plan(ctx, "Ice Armor (absolute cold)", { actions: 1, kind: "cold", save: "fortitude", effects: { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["slowed", 1, ctx.round1]] } });
                const aura = zoneEntry(ctx, "Ice Armor (absolute cold)", { actions: 1, area: { type: "emanation", value: 5 }, centre: "self", minutes: 10, saves: [{ when: ["initial", "start"], plan: cold }] });
                // (The planner finds no one in a 5-ft emanation in the bands; 10 ft is the same Melee there — zones.js near() — so it's
                // valued at 10, while the zone itself stays 5 ft for the grid.)
                aura.plan.targeting.area = { ...aura.plan.targeting.area, value: 10 };
                spells.push(aura);
            }
            const user = {
                selfEffects: [{ name: "Ice Armor", actions: 1, model: armor }],
                ...(lv >= 13 ? { acReaction: { value: 50, when: "hit", against: "ranged", name: "Ice Armor (shatter projectile)" } } : {})
            };
            return { spells, user };
        },
        buff: {"1": "1 action: wear ice armor: +1 circumstance bonus to AC (+2 from 5th), and creatures that hit you with a melee Strike take cold damage equal to your level. While you wear it, your Strikes deal 1d6 extra cold damage.", "5": "Surge: freeze the air in a 10-ft emanation: S cold (basic Fortitude); slowed 1 for 1 round on a failure. You skate: +10 ft Speed.", "9": "The armor also gives resistance 2 to physical damage (3 from 13th).", "13": "A creature that critically fails against freeze the air is slowed 1 for 1 minute."},
        buffNotes: ["Round 4 (cap): the armor's extra cold on Strikes 1d6 at every level (was 2d6 from 9th, 3d6 from 17th); its physical resistance stays 3 from 13th (was 5 from 17th).", "+2 AC from 5th; physical resistance on the armor effect from 9th; slowed 1 round on a failed freeze-the-air save.", "Round 2: extra cold on the stand's Strikes (ctx.main/second damage, always on — the armor goes on in round 1); freeze-the-air surge from 5th (was 9th); its critical failure slowed 1 minute from 13th."],
        notes: [
            "Integrated stand only (the user is the one body). Its price (no swimming, melts in heat) doesn't come up.",
            "1st: the armor as a 1-action effect on the user for the fight: +1 circumstance AC (+2 from 9th), and a melee hit on it deals cold equal to the level (hitBack).",
            "5th: skating's +10 ft as a circumstance bonus to Speed (flat ground assumed).",
            "13th: the projectile reaction as a +50 AC reaction on a ranged hit (the attack misses), once a round by the reaction.",
            "17th: absolute cold is passive in the text; played as a 1-action 5-ft zone about the user for 10 minutes: each foe starting its turn in it saves Fortitude or is slowed 1 for the round."
        ]
    },
    "Air Shots": {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Air Shots"](ctx);
            const { lv, D, halfS } = ctx;
            const spells = [ctx.make("Air Shots (bubble)", { actions: 1, damage: D("bludgeoning"), kind: "bludgeoning", attackRoll: true })];
            if (lv >= 9) {
                const uuid = "stand:air-shots-wall";
                const model = ctx.effectModel("Air Shots (bubble wall)", ctx.minutes(1).value, { modifiers: [{ on: "reflex", type: "circumstance", value: 2 }], conditional: [{ on: "ac", type: "circumstance", value: 2, predicate: ["item:ranged"] }] });
                const p = ctx.savePlan("Air Shots (surge bubble wall)", { actions: 2, traits: TRAITS(null), area: { type: "emanation", value: 30 }, dc: ctx.dc });
                p.resolution = { kind: "effect", check: null, sharedDamage: null, applications: [{ kind: "native-spell-effect", uuid, recipients: "allies-in-area" }] };
                spells.push({ ...ctx.entry("Air Shots (surge bubble wall)", p, { surge: true }), effects: { [uuid]: model } });
            }
            if (lv >= 13) spells.push(ctx.make("Air Shots (surge three bubbles)", { actions: 2, damage: halfS("bludgeoning"), kind: "bludgeoning", attackRoll: true, target: "up to 3 creatures", surge: true }));
            return { spells, ...(lv >= 17 ? { user: { acReaction: { value: 2, when: "hit", against: "ranged", name: "Air Shots (bubble shield)" } } } : {}) };
        },
        buff: {"1": "1 action in sunlight: invisible air bubble, range 30 ft: D bludgeoning (attack roll); the target doesn't see where it came from and is off-guard until the start of your next turn.", "5": "Bubbles can wait in place as traps for 1 minute. Surge: 3 bubbles at different targets, each S/2.", "13": "The surge fires 5 bubbles."},
        buffNotes: ["Off-guard 1 round on a hit (to everyone — no attacker-scoped off-guard); the three-bubble surge from 5th (13th: up to 5 targets)."],
        notes: [
            "Sunlight assumed (the price). 1st: 'doesn't see where it came from' isn't played.",
            "5th: bubbles waiting as traps for 1 minute — set up before foes come; not played.",
            "9th: the bubble wall as an effect on allies within 30 ft for 1 minute: +2 circumstance AC against ranged attacks and +2 circumstance to Reflex (all Reflex saves, not only areas from the other side).",
            "17th: the bubble shield as the user's own reaction (+2 AC on a ranged hit, as a hit-turning reaction); the adjacent ally's use isn't played."
        ]
    },
    "Meteor Call": {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Meteor Call"](ctx);
            const { lv, D } = ctx;
            const spells = [ctx.entry("Meteor Call (meteorite)", twoTypes(plan(ctx, "Meteor Call (meteorite)", { actions: 2, kind: "bludgeoning", damage: D("bludgeoning") }), D("fire"), "fire"))];
            if (lv >= 5) {
                const n = Math.ceil(lv / 2) * (lv >= 17 ? 2 : 1);
                const p = plan(ctx, "Meteor Call (surge meteor)", { actions: 2, kind: "bludgeoning", area: { type: "burst", value: lv >= 13 ? 20 : 10 }, damage: `${n}d6[bludgeoning]` });
                spells.push(ctx.entry("Meteor Call (surge meteor)", twoTypes(p, `${n}d6[fire]`, "fire"), { surge: true }));
            }
            return { spells };
        },
        buff: {"1": "2 actions, outdoors: call a meteorite on a 5-ft square within 60 ft; it lands at the start of your next turn: D bludgeoning + D fire (basic Reflex).", "5": "Surge: the meteor lands in a 10-ft burst within 60 ft that spares creatures you choose: S (half bludgeoning, half fire); prone on a critical failure.", "13": "Burst 15 ft.", "17": "Two meteors per surge; the second is a fragment that deals a quarter of the first's damage (both on one save)."},
        buffNotes: ["Round 4 (cap): 13th's burst 15 ft (module 20 ft); 17th's fragment a quarter of the first meteor's damage (was half; the surge's dice ×1.25 in all).", "Round 3 (tone-down): the meteorite back to 2 actions (its 60-ft range kept); the surge meteor's prone only on a critical failure (was a failure); 17th's second meteor deals half (the surge's dice ×1.5 in all, was ×2).", "Meteorite 1 action, 60 ft (still played as landing at once); surge meteor foes-only (the old burst into the stand's Melee hit the stand and allies — shared HP with the user — and from 13th's 20 ft caught most of the party), 60 ft, prone on a failure."],
        notes: [
            "Outdoors assumed (the price). Range: the stand's 30 ft (none given).",
            "1st: the meteorite lands at once instead of at the start of the next turn (the target can't step away; 9th's marking makes that so anyway); its 5-ft square as its one target.",
            "17th: both meteors of a surge on the same burst: its damage twice, on one save."
        ]
    },
    Pressure: {
        build(ctx) {
            if (ctx.buffed) return BUFFED["Pressure"](ctx);
            const { lv, S, round1 } = ctx;
            const area = { type: "burst", value: lv >= 17 ? 10 : 5 };
            const spells = [ctx.entry("Pressure (air pressure)", plan(ctx, "Pressure (air pressure)", { actions: 1, save: "fortitude", area, effects: { failure: [["sickened", 1, null]], criticalFailure: [["sickened", 1, null]] } }))];
            if (lv >= 5) spells.push(ctx.make("Pressure (surge blast)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", area, surge: true }));
            if (lv >= 13) spells.push(ctx.entry("Pressure (through a wound)", plan(ctx, "Pressure (through a wound)", { actions: 1, save: "fortitude", effects: { failure: [["slowed", 1, round1]], criticalFailure: [["slowed", 1, round1]] } })));
            return { spells };
        },
        buff: {"1": "1 action: change air pressure through an opening within 30 ft; creatures you choose in a 10-ft area behind it are sickened 1 (sickened 2 on a critical failure; Fortitude negates). Through a wound: a creature your stand damaged this round attempts Fortitude or is slowed 1 for 1 round.", "5": "Surge: pressure blast through an opening: S bludgeoning (basic Fortitude) to creatures you choose in a 10-ft area; sickened 1 on a failure (2 on a critical failure).", "9": "Pressure can seal a door for 1 minute (Athletics against your stand DC to open).", "13": "Through a wound: slowed 1 for 1 minute. Your pressure areas grow to 20 ft."},
        buffNotes: ["Areas foes-only; sickened rows on the blast; the wound step from 9th (1 action, stand's damage not required), slowed for 1 minute from 13th (no save each round).", "Round 2: through a wound from 1st (was 9th); the 17th's larger area (10-ft burst in the sim) from 13th."],
        notes: [
            "An opening (door, vent, wound) by the foes assumed (the price). Its '10-ft area' as a 5-ft burst (a 10-ft square), the 17th's 20 ft as a 10-ft burst.",
            "9th: sealing a door has no use in the simulator's fights.",
            "13th: through a wound at 1 action (none listed); the stand's damage on it this round isn't required."
        ]
    }
};
