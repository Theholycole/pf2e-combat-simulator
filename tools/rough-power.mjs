// A rough power score for everything (2026-11-03, the user: "give everything a rough value based on what has been simulated thus far.
// Things like damage, healing, action cost, conditions, the 4 degrees of success. Give all the building blocks of every ability a value then
// apply this rough power score to everything. All feats, skills, abilities, ancestries and see if the rough score aligns with things already
// tested before checking them. Once good apply the rough power score to anything not yet tested").
//   1. Building blocks: each feat, action, heritage and background is read from its own text and rules alone (the same way whether the
//      simulator played it or not) into amounts — dice of damage weighted by the four degrees of success and the targets, healing,
//      conditions by kind and value, bonuses and penalties, resistances, spells it grants, action cost, uses a fight, drawbacks. Amounts
//      are in the level's own units (damage over a moderate creature's Strike damage at that level, healing over its Hit Points), so one
//      value fits every level.
//   2. Values: a ridge regression of the simulator's whole-fight ratings (levels; tools/feat-power.mjs) on those amounts gives every block
//      a value in levels. Ancestries get their own small fit (Hit Points, Speed, size, vision, attribute boosts).
//   3. Check: 10-fold cross-validation — each tested thing scored by values fitted without it — before anything is scored blind.
//   4. Score: everything not yet tested gets value · amounts.
// Usage: node tools/rough-power.mjs [runDir=/tmp/claude-build/run] → docs/rough-power.md, docs/rough-power.json
import fs from "node:fs";
import { featRefs, docsOf } from "./lib/feat-power.mjs";
import { readDocuments, PACK_ROOT } from "./lib/pack-creatures.mjs";
import { moderate } from "../src/engine/creature-tables.js";

const RUN = process.argv[2] ?? "/tmp/claude-build/run";
const ROOT = new URL("../", import.meta.url);

// --- Text -------------------------------------------------------------------------

const level1 = (level) => Math.max(1, Math.min(20, Number(level) || 1));
// A formula's number at a level (@actor.level, @item.level, @item.rank, attribute mods), or null.
function evaluate(expr, L) {
    const text = String(expr)
        .replace(/@(?:actor|item)\.level/g, String(L))
        .replace(/@item\.rank|@spell\.rank/g, String(Math.ceil(L / 2)))
        .replace(/@actor\.abilities\.\w+\.mod|@actor\.system\.abilities\.\w+\.mod/g, "4")
        .replace(/@actor\.attributes\.classDC\.value/g, "0")
        .replace(/\b(floor|ceil|max|min|round|abs)\(/g, "Math.$1(")
        .replace(/ternary\(/g, "((c,a,b)=>c?a:b)(")
        .replace(/\bgte\(/g, "((a,b)=>a>=b)(")
        .replace(/\bgt\(/g, "((a,b)=>a>b)(")
        .replace(/\blte\(/g, "((a,b)=>a<=b)(")
        .replace(/\blt\(/g, "((a,b)=>a<b)(")
        .replace(/\beq\(/g, "((a,b)=>a==b)(");
    if (!/^[\d\s+\-*/().,?:<>=&|abcMathflorceimxnudsgt]*$/.test(text)) return null;
    try {
        const value = Function(`"use strict"; return (${text});`)();
        return Number.isFinite(value) ? value : null;
    } catch {
        return null;
    }
}

// Arithmetic with the level filled in, innermost parentheses first: "(floor((4 -4)/2)+4)d6" → "4d6".
function simplify(text, L) {
    let out = String(text)
        .replace(/@(?:actor|item)\.level|@actor\.system\.details\.level\.value/g, String(L))
        .replace(/@item\.rank|@spell\.rank/g, String(Math.ceil(L / 2)))
        .replace(/@actor\.(?:system\.)?abilities\.\w+\.mod/g, "4");
    for (let guard = 0; guard < 20; guard++) {
        const next = out.replace(/(?:\b(floor|ceil|max|min|round|abs))?\(\s*([\d\s+\-*/.,]+)\)/g, (whole, fn, inner) => {
            if (!fn && /^\s*\d+\s*$/.test(inner) && false) return inner;
            const value = evaluate(fn ? `${fn}(${inner})` : `(${inner})`, L);
            return value === null ? whole : String(fn ? value : Math.round(value * 100) / 100);
        });
        if (next === out) break;
        out = next;
    }
    return out;
}

// Inline rolls to words: @Damage[(2d6+4)[fire]] → "2d6+4 fire damage", @Check[reflex|basic] → "basic Reflex save", @UUID[..]{Name} → Name.
function plain(html, L) {
    let text = String(html ?? "").split(/<strong>\s*(?:Level \(\+|Heightened|Amp Heightened)/)[0];
    text = text.replace(/@Damage\[((?:[^\[\]]|\[[^\[\]]*\])*)\](?:\{([^}]*)\})?/g, (_, body, label) => {
        const parts = [];
        const clean = simplify(body.replace(/\|[a-z-]+:[^\[\]]*$/i, ""), L);
        for (const piece of clean.split(/,(?![^(]*\))/)) {
            const m = /^\s*(.*?)\s*\[([^\]]*)\]\s*$/.exec(piece) ?? [null, piece, ""];
            const formula = m[1].replace(/^\((.*)\)$/, "$1").replace(/@[\w.]+/g, "0");
            parts.push(`${formula} ${m[2].replace(/,/g, " ")} damage`);
        }
        return label && /\d/.test(label) ? `${label} damage` : parts.join(" plus ");
    });
    text = text.replace(/@Check\[([^\]]*)\](?:\{([^}]*)\})?/g, (_, body, label) => {
        const [type, ...rest] = body.split("|");
        const basic = rest.some((x) => /^basic(:true)?$/.test(x));
        return `${basic ? "basic " : ""}${label ?? type} ${/fortitude|reflex|will/i.test(type) ? "save" : "check"}`;
    });
    text = text.replace(/@Template\[([^\]]*)\](?:\{([^}]*)\})?/g, (_, body, label) => label ?? body.replace(/\|?distance:(\d+)/, " $1-foot").replace(/type:/, ""));
    text = text.replace(/@(?:UUID|Compendium)\[[^\]]*\]\{([^}]*)\}/g, "$1").replace(/@(?:UUID|Compendium)\[[^\]]*?([^.\]]*)\]/g, "$1");
    text = text.replace(/\[\[\/\w+\s+([^\]]*?)(?:\s*#[^\]]*)?\]\](?:\{([^}]*)\})?/g, (_, roll, label) => label ?? simplify(roll.replace(/[{}]/g, ""), L));
    text = text.replace(/<strong>\s*(Critical Success|Success|Failure|Critical Failure)\s*<\/strong>/gi, (_, degree) => ` §${degree.toLowerCase()}§ `);
    text = text.replace(/<strong>\s*(Trigger|Requirements?|Frequency|Effect|Special|Cost)\s*<\/strong>/gi, (_, label) => ` §${label.toLowerCase().replace(/s$/, "")}§ `);
    text = text.replace(/<hr\s*\/?>/g, " §hr§ ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/g, " ");
    return text.replace(/[–−—]/g, "-").replace(/\s+/g, " ").trim();
}

const mean = (count, die) => (Number(count) * (Number(die) + 1)) / 2;
// Average of every "XdY+Z" or "N <type> damage" in a piece of text.
function diceIn(text) {
    let total = 0;
    for (const m of text.matchAll(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+)(?!d))?/g)) total += mean(m[1], m[2]) + (m[3] ? (m[3] === "-" ? -1 : 1) * Number(m[4]) : 0);
    if (!total) for (const m of text.matchAll(/\b(\d+)\s+(?:persistent\s+)?(?:\w+\s+)?damage/g)) total += Number(m[1]);
    return total;
}

const HARD = { stunned: 1.6, paralyzed: 3, slowed: 1.4, confused: 1.5, fleeing: 1.6, immobilized: 0.8, restrained: 1.8, grabbed: 0.8, unconscious: 3, petrified: 3, controlled: 3, fascinated: 0.8, blinded: 1.2, quickened: -1.2 };
const SOFT = { frightened: 1, sickened: 1, clumsy: 0.8, enfeebled: 0.8, stupefied: 0.8, drained: 0.5, dazzled: 0.4, deafened: 0.2, "off-guard": 0.7, "flat-footed": 0.7, prone: 0.6, doomed: 0.3, weakness: 0.2 };
const CONDITION = new RegExp(`\\b(${[...Object.keys(HARD), ...Object.keys(SOFT)].join("|")})(?:\\s+(\\d+))?`, "gi");
const SELF = /\b(you (?:are|become|'re|’re|take|have|can't|cannot|lose)|you're|yourself)\b/i;

// The share of each degree: the target's save (a foe's) or your own check or attack.
const SAVE_DEGREES = { "critical success": 0.1, success: 0.4, failure: 0.4, "critical failure": 0.1 };
const CHECK_DEGREES = { "critical success": 0.15, success: 0.4, failure: 0.35, "critical failure": 0.1 };
const STRIKE_HIT = 0.45 + 0.1 * 2; // a hit, a critical hit's double
const BASIC_SAVE = 0.1 * 0 + 0.4 * 0.5 + 0.4 * 1 + 0.1 * 2;

const STATS = [
    ["ac", /\b(AC|Armor Class)\b/],
    ["attack", /attack rolls?|spell attack/i],
    ["damage", /damage rolls?|\bdamage\b/i],
    ["saves", /saving throws?|saves?\b|Fortitude|Reflex|Will\b/],
    ["perception", /Perception|initiative/],
    ["skill", /checks?|Athletics|Acrobatics|Stealth|Intimidation|Deception|Diplomacy|skill/],
    ["speed", /Speeds?\b/]
];

const FREQ = { round: 3, turn: 3, PT1M: 1, PT10M: 1, PT1H: 1, PT24H: 1, day: 1, PT1D: 1 };

// The building blocks of one feat, action, heritage or background.
export function blocksOf(doc, kind = "feat", { perUse = false } = {}) {
    const L = level1(doc.system?.level?.value ?? 1);
    const D = moderate("damage", L);
    const HPL = moderate("hp", L);
    const text = plain(doc.system?.description?.value, L);
    const traits = new Set(doc.system?.traits?.value ?? []);
    const actionType = doc.system?.actionType?.value ?? "passive";
    const actions = actionType === "action" ? Number(doc.system?.actions?.value ?? 1) || 1 : 0;
    const freq = doc.system?.frequency;
    const active = actionType !== "passive";
    let uses = active ? (freq ? Math.min(3, (Number(freq.max) || 1) * (FREQ[freq.per] ?? 1)) : 3) : 3;
    if (actionType === "reaction" && !freq) uses = 2;
    const fightUses = uses;
    if (perUse && active) uses = 1;
    // A spell: one cast; its area, its basic save and its damage are in its data.
    const isSpell = doc.type === "spell";
    if (isSpell) uses = 1;
    const basicSave = isSpell && !!doc.system?.defense?.save?.basic;
    const b = {};
    const add = (key, value) => {
        if (value) b[key] = (b[key] ?? 0) + value;
    };

    // The parts: the main text and the degrees.
    const sections = { main: "" };
    let current = "main";
    for (const piece of text.split(/(§[a-z ]+§)/)) {
        const m = /^§([a-z ]+)§$/.exec(piece);
        if (m) current = m[1] in SAVE_DEGREES ? m[1] : m[1] === "hr" ? "main" : current in SAVE_DEGREES ? current : "main";
        else sections[current] = (sections[current] ?? "") + " " + piece;
    }
    const main = sections.main;
    const hasDegrees = Object.keys(sections).some((key) => key in SAVE_DEGREES);
    const targetSaves = /saving throw|\bsave against|attempts? an? (?:\w+ )?(?:Fortitude|Reflex|Will)|(?:Fortitude|Reflex|Will) save/i.test(text);
    const degreeShares = targetSaves ? SAVE_DEGREES : CHECK_DEGREES;
    const strike = /\bStrikes?\b/.test(main) && active;
    const area = (isSpell && !!doc.system?.area) || /\b(emanation|burst|cone|line|each (?:enemy|creature|foe)|all (?:enemies|creatures|foes)|every (?:enemy|creature)|each adjacent|up to (?:two|three|four|\d) (?:enemies|creatures|targets))\b/i.test(text);
    const allies = /\b(allies|ally|each member|your party)\b/i.test(text);
    const minute = /\b(1 minute|10 minutes|1 hour|for the rest of the encounter|until the end of the encounter|24 hours)\b/i.test(text);
    const shortDur = /\b(until the (?:start|end) of (?:your|its|the target's|their) next turn|for 1 round)\b/i.test(text);
    const durFactor = !active ? 1 : minute ? 1 : shortDur ? 0.4 : 0.6;
    const situational = /\bwhen you\b|\bif you\b|\bagainst (?:a|an)\b|\bwhile\b/i.test(main) && !active ? 0.6 : 1;

    // Damage: a Strike's extra, a basic save's, a degree's own, persistent.
    const sentences = (part) => part.split(/(?<=[.;])\s+/);
    let strikeDamage = 0, saveDamage = 0, otherDamage = 0, persistent = 0, heal = 0, tempHp = 0, selfDamage = 0;
    for (const s of sentences(main)) {
        if (/hit points?/i.test(s) && /\b(regain|restore|heal)/i.test(s)) {
            heal += diceIn(s.replace(/\d+d\d+[^.]*damage/g, "")) || 0;
            continue;
        }
        if (/temporary hit points/i.test(s)) {
            tempHp += diceIn(s) || (/level/.test(s) ? L : 0);
            continue;
        }
        if (!/damage/i.test(s)) continue;
        const amount = diceIn(s);
        if (!amount) continue;
        if (/persistent/i.test(s)) persistent += amount;
        else if (SELF.test(s) && /\byou take\b/i.test(s)) selfDamage += amount;
        else if (/basic/i.test(s) || basicSave) saveDamage += amount * BASIC_SAVE;
        else if (strike || /additional|extra/i.test(s)) strikeDamage += amount * STRIKE_HIT;
        else otherDamage += amount * (hasDegrees ? 0 : 0.8);
    }
    for (const [degree, share] of Object.entries(degreeShares)) {
        const part = sections[degree];
        if (!part) continue;
        const ours = targetSaves ? ["failure", "critical failure"].includes(degree) || /damage/.test(part) : true;
        for (const s of sentences(part)) {
            if (/damage/i.test(s)) {
                let amount = diceIn(s);
                if (!amount && /half/i.test(s)) amount = 0;
                if (/persistent/i.test(s)) persistent += amount * share;
                else if (SELF.test(s)) selfDamage += amount * share;
                else otherDamage += amount * share;
            }
            if (/hit points?/i.test(s) && /\b(regain|restore)/i.test(s)) heal += diceIn(s) * share;
        }
        // Conditions by degree.
        for (const m of part.matchAll(CONDITION)) {
            const slug = m[1].toLowerCase();
            const value = Number(m[2]) || 1;
            const weight = (HARD[slug] ?? SOFT[slug]) * value * share * (ours ? 1 : 0.5);
            const self = SELF.test(part.slice(Math.max(0, m.index - 60), m.index)) && !targetSaves;
            if (self) add("selfCondition", (HARD[slug] ?? SOFT[slug]) * value * share);
            else add(slug in HARD ? "hardCondition" : "softCondition", weight);
        }
    }
    for (const s of sentences(main)) {
        for (const m of s.matchAll(CONDITION)) {
            const slug = m[1].toLowerCase();
            const value = Number(m[2]) || 1;
            const before = s.slice(0, m.index);
            if (/\b(isn't|is not|aren't|not|no longer|removes?|reduce|immune|can't be)\b/i.test(before.slice(-40))) continue;
            if (/\b(against|while|if|when|that is|who is|already)\b[^,]*$/i.test(before.slice(-35)) && !/becomes?|is now|are now/i.test(before.slice(-25))) continue;
            const self = SELF.test(before.slice(-50)) && !/\b(target|enemy|foe|creature)\b/i.test(before.slice(-30));
            const share = strike && /\bhit|\bdamage/i.test(s) ? 0.55 : hasDegrees ? 0.5 : 0.8;
            if (slug === "quickened") add(self || allies ? "quickened" : "hardCondition", (self || allies ? 1 : 0) * share);
            else if (self) add("selfCondition", (HARD[slug] ?? SOFT[slug]) * value);
            else add(slug in HARD ? "hardCondition" : "softCondition", (HARD[slug] ?? SOFT[slug]) * value * share * durFactor);
        }
    }

    if (isSpell && !strikeDamage && !saveDamage && !otherDamage && !heal) {
        const formulas = Object.values(doc.system?.damage ?? {});
        const amount = formulas.reduce((sum, d) => sum + diceIn(simplify(String(d.formula ?? ""), L)), 0);
        const healing = formulas.some((d) => (d.kinds ?? []).includes("healing") && !(d.kinds ?? []).includes("damage"));
        if (healing) heal += amount;
        else if (basicSave) saveDamage += amount * BASIC_SAVE;
        else if ((doc.system?.traits?.value ?? []).includes("attack")) strikeDamage += amount * STRIKE_HIT;
        else otherDamage += amount * 0.8;
    }
    const targets = area ? 2 : 1;
    add("strikeDamage", (strikeDamage / D) * uses);
    add("saveDamage", ((saveDamage / D) * uses * (area ? 1 : 1)) * (area ? 0 : 1));
    add("areaDamage", area ? ((saveDamage + otherDamage) / D) * targets * uses : 0);
    add("otherDamage", area ? 0 : (otherDamage / D) * uses);
    add("persistentDamage", (persistent / D) * 2 * uses);
    add("selfDamage", (selfDamage / D) * uses);
    add("healing", (heal / HPL) * 3 * uses * (allies ? 1.5 : 1));
    add("tempHp", (tempHp / HPL) * 3 * Math.min(uses, 2));
    for (const key of ["hardCondition", "softCondition", "selfCondition"]) if (b[key]) b[key] *= key === "selfCondition" ? Math.min(uses, 2) : uses * (area && key !== "selfCondition" ? targets : 1);

    // Bonuses and penalties: "+1 status bonus to AC", "-2 circumstance penalty to attack rolls".
    for (const m of text.matchAll(/([+-]?\s?\d+)(?:-foot)?\s+(status|circumstance|item)?\s*(bonus|penalty)\s+(?:to|on)\s+([^.;]{0,80})/gi)) {
        const value = Math.abs(Number(m[1].replace(/\s/g, "")));
        const what = m[4];
        const stat = STATS.find(([, re]) => re.test(what))?.[0];
        if (!stat || !value) continue;
        const before = text.slice(Math.max(0, m.index - 70), m.index);
        const isPenalty = m[3].toLowerCase() === "penalty";
        const onSelf = SELF.test(before) || /\byou (?:gain|get)\b/i.test(before);
        const scaled = stat === "damage" ? (value / D) * 4 : stat === "speed" ? value / 10 : value;
        const reach = (allies ? 2 : 1) * (!active ? situational : durFactor * Math.min(uses, 2) / 2);
        if (isPenalty && onSelf) add(`selfPenalty`, scaled * reach);
        else if (isPenalty) add(`foe_${stat}`, scaled * (area ? 2 : 1) * (active ? durFactor * Math.min(uses, 3) / 2 : 1));
        else add(`bonus_${stat}`, scaled * reach);
    }
    for (const m of text.matchAll(/resistance\s+(\d+)\s+to/gi)) add("resistance", (Number(m[1]) / D) * (allies ? 2 : 1) * (active ? durFactor : situational));
    for (const m of text.matchAll(/resistance to [^.]{0,40}equal to (?:half )?your level/gi)) add("resistance", ((/half/.test(m[0]) ? L / 2 : L) / D) * (active ? durFactor : 1));

    // Rules: flat modifiers, extra damage dice, resistances PF2e applies on its own.
    for (const rule of doc.system?.rules ?? []) {
        const predicated = rule.predicate?.length ? 0.5 : 1;
        if (rule.key === "FlatModifier" && typeof rule.selector === "string" || Array.isArray(rule.selector)) {
            const sel = [].concat(rule.selector ?? []).join(" ");
            const value = typeof rule.value === "number" ? rule.value : evaluate(rule.value?.toString?.() ?? "", L);
            if (!Number.isFinite(value) || !value) continue;
            const stat = /\bac\b/.test(sel) ? "ac" : /attack/.test(sel) ? "attack" : /damage/.test(sel) ? "damage" : /saving|fortitude|reflex|will/.test(sel) ? "saves" : /perception|initiative/.test(sel) ? "perception" : /speed/.test(sel) ? "speed" : /hp$/.test(sel) ? "hp" : "skill";
            const scaled = stat === "damage" ? (value / D) * 4 : stat === "speed" ? value / 10 : stat === "hp" ? (value / HPL) * 3 : value;
            add(`rule_${stat}`, scaled * predicated);
        } else if (rule.key === "DamageDice" && rule.diceNumber) {
            const n = typeof rule.diceNumber === "number" ? rule.diceNumber : evaluate(String(rule.diceNumber), L) ?? 1;
            add("rule_damageDice", (mean(n, String(rule.dieSize ?? "d6").replace("d", "")) * STRIKE_HIT / D) * 3 * predicated);
        } else if (rule.key === "Resistance") {
            const value = typeof rule.value === "number" ? rule.value : evaluate(String(rule.value ?? ""), L) ?? 0;
            add("resistance", (value / D) * predicated);
        } else if (rule.key === "BaseSpeed" || (rule.key === "FlatModifier" && /speed/.test(rule.selector))) add("movement", 0.5 * predicated);
        else if (rule.key === "Sense" && /darkvision|tremor|scent/.test(rule.selector ?? "")) add("senses", 0.5);
        else if (rule.key === "Strike") add("newStrike", 1);
        else if (rule.key === "GrantItem") add("grants", 1);
    }

    // Spells it grants or casts: their own one-cast ratings.
    const spellIds = [...String(doc.system?.description?.value ?? "").matchAll(/Compendium\.pf2e\.spells-srd\.Item\.([^\]]+)\]/g)].map((m) => SPELL_NAMES.get(m[1].toLowerCase()) ?? m[1]);
    let spellValue = 0;
    for (const id of new Set(spellIds)) spellValue += SPELLS.get(id) ?? 0;
    add("spell", spellValue * (/\b(cast|innate|once per day|spell)\b/i.test(text) ? 1 : 0.3));

    // Action economy and form.
    if (actionType === "action") add("actionsSpent", actions * uses);
    if (actionType === "reaction") add("reaction", 1);
    if (actionType === "free") add("free", 1);
    if (!active) add("passive", 1);
    add("uses", active ? uses : 0);
    const strikeCount = (/Strike twice|two Strikes|second Strike/i.test(main) ? 2 : /three Strikes/i.test(main) ? 3 : strike ? 1 : 0);
    add("strikes", strikeCount * uses);
    if (/§trigger§/.test(text)) add("trigger", 1);
    if (/§requirement§/.test(text)) add("requirement", 1);
    if (traits.has("stance")) add("stance", 1);
    if (traits.has("flourish")) add("flourish", 1);
    if (traits.has("press")) add("press", 1);
    if (traits.has("open")) add("open", 1);
    if (traits.has("incapacitation")) add("incapacitation", 1);
    if (traits.has("exploration") || traits.has("downtime") || /\bexploration\b|\bdowntime\b|\bRecall Knowledge\b/i.test(text) && !b.strikeDamage && !b.hardCondition) add("noncombat", 1);
    if (/\b(teleport|Fly|fly Speed|climb Speed|swim Speed|Step|Stride)\b/.test(text) && active) add("movement", 0.5);
    if (/\bcompanion|familiar|eidolon|summon/i.test(text)) add("companion", 1);
    if (/\breroll|roll twice|fortune\b/i.test(text) || traits.has("fortune")) add("fortune", 1);
    if (traits.has("dedication") || traits.has("archetype")) add("archetype", 1);
    if (/\bcan't use .* again|for 1 minute|once per (?:day|hour)/i.test(text) && active) add("limited", 1);
    add(`cat_${kind === "feat" ? doc.system?.category ?? doc.type : kind}`, 1);
    add("level", L / 20);
    return { L, blocks: b, text, fightUses, active };
}

// Spells' one-cast ratings (src/data/spell-ratings.json: "typical") by pf2e id.
const SPELLS = new Map();
const SPELL_ESTIMATES = new Set();
const SPELL_NAMES = new Map(readDocuments(`${PACK_ROOT}/spells`).filter((d) => d.collection === "items" && d.type === "spell").map((d) => [d.name.toLowerCase(), d._id]));
try {
    const spells = JSON.parse(fs.readFileSync(new URL("src/data/spell-ratings.json", ROOT), "utf8"));
    for (const [collection, rows] of Object.entries(spells.detail ?? {})) if (collection === "pf2e.spells-srd") for (const [id, row] of Object.entries(rows)) {
        SPELLS.set(id, Number(row.typical ?? row.boss ?? 0) || 0);
        if (row.estimate) SPELL_ESTIMATES.add(id);
    }
} catch {}

// --- Ridge regression -----------------------------------------------------------------

function solve(A, y) {
    const n = A.length;
    const M = A.map((row, i) => [...row, y[i]]);
    for (let c = 0; c < n; c++) {
        let p = c;
        for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
        [M[c], M[p]] = [M[p], M[c]];
        const pivot = M[c][c] || 1e-12;
        for (let r = 0; r < n; r++) {
            if (r === c) continue;
            const f = M[r][c] / pivot;
            if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
        }
    }
    return M.map((row, i) => row[n] / (row[i] || 1e-12));
}
// Weighted ridge: the intercept unpenalized.
function ridge(X, y, w, lambda) {
    const k = X[0].length;
    const A = Array.from({ length: k }, () => new Array(k).fill(0));
    const v = new Array(k).fill(0);
    X.forEach((row, i) => {
        for (let a = 0; a < k; a++) {
            if (!row[a]) continue;
            v[a] += w[i] * row[a] * y[i];
            for (let c = 0; c < k; c++) if (row[c]) A[a][c] += w[i] * row[a] * row[c];
        }
    });
    for (let a = 1; a < k; a++) A[a][a] += lambda;
    return solve(A, v);
}
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const pearson = (a, b) => {
    const ma = a.reduce((s, x) => s + x, 0) / a.length;
    const mb = b.reduce((s, x) => s + x, 0) / b.length;
    let num = 0, da = 0, db = 0;
    a.forEach((x, i) => {
        num += (x - ma) * (b[i] - mb);
        da += (x - ma) ** 2;
        db += (b[i] - mb) ** 2;
    });
    return num / Math.sqrt(da * db || 1);
};
const ranks = (a) => {
    const order = a.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]);
    const r = new Array(a.length);
    order.forEach(([, i], k) => (r[i] = k));
    return r;
};
const spearman = (a, b) => pearson(ranks(a), ranks(b));

// k-fold out-of-fold predictions (deterministic folds).
function crossValidate(X, y, w, lambda, folds = 10) {
    const out = new Array(y.length).fill(0);
    for (let f = 0; f < folds; f++) {
        const train = [], test = [];
        y.forEach((_, i) => ((i * 7919) % folds === f ? test : train).push(i));
        const beta = ridge(train.map((i) => X[i]), train.map((i) => y[i]), train.map((i) => w[i]), lambda);
        for (const i of test) out[i] = dot(X[i], beta);
    }
    return out;
}

// Columns scaled to unit spread before the ridge (so it shrinks every block alike), the values turned back to each block's own units.
// Amounts enter through log(1 + x): a block's tenth die is worth less than its first, and a misread number can't swamp the fit.
const squash = process.env.ROUGH_SQUASH === "0" ? (x) => x : (x) => Math.sign(x) * Math.log1p(Math.abs(x));
function fitModel(rows, keys, { lambdas = [0.1, 1, 3, 10, 30, 100, 300] } = {}) {
    const raw = rows.map((row) => keys.map((key) => squash(row.blocks[key] ?? 0)));
    const mu = keys.map((_, j) => raw.reduce((s, r) => s + r[j], 0) / raw.length);
    const sd = keys.map((_, j) => Math.sqrt(raw.reduce((s, r) => s + (r[j] - mu[j]) ** 2, 0) / raw.length) || 1);
    const X = raw.map((r) => [1, ...r.map((x, j) => (x - mu[j]) / sd[j])]);
    const y = rows.map((row) => row.levels);
    const w = rows.map((row) => 1 / (Math.max(0.01, row.se ?? 0.05) ** 2 + 0.08 ** 2));
    let best = null;
    for (const lambda of lambdas) {
        const scaled = lambda * w.reduce((s, x) => s + x, 0) / rows.length;
        const oof = crossValidate(X, y, w, scaled);
        const mae = oof.reduce((s, p, i) => s + Math.abs(p - y[i]), 0) / y.length;
        const mse = oof.reduce((s, p, i) => s + (p - y[i]) ** 2, 0) / y.length;
        if (!best || mse < best.mse) best = { lambda, scaled, oof, mae, mse };
    }
    const z = ridge(X, y, w, best.scaled);
    // Back to the blocks' own (squashed) units: value per log(1 + amount).
    const beta = [z[0] - keys.reduce((s, _, j) => s + (z[j + 1] * mu[j]) / sd[j], 0), ...keys.map((_, j) => z[j + 1] / sd[j])];
    const meanY = y.reduce((s, x) => s + x, 0) / y.length;
    const baseline = y.reduce((s, x) => s + Math.abs(x - meanY), 0) / y.length;
    return { keys, beta, lambda: best.lambda, oof: best.oof, mae: best.mae, baselineMae: baseline, r: pearson(best.oof, y), rho: spearman(best.oof, y), score: (blocks) => dot([1, ...keys.map((key) => squash(blocks[key] ?? 0))], beta) };
}

// --- The data ---------------------------------------------------------------------------

const IS_MAIN = import.meta.url === `file://${fs.realpathSync(process.argv[1] ?? "")}`;
if (IS_MAIN) {

const ratings = JSON.parse(fs.readFileSync(`${RUN}/ratings.json`, "utf8"));
const rated = new Map(ratings.rated.map((row) => [row.ref, row]));
// ROUGH_STALE=<json [{ref}]>: rated rows today's code would skip (a re-screen pending), left out.
for (const file of (process.env.ROUGH_STALE ?? "").split(",").filter(Boolean)) for (const row of JSON.parse(fs.readFileSync(file, "utf8"))) rated.delete(row.ref);
// ROUGH_OVERLAY=<screen jsonl>[,…]: newer rows (a forced re-rate still running) over the report's.
for (const file of (process.env.ROUGH_OVERLAY ?? "").split(",").filter(Boolean)) {
    for (const line of fs.readFileSync(file, "utf8").trim().split("\n")) {
        const row = JSON.parse(line);
        if (row.skipped || !row.ref?.ref) continue;
        const uses = ((row.results?.boss?.uses ?? 0) + (row.results?.group?.uses ?? 0)) / 2;
        rated.set(row.ref.ref, { ref: row.ref.ref, levels: row.levels, se: row.se, uses, forced: true });
    }
}
const ancestryRows = fs.readFileSync(`${RUN}/ancestry.jsonl`, "utf8").trim().split("\n").map((line) => JSON.parse(line));

// Feats and actions.
const things = [];
for (const ref of featRefs()) {
    const doc = docsOf(ref.path).get(ref.id);
    if (!doc) continue;
    const { L, blocks: whole, fightUses, active } = blocksOf(doc, "feat");
    const blocks = active ? blocksOf(doc, "feat", { perUse: true }).blocks : whole;
    const row = rated.get(ref.ref);
    things.push({ kind: ref.pack === "actions" ? "action" : "feat", ref: ref.ref, name: doc.name, level: L, category: doc.system?.category ?? doc.type, source: ref.source, blocks, levels: row?.levels ?? null, se: row?.se ?? null, uses: row?.uses ?? null, forced: !!row?.forced, active, fightUses, situational: row?.situational ?? false });
}
// Heritages and backgrounds: averaged over the hosts and levels the ancestry run tried.
const averaged = (kind) => {
    const by = new Map();
    for (const row of ancestryRows.filter((r) => r.kind === kind && !r.skipped)) {
        const entry = by.get(row.id) ?? { sum: 0, se2: 0, n: 0 };
        entry.sum += row.levels;
        entry.se2 += (row.se ?? 0) ** 2;
        entry.n += 1;
        by.set(row.id, entry);
    }
    return new Map([...by].map(([id, e]) => [id, { levels: e.sum / e.n, se: Math.sqrt(e.se2) / e.n }]));
};
for (const [pack, kind] of [["heritages", "heritage"], ["backgrounds", "background"]]) {
    const done = averaged(kind);
    for (const doc of readDocuments(`${PACK_ROOT}/${pack}`).filter((d) => d.collection === "items" && d.type === kind)) {
        const { L, blocks } = blocksOf(doc, kind);
        const row = done.get(doc._id);
        things.push({ kind, ref: `pf2e:${pack}:${doc._id}`, name: doc.name, level: L, category: kind, source: "pf2e", blocks, levels: row?.levels ?? null, se: row?.se ?? null });
    }
}

// Two fits. An activity (an action, reaction or free action): its value per use — the rating over the times the simulator used it a fight,
// from its blocks for one use —, then × the uses a fight its frequency allows (3 when it has none, as a fight lasts about 3 rounds). A
// passive (and a heritage or background): its whole-fight rating from its blocks.
// (A rating the simulator's AI used it in less than half a time a fight says little of its value per use: left out of the fit, scored
// like the untested. The forced re-rate — the AI made to use each activity — fills those in.)
const MIN_USES = Number(process.env.ROUGH_MIN_USES) || 0.5;
const counts = {};
for (const t of things) for (const key of Object.keys(t.blocks)) counts[key] = (counts[key] ?? 0) + 1;
const fitsActive = (t) => t.active && t.levels !== null && (t.uses ?? 0) >= MIN_USES;
const fitsPassive = (t) => !t.active && t.levels !== null;
const activeRows = things.filter(fitsActive).map((t) => Object.assign(t, { perUseLevels: t.levels / t.uses }));
const passiveRows = things.filter(fitsPassive);
const keysOf = (rows, min = 8) => {
    const c = {};
    for (const t of rows) for (const key of Object.keys(t.blocks)) if (t.blocks[key]) c[key] = (c[key] ?? 0) + 1;
    return [Object.keys(c).filter((key) => c[key] >= min).sort(), c];
};
const [ACTIVE_KEYS, activeCounts] = keysOf(activeRows);
const [PASSIVE_KEYS, passiveCounts] = keysOf(passiveRows);
const activeModel = fitModel(activeRows.map((t) => ({ blocks: t.blocks, levels: t.perUseLevels, se: (t.se ?? 0.05) / t.uses })), ACTIVE_KEYS);
const passiveModel = fitModel(passiveRows, PASSIVE_KEYS);
activeRows.forEach((t, i) => {
    t.oofPerUse = activeModel.oof[i];
    t.oof = activeModel.oof[i] * t.uses;
});
passiveRows.forEach((t, i) => (t.oof = passiveModel.oof[i]));
// The uses a fight an untested activity gets: what the simulator gave the tested ones with the same allowance (their frequency's uses).
const usesSeen = {};
for (const t of activeRows) (usesSeen[t.fightUses] ??= []).push(t.uses);
const USES = Object.fromEntries(Object.entries(usesSeen).filter(([, v]) => v.length >= 5).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
const usesFor = (t) => USES[t.fightUses] ?? t.fightUses;
for (const t of things) {
    t.perUse = t.active ? activeModel.score(t.blocks) : null;
    t.rough = t.active ? t.perUse * usesFor(t) : passiveModel.score(t.blocks);
}
const tested = [...activeRows, ...passiveRows];
const testedCounts = Object.fromEntries([...new Set([...Object.keys(activeCounts), ...Object.keys(passiveCounts)])].map((k) => [k, (activeCounts[k] ?? 0) + (passiveCounts[k] ?? 0)]));

// Ancestries: Hit Points, Speed, size, vision, boosts and flaws.
const ancestryDone = averaged("ancestry");
const ancestries = [];
for (const doc of readDocuments(`${PACK_ROOT}/ancestries`).filter((d) => d.collection === "items" && d.type === "ancestry")) {
    const s = doc.system ?? {};
    const boosts = Object.values(s.boosts ?? {}).filter((x) => (x?.value ?? []).length).length;
    const flaws = Object.values(s.flaws ?? {}).filter((x) => (x?.value ?? []).length).length;
    const blocks = { hp: (Number(s.hp) || 8) / 2, speed: ((Number(s.speed) || 25) - 25) / 5, small: s.size === "sm" || s.size === "tiny" ? 1 : 0, large: s.size === "lg" ? 1 : 0, darkvision: s.vision === "darkvision" ? 1 : 0, lowLight: s.vision === "low-light-vision" ? 1 : 0, boosts: boosts - flaws };
    const row = ancestryDone.get(doc._id);
    ancestries.push({ kind: "ancestry", ref: `pf2e:ancestries:${doc._id}`, name: doc.name, level: 1, category: "ancestry", source: "pf2e", blocks, levels: row?.levels ?? null, se: row?.se ?? null });
}
const ancestryModel = fitModel(ancestries.filter((a) => a.levels !== null), ["hp", "speed", "small", "large", "darkvision", "lowLight", "boosts"], { lambdas: [1, 3, 10, 30] });

// Spells: the same blocks against their one-cast ratings — a check that the blocks mean the same thing in another family.
const spellRows = [];
for (const doc of readDocuments(`${PACK_ROOT}/spells`).filter((d) => d.collection === "items" && d.type === "spell")) {
    if (!SPELLS.has(doc._id) || SPELL_ESTIMATES.has(doc._id)) continue;
    const rank = Number(doc.system?.level?.value ?? 1) || 1;
    const fake = { ...doc, system: { ...doc.system, level: { value: Math.max(1, rank * 2 - 1) }, actionType: { value: "action" }, actions: { value: Number(doc.system?.time?.value) || 2 } } };
    const { blocks } = blocksOf(fake, "spell");
    spellRows.push({ name: doc.name, blocks, levels: SPELLS.get(doc._id), se: 0.05 });
}
const SPELL_KEYS = Object.keys(spellRows.reduce((acc, r) => (Object.keys(r.blocks).forEach((k) => (acc[k] = (acc[k] ?? 0) + 1)), acc), {})).filter((key) => spellRows.filter((r) => r.blocks[key]).length >= 8).sort();
const spellModel = fitModel(spellRows, SPELL_KEYS);

// --- Scores and the report ---------------------------------------------------------------

for (const a of ancestries) a.rough = ancestryModel.score(a.blocks);
const testedAnc = ancestries.filter((a) => a.levels !== null);
testedAnc.forEach((a, i) => (a.oof = ancestryModel.oof[i]));

const LABEL = {
    strikeDamage: "Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses)", saveDamage: "single-target save damage (× moderate damage, basic save 0.8)", areaDamage: "area damage (× moderate damage × 2 targets × uses)", otherDamage: "other damage (degree-weighted)", persistentDamage: "persistent damage (× 2 rounds)", selfDamage: "damage you take", healing: "healing (× moderate HP × 3)", tempHp: "temporary HP (× moderate HP × 3)",
    hardCondition: "hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses)", softCondition: "soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses)", selfCondition: "condition on yourself (drawback)", quickened: "quickened on you or allies",
    bonus_ac: "AC bonus (per +1)", bonus_attack: "attack bonus (per +1)", bonus_damage: "damage bonus (per +1/4 of moderate damage)", bonus_saves: "save bonus (per +1)", bonus_perception: "Perception/initiative bonus", bonus_skill: "skill-check bonus", bonus_speed: "Speed bonus (per 10 ft)", selfPenalty: "penalty on yourself",
    foe_ac: "foe AC penalty", foe_attack: "foe attack penalty", foe_saves: "foe save penalty", foe_damage: "foe damage penalty", foe_speed: "foe Speed penalty", foe_skill: "foe check penalty", foe_perception: "foe Perception penalty",
    resistance: "resistance (× moderate damage)", rule_ac: "PF2e rule: AC", rule_attack: "PF2e rule: attack", rule_damage: "PF2e rule: damage", rule_saves: "PF2e rule: saves", rule_skill: "PF2e rule: skills", rule_perception: "PF2e rule: Perception", rule_speed: "PF2e rule: Speed", rule_hp: "PF2e rule: Hit Points", rule_damageDice: "PF2e rule: extra damage dice",
    spell: "spell it grants (its one-cast rating)", actionsSpent: "actions spent (× uses)", reaction: "a reaction", free: "a free action", passive: "passive", uses: "uses a fight", strikes: "Strikes made (× uses)", trigger: "has a trigger", requirement: "has a requirement", stance: "stance", flourish: "flourish", press: "press", open: "open", incapacitation: "incapacitation", noncombat: "exploration/downtime/knowledge", movement: "movement", companion: "companion/summon", fortune: "reroll/fortune", archetype: "archetype", limited: "limited (once a minute or less)", senses: "senses", newStrike: "a new Strike (unarmed attack)", grants: "grants an item", level: "level/20"
};
const fmt = (x, d = 2) => (x >= 0 ? " " : "") + x.toFixed(d);
const corr = (rows, a, b) => (rows.length > 2 ? pearson(rows.map(a), rows.map(b)) : NaN);
const meanAbs = (rows, a, b) => rows.reduce((sum, t) => sum + Math.abs(a(t) - b(t)), 0) / (rows.length || 1);
const lines = [];
lines.push("# Rough power score", "", `Generated ${new Date().toISOString().slice(0, 10)} by tools/rough-power.mjs from the simulator's ratings in ${RUN} (feat ratings: ${ratings.method}, ${ratings.generated?.slice(0, 10)}${process.env.ROUGH_OVERLAY ? `; newer forced-use rows laid over them from ${process.env.ROUGH_OVERLAY}` : ""}).`, "");
lines.push("Each feat, action, heritage and background is read into building blocks from its own text and rules: damage weighted by the four degrees of success and by targets, healing, conditions by kind and value, bonuses and penalties, resistances, spells it grants, action cost, uses a fight, drawbacks. The reading is the same whether the simulator played it or not. Amounts are in each level's own units (damage over a moderate creature's Strike damage at that level, healing over its Hit Points), so one value holds at every level.", "");
lines.push(`Two fits give each block a value in levels (a ridge regression of the simulator's ratings on the blocks, each block counted as log(1 + amount)). **Activities** (actions, reactions, free actions): the value of one use — the rating over the times the simulator used it in a fight —, then × the uses a fight: the average the simulator gave tested activities with the same allowance (${Object.entries(USES).map(([k, v]) => `${v.toFixed(1)} for ${k === "3" ? "no frequency" : k === "2" ? "a reaction" : k === "1" ? "once a minute or rarer" : `allowance ${k}`}`).join(", ")}). **Passives**, heritages and backgrounds: the whole-fight rating. Ancestries get a small fit of their own. A rating the simulator's AI used the activity in less than ${MIN_USES} times a fight is left out of the fit (it says little of its value per use) and scored like the untested.`, "");
lines.push("Every check below is out of sample: each tested thing was scored by values fitted without it (10 folds), before its own rating was looked at.", "");
lines.push("## Does it align with what's been tested?", "");
lines.push("| Family | Tested | Correlation | Rank correlation | Mean error (levels) | Guessing the average |", "|---|---|---|---|---|---|");
const perUseOf = (t) => t.perUseLevels;
lines.push(`| Activities, per use | ${activeRows.length} | ${activeModel.r.toFixed(2)} | ${activeModel.rho.toFixed(2)} | ${activeModel.mae.toFixed(3)} | ${activeModel.baselineMae.toFixed(3)} |`);
lines.push(`| Activities, whole fight (per use × the simulator's uses) | ${activeRows.length} | ${corr(activeRows, (t) => t.oof, (t) => t.levels).toFixed(2)} | ${spearman(activeRows.map((t) => t.oof), activeRows.map((t) => t.levels)).toFixed(2)} | ${meanAbs(activeRows, (t) => t.oof, (t) => t.levels).toFixed(3)} | — |`);
lines.push(`| Passives, heritages, backgrounds | ${passiveRows.length} | ${passiveModel.r.toFixed(2)} | ${passiveModel.rho.toFixed(2)} | ${passiveModel.mae.toFixed(3)} | ${passiveModel.baselineMae.toFixed(3)} |`);
lines.push(`| Ancestries | ${testedAnc.length} | ${ancestryModel.r.toFixed(2)} | ${ancestryModel.rho.toFixed(2)} | ${ancestryModel.mae.toFixed(3)} | ${ancestryModel.baselineMae.toFixed(3)} |`);
lines.push(`| Spells (one cast; the same blocks, own fit, a cross-check) | ${spellRows.length} | ${spellModel.r.toFixed(2)} | ${spellModel.rho.toFixed(2)} | ${spellModel.mae.toFixed(3)} | ${spellModel.baselineMae.toFixed(3)} |`, "");
const byCat = {};
for (const t of tested) (byCat[`${t.active ? "activity: " : ""}${t.kind === "feat" ? `${t.category} feat` : t.kind}`] ??= []).push(t);
lines.push("By family (whole fight, out of sample):", "", "| Family | Tested | Correlation | Mean error |", "|---|---|---|---|");
for (const [cat, rows] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)) if (rows.length >= 5) lines.push(`| ${cat} | ${rows.length} | ${corr(rows, (t) => t.oof, (t) => t.levels).toFixed(2)} | ${meanAbs(rows, (t) => t.oof, (t) => t.levels).toFixed(3)} |`);
lines.push("");
const band = (x) => (x >= 0.15 ? "strong (≥ 0.15)" : x >= 0.05 ? "useful (0.05–0.15)" : x > -0.05 ? "about nothing (±0.05)" : "harmful (≤ −0.05)");
const bands = ["strong (≥ 0.15)", "useful (0.05–0.15)", "about nothing (±0.05)", "harmful (≤ −0.05)"];
lines.push("Bands, whole fight (rows: the simulator's; columns: the rough score's, out of sample):", "", `| Simulator \\ Rough | ${bands.join(" | ")} |`, `|---|${bands.map(() => "---").join("|")}|`);
for (const real of bands) lines.push(`| ${real} | ${bands.map((guess) => tested.filter((t) => band(t.levels) === real && band(t.oof) === guess).length).join(" | ")} |`);
const agree = tested.filter((t) => band(t.levels) === band(t.oof)).length;
const offByTwo = tested.filter((t) => Math.abs(bands.indexOf(band(t.levels)) - bands.indexOf(band(t.oof))) >= 2).length;
lines.push("", `Same band: ${agree} of ${tested.length} (${((agree / tested.length) * 100).toFixed(0)}%). Two or more bands off: ${offByTwo}.`, "");

const valueTable = (model, counts, unit) => {
    lines.push(`Base (intercept): ${fmt(model.beta[0], 3)}. λ = ${model.lambda}. ${unit}`, "", "| Block | Value (levels per log(1 + amount)) | Tested with it |", "|---|---|---|");
    model.keys.map((key, i) => [key, model.beta[i + 1]]).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => lines.push(`| ${LABEL[key] ?? key} | ${fmt(value, 3)} | ${counts[key] ?? 0} |`));
    lines.push("");
};
lines.push("## The building blocks' values", "", "### Activities, one use", "");
valueTable(activeModel, activeCounts, "Amounts here are for one use (\"× uses\" in a label is 1).");
lines.push("### Passives, heritages, backgrounds (whole fight)", "");
valueTable(passiveModel, passiveCounts, "");
lines.push("### Ancestries", "", "| Block | Value |", "|---|---|", `| base | ${fmt(ancestryModel.beta[0], 3)} |`);
ancestryModel.keys.forEach((key, i) => lines.push(`| ${{ hp: "ancestry Hit Points (per 2)", speed: "Speed (per 5 ft over 25)", small: "Small or Tiny", large: "Large", darkvision: "darkvision", lowLight: "low-light vision", boosts: "boosts minus flaws" }[key]} | ${fmt(ancestryModel.beta[i + 1], 3)} |`));
lines.push("", "### Spells (one cast; the same blocks fitted on their own, to compare)", "");
valueTable(spellModel, Object.fromEntries(spellModel.keys.map((k) => [k, spellRows.filter((r) => r.blocks[k]).length])), "");

const worst = [...tested].sort((a, b) => Math.abs(b.oof - b.levels) - Math.abs(a.oof - a.levels)).slice(0, 30);
lines.push("## Where it misses most (tested, out of sample)", "", "| Name | Family | Level | Simulator | Rough | Simulator's uses |", "|---|---|---|---|---|---|");
for (const t of worst) lines.push(`| ${t.name} | ${t.active ? "activity, " : ""}${t.kind === "feat" ? t.category : t.kind} | ${t.level} | ${fmt(t.levels)} | ${fmt(t.oof)} | ${t.active ? t.uses.toFixed(1) : "passive"} |`);

const inFit = new Set(tested);
const untested = things.filter((t) => !inFit.has(t));
lines.push("", "## Not yet tested: the rough score", "", `${untested.length} feats, actions, heritages and backgrounds out of the fit (never rated, or rated with the simulator's AI hardly using them), scored by the values above: whole fight, activities at the uses a fight the tested ones with the same frequency got. The full list (every score and block) is in docs/rough-power.json. A score near the base means the text has none of the blocks the fit values — often nothing a fight uses.`, "");
const byKind = {};
for (const t of untested) (byKind[t.kind === "feat" ? `${t.category} feats` : `${t.kind}s`] ??= []).push(t);
for (const [kind, rows] of Object.entries(byKind).sort((a, b) => b[1].length - a[1].length)) {
    rows.sort((a, b) => b.rough - a.rough);
    lines.push(`### ${kind[0].toUpperCase()}${kind.slice(1)} (${rows.length})`, "", "Highest 15 and lowest 5:", "", "| Name | Level | Rough | Rated (AI rarely used it) |", "|---|---|---|---|");
    [...rows.slice(0, 15), ...rows.slice(-5)].forEach((t) => lines.push(`| ${t.name} | ${t.level} | ${fmt(t.rough)} | ${t.levels === null ? "" : fmt(t.levels)} |`));
    lines.push("");
}
lines.push("## Ancestries", "", "| Ancestry | Simulator | Rough (out of sample) |", "|---|---|---|");
for (const a of [...ancestries].sort((p, q) => (q.levels ?? q.rough) - (p.levels ?? p.rough))) lines.push(`| ${a.name} | ${a.levels === null ? "—" : fmt(a.levels)} | ${fmt(a.oof ?? a.rough)} |`);

fs.writeFileSync(new URL("docs/rough-power.md", ROOT), lines.join("\n") + "\n");
const valuesOf = (model) => Object.fromEntries([["base", model.beta[0]], ...model.keys.map((key, i) => [key, model.beta[i + 1]])]);
const r3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? null : Math.round(x * 1000) / 1000);
const json = {
    version: 1, kind: "rough-power", generated: new Date().toISOString(), method: "ridge regressions of the simulator's ratings (levels) on each thing's building blocks (log(1 + amount)), read from its text and rules: activities per use × uses a fight, passives whole fight",
    check: { activePerUse: { n: activeRows.length, r: activeModel.r, rho: activeModel.rho }, activeWholeFight: { r: corr(activeRows, (t) => t.oof, (t) => t.levels) }, passive: { n: passiveRows.length, r: passiveModel.r, rho: passiveModel.rho }, sameBand: agree / tested.length, ancestries: { r: ancestryModel.r, mae: ancestryModel.mae }, spells: { r: spellModel.r, mae: spellModel.mae } },
    values: { activePerUse: valuesOf(activeModel), passive: valuesOf(passiveModel), ancestry: valuesOf(ancestryModel) },
    scores: [...things, ...ancestries].map((t) => ({ ref: t.ref, name: t.name, kind: t.kind, category: t.category, level: t.level, active: !!t.active, rough: r3(t.rough), perUse: r3(t.perUse), usesAFight: t.active ? r3(usesFor(t)) : null, tested: r3(t.levels), simulatorUses: r3(t.uses), inFit: inFit.has(t) || (t.kind === "ancestry" && t.levels !== null), outOfSample: r3(t.oof), blocks: Object.fromEntries(Object.entries(t.blocks).map(([k, v]) => [k, r3(v)])) }))
};
fs.writeFileSync(new URL("docs/rough-power.json", ROOT), JSON.stringify(json));
console.log(`activities per use ${activeRows.length}: r ${activeModel.r.toFixed(3)} rho ${activeModel.rho.toFixed(3)} λ ${activeModel.lambda}; whole fight r ${corr(activeRows, (t) => t.oof, (t) => t.levels).toFixed(3)}`);
console.log(`passives ${passiveRows.length}: r ${passiveModel.r.toFixed(3)} rho ${passiveModel.rho.toFixed(3)} λ ${passiveModel.lambda}`);
console.log(`all tested ${tested.length}: whole-fight r ${corr(tested, (t) => t.oof, (t) => t.levels).toFixed(3)}, same band ${((agree / tested.length) * 100).toFixed(0)}%, 2+ bands off ${offByTwo}`);
console.log(`ancestries ${testedAnc.length}: r ${ancestryModel.r.toFixed(3)}; spells ${spellRows.length}: r ${spellModel.r.toFixed(3)}; untested ${untested.length}`);
}
