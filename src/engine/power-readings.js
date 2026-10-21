// The spell ratings' own readings of spells the simulator can't cast in a fight yet (2026-10-21, the user: "Work through the cant cast
// spells. I know based on personal experience that Web is a surprisingly strong spell"). Each reads a family of the spell module's plans
// for one cast's rating (spell-power.js readingPower): what it does to the foes and allies of the rating's fights, in the engine's own
// terms — check odds, damage after resistances, rounds of a creature's threat. Fights don't cast these yet. Pure.
//   The way in: the rating's foes stand the near band's 30 feet from the party and come to it (approach) — an area that hinders their
//   way costs them Strikes, as long as it keeps them from the party.

import { DISTANCE_FEET, engage } from "./space.js";
import { degreeDistribution, degreeOf, levelDC } from "./checks.js";
import { armorClass, multipleAttackPenalty, saveModifier } from "./combatant.js";
import { expectedHitDamage } from "./actions.js";
import { weaponRunesAt } from "./party.js";
import { adjustDamage, spellContext } from "./damage.js";
import { areaCapacity, canCast, conditionWorth, describeSpell, skillValue, spellExpectation, spellVariants, targetSets } from "./spells.js";
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

// A formula's rank terms worked out — "(ceil(@item.level/2)+1)d4" at rank 3: "3d4"; "(ceil(@item.rank/2))": "2" — or as it was where it
// isn't plain arithmetic.
function atRank(formula, rank) {
    const math = (expression) => {
        const plain = expression.replace(/@item\.(?:level|rank)/g, String(rank)).replace(/\bceil\b/g, "Math.ceil").replace(/\bfloor\b/g, "Math.floor");
        if (/[^\d+\-*/(). ]/.test(plain.replace(/Math\.(?:ceil|floor)/g, ""))) return null;
        try {
            return Function(`return (${plain})`)();
        } catch {
            return null;
        }
    };
    const group = /\(((?:[^()]|\((?:[^()]|\([^()]*\))*\))*)\)/;
    const text = String(formula);
    const whole = new RegExp(`^${group.source}$`).exec(text);
    if (whole) return String(math(whole[1]) ?? text);
    return text.replace(new RegExp(`${group.source}(?=d\\d)`, "g"), (all, inner) => String(math(inner) ?? all));
}

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
    // (An effect sequence — Guidance's —: its first effect, the one it gives as cast.)
    if (plan.resolution.kind === "effect-sequence" && plan.resolution.applications?.length) return castableReading({ ...plan, targeting, resolution: { kind: "effect", applications: [{ ...plan.resolution.applications[0], recipients: "target" }] } }, doc, rank);
    let resolution = plan.resolution.kind === "effect-note" && plan.resolution.effectNote?.effect?.uuid
        ? { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: plan.resolution.effectNote.effect.uuid, label: plan.resolution.effectNote.effect.label ?? null, recipients: plan.resolution.effectNote.recipient === "self" ? "self" : "target" }] }
        : branch?.effectUuid ? { kind: "effect", applications: [{ kind: "native-spell-effect", uuid: branch.effectUuid, label: null, recipients: toSelf ? "self" : "target" }] }
            : plan.resolution;
    // (Its action counts' areas without their shape or size — Disorienting Flash's "10 feet" for two actions, Spiritual Torrent's cone for
    // three —: the shape it names, else its data's; the size its text gives that shape, else its data's. And the action count its data
    // casts it with, where the counts leave that one out — Spiritual Torrent's two-action line —: its own area.)
    const byActions = resolution.native?.byActions;
    const shape = targeting.area?.type ?? docArea?.type;
    const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const whole = (area) => Boolean(area?.type) && Number(area.value) > 0;
    const fill = (area) => {
        const type = area.type ?? area.areaType ?? shape;
        const size = Number(area.value) || Number(new RegExp(`(\\d+)-foot ${type}`, "i").exec(plain)?.[1]) || (docArea?.type === type ? docArea.value : 0);
        return { ...area, ...(type ? { type } : {}), ...(size ? { value: size } : {}) };
    };
    if (byActions && Object.values(byActions).some((variant) => variant?.targeting?.area && !whole(variant.targeting.area))) {
        resolution = { ...resolution, native: { ...resolution.native, byActions: Object.fromEntries(Object.entries(byActions).map(([count, variant]) => [count, variant?.targeting?.area && !whole(variant.targeting.area) ? { ...variant, targeting: { ...variant.targeting, area: fill(variant.targeting.area) } } : variant])) } };
    }
    const own = /^[123]$/.test(time) ? time : null;
    const ownArea = whole(targeting.area) ? targeting.area : docArea;
    if (byActions && own && !byActions[own] && whole(ownArea)) resolution = { ...resolution, native: { ...resolution.native, byActions: { ...resolution.native.byActions, [own]: { targeting: { area: ownArea } } } } };
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
    // (A harmful emanation about the caster — Proximal Shift's debris where it lands —: cast with the foes in it, at its best (the user:
    // "For auras assume the spell is cast when within range").)
    const about = (actions) => {
        const info = describeSpell(spell.plan, actions);
        return info.area?.type === "emanation" && info.range === null && !info.healing && !info.helpful;
    };
    if (spellVariants(spell).some(about) && (ctx.caster.meleeId === null || ctx.caster.meleeId === undefined)) for (const foe of ctx.enemies) engage(ctx.state, foe, ctx.caster);
    const worth = (entries) => entries.reduce((sum, { target, damage = 0, worth = 0, heal = 0, benefit = 0 }) => sum + (target.side === ctx.caster.side ? -1 : 1) * (damage / Math.max(1, target.hp.max) + worth / 3 - heal / Math.max(1, target.hp.max) - benefit / 3), 0);
    let best = [];
    let bestWorth = 0;
    for (const actions of spellVariants(spell)) {
        let sets = [];
        try {
            sets = targetSets(ctx.state, ctx.caster, spell, { enemies: ctx.enemies, allies: ctx.allies, inMelee: () => true, distance: () => 30, meleeId: ctx.caster.meleeId ?? null }, actions);
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
    // (Modes — Musical Shift's key and time signatures —: one of each slot, read from the text, the best pair.)
    if ((incarnate.phases ?? []).length && incarnate.phases.every((phase) => phase.kind === "mode")) return modeReading(ctx, incarnate.phases);
    const choices = incarnate.options?.choices?.length ? incarnate.options.choices.map((choice) => choice.phases ?? []) : [incarnate.phases ?? []];
    const options = choices.map((phases) => {
        const lists = phases.filter((phase) => phase?.plan?.resolution && !phase.hidden).map((phase) => phaseEntries(ctx, phase.plan));
        // (Phases with no plan, read by their kind — PHASE_READERS —; a conjured object's cover, and its cage.)
        for (const phase of phases.filter((each) => !each?.plan?.resolution && !each?.hidden && PHASE_READERS[each?.kind])) lists.push(PHASE_READERS[phase.kind](ctx, phase, incarnate) ?? []);
        if (incarnate.conjure?.coverAura) lists.push(coverEntries(ctx, incarnate));
        if (incarnate.conjure?.object && phases.some((phase) => phase?.key === "trap")) lists.push(cageEntries(ctx, incarnate));
        for (const roll of phases.filter((phase) => Number(phase?.die) > 0 && phase.table)) {
            const die = Number(roll.die);
            // (Each creature in the spell's area rolling its own — Prismatic Spray's cone, its beams each at "1 creature" —: every foe the
            // area catches, each beam on it.)
            const hidden = phases.filter((phase) => phase?.hidden && phase.plan?.resolution);
            const area = ctx.entry.doc?.system?.area?.type ? { type: ctx.entry.doc.system.area.type, value: Number(ctx.entry.doc.system.area.value) || 5 } : null;
            const each = area && hidden.every((phase) => /^1 creature\b/i.test(String(phase.plan.targeting?.target ?? "")));
            const byKey = new Map(hidden.map((phase) => [phase.key, each ? caught(ctx.enemies, area, ctx.choke).map((foe) => singleEntry(ctx, phase.plan, foe)).filter(Boolean) : phaseEntries(ctx, phase.plan)]));
            const faces = Object.values(roll.table);
            for (const [key, entries] of byKey) lists.push(scaled(entries, faces.filter((face) => face === key).length / die));
            if (roll.twice && byKey.size) for (const entries of byKey.values()) lists.push(scaled(entries, 2 / byKey.size / die));
        }
        const entries = mergeEntries(lists);
        return { entries, targets: entries.length };
    }).filter((option) => option.entries.length);
    return options.length ? { options } : null;
};

// --- Incarnate phases with no plan, by their kind (2026-10-21, batch 11) ---------------------------------------------------------------

// The odds of each degree for a check rolled twice, the better kept (fortune): [critical failure, failure, success, critical success].
function fortuneDistribution(modifier, dc) {
    const odds = [0, 0, 0, 0];
    for (let natural = 1; natural <= 20; natural++) odds[degreeOf(natural + modifier, dc, natural)] += (natural * natural - (natural - 1) * (natural - 1)) / 400;
    return odds;
}

// The foe a single-target phase goes to at its best: the one with the most Hit Points.
const toughest = (enemies) => enemies.slice().sort((a, b) => b.hp.max - a.hp.max)[0] ?? null;

// A basic save's share of its damage: double on a critical failure, half on a success.
const basicShare = ([critFail, fail, success]) => 2 * critFail + fail + 0.5 * success;

// Thunderstrike's dice at a rank (PF2e's spell: 1d12 electricity and 1d4 sonic a rank, a basic Reflex save) — Shock to the System's
// innate spell.
const thunderstrike = (rank) => `${rank}d12[electricity],${rank}d4[sonic]`;

const PHASE_READERS = {
    // (Touch of Death: the caster's unarmed Strike, the touch — at its best a monk's —)
    "death-mark": (ctx) => {
        const fist = bestStrike(ctx, "unarmed");
        const foe = toughest(ctx.enemies);
        return fist && foe ? [{ target: foe, damage: strikeOn(fist.striker, fist.strike, foe), worth: 0, heal: 0, benefit: 0 }] : [];
    },
    // (and its word of death the same turn, on a hit: its Fortitude save — dead on a critical failure, stunned and its damage a rank on a
    // failure or a success.)
    word: (ctx, phase) => {
        const fist = bestStrike(ctx, "unarmed");
        const foe = toughest(ctx.enemies);
        if (!fist || !foe) return [];
        const hit = hitChance(fist.strike, foe);
        const [critFail, fail, success] = degreeDistribution(saveModifier(foe, phase.statistic ?? "fortitude"), Number(ctx.entry.dc) || 10);
        const row = (outcome) => ({ damage: (Number(outcome?.perRank) || 0) * ctx.rank, worth: outcome?.slug ? conditionWorth(outcome.slug, Number(outcome.value) || 1, null) : 0 });
        const failed = row(phase.failure);
        const made = row(phase.success);
        return [{ target: foe, damage: hit * (critFail * Math.max(0, foe.hp.value) + fail * failed.damage + success * made.damage), worth: hit * (fail * failed.worth + success * made.worth), heal: 0, benefit: 0 }];
    },
    // (Shock to the System: its healing on the ally it does most for, and that ally supercharged the fight long — Quickened for a fourth
    // Strike, or at will Thunderstrike (its rank, the caster's DC) and two Strikes, whichever does more each round than its third Strike.)
    shock: (ctx, phase) => {
        const steps = Math.max(0, ctx.rank - (Number(phase.innate?.baseRank) || ctx.rank));
        const healDice = Math.max(1, 8 + 2 * steps);
        const thunderRank = (Number(phase.innate?.rank) || 5) + steps * (Number(phase.innate?.step) || 1);
        const lasts = lastsRounds(phase.seconds, ctx.rounds);
        const foe = ctx.enemies[0];
        if (!foe) return [];
        const context = spellContext(ctx.entry, { isSpell: true, area: false });
        const thunder = basicShare(degreeDistribution(saveModifier(foe, "reflex"), Number(ctx.entry.dc) || 10)) * averageOn(foe, thunderstrike(thunderRank), "electricity", context);
        let best = null;
        for (const ally of ctx.allies) {
            const strike = (ally.strikes ?? []).filter((each) => each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
            const third = strike ? strikeOn(ally, strike, foe, { attacks: 2 }) : 0;
            const gain = Math.max(third, thunder - third) * lasts;
            if (!best || gain > best.gain) best = { ally, gain };
        }
        const heal = healDice * 4.5;
        return [...healEntries([best.ally], heal), ...spreadDamage(ctx.enemies, best.gain)];
    },
    // (Rainbow Fumarole: its color, a d8 — each as likely, the eighth the best of them for each foe — its damage with a basic Reflex save and
    // its effect on a failure, on the foes it's cast on; again as they move through it or end a turn there, half of them each round it
    // lasts (all in a choke point), its conditions counting half again each time.)
    fumarole: (ctx, phase) => {
        const colors = Object.entries(phase.colors ?? {}).map(([, color]) => color);
        if (!colors.length) return [];
        const die = Number(phase.die) || 8;
        const context = spellContext(ctx.entry, { isSpell: true, area: true });
        const lasts = lastsRounds(phase.seconds, ctx.rounds);
        const again = (lasts - 1) * (ctx.choke ? 1 : 0.5);
        return caught(ctx.enemies, { type: "burst", value: Number(phase.area?.value) || 20 }, ctx.choke).map((foe) => {
            const odds = degreeDistribution(saveModifier(foe, phase.statistic ?? "reflex"), Number(ctx.entry.dc) || 10);
            const each = colors.map((color) => {
                // (Its persistent damage: two rounds of it.)
                const now = averageOn(foe, color.formula, "fire", context);
                const persistent = averageOn(foe, color.formula, "fire", context, true) - now;
                const damage = basicShare(odds) * (now + 2 * persistent);
                const rounds = Number(color.effect?.rounds) || null;
                const worth = (odds[0] + odds[1]) * (color.effect?.conditions ?? []).reduce((sum, condition) => sum + conditionWorth(condition.slug, condition.value ?? null, rounds ? { mode: "fixed", value: rounds, unit: "rounds" } : null), 0);
                return { damage, worth, value: damage / Math.max(1, foe.hp.max) + worth / 3 };
            });
            const chosen = each.slice().sort((a, b) => b.value - a.value)[0];
            const average = (field) => (each.reduce((sum, color) => sum + color[field], 0) + (die - each.length) * chosen[field]) / die;
            return { target: foe, damage: average("damage") * (1 + again), worth: average("worth") * (1 + again / 2), heal: 0, benefit: 0 };
        });
    },
    // (Unblinking Flame Emblem: on the toughest foe, after the caster's Strike hits it — at its best, it does — the party's two Strikes a
    // round on it for its rounds: a status bonus to hit, its fire die on a hit and its persistent die on a critical hit (two rounds of it).
    // The caster off-guard to the others, not counted.)
    emblem: (ctx, phase) => {
        const foe = toughest(ctx.enemies);
        if (!foe) return [];
        const higher = phase.heightened && ctx.rank >= Number(phase.heightened.minRank) ? phase.heightened : phase;
        const rounds = Math.min(ctx.rounds, Number(phase.rounds) || 3);
        const context = spellContext(ctx.entry, { isSpell: true, area: false });
        const extra = averageOn(foe, `1d${Number(higher.die) || 6}[${phase.type ?? "fire"}]`, phase.type ?? "fire", context);
        const burning = 2 * averageOn(foe, `1d${Number(higher.critDie) || 10}[${phase.type ?? "fire"}]`, phase.type ?? "fire", context);
        let gain = 0;
        for (const ally of ctx.allies) {
            const strike = (ally.strikes ?? []).filter((each) => each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
            if (!strike) continue;
            for (const attacks of [0, 1]) {
                const odds = degreeDistribution((Number(strike.bonus) || 0) + (Number(phase.bonus) || 0) - multipleAttackPenalty(strike, attacks), armorClass(foe));
                gain += strikeOn(ally, strike, foe, { attacks, bonus: Number(phase.bonus) || 0, extra }) - strikeOn(ally, strike, foe, { attacks }) + odds[3] * burning;
            }
        }
        return [{ target: foe, damage: gain * rounds, worth: 0, heal: 0, benefit: 0 }];
    },
    // (True Target: its attackers' first attack roll on the toughest foe rolled twice, the better kept — the party's first Strikes.)
    "true-target": (ctx, phase) => {
        const foe = toughest(ctx.enemies);
        if (!foe) return [];
        let gain = 0;
        for (const ally of ctx.allies.slice(0, Math.max(1, Number(phase.count) || 4))) {
            const strike = (ally.strikes ?? []).filter((each) => each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
            if (!strike) continue;
            const twice = fortuneDistribution(Number(strike.bonus) || 0, armorClass(foe));
            gain += twice[2] * expectedHitDamage(ally, strike, foe, false) + twice[3] * expectedHitDamage(ally, strike, foe, true) - strikeOn(ally, strike, foe);
        }
        return gain > 0 ? [{ target: foe, damage: gain, worth: 0, heal: 0, benefit: 0 }] : [];
    },
    // (Moment of Renewal: a day's rest for its targets — twice a night's Hit Points, its Constitution modifier a level, B482.)
    renewal: (ctx, phase) => ctx.allies.slice(0, Math.max(1, Number(phase.count) || 6)).flatMap((ally) => healEntries([ally], 2 * Math.max(1, Number(ally.con) || 1) * (Number(ally.level) || 1)))
};

// A conjured object's cover for the allies beside it (Ice Guardian): at its best all of them, Sustained for its better cover, while it
// lasts — its AC bonus as the Strikes it keeps off.
function coverEntries(ctx, incarnate) {
    const conjure = incarnate.conjure;
    const ac = (rules) => Math.max(0, ...(rules ?? []).filter((rule) => rule.key === "FlatModifier" && rule.selector === "ac" && !rule.predicate).map((rule) => Number(rule.value) || 0));
    const bonus = Math.max(ac(conjure.coverAura?.rules), ...(incarnate.phases ?? []).filter((phase) => phase.kind === "effect").map((phase) => ac(phase.rules)));
    const lasts = lastsRounds(conjure.durationSeconds, ctx.rounds);
    return bonus > 0 ? ctx.allies.flatMap((ally) => healEntries([ally], acSaved(ctx, ally, bonus, lasts))) : [];
}

// A conjured cage (Lifewood Cage): the foes in it that fail their Reflex save shut in, until they break out — their two hits a round on
// it, less its resistance, against its Hit Points — or it ends; meanwhile their melee threat gone (those with a ranged Strike, a third of
// it: through its bars, behind its cover).
function cageEntries(ctx, incarnate) {
    const cage = incarnate.conjure;
    const lasts = lastsRounds(cage.durationSeconds, ctx.rounds);
    const resisted = Math.max(Number(cage.hardness) || 0, ...(cage.resistances ?? []).filter((each) => each.type === "all-damage").map((each) => Number(each.value) || 0));
    const statistic = "reflex";
    return caught(ctx.enemies, { type: "burst", value: 10 }, ctx.choke).map((foe) => {
        const [critFail, fail] = degreeDistribution(saveModifier(foe, statistic), Number(ctx.entry.dc) || 10);
        const { hits, damage } = hitsOn(foe, Number(cage.ac) || 10);
        const breaking = hits * Math.max(0, damage - resisted);
        const held = breaking > 0 ? Math.min(lasts, Math.ceil((Number(cage.hp) || 1) / breaking)) : lasts;
        const ranged = (foe.strikes ?? []).some((strike) => !strike.melee);
        return { target: foe, damage: 0, worth: (critFail + fail) * held * (ranged ? 1 / 3 : 1), heal: 0, benefit: 0 };
    });
}

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
    const lasts = lastsRounds(retaliation.durationSeconds, ctx.rounds);
    // (Echoing Weapon: on the wielder's weapon — at its best, the party's best Striker's — its damage for each hit a turn, on a foe beside
    // it, each turn it lasts.)
    const echo = (retaliation.triggers ?? []).find((each) => each.damage?.byCount?.length);
    if (echo) {
        const best = bestStrike(ctx, "melee");
        const foe = best ? toughest(ctx.enemies) : null;
        const each = Number(atRank(echo.damage.byCount[0], ctx.rank)) || 0;
        if (!foe || !(each > 0)) return null;
        const hits = hitChance(best.strike, foe) + hitChance(best.strike, foe, { attacks: 1 });
        return { entries: [{ target: foe, damage: hits * averageOn(foe, `${each}[${echo.damage.type ?? "sonic"}]`, echo.damage.type, spellContext(ctx.entry, { isSpell: true, area: false })) * lasts, worth: 0, heal: 0, benefit: 0 }], targets: 1 };
    }
    // (Incendiary Aura: the foes in its emanation — at its best, as many as it holds — set burning by fire from the turn after it's cast
    // (the caster's own, at its best an area's): its persistent damage, about three rounds of it (a DC 15 flat check ends it, 30% a round),
    // while it lasts.)
    const burning = (retaliation.triggers ?? []).find((each) => /\btakes \w+ damage\b/i.test(String(each.trigger ?? "")) && each.damage?.persistent && each.damage.formula);
    if (burning) {
        const radius = (Number(ctx.entry.doc?.system?.area?.value) || 10) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / 2) * 5;
        const context = spellContext(ctx.entry, { isSpell: true, area: true });
        const formula = atRank(burning.damage.formula, ctx.rank);
        const entries = caught(ctx.enemies, { type: "emanation", value: radius }, ctx.choke).map((foe) => ({ target: foe, damage: averageOn(foe, `${formula}[${burning.damage.type ?? "fire"}]`, burning.damage.type, context, true) * Math.min(lasts - 1, 1 / 0.3), worth: 0, heal: 0, benefit: 0 })).filter((entry) => entry.damage > 0);
        return entries.length ? { entries, targets: entries.length } : null;
    }
    const trigger = (retaliation.triggers ?? []).find((each) => /\bhits?\b|\battacks?\b|\btouch/i.test(String(each.trigger ?? "")) && each.damage?.formula);
    if (!trigger) return null;
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
    // bunched — its save each round the fight lasts while it does, the conditions of each row at their engine worth for a round. Reaper's
    // Lantern: its failure's condition on undead, while they stay in it — living foes' healing halved, not counted. Repulsion: its save
    // once as they come — on a failure they can't come closer to the caster through it, on a success its squares are difficult terrain
    // on the way: the Strikes they lose on the way, at its best the party about the caster (a foe with a ranged Strike, a third: it
    // shoots past it).)
    const aura = ctx.entry.plan.resolution.lanternAura ?? {};
    const rows = aura.rows ?? {};
    const lasts = lastsRounds(aura.durationSeconds, ctx.rounds);
    const round = { mode: "fixed", value: 1, unit: "rounds" };
    const rowWorth = (row) => (row?.conditions ?? []).reduce((sum, condition) => sum + conditionWorth(condition.slug, Number.isFinite(Number(condition.value)) && condition.value !== null ? Number(condition.value) : null, round), 0);
    const radius = Number(aura.radius) || 5;
    const foes = radius >= 30 ? ctx.enemies : caught(ctx.enemies, { type: "emanation", value: radius });
    const undead = aura.failed?.undead?.condition ? aura.failed.undead : null;
    const blocks = /can't move closer/i.test(JSON.stringify(rows.failure ?? {}));
    const slows = /difficult terrain/i.test(JSON.stringify(rows.success ?? {}));
    const entries = foes.map((foe) => {
        const odds = degreeDistribution(saveModifier(foe, aura.statistic ?? "will"), Number(ctx.entry.dc) || 10);
        const [critFail, fail, success, critical] = odds;
        let worth = (critical * rowWorth(rows.criticalSuccess) + success * rowWorth(rows.success) + fail * rowWorth(rows.failure) + critFail * rowWorth(rows.criticalFailure ?? rows.failure)) * lasts;
        if (undead && (foe.traits ?? []).includes("undead")) worth += (critFail + fail) * conditionWorth(undead.condition, Number(undead.value) || 1, null) * lasts;
        if (blocks || slows) {
            const ranged = (foe.strikes ?? []).some((strike) => !strike.melee) ? 1 / 3 : 1;
            const held = blocks ? approachLoss(foe, { inside: radius, held: { start: 1, escape: [1, 0, 0, 0] } }, lasts).worth : 0;
            const slowed = slows ? approachLoss(foe, { inside: radius, difficult: true }, lasts).worth : 0;
            worth += ranged * ((critFail + fail) * held + success * slowed);
        }
        return { target: foe, damage: 0, worth, heal: 0, benefit: 0 };
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

// The party's Strikes on a foe made better (a bonus to hit, extra damage on a hit) for `rounds` rounds: each one's best, two a round.
function partyStrikeGain(ctx, foe, better, rounds) {
    let gain = 0;
    for (const ally of ctx.allies) {
        const strike = (ally.strikes ?? []).filter((each) => each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
        if (strike) for (const attacks of [0, 1]) gain += strikeOn(ally, strike, foe, { attacks, ...better }) - strikeOn(ally, strike, foe, { attacks });
    }
    return gain * rounds;
}

// What concealment on a creature keeps off it over `lasts` rounds: a fifth of the foes' hits (the DC 5 flat check), its share of them.
const concealedSaved = (ctx, creature, lasts) => ctx.enemies.reduce((sum, foe) => sum + 0.2 * strikeDamageOn(foe, Number(creature.ac) || 15), 0) * lasts / Math.max(1, ctx.allies.length);

READERS["healing-pulse"] = (ctx) => {
    // (Garden of Healing: its pulse as cast and each round it's Sustained, on the allies in its emanation — at its best, as many as it
    // holds — a die more each rank.)
    const pulse = ctx.entry.plan.resolution.healingPulse ?? {};
    const none = { immunities: [], resistances: [], weaknesses: [] };
    const steps = pulse.heightening?.interval ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(pulse.heightening.interval)) : 0;
    const each = averageOn(none, String(pulse.formula ?? "1d4")) + steps * averageOn(none, String(pulse.heightening?.dice ?? "0"));
    const allies = caught(ctx.allies, pulse.area ?? { type: "emanation", value: 10 });
    return each > 0 ? { entries: healEntries(allies, each * lastsRounds(pulse.durationSeconds, ctx.rounds)), targets: allies.length } : null;
};

READERS["rally-banner"] = (ctx) => {
    // (Rallying Banner: its status bonus to the party's attack rolls while it lasts — two Strikes a round each, spread over the foes; to
    // saves against fear, not counted.)
    const banner = ctx.entry.plan.resolution.rallyBanner ?? {};
    const bonus = Math.max(0, ...(banner.member?.rules ?? []).filter((rule) => rule.key === "FlatModifier" && rule.selector === "attack-roll" && !rule.predicate).map((rule) => Number(rule.value) || 0));
    const foe = ctx.enemies[0];
    if (!(bonus > 0) || !foe) return null;
    const entries = spreadDamage(ctx.enemies, partyStrikeGain(ctx, foe, { bonus }, lastsRounds(banner.durationSeconds, ctx.rounds)));
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["brand-mark"] = (ctx) => {
    // (Celestial Brand: on the toughest foe of the trait it names, the party's status bonus to hit it for the spell's round; a holy
    // creature's spirit damage on it, not counted (the party has none).)
    const brand = ctx.entry.plan.resolution.brandMark ?? {};
    const foe = toughest(ctx.enemies.filter((enemy) => !brand.targetTrait || (enemy.traits ?? []).includes(brand.targetTrait)));
    if (!foe) return null;
    const damage = partyStrikeGain(ctx, foe, { bonus: 1 }, 1);
    return damage > 0 ? { entries: [{ target: foe, damage, worth: 0, heal: 0, benefit: 0 }], targets: 1 } : null;
};

READERS["sacrifice-heal"] = (ctx) => {
    // (Shepherd of Souls: the most it lets the caster give — more as it heightens — off a big hit on an ally, twice that, the caster's own
    // Hit Points given taken off: at its best, the hit as big as that.)
    const sacrifice = ctx.entry.plan.resolution.sacrificeHeal ?? {};
    const most = (Number(sacrifice.max) || 0) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(sacrifice.step?.interval) || 2)) * (Number(sacrifice.step?.add) || 0);
    const kept = ((Number(sacrifice.multiplier) || 2) - 1) * most;
    const ally = ctx.allies.find((each) => each !== ctx.caster) ?? ctx.caster;
    return kept > 0 ? { entries: healEntries([ally], kept), targets: 1 } : null;
};

READERS["bloom-area"] = (ctx) => {
    // (Life's Fresh Bloom: its healing for the allies in it each turn they start there — at its best, all it holds — while it lasts; on the
    // undead foes in it, its Fortitude save, sickened.)
    const bloom = ctx.entry.plan.resolution.bloom ?? {};
    const step = (bloom.byRank ?? []).filter((each) => ctx.rank >= Number(each.rank)).at(-1);
    if (!step) return null;
    const lasts = lastsRounds(bloom.seconds, ctx.rounds);
    const area = { type: ctx.entry.doc?.system?.area?.type ?? "burst", value: Number(ctx.entry.doc?.system?.area?.value) || 20 };
    const heal = averageOn({ immunities: [], resistances: [], weaknesses: [] }, String(step.heal ?? "1d6"));
    const harmed = ctx.enemies.filter((foe) => (bloom.harmedTraits ?? []).some((trait) => (foe.traits ?? []).includes(trait)));
    const hurt = caught(harmed, area, ctx.choke).map((foe) => {
        const [critFail, fail] = degreeDistribution(saveModifier(foe, bloom.statistic ?? "fortitude"), Number(ctx.entry.dc) || 10);
        return { target: foe, damage: 0, worth: (critFail + fail) * conditionWorth(bloom.condition?.slug ?? "sickened", Number(step.value) || 1, null), heal: 0, benefit: 0 };
    });
    const allies = caught(ctx.allies, area);
    const entries = [...healEntries(allies, heal * lasts), ...hurt];
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["self-pulse"] = (ctx) => {
    // (Gloom Mantle: concealed as cast and each round it's Sustained — the foes' hits on the caster it keeps off, while it lasts.)
    const pulse = ctx.entry.plan.resolution.selfPulse ?? {};
    if (pulse.condition?.slug !== "concealed") return null;
    const kept = concealedSaved(ctx, ctx.caster, lastsRounds(pulse.durationSeconds, ctx.rounds));
    return kept > 0 ? { entries: healEntries([ctx.caster], kept), targets: 1 } : null;
};

// A creature's hits a round on the party, made worse by `penalty` to hit and `less` damage a hit: what that keeps off them over `rounds`
// rounds — the ally it's at, the party's mean AC.
function penaltySaved(ctx, foe, penalty, less, rounds) {
    const ac = ctx.allies.reduce((sum, ally) => sum + (Number(ally.ac) || 15), 0) / Math.max(1, ctx.allies.length);
    const plain = hitsOn(foe, ac);
    const worse = hitsOn(foe, ac + penalty);
    return Math.max(0, plain.hits * plain.damage - worse.hits * Math.max(0, worse.damage - less)) * rounds;
}

READERS.boast = (ctx) => {
    // (Belittling Boast: Demoralize every foe in its burst — the party's best Intimidation at its best — those frightened worse at melee
    // attack rolls for its minute (the boast at its best), the caster better at its own while any are — the best Striker's.)
    const boast = ctx.entry.plan.resolution.boast ?? {};
    const amount = boast.step && ctx.rank >= Number(boast.step.rank) ? Number(boast.step.value) || 1 : Number(boast.penalty?.value) || 1;
    const lasts = lastsRounds(boast.seconds, ctx.rounds);
    const intimidation = Math.max(...ctx.allies.map((ally) => skillValue(ally, "intimidation")));
    let none = 1;
    const entries = caught(ctx.enemies, { type: "burst", value: Number(boast.radius) || 30 }, ctx.choke).map((foe) => {
        const [, , success, critical] = degreeDistribution(intimidation, 10 + saveModifier(foe, "will"));
        none *= 1 - (success + critical);
        return { target: foe, damage: 0, worth: success * conditionWorth("frightened", 1, null) + critical * conditionWorth("frightened", 2, null), heal: 0, benefit: 0, kept: (success + critical) * penaltySaved(ctx, foe, amount, 0, lasts) / Math.max(1, ctx.allies.length) };
    });
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    const better = best && foe ? (1 - none) * [0, 1].reduce((sum, attacks) => sum + strikeOn(best.striker, best.strike, foe, { attacks, bonus: amount }) - strikeOn(best.striker, best.strike, foe, { attacks }), 0) * lasts : 0;
    const kept = entries.reduce((sum, entry) => sum + entry.kept, 0);
    const all = [...entries.map(({ kept: _, ...entry }) => entry), ...spreadDamage(ctx.enemies, better).map((entry) => ({ ...entry })), ...(kept > 0 ? healEntries(ctx.allies, kept) : [])];
    const merged = mergeEntries([all]);
    return merged.length ? { entries: merged, targets: merged.length } : null;
};

READERS.challenge = (ctx) => {
    // (Dutiful Challenge: the toughest foe worse at hitting and hurting the caster's allies — at its best, the caster their wall — until it
    // shakes it off: its Will save at each of their hostile actions against it, two a round each.)
    const challenge = ctx.entry.plan.resolution.challenge ?? {};
    const amount = (Number(challenge.value) || 1) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(challenge.step?.interval) || 3)) * (Number(challenge.step?.add) || 0);
    const foe = toughest(ctx.enemies);
    if (!foe) return null;
    const [, , success, critical] = degreeDistribution(saveModifier(foe, challenge.statistic ?? "will"), Number(ctx.entry.dc) || 10);
    const stays = (1 - (success + critical)) ** 2;
    let rounds = 0;
    for (let round = 0, held = 1; round < lastsRounds(challenge.seconds, ctx.rounds); round++, held *= stays) rounds += held;
    const others = Math.max(0, ctx.allies.length - 1) / Math.max(1, ctx.allies.length);
    const kept = penaltySaved(ctx, foe, amount, amount, rounds) * others;
    return kept > 0 ? { entries: healEntries(ctx.allies.filter((ally) => ally !== ctx.caster), kept / Math.max(1, ctx.allies.length - 1)), targets: ctx.allies.length - 1 } : null;
};

READERS["minion-horde"] = (ctx) => {
    // (Horde of Underlings: its underlings beside the foes at its best, each one's damage as it comes and each round it's Sustained — the
    // foes' better answer counted: leave them be, or cut them down with their Strikes, two a round each from the second (every one a
    // hit: AC 5, 1 Hit Point), Strikes kept off the party.)
    const horde = ctx.entry.plan.resolution.minionHorde ?? {};
    const count = (Number(horde.count) || 0) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(horde.step?.interval) || 1)) * (Number(horde.step?.count) || 0);
    const foe = ctx.enemies[0];
    if (!foe || !(count > 0)) return null;
    const hit = Math.max(...(horde.types ?? ["bludgeoning"]).map((type) => averageOn(foe, `${horde.formula ?? "1d4"}[${type}]`, type)));
    const lasts = lastsRounds(horde.seconds, ctx.rounds);
    const meanAC = ctx.allies.reduce((sum, ally) => sum + (Number(ally.ac) || 15), 0) / Math.max(1, ctx.allies.length);
    const rounds = ctx.enemies.map((enemy) => hitsOn(enemy, meanAC)).reduce((sum, { hits, damage }) => sum + hits * damage, 0);
    const swing = rounds / Math.max(1, 2 * ctx.enemies.length);
    const foeHp = ctx.enemies.reduce((sum, enemy) => sum + enemy.hp.max, 0);
    const share = ({ dealt, kept }) => dealt / Math.max(1, foeHp) + kept / Math.max(1, rounds * 3);
    const left = { dealt: count * hit * lasts, kept: 0 };
    const cut = { dealt: 0, kept: 0 };
    for (let round = 0, alive = count; round < lasts; round++) {
        cut.dealt += alive * hit;
        if (round === lasts - 1) break;
        const down = Math.min(alive, 2 * ctx.enemies.length);
        cut.kept += down * swing;
        alive -= down;
    }
    const answer = share(left) <= share(cut) ? left : cut;
    const entries = [...spreadDamage(ctx.enemies, answer.dealt), ...(answer.kept > 0 ? healEntries(ctx.allies, answer.kept / ctx.allies.length) : [])];
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["skill-demoralize"] = (ctx) => {
    // (Flame Dancer: its fire on a monk's unarmed Strikes at its best — the best Striker's fist — and its persistent fire on a critical hit,
    // the fight long; Demoralize by Performance, not counted.)
    const dancer = ctx.entry.plan.resolution.skillDemoralize ?? {};
    const text = String(ctx.entry.doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@Damage\[([^\]]*)\]/g, "$1").replace(/\s+/g, " ");
    const base = /unarmed Strikes deal an additional (\d+)d(\d+) (\w+) damage/i.exec(text);
    const burn = /Critical hits with these Strikes also deal (\d+)d(\d+) persistent/i.exec(text);
    const higher = /Heightened \((\d+)(?:st|nd|rd|th)\) The \w+ damage increases to (\d+)d(\d+), and the persistent \w+ damage increases to (\d+)d(\d+)/i.exec(text);
    const fist = bestStrike(ctx, "unarmed");
    const foe = toughest(ctx.enemies);
    if (!base || !fist || !foe) return null;
    const up = higher && ctx.rank >= Number(higher[1]);
    const type = base[3].toLowerCase();
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const extra = averageOn(foe, `${up ? higher[2] : base[1]}d${up ? higher[3] : base[2]}[${type}]`, type, context);
    const persistent = burn ? 2 * averageOn(foe, `${up ? higher[4] : burn[1]}d${up ? higher[5] : burn[2]}[${type}]`, type, context, true) : 0;
    let gain = 0;
    for (const attacks of [0, 1]) {
        const odds = degreeDistribution((Number(fist.strike.bonus) || 0) - multipleAttackPenalty(fist.strike, attacks), armorClass(foe));
        gain += strikeOn(fist.striker, fist.strike, foe, { attacks, extra }) - strikeOn(fist.striker, fist.strike, foe, { attacks }) + odds[3] * persistent;
    }
    const entries = spreadDamage(ctx.enemies, gain * lastsRounds(dancer.seconds, ctx.rounds));
    return entries.length ? { entries, targets: entries.length } : null;
};

READERS["strike-ward"] = (ctx) => {
    // (Warding Aggression: the caster's melee Strike — at its best the best Striker's — and its AC against that foe by the Strike's degree,
    // kept each turn it hits it again (two Strikes a turn), while it lasts.)
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    if (!best || !foe) return null;
    const odds = degreeDistribution(Number(best.strike.bonus) || 0, armorClass(foe));
    const bonus = odds[3] * 2 + odds[2] * 2 + odds[1] * 1;
    const again = 1 - (1 - hitChance(best.strike, foe)) * (1 - hitChance(best.strike, foe, { attacks: 1 }));
    let rounds = 0;
    for (let round = 0, held = 1; round < ctx.rounds; round++, held *= again) rounds += held;
    const ac = Number(best.striker.ac) || 15;
    const kept = (strikeDamageOn(foe, ac) - strikeDamageOn(foe, ac + bonus)) * rounds / Math.max(1, ctx.allies.length);
    return { entries: [{ target: foe, damage: strikeOn(best.striker, best.strike, foe), worth: 0, heal: 0, benefit: 0 }, ...(kept > 0 ? healEntries([best.striker], kept) : [])], targets: kept > 0 ? 2 : 1 };
};

READERS["deferred-save"] = (ctx) => {
    // (Albatross Curse: the party's circumstance bonus to hit the toughest foe — or, its best answer, it spends an action killing the bird
    // and saves, stupefied a round on a success: the worse for it of the two.)
    const curse = ctx.entry.plan.resolution.deferredSave ?? {};
    const foe = toughest(ctx.enemies);
    if (!foe) return null;
    const kept = partyStrikeGain(ctx, foe, { bonus: 1 }, ctx.rounds);
    const [, , success] = degreeDistribution(saveModifier(foe, curse.statistic ?? "will"), Number(ctx.entry.dc) || 10);
    const killed = { damage: partyStrikeGain(ctx, foe, { bonus: 1 }, 1) / 2, worth: 1 / 3 + success * conditionWorth(curse.rows?.success?.condition?.slug ?? "stupefied", Number(curse.rows?.success?.condition?.value) || 1, { mode: "fixed", value: 1, unit: "rounds" }) };
    const share = (entry) => entry.damage / Math.max(1, foe.hp.max) + entry.worth / 3;
    const answer = share({ damage: kept, worth: 0 }) <= share(killed) ? { damage: kept, worth: 0 } : killed;
    return { entries: [{ target: foe, ...answer, heal: 0, benefit: 0 }], targets: 1 };
};

READERS["temp-hp"] = (ctx) => {
    // (Death's Call: as one of a group of foes falls beside the caster, temporary Hit Points of its level and the caster's spellcasting
    // modifier (4 at its best) — twice for an undead one.)
    const call = ctx.entry.plan.resolution.tempHp ?? {};
    // (Not with one foe alone: its fall ends the fight.)
    const foe = ctx.enemies.length > 1 ? ctx.enemies[0] : null;
    if (!foe) return null;
    const undead = (foe.traits ?? []).includes("undead") && call.doubleIfUndead;
    return { entries: healEntries([ctx.caster], ((Number(foe.level) || 0) + 4) * (undead ? 2 : 1)), targets: 1 };
};

READERS["check-mark"] = (ctx) => {
    // (Organsight, Ki Cutting Sight: its check on the toughest foe — the party's best at it — then its extra dice on the next Strike that
    // hits it, the best Striker's (at its best a magus's or a monk's); again each turn, an action, where it lets the check be tried again.)
    const mark = ctx.entry.plan.resolution.checkMark ?? {};
    const text = String(ctx.entry.doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const dice = /deal (\d+)d(\d+) additional (\w+) damage/i.exec(text);
    const step = /Heightened \(\+(\d+)\) The \w+ damage increases by (\d+)d\d+/i.exec(text);
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    if (!dice || !best || !foe) return null;
    const count = Number(dice[1]) + (step ? Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / Number(step[1])) * Number(step[2]) : 0);
    const type = dice[3].toLowerCase();
    const roll = mark.statistic === "perception" ? Math.max(...ctx.allies.map((ally) => Number(ally.perception) || 0)) : Math.max(...ctx.allies.map((ally) => skillValue(ally, mark.skill ?? "medicine")));
    const dc = mark.against === "level-dc" ? levelDC(Number(foe.level) || 0) : 10 + saveModifier(foe, mark.against ?? "fortitude");
    const [, , success, critical] = degreeDistribution(roll, dc);
    const odds = degreeDistribution(Number(best.strike.bonus) || 0, armorClass(foe));
    const extra = (odds[2] + 2 * odds[3]) * averageOn(foe, `${count}d${dice[2]}[${type === "precision" ? best.strike.damage[0]?.type ?? "slashing" : type}]`, type, spellContext(ctx.entry, { isSpell: true, area: false }));
    const times = mark.repeat ? lastsRounds(60, ctx.rounds) : 1;
    return { entries: [{ target: foe, damage: (success + critical) * extra * times, worth: 0, heal: 0, benefit: 0 }], targets: 1 };
};

READERS["cannibal-hunger"] = (ctx) => {
    // (Ravening Maw: on a failed Will save, the toughest of a group of foes hungering for its turns as others fall about it — at its best,
    // one a round from the second — its better answer each round: two actions eating a fallen ally (healing it), while there are any, or
    // its mental damage.)
    const maw = ctx.entry.plan.resolution.cannibalHunger ?? {};
    if (ctx.enemies.length < 2) return null;
    const foe = toughest(ctx.enemies);
    const [critFail, fail] = degreeDistribution(saveModifier(foe, maw.statistic ?? "will"), Number(ctx.entry.dc) || 10);
    const steps = Math.max(0, ctx.rank - (Number(maw.baseRank) || ctx.rank)) * (Number(maw.ally?.step) || 1);
    const none = { immunities: [], resistances: [], weaknesses: [] };
    const fed = averageOn(none, `${(Number(maw.ally?.dice) || 5) + steps}d${Number(maw.ally?.die) || 8}`);
    const starve = averageOn(foe, `${(Number(maw.starve?.dice) || 5) + steps}d${Number(maw.starve?.die) || 4}[${maw.starve?.type ?? "mental"}]`, maw.starve?.type ?? "mental");
    const share = (entry) => entry.damage / foe.hp.max + entry.worth / 3 - entry.heal / foe.hp.max;
    const total = { damage: 0, worth: 0, heal: 0 };
    let corpses = 0;
    for (let round = 1; round < lastsRounds(maw.seconds, ctx.rounds); round++) {
        corpses = Math.min(ctx.enemies.length - 1, corpses + 1);
        const eat = { damage: 0, worth: 2 / 3, heal: fed };
        const take = { damage: starve, worth: 0, heal: 0 };
        const answer = corpses > 0 && share(eat) < share(take) ? eat : take;
        if (answer === eat) corpses--;
        for (const field of ["damage", "worth", "heal"]) total[field] += answer[field];
    }
    const affected = critFail + fail;
    return total.damage + total.worth > 0 ? { entries: [{ target: foe, damage: affected * total.damage, worth: affected * total.worth, heal: affected * total.heal, benefit: 0 }], targets: 1 } : null;
};

READERS["stored-charge"] = (ctx) => {
    // (Bottle the Storm: as a foe's hit of its type comes — at its best, one as big as its resistance — that much kept off the caster, then
    // flung back with its spell attack.)
    const charge = ctx.entry.plan.resolution.storedCharge ?? {};
    const resistance = (charge.resistance?.fixed ?? []).filter((each) => ctx.rank >= Number(each.rank)).at(-1)?.value ?? Number(charge.resistance?.base) ?? 0;
    const foe = toughest(ctx.enemies);
    if (!foe || !(resistance > 0)) return null;
    const odds = degreeDistribution(Number(ctx.entry.attack) || 0, armorClass(foe));
    const back = (odds[2] + 2 * odds[3]) * averageOn(foe, `${resistance}[${charge.type ?? "electricity"}]`, charge.type, spellContext(ctx.entry, { isSpell: true, area: false }));
    return { entries: [...healEntries([ctx.caster], resistance), { target: foe, damage: back, worth: 0, heal: 0, benefit: 0 }], targets: 2 };
};

// --- Modes, a link, a streak (2026-10-21, batch 16) ---------------------------------------------------------------------------------------

// A mode's effect from its text (after its title): the foes' attack penalty, bleed when they take piercing or slashing damage, the
// party's attack or AC bonus. { foesAttack?, bleed?: { formula, types }, alliesAttack?, alliesAC? }
function modeEffect(part) {
    const effect = {};
    const penalty = /Enemies take a [–-](\d+) status penalty to attack rolls/i.exec(part);
    if (penalty) effect.foesAttack = Number(penalty[1]);
    const bleed = /Whenever an enemy takes (\w+) or (\w+) damage, they also take (\d+)d(\d+) persistent (\w+) damage/i.exec(part);
    if (bleed) effect.bleed = { formula: `${bleed[3]}d${bleed[4]}[${bleed[5].toLowerCase()}]`, types: [bleed[1].toLowerCase(), bleed[2].toLowerCase()] };
    const attack = /allies gain a \+(\d+) status bonus to attack rolls/i.exec(part);
    if (attack) effect.alliesAttack = Number(attack[1]);
    const ac = /allies gain a \+(\d+) status bonus to Armor Class/i.exec(part);
    if (ac) effect.alliesAC = Number(ac[1]);
    return effect;
}

// Musical Shift: a mode of each slot while it lasts (Sustained), on the foes and the party in its emanation — at its best all of them —
// the best pair: the foes' penalty as the hits it keeps off the party, their bleed each round from the party's piercing and slashing
// Strikes, the party's bonus to hit, its AC.
function modeReading(ctx, phases) {
    const plain = String(ctx.entry.doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const lasts = lastsRounds(60, ctx.rounds);
    const read = phases.map((phase) => {
        const title = String(phase.title ?? "");
        const index = plain.indexOf(title);
        const next = phases.map((other) => plain.indexOf(String(other.title ?? ""))).filter((at) => at > index).sort((a, b) => a - b)[0] ?? plain.length;
        return { slot: phase.state?.slot ?? 1, effect: index >= 0 ? modeEffect(plain.slice(index + title.length, next)) : {} };
    });
    const foe = toughest(ctx.enemies);
    if (!foe) return null;
    const context = spellContext(ctx.entry, { isSpell: true, area: true });
    const entriesOf = ({ foesAttack, bleed, alliesAttack, alliesAC }) => {
        const lists = [];
        if (foesAttack) lists.push(healEntries(ctx.allies, ctx.enemies.reduce((sum, enemy) => sum + penaltySaved(ctx, enemy, foesAttack, 0, lasts), 0) / ctx.allies.length));
        if (bleed && ctx.allies.some((ally) => (ally.strikes ?? []).some((strike) => bleed.types.includes(strike.damage?.[0]?.type)))) lists.push(ctx.enemies.map((enemy) => ({ target: enemy, damage: averageOn(enemy, bleed.formula, "bleed", context, true) * lasts, worth: 0, heal: 0, benefit: 0 })));
        if (alliesAttack) lists.push(spreadDamage(ctx.enemies, partyStrikeGain(ctx, foe, { bonus: alliesAttack }, lasts)));
        if (alliesAC) lists.push(ctx.allies.flatMap((ally) => healEntries([ally], acSaved(ctx, ally, alliesAC, lasts))));
        return lists;
    };
    const slots = [...new Set(read.map((each) => each.slot))];
    let combos = [[]];
    for (const slot of slots) combos = combos.flatMap((combo) => read.filter((each) => each.slot === slot).map((each) => [...combo, each.effect]));
    const options = combos.map((combo) => mergeEntries(combo.flatMap((effect) => entriesOf(effect)))).filter((entries) => entries.length).map((entries) => ({ entries, targets: entries.length }));
    return options.length ? { options } : null;
}

READERS["damage-share"] = (ctx) => {
    // (Life Link: its healing as cast on as many allies as its rank lets it link (its text's dice); the harm it shares between them and the
    // caster after, the party's Hit Points no more or less — not counted.)
    const link = ctx.entry.plan.resolution.damageShare ?? {};
    const text = String(ctx.entry.doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/@Damage\[([^\]]*)\]/g, "$1").replace(/\s+/g, " ");
    const base = /recovers (\d+)d(\d+)(?:\[\w+\])? Hit Points/i.exec(text);
    if (!base) return null;
    let dice = `${base[1]}d${base[2]}`;
    for (const match of text.matchAll(/Heightened \((\d+)(?:st|nd|rd|th)\)[^.]*\.\s*The initial healing increases to (\d+d\d+)/gi)) if (ctx.rank >= Number(match[1])) dice = match[2];
    const targets = (link.ranks ?? []).filter((step) => ctx.rank >= Number(step.rank)).at(-1)?.targets ?? 1;
    const heal = averageOn({ immunities: [], resistances: [], weaknesses: [] }, dice);
    const allies = ctx.allies.filter((ally) => ally !== ctx.caster).slice(0, targets);
    return allies.length ? { entries: healEntries(allies, heal), targets: allies.length } : null;
};

READERS["winning-streak"] = (ctx) => {
    // (Winning Streak: the best Striker Quickened — a fourth action, a Strike at its worst penalty — each round the streak lasts: while the
    // party critically hits the foes at least once a round (each one's two Strikes on the toughest).)
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    if (!best || !foe) return null;
    let none = 1;
    for (const ally of ctx.allies) {
        const strike = (ally.strikes ?? []).filter((each) => each.damage?.length).sort((a, b) => strikeOn(ally, b, foe) - strikeOn(ally, a, foe))[0];
        if (strike) for (const attacks of [0, 1]) none *= 1 - degreeDistribution((Number(strike.bonus) || 0) - multipleAttackPenalty(strike, attacks), armorClass(foe))[3];
    }
    let rounds = 0;
    for (let round = 0, held = 1; round < ctx.rounds; round++, held *= 1 - none) rounds += held;
    return { entries: [{ target: foe, damage: strikeOn(best.striker, best.strike, foe, { attacks: 2 }) * rounds, worth: 0, heal: 0, benefit: 0 }], targets: 1 };
};

READERS["strike-heal"] = (ctx) => {
    // (Shall not Falter, Shall not Rout: on the caster at its best a battle caster, the best Striker — its healing on its first hit each
    // round it lasts, below half its Hit Points as the fight goes at its best.)
    const heal = ctx.entry.plan.resolution.strikeHeal ?? {};
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    if (!best || !foe) return null;
    const hit = 1 - (1 - hitChance(best.strike, foe)) * (1 - hitChance(best.strike, foe, { attacks: 1 }));
    const healed = (Number(heal.multiple) || 2) * ctx.rank * hit * lastsRounds(heal.seconds, ctx.rounds);
    return { entries: healEntries([best.striker], healed), targets: 1 };
};

READERS["spirit-aid"] = (ctx) => {
    // (Helpful Wood Spirits: each round it's Sustained, the foes in its burst — as many as it holds, at its best — off-guard unless they make
    // their Reflex save; or difficult terrain on their way: the better.)
    const aid = ctx.entry.plan.resolution.spiritAid ?? {};
    const lasts = lastsRounds(aid.durationSeconds, ctx.rounds);
    const area = aid.area ?? { type: "burst", value: 5 };
    const round = { mode: "fixed", value: 1, unit: "rounds" };
    const distract = caught(ctx.enemies, area, ctx.choke).map((foe) => {
        const [critFail, fail] = degreeDistribution(saveModifier(foe, "reflex"), Number(ctx.entry.dc) || 10);
        return { target: foe, damage: 0, worth: (critFail + fail) * conditionWorth("off-guard", null, round) * lasts, heal: 0, benefit: 0 };
    });
    const obstacle = caught(ctx.enemies, area, ctx.choke).map((foe) => ({ target: foe, damage: 0, worth: approachLoss(foe, { inside: insideOf(Number(area.value) || 5, ctx), difficult: true }, ctx.rounds).worth, heal: 0, benefit: 0 })).filter((entry) => entry.worth > 0);
    const options = [distract, obstacle].filter((entries) => entries.length).map((entries) => ({ entries, targets: entries.length }));
    return options.length ? { options } : null;
};

READERS.hyphae = (ctx) => {
    // (Fungal Hyphae from the rank it lets the caster Strike through plants: its spell attacks — one the round it's cast, two each round
    // after (the second at its penalty) — on the toughest foe, while it lasts.)
    const hyphae = ctx.entry.plan.resolution.hyphae ?? {};
    const strikes = hyphae.strikes;
    const foe = toughest(ctx.enemies);
    if (!strikes || ctx.rank < Number(strikes.fromRank) || !foe) return null;
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const hit = averageOn(foe, `${strikes.formula}[${strikes.type ?? "bludgeoning"}]`, strikes.type, context);
    const one = (penalty) => {
        const odds = degreeDistribution((Number(ctx.entry.attack) || 0) - penalty, armorClass(foe));
        return odds[2] * hit + odds[3] * 2 * hit;
    };
    const lasts = lastsRounds(hyphae.durationSeconds, ctx.rounds);
    return { entries: [{ target: foe, damage: one(0) + (lasts - 1) * (one(0) + one(5)), worth: 0, heal: 0, benefit: 0 }], targets: 1 };
};

// --- Mantles (2026-10-21, batch 15): pick two of its options ------------------------------------------------------------------------------

// A mantle's options from its text, each by its name (labels): [{ label, strike?: { dice, die, type, reach, extra: [formula…],
// persistent? }, meleeDamage?, fastHealing?, cover?, resistance?: { value, types }, touched? (formula), aura?: { feet, slug, value },
// clumsy? }].
export function mantleOptions(text, labels) {
    const plain = String(text).replace(/@Damage\[([^\]]*)\]/g, "$1").replace(/@Template\[[^\]]*distance:(\d+)[^\]]*\]/g, "$1-foot emanation").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const at = labels.map((label) => ({ label, index: plain.indexOf(`${label} `) })).filter((each) => each.index >= 0).sort((a, b) => a.index - b.index);
    return at.map(({ label, index }, i) => {
        const part = plain.slice(index + label.length, i + 1 < at.length ? at[i + 1].index : plain.length);
        const option = { label };
        const base = /\bunarmed attack\b[^.]*\.(?:[^.]*\.)?[^.]*?\bdeals? (\d+)d(\d+)(?:\[(\w+)\])?(?: (\w+))? damage/i.exec(part) ?? /\bunarmed attack\b[^.]*?\bdeals? (\d+)d(\d+)(?:\[(\w+)\])?(?: (\w+))? damage/i.exec(part);
        if (base) {
            const extra = [...part.matchAll(/additional (\d+)d(\d+) (\w+) damage/gi)].filter((match) => !/persistent/i.test(match[3])).map((match) => `${match[1]}d${match[2]}[${match[3].toLowerCase()}]`);
            const persistent = /(\d+)d(\d+) persistent (\w+) damage/i.exec(part);
            option.strike = { dice: Number(base[1]), die: Number(base[2]), type: (base[3] ?? base[4] ?? "bludgeoning").toLowerCase(), reach: /\breach\b/i.test(part), extra, ...(persistent ? { persistent: `${persistent[1]}d${persistent[2]}[${persistent[3].toLowerCase()}]` } : {}) };
        }
        const melee = /\+(\d+) status bonus to melee damage/i.exec(part);
        if (melee) option.meleeDamage = Number(melee[1]);
        const healing = /fast healing (\d+)/i.exec(part);
        if (healing) option.fastHealing = Number(healing[1]);
        if (/\bYou gain cover\b/i.test(part)) option.cover = 2;
        const resistance = /resistance (\d+) to ([a-z, ]+?)(?:\.|$)/i.exec(part);
        if (resistance) option.resistance = { value: Number(resistance[1]), types: resistance[2].split(/,|\band\b/).map((each) => each.trim().toLowerCase()).filter(Boolean) };
        const touched = /hits you with a melee[^.]*?takes (\d+d\d+(?:\[\w+\])?) damage/i.exec(part);
        if (touched) option.touched = touched[1];
        const aura = /(\d+)-foot emanation[^.]*\.[^.]*?\b(Sickened|Frightened|Clumsy|Enfeebled|Stupefied) (\d+)/i.exec(part);
        if (aura) option.aura = { feet: Number(aura[1]), slug: aura[2].toLowerCase(), value: Number(aura[3]) };
        if (/\bYou're Clumsy 1\b/i.test(part)) option.clumsy = 1;
        return option;
    });
}

// What an option pair does for the caster at its best (the party's best Striker: a battle caster's mantle) while it lasts: its new
// Strike in place of its own where better (the striking runes' dice, its other damage on a hit, its persistent damage a round on one), its
// melee damage bonus, fast healing, cover, resistances against the foes' damage of their types, a melee hitter's burn, an aura's
// condition on the foes in it — clumsy as its AC 1 lower.
function mantleEntries(ctx, options, lasts) {
    const best = bestStrike(ctx, "melee");
    const foe = toughest(ctx.enemies);
    if (!best || !foe) return [];
    const wearer = best.striker;
    const context = spellContext(ctx.entry, { isSpell: true, area: false });
    const round = (strike, bonusDamage, extra) => [0, 1].reduce((sum, attacks) => sum + strikeOn(wearer, strike, foe, { attacks, extra: extra + bonusDamage }), 0);
    const meleeDamage = options.reduce((sum, option) => sum + (option.meleeDamage ?? 0), 0);
    const strikes = options.filter((option) => option.strike).map((option) => {
        const [part] = best.strike.damage;
        // (Its own dice, or the striking runes' where more — handwraps of the caster's level.)
        const strike = { ...best.strike, name: option.label, agile: false, damage: [{ ...part, dice: Math.max(Number(part.dice) || 1, option.strike.dice || 1), die: option.strike.die, type: option.strike.type }] };
        const extra = option.strike.extra.reduce((sum, formula) => sum + averageOn(foe, formula, "untyped", context), 0) + (option.strike.persistent ? 0.5 * averageOn(foe, option.strike.persistent, "fire", context, true) : 0);
        return { strike, extra };
    });
    const own = round(best.strike, meleeDamage, 0);
    const mantled = Math.max(own, ...strikes.map(({ strike, extra }) => round(strike, meleeDamage, extra)));
    const plain = round(best.strike, 0, 0);
    const dealt = Math.max(0, mantled - plain) * lasts;
    const ac = Number(wearer.ac) || 15;
    const side = Math.max(1, ctx.allies.length);
    let kept = 0;
    let burned = 0;
    for (const option of options) {
        if (option.fastHealing) kept += option.fastHealing * lasts;
        if (option.cover) kept += ctx.enemies.reduce((sum, enemy) => sum + strikeDamageOn(enemy, ac) - strikeDamageOn(enemy, ac + option.cover), 0) * lasts / side;
        if (option.clumsy) kept -= ctx.enemies.reduce((sum, enemy) => sum + strikeDamageOn(enemy, ac - option.clumsy) - strikeDamageOn(enemy, ac), 0) * lasts / side;
        if (option.resistance) {
            for (const enemy of ctx.enemies) {
                const { hits, damage, types = [] } = hitsOn(enemy, ac);
                if (types.some((type) => option.resistance.types.includes(type))) kept += hits * Math.min(option.resistance.value, damage) * lasts / side;
            }
        }
        if (option.touched) {
            for (const enemy of ctx.enemies) {
                const strike = (enemy.strikes ?? []).filter((each) => each.melee).sort((a, b) => b.bonus - a.bonus)[0];
                if (!strike) continue;
                const hits = [0, 1].reduce((sum, attack) => {
                    const odds = degreeDistribution(strike.bonus - attack * (strike.agile ? 4 : 5), ac);
                    return sum + odds[2] + odds[3];
                }, 0);
                burned += hits / side * lasts * averageOn(enemy, option.touched, "fire", context);
            }
        }
    }
    const aura = options.find((option) => option.aura);
    const sickened = aura ? caught(ctx.enemies, { type: "emanation", value: aura.aura.feet }, ctx.choke).map((enemy) => ({ target: enemy, damage: 0, worth: conditionWorth(aura.aura.slug, aura.aura.value, null), heal: 0, benefit: 0 })) : [];
    return mergeEntries([spreadDamage(ctx.enemies, dealt + burned), sickened, kept > 0 ? healEntries([wearer], kept) : []]);
}

// A mantle's reading: each pair of its options (it takes two), the best of them.
function mantleReading(ctx, labels, seconds) {
    const options = mantleOptions(ctx.entry.doc?.system?.description?.value ?? "", labels);
    if (options.length < 2) return null;
    const lasts = lastsRounds(seconds, ctx.rounds);
    const pairs = [];
    for (let i = 0; i < options.length; i++) for (let j = i + 1; j < options.length; j++) pairs.push([options[i], options[j]]);
    const found = pairs.map((pair) => mantleEntries(ctx, pair, lasts)).filter((entries) => entries.length).map((entries) => ({ entries, targets: entries.length }));
    return found.length ? { options: found } : null;
}

READERS["option-mantle"] = (ctx) => {
    // (Mantle of the Magma Heart, of the Unwavering Heart: two of its options, the best pair.)
    const mantle = ctx.entry.plan.resolution.optionMantle ?? {};
    return mantleReading(ctx, (mantle.options ?? []).map((option) => option.label), mantle.seconds);
};

READERS["generated-form"] = (ctx) => {
    // (Mantle of Heaven's Slopes: a form whose rules let it pick two of the options its text names — read as a mantle.)
    const form = ctx.entry.plan.resolution.generatedForm ?? {};
    const labels = [...new Set((form.rules ?? []).flatMap((rule) => (rule.suboptions ?? []).map((option) => option.label)))];
    return labels.length >= 2 ? mantleReading(ctx, labels, form.seconds) : null;
};

READERS["stored-burst"] = (ctx) => {
    // (Reflective Scales: its resistance to the foes' hits on the caster — at its best, of the type they deal — over the fight, the damage
    // it prevents; then its burst about the caster (the foes in it, at its best), a die for each 10 prevented up to its most, a basic save.)
    const burst = ctx.entry.plan.resolution.storedBurst ?? {};
    const steps = (scale) => Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(scale?.interval) || 2)) * (Number(scale?.step) || 0);
    const resistance = (Number(burst.resistance?.base) || 0) + steps(burst.resistance);
    const most = (Number(burst.max?.base) || 0) + steps(burst.max);
    const ac = Number(ctx.caster.ac) || 15;
    const lasts = lastsRounds(burst.seconds, ctx.rounds);
    const prevented = ctx.enemies.reduce((sum, foe) => {
        const { hits, damage } = hitsOn(foe, ac);
        return sum + hits * Math.min(resistance, damage);
    }, 0) * lasts / Math.max(1, ctx.allies.length);
    const dice = Math.min(most, Math.floor(prevented / (Number(burst.every) || 10)));
    const type = (burst.types ?? ["fire"])[0];
    const context = spellContext(ctx.entry, { isSpell: true, area: true });
    const hurt = dice > 0 ? caught(ctx.enemies, { type: "emanation", value: Number(burst.radius) || 20 }, ctx.choke).map((foe) => ({ target: foe, damage: basicShare(degreeDistribution(saveModifier(foe, burst.statistic ?? "reflex"), Number(ctx.entry.dc) || 10)) * Math.max(...(burst.types ?? [type]).map((each) => averageOn(foe, `${dice}d${Number(burst.die) || 6}[${each}]`, each, context))), worth: 0, heal: 0, benefit: 0 })) : [];
    const entries = [...hurt, ...(prevented > 0 ? healEntries([ctx.caster], prevented) : [])];
    return entries.length ? { entries, targets: entries.length } : null;
};

// --- Rules on the caster (2026-10-21, batch 11) -----------------------------------------------------------------------------------------

// A foe's expected hits a round on a creature of armour class `ac`: its best Strike's two (the second at its penalty). { hits, damage }:
// the hits, and a hit's average damage.
function hitsOn(foe, ac) {
    let best = { hits: 0, damage: 0 };
    for (const strike of foe.strikes ?? []) {
        const damage = (strike.damage ?? []).reduce((sum, part) => sum + (Number(part.dice) || 0) * ((Number(part.die) || 0) + 1) / 2 + (Number(part.bonus) || 0), 0);
        const hits = [0, 1].reduce((sum, attack) => {
            const odds = degreeDistribution((Number(strike.bonus) || 0) - multipleAttackPenalty(strike, attack), ac);
            return sum + odds[2] + odds[3];
        }, 0);
        if (hits * damage > best.hits * best.damage) best = { hits, damage, types: (strike.damage ?? []).map((part) => part.type) };
    }
    return best;
}

const CONCEALED = "Compendium.pf2e.conditionitems.Item.DmAIPqOBomZ7H95W";

// What rules on the caster do over `lasts` rounds: concealment (a fifth of the foes' hits on it missed: the flat check), resistance to
// the foes' damage of its type (holy or unholy: a foe with that trait's), its Strikes' new traits on foes weak to them (the party's best
// Striker's, at its best). Entries, or null with none of these.
function ruleEntries(ctx, rules, lasts, scale) {
    const value = (rule) => (String(rule.value).includes("{") ? scale : Number(rule.value) || 0);
    const caster = ctx.caster;
    const ac = Number(caster.ac) || 15;
    const side = Math.max(1, ctx.allies.length);
    let kept = 0;
    let dealt = 0;
    for (const rule of rules) {
        if (rule.key === "GrantItem" && rule.uuid === CONCEALED) kept += concealedSaved(ctx, caster, lasts);
        if (rule.key === "Resistance" && value(rule) > 0) {
            for (const foe of ctx.enemies) {
                const { hits, damage, types = [] } = hitsOn(foe, ac);
                if (types.includes(rule.type) || (foe.traits ?? []).includes(rule.type)) kept += hits * Math.min(value(rule), damage) * lasts / side;
            }
        }
        if (rule.key === "AdjustStrike" && rule.property === "traits" && ["holy", "unholy"].includes(rule.value)) {
            const best = bestStrike(ctx, "melee");
            for (const foe of best ? ctx.enemies : []) {
                const weakness = Math.max(0, ...(foe.weaknesses ?? []).filter((each) => each.type === rule.value).map((each) => Number(each.value) || 0));
                dealt += weakness * (hitChance(best.strike, foe) + hitChance(best.strike, foe, { attacks: 1 })) * lasts;
            }
        }
    }
    const entries = [...spreadDamage(ctx.enemies, dealt), ...(kept > 0 ? healEntries([caster], kept) : [])];
    return entries.length ? { entries, targets: entries.length } : null;
}

READERS["rule-set"] = (ctx) => {
    // (Whirling Scarves, Spiritual Attunement: their rules on the caster while they last (longer at higher ranks, where they say), the best
    // of their choices; the rest — jumping, falls — not counted.)
    const set = ctx.entry.plan.resolution.ruleSet ?? {};
    if (set.recipient !== "self") return null;
    const seconds = (set.secondsByRank ?? []).filter((step) => ctx.rank >= Number(step.rank)).at(-1)?.seconds ?? set.seconds;
    const lasts = lastsRounds(seconds, ctx.rounds);
    const scale = set.scale ? (Number(set.scale.value) || 0) + Math.floor(Math.max(0, ctx.rank - (Number(ctx.entry.plan.rank) || ctx.rank)) / (Number(set.scale.interval) || 1)) * (Number(set.scale.per) || 0) : 0;
    const choices = set.choice?.options?.length ? set.choice.options.map((option) => [...(set.rules ?? []), ...(option.rules ?? [])]) : [set.rules ?? []];
    const options = choices.map((rules) => ruleEntries(ctx, rules, lasts, scale)).filter(Boolean);
    return options.length ? { options } : null;
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
