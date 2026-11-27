// Stand Abilities: affliction theme (see index.js for the contract). The module's text (content/stand-abilities.md, 2026-11-24 buffs);
// its Defaults: a surge costs 1 Stand Point and 2 actions unless listed, ranges are measured from the stand (played from the user, the
// stand beside it), untyped damage is force, saves against the stand DC.

// (2026-11-26, module a5ce436, Cole: "give 5th level surges for the late ones" — the 9th-level surges at 5th and new 9th steps; LATE,
// STAND_LATE_SURGE=0 for the text before it.)
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const TRAITS = ["concentrate", "occult", "stand"];

// A save plan of the stand's (its DC, its range; a burst placed within the range).
function plan(ctx, name, { actions = 1, save = "fortitude", area = null, target = "1 creature", range = ctx.range, damage = null, kind = null, basic = !!damage, extra = {}, effects = {}, traits = [], attack = false }) {
    const out = ctx.savePlan(name, { actions, traits: [...TRAITS, ...(kind ? [kind] : []), ...traits], area, target, range, save, attack, dc: ctx.dc, damage, basic, extra, effects });
    if (area && area.type === "burst") out.targeting.range = range;
    if (damage) out.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
    return out;
}
// A plan's per-degree extras the core reads (nativeEffects, conditionFloor, effects of other kinds).
function addRows(out, degrees, field, value) {
    for (const degree of degrees) {
        const row = out.resolution.outcomes[degree];
        if (Array.isArray(value)) row[field] = [...(row[field] ?? []), ...value];
        else row[field] = value;
    }
    return out;
}
const FAILED = ["failure", "criticalFailure"];
const HIT = ["success", "failure", "criticalFailure"];

// A lasting area (zones.js): the entry's plan values it as its save on those in it; its saves at a foe's turn start.
function zoneEntry(ctx, name, valuePlan, { area, centre, rounds, savePlan: turnPlan, when = ["start"] }, opts = {}) {
    const entry = ctx.entry(name, valuePlan, opts);
    entry.zone = { area, centre, lasts: { value: rounds, unit: "rounds" }, concealed: false, terrain: [], saves: [{ plan: turnPlan, when }], castAs: { castRank: entry.castRank, dc: ctx.dc, attack: null, kind: "ability" } };
    return entry;
}

// (2026-11-24 stand10, Cole: "Buff all the stand abilities to be closer in power with each other. Dont lower any yet." — the buffed text,
// played when ctx.buffed; each ability's unbuffed build below is unchanged. BUFF_TEXT at the end joins buff/buffNotes onto the definitions
// and routes build to BUFFED[name] when ctx.buffed.)
const persistentD = (ctx, type) => `${1 + ctx.steps}d6[persistent,${type}]`;
const persistentHalfS = (ctx, type) => `${Math.ceil(ctx.lv / 2)}d6[persistent,${type}]`;
const unbuffed = (name, ctx) => AFFLICTION[name].build({ ...ctx, buffed: false });
const BUFFED = {
    Shrink(ctx) {
        const { lv, dc } = ctx;
        // (Round 2: enfeebled 2 on a failure from 13th; the stand's blows crush a shrunk creature — extra dice on a target already
        // enfeebled, listed before the save so it's the shrink of an earlier hit.)
        const fail = [["enfeebled", lv >= 13 ? 2 : 1, lv >= 5 ? 10 : 1], ["off-guard", null, 1]];
        const crit = [["enfeebled", 2, 10], ["off-guard", null, 1], ...(lv >= 5 ? [["clumsy", 1, 10]] : [])];
        const crush = { source: "Shrink (crushing blow)", when: "condition:enfeebled", dice: lv >= 13 ? 3 : lv >= 5 ? 2 : 1, die: 6 };  // (Round 5: 2d6 from 5th, 3d6 from 13th.)
        const extras = [crush, { source: "Shrink (off-guard)", when: "hit", offGuardToAttacker: true }, { source: "Shrink", when: "hit", save: { statistic: "fortitude", dc, outcomes: [crit, fail, [], []] } }];
        // (Round 6 trim: 'already shrunk' read as shrunk by a critical failure — its clumsy 1 the size's stand-in —, not any enfeebled: in the
        // buffed text a failure only enfeebles, so the 17th's second save no longer rides on every pinch and failed save.)
        if (lv >= 17) extras.push({ source: "Shrink (already shrunk)", when: "condition:clumsy", save: { statistic: "fortitude", dc, incapacitation: true, outcomes: [[["enfeebled", 3, 10]], [["enfeebled", 3, 10]], [], []] } });
        // (Round 5: the shrinking pinch — 1 action, 30 ft, the hit's save without the hit: Fortitude, the same failure/critical failure rows.)
        const lasting = (n) => (n === 1 ? ctx.round1 : ctx.minutes(1));
        const rows = (list) => list.map(([slug, value, rounds]) => [slug, value, lasting(rounds)]);
        const pinch = ctx.entry("Shrink (shrinking pinch)", plan(ctx, "Shrink (shrinking pinch)", { actions: 1, save: "fortitude", damage: `${Math.min(2, 1 + ctx.steps)}d6[bludgeoning]`, kind: "bludgeoning", effects: { failure: rows(fail.filter(([slug]) => slug !== "off-guard")), criticalFailure: rows(crit) } }));  // (Round 6 trim: the pinch's failure not off-guard.)
        return { spells: [pinch], stand: { strikeExtras: extras } };
    },
    Aging(ctx) {
        const { lv } = ctx;
        const radius = lv >= 9 ? 30 : 20;
        // (2026-11-27, AGING_V=drain: the gas ages them — drained up by 1 on a failure, 2 on a critical failure, to drained 3 (4 from 9th;
        // AGING_DMAX=2 for 2, 3 from 9th); the cold rules on (spells.js / actions.js agingCaster). AGING_FORCE=1: the aura cast early.)
        const drain = (globalThis.process?.env?.AGING_V ?? "drain") === "drain";  // (2026-11-27: adopted as the default; AGING_V=old for the previous gas)
        const dmax = (globalThis.process?.env?.AGING_DMAX === "2" ? 2 : 3) + (lv >= 9 ? 1 : 0);
        const failed = [["fatigued", null, null], ["enfeebled", 1, ctx.round1], ...(drain ? [[`aging-drain-${dmax}`, 1, null]] : [])];
        const effects = { failure: failed, criticalFailure: [["fatigued", null, null], ["enfeebled", 1, ctx.round1], ...(drain ? [[`aging-drain-${dmax}`, 2, null]] : []), ...(lv >= 17 ? [["slowed", 1, ctx.round1]] : [])] };
        const area = { type: "emanation", value: radius };
        const valuePlan = plan(ctx, "Aging (gas aura)", { actions: 1, area: { ...area, foes: true }, effects });
        const turnPlan = plan(ctx, "Aging (gas aura)", { actions: 1, effects });
        const spells = [{ ...zoneEntry(ctx, "Aging (gas aura)", valuePlan, { area, centre: "caster", rounds: 10, savePlan: turnPlan }), ...(globalThis.process?.env?.AGING_FORCE === "1" ? { forceEarly: true } : {}) }];
        // (Round 2: the withering grip, at will — 1 action, the stand's touch at its 30 ft like the surge's.)
        const withered = [["enfeebled", 1, ctx.round1]];  // (Round 4 cap: a failure's enfeebled 1 until the end of the user's next turn, was 1 minute.)
        spells.push(ctx.make("Aging (withering grip)", { actions: 1, damage: ctx.D("force"), kind: "force", save: "fortitude", effects: { failure: withered, criticalFailure: [["enfeebled", 2, ctx.minutes(1)]] } }));
        if (lv >= 5) {
            const drained = ["drained", lv >= 13 ? 2 : 1, null];
            spells.push(ctx.entry("Aging (surge touch)", plan(ctx, "Aging (surge touch)", { actions: 2, damage: ctx.S("force").replace("d6", "d4"), kind: "force", effects: { failure: [drained, ["slowed", 1, ctx.round1]], criticalFailure: [drained, ["slowed", 1, ctx.minutes(1)]] } }), { surge: true }));  // (Round 4 cap: S's dice d4s, was d6s.)
        }
        return { spells, ...(drain ? { user: { agingCaster: true }, stand: { agingCaster: true } } : {}) };
    },
    Virus(ctx) {
        const { lv } = ctx;
        const persistent = lv >= 5 ? persistentHalfS(ctx, "poison") : persistentD(ctx, "poison");
        // (Round 2: the bite at once half S from 13th; the capsule punch's bite a basic save — the fist lands either way.)
        // (Round 5: the bite's half S from 5th (was 13th); from 13th sickened 2 on a failure, 3 on a critical failure.)
        const hit = lv >= 5 ? ctx.halfS("poison") : ctx.D("poison");
        const extra = { failure: [persistent, hit], criticalFailure: [persistent, hit] };
        const effects = { failure: [["sickened", lv >= 13 ? 2 : 1, null]], criticalFailure: [["sickened", lv >= 13 ? 3 : 2, null], ...(lv >= 17 ? [["drained", 2, null]] : [])] };
        if (lv >= 17) effects.failure.push(["drained", 1, null]);  // (Round 5: drained 1 on a failure from 17th.)
        // (a5ce436: capsule bursts 15 ft from 9th; the three-capsule surge at 5th.)
        const burst = LATE && lv >= 9 ? 15 : 10;
        const spells = [ctx.entry("Virus (capsule)", plan(ctx, "Virus (capsule)", { actions: 1, area: { type: "burst", value: burst }, kind: "poison", extra, effects }))];
        // (The capsule punch: one creature, the stand's fist — played at the stand's 30 ft from the user like its other touches.)
        spells.push(ctx.entry("Virus (capsule punch)", plan(ctx, "Virus (capsule punch)", { actions: 1, kind: "poison", damage: hit, target: "1 creature", extra: { failure: [persistent], criticalFailure: [persistent] }, effects })));
        if (lv >= (LATE ? 5 : 9)) spells.push(ctx.entry("Virus (surge, three capsules)", plan(ctx, "Virus (surge, three capsules)", { actions: 2, area: { type: "burst", value: burst + 10 }, kind: "poison", extra, effects }), { surge: true }));
        return { spells };
    },
    Mold(ctx) {
        const { lv } = ctx;
        // (A foe starting its turn in the mold: Reflex or it slips downward — the mold's trigger — and takes the persistent poison; a
        // critical failure falls prone too. The 'moves down' trigger itself, which the engine has no event for, is played only through this.)
        const zone = (name, radius, persistent, surge) => {
            const extra = { failure: [persistent], criticalFailure: [persistent] };
            // (Round 2: 1 action to release; from 5th a failed slip is a fall — prone on a failure too.)
            const actions = surge ? 2 : 1;
            const effects = { ...(lv >= 5 ? { failure: [["prone", null, null]] } : {}), criticalFailure: [["prone", null, null], ...(lv >= 17 ? [["slowed", 1, ctx.round1]] : [])] };
            const area = { type: "emanation", value: radius };
            // (a5ce436 9th: −2 circumstance to Reflex against the footing, played as the DC 2 higher.)
            const c = LATE && lv >= 9 ? { ...ctx, dc: ctx.dc + 2 } : ctx;
            const valuePlan = plan(c, name, { actions, save: "reflex", kind: "poison", area: { ...area, foes: true }, extra, effects });
            const turnPlan = plan(c, name, { actions, save: "reflex", kind: "poison", extra, effects });
            return zoneEntry(ctx, name, valuePlan, { area, centre: "caster", rounds: 10, savePlan: turnPlan }, { surge });
        };
        const spells = [zone("Mold", 30, persistentD(ctx, "poison"), false)];
        if (lv >= (LATE ? 5 : 9)) spells.push(zone("Mold (surge, 60 ft)", 60, persistentHalfS(ctx, "poison"), true));
        return { spells };
    },
    "Rage Field"(ctx) {
        const { lv } = ctx;
        const area = { type: "burst", value: lv >= 9 ? 30 : 20 };
        const fear = (p) => {
            p.resolution.check.against = { dc: "fixed", value: ctx.dc + 1 };
            return p;
        };
        const effects = lv >= 5 ? { failure: [["frightened", 2, null]], criticalFailure: [["frightened", 3, null]] } : { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null]] };  // (Round 5: 2/3 from 5th.)
        const traits = ["emotion", "fear", "mental"];
        const valuePlan = fear(plan(ctx, "Rage Field", { actions: 1, area: { ...area, foes: true }, save: "will", effects, traits }));
        const turnPlan = fear(plan(ctx, "Rage Field", { actions: 1, save: "will", effects, traits }));
        const spells = [zoneEntry(ctx, "Rage Field", valuePlan, { area, centre: "placed", rounds: 10, savePlan: turnPlan })];
        // (Round 2: the goad — 1 action at a creature within 30 ft, the field taken as reaching it.)
        // (Round 5: the goad at up to 2 creatures from 5th, 3 from 13th.)
        spells.push(ctx.make("Rage Field (goad)", { actions: 1, damage: lv >= 5 ? ctx.halfS("mental") : ctx.D("mental"), kind: "mental", save: "will", target: lv >= 13 ? "up to 3 creatures" : lv >= 5 ? "up to 2 creatures" : "1 creature", effects: { failure: [["frightened", 1, null], ...(lv >= 13 ? [["confused", null, ctx.round1]] : [])], criticalFailure: [["frightened", 2, null], ["confused", null, ctx.round1]] } }));  // (Round 5: from 13th a failure also confused for a round.)
        if (lv >= 5) {
            const failed = lv >= 17 ? ctx.minutes(1) : ctx.round1;
            spells.push(ctx.entry("Rage Field (surge)", plan(ctx, "Rage Field (surge)", { actions: 2, area: { ...area, foes: true }, save: "will", traits: ["incapacitation", "emotion", "mental"], effects: { failure: [["confused", null, failed]], criticalFailure: [["confused", null, ctx.minutes(1)]] } }), { surge: true }));
            ctx.convert("Rage Field (surge, bystanders)", { from: "commoner", count: 2, actions: 2, surge: true, lasts: 1, initiative: "roll" });
        }
        return { spells };
    },
    "Devouring Flesh"(ctx) {
        const { lv, make, D, S } = ctx;
        const out = unbuffed("Devouring Flesh", ctx);
        // (Round 5: sickened 1 on a failed lash from 1st (was 5th); its persistent acid 2d6 from 9th, 3d6 from 17th; the slime armor always
        // on — a passive effect from the fight's start instead of the 1-action self effect.)
        const failed = [["sickened", 1, null]];
        const armor = out.user?.selfEffects?.find((each) => each.name === "Devouring Flesh (slime armor)");
        if (armor) out.user = { ...out.user, selfEffects: out.user.selfEffects.filter((each) => each !== armor), passiveEffects: [...(out.user.passiveEffects ?? []), { ...armor.model, rounds: Infinity }] };
        const acid = `${lv >= 13 ? 3 : lv >= 5 ? 2 : 1}d6[persistent,acid]`;  // (Round 5 later: 2d6 from 5th, 3d6 from 13th.)
        // (Round 2: the lash 20 ft, persistent acid on a failure too; 13th's healing — half the acid it deals — from 1st, the lash's and
        // the engulf's; the engulf from 5th.)
        const feed = [{ kind: "heal", fromDamage: true, fraction: 0.5, recipient: "self" }];
        const lash = make("Devouring Flesh (slime lash)", { actions: 1, damage: D("acid"), kind: "acid", save: "fortitude", target: lv >= 13 ? "up to 2 creatures" : "1 creature", extra: { failure: [acid], criticalFailure: [acid] }, effects: { failure: failed, criticalFailure: failed } });
        lash.plan.targeting.range = "20 feet";
        addRows(lash.plan, HIT, "effects", feed);
        const spells = [lash];
        if (lv >= 5) {
            const engulf = make("Devouring Flesh (surge engulf)", { actions: 2, damage: S("acid"), kind: "acid", save: "fortitude", surge: true });
            engulf.plan.targeting.range = "touch";
            addRows(engulf.plan, HIT, "effects", feed);
            spells.push(engulf);
        }
        out.spells = spells;
        // (2026-11-27, open to all types: a separate stand is coated instead — the slime armor on the stand.)
        if (ctx.type && ctx.type !== "integrated" && out.user) { out.stand = { ...(out.stand ?? {}), ...out.user }; delete out.user; }
        // (2026-11-27, NCFILL2 9th: the lash's persistent acid has no flat check; 2 actions to scrape it off — actions.js, fight.js.)
        if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 9) out.user = { ...(out.user ?? {}), devourFill: true };
        return out;
    },
    Parasite(ctx) {
        const { lv, make, S } = ctx;
        const rounds10 = ctx.minutes(1);
        const more = lv >= 13 ? [["enfeebled", 2, rounds10]] : lv >= 5 ? [["enfeebled", 1, rounds10]] : [];  // (Round 5: enfeebled 2 from 13th, was 17th.)
        const sick = lv >= 13 ? 2 : 1;  // (Round 5: sickened 2 / 3 and the floor 2 from 13th.)
        // (Round 2: the parasite feeds — D persistent bleed on a failure; its surge attack from 5th.)
        const feeds = lv >= 5 ? persistentHalfS(ctx, "bleed") : persistentD(ctx, "bleed");  // (Round 5: half S from 5th.)
        // (Round 5: the parasite bites as it burrows in — D piercing, basic Fortitude; the rows as before on a failure.)
        const plant = plan(ctx, "Parasite", { actions: 1, damage: ctx.D("piercing"), kind: "piercing", target: lv >= 13 ? "up to 2 creatures" : "1 creature", extra: { failure: [feeds], criticalFailure: [feeds] }, effects: { failure: [["sickened", sick, rounds10], ...more], criticalFailure: [["sickened", sick + 1, rounds10], ...more] } });
        addRows(plant, FAILED, "conditionFloor", { slug: "sickened", value: sick, lifetime: "fixed", duration: { value: 10, unit: "rounds" } });
        const spells = [ctx.entry("Parasite", plant)];
        if (lv >= 5) {
            const bite = make("Parasite (surge attack)", { actions: 2, damage: S("piercing"), kind: "piercing", save: "fortitude", surge: true });
            bite.plan.needs = [{ target: { conditions: ["sickened"], within: 30 } }];
            addRows(bite.plan, ["criticalSuccess", ...HIT], "conditionFloor", { slug: "sickened", value: 1, lifetime: "fixed", duration: { value: 10, unit: "rounds" } });
            spells.push(bite);
        }
        // (NCFILL 17th: the parasite controls one of the host's actions — Will; a failure taken as an action lost (slowed 1 for a round), a
        // critical failure controlled for a round.)
        if ((globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 17) {
            const ctl = plan(ctx, "Parasite (surge control)", { actions: 2, save: "will", effects: { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["controlled", null, ctx.round1]] } });
            ctl.needs = [{ target: { conditions: ["sickened"], within: 30 } }];
            spells.push(ctx.entry("Parasite (surge control)", ctl, { surge: true }));
        }
        // (2026-11-27, NCFILL2 9th: cutting it out takes –2 (the feeding bleed's flat check DC 17) and the host takes D piercing — actions.js, fight.js.)
        if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 9) return { spells, user: { parasiteFill: { dc: 17, damage: ctx.D("piercing") } } };
        return { spells };
    },
    "Pain Link"(ctx) {
        const { lv } = ctx;
        const out = unbuffed("Pain Link", ctx);
        // (Round 2: the link tears in — D mental, basic Will; two hosts from 5th, three from 13th; the full share from 9th.)
        if (lv >= 9) {
            for (const each of [...out.spells, ...(out.stand?.spells ?? [])]) if (each.name === "Pain Link (shared pain)" && each.plan.resolution.sharedDamage.triggeredDamage.fraction < 1) each.plan.resolution.sharedDamage.triggeredDamage.fraction = 1;
        }
        const linked = [["off-guard", null, ctx.minutes(1)], ...(lv >= 5 ? [["clumsy", 1, ctx.minutes(1)]] : [])];
        const link = ctx.entry("Pain Link", plan(ctx, "Pain Link", { actions: 1, save: "will", damage: ctx.D("mental"), kind: "mental", target: lv >= 13 ? "up to 3 creatures" : lv >= 5 ? "up to 2 creatures" : "1 creature", effects: { failure: linked, criticalFailure: linked } }));
        out.spells = [...out.spells.filter((each) => each.name !== "Pain Link"), link];
        // (2026-11-27, PAINLINK_REAL=1: the real link — the Retributive Pain stand-in dropped; the share on the user (actions.js);
        // PAINLINK_FORCE=1 links early.)
        const env = globalThis.process?.env ?? {};
        if (env.PAINLINK_REAL !== "0") {
            out.spells = out.spells.filter((each) => each.name !== "Pain Link (shared pain)").map((each) => (each.name === "Pain Link" && env.PAINLINK_FORCE === "1" ? { ...each, forceEarly: true } : each));
            if (out.stand?.spells) out.stand.spells = out.stand.spells.filter((each) => each.name !== "Pain Link (shared pain)");
            const p17 = lv >= 17 ? (env.PAINLINK17 ?? "b") : null;  // (2026-11-27: (b) the stun adopted as the default)
            out.user = { ...(out.user ?? {}), painLinkFraction: p17 === "a" ? 1.5 : lv >= 9 ? 1 : 0.5, ...(p17 === "b" ? { painLinkStun: true } : {}) };
        }
        return out;
    },
    "Internal Attack"(ctx) {
        const { lv, make, S } = ctx;
        const rounds10 = ctx.minutes(1);
        const crit = [["sickened", 2, rounds10], ...(lv >= 17 ? [["slowed", 1, rounds10]] : [])];
        const spells = [{ ...ctx.entry("Internal Attack", plan(ctx, "Internal Attack", { actions: 1, area: { type: "burst", value: lv >= 13 ? 20 : 10, foes: true }, extra: { failure: [ctx.D("bludgeoning")], criticalFailure: [ctx.D("bludgeoning")] }, effects: { failure: [["sickened", 1, rounds10]], criticalFailure: crit } })), ...(globalThis.process?.env?.INTATK_FORCE === "1" ? { forceEarly: true } : {}) }];
        if (lv >= 5) {
            const slowed = [["slowed", 1, ctx.round1]];
            // (Round 2: the surge 1 action.)
            const inside = make("Internal Attack (surge)", { actions: 1, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true, effects: { failure: slowed, criticalFailure: slowed } });
            inside.plan.needs = [{ target: { conditions: ["sickened"], within: 30 } }];
            spells.push(inside);
        }
        return { spells };
    },
    "Melting Dart"(ctx) {
        const { lv, make, D, halfS } = ctx;
        const dice = lv >= 17 ? 3 : lv >= 9 ? 2 : 1;
        // (Round 2: persistent acid from 1st; the critical hit's clumsy from 5th; from 13th clumsy 1 on any hit until the end of the
        // user's next turn — a 1-round duration.)
        const acid = { success: [`${dice}d6[persistent,acid]`], criticalSuccess: [`${dice}d6[persistent,acid]`] };
        const clumsy = lv >= 5 ? { ...(lv >= 13 ? { success: [["clumsy", 1, ctx.round1]] } : {}), criticalSuccess: [["clumsy", 1, ctx.minutes(1)]] } : {};
        const ignore = (entry) => {
            if (lv >= 17) entry.plan.resolution.ignoreResistance = [{ value: 1e9, types: ["acid"] }];
            return entry;
        };
        const spells = [ignore(make("Melting Dart", { actions: 1, damage: D("acid"), kind: "acid", attackRoll: true, extra: acid, effects: clumsy }))];
        if (lv >= (LATE ? 5 : 9)) spells.push(ignore(make("Melting Dart (surge, three darts)", { actions: 1, damage: halfS("acid"), kind: "acid", attackRoll: true, target: "up to 3 creatures", surge: true, extra: acid, effects: clumsy })));
        return { spells };
    },
    Dinosaurify(ctx) {
        const { lv } = ctx;
        // (Round 2: the raptor's tearing — extra dice on every stand Strike that hits in raptor form, the form taken as up from the start.)
        const tearing = { source: "Dinosaurify (tearing jaws)", when: "hit", dice: lv >= 17 ? 3 : lv >= 9 ? 2 : 1, die: 6 };
        const stand = { speed: 40, strikeExtras: [tearing], charges: [{ name: "Dinosaurify (Leaping Charge)", actions: 1, strides: 1, strike: ctx.main.name, attackBonus: 1, oncePerTurn: true }] };
        const spells = [];
        if (lv >= 5) {
            const crit = lv >= 17 ? ctx.minutes(10) : ctx.minutes(1);
            const dino = (duration) => [["confused", null, duration], ["stupefied", 2, duration]];
            spells.push(ctx.entry("Dinosaurify (surge)", plan(ctx, "Dinosaurify (surge)", { actions: 2, save: "will", traits: ["incapacitation", "polymorph"], effects: { failure: dino(ctx.rounds(2)), criticalFailure: dino(crit) } }), { surge: true }));
            ctx.convert("Dinosaurify (surge, bystander dinosaur)", { from: "commoner", actions: 2, surge: true, lasts: lv >= 17 ? 100 : 10, initiative: "roll", as: (c) => ({ ...c, name: `Dinosaur (${c.name})`, speed: 40, strikes: [{ name: "Jaws", bonus: 4, melee: true, unarmed: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] }, { name: "Talon", bonus: 4, melee: true, agile: true, unarmed: true, damage: [{ dice: 1, die: 3, bonus: 0, type: "slashing" }] }] }) });
        }
        // (Buffed: the elite raptor from 9th, two from 13th.)
        if (lv >= 9) {
            const elite = 2;
            ctx.convert("Dinosaurify (raptor minion)", { from: "animal", count: lv >= 13 ? 2 : 1, actions: 2, lasts: 10, initiative: "minion", as: (c) => ({ ...c, name: `Raptor minion (${c.name})`, level: 2, traits: ["animal", "dinosaur", "minion"], hp: { value: 20 + 5 * elite, max: 20 + 5 * elite }, ac: 16 + elite, saves: { fortitude: 6 + elite, reflex: 9 + elite, will: 4 + elite }, perception: 7 + elite, speed: 40, strikes: [{ name: "Jaws", bonus: 9 + elite, melee: true, unarmed: true, damage: [{ dice: 1, die: 8, bonus: 2 + elite, type: "piercing" }] }, { name: "Talon", bonus: 9 + elite, melee: true, agile: true, unarmed: true, damage: [{ dice: 1, die: 6, bonus: 2 + elite, type: "slashing" }] }] }) });
        }
        return { spells, stand };
    }
};

export const AFFLICTION = {
    Shrink: {
        build(ctx) {
            const { lv, dc } = ctx;
            // (Strike extras' outcomes: [critical failure, failure, success, critical success], each [slug, value, rounds].)
            const extras = [{ source: "Shrink", when: "hit", save: { statistic: "fortitude", dc, outcomes: [[["enfeebled", lv >= 5 ? 2 : 1, 1]], [["enfeebled", 1, 1]], [], []] } }];
            if (lv >= 17) extras.push({ source: "Shrink (already shrunk)", when: "condition:enfeebled", save: { statistic: "fortitude", dc, incapacitation: true, outcomes: [[["enfeebled", 3, 10]], [["enfeebled", 3, 10]], [], []] } });
            return { stand: { strikeExtras: extras } };
        },
        notes: [
            "1/5: a Fortitude save (stand DC) after every stand Strike that hits — a strikeExtras save: failure enfeebled 1, critical failure enfeebled 1 (2 from 5th) until the end of its next turn",
            "the size step down isn't played (the engine has no size rule for damage or reach here); 13th's longer, stacking shrink only through 17th's",
            "17: 'fails while already shrunk' played as a second save on a hit at a creature already enfeebled (incapacitation): failure Tiny and enfeebled 3 for 1 minute — 'already shrunk' read as still enfeebled from Shrink",
            "9: the Tiny surge (10 minutes, Stealth) is out of combat — not played"
        ]
    },
    Aging: {
        build(ctx) {
            const { lv } = ctx;
            const radius = lv >= 9 ? 20 : 10;
            const crit = [["fatigued", null, null], ...(lv >= 17 ? [["slowed", 1, ctx.round1]] : [])];
            const effects = { failure: [["fatigued", null, null]], criticalFailure: crit };
            const area = { type: "emanation", value: radius };
            // (The zone's saves spare the user's side: valued on the foes in it only.)
            const valuePlan = plan(ctx, "Aging (gas aura)", { actions: 2, area: { ...area, foes: true }, effects });
            const turnPlan = plan(ctx, "Aging (gas aura)", { actions: 2, effects });
            const spells = [zoneEntry(ctx, "Aging (gas aura)", valuePlan, { area, centre: "caster", rounds: 10, savePlan: turnPlan })];
            if (lv >= 5) {
                const touch = [["drained", lv >= 13 ? 2 : 1, null], ["slowed", 1, ctx.round1]];
                spells.push(ctx.entry("Aging (surge touch)", plan(ctx, "Aging (surge touch)", { actions: 2, effects: { failure: touch, criticalFailure: touch } }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "1/9/17: a zone about the user (10-ft emanation, 20 ft from 9th) for 1 minute; a foe starting its turn in it saves (Fortitude) or is fatigued; 17th's slowed 1 on a critical failure for 1 round",
            "allies' critical-failure risk not played (the engine's zones spare their maker's side); the price against cold creatures and chilled targets isn't played",
            "the zone's worth as it's made is read as the save on those in it then (the engine's zone valuation), though the save comes at their turns — so at 1st–5th (10 ft, fatigued worth little, the user's 2 actions after a Stride) the planner never picks it; from 9th it does",
            "5/13: surge (2 actions, the default) touch: drained 1 (2 from 13th, lasting) and slowed 1 for 1 round, Fortitude negates; the stand's touch played at the stand's 30-foot range from the user"
        ]
    },
    Virus: {
        build(ctx) {
            const { lv } = ctx;
            const persistent = `${lv >= 5 ? 1 + ctx.steps : 1}d6[persistent,poison]`;
            const extra = { failure: [persistent], criticalFailure: [persistent] };
            const effects = lv >= 17 ? { criticalFailure: [["drained", 2, null]] } : {};
            const spells = [ctx.entry("Virus (capsule)", plan(ctx, "Virus (capsule)", { actions: 1, area: { type: "burst", value: 10 }, kind: "poison", extra, effects }))];
            if (lv >= 9) spells.push(ctx.entry("Virus (surge, three capsules)", plan(ctx, "Virus (surge, three capsules)", { actions: 2, area: { type: "burst", value: 20 }, kind: "poison", extra, effects }), { surge: true }));
            return { spells };
        },
        notes: [
            "1/5: 1 action, 10-ft burst within 30 ft, Fortitude negates: 1d6 persistent poison (D from 5th) on a failure or critical failure; allies in the burst are caught (the engine's areas), the user only if it stands in it",
            "9: surge (2 actions, the default): three 10-ft bursts played as one 20-ft burst (about the same ground)",
            "13: killing the virus (ending its persistent damage, sunlight) isn't played — the persistent damage runs its course",
            "17: drained 2 on a critical failure"
        ]
    },
    "Iron Blood": {
        build(ctx) {
            const { lv, make, D, S } = ctx;
            const bleed = { criticalFailure: ["1d6[persistent,bleed]"] };
            // (2026-11-27, IRONLOSS_V=ko|soft: the Iron Loss track instead of 5th's sickened, 17th's drained 2 → drained 1; IRONLOSS_FORCE=1 rates
            // it as used. Off: as before.)
            const IL = globalThis.process?.env?.IRONLOSS_V ?? "ko";  // (2026-11-27: the KO track with no trims adopted as the default; IRONLOSS_V= for the old Iron Blood)
            const rows = (sick) => {
                if (IL) {
                    // (IRONLOSS_TRIM=0: no trims — the 5th sickened (its value) and 17th's drained 2 kept alongside the track.)
                    const keep = globalThis.process?.env?.IRONLOSS_TRIM !== "1";  // (no trims by default; IRONLOSS_TRIM=1 for the trimmed version)
                    const failed = [["iron-loss", 1, null], ...(keep && sick ? [["sickened", sick, null]] : []), ...(lv >= 13 ? [["clumsy", 1, ctx.round1]] : [])];
                    return { failure: failed, criticalFailure: [["iron-loss", 2, null], ...(keep && sick ? [["sickened", sick, null]] : []), ...(lv >= 13 ? [["clumsy", 1, ctx.round1]] : []), ...(lv >= 17 ? [["drained", keep ? 2 : 1, null]] : [])] };
                }
                const failed = [...(sick ? [["sickened", sick, null]] : []), ...(lv >= 13 ? [["clumsy", 1, ctx.round1]] : [])];
                return { failure: failed, criticalFailure: [...failed, ...(lv >= 17 ? [["drained", 2, null]] : [])] };
            };
            const spells = [make("Iron Blood", { actions: 1, damage: D("slashing"), kind: "slashing", save: "fortitude", extra: bleed, effects: rows(lv >= 5 ? 1 : 0) })];
            // (a5ce436: the surge at 5th; two creatures within 30 ft from 9th.)
            if (lv >= (LATE ? 5 : 9)) spells.push(make("Iron Blood (surge)", { actions: 2, damage: S("slashing"), kind: "slashing", save: "fortitude", surge: true, extra: bleed, effects: rows(2), target: LATE && lv >= 9 ? "up to 2 creatures" : "1 creature" }));
            return { spells };
        },
        notes: [
            "1: 1 action, 30 ft, D slashing basic Fortitude, 1d6 persistent bleed on a critical failure; 5: sickened 1 on a failure (and critical failure); 9: surge (2 actions) S slashing, sickened 2 on a failure; 13: clumsy 1 for 1 round on a failure; 17: drained 2 on a critical failure",
            "the price (no effect on bloodless creatures: constructs, most undead) isn't checked — every foe is taken to bleed",
            "13's iron camouflage (Hide against walls) isn't played"
        ]
    },
    Mold: {
        build: () => null,
        why: "it only triggers on a creature that moves to a lower position (stepping down, falling, from 5th going prone): the simulator's level field has no downward movement and no trigger on going prone, so the mold never sets off",
        notes: ["a zone whose only trigger (moving down; from 5th, falling prone) the engine has no event for — 9th's 60-ft surge, 13th's ally immunity and 17th's slowed infected all ride on it"]
    },
    "Rage Field": {
        build(ctx) {
            const { lv } = ctx;
            const radius = lv >= 9 ? 30 : 20;
            const area = { type: "burst", value: radius };
            // (The field's -1 to Will saves against fear and emotion: on its own frightened save — one higher DC.)
            const fear = (p) => {
                p.resolution.check.against = { dc: "fixed", value: ctx.dc + 1 };
                return p;
            };
            const effects = { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 1, null]] };
            const valuePlan = fear(plan(ctx, "Rage Field", { actions: 2, area: { ...area, foes: true }, save: "will", effects, traits: ["emotion", "fear", "mental"] }));
            const turnPlan = fear(plan(ctx, "Rage Field", { actions: 2, save: "will", effects, traits: ["emotion", "fear", "mental"] }));
            const spells = [zoneEntry(ctx, "Rage Field", valuePlan, { area, centre: "placed", rounds: 10, savePlan: turnPlan })];
            if (lv >= 5) {
                const crit = lv >= 17 ? ctx.minutes(1) : ctx.round1;
                spells.push(ctx.entry("Rage Field (surge)", plan(ctx, "Rage Field (surge)", { actions: 2, area: { ...area, foes: true }, save: "will", traits: ["incapacitation", "emotion", "mental"], effects: { failure: [["confused", null, ctx.round1]], criticalFailure: [["confused", null, crit]] } }), { surge: true }));
            }
            // (Bystanders in the field: the surge's 'must Strike the nearest creature' on the commoners — played as both turned on the foes for
            // a round; its own use, as a separate entry.)
            if (lv >= 5) ctx.convert("Rage Field (surge, bystanders)", { from: "commoner", count: 2, actions: 2, surge: true, lasts: 1, initiative: "roll" });
            return { spells };
        },
        notes: [
            "with bystanders (-nc build): from 5th the surge also sends the 2 commoners at the foes for a round — played as its own 2-action use, not with the foes' save",
            "1/9: a zone (20-ft burst within 30 ft, 30 ft from 9th; valued as one frightened save — chosen from 9th, not at 1st–8th) for 1 minute; a foe starting its turn in it saves (Will) or is frightened 1; the field's -1 to Will against fear and emotion played on that save (DC +1) — not on other fear effects",
            "5/17: surge (2 actions): foes in the area save (Will, incapacitation) or 'must Strike the nearest creature' — played as confused for 1 round (1 minute on a critical failure from 17th); taken whether or not the field is up",
            "the price (allies attacking each other; allies who fail must save) and 13th's +2 for allies aren't played: the engine's zones and the surge's foes-only area leave allies out"
        ]
    },
    "Devouring Flesh": {
        build(ctx) {
            const { lv, make, S } = ctx;
            const name = "Devouring Flesh (slime armor)";
            const model = ctx.effectModel(name, 10, { resistances: [{ type: lv >= 17 ? "all-damage" : "physical", value: lv, exceptions: [] }], hitBack: `${lv}[acid]` });
            const spells = [];
            if (lv >= 9) {
                const engulf = make("Devouring Flesh (surge engulf)", { actions: 2, damage: S("acid"), kind: "acid", save: "fortitude", surge: true });
                engulf.plan.targeting.range = "touch";
                if (lv >= 13) addRows(engulf.plan, HIT, "effects", [{ kind: "heal", fromDamage: true, fraction: 0.5, recipient: "self" }]);
                spells.push(engulf);
            }
            return { spells, user: { selfEffects: [{ name, actions: 1, model }] } };
        },
        notes: [
            "integrated: the user is the stand's body. 1/17: 1 action, slime armor for 1 minute (the fight): resistance to physical damage equal to its level (all damage from 17th), and a creature that hits it with a melee Strike takes acid equal to its level (hitBack)",
            "9: surge (2 actions) engulf: S acid basic Fortitude at a creature beside it — the grab it needs taken as made",
            "13: healing half the acid: the engulf's damage (as rolled) only; the armor's hit-back acid heals nothing here",
            "5's disguise shape isn't played; the price (allies avoid it) isn't played"
        ]
    },
    Parasite: {
        build(ctx) {
            const { lv, make, S } = ctx;
            const rounds10 = ctx.minutes(1);
            const failed = [["sickened", 1, rounds10], ...(lv >= 17 ? [["enfeebled", 2, rounds10]] : [])];
            const plant = plan(ctx, "Parasite", { actions: 2, target: lv >= 13 ? "up to 2 creatures" : "1 creature", effects: { failure: failed, criticalFailure: failed } });
            addRows(plant, FAILED, "conditionFloor", { slug: "sickened", value: 1, lifetime: "fixed", duration: { value: 10, unit: "rounds" } });
            const spells = [ctx.entry("Parasite", plant)];
            if (lv >= 9) {
                const bite = make("Parasite (surge attack)", { actions: 2, damage: S("piercing"), kind: "piercing", save: "fortitude", surge: true });
                bite.plan.needs = [{ target: { conditions: ["sickened"], within: 30 } }];
                addRows(bite.plan, ["criticalSuccess", ...HIT], "conditionFloor", { slug: "sickened", value: 1, lifetime: "fixed", duration: { value: 10, unit: "rounds" } });
                spells.push(bite);
            }
            return { spells };
        },
        notes: [
            "1: 2 actions, Fortitude negates: sickened 1 for 1 minute that it can't reduce below 1 (a condition floor); the wound it needs taken as there; the stand's touch played at 30 ft; the Medicine cut-out (2 actions) isn't played by foes",
            "9: surge (2 actions) at a sickened creature (the infected one): S piercing basic Fortitude, and it can't Recover (the floor kept for 1 minute)",
            "13: two creatures for the planting; 17: enfeebled 2 with the sickened",
            "5's -2 to Deception and Stealth isn't played"
        ]
    },
    "Pain Link": {
        build(ctx) {
            const { lv } = ctx;
            // (The share: the engine's Retributive Pain — a reaction-time entry whose triggeredDamage is the user's last damage — on the creature
            // that dealt it.)
            const share = plan(ctx, "Pain Link (shared pain)", { actions: 1, save: "fortitude", basic: true });
            share.activation.time = "reaction";
            // (2026-11-27: no save, as the text says — PAINLINK_SAVE=1 for the old basic Fortitude; PAINLINK17=a: the host takes 1.5 times from
            // 17th; b: stunned 1 the first time each round.)
            const env = globalThis.process?.env ?? {};
            const p17 = lv >= 17 ? env.PAINLINK17 : null;
            share.resolution.sharedDamage = { rollOnce: true, components: [], triggeredDamage: { source: "caster-last-damage", fraction: p17 === "a" ? 1.5 : lv >= 17 ? 1 : 0.5, type: "force", ...(env.PAINLINK_SAVE === "1" ? {} : { noSave: true }), ...(p17 === "b" ? { stun: true } : {}) } };
            const shareEntry = ctx.entry("Pain Link (shared pain)", share, { actionType: "reaction" });
            const spells = [shareEntry];
            if (lv >= 5) {
                const offGuard = [["off-guard", null, ctx.minutes(1)]];
                spells.push(ctx.entry("Pain Link", plan(ctx, "Pain Link", { actions: 2, save: "will", target: lv >= 13 ? "up to 2 creatures" : "1 creature", effects: { failure: offGuard, criticalFailure: offGuard } })));
            }
            // (Hits on the stand are the user's damage too — shared Hit Points: the stand answers them with its own copy.)
            return { spells, stand: { spells: [structuredClone(shareEntry)] } };
        },
        notes: [
            "the damage share is played with the engine's Retributive Pain mechanism: when the user takes a sixth of its Hit Points or more, half that (all from 17th) as force at the creature that dealt it — not a linked host of the user's choice, without the link's 2 actions and Will save, spending the user's reaction, and with a basic Fortitude save the engine rolls (the text: no save)",
            "hits on the stand (shared Hit Points) set it off too: the stand carries a copy, answering with its own reaction (the engine gives the stand a reaction of its own)",
            "5/13: the link (2 actions, Will negates) for its off-guard: the host off-guard for 1 minute (to everyone, not only the user and stand); two hosts from 13th",
            "9's surge (a condition moved to the host) isn't played"
        ]
    },
    "Internal Attack": {
        build(ctx) {
            const { lv, make, S } = ctx;
            const rounds10 = ctx.minutes(1);
            const sick = [["sickened", 1, rounds10]];
            const spells = [ctx.entry("Internal Attack", plan(ctx, "Internal Attack", { actions: 2, area: { type: "burst", value: lv >= 13 ? 10 : 5 }, effects: { failure: sick, criticalFailure: [...sick, ...(lv >= 17 ? [["slowed", 1, rounds10]] : [])] } }))];
            if (lv >= 5) {
                const inside = make("Internal Attack (surge)", { actions: 2, damage: S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true });
                inside.plan.needs = [{ target: { conditions: ["sickened"], within: 30 } }];
                spells.push(inside);
            }
            return { spells };
        },
        notes: [
            "1/13/17: 2 actions, a 5-ft burst (10 ft from 13th) of vapor within 30 ft, Fortitude negates: sickened 1 for 1 minute; 17th's slowed 1 for 1 minute on a critical failure. The drink-or-breathe price taken as met (it breathes)",
            "5: surge (2 actions) at a sickened (infected) creature: S bludgeoning basic Fortitude",
            "9 (can't eat or drink) isn't a fight's"
        ]
    },
    "Melting Dart": {
        build(ctx) {
            const { lv, make, D, halfS } = ctx;
            const acid = lv >= 5 ? { success: ["1d6[persistent,acid]"], criticalSuccess: ["1d6[persistent,acid]"] } : {};
            const clumsy = lv >= 13 ? { criticalSuccess: [["clumsy", 1, ctx.minutes(1)]] } : {};
            const ignore = (entry) => {
                if (lv >= 17) entry.plan.resolution.ignoreResistance = [{ value: 1e9, types: ["acid"] }];
                return entry;
            };
            const spells = [ignore(make("Melting Dart", { actions: 1, damage: D("acid"), kind: "acid", attackRoll: true, extra: acid, effects: clumsy }))];
            if (lv >= 9) spells.push(ignore(make("Melting Dart (surge, three darts)", { actions: 2, damage: halfS("acid"), kind: "acid", attackRoll: true, target: "up to 3 creatures", surge: true, extra: acid, effects: clumsy })));
            return { spells };
        },
        notes: [
            "automatic stand. 1: 1 action, 30 ft, D acid with a spell attack roll at the stand's attack; 5: 1d6 persistent acid on a hit; 13: clumsy 1 for 1 minute on a critical hit; 17: acid resistance ignored (resolution.ignoreResistance)",
            "9: surge, 2 actions (the Defaults' cost — classes.js's stand-automatic-dart had 1): three darts at up to 3 creatures, half S each, each its own attack roll",
            "the price (darts at anything moving) isn't played"
        ]
    },
    Dinosaurify: {
        build(ctx) {
            const { lv } = ctx;
            const stand = { speed: 40, charges: [{ name: "Dinosaurify (Leaping Charge)", actions: 1, strides: 1, strike: ctx.second.name, attackBonus: 1, oncePerTurn: true }] };
            const spells = [];
            if (lv >= 5) {
                const crit = lv >= 17 ? ctx.minutes(10) : ctx.minutes(1);
                const dino = (duration) => [["confused", null, duration], ["stupefied", 2, duration]];
                spells.push(ctx.entry("Dinosaurify (surge)", plan(ctx, "Dinosaurify (surge)", { actions: 2, save: "will", traits: ["incapacitation", "polymorph"], effects: { failure: dino(ctx.round1), criticalFailure: dino(crit) } }), { surge: true }));
                // (Bystanders — ctx.convert: a commoner the stand nicked turned into a dinosaur; a level −1 commoner critically fails the
                // stand DC's Will save on most rolls, so it lasts the minute: its jaws its fist's numbers, talon a die size smaller, Speed 40.)
                ctx.convert("Dinosaurify (surge, bystander dinosaur)", { from: "commoner", actions: 2, surge: true, lasts: lv >= 17 ? 100 : 10, initiative: "roll", as: (c) => ({ ...c, name: `Dinosaur (${c.name})`, speed: 40, strikes: [{ name: "Jaws", bonus: 4, melee: true, unarmed: true, damage: [{ dice: 1, die: 4, bonus: 0, type: "piercing" }] }, { name: "Talon", bonus: 4, melee: true, agile: true, unarmed: true, damage: [{ dice: 1, die: 3, bonus: 0, type: "slashing" }] }] }) });
            }
            // (9th: a raptor minion from a Tiny animal at hand — the Velociraptor, Creature 1: AC 16, HP 20, Fort +6, Ref +9, Will +4, Speed 40,
            // jaws +9 1d8+2, talon +9 agile 1d6+2; elite from 13th: +2 to them all, +10 HP; two from 17th. 2 actions to make, then a minion.)
            if (lv >= 9) {
                const elite = lv >= 13 ? 2 : 0;
                ctx.convert("Dinosaurify (raptor minion)", { from: "animal", count: lv >= 17 ? 2 : 1, actions: 2, lasts: 10, initiative: "minion", as: (c) => ({ ...c, name: `Raptor minion (${c.name})`, level: 1 + (elite ? 1 : 0), traits: ["animal", "dinosaur", "minion"], hp: { value: 20 + 5 * elite, max: 20 + 5 * elite }, ac: 16 + elite, saves: { fortitude: 6 + elite, reflex: 9 + elite, will: 4 + elite }, perception: 7 + elite, speed: 40, strikes: [{ name: "Jaws", bonus: 9 + elite, melee: true, unarmed: true, damage: [{ dice: 1, die: 8, bonus: 2 + elite, type: "piercing" }] }, { name: "Talon", bonus: 9 + elite, melee: true, agile: true, unarmed: true, damage: [{ dice: 1, die: 6, bonus: 2 + elite, type: "slashing" }] }] }) });
            }
            return { spells, stand };
        },
        notes: [
            "1: the stand in raptor form from the start (the 1 action to change not paid): Speed 40, its Strikes the same dice (jaws and talon as its fist and kick, finesse changing nothing at its Strength), and Leaping Charge once a turn: 1 action, a Stride and a talon (kick) Strike at +1",
            "5/17: surge (2 actions), Will (incapacitation): a dinosaur for 1 round (1 minute on a critical failure, 10 minutes from 17th) — played as confused (it attacks the nearest creature, its allies too) and stupefied 2; its jaws/talon Strikes and its dropped items aren't modelled; 'damaged by your stand this turn' isn't checked",
            "9's raptor minion and 13th's commands and elite minion aren't played: no summoned minion for a stand build in the engine (summons are made as reserves from a creature's conjure plan)",
            "with bystanders (-nc build): 5th a commoner turned dinosaur (surge, its own single use; the stand's nick on it isn't charged; a minute — a −1 commoner critically fails most rolls; played on the user's side, not 'the nearest creature'); 9th a raptor minion from a Tiny animal (Velociraptor numbers, elite from 13th, two from 17th; 2 actions, a minion that acts after the user with 2 actions — commanding it isn't charged)"
        ]
    }
};

// (stand10: the buffed rule text — keys are level steps, "price" for a Price line — and how the sim plays it.)
const BUFF_TEXT = {
    Shrink: {
        buff: {
            "1": "When your stand hits with a Strike, the target is off-guard to your stand until the end of your next turn as it starts to shrink (no save), and it attempts Fortitude: failure, enfeebled 1 and off-guard until the end of your next turn; critical failure, enfeebled 2 and off-guard as well, and it shrinks one size for 1 minute (enfeebled 2 for that minute). Crushing blows: your stand's Strikes deal 1d6 extra damage to a creature that's enfeebled from Shrink. Shrinking pinch: 1 action: your stand pinches a creature within 30 ft down to size without a Strike; the squeeze deals D bludgeoning damage, at most 2d6 (basic Fortitude); a failure makes it enfeebled as above (not off-guard), and a critical failure has the same effects as above.",
            "5": "A failure's enfeebled 1 now lasts 1 minute, and a critical failure also makes the target clumsy 1 for 1 minute. Crushing blows deal 2d6.",
            "9": "Surge: shrink yourself and your stand to Tiny for 10 minutes (+2 Stealth, can squeeze through any gap).",
            "13": "Shrinking now lasts 1 minute and stacks once more on a later hit (up to two sizes): a failure makes the target enfeebled 2. Crushing blows deal 3d6.",
            "17": "A creature that fails while already shrunk becomes Tiny and enfeebled 3 for 1 minute (incapacitation)."
        },
        buffNotes: ["Round 6 (trim): the pinch's damage D capped at 2d6 (from 9th it was 3d6–5d6); the pinch's failure no longer off-guard (enfeebled only; its critical failure unchanged); the 17th's second save keyed on clumsy — the critical failure's shrink (clumsy 1 for 1 minute) — instead of any enfeebled, as 'already shrunk' reads with the buffed failure only enfeebling", "Round 5: the pinch deals D bludgeoning (basic Fortitude, the rows on a failure); the crushing blows 2d6 from 5th (was 9th), 3d6 from 13th (was 17th)", "Round 5: the shrinking pinch — an at-will 1-action Fortitude save at 30 ft with the hit's failure/critical failure rows (1-round parts until the end of the user's next turn, the rest 1 minute); it sets up the crushing blows", "round 2: the crushing blows — 1d6 extra (2d6 from 9th, 3d6 from 17th) on a stand hit at a creature already enfeebled (strikeExtras when condition:enfeebled, any enfeebled read as Shrink's); a failure enfeebled 2 from 13th", "every stand hit: off-guard to the stand until the end of the user's next turn (strikeExtras offGuardToAttacker, the stand's own attacks); then the strikeExtras save as before: failure enfeebled 1 (1 minute from 5th) and off-guard (to everyone) until the end of the user's next turn; critical failure enfeebled 2 for 1 minute and off-guard, clumsy 1 for 1 minute from 5th; 17th's second save unchanged; size still not played"]
    },
    Aging: {
        buff: {
            "5": "Surge: your stand's touch ages a creature rapidly: S damage rolled with d4s instead of d6s (basic Fortitude); on a failure it's also drained 1 and slowed 1 for 1 round; on a critical failure it's slowed 1 for 1 minute.",
            "9": "Aura 30 ft.",
            "1": "1 action: aura of gas, 20-ft emanation, for 1 minute (concentrate): non-allies that start their turn in it are fatigued and enfeebled 1 until the end of their turn (Fortitude negates); allies are affected on a critical failure. Or, 1 action: your stand grips a creature within reach and withers it: D damage (basic Fortitude); enfeebled 1 until the end of your next turn on a failure, enfeebled 2 for 1 minute on a critical failure."
        },
        buffNotes: ["Round 4 (cap): the surge touch's S damage rolled with d4s (was d6s), basic Fortitude; the withering grip's failure enfeebled 1 lasts until the end of the user's next turn (was 1 minute); the critical failure's enfeebled 2 still 1 minute.", "round 2: the at-will withering grip (1 action, D force basic Fortitude, enfeebled 1/2 for 1 minute on a failure/critical failure; the stand's reach played at its 30 ft); the surge touch adds S force basic Fortitude (its conditions on a failure as before)", "the zone as before, now 1 action, 20 ft (30 from 9th), enfeebled 1 for a round beside the fatigue on each failed turn-start save; the surge touch's critical failure slowed 1 for 1 minute"]
    },
    Virus: {
        buff: {
            "1": "1 action: break a capsule in a 10-ft burst: persistent poison damage equal to D, and D poison at once as the virus bites (Fortitude negates); a failure also leaves the creature sickened 1, a critical failure sickened 2; including allies and you. Or, 1 action: your stand's fist breaks a capsule on one creature it hits or touches — only that creature is exposed: the bite's D poison is a basic Fortitude save, and a failure brings the persistent damage and sickened as above.",
            "5": "Persistent damage equals half S. The virus's bite at once deals half S.",
            "13": "1 action: kill your virus in one burst, ending its persistent damage on everyone there (the virus also dies in direct sunlight). The virus has adapted: a failure leaves a creature sickened 2, a critical failure sickened 3.",
            "17": "A failure also makes the creature drained 1, and a critical failure drained 2."
        },
        buffNotes: ["Round 6: the capsule punch one creature again at every level (round 5's 'up to two creatures' from 13th dropped): the engine's threat reading counts a two-target action as twice the user's damage, so the foes (a boss above all) focused the fragile user — at 17th the boss fights fell from +0.34 to −0.20 (boss-only check: one creature −0.203 → +0.422; the 17th drained 1 made no difference)", "Round 5: the bite at once half S from 5th (was 13th); from 13th sickened 2 on a failure and 3 on a critical failure (bursts and punch), the punch up to two creatures (one save each; undone in round 6); from 17th drained 1 on a failure too", "round 2: the capsule punch's bite a basic save (D poison, half on a success), its persistent damage and sickened on a failure as before; the bite at once half S from 13th (bursts and punch)", "persistent poison D at 1st (was 1d6), half S from 5th (was D); D poison at once on a failure (non-basic, extra row); sickened 1 on a failure, 2 on a critical failure; the price (allies and the user caught) kept for the bursts — the engine's areas catch allies in them; the new capsule punch is a 1-action single-target entry at the stand's 30 ft (its touch/Strike taken as made)"]
    },
    Mold: {
        buff: {
            "1": "1 action: release mold in a 30-ft emanation for 1 minute. A creature that moves to a lower position (stepping down, falling, going prone) takes D persistent poison. The mold also rots the footing: an enemy that starts its turn in the mold attempts a Reflex save; on a failure it slips downward (triggering the mold), and on a critical failure it also falls prone.",
            "5": "Prone counts as moving down, so the mold triggers when creatures fall prone. An enemy that fails its Reflex save against the rotten footing falls prone."
        },
        buffNotes: ["round 2: the release 1 action (was 2; the 60-ft surge still 2); prone on a failed slip save from 5th (was critical failure only)", "played as a zone about the user (30-ft emanation, 1 minute): a foe starting its turn in it saves (Reflex) — failure D persistent poison, critical failure the poison and prone; 9th's surge zone 60 ft with half S persistent; 17th slowed 1 for a round on a critical failure (the 'infected and low' state). The general 'moves downward' trigger has no engine event, so only the slip save sets it off; the price (it only triggers on downward movement) is kept as the slip being its only trigger; zones spare the user's side, so 13th's ally immunity is played from 1st (allies caught before 13th not played)"]
    },
    "Rage Field": {
        buff: {
            "1": "1 action: spread water in a 20-ft burst within 30 ft for 1 minute. Creatures in it see each other's strength and take –1 to Will saves against fear and emotion. An enemy that starts its turn in it is frightened 1, or frightened 2 on a critical failure (Will negates). Also, 1 action: goad a creature within 30 ft with its rival's strength: D mental damage (basic Will); on a failure it's frightened 1; on a critical failure frightened 2 and it must Strike the nearest creature on its next turn.",
            "5": "Surge: enemies in the area make a Will save or must Strike the nearest creature on their turn (incapacitation): 1 round on a failure, 1 minute on a critical failure. Allies who fail must save too. Your goad can target up to two creatures and deals half S mental damage. An enemy that fails its save against the field is frightened 2 (frightened 3 on a critical failure).",
            "13": "Allies get +2 to the save. Your goad can target up to three creatures, and a creature that fails against it must also Strike the nearest creature on its next turn.",
            "17": "Creatures that fail also continue fighting for 1 minute."
        },
        buffNotes: ["Round 5: the goad at up to 2 creatures from 5th, 3 from 13th (one save each); the goad half S mental from 5th (was D); the field's turn-start save frightened 2 / 3 from 5th (failure / critical failure); from 13th the goad's failure also confused for a round (the 'Strike the nearest creature')", "round 2: the at-will goad (1 action, 30 ft, D mental basic Will; failure frightened 1; critical failure frightened 2 and confused for 1 round — the 'Strike the nearest creature'); the field taken as reaching the creature", "the zone as before at 1 action, frightened 2 on a critical failure; the surge's confused 1 minute on a critical failure from 5th (was 17th), 1 minute on a failure from 17th; bystander commoners unchanged"]
    },
    "Devouring Flesh": {
        buff: {
            "1": "Slime armor, always on while you're conscious (no action): resistance to physical damage equal to your level; creatures that hit you in melee take acid damage equal to your level. Also, 1 action: the slime lashes a creature within 20 ft: D acid (basic Fortitude); on a failure it also takes 1d6 persistent acid and is sickened 1. Slime heals you for half the acid damage you deal with the lash and the engulf.",
            "5": "Slime can take a disguise shape. Surge: slime engulfs a creature you grab: S acid (basic Fortitude). The slime lash's persistent acid is 2d6.",
            "13": "Slime heals you for half the acid damage you deal. The slime lash splits: it can target up to two creatures within 20 ft, and its persistent acid is 3d6."
        },
        buffNotes: ["Round 5: the slime armor a passive effect from the fight's start (was a 1-action self effect; the same resistance and hit-back, all damage from 17th); the lash's sickened 1 from 1st (was 5th), its persistent acid 2d6 from 5th and 3d6 from 13th; from 13th the lash up to two creatures (one save each)", "round 2: the lash's range 20 ft, its persistent acid on a failure too; 13th's healing (half the acid dealt, the lash's and engulf's, as rolled) from 1st; 9th's engulf from 5th", "a new at-will 1-action slime lash (10 ft, D acid basic Fortitude, 1d6 persistent acid on a critical failure, sickened 1 on a failure from 5th) beside the unchanged armor and engulf"]
    },
    Parasite: {
        buff: {
            "1": "1 action: plant a parasite in a wounded creature: it bites as it burrows in for D piercing damage (basic Fortitude), and on a failure it takes hold. It's sickened 1 (sickened 2 on a critical failure) for 1 minute and can't reduce it below 1 while the parasite lives, and the parasite feeds: D persistent bleed damage; a Medicine check against your stand DC (2 actions) cuts it out.",
            "5": "The parasite grows into a talking face: the target takes –2 to Deception and Stealth and is enfeebled 1 while it lives. The parasite's feeding bleed equals half S. Surge: the parasite attacks: S piercing (basic Fortitude), and the target can't Recover from sickened.",
            "13": "Two parasites at once. The parasites have grown: a failure makes the target sickened 2 (sickened 3 on a critical failure), it can't reduce it below 2 while the parasite lives, and the parasite also makes it enfeebled 2."
        },
        buffNotes: ["Round 5: the planting deals D piercing (basic Fortitude) — the conditions and bleed still on a failure only; the feeding bleed half S from 5th (was D); from 13th sickened 2 / 3 on a failure / critical failure with a floor of 2, and 17th's enfeebled 2 from 13th", "round 2: D persistent bleed on a failed planting; 9th's surge attack from 5th", "the planting now 1 action, sickened 2 on a critical failure, enfeebled 1 for the minute from 5th (17th's enfeebled 2 replaces it); the floor, surge and two targets as before"]
    },
    "Pain Link": {
        buff: {
            "1": "1 action: link with a creature by touch for 1 minute: the link tears into its nerves for D mental damage (basic Will); on a failure it's linked. When you take damage, it takes half that much (no save). The host is off-guard to you and your stand while linked.",
            "5": "The host is also clumsy 1 while linked, flinching with your pain. Link two creatures.",
            "9": "Surge: you transfer one condition from you to the host (Will negates). A host takes the full damage you take.",
            "13": "Link three creatures."
        },
        buffNotes: ["round 2: the link deals D mental (basic Will; linked on a failure); two hosts from 5th, three from 13th; the share's full damage from 9th (was 17th)", "the link entry now from 1st at 1 action: off-guard (to everyone) for 1 minute on a failed Will save, clumsy 1 for the minute from 5th; the damage share still the Retributive Pain reaction"]
    },
    "Internal Attack": {
        buff: {
            "1": "1 action: your stand enters a creature that drinks your water or breathes your vapor (a 10-ft burst within 30 ft; your stand enters only the creatures you choose): sickened 1 for 1 minute and D bludgeoning as it thrashes inside (Fortitude negates; sickened 2 on a critical failure).",
            "5": "Surge (1 action): attack from inside: S bludgeoning (basic Fortitude); on a failure it's also slowed 1 for 1 round.",
            "13": "Fog area 20 ft."
        },
        buffNotes: ["round 2: the surge 1 action (was 2)", "1 action, 10-ft burst (20 from 13th) of foes only (the chosen creatures), D bludgeoning on a failure (non-basic, extra row), sickened 2 on a critical failure; the surge adds slowed 1 for a round on a failure"]
    },
    "Melting Dart": {
        buff: {
            "1": "1 action: dart, range 30 ft: D acid (attack roll), and 1d6 persistent acid on a hit.",
            "5": "Persistent acid on a hit: 1d6 (2d6 from 9th, 3d6 from 17th). Darts melt a creature's flesh: on a critical hit, clumsy 1 for 1 minute.",
            "9": "Surge (1 action): three darts at different targets, each half S.",
            "13": "On any hit, the target is clumsy 1 until the end of your next turn (1 minute on a critical hit)."
        },
        buffNotes: ["round 2: persistent acid on a hit from 1st (was 5th); 13th's critical-hit clumsy from 5th; from 13th clumsy 1 for a round on any hit", "persistent acid 2d6 from 9th and 3d6 from 17th; the three-dart surge 1 action (classes.js's old automatic dart had it so)"]
    },
    Dinosaurify: {
        buff: {
            "1": "Raptor form, Leaping Charge: 1 action: Stride up to 10 ft ignoring difficult terrain, then a jaws Strike with +1 circumstance to hit (once per round). In raptor form your stand's Strikes tear: 1d6 extra damage on a hit (2d6 from 9th, 3d6 from 17th).",
            "5": "Dinosaurified creature: failure, it becomes a dinosaur for 2 rounds; critical failure, 1 minute (rest of the surge unchanged).",
            "9": "Raptor minion: 2 actions: turn a Tiny animal within your stand's reach into a raptor minion with the Velociraptor's stats and the elite adjustments from GM Core (Creature 2) for 1 minute. It has the minion trait and takes 2 actions when you spend 1 action to command it. One raptor minion at a time.",
            "13": "When you Act Together, your stand can give one action of its turn to command a dinosaurified creature to Stride or Strike (it can attempt a Will save each time to refuse). You can keep two raptor minions."
        },
        buffNotes: ["round 2: the raptor's tearing — 1d6 extra (2d6 from 9th, 3d6 from 17th) on every stand Strike hit (strikeExtras; the raptor form taken as up from the start, as before)", "Leaping Charge's Strike is the stand's main (jaws, d10) Strike instead of the talon; the surge's failure lasts 2 rounds; the raptor minion elite from 9th (was 13th) and two from 13th (was 17th); the bystander dinosaur unchanged"]
    }
};
for (const [name, text] of Object.entries(BUFF_TEXT)) {
    const plain = AFFLICTION[name].build;
    Object.assign(AFFLICTION[name], text, { build: (ctx) => (ctx.buffed ? BUFFED[name](ctx) : plain(ctx)) });
}
