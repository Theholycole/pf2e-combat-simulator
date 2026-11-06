// A necromancer's thralls (2026-11-02; the user: "the spell module handles Necromancer thralls"): the spell module's thrall rules
// (scripts/thrall-tokens.js; its compiler reads Create Thrall as thrall-create and a grave spell's "1 of your thralls" as targeting.thrall).
//   - A thrall Strike (the necromancer's "Thrall" strike): the turn's first is Create Thrall's command option — 1 action, a thrall that
//     Strikes at once, and with Thrall Proliferation one more —; later ones Command a Thrall it has, or Create Thrall again.
//   - A spell cast through a thrall (Necrotic Bomb, Bone Spear): one of its thralls, destroyed when the spell says so; with none, Create
//     Thrall first (an action more: two thralls, and Proliferation's third, once a round).
// (2026-11-06, Cole's pick "Thralls as bodies": each thrall is a creature on the field — the thrall rules' level −1, 1 Hit Point, Speed 15,
// mindless undead immune to bleed, death effects, disease, mental and poison; checks against it succeed (AC and saves at the bottom). It
// stands beside the foe it was made to Strike, takes no turns of its own (it acts only when commanded), and foes can Strike it or catch it
// in an area: one destroyed is one fewer. `c.thralls` stays the count, kept with its bodies. At most MAX_BODIES at once (the oldest goes;
// my cap, the rules give none but the minute).) Thralls of the necromancer's strike are commanded, not moved: a Command needs a thrall
// already beside the target, else it's Create Thrall there.
// Pure, but for the creatures it changes.

import { DEAD, createCombatant, isActive } from "./combatant.js";
import { engage, removeFromSpace, sameMelee, distanceBetween } from "./space.js";
import { placeArrival } from "./grid-fight.js";
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, degreeOf } from "./checks.js";
import { saveModifier } from "./combatant.js";
import { applyDamage } from "./actions.js";
import { rollInstances } from "./spells.js";
import { parseDamage } from "../../../pf2e-resolution-core/src/index.js";

export const needsThrall = (spell) => Boolean(spell?.plan?.targeting?.thrall);
export const thrallsOf = (c) => c.thralls ?? 0;
export const THRALL_BODY = Object.freeze({ level: -1, hp: 1, speed: 15, traits: ["mindless", "undead", "thrall"], immunities: ["bleed", "death-effects", "disease", "mental", "poison"] });
const MAX_BODIES = 8;
let made = 0;

// Its thralls on the field.
export const thrallBodies = (state, c) => state.list.filter((other) => other.thrallOf === c.id && isActive(other));

// One body, beside `near` (a foe) when given.
function spawnBody(state, c, near, extra = null) {
    const id = `${c.id}~thrall${++made}`;
    const body = createCombatant({ id, name: `${c.name}'s thrall`, side: c.side, kind: "npc", level: THRALL_BODY.level, traits: [...THRALL_BODY.traits], immunities: [...THRALL_BODY.immunities],
        hp: { value: THRALL_BODY.hp, max: THRALL_BODY.hp, temp: 0 }, ac: -10, saves: { fortitude: -20, reflex: -20, will: -20 }, perception: -20, speed: THRALL_BODY.speed, strikes: [], reactions: { aoo: false, shieldBlock: false } });
    Object.assign(body, { thrallOf: c.id, noTurns: true, round: c.round }, extra ?? {});
    if (extra?.immunities) body.immunities = [...THRALL_BODY.immunities, ...extra.immunities];
    state.list.push(body);
    state.byId.set(id, body);
    if (state.grid && c.square) {
        body.square = null;
        placeArrival(state, body);
    }
    if (near && isActive(near)) engage(state, body, near);
    const bodies = thrallBodies(state, c);
    if (bodies.length > MAX_BODIES) destroyBody(state, bodies[0], "crumbles");
    return body;
}

// A thrall gone (spent by a spell, crumbled): off the field, without a death of its own to answer.
export function destroyBody(state, body, words = "is destroyed") {
    if (!body || body.status === DEAD) return;
    body.status = DEAD;
    body.vanished = true;
    removeFromSpace(state, body);
    const master = state.byId.get(body.thrallOf);
    if (master) master.thralls = thrallBodies(state, master).length;
    state.log?.push(`  ${body.name} ${words}`);
}

// A thrall killed (Struck, caught in an area): its necromancer's count follows (actions.js kill).
export function thrallKilled(state, body) {
    const master = body?.thrallOf ? state.byId.get(body.thrallOf) : null;
    if (master) master.thralls = thrallBodies(state, master).length;
}

// One of its thralls spent: the one beside `near` if any, else its oldest.
export function spendThrall(state, c, near = null) {
    const bodies = thrallBodies(state, c);
    if (!bodies.length) {
        c.thralls = Math.max(0, thrallsOf(c) - 1);
        return null;
    }
    const body = (near && bodies.find((each) => sameMelee(each, near))) ?? bodies[0];
    destroyBody(state, body);
    return body;
}

function createThralls(state, c, count, near = null) {
    const extra = c.thrallMaker?.proliferation && c.thrallProliferatedRound !== state.round ? c.thrallMaker.proliferation : 0;
    if (extra) c.thrallProliferatedRound = state.round;
    for (let i = 0; i < count + extra; i++) spawnBody(state, c, near);
    c.thralls = thrallBodies(state, c).length;
    state.stats.thralls = (state.stats.thralls ?? 0) + count + extra;
    return count + extra;
}

// Before a thrall Strike on `target`: which way the thrall comes to Strike — a thrall beside it Commanded, else Create Thrall beside it.
export function thrallStrikes(state, c, target = null) {
    if (!c.thrallMaker) return;
    const beside = target ? thrallBodies(state, c).find((body) => sameMelee(body, target) || distanceBetween(body, target) <= 5) : null;
    if (beside) {
        state.log?.push(`  ${c.name} Commands a Thrall to Strike`);
        return;
    }
    const count = createThralls(state, c, 1, target);
    state.log?.push(`  ${c.name} casts Create Thrall (${count} thrall${count === 1 ? "" : "s"}) and Commands one to Strike`);
}

// A spell cast through a thrall: Create Thrall first when it has none (the planner's makeThrall action), then the thrall it spends.
export function thrallForSpell(state, c, spell, action = {}, target = null) {
    if (!c.thrallMaker || !needsThrall(spell)) return;
    if (thrallsOf(c) <= 0 || action.makeThrall) {
        const count = createThralls(state, c, 2, target);
        state.log?.push(`  ${c.name} casts Create Thrall (${count} thralls)`);
    }
    if (spell.plan.targeting.thrall.destroyed) spendThrall(state, c, target);
}

// (2026-11-06, the thrall spells that make thralls of their own — Bloody Tendrils, Skeletal Lancers: `count` bodies, one beside each foe in
// turn from the nearest, each with the spell's `aura` — { reach, on: "turn-end" | "strike", damage, basic (a basic Reflex save at dc) }.)
export function spawnThrallField(state, c, { count, aura, name, immunities = [] }) {
    const foes = state.list.filter((other) => other.side !== c.side && isActive(other) && other.kind !== "object").sort((a, b) => distanceBetween(c, a) - distanceBetween(c, b));
    if (!foes.length) return 0;
    for (let i = 0; i < count; i++) spawnBody(state, c, foes[i % foes.length], { name: `${c.name}'s ${name}`, thrallAura: { ...aura, by: c.id }, immunities });
    c.thralls = thrallBodies(state, c).length;
    state.log?.push(`  ${c.name} makes ${count} ${name}${count === 1 ? "" : "s"}`);
    return count;
}

const near = (body, foe, reach) => sameMelee(body, foe) || distanceBetween(body, foe) <= reach;
function auraHits(state, body, foe) {
    const aura = body.thrallAura;
    const maker = state.byId.get(aura.by);
    let instances = rollInstances(state, parseDamage(aura.damage));
    if (aura.basic) {
        const natural = state.rng.d20();
        const degree = degreeOf(natural + saveModifier(foe, "reflex"), aura.dc, natural);
        const factor = degree === CRITICAL_SUCCESS ? 0 : degree === FAILURE ? 1 : degree === CRITICAL_FAILURE ? 2 : 0.5;
        instances = instances.map((instance) => ({ ...instance, amount: Math.floor(instance.amount * factor) }));
    }
    state.log?.push(`  ${body.name} lashes ${foe.name}`);
    if (instances.some((instance) => instance.amount > 0)) applyDamage(state, foe, instances, { source: maker ?? body });
}

// A foe ending its turn within a tendril's reach (Bloody Tendrils): one lash, whichever tendril.
export function thrallAuraTurnEnd(state, foe) {
    const body = state.list.find((other) => other.thrallAura?.on === "turn-end" && isActive(other) && other.side !== foe.side && near(other, foe, other.thrallAura.reach));
    if (body && isActive(foe)) auraHits(state, body, foe);
}

// A foe making a Strike within a lancer's reach (Skeletal Lancers): its damage once a Strike.
export function thrallAuraStrike(state, attacker) {
    const body = state.list.find((other) => other.thrallAura?.on === "strike" && isActive(other) && other.side !== attacker.side && near(other, attacker, other.thrallAura.reach));
    if (body && isActive(attacker)) auraHits(state, body, attacker);
}
