// The spell ratings' own readings of spells the simulator can't cast in a fight yet (2026-10-21, the user: "Work through the cant cast
// spells. I know based on personal experience that Web is a surprisingly strong spell"). Each reads a family of the spell module's plans
// for one cast's rating (spell-power.js readingPower): what it does to the foes and allies of the rating's fights, in the engine's own
// terms — check odds, damage after resistances, rounds of a creature's threat. Fights don't cast these yet. Pure.
//   The way in: the rating's foes stand the near band's 30 feet from the party and come to it (approach) — an area that hinders their
//   way costs them Strikes, as long as it keeps them from the party.

import { DISTANCE_FEET } from "./space.js";
import { degreeDistribution } from "./checks.js";
import { saveModifier } from "./combatant.js";
import { adjustDamage, spellContext } from "./damage.js";
import { areaCapacity, canCast, conditionWorth, skillValue, spellExpectation, spellVariants, targetSets } from "./spells.js";
import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";

// A round's Strikes as the planner's threat weighs them: the third at half.
const STRIKE_WEIGHTS = [1, 1, 0.5];
export const ROUND_WEIGHT = STRIKE_WEIGHTS.reduce((sum, weight) => sum + weight, 0);

// A foe's Strikes while it comes to the party over `rounds` turns: the party 30 feet off (the near band), so it Strides until in reach
// (its Speed, its reach), then Strikes. The way's cost in feet: a difficult square 10, as PF2e counts it, its Stride's leftover Speed
// going on past the area. hinder, an area in its way: { inside (feet of the way in the area), difficult (true: difficult terrain), check
// ([critical failure, failure, success, critical success] each time it starts a move action inside, as Web's: a critical failure
// immobilized for the turn and 10 feet slower the next, a failure 10 feet slower for the rest of the turn, a critical success no more
// checks that turn), hurt (damage each square it moves inside), held ({ start: the chance it's held as the area comes, escape: odds of
// each Escape, an action }), endTurn ({ grab: the chance it's held at the end of each turn it ends inside, damage: to one held then }) }.
// { weight, damage }: its Strikes' expected weight, and the damage the area does it.
export function approach(foe, hinder = null, rounds = 3) {
    const speed = Math.max(5, Number(foe?.speed) || 25);
    const way = Math.max(0, DISTANCE_FEET.near - Math.max(5, Number(foe?.reach) || 5));
    const inside = hinder ? Math.min(way, Math.max(0, Number(hinder.inside) || 0)) : 0;
    const square = hinder?.difficult ? 10 : 5;
    const outsideCost = way - inside;
    const start = { c: inside / 5 * square + outsideCost, held: false, slow: false };
    const heldAtStart = Math.max(0, Math.min(1, Number(hinder?.held?.start) || 0));
    let dist = [{ p: 1 - heldAtStart, ...start }, ...(heldAtStart > 0 ? [{ p: heldAtStart, ...start, held: true }] : [])].filter((entry) => entry.p > 0);
    let weight = 0;
    let damage = 0;
    const hurt = Number(hinder?.hurt) || 0;
    // A Stride with budget feet: the way's inside first, then outside. [cost left, squares moved inside].
    const stride = (c, budget) => {
        const insideLeft = Math.max(0, c - outsideCost);
        const inCost = Math.min(Math.max(0, budget), insideLeft);
        const squares = Math.floor(inCost / square);
        const spent = squares * square + (inCost >= insideLeft ? Math.min(Math.max(0, budget - inCost), outsideCost) : 0);
        return [Math.max(0, c - spent), squares];
    };
    for (let turn = 0; turn < Math.max(0, rounds); turn++) {
        const next = new Map();
        const add = (p, s) => {
            const key = `${s.c}|${s.held}|${s.slow}`;
            next.set(key, { ...s, p: (next.get(key)?.p ?? 0) + p });
        };
        const endTurn = (p, s, slowNext = false) => {
            if (!(p > 0)) return;
            const after = { ...s, slow: slowNext };
            const end = hinder?.endTurn;
            if (!end || s.c <= outsideCost) return add(p, after);
            if (s.held) {
                damage += p * (Number(end.damage) || 0);
                return add(p, after);
            }
            const grab = Math.max(0, Math.min(1, Number(end.grab) || 0));
            if (grab > 0) add(p * grab, { ...after, held: true });
            add(p * (1 - grab), after);
        };
        // (budget: its Speed now; free: no more checks this turn.)
        const act = (p, s, actions, attacks, budget, free) => {
            if (!(p > 0)) return;
            if (actions <= 0) return endTurn(p, s);
            if (s.held) {
                const [critFail, fail, success, critical] = hinder.held.escape ?? [1, 0, 0, 0];
                act(p * (success + critical), { ...s, held: false }, actions - 1, attacks, budget, free);
                act(p * (critFail + fail), s, actions - 1, attacks, budget, free);
                return;
            }
            if (s.c > 0) {
                const moveWith = (q, speedNow, freeNow) => {
                    const [c, squares] = stride(s.c, speedNow);
                    damage += q * squares * hurt;
                    act(q, { ...s, c }, actions - 1, attacks, speedNow, freeNow);
                };
                const odds = s.c > outsideCost && hinder?.check && !free ? hinder.check : null;
                if (!odds) return moveWith(p, budget, free);
                const [critFail, fail, success, critical] = odds;
                endTurn(p * critFail, s, true);
                moveWith(p * fail, Math.max(0, budget - 10), false);
                moveWith(p * success, budget, false);
                moveWith(p * critical, budget, true);
                return;
            }
            weight += p * STRIKE_WEIGHTS[Math.min(attacks, STRIKE_WEIGHTS.length - 1)];
            act(p, s, actions - 1, attacks + 1, budget, free);
        };
        for (const s of dist) act(s.p, { ...s, slow: false }, 3, 0, Math.max(0, speed - (s.slow ? 10 : 0)), false);
        dist = [...next.values()];
    }
    return { weight, damage };
}

// The rounds of its threat a hindered foe loses, and the damage the area does it: its Strikes' weight unhindered less hindered, over a
// round's weight.
export function approachLoss(foe, hinder, rounds = 3) {
    const plain = approach(foe, null, rounds);
    const hindered = approach(foe, hinder, rounds);
    return { worth: Math.max(0, plain.weight - hindered.weight) / ROUND_WEIGHT, damage: hindered.damage };
}

// An instance list's average after a creature's resistances and weaknesses (formulas as PF2e writes them; a typeless one as `type`).
function averageOn(target, formulas, type = "untyped", context = null) {
    const instances = [formulas].flat().filter(Boolean).flatMap((formula) => parseDamage(String(formula))).map((instance) => ({
        type: instance.type === "untyped" ? type : instance.type,
        amount: (instance.constant ?? 0) + (instance.dice ?? []).reduce((sum, term) => sum + (term.factor ?? 1) * term.count * (term.die + 1) / 2, 0),
        persistent: instance.category === "persistent",
        context
    }));
    return instances.length ? adjustDamage(target, instances).total : 0;
}

// The foes an area holds: as many as its size holds of them bunched (areaCapacity), the first of them; in a choke point, all of them (they
// can't come but through it).
function caught(enemies, area, choke = false) {
    return choke ? enemies : enemies.slice(0, Math.max(1, areaCapacity({ type: area.type ?? "burst", value: Number(area.value) || 5 })));
}

// The feet of a foe's way inside an area: its radius; in a choke point, across it (they come through it end to end).
const insideOf = (feet, ctx) => (ctx.choke ? 2 * feet : feet);

// The better of a creature's statistics against a DC: [critical failure, failure, success, critical success].
const bestOdds = (c, statistics, dc) => degreeDistribution(Math.max(...statistics.map((slug) => (["fortitude", "reflex", "will"].includes(slug) ? saveModifier(c, slug) : skillValue(c, slug)))), Number(dc) || 10);

// The rounds an area lasts in the fight (its seconds; none said: all of it).
const lastsRounds = (seconds, rounds) => (Number(seconds) > 0 ? Math.max(1, Math.min(rounds, Math.floor(Number(seconds) / 6))) : rounds);

// --- The families -----------------------------------------------------------------------------------------------------------------------
// Each: (ctx: { state, caster, enemies, allies, entry, rank, rounds, actions, choke (true: the foes come through a choke point) }) → { entries: [{ target, damage, worth, heal, benefit }],
// targets, actions }, or { options: [such] } where it can go more than one way (the rating takes the best), or null.

const READERS = {
    // Web: its burst difficult terrain; each move action begun in it an Athletics check or a Reflex save (the better) against the spell
    // DC — a critical failure immobilized for the turn and 10 feet slower the next, a failure 10 feet slower for the turn, a critical
    // success no more checks that turn.
    "web-area": (ctx) => {
        const web = ctx.entry.plan.resolution.webArea ?? {};
        const feet = Math.max(5, ...(web.area ?? []).filter((size) => (Number(size.minRank) || 0) <= ctx.rank).map((size) => Number(size.feet) || 0));
        const lasts = lastsRounds(web.durationSeconds, ctx.rounds);
        const entries = caught(ctx.enemies, { type: "burst", value: feet }, ctx.choke).map((foe) => {
            const loss = approachLoss(foe, { inside: insideOf(feet, ctx), difficult: true, check: bestOdds(foe, [web.statistic ?? "reflex", web.skill ?? "athletics"], ctx.entry.dc) }, lasts);
            return { target: foe, damage: loss.damage, worth: loss.worth, heal: 0, benefit: 0 };
        });
        return { entries, targets: entries.length };
    },
    // Black Tentacles: the caster's spell attack against each one's Fortitude DC as it comes — grabbed and 3d6 (double on a critical hit);
    // at the end of each turn a creature ends inside, grabbed if it isn't, 1d6 if it is; a grabbed one Escapes (Athletics or Acrobatics,
    // the better, against the spell DC) before it moves.
    "tentacle-area": (ctx) => {
        const tentacles = ctx.entry.plan.resolution.tentacleArea ?? {};
        const area = ctx.entry.plan.targeting?.area ?? { type: "burst", value: 20 };
        const lasts = lastsRounds(tentacles.seconds, ctx.rounds);
        const context = spellContext(ctx.entry, { isSpell: true, area: true });
        const entries = caught(ctx.enemies, area, ctx.choke).map((foe) => {
            const [, , hit, critical] = degreeDistribution(Number(ctx.entry.attack) || 0, 10 + saveModifier(foe, tentacles.defense ?? "fortitude"));
            const capture = averageOn(foe, tentacles.capture ? `${tentacles.capture.formula}[${tentacles.capture.type}]` : "3d6[bludgeoning]", "bludgeoning", context);
            const held = averageOn(foe, tentacles.held ? `${tentacles.held.formula}[${tentacles.held.type}]` : "1d6[bludgeoning]", "bludgeoning", context);
            const loss = approachLoss(foe, { inside: insideOf(Number(area.value) || 20, ctx), held: { start: hit + critical, escape: bestOdds(foe, ["athletics", "acrobatics"], ctx.entry.dc) }, endTurn: { grab: hit + critical, damage: held } }, lasts);
            return { target: foe, damage: (hit + 2 * critical) * capture + loss.damage, worth: loss.worth, heal: 0, benefit: 0 };
        });
        return { entries, targets: entries.length };
    },
    // Difficult terrain (Mud Pit, Earthworks): its squares cost foes coming through them double.
    "terrain-area": (ctx) => {
        const terrain = ctx.entry.plan.resolution.terrainArea ?? {};
        const sizes = terrain.sizes ? Object.entries(terrain.sizes).map(([actions, feet]) => ({ actions: Number(actions), feet: Number(feet) })) : [];
        const size = sizes.find((each) => each.actions === ctx.actions) ?? sizes.at(-1);
        const feet = Number(terrain.radius) || size?.feet || Number(ctx.entry.plan.targeting?.area?.value) || 5;
        // (500 Toads: until the caster's next turn — the foes' one turn.)
        const lasts = terrain.endsAt === "caster-turn-start" ? 1 : lastsRounds(terrain.durationSeconds, ctx.rounds);
        const entries = caught(ctx.enemies, { type: "burst", value: feet }, ctx.choke).map((foe) => ({ target: foe, damage: 0, worth: approachLoss(foe, { inside: insideOf(feet, ctx), difficult: true }, lasts).worth, heal: 0, benefit: 0 }));
        return { entries, targets: entries.length, ...(size ? { actions: size.actions } : {}) };
    },
    // A hazard's area: difficult terrain (when it is) and damage for each square moved in it (Spike Stones), or at the end of the
    // caster's turns to those inside of the traits it names (Sacred Nimbus — half the time still inside, after the first); healing for the
    // party's creatures inside each turn (Field of Life); fire setting it alight (Tacky Pine Sap) left to chance — its terrain only.
    "hazard-area": (ctx) => {
        const hazard = ctx.entry.plan.resolution.hazardArea ?? {};
        const control = hazard.control ?? {};
        const area = hazard.area ?? ctx.entry.plan.targeting?.area ?? { type: "burst", value: 10 };
        const feet = area.type === "square" ? Math.max(5, (Number(area.value) || 10) / 2) : Number(area.value) || 10;
        const lasts = lastsRounds(hazard.durationSeconds, ctx.rounds);
        const steps = Math.max(0, ctx.rank - (Number(hazard.baseRank) || ctx.rank));
        const context = spellContext(ctx.entry, { isSpell: true, area: true });
        const dice = (Number(control.count) || 0) + Math.floor(steps / (Number(control.step?.interval) || 1)) * (Number(control.step?.dice) || 0);
        const flat = (Number(control.flat) || 0) + Math.floor(steps / (Number(control.step?.interval) || 1)) * (Number(control.step?.flat) || 0);
        const formula = dice > 0 ? `${dice}d${Number(control.faces) || 6}${flat ? `+${flat}` : ""}[${control.type ?? "untyped"}]` : flat > 0 ? `${flat}[${control.type ?? "untyped"}]` : null;
        if (control.kind === "life-field") {
            const heal = averageOn({ immunities: [], resistances: [], weaknesses: [] }, String(control.fixed?.[ctx.rank] ?? control.formula ?? "1d8"));
            const entries = caught(ctx.allies, area).map((ally) => ({ target: ally, damage: 0, worth: 0, heal: heal * lasts, benefit: 0 }));
            return { entries, targets: entries.length };
        }
        const entries = caught(ctx.enemies, { type: "burst", value: feet }, ctx.choke).map((foe) => {
            const fits = !control.traits?.length || control.traits.some((trait) => (foe.traits ?? []).includes(trait));
            if (control.kind === "caster-turn-end") return { target: foe, damage: fits && formula ? averageOn(foe, formula, control.type, context) * (1 + (lasts - 1) * (ctx.choke ? 1 : 0.5)) : 0, worth: 0, heal: 0, benefit: 0 };
            const hurt = control.kind === "per-square" && formula ? averageOn(foe, formula, control.type, context) : 0;
            const loss = approachLoss(foe, { inside: insideOf(feet, ctx), difficult: Boolean(hazard.terrain), hurt }, lasts);
            return { target: foe, damage: loss.damage, worth: loss.worth, heal: 0, benefit: 0 };
        }).filter((entry) => entry.damage > 0 || entry.worth > 0);
        return { entries, targets: entries.length };
    },
    // A concealing cloud (Mist), at its better place. Over the party as the foes come: it conceals the party from them until they're
    // inside it too (a round: concealed, a sixth of a round of its threat, as the engine's worth has it), then everyone in it alike; an
    // area that quickens those who start their turns in it (Quicken Time) quickens the party for that round. On the foes: its first save
    // (Searing Rain's downpour) as the engine expects it, its damage on those starting their turns inside (Dust Storm's; as they leave it,
    // half the time after the first round).
    "concealing-area": (ctx) => {
        const cloud = ctx.entry.plan.resolution.concealingArea ?? {};
        const area = cloud.area ?? { type: "burst", value: 20 };
        const quickens = cloud.turnCondition?.slug === "quickened" ? 0.3 : 0;
        const party = caught(ctx.allies, area).map((ally) => ({ target: ally, damage: 0, worth: 0, heal: 0, benefit: 0.15 + quickens }));
        const lasts = lastsRounds(cloud.durationSeconds, ctx.rounds);
        const context = spellContext(ctx.entry, { isSpell: true, area: true });
        const hazard = cloud.hazard;
        const steps = hazard ? Math.max(0, ctx.rank - (Number(hazard.baseRank) || ctx.rank)) : 0;
        const dice = hazard ? (Number(hazard.count) || 0) + Math.floor(steps / (Number(hazard.step?.interval) || 1)) * (Number(hazard.step?.dice) || 0) : 0;
        const foes = caught(ctx.enemies, area, ctx.choke);
        const first = cloud.savePlan ? spellExpectation(ctx.state, ctx.caster, { name: ctx.entry.name, plan: cloud.savePlan, castRank: ctx.rank, dc: ctx.entry.dc, attack: ctx.entry.attack, pool: null, effects: ctx.entry.effects ?? {} }, foes, 0) : [];
        const onFoes = foes.map((foe) => {
            const save = first.find((entry) => entry.target === foe);
            const turns = dice ? averageOn(foe, `${dice}d${Number(hazard.faces) || 6}[${hazard.type ?? "untyped"}]`, hazard.type, context) * (1 + (lasts - 1) * (ctx.choke ? 1 : 0.5)) : 0;
            return { target: foe, damage: (save?.damage ?? 0) + turns, worth: save?.worth ?? 0, heal: 0, benefit: 0 };
        }).filter((entry) => entry.damage > 0 || entry.worth > 0);
        return { options: [{ entries: party, targets: party.length }, ...(onFoes.length ? [{ entries: onFoes, targets: onFoes.length }] : [])] };
    }
};

// --- Castable as written another way --------------------------------------------------------------------------------------------------

// A spell the engine can't cast only for how its time or targets are written, made castable for the rating (spell-power castPower casts
// it): a reaction or a free action cast as an action (its effect is what's rated, not its timing), "1 or 2" actions as the more; its
// targets — "the triggering creature" and the like ("the creature you hit", "your hunted prey") as 1 creature, an ally's words ("1 ally",
// "the triggering ally", "up to 6 allies") as willing creatures, an area its data or its text gives ("@Template[burst|distance:10]"), no
// target at all as 1 creature for a save, else the caster; a weapon's ("one club or staff you're wielding") as its wielder's. An effect
// note's PF2e effect (effect-note) applied as the effect family applies one. Left alone (null): a spell cast in minutes or longer, and
// targets that aren't creatures (an object, a stone, a spell). An effect variant's effect for the rank cast at (rank). doc: the spell's
// data ({ system: { time, area, description } }).
const TEMPLATE = /@Template\[(?:type:)?(burst|cone|line|emanation|cylinder|square)\|distance:(\d+)/i;
export function castableReading(plan, doc, rank = Number(plan?.rank) || 1) {
    if (!plan?.resolution) return null;
    const time = String(doc?.system?.time?.value ?? plan.activation?.time ?? "").trim().toLowerCase();
    if (/minute|hour|day/.test(time)) return null;
    const actions = /^(?:reaction|free)$/.test(time) ? "1" : /^([123]) or ([123])$/.exec(time)?.[2] ?? /^([123]) to \d+ rounds$/.exec(time)?.[1] ?? null;
    const targeting = { ...(plan.targeting ?? {}) };
    const target = String(targeting.target ?? "").trim().toLowerCase();
    const text = String(doc?.system?.description?.value ?? "");
    const template = TEMPLATE.exec(text);
    const docArea = doc?.system?.area?.type ? { type: doc.system.area.type, value: Number(doc.system.area.value) || 5 } : template ? { type: template[1].toLowerCase(), value: Number(template[2]) } : null;
    const written = /^(\d+)-foot (burst|emanation|cone|line)/.exec(target);
    if (/\btrigger/.test(target)) targeting.target = /\ball(?:y|ies)\b/.test(target) ? "1 willing creature" : "1 creature";
    else if (/\ball(?:y|ies)\b/.test(target)) targeting.target = /up to (\d+)/.test(target) ? `up to ${/up to (\d+)/.exec(target)[1]} willing creatures` : "1 willing creature";
    else if (/^(?:the creature|your hunted prey|one creature|a creature)\b/.test(target)) targeting.target = "1 creature";
    else if (written) {
        targeting.target = null;
        targeting.area = { type: written[2], value: Number(written[1]) };
    } else if (/\b(?:weapon|club|staff)s?\b/.test(target) && plan.resolution.kind !== "save") targeting.target = "1 willing creature";
    else if (!target && !targeting.area?.type) {
        if (docArea) targeting.area = docArea;
        else targeting.target = plan.resolution.kind === "save" ? "1 creature" : "self";
    } else if (target && !/creature|enem|foe|target/.test(target)) return null;
    // (An effect variant — Tailwind's, Iron Gut's: the PF2e effect for the cast rank, applied as an effect's.)
    const branch = plan.resolution.kind === "effect-variant" ? (plan.resolution.selector?.branches ?? []).find((each) => (Number(each.minRank) || 0) <= rank && (each.maxRank === null || each.maxRank === undefined || rank <= Number(each.maxRank))) : null;
    const toSelf = (plan.resolution.selector?.recipientBranches ?? []).some((each) => each.actor === "source");
    let resolution = plan.resolution.kind === "effect-note" && plan.resolution.effectNote?.effect?.uuid
        ? { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: plan.resolution.effectNote.effect.uuid, label: plan.resolution.effectNote.effect.label ?? null, recipients: plan.resolution.effectNote.recipient === "self" ? "self" : "target" }] }
        : branch?.effectUuid ? { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: branch.effectUuid, label: null, recipients: toSelf ? "self" : "target" }] }
            : plan.resolution;
    // (Its action counts' areas without their shape — Disorienting Flash's "10 feet" for two actions —: the shape its data gives.)
    const byActions = resolution.native?.byActions;
    const shape = targeting.area?.type ?? docArea?.type;
    if (byActions && shape && Object.values(byActions).some((variant) => variant?.targeting?.area && !variant.targeting.area.type)) {
        resolution = { ...resolution, native: { ...resolution.native, byActions: Object.fromEntries(Object.entries(byActions).map(([count, variant]) => [count, variant?.targeting?.area && !variant.targeting.area.type ? { ...variant, targeting: { ...variant.targeting, area: { type: shape, ...variant.targeting.area } } } : variant])) } };
    }
    return { ...plan, simulatorReading: "rating", targeting, resolution, ...(actions ? { activation: { ...(plan.activation ?? {}), time: actions } } : {}) };
}

// --- Incarnate spells: phases ------------------------------------------------------------------------------------------------------------

// A phase's plan cast as the spell (its rank, DC and attack; entry.doc, its data, for a phase that doesn't say where it goes) at its best
// targets: the expectation entries of the target set worth most (a
// rough measure — damage over Hit Points and conditions' rounds over three on foes, less on allies), or [] when the engine can't cast it.
function phaseEntries(ctx, phasePlan) {
    const make = (plan) => ({ name: `${ctx.entry.name} (phase)`, plan, castRank: ctx.rank, dc: ctx.entry.dc, attack: ctx.entry.attack, pool: null, tradition: ctx.entry.tradition, effects: ctx.entry.effects ?? {} });
    let spell = make(phasePlan);
    // (A phase that names no target or area of its own: as the spell's data or text has them — castableReading, the spell's doc. A new
    // spell for it: what can be cast is remembered by the spell.)
    if (!canCast({}, spell) && ctx.entry.doc) {
        const read = castableReading(phasePlan, ctx.entry.doc);
        if (read) spell = make(read);
    }
    if (!canCast({}, spell)) return [];
    const worth = (entries) => entries.reduce((sum, { target, damage = 0, worth = 0, heal = 0, benefit = 0 }) => sum + (target.side === ctx.caster.side ? -1 : 1) * (damage / Math.max(1, target.hp.max) + worth / 3 - heal / Math.max(1, target.hp.max) - benefit / 3), 0);
    let best = [];
    let bestWorth = 0;
    for (const actions of spellVariants(spell)) {
        let sets = [];
        try {
            sets = targetSets(ctx.state, ctx.caster, spell, { enemies: ctx.enemies, allies: ctx.allies, inMelee: () => true, distance: () => 30, meleeId: null }, actions);
        } catch {
            sets = [];
        }
        for (const set of sets) {
            let entries = [];
            try {
                entries = spellExpectation(ctx.state, ctx.caster, spell, set.targets, 0, actions);
            } catch {
                entries = [];
            }
            const value = worth(entries);
            if (value > bestWorth) {
                best = entries;
                bestWorth = value;
            }
        }
    }
    return best;
}

// Entries for the same creatures added up.
function mergeEntries(lists) {
    const merged = new Map();
    for (const entry of lists.flat()) {
        const sum = merged.get(entry.target) ?? { target: entry.target, damage: 0, worth: 0, heal: 0, benefit: 0 };
        for (const field of ["damage", "worth", "heal", "benefit"]) sum[field] += entry[field] ?? 0;
        merged.set(entry.target, sum);
    }
    return [...merged.values()];
}

// Entries scaled by a chance.
const scaled = (entries, chance) => entries.map((entry) => ({ ...entry, damage: (entry.damage ?? 0) * chance, worth: (entry.worth ?? 0) * chance, heal: (entry.heal ?? 0) * chance, benefit: (entry.benefit ?? 0) * chance }));

READERS.incarnate = (ctx) => {
    // (An incarnate spell: each phase that carries a plan the engine resolves — its arrival, what it does after, its departure — once, at
    // its best targets, added up; of its options, the best. Phases a die picks among — Prismatic Spray's beams, "hidden", run by a phase
    // with a die and a table — each as likely as its faces, and the face that runs two (twice) as two of them on average.)
    const incarnate = ctx.entry.plan.resolution.incarnate ?? {};
    const choices = incarnate.options?.choices?.length ? incarnate.options.choices.map((choice) => choice.phases ?? []) : [incarnate.phases ?? []];
    const options = choices.map((phases) => {
        const lists = phases.filter((phase) => phase?.plan?.resolution && !phase.hidden).map((phase) => phaseEntries(ctx, phase.plan));
        for (const roll of phases.filter((phase) => Number(phase?.die) > 0 && phase.table)) {
            const die = Number(roll.die);
            const byKey = new Map(phases.filter((phase) => phase?.hidden && phase.plan?.resolution).map((phase) => [phase.key, phaseEntries(ctx, phase.plan)]));
            const faces = Object.values(roll.table);
            for (const [key, entries] of byKey) lists.push(scaled(entries, faces.filter((face) => face === key).length / die));
            if (roll.twice && byKey.size) for (const entries of byKey.values()) lists.push(scaled(entries, 2 / byKey.size / die));
        }
        const entries = mergeEntries(lists);
        return { entries, targets: entries.length };
    }).filter((option) => option.entries.length);
    return options.length ? { options } : null;
};

// --- Power Words, repeated saves, retaliation, a sustained save's damage ------------------------------------------------------------------

// A plan's expectation on one creature, cast as the spell (its rank, DC and attack): its entry, or null.
function singleEntry(ctx, plan, target) {
    const spell = { name: `${ctx.entry.name} (part)`, plan, castRank: ctx.rank, dc: ctx.entry.dc, attack: ctx.entry.attack, pool: null, tradition: ctx.entry.tradition, effects: ctx.entry.effects ?? {} };
    try {
        return spellExpectation(ctx.state, ctx.caster, spell, [target], 0, undefined).find((entry) => entry.target === target) ?? null;
    } catch {
        return null;
    }
}

// A duration ({ formula: "1d6" } rolled, { value, unit } fixed) in rounds, its average.
function tierRounds(outcome) {
    if (outcome.rolled?.formula) return averageOn({ immunities: [], resistances: [], weaknesses: [] }, outcome.rolled.formula) * (outcome.rolled.unit === "minutes" ? 10 : 1);
    if (outcome.fixed) return (Number(outcome.fixed.value) || 1) * (outcome.fixed.unit === "minutes" ? 10 : 1);
    return null;
}

READERS["level-tiers"] = (ctx) => {
    // (Power Word Kill, Stun, Blind: what it does by the target's level — the tiers' levels raised as the spell heightens, by its step.
    // Death or dropping to dying: the creature out of the fight, as its remaining Hit Points; 50 damage, or death at 0; stunned or
    // blinded for its rolled or fixed rounds (stunned for rounds: those rounds lost; with a value: that many actions).)
    const tiers = ctx.entry.plan.resolution.levelTiers ?? {};
    const base = Number(tiers.baseRank) || ctx.rank;
    const step = tiers.step ?? {};
    const raise = step.atRank ? (ctx.rank >= Number(step.atRank) ? Number(step.levels) || 0 : 0) : step.interval ? Math.floor(Math.max(0, ctx.rank - base) / Number(step.interval)) * (Number(step.levels) || 0) : 0;
    const tierFor = (level) => (tiers.tiers ?? []).find((tier) => (tier.min === null || tier.min === undefined || level >= Number(tier.min) + raise) && (tier.max === null || tier.max === undefined || level <= Number(tier.max) + raise));
    const entries = ctx.enemies.map((foe) => {
        const outcome = tierFor(Number(foe.level) || 0)?.outcome;
        const left = Math.max(1, foe.hp.value + (foe.hp.temp ?? 0));
        const entry = { target: foe, damage: 0, worth: 0, heal: 0, benefit: 0 };
        if (!outcome) return entry;
        if (outcome.kind === "death") entry.damage = left;
        else if (outcome.kind === "death-or-dying") entry.damage = left;
        else if (outcome.kind === "damage-or-death") entry.damage = Math.min(left, Number(outcome.amount) || 0);
        else if (outcome.kind === "condition") {
            const slug = String(outcome.name ?? "").toLowerCase();
            const rounds = tierRounds(outcome);
            if (slug === "stunned") entry.worth = rounds !== null ? Math.min(3, rounds) : Math.min(3, Number(outcome.value) || 1) / 3;
            else if (slug === "blinded") entry.worth = 0.4 * Math.min(3, rounds ?? 1);
        }
        return entry;
    }).filter((entry) => entry.damage > 0 || entry.worth > 0)
        .sort((a, b) => b.damage / b.target.hp.max + b.worth / 3 - (a.damage / a.target.hp.max + a.worth / 3));
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["repeat-save"] = (ctx) => {
    // (Implosion: its save on the target as it's cast, and, Sustained, on a new creature each round of the fight — while there are foes
    // it hasn't struck; Mask of Terror, For Love, For Lightning: the save once, on the foe it's worth most on.)
    const repeat = ctx.entry.plan.resolution.repeatSave ?? {};
    const plan = (ctx.entry.plan.resolution.grantedActions ?? []).find((action) => action?.plan?.resolution)?.plan;
    if (!plan) return null;
    const each = ctx.enemies.map((foe) => singleEntry(ctx, plan, foe)).filter((entry) => entry && (entry.damage > 0 || entry.worth > 0))
        .sort((a, b) => b.damage / b.target.hp.max + b.worth / 3 - (a.damage / a.target.hp.max + a.worth / 3));
    const casts = repeat.sustained ? Math.max(1, Math.min(ctx.rounds, Math.floor((Number(repeat.seconds) || 6) / 6))) : 1;
    const entries = each.slice(0, casts);
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS.retaliation = (ctx) => {
    // (Nettleskin and the like: the creature it protects — the caster, or the ally it's worth most on — pays back each melee hit it takes
    // with the spell's damage. Hits: the foes' Strikes at it a round (two each, from those with melee Strikes), its share of them (one of
    // its side's), over the fight while the spell lasts. Triggers other than a hit — fire damage taken in an aura — aren't counted.)
    const retaliation = ctx.entry.plan.resolution.retaliation ?? {};
    const trigger = (retaliation.triggers ?? []).find((each) => /\bhits?\b|\battacks?\b|\btouch/i.test(String(each.trigger ?? "")) && each.damage?.formula);
    if (!trigger) return null;
    const lasts = lastsRounds(retaliation.durationSeconds, ctx.rounds);
    const steps = retaliation.heightening?.interval ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(retaliation.heightening.interval)) : 0;
    const extra = steps && trigger.damage.componentId ? retaliation.heightening?.damage?.[trigger.damage.componentId] : null;
    const formula = String(trigger.damage.formula).replace(/@item\.level/g, String(ctx.rank)).replace(/\(?ceil\(([^)]*)\)\)?/g, (all, inner) => String(Math.ceil(Function(`return (${inner.replace(/[^\d+\-*/(). ]/g, "")})`)())));
    const self = /\bself\b|^you$/i.test(String(ctx.entry.plan.targeting?.target ?? "")) || !ctx.entry.plan.targeting?.target;
    const protectedOnes = self ? [ctx.caster] : ctx.allies;
    const side = Math.max(1, ctx.allies.length);
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    let best = null;
    for (const ward of protectedOnes) {
        const hits = new Map();
        for (const foe of ctx.enemies) {
            const strike = (foe.strikes ?? []).filter((each) => each.melee).sort((a, b) => b.bonus - a.bonus)[0];
            if (!strike) continue;
            let count = 0;
            for (let attack = 0; attack < 2; attack++) {
                const odds = degreeDistribution(strike.bonus - attack * (strike.agile ? 4 : 5), ward.ac ?? 15);
                count += odds[2] + odds[3];
            }
            hits.set(foe, count / side * lasts);
        }
        const entries = [...hits].map(([foe, count]) => ({ target: foe, damage: count * (averageOn(foe, `${formula}[${trigger.damage.type ?? "untyped"}]`, trigger.damage.type, context) + (extra ? steps * averageOn(foe, `${extra}[${trigger.damage.type ?? "untyped"}]`, trigger.damage.type, context) : 0)), worth: 0, heal: 0, benefit: 0 }));
        const total = entries.reduce((sum, entry) => sum + entry.damage, 0);
        if (!best || total > best.total) best = { total, entries };
    }
    return best?.total > 0 ? { entries: best.entries, targets: best.entries.length } : null;
};

READERS["sustained-save-damage"] = (ctx) => {
    // (Personal Blizzard: its save each round it's Sustained, the damage at each degree — and the persistent damage, about two rounds of
    // it — over the fight; its flat extra damage as it heightens.)
    const blizzard = ctx.entry.plan.resolution.sustainedSaveDamage ?? {};
    const lasts = lastsRounds(blizzard.durationSeconds, ctx.rounds);
    const steps = blizzard.step?.interval ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(blizzard.step.interval)) : 0;
    const type = blizzard.type ?? "untyped";
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const row = (foe, degree, flat) => {
        const entry = blizzard[degree];
        if (!entry) return 0;
        const direct = entry.formula ? averageOn(foe, `${entry.formula}[${type}]`, type, context) + flat : 0;
        const persistent = entry.persistent ? 2 * averageOn(foe, `${entry.persistent}[${type}]`, type, context) : 0;
        return direct + persistent;
    };
    const entries = ctx.enemies.map((foe) => {
        const [critFail, fail, success] = degreeDistribution(saveModifier(foe, blizzard.statistic ?? "fortitude"), Number(ctx.entry.dc) || 10);
        const perRound = success * row(foe, "success", steps * (Number(blizzard.step?.flat) || 0)) + fail * row(foe, "failure", steps * (Number(blizzard.step?.flat) || 0)) + critFail * row(foe, "criticalFailure", steps * (Number(blizzard.step?.criticalFlat) || 0));
        return { target: foe, damage: perRound * lasts, worth: 0, heal: 0, benefit: 0 };
    }).sort((a, b) => b.damage / b.target.hp.max - a.damage / a.target.hp.max);
    return entries.length && entries[0].damage > 0 ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["lantern-aura"] = (ctx) => {
    // (Infinitesimal Collapse Field, Pied Piping: an aura about the caster — every foe in it at 30 feet or more, else those its size holds
    // bunched — its save each round the fight lasts while it does, the conditions of each row at their engine worth for a round. A light
    // that grows, healing halved: not counted.)
    const aura = ctx.entry.plan.resolution.lanternAura ?? {};
    const rows = aura.rows ?? {};
    if (!Object.keys(rows).length) return null;
    const lasts = lastsRounds(aura.durationSeconds, ctx.rounds);
    const round = { mode: "fixed", value: 1, unit: "rounds" };
    const rowWorth = (row) => (row?.conditions ?? []).reduce((sum, condition) => sum + conditionWorth(condition.slug, Number.isFinite(Number(condition.value)) && condition.value !== null ? Number(condition.value) : null, round), 0);
    const foes = Number(aura.radius) >= 30 ? ctx.enemies : caught(ctx.enemies, { type: "emanation", value: Number(aura.radius) || 5 });
    const entries = foes.map((foe) => {
        const [critFail, fail, success, critical] = degreeDistribution(saveModifier(foe, aura.statistic ?? "will"), Number(ctx.entry.dc) || 10);
        const worth = critical * rowWorth(rows.criticalSuccess) + success * rowWorth(rows.success) + fail * rowWorth(rows.failure) + critFail * rowWorth(rows.criticalFailure ?? rows.failure);
        return { target: foe, damage: 0, worth: worth * lasts, heal: 0, benefit: 0 };
    }).filter((entry) => entry.worth > 0);
    return entries.length ? { entries, targets: entries.length } : null;
};

// --- Any other: the plans it carries -------------------------------------------------------------------------------------------------

// The plans a payload carries (a save, an attack, a heal the spell runs), depth first: [plan…].
function embeddedPlans(value, out = [], depth = 0) {
    if (!value || typeof value !== "object" || depth > 8 || out.length > 24) return out;
    if (Array.isArray(value)) {
        for (const item of value) embeddedPlans(item, out, depth + 1);
        return out;
    }
    if (value.resolution?.kind && value.targeting !== undefined) {
        out.push(value);
        return out;
    }
    for (const [key, item] of Object.entries(value)) if (key !== "outcomes" && key !== "native") embeddedPlans(item, out, depth + 1);
    return out;
}

// A family with no reading of its own: of the plans its payload carries, the one worth most cast at its best targets (castableReading
// where it says nowhere it goes); null with none the engine resolves.
function embeddedReader(ctx) {
    const { kind, ...payload } = ctx.entry.plan.resolution;
    let best = null;
    for (const inner of embeddedPlans(payload)) {
        const entries = phaseEntries(ctx, inner);
        const value = entries.reduce((sum, entry) => sum + (entry.target.side === ctx.caster.side ? -1 : 1) * ((entry.damage ?? 0) / Math.max(1, entry.target.hp.max) + (entry.worth ?? 0) / 3), 0)
            + entries.filter((entry) => entry.target.side === ctx.caster.side).reduce((sum, entry) => sum + (entry.heal ?? 0) / Math.max(1, entry.target.hp.max) + (entry.benefit ?? 0) / 3, 0);
        if (entries.length && (!best || value > best.value)) best = { value, entries };
    }
    return best ? { entries: best.entries, targets: best.entries.length } : null;
}

// The reading for a plan the engine can't cast, or null: its family's, or the plans its payload carries.
export function powerReading(plan) {
    const own = READERS[plan?.resolution?.kind];
    if (own) return own;
    const { kind, ...payload } = plan?.resolution ?? {};
    return kind && embeddedPlans(payload).length ? embeddedReader : null;
}

export const READING_KINDS = Object.freeze(Object.keys(READERS));
