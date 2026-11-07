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
    // (2026-11-07, Cole: "keep building remaining feats" — more of them from the gap index's movement and Strike buckets.)
    { name: "Winged Mantle", cost: 1, parts: "Stand + Interact (pick up or draw a weapon), no reactions", saved: ["draw"], uses: 0.3, note: "when wounded, after being down" },
    { name: "Covered Reload", cost: 1, parts: "Take Cover or Hide + Interact (reload)", saved: ["cover"], uses: 4, note: "each turn with a reload weapon, where it can take cover" },
    { name: "Maneuvering Spell", cost: 0, parts: "Step, Leap or Stand (free, as it casts a 2-action spell)", saved: ["step"], uses: 2 },
    { name: "Ten Paces", cost: 0, parts: "Interact (draw a firearm or crossbow) as initiative is rolled", saved: ["draw"], uses: 1, note: "its +2 initiative not counted" },
    { name: "Predator's Growl", cost: 0, parts: "Demoralize (reaction, after Seeking a hidden foe)", saved: ["maneuver"], uses: 0.3 },
    { name: "Tangled Forest Rake", cost: 1, parts: "lashing branch Strike + Reposition 10 feet (no check)", saved: ["maneuver"], note: "in Tangled Forest Stance" },
    { name: "Scout's Pounce", cost: 2, parts: "Stride + Strike, Strike", saved: ["strike"], uses: 0.5, note: "hidden from all foes and 10 feet from them; its off-guard target not counted" },
    { name: "Bombing Run", cost: 2, parts: "Fly + Interact (draw a bomb) + Strike", saved: ["draw"], uses: 1, note: "with a fly Speed" },
    { name: "Instructive Strike", cost: 1, parts: "Strike + Recall Knowledge", saved: ["knowledge"] },
    { name: "Combat Assessment", cost: 1, parts: "melee Strike + Recall Knowledge", saved: ["knowledge"] },
    { name: "Magus's Analysis", cost: 1, parts: "Recall Knowledge + recharge Spellstrike", saved: ["knowledge"] },
    { name: "Shamble", cost: 2, parts: "Stride, Stride, ignoring difficult terrain", saved: [], note: "about even with two Strides" },
    { name: "Green Dash", cost: 1, parts: "Stride +15 feet", saved: [], note: "about even with a Stride" },
    { name: "Swamp Stealth", cost: 1, parts: "Take Cover + Hide", saved: ["stealth"], uses: 0.25, note: "in a swamp, beside cover" },
    { name: "Forest Stealth", cost: 1, parts: "Take Cover + Hide", saved: ["stealth"], uses: 0.4, note: "in a forest or jungle, beside cover" },
    { name: "Fleeting Shadow", cost: 2, parts: "Hide + Sneak, Sneak", saved: ["stealth"] },
    { name: "Cycle Elemental Stance", cost: 1, parts: "Stride or Step + enter another elemental stance", saved: ["stride"] },
    { name: "Touch and Go", cost: 1, parts: "Step + Interact (switch mode) + Interact (reload)", saved: ["step", "reload"], uses: 1, note: "a combination weapon" },
    { name: "Scurry!", cost: 0, parts: "Stride to cover as initiative is rolled", saved: ["stride"], uses: 1 },
    { name: "Tandem Movement", cost: 1, parts: "it and its eidolon Stride", saved: ["stride"] },
    { name: "Artist's Attendance", cost: 2, parts: "Stride, Stride + Trace a Rune", saved: ["strike"], uses: 1 },
    { name: "Exploit Blunder", cost: 0, parts: "Step (reaction, a foe it Devised a Stratagem against misses it)", saved: ["step"], uses: 0.5 },
    { name: "Knockback", cost: 1, parts: "a successful Shove, no check, after a hit", saved: ["maneuver"] },
    { name: "Topple Foe", cost: 0, parts: "Trip (reaction, as an ally hits a foe beside them both)", saved: ["maneuver"] },
    { name: "Toppling Transformation", cost: 0, parts: "Shove or Trip (reaction, as a polymorph grows it)", saved: ["maneuver"], uses: 0.5 },
    { name: "Disarming Block", cost: 0, parts: "Disarm (free, after a Shield Block on a held weapon's Strike)", saved: ["maneuver"] },
    { name: "Embrace the Pain", cost: 0, parts: "Grapple or Disarm (reaction, as a foe's melee attack damages it)", saved: ["maneuver"], uses: 1.25 },
    { name: "Opportunistic Grapple", cost: 0, parts: "Grapple (reaction, its prey critically misses it)", saved: ["maneuver"], uses: 0.2 },
    { name: "Knight's Retaliation", cost: 0, parts: "Disarm, Shove or Trip (reaction, an undead critically misses it)", saved: ["maneuver"], uses: 0.1, note: "undead only" },
    { name: "Rippling Spin", cost: 0, parts: "Step + Disarm or Trip (reaction, as it's hit in melee)", saved: ["step", "maneuver"], uses: 1, note: "in Reflective Ripple Stance" },
    { name: "Illimitable Finisher", cost: 1, parts: "Step + a one-action finisher (bravado)", saved: ["step"] },
    { name: "Speed of Arms", cost: 0, parts: "a Strike or a Stride as its turn begins (reaction)", saved: ["strike"], note: "its first Strike at each foe at mythic proficiency, not counted" },
    { name: "Expeditious Inspection", cost: 0, parts: "Recall Knowledge, Seek or Sense Motive (free)", saved: ["knowledge"] },
    { name: "Thoughtful Reload", cost: 1, parts: "Recall Knowledge + Interact (reload)", saved: ["knowledge"] },
    { name: "Springboard", cost: 1, parts: "Leap, no reactions from the foe it struck", saved: [], note: "about even with a Stride" },
    { name: "Flyby Attack", cost: 2, parts: "Fly + Strike", saved: ["move"] },
    { name: "Reloading Strike", cost: 1, parts: "one-handed melee Strike + Interact (reload)", saved: ["reload"] },
    { name: "Infiltrator's Draw", cost: 1, parts: "Interact (draw or reload a hand crossbow) + Strike", saved: ["reload"], note: "once a round" },
    { name: "Guerrilla Assault", cost: 1, parts: "Interact (reload a sling or blowgun) + Strike", saved: ["reload"], note: "once a round; hidden after it if it was undetected, not counted" },
    { name: "Feral Scramble", cost: 2, parts: "Climb + claw Strike + Athletics", saved: ["move"], uses: 0.5, note: "in hybrid or animal shape" },
    { name: "Warp Path", cost: 1, parts: "teleport 30 feet + melee Strike", saved: ["stride"], uses: 0.6, note: "while veiled" },
    { name: "Lunge", cost: 1, parts: "Strike with 5 feet more reach", saved: ["step"] },
    { name: "Positioning Assault", cost: 2, parts: "two-handed Strike + Reposition 5 feet (no check)", saved: ["maneuver"] },
    { name: "Rabid Sprint", cost: 2, parts: "Stride, Stride, Stride", saved: ["stride"], note: "both hands free" },
    { name: "Incredible Sprint", cost: 2, parts: "Stride, Stride, Stride", saved: ["stride"] },
    { name: "Final Surge", cost: 1, parts: "Stride, Stride (its Drakeheart Mutagen ends)", saved: ["stride"], uses: 1, note: "ends the mutagen" },
    { name: "Marathon Dash", cost: 1, parts: "Stride + allies within 10 feet Stride as a reaction", saved: ["stride", "stride"], uses: 1 },
    { name: "Running Recharge", cost: 1, parts: "recharge Spellstrike + Stride half or Step", saved: ["step"] },
    { name: "Sunless Slide", cost: 2, parts: "Step + a spell of 2 actions or fewer", saved: ["step"], uses: 0.5, note: "in dim light or darkness; saves the Step only with a 2-action spell" },
    { name: "Quick Positioning", cost: 0, parts: "Step, Step as its first action", saved: ["step", "step"], uses: 1, note: "once a fight, seeing its prey at initiative" },
    { name: "Goblin Scuttle", cost: 0, parts: "Step (reaction, as an ally ends a move beside it)", saved: ["step"] },
    { name: "Keep Pace", cost: 0, parts: "Stride (reaction, as its prey moves away)", saved: ["stride"], uses: 1 },
    { name: "Seize Advantage", cost: 0, parts: "Step or Stride (reaction, its student's critical hit)", saved: ["stride"], uses: 0.3 },
    { name: "Wild Stride", cost: 2, parts: "Stride, Stride, +5 or +10 feet", saved: [], note: "a little faster, no action saved" },
    { name: "Ghostly Stride", cost: 1, parts: "Stride half its Speed, no reactions, through foes", saved: [], note: "about even with a Stride" },
    { name: "Scamper", cost: 1, parts: "Stride +5 feet, +2 AC against its reactions", saved: [], note: "about even with a Stride" },
    { name: "Swift Leap", cost: 1, parts: "Leap, no reactions", saved: [], note: "about even with a Stride" },
    { name: "Skirmish Strike", cost: 1, parts: "Step + Strike", saved: ["step"] },
    { name: "Spear Dancer", cost: 1, parts: "Step + Strike (spear or polearm)", saved: ["step"] },
    { name: "Battlefield Agility", cost: 1, parts: "Strike + Step (while flanked)", saved: ["step"], uses: 0.5, note: "only when flanked by two foes" },
    { name: "For the Fallen!", cost: 1, parts: "Step + Strike (press)", saved: ["step"] },
    { name: "Predator's Pounce", cost: 1, parts: "Stride + Strike (light or no armor)", saved: ["stride"] },
    { name: "Mobile Magical Combat", cost: 1, parts: "Stride + Strike (after a spell)", saved: ["stride"] },
    { name: "Liberating Dive", cost: 2, parts: "Fly + melee Elemental Blast (+ an ally's Escape)", saved: ["move"] },
    { name: "Imperious Aura", cost: 0, parts: "a kinetic aura stance impulse as a free action as its turn begins", saved: ["strike"], uses: 1, note: "the one action its stance costs, once a fight (the stance's own value is its own feat's)" },
    { name: "Four Winds", cost: 2, parts: "up to 4 allies Stride half their Speed", saved: [], note: "four half-Strides bought with two of the kineticist's actions: about even" },
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
    { name: "Stay Here!", cost: 2, parts: "Trip + a melee Strike on a success (flourish; its multiple attack penalty after both)", saved: [], note: "two actions for two actions: only the multiple attack penalty and the free hand" },
    { name: "Twirling Strike", cost: 2, parts: "Tumble Through (Performance) + a melee Strike on a success", saved: [], note: "two actions for two actions" },
    { name: "Tumbling Strike", cost: 1, parts: "Tumble Through + a melee Strike (flourish)", saved: ["stride"], uses: 1.25, note: "off-guard on a critical success" },
    { name: "Guiding Finish", cost: 1, parts: "Strike + Reposition 10 feet on a hit (press)", saved: ["maneuver"], uses: 1 },
    { name: "Leaping Hedgehog Strike", cost: 2, parts: "Leap + Tumble Through (prone on a success) + a Strike (at mythic proficiency, a Mythic Point, if prone)", saved: ["stride", "maneuver"], uses: 1.25, note: "mythic" },
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
