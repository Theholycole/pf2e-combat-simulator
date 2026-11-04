// Feats that combo (2026-11-02, Cole: "look for any feats that appear to combo well together. after the current rating test the feat
// combos"). The feat ratings' method (tools/lib/feat-power.mjs): whole fights on the same dice, the gap in levels of the foes.
//
//   Candidates: two feats the simulator plays, on the same PC (a class's two feats, or a class's and one of no class), where one sets up
//   what the other uses —
//     a condition one puts on a foe (frightened, off-guard, prone, grabbed …) and the other needs or does more against (its requirement,
//     its trigger, "against a frightened creature", a rule's "target:condition:…" predicate);
//     a feat and one that names it as a prerequisite (Orc Ferocity and Rampaging Ferocity).
//   The test, at the higher of their levels on that PC: A alone, B alone, and both, each against the plain party. The combo's synergy is
//   both − A − B: above 0, they're worth more together than apart.
const lib = await import("./feat-power.mjs");

export const CONDITIONS = Object.freeze(["frightened", "off-guard", "prone", "grabbed", "restrained", "immobilized", "clumsy", "enfeebled", "stupefied", "slowed", "stunned", "dazzled", "blinded", "sickened", "drained", "persistent", "bleed"]);
const WORD = { "off-guard": "(?:off-guard|flat-footed)", persistent: "persistent (?:\\w+ )?damage", bleed: "persistent bleed|bleed damage" };
const wordOf = (condition) => WORD[condition] ?? condition;
const plainText = (doc) => String(doc.system?.description?.value ?? "").replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@UUID\[[^\]]*?\.([^.\]]+)\]/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// What a feat puts on foes: the conditions its compiled plan applies (its outcomes' slugs), and its text's ("the target becomes frightened 1",
// "knock it prone").
export function produces(doc, plan) {
    const json = JSON.stringify(plan ?? {});
    const text = plainText(doc);
    const found = new Set();
    for (const condition of CONDITIONS) {
        const word = wordOf(condition);
        if (new RegExp(`"(?:slug|condition|name)":"${condition}"`, "i").test(json)) found.add(condition);
        else if (new RegExp(`(?:becomes?|is|are|knock(?:s|ed)?(?: \\w+)?|falls?|left|gets?|takes?|deals?|knocked)\\b[^.]{0,30}\\b${word}`, "i").test(text)) found.add(condition);
    }
    return found;
}

// What a feat needs or does more with: a condition in its requirement or trigger, "against a frightened creature", "if the target is prone",
// "a grabbed foe", or its rules' predicates on the target's condition.
export function consumes(doc) {
    const text = plainText(doc);
    const rules = JSON.stringify(doc.system?.rules ?? []);
    const found = new Set();
    const head = /(?:Requirements?|Trigger)\s+([^.]*)/gi;
    const heads = [...text.matchAll(head)].map((hit) => hit[1]).join(" ");
    for (const condition of CONDITIONS) {
        const word = wordOf(condition);
        if (new RegExp(`target:condition:${condition}`).test(rules)) found.add(condition);
        // (Damage over time a feat "uses" is most often its own — "deals persistent bleed damage" —: only from its rules.)
        else if (["persistent", "bleed"].includes(condition)) continue;
        else if (new RegExp(`\\b${word}`, "i").test(heads)) found.add(condition);
        else if (new RegExp(`(?:against|to|on|at) (?:a|an|the|any|each)? ?(?:creature|target|foe|enemy|opponent)?[^.]{0,20}(?:that|who) (?:is|are) (?:already )?${word}|(?:against|attack|Strike|hit)[^.]{0,30}\\b${word} (?:creature|target|foe|enemy|opponent)|if (?:the|your|that) (?:target|creature|foe|enemy) (?:is|was) (?:already )?${word}|${word} (?:creature|target|foe|enemy|opponent)s?\\b`, "i").test(text)) found.add(condition);
    }
    return found;
}

const prerequisites = (doc) => (doc.system?.prerequisites?.value ?? []).map((entry) => String(entry?.value ?? entry).toLowerCase().trim());
const classOf = (ref) => ref.traits.find((trait) => ["fighter", "rogue", "wizard", "cleric"].includes(trait)) ?? null;

// The candidate pairs from the feat ratings' screen rows (rated ones): [{ a, b, why, level, host }], best-rated first, at most max.
export function comboCandidates(rows, { max = 150, perFeat = 3, topPerHost = 8 } = {}) {
    const rated = rows.filter((row) => !row.skipped && !row.error && Number.isFinite(row.levels) && !row.loadout);
    const entries = [];
    for (const row of rated) {
        const doc = lib.docsOf(row.ref.path).get(row.ref.id);
        if (!doc) continue;
        let plan = null;
        try {
            plan = lib.partyWithFeat(doc, row.level).plan ?? null;
        } catch {
            plan = null;
        }
        entries.push({ row, doc, makes: produces(doc, plan), needs: consumes(doc), prereqs: prerequisites(doc), cls: classOf(row.ref) });
    }
    const pairs = new Map();
    const add = (a, b, why) => {
        if (a === b) return;
        // (The same PC: a class's own two feats, or one of no class with it — on the class feat's PC.)
        if (a.cls && b.cls && a.cls !== b.cls) return;
        if (a.row.host !== b.row.host && a.cls && b.cls) return;
        const host = a.cls ? a.row.host : b.cls ? b.row.host : a.row.host;
        const key = [a.row.ref.ref, b.row.ref.ref].sort().join("+");
        const pair = pairs.get(key) ?? { a: a.row, b: b.row, why: [], level: Math.max(a.row.level, b.row.level), host };
        if (!pair.why.includes(why)) pair.why.push(why);
        pairs.set(key, pair);
    };
    const byName = new Map(entries.map((entry) => [entry.doc.name.toLowerCase(), entry]));
    for (const b of entries) {
        for (const name of b.prereqs) {
            const a = byName.get(name);
            if (a) add(a, b, `${b.doc.name} builds on ${a.doc.name}`);
        }
        if (!b.needs.size) continue;
        for (const a of entries) {
            if (a === b) continue;
            const shared = [...b.needs].filter((condition) => a.makes.has(condition));
            if (shared.length) add(a, b, `${a.doc.name} makes the foe ${shared.join(", ")}, which ${b.doc.name} uses`);
        }
    }
    // (And the strongest feats of each PC two by two — top of each PC's list —: whether strong feats stack or get in each other's way, the
    // PC's actions shared.)
    for (const host of ["fighter", "rogue", "wizard", "cleric"]) {
        const top = entries.filter((entry) => entry.row.host === host && entry.row.levels > 0.02 && !entry.row.situational).sort((x, y) => y.row.levels - x.row.levels).slice(0, topPerHost);
        for (const [index, a] of top.entries()) for (const b of top.slice(index + 1)) add(a, b, `two of the ${host}'s strongest feats`);
    }
    // (A feat built on another where either does something here; a dedication that holds nothing alone is no combo.)
    for (const [key, pair] of pairs) if (pair.why.every((why) => /builds on/.test(why)) && Math.max(pair.a.levels, pair.b.levels) < 0.02) pairs.delete(key);
    // (Best first: the pair's own ratings, the feat that uses the setup weighted as it's the one a combo lifts.)
    const value = (pair) => Math.max(0, pair.a.levels) + Math.max(0, pair.b.levels) + (pair.why.some((why) => /builds on/.test(why)) ? 0.05 : 0);
    // (At most perFeat pairs for any one feat: Head Stomp uses what twenty feats make, and three of them say whether it combos.)
    const count = new Map();
    const chosen = [];
    for (const pair of [...pairs.values()].sort((x, y) => value(y) - value(x))) {
        const refs = [pair.a.ref.ref, pair.b.ref.ref];
        const strong = pair.why.every((why) => /strongest/.test(why));
        if (!strong && refs.some((ref) => (count.get(ref) ?? 0) >= perFeat)) continue;
        for (const ref of refs) count.set(ref, (count.get(ref) ?? 0) + 1);
        chosen.push(pair);
        if (chosen.length >= max) break;
    }
    return chosen;
}

// A feat alone on a PC at a level (a combo's level may be above the feat's own), or two together: the feat ratings' fights.
// task: { kind: "single", ref, level, host } | { kind: "pair", a, b, level, host, why }.
export function comboTask(task) {
    const docOf = (ref) => lib.docsOf(ref.path).get(ref.id);
    if (task.kind === "single") {
        const doc = docOf(task.ref);
        const head = { kind: "single", key: singleKey(task), name: task.ref.name, ref: task.ref.ref, level: task.level, host: task.host };
        const built = lib.partyWithFeat(doc, task.level, { hostId: task.host });
        if (built.skipped || built.loadout) return { ...head, skipped: true, reason: built.reason ?? "a loadout" };
        return { ...head, ...lib.partyRating(built.party, task.level, [doc.name]) };
    }
    const docA = docOf(task.a);
    const docB = docOf(task.b);
    const head = { kind: "pair", a: task.a.name, b: task.b.name, keys: [singleKey({ ref: task.a, level: task.level, host: task.host }), singleKey({ ref: task.b, level: task.level, host: task.host })], level: task.level, host: task.host, why: task.why };
    const one = lib.partyWithFeat(docA, task.level, { hostId: task.host });
    if (one.skipped || one.loadout) return { ...head, skipped: true, reason: one.reason ?? "a loadout" };
    const both = lib.partyWithFeat(docB, task.level, { hostId: task.host, party: one.party });
    if (both.skipped || both.loadout) return { ...head, skipped: true, reason: both.reason ?? "a loadout" };
    return { ...head, ...lib.partyRating(both.party, task.level, [docA.name, docB.name]) };
}
export const singleKey = (task) => `${task.ref.ref}|${task.level}|${task.host}`;

// The tasks for candidate pairs: each pair, and each feat alone at the pair's level on its PC (once).
export function comboTasks(pairs, scalePath) {
    const singles = new Map();
    const tasks = [];
    for (const pair of pairs) {
        for (const row of [pair.a, pair.b]) {
            const single = { kind: "single", ref: row.ref, level: pair.level, host: pair.host, scalePath };
            singles.set(singleKey(single), single);
        }
        tasks.push({ kind: "pair", a: pair.a.ref, b: pair.b.ref, level: pair.level, host: pair.host, why: pair.why, scalePath });
    }
    return [...singles.values(), ...tasks];
}

export function runComboTask(task) {
    if (task.scalePath) lib.loadScaleOnce(task.scalePath);
    return comboTask(task);
}

// The combos' table: synergy = both − A − B, with its margin. { markdown, json }.
export function comboReport(rows) {
    const singles = new Map(rows.filter((row) => row.kind === "single" && !row.skipped && !row.error).map((row) => [row.key, row]));
    const signed = (value) => (Math.round(value * 100) === 0 ? "0.00" : `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`);
    const rated = [];
    const skipped = [];
    for (const row of rows.filter((each) => each.kind === "pair")) {
        const [a, b] = row.keys.map((key) => singles.get(key));
        if (row.skipped || row.error || !a || !b) {
            skipped.push({ a: row.a, b: row.b, reason: row.reason ?? row.error ?? "a feat alone didn't play" });
            continue;
        }
        const synergy = row.levels - a.levels - b.levels;
        const se = Math.sqrt(row.se ** 2 + a.se ** 2 + b.se ** 2);
        const verdict = Math.abs(synergy) < Math.max(0.03, 2 * se) ? "no clear combo" : synergy > 0 ? "combo" : "get in each other's way";
        rated.push({ a: row.a, b: row.b, host: row.host, level: row.level, why: row.why, both: row.levels, aAlone: a.levels, bAlone: b.levels, synergy, se, verdict, uses: row.uses });
    }
    rated.sort((x, y) => y.synergy - x.synergy);
    const line = (row, index) => `| ${index + 1} | ${row.a} + ${row.b} | ${row.host}, ${row.level} | ${signed(row.both)} | ${signed(row.aAlone)} | ${signed(row.bAlone)} | ${signed(row.synergy)} ± ${row.se.toFixed(2)} | ${row.verdict} | ${row.why.join("; ")} |`;
    const now = new Date().toISOString().slice(0, 10);
    const markdown = [
        "# Feat combos in combat",
        "",
        `Made by \`node tools/combo-power.mjs <out> find|run|report\` on ${now}. Two feats the simulator plays, on the same PC, where one sets up what the other uses (a condition one puts on a foe and the other needs or does more against; a feat built on another), and each PC's strongest feats two by two. Each pair at the higher of the two feats' levels: the first alone, the second alone, and both, each in whole fights against the plain party on the same dice (the feat ratings' method, in levels of the foes).`,
        "",
        "**Synergy** is both together minus each alone: above 0, they're worth more together than apart; below 0, they overlap or compete for the PC's actions.",
        "",
        "| # | Feats | PC, level | Together | First alone | Second alone | Synergy | Verdict | Why paired |",
        "|---:|---|---|---:|---:|---:|---:|---|---|",
        ...rated.map(line),
        "",
        `Not tested: ${skipped.length} pairs (${[...new Set(skipped.map((row) => row.reason))].slice(0, 6).join("; ")}).`,
        ""
    ].join("\n");
    return { markdown, json: { version: 1, generated: now, rated, skipped } };
}
