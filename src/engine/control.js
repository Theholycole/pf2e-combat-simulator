// Controlled (2026-10-14, spell coverage: Dominate, Claim Undead, You're Mine): the creature fights for whoever controls it — on its
// controller's side — while the condition lasts; when it ends (its save, the time, a counteract), it's back on its own side.
export function takeControl(state, target, controller) {
    if (!controller || target === controller || controller.side === target.side) return;
    target.originalSide ??= target.side;
    target.side = controller.side;
    target.controlledBy = controller.id;
    (state.controlled ??= []).push(target);
    state.log?.push(`  ${target.name} is controlled by ${controller.name}`);
}

// As any turn starts: those no longer controlled are back on their own sides.
export function controlTurnStart(state) {
    if (!state.controlled?.length) return;
    for (const c of state.controlled.filter((each) => !each.cond?.controlled)) {
        c.side = c.originalSide ?? c.side;
        c.originalSide = undefined;
        c.controlledBy = undefined;
        state.log?.push(`  ${c.name} is no longer controlled`);
    }
    state.controlled = state.controlled.filter((each) => each.cond?.controlled);
}
