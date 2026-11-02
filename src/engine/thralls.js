// A necromancer's thralls (2026-11-02; the user: "the spell module handles Necromancer thralls"): the spell module's thrall rules
// (scripts/thrall-tokens.js; its compiler reads Create Thrall as thrall-create and a grave spell's "1 of your thralls" as targeting.thrall),
// played as a count on the necromancer (classes.js thrallMaker) rather than bodies on the field.
//   - A thrall Strike (the necromancer's "Thrall" strike): the turn's first is Create Thrall's command option — 1 action, a thrall that
//     Strikes at once, and with Thrall Proliferation one more —; later ones Command a Thrall it has, or Create Thrall again.
//   - A spell cast through a thrall (Necrotic Bomb, Bone Spear): one of its thralls, destroyed when the spell says so; with none, Create
//     Thrall first (an action more: two thralls, and Proliferation's third, once a round).
// Pure, but for the creature it changes.

export const needsThrall = (spell) => Boolean(spell?.plan?.targeting?.thrall);
export const thrallsOf = (c) => c.thralls ?? 0;

function createThralls(state, c, count) {
    const extra = c.thrallMaker?.proliferation && c.thrallProliferatedRound !== state.round ? c.thrallMaker.proliferation : 0;
    if (extra) c.thrallProliferatedRound = state.round;
    c.thralls = thrallsOf(c) + count + extra;
    state.stats.thralls = (state.stats.thralls ?? 0) + count + extra;
    return count + extra;
}

// Before a thrall Strike: which way the thrall comes to Strike.
export function thrallStrikes(state, c) {
    if (!c.thrallMaker) return;
    if (thrallsOf(c) > 0 && c.thrallProliferatedRound === state.round) {
        state.log?.push(`  ${c.name} Commands a Thrall to Strike`);
        return;
    }
    const made = createThralls(state, c, 1);
    state.log?.push(`  ${c.name} casts Create Thrall (${made} thrall${made === 1 ? "" : "s"}) and Commands one to Strike`);
}

// A spell cast through a thrall: Create Thrall first when it has none (the planner's makeThrall action), then the thrall it spends.
export function thrallForSpell(state, c, spell, action = {}) {
    if (!c.thrallMaker || !needsThrall(spell)) return;
    if (thrallsOf(c) <= 0 || action.makeThrall) {
        const made = createThralls(state, c, 2);
        state.log?.push(`  ${c.name} casts Create Thrall (${made} thralls)`);
    }
    if (spell.plan.targeting.thrall.destroyed) c.thralls = Math.max(0, thrallsOf(c) - 1);
}
