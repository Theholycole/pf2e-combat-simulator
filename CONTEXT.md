# Combat Simulation

The language used to define the PF2e Combat Simulator.

## Language

**Simulation**:
Playing one encounter out in memory, from a snapshot, without changing any Foundry document. One simulation produces one **Run result**.

**Batch**:
Many simulations of the same snapshot with consecutive seeds. A batch produces a **Report**.

**Snapshot**:
Plain data describing every combatant, their positions, the round and turn, and the setup. Built from Foundry once; the engine never reads Foundry.

**Odds check**:
A small, fast batch started from the Combat Tracker during play, using the fight exactly as it stands.
_Avoid_: Live simulation (nothing is played on the canvas)

**Compare**:
Several batches of one snapshot that differ only by **Toggles**, run on the same seeds and shown side by side.

**Toggle**:
A named switch that changes one rule for a variant, such as morale, hero points, the objective or PC retreat.

**Side**:
`party` (PCs and their allies) or `foes` (monsters and their allies).

**Active**:
A combatant that can still act: present, not dead, not unconscious, not fled, not surrendered.

**Band**:
The abstract distance of a combatant: **engaged** (in a **Melee**), **near** (one Stride from anything), **far** (two Strides away), or **gone** (left the battlefield).

**Melee**:
A set of combatants from both sides who can reach each other. Joining one is a Stride; leaving one is a Step or a Stride.

**Area** and **exit**:
The places of a map objective: scene Regions, or Strides typed by hand. Each combatant keeps its distance in feet to both, alongside its band. Engaging a creature puts you where it is.

**Plan**:
Up to three actions a creature intends this turn. It is re-planned after every action because outcomes change the situation.

**Threat**:
A creature's expected damage per round against the other side. Damage is valued as the share of a target's remaining HP it removes, multiplied by the target's threat.

**Role profile**:
Weights for the planner: aggression, self-preservation, focus fire and objective. Guessed from the stat block, overridable per actor.

**Morale check**:
d20 + Will modifier + morale modifiers against the **Morale threshold** (10 + Will modifier), with PF2e degrees of success. Defined by `Improved Morale.md`.

**Losing gate**:
An optional rule, off by default, under which morale checks happen only while the party is clearly winning (party HP × damage per round at least 3× the foes'). By default morale is always active and the triggers alone decide when creatures check.

**Morale template**:
Cowardly, Typical, Disciplined, Fanatical, Bestial, Mercenary or None (never checks).

**Waver**: a failed morale check. **Break**: a critically failed one (rout, collapse, disordered retreat or berserk).

**Group**:
Three or more foes with the same name, checking morale once together and moving through Steady, Shaken, Wavering and Broken.

**Outcome**:
How a run ended: **decisive** (no foe active and none escaped), **rout** (no foe active and at least one escaped, or a group rout ended the fight), **defeat** (no PC active), **retreat** (the party gave up), **survived** (a Survive-N objective ended the fight), **held** (the party held the area long enough), **escaped** (the escorted creature or the item reached the exit), or **timeout** (the round cap was reached).
A **win** is decisive, rout, survived, held or escaped.

**Objective**:
A secondary goal scored separately from the outcome: **protect**, **target** (kill or capture), **survive** N rounds, **task** (progress tracker), or a map objective: **hold** an area, **escort** a creature to the exit, **retrieve** an item and escape.

**Gap**:
Something on an actor the engine could not use, such as a spell, feat, action or strike trait. Every report lists gaps with counts.
