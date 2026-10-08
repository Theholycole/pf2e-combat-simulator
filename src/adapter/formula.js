// Parses PF2e's readable damage formulas, as returned by a Strike's
// damage({ getFormula: true }) and critical({ getFormula: true }), into engine
// damage parts. Examples:
//   "1d8 - 3 piercing"
//   "(2 * (2d8 + 6)) piercing + (2 * 2d6) fire"
//   "(2 * (4d4 + 15) + 2d8) slashing + (2 * 6d6) void"
//   "(2d6 + 2) acid + 2 persistent acid"

const ALWAYS_PERSISTENT = new Set(["bleed"]);

// Splits on " + " outside parentheses.
function splitTop(text) {
    const chunks = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        else if (depth === 0 && text.startsWith(" + ", i)) {
            chunks.push(text.slice(start, i));
            start = i + 3;
            i += 2;
        }
    }
    chunks.push(text.slice(start));
    return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

function tokenize(expr) {
    const tokens = [];
    const pattern = /\s*(\d+d\d+|\d+|[()+\-*])/gy;
    let match;
    let index = 0;
    pattern.lastIndex = 0;
    while (index < expr.length) {
        pattern.lastIndex = index;
        match = pattern.exec(expr);
        if (!match) {
            if (/^\s*$/.test(expr.slice(index))) break;
            throw new Error(`Unreadable damage expression: ${expr}`);
        }
        tokens.push(match[1]);
        index = pattern.lastIndex;
    }
    return tokens;
}

// Recursive descent: sum := product (('+'|'-') product)*; product := (number '*')* atom; atom := dice | number | '(' sum ')'
function parseExpression(expr) {
    const tokens = tokenize(expr);
    let position = 0;
    const peek = () => tokens[position];
    const next = () => tokens[position++];

    function atom() {
        const token = next();
        if (token === "(") {
            const inner = sum();
            if (next() !== ")") throw new Error(`Unbalanced damage expression: ${expr}`);
            return inner;
        }
        if (/^\d+d\d+$/.test(token)) {
            const [dice, die] = token.split("d").map(Number);
            return [{ dice, die, bonus: 0, multiplier: 1 }];
        }
        if (/^\d+$/.test(token)) return [{ dice: 0, die: 0, bonus: Number(token), multiplier: 1 }];
        throw new Error(`Unexpected "${token}" in ${expr}`);
    }

    function product() {
        let factor = 1;
        while (/^\d+$/.test(peek() ?? "") && tokens[position + 1] === "*") {
            factor *= Number(next());
            next();
        }
        return atom().map((part) => ({ ...part, multiplier: part.multiplier * factor }));
    }

    function sum() {
        let parts = product();
        while (peek() === "+" || peek() === "-") {
            const sign = next();
            const right = product();
            if (sign === "-") {
                for (const part of right) {
                    if (part.dice) throw new Error(`Subtracted dice in ${expr}`);
                    part.bonus = -part.bonus;
                }
            }
            parts = parts.concat(right);
        }
        return parts;
    }

    const parts = sum();
    if (position !== tokens.length) throw new Error(`Trailing tokens in ${expr}`);
    return parts;
}

// Folds flat parts into the first dice part with the same multiplier, so
// enfeebled and the minimum of 1 act on the weapon's own roll.
function fold(parts) {
    const result = [];
    const flats = [];
    for (const part of parts) (part.dice ? result : flats).push(part);
    for (const flat of flats) {
        const target = result.find((part) => part.multiplier === flat.multiplier);
        if (target) target.bonus += flat.bonus;
        else result.push(flat);
    }
    return result;
}

export function parseReadableDamage(text) {
    if (!text || typeof text !== "string") return [];
    const parts = [];
    let pending = [];
    for (const chunk of splitTop(text.trim())) {
        const match = chunk.match(/^(.*?)\s+([a-z][a-z\s-]*)$/i);
        if (!match || /\d/.test(match[2])) {
            pending.push(chunk);
            continue;
        }
        const expression = [...pending, match[1]].join(" + ");
        pending = [];
        const words = match[2].trim().toLowerCase().split(/\s+/);
        const type = words[words.length - 1];
        const persistent = words.includes("persistent") || ALWAYS_PERSISTENT.has(type);
        const precision = type === "precision" || words.includes("precision");
        for (const part of fold(parseExpression(expression))) {
            parts.push({ ...part, type: precision && type === "precision" ? null : type, persistent, precision });
        }
    }
    if (pending.length) throw new Error(`Damage formula without a type: ${text}`);
    // Precision damage takes the type of the damage it rides on.
    const fallback = parts.find((part) => part.type)?.type ?? "untyped";
    for (const part of parts) if (!part.type) part.type = fallback;
    // The weapon's own damage first: enfeebled and the minimum of 1 apply to it.
    const value = (part) => (part.dice * (part.die + 1) / 2 + part.bonus) * part.multiplier;
    return parts
        .map((part, index) => ({ part, index }))
        .sort((a, b) => (a.part.persistent - b.part.persistent) || (a.part.precision - b.part.precision) || (value(b.part) - value(a.part)) || (a.index - b.index))
        .map((entry) => entry.part);
}

// The damage parts one formula has beyond another: the same Strike's damage with
// a roll option on (an off-guard target, Rage) against without it. Extra dice
// come as they are; a bigger flat bonus as a flat part.
export function extraDamageParts(withOption, base) {
    const remaining = base.map((part) => ({ ...part }));
    const extra = [];
    for (const part of withOption) {
        const same = remaining.findIndex((other) => other.dice === part.dice && other.die === part.die && other.type === part.type && other.precision === part.precision && other.persistent === part.persistent && other.multiplier === part.multiplier);
        if (same < 0) {
            extra.push({ ...part });
            continue;
        }
        const [other] = remaining.splice(same, 1);
        if (part.bonus !== other.bonus) extra.push({ dice: 0, die: 0, bonus: part.bonus - other.bonus, multiplier: part.multiplier, type: part.type, precision: part.precision, persistent: part.persistent });
    }
    return extra.filter((part) => part.dice || part.bonus);
}

export function averageOf(parts) {
    return parts.reduce((sum, part) => sum + (part.dice * (part.die + 1) / 2 + part.bonus) * part.multiplier, 0);
}

// The plain-arithmetic average of a readable formula, for checking the parser.
export function referenceAverage(text) {
    const arithmetic = text
        .replace(/(\d+)d(\d+)/g, (_, n, m) => `(${n}*(${m}+1)/2)`)
        .replace(/[a-z][a-z\s-]*/gi, " ");
    return Function(`"use strict"; return (${arithmetic.replace(/\)\s+\(/g, ")+(").replace(/(\d|\))\s+(\(|\d)/g, "$1+$2")});`)();
}
