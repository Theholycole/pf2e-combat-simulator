// Stand Abilities: space theme (see index.js for the contract).
// (2026-11-24: the fifteen Space abilities of content/stand-abilities.md, buffed wording.)

// (2026-11-26, module a5ce436, Cole: "give 5th level surges for the late ones" — the 9th-level surges at 5th and new 9th steps; LATE,
// STAND_LATE_SURGE=0 for the text before it.)
const LATE = globalThis.process?.env?.STAND_LATE_SURGE !== "0";
const TRAITS = ["concentrate", "occult", "stand"];
// A save plan with no damage (conditions, a Disarm, a push or pull, out of the fight), as a ready entry.
//   disarm: degrees whose creature drops a held weapon; move: { degree: { kind: "pull"|"push", distance } }; hinder: true for "hinder:" slugs;
//   size: the largest size it works on.
const control = (ctx, name, { actions = 2, save = "reflex", target = "1 creature", range = ctx.range, area = null, effects = {}, disarm = [], move = {}, hinder = false, size = null, surge = false, pool = null, traits = [] }) => {
    const plan = ctx.savePlan(name, { actions, traits: [...TRAITS, ...traits], area, target, range, save, dc: ctx.dc, effects });
    for (const degree of disarm) plan.resolution.outcomes[degree].effects.push({ kind: "disarm", what: "drop" });
    for (const [degree, movement] of Object.entries(move)) plan.resolution.outcomes[degree].forcedMovement = { ...movement };
    if (hinder) plan.hinder = true;
    if (size) plan.targeting.actorConstraints = { predicates: [{ kind: "size-at-most", size }] };
    return ctx.entry(name, plan, { surge, pool });
};
// "No save": damage on every degree, a save the creature can't make (DC 100 — a critical failure, a failure on a natural 20).
const noSave = (ctx, name, { actions = 2, damage, target = "1 creature", range = ctx.range, surge = false, pool = null }) => {
    const plan = ctx.savePlan(name, { actions, traits: TRAITS, target, range, save: "fortitude", dc: 100, basic: false, extra: { failure: [damage], criticalFailure: [damage] } });
    return ctx.entry(name, plan, { surge, pool });
};
// A Strike of the stand's with a rider (abilities.js strike-activity shape).
const strikeActivity = (name, more = {}) => ({
    name, actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["stand"],
    riderSpell: null, ...more,
    onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null, ...(more.onHit ?? {}) }
});
const withRider = (activity) => (activity.onHit.save ? { ...activity, riderSpell: { name: activity.name, plan: activity.onHit.save, castRank: 1, pool: null, kind: "ability" } } : activity);
// "Out of the fight": the Maze of Locked Doors hindrance with doors it can't get through — gone till its time's up.
const GONE = "hinder:mazed:99";
// The stand starts as a copy of its user: fields that are the user's alone taken off it again.
const userOnly = (user) => Object.fromEntries(Object.keys(user).map((key) => [key, null]));
const strikeFormula = (strike, type) => {
    const part = strike.damage[0];
    return `${part.dice}d${part.die}${part.bonus ? `+${part.bonus}` : ""}[${type}]`;
};

export const SPACE = {
    "Zippers": {
        build(ctx) {
            const user = {};
            // (1st: the stand's hit — Fortitude or it drops a held item; 17th: a critical failure also detaches a limb.)
            const rider = ctx.savePlan("Zippers (unzip)", { actions: 1, traits: TRAITS, target: "1 creature", range: "touch", save: "fortitude", dc: ctx.dc,
                effects: ctx.lv >= 17 ? { criticalFailure: [["clumsy", 2, ctx.minutes(1)]] } : {} });
            for (const degree of ["failure", "criticalFailure"]) rider.resolution.outcomes[degree].effects.push({ kind: "disarm", what: "drop" });
            const stand = { strikeActivities: [withRider(strikeActivity("Zippers (unzip)", { onHit: { save: rider } }))] };
            // (5th: 2 actions, 30 ft along a surface with no reactions.)
            if (ctx.lv >= 5) user.safeMove = { name: "Zippers (zip along)", actions: 2 };
            // (9th: reaction, surge — a melee hit that misses, its 2 uses a fight the 2 Stand Points.)
            if (ctx.lv >= 9) user.acReaction = { name: "Zippers (unzip body)", when: "hit", value: 50, against: "melee", uses: 2 };
            if (ctx.buffed && ctx.lv >= 5) {
                // (Buffed 5th: surge, 1 action — the stand's Strike zips the target apart: S slashing in place of its damage, the drop save on a hit.)
                stand.strikeActivities.push(withRider(strikeActivity("Zippers (surge, zip apart)", { damage: ctx.S("slashing"), pool: ctx.pool, onHit: { save: rider } })));
                stand.spellPools = { [ctx.pool]: 2 };
            }
            return { user, stand: { ...userOnly(user), ...stand } };
        },
        buff: {
            "5": "2 actions: zip yourself along a surface, moving up to 30 ft without triggering reactions. Surge, 1 action: your stand Strikes and zips the target apart; on a hit, the Strike deals S slashing damage instead of its normal damage, and the target attempts the Fortitude save against dropping a held item.",
            "9": "Reaction (once per round): when a melee attack would hit you, unzip your body so it misses. Your first two uses each combat cost no Stand Point; after that it's a surge."
        },
        buffNotes: [
            "5th: the zip-apart Strike as a Strike activity of the stand's, S slashing in place of its damage, the 1st-level Fortitude-or-drop rider on its hit (clumsy 2 on a critical failure from 17th), its 2 uses the 2 Stand Points (the stand's pool)",
            "9th: the two free unzips are the 2 acReaction uses the unbuffed build already played (it counted them as the Stand Points) — so the points now go to the 5th-level surge"
        ],
        notes: [
            "1st: the passage and hiding an item: no combat use; the hit's Fortitude-or-drop played as a Strike activity of the stand's whose hit casts a Fortitude save — failure: Disarm's drop",
            "5th: zipping 30 ft without reactions as the user's safe move (2 actions)",
            "9th: the user's reaction to a melee hit: +50 AC against it (a miss), its 2 uses its 2 Stand Points; once a round as a reaction is",
            "13th: thicker, longer passages: no combat use",
            "17th: a critical failure also clumsy 2 for 1 minute (the lost hand isn't played)"
        ]
    },
    "Erasure": {
        build(ctx) {
            const distance = ctx.lv >= 9 ? 20 : 10;
            const spells = [control(ctx, "Erasure (swipe pull)", { actions: 1, save: "fortitude", range: "20 feet", move: { failure: { kind: "pull", distance }, criticalFailure: { kind: "pull", distance } } })];
            const stand = {};
            if (ctx.lv >= 5) {
                // (Surge: a swipe Strike for S force, the target's item bonus to AC ignored — +1/+2/+3 as a PC's armor potency —; 17th: drained 2 on a critical hit.)
                const potency = ctx.lv >= 18 ? 3 : ctx.lv >= 11 ? 2 : 1;
                stand.strikeActivities = [strikeActivity("Erasure (surge swipe)", { damage: ctx.S("force"), attackBonus: potency, pool: ctx.pool, onHit: ctx.lv >= 17 ? { critical: [{ slug: "drained", value: 2 }] } : {} })];
                stand.spellPools = { [ctx.pool]: 2 };
            }
            if (ctx.lv >= 13) stand.allyAcReaction = { name: "Erasure (erase projectile)", value: 50, within: 10, ranged: true };
            return { spells, stand };
        },
        notes: [
            "1st: the pull of a creature 10 ft toward the stand (Fortitude negates) as a forced pull; pulling yourself: no worth in bands",
            "5th: the surge Strike as a Strike activity of the stand's with S force damage in place of its own, the 2 Stand Points the stand's (no other surge); 'ignores the item bonus to AC' played as +1/+2/+3 to hit (monsters' AC has no item part to take off); a miss spends the point",
            "9th: pulls 20 ft",
            "13th: erasing a projectile aimed at an ally within reach as the stand's reaction: +50 AC against a ranged Strike that hits an ally beside it (allyAcReaction); erasing objects: no combat use",
            "17th: drained 2 on the surge Strike's critical hit"
        ]
    },
    "Void": {
        build(ctx) {
            const user = { selfEffects: [{ name: "Void (vanish)", actions: 2, model: ctx.effectModel("Void (vanish)", 10, { conditions: [{ slug: "invisible", value: null }, { slug: "blinded", value: null }, { slug: "deafened", value: null }] }) }] };
            const spells = [];
            const line = { type: "line", value: ctx.lv >= 17 ? 60 : 30 };
            if (ctx.buffed) {
                // (Buffed: the pass-through from 1st, the surge from 5th, drained 1/2 on a failed save from 9th.)
                const drain = ctx.lv >= 9 ? { failure: [["drained", 1, null]], criticalFailure: [["drained", 2, null]] } : {};
                const carried = { type: "burst", value: 10, foes: true };
                spells.push(ctx.make("Void (pass through)", { actions: 1, damage: ctx.D("force"), kind: "force", area: carried, effects: drain }));
                if (ctx.lv >= 5) spells.push(ctx.make("Void (surge pass)", { actions: 1, damage: ctx.S("force"), kind: "force", area: carried, surge: true, effects: drain }));
                return { user, spells, stand: userOnly(user) };
            }
            if (ctx.lv >= 5) spells.push(ctx.make("Void (pass through)", { actions: 1, damage: ctx.D("force"), kind: "force", area: line }));
            if (ctx.lv >= 9) spells.push(ctx.make("Void (surge pass)", { actions: 1, damage: ctx.S("force"), kind: "force", area: line, surge: true }));
            return { user, spells, stand: userOnly(user) };
        },
        buff: {
            "1": "2 actions: you and your stand vanish into a sphere; you're undetected and can't be targeted, but you're blinded and deafened. 1 action: move up to your Speed in a straight line; creatures and objects you pass through take D force damage (basic Reflex), once per creature per turn. Your stand can become the void on its own instead, carrying it through creatures within its range while you stay outside. Leaving takes 1 action, and the void ends after 1 minute.",
            "5": "Surge: passing through deals S force damage instead.",
            "9": "A creature that fails its save against the void loses a piece of itself: it's drained 1, or drained 2 on a critical failure."
        },
        buffNotes: [
            "The 5th/9th steps brought to 1st/5th; the 9th drain on a failure / critical failure (both passes); as before not gated on being inside the void",
            "The stand-carried void as a 10-ft burst within 30 ft that hits foes only (the creatures its straight path crosses — the path picked around allies —, the stand at the foes) — so the user isn't walked into the foes' reach (the unbuffed 30-ft line from the user)"
        ],
        notes: [
            "1st: the user's vanish (2 actions) as invisible (hidden) for 1 minute with blinded and deafened; the stand vanishing with it isn't played (it keeps fighting); 'can't be targeted' is only as hidden as invisible is",
            "5th: moving through creatures as a 1-action 30-ft line, D force, basic Reflex — not gated on being inside the void (entering's 2 actions not charged) and not once per creature per turn",
            "9th: the surge pass, S force, 1 action (the move's)",
            "13th: peeking: no combat use",
            "17th: double Speed: the line 60 ft"
        ]
    },
    "Dimension Step": {
        build(ctx) {
            const user = { safeMove: { name: "Dimension Step", actions: 1 } };
            const range = ctx.lv >= 13 ? "120 feet" : "30 feet";
            const spells = [];
            // (Round 2, 13th: a failure keeps it out till the end of the user's next turn.)
            // (Round 4: the 13th's failure back to 1 round — the round-2 2 rounds dropped.)
            const lost = ctx.round1;
            if (ctx.buffed ? ctx.lv >= 5 : ctx.lv >= 9) spells.push(control(ctx, "Dimension Step (surge, parallel world)", { save: "will", range, surge: true, hinder: true, effects: { failure: [[GONE, null, lost]], criticalFailure: [[GONE, null, ctx.buffed && ctx.lv >= 9 ? ctx.minutes(1) : ctx.round1]] } }));
            // (Round 4: the buffed 17th no longer drops the save — the parallel copy stays basic Fortitude, the 5th's entry below.)
            if (!ctx.buffed && ctx.lv >= 17) spells.push(noSave(ctx, "Dimension Step (surge, parallel copy)", { damage: ctx.S("force"), range, surge: true }));
            // (Round 2, 5th: the parallel copy from 5th, basic Fortitude till the 17th's no save.)
            else if (ctx.buffed && ctx.lv >= 5) spells.push(ctx.make("Dimension Step (surge, parallel copy)", { actions: 2, damage: ctx.S("force"), kind: "force", save: "fortitude", surge: true }));
            const stand = userOnly(user);
            // (Round 2, 1st: the stand steps through the other world beside a creature and Strikes it off-guard, once a turn.)
            if (ctx.buffed) stand.strikeActivities = [strikeActivity("Dimension Step (from the other world)", { strides: 1, offGuard: true, oncePerTurn: true })];
            // (NCFILL 17th: reaction, once a round, sandwiched (assumed): an attack that would hit you misses — a +50 AC reaction on a hit.)
            // (DIM17: minute — melee only, once a fight (acReactionUses 1); round — melee only, once a round; off unless set.)
            const dim17 = globalThis.process?.env?.DIM17 ?? "minute";  // (adopted 2026-11-27)
            if (dim17 && ctx.buffed && ctx.lv >= 17) { user.acReaction = { value: 50, when: "hit", against: "melee", name: "Dimension Step (halfway into the other world)", ...(dim17 === "minute" ? { uses: 1 } : {}) }; }
            return { user, spells, stand };
        },
        notes: [
            "Price (pressed between two objects): assumed met",
            "1st: stepping 30 ft to another pair of objects as the user's 1-action safe move out of melee",
            "5th: bringing an ally: not played",
            "9th: surge (2 actions, the default): Will negates — out of the fight till the start of the user's next turn (the Maze hindrance)",
            "13th: range 120 ft",
            "17th: the parallel copy touching its original, S force damage with no save (DC 100) on the original, 2 actions; 'once per day' not enforced beyond the 2 Stand Points"
        ],
        buff: {
            "1": "1 action while sandwiched: step into a parallel world and reappear next to a different pair of objects within 30 ft. Once per turn, your stand can also step through the other world: it Strides up to its Speed to a creature beside a pair of objects and Strikes it; the creature is off-guard against that Strike.",
            "5": "You can bring one willing adjacent creature. Surge: pull a creature caught between two objects into a parallel world for 1 round (Will negates). It returns at the start of your next turn. Surge: bring a parallel copy of a creature into this world; when it touches its original, both take S damage (basic Fortitude).",
            "9": "A creature that critically fails its Will save against the parallel world is lost there for 1 minute.",
            "17": "The parallel copy's damage keeps its basic Fortitude save (as at 5th)."
        },
        buffNotes: ["The parallel-world surge from 5th (as the 9th was played: out of the fight, the Maze hindrance); from 9th a critical failure keeps it out 1 minute",
            "Round 2: 1st — the step-through as a once-a-turn Strike activity of the stand's with a free Stride, off-guard (+2); 5th — the 17th's parallel copy from 5th as a 2-action surge, S force, basic Fortitude (no save from 17th, as before; 'once per day' as the 2 Stand Points); 13th — a failure out of the fight 2 rounds (till the end of the user's next turn)",
            "Round 4 (cap): the 17th's no-save parallel copy (the 17/20 spike, Δ +0.41/+0.56) lowered — the copy keeps its basic Fortitude save at every level ('once per day' dropped with the no-save; the 2 Stand Points); the 13th's round-2 'returns only at the end of your next turn' dropped (a failure is out 1 round again, as the module text — no 13 buff entry)"]
    },
    "Phase Store": {
        build(ctx) {
            const target = ctx.lv >= 13 ? "up to 2 creatures" : "1 creature";
            // (Round 2: the stand dives into what a creature within its range touches — played at 30 ft from the user, the stand beside the foe.)
            const range = ctx.buffed ? "30 feet" : ctx.lv >= 5 ? "10 feet" : "touch";
            const effects = ctx.lv >= 17 ? { failure: [["immobilized", null, ctx.round1]], criticalFailure: [["immobilized", null, ctx.round1]] } : {};
            // (Round 2, 5th: off-guard till the end of the user's next turn on a failure.)
            if (ctx.buffed && ctx.lv >= 5) for (const degree of ["failure", "criticalFailure"]) effects[degree] = [...(effects[degree] ?? []), ["off-guard", null, ctx.rounds(2)]];
            const spells = [ctx.make("Phase Store (stored blow)", { actions: ctx.buffed ? 1 : 2, damage: strikeFormula(ctx.main, "bludgeoning"), kind: "bludgeoning", target, effects })];
            if (ctx.lv >= (ctx.buffed ? 5 : 9)) spells.push(ctx.make("Phase Store (surge blow)", { actions: 2, damage: ctx.S("bludgeoning"), kind: "bludgeoning", target, effects, surge: true }));
            for (const entry of spells) entry.plan.targeting.range = range;
            // (2026-11-27, NCFILL2 9th: 1 action, the stand dives into a willing ally (30 ft) and holds a stored blow there — the first physical
            // damage a foe deals it reduced by the user's level, the blow (the stand's Strike damage, basic Reflex) on that foe if adjacent;
            // actions.js. One diving stand: the dive ends the ally's earlier one.)
            // (2026-11-27, Cole's pick: PHASE_V=react (default) — the dive a reaction when an ally in the stand's reach is hit (actions.js);
            // PHASE_V=action — the 1-action dive below.)
            const PHV = globalThis.process?.env?.PHASE_V ?? "react";
            if (ctx.buffed && (globalThis.process?.env?.NCFILL2 ?? "1") === "1" && ctx.lv >= 9 && PHV === "react") return { spells, stand: { phaseReact: { amount: ctx.lv, damage: strikeFormula(ctx.main, "bludgeoning"), dc: ctx.dc } } };
            if (ctx.buffed && (globalThis.process?.env?.NCFILL2 ?? "1") === "1" && ctx.lv >= 9) {
                const name = "Phase Store (dive into an ally)";
                const uuid = "stand.phase-store-dive-into-an-ally";
                const p = ctx.savePlan(name, { actions: 1, traits: ["concentrate", "occult", "stand"], target: "1 willing ally", range: "30 feet", damage: null, basic: false });
                p.resolution = { kind: "effect", check: null, sharedDamage: null, outcomes: {}, applications: [{ kind: "native-spell-effect", uuid, label: name, recipients: "target" }] };
                const dive = ctx.entry(name, p);
                dive.effects = { [uuid]: ctx.effectModel(name, 10, globalThis.process?.env?.PHASE_EMPTY === "1" ? {} : globalThis.process?.env?.PHASE_TEMP === "1" ? { tempHp: ctx.lv, phaseStore: { amount: 0, damage: strikeFormula(ctx.main, "bludgeoning"), dc: ctx.dc } } : { phaseStore: { amount: ctx.lv, damage: strikeFormula(ctx.main, "bludgeoning"), dc: ctx.dc } }) };
                if (globalThis.process?.env?.PHASE_ONCE === "1") dive.pool = "phase-dive";
                spells.push(dive);
                if (globalThis.process?.env?.PHASE_ONCE === "1") return { spells, spellPools: { "phase-dive": 1 } };
            }
            return { spells };
        },
        notes: [
            "Price (the blow lands when someone touches the object): played as landing on a foe in the fight — the stand dives into the floor, wall or gear it touches; the blow stored before the fight (it lasts 1 hour) isn't played",
            "1st: 2 actions, the stand's main Strike damage, basic Reflex, at a creature it touches",
            "5th: released from 10 ft",
            "9th: surge, S bludgeoning in place of the Strike",
            "13th: two blows in two objects as up to 2 creatures",
            "17th: immobilized 1 round on a failed Reflex (the text's separate Fortitude save folded into it)"
        ],
        buff: {
            "1": "1 action: your stand dives into an object or surface and stores one Strike for up to 1 hour. The next creature that touches it takes the Strike's damage (no attack roll needed; basic Reflex for half). If the stand dives into the ground, wall or gear a creature within its range is touching, the blow lands on that creature at once.",
            "5": "The stored blow can be released from up to 10 ft through the object instead. Surge: store S damage instead of a Strike. A creature that fails its save against a stored blow is thrown off its footing: it's off-guard until the end of your next turn."
        },
        buffNotes: ["1st: the stored blow 1 action; the S surge (still 2 actions, the default) from 5th instead of 9th",
            "Round 2: the blow released into what a creature in the stand's range touches, played at 30 ft from the user (the unbuffed touch walked the user into the foes); 5th — off-guard 2 rounds (till the end of the user's next turn) on a failure, both blows"]
    },
    "Reflection Travel": {
        build(ctx) {
            const offGuard = ctx.buffed || ctx.lv >= 5;
            const stand = { strikeActivities: [strikeActivity("Reflection Travel (from a reflection)", { strides: 1, offGuard, ...(ctx.buffed && ctx.lv >= 5 ? { damagePerWeaponDie: 1 } : {}) })] };
            if (ctx.buffed && ctx.lv >= 5) {
                stand.strikeActivities.push(strikeActivity("Reflection Travel (surge, in its eyes)", { strides: 1, offGuard: true, damage: ctx.S("slashing"), pool: ctx.pool }));
                stand.spellPools = { [ctx.pool]: 2 };
            }
            if (ctx.lv >= 13) {
                stand.multiStrikes = [
                    { name: "Reflection Travel (surge, three reflections)", actions: 2, strikes: [null, null, null], distinct: true, pool: ctx.pool, penalty: -2 },
                    { name: "Reflection Travel (surge, two reflections)", actions: 2, strikes: [null, null], distinct: true, pool: ctx.pool, penalty: -2 }
                ];
                stand.spellPools = { [ctx.pool]: 2 };
            }
            return { stand };
        },
        notes: [
            "Price (a reflective surface): assumed met everywhere",
            "1st: moving reflection to reflection and attacking from there as a Strike activity of the stand's with a free Stride first (strides 1)",
            "5th: the target off-guard to it (+2 to hit)",
            "9th: seeing through reflections: no combat use",
            "13th: surge (2 actions, the default): a Strike at each of 3 different creatures from 3 reflections (a 2-creature version when only 2 foes are left), off-guard (+2), the stand's 2 Stand Points (no other surge)",
            "17th: targetable only by creatures that see the reflection: not played (the fights' foes see it)"
        ],
        buff: {
            "1": "Your stand can move from one reflection to another within its range as if it were a single space, and it can be in a reflection to attack the creature reflected there. A Strike from a reflection makes the target off-guard against it.",
            "5": "Strikes from a reflection gain a +1 circumstance bonus to damage per weapon damage die. Surge, 1 action: your stand strikes from the reflection in a creature's own eyes: a Strike that deals S slashing damage instead of its normal damage, the target off-guard against it.",
            "9": "You can see through any reflection within 60 ft."
        },
        buffNotes: ["1st: off-guard on the reflection Strike activity; 5th: +1 damage per weapon die (damagePerWeaponDie); 9th: the eyes Strike as a Strike activity with S slashing in place of its damage, off-guard, sharing the stand's 2 Stand Points with the 13th surge",
            "Round 2: the eyes surge moved from 9th to 5th (same encoding)"]
    },
    "Photo Prison": {
        build(ctx) {
            if (!ctx.buffed) return null;
            // (Round 2: off-guard till the end of the user's next turn on a failure; a critical failure immobilized and off-guard that long.)
            const spells = [control(ctx, "Photo Prison (snapshot)", { actions: 1, save: "will", effects: { failure: [["off-guard", null, ctx.rounds(2)]], criticalFailure: [["immobilized", null, ctx.rounds(2)], ["off-guard", null, ctx.rounds(2)]] } })];
            // (Round 5: tear a corner of the quick picture, 1 action, D force basic Will, from 1st; the surge tear 1 action from 13th.)
            // (Round 5b: the torn corner pins it — a failure off-guard till the end of the user's next turn, a critical failure also immobilized that long; 13th: up to 2 creatures in the same picture.)
            const pinned = { failure: [["off-guard", null, ctx.rounds(2)]], criticalFailure: [["off-guard", null, ctx.rounds(2)], ["immobilized", null, ctx.rounds(2)]] };
            spells.push(ctx.make("Photo Prison (tear corner)", { actions: 1, damage: ctx.D("force"), kind: "force", save: "will", effects: pinned, target: ctx.lv >= 13 ? "up to 2 creatures" : "1 creature" }));
            if (ctx.lv >= 5) spells.push(ctx.make("Photo Prison (surge, tear)", { actions: ctx.lv >= 13 ? 1 : 2, damage: ctx.S("force"), kind: "force", save: "will", surge: true }));
            if (ctx.lv >= 9) spells.push(control(ctx, "Photo Prison (surge, trap)", { save: "will", surge: true, traits: ["incapacitation"], target: ctx.lv >= 17 ? "up to 4 creatures" : ctx.lv >= 13 ? "up to 2 creatures" : "1 creature", effects: { failure: [["immobilized", null, ctx.round1]], criticalFailure: [["immobilized", null, ctx.minutes(1)]] } }));
            return { spells };
        },
        buff: {
            "1": "10 minutes: make a picture of a creature. While you hold it, you know the direction to that creature within 1 mile. In combat, your stand can instead snap a quick picture of a creature it can see within 30 ft as part of any Photo Prison action; a quick picture fades after 1 minute. 1 action: snap a quick picture and pin the creature to that instant (Will negates): on a failure it's off-guard until the end of your next turn, on a critical failure it's also immobilized until the end of your next turn. 1 action: tear a corner of a quick picture; its creature takes D damage (basic Will), and on a failure it's off-guard until the end of your next turn (on a critical failure also immobilized until the end of your next turn).",
            "13": "Picture range 5 miles. You can trap a picture of up to two creatures at once. Tearing part of the picture (the 5th-level surge) takes 1 action, and tearing a corner affects up to two creatures in the same picture."
        },
        buffNotes: [
            "1st: the snapshot, 1 action, 30 ft, Will — off-guard till the start of the user's next turn on a failure, immobilized 1 round on a critical failure",
            "5th: the tear as a 2-action surge, S force (untyped), basic Will — 'once per day per picture' not enforced beyond the 2 Stand Points; 9th: the trap (surge, incapacitation) immobilized 1 round / 1 minute; 17th: up to 4 creatures",
            "The quick picture is taken as part of each action (as the buffed 1st says); the 10-minute picture's tracking: no combat use",
            "Round 2: 1st — the snapshot's off-guard (and the critical failure's immobilized + off-guard) 2 rounds, till the end of the user's next turn; 13th — the trap on up to 2 creatures (the 17th's 4 brought partly earlier)",
            "Round 5: 1st — the corner tear, 1 action, D force basic Will, 30 ft (ctx.make, not a surge); 13th — the surge tear 1 action; the corner tear\'s failure off-guard 2 rounds (critical failure + immobilized 2 rounds, as the snapshot), from 13th up to 2 creatures (ctx.make target)."
        ],
        why: "every step needs a picture of the target, made in 10 minutes beforehand (step 1) — no picture can be made in a fight",
        notes: ["5th's tear (S damage, basic Will), 9th's trap and 17th's group trap all need the 10-minute picture"]
    },
    "Invisibility": {
        build(ctx) {
            const rounds = ctx.lv >= 17 ? 100 : 10;
            const user = { selfEffects: [{ name: "Invisibility", actions: 2, model: ctx.effectModel("Invisibility", rounds, { conditions: [{ slug: "invisible", value: null }] }) }] };
            const stand = userOnly(user);
            if (ctx.buffed) {
                // (Buffed 1st: surge, 1 action — the stand invisible for 1 minute, its attacks don't end it.)
                stand.selfEffects = [{ name: "Invisibility (surge, stand)", actions: 1, pool: ctx.pool, model: ctx.effectModel("Invisibility (surge, stand)", rounds, { conditions: [{ slug: "invisible", value: null }] }) }];
                stand.spellPools = { [ctx.pool]: 2 };
                // (Its unseen Strikes: the target off-guard, a weapon die more — not gated on its being invisible yet.)
                // (Round 2, 5th: a hit leaves the target off-guard till the end of the user's next turn; 13th: two weapon dice more.)
                stand.strikeActivities = [strikeActivity("Invisibility (unseen Strike)", { offGuard: true, extraWeaponDice: ctx.lv >= 13 ? 2 : 1, onHit: ctx.lv >= 5 ? { conditions: [{ slug: "off-guard", value: null, duration: ctx.rounds(2) }] } : {} })];
            } else if (ctx.lv >= 9) {
                stand.selfEffects = [{ name: "Invisibility (surge)", actions: 1, pool: ctx.pool, model: ctx.effectModel("Invisibility (surge)", 1, { conditions: [{ slug: "invisible", value: null }] }) }];
                stand.spellPools = { [ctx.pool]: 2 };
            }
            return { user, stand };
        },
        notes: [
            "1st: the user's 2-action invisibility (hidden) for 1 minute; the user doesn't attack, so its 'ends when you attack' never comes up",
            "5th: a touched creature invisible until it attacks: not played (the one worth touching, the stand, attacks every turn)",
            "9th: surge — invisible through its attacks for 1 round — played on the stand: its own 1-action effect, hidden till its next turn (the user's 2-action touch not charged), the 2 Stand Points the stand's",
            "13th: three touched creatures: not played (as 5th)",
            "17th: 10 minutes"
        ],
        buff: {
            "1": "2 actions: you become invisible until you attack or for 1 minute. Concentrate. Surge, 1 action: your stand becomes invisible for 1 minute (10 minutes at 17th); its attacks don't end this invisibility. While your stand is invisible, its Strikes make the target off-guard and deal one extra weapon damage die.",
            "5": "One creature you touch also becomes invisible. A creature your invisible stand hits loses track of it: it's off-guard until the end of your next turn.",
            "13": "Up to three touched creatures. Your invisible stand's Strikes deal two extra weapon damage dice instead of one."
        },
        buffNotes: ["The unseen Strike as a Strike activity of the stand's: off-guard (+2) and one weapon die more (extraWeaponDice) — not gated on the stand's invisibility (it surges it on its first turn, and it lasts the fight)", "1st: the stand's own 1-action selfEffect (the user's action played as the stand's), invisible 10 rounds (100 at 17th), the 2 Stand Points the stand's; it replaces the 9th's 1-round surge in the sim (the stand already stays invisible through its attacks)",
            "Round 2: 5th — the unseen Strike's hit leaves the target off-guard 2 rounds (onHit, till the end of the user's next turn; the whole party's attacks); 13th — extraWeaponDice 2; the touched allies (5th/13th) still not played"]
    },
    "Pocket Room": {
        build(ctx) {
            if (!ctx.buffed) return null;
            // (Round 2: up to 2 creatures from 5th (the 20-ft room), Large ones from 13th, the first shove each fight free — its own use.)
            const shut = (name, pool) => control(ctx, name, { actions: 1, range: "30 feet", surge: !pool, pool, hinder: true, size: "medium", target: ctx.lv >= 5 ? "up to 2 creatures" : "1 creature", effects: { success: [["off-guard", null, ctx.rounds(2)]], failure: [[GONE, null, ctx.round1]], criticalFailure: [[GONE, null, ctx.minutes(1)]] } });
            // (Round 2, 1st: the stand's Strike with the object — on a hit the creature half-drawn in, off-guard till the end of the user's next turn.)
            const stand = { strikeActivities: [strikeActivity("Pocket Room (half-drawn in)", { oncePerTurn: true, onHit: { conditions: [{ slug: "off-guard", value: null, duration: ctx.round1 }] } })] };
            // (Round 3: the free first shove dropped — every shove a surge.)
            return { spells: [shut("Pocket Room (surge, shut in)", null)], stand };
        },
        buff: {
            "price": "**Price:** you need a small object to hold the room, and it can be stolen; binding a room takes 10 minutes, so in combat you can only use a room bound beforehand.",
            "1": "10 minutes: bind an extradimensional room (10 ft cube) to a small object. Creatures and items can enter by touching it. Surge, 1 action: your stand presses the object to a Medium or smaller creature and shoves it into the room (Reflex negates). It's shut inside until the start of your next turn, or for 1 minute on a critical failure, and can't affect anything outside; on a success it's still half-drawn in and is off-guard until the end of your next turn. Once per turn, when your stand hits a creature with a Strike, it can press the object to it and half-draw it into the room: the creature is off-guard until the start of your next turn.",
            "5": "The room is 20 ft and has light and air. Your stand can shove up to two creatures within its reach into the room with one use."
        },
        buffNotes: ["1st: the shut-in surge (1 action), the stand's touch played at 30 ft (the stand is beside the foe), size checked (Medium): out of the fight 2 rounds (till the end of the user's next turn), 1 minute on a critical failure (the Maze hindrance); the room bound before the fight assumed",
            "Round 2: 1st — a second entry with its own 1-use pool (the free first shove); the shove's success off-guard 2 rounds; the half-drawn Strike as a Strike activity of the stand's whose hit leaves the target off-guard 2 rounds (onHit, till the end of the user's next turn); 5th — up to 2 creatures a use; 13th — size Large",
            "Round 3 (tone-down, Δ +0.34): the free first shove each combat dropped (its own 1-use entry gone); every shove is a surge; the room no longer takes Large creatures from 13th (size Medium at every level; the 13th step back to the module text, so no buff entry for it)",
            "Round 4 (cap, Δ +0.32): a failed shove shuts the creature in only until the start of the user's next turn (1 round, was 2); the half-drawn Strike rider once per turn (oncePerTurn) and its off-guard 1 round (until the start of the user's next turn, was 2)"],
        why: "exploration only (its Price): a 10-minute room bound to an object",
        notes: []
    },
    "Ghost Objects": {
        build(ctx) {
            // (Round 2: the ghost walls from 1st, a critical failure held 1 minute from 5th, up to 2 creatures from 9th; 13th: the ghost weapon.)
            if (ctx.lv < (ctx.buffed ? 1 : 9)) return {};
            const held = ctx.buffed && ctx.lv >= 5 ? ctx.minutes(1) : ctx.round1;
            const out = { spells: [control(ctx, "Ghost Objects (surge, ghost walls)", { save: "reflex", surge: true, target: ctx.buffed && ctx.lv >= 13 ? "up to 2 creatures" : "1 creature", effects: { failure: [["restrained", null, ctx.round1]], criticalFailure: [["restrained", null, held]] } })] };
            if (ctx.buffed && ctx.lv >= 13) out.stand = { strikeActivities: [strikeActivity("Ghost Objects (ghost weapon)", { extraWeaponDice: 1, oncePerTurn: true })] };
            return out;
        },
        buff: {
            "1": "1 action: summon the ghost of a destroyed object for 1 minute. Only you, your stand and creatures you touch can use or interact with it. Surge: ghost walls close around a creature (Reflex negates): it's restrained for 1 round.",
            "5": "Ghost objects can be up to Large (a cart, a door, a bridge). The ghost walls hold a creature that critically fails its Reflex save for 1 minute (it can Escape against your stand DC).",
            "13": "A ghost weapon uses the lost weapon's stats and has the ghost touch property. Your stand can wield one: its first Strike with it each turn deals one extra weapon damage die. The ghost walls can close around up to two creatures at once."
        },
        buffNotes: ["The ghost-walls surge from 5th; from 9th restrained 1 minute on a critical failure (the engine's Escape)",
            "Round 2: the ghost walls from 1st, the 1-minute hold from 5th, up to 2 creatures from 9th; 13th — the ghost weapon as a Strike activity of the stand's with one weapon die more (extraWeaponDice)",
            "Round 4 (cap, Δ +0.29, +0.41/+0.61 at 17/20): the two-creature ghost walls moved from 9th to 13th (9th's buff entry gone — back to the module's one creature), and the ghost weapon's extra die only on the stand's first Strike each turn (oncePerTurn)"],
        notes: [
            "1st and 5th: ghosts of destroyed objects (a door, a bridge) only the user's side can use: no combat number (1st/5th give nothing in a fight)",
            "9th: surge (2 actions, the default): Reflex negates, restrained 1 round",
            "13th: a ghost weapon with the lost weapon's stats: the user's Strikes aren't its side's damage — not played",
            "17th: 10 minutes: no change"
        ]
    },
    "Folded Distance": {
        build(ctx) {
            if (!ctx.buffed) return null;
            const stand = { strikeActivities: [strikeActivity("Folded Distance (fold to a creature)", { strides: 1, offGuard: true, oncePerTurn: true })] };
            const spells = [];
            if (ctx.lv >= 5) spells.push(ctx.make("Folded Distance (surge, fold shut)", { actions: 2, damage: ctx.S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true }));
            if (ctx.lv >= 9) spells.push(control(ctx, "Folded Distance (surge, pull adjacent)", { save: "fortitude", surge: true, move: { failure: { kind: "pull", distance: 30 }, criticalFailure: { kind: "pull", distance: 30 } } }));
            return { stand, spells };
        },
        buff: {
            "1": "1 minute: mark a 20-ft zone. Inside it, you and your stand move double your Speed. In combat, you can instead mark a 10-ft zone around your stand with 1 action; it lasts 1 minute. Once per turn, 1 action: your stand folds the distance to a creature in a zone, Striding up to its Speed and making a Strike; the creature is off-guard against that Strike.",
            "5": "Enemies inside the zone treat it as difficult terrain. Surge: fold the zone shut on a creature in it: S bludgeoning damage (basic Fortitude)."
        },
        buffNotes: [
            "The zone taken as marked (the combat mark's 1 action not charged; every foe taken as inside it — the stand fights in it)",
            "1st: the fold as a Strike activity of the stand's with a free Stride and off-guard (+2); 5th: the fold-shut surge, S bludgeoning, basic Fortitude, off-guard 1 round on a failure; 9th: a 30-ft pull (Fortitude negates) with off-guard 1 round; difficult terrain (5th/17th) not played (bands)",
            "Round 4 (cap, Δ +0.29): the fold Strike once per turn (oncePerTurn) — it was every action, a Stride and an off-guard Strike at will; the off-guard riders on the fold-shut failure (5th) and the pull (9th) dropped — the 9th back to the module text (no 9 buff entry)"
        ],
        why: "everything happens inside a zone marked in 1 minute beforehand (its Price) — a 1-minute setup the fights don't give",
        notes: ["9th's pull and 5th/17th's difficult terrain need the zone"]
    },
    "Grid Teleport": {
        build(ctx) {
            if (!ctx.buffed) return null;
            const spells = [ctx.make("Grid Teleport (drop)", { actions: 1, damage: ctx.D("bludgeoning"), kind: "bludgeoning" })];
            // (Round 2: the falling-object surge from 5th, prone on a failure from 13th; 5th's attended object as a 1-action Disarm.)
            const prone = ctx.lv >= 13 ? { failure: [["prone", null, null]], criticalFailure: [["prone", null, null]] } : {};
            if (ctx.lv >= 5) spells.push(control(ctx, "Grid Teleport (attended object)", { actions: 1, save: "reflex", disarm: ["failure", "criticalFailure"] }));
            if (ctx.lv >= 5) spells.push(ctx.make("Grid Teleport (surge, falling object)", { actions: 2, damage: ctx.S("bludgeoning"), kind: "bludgeoning", surge: true, effects: prone }));
            // (NCFILL 9th: reaction, once a round: a ranged weapon attack at a creature in your grid misses — the stand's allyAcReaction, the
            // grid taken as 15 ft around it; the D bludgeoning to an attacker in the grid isn't played.)
            const gt9 = (globalThis.process?.env?.NCFILL ?? "1") === "1" && ctx.lv >= 9 ? { allyAcReaction: { name: "Grid Teleport (teleport projectile)", value: 50, within: 15, self: true, ranged: true } } : {};
            return { spells, user: { ...(ctx.lv >= 13 ? { safeMove: { name: "Grid Teleport (teleport self)", actions: 1 } } : {}), ...gt9 } };
        },
        buff: {
            "1": "1 minute: draw a 30-ft grid. In combat, you can instead draw a 15-ft grid around your stand with 1 action; it lasts 1 minute. 1 action: teleport an unattended object in the grid to another square in it. If you teleport a loose object (a stone, a dropped weapon) into the air above a creature in the grid, it falls on it: D bludgeoning damage (basic Reflex).",
            "5": "You can teleport an attended object (Reflex negates). Surge: teleport a falling or thrown object onto a creature's square: S bludgeoning (basic Reflex).",
            "13": "Teleport yourself within the grid. A creature that fails its save against a falling object is knocked prone."
        },
        buffNotes: [
            "The grid taken as drawn (the combat grid's 1 action not charged; foes taken as inside it)",
            "1st: the drop, 1 action, 30 ft, D bludgeoning basic Reflex; 9th: the surge, S bludgeoning basic Reflex; 13th: teleporting yourself as the user's 1-action safe move; 5th's attended objects and 17th's creature teleport not played",
            "Round 2: the S surge moved from 9th to 5th; 5th's attended object played as a 1-action Disarm (Reflex negates, the held weapon dropped); 13th — prone on a failed save against the falling object"
        ],
        why: "everything happens inside a grid drawn in 1 minute beforehand (its Price) — a 1-minute setup the fights don't give",
        notes: ["9th's S bludgeoning drop and 17th's teleport need the grid"]
    },
    "Card Storage": {
        build(ctx) {
            const spells = [];
            const size = ctx.lv >= 17 ? "large" : ctx.lv >= 13 ? "medium" : "small";
            if (ctx.lv >= 5) spells.push(control(ctx, "Card Storage (store creature)", { actions: 1, save: "reflex", hinder: true, size, effects: { failure: [[GONE, null, ctx.minutes(1)]], criticalFailure: [[GONE, null, ctx.minutes(1)]] } }));
            if (ctx.buffed) {
                // (Buffed 1st: the stand flicks a card and a stored object bursts out — D bludgeoning, basic Reflex, 1 action.)
                spells.push(ctx.make("Card Storage (flicked card)", { actions: 1, damage: ctx.D("bludgeoning"), kind: "bludgeoning" }));
                // (Buffed 5th: surge, a Medium or smaller creature stored till the end of the user's next turn, 1 minute on a critical failure.)
                if (ctx.lv >= 5 && ctx.lv < 13) spells.push(control(ctx, "Card Storage (surge, store Medium)", { actions: 1, save: "reflex", surge: true, hinder: true, size: "medium", effects: { failure: [[GONE, null, ctx.rounds(2)]], criticalFailure: [[GONE, null, ctx.minutes(1)]] } }));
            }
            if (ctx.lv >= 9) spells.push(ctx.make("Card Storage (surge, card burst)", { actions: 2, damage: ctx.S("bludgeoning"), kind: "bludgeoning", surge: true }));
            return { spells };
        },
        notes: [
            "Price (the deck in hand): assumed met",
            "1st: storing objects: no combat use",
            "5th: 1 action, a Small or smaller foe stored for 1 minute (Reflex negates): out of the fight that long (the Maze hindrance; size checked); Medium from 13th, Large from 17th",
            "9th: surge (2 actions, the default): a card thrown, S bludgeoning, basic Reflex — a stored object taken as ready"
        ],
        buff: {
            "1": "1 action: store an object of Bulk 1 or less between two cards, or pull one out. 1 action: your stand flicks a card at a creature within its range and a stored object (a rock, a knife, a brick) bursts out at it: D bludgeoning damage (basic Reflex).",
            "5": "Store a Small or smaller creature (willing, or Reflex negates) for up to 1 minute. Surge, 1 action: your stand presses a card to a Medium or smaller creature and stores it (Reflex negates): it's stored until the end of your next turn, or for 1 minute on a critical failure."
        },
        buffNotes: [
            "1st: the flicked card as a 1-action D bludgeoning basic Reflex at 30 ft (a stored object taken as ready, as the 9th's)",
            "5th: the Medium store as a 1-action surge, Reflex: out of the fight 2 rounds on a failure, 1 minute on a critical failure (the Maze hindrance, size checked); dropped from 13th, where the at-will store takes Medium creatures for 1 minute"
        ]
    },
    "Hand Transfer": {
        build(ctx) {
            const spells = [];
            // (Buffed: the stand's hands as yours — its touch played at 30 ft, the stand beside the foe.)
            const touch = ctx.buffed ? "30 feet" : "touch";
            if (ctx.buffed) {
                spells.push(ctx.make("Hand Transfer (scrap)", { actions: 1, damage: ctx.D("force"), kind: "force", save: "fortitude" }));
                if (ctx.lv >= 5) spells.push(ctx.make("Hand Transfer (surge, tear)", { actions: 2, damage: ctx.S("force"), kind: "force", save: "fortitude", surge: true, effects: { failure: [["clumsy", 1, ctx.round1]], criticalFailure: [["clumsy", 1, ctx.round1]] } }));
            }
            if (ctx.lv >= 5) spells.push(control(ctx, "Hand Transfer (disarm touch)", { actions: 1, save: "reflex", range: touch, disarm: ["failure", "criticalFailure"] }));
            if (ctx.lv >= 13) spells.push(control(ctx, "Hand Transfer (move creature)", { actions: 1, save: "fortitude", range: touch, size: ctx.lv >= 17 ? "medium" : "small", move: { failure: { kind: "push", distance: 10 }, criticalFailure: { kind: "push", distance: 10 } } }));
            return { spells };
        },
        notes: [
            "1st: moving unattended objects: no combat use",
            "5th: 1 action, a touch: Reflex negates, the foe drops its held weapon (Disarm's drop)",
            "9th: the surge taking the weapon into your hand: not separately played (the at-will 5th touch already drops it; the hand-taken weapon's extra cost to the foe isn't modelled); the hole in a wall: no combat use",
            "13th: a Small creature moved to a space within 10 ft (Fortitude negates) as a 10-ft push, size checked; Medium from 17th"
        ],
        buff: {
            "1": "1 action: anything your left hand touches (Bulk 1 or less, unattended) moves to your right hand. Your stand's hands can serve as your left and right hands. 1 action: your stand's left hand touches a creature and moves a scrap of it into its right hand: D damage (basic Fortitude).",
            "5": "Attended objects (Reflex negates), letting you Disarm with a touch. Surge: tear a larger piece out of a creature your stand touches: S damage (basic Fortitude), and on a failure it's clumsy 1 for 1 round.",
            "9": "Surge: move a creature's held weapon into your hand (Reflex negates), or remove a 5-ft section of wall you touch, leaving a hole."
        },
        buffNotes: ["Round 2: the tear surge moved from 9th to 5th (same encoding)", "Every touch the stand's (30 ft from the user — the stand is beside the foe): the 1st scrap, 1 action, D force (untyped) basic Fortitude; the 5th disarm and 13th move at that range too; 9th: the tear surge, S force basic Fortitude, clumsy 1 for 1 round on a failure"]
    },
    "Gap Crush": {
        build(ctx) {
            // (1st: Strikes from a gap, +1 circumstance damage a die; 5th: the target off-guard.)
            const stand = { strikeActivities: [strikeActivity("Gap Crush (from a gap)", { damagePerWeaponDie: 1, offGuard: ctx.lv >= 5 })] };
            const spells = [];
            // (a5ce436: the crush at 5th; up to two creatures by the same gap from 9th.)
            if (ctx.lv >= (LATE ? 5 : 9)) {
                const effects = ctx.lv >= 13 ? { failure: [["immobilized", null, ctx.round1]], criticalFailure: [["immobilized", null, ctx.round1]] } : {};
                spells.push(ctx.make("Gap Crush (surge crush)", { actions: 2, damage: ctx.S("bludgeoning"), kind: "bludgeoning", save: "fortitude", surge: true, effects, target: LATE && ctx.lv >= 9 ? "up to 2 creatures" : "1 creature" }));
            }
            return { stand, spells };
        },
        notes: [
            "Price (it attacks only from a gap; defenseless on open surfaces): gaps assumed everywhere — the defenselessness not played",
            "1st: the stand's Strikes from a gap as a Strike activity: +1 damage per weapon die (from any gap in range — its reach isn't a limit in bands anyway)",
            "5th: the target off-guard (+2 to hit)",
            "9th: surge (2 actions, the default): S bludgeoning, basic Fortitude",
            "13th: immobilized 1 round on a failure (and critical failure)",
            "17th: two gaps a turn: no limit to lift"
        ]
    }
};
