# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-07: 2144 feats and actions rated, 4799 not simulated, 6 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 140 an encounter here, all fights 2482, no effect 1270, precise 290, about zero 126, undefined 120 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1426
- hurts: 534
- good: 101
- minor: 40
- strong: 39
- very strong: 4

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Monstrosity Shape | 16 | Class | druid | Untamed Form's monstrosity shapes (Monstrosity Form, rank 8) (in Untamed Form) | +0.85 ± 0.13 | +0.63 | +1.07 | 1.0 | very strong |  |
| 2 | Pin to the Spot | 14 | Class | — | Strike activity | +0.64 ± 0.05 | +1.07 | +0.21 | 6.0 | very strong |  |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.18 | 1.2 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.54 ± 0.11 | +0.98 | +0.10 | 3.3 | very strong |  |
| 5 | Incredible Construct Companion | 8 | Class | inventor | its companion incredible, the bear's numbers (against one mature) | +0.48 ± 0.07 | +0.71 | +0.25 | 15.6 | strong |  |
| 6 | Scare to Death | 15 | Skill | — | save | +0.47 ± 0.05 | +0.61 | +0.33 | 3.8 | strong |  |
| 7 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.50 | +0.45 | 5.1 | strong |  |
| 8 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.46 ± 0.06 | +0.35 | +0.56 | 5.0 | strong |  |
| 9 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.45 ± 0.09 | +0.85 | +0.06 | 4.7 | strong |  |
| 10 | Drifting Pollen | 8 | Class | kineticist | save | +0.45 ± 0.10 | +0.72 | +0.17 | 10.3 | strong |  |
| 11 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.41 ± 0.09 | +0.54 | +0.28 | 4.3 | strong |  |
| 12 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.40 ± 0.08 | +0.38 | +0.42 | 10.8 | strong |  |
| 13 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.39 ± 0.05 | +0.39 | +0.40 | 0.0 | strong | the AI never used it |
| 14 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.39 ± 0.08 | +0.35 | +0.44 | 14.9 | strong |  |
| 15 | Final Shot | 18 | Class | gunslinger | a ranged Strike whose hit is a critical hit, then off-guard and stunned 1 (3 actions) | +0.39 ± 0.09 | +0.56 | +0.23 | 6.0 | strong |  |
| 16 | Advanced Construct Companion | 4 | Class | inventor | its companion mature, the bear's numbers (against one young) | +0.37 ± 0.07 | +0.58 | +0.17 | 9.4 | strong |  |
| 17 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.37 ± 0.05 | +0.55 | +0.19 | 5.7 | strong |  |
| 18 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.36 ± 0.07 | +0.64 | +0.07 | 18.9 | strong |  |
| 19 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.36 ± 0.04 | +0.38 | +0.34 | 2.0 | strong |  |
| 20 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.44 | +0.27 | 10.7 | strong |  |
| 21 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.35 ± 0.08 | +0.36 | +0.35 | 2.0 | strong |  |
| 22 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.34 ± 0.09 | +0.32 | +0.37 | 5.2 | strong |  |
| 23 | Faithful Steed | 1 | Class | champion | its animal companion young (a bear, Commanded each turn) | +0.34 ± 0.06 | +0.26 | +0.41 | 6.8 | strong |  |
| 24 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.33 ± 0.05 | +0.32 | +0.33 | 0.0 | strong | the AI never used it |
| 25 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 26 | Retch Rust | 8 | Class | kineticist | save | +0.32 ± 0.07 | +0.24 | +0.39 | 2.0 | strong |  |
| 27 | Jester's Gambol | 16 | Class | animist | stance | +0.31 ± 0.07 | +0.36 | +0.26 | 1.0 | strong |  |
| 28 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (requirement assumed: You're in Sky and Heaven Stance) (in Sky and Heaven Stance) | +0.30 ± 0.06 | +0.27 | +0.34 | 4.2 | strong |  |
| 29 | Shattering Shot | 12 | Class | gunslinger | save | +0.30 ± 0.08 | +0.26 | +0.33 | 10.6 | strong |  |
| 30 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.29 ± 0.08 | +0.53 | +0.06 | 5.0 | strong |  |
| 31 | Pierce the Eye | 16 | Class | — | save | +0.28 ± 0.06 | +0.43 | +0.14 | 4.0 | strong | with a loaded arquebus |
| 32 | Prototype Companion | 1 | Class | inventor | its companion young, the bear's numbers (Commanded each turn) | +0.28 ± 0.07 | +0.29 | +0.26 | 7.8 | strong |  |
| 33 | Loyal Warhorse | 6 | Class | champion | its animal companion mature (against one young) | +0.28 ± 0.05 | +0.34 | +0.21 | 9.5 | strong |  |
| 34 | Fiend Slayer | 16 | Class | — | save | +0.28 ± 0.05 | +0.07 | +0.48 | 3.4 | strong |  |
| 35 | Battle-Tested Companion | 6 | Class | commander | its animal companion mature (against one young) | +0.27 ± 0.06 | +0.53 | +0.01 | 16.1 | strong |  |
| 36 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 3.9 | strong |  |
| 37 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 4.0 | strong |  |
| 38 | Celestial Armaments | 16 | Class | — | 1d8 spirit on its Strikes; a critical hit, Fortitude or blinded (always on) | +0.27 ± 0.06 | +0.24 | +0.29 | 5.5 | strong |  |
| 39 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.27 ± 0.06 | +0.36 | +0.17 | 2.0 | strong |  |
| 40 | Skeletal Lancers | 14 | Class | — | 5 lancer thralls beside foes: a foe's Strike within 10 feet of one costs it 5 piercing (its focus spell, once a fight; the lancers' own Strikes not played) | +0.26 ± 0.05 | +0.28 | +0.24 | 1.0 | strong |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|
| Demoralize | +0.01 ± 0.01 | 0.6 |
| Trip | +0.00 ± 0.00 | 0.0 |
| Feint | +0.00 ± 0.00 | 0.0 |
| Disarm | +0.00 ± 0.00 | 0.0 |
| Escape | +0.00 ± 0.00 | 0.0 |
| Reposition | +0.00 ± 0.00 | 0.0 |
| Shove | −0.00 ± 0.00 | 0.0 |
| Grapple | −0.01 ± 0.00 | 0.2 |

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Monstrosity Shape | 16 | Class | druid | Untamed Form's monstrosity shapes (Monstrosity Form, rank 8) (in Untamed Form) | +0.85 ± 0.13 | +0.63 | +1.07 | 1.0 | very strong |  |
| 2 | Pin to the Spot | 14 | Class | — | Strike activity | +0.64 ± 0.05 | +1.07 | +0.21 | 6.0 | very strong |  |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.18 | 1.2 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.54 ± 0.11 | +0.98 | +0.10 | 3.3 | very strong |  |
| 5 | Incredible Construct Companion | 8 | Class | inventor | its companion incredible, the bear's numbers (against one mature) | +0.48 ± 0.07 | +0.71 | +0.25 | 15.6 | strong |  |
| 6 | Scare to Death | 15 | Skill | — | save | +0.47 ± 0.05 | +0.61 | +0.33 | 3.8 | strong |  |
| 7 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.50 | +0.45 | 5.1 | strong |  |
| 8 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.46 ± 0.06 | +0.35 | +0.56 | 5.0 | strong |  |
| 9 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.45 ± 0.09 | +0.85 | +0.06 | 4.7 | strong |  |
| 10 | Drifting Pollen | 8 | Class | kineticist | save | +0.45 ± 0.10 | +0.72 | +0.17 | 10.3 | strong |  |
| 11 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.41 ± 0.09 | +0.54 | +0.28 | 4.3 | strong |  |
| 12 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.40 ± 0.08 | +0.38 | +0.42 | 10.8 | strong |  |
| 13 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.39 ± 0.05 | +0.39 | +0.40 | 0.0 | strong | the AI never used it |
| 14 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.39 ± 0.08 | +0.35 | +0.44 | 14.9 | strong |  |
| 15 | Final Shot | 18 | Class | gunslinger | a ranged Strike whose hit is a critical hit, then off-guard and stunned 1 (3 actions) | +0.39 ± 0.09 | +0.56 | +0.23 | 6.0 | strong |  |
| 16 | Advanced Construct Companion | 4 | Class | inventor | its companion mature, the bear's numbers (against one young) | +0.37 ± 0.07 | +0.58 | +0.17 | 9.4 | strong |  |
| 17 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.37 ± 0.05 | +0.55 | +0.19 | 5.7 | strong |  |
| 18 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.36 ± 0.07 | +0.64 | +0.07 | 18.9 | strong |  |
| 19 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.36 ± 0.04 | +0.38 | +0.34 | 2.0 | strong |  |
| 20 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.44 | +0.27 | 10.7 | strong |  |
| 21 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.35 ± 0.08 | +0.36 | +0.35 | 2.0 | strong |  |
| 22 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.34 ± 0.09 | +0.32 | +0.37 | 5.2 | strong |  |
| 23 | Faithful Steed | 1 | Class | champion | its animal companion young (a bear, Commanded each turn) | +0.34 ± 0.06 | +0.26 | +0.41 | 6.8 | strong |  |
| 24 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.33 ± 0.05 | +0.32 | +0.33 | 0.0 | strong | the AI never used it |
| 25 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 26 | Retch Rust | 8 | Class | kineticist | save | +0.32 ± 0.07 | +0.24 | +0.39 | 2.0 | strong |  |
| 27 | Jester's Gambol | 16 | Class | animist | stance | +0.31 ± 0.07 | +0.36 | +0.26 | 1.0 | strong |  |
| 28 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (requirement assumed: You're in Sky and Heaven Stance) (in Sky and Heaven Stance) | +0.30 ± 0.06 | +0.27 | +0.34 | 4.2 | strong |  |
| 29 | Shattering Shot | 12 | Class | gunslinger | save | +0.30 ± 0.08 | +0.26 | +0.33 | 10.6 | strong |  |
| 30 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.29 ± 0.08 | +0.53 | +0.06 | 5.0 | strong |  |
| 31 | Pierce the Eye | 16 | Class | — | save | +0.28 ± 0.06 | +0.43 | +0.14 | 4.0 | strong | with a loaded arquebus |
| 32 | Prototype Companion | 1 | Class | inventor | its companion young, the bear's numbers (Commanded each turn) | +0.28 ± 0.07 | +0.29 | +0.26 | 7.8 | strong |  |
| 33 | Loyal Warhorse | 6 | Class | champion | its animal companion mature (against one young) | +0.28 ± 0.05 | +0.34 | +0.21 | 9.5 | strong |  |
| 34 | Fiend Slayer | 16 | Class | — | save | +0.28 ± 0.05 | +0.07 | +0.48 | 3.4 | strong |  |
| 35 | Battle-Tested Companion | 6 | Class | commander | its animal companion mature (against one young) | +0.27 ± 0.06 | +0.53 | +0.01 | 16.1 | strong |  |
| 36 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 3.9 | strong |  |
| 37 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 4.0 | strong |  |
| 38 | Celestial Armaments | 16 | Class | — | 1d8 spirit on its Strikes; a critical hit, Fortitude or blinded (always on) | +0.27 ± 0.06 | +0.24 | +0.29 | 5.5 | strong |  |
| 39 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.27 ± 0.06 | +0.36 | +0.17 | 2.0 | strong |  |
| 40 | Skeletal Lancers | 14 | Class | — | 5 lancer thralls beside foes: a foe's Strike within 10 feet of one costs it 5 piercing (its focus spell, once a fight; the lancers' own Strikes not played) | +0.26 ± 0.05 | +0.28 | +0.24 | 1.0 | strong |  |
| 41 | Weight of Stone | 6 | Class | kineticist | save | +0.26 ± 0.09 | +0.45 | +0.06 | 4.1 | strong |  |
| 42 | Furious Grab | 12 | Class | barbarian | check | +0.26 ± 0.08 | +0.23 | +0.29 | 6.4 | strong |  |
| 43 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.7 | strong |  |
| 44 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.7 | good |  |
| 45 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.24 ± 0.07 | +0.38 | +0.11 | 6.6 | good |  |
| 46 | Peerless Mascot Companion | 16 | Class | commander | its animal companion specialized (against one incredible) | +0.24 ± 0.07 | +0.39 | +0.09 | 26.0 | good |  |
| 47 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.24 ± 0.05 | +0.13 | +0.34 | 1.4 | good |  |
| 48 | Rock The Boat | 8 | Class | fighter | check | +0.24 ± 0.05 | +0.48 | −0.01 | 7.5 | good |  |
| 49 | Infernal Anguish | 8 | Class | — | check | +0.23 ± 0.05 | +0.45 | +0.02 | 10.1 | good |  |
| 50 | Marked for Rebuke | 18 | Class | — | an Effect on a foe | +0.23 ± 0.05 | +0.23 | +0.23 | 7.7 | good |  |
| 51 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.23 ± 0.04 | +0.28 | +0.18 | 2.1 | good |  |
| 52 | Solar Detonation | 8 | Class | kineticist | save | +0.23 ± 0.06 | −0.04 | +0.50 | 0.9 | good |  |
| 53 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.36 | +0.10 | 3.2 | good |  |
| 54 | Dragon Shape | 12 | Class | druid | Untamed Form's dragon shapes (Dragon Form, rank 6) (in Untamed Form) | +0.22 ± 0.09 | +0.23 | +0.21 | 1.0 | good |  |
| 55 | Splendid Companion | 12 | Class | — | its animal companion incredible (against one mature) | +0.21 ± 0.05 | +0.37 | +0.06 | 9.6 | good |  |
| 56 | Incredible Companion (Ranger) | 10 | Class | ranger | its animal companion incredible (against one mature) | +0.21 ± 0.05 | +0.28 | +0.15 | 12.8 | good |  |
| 57 | Storm Spiral | 8 | Class | kineticist | save | +0.21 ± 0.07 | +0.14 | +0.29 | 1.4 | good |  |
| 58 | Rebounding Assault | 10 | Class | gunslinger | two ranged Strikes at one penalty, +1d6 precision if both hit | +0.21 ± 0.06 | +0.20 | +0.23 | 5.3 | good |  |
| 59 | Specialized Companion (Ranger) | 16 | Class | ranger | its animal companion specialized (against one incredible) | +0.21 ± 0.06 | +0.02 | +0.40 | 13.3 | good |  |
| 60 | Patron's Claim | 0 | Action | — | inline save: 1 creature, 30 feet, fortitude, 10d10 spirit (DC 17, 1/fight) | +0.21 ± 0.05 | +0.26 | +0.15 | 1.0 | good |  |
| 61 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.21 ± 0.04 | +0.32 | +0.10 | 1.6 | good |  |
| 62 | Topple the Pillar of Heaven | 0 | Action | — | inline save: 60-foot line, reflex, 6d8 untyped (DC 17) | +0.21 ± 0.05 | +0.11 | +0.30 | 1.5 | good |  |
| 63 | Greater Distracting Shot | 16 | Class | ranger | its prey off-guard until its next turn after any ranged hit | +0.20 ± 0.05 | +0.08 | +0.33 | 0.0 | good | the AI never used it |
| 64 | Haft Beatdown | 10 | Class | fighter | four Strikes, two at its penalty and two one step worse (3 actions, once a fight) (in Haft Striker Stance) | +0.20 ± 0.04 | +0.29 | +0.11 | 1.0 | good |  |
| 65 | Spinning Stand | 6 | Class | — | 2 Strikes (requirement assumed: You're Prone) | +0.20 ± 0.04 | +0.26 | +0.14 | 5.9 | good |  |
| 66 | Incredible Companion (Druid) | 8 | Class | druid | its animal companion incredible (against one mature) | +0.20 ± 0.04 | +0.23 | +0.17 | 9.1 | good |  |
| 67 | Temporary Possession | 16 | Class | — | a foe possessed by its Will save: the actions it controls and the stunned 1 after taken as stunned 2/3/4 (what it makes the foe do not played) (its focus spell, a thrall destroyed, once a fight) | +0.20 ± 0.05 | +0.22 | +0.18 | 1.0 | good |  |
| 68 | Root to Life | 1 | Class | thaumaturge | check | +0.20 ± 0.05 | +0.25 | +0.15 | 3.2 | good |  |
| 69 | Shattering Spellstrike | 4 | Class | magus | check | +0.20 ± 0.07 | +0.46 | −0.07 | 2.4 | good |  |
| 70 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.19 ± 0.07 | +0.15 | +0.24 | 1.0 | good |  |
| 71 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.19 ± 0.05 | +0.31 | +0.08 | 1.0 | good |  |
| 72 | Rain of Razors | 12 | Class | kineticist | save | +0.19 ± 0.07 | −0.00 | +0.38 | 1.5 | good |  |
| 73 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.19 ± 0.06 | +0.25 | +0.13 | 4.2 | good | with two weapons (longsword and shortsword) |
| 74 | Death Roll | 6 | Class | — | Strike activity | +0.19 ± 0.03 | +0.29 | +0.08 | 6.6 | good |  |
| 75 | Pennant of Victory | 20 | Class | commander | effect | +0.19 ± 0.08 | +0.11 | +0.26 | 2.0 | good |  |
| 76 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.19 ± 0.09 | +0.15 | +0.23 | 0.9 | good |  |
| 77 | Devastating Weaponry | 18 | Class | inventor | a Strike at each enemy within 30 feet (3 actions) | +0.19 ± 0.06 | +0.00 | +0.37 | 4.3 | good |  |
| 78 | Correct the Story | 6 | Class | — | a foe's critical hit or critically successful save rerolled (reaction, a Mythic Point) | +0.18 ± 0.03 | +0.26 | +0.11 | 0.9 | good |  |
| 79 | Forest's Heart | 16 | Class | animist | stance | +0.18 ± 0.07 | +0.27 | +0.09 | 1.0 | good |  |
| 80 | Burning Cascade | 4 | Class | magus | its Arcane Cascade's extra damage on each enemy beside it as it enters the stance | +0.18 ± 0.08 | +0.29 | +0.07 | 1.0 | good |  |
| 81 | Assassinate | 12 | Class | — | Strike activity (requirement assumed: You have designated a mark using Mark for Death and are completely unnoticed by your mark) | +0.18 ± 0.06 | +0.14 | +0.22 | 4.1 | good |  |
| 82 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.18 ± 0.05 | +0.20 | +0.16 | 1.7 | good |  |
| 83 | Call the Hurricane | 8 | Class | kineticist | save | +0.18 ± 0.07 | +0.27 | +0.09 | 1.3 | good |  |
| 84 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.25 | +0.11 | 17.9 | good |  |
| 85 | Diamond Fists | 18 | Class | monk | its unarmed attacks forceful and deadly d10 | +0.18 ± 0.06 | +0.17 | +0.18 | 0.0 | good | the AI never used it |
| 86 | Cavalier Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.17 ± 0.06 | +0.20 | +0.15 | 8.1 | good |  |
| 87 | Drake Rider Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.17 ± 0.06 | +0.20 | +0.15 | 8.1 | good |  |
| 88 | Specialized Companion (Druid) | 14 | Class | druid | its animal companion specialized (against one incredible) | +0.17 ± 0.05 | +0.23 | +0.11 | 6.9 | good |  |
| 89 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.17 ± 0.06 | +0.21 | +0.13 | 3.0 | good |  |
| 90 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.17 ± 0.03 | +0.14 | +0.20 | 0.3 | good |  |
| 91 | Basic Mysteries | 4 | Class | — | Nudge the Scales: heals 10 (30 feet) | +0.17 ± 0.06 | +0.30 | +0.04 | 4.4 | good |  |
| 92 | Mammoth Lord Dedication | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.17 ± 0.05 | +0.12 | +0.21 | 6.5 | good |  |
| 93 | Basic Maneuver | 4 | Class | — | Snagging Strike: Strike activity | +0.16 ± 0.05 | +0.25 | +0.08 | 5.8 | good | with a one-handed weapon and a free hand |
| 94 | Animal Companion | 1 | Class | druid | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.21 | +0.12 | 3.5 | good |  |
| 95 | Beastmaster Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 6.9 | good |  |
| 96 | Undead Master Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 6.9 | good |  |
| 97 | Animal Trainer Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 6.9 | good |  |
| 98 | Sportlebore Choke | 8 | Class | — | save (requirement assumed: Your swarm is outside your body) | +0.16 ± 0.06 | +0.29 | +0.03 | 3.5 | good |  |
| 99 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.16 ± 0.06 | +0.11 | +0.21 | 0.0 | good | the AI never used it |
| 100 | Perfect Strike | 4 | Class | — | innate spell: Perfect Strike (rank 2) | +0.16 ± 0.07 | +0.16 | +0.16 | 1.0 | good |  |
| 101 | Ash Strider | 6 | Class | kineticist | save | +0.16 ± 0.08 | +0.38 | −0.06 | 4.1 | no clear effect |  |
| 102 | Rend Armor | 8 | Class | — | effect | +0.16 ± 0.05 | +0.38 | −0.06 | 7.4 | good |  |
| 103 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.16 ± 0.05 | +0.10 | +0.21 | 4.9 | good |  |
| 104 | Fatal Shot | 18 | Class | — | Strike activity | +0.15 ± 0.06 | +0.17 | +0.14 | 4.1 | good |  |
| 105 | Fumigate | 14 | Class | — | Strike activity | +0.15 ± 0.06 | +0.27 | +0.03 | 6.0 | good |  |
| 106 | Specialized Beastmaster Companion | 14 | Class | — | its animal companion specialized (against one incredible) | +0.15 ± 0.05 | +0.26 | +0.04 | 9.0 | good |  |
| 107 | Specialized Spirit Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.15 ± 0.05 | +0.26 | +0.04 | 9.0 | good |  |
| 108 | A Miracle of Science! | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.15 ± 0.05 | +0.26 | +0.04 | 9.0 | good |  |
| 109 | Paragon Reanimated Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.15 ± 0.05 | +0.26 | +0.04 | 9.0 | good |  |
| 110 | Mature Animal Companion (Ranger) | 6 | Class | ranger | its animal companion mature (against one young) | +0.15 ± 0.06 | +0.13 | +0.17 | 10.7 | good |  |
| 111 | Wild Winds Gust | 14 | Class | monk | a wind crash Strike at each foe within 30 feet (2 actions, in Wild Winds Stance) (in Wild Winds Initiate) | +0.15 ± 0.05 | +0.00 | +0.30 | 3.6 | good |  |
| 112 | Specialized Megafauna Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.15 ± 0.05 | +0.21 | +0.09 | 7.8 | good |  |
| 113 | Specialized Mount | 14 | Class | — | its animal companion specialized (against one incredible) | +0.15 ± 0.05 | +0.21 | +0.09 | 7.8 | good |  |
| 114 | Commander's Companion | 1 | Class | commander | its animal companion young (a bear, Commanded each turn) | +0.15 ± 0.06 | +0.39 | −0.10 | 9.5 | good |  |
| 115 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.04 | +0.19 | +0.10 | 1.4 | good |  |
| 116 | Crashing Slam | 10 | Class | fighter | Slam Down (with it) whose hit trips as a critical success: prone and 1d6 bludgeoning | +0.15 ± 0.04 | +0.33 | −0.04 | 4.7 | good |  |
| 117 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.05 | +0.14 | +0.14 | 0.0 | good | the AI never used it |
| 118 | Imprison Foe | 18 | Class | — | save | +0.14 ± 0.05 | +0.18 | +0.11 | 2.9 | good |  |
| 119 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.14 ± 0.06 | +0.01 | +0.27 | 9.3 | good |  |
| 120 | Boundless Reprisals | 20 | Class | fighter | two more reactions each round, for reactive strike | +0.14 ± 0.04 | +0.00 | +0.28 | 0.0 | good | the AI never used it |
| 121 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.14 ± 0.06 | −0.01 | +0.28 | 0.0 | good | the AI never used it |
| 122 | Mythic Strike | 10 | Class | — | a Strike at mythic proficiency, about +4 (a Mythic Point) | +0.14 ± 0.03 | +0.21 | +0.06 | 4.0 | good |  |
| 123 | Shadowpiercing Charge | 12 | Class | — | its mount's double Stride and two Strikes at one multiple attack penalty (its extra damage in darkness not played) | +0.14 ± 0.03 | +0.21 | +0.06 | 12.0 | good |  |
| 124 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.13 ± 0.03 | +0.00 | +0.27 | 0.5 | good |  |
| 125 | Deadly Strikes | 20 | Class | monk | its unarmed attacks deadly d10 | +0.13 ± 0.06 | +0.04 | +0.22 | 0.0 | good | the AI never used it |
| 126 | Devastating Duelist | 18 | Class | — | Strike activity | +0.13 ± 0.03 | +0.14 | +0.12 | 4.5 | good |  |
| 127 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.13 ± 0.03 | +0.18 | +0.08 | 0.4 | good |  |
| 128 | Osteo Armaments | 4 | Class | — | effect | +0.13 ± 0.05 | +0.11 | +0.15 | 2.0 | good |  |
| 129 | One-On-One | 12 | Class | — | a Feint and a Strike, taken as off-guard, once a round (the dueling sword not checked) | +0.13 ± 0.03 | +0.16 | +0.10 | 3.9 | good |  |
| 130 | Olethros's Decree | 17 | Ancestry | — | save | +0.13 ± 0.04 | +0.14 | +0.11 | 1.0 | good |  |
| 131 | Wolf Drag | 6 | Class | monk | Strike activity (requirement assumed: You are in Wolf Stance) (in Wolf Stance) | +0.13 ± 0.06 | +0.23 | +0.03 | 6.2 | no clear effect |  |
| 132 | Grievous Blow | 8 | Class | — | Strike activity | +0.13 ± 0.05 | +0.16 | +0.09 | 4.9 | good |  |
| 133 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.13 ± 0.05 | +0.09 | +0.17 | 5.3 | good |  |
| 134 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.13 ± 0.02 | +0.20 | +0.05 | 0.2 | good |  |
| 135 | Implement's Assault | 18 | Class | thaumaturge | a Strike at each enemy within 30 feet (3 actions) | +0.12 ± 0.06 | +0.00 | +0.25 | 4.1 | good |  |
| 136 | Topple The Titans | 4 | Class | exemplar | check | +0.12 ± 0.06 | +0.22 | +0.02 | 1.0 | good |  |
| 137 | Lantern Beam | 0 | Action | — | save (requirement assumed: Your lantern light is shining) | +0.12 ± 0.05 | +0.09 | +0.14 | 1.1 | good |  |
| 138 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.12 ± 0.05 | +0.19 | +0.05 | 4.5 | good |  |
| 139 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.12 ± 0.06 | +0.06 | +0.17 | 5.4 | good |  |
| 140 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.11 ± 0.07 | +0.13 | +0.10 | 1.0 | no clear effect |  |
| 141 | Lava Leap | 4 | Class | kineticist | save | +0.11 ± 0.08 | +0.18 | +0.04 | 1.4 | no clear effect |  |
| 142 | Scour the Library | 10 | Class | psychic | self effect | +0.11 ± 0.04 | +0.03 | +0.19 | 3.2 | good |  |
| 143 | Usurp the Lunar Reins | 18 | Class | kineticist | save | +0.11 ± 0.05 | +0.04 | +0.18 | 0.8 | good |  |
| 144 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.11 ± 0.06 | +0.23 | −0.01 | 1.0 | no clear effect |  |
| 145 | Unbreaking Castle | 10 | Class | — | effect | +0.11 ± 0.06 | +0.02 | +0.19 | 5.9 | no clear effect | with a weapon and a shield |
| 146 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.15 | +0.05 | 0.2 | good |  |
| 147 | Mature Trained Companion | 6 | Class | — | its animal companion mature (against one young) | +0.10 ± 0.03 | +0.13 | +0.08 | 8.4 | good |  |
| 148 | Let My Creature Live! | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.10 ± 0.03 | +0.13 | +0.08 | 8.4 | good |  |
| 149 | Legendary Rider | 20 | Class | — | quickened for its Command: its own three actions and its mount's two | +0.10 ± 0.05 | +0.04 | +0.17 | 9.2 | no clear effect |  |
| 150 | Return Unto Runes | 16 | Class | — | self effect | +0.10 ± 0.05 | +0.11 | +0.10 | 6.1 | no clear effect |  |
| 151 | Gang Up | 6 | Class | rogue | passive-rules | +0.10 ± 0.03 | +0.15 | +0.05 | 0.0 | good |  |
| 152 | Towering Size | 12 | Class | summoner | its eidolon Huge, reach 15 feet | +0.10 ± 0.09 | −0.04 | +0.25 | 12.4 | no clear effect |  |
| 153 | Spirit Sanctification | 0 | Action | — | its text's self buff (FlatModifier saving-throw 1) | +0.10 ± 0.03 | +0.06 | +0.14 | 1.0 | good |  |
| 154 | Distant Wandering | 10 | Class | — | effect | +0.10 ± 0.05 | +0.22 | −0.02 | 2.0 | minor |  |
| 155 | Thundering Roar | 0 | Action | — | inline save: 10-foot emanation, will, 4d8 sonic (DC 17) | +0.10 ± 0.04 | +0.00 | +0.20 | 1.1 | minor |  |
| 156 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.10 ± 0.08 | +0.21 | −0.01 | 1.0 | no clear effect |  |
| 157 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | +0.10 ± 0.05 | +0.16 | +0.04 | 10.0 | no clear effect |  |
| 158 | Ki Cutting Sight | 6 | Class | monk | Ki Cutting Sight: on a Perception success against its Fortitude DC, 4d10 slashing on the monk's next hit (a focus spell) | +0.10 ± 0.05 | +0.16 | +0.03 | 1.4 | minor |  |
| 159 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.10 ± 0.04 | +0.06 | +0.13 | 0.9 | minor |  |
| 160 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.10 ± 0.06 | +0.27 | −0.07 | 7.0 | no clear effect |  |
| 161 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.10 ± 0.05 | +0.12 | +0.07 | 1.0 | no clear effect |  |
| 162 | Paragon Companion | 14 | Class | inventor | its companion specialized, the bear's numbers (against one incredible) | +0.10 ± 0.05 | +0.16 | +0.03 | 12.4 | no clear effect |  |
| 163 | Wild Winds Initiate | 8 | Class | monk | Wild Winds Stance: WindCrash Strikes (a focus spell) | +0.10 ± 0.07 | +0.20 | −0.01 | 1.0 | no clear effect |  |
| 164 | Fortissimo Composition | 8 | Class | bard | Courageous Anthem at +2 for a round, the PC and its allies within 60 feet (once a fight) | +0.10 ± 0.03 | +0.10 | +0.09 | 5.0 | minor |  |
| 165 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.09 ± 0.03 | +0.20 | −0.01 | 0.3 | minor |  |
| 166 | Gorilla Pound | 6 | Class | monk | a Demoralize, then a melee Strike with +3 damage per frightened value (flourish) (in Gorilla Stance) | +0.09 ± 0.06 | +0.09 | +0.10 | 3.9 | no clear effect |  |
| 167 | Body Shield | 4 | Class | — | +2 AC against an attack (reaction) | +0.09 ± 0.02 | +0.11 | +0.07 | 1.8 | minor |  |
| 168 | Cobra Envenom | 10 | Class | monk | Strike activity (requirement assumed: You are in Cobra Stance) (in Cobra Stance) | +0.09 ± 0.06 | +0.16 | +0.02 | 10.3 | no clear effect |  |
| 169 | Master Strike | 0 | Action | rogue | save | +0.09 ± 0.03 | +0.13 | +0.05 | 1.1 | minor |  |
| 170 | Do You Know Who I Am? | 12 | Class | — | check | +0.09 ± 0.06 | +0.09 | +0.09 | 1.0 | no clear effect |  |
| 171 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | +0.09 ± 0.07 | +0.16 | +0.02 | 3.4 | no clear effect |  |
| 172 | Bloody Debilitation | 12 | Class | rogue | Debilitating Strike's 3d6 persistent bleed in place of enfeebled 1 | +0.09 ± 0.05 | +0.00 | +0.18 | 0.0 | no clear effect | the AI never used it |
| 173 | Recharging Flurry | 4 | Class | magus | 2 Strikes | +0.09 ± 0.08 | +0.13 | +0.05 | 2.4 | no clear effect | with two weapons (longsword and shortsword) |
| 174 | Scintillating Spell | 16 | Class | sorcerer | Scintillating Spell copies of 13 spells | +0.09 ± 0.06 | +0.00 | +0.18 | 3.8 | no clear effect |  |
| 175 | Siphon Life | 10 | Class | — | Strike activity | +0.09 ± 0.05 | +0.22 | −0.05 | 3.6 | no clear effect |  |
| 176 | Raging Intimidation | 1 | Class | barbarian | Scare to Death: save | +0.09 ± 0.04 | +0.33 | −0.15 | 2.9 | minor |  |
| 177 | Frightful Attrition | 12 | Class | — | a Will save or frightened 1–3 for the foes within 30 feet of each foe it drops (actions.js) | +0.09 ± 0.02 | +0.00 | +0.18 | 1.6 | minor |  |
| 178 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.12 | +0.05 | 3.5 | minor | with a one-handed weapon and a free hand |
| 179 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.09 ± 0.03 | +0.14 | +0.03 | 2.1 | minor |  |
| 180 | Merciless Rend | 10 | Class | summoner | check | +0.09 ± 0.05 | +0.14 | +0.04 | 16.9 | no clear effect |  |
| 181 | Mature Beastmaster Companion | 4 | Class | — | its animal companion mature (against one young) | +0.09 ± 0.04 | +0.11 | +0.06 | 6.9 | minor |  |
| 182 | Advanced Reanimated Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.09 ± 0.04 | +0.11 | +0.06 | 6.9 | minor |  |
| 183 | Duo's Aim | 8 | Class | — | Strike activity | +0.08 ± 0.05 | +0.14 | +0.03 | 4.9 | no clear effect |  |
| 184 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.08 ± 0.05 | +0.14 | +0.03 | 4.9 | no clear effect |  |
| 185 | Rallying Banner | 8 | Class | commander | check | +0.08 ± 0.07 | +0.05 | +0.12 | 1.0 | no clear effect |  |
| 186 | Basic Defender | 4 | Class | — | Taunting Strike: Strike activity | +0.08 ± 0.04 | +0.15 | +0.02 | 2.5 | minor |  |
| 187 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | +0.08 ± 0.05 | +0.14 | +0.03 | 1.0 | no clear effect |  |
| 188 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.08 ± 0.05 | +0.16 | +0.00 | 1.0 | no clear effect |  |
| 189 | Acknowledge Fan | 12 | Class | — | save | +0.08 ± 0.06 | +0.05 | +0.11 | 3.5 | no clear effect |  |
| 190 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.08 ± 0.05 | +0.09 | +0.07 | 6.2 | no clear effect |  |
| 191 | Hasted Assault | 14 | Class | magus | Hasted Assault, as Haste (rank 7) | +0.08 ± 0.06 | −0.03 | +0.18 | 1.0 | no clear effect |  |
| 192 | Gruesome Strike | 12 | Class | champion | Strike activity (requirement assumed: Your Strikes currently deal extra damage from your champion's reaction) | +0.08 ± 0.06 | −0.10 | +0.25 | 15.5 | no clear effect |  |
| 193 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.08 ± 0.04 | −0.02 | +0.17 | 6.8 | no clear effect |  |
| 194 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.08 ± 0.07 | +0.16 | −0.01 | 1.0 | no clear effect |  |
| 195 | Thrall Charger | 4 | Class | — | Thrall Charge (a cantrip): a thrall Strike with 2d6 more, the thrall destroyed for +2 (rated on a necromancer; its Stride not played) | +0.08 ± 0.04 | +0.07 | +0.08 | 2.8 | no clear effect |  |
| 196 | Fane's Escape | 4 | Skill | — | check | +0.07 ± 0.04 | +0.26 | −0.11 | 1.4 | no clear effect |  |
| 197 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.07 ± 0.07 | +0.14 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 198 | Burning Demand | 12 | Class | kineticist | save | +0.07 ± 0.10 | +0.03 | +0.12 | 4.6 | no clear effect |  |
| 199 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.07 ± 0.05 | +0.12 | +0.03 | 3.0 | no clear effect |  |
| 200 | All Shall End in Flames | 18 | Class | kineticist | save | +0.07 ± 0.04 | +0.04 | +0.11 | 0.8 | no clear effect |  |
| 201 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.07 ± 0.04 | +0.04 | +0.11 | 0.8 | no clear effect |  |
| 202 | Living Epic | 20 | Class | — | passive effect (always on) | +0.07 ± 0.04 | +0.02 | +0.12 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 203 | Improved Poison Weapon | 8 | Class | rogue | Poison Weapon with 2d4 poison (Poison Weapon with it) | +0.07 ± 0.05 | +0.13 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 204 | Twin Distraction | 4 | Class | rogue | Twin Feint (forced); both Strikes hit: a Will save or stupefied 1 | +0.07 ± 0.03 | +0.08 | +0.07 | 2.5 | minor | with two weapons (longsword and shortsword) |
| 205 | Certain Strike | 10 | Class | fighter | Strike activity | +0.07 ± 0.02 | +0.12 | +0.03 | 9.1 | minor |  |
| 206 | Mythic Containment | 10 | Class | — | check | +0.07 ± 0.05 | +0.23 | −0.08 | 2.8 | no clear effect |  |
| 207 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.07 ± 0.04 | +0.15 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 208 | Living Nexus Dedication | 2 | Class | — | Overflowing Blade: Strike activity (requirement assumed: You are overflowing) | +0.07 ± 0.04 | +0.14 | +0.00 | 4.8 | no clear effect |  |
| 209 | Spirit Companion | 4 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.07 ± 0.05 | +0.03 | +0.12 | 6.7 | no clear effect |  |
| 210 | Demon-Hunting Companion | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.07 ± 0.05 | +0.03 | +0.12 | 6.7 | no clear effect |  |
| 211 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.07 ± 0.04 | +0.12 | +0.02 | 2.8 | no clear effect |  |
| 212 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.07 ± 0.04 | +0.09 | +0.05 | 1.0 | no clear effect |  |
| 213 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.07 ± 0.05 | +0.06 | +0.08 | 1.0 | no clear effect |  |
| 214 | Whirlwind Spell | 20 | Class | magus | a 3-action Spellstrike at each foe in reach, the spell on each it hits (a multi-target or area spell) | +0.07 ± 0.03 | +0.00 | +0.14 | 0.6 | minor |  |
| 215 | Final Spite | 8 | Class | — | save | +0.07 ± 0.03 | +0.09 | +0.05 | 1.0 | minor |  |
| 216 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.07 ± 0.05 | +0.15 | −0.02 | 4.4 | no clear effect |  |
| 217 | Forewarn | 12 | Class | — | an ally's AC as its Perception DC against a hit, when higher (reaction) | +0.07 ± 0.02 | +0.00 | +0.14 | 0.6 | minor |  |
| 218 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | +0.07 ± 0.04 | +0.08 | +0.06 | 0.8 | no clear effect |  |
| 219 | Hymn of Healing | 1 | Class | bard | innate spell: Hymn of Healing (rank 1) | +0.07 ± 0.04 | +0.05 | +0.09 | 1.9 | no clear effect |  |
| 220 | Distracting Shot | 12 | Class | ranger | its prey off-guard until its next turn after a ranged critical hit or two ranged hits in a turn | +0.07 ± 0.04 | +0.00 | +0.14 | 1.6 | no clear effect |  |
| 221 | Telling Blow | 18 | Class | — | Strike activity | +0.07 ± 0.06 | +0.04 | +0.09 | 3.7 | no clear effect |  |
| 222 | Leading Dance | 4 | Class | swashbuckler | check | +0.07 ± 0.04 | +0.15 | −0.02 | 3.3 | no clear effect |  |
| 223 | Healing Nexus | 8 | Class | — | healing | +0.07 ± 0.03 | +0.11 | +0.02 | 0.4 | minor |  |
| 224 | Call the Hunt | 12 | Class | — | a foe in its reach off-guard to all until its next turn (1 action) | +0.07 ± 0.06 | +0.29 | −0.16 | 5.5 | no clear effect |  |
| 225 | Call Worm Spirit | 10 | Class | — | save | +0.07 ± 0.05 | +0.00 | +0.13 | 1.0 | no clear effect |  |
| 226 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.07 ± 0.02 | +0.06 | +0.07 | 0.1 | minor | with a weapon and a shield |
| 227 | Incredible Beastmaster Companion | 8 | Class | — | its animal companion incredible (against one mature) | +0.07 ± 0.04 | +0.14 | −0.01 | 12.1 | no clear effect |  |
| 228 | Behold My Creation! | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.07 ± 0.04 | +0.14 | −0.01 | 12.1 | no clear effect |  |
| 229 | Incredible Reanimated Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.07 ± 0.04 | +0.14 | −0.01 | 12.1 | no clear effect |  |
| 230 | Blazing Aura | 17 | Ancestry | — | save | +0.07 ± 0.05 | +0.04 | +0.09 | 1.0 | no clear effect |  |
| 231 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.06 ± 0.03 | +0.13 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 232 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.04 | −0.02 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 233 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.06 ± 0.02 | +0.06 | +0.07 | 1.0 | minor | always on (its moment isn't checked) |
| 234 | Glacial Prison | 12 | Class | kineticist | save | +0.06 ± 0.09 | +0.05 | +0.07 | 3.0 | no clear effect |  |
| 235 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.06 ± 0.03 | +0.12 | +0.00 | 0.8 | minor |  |
| 236 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.07 | +0.05 | 1.0 | minor | always on (its moment isn't checked) |
| 237 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | +0.06 ± 0.03 | +0.07 | +0.06 | 0.7 | minor |  |
| 238 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.06 ± 0.04 | +0.09 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 239 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 3.5 | no clear effect |  |
| 240 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.06 ± 0.06 | +0.00 | +0.12 | 1.0 | no clear effect |  |
| 241 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.06 ± 0.03 | +0.00 | +0.12 | 2.3 | minor | with a loaded arquebus |
| 242 | Not So Fast! | 4 | Class | guardian | a Strike at a foe leaving its reach, in Hampering Stance (reaction) (in Hampering Stance) | +0.06 ± 0.03 | +0.10 | +0.02 | 0.4 | no clear effect |  |
| 243 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.06 ± 0.07 | +0.59 | −0.47 | 25.6 | no clear effect |  |
| 244 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 245 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.06 ± 0.02 | +0.05 | +0.07 | 0.0 | minor | the AI never used it |
| 246 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.05 | +0.11 | +0.01 | 8.0 | no clear effect |  |
| 247 | Overflowing Blade | 0 | Action | — | Strike activity (requirement assumed: You are overflowing) | +0.06 ± 0.02 | +0.03 | +0.09 | 3.6 | minor |  |
| 248 | The World Devours | 12 | Class | — | save (requirement assumed: Your waking world is active) | +0.06 ± 0.04 | −0.08 | +0.19 | 2.2 | no clear effect |  |
| 249 | Chronomancer's Secrets | 8 | Class | — | innate spell: Stasis (rank 4), Path of Least Resistance (rank 4) | +0.06 ± 0.05 | +0.20 | −0.08 | 1.0 | no clear effect |  |
| 250 | Borrow Time | 10 | Class | — | check | +0.06 ± 0.03 | +0.11 | +0.01 | 1.0 | no clear effect |  |
| 251 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.04 | +0.08 | 0.0 | minor | the AI never used it |
| 252 | Winter Sleet | 4 | Class | kineticist | a foe coming in falls prone on a failed Reflex save (DC 18) in its 10-foot kinetic aura (stance, the fight) | +0.06 ± 0.09 | +0.11 | +0.00 | 1.7 | no clear effect |  |
| 253 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.04 | +0.03 | +0.08 | 1.0 | no clear effect |  |
| 254 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.06 ± 0.09 | +0.15 | −0.04 | 4.5 | no clear effect |  |
| 255 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.03 | +0.08 | +0.03 | 0.0 | minor | the AI never used it |
| 256 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.05 ± 0.03 | +0.08 | +0.03 | 0.0 | minor | the AI never used it |
| 257 | Reap the Field | 0 | Action | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.11 | 1.0 | minor |  |
| 258 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.11 | +0.00 | 0.2 | minor |  |
| 259 | Deadly Poison Weapon | 12 | Class | rogue | Poison Weapon with 4d4 poison (Poison Weapon with it) | +0.05 ± 0.06 | −0.02 | +0.13 | 0.0 | no clear effect | the AI never used it |
| 260 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.05 ± 0.02 | +0.04 | +0.07 | 0.5 | minor |  |
| 261 | Follow-Up Strike | 6 | Class | — | after a missed melee Strike, another at the same penalty | +0.05 ± 0.03 | +0.08 | +0.03 | 1.6 | minor |  |
| 262 | Boarding Assault | 0 | Action | — | Strike activity | +0.05 ± 0.03 | +0.01 | +0.09 | 1.1 | no clear effect |  |
| 263 | Dirge of Doom | 6 | Class | bard | innate spell: Dirge of Doom (rank 3) | +0.05 ± 0.02 | +0.12 | −0.01 | 5.0 | minor |  |
| 264 | Storm Retribution | 6 | Class | druid | Storm Retribution, as Tempest Surge (rank 3) | +0.05 ± 0.02 | +0.09 | +0.02 | 0.1 | minor |  |
| 265 | Aristocratic Arms | 4 | Class | — | For My House!: self effect | +0.05 ± 0.02 | +0.05 | +0.05 | 2.4 | minor |  |
| 266 | Rallying Anthem | 4 | Class | bard | innate spell: Rallying Anthem (rank 2) | +0.05 ± 0.04 | +0.08 | +0.03 | 11.8 | no clear effect |  |
| 267 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.05 ± 0.03 | +0.00 | +0.10 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 268 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.05 ± 0.07 | +0.10 | +0.01 | 4.9 | no clear effect | with two weapons (longsword and shortsword) |
| 269 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.05 ± 0.07 | +0.15 | −0.04 | 1.0 | no clear effect |  |
| 270 | Pack Attack | 6 | Class | — | strike-extra | +0.05 ± 0.04 | +0.03 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 271 | Annihilating Compound Invocation | 18 | Class | — | save | +0.05 ± 0.08 | +0.00 | +0.10 | 16.1 | no clear effect |  |
| 272 | Dual-Handed Assault | 4 | Class | fighter | a Strike with its weapon die a step bigger | +0.05 ± 0.04 | +0.05 | +0.05 | 3.4 | no clear effect | with a one-handed weapon and a free hand |
| 273 | Torrent in the Blood | 6 | Class | kineticist | check | +0.05 ± 0.08 | +0.24 | −0.14 | 3.0 | no clear effect |  |
| 274 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.05 ± 0.02 | +0.07 | +0.03 | 0.0 | minor |  |
| 275 | Armor Break | 12 | Class | guardian | save | +0.05 ± 0.07 | +0.01 | +0.09 | 2.3 | no clear effect |  |
| 276 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.05 ± 0.05 | −0.00 | +0.10 | 0.9 | no clear effect |  |
| 277 | Auspicious Mount | 16 | Class | champion | its animal companion specialized (against one incredible) | +0.05 ± 0.05 | +0.10 | −0.01 | 10.1 | no clear effect |  |
| 278 | Targeting Strike | 10 | Class | commander | after its Set-Up Strike or Guiding Shot damages, the next ally's hit there deals its Intelligence in precision damage (in Set-Up Strike) | +0.05 ± 0.02 | +0.06 | +0.03 | 2.1 | no clear effect |  |
| 279 | Apocalyptic Visions | 18 | Class | — | save | +0.05 ± 0.06 | +0.07 | +0.03 | 1.0 | no clear effect |  |
| 280 | Hell's Armaments | 12 | Class | — | a Fortitude save on a critical hit: −10 feet Speed, slowed 1 or 2 (always on) | +0.05 ± 0.04 | +0.00 | +0.10 | 3.8 | no clear effect |  |
| 281 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.05 ± 0.02 | +0.08 | +0.02 | 3.7 | no clear effect |  |
| 282 | Basic Devotion | 4 | Class | — | Defensive Advance: Strike activity | +0.05 ± 0.03 | +0.00 | +0.09 | 1.5 | no clear effect |  |
| 283 | Adamantine Body | 8 | Class | — | effect | +0.05 ± 0.03 | +0.11 | −0.02 | 1.6 | no clear effect |  |
| 284 | Twin Weakness | 10 | Class | thaumaturge | a melee Strike at its exploited foe and Exploit Vulnerability's damage again on any result but a critical failure (2 actions, two attacks) | +0.05 ± 0.06 | +0.05 | +0.04 | 4.1 | no clear effect |  |
| 285 | Fleeting Arc through Heaven and Earth | 0 | Action | — | inline save: 60-foot cone, fortitude, 9d6 spirit (DC 17) | +0.05 ± 0.06 | −0.08 | +0.17 | 0.6 | no clear effect |  |
| 286 | Avenger of Greed | 14 | Class | — | Convocation of Greed: an Effect on an ally | +0.05 ± 0.05 | +0.07 | +0.02 | 13.4 | no clear effect |  |
| 287 | Lastwall Sentry Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.05 ± 0.02 | +0.04 | +0.05 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 288 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.05 ± 0.02 | +0.04 | +0.05 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 289 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.05 ± 0.02 | +0.06 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 290 | Eidolon's Retort | 6 | Class | summoner | its eidolon's Retort (a Reactive Strike) | +0.05 ± 0.07 | −0.08 | +0.17 | 14.4 | no clear effect |  |
| 291 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.05 ± 0.02 | +0.01 | +0.08 | 1.3 | no clear effect |  |
| 292 | Clinging Shadows Initiate | 8 | Class | monk | Clinging Shadows Stance: ShadowGrasp Strikes (a focus spell) | +0.05 ± 0.07 | +0.15 | −0.06 | 1.0 | no clear effect |  |
| 293 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.05 ± 0.07 | −0.16 | +0.25 | 4.3 | no clear effect |  |
| 294 | Dashing Strike | 12 | Class | fighter | Strike activity | +0.05 ± 0.04 | −0.01 | +0.11 | 2.3 | no clear effect |  |
| 295 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.05 ± 0.05 | +0.04 | +0.05 | 3.2 | no clear effect |  |
| 296 | Ride the Tsunami | 18 | Class | kineticist | save | +0.04 ± 0.06 | −0.20 | +0.29 | 2.8 | no clear effect |  |
| 297 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.04 ± 0.02 | +0.07 | +0.02 | 0.2 | no clear effect |  |
| 298 | Terrain Shield | 14 | Class | — | effect | +0.04 ± 0.02 | +0.07 | +0.02 | 0.3 | no clear effect |  |
| 299 | Mature Dragon Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.04 ± 0.03 | +0.09 | +0.00 | 7.8 | no clear effect |  |
| 300 | Impressive Mount | 4 | Class | — | its animal companion mature (against one young) | +0.04 ± 0.03 | +0.09 | +0.00 | 7.8 | no clear effect |  |
| 301 | Social Purview | 4 | Class | — | Gladiator Dedication: passive effect (always on) | +0.04 ± 0.02 | +0.03 | +0.06 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 302 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | +0.04 ± 0.02 | +0.02 | +0.06 | 0.3 | no clear effect |  |
| 303 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.04 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 304 | Coordinated Distraction | 12 | Class | rogue | check | +0.04 ± 0.07 | +0.21 | −0.13 | 5.0 | no clear effect |  |
| 305 | Second Sting | 12 | Class | ranger | Strike activity | +0.04 ± 0.07 | +0.01 | +0.08 | 8.4 | no clear effect | with two weapons (longsword and shortsword) |
| 306 | Slowing Strike | 12 | Class | — | save | +0.04 ± 0.06 | −0.00 | +0.09 | 12.4 | no clear effect |  |
| 307 | Battle Cry | 7 | Skill | — | a free Demoralize as the fight begins | +0.04 ± 0.04 | −0.01 | +0.10 | 1.0 | no clear effect |  |
| 308 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.04 ± 0.02 | +0.03 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 309 | Titan Swing | 2 | Class | — | Strike activity | +0.04 ± 0.03 | +0.16 | −0.08 | 2.6 | no clear effect |  |
| 310 | Goblin Jubilee Display | 10 | Class | — | Goblin Jubilee: save | +0.04 ± 0.04 | +0.07 | +0.02 | 1.2 | no clear effect |  |
| 311 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.04 ± 0.02 | +0.08 | +0.00 | 0.2 | no clear effect |  |
| 312 | Enchanting Shot | 8 | Class | — | Strike activity | +0.04 ± 0.05 | +0.08 | +0.00 | 4.5 | no clear effect |  |
| 313 | Mature Animal Companion (Druid) | 4 | Class | druid | its animal companion mature (against one young) | +0.04 ± 0.04 | +0.10 | −0.02 | 5.7 | no clear effect |  |
| 314 | Armored Counterattack | 12 | Class | guardian | a Strike back after its Intercept Attack, a Taunt on a hit (free) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.5 | no clear effect |  |
| 315 | Side by Side (Ranger) | 12 | Class | ranger | it and its companion flank a foe both are beside | +0.04 ± 0.03 | +0.04 | +0.04 | 10.5 | no clear effect |  |
| 316 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.04 ± 0.07 | +0.14 | −0.06 | 5.6 | no clear effect |  |
| 317 | Breath of Hungry Death | 16 | Class | — | save | +0.04 ± 0.04 | −0.05 | +0.13 | 0.9 | no clear effect |  |
| 318 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 319 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | +0.04 ± 0.08 | +0.18 | −0.09 | 3.3 | no clear effect |  |
| 320 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.04 ± 0.01 | +0.08 | +0.00 | 0.2 | no clear effect |  |
| 321 | Multifarious Muse | 2 | Class | bard | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | +0.04 ± 0.04 | +0.13 | −0.05 | 1.0 | no clear effect |  |
| 322 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.05 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 323 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 324 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.02 | 0.6 | no clear effect |  |
| 325 | Gods' Palm | 8 | Class | — | Strike activity | +0.04 ± 0.02 | +0.08 | +0.00 | 3.4 | no clear effect |  |
| 326 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.04 ± 0.06 | +0.05 | +0.03 | 3.4 | no clear effect |  |
| 327 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.04 ± 0.08 | +0.05 | +0.02 | 6.4 | no clear effect | with a loaded arquebus |
| 328 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.04 | +0.04 | 1.6 | no clear effect |  |
| 329 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.04 ± 0.01 | +0.04 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 330 | Great Cleave | 10 | Class | barbarian | Cleave, going on while each Strike drops its creature (reaction) | +0.04 ± 0.02 | +0.00 | +0.07 | 0.7 | no clear effect |  |
| 331 | Zombie Horde (Necromancer) | 6 | Class | — | innate spell: Zombie Horde (rank 3) | +0.04 ± 0.03 | +0.03 | +0.04 | 3.1 | no clear effect |  |
| 332 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.04 ± 0.02 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 333 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.04 ± 0.02 | +0.00 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 334 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.02 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 335 | Unstable Concoction | 10 | Class | alchemist | its bombs' damage dice a step bigger | +0.04 ± 0.03 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 336 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | +0.04 ± 0.02 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 337 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.04 ± 0.04 | +0.04 | +0.03 | 2.8 | no clear effect |  |
| 338 | Rejuvenating Touch | 18 | Class | champion | 10 temporary Hit Points, renewed each turn for 10 rounds, for an ally its Lay on Hands heals | +0.04 ± 0.02 | +0.01 | +0.06 | 0.8 | no clear effect |  |
| 339 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.02 | −0.00 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 340 | Take in the Catch | 12 | Class | — | Strike activity (requirement assumed: You're holding a net) | +0.04 ± 0.06 | +0.11 | −0.04 | 4.8 | no clear effect |  |
| 341 | Clear as Air | 6 | Class | kineticist | check | +0.04 ± 0.09 | +0.15 | −0.07 | 2.6 | no clear effect |  |
| 342 | Frightening Power | 12 | Class | — | save | +0.04 ± 0.06 | −0.17 | +0.24 | 12.2 | no clear effect |  |
| 343 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.04 ± 0.06 | +0.04 | +0.03 | 3.5 | no clear effect |  |
| 344 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.03 ± 0.04 | −0.05 | +0.12 | 0.8 | no clear effect |  |
| 345 | Glory and Valor! | 9 | Ancestry | — | heals 4 (touch, 1/fight) | +0.03 ± 0.03 | +0.04 | +0.03 | 0.6 | no clear effect |  |
| 346 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.03 ± 0.03 | +0.03 | +0.04 | 1.6 | no clear effect |  |
| 347 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.03 ± 0.02 | +0.06 | +0.01 | 0.6 | no clear effect |  |
| 348 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.03 ± 0.02 | +0.08 | −0.01 | 1.6 | no clear effect |  |
| 349 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.03 ± 0.03 | −0.03 | +0.10 | 0.3 | no clear effect |  |
| 350 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.03 ± 0.04 | −0.08 | +0.14 | 3.3 | no clear effect |  |
| 351 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.03 ± 0.02 | +0.04 | +0.02 | 0.1 | no clear effect |  |
| 352 | Directional Bombs | 6 | Class | alchemist | its bombs' splash on its foes only (a cone away from it) | +0.03 ± 0.02 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 353 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | +0.03 ± 0.06 | −0.02 | +0.08 | 1.0 | no clear effect |  |
| 354 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.02 | +0.03 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 355 | Head Stomp | 4 | Class | rogue | Strike activity | +0.03 ± 0.03 | +0.08 | −0.01 | 4.8 | no clear effect |  |
| 356 | Advanced General Training | 13 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.03 ± 0.03 | +0.02 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 357 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.06 | +0.01 | 1.1 | no clear effect |  |
| 358 | Lethal Edge | 10 | Class | — | check | +0.03 ± 0.02 | +0.04 | +0.02 | 7.0 | no clear effect |  |
| 359 | Basic Fury | 4 | Class | — | Sudden Charge: Strike activity | +0.03 ± 0.03 | +0.05 | +0.01 | 1.6 | no clear effect |  |
| 360 | Feral Mending | 8 | Class | — | check | +0.03 ± 0.03 | +0.04 | +0.02 | 0.4 | no clear effect |  |
| 361 | Unseat | 10 | Class | — | Strike activity (requirement assumed: You are riding your mount and wielding a jousting weapon) | +0.03 ± 0.02 | +0.08 | −0.01 | 19.5 | no clear effect |  |
| 362 | Drain Vitality | 10 | Class | — | check | +0.03 ± 0.02 | +0.06 | +0.00 | 0.4 | no clear effect |  |
| 363 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.06 | +0.01 | 1.1 | no clear effect |  |
| 364 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.03 ± 0.03 | +0.00 | +0.06 | 6.1 | no clear effect | with two weapons (longsword and shortsword) |
| 365 | Pit of Snakes | 13 | Ancestry | — | save | +0.03 ± 0.02 | +0.03 | +0.03 | 0.7 | no clear effect |  |
| 366 | Inscribed Blast | 5 | Ancestry | — | check | +0.03 ± 0.02 | +0.02 | +0.04 | 0.8 | no clear effect |  |
| 367 | Gaping Flesh | 5 | Ancestry | — | save | +0.03 ± 0.02 | +0.01 | +0.05 | 0.6 | no clear effect |  |
| 368 | Martial Performance | 1 | Class | bard | innate spells: Courageous Anthem (rank 1), Rallying Anthem (rank 1), Song of Strength (rank 1) | +0.03 ± 0.03 | +0.06 | −0.00 | 2.7 | no clear effect |  |
| 369 | Devastating Shield Wallop | 12 | Class | guardian | Shield Wallop (stupefied 1, 2 on a critical hit), then a Fortitude save: prone, or stunned 1 on a critical failure | +0.03 ± 0.06 | +0.05 | +0.01 | 7.7 | no clear effect |  |
| 370 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.07 | −0.01 | 5.1 | no clear effect |  |
| 371 | Alchemical Shot | 4 | Class | gunslinger | a ranged Strike with a bomb's persistent damage (the bomb and the misfire not played) | +0.03 ± 0.08 | −0.03 | +0.09 | 3.1 | no clear effect |  |
| 372 | Xidao Sea Mine Drop | 6 | Class | inventor | save | +0.03 ± 0.08 | +0.15 | −0.09 | 4.1 | no clear effect |  |
| 373 | Quicken Heartbeat | 10 | Class | — | check | +0.03 ± 0.03 | +0.11 | −0.05 | 1.5 | no clear effect |  |
| 374 | Resilient Shell | 14 | Class | summoner | its eidolon's resistance to physical damage | +0.03 ± 0.02 | +0.03 | +0.02 | 14.6 | no clear effect |  |
| 375 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.03 ± 0.02 | +0.02 | +0.04 | 1.6 | no clear effect |  |
| 376 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | innate spell: Dragon Breath (rank 3) | +0.03 ± 0.04 | +0.04 | +0.01 | 1.0 | no clear effect |  |
| 377 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.03 ± 0.02 | −0.00 | +0.06 | 0.3 | no clear effect |  |
| 378 | Pirate Dedication | 2 | Class | — | Boarding Assault: Strike activity | +0.03 ± 0.04 | +0.01 | +0.04 | 1.3 | no clear effect |  |
| 379 | Courageous Assault | 10 | Class | bard | Courageous Anthem an action more, and an ally's melee Strike as a reaction | +0.03 ± 0.03 | +0.02 | +0.04 | 6.3 | no clear effect |  |
| 380 | Talon Sweep | 4 | Class | — | a melee Strike back at a flanking foe that misses it (reaction) | +0.03 ± 0.02 | +0.00 | +0.06 | 0.7 | no clear effect |  |
| 381 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.03 ± 0.04 | +0.13 | −0.07 | 1.0 | no clear effect |  |
| 382 | Solidarity | 9 | Ancestry | — | heals 18 (touch, 1/fight) | +0.03 ± 0.03 | +0.04 | +0.02 | 0.7 | no clear effect |  |
| 383 | Calcifying Sand | 4 | Class | kineticist | save | +0.03 ± 0.03 | +0.06 | +0.00 | 0.2 | no clear effect |  |
| 384 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.03 ± 0.02 | +0.07 | −0.01 | 10.3 | no clear effect | with a one-handed weapon and a free hand |
| 385 | Siege Celerity | 6 | Class | — | check | +0.03 ± 0.02 | +0.05 | +0.01 | 2.6 | no clear effect |  |
| 386 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.03 ± 0.03 | +0.11 | −0.05 | 2.6 | no clear effect |  |
| 387 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.03 ± 0.04 | +0.05 | +0.00 | 3.0 | no clear effect |  |
| 388 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.03 | +0.00 | +0.05 | 1.6 | no clear effect |  |
| 389 | Animal Companion (Ranger) | 1 | Class | ranger | its animal companion young (a bear, Commanded each turn) | +0.03 ± 0.06 | +0.21 | −0.16 | 8.2 | no clear effect |  |
| 390 | Primal Howl | 10 | Class | druid | its companion's Primal Howl (30-foot cone, fortitude, 5d6 sonic (DC 29, 1/fight)) | +0.03 ± 0.03 | +0.02 | +0.03 | 7.2 | no clear effect |  |
| 391 | Deliberate Death | 1 | Ancestry | — | a melee Strike at the foe that drops it (reaction, once) | +0.03 ± 0.01 | +0.06 | −0.00 | 0.2 | no clear effect |  |
| 392 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 393 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | +0.03 ± 0.07 | −0.09 | +0.14 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 394 | Tiger Slash | 6 | Class | monk | Strike activity (requirement assumed: You are in Tiger Stance) (in Tiger Stance) | +0.03 ± 0.06 | +0.06 | −0.01 | 5.4 | no clear effect |  |
| 395 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.04 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 396 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.03 ± 0.03 | +0.01 | +0.04 | 1.0 | no clear effect | with a loaded arquebus |
| 397 | Think Twice | 14 | Class | fighter | ac-reaction | +0.03 ± 0.02 | +0.03 | +0.02 | 0.4 | no clear effect |  |
| 398 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | +0.03 ± 0.06 | +0.09 | −0.04 | 1.0 | no clear effect |  |
| 399 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.03 ± 0.01 | −0.00 | +0.05 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 400 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.08 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 401 | Guardian's Intercept | 6 | Class | — | Intercept Attack, once a fight (reaction) | +0.03 ± 0.01 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 402 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.02 ± 0.02 | +0.03 | +0.02 | 11.1 | no clear effect |  |
| 403 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.01 | +0.04 | 0.9 | no clear effect |  |
| 404 | Defender's Grit | 4 | Class | — | passive effect (always on) | +0.02 ± 0.02 | +0.02 | +0.03 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 405 | Instrument of Zeal | 16 | Class | champion | its champion's reaction Strike: a critical hit's extra die and slowed 1 | +0.02 ± 0.01 | +0.02 | +0.03 | 0.6 | no clear effect |  |
| 406 | Timely Dodge | 0 | Action | — | ac-reaction | +0.02 ± 0.02 | +0.01 | +0.04 | 1.3 | no clear effect |  |
| 407 | Basic Flair | 4 | Class | — | Unbalancing Finisher: Strike activity | +0.02 ± 0.04 | +0.03 | +0.02 | 1.6 | no clear effect |  |
| 408 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.07 | −0.02 | 3.3 | no clear effect |  |
| 409 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.02 ± 0.06 | −0.02 | +0.07 | 1.0 | no clear effect |  |
| 410 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | +0.02 ± 0.09 | +0.10 | −0.05 | 1.0 | no clear effect |  |
| 411 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.02 | +0.06 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 412 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.02 ± 0.05 | −0.00 | +0.05 | 0.9 | no clear effect |  |
| 413 | Imposing Destrier | 10 | Class | champion | its animal companion incredible (against one mature) | +0.02 ± 0.04 | −0.03 | +0.08 | 12.3 | no clear effect |  |
| 414 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | +0.02 ± 0.03 | +0.03 | +0.01 | 0.9 | no clear effect |  |
| 415 | Iomedae's Valor | 6 | Class | — | staying up at 0 Hit Points | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | United Assault | 2 | Class | fighter | a flourish Strike, +1 damage for each other creature that hurt the target since its last turn (up to +4) | +0.02 ± 0.01 | +0.02 | +0.02 | 2.4 | no clear effect |  |
| 417 | Instrument of Slaughter | 16 | Class | champion | its champion's reaction Strike: a critical hit's persistent bleed | +0.02 ± 0.01 | +0.01 | +0.03 | 0.3 | no clear effect |  |
| 418 | Aura of Vengeance | 14 | Class | champion | allies' reaction Strikes at −2 with its Retributive Strike (its Exalt with it) | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.02 ± 0.02 | +0.02 | +0.03 | 2.4 | no clear effect |  |
| 420 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.04 | +0.02 | +0.03 | 1.0 | no clear effect |  |
| 421 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.02 ± 0.05 | +0.10 | −0.06 | 2.4 | no clear effect |  |
| 422 | General Training | 1 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.02 ± 0.03 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 423 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 424 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.02 ± 0.02 | +0.00 | +0.04 | 1.1 | no clear effect |  |
| 425 | Draw From the Land | 10 | Class | — | check | +0.02 ± 0.02 | +0.05 | −0.01 | 0.7 | no clear effect |  |
| 426 | Basic Death Dealing | 4 | Class | — | Deathly Scream: innate spell: Deathly Scream (rank 1) | +0.02 ± 0.04 | +0.04 | +0.01 | 1.0 | no clear effect |  |
| 427 | Defensive Advance | 1 | Class | champion | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.1 | no clear effect |  |
| 428 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.01 | +0.03 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 429 | Critical Debilitation | 12 | Class | rogue | on a critical hit, Debilitating Strike's Fortitude save: slowed 1, slowed 2 or paralyzed | +0.02 ± 0.03 | −0.04 | +0.08 | 0.9 | no clear effect |  |
| 430 | Expanded Splash | 10 | Class | alchemist | its Intelligence added to its bombs' splash | +0.02 ± 0.02 | +0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 431 | The Hallowed Dead | 1 | Class | — | +1 spirit damage on its thralls' Strikes | +0.02 ± 0.02 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 432 | The Unholy Dead | 1 | Class | — | +1 spirit damage on its thralls' Strikes | +0.02 ± 0.02 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 433 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.02 ± 0.02 | +0.04 | +0.00 | 0.3 | no clear effect |  |
| 434 | Histrionic Injury | 5 | Ancestry | — | save | +0.02 ± 0.02 | +0.01 | +0.03 | 0.6 | no clear effect |  |
| 435 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.02 | +0.05 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 436 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | +0.02 ± 0.03 | +0.00 | +0.04 | 1.6 | no clear effect |  |
| 437 | Enduring Debilitation | 20 | Class | rogue | its first debilitation a fight lasts a minute (free action) | +0.02 ± 0.02 | +0.04 | −0.00 | 1.0 | no clear effect |  |
| 438 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.02 ± 0.02 | +0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 439 | Back to Back | 8 | Class | — | allies beside it, and it beside an ally, not off-guard from flanking unless it (or the ally) is flanked too | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 440 | Scout's Warning | 4 | Class | ranger | +1 initiative to its allies (free action) | +0.02 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 441 | Flow of War | 6 | Class | exemplar | check | +0.02 ± 0.03 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 442 | Fungal Exhalation | 6 | Class | druid | innate spell: Fungal Exhalation (rank 3) | +0.02 ± 0.02 | +0.00 | +0.03 | 0.5 | no clear effect |  |
| 443 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.5 | no clear effect |  |
| 444 | Dragging Strike | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.10 | −0.07 | 3.1 | no clear effect |  |
| 445 | Lucky Escape | 4 | Class | — | an Effect on a foe | +0.02 ± 0.05 | −0.03 | +0.07 | 2.0 | no clear effect |  |
| 446 | Defend Mount | 6 | Class | — | a Strike at its mount taken on its own AC instead (reaction) | +0.02 ± 0.01 | +0.00 | +0.03 | 7.8 | no clear effect |  |
| 447 | Piercing Critical | 18 | Class | gunslinger | a natural 19 that hits with its gun is a critical hit | +0.02 ± 0.02 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Communal Healing | 2 | Class | cleric | each single-target heal heals the most hurt other ally by its rank | +0.02 ± 0.01 | +0.03 | +0.00 | 0.3 | no clear effect |  |
| 449 | Vampiric Spell | 4 | Class | — | Vampiric Spell copies of 5 damage spells: temporary Hit Points of half the most damage dealt | +0.02 ± 0.04 | +0.06 | −0.03 | 3.2 | no clear effect |  |
| 450 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.02 | +0.01 | +0.02 | 1.9 | no clear effect |  |
| 451 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | +0.02 ± 0.03 | +0.00 | +0.03 | 6.2 | no clear effect |  |
| 452 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | +0.02 ± 0.04 | −0.04 | +0.07 | 1.6 | no clear effect |  |
| 453 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 454 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.03 | +0.04 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 455 | Stitching Strike | 0 | Action | — | inline save: 1 creature, 30 feet, reflex, 6d6 slashing (DC 17, 1/fight) | +0.02 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 456 | Shed Spirit | 0 | Action | — | inline save: 1 creature, 20 feet, will, 6d6 spirit (DC 17, 1/fight) | +0.01 ± 0.05 | +0.00 | +0.03 | 1.0 | no clear effect |  |
| 457 | Nimble Strike | 10 | Class | rogue | Nimble Dodge, then a melee Strike at the attacker (reaction) | +0.01 ± 0.02 | +0.05 | −0.02 | 0.4 | no clear effect |  |
| 458 | Reclaim Power | 6 | Class | — | regains 12 HP (two thralls destroyed, once a fight) | +0.01 ± 0.03 | +0.09 | −0.06 | 0.5 | no clear effect |  |
| 459 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 460 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 461 | Ignite the Sun | 18 | Class | kineticist | save | +0.01 ± 0.08 | −0.01 | +0.04 | 6.2 | no clear effect |  |
| 462 | Defensive Recovery | 12 | Class | cleric | an action before each single-target Heal on an ally: +2 status to its AC and saves for a round | +0.01 ± 0.03 | −0.04 | +0.07 | 1.2 | no clear effect |  |
| 463 | Lingering Composition | 1 | Class | bard | Courageous Anthem for 3 rounds, the PC and its allies within 60 feet (once a fight) | +0.01 ± 0.01 | +0.02 | +0.00 | 4.8 | no clear effect |  |
| 464 | Spell Swipe | 8 | Class | magus | a 3-action Spellstrike at two adjacent foes, the spell on each it hits (a multi-target or area spell) | +0.01 ± 0.02 | +0.00 | +0.03 | 0.3 | no clear effect |  |
| 465 | Psi Burst | 2 | Class | psychic | save | +0.01 ± 0.04 | +0.02 | +0.00 | 5.8 | no clear effect |  |
| 466 | Seize | 14 | Class | — | check | +0.01 ± 0.06 | +0.12 | −0.10 | 7.7 | no clear effect |  |
| 467 | You Failed to Account For... This! | 16 | Class | inventor | its Crafting DC in place of its AC as it's targeted (reaction, when higher) | +0.01 ± 0.01 | +0.01 | +0.02 | 0.4 | no clear effect |  |
| 468 | Sea Swarmer | 9 | Ancestry | — | a foe in its reach and two allies' reach is off-guard to it | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 469 | Force Fang | 2 | Class | magus | Force Fang, as Force Barrage (rank 1) | +0.01 ± 0.05 | +0.11 | −0.08 | 1.8 | no clear effect |  |
| 470 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.02 | +0.00 | 0.4 | no clear effect |  |
| 471 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 472 | Furious Finish | 2 | Class | barbarian | Strike activity | +0.01 ± 0.03 | −0.05 | +0.08 | 1.3 | no clear effect |  |
| 473 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | +0.01 ± 0.07 | −0.09 | +0.12 | 1.0 | no clear effect | with a weapon and a shield |
| 474 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.01 ± 0.04 | +0.02 | +0.01 | 3.2 | no clear effect |  |
| 475 | Repel Assault | 6 | Class | — | resistance equal to its level against a big hit, 3 a fight | +0.01 ± 0.02 | +0.06 | −0.03 | 0.5 | no clear effect |  |
| 476 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.01 ± 0.02 | +0.04 | −0.02 | 0.6 | no clear effect |  |
| 477 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.01 ± 0.04 | −0.00 | +0.03 | 2.9 | no clear effect |  |
| 478 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 0.7 | no clear effect |  |
| 479 | You're Next | 1 | Class | rogue | downing a foe: a Demoralize at another, +2 (reaction) | +0.01 ± 0.02 | +0.00 | +0.02 | 1.8 | no clear effect |  |
| 480 | Cackle | 1 | Class | witch | one Sustain a fight as a free action (its Focus Point) | +0.01 ± 0.01 | +0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Resurrectionist | 16 | Class | cleric | a dying ally it heals gets fast healing 5 for 1 minute | +0.01 ± 0.01 | +0.00 | +0.02 | 0.5 | no clear effect |  |
| 482 | Coordinated Charge | 12 | Class | — | Strike activity | +0.01 ± 0.03 | +0.00 | +0.02 | 2.6 | no clear effect |  |
| 483 | Set-Up Strike | 2 | Class | commander | Strike activity | +0.01 ± 0.06 | +0.15 | −0.13 | 2.7 | no clear effect |  |
| 484 | Defiant Banner | 8 | Class | commander | effect | +0.01 ± 0.07 | −0.14 | +0.17 | 10.3 | no clear effect |  |
| 485 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.01 ± 0.04 | +0.10 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 486 | The Harder They Fall (Kingmaker) | 8 | Class | ranger | bludgeoning damage on a successful Trip (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 487 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.05 | +0.02 | +0.00 | 2.0 | no clear effect | with two weapons (longsword and shortsword) |
| 488 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 489 | Anthemic Performance | 8 | Class | — | innate spell: Courageous Anthem (rank 4) | +0.01 ± 0.03 | −0.02 | +0.04 | 3.4 | no clear effect |  |
| 490 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | +0.01 ± 0.04 | +0.04 | −0.02 | 1.0 | no clear effect |  |
| 491 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.3 | no clear effect |  |
| 492 | Commitment to Justice | 6 | Class | — | a flourish Strike at a foe that dropped an ally since its last turn, +3 damage per weapon die | +0.01 ± 0.01 | +0.02 | +0.00 | 0.5 | no clear effect |  |
| 493 | Herald's Strike | 20 | Class | — | save | +0.01 ± 0.06 | +0.02 | +0.00 | 3.5 | no clear effect |  |
| 494 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.04 | +0.02 | −0.00 | 2.2 | no clear effect |  |
| 495 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.01 ± 0.05 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 496 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 0.7 | no clear effect |  |
| 497 | Victorious Vigor | 5 | Ancestry | — | check | +0.01 ± 0.01 | +0.00 | +0.02 | 1.5 | no clear effect |  |
| 498 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 499 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | +0.01 ± 0.03 | −0.01 | +0.03 | 2.2 | no clear effect |  |
| 500 | Side by Side (Druid) | 10 | Class | druid | it and its companion flank a foe both are beside | +0.01 ± 0.02 | +0.00 | +0.01 | 8.0 | no clear effect |  |
| 501 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.01 | +0.01 | 1.7 | no clear effect |  |
| 502 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 503 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 504 | Cranial Detonation | 18 | Class | psychic | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.5 | no clear effect |  |
| 505 | Premonition of Avoidance | 1 | Class | cleric | self effect | +0.01 ± 0.01 | +0.02 | +0.00 | 1.7 | no clear effect |  |
| 506 | Draining Strike | 2 | Class | — | a Strike counting as two attacks; a hit spends a thrall for 1d6 spirit more, the necromancer healed as much (once a turn) | +0.01 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 507 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 2.5 | no clear effect |  |
| 508 | Doom of Sailors | 17 | Ancestry | — | save | +0.01 ± 0.05 | +0.02 | −0.01 | 1.0 | no clear effect |  |
| 509 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.02 | +0.02 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 510 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.01 ± 0.02 | +0.00 | +0.02 | 0.6 | no clear effect |  |
| 511 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | +0.01 ± 0.05 | +0.01 | +0.01 | 3.2 | no clear effect |  |
| 512 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.01 ± 0.02 | +0.04 | −0.02 | 0.3 | no clear effect |  |
| 513 | Aldori Riposte | 6 | Class | — | a riposte Strike on a critical miss (reaction) | +0.01 ± 0.02 | +0.04 | −0.02 | 0.3 | no clear effect |  |
| 514 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | +0.01 ± 0.02 | −0.02 | +0.04 | 0.3 | no clear effect |  |
| 515 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | +0.01 ± 0.03 | +0.06 | −0.04 | 0.6 | no clear effect |  |
| 516 | Exploit Opening | 6 | Class | — | a ranged Strike (+2) when an ally critically hits (reaction) | +0.01 ± 0.02 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 517 | Multitalented | 9 | Ancestry | — | Barbarian Dedication: Rage (+2 damage with its Greatsword) | +0.01 ± 0.05 | −0.01 | +0.03 | 1.0 | no clear effect |  |
| 518 | Everstand Strike | 4 | Class | champion | a press Strike, its shield raised if it hits | +0.01 ± 0.03 | −0.04 | +0.05 | 4.7 | no clear effect |  |
| 519 | Essence Overflow | 6 | Class | — | save (requirement assumed: You are Channeling Draconic Essence) | +0.01 ± 0.03 | −0.01 | +0.02 | 0.9 | no clear effect |  |
| 520 | Exult in Violence | 10 | Class | exemplar | after a critical hit this turn: inline save: 1 creature, 30 feet, reflex, 4d6 spirit (DC 29) | +0.01 ± 0.03 | +0.05 | −0.03 | 2.2 | no clear effect |  |
| 521 | Toughness | 1 | General | — | more maximum Hit Points | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 522 | Storm Shroud | 8 | Class | — | check | +0.01 ± 0.05 | +0.06 | −0.05 | 1.0 | no clear effect |  |
| 523 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.01 ± 0.02 | −0.01 | +0.02 | 0.3 | no clear effect |  |
| 524 | Follow-Up Assault | 8 | Class | barbarian | after a missed melee Strike, raging: a Strike +1 with its weapon dice in damage | +0.01 ± 0.02 | +0.03 | −0.02 | 7.4 | no clear effect |  |
| 525 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.01 ± 0.03 | +0.04 | −0.03 | 1.9 | no clear effect |  |
| 526 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.02 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 527 | Nature's Precision | 6 | Class | — | its companion's agile Strikes +1d4 precision against an off-guard foe | +0.00 ± 0.02 | +0.04 | −0.03 | 8.2 | no clear effect |  |
| 528 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.00 ± 0.02 | −0.00 | +0.01 | 0.1 | no clear effect | with a weapon and a shield |
| 529 | Combat Grab | 2 | Class | fighter | a press Strike that grabs on a hit | +0.00 ± 0.02 | +0.01 | −0.00 | 3.3 | no clear effect | with a one-handed weapon and a free hand |
| 530 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 531 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.04 | +0.01 | +0.00 | 1.6 | no clear effect |  |
| 532 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.00 ± 0.06 | −0.05 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 533 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) (in Crane Stance) | +0.00 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 534 | Vicious Debilitations | 10 | Class | rogue | Debilitating Strike's clumsy 1 in place of enfeebled 1 | +0.00 ± 0.03 | +0.09 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 535 | Ongoing Strategy | 10 | Class | investigator | precision damage of its strategic strike dice's number on Strikes without a stratagem | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 536 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.02 | −0.02 | +0.03 | 0.7 | no clear effect |  |
| 537 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | +0.00 ± 0.02 | −0.02 | +0.03 | 0.7 | no clear effect |  |
| 538 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.00 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 539 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.00 ± 0.05 | +0.12 | −0.11 | 3.8 | no clear effect |  |
| 540 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 541 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.02 | +0.05 | −0.04 | 2.2 | no clear effect |  |
| 542 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 543 | Crushing Grab | 2 | Class | monk | Strength damage on a successful Grapple (always on) | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 544 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | +0.02 | −0.02 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 545 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.00 ± 0.04 | +0.02 | −0.01 | 0.2 | no clear effect |  |
| 546 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.02 | +0.03 | −0.02 | 2.6 | no clear effect |  |
| 547 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | +0.00 ± 0.04 | +0.02 | −0.01 | 1.5 | no clear effect |  |
| 548 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 549 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 550 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.03 | +0.01 | +0.00 | 0.6 | no clear effect |  |
| 551 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 553 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 556 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 560 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Cornered Fury | 5 | Ancestry | — | a larger foe that critically hits it (a Small ratfolk: a Medium foe) is off-guard to it for a round | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 562 | Avenge Ally | 13 | Ancestry | — | with an ally dying within 30 feet, a Strike rolled twice (once a fight) | +0.00 ± 0.00 | +0.01 | −0.00 | 10.6 | no clear effect |  |
| 563 | Spiritual Aid | 12 | Class | — | Spiritual Aid: a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.02 | −0.03 | +0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 565 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 567 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | +0.00 ± 0.03 | −0.01 | +0.02 | 0.7 | no clear effect |  |
| 571 | Tail Guard | 8 | Class | — | a melee Strike at a foe moving in to flank it (reaction) | +0.00 ± 0.02 | +0.00 | +0.00 | 0.7 | no clear effect |  |
| 572 | Monk Moves | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Walk Through the Conflagration | 14 | Class | kineticist | save | +0.00 ± 0.03 | −0.00 | +0.01 | 0.7 | no clear effect |  |
| 574 | Hobbling Criticals | 18 | Class | summoner | its eidolon's critical hits: a Fortitude save, −10 feet Speed, slowed 1 or 2 (always on) | +0.00 ± 0.06 | +0.05 | −0.05 | 16.5 | no clear effect |  |
| 575 | Nimble Dodge | 1 | Class | rogue | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 576 | Brutal Bully | 6 | Class | barbarian | Strength damage on a successful maneuver (always on; raging not checked) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Drilled Reflexes | 10 | Class | commander | Drilled Reactions for up to two allies | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Mature Megafauna Companion | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.00 ± 0.04 | −0.04 | +0.04 | 9.0 | no clear effect |  |
| 579 | Mana Detonation | 18 | Class | — | innate spell: Arcane Explosion (rank 9) | +0.00 ± 0.03 | −0.01 | +0.01 | 0.4 | no clear effect |  |
| 580 | Shield of Reckoning | 10 | Class | champion | its Shield Block for the ally with its champion's reaction (once a round; its shield raised, forced) | +0.00 ± 0.06 | −0.00 | +0.00 | 0.7 | no clear effect |  |
| 581 | Come and Get Me | 10 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.05 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 582 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 583 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Reflexive Grapple | 12 | Class | — | Strike activity | +0.00 ± 0.06 | −0.05 | +0.05 | 9.1 | no clear effect |  |
| 585 | Masked Casting | 8 | Class | — | self effect | +0.00 ± 0.01 | +0.00 | +0.00 | 3.4 | no clear effect |  |
| 586 | Reversing Charge | 8 | Class | — | Strike activity | +0.00 ± 0.03 | −0.02 | +0.02 | 2.4 | no clear effect |  |
| 587 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 588 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 589 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 590 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 591 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 592 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 593 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | +0.00 ± 0.04 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 594 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.03 | +0.04 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 595 | Sour Bomb | 10 | Class | alchemist | a Fortitude save on each bomb hit: sickened 1, or 2 and fleeing (always on) | +0.00 ± 0.03 | +0.03 | −0.02 | 1.3 | no clear effect |  |
| 596 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Temporal Fury | 14 | Class | — | two Strikes for two actions (a Mythic Point) | +0.00 ± 0.02 | +0.00 | +0.00 | 3.0 | no clear effect |  |
| 598 | Combination Finisher | 6 | Class | swashbuckler | its finishers' multiple attack penalty −4/−8 (−3/−6 agile) | +0.00 ± 0.02 | −0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 599 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | +0.00 ± 0.03 | +0.04 | −0.04 | 3.5 | no clear effect |  |
| 600 | Swift Retribution | 18 | Class | champion | an extra action after its champion's reaction | +0.00 ± 0.02 | −0.00 | +0.00 | 1.0 | no clear effect |  |
| 601 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Shining Glory | 18 | Class | — | save (requirement assumed: Your nimbus is active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Life's Blood | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Echoes in Stone | 9 | Ancestry | — | effect (requirement assumed: You are standing on a stone or earthen surface) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 612 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 613 | Bolera's Interrogation | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Rat Form | 9 | Ancestry | — | casts Pest Form (rank 1, DC 25) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Channel Elements | 0 | Action | kineticist | effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 619 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 621 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 624 | Wrapped In Smoke | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Invoke Offense | 4 | Class | — | effect (requirement assumed: You're under the effects of Enter Spirit Trance. You manifest a physical attack of the spirits all around you, such as the claw of an animal spirit or the whipping vine of a nature spirit) (in Enter Spirit Trance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 627 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Bite and Sting | 0 | Action | — | save (requirement assumed: Your swarm is outside your body) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 630 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 632 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 633 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 634 | Shadow Spell | 8 | Class | — | an Effect on a foe | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Overwhelming Spellstrike | 12 | Class | magus | Spellstrike's spell ignoring energy resistance up to its level (at a foe that resists) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 636 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 637 | Wave the Flag | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 638 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 639 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Special Sentinel Technique | 4 | Class | — | innate spell: Luminous Stardust Healing (rank 2), Shining Starlight Attack (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 641 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 642 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 643 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Advanced Hallowed Spell | 8 | Class | — | innate spell: Life Siphon (rank 4), Eradicate Undeath (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 645 | Shake it Off | 2 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Lore Seeker | 8 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Banner's Inspiration | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 648 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 650 | Basic Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 651 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 652 | Wildborn Adept | 5 | Ancestry | — | innate spell: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Determined Lore Seeker | 12 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 654 | Orc Superstition | 1 | Ancestry | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.7 | no clear effect |  |
| 655 | Confident Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Spell Protection Array | 4 | Class | wizard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 658 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spell: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Horn and Bone Incantation | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Humanoid Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 661 | Spiritual Echo | 9 | Ancestry | — | innate spell: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 663 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 664 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.1 | no clear effect |  |
| 665 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 669 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 670 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 671 | Mystical Flare | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 672 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 674 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 675 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 677 | Hallowed Necromancer Dedication | 2 | Class | — | innate spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 678 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Cultivator Dedication | 2 | Class | — | innate spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 680 | Positive Luminance | 8 | Class | — | innate spell: Vital Luminance (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 681 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 682 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 684 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 685 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 686 | Magical Adaptation | 10 | Class | — | innate spell: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Eternal Boost | 20 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 14.9 | no clear effect |  |
| 688 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Shield from Arrows | 8 | Class | guardian | +4 AC to an adjacent ally as a ranged Strike hits it, its shield raised (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 691 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 693 | True Senses | 17 | Ancestry | — | casts Truesight (rank 6, DC 37, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 696 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 697 | Asura Magic | 9 | Ancestry | — | innate spell: Blood Vendetta (rank 2), Death Knell (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 698 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 699 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Kineticist Dedication | 2 | Class | — | Channel Elements: effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 704 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 705 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 706 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 707 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 708 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 709 | Rogue Dedication | 2 | Class | — | Surprise Attack: foes that haven't acted are off-guard to it the first round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Basic Witchcraft | 4 | Class | — | Witch's Armaments: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Untamed Form | 1 | Class | druid | innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 713 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 714 | Form of the Bat | 13 | Ancestry | — | casts Pest Form (rank 4, DC 32, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 715 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Wings of the Dragon | 12 | Class | — | innate spell: Dragon Wings (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Swing the Censer | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 718 | Flashing Shield | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 721 | Phase Out | 6 | Class | summoner | an Effect on an ally | +0.00 ± 0.00 | +0.00 | +0.00 | 12.7 | no clear effect |  |
| 722 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 726 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.8 | no clear effect | with a one-handed weapon and a free hand |
| 727 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 729 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 730 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Worm Caller Dedication | 2 | Class | — | Shake it Off: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Monk Dedication | 2 | Class | — | Powerful Fist: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Three Clear Breaths | 6 | Class | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 738 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Harmonize Self | 4 | Class | monk | innate spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Spellstriker | 4 | Class | — | Spellstrike: spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Basic Shooting | 4 | Class | — | Hit the Dirt!: +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Basic Dogma | 4 | Class | — | Resilient Mind: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 746 | Basic Concoction | 4 | Class | — | Poison Resistance: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Basic Glory | 4 | Class | — | Sanctified Soul: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Reactive Striker | 4 | Class | — | Reactive Strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Basic Martial Magic | 4 | Class | — | Arcane Fists: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Basic Trickery | 4 | Class | — | Nimble Dodge: +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Basic Deduction | 4 | Class | — | Certain Stratagem: half its strategic strike dice on a stratagem Strike's miss (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 756 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 757 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Scorching Disarm | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 762 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Devout Blessing | 6 | Class | — | Blessed Swiftness: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 8.9 | no clear effect |  |
| 766 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 767 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Grimspawn | 1 | Ancestry | — | Diehard: dies at dying 5 | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Finishing Precision | 4 | Class | — | Basic Finisher: Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 771 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 779 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 12.7 | no clear effect |  |
| 780 | Wind Caller | 8 | Class | druid | innate spell: Stormwind Flight (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 783 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 789 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 792 | Sense the Strike | 10 | Class | — | its Survival DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Uncanny Dodge | 10 | Class | — | Deny Advantage: passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Sound Mirror | 6 | Class | — | innate spell: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Deathly Secrets | 6 | Class | — | innate spell: Eyes of the Dead (rank 3), Subjugate Undead (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Disciple of Shade | 6 | Class | — | innate spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 799 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 801 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 802 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | Remorseless Lash | 1 | Ancestry | — | a melee weapon hit keeps a frightened foe at frightened 1 until its next turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 808 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 811 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 812 | Water Nagaji | 1 | Ancestry | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 813 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 814 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 815 | Eternal Composition | 18 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 816 | Push Back the Dead! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.9 | no clear effect |  |
| 819 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 820 | Aggressive Block | 2 | Class | fighter | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 822 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 825 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Just the Facts | 20 | Class | investigator | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 828 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.9 | no clear effect |  |
| 830 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 832 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 834 | Stand Firm | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 839 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 840 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 841 | Divine Rebuttal | 6 | Class | cleric | a Strike at an adjacent caster as its allies save against it: +2 (+3) to the save on a hit (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 843 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 844 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 846 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 848 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Gaze of Veracity | 10 | Class | — | innate spell: Glimpse the Truth (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 851 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 853 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 854 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 855 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 856 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 857 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 858 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 862 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Master Siege Engineer | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 879 | Advantageous Assault | 6 | Class | fighter | a press Strike at a prone foe, + its weapon dice in damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 880 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 881 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 883 | Undead Slayer | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 884 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 885 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 886 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 887 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 888 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 889 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 890 | Speaking Sky | 12 | Class | — | innate spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 892 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 893 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 894 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 895 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 896 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 900 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 902 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 904 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 905 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 906 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 907 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 909 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | Proud Nail | 4 | Class | guardian | a melee flourish Strike at its taunted foe that ignored the taunt, extra weapon dice | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 912 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 914 | Heightened Instincts | 18 | Class | — | its companion's successful saves critical successes | +0.00 ± 0.00 | +0.00 | +0.00 | 12.4 | no clear effect |  |
| 915 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Wind Jump | 10 | Class | monk | innate spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 918 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 920 | Flamboyant Cruelty | 8 | Class | swashbuckler | +1 damage for each of clumsy, drained, enfeebled, frightened, sickened, stupefied on the foe, when it has two or more | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 921 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 922 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 923 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 925 | Diehard | 1 | General | — | dies at dying 5 | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 928 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 931 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 932 | Keep up the Good Fight | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 934 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 935 | Inexhaustible Countermoves | 20 | Class | swashbuckler | an extra reaction in each foe's turn for Opportune Riposte | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 936 | Peerless Captain | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 939 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 941 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 942 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 945 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 946 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 947 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 949 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 951 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 952 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 953 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 954 | Cellular Reconstruction | 12 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 956 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 958 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 960 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 962 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 964 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 965 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 967 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 968 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 970 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 972 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 973 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 977 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Keep Up the Good Fight | 14 | Class | guardian | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 979 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 980 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 982 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 983 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 986 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 987 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 989 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 990 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 991 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 992 | Giant Slayer | 16 | Class | ranger | two critical hits on a giant in a turn: a Fortitude save or it dies | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 993 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 994 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 995 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 996 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 997 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 998 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 999 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1000 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1001 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1002 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1003 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1004 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1005 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1006 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1007 | Autonomic Psychic Action | 20 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1008 | Full Automation | 20 | Class | inventor | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1011 | Kinetic Pinnacle | 20 | Class | kineticist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1013 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 15.2 | no clear effect |  |
| 1014 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1015 | Soul Oubliette | 20 | Class | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1016 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1017 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1018 | Panache Paragon | 20 | Class | swashbuckler | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Enduring Quickness | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Perfect Readiness | 20 | Class | gunslinger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1021 | Punishing Shove | 1 | Class | guardian | damage on a successful Shove (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1022 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1023 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1024 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1026 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1027 | Soothing Ballad | 14 | Class | bard | innate spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1028 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Expanded Runelord Magic | 14 | Class | — | innate spell: Contingency (rank 7), Spell Riposte (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1031 | Rites of Liberation | 14 | Class | — | innate spell: Unimpeded Stride (rank 1), Word of Freedom (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1033 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1036 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1037 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.1 | no clear effect |  |
| 1038 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1039 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1040 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1041 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1042 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1044 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1045 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1046 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1047 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1048 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1049 | Demonbane Warrior | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1050 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1051 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1052 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1053 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1054 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1055 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1056 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1057 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1058 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1059 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1060 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1061 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1062 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1063 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1064 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1065 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1066 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1067 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1068 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1069 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1070 | Phalanx Formation | 2 | Class | guardian | no lesser cover from it for its allies' targets | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1071 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1072 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1073 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1074 | Finishing Follow-Through | 2 | Class | swashbuckler | panache back when a finisher brings its target to 0 HP | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 1075 | Uplifting Overture | 2 | Class | bard | innate spell: Uplifting Overture (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1076 | Song of Strength | 2 | Class | bard | innate spell: Song of Strength (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1077 | Certain Stratagem | 2 | Class | investigator | half its strategic strike dice on a stratagem Strike's miss (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1078 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1079 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1080 | Target of Opportunity | 14 | Class | — | a ranged Strike (–2) when an ally's ranged Strike hits (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 1081 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1082 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1083 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1084 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1085 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1086 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1087 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1088 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1089 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1090 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1091 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1092 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1093 | Sympathetic Vulnerabilities | 6 | Class | thaumaturge | personal antithesis on every foe of the exploited one's kind | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1094 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1096 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1097 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1098 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1099 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1100 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1101 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1102 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1103 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1104 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1105 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1106 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1107 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.7 | no clear effect |  |
| 1108 | Manifold Modifications | 8 | Class | inventor | Harmonic Oscillator: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1109 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1110 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1111 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1112 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1113 | Second Blessing | 8 | Class | champion | Blessed Swiftness: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 11.9 | no clear effect |  |
| 1114 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1115 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1116 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1117 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1118 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1119 | Swift Paragon | 20 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 12.1 | no clear effect |  |
| 1120 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1121 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1122 | Silence the Profane | 8 | Class | — | reaction Strike (cast) (requirement assumed: You are wielding your deity's favored weapon) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1123 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1124 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.7 | no clear effect |  |
| 1125 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1126 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1127 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1128 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1129 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1130 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1131 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1132 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1133 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1134 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1135 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1136 | Resounding Bravery | 8 | Class | fighter | +1 to saves and temporary Hit Points on a critically successful Will save (doubled against fear) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1137 | Projectile Snatching | 8 | Class | monk | Deflect Projectile, a deflected attack thrown back (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1138 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1139 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1140 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1141 | Sustaining Steel | 10 | Class | magus | a slot spell's Spellstrike heals it the rank (double in Arcane Cascade) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1142 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1143 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1144 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1145 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1146 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1147 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1148 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1149 | Conjurer's Countermeasure | 6 | Class | magus | innate spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1150 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1151 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1152 | Hedge Prison | 6 | Class | druid | innate spell: Hedge Prison (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1153 | Journey of the Sky Chariot | 10 | Class | exemplar | Race the Skies: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1154 | Agonizing Rebuke | 5 | Ancestry | — | mental damage on a successful Demoralize (always on; once, not each turn) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1155 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1156 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1157 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1158 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1159 | Blind-Fight | 8 | Class | fighter | concealed and hidden targets easier to hit, not off-guard to hidden foes (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1160 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1162 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1163 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1164 | Foresee Danger | 12 | Class | investigator | its Perception DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Desperate Wish | 12 | Class | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1166 | Miraculous Medic | 13 | Ancestry | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1167 | Arise, Ye Worthy! | 13 | Ancestry | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1168 | Receive Prayers | 14 | Class | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1169 | Impaling Briars | 16 | Class | druid | innate spell: Impaling Briars (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1170 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | −0.00 ± 0.03 | +0.01 | −0.01 | 1.4 | no clear effect |  |
| 1171 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1172 | Tenacious Endurance | 6 | Class | — | its companion stays up at 1 HP once (wounded 1) | −0.00 ± 0.00 | +0.00 | −0.00 | 8.7 | no clear effect |  |
| 1173 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1174 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.00 | 4.2 | no clear effect |  |
| 1175 | Invented Vulnerability | 6 | Class | — | Deception against Will: weakness 5 to piercing for a round (1 action, once a fight) | −0.00 ± 0.04 | +0.06 | −0.06 | 1.6 | no clear effect |  |
| 1176 | Instant Recovery | 0 | Action | — | healing | −0.00 ± 0.03 | +0.01 | −0.01 | 0.5 | no clear effect |  |
| 1177 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1178 | Meditate on This! | 14 | Class | barbarian | save | −0.00 ± 0.06 | +0.03 | −0.04 | 3.7 | no clear effect |  |
| 1179 | Accelerating Touch | 4 | Class | champion | +10 feet Speed until its next turn for an ally its Lay on Hands heals | −0.00 ± 0.02 | −0.02 | +0.02 | 0.5 | no clear effect |  |
| 1180 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | −0.00 ± 0.01 | −0.02 | +0.02 | 0.1 | no clear effect |  |
| 1181 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1182 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1183 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1184 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1185 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1186 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1187 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1188 | May Death Itself Reconsider | 20 | Class | — | innate spell: Breath of Life (rank 5) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1189 | Parry and Riposte | 18 | Class | swashbuckler | Opportune Riposte on a foe's failed Strike too (its finisher and parry taken as met) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1190 | Felicitous Riposte | 16 | Class | swashbuckler | Opportune Riposte rolled twice, the better kept | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1191 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | −0.00 ± 0.02 | +0.03 | −0.04 | 0.8 | no clear effect |  |
| 1192 | Raise Island | 8 | Class | exemplar | save | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1193 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | −0.00 ± 0.06 | −0.00 | −0.01 | 1.0 | no clear effect |  |
| 1194 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.00 ± 0.02 | −0.00 | −0.00 | 0.8 | no clear effect |  |
| 1195 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1196 | Siren Song | 9 | Ancestry | — | inline save: 60-foot emanation, will (DC 25, 1/fight) | −0.00 ± 0.02 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 1197 | Tracing Trance | 6 | Class | — | effect | −0.00 ± 0.02 | +0.01 | −0.01 | 7.4 | no clear effect |  |
| 1198 | Duelist's Form | 16 | Class | — | a stance: quickened | −0.00 ± 0.05 | −0.01 | +0.00 | 1.0 | no clear effect |  |
| 1199 | Leave an Opening | 14 | Class | rogue | its melee critical hit on an off-guard foe sets off an ally's Reactive Strike | −0.00 ± 0.02 | −0.01 | +0.00 | 0.5 | no clear effect |  |
| 1200 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.04 | −0.12 | +0.11 | 0.0 | no clear effect | the AI never used it |
| 1201 | Basic Kata | 4 | Class | — | Crushing Grab: Strength damage on a successful Grapple (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1202 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | −0.00 ± 0.03 | −0.02 | +0.02 | 0.6 | no clear effect |  |
| 1203 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | −0.00 ± 0.03 | −0.01 | +0.01 | 0.3 | no clear effect |  |
| 1204 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.01 | +0.00 | −0.01 | 2.6 | no clear effect |  |
| 1205 | Muscle Barrier | 2 | Class | — | 10 temporary HP on an ally (its focus spell, a thrall destroyed, once a fight) | −0.00 ± 0.04 | −0.00 | −0.00 | 2.0 | no clear effect |  |
| 1206 | Savage Critical | 18 | Class | fighter | a natural 19 that hits is a critical hit | −0.00 ± 0.02 | −0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1207 | Voice Cold as Death | 7 | Skill | — | check | −0.00 ± 0.03 | +0.03 | −0.03 | 3.4 | no clear effect |  |
| 1208 | Expansive Spellstrike | 2 | Class | magus | Spellstrike with a burst, cone or line spell, its area about the target | −0.00 ± 0.02 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1209 | Resounding Cascade | 16 | Class | magus | its Arcane Cascade's extra damage for allies beside it | −0.00 ± 0.05 | −0.02 | +0.01 | 0.6 | no clear effect |  |
| 1210 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.01 ± 0.03 | −0.03 | +0.02 | 3.4 | no clear effect |  |
| 1211 | Vessel's Form | 16 | Class | — | check | −0.01 ± 0.02 | +0.01 | −0.03 | 0.3 | no clear effect |  |
| 1212 | Close Contract | 10 | Class | — | effect (requirement assumed: You have completed your active course of action but haven't Dismissed it or chosen a new one) | −0.01 ± 0.05 | +0.06 | −0.07 | 2.0 | no clear effect |  |
| 1213 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | −0.01 ± 0.05 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 1214 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1215 | Cry Havoc! | 0 | Action | commander | save | −0.01 ± 0.05 | +0.15 | −0.16 | 0.8 | no clear effect |  |
| 1216 | Kindle Inner Flames | 8 | Class | kineticist | +1 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.01 ± 0.09 | −0.08 | +0.07 | 2.0 | no clear effect |  |
| 1217 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | −0.01 ± 0.02 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 1218 | Bend Time | 0 | Action | — | check | −0.01 ± 0.02 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 1219 | Tragic Lament | 18 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 1220 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.01 ± 0.03 | +0.00 | −0.01 | 1.0 | no clear effect |  |
| 1221 | Song of the Soul | 2 | Class | — | heals an ally 1d8 (its focus spell through a thrall, once a fight; the fast healing near the thrall not played) | −0.01 ± 0.04 | +0.00 | −0.02 | 0.6 | no clear effect |  |
| 1222 | Hulking Size | 8 | Class | summoner | its eidolon Large, reach 10 feet | −0.01 ± 0.08 | −0.27 | +0.25 | 14.7 | no clear effect |  |
| 1223 | Tangle of Battle | 10 | Class | barbarian | a Grapple at a foe it critically hits (reaction) | −0.01 ± 0.03 | −0.05 | +0.03 | 1.1 | no clear effect |  |
| 1224 | Assisting Shot | 2 | Class | fighter | a ranged press Strike, +1 to the next ally's attack at its target | −0.01 ± 0.05 | +0.04 | −0.05 | 3.3 | no clear effect | with a loaded arquebus |
| 1225 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 1.8 | no clear effect |  |
| 1226 | Exacting Strike | 1 | Class | fighter | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 2.3 | no clear effect |  |
| 1227 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1228 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | −0.01 ± 0.03 | −0.08 | +0.07 | 0.6 | no clear effect |  |
| 1229 | Precise Debilitations | 10 | Class | rogue | Debilitating Strike's off-guard in place of enfeebled 1 | −0.01 ± 0.03 | +0.06 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1230 | Cautious Word | 12 | Class | — | check | −0.01 ± 0.01 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 1231 | Bone Burst | 6 | Class | — | inline save: 1 creature, 30 feet, reflex, 2d10 piercing (DC 22) — at a foe beside a thrall that moves, manipulates or shoots (reaction, a thrall destroyed) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.7 | no clear effect |  |
| 1232 | Eidolon's Trample | 16 | Class | summoner | save | −0.01 ± 0.02 | −0.02 | +0.00 | 15.4 | no clear effect |  |
| 1233 | Incredible Mount | 8 | Class | — | its animal companion incredible (against one mature) | −0.01 ± 0.04 | +0.13 | −0.15 | 14.6 | no clear effect |  |
| 1234 | Incredible Megafauna Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | −0.01 ± 0.04 | +0.13 | −0.15 | 14.6 | no clear effect |  |
| 1235 | Incredible Dragon Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | −0.01 ± 0.04 | +0.13 | −0.15 | 14.6 | no clear effect |  |
| 1236 | Sawtooth Grapple | 8 | Class | rogue | 2 Strikes (requirement assumed: You're wielding two weapons, at least one of which is a sawtooth saber) | −0.01 ± 0.02 | +0.00 | −0.02 | 3.3 | no clear effect |  |
| 1237 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.01 ± 0.02 | −0.01 | −0.00 | 1.0 | no clear effect |  |
| 1238 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.08 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 1239 | Viking Weapon Familiarity | 4 | Class | — | Shield Block: Shield Block (reaction), a shield with it | −0.01 ± 0.02 | −0.04 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1240 | Heartless Debilitations | 10 | Class | rogue | Debilitating Strike's frightened 1 in place of enfeebled 1 | −0.01 ± 0.03 | +0.02 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1241 | Basic Synergy | 4 | Class | — | Alacritous Action: its eidolon's Speed +10 feet | −0.01 ± 0.01 | +0.00 | −0.02 | 9.3 | no clear effect |  |
| 1242 | Never! | 16 | Class | guardian | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 14.4 | no clear effect |  |
| 1243 | Blazing Spirit | 6 | Class | animist | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1244 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | −0.01 ± 0.02 | −0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1245 | Black Cat Curse | 13 | Ancestry | — | a foe's successful save rerolled, the worse kept (reaction, once a fight) | −0.01 ± 0.03 | −0.03 | +0.01 | 0.9 | no clear effect |  |
| 1246 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1247 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.01 ± 0.05 | +0.24 | −0.26 | 5.5 | no clear effect |  |
| 1248 | Blessed Sacrifice | 4 | Class | — | innate spell: Protector's Sacrifice (rank 1) | −0.01 ± 0.01 | +0.01 | −0.03 | 0.3 | no clear effect |  |
| 1249 | For My House! | 0 | Action | — | self effect | −0.01 ± 0.02 | −0.01 | −0.02 | 1.6 | no clear effect |  |
| 1250 | Absorb Strength | 5 | Ancestry | — | check | −0.01 ± 0.02 | +0.02 | −0.04 | 0.6 | no clear effect |  |
| 1251 | Dazzling Dragonet Disappearance | 17 | Ancestry | — | check | −0.01 ± 0.02 | −0.03 | +0.01 | 0.2 | no clear effect |  |
| 1252 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.01 ± 0.04 | −0.00 | −0.02 | 4.7 | no clear effect |  |
| 1253 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | −0.01 ± 0.03 | −0.02 | +0.00 | 1.3 | no clear effect |  |
| 1254 | Vicious Rend | 10 | Class | — | its companion's Vicious Rend (two claws, bleed if both hit) | −0.01 ± 0.02 | −0.00 | −0.02 | 12.6 | no clear effect |  |
| 1255 | World-Breaking Footfall | 14 | Class | monk | save (requirement assumed: You are in Kaiju Stance and are touching the ground) | −0.01 ± 0.03 | +0.03 | −0.06 | 0.6 | no clear effect |  |
| 1256 | Basic Muse's Whispers | 4 | Class | — | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | −0.01 ± 0.05 | −0.02 | −0.00 | 1.0 | no clear effect |  |
| 1257 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.3 | no clear effect |  |
| 1258 | Death Drone | 0 | Action | — | save | −0.01 ± 0.05 | +0.02 | −0.04 | 1.6 | no clear effect |  |
| 1259 | Banner Twirl | 4 | Class | commander | check | −0.01 ± 0.07 | +0.16 | −0.19 | 2.5 | no clear effect |  |
| 1260 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | −0.01 ± 0.04 | −0.04 | +0.02 | 1.5 | no clear effect |  |
| 1261 | Zealous Inevitability | 6 | Class | — | Strike activity (requirement assumed: You are wielding your deity's favored weapon) | −0.01 ± 0.01 | +0.00 | −0.02 | 2.6 | no clear effect |  |
| 1262 | Call the Swarm | 17 | Ancestry | — | check | −0.01 ± 0.03 | +0.00 | −0.02 | 0.7 | no clear effect |  |
| 1263 | Start the Festival! | 17 | Ancestry | — | check | −0.01 ± 0.03 | +0.00 | −0.02 | 0.7 | no clear effect |  |
| 1264 | Megaton Strike | 4 | Class | inventor | Strike activity | −0.01 ± 0.09 | +0.02 | −0.05 | 5.6 | no clear effect |  |
| 1265 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1266 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.01 ± 0.02 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1267 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | −0.01 ± 0.01 | −0.03 | +0.00 | 1.9 | no clear effect |  |
| 1268 | Greenwatcher | 10 | Class | gunslinger | innate spell: Faerie Fire (rank 2) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.2 | no clear effect |  |
| 1269 | Exsanguinate | 6 | Class | — | check | −0.01 ± 0.02 | +0.03 | −0.06 | 0.5 | no clear effect |  |
| 1270 | Hellbreaker Strike | 0 | Action | — | Strike activity | −0.01 ± 0.04 | +0.02 | −0.05 | 1.6 | no clear effect |  |
| 1271 | Stasian Smash | 8 | Class | — | Strike activity | −0.01 ± 0.05 | +0.04 | −0.07 | 3.8 | no clear effect |  |
| 1272 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | −0.01 ± 0.01 | −0.00 | −0.03 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1273 | Cleansing Light | 17 | Ancestry | — | check | −0.01 ± 0.05 | −0.01 | −0.02 | 1.0 | no clear effect |  |
| 1274 | Eldritch Debilitations | 10 | Class | rogue | Debilitating Strike's stupefied 1 in place of enfeebled 1 | −0.01 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1275 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1276 | Perfect Ki Expert | 10 | Class | — | innate spells: Unblinking Flame Aura (rank 5), Unbreaking Wave Vapor (rank 5), Unfolding Wind Buffet (rank 5), Untwisting Iron Roots (rank 5) | −0.01 ± 0.03 | +0.03 | −0.06 | 0.8 | no clear effect |  |
| 1277 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.01 | 1.5 | no clear effect |  |
| 1278 | Alacritous Action | 2 | Class | summoner | its eidolon's Speed +10 feet | −0.01 ± 0.01 | −0.01 | −0.02 | 9.6 | no clear effect |  |
| 1279 | Emit Defensive Odor | 1 | Ancestry | — | save | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1280 | Ferocious Beasts | 13 | Ancestry | — | its companion's Orc Ferocity | −0.02 ± 0.01 | −0.02 | −0.01 | 11.3 | no clear effect |  |
| 1281 | Calaca's Showstopper | 13 | Ancestry | — | save | −0.02 ± 0.01 | +0.00 | −0.03 | 0.2 | no clear effect |  |
| 1282 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.02 ± 0.03 | −0.07 | +0.04 | 0.7 | no clear effect |  |
| 1283 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.02 ± 0.05 | −0.06 | +0.03 | 1.0 | no clear effect |  |
| 1284 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.02 ± 0.05 | −0.06 | +0.03 | 1.0 | no clear effect |  |
| 1285 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | −0.02 ± 0.05 | −0.06 | +0.03 | 1.0 | no clear effect |  |
| 1286 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.02 ± 0.02 | −0.02 | −0.01 | 0.3 | no clear effect |  |
| 1287 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.02 ± 0.02 | −0.02 | −0.01 | 0.3 | no clear effect |  |
| 1288 | Dive of the Divine | 16 | Class | — | save (requirement assumed: You are at least 20 feet above the ground) | −0.02 ± 0.03 | −0.03 | −0.01 | 0.7 | no clear effect |  |
| 1289 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.02 ± 0.02 | −0.01 | −0.02 | 2.2 | no clear effect | with two weapons (longsword and shortsword) |
| 1290 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.02 ± 0.01 | −0.03 | −0.00 | 0.2 | no clear effect |  |
| 1291 | Feral Lunge | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | −0.02 ± 0.04 | +0.07 | −0.10 | 2.8 | no clear effect |  |
| 1292 | Heal Companion | 1 | Class | ranger | focus spell: Heal Companion (rank 1) | −0.02 ± 0.02 | −0.02 | −0.01 | 8.9 | no clear effect |  |
| 1293 | Momentous Charge | 6 | Class | monk | Strike activity (requirement assumed: You're in Rushing Goat Stance) (in Rushing Goat Stance) | −0.02 ± 0.06 | −0.01 | −0.03 | 2.5 | no clear effect |  |
| 1294 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.02 ± 0.04 | +0.00 | −0.04 | 1.7 | no clear effect |  |
| 1295 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | −0.02 ± 0.04 | +0.00 | −0.03 | 1.5 | no clear effect |  |
| 1296 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | −0.02 ± 0.04 | −0.06 | +0.02 | 0.9 | no clear effect |  |
| 1297 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.06 | −0.02 | −0.01 | 2.4 | no clear effect |  |
| 1298 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | −0.02 ± 0.06 | +0.00 | −0.04 | 1.0 | no clear effect |  |
| 1299 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | −0.02 ± 0.07 | −0.01 | −0.03 | 1.0 | no clear effect |  |
| 1300 | Sympathetic Strike | 4 | Class | witch | a melee Strike: −1 (−2) to the target's saves against its hexes until its next turn | −0.02 ± 0.02 | −0.04 | +0.01 | 0.4 | no clear effect |  |
| 1301 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.02 ± 0.01 | −0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1302 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.02 ± 0.01 | −0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1303 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.02 ± 0.01 | −0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1304 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.02 ± 0.01 | −0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1305 | Rearing Display | 12 | Class | — | its mount's Strike, a hit followed by a Demoralize | −0.02 ± 0.04 | −0.02 | −0.02 | 14.7 | no clear effect |  |
| 1306 | Ravel of Thorns | 4 | Class | kineticist | 2 piercing to foes moving in its 10-foot kinetic aura (stance, the fight) | −0.02 ± 0.08 | −0.04 | +0.00 | 1.6 | no clear effect |  |
| 1307 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.02 ± 0.04 | −0.05 | +0.01 | 1.0 | no clear effect |  |
| 1308 | Campfire Chronicler Dedication | 2 | Class | — | Offer Story: effect | −0.02 ± 0.04 | +0.10 | −0.14 | 4.4 | no clear effect |  |
| 1309 | Pouncing Transformation | 12 | Class | — | check | −0.02 ± 0.06 | +0.11 | −0.15 | 5.8 | no clear effect |  |
| 1310 | Harrying Strike | 10 | Class | — | Strike activity | −0.02 ± 0.01 | −0.01 | −0.03 | 8.9 | no clear effect |  |
| 1311 | Bolstered Recovery | 16 | Class | — | Instant Recovery: healing | −0.02 ± 0.02 | −0.02 | −0.02 | 0.2 | no clear effect |  |
| 1312 | Tactical Debilitations | 10 | Class | rogue | Debilitating Strike's no reactions in place of enfeebled 1 | −0.02 ± 0.02 | −0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1313 | Spirit's Anguish | 8 | Class | — | save | −0.02 ± 0.05 | +0.08 | −0.12 | 2.9 | no clear effect |  |
| 1314 | Quick Vengeance | 18 | Class | guardian | an extra action after its Intercept Attack or Shield Block | −0.02 ± 0.01 | −0.01 | −0.03 | 0.6 | no clear effect |  |
| 1315 | Irresistible Bloom | 17 | Ancestry | — | save | −0.02 ± 0.01 | +0.00 | −0.04 | 0.2 | no clear effect |  |
| 1316 | Shame the Sin | 5 | Ancestry | — | check | −0.02 ± 0.03 | −0.08 | +0.03 | 1.0 | no clear effect |  |
| 1317 | Replenishment of War | 10 | Class | cleric | passive effect (always on) | −0.02 ± 0.01 | −0.02 | −0.02 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1318 | Shield Wallop | 8 | Class | guardian | a flourish Strike, stupefied 1 (2 on a critical hit) until its next turn | −0.02 ± 0.02 | +0.00 | −0.04 | 4.2 | no clear effect |  |
| 1319 | Amplifying Touch | 12 | Class | champion | +1 to attacks and 1 more damage until its next turn for an ally its Lay on Hands heals | −0.02 ± 0.02 | −0.00 | −0.04 | 0.8 | no clear effect |  |
| 1320 | Left-Hand Blood | 5 | Ancestry | — | effect | −0.02 ± 0.03 | −0.05 | +0.00 | 2.0 | no clear effect |  |
| 1321 | Basic Thoughtform | 4 | Class | — | Psi Burst: save | −0.02 ± 0.04 | −0.08 | +0.04 | 4.7 | no clear effect |  |
| 1322 | Blessing of the Five | 0 | Bonus | — | casts Heal (rank 1, DC 17, 1/fight) | −0.02 ± 0.03 | −0.04 | −0.00 | 0.7 | no clear effect |  |
| 1323 | Calculated Splash | 4 | Class | alchemist | bomb splash equal to its Intelligence | −0.02 ± 0.04 | −0.12 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1324 | Explode | 0 | Action | inventor | inline save: 5-foot emanation, reflex, 2d6 fire (DC 17) | −0.02 ± 0.04 | −0.02 | −0.03 | 1.2 | no clear effect |  |
| 1325 | Roiling Mudslide | 6 | Class | kineticist | save | −0.02 ± 0.06 | −0.02 | −0.03 | 1.4 | no clear effect |  |
| 1326 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.02 ± 0.03 | +0.00 | −0.05 | 1.0 | no clear effect |  |
| 1327 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.8 | no clear effect |  |
| 1328 | Unleash the Blight | 10 | Class | — | save | −0.02 ± 0.02 | −0.03 | −0.02 | 0.7 | no clear effect |  |
| 1329 | Sudden Charge | 1 | Class | barbarian | Strike activity | −0.02 ± 0.03 | −0.01 | −0.04 | 1.3 | no clear effect |  |
| 1330 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.2 | no clear effect |  |
| 1331 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | −0.02 ± 0.05 | +0.04 | −0.09 | 1.0 | no clear effect |  |
| 1332 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.4 | no clear effect |  |
| 1333 | Preemptive Reconfiguration | 9 | Ancestry | — | self effect | −0.02 ± 0.03 | −0.01 | −0.04 | 3.6 | no clear effect |  |
| 1334 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.02 ± 0.07 | −0.05 | −0.00 | 1.0 | no clear effect |  |
| 1335 | Grudging Compliment | 7 | Skill | — | check | −0.03 ± 0.03 | −0.05 | −0.00 | 1.8 | no clear effect |  |
| 1336 | Spiteful Rake | 13 | Ancestry | — | a 2-action melee Strike: dazzled a round, blinded on a critical hit (its best melee Strike for the claw) | −0.03 ± 0.04 | −0.01 | −0.04 | 5.8 | no clear effect |  |
| 1337 | Murderer's Circle | 14 | Class | — | a Strike, then the target off-guard to the next one this turn | −0.03 ± 0.02 | +0.02 | −0.07 | 11.7 | no clear effect |  |
| 1338 | Driving Rain | 6 | Class | kineticist | save | −0.03 ± 0.09 | −0.02 | −0.04 | 4.5 | no clear effect |  |
| 1339 | Broken Chain Dedication | 12 | Class | — | Ultimatum of Liberation: save | −0.03 ± 0.05 | +0.03 | −0.08 | 1.0 | no clear effect |  |
| 1340 | Quick Reversal | 4 | Class | fighter | 2 Strikes (requirement assumed: You are flanked by at least two enemies) | −0.03 ± 0.04 | −0.09 | +0.04 | 2.2 | no clear effect |  |
| 1341 | Bloodletting Claws | 4 | Class | summoner | its eidolon's critical hits 1d6 persistent bleed | −0.03 ± 0.03 | +0.05 | −0.10 | 8.9 | no clear effect |  |
| 1342 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.03 ± 0.03 | +0.01 | −0.06 | 0.4 | no clear effect |  |
| 1343 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.03 ± 0.03 | +0.01 | −0.06 | 0.4 | no clear effect |  |
| 1344 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | −0.03 ± 0.05 | +0.05 | −0.10 | 1.0 | no clear effect |  |
| 1345 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.03 ± 0.05 | −0.04 | −0.01 | 3.0 | no clear effect | with a spear and a free hand |
| 1346 | Hone Claws | 9 | Ancestry | — | 1d6 bleed on its next hit (1 action, once a fight) | −0.03 ± 0.05 | +0.01 | −0.06 | 1.0 | no clear effect |  |
| 1347 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.03 ± 0.05 | −0.07 | +0.01 | 1.0 | no clear effect |  |
| 1348 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.03 ± 0.02 | +0.01 | −0.06 | 0.2 | no clear effect |  |
| 1349 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | −0.03 ± 0.06 | −0.07 | +0.02 | 1.0 | no clear effect |  |
| 1350 | Impaling Finisher | 4 | Class | swashbuckler | Strike activity | −0.03 ± 0.04 | −0.07 | +0.01 | 1.8 | no clear effect |  |
| 1351 | Shadow's Web | 14 | Class | monk | innate spell: Shadow's Web (rank 7) | −0.03 ± 0.03 | +0.03 | −0.09 | 0.3 | no clear effect |  |
| 1352 | Goading Feint | 1 | Class | swashbuckler | every Feint goads (–2 to the foe's next attack on the PC, all of them on a critical success) instead of off-guard | −0.03 ± 0.01 | −0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1353 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | −0.03 ± 0.06 | +0.07 | −0.13 | 2.9 | no clear effect | with a one-handed weapon and a free hand |
| 1354 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.03 ± 0.04 | +0.05 | −0.11 | 1.5 | no clear effect |  |
| 1355 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.03 ± 0.06 | −0.11 | +0.06 | 1.0 | no clear effect |  |
| 1356 | March of the Dead | 8 | Class | — | save | −0.03 ± 0.01 | −0.01 | −0.05 | 0.2 | no clear effect |  |
| 1357 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.03 ± 0.05 | −0.09 | +0.03 | 0.9 | no clear effect |  |
| 1358 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | −0.03 ± 0.03 | +0.01 | −0.07 | 0.9 | no clear effect |  |
| 1359 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.03 ± 0.05 | −0.01 | −0.05 | 1.0 | no clear effect |  |
| 1360 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.03 ± 0.05 | −0.01 | −0.05 | 1.0 | no clear effect |  |
| 1361 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | −0.03 ± 0.10 | +0.02 | −0.08 | 1.0 | no clear effect |  |
| 1362 | Bon Mot | 1 | Skill | — | check | −0.03 ± 0.04 | −0.04 | −0.02 | 4.8 | no clear effect |  |
| 1363 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.03 ± 0.03 | −0.10 | +0.04 | 1.9 | no clear effect |  |
| 1364 | Primadonna | 12 | Class | — | check | −0.03 ± 0.04 | −0.07 | +0.01 | 0.3 | no clear effect |  |
| 1365 | Bony Barrage | 4 | Class | — | innate spell: Bony Barrage (rank 2) | −0.03 ± 0.02 | −0.06 | −0.00 | 0.5 | no clear effect |  |
| 1366 | Stretching Reach | 5 | Ancestry | — | a stance: reach 10 feet | −0.03 ± 0.03 | −0.07 | +0.01 | 1.0 | no clear effect |  |
| 1367 | Jotun's Battle Stance | 5 | Ancestry | — | a stance: reach 10 feet | −0.03 ± 0.03 | −0.07 | +0.01 | 1.0 | no clear effect |  |
| 1368 | Dismounting Strike | 8 | Class | — | its mount's Stride, a leap off and a Strike with an extra weapon die (counts as two attacks) | −0.03 ± 0.03 | −0.01 | −0.05 | 12.8 | no clear effect |  |
| 1369 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | −0.03 ± 0.05 | −0.16 | +0.10 | 0.0 | no clear effect | the AI never used it |
| 1370 | Laughing Kholo | 9 | Ancestry | — | Battle Cry: a free Demoralize as the fight begins | −0.03 ± 0.05 | −0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1371 | Wronged Monk's Wrath | 10 | Class | monk | innate spell: Wronged Monk's Wrath (rank 5) | −0.03 ± 0.04 | −0.10 | +0.04 | 0.7 | no clear effect |  |
| 1372 | Resilient Touch | 10 | Class | champion | +1 to saves until its next turn for an ally its Lay on Hands heals | −0.03 ± 0.02 | −0.03 | −0.03 | 0.8 | no clear effect |  |
| 1373 | Enervating Wail | 6 | Class | — | save | −0.03 ± 0.03 | −0.05 | −0.01 | 1.2 | no clear effect |  |
| 1374 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.03 ± 0.02 | +0.00 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1375 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | −0.03 ± 0.04 | −0.02 | −0.05 | 1.0 | no clear effect |  |
| 1376 | Desperate Surge | 10 | Class | — | a Trip at its spell attack (+19), once a fight | −0.03 ± 0.03 | +0.16 | −0.22 | 1.0 | no clear effect |  |
| 1377 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | −0.03 ± 0.09 | +0.00 | −0.07 | 4.4 | no clear effect |  |
| 1378 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | −0.03 ± 0.06 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 1379 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.03 | −0.10 | 2.0 | no clear effect |  |
| 1380 | Blade of Law | 12 | Class | — | a Strike at a foe that attacked it since its last turn: an extra weapon die and 1d8 spirit (2 actions, two attacks) | −0.03 ± 0.01 | +0.00 | −0.07 | 0.4 | no clear effect |  |
| 1381 | Shield Block | 1 | General | — | Shield Block (reaction), a shield with it | −0.03 ± 0.02 | −0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1382 | Viking Shieldbearer | 1 | Ancestry | — | Shield Block: Shield Block (reaction), a shield with it | −0.03 ± 0.02 | −0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1383 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | −0.03 ± 0.05 | −0.07 | −0.00 | 0.9 | no clear effect |  |
| 1384 | Group Taunt | 8 | Class | guardian | Taunt at up to three foes | −0.03 ± 0.05 | +0.03 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 1385 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.03 ± 0.06 | −0.07 | +0.00 | 2.0 | no clear effect |  |
| 1386 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | −0.03 ± 0.05 | +0.08 | −0.15 | 1.0 | no clear effect |  |
| 1387 | Sapping Symbol | 12 | Class | cleric | check | −0.03 ± 0.05 | −0.00 | −0.06 | 2.9 | no clear effect |  |
| 1388 | Into the Fray | 8 | Class | — | 2 Strikes | −0.03 ± 0.03 | +0.00 | −0.07 | 3.6 | no clear effect | with a weapon and a shield |
| 1389 | Deathly Scream | 2 | Class | — | innate spell: Deathly Scream (rank 1) | −0.03 ± 0.04 | −0.07 | −0.00 | 1.0 | no clear effect |  |
| 1390 | Songbird's Call | 8 | Class | bard | innate spell: Songbird's Call (rank 4) | −0.03 ± 0.02 | −0.09 | +0.02 | 0.5 | no clear effect |  |
| 1391 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | −0.03 ± 0.06 | −0.03 | −0.04 | 13.8 | no clear effect |  |
| 1392 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.04 ± 0.02 | −0.07 | +0.00 | 1.3 | no clear effect |  |
| 1393 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.04 ± 0.07 | +0.01 | −0.08 | 4.7 | no clear effect |  |
| 1394 | Levering Strike | 8 | Class | — | Strike activity (requirement assumed: You are wielding your staff) | −0.04 ± 0.05 | +0.01 | −0.08 | 2.9 | no clear effect |  |
| 1395 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.04 ± 0.04 | −0.03 | −0.05 | 2.1 | no clear effect |  |
| 1396 | Unnerving Terror | 13 | Ancestry | — | save (requirement assumed: You're in yaoguai form) | −0.04 ± 0.04 | −0.05 | −0.03 | 1.0 | no clear effect |  |
| 1397 | Celestial Cacophony | 12 | Class | inventor | save | −0.04 ± 0.05 | −0.11 | +0.04 | 1.1 | no clear effect |  |
| 1398 | Blessed Thorn Strike | 4 | Class | — | a flourish Strike at a foe that hurt an ally, then a Fortitude save: enfeebled 1 (2 on a critical failure) | −0.04 ± 0.01 | −0.00 | −0.07 | 0.5 | no clear effect |  |
| 1399 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | −0.04 ± 0.02 | −0.07 | +0.00 | 0.3 | no clear effect |  |
| 1400 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.04 ± 0.05 | +0.09 | −0.16 | 1.0 | no clear effect |  |
| 1401 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | −0.04 ± 0.02 | −0.09 | +0.01 | 1.0 | no clear effect |  |
| 1402 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | −0.04 ± 0.02 | −0.09 | +0.01 | 1.0 | no clear effect |  |
| 1403 | Steal Time | 10 | Class | — | save | −0.04 ± 0.05 | +0.04 | −0.12 | 1.0 | no clear effect |  |
| 1404 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.04 ± 0.06 | +0.01 | −0.09 | 6.7 | no clear effect |  |
| 1405 | Invoke the Crimson Oath | 8 | Class | — | innate spell: Invoke the Crimson Oath (rank 2) | −0.04 ± 0.04 | −0.01 | −0.06 | 0.9 | no clear effect |  |
| 1406 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.04 ± 0.04 | −0.01 | −0.07 | 2.9 | no clear effect |  |
| 1407 | Winter's Clutch | 1 | Class | kineticist | save | −0.04 ± 0.06 | −0.10 | +0.02 | 2.4 | no clear effect |  |
| 1408 | Channel Smite | 4 | Class | cleric | a melee Strike with a 1-action harm on the hit (2 actions) | −0.04 ± 0.03 | −0.03 | −0.05 | 0.8 | no clear effect |  |
| 1409 | Greater Deathly Secrets | 10 | Class | — | innate spells: Malignant Sustenance (rank 4), Grasping Grave (rank 5) | −0.04 ± 0.04 | +0.02 | −0.10 | 1.6 | no clear effect |  |
| 1410 | Martyr | 8 | Class | cleric | an action before each single-target Heal on an ally: 1d8 a rank of its own Hit Points to it too | −0.04 ± 0.05 | −0.06 | −0.02 | 3.1 | no clear effect |  |
| 1411 | Invoke Disaster | 18 | Class | druid | innate spell: Storm Lord (rank 9) | −0.04 ± 0.02 | −0.05 | −0.03 | 0.5 | no clear effect |  |
| 1412 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.05 | −0.13 | 1.0 | no clear effect |  |
| 1413 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.05 | −0.13 | 1.0 | no clear effect |  |
| 1414 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.05 | −0.13 | 1.0 | no clear effect |  |
| 1415 | Wither Away | 16 | Class | — | save | −0.04 ± 0.07 | −0.15 | +0.07 | 1.0 | no clear effect |  |
| 1416 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.04 ± 0.05 | −0.10 | +0.01 | 1.0 | no clear effect |  |
| 1417 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.04 ± 0.03 | −0.01 | −0.07 | 0.8 | no clear effect |  |
| 1418 | Hit and Run | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.04 | −0.12 | 1.7 | no clear effect |  |
| 1419 | Gluttonous Feast | 0 | Action | — | save | −0.04 ± 0.04 | −0.07 | −0.02 | 1.0 | no clear effect |  |
| 1420 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | −0.04 ± 0.03 | −0.11 | +0.02 | 1.2 | no clear effect |  |
| 1421 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.04 ± 0.05 | +0.02 | −0.11 | 2.0 | no clear effect |  |
| 1422 | Insect Shape | 6 | Class | druid | Untamed Form's insect shapes (Insect Form, rank 3) (in Untamed Form) | −0.04 ± 0.05 | −0.07 | −0.02 | 1.0 | no clear effect |  |
| 1423 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.04 | −0.13 | 1.0 | no clear effect |  |
| 1424 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.04 | −0.13 | 1.0 | no clear effect |  |
| 1425 | Basic Arcana | 4 | Class | — | Reach Spell: reach copies of 9 spells | −0.04 ± 0.04 | −0.14 | +0.05 | 3.4 | no clear effect |  |
| 1426 | To Me! | 18 | Class | — | Strike activity | −0.04 ± 0.05 | +0.00 | −0.09 | 2.6 | no clear effect |  |
| 1427 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | −0.04 ± 0.04 | +0.02 | −0.10 | 1.0 | no clear effect |  |
| 1428 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.07 | −0.16 | 1.0 | no clear effect |  |
| 1429 | Ferocious Charge | 10 | Class | — | its companion's Ferocious Charge (two Strides and a Strike, +1d8) | −0.05 ± 0.03 | −0.04 | −0.05 | 13.0 | no clear effect |  |
| 1430 | Bestial Snarling | 2 | Class | bard | check | −0.05 ± 0.04 | +0.01 | −0.10 | 5.2 | no clear effect |  |
| 1431 | Ever-Vigilant Senses | 16 | Class | summoner | its eidolon's +2 Perception | −0.05 ± 0.06 | −0.03 | −0.06 | 15.7 | no clear effect |  |
| 1432 | Ferocious Shape | 8 | Class | druid | Untamed Form's dinosaur shapes (Dinosaur Form, rank 4) (in Untamed Form) | −0.05 ± 0.03 | −0.06 | −0.03 | 1.0 | no clear effect |  |
| 1433 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.05 ± 0.04 | −0.07 | −0.02 | 5.0 | no clear effect |  |
| 1434 | Whispers of Weakness | 1 | Class | oracle | +2 to its next attack (1 action) | −0.05 ± 0.05 | −0.11 | +0.02 | 1.7 | no clear effect |  |
| 1435 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.05 ± 0.04 | −0.05 | −0.04 | 1.0 | no clear effect |  |
| 1436 | Guiding Shot | 2 | Class | commander | a ranged Strike, +1 to the next ally's attack at its target | −0.05 ± 0.05 | −0.03 | −0.06 | 3.2 | no clear effect | with a loaded arquebus |
| 1437 | Gift of the Hoard | 10 | Class | — | innate spell: Dragon Breath (rank 3) | −0.05 ± 0.04 | +0.01 | −0.11 | 1.0 | no clear effect |  |
| 1438 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.05 ± 0.02 | −0.03 | −0.07 | 0.4 | no clear effect |  |
| 1439 | Advanced Elemental Spell | 6 | Class | druid | innate spells: Combustion (rank 3), Stone Lance (rank 3), Powerful Inhalation (rank 3), Pulverizing Cascade (rank 3) | −0.05 ± 0.05 | −0.06 | −0.03 | 2.6 | no clear effect |  |
| 1440 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.05 ± 0.04 | −0.04 | −0.06 | 1.0 | no clear effect |  |
| 1441 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | −0.05 ± 0.06 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1442 | Shadowcaster Dedication | 2 | Class | — | innate spell: Dazzling Flash (rank 1), Cloak of Shadow (rank 1) | −0.05 ± 0.04 | −0.03 | −0.07 | 0.8 | no clear effect |  |
| 1443 | Scout's Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | +0.00 | −0.10 | 1.2 | no clear effect |  |
| 1444 | Interpose | 4 | Class | — | Strike activity | −0.05 ± 0.02 | +0.00 | −0.10 | 1.2 | no clear effect |  |
| 1445 | Ravenous Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | +0.00 | −0.10 | 1.2 | no clear effect |  |
| 1446 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | −0.05 ± 0.07 | −0.12 | +0.02 | 1.0 | no clear effect | with a weapon and a shield |
| 1447 | Bone Swarm | 17 | Ancestry | — | save | −0.05 ± 0.05 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1448 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | −0.05 ± 0.05 | −0.04 | −0.06 | 2.0 | no clear effect |  |
| 1449 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.06 | −0.08 | −0.01 | 1.0 | no clear effect |  |
| 1450 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.05 ± 0.03 | +0.04 | −0.14 | 2.0 | no clear effect |  |
| 1451 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.05 ± 0.03 | −0.04 | −0.06 | 0.8 | no clear effect |  |
| 1452 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.08 | −0.02 | 1.8 | no clear effect |  |
| 1453 | Ferocious Gust | 9 | Ancestry | — | save | −0.05 ± 0.04 | −0.01 | −0.09 | 1.0 | no clear effect |  |
| 1454 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.05 ± 0.04 | −0.02 | −0.08 | 1.0 | no clear effect |  |
| 1455 | Slip the Grasp | 9 | Ancestry | — | Strike activity (requirement assumed: You are Grabbed, Immobilized, or Restrained) | −0.05 ± 0.04 | −0.06 | −0.04 | 2.6 | no clear effect |  |
| 1456 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.05 ± 0.02 | −0.05 | −0.05 | 0.5 | hurts |  |
| 1457 | Infuse Void | 8 | Class | — | Infuse Void copies of 2 grave spells: void damage of its rank more on each creature hurt | −0.05 ± 0.02 | −0.08 | −0.02 | 1.2 | hurts |  |
| 1458 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.05 ± 0.03 | −0.01 | −0.09 | 1.0 | no clear effect |  |
| 1459 | Suli Amir | 13 | Ancestry | — | innate spell: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | −0.05 ± 0.05 | −0.10 | −0.01 | 1.0 | no clear effect |  |
| 1460 | Invisible Trickster | 13 | Ancestry | — | innate spell: Invisibility (rank 4) | −0.05 ± 0.05 | −0.10 | −0.01 | 1.0 | no clear effect |  |
| 1461 | Fling Magic | 0 | Action | thaumaturge | save | −0.05 ± 0.05 | −0.07 | −0.03 | 2.3 | no clear effect |  |
| 1462 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | −0.05 ± 0.05 | −0.00 | −0.10 | 1.0 | no clear effect |  |
| 1463 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | +0.01 | −0.12 | 1.6 | no clear effect |  |
| 1464 | Torrential Backlash | 10 | Class | — | save (requirement assumed: You are in a curse maelstrom state) | −0.05 ± 0.05 | +0.15 | −0.25 | 5.0 | no clear effect |  |
| 1465 | Basic Breakthrough | 4 | Class | — | Searing Restoration: heals 2d10 (touch) | −0.05 ± 0.07 | −0.04 | −0.07 | 3.2 | no clear effect |  |
| 1466 | Mammoth Charge | 6 | Class | — | Strike activity (requirement assumed: You are riding your megafauna companion) | −0.05 ± 0.03 | +0.03 | −0.14 | 1.8 | no clear effect |  |
| 1467 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1468 | Snakebird's Shadow | 8 | Class | monk | a Strike at up to two foes in a 15-foot line (its stance not checked) | −0.05 ± 0.04 | +0.00 | −0.11 | 1.7 | no clear effect |  |
| 1469 | Practiced Reflexes | 18 | Class | commander | Drilled Reactions for up to four allies | −0.05 ± 0.03 | +0.00 | −0.11 | 0.0 | no clear effect | the AI never used it |
| 1470 | Rapid Recharge | 10 | Class | magus | its Spellstrike recharged free as a turn begins, once a fight | −0.05 ± 0.04 | −0.10 | −0.00 | 0.8 | no clear effect |  |
| 1471 | Irradiate | 6 | Class | — | save | −0.05 ± 0.02 | −0.03 | −0.07 | 0.4 | hurts |  |
| 1472 | Moldersoul | 1 | Ancestry | — | Decompose: inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.7 | hurts |  |
| 1473 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.7 | hurts |  |
| 1474 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | −0.05 ± 0.04 | +0.07 | −0.18 | 0.0 | no clear effect | the AI never used it |
| 1475 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.05 ± 0.09 | +0.07 | −0.18 | 4.8 | no clear effect |  |
| 1476 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.05 ± 0.05 | −0.07 | −0.04 | 0.8 | no clear effect |  |
| 1477 | Talmandor's Shout | 12 | Class | — | check | −0.05 ± 0.06 | −0.15 | +0.04 | 1.0 | no clear effect |  |
| 1478 | No Scar but This | 0 | Action | — | check | −0.06 ± 0.03 | −0.02 | −0.09 | 1.1 | no clear effect |  |
| 1479 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.06 ± 0.05 | −0.04 | −0.07 | 1.0 | no clear effect |  |
| 1480 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.06 ± 0.05 | −0.04 | −0.07 | 1.0 | no clear effect |  |
| 1481 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.06 ± 0.05 | −0.04 | −0.07 | 1.0 | no clear effect |  |
| 1482 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.06 ± 0.05 | −0.04 | −0.07 | 1.0 | no clear effect |  |
| 1483 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | −0.06 ± 0.05 | −0.11 | −0.00 | 1.0 | no clear effect |  |
| 1484 | As a Thousand Soldiers | 8 | Class | exemplar | save | −0.06 ± 0.07 | +0.01 | −0.12 | 1.0 | no clear effect |  |
| 1485 | Spew Tentacles | 13 | Ancestry | — | innate spell: Black Tentacles (rank 5) | −0.06 ± 0.03 | −0.05 | −0.07 | 0.9 | no clear effect |  |
| 1486 | Calcification | 18 | Class | — | a foe slowed 1 (a round on a success; 2 on a critical failure) by its Fortitude save; its ongoing saves and bludgeoning weakness not played (its focus spell, a thrall destroyed, once a fight) | −0.06 ± 0.05 | −0.01 | −0.11 | 1.0 | no clear effect |  |
| 1487 | Waking Dream | 8 | Class | — | innate spell: Waking Dream (rank 4) | −0.06 ± 0.06 | +0.04 | −0.16 | 1.0 | no clear effect |  |
| 1488 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.06 ± 0.03 | −0.03 | −0.08 | 0.8 | no clear effect |  |
| 1489 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.06 ± 0.05 | −0.18 | +0.07 | 1.0 | no clear effect |  |
| 1490 | Tears of Pearl | 9 | Ancestry | — | save | −0.06 ± 0.06 | −0.01 | −0.11 | 1.0 | no clear effect |  |
| 1491 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | −0.06 ± 0.05 | +0.05 | −0.16 | 1.1 | no clear effect |  |
| 1492 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | −0.06 ± 0.05 | +0.05 | −0.16 | 1.1 | no clear effect |  |
| 1493 | Offer Story | 0 | Action | — | effect | −0.06 ± 0.05 | −0.10 | −0.01 | 3.7 | no clear effect |  |
| 1494 | Extraplanar Haze | 5 | Ancestry | — | check | −0.06 ± 0.03 | −0.08 | −0.03 | 1.0 | no clear effect |  |
| 1495 | Nanite Shroud | 5 | Ancestry | — | check | −0.06 ± 0.03 | −0.08 | −0.03 | 1.0 | no clear effect |  |
| 1496 | Mind Shards | 6 | Class | — | save | −0.06 ± 0.03 | −0.02 | −0.09 | 0.9 | no clear effect |  |
| 1497 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | −0.06 ± 0.06 | −0.15 | +0.04 | 2.0 | no clear effect |  |
| 1498 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.06 ± 0.04 | −0.12 | +0.00 | 1.0 | no clear effect |  |
| 1499 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.06 ± 0.03 | +0.00 | −0.12 | 0.7 | hurts |  |
| 1500 | Specialized Companion (Animal Trainer) | 18 | Class | — | its animal companion specialized (against one incredible) | −0.06 ± 0.05 | −0.01 | −0.11 | 11.6 | no clear effect |  |
| 1501 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | −0.06 ± 0.07 | −0.12 | −0.00 | 0.6 | no clear effect |  |
| 1502 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | −0.06 ± 0.05 | +0.06 | −0.18 | 1.0 | no clear effect |  |
| 1503 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.06 ± 0.02 | +0.00 | −0.12 | 0.0 | hurts | the AI never used it |
| 1504 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.06 ± 0.02 | +0.00 | −0.12 | 0.0 | hurts | the AI never used it |
| 1505 | Edifying Trace | 8 | Class | — | an Effect on a foe | −0.06 ± 0.07 | +0.04 | −0.16 | 6.1 | no clear effect |  |
| 1506 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.06 ± 0.05 | −0.08 | −0.04 | 1.1 | no clear effect |  |
| 1507 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | −0.06 ± 0.06 | +0.02 | −0.14 | 1.0 | no clear effect |  |
| 1508 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.06 ± 0.06 | −0.13 | +0.01 | 3.3 | no clear effect |  |
| 1509 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.06 ± 0.03 | −0.02 | −0.11 | 1.5 | no clear effect |  |
| 1510 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | −0.06 ± 0.04 | −0.14 | +0.02 | 1.0 | no clear effect |  |
| 1511 | Cadence Call | 6 | Class | — | check | −0.06 ± 0.04 | −0.11 | −0.01 | 1.0 | no clear effect |  |
| 1512 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | −0.06 ± 0.05 | −0.02 | −0.10 | 1.0 | no clear effect |  |
| 1513 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.06 ± 0.04 | +0.04 | −0.16 | 3.2 | no clear effect |  |
| 1514 | Idol Threat | 13 | Ancestry | — | check | −0.06 ± 0.04 | −0.10 | −0.02 | 3.9 | no clear effect |  |
| 1515 | Threatening Pursuit | 13 | Ancestry | — | check | −0.06 ± 0.04 | −0.10 | −0.02 | 3.9 | no clear effect |  |
| 1516 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.06 ± 0.06 | −0.18 | +0.06 | 1.0 | no clear effect |  |
| 1517 | Incredible Ricochet | 12 | Class | fighter | a ranged press Strike ignoring concealment and cover | −0.06 ± 0.05 | −0.16 | +0.04 | 9.9 | no clear effect | with a loaded arquebus |
| 1518 | Evangelize | 7 | Skill | — | check | −0.06 ± 0.03 | −0.03 | −0.09 | 2.2 | hurts |  |
| 1519 | Wood Ward | 17 | Ancestry | — | self effect | −0.06 ± 0.04 | −0.03 | −0.09 | 4.7 | no clear effect |  |
| 1520 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.06 ± 0.06 | −0.07 | −0.05 | 1.0 | no clear effect |  |
| 1521 | Lantern Strobe | 0 | Action | — | save | −0.06 ± 0.03 | −0.12 | −0.01 | 0.6 | hurts |  |
| 1522 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.06 ± 0.06 | −0.14 | +0.02 | 2.0 | no clear effect |  |
| 1523 | Lightning Rod | 6 | Class | kineticist | check | −0.06 ± 0.08 | +0.17 | −0.30 | 4.2 | no clear effect |  |
| 1524 | Persistent Boost | 16 | Class | inventor | 1d8 persistent fire on its boosted melee hits (always on) | −0.06 ± 0.08 | −0.08 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1525 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | +0.00 | −0.13 | 2.6 | hurts |  |
| 1526 | Guide the Timeline | 6 | Class | — | effect | −0.06 ± 0.03 | −0.02 | −0.10 | 2.0 | no clear effect |  |
| 1527 | Poison Weapon | 4 | Class | rogue | Poison Weapon: an Interact, then 1d4 poison on its next weapon hit | −0.07 ± 0.04 | −0.08 | −0.05 | 2.2 | no clear effect |  |
| 1528 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.07 ± 0.05 | −0.04 | −0.09 | 3.3 | no clear effect |  |
| 1529 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | −0.07 ± 0.04 | −0.08 | −0.05 | 3.7 | no clear effect |  |
| 1530 | Aegis for the Innocent | 14 | Class | — | save (requirement assumed: Your nimbus is active) | −0.07 ± 0.03 | −0.08 | −0.05 | 0.9 | hurts |  |
| 1531 | Soothing Pulse | 4 | Class | — | Administer Ambient Magic: check | −0.07 ± 0.04 | −0.10 | −0.03 | 0.9 | no clear effect |  |
| 1532 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | −0.07 ± 0.05 | +0.11 | −0.24 | 3.3 | no clear effect |  |
| 1533 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.07 ± 0.04 | −0.01 | −0.12 | 2.0 | no clear effect |  |
| 1534 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.07 ± 0.06 | −0.16 | +0.02 | 1.0 | no clear effect |  |
| 1535 | Running Kick | 10 | Class | — | its companion's Running Kick (two Strides and a Strike) | −0.07 ± 0.03 | −0.07 | −0.06 | 13.3 | no clear effect |  |
| 1536 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | −0.07 ± 0.05 | −0.06 | −0.08 | 1.0 | no clear effect |  |
| 1537 | Frighten Undead | 6 | Class | — | check | −0.07 ± 0.04 | +0.03 | −0.17 | 3.4 | no clear effect |  |
| 1538 | Crossbow Terror | 6 | Class | — | check | −0.07 ± 0.04 | +0.03 | −0.17 | 3.4 | no clear effect |  |
| 1539 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1540 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1541 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.07 ± 0.04 | +0.02 | −0.16 | 1.2 | no clear effect |  |
| 1542 | History of Violence | 14 | Class | — | Strike activity | −0.07 ± 0.06 | −0.07 | −0.07 | 1.0 | no clear effect |  |
| 1543 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1544 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1545 | Interrupt Charge | 8 | Class | — | check | −0.07 ± 0.05 | +0.04 | −0.18 | 8.6 | no clear effect |  |
| 1546 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.07 ± 0.05 | −0.06 | −0.07 | 2.4 | no clear effect | with a one-handed weapon and a free hand |
| 1547 | Death of Hope | 17 | Ancestry | — | save | −0.07 ± 0.05 | −0.15 | +0.01 | 1.0 | no clear effect |  |
| 1548 | Lead by Example | 8 | Class | — | Strike activity | −0.07 ± 0.03 | −0.06 | −0.08 | 6.0 | hurts |  |
| 1549 | It Was Me All Along! | 14 | Class | — | check | −0.07 ± 0.04 | −0.02 | −0.12 | 1.0 | no clear effect |  |
| 1550 | Envenom Fangs | 5 | Ancestry | — | 1d6 persistent poison on its next hit (1 action, once a fight) | −0.07 ± 0.03 | −0.14 | +0.00 | 1.0 | hurts |  |
| 1551 | Grapple | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.9 | no clear effect |  |
| 1552 | Puncture Flesh | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1553 | Abrasive Drag | 12 | Class | — | check | −0.07 ± 0.04 | +0.17 | −0.32 | 13.9 | no clear effect |  |
| 1554 | Webslinger | 13 | Ancestry | — | casts Web (rank 2, DC 32, 1/fight) | −0.07 ± 0.03 | −0.04 | −0.11 | 1.0 | hurts |  |
| 1555 | Walk the Plank | 8 | Class | — | check | −0.07 ± 0.06 | −0.04 | −0.11 | 2.7 | no clear effect |  |
| 1556 | Edict of Mortality | 8 | Class | — | check | −0.07 ± 0.06 | −0.04 | −0.11 | 2.7 | no clear effect |  |
| 1557 | Majestic Proclamation | 8 | Class | — | check | −0.07 ± 0.06 | −0.04 | −0.11 | 2.7 | no clear effect |  |
| 1558 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.07 ± 0.05 | +0.02 | −0.17 | 1.0 | no clear effect |  |
| 1559 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.07 ± 0.04 | −0.05 | −0.09 | 2.0 | no clear effect |  |
| 1560 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.07 ± 0.05 | −0.03 | −0.12 | 0.0 | no clear effect | the AI never used it |
| 1561 | Double Shot | 4 | Class | fighter | 2 Strikes | −0.08 ± 0.03 | +0.00 | −0.15 | 1.4 | hurts | with a bow in hand |
| 1562 | Perfect Ki Exemplar | 14 | Class | — | innate spells: Unblinking Flame Emblem (rank 7), Unbreaking Wave Barrier (rank 7), Unfolding Wind Blitz (rank 7), Untwisting Iron Augmentation (rank 7) | −0.08 ± 0.03 | +0.00 | −0.15 | 0.7 | hurts |  |
| 1563 | Mocking Invisibility | 9 | Ancestry | — | innate spell: Invisibility (rank 4) | −0.08 ± 0.05 | +0.02 | −0.17 | 1.0 | no clear effect |  |
| 1564 | Flash of Omnipresence | 14 | Class | — | save | −0.08 ± 0.06 | −0.08 | −0.08 | 1.0 | no clear effect |  |
| 1565 | Chain of Words | 10 | Class | — | save | −0.08 ± 0.06 | +0.05 | −0.21 | 1.0 | no clear effect |  |
| 1566 | Tremor | 1 | Class | kineticist | save | −0.08 ± 0.04 | −0.11 | −0.05 | 2.2 | no clear effect |  |
| 1567 | Disciple's Breath | 16 | Class | — | save | −0.08 ± 0.05 | −0.14 | −0.02 | 3.1 | no clear effect |  |
| 1568 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.05 | −0.09 | −0.07 | 1.9 | no clear effect |  |
| 1569 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | −0.08 ± 0.06 | −0.17 | +0.01 | 1.0 | no clear effect |  |
| 1570 | Favor of Heaven | 17 | Ancestry | — | innate spell: Spirit Blast (rank 6) | −0.08 ± 0.06 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 1571 | Instinct Ability | 6 | Class | — | Sudden Charge: Strike activity | −0.08 ± 0.05 | −0.04 | −0.12 | 2.5 | no clear effect |  |
| 1572 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.08 ± 0.03 | −0.12 | −0.04 | 1.0 | hurts |  |
| 1573 | Stonestrike Stance | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1574 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1575 | Warped Reflection | 1 | Ancestry | — | save | −0.08 ± 0.04 | −0.01 | −0.15 | 1.0 | hurts |  |
| 1576 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | −0.08 ± 0.04 | −0.15 | −0.01 | 1.9 | hurts |  |
| 1577 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.08 ± 0.03 | +0.00 | −0.17 | 2.7 | hurts |  |
| 1578 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | −0.08 ± 0.08 | +0.00 | −0.17 | 5.8 | no clear effect |  |
| 1579 | Pack Movement | 8 | Class | — | a Stride and a Strike, its companion's Strike beside it | −0.08 ± 0.04 | −0.14 | −0.03 | 18.5 | hurts |  |
| 1580 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.08 ± 0.05 | −0.05 | −0.12 | 1.0 | no clear effect |  |
| 1581 | Ultimatum of Liberation | 0 | Action | — | save | −0.08 ± 0.04 | −0.03 | −0.13 | 1.0 | hurts |  |
| 1582 | Trampling Charge | 10 | Class | — | its mount through a 70-foot line, 3d8+6 piercing, basic Reflex DC 30 | −0.08 ± 0.04 | −0.09 | −0.08 | 13.3 | hurts |  |
| 1583 | Radiant Burst | 13 | Ancestry | — | save | −0.08 ± 0.04 | −0.12 | −0.05 | 1.0 | hurts |  |
| 1584 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.08 | −0.09 | 1.0 | no clear effect |  |
| 1585 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | −0.08 ± 0.03 | −0.08 | −0.09 | 0.3 | hurts |  |
| 1586 | Feast | 4 | Class | — | check | −0.08 ± 0.03 | −0.13 | −0.04 | 1.8 | hurts |  |
| 1587 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.09 ± 0.09 | −0.13 | −0.04 | 8.9 | no clear effect |  |
| 1588 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | −0.03 | −0.14 | 1.0 | no clear effect |  |
| 1589 | Shield Warden | 6 | Class | champion | Shield Block for an adjacent ally (reaction) | −0.09 ± 0.07 | −0.09 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1590 | Fossil Rider | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | −0.09 ± 0.06 | −0.15 | −0.02 | 4.2 | no clear effect |  |
| 1591 | Fearsome Form | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | −0.09 ± 0.06 | −0.15 | −0.02 | 4.2 | no clear effect |  |
| 1592 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.09 ± 0.04 | −0.07 | −0.11 | 2.7 | hurts |  |
| 1593 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | −0.09 ± 0.04 | −0.13 | −0.04 | 1.0 | no clear effect |  |
| 1594 | Felling Strike | 8 | Class | fighter | Strike activity | −0.09 ± 0.06 | −0.07 | −0.10 | 7.9 | no clear effect |  |
| 1595 | Hail of Splinters | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.11 | −0.07 | 0.8 | hurts |  |
| 1596 | Now You See Me | 14 | Class | — | check | −0.09 ± 0.06 | −0.07 | −0.10 | 2.4 | no clear effect |  |
| 1597 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.06 | −0.21 | +0.03 | 1.0 | no clear effect |  |
| 1598 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.09 ± 0.03 | −0.11 | −0.06 | 2.2 | hurts |  |
| 1599 | Fade Into Daydreams | 0 | Action | psychic | check | −0.09 ± 0.04 | −0.16 | −0.01 | 1.9 | hurts |  |
| 1600 | Roaring Charge | 0 | Action | commander | save | −0.09 ± 0.06 | +0.01 | −0.19 | 1.0 | no clear effect |  |
| 1601 | Path of Iron | 14 | Class | — | 3 Strikes | −0.09 ± 0.04 | +0.00 | −0.18 | 2.4 | hurts |  |
| 1602 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | −0.09 ± 0.05 | −0.03 | −0.15 | 1.0 | no clear effect |  |
| 1603 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.09 ± 0.05 | −0.03 | −0.15 | 1.0 | no clear effect |  |
| 1604 | Homing Shot | 14 | Class | — | a ranged Strike ignoring concealment and cover | −0.09 ± 0.06 | −0.15 | −0.03 | 17.3 | no clear effect | with a loaded arquebus |
| 1605 | Faultless Defense | 14 | Class | — | self effect | −0.09 ± 0.03 | −0.11 | −0.07 | 3.0 | hurts |  |
| 1606 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.09 ± 0.03 | +0.00 | −0.18 | 3.5 | hurts |  |
| 1607 | Phase Bullet | 14 | Class | — | a firearm Strike at +4 against an armored foe, ignoring cover (once a fight) | −0.09 ± 0.03 | −0.03 | −0.15 | 1.7 | hurts |  |
| 1608 | Restorative Strike | 4 | Class | cleric | Strike activity (requirement assumed: You have a Harm or Heal spell you can cast) | −0.09 ± 0.04 | −0.10 | −0.08 | 1.4 | hurts |  |
| 1609 | Devoted Guardian | 2 | Class | champion | an Effect on an ally | −0.09 ± 0.04 | −0.12 | −0.06 | 5.1 | hurts |  |
| 1610 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.09 ± 0.04 | +0.00 | −0.18 | 1.1 | hurts |  |
| 1611 | Antagonize | 2 | Class | swashbuckler | Demoralize (forced); frightened from it stays at 1 or more until the foe attacks it | −0.09 ± 0.06 | −0.12 | −0.06 | 2.7 | no clear effect |  |
| 1612 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.09 ± 0.07 | −0.13 | −0.05 | 3.1 | no clear effect |  |
| 1613 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.09 ± 0.04 | −0.08 | −0.10 | 3.0 | hurts |  |
| 1614 | Tidal Hands | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.13 | −0.05 | 0.8 | hurts |  |
| 1615 | Planar Sidestep | 13 | Ancestry | — | self effect | −0.09 ± 0.03 | −0.06 | −0.12 | 3.8 | hurts |  |
| 1616 | Daring Act | 6 | Class | — | check | −0.09 ± 0.04 | −0.03 | −0.16 | 2.7 | hurts |  |
| 1617 | Twin Feint | 1 | Class | rogue | two Strikes at one foe, off-guard to the second | −0.09 ± 0.04 | +0.04 | −0.22 | 1.7 | hurts | with two weapons (longsword and shortsword) |
| 1618 | Starlit Sentinel Dedication | 2 | Class | — | Starlit Transformation: PF2e's self Effect | −0.09 ± 0.04 | +0.04 | −0.22 | 1.0 | hurts |  |
| 1619 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | −0.09 ± 0.05 | −0.21 | +0.03 | 1.0 | no clear effect |  |
| 1620 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | −0.09 ± 0.03 | −0.15 | −0.03 | 0.7 | hurts |  |
| 1621 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | −0.09 ± 0.05 | −0.10 | −0.08 | 1.0 | no clear effect |  |
| 1622 | Rivethun Invoker Dedication | 2 | Class | — | Enter Spirit Trance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1623 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.11 | −0.07 | 1.0 | no clear effect |  |
| 1624 | Confusing Commands | 16 | Class | commander | save | −0.09 ± 0.10 | +0.16 | −0.35 | 4.7 | no clear effect |  |
| 1625 | Share Rage | 8 | Class | barbarian | effect | −0.09 ± 0.06 | +0.09 | −0.28 | 6.0 | no clear effect |  |
| 1626 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1627 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1628 | Bone Spikes | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1629 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.09 ± 0.08 | −0.10 | −0.09 | 5.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1630 | Bristle | 5 | Ancestry | — | effect | −0.09 ± 0.03 | −0.14 | −0.05 | 4.5 | hurts |  |
| 1631 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1632 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1633 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1634 | Seven-Colored Cosmic Bridge | 18 | Class | exemplar | Fleeting Arc through Heaven and Earth: inline save: 60-foot cone, fortitude, 9d6 spirit (DC 38) | −0.10 ± 0.04 | −0.01 | −0.19 | 1.9 | hurts |  |
| 1635 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 1636 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | −0.10 ± 0.04 | −0.09 | −0.11 | 1.0 | hurts |  |
| 1637 | Raise a Tome | 1 | Class | magus | a book raised for +2 AC | −0.10 ± 0.04 | −0.01 | −0.19 | 0.0 | hurts | the AI never used it |
| 1638 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | −0.10 ± 0.03 | −0.15 | −0.05 | 0.3 | hurts |  |
| 1639 | Flensing Slice | 8 | Class | — | check | −0.10 ± 0.06 | +0.23 | −0.43 | 9.6 | no clear effect |  |
| 1640 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.10 ± 0.03 | −0.11 | −0.09 | 1.0 | hurts |  |
| 1641 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1642 | Wyldsinger | 4 | Class | — | innate spell: Menacing Lament (rank 2), Valiant Anthem (rank 2) | −0.10 ± 0.04 | −0.11 | −0.09 | 1.0 | hurts |  |
| 1643 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.10 ± 0.05 | −0.05 | −0.15 | 3.9 | no clear effect |  |
| 1644 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.10 ± 0.04 | −0.04 | −0.16 | 2.5 | hurts |  |
| 1645 | Taste Blood | 5 | Ancestry | — | save | −0.10 ± 0.03 | −0.10 | −0.11 | 2.9 | hurts |  |
| 1646 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.10 ± 0.06 | −0.08 | −0.13 | 1.0 | no clear effect |  |
| 1647 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.10 ± 0.04 | −0.14 | −0.07 | 0.0 | hurts | the AI never used it |
| 1648 | Uncanny Prediction | 8 | Class | — | save (requirement assumed: You're benefiting from the bonuses of Size Up. You have an eerie ability to guess the next move of creatures you've Sized Up) | −0.10 ± 0.06 | +0.22 | −0.43 | 3.2 | no clear effect |  |
| 1649 | Forcible Energy | 12 | Class | wizard | Forcible Energy copies of 11 energy spells: weakness 5 on the creature hurt most | −0.10 ± 0.06 | −0.22 | +0.01 | 6.4 | no clear effect |  |
| 1650 | Agathion Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Calm (rank 2) | −0.10 ± 0.05 | −0.07 | −0.14 | 1.6 | hurts |  |
| 1651 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.10 ± 0.05 | −0.07 | −0.14 | 1.6 | hurts |  |
| 1652 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.10 ± 0.05 | −0.07 | −0.14 | 1.6 | hurts |  |
| 1653 | Raise Symbol | 4 | Class | cleric | self effect | −0.10 ± 0.04 | −0.20 | −0.01 | 2.7 | hurts |  |
| 1654 | Weft and Warp | 16 | Class | — | Strike activity | −0.11 ± 0.06 | −0.07 | −0.15 | 3.3 | no clear effect |  |
| 1655 | Strangle | 8 | Class | — | Strike activity | −0.11 ± 0.05 | −0.04 | −0.18 | 4.7 | hurts |  |
| 1656 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | −0.11 ± 0.05 | −0.14 | −0.07 | 1.1 | hurts |  |
| 1657 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.11 ± 0.03 | −0.02 | −0.20 | 1.0 | hurts |  |
| 1658 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.11 ± 0.03 | −0.02 | −0.20 | 1.0 | hurts |  |
| 1659 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | −0.11 ± 0.06 | −0.08 | −0.14 | 12.2 | no clear effect |  |
| 1660 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.11 ± 0.05 | +0.01 | −0.23 | 1.0 | hurts |  |
| 1661 | Allegro | 14 | Class | bard | Allegro, as Haste (rank 7, a cantrip, 1 round) | −0.11 ± 0.05 | −0.16 | −0.06 | 4.2 | hurts |  |
| 1662 | Covering Stance | 2 | Class | guardian | stance: an adjacent ally gets lesser cover (+1 AC) until its next turn | −0.11 ± 0.04 | −0.15 | −0.06 | 2.7 | hurts |  |
| 1663 | Light-Bending Jewel | 13 | Ancestry | — | innate spell: Invisibility (rank 2), Translocate (rank 4) | −0.11 ± 0.04 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1664 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.11 ± 0.04 | −0.10 | −0.12 | 1.0 | hurts |  |
| 1665 | Terrifying Croak | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1666 | Demoralize | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1667 | Sudden Terror | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1668 | Haunting Visage | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1669 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.11 ± 0.06 | −0.19 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1670 | Storming Gaze | 5 | Ancestry | — | inline save: 15-foot cone, reflex, 3d4 fire (DC 21) | −0.11 ± 0.03 | −0.11 | −0.11 | 2.6 | hurts |  |
| 1671 | Storm of Claws | 16 | Class | — | 3 Strikes (requirement assumed: You're in either claw stance or talon stance) (in Claw Stance) | −0.11 ± 0.08 | −0.25 | +0.03 | 5.7 | no clear effect |  |
| 1672 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.11 ± 0.05 | −0.13 | −0.09 | 3.2 | hurts |  |
| 1673 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.11 ± 0.05 | −0.19 | −0.03 | 1.0 | hurts |  |
| 1674 | Aerial Boomerang | 1 | Class | kineticist | save | −0.11 ± 0.05 | −0.18 | −0.05 | 2.1 | hurts |  |
| 1675 | Giant's Lunge | 14 | Class | barbarian | reach 10 feet while raging (1 action) | −0.11 ± 0.07 | −0.11 | −0.12 | 1.0 | no clear effect |  |
| 1676 | Basic Hunter's Trick | 4 | Class | — | Hunter's Aim: Strike activity | −0.11 ± 0.08 | −0.08 | −0.14 | 4.2 | no clear effect |  |
| 1677 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.11 ± 0.05 | −0.11 | −0.12 | 1.8 | hurts |  |
| 1678 | Friendly Nudge | 1 | Ancestry | — | check | −0.11 ± 0.03 | −0.11 | −0.12 | 0.6 | hurts |  |
| 1679 | Triple Time | 4 | Class | bard | innate spell: Triple Time (rank 2) | −0.11 ± 0.05 | −0.10 | −0.12 | 12.7 | hurts |  |
| 1680 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | −0.11 ± 0.03 | −0.15 | −0.08 | 2.2 | hurts |  |
| 1681 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.11 ± 0.05 | −0.08 | −0.15 | 2.6 | hurts |  |
| 1682 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.11 ± 0.07 | −0.12 | −0.11 | 12.0 | no clear effect |  |
| 1683 | Live Off Borrowed Time | 14 | Class | — | check | −0.11 ± 0.04 | −0.06 | −0.16 | 1.0 | hurts |  |
| 1684 | Vivacious Bravado | 8 | Class | swashbuckler | with panache, temporary Hit Points of its level plus Charisma until its next turn | −0.11 ± 0.04 | −0.16 | −0.07 | 2.0 | hurts |  |
| 1685 | Blazing Talon Surge | 6 | Class | monk | Strike activity (requirement assumed: You are in Rain of Embers Stance) (in Rain of Embers Stance) | −0.12 ± 0.05 | −0.06 | −0.17 | 2.0 | hurts |  |
| 1686 | Necrotic Bomber | 4 | Class | — | innate spell: Necrotic Bomb (rank 1) | −0.12 ± 0.04 | −0.10 | −0.13 | 1.0 | hurts |  |
| 1687 | Celestial Rebirth | 20 | Class | — | innate spell: Breath of Life (rank 5), Heal (rank 5), Raise Dead (rank 10) | −0.12 ± 0.05 | −0.18 | −0.05 | 1.9 | hurts |  |
| 1688 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.12 ± 0.04 | −0.17 | −0.06 | 1.0 | hurts |  |
| 1689 | Waters of Creation | 10 | Class | oracle | check | −0.12 ± 0.05 | −0.04 | −0.19 | 2.2 | hurts |  |
| 1690 | Perfect Ki Adept | 6 | Class | — | innate spells: Unblinking Flame Revelation (rank 3), Unbreaking Wave Advance (rank 3), Unfolding Wind Rush (rank 3), Untwisting Iron Buffer (rank 3) | −0.12 ± 0.05 | −0.01 | −0.22 | 2.0 | hurts |  |
| 1691 | Form of the Beloved Mother | 17 | Ancestry | — | innate spell: Animal Form (rank 5), Slither (rank 5) | −0.12 ± 0.04 | −0.02 | −0.22 | 0.8 | hurts |  |
| 1692 | Fade Away | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Disguise Magic (rank 2) | −0.12 ± 0.05 | −0.04 | −0.19 | 1.0 | hurts |  |
| 1693 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.12 ± 0.04 | −0.17 | −0.07 | 1.0 | hurts |  |
| 1694 | Devastating Spellstrike | 4 | Class | magus | check | −0.12 ± 0.08 | −0.00 | −0.23 | 2.5 | no clear effect |  |
| 1695 | Manifold Conduit | 12 | Class | — | innate spell: Entreat the Many (rank 6) | −0.12 ± 0.07 | −0.25 | +0.01 | 1.0 | no clear effect |  |
| 1696 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | −0.12 ± 0.06 | −0.13 | −0.10 | 1.0 | no clear effect |  |
| 1697 | Drain Emotion | 9 | Ancestry | — | its text's self buff (TempHP 9) | −0.12 ± 0.05 | −0.15 | −0.09 | 1.0 | hurts |  |
| 1698 | Bloody Tendrils | 6 | Class | — | 3 tendril thralls beside foes: a foe ending its turn within 10 feet takes 1d12, basic Reflex DC 22 (its focus spell, once a fight) | −0.12 ± 0.04 | −0.09 | −0.15 | 1.0 | hurts |  |
| 1699 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.12 ± 0.09 | +0.02 | −0.26 | 7.1 | no clear effect |  |
| 1700 | Shared Assault | 12 | Class | bard | Courageous Anthem an action more, and an ally's melee Strike as a reaction; its critical hit, another ally's Strike (with Courageous Assault) | −0.12 ± 0.05 | −0.00 | −0.24 | 4.8 | hurts |  |
| 1701 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.12 ± 0.06 | −0.17 | −0.07 | 1.0 | hurts |  |
| 1702 | Hardwood Armor | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -5 feet Speed (1 action) | −0.12 ± 0.06 | −0.11 | −0.14 | 1.0 | hurts |  |
| 1703 | Metal Carapace | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -5 feet Speed (1 action) | −0.12 ± 0.06 | −0.11 | −0.14 | 1.0 | hurts |  |
| 1704 | Armor in Earth | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -10 feet Speed (1 action) | −0.12 ± 0.06 | −0.11 | −0.14 | 1.0 | hurts |  |
| 1705 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.12 ± 0.05 | −0.14 | −0.10 | 1.0 | hurts |  |
| 1706 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | −0.12 ± 0.05 | −0.14 | −0.10 | 1.0 | hurts |  |
| 1707 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.12 ± 0.04 | −0.08 | −0.16 | 2.7 | hurts |  |
| 1708 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.12 ± 0.03 | −0.05 | −0.19 | 3.5 | hurts |  |
| 1709 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.12 ± 0.05 | −0.10 | −0.14 | 1.6 | hurts |  |
| 1710 | Jotun's Grasp | 5 | Ancestry | — | check | −0.12 ± 0.03 | −0.16 | −0.09 | 2.7 | hurts |  |
| 1711 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.12 ± 0.05 | −0.16 | −0.08 | 1.0 | hurts |  |
| 1712 | Pointed Question | 0 | Action | investigator | check | −0.13 ± 0.05 | −0.11 | −0.14 | 2.1 | hurts |  |
| 1713 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | −0.13 ± 0.03 | −0.11 | −0.14 | 1.0 | hurts |  |
| 1714 | Belly Flop | 10 | Class | guardian | Strike activity | −0.13 ± 0.05 | −0.28 | +0.02 | 11.1 | hurts |  |
| 1715 | Compliant Gold | 12 | Class | exemplar | Topple the Pillar of Heaven: inline save: 60-foot line, reflex, 6d8 untyped (DC 31) | −0.13 ± 0.06 | −0.12 | −0.13 | 4.9 | hurts |  |
| 1716 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.13 ± 0.06 | −0.18 | −0.08 | 4.4 | hurts |  |
| 1717 | Five-Gods Ram | 12 | Class | monk | Strike activity (requirement assumed: You're in Rushing Goat Stance) (in Rushing Goat Stance) | −0.13 ± 0.06 | +0.07 | −0.33 | 2.7 | hurts |  |
| 1718 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.13 ± 0.04 | −0.14 | −0.11 | 1.0 | hurts |  |
| 1719 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.13 ± 0.04 | −0.06 | −0.19 | 2.1 | hurts |  |
| 1720 | Eternity-Incinerating Blaze | 18 | Class | exemplar | Burn out of Time: heals 5d8 (touch) | −0.13 ± 0.04 | −0.07 | −0.19 | 3.6 | hurts |  |
| 1721 | Plant Shape | 10 | Class | druid | Untamed Form's plant shapes (Plant Form, rank 5) (in Untamed Form) | −0.13 ± 0.05 | −0.16 | −0.09 | 1.0 | hurts |  |
| 1722 | Alluring Performance | 9 | Ancestry | — | check | −0.13 ± 0.06 | −0.12 | −0.13 | 1.0 | hurts |  |
| 1723 | Conductive Sphere | 8 | Class | kineticist | save | −0.13 ± 0.09 | −0.08 | −0.17 | 5.5 | no clear effect |  |
| 1724 | Analyze Weakness | 6 | Class | rogue | +2d6 precision on its next sneak attack (1 action) | −0.13 ± 0.04 | −0.13 | −0.13 | 4.7 | hurts |  |
| 1725 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.13 ± 0.07 | −0.18 | −0.08 | 4.1 | no clear effect | with two weapons (longsword and shortsword) |
| 1726 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.13 ± 0.06 | −0.30 | +0.04 | 1.0 | hurts |  |
| 1727 | Fey Magic | 9 | Ancestry | — | innate spells: Faerie Fire (rank 2), Invisibility (rank 2) | −0.13 ± 0.05 | −0.06 | −0.20 | 1.2 | hurts |  |
| 1728 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.13 ± 0.05 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1729 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.13 ± 0.05 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1730 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.13 ± 0.05 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1731 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.13 ± 0.03 | −0.06 | −0.20 | 0.0 | hurts | the AI never used it |
| 1732 | Oni Form | 1 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.05 | −0.09 | −0.17 | 1.0 | hurts |  |
| 1733 | Poisoner's Twist | 4 | Class | — | check | −0.13 ± 0.04 | −0.07 | −0.19 | 5.8 | hurts |  |
| 1734 | Dread Mosquito Storm | 18 | Class | — | innate spell: Dread Mosquito Storm (rank 9) | −0.13 ± 0.03 | −0.14 | −0.12 | 2.8 | hurts |  |
| 1735 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.13 ± 0.06 | −0.04 | −0.22 | 2.7 | hurts |  |
| 1736 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | −0.13 ± 0.04 | −0.20 | −0.06 | 1.0 | hurts |  |
| 1737 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.13 ± 0.06 | −0.11 | −0.15 | 1.8 | hurts |  |
| 1738 | Companion's Cry | 4 | Class | ranger | Commanded with 2 actions every turn: the companion's third action | −0.13 ± 0.06 | −0.18 | −0.09 | 11.2 | hurts |  |
| 1739 | Brandish Authority | 18 | Class | — | check | −0.13 ± 0.06 | −0.23 | −0.04 | 2.9 | hurts |  |
| 1740 | Decree of Execution | 18 | Class | — | save | −0.13 ± 0.04 | +0.00 | −0.26 | 1.0 | hurts |  |
| 1741 | Part the Veil | 0 | Action | — | check | −0.13 ± 0.05 | −0.12 | −0.15 | 1.0 | hurts |  |
| 1742 | Burn out of Time | 0 | Action | — | heals 5d8 (touch) | −0.13 ± 0.03 | −0.12 | −0.15 | 0.8 | hurts |  |
| 1743 | Electrogenesis | 6 | Class | — | save | −0.13 ± 0.04 | −0.14 | −0.13 | 1.0 | hurts |  |
| 1744 | Blazing Streak | 10 | Class | monk | a Strike at up to four enemies within 60 feet (3 actions) (in Stoked Flame Stance) | −0.13 ± 0.03 | +0.00 | −0.27 | 2.3 | hurts |  |
| 1745 | Shove | 0 | Action | — | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.8 | hurts | with a one-handed weapon and a free hand |
| 1746 | Flower Street Infamy | 11 | Skill | — | check | −0.13 ± 0.04 | −0.05 | −0.22 | 3.7 | hurts |  |
| 1747 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.14 ± 0.05 | +0.02 | −0.29 | 1.0 | hurts |  |
| 1748 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | −0.14 ± 0.06 | −0.20 | −0.07 | 1.0 | hurts |  |
| 1749 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.14 ± 0.05 | −0.20 | −0.07 | 1.0 | hurts |  |
| 1750 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.14 ± 0.05 | −0.16 | −0.12 | 1.0 | hurts |  |
| 1751 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | −0.14 ± 0.11 | −0.19 | −0.09 | 1.0 | no clear effect |  |
| 1752 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.14 ± 0.05 | −0.12 | −0.16 | 1.0 | hurts |  |
| 1753 | Kneecap | 5 | Ancestry | — | Strike activity | −0.14 ± 0.03 | −0.11 | −0.17 | 8.2 | hurts |  |
| 1754 | Cavalier's Charge | 4 | Class | — | its mount's two Strides and a Strike at +1 | −0.14 ± 0.04 | −0.23 | −0.05 | 10.0 | hurts |  |
| 1755 | Dragonet Breath | 1 | Ancestry | — | save | −0.14 ± 0.03 | −0.23 | −0.05 | 0.7 | hurts |  |
| 1756 | Night's Glow | 6 | Class | — | innate spells: Moonbeam (rank 1), Zenith Star (rank 1) | −0.14 ± 0.05 | −0.09 | −0.19 | 1.0 | hurts |  |
| 1757 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.14 ± 0.06 | −0.20 | −0.08 | 1.0 | hurts |  |
| 1758 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.14 ± 0.04 | −0.20 | −0.08 | 1.0 | hurts |  |
| 1759 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.14 ± 0.06 | −0.01 | −0.27 | 1.0 | hurts |  |
| 1760 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.14 ± 0.05 | −0.18 | −0.10 | 1.0 | hurts |  |
| 1761 | Fleet Tempo | 4 | Class | — | effect | −0.14 ± 0.05 | −0.13 | −0.15 | 2.0 | hurts |  |
| 1762 | Overdrive Ally | 8 | Class | inventor | an ally within 30 feet: its Strikes +2 damage until its next turn ends (1 action, in overdrive) | −0.14 ± 0.08 | −0.00 | −0.28 | 9.2 | no clear effect |  |
| 1763 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.14 ± 0.05 | −0.11 | −0.17 | 1.0 | hurts |  |
| 1764 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.14 ± 0.05 | −0.11 | −0.17 | 1.0 | hurts |  |
| 1765 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.14 ± 0.05 | −0.11 | −0.17 | 1.0 | hurts |  |
| 1766 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.14 ± 0.05 | −0.11 | −0.17 | 1.0 | hurts |  |
| 1767 | Hypnotic Lure | 5 | Ancestry | — | inline save: 1 creature, 30 feet, will (DC 21, 1/fight) | −0.14 ± 0.03 | −0.16 | −0.13 | 1.2 | hurts |  |
| 1768 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.14 ± 0.07 | −0.24 | −0.04 | 2.0 | hurts |  |
| 1769 | Violent Vines | 13 | Ancestry | — | innate spell: Murderous Vine (rank 4) | −0.14 ± 0.04 | −0.15 | −0.14 | 1.0 | hurts |  |
| 1770 | Stridulating Song | 0 | Action | — | save | −0.14 ± 0.04 | −0.10 | −0.18 | 1.0 | hurts |  |
| 1771 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.14 ± 0.05 | −0.16 | −0.13 | 1.0 | hurts |  |
| 1772 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.14 ± 0.07 | −0.09 | −0.20 | 4.8 | hurts | with a warhammer and a free hand |
| 1773 | Sleepwalker Dedication | 4 | Class | — | Daydream Trance: PF2e's self Effect | −0.14 ± 0.06 | −0.27 | −0.02 | 1.0 | hurts |  |
| 1774 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.14 ± 0.06 | −0.19 | −0.10 | 1.0 | hurts |  |
| 1775 | Flash Your Badge | 10 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1776 | Disturbing Knowledge | 7 | Skill | — | check | −0.14 ± 0.04 | −0.04 | −0.25 | 2.9 | hurts |  |
| 1777 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.14 ± 0.06 | −0.15 | −0.14 | 1.0 | hurts |  |
| 1778 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.15 ± 0.06 | −0.23 | −0.06 | 2.0 | hurts |  |
| 1779 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.15 ± 0.03 | −0.17 | −0.12 | 1.1 | hurts |  |
| 1780 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.15 ± 0.03 | −0.17 | −0.12 | 1.1 | hurts |  |
| 1781 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.15 ± 0.03 | −0.17 | −0.12 | 1.1 | hurts |  |
| 1782 | Distracting Feint | 2 | Class | rogue | Feint (forced): a foe off-guard to it also takes –2 to Perception and Reflex saves | −0.15 ± 0.04 | −0.07 | −0.22 | 2.3 | hurts |  |
| 1783 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.15 ± 0.05 | −0.06 | −0.23 | 3.3 | hurts |  |
| 1784 | Kobold Breath | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1785 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1786 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spell: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.15 ± 0.03 | −0.13 | −0.17 | 3.3 | hurts |  |
| 1787 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.15 ± 0.03 | −0.13 | −0.17 | 3.3 | hurts |  |
| 1788 | Submission Hold | 8 | Class | — | check | −0.15 ± 0.05 | −0.11 | −0.19 | 4.5 | hurts |  |
| 1789 | Jinx | 0 | Action | — | save | −0.15 ± 0.04 | −0.09 | −0.20 | 1.0 | hurts |  |
| 1790 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.15 ± 0.04 | −0.14 | −0.16 | 0.8 | hurts |  |
| 1791 | Cursed Effigy | 8 | Class | thaumaturge | an Effect on a foe | −0.15 ± 0.08 | −0.06 | −0.24 | 6.3 | no clear effect |  |
| 1792 | Headshot | 14 | Class | gunslinger | a 2-action firearm Strike; a critical hit on a foe it already hurt: a Fortitude save or it dies | −0.15 ± 0.09 | −0.27 | −0.03 | 7.2 | no clear effect |  |
| 1793 | Valkyrie's Charge | 0 | Action | commander | check | −0.15 ± 0.05 | −0.05 | −0.25 | 0.7 | hurts |  |
| 1794 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.15 ± 0.03 | −0.14 | −0.16 | 3.0 | hurts |  |
| 1795 | Immortal Lightness | 4 | Class | — | innate spell: Athletic Rush (rank 1) | −0.15 ± 0.06 | −0.27 | −0.03 | 1.0 | hurts |  |
| 1796 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | −0.15 ± 0.11 | −0.13 | −0.18 | 1.0 | no clear effect |  |
| 1797 | Towering Presence | 5 | Ancestry | — | PF2e's self Effect | −0.15 ± 0.03 | −0.20 | −0.11 | 2.2 | hurts |  |
| 1798 | Dazing Blow | 6 | Class | fighter | Strike activity | −0.15 ± 0.04 | −0.16 | −0.14 | 2.7 | hurts |  |
| 1799 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.15 ± 0.04 | −0.28 | −0.02 | 6.7 | hurts |  |
| 1800 | Fiendish Brand | 6 | Class | — | Strike activity | −0.15 ± 0.05 | −0.18 | −0.13 | 3.8 | hurts |  |
| 1801 | Staff Sweep | 6 | Class | — | check | −0.15 ± 0.04 | −0.12 | −0.19 | 3.2 | hurts |  |
| 1802 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.15 ± 0.07 | −0.18 | −0.12 | 1.0 | hurts |  |
| 1803 | Flickering Twirl | 12 | Class | — | check | −0.15 ± 0.06 | −0.18 | −0.13 | 3.8 | hurts |  |
| 1804 | Hampering Stance | 2 | Class | guardian | a stance (its difficult terrain not played) | −0.15 ± 0.04 | −0.19 | −0.12 | 1.0 | hurts |  |
| 1805 | Resist Ruin | 13 | Ancestry | — | innate spell: False Vitality (rank 5) | −0.15 ± 0.04 | −0.23 | −0.07 | 1.0 | hurts |  |
| 1806 | Targeting Shot | 14 | Class | ranger | a ranged press Strike ignoring concealment and cover | −0.15 ± 0.07 | −0.09 | −0.22 | 15.7 | hurts |  |
| 1807 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.06 | −0.03 | −0.28 | 0.0 | hurts | the AI never used it |
| 1808 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | −0.15 ± 0.07 | −0.13 | −0.18 | 7.5 | hurts |  |
| 1809 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.16 ± 0.05 | −0.12 | −0.19 | 2.0 | hurts |  |
| 1810 | Haft Striker Stance | 4 | Class | fighter | stance | −0.16 ± 0.06 | −0.30 | −0.02 | 1.2 | hurts |  |
| 1811 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.16 ± 0.06 | −0.30 | −0.02 | 1.2 | hurts |  |
| 1812 | Chain Infusion | 10 | Class | kineticist | Chain Infusion and an Elemental Blast, its hits chaining on to other foes (2 actions) | −0.16 ± 0.05 | −0.24 | −0.07 | 8.7 | hurts |  |
| 1813 | Giant's Stature | 6 | Class | barbarian | PF2e's self Effect | −0.16 ± 0.06 | −0.10 | −0.22 | 1.0 | hurts |  |
| 1814 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | −0.16 ± 0.05 | −0.12 | −0.20 | 2.8 | hurts |  |
| 1815 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.16 ± 0.05 | −0.17 | −0.15 | 1.0 | hurts |  |
| 1816 | Claw Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.04 | −0.20 | −0.12 | 1.1 | hurts |  |
| 1817 | Tandem Strike | 6 | Class | summoner | its Strike and its eidolon's (two of their three actions) | −0.16 ± 0.07 | −0.11 | −0.20 | 15.6 | hurts |  |
| 1818 | Pistol Twirl | 2 | Class | gunslinger | check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.6 | hurts |  |
| 1819 | Pistol Phenom Dedication | 2 | Class | — | Pistol Twirl: check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.6 | hurts |  |
| 1820 | Suplex | 4 | Class | — | Strike activity | −0.16 ± 0.04 | −0.14 | −0.18 | 1.2 | hurts |  |
| 1821 | Mounted Shield | 6 | Class | — | its raised shield's bonus to its mount's AC too | −0.16 ± 0.04 | −0.24 | −0.08 | 11.0 | hurts | with a weapon and a shield |
| 1822 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.16 ± 0.04 | −0.10 | −0.23 | 2.2 | hurts |  |
| 1823 | Talon Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.05 | −0.18 | −0.14 | 1.1 | hurts |  |
| 1824 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.16 ± 0.04 | −0.19 | −0.14 | 1.0 | hurts |  |
| 1825 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.16 ± 0.05 | −0.22 | −0.11 | 3.9 | hurts |  |
| 1826 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.16 ± 0.04 | −0.12 | −0.21 | 1.9 | hurts |  |
| 1827 | Sunbird Glare | 6 | Class | — | save (requirement assumed: You're in bright light) | −0.16 ± 0.05 | −0.01 | −0.31 | 3.4 | hurts |  |
| 1828 | Draconic Resilience | 4 | Class | — | effect | −0.16 ± 0.04 | −0.26 | −0.06 | 5.5 | hurts |  |
| 1829 | Twin Parry | 4 | Class | fighter | effect | −0.16 ± 0.04 | −0.26 | −0.06 | 2.8 | hurts |  |
| 1830 | Penetrating Projectile | 16 | Class | barbarian | a ranged Strike at up to two foes in a line, raging | −0.16 ± 0.05 | +0.00 | −0.33 | 4.1 | hurts | with a loaded arquebus |
| 1831 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.16 ± 0.04 | −0.26 | −0.06 | 2.7 | hurts |  |
| 1832 | Spirit's Wrath | 12 | Class | barbarian | check | −0.17 ± 0.08 | −0.02 | −0.31 | 12.4 | no clear effect |  |
| 1833 | Wait For It... | 0 | Action | commander | an Effect on an ally | −0.17 ± 0.06 | −0.04 | −0.29 | 5.0 | hurts |  |
| 1834 | Draconic Fury | 4 | Class | — | save | −0.17 ± 0.04 | −0.26 | −0.07 | 2.0 | hurts |  |
| 1835 | Godbreaker | 20 | Class | monk | 3 Strikes | −0.17 ± 0.08 | −0.15 | −0.18 | 1.5 | no clear effect |  |
| 1836 | Plane Step | 9 | Ancestry | — | check | −0.17 ± 0.05 | −0.14 | −0.20 | 2.2 | hurts |  |
| 1837 | Flinging Blow | 16 | Class | monk | Strike activity | −0.17 ± 0.08 | +0.00 | −0.34 | 6.4 | no clear effect |  |
| 1838 | You Can't Keep Us Down | 14 | Class | — | check | −0.17 ± 0.05 | −0.17 | −0.17 | 1.0 | hurts |  |
| 1839 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | −0.17 ± 0.04 | −0.23 | −0.12 | 1.0 | hurts |  |
| 1840 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.17 ± 0.04 | −0.12 | −0.22 | 1.6 | hurts |  |
| 1841 | Slam Down | 4 | Class | fighter | Strike activity | −0.17 ± 0.05 | −0.28 | −0.06 | 2.6 | hurts |  |
| 1842 | Ulfen Guard Dedication | 2 | Class | — | Designate Ally: its Effect on an ally within 30 feet | −0.17 ± 0.05 | +0.09 | −0.44 | 7.7 | hurts |  |
| 1843 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.17 ± 0.07 | −0.10 | −0.25 | 4.0 | hurts |  |
| 1844 | Raise Slabs | 0 | Action | — | save | −0.18 ± 0.05 | −0.13 | −0.22 | 1.0 | hurts |  |
| 1845 | Staggering Fire | 6 | Class | — | Strike activity | −0.18 ± 0.04 | −0.14 | −0.21 | 10.4 | hurts |  |
| 1846 | Cry of Rebellion | 16 | Class | — | save | −0.18 ± 0.07 | −0.26 | −0.09 | 1.0 | hurts |  |
| 1847 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.13 | −0.22 | 0.0 | hurts | the AI never used it |
| 1848 | Decree of War | 18 | Class | — | Strike activity | −0.18 ± 0.05 | −0.08 | −0.28 | 2.7 | hurts |  |
| 1849 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.18 ± 0.06 | −0.14 | −0.21 | 3.7 | hurts |  |
| 1850 | All Returns To Slumber | 6 | Class | — | save (requirement assumed: Your waking world is active) | −0.18 ± 0.04 | −0.08 | −0.28 | 3.1 | hurts |  |
| 1851 | Unending Emptiness | 14 | Class | — | innate spell: Darklight (rank 7) | −0.18 ± 0.04 | −0.08 | −0.28 | 0.9 | hurts |  |
| 1852 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.18 ± 0.05 | −0.19 | −0.17 | 5.9 | hurts |  |
| 1853 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.18 ± 0.06 | −0.08 | −0.28 | 2.1 | hurts |  |
| 1854 | Remember Their Names | 16 | Class | — | save | −0.18 ± 0.07 | −0.16 | −0.21 | 7.5 | hurts |  |
| 1855 | Shield of Grace | 16 | Class | champion | Shield Warden's block for an ally, the rest split with it | −0.19 ± 0.08 | −0.17 | −0.20 | 0.1 | hurts |  |
| 1856 | Avenger of Gluttony | 14 | Class | — | Gluttonous Feast: save | −0.19 ± 0.05 | −0.15 | −0.22 | 1.0 | hurts |  |
| 1857 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.19 ± 0.04 | −0.16 | −0.21 | 2.0 | hurts |  |
| 1858 | Sun Blade | 4 | Class | champion | innate spell: Sun Blade (rank 2) | −0.19 ± 0.06 | −0.19 | −0.19 | 1.0 | hurts |  |
| 1859 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.19 ± 0.08 | −0.11 | −0.26 | 3.2 | hurts |  |
| 1860 | Multishot Stance | 16 | Class | fighter | stance: Double Shot's penalty −1 (from −2) (in Double Shot) | −0.19 ± 0.06 | −0.16 | −0.21 | 1.0 | hurts | with a bow in hand |
| 1861 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.10 | −0.28 | 1.9 | hurts |  |
| 1862 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.19 ± 0.05 | −0.24 | −0.14 | 1.0 | hurts |  |
| 1863 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.19 ± 0.05 | −0.03 | −0.35 | 3.2 | hurts |  |
| 1864 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | −0.19 ± 0.07 | −0.26 | −0.12 | 3.9 | hurts |  |
| 1865 | Thunderclap Spell | 10 | Class | druid | Thunderclap Spell copies of 4 spells | −0.19 ± 0.05 | −0.04 | −0.35 | 3.5 | hurts |  |
| 1866 | Amalgamate | 14 | Class | — | two thralls fused into a Large amalgamation: its thrall Strikes +14 damage while it lasts | −0.19 ± 0.06 | −0.07 | −0.31 | 3.5 | hurts |  |
| 1867 | Surging Smash | 6 | Class | — | save (requirement assumed: You are overflowing) | −0.19 ± 0.04 | −0.13 | −0.25 | 2.5 | hurts |  |
| 1868 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.20 ± 0.04 | −0.16 | −0.23 | 2.4 | hurts |  |
| 1869 | Pivot Strike | 14 | Class | — | a Strike with twice its weapon dice in damage, then a Trip (its Leap and staff not checked) | −0.20 ± 0.06 | −0.19 | −0.20 | 7.5 | hurts |  |
| 1870 | Trip | 0 | Action | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 1.9 | hurts | with a one-handed weapon and a free hand |
| 1871 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.20 ± 0.06 | −0.02 | −0.37 | 5.3 | hurts |  |
| 1872 | Ringing Challenge | 0 | Action | — | save | −0.20 ± 0.05 | −0.23 | −0.16 | 2.0 | hurts |  |
| 1873 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | −0.20 ± 0.05 | −0.21 | −0.19 | 5.0 | hurts |  |
| 1874 | Stranglehold | 9 | Ancestry | — | check | −0.20 ± 0.06 | +0.02 | −0.41 | 11.3 | hurts |  |
| 1875 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.20 ± 0.06 | −0.19 | −0.21 | 1.4 | hurts |  |
| 1876 | Tail Spin | 5 | Ancestry | — | check | −0.20 ± 0.03 | −0.29 | −0.11 | 2.5 | hurts |  |
| 1877 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.20 ± 0.06 | −0.04 | −0.36 | 3.8 | hurts |  |
| 1878 | Vexing Tumble | 6 | Class | swashbuckler | check | −0.20 ± 0.05 | −0.13 | −0.28 | 6.6 | hurts |  |
| 1879 | Spinebreaker | 10 | Class | — | check | −0.20 ± 0.04 | −0.21 | −0.20 | 4.9 | hurts |  |
| 1880 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.21 ± 0.05 | −0.24 | −0.17 | 2.1 | hurts |  |
| 1881 | Forceful Shot | 14 | Class | — | Strike activity | −0.21 ± 0.04 | −0.22 | −0.19 | 7.0 | hurts |  |
| 1882 | Triple Shot | 6 | Class | fighter | Double Shot at one foe, or three ranged Strikes at –4 each (3 actions) (in Double Shot) | −0.21 ± 0.04 | −0.26 | −0.15 | 2.9 | hurts |  |
| 1883 | Aether Beam | 8 | Class | — | save (requirement assumed: You are overflowing) | −0.21 ± 0.06 | −0.26 | −0.16 | 5.5 | hurts |  |
| 1884 | Extract Element | 0 | Action | kineticist | save | −0.21 ± 0.05 | −0.20 | −0.21 | 6.1 | hurts |  |
| 1885 | Archer's Aim | 8 | Class | — | Strike activity | −0.21 ± 0.06 | −0.21 | −0.21 | 6.9 | hurts |  |
| 1886 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | −0.21 ± 0.06 | −0.27 | −0.15 | 3.0 | hurts |  |
| 1887 | Ranger's Bramble | 6 | Class | ranger | innate spell: Ranger's Bramble (rank 3) | −0.21 ± 0.07 | −0.14 | −0.28 | 5.1 | hurts |  |
| 1888 | Fabricate Truth | 4 | Class | — | check | −0.21 ± 0.05 | −0.16 | −0.26 | 3.0 | hurts |  |
| 1889 | Arcane Camouflage | 9 | Ancestry | — | innate spells: Blur (rank 2), Invisibility (rank 2) | −0.21 ± 0.05 | −0.19 | −0.24 | 2.0 | hurts |  |
| 1890 | Skirt the Underworld | 0 | Action | — | save | −0.21 ± 0.05 | −0.23 | −0.19 | 2.1 | hurts |  |
| 1891 | Feral Toss | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | −0.21 ± 0.05 | −0.15 | −0.28 | 3.9 | hurts |  |
| 1892 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.21 ± 0.08 | −0.26 | −0.17 | 5.1 | hurts |  |
| 1893 | Aldori Parry | 4 | Class | — | self effect | −0.21 ± 0.05 | −0.35 | −0.08 | 2.7 | hurts |  |
| 1894 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.22 ± 0.06 | −0.36 | −0.08 | 4.9 | hurts |  |
| 1895 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.22 ± 0.06 | −0.26 | −0.18 | 6.3 | hurts |  |
| 1896 | Venipuncture | 10 | Class | — | save | −0.22 ± 0.05 | −0.18 | −0.27 | 1.8 | hurts |  |
| 1897 | Heavy is the Crown | 0 | Action | — | inline save: 15-foot burst, will, 1 spirit (DC 17) | −0.23 ± 0.04 | −0.23 | −0.23 | 1.9 | hurts |  |
| 1898 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.23 ± 0.05 | −0.33 | −0.13 | 2.0 | hurts |  |
| 1899 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.23 ± 0.05 | −0.23 | −0.23 | 2.8 | hurts |  |
| 1900 | Wiles on the Wind | 12 | Class | kineticist | save | −0.23 ± 0.08 | −0.12 | −0.34 | 4.3 | hurts |  |
| 1901 | Night's Shine | 12 | Class | — | innate spells: Asterism (rank 4), Touch of the Moon (rank 4) | −0.23 ± 0.06 | −0.21 | −0.26 | 3.5 | hurts |  |
| 1902 | Terrifying Countenance | 18 | Class | — | innate spell: Mask of Terror (rank 7) | −0.23 ± 0.07 | −0.24 | −0.23 | 4.4 | hurts |  |
| 1903 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1904 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1905 | Warning Shot | 2 | Class | gunslinger | check | −0.23 ± 0.06 | −0.19 | −0.28 | 2.7 | hurts |  |
| 1906 | Infernal Interference | 16 | Class | — | Strike activity (requirement assumed: You're wielding your order's favored weapon) | −0.23 ± 0.06 | −0.35 | −0.12 | 4.8 | hurts |  |
| 1907 | Summon Metal Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.23 ± 0.06 | −0.38 | −0.09 | 1.0 | hurts |  |
| 1908 | Summon Wood Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.23 ± 0.06 | −0.38 | −0.09 | 1.0 | hurts |  |
| 1909 | Bloom of Health | 14 | Class | — | an Effect on an ally | −0.23 ± 0.06 | −0.29 | −0.18 | 7.6 | hurts |  |
| 1910 | Scrap Barricade | 6 | Class | kineticist | save | −0.24 ± 0.10 | −0.19 | −0.28 | 4.7 | hurts |  |
| 1911 | Threatening Approach | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.4 | hurts |  |
| 1912 | Primal Roar | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.4 | hurts |  |
| 1913 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.24 ± 0.05 | −0.28 | −0.20 | 2.1 | hurts |  |
| 1914 | Subjugation | 16 | Class | — | save | −0.24 ± 0.06 | −0.23 | −0.25 | 3.0 | hurts |  |
| 1915 | Aether Blast | 4 | Class | — | save (requirement assumed: You are overflowing) | −0.24 ± 0.05 | −0.28 | −0.20 | 7.7 | hurts |  |
| 1916 | The Tyrant Falls! | 20 | Class | — | self effect | −0.24 ± 0.06 | −0.37 | −0.11 | 1.0 | hurts |  |
| 1917 | Dirty Trick | 1 | Skill | — | check | −0.24 ± 0.04 | −0.06 | −0.41 | 1.7 | hurts |  |
| 1918 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.24 ± 0.05 | −0.26 | −0.22 | 2.1 | hurts |  |
| 1919 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.24 ± 0.05 | −0.19 | −0.29 | 1.0 | hurts |  |
| 1920 | Tactical Takedown | 0 | Action | commander | save | −0.24 ± 0.06 | −0.16 | −0.32 | 2.5 | hurts |  |
| 1921 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.24 ± 0.05 | −0.25 | −0.23 | 2.1 | hurts |  |
| 1922 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.24 ± 0.05 | −0.34 | −0.14 | 1.0 | hurts |  |
| 1923 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.24 ± 0.06 | −0.25 | −0.24 | 1.0 | hurts |  |
| 1924 | Shielding Taunt | 2 | Class | guardian | Taunt that raises its shield | −0.24 ± 0.05 | +0.05 | −0.53 | 0.0 | hurts | the AI never used it |
| 1925 | Clobber | 16 | Class | guardian | Strike activity | −0.24 ± 0.06 | −0.24 | −0.25 | 8.3 | hurts |  |
| 1926 | Thaumaturge Dedication | 2 | Class | — | Glimpse Vulnerability: effect | −0.24 ± 0.05 | +0.00 | −0.49 | 6.6 | hurts |  |
| 1927 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.24 ± 0.05 | −0.23 | −0.26 | 2.7 | hurts |  |
| 1928 | Convocation of Greed | 0 | Action | — | an Effect on an ally | −0.24 ± 0.04 | −0.17 | −0.32 | 9.5 | hurts |  |
| 1929 | Underhanded Assault | 2 | Class | rogue | a Sneak (Stealth −2 against its Perception DC), then a melee Strike it's off-guard to (2 actions) | −0.25 ± 0.05 | −0.22 | −0.28 | 2.6 | hurts |  |
| 1930 | Wheeling Grab | 6 | Class | — | check | −0.25 ± 0.05 | −0.24 | −0.26 | 3.1 | hurts |  |
| 1931 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.25 ± 0.04 | −0.33 | −0.17 | 4.3 | hurts |  |
| 1932 | Buzzing Death Cicadas | 12 | Class | — | Death Drone: save | −0.25 ± 0.06 | −0.19 | −0.31 | 5.7 | hurts |  |
| 1933 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.25 ± 0.05 | −0.31 | −0.19 | 1.0 | hurts |  |
| 1934 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.25 ± 0.04 | −0.19 | −0.32 | 4.5 | hurts |  |
| 1935 | Might of the Realm | 14 | Class | — | Strike activity | −0.25 ± 0.06 | −0.27 | −0.24 | 4.4 | hurts |  |
| 1936 | Sovereign's Blade | 18 | Class | — | an Effect on an ally | −0.25 ± 0.06 | −0.29 | −0.21 | 6.0 | hurts |  |
| 1937 | Arcane Slam | 9 | Ancestry | — | check | −0.25 ± 0.05 | −0.25 | −0.26 | 1.1 | hurts |  |
| 1938 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1939 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1940 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1941 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1942 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1943 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1944 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1945 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1946 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1947 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1948 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1949 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1950 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1951 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1952 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1953 | Meteoric Spellstrike | 10 | Class | magus | check | −0.26 ± 0.06 | −0.09 | −0.43 | 5.8 | hurts | with a loaded arquebus |
| 1954 | Knockback Strike | 10 | Class | monk | Strike activity | −0.26 ± 0.06 | −0.23 | −0.29 | 4.8 | hurts |  |
| 1955 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.27 ± 0.06 | −0.43 | −0.10 | 18.1 | hurts |  |
| 1956 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.27 ± 0.11 | −0.14 | −0.39 | 7.6 | hurts |  |
| 1957 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.27 ± 0.08 | −0.18 | −0.35 | 1.0 | hurts |  |
| 1958 | Transfusion | 8 | Class | — | an Effect on an ally | −0.27 ± 0.06 | −0.23 | −0.31 | 7.3 | hurts |  |
| 1959 | Summon Air Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.27 ± 0.06 | −0.40 | −0.14 | 1.0 | hurts |  |
| 1960 | Scorching Column | 1 | Class | kineticist | save | −0.27 ± 0.07 | −0.32 | −0.22 | 2.7 | hurts |  |
| 1961 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.27 ± 0.04 | −0.26 | −0.29 | 3.0 | hurts |  |
| 1962 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.27 ± 0.05 | −0.29 | −0.26 | 2.0 | hurts |  |
| 1963 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.27 ± 0.07 | −0.39 | −0.15 | 10.1 | hurts |  |
| 1964 | Whirling Throw | 6 | Class | monk | check | −0.28 ± 0.06 | −0.23 | −0.32 | 7.6 | hurts |  |
| 1965 | Captivating Charm | 0 | Action | — | save | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1966 | Putrefaction | 14 | Class | — | save | −0.28 ± 0.05 | −0.23 | −0.32 | 3.0 | hurts |  |
| 1967 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.28 ± 0.05 | −0.24 | −0.31 | 7.9 | hurts |  |
| 1968 | Summon Earth Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.28 ± 0.06 | −0.40 | −0.15 | 1.0 | hurts |  |
| 1969 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1970 | Elemental Shape | 10 | Class | druid | Untamed Form's elemental shapes (Elemental Form, rank 5) (in Untamed Form) | −0.28 ± 0.07 | −0.43 | −0.14 | 1.0 | hurts |  |
| 1971 | Steel on Steel | 4 | Class | exemplar | Ringing Challenge: save | −0.28 ± 0.05 | −0.30 | −0.27 | 2.8 | hurts |  |
| 1972 | The Dead Walk | 10 | Class | oracle | check | −0.29 ± 0.06 | −0.22 | −0.35 | 3.0 | hurts |  |
| 1973 | Sanguivolent Roots | 8 | Class | kineticist | save | −0.29 ± 0.11 | −0.50 | −0.07 | 5.5 | hurts |  |
| 1974 | Hush | 14 | Class | — | save (requirement assumed: You are veiled) | −0.29 ± 0.06 | −0.07 | −0.51 | 3.8 | hurts |  |
| 1975 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.29 ± 0.05 | −0.29 | −0.29 | 4.1 | hurts |  |
| 1976 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.29 ± 0.06 | −0.25 | −0.33 | 2.6 | hurts |  |
| 1977 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.29 ± 0.06 | −0.14 | −0.44 | 7.5 | hurts |  |
| 1978 | Clashing Compound Invocation | 10 | Class | — | save | −0.29 ± 0.07 | −0.35 | −0.24 | 11.7 | hurts |  |
| 1979 | Steal for the Depths | 5 | Ancestry | — | check | −0.30 ± 0.04 | −0.37 | −0.22 | 2.7 | hurts |  |
| 1980 | Drag Down | 5 | Ancestry | — | check | −0.30 ± 0.04 | −0.37 | −0.22 | 2.7 | hurts |  |
| 1981 | Basic Wilding | 4 | Class | — | Untamed Form: Untamed Form's animal shapes (Animal Form, rank 2) | −0.30 ± 0.10 | −0.44 | −0.16 | 1.0 | hurts |  |
| 1982 | Jalmeri Heavenseeker Dedication | 4 | Class | — | Rain of Embers Stance: PF2e's stance Effect | −0.30 ± 0.09 | −0.46 | −0.14 | 1.0 | hurts |  |
| 1983 | Spinning Crush | 0 | Action | gunslinger | save | −0.30 ± 0.05 | −0.26 | −0.34 | 1.3 | hurts |  |
| 1984 | Launch Fireworks | 0 | Action | — | save | −0.30 ± 0.05 | −0.19 | −0.42 | 4.0 | hurts | with a one-handed weapon and a free hand |
| 1985 | Buckle-Cut Blitz | 0 | Action | commander | save | −0.31 ± 0.06 | −0.28 | −0.33 | 2.7 | hurts |  |
| 1986 | Clawdancer Dedication | 2 | Class | — | Claw Stance: PF2e's stance Effect | −0.31 ± 0.05 | −0.31 | −0.31 | 1.1 | hurts |  |
| 1987 | Spinning Release | 14 | Class | — | save | −0.31 ± 0.06 | −0.51 | −0.11 | 0.4 | hurts |  |
| 1988 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.27 | −0.36 | 2.5 | hurts |  |
| 1989 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.27 | −0.36 | 2.5 | hurts |  |
| 1990 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.27 | −0.36 | 2.5 | hurts |  |
| 1991 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.27 | −0.36 | 2.5 | hurts |  |
| 1992 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.27 | −0.36 | 2.5 | hurts |  |
| 1993 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.31 ± 0.05 | −0.12 | −0.51 | 3.1 | hurts |  |
| 1994 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.31 ± 0.04 | −0.45 | −0.18 | 5.0 | hurts |  |
| 1995 | Collateral Reinforcement | 6 | Class | — | an Effect on an ally | −0.32 ± 0.04 | −0.27 | −0.36 | 4.9 | hurts |  |
| 1996 | Holy Light | 10 | Class | champion | save | −0.32 ± 0.07 | −0.25 | −0.39 | 5.4 | hurts |  |
| 1997 | Distracting Spellstrike | 4 | Class | magus | check | −0.32 ± 0.07 | −0.36 | −0.27 | 1.9 | hurts |  |
| 1998 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.32 ± 0.06 | −0.26 | −0.37 | 20.7 | hurts |  |
| 1999 | Parting Shot | 4 | Class | fighter | Strike activity | −0.32 ± 0.06 | −0.38 | −0.25 | 4.5 | hurts | with a bow in hand |
| 2000 | Grovel | 5 | Ancestry | — | check | −0.32 ± 0.04 | −0.32 | −0.32 | 6.7 | hurts |  |
| 2001 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.32 ± 0.04 | −0.37 | −0.27 | 3.4 | hurts |  |
| 2002 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.32 ± 0.06 | −0.17 | −0.47 | 14.9 | hurts |  |
| 2003 | Oil Fire | 2 | Class | inventor | save | −0.32 ± 0.06 | −0.22 | −0.41 | 1.5 | hurts |  |
| 2004 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | −0.32 ± 0.09 | −0.48 | −0.16 | 1.0 | hurts |  |
| 2005 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.32 ± 0.08 | −0.28 | −0.37 | 4.3 | hurts |  |
| 2006 | Brain Drain | 8 | Class | psychic | save | −0.32 ± 0.05 | −0.45 | −0.20 | 3.2 | hurts |  |
| 2007 | Grudge Strike | 6 | Class | animist | Strike activity (requirement assumed: Your attuned apparition grants Heraldry Lore or Underworld Lore as an apparition skill) | −0.32 ± 0.07 | −0.35 | −0.30 | 2.8 | hurts |  |
| 2008 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.32 ± 0.07 | −0.41 | −0.24 | 8.6 | hurts |  |
| 2009 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.32 ± 0.06 | −0.25 | −0.40 | 2.6 | hurts |  |
| 2010 | Running Tackle | 8 | Class | — | check | −0.33 ± 0.07 | −0.28 | −0.37 | 4.5 | hurts |  |
| 2011 | Hallowed Initiate | 4 | Class | — | innate spell: Call of the Grave (rank 1), Death's Call (rank 1) | −0.33 ± 0.07 | −0.41 | −0.24 | 1.0 | hurts |  |
| 2012 | Glimpse Vulnerability | 0 | Action | — | effect | −0.33 ± 0.05 | −0.05 | −0.60 | 6.2 | hurts |  |
| 2013 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2014 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2015 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2016 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2017 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2018 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 2019 | Dizzying Spell | 14 | Class | wizard | Dizzying Spell copies of 6 spells | −0.33 ± 0.06 | −0.29 | −0.36 | 4.6 | hurts |  |
| 2020 | Swimming Charge | 5 | Ancestry | — | check (requirement assumed: You are swimming in water) | −0.33 ± 0.04 | −0.41 | −0.25 | 4.0 | hurts |  |
| 2021 | Spiritual Awakening | 4 | Class | — | Spiritual Expansion Spell: widened copies of 3 area spells | −0.33 ± 0.08 | −0.69 | +0.02 | 3.8 | hurts |  |
| 2022 | Sleeper Hold | 10 | Class | monk | check | −0.33 ± 0.08 | −0.54 | −0.13 | 7.0 | hurts |  |
| 2023 | Protect the Royal Line | 16 | Class | — | check | −0.34 ± 0.06 | −0.47 | −0.20 | 5.4 | hurts |  |
| 2024 | Animal Summoner | 9 | Ancestry | — | innate spell: Summon Animal (rank 5) | −0.34 ± 0.06 | −0.29 | −0.38 | 1.0 | hurts |  |
| 2025 | Wing Shove | 8 | Class | — | check | −0.34 ± 0.05 | −0.45 | −0.23 | 4.0 | hurts |  |
| 2026 | Perfect Ki Grandmaster | 18 | Class | — | innate spells: Unblinking Flame Ignition (rank 9), Unbreaking Wave Containment (rank 9), Unfolding Wind Crash (rank 9), Untwisting Iron Pillar (rank 9) | −0.34 ± 0.06 | −0.36 | −0.31 | 2.0 | hurts |  |
| 2027 | Mage Hunter | 6 | Class | barbarian | a 2-action Strike, stupefied 1 (2 on a critical hit) until its next turn (whether it saw a spell cast isn't checked) | −0.34 ± 0.07 | −0.31 | −0.37 | 5.2 | hurts |  |
| 2028 | Call Draconic Ally | 14 | Class | — | innate spell: Summon Dragon (rank 7) | −0.34 ± 0.07 | −0.49 | −0.19 | 1.0 | hurts |  |
| 2029 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.34 ± 0.06 | −0.57 | −0.11 | 4.6 | hurts |  |
| 2030 | Cutting Rebuke | 4 | Class | — | Bon Mot: check | −0.34 ± 0.06 | −0.62 | −0.06 | 7.4 | hurts |  |
| 2031 | Grim Swagger | 0 | Action | gunslinger | check (requirement assumed: You have a one-handed firearm or one-handed crossbow visibly worn or wielded) | −0.34 ± 0.06 | −0.12 | −0.56 | 1.4 | hurts |  |
| 2032 | Muckraking | 16 | Class | — | save | −0.34 ± 0.07 | −0.44 | −0.24 | 4.8 | hurts |  |
| 2033 | Mesmerizing Gaze | 6 | Class | — | save | −0.34 ± 0.05 | −0.23 | −0.45 | 3.1 | hurts |  |
| 2034 | Weaver's Web | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.35 ± 0.05 | −0.24 | −0.46 | 4.1 | hurts |  |
| 2035 | Soaring Shape | 8 | Class | druid | Untamed Form's aerial shapes (Aerial Form, rank 4) (in Untamed Form) | −0.35 ± 0.08 | −0.56 | −0.15 | 1.0 | hurts |  |
| 2036 | Infiltration Assassination | 10 | Class | — | Strike activity (requirement assumed: You're wearing a loaded gauntlet bow) | −0.35 ± 0.05 | −0.28 | −0.43 | 6.2 | hurts |  |
| 2037 | Stupefying Raid | 0 | Action | commander | save | −0.36 ± 0.06 | −0.37 | −0.34 | 2.8 | hurts |  |
| 2038 | Boulder Roll | 5 | Ancestry | — | save | −0.36 ± 0.04 | −0.39 | −0.33 | 3.8 | hurts |  |
| 2039 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.36 ± 0.07 | −0.35 | −0.37 | 1.6 | hurts |  |
| 2040 | Ostilli Host Dedication | 2 | Class | — | Spit Ambient Magic: save | −0.36 ± 0.05 | −0.25 | −0.47 | 7.0 | hurts |  |
| 2041 | Channeled Protection | 4 | Class | animist | effect | −0.36 ± 0.09 | −0.58 | −0.15 | 17.3 | hurts |  |
| 2042 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.37 ± 0.06 | −0.26 | −0.47 | 8.0 | hurts |  |
| 2043 | Fey Life | 16 | Class | — | innate spell: Summon Fey (rank 7) | −0.37 ± 0.08 | −0.41 | −0.32 | 1.0 | hurts |  |
| 2044 | Raise the Walls | 0 | Action | — | effect | −0.37 ± 0.06 | −0.26 | −0.48 | 7.3 | hurts |  |
| 2045 | Bone Investiture | 13 | Ancestry | — | innate spell: Dinosaur Form (rank 5) | −0.37 ± 0.05 | −0.60 | −0.14 | 1.0 | hurts |  |
| 2046 | Core Cannon | 17 | Ancestry | — | PF2e's self Effect | −0.37 ± 0.06 | −0.48 | −0.26 | 1.0 | hurts |  |
| 2047 | Stay Down! | 14 | Class | rogue | check | −0.37 ± 0.06 | −0.36 | −0.38 | 11.1 | hurts |  |
| 2048 | Ancestor's Rage | 13 | Ancestry | — | innate spell: Animal Form (rank 5) | −0.37 ± 0.05 | −0.58 | −0.17 | 1.0 | hurts |  |
| 2049 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.38 ± 0.06 | −0.33 | −0.42 | 1.0 | hurts |  |
| 2050 | Aphet Flash | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.38 ± 0.05 | −0.28 | −0.47 | 6.4 | hurts |  |
| 2051 | Propulsive Leap | 10 | Class | — | save | −0.38 ± 0.06 | −0.33 | −0.42 | 12.3 | hurts |  |
| 2052 | Form of the Dragon | 17 | Ancestry | — | innate spell: Dragon Form (rank 8) | −0.38 ± 0.06 | −0.44 | −0.32 | 1.0 | hurts |  |
| 2053 | Summon Water Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.38 ± 0.07 | −0.40 | −0.37 | 1.0 | hurts |  |
| 2054 | Hammer Quake | 14 | Class | — | check | −0.38 ± 0.06 | −0.11 | −0.66 | 4.5 | hurts |  |
| 2055 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.39 ± 0.07 | −0.24 | −0.53 | 8.1 | hurts |  |
| 2056 | Rend Mimicry | 4 | Class | — | check | −0.39 ± 0.05 | −0.35 | −0.42 | 7.9 | hurts |  |
| 2057 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.39 ± 0.06 | −0.49 | −0.29 | 5.1 | hurts |  |
| 2058 | Rising Hurricane | 6 | Class | kineticist | save | −0.39 ± 0.10 | −0.52 | −0.26 | 4.5 | hurts |  |
| 2059 | Exaltation Overwhelming | 18 | Class | — | save | −0.39 ± 0.06 | −0.38 | −0.40 | 3.0 | hurts |  |
| 2060 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.39 ± 0.07 | −0.44 | −0.35 | 8.7 | hurts |  |
| 2061 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.40 ± 0.06 | −0.41 | −0.38 | 5.8 | hurts | with a one-handed weapon and a free hand |
| 2062 | Wing Bounce | 4 | Class | — | check | −0.40 ± 0.07 | −0.43 | −0.37 | 2.5 | hurts |  |
| 2063 | Devil Allies | 0 | Bonus | — | innate spell: Summon Fiend (rank 6) | −0.40 ± 0.07 | +0.03 | −0.83 | 1.0 | hurts |  |
| 2064 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.40 ± 0.04 | −0.53 | −0.27 | 4.2 | hurts |  |
| 2065 | Perfect Shot | 18 | Class | ranger | a ranged Strike at maximum damage, then its turn ends (3 actions) | −0.41 ± 0.10 | −0.49 | −0.33 | 8.5 | hurts |  |
| 2066 | Sing to the Steel | 12 | Class | — | an Effect on an ally | −0.41 ± 0.07 | −0.52 | −0.31 | 8.4 | hurts |  |
| 2067 | Crown of Rule | 16 | Class | exemplar | Heavy is the Crown: inline save: 15-foot burst, will, 16 spirit (DC 35) | −0.42 ± 0.07 | −0.39 | −0.44 | 6.4 | hurts |  |
| 2068 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.42 ± 0.07 | −0.44 | −0.39 | 8.3 | hurts |  |
| 2069 | Wing Buffet | 9 | Ancestry | — | check | −0.42 ± 0.06 | −0.52 | −0.32 | 4.3 | hurts |  |
| 2070 | Warped Constriction | 8 | Class | — | save | −0.43 ± 0.06 | −0.38 | −0.47 | 13.4 | hurts |  |
| 2071 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.44 ± 0.07 | −0.28 | −0.59 | 7.7 | hurts |  |
| 2072 | Trample Mimicry | 10 | Class | — | save | −0.44 ± 0.05 | −0.49 | −0.39 | 3.7 | hurts |  |
| 2073 | Shape of the Dragon | 14 | Class | — | innate spell: Dragon Form (rank 7) | −0.44 ± 0.07 | −0.60 | −0.28 | 1.0 | hurts |  |
| 2074 | Shape of the Cloud Dragon | 14 | Class | — | innate spell: Dragon Form (rank 7) | −0.44 ± 0.07 | −0.60 | −0.28 | 1.0 | hurts |  |
| 2075 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.44 ± 0.06 | −0.41 | −0.48 | 7.2 | hurts |  |
| 2076 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.45 ± 0.06 | −0.54 | −0.36 | 4.3 | hurts |  |
| 2077 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.46 ± 0.04 | −0.48 | −0.44 | 4.2 | hurts |  |
| 2078 | Catchy Tune | 5 | Ancestry | — | check | −0.46 ± 0.05 | −0.24 | −0.69 | 15.9 | hurts |  |
| 2079 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.47 ± 0.07 | −0.51 | −0.43 | 3.0 | hurts |  |
| 2080 | Swarmkeeper Dedication | 2 | Class | — | Bite and Sting: save (requirement assumed: Your swarm is outside your body) | −0.48 ± 0.06 | −0.45 | −0.50 | 7.3 | hurts |  |
| 2081 | Shroud of Ghosts | 16 | Class | exemplar | Skirt the Underworld: save | −0.48 ± 0.07 | −0.60 | −0.36 | 6.0 | hurts |  |
| 2082 | Kijimuna Whistle | 13 | Ancestry | — | innate spell: Summon Plant or Fungus (rank 5) | −0.48 ± 0.07 | −0.43 | −0.54 | 1.0 | hurts |  |
| 2083 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.49 ± 0.05 | −0.41 | −0.57 | 25.3 | hurts |  |
| 2084 | Ancestral Form | 9 | Ancestry | — | innate spell: Animal Form (rank 3) | −0.49 ± 0.06 | −0.47 | −0.52 | 1.0 | hurts |  |
| 2085 | Phoenix's Flight | 16 | Class | — | innate spell: Monstrosity Form (rank 8) | −0.51 ± 0.07 | −0.56 | −0.46 | 1.0 | hurts |  |
| 2086 | Entities From Afar | 14 | Class | — | innate spell: Summon Entity (rank 5), Read Omens (rank 4) | −0.51 ± 0.09 | −0.42 | −0.60 | 1.0 | hurts |  |
| 2087 | Mixed Maneuver | 8 | Class | monk | check | −0.52 ± 0.09 | −0.56 | −0.47 | 5.4 | hurts |  |
| 2088 | Call the Worm | 18 | Class | — | innate spell: Summon Animal (rank 9) | −0.52 ± 0.09 | −0.46 | −0.58 | 1.0 | hurts |  |
| 2089 | Tamper | 1 | Class | inventor | check | −0.52 ± 0.06 | −0.50 | −0.54 | 7.3 | hurts |  |
| 2090 | Anatomical Quartering | 16 | Class | — | a Strike at each of up to four foes at one multiple attack penalty (3 actions) | −0.53 ± 0.05 | +0.00 | −1.06 | 2.8 | hurts |  |
| 2091 | Goblin Song | 1 | Ancestry | — | check | −0.53 ± 0.06 | −0.18 | −0.88 | 8.2 | hurts |  |
| 2092 | Silk Bracelet | 6 | Class | inventor | save | −0.53 ± 0.09 | −0.49 | −0.57 | 4.7 | hurts |  |
| 2093 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.53 ± 0.07 | −0.55 | −0.51 | 5.1 | hurts |  |
| 2094 | Summon Nephilim Kin | 13 | Ancestry | — | innate spell: Summon Celestial (rank 5), Summon Fiend (rank 5) | −0.53 ± 0.07 | −0.42 | −0.65 | 1.9 | hurts |  |
| 2095 | Flying Tackle | 4 | Class | guardian | check | −0.54 ± 0.07 | −0.75 | −0.34 | 3.4 | hurts |  |
| 2096 | Tear Tendons | 8 | Class | — | save (requirement assumed: You are in claw stance and have two open hands) | −0.55 ± 0.08 | −0.41 | −0.69 | 6.4 | hurts |  |
| 2097 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.55 ± 0.06 | −0.38 | −0.72 | 5.7 | hurts |  |
| 2098 | Fearful Symmetry | 6 | Class | — | save | −0.56 ± 0.06 | −0.52 | −0.59 | 11.4 | hurts |  |
| 2099 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.56 ± 0.06 | −0.61 | −0.50 | 5.1 | hurts |  |
| 2100 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.56 ± 0.06 | −0.61 | −0.50 | 5.1 | hurts |  |
| 2101 | Twist the Knife | 6 | Class | rogue | check | −0.56 ± 0.06 | −0.39 | −0.72 | 8.9 | hurts |  |
| 2102 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.58 ± 0.06 | −0.56 | −0.60 | 19.3 | hurts |  |
| 2103 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | −0.59 ± 0.10 | −0.47 | −0.71 | 3.0 | hurts |  |
| 2104 | Overextending Feint | 1 | Class | rogue | Feint (forced), each one goading (–2 to the foe's next attack on the PC, all on a critical success) instead of off-guard | −0.59 ± 0.07 | −0.42 | −0.77 | 5.2 | hurts |  |
| 2105 | Skeletal Transformation | 13 | Ancestry | — | innate spell: Animal Form (rank 2) | −0.60 ± 0.06 | −0.76 | −0.43 | 1.0 | hurts |  |
| 2106 | Wild Dance | 12 | Class | — | save | −0.60 ± 0.07 | −0.42 | −0.78 | 11.6 | hurts |  |
| 2107 | Catfolk Dance | 1 | Ancestry | — | check | −0.60 ± 0.07 | −0.48 | −0.71 | 6.8 | hurts |  |
| 2108 | Stone Guardian | 4 | Class | — | innate spell: Summon Elemental (rank 2) | −0.62 ± 0.08 | −0.37 | −0.87 | 1.0 | hurts |  |
| 2109 | Call Ursine Ally | 8 | Class | — | innate spell: Summon Animal (rank 3) | −0.62 ± 0.08 | −0.37 | −0.87 | 1.0 | hurts |  |
| 2110 | Freeze It! | 9 | Ancestry | — | check | −0.62 ± 0.06 | −0.65 | −0.59 | 13.1 | hurts |  |
| 2111 | Perplex | 14 | Class | — | check | −0.63 ± 0.07 | −0.66 | −0.61 | 3.9 | hurts |  |
| 2112 | Peony's Flourish | 14 | Class | — | check | −0.63 ± 0.07 | −0.45 | −0.82 | 5.6 | hurts |  |
| 2113 | Summon Fire Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.64 ± 0.07 | −0.43 | −0.85 | 1.0 | hurts |  |
| 2114 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | −0.65 ± 0.10 | −0.90 | −0.40 | 4.3 | hurts | with a one-handed weapon and a free hand |
| 2115 | Clear the Way | 6 | Class | — | check | −0.66 ± 0.06 | −0.81 | −0.50 | 3.6 | hurts |  |
| 2116 | Prayer Attack | 14 | Class | — | check | −0.69 ± 0.07 | −0.47 | −0.92 | 14.6 | hurts |  |
| 2117 | Night Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Mist (rank 2) | −0.70 ± 0.07 | −0.86 | −0.55 | 1.0 | hurts |  |
| 2118 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | −0.71 ± 0.07 | −0.63 | −0.78 | 1.0 | hurts |  |
| 2119 | Gossamer Blade | 4 | Class | — | check | −0.72 ± 0.06 | −0.73 | −0.71 | 9.3 | hurts |  |
| 2120 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.73 ± 0.07 | −0.73 | −0.73 | 10.8 | hurts |  |
| 2121 | Demolish Defenses | 18 | Class | guardian | save | −0.74 ± 0.09 | −0.76 | −0.73 | 9.8 | hurts |  |
| 2122 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.74 ± 0.06 | −0.89 | −0.59 | 14.7 | hurts |  |
| 2123 | Dust Cloud | 8 | Class | — | save (requirement assumed: Your waking world is active) | −0.76 ± 0.08 | −0.76 | −0.76 | 16.5 | hurts |  |
| 2124 | Pyre Ant Sting | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.77 ± 0.06 | −0.88 | −0.67 | 10.0 | hurts |  |
| 2125 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.79 ± 0.08 | −0.70 | −0.87 | 15.2 | hurts |  |
| 2126 | Coerce the Current | 9 | Ancestry | — | save (requirement assumed: You are swimming in water) | −0.79 ± 0.08 | −1.15 | −0.43 | 6.7 | hurts |  |
| 2127 | Frog Geyser | 5 | Ancestry | — | save (requirement assumed: Your mouth is full of water) | −0.81 ± 0.06 | −1.07 | −0.55 | 5.8 | hurts |  |
| 2128 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.81 ± 0.07 | −0.80 | −0.82 | 20.3 | hurts |  |
| 2129 | Flourishing Finish | 12 | Class | — | check | −0.81 ± 0.09 | −0.87 | −0.76 | 16.6 | hurts |  |
| 2130 | Dazzling Bullet | 6 | Class | — | check | −0.84 ± 0.07 | −0.71 | −0.96 | 11.9 | hurts |  |
| 2131 | Whirling Knockdown | 14 | Class | — | check | −0.87 ± 0.08 | −0.87 | −0.86 | 10.4 | hurts |  |
| 2132 | One Moment till Glory | 0 | Action | — | effect | −0.87 ± 0.07 | −0.71 | −1.04 | 14.9 | hurts |  |
| 2133 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.93 ± 0.07 | −1.13 | −0.73 | 9.4 | hurts | with a bow in hand |
| 2134 | Dance of the Tiger | 9 | Ancestry | — | check | −0.95 ± 0.08 | −1.13 | −0.76 | 19.0 | hurts |  |
| 2135 | Purifying Breeze | 14 | Class | cleric | effect | −0.95 ± 0.09 | −1.27 | −0.64 | 20.3 | hurts |  |
| 2136 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −0.99 ± 0.08 | −1.16 | −0.82 | 5.4 | hurts |  |
| 2137 | Unbalancing Sweep | 12 | Class | barbarian | check | −1.01 ± 0.12 | −1.09 | −0.92 | 4.5 | hurts |  |
| 2138 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.03 ± 0.06 | +0.00 | −2.05 | 1.0 | hurts |  |
| 2139 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.03 ± 0.06 | +0.00 | −2.05 | 1.0 | hurts |  |
| 2140 | Thrash | 8 | Class | barbarian | save | −1.09 ± 0.09 | −1.20 | −0.99 | 17.1 | hurts |  |
| 2141 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −1.13 ± 0.09 | −0.79 | −1.47 | 12.3 | hurts |  |
| 2142 | Silencing Strike | 10 | Class | barbarian | save | −1.21 ± 0.11 | −1.66 | −0.77 | 18.8 | hurts |  |
| 2143 | Scattering Charge | 12 | Class | guardian | check | −1.21 ± 0.12 | −1.31 | −1.12 | 4.9 | hurts |  |
| 2144 | Astral Compound Invocation | 12 | Class | — | save | −1.49 ± 0.14 | −1.58 | −1.40 | 16.1 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 3333 |
| a spell the engine doesn't cast | 160 |
| a timer with no rules a fight counts | 131 |
| a plan the engine can't play | 131 |
| a Strike with nothing more the simulator reads | 98 |
| a teleport | 72 |
| an Effect with nothing a fight counts | 59 |
| its requirement | 58 |
| a roll whose results the simulator doesn't read | 57 |
| it grants Additional Lore: the feat module reads nothing for it | 52 |
| nothing a fight uses | 50 |
| a passive's roll with no action to use it | 38 |
| its text has no Strike of its user's | 34 |
| it grants one of 2 | 32 |
| its Effect has nothing a fight counts | 29 |
| a spell the feat casts | 23 |
| a passive's Effect posted by hand | 22 |
| a passive's Effect on other creatures | 21 |
| a reaction's Strike | 19 |
| a reaction to "passive" | 17 |
| a reroll | 12 |
| its requirement, which the PC doesn't meet | 11 |
| a lasting area | 10 |
| a companion's Strike | 10 |
| a Focus or Mythic Point back | 10 |
| a choice of ways the simulator doesn't play | 9 |
| it grants Pet: the feat module reads nothing for it | 8 |
| a passive's Strike | 6 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 6 |
| it grants Cast a Spell: the feat module reads nothing for it | 5 |
| it grants Impressive Performance: the feat module reads nothing for it | 5 |
| it grants Domain Initiate: the feat module reads nothing for it | 5 |
| it grants Specialty Crafting: the feat module reads nothing for it | 5 |
| it grants Intimidating Glare: the feat module reads nothing for it | 5 |
| an Effect on another creature | 4 |
| it grants Verdant Core Deviant Classification: the feat module reads nothing for it | 4 |
| damage still naming the character's data | 4 |
| it grants Terrain Stalker: the feat module reads nothing for it | 4 |
| a reaction to "strike" | 4 |
| a roll twice | 4 |
| it grants Leech Deviant Classification: the feat module reads nothing for it | 3 |
| it grants Assurance: the feat module reads nothing for it | 3 |
| it grants one of 3 | 3 |
| it grants Snare Crafting: the feat module reads nothing for it | 3 |
| it grants Lie to Me: the feat module reads nothing for it | 3 |
| it grants Adopted Ancestry: the feat module reads nothing for it | 3 |
| it grants Quick Squeeze: the feat module reads nothing for it | 3 |
| it grants Titan Wrestler: the feat module reads nothing for it | 3 |
| it grants Blight Soul Deviant Classification: the feat module reads nothing for it | 2 |
| effects the GM allows from the scenery | 2 |
| it grants Dragon Deviant Classification: the feat module reads nothing for it | 2 |
| its stance (an elemental stance), not in the packs | 2 |
| it grants Wraith Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Enhanced Familiar: the feat module reads nothing for it | 2 |
| it grants Quick Repair: the feat module reads nothing for it | 2 |
| it grants Multilingual: the feat module reads nothing for it | 2 |
| it grants Underwater Marauder: the feat module reads nothing for it | 2 |
| it grants Hunt Prey: nothing a fight uses | 2 |
| it grants Ride: the feat module reads nothing for it | 2 |
| it grants one of 6 | 2 |
| it grants Eye for Numbers: the feat module reads nothing for it | 2 |
| it grants Oddity Identification: the feat module reads nothing for it | 2 |
| it grants Hobnobber: the feat module reads nothing for it | 2 |
| it grants Steady Balance: the feat module reads nothing for it | 2 |
| it grants Lengthy Diversion: the feat module reads nothing for it | 2 |
| it grants Courtly Graces: the feat module reads nothing for it | 2 |
| a free's Strike | 2 |
| it grants Combat Climber: the feat module reads nothing for it | 2 |
| it grants Untrained Improvisation: the feat module reads nothing for it | 2 |
| its stance (Monastic Archer Stance): the feat module reads nothing for it | 2 |
| it grants Conceal Spell: the feat module reads nothing for it | 2 |
| a reaction to "aura" | 2 |
| it grants Absorb into the Aegis: the feat module reads nothing for it | 1 |
| its stance (Powder Punch Stance): its text has no Strike of its user's | 1 |
| its stance | 1 |
| it grants Call Upon the Brightness: a plan the engine can't play | 1 |
| it grants Speed of Arms: a reaction's Strike | 1 |
| it grants Eidolon: the feat module reads nothing for it | 1 |
| it grants Once Bitten: the feat module reads nothing for it | 1 |
| it grants Influence Rumor: the feat module reads nothing for it | 1 |
| it grants Solitary Invocation: the feat module reads nothing for it | 1 |
| it grants Crafter's Appraisal: the feat module reads nothing for it | 1 |
| its stance (Bullet Dancer Stance): the feat module reads nothing for it | 1 |
| it grants Command Undead: a roll whose results the simulator doesn't read | 1 |
| a target the simulator can't tell | 1 |
| it grants Psychometric Assessment: the feat module reads nothing for it | 1 |
| it grants Spread Propaganda: the feat module reads nothing for it | 1 |
| it grants Bonded Animal: the feat module reads nothing for it | 1 |
| it grants Water Transfer: a teleport | 1 |
| it grants Witch's Charge: the feat module reads nothing for it | 1 |
| it grants Bullet Dancer Stance: the feat module reads nothing for it | 1 |
| it grants Infiltrator's Draw: a Strike with nothing more the simulator reads | 1 |
| a reaction to "damaged" | 1 |
| it grants Avoid Dire Fate: the feat module reads nothing for it | 1 |
| it grants Deity (Champion): the feat module reads nothing for it | 1 |
| it grants Inventor: the feat module reads nothing for it | 1 |
| it grants Create Familiar Fulu: nothing a fight uses | 1 |
| its stance (Peafowl Stance): an Effect with nothing a fight counts | 1 |
| it grants Assume a Role: the feat module reads nothing for it | 1 |
| it grants Experienced Tracker: the feat module reads nothing for it | 1 |
| it grants On the Case: the feat module reads nothing for it | 1 |
| it grants Tactics: the feat module reads nothing for it | 1 |
| it grants Qi Spells: the feat module reads nothing for it | 1 |
| it grants Bond with Spirit: nothing a fight uses | 1 |
| it grants Mark for Death: the feat module reads nothing for it | 1 |
| it grants one of 10 | 1 |
| it grants Accidental Shot: its text has no Strike of its user's | 1 |
| it grants Set Explosives: the feat module reads nothing for it | 1 |
| it grants Juggle: a timer with no rules a fight counts | 1 |
| it grants Rouse the World: a timer with no rules a fight counts | 1 |
| it grants Slayer's Identification: the feat module reads nothing for it | 1 |
| it grants Favored Terrain: the feat module reads nothing for it | 1 |
| it grants Divine Spark and Ikons: the feat module reads nothing for it | 1 |
| it grants Quick Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Spin Tale: an Effect with nothing a fight counts | 1 |
| it grants Binding Vow: the feat module reads nothing for it | 1 |
| it grants Engineer's Efficiency: the feat module reads nothing for it | 1 |
| it grants Taunt: an Effect with nothing a fight counts | 1 |
| it grants Mystic Aegis: the feat module reads nothing for it | 1 |
| it grants Crescent Spray: its text has no Strike of its user's | 1 |
| it grants Trick Magic Item: the feat module reads nothing for it | 1 |
| it grants Slippery Secrets: the feat module reads nothing for it | 1 |
| it grants Entity's Resurgence: a plan the engine can't play | 1 |
| it grants Lay Down Arms: the feat module reads nothing for it | 1 |
| it grants Devise a Stratagem: its text has no Strike of its user's | 1 |
| it grants Remove Head: the feat module reads nothing for it | 1 |
| it grants Base Kinesis: the feat module reads nothing for it | 1 |
| it grants Coughing Dragon: nothing a fight uses | 1 |
| it grants Size Up: an Effect with nothing a fight counts | 1 |
| it grants Monastic Weaponry: the feat module reads nothing for it | 1 |
| it grants Spell-Woven Shot: a Strike with nothing more the simulator reads | 1 |
| it grants Improvised Repair: the feat module reads nothing for it | 1 |
| it grants Flicker Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Cobble Together: the feat module reads nothing for it | 1 |
| it grants Expel Maelstrom: a roll whose results the simulator doesn't read | 1 |
| it grants Magical Crafting: the feat module reads nothing for it | 1 |
| it grants Automatic Knowledge: the feat module reads nothing for it | 1 |
| it grants Upstage: a plan the engine can't play | 1 |
| it grants Cycle Elemental Stance: a teleport | 1 |
| it grants Rage: its requirement | 1 |
| it grants Keen Recollection: the feat module reads nothing for it | 1 |
| it grants Inevitable Return: the feat module reads nothing for it | 1 |
| it grants Pirate Dedication: the feat module reads nothing for it | 1 |
| it grants Drape Ambient Magic: its text has no Strike of its user's | 1 |
| it grants Trace Rune: a timer with no rules a fight counts | 1 |
| it grants Powerful Leap: the feat module reads nothing for it | 1 |
| it grants Natural Medicine: the feat module reads nothing for it | 1 |
| it grants Find Fault: the feat module reads nothing for it | 1 |
| it grants Salt Wound: a plan the engine can't play | 1 |
| it grants Virtuosic Performer: the feat module reads nothing for it | 1 |
| it grants Mirror-Trickery: nothing a fight uses | 1 |
| it grants Forager: the feat module reads nothing for it | 1 |
| it grants Smoke Blending: nothing a fight uses | 1 |
| it grants Quick Identification: the feat module reads nothing for it | 1 |
| it grants Arcane Sense: a spell the engine doesn't cast | 1 |
| it grants Fast Recovery: the feat module reads nothing for it | 1 |
| it grants Quick Disguise: the feat module reads nothing for it | 1 |
| it grants Empty Vessel: the feat module reads nothing for it | 1 |
| it grants Mist Blending: nothing a fight uses | 1 |
| it grants Unwavering Resilience: a plan the engine can't play | 1 |
| it grants Reactive Falsehood: the feat module reads nothing for it | 1 |
| it grants Recognize Spell: the feat module reads nothing for it | 1 |
| it grants Only You and I: its text has no Strike of its user's | 1 |
| it grants Spasm of the Berserker: a timer with no rules a fight counts | 1 |
| it grants Dubious Knowledge: the feat module reads nothing for it | 1 |
| it grants Guerrilla Assault: a Strike with nothing more the simulator reads | 1 |
| it grants Arcane Bond: the feat module reads nothing for it | 1 |
| it grants Call Gun: the feat module reads nothing for it | 1 |
| it grants Jumping Jenny: a timer with no rules a fight counts | 1 |
| it grants Entreat Pact: its Effect has nothing a fight counts | 1 |
| it grants Transform Ammunition: the feat module reads nothing for it | 1 |
| it grants Charming Liar: the feat module reads nothing for it | 1 |
| it grants Devour Ambient Magic: nothing a fight uses | 1 |
| it grants Fortify Focus: the feat module reads nothing for it | 1 |
| it grants Hefty Hauler: the feat module reads nothing for it | 1 |
| it grants Swift Choreography: the feat module reads nothing for it | 1 |
| it grants Resist Magic: the feat module reads nothing for it | 1 |
| it grants Pitch-Perfect Projection: the feat module reads nothing for it | 1 |
| it grants Banshee Cry: a roll whose results the simulator doesn't read | 1 |
| it grants Disarming Interception: a plan the engine can't play | 1 |
| it grants Unimpeded Journey: the feat module reads nothing for it | 1 |
| it grants Dancing Dodge: the feat module reads nothing for it | 1 |
| it grants Shameless Request: the feat module reads nothing for it | 1 |
| it grants Fey Jump: a teleport | 1 |
| it grants Impromptu Investment: the feat module reads nothing for it | 1 |
| it grants Geomancer Dedication: the feat module reads nothing for it | 1 |
| it grants Canny Acumen: the feat module reads nothing for it | 1 |
| it grants Liberate Self: its Effect has nothing a fight counts | 1 |
| it grants Enter Runewell: the feat module reads nothing for it | 1 |
| it grants Greater Field Discovery (Toxicologist): the feat module reads nothing for it | 1 |
| it grants Forced Pact: a roll whose results the simulator doesn't read | 1 |
| its stance (Exploit Vulnerability): a timer with no rules a fight counts | 1 |
| it grants Magical Shorthand: the feat module reads nothing for it | 1 |
| it grants Battle Medicine: the feat module reads nothing for it | 1 |
| a reaction to "hit-by" | 1 |
| it grants Unravel the Future: the feat module reads nothing for it | 1 |
| it grants Intercession Spell: the feat module reads nothing for it | 1 |
| it grants Blinding of the Needle: a Strike with nothing more the simulator reads | 1 |
| it grants Pacifying Infusion: the feat module reads nothing for it | 1 |
| it grants Makes Me Stronger: the feat module reads nothing for it | 1 |
| it grants Plant Thirty Barbs: a Strike with nothing more the simulator reads | 1 |
| it grants Brandish the Gorgon's Gaze: the feat module reads nothing for it | 1 |
| it grants Tangle in Riddle: the feat module reads nothing for it | 1 |
| it grants Coiling Serpents: a Strike with nothing more the simulator reads | 1 |
| it grants Quick Alchemy: nothing a fight uses | 1 |
| it grants Sever Four Dragonfly Wings: a Strike with nothing more the simulator reads | 1 |
| it grants A Challenge for Heroes: an Effect with nothing a fight counts | 1 |
| it grants Shed the Mortal Skin: a timer with no rules a fight counts | 1 |
| it grants Call to Hand: nothing a fight uses | 1 |
| it grants Chassis Deflection: the feat module reads nothing for it | 1 |
| it grants Share Death's Promises: a timer with no rules a fight counts | 1 |
| it grants Bless Ally: an Effect with nothing a fight counts | 1 |
| it grants Inspired Stratagem: a plan the engine can't play | 1 |
| it grants Legendary Negotiation: the feat module reads nothing for it | 1 |
| it grants Weaponsight: an Effect with nothing a fight counts | 1 |
| it grants Heaven Rains an Ending: a Strike with nothing more the simulator reads | 1 |
| it grants Host of Wrath: a timer with no rules a fight counts | 1 |
| it grants Verdant Rest: the feat module reads nothing for it | 1 |
| it grants Overawe Crowd: a plan the engine can't play | 1 |
| it grants Aegis of Envy: a timer with no rules a fight counts | 1 |
| it grants Royal Grace: the feat module reads nothing for it | 1 |
| it grants Summon Sloth: the feat module reads nothing for it | 1 |
| it grants Sorshen's Devotion: a plan the engine can't play | 1 |
| it grants Draw From the Pages: the feat module reads nothing for it | 1 |
| it grants Set Free: its Effect has nothing a fight counts | 1 |
| it grants Break the Sun's Legs: a timer with no rules a fight counts | 1 |
| it grants Mark the Center: a timer with no rules a fight counts | 1 |
| it grants Call Warshard Weapon: the feat module reads nothing for it | 1 |
| it grants Objection: the feat module reads nothing for it | 1 |
| it grants Incredible Investiture: the feat module reads nothing for it | 1 |
| it grants Sidestep Through Time: a plan the engine can't play | 1 |
| it grants Restore the Moment: a reaction's Strike | 1 |
