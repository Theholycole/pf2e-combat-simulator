// The GM's morale card in play (user, 2026-10-09): one card per event ("A quarter of its side has
// fallen"), a row per foe with its DC and modifiers as tick boxes, Roll / Roll all, then Apply.
// Pure: scripts/morale-live.js posts it, rolls and applies.

export const MORALE_CARD_VERSION = 1;

const DEGREES = ["critical failure", "failure", "success", "critical success"];

// The GM's calls: ticked when the encounter's saved situation says so, otherwise offered unticked.
const GM_CALLS = ["defendingHome", "noRetreat", "hatedEnemy"];

function escape(text) {
    return String(text ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

const signed = (value) => `${value >= 0 ? "+" : "−"}${Math.abs(value)}`;

// A modifier's label, from the rules (templates and their extras included).
export function modifierLabel(rules, id) {
    if (id.startsWith("template.")) {
        const [, name, extra] = id.split(".");
        const template = rules.templates?.[name];
        if (extra === "lair") return `${template?.label ?? name}: defending young, food or lair`;
        if (extra === "bloodied") return `${template?.label ?? name}: bloodied, escape possible`;
        if (extra === "winning") return `${template?.label ?? name}: its side is winning`;
        if (extra === "unpaid") return `${template?.label ?? name}: unpaid or betrayed`;
        return `${template?.label ?? name} template`;
    }
    return rules.modifiers?.[id]?.label ?? id;
}

// A row's tick boxes: the modifiers that apply now (ticked), then the GM's calls not already among them (unticked).
export function rowModifiers(rules, parts, template) {
    const modifiers = (parts ?? []).map((part) => ({ id: part.id, label: modifierLabel(rules, part.id), value: part.value, on: true }));
    const have = new Set(modifiers.map((modifier) => modifier.id));
    const offer = (id, value) => {
        if (!have.has(id) && value) modifiers.push({ id, label: modifierLabel(rules, id), value, on: false });
    };
    for (const id of GM_CALLS) if (rules.modifiers?.[id]?.enabled) offer(id, rules.modifiers[id].value);
    const own = rules.templates?.[template];
    if (template === "bestial") offer("template.bestial.lair", own?.defendingLair ?? 0);
    if (template === "mercenary") offer("template.mercenary.unpaid", own?.unpaid ?? 0);
    return modifiers;
}

export const rowTotal = (row) => (row.modifiers ?? []).filter((modifier) => modifier.on).reduce((sum, modifier) => sum + modifier.value, 0);

// Read the fight (M38): the ticked morale modifiers among its losing signs, turned into Perception bonuses.
export const readModifiers = (row) => (row.read ? (row.modifiers ?? []).filter((modifier) => modifier.on && row.read.signs.includes(modifier.id) && modifier.value < 0).map((modifier) => ({ ...modifier, value: -modifier.value })) : []);
export const readTotal = (row) => readModifiers(row).reduce((sum, modifier) => sum + modifier.value, 0);

// checks: liveMoraleChecks' { reason, rows }; who: id → { actorUuid, tokenUuid } for each row's creature.
export function createMoraleCard({ rules, combatId, round, check, who = {} }) {
    return {
        version: MORALE_CARD_VERSION,
        combatId,
        round,
        reason: check.reason,
        reasonLabel: rules.triggers?.[check.reason]?.label ?? check.reason,
        status: "open",
        rows: check.rows.map((row) => ({
            id: row.id,
            name: row.name,
            actorUuid: who[row.id]?.actorUuid ?? null,
            tokenUuid: who[row.id]?.tokenUuid ?? null,
            bossHolds: !!row.bossHolds,
            dc: row.dc ?? null,
            modifiers: row.bossHolds ? [] : rowModifiers(rules, row.parts, row.template),
            read: row.read ? { dc: row.read.dc, signs: [...row.read.signs], total: null, natural: null, degree: null } : null,
            total: null,
            natural: null,
            degree: null
        })),
        results: [],
        // M38: the creatures that yielded, for Accept / Refuse: [{ id, name, status: "open" | "accepted" | "refused" }].
        yields: []
    };
}

export const toRoll = (card) => card.rows.filter((row) => !row.bossHolds && row.degree === null);
export const allRolled = (card) => toRoll(card).length === 0;

export function toggleModifier(card, rowId, modifierId) {
    return {
        ...card,
        rows: card.rows.map((row) => (row.id !== rowId || row.degree !== null ? row : { ...row, modifiers: row.modifiers.map((modifier) => (modifier.id === modifierId ? { ...modifier, on: !modifier.on } : modifier)) }))
    };
}

export function recordMoraleRoll(card, rowId, { total, natural, degree, read = null }) {
    return { ...card, rows: card.rows.map((row) => (row.id === rowId ? { ...row, total, natural, degree, ...(read && row.read ? { read: { ...row.read, ...read } } : {}) } : row)) };
}

// M38: a yield accepted or refused.
export function settleYield(card, rowId, status) {
    return { ...card, yields: (card.yields ?? []).map((entry) => (entry.id === rowId ? { ...entry, status } : entry)) };
}

const MARKERS = { yields: { slug: "yielding-morale", name: "Yielding" }, leaves: { slug: "leaving-morale", name: "Leaving" } };
export const MORALE_MARKERS = Object.freeze({ yielding: "yielding-morale", leaving: "leaving-morale", surrendered: "surrendered-morale", toTheDeath: "to-the-death-morale" });

// What Apply does in Foundry for a result: [{ op, … }].
//   frightened: { delta } or { atLeast }; condition: { slug } (on); surrender; berserk.
export function outcomeOps(outcome) {
    switch (outcome?.kind) {
        case "steady":
            return [{ op: "frightened", delta: -1 }];
        case "frighten":
            return [{ op: "frightened", delta: 1, max: 4 }];
        case "yields":
            return [{ op: "marker", ...MARKERS.yields }];
        case "leaves":
            return [{ op: "condition", slug: "fleeing" }, { op: "marker", ...MARKERS.leaves }];
        case "giveUp":
            if (outcome.how === "collapse") return [{ op: "surrender" }];
            if (outcome.how === "berserk") return [{ op: "frightened", atLeast: 1 }, { op: "berserk" }];
            if (outcome.how === "disordered") return [{ op: "condition", slug: "fleeing" }];
            return [{ op: "condition", slug: "fleeing" }, { op: "frightened", atLeast: 2 }];
        default:
            return [];
    }
}

// The card's line for a result. lessFrightened: Bravery's (B303) — the frightened it gains that much lower, which the ability module
// applies as PF2e adds it.
export function outcomeLine(name, outcome, { lessFrightened = 0 } = {}) {
    const brave = lessFrightened ? ` (Bravery: ${lessFrightened} lower)` : "";
    switch (outcome?.kind) {
        case "steady":
            return `${name} holds firm (frightened −1).`;
        case "holds":
            return `${name} holds.`;
        case "frighten":
            return lessFrightened ? `${name} is shaken, but its Bravery holds: frightened +${Math.max(0, 1 - lessFrightened)}.` : `${name} is shaken: frightened +1.`;
        case "waver":
            return `${name} wavers.`;
        case "yields":
            return `${name} holds, but reads the fight and sees it's lost: it yields. Accept or refuse below; harming it refuses.`;
        case "leaves":
            return `${name} holds, but reads the fight and sees it's lost: it leaves (fleeing, not frightened). Move it away; attacking it as it goes (not a Reactive Strike) makes it turn and fight to the death.`;
        case "giveUp":
            if (outcome.how === "collapse") return `${name} surrenders: marked defeated. Harming it now makes it and the allies who saw fight to the death.`;
            if (outcome.how === "berserk") return `${name} goes berserk: frightened 1${brave} and −1 AC until the end of next round; it keeps fighting.`;
            if (outcome.how === "disordered") return `${name} falls back in order: fleeing. Move it away; it leaves the fight.`;
            return `${name} routs: fleeing and frightened 2${brave}. Move it away; it leaves the fight.`;
        default:
            return `${name}: nothing happens.`;
    }
}

export function moraleCardHTML(card) {
    const open = card.status === "open";
    const rows = card.rows.map((row) => {
        if (row.bossHolds) return `<li class="sim-morale-row"><strong>${escape(row.name)}</strong> <span class="sim-morale-result">Boss Resolve: holds (no roll)</span></li>`;
        const boxes = row.modifiers.map((modifier) => `<label class="sim-morale-mod"><input type="checkbox" data-sim-morale="toggle" data-row-id="${escape(row.id)}" data-mod-id="${escape(modifier.id)}"${modifier.on ? " checked" : ""}${open && row.degree === null ? "" : " disabled"}> ${escape(modifier.label)} ${signed(modifier.value)}</label>`).join("");
        const read = row.read ? ` · Perception ${row.read.degree !== null && row.read.degree !== undefined ? `${row.read.total ?? "?"}: ${DEGREES[row.read.degree]}` : `(${signed(readTotal(row))})`}` : "";
        const result = row.degree !== null
            ? `<span class="sim-morale-result">${row.total ?? "?"}: ${DEGREES[row.degree]}${read}</span>`
            : open ? `<button type="button" data-sim-morale="roll" data-row-id="${escape(row.id)}">Roll Will (${signed(rowTotal(row))})${row.read ? ` and Perception (${signed(readTotal(row))})` : ""}</button>` : "<span class=\"sim-morale-result\">not rolled</span>";
        return `<li class="sim-morale-row"><div><strong>${escape(row.name)}</strong> DC ${row.dc} ${result}</div>${boxes ? `<div class="sim-morale-mods">${boxes}</div>` : ""}</li>`;
    }).join("");
    // M38: Accept / Refuse for each creature that yielded.
    const yields = (card.yields ?? []).length
        ? `<ul class="sim-morale-yields">${card.yields.map((entry) => `<li><strong>${escape(entry.name)}</strong> yields: ${entry.status === "open" ? `<button type="button" data-sim-morale="accept" data-row-id="${escape(entry.id)}">Accept</button><button type="button" data-sim-morale="refuse" data-row-id="${escape(entry.id)}">Refuse</button>` : entry.status === "accepted" ? "accepted: it surrenders." : "refused: no quarter."}</li>`).join("")}</ul>`
        : "";
    const controls = open
        ? `<footer class="sim-morale-controls"><button type="button" data-sim-morale="roll-all"${allRolled(card) ? " disabled" : ""}>Roll the rest</button><button type="button" data-sim-morale="apply"${allRolled(card) ? "" : " disabled"}>Apply</button></footer>`
        : "";
    const results = card.results.length ? `<ul class="sim-morale-results">${card.results.map((line) => `<li>${escape(line)}</li>`).join("")}</ul>` : "";
    return `<section class="pf2e-sim-morale" data-status="${escape(card.status)}"><header><strong>Morale check</strong> <span>${escape(card.reasonLabel)}</span></header><ul class="sim-morale-rows">${rows}</ul>${results}${yields}${controls}</section>`;
}

// M38: no quarter — who now fights to the death, and why; Undo for a harm that shouldn't count (a Reactive Strike as it left).
export function noQuarterCardHTML({ name, cause, allies = [], undone = false }) {
    const why = cause === "refused" ? "the party refused its surrender" : cause === "leaving" ? "it was attacked as it left" : "it was harmed after giving up";
    const who = allies.length ? ` and ${allies.length === 1 ? "the ally" : `the ${allies.length} allies`} who saw (${allies.map((entry) => escape(entry.name)).join(", ")})` : "";
    const body = undone
        ? `<p>Undone: ${escape(name)} and the others are back as they were.</p>`
        : `<p>${escape(name)}${who} fight to the death: ${why}. They make no more morale checks this fight.</p><footer class="sim-morale-controls"><button type="button" data-sim-morale="undo-no-quarter">Undo (it didn't count, e.g. a Reactive Strike)</button></footer>`;
    return `<section class="pf2e-sim-morale" data-status="${undone ? "applied" : "open"}"><header><strong>No quarter</strong></header>${body}</section>`;
}

// How much of the side the rout needs, in words (M37: a third).
export function routShare(fraction = 0.5) {
    if (fraction <= 0.34) return "A third";
    if (fraction === 0.5) return "Half";
    return `${Math.round(fraction * 100)}%`;
}

// The rout card: enough of the surviving foes broken (the rules' fraction); the rest flee (a button), one pursuit action each.
export function routCardHTML({ rest, done = false, fraction = 0.5 }) {
    const names = rest.map((entry) => escape(entry.name)).join(", ");
    const body = done
        ? `<p>The rest flee: ${names || "none left"}.</p>`
        : `<p>${routShare(fraction)} or more of the surviving foes are broken: the rest flee${names ? ` (${names})` : ""}.</p><p>Each PC gets one pursuit action against a fleeing foe in reach. Downed foes are captured; the rest escape. End the encounter when you're ready.</p>${rest.length ? `<footer class="sim-morale-controls"><button type="button" data-sim-morale="rout">Make the rest flee</button></footer>` : ""}`;
    return `<section class="pf2e-sim-morale" data-status="${done ? "applied" : "open"}"><header><strong>The foes rout</strong></header>${body}</section>`;
}
