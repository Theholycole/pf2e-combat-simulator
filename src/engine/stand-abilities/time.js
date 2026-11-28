// Stand Abilities: time theme (see index.js for the contract).
// (2026-11-24: the five Time abilities of content/stand-abilities.md, buffed wording.)

const TRAITS = ["concentrate", "occult", "stand"];
const B1 = new Set(String(globalThis.process?.env?.BAND1 ?? "").split(",").filter(Boolean));  // (2026-11-28, band batch candidates)
// A condition-only save plan as a ready entry (no damage — make() needs damage).
const condition = (ctx, name, { actions = 2, save = "will", target = "1 creature", range = ctx.range, area = null, effects = {}, traits = [], surge = false, pool = null }) => {
    const plan = ctx.savePlan(name, { actions, traits: [...TRAITS, ...traits], area, target, range, save, dc: ctx.dc, effects });
    return ctx.entry(name, plan, { surge, pool });
};
// "No save": damage on every degree, a save the creature can't make (DC 100 — a critical failure, a failure on a natural 20).
const noSave = (ctx, name, { actions = 1, damage, target = "1 creature", range = ctx.range, effects = {}, pool = null, surge = false }) => {
    const plan = ctx.savePlan(name, { actions, traits: TRAITS, target, range, save: "fortitude", dc: 100, basic: false, extra: { failure: [damage], criticalFailure: [damage] }, effects });
    return ctx.entry(name, plan, { surge, pool });
};

// A Strike of the stand's with a rider (abilities.js strike-activity shape) — the buffed Time Skip's erased-moment Strike.
const strikeActivity = (name, more = {}) => ({
    name, actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["stand"],
    riderSpell: null, ...more,
    onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, ...(more.onHit ?? {}) }
});

// The stand starts as a copy of its user: fields that are the user's alone (its reactions, effects) taken off it again.
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const userOnly = (user) => Object.fromEntries(Object.keys(user).filter((key) => key !== "initiativeBonus").map((key) => [key, null]));

export const TIME = {
    "Time Skip": {
        build(ctx) {
            const user = {
                // (1st: reaction, surge — the attack resolves against the old space and misses: +50 AC against that Strike, twice a fight.)
                acReaction: { name: "Time Skip", when: "targeted", value: 50, uses: B1.has("TS1") || B1.has("TS2") ? 3 : 2 }  // (TS1: three free skips, was two)
            };
            // (5th: initiative rolled twice, the higher kept — about +3.)
            if (ctx.lv >= 5) user.initiativeWarning = { name: "Time Skip (glimpse)", value: 3, free: true, self: true };
            // (17th: once a day, an enemy's d20 rerolled, the lower kept — on a foe's successful save against the party.)
            if (ctx.lv >= 17) user.saveCurse = { name: "Time Skip (reroll)" };
            if (ctx.buffed && ctx.lv >= 5) {
                // (Buffed 5th: surge, 1 action — the stand's Strike through the erased moment, S damage, the target off-guard; the reaction's
                // first two skips free, so the 2 Stand Points are the stand's.)
                const stand = { ...userOnly(user), strikeActivities: [strikeActivity("Time Skip (surge, erased moment)", { damage: ctx.S("bludgeoning"), pool: ctx.pool, ...(B1.has("TS2") ? { offGuard: true } : {}) })]  /* (TS2: TS1 + the target off-guard to the erased-moment Strike) */, spellPools: { [ctx.pool]: 2 } };
                return { user, stand };
            }
            return { user, stand: userOnly(user) };
        },
        buff: {
            "1": "Reaction: when an attack or effect targets you, Stride up to half your Speed; the attack resolves against your old space and misses. Creatures don't see you move. Only works against attacks you can see, and you can't attack or take reactions until your next turn. Your first two skips each combat cost no Stand Point; after that, Time Skip is a surge.",
            "5": "At the start of each combat, glimpse the future: roll initiative twice and take the higher. Surge, 1 action: erase the next moment, and your stand Strikes through it. The Strike deals S damage instead of its normal damage, and the target can't use reactions against it."
        },
        buffNotes: [
            "1st: the two free skips are the 2 acReaction uses the unbuffed build already played (it counted them as the Stand Points)",
            "5th: the erased-moment Strike as a Strike activity of the stand's with S bludgeoning in place of its damage and off-guard (+2), its 2 uses the 2 Stand Points (the stand's pool — the reaction no longer draws on them); 'no reactions against it' not played (foes have none against the stand here)",
            "Round 3 (tone-down, Δ +0.34): the erased-moment Strike no longer makes the target off-guard (offGuard dropped)"
        ],
        notes: [
            "1st: played as the user's reaction to being targeted by a Strike: +50 AC against it (a miss), its 2 uses a fight its 2 Stand Points (acReaction uses); spells and other effects that target it aren't skipped; the Stride itself isn't played (range bands); 'can't attack or take reactions until your next turn' not played (the user rarely does either)",
            "5th: roll initiative twice, the higher kept, played as +3 to its own initiative (initiativeWarning self)",
            "9th: off-guard after a skip not played — the skip happens on a foe's turn, so 'this turn' rarely reaches the stand's Strikes",
            "13th: full Speed and carrying an ally: no change in the band model",
            "17th: once a day after an enemy's d20 — played on a foe's successful save against the party, rerolled with the worse kept (saveCurse, once a fight); its attack rolls aren't"
        ]
    },
    "Time Stop": {
        build(ctx) {
            const charges = ctx.lv >= 17 ? 3 : ctx.lv >= 9 ? 2 : 1;
            const actions = ctx.lv >= 17 ? 3 : ctx.lv >= 9 ? 2 : 1;
            // (Free action, a charge: the stopped-time actions as the stand's Strikes, the targets off-guard to them — +2 to hit.)
            const stand = {
                multiStrikes: [{ name: "Time Stop", actions: 0, strikes: Array(actions).fill(null), pool: "time-stop", oncePerTurn: true, penalty: -2 }],
                spellPools: { "time-stop": charges }
            };
            // (2026-11-26, module a5ce436: surge, free action: regain 1 spent charge, not in a round a charge was used — played as the same stopped time paid with a
            // Stand Point, the name shared so once a turn holds across both.)
            if (LATE) {
                stand.multiStrikes.push({ ...stand.multiStrikes[0], strikes: [...stand.multiStrikes[0].strikes], pool: ctx.pool });
                stand.spellPools[ctx.pool] = 2;
            }
            const user = ctx.lv >= 5 ? { initiativeBonus: 1 } : {};
            return { stand, user };
        },
        notes: [
            "Charges 1/2/3 a fight (10-minute recovery) as the stand's own pool; no Stand Points",
            "Each charge played as a free action of the stand's (once a turn): its 1/2/3 stopped-time actions as that many Strikes (its best Strike), the targets off-guard (+2 to hit, multi-strike penalty −2); the multiple attack penalty rises as usual; Strides or other actions in stopped time not played",
            "5th: the reaction use before a creature's action not played (no 'before an action' reaction hook); +1 status to initiative as the user's initiativeBonus",
            "13th: moving through enemies' spaces with no reactions: no change in the band model (stopped-time Strikes provoke nothing anyway)"
        ]
    },
    "Rewind": {
        build(ctx) {
            const user = {
                // (A creature within 30 ft rerolls and must use the second result. The 2 Stand Points: one on an ally's failed save — or its own
                // from 5th —, one on a foe's successful save; from 13th a free one more every 10 minutes.)
                allySaveReroll: { name: "Rewind", within: ctx.lv >= 13 ? 60 : 30, uses: ctx.lv >= 13 ? 2 : 1, keep: "new", ...(ctx.lv >= 5 ? { self: true } : {}) },
                saveCurse: { name: "Rewind (foe)" }
            };
            // (Buffed 1st: once a round, free — a Strike that hits the user or an ally within 30 ft rerolled, the second result kept: played as
            // +5 AC once it hits — the hits a reroll would likely miss —, the user's own from 5th.)
            // (Round 3: the free use only a heartbeat back — +2 AC after the hit; the full reroll stays the surge.)
            // (Round 4: the free heartbeat from 5th, not 1st — twice per combat measured far under the band (Δ +0.09 at 20), and the engine's
            // ally +AC reaction has no per-fight count.)
            // (Round 5: three times per combat — allyAcReaction's uses, actions.js.)
            if (ctx.buffed && ctx.lv >= 5) user.allyAcReaction = { name: "Rewind (attack)", value: 2, within: ctx.lv >= 13 ? 60 : 30, uses: 3 };
            // (Round 6, Cole's pick 2026-11-25, the default; REWIND_VARIANT=free3 for the old three-free-uses build: the heartbeat costs a Stand Point, no free uses — the 2 points (and the free one every
            // 10 minutes from 13th) go to heartbeats, the save rerolls kept only for that free use; saves are rare in these fights.)
            if (ctx.buffed && ctx.lv >= 5 && process.env.REWIND_VARIANT !== "free3") {
                user.allyAcReaction = { name: "Rewind (attack)", value: 2, within: ctx.lv >= 13 ? 60 : 30, uses: ctx.lv >= 13 ? 3 : 2 };
                if (ctx.lv >= 13) user.allySaveReroll = { ...user.allySaveReroll, uses: 1 }; else delete user.allySaveReroll; // (uses: 0 reads as unlimited)
                delete user.saveCurse;
            }
            // (A foe's critical hit on the stand rerolled — played as made a hit, once a fight.)
            // (2026-11-25 diagnostic switch REWIND_DIAG: nocrit | noheart | nothing — parts of the build off, to see what gives Barrage Rush + Rewind its solo waves; unset = as played.)
            const diag = process.env.REWIND_DIAG;
            if (diag === "noheart" || diag === "nothing") delete user.allyAcReaction;
            if (diag === "nothing") { delete user.allySaveReroll; delete user.saveCurse; }
            const stand = { ...userOnly(user), ...(diag === "nocrit" || diag === "nothing" ? {} : { critDowngrade: { name: "Rewind (attack)", dc: null, uses: 1 } }) };
            return { user, stand };
        },
        notes: [
            "Played on saves only: an ally's failed save rerolled with the new result kept (allySaveReroll, 1 use; 2 from 13th for the free use every 10 minutes) and a foe's successful save against the party rerolled with the worse kept (saveCurse, once a fight) — the 2 Stand Points split one each; attack rolls and skill checks aren't rerolled",
            "Attack rolls: only a foe's critical hit on the stand, once a fight, played as a hit (critDowngrade — a reroll of a crit mostly isn't one); the engine has no limited-use misfortune on an ally's attacker. With saves rare in these fights, the three hooks (ally save, foe save, foe crit) stand for the 2 Stand Points — one more use than the points allow",
            "The foe's reroll keeps the worse result (the engine's), where the text keeps the second whatever it is",
            "5th: the user's own saves too (self)",
            "9th: undoing a creature's action once a day not played (no action-undo hook)",
            "13th: 60-ft range and the free use every 10 minutes (a second ally reroll)",
            "17th: rewinding allies' Hit Points and spaces once a day not played (no mechanism for HP at a past turn)",
            "Price (a watch in hand, turned as part of the reaction): assumed met"
        ],
        buff: {
            "5": "You can use Rewind on your own check. When a Strike hits an ally within range, you can spend a Stand Point to turn the watch back a heartbeat: the target gains a +2 circumstance bonus to AC against that Strike, which can turn the hit into a miss (this uses your reaction)."
        },
        buffNotes: [
            "1st: the free attack Rewind as allyAcReaction: +5 AC after the hit (about the share of hits a forced reroll turns into misses, crits dropping to hits), once a round (the user's reaction, shared with the save rerolls), allies within 30 ft (60 ft from 13th), the user too from 5th (self); a reroll that comes up a critical hit isn't played",
            "Round 3 (tone-down): the free once-a-round attack Rewind (+5 AC after a hit, Δ +0.47) cut to a heartbeat back: +2 circumstance AC after the hit (value 2, as Hammer Block), allies only (no self from 5th); a full reroll of an attack roll is a surge as in the module text (not played on attacks, as unbuffed)",
            "Round 4 (cap, Δ +0.29): the free once-a-round heartbeat moved from 1st to 5th (1st is back to the module text — no 1 buff entry). Tried first: twice per combat (the stand's own +2 AC reaction, 2 uses) measured Δ +0.09 at 20, far under the band; once a round guarding the user and allies with only 2 uses on the stand measured +0.47 at 20 (the user's own cover is worth as much as the stand's). The engine's ally +AC reaction (allyAcReaction) has no per-fight count, so 'once per combat' / 'a Stand Point' can't be played for allies"
        ]
    },
    "Accelerate": {
        build(ctx) {
            const user = { passiveEffects: [ctx.effectModel("Accelerate", Infinity, { modifiers: [{ on: "speed", type: "status", value: 10 }] })] };
            const spells = [];
            const out = { user, spells };
            if (ctx.lv >= 5) {
                user.selfEffects = [{ name: "Accelerate (surge)", actions: 1, pool: ctx.pool, model: ctx.effectModel("Accelerate (surge)", 10, { conditions: [{ slug: "quickened", value: null }] }) }];
                out.spellPools = { [ctx.pool]: 2 };
            }
            if (ctx.lv >= 17) {
                spells.push(condition(ctx, "Accelerate (slow time)", { actions: 2, area: { type: "emanation", value: 30 }, range: null, target: null, traits: ["incapacitation"], pool: "accelerate-daily",
                    effects: { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["slowed", 1, ctx.minutes(1)]] } }));
                out.spellPools = { ...(out.spellPools ?? {}), "accelerate-daily": 1 };
            }
            out.stand = userOnly(user);
            if (ctx.buffed) {
                // (Buffed 1st: once a fight, free, 1 action — the stand quickened for 1 minute; 5th: surge, 1 action — the stand's accelerated Strike,
                // S damage. The 2 Stand Points go to that Strike; the user's own quickening isn't played in the buffed build.)
                const stand = { ...out.stand, selfEffects: [{ name: "Accelerate (stand)", actions: 1, pool: "accelerate-stand", model: ctx.effectModel("Accelerate (stand)", B1.has("AC1") || B1.has("AC2") ? 10 : 3, { conditions: [{ slug: "quickened", value: null }] }) }], spellPools: { "accelerate-stand": 1 } };  // (AC1: the stand's quickening lasts 1 minute, was 3 rounds)
                // (Round 2, 1st: the stand's first Strike each turn at accelerated speed — the target off-guard to it.)
                stand.strikeActivities = [strikeActivity("Accelerate (accelerated first Strike)", { offGuard: true, oncePerTurn: true, ...(B1.has("AC2") ? { damagePerWeaponDie: 1 } : {}) })];  // (AC2: AC1 + that Strike +1 damage a weapon die)
                if (ctx.lv >= 5) {
                    // (Round 2, 5th: the surge Strike outside the multiple attack penalty, and off-guard too — both taken back in round 3.)
                    stand.strikeActivities.push(strikeActivity("Accelerate (surge, accelerated Strike)", { damage: ctx.S("bludgeoning"), pool: ctx.pool }));
                    stand.spellPools[ctx.pool] = 2;
                    delete user.selfEffects;
                    out.spellPools = { ...out.spellPools };
                    delete out.spellPools[ctx.pool];
                }
                out.stand = stand;
            }
            return out;
        },
        buff: {
            "1": "You gain a +10-ft status bonus to Speed. Once per combat, 1 action: your stand is quickened for 3 rounds; it can use the extra action only to Stride, Step or Strike. This doesn't cost a Stand Point. Your stand's first Strike each turn comes at accelerated speed: the target is off-guard against it.",
            "5": "Surge, 1 action: you're quickened for 1 minute (the extra action only to Stride, Step or Strike, as haste). Every other creature in a 10-ft emanation, allies included, attempts a Will save or takes a –10-ft penalty to Speed for 1 round. Surge, 1 action: your stand Strikes at accelerated speed; the Strike deals S damage instead of its normal damage."
        },
        buffNotes: [
            "1st: the stand's own 1-action selfEffect (the user's action played as the stand's), quickened 10 rounds, once a fight (a pool of 1, no Stand Point) — its 3rd action a Strike; the Stride/Step/Strike limit not enforced",
            "5th: the accelerated Strike as a Strike activity of the stand's with S bludgeoning in place of its damage, its 2 uses the 2 Stand Points; the user's own quickening surge (worth ~0 unbuffed) isn't played in the buffed build, so the points aren't counted twice; the emanation not played (as unbuffed)",
            "Round 2: 1st — the accelerated first Strike as a once-a-turn Strike activity of the stand's, off-guard (+2); 5th — the surge Strike off-guard too and outside the multiple attack penalty (noMap)",
            "Round 3 (tone-down, Δ +0.38): the stand's free quickening 3 rounds instead of 1 minute (effect 3 rounds), and the surge Strike is back to S damage only — off-guard and outside the multiple attack penalty both dropped (offGuard, noMap); the first-Strike off-guard stays"
        ]
    },
    "Loop": {
        build(ctx) {
            const effects = ctx.lv >= 17 ? { failure: [["slowed", 1, ctx.round1]], criticalFailure: [["slowed", 1, ctx.round1]] } : {};
            // (Cole 2026-11-26: the bomb comes back on a 10-minute rest — a per-fight pool, "loop-bomb", not a daily one.)
            const spells = [noSave(ctx, "Loop (bomb)", { actions: 1, damage: ctx.S("force"), pool: "loop-bomb", effects })];
            // (2026-11-26, module a5ce436: 5th surge, 2 actions: a second bomb today — its planting and going off played as one 2-action use, a Stand Point; half S, Cole's pick 2026-11-26.)
            // (Cole 2026-11-26: the second bomb deals no damage, only rewinds positions — not played in range bands, so nothing to add.)
            const user = ctx.lv >= 13 ? { allySaveReroll: { name: "Loop (reroll)", within: 1000, uses: 1, free: true } } : {};
            return { spells, user, stand: userOnly(user), spellPools: { "loop-bomb": 1 } };
        },
        notes: [
            "The bomb planted in a willing ally before the fight (once a day); its going off played as a 1-action, once-a-fight S force damage with no save (DC 100) on a foe within 30 ft — the engine has no once-only 'hurt whoever attacks this ally' — so it costs an action it shouldn't",
            "5th: everyone within 30 ft back to the round's start spaces not played (range bands)",
            "9th: choosing whether it goes off — already the case as an action the AI chooses",
            "13th: the ally's reroll of one save, the better kept (allySaveReroll, once a fight, any save — not only against the triggering creature)",
            "17th: the triggering creature slowed 1 at its next turn (its lost remaining actions not played — it goes off on the user's turn here)"
        ]
    }
};
