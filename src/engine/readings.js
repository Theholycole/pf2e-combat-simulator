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
    },
    // (2026-10-22, family 3 — the compiler's action counts' targets alone, no rows.) Kinetic Ram: a Fortitude save or pushed 10 feet away
    // (20 on a critical failure); Gravitational Pull: or pulled 10 feet closer (prone too on a critical failure). Their action counts'
    // targets kept — an area's "areaType" read as its type.
    "kinetic-ram": (plan) => ({
        kind: "save",
        check: { statistic: "fortitude", basic: false, dcSource: "source-actor" },
        outcomes: { criticalSuccess: row(), success: row(), failure: row({ forcedMovement: { kind: "push", distance: 10 } }), criticalFailure: row({ forcedMovement: { kind: "push", distance: 20 } }) },
        ...nativeTargets(plan)
    }),
    "gravitational-pull": (plan) => ({
        kind: "save",
        check: { statistic: "fortitude", basic: false, dcSource: "source-actor" },
        outcomes: { criticalSuccess: row(), success: row(), failure: row({ forcedMovement: { kind: "pull", distance: 10 } }), criticalFailure: row({ effects: [condition("prone", null)], forcedMovement: { kind: "pull", distance: 10 } }) },
        ...nativeTargets(plan)
    })
};

// A plan's action counts' targeting overlays, kept for a reading that replaces its resolution: { native: { byActions } }, or nothing.
function nativeTargets(plan) {
    const byActions = plan?.resolution?.native?.byActions;
    if (!byActions) return {};
    const read = (targeting) => {
        if (!targeting) return targeting;
        const area = targeting.area ? { type: targeting.area.type ?? targeting.area.areaType, value: Number(targeting.area.value) || 5 } : targeting.area;
        const range = /^\d+$/.test(String(targeting.range ?? "")) ? `${targeting.range} feet` : targeting.range;
        return { ...targeting, ...(targeting.area ? { area } : {}), ...(targeting.range !== undefined ? { range } : {}) };
    };
    return { native: { byActions: Object.fromEntries(Object.entries(byActions).map(([count, overlay]) => [count, overlay?.targeting ? { ...overlay, targeting: read(overlay.targeting) } : overlay])) } };
}

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
    const resolved = reading && resolvesNothing(plan) ? { ...plan, simulatorReading: true, resolution: reading(plan) } : plan;
    return withSuppression(withNoteReadings(withRowFlags(withRecurringSaves(withTransposition(withDuplicate(withBinding(withDefences(withHinders(withControls(withCurses(withMarks(withQuasiReal(withAfflictionStages(withAfflictionRows(withAgitation(withSemicorporeal(withDimming(withGrounding(withOutline(withConcealedTo(withLightAura(withRetaliationSelf(withFormAura(withAllyAura(withEffectNote(withCloudEffect(withoutRoundVariants(withAfflictionCounteract(withStones(withAllyVariants(withArea(resolved))))))))))))))))))))))))))))))));
}

// Faerie Fire and Revealing Light (2026-10-21, invisibility tracked): outlined — not concealed, an invisible creature concealed instead
// (sight.js). Faerie Fire's outline ("outline": its burst, its time) as an automatic check outlining every creature in it; Revealing Light's
// rows ("The light affects the creature for 2 rounds") dazzled and outlined for that time.
const NONE_ROW = { damage: { mode: "none", multiplier: 0, sourceComponentIds: [] }, effects: [] };
const LIGHT_AFFECTS = /\bThe light affects the creature for (\d+) (round|minute)s?\b/i;
function withOutline(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind === "outline" && resolution.outline?.area) {
        const duration = { mode: "fixed", value: Number(resolution.outline.duration?.value) || 1, unit: resolution.outline.duration?.unit ?? "minutes" };
        return { ...plan, simulatorReading: true, targeting: { ...(plan.targeting ?? {}), target: null, area: resolution.outline.area },
            resolution: { kind: "check", check: { roll: "automatic", statistic: "automatic" }, sharedDamage: null, outcomes: { criticalSuccess: { ...NONE_ROW }, success: { ...NONE_ROW, effects: [{ kind: "condition", slug: "outlined", value: null, duration }] }, failure: { ...NONE_ROW }, criticalFailure: { ...NONE_ROW } } } };
    }
    if (resolution?.kind !== "save") return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const lasts = LIGHT_AFFECTS.exec(rowWords(plan, degree, row));
        if ((row?.effects ?? []).length || !lasts) return [degree, row];
        changed = true;
        const duration = { mode: "fixed", value: Number(lasts[1]), unit: `${lasts[2].toLowerCase()}s` };
        return [degree, { ...row, effects: [{ kind: "condition", slug: "dazzled", value: null, duration }, { kind: "condition", slug: "outlined", value: null, duration }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// Earthbind (2026-10-22, flying tracked — the user: "Keep working on the foe trait work"): a save's row that says the target falls ("falls
// safely up to 120 feet"), with nothing of its own — landed, down until its next turn; one that also says it "can't Fly … for 1 round" (or
// a minute) — grounded for that time (space.js fliesNow: no longer aloft, so foes that don't fly reach it).
const FALLS = /\bfalls?\b(?:\s+\w+){0,3}\s+(?:up to \d+ feet|to the ground)|\bfalls safely\b/i;
const CANT_FLY = /\bcan(?:'|’|no)t (?:Fly|fly)\b[^.]*?\bfor (\d+|one|a) (round|minute)s?\b/i;
function withGrounding(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    // (Deluge: "All flying creatures in the area descend" — the compiler's descend control —: landed, whatever the save; its rows' own after.)
    if ((resolution.controls?.parts ?? []).some((part) => part?.kind === "descend")) {
        const landed = { kind: "condition", slug: "landed", value: null, duration: null };
        const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => [degree, { ...row, effects: [landed, ...(row?.effects ?? [])] }]));
        return { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } };
    }
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const words = rowWords(plan, degree, row);
        if ((row?.effects ?? []).length || !FALLS.test(words)) return [degree, row];
        changed = true;
        const grounded = CANT_FLY.exec(words);
        const value = grounded ? (/^\d+$/.test(grounded[1]) ? Number(grounded[1]) : 1) : null;
        return [degree, { ...row, effects: [grounded ? { kind: "condition", slug: "grounded", value: null, duration: { mode: "fixed", value, unit: `${grounded[2].toLowerCase()}s` } } : { kind: "condition", slug: "landed", value: null, duration: null }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// (2026-10-22, found building Dancing Shield: a spell whose PF2e effect the compiler leaves as a note on its recipient — "effect-note":
// Levitate, Dancing Shield, Fire Shield, Tempest Cloak, See the Unseen … — was never cast in fights; the ratings read it as an effect
// (power-readings.js castableReading).) As an effect's on that recipient: the caster's own (recipient "source" or "self-or-companion", with
// no other target), or the target's — a willing creature's where the target is an item it holds (Dancing Shield's "1 touched shield … and 1
// willing creature", Ghostly Weapon's "1 weapon … wielded by you or a willing ally"). Not one on an area, on an object alone, on the caster
// for a creature it targets (Vision of Weakness), or one the caster is asked about.
const NOTE_SELF = /^(?:|you|yourself|yourself or your animal companion)$/i;
function withEffectNote(plan) {
    const resolution = plan?.resolution;
    const note = resolution?.kind === "effect-note" ? resolution.effectNote : null;
    // (Not a reaction — Rapid Retreat, Battlefield Persistence —: fights don't cast those; the ratings read them as they were.)
    if (!note?.effect?.uuid || plan.activation?.time === "reaction") return plan;
    const target = String(plan.targeting?.target ?? "").trim();
    let targeting = plan.targeting;
    let recipients;
    if (note.recipient === "source" || note.recipient === "self-or-companion") {
        if (!NOTE_SELF.test(target)) return plan;
        recipients = "self";
        targeting = { ...(targeting ?? {}), target: "self" };
    } else if (note.recipient === "target") {
        if (target && !/\bcreatures?\b|\ball(?:y|ies)\b/i.test(target)) return plan;
        recipients = "target";
        if (/\b(?:weapon|shield|armor)s?\b/i.test(target) && /\bwilling\b|\ball(?:y|ies)\b/i.test(target)) targeting = { ...targeting, target: "1 willing creature" };
    } else return plan;
    return { ...plan, simulatorReading: true, targeting, resolution: { kind: "effect", check: null, sharedDamage: null, outcomes: resolution.outcomes, applications: [{ kind: "native-spell-effect", uuid: note.effect.uuid, label: note.effect.label ?? null, recipients }] } };
}

// (2026-10-22, Aura of Violent Light: an emanation of light about the ally, 5 feet more each Sustain up to a cap, its damage on the enemies
// ending their turns in it, a basic save — the compiler's basic save on the ally itself.) As a lingering emanation about the ally (zones.js
// centre "target"), its save on the caster's foes that end their turn in it, Sustained, growing as its text says; the cast itself saves no
// one (noInitial).
const ALLY_AURA = /\b(?:ally|creature|target) radiates\b.{0,200}?\bdamage to all enemies that end their turns? within\b/i;
function withAllyAura(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save" || resolution.lingering || plan.targeting?.area?.type) return plan;
    if (!/\bwilling ally\b|\b1 ally\b/i.test(String(plan.targeting?.target ?? ""))) return plan;
    const evidence = plan.compilerEvidence?.simpleBasicSaveGate?.evidence ?? {};
    if (!ALLY_AURA.test(String(evidence.saveSentence ?? ""))) return plan;
    const base = String(evidence.baseText ?? "");
    const size = /\b(\d+)-foot emanation\b/i.exec(base);
    const grows = /\bincrease the emanation by (\d+) feet up to a maximum of (\d+) feet\b/i.exec(base);
    const most = plan.lifecycle?.durationSpec?.maximum;
    const seconds = most?.unit === "minutes" ? Number(most.value) * 60 : most?.unit === "rounds" ? Number(most.value) * 6 : 60;
    const lingering = { area: { type: "emanation", value: size ? Number(size[1]) : 5 }, centre: "target", noInitial: true, durationSeconds: seconds || 60, events: ["turn-end"], sustained: Boolean(plan.lifecycle?.sustained), ...(grows ? { grows: { by: Number(grows[1]), max: Number(grows[2]) } } : {}) };
    return { ...plan, simulatorReading: true, resolution: { ...resolution, lingering } };
}

// (2026-10-22, Eat Fire: the compiler's "cloud-action" — "You gain resistance 5 to fire damage until the end of the current turn. … you can use
// the Belch Smoke action" — its PF2e effect on the caster, as an effect's: the ratings rate that; fights play its reaction as the damage
// comes, spells.js spellReactions. Belch Smoke's cloud isn't played.)
function withCloudEffect(plan) {
    const resolution = plan?.resolution;
    const uuid = resolution?.kind === "cloud-action" ? resolution.cloudAction?.effect?.uuid : null;
    if (!uuid) return plan;
    return { ...plan, simulatorReading: true, targeting: { ...(plan.targeting ?? {}), target: "self" }, resolution: { kind: "effect", check: null, sharedDamage: null, outcomes: resolution.outcomes, cloudAction: resolution.cloudAction, applications: [{ kind: "native-spell-effect", uuid, label: resolution.cloudAction.effect.label ?? null, recipients: "self" }] } };
}

// (2026-10-22, Undermine Reality: the spell module's "Quasi-real" note — halfStrikes, sourceSavesBetter, its row's duration and new save —
// as the quasi-real condition (spells.js FLAGS): its Strikes deal half damage (actions.js applyDamage, expectedHitDamage), and saves
// against its spells and abilities are a degree better.)
function withQuasiReal(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const note = (row?.noteEffects ?? []).find((each) => each?.halfStrikes && each?.sourceSavesBetter);
        if (!note) return [degree, row];
        changed = true;
        const lasts = note.duration?.mode === "fixed" && Number(note.duration.value) > 0 ? { mode: "fixed", value: Number(note.duration.value), unit: note.duration.unit ?? "rounds" } : null;
        const saveEnds = note.recurringSave?.statistic ? { save: note.recurringSave.statistic, dc: "spell" } : null;
        return [degree, { ...row, noteEffects: (row.noteEffects ?? []).filter((each) => each !== note), effects: [...(row.effects ?? []), { kind: "condition", slug: "quasi-real", value: null, duration: lasts ? { ...lasts, ...(saveEnds ? { saveEnds } : {}) } : saveEnds ? { mode: "unlimited", saveEnds } : null }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// (2026-10-22, Dread Mosquito Storm: rows that say "The target is afflicted with necrotic blood at stage 1" without the compiler's
// affliction on them, with the plan's affliction hand-off — as Spider Sting's rows carry it.)
const AFFLICTED_AT = /\bafflicted with (.+?) at stage (\d+)\b/i;
function withAfflictionRows(plan) {
    const resolution = plan?.resolution;
    const handoff = resolution?.kind === "save" ? resolution.afflictionHandoff : null;
    if (!handoff?.stages?.length) return plan;
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const read = row && !row.affliction ? AFFLICTED_AT.exec(String(row.rawText ?? "")) : null;
        if (!read || read[1].toLowerCase() !== String(handoff.name ?? "").toLowerCase()) return [degree, row];
        changed = true;
        return [degree, { ...row, affliction: { name: handoff.name, stage: Number(read[2]), sourceText: row.rawText } }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// (2026-10-22, found building Dread Mosquito Storm: a spell's affliction hand-off has its stages as text — Spider Sting's "1d4 poison damage
// and Enfeebled 1 (1 round)" — and the engine plays stages read into numbers, as the ability module reads a creature's (damage, conditions,
// duration; spells.js setAfflictionStage). Before, a spell's affliction did nothing in a fight.) Each stage's text read: its @Damage tags
// (or "2d10 poison damage"), its conditions (a linked condition's name and value, or a plain one), its time (the last parenthesis), death;
// the hand-off's maximum duration and onset as spans, its save the spell's.
const SPANS = { round: "rounds", minute: "minutes", hour: "hours", day: "days", week: "weeks" };
const STAGE_CONDITIONS = ["blinded", "clumsy", "confused", "dazzled", "deafened", "doomed", "drained", "enfeebled", "fascinated", "fatigued", "fleeing", "frightened", "immobilized", "off-guard", "paralyzed", "petrified", "prone", "restrained", "sickened", "slowed", "stunned", "stupefied", "unconscious", "wounded"];
function readSpanText(text) {
    const read = /^(?:(\d+)|(\d+)d(\d+))\s+(round|minute|hour|day|week)s?\b/i.exec(String(text ?? "").trim());
    return read ? { value: read[1] ? Number(read[1]) : Math.floor(Number(read[2]) * (Number(read[3]) + 1) / 2), unit: SPANS[read[4].toLowerCase()] } : null;
}
function stageOf(stage) {
    const html = String(stage?.text ?? "");
    const plain = html.replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@Damage\[((?:[^[\]]|\[[^\]]*\])*)\]/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (/^(?:dead\b|(?:the (?:creature|victim|target) )?dies\b)/i.test(plain)) return { ...stage, damage: [], conditions: [], duration: null, death: true };
    const damage = [];
    for (const tag of html.matchAll(/@Damage\[((?:[^[\]]|\[[^\]]*\])*)\]/g)) {
        // ("(1+@item.level)[fire],(1+@item.level)[spirit]": each part.)
        let depth = 0;
        let part = "";
        // (Blinding Bottle's "3d6[poison]|traits:incapacitation,poison": the formula before its options.)
        for (const ch of tag[1].replace(/\|[^\]]*$/, "")) {
            if (ch === "," && depth === 0) {
                damage.push(part.trim());
                part = "";
                continue;
            }
            if (ch === "[" || ch === "(") depth++;
            if (ch === "]" || ch === ")") depth--;
            part += ch;
        }
        if (part.trim()) damage.push(part.trim());
    }
    if (!damage.length) for (const read of plain.matchAll(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\s+([a-z]+)\s+damage\b/gi)) damage.push(`(${read[1].replace(/\s+/g, "")})[${read[2].toLowerCase()}]`);
    const conditions = [];
    const words = plain.replace(/\([^()]*\)\s*$/, "");
    for (const read of words.matchAll(new RegExp(`\\b(${STAGE_CONDITIONS.join("|")})(?:\\s+(\\d+))?\\b`, "gi"))) {
        const slug = read[1].toLowerCase();
        if (!conditions.some((condition) => condition.slug === slug)) conditions.push({ slug, value: read[2] ? Number(read[2]) : null });
    }
    const spans = [...plain.matchAll(/\(([^()]*)\)/g)].map((read) => readSpanText(read[1])).filter(Boolean);
    return { ...stage, damage, conditions, duration: spans.at(-1) ?? null };
}
function withAfflictionStages(plan) {
    const resolution = plan?.resolution;
    const handoff = resolution?.afflictionHandoff;
    if (!handoff?.stages?.length || handoff.stages.every((stage) => Array.isArray(stage?.damage))) return plan;
    const stages = handoff.stages.map((stage) => (Array.isArray(stage?.damage) ? stage : stageOf(stage)));
    // (A stage with no time of its own: the one before's.)
    for (const [index, stage] of stages.entries()) if (!stage.duration && !stage.death && index > 0) stages[index] = { ...stage, duration: stages[index - 1].duration };
    const span = (value) => (value && typeof value === "object" ? value : readSpanText(value));
    const read = { ...handoff, stages, maximumDuration: span(handoff.maximumDuration), onset: span(handoff.onset), statistic: handoff.statistic ?? resolution.check?.statistic ?? "fortitude" };
    return { ...plan, simulatorReading: true, resolution: { ...resolution, afflictionHandoff: read } };
}

// (2026-10-22, Blessing of Defiance: its action counts' targets — "you or one willing ally within range", "you and all willing allies within
// range" — as one willing creature, and an emanation of the spell's range over its allies (its effect on its allies there only).)
const ONE_ALLY = /^you or (?:one|1) willing ally\b/i;
const ALL_ALLIES = /^you and all willing allies within (?:range|(\d+) feet)\b/i;
function withAllyVariants(plan) {
    const byActions = plan?.resolution?.native?.byActions;
    if (!byActions || !Object.values(byActions).some((overlay) => ONE_ALLY.test(String(overlay?.targeting?.target ?? "")) || ALL_ALLIES.test(String(overlay?.targeting?.target ?? "")))) return plan;
    const range = Number(/(\d+)\s*feet/i.exec(String(plan.targeting?.range ?? ""))?.[1]) || 30;
    const read = (targeting) => {
        const target = String(targeting?.target ?? "");
        const all = ALL_ALLIES.exec(target);
        if (all) return { ...targeting, target: null, range: null, area: { type: "emanation", value: Number(all[1]) || range } };
        return ONE_ALLY.test(target) ? { ...targeting, target: "1 willing creature" } : targeting;
    };
    const overlays = Object.fromEntries(Object.entries(byActions).map(([count, overlay]) => [count, overlay?.targeting ? { ...overlay, targeting: read(overlay.targeting) } : overlay]));
    const applications = (plan.resolution.applications ?? []).map((application) => (application?.kind === "native-spell-effect" ? { ...application, recipients: "allies-in-area" } : application));
    return { ...plan, simulatorReading: true, resolution: { ...plan.resolution, applications, native: { ...plan.resolution.native, byActions: overlays } } };
}

// (2026-10-22, Brand the Impenitent, Vindicator's Judgment: a mark on the target against its caster alone — the spell module's notes: Brand's
// "-1 status penalty to AC against attacks by followers of your faith" (its toggle, attacker-follows-caster-faith) and "ignore the target's
// Concealed condition"; Judgment's weakness to the caster's Strikes (rankAmount) — its next one only on a success —, off-guard to its first
// Strike each round on a critical failure.) As a condition of its own its row gives — branded, judged, judged-once, judged-hard —, the
// details in plan.marks (spells.js applyMark). Taken as the caster alone following its faith; Judgment's weakness to damaging divine spells
// isn't played, and its "your hunted prey" is any creature.
function withMarks(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    const marks = {};
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const notes = row?.noteEffects ?? [];
        const penalty = (note) => (note.rules ?? []).find((rule) => rule?.key === "FlatModifier" && rule.selector === "ac" && [].concat(rule.predicate ?? []).includes("attacker-follows-caster-faith"));
        const brand = notes.find(penalty);
        const judgment = notes.find((note) => note?.rankAmount && /\bWeakness \{amount\} to (?:the caster's next Strike|every Strike the caster makes)\b/i.test(String(note.text ?? "")));
        const note = brand ?? judgment;
        if (!note) return [degree, row];
        let slug;
        if (brand) {
            slug = "branded";
            marks.branded = { ac: Math.abs(Number(penalty(brand).value)) || 1, seesConcealed: /\bignore the target's Concealed\b/i.test(String(brand.text ?? "")) };
        } else {
            const once = /\bnext Strike\b/i.test(String(judgment.text));
            const hard = /\bOff-Guard against the caster's first Strike\b/i.test(String(judgment.text));
            slug = once ? "judged-once" : hard ? "judged-hard" : "judged";
            marks[slug] = { weakness: judgment.rankAmount, uses: once ? 1 : null, offGuardFirst: hard };
        }
        const lasts = note.duration?.mode === "fixed" && Number(note.duration.value) > 0 ? { mode: "fixed", value: Number(note.duration.value), unit: note.duration.unit ?? "rounds" } : null;
        return [degree, { ...row, noteEffects: notes.filter((each) => each !== note), effects: [...(row.effects ?? []), { kind: "condition", slug, value: null, duration: lasts }] }];
    }));
    if (!Object.keys(marks).length) return plan;
    const targeting = /^your hunted prey$/i.test(String(plan.targeting?.target ?? "").trim()) ? { ...plan.targeting, target: "1 creature" } : plan.targeting;
    return { ...plan, simulatorReading: true, targeting, marks, resolution: { ...resolution, outcomes } };
}

// (2026-10-22, Magic Stone — the user: "it can be used on any small rock which can be assumed to be available at all times": "1 to 3 non-magical
// stones or sling bullets", one an action, carried by the caster or a willing ally — as one willing creature, the holder; its action counts
// as variants, the stones as many — spells.js stoneStrike.)
const STONE_TARGET = /^(\d) to (\d) non-magical stones\b/i;
function withStones(plan) {
    const read = STONE_TARGET.exec(String(plan?.targeting?.target ?? ""));
    if (!read || plan.resolution?.kind !== "effect" || plan.resolution.native?.byActions) return plan;
    const counts = Object.fromEntries(Array.from({ length: Number(read[2]) - Number(read[1]) + 1 }, (_, index) => [Number(read[1]) + index, {}]));
    return { ...plan, simulatorReading: true, targeting: { ...plan.targeting, target: "1 willing creature" }, resolution: { ...plan.resolution, native: { ...(plan.resolution.native ?? {}), byActions: counts } } };
}

// (2026-10-22, Purging Toxins, Delay Affliction: a counteract on an affliction — the compiler's source "affliction", which the core's family
// leaves as a gap — as one on an effect the core passes on, marked by an "affliction" trait beside the kinds it ends (none: any) — spells.js
// bestCounter's afflictions.)
function withAfflictionCounteract(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "affliction-care" || !(resolution.operations ?? []).some((operation) => operation?.op === "counteract" && operation.source === "affliction")) return plan;
    const operations = resolution.operations.map((operation) => (operation?.op === "counteract" && operation.source === "affliction" ? { ...operation, source: "effect", grantsConditions: [], traits: ["affliction", ...(operation.anyAffliction ? [] : operation.traits ?? [])] } : operation));
    return { ...plan, simulatorReading: true, resolution: { ...resolution, operations } };
}

// (2026-10-22, family 3 — Psychic Outburst: its action counts' rows beside a variant for its casting over 2 rounds, "(Two-Round)", which the
// core resolves instead and finds nothing in: fights cast it with actions, the variants for rounds left out.)
function withoutRoundVariants(plan) {
    const native = plan?.resolution?.native;
    if (plan?.resolution?.kind !== "unsupported" || !native?.byActions || !native.variants?.length || !native.variants.every((variant) => /\bround\b/i.test(String(variant?.name ?? "")))) return plan;
    const { variants, ...rest } = native;
    return { ...plan, simulatorReading: true, resolution: { ...plan.resolution, native: rest } };
}

// (2026-10-22, family 3 — curses that hurt as the creature acts, or as it's hit.) Cycle of Retribution — mental damage as it takes a hostile
// action: the next one, the first each round, or each, by its save —; Warrior's Regret — at its turns' end, damage for each creature it
// damaged that turn: its next turn, till a round of peace, or for good —; Bloodspray Curse — the first big piercing or slashing hit each
// round deals more, bleed too on a failure —; Implement of Destruction — an ally's weapon deals it more mental damage: its first hit, or
// persistent with each, doomed on a critical. Their rows' notes as conditions "curse:<mode>" for those rows' times; plan.curse { kind } —
// spells.js applyCurse.
const CURSES = {
    "cycle-of-retribution": { kind: "cycle", rows: { success: ["once", 10], failure: ["round", 10], criticalFailure: ["each", 10] } },
    "warriors-regret": { kind: "regret", rows: { success: ["once", 1], failure: ["until-peace", 10], criticalFailure: ["fight", null] } },
    "bloodspray-curse": { kind: "bloodspray", rows: { success: ["extra", 10], failure: ["bleed", 10], criticalFailure: ["bleed", 10] } },
    "implement-of-destruction": { kind: "destruction", rows: { success: ["once", 10], failure: ["persistent", 10], criticalFailure: ["persistent-double", 10] } }
};
function withCurses(plan) {
    const curse = CURSES[plan?.source?.slug];
    if (!curse || plan.resolution?.kind !== "save") return plan;
    const outcomes = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, entry]) => {
        const mode = curse.rows[degree];
        if (!mode) return [degree, entry];
        return [degree, { ...entry, noteEffects: [], effects: [...(entry?.effects ?? []), { kind: "condition", slug: `curse:${mode[0]}`, value: null, duration: mode[1] ? { mode: "fixed", value: mode[1], unit: "rounds" } : null }] }];
    }));
    return { ...plan, simulatorReading: true, curse: { kind: curse.kind }, resolution: { ...plan.resolution, outcomes } };
}

// (2026-10-22, family 4 — control.) Banishment: a creature not on its home plane (an "extraplanar" target: fiends, celestials, elementals,
// monitors, the summoned) banished on a failure; Containment: a force field about it — 40 Hit Points, 10 on a success, 15 / 5 more a rank
// past 4th (no critical failure row: the failure's); Steal Voice: voiceless — no spells but subtle ones, nothing auditory — till its next
// turn's end, a minute, or for good; Overwhelming Presence: its tribute, an action each turn, 2 or 6 of them (all its actions on a
// critical failure), fascinated while it pays. Their rows as the simulator's conditions (spells.js applyControl).
const CONTROLS = {
    banishment: { failure: ["banished", null, null], criticalFailure: ["banished", null, null] },
    containment: { success: ["contained", 10, 10], failure: ["contained", 40, 10], criticalFailure: ["contained", 40, 10] },
    "steal-voice": { success: ["voiceless", null, 1], failure: ["voiceless", null, 10], criticalFailure: ["voiceless", null, 0] },
    "overwhelming-presence": { success: ["tribute", 2, 10], failure: ["tribute", 6, 10], criticalFailure: ["tribute-all", 6, 10] }
};
// (2026-10-22, family 4 — hindrances.) What each row keeps the creature from, for its rounds: Binding Muzzle — its mouth's attacks and
// breath (muzzled), on a failure a DC 11 flat check to cast (muzzle-tight), on a critical failure no speech (voiceless); Vicious Jealousy,
// Paranoia — no one its ally (allyless: nothing that helps another), Vicious Jealousy's critical failure its first action spent waving off
// an ally in reach (jealous); Bewilder — a flat check before each hostile action (DC 6, DC 11 on a critical failure), the failure's with a
// Will save at each turn's end; Sensory Deprivation — eyes, hands or mouth (deprived: one of them, two on a critical failure). Rows as
// "hinder:<kind>[:<flat DC, senses, doors or once>[:will]]" conditions (the core passes a condition's slug, value and time only; spells.js applyHinder).
const HINDERS = {
    "binding-muzzle": { success: [["muzzled", 1]], failure: [["muzzled", 10], ["muzzle-tight", 10]], criticalFailure: [["muzzled", 10], ["voiceless", 10]] },
    "vicious-jealousy": { success: [["allyless", 1]], failure: [["allyless", 10]], criticalFailure: [["allyless", 10], ["jealous", 10]] },
    paranoia: { success: [["allyless", 1]], failure: [["allyless", 10]], criticalFailure: [["allyless", 10]] },
    bewilder: { success: [["bewildered", 1, { flat: 6, turnEnd: true }]], failure: [["bewildered", 10, { flat: 6, saveEnds: "will" }]], criticalFailure: [["bewildered", 10, { flat: 11 }]] },
    "sensory-deprivation": { success: [["deprived", 1, { senses: 1 }]], failure: [["deprived", 10, { senses: 1 }]], criticalFailure: [["deprived", 10, { senses: 2 }]] },
    // (Family 8: Maze of Locked Doors — out of the fight till its time's up or it's through its doors (1, 2, 3: the number in the slug);
    // Orb of Twisting Fate — its first action each turn lost, once on a success ("1"), a Will save each turn's end on a failure.)
    "maze-of-locked-doors": { success: [["mazed", 1, { senses: 1 }]], failure: [["mazed", 10, { senses: 2 }]], criticalFailure: [["mazed", 100, { senses: 3 }]] },
    "orb-of-twisting-fate": { success: [["twisted", 1, { senses: 1 }]], failure: [["twisted", 10, { saveEnds: "will" }]], criticalFailure: [["twisted", 10]] }
};
function withHinders(plan) {
    const hinder = HINDERS[plan?.source?.slug];
    if (!hinder || plan.resolution?.kind !== "save") return plan;
    const outcomes = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, entry]) => {
        const reads = hinder[degree];
        if (!reads) return [degree, { ...entry, noteEffects: [] }];
        const slug = (kind, extra) => (kind === "voiceless" ? kind : [`hinder:${kind}`, ...(extra?.flat ?? extra?.senses ? [extra.flat ?? extra.senses] : extra?.saveEnds ? [0] : []), ...(extra?.saveEnds ? [extra.saveEnds] : [])].join(":"));
        const effects = reads.map(([kind, rounds, extra]) => ({ kind: "condition", slug: slug(kind, extra), value: null, duration: { mode: "fixed", value: rounds, unit: "rounds", ...(extra?.turnEnd ? { expiry: "turn-end" } : {}) } }));
        return [degree, { ...entry, noteEffects: [], rowNotes: [], effects: [...(entry?.effects ?? []).filter((effect) => effect?.kind !== "note"), ...effects] }];
    }));
    return { ...plan, simulatorReading: true, hinder: true, resolution: { ...plan.resolution, outcomes } };
}

// (2026-10-22, family 5 — big defences.) Spells whose state the simulator keeps itself (spells.js applyDefence; lasting.js "defences"):
// the spell wards answered as a foe's spell comes (spells.js spellWardAnswer) — Spell Turning (a targeted spell, its reaction, once),
// Spell Immunity (the spell named: the foes' most damaging), Dispelling Globe (a spell from outside its 10 feet, as a Dispel Magic a rank
// lower) —; Prismatic Shield (till the caster's next turn: ranged physical Strikes stopped, a targeted spell counteracted, a melee
// attacker's shard of Prismatic Spray); Indestructibility (till its next turn, harmed by nothing); Foresight (not flanked; the caster's
// reaction, a hostile roll at the creature twice — its save the better, an attack the worse); Forbidding Ward (+1 status, +2 from 6th, to
// AC and saves against one foe, Sustained). plan.defence { kind, rounds, ownTurn, sustained, rankOffset }.
const DEFENCES = {
    "spell-turning": { kind: "turning", rounds: 600 },
    "spell-immunity": { kind: "immunity", rounds: Infinity },
    "dispelling-globe": { kind: "globe", rounds: 100, rankOffset: -1 },
    "prismatic-shield": { kind: "prismatic", rounds: 1, ownTurn: true },
    indestructibility: { kind: "indestructible", rounds: 1, ownTurn: true },
    foresight: { kind: "foresight", rounds: 600 },
    "forbidding-ward": { kind: "forbidding", rounds: 10, sustained: true }
};
function withDefences(plan) {
    const defence = DEFENCES[plan?.source?.slug];
    return defence ? { ...plan, simulatorReading: true, defence: { ...defence } } : plan;
}

// (2026-10-22, family 7 — minions.) Duplicate Foe: its rows as "duplicate:<degree>" conditions (the core leaves its duplicate to the GM),
// spells.js makeDuplicate. Subjugate Undead: controlled for a minute on a failure, ten on a critical failure (Claim Undead's). Bind Undead:
// no save — a mindless undead of a level up to its rank, controlled for the fight (plan.binding; spells.js castPlan).
function withDuplicate(plan) {
    const resolution = plan?.resolution;
    if (!resolution?.duplicate || resolution.kind !== "save") return plan;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => [degree, degree === "criticalSuccess" ? row : { ...row, effects: [...(row?.effects ?? []), { kind: "condition", slug: `duplicate:${degree}`, value: null, duration: null }] }]));
    return { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } };
}
// (2026-10-22, family 8: Collective Transposition — a foe that fails teleported where the caster chooses: away from the party, as a 30-foot
// push; no critical failure row, the failure's.)
function withTransposition(plan) {
    if (plan?.source?.slug !== "collective-transposition" || plan.resolution?.kind !== "save") return plan;
    const moved = (row) => ({ ...row, forcedMovement: { kind: "push", distance: 30 } });
    const outcomes = { ...plan.resolution.outcomes, failure: moved(plan.resolution.outcomes?.failure ?? {}), criticalFailure: moved(plan.resolution.outcomes?.criticalFailure ?? plan.resolution.outcomes?.failure ?? {}) };
    // (Its 30-foot emanation is where they can go: its targets, up to 2 creatures in it.)
    // (The caster's choice of where — the core's "controls" — played as that push.)
    const { controls, ...resolution } = plan.resolution;
    return { ...plan, simulatorReading: true, targeting: { ...plan.targeting, area: null, range: "30 feet" }, resolution: { ...resolution, outcomes } };
}
const SUBJUGATE = { failure: 10, criticalFailure: 100 };
function withBinding(plan) {
    const slug = plan?.source?.slug;
    if (slug === "subjugate-undead" && plan.resolution?.kind === "save") {
        const outcomes = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, row]) => [degree, SUBJUGATE[degree] ? { ...row, noteEffects: [], effects: [...(row?.effects ?? []), { kind: "condition", slug: "controlled", value: null, duration: { mode: "fixed", value: SUBJUGATE[degree], unit: "rounds" } }] } : row]));
        return { ...plan, simulatorReading: true, resolution: { ...plan.resolution, outcomes } };
    }
    if (slug !== "bind-undead") return plan;
    const ranks = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), index + 1]));
    const predicates = [...(plan.targeting?.actorConstraints?.predicates ?? []), { kind: "trait", slug: "undead", present: true }, { kind: "trait", slug: "mindless", present: true }, { kind: "level-at-most", level: Number(plan.rank) || 3, byRank: ranks }, { kind: "enemy-of-caster" }];
    return { ...plan, simulatorReading: true, binding: { slug: "controlled" }, targeting: { ...plan.targeting, actorConstraints: { ...(plan.targeting?.actorConstraints ?? {}), predicates } } };
}

function withControls(plan) {
    const control = CONTROLS[plan?.source?.slug];
    if (!control || plan.resolution?.kind !== "save") return plan;
    const outcomes = Object.fromEntries(Object.entries(plan.resolution.outcomes ?? {}).map(([degree, entry]) => {
        const read = control[degree];
        if (!read) return [degree, { ...entry, noteEffects: [] }];
        const [slug, value, rounds] = read;
        const duration = rounds === null ? null : rounds === 0 ? null : { mode: "fixed", value: rounds, unit: "rounds" };
        return [degree, { ...entry, noteEffects: [], effects: [...(entry?.effects ?? []), { kind: "condition", slug, value, duration }] }];
    }));
    const extraplanar = plan.source.slug === "banishment" ? { targeting: { ...plan.targeting, actorConstraints: { ...(plan.targeting?.actorConstraints ?? {}), predicates: [...(plan.targeting?.actorConstraints?.predicates ?? []), { kind: "extraplanar" }] } } } : {};
    return { ...plan, simulatorReading: true, ...extraplanar, control: [...new Set(Object.values(control).map((read) => read[0]))], resolution: { ...plan.resolution, outcomes } };
}

// Agitate (2026-10-22, flying and the like): "the target must Stride, Fly, or Swim at least once each turn or take 2d8 mental damage at the
// end of its turn", for the rounds its save's row gives ("The duration is 2 rounds") — agitated (a condition, spells.js FLAGS) for those
// rounds; plan.agitation its damage { dice, die, type, step } — spells.js agitationParts at the cast rank, agitationTurnEnd.
const AGITATED = /\bmust (?:Stride|Fly|Swim)(?:,? (?:or )?(?:Stride|Fly|Swim))* at least once each turn or take (\d+)d(\d+) (\w+) damage at the end of its turn\b/i;
const AGITATED_ROUNDS = /\bduration is (\d+) rounds?\b/i;
function withAgitation(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    const read = AGITATED.exec(Object.values(resolution.outcomes ?? {}).flatMap((row) => (row?.noteEffects ?? []).map((note) => String(note?.text ?? ""))).join(" "));
    if (!read) return plan;
    const component = resolution.sharedDamage?.components?.[0];
    const heightening = resolution.sharedDamage?.heightening;
    const more = heightening?.type === "interval" ? /^(\d+)d\d+$/.exec(String(heightening.damage?.[component?.id] ?? "")) : null;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const lasts = AGITATED_ROUNDS.exec(rowWords(plan, degree, row));
        return [degree, lasts ? { ...row, noteEffects: [], effects: [...(row?.effects ?? []), { kind: "condition", slug: "agitated", value: null, duration: { mode: "fixed", value: Number(lasts[1]), unit: "rounds" } }] } : { ...row, noteEffects: [] }];
    }));
    const agitation = { dice: Number(read[1]), die: Number(read[2]), type: read[3].toLowerCase(), ...(more ? { step: { dice: Number(more[1]), interval: Number(heightening.interval) || 1 } } : {}) };
    return { ...plan, simulatorReading: true, agitation, resolution: { ...resolution, sharedDamage: null, outcomes } };
}

// Blanket of Stars (2026-10-22, sight and light): a generated form whose fight effect is an aura's save on the creatures that end their turn
// in it ("Any creature that ends its turn adjacent to you must attempt a Will save") — the compiler's formRiders.auras — as an emanation's
// save about the caster that lingers, at those turns' ends, for the spell's time (zones.js startLingering). The form's own rules (a status
// bonus to Stealth, invisible under a starry sky) aren't played.
const AURA_EVENTS = new Set(["turn-start", "turn-end", "enter"]);
function withFormAura(plan) {
    const resolution = plan?.resolution;
    const aura = resolution?.kind === "generated-form" ? (resolution.formRiders?.auras ?? []).find((each) => Number(each?.radius) > 0 && each.save?.statistic && Object.keys(each.save.rows ?? {}).length) : null;
    if (!aura) return plan;
    const lasts = (row) => (Number(row?.rounds) > 0 ? { mode: "fixed", value: Number(row.rounds), unit: "rounds", ...(row.expiry ? { expiry: row.expiry } : {}) } : null);
    const row = (degree) => {
        const read = aura.save.rows[degree];
        return { ...NONE_ROW, effects: (read?.conditions ?? []).map((condition) => ({ kind: "condition", slug: condition.slug, value: condition.value ?? null, duration: lasts(read) })) };
    };
    const area = { type: "emanation", value: Number(aura.radius) };
    const events = (aura.events ?? []).filter((event) => AURA_EVENTS.has(event));
    return { ...plan, simulatorReading: true, targeting: { ...(plan.targeting ?? {}), target: null, range: null, area },
        resolution: { kind: "save", check: { statistic: aura.save.statistic, basic: false, dcSource: "source-actor" }, sharedDamage: null,
            outcomes: { criticalSuccess: row("criticalSuccess"), success: row("success"), failure: row("failure"), criticalFailure: row("criticalFailure") },
            lingering: { area, centre: "caster", durationSeconds: Number(resolution.generatedForm?.seconds) || 60, events: events.length ? events : ["turn-end"] } } };
}

// Light of Revelation (2026-10-22, sight and light): a light aura about the caster, aimed at itself (its data's "30-foot emanation" range
// otherwise leaves it nothing to aim at) — light.js lightAuraModel plays it.
// (Warning Stripes, 2026-10-22: the compiler's "retaliation" kind, on its caster — spells.js planRetaliation.)
function withRetaliationSelf(plan) {
    if (plan?.resolution?.kind !== "retaliation" || plan.targeting?.target) return plan;
    return { ...plan, simulatorReading: true, targeting: { ...(plan.targeting ?? {}), target: "self", range: null, area: null } };
}

function withLightAura(plan) {
    if (plan?.resolution?.kind !== "light-aura" || plan.targeting?.target === "self") return plan;
    return { ...plan, simulatorReading: true, targeting: { ...(plan.targeting ?? {}), target: "self", range: null, area: null } };
}

// Dirge of Remembrance (2026-10-22, incorporeal): a save's row that says the creature "becomes semi-corporeal", with nothing of its own —
// semicorporeal (weapons' attacks on it have ghost touch's benefit) for the spell's time.
const SEMICORPOREAL = /\bbecomes? semi-?corporeal\b/i;
function withSemicorporeal(plan) {
    const resolution = plan?.resolution;
    if (resolution?.kind !== "save") return plan;
    const spec = plan.lifecycle?.durationSpec;
    const duration = spec?.mode === "fixed" && spec.unit ? { mode: "fixed", value: Number(spec.value) || 1, unit: spec.unit } : { mode: "fixed", value: 1, unit: "minutes" };
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const words = rowWords(plan, degree, row);
        // ("As failure, but double damage" — the failure row's condition too.)
        const asFailure = /^as failure\b/i.test(String(row?.rawText ?? "").trim()) && SEMICORPOREAL.test(rowWords(plan, "failure", resolution.outcomes?.failure));
        if ((row?.effects ?? []).length || !(SEMICORPOREAL.test(words) || asFailure)) return [degree, row];
        changed = true;
        return [degree, { ...row, effects: [{ kind: "condition", slug: "semicorporeal", value: null, duration }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
}

// Penumbral Shroud (2026-10-22, sight and light): a save whose text says the target "perceives light as one step lower", its rows only saying
// how long the effect lasts ("for 1 round", "its normal duration") — dimmed (light.js sightDCIn) that long.
const STEP_LOWER = /\bperceives? light as one step lower\b/i;
const LASTS_FOR = /\b(?:effect|spell) lasts for (\d+) (round|minute)s?\b/i;
const LASTS_NORMAL = /\blasts (?:its|the spell's) normal duration\b/i;
function withDimming(plan) {
    const resolution = plan?.resolution;
    // (The spell's own sentence rides on its rows' notes — noteEffects.)
    if (resolution?.kind !== "save" || !STEP_LOWER.test(JSON.stringify(resolution.outcomes ?? {}))) return plan;
    const spec = plan.lifecycle?.durationSpec;
    const whole = spec?.mode === "fixed" && spec.unit ? { mode: "fixed", value: Number(spec.value) || 1, unit: spec.unit } : { mode: "fixed", value: 1, unit: "minutes" };
    let changed = false;
    const outcomes = Object.fromEntries(Object.entries(resolution.outcomes ?? {}).map(([degree, row]) => {
        const words = rowWords(plan, degree, row);
        if ((row?.effects ?? []).length) return [degree, row];
        const lasts = LASTS_FOR.exec(words);
        const duration = lasts ? { mode: "fixed", value: Number(lasts[1]), unit: `${lasts[2].toLowerCase()}s` } : LASTS_NORMAL.test(words) ? whole : null;
        if (!duration) return [degree, row];
        changed = true;
        return [degree, { ...row, effects: [{ kind: "condition", slug: "dimmed", value: null, duration }] }];
    }));
    return changed ? { ...plan, simulatorReading: true, resolution: { ...resolution, outcomes } } : plan;
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
