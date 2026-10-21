// The spell ratings' own readings of spells the simulator can't cast in a fight yet (2026-10-21, the user: "Work through the cant cast
// spells. I know based on personal experience that Web is a surprisingly strong spell"). Each reads a family of the spell module's plans
// for one cast's rating (spell-power.js readingPower): what it does to the foes and allies of the rating's fights, in the engine's own
// terms — check odds, damage after resistances, rounds of a creature's threat. Fights don't cast these yet. Pure.
//   The way in: the rating's foes stand the near band's 30 feet from the party and come to it (approach) — an area that hinders their
//   way costs them Strikes, as long as it keeps them from the party.

import { DISTANCE_FEET } from "./space.js";
import { degreeDistribution } from "./checks.js";
import { armorClass, multipleAttackPenalty, saveModifier } from "./combatant.js";
import { expectedHitDamage } from "./actions.js";
import { weaponRunesAt } from "./party.js";
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
// tick: persistent damage (bleed always is) as a round's of it, counted as it's taken then.
function averageOn(target, formulas, type = "untyped", context = null, tick = false) {
    const instances = [formulas].flat().filter(Boolean).flatMap((formula) => parseDamage(String(formula))).map((instance) => ({
        type: instance.type === "untyped" ? type : instance.type,
        amount: (instance.constant ?? 0) + (instance.dice ?? []).reduce((sum, term) => sum + (term.factor ?? 1) * term.count * (term.die + 1) / 2, 0),
        persistent: !tick && instance.category === "persistent",
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

// --- One-offs (2026-10-21, batch 8) --------------------------------------------------------------------------------------------------

// A foe's damage a round on a creature of armour class `ac`: its best Strike twice (the second at −5), critical hits doubled; of its
// Strikes, those `which` takes.
function strikeDamageOn(foe, ac, which = () => true) {
    let best = 0;
    for (const strike of (foe.strikes ?? []).filter(which)) {
        const average = (strike.damage ?? []).reduce((sum, part) => sum + (Number(part.dice) || 0) * ((Number(part.die) || 0) + 1) / 2 + (Number(part.bonus) || 0), 0);
        let total = 0;
        for (let attack = 0; attack < 2; attack++) {
            const odds = degreeDistribution((Number(strike.bonus) || 0) - attack * (strike.agile ? 4 : 5), ac);
            total += (odds[2] + 2 * odds[3]) * average;
        }
        best = Math.max(best, total);
    }
    return best;
}

// The Hit Points a better AC (by `bonus`) keeps off a creature over `rounds`: the foes' damage on it less, its share of their attacks.
function acSaved(ctx, ally, bonus, rounds) {
    const ac = Number(ally.ac) || 15;
    const side = Math.max(1, ctx.allies.length);
    return ctx.enemies.reduce((sum, foe) => sum + strikeDamageOn(foe, ac) - strikeDamageOn(foe, ac + bonus), 0) * rounds / side;
}

// Hit Points as healing on allies (the rating counts healing up to what each lacks, against the foes' harm): entries.
const healEntries = (allies, amount) => allies.map((ally) => ({ target: ally, damage: 0, worth: 0, heal: amount, benefit: 0 }));

READERS["spell-mark"] = (ctx) => {
    // (Invoke True Name: off-guard to the caster's side and a weakness to their next hit — each of the party's hits a round, its share of
    // the fight; once, where it says so. Glimpse Weakness: a weakness to the party's Strikes for its duration.)
    const mark = ctx.entry.plan.resolution.spellMark ?? {};
    const lasts = lastsRounds(mark.durationSeconds ?? 60, ctx.rounds);
    const hits = 2;
    const entries = ctx.enemies.map((foe) => {
        const weakness = mark.weakness ? (Number(mark.weakness.perRank) || 0) * ctx.rank * (mark.weakness.once ? 1 : hits * lasts) : 0;
        const strikeWeakness = mark.strikeWeakness ? ((Number(mark.strikeWeakness.base) || 0) + (Number(mark.strikeWeakness.perRank) || 0) * ctx.rank) * hits * lasts : 0;
        const worth = mark.offGuard ? conditionWorth("off-guard", null, { mode: "fixed", value: lasts, unit: "rounds" }) : 0;
        return { target: foe, damage: weakness + strikeWeakness, worth, heal: 0, benefit: 0 };
    }).sort((a, b) => b.damage / b.target.hp.max + b.worth / 3 - (a.damage / a.target.hp.max + a.worth / 3));
    return entries.length && (entries[0].damage > 0 || entries[0].worth > 0) ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["protection-circle"] = (ctx) => {
    // (Circle of Protection: its status bonus to AC for the caster's side in it — against foes of the alignment it's against: unholy or
    // holy ones; the low bonus.)
    const circle = ctx.entry.plan.resolution.protectionCircle ?? {};
    if (!ctx.enemies.some((foe) => (foe.traits ?? []).some((trait) => trait === "unholy" || trait === "holy"))) return null;
    const lasts = lastsRounds(circle.seconds, ctx.rounds);
    const entries = ctx.allies.map((ally) => ({ target: ally, damage: 0, worth: 0, heal: acSaved(ctx, ally, Number(circle.low) || 1, lasts), benefit: 0 }));
    return { entries, targets: entries.length };
};

READERS["interposing-cover"] = (ctx) => {
    // (Interposing Earth: cover for an ally against the round's attacks — its AC bonus — and the damage reduction; as a raised wall at the
    // 4th rank, more.)
    const cover = ctx.entry.plan.resolution.interposingCover ?? {};
    const raised = cover.raised && ctx.rank >= Number(cover.raised.rank) ? cover.raised : null;
    const reduction = Number(raised?.reduction ?? cover.reduction) || 0;
    const ally = ctx.allies.slice().sort((a, b) => (a.ac ?? 0) - (b.ac ?? 0))[0];
    if (!ally) return null;
    const hits = ctx.enemies.length / Math.max(1, ctx.allies.length);
    return { entries: healEntries([ally], acSaved(ctx, ally, Number(cover.cover?.ac) || 2, 1) + reduction * hits), targets: 1 };
};

READERS["strike-absorber"] = (ctx) => {
    // (Protector Tree: its Hit Points taken in place of an ally's — the hits on those beside it, as long as it stands.)
    const tree = ctx.entry.plan.resolution.strikeAbsorber ?? {};
    const hp = (Number(tree.hp) || 0) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(tree.step?.interval) || 1)) * (Number(tree.step?.hp) || 0);
    const lasts = lastsRounds(tree.durationSeconds, ctx.rounds);
    const drawn = ctx.enemies.reduce((sum, foe) => sum + strikeDamageOn(foe, Number(tree.ac) || 10), 0) * lasts / Math.max(1, ctx.allies.length);
    return hp > 0 ? { entries: healEntries([ctx.allies[0]], Math.min(hp, drawn)), targets: 1 } : null;
};

READERS["rebound-barrier"] = (ctx) => {
    // (Rebounding Barrier: its resistance off a physical hit on the caster — the biggest of the foes' — and its damage back on the one who
    // struck.)
    const barrier = ctx.entry.plan.resolution.reboundBarrier ?? {};
    const steps = Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(barrier.step?.interval) || 1);
    const resistance = (Number(barrier.resistance) || 0) + Math.floor(steps) * (Number(barrier.step?.resistance) || 0);
    const back = (Number(barrier.damage) || 0) + Math.floor(steps) * (Number(barrier.step?.damage) || 0);
    const foe = ctx.enemies.slice().sort((a, b) => strikeDamageOn(b, ctx.caster.ac ?? 15) - strikeDamageOn(a, ctx.caster.ac ?? 15))[0];
    if (!foe) return null;
    const hit = strikeDamageOn(foe, ctx.caster.ac ?? 15) / 2;
    return { entries: [...healEntries([ctx.caster], Math.min(resistance, hit)), { target: foe, damage: back, worth: 0, heal: 0, benefit: 0 }], targets: 2 };
};

READERS["death-ward"] = (ctx) => {
    // (Phoenix Ward: the healing as the ally would fall — its dice at the rank.)
    const ward = ctx.entry.plan.resolution.deathWard ?? {};
    const heal = ward.heal ? ((Number(ward.heal.dice) || 0) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(ward.heal.step?.interval) || 1)) * (Number(ward.heal.step?.dice) || 0)) * ((Number(ward.heal.faces) || 0) + 1) / 2 : 0;
    return heal > 0 ? { entries: healEntries([ctx.allies[0]], heal), targets: 1 } : null;
};

READERS["turn-healing"] = (ctx) => {
    // (Positive Attunement, Fated Healing: its healing as cast and at each turn's end it lasts — on the ally it's worth most on; its
    // heightened dice. Not one aimed at foes too.)
    const turns = ctx.entry.plan.resolution.turnHealing ?? {};
    if (turns.endsForHostile) return null;
    const base = Number(ctx.entry.plan.rank) || ctx.rank;
    const extra = turns.heightening?.interval ? Math.floor(Math.max(0, ctx.rank - base) / Number(turns.heightening.interval)) : 0;
    const each = averageOn({ immunities: [], resistances: [], weaknesses: [] }, String(turns.formula ?? "1d8")) * (1 + extra);
    const lasts = lastsRounds(turns.durationSeconds, ctx.rounds);
    const times = lasts + (turns.immediate ? 1 : 0) - 1;
    return { entries: healEntries(ctx.allies.slice(0, Math.max(1, Number(turns.targets) || 1)), each * Math.max(1, times)), targets: Math.max(1, Number(turns.targets) || 1) };
};

READERS.luminance = (ctx) => {
    // (Vital Luminance: its reservoir as it grows over the fight — what it starts with and gains each turn, more a rank — Dismissed into
    // the most hurt ally.)
    const light = ctx.entry.plan.resolution.luminance ?? {};
    const steps = Math.max(0, ctx.rank - (Number(light.baseRank) || ctx.rank)) * (Number(light.step) || 0);
    const pool = (Number(light.start) || 0) + steps + ((Number(light.perTurn) || 0) + steps) * Math.max(0, ctx.rounds - 1);
    return pool > 0 ? { entries: healEntries([ctx.allies[0]], pool), targets: 1 } : null;
};

READERS.wisps = (ctx) => {
    // (Flame Wisp: a wisp flung at a foe after each of the caster's damaging Strikes — one a round while there are wisps, as the caster
    // Strikes each round at its best.)
    const wisps = ctx.entry.plan.resolution.wisps ?? {};
    const dice = (Number(wisps.dice) || 1) + Math.floor(Math.max(0, ctx.rank - (Number(wisps.baseRank) || ctx.rank)) / (Number(wisps.heightening?.interval) || 2)) * (Number(wisps.heightening?.dice) || 0);
    const times = Math.min(Number(wisps.count) || 1, lastsRounds(wisps.durationSeconds, ctx.rounds));
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const foe = ctx.enemies[0];
    return foe ? { entries: [{ target: foe, damage: times * averageOn(foe, `${dice}d${Number(wisps.die) || 4}[${wisps.type ?? "fire"}]`, wisps.type, context), worth: 0, heal: 0, benefit: 0 }], targets: 1 } : null;
};

READERS["aura-turn-effect"] = (ctx) => {
    // (Unblinking Flame Ignition: its aura burns each foe in range — at the beginning of each of their turns — every round it lasts.)
    const aura = ctx.entry.plan.resolution.auraTurnEffect ?? {};
    if (!aura.damage?.formula) return null;
    const lasts = lastsRounds(aura.durationSeconds, ctx.rounds);
    const context = spellContext(ctx.entry, { isSpell: true, area: true });
    const entries = caught(ctx.enemies, aura.area ?? { type: "emanation", value: 5 }).map((foe) => ({ target: foe, damage: lasts * averageOn(foe, aura.damage.formula, "untyped", context), worth: 0, heal: 0, benefit: 0 }));
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["thrall-summon"] = (ctx) => {
    // (Skeletal Lancers and the like: what the thralls do of themselves — damage each time a foe near one makes a Strike (two a round),
    // every foe near one of them; their charges and the rest wait on other spells.)
    const thralls = ctx.entry.plan.resolution.thrallSummon ?? {};
    const hit = (thralls.controls ?? []).find((control) => control.kind === "damage" && control.formula);
    if (!hit) return null;
    const lasts = lastsRounds(thralls.seconds, ctx.rounds);
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const entries = ctx.enemies.slice(0, Math.max(1, Number(thralls.count) || 1)).map((foe) => ({ target: foe, damage: 2 * lasts * averageOn(foe, hit.formula, "untyped", context), worth: 0, heal: 0, benefit: 0 }));
    return { entries, targets: entries.length };
};

READERS["illusory-creature"] = (ctx) => {
    // (Illusory Creature, Shadow Illusion: the illusion's Strike — the caster's spell attack against a foe's AC, its damage at the rank —
    // each round of the fight, its two actions a Strike and a Stride; till it's disbelieved, not counted.)
    const illusion = ctx.entry.plan.resolution.illusoryCreature ?? {};
    const strike = illusion.strike;
    if (!strike?.dice) return null;
    const dice = Number(strike.dice) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(strike.step?.interval) || 1)) * (Number(strike.step?.dice) || 0);
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const entries = ctx.enemies.map((foe) => {
        const odds = degreeDistribution(Number(ctx.entry.attack) || 0, Number(foe.ac) || 15);
        return { target: foe, damage: (odds[2] + 2 * odds[3]) * averageOn(foe, `${dice}d${Number(strike.faces) || 4}[${strike.type ?? "bludgeoning"}]`, strike.type, context) * ctx.rounds, worth: 0, heal: 0, benefit: 0 };
    }).sort((a, b) => b.damage / b.target.hp.max - a.damage / a.target.hp.max);
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["against-caster-area"] = (ctx) => {
    // (Menacing Lament: the foes in range off-guard for its round.)
    const lament = ctx.entry.plan.resolution.againstCaster ?? {};
    const rounds = lament.duration?.unit === "rounds" ? Number(lament.duration.value) || 1 : 1;
    const entries = caught(ctx.enemies, { type: "emanation", value: Number(lament.radius) || 30 }).map((foe) => ({ target: foe, damage: 0, worth: conditionWorth("off-guard", null, { mode: "fixed", value: rounds, unit: "rounds" }), heal: 0, benefit: 0 }));
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["cover-square"] = (ctx) => {
    // (Extradimensional Cover: its AC bonus — standard cover's — for the ally in it, while it lasts.)
    const cover = ctx.entry.plan.resolution.coverSquare ?? {};
    const bonus = Math.max(0, ...(cover.rules ?? []).filter((rule) => rule.key === "FlatModifier" && rule.selector === "ac" && !rule.predicate).map((rule) => Number(rule.value) || 0));
    const ally = ctx.allies.slice().sort((a, b) => (a.ac ?? 0) - (b.ac ?? 0))[0];
    return bonus > 0 && ally ? { entries: healEntries([ally], acSaved(ctx, ally, bonus, lastsRounds(cover.seconds, ctx.rounds))), targets: 1 } : null;
};

READERS["repulsion-aura"] = (ctx) => {
    // (Magnetic Repulsion: its penalty on the foes' attacks at the caster — the plain one, more as it heightens — while it lasts; on metal
    // and armour, more again, not counted.)
    const aura = ctx.entry.plan.resolution.repulsionAura ?? {};
    const steps = aura.penalty?.step?.interval ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(aura.penalty.step.interval)) * (Number(aura.penalty.step.add) || 0) : 0;
    const penalty = (Number(aura.penalty?.base) || 0) + steps;
    if (!(penalty > 0)) return null;
    const lasts = lastsRounds(aura.durationSeconds, ctx.rounds);
    const ac = Number(ctx.caster.ac) || 15;
    const saved = ctx.enemies.reduce((sum, foe) => sum + strikeDamageOn(foe, ac) - strikeDamageOn(foe, ac + penalty), 0) * lasts / Math.max(1, ctx.allies.length);
    return { entries: healEntries([ctx.caster], saved), targets: 1 };
};

READERS["weapon-throw"] = (ctx) => {
    // (Hand of the Apprentice: the caster's weapon flung with its spell attack — its best melee Strike's damage and its spellcasting
    // modifier, +4 to 1st level, +5 from 10th, +6 from 17th.)
    const weapon = (ctx.caster.strikes ?? []).filter((strike) => strike.melee).sort((a, b) => b.bonus - a.bonus)[0];
    const dice = (weapon?.damage ?? []).reduce((sum, part) => sum + (Number(part.dice) || 0) * ((Number(part.die) || 0) + 1) / 2, 0) || 3.5;
    const modifier = (ctx.caster.level ?? 1) >= 17 ? 6 : (ctx.caster.level ?? 1) >= 10 ? 5 : 4;
    const entries = ctx.enemies.map((foe) => {
        const odds = degreeDistribution(Number(ctx.entry.attack) || 0, Number(foe.ac) || 15);
        return { target: foe, damage: (odds[2] + 2 * odds[3]) * (dice + modifier), worth: 0, heal: 0, benefit: 0 };
    }).sort((a, b) => b.damage / b.target.hp.max - a.damage / a.target.hp.max);
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["tree-pair"] = (ctx) => {
    // (Tree of Life and Death: the death tree's void damage on the foes under its canopy — a die a rank, a basic save, each round — and the
    // life tree's healing for the party under its own, a die a rank each round; at its best, each side under its tree.)
    const trees = ctx.entry.plan.resolution.treePair ?? {};
    const lasts = lastsRounds(trees.seconds, ctx.rounds);
    const context = spellContext(ctx.entry, { isSpell: true, area: true });
    const entries = [];
    if (trees.harm) {
        for (const foe of caught(ctx.enemies, { type: "burst", value: Number(trees.canopy) || 10 })) {
            const [critFail, fail, success] = degreeDistribution(saveModifier(foe, trees.harm.statistic ?? "fortitude"), Number(ctx.entry.dc) || 10);
            entries.push({ target: foe, damage: (2 * critFail + fail + 0.5 * success) * averageOn(foe, `${ctx.rank}d${Number(trees.harm.faces) || 4}[${trees.harm.type ?? "void"}]`, trees.harm.type, context) * lasts, worth: 0, heal: 0, benefit: 0 });
        }
    }
    if (trees.heal) entries.push(...healEntries(caught(ctx.allies, { type: "burst", value: Number(trees.canopy) || 10 }), ctx.rank * ((Number(trees.heal.faces) || 4) + 1) / 2 * lasts));
    return entries.length ? { entries, targets: entries.length } : null;
};

// --- Strikes (2026-10-21, batch 10): a spell that is a Strike, adds to one, or arms one -----------------------------------------------

// A Strike's expected damage on a foe — the engine's hit and critical hit, after its resistances — at the multiple attack penalty of the
// `attacks` before it, `bonus` to hit, the foe off-guard (2 lower; a rogue's sneak attack on), and `extra` damage on a hit (an average,
// doubled on a critical hit).
function strikeOn(striker, strike, foe, { attacks = 0, bonus = 0, offGuard = false, extra = 0 } = {}) {
    const odds = degreeDistribution((Number(strike.bonus) || 0) + bonus - multipleAttackPenalty(strike, attacks), armorClass(foe) - (offGuard ? 2 : 0));
    const options = { offGuardChance: offGuard ? 1 : 0 };
    return odds[2] * (expectedHitDamage(striker, strike, foe, false, options) + extra) + odds[3] * (expectedHitDamage(striker, strike, foe, true, options) + 2 * extra);
}

// A Strike's chance to hit (a hit or a critical hit), as strikeOn rolls it.
function hitChance(strike, foe, { attacks = 0, bonus = 0, offGuard = false } = {}) {
    const odds = degreeDistribution((Number(strike.bonus) || 0) + bonus - multipleAttackPenalty(strike, attacks), armorClass(foe) - (offGuard ? 2 : 0));
    return odds[2] + odds[3];
}

// The Strike a spell's caster makes, at its best (the user: "Dont lower the ranking of spells based on how hard they are to use
// practically"): the party's best weapon Strike of the kind on the first foe — a martial's, as a magus or a monk makes it: "melee",
// "ranged", or "unarmed" (a fist: the best melee Strike's bonus and dice, d6s, agile). { striker, strike }, or null.
function bestStrike(ctx, kind = "melee") {
    const foe = ctx.enemies[0];
    if (!foe) return null;
    let best = null;
    for (const ally of ctx.allies) {
        for (const strike of ally.strikes ?? []) {
            if ((kind === "ranged") === Boolean(strike.melee) || !strike.damage?.length) continue;
            const value = strikeOn(ally, strike, foe);
            if (!best || value > best.value) best = { striker: ally, strike, value };
        }
    }
    if (!best || kind !== "unarmed") return best;
    const [part] = best.strike.damage;
    return { striker: best.striker, strike: { name: "Fist", bonus: best.strike.bonus, melee: true, agile: true, traits: ["agile", "finesse", "nonlethal", "unarmed"], damage: [{ dice: Number(part.dice) || 1, die: 6, bonus: Number(part.bonus) || 0, type: "bludgeoning" }] } };
}

// The rounds a foe stays held (grabbed) when it tries to Escape each turn — the better of its Athletics and Acrobatics against dc — up
// to `most`.
function heldRounds(foe, dc, most) {
    const [, , success, critical] = bestOdds(foe, ["athletics", "acrobatics"], dc);
    let total = 0;
    let still = 1;
    for (let round = 0; round < most; round++) {
        total += still;
        still *= 1 - (success + critical);
    }
    return total;
}

// Damage spread over foes, each up to its Hit Points, the first first: entries.
function spreadDamage(enemies, total) {
    const entries = [];
    let left = total;
    for (const foe of enemies) {
        if (!(left > 0)) break;
        const dealt = Math.min(left, Math.max(0, foe.hp.value));
        entries.push({ target: foe, damage: dealt, worth: 0, heal: 0, benefit: 0 });
        left -= dealt;
    }
    return entries;
}

// The entry dealing most to a foe, as a share of its Hit Points: those entries sorted so.
const byShare = (entries) => entries.sort((a, b) => b.damage / b.target.hp.max + b.worth / 3 - (a.damage / a.target.hp.max + a.worth / 3));

READERS["spell-strike"] = (ctx) => {
    // (Shooting Star, Spinning Staff, Shielding Strike, Tracking Mayflies and the like: the Strike or Strikes it makes — the caster's at its
    // best, the multiple attack penalty on the second, against another foe where it says — its conditions on a hit (a grab held while the
    // foe fails to Escape), a shield raised first; the target off-guard where it can be. Its movement and other riders not counted.)
    const spec = ctx.entry.plan.resolution.spellStrike ?? {};
    const best = bestStrike(ctx, spec.unarmed ? "unarmed" : spec.range === "ranged" ? "ranged" : "melee");
    if (!best) return null;
    const count = Math.max(1, Number(spec.count) || 1);
    const offGuard = Boolean(spec.offGuardQuestion);
    const riders = [spec.hitCondition, ...(spec.hitConditions ?? [])].filter((rider) => rider?.slug);
    const onFoe = (foe, attacks) => {
        const worth = riders.reduce((sum, rider) => {
            const rounds = rider.escapeEnds ? heldRounds(foe, ctx.entry.dc, lastsRounds((Number(rider.minutes) || 1) * 60, ctx.rounds)) : Number(rider.rounds) || null;
            return sum + conditionWorth(rider.slug, rider.value ?? null, rounds ? { mode: "fixed", value: rounds, unit: "rounds" } : null);
        }, 0);
        return { target: foe, damage: strikeOn(best.striker, best.strike, foe, { attacks, offGuard }), worth: hitChance(best.strike, foe, { attacks, offGuard }) * worth, heal: 0, benefit: 0 };
    };
    const firsts = byShare(ctx.enemies.map((foe) => onFoe(foe, 0)));
    const entries = spec.differentTargets
        ? firsts.slice(0, count).map((first, attacks) => (attacks ? onFoe(first.target, attacks) : first))
        : mergeEntries(Array.from({ length: count }, (_, attacks) => [onFoe(firsts[0].target, attacks)]));
    if (spec.preAction === "raise-a-shield") entries.push(...healEntries([best.striker], acSaved(ctx, best.striker, 2, 1)));
    return { entries, targets: entries.length };
};

READERS["strike-effects"] = (ctx) => {
    // (Inner Upheaval, Force Fling, Fulminating Impact: the Strike it makes — a Flurry of Blows' two, where it can — with what its effects
    // add to it (the attack and damage of those before it), and to the caster's Strikes the rest of the fight (those after it: two
    // Strikes a round, spread over the foes).)
    const resolution = ctx.entry.plan.resolution;
    const text = (resolution.strike?.rules ?? []).join(" ");
    const kind = /\bunarmed Strike\b/i.test(text) ? "unarmed" : /\branged Strike\b/i.test(text) && !/\bmelee Strike\b/i.test(text) ? "ranged" : "melee";
    const best = bestStrike(ctx, kind);
    if (!best) return null;
    const terms = new Set(kind === "ranged" ? ["item:ranged"] : ["item:melee", ...(kind === "unarmed" ? ["item:unarmed", "item:category:unarmed"] : [])]);
    const models = (after) => (resolution.applications ?? []).filter((application) => (application.phase === "after") === after).map((application) => ctx.entry.effects?.[application.uuid]).filter(Boolean);
    const added = (after, on) => models(after).reduce((sum, model) => sum + [...(model.modifiers ?? []), ...(model.conditional ?? []).filter((modifier) => (modifier.predicate ?? []).every((term) => terms.has(term)))]
        .filter((modifier) => modifier.on === on).reduce((total, modifier) => total + (Number(modifier.value) || 0), 0), 0);
    const strikes = /Flurry of Blows/i.test(text) ? 2 : 1;
    const now = { bonus: added(false, "attack"), extra: added(false, "damage") };
    const cast = byShare(ctx.enemies.map((foe) => ({ target: foe, damage: Array.from({ length: strikes }, (_, attacks) => strikeOn(best.striker, best.strike, foe, { attacks, ...now })).reduce((sum, each) => sum + each, 0), worth: 0, heal: 0, benefit: 0 })))[0];
    const later = { bonus: added(true, "attack"), extra: added(true, "damage") };
    const lasts = Math.max(0, ...models(true).map((model) => lastsRounds((Number(model.rounds) || 1) * 6, ctx.rounds))) - 1;
    const foe = ctx.enemies[0];
    const more = lasts > 0 && (later.bonus > 0 || later.extra > 0)
        ? [0, 1].reduce((sum, attacks) => sum + strikeOn(best.striker, best.strike, foe, { attacks, ...later }) - strikeOn(best.striker, best.strike, foe, { attacks }), 0) * lasts
        : 0;
    const entries = mergeEntries([[cast], spreadDamage(ctx.enemies, more)]);
    return { entries, targets: entries.length };
};

READERS["stance-strike"] = (ctx) => {
    // (Wild Winds Stance, Clinging Shadows Stance: a monk's stance at its best — a Strike reaching past a fist's saves the Stride into
    // reach: a third Strike the first round, at its penalty, with the stance's damage die and type; its AC bonus against the foes' ranged
    // Strikes, the fight long. Its other riders not counted.)
    const rules = ctx.entry.plan.resolution.stanceStrike?.rules ?? [];
    const rule = rules.find((each) => each.key === "Strike");
    const fist = bestStrike(ctx, "unarmed");
    const foe = ctx.enemies[0];
    if (!rule || !fist || !foe) return null;
    const traits = rule.traits ?? [];
    const range = Number(rule.range?.max) || 0;
    const entries = [];
    if (range > 0 || traits.includes("reach")) {
        const [part] = fist.strike.damage;
        const strike = { ...fist.strike, name: rule.label ?? "Stance Strike", melee: !(range > 0), agile: traits.includes("agile"), traits, damage: [{ ...part, die: Number(String(rule.damage?.base?.die ?? "d6").replace(/^d/, "")) || 6, type: rule.damage?.base?.damageType ?? part.type }] };
        entries.push({ target: foe, damage: strikeOn(fist.striker, strike, foe, { attacks: 2 }), worth: 0, heal: 0, benefit: 0 });
    }
    const bonus = rules.filter((each) => each.key === "FlatModifier" && each.selector === "ac" && JSON.stringify(each.predicate ?? []).includes("ranged")).reduce((sum, each) => sum + (Number(each.value) || 0), 0);
    if (bonus > 0) {
        const ac = Number(fist.striker.ac) || 15;
        const ranged = (strike) => !strike.melee;
        const saved = ctx.enemies.reduce((sum, enemy) => sum + strikeDamageOn(enemy, ac, ranged) - strikeDamageOn(enemy, ac + bonus, ranged), 0) * ctx.rounds / Math.max(1, ctx.allies.length);
        if (saved > 0) entries.push(...healEntries([fist.striker], saved));
    }
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["blink-strike"] = (ctx) => {
    // (Blink Charge: the teleport and the caster's Strike, with its force dice on a hit — doubled on a critical hit — and its force die on a
    // miss; a die more each step it heightens. Its dice on a hit: the text's, or twice a miss's.)
    const blink = ctx.entry.plan.resolution.blinkStrike ?? {};
    const best = bestStrike(ctx, "melee");
    if (!best) return null;
    const steps = Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(blink.interval) || 2)) * (Number(blink.stepDice) || 0);
    const miss = blink.failure ?? { dice: 1, faces: 8, type: "force" };
    const written = /plus an additional (\d+)d(\d+) (\w+) damage/i.exec(String(ctx.entry.doc?.system?.description?.value ?? ""));
    const hit = written ? { dice: Number(written[1]), faces: Number(written[2]), type: written[3].toLowerCase() } : { ...miss, dice: 2 * (Number(miss.dice) || 1) };
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const entries = byShare(ctx.enemies.map((foe) => {
        const odds = degreeDistribution(Number(best.strike.bonus) || 0, armorClass(foe));
        const extra = averageOn(foe, `${hit.dice + steps}d${hit.faces}[${hit.type}]`, hit.type, context);
        const missed = averageOn(foe, `${(Number(miss.dice) || 1) + steps}d${Number(miss.faces) || 8}[${miss.type ?? "force"}]`, miss.type, context);
        return { target: foe, damage: strikeOn(best.striker, best.strike, foe, { extra }) + odds[1] * missed, worth: 0, heal: 0, benefit: 0 };
    }));
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

// A thrall's Strike dice at its caster's level, by the thrall rules (the spell module's): 1d6, a die more at 5th level and every 4 after.
const thrallDice = (level, strike = {}) => 1 + Math.max(0, Math.floor(((Number(level) || 1) - ((Number(strike.firstStepLevel) || 5) - (Number(strike.every) || 4))) / (Number(strike.every) || 4)));

// A thrall's Strike on a foe: the caster's spell attack against its AC, its dice (d6s) and `more` damage on a hit — of the thrall's
// damage types, the one the foe takes most from — doubled on a critical hit.
function thrallStrikeOn(ctx, foe, dice, more = 0, types = ["bludgeoning", "piercing", "slashing"], die = 6) {
    const odds = degreeDistribution(Number(ctx.entry.attack) || 0, armorClass(foe));
    const hit = Math.max(...types.map((type) => averageOn(foe, `${dice}d${die}[${type}]`, type))) + more;
    return odds[2] * hit + odds[3] * 2 * hit;
}

READERS["thrall-strike"] = (ctx) => {
    // (Thrall Charge, a thrall of the caster's out at its best — the user: "minion spells assuming you already have a minion out": its
    // Stride and Strike by the thrall rules, with the charge's dice — of the Strike's type — destroyed for the rank's status bonus to the
    // damage.)
    const charge = ctx.entry.plan.resolution.thrallStrike ?? {};
    const dice = (charge.ranks ?? []).filter((step) => ctx.rank >= Number(step.rank)).at(-1)?.dice ?? 1;
    const die = Number(String(charge.dieSize ?? "d6").replace(/^d/, "")) || 6;
    const own = thrallDice(ctx.caster.level);
    const destroyed = charge.destroyBonus === "rank" ? ctx.rank : 0;
    const entries = byShare(ctx.enemies.map((foe) => {
        const extra = Math.max(...["bludgeoning", "piercing", "slashing"].map((type) => averageOn(foe, `${dice}d${die}[${type}]`, type)));
        return { target: foe, damage: thrallStrikeOn(ctx, foe, own, extra + destroyed), worth: 0, heal: 0, benefit: 0 };
    }));
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

READERS["giant-thrall"] = (ctx) => {
    // (Conglomerate of Limbs: its Huge thrall, Commanded to Strike each round it lasts at its best (an action), its Strike by the thrall
    // rules; and its Hit Points taken in the party's stead — the foes' Strikes on it as one of the party, every one a hit (checks against a
    // thrall succeed). Its two Strikes and holds under Thrall Charge wait on that spell.)
    const giant = ctx.entry.plan.resolution.giantThrall ?? {};
    const steps = giant.hpStep ? Math.floor(Math.max(0, ctx.rank - (Number(giant.baseRank) || ctx.rank)) / (Number(giant.hpStep.every) || 1)) * (Number(giant.hpStep.add) || 0) : 0;
    const hp = (Number(giant.hp) || 0) + steps;
    const lasts = lastsRounds(giant.seconds, ctx.rounds);
    const strike = giant.thrall?.strike ?? {};
    const foe = ctx.enemies[0];
    if (!foe || !(hp > 0)) return null;
    const dealt = thrallStrikeOn(ctx, foe, thrallDice(ctx.caster.level, strike), 0, strike.types ?? undefined, Number(strike.die) || 6) * lasts;
    const average = (enemy) => Math.max(0, ...(enemy.strikes ?? []).map((each) => (each.damage ?? []).reduce((sum, part) => sum + (Number(part.dice) || 0) * ((Number(part.die) || 0) + 1) / 2 + (Number(part.bonus) || 0), 0)));
    const drawn = ctx.enemies.reduce((sum, enemy) => sum + 2 * average(enemy), 0) * lasts / (ctx.allies.length + 1);
    const soaked = Math.min(hp, drawn);
    const entries = [...spreadDamage(ctx.enemies, dealt), ...(soaked > 0 ? healEntries(ctx.allies, soaked / Math.max(1, ctx.allies.length)) : [])];
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["gore-field"] = (ctx) => {
    // (Blossoming Gore, a thrall of the caster's out at its best: its field's persistent bleed on the foes in it each round they start there
    // (half of them, as a lingering area's; all in a choke point), more as it heightens, and its Fortitude save as one ends a turn
    // bleeding there — drained, its Hit Points too; the thralls it makes not counted.)
    const gore = ctx.entry.plan.resolution.goreField ?? {};
    const bleed = (Number(gore.bleed?.amount) || 0) + Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) * (Number(gore.bleed?.step) || 0);
    if (!(bleed > 0)) return null;
    const lasts = lastsRounds(gore.seconds, ctx.rounds);
    const stay = ctx.choke ? 1 : 0.5;
    const context = spellContext(ctx.entry, { isSpell: true, area: true });
    const rows = gore.rows ?? {};
    const entries = caught(ctx.enemies, { type: "burst", value: Number(gore.radius) || 20 }, ctx.choke).map((foe) => {
        // (Persistent damage, each round's: as the damage it is then.)
        const bleeding = averageOn(foe, `${bleed}[${gore.bleed?.type ?? "bleed"}]`, "bleed", context, true);
        const odds = degreeDistribution(saveModifier(foe, gore.statistic ?? "fortitude"), Number(ctx.entry.dc) || 10);
        const drained = bleeding > 0 ? [rows.criticalFailure, rows.failure, rows.success].reduce((sum, row, index) => sum + odds[index] * (Number(row?.value) || 0), 0) : 0;
        const worth = bleeding > 0 ? [rows.criticalFailure, rows.failure, rows.success].reduce((sum, row, index) => sum + odds[index] * conditionWorth("drained", Number(row?.value) || 0, null), 0) : 0;
        return { target: foe, damage: bleeding * lasts * stay + drained * (Number(foe.level) || 1), worth, heal: 0, benefit: 0 };
    });
    return entries.length ? { entries, targets: entries.length } : null;
};

// What a conjured weapon (runes: { potency, striking, property }) is worth to an ally a round over its own: its runes in place of the
// party's at its level on the ally's best melee Strike (weaponRunesAt), the same weapon — of `type` where it sets one, flaming's fire die
// on a hit — its two Strikes a round on the first foe.
function armedGain(ctx, ally, runes, type = null) {
    const foe = ctx.enemies[0];
    const strike = (ally.strikes ?? []).filter((each) => each.melee && each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
    if (!strike || !foe) return 0;
    const own = weaponRunesAt(Number(ally.level) || 1);
    const [part, ...rest] = strike.damage;
    const flaming = (runes.property ?? []).some((property) => /flaming/i.test(property));
    const armed = { ...strike, bonus: strike.bonus - own.potency + (Number(runes.potency) || 0), damage: [{ ...part, dice: 1 + (Number(runes.striking) || 0), type: type ?? part.type }, ...rest, ...(flaming ? [{ dice: 1, die: 6, bonus: 0, type: "fire" }] : [])] };
    const round = (each) => strikeOn(ally, each, foe) + strikeOn(ally, each, foe, { attacks: 1 });
    return Math.max(0, round(armed) - round(strike));
}

// A conjured weapon's reading: for the allies it can arm (`limit`), those it's worth most to, over the rounds it lasts — spread over the
// foes.
function armedReading(ctx, runes, limit, seconds, type = null) {
    if (!runes) return null;
    const gains = ctx.allies.map((ally) => armedGain(ctx, ally, runes, type)).sort((a, b) => b - a).slice(0, Math.max(1, limit));
    const total = gains.reduce((sum, gain) => sum + gain, 0) * lastsRounds(seconds, ctx.rounds);
    const entries = spreadDamage(ctx.enemies, total);
    return entries.length ? { entries, targets: entries.length } : null;
}

READERS["conjured-weapons"] = (ctx) => {
    // (Blazing Armory: its fire weapons for the allies it can arm at the rank — their runes over the party's own at its level.)
    const armory = ctx.entry.plan.resolution.conjuredWeapons ?? {};
    const runes = (armory.runes ?? []).filter((step) => ctx.rank >= Number(step.minRank)).at(-1) ?? null;
    const limit = (armory.targets ?? []).filter((step) => ctx.rank >= Number(step.minRank)).at(-1)?.limit ?? 1;
    return armedReading(ctx, runes, limit, armory.durationSeconds, armory.damageType ?? null);
};

READERS["conjured-item"] = (ctx) => {
    // (Arms of Nature: its weapon in the caster's hands — at its best, the party's best Striker's — its runes over the party's own.)
    const item = ctx.entry.plan.resolution.conjuredItem ?? {};
    if (!item.weapon) return null;
    const runes = (item.runes ?? []).filter((step) => ctx.rank >= Number(step.minRank)).at(-1) ?? null;
    return armedReading(ctx, runes, 1, item.seconds);
};

// Erupting Spurs, Bone Flense's reaction (PF2e's action): its piercing dice, a basic Fortitude save; more each step the spell heightens
// (its text's).
const ERUPTING_SPURS = { dice: 6, faces: 6, type: "piercing" };

READERS["weapon-imbue"] = (ctx) => {
    // (Bone Flense, on the party's best Striker's weapon at its best (a Red Mantis's), against a foe with bones: its persistent bleed from
    // the first hit the fight long — or, more, Erupting Spurs at that bleed: once, a basic Fortitude save.)
    const text = String(ctx.entry.doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const bleed = /(\d+)d(\d+) persistent bleed/i.exec(text);
    const step = /Heightened \(\+(\d+)\) The persistent bleed damage increases by (\d+)d\d+\.(?: The damage from Erupting Spurs increases by (\d+)d\d+)?/i.exec(text);
    const best = bestStrike(ctx, "melee");
    if (!bleed || !best) return null;
    const steps = step ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(step[1])) : 0;
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const entries = byShare(ctx.enemies.map((foe) => {
        const first = 1 - (1 - hitChance(best.strike, foe)) * (1 - hitChance(best.strike, foe, { attacks: 1 }));
        const bleeding = averageOn(foe, `${Number(bleed[1]) + steps * (Number(step?.[2]) || 0)}d${bleed[2]}[bleed]`, "bleed", context, true) * ctx.rounds;
        const [critFail, fail, success] = degreeDistribution(saveModifier(foe, "fortitude"), Number(ctx.entry.dc) || 10);
        const spurs = (2 * critFail + fail + 0.5 * success) * averageOn(foe, `${ERUPTING_SPURS.dice + steps * (Number(step?.[3]) || 0)}d${ERUPTING_SPURS.faces}[${ERUPTING_SPURS.type}]`, ERUPTING_SPURS.type, context);
        return { target: foe, damage: first * Math.max(bleeding, spurs), worth: 0, heal: 0, benefit: 0 };
    }));
    return entries.length ? { entries: entries.slice(0, 1), targets: 1 } : null;
};

// The reading for a plan the engine can't cast, or null: its family's, or the plans its payload carries.
export function powerReading(plan) {
    const own = READERS[plan?.resolution?.kind];
    const { kind, ...payload } = plan?.resolution ?? {};
    const carried = kind && embeddedPlans(payload).length ? embeddedReader : null;
    // (Its family's reading, or where that finds nothing, the plans it carries.)
    if (own) return carried ? (ctx) => own(ctx) ?? carried(ctx) : own;
    return carried;
}

export const READING_KINDS = Object.freeze(Object.keys(READERS));
