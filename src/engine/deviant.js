// Deviant abilities (Dark Archive; 2026-11-01, the user: "make all deviant abilities and their backlashes work in the simulator and rank
// them"). A deviant feat is played as what it does in a fight — a save or an attack (an ability, kind "ability", in the plan shape the feat
// module compiles), a Strike activity, an Effect on its user or a reaction —, each of its awakenings as an option, and every use as PF2e
// has it: a flat check, DC 5 and 5 higher after each success (20 at most); on a failure the ability still happens, then the backlash of
// its classification — mild, then moderate, then severe —, and the DC back to 5. After a severe backlash, no more deviations that day:
// in a fight, none for the rest of it. Backlash isn't reduced by resistance or immunity, but a weakness still adds to it.
//   Not played (no part of a fight the simulator keeps): Consume Energy (counteracts a foe's energy ability), Ghostly Grasp without an
//   awakening, Distant Wandering, Borrowed Ability, Sprout Fruit, Bone Spikes (a Strike below a martial's own), Propulsive Leap (flight
//   alone), Release Spores (a lasting cloud), Disperse Into Petals, Sonic Dash without its sonic boom, and the awakenings that only move
//   creatures about or change senses.
import { flatCheck, SUCCESS } from "./checks.js";
import { isActive } from "./combatant.js";
import { addPersistent, dealDamage } from "./actions.js";
import { applyCondition, applyHeal, castPlan } from "./spells.js";
import { sameMelee } from "./space.js";

export const CLASSIFICATIONS = Object.freeze({
    "blasting-beams": "dragon", "consume-energy": "dragon", "storming-breath": "dragon", "propulsive-leap": "dragon",
    "bone-spikes": "troll", "titan-swing": "troll", "high-speed-regeneration": "troll", "tectonic-stomp": "troll",
    "eerie-flicker": "wraith", "ghostly-grasp-deviant": "wraith", "enervating-wail": "wraith", "distant-wandering": "wraith",
    "sprout-fruit": "verdant", "vine-lash": "verdant", "defensive-growth": "verdant", "disperse-into-petals": "verdant",
    "draining-touch": "leech", "borrowed-ability": "leech", "kinetic-dampening": "leech", "feed-the-void": "leech",
    "release-spores": "blight", "rotten-slurry": "blight", "irradiate": "blight", "unleash-the-blight": "blight",
    "sonic-dash": "flicker", "overclock-senses": "flicker", "unstable-gearshift": "flicker", "lightspeed-assault": "flicker"
});
export const BACKLASH_NAMES = Object.freeze({ dragon: "Energetic Meltdown", troll: "Strained Metabolism", wraith: "Encroaching Presence", verdant: "Life-Draining", leech: "All-Consuming Hunger", blight: "Fungal Rot", flicker: "Desynchronized Motions" });
// (A dragon deviation's energy: the user chooses one; electricity, the one fewest creatures resist.)
export const DRAGON_ENERGY = "electricity";

export const deviantSlug = (name) => String(name ?? "").toLowerCase().replace(/\(deviant\)/, "deviant").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// --- Backlash -----------------------------------------------------------------------

const STAGES = ["mild", "moderate", "severe"];
const minutes = (value) => ({ mode: "fixed", value, unit: "minutes" });
const rounds = (value) => ({ mode: "fixed", value, unit: "rounds" });

// What a backlash does, by classification and stage (1 mild, 2 moderate, 3 severe), at the user's level: damage it takes (energy, and
// whether nonlethal), persistent damage, conditions, a weakness, and (dragon, severe) a burst on everyone around.
export function backlashOf(classification, stage, level) {
    const L = level;
    switch (classification) {
        case "dragon":
            if (stage === 1) return { damage: [{ amount: L, type: DRAGON_ENERGY }] };
            if (stage === 2) return { damage: [{ amount: L, type: DRAGON_ENERGY }], weakness: { type: DRAGON_ENERGY, value: Math.floor(L / 3) } };
            return { burst: { dice: L, die: 6, type: DRAGON_ENERGY, save: "fortitude", within: "melee" } };
        case "troll":
            if (stage === 1) return { conditions: [["enfeebled", 1], ["clumsy", 1]] };
            if (stage === 2) return { conditions: [["enfeebled", 1], ["clumsy", 1], ["fatigued", null]] };
            return { conditions: [["sickened", 2], ["enfeebled", 1], ["clumsy", 1], ["fatigued", null]] };
        case "wraith":
            if (stage === 1) return { conditions: [["frightened", 3]] };
            // ("All creatures become concealed to you", for 10 minutes: dazzled's, as the engine has it.)
            if (stage === 2) return { conditions: [["dazzled", null, minutes(10)]] };
            return { conditions: [["doomed", 1], ["drained", 2]] };
        case "verdant":
            if (stage === 1) return { conditions: [["drained", 1]] };
            if (stage === 2) return { conditions: [["drained", 2], ["fatigued", null]] };
            return { conditions: [["drained", 3], ["fatigued", null]] };
        case "leech":
            // (Fascinated with a creature it just affected; mild, it ends when that creature acts against it or its allies — in a fight, all
            // but straight away —; moderate, only against itself, about two rounds; severe, confused at that creature alone: its attacks
            // still go at the foe, so played as fascinated for the rest of the fight — no concentrate actions, -2 Perception and skills.)
            if (stage === 1) return { conditions: [["fascinated", null, rounds(1)]] };
            if (stage === 2) return { conditions: [["fascinated", null, rounds(2)]] };
            return { conditions: [["fascinated", null, minutes(1)]] };
        case "blight":
            if (stage === 1) return { damage: [{ amount: L, type: "untyped" }] };
            if (stage === 2) return { damage: [{ amount: L, type: "untyped" }], conditions: [["sickened", 2]] };
            return { damage: [{ amount: 2 * L, type: "untyped" }], conditions: [["sickened", 4]] };
        case "flicker": {
            const persistent = { type: "fire", dice: 2 + Math.floor(L / 5), die: 4 };
            if (stage === 1) return { persistent };
            // (Immobilized, out of phase with the ground: an Escape against its deviation DC, or a minute — played as the minute.)
            if (stage === 2) return { persistent, conditions: [["immobilized", null, minutes(1)]] };
            return { damage: [{ amount: Math.round(L * 2.5), type: "mental", nonlethal: true }], conditions: [["stupefied", 3, minutes(10)]] };
        }
        default:
            return {};
    }
}

const deviationOf = (c) => (c.deviation ??= { dc: 5, stage: 0, spent: false, lasting: [] });

// What outlasts the fight, to the next one that day (a day of fights, tools/lib/feat-power.mjs): "until your next daily preparations",
// "until you can get a full night's rest", "2 hours napping" — not what a meal or a short rest ends between fights.
export function lastingBacklash(classification, stage, level) {
    if (classification === "dragon" && stage >= 2) return [{ weakness: { type: DRAGON_ENERGY, value: Math.floor(level / 3) } }];
    if (classification === "wraith" && stage === 3) return [{ condition: ["doomed", 1] }, { condition: ["drained", 2] }];
    if (classification === "verdant" && stage === 3) return [{ condition: ["drained", 3] }, { condition: ["fatigued", null] }];
    if (classification === "troll" && stage === 3) return [{ condition: ["fatigued", null] }];
    if (classification === "flicker" && stage === 3) return [{ condition: ["stupefied", 1] }];
    if (classification === "blight" && stage === 3) return [{ condition: ["sickened", 1] }];
    return [];
}

// (A day's later fight: the deviation as the last one left it — its DC, its backlash so far, spent or not — and what outlasts a fight.)
export function deviantFightStart(state, c) {
    if (c.deviationStarted) return;
    c.deviationStarted = true;
    const carried = c.deviationCarried;
    if (!carried) return;
    c.deviation = { dc: carried.dc, stage: carried.stage, spent: carried.spent, lasting: [...(carried.lasting ?? [])] };
    for (const entry of carried.lasting ?? []) {
        if (entry.weakness) c.weaknesses = [...(c.weaknesses ?? []), { ...entry.weakness, exceptions: [] }];
        if (entry.condition && applyCondition(state, c, entry.condition[0], entry.condition[1], null, c)) state.log?.push(`  ${c.name} is still ${entry.condition[0]}${Number.isFinite(entry.condition[1]) ? ` ${entry.condition[1]}` : ""} from its backlash`);
    }
    state.log?.push(`  ${c.name}'s deviation: flat DC ${c.deviation.dc}, ${c.deviation.stage ? `${STAGES[c.deviation.stage - 1]} backlash taken` : "no backlash yet"}${c.deviation.spent ? ", spent" : ""}`);
}
// Whether it can still use a deviation this fight.
export const deviantUsable = (c) => !(c.deviation ?? c.deviationCarried)?.spent;

// A deviation used: its flat check, and on a failure its backlash. ({ entry } has deviant: { classification }; affected: the creatures it
// just affected, for a leech's fascination.)
export function deviantUsed(state, c, entry, { affected = null } = {}) {
    const deviant = entry?.deviant;
    if (!deviant || !isActive(c)) return;
    deviantFightStart(state, c);
    const deviation = deviationOf(c);
    if (deviation.spent) return;
    // (Lightspeed Assault: one check, "regardless of how many actions" — once a turn.)
    if (deviant.oncePerTurn) {
        if (c.usedThisTurn?.has(`deviant:${entry.name}`)) return;
        (c.usedThisTurn ??= new Set()).add(`deviant:${entry.name}`);
    }
    const dc = deviation.dc;
    const passed = flatCheck(state.rng, dc) >= SUCCESS;
    if (passed) {
        deviation.dc = Math.min(20, dc + 5);
        state.log?.push(`  ${c.name}'s deviation holds (flat DC ${dc}; next DC ${deviation.dc})`);
        return;
    }
    deviation.dc = 5;
    deviation.stage = Math.min(3, deviation.stage + 1);
    if (state.stats) state.stats.backlashes = (state.stats.backlashes ?? 0) + 1;
    const backlash = c.noBacklash ? {} : backlashOf(deviant.classification, deviation.stage, c.level ?? 1);
    state.log?.push(`  ${c.name} suffers ${STAGES[deviation.stage - 1]} backlash (${BACKLASH_NAMES[deviant.classification] ?? deviant.classification}; flat DC ${dc} failed)${c.noBacklash ? " — not played" : ""}`);
    if (deviation.stage === 3) deviation.spent = true;
    if (!c.noBacklash) deviation.lasting = [...(deviation.lasting ?? []), ...lastingBacklash(deviant.classification, deviation.stage, c.level ?? 1)];
    applyBacklash(state, c, backlash, { affected });
}

function applyBacklash(state, c, backlash, { affected }) {
    for (const part of backlash.damage ?? []) {
        // (Not reduced by resistance or immunity; a weakness still adds to it.)
        const weak = part.type === "untyped" ? 0 : Math.max(0, ...(c.weaknesses ?? []).filter((entry) => entry.type === part.type).map((entry) => Number(entry.value) || 0));
        const dealt = dealDamage(state, c, part.amount + weak, { nonlethal: !!part.nonlethal });
        state.log?.push(`  ${c.name} takes ${dealt} ${part.type} from the backlash`);
    }
    if (backlash.persistent && isActive(c)) {
        const { type, dice, die } = backlash.persistent;
        addPersistent(c, { type, dice, die, bonus: 0, multiplier: 1, amount: dice * (die + 1) / 2 });
        state.log?.push(`  ${c.name} takes ${dice}d${die} persistent ${type}`);
    }
    if (backlash.weakness) {
        c.weaknesses = [...(c.weaknesses ?? []).filter((entry) => !(entry.type === backlash.weakness.type && entry.value >= backlash.weakness.value)), { type: backlash.weakness.type, value: backlash.weakness.value, exceptions: [] }];
        c.immunities = (c.immunities ?? []).filter((entry) => entry !== backlash.weakness.type);
        state.log?.push(`  ${c.name} gains weakness ${backlash.weakness.value} to ${backlash.weakness.type}`);
    }
    if (backlash.burst) {
        // (Severe, Energetic Meltdown: (level)d6 to every creature within 30 feet, a basic Fortitude save against its class DC; it takes the
        // full damage. Within 30 feet: those in its Melee.)
        const { dice, die, type } = backlash.burst;
        let own = 0;
        for (let roll = 0; roll < dice; roll++) own += state.rng.die(die);
        const around = state.list.filter((other) => other !== c && isActive(other) && sameMelee(c, other));
        if (around.length) castPlan(state, c, burstEntry(c, dice, die, type), around.map((other) => other.id), 2);
        const weak = Math.max(0, ...(c.weaknesses ?? []).filter((entry) => entry.type === type).map((entry) => Number(entry.value) || 0));
        const dealt = dealDamage(state, c, own + weak);
        state.log?.push(`  ${c.name}'s deviation bursts: it takes ${dealt} ${type}`);
    }
    for (const [slug, value, duration] of backlash.conditions ?? []) {
        if (!isActive(c)) break;
        // (A leech's fascination: with a creature it just affected — the engine's fascinated ends with hostility.)
        if (slug === "fascinated" && affected && !affected.some((other) => isActive(other))) continue;
        if (applyCondition(state, c, slug, value, duration ?? null, c)) state.log?.push(`  ${c.name} is ${slug}${Number.isFinite(value) ? ` ${value}` : ""}`);
    }
}

function burstEntry(c, dice, die, type) {
    const dc = c.deviantDC ?? 10 + (c.level ?? 1) + 4;
    return { name: "Energetic Meltdown", plan: savePlan("Energetic Meltdown", { actions: 0, traits: ["deviant"], area: { type: "emanation", value: 30 }, save: "fortitude", dc, damage: `${dice}d${die}[${type}]` }), castRank: 1, dc, attack: null, pool: null, kind: "ability", actionType: "free", rechargeGroup: "Energetic Meltdown", feat: true };
}

// What its next backlash would cost it, in the planner's units for an effect on itself (effectBenefit's: a share of its Hit Points, a
// condition's harm), times the chance its flat check fails — so the AI takes the risk as a player does. Losing its deviations for the
// fight counts too.
export function deviantRisk(c, conditionHarm) {
    if (c.noBacklash) return 0;
    const deviation = c.deviation ?? c.deviationCarried ?? { dc: 5, stage: 0 };
    if (deviation.spent) return Infinity;
    const stage = Math.min(3, deviation.stage + 1);
    const backlash = backlashOf(c.deviantClassification ?? "troll", stage, c.level ?? 1);
    const hp = Math.max(1, c.hp?.max ?? 1);
    let harm = 0;
    for (const part of backlash.damage ?? []) harm += part.amount / hp;
    if (backlash.persistent) harm += 2 * backlash.persistent.dice * (backlash.persistent.die + 1) / 2 / hp;
    if (backlash.weakness) harm += 0.03 * backlash.weakness.value * 3;
    if (backlash.burst) harm += backlash.burst.dice * 3.5 / hp;
    for (const [slug, value, duration] of backlash.conditions ?? []) harm += Math.max(0, conditionHarm(slug, value ?? 1, duration ?? rounds(3)) || 0);
    if (stage === 3) harm += 0.2;
    return ((deviation.dc - 1) / 20) * harm;
}

// --- The abilities -----------------------------------------------------------------

const BASIC = { criticalSuccess: 0, success: 0.5, failure: 1, criticalFailure: 2 };
const ATTACK = { criticalSuccess: 2, success: 1, failure: 0, criticalFailure: 0 };
const DEGREES = ["criticalSuccess", "success", "failure", "criticalFailure"];

// A save's or an attack's plan, the shape the feat module compiles (resolution "save"): shared damage by degree, more damage formulas by
// degree (persistent), and conditions by degree.
export function savePlan(name, { actions = 2, traits = [], area = null, target = null, range = null, save = null, attack = false, dc = null, damage = null, basic = true, extra = {}, effects = {} }) {
    const multipliers = attack ? ATTACK : basic ? BASIC : null;
    const outcomes = {};
    for (const degree of DEGREES) {
        const multiplier = damage && multipliers ? multipliers[degree] : 0;
        const formulas = (extra[degree] ?? []).map((formula) => ({ formula }));
        const shared = multiplier > 0 ? { multiplier, sourceComponentIds: ["0"] } : null;
        const damageRow = shared && formulas.length ? { mode: "mixed", shared, formulas, rollScope: "outcome" }
            : shared ? { mode: "shared", ...shared }
            : formulas.length ? { mode: "formulas", formulas, rollScope: "outcome" }
            : { mode: "none", multiplier: 0, sourceComponentIds: [] };
        outcomes[degree] = { damage: damageRow, effects: (effects[degree] ?? []).map(([slug, value, duration]) => ({ kind: "condition", slug, value: value ?? null, duration: duration ?? null })) };
    }
    const allTraits = [...new Set(["deviant", "magical", ...traits, ...(attack ? ["attack"] : [])])];
    return {
        modelVersion: 13,
        source: { name, slug: deviantSlug(name), uuid: null, type: "feat" },
        rank: 1,
        traits: allTraits,
        activation: { time: String(actions), traits: allTraits },
        automation: { level: "automatic" },
        targeting: { target: area ? null : target ?? "1 creature", range: area ? null : range, area },
        trigger: { event: "use" },
        resolution: {
            kind: "save",
            check: attack ? { statistic: "spell-attack", basic: false } : { roll: "save", statistic: save, basic: !!(basic && damage), against: { dc: "fixed", value: dc } },
            sharedDamage: damage ? { rollOnce: true, components: [{ id: "0", formula: damage, type: null, category: null }] } : null,
            outcomes
        }
    };
}

// (A check of its own modifier, Ghostly Grasp's "attack roll against the creature's Fortitude DC": a fixed modifier, the attack trait.)
function checkPlan(name, { actions = 1, range = null, modifier, against, effects = {} }) {
    const plan = savePlan(name, { actions, range, attack: false, dc: null, effects, basic: false });
    plan.traits = [...new Set([...plan.traits, "attack"])];
    plan.activation.traits = plan.traits;
    plan.resolution.check = { roll: "skill", statistic: "fixed-check", modifier, against: { dc: "target", statistic: against } };
    return plan;
}

const ability = (name, plan, { dc, attack = null, classification, actionType = "action", requires = null }) => ({
    name, plan, castRank: 1, dc, attack, pool: null, kind: "ability", actionType, rechargeGroup: name, feat: true, deviant: { classification }, ...(requires ? { deviantRequires: requires } : {})
});
const effectModel = (name, roundsOf, parts) => ({ name, rounds: roundsOf, modifiers: [], tempHp: 0, fastHealing: 0, resistances: [], weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...parts });

// Every deviant feat with its awakenings: build(L, dc, awakenings) → the entries it gives its user ({ spells, strikeActivities,
// selfEffects, concealReaction, acReaction, regeneration }), or null when it isn't played (with why).
const by = (L, at10, at18, base) => (L >= 18 ? at18 : L >= 10 ? at10 : base);
export const DEVIANT = Object.freeze({
    "blasting-beams": {
        awakenings: ["line", "agile"],
        build: (L, dc, a) => {
            const dice = Math.max(1, Math.floor(L / 2));
            const die = a.has("agile") ? 4 : 6;
            const beam = ability("Blasting Beams", savePlan("Blasting Beams", { actions: 1, traits: [DRAGON_ENERGY], attack: true, range: "30 feet", damage: `${dice}d${die}[${DRAGON_ENERGY}]` }), { dc, attack: dc - 10, classification: "dragon", requires: a.has("agile") ? null : "free hand" });
            const spells = [beam];
            if (a.has("line")) spells.push(ability("Blasting Beams (line)", savePlan("Blasting Beams (line)", { actions: 2, traits: [DRAGON_ENERGY], area: { type: "line", value: 60 }, save: "reflex", dc, damage: `${dice}d6[${DRAGON_ENERGY}]` }), { dc, classification: "dragon", requires: "free hand" }));
            return { spells };
        }
    },
    "consume-energy": { awakenings: ["range", "strikes"], build: () => null, why: "a reaction that counteracts a foe's energy ability" },
    "storming-breath": {
        awakenings: ["prone", "escape"],
        build: (L, dc, a) => ({ spells: [ability("Storming Breath", savePlan("Storming Breath", { actions: 2, traits: [DRAGON_ENERGY], area: { type: "cone", value: 30 }, save: "reflex", dc, damage: `${Math.max(4, L - 2)}d6[${DRAGON_ENERGY}]`, effects: a.has("prone") ? { criticalFailure: [["prone"]] } : {} }), { dc, classification: "dragon" })] })
    },
    "propulsive-leap": { awakenings: ["speed", "weapon"], build: () => null, why: "a fly Speed, which the fights here don't need" },
    "bone-spikes": { awakenings: ["reach", "poison"], build: () => null, why: "a 1d6 unarmed Strike, below the PCs' own weapons" },
    "titan-swing": {
        awakenings: ["prone", "bleed"],
        build: (L, dc, a) => {
            const dice = by(L, 2, 3, 1);
            const push = by(L, 10, 15, 5);
            return { strikeActivities: [{
                name: "Titan Swing", actions: 2, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["deviant", "magical"], extraWeaponDice: dice,
                onHit: { conditions: [], critical: a.has("prone") ? [{ slug: "prone" }] : null, push, ...(a.has("prone") ? { criticalPush: push * 2 } : {}), damage: a.has("bleed") ? [`${dice}d6[persistent,bleed]`] : [], save: null, size: null },
                riderSpell: null, deviant: { classification: "troll" }
            }] };
        }
    },
    "high-speed-regeneration": {
        awakenings: ["recovery", "speed"],
        // (At the start of its turn, when it's lost at least that much: Hit Points equal to double its level. The weakness the GM picks
        // isn't played.)
        build: (L) => ({ deviantRegeneration: { name: "High-Speed Regeneration", amount: 2 * L, deviant: { classification: "troll" } } })
    },
    "tectonic-stomp": {
        awakenings: ["stone", "stun"],
        build: (L, dc, a) => ({ spells: [ability("Tectonic Stomp", savePlan("Tectonic Stomp", { actions: 2, area: { type: "emanation", value: 30 }, save: "reflex", dc, damage: `${Math.max(1, Math.floor(L / 2))}d6[bludgeoning]`, effects: { failure: [["prone"]], criticalFailure: [["prone"], ...(a.has("stun") ? [["stunned", 1]] : [])] } }), { dc, classification: "troll" })] })
    },
    "eerie-flicker": {
        awakenings: ["terrify", "compress"],
        // (When a Strike would hit it: concealed — the attacker's flat check, DC 5, and a failure misses —, for a round after unless compressed,
        // which makes the check DC 9 for that Strike alone; terrify, the attacker who fails it frightened 1.)
        build: (L, dc, a) => ({ concealReaction: { name: "Eerie Flicker", dc: a.has("compress") ? 9 : 5, deviant: { classification: "wraith" }, ...(a.has("compress") ? {} : { concealAfter: 1 }), ...(a.has("terrify") ? { terrify: true } : {}) } })
    },
    "ghostly-grasp-deviant": {
        awakenings: ["grab", "push"],
        build: (L, dc, a) => (a.has("grab") ? { spells: [ability("Ghostly Grasp (grab)", checkPlan("Ghostly Grasp (grab)", { actions: 1, range: `${15 * (1 + Math.floor(L / 5))} feet`, modifier: dc - 10, against: "fortitude", effects: { success: [["grabbed", null, rounds(1)]], criticalSuccess: [["restrained", null, rounds(1)]] } }), { dc, classification: "wraith" })] } : null),
        why: "fetching an object (its grab awakening is played)"
    },
    "enervating-wail": {
        awakenings: ["silent", "enfeebling"],
        build: (L, dc, a) => {
            const enfeebling = a.has("enfeebling") ? { success: [["enfeebled", 1, rounds(1)]], failure: [["enfeebled", 1, minutes(1)]], criticalFailure: [["enfeebled", 2, minutes(1)]] } : {};
            const dice = Math.max(4, L - 2);
            const spells = [ability("Enervating Wail", savePlan("Enervating Wail", { actions: 2, traits: ["auditory", "void"], area: { type: "emanation", value: 20 }, save: "fortitude", dc, damage: `${dice}d6[void]`, effects: enfeebling }), { dc, classification: "wraith" })];
            if (a.has("silent")) spells.push(ability("Enervating Wail (silent)", savePlan("Enervating Wail (silent)", { actions: 2, traits: ["mental"], area: { type: "emanation", value: 20 }, save: "will", dc, damage: `${dice}d6[mental]`, effects: enfeebling }), { dc, classification: "wraith" }));
            return { spells };
        }
    },
    "distant-wandering": { awakenings: ["fly", "quick"], build: () => null, why: "scouting in spirit form" },
    "sprout-fruit": { awakenings: ["plentiful", "potent"], build: () => null, why: "a fruit an ally spends 3 actions to eat" },
    "vine-lash": {
        awakenings: ["cone", "constrict"],
        build: (L, dc, a) => {
            const dice = Math.max(1, Math.floor(L / 2));
            const spells = [ability("Vine Lash", savePlan("Vine Lash", { actions: 1, traits: ["plant"], attack: true, range: "30 feet", damage: `${dice}d6[slashing]`, effects: a.has("constrict") ? { success: [["grabbed", null, rounds(1)]], criticalSuccess: [["grabbed", null, rounds(1)]] } : {} }), { dc, attack: dc - 10, classification: "verdant", requires: "free hand" })];
            if (a.has("cone")) spells.push(ability("Vine Lash (cone)", savePlan("Vine Lash (cone)", { actions: 2, traits: ["plant"], area: { type: "cone", value: 30 }, save: "reflex", dc, damage: `${dice}d6[slashing]` }), { dc, classification: "verdant", requires: "free hand" }));
            return { spells };
        }
    },
    "defensive-growth": {
        awakenings: ["stronger-shield", "exploding-shield"],
        // (As it's targeted by a physical attack: a wooden shield raised, +2 AC against it. Its Shield Block's Hardness isn't played.)
        build: () => ({ acReaction: { value: 2, when: "targeted", name: "Defensive Growth", deviant: { classification: "verdant" } } })
    },
    "disperse-into-petals": { awakenings: ["extended-flight", "blossom-vortex"], build: () => null, why: "a form that can't attack" },
    "draining-touch": {
        awakenings: ["clumsy", "drain-spirit"],
        build: (L, dc, a) => {
            const dice = Math.max(1, Math.floor(L / 2));
            return { strikeActivities: [{
                name: "Draining Touch", actions: 1, strides: 0, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["attack", "cold", "deviant", "magical"], noDamage: true,
                onHit: { conditions: a.has("clumsy") ? [{ slug: "clumsy", value: 1, duration: rounds(1) }] : [], critical: a.has("clumsy") ? [{ slug: "clumsy", value: 2, duration: rounds(1) }] : null, push: null, damage: [`${dice}d8[cold]`], save: null, size: null },
                riderSpell: null, deviant: { classification: "leech" }
            }] };
        }
    },
    "borrowed-ability": { awakenings: ["borrow-defense", "lingering-link"], build: () => null, why: "borrowing a skill" },
    "kinetic-dampening": {
        awakenings: ["safe-haven", "wavelength-expansion"],
        build: (L, dc, a) => {
            const value = L >= 18 ? 20 : L >= 14 ? 15 : L >= 10 ? 10 : 5;
            const resistances = [{ type: "physical", value, exceptions: [] }, ...(a.has("wavelength-expansion") ? [{ type: "choice", choices: ["fire", "electricity", "sonic"], value, exceptions: [] }] : [])];
            return { selfEffects: [{ name: "Kinetic Dampening", actions: 1, model: effectModel("Kinetic Dampening", 1, { resistances }), deviant: { classification: "leech" } }] };
        }
    },
    "feed-the-void": {
        awakenings: ["feed-on-spirit", "feed-on-heat"],
        // (Pulled 10, 20 or 30 feet toward it: those that fail are pulled into its square and take the void's damage — no save.)
        build: (L, dc) => {
            const formula = `${5 + Math.floor((L - 10) / 2)}d6[spirit]`;
            return { spells: [ability("Feed the Void", savePlan("Feed the Void", { actions: 2, traits: ["mental", "spirit"], area: { type: "cone", value: 60 }, save: "fortitude", dc, basic: false, extra: { failure: [formula], criticalFailure: [formula] } }), { dc, classification: "leech" })] };
        }
    },
    "release-spores": { awakenings: ["sickening", "toxic"], build: () => null, why: "a lasting cloud of spores" },
    "rotten-slurry": {
        awakenings: ["splash", "persistent"],
        build: (L, dc, a) => {
            const dice = Math.max(1, Math.floor(L / 2));
            const extra = [...(a.has("splash") && L >= 4 ? [`${Math.floor(L / 4)}d4[poison]`] : []), ...(a.has("persistent") ? ["1d4[persistent,acid]"] : [])];
            return { spells: [ability("Rotten Slurry", savePlan("Rotten Slurry", { actions: 1, attack: true, range: "30 feet", damage: `${dice}d4[bludgeoning]`, extra: { criticalSuccess: extra, success: extra }, effects: { success: [["sickened", 1]], criticalSuccess: [["sickened", 2]] } }), { dc, attack: dc - 10, classification: "blight" })] };
        }
    },
    "irradiate": {
        awakenings: ["radius-increase", "poison"],
        build: (L, dc, a) => {
            const sickened = 1 + Math.floor(Math.max(0, L - 6) / 5);
            const area = { type: "emanation", value: a.has("radius-increase") ? 60 : 15 };
            const effects = { failure: [["sickened", sickened]], criticalFailure: [["sickened", sickened], ["fatigued", null, minutes(1)]] };
            return { spells: [ability("Irradiate", savePlan("Irradiate", { actions: 2, traits: ["poison"], area, save: "fortitude", dc, basic: !!a.has("poison"), damage: a.has("poison") ? `${Math.max(1, Math.floor(L / 2))}d4[poison]` : null, effects }), { dc, classification: "blight" })] };
        }
    },
    "unleash-the-blight": {
        awakenings: ["infectious", "debilitating"],
        build: (L, dc, a) => {
            const persistent = a.has("infectious") ? ["1d6[persistent,void]"] : [];
            const effects = a.has("debilitating") ? { success: [["drained", 1, rounds(1)]], failure: [["drained", 1, minutes(1)]], criticalFailure: [["drained", 2, minutes(1)]] } : {};
            return { spells: [ability("Unleash the Blight", savePlan("Unleash the Blight", { actions: 2, traits: ["void"], area: { type: "emanation", value: 60 }, save: "fortitude", dc, damage: `${Math.max(1, Math.floor(L / 2))}d6[void]`, extra: { success: persistent, failure: persistent, criticalFailure: persistent }, effects }), { dc, classification: "blight" })] };
        }
    },
    "sonic-dash": {
        awakenings: ["sonic-boom", "slipstream"],
        // (Two Strides for one action; with its sonic boom, the burst where it stops — played as at the foes beside it.)
        build: (L, dc, a) => (a.has("sonic-boom") ? { spells: [ability("Sonic Dash (sonic boom)", savePlan("Sonic Dash (sonic boom)", { actions: 1, traits: ["sonic"], area: { type: "emanation", value: 5 }, save: "fortitude", dc, damage: `${Math.max(1, Math.floor(L / 2))}d4[sonic]`, effects: { failure: [["deafened", null, rounds(1)]], criticalFailure: [["deafened", null, minutes(1)]] } }), { dc, classification: "flicker" })] } : null),
        why: "two Strides for one action (its sonic boom awakening is played)"
    },
    "overclock-senses": {
        awakenings: ["focus", "react"],
        // (Its Seek, then +2 to Reflex saves until its next turn; the +2 AC against ranged attacks isn't played — the engine has no AC by attack kind.)
        build: () => ({ selfEffects: [{ name: "Overclock Senses", actions: 0, model: effectModel("Overclock Senses", 1, { modifiers: [{ on: "reflex", type: "circumstance", value: 2 }] }), deviant: { classification: "flicker" } }] })
    },
    "unstable-gearshift": {
        awakenings: ["blur", "phase-out"],
        build: () => ({ selfEffects: [{ name: "Unstable Gearshift", actions: 0, model: effectModel("Unstable Gearshift", 2, { modifiers: [{ on: "speed", type: "status", value: 10 }] }), deviant: { classification: "flicker" } }] })
    },
    "lightspeed-assault": {
        awakenings: ["teleport", "flanking-assault"],
        // (Stride to an enemy and Strike, one action at a time — another while each Strike hits; one flat check a turn.)
        build: () => ({ strikeActivities: [{ name: "Lightspeed Assault", actions: 1, strides: 1, strike: null, attackBonus: 0, damageBonus: 0, damage: null, offGuard: false, requires: null, oncePerFight: false, traits: ["deviant", "magical"], onHit: { conditions: [], critical: null, push: null, damage: [], save: null, size: null }, riderSpell: null, deviant: { classification: "flicker", oncePerTurn: true } }] })
    }
});

// What a deviant feat gives a PC at a level with its deviation DC (the higher of its class and spell DCs) and the awakenings it has (a list
// of keys, "prone" for awakening:titan-swing:prone): { fields, played } — fields to join onto the combatant — or { gap }.
export function deviantFields(slug, level, dc, awakenings = []) {
    const entry = DEVIANT[slug];
    if (!entry) return { gap: "not a deviant ability the simulator knows" };
    const built = entry.build(level, dc, new Set(awakenings));
    if (!built) return { gap: entry.why ?? "nothing a fight uses" };
    const classification = CLASSIFICATIONS[slug];
    const fields = { deviantDC: dc, deviantClassification: classification };
    for (const [key, value] of Object.entries(built)) fields[key] = value;
    const played = built.spells ? "deviant ability" : built.strikeActivities ? "deviant Strike" : built.selfEffects ? "deviant effect" : built.deviantRegeneration ? "deviant regeneration" : "deviant reaction";
    return { fields, played };
}

// (Its turn starting: High-Speed Regeneration, a free action, once it's lost at least that many Hit Points.)
export function deviantTurnStart(state, c) {
    deviantFightStart(state, c);
    const regeneration = c.deviantRegeneration;
    if (!regeneration || !isActive(c) || !deviantUsable(c)) return;
    if (c.hp.max - c.hp.value < regeneration.amount) return;
    state.log?.push(`  ${c.name} uses ${regeneration.name}`);
    applyHeal(state, c, regeneration.amount);
    deviantUsed(state, c, regeneration);
}

// The deviant entry an action of the planner's or the fight's uses, or null.
export function deviantEntryOf(c, action) {
    if (!action) return null;
    const entry = action.type === "cast" ? c.spells?.[action.spellIndex] : action.type === "strikeActivity" ? c.strikeActivities?.[action.index] : action.type === "selfEffect" ? c.selfEffects?.[action.index] : null;
    return entry?.deviant ? entry : null;
}
