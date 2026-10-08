// HTML for reports. Pure functions of the report data.

export function escape(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const pct = (value) => (value === null || value === undefined ? "—" : `${Math.round(value * 100)}%`);
const signedPts = (value) => (value === null || value === undefined ? "—" : `${value >= 0 ? "+" : "−"}${Math.abs(value * 100).toFixed(1)} pts`);
const num = (value, digits = 1) => (value === null || value === undefined ? "—" : value.toFixed(digits));
const signed = (value, digits = 1) => (value === null || value === undefined ? "—" : `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`);

const OUTCOME_LABELS = {
    decisive: "Victory (decisive)",
    rout: "Victory (rout)",
    survived: "Survived (objective)",
    held: "Held the area (objective)",
    escaped: "Got away (objective)",
    retreat: "Party retreat",
    defeat: "Defeat",
    timeout: "Timeout (20 rounds)"
};

function verdict(winRate) {
    if (winRate >= 0.95) return ["safe", "The party should win comfortably."];
    if (winRate >= 0.8) return ["fair", "A real fight, but the party is favoured."];
    if (winRate >= 0.55) return ["risky", "Risky: a bad run of dice could go wrong."];
    if (winRate >= 0.3) return ["deadly", "Deadly: roughly a coin flip or worse."];
    return ["lethal", "Very likely to go badly for the party."];
}

const LEANS = {
    party: "Results probably lean towards the party.",
    foes: "Results probably lean towards the foes.",
    both: "Missing pieces cut both ways."
};

function renderReliability(reliability) {
    if (!reliability || reliability.level === "high") return "";
    const title = reliability.level === "low" ? "Low confidence" : "Some uncertainty";
    return `<div class="sim-reliability level-${reliability.level}"><strong>${title}.</strong> ${escape(LEANS[reliability.leans] ?? "")}
        <ul>${reliability.reasons.map((reason) => `<li>${escape(reason)}</li>`).join("")}</ul></div>`;
}

export function renderSummary(report) {
    const [tone, text] = verdict(report.winRate);
    const [low, high] = report.winInterval;
    const threat = report.threat ? `<span class="sim-threat threat-${report.threat.key}" title="PF2e's encounter rating: ${report.threat.xp} XP for ${report.threat.partySize} PCs of level ${report.threat.partyLevel}">PF2e: ${escape(report.threat.label)} (${report.threat.xp} XP)</span>` : "";
    return `
    <div class="sim-headline tone-${tone}">
        <div class="big">${pct(report.winRate)}</div>
        <div><strong>Party wins</strong> ${threat} <span class="muted">(95% range ${pct(low)}–${pct(high)}, ${report.runs} fights)</span><br>${escape(text)}</div>
    </div>
    ${renderReliability(report.reliability)}
    <div class="sim-stats">
        ${report.objectiveRate !== null ? `<div><span class="label">Objective</span><span class="value">${pct(report.objectiveRate)}</span></div>` : ""}
        <div><span class="label">Any PC goes down</span><span class="value">${pct(report.anyPcDown)}</span></div>
        <div><span class="label">Any PC dies</span><span class="value">${pct(report.anyPcDeath)}</span></div>
        <div><span class="label">Rounds (won fights)</span><span class="value">${num(report.averageWinRounds)}</span></div>
    </div>`;
}

export function renderReport(report) {
    const outcomes = Object.entries(report.outcomes)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => `<tr><td>${escape(OUTCOME_LABELS[key] ?? key)}</td><td class="num">${pct(value)}</td></tr>`).join("");
    const party = report.party.map((c) => `<tr><td>${escape(c.name)}</td><td class="num">${pct(c.down)}</td><td class="num">${c.kind === "pc" ? pct(c.dead) : "—"}</td></tr>`).join("");
    const foes = [...report.foes].sort((a, b) => b.damage - a.damage).map((c) => `
        <tr${report.mostDangerous?.id === c.id ? ' class="danger"' : ""}><td>${escape(c.name)}${report.mostDangerous?.id === c.id ? ' <span class="badge">most dangerous</span>' : ""}</td>
        <td class="num">${num(c.damage, 0)}</td><td class="num">${num(c.pcsDowned, 2)}</td><td class="num">${pct(c.dead)}</td><td class="num">${pct(c.fled)}</td><td class="num">${pct(c.surrendered + c.captured)}</td></tr>`).join("");
    return `
    ${renderSummary(report)}
    <div class="sim-columns">
        <section><h3>Outcomes</h3><table>${outcomes}</table>
            <p class="muted">Average ${num(report.averageRounds)} rounds. Morale checks per fight ${num(report.moraleChecks, 2)}, breaks ${num(report.moraleBreaks, 2)}, fights ended by a rout ${pct(report.groupRoutRate)}. Hero points spent per fight ${num(report.heroPointsSpent, 2)}.</p>
        </section>
        <section><h3>Party</h3><table><thead><tr><th></th><th>Down</th><th>Dies</th></tr></thead>${party}</table></section>
    </div>
    <section><h3>Foes</h3><table><thead><tr><th></th><th>Damage / fight</th><th>PCs downed</th><th>Killed</th><th>Fled</th><th>Gave up</th></tr></thead>${foes}</table></section>
    ${renderGaps(report.gaps)}
    ${report.sampleLog ? `<details class="sim-log"><summary>Sample fight</summary><pre>${escape(report.sampleLog.join("\n"))}</pre></details>` : ""}
    <p class="muted">Simulated in ${Math.round(report.elapsedMs ?? 0)} ms. Spells are cast where the resolution core can resolve them (saves and spell attacks so far); healing and class features aren't simulated yet. See gaps.</p>`;
}

export function renderGaps(gaps) {
    if (!gaps?.length) return "";
    const rows = gaps.slice(0, 80).map((gap) => `<tr><td>${escape(gap.kind)}</td><td>${escape(gap.name)}</td><td>${escape(gap.actors.join(", "))}</td></tr>`).join("");
    return `<details class="sim-gaps"><summary>Not simulated yet (${gaps.length})</summary>
        <p class="muted">These abilities exist on the creatures but the simulator ignores them, so results lean towards whichever side they would help.</p>
        <table><thead><tr><th>Kind</th><th>Name</th><th>On</th></tr></thead>${rows}</table></details>`;
}

export function renderCompare(entries) {
    const header = entries.map((entry) => `<th>${escape(entry.name)}</th>`).join("");
    const row = (label, pick, format, delta) => `<tr><td>${escape(label)}</td>${entries.map((entry, index) => `<td class="num">${format(pick(entry.report))}${index > 0 && delta ? ` <span class="delta">${delta(entry.delta)}</span>` : ""}</td>`).join("")}</tr>`;
    return `
    <h3>Compare <span class="muted">(${entries[0].report.runs} fights each, same dice)</span></h3>
    <table class="sim-compare"><thead><tr><th></th>${header}</tr></thead>
        ${row("Party wins", (r) => r.winRate, pct, (d) => signedPts(d.winRate))}
        ${row("Objective", (r) => r.objectiveRate, pct, (d) => (d.objectiveRate === null ? "" : signedPts(d.objectiveRate)))}
        ${row("Any PC goes down", (r) => r.anyPcDown, pct, (d) => signedPts(d.anyPcDown))}
        ${row("Any PC dies", (r) => r.anyPcDeath, pct, (d) => signedPts(d.anyPcDeath))}
        ${row("Rounds", (r) => r.averageRounds, (v) => num(v), (d) => signed(d.averageRounds))}
        ${row("Rounds (won fights)", (r) => r.averageWinRounds, (v) => num(v), (d) => signed(d.averageWinRounds))}
        ${row("Hero points spent", (r) => r.heroPointsSpent, (v) => num(v, 2), null)}
        ${row("Fights ended by a rout", (r) => r.groupRoutRate, pct, null)}
    </table>`;
}

// "What would change the odds?": each standard adjustment and its effect.
export function renderAdjustments(data) {
    const rows = data.rows.map((row) => `<tr><td>${escape(row.name)}</td><td class="num">${pct(row.winRate)}</td><td class="num"><span class="delta">${signedPts(row.winChange)}</span></td>${data.base.objectiveRate !== null ? `<td class="num">${pct(row.objectiveRate)}</td>` : ""}<td class="num">${pct(row.anyPcDown)}</td></tr>`).join("");
    return `
    <h3>What would change the odds <span class="muted">(${data.runs} fights each, same dice)</span></h3>
    <p>As it is, the party wins <strong>${pct(data.base.winRate)}</strong>${data.base.objectiveRate !== null ? ` and completes the objective ${pct(data.base.objectiveRate)}` : ""}. Elite and Weak are PF2e's standard adjustments (±2 to AC, attacks, saves and damage, plus or minus HP by level) applied to every foe with that name.</p>
    <table><thead><tr><th>Change</th><th>Party wins</th><th>Change</th>${data.base.objectiveRate !== null ? "<th>Objective</th>" : ""}<th>A PC goes down</th></tr></thead>${rows}</table>
    <p class="muted">With ${data.runs} fights a change, differences under about 8 points can be noise.</p>`;
}

const OUTCOME_SHORT = { decisive: "Won", rout: "Won (rout)", survived: "Survived", held: "Held the area", escaped: "Got away", retreat: "Retreated", defeat: "Defeated" };

const MIN_FIGHTS_FOR_SKILL = 5;

function skillSentence(score, what) {
    if (!score) return "";
    if (score.count < MIN_FIGHTS_FOR_SKILL) return `<p>${escape(what)}: predicted ${pct(score.predicted)} on average, actually ${pct(score.actual)}. Accuracy is judged once there are at least ${MIN_FIGHTS_FOR_SKILL} fights with a prediction.</p>`;
    if (score.skill === null) return `<p>${escape(what)}: every logged fight had the same result, so there's nothing to compare against yet.</p>`;
    const percent = Math.round(Math.abs(score.skill) * 100);
    const better = score.skill >= 0 ? `${percent}% better than` : `${percent}% worse than`;
    return `<p>${escape(what)}: predicted ${pct(score.predicted)} on average, actually ${pct(score.actual)}. The predictions were <strong>${better}</strong> always guessing the overall rate (Brier score ${score.brier.toFixed(3)} against ${score.baseline.toFixed(3)}).</p>`;
}

function bucketTable(buckets, outcomeLabel) {
    const rows = buckets.filter((bucket) => bucket.count).map((bucket) => `<tr><td>${escape(bucket.label)}</td><td class="num">${bucket.count}</td><td class="num">${pct(bucket.predicted)}</td><td class="num">${pct(bucket.actual)}</td></tr>`).join("");
    return rows ? `<table><thead><tr><th>When it predicted</th><th>Fights</th><th>Average prediction</th><th>${escape(outcomeLabel)}</th></tr></thead>${rows}</table>` : "";
}

// The real-fight log: predictions against what happened at the table.
export function renderFightLog(entries, calibration, { onlyReliable = false } = {}) {
    if (!entries.length) {
        return `<p>No real fights logged yet.</p><p class="muted">When an encounter with a player-owned PC ends, you'll be asked how it went. The odds are predicted silently when it begins, so the two can be compared here. You can switch this off in the module settings.</p>`;
    }
    const surprises = new Set(calibration.surprises);
    const rows = [...entries].reverse().map((entry) => {
        const p = entry.prediction;
        const down = entry.actual.pcs.filter((pc) => pc.down).map((pc) => pc.name + (pc.died ? " (died)" : "")).join(", ") || "none";
        return `<tr${surprises.has(entry.id) ? ' class="danger"' : ""}>
            <td>${escape(entry.date.slice(0, 10))}</td>
            <td>${escape(entry.scene)}${surprises.has(entry.id) ? ' <span class="badge">surprise</span>' : ""}${entry.notes ? `<br><span class="muted">${escape(entry.notes)}</span>` : ""}</td>
            <td>${escape(p?.threat?.label ?? "—")}${p?.reliability && p.reliability !== "high" ? ` <span class="gap-badge" title="Reliability of the prediction">${escape(p.reliability)}</span>` : ""}</td>
            <td class="num">${p ? pct(p.winRate) : "—"}</td>
            <td>${escape(OUTCOME_SHORT[entry.actual.outcome] ?? entry.actual.outcome)}${entry.actual.objective ? ` · objective ${escape(entry.actual.objective === "success" ? "done" : "missed")}` : ""}</td>
            <td class="num">${p ? pct(p.anyPcDown) : "—"}</td>
            <td>${escape(down)}</td>
            <td class="num">${entry.actual.rounds}${p?.averageRounds ? ` <span class="muted">/ ${p.averageRounds.toFixed(1)}</span>` : ""}</td>
            <td><button type="button" data-action="deleteEntry" data-id="${escape(entry.id)}" title="Remove from the log"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    }).join("");
    const few = calibration.withPrediction < 10 ? `<p class="muted">With only ${calibration.withPrediction} predicted fight${calibration.withPrediction === 1 ? "" : "s"} these numbers will move a lot; about 20 or more start to mean something.</p>` : "";
    return `
    <div class="sim-stats">
        <div><span class="label">Fights logged</span><span class="value">${calibration.logged}</span></div>
        <div><span class="label">With a prediction</span><span class="value">${calibration.withPrediction}</span></div>
        <div><span class="label">Party won (predicted)</span><span class="value">${calibration.win ? `${pct(calibration.win.actual)} <span class="muted">(${pct(calibration.win.predicted)})</span>` : "—"}</span></div>
        <div><span class="label">A PC went down (predicted)</span><span class="value">${calibration.pcDown ? `${pct(calibration.pcDown.actual)} <span class="muted">(${pct(calibration.pcDown.predicted)})</span>` : "—"}</span></div>
    </div>
    <label class="check"><input type="checkbox" data-action="toggleReliable" ${onlyReliable ? "checked" : ""}> Leave out low-confidence predictions</label>
    ${few}
    <section><h3>Who wins</h3>${skillSentence(calibration.win, "Party wins")}${bucketTable(calibration.winBuckets, "Party actually won")}</section>
    <section><h3>A PC goes down</h3>${skillSentence(calibration.pcDown, "A PC goes down")}${bucketTable(calibration.pcDownBuckets, "A PC actually went down")}</section>
    <section><h3>Fights</h3>
        <table class="sim-fight-log"><thead><tr><th>Date</th><th>Where</th><th>PF2e</th><th>Predicted win</th><th>Result</th><th>Predicted PC down</th><th>PCs down</th><th>Rounds / predicted</th><th></th></tr></thead>${rows}</table>
        <p class="muted">"Surprise" marks fights the prediction got badly wrong (it gave the actual result less than a 30% chance).</p>
    </section>`;
}

export function renderMoraleImpact(data) {
    const rows = data.rules.map((rule) => `<tr${rule.flagged ? ' class="danger"' : ""}><td>${escape(rule.name)}${rule.flagged ? ' <span class="badge">changes outcomes</span>' : ""}</td><td class="num">${signedPts(rule.winRateChange)}</td><td class="num">${signed(-rule.roundsChange, 2)}</td></tr>`).join("");
    const effect = data.moraleEffect;
    return `
    <h3>Morale rule impact <span class="muted">(${data.runs} fights per variant, same dice)</span></h3>
    <p>With morale on, the party wins <strong>${signedPts(effect.winRate)}</strong> more often and won fights take <strong>${signed(effect.averageWinRounds, 2)}</strong> rounds.</p>
    <table><thead><tr><th>Rule</th><th>Win rate it adds</th><th>Rounds it adds</th></tr></thead>${rows}</table>
    <p class="muted">Each row compares the full rules with that one rule switched off. Flagged rules move the win rate by more than 2 points. With ${data.runs} fights a variant, differences under about 3 points can be noise.</p>`;
}
