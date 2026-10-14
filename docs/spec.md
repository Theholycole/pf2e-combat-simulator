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

**Later:** morale target fitting. *(Map-based objectives and escalations: built 2026-10-08, see "Map objectives" and "Escalations" below. The real-fight logger is built too.)*

## Milestone 1 status (2026-10-07)

Built and tested: 25 Node tests, plus a live check in `pftest` with the level-1 iconics against three Hobgoblin Soldiers.

**Measured:**

| | Result |
|---|---|
| Full simulation | 500 fights in about 2.3 s, on a Web Worker |
| Odds check | 200 fights in 0.5 s |
| Morale rule impact | about 30 variants × 200 fights in 26 s |
| Morale effect (cleanup morale, M24–M31, the default) | +0.5 points on the equal-level benchmarks (+1.0 in close fights); won fights 1.70 rounds shorter |
| Morale effect (Improved Morale, always active, before M20–M24) | +5.2 points; 0.72 rounds shorter |

**Choices made while building:**

- **Losing gate:** on since M24. Since M28 it compares each side's HP left as a share of its starting HP: the party's share must be at least 1.25× the foes'. Before, it used Lanchester's square law (party HP × damage per round at least 2× the foes'), which is still a setting. See M2, M24 and M28 in [morale-decisions.md](morale-decisions.md).
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
- Exemplar ikons (C25–C27, confirmed): the divine spark's immanence read from PF2e, Shift Immanence, Strike, Breathe, Rend and No Scar but This.
- Commander tactics (C21–C24, confirmed): Strike Hard!, Pincer Attack, Set-Up Strike, Banner's Inspiration, Drilled Reactions; and the flourish trait (one a turn).
- Spellstrike (C20, confirmed): a melee Strike carrying a spell, recharged by an action or a conflux spell; stances' changes to existing Strikes measured in PF2e.
- Firearms and gunslingers (C16–C19, confirmed): concussive and splash (bombs and scatter weapons, allies included), slinger's reloads, the deeds when initiative is rolled, and Cover Fire.
- 143 Node tests.

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

Everything whose effect comes from text (spells, feats, Demoralize, monster abilities, consumables) comes from the plan modules and is a gap until then.

**Temporary immunity** ("temporarily immune for 1 minute", "is then immune to its Terrifying Cry"): a creature that rolled one of the results the text names can't be targeted by that creature's ability again in the fight, areas included (fixed 2026-10-08: emanations and bursts used to catch immune creatures again, so 146 bestiary creatures could repeat a screech or a captivating display on the same PCs every action). Spells resolved by the core's `save` family are cast from milestone 2 (see the milestone 2 status).

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

- A creature that gave up on a morale check flees and leaves the fight once it reaches *far*.
- A creature fleeing from a spell or an ability (a PC too) runs to *far* and stays out of the fight until its fleeing ends, then comes back. Fleeing with no stated end ("for as long as it's frightened", or no duration at all, as in Vision of Death's critical failure) lasts while it's frightened, or else its next turn (user, 2026-10-08; before, such a creature left for good).
- If half or more of the surviving foes are broken, the fight stops. A foe fleeing from a spell or an ability counts as broken here (user, 2026-10-08). Each active PC gets one pursuit Strike against a fleeing foe they can reach. Downed foes are caught; the rest escape.
- A surrendered foe counts as captured, and PCs always accept.
- PCs use nonlethal attacks only against a capture target (−2 unless the weapon is nonlethal).

### Hero points

- Heroic Recovery (spend all) when a PC's dying value would reach death.
- With 2 or more points, reroll a missed attack that would have dropped its target.
- A toggle removes hero points for comparison.

## Morale

- **Rules:** "cleanup morale" (M24, 2026-10-08), the user's system inspired by `Morale.md` and `Improved Morale.md` (in the user's PF2e Notes, `03 Combat and Encounter Design/Combat Systems/`). Every trigger, modifier, DC setting and template is a data entry with an id and an enabled flag, and can be overridden in the world settings. Improved Morale's waver stage, group checks and recovery are still there, switched off.
- **Decisions:** [morale-decisions.md](morale-decisions.md) M1–M34.

**Design goal** (the user, 2026-10-08): morale should shorten fights the party is winning as much as it can, with little effect on the win rate. The rules are the same whether or not the players play for morale (M26).

**How it works (M24–M38):**
- **When:** foes check only once their side is losing: 25%, 50% and 75% of the side fallen; a companion slain after half have fallen; the leader slain or fled; can't harm the enemy; surrounded; outnumbered 3:1; retreat becomes reasonable, when the party's HP share first reaches 2×, 3× and 4× the foes' (not solo bosses; M31, M37). Fear from the party that takes a foe to frightened 2 or more counts too (M25), and so does fleeing for any reason, as it begins and at the start of each of its turns while it lasts (M32); on those checks a failure only raises frightened by 1, and a critical failure gives up (M29).
- **The gate:** checks happen only while the party is clearly winning. The party's HP left, as a share of what it started with, must be at least 1.25× the foes' share, and 0.5× more for each PC down (M37); foes down, fled or surrendered count as none (M28). Fear from the party (frightened 2+) and fleeing count anyway. A check the gate blocks is lost, not saved for later (M27).
- **The check:** d20 + its Will + modifiers against PF2e's DC for the party's level, −1 per level the creature is below the party (+1 above); −4 once a quarter of its side has fallen, −6 from half (M37). Weaker foes give up sooner; bosses (Boss Resolve) and stronger foes hold.
- **A failure means it gives up:** it flees or surrenders by its template; fanatics fight recklessly instead. When a third of the surviving foes have given up (those who surrendered or fled on a failed check count, M30), while the gate is open, the rest flee and the fight ends with a pursuit Strike for each PC (M37); those fighting to the death stay.
- **Read the fight (M38):** with each side-losing check its morale held, while the gate is open, a foe rolls Perception against the same DC, its side's losing signs as bonuses as large as their morale penalties. On a success it sees the fight is lost: it yields if it speaks a language, otherwise it leaves (fleeing, not frightened). Not fanatics; a solo boss only once Boss Resolve would let it break.
- **Surrender is an offer (M38):** the simulated party accepts (the creature is captured), except a kill objective's target or with the setup's "No quarter" tick. Refused, or a creature leaving harmed by a PC (not a Reactive Strike), it and the allies who saw (still fighting, not blinded) fight to the death: no more morale or Perception checks.
- **Simulated PCs play for morale** (a setup tick, M23): it changes how the simulated PCs act, not the rules (M26). They value fear by the chance it makes a foe give up, and the foes' leader by the breaks its fall brings.

**Automatic creature settings** (saved on the actor, changeable per run):

- temperament by creature type (M36), the first that fits:
  - a monster's summoned creatures, minions and summoned creatures; mindless, construct or ooze → None
  - undead (not mindless) → Fanatical
  - devils → Disciplined; demons → Fanatical; daemons and other fiends → Typical (a fiendish animal stays Bestial)
  - monitors (aeons, psychopomps, proteans…) → Fanatical; celestials (angels, archons, azatas…) → Disciplined
  - troops → Disciplined, except a pack or herd of animals with no humanoids → Bestial
  - animals, beasts and swarms → Bestial
  - humanoids by the role in their name: cultists, zealots, fanatics… → Fanatical; mercenaries, bandits, pirates, thugs… → Mercenary; guards, soldiers, knights, veterans, captains… → Disciplined; other humanoids → Typical
  - dragons, fey, aberrations, elementals, giants and everything else → Typical
- a single foe 2+ levels above the party → solo boss (Boss Resolve)
- 3 or more foes with the same name → a Group
- highest-level foe → leader
- the target of a kill/capture objective → Cowardly

### Morale checks in play (2026-10-09)

The same rules at the table (M34): `src/live/morale.js` runs the engine's own morale code (`collectMoraleChecks`, the DC, the modifiers, Boss Resolve, a fanatic's first failure, what a result does) against the real encounter; `scripts/morale-live.js` watches the fight and posts the cards; `src/live/morale-card.js` is the card.

- **When it looks:** after any change to a creature in a running encounter (HP, conditions, defeated, a token moving, a new round, a turn starting), once things settle (0.3 s). Only the active GM's client acts; the "Morale checks in play" world setting (on) turns it off. Every encounter with party and foes counts, test fights included.
- **What it compares:** what each foe looked like at the last look (up, HP, frightened, fleeing). A foe dropping (from half its HP or more at once: overwhelming), leaving the tracker (still a loss), frightened rising, or fleeing starting becomes the engine's event; at a foe's turn start it checks fleeing again and "can't meaningfully affect an opponent". The side's crossings come from the engine as in the simulator. Any frightened gained in combat counts as fear (the source isn't always recorded).
- **Memory** (kept per encounter, saved on the combat only when a card is posted or applied): the roster as the encounter began, the side's crossings, each foe's check state (one check a round, Boss Resolve used, gave up, …), and the last look.
- **The card:** whispered to the GMs, one per event, a row per foe: DC (PF2e's for the party's level), modifiers as tick boxes (the ones that apply now ticked; the GM's calls such as defending home, no retreat, a bestial lair or an unpaid mercenary offered unticked unless the encounter's saved situation has them). **Roll** rolls the foe's PF2e Will save with the ticked modifiers against the DC, GM-only; **Roll the rest**; **Apply** once all have rolled. A solo boss's first check shows "Boss Resolve: holds" with no roll.
- **Read the fight (M38):** a row whose foe also reads the fight rolls its PF2e Perception after the Will save (GM-only, "Read the fight DC"), with the ticked morale modifiers among the losing signs turned into bonuses.
- **Apply** (the final degree after a fanatic's first failure and Boss Resolve): critical success frightened −1; success nothing; a fear or fleeing check's failure frightened +1 (up to 4); giving up: rout = fleeing and frightened 2, collapse = a "Surrendered" effect and the combatant marked defeated, disordered = fleeing, berserk = frightened 1 and a 1-round "Berserk (morale)" effect with −1 AC. Held with a successful read: a "Yielding" effect and **Accept / Refuse** on the card (it talks), or fleeing and a "Leaving" effect. The GM moves the tokens. What Apply changes is noted in the memory, so its own frightened +1 or fleeing sets off no new check (M29).
- **Surrender offers (M38):** Accept makes one that yielded Surrendered and defeated. Refuse, or PF2e damage (`damageTaken`) or a new condition on a creature that yielded, surrendered or is leaving, puts "Fights to the death" on it and on the allies who saw (foes within 60 feet, no wall between on the scene being viewed, not blinded or defeated); one leaving loses its fleeing, one surrendered is no longer defeated. A GM card says who and why, with **Undo** for harm that shouldn't count (a Reactive Strike as it left, which the module can't tell apart).
- **The rout card:** after a look or an Apply, when a third or more of the surviving foes are broken (those who gave up, fled or surrendered, and any foe fleeing) and the gate is open, once per encounter: the rest flee, one pursuit action each, end the encounter when ready. **Make the rest flee** routs those still fighting, except those fighting to the death.
- **The gate** is silent: while the party isn't clearly ahead, side-losing checks are lost with no card (fear and fleeing still come).

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

## Map objectives (O1–O3, 2026-10-08)

Three objectives about places: **hold an area**, **escort a creature to the exit**, and **retrieve an item and escape**. The user's decisions (2026-10-08):

1. **Strides to reach.** Fights stay on range bands. Each creature also keeps its distance in feet to the area and to the exit. A Stride toward one brings it a Speed closer. Its distance to the other comes from the triangle the three distances make (Stewart's theorem), using the area-to-exit distance. Leaving a Melee to move still takes a Step or a provoking Stride.
2. **Regions.** In the setup you pick a scene Region for the area and one for the exit. Feet are counted from each token to the Region's nearest square, using PF2e's diagonals. With no Region, you type Strides for each side, and the area-to-exit distance in Strides of 25 feet.
3. **Hold.** A round counts when, at its end, at least one able party creature is inside and no able foe is. It needs 3 rounds by default, and they don't have to be in a row.
4. **Escort.** You pick a party-side creature that isn't a PC. On its turn it Steps out of a Melee if it can (otherwise its Stride provokes), then Strides toward the exit. It never attacks. It gets away when a Stride ends inside the exit Region, and it fails if it drops to 0 HP.
5. **Retrieve.** The item starts in the area.
   - Picking it up takes 1 Interact action (manipulate, so it provokes; a critical hit disrupts it) and a free hand.
   - A two-handed weapon and a shield are let go while carrying: no two-handed Strikes, no Raise a Shield.
   - If the carrier goes down, the item drops where it fell. The PCs in its Melee are beside the item; anyone else reaches it as they would reach a creature there.
   - Foes never take the item.
   - Success comes when the carrier reaches the exit.
6. **Success ends the fight**, like Survive N rounds. The new outcomes are **held** and **escaped**, and both count as party wins.
7. **After a won fight**, the party finishes the objective unopposed, in turns of 3 actions starting next round. It fails only if the deadline round comes first.
8. **Deadlines.** Every map objective takes an optional deadline round.
9. **Foes contest it.** Foes value standing in the area, and they attack the escorted creature and the carrier as they would a protected creature. A creature in the area is worth more as a target to the other side.
10. **Live play.** At each new round, the active GM counts who is in the area Region and saves the record to the combat (`mapProgress`). Going back a round drops the rounds from it on. The Odds check starts from the rounds held so far. Who carries the item is a choice in the setup.

How it plays:

- **Engaging a creature moves you to where it is.** Two creatures are always at least as far apart as their distances to the area and the exit differ. A Stride to engage costs at least the Strides that distance takes. A creature too far away gets a Stride toward it (an "approach"), and range increments use the same distance.
- **The planner** values a map objective as a potential, 1/(1 + Strides) of its worth, so each Stride closer is worth something.
  - Holding is worth two of the rounds it needs. Only one creature per side needs to be inside, so a creature whose ally is already in gains little from going.
  - Retrieve is worth half its value up to the pickup, which counts as an extra action, and the other half on the way to the exit.
  - All of it is weighted by the objective's Low/Normal/High priority.
- **Speed:** the bands stay, so a fight costs about 1.4× as much with a map objective as without one (2–3.5 ms at level 5).

Measured on the level-5 benchmark party, typed Strides:

- Hold rarely ends a fight as "held", because the party usually wins first and then holds the area unopposed.
- Escort is hard when foes reach the merchant: 18% at severe threat.
- Retrieve usually ends as "escaped" within about 2 rounds.

The bestiary sweep with `--map` (1,106 creatures, each with hold, escort and retrieve) has 0 errors.

## Escalations (E1–E4, 2026-10-08)

Rules that change a fight partway: **when** something happens, **then** creatures arrive, a hazard starts, or danger starts. The user's decisions (2026-10-08):

1. **All four kinds:** triggered reinforcements, raising the alarm, hazards that switch on, and rising danger.
2. **"When → then" rules** in the Simulate window. Each rule fires once.
   - **When:**
     - round N (as it begins)
     - the alarm is raised
     - a creature you pick falls (drops, dies, flees, surrenders or is captured)
     - the foes are down to half their total HP (fled foes count as none)
     - the first foe flees
     - a party creature enters a Region
   - **Then:**
     - creatures arrive: picked from the encounter, after a delay (0 means the start of the next round; a round-N rule's start that round), near, far or at a Region
     - a hazard starts
     - danger starts
3. **Morale:**
   - when foe reinforcements arrive, wavering foes steady, and a shaken or wavering group too (`triggers.helpArrives`)
   - while the alarm's help is on its way, foes get +1 to morale checks (`modifiers.helpComing`)
4. **The alarm:** you mark foes as raisers in the creature table.
   - A **gong** raiser reaches its spot (a Region, or typed Strides) and spends 1 Interact action. That provokes, and a critical hit disrupts it.
   - A **runner** leaves the battlefield like a fleeing foe, and the alarm is raised once it's gone. A runner isn't counted as a loss for morale.
   - The alarm is raised once. Dropping the raiser stops it, and pinning it makes leaving provoke.
5. **When it's worth it.** The planner values raising the alarm as two rounds of the help's damage to the party, discounted by its delay. A runner also gives up its own two rounds. The PCs value the raiser more, by the damage the help would add.
6. **Hazards** (PF2e hazard actors on the foes' side):
   - A complex hazard takes a turn in initiative, rolled with its Stealth, using its routine's actions. It has its Strikes (no multiple attack penalty when its text says so) and its compiled actions.
   - A simple hazard fires its reaction once when a rule triggers it, at the creature that set it off: its compiled reactions, and its Strikes when the reaction says it Strikes. It is then spent.
   - A trap's own Strike the ability module reads (B301) is the one it names, at whom and how often its text says: the creature that set it off, or every party creature, once or twice.
   - A hazard can't move, and its Strikes reach anyone on the field.
7. **Disable or smash.**
   - Disable uses the hazard's own skill and DC. It takes 2 actions and provokes, like a task: success +1, critical success +2. It needs several successes when the text says "twice" or "three times". A critical failure sets it off at the one tampering with it.
   - Smashing it is attacking its AC, Hardness and HP. It's immune to critical hits, and one that has no HP can only be disabled.
   - The planner picks whichever is worth more, or ignores the hazard.
8. **Danger:** damage of a type you pick at the end of each round, rolled once a round, with an optional basic save that each creature makes. It hits everyone, one side, or everyone in a Region (downed PCs too, whose dying goes up). It can grow each round, and it lasts until the fight ends.
9. **Getting out of danger:** creatures weigh leaving a danger Region against fighting. The distance to its nearest edge is read from the scene, and a Stride toward the edge gets them out once it's covered.
10. **Hazard with no rule:** a complex hazard is on from round 1; a simple one waits for a rule.
11. **Live play** (`escalationProgress` on the combat):
   - At each new round the active GM checks the rules against the fight as it stands and notes the round each one fired. A round-N rule fires in round N; anything else in the round just ended.
   - Going back a round drops what fired from it on.
   - The alarm is a tick in the setup ("raised in round N").
   - A rule's creatures sit in the encounter with hidden tokens, and they count as arrived once their tokens are visible.

How it plays:

- **Creatures waiting on a rule that hasn't fired don't hold a fight open:** they may never come. Creatures already scheduled to arrive do.
- **Hazards don't hold a fight open** once the creatures are beaten, unless the encounter has nothing but hazards.
- **The reliability note** lists only hazards with neither Strikes nor reactions the simulator reads.
- **Reading hazards:** the ability module now compiles hazard actions too (its registry handles hazard actors). 27 of the 68 actions in PF2e's hazards pack compile: save-based reactions, and poisons that ride on Strikes.
- **Measured** (level-5 benchmark party; a sentry 2 Strides from a gong bringing two moderate guards): it raised the alarm in 48% of fights, and the party's win rate dropped from 100% to 78%. A runner left to fetch help in 72%.
- **Sweeps:** the bestiary sweep with `--escalate` (1,106 creatures × a round-2 arrival, fire with a Reflex save, and a gong alarm) and with `--map --escalate` both have 0 errors. So does a sweep of all 53 hazards in PF2e's pack.

## Setup and results

- **Input:** the Combat Tracker encounter, or the selected tokens.
- **Starting state:** each actor's current state, or a fresh checkbox.
- **Per-run options:**
  - ambush for a side (Stealth initiative; the other side is surprised)
  - cover for each side
  - reinforcements ("arrives at round N in band X")
  - an objective (with Regions on the scene for a map objective)
  - escalation rules, and alarm-raisers in the creature table
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

