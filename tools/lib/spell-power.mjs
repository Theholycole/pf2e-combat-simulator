// A spell's power for its rank, offline (src/engine/spell-power.js has the method): the spells of every installed compendium — PF2e's and
// each module's Item compendiums, not Starfinder's; rituals left out — and one task for a worker (tools/spell-power.mjs).
import fs from "node:fs";
const { readDocuments, PACK_ROOT, basicActions, combatant, creatureFrom, summonCandidates } = await import("./pack-creatures.mjs");
const { maneuverWays } = await import("../../src/engine/readings.js");
const { compileSpell, effectModels } = await import("./pack-spells.mjs");
const { partyFor } = await import("./deadliness.mjs");
const { POWER_KINDS, POWER_ROUNDS, RATED_POOL, SUMMON_FOE_TRAITS, castPower, durationRounds, formShare, readingPower, textDamageShare, textHelpShare, partyLevelForRank, partyWithSpell, powerConditions, powerFoes, powerRanks, shieldShare, summonShare, wallKind, wallShare, wizardCasting } = await import("../../src/engine/spell-power.js");
const { moderateCreatureAt } = await import("../../src/engine/creature-tables.js");
const { RULE_CHOICES, castableReading, powerReading } = await import("../../src/engine/power-readings.js");
const { battleFormAt, effectModel } = await import("../../src/engine/effects.js");
const { SUMMON_LEVELS, spellSummonEntry } = await import("../../src/engine/summons.js");
const { canCast, describeSpell, isUtility, spellGaps } = await import("../../src/engine/spells.js");

const MODULES = `${process.env.HOME}/.local/share/FoundryVTT/Data/modules`;

const isRitual = (doc) => Boolean(doc.system?.ritual) || (doc.system?.traits?.value ?? []).includes("ritual");
const OWN_CREATURE = /\b(minion|companion|eidolon|familiar)\b|\byou summoned\b/i;

// Every spell: { ref, source, collection, path, id, name, rank, cantrip, focus }.
export function spellRefs() {
    const sources = [];
    const system = JSON.parse(fs.readFileSync(`${PACK_ROOT}/../system.json`, "utf8"));
    for (const pack of system.packs ?? []) if (pack.type === "Item") sources.push({ source: "pf2e", collection: `pf2e.${pack.name}`, path: `${PACK_ROOT}/${String(pack.path).replace(/\/$/, "").split("/").at(-1)}` });
    for (const mod of fs.readdirSync(MODULES)) {
        let manifest;
        try {
            manifest = JSON.parse(fs.readFileSync(`${MODULES}/${mod}/module.json`, "utf8"));
        } catch {
            continue;
        }
        for (const pack of manifest.packs ?? []) if (pack.type === "Item" && (!pack.system || pack.system === "pf2e")) sources.push({ source: mod, collection: `${manifest.id ?? mod}.${pack.name}`, path: `${MODULES}/${mod}/${pack.path}` });
    }
    const refs = [];
    for (const { source, collection, path } of sources) {
        let docs;
        try {
            docs = readDocuments(path);
        } catch {
            continue;
        }
        for (const doc of docs.filter((entry) => entry.collection === "items" && entry.type === "spell" && !isRitual(entry))) {
            const traits = doc.system?.traits?.value ?? [];
            refs.push({ ref: `${collection}:${doc._id}`, source, collection, path, id: doc._id, name: doc.name, rank: Math.max(1, Math.min(10, Number(doc.system?.level?.value) || 1)), cantrip: traits.includes("cantrip"), focus: traits.includes("focus") });
        }
    }
    return refs;
}

const packCache = new Map();
export function spellOf(ref) {
    if (!packCache.has(ref.path)) {
        if (packCache.size > 3) packCache.delete(packCache.keys().next().value);
        packCache.set(ref.path, new Map(readDocuments(ref.path).filter((doc) => doc.collection === "items").map((doc) => [doc._id, doc])));
    }
    return packCache.get(ref.path).get(ref.id) ?? null;
}

const plans = new Map();
function planOf(ref, doc) {
    if (!plans.has(ref.ref)) {
        let plan = null;
        try {
            plan = compileSpell(doc);
        } catch {
            plan = null;
        }
        if (plans.size > 200) plans.delete(plans.keys().next().value);
        plans.set(ref.ref, plan);
    }
    return plans.get(ref.ref);
}

// The ranks a spell is rated at (powerRanks), from its data.
export function ranksOf(ref) {
    const doc = spellOf(ref);
    return doc ? powerRanks(doc) : [];
}

// A summon spell's pick at a rank ({ rank, any }), or null: its plan's creature traits, or the trait its name gives ("Summon Fiend Aspect").
const CREATURE_TRAITS = new Set(["aberration", "animal", "astral", "beast", "celestial", "construct", "dragon", "elemental", "ethereal", "fey", "fiend", "fungus", "giant", "humanoid", "monitor", "ooze", "plant", "spirit", "undead"]);
const TRAIT_WORDS = { thurse: "giant" };
function summonPick(doc, plan, rank) {
    const entry = spellSummonEntry({ name: doc.name, plan, castRank: rank, pool: null }, 1);
    if (entry?.creature?.pick) return entry.creature.pick;
    const named = /^Summon (\w+) Aspect$/i.exec(doc.name);
    const trait = named ? TRAIT_WORDS[named[1].toLowerCase()] ?? named[1].toLowerCase() : null;
    return plan?.resolution?.kind === "summon" && CREATURE_TRAITS.has(trait) ? { rank: { base: rank, max: rank }, any: [trait] } : null;
}

// The creatures' danger numbers, for the best summon: the strongest for their level (level plus danger) are tried first.
let dangers = null;
const dangerOf = (pack, id) => {
    dangers ??= JSON.parse(fs.readFileSync(new URL("../../src/data/danger-ratings.json", import.meta.url), "utf8"));
    return Number(dangers.ratings?.[`pf2e.${pack}`]?.[id]) || 0;
};
const summonCache = new Map();
// The candidates tried: the strongest this many it allows. A trait's foes listed when its best creature does this much more against them
// (a tenth more).
const SUMMON_TRIED = 10;
const SUMMON_MORE = 0.1;

// A summon spell at a rank, against both encounters: { results, traits, creature, creatures } — its best creature (of the strongest it
// allows, the one worth most) and what it's worth, and against each trait's foes the one worth most there where that's especially useful
// (SUMMON_MORE more: a celestial's holy Strikes on fiends weak to them); null when nothing it allows comes.
function summonResults(doc, plan, rank, party, level) {
    const pick = summonPick(doc, plan, rank);
    if (!pick) return null;
    const key = `${JSON.stringify(pick)}|${level}`;
    if (!summonCache.has(key)) {
        const tried = summonCandidates(pick).map(({ pack, doc: actor }) => ({ actor, strength: Number(actor.system?.details?.level?.value) + dangerOf(pack, actor._id) })).sort((a, b) => b.strength - a.strength).slice(0, SUMMON_TRIED);
        const built = [];
        for (const { actor } of tried) {
            try {
                built.push({ name: actor.name, creature: combatant(actor) });
            } catch {
                continue;
            }
        }
        const results = {};
        const creatures = {};
        const mean = {};
        for (const trait of [null, ...SUMMON_FOE_TRAITS]) {
            let best = null;
            for (const { name, creature } of built) {
                const found = {};
                for (const encounter of POWER_KINDS) {
                    const share = summonShare(partyWithSpell(party), powerFoes(encounter, level, trait), creature, 1);
                    if (share) found[encounter] = share;
                }
                const value = POWER_KINDS.reduce((sum, encounter) => sum + (found[encounter]?.levels ?? 0), 0) / POWER_KINDS.length;
                if (value > 0 && (!best || value > best.value)) best = { name, found, value };
            }
            if (!best) continue;
            mean[trait ?? ""] = best.value;
            creatures[trait ?? ""] = best.name;
            for (const [encounter, found] of Object.entries(best.found)) results[`${encounter}|${trait ?? ""}`] = { share: Math.round(found.share * 1e4) / 1e4, levels: Math.round(found.levels * 1e4) / 1e4, ...(found.bound ? { bound: found.bound } : {}), targets: 1, creature: best.name };
        }
        const traits = SUMMON_FOE_TRAITS.filter((trait) => (mean[trait] ?? 0) > 0 && (mean[trait] ?? 0) >= (mean[""] ?? 0) * (1 + SUMMON_MORE));
        for (const trait of SUMMON_FOE_TRAITS) if (!traits.includes(trait)) for (const encounter of POWER_KINDS) delete results[`${encounter}|${trait}`];
        const found = Object.keys(results).length ? { results, traits, creature: creatures[""] ?? null, creatures: Object.fromEntries(traits.map((trait) => [trait, creatures[trait]])) } : null;
        if (summonCache.size > 200) summonCache.delete(summonCache.keys().next().value);
        summonCache.set(key, found);
    }
    return summonCache.get(key);
}

// An incarnate spell's own summons (2026-10-21, batch 11), at its best: Gray Shadow's Greater Shadow (a dying creature there to cast it
// on); Shambling Horror's skeleton or zombie, the one worth most of those a corpse of the level its target allows makes (such a corpse
// there); Reanimate Foe's fallen foe back for the party with the Hit Points it says (one of a group's, against the rest; none against a
// boss alone, whose fall ends the fight). { results, traits, creature? }, or null.
function incarnateSummonResults(doc, plan, party, level) {
    const phases = plan?.resolution?.incarnate?.phases ?? [];
    const summon = phases.find((phase) => phase.kind === "summon");
    if (summon) {
        const cap = /level no greater than your level\s*[-–−]\s*(\d+)/i.exec(String(doc.system?.target?.value ?? ""));
        const from = summon.actorUuid || summon.actorName
            ? [{ uuid: summon.actorUuid, name: summon.actorName }]
            : (summon.candidates ?? []).filter((each) => !cap || Number(each.level) <= level - Number(cap[1])).sort((a, b) => b.level - a.level).map((each) => ({ uuid: each.uuid, name: each.name }));
        const built = from.map((each) => creatureFrom(each)).filter(Boolean).slice(0, SUMMON_TRIED);
        const count = Math.max(1, Number(summon.count) || 1);
        const worth = (creature) => POWER_KINDS.reduce((sum, encounter) => sum + (summonShare(partyWithSpell(party), powerFoes(encounter, level, null), creature, count)?.levels ?? 0), 0);
        const best = built.map((creature) => ({ creature, value: worth(creature) })).filter((each) => each.value > 0).sort((a, b) => b.value - a.value)[0];
        if (!best) return null;
        const results = resultsOf([], (foes) => summonShare(partyWithSpell(party), foes, best.creature, count), level);
        return Object.keys(results).length ? { results, traits: [], creature: best.creature.name } : null;
    }
    const copy = phases.find((phase) => phase.kind === "check-copy");
    const hp = Number(copy?.results?.success?.hp) || 0;
    if (!hp) return null;
    const results = resultsOf([], (foes) => (foes.length > 1 ? summonShare(partyWithSpell(party), foes.slice(1), { ...foes[0], hp: { value: hp, max: hp } }, 1) : null), level);
    return Object.keys(results).length ? { results, traits: [] } : null;
}

// Words of a fight effect in a utility spell's text (damage, conditions, bonuses and penalties, concealment, terrain): one cast in actions
// with them may matter in a fight; the rest don't (no rank).
const FIGHT_WORDS = /\b(\d+d\d+|damage|frightened|stunned|slowed|paralyzed|blinded|dazzled|clumsy|enfeebled|sickened|off-guard|prone|immobilized|restrained|grabbed|confused|fleeing|status bonus|circumstance bonus|status penalty|temporary Hit Points|concealed|hidden|invisible|difficult terrain|resistance|weakness|Strike|attack roll|AC|saving throw)\b/i;

// A spell's text, plain.
const textOf = (doc) => String(doc?.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// The creature a spell on one's own minion, companion or eidolon goes to, already out (the user: "minion spells assuming you already have
// a minion out"): a summoned minion is a moderate creature of the level the rank summons; a companion or eidolon, of the party's level less
// two; undead when the spell asks for an undead one. Familiars aren't in the fight: none.
function minionFor(doc, rank, level) {
    const target = String(doc.system?.target?.value ?? "");
    if (!/\b(minion|companion|eidolon)\b|\byou summoned\b|\bsummoned by you\b/i.test(target)) return null;
    const summoned = /\bminion\b|\bsummoned\b/i.test(target) && !/\b(companion|eidolon)\b/i.test(target);
    const creature = moderateCreatureAt(summoned ? SUMMON_LEVELS[rank] ?? -1 : Math.max(-1, level - 2), "minion", "Minion");
    return { ...creature, traits: [...(/\bundead\b/i.test(target) ? ["undead"] : /\bcompanion\b/i.test(target) ? ["animal"] : creature.traits), "minion"] };
}

// A spell shield it raises: Shield's ({ ac, hardness } for the round), or a spell shield or temporary shield held for its duration
// (Bone Shield's made again each Sustain; Shielded Arm's while its Hit Points last), at the rank: { shield, rounds } or null.
function shieldOf(plan, entry, doc, rank) {
    const model = Object.values(entry.effects ?? {}).find((each) => each?.spellShield)?.spellShield;
    if (model) {
        // (Its Hardness as its effect gives it, or else as its text does — Fire Shield's effect reads only a halving; its Hit Points from
        // the text, none for one that ends with its Shield Block; held for its duration.)
        const text = textOf(doc);
        const hardness = Number(model.hardness) >= 1 ? Number(model.hardness) : Number(/\bHardness (\d+)/i.exec(text)?.[1]) || 0;
        const hp = Number(/\bHardness \d+[^.]*?\b(\d+) (?:HP|Hit Points)\b/i.exec(text)?.[1]) || 0;
        return { shield: { ac: model.ac ?? 1, hardness, hp }, rounds: durationRounds(plan) };
    }
    const base = Math.max(1, Number(doc.system?.level?.value) || 1);
    const steps = (step) => (step?.interval ? Math.floor((rank - base) / Number(step.interval)) : 0);
    const spellShield = plan?.resolution?.spellShield;
    if (spellShield) return { shield: { ac: spellShield.acBonus ?? 1, hardness: (Number(spellShield.hardness) || 0) + steps(spellShield.step) * (Number(spellShield.step?.hardness) || 0), hp: spellShield.recreateOnSustain ? Infinity : spellShield.hp }, rounds: Math.min(POWER_ROUNDS, Math.floor((Number(spellShield.durationSeconds) || 6) / 6)) };
    const temporary = plan?.resolution?.temporaryShield;
    if (temporary) return { shield: { ac: temporary.acBonus ?? 1, hardness: (Number(temporary.hardness) || 0) + steps(temporary.heightening) * (Number(temporary.heightening?.hardness) || 0), hp: (Number(temporary.hp) || 0) + steps(temporary.heightening) * (Number(temporary.heightening?.hp) || 0) }, rounds: Math.min(POWER_ROUNDS, Math.floor((Number(temporary.durationSeconds) || 6) / 6)) };
    return null;
}

// A wall the simulator doesn't play: its kind (wallKind), or null for a spell that isn't one.
const WALL_KINDS = new Set(["damaging-wall", "scene-walls", "flesh-wall", "shrub-wall"]);
function wallOf(plan, doc) {
    const text = textOf(doc);
    const wall = WALL_KINDS.has(plan?.resolution?.kind) || /^Wall of /i.test(doc.name) || /\bYou (?:create|raise|conjure|form|call forth) an? (?:(?!(?:through|in|into|on|across|around|behind)\b)[\w-]+ ){0,3}wall\b/i.test(text.slice(0, 400));
    return wall ? wallKind(plan, text) : null;
}

// A spell the simulator reads only as text (a utility spell, as its compiler leaves it; one it can't cast): the damage its text deals — the
// first "XdY type damage" dealt to someone else (inline rolls read as such), heightened as its text says ("Heightened (+N) … increases by XdY", each N ranks), against the save
// it names or its spell attack — and where it goes (an area: every foe; else the number of creatures its target names). Null without one.
export function textDamageOf(doc, rank) {
    const text = String(doc?.system?.description?.value ?? "").replace(/@Damage\[\(?([^\[\]]*?)\)?(?:\[([a-z,]+)\])?\]/gi, (all, formula, kinds) => `${formula} ${String(kinds ?? "").split(",").find((kind) => !["persistent", "splash", "precision"].includes(kind)) ?? ""} damage`).replace(/<[^>]+>/g, " ").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/\s+/g, " ");
    const at = text.search(/\bHeightened\b/i);
    const head = at >= 0 ? text.slice(0, at) : text;
    const heightened = at >= 0 ? text.slice(at) : "";
    // (The first sentence that deals it to someone else: not the caster's own ("you're expelled … and take 10d6"), not one that hangs on
    // an if ("If you cast the spell on an object…").)
    const sentence = head.split(/(?<=[.!?])\s+/).find((each) => /\d+d\d+(?:\s*\+\s*\d+)?\s+(?:[a-z]+\s+)?damage/i.test(each) && !/\byou(?:'re| are)?\b[^.]{0,60}\btakes?\b/i.test(each) && !/^\s*If\b/i.test(each));
    const found = sentence ? /(\d+)d(\d+)(?:\s*\+\s*(\d+))?\s+(?:([a-z]+)\s+)?damage/i.exec(sentence) : null;
    if (!found) return null;
    const save = /\b(Reflex|Fortitude|Will) save/i.exec(head)?.[1]?.toLowerCase() ?? null;
    const attack = !save && /\bspell attack\b/i.test(head);
    if (!save && !attack) return null;
    const base = Math.max(1, Number(doc.system?.level?.value) || 1);
    const step = /Heightened \(\+(\d+)\)[^.]*?(\d+)d(\d+)/i.exec(heightened);
    const extra = step && Number(step[3]) === Number(found[2]) ? Math.floor((rank - base) / Number(step[1])) * Number(step[2]) : 0;
    const area = Boolean(doc.system?.area?.type);
    const named = /\bup to (\d+)|^(\d+) (?:creature|target|enem)/i.exec(String(doc.system?.target?.value ?? "").trim());
    return { dice: Number(found[1]) + extra, faces: Number(found[2]), bonus: Number(found[3]) || 0, type: found[4]?.toLowerCase() ?? "untyped", save, attack, targets: area ? Infinity : Number(named?.[1] ?? named?.[2]) || 1 };
}

// Healing, temporary Hit Points or an AC bonus its text gives (the last resort for a spell nothing else reads): { heal, tempHp, ac,
// rounds, targets } — the first sentence that says "regains XdY Hit Points" (heightened as its text says), "gains N temporary Hit Points",
// or "a +N status (circumstance) bonus to AC" with no "against" (a bonus only against some attacks isn't counted); its duration's rounds;
// every ally in an area, else as many as its target names. Null without one.
export function textHelpOf(doc, rank) {
    // (Not one aimed at foes as well — Fated Healing's "2 creatures who are hostile toward each other".)
    if (/\bhostile\b|\benem(?:y|ies)\b|\bfoes?\b/i.test(String(doc?.system?.target?.value ?? ""))) return null;
    const text = String(doc?.system?.description?.value ?? "").replace(/@Damage\[\(?([^\[\]]*?)\)?(?:\[[a-z,]+\])?\]/gi, "$1").replace(/<[^>]+>/g, " ").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/\s+/g, " ");
    const at = text.search(/\bHeightened\b/i);
    const head = at >= 0 ? text.slice(0, at) : text;
    const heightened = at >= 0 ? text.slice(at) : "";
    const sentences = head.split(/(?<=[.!?])\s+/).filter((each) => !/^\s*If\b/i.test(each));
    const average = (dice, faces, bonus) => Number(dice) * (Number(faces) + 1) / 2 + (Number(bonus) || 0);
    const base = Math.max(1, Number(doc.system?.level?.value) || 1);
    let heal = 0;
    let perTurn = false;
    let tempHp = 0;
    let ac = 0;
    for (const sentence of sentences) {
        const healed = /\bregains? (\d+)d(\d+)(?:\s*\+\s*(\d+))?[^.]{0,20}Hit Points/i.exec(sentence) ?? /\bregains? (\d+)[^.\d]{0,20}Hit Points/i.exec(sentence);
        // (Not healing that waits on something — "if it remains … for the full duration" —; healing each turn, for each of the rounds.)
        // (Nor healing that takes a while out of the fight — "spends the full hour soaking".)
        if (!heal && healed && !/\bif\b|full duration|after \d+ (?:minutes|hours)|\bspends? (?:the full |an? |\d+ )?(?:hours?|minutes?)\b/i.test(sentence)) {
            const step = /Heightened \(\+(\d+)\)[^.]*?(\d+)d(\d+)/i.exec(heightened);
            const extra = healed[2] && step && Number(step[3]) === Number(healed[2]) ? Math.floor((rank - base) / Number(step[1])) * Number(step[2]) * (Number(step[3]) + 1) / 2 : 0;
            heal = (healed[2] ? average(healed[1], healed[2], healed[3]) : Number(healed[1])) + extra;
            perTurn = /\beach of (?:its|their|your) (?:own )?turns|\beach round|\bstart of each\b|\bend of each\b/i.test(sentence);
        }
        const temporary = /\b(?:gains?|grants?)[^.]{0,30}?\b(\d+)(?:d(\d+))? temporary Hit Points/i.exec(sentence);
        if (!tempHp && temporary) tempHp = temporary[2] ? average(temporary[1], temporary[2], 0) : Number(temporary[1]);
        const armour = /\+(\d) (?:status|circumstance) bonus to (?:its |your |their )?AC\b([^.]*)/i.exec(sentence);
        if (!ac && armour && !/\bagainst\b/i.test(armour[2])) ac = Number(armour[1]);
    }
    if (!heal && !tempHp && !ac) return null;
    const area = Boolean(doc.system?.area?.type);
    // (Its targets: as many as it names — or, a meal or a drink, those its text lets partake.)
    const partake = /\bUp to (\d+) creatures can partake\b/i.exec(text);
    const named = partake ? [null, partake[1]] : /\bup to (\d+)|^(\d+) (?:creature|target|all(?:y|ies)|willing)/i.exec(String(doc.system?.target?.value ?? "").trim());
    const duration = String(doc.system?.duration?.value ?? "");
    const rounds = /minute|hour|day|sustained/i.test(duration) ? POWER_ROUNDS : Number(/(\d+) rounds?/.exec(duration)?.[1]) || 1;
    // (A heal each turn: once for each round it lasts in the fight.)
    if (perTurn) heal *= Math.min(POWER_ROUNDS, rounds);
    return { heal, tempHp, ac, rounds, targets: area ? Infinity : Number(named?.[1] ?? named?.[2]) || 1 };
}

// A utility spell's terrain: an area its text makes difficult terrain (hindering foes as a wall that slows them does) — not one that takes
// difficult terrain away, or lets creatures ignore it.
const terrainOf = (plan, doc) => {
    const text = textOf(doc);
    return isUtility(plan) && doc.system?.area?.type && /\b(?:is|are|becomes?|counts? as|turns? into|into) (?:greater )?difficult terrain\b/i.test(text) && !/\bno longer (?:greater )?difficult terrain|\bignore\w* (?:greater )?difficult terrain|\bisn't difficult terrain|\bremov\w*[^.]*difficult terrain/i.test(text) ? "hinder" : null;
};

// The estimates for what the simulator doesn't play — a wall's, a shield's, a utility spell's damage or terrain — against both encounters,
// or null.
function estimateResults(plan, entry, doc, rank, party, level) {
    const shield = shieldOf(plan, entry, doc, rank);
    const wall = shield ? null : wallOf(plan, doc);
    const text = shield || wall || !isUtility(plan) ? null : textDamageOf(doc, rank);
    const terrain = shield || wall || text ? null : terrainOf(plan, doc);
    if (!shield && !wall && !text && !terrain) return null;
    const rate = (foes, choke = false) => (shield ? shieldShare(party, foes, shield.shield, shield.rounds) : wall || terrain ? wallShare(party, foes, entry, wall ?? terrain, { choke }) : textDamageShare(party, foes, entry, text));
    const row = { results: resultsOf([], (foes) => rate(foes), level), traits: [], estimate: shield ? "shield" : wall ? `wall (${wall})` : text ? "text damage" : "terrain" };
    return wall || terrain ? withChoke(row, rate, level) : row;
}

// A choke point's results (2026-10-21, the user: "add choke points to simulate situations where area spells are forced to be interacted
// with vs being able to stride around"): for a spell with an area, the same fights with the foes coming down a corridor (rate(foes,
// true)); kept, as the condition "choke", where it does a tenth more than in the open, and a tenth of a level at least.
const CHOKE_MORE = 0.1;
function withChoke(row, rate, level) {
    const mean = (results, key) => POWER_KINDS.reduce((sum, encounter) => sum + (results[`${encounter}|${key}`]?.levels ?? 0), 0) / POWER_KINDS.length;
    const choke = resultsOf([], (foes) => rate(foes, true), level);
    const open = mean(row.results ?? {}, "");
    const there = mean(choke, "");
    if (!(there >= open + CHOKE_MORE && there >= open * (1 + CHOKE_MORE))) return row;
    const results = { ...row.results };
    for (const encounter of POWER_KINDS) if (choke[`${encounter}|`]) results[`${encounter}|choke`] = choke[`${encounter}|`];
    return { ...row, results, traits: [...(row.traits ?? []), "choke"] };
}
// Healing over a long time: a spell that heals far more out of a fight than its one fight shows (the user, 2026-10-21: "some healing
// spells are very powerful out of combat since they heal over a long time"; "Garden of healing is a spell known for being good out of
// combat too") — healing that lasts ten minutes or more (until its daily preparations), or that comes again and again (each round, each
// Sustain, fast healing, regeneration) for a minute or more. Its rating's words say so.
const LONG_DURATION = /\b(?:hours?|days?|daily preparations|unlimited|until (?:the next time|your next)|[1-9]\d+ minutes)\b/i;
const MINUTE_OR_MORE = /\b(?:minutes?|hours?|days?|daily preparations|unlimited|until (?:the next time|your next))\b/i;
// (Its own healing: a creature regaining, recovering or restored Hit Points, or gaining fast healing or regeneration — not one that stops
// or weighs healing ("would regain", "can't", "your healing spells"). Again and again: on a repeat — each round or turn, starting or ending
// its turns there, each Sustain, any time during the duration — or fast healing and regeneration themselves.)
const HEALING = /\b(?:regains?|recovers?|recovering|restores?|heals?)\b[^.]*?(?:\b\d+(?:d\d+)?\b|@Damage\[)[^.]*?\bHit Points\b|\b(?:gains?|have|has) (?:fast healing|regeneration) (?:\d+|@|equal)|\bheals? (?:\d+(?:d\d+)?\b|@Damage\[)/i;
const NOT_OWN = /\bwould regain\b|\bcan(?:no|')t (?:regain|heal|be healed)\b|\bdoes(?:n't| not)\b[^.]*\b(?:regeneration|heal)|\byour healing spells?\b|\bprevents?\b[^.]*\bheal/i;
const AGAIN = /\b(?:each|every) (?:round|turn)\b|\beach of (?:your|its|their) turns\b|\bstarts? (?:its|their|your) turns?\b|\b(?:start|end) of each\b|\bSustain\b|\bany time during the duration\b|\b(?:fast healing|regeneration) (?:\d+|@|equal)/i;
function healsOutOfCombat(doc) {
    const duration = String(doc?.system?.duration?.value ?? "");
    // (Inline rolls' "@item.rank" read as a word, so a sentence isn't cut at its dot.)
    const own = textOf(doc).replace(/@(?:item|actor)\.[\w.]+/g, "R").split(/(?<=[.!?])\s+/).filter((sentence) => HEALING.test(sentence) && !NOT_OWN.test(sentence));
    if (!own.length) return false;
    if (LONG_DURATION.test(duration)) return true;
    // (A minute or more; Sustained with no time of its own as well — not a few rounds, about a fight's.)
    if (!MINUTE_OR_MORE.test(duration) && !(doc?.system?.duration?.sustained && !/\brounds?\b/i.test(duration))) return false;
    return own.some((sentence) => AGAIN.test(sentence));
}

// Cast in minutes or longer: before the fight (the user, 2026-10-21: "count spells you can cast a minute or more before a fight").
const preCastOf = (doc) => /minute|hour|day/i.test(String(doc?.system?.time?.value ?? ""));
const hasArea = (plan, doc) => Boolean(describeSpell(plan).area || plan?.targeting?.area?.type || doc?.system?.area?.type);

// A spell whose damage type is the caster's (Spiritual Torrent: vitality from a living caster, void from an undead one): cast as each,
// the better kept — at its best (the user: "Dont lower the ranking of spells based on how hard they are to use practically").
function casterSwaps(entry) {
    const swap = entry.plan?.resolution?.damageSwap;
    if (swap?.when !== "caster-undead" || !entry.plan.resolution.sharedDamage?.components?.length) return [entry];
    const components = entry.plan.resolution.sharedDamage.components.map((component) => (component.type === swap.from ? { ...component, type: swap.to } : component));
    return [entry, { ...entry, plan: { ...entry.plan, resolution: { ...entry.plan.resolution, sharedDamage: { ...entry.plan.resolution.sharedDamage, components } } } }];
}
const bestCast = (entries, cast) => entries.map(cast).filter(Boolean).sort((a, b) => b.share - a.share)[0] ?? null;

// Both encounters' results, and those against each trait's foes: rate(foes) → { share, levels, bound, actions, targets, alliesHit } or null.
function resultsOf(traits, rate, level) {
    const results = {};
    for (const encounter of POWER_KINDS) {
        for (const trait of [null, ...traits]) {
            const found = rate(powerFoes(encounter, level, trait));
            if (found) results[`${encounter}|${trait ?? ""}`] = { share: Math.round(found.share * 1e4) / 1e4, levels: Math.round(found.levels * 1e4) / 1e4, ...(found.bound ? { bound: found.bound } : {}), actions: found.actions, targets: found.targets, ...(found.alliesHit ? { alliesHit: found.alliesHit } : {}) };
        }
    }
    return results;
}

// A row from the healing, temporary Hit Points or AC a spell's text gives (estimated), or null; a spell cast in minutes or longer, cast before
// the fight ("pre-cast").
function textHelpRow(head, doc, rank, party, level) {
    const help = textHelpOf(doc, rank);
    if (!help) return null;
    const results = resultsOf([], (foes) => textHelpShare(party, foes, help), level);
    return Object.keys(results).length ? { ...head, traits: [], results, estimate: preCastOf(doc) ? "pre-cast" : "text help" } : null;
}

// One task: { ref, rank } — the spell at that rank, cast once into both encounters (and those of each trait it does more against).
export function runPowerTask(task) {
    const { ref, rank } = task;
    const doc = spellOf(ref);
    if (!doc) return { ...task, error: "not found" };
    const plan = planOf(ref, doc);
    if (!plan) return { ...task, error: "doesn't compile" };
    const level = partyLevelForRank(rank);
    const party = partyFor(level);
    const casting = wizardCasting(party);
    const entry = { name: doc.name, plan, castRank: rank, dc: casting?.dc ?? 10 + level, attack: casting?.attack ?? level, pool: ref.cantrip ? null : RATED_POOL, tradition: "arcane", effects: effectModels(plan, rank) };
    const head = { kind: "screen", ref: { ref: ref.ref, collection: ref.collection, path: ref.path, id: ref.id, name: ref.name, cantrip: ref.cantrip, focus: ref.focus }, collection: ref.collection, id: ref.id, name: ref.name, rank, cantrip: ref.cantrip, level, ...(healsOutOfCombat(doc) ? { outOfCombat: true } : {}) };
    // (A summon: its best creature's worth.)
    const summoned = summonResults(doc, plan, rank, party, level) ?? incarnateSummonResults(doc, plan, party, level);
    if (summoned) return { ...head, ...summoned, summon: true };
    // (A battle form: the wizard in the best form it offers.)
    // (Its effects' BattleForm rules, or those a generated form carries itself — Avatar's.)
    const generated = (plan.resolution?.generatedForm?.rules ?? []).filter((rule) => rule?.key === "BattleForm").map((rule) => battleFormAt(rule, rank));
    const forms = [...Object.values(entry.effects ?? {}).flatMap((model) => model?.battleForms ?? []), ...generated].filter((form) => form?.strikes?.length);
    if (forms.length) {
        const best = (foes) => forms.map((form) => formShare(party, foes, form)).filter(Boolean).sort((a, b) => b.share - a.share)[0] ?? null;
        return { ...head, traits: [], results: resultsOf([], best, level), estimate: "battle form" };
    }
    // (A wall, a shield: estimated.)
    const estimated = estimateResults(plan, entry, doc, rank, party, level);
    if (estimated && Object.keys(estimated.results).length) return { ...head, ...estimated };
    // (A spell on one's own minion, companion or eidolon: one already out. On a familiar, or one the simulator can't play: none.)
    const own = OWN_CREATURE.test(String(doc.system?.target?.value ?? ""));
    const minion = own ? minionFor(doc, rank, level) : null;
    if (own && !minion) return { ...head, skipped: true, reason: "a familiar's" };
    // (Telekinetic Maneuver and kin: a way per basic action it names, with the spell attack — as fights cast it; a reaction's way as an
    // action (castableReading) — the best of them.)
    const ways = maneuverWays(plan, basicActions).map((way) => {
        const read = { ...entry, plan: way.plan };
        if (canCast({ spellPools: { [RATED_POOL]: 1 } }, read)) return read;
        const rewritten = castableReading(way.plan, doc, rank);
        return rewritten ? { ...entry, plan: rewritten } : null;
    }).filter((read) => read && canCast({ spellPools: { [RATED_POOL]: 1 } }, read));
    if (ways.length) {
        const results = resultsOf([], (foes) => bestCast(ways, (each) => castPower(party, foes, each)), level);
        if (Object.keys(results).length) return { ...head, traits: [], results, estimate: "reading (targets)" };
    }
    // (A stated effect — its own PF2e rules, or a choice of them: an effect model of each, applied to its recipient as an effect's; the
    // best of its choices.)
    const stated = plan.resolution?.kind === "stated-effect" ? plan.resolution.statedEffect : null;
    if (stated) {
        const ways = (stated.choice?.options?.length ? stated.choice.options.map((option) => [...(stated.rules ?? []), ...(option.rules ?? [])]) : [stated.rules ?? []]).filter((rules) => rules.length);
        const uuid = `stated:${ref.ref}`;
        const self = stated.recipient === "self";
        const casts = ways.map((rules) => {
            const model = effectModel({ name: doc.name, system: { rules: rules.map((rule) => ({ ...rule, predicate: (rule.predicate ?? []).filter((term) => !/^(chorus-form|plant|[a-z-]+-form)$/.test(term)) })), duration: { value: Math.max(1, Math.round((Number(stated.seconds) || 60) / 6)), unit: "rounds" } } }, { rank });
            const read = { ...entry, effects: { ...entry.effects, [uuid]: model }, plan: { ...plan, targeting: { ...(plan.targeting ?? {}), target: self ? "self" : plan.targeting?.target || "1 willing creature" }, resolution: { kind: "effect", applications: [{ kind: "native-spell-effect", uuid, label: doc.name, recipients: self ? "self" : "target" }] } } };
            return canCast({ spellPools: { [RATED_POOL]: 1 } }, read) ? read : null;
        }).filter(Boolean);
        if (casts.length) {
            const best = (foes) => casts.map((read) => castPower(party, foes, read)).filter(Boolean).sort((a, b) => b.share - a.share)[0] ?? null;
            return { ...head, traits: [], results: resultsOf([], best, level), estimate: "reading (stated-effect)" };
        }
    }
    // (One the engine can't cast in a fight only for how its time or targets are written: cast as the rating reads it.)
    const castable = canCast({ spellPools: { [RATED_POOL]: 1 } }, entry);
    const rewritten = !castable && !isUtility(plan) ? castableReading(plan, doc, rank) : null;
    // (Cast before the fight, healing done then — Soothing Spring's soak for an hour —: nothing in the fight; the party comes to it as hurt
    // as ever. Its lasting effects and temporary Hit Points do count.)
    const healedBefore = rewritten?.preCast && plan.resolution?.kind === "healing" && /\bspends? (?:the full |an? |\d+ )?(?:hours?|minutes?)\b[^.]*\bregains?\b|\bregains?\b[^.]*\bafter \d+ (?:minutes|hours)\b/i.test(textOf(doc));
    if (rewritten && !healedBefore && canCast({ spellPools: { [RATED_POOL]: 1 } }, { ...entry, plan: rewritten })) {
        const read = { ...entry, plan: rewritten };
        const traits = powerConditions(rewritten, entry.effects, textOf(doc));
        const gaps = spellGaps(read);
        const reads = casterSwaps(read);
        const results = resultsOf(traits, (foes) => bestCast(reads, (each) => castPower(party, foes, each, { minion })), level);
        const row = { ...head, traits, results, estimate: rewritten.preCast ? "pre-cast" : `reading (${plan.resolution.kind === "effect-note" ? "effect-note" : "targets"})`, ...(gaps.length ? { partial: gaps } : {}) };
        return hasArea(rewritten, doc) ? withChoke(row, (foes, choke) => bestCast(reads, (each) => castPower(party, foes, each, { minion, choke })), level) : row;
    }
    // (One the engine can't cast in a fight, that the rating reads itself: power-readings.js.)
    if (!castable && powerReading(plan)) {
        const traits = powerConditions(plan, entry.effects, textOf(doc));
        const read = { ...entry, doc };
        const row = { ...head, traits, results: resultsOf(traits, (foes) => readingPower(party, foes, read), level), estimate: preCastOf(doc) ? "pre-cast" : `reading (${plan.resolution.kind})` };
        // (Under the GM's other choices of a rule its reading depends on — Moment of Renewal's rest —: those results too.)
        const alternatives = {};
        for (const [rule, choice] of Object.entries(RULE_CHOICES)) {
            if (!choice.uses(plan)) continue;
            for (const value of choice.values.slice(1)) alternatives[`${rule}:${value}`] = resultsOf([], (foes) => readingPower(party, foes, read, { rules: { [rule]: value } }), level);
        }
        if (Object.keys(alternatives).length) row.alternatives = alternatives;
        // (Nothing read: on to the text's estimates below.)
        if (Object.keys(row.results).length) return withChoke(row, (foes, choke) => readingPower(party, foes, read, { choke }), level);
    }
    // (Nothing else: the damage its text deals, against a save or a spell attack — estimated.)
    const textDamage = !castable && !isUtility(plan) && !/minute|hour|day/i.test(String(doc.system?.time?.value ?? "")) ? textDamageOf(doc, rank) : null;
    if (textDamage) {
        const results = resultsOf([], (foes) => textDamageShare(party, foes, entry, textDamage), level);
        if (Object.keys(results).length) return { ...head, traits: [], results, estimate: "text damage" };
    }
    // (Or the healing, temporary Hit Points or AC its text gives.)
    const helped = textHelpRow(head, doc, rank, party, level);
    if (helped && (isUtility(plan) || !castable)) return helped;
    if (healedBefore) return { ...head, skipped: true, reason: "utility" };
    if (isUtility(plan) || !castable) return { ...head, skipped: true, reason: isUtility(plan) ? (FIGHT_WORDS.test(textOf(doc)) && !/minute|hour|day/i.test(String(doc.system?.time?.value ?? "")) ? "utility, with fight effects the simulator doesn't play" : "utility") : own ? "needs a minion, companion or eidolon the simulator can't play it on" : "the simulator can't cast it" };
    const traits = powerConditions(plan, entry.effects, textOf(doc));
    const lost = Boolean(minion) && /\bminion\b[^.]*\bexplode/i.test(textOf(doc));
    const entries = casterSwaps(entry);
    const results = resultsOf(traits, (foes) => bestCast(entries, (each) => castPower(party, foes, each, { minion, lost })), level);
    // (Cast, but with no effect the engine counts: the healing, temporary Hit Points or AC its text gives, if it says.)
    if (!Object.keys(results).length) {
        const helped = textHelpRow(head, doc, rank, party, level);
        if (helped) return helped;
    }
    const gaps = spellGaps(entry);
    const row = { ...head, traits, results, ...(minion ? { minion: true } : {}), ...(gaps.length ? { partial: gaps } : {}) };
    return hasArea(plan, doc) ? withChoke(row, (foes, choke) => bestCast(entries, (each) => castPower(party, foes, each, { minion, lost, choke })), level) : row;
}
