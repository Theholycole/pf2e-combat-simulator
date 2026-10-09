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
            total: null,
            natural: null,
            degree: null
        })),
        results: []
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

export function recordMoraleRoll(card, rowId, { total, natural, degree }) {
    return { ...card, rows: card.rows.map((row) => (row.id === rowId ? { ...row, total, natural, degree } : row)) };
}

// What Apply does in Foundry for a result: [{ op, … }].
//   frightened: { delta } or { atLeast }; condition: { slug } (on); surrender; berserk.
export function outcomeOps(outcome) {
    switch (outcome?.kind) {
        case "steady":
            return [{ op: "frightened", delta: -1 }];
        case "frighten":
            return [{ op: "frightened", delta: 1, max: 4 }];
        case "giveUp":
            if (outcome.how === "collapse") return [{ op: "surrender" }];
            if (outcome.how === "berserk") return [{ op: "frightened", atLeast: 1 }, { op: "berserk" }];
            if (outcome.how === "disordered") return [{ op: "condition", slug: "fleeing" }];
            return [{ op: "condition", slug: "fleeing" }, { op: "frightened", atLeast: 2 }];
        default:
            return [];
    }
}

// The card's line for a result.
export function outcomeLine(name, outcome) {
    switch (outcome?.kind) {
        case "steady":
            return `${name} holds firm (frightened −1).`;
        case "holds":
            return `${name} holds.`;
        case "frighten":
            return `${name} is shaken: frightened +1.`;
        case "waver":
            return `${name} wavers.`;
        case "giveUp":
            if (outcome.how === "collapse") return `${name} surrenders: marked defeated.`;
            if (outcome.how === "berserk") return `${name} goes berserk: frightened 1 and −1 AC until the end of next round; it keeps fighting.`;
            if (outcome.how === "disordered") return `${name} falls back in order: fleeing. Move it away; it leaves the fight.`;
            return `${name} routs: fleeing and frightened 2. Move it away; it leaves the fight.`;
        default:
            return `${name}: nothing happens.`;
    }
}

export function moraleCardHTML(card) {
    const open = card.status === "open";
    const rows = card.rows.map((row) => {
        if (row.bossHolds) return `<li class="sim-morale-row"><strong>${escape(row.name)}</strong> <span class="sim-morale-result">Boss Resolve: holds (no roll)</span></li>`;
        const boxes = row.modifiers.map((modifier) => `<label class="sim-morale-mod"><input type="checkbox" data-sim-morale="toggle" data-row-id="${escape(row.id)}" data-mod-id="${escape(modifier.id)}"${modifier.on ? " checked" : ""}${open && row.degree === null ? "" : " disabled"}> ${escape(modifier.label)} ${signed(modifier.value)}</label>`).join("");
        const result = row.degree !== null
            ? `<span class="sim-morale-result">${row.total ?? "?"}: ${DEGREES[row.degree]}</span>`
            : open ? `<button type="button" data-sim-morale="roll" data-row-id="${escape(row.id)}">Roll Will (${signed(rowTotal(row))})</button>` : "<span class=\"sim-morale-result\">not rolled</span>";
        return `<li class="sim-morale-row"><div><strong>${escape(row.name)}</strong> DC ${row.dc} ${result}</div>${boxes ? `<div class="sim-morale-mods">${boxes}</div>` : ""}</li>`;
    }).join("");
    const controls = open
        ? `<footer class="sim-morale-controls"><button type="button" data-sim-morale="roll-all"${allRolled(card) ? " disabled" : ""}>Roll the rest</button><button type="button" data-sim-morale="apply"${allRolled(card) ? "" : " disabled"}>Apply</button></footer>`
        : "";
    const results = card.results.length ? `<ul class="sim-morale-results">${card.results.map((line) => `<li>${escape(line)}</li>`).join("")}</ul>` : "";
    return `<section class="pf2e-sim-morale" data-status="${escape(card.status)}"><header><strong>Morale check</strong> <span>${escape(card.reasonLabel)}</span></header><ul class="sim-morale-rows">${rows}</ul>${results}${controls}</section>`;
}

// The rout card: half the surviving foes broken; the rest flee (a button), one pursuit action each.
export function routCardHTML({ rest, done = false }) {
    const names = rest.map((entry) => escape(entry.name)).join(", ");
    const body = done
        ? `<p>The rest flee: ${names || "none left"}.</p>`
        : `<p>Half the surviving foes are broken: the rest flee${names ? ` (${names})` : ""}.</p><p>Each PC gets one pursuit action against a fleeing foe in reach. Downed foes are captured; the rest escape. End the encounter when you're ready.</p>${rest.length ? `<footer class="sim-morale-controls"><button type="button" data-sim-morale="rout">Make the rest flee</button></footer>` : ""}`;
    return `<section class="pf2e-sim-morale" data-status="${done ? "applied" : "open"}"><header><strong>The foes rout</strong></header>${body}</section>`;
}
