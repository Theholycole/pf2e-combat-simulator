# PF2e Combat Simulator: Specification

Agreed with the user on 2026-10-07 through a design interview. Terms are defined in [CONTEXT.md](../CONTEXT.md).

## Purpose

A GM-only balance tester for PF2e. It plays an encounter in memory many times and reports the odds. Nothing on the canvas moves and no actor changes.

Two entry points share one engine:

1. **Encounter test** (before play): a setup dialog, a batch of 500 runs by default, a full report, and compare variants.
2. **Odds check** (during play): a button on the Combat Tracker that snapshots the fight as it stands (round, current turn, HP, conditions, positions) and runs a small batch, aiming for under ~3 seconds. It shows win %, objective %, and the chance any PC goes down.

## Module family

| Module | Contains |
|---|---|
| `pf2e-resolution-core` (milestone 2) | plan model, shared primitives, pure `*-core` decision logic, Foundry apply layer, plug-in registry |
| `pf2e-automatic-resolution`, retitled "PF2e Automatic Spell Resolution" | spells, and anything that casts, changes or depends on a spell |
| `pf2e-automatic-ability-resolution` (milestone 3) | basic actions, class features, feats, monster abilities, creature afflictions, non-spell consumables |
| `pf2e-combat-simulator` (this module) | requires only the core (from milestone 2); uses whatever is registered and reports everything else as gaps |

Logic moves out of the spell module into the core one rule family at a time, when it is first needed. Existing work is not migrated in bulk.

## Milestones

1. **Simulator alone.** It covers:
   - the turn loop, Strikes, movement, reactions, dying and hero points
   - morale, objectives and reinforcements
   - compare, the reports and the odds check
   - benchmark tests

   It has no spells and no healing.
2. **Build the core and connect the spell module.** Attack-roll and basic-save damage, healing and condition riders come first, then the most common gaps. *(Saves and spell attacks: built 2026-10-08, see below.)*
3. **The ability module.** Basic actions (Demoralize, Trip, Grapple, Shove, Escape) come first, then class features and monster abilities by rule family.

**Later:** map-based objectives (hold an area, escort, retrieve and escape), escalations, morale target fitting, and a logger that compares predictions with real fights.

## Milestone 1 status (2026-10-07)

Built and tested: 25 Node tests, plus a live check in `pftest` with the level-1 iconics against three Hobgoblin Soldiers.

**Measured:**

| | Result |
|---|---|
| Full simulation | 500 fights in about 2.3 s, on a Web Worker |
| Odds check | 200 fights in 0.5 s |
| Morale rule impact | about 30 variants × 200 fights in 26 s |
| Morale effect on win rate (always active, the default) | up to +14.9 points in close fights; up to 1.45 rounds shorter (after the planner fixes; +24.5 before) |
| Morale effect on win rate (optional losing gate at ratio 3) | at most 2.6 points; 0.42 rounds shorter on average |

**Choices made while building:**

- **Optional losing gate:** Lanchester's square law. Party HP × damage per round must be at least 3× the foes'. See M2 in [morale-decisions.md](morale-decisions.md).
- **Party retreat with no objective** happens when the foes are ahead by the same measure (ratio below 1).
- **Drawn weapons:** weapons that are carried but not held count as drawn. The Interact action to draw them isn't simulated.
- **Critical damage** uses PF2e's own critical formula, so deadly, fatal and runes are already included.
- **Snapshot values** have condition modifiers removed, and any same-type modifier they had displaced is restored. The engine applies conditions itself.
- **Shield Block** is used only against hits that deal at least the shield's Hardness.
- **Planner exposure:**
  - An enemy that has to move keeps the Strikes it has actions left for (it loses only its weakest attacks).
  - Enemies spread their attention over every target they can reach.
  - The first version overrated stepping away, so creatures hit and ran: 0.21 retreat moves per Strike, now 0.08.
- **Bestiary check:** about 1,700 creatures from Monster Core 1–2, NPC Core and Bestiaries 1–3 were read and simulated with no errors. Swarms and troops have no Strikes; their area attacks wait for the ability module.

**Added 2026-10-08:**

- **"What would change the odds?"** A button on the Odds dialog, and a Compare choice in the setup window. It tries PF2e's Weak and Elite adjustments (GM Core: ±2 to AC, attacks, saves, skills, Perception and Strike damage; HP up or down by level) on each kind of foe, plus removing one, all on the same dice. A creature that's already hurt keeps its damage taken. The setup table has an **Adjust** column to run a full simulation with Weak or Elite on chosen creatures. It is never saved on the encounter, so the Odds check always uses the actors as they are, and an adjustment the GM then applies to the actor for real isn't counted twice. Live check in `pftest`: the Odds check took 0.7 s and "what would change the odds" 1.2 s for an 8-creature fight.
- **Weapon traits built in:** forceful, sweep, backswing, backstabber and volley. They no longer appear as gaps.
- **Speed:**
  - The planner caches expected damage per weapon and target and only plans with each creature's two best Strikes against each target.
  - Six PCs against twelve foes went from 3.9 s to 1.7 s for 200 fights (in Node), with identical decisions.
  - The Odds check stops after 2.5 s once it has at least 80 fights, and says so when it does.

**Added later on 2026-10-08:**

- **Shield Block counts in planning.** A raised shield is credited with the Hardness its Shield Block would take off one hit. Before this, the Champion raised its shield in 3% of turns and spent 37% of turns on a −10 third attack. Now it raises in 20%, and Shield Blocks went from 8 to 51 per 300 fights.
- **PF2e threat rating** (Trivial to Extreme, with XP, adjusted for party size) is shown beside the win %, so the simulation can be compared with PF2e's encounter guide.
- **Reliability note** above the results, saying which way unsimulated pieces push the odds:
  - foes that can't attack (swarms, troops), spell-reliant foes, many foe special abilities, and hazards → the party is favoured
  - spell-reliant PCs → the foes are favoured
  - the party's healing → deaths are overstated

## Milestone 2 status (2026-10-08)

**Creatures cast spells**, through the resolution core. The open decisions and their defaults are in [spell-decisions.md](spell-decisions.md).

- **Snapshot** (`scripts/snapshot.js`): reads each creature's spellcasting entries through PF2e's sheet data (prepared and spontaneous slots, innate uses, focus points, cantrips), with the spell DC and attack without condition penalties. Plans come from `registry.preparePlans` (the spell module registers its compiler with the core). Without the core, every spell is a gap, as before.
- **Engine** (`src/engine/spells.js`): resolves a cast with the core's families (`registry.resolveSync`), and applies damage, persistent damage, conditions with durations, push and pull, death effects and follow-up saves. It picks targets in range bands, with areas by Melee and a capacity for each template.
- **Planner:** values a cast by resolving it once per degree with average damage, weighted by each target's odds, in the same units as Strikes. Allies caught in an area count against it. Spell attacks take the multiple attack penalty, and casting in a Melee provokes. Threat includes a creature's best spell.
- **Healing** (S15–S17): heals restore HP and wake downed PCs (wounded +1). Healing spells can target hurt or downed allies, and the planner values them by how close the ally is to dropping. Spells with PF2e action variants (Heal 1/2/3) are planned once per variant. Force Barrage puts its missiles on one target.
- **Buffs and debuffs** (S18): PF2e spell effects' rules become modifiers to AC, saves, attacks, damage and spells, along with temporary HP, fast healing, resistances, weaknesses, immunities and granted conditions. The snapshot reads the effect items; `src/engine/effects.js` interprets them.
- **New conditions in the engine:** stupefied, fatigued, paralyzed, asleep (from Sleep; damage wakes it), blinded and dazzled (flat checks to find a target), immobilized, restrained and grabbed.
- **Gap list:** a spell the core can't resolve is a "spell" gap. One it casts in part is "spell, partly simulated", with its missing parts listed. The reliability note counts both.
- **Bestiary check** (`tools/bestiary-casters.mjs`, compiled as the spell module's official compile does, native numbers included): 1,208 creatures from Monster Core 1–2 and NPC Core. 501 are casters; 2,392 of their 5,038 spells are cast (1,453 fully modelled), and 1,492 are utility spells. 1,503 fights, 3,293 casts, no errors.
- **Vitality and void damage** follow PF2e's rule: vitality harms only creatures with void healing (`hp.negativeHealing`, or undead), void only those without. Before this, a monster's Heal damaged living PCs.
- **The manifest requires** `pf2e-resolution-core`; the engine imports its pure code (`/modules/pf2e-resolution-core/src/index.js`) in the Web Worker.
- **Live check in `pftest` (2026-10-08):**
  - Setup: the spell module's compiler is registered with the core, and the casters are PFTEST SIM copies of NPC Core's Watchmage and Spirit Priest, against the level-5 iconics Valeros, Seelah, Ezren and Merisiel.
  - Spells, slots, focus points and spell effects read correctly, and Bless is listed as a gap, not a utility spell.
  - The Web Worker imports the core: 200 fights in 0.9 s, with no fallback to the main thread.
  - The fights showed two planner fixes. Buffs are weighed by the share of the target's threat that comes from Strikes, so Ezren hastes Valeros, not himself. Healing urgency is 2.5 × (1 − HP share)^1.5, so no topping up at 82% HP.
- 78 Node tests.

## Milestone 3 status (2026-10-08): monster abilities and basic actions

- **Creatures use their abilities** through the ability module (`pf2e-automatic-ability-resolution`) and the core:
  - the basic actions (Demoralize, Trip, Grapple, Shove, Escape), and since the user's request after the restart, the other skill actions: Disarm, Feint, Create a Diversion and Administer First Aid (Reposition compiles but changes nothing in bands)
  - Strike riders (Grab, Improved Grab, Knockdown, Push)
  - Constrict and Frightful Presence
  - breath weapons and other one-off save abilities, with their recharge
  - Ferocity and Rend
  - since the user asked to keep going on monster abilities: Swallow Whole, Trample, Regeneration, Fast Healing, Sneak Attack, Pack Attack, Draconic Frenzy, Draconic Momentum, Pounce, Stench, bonuses to saves against magic, and creature afflictions (poisons and diseases with stages)
- **Engine:**
  - who holds whom, released when the holder moves, drops or dies, and Escape
  - "until the end of your next turn"
  - riders as the action straight after a hit
  - auras when the fight starts
  - immunity to repeats (Demoralize, Create a Diversion)
  - off-guard to one creature's attacks only (Feint, Create a Diversion), with a number of uses
  - dropped weapons and weakened grips (Disarm), and Interact to pick up or regrip
  - stabilizing a dying PC (Administer First Aid)
- **Planner:** conditions and buffs now count a third against damage (B6), so Strikes aren't swapped for Grapples.
- **Defaults:** [ability-decisions.md](ability-decisions.md). The user confirmed B1–B6 and B7–B11 (the other skill actions) on 2026-10-08; B12–B21 (more monster abilities) confirmed the same day; B22–B26 (reactions, confused, Retch, charges) confirmed too; B27–B28 (Strike activities, Engulf) confirmed too.
- **Bestiary check** (`tools/bestiary-abilities.mjs`): 1,106 creatures with their real stat blocks, 3,318 fights, no errors.
- **Live check** (pftest, after a Foundry restart the user approved):
  - The ability module is enabled, and all 10 basic actions compile live.
  - A PFTEST SIM Giant Anaconda against the iconics: Grab, then Greater Constrict only on held targets.
  - First Aid stabilized Valeros.
  - 200 fights ran through the worker with no fallback.
- **PC class features** (the user's choice after B28): Sneak Attack, Rage, Hunt Prey, Flurry of Blows, Double Slice and the champion's reactions, read through PF2e in the snapshot (C1–C6, confirmed). The live check also fixed PC weapon traits (agile weapons had taken the full multiple attack penalty).
- More class features (C7–C12, confirmed): Battle Medicine, Vicious Swing and other feats, Exploit Vulnerability, Devise a Stratagem, panache and finishers, Intercept Attack and Taunt, Overdrive.
- Still more (C13–C15, confirmed): actions that put an effect on the PC (stances such as Tiger Stance, with the Strikes they add), reload for crossbows and firearms, and PCs' feat actions that are checks or saves against a creature (Bon Mot, Dirty Trick), with their penalties.
- 128 Node tests.

### Real-fight logger (built 2026-10-08, at the user's request)

Compares predictions with what happens at the table. It only acts on real fights: at least one player-owned PC and one foe, the "Log real fights" setting on (the default), and only on the active GM's client.

1. **When an encounter begins** (round 1), it runs the odds check silently in the worker and saves the prediction on the encounter. This includes win %, PC-down %, death %, rounds, PF2e threat and reliability. Every manual Odds check during the fight is also kept, with its round.
2. **During the fight**, a PC dropping to 0 HP is noted on the encounter.
3. **When the encounter ends** (it's deleted), a dialog asks how it went, pre-filled from the final state:
   - the outcome: won, rout, survived, retreated or defeated
   - the objective result
   - which PCs went down or died
   - optional notes

   The GM corrects anything wrong, saves, or chooses "Don't log this fight".
4. **The real-fight log window** (module settings menu, the Simulate window, or `api.openLog()`) shows:
   - how often the party won against how often it was predicted to
   - a skill score comparing the predictions with always guessing the overall rate (Brier scores)
   - calibration by predicted chance (under 50%, 50–80%, 80–95%, 95%+), for wins and for a PC going down
   - every logged fight, with surprises flagged (results the prediction gave less than a 30% chance), a delete button per fight, and JSON export
   - an option to leave out low-confidence predictions

   It warns that fewer than about 10–20 fights mean little.

The log is stored in a hidden world setting. The scoring is pure (`src/engine/calibration.js`) and tested. The accuracy sentence waits for 5 fights with a prediction.

**Live check in `pftest` (2026-10-08):**
- A fight with only GM-owned characters triggered nothing.
- With one player-owned PC:
  - the prediction was saved silently at round 1
  - the Odds check was recorded
  - a PC dropping to 0 HP was noted, even after being healed back up
  - ending the encounter showed the dialog with the right guesses ("rout" with one foe still up; "defeat" with every PC down)
  - saving stored the entry; the log window, surprise flag, delete and the low-confidence filter all worked
- Found and fixed: Foundry's dark theme hid unchecked checkboxes on striped table rows. Those tables now use plain rows with dividers.
- Export wasn't clicked, since it downloads a file.

**Second Foundry pass (2026-10-08, while the spell module was being cleaned up):**

- **Bestiaries re-checked with the current engine:** Monster Core 1–2 and NPC Core (1,208 creatures, each also run through "what would change the odds"). No errors and nothing slow.
- **Fixed: a foe the simulator can't make attack** (a swarm with only area attacks) had zero threat, so nobody attacked it. Fights stalled to the 20-round cap (71% timeouts in a test). Every creature that can fight is now worth at least half its side's average threat.
- **Reworked: the reliability note** estimates the share of each side's offense left out, instead of adding up points:
  - a foe that can't attack counts as all of its offense
  - a spellcaster counts as about half
  - hazards count as all

  It leans towards whichever side is missing less. The swarm case now correctly says "leans towards the party".
- **Fixed: no writes to the encounter mid-fight.** In `pftest` every Combat update costs 0.5–1.3 s, because of the spell module's `ongoing.reconcile` hook (reported to that session). Odds checks and downed PCs are now kept in memory; only the start-of-fight prediction is saved on the encounter. The Odds dialog for a 16-creature fight dropped from about 2.4 s to about 1 s.

**Loading:** after the Foundry restart on 2026-10-07 the module loads through its manifest in `pftest`. Its settings, API, Combat Tracker buttons and stylesheet are all present.

## Engine rules

### Built into the simulator

- initiative
- 3 actions and 1 reaction per turn
- Strike: multiple attack penalty, agile, degrees of success, damage, and the deadly, fatal, reach, range-increment and nonlethal traits
- Stride, Step, Stand, Raise a Shield, Shield Block, Attack of Opportunity
- flanking
- dying, wounded and recovery checks; doomed
- hero points
- conditions: frightened, sickened, clumsy, enfeebled, drained, off-guard, prone, slowed, stunned, quickened, fleeing, persistent damage

Everything whose effect comes from text (spells, feats, Demoralize, monster abilities, consumables) comes from the plan modules and is a gap until then. Spells resolved by the core's `save` family are cast from milestone 2 (see the milestone 2 status).

### Space: range bands

- **Bands:** engaged in a Melee, near, far, gone. Strides needed to close one band: 1 at Speed 20+, and a Speed below 20 still takes 1 Stride per band. Speed 50+ crosses near→far in one Stride.
- **Leaving a Melee:**
  - Step leaves without provoking, but not from an enemy whose reach is over 5 feet.
  - Stride leaves and provokes Attack of Opportunity.
- **Ranged Strikes:**
  - A near target is in the first range increment.
  - A far target is in the second increment (−2) unless the increment is 60 feet or more.
  - A ranged Strike made while engaged provokes.
- **Flanking:** a target engaged by k able enemies is off-guard to each of them with probability 0 (k=1), 0.5 (k=2), 0.75 (k=3) or 0.9 (k≥4). This is a tunable approximation.
- **Cover:** a setting for each side (none, standard +2, greater +4). It applies against ranged Strikes on creatures that are not engaged.
- **Starting bands:**
  - from token distances on the scene: within reach → engaged, within 30 feet → near, otherwise far
  - otherwise both sides start near

### Planner

Each creature works out its best plan with a depth-3 beam search over its legal actions, scoring them by expected value:

- **Damage** is worth the target's threat × the share of its remaining HP removed. A kill removes all of its threat.
- **Defence** (Raise a Shield, retreating) is worth the expected incoming damage it avoids, × self-preservation.
- **Position:** the end-of-plan position is worth a discounted share of the creature's best attack next turn, minus its exposure.
- **The objective** adds value to task actions and to attacking the protected creature or the task-doer.

The creature carries out one action, then plans again.

Role profiles: soldier (default), brute, skirmisher, sniper. Monsters do not attack downed PCs (a setting to allow it is deferred until there is healing to make it matter).

### Outcomes

The outcomes are decisive, rout, defeat, retreat, survived and timeout (round cap 20). The objective is scored separately.

**Party retreat:** two or more PCs are down, and either the objective has failed, or the foes are ahead. Being behind counts as "can't be completed"; checking only for a failed objective made parties with an open objective fight to the last PC.

### Fleeing, pursuit and surrender

- A fleeing creature leaves the fight once it reaches *far*.
- If half or more of the surviving foes are broken, the fight stops. Each active PC gets one pursuit Strike against a fleeing foe they can reach. Downed foes are caught; the rest escape.
- A surrendered foe counts as captured, and PCs always accept.
- PCs use nonlethal attacks only against a capture target (−2 unless the weapon is nonlethal).

### Hero points

- Heroic Recovery (spend all) when a PC's dying value would reach death.
- With 2 or more points, reroll a missed attack that would have dropped its target.
- A toggle removes hero points for comparison.

## Morale

- **Rules:** `Improved Morale.md` (in the user's PF2e Notes, `03 Combat and Encounter Design/Combat Systems/`) is the engine. Every trigger, modifier, threshold and template is a data entry with an id and an enabled flag, and can be overridden in the world settings.
- **AD&D modifiers:** the extras from the old `Morale.md` table are optional and disabled by default.
- **Defaults chosen in conflicts:** [morale-decisions.md](morale-decisions.md) lists them; the user confirmed them on 2026-10-08.

**Design goal:** morale is meant to speed up fights the party is already winning, not to decide them.

**Morale is always active** (user decision, 2026-10-07): the triggers are the signs of losing, so there is no extra gate by default. The per-rule impact report shows how much each rule changes the outcome and flags any that moves the win rate by more than 2 points.

An optional **losing gate** in the rules data limits checks to fights the party is clearly winning. An automated test keeps it under 5 points. M2 in [morale-decisions.md](morale-decisions.md) has the measurements both ways.

**Automatic creature settings** (saved on the actor, changeable per run):

- mindless, construct or ooze → None
- animal → Bestial
- a single foe 2+ levels above the party → solo boss (Boss Resolve)
- 3 or more foes with the same name → a Group
- highest-level foe → leader
- the target of a kill/capture objective → Cowardly

## Objectives (first version)

- **protect:** a party-side creature or object actor. It fails if the actor drops to 0 HP.
- **target:** a chosen foe, in mode `kill`, `capture` or `either`. It fails if the target escapes.
- **survive:** the party is still standing at the end of round N, which also ends the fight.
- **task:** a PC spends 2 actions (manipulate, so it provokes) on a skill check against the encounter DC:
  - success: +1 progress
  - critical success: +2 progress
  - critical failure: +1 danger

  It succeeds at the progress target before the round deadline, and fails at the danger limit or the deadline.

Foes' planning includes the objective, so they attack the protected creature and the task-doer.

## Setup and results

- **Input:** the Combat Tracker encounter, or the selected tokens.
- **Starting state:** each actor's current state, or a fresh checkbox.
- **Per-run options:**
  - ambush for a side (Stealth initiative; the other side is surprised)
  - cover for each side
  - reinforcements ("arrives at round N in band X")
  - an objective
  - per-creature overrides
- **Report:**
  - outcome %, win % with a 95% interval, and objective success %
  - average rounds, overall and in won fights
  - each PC's down % and death %; the chance any PC goes down or dies
  - foes fled and surrendered %
  - each foe's damage dealt and PCs downed (the most dangerous foe)
  - morale checks and how often fights ended in a rout
  - hero points spent
  - a sample fight log
  - gaps
- **Compare:** variants run on the same seeds. Presets:
  - morale on/off, plus the per-rule impact ranking
  - hero points on/off
- The engine runs in a Web Worker so Foundry stays responsive, with a fallback to the main thread.

## Benchmarks

Encounters are built from the GM Core creature-building tables and a level-matched martial party. They are checked against the encounter guide:

- win rates fall in order from Trivial to Extreme
- Trivial and Low are won almost every time
- Extreme is roughly a coin flip

Milestone 1 has no spells, healing or class features, so the bands are loose and tighten as content arrives.

