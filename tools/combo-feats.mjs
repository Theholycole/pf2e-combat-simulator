// (2026-11-05, Cole: "Any feat that is just a combination of basic actions just take the value of the individual actions taking into account
// the action cost. No need for automation or testing.") A combo feat's value, computed, not simulated: each basic action it folds in is
// one the PC already has (rated alone, with vs without, about 0 — run/basics.jsonl), so what the feat adds is the actions it saves. Value a
// fight = the actions saved × what one such action is worth when used × how often a fight it's worth saving.
import fs from "fs";

// What one saved action is worth, in levels, each time — from the simulator's ratings:
// - a general action (it becomes a Strike): Duelist's Form, a quickened stance (+0.13 over about 3.3 extra actions a fight, its 1-action cost
//   taken off) ≈ 0.04;
// - a Stride: Sudden Charge (2 actions for Stride, Stride, Strike: +0.015 at 1.25 uses a fight) ≈ 0.012; a Step, two thirds of that;
// - a reload: the action it frees is a Strike, as a general one; a draw, the same, once a fight;
// - Raise a Shield, Take Cover, Hide, Sneak, Create a Diversion, a basic maneuver: forced Raise a Shield costs about 0.045 a turn against a
//   general action (Shielding Taunt, Mounted Shield, Reflexive Shield), so a free one is worth little: 0.01;
// - Recall Knowledge, Seek, picking an object up: nothing a fight counts.
export const ACTION_VALUE = { strike: 0.04, reload: 0.04, draw: 0.04, stride: 0.012, move: 0.012, step: 0.008, shield: 0.01, cover: 0.01, stealth: 0.01, maneuver: 0.01, knowledge: 0, pickup: 0 };
// How often a fight saving it matters: a reload or a raised shield each turn (4 a fight); a Stride, Step or other move when the PC must
// close in or reposition (1.25 a fight, Sudden Charge's uses); a draw once; the rest once.
export const USES = { strike: 4, reload: 4, draw: 1, stride: 1.25, move: 1.25, step: 1.25, shield: 4, cover: 1, stealth: 1, maneuver: 1, knowledge: 1, pickup: 1 };

// Each combo feat: its cost, the basic actions it folds in, the saved ones (their kinds), and a cap on uses (frequency, requirement).
export const COMBOS = [
    { name: "Skirmish Strike", cost: 1, parts: "Step + Strike", saved: ["step"] },
    { name: "Spear Dancer", cost: 1, parts: "Step + Strike (spear or polearm)", saved: ["step"] },
    { name: "Battlefield Agility", cost: 1, parts: "Strike + Step (while flanked)", saved: ["step"], uses: 0.5, note: "only when flanked by two foes" },
    { name: "For the Fallen!", cost: 1, parts: "Step + Strike (press)", saved: ["step"] },
    { name: "Predator's Pounce", cost: 1, parts: "Stride + Strike (light or no armor)", saved: ["stride"] },
    { name: "Mobile Magical Combat", cost: 1, parts: "Stride + Strike (after a spell)", saved: ["stride"] },
    { name: "Antler Rush", cost: 2, parts: "Stride, Stride + Strike, Shove or Disarm", saved: ["stride"] },
    { name: "Hurling Charge", cost: 2, parts: "ranged Strike + Stride + Interact (draw)", saved: ["draw"] },
    { name: "Falcon Swoop", cost: 2, parts: "Fly, Fly + Strike", saved: ["move"] },
    { name: "Shark Attack", cost: 2, parts: "Swim, Swim + Strike", saved: ["move"], uses: 0.25, note: "under water only" },
    { name: "Fantastic Leap", cost: 2, parts: "High or Long Jump (2) + Strike", saved: ["move"] },
    { name: "Pounding Leap", cost: 2, parts: "Strike + High or Long Jump (2)", saved: ["move"] },
    { name: "Sudden Leap", cost: 2, parts: "Leap, High or Long Jump + Strike", saved: ["move"], uses: 0.6, note: "saves an action only with a High or Long Jump" },
    { name: "Flying Kick", cost: 2, parts: "Leap, High or Long Jump + Strike", saved: ["move"], uses: 0.6, note: "saves an action only with a High or Long Jump" },
    { name: "Peafowl Strut", cost: 1, parts: "Step, Step + Strike (Peafowl Stance)", saved: ["step", "step"] },
    { name: "Winding Flow", cost: 1, parts: "two of Stand, Step, Stride", saved: ["stride"], cap: 4 },
    { name: "Furious Sprint", cost: 2, parts: "Stride ×5 (×8 for 3 actions)", saved: ["move"], uses: 0.5, note: "only long dashes; most fights don't need them" },
    { name: "Doctor's Visitation", cost: 1, parts: "Stride + Battle Medicine", saved: ["stride"] },
    { name: "Reloading Trick", cost: 1, parts: "Interact (reload) + Strike (hand crossbow or gauntlet bow)", saved: ["reload"] },
    { name: "Risky Reload", cost: 1, parts: "Interact (reload) + Strike; a miss misfires", saved: ["reload"], penalty: 0.02, note: "a failed Strike misfires (about half the time): less the cost of clearing it" },
    { name: "Bullet Dancer Reload", cost: 1, parts: "Strike + Interact (reload) (Bullet Dancer Stance)", saved: ["reload"] },
    { name: "Running Reload", cost: 1, parts: "Stride, Step or Sneak + Interact (reload)", saved: ["reload"] },
    { name: "Nightwave Springing Reload", cost: 1, parts: "Leap + Interact (reload)", saved: ["reload"] },
    { name: "Crossbow Ace", cost: 1, parts: "Create a Diversion or Take Cover + Interact (reload)", saved: ["cover"] },
    { name: "Infiltrator's Reload", cost: 1, parts: "Interact (reload) + Hide, Sneak or Take Cover", saved: ["cover"] },
    { name: "Quick Draw", cost: 1, parts: "Interact (draw) + Strike", saved: ["draw"] },
    { name: "Quick Shot", cost: 1, parts: "Interact (draw a bow or crossbow) + Strike", saved: ["draw"] },
    { name: "Brandishing Draw", cost: 1, parts: "Interact (draw) + Strike or finisher", saved: ["draw"] },
    { name: "Quick Bomber", cost: 1, parts: "Interact (draw a bomb) + Strike", saved: ["reload"], note: "a bomb each throw: a draw every turn, as a reload" },
    { name: "Silent Step", cost: 1, parts: "Step + Hide or Sneak", saved: ["stealth"] },
    { name: "Guarded Advance (Knight Vigilant)", cost: 1, parts: "Step + Raise a Shield", saved: ["step"] },
    { name: "Guarded Advance", cost: 1, parts: "Raise a Shield + Step, Step", saved: ["step", "step"] },
    { name: "Practiced Opposition", cost: 1, parts: "Recall Knowledge + Strike (undead)", saved: ["knowledge"] },
    { name: "Makeshift Strike", cost: 1, parts: "Interact (pick up) + Strike", saved: ["pickup"] },
    { name: "Magpie Snatch", cost: 2, parts: "Stride, Stride + Interact (pick up)", saved: ["pickup"] },
    { name: "Elf Step", cost: 1, parts: "Step, Step", saved: ["step"] },
    { name: "Wing Step", cost: 1, parts: "Step, Step", saved: ["step"] },
    { name: "Dastardly Dash", cost: 1, parts: "Stride (half) + Trip or Dirty Trick (flourish)", saved: ["maneuver"], uses: 1.25 },
    { name: "Tactical Entry", cost: 0, parts: "Stride, free, before anyone acts (Stealth initiative)", saved: ["stride"], uses: 0.5, note: "only when it rolled Stealth for initiative" },
    { name: "Zealous Rush", cost: 0, parts: "Stride, as a reaction to a self spell", saved: ["stride"] },
    { name: "Clever Gambit", cost: 0, parts: "Step or Stride, as a reaction to a critical hit on a creature it Recalled Knowledge on", saved: ["stride"], uses: 0.3 },
    { name: "Elude Trouble", cost: 0, parts: "Stride, as a reaction to a missed melee attack", saved: ["stride"] },
    { name: "Coursing Weave", cost: 0, parts: "Stride or Fly, as a reaction to a missed ranged attack", saved: ["stride"], uses: 0.3, note: "ranged attacks on it are rare" },
    { name: "No Escape", cost: 0, parts: "Stride after a retreating foe (reaction)", saved: ["stride"], uses: 0.5, note: "foes seldom retreat" },
    { name: "Reactive Pursuit", cost: 0, parts: "Stride after a retreating foe (reaction)", saved: ["stride"], uses: 0.5, note: "foes seldom retreat" },
    { name: "Shadow Tempo", cost: 0, parts: "Stride following an ally (reaction)", saved: ["stride"], uses: 0.5 },
    { name: "Bashing Charge", cost: 2, parts: "Stride, Stride (Force Open on the way)", saved: [] },
    { name: "Hopping Stride", cost: 1, parts: "Stride (Speed − 10, over difficult terrain)", saved: [] },
    { name: "Shift the Little Ones", cost: 1, parts: "Stride (allies Step aside)", saved: [] },
    { name: "Light Paws", cost: 2, parts: "Stride + Step", saved: [] },
    { name: "Retaliating Rescue", cost: 2, parts: "Stride + Strike", saved: [] },
    { name: "Wall Run", cost: 1, parts: "Stride (up walls)", saved: [] },
    { name: "Determined Dash", cost: 2, parts: "Stride, Stride", saved: [] },
    { name: "Skyseeker", cost: 2, parts: "Leap + Strike (Sky and Heaven Stance)", saved: [] },
    { name: "Death from Above", cost: 2, parts: "Leap (Athletics) + Strike", saved: [] }
];

export function comboValue(entry) {
    const parts = entry.saved.map((kind) => ACTION_VALUE[kind] * Math.min(entry.cap ?? Infinity, entry.uses ?? USES[kind]));
    return Math.max(-1, parts.reduce((sum, value) => sum + value, 0) - (entry.penalty ?? 0));
}

if (process.argv[1]?.endsWith("combo-feats.mjs")) {
    const rows = COMBOS.map((entry) => ({ ...entry, value: comboValue(entry) })).sort((a, b) => b.value - a.value);
    const lines = [
        "# Combo feats: valued from their actions",
        "",
        `Generated ${new Date().toISOString().slice(0, 10)} by tools/combo-feats.mjs. Not simulated (Cole, 2026-11-05: a feat that is just a combination of basic actions takes the value of its actions, with the action cost).`,
        "",
        "Every PC already has the basic actions, and each rated alone is worth about 0 levels (run/basics.jsonl), so a combo feat is worth the actions it saves: **saved actions × what one is worth × how often a fight it matters**.",
        "",
        "| Saved action | Worth each time (levels) | Times a fight | From |",
        "|---|---|---|---|",
        "| a general action (becomes a Strike) | 0.040 | 4 | Duelist's Form (quickened stance) +0.13 over ~3.3 extra actions |",
        "| a reload (frees a Strike) | 0.040 | 4 | as a general action, each turn for a reload weapon |",
        "| a draw | 0.040 | 1 | as a general action, once a fight |",
        "| a Stride, Fly, Swim, jump | 0.012 | 1.25 | Sudden Charge +0.015 at 1.25 uses a fight |",
        "| a Step | 0.008 | 1.25 | two thirds of a Stride |",
        "| Raise a Shield, Take Cover, Hide, Sneak, a maneuver | 0.010 | 1–4 | forced Raise a Shield ≈ 0.045 a turn below a general action |",
        "| Recall Knowledge, picking something up | 0 | — | nothing a fight counts |",
        "",
        "| Feat | Cost | Folds in | Saves | Levels a fight | Note |",
        "|---|---|---|---|---|---|",
        ...rows.map((row) => `| ${row.name} | ${row.cost} | ${row.parts} | ${row.saved.length ? row.saved.join(", ") : "nothing"} | ${row.value >= 0 ? "+" : ""}${row.value.toFixed(3)} | ${row.note ?? ""} |`),
        ""
    ];
    fs.writeFileSync(process.argv[2] ?? "docs/combo-feats.md", lines.join("\n"));
    console.log(rows.map((row) => `${row.name}: ${row.value.toFixed(3)}`).join("\n"));
}
