import { low } from "../creature-tables.js";
const B1 = new Set(String(globalThis.process?.env?.BAND1 ?? "").split(",").filter(Boolean));  // (2026-11-28, band batch 1a candidates)
// Stand Abilities: mind theme (see index.js for the contract).
// (2026-11-24: "## Mind and Sense" of content/stand-abilities.md, with the buffed wording.) Defaults (abilities.mjs): a surge costs 1 Stand
// Point and 2 actions unless listed; ranges from the stand (a touch of the close-range stand played as 15 feet from its user); saves
// against the stand DC. The engine's pieces used: command notes (note-states.js: "actions on its next turn" — the target spends them and
// ends prone), "can't use reactions" notes, condition floors (floors.js), hindrances (spells.js applyHinder: "hinder:twisted" — its first
// action lost; "hinder:mazed" — out of the fight; "hinder:allyless"), controlled (control.js), asleep (unconscious), voiceless, disarm.

const BASE = ["concentrate", "occult", "stand"];
const fixed = (value, unit = "rounds") => ({ mode: "fixed", value, unit });
const DEGREES = ["criticalSuccess", "success", "failure", "criticalFailure"];

// GM Core Low Strike attack and damage averages by level (−1 to 24) — the module's minion: your level − 2, Low numbers.
const LOW_ATTACK = [4, 4, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 27, 28, 29, 31, 32, 33, 35, 36];
const LOW_DAMAGE = [2, 3, 4, 6, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 35];

// A plan of the stand's (its DC, its traits), with the rows' extras the core passes on: per degree, notes (noteEffects), modifiers,
// a condition floor, raw effects (disarm); hinder: the plan's hindrance conditions read (applyHinder); predicates: who it can target.
function plan(ctx, name, { actions = 2, traits = [], range = ctx.range, save = "will", target, area, damage = null, extra = {}, effects = {}, notes = {}, modifiers = {}, floor = null, raw = {}, hinder = false, kind = null, predicates = null }) {
    const p = ctx.savePlan(name, { actions, traits: [...BASE, ...traits], area, target, range, save, dc: ctx.dc, damage, basic: !!damage, extra, effects });
    if (area && area.type === "burst") p.targeting.range = range;
    if (damage && kind) p.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: kind, category: null }];
    for (const degree of DEGREES) {
        const row = p.resolution.outcomes[degree];
        if (notes[degree]?.length) row.noteEffects = notes[degree];
        if (modifiers[degree]?.length) row.modifiers = modifiers[degree];
        if (floor && floor.degrees.includes(degree)) row.conditionFloor = floor.floor;
        if (raw[degree]?.length) row.effects = [...row.effects, ...raw[degree]];
    }
    if (hinder) p.hinder = true;
    if (predicates) p.targeting.actorConstraints = { predicates };
    return p;
}
const command = (all = false) => ({ label: "Actions on its next turn", text: all ? "It spends all its actions on its next turn obeying the command." : "It spends its first action on its next turn obeying the command." });
const noReactions = (rounds) => ({ label: "Locked", text: "It can't use reactions.", duration: fixed(rounds) });
const both = (list) => ({ failure: list, criticalFailure: list });
// (stand10, ctx.buffed: until the start of the user's next turn.)
const untilNext = { mode: "fixed", value: 1, unit: "rounds", expiry: "turn-start" };

export const MIND = {
    "Sound Marks": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const deafB = lv >= 9 ? [["deafened", null, ctx.round1]] : [];
                const target = lv >= 5 ? "up to 2 creatures" : "1 creature";
                const boomB = (name, kind, burn) => ctx.entry(name, plan(ctx, name, { actions: 1, traits: [kind], save: "reflex", target, damage: ctx.D(kind), kind, extra: both(burn), effects: both(deafB) }));
                const out = [boomB("Sound Marks (BOOM)", "sonic", []), ctx.entry("Sound Marks (SLIP)", plan(ctx, "Sound Marks (SLIP)", { actions: 1, save: "reflex", target, effects: both([["prone"], ...deafB]) }))];
                if (lv >= 5) out.push(boomB("Sound Marks (SIZZLE)", "fire", ["1d6[persistent,fire]"]));
                // (Round 2: BIG BOOM surge from 5th — S sonic on up to 2 creatures (3 from 13th), off-guard on a failure; HEAVY from 9th,
                // its slowed 1 minute from 13th.)
                if (lv >= 5) out.push(ctx.entry("Sound Marks (surge, BIG BOOM)", plan(ctx, "Sound Marks (surge, BIG BOOM)", { traits: ["sonic"], save: "reflex", target: lv >= 13 ? "up to 3 creatures" : "up to 2 creatures", damage: ctx.S("sonic"), kind: "sonic", effects: both([["off-guard", null, untilNext], ...deafB]) }), { surge: true }));
                const slowLenB = lv >= 13 ? ctx.minutes(1) : ctx.round1;
                if (lv >= 9) out.push(ctx.entry("Sound Marks (surge, HEAVY)", plan(ctx, "Sound Marks (surge, HEAVY)", { save: "fortitude", effects: { failure: [["slowed", 1, slowLenB], ["grounded", null, ctx.round1], ...deafB], criticalFailure: [["slowed", 1, slowLenB], ["grounded", null, ctx.round1], ["immobilized", null, ctx.round1], ...deafB] } }), { surge: true }));
                if (lv >= 17) out.push(ctx.entry("Sound Marks (surge, FREEZE)", plan(ctx, "Sound Marks (surge, FREEZE)", { save: "fortitude", traits: ["incapacitation"], effects: both([["paralyzed", null, ctx.round1]]) }), { surge: true }));
                return { spells: out };
            }
            const deaf = lv >= 9 ? [["deafened", null, ctx.round1]] : [];
            const boom = (name, kind, burn) => ctx.entry(name, plan(ctx, name, { actions: 1, traits: [kind], save: "reflex", extra: both([ctx.D(kind), ...burn]), effects: both(deaf) }));
            const spells = [boom("Sound Marks (BOOM)", "sonic", []), ctx.entry("Sound Marks (SLIP)", plan(ctx, "Sound Marks (SLIP)", { actions: 1, save: "reflex", effects: both([["prone"], ...deaf]) }))];
            if (lv >= 5) spells.push(boom("Sound Marks (SIZZLE)", "fire", ["1d6[persistent,fire]"]));
            if (lv >= 13) spells.push(ctx.entry("Sound Marks (surge, HEAVY)", plan(ctx, "Sound Marks (surge, HEAVY)", { save: "fortitude", effects: { failure: [["slowed", 1, ctx.round1], ["grounded", null, ctx.round1], ...deaf], criticalFailure: [["slowed", 1, ctx.round1], ["grounded", null, ctx.round1], ["immobilized", null, ctx.round1], ...deaf] } }), { surge: true }));
            if (lv >= 17) spells.push(ctx.entry("Sound Marks (surge, FREEZE)", plan(ctx, "Sound Marks (surge, FREEZE)", { save: "fortitude", traits: ["incapacitation"], effects: both([["paralyzed", null, ctx.round1]]) }), { surge: true }));
            return { spells };
        },
        notes: [
            "BOOM: the mark's Reflex negates, so D sonic on a failure (not basic), dealt at once rather than when touched or at your next turn; two marks (5th) add nothing a 1-action use doesn't already allow.",
            "SLIP on a creature: its Reflex and the Acrobatics check to stay up folded into one Reflex save, prone on a failure; its difficult terrain isn't played. BOING (push 10 ft) isn't played.",
            "SIZZLE (5th): D fire and 1d6 persistent fire on a failure.",
            "9th: deafened for 1 round on any mark that lands (the mark lasting until it goes off).",
            "HEAVY (13th, 2-action surge): the target taken as marked already; slowed 1 and can't fly (grounded) for 1 round, immobilized too on a critical failure.",
            "FREEZE (17th, 2-action surge): paralyzed 1 round on a failure or critical failure (incapacitation)."
        ],
        buff: {
            "1": "1 action: place a mark on a surface or creature within 30 ft. Pick one: BOOM (D sonic when touched or at your next turn; on a creature, basic Reflex), SLIP (difficult terrain, Acrobatics DC or fall prone), BOING (creature entering is pushed 10 ft).",
            "5": "Keep two marks, and place both with the same action (on up to two creatures within 30 ft); add SIZZLE (fire instead of sonic, persistent 1d6 fire). Surge, BIG BOOM: up to two creatures within 30 ft get a mark that goes off at once, S sonic (basic Reflex), off-guard until the start of your next turn on a failure.",
            "9": "A creature with a mark is deafened while it lasts. You gain the HEAVY surge (see 13th) now.",
            "13": "Surge, HEAVY: target with a mark (Fortitude) is slowed 1 for 1 minute and can't fly for 1 round; critical failure also immobilized for 1 round. BIG BOOM marks up to three creatures."
        },
        buffNotes: ["BOOM/SIZZLE now basic Reflex (half on a success), D at once; from 5th BOOM, SIZZLE and SLIP take up to 2 creatures for the one action. The rest as before.", "Round 2: BIG BOOM surge (5th): S sonic basic Reflex on up to 2 creatures (3 from 13th), off-guard until the start of the user's next turn on a failure; HEAVY from 9th (was 13th), its slowed 1 minute from 13th (fixed, no save to end it)."]
    },

    "Memory Discs": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const forgetB = { failure: [["hinder:twisted:1", null, ctx.round1]], criticalFailure: [["hinder:twisted:0:will", null, ctx.minutes(1)]] };
                const out = [ctx.entry("Memory Discs (pull)", plan(ctx, "Memory Discs (pull)", { actions: 1, range: "15 feet", traits: ["mental"], damage: ctx.D("mental"), kind: "mental", effects: forgetB, hinder: true }))];
                // (Round 2: the command disc tears its way in — S mental, basic Will; two creatures from 13th.)
                if (lv >= 5) out.push(ctx.entry("Memory Discs (surge, command disc)", plan(ctx, "Memory Discs (surge, command disc)", { range: "15 feet", traits: ["mental"], target: lv >= 13 ? "up to 2 creatures" : "1 creature", damage: ctx.S("mental"), kind: "mental", notes: { failure: [command()], criticalFailure: [command(true)] } }), { surge: true }));
                if (lv >= 17) out.push(ctx.entry("Memory Discs (surge, soul disc)", plan(ctx, "Memory Discs (surge, soul disc)", { range: "15 feet", traits: ["mental", "incapacitation"], effects: { failure: forgetB.failure, criticalFailure: [["paralyzed", null, null]] }, hinder: true }), { surge: true }));
                return { spells: out };
            }
            const touch = "15 feet";
            const forget = { failure: [["hinder:twisted:1", null, ctx.round1]], criticalFailure: [["hinder:twisted:0:will", null, ctx.minutes(1)]] };
            const spells = [ctx.entry("Memory Discs (pull)", plan(ctx, "Memory Discs (pull)", { range: touch, traits: ["mental"], effects: forget, hinder: true }))];
            if (lv >= 9) spells.push(ctx.entry("Memory Discs (surge, command disc)", plan(ctx, "Memory Discs (surge, command disc)", { range: touch, traits: ["mental"], notes: { failure: [command()], criticalFailure: [command(true)] } }), { surge: true }));
            if (lv >= 17) spells.push(ctx.entry("Memory Discs (surge, soul disc)", plan(ctx, "Memory Discs (surge, soul disc)", { range: touch, traits: ["mental", "incapacitation"], effects: { failure: forget.failure, criticalFailure: [["paralyzed", null, null]] }, hinder: true }), { surge: true }));
            return { spells };
        },
        notes: [
            "Pull (1st): 'forgets one action, can't use it for 1 round' played as its first action lost once (hinder:twisted once); the critical failure's minute as its first action lost each turn, a Will save at each turn's end ending it. The skill disc for an ally isn't played.",
            "A touch of the stand's, played as 15 feet from its user.",
            "5th (one free Recall Knowledge) and 13th (casting a spell from the target's spell disc) aren't played.",
            "Command disc (9th, 2-action surge): as command — its first action obeying on a failure, all its actions on a critical failure, played as the engine's command (it drops prone).",
            "Soul disc (17th, 2-action surge, incapacitation): unconscious until the disc is put back played as paralyzed for the fight (helpless, damage doesn't wake it); its failure the pull's."
        ],
        buff: {
            "1": "1 action: stand touches a creature and tears out a disc: D mental (basic Will). Failure: it forgets one action of your choice it has used this fight and can't use it for 1 round; critical failure, 1 minute. You can also insert a skill disc into an ally, making them trained in one skill you know for 10 minutes.",
            "5": "Reading a disc you pulled gives you one Recall Knowledge result about that creature, with no roll. Surge: rip a disc out and push a command disc into a creature in its place: S mental (basic Will), and on a failure it obeys one short command as the command spell.",
            "9": "Your command discs can hold any command the command spell allows, and you can insert one into a creature you pulled a disc from this fight without touching it again (within 30 ft).",
            "13": "Surge: pull a spell disc and cast one spell the target knows of rank 4 or lower, once, before your next daily preparations. Your command disc surge can target two creatures."
        },
        buffNotes: ["Pull at 1 action instead of 2, with D mental (basic Will) beside the same rows; the command disc surge from 5th instead of 9th (9th's new wording, inserting from 30 ft, isn't played — the touch stays 15 ft). Otherwise as before.", "Round 2: the command disc surge deals S mental (basic Will) with its command rows (command on a failure, all its actions on a critical failure); up to 2 creatures from 13th."]
    },

    "Book Pages": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 2: opening the book loses incapacitation (the surge keeps it); the lasting-command surge from 5th (was 9th) with
                // S mental, basic Will; two books from 13th.)
                const traitsB = ["mental", "incapacitation"];
                const orderB = [command()];
                const out = [ctx.entry("Book Pages (open the book)", plan(ctx, "Book Pages (open the book)", { actions: 1, traits: ["mental"], damage: ctx.D("mental"), kind: "mental", effects: { criticalFailure: [["stunned", 1]] }, notes: { failure: orderB, criticalFailure: orderB } }))];
                if (lv >= 5) {
                    const lastingB = [["hinder:twisted", null, ctx.minutes(1)]];
                    // (Round 4 cap: the lasting-command surge on one creature only (was two from 13th); 17th's all-actions command dropped.)
                    out.push(ctx.entry("Book Pages (surge, lasting command)", plan(ctx, "Book Pages (surge, lasting command)", { traits: traitsB, target: "1 creature", damage: ctx.S("mental"), kind: "mental", hinder: true, effects: { failure: lastingB, criticalFailure: [["stunned", 1], ...lastingB] } }), { surge: true }));
                }
                // (2026-11-27, NCFILL2 9th: an order written before the fight — "acts quickly", +2 status to initiative (fight.js).)
                if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 9) return { spells: out, user: { bookOrder: 2 } };
                return { spells: out };
            }
            const traits = ["mental", "incapacitation"];
            const order = lv >= 5 ? [command()] : [];
            const spells = [ctx.entry("Book Pages (open the book)", plan(ctx, "Book Pages (open the book)", { traits, effects: { criticalFailure: [["stunned", 1]] }, notes: { failure: order, criticalFailure: order } }))];
            if (lv >= 9) {
                const lasting = [["hinder:twisted", null, ctx.minutes(1)]];
                spells.push(ctx.entry("Book Pages (surge, lasting command)", plan(ctx, "Book Pages (surge, lasting command)", { traits, hinder: true, effects: { failure: lasting, criticalFailure: [["stunned", 1], ...lasting] }, notes: lv >= 17 ? { criticalFailure: [command(true)] } : {} }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "Price (it sees the stand's face) taken as met; 30 feet. Reading facts (a plain failure at 1st) has no fight use; a critical failure stuns 1.",
            "5th's minor command for 1 round ('can't Strike you') played as the engine's command: its first action spent obeying (it drops prone), on a failure or critical failure.",
            "9th's surge (2 actions), the command lasting 1 minute: its first action each turn lost for 1 minute (hinder:twisted).",
            "13th (forget 10 minutes) isn't played. 17th: anything command can do — on the surge's critical failure all its next turn's actions too; the hour is past any fight."
        ],
        buff: {
            "1": "1 action: a creature that can see your stand (Will) turns into a book, its pages torn open: D mental (basic Will). Failure: you read one fact and can write a minor command in it for 1 round (see 5th); critical failure: three facts, the command, and it's stunned 1.",
            "5": "Your minor commands can be any short order (\"can't Strike you\", \"can't speak\", \"drop to the ground\"), still for 1 round. Surge (incapacitation): rip a page as you write, S mental (basic Will), and on a failure the command lasts 1 minute.",
            "9": "(The lasting command is now part of the 5th-level surge.)",
            "13": "Tear a page: the creature forgets the last 10 minutes.",
            "17": "Your commands can be anything the command spell can do (outside a fight, lasting 1 hour; incapacitation)."
        },
        buffNotes: ["Opening the book at 1 action instead of 2 with D mental (basic Will), and the minor command (the engine's command: its first action spent, drops prone) on a failure from 1st instead of 5th. 5th's wider wording changes nothing in the sim.", "Round 2: the 1-action opening has no incapacitation trait (the surge keeps it); the lasting-command surge from 5th (was 9th) with S mental basic Will beside its rows (first action lost each turn for 1 minute); up to 2 creatures from 13th.", "Round 4 (cap): the lasting-command surge takes one creature at every level (was two from 13th), and 17th's command no longer takes all its next turn's actions on a critical failure (the hour-long command is out-of-fight)."]
    },

    "Replay": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 2: +1 status to attack rolls too — you've seen how it moves; the surge's +2 for 1 minute from 5th.)
                const aura = (name, rounds, value) => {
                    const mods = [...["ac", "fortitude", "reflex", "will"].map((on) => ({ on, type: "status", value })), { on: "attack", type: "status", value: 1 }];
                    return ctx.effectModel(name, rounds, { modifiers: mods, aura: [{ radius: 30, affects: "allies", includesSelf: false, model: ctx.effectModel(name, rounds, { modifiers: mods }) }] });
                };
                const selfEffects = [{ name: "Replay (glimpse)", actions: 1, model: aura("Replay (glimpse)", 10, 1) }];
                if (lv >= 5) selfEffects.push({ name: "Replay (surge, replayed action)", actions: 1, model: aura("Replay (surge, replayed action)", 10, 2), pool: ctx.pool });
                return { spells: [], user: { selfEffects }, ...(lv >= 5 ? { spellPools: { [ctx.pool]: 2 } } : {}) };
            }
            if (lv < 9) return { spells: [] };
            const rounds = lv >= 17 ? 10 : 1;
            const modifiers = ["ac", "fortitude", "reflex", "will"].map((on) => ({ on, type: "status", value: 2 }));
            const name = "Replay (surge, replayed action)";
            const model = ctx.effectModel(name, rounds, { modifiers, aura: [{ radius: 30, affects: "allies", includesSelf: false, model: ctx.effectModel(name, rounds, { modifiers }) }] });
            return { spells: [], user: { selfEffects: [{ name, actions: 1, model, pool: ctx.pool }] }, spellPools: { [ctx.pool]: 2 } };
        },
        notes: [
            "1st (10-minute replay of a day), 5th (impersonating), 13th (a week) and 17th's foreknowledge have no fight use.",
            "9th (1-action surge): +2 status to AC and saves for you and allies within 30 feet until the end of your next turn — on all attacks and saves, not only that creature's (the engine has no scope by creature for an aura); 1 minute from 17th.",
            "Played as a self effect with an aura on the user (selfEffects, a Stand Point each); the smoke tool's counts list only spell entries."
        ],
        buff: {
            "1": "10 minutes: replay what happened in a 30-ft area during the last day. You learn everything that was seen there. Or, in a fight, 1 action: replay a creature's last few seconds; for 1 minute you and allies within 30 ft gain a +1 status bonus to AC and saves against that creature and to attack rolls against it.",
            "5": "Your stand can take the form of a creature it replayed (+4 to Impersonate). Surge, 1 action: replay a creature's last action (the 9th-level step's replay, from 5th): you learn what it did and to whom, and for 1 minute you and allies within 30 ft gain +2 status bonus to AC and saves against that creature and +1 status bonus to attack rolls against it.",
            "9": "The replayed action shows its next one too: the 5th-level surge's bonus applies against every creature that acted alongside it (no change in the sim, which already applies it to all).",
            "13": "Replay a week."
        },
        buffNotes: ["Glimpse (1st, 1 action, no Stand Point): +1 status to AC and saves for you and allies within 30 ft for 1 minute, as the 9th's self effect with an aura (against every attacker, not only that creature). The +2 surge from 5th (was 9th), 1 minute from 13th (was 17th). The Price (the stand can't fight while replaying) isn't enforced, as before.", "Round 2: both auras add +1 status to attack rolls (against every foe, no scope by creature); the surge's +2 lasts 1 minute from 5th (was 13th)."]
    },

    "Mirror World": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 2: reach out off-guard on a failure too, 1 minute and immobilized 1 round on a critical failure; the pull-in
                // surge S slashing (basic Will) as the glass cuts, two creatures from 13th.)
                const reach = plan(ctx, "Mirror World (reach out)", { actions: 1, save: "reflex", damage: ctx.D("bludgeoning"), kind: "bludgeoning", effects: { failure: [["off-guard", null, untilNext]], criticalFailure: [["off-guard", null, ctx.minutes(1)], ["immobilized", null, ctx.round1]] } });
                // (Round 4 cap: the pull-in surge's critical failure keeps it in the mirror 2 rounds (was 1 minute).)
                const out = [ctx.entry("Mirror World (reach out)", reach)];
                if (lv >= 5) {
                    const effectsB = { failure: [["hinder:mazed:100", null, ctx.round1]], criticalFailure: [["hinder:mazed:100", null, fixed(2)]] };
                    const rawB = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
                    const modsB = lv >= 17 ? both([{ selector: "attack", value: -2, type: "circumstance", duration: ctx.minutes(1) }, { selector: "saving-throw", value: -2, type: "circumstance", duration: ctx.minutes(1) }]) : {};
                    out.push(ctx.entry("Mirror World (surge, pull in)", plan(ctx, "Mirror World (surge, pull in)", { target: lv >= 13 ? "up to 2 creatures" : "1 creature", damage: ctx.D("slashing"), kind: "slashing", effects: effectsB, raw: rawB, modifiers: modsB, hinder: true }), { surge: true }));
                }
                return { spells: out };
            }
            if (lv < 5) return { spells: [] };
            const effects = { failure: [["hinder:mazed:100", null, ctx.round1]], criticalFailure: [["hinder:mazed:100", null, ctx.minutes(1)]] };
            const raw = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
            const modifiers = lv >= 17 ? both([{ selector: "attack", value: -2, type: "circumstance", duration: ctx.minutes(1) }, { selector: "saving-throw", value: -2, type: "circumstance", duration: ctx.minutes(1) }]) : {};
            return { spells: [ctx.entry("Mirror World (surge, pull in)", plan(ctx, "Mirror World (surge, pull in)", { effects, raw, modifiers, hinder: true }), { surge: true })] };
        },
        notes: [
            "Price (a mirror) taken as met. 1st (moving through the mirror) has no fight use; 13th (bringing allies) isn't played.",
            "5th (2-action surge, Will negates): pulled into the mirror for 1 round (1 minute on a critical failure) played as the engine's maze: out of the fight, unable to affect anyone or be attacked — the stand attacking it inside isn't played (nor its attacking the stand).",
            "9th: its weapons stay outside — the engine's disarm (drop) on a failure.",
            "17th: −2 to all checks against the stand played as −2 circumstance to its attack rolls and saves (every check, not only the stand's)."
        ],
        buff: {
            "1": "1 action: send your stand into a mirror; it can see the mirror world and move through it. 1 action: your stand reaches out of a reflection at a creature within 30 ft: D bludgeoning (basic Reflex); on a failure it's grabbed at and off-guard until the start of your next turn; on a critical failure it's half-dragged into the glass: off-guard for 1 minute and immobilized for 1 round.",
            "5": "Surge: pull a creature within 30 ft of the mirror into the mirror world, the glass cutting it as it passes: D slashing (basic Will); on a failure it's in the mirror world for 1 round (2 rounds on a critical failure): it can't affect anyone outside, but your stand can attack it.",
            "13": "You can bring allies in. The surge can pull in two creatures."
        },
        buffNotes: ["Reach out (1st, 1 action, 30 ft): D bludgeoning basic Reflex, off-guard until the start of the user's next turn on a critical failure; the Price (a mirror) taken as met. The 5th surge as before.", "Round 2: reach out off-guard until the start of the user's next turn on a failure; 1 minute plus immobilized 1 round on a critical failure. Pull-in surge: S slashing basic Will beside its maze rows; up to 2 creatures from 13th (allies coming in still not played).", "Round 4 (cap): the pull-in surge's critical failure keeps it in the mirror world 2 rounds (was 1 minute; the maze, out of the fight).", "Round 5 (cut to about +0.26): the pull-in surge's glass cut is D slashing (was S; round 2's addition, the module surge had no damage). Spot check L20 +0.401 (was +0.585)."]
    },

    "Dream Realm": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 4 cap, its lowered version: the dream attack's 9th-level fright is frightened 1 on a success (was 2), 2 on a
                // failure or critical failure; the sleep surge as before.)
                const out = [ctx.entry("Dream Realm (surge, sleep)", plan(ctx, "Dream Realm (surge, sleep)", { traits: ["mental", "sleep", "incapacitation"], effects: { failure: [["unconscious", null, ctx.round1]], criticalFailure: [["unconscious", null, ctx.minutes(1)]] } }), { surge: true })];
                if (lv >= 5) {
                    const f1 = lv >= 9 ? [["frightened", 1, null]] : [];
                    const f2 = lv >= 9 ? [["frightened", 2, null]] : [];
                    out.push(ctx.entry("Dream Realm (surge, dream attack)", plan(ctx, "Dream Realm (surge, dream attack)", { traits: ["mental"], damage: ctx.S("mental"), kind: "mental", effects: { success: f1, failure: f2, criticalFailure: f2 } }), { surge: true }));
                }
                return { spells: out };
            }
            const spells = [ctx.entry("Dream Realm (surge, sleep)", plan(ctx, "Dream Realm (surge, sleep)", { traits: ["mental", "sleep", "incapacitation"], effects: { failure: [["unconscious", null, ctx.round1]], criticalFailure: [["unconscious", null, ctx.minutes(1)]] } }), { surge: true })];
            if (lv >= 5) {
                const fright = lv >= 9 ? [["frightened", 2, null]] : [];
                spells.push(ctx.entry("Dream Realm (surge, dream attack)", plan(ctx, "Dream Realm (surge, dream attack)", { traits: ["mental"], damage: ctx.S("mental"), kind: "mental", effects: { success: fright, failure: fright, criticalFailure: fright } }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "Sleep (1st, 2-action surge, incapacitation): unconscious 1 round / 1 minute as the engine's asleep (damage wakes it; an ally's Interact isn't played). Talking in dreams has no fight use.",
            "Dream attack (5th, 2-action surge): S mental, basic Will — the Price's sleeping target taken as met (not checked), so it's usable on any creature.",
            "9th: it wakes frightened 2 — on the dream attack's success, failure and critical failure (the damage wakes it).",
            "13th (an ally in the dream) and 17th (forgetting) aren't played."
        ],
        buff: {
            "9": "Make the dream feel real: the creature wakes up frightened 2 (frightened 1 if it succeeded at its save against the dream attack)."
        },
        buffNotes: ["Round 4 (cap): never buffed; its buffed path is a lowered version — the dream attack's wake-up fright is frightened 1 on a success (was 2), frightened 2 on a failure or critical failure. The rest as the unbuffed build."]
    },

    "Fog Puppets": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 2: two puppets from 9th (was 17th); the fog's penalty −2 from 13th.)
                // (Round 3 tone-down: the −2 from 17th (was 13th) and to attack rolls only; AC stays −1.)
                const fogB = lv >= 17 ? -2 : -1;
                const penaltyB = [{ selector: "attack", value: fogB, type: "status", duration: ctx.minutes(1) }, { selector: "ac", value: -1, type: "status", duration: ctx.minutes(1) }];
                const out = [ctx.entry("Fog Puppets (fog)", plan(ctx, "Fog Puppets (fog)", { actions: 1, area: { type: "burst", value: lv >= 9 ? 30 : 20, foes: true }, modifiers: Object.fromEntries(DEGREES.map((degree) => [degree, penaltyB])) }))];
                if (lv >= 5) out.push(ctx.entry("Fog Puppets (surge, puppet)", plan(ctx, "Fog Puppets (surge, puppet)", { traits: ["mental", "incapacitation"], target: lv >= 9 ? "up to 2 creatures" : "1 creature", effects: { criticalFailure: [["controlled", null, ctx.round1]] }, notes: { failure: [command()] } }), { surge: true }));
                if (lv >= 5) ctx.convert("Fog Puppets (surge, bystander)", { from: "commoner", count: lv >= 9 ? 2 : 1, actions: 2, surge: true, lasts: 1, initiative: "roll" });
                return { spells: out };
            }
            const penalty = [{ selector: "attack", value: -1, type: "status", duration: ctx.minutes(1) }];
            const spells = [ctx.entry("Fog Puppets (fog)", plan(ctx, "Fog Puppets (fog)", { area: { type: "burst", value: lv >= 9 ? 30 : 20, foes: true }, modifiers: Object.fromEntries(DEGREES.map((degree) => [degree, penalty])) }))];
            if (lv >= 5) spells.push(ctx.entry("Fog Puppets (surge, puppet)", plan(ctx, "Fog Puppets (surge, puppet)", { traits: ["mental", "incapacitation"], target: lv >= 17 ? "up to 2 creatures" : "1 creature", effects: { criticalFailure: [["controlled", null, ctx.round1]] }, notes: { failure: [command()] } }), { surge: true }));
            // (Bystanders: a wounded commoner's next action controlled — played as its round on the user's side; two from 17th.)
            if (ctx.lv >= 5) ctx.convert("Fog Puppets (surge, bystander)", { from: "commoner", count: ctx.lv >= 17 ? 2 : 1, actions: 2, surge: true, lasts: 1, initiative: "roll" });
            return { spells };
        },
        notes: [
            "with bystanders (-nc build): from 5th the control surge on a (wounded) commoner — one controlled action played as its round on the user's side; two from 17th; its own use",
            "Price (an open wound) taken as met for every foe.",
            "Fog (1st, 2 actions): no save — −1 status to attack rolls for 1 minute on the foes in it at once (not those who come in later); '20-ft area' read as a 20-foot burst, 30 from 9th, within 30 feet.",
            "Puppet (5th, 2-action surge, Will, incapacitation): controlling its next action played as the engine's command on a failure (its first action spent, it drops prone) and as controlled for 1 round on a critical failure (its whole turn — more than one action).",
            "13th (illusory buildings) isn't played; 17th: two creatures."
        ],
        buff: {
            "1": "1 action: fog in a 20-ft area within 30 ft for 1 minute: wounded creatures in it take –1 status to attack rolls and AC (they can't see the blows coming through the fog).",
            "9": "Fog area 30 ft. Control two creatures.",
            "13": "The fog can make illusions of buildings or crowds.",
            "17": "The fog's penalty to attack rolls is –2."
        },
        buffNotes: ["The fog at 1 action (was 2), its −1 status now also to AC, on the foes in it at once, for 1 minute; the rest (puppet surge, bystander conversion) as before.", "Round 2: two creatures (and two bystanders) from 9th instead of 17th; the fog's penalty −2 to attack rolls and AC from 13th. The illusions still aren't played.", "Round 3 (tone-down): the fog's −2 now from 17th (was 13th) and to attack rolls only (AC stays −1)."]
    },

    "Illusion Maze": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const traitsB = ["illusion", "visual", "mental"];
                const out = [ctx.entry("Illusion Maze (fold)", plan(ctx, "Illusion Maze (fold)", { actions: 1, traits: traitsB, damage: ctx.D("mental"), kind: "mental", effects: { failure: [["off-guard", null, untilNext]], criticalFailure: [["off-guard", null, untilNext]] } }))];
                if (lv >= 5) out.push(ctx.entry("Illusion Maze (surge, lost)", plan(ctx, "Illusion Maze (surge, lost)", { range: lv >= 13 ? "60 feet" : "30 feet", area: { type: "burst", value: 10, foes: true }, traits: traitsB, effects: { failure: [["fleeing", null, ctx.round1]], criticalFailure: [["fleeing", null, globalThis.process?.env?.MAZE17 && lv >= 17 ? (globalThis.process.env.MAZE17 === "r2" ? { mode: "fixed", value: 2, unit: "rounds" } : ctx.minutes(1)) : ctx.round1]] } }), { surge: true }));  // (MAZE17: min — lost 1 minute on a critical failure; r2 — 2 rounds)
                // (Round 3 tone-down: a 10-ft burst (was 15); lost 2 rounds on a critical failure from 17th, was 1 minute.)
                // (Round 4 cap: lost 1 round on a critical failure at 17th too; the fold's critical failure off-guard until your next turn.)
                return { spells: out };
            }
            if (lv < 5) return { spells: [] };
            return { spells: [ctx.entry("Illusion Maze (surge, lost)", plan(ctx, "Illusion Maze (surge, lost)", { range: lv >= 13 ? "60 feet" : "30 feet", traits: ["illusion", "visual", "mental"], effects: { failure: [["fleeing", null, ctx.round1]], criticalFailure: [["fleeing", null, lv >= 17 ? ctx.minutes(1) : ctx.round1]] } }), { surge: true })] };
        },
        notes: [
            "1st (a 10-foot illusory corridor) has no fight use of its own.",
            "Lost (5th, 2-action surge, Will negates): 'can only Stride in a direction you choose' played as fleeing for 1 round (1 minute on a critical failure from 17th).",
            "9th (disbelief by Recall Knowledge or Seek against your DC) adds nothing: the engine plays no disbelief for it; 13th's 60-foot area read as 60 feet of range."
        ],
        buff: {
            "1": "2 actions: make an illusion of a 10-ft corridor. Or 1 action: fold the corridor around a creature within 30 ft: walls that aren't there close in, D mental (basic Will), and on a failure or critical failure it's turned around, off-guard until the start of your next turn.",
            "5": "Surge: each creature you choose in a 10-ft burst within 30 ft is lost in the maze for 1 round (Will negates): it can only Stride in a direction you choose.",
            "17": "(No longer lengthened: lost for 1 round on a critical failure too.)"
        },
        buffNotes: ["Fold (1st, 1 action, basic Will): D mental; off-guard until the start of the user's next turn on a failure, 1 minute on a critical failure. The lost surge now a 15-ft burst of foes within 30 ft (60 from 13th), fleeing as before. The Price (touching the walls breaks it) and disbelief aren't played, as before.", "Round 3 (tone-down): the fold's critical failure off-guard 2 rounds (was 1 minute); the lost surge a 10-ft burst (was 15); 17th's lost on a critical failure 2 rounds (was 1 minute).", "Round 4 (cap): the fold's critical failure off-guard until the start of the user's next turn (was 2 rounds; the double damage stays); 17th's lengthening cut — lost 1 round on a critical failure at every level."]
    },

    "Guilt Lock": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const lockRoundsB = 1;
                // (Round 4 cap: the no-reactions lock stays 1 round at 17th (was 1 minute); the surge's enfeebled 1 on a failure, 2 on a
                // critical failure (was 2 on both); 9th's slowed 1 only on the surge's critical failure.)
                const notesB = lv >= 13 ? both([noReactions(lockRoundsB)]) : {};
                const slowB = lv >= 9 ? [["slowed", 1, ctx.round1]] : [];
                const lockB = { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null]] };
                const surgeCritB = [["frightened", 2, null], ...slowB];
                const traitsB = ["mental", "emotion", "fear"];
                const out = [ctx.entry("Guilt Lock (lock)", plan(ctx, "Guilt Lock (lock)", { actions: 1, traits: traitsB, damage: ctx.D("mental"), kind: "mental", effects: lockB, notes: notesB }))];
                if (lv >= 5) {
                    const enf = lv >= 17
                        ? ["enfeebled", 2, { ...ctx.minutes(1), saveEnds: { save: "will", dc: ctx.dc, mode: "escalate", escalate: { criticalSuccess: "end", success: 0, failure: 1, criticalFailure: 1 }, max: 4 } }]
                        : ["enfeebled", 2, ctx.round1];
                    const enf1 = [enf[0], 1, enf[2]];
                    out.push(ctx.entry("Guilt Lock (surge, lock grows)", plan(ctx, "Guilt Lock (surge, lock grows)", { traits: traitsB, damage: ctx.S("mental"), kind: "mental", effects: { failure: [...lockB.failure, enf1], criticalFailure: [...surgeCritB, enf] }, notes: notesB }), { surge: true }));
                }
                return { spells: out };
            }
            const lockRounds = lv >= 17 ? 10 : 1;
            const notes = lv >= 13 ? both([noReactions(lockRounds)]) : {};
            const slow = lv >= 9 ? [["slowed", 1, ctx.round1]] : [];
            const lock = { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null], ...slow] };
            const traits = ["mental", "emotion", "fear"];
            const spells = [ctx.entry("Guilt Lock (lock)", plan(ctx, "Guilt Lock (lock)", { actions: 1, traits, effects: lock, notes }))];
            if (lv >= 5) {
                const enfeebled = lv >= 17
                    ? ["enfeebled", 2, { ...ctx.minutes(1), saveEnds: { save: "will", dc: ctx.dc, mode: "escalate", escalate: { criticalSuccess: "end", success: 0, failure: 1, criticalFailure: 1 }, max: 4 } }]
                    : ["enfeebled", 2, ctx.round1];
                spells.push(ctx.entry("Guilt Lock (surge, lock grows)", plan(ctx, "Guilt Lock (surge, lock grows)", { traits, effects: { failure: [...lock.failure, enfeebled], criticalFailure: [...lock.criticalFailure, enfeebled] }, notes }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "Price (it harmed you or an ally) taken as met. Lock (1st, 1 action, 30 ft, Will): frightened 1 / 2 (as frightened, decaying).",
            "5th (2-action surge): the lock and its growth in one — enfeebled 2 for 1 round on a failure or critical failure.",
            "9th: slowed 1 for 1 round on a critical failure. 13th: can't use reactions for 1 round while locked (1 minute from 17th).",
            "17th: enfeebled lasts 1 minute with a Will save at the end of each of its turns — a failure raises it by 1 (to 4), a critical success ends it (helping the creature it hurt isn't played)."
        ],
        buff: {
            "1": "1 action: a creature that damaged you or an ally this fight feels guilt (Will): D mental damage (basic Will), and frightened 1 on a failure, frightened 2 on a critical failure.",
            "5": "Surge: the lock grows: S mental damage (basic Will) instead of D, and enfeebled 1 for 1 round on a failure, enfeebled 2 on a critical failure.",
            "9": "The grown lock (the 5th-level surge) also makes it slowed 1 for 1 round on a critical failure.",
            "13": "It can't take reactions while locked (for 1 round, at 17th too).",
            "17": "At the end of each of its turns while locked, the creature attempts a new Will save; on a failure its enfeebled value rises by 1 (maximum 4). Helping the creature it hurt ends the lock."
        },
        buffNotes: ["The lock deals D mental (basic Will) with its frightened rows; the surge S mental with the lock's rows and enfeebled 2. Price (it harmed you or an ally) taken as met, as before.", "Round 4 (cap): the surge's enfeebled 1 on a failure (2 on a critical failure; 17th's rising enfeebled starts from that value); can't use reactions for 1 round at 17th too (was 1 minute); 9th's slowed 1 only on the surge's critical failure (not the 1-action lock's)."]
    },

    "Mimic Puppet": {
        build(ctx) {
            if (!ctx.buffed) return null;
            const { lv } = ctx;
            const out = [ctx.entry("Mimic Puppet (stumble)", plan(ctx, "Mimic Puppet (stumble)", { actions: 1, traits: ["mental"], damage: ctx.D("bludgeoning"), kind: "bludgeoning", effects: both([["prone"]]) }))];
            if (lv >= 5) {
                const guard = lv >= 13 ? [["off-guard", null, untilNext]] : [];
                // (Round 2: the puppet smashes itself first — S bludgeoning, basic Will; off-guard from 9th (was 13th).)
                const guardB = lv >= 9 ? [["off-guard", null, untilNext]] : guard;
                out.push(ctx.entry("Mimic Puppet (surge, mirror)", plan(ctx, "Mimic Puppet (surge, mirror)", { traits: ["mental", "incapacitation"], damage: ctx.S("bludgeoning"), kind: "bludgeoning", effects: both(guardB), notes: { failure: [command(lv >= 17)], criticalFailure: [command(true)] } }), { surge: true }));
            }
            return { spells: out };
        },
        why: "every combat step needs the puppet, carved in 10 minutes from a creature already touched — no fight here allows it",
        notes: ["If a puppet carved before the fight were assumed, 5th would play as the engine's command (its first action spent, drops prone; Will, incapacitation), 17th as two actions."],
        buff: {
            "1": "10 minutes: carve a puppet copy of a creature you've touched; a puppet carved before a fight lasts through it. 1 action: your puppet strikes itself and falls; its creature, within 30 ft and able to see it, copies the move: D bludgeoning (basic Will), and it falls prone on a failure.",
            "5": "Surge: the puppet slams itself, then takes 1 action (Stride, Strike, drop an item or drop prone); the target takes S bludgeoning (basic Will, incapacitation), and on a failure must copy the action on its next action; on a critical failure it copies every action the puppet takes on its next turn.",
            "9": "The puppet can Impersonate the target, and the target is off-guard to the puppet (see 13th) from now."
        },
        buffNotes: ["Buffed build: the puppet taken as carved before the fight, the Price (it sees the puppet) as met. Stumble (1st, 1 action, 30 ft, basic Will): D bludgeoning, prone on a failure. Mirror surge (5th): the engine's command — its first action on a failure (all of them from 17th), all its actions on a critical failure; 13th's off-guard as off-guard until the start of the user's next turn on a failure.", "Round 2: the mirror surge deals S bludgeoning (basic Will) beside its command rows; its off-guard from 9th (was 13th)."]
    },

    "Paper Seal": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                // (Round 2: the released fire keeps burning — 1d6 persistent fire on a failure (2d6 from 9th); from 5th the paper bursts
                // over a 10-ft burst of creatures you choose; the seal on 2 creatures from 5th, 3 from 13th.)
                const burnB = both([lv >= 9 ? "2d6[persistent,fire]" : "1d6[persistent,fire]"]);
                const unfoldOpts = lv >= 5 || B1.has("PS1") ? { area:  /* (PS1: the unfold burst from 1st, was 5th) */ { type: "burst", value: 10, foes: true }, range: "30 feet" } : {};
                const out = [ctx.entry("Paper Seal (unfold)", plan(ctx, "Paper Seal (unfold)", { actions: 1, traits: ["fire"], save: "reflex", damage: ctx.D("fire"), kind: "fire", extra: burnB, effects: { failure: [["frightened", 1, null]], criticalFailure: [["frightened", 2, null]] }, ...unfoldOpts }))];
                if (lv >= 5) out.push(ctx.entry("Paper Seal (surge, seal)", plan(ctx, "Paper Seal (surge, seal)", { traits: ["incapacitation"], target: lv >= 13 ? "up to 3 creatures" : "up to 2 creatures", hinder: true, effects: { failure: [["stunned", 1]], criticalFailure: [["hinder:mazed:100", null, lv >= 17 ? ctx.minutes(1) : ctx.round1]] } }), { surge: true }));
                return { spells: out };
            }
            if (lv < 5) return { spells: [] };
            return { spells: [ctx.entry("Paper Seal (surge, seal)", plan(ctx, "Paper Seal (surge, seal)", { traits: ["incapacitation"], target: lv >= 13 ? "up to 2 creatures" : "1 creature", hinder: true, effects: { failure: [["stunned", 1]], criticalFailure: [["hinder:mazed:100", null, lv >= 17 ? ctx.minutes(1) : ctx.round1]] } }), { surge: true })] };
        },
        notes: [
            "1st (sealing an object) has no fight use.",
            "Seal (5th, 2-action surge, Will, incapacitation): the Price (a frightened target; more than frightened 1 before 9th) taken as met, not checked — with the engine's condition check (targeting predicate) it was never used: nobody in the standard party frightens foes. Stunned 1 on a failure, sealed on a critical failure as the engine's maze (out of the fight, can't be attacked) for 1 round, 1 minute from 17th.",
            "13th: two creatures."
        ],
        buff: {
            "1": "1 action: fold a paper and seal an object inside it. 1 action: unfold a paper you sealed earlier at a creature within 30 ft, releasing what it held (a fire, boiling water, a falling stone): D damage of that kind (basic Reflex; fire if unsure), and on a failure 1d6 persistent damage of that kind and frightened 1 by what burst out at it (frightened 2 on a critical failure).",
            "5": "Unfolded papers burst over creatures you choose in a 10-ft burst within 30 ft. Surge: seal up to two frightened creatures into paper (Will, incapacitation): stunned 1 on a failure; sealed for 1 round on a critical failure.",
            "9": "Frightened 1 is enough. Unfolded papers deal 2d6 persistent damage on a failure.",
            "13": "Seal three creatures."
        },
        buffNotes: ["Unfold (1st, 1 action, 30 ft): D fire basic Reflex — papers sealed before the fight assumed at hand. The seal surge as before; its Price (a frightened target) still not enforced (taken as met).", "Round 2: unfold adds 1d6 persistent fire on a failure (2d6 from 9th) and frightened 1 / 2 on a failure / critical failure (feeding the seal's Price) and from 5th is a 10-ft burst of foes within 30 ft; the seal surge on up to 2 creatures from 5th, 3 from 13th."]
    },

    "Back Rider": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const rideB = both([{ selector: "attack", value: -1, type: "circumstance", duration: ctx.minutes(1) }]);
                const out = [ctx.entry("Back Rider (ride)", plan(ctx, "Back Rider (ride)", { actions: 1, range: "15 feet", save: "reflex", damage: ctx.D("bludgeoning"), kind: "bludgeoning", modifiers: rideB, effects: { failure: [["off-guard", null, untilNext], ["frightened", 1, null]], criticalFailure: [["off-guard", null, ctx.minutes(1)], ["frightened", 1, null]] } }))];
                if (lv >= 5) {
                    const floorB = lv >= 13 ? { degrees: ["success", "failure", "criticalFailure"], floor: { slug: "frightened", value: 1, lifetime: "fixed", duration: { value: 1, unit: "minutes" } } } : null;
                    // (Round 2: the whisper is a scream at its ear — S mental, basic Will; the trip from 9th (was 17th).)
                    out.push(ctx.entry("Back Rider (surge, whisper)", plan(ctx, "Back Rider (surge, whisper)", { range: "15 feet", traits: ["mental", "emotion", "fear", "auditory"], damage: ctx.S("mental"), kind: "mental", effects: { success: [["frightened", 1, null]], failure: [["frightened", 2, null]], criticalFailure: [["frightened", 3, null]] }, floor: floorB }), { surge: true }));
                }
                if (lv >= 9) out.push(ctx.entry("Back Rider (trip)", plan(ctx, "Back Rider (trip)", { actions: 1, range: "15 feet", save: "fortitude", effects: both([["prone"]]) })));
                // (2026-11-27, NCFILL2 17th: a foe's hit on the riding stand also hits the creature it rides — spells.js marks the ride, actions.js.)
                if ((globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 17) return { spells: out, user: { backRider17: true } };
                return { spells: out };
            }
            const touch = "15 feet";
            const ride = both([{ selector: "attack", value: -1, type: "circumstance", duration: ctx.minutes(1) }]);
            const spells = [ctx.entry("Back Rider (ride)", plan(ctx, "Back Rider (ride)", { actions: 1, range: touch, save: "reflex", modifiers: ride }))];
            if (lv >= 5) {
                const floor = lv >= 13 ? { degrees: ["success", "failure", "criticalFailure"], floor: { slug: "frightened", value: 1, lifetime: "fixed", duration: { value: 1, unit: "minutes" } } } : null;
                spells.push(ctx.entry("Back Rider (surge, whisper)", plan(ctx, "Back Rider (surge, whisper)", { range: touch, traits: ["mental", "emotion", "fear", "auditory"], effects: { success: [["frightened", 1, null]], failure: [["frightened", 2, null]], criticalFailure: [["frightened", 3, null]] }, floor }), { surge: true }));
            }
            if (lv >= 17) spells.push(ctx.entry("Back Rider (trip)", plan(ctx, "Back Rider (trip)", { actions: 1, range: touch, save: "fortitude", effects: both([["prone"]]) })));
            return { spells };
        },
        notes: [
            "Ride (1st, 1 action, Reflex negates; the stand's touch as 15 feet): −2 to its attack rolls against your stand played as −1 circumstance to all its attack rolls for 1 minute (the stand's share of its attacks; no scope by target in the engine).",
            "Whisper (5th, 2-action surge, Will): frightened 1 / 2 / 3; the stand taken as riding it already. 9th (unseen) isn't played.",
            "13th: it can't reduce frightened below 1 for 1 minute (the ride's length taken as a minute) — a condition floor on the whisper's success, failure and critical failure.",
            "17th: drop prone (Fortitude negates), played as 1 action."
        ],
        buff: {
            "1": "1 action: your stand leaps onto a creature's back unseen, D bludgeoning as it lands (basic Reflex), and rides it on a failure; you hear what it hears, the creature takes –2 to attack rolls against your stand while it rides, and it can't turn to face what's on its back: off-guard until the start of your next turn (for as long as the stand rides on a critical failure), and frightened 1 by the voice at its ear.",
            "5": "Surge: the stand screams into its ear (Will): S mental (basic Will), and frightened 1 on a success, frightened 2 on a failure, frightened 3 on a critical failure.",
            "9": "It can't see your stand at all. The stand can make it drop prone (Fortitude negates; the 17th-level step, now from 9th)."
        },
        buffNotes: ["Ride: D bludgeoning (basic Reflex) and, riding on a failure, frightened 1 on a failure or critical failure; off-guard (to everyone — no attacker scope in the engine) until the start of the user's next turn on a failure, 1 minute on a critical failure, beside the −1 circumstance to its attacks as before.", "Round 2: the whisper surge deals S mental (basic Will) beside its frightened rows; the 1-action trip (Fortitude negates, prone) from 9th instead of 17th."]
    },

    "Lie Curse": {
        build(ctx) {
            if (!ctx.buffed) return null;
            const { lv } = ctx;
            // (Round 6: on a failure the lost first action lasts too — each turn for 1 minute, a Will save at the end of each of its turns
            // ending it, as the critical failure's.)
            const twist = { failure: [["hinder:twisted:0:will", null, ctx.minutes(1)]], criticalFailure: [["hinder:twisted:0:will", null, ctx.minutes(1)]] };
            // (Round 5: its body lies — clumsy 1 for 1 minute on a failure, clumsy 2 on a critical failure.)
            twist.failure.push(["clumsy", 1, ctx.minutes(1)]);
            twist.criticalFailure.push(["clumsy", 2, ctx.minutes(1)]);
            // (Round 5b: it believes its own lies about where you are — off-guard until the start of the user's next turn on a failure,
            // 1 minute on a critical failure; from 13th you know the truth of it, and the curse takes up to two creatures.)
            twist.failure.push(["off-guard", null, untilNext]);
            twist.criticalFailure.push(["off-guard", null, ctx.minutes(1)]);
            // (Round 5c: from 13th you know the truth of what it says, and so where it means to strike: −1 circumstance to its attack
            // rolls for 1 minute on a failure, −2 on a critical failure.)
            // (Round 6: its own lies lead its blows astray — the attack penalty from 1st (was 13th); from 13th its lies frighten it too:
            // frightened 1 on a failure, frightened 2 on a critical failure.)
            if (lv >= 13) {
                twist.failure.push(["frightened", 1]);
                twist.criticalFailure.push(["frightened", 2]);
            }
            const knowB = lv >= 1 ? { failure: [{ selector: "attack", value: -1, type: "circumstance", duration: ctx.minutes(1) }], criticalFailure: [{ selector: "attack", value: -2, type: "circumstance", duration: ctx.minutes(1) }] } : {};
            const out = [ctx.entry("Lie Curse (curse)", plan(ctx, "Lie Curse (curse)", { actions: 1, range: "15 feet", traits: ["mental", "curse"], target: lv >= 13 ? "up to 2 creatures" : undefined, damage: ctx.D("mental"), kind: "mental", effects: twist, modifiers: knowB, hinder: true }))];
            // (Round 2: the tongue lock bites — S mental, basic Will, stupefied 2 for 1 minute on a critical failure; two tongues from 13th.)
            if (lv >= 5) out.push(ctx.entry("Lie Curse (surge, silence)", plan(ctx, "Lie Curse (surge, silence)", { range: "15 feet", traits: ["mental", "curse"], target: lv >= 13 ? "up to 2 creatures" : undefined, damage: ctx.S("mental"), kind: "mental", hinder: true, modifiers: knowB, effects: { failure: [...twist.failure, ["voiceless", null, ctx.round1]], criticalFailure: [...twist.criticalFailure, ["voiceless", null, ctx.minutes(1)], ["stupefied", 2, ctx.minutes(1)]] } }), { surge: true }));
            return { spells: out };
        },
        why: "lying is out of combat; 5th's lock on linguistic actions touches nothing the fights' foes use (spells aren't linguistic)",
        notes: [],
        buff: {
            "1": "1 action: curse a creature whose tongue your stand touches: the lie bites, D mental (basic Will); on a failure everything it says is a lie, and its body lies too: the first action it takes on each of its turns comes out wrong and is lost, for 1 minute (Will save at the end of each of its turns ends it), and its limbs never go quite where it means: clumsy 1 for 1 minute, its blows go where its lies say you are: a −1 circumstance penalty to attack rolls for 1 minute, and it believes its own lies about where you are: off-guard until the start of your next turn; on a critical failure it's clumsy 2, off-guard for 1 minute and takes a −2 circumstance penalty to attack rolls for 1 minute.",
            "5": "Surge: the curse (as 1st), and the tongue locks, biting down: S mental (basic Will); a cursed creature can't use actions with the linguistic trait or speak (no spells with verbal parts) for 1 round on a failure; on a critical failure 1 minute, and it's stupefied 2 for 1 minute as its own lies tangle its thoughts.",
            "13": "You know the truth of what it says, and it hears its own lies: a creature that fails its save against the curse (or the surge) is frightened 1 (frightened 2 on a critical failure). The curse and its surge can each target up to two creatures."
        },
        buffNotes: ["Buffed build: curse (1st, 1 action, the stand's touch as 15 ft, basic Will): D mental, and its rows as Memory Discs' forget — its first action lost once (hinder:twisted), each turn for 1 minute on a critical failure (Will at each turn's end ends it). Silence surge (5th): the curse's rows and the engine's voiceless (no spells but subtle ones, nothing auditory) 1 round / 1 minute. Price (an open mouth) taken as met.", "Round 2: the silence surge deals S mental (basic Will) beside its rows and adds stupefied 2 for 1 minute on a critical failure; up to 2 creatures from 13th.", "Round 5: the curse adds clumsy 1 for 1 minute on a failure, clumsy 2 for 1 minute on a critical failure, and off-guard (to everyone) until the start of the user's next turn on a failure, 1 minute on a critical failure (the surge carries the curse's rows, so it too); the surge's two creatures from 5th (was 13th); from 13th the curse takes up to 2 creatures and both curse and surge add −1 circumstance to attack rolls 1 minute on a failure (−2 on a critical failure). Spot checks L13 +0.106 (was +0.061, before the 13th step), L17 +0.163 (was +0.040).", "Round 6: the −1 circumstance attack penalty 1 minute on a failure (−2 on a critical failure) from 1st (was 13th), on curse and surge; from 13th frightened 1 on a failure / 2 on a critical failure on curse and surge. The failure's lost first action lasts like the critical failure's: each turn for 1 minute, a Will save at the end of each of its turns ending it (hinder:twisted:0:will; the surge carries it). (Level-5 drop cause: the surge's second creature — the planner surges at two foes in 15 ft and the user stands amid them, taking more damage in group fights; the attack penalty answers that.)", "Round 6 (lead): the surge's second creature moved back from 5th to 13th — two-creature surges at 5th measured +0.04 vs +0.16–0.18 with one (the user steps in to reach two foes and takes more damage in group fights)"]
    },

    "Storybook": {
        build(ctx) {
            const { lv, main } = ctx;
            const level = Math.max(-1, Math.min(24, lv - 2));
            const avg = LOW_DAMAGE[level + 1];
            const dice = Math.max(1, Math.round(avg * 0.6 / 3.5));
            const bonus = Math.max(0, Math.round(avg - dice * 3.5));
            const part = main.damage[0];
            // (stand10 round 2, ctx.buffed: the characters fight with the stand's Strike from 5th instead of 13th.)
            const strong = ["SB6", "SB7", "SB8"].some((k) => B1.has(k)) ? true : ctx.buffed ? lv >= 5 : lv >= 13;  // (SB6: SB3 + the characters at your stand's Strike from 1st)
            const damage = strong ? `${part.dice}d${part.die}+${part.bonus}[bludgeoning]` : `${dice}d6${bonus ? `+${bonus}` : ""}[bludgeoning]`;
            const hit = strong ? main.bonus : LOW_ATTACK[level + 1];
            const character = (name) => {
                // (SB3: SB1 + a character's hit leaves its target off-guard for a round; SB4: SB3 + a third character from 9th.)
                const sbFx = ["SB3", "SB4", "SB5", "SB6", "SB7", "SB8"].some((k) => B1.has(k)) ? { effects: { success: [["off-guard", null, ctx.round1]], criticalSuccess: [["off-guard", null, ctx.round1]] } } : {};
                const p = ctx.savePlan(name, { actions: 1, traits: [...BASE], range: "30 feet", attack: true, dc: ctx.dc, damage, ...sbFx });
                p.resolution.sharedDamage.components = [{ id: "0", formula: damage, type: "bludgeoning", category: null }];
                // (Bystanders: the 5th surge on a commoner who knows the story — its character, one chosen action: played as the commoner on the
            // user's side for a round (a minute from 17th).)
            if (ctx.lv >= 5) ctx.convert("Storybook (surge, bystander character)", { from: "commoner", actions: 2, surge: true, lasts: ctx.lv >= 17 ? 10 : 1, initiative: "roll", forced: true });
            return { ...ctx.entry(name, p, { attackRoll: true }), attack: hit, oncePerTurn: true };
            };
            // (2026-11-27, STORY_BODY=1, for the 13th fill's rating: the characters as real Small minions — level − 2, GM Core Low AC, HP and
            // saves, the stand's main Strike from 5th (Low before), 1 action to pull each out, then commanded (one action, both) for 1 minute
            // —, foes able to attack them; NCFILL2 13th: resistance to physical damage equal to half the user's level.)
            const body = globalThis.process?.env?.STORY_BODY === "1";
            const spells = body ? [] : [character("Storybook (command character)")];
            // (SB1: two characters from 5th (was 9th); SB2: SB1 + a third from 13th.)
            if (!body && lv >= (["SB1", "SB2", "SB3", "SB4", "SB5", "SB6", "SB7", "SB8"].some((k) => B1.has(k)) ? 5 : 9)) spells.push(character("Storybook (command second character)"));
            if (!body && ((B1.has("SB2") && lv >= 13) || ((B1.has("SB4") || B1.has("SB7")) && lv >= 9) || (B1.has("SB8") && lv >= 5))) spells.push(character("Storybook (command third character)"));
            if (body) {
                const cl = lv - 2;
                const strike = strong ? { ...structuredClone(main), name: "Character's Strike" } : { name: "Character's Strike", bonus: hit, melee: true, agile: false, unarmed: true, reach: 5, damage: [{ dice, die: 6, bonus, type: "bludgeoning" }] };
                const saves = { fortitude: low("save", cl), reflex: low("save", cl), will: low("save", cl) };
                const resist = (globalThis.process?.env?.NCFILL2 ?? "1") === "1" && lv >= 13 ? { resistances: [{ type: "physical", value: Math.floor(lv / 2), exceptions: [] }] } : {};
                const summon = ctx.raise("Storybook (pull out a character)", { count: lv >= 9 ? 2 : 1, corpse: "none", strike, ac: low("ac", cl), hp: low("hp", cl), saves, level: cl, prefix: "story", label: "Story character", traits: ["humanoid", "minion"], invisible: false, more: { size: "small", ...resist } });
                summon.actions = 1;
            }
            if (lv >= 5) {
                const rounds = lv >= 17 ? ctx.minutes(1) : ctx.round1;
                spells.push(ctx.entry("Storybook (surge, cast in the story)", plan(ctx, "Storybook (surge, cast in the story)", { ...(B1.has("SB5") || B1.has("SB7") || B1.has("SB8") ? { actions: 1 } : {}),  /* (SB8: SB7 with the third character from 5th) */ traits: ["mental"], effects: both([["fascinated", null, rounds]]), notes: both([command()]) }), { surge: true }));
            }
            return { spells };
        },
        notes: [
            "with bystanders (-nc build): from 5th the surge on a commoner — its chosen action played as the commoner fighting on the user's side for a round (1 minute from 17th), its own use",
            "Characters (1st): the Small minion's Strike, its 1-action command, as a 30-foot attack at a level − 2 creature's GM Core Low attack and damage (bludgeoning), once a turn — from 13th at your stand's main Strike's bonus and damage; 9th's second character a second such command. Pulling it out of the book (1 action, a minute) costs nothing here, the minion's own Hit Points and body (blocking, being attacked) aren't played, and its 2 commanded actions are taken as a Stride and one Strike.",
            "Cast in the story (5th, 2-action surge, Will negates): the Price (it knows the story) taken as met; fascinated for 1 round (1 minute from 17th) and the one action you choose played as the engine's command (its first action spent, it drops prone)."
        ],
        buff: {
            "5": "Surge: a creature that knows the story becomes its character (Will negates): it's fascinated by its role for 1 round, and you choose one action it uses as that character (control, see Defaults). Your characters fight with your stand's Strike (the 13th-level step, now from 5th).",
            "13": "(Characters fighting with your stand's Strike is now part of the 5th-level step.)"
        },
        buffNotes: ["Round 2 (not buffed in round 1): the characters' Strike at the stand's main Strike bonus and damage from 5th instead of 13th; everything else as before."]
    },

    "Scent Tracking": {
        build(ctx) {
            if (!ctx.buffed) return null;
            const { lv } = ctx;
            const out = [ctx.entry("Scent Tracking (scent lock)", plan(ctx, "Scent Tracking (scent lock)", { actions: 1, save: "reflex", damage: ctx.D("bludgeoning"), kind: "bludgeoning", effects: { failure: [["off-guard", null, untilNext]], criticalFailure: [["off-guard", null, ctx.minutes(1)]] } }))];
            // (Round 2: trail ahead from 5th (was 9th), the stand waiting where it steps — S bludgeoning, basic Reflex in place of Will.)
            if (lv >= 5) out.push(ctx.entry("Scent Tracking (surge, trail ahead)", plan(ctx, "Scent Tracking (surge, trail ahead)", { save: "reflex", damage: ctx.S("bludgeoning"), kind: "bludgeoning", effects: { failure: [["off-guard", null, ctx.minutes(1)]], criticalFailure: [["off-guard", null, ctx.minutes(1)], ["frightened", 1, null]] } }), { surge: true }));
            return { spells: out };
        },
        why: "tracking and locating a creature are out of combat",
        notes: [],
        buff: {
            "1": "You can track a creature by scent; +2 Survival to Track. 1 action: your stand follows the scent of a creature within 30 ft and pounces where it's about to be: D bludgeoning (basic Reflex); on a failure it's off-guard until the start of your next turn (1 minute on a critical failure), as you smell each move before it makes it.",
            "5": "You know its location within 1 mile. Surge: in a fight, read the trail it's about to make, and your stand is waiting where it steps: S bludgeoning (basic Reflex); on a failure it's off-guard for 1 minute, and frightened 1 too on a critical failure.",
            "9": "Surge: follow a scent back to learn where the target was 1 hour ago."
        },
        buffNotes: ["Buffed build: scent lock (1st, 1 action, 30 ft, basic Reflex) D bludgeoning, off-guard until the start of the user's next turn / 1 minute on a critical failure; trail ahead (9th surge) off-guard 1 round on a success, 1 minute on a failure, plus frightened 1 on a critical failure. The Price (an item it touched) taken as met: a foe in the fight leaves its scent on the field.", "Round 2: the trail-ahead surge from 5th (was 9th), now S bludgeoning basic Reflex (was Will, no damage) with the same off-guard/frightened rows.", "Round 3 (tone-down): the trail-ahead surge no longer makes it off-guard on a success (half damage only)."]
    },

    "Face Blindness": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const out = [ctx.entry("Face Blindness (slap)", plan(ctx, "Face Blindness (slap)", { actions: 1, range: "15 feet", traits: ["mental"], damage: ctx.D("mental"), kind: "mental", effects: both([["off-guard", null, untilNext]]) }))];
                if (lv >= 5) {
                    const long = fixed(lv >= 17 ? 100 : 10);
                    // (Round 2: the faces tear at its mind — S mental, basic Will; frightened 1 from 5th (was 9th).)
                    const rows = [["off-guard", null, long], ["frightened", 1, null], ...(lv >= 9 ? [["hinder:allyless", null, long]] : [])];
                    const optsB = lv >= 13 ? { area: { type: "burst", value: 20, foes: true } } : { range: "15 feet" };
                    out.push(ctx.entry("Face Blindness (surge, faceless)", plan(ctx, "Face Blindness (surge, faceless)", { ...optsB, traits: ["mental"], damage: ctx.S("mental"), kind: "mental", effects: both(rows), hinder: lv >= 9 }), { surge: true }));
                }
                return { spells: out };
            }
            if (lv < 9) return { spells: [] };
            const effects = both([["hinder:allyless", null, fixed(lv >= 17 ? 100 : 10)]]);
            const opts = lv >= 13 ? { area: { type: "burst", value: 20, foes: true } } : { range: "15 feet" };
            return { spells: [ctx.entry("Face Blindness (surge, faceless)", plan(ctx, "Face Blindness (surge, faceless)", { ...opts, traits: ["mental"], effects, hinder: true }), { surge: true })] };
        },
        notes: [
            "1st (paper gift or slapped paper) taken as done: the Price (it touched your paper) is met for the creature the stand hit, and (13th) all foes in the 20-foot area.",
            "5th (can't recognize faces) has no fight use.",
            "9th (2-action surge, Will negates): can't tell allies from enemies — the engine's allyless hindrance (no Aid or help to allies) for 1 minute (an hour from 17th). Losing its allies' flanking and auras isn't played; the rated foes help no one, so the planner finds it worth little."
        ],
        buff: {
            "1": "1 action: fold paper into a gift. Or your stand slaps a paper onto a creature it hit this turn (it counts as touching your paper): the faces around it swim, D mental (basic Will), and on a failure it can't tell which face struck it and is off-guard until the start of your next turn.",
            "5": "Surge: a creature that touches your paper sees every face melt into a stranger's: S mental (basic Will); on a failure it can't recognize faces for 1 minute, is off-guard while this lasts, and is frightened 1.",
            "9": "It can't tell allies from enemies: it can't Aid, and it can't benefit from its allies' auras or flanking."
        },
        buffNotes: ["Slap (1st, 1 action, 15 ft, basic Will): D mental; off-guard until the start of the user's next turn — the 'hit this turn' requirement not checked. Faceless surge from 5th: off-guard for its duration (1 minute; an hour from 17th); from 9th also allyless and frightened 1 (the losing-flanking/auras part still played only as allyless); 13th's 20-ft burst as before. Still a forced use (index.js), though the planner should now value it.", "Round 2: the faceless surge deals S mental (basic Will; its rows on a failure as before), and frightened 1 from 5th instead of 9th."]
    },

    "Puppet Marks": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const rawB = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
                // (2026-11-27, PUPPET_V: rider — a stand Strike's hit marks a limb, once a turn; split — a Mark action (1 action, the stand's
                // touch, no save); either way the 1-action Wrench (30 ft) and the surges need a marked limb. Unset: as before. PUPPET_FORCE=1:
                // the Mark early.)
                const PV = globalThis.process?.env?.PUPPET_V ?? "rider4";  // (2026-11-27: (a)+(b) adopted; PUPPET_V= for the old mark-and-tug)
                const marked = (entry) => { if (PV) entry.plan.needs = [{ target: { conditions: ["puppet-marked"], within: PV === "rider3" ? 60 : 30 } }]; return entry; };
                // (rider2: Wrench 2D and off-guard till your next turn on any hit, marks for the fight, 17th control at four marks; rider3: also
                // 60 ft and two creatures a wrench from 9th.)
                const r2 = ["rider2", "rider3", "rider4"].includes(PV), r3 = PV === "rider3";
                const og = [["off-guard", null, ctx.round1]];
                const ctl = r2 && lv >= 17 ? [["puppet-control"]] : [];
                // (2026-11-27, PM_BUFF: stun — stunned 1 on a critical failure against Wrench; 3d — also 3D; surge — also the 5th surge needs no mark
                // and marks two limbs.)
                const PB = globalThis.process?.env?.PM_BUFF ?? "surge2";  // (2026-11-27: surge2 adopted, +0.269; PM_BUFF= for rider4 alone)
                const pbStun = ["stun", "3d", "surge", "surge2"].includes(PB), pb3 = ["3d", "surge"].includes(PB), pbSurge = ["surge", "surge2"].includes(PB);  // (surge2: stun + the surge, Wrench at 2D)
                const wrenchDmg = r2 ? ctx.D("bludgeoning").replace(/^(\d+)d/, (m, n) => `${(pb3 ? 3 : 2) * Number(n)}d`) : ctx.D("bludgeoning");
                const wrenchFx = r2 ? { success: og, failure: [["prone"], ...og, ...ctl], criticalFailure: [["prone"], ...og, ...ctl, ...(pbStun ? [["stunned", 1, null]] : [])] } : both([["prone"]]);
                const out = PV
                    ? [marked(ctx.entry("Puppet Marks (wrench)", plan(ctx, "Puppet Marks (wrench)", { actions: 1, range: r3 ? "60 feet" : "30 feet", save: "fortitude", damage: wrenchDmg, kind: "bludgeoning", effects: wrenchFx, ...(r3 && lv >= 9 ? { target: "up to 2 creatures" } : {}) })))]
                    : [ctx.entry("Puppet Marks (mark and tug)", plan(ctx, "Puppet Marks (mark and tug)", { actions: 1, range: "15 feet", save: "fortitude", damage: ctx.D("bludgeoning"), kind: "bludgeoning", effects: both([["prone"]]) }))];
                if (globalThis.process?.env?.PUPPET_FORCE === "1") out[0] = { ...out[0], forceEarly: true };
                if (PV === "split") {
                    const m = ctx.entry("Puppet Marks (mark)", plan(ctx, "Puppet Marks (mark)", { actions: 1, range: "15 feet", save: "fortitude", effects: { criticalSuccess: [["puppet-marked"]], success: [["puppet-marked"]], failure: [["puppet-marked"]], criticalFailure: [["puppet-marked"]] } }));
                    out.push(globalThis.process?.env?.PUPPET_FORCE === "1" ? { ...m, forceEarly: true } : m);
                }
                // (Round 2: the limb wrenched hard — S bludgeoning, basic Fortitude; the control surge (and its bystander) from 13th, was 17th.)
                if (lv >= 5 && pbSurge) { const mk = [["puppet-marked"], ["puppet-marked"]]; const fb = [["prone"], ["off-guard", null, ctx.minutes(1)]]; out.push(ctx.entry("Puppet Marks (surge, move limb)", plan(ctx, "Puppet Marks (surge, move limb)", { range: "15 feet", save: "fortitude", damage: ctx.S("bludgeoning"), kind: "bludgeoning", effects: { criticalSuccess: mk, success: mk, failure: [...mk, ...fb], criticalFailure: [...mk, ...fb] }, raw: rawB }), { surge: true })); }
                else if (lv >= 5) out.push(marked(ctx.entry("Puppet Marks (surge, move limb)", plan(ctx, "Puppet Marks (surge, move limb)", { range: "15 feet", save: "fortitude", damage: ctx.S("bludgeoning"), kind: "bludgeoning", effects: both([["prone"], ["off-guard", null, ctx.minutes(1)]]), raw: rawB }), { surge: true })));
                if (lv >= 13) out.push(marked(ctx.entry("Puppet Marks (surge, control)", plan(ctx, "Puppet Marks (surge, control)", { range: "15 feet", traits: ["mental", "incapacitation"], effects: { criticalFailure: [["controlled", null, ctx.round1]] }, notes: { failure: [command()] } }), { surge: true })));
                if (lv >= 13) ctx.convert("Puppet Marks (surge, bystander)", { from: "commoner", actions: 2, surge: true, lasts: 1, initiative: "roll", forced: true });
                return { spells: out, ...(["rider", "rider2", "rider3", "rider4"].includes(PV) ? { stand: { puppetRider: true, ...(PV === "rider4" ? { puppetRiderAll: true } : {}) } } : {}) };
            }
            if (lv < 5) return { spells: [] };
            const touch = "15 feet";
            const raw = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
            const spells = [ctx.entry("Puppet Marks (surge, move limb)", plan(ctx, "Puppet Marks (surge, move limb)", { range: touch, save: "fortitude", effects: both([["prone"]]), raw }), { surge: true })];
            if (lv >= 17) spells.push(ctx.entry("Puppet Marks (surge, control)", plan(ctx, "Puppet Marks (surge, control)", { range: touch, traits: ["mental", "incapacitation"], effects: { criticalFailure: [["controlled", null, ctx.round1]] }, notes: { failure: [command()] } }), { surge: true }));
            // (Bystanders: 17th's control surge on a marked commoner — its action played as a round on the user's side.)
            if (ctx.lv >= 17) ctx.convert("Puppet Marks (surge, bystander)", { from: "commoner", actions: 2, surge: true, lasts: 1, initiative: "roll", forced: true });
            return { spells };
        },
        notes: [
            "with bystanders (-nc build): 17th's control surge on a marked commoner, played as its round on the user's side; its own use",
            "1st's mark (1 action, the stand's touch) taken as placed: the surges play from 15 feet against a marked creature without the action.",
            "Move limb (5th, 2-action surge, Fortitude negates): prone on a failure; 9th's two marked limbs: prone and it drops its held weapon (the engine's disarm).",
            "13th (choosing where it Strides) isn't played.",
            "Control (17th, 2-action surge): no save is named — a Will save with incapacitation taken; the engine's command on a failure, controlled 1 round on a critical failure."
        ],
        buff: {
            "1": "1 action: mark a limb your stand touches, and wrench it at once: D bludgeoning (basic Fortitude), and it falls prone on a failure.",
            "5": "Surge: wrench a marked limb: S bludgeoning (basic Fortitude); on a failure the creature drops an item or falls prone, and its marked limb keeps jerking: off-guard for 1 minute.",
            "13": "Surge: you choose where the creature goes on its next Stride. Surge: control one of its actions (see Defaults; the 17th-level step, now from 13th)."
        },
        buffNotes: ["Mark and tug (1st, 1 action, the stand's touch as 15 ft, basic Fortitude): D bludgeoning, prone on a failure. The move-limb surge adds off-guard for 1 minute on a failure (prone and, from 9th, the disarm as before). 17th's control and its bystander conversion as before.", "Round 2: the move-limb surge deals S bludgeoning (basic Fortitude) beside its rows; the control surge and its bystander conversion from 13th instead of 17th (choosing its Stride still not played)."]
    },

    "Web Control": {
        build(ctx) {
            const { lv } = ctx;
            if (ctx.buffed) {
                const muteB = lv >= 13 ? [["voiceless", null, ctx.round1]] : [];
                const rawB = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
                // (Round 5b: the snare catches every creature you choose in its 10-ft square — a 5-ft burst of foes within 30 ft.)
                const out = [ctx.entry("Web Control (snare)", plan(ctx, "Web Control (snare)", { actions: 1, save: "reflex", area: { type: "burst", value: 5, foes: true }, range: "30 feet", damage: ctx.D("slashing"), kind: "slashing", effects: { failure: [["off-guard", null, untilNext], ["immobilized", null, untilNext]], criticalFailure: [["off-guard", null, ctx.minutes(1)], ["immobilized", null, ctx.round1]] } }))];
                // (Round 5: the snare holds on a failure — immobilized until the start of the user's next turn too; off-guard 1 minute on a
                // critical failure.)
                // (Round 5c: from 13th the webs gag and wrap it: the bind's failure lasts 1 minute, and a critical failure restrains it for
                // 1 round beside the minute.)
                // (Round 2: the bind snaps a web over a 15-ft burst of creatures you choose, D slashing basic Reflex; 1 minute on a critical
                // failure from 5th (was 17th).)
                // (WEB17: strike — 1 action, a stuck creature Strikes an adjacent creature you choose (Will negates): played as confused for its next
                // turn; restrained — the 5th-level bind also restrains on a failure; off unless set.)
                const web17 = globalThis.process?.env?.WEB17 ?? "critrestrained";  // (adopted 2026-11-27)
                if (web17 === "strike" && lv >= 17) { const pp = plan(ctx, "Web Control (puppet strike)", { actions: 1, save: "will", range: "30 feet", effects: { failure: [["confused", null, ctx.round1]], criticalFailure: [["confused", null, ctx.round1]] } }); pp.needs = [{ target: { conditions: ["immobilized"], within: 30 } }]; out.push(ctx.entry("Web Control (puppet strike)", pp)); }
                if (lv >= 5) out.push(ctx.entry("Web Control (surge, bind)", plan(ctx, "Web Control (surge, bind)", { save: "reflex", area: { type: "burst", value: 15, foes: true }, range: "30 feet", damage: ctx.D("slashing"), kind: "slashing", effects: lv >= 13 ? { failure: [["immobilized", null, ctx.minutes(1)], ["off-guard", null, ctx.minutes(1)], ...muteB], criticalFailure: [["restrained", null, ctx.round1], ["immobilized", null, ctx.minutes(1)], ["off-guard", null, ctx.minutes(1)], ...muteB] } : { failure: [["immobilized", null, ctx.round1], ["off-guard", null, ctx.round1], ...muteB], criticalFailure: [["immobilized", null, ctx.minutes(1)], ["off-guard", null, ctx.minutes(1)], ...muteB] }, raw: rawB }), { surge: true }));
                if (web17 === "restrained" && lv >= 17) for (const e of out) if (e.name === "Web Control (surge, bind)") e.plan.resolution.outcomes.failure.effects.push({ kind: "condition", slug: "restrained", value: null, duration: ctx.round1 });
                // (WEB17=critrestrained: restrained for 1 round on a critical failure only.)
                if (web17 === "critrestrained" && lv >= 17) for (const e of out) if (e.name === "Web Control (surge, bind)") { const row = e.plan.resolution.outcomes.criticalFailure.effects; if (!row.some((x) => x.slug === "restrained")) row.push({ kind: "condition", slug: "restrained", value: null, duration: ctx.round1 }); }
                return { spells: out };
            }
            if (lv < 5) return { spells: [] };
            const mute = lv >= 13 ? [["voiceless", null, ctx.round1]] : [];
            const raw = lv >= 9 ? both([{ kind: "disarm", what: "drop" }]) : {};
            return { spells: [ctx.entry("Web Control (surge, bind)", plan(ctx, "Web Control (surge, bind)", { save: "reflex", effects: { failure: [["immobilized", null, ctx.round1], ...mute], criticalFailure: [["immobilized", null, lv >= 17 ? ctx.minutes(1) : ctx.round1], ...mute] }, raw }), { surge: true })] };
        },
        notes: [
            "Price (existing webs) taken as met: the buffed 1st spins them (1 action, a 10-foot square of difficult terrain for 1 minute) — the web itself and its sensing aren't played.",
            "Bind (5th, 2-action surge, 30 ft, Reflex negates): immobilized 1 round (1 minute on a critical failure from 17th).",
            "9th: it drops its held weapon (the engine's disarm) on a failure; 13th: it can't speak — voiceless (no spells but subtle ones, nothing auditory) for 1 round."
        ],
        buff: {
            "1": "You sense through any web within 60 ft. 1 action: your stand spins a web over a 10-ft square within 30 ft (difficult terrain for 1 minute); each creature you choose in the square is cut by the tightening strands, D slashing (basic Reflex), and stuck fast on a failure: off-guard and immobilized until the start of your next turn; on a critical failure off-guard for 1 minute and immobilized for 1 round.",
            "5": "Surge: webs snap shut over creatures you choose in a 15-ft burst within 30 ft: D slashing (basic Reflex); on a failure immobilized and off-guard for 1 round, on a critical failure for 1 minute.",
            "13": "Block speech through a web: the creature can't speak. The webs gag and wrap it: the 5th-level bind lasts 1 minute on a failure, and on a critical failure it's also restrained for 1 round.",
            "17": "(The 1-minute bind on a critical failure is now part of the 5th-level surge.)"
        },
        buffNotes: ["Snare (1st, 1 action, 30 ft, basic Reflex): D slashing; off-guard until the start of the user's next turn, immobilized 1 round too on a critical failure (the square's difficult terrain isn't played). Bind adds off-guard for as long as it's immobilized (1 round; 1 minute on a critical failure from 17th).", "Round 2: the bind surge is a 15-ft burst of foes within 30 ft with D slashing (basic Reflex); its 1 minute on a critical failure from 5th (was 17th). The webs as terrain still aren't played.", "Round 5: the snare immobilizes until the start of the user's next turn on a failure too (beside off-guard); off-guard 1 minute on a critical failure (was until the start of the user's next turn); the snare hits every chosen creature in its square (a 5-ft burst of foes within 30 ft); from 13th the bind's failure lasts 1 minute (immobilized + off-guard, voiceless still 1 round) and its critical failure adds restrained 1 round. Spot check L13 +0.150 (was +0.106)."]
    }
};
