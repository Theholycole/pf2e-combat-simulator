// Escalations in live play (E1–E4): at each new round the active GM checks the
// encounter's rules against the fight as it stands and notes the round each
// one fired (combat flag escalationProgress), so the Odds check counts a
// rule's delay from then. Going back a round drops what fired from it on.

import { MODULE_ID, readFlag, savedSetup, sideOf } from "./snapshot.js";
import { regionSquares } from "./map.js";

const hp = (actor) => actor?.hitPoints ?? actor?.system?.attributes?.hp ?? { value: 0, max: 0 };
const isHazardActor = (actor) => actor?.type === "hazard";

// Out of the fight: defeated, at 0 HP, or its token gone (fled).
function fallen(combatant) {
    if (!combatant.token) return true;
    return !!combatant.isDefeated || (hp(combatant.actor).value ?? 0) <= 0;
}

// Fled: its token is gone, or it was marked defeated with HP left.
const fled = (combatant) => !combatant.token || (!!combatant.isDefeated && (hp(combatant.actor).value ?? 0) > 0);

function triggered(combat, rule, { setup, overrides }) {
    const when = rule.when ?? {};
    const combatants = combat.combatants.contents;
    // Creatures a rule brings that haven't come yet (hidden tokens) don't count as foes.
    const waiting = new Set((setup.escalations?.rules ?? []).flatMap((entry) => (entry.then?.kind === "arrive" ? entry.then.creatureIds ?? [] : [])).filter((id) => combat.combatants.get(id)?.token?.hidden));
    const foes = combatants.filter((entry) => sideOf(entry, overrides) === "foes" && !waiting.has(entry.id) && !isHazardActor(entry.actor));
    switch (when.kind) {
        case "round":
            return combat.round >= (when.round ?? 1);
        case "alarm":
            return !!setup.escalations?.alarm?.raisedRound;
        case "falls": {
            const target = combat.combatants.get(when.creatureId);
            return !!target && fallen(target);
        }
        case "foesHalf": {
            const max = foes.reduce((sum, entry) => sum + (hp(entry.actor).max ?? 0), 0);
            const now = foes.reduce((sum, entry) => sum + (fled(entry) ? 0 : Math.max(0, hp(entry.actor).value ?? 0)), 0);
            return max > 0 && now / max <= 0.5;
        }
        case "firstFlee":
            return foes.some(fled);
        case "enters": {
            const squares = regionSquares(combat.scene ?? canvas.scene, when.region);
            if (!squares?.length) return false;
            const inside = new Set(squares.map((square) => `${square.i},${square.j}`));
            return combatants.some((entry) => sideOf(entry, overrides) === "party" && entry.token && !fallen(entry)
                && (entry.token.getOccupiedGridSpaceOffsets?.() ?? []).some((square) => inside.has(`${square.i},${square.j}`)));
        }
        default:
            return false;
    }
}

async function trackRound(combat, changed) {
    if (changed.round === undefined || !game.user.isGM || !(game.users.activeGM?.isSelf ?? true)) return;
    const saved = savedSetup(combat);
    const rules = (saved.setup.escalations?.rules ?? []).filter((rule) => rule?.id && rule.when?.kind && rule.then?.kind);
    if (!rules.length) return;
    const before = readFlag(combat, "escalationProgress")?.fired ?? {};
    // Going back a round: what fired from it on hasn't happened.
    const fired = Object.fromEntries(Object.entries(before).filter(([, round]) => round < combat.round));
    for (const rule of rules) {
        if (fired[rule.id] !== undefined || !triggered(combat, rule, saved)) continue;
        // Round N fires as round N begins; anything else happened in the round just ended.
        fired[rule.id] = rule.when.kind === "round" ? Math.max(1, Math.min(combat.round, rule.when.round ?? 1)) : Math.max(1, combat.round - 1);
    }
    if (JSON.stringify(fired) === JSON.stringify(before)) return;
    // Foundry merges flag updates, so unset first or dropped entries would survive.
    await combat.unsetFlag(MODULE_ID, "escalationProgress");
    await combat.setFlag(MODULE_ID, "escalationProgress", { fired });
}

export function setUpEscalationTracking() {
    Hooks.on("updateCombat", (combat, changed) => {
        trackRound(combat, changed).catch((error) => console.error(`${MODULE_ID} | escalation tracking`, error));
    });
}
