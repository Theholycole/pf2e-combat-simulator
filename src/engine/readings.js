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
const NEW_SAVE = /(?:new save|attempt a(?:nother)? (?:\w+ )?save) at the end of each of its turns/i;
function withRecurringSaves(plan) {
    const resolution = plan?.resolution;
    const save = resolution?.check?.statistic;
    if (resolution?.kind !== "save" || !["fortitude", "reflex", "will"].includes(save)) return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        if (!NEW_SAVE.test(String(row?.rawText ?? "")) || !(row.effects ?? []).some((effect) => effect.kind === "condition" && !effect.duration?.saveEnds)) return [degree, row];
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
    return withRowFlags(withRecurringSaves(withArea(resolved)));
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
