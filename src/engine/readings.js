// The simulator's own readings of spells the spell module's compiler leaves without a plan (2026-10-14; the user chose: "Simulator
// reads them", for Evil Eye and the like). A reading is the resolution the compiler would write, keyed by the spell's slug; it's used
// only when the compiled plan resolves nothing ("unsupported" with no native numbers to roll). Live play still leaves these spells
// to PF2e's own card.

const row = (extra = {}) => ({ damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [], ...extra });
const condition = (slug, value) => ({ kind: "condition", slug, value, duration: null });

const READINGS = {
    // Evil Eye: sickened 1 on a failed Will save (2 on a critical failure); it can't go below 1 while the spell lasts (sustained).
    "evil-eye": () => {
        const floor = { slug: "sickened", value: 1, lifetime: "spell", liftedBy: null, situational: null };
        return {
            kind: "save",
            check: { statistic: "will", basic: false, dcSource: "source-actor" },
            outcomes: { criticalSuccess: row(), success: row(), failure: row({ effects: [condition("sickened", 1)], conditionFloor: floor }), criticalFailure: row({ effects: [condition("sickened", 2)], conditionFloor: floor }) }
        };
    }
};

// The core's "nothing native": no rows to roll, no missiles, no healing, no PF2e effects to apply.
function resolvesNothing(plan) {
    const native = plan?.resolution?.native ?? {};
    return plan?.resolution?.kind === "unsupported" && !(native.check && native.outcomes) && !native.missiles && !native.healing?.components?.length && !(native.applications ?? []).length;
}

// Targeting the compiler leaves without an area: "N contiguous 5-foot squares" (Grease's 4) as a burst that holds about as many
// creatures (S5's capacities: 5 feet 2, 10 feet 4, 15 feet 6, 20 feet 8); an area that "varies" by the spell's own choices (Shadow
// Blast's cone, burst or line, the caster's pick) as its burst: 15 feet across its radius, at up to 120 feet.
const AREAS = { "shadow-blast": { range: "120 feet", area: { type: "burst", value: 15 } } };

function withArea(plan) {
    const targeting = plan?.targeting ?? {};
    if (!plan || targeting.area) return plan;
    const named = AREAS[plan.source?.slug];
    if (named) return { ...plan, simulatorReading: true, targeting: { ...targeting, ...named, target: null } };
    const squares = /(\d+) contiguous 5-foot squares/i.exec(String(targeting.target ?? ""));
    if (!squares) return plan;
    const count = Number(squares[1]) || 1;
    const value = count <= 2 ? 5 : count <= 4 ? 10 : count <= 6 ? 15 : count <= 8 ? 20 : 30;
    return { ...plan, simulatorReading: true, targeting: { ...targeting, target: null, area: { type: "burst", value } } };
}

// A row whose own words give its conditions a recurring save the plan doesn't carry (Confusion's failure, a new save as every turn of
// the creature ends): the conditions' durations get saveEnds against the spell's DC (dc "spell", read as it's applied).
const NEW_SAVE = /(?:new save|attempt a(?:nother)? (?:\w+ ){0,2}save) at the end of each of its turns/i;
// A row's words: its own, and the original's where the spell module rewrote it (Dominate's failure, "Controlled for 1 day" in place of
// PF2e's row; the compiler keeps the original rows in its evidence, the snapshot slims them away after the readings).
const DEGREE_LABELS = { criticalSuccess: "Critical Success", success: "Success", failure: "Failure", criticalFailure: "Critical Failure" };
function rowWords(plan, degree, row) {
    const label = DEGREE_LABELS[degree];
    const saved = (plan?.compilerEvidence?.savedRows ?? []).filter((text) => typeof text === "string" && label && text.startsWith(`${label} `));
    return [row?.rawText ?? "", ...saved].join(" ");
}
function withRecurringSaves(plan) {
    const resolution = plan?.resolution;
    const save = resolution?.check?.statistic;
    if (resolution?.kind !== "save" || !["fortitude", "reflex", "will"].includes(save)) return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        if (!NEW_SAVE.test(rowWords(plan, degree, row)) || !(row.effects ?? []).some((effect) => effect.kind === "condition" && !effect.duration?.saveEnds)) return [degree, row];
        changed = true;
        return [degree, { ...row, effects: row.effects.map((effect) => (effect.kind === "condition" && !effect.duration?.saveEnds ? { ...effect, duration: { ...(effect.duration ?? {}), saveEnds: { save, dc: "spell" } } } : effect)) }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// The plan with the simulator's readings: a resolution where the compiled one resolves nothing, an area where it has none, recurring
// saves its rows' words give; the plan unchanged otherwise.
export function withReading(plan) {
    const reading = READINGS[plan?.source?.slug];
    const resolved = reading && resolvesNothing(plan) ? { ...plan, simulatorReading: true, resolution: reading() } : plan;
    return withSuppression(withNoteReadings(withRowFlags(withRecurringSaves(withConcealedTo(withArea(resolved))))));
}

// Shroud of Night (2026-10-21, sight and light — the user: "I also want spells that need foe traits since i want those to be tracked too in
// the simulator"): a save's row whose words say "all creatures are Concealed to it", with nothing of its own — dazzled (B53: everything
// concealed to it) for the spell's time.
const CONCEALED_TO = /\ball creatures are (?:@UUID\[[^\]]*\]\{)?Concealed\}? to it\b/i;
function withConcealedTo(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    const spec = plan.lifecycle?.durationSpec;
    const duration = spec?.mode === "fixed" && spec.unit ? { mode: "fixed", value: Number(spec.value) || 1, unit: spec.unit } : { mode: "fixed", value: 1, unit: "minutes" };
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        if ((row?.effects ?? []).length || !CONCEALED_TO.test(rowWords(plan, degree, row))) return [degree, row];
        changed = true;
        return [degree, { ...row, effects: [{ kind: "condition", slug: "dazzled", value: null, duration }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// (2026-10-15, Death Ward: "suppresses the effects of the Doomed condition" — in its text, not its PF2e effect's rules.) plan.suppresses: the
// conditions the effect it applies keeps from counting while it lasts (kept past the snapshot's slimming, as rowFlags are).
const SUPPRESSES = /suppress(?:es)? the effects of the (?:@UUID\[[^\]]+\]\{)?(doomed|wounded|drained|enfeebled|clumsy|stupefied)\}?/gi;
function withSuppression(plan) {
    const text = JSON.stringify(plan?.nativeEffects ?? {}) + JSON.stringify(plan?.resolution?.outcomes ?? {}) + JSON.stringify(plan?.compilerEvidence?.residualProse ?? "");
    const found = [...new Set([...text.matchAll(SUPPRESSES)].map((match) => match[1].toLowerCase()))];
    return found.length ? { ...plan, suppresses: found } : plan;
}

// Suggestion and Telepathic Demand (S50): "The target immediately follows your suggestion" — in a fight, the suggestion to stop
// fighting: it can't use hostile actions, and hostility toward it ends that (as Calm's failure; an attack is the suggestion's "obvious
// negative effects"). The GM's note becomes the engine's "No hostile actions" note.
const FOLLOWS = /immediately follows (?:your|the caster's) (?:suggestion|message)/i;
const STOP_FIGHTING = { label: "No hostile actions (the suggestion: stop fighting)", text: "It follows the suggestion to stop fighting: it can't use hostile actions. If it is subject to hostility from any creature, it ceases to be affected." };
function withNoteReadings(plan) {
    if (plan?.resolution?.kind !== "save") return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, row]) => {
        if (!(row?.noteEffects ?? []).some((note) => FOLLOWS.test(String(note?.text ?? "")))) return [degree, row];
        changed = true;
        return [degree, { ...row, noteEffects: row.noteEffects.map((note) => (FOLLOWS.test(String(note?.text ?? "")) ? { ...note, ...STOP_FIGHTING, gmPlays: false } : note)) }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...plan.resolution, outcomes } } : plan;
}

// Notes the engine plays another way, or that change nothing in a fight, by the spell's slug and the note's label ("*": all its
// notes): not gaps (S51). Played: Dominate's critical failure (no new save — the engine gives none), Sleep's waking (the engine's
// sleep ends with damage; a minute is past a fight), Enthrall's (its fascination ends with hostility, as the engine's does; the GM's
// save when it disagrees isn't a fight's). Nothing in a fight: what the caster learns or the target believes, social checks.
const NOTES_KNOWN = {
    dominate: { Dominated: "played" },
    sleep: { "Wakes up": "played" },
    enthrall: { Enthralled: "played" },
    "mind-reading": { "*": "none" },
    "ring-of-truth": { "*": "none" },
    "talking-corpse": { "*": "none" },
    nightmare: { "*": "none" },
    "rewrite-memory": { "*": "none" },
    "zenith-star": { "*": "none" },
    "sudden-recollection": { "*": "none" },
    "casters-imposition": { "*": "none" },
    "sculpt-sound": { "*": "none" },
    "forced-quiet": { "*": "none" },
    "fabricated-truth": { "*": "none" },
    // (Its critical success: the creature knows the caster tried; its failures are the suggestion, above.)
    "telepathic-demand": { "Telepathic demand": "none" }
};
// "played" | "none" | null (a gap). An attitude (Charm, Tame, Outcast's Curse) counts in a fight only as far as it stops hostile
// actions — the "No hostile actions" note, or the note's own words (pacify.js reads both); the rest of it is the GM's.
export function noteKnown(plan, note) {
    const known = NOTES_KNOWN[plan?.source?.slug];
    const label = String(note?.label ?? "");
    if (known && (known[label] ?? known["*"])) return known[label] ?? known["*"];
    return label === "Attitude" ? "none" : null;
}

// What the engine needs at cast time from a row's own words, kept as plan.rowFlags (the snapshot slims the rows' text away; the core
// doesn't read plan-level keys): Calm's critical failure, "hostility doesn't end the effect".
function withRowFlags(plan) {
    const flags = {};
    for (const [degree, row] of Object.entries(plan?.resolution?.outcomes ?? {})) {
        if (/hostility (?:doesn't|does not) end/i.test(String(row?.rawText ?? ""))) flags[degree] = { hostilityPersists: true };
    }
    return Object.keys(flags).length ? { ...plan, rowFlags: { ...(plan.rowFlags ?? {}), ...flags } } : plan;
}

// Telekinetic Maneuver and kin (the plan's spellManeuver: "Disarm, Shove, Reposition, or Trip the target using a spell attack roll
// instead of an Athletics check"): one way per basic action it names — that action's plan (basics: the ability module's basic actions)
// with the caster's spell attack for the roll (the engine's "spell" statistic, the multiple attack penalty with it), at the spell's range,
// actions and traits. [{ name, plan }]; none when it isn't one.
export function maneuverWays(plan, basics) {
    const maneuver = plan?.resolution?.spellManeuver;
    if (plan?.resolution?.kind !== "spell-maneuver" || !maneuver?.actions?.length) return [];
    return maneuver.actions.map((slug) => {
        const basic = basics?.[slug];
        if (!basic?.resolution?.check) return null;
        const name = `${plan.source?.name ?? "Maneuver"} (${basic.source?.name ?? slug})`;
        return {
            name,
            plan: {
                ...basic,
                source: { ...(basic.source ?? {}), name },
                rank: plan.rank,
                traits: [...new Set([...(plan.traits ?? []), "attack"])],
                activation: plan.activation,
                targeting: { ...(basic.targeting ?? {}), range: plan.targeting?.range ?? basic.targeting?.range ?? null },
                resolution: { ...basic.resolution, check: { ...basic.resolution.check, statistic: "spell" } }
            }
        };
    }).filter(Boolean);
}
