# PF2e Combat Simulator

A GM-only Foundry VTT module (Foundry 14, PF2e 8.5) that plays an encounter in memory many times and reports the odds. The simulations move nothing on the canvas and change no actor; only the morale cards' **Apply**, which the GM presses, sets conditions.

## Install

In Foundry go to **Add-on Modules → Install Module**, paste this manifest URL and click **Install**:

```
https://github.com/Theholycole/pf2e-combat-simulator/releases/latest/download/module.json
```

It needs **PF2e Resolution Core**, which Foundry offers to install with it. It recommends **PF2e Automatic Ability Resolution** (monster abilities, feat actions and basic actions in the simulated fights) and **PF2e Automatic Spell Resolution** (spells); without them those are reported as gaps. Foundry 14 and the PF2e system 8.5 or later. MIT licensed (see [LICENSE](LICENSE)); the Pathfinder rules text it reads comes from the PF2e system under Paizo's ORC license.

## What it does

- **Simulate…** (Combat Tracker): set up the encounter (sides, roles, morale, reinforcements, ambush, cover, a secondary objective), then:
  - **Simulate**: win %, objective %, PC danger, the most dangerous foe, a sample fight log, and what isn't simulated yet.
  - **Compare**: the same fights with morale, hero points, the objective or party retreat switched off.
  - **Morale rule impact**: every morale rule switched off in turn and ranked by how much it changes the outcome.
- **Odds** (Combat Tracker): the fight as it stands right now, 200 fights in about half a second (never more than about 2.5 s), whispered to the GM. **What would change the odds?** then tries making each kind of foe Weak or Elite, or removing one.
- **Simulate selected tokens**: shown when there is no encounter.
- **Real-fight log**: when an encounter with a player-owned PC begins, the odds are predicted quietly. When it ends, you're asked how it went. The log window (module settings, or the Simulate window) shows how well predictions matched reality. You can switch it off with the "Log real fights" setting.
- Macro API: `game.modules.get("pf2e-combat-simulator").api.open()`, `.oddsCheck()` and `.openLog()`.
- **Map objectives**: hold an area, escort a creature to the exit, or retrieve an item and escape. You pick the area and the exit from the scene's Regions, or type Strides by hand. In play, the rounds the party holds the area are counted at each new round, and the Odds check starts from there. See [docs/spec.md](docs/spec.md#map-objectives-o1o3-2026-10-08).
- **Escalations**: rules that change a fight partway. **When** a round comes, the alarm is raised, a creature falls, the foes are at half HP, a foe flees, or the party enters a Region, **then** creatures arrive, a PF2e hazard starts, or danger (damage each round, with an optional basic save) starts.
  - Foes marked as alarm-raisers head for a gong or run off to fetch help when the help is worth it.
  - Hazards take their turns or fire once, and the PCs can Disable or smash them.
  - In play, the round each rule fires is noted at each new round. See [docs/spec.md](docs/spec.md#escalations-e1e4-2026-10-08).
- **Morale checks in play**: during an encounter, the simulator's morale rules watch the real fight. When foes must check, the GM gets a whispered card for the event ("A quarter of its side has fallen"):
  - a row per foe with its DC and modifiers as tick boxes (the GM can untick one or tick a call such as "defending home");
  - **Roll** rolls the foe's Will for the GM only, and its Perception when it can read the fight (M38); **Apply** gives up (fleeing and frightened 2, or a "Surrendered" marker and defeated), shakes (frightened +1) or steadies (frightened −1) as the rules say;
  - a foe that reads the fight yields (Accept / Refuse on the card) or leaves; harming one that yielded, surrendered or is leaving makes it and the allies who saw fight to the death, with Undo;
  - when a third of the surviving foes are broken, a rout card offers to make the rest flee.
  The gate is silent: no card while the party isn't clearly ahead. The "Morale checks in play" setting turns it off. See [docs/spec.md](docs/spec.md#morale-checks-in-play-2026-10-09).
- **Summons** (2026-10-13, B298): a monster's summon brings its creatures into the fight. They're made from the compendium creature the ability names (or the best of its options, or its pick), and they come when the monster uses it, or as it dies or takes enough damage. Minions act right after their maker with two actions; creatures that roll initiative take their own turns. Examples: the Dullahan's War Horse, the Bone Prophet's skeletons, Final Spite's Wights. Markers, merges and creatures that can't act aren't played.
- **Passives** (2026-10-13, B302): the passives PF2e's own rules hold, for monsters and PCs alike. That covers Evasion and its kin on saves, All-Around Vision and Deny Advantage on flanking, Surprise Attack and Dread Striker's off-guard, Construct Armor's Hardness and broken AC (every NPC's Hardness now counts), Bravery's lower frightened, Mobility's short Strides and Extra Reaction's count. See [docs/ability-decisions.md](docs/ability-decisions.md) (B302).
  - Since B303: Bravery lowers morale's frightened too; a creature rolls the initiative skill its abilities name (Deception, Intimidation, a Lore) when it beats Perception; reactions kept for one reaction are spent only on it, and per-head extra reactions (hydras) are counted.
- **More of what creatures have** (2026-10-13, B304–B309):
  - requirements it can check (a corpse nearby, a creature held, its last action);
  - triggers for a creature dying or going down nearby, and for gaining a condition;
  - toggle choices taken at their best (Ablative Adaptation, All Made One), and zone ways;
  - shells, stance ripostes, holy-only teleports, Reflect Spell, Smite marks;
  - holy and unholy Strikes against weaknesses, twin.

  See [docs/ability-decisions.md](docs/ability-decisions.md).
- **Immunities, weaknesses and resistances as PF2e has them** (2026-10-13, I1–I4):
  - immunities to conditions (paralyzed, unconscious …) and to effects of a trait (mental, death, fear, sleep, magic …);
  - weaknesses and resistances to more than a damage type: area and splash damage (swarms, troops), cold iron, silver, axes, holy and unholy spells, resistances to spells;
  - resistance exceptions (adamantine, ghost touch …) and resistance doubled against non-magical damage;
  - Fast Healing and regeneration that hold only sometimes (in mist form, a toggle, the terrain).

  See [docs/ability-decisions.md](docs/ability-decisions.md) (I1–I4).
- **Creature rules** (2026-10-13, T1–T7):
  - Strike bonuses against a condition (Gang Up, Mauler, Punch Down) and Brutal Beating's critical rider;
  - Swiftness, Relentless, Inexorable;
  - a damage type of its choice (versatile weapons, Phantom Touch) and Abandon Armor;
  - Split, Attach, a flesh golem's Berserk, Protean Anatomy;
  - the elemental dragons' Countered by and Fed by;
  - critical specialization for PCs and monsters;
  - Troop Defenses.

  See [docs/ability-decisions.md](docs/ability-decisions.md) (T1–T7).
- **Surroundings** (2026-10-13, L1–L5, H1): the setup's light (or the scene's), sunlight, weather, difficult ground, terrain and climate.
  - Senses matter in darkness and dim light; fog, rain and snow conceal.
  - Light Blindness and sunlight's weaknesses; Woodland, Swamp and Ice Stride on difficult ground.
  - Hidden Movement; coven spells only with the coven.
  - A hydra's heads: severed, cauterized and regrown.

  See [docs/ability-decisions.md](docs/ability-decisions.md) (L1–L5, H1).
- **Spells** (milestone 2): creatures cast the spells the resolution core can resolve: saves and spell attacks, with their damage, conditions and push or pull. Everything else is listed as a gap. It needs the `pf2e-resolution-core` module, and the spell module for the plans.
- **Scrolls, wands and staves** (S22): cast as spells, as PF2e lets the creature cast them (its spellcasting, or Trick Magic Item's check first). Staves use PF2e Dailies' charges when Dailies has one prepared, and otherwise the staff's own list with the creature's highest spell rank in charges. A wand can be overcharged once its daily cast is spent, but only while the fight goes badly. The log names the item each spell came from.
- **Consumables** (U1): potions, elixirs, mutagens, oils, talismans and the like, through the item module's plans ([PF2e Automatic Item Resolution](https://github.com/Theholycole/pf2e-automatic-item-resolution), recommended). Monsters use theirs freely. PCs use reusable items freely, and a consumable only when it's worth clearly more than the turn's other options; a healing item freely when they're about to go down, or fed to a PC who is down. Drinks go to the creature or an ally beside it. Bombs are counted by what's carried and taken out before each throw; an alchemist makes more with Quick Alchemy (U2). Potions that cast a spell (Invisibility) cast it (U3). A poison a Strike lists is delivered by its hits, a dose each (U4). Smokesticks and other lasting areas are zones (U5). Counteract consumables (Surging Serum, Panacea, Salve of Antiparalysis) counteract what they name (U10). Gorum's Tear rolls an attack twice and Eye of Apprehension initiative (U11). Quenching Potion and the other recovery items end persistent damage, used freely (U12). Items that lower a condition (Pepper Poultice, Lion Badge) do (U13). Spellguns fire with the better of the user's spell attack and firearm attack (U14). Retaliation potions burn whoever touches the drinker for a minute (U15). Burial Oil and Oil of Swiftness lend their user's weapon Vitalizing or Quickstrike (U16). Items used as part of an action (the Alchemists+ plants' Shove and Grapple) roll it at the item's modifier when that's higher (U17). Talismans and other items activated in answer to something aren't used at will; only those with a trigger the simulator plays (U20): so far those set off by a hit (Dazing Coil, Murderer's Knot), used as the hit lands (U21). Bombs' riders (Bottled Lightning's off-guard, Frost Vial's Speed penalty) play on a hit (U22). Worn items take an Interact to take out, except from a worn belt (Adventures+), which draws up to four light consumables free (U6). Fear Gem and other items used by Striking add their riders to one of the user's Strikes (U7). See [docs/item-decisions.md](docs/item-decisions.md).
- **Danger ratings in compendiums** (2026-10-20): every creature in a compendium window has a number beside its name, its danger for its level. "+2.3" means it fights like a creature 2.3 levels above a typical one of its level; "−0.4", a little below. "≈" marks an estimate (deadlier than any by-the-book creature the scale reaches, 10 levels up), "≤" the most it could be (weaker than the scale's foot, 3 levels down); hover for the words. A skull button beside the search sorts the list by it (most dangerous first; again for the compendium's own order). PF2e's Compendium Browser shows it too: on the Bestiary tab each creature's number sits before its level, and "Order by" has "Danger for level" (the arrow beside it for most dangerous first). The numbers come from the simulator's fights against a party of four at the creature's level (fighter, rogue, wizard, cleric, fighting to the end), the deadliest-creatures study's method: `node tools/deadliest.mjs <folder> screen --fights=100` (`--resume` to go on with a run that stopped), then `ladder`, then `ratings --write=src/data/danger-ratings.json`. All PF2e and Battlezoo creatures, but not data slips or April Fools creatures. The "Danger ratings in compendiums" setting turns it off. To make them again in your own world (a newer simulator, other bestiaries, your own creatures), the settings' **Danger ratings: run them again** button opens a window: pick the fights for each creature and the compendiums, and Run the simulator. It runs in the GM's browser on the simulator's workers (about 40 minutes for every PF2e and Battlezoo creature at 100 fights on an 8-core computer), and the result is kept in the world, used instead of the module's numbers until "Use the module's numbers instead". **One creature only** (after a change to it): right-click it in its compendium and choose *Rate its danger again*. It fights as many times as the numbers in use did and lands on their scale (kept with them), in a few seconds; the window lists the creatures rated that way, with a button to go back to their numbers from the run. For the module's own numbers: `node tools/deadliest.mjs <folder> screen --only="Gibbering Mouther"` (more `--only`, or a file of names, ids or refs) screens just those again into a finished run, then `ratings --write=src/data/danger-ratings.json`.
- **Spell power in compendiums** (2026-10-21): every spell in a compendium window and on the Compendium Browser's Spells tab has a number beside it, its power for its rank: how much more (+) or less (−) one cast eases a fight than a typical spell of its rank does, in levels. The wizard of a party of four at the lowest level that casts that rank casts it once, at its best, into a moderate boss (one creature 2 levels up) and a moderate group (four 2 levels down): the simulator's own expectation of what it does (saves against its DC, resistances, heightened damage, extra damage against undead and the like, conditions and spell effects at the simulator's worth for them; healing counted like damage, the party starting at half its Hit Points) as a share of each fight, and that share in levels as encounter XP goes (a third of a fight gone is about a level easier). Spells that last are counted over their duration (a lingering cloud each round foes stay in it, a Sustained weapon each Sustain), healing against the damage the foes would deal. Summons bring the best creature they allow for the fight (named in the tooltip at each rank); minion spells assume a minion already out; walls, shields and utility spells that deal damage or make difficult terrain are estimated by a rule of thumb ("~" before the number). Hover for the details: each fight, the typical spell's, the heightened ranks that differ by half a level or more, and the foes it's more useful against ("*" after the number: Sunburst against undead, a holy spell against fiends, a summon's celestial against fiends). "≥" marks a spell that takes nearly a whole fight. A wand button sorts the list; "Order by: Power for rank" sorts the Browser. Spells the simulator can't cast, familiar spells, utility spells with no fight effect and those with no effect it counts get none. Made by `node tools/spell-power.mjs <folder> screen` (`--only="Fireball"` for just one again), then `ratings --write=src/data/spell-ratings.json`. The "Spell power in compendiums" setting turns it off.

The design is in [docs/spec.md](docs/spec.md) and the vocabulary in [CONTEXT.md](CONTEXT.md). The rules choices the user confirmed are in [docs/morale-decisions.md](docs/morale-decisions.md) (morale), [docs/spell-decisions.md](docs/spell-decisions.md) (spellcasting) and [docs/item-decisions.md](docs/item-decisions.md) (items).

## Development

- `node --test` runs the engine, rules, benchmark and adapter tests.
- `src/engine/` is pure JavaScript with no Foundry dependency. It runs on a pool of Web Workers in Foundry (each batch split across them, the same report as one thread) and in Node for tests.
- `scripts/` is the Foundry layer:
  - `snapshot.js` is the only file that reads PF2e documents (`map.js` reads the scene's Regions and tracks rounds held; `hazards.js` reads hazard actors; `escalation-tracking.js` notes when rules fire in play)
  - `app.js` and `odds.js` are the UI
  - `runner.js` runs the jobs on the workers
- `src/adapter/formula.js` parses PF2e's readable damage formulas. It has been checked against all 1,027 Monster Core Strike formulas.
- `src/engine/spells.js` imports the core's pure code from `../../../pf2e-resolution-core/`. The core's sibling alias in `~/Documents/ChatGPT` makes that path work in Node too.
- `node tools/bestiary-casters.mjs [pack …]` runs every bestiary spellcaster's spells through the simulator and reports what's cast, what's missing and any errors.
- `node tools/bestiary-abilities.mjs [--map] [--escalate] [pack …]` runs every bestiary creature with its abilities against the martial benchmark party.
  - Both tools read creatures and spells through `tools/lib/` (`pack-creatures.mjs`, `pack-spells.mjs`).
- `node tools/low-value.mjs <out.json> [items,spells,abilities] [fights]` measures how often the planner picks each consumable, spell and monster ability when it has it; `node tools/low-value.mjs doc <out.json> docs/low-value.md` writes the list of low-value options for testing later ([docs/low-value.md](docs/low-value.md), 2026-10-15).
- `node tools/deadliest.mjs <out folder> screen|ladder|confirm|ablate|broad [--only=<refs file>]` ranks every creature (PF2e's packs and Battlezoo's) by how deadly it is for its level (2026-10-13).
  - A fight's deadliness: the party's Hit Points taken (as a share), +0.25 a PC downed, +1 a PC killed, +1 a wipe.
  - Each creature fights the standard party of its level (`src/engine/party.js`: fighter, rogue, wizard, cleric, clamped to 1–20) to the death. The fighter and the rogue carry a bludgeoning backup and a bow beside their main weapons.
  - "For its level" is in levels: the level of a moderate creature from GM Core's tables (`tools/lib/creature-tables.mjs`) that does as much to the same party (the `ladder` phase), less that of the typical (median) creature of its level.
  - Left out of the ranking: likely data slips (a Strike's damage or attack bonus, or an AC, far past GM Core's extreme) and Paizo's April Fools blog creatures.
  - What makes the deadliest strong is found by leaving out each ability, Strike or spellcasting, or bringing a number down to moderate (`tools/lib/deadliness.mjs`).
