// PF2e hazards' text (E4), pure so it can be tested without Foundry.

const plain = (html) => (html ?? "").replace(/<[^>]+>/g, " ");

// The ways to disable a hazard: [{ skill, dc, needed }] from its @Check links;
// "twice" or "three times" after a check is how many successes it takes.
export function parseDisable(html) {
    const text = html ?? "";
    const matches = [...text.matchAll(/@Check\[([^\]]+)\]/g)];
    const options = [];
    for (const [index, match] of matches.entries()) {
        const parts = match[1].split("|");
        const skill = parts[0].trim().toLowerCase();
        const dc = Number(parts.find((part) => part.trim().startsWith("dc:"))?.trim().slice(3));
        if (!skill || !dc) continue;
        const tail = plain(text.slice(match.index + match[0].length, matches[index + 1]?.index ?? text.length));
        const needed = /\b(?:three times|thrice|three successes)\b/i.test(tail) ? 3 : /\b(?:twice|two successes)\b/i.test(tail) ? 2 : 1;
        options.push({ skill, dc, needed });
    }
    return options;
}

// A complex hazard's routine: "(3 actions) …".
export const routineActions = (html) => Number(/\((\d+) actions?\)/i.exec(plain(html))?.[1]) || 1;

export const noMultipleAttackPenalty = (html) => /\b(?:no multiple attack penalty|(?:doesn't|does not) take a multiple attack penalty)\b/i.test(plain(html));

// A reaction that has the hazard Strike ("makes a Strike against the triggering creature").
export const mentionsStrike = (html) => /\bStrik(?:e|es|ing)\b/.test(plain(html));
