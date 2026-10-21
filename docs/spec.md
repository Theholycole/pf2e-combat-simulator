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

- **Losing gate:** on since M24. Since M39–M40 it compares each side's strength (Lanchester's square law): HP left × damage potential, the party's at least 3.25× the foes'. M28's HP share (the party's share of its starting HP at least 1.25× the foes') is still a setting. See M2, M24, M28, M39 and M40 in [morale-decisions.md](morale-decisions.md).
- **Party retreat with no objective** happens when two PCs are down and the foes are more than twice as strong by the same measure (strength below 0.5×; 2026-10-14, was below 1× by this round's damage).
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

### Scrolls, wands and staves (S22, 2026-10-14)

The user asked: "can we get the simulator to treat scrolls, wands and staffs as spells the creature can cast?" The rules are S22 in [spell-decisions.md](spell-decisions.md).

- **Snapshot** (`scripts/snapshot.js`, with the pure parts in `src/adapter/items.js`):
  - scrolls, wands and spell gems through the spellcasting PF2e would cast them with (`canCast` with the item as origin, best DC), or Trick Magic Item;
  - PF2e Dailies' staff entries (category `charges`) with their charges;
  - without them, the staff read as Dailies reads it.
  - Each becomes a spell spec with `from` (the item's name, for the log), `item`, a pool (`item:<id>`, `staff:<id>`, `charges:<entry>`) and, for a staff, `poolCost`.
  - A wand also gets an overcharge spec (`overcharge`: the wand's pool) with a pool of 1.
  - Items that can't be used are gaps: stowed, unidentified, or no one can cast the spell.
- **Engine:**
  - `poolCost` (a staff's charges by rank) in `canCast`, the planner's plans, damage potential and the cast.
  - `c.desperate` (`desperate` in `fight.js`, set as a turn starts) gates the overcharge.
  - A Trick Magic Item cast costs an action more. The check is rolled when the cast starts; a failure gives the cast's actions back.
- **Bestiary tools** (`tools/lib/pack-spells.mjs`): NPCs' scrolls, wands (fresh) and staves the same way. 127 bestiary NPCs carry some (48 wands, 48 staves); no compile errors.
- **Live check in `pftest`** (PFTEST SIM Ezren Items, Valeros Items, Watchmage Items):
  - The iconic Ezren's own Wand of Mystic Armor and Scroll of Grim Tendrils are read, along with the scrolls and wand added for the check.
  - His Staff of Fire stays with its own spontaneous entry.
  - Valeros tricks a Scroll of Fireball: Arcana +1 vs DC 20, then spell DC 16.
  - The Watchmage's Staff of Fire, read from its description: 3 charges.
  - In fights, Ezren casts from his scrolls once his prepared Fireball is spent, and Valeros' tricks roll and cast.
- **Live check with PF2e Dailies 4.23.0 on PF2e 8.6.1** (2026-10-14):
  - Ezren's Staff of Fire, prepared through Dailies' own dialog: 3 charges, DC 21, Ignition and Breathe Fire.
  - It's read as a `charges` pool (Breathe Fire costs 1; 1 left after spending two, 3 when fresh).
  - The iconic's own "Staff of Fire" entry is skipped while Dailies has the staff, so its spells aren't counted twice.
  - In fights with only the staff's spells, Breathe Fire is cast at most 3 times a fight.
  - All 43 PFTEST SIM actors read on 8.6.1 without errors, and the worker pool's 200-fight batch matches a single-thread run.
- **Stowed items** (2026-10-14): a stowed scroll or wand is taken out with PF2e's retrieve cost (`spec.draw`: actions, and whether each cast needs it), as part of the cast or alone (`drawItem`) when the cast won't fit after it; `c.itemsAtHand` holds what's out.

### Consumables (U1, 2026-10-15)

The user's rule for when creatures use items is U1 in [item-decisions.md](item-decisions.md).

- **Snapshot** (`readConsumables` in `scripts/snapshot.js`): the creature's consumables (not scrolls, wands or spell gems) through `core.registry.preparePlans`; the item module's plans carry `plan.item` (category, level, uses, recipient, activations). `itemEntry` (`src/adapter/items.js`) makes each a spec with `kind: "item"`, a pool `item:<id>` of its uses, `consumable`, `drinker` and `draw` (0 held, 1 worn, PF2e's retrieve cost stowed). Its PF2e effects are modelled at the item's level. Those it can't play stay gaps; partly played ones are listed as "item, partly simulated". Without the item module, consumables stay gaps as before.
- **Engine:**
  - `consumables.js`: `CONSUMABLE_MARGIN` (1.5; `options.consumableMargin`), `expectedIncoming`, `goingDown`, `urgentHealing` and `consumableWeight`, which the planner multiplies a cast's gain by.
  - `targetSets`: a drinker item reaches the creature itself and allies in its Melee; a healing one also a downed PC.
  - The log: "drinks", "feeds … to", "uses … on". The stats count items used by each side (`partyItemsUsed`, `foeItemsUsed`), shown in the report.
  - Items aren't spells: no Quickened Casting, stupefied flat check, counterspell or Spellstrike; magical only by their traits.
- **Bestiary tools** (`tools/lib/pack-items.mjs`, `npcItems`): NPCs' consumables compiled by the item module beside the simulator (read only; none without it), from the equipment pack's text when the creature's copy is short. 384 bestiary creatures carry consumables; 208 have at least one the simulation plays (healing potions, Elixirs of Life, darkvision and other elixirs, Potions of Flying). `deadliness.mjs` gives monsters theirs.
- **Bombs** (U2): `strike.ammo` ({ pool, count, reagents, startsEmpty }) with `consumable` and a reload of 1 (none with Quick Bomber); the pool `item:<weapon id>` and, for an alchemist, `reagents` in `spellPools`. `ammoLeft` and `spendAmmo` (`combatant.js`): `strikeUsable` needs one left, `strikeOnce` spends one, the planner plans no more throws than are left (its `fired` marks) and weighs a PC's. `c.unloaded` starts with bombs not in hand. The bestiary tools read an NPC's linked bomb weapons the same way.
- **Item casts** (U3): `itemEntry`'s `cast` ({ plan, castRank, dc, attack }) from `itemCast` in the snapshot (the registry's plan for the spell) or `spellNamed`/`compileSpell` in `pack-items.mjs`.
- **Poisons** (U4): `itemEntry`'s `onStrike` (an injury poison a Strike lists): the plan's trigger a free Strike rider; `triggerRiders` and `freeRiderGain` need a dose left (`poolReady`). `spellGaps` counts an affliction with stages as played.
- **Lasting areas** (U5): `itemEntry`'s `zone` ({ effectModel, effects }) → `zoneEntry`: `zoneSpell`'s zone ability as an item (its pool, draw and activation); `castPlan`'s zone branch counts it as an item used.
- **Taking items out** (U6): `drawActions`, `isBelt` and `beltHeld` (`src/adapter/items.js`); `itemDraw` and `belted` in the snapshot for scrolls, wands, consumables and bombs. The bestiary tools give an NPC's worn scrolls and wands a draw of 1.
- **Items used by Striking** (U7): `itemStrikeActivity` (`src/adapter/items.js`) makes `plan.strike` a Strike activity with `range`, `pool`, `casts`, `item`, `consumable` and `traits` (FEAT_BOOSTS: Fear Gem with Intimidating Strike). The planner counts the pool (`pool:` marks), takes the Strike by `range` (unset: melee, as before) and weighs a PC's; `strikeActivity` spends one. `readConsumables` and `npcItems` return them as `activities`.
- **Concentrate** (U8): `actionTraits` and `traitsAllowed` (`spells.js`) for spells, items and Strike activities in the planner; `strikeActivity` provokes by its traits and ends when disrupted; `addBuiltin`'s Strike activities and the snapshot's feat activities carry their traits.
- **Counteract consumables** (U10): `itemEntry` gives an item `counteract` (`plan.item.counteract`) and a counteract-only one an empty automatic check, drunk or applied; `castSpell` runs `applyItemCounteract` on its targets; `spellExpectation` adds `itemCounteractWorth` (spells.js: `itemCounterables` over condSources, counter-carrying effects and afflictions).
- **Roll-twice talismans** (U11): `itemFortune` (`src/adapter/items.js`) makes the item module's "roll-twice" plans `c.fortuneItems` ({ selector, pool, … }; FORTUNE_EXTRAS for Gorum's Tear and Eye of Apprehension). `fortune-items.js`: `attackFortune` (strikeOnce, before the roll; `circumstancePenalty` in actions.js), `afterAttackFortune` (the off-guard, with a turn-start timer) and `initiativeFortune` (rollInitiative, after `computeThreats` when someone has one; HARD_FIGHT 2/3).
- **Persistent damage recovery** (U12): `itemEntry`'s `recovery` ({ types, dc }) and `free` (no margin, `consumableWeight`); `castSpell` runs `applyItemRecovery`, `spellExpectation` takes `itemRecoveryWorth` off the target's damage.
- **Reductions and items for others** (U13): `itemEntry`'s `reduce` (each entry `on` "targets" or "user"); `castSpell` runs `applyItemReduce`, `spellExpectation` adds `itemReduceWorth`. `itemReduceTrigger` (REDUCE_TRIGGERS: Lion Badge) → `c.reduceTriggers`, used by `reduceOnGain` as a save's condition lands.
- **Spellguns** (U14): `itemEntry`'s `ownAttack` (the kinds `plan.ownCheck.choose` allows, when the plan sets no modifier; "attack" added to its traits); `prepareSnapshot` runs `ownAttacks` (consumables.js), which sets `ownAttacks { spell, firearm }` and `attack` (their best) or drops the entry; `simContext` rolls `ownAttackModifier` less the multiple attack penalty.
- **Retaliation potions** (U15): `itemEntry`'s `retaliation` { parts, adjacentMelee, rounds } (its resolution emptied, as a counteract-only drink); `castSpell` runs `applyItemRetaliation` (`c.retaliations`, each `until` a round) and, for a touch spell, `touchRetaliation` on its targets; `strikeOnce` calls `touchRetaliation` after a melee hit ("unarmed", or "weapon" without reach); `spellExpectation` adds `itemRetaliationEntries`, damage entries on the drinker's foes.
- **Rune oils** (U16): `itemEntry`'s `rune` { key (PF2e's, `runeLoanKey`), name, rounds } for a rune in runes.js `RUNE_LOANS`; `castSpell` runs `applyItemRune`: an effect on the user with `strikeDeltas` (parts `vsUndead`) and `runeLoans` for its best weapon Strike, quickened for Quickstrike; `runeCritEffects` reads lent runes too (RUNE_CRITS `undead`); `applyCondition` takes `{ mode: "while", persistent }` (ended by `endWhileConditions`).
- **Item actions** (U17): `itemEntry` turns `builtin: "item-action"` into the action's own plan (`action.basic`, another skill by `action.statistic`) with `itemAction` { slug, minimum, bonus }; `simContext` rolls the higher of the user's skill and `minimum.value`, plus `bonus`; the planner's size limit reads `itemAction.slug`.
- **Generic Spellgun** (U18): an entry whose plan has `spellgun.spell` is played at `plan.rank`.
- **Owner DCs** (U19): `itemEntry`'s `ownerDC` ("class", "spell", "class-spell"); `prepareSnapshot` runs `ownerDCs` (consumables.js), which sets the entry's `dc` (and a cast's `attack`).
- **Triggered items** (U20): `hasTrigger(html)` (a Trigger in the Activate block, before the first `<hr>`); `itemEntry`'s `triggered` option returns null for a plan whose trigger is "use"; `npcItems` and `readConsumables` pass it (the snapshot adds a gap). `npcItems` passes `ownerLevel` and `ownerAbilities` to `compileItem`.
- **Items on their trigger** (U21): `itemTriggered` (items.js, `PLAYED_TRIGGERS`: "after-strike") → `c.triggeredItems` (`npcItems`' `triggered`, the snapshot's); `src/engine/triggered-items.js` `afterStrikeItems` from `strikeOnce` after a hit (`hardFight` from fortune-items.js for a PC).
- **Bomb riders** (U22): `bombRider(plan, strikeName)` (items.js) on the item module's `compileBomb` plan → a free Strike rider (`trigger.strikes` the Strike's name) in `c.spells`; `npcItems` adds them for an NPC's linked bombs, the snapshot's `bombRiderOf` for a PC's.
- **Ammunition** (U23): `itemStrikeActivity`'s `ammunition`; strikes carry `ammoType` (PF2e's `system.ammo.baseType`); the planner's strike-activity candidates `loads` it.
- **Damage choices** (U24): `itemEntry` runs `withTypeChoices` — `damageChoices` that differ only in type become `resolution.native.damageTypeChoices`, answered by `chooser`.
- **Low-value options** (2026-10-15, the user: "Make a note of that and any other item, spell or ability that is low value in the simulator for testing later"): `tools/low-value.mjs` and [low-value.md](low-value.md). 301 of 465 playable consumables are never used even with no margin (18 used the most, possibly over-valued), 324 of 997 spells are never cast alone, 240 PF2e ability names on several creatures and 768 of one creature are never used.
- **Not live-checked yet** (pftest busy, 2026-10-15).

### More spells (2026-10-14)

The user: "i want more spell coverage in the simulator. Spells like shield, Wails of the damned, evil eye, calm. These are just a few examples that need more work". Decisions S23–S27 in [spell-decisions.md](spell-decisions.md).

- **Wails of the Damned:** only the creatures a spell can affect fill its area (S23); "Drained 1d4" is rolled (S24; the core keeps `valueRoll`).
- **Shield** (S25): `effects.js` reads PF2e's Spell Effect: Shield as `spellShield` ({ ac, hardness }); `createCombatant` gives a creature without a shield a spell shield (`shield.spell`) the engine's Raise a Shield and Shield Block play.
- **Calm and the charms** (S26): `src/engine/pacify.js` (`pacifyOf`, `pacify`, `hostility`, `pacifyTurnStart`, `pacifyWorth`). The core passes a note's degree, so Calm's critical failure is told apart.
- **Notes with rules** (S27): `noteModel` in `spells.js`.
- **Evil Eye and condition floors** (S28–S29): `src/engine/readings.js` (`withReading`, used by the snapshot and the bestiary tools' `compileSpell`); `src/engine/floors.js` (`addFloor`, `floorOf`); the core passes a plan's conditionFloor as an effect change of kind `floor`. `src/engine/lasting.js` runs what lasts after a spell (Calm's pacification, floors): their end and the caster's Sustain at its turn start.
- **Condition notes and Stabilize** (S30–S31): the core's `condition-note` and `stabilize` families (`src/families/condition-note.js`); `ownHostility` in `pacify.js` ends what goes with its holder's hostile action; `offGuardFrom` makes a hidden attacker's target off-guard. Census after this batch: 257 spells fully modelled (was 231); weighted by the bestiary creatures that carry them, "not cast" 5,353 (was 6,096).
- **Counteracting and afflictions** (S32–S33): the core's `affliction-care` family; `src/engine/counteract.js` (`counterables`, `counterChance`, `counterRoll`); effects carry `counter` { dc, rank, spell }, conditions `c.condSources`. Census after this batch: 258 fully, 731 in part; "not cast", weighted by the creatures that carry them, 4,641 (was 5,353).
- **Notes as states** (S35–S37): `src/engine/note-states.js` (`noteState`, `applyNoteState`, `noteStatesTurnStart`; `c.reactionLocks`, `c.dancing`, `c.commanded`), with `lasting.js` ending them; fascinated and deafened among the engine's conditions. A fuller census (it now reads each spell's PF2e effects as the snapshot does): 461 spells fully modelled, 528 in part, 489 utility, 539 not cast; weighted by the creatures that carry them, 9,104 / 5,486 / 6,472 / 4,641.
- **Lingering areas and unread areas** (S38–S39): `startLingering` in `zones.js` (a zone's `castAs` carries the spell's numbers; `saveSpell` marks `fromZone`); `withArea` in `readings.js`. Census: 547 spells fully modelled, 444 in part, 537 not cast (weighted: 9,689 / 5,066 / 4,476).
- **Trait damage, vampiric temporary HP, Speed, recurring saves** (S40–S43): the core's save family adds conditionalDamage; `applyChanges` gives casterBenefit's temporary HP; `withDefences` in `effects.js` changes Speed; `withRecurringSaves` in `readings.js`. Census: 573 spells fully modelled (10,293 weighted).
- **The snapshot slims plans** (rows' own words go): the readings run before it, and what the engine needs at cast time from a row's words is kept as `plan.rowFlags` (Calm's critical failure). Found in the live check before v0.9.0: Confusion's recurring save and Calm's critical failure had fallen back in Foundry.
- **Summon spells** (S44): `spellSummonEntry` / `summonEntries` in `summons.js`; the snapshot's `readSpells` and the bestiary tools' `npcSpells` return them as `summons`, made into reserves as an ability's are. Census: 586 fully modelled.
- **Telekinetic Maneuver and Sanctuary** (S45–S46): `maneuverWays` in `readings.js` (the snapshot passes the ability module's basic actions; the bestiary tools pass theirs to `npcSpells`); `src/engine/wards.js` with the core's `attack-ward` family.
- **Truesight** (S47): the core's affliction-care family passes a see-through ward as `true-sight`; `src/engine/sight.js` (`seesThrough`, `hiddenFrom`) for Strikes, targeted spells and the hidden attacker's off-guard.
- **Controlled** (S48): `src/engine/control.js` (`takeControl` from `applyCondition`, `controlTurnStart` as every turn starts; `state.controlled`); `withRecurringSaves` also reads the row's original words from `compilerEvidence.savedRows`.
- **Notes in a fight** (S49–S53): `pacifyOf` reads an attitude note's own words; `withNoteReadings` and `noteKnown` in `readings.js` (Suggestion's stop-fighting note; notes played another way or with nothing in a fight, which `spellGaps` skips); `note-states.js` adds `no-actions` (`c.lostActions`) and `no-casting` (`c.spellLocks`, ended by `lasting.js`; `canCast` checks `spellLocked`); `effects.js` reads the `perception` selector. Census: 604 spells fully modelled (588 before), 406 in part.
- **Sure Strike, chains, splash** (S54–S57): `effects.js` reads RollTwice on attack rolls as `model.fortune` (`takeAttackFortune` in `strikeOnce` and `castPlan`); `chainFrom` in `spells.js` builds a chain's targets (`distanceBetween`), `castPlan` stops it at the first critical success and `spellExpectation` counts each target by the chance it's reached; `splashAround` deals splash to the target's Melee; `playedGap` drops the plan parts the simulation plays or that change nothing. Census: 615 fully modelled, 395 in part (weighted full 12,400).
- **Heightened counteracts** (S58): the core's affliction-care family adds a counteract's heightened conditions at the cast rank (`any` for Empty Inside's 5th) and passes `excludeTraits` and `nearMiss`; `counterables` skips sources with an excluded trait (`condSources` and `effect.counter` keep the source's traits); a near miss pushes a `restore` timer.
- **Familiars** (C28): the snapshot's `familiarsOf` and `readFamiliar` bring a PC's familiar in beside it (`familiar: { masterId, hexAbility, lifelink, focus }`, `acts: false`); `src/engine/familiars.js` (`hexFamiliar` from `castPlan` and `hexSustains`, which reads what `lasting.js` and `zones.js` note as Sustained; `lifelinkMaster` in `applyDamage`; `familiarFocusReady`/`familiarFocus` as the planner's `familiarFocus` action; `familiarKeepsUp`). `isHex` in `spells.js`: one hex Cast a turn. A familiar is worth a share of its master's threat as a target and is left out of morale's fighters and the mean threat. Live-checked in `pftest` with Feiya and Daji (PFTEST SIM).
- **A PC's sheet whole, part 1** (C29): the snapshot's `landSpeed`, `readFlies` (system.movement.speeds), `initiativeOver`, `deathAt`; `src/engine/runes.js` (`RUNE_CRITS` — C37 adds `trait`, `bleeding`, `already` and degree `rows` — `RUNE_IGNORES`, `keenCritical`, `runeCritEffects`, `ignoredResistances` in `adjustPart`); `noNaturalTwenty` on the target in `strikeOnce`.
- **A champion's sheet** (C30–C34): the snapshot's `readChampionSheet` (fields on `championReaction`, `huntPrey` for Smite, `oath`, `fearsomeBrute`, `battleCry`, `dreadGaze`, `heroesDefiance`, `lastStand`, `marchOfLaw`, strike activities and multi-Strikes); `src/engine/champion.js` (`championTriggered`, `retributionAfter`, `zealCritical`, `exaltedStrikes`, `heroesDefiance`, `lastStand`, `championOpening`, `demoralize`, `shatterDefenses`, `marchOfLaw`); `hitRiders` on multi-Strikes; `press`, `endsTurn`, `failureDice` on strike activities; the ignored resistances kept on a Strike's cached context. Vital Luminance (C35): `src/engine/luminance.js` (`castLuminance`, `luminanceTurnStart`, `luminanceStrikesBack` in `applyDamage`, `luminanceTarget` and `dismissLuminance`).
- **Conditional effect rules** (S60): `effects.js` — `usePredicate` (what the roll can settle), `model.saveBonuses` joined to the creature's `saveBonuses` while the effect lasts, `model.conditional` read by `effectBonus(c, on, options)` with `strikeRollOptions` (attack and damage in `attackModifier` and `strikeOnce`, AC in `targetAC`, the planner's attack); rules it can't test reported as `<key> (conditional)`. `withSuppression` in `readings.js` (`plan.suppresses`) and `deathThreshold` for Death Ward's Doomed.
- **Sharing with the spell module** (the user asked whether the simulator can borrow the spell module's automation when both are installed): it does for plans — the simulator casts what the spell module compiles, through the core. What can't be borrowed is the spell module's live code that carries a plan out, since it works on Foundry documents (Effects, chat cards, hooks); a rule both need runs in both only once its pure logic moves into the core.
- **Live check in `pftest`** (PF2e 8.6.1): Ezren's Shield cantrip reads as Hardness 10 at rank 3; in fights he casts it and Shield Blocks once; a scroll moved into his backpack reads as 2 actions to take out, and with his prepared Fireball gone he takes it out and casts it.
- **Census** (scratchpad `spell-census.mjs`, every non-ritual PF2e spell): 231 fully modelled, 719 in part, 489 utility, 578 not cast. The biggest gaps: resolution kinds the engine doesn't resolve (409 spells), PF2e spell effects it reads only in part (302), GM notes (228), spells with no creature targets (102), lingering areas (127).

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

**Party retreat:** two or more PCs are down, and either the objective has failed, or the foes are more than twice as strong (the party's HP × damage potential under 0.5× theirs; options `retreatDowns`, `retreatRatio`, `retreatBy`). Being behind counts as "can't be completed"; checking only for a failed objective made parties with an open objective fight to the last PC. Measured on paired fights (2026-10-14, each fight also fought to the end): at 1× by this round's damage, 2.6% of fights were retreats from fights the party would have won and 11.5% saved a party from a wipe; at 0.5× by potential, 1.5% and 11.4%, with wipes 0.2% → 0.3%. Waiting for 3 PCs down let 1.6% of fights end in wipes; retreating at 1 PC down abandoned 7% that would have been won.

### Fleeing, pursuit and surrender

- A creature that gave up on a morale check flees and leaves the fight once it reaches *far*.
- A creature fleeing from a spell or an ability (a PC too) runs to *far* and stays out of the fight until its fleeing ends, then comes back. Fleeing with no stated end ("for as long as it's frightened", or no duration at all, as in Vision of Death's critical failure) lasts while it's frightened, or else its next turn (user, 2026-10-08; before, such a creature left for good).
- If half or more of the surviving foes are broken, the fight stops. A foe fleeing from a spell or an ability counts as broken here (user, 2026-10-08). Each active PC gets one pursuit Strike against a fleeing foe they can reach. Downed foes are caught; the rest escape.
- A surrendered foe counts as captured, and PCs always accept.
- PCs use nonlethal attacks only against a capture target (−2 unless the weapon is nonlethal).

### Hero points

"When it matters" (2026-10-15, the user's choice; `src/engine/heroes.js`):

- Reroll a critically failed save, or a failed save against something that would take the PC out (damage that would drop it; paralyzed, stunned, slowed, blinded, confused, controlled, petrified, unconscious, fleeing; a death effect). The new result stands.
- Reroll a missed attack (a Strike or a spell attack) that would have dropped its target — with the first point too (before, only with two or more).
- Heroic Recovery (spend all) when a PC's dying value would reach death; a PC below a third of its Hit Points keeps its last point for it.
- A toggle removes hero points for comparison. Before this, PCs spent 0.1–0.3 of the party's 4 points in an extreme fight; now about 0.4–1.0 (benchmarks, whose monsters cast no spells — save rerolls add to it against casters).

## Morale

- **Rules:** "cleanup morale" (M24, 2026-10-08), the user's system inspired by `Morale.md` and `Improved Morale.md` (in the user's PF2e Notes, `03 Combat and Encounter Design/Combat Systems/`). Every trigger, modifier, DC setting and template is a data entry with an id and an enabled flag, and can be overridden in the world settings. Improved Morale's waver stage, group checks and recovery are still there, switched off.
- **Decisions:** [morale-decisions.md](morale-decisions.md) M1–M34.

**Design goal** (the user, 2026-10-08): morale should shorten fights the party is winning as much as it can, with little effect on the win rate. The rules are the same whether or not the players play for morale (M26).

**How it works (M24–M40):**
- **When:** foes check only once their side is losing: 25%, 50% and 75% of the side fallen; a companion slain after half have fallen; the leader slain or fled; can't harm the enemy; surrounded; outnumbered 3:1; retreat becomes reasonable, when the party's HP share first reaches 1.5×, 2× and 3× the foes' (not solo bosses; M31, M39). Fear from the party that takes a foe to frightened 2 or more counts too (M25), and so does fleeing for any reason, as it begins and at the start of each of its turns while it lasts (M32); on those checks a failure only raises frightened by 1, and a critical failure gives up (M29), only while the gate is open; before, it raises frightened too (M39).
- **The gate:** checks happen only while the party is clearly winning: its strength at least 3.25× the foes' (M39, M40). A side's strength is its creatures' HP left times their damage potential: each one's damage per round over the next 3 rounds, its limited spells and abilities only as often as it has uses left (one that recharges, once), otherwise its best Strike (a weakened grip counted, a dropped weapon gone). Foes down, fled or surrendered count as none. Fear from the party (frightened 2+) and fleeing are checked anyway. A check the gate blocks is lost, not saved for later (M27). (The HP-share gate of M28 and M37, 1.25× plus 0.5× per PC down, stays as a setting.)
- **The check:** d20 + its Will + modifiers against PF2e's DC for the party's level, −1 per level the creature is below the party (+1 above); −4 once a quarter of its side has fallen, −6 from half (M37). Weaker foes give up sooner; bosses (Boss Resolve) and stronger foes hold.
- **A failure means it gives up:** it flees or surrenders by its template; fanatics fight recklessly instead. When a third of the surviving foes have given up (those who surrendered or fled on a failed check count, M30), while the gate is open, the rest flee and the fight ends with a pursuit Strike for each PC (M37); those fighting to the death stay.
- **Read the fight (M38):** with each side-losing check its morale held, while the gate is open, a foe rolls Perception against the same DC, its side's losing signs as bonuses as large as their morale penalties. On a success it sees the fight is lost: it yields if it speaks a language, otherwise it leaves (fleeing, not frightened). Not fanatics; a solo boss only once Boss Resolve would let it break.
- **Surrender is an offer (M38):** the simulated party accepts (the creature is captured), except a kill objective's target or with the setup's "No quarter" tick. Refused, or a creature leaving harmed by a PC (not a Reactive Strike), it and the allies who saw (still fighting, not blinded) fight to the death: no more morale or Perception checks.
- **Template personalities (M41):** Bestial foes also check once their own HP falls below half; Mercenaries give up without a roll when their paymaster (the side's leader) drops or flees, whatever the party's lead, and read the fight with +4; Disciplined foes hold formation (no side-losing checks while their leader stands; −2 more once it's gone); Cowardly foes also check on first blood and on their side's first fall, before the party is ahead too.
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
- The engine runs on a pool of Web Workers, one per spare core (at most 8), so Foundry stays responsive, with a fallback to the main thread (`scripts/runner.js`). Each batch is cut into one slice of its fights per worker (`runFights` from to to; a fight's dice come from the batch's seed and its number alone) and the main thread builds the report from the slices in order (`batchReport`), so it's the report one thread gives. Compare, the morale rule impact and the adjustments run their batches the same way and are assembled by `compareFromReports`, `moraleImpactFromReports` and `adjustmentsFromReports`.
- **Speed (2026-10-14):** measured in `pftest` on a 16-core machine (8 workers), the same reports as one thread: 500 fights of four PCs against four foes in 2.3 s (one thread 12.8 s), a morale Compare 3.9× faster, the morale rule impact 3.6× faster; the odds check finishes its 200 fights in about 1.1 s. One thread is also about twice as fast as before: spell outcomes are shared by the fights of a batch, the planner's `expand` is split into parts the optimizer takes, and a spell's roll options, action counts and castability are read once.
- **The sample fight** (2026-10-15, the user: "for the sample fight can we make that text copyable for sharing?"): a Copy button puts the fight's log on the clipboard as plain text (Foundry's clipboard helper; where the clipboard is refused, the text is selected for Ctrl+C), and the log can be selected by hand (Foundry turns text selection off in its windows).

## Benchmarks

Encounters are built from the GM Core creature-building tables and a level-matched martial party. They are checked against the encounter guide:

- win rates fall in order from Trivial to Extreme
- Trivial and Low are won almost every time
- Extreme is roughly a coin flip

Milestone 1 has no spells, healing or class features, so the bands are loose and tighten as content arrives.


## Danger ratings (2026-10-20)

The user: "rank each monster in the compendium based on how dangerous they are for their level … a number next to their name in the compendium that we can also sort by", then "in the compendium browser", then "add a button in the settings for people to run the simulator again for the compendium danger numbers".

- **The number:** a creature's danger for its level, in levels above (+) or below (−) the typical creature of its level, by the deadliest-creatures study's method: each creature against the standard party of its level (src/engine/party.js) to the end; a ladder of moderate creatures (GM Core's tables) for "fights like a creature N levels higher"; the median creature of each level as the typical one (a by-the-book creature where a level has fewer than five). "≈" past the ladder's top (an estimate), "≤" at its foot (at most). Data slips and April Fools creatures get none. The counting and the ranking are src/engine/danger-scale.js, shared by the offline tool and the in-Foundry run.
- **The module's numbers:** src/data/danger-ratings.json, from `node tools/deadliest.mjs <folder> screen --fights=100`, `ladder`, `ratings --write=src/data/danger-ratings.json` (every PF2e and Battlezoo creature; ids and numbers only).
- **Where they show:** Foundry's compendium windows (a badge beside each name, a skull button to sort) and PF2e's Compendium Browser's Bestiary tab (a column before the level, "Danger for level" in its sort): scripts/danger.js, src/live/danger.js. A client setting turns them off.
- **Run again in a world:** a settings menu (scripts/danger-run.js) runs the same method in the GM's browser on the simulator's workers (src/engine/worker.js, kind "danger"): the ladder (its fights 4 times a creature's), then every creature of the ticked compendiums, read as in play (readActor), the party's spells from the core's registry and its basic actions from the ability module. The result is a world setting, used before the module's file until the GM goes back to the module's numbers.
- **One creature alone** (2026-10-20, the user: "add the option to simulate a single monster to update their danger rating, so in the future if we update 1 monster we can run them alone and not have to simulate every monster in the game again"): the numbers keep their scale (the ladder's curves and each level's typical creature: `scale`, with a `run` stamp). In Foundry, a creature's right-click menu in its compendium (GM) rates it again: the same fights and seeds a full run gives it, across the workers, placed on that scale (src/engine/danger-scale.js rateAlone); kept in a world setting over the numbers it was rated on (src/live/danger.js withAlone), dropped when a new full run is made or the numbers change. Offline: `screen --only=…` re-screens those creatures into a finished run, then `ratings`.

## Spell power (2026-10-21)

The user: "rate spells and give them a score just like creatures. be sure to include different scores for heightened versions if significantly different as well as a conditional score for spells that sometimes do more such as Sunburst doing more damage against undead"; their choices: in the party caster's hands, against a boss and a group, every installed spell compendium. A first try fought each spell out (one cast in a whole fight, 100 fights): the differences were the size of the noise, and the AI's choices (spells never cast, a wizard swarmed after a two-action cast) decided the numbers; the user chose "Effect of one cast" instead.

- **The number:** a spell's power for its rank — how many levels more (or less) one cast eases a fight than the typical (median) spell of its rank; cantrips among cantrips. src/engine/spell-power.js.
- **One cast:** the standard party at the lowest level that casts the rank (2 × rank − 1), its wizard's DC and attack; the spell at its best (the target set and action count that do the most) into a moderate boss (one creature 2 levels up) and a moderate group (four 2 down), everyone in the near band (an area holds half its room of foes standing apart: a 20-foot burst catches the four). What it does: spells.js spellExpectation, the simulator's own expectation.
- **Its share of a fight:** damage over the foes' Hit Points; conditions on a foe and spell effects on an ally in rounds of its threat over three rounds, by its share of its side; healing, and harm to its own side, over the foes' harm — what they'd take off the party in three rounds (each one's damage potential a round, the planner's): healing a tenth of it is as good as a tenth of the foes gone (the party at half its Hit Points). In levels: ln(1 − share) / ln(0.7); 95% or more is "atLeast".
- **Duration** (the user: "rate spells based on their duration too so you dont give walls a bad rating by evaluating effects upon cast only"): a lingering area's effect comes again each round it lasts, as often as foes stay in it (half the time; a quarter for one that acts as they enter; three quarters for one the caster aims each Sustain); a spell Sustained to strike again (or used again each turn) once more a round (once more in all when it must recharge); both up to the fight's length (the foes' Hit Points at the party's damage a round, one to three rounds). Damage again each time, up to a creature's Hit Points; conditions and effects half as much again each time (some are on still). Conditions, spell effects and persistent damage already count their own durations.
- **Heightened:** each rank PF2e's heightening data (or the text's Heightened entries) names — a summon every rank, as the summon trait lists — at that rank's party level, against that rank's typical spell; the tooltip shows those half a level or more from the spell's own.
- **Against a trait:** traits its extra damage (conditionalDamage), vitality damage (undead), holy (fiends) or unholy (celestials) trait, or targets name: the same with foes of that trait (undead: the usual immunities; fiends and celestials: weak to holy, or unholy — 57 of the Monster Core's 73 fiends, 29 of its 37 celestials — 3 at 1st and 2nd level, 5 to 8th, 10 to 14th, 15 to 20th). The user: "list when a spell is conditionally more useful": a "*" after its number, and "More useful against …" in its words.
- **Summons** (the user: "run summons picking the best possible summoned creature … Include summons in this for when a specific creature is especially useful"): the ten strongest creatures it allows (level plus danger rating) from the Monster Cores, NPC Core and Bestiaries 1–3, each beside the party — its damage a round (the planner's potential at two actions: two Strikes, or a spell or ability it has, a breath weapon as it recharges; for 2.5 of the 3 rounds) as a share of the party's with it (the fight that much shorter), and the foes' attacks it draws as one more body on the party's side, up to its Hit Points, over the foes' harm — the best kept, named in the tooltip at each rank. Against each trait's foes the best there too, listed where it's a tenth more (a celestial's holy Strikes on fiends).
- **Minion spells** (the user: "minion spells assuming you already have a minion out"): one already out, as hurt as the party, the one ally the spell can go to — a summoned minion a moderate creature of the level the rank summons, a companion or eidolon of the party's level less two. A spell that spends it (Final Sacrifice explodes it) loses what it would have done (its summon worth). Familiar spells aren't rated (familiars don't fight).
- **Estimates** (the simulator doesn't play them; "~" before the number): walls (between the party and three in four foes: a barrier — Hardness or Hit Points — costs each a round going around or through it, a hindering wall an action and its damage each of two moves through it, a damaging wall its damage as they cross it, a screen a tenth of a round; damage at the cast rank), shields (Shield's for a round, Bone Shield's and Shielded Arm's for their duration: the foes' Strikes at the wizard less likely to hit, a Shield Block a round up to the hardness while the shield lasts), and utility spells whose text deals damage against a save or a spell attack (every foe in an area, else the creatures it names) or makes an area of difficult terrain (a hindering wall).
- **Not rated:** what the simulator can't cast, utility spells (those with fight words in their text listed apart: "utility, with fight effects the simulator doesn't play"), familiar spells, and spells with no effect it counts in either fight.
- **Where it shows:** compendium windows (a badge, a wand button to sort) and PF2e's Compendium Browser's Spells tab ("Power for rank"): scripts/danger.js, src/live/danger.js; a client setting of its own.
- **Made by:** tools/spell-power.mjs (screen with --only/--resume, ratings) on tools/lib/pool.mjs; tools/lib/spell-power.mjs finds the spells (PF2e's Item compendiums and every module's, rituals left out).

## The square grid (2026-10-21)

The user: "We should build an option for grid based movement in the simulator for effects that rely on that. We should also add choke points to simulate situations where area spells are forced to be interacted with vs being able to stride around"; their choices: generated layouts and the Foundry scene, PF2e's positional rules in full, an option per run (the range bands stay the default and run the danger and spell screens), and a choke-point score for spells.

- **Geometry** (src/engine/grid.js, pure): 5-foot squares; a creature's space by size (Tiny–Medium 1, Large 2, Huge 3, Gargantuan 4); PF2e distances (every second diagonal 10 feet; 10-foot reach reaches two squares on the diagonal); paths by Dijkstra over square and diagonal parity — blocked squares, walls between squares (no cutting their corners), difficult (×2) and greater difficult (×3) terrain, through allies' spaces but not foes', ending only in a free space; areas as templates (a burst from a grid intersection, an emanation around a space, a cone a quarter turn wide, a line 5 feet wide); line of effect (blocked squares and walls stop it) and cover (a creature between: lesser; a wall's corner: standard); flanking (the line between two allies' centres through opposite sides or corners).
- **Layouts:** open field, corridor (10 feet wide), doorway (two rooms, a 5-foot door), bridge (10 feet over a chasm); each side's spawns 30 feet apart (six squares between their fronts), the melee creatures in front.
- **In a fight** (src/engine/grid-fight.js; options.grid or setup.grid: { layout } or { map, squares }): creatures keep squares; after every move the engine's Melees and bands follow from them — foes who reach one another (either way) share a Melee (chained into one scrum; allies beside it join), a creature in none is near within 30 feet of a foe, else far. A Stride takes the cheapest way as far as its Speed pays for (toward a creature: to the cheapest square from which it reaches it, a flanking one when that costs no more; out of reach: 15–30 feet from the nearest foe when it can; away: as far as it gets); each foe whose reach it leaves on the way gets its reactions there, once, a disruption or a drop stopping it there. A Step: 5 feet to a square out of every foe's reach. Engaging at once (a teleport, an arrival into a Melee): the nearest free square in reach. Pushes and pulls: along the line between the two, until blocked.
- **The planner:** a position knows its square where that's known (where the creature stands; where a Stride toward a creature takes it) — reaching, distance, Strides to a creature (its path's feet over its Speed), the foes' Strides to it, flanking and line of effect and cover from there; a creature more than a Stride off gets a Stride toward it.
- **Areas:** each placement worth trying (a burst at the intersections about the creatures it might catch, within range and line of effect; a cone or line toward each; an emanation where the caster stands) and who's in it — the best few as the spell's target sets. Zones keep the squares they were placed on (an emanation about its maker, as it moves); their difficult terrain is on the map while they last.
- **Not on the grid:** map objectives (their own distances: a run with one stays on the bands); escalation Regions' moves.
- Band fights are unchanged (fingerprint 13bdec112c925c85). A fight on the open field takes about 50 ms, eight times a band fight.
