// Stand Abilities: fate theme (see index.js for the contract). The module's text (content/stand-abilities.md, 2026-11-24 buffs);
const B1 = new Set(String(globalThis.process?.env?.BAND1 ?? "").split(",").filter(Boolean));  // (2026-11-28, band trims)
// its Defaults: a surge costs 1 Stand Point and 2 actions unless listed, ranges are measured from the stand (played from the user, the
// stand beside it), untyped damage is force, saves against the stand DC.

// (2026-11-26, module a5ce436, Cole: "give 5th level surges for the late ones" — the 9th-level surges at 5th and new 9th steps; LATE,
// STAND_LATE_SURGE=0 for the text before it.)
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const TRAITS = ["concentrate", "occult", "stand"];

// A save plan of the stand's (its DC, its range).
function plan(ctx, name, { actions = 1, save = "will", area = null, target = "1 creature", range = ctx.range, damage = null, kind = null, basic = !!damage, extra = {}, effects = {}, traits = [] }) {
    const out = ctx.savePlan(name, { actions, traits: [...TRAITS, ...(kind ? [kind] : []), ...traits], area, target, range, save, attack: false, dc: ctx.dc, damage, basic, extra, effects });
    if (damage) out.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
    return out;
}
// No roll: the success row (the core's automatic check).
function automatic(out) {
    out.resolution.check = { roll: "automatic", statistic: "automatic" };
    return out;
}
function addRows(out, degrees, field, value) {
    for (const degree of degrees) {
        const row = out.resolution.outcomes[degree];
        row[field] = [...(row[field] ?? []), ...value];
    }
    return out;
}
// A typical moderate foe Strike's damage at a level (GM Core's moderate Strike damage, about 2 a level + 7).
const typicalHit = (lv) => Math.round(2 * lv + 7);
const SAVE_MODS = (value) => ["attack", "ac", "fortitude", "reflex", "will", "perception", "spell"].map((on) => ({ on, type: "status", value }));

export const FATE = {
    Calamity: {
        build(ctx) {
            const { lv, D, S } = ctx;
            const failed = lv >= 5 ? [["off-guard", null, { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" }]] : [];
            const effects = { failure: failed, criticalFailure: [...failed, ...(lv >= 17 ? [["prone", null, null], ["immobilized", null, ctx.round1]] : [])] };
            // (A reaction-timed entry the engine answers as the event comes — spells.js useReaction —: never cast on the user's own turn.)
            const answer = (name, damage, trigger, { surge = false, group = name } = {}) => {
                const out = plan(ctx, name, { save: "reflex", damage, kind: "bludgeoning", effects });
                out.activation.time = "reaction";
                out.targeting = { target: "the attacker", range: null, area: null };
                out.trigger = trigger;
                const entry = ctx.entry(name, out, { surge, actionType: "reaction" });
                entry.rechargeGroup = group;
                return entry;
            };
            const once = { formula: "1" };
            const spells = [
                answer("Calamity (minor accident)", D("bludgeoning"), { event: "attacked", reaction: true, free: true, recharge: once }, { group: "Calamity" }),
                answer("Calamity (minor accident, spell)", D("bludgeoning"), { event: "targeted-by", spells: true, traits: ["attack"], reaction: true, free: true, recharge: once }, { group: "Calamity" })
            ];
            if (lv >= 9) {
                spells.push(answer("Calamity (surge, major accident)", S("bludgeoning"), { event: "attacked", reaction: true }, { surge: true }));
                spells.push(answer("Calamity (surge, major accident, spell)", S("bludgeoning"), { event: "targeted-by", spells: true, traits: ["attack"], reaction: true }, { surge: true, group: "Calamity (surge, major accident)" }));
            }
            return { spells };
        },
        notes: [
            "1/5/17: passive, once a round (until the user's next turn — a recharge of 1): a creature that attacks the user (a Strike at it, before the roll) or aims a spell or attack-trait action at it takes D bludgeoning, basic Reflex; off-guard on a failure until its next turn (5th); prone and immobilized for 1 round on a critical failure (17th)",
            "moving toward the user and Seeking it aren't triggers the engine has: only attacks and spells aimed at the user. Attacks on the stand (its shared Hit Points) don't count — the price: it only hits creatures that pursue the user",
            "9: surge reaction (the user's reaction, a Stand Point): S bludgeoning, basic Reflex, on the same triggers — the engine answers with the free minor accident first and the surge when that's spent for the round",
            "13 (allies never targeted) has nothing to change: every accident is on the one creature"
        ]
    },
    "Redirect Misfortune": {
        build(ctx) {
            const { lv } = ctx;
            // (A resistance of about the share it moves, the share thrown at the attacker on an attack roll — the Will save's stand-in.)
            const value = lv >= 5 ? Math.round(0.75 * typicalHit(lv)) : Math.round(0.5 * typicalHit(lv));
            const reaction = { resistReaction: { name: "Redirect Misfortune", value, on: null, types: ["all-damage"], lashBack: { bonus: ctx.attack } }, resistUses: 2 };
            return { stand: reaction };
        },
        notes: [
            "reaction, surge, once a round: played on the stand (its hits are the user's shared Hit Points and the engine has it take most of the foes' attacks) as a reaction resistance with 2 uses — the 2 Stand Points, this build's only surge —, resistance about half a moderate foe's Strike (2×level+7; three quarters from 5th, where a failure moves all of it), and what it kept off thrown at the attacker on the stand DC's attack roll against its AC (the Will save's stand-in, the lash-back mechanism)",
            "the user's share is kept off whether or not the creature resists (the engine has no save-gated redirect); the creature it goes to is always the attacker, not any within 30 ft; hits on the user itself aren't redirected",
            "9 (a condition redirected), 13 (60 ft) and 17 (two creatures, the damage split) aren't played; the shaft-of-light price is taken as met"
        ]
    },
    "Doom Mark": {
        build(ctx) {
            const { lv } = ctx;
            // (Round 3 tone-down, ctx.buffed only: 17th's weakness half your level + 3 instead of your level.)
            const weakness = lv >= 17 ? (ctx.buffed ? Math.floor(lv / 2) + 3 : lv) : Math.max(2, Math.floor(lv / 2));
            const mark = (rounds, offGuard = true) => ctx.effectModel("Doom Mark", rounds, { weaknesses: [{ type: "all-damage", value: weakness, exceptions: [] }], conditions: lv >= 9 && offGuard ? [{ slug: "off-guard", value: null }] : [] });
            const effects = { "doom-mark-short": mark(1), "doom-mark-long": mark(10) };
            // (Round 3 tone-down, ctx.buffed: off-guard only on a failed save; one creature per action at 13th too.)
            if (ctx.buffed) Object.assign(effects, { "doom-mark-short-plain": mark(1, false), "doom-mark-long-plain": mark(10, false) });
            const build = (name, { actions, surge }) => {
                const out = plan(ctx, name, { actions, target: lv >= 13 && !ctx.buffed ? "up to 2 creatures" : "1 creature" });
                const plain = ctx.buffed ? "-plain" : "";
                addRows(out, ["success"], "nativeEffects", [{ uuid: (surge ? "doom-mark-long" : "doom-mark-short") + plain, label: "Doom Mark" }]);
                addRows(out, ["failure", "criticalFailure"], "nativeEffects", [{ uuid: "doom-mark-long", label: "Doom Mark" }]);
                const entry = ctx.entry(name, out, { surge });
                entry.effects = effects;
                return entry;
            };
            const spells = [build("Doom Mark", { actions: 1, surge: false })];
            if (lv >= 5) spells.push(build("Doom Mark (surge)", { actions: 2, surge: true }));
            return { spells };
        },
        buff: { "9": "A marked creature that failed its save is also off-guard to your stand.", "13": "Two marks (each mark takes its own action).", "17": "The weakness equals half your level + 3." },
        buffNotes: ["Round 3 (tone-down): 9th's off-guard only on a failed save (a success's mark gives the weakness alone); 13th's two marks no longer from one action (one creature per use); 17th's weakness half your level + 3 (11 at 17th, 13 at 20th) instead of your level; everything else as the module text."],
        notes: [
            "1/17: 1 action, 30 ft, Will: weakness to all damage of half its level (2 at least; its level from 17th) — until the start of the user's next turn on a success, 1 minute on a failure, none on a critical success",
            "5: surge (2 actions): 1 minute even on a success",
            "9: off-guard while marked — to everyone, not only the stand (no attacker-scoped off-guard for the stand in the engine)",
            "13: two marks played as up to 2 creatures for the one action; the price (one mark at a time, it fades when another is marked) isn't enforced — a later mark doesn't end the first"
        ]
    },
    Prophecy: {
        build(ctx) {
            const { lv } = ctx;
            if (lv < 5) return {};
            return { user: { allySaveReroll: { name: "Prophecy", within: 30, uses: lv >= 17 ? 3 : 2, ...(lv >= 17 ? { self: true } : {}) } } };
        },
        notes: [
            "1 (a yes-or-no question, 10 minutes) and 9 (an enemy plan revealed) aren't a fight's",
            "5: reaction, surge: an ally within 30 ft that fails a saving throw rerolls, keeping the better (allySaveReroll) — 2 uses, the 2 Stand Points; failed attack rolls and skill checks aren't rerolled (the engine's ally reroll is for saves)",
            "13: two allies — one reaction still rerolls one save here",
            "17: the once-a-day reroll for the user and every ally played as one more use, the user's own saves included",
            "the smoke's power foes only Strike, so it never fires there (no party saves); against foes with save effects it does"
        ]
    },
    "Soul Wager": {
        build(ctx) {
            const { lv } = ctx;
            const thisTurn = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" };
            const refuse = automatic(plan(ctx, "Soul Wager (challenge)", { actions: 1, effects: { success: [["frightened", 1, null], ["off-guard", null, thisTurn]] }, traits: ["emotion", "mental"] }));
            const spells = [ctx.entry("Soul Wager (challenge)", refuse)];
            if (lv >= 5) {
                const lost = [["stunned", 1, null]];
                const crit = [...lost, ...(lv >= 9 ? [["unconscious", null, ctx.minutes(1)]] : [])];
                spells.push(ctx.entry("Soul Wager (surge bet)", plan(ctx, "Soul Wager (surge bet)", { actions: 2, target: lv >= 17 ? "up to 3 creatures" : "1 creature", traits: lv >= 9 ? ["incapacitation", "mental"] : ["mental"], effects: { failure: lost, criticalFailure: crit } }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "1: the in-combat challenge (1 action, 30 ft): the foe taken to refuse — frightened 1, and off-guard until the start of the user's next turn (to everyone, standing in for 'your stand's next Strike against it this turn')",
            "the 1-minute bet and its -1 for a day aren't a fight's; 13 (a bet on the fight's outcome) isn't played",
            "5/9: surge (2 actions): the accepted bet played as a Will save against the stand DC (the opposed check's stand-in): a failure loses — stunned 1; from 9th a critical failure (the loss, then the failed Will save) also leaves it unconscious for 1 minute, the incapacitation trait on the whole surge; 17: up to three creatures"
        ]
    },
    "Shared Fate": {
        build(ctx) {
            const { lv } = ctx;
            const share = plan(ctx, "Shared Fate", { actions: 1, save: "fortitude", range: lv >= 9 ? "60 feet" : ctx.range, basic: true });
            share.activation.time = "reaction";
            share.resolution.sharedDamage = { rollOnce: true, components: [], triggeredDamage: { source: "caster-last-damage", fraction: 1, type: "force" } };
            const entry = ctx.entry("Shared Fate", share, { surge: true, actionType: "reaction" });
            const stand = { spells: [entry], spellPools: { [ctx.pool]: 2 } };
            if (lv >= 17) Object.assign(stand, { resistReaction: { name: "Shared Fate (half)", value: "half", on: null, types: null, free: true, foe: true, minDamage: Math.round(4.6 * lv) }, resistUses: 2 });
            return { stand };
        },
        notes: [
            "reaction, surge: played on the stand (its hits are the user's shared Hit Points; the engine has it take most attacks), with the build's 2 Stand Points as the stand's own pool (no other surge uses them) — the engine's Retributive Pain mechanism: when it takes a sixth of the Hit Points or more, the creature that dealt it takes the same damage (force), a basic save — Fortitude, the engine's roll, for the text's Will",
            "the creature is always the one that dealt the damage (the engine's mechanism), not any within 30 ft (60 from 9th); 5 (conditions shared) and 13 (two creatures) aren't played",
            "17: the user takes half — a free halving of a big hit (about a sixth of its Hit Points after halving) with 2 uses beside the 2 Stand Points, the engine's reactions not tying the two together"
        ]
    },
    "Debt Collector": {
        build(ctx) {
            const { lv, D } = ctx;
            const target = lv >= 13 ? "up to 2 creatures" : "1 creature";
            const demand = automatic(plan(ctx, "Debt Collector", { actions: 1, target, extra: { success: [D("force")] } }));
            const spells = [ctx.entry("Debt Collector", demand)];
            if (lv >= 5) spells.push(ctx.entry("Debt Collector (surge)", automatic(plan(ctx, "Debt Collector (surge)", { actions: 2, target, effects: { success: [["drained", lv >= 9 ? 2 : 1, null]] } })), { surge: true }));
            if (lv >= 17) {
                const soul = [["unconscious", null, ctx.minutes(1)]];
                spells.push(ctx.entry("Debt Collector (surge, soul)", plan(ctx, "Debt Collector (surge, soul)", { actions: 2, target, traits: ["incapacitation"], effects: { failure: soul, criticalFailure: soul } }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "1: 1 action, 30 ft: D force with no save (the debtor taken to pay in damage, not an item); the debt (it damaged the user or stand this fight, or lost a wager) taken as owed by any foe",
            "5/9: surge (2 actions), no save: drained 1 (2 from 9th, the organ); the lost bet it asks for taken as met",
            "13: two creatures; 17: surge (2 actions) the soul — Will (incapacitation), unconscious for 1 minute on a failure (damage wakes it, the engine's unconscious)"
        ]
    },
    "Fortune Directions": {
        build(ctx) {
            const { lv } = ctx;
            const bonus = lv >= 17 ? 2 : 1;
            const rounds = lv >= 9 ? 10 : 1;
            const area = { type: "emanation", value: lv >= 13 ? 30 : 5 };
            const effectPlan = (name, applications) => ({
                modelVersion: 13, source: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), uuid: null, type: "action" }, rank: 1,
                traits: [...TRAITS, "fortune"], activation: { time: "1", traits: [...TRAITS] }, automation: { level: "automatic" },
                targeting: { target: null, range: null, area }, trigger: { event: "use" },
                resolution: { kind: "effect", applications }
            });
            const lucky = ctx.effectModel("Fortune Directions (lucky)", rounds, { modifiers: ["attack", "fortitude", "reflex", "will"].map((on) => ({ on, type: "status", value: bonus })) });
            const luck = ctx.entry("Fortune Directions", effectPlan("Fortune Directions", [{ kind: "native-spell-effect", uuid: "fortune-lucky", label: "Fortune Directions (lucky)", recipients: "allies-in-area" }]));
            luck.effects = { "fortune-lucky": lucky };
            const spells = [luck];
            if (lv >= 5) {
                // (NCFILL 13th: Strikes against a creature in an unlucky square deal an extra weapon die — played as physical weakness 5 while unlucky.)
            const unlucky = ctx.effectModel("Fortune Directions (unlucky)", rounds, { modifiers: [{ on: "attack", type: "status", value: -2 }], ...((globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 13 ? { weaknesses: [{ type: "physical", value: 5 }] } : {}) });
                const plan2 = effectPlan("Fortune Directions (surge)", [{ kind: "native-spell-effect", uuid: "fortune-unlucky", label: "Fortune Directions (unlucky)", recipients: "enemies-in-area" }]);
                plan2.activation.time = "2";
                const surge = ctx.entry("Fortune Directions (surge)", plan2, { surge: true });
                surge.effects = { "fortune-unlucky": unlucky };
                spells.push(surge);
            }
            return { spells };
        },
        notes: [
            "1/17: 1 action: +1 status (+2 from 17th) to attack rolls and saves until the start of the user's next turn — on the user and its allies in its Melee (a 5-ft emanation, the stand beside it; other allies there too)",
            "5: surge (2 actions): the unlucky squares — the foes in its Melee take -2 status to their attack rolls for the same time, wherever they attack from",
            "9: both last 1 minute — as effects on those there as it's used, not areas they walk into or out of; 13: 30 ft, its allies and foes not standing apart",
            "the price (enemies can use the luck too) isn't played"
        ]
    },
    "Lucky Break": {
        build(ctx) {
            const { lv } = ctx;
            const stand = { critDowngrade: { name: "Lucky Break", dc: null, uses: lv >= 9 ? 2 : 1 } };
            const user = {};
            if (lv >= 5) Object.assign(user, { saveBoost: { name: "Lucky Break (surge)", toSuccess: true, recharge: "100" }, saveBoostUses: 1 });
            if (lv >= 13) user.allySaveBoost = { name: "Lucky Break (surge)", within: 30, toSuccess: true, recharge: "100" };
            return { stand, user };
        },
        notes: [
            "1/9: a critical hit becomes a normal hit, once (twice from 9th) a fight — on the stand, which takes most attacks and whose hits are the user's shared Hit Points (critDowngrade with uses)",
            "5: reaction, surge, once an hour (once a fight): the user's failed or critically failed save becomes a success (saveBoost toSuccess); other checks aren't played",
            "13: or an ally's within 30 ft (allySaveBoost) — one use a fight for either, sharing the recharge",
            "17 (a critical failure made a critical success once a day) isn't played: the engine holds one such boost a creature; the Saint's Corpse price taken as met",
            "the save boosts never fire against the smoke's Strike-only power foes; the critical-hit downgrade does"
        ]
    },
    "Cursed Wealth": {
        build(ctx) {
            const { lv } = ctx;
            const effects = { "cursed-wealth-1": ctx.effectModel("Cursed Wealth", 1, { modifiers: SAVE_MODS(-1) }), "cursed-wealth-10": ctx.effectModel("Cursed Wealth", 10, { modifiers: SAVE_MODS(-1) }), "cursed-wealth-crit": ctx.effectModel("Cursed Wealth", 10, { modifiers: SAVE_MODS(-2) }) };
            const coin = (name, actions, conditions = {}, surge = false) => {
                const out = plan(ctx, name, { actions, effects: conditions });
                if (!B1.has("CW1")) addRows(out, ["success"], "nativeEffects", [{ uuid: "cursed-wealth-1", label: "Cursed Wealth" }]);  // (CW1: a success shrugs the coin off — no penalty)
                addRows(out, ["failure"], "nativeEffects", [{ uuid: "cursed-wealth-10", label: "Cursed Wealth" }]);
                addRows(out, ["criticalFailure"], "nativeEffects", [{ uuid: "cursed-wealth-crit", label: "Cursed Wealth" }]);
                const entry = ctx.entry(name, out, { surge });
                entry.effects = effects;
                return entry;
            };
            const spells = [coin("Cursed Wealth", 1)];
            if (lv >= 5) {
                const weight = (rounds) => [["enfeebled", lv >= 17 ? 3 : 2, rounds], ...(lv >= 17 ? [["slowed", 1, ctx.round1]] : [])];
                spells.push(coin("Cursed Wealth (surge)", 2, { success: weight(ctx.round1), failure: weight(ctx.minutes(1)), criticalFailure: weight(ctx.minutes(1)) }, true));
            }
            return { spells };
        },
        notes: [
            "1: 1 action, Will: -1 status to attack rolls, AC, saves, Perception and spell DCs for 1 round on a success, 1 minute on a failure, -2 for 1 minute on a critical failure; the stand's hit this turn (or the accepted coin) taken as there; foes don't spend an Interact to throw the coin away",
            "5/17: surge (2 actions): the coin with the money's weight — enfeebled 2 (3 from 17th, and slowed 1 for 1 round) for as long as the curse lasts — played as its own coin and save rather than on a creature already cursed",
            "9 (the willing taker: no save) and 13 (the curse spreading with money) aren't a fight's"
        ]
    }
};

// (2026-11-24 stand10, Cole: "Buff all the stand abilities to be closer in power with each other. Dont lower any yet." — the buffed text,
// played when ctx.buffed; each ability's unbuffed build above is unchanged. BUFF_TEXT joins buff/buffNotes onto the definitions and routes
// build here when ctx.buffed.)
const unbuffed = (name, ctx) => FATE[name].build({ ...ctx, buffed: false });
const BUFFED = {
    Calamity(ctx) {
        const { lv, D, S } = ctx;
        const failed = [["off-guard", null, ctx.round1]];
        // (Round 5: accident-prone — clumsy 1 for 1 minute on a failure, clumsy 2 on a critical failure.)
        const effects = { failure: [...failed, ["clumsy", 1, ctx.minutes(1)]], criticalFailure: [...failed, ["clumsy", 2, ctx.minutes(1)], ...(lv >= 5 ? [["prone", null, null]] : []), ...(lv >= 17 ? [["immobilized", null, ctx.round1]] : [])] };
        const answer = (name, damage, trigger, { surge = false, group = name, rows = effects } = {}) => {
            const out = plan(ctx, name, { save: "reflex", damage, kind: "bludgeoning", effects: rows });
            out.activation.time = "reaction";
            out.targeting = { target: "the attacker", range: null, area: null };
            out.trigger = trigger;
            const entry = ctx.entry(name, out, { surge, actionType: "reaction" });
            entry.rechargeGroup = group;
            return entry;
        };
        const once = { formula: "1" };
        const spells = [
            answer("Calamity (minor accident)", D("bludgeoning"), { event: "attacked", reaction: true, free: true, recharge: once }, { group: "Calamity" }),
            answer("Calamity (minor accident, spell)", D("bludgeoning"), { event: "targeted-by", spells: true, traits: ["attack"], reaction: true, free: true, recharge: once }, { group: "Calamity" })
        ];
        // (a5ce436: the major accident at 5th; prone on a failure too from 9th.)
        if (lv >= (LATE ? 5 : 9)) {
            const rows = LATE && lv >= 9 ? { ...effects, failure: [...effects.failure, ["prone", null, null]] } : effects;
            spells.push(answer("Calamity (surge, major accident)", S("bludgeoning"), { event: "attacked", reaction: true }, { surge: true, rows }));
            spells.push(answer("Calamity (surge, major accident, spell)", S("bludgeoning"), { event: "targeted-by", spells: true, traits: ["attack"], reaction: true }, { surge: true, group: "Calamity (surge, major accident)", rows }));
        }
        // (Round 2: misfortune follows the stand too — its own free minor accidents, once a round, on creatures that attack it.)
        const standSpells = [
            answer("Calamity (minor accident, stand)", D("bludgeoning"), { event: "attacked", reaction: true, free: true, recharge: once }, { group: "Calamity (stand)" }),
            answer("Calamity (minor accident, stand, spell)", D("bludgeoning"), { event: "targeted-by", spells: true, traits: ["attack"], reaction: true, free: true, recharge: once }, { group: "Calamity (stand)" })
        ];
        // (Round 5: the bad omen — 1 action, a creature within 30 ft, D bludgeoning basic Reflex with the accidents' rows.)
        spells.push(ctx.entry("Calamity (bad omen)", plan(ctx, "Calamity (bad omen)", { actions: 1, save: "reflex", target: lv >= 5 ? "up to 2 creatures" : "1 creature", damage: D("bludgeoning"), kind: "bludgeoning", effects })));
        return { spells, stand: { spells: standSpells } };
    },
    "Redirect Misfortune"(ctx) {
        const out = unbuffed("Redirect Misfortune", ctx);
        // (2026-11-26, Cole: "Fix Redirect": the redirect on the user, where the foes' hits land — on the stand it fired about 0.1 times a
        // fight —; 6 uses a fight (4 free + the 2 Stand Points), the first four free a day over tools/stand-day.mjs's days.)
        out.user = { ...(out.user ?? {}), resistReaction: out.stand.resistReaction, resistUses: 6 };
        delete out.stand.resistReaction;
        delete out.stand.resistUses;
        // (Round 2: the gathered misfortune cast off — 1 action, 30 ft, D force basic Will.)
        const thrown = plan(ctx, "Redirect Misfortune (cast off)", { actions: 1, damage: ctx.D("force"), kind: "force", effects: { failure: [["off-guard", null, ctx.round1]], criticalFailure: [["off-guard", null, ctx.minutes(1)]] } });
        out.spells = [ctx.entry("Redirect Misfortune (cast off)", thrown)];
        return out;
    },
    Prophecy(ctx) {
        const { lv } = ctx;
        // (Round 2: the glimpse 30 ft and 1 minute from 1st, +1 to attack rolls too.)
        const area = { type: "emanation", value: 30 };
        const foresight = ctx.effectModel("Prophecy (foreseen)", 10, { modifiers: ["attack", "ac"].map((on) => ({ on, type: "status", value: 1 })) });  // (Round 3 tone-down: +1 at every level — the +2 from 13th cut. Round 4 cap: saves dropped — the reroll covers them.)
        const glimpse = ctx.entry("Prophecy (glimpse)", {
            modelVersion: 13, source: { name: "Prophecy (glimpse)", slug: "prophecy-glimpse", uuid: null, type: "action" }, rank: 1,
            traits: [...TRAITS, "fortune"], activation: { time: "1", traits: [...TRAITS] }, automation: { level: "automatic" },
            targeting: { target: null, range: null, area }, trigger: { event: "use" },
            resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: "prophecy-foreseen", label: "Prophecy (foreseen)", recipients: "allies-in-area" }] }
        });
        glimpse.effects = { "prophecy-foreseen": foresight };
        const reroll = lv >= 5 ? { name: "Prophecy", within: 30, uses: 4, free: true, perRound: true, ...(lv >= 17 ? { self: true } : {}) } : { name: "Prophecy", within: 30, uses: 2 };
        return { spells: [glimpse], user: { allySaveReroll: reroll } };
    },
    "Shared Fate"(ctx) {
        const out = unbuffed("Shared Fate", ctx);
        out.stand.spells = out.stand.spells.map((each) => ({ ...each, pool: null }));
        // (The wound share: 1 action, D force basic Will — 'the Hit Points you're missing, up to D' taken as at least D: the user is
        // hurt by the time it's worth a turn.)
        // (Round 2: two creatures from 5th — 13th's step moved —, the cap S from 13th.)
        const wound = plan(ctx, "Shared Fate (wound share)", { actions: 1, target: ctx.lv >= (B1.has("SF1") || B1.has("SF2") || B1.has("SF3") ? 9 : 5) ? "up to 2 creatures"  /* (SF1: two creatures from 9th, was 5th) */ : "1 creature", damage: B1.has("SF2") || B1.has("SF3") ? (ctx.lv >= 17 ? ctx.S("force") : ctx.lv >= 9 ? ctx.halfS("force") : ctx.D("force")) : ctx.lv >= 13 ? ctx.S("force") : ctx.lv >= 5 ? ctx.halfS("force") : ctx.D("force"),  /* (SF2: SF1 + the cap half S from 9th, S from 17th) */ kind: "force", effects: B1.has("SF3") ? { criticalFailure: [["sickened", 1, null]] } : { failure: [["sickened", 1, null]], criticalFailure: [["sickened", 2, null]] } });  // (SF3: SF2 + sickened 1 only on a critical failure) (Round 5: sickened 1/2 on a failure/critical failure; Round 6: the 3 creatures at 17th cut, back to 2.)
        out.spells = [...(out.spells ?? []), ctx.entry("Shared Fate (wound share)", wound)];
        // (2026-11-26, Cole: "run them in a 4 fight day": the halving on the user, where the foes' hits land — on the stand it never fired
        // (0 in 40 fights) —, for a hit of a typical foe Strike's size or more (typicalHit), not 4.6×level; 2 a day from 9th, 4 from 17th —
        // a fight's uses here, carried over a day by tools/stand-day.mjs.)
        if (ctx.lv >= 9) out.user = { ...(out.user ?? {}), resistReaction: { name: "Shared Fate (half)", value: "half", on: null, types: null, free: true, foe: true, minDamage: typicalHit(ctx.lv) }, resistUses: ctx.lv >= 17 ? 4 : 2 };
        return out;
    },
    "Debt Collector"(ctx) {
        const { lv, D } = ctx;
        const out = unbuffed("Debt Collector", ctx);
        const target = lv >= 13 ? "up to 2 creatures" : "1 creature";
        const demand = automatic(plan(ctx, "Debt Collector", { actions: 1, target, extra: { success: [D("force")] }, effects: { success: [["frightened", 1, null]] } }));
        out.spells = out.spells.map((each) => (each.name === "Debt Collector" ? ctx.entry("Debt Collector", demand) : each));
        return out;
    },
    "Lucky Break"(ctx) {
        const { lv } = ctx;
        const stand = { critDowngrade: { name: "Lucky Break", dc: null } };
        const user = {};
        if (lv >= 5) Object.assign(user, { saveBoost: { name: "Lucky Break (surge)", toSuccess: true, recharge: "1" }, saveBoostUses: 2 });
        if (lv >= 13) user.allySaveBoost = { name: "Lucky Break (surge)", within: 30, toSuccess: true, recharge: "1" };
        // (Round 2: strange luck, always on — +1 status to attack rolls, AC and saves for the user and the stand, +2 from 17th.)
        const luck = () => ctx.effectModel("Lucky Break (strange luck)", Infinity, { modifiers: ["attack", "ac", "fortitude", "reflex", "will"].map((on) => ({ on, type: "status", value: lv >= 17 ? 2 : 1 })) });
        user.passiveEffects = [luck()];
        stand.passiveEffects = [luck()];
        // (Round 5: the jinx — 1 action, 30 ft, Will: a failure -1 status to attack rolls, AC and saves for 1 minute, -2 on a critical failure; Round 6: the critical failure -1 too.)
        const sour = (value) => ["attack", "ac", "fortitude", "reflex", "will"].map((on) => ({ on, type: "status", value }));
        const jinx = plan(ctx, "Lucky Break (jinx)", { actions: 1, traits: ["misfortune"] });
        addRows(jinx, ["success"], "nativeEffects", [{ uuid: "lucky-break-jinx-brush", label: "Lucky Break (jinx)" }]);
        addRows(jinx, ["failure"], "nativeEffects", [{ uuid: "lucky-break-jinx", label: "Lucky Break (jinx)" }]);
        addRows(jinx, ["criticalFailure"], "nativeEffects", [{ uuid: "lucky-break-jinx-crit", label: "Lucky Break (jinx)" }]);
        // (2026-11-27 NCFILL: 9th — a critical failure against the jinx also falls prone.)
        if ((globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 9) addRows(jinx, ["criticalFailure"], "effects", [{ kind: "condition", slug: "prone", value: null, duration: null }]);
        const entry = ctx.entry("Lucky Break (jinx)", jinx);
        entry.effects = { "lucky-break-jinx-brush": ctx.effectModel("Lucky Break (jinx)", 1, { modifiers: sour(-1) }), "lucky-break-jinx": ctx.effectModel("Lucky Break (jinx)", 10, { modifiers: sour(-1) }), "lucky-break-jinx-crit": ctx.effectModel("Lucky Break (jinx)", 10, { modifiers: sour(-1) }) };
        return { stand, user, spells: [entry] };
    },
    "Fortune Directions"(ctx) {
        const { lv } = ctx;
        // (Round 2: 13th's 30 ft from 1st, 9th's 1 minute from 5th; the rest as the plain build.)
        const bonus = lv >= 17 ? 2 : 1;
        const rounds = lv >= 5 ? 10 : 1;
        const area = { type: "emanation", value: 30 };
        const effectPlan = (name, applications) => ({
            modelVersion: 13, source: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), uuid: null, type: "action" }, rank: 1,
            traits: [...TRAITS, "fortune"], activation: { time: "1", traits: [...TRAITS] }, automation: { level: "automatic" },
            targeting: { target: null, range: null, area }, trigger: { event: "use" },
            resolution: { kind: "effect", applications }
        });
        const lucky = ctx.effectModel("Fortune Directions (lucky)", rounds, { modifiers: (B1.has("FD1") && lv < 9 ? ["attack"] : ["attack", "fortitude", "reflex", "will"]).map  /* (FD1: luck to attack rolls only until 9th) */((on) => ({ on, type: "status", value: bonus })) });
        const luck = ctx.entry("Fortune Directions", effectPlan("Fortune Directions", [{ kind: "native-spell-effect", uuid: "fortune-lucky", label: "Fortune Directions (lucky)", recipients: "allies-in-area" }]));
        luck.effects = { "fortune-lucky": lucky };
        const spells = [luck];
        if (lv >= 5) {
            const unlucky = ctx.effectModel("Fortune Directions (unlucky)", rounds, { modifiers: [{ on: "attack", type: "status", value: -2 }] });
            const plan2 = effectPlan("Fortune Directions (surge)", [{ kind: "native-spell-effect", uuid: "fortune-unlucky", label: "Fortune Directions (unlucky)", recipients: "enemies-in-area" }]);
            plan2.activation.time = "2";
            const surge = ctx.entry("Fortune Directions (surge)", plan2, { surge: true });
            surge.effects = { "fortune-unlucky": unlucky };
            spells.push(surge);
        }
        // (NCFILL 9th: once a round, standing lucky, a critical hit against you becomes a normal hit — taken as always lucky.)
        const fd9 = (globalThis.process?.env?.NCFILL ?? "1") === "1" && lv >= 9 ? { critDowngrade: { name: "Fortune Directions", dc: null } } : null;
        return { spells, ...(fd9 ? { user: fd9, stand: { ...fd9 } } : {}) };
    },
    "Soul Wager"(ctx) {
        const out = unbuffed("Soul Wager", ctx);
        // (Round 2: the refusal's off-guard until the end of the user's next turn — a round, not this turn.)
        const refuse = automatic(plan(ctx, "Soul Wager (challenge)", { actions: 1, effects: { success: [["frightened", 1, null], ["off-guard", null, ctx.round1]] }, traits: ["emotion", "mental"] }));
        out.spells = out.spells.map((each) => (each.name === "Soul Wager (challenge)" ? ctx.entry("Soul Wager (challenge)", refuse) : each));
        return out;
    }
};
const BUFF_TEXT = {
    Calamity: {
        buff: {
            "1": "A creature that moves toward you, targets you or Seeks you takes D bludgeoning from a minor accident (basic Reflex), once per round; on a failure it's also off-guard until the end of its next turn and clumsy 1 for 1 minute (clumsy 2 on a critical failure). Misfortune follows your stand too: a creature that targets your stand suffers its own minor accident the same way (once per round, apart from yours). Bad omen: 1 action: you mark a creature within 30 ft for misfortune and an accident strikes it at once: D bludgeoning (basic Reflex), with the same effects as a minor accident on a failure or critical failure.",
            "5": "A creature that critically fails also falls prone. Your bad omen can mark two creatures at once.",
            "17": "A critical failure also leaves the creature immobilized for 1 round."
        },
        buffNotes: ["Round 5: the bad omen — an at-will 1-action entry, 30 ft, D bludgeoning basic Reflex (up to 2 creatures from 5th); every accident (omen and reactions) now also clumsy 1 for 1 minute on a failure, clumsy 2 on a critical failure; off-guard 1 round on a failure, prone on a critical failure from 5th (immobilized 1 round from 17th)", "round 2: misfortune follows the stand as well: the stand carries its own free minor accidents (attacked / attack spells at it), once a round, apart from the user's", "off-guard on a failure from 1st (was 5th, until the end of its next turn — one round), prone on a critical failure from 5th (was 17th; 17th keeps the immobilized); triggers unchanged (attacks and attack spells aimed at the user)"]
    },
    "Redirect Misfortune": {
        buff: {
            "1": "Reaction, once per round: when you take damage, half goes to a creature within 30 ft instead (Will negates). The first four times each day cost no Stand Point; after that it's a surge. Also, 1 action: cast off the misfortune you've gathered onto a creature within 30 ft: D damage (basic Will); on a failure it's off-guard until the end of your next turn, on a critical failure for 1 minute."
        },
        buffNotes: ["round 2: the 1-action cast-off (30 ft, D force basic Will, off-guard 1 round on a failure, 1 minute on a critical failure)", "the stand's reaction resistance now 6 uses a fight (4 free + the 2 Stand Points), the rest unchanged"]
    },
    Prophecy: {
        buff: {
            "1": "10 minutes: ask one yes-or-no question about the next hour; the GM answers truthfully. In combat, 1 action: glimpse what's coming — you, your stand and allies within 30 ft gain a +1 status bonus to attack rolls and AC for 1 minute. Reaction, surge: when an ally within 30 ft fails a check, it rerolls and uses the higher result.",
            "5": "The first four rerolls each day cost no Stand Point (still once per round).",
            "9": "The GM reveals one enemy plan."
        },
        buffNotes: ["Round 4 (cap): the glimpse no longer adds to saves (+1 status to attack rolls and AC only; the reroll is the save help).", "Round 3 (tone-down): the glimpse stays +1 at every level (the +2 from 13th cut); from 5th the free reroll 4 uses a fight (was unlimited, once a round).", "round 2: the glimpse 30 ft (allies-in-area), 1 minute from 1st (was 9th), +1 to attack rolls as well (+2 from 13th)", "1-action glimpse: +1 status AC and saves (+2 from 13th) for 1 round (1 minute from 9th) on the user, the stand and allies in a 5-ft emanation (allies-in-area); the ally save reroll from 1st (2 uses, the Stand Points), from 5th free once a round (allySaveReroll free + perRound); attack rolls and skill checks still not rerolled (the engine's reroll is for saves)"]
    },
    "Shared Fate": {
        buff: {
            "1": "Reaction, once per round: when you take damage, a creature within 30 ft takes the same damage (basic Will). It no longer costs a Stand Point. Also, 1 action: you share your wounds with a creature within 30 ft: it takes force damage equal to the Hit Points you're missing, up to D (basic Will); on a failure it also shares your sickness: sickened 1 (sickened 2 on a critical failure).",
            "5": "Surge: you share your conditions too. The wound share's cap is half S, and it can hit two creatures.",
            "13": "Two creatures. The wound share's cap is S.",
            "9": "Range 60 ft. Twice per day, when you share damage you take only half of it.",
            "17": "You take half the damage you share, four times per day."
        },
        buffNotes: ["Round 6: the wound share's third creature at 17th cut (two creatures from 5th at every level); L20 +0.55→+0.49, L17 +0.22→+0.15 (spots); a once-a-day halving at 9th was tried and measured no change at L9 (+0.387), so not kept", "Round 5: the wound share's failure sickened 1, critical failure sickened 2 (the 'sickness shared'); up to 3 creatures from 17th", "round 2: the wound share up to 2 creatures from 5th, its cap S from 13th (the missing-HP cap still taken as reached); the reaction's two creatures (13th) still not played", "the stand's Retributive Pain entry without a pool (once a round, its reaction); still the engine's trigger (a sixth of the Hit Points or more, the creature that dealt it, basic Fortitude for Will); the wound share a 1-action D force (half S from 5th) basic Will (the missing-HP cap taken as reached); 17th's halving (the free half-resistance on a big hit, as the unbuffed encoding plays it) from 9th with 2 uses, 4 from 17th"]
    },
    "Debt Collector": {
        buff: {
            "1": "1 action: demand payment: a creature that owes you (it lost a Soul Wager, took your money, agreed to a debt, or damaged you or your stand this fight) hands over an item of your choice, or takes D damage with no save and is frightened 1 by the collection."
        },
        buffNotes: ["the demand also leaves the debtor frightened 1 (no save, as the damage)"]
    },
    "Lucky Break": {
        buff: {
            "1": "Reaction: once per round, a critical hit against you or your stand becomes a normal hit. Also, 1 action: jinx a creature within 30 ft, turning your luck against it (misfortune, Will save): on a success it takes a –1 status penalty to attack rolls, AC and saving throws until the end of its next turn; on a failure or critical failure for 1 minute.",
            "5": "Reaction, surge (once per round): your failed check becomes a success.",
            "17": "Turn a critical failure into a critical success once per day. Strange luck grows: +2 status bonus.",
            "price": "A Saint's Corpse part or blessed item must be carried, and the luck arrives in strange ways: while you carry it, you and your stand gain a +1 status bonus to attack rolls, AC and saving throws as blows and spells go strangely astray (or strangely true)."
        },
        buffNotes: ["Round 6: the jinx's critical failure is -1 for 1 minute like a failure (the -2 cut; average +0.274 over the cap)", "Round 5: the jinx — an at-will 1-action Will save at a creature within 30 ft: -1 status to attack rolls, AC and saves for 1 round on a success, 1 minute on a failure, -2 for 1 minute on a critical failure (nativeEffects, as Cursed Wealth's coin)", "round 2: strange luck — a passive +1 status to attack rolls, AC and saves (+2 from 17th) on the user and the stand for the fight (passiveEffects); 17th's critical-failure-to-critical-success still not played", "critDowngrade on the stand with no use limit — its reaction, once a round; the save boost 2 uses (the Stand Points) with a 1-round recharge (was once a fight), the ally's from 13th the same"]
    },
    "Fortune Directions": {
        buff: {
            "1": "1 action: learn your lucky direction: you, your stand and allies within 30 ft gain +1 status bonus to attack rolls and saves until the start of your next turn.",
            "5": "Surge: you know which squares within 30 ft are unlucky for enemies (–2 status to their attacks from them). Lucky and unlucky areas last 1 minute."
        },
        buffNotes: ["round 2 (first buff): 13th's 30-ft area from 1st, 9th's 1-minute duration from 5th — the lucky effect on allies in a 30-ft emanation, the unlucky one on foes there; the price (enemies benefit too) still not played"]
    },
    "Soul Wager": {
        buff: {
            "1": "1 minute: propose a bet, settled by an opposed check you both agree on. If the target agrees and loses, it takes –1 to checks against you for 1 day. In combat, 1 action: challenge a creature within 30 ft; if it refuses, it is frightened 1 and off-guard to your stand until the end of your next turn."
        },
        buffNotes: ["round 2 (first buff): the refusal's off-guard lasts until the end of the user's next turn (was the stand's next Strike this turn) — still off-guard to everyone in the engine"]
    }
};
for (const [name, text] of Object.entries(BUFF_TEXT)) {
    const plain = FATE[name].build;
    Object.assign(FATE[name], text, { build: (ctx) => (ctx.buffed ? BUFFED[name](ctx) : plain(ctx)) });
}
