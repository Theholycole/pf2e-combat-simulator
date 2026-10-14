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

// The plan with the simulator's reading in place of a resolution that resolves nothing; the plan unchanged otherwise.
export function withReading(plan) {
    const reading = READINGS[plan?.source?.slug];
    if (!reading || !resolvesNothing(plan)) return plan;
    return { ...plan, simulatorReading: true, resolution: reading() };
}
