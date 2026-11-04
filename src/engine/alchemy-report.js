// The alchemical advice for a monster (alchemy.js rankItems) in words: markdown for the Node tool, HTML for the live module's window.
const pct = (value) => `${Math.round(value * 100)}%`;
const iwr = (list) => (list ?? []).map((entry) => `${entry.type}${entry.value != null ? ` ${entry.value}` : ""}`).join(", ") || "none";

export function adviceSummary(creature, numbers) {
    return {
        alchemist: `A level ${numbers.level} alchemist: bombs +${numbers.bomb} before the bomb's item bonus, class DC ${numbers.classDC}${numbers.powerfulAlchemy ? " (Powerful Alchemy: Quick Alchemy items use it)" : ""}.`,
        creature: `${creature.name}: AC ${creature.ac}, Fortitude +${creature.saves?.fortitude ?? 0}, Reflex +${creature.saves?.reflex ?? 0}, Will +${creature.saves?.will ?? 0}. Weaknesses: ${iwr(creature.weaknesses)}. Resistances: ${iwr(creature.resistances)}. Immunities: ${(creature.immunities ?? []).join(", ") || "none"}.`
    };
}

// Useful (some power) and the ones that do nothing to it.
export function adviceSplit(rows) {
    return { useful: rows.filter((row) => row.power > 0), useless: rows.filter((row) => row.power <= 0) };
}

export function adviceMarkdown(creature, numbers, rows, { top = 12 } = {}) {
    const { alchemist, creature: about } = adviceSummary(creature, numbers);
    const { useful, useless } = adviceSplit(rows);
    const cell = (text) => String(text ?? "").replace(/\|/g, "/");
    return [
        `# Alchemical items against ${creature.name} (level ${creature.level})`,
        "",
        alchemist,
        about,
        "",
        "Power: the simulator's own worth of one use on this monster (damage after its immunities, weaknesses and resistances; conditions at the simulator's worth for them), as a share of beating it. Per action counts Quick Alchemy's action.",
        "",
        "| # | Item | Targets | Lands | Power | Per action | Weakness, resistance | Also |",
        "|---|---|---|---|---|---|---|---|",
        ...useful.slice(0, top).map((row, index) => `| ${index + 1} | ${cell(row.item.name)} | ${cell(row.targets)} | ${pct(row.chance)} | ${(row.power * 100).toFixed(1)} | ${(row.perAction * 100).toFixed(1)} | ${cell(row.notes.join(", "))} | ${cell(row.effects)} |`),
        "",
        `Does nothing to it: ${useless.map((row) => row.item.name).join(", ") || "none"}.`
    ].join("\n");
}

const escape = (text) => String(text ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
export function adviceHtml(creature, numbers, rows, { top = 10 } = {}) {
    const { alchemist, creature: about } = adviceSummary(creature, numbers);
    const { useful, useless } = adviceSplit(rows);
    const line = (row, index) => `<tr><td>${index + 1}</td><td>${row.item.uuid ? `@UUID[${escape(row.item.uuid)}]{${escape(row.item.name)}}` : escape(row.item.name)}</td><td>${escape(row.targets)}</td><td>${pct(row.chance)}</td><td>${(row.perAction * 100).toFixed(1)}</td><td>${escape(row.notes.join(", "))}</td><td>${escape(row.effects)}</td></tr>`;
    return `<section class="alchemy-advice"><h3>${escape(creature.name)}</h3><p>${escape(about)}</p><p><em>${escape(alchemist)}</em></p>
<table><thead><tr><th>#</th><th>Item</th><th>Targets</th><th>Lands</th><th>Power per action</th><th>Weakness, resistance</th><th>Also</th></tr></thead><tbody>${useful.slice(0, top).map(line).join("")}</tbody></table>
<p><strong>Does nothing to it:</strong> ${escape(useless.map((row) => row.item.name).slice(0, 20).join(", ") || "none")}${useless.length > 20 ? "…" : ""}</p></section>`;
}
