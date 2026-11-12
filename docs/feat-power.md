# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-11: 2535 feats and actions rated, 4414 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 144 an encounter here, all fights 3129, no effect 1360, precise 403, about zero 178 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1740
- hurts: 516
- good: 155
- minor: 91
- strong: 27
- very strong: 6

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pennant of Victory | 20 | Class | commander | effect | +0.73 ± 0.06 | +0.69 | +0.77 | 1.0 | very strong |  |
| 2 | Monstrosity Shape | 16 | Class | druid | Untamed Form's monstrosity shapes (Monstrosity Form, rank 8) (in Untamed Form) | +0.59 ± 0.11 | +0.63 | +0.55 | 1.0 | very strong |  |
| 3 | Pin to the Spot | 14 | Class | — | Strike activity | +0.59 ± 0.04 | +0.99 | +0.19 | 5.8 | very strong |  |
| 4 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.51 ± 0.03 | +0.87 | +0.14 | 7.9 | very strong |  |
| 5 | Denier of Destruction | 20 | Class | cleric | an ally's damage less a 1-action Heal's dice (reaction, a Heal slot each, three a fight) | +0.51 ± 0.05 | +0.64 | +0.38 | 1.8 | very strong |  |
| 6 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.50 ± 0.05 | +0.50 | +0.51 | 0.0 | very strong | the AI never used it |
| 7 | Hair Trigger | 16 | Class | gunslinger | a Strike with its firearm as initiative is rolled, a hit off-guard till the end of its first turn | +0.48 ± 0.10 | +0.33 | +0.62 | 1.8 | strong |  |
| 8 | Jester's Gambol | 16 | Class | animist | stance | +0.44 ± 0.08 | +0.45 | +0.44 | 1.0 | strong |  |
| 9 | Distant Wandering | 10 | Class | — | effect | +0.44 ± 0.05 | +0.56 | +0.31 | 1.0 | strong |  |
| 10 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.44 ± 0.06 | +0.52 | +0.35 | 5.0 | strong |  |
| 11 | Basic Breakthrough | 4 | Class | — | Prototype Companion: its companion young, the bear's numbers (Commanded each turn) | +0.42 ± 0.08 | +0.41 | +0.43 | 8.2 | strong |  |
| 12 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.42 ± 0.08 | +0.51 | +0.34 | 4.8 | strong |  |
| 13 | Fey's Trickery | 8 | Class | — | casts Invisibility (rank 4, DC 26, 1/fight) | +0.41 ± 0.04 | +0.52 | +0.29 | 1.0 | strong |  |
| 14 | Mercenary Reversal | 18 | Class | commander | a foe's Will save (DC 40, incapacitation): stunned 1, or it fights on the party's side (2 actions; outnumbered taken as met) | +0.39 ± 0.07 | +0.00 | +0.78 | 4.5 | strong |  |
| 15 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.38 ± 0.05 | +0.41 | +0.34 | 0.0 | strong | the AI never used it |
| 16 | Perfect Ki Grandmaster | 18 | Class | — | innate spells: Unblinking Flame Ignition (rank 9), Unbreaking Wave Containment (rank 9), Unfolding Wind Crash (rank 9), Untwisting Iron Pillar (rank 9) | +0.38 ± 0.06 | +0.33 | +0.43 | 2.0 | strong |  |
| 17 | Basic Devotion | 4 | Class | — | Faithful Steed: its animal companion young (a bear, Commanded each turn) | +0.35 ± 0.06 | +0.32 | +0.37 | 7.4 | strong |  |
| 18 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.34 ± 0.05 | +0.43 | +0.26 | 1.5 | strong |  |
| 19 | Mocking Invisibility | 9 | Ancestry | — | innate spell: Invisibility (rank 4) | +0.34 ± 0.05 | +0.40 | +0.29 | 1.0 | strong |  |
| 20 | Submerged Stillness | 9 | Ancestry | — | casts Invisibility (rank 5, DC 27, 1/fight) | +0.34 ± 0.05 | +0.40 | +0.29 | 1.0 | strong |  |
| 21 | Basic Hunter's Trick | 4 | Class | — | Animal Companion (Ranger): its animal companion young (a bear, Commanded each turn) | +0.34 ± 0.06 | +0.43 | +0.24 | 7.8 | strong |  |
| 22 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.33 ± 0.05 | +0.64 | +0.01 | 19.0 | strong |  |
| 23 | Rebounding Assault | 10 | Class | gunslinger | two ranged Strikes at one penalty, +1d6 precision if both hit | +0.31 ± 0.06 | +0.30 | +0.32 | 5.5 | strong |  |
| 24 | Beastmaster Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.30 ± 0.05 | +0.36 | +0.24 | 5.9 | strong |  |
| 25 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.30 ± 0.08 | +0.43 | +0.17 | 13.8 | strong |  |
| 26 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.28 ± 0.09 | +0.19 | +0.38 | 4.9 | strong |  |
| 27 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.28 ± 0.05 | +0.31 | +0.25 | 5.0 | strong |  |
| 28 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | +0.28 ± 0.05 | +0.33 | +0.22 | 1.0 | strong |  |
| 29 | Return Unto Runes | 16 | Class | — | self effect | +0.27 ± 0.05 | +0.29 | +0.26 | 6.0 | strong |  |
| 30 | Turn to Mist | 10 | Class | — | PF2e's self Effect | +0.27 ± 0.05 | +0.31 | +0.24 | 1.0 | strong |  |
| 31 | Stonewall | 17 | Ancestry | — | a foe's hit of at least its level dealing it nothing (petrified till the turn ends; reaction) | +0.26 ± 0.02 | +0.34 | +0.17 | 1.0 | strong |  |
| 32 | Scare to Death | 15 | Skill | — | save | +0.26 ± 0.04 | +0.42 | +0.09 | 3.8 | strong |  |
| 33 | Blazing Wave | 4 | Class | kineticist | save | +0.25 ± 0.08 | +0.37 | +0.14 | 0.8 | strong |  |
| 34 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.25 ± 0.04 | +0.02 | +0.48 | 0.7 | good |  |
| 35 | Basic Wilding | 4 | Class | — | Animal Companion: its animal companion young (a bear, Commanded each turn) | +0.25 ± 0.06 | +0.31 | +0.19 | 4.9 | good |  |
| 36 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.25 ± 0.05 | +0.37 | +0.13 | 0.8 | good |  |
| 37 | Death Roll | 6 | Class | — | Strike activity | +0.25 ± 0.03 | +0.38 | +0.12 | 7.2 | good |  |
| 38 | Suli Amir | 13 | Ancestry | — | innate spell: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | +0.25 ± 0.03 | +0.31 | +0.18 | 1.0 | good |  |
| 39 | Invisible Trickster | 13 | Ancestry | — | innate spell: Invisibility (rank 4) | +0.25 ± 0.03 | +0.31 | +0.18 | 1.0 | good |  |
| 40 | Forest's Heart | 16 | Class | animist | stance | +0.25 ± 0.08 | +0.23 | +0.26 | 1.0 | good |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|
| Demoralize | +0.01 ± 0.01 | 0.6 |
| Grapple | +0.00 ± 0.00 | 0.0 |
| Trip | +0.00 ± 0.00 | 0.1 |
| Feint | +0.00 ± 0.00 | 0.0 |
| Reposition | +0.00 ± 0.00 | 0.0 |
| Shove | +0.00 ± 0.00 | 0.0 |
| Escape | +0.00 ± 0.00 | 0.0 |
| Disarm | +0.00 ± 0.00 | 0.0 |
| Create a Diversion | −0.00 ± 0.00 | 0.0 |
| Administer First Aid | −0.01 ± 0.01 | 0.0 |

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pennant of Victory | 20 | Class | commander | effect | +0.73 ± 0.06 | +0.69 | +0.77 | 1.0 | very strong |  |
| 2 | Monstrosity Shape | 16 | Class | druid | Untamed Form's monstrosity shapes (Monstrosity Form, rank 8) (in Untamed Form) | +0.59 ± 0.11 | +0.63 | +0.55 | 1.0 | very strong |  |
| 3 | Pin to the Spot | 14 | Class | — | Strike activity | +0.59 ± 0.04 | +0.99 | +0.19 | 5.8 | very strong |  |
| 4 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.51 ± 0.03 | +0.87 | +0.14 | 7.9 | very strong |  |
| 5 | Denier of Destruction | 20 | Class | cleric | an ally's damage less a 1-action Heal's dice (reaction, a Heal slot each, three a fight) | +0.51 ± 0.05 | +0.64 | +0.38 | 1.8 | very strong |  |
| 6 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.50 ± 0.05 | +0.50 | +0.51 | 0.0 | very strong | the AI never used it |
| 7 | Hair Trigger | 16 | Class | gunslinger | a Strike with its firearm as initiative is rolled, a hit off-guard till the end of its first turn | +0.48 ± 0.10 | +0.33 | +0.62 | 1.8 | strong |  |
| 8 | Jester's Gambol | 16 | Class | animist | stance | +0.44 ± 0.08 | +0.45 | +0.44 | 1.0 | strong |  |
| 9 | Distant Wandering | 10 | Class | — | effect | +0.44 ± 0.05 | +0.56 | +0.31 | 1.0 | strong |  |
| 10 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.44 ± 0.06 | +0.52 | +0.35 | 5.0 | strong |  |
| 11 | Basic Breakthrough | 4 | Class | — | Prototype Companion: its companion young, the bear's numbers (Commanded each turn) | +0.42 ± 0.08 | +0.41 | +0.43 | 8.2 | strong |  |
| 12 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.42 ± 0.08 | +0.51 | +0.34 | 4.8 | strong |  |
| 13 | Fey's Trickery | 8 | Class | — | casts Invisibility (rank 4, DC 26, 1/fight) | +0.41 ± 0.04 | +0.52 | +0.29 | 1.0 | strong |  |
| 14 | Mercenary Reversal | 18 | Class | commander | a foe's Will save (DC 40, incapacitation): stunned 1, or it fights on the party's side (2 actions; outnumbered taken as met) | +0.39 ± 0.07 | +0.00 | +0.78 | 4.5 | strong |  |
| 15 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.38 ± 0.05 | +0.41 | +0.34 | 0.0 | strong | the AI never used it |
| 16 | Perfect Ki Grandmaster | 18 | Class | — | innate spells: Unblinking Flame Ignition (rank 9), Unbreaking Wave Containment (rank 9), Unfolding Wind Crash (rank 9), Untwisting Iron Pillar (rank 9) | +0.38 ± 0.06 | +0.33 | +0.43 | 2.0 | strong |  |
| 17 | Basic Devotion | 4 | Class | — | Faithful Steed: its animal companion young (a bear, Commanded each turn) | +0.35 ± 0.06 | +0.32 | +0.37 | 7.4 | strong |  |
| 18 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.34 ± 0.05 | +0.43 | +0.26 | 1.5 | strong |  |
| 19 | Mocking Invisibility | 9 | Ancestry | — | innate spell: Invisibility (rank 4) | +0.34 ± 0.05 | +0.40 | +0.29 | 1.0 | strong |  |
| 20 | Submerged Stillness | 9 | Ancestry | — | casts Invisibility (rank 5, DC 27, 1/fight) | +0.34 ± 0.05 | +0.40 | +0.29 | 1.0 | strong |  |
| 21 | Basic Hunter's Trick | 4 | Class | — | Animal Companion (Ranger): its animal companion young (a bear, Commanded each turn) | +0.34 ± 0.06 | +0.43 | +0.24 | 7.8 | strong |  |
| 22 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.33 ± 0.05 | +0.64 | +0.01 | 19.0 | strong |  |
| 23 | Rebounding Assault | 10 | Class | gunslinger | two ranged Strikes at one penalty, +1d6 precision if both hit | +0.31 ± 0.06 | +0.30 | +0.32 | 5.5 | strong |  |
| 24 | Beastmaster Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.30 ± 0.05 | +0.36 | +0.24 | 5.9 | strong |  |
| 25 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.30 ± 0.08 | +0.43 | +0.17 | 13.8 | strong |  |
| 26 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.28 ± 0.09 | +0.19 | +0.38 | 4.9 | strong |  |
| 27 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.28 ± 0.05 | +0.31 | +0.25 | 5.0 | strong |  |
| 28 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | +0.28 ± 0.05 | +0.33 | +0.22 | 1.0 | strong |  |
| 29 | Return Unto Runes | 16 | Class | — | self effect | +0.27 ± 0.05 | +0.29 | +0.26 | 6.0 | strong |  |
| 30 | Turn to Mist | 10 | Class | — | PF2e's self Effect | +0.27 ± 0.05 | +0.31 | +0.24 | 1.0 | strong |  |
| 31 | Stonewall | 17 | Ancestry | — | a foe's hit of at least its level dealing it nothing (petrified till the turn ends; reaction) | +0.26 ± 0.02 | +0.34 | +0.17 | 1.0 | strong |  |
| 32 | Scare to Death | 15 | Skill | — | save | +0.26 ± 0.04 | +0.42 | +0.09 | 3.8 | strong |  |
| 33 | Blazing Wave | 4 | Class | kineticist | save | +0.25 ± 0.08 | +0.37 | +0.14 | 0.8 | strong |  |
| 34 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.25 ± 0.04 | +0.02 | +0.48 | 0.7 | good |  |
| 35 | Basic Wilding | 4 | Class | — | Animal Companion: its animal companion young (a bear, Commanded each turn) | +0.25 ± 0.06 | +0.31 | +0.19 | 4.9 | good |  |
| 36 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.25 ± 0.05 | +0.37 | +0.13 | 0.8 | good |  |
| 37 | Death Roll | 6 | Class | — | Strike activity | +0.25 ± 0.03 | +0.38 | +0.12 | 7.2 | good |  |
| 38 | Suli Amir | 13 | Ancestry | — | innate spell: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | +0.25 ± 0.03 | +0.31 | +0.18 | 1.0 | good |  |
| 39 | Invisible Trickster | 13 | Ancestry | — | innate spell: Invisibility (rank 4) | +0.25 ± 0.03 | +0.31 | +0.18 | 1.0 | good |  |
| 40 | Forest's Heart | 16 | Class | animist | stance | +0.25 ± 0.08 | +0.23 | +0.26 | 1.0 | good |  |
| 41 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.24 ± 0.05 | +0.26 | +0.23 | 2.7 | good |  |
| 42 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.04 | +0.06 | +0.42 | 0.6 | good |  |
| 43 | Towering Size | 12 | Class | summoner | its eidolon Huge, reach 15 feet | +0.24 ± 0.07 | +0.16 | +0.32 | 8.1 | good |  |
| 44 | Whirlwind Toss | 18 | Class | barbarian | check | +0.24 ± 0.06 | +0.47 | +0.01 | 8.3 | good |  |
| 45 | March of Law | 14 | Class | — | each enemy beside it frightened 2, once a round (the Stride to it not played) | +0.24 ± 0.05 | +0.31 | +0.17 | 3.8 | good |  |
| 46 | Faithful Steed | 1 | Class | champion | its animal companion young (a bear, Commanded each turn) | +0.24 ± 0.05 | +0.14 | +0.33 | 5.1 | good |  |
| 47 | Correct the Story | 6 | Class | — | a foe's critical hit or critically successful save rerolled (reaction, a Mythic Point) | +0.23 ± 0.03 | +0.31 | +0.16 | 0.8 | good |  |
| 48 | Peerless Mascot Companion | 16 | Class | commander | its animal companion specialized (against one incredible) | +0.23 ± 0.06 | +0.29 | +0.17 | 23.4 | good |  |
| 49 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.23 ± 0.06 | +0.30 | +0.15 | 6.3 | good |  |
| 50 | Battle-Tested Companion | 6 | Class | commander | its animal companion mature (against one young) | +0.23 ± 0.05 | +0.43 | +0.02 | 16.6 | good |  |
| 51 | Advanced Construct Companion | 4 | Class | inventor | its companion mature, the bear's numbers (against one young) | +0.22 ± 0.05 | +0.30 | +0.15 | 8.4 | good |  |
| 52 | Prototype Companion | 1 | Class | inventor | its companion young, the bear's numbers (Commanded each turn) | +0.22 ± 0.07 | +0.20 | +0.24 | 6.7 | good |  |
| 53 | Mature Animal Companion (Ranger) | 6 | Class | ranger | its animal companion mature (against one young) | +0.22 ± 0.05 | +0.35 | +0.09 | 11.2 | good |  |
| 54 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.22 ± 0.06 | +0.72 | −0.28 | 23.8 | good |  |
| 55 | Animal Companion | 1 | Class | druid | its animal companion young (a bear, Commanded each turn) | +0.22 ± 0.05 | +0.29 | +0.15 | 3.1 | good |  |
| 56 | Incredible Companion (Druid) | 8 | Class | druid | its animal companion incredible (against one mature) | +0.21 ± 0.05 | +0.40 | +0.03 | 7.7 | good |  |
| 57 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.21 ± 0.05 | +0.44 | −0.01 | 2.0 | good |  |
| 58 | Deadly Poison Weapon | 12 | Class | rogue | Poison Weapon with 4d4 poison (Poison Weapon with it) | +0.21 ± 0.06 | +0.35 | +0.08 | 0.0 | good | the AI never used it |
| 59 | Incredible Companion (Ranger) | 10 | Class | ranger | its animal companion incredible (against one mature) | +0.21 ± 0.04 | +0.18 | +0.24 | 12.6 | good |  |
| 60 | Specialized Companion (Druid) | 14 | Class | druid | its animal companion specialized (against one incredible) | +0.21 ± 0.05 | +0.27 | +0.15 | 6.5 | good |  |
| 61 | Mammoth Lord Dedication | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.21 ± 0.06 | +0.16 | +0.25 | 6.7 | good |  |
| 62 | Fleeting Arc through Heaven and Earth | 0 | Action | — | inline save: 60-foot cone, fortitude, 9d6 spirit (DC 17) | +0.20 ± 0.04 | +0.07 | +0.33 | 0.5 | good |  |
| 63 | Cavalier Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.20 ± 0.05 | +0.21 | +0.19 | 6.4 | good |  |
| 64 | Drake Rider Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.20 ± 0.05 | +0.21 | +0.19 | 6.4 | good |  |
| 65 | Prescient Parry | 16 | Class | — | +7 AC against a Strike that would hit (reaction, a Mythic Point each) | +0.20 ± 0.03 | +0.29 | +0.11 | 1.3 | good |  |
| 66 | Crashing Slam | 10 | Class | fighter | Slam Down (with it) whose hit trips as a critical success: prone and 1d6 bludgeoning | +0.20 ± 0.06 | +0.35 | +0.04 | 4.7 | good |  |
| 67 | Fane's Escape | 4 | Skill | — | check | +0.20 ± 0.05 | +0.28 | +0.11 | 1.5 | good |  |
| 68 | Topple the Pillar of Heaven | 0 | Action | — | inline save: 60-foot line, reflex, 6d8 untyped (DC 17) | +0.20 ± 0.05 | +0.13 | +0.26 | 1.4 | good |  |
| 69 | Rattle the Earth | 12 | Class | kineticist | Earthquake's effects in a 60-foot cone, DC 31 (2 actions; overflow, once a fight) | +0.20 ± 0.06 | +0.27 | +0.12 | 1.0 | good |  |
| 70 | Tempest-Sun Shielding | 10 | Class | — | 12 less of a hit's damage (reaction, twice a fight; the rank-3 slot it spends not taken from its spells) | +0.20 ± 0.03 | +0.25 | +0.14 | 1.7 | good |  |
| 71 | Spirit Sanctification | 0 | Action | — | its text's self buff (FlatModifier saving-throw 1) | +0.19 ± 0.04 | +0.13 | +0.26 | 0.9 | good |  |
| 72 | Steal the Sky | 10 | Class | — | innate spell: Steal the Sky (rank 5) | +0.19 ± 0.05 | +0.31 | +0.08 | 1.0 | good |  |
| 73 | Patron's Claim | 0 | Action | — | inline save: 1 creature, 30 feet, fortitude, 10d10 spirit (DC 17, 1/fight) | +0.19 ± 0.05 | +0.26 | +0.13 | 1.0 | good |  |
| 74 | Greater Distracting Shot | 16 | Class | ranger | its prey off-guard until its next turn after any ranged hit | +0.19 ± 0.08 | +0.06 | +0.33 | 0.0 | good | the AI never used it |
| 75 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.19 ± 0.04 | +0.24 | +0.14 | 0.6 | good | with a weapon and a shield |
| 76 | Shining Runes | 14 | Class | — | concealed until its next turn after a spell of 2 or more actions | +0.19 ± 0.05 | +0.12 | +0.26 | 3.9 | good |  |
| 77 | Big Debut | 10 | Class | — | each enemy a Will save (DC 27) or stunned 1 (2 on a critical failure) as initiative is rolled; the PC goes last (once a fight) | +0.19 ± 0.06 | +0.28 | +0.10 | 1.0 | good |  |
| 78 | Animal Companion (Ranger) | 1 | Class | ranger | its animal companion young (a bear, Commanded each turn) | +0.19 ± 0.06 | +0.28 | +0.10 | 6.6 | good |  |
| 79 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.19 ± 0.08 | +0.15 | +0.22 | 5.1 | good |  |
| 80 | Specialized Megafauna Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.19 ± 0.04 | +0.17 | +0.20 | 7.7 | good |  |
| 81 | Specialized Mount | 14 | Class | — | its animal companion specialized (against one incredible) | +0.19 ± 0.04 | +0.17 | +0.20 | 7.7 | good |  |
| 82 | Incredible Construct Companion | 8 | Class | inventor | its companion incredible, the bear's numbers (against one mature) | +0.18 ± 0.04 | +0.31 | +0.05 | 14.3 | good |  |
| 83 | Pierce the Eye | 16 | Class | — | save | +0.18 ± 0.06 | +0.29 | +0.06 | 4.4 | good | with a loaded arquebus |
| 84 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (requirement assumed: You're in Sky and Heaven Stance) (in Sky and Heaven Stance) | +0.17 ± 0.05 | +0.23 | +0.12 | 3.3 | good |  |
| 85 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.17 ± 0.05 | +0.06 | +0.28 | 1.0 | good |  |
| 86 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.17 ± 0.05 | +0.06 | +0.28 | 1.0 | good |  |
| 87 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.17 ± 0.05 | +0.06 | +0.28 | 1.0 | good |  |
| 88 | Do You Know Who I Am? | 12 | Class | — | check | +0.17 ± 0.06 | +0.28 | +0.07 | 1.0 | good |  |
| 89 | Spinning Stand | 6 | Class | — | 2 Strikes (requirement assumed: You're Prone) | +0.17 ± 0.05 | +0.19 | +0.15 | 6.5 | good |  |
| 90 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.17 ± 0.04 | +0.21 | +0.13 | 4.6 | good |  |
| 91 | Root to Life | 1 | Class | thaumaturge | check | +0.17 ± 0.05 | +0.29 | +0.05 | 3.1 | good |  |
| 92 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.17 ± 0.03 | +0.29 | +0.05 | 0.3 | good |  |
| 93 | Acrid Barrage | 0 | Action | — | save | +0.17 ± 0.04 | +0.20 | +0.13 | 1.4 | good |  |
| 94 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | +0.17 ± 0.05 | +0.08 | +0.25 | 0.0 | good | the AI never used it |
| 95 | Reflexive Stance | 12 | Class | monk | its stance (Tiger Stance) entered free as initiative is rolled (in Tiger Stance) | +0.17 ± 0.07 | +0.15 | +0.18 | 1.0 | good |  |
| 96 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.16 ± 0.04 | +0.21 | +0.12 | 0.4 | good |  |
| 97 | Fading | 10 | Class | — | a Strike that hits it misses on a failed DC 11 flat check (once a fight, reaction) | +0.16 ± 0.06 | +0.26 | +0.06 | 0.8 | good |  |
| 98 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.16 ± 0.05 | +0.22 | +0.11 | 5.5 | good |  |
| 99 | Graceful Poise | 16 | Class | fighter | Double Slice counting as one attack (its stance taken as entered) | +0.16 ± 0.04 | +0.18 | +0.15 | 5.5 | good |  |
| 100 | Mythic Containment | 10 | Class | — | check | +0.16 ± 0.05 | +0.32 | −0.00 | 2.9 | good |  |
| 101 | Heraldic Proclamation | 16 | Class | — | once a fight, an action: enemies within 30 feet 16 spirit (basic Will), allies 16 HP (the spell after it cast as usual) | +0.16 ± 0.05 | +0.03 | +0.29 | 1.8 | good |  |
| 102 | Ubiquitous Overdrive | 20 | Class | inventor | its Overdrive's damage bonus for its allies within 30 feet too | +0.16 ± 0.03 | +0.25 | +0.07 | 1.0 | good |  |
| 103 | Rock The Boat | 8 | Class | fighter | check | +0.16 ± 0.04 | +0.33 | −0.02 | 6.1 | good |  |
| 104 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | +0.16 ± 0.05 | +0.18 | +0.13 | 2.0 | good |  |
| 105 | Into the Labyrinth | 17 | Ancestry | — | a foe out of the fight in a labyrinth till it gets through (as Maze of Locked Doors' two doors; once a fight) | +0.16 ± 0.06 | +0.40 | −0.08 | 3.3 | good |  |
| 106 | Specialized Beastmaster Companion | 14 | Class | — | its animal companion specialized (against one incredible) | +0.16 ± 0.04 | +0.25 | +0.07 | 8.6 | good |  |
| 107 | Specialized Spirit Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.16 ± 0.04 | +0.25 | +0.07 | 8.6 | good |  |
| 108 | A Miracle of Science! | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.16 ± 0.04 | +0.25 | +0.07 | 8.6 | good |  |
| 109 | Paragon Reanimated Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.16 ± 0.04 | +0.25 | +0.07 | 8.6 | good |  |
| 110 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.16 ± 0.06 | +0.14 | +0.17 | 1.1 | good |  |
| 111 | Nimble Strike | 10 | Class | rogue | Nimble Dodge, then a melee Strike at the attacker (reaction) | +0.16 ± 0.05 | +0.21 | +0.10 | 2.2 | good |  |
| 112 | Hasted Assault | 14 | Class | magus | innate spell: Hasted Assault (rank 7) | +0.16 ± 0.06 | +0.17 | +0.14 | 1.0 | good |  |
| 113 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.15 ± 0.07 | +0.36 | −0.05 | 2.1 | good |  |
| 114 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | +0.15 ± 0.05 | +0.11 | +0.20 | 1.0 | good |  |
| 115 | Eidolon's Retort | 6 | Class | summoner | its eidolon's Retort (a Reactive Strike) | +0.15 ± 0.07 | +0.16 | +0.15 | 13.7 | good |  |
| 116 | Lastwall Sentry Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.15 ± 0.03 | +0.17 | +0.13 | 0.0 | good | with a weapon and a shield; the AI never used it |
| 117 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.15 ± 0.03 | +0.17 | +0.13 | 0.0 | good | with a weapon and a shield; the AI never used it |
| 118 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.15 ± 0.04 | +0.15 | +0.16 | 4.9 | good |  |
| 119 | Social Purview | 4 | Class | — | Beastmaster Dedication: its animal companion young (a bear, Commanded each turn) | +0.15 ± 0.05 | +0.01 | +0.29 | 6.4 | good |  |
| 120 | Fatal Shot | 18 | Class | — | Strike activity | +0.15 ± 0.04 | +0.20 | +0.10 | 3.8 | good |  |
| 121 | Interstitial Escape | 10 | Class | — | resistance 15 to a Strike's damage (once a fight, reaction) | +0.15 ± 0.04 | +0.19 | +0.11 | 0.8 | good |  |
| 122 | Basic Maneuver | 4 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.15 ± 0.03 | +0.21 | +0.09 | 0.0 | good | with a weapon and a shield; the AI never used it |
| 123 | Basic Defender | 4 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.15 ± 0.03 | +0.21 | +0.09 | 0.0 | good | with a weapon and a shield; the AI never used it |
| 124 | Goblin Jubilee Display | 10 | Class | — | Goblin Jubilee: save | +0.15 ± 0.05 | +0.20 | +0.10 | 0.9 | good |  |
| 125 | Mighty Wings | 18 | Class | — | a 25-foot fly Speed (against fliers) | +0.15 ± 0.06 | +0.10 | +0.19 | 0.0 | good | the AI never used it |
| 126 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.15 ± 0.05 | +0.15 | +0.15 | 0.0 | good | the AI never used it |
| 127 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.15 ± 0.04 | +0.12 | +0.17 | 4.9 | good |  |
| 128 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.14 ± 0.05 | +0.34 | −0.05 | 9.6 | good |  |
| 129 | Shattering Spellstrike | 4 | Class | magus | check | +0.14 ± 0.07 | +0.32 | −0.03 | 2.2 | good |  |
| 130 | Splendid Companion | 12 | Class | — | its animal companion incredible (against one mature) | +0.14 ± 0.04 | +0.17 | +0.11 | 8.3 | good |  |
| 131 | Hulking Size | 8 | Class | summoner | its eidolon Large, reach 10 feet | +0.14 ± 0.07 | +0.08 | +0.21 | 15.7 | no clear effect |  |
| 132 | Basic Kata | 4 | Class | — | Mountain Stance: PF2e's stance Effect | +0.14 ± 0.07 | +0.18 | +0.11 | 1.0 | good |  |
| 133 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.14 ± 0.03 | +0.23 | +0.05 | 0.3 | good |  |
| 134 | Specialized Companion (Ranger) | 16 | Class | ranger | its animal companion specialized (against one incredible) | +0.14 ± 0.04 | +0.11 | +0.17 | 13.8 | good |  |
| 135 | Animal Trainer Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.14 ± 0.05 | +0.29 | −0.01 | 6.1 | good |  |
| 136 | Undead Master Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.14 ± 0.05 | +0.29 | −0.01 | 6.1 | good |  |
| 137 | Legendary Rider | 20 | Class | — | quickened for its Command: its own three actions and its mount's two | +0.14 ± 0.04 | +0.23 | +0.06 | 9.1 | good |  |
| 138 | Just as Planned | 12 | Class | investigator | a Devise a Stratagem d20 rolled twice, once a fight | +0.14 ± 0.05 | +0.25 | +0.03 | 0.9 | good |  |
| 139 | Demon-Hunting Companion | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.14 ± 0.06 | +0.08 | +0.20 | 7.2 | good |  |
| 140 | Spirit Companion | 4 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.14 ± 0.06 | +0.08 | +0.20 | 7.2 | good |  |
| 141 | Devastating Duelist | 18 | Class | — | Strike activity | +0.14 ± 0.03 | +0.16 | +0.12 | 4.0 | good |  |
| 142 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.14 ± 0.06 | +0.12 | +0.15 | 4.0 | good | with two weapons (longsword and shortsword) |
| 143 | Repel Assault | 6 | Class | — | resistance equal to its level against a big hit, 3 a fight | +0.14 ± 0.03 | +0.17 | +0.10 | 1.3 | good |  |
| 144 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.13 ± 0.06 | +0.11 | +0.16 | 0.0 | good | the AI never used it |
| 145 | Defiant Banner | 8 | Class | commander | effect | +0.13 ± 0.07 | +0.05 | +0.21 | 4.0 | no clear effect |  |
| 146 | Direct Follower | 0 | Action | — | Strike activity | +0.13 ± 0.03 | +0.07 | +0.20 | 2.3 | good |  |
| 147 | Command an Animal | 0 | Action | — | Strike activity | +0.13 ± 0.03 | +0.07 | +0.20 | 2.3 | good |  |
| 148 | Whirlwind Stance | 10 | Class | — | effect | +0.13 ± 0.06 | +0.21 | +0.06 | 2.0 | good |  |
| 149 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.13 ± 0.06 | +0.16 | +0.10 | 1.0 | good |  |
| 150 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.13 ± 0.03 | +0.00 | +0.26 | 3.7 | good |  |
| 151 | Blazing Aura | 17 | Ancestry | — | save | +0.13 ± 0.04 | +0.11 | +0.15 | 1.0 | good |  |
| 152 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.13 ± 0.04 | +0.18 | +0.08 | 1.2 | good |  |
| 153 | Coordinated Distraction | 12 | Class | rogue | check | +0.13 ± 0.06 | +0.42 | −0.17 | 4.8 | good |  |
| 154 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | +0.13 ± 0.05 | +0.17 | +0.08 | 0.0 | good | the AI never used it |
| 155 | Mortification | 4 | Class | — | PF2e rules (always on) | +0.13 ± 0.05 | +0.17 | +0.08 | 0.0 | good | the AI never used it |
| 156 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.13 ± 0.06 | +0.17 | +0.08 | 3.5 | good |  |
| 157 | Ever-Vigilant Senses | 16 | Class | summoner | its eidolon's +2 Perception | +0.13 ± 0.08 | +0.09 | +0.16 | 15.4 | no clear effect |  |
| 158 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | +0.13 ± 0.05 | +0.20 | +0.05 | 0.0 | good | the AI never used it |
| 159 | Marked for Rebuke | 18 | Class | — | an Effect on a foe | +0.13 ± 0.05 | +0.28 | −0.03 | 4.1 | good |  |
| 160 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.13 ± 0.02 | +0.22 | +0.03 | 0.7 | good |  |
| 161 | Terrain Shield | 14 | Class | — | effect | +0.13 ± 0.02 | +0.22 | +0.03 | 0.7 | good |  |
| 162 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.13 ± 0.03 | +0.22 | +0.03 | 1.0 | good |  |
| 163 | Commander's Companion | 1 | Class | commander | its animal companion young (a bear, Commanded each turn) | +0.12 ± 0.07 | +0.25 | +0.00 | 9.1 | no clear effect |  |
| 164 | You Failed to Account For... This! | 16 | Class | inventor | its Crafting DC in place of its AC as it's targeted (reaction, when higher) | +0.12 ± 0.04 | +0.10 | +0.14 | 2.6 | good |  |
| 165 | Entity's Resurgence | 0 | Action | — | staying up at 0 Hit Points | +0.12 ± 0.03 | +0.20 | +0.05 | 0.3 | good |  |
| 166 | One-On-One | 12 | Class | — | a Feint and a Strike, taken as off-guard, once a round (the dueling sword not checked) | +0.12 ± 0.02 | +0.22 | +0.03 | 3.4 | good |  |
| 167 | Lantern Beam | 0 | Action | — | save (requirement assumed: Your lantern light is shining) | +0.12 ± 0.05 | +0.07 | +0.18 | 1.1 | good |  |
| 168 | Lightning Dash | 4 | Class | kineticist | save | +0.12 ± 0.08 | +0.28 | −0.04 | 2.1 | no clear effect |  |
| 169 | Paragon Companion | 14 | Class | inventor | its companion specialized, the bear's numbers (against one incredible) | +0.12 ± 0.04 | +0.14 | +0.11 | 11.2 | good |  |
| 170 | Bloom Cabaret Entrance | 10 | Class | — | goes last; each enemy a Will save (DC 27) or no reactions for a round (once a fight; its +2 to a skill check not played) | +0.12 ± 0.06 | +0.27 | −0.03 | 5.0 | no clear effect |  |
| 171 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.12 ± 0.06 | +0.25 | −0.01 | 2.1 | good |  |
| 172 | Incredible Beastmaster Companion | 8 | Class | — | its animal companion incredible (against one mature) | +0.12 ± 0.03 | +0.30 | −0.05 | 11.1 | good |  |
| 173 | Incredible Reanimated Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.12 ± 0.03 | +0.30 | −0.05 | 11.1 | good |  |
| 174 | Behold My Creation! | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.12 ± 0.03 | +0.30 | −0.05 | 11.1 | good |  |
| 175 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.12 ± 0.03 | +0.22 | +0.02 | 1.9 | good |  |
| 176 | Assassinate | 12 | Class | — | Strike activity (requirement assumed: You have designated a mark using Mark for Death and are completely unnoticed by your mark) | +0.12 ± 0.05 | +0.11 | +0.13 | 3.3 | good |  |
| 177 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.12 ± 0.07 | +0.29 | −0.05 | 2.6 | no clear effect |  |
| 178 | Adamantine Body | 8 | Class | — | effect | +0.11 ± 0.02 | +0.15 | +0.08 | 1.7 | good |  |
| 179 | Perfect Ki Expert | 10 | Class | — | innate spells: Unblinking Flame Aura (rank 5), Unbreaking Wave Vapor (rank 5), Unfolding Wind Buffet (rank 5), Untwisting Iron Roots (rank 5) | +0.11 ± 0.05 | +0.17 | +0.06 | 2.3 | good |  |
| 180 | Living Vessel Dedication | 2 | Class | — | Entity's Resurgence: staying up at 0 Hit Points | +0.11 ± 0.03 | +0.23 | +0.00 | 0.0 | good | the AI never used it |
| 181 | Perfect Strike | 4 | Class | — | innate spell: Perfect Strike (rank 2) | +0.11 ± 0.06 | +0.07 | +0.16 | 1.0 | no clear effect |  |
| 182 | Burning Cascade | 4 | Class | magus | its Arcane Cascade's extra damage on each enemy beside it as it enters the stance | +0.11 ± 0.07 | +0.13 | +0.09 | 1.6 | no clear effect |  |
| 183 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.11 ± 0.06 | +0.08 | +0.15 | 1.0 | no clear effect |  |
| 184 | Mature Beastmaster Companion | 4 | Class | — | its animal companion mature (against one young) | +0.11 ± 0.04 | +0.13 | +0.09 | 7.3 | good |  |
| 185 | Advanced Reanimated Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.11 ± 0.04 | +0.13 | +0.09 | 7.3 | good |  |
| 186 | Timeline-Splitting Spell | 18 | Class | — | once a fight, a slot spell with a save cast in two timelines: a second slot spent, the foe's save the worse of two (its third action not played) | +0.11 ± 0.05 | +0.07 | +0.15 | 1.0 | good |  |
| 187 | Thundering Roar | 0 | Action | — | inline save: 10-foot emanation, will, 4d8 sonic (DC 17) | +0.11 ± 0.04 | +0.04 | +0.18 | 0.6 | good |  |
| 188 | Diamond Fists | 18 | Class | monk | its unarmed attacks forceful and deadly d10 | +0.11 ± 0.05 | +0.22 | −0.01 | 0.0 | good | the AI never used it |
| 189 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.11 ± 0.05 | +0.05 | +0.17 | 3.1 | good |  |
| 190 | Gang Up | 6 | Class | rogue | passive-rules | +0.11 ± 0.03 | +0.16 | +0.05 | 0.0 | good |  |
| 191 | Certain Strike | 10 | Class | fighter | Strike activity | +0.11 ± 0.04 | +0.20 | +0.01 | 8.9 | good |  |
| 192 | Whirlwind Spell | 20 | Class | magus | a 3-action Spellstrike at each foe in reach, the spell on each it hits (a multi-target or area spell) | +0.11 ± 0.04 | +0.00 | +0.21 | 0.7 | good |  |
| 193 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.10 ± 0.07 | +0.11 | +0.10 | 2.3 | no clear effect |  |
| 194 | Loyal Warhorse | 6 | Class | champion | its animal companion mature (against one young) | +0.10 ± 0.04 | +0.22 | −0.01 | 9.7 | good |  |
| 195 | Raging Intimidation | 1 | Class | barbarian | Scare to Death: save | +0.10 ± 0.04 | +0.29 | −0.08 | 2.9 | good |  |
| 196 | Fortissimo Composition | 8 | Class | bard | Courageous Anthem at +2 for a round, the PC and its allies within 60 feet (once a fight) | +0.10 ± 0.03 | +0.19 | +0.02 | 5.0 | good |  |
| 197 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.10 ± 0.05 | +0.06 | +0.15 | 5.9 | good |  |
| 198 | Rallying Banner | 8 | Class | commander | check | +0.10 ± 0.06 | +0.13 | +0.08 | 0.9 | no clear effect |  |
| 199 | Jalmeri Heavenseeker Dedication | 4 | Class | — | Qi Spells: innate spell: Inner Upheaval (rank 1), Qi Rush (rank 1) | +0.10 ± 0.06 | +0.13 | +0.08 | 1.0 | no clear effect |  |
| 200 | Instinctive Obfuscation | 13 | Ancestry | — | an attack on it misses on a failed DC 10 flat check (reaction, once a fight) | +0.10 ± 0.03 | +0.19 | +0.01 | 0.7 | good |  |
| 201 | Ringmaster's Introduction | 20 | Class | bard | an ally's first turn quickened (reaction) | +0.10 ± 0.03 | +0.14 | +0.07 | 1.4 | good |  |
| 202 | I Meant to do That | 10 | Class | — | check | +0.10 ± 0.05 | +0.21 | −0.01 | 1.0 | no clear effect |  |
| 203 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.06 | +0.13 | +0.07 | 3.5 | no clear effect |  |
| 204 | Planar Sidestep | 13 | Ancestry | — | self effect | +0.10 ± 0.03 | +0.14 | +0.05 | 4.0 | minor |  |
| 205 | Viking Shieldbearer | 1 | Ancestry | — | Shield Block: Shield Block (reaction), a shield with it | +0.10 ± 0.03 | +0.06 | +0.14 | 0.0 | minor | the AI never used it |
| 206 | General Training | 1 | Ancestry | — | Shield Block: Shield Block (reaction), a shield with it | +0.10 ± 0.03 | +0.06 | +0.14 | 0.0 | minor | the AI never used it |
| 207 | Shield Block | 1 | General | — | Shield Block (reaction), a shield with it | +0.10 ± 0.03 | +0.06 | +0.14 | 0.0 | minor | the AI never used it |
| 208 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.10 ± 0.03 | +0.14 | +0.06 | 1.0 | minor |  |
| 209 | Drain Vitality | 10 | Class | — | check | +0.10 ± 0.05 | +0.14 | +0.06 | 0.9 | no clear effect |  |
| 210 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | +0.10 ± 0.05 | +0.09 | +0.10 | 1.0 | minor |  |
| 211 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.10 ± 0.05 | +0.10 | +0.09 | 0.0 | minor | the AI never used it |
| 212 | Perfect Ki Exemplar | 14 | Class | — | innate spells: Unblinking Flame Emblem (rank 7), Unbreaking Wave Barrier (rank 7), Unfolding Wind Blitz (rank 7), Untwisting Iron Augmentation (rank 7) | +0.10 ± 0.05 | +0.01 | +0.18 | 8.4 | no clear effect |  |
| 213 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.10 ± 0.02 | +0.11 | +0.08 | 0.0 | minor | the AI never used it |
| 214 | Clear as Air | 6 | Class | kineticist | check | +0.10 ± 0.07 | +0.38 | −0.18 | 2.1 | no clear effect |  |
| 215 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.10 ± 0.03 | +0.12 | +0.08 | 2.2 | minor |  |
| 216 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.10 ± 0.03 | +0.04 | +0.15 | 0.0 | minor | the AI never used it |
| 217 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.09 ± 0.02 | +0.13 | +0.06 | 2.1 | minor |  |
| 218 | Stitching Strike | 0 | Action | — | inline save: 1 creature, 30 feet, reflex, 6d6 slashing (DC 17, 1/fight) | +0.09 ± 0.04 | +0.10 | +0.09 | 1.0 | minor |  |
| 219 | Furious Grab | 12 | Class | barbarian | check | +0.09 ± 0.06 | +0.18 | +0.01 | 5.6 | no clear effect |  |
| 220 | Call the Hunt | 12 | Class | — | a foe in its reach off-guard to all until its next turn (1 action) | +0.09 ± 0.05 | +0.29 | −0.11 | 5.7 | no clear effect |  |
| 221 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.09 ± 0.04 | +0.15 | +0.03 | 0.0 | minor | the AI never used it |
| 222 | Dismounting Strike | 8 | Class | — | its mount's Stride, a leap off and a Strike with an extra weapon die (counts as two attacks) | +0.09 ± 0.04 | +0.12 | +0.06 | 12.3 | minor |  |
| 223 | Preemptive Reconfiguration | 9 | Ancestry | — | self effect | +0.09 ± 0.03 | +0.13 | +0.05 | 3.8 | minor |  |
| 224 | Skeletal Lancers | 14 | Class | — | 5 lancer thralls beside foes: a foe's Strike within 10 feet of one costs it 5 piercing (its focus spell, once a fight; the lancers' own Strikes not played) | +0.09 ± 0.06 | −0.10 | +0.28 | 1.0 | no clear effect |  |
| 225 | Borrow Time | 10 | Class | — | check | +0.09 ± 0.04 | +0.21 | −0.03 | 1.0 | minor |  |
| 226 | Basic Mysteries | 4 | Class | — | Nudge the Scales: heals 10 (30 feet) | +0.09 ± 0.05 | +0.21 | −0.03 | 3.6 | no clear effect |  |
| 227 | Promise of Pain | 10 | Class | — | save | +0.09 ± 0.06 | +0.17 | +0.02 | 1.0 | no clear effect |  |
| 228 | Soul Flare | 4 | Class | — | +1 AC against a hit (reaction) | +0.09 ± 0.03 | +0.13 | +0.05 | 0.3 | minor |  |
| 229 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.09 ± 0.05 | +0.16 | +0.02 | 0.5 | no clear effect |  |
| 230 | Mythic Strike | 10 | Class | — | a Strike at mythic proficiency, about +4 (a Mythic Point) | +0.09 ± 0.04 | +0.13 | +0.05 | 4.0 | minor |  |
| 231 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.09 ± 0.05 | +0.10 | +0.08 | 1.0 | no clear effect |  |
| 232 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.09 ± 0.06 | −0.03 | +0.21 | 0.7 | no clear effect |  |
| 233 | Rallying Anthem | 4 | Class | bard | innate spell: Rallying Anthem (rank 2) | +0.09 ± 0.03 | +0.13 | +0.05 | 7.5 | minor |  |
| 234 | Dragon Shape | 12 | Class | druid | Untamed Form's dragon shapes (Dragon Form, rank 6) (in Untamed Form) | +0.09 ± 0.08 | +0.18 | −0.01 | 1.0 | no clear effect |  |
| 235 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.09 ± 0.02 | +0.09 | +0.08 | 3.1 | minor |  |
| 236 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.09 ± 0.08 | +0.16 | +0.02 | 5.5 | no clear effect | with a loaded arquebus |
| 237 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 238 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 239 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 240 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 241 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 242 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 243 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | +0.09 ± 0.04 | +0.12 | +0.06 | 0.0 | minor | the AI never used it |
| 244 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.09 ± 0.02 | +0.09 | +0.08 | 1.0 | minor | always on (its moment isn't checked) |
| 245 | Divert Destiny | 6 | Class | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.11 | +0.06 | 0.1 | minor |  |
| 246 | Dirge of Doom | 6 | Class | bard | innate spell: Dirge of Doom (rank 3) | +0.09 ± 0.03 | +0.15 | +0.02 | 4.3 | minor |  |
| 247 | Imposing Destrier | 10 | Class | champion | its animal companion incredible (against one mature) | +0.09 ± 0.03 | +0.09 | +0.09 | 12.0 | minor |  |
| 248 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.09 ± 0.03 | +0.13 | +0.05 | 1.6 | minor |  |
| 249 | Reactive Resilience | 8 | Class | — | resistance 8 to one foe's damage (once a fight, reaction) | +0.09 ± 0.02 | +0.13 | +0.04 | 0.8 | minor |  |
| 250 | Infernal Anguish | 8 | Class | — | check | +0.09 ± 0.04 | +0.26 | −0.09 | 10.3 | minor |  |
| 251 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.08 ± 0.05 | −0.07 | +0.24 | 1.0 | no clear effect |  |
| 252 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.08 ± 0.05 | +0.08 | +0.09 | 7.2 | no clear effect |  |
| 253 | Edifying Trace | 8 | Class | — | an Effect on a foe | +0.08 ± 0.05 | +0.20 | −0.03 | 6.0 | no clear effect |  |
| 254 | Incredible Megafauna Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.08 ± 0.04 | +0.21 | −0.04 | 12.1 | minor |  |
| 255 | Incredible Mount | 8 | Class | — | its animal companion incredible (against one mature) | +0.08 ± 0.04 | +0.21 | −0.04 | 12.1 | minor |  |
| 256 | Incredible Dragon Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.08 ± 0.04 | +0.21 | −0.04 | 12.1 | minor |  |
| 257 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.08 ± 0.03 | +0.08 | +0.08 | 2.7 | minor |  |
| 258 | Head Stomp | 4 | Class | rogue | Strike activity | +0.08 ± 0.03 | +0.19 | −0.03 | 4.9 | minor |  |
| 259 | Mounted Shield | 6 | Class | — | its raised shield's bonus to its mount's AC too | +0.08 ± 0.04 | +0.04 | +0.12 | 10.0 | minor | with a weapon and a shield |
| 260 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.08 ± 0.08 | +0.07 | +0.10 | 0.0 | no clear effect | the AI never used it |
| 261 | Think Twice | 14 | Class | fighter | ac-reaction | +0.08 ± 0.03 | +0.15 | +0.01 | 1.9 | minor |  |
| 262 | Moon May | 1 | Ancestry | — | innate spell: Guidance (rank 1) | +0.08 ± 0.05 | +0.04 | +0.12 | 3.2 | no clear effect |  |
| 263 | Resilient Chassis | 5 | Ancestry | — | 4 temporary Hit Points against a hit (reaction, once a fight) | +0.08 ± 0.02 | +0.07 | +0.09 | 0.8 | minor |  |
| 264 | Lucky Escape | 4 | Class | — | an Effect on a foe | +0.08 ± 0.05 | +0.07 | +0.09 | 2.0 | no clear effect |  |
| 265 | Haft Beatdown | 10 | Class | fighter | four Strikes, two at its penalty and two one step worse (3 actions, once a fight) (in Haft Striker Stance) | +0.08 ± 0.04 | +0.12 | +0.04 | 1.0 | no clear effect |  |
| 266 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.08 ± 0.05 | +0.07 | +0.09 | 1.0 | no clear effect |  |
| 267 | In Lightning, Life | 4 | Class | — | 2d4 temporary Hit Points (1 action, once a fight; on itself) | +0.08 ± 0.05 | +0.03 | +0.13 | 1.0 | no clear effect |  |
| 268 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | +0.08 ± 0.05 | +0.18 | −0.02 | 1.0 | no clear effect |  |
| 269 | Shadowpiercing Charge | 12 | Class | — | its mount's double Stride and two Strikes at one multiple attack penalty (its extra damage in darkness not played) | +0.08 ± 0.03 | +0.11 | +0.05 | 10.8 | minor |  |
| 270 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | +0.08 ± 0.04 | +0.06 | +0.09 | 1.0 | no clear effect |  |
| 271 | Scour the Library | 10 | Class | psychic | self effect | +0.08 ± 0.04 | −0.05 | +0.20 | 3.0 | no clear effect |  |
| 272 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.08 ± 0.03 | +0.10 | +0.06 | 2.5 | minor |  |
| 273 | Acknowledge Fan | 12 | Class | — | save | +0.08 ± 0.04 | +0.12 | +0.03 | 3.3 | no clear effect |  |
| 274 | Collapse | 1 | Ancestry | — | a critical hit on it a normal hit, then collapsed till it Stands (once a fight) | +0.08 ± 0.02 | +0.06 | +0.09 | 0.2 | minor |  |
| 275 | Mature Dragon Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.08 ± 0.03 | +0.09 | +0.06 | 6.5 | minor |  |
| 276 | Impressive Mount | 4 | Class | — | its animal companion mature (against one young) | +0.08 ± 0.03 | +0.09 | +0.06 | 6.5 | minor |  |
| 277 | Skill Mastery | 8 | Class | — | Fane's Escape: check | +0.08 ± 0.04 | +0.13 | +0.02 | 2.0 | minor |  |
| 278 | Multitalented | 9 | Ancestry | — | Barbarian Dedication: Rage (+2 damage with its Greatsword) | +0.08 ± 0.05 | +0.14 | +0.01 | 1.0 | no clear effect |  |
| 279 | Take in the Catch | 12 | Class | — | Strike activity (requirement assumed: You're holding a net) | +0.07 ± 0.05 | +0.12 | +0.03 | 3.6 | no clear effect |  |
| 280 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.07 ± 0.03 | +0.07 | +0.08 | 3.9 | minor | with a one-handed weapon and a free hand |
| 281 | Unexpected Shift | 1 | Ancestry | — | resistance 1 to a foe's damage on a DC 16 flat check (reaction) | +0.07 ± 0.05 | +0.08 | +0.07 | 1.3 | no clear effect |  |
| 282 | Iomedae's Valor | 6 | Class | — | staying up at 0 Hit Points | +0.07 ± 0.02 | +0.10 | +0.05 | 0.1 | minor |  |
| 283 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.07 ± 0.05 | +0.14 | +0.01 | 3.4 | no clear effect |  |
| 284 | Throw and Catch | 18 | Class | — | a Strike at mythic proficiency and another, one multiple attack penalty (3 actions, a Mythic Point each) | +0.07 ± 0.05 | +0.14 | +0.01 | 2.9 | no clear effect |  |
| 285 | Army of One | 18 | Class | — | a Strike at each enemy within 30 feet, one multiple attack penalty (3 actions, a Mythic Point each) | +0.07 ± 0.02 | +0.00 | +0.14 | 2.6 | minor |  |
| 286 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.07 ± 0.04 | −0.00 | +0.14 | 0.8 | no clear effect |  |
| 287 | Living Nexus Dedication | 2 | Class | — | Overflowing Blade: Strike activity (requirement assumed: You are overflowing) | +0.07 ± 0.03 | +0.16 | −0.02 | 4.7 | minor |  |
| 288 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.07 ± 0.03 | −0.06 | +0.20 | 5.5 | minor |  |
| 289 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | +0.07 ± 0.06 | +0.15 | −0.01 | 1.0 | no clear effect |  |
| 290 | Ferocious Shape | 8 | Class | druid | Untamed Form's dinosaur shapes (Dinosaur Form, rank 4) (in Untamed Form) | +0.07 ± 0.04 | +0.12 | +0.02 | 1.0 | no clear effect |  |
| 291 | Close Contract | 10 | Class | — | effect (requirement assumed: You have completed your active course of action but haven't Dismissed it or chosen a new one) | +0.07 ± 0.06 | +0.08 | +0.06 | 1.0 | no clear effect |  |
| 292 | Ki Cutting Sight | 6 | Class | monk | Ki Cutting Sight: on a Perception success against its Fortitude DC, 4d10 slashing on the monk's next hit (a focus spell) | +0.07 ± 0.05 | +0.20 | −0.06 | 1.4 | no clear effect |  |
| 293 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.07 ± 0.04 | +0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 294 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.07 ± 0.02 | +0.09 | +0.05 | 1.0 | minor | always on (its moment isn't checked) |
| 295 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.07 ± 0.02 | +0.03 | +0.11 | 0.1 | minor |  |
| 296 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | +0.07 ± 0.05 | +0.07 | +0.07 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 297 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.07 ± 0.03 | +0.08 | +0.06 | 0.3 | minor | with a weapon and a shield |
| 298 | Mature Trained Companion | 6 | Class | — | its animal companion mature (against one young) | +0.07 ± 0.04 | +0.09 | +0.05 | 8.1 | no clear effect |  |
| 299 | Let My Creature Live! | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.07 ± 0.04 | +0.09 | +0.05 | 8.1 | no clear effect |  |
| 300 | Finish Their Story! | 20 | Class | — | a Strike at mythic proficiency, two weapon dice more, counting as two attacks (a Mythic Point each) | +0.07 ± 0.04 | +0.10 | +0.04 | 4.7 | no clear effect |  |
| 301 | Draw From the Land | 10 | Class | — | check | +0.07 ± 0.05 | +0.12 | +0.02 | 1.6 | no clear effect |  |
| 302 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.07 ± 0.07 | +0.08 | +0.05 | 0.7 | no clear effect |  |
| 303 | Sportlebore Choke | 8 | Class | — | save (requirement assumed: Your swarm is outside your body) | +0.07 ± 0.04 | +0.16 | −0.03 | 3.6 | no clear effect |  |
| 304 | Timber Sentinel | 1 | Class | kineticist | impulse: casts Protector Tree (rank 1, DC 17) | +0.07 ± 0.04 | +0.10 | +0.04 | 1.4 | no clear effect |  |
| 305 | Boarding Assault | 0 | Action | — | Strike activity | +0.07 ± 0.03 | −0.01 | +0.15 | 1.1 | minor |  |
| 306 | Scoundrel's Surprise | 4 | Class | rogue | check | +0.07 ± 0.04 | +0.19 | −0.06 | 3.2 | no clear effect |  |
| 307 | Reactive Dismissal | 4 | Class | summoner | its eidolon takes 8 less of a hit (reaction, once a fight; its unmanifesting after not played) | +0.07 ± 0.03 | +0.05 | +0.08 | 10.7 | minor |  |
| 308 | Fiend Slayer | 16 | Class | — | save | +0.07 ± 0.04 | +0.07 | +0.06 | 3.5 | no clear effect |  |
| 309 | Body of Air | 14 | Class | kineticist | resistance 8 against a hit (reaction, once a fight; the vapor's other effects not played) | +0.07 ± 0.04 | +0.06 | +0.07 | 0.9 | no clear effect |  |
| 310 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | +0.07 ± 0.03 | +0.01 | +0.12 | 1.2 | minor |  |
| 311 | Psi Burst | 2 | Class | psychic | save | +0.07 ± 0.04 | +0.03 | +0.10 | 4.5 | no clear effect |  |
| 312 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.07 ± 0.02 | +0.08 | +0.05 | 0.0 | minor | the AI never used it |
| 313 | Spray Ink | 1 | Ancestry | — | check | +0.07 ± 0.05 | +0.07 | +0.06 | 0.7 | no clear effect |  |
| 314 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.07 ± 0.03 | +0.07 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 315 | Quicken Heartbeat | 10 | Class | — | check | +0.07 ± 0.04 | +0.14 | −0.01 | 1.6 | no clear effect |  |
| 316 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.07 ± 0.06 | +0.16 | −0.03 | 1.0 | no clear effect |  |
| 317 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | +0.06 ± 0.04 | +0.13 | −0.00 | 1.1 | no clear effect |  |
| 318 | Mature Megafauna Companion | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.06 ± 0.04 | +0.11 | +0.02 | 8.2 | no clear effect |  |
| 319 | Phoenix's Flight | 16 | Class | — | innate spell: Monstrosity Form (rank 8) | +0.06 ± 0.07 | −0.17 | +0.30 | 1.0 | no clear effect |  |
| 320 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.06 ± 0.03 | +0.10 | +0.03 | 0.0 | minor | the AI never used it |
| 321 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | +0.06 ± 0.05 | +0.10 | +0.03 | 1.0 | no clear effect |  |
| 322 | Reap the Field | 0 | Action | — | Strike activity | +0.06 ± 0.02 | +0.00 | +0.13 | 1.1 | minor |  |
| 323 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.06 ± 0.02 | +0.05 | +0.07 | 0.0 | minor | the AI never used it |
| 324 | Targeting Strike | 10 | Class | commander | after its Set-Up Strike or Guiding Shot damages, the next ally's hit there deals its Intelligence in precision damage (in Set-Up Strike) | +0.06 ± 0.03 | +0.10 | +0.03 | 2.3 | minor |  |
| 325 | Dual-Handed Assault | 4 | Class | fighter | a Strike with its weapon die a step bigger | +0.06 ± 0.02 | +0.07 | +0.05 | 3.8 | minor | with a one-handed weapon and a free hand |
| 326 | Talmandor's Shout | 12 | Class | — | check | +0.06 ± 0.06 | +0.14 | −0.01 | 1.0 | no clear effect |  |
| 327 | Scurry! | 5 | Ancestry | — | a Stride into cover as initiative is rolled: +2 AC until the end of its first turn | +0.06 ± 0.02 | +0.05 | +0.07 | 1.0 | minor |  |
| 328 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | +0.06 ± 0.05 | +0.12 | +0.00 | 1.0 | no clear effect |  |
| 329 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.06 ± 0.07 | +0.06 | +0.06 | 4.7 | no clear effect | with two weapons (longsword and shortsword) |
| 330 | Bark and Tendril | 9 | Ancestry | — | innate spells: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.06 ± 0.03 | +0.01 | +0.12 | 5.2 | minor |  |
| 331 | Kizidhar Magic | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), One with Plants (rank 2) | +0.06 ± 0.03 | +0.01 | +0.12 | 5.2 | minor |  |
| 332 | Watch This! | 6 | Class | — | an ally's miss: its next turn's first weapon Strike deals twice its damage dice more (reaction; at whichever foe it Strikes) | +0.06 ± 0.02 | +0.12 | +0.00 | 1.9 | minor |  |
| 333 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.06 ± 0.03 | +0.07 | +0.05 | 1.6 | minor |  |
| 334 | Cringe | 1 | Ancestry | — | 3 less damage from a critical hit on it, each attacker once (reaction) | +0.06 ± 0.02 | +0.01 | +0.11 | 0.2 | minor |  |
| 335 | Gods' Palm | 8 | Class | — | Strike activity | +0.06 ± 0.02 | +0.05 | +0.07 | 3.4 | minor |  |
| 336 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | +0.06 ± 0.05 | +0.04 | +0.08 | 1.0 | no clear effect |  |
| 337 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.06 ± 0.04 | +0.06 | +0.06 | 0.8 | no clear effect |  |
| 338 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.06 ± 0.03 | +0.10 | +0.02 | 0.0 | minor | the AI never used it |
| 339 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.06 ± 0.02 | +0.00 | +0.12 | 2.2 | minor |  |
| 340 | The Tyrant Falls! | 20 | Class | — | self effect | +0.06 ± 0.06 | +0.07 | +0.05 | 1.0 | no clear effect |  |
| 341 | Pit of Snakes | 13 | Ancestry | — | save | +0.06 ± 0.02 | +0.04 | +0.08 | 0.7 | minor |  |
| 342 | Defender's Grit | 4 | Class | — | passive effect (always on) | +0.06 ± 0.02 | +0.06 | +0.06 | 1.0 | minor | always on (its moment isn't checked) |
| 343 | Follow-Up Strike | 6 | Class | — | after a missed melee Strike, another at the same penalty | +0.06 ± 0.02 | +0.12 | −0.00 | 1.6 | minor |  |
| 344 | Qlippoth Magic | 9 | Ancestry | — | innate spells: Blur (rank 2), Silence (rank 2) | +0.06 ± 0.05 | +0.12 | −0.00 | 1.0 | no clear effect |  |
| 345 | Garuda Magic | 9 | Ancestry | — | innate spells: Blur (rank 2), See the Unseen (rank 2) | +0.06 ± 0.05 | +0.12 | −0.00 | 1.0 | no clear effect |  |
| 346 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.06 ± 0.01 | +0.00 | +0.11 | 0.1 | minor |  |
| 347 | Shed Spirit | 0 | Action | — | inline save: 1 creature, 20 feet, will, 6d6 spirit (DC 17, 1/fight) | +0.06 ± 0.05 | +0.08 | +0.03 | 1.0 | no clear effect |  |
| 348 | Invented Vulnerability | 6 | Class | — | Deception against Will: weakness 5 to piercing for a round (1 action, once a fight) | +0.06 ± 0.04 | +0.07 | +0.05 | 1.6 | no clear effect |  |
| 349 | Shield of Reckoning | 10 | Class | champion | its Shield Block for the ally with its champion's reaction (once a round; its shield raised, forced) | +0.06 ± 0.05 | +0.09 | +0.02 | 0.4 | no clear effect |  |
| 350 | Mature Animal Companion (Druid) | 4 | Class | druid | its animal companion mature (against one young) | +0.06 ± 0.04 | +0.05 | +0.07 | 5.3 | no clear effect |  |
| 351 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.11 | +0.01 | 0.0 | minor | the AI never used it |
| 352 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | +0.06 ± 0.03 | +0.12 | −0.00 | 1.1 | no clear effect |  |
| 353 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | +0.06 ± 0.04 | +0.09 | +0.03 | 1.0 | no clear effect |  |
| 354 | Gruesome Strike | 12 | Class | champion | Strike activity (requirement assumed: Your Strikes currently deal extra damage from your champion's reaction) | +0.06 ± 0.05 | +0.03 | +0.08 | 14.3 | no clear effect |  |
| 355 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.06 ± 0.05 | +0.03 | +0.08 | 1.0 | no clear effect |  |
| 356 | High-Speed Regeneration | 6 | Class | — | check | +0.06 ± 0.02 | +0.10 | +0.01 | 2.7 | minor |  |
| 357 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.06 ± 0.02 | +0.07 | +0.04 | 0.7 | minor |  |
| 358 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | +0.06 ± 0.02 | +0.05 | +0.07 | 0.0 | minor | the AI never used it |
| 359 | Time Dilation Cascade | 20 | Class | ranger | six Strikes, multiple attack penalty as normal (3 actions, flourish) | +0.05 ± 0.07 | −0.10 | +0.21 | 5.1 | no clear effect |  |
| 360 | Gaping Flesh | 5 | Ancestry | — | save | +0.05 ± 0.03 | +0.08 | +0.03 | 0.7 | minor |  |
| 361 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.05 ± 0.04 | +0.10 | +0.01 | 1.0 | no clear effect |  |
| 362 | Ambersoul | 1 | Ancestry | — | a foe's slashing or piercing melee hit on it: that foe -1 to attacks | +0.05 ± 0.02 | +0.06 | +0.04 | 1.4 | minor |  |
| 363 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.09 | +0.02 | 1.0 | no clear effect |  |
| 364 | Implement's Assault | 18 | Class | thaumaturge | a Strike at each enemy within 30 feet (3 actions) | +0.05 ± 0.07 | +0.00 | +0.11 | 3.5 | no clear effect |  |
| 365 | Bonekeeper's Bane | 13 | Ancestry | — | a foe starting its turn beside it: Will save or -1 status to its attacks (once each foe) | +0.05 ± 0.03 | +0.08 | +0.02 | 2.6 | no clear effect |  |
| 366 | Imprison Foe | 18 | Class | — | save | +0.05 ± 0.04 | +0.09 | +0.02 | 2.8 | no clear effect |  |
| 367 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.05 ± 0.04 | −0.02 | +0.13 | 0.9 | no clear effect |  |
| 368 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.05 ± 0.03 | +0.11 | +0.00 | 1.6 | no clear effect |  |
| 369 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | +0.05 ± 0.03 | +0.06 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 370 | World-Breaking Footfall | 14 | Class | monk | save (requirement assumed: You are in Kaiju Stance and are touching the ground) | +0.05 ± 0.03 | +0.09 | +0.01 | 0.4 | no clear effect |  |
| 371 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | +0.05 ± 0.05 | −0.01 | +0.11 | 1.0 | no clear effect |  |
| 372 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | +0.05 ± 0.07 | +0.18 | −0.07 | 1.1 | no clear effect |  |
| 373 | Stand for the Fallen | 18 | Class | — | an ally's blow that would drop it taken itself after two Strides, resistance of its level to it (reaction) | +0.05 ± 0.01 | +0.09 | +0.01 | 0.1 | minor |  |
| 374 | Overflowing Blade | 0 | Action | — | Strike activity (requirement assumed: You are overflowing) | +0.05 ± 0.02 | +0.05 | +0.06 | 3.5 | minor |  |
| 375 | Call Worm Spirit | 10 | Class | — | save | +0.05 ± 0.06 | −0.00 | +0.11 | 1.0 | no clear effect |  |
| 376 | Drifting Pollen | 8 | Class | kineticist | save | +0.05 ± 0.05 | +0.14 | −0.04 | 3.7 | no clear effect |  |
| 377 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | +0.05 ± 0.05 | +0.06 | +0.05 | 1.0 | no clear effect |  |
| 378 | Feral Lunge | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | +0.05 ± 0.06 | +0.09 | +0.02 | 2.6 | no clear effect |  |
| 379 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.05 ± 0.02 | +0.00 | +0.10 | 0.9 | minor |  |
| 380 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.03 | +0.05 | +0.05 | 1.6 | no clear effect |  |
| 381 | Body Shield | 4 | Class | — | +2 AC against an attack (reaction) | +0.05 ± 0.02 | +0.08 | +0.02 | 1.3 | minor |  |
| 382 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.2 | minor |  |
| 383 | Flower Chimera | 13 | Ancestry | — | innate spell: Spiritual Guardian (rank 5) | +0.05 ± 0.03 | +0.06 | +0.04 | 6.7 | no clear effect |  |
| 384 | Ancestral Form | 9 | Ancestry | — | innate spell: Animal Form (rank 3) | +0.05 ± 0.05 | −0.11 | +0.22 | 1.0 | no clear effect |  |
| 385 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.09 | +0.01 | 0.1 | minor |  |
| 386 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.03 | +0.12 | −0.02 | 2.5 | no clear effect |  |
| 387 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.05 ± 0.04 | +0.05 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 388 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.05 ± 0.02 | +0.03 | +0.07 | 0.0 | minor | the AI never used it |
| 389 | Talon Sweep | 4 | Class | — | a melee Strike back at a flanking foe that misses it (reaction) | +0.05 ± 0.02 | +0.00 | +0.10 | 0.9 | no clear effect |  |
| 390 | Quicksoul | 1 | Ancestry | — | Toxic Touch: a Strike, 1d6 persistent poison and sickened 1 on a hit (once a fight; its Tumble Through taken as made) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect |  |
| 391 | Twin Distraction | 4 | Class | rogue | Twin Feint (forced); both Strikes hit: a Will save or stupefied 1 | +0.05 ± 0.03 | +0.10 | +0.00 | 2.5 | no clear effect | with two weapons (longsword and shortsword) |
| 392 | Apocalyptic Visions | 18 | Class | — | save | +0.05 ± 0.05 | +0.12 | −0.03 | 1.0 | no clear effect |  |
| 393 | Inscribed Blast | 5 | Ancestry | — | check | +0.05 ± 0.03 | +0.10 | −0.00 | 1.1 | no clear effect |  |
| 394 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | +0.05 ± 0.04 | +0.09 | +0.01 | 0.9 | no clear effect |  |
| 395 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.05 ± 0.01 | +0.00 | +0.10 | 2.6 | no clear effect |  |
| 396 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.05 ± 0.02 | +0.08 | +0.02 | 3.5 | no clear effect | with a one-handed weapon and a free hand |
| 397 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.05 ± 0.02 | +0.07 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 398 | Resist Ruin | 13 | Ancestry | — | innate spell: False Vitality (rank 5) | +0.05 ± 0.03 | +0.04 | +0.06 | 1.0 | no clear effect |  |
| 399 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.01 | +0.03 | +0.07 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 400 | Sword of Sealing | 12 | Class | — | a melee Strike; on a hit Fortitude or immobilized (played as 2 rounds) | +0.05 ± 0.04 | +0.04 | +0.05 | 12.3 | no clear effect |  |
| 401 | Deadly Strikes | 20 | Class | monk | its unarmed attacks deadly d10 | +0.05 ± 0.03 | +0.03 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 402 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.05 ± 0.03 | +0.07 | +0.02 | 0.4 | no clear effect |  |
| 403 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | +0.05 ± 0.05 | +0.13 | −0.04 | 2.0 | no clear effect |  |
| 404 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | +0.05 ± 0.05 | +0.11 | −0.01 | 1.1 | no clear effect |  |
| 405 | Call From Death's Door | 10 | Class | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.09 | +0.00 | 0.2 | no clear effect |  |
| 406 | Corpse Stench | 12 | Class | — | a foe starting its turn in it sickened 1 on a failed Fortitude save (DC 31) in a 10-foot aura (1 action to start, the fight) | +0.05 ± 0.02 | +0.05 | +0.05 | 1.7 | no clear effect |  |
| 407 | Selfless Parry | 8 | Class | — | allies beside it +1 AC while it's in Dueling Parry (Dueling Riposte for them not played) (in Dueling Parry) | +0.05 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 408 | Willing Death | 1 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.09 | +0.00 | 0.2 | no clear effect |  |
| 409 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.05 ± 0.04 | +0.03 | +0.06 | 3.5 | no clear effect |  |
| 410 | Murderer's Circle | 14 | Class | — | a Strike, then the target off-guard to the next one this turn | +0.05 ± 0.02 | +0.05 | +0.04 | 10.9 | no clear effect |  |
| 411 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.05 ± 0.04 | +0.06 | +0.03 | 1.8 | no clear effect |  |
| 412 | Anthemic Performance | 8 | Class | — | innate spell: Courageous Anthem (rank 4) | +0.05 ± 0.02 | +0.00 | +0.09 | 2.9 | no clear effect |  |
| 413 | Volcanic Escape | 6 | Class | kineticist | 1d6 fire, basic Reflex DC 22, at a foe beside it that damages it (reaction) | +0.05 ± 0.07 | +0.07 | +0.02 | 2.5 | no clear effect |  |
| 414 | Spiteful Rake | 13 | Ancestry | — | a 2-action melee Strike: dazzled a round, blinded on a critical hit (its best melee Strike for the claw) | +0.05 ± 0.04 | +0.15 | −0.06 | 6.1 | no clear effect |  |
| 415 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.04 ± 0.01 | +0.09 | +0.00 | 0.2 | no clear effect |  |
| 416 | Reflective Defense | 1 | Ancestry | — | a foe attacking it dazzled on a failed Reflex save (DC 17; reaction, once a fight) | +0.04 ± 0.05 | +0.10 | −0.01 | 1.0 | no clear effect |  |
| 417 | Walk Through the Conflagration | 14 | Class | kineticist | save | +0.04 ± 0.04 | +0.05 | +0.04 | 0.2 | no clear effect |  |
| 418 | Pirouette | 6 | Class | bard | +2 AC as a reaction when targeted (in Masquerade of Seasons Stance) | +0.04 ± 0.01 | +0.03 | +0.06 | 1.6 | no clear effect |  |
| 419 | Aristocratic Arms | 4 | Class | — | For My House!: self effect | +0.04 ± 0.02 | +0.04 | +0.05 | 2.5 | no clear effect |  |
| 420 | Warp Likeness | 5 | Ancestry | — | a melee hit's Fortitude save: clumsy 1, sickened 1 or 2 (once a fight; its own action not spent) | +0.04 ± 0.03 | +0.09 | −0.00 | 2.5 | no clear effect |  |
| 421 | You're Next | 1 | Class | rogue | downing a foe: a Demoralize at another, +2 (reaction) | +0.04 ± 0.02 | +0.00 | +0.09 | 1.7 | no clear effect |  |
| 422 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.04 ± 0.03 | +0.02 | +0.07 | 0.6 | no clear effect |  |
| 423 | Solar Detonation | 8 | Class | kineticist | save | +0.04 ± 0.04 | +0.01 | +0.07 | 0.6 | no clear effect |  |
| 424 | Final Spite | 8 | Class | — | save | +0.04 ± 0.03 | −0.01 | +0.09 | 1.0 | no clear effect |  |
| 425 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.04 ± 0.01 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 426 | Shattering Shot | 12 | Class | gunslinger | save | +0.04 ± 0.08 | −0.08 | +0.16 | 10.3 | no clear effect |  |
| 427 | Sacred Defense | 7 | Skill | — | 5 temporary Hit Points (1 action, once a fight; its DC 30 check played as a success) | +0.04 ± 0.03 | +0.07 | +0.02 | 1.0 | no clear effect |  |
| 428 | Everstand Strike | 4 | Class | champion | a press Strike, its shield raised if it hits | +0.04 ± 0.04 | +0.04 | +0.04 | 4.6 | no clear effect |  |
| 429 | Basic Flair | 4 | Class | — | You're Next: downing a foe: a Demoralize at another, +2 (reaction) | +0.04 ± 0.02 | +0.00 | +0.09 | 1.6 | no clear effect |  |
| 430 | Basic Trickery | 4 | Class | — | You're Next: downing a foe: a Demoralize at another, +2 (reaction) | +0.04 ± 0.02 | +0.00 | +0.09 | 1.6 | no clear effect |  |
| 431 | Mountain Stronghold | 6 | Class | monk | effect (requirement assumed: You are in Mountain Stance You focus on your connection to the earth and call upon the mountain to block attacks against you) | +0.04 ± 0.06 | +0.13 | −0.05 | 3.7 | no clear effect |  |
| 432 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.04 ± 0.04 | +0.05 | +0.04 | 2.8 | no clear effect |  |
| 433 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.04 ± 0.03 | +0.09 | −0.00 | 2.2 | no clear effect |  |
| 434 | Primal Howl | 10 | Class | druid | its companion's Primal Howl (30-foot cone, fortitude, 5d6 sonic (DC 29, 1/fight)) | +0.04 ± 0.03 | +0.06 | +0.03 | 7.2 | no clear effect |  |
| 435 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | +0.04 ± 0.04 | +0.10 | −0.01 | 1.0 | no clear effect | with a weapon and a shield |
| 436 | Blade of Law | 12 | Class | — | a Strike at a foe that attacked it since its last turn: an extra weapon die and 1d8 spirit (2 actions, two attacks) | +0.04 ± 0.04 | +0.09 | −0.01 | 2.4 | no clear effect |  |
| 437 | Unbelievable Interception | 8 | Class | — | an ally's Strike damage taken after two Strides (reaction, a Mythic Point each) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.4 | no clear effect |  |
| 438 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | +0.04 ± 0.02 | +0.02 | +0.06 | 0.3 | no clear effect |  |
| 439 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.02 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 440 | Predictable! | 4 | Class | rogue | +1 AC and saves until its next turn (1 action; its Perception check played as a success) | +0.04 ± 0.04 | +0.05 | +0.03 | 2.5 | no clear effect |  |
| 441 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.04 ± 0.04 | +0.01 | +0.07 | 0.9 | no clear effect |  |
| 442 | Clockwork Celerity | 6 | Class | inventor | quickened at its turn's start until a DC 17 flat check fails (unstable) | +0.04 ± 0.06 | −0.01 | +0.09 | 1.2 | no clear effect |  |
| 443 | Temporal Fury | 14 | Class | — | two Strikes for two actions (a Mythic Point) | +0.04 ± 0.01 | +0.02 | +0.06 | 3.0 | no clear effect |  |
| 444 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.04 ± 0.01 | +0.03 | +0.05 | 0.5 | no clear effect |  |
| 445 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.04 ± 0.03 | +0.01 | +0.07 | 1.8 | no clear effect | with a loaded arquebus |
| 446 | Death Drone | 0 | Action | — | save | +0.04 ± 0.05 | +0.11 | −0.03 | 1.5 | no clear effect |  |
| 447 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.04 ± 0.06 | +0.05 | +0.03 | 5.1 | no clear effect |  |
| 448 | Auspicious Mount | 16 | Class | champion | its animal companion specialized (against one incredible) | +0.04 ± 0.04 | +0.09 | −0.02 | 10.2 | no clear effect |  |
| 449 | Armor Break | 12 | Class | guardian | save | +0.04 ± 0.04 | −0.03 | +0.11 | 1.3 | no clear effect |  |
| 450 | Hasty Celebration | 5 | Ancestry | — | +2 to attack and damage rolls when it critically hits (reaction; its own off-guard not played), the PC and its allies within 60 feet (once a fight) | +0.04 ± 0.02 | +0.06 | +0.02 | 2.6 | no clear effect |  |
| 451 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.04 ± 0.07 | +0.03 | +0.05 | 1.1 | no clear effect |  |
| 452 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | +0.04 ± 0.04 | −0.01 | +0.09 | 0.0 | no clear effect | the AI never used it |
| 453 | Defensive Needles | 5 | Ancestry | — | 2 piercing to a foe that hits it with an unarmed attack | +0.04 ± 0.02 | +0.03 | +0.05 | 1.6 | no clear effect |  |
| 454 | Histrionic Injury | 5 | Ancestry | — | save | +0.04 ± 0.03 | +0.07 | +0.00 | 0.7 | no clear effect |  |
| 455 | Timely Dodge | 0 | Action | — | ac-reaction | +0.04 ± 0.02 | +0.05 | +0.03 | 1.4 | no clear effect |  |
| 456 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.04 ± 0.01 | +0.05 | +0.02 | 0.1 | no clear effect |  |
| 457 | Lethal Edge | 10 | Class | — | check | +0.04 ± 0.04 | +0.05 | +0.03 | 7.0 | no clear effect |  |
| 458 | Burning Demand | 12 | Class | kineticist | save | +0.04 ± 0.03 | +0.09 | −0.01 | 1.2 | no clear effect |  |
| 459 | Artokus's Fire | 6 | Class | alchemist | 1d4 more persistent fire on a bomb's hit (always on; its harder flat check not played) | +0.04 ± 0.03 | +0.03 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 460 | Portents of the Haruspex | 4 | Class | witch | a creature dropping nearby: a d12 damage type, a foe's next damage of it with weakness of its level (reaction) | +0.04 ± 0.02 | −0.00 | +0.08 | 2.7 | no clear effect |  |
| 461 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | +0.04 ± 0.04 | +0.10 | −0.02 | 0.8 | no clear effect |  |
| 462 | Heroic Recovery | 10 | Class | cleric | an action before each single-target Heal on an ally: +1 status to its attacks and damage till the end of its next turn | +0.04 ± 0.02 | +0.08 | −0.01 | 0.8 | no clear effect |  |
| 463 | Portentous Spell | 16 | Class | oracle | Portentous Spell copies of 32 spells | +0.04 ± 0.08 | −0.14 | +0.22 | 3.2 | no clear effect |  |
| 464 | The World Devours | 12 | Class | — | save (requirement assumed: Your waking world is active) | +0.04 ± 0.03 | +0.00 | +0.07 | 1.4 | no clear effect |  |
| 465 | Dread Marshal Stance | 4 | Class | — | +2 status to damage for it and the allies beside it (stance) | +0.04 ± 0.04 | +0.02 | +0.06 | 1.2 | no clear effect |  |
| 466 | Doom of Sailors | 17 | Ancestry | — | save | +0.04 ± 0.04 | +0.04 | +0.04 | 1.0 | no clear effect |  |
| 467 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.04 ± 0.05 | +0.15 | −0.07 | 2.5 | no clear effect |  |
| 468 | Alchemical Shot | 4 | Class | gunslinger | a ranged Strike with a bomb's persistent damage (the bomb and the misfire not played) | +0.04 ± 0.06 | −0.00 | +0.08 | 3.2 | no clear effect |  |
| 469 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | +0.04 ± 0.06 | +0.03 | +0.04 | 2.0 | no clear effect |  |
| 470 | Sickening Bite | 8 | Class | — | its jaws' critical hits sicken 1 | +0.04 ± 0.02 | +0.04 | +0.04 | 2.8 | no clear effect | with jaws |
| 471 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | +0.04 ± 0.04 | +0.01 | +0.06 | 1.0 | no clear effect |  |
| 472 | Slip the Grasp | 9 | Ancestry | — | Strike activity (requirement assumed: You are Grabbed, Immobilized, or Restrained) | +0.04 ± 0.04 | +0.02 | +0.05 | 3.0 | no clear effect |  |
| 473 | Prescience | 4 | Class | — | +6 to initiative (mythic proficiency, a Mythic Point) | +0.04 ± 0.04 | −0.04 | +0.11 | 0.0 | no clear effect | the AI never used it |
| 474 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | +0.04 ± 0.05 | +0.06 | +0.01 | 1.0 | no clear effect |  |
| 475 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.04 ± 0.03 | +0.04 | +0.03 | 1.0 | no clear effect |  |
| 476 | Cranial Detonation | 18 | Class | psychic | save | +0.04 ± 0.02 | +0.00 | +0.07 | 0.7 | no clear effect |  |
| 477 | Laughing Kholo | 9 | Ancestry | — | Battle Cry: a free Demoralize as the fight begins | +0.04 ± 0.06 | +0.07 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | +0.04 ± 0.03 | +0.07 | +0.00 | 1.7 | no clear effect |  |
| 479 | Specialized Companion (Animal Trainer) | 18 | Class | — | its animal companion specialized (against one incredible) | +0.04 ± 0.03 | +0.01 | +0.06 | 10.9 | no clear effect |  |
| 480 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | +0.04 ± 0.04 | −0.05 | +0.12 | 0.9 | no clear effect |  |
| 481 | Deliberate Death | 1 | Ancestry | — | a melee Strike at the foe that drops it (reaction, once) | +0.04 ± 0.01 | +0.07 | −0.00 | 0.3 | no clear effect |  |
| 482 | Hone Claws | 9 | Ancestry | — | 1d6 bleed on its next hit (1 action, once a fight) | +0.04 ± 0.05 | +0.06 | +0.01 | 1.0 | no clear effect |  |
| 483 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | +0.04 ± 0.05 | +0.10 | −0.03 | 2.5 | no clear effect | with a one-handed weapon and a free hand |
| 484 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.04 ± 0.01 | +0.01 | +0.06 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 485 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.04 ± 0.04 | +0.04 | +0.03 | 10.2 | no clear effect | with a one-handed weapon and a free hand |
| 486 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | +0.04 ± 0.04 | +0.03 | +0.04 | 0.9 | no clear effect |  |
| 487 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.03 ± 0.04 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 488 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.03 ± 0.01 | +0.01 | +0.06 | 0.3 | no clear effect |  |
| 489 | Nimble Dodge | 1 | Class | rogue | +2 AC as a reaction when targeted | +0.03 ± 0.01 | +0.03 | +0.04 | 0.8 | no clear effect |  |
| 490 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.03 ± 0.02 | +0.01 | +0.06 | 1.8 | no clear effect |  |
| 491 | Mountain Quake | 14 | Class | monk | save (requirement assumed: You are in Mountain Stance You stomp, shaking the earth beneath you) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.2 | no clear effect |  |
| 492 | Celestial Armaments | 16 | Class | — | 1d8 spirit on its Strikes; a critical hit, Fortitude or blinded (always on) | +0.03 ± 0.05 | +0.08 | −0.01 | 5.4 | no clear effect |  |
| 493 | Forge-Blessed Shot | 17 | Ancestry | — | +2 to its next Strike, once a fight (free) | +0.03 ± 0.02 | +0.05 | +0.02 | 1.0 | no clear effect |  |
| 494 | Energy Ablation | 2 | Class | wizard | Energy Ablation copies of 5 damage spells: resistance of the spell's rank to the foes' main energy damage (fire if none) till the end of its next turn | +0.03 ± 0.04 | −0.02 | +0.09 | 3.7 | no clear effect |  |
| 495 | Sheltering Jewel | 13 | Ancestry | — | innate spell: Vital Beacon (rank 5) | +0.03 ± 0.03 | +0.02 | +0.05 | 0.8 | no clear effect |  |
| 496 | Abjure Harm | 16 | Class | — | an enemy's critical hit a regular hit (reaction, a Mythic Point each) | +0.03 ± 0.02 | +0.04 | +0.03 | 0.3 | no clear effect |  |
| 497 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.5 | no clear effect |  |
| 498 | Forewarn | 12 | Class | — | an ally's AC as its Perception DC against a hit, when higher (reaction) | +0.03 ± 0.01 | +0.01 | +0.06 | 0.3 | no clear effect |  |
| 499 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | +0.03 ± 0.07 | +0.14 | −0.07 | 1.0 | no clear effect |  |
| 500 | Aldori Parry | 4 | Class | — | self effect | +0.03 ± 0.05 | +0.02 | +0.05 | 2.8 | no clear effect |  |
| 501 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | +0.03 ± 0.02 | −0.01 | +0.07 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 502 | Roll with It | 9 | Ancestry | — | half the damage of a melee hit that would drop it (reaction, once a fight; its stunned and move not played) | +0.03 ± 0.02 | +0.06 | +0.00 | 0.1 | no clear effect |  |
| 503 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.03 ± 0.04 | −0.00 | +0.07 | 1.9 | no clear effect | with two weapons (longsword and shortsword) |
| 504 | Combat Grab | 2 | Class | fighter | a press Strike that grabs on a hit | +0.03 ± 0.02 | +0.08 | −0.02 | 3.1 | no clear effect | with a one-handed weapon and a free hand |
| 505 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.02 | +0.06 | +0.00 | 1.6 | no clear effect |  |
| 506 | Snakebird's Shadow | 8 | Class | monk | a Strike at up to two foes in a 15-foot line (its stance not checked) | +0.03 ± 0.03 | +0.00 | +0.06 | 2.2 | no clear effect |  |
| 507 | Discerning Strike | 6 | Class | — | a Strike with 1d6 precision on a hit (once a fight; its Recall Knowledge taken as made) | +0.03 ± 0.04 | +0.00 | +0.06 | 1.0 | no clear effect |  |
| 508 | Umbra Ally | 13 | Ancestry | — | a foe beside it off-guard to its attacks till its next turn (1 action, once a fight) | +0.03 ± 0.03 | +0.10 | −0.03 | 1.0 | no clear effect |  |
| 509 | Coordinated Charge | 12 | Class | — | Strike activity | +0.03 ± 0.03 | +0.01 | +0.05 | 1.9 | no clear effect |  |
| 510 | Break Free | 0 | Action | — | Strike activity | +0.03 ± 0.03 | −0.00 | +0.06 | 0.9 | no clear effect |  |
| 511 | Strix Vengeance | 5 | Ancestry | — | a foe's critical hit on it: its Strikes at that foe 1d6 to 3d6 precision more till its next turn ends (reaction, once) | +0.03 ± 0.01 | +0.03 | +0.03 | 0.3 | no clear effect |  |
| 512 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.03 | +0.02 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 513 | Exploit Opening | 6 | Class | — | a ranged Strike (+2) when an ally critically hits (reaction) | +0.03 ± 0.02 | +0.04 | +0.02 | 0.5 | no clear effect |  |
| 514 | Duelist's Edge | 4 | Class | — | +2 to its initiative | +0.03 ± 0.03 | −0.02 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 515 | Unnerving Prowess | 6 | Class | — | a free Demoralize at the foe it critically hits, or hits on its first turn (any weapon taken as its Aldori dueling sword; Disarm not played) | +0.03 ± 0.05 | +0.00 | +0.06 | 3.1 | no clear effect |  |
| 516 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.03 | +0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 517 | Shoulder Catastrophe | 12 | Class | — | a foe's critical Strike on an ally beside it: normal damage to both instead (reaction) | +0.03 ± 0.02 | +0.07 | −0.01 | 0.1 | no clear effect |  |
| 518 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.03 ± 0.01 | +0.00 | +0.06 | 0.1 | no clear effect |  |
| 519 | Master Strike | 0 | Action | rogue | save | +0.03 ± 0.02 | +0.05 | +0.00 | 1.1 | no clear effect |  |
| 520 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.03 ± 0.03 | +0.02 | +0.04 | 1.3 | no clear effect |  |
| 521 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.03 ± 0.03 | +0.02 | +0.04 | 1.3 | no clear effect |  |
| 522 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.03 ± 0.03 | +0.02 | +0.04 | 1.3 | no clear effect |  |
| 523 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.03 ± 0.01 | +0.04 | +0.02 | 0.5 | no clear effect |  |
| 524 | Aldori Riposte | 6 | Class | — | a riposte Strike on a critical miss (reaction) | +0.03 ± 0.03 | −0.00 | +0.06 | 1.0 | no clear effect |  |
| 525 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.03 ± 0.03 | −0.00 | +0.06 | 1.0 | no clear effect |  |
| 526 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | +0.03 ± 0.03 | +0.02 | +0.03 | 1.3 | no clear effect |  |
| 527 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | +0.03 ± 0.03 | +0.02 | +0.03 | 1.3 | no clear effect |  |
| 528 | Great Cleave | 10 | Class | barbarian | Cleave, going on while each Strike drops its creature (reaction) | +0.03 ± 0.01 | +0.00 | +0.06 | 0.8 | no clear effect |  |
| 529 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.03 ± 0.02 | +0.00 | +0.06 | 1.7 | no clear effect |  |
| 530 | Living Fortification | 0 | Action | gunslinger | effect | +0.03 ± 0.02 | +0.02 | +0.04 | 1.0 | no clear effect |  |
| 531 | United Assault | 2 | Class | fighter | a flourish Strike, +1 damage for each other creature that hurt the target since its last turn (up to +4) | +0.03 ± 0.01 | +0.04 | +0.01 | 2.3 | no clear effect |  |
| 532 | Broken Chain Dedication | 12 | Class | — | Ultimatum of Liberation: save | +0.03 ± 0.05 | +0.10 | −0.05 | 1.0 | no clear effect |  |
| 533 | Tragic Lament | 18 | Class | — | save | +0.03 ± 0.02 | +0.03 | +0.02 | 0.3 | no clear effect |  |
| 534 | Foreseen Failure | 12 | Class | psychic | once a fight, a slot spell every target critically saves against: its actions back (as that many more next turn) | +0.03 ± 0.02 | +0.06 | +0.00 | 0.4 | no clear effect |  |
| 535 | Spell Crash | 6 | Class | magus | a rank-3 slot spent on a 20-foot emanation: 3d10 force, basic Reflex (2 actions) | +0.03 ± 0.05 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 536 | Deadly Grace | 16 | Class | swashbuckler | its agile or finesse melee weapon's deadly dice doubled (deadly d8 on one without) | +0.03 ± 0.03 | +0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 537 | Viking Weapon Familiarity | 4 | Class | — | Shield Block: Shield Block (reaction), a shield with it | +0.03 ± 0.02 | −0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 538 | Sea Swarmer | 9 | Ancestry | — | a foe in its reach and two allies' reach is off-guard to it | +0.03 ± 0.02 | +0.06 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.04 | +0.02 | 2.2 | no clear effect |  |
| 540 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.03 ± 0.02 | +0.04 | +0.02 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 541 | Guiding Shot | 2 | Class | commander | a ranged Strike, +1 to the next ally's attack at its target | +0.03 ± 0.05 | +0.04 | +0.01 | 2.7 | no clear effect | with a loaded arquebus |
| 542 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | +0.03 ± 0.04 | +0.10 | −0.04 | 1.4 | no clear effect |  |
| 543 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.03 ± 0.01 | +0.01 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 544 | Noble Bloom | 5 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.03 ± 0.01 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 545 | Wiles on the Wind | 12 | Class | kineticist | save | +0.03 ± 0.03 | +0.07 | −0.01 | 0.1 | no clear effect |  |
| 546 | Hell's Armaments | 12 | Class | — | a Fortitude save on a critical hit: −10 feet Speed, slowed 1 or 2 (always on) | +0.03 ± 0.03 | +0.02 | +0.03 | 3.5 | no clear effect |  |
| 547 | Cautious Word | 12 | Class | — | check | +0.03 ± 0.05 | −0.00 | +0.05 | 5.3 | no clear effect |  |
| 548 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | +0.03 ± 0.04 | +0.05 | −0.00 | 3.0 | no clear effect |  |
| 549 | Glacial Prison | 12 | Class | kineticist | save | +0.03 ± 0.03 | +0.07 | −0.01 | 0.1 | no clear effect |  |
| 550 | Speaker's Defense | 9 | Ancestry | — | innate spell: Share Life (rank 2), Status (rank 2), Entangling Flora (rank 2), Environmental Endurance (rank 2) | +0.03 ± 0.03 | −0.02 | +0.07 | 6.4 | no clear effect |  |
| 551 | Absorb Strength | 5 | Ancestry | — | check | +0.03 ± 0.02 | +0.05 | +0.00 | 0.7 | no clear effect |  |
| 552 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.03 ± 0.01 | +0.04 | +0.01 | 0.1 | no clear effect |  |
| 553 | Deny Support | 10 | Class | rogue | a foe it Feints can't flank for about a round | +0.03 ± 0.01 | +0.00 | +0.05 | 11.2 | no clear effect |  |
| 554 | Shield Warden | 6 | Class | champion | Shield Block for an adjacent ally (reaction) | +0.03 ± 0.04 | +0.07 | −0.02 | 0.1 | no clear effect |  |
| 555 | Exsanguinate | 6 | Class | — | check | +0.03 ± 0.03 | +0.07 | −0.02 | 1.2 | no clear effect |  |
| 556 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.03 ± 0.03 | +0.07 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 557 | Lingering Bomb | 10 | Class | alchemist | its bombs' direct damage traded for a flame in the target's space: their persistent damage again each turn it starts there (taken as while engaged) | +0.02 ± 0.02 | +0.05 | −0.00 | 1.6 | no clear effect |  |
| 558 | Wyldsinger | 4 | Class | — | innate spell: Menacing Lament (rank 2), Valiant Anthem (rank 2) | +0.02 ± 0.04 | −0.07 | +0.12 | 1.0 | no clear effect |  |
| 559 | Quick Reversal | 4 | Class | fighter | 2 Strikes (requirement assumed: You are flanked by at least two enemies) | +0.02 ± 0.05 | −0.07 | +0.12 | 2.4 | no clear effect |  |
| 560 | Parallel Breakthrough | 6 | Class | psychic | 1 cast of Daze with d10s | +0.02 ± 0.06 | +0.12 | −0.07 | 2.5 | no clear effect |  |
| 561 | Opening Stance | 14 | Class | fighter | its stance (Paragon's Guard) entered free as initiative is rolled (in Paragon's Guard) | +0.02 ± 0.05 | +0.04 | +0.01 | 1.0 | no clear effect |  |
| 562 | Shadowcaster Dedication | 2 | Class | — | innate spell: Dazzling Flash (rank 1), Cloak of Shadow (rank 1) | +0.02 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 563 | Bleed Out | 2 | Class | sorcerer | a spell attack for 1 persistent bleed (1 action, three a fight; its blood magic requirement not checked) | +0.02 ± 0.04 | +0.01 | +0.04 | 2.8 | no clear effect |  |
| 564 | Archaeologist's Warning | 6 | Class | — | +1 to its allies' initiative (free action) | +0.02 ± 0.02 | +0.03 | +0.02 | 9.1 | no clear effect |  |
| 565 | Reveal Machinations | 15 | Skill | — | check | +0.02 ± 0.05 | +0.04 | +0.01 | 1.0 | no clear effect |  |
| 566 | Sour Bomb | 10 | Class | alchemist | a Fortitude save on each bomb hit: sickened 1, or 2 and fleeing (always on) | +0.02 ± 0.02 | +0.07 | −0.02 | 2.6 | no clear effect |  |
| 567 | Mega Bomb | 20 | Class | alchemist | a 30-foot burst of 4d8 fire, basic Reflex DC 43 (2 actions, three a fight) | +0.02 ± 0.03 | −0.01 | +0.05 | 0.7 | no clear effect |  |
| 568 | Menacing Prowess | 10 | Class | — | Demoralize two foes within 30 feet at once (Intimidation DC 24, once a fight: each is then immune to it) | +0.02 ± 0.05 | +0.06 | −0.02 | 1.0 | no clear effect |  |
| 569 | Basic Deduction | 4 | Class | — | Shared Stratagem: a stratagem Strike's hit leaves its target off-guard to an ally's next attack (always on) | +0.02 ± 0.02 | +0.02 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 570 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Scout's Charge | 4 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 572 | Ravenous Charge | 4 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 573 | Interpose | 4 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 574 | Storm Shroud | 8 | Class | — | check | +0.02 ± 0.04 | +0.11 | −0.06 | 1.0 | no clear effect |  |
| 575 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | +0.02 ± 0.04 | +0.06 | −0.01 | 1.0 | no clear effect |  |
| 576 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | +0.02 ± 0.05 | −0.04 | +0.08 | 1.0 | no clear effect | with a weapon and a shield |
| 577 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.02 ± 0.08 | +0.11 | −0.06 | 4.3 | no clear effect |  |
| 578 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.1 | no clear effect | with a one-handed weapon and a free hand |
| 579 | Triple Threat | 20 | Class | ranger | three prey at once (the next taken when one falls; sharing the edge not played) | +0.02 ± 0.03 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 580 | Uncanny Dodge | 10 | Class | — | Deny Advantage: passive-rules | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 581 | Fade Into Daydreams | 0 | Action | psychic | check | +0.02 ± 0.04 | +0.08 | −0.04 | 1.4 | no clear effect |  |
| 582 | Agonizing Rebuke | 5 | Ancestry | — | mental damage on a successful Demoralize (always on; once, not each turn) | +0.02 ± 0.03 | +0.02 | +0.02 | 3.5 | no clear effect |  |
| 583 | The Hallowed Dead | 1 | Class | — | +1 spirit damage on its thralls' Strikes | +0.02 ± 0.02 | +0.03 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 584 | The Unholy Dead | 1 | Class | — | +1 spirit damage on its thralls' Strikes | +0.02 ± 0.02 | +0.03 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 585 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | −0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 586 | Felicitous Riposte | 16 | Class | swashbuckler | Opportune Riposte rolled twice, the better kept | +0.02 ± 0.02 | −0.02 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 587 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.05 | −0.01 | 3.7 | no clear effect |  |
| 588 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | +0.02 ± 0.03 | −0.00 | +0.05 | 0.5 | no clear effect |  |
| 589 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.02 ± 0.01 | +0.04 | +0.00 | 0.1 | no clear effect |  |
| 590 | Pirate Dedication | 2 | Class | — | Boarding Assault: Strike activity | +0.02 ± 0.02 | +0.01 | +0.03 | 1.3 | no clear effect |  |
| 591 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.2 | no clear effect |  |
| 592 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.02 ± 0.02 | +0.03 | +0.02 | 3.7 | no clear effect |  |
| 593 | Clinging Shadows Initiate | 8 | Class | monk | Clinging Shadows Stance: ShadowGrasp Strikes (a focus spell) | +0.02 ± 0.06 | −0.06 | +0.10 | 1.0 | no clear effect |  |
| 594 | Chronoskimmer Dedication | 2 | Class | — | initiative 19 or 1 plus its modifier (a DC 11 flat check), ties won | +0.02 ± 0.03 | +0.02 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 595 | Instant Recovery | 0 | Action | — | healing | +0.02 ± 0.03 | +0.06 | −0.01 | 0.6 | no clear effect |  |
| 596 | Unseat | 10 | Class | — | Strike activity (requirement assumed: You are riding your mount and wielding a jousting weapon) | +0.02 ± 0.01 | +0.04 | +0.00 | 18.9 | no clear effect |  |
| 597 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.02 ± 0.04 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Tremor | 1 | Class | kineticist | save | +0.02 ± 0.04 | −0.04 | +0.08 | 0.6 | no clear effect |  |
| 599 | First to Strike, First to Fall | 17 | Ancestry | — | a hit on a foe that hasn't acted yet: off-guard to the end of its next turn | +0.02 ± 0.02 | −0.00 | +0.04 | 1.3 | no clear effect |  |
| 600 | Revivification Protocol | 13 | Ancestry | — | staying up at 0 Hit Points | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Kashrishi Revivification | 13 | Ancestry | — | staying up at 0 Hit Points | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Esoteric Warden | 2 | Class | thaumaturge | +1 AC and saves until its next turn after a successful Exploit Vulnerability (+2 on a critical success) | +0.02 ± 0.01 | +0.00 | +0.04 | 1.4 | no clear effect |  |
| 603 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.02 | +0.00 | +0.04 | 5.4 | no clear effect | with two weapons (longsword and shortsword) |
| 604 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.02 ± 0.02 | +0.00 | +0.04 | 0.9 | no clear effect |  |
| 605 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.02 ± 0.04 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 606 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.02 ± 0.03 | +0.04 | −0.00 | 0.3 | no clear effect |  |
| 607 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.02 ± 0.01 | +0.04 | +0.00 | 0.2 | no clear effect |  |
| 608 | Vindicator's Judgment | 10 | Class | — | innate spell: Vindicator's Judgment (rank 5) | +0.02 ± 0.05 | +0.08 | −0.04 | 2.3 | no clear effect |  |
| 609 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | +0.02 ± 0.04 | −0.03 | +0.07 | 1.0 | no clear effect |  |
| 610 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.02 ± 0.02 | −0.02 | +0.06 | 1.5 | no clear effect |  |
| 611 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | +0.02 ± 0.04 | +0.01 | +0.03 | 0.9 | no clear effect |  |
| 612 | Siege Celerity | 6 | Class | — | check | +0.02 ± 0.03 | +0.01 | +0.03 | 2.7 | no clear effect |  |
| 613 | Cornered Fury | 5 | Ancestry | — | a larger foe that critically hits it (a Small ratfolk: a Medium foe) is off-guard to it for a round | +0.02 ± 0.01 | +0.01 | +0.03 | 0.4 | no clear effect |  |
| 614 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.02 ± 0.02 | +0.02 | +0.02 | 2.2 | no clear effect |  |
| 615 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 616 | Savage Critical | 18 | Class | fighter | a natural 19 that hits is a critical hit | +0.02 ± 0.02 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 617 | Defensive Advance | 1 | Class | champion | Strike activity | +0.02 ± 0.03 | +0.00 | +0.04 | 1.0 | no clear effect |  |
| 618 | Accompany | 8 | Class | bard | an ally's slot spell paid with its own slot a rank higher; on a very hard Performance check the ally's slot kept (reaction) | +0.02 ± 0.02 | +0.03 | +0.01 | 1.0 | no clear effect |  |
| 619 | Tail Guard | 8 | Class | — | a melee Strike at a foe moving in to flank it (reaction) | +0.02 ± 0.02 | +0.00 | +0.04 | 1.1 | no clear effect |  |
| 620 | Cellular Reconstruction | 12 | Class | — | staying up at 0 Hit Points | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 621 | Tetraelemental Assault | 9 | Ancestry | — | Elemental Assault's extra die for 4 rounds (in Elemental Assault) | +0.02 ± 0.04 | +0.02 | +0.02 | 1.2 | no clear effect |  |
| 622 | Channel Elements | 0 | Action | kineticist | effect (requirement assumed: Your kinetic gate isn't active) | +0.02 ± 0.04 | −0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 623 | Divine Infusion | 4 | Class | cleric | an action before each single-target Heal on an ally: its Strikes 1d6 more (as +3) till the end of its next turn | +0.02 ± 0.02 | +0.05 | −0.01 | 0.7 | no clear effect |  |
| 624 | Shared Stratagem | 2 | Class | investigator | a stratagem Strike's hit leaves its target off-guard to an ally's next attack (always on) | +0.02 ± 0.01 | +0.03 | +0.00 | 0.7 | no clear effect |  |
| 625 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | +0.02 ± 0.04 | +0.04 | −0.01 | 1.0 | no clear effect |  |
| 626 | Wukong Extension | 2 | Class | inventor | a melee Strike at a foe up to 30 feet away | +0.02 ± 0.04 | −0.03 | +0.06 | 2.2 | no clear effect |  |
| 627 | Well of Potential | 5 | Ancestry | — | one more focus spell a fight (1 action to regain it, not counted) | +0.02 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Energized Font | 5 | Ancestry | — | one more focus spell a fight (1 action to regain it, not counted) | +0.02 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.08 | −0.04 | 2.4 | no clear effect |  |
| 630 | Shield of Grace | 16 | Class | champion | Shield Warden's block for an ally, the rest split with it | +0.02 ± 0.05 | −0.01 | +0.05 | 0.1 | no clear effect |  |
| 631 | Storm Spiral | 8 | Class | kineticist | save | +0.02 ± 0.03 | +0.04 | −0.00 | 0.3 | no clear effect |  |
| 632 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 633 | Hematocritical | 10 | Class | — | after its critical hit, its next attack rolled twice (fortune) | +0.02 ± 0.03 | +0.02 | +0.02 | 3.4 | no clear effect |  |
| 634 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | +0.02 ± 0.03 | −0.01 | +0.04 | 0.5 | no clear effect |  |
| 635 | Sand Snatcher | 6 | Class | kineticist | a sand figure's Grapple: grabbed (restrained on a critical) about 2 rounds (its impulse attack played as a Fortitude save; its flanking and Sustains not played) | +0.02 ± 0.05 | +0.10 | −0.07 | 0.6 | no clear effect |  |
| 636 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | +0.02 ± 0.03 | +0.00 | +0.03 | 0.6 | no clear effect |  |
| 637 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.05 | +0.13 | −0.09 | 1.1 | no clear effect |  |
| 638 | Desperate Surge | 10 | Class | — | a Trip at its spell attack (+19), once a fight | +0.02 ± 0.04 | +0.20 | −0.17 | 1.0 | no clear effect |  |
| 639 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.02 ± 0.02 | +0.03 | −0.00 | 0.6 | no clear effect |  |
| 640 | Rain of Razors | 12 | Class | kineticist | save | +0.02 ± 0.03 | +0.05 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 641 | Fierce Grasp | 5 | Ancestry | — | +1 AC against a foe it has grabbed (Grapple forced; its action and the Escape penalty not played) | +0.02 ± 0.01 | +0.02 | +0.01 | 2.5 | no clear effect |  |
| 642 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.02 ± 0.01 | +0.03 | +0.00 | 0.2 | no clear effect |  |
| 643 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | +0.02 ± 0.04 | −0.06 | +0.10 | 1.0 | no clear effect |  |
| 644 | Everstand Stance | 1 | Class | champion | +2 Hardness to Shield Block (the stance taken as on all fight) | +0.02 ± 0.01 | +0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 645 | Favor of Heaven | 17 | Ancestry | — | innate spell: Spirit Blast (rank 6) | +0.02 ± 0.05 | +0.03 | +0.01 | 1.0 | no clear effect |  |
| 646 | Lingering Composition | 1 | Class | bard | Courageous Anthem for 3 rounds, the PC and its allies within 60 feet (once a fight) | +0.02 ± 0.03 | +0.05 | −0.02 | 4.7 | no clear effect |  |
| 647 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | +0.02 ± 0.04 | +0.10 | −0.07 | 1.0 | no clear effect |  |
| 648 | Not This Time | 18 | Class | — | +2 AC as a Strike targets it (reaction, a Mythic Point each; the save riders not played) | +0.02 ± 0.02 | +0.04 | −0.01 | 1.8 | no clear effect |  |
| 649 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.02 ± 0.01 | +0.03 | +0.00 | 9.5 | no clear effect |  |
| 650 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.05 | +0.10 | −0.07 | 1.1 | no clear effect |  |
| 651 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.05 | +0.10 | −0.07 | 1.1 | no clear effect |  |
| 652 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.02 ± 0.06 | +0.16 | −0.13 | 6.8 | no clear effect |  |
| 653 | Harrying Strike | 10 | Class | — | Strike activity | +0.02 ± 0.02 | +0.01 | +0.02 | 9.2 | no clear effect |  |
| 654 | Tempest Gaze | 13 | Ancestry | — | Storming Gaze in a 30-foot cone with twice the dice, once a fight (in Storming Gaze) | +0.02 ± 0.05 | +0.02 | +0.01 | 1.0 | no clear effect |  |
| 655 | Unexpected Sharpshooter Dedication | 2 | Class | — | Accidental Shot: a ranged Strike rolled twice, ignoring circumstance penalties (once a fight) | +0.02 ± 0.03 | +0.01 | +0.02 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 656 | Side by Side (Druid) | 10 | Class | druid | it and its companion flank a foe both are beside | +0.02 ± 0.01 | +0.03 | −0.00 | 7.3 | no clear effect |  |
| 657 | Astonishing Explosion | 20 | Class | alchemist | a bomb's hit fascinates a round, a critical hit stuns 1 too (once a fight) | +0.02 ± 0.01 | +0.02 | +0.01 | 1.2 | no clear effect |  |
| 658 | Channel Smite | 4 | Class | cleric | a melee Strike with a 1-action harm on the hit (2 actions) | +0.02 ± 0.03 | −0.00 | +0.03 | 0.8 | no clear effect |  |
| 659 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 660 | Stem the Tide | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.01 ± 0.03 | −0.00 | +0.03 | 1.8 | no clear effect |  |
| 661 | Tree's Ward | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.01 ± 0.03 | −0.00 | +0.03 | 1.8 | no clear effect |  |
| 662 | Frightful Attrition | 12 | Class | — | a Will save or frightened 1–3 for the foes within 30 feet of each foe it drops (actions.js) | +0.01 ± 0.01 | +0.00 | +0.03 | 1.1 | no clear effect |  |
| 663 | Masquerade of Seasons Stance | 4 | Class | bard | PF2e's stance Effect | +0.01 ± 0.03 | +0.05 | −0.02 | 1.0 | no clear effect |  |
| 664 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.01 ± 0.02 | +0.03 | +0.00 | 2.2 | no clear effect |  |
| 665 | Deathly Scream | 2 | Class | — | innate spell: Deathly Scream (rank 1) | +0.01 ± 0.04 | +0.05 | −0.02 | 1.0 | no clear effect |  |
| 666 | Drain Emotion | 9 | Ancestry | — | its text's self buff (TempHP 9) | +0.01 ± 0.04 | +0.04 | −0.01 | 1.0 | no clear effect |  |
| 667 | Roll the Bones of Fate | 10 | Class | oracle | its next attack rolled twice, the higher kept (1 action, once a fight; played as the Good result) | +0.01 ± 0.05 | +0.06 | −0.03 | 1.0 | no clear effect |  |
| 668 | Resilient Shell | 14 | Class | summoner | its eidolon's resistance to physical damage | +0.01 ± 0.04 | +0.01 | +0.02 | 12.9 | no clear effect |  |
| 669 | Sanguivolent Roots | 8 | Class | kineticist | save | +0.01 ± 0.03 | +0.04 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 670 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.01 ± 0.04 | −0.06 | +0.09 | 1.0 | no clear effect |  |
| 671 | Aggravating Scratch | 9 | Ancestry | — | PF2e rules: extra dice on a critical hit | +0.01 ± 0.04 | +0.08 | −0.05 | 0.0 | no clear effect | with claws; the AI never used it |
| 672 | Accursed Claws | 9 | Ancestry | — | PF2e rules: extra dice on a critical hit | +0.01 ± 0.04 | +0.08 | −0.05 | 0.0 | no clear effect | with claws; the AI never used it |
| 673 | Raise Symbol | 4 | Class | cleric | self effect | +0.01 ± 0.04 | +0.03 | −0.01 | 2.2 | no clear effect |  |
| 674 | Elemental Shape | 10 | Class | druid | Untamed Form's elemental shapes (Elemental Form, rank 5) (in Untamed Form) | +0.01 ± 0.06 | +0.10 | −0.07 | 1.0 | no clear effect |  |
| 675 | Masked Casting | 8 | Class | — | self effect | +0.01 ± 0.01 | +0.00 | +0.03 | 3.4 | no clear effect |  |
| 676 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.05 | +0.10 | −0.07 | 1.1 | no clear effect |  |
| 677 | Muscle Barrier | 2 | Class | — | 10 temporary HP on an ally (its focus spell, a thrall destroyed, once a fight) | +0.01 ± 0.04 | +0.10 | −0.08 | 2.0 | no clear effect |  |
| 678 | Legendary Laugh | 17 | Ancestry | — | 3d8 mental on a successful Demoralize (6d8 on a critical success) | +0.01 ± 0.04 | +0.02 | +0.01 | 5.4 | no clear effect |  |
| 679 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.01 ± 0.03 | +0.06 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 680 | Wish for Luck | 0 | Action | — | an attack rolled twice, the higher kept (free, once a fight) | +0.01 ± 0.05 | +0.08 | −0.05 | 1.0 | no clear effect |  |
| 681 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.04 | 1.1 | no clear effect |  |
| 682 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | +0.01 ± 0.05 | +0.14 | −0.12 | 3.4 | no clear effect |  |
| 683 | Tidal Hands | 1 | Class | kineticist | save | +0.01 ± 0.05 | −0.01 | +0.04 | 0.3 | no clear effect |  |
| 684 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.01 ± 0.02 | +0.00 | +0.02 | 0.0 | no clear effect |  |
| 685 | Boaster's Challenge | 6 | Class | — | +2 status to its Strikes' damage to the end of its next turn (1 action, once a fight; its check played as a success) | +0.01 ± 0.04 | +0.07 | −0.04 | 1.0 | no clear effect |  |
| 686 | Drowning Mist | 12 | Class | kineticist | a foe holding its breath there a Fortitude save each round (DC 31) or sickened 1 (2 on a critical failure); its difficult terrain not played in its 10-foot kinetic aura (stance, the fight) | +0.01 ± 0.03 | +0.05 | −0.02 | 0.4 | no clear effect |  |
| 687 | Advanced General Training | 13 | Ancestry | — | Fane's Escape: check | +0.01 ± 0.04 | +0.05 | −0.03 | 2.0 | no clear effect |  |
| 688 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.01 ± 0.02 | +0.01 | +0.02 | 1.3 | no clear effect |  |
| 689 | Inexhaustible Countermoves | 20 | Class | swashbuckler | an extra reaction in each foe's turn for Opportune Riposte | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 690 | Fortify Shield | 5 | Ancestry | — | Raises its shield with +5 Hardness to block (once a fight) | +0.01 ± 0.03 | +0.03 | −0.00 | 1.0 | no clear effect |  |
| 691 | Raise a Tome | 1 | Class | magus | a book raised for +2 AC | +0.01 ± 0.04 | +0.11 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 692 | Defend Mount | 6 | Class | — | a Strike at its mount taken on its own AC instead (reaction) | +0.01 ± 0.01 | −0.01 | +0.03 | 7.8 | no clear effect |  |
| 693 | Swift Retribution | 18 | Class | champion | an extra action after its champion's reaction | +0.01 ± 0.02 | +0.02 | +0.01 | 0.6 | no clear effect |  |
| 694 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.01 ± 0.05 | +0.10 | −0.07 | 3.0 | no clear effect |  |
| 695 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.01 ± 0.03 | −0.01 | +0.04 | 6.8 | no clear effect |  |
| 696 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | +0.01 ± 0.07 | +0.05 | −0.03 | 6.8 | no clear effect |  |
| 697 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 698 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.01 ± 0.02 | −0.01 | +0.03 | 1.1 | no clear effect |  |
| 699 | Vicious Rend | 10 | Class | — | its companion's Vicious Rend (two claws, bleed if both hit) | +0.01 ± 0.02 | +0.02 | +0.01 | 11.8 | no clear effect |  |
| 700 | Distracting Shot | 12 | Class | ranger | its prey off-guard until its next turn after a ranged critical hit or two ranged hits in a turn | +0.01 ± 0.03 | −0.00 | +0.03 | 1.4 | no clear effect |  |
| 701 | Oni Rampage | 13 | Ancestry | — | quickened for 1 minute once below half its Hit Points (once a fight) | +0.01 ± 0.02 | +0.02 | +0.00 | 0.2 | no clear effect |  |
| 702 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.04 | +0.08 | −0.05 | 1.6 | no clear effect |  |
| 703 | Parry and Riposte | 18 | Class | swashbuckler | Opportune Riposte on a foe's failed Strike too (its finisher and parry taken as met) | +0.01 ± 0.04 | +0.02 | +0.01 | 1.6 | no clear effect |  |
| 704 | Endless Return | 12 | Class | — | passive-rules | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect |  |
| 705 | Gluttonous Feast | 0 | Action | — | save | +0.01 ± 0.04 | −0.01 | +0.03 | 1.0 | no clear effect |  |
| 706 | Debilitating Dichotomy | 8 | Class | oracle | save | +0.01 ± 0.06 | +0.04 | −0.01 | 2.6 | no clear effect |  |
| 707 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.05 | +0.11 | −0.08 | 1.1 | no clear effect |  |
| 708 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.04 | −0.02 | +0.04 | 1.1 | no clear effect |  |
| 709 | Dread Mosquito Storm | 18 | Class | — | innate spell: Dread Mosquito Storm (rank 9) | +0.01 ± 0.01 | +0.02 | +0.00 | 1.0 | no clear effect |  |
| 710 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.7 | no clear effect |  |
| 711 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 5.9 | no clear effect |  |
| 712 | Victorious Vigor | 5 | Ancestry | — | check | +0.01 ± 0.01 | +0.00 | +0.02 | 1.7 | no clear effect |  |
| 713 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.06 | +0.11 | −0.09 | 1.1 | no clear effect |  |
| 714 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | +0.01 ± 0.04 | +0.01 | +0.01 | 1.3 | no clear effect |  |
| 715 | Call the Hurricane | 8 | Class | kineticist | save | +0.01 ± 0.03 | +0.03 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 716 | Nimble Form | 10 | Class | summoner | its eidolon's agile attacks at -3/-6 for the multiple attack penalty | +0.01 ± 0.03 | −0.01 | +0.03 | 12.7 | no clear effect |  |
| 717 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 718 | Zealous Inevitability | 6 | Class | — | Strike activity (requirement assumed: You are wielding your deity's favored weapon) | +0.01 ± 0.01 | +0.01 | +0.01 | 2.8 | no clear effect |  |
| 719 | Blazing Spirit | 6 | Class | animist | check | +0.01 ± 0.04 | +0.06 | −0.04 | 0.7 | no clear effect |  |
| 720 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.01 ± 0.03 | +0.00 | +0.02 | 1.1 | no clear effect |  |
| 721 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 722 | Critical Debilitation | 12 | Class | rogue | on a critical hit, Debilitating Strike's Fortitude save: slowed 1, slowed 2 or paralyzed | +0.01 ± 0.03 | −0.01 | +0.03 | 0.8 | no clear effect |  |
| 723 | Quick Vengeance | 18 | Class | guardian | an extra action after its Intercept Attack or Shield Block | +0.01 ± 0.01 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 724 | Force Fang | 2 | Class | magus | innate spell: Force Fang (rank 1) | +0.01 ± 0.04 | −0.02 | +0.04 | 1.0 | no clear effect |  |
| 725 | Expanded Splash | 10 | Class | alchemist | its Intelligence added to its bombs' splash | +0.01 ± 0.00 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 726 | Ferocious Beasts | 13 | Ancestry | — | its companion's Orc Ferocity | +0.01 ± 0.01 | +0.02 | +0.00 | 9.5 | no clear effect |  |
| 727 | Basic Death Dealing | 4 | Class | — | The Hallowed Dead: +1 spirit damage on its thralls' Strikes | +0.01 ± 0.02 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 728 | Mother's Mindfulness | 9 | Ancestry | — | an adjacent ally's hit taken in its place (reaction, once a fight) | +0.01 ± 0.01 | +0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 729 | Seething Frenzy | 0 | Action | — | check | +0.01 ± 0.01 | +0.01 | +0.01 | 0.2 | no clear effect |  |
| 730 | Bloody Debilitation | 12 | Class | rogue | Debilitating Strike's 3d6 persistent bleed in place of enfeebled 1 | +0.01 ± 0.04 | +0.06 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 731 | Armored Counterattack | 12 | Class | guardian | a Strike back after its Intercept Attack, a Taunt on a hit (free) | +0.01 ± 0.01 | +0.02 | +0.00 | 0.1 | no clear effect |  |
| 732 | Alacritous Action | 2 | Class | summoner | its eidolon's Speed +10 feet | +0.01 ± 0.01 | −0.00 | +0.02 | 9.3 | no clear effect |  |
| 733 | Storm Retribution | 6 | Class | druid | Storm Retribution, as Tempest Surge (rank 3) | +0.01 ± 0.03 | +0.01 | +0.01 | 0.5 | no clear effect |  |
| 734 | Toughness | 1 | General | — | more maximum Hit Points | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 735 | Amplifying Touch | 12 | Class | champion | +1 to attacks and 1 more damage until its next turn for an ally its Lay on Hands heals | +0.01 ± 0.05 | +0.01 | +0.00 | 0.5 | no clear effect |  |
| 736 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.04 | +0.03 | −0.02 | 1.0 | no clear effect |  |
| 737 | Herald's Weapon | 14 | Class | — | PF2e's self Effect | +0.01 ± 0.06 | +0.06 | −0.04 | 1.0 | no clear effect |  |
| 738 | Conductive Sphere | 8 | Class | kineticist | save | +0.01 ± 0.03 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 739 | Piercing Critical | 18 | Class | gunslinger | a natural 19 that hits with its gun is a critical hit | +0.01 ± 0.02 | +0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | True Dragon's Flight | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 741 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 742 | Full Flight | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 743 | Fully Flighted | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 744 | Soaring Form | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 745 | Hero's Wings | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 746 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 747 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.01 ± 0.04 | −0.09 | +0.10 | 2.9 | no clear effect |  |
| 748 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | +0.01 ± 0.00 | +0.01 | +0.01 | 1.9 | no clear effect |  |
| 749 | Irresistible Bloom | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 750 | Even the Odds | 4 | Class | swashbuckler | panache as its turn begins while two foes are beside it (once a fight) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.1 | no clear effect |  |
| 751 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.01 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 752 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.01 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 753 | Immortal Lightness | 4 | Class | — | innate spell: Athletic Rush (rank 1) | +0.01 ± 0.04 | −0.09 | +0.11 | 1.0 | no clear effect |  |
| 754 | Explode | 0 | Action | inventor | inline save: 5-foot emanation, reflex, 2d6 fire (DC 17) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.7 | no clear effect |  |
| 755 | Essence Overflow | 6 | Class | — | save (requirement assumed: You are Channeling Draconic Essence) | +0.01 ± 0.03 | +0.01 | −0.00 | 0.6 | no clear effect |  |
| 756 | Wild Winds Initiate | 8 | Class | monk | Wild Winds Stance: WindCrash Strikes (a focus spell) | +0.01 ± 0.07 | −0.05 | +0.07 | 1.0 | no clear effect |  |
| 757 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.01 ± 0.04 | +0.03 | −0.02 | 1.6 | no clear effect |  |
| 758 | Hardening Necrosis | 9 | Ancestry | — | resistance against a critical hit, then slowed 1 (once a fight, reaction) | +0.01 ± 0.01 | +0.02 | −0.00 | 0.5 | no clear effect |  |
| 759 | Retch Rust | 8 | Class | kineticist | save | +0.01 ± 0.03 | +0.04 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 760 | Devil Allies | 0 | Bonus | — | innate spell: Summon Fiend (rank 6) | +0.01 ± 0.06 | +0.00 | +0.01 | 0.9 | no clear effect |  |
| 761 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.01 ± 0.05 | +0.04 | −0.03 | 3.4 | no clear effect |  |
| 762 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.01 ± 0.04 | +0.01 | +0.00 | 1.8 | no clear effect |  |
| 763 | Seize | 14 | Class | — | check | +0.01 ± 0.05 | +0.10 | −0.09 | 6.8 | no clear effect |  |
| 764 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.01 ± 0.04 | +0.09 | −0.08 | 1.3 | no clear effect |  |
| 765 | Reversing Charge | 8 | Class | — | Strike activity | +0.01 ± 0.02 | −0.01 | +0.02 | 1.8 | no clear effect |  |
| 766 | Align Qi | 6 | Class | monk | 10 HP after a spell with the monk trait (reaction, once a fight) (in Qi Spells) | +0.01 ± 0.02 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 767 | Savor the Hunt | 1 | Ancestry | — | temporary Hit Points of half its level as it frightens a creature (reaction, once) | +0.01 ± 0.01 | +0.00 | +0.01 | 2.4 | no clear effect |  |
| 768 | Leave an Opening | 14 | Class | rogue | its melee critical hit on an off-guard foe sets off an ally's Reactive Strike | +0.01 ± 0.02 | −0.00 | +0.01 | 0.3 | no clear effect |  |
| 769 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 770 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | +0.01 ± 0.03 | −0.11 | +0.12 | 5.7 | no clear effect |  |
| 771 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.01 ± 0.02 | −0.02 | +0.03 | 0.2 | no clear effect |  |
| 772 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.01 ± 0.02 | +0.04 | −0.03 | 12.6 | no clear effect |  |
| 773 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | +0.01 ± 0.05 | +0.00 | +0.01 | 1.8 | no clear effect |  |
| 774 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.05 | +0.00 | +0.01 | 1.8 | no clear effect |  |
| 775 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.05 | +0.00 | +0.01 | 1.8 | no clear effect |  |
| 776 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | +0.01 ± 0.01 | −0.01 | +0.02 | 0.1 | no clear effect |  |
| 778 | Unleash the Blight | 10 | Class | — | save | +0.01 ± 0.01 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 779 | Shield Wallop | 8 | Class | guardian | a flourish Strike, stupefied 1 (2 on a critical hit) until its next turn | +0.01 ± 0.01 | +0.02 | −0.01 | 4.1 | no clear effect |  |
| 780 | Directional Bombs | 6 | Class | alchemist | its bombs' splash on its foes only (a cone away from it) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 781 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.05 | +0.10 | −0.09 | 1.1 | no clear effect |  |
| 782 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.05 | +0.10 | −0.09 | 1.1 | no clear effect |  |
| 783 | Song of the Soul | 2 | Class | — | heals an ally 1d8 (its focus spell through a thrall, once a fight; the fast healing near the thrall not played) | +0.01 ± 0.03 | +0.07 | −0.06 | 0.6 | no clear effect |  |
| 784 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | +0.01 ± 0.02 | +0.01 | +0.01 | 0.9 | no clear effect |  |
| 785 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Living Epic | 20 | Class | — | passive effect (always on) | +0.01 ± 0.03 | −0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 787 | Communal Healing | 2 | Class | cleric | each single-target heal heals the most hurt other ally by its rank | +0.01 ± 0.01 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 788 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.05 | +0.03 | −0.02 | 1.0 | no clear effect |  |
| 789 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.01 ± 0.03 | −0.01 | +0.02 | 1.0 | no clear effect | with a loaded arquebus |
| 790 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 2 area spells | +0.01 ± 0.05 | +0.00 | +0.01 | 2.2 | no clear effect |  |
| 791 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 792 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.00 ± 0.04 | +0.04 | −0.03 | 0.1 | no clear effect |  |
| 793 | Qi Spells | 1 | Class | monk | innate spell: Inner Upheaval (rank 1), Qi Rush (rank 1) | +0.00 ± 0.05 | +0.07 | −0.06 | 1.0 | no clear effect |  |
| 794 | Draining Strike | 2 | Class | — | a Strike counting as two attacks; a hit spends a thrall for 1d6 spirit more, the necromancer healed as much (once a turn) | +0.00 ± 0.02 | +0.05 | −0.04 | 0.6 | no clear effect |  |
| 795 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | +0.00 ± 0.02 | +0.01 | +0.00 | 2.2 | no clear effect | with two weapons (longsword and shortsword) |
| 796 | Magical Onslaught | 10 | Class | summoner | its eidolon's Strike and its cantrip at the same foe (played as Electric Arc's dice on a hit; 2 actions) | +0.00 ± 0.06 | −0.06 | +0.07 | 15.5 | no clear effect |  |
| 797 | Maiden's Mending | 1 | Ancestry | — | temporary Hit Points of half its level after a non-cantrip spell (reaction, once) | +0.00 ± 0.01 | −0.00 | +0.01 | 0.9 | no clear effect |  |
| 798 | Guardian's Intercept | 6 | Class | — | Intercept Attack, once a fight (reaction) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 799 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 800 | Replenishment of War | 10 | Class | cleric | passive effect (always on) | +0.00 ± 0.00 | +0.01 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 801 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.00 ± 0.02 | −0.00 | +0.01 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 802 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.00 ± 0.07 | −0.08 | +0.09 | 1.1 | no clear effect |  |
| 803 | Call to Battle | 5 | Ancestry | — | stands as it wakes from unconscious, with no reactions | +0.00 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 804 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.04 | +0.03 | −0.02 | 1.7 | no clear effect |  |
| 805 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | +0.00 ± 0.03 | −0.02 | +0.03 | 3.5 | no clear effect |  |
| 806 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | +0.00 ± 0.04 | −0.04 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 807 | Flying Flame | 1 | Class | kineticist | a 30-foot line of 1d6 fire, basic Reflex DC 17 (2 actions) | +0.00 ± 0.04 | −0.04 | +0.05 | 1.9 | no clear effect |  |
| 808 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 809 | Prayer-Touched Weapon | 4 | Class | cleric | PF2e's self Effect | +0.00 ± 0.02 | −0.00 | +0.01 | 1.8 | no clear effect |  |
| 810 | Enchanting Shot | 8 | Class | — | Strike activity | +0.00 ± 0.04 | +0.03 | −0.02 | 4.6 | no clear effect |  |
| 811 | Temporary Possession | 16 | Class | — | innate spell: Temporary Possession (rank 8) | +0.00 ± 0.03 | +0.01 | −0.00 | 1.0 | no clear effect |  |
| 812 | Assisting Shot | 2 | Class | fighter | a ranged press Strike, +1 to the next ally's attack at its target | +0.00 ± 0.04 | +0.02 | −0.01 | 2.9 | no clear effect | with a loaded arquebus |
| 813 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | +0.00 ± 0.04 | +0.03 | −0.02 | 1.0 | no clear effect |  |
| 814 | For My House! | 0 | Action | — | self effect | +0.00 ± 0.02 | +0.00 | +0.01 | 1.6 | no clear effect |  |
| 815 | Basic Muse's Whispers | 4 | Class | — | Bestial Snarling: check | +0.00 ± 0.03 | +0.01 | +0.00 | 4.1 | no clear effect |  |
| 816 | Blazing Streak | 10 | Class | monk | a Strike at up to four enemies within 60 feet (3 actions) (in Stoked Flame Stance) | +0.00 ± 0.02 | +0.00 | +0.01 | 2.3 | no clear effect |  |
| 817 | Drilled Reflexes | 10 | Class | commander | Drilled Reactions for up to two allies | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 818 | Battle Cry | 7 | Skill | — | a free Demoralize as the fight begins | +0.00 ± 0.04 | +0.01 | −0.00 | 1.0 | no clear effect |  |
| 819 | Ongoing Strategy | 10 | Class | investigator | precision damage of its strategic strike dice's number on Strikes without a stratagem | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 820 | Aerial Boomerang | 1 | Class | kineticist | save | +0.00 ± 0.04 | −0.04 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 821 | Rend Armor | 8 | Class | — | effect | +0.00 ± 0.04 | +0.19 | −0.18 | 3.7 | no clear effect |  |
| 822 | Precise Debilitations | 10 | Class | rogue | Debilitating Strike's off-guard in place of enfeebled 1 | +0.00 ± 0.02 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 823 | Commitment to Justice | 6 | Class | — | a flourish Strike at a foe that dropped an ally since its last turn, +3 damage per weapon die | +0.00 ± 0.00 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 824 | Expansive Spellstrike | 2 | Class | magus | Spellstrike with a burst, cone or line spell, its area about the target | +0.00 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 825 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.00 ± 0.02 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Resounding Cascade | 16 | Class | magus | its Arcane Cascade's extra damage for allies beside it | +0.00 ± 0.05 | +0.03 | −0.02 | 1.1 | no clear effect |  |
| 827 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Disarming Block | 4 | Class | — | a free Disarm at the foe whose blow it Shield Blocks | +0.00 ± 0.02 | −0.02 | +0.02 | 0.3 | no clear effect |  |
| 829 | Telling Blow | 18 | Class | — | Strike activity | +0.00 ± 0.05 | +0.04 | −0.03 | 3.7 | no clear effect |  |
| 830 | Dragon Roar | 6 | Class | monk | save (requirement assumed: You are in Dragon Stance You bellow, instilling fear in your enemies) | +0.00 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 831 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.06 | +0.16 | −0.16 | 1.0 | no clear effect |  |
| 832 | Basic Witchcraft | 4 | Class | — | Witch's Armaments: PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Bloody Blows | 5 | Ancestry | — | PF2e rules: extra dice on a critical hit | +0.00 ± 0.03 | +0.01 | −0.00 | 0.0 | no clear effect | with claws; the AI never used it |
| 834 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Herald's Strike | 20 | Class | — | save | +0.00 ± 0.04 | +0.09 | −0.09 | 3.4 | no clear effect |  |
| 836 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.05 | +0.00 | +0.00 | 2.8 | no clear effect |  |
| 837 | Torrential Backlash | 10 | Class | — | save (requirement assumed: You are in a curse maelstrom state) | +0.00 ± 0.07 | +0.13 | −0.12 | 4.8 | no clear effect |  |
| 838 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Ferocious Charge | 10 | Class | — | its companion's Ferocious Charge (two Strides and a Strike, +1d8) | +0.00 ± 0.03 | +0.06 | −0.05 | 12.4 | no clear effect |  |
| 840 | Primadonna | 12 | Class | — | check | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 841 | Undying Ferocity | 9 | Ancestry | — | staying up at 0 Hit Points (in Orc Ferocity) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 842 | Apparition's Enhancement | 4 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.3 | no clear effect |  |
| 843 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 845 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 846 | Finishing Follow-Through | 2 | Class | swashbuckler | panache back when a finisher brings its target to 0 HP | +0.00 ± 0.00 | +0.00 | +0.00 | 0.4 | no clear effect |  |
| 847 | All This Has Happened Before | 5 | Ancestry | — | check | +0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 848 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 849 | Administer First Aid | 0 | Action | — | check | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 850 | Blessed Sacrifice | 4 | Class | — | innate spell: Protector's Sacrifice (rank 1) | +0.00 ± 0.02 | +0.02 | −0.01 | 0.6 | no clear effect |  |
| 851 | Spell Swipe | 8 | Class | magus | a 3-action Spellstrike at two adjacent foes, the spell on each it hits (a multi-target or area spell) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 852 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | +0.00 ± 0.01 | +0.03 | −0.02 | 0.2 | no clear effect |  |
| 853 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.05 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 854 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.05 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 855 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.05 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 856 | Resurrectionist | 16 | Class | cleric | a dying ally it heals gets fast healing 5 for 1 minute | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 857 | Feed on Pain | 5 | Ancestry | — | temporary Hit Points of half its mental damage (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 858 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Bend Time | 0 | Action | — | check | +0.00 ± 0.01 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 860 | Plant Shape | 10 | Class | druid | Untamed Form's plant shapes (Plant Form, rank 5) (in Untamed Form) | +0.00 ± 0.05 | −0.02 | +0.02 | 1.0 | no clear effect |  |
| 861 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.05 | −0.00 | +0.00 | 1.3 | no clear effect |  |
| 862 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 868 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Never! | 16 | Class | guardian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 13.2 | no clear effect |  |
| 873 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Feline Dance | 8 | Class | — | a failed Reflex save rerolled, the better kept (reaction, once a fight) (in Claw Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 876 | Furious Finish | 2 | Class | barbarian | Strike activity | +0.00 ± 0.03 | −0.02 | +0.02 | 1.3 | no clear effect |  |
| 877 | Whispers of Weakness | 1 | Class | oracle | +2 to its next attack (1 action) | +0.00 ± 0.03 | −0.01 | +0.01 | 1.2 | no clear effect |  |
| 878 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 879 | Unstable Concoction | 10 | Class | alchemist | its bombs' damage dice a step bigger | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Strain Mind | 6 | Class | psychic | once a fight with its focus spent, a psi cantrip amped — about a d10 a rank more — for 4 HP a rank | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Blood Pool | 14 | Class | — | a foe's death heals the most hurt ally 14 HP (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 882 | Friendly Nudge | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Eidolon's Trample | 16 | Class | summoner | save | +0.00 ± 0.00 | +0.00 | +0.00 | 15.0 | no clear effect |  |
| 884 | Airborne Form | 12 | Class | summoner | its eidolon flies (against fliers) | +0.00 ± 0.00 | +0.00 | +0.00 | 8.8 | no clear effect |  |
| 885 | Foretell Harm | 1 | Class | oracle | twice a damaging spell's rank to its target at that target's next turn (once a round) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.2 | no clear effect |  |
| 886 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 888 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Cackle | 1 | Class | witch | one Sustain a fight as a free action (its Focus Point) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 890 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Objection | 0 | Action | — | a failed save against a linguistic effect rerolled, the better kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Basic Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 898 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Bite and Sting | 0 | Action | — | save (requirement assumed: Your swarm is outside your body) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Confident Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 905 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Escape | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 914 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.6 | no clear effect |  |
| 915 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 918 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 919 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 923 | You're an Embarrassment! | 4 | Class | — | an ally's failed Will save against an incapacitation effect rerolled at +1, each ally once (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Serpentine Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 925 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Energy Heart | 1 | Class | summoner | its eidolon's resistance to fire (its Strike's damage type not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 6.8 | no clear effect |  |
| 927 | Phantom Orchestra | 9 | Ancestry | — | innate spell: Ventriloquism (rank 2), Figment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Aggressive Block | 2 | Class | fighter | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Spellstriker | 4 | Class | — | Spellstrike: spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 931 | Entity's Strike | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 934 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 935 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 936 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 937 | Flashing Shield | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.7 | no clear effect |  |
| 939 | Basic Shooting | 4 | Class | — | Hit the Dirt!: +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Autonomic Psychic Action | 20 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 941 | Fling Into Action | 6 | Class | — | a Reflex save at mythic proficiency (a Mythic Point each) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 942 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 945 | Target of Opportunity | 14 | Class | — | a ranged Strike (–2) when an ally's ranged Strike hits (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 946 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 947 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 949 | Vestigial Magicsense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Spell Protection Array | 4 | Class | wizard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 952 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 953 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 954 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 959 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 960 | Phalanx Formation | 2 | Class | guardian | no lesser cover from it for its allies' targets | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Not So Fast! | 4 | Class | guardian | a Strike at a foe leaving its reach, in Hampering Stance (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Instinct Ability | 6 | Class | — | Draconic Arrogance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.7 | no clear effect |  |
| 965 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Arc of Destruction | 8 | Class | — | +4 AC against a ranged Strike, a miss thrown back (reaction, a Mythic Point each) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 968 | Manifold Modifications | 8 | Class | inventor | Harmonic Oscillator: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 969 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 970 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 972 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 973 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Hallowed Necromancer Dedication | 2 | Class | — | innate spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 977 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 979 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 980 | Tiger Slash | 6 | Class | monk | Strike activity (requirement assumed: You are in Tiger Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 982 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 983 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 986 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 987 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 989 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 990 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 991 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 992 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 993 | Hop Up | 13 | Ancestry | — | stands as it wakes from unconscious, with no reactions | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 994 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 995 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 996 | Full Automation | 20 | Class | inventor | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 997 | Raise Island | 8 | Class | exemplar | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 998 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 999 | Recover Spell | 10 | Class | — | a disrupted spell's slot back, an action of its next turn spent recasting it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1000 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1001 | Waterweave Tripkee | 1 | Ancestry | — | breathes water (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1002 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1003 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1004 | Such a Disgrace! | 4 | Class | — | an ally's failed Will save against a mental effect rerolled at +1, each ally once (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1005 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1006 | Quick Recovery | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 1007 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1008 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Wavetouched Paragon | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1011 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1012 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1013 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1014 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1015 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1016 | Giant Slayer | 16 | Class | ranger | two critical hits on a giant in a turn: a Fortitude save or it dies | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1017 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1018 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1021 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1022 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1023 | Frightful Figment | 1 | Ancestry | — | innate spell: Figment (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1024 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | Shake it Off | 2 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1026 | Wave the Flag | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1027 | Tower Shield Mastery | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1028 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1031 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 10.0 | no clear effect |  |
| 1032 | Innocent Butterfly | 14 | Class | — | innate spell: Aura of the Unremarkable (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1033 | Rogue Dedication | 2 | Class | — | Surprise Attack: foes that haven't acted are off-guard to it the first round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1036 | Life's Blood | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1037 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1038 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1039 | Push Back the Dead! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1040 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1041 | Lore Seeker | 8 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1042 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1044 | Phase Out | 6 | Class | summoner | an Effect on an ally | +0.00 ± 0.00 | +0.00 | +0.00 | 13.6 | no clear effect |  |
| 1045 | May Death Itself Reconsider | 20 | Class | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1046 | Speaking Sky | 12 | Class | — | innate spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1047 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1048 | Silence the Profane | 8 | Class | — | reaction Strike (cast) (requirement assumed: You are wielding your deity's favored weapon) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1049 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1050 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1051 | Bestial Protection | 6 | Class | — | a smaller creature beside its companion that attacks it is frightened 1 | +0.00 ± 0.00 | +0.00 | +0.00 | 7.8 | no clear effect |  |
| 1052 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1053 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1054 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1055 | Improved Twin Riposte (Ranger) | 16 | Class | ranger | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1056 | Calaca's Showstopper | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1057 | Polymorphic Escape | 1 | Ancestry | — | grabbed, immobilized, prone or restrained ignored on a DC 16 flat check (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1058 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1059 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1060 | Sympathetic Vulnerabilities | 6 | Class | thaumaturge | personal antithesis on every foe of the exploited one's kind | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1061 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1062 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1063 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1064 | Sound Mirror | 6 | Class | — | innate spells: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1065 | Beastmaster's Trance | 6 | Class | — | innate spell: Beastmaster Trance (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 8.0 | no clear effect |  |
| 1066 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1067 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1068 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1069 | Resounding Bravery | 8 | Class | fighter | +1 to saves and temporary Hit Points on a critically successful Will save (doubled against fear) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1070 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1071 | Projectile Snatching | 8 | Class | monk | Deflect Projectile, a deflected attack thrown back (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1072 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1073 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1074 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1075 | Eternal Boost | 20 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 14.4 | no clear effect |  |
| 1076 | Unbound Freedom | 13 | Ancestry | — | a DC 17 flat check to ignore controlled (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1077 | Destructive Block | 10 | Class | — | Shield Block prevents twice its Hardness, the shield taking twice the damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1078 | Deflecting Jewel | 5 | Ancestry | — | +2 AC against a ranged attack (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1079 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.7 | no clear effect |  |
| 1080 | Back to Back | 8 | Class | — | allies beside it, and it beside an ally, not off-guard from flanking unless it (or the ally) is flanked too | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1081 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1082 | Keep Up the Good Fight | 14 | Class | guardian | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1083 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1084 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1085 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1086 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1087 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1088 | Orc Superstition | 1 | Ancestry | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.6 | no clear effect |  |
| 1089 | Invoke Offense | 4 | Class | — | effect (requirement assumed: You're under the effects of Enter Spirit Trance) (in Enter Spirit Trance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1090 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1091 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1092 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1093 | Shadow Spell | 8 | Class | — | an Effect on a foe | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1094 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1096 | Natural Swimmer | 4 | Class | druid | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1097 | Siren Song | 9 | Ancestry | — | inline save: 60-foot emanation, will (DC 25, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1098 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1099 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1100 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1101 | Whirling in the Summer Storm | 12 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1102 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1103 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1104 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1105 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1106 | Gunpowder Gauntlet | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1107 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1108 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1109 | Three Clear Breaths | 6 | Class | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1110 | Seat of Power | 16 | Class | — | innate spells: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1111 | Deathless Servant | 18 | Class feature | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1112 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1113 | Dark Persona's Presence | 8 | Class | psychic | each foe within 30 feet a Will save (DC 26): frightened 1, 2 or 3 (free, once a fight — its Unleash Psyche) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1114 | Shared Focus | 10 | Class | wizard | an ally with an empty focus pool gets a Focus Point (1 action, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1115 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1116 | Song of Strength | 2 | Class | bard | innate spell: Song of Strength (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1117 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1118 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1119 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1120 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1121 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 29, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1122 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1123 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1124 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1125 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1126 | Leshy Superstition | 1 | Ancestry | — | +1 to a save against a spell or magical effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1127 | Fight Through Oblivion | 20 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1128 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1129 | Quaking Stomp | 20 | Class | barbarian | innate spell: Earthquake (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1130 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1131 | Defy the Darkness | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1132 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1133 | Wind Jump | 10 | Class | monk | innate spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1134 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1135 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1136 | Kip Up | 7 | Skill | — | stands from prone free, with no reactions | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1137 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1138 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1139 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1140 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1141 | Fey Cantrips | 1 | Ancestry | — | innate spell: Light (rank 1), Ghost Sound (rank 1), Detect Magic (rank 1), Prestidigitation (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1142 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1143 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1144 | Five-Gods Ram | 12 | Class | monk | Strike activity (requirement assumed: You're in Rushing Goat Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1145 | Certain Stratagem | 2 | Class | investigator | half its strategic strike dice on a stratagem Strike's miss (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1146 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 1147 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1148 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1149 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1150 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1151 | Sense the Strike | 10 | Class | — | its Survival DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1152 | Form of the Bat | 13 | Ancestry | — | casts Pest Form (rank 4, DC 32, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1153 | Diehard | 1 | General | — | dies at dying 5 | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1154 | Attuned Electroreceptors | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1155 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1156 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1157 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1158 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1159 | Practiced Paddler | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1160 | Basic Concoction | 4 | Class | — | Poison Resistance: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1162 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1163 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1164 | Conjurer's Countermeasure | 6 | Class | magus | innate spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Spiritual Aid | 12 | Class | — | Spiritual Aid: a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1166 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1167 | Divine Rebuttal | 6 | Class | cleric | a Strike at an adjacent caster as its allies save against it: +2 (+3) to the save on a hit (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1168 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1169 | Swift Swimmer | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1170 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1171 | Sink and Swim | 14 | Class | — | a 35-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1172 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1173 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1174 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1175 | Remorseless Lash | 1 | Ancestry | — | a melee weapon hit keeps a frightened foe at frightened 1 until its next turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1176 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1177 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1178 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1179 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1180 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1181 | Warding Light | 4 | Class | — | innate spell: Light (rank 2), Peaceful Rest (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1182 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1183 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1184 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1185 | Pollinate | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1186 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1187 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1188 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1189 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1190 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1191 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1192 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1193 | Wind Caller | 8 | Class | druid | innate spell: Stormwind Flight (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1194 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1195 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1196 | Light of Revelation | 4 | Class | champion | innate spell: Light of Revelation (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1197 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1198 | Knight's Retaliation | 8 | Class | fighter | a Trip at an undead foe in reach that critically fails a Strike at it (reaction; only against undead) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1199 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1200 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1201 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1202 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1203 | Nidalese Horselord Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1204 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1205 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1206 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1207 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1208 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1209 | Unrivaled Retort | 6 | Class | — | a Fortitude or Reflex save against an area at mythic proficiency (reaction, a Mythic Point each; the Strike back not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1210 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1211 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1212 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1213 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1214 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1215 | Master Siege Engineer | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1216 | Finned Ridges | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1217 | Peerless Captain | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1218 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1219 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1220 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1221 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1222 | Banner's Inspiration | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1223 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1224 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1225 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1226 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1227 | Fearsense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1228 | Desperate Wish | 12 | Class | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1229 | Tenacious Endurance | 6 | Class | — | its companion stays up at 1 HP once (wounded 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 7.8 | no clear effect |  |
| 1230 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1231 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1232 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1233 | Effortless Captivation | 14 | Class | — | one Sustain free each turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1234 | Devout Blessing | 6 | Class | — | Blessed Swiftness: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.9 | no clear effect |  |
| 1235 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1236 | Gaze of Veracity | 10 | Class | — | innate spell: Glimpse the Truth (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1237 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1238 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1239 | Instant Return | 16 | Class | gunslinger | a ranged Strike back at a foe whose ranged attack misses it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1240 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1241 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1242 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1243 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1244 | Avenge Ally | 13 | Ancestry | — | with an ally dying within 30 feet, a Strike rolled twice (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 8.4 | no clear effect |  |
| 1245 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1246 | Energy Resistance | 8 | Class | summoner | its eidolon's resistance to fire at its level | +0.00 ± 0.00 | +0.00 | +0.00 | 17.4 | no clear effect |  |
| 1247 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1248 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1249 | Empathetic Plea | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1250 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1251 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1252 | Basic Glory | 4 | Class | — | Sanctified Soul: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1253 | Calm and Centered | 8 | Skill | — | frightened down by 2 at the end of each turn (stupefied not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1254 | Winter's Kiss | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1255 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1256 | Demonbane Warrior | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1257 | Swift Paragon | 20 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.9 | no clear effect |  |
| 1258 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1259 | Devil's Eye | 4 | Class | — | Objection: a failed save against a linguistic effect rerolled, the better kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1260 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1261 | Silver's Refrain | 12 | Class | bard | innate spell: Silver's Refrain (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1262 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1263 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1264 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1265 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1266 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1267 | Grimspawn | 1 | Ancestry | — | Diehard: dies at dying 5 | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1268 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1269 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1270 | Cultivator Dedication | 2 | Class | — | innate spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1271 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1272 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1273 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1274 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1275 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1276 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1277 | Echoes in Stone | 9 | Ancestry | — | effect (requirement assumed: You are standing on a stone or earthen surface) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1278 | Channeler's Stance | 1 | Class | animist | its vitality spells' healing a bonus of their rank (its apparition and vessel spells not played; the stance taken as entered) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1279 | Reactive Striker | 4 | Class | — | Reactive Strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1280 | Stand Firm | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1281 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1282 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1283 | Like a Fish in Water | 4 | Class | — | a 20-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1284 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1285 | Aqueous Dragonblood | 1 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1286 | Devrin's Cunning Stance | 4 | Class | — | its hits on an off-guard foe stop its reactions (the stance taken as entered; allies' part not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.7 | no clear effect |  |
| 1287 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1288 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1289 | Panache Paragon | 20 | Class | swashbuckler | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1290 | Ancestral Healer | 9 | Ancestry | — | innate spells: Clear Mind (rank 4), Sound Body (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1291 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1292 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1293 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1294 | Determined Lore Seeker | 12 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1295 | Ankle Bite | 5 | Ancestry | — | a Strike at a foe that grabs it, free of the grab on a critical hit (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1296 | Aldori's Retort | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1297 | Worm Caller Dedication | 2 | Class | — | Shake It Off: a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1298 | Spectral Advance | 10 | Class | champion | innate spell: Spectral Advance (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1299 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1300 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1301 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1302 | Vindictive Thoughts | 16 | Class | — | a save against a spell at mythic proficiency (reaction, a Mythic Point each) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1303 | Overwhelming Spellstrike | 12 | Class | magus | Spellstrike's spell ignoring energy resistance up to its level (at a foe that resists) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1304 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1305 | Tracing Trance | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 3.8 | no clear effect |  |
| 1306 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1307 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1308 | Mystical Flare | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1309 | Home in the Deep | 9 | Ancestry | — | breathes water (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1310 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1311 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1312 | Miraculous Medic | 13 | Ancestry | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1313 | Steadying Stone | 1 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1314 | Submit to Shadow | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1315 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1316 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1317 | Inexorable | 6 | Class | — | a DC 15 flat check to ignore paralyzed, slowed or stunned (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1318 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1319 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1320 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1321 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1322 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1323 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1324 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1325 | Momentous Charge | 6 | Class | monk | Strike activity (requirement assumed: You're in Rushing Goat Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1326 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1327 | Foresee Danger | 12 | Class | investigator | its Perception DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.4 | no clear effect |  |
| 1328 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1329 | Monk Dedication | 2 | Class | — | Powerful Fist: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1330 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1331 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.5 | no clear effect |  |
| 1332 | No!!! | 12 | Class | psychic | an ally dropping unleashes its psyche till the end of its next turn (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1333 | Whispers in the Night | 9 | Ancestry | — | innate spell: Darkness (rank 2), Ventriloquism (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1334 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1335 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1336 | Guided by the Stars | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1337 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1338 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1339 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1340 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1341 | Effortless Concentration | 16 | Class | bard | one Sustain free each turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1342 | Know Oneself | 1 | Ancestry | — | a critically failed save against an emotion effect a failure (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1343 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1344 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1345 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1346 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1347 | Flamboyant Cruelty | 8 | Class | swashbuckler | +1 damage for each of clumsy, drained, enfeebled, frightened, sickened, stupefied on the foe, when it has two or more | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1348 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1349 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1350 | Basic Thoughtform | 4 | Class | — | Mental Buffer: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1351 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1352 | Release Me! | 14 | Class | — | a melee Strike at the creature that grabs it (flourish; the Escape after not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1353 | Swimming Poppet | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1354 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1355 | Shed Tail | 5 | Ancestry | — | grabbed ended (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1356 | Basic Fury | 4 | Class | — | Draconic Arrogance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1357 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1358 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1359 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1360 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1361 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1362 | Shadow Magic | 10 | Class | — | innate spell: Dance of Darkness (rank 5), Shadow Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1363 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1364 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1365 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1366 | Mistaken Identity | 5 | Ancestry | — | a failed save against a mental effect rerolled, the better kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1367 | Fear No Pain! | 6 | Class | — | an ally's failed save against a mental effect rerolled at +2 (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1368 | Disciple of Shade | 6 | Class | — | innate spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1369 | Receive Prayers | 14 | Class | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1370 | Basic Synergy | 4 | Class | — | Energy Heart: its eidolon's resistance to fire (its Strike's damage type not played) | +0.00 ± 0.00 | +0.00 | +0.00 | 9.5 | no clear effect |  |
| 1371 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1372 | Water Nagaji | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1373 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1374 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1375 | Storied Companion | 2 | Class | — | its companion's failed save rerolled at mythic proficiency, temporary Hit Points twice its level (reaction, a Mythic Point each) | +0.00 ± 0.00 | +0.00 | +0.00 | 6.6 | no clear effect |  |
| 1376 | Elementalist Dedication | 2 | Class | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1377 | Dwarven Doughtiness | 1 | Ancestry | — | frightened down by 2 at the end of each turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1378 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1379 | Strong Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1380 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1381 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1382 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1383 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1384 | Voice of Authority | 4 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1385 | Enduring Quickness | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1386 | Wolf Drag | 6 | Class | monk | Strike activity (requirement assumed: You are in Wolf Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1387 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1388 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1389 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1390 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1391 | Impaling Briars | 16 | Class | druid | innate spell: Impaling Briars (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1392 | Harmonize Self | 4 | Class | monk | innate spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1393 | Wings of the Dragon | 12 | Class | — | innate spell: Dragon Wings (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1394 | Untamed Form | 1 | Class | druid | innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1395 | Lastwall Warden | 10 | Class | — | Shield Block for an adjacent ally (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1396 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1397 | Expanded Runelord Magic | 14 | Class | — | innate spell: Contingency (rank 7), Spell Riposte (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1398 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1399 | Evasiveness | 12 | Class | — | master in Reflex saves (+2 over expert, always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1400 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1401 | Azure Fins | 10 | Class | — | a 25-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1402 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1403 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1404 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1405 | Wrapped In Smoke | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1406 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1407 | Loremaster's Etude | 2 | Class | bard | innate spell: Loremaster's Etude (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1408 | Mask of Rejection | 5 | Ancestry | — | a failed save against a spell rerolled at +2, the new result kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1409 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1410 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1411 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1412 | Trained Swimmer | 4 | Class | — | a 15-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1413 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1414 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1415 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1416 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1417 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1418 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1419 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1420 | True Senses | 17 | Ancestry | — | casts Truesight (rank 6, DC 39, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1421 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1422 | Finishing Precision | 4 | Class | — | Basic Finisher: Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1423 | Shield from Arrows | 8 | Class | guardian | +4 AC to an adjacent ally as a ranged Strike hits it, its shield raised (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1424 | Wild Winds Gust | 14 | Class | monk | a wind crash Strike at each foe within 30 feet (2 actions, in Wild Winds Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1425 | Reactive Interference | 12 | Class | commander | a foe beside it about to make a Reactive Strike disrupted (its level or lower; else an attack roll against its AC; reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1426 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1427 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1428 | Keep up the Good Fight | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1429 | Perfect Readiness | 20 | Class | gunslinger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1430 | Second Blessing | 8 | Class | champion | Blessed Swiftness: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 10.1 | no clear effect |  |
| 1431 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1432 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1433 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1434 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.0 | no clear effect |  |
| 1435 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1436 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1437 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1438 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1439 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1440 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1441 | Blazing Talon Surge | 6 | Class | monk | Strike activity (requirement assumed: You are in Rain of Embers Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1442 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1443 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1444 | Blind-Fight | 8 | Class | fighter | concealed and hidden targets easier to hit, not off-guard to hidden foes (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1445 | Advantageous Assault | 6 | Class | fighter | a press Strike at a prone foe, + its weapon dice in damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1446 | Cobra Envenom | 10 | Class | monk | Strike activity (requirement assumed: You are in Cobra Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1447 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1448 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1449 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1450 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1451 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1452 | Heightened Instincts | 18 | Class | — | its companion's successful saves critical successes | +0.00 ± 0.00 | +0.00 | +0.00 | 11.2 | no clear effect |  |
| 1453 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1454 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1455 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1456 | Proud Nail | 4 | Class | guardian | a melee flourish Strike at its taunted foe that ignored the taunt, extra weapon dice | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1457 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1458 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1459 | Arise, Ye Worthy! | 13 | Ancestry | — | innate spell: Breath of Life (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1460 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1461 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1462 | Eternal Composition | 18 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1463 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1464 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1465 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1466 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1467 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1468 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1469 | Undead Slayer | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1470 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1471 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1472 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1473 | Focus Ally | 16 | Class | — | an adjacent ally's failed save against an incapacitation effect rerolled, the new result kept (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1474 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1475 | Just the Facts | 20 | Class | investigator | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1476 | Runic Impression | 8 | Class | magus | innate spell: Runic Impression (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1477 | Sea Legs | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1478 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1479 | Journey of the Sky Chariot | 10 | Class | exemplar | Race the Skies: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1480 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1481 | Tandem Onslaught | 4 | Class | — | its battle aura Sustained free each round (taken as its hit each round) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1482 | Watch Your Back | 6 | Class | rogue | a foe –2 to Will saves against fear for a minute (its Intimidation check played as the foe's Will save) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1483 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1484 | Twin Weakness | 10 | Class | thaumaturge | a melee Strike at its exploited foe and Exploit Vulnerability's damage again on any result but a critical failure (2 actions, two attacks) | −0.00 ± 0.06 | +0.12 | −0.12 | 3.7 | no clear effect |  |
| 1485 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1486 | Coven Spell | 12 | Class | witch | an ally's damaging spell +its rank damage on each creature hurt (reaction) | −0.00 ± 0.02 | −0.01 | +0.01 | 0.4 | no clear effect |  |
| 1487 | Bone Burst | 6 | Class | — | inline save: 1 creature, 30 feet, reflex, 2d10 piercing (DC 22) — at a foe beside a thrall that moves, manipulates or shoots (reaction, a thrall destroyed) | −0.00 ± 0.02 | +0.00 | −0.00 | 0.7 | no clear effect |  |
| 1488 | Dazzling Dragonet Disappearance | 17 | Ancestry | — | check | −0.00 ± 0.04 | +0.02 | −0.02 | 0.9 | no clear effect |  |
| 1489 | Yamaraj's Grandeur | 17 | Ancestry | — | save | −0.00 ± 0.04 | −0.06 | +0.05 | 0.9 | no clear effect |  |
| 1490 | Superimpose Time Duplicates | 8 | Class | — | a foe beside it off-guard to its attacks till its next turn (1 action, once a fight) | −0.00 ± 0.03 | +0.04 | −0.04 | 1.0 | no clear effect |  |
| 1491 | Nature's Precision | 6 | Class | — | its companion's agile Strikes +1d4 precision against an off-guard foe | −0.00 ± 0.02 | −0.00 | +0.00 | 7.8 | no clear effect |  |
| 1492 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1493 | Iivlar's Deflection | 9 | Ancestry | — | a critical hit on it a normal hit on a DC 17 flat check (reaction) | −0.00 ± 0.03 | −0.01 | +0.01 | 0.5 | no clear effect |  |
| 1494 | Stone Bones | 9 | Ancestry | — | a critical hit on it a normal hit on a DC 17 flat check (reaction) | −0.00 ± 0.03 | −0.01 | +0.01 | 0.5 | no clear effect |  |
| 1495 | Basic Dogma | 4 | Class | — | Communal Healing: each single-target heal heals the most hurt other ally by its rank | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1496 | Scout's Warning | 4 | Class | ranger | +1 initiative to its allies (free action) | −0.00 ± 0.04 | −0.04 | +0.03 | 1.0 | no clear effect |  |
| 1497 | Solo Dancer | 4 | Skill | — | passive-rules | −0.00 ± 0.02 | −0.03 | +0.03 | 0.0 | no clear effect |  |
| 1498 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | −0.00 ± 0.02 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1499 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.00 ± 0.02 | +0.06 | −0.07 | 2.9 | no clear effect |  |
| 1500 | Calculated Splash | 4 | Class | alchemist | bomb splash equal to its Intelligence | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1501 | Impose Order (Psychic) | 10 | Class | psychic | 1 action: its damage dice their averages rounded up this turn (played on a turn with a damaging slot spell; its psyche taken as unleashed) | −0.00 ± 0.05 | −0.07 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1502 | Daring Act | 6 | Class | — | check | −0.00 ± 0.04 | +0.08 | −0.09 | 2.5 | no clear effect |  |
| 1503 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | −0.00 ± 0.06 | −0.01 | +0.00 | 1.8 | no clear effect |  |
| 1504 | Pack Attack | 6 | Class | — | strike-extra | −0.00 ± 0.03 | +0.03 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1505 | Topple The Titans | 4 | Class | exemplar | check | −0.00 ± 0.05 | +0.09 | −0.10 | 1.0 | no clear effect |  |
| 1506 | Belay That! | 4 | Class | — | an ally's next Strike after a critical miss at that Strike's multiple attack penalty (reaction) | −0.00 ± 0.01 | −0.01 | +0.01 | 0.9 | no clear effect |  |
| 1507 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.02 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1508 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.02 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1509 | Practiced Reflexes | 18 | Class | commander | Drilled Reactions for up to four allies | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1510 | Fake Out | 2 | Class | gunslinger | an ally's attack Aided by its attack roll against DC 15 (reaction) | −0.00 ± 0.06 | −0.13 | +0.13 | 2.7 | no clear effect |  |
| 1511 | Thousand-Year Grudge | 5 | Ancestry | — | a Demoralize's frightened made sickened (reaction, once) | −0.00 ± 0.01 | +0.02 | −0.03 | 3.3 | no clear effect |  |
| 1512 | Unnerving Terror | 13 | Ancestry | — | save (requirement assumed: You're in yaoguai form) | −0.00 ± 0.04 | +0.05 | −0.06 | 1.0 | no clear effect |  |
| 1513 | Lava Leap | 4 | Class | kineticist | save | −0.00 ± 0.06 | +0.03 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1514 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1515 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.00 | 12.6 | no clear effect |  |
| 1516 | Retributive Focus | 18 | Class | champion | one more focus spell a fight (as a foe sets off its reaction) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1517 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1518 | Crash Against Me | 0 | Action | — | PF2e's self Effect | −0.00 ± 0.04 | +0.01 | −0.01 | 1.7 | no clear effect |  |
| 1519 | Terrifying Mien | 16 | Class | — | resistance to a frightened foe's Strikes, four times its frightened value | −0.00 ± 0.01 | −0.02 | +0.01 | 0.1 | no clear effect |  |
| 1520 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.00 ± 0.04 | −0.07 | +0.07 | 8.1 | no clear effect |  |
| 1521 | Constant Gaze | 9 | Ancestry | — | passive-rules | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect |  |
| 1522 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | −0.00 ± 0.02 | −0.01 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1523 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.00 ± 0.04 | −0.01 | +0.00 | 1.1 | no clear effect |  |
| 1524 | Second Thoughts | 18 | Class | wizard | a single-target mental spell critically saved against cast again at another foe, no slot (reaction) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1525 | Inspiring Marshal Stance | 4 | Class | — | +1 status to attacks for it and the allies beside it (stance) | −0.00 ± 0.04 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 1526 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | +0.00 | −0.01 | 2.7 | no clear effect |  |
| 1527 | Enduring Debilitation | 20 | Class | rogue | its first debilitation a fight lasts a minute (free action) | −0.00 ± 0.01 | −0.01 | −0.00 | 1.0 | no clear effect |  |
| 1528 | Sapping Symbol | 12 | Class | cleric | check | −0.00 ± 0.05 | +0.15 | −0.16 | 3.1 | no clear effect |  |
| 1529 | Offer Story | 0 | Action | — | effect | −0.00 ± 0.05 | −0.05 | +0.04 | 1.7 | no clear effect |  |
| 1530 | Patronize the Arts | 4 | Class | — | an ally's critical hit gives it 5 temporary Hit Points (reaction, once each ally) | −0.00 ± 0.01 | −0.00 | −0.01 | 0.6 | no clear effect |  |
| 1531 | Sustaining Steel | 10 | Class | magus | a slot spell's Spellstrike heals it the rank (double in Arcane Cascade) | −0.00 ± 0.01 | +0.02 | −0.02 | 0.7 | no clear effect |  |
| 1532 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 1.8 | no clear effect |  |
| 1533 | Feeding Frenzy | 6 | Class | — | PF2e rules: extra dice on a critical hit | −0.00 ± 0.04 | +0.03 | −0.04 | 0.0 | no clear effect | with jaws; the AI never used it |
| 1534 | Desperate Prayer | 1 | Class | champion | one more Lay on Hands a fight (its Focus Point at a turn start with none) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1535 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1536 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.00 ± 0.05 | +0.00 | −0.01 | 1.8 | no clear effect |  |
| 1537 | Bloodletting Claws | 4 | Class | summoner | its eidolon's critical hits 1d6 persistent bleed | −0.00 ± 0.04 | +0.02 | −0.03 | 10.0 | no clear effect |  |
| 1538 | Premonition of Avoidance | 1 | Class | cleric | self effect | −0.00 ± 0.00 | −0.01 | +0.00 | 1.5 | no clear effect |  |
| 1539 | Breath Unleashed | 9 | Ancestry | — | Kobold Breath with d8s and a 30-foot cone, once a fight (in Kobold Breath) | −0.00 ± 0.05 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 1540 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.00 ± 0.05 | +0.03 | −0.04 | 3.7 | no clear effect |  |
| 1541 | Reflexive Riposte | 10 | Class | swashbuckler | passive-rules | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect |  |
| 1542 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.00 ± 0.04 | −0.00 | −0.01 | 2.0 | no clear effect |  |
| 1543 | Side by Side (Ranger) | 12 | Class | ranger | it and its companion flank a foe both are beside | −0.00 ± 0.02 | +0.02 | −0.02 | 9.8 | no clear effect |  |
| 1544 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.00 ± 0.04 | −0.01 | +0.00 | 1.0 | no clear effect |  |
| 1545 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | −0.00 ± 0.05 | +0.01 | −0.02 | 1.0 | no clear effect |  |
| 1546 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.05 | +0.07 | −0.08 | 1.0 | no clear effect |  |
| 1547 | Into the Fray | 8 | Class | — | 2 Strikes | −0.00 ± 0.02 | +0.00 | −0.01 | 3.3 | no clear effect | with a weapon and a shield |
| 1548 | Psi Strikes | 4 | Class | psychic | PF2e's self Effect | −0.00 ± 0.01 | −0.02 | +0.01 | 1.5 | no clear effect |  |
| 1549 | Accursed Touch | 8 | Class | — | PF2e rules: extra dice on a critical hit | −0.01 ± 0.04 | −0.04 | +0.03 | 0.0 | no clear effect | with fist; the AI never used it |
| 1550 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | −0.01 ± 0.05 | +0.06 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1551 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1552 | Duo's Aim | 8 | Class | — | Strike activity | −0.01 ± 0.04 | +0.03 | −0.04 | 5.1 | no clear effect |  |
| 1553 | Incredible Aim | 8 | Class | fighter | Strike activity | −0.01 ± 0.04 | +0.03 | −0.04 | 5.1 | no clear effect |  |
| 1554 | Fossil Rider | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | −0.01 ± 0.05 | −0.04 | +0.03 | 6.6 | no clear effect |  |
| 1555 | Fearsome Form | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | −0.01 ± 0.05 | −0.04 | +0.03 | 6.6 | no clear effect |  |
| 1556 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | save | −0.01 ± 0.04 | +0.03 | −0.04 | 0.1 | no clear effect |  |
| 1557 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.01 ± 0.04 | −0.04 | +0.03 | 0.5 | no clear effect |  |
| 1558 | Bon Mot | 1 | Skill | — | check | −0.01 ± 0.03 | −0.02 | +0.01 | 3.8 | no clear effect |  |
| 1559 | Roiling Mudslide | 6 | Class | kineticist | save | −0.01 ± 0.05 | +0.06 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1560 | Chain of Words | 10 | Class | — | save | −0.01 ± 0.05 | +0.05 | −0.06 | 1.0 | no clear effect |  |
| 1561 | Defensive Instincts | 9 | Ancestry | — | +1 AC until its next turn while beside two foes (1 action) | −0.01 ± 0.02 | +0.00 | −0.01 | 2.0 | no clear effect |  |
| 1562 | Bestial Snarling | 2 | Class | bard | check | −0.01 ± 0.03 | +0.06 | −0.07 | 3.5 | no clear effect |  |
| 1563 | Jotun's Battle Stance | 5 | Ancestry | — | a stance: reach 10 feet | −0.01 ± 0.03 | −0.01 | −0.01 | 1.0 | no clear effect |  |
| 1564 | Stretching Reach | 5 | Ancestry | — | a stance: reach 10 feet | −0.01 ± 0.03 | −0.01 | −0.01 | 1.0 | no clear effect |  |
| 1565 | Cleansing Spell | 16 | Class | — | an action and a Mythic Point before a single-target Heal on an ally: its level in Hit Points more | −0.01 ± 0.02 | −0.03 | +0.01 | 0.1 | no clear effect |  |
| 1566 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.01 ± 0.04 | +0.00 | −0.02 | 1.0 | no clear effect |  |
| 1567 | Accidental Shot | 0 | Action | — | a ranged Strike rolled twice, ignoring circumstance penalties (once a fight) | −0.01 ± 0.03 | −0.01 | +0.00 | 0.9 | no clear effect | with a loaded arquebus |
| 1568 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | −0.01 ± 0.05 | +0.05 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1569 | Pride in Arms | 9 | Ancestry | — | an ally that drops a foe gains 4 temporary Hit Points (reaction) | −0.01 ± 0.01 | +0.00 | −0.01 | 1.4 | no clear effect |  |
| 1570 | Winter's Clutch | 1 | Class | kineticist | save | −0.01 ± 0.04 | −0.05 | +0.03 | 0.5 | no clear effect |  |
| 1571 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1572 | Sleek Reposition | 2 | Class | fighter | a press melee Strike that moves its target 5 feet on a hit (10 on a critical hit) | −0.01 ± 0.02 | −0.00 | −0.01 | 3.0 | no clear effect | with two weapons (longsword and shortsword) |
| 1573 | Escape Timeline | 12 | Class | — | at a turn start below half its Hit Points with a foe beside it, out of time until its next turn (once) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.2 | no clear effect |  |
| 1574 | Blessed Thorn Strike | 4 | Class | — | a flourish Strike at a foe that hurt an ally, then a Fortitude save: enfeebled 1 (2 on a critical failure) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 1575 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.01 ± 0.04 | −0.01 | −0.01 | 3.8 | no clear effect |  |
| 1576 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | −0.01 ± 0.04 | +0.02 | −0.04 | 2.0 | no clear effect |  |
| 1577 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.01 ± 0.04 | −0.01 | −0.00 | 1.0 | no clear effect |  |
| 1578 | Mythic Refocus | 8 | Class | — | its focus pool refilled once a fight (a Mythic Point; its action not counted) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1579 | Rivethun Invoker Dedication | 2 | Class | — | Diehard: dies at dying 5 | −0.01 ± 0.01 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1580 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1581 | Hail of Splinters | 1 | Class | kineticist | save | −0.01 ± 0.05 | −0.00 | −0.01 | 0.4 | no clear effect |  |
| 1582 | Exult in Violence | 10 | Class | exemplar | after a critical hit this turn: inline save: 1 creature, 30 feet, reflex, 4d6 spirit (DC 29) | −0.01 ± 0.03 | +0.00 | −0.02 | 2.6 | no clear effect |  |
| 1583 | Darting Monkey | 5 | Ancestry | — | flanking foes it hits don't make it off-guard (played as never flanked) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1584 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.01 ± 0.04 | −0.00 | −0.02 | 1.0 | no clear effect |  |
| 1585 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | −0.01 ± 0.04 | +0.05 | −0.07 | 1.0 | no clear effect |  |
| 1586 | Mana Detonation | 18 | Class | — | innate spell: Arcane Explosion (rank 9) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1587 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 0.4 | no clear effect |  |
| 1588 | Hobbling Criticals | 18 | Class | summoner | its eidolon's critical hits: a Fortitude save, −10 feet Speed, slowed 1 or 2 (always on) | −0.01 ± 0.05 | +0.05 | −0.06 | 17.6 | no clear effect |  |
| 1589 | Goading Feint | 1 | Class | swashbuckler | every Feint goads (–2 to the foe's next attack on the PC, all of them on a critical success) instead of off-guard | −0.01 ± 0.02 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1590 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | −0.01 ± 0.03 | −0.06 | +0.04 | 1.0 | no clear effect |  |
| 1591 | Set-Up Strike | 2 | Class | commander | Strike activity | −0.01 ± 0.05 | +0.03 | −0.05 | 2.4 | no clear effect |  |
| 1592 | Invoke Disaster | 18 | Class | druid | innate spell: Storm Lord (rank 9) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.2 | no clear effect |  |
| 1593 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.01 ± 0.06 | +0.03 | −0.05 | 3.9 | no clear effect |  |
| 1594 | Rapid Recharge | 10 | Class | magus | its Spellstrike recharged free as a turn begins, once a fight | −0.01 ± 0.03 | −0.03 | +0.00 | 0.9 | no clear effect |  |
| 1595 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | −0.01 | −0.01 | 1.0 | no clear effect |  |
| 1596 | Perfect Ki Adept | 6 | Class | — | innate spells: Unblinking Flame Revelation (rank 3), Unbreaking Wave Advance (rank 3), Unfolding Wind Rush (rank 3), Untwisting Iron Buffer (rank 3) | −0.01 ± 0.04 | −0.06 | +0.04 | 4.0 | no clear effect |  |
| 1597 | All Shall End in Flames | 18 | Class | kineticist | save | −0.01 ± 0.04 | +0.02 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1598 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 1599 | Ghost Dedication | 2 | Class | — | a 25-foot fly Speed (against fliers) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1600 | Spiritual Echo | 9 | Ancestry | — | innate spells: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | −0.01 ± 0.04 | +0.02 | −0.05 | 1.0 | no clear effect |  |
| 1601 | Vivacious Bravado | 8 | Class | swashbuckler | with panache, temporary Hit Points of its level plus Charisma until its next turn | −0.01 ± 0.04 | −0.04 | +0.02 | 2.5 | no clear effect |  |
| 1602 | Scorching Column | 1 | Class | kineticist | save | −0.01 ± 0.04 | −0.04 | +0.02 | 0.1 | no clear effect |  |
| 1603 | Lightning Rod | 6 | Class | kineticist | check | −0.01 ± 0.05 | +0.04 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1604 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.01 ± 0.05 | +0.04 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1605 | Get Used to Disappointment | 12 | Class | swashbuckler | a free Demoralize at a foe that missed it last turn (once each foe) | −0.01 ± 0.03 | +0.04 | −0.06 | 5.9 | no clear effect |  |
| 1606 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | −0.01 ± 0.02 | −0.01 | −0.01 | 0.2 | no clear effect |  |
| 1607 | Wrath of the First Ghoul | 20 | Class | — | a melee Strike; a hit is a 10th-rank Power Word Kill too (2 actions, once a fight) | −0.01 ± 0.04 | −0.01 | −0.02 | 2.9 | no clear effect |  |
| 1608 | Campfire Chronicler Dedication | 2 | Class | — | Offer Story: effect | −0.01 ± 0.04 | +0.07 | −0.09 | 2.2 | no clear effect |  |
| 1609 | Nourishing Gate | 14 | Class | kineticist | save-bonus | −0.01 ± 0.04 | −0.05 | +0.02 | 0.0 | no clear effect |  |
| 1610 | Advanced Hallowed Spell | 8 | Class | — | innate spells: Life Siphon (rank 4), Eradicate Undeath (rank 4) | −0.01 ± 0.03 | −0.00 | −0.02 | 0.7 | no clear effect |  |
| 1611 | Fiendish Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | −0.01 ± 0.02 | +0.02 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1612 | Celestial Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | −0.01 ± 0.02 | +0.02 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1613 | Second Sting | 12 | Class | ranger | Strike activity | −0.01 ± 0.05 | −0.01 | −0.02 | 7.4 | no clear effect | with two weapons (longsword and shortsword) |
| 1614 | Infiltrator's Blitz | 16 | Class | — | three Strikes with Strides (3 actions, once a fight; fatigued after not played) | −0.01 ± 0.03 | −0.01 | −0.01 | 1.0 | no clear effect |  |
| 1615 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | −0.01 ± 0.04 | +0.02 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1616 | Echoing Fury | 16 | Class | — | Temporal Fury's second Strike a weapon die more (a Mythic Point) (in Temporal Fury) | −0.01 ± 0.05 | +0.03 | −0.05 | 2.7 | no clear effect |  |
| 1617 | Start the Festival! | 17 | Ancestry | — | check | −0.01 ± 0.02 | +0.01 | −0.04 | 0.6 | no clear effect |  |
| 1618 | Call the Swarm | 17 | Ancestry | — | check | −0.01 ± 0.02 | +0.01 | −0.04 | 0.6 | no clear effect |  |
| 1619 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.01 ± 0.03 | −0.03 | +0.01 | 0.9 | no clear effect |  |
| 1620 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.01 ± 0.06 | +0.10 | −0.13 | 2.1 | no clear effect |  |
| 1621 | Usurp the Lunar Reins | 18 | Class | kineticist | save | −0.01 ± 0.04 | +0.02 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1622 | Driving Rain | 6 | Class | kineticist | save | −0.01 ± 0.05 | +0.01 | −0.04 | 0.1 | no clear effect |  |
| 1623 | Insect Shape | 6 | Class | druid | Untamed Form's insect shapes (Insect Form, rank 3) (in Untamed Form) | −0.01 ± 0.03 | +0.02 | −0.05 | 1.0 | no clear effect |  |
| 1624 | Pistol Twirl | 2 | Class | gunslinger | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.3 | no clear effect |  |
| 1625 | Pistol Phenom Dedication | 2 | Class | — | Pistol Twirl: check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.3 | no clear effect |  |
| 1626 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.01 | 1.4 | no clear effect |  |
| 1627 | Instrument of Zeal | 16 | Class | champion | its champion's reaction Strike: a critical hit's extra die and slowed 1 | −0.01 ± 0.01 | +0.00 | −0.03 | 0.5 | no clear effect |  |
| 1628 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | −0.01 ± 0.04 | −0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 1629 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.01 ± 0.04 | +0.13 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1630 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.01 ± 0.05 | +0.08 | −0.10 | 1.0 | no clear effect |  |
| 1631 | Devastating Shield Wallop | 12 | Class | guardian | Shield Wallop (stupefied 1, 2 on a critical hit), then a Fortitude save: prone, or stunned 1 on a critical failure | −0.01 ± 0.04 | +0.01 | −0.03 | 7.3 | no clear effect |  |
| 1632 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | −0.01 ± 0.02 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1633 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | −0.01 ± 0.06 | −0.05 | +0.02 | 4.6 | no clear effect |  |
| 1634 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.02 ± 0.03 | −0.05 | +0.02 | 1.1 | no clear effect |  |
| 1635 | Hymn of Healing | 1 | Class | bard | innate spell: Hymn of Healing (rank 1) | −0.02 ± 0.03 | +0.00 | −0.04 | 1.9 | no clear effect |  |
| 1636 | Aura of Vengeance | 14 | Class | champion | allies' reaction Strikes at −2 with its Retributive Strike (its Exalt with it) | −0.02 ± 0.02 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1637 | Phase Bullet | 14 | Class | — | a firearm Strike at +4 against an armored foe, ignoring cover (once a fight) | −0.02 ± 0.03 | −0.02 | −0.01 | 1.8 | no clear effect |  |
| 1638 | Shadow's Web | 14 | Class | monk | innate spell: Shadow's Web (rank 7) | −0.02 ± 0.02 | −0.01 | −0.02 | 0.1 | no clear effect |  |
| 1639 | Instrument of Slaughter | 16 | Class | champion | its champion's reaction Strike: a critical hit's persistent bleed | −0.02 ± 0.01 | +0.00 | −0.03 | 0.2 | no clear effect |  |
| 1640 | Sleepwalker Dedication | 4 | Class | — | Daydream Trance: PF2e's self Effect | −0.02 ± 0.05 | −0.07 | +0.04 | 1.0 | no clear effect |  |
| 1641 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.04 | −0.02 | −0.02 | 0.9 | no clear effect |  |
| 1642 | Pouncing Transformation | 12 | Class | — | check | −0.02 ± 0.05 | +0.13 | −0.16 | 5.1 | no clear effect |  |
| 1643 | Annihilating Compound Invocation | 18 | Class | — | save | −0.02 ± 0.08 | +0.10 | −0.13 | 14.0 | no clear effect |  |
| 1644 | Night's Shine | 12 | Class | — | innate spells: Asterism (rank 4), Touch of the Moon (rank 4) | −0.02 ± 0.05 | −0.09 | +0.06 | 1.0 | no clear effect |  |
| 1645 | Overwhelming Energy | 10 | Class | druid | Overwhelming Energy copies of 13 damage spells: the target's acid, cold, electricity, fire or sonic resistance ignored up to its level | −0.02 ± 0.06 | +0.00 | −0.04 | 4.2 | no clear effect |  |
| 1646 | Divide and Conquer | 16 | Class | — | two Strikes at mythic proficiency at two foes, one multiple attack penalty (a Mythic Point each) | −0.02 ± 0.03 | +0.00 | −0.03 | 2.9 | no clear effect |  |
| 1647 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.02 ± 0.03 | −0.01 | −0.03 | 2.4 | no clear effect |  |
| 1648 | Kinetic Pinnacle | 20 | Class | kineticist | PF2e rules (always on) | −0.02 ± 0.04 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1649 | None Shall Know | 13 | Ancestry | — | innate spell: Veil of Privacy (rank 7) | −0.02 ± 0.03 | −0.00 | −0.03 | 1.0 | no clear effect |  |
| 1650 | Fling Magic | 0 | Action | thaumaturge | save | −0.02 ± 0.05 | +0.10 | −0.14 | 2.1 | no clear effect |  |
| 1651 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.04 | −0.05 | +0.02 | 1.9 | no clear effect |  |
| 1652 | Solidarity | 9 | Ancestry | — | heals 18 (touch, 1/fight) | −0.02 ± 0.04 | +0.02 | −0.05 | 0.9 | no clear effect |  |
| 1653 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.02 ± 0.02 | −0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1654 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | −0.02 ± 0.03 | −0.07 | +0.03 | 4.3 | no clear effect |  |
| 1655 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | −0.02 ± 0.03 | −0.01 | −0.02 | 1.0 | no clear effect |  |
| 1656 | Impaling Finisher | 4 | Class | swashbuckler | Strike activity | −0.02 ± 0.02 | −0.02 | −0.02 | 1.8 | no clear effect |  |
| 1657 | Flash Your Badge | 10 | Class | — | check | −0.02 ± 0.06 | +0.08 | −0.11 | 2.9 | no clear effect |  |
| 1658 | Multifarious Muse | 2 | Class | bard | Lingering Composition: Courageous Anthem for 3 rounds, the PC and its allies within 60 feet (once a fight) | −0.02 ± 0.03 | +0.05 | −0.09 | 5.8 | no clear effect |  |
| 1659 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.02 ± 0.04 | −0.04 | +0.01 | 1.3 | no clear effect |  |
| 1660 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | −0.02 ± 0.03 | −0.05 | +0.01 | 0.6 | no clear effect |  |
| 1661 | Rouse the Forest's Fury | 18 | Class | kineticist | three trees' Strikes at a foe, 4d10+9 each (played as a Reflex save against their +30: one to three hits; their grab and Sustains not played; 3 actions) | −0.02 ± 0.04 | +0.04 | −0.07 | 0.6 | no clear effect |  |
| 1662 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.02 ± 0.03 | −0.09 | +0.05 | 1.5 | no clear effect |  |
| 1663 | Healing Nexus | 8 | Class | — | healing | −0.02 ± 0.03 | −0.01 | −0.03 | 0.9 | no clear effect |  |
| 1664 | Scrap Barricade | 6 | Class | kineticist | save | −0.02 ± 0.05 | +0.03 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1665 | Tree of Duality | 6 | Class | kineticist | foes about the tree dazzled for a round, allies about it 3d4 HP (3 actions; its Sustain and once-a-heal immunity not played) | −0.02 ± 0.05 | +0.03 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1666 | Fungal Exhalation | 6 | Class | druid | innate spell: Fungal Exhalation (rank 3) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1667 | After You | 2 | Class | swashbuckler | goes last with panache | −0.02 ± 0.05 | +0.02 | −0.06 | 1.0 | no clear effect |  |
| 1668 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.02 ± 0.02 | −0.03 | −0.01 | 0.2 | no clear effect |  |
| 1669 | Wood Ward | 17 | Ancestry | — | self effect | −0.02 ± 0.04 | +0.14 | −0.18 | 4.8 | no clear effect |  |
| 1670 | Combination Finisher | 6 | Class | swashbuckler | its finishers' multiple attack penalty −4/−8 (−3/−6 agile) | −0.02 ± 0.02 | −0.03 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1671 | Irradiate | 6 | Class | — | save | −0.02 ± 0.02 | −0.00 | −0.04 | 0.4 | no clear effect |  |
| 1672 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.02 ± 0.04 | −0.06 | +0.02 | 2.9 | no clear effect |  |
| 1673 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 15) | −0.02 ± 0.05 | −0.14 | +0.10 | 1.8 | no clear effect |  |
| 1674 | Mystery Conduit | 20 | Class | oracle | Mystery Conduit copies of 12 damage spells: once a fight, a spell of 5th rank or lower cast without its slot | −0.02 ± 0.07 | −0.11 | +0.07 | 1.0 | no clear effect |  |
| 1675 | Faultless Defense | 14 | Class | — | self effect | −0.02 ± 0.03 | +0.00 | −0.04 | 3.0 | no clear effect |  |
| 1676 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | −0.02 ± 0.04 | −0.11 | +0.07 | 1.0 | no clear effect |  |
| 1677 | Path of Iron | 14 | Class | — | 3 Strikes | −0.02 ± 0.03 | +0.00 | −0.04 | 2.3 | no clear effect |  |
| 1678 | Black Cat Curse | 13 | Ancestry | — | a foe's successful save rerolled, the worse kept (reaction, once a fight) | −0.02 ± 0.04 | −0.04 | −0.00 | 0.9 | no clear effect |  |
| 1679 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.02 ± 0.04 | −0.00 | −0.04 | 1.0 | no clear effect |  |
| 1680 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.02 ± 0.04 | −0.00 | −0.04 | 1.0 | no clear effect |  |
| 1681 | Boundless Reprisals | 20 | Class | fighter | two more reactions each round, for reactive strike | −0.02 ± 0.02 | +0.00 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1682 | Echoing Channel | 18 | Class | animist | an action before each single-target 2-action Heal on an ally: a second hurt ally gets the 1-action Heal, a d8 a rank | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1683 | Blessed One Dedication | 2 | Class | — | innate spell: Lay on Hands (rank 1) | −0.02 ± 0.02 | −0.06 | +0.02 | 0.7 | no clear effect |  |
| 1684 | Shadowplay | 5 | Ancestry | — | a foe beside it off-guard till its next turn (a Tumble Through at +2, played as the foe's Reflex save; its last-action-a-Strike need not checked) | −0.02 ± 0.03 | −0.03 | −0.01 | 2.0 | no clear effect |  |
| 1685 | Grievous Blow | 8 | Class | — | Strike activity | −0.02 ± 0.04 | −0.02 | −0.02 | 4.9 | no clear effect |  |
| 1686 | Defensive Recovery | 12 | Class | cleric | an action before each single-target Heal on an ally: +2 status to its AC and saves for a round | −0.02 ± 0.02 | −0.03 | −0.02 | 1.0 | no clear effect |  |
| 1687 | Ignite the Sun | 18 | Class | kineticist | save | −0.02 ± 0.04 | +0.01 | −0.06 | 0.1 | no clear effect |  |
| 1688 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | −0.02 ± 0.05 | −0.08 | +0.03 | 1.0 | no clear effect |  |
| 1689 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.02 ± 0.04 | −0.01 | −0.04 | 4.9 | no clear effect |  |
| 1690 | Wyrmling Flight | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1691 | Eternal Wings (Nephilim) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1692 | Eternal Wings (Sylph) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1693 | Soaring Poppet | 17 | Ancestry | — | a 15-foot fly Speed (against fliers) | −0.02 ± 0.02 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1694 | Incredible Ricochet | 12 | Class | fighter | a ranged press Strike ignoring concealment and cover | −0.02 ± 0.04 | −0.02 | −0.03 | 8.0 | no clear effect | with a loaded arquebus |
| 1695 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.02 ± 0.02 | −0.05 | +0.00 | 3.5 | no clear effect |  |
| 1696 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | −0.02 ± 0.02 | −0.03 | −0.02 | 1.7 | no clear effect |  |
| 1697 | Lantern Strobe | 0 | Action | — | save | −0.02 ± 0.03 | −0.03 | −0.02 | 0.5 | no clear effect |  |
| 1698 | Bony Barrage | 4 | Class | — | innate spell: Bony Barrage (rank 2) | −0.02 ± 0.02 | −0.03 | −0.02 | 0.3 | no clear effect |  |
| 1699 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.02 ± 0.04 | −0.09 | +0.04 | 0.3 | no clear effect |  |
| 1700 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.02 ± 0.04 | −0.09 | +0.04 | 0.3 | no clear effect |  |
| 1701 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.02 ± 0.05 | −0.08 | +0.03 | 1.0 | no clear effect |  |
| 1702 | Sympathetic Strike | 4 | Class | witch | a melee Strike: −1 (−2) to the target's saves against its hexes until its next turn | −0.02 ± 0.02 | +0.01 | −0.06 | 1.2 | no clear effect |  |
| 1703 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | −0.02 ± 0.07 | −0.07 | +0.02 | 0.9 | no clear effect |  |
| 1704 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.02 ± 0.04 | −0.07 | +0.02 | 1.0 | no clear effect |  |
| 1705 | Songbird's Call | 8 | Class | bard | innate spell: Songbird's Call (rank 4) | −0.02 ± 0.01 | −0.05 | +0.00 | 1.0 | no clear effect |  |
| 1706 | Mask of Pain | 9 | Ancestry | — | mental damage on a successful Demoralize (its warmask taken as worn) | −0.03 ± 0.04 | −0.03 | −0.02 | 4.0 | no clear effect |  |
| 1707 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.03 ± 0.05 | −0.13 | +0.08 | 1.9 | no clear effect |  |
| 1708 | Stonestrike Stance | 0 | Action | — | PF2e's self Effect | −0.03 ± 0.04 | −0.00 | −0.05 | 1.0 | no clear effect |  |
| 1709 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.03 ± 0.04 | −0.00 | −0.05 | 1.0 | no clear effect |  |
| 1710 | Double Shot | 4 | Class | fighter | 2 Strikes | −0.03 ± 0.02 | +0.00 | −0.05 | 1.4 | no clear effect | with a bow in hand |
| 1711 | Extraplanar Haze | 5 | Ancestry | — | check | −0.03 ± 0.03 | +0.01 | −0.07 | 1.0 | no clear effect |  |
| 1712 | Nanite Shroud | 5 | Ancestry | — | check | −0.03 ± 0.03 | +0.01 | −0.07 | 1.0 | no clear effect |  |
| 1713 | Rising Hurricane | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1714 | Final Shot | 18 | Class | gunslinger | a ranged Strike whose hit is a critical hit, then off-guard and stunned 1 (3 actions) | −0.03 ± 0.10 | +0.23 | −0.28 | 5.6 | no clear effect |  |
| 1715 | That Was a Close One, Huh? | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.04 | 3.4 | no clear effect |  |
| 1716 | Voice Cold as Death | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.04 | 3.4 | no clear effect |  |
| 1717 | Alluring Performance | 9 | Ancestry | — | check | −0.03 ± 0.05 | −0.03 | −0.03 | 1.0 | no clear effect |  |
| 1718 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | −0.03 ± 0.06 | −0.07 | +0.02 | 1.0 | no clear effect |  |
| 1719 | Basic Rune Magic | 4 | Class | — | Backup Runic Enhancement: innate spells: Sigil (rank 2), Runic Body (rank 1), Runic Weapon (rank 1) | −0.03 ± 0.09 | +0.03 | −0.08 | 1.0 | no clear effect |  |
| 1720 | Compliant Gold | 12 | Class | exemplar | Topple the Pillar of Heaven: inline save: 60-foot line, reflex, 6d8 untyped (DC 31) | −0.03 ± 0.05 | −0.05 | −0.01 | 3.4 | no clear effect |  |
| 1721 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.03 ± 0.04 | −0.09 | +0.04 | 0.9 | no clear effect |  |
| 1722 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.04 | −0.01 | −0.05 | 1.0 | no clear effect |  |
| 1723 | Spirits' Interference | 6 | Class | barbarian | while raging, a DC 5 flat check for each ranged attack at it (1 action) | −0.03 ± 0.04 | −0.02 | −0.04 | 1.0 | no clear effect |  |
| 1724 | Triple Time | 4 | Class | bard | innate spell: Triple Time (rank 2) | −0.03 ± 0.04 | +0.03 | −0.09 | 7.7 | no clear effect |  |
| 1725 | Courageous Assault | 10 | Class | bard | Courageous Anthem an action more, and an ally's melee Strike as a reaction | −0.03 ± 0.02 | +0.06 | −0.12 | 2.8 | no clear effect |  |
| 1726 | Double Prey | 12 | Class | ranger | two prey at once (the second taken when the first falls) | −0.03 ± 0.02 | +0.00 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1727 | Sawtooth Grapple | 8 | Class | rogue | 2 Strikes (requirement assumed: You're wielding two weapons, at least one of which is a sawtooth saber) | −0.03 ± 0.02 | −0.03 | −0.03 | 3.3 | no clear effect |  |
| 1728 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | −0.03 ± 0.04 | −0.06 | +0.00 | 0.1 | no clear effect |  |
| 1729 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.03 ± 0.07 | −0.08 | +0.02 | 1.0 | no clear effect |  |
| 1730 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | −0.03 ± 0.05 | +0.03 | −0.09 | 0.2 | no clear effect |  |
| 1731 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.03 ± 0.04 | +0.01 | −0.07 | 1.0 | no clear effect |  |
| 1732 | Recharging Flurry | 4 | Class | magus | 2 Strikes | −0.03 ± 0.06 | −0.06 | +0.01 | 2.3 | no clear effect | with two weapons (longsword and shortsword) |
| 1733 | Gorilla Pound | 6 | Class | monk | a Demoralize, then a melee Strike with +3 damage per frightened value (flourish) | −0.03 ± 0.06 | +0.07 | −0.13 | 3.8 | no clear effect |  |
| 1734 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.03 ± 0.05 | −0.08 | +0.02 | 0.6 | no clear effect |  |
| 1735 | Sever Space | 20 | Class | fighter | a melee Strike at a foe up to 80 feet away (flourish, 2 actions) | −0.03 ± 0.03 | +0.02 | −0.08 | 2.6 | no clear effect |  |
| 1736 | Winter Sleet | 4 | Class | kineticist | a foe coming in falls prone on a failed Reflex save (DC 18) in its 10-foot kinetic aura (stance, the fight) | −0.03 ± 0.06 | −0.07 | +0.01 | 0.5 | no clear effect |  |
| 1737 | Enervating Wail | 6 | Class | — | save | −0.03 ± 0.03 | −0.06 | +0.00 | 0.7 | no clear effect |  |
| 1738 | Heartless Debilitations | 10 | Class | rogue | Debilitating Strike's frightened 1 in place of enfeebled 1 | −0.03 ± 0.02 | −0.03 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1739 | Follow-Up Assault | 8 | Class | barbarian | after a missed melee Strike, raging: a Strike +1 with its weapon dice in damage | −0.03 ± 0.02 | −0.01 | −0.05 | 7.3 | no clear effect |  |
| 1740 | Piercing Jab | 14 | Class | summoner | its eidolon's Strike; a hit grabs and, the grab over, bleeds its dice (played at once) | −0.03 ± 0.08 | +0.08 | −0.14 | 15.8 | no clear effect | with two weapons (longsword and shortsword) |
| 1741 | Poison Weapon | 4 | Class | rogue | Poison Weapon: an Interact, then 1d4 poison on its next weapon hit | −0.03 ± 0.05 | −0.03 | −0.03 | 2.2 | no clear effect |  |
| 1742 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.03 ± 0.05 | −0.04 | −0.02 | 1.0 | no clear effect |  |
| 1743 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | −0.03 ± 0.01 | −0.05 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1744 | Soothing Pulse | 4 | Class | — | Administer Ambient Magic: check | −0.03 ± 0.04 | −0.06 | −0.01 | 0.9 | no clear effect |  |
| 1745 | Scintillating Spell | 16 | Class | sorcerer | Scintillating Spell copies of 11 spells | −0.03 ± 0.08 | −0.11 | +0.05 | 3.7 | no clear effect |  |
| 1746 | Vigorous Anthem | 14 | Class | bard | Courageous Anthem an action more: 8 temporary Hit Points for it and the allies it reaches | −0.03 ± 0.04 | −0.03 | −0.04 | 4.2 | no clear effect |  |
| 1747 | Cursed Effigy | 8 | Class | thaumaturge | an Effect on a foe | −0.03 ± 0.07 | +0.04 | −0.10 | 6.2 | no clear effect |  |
| 1748 | Crush Their Spirits | 13 | Ancestry | — | Demoralize two foes within 30 feet at once (Intimidation DC 27, once a fight: each is then immune to it) | −0.03 ± 0.03 | +0.06 | −0.12 | 1.0 | no clear effect |  |
| 1749 | Calcifying Sand | 4 | Class | kineticist | save | −0.03 ± 0.08 | −0.05 | −0.02 | 0.8 | no clear effect |  |
| 1750 | Dashing Strike | 12 | Class | fighter | Strike activity | −0.03 ± 0.04 | −0.15 | +0.09 | 2.0 | no clear effect |  |
| 1751 | Left-Hand Blood | 5 | Ancestry | — | effect | −0.03 ± 0.03 | −0.04 | −0.03 | 1.0 | no clear effect |  |
| 1752 | Balm Bomb | 12 | Class | alchemist | a bomb's hit: an ally beside the target drinks a healing elixir (its second vial taken as spent) | −0.03 ± 0.03 | +0.00 | −0.07 | 1.3 | no clear effect |  |
| 1753 | Scouring Spark | 18 | Class | — | 3d6 fire on a foe that touches or hits it in melee while its spark is channeled (1 action, a Mythic Point, a minute; its immunities and fire on its fists not played) | −0.03 ± 0.05 | −0.01 | −0.05 | 2.8 | no clear effect |  |
| 1754 | Dive of the Divine | 16 | Class | — | save (requirement assumed: You are at least 20 feet above the ground) | −0.03 ± 0.02 | −0.03 | −0.03 | 0.5 | no clear effect |  |
| 1755 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.03 ± 0.03 | −0.00 | −0.07 | 1.0 | no clear effect |  |
| 1756 | Wronged Monk's Wrath | 10 | Class | monk | innate spell: Wronged Monk's Wrath (rank 5) | −0.03 ± 0.05 | −0.02 | −0.05 | 0.4 | no clear effect |  |
| 1757 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.03 ± 0.04 | −0.01 | −0.06 | 2.8 | no clear effect |  |
| 1758 | Tactical Debilitations | 10 | Class | rogue | Debilitating Strike's no reactions in place of enfeebled 1 | −0.03 ± 0.02 | −0.03 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1759 | Weight of Stone | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.08 | 0.3 | no clear effect |  |
| 1760 | Warped Reflection | 1 | Ancestry | — | save | −0.03 ± 0.04 | +0.03 | −0.10 | 1.0 | no clear effect |  |
| 1761 | Flow of War | 6 | Class | exemplar | check | −0.03 ± 0.03 | −0.06 | −0.01 | 1.0 | no clear effect |  |
| 1762 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.03 ± 0.05 | +0.07 | −0.14 | 2.3 | no clear effect | with a one-handed weapon and a free hand |
| 1763 | Tangle of Battle | 10 | Class | barbarian | a Grapple at a foe it critically hits (reaction) | −0.04 ± 0.02 | −0.01 | −0.06 | 1.0 | no clear effect |  |
| 1764 | Grudging Compliment | 7 | Skill | — | check | −0.04 ± 0.03 | −0.03 | −0.04 | 1.9 | no clear effect |  |
| 1765 | Rippling Spin | 8 | Class | monk | a Trip at the foe whose melee blow hits it, in Reflective Ripple Stance (reaction; the Step not played) (in Reflective Ripple Stance) | −0.04 ± 0.06 | +0.07 | −0.14 | 1.7 | no clear effect |  |
| 1766 | Restorative Strike | 4 | Class | cleric | Strike activity (requirement assumed: You have a Harm or Heal spell you can cast) | −0.04 ± 0.03 | −0.07 | −0.00 | 1.2 | no clear effect |  |
| 1767 | Flickering Twirl | 12 | Class | — | check | −0.04 ± 0.05 | −0.06 | −0.02 | 3.4 | no clear effect |  |
| 1768 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | −0.04 ± 0.02 | +0.00 | −0.07 | 1.2 | no clear effect |  |
| 1769 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.04 ± 0.04 | −0.13 | +0.06 | 2.1 | no clear effect |  |
| 1770 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | −0.04 ± 0.03 | −0.06 | −0.02 | 1.5 | no clear effect |  |
| 1771 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.04 ± 0.06 | −0.12 | +0.04 | 1.1 | no clear effect |  |
| 1772 | Strategist Stance | 4 | Class | — | +1 status to Reflex saves for it and the allies beside it (stance) | −0.04 ± 0.06 | −0.12 | +0.04 | 1.1 | no clear effect |  |
| 1773 | Haft Striker Stance | 4 | Class | fighter | stance | −0.04 ± 0.06 | −0.12 | +0.04 | 1.1 | no clear effect |  |
| 1774 | Embrace the Pain | 12 | Class | barbarian | a Grapple at a foe in reach that damages it (reaction; the Disarm choice not played) | −0.04 ± 0.05 | −0.06 | −0.01 | 2.0 | no clear effect |  |
| 1775 | Shielding Formation | 8 | Class | — | innate spell: Shielding Formation (rank 4) | −0.04 ± 0.05 | +0.01 | −0.08 | 4.5 | no clear effect |  |
| 1776 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.04 ± 0.04 | −0.08 | −0.00 | 1.0 | no clear effect |  |
| 1777 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.04 ± 0.05 | −0.05 | −0.02 | 1.0 | no clear effect |  |
| 1778 | Shame the Sin | 5 | Ancestry | — | check | −0.04 ± 0.02 | −0.07 | −0.00 | 1.0 | no clear effect |  |
| 1779 | Eldritch Debilitations | 10 | Class | rogue | Debilitating Strike's stupefied 1 in place of enfeebled 1 | −0.04 ± 0.02 | −0.04 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1780 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.04 ± 0.04 | +0.01 | −0.09 | 1.5 | no clear effect |  |
| 1781 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.04 ± 0.04 | +0.02 | −0.09 | 1.3 | no clear effect |  |
| 1782 | Shove | 0 | Action | — | check | −0.04 ± 0.01 | −0.08 | +0.00 | 0.6 | no clear effect | with a one-handed weapon and a free hand |
| 1783 | Vicious Debilitations | 10 | Class | rogue | Debilitating Strike's clumsy 1 in place of enfeebled 1 | −0.04 ± 0.02 | −0.02 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1784 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.04 ± 0.03 | −0.09 | +0.01 | 1.0 | no clear effect |  |
| 1785 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.04 ± 0.03 | −0.09 | +0.01 | 1.0 | no clear effect |  |
| 1786 | Leading Dance | 4 | Class | swashbuckler | check | −0.04 ± 0.03 | +0.02 | −0.10 | 3.0 | no clear effect |  |
| 1787 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.04 ± 0.02 | −0.06 | −0.02 | 1.7 | no clear effect |  |
| 1788 | Blinding of the Needle | 0 | Action | — | a Strike; on a hit Fortitude or blinded for a round (2 actions) | −0.04 ± 0.04 | −0.01 | −0.07 | 2.7 | no clear effect |  |
| 1789 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | innate spell: Dragon Breath (rank 3) | −0.04 ± 0.03 | −0.00 | −0.07 | 0.8 | no clear effect |  |
| 1790 | Spirit's Anguish | 8 | Class | — | save | −0.04 ± 0.05 | −0.03 | −0.05 | 2.6 | no clear effect |  |
| 1791 | Bone Swarm | 17 | Ancestry | — | save | −0.04 ± 0.04 | −0.02 | −0.06 | 1.0 | no clear effect |  |
| 1792 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | −0.04 ± 0.03 | −0.07 | −0.01 | 1.9 | no clear effect |  |
| 1793 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.04 ± 0.05 | +0.00 | −0.08 | 2.4 | no clear effect |  |
| 1794 | Overdrive Ally | 8 | Class | inventor | an ally within 30 feet: its Strikes +2 damage until its next turn ends (1 action, in overdrive) | −0.04 ± 0.06 | −0.06 | −0.02 | 8.7 | no clear effect |  |
| 1795 | Radiant Burst | 13 | Ancestry | — | save | −0.04 ± 0.04 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 1796 | Osteo Armaments | 4 | Class | — | effect | −0.04 ± 0.04 | +0.00 | −0.08 | 1.0 | no clear effect |  |
| 1797 | Glory and Valor! | 9 | Ancestry | — | heals 4 (touch, 1/fight) | −0.04 ± 0.04 | −0.01 | −0.07 | 0.9 | no clear effect |  |
| 1798 | Extraplanar Supplication | 5 | Ancestry | — | innate spells: Bless (rank 1), Bane (rank 1) | −0.04 ± 0.03 | −0.06 | −0.02 | 2.2 | no clear effect |  |
| 1799 | Share Rage | 8 | Class | barbarian | effect | −0.04 ± 0.05 | +0.09 | −0.17 | 3.0 | no clear effect |  |
| 1800 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.02 | −0.10 | 1.9 | no clear effect |  |
| 1801 | Special Sentinel Technique | 4 | Class | — | innate spells: Luminous Stardust Healing (rank 2), Shining Starlight Attack (rank 2) | −0.04 ± 0.04 | −0.09 | +0.01 | 0.8 | no clear effect |  |
| 1802 | Live Off Borrowed Time | 14 | Class | — | check | −0.04 ± 0.02 | −0.07 | −0.01 | 1.0 | no clear effect |  |
| 1803 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.04 ± 0.04 | −0.15 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1804 | Celestial Cacophony | 12 | Class | inventor | save | −0.04 ± 0.06 | +0.02 | −0.11 | 1.4 | no clear effect |  |
| 1805 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | −0.04 ± 0.03 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1806 | Meddling Futures | 2 | Class | oracle | a d4 spirit each turn: the Warrior's +1 attack and +2 damage (the others' actions not played) | −0.04 ± 0.04 | −0.05 | −0.03 | 0.4 | no clear effect |  |
| 1807 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.04 ± 0.02 | −0.06 | −0.02 | 0.6 | no clear effect |  |
| 1808 | Moldersoul | 1 | Ancestry | — | Decompose: inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.04 ± 0.02 | −0.06 | −0.02 | 0.6 | no clear effect |  |
| 1809 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.04 ± 0.06 | −0.03 | −0.06 | 1.0 | no clear effect |  |
| 1810 | Sword-Light Wave | 6 | Class | — | a Strike at a foe up to 60 feet away with its melee weapon (2 actions) | −0.04 ± 0.03 | +0.02 | −0.10 | 2.0 | no clear effect |  |
| 1811 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.04 ± 0.02 | −0.04 | −0.04 | 0.3 | no clear effect |  |
| 1812 | Desperate Finisher | 14 | Class | fighter | one more melee Strike as its turn ends (reaction; no reactions after) | −0.04 ± 0.03 | −0.06 | −0.03 | 1.1 | no clear effect |  |
| 1813 | Trip | 0 | Action | — | check | −0.04 ± 0.03 | −0.04 | −0.05 | 1.7 | no clear effect | with a one-handed weapon and a free hand |
| 1814 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.04 ± 0.03 | −0.08 | −0.00 | 0.3 | no clear effect |  |
| 1815 | As a Thousand Soldiers | 8 | Class | exemplar | save | −0.04 ± 0.05 | +0.04 | −0.13 | 1.0 | no clear effect |  |
| 1816 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.04 ± 0.02 | −0.04 | −0.04 | 4.6 | no clear effect |  |
| 1817 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | −0.04 ± 0.05 | +0.03 | −0.11 | 1.0 | no clear effect |  |
| 1818 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.04 ± 0.04 | −0.04 | −0.05 | 0.7 | no clear effect |  |
| 1819 | Scorching Disarm | 9 | Ancestry | — | check | −0.04 ± 0.03 | −0.09 | +0.00 | 1.0 | no clear effect |  |
| 1820 | Tumbling Lumber | 4 | Class | kineticist | save | −0.04 ± 0.08 | −0.13 | +0.04 | 2.2 | no clear effect |  |
| 1821 | Dirty Trick | 1 | Skill | — | check | −0.04 ± 0.02 | −0.09 | +0.00 | 1.5 | no clear effect |  |
| 1822 | Meditate on This! | 14 | Class | barbarian | save | −0.04 ± 0.06 | −0.18 | +0.09 | 3.7 | no clear effect |  |
| 1823 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.04 ± 0.03 | −0.01 | −0.08 | 0.3 | no clear effect |  |
| 1824 | Reactive Strike | 6 | Class | barbarian | reactive-strike | −0.04 ± 0.06 | −0.22 | +0.13 | 0.0 | no clear effect | the AI never used it |
| 1825 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | −0.05 ± 0.04 | −0.04 | −0.06 | 10.4 | no clear effect |  |
| 1826 | Frighten Undead | 6 | Class | — | check | −0.05 ± 0.04 | +0.01 | −0.10 | 3.4 | no clear effect |  |
| 1827 | Crossbow Terror | 6 | Class | — | check | −0.05 ± 0.04 | +0.01 | −0.10 | 3.4 | no clear effect |  |
| 1828 | Puncture Flesh | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.02 | 1.5 | no clear effect |  |
| 1829 | Grapple | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.02 | 1.5 | no clear effect |  |
| 1830 | Hit and Run | 6 | Class | — | Strike activity | −0.05 ± 0.03 | +0.02 | −0.11 | 1.7 | no clear effect |  |
| 1831 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.05 ± 0.04 | −0.02 | −0.07 | 1.8 | no clear effect |  |
| 1832 | Sky Master Mask | 20 | Class | druid | a 25-foot fly Speed (against fliers) | −0.05 ± 0.06 | +0.19 | −0.28 | 0.0 | no clear effect | the AI never used it |
| 1833 | Part the Veil | 0 | Action | — | check | −0.05 ± 0.05 | −0.06 | −0.03 | 1.0 | no clear effect |  |
| 1834 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.05 ± 0.04 | −0.04 | −0.06 | 1.0 | no clear effect |  |
| 1835 | Duelist's Form | 16 | Class | — | a stance: quickened | −0.05 ± 0.04 | −0.03 | −0.07 | 1.0 | no clear effect |  |
| 1836 | Greater Magical Scholastics | 10 | Class | — | innate spell: Augury (rank 2), Locate (rank 3), Veil of Privacy (rank 3) | −0.05 ± 0.04 | +0.05 | −0.15 | 1.0 | no clear effect |  |
| 1837 | Necrotic Bomber | 4 | Class | — | innate spell: Necrotic Bomb (rank 1) | −0.05 ± 0.04 | −0.15 | +0.05 | 0.7 | no clear effect |  |
| 1838 | No Scar but This | 0 | Action | — | check | −0.05 ± 0.03 | −0.03 | −0.07 | 1.2 | no clear effect |  |
| 1839 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.05 ± 0.04 | −0.07 | −0.03 | 1.7 | no clear effect |  |
| 1840 | Guide the Timeline | 6 | Class | — | effect | −0.05 ± 0.03 | −0.02 | −0.07 | 1.0 | no clear effect |  |
| 1841 | Curse of the Saumen Kar | 14 | Class | — | a foe's Reflex save (DC 33) or trapped in an ice dome (40 HP, Hardness 20) till it breaks out (2 actions, once a fight) | −0.05 ± 0.06 | −0.04 | −0.06 | 2.8 | no clear effect |  |
| 1842 | Ultimatum of Liberation | 0 | Action | — | save | −0.05 ± 0.04 | −0.01 | −0.09 | 1.0 | no clear effect |  |
| 1843 | Twin Parry | 4 | Class | fighter | effect | −0.05 ± 0.05 | −0.12 | +0.03 | 2.8 | no clear effect |  |
| 1844 | Draconic Resilience | 4 | Class | — | effect | −0.05 ± 0.05 | −0.12 | +0.03 | 2.8 | no clear effect |  |
| 1845 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.05 ± 0.05 | −0.12 | +0.03 | 2.8 | no clear effect |  |
| 1846 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | −0.05 ± 0.06 | +0.00 | −0.10 | 3.1 | no clear effect |  |
| 1847 | Group Taunt | 8 | Class | guardian | Taunt at up to three foes | −0.05 ± 0.03 | −0.01 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1848 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.05 | −0.07 | −0.03 | 3.9 | no clear effect |  |
| 1849 | Fermenting Liquors | 4 | Class | alchemist | check | −0.05 ± 0.04 | −0.07 | −0.03 | 1.0 | no clear effect |  |
| 1850 | Twin Feint | 1 | Class | rogue | two Strikes at one foe, off-guard to the second | −0.05 ± 0.03 | +0.05 | −0.15 | 1.6 | no clear effect | with two weapons (longsword and shortsword) |
| 1851 | Emphatic Emissary | 10 | Class | — | +2 to initiative | −0.05 ± 0.04 | −0.09 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1852 | Martyr | 8 | Class | cleric | an action before each single-target Heal on an ally: 1d8 a rank of its own Hit Points to it too | −0.05 ± 0.03 | −0.05 | −0.05 | 2.0 | no clear effect |  |
| 1853 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.05 ± 0.04 | −0.06 | −0.04 | 3.0 | no clear effect | with a spear and a free hand |
| 1854 | Distracting Spellstrike | 4 | Class | magus | check | −0.05 ± 0.03 | −0.04 | −0.06 | 0.8 | no clear effect |  |
| 1855 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.05 ± 0.03 | −0.04 | −0.06 | 2.0 | no clear effect |  |
| 1856 | Sun Blade | 4 | Class | champion | innate spell: Sun Blade (rank 2) | −0.05 ± 0.05 | +0.00 | −0.10 | 1.0 | no clear effect |  |
| 1857 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.11 | +0.01 | 1.7 | no clear effect |  |
| 1858 | Resilient Touch | 10 | Class | champion | +1 to saves until its next turn for an ally its Lay on Hands heals | −0.05 ± 0.04 | −0.05 | −0.05 | 0.4 | no clear effect |  |
| 1859 | Mammoth Charge | 6 | Class | — | Strike activity (requirement assumed: You are riding your megafauna companion) | −0.05 ± 0.03 | +0.02 | −0.12 | 1.7 | no clear effect |  |
| 1860 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | −0.05 ± 0.04 | +0.00 | −0.10 | 2.2 | no clear effect |  |
| 1861 | Death of Hope | 17 | Ancestry | — | save | −0.05 ± 0.05 | −0.06 | −0.04 | 1.0 | no clear effect |  |
| 1862 | Bristle | 5 | Ancestry | — | effect | −0.05 ± 0.03 | −0.05 | −0.06 | 2.4 | no clear effect |  |
| 1863 | Primal Roar | 0 | Action | — | check | −0.05 ± 0.04 | −0.00 | −0.10 | 1.3 | no clear effect |  |
| 1864 | Threatening Approach | 0 | Action | — | check | −0.05 ± 0.04 | −0.00 | −0.10 | 1.3 | no clear effect |  |
| 1865 | Envenom Fangs | 5 | Ancestry | — | 1d6 persistent poison on its next hit (1 action, once a fight) | −0.05 ± 0.03 | −0.10 | −0.01 | 1.0 | no clear effect |  |
| 1866 | Belly Flop | 10 | Class | guardian | Strike activity | −0.05 ± 0.03 | −0.19 | +0.08 | 11.7 | no clear effect |  |
| 1867 | Borrow Memories | 14 | Class | — | innate spell: Mind Probe (rank 5) | −0.05 ± 0.05 | −0.08 | −0.03 | 1.0 | no clear effect |  |
| 1868 | Impose Order | 13 | Ancestry | — | a skill check about to critically fail taken as 10 + its proficiency bonus (reaction, once a fight; misfortune, which the rating foes don't impose, not played) | −0.05 ± 0.03 | −0.08 | −0.03 | 7.1 | no clear effect |  |
| 1869 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | −0.05 ± 0.04 | −0.03 | −0.07 | 5.6 | no clear effect |  |
| 1870 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | −0.09 | −0.02 | 1.0 | no clear effect |  |
| 1871 | Lingering Flames | 8 | Class | — | Fireball with persistent fire on a failure (a copy beside it) | −0.05 ± 0.02 | −0.04 | −0.07 | 0.6 | hurts |  |
| 1872 | Greenwatcher | 10 | Class | gunslinger | innate spell: Faerie Fire (rank 2) | −0.05 ± 0.07 | −0.02 | −0.09 | 1.0 | no clear effect |  |
| 1873 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.05 ± 0.03 | −0.02 | −0.09 | 0.9 | hurts |  |
| 1874 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.05 ± 0.04 | −0.07 | −0.04 | 1.7 | no clear effect |  |
| 1875 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | −0.05 ± 0.05 | −0.09 | −0.02 | 0.3 | no clear effect |  |
| 1876 | Disturbing Knowledge | 7 | Skill | — | check | −0.06 ± 0.01 | +0.00 | −0.11 | 1.1 | hurts |  |
| 1877 | Mind Shards | 6 | Class | — | save | −0.06 ± 0.03 | −0.05 | −0.06 | 0.9 | no clear effect |  |
| 1878 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.06 ± 0.05 | +0.01 | −0.12 | 1.0 | no clear effect |  |
| 1879 | Improved Poison Weapon | 8 | Class | rogue | Poison Weapon with 2d4 poison (Poison Weapon with it) | −0.06 ± 0.05 | −0.03 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1880 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | −0.06 ± 0.03 | −0.08 | −0.03 | 4.1 | no clear effect |  |
| 1881 | Worm's Feast | 6 | Class | — | save | −0.06 ± 0.05 | −0.07 | −0.04 | 1.0 | no clear effect |  |
| 1882 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.06 ± 0.05 | +0.09 | −0.20 | 2.0 | no clear effect |  |
| 1883 | Dragonet Breath | 1 | Ancestry | — | save | −0.06 ± 0.03 | −0.10 | −0.01 | 0.5 | no clear effect |  |
| 1884 | Rearing Display | 12 | Class | — | its mount's Strike, a hit followed by a Demoralize | −0.06 ± 0.03 | −0.01 | −0.10 | 14.6 | no clear effect |  |
| 1885 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | −0.04 | −0.08 | 2.1 | hurts |  |
| 1886 | Turn Aside Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.06 ± 0.05 | −0.04 | −0.08 | 1.8 | no clear effect |  |
| 1887 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.06 ± 0.04 | −0.06 | −0.05 | 1.0 | no clear effect |  |
| 1888 | Watchful Gaze | 1 | Ancestry | — | can't be flanked until its next turn (1 action) | −0.06 ± 0.05 | −0.04 | −0.08 | 1.8 | no clear effect |  |
| 1889 | Martial Performance | 1 | Class | bard | innate spells: Courageous Anthem (rank 1), Rallying Anthem (rank 1), Song of Strength (rank 1) | −0.06 ± 0.03 | +0.01 | −0.12 | 2.0 | hurts |  |
| 1890 | Heal Companion | 1 | Class | ranger | focus spell: Heal Companion (rank 1) | −0.06 ± 0.02 | −0.02 | −0.09 | 7.2 | hurts |  |
| 1891 | Look but Don't Touch | 13 | Ancestry | — | 3d6 poison on a foe that touches or hits it in melee for a minute (2 actions, once a fight) | −0.06 ± 0.04 | −0.07 | −0.04 | 2.6 | no clear effect |  |
| 1892 | Cloak of Poison | 13 | Ancestry | — | 3d6 poison on a foe that touches or hits it in melee for a minute (2 actions, once a fight) | −0.06 ± 0.04 | −0.07 | −0.04 | 2.6 | no clear effect |  |
| 1893 | Persistent Boost | 16 | Class | inventor | 1d8 persistent fire on its boosted melee hits (always on) | −0.06 ± 0.08 | −0.13 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1894 | Aegis for the Innocent | 14 | Class | — | save (requirement assumed: Your nimbus is active) | −0.06 ± 0.02 | −0.11 | −0.00 | 0.7 | hurts |  |
| 1895 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | −0.06 ± 0.04 | −0.08 | −0.04 | 1.0 | no clear effect |  |
| 1896 | Ostilli Host Dedication | 2 | Class | — | Repel Ambient Magic: PF2e's self Effect | −0.06 ± 0.05 | −0.00 | −0.12 | 2.2 | no clear effect |  |
| 1897 | Slowing Strike | 12 | Class | — | save | −0.06 ± 0.05 | −0.11 | −0.00 | 11.0 | no clear effect |  |
| 1898 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.06 ± 0.05 | −0.10 | −0.02 | 1.0 | no clear effect |  |
| 1899 | Stridulating Song | 0 | Action | — | save | −0.06 ± 0.04 | −0.03 | −0.09 | 1.0 | no clear effect |  |
| 1900 | Through the Needle's Eye | 4 | Class | exemplar | Blinding of the Needle: a Strike; on a hit Fortitude or blinded for a round (2 actions) | −0.06 ± 0.05 | −0.10 | −0.02 | 4.1 | no clear effect |  |
| 1901 | Pack Movement | 8 | Class | — | a Stride and a Strike, its companion's Strike beside it | −0.06 ± 0.03 | −0.08 | −0.04 | 18.8 | no clear effect |  |
| 1902 | Statement Strut | 8 | Class | — | enemies within 30 feet a Will save (DC 24) or no reactions for a round (its Stride not played; once a fight) | −0.06 ± 0.03 | −0.01 | −0.11 | 4.1 | no clear effect |  |
| 1903 | Blanket Defense | 14 | Class | guardian | 3 actions: its shield raised, allies beside it get its bonus till its next turn (played with two allies beside it in a fight) | −0.06 ± 0.02 | −0.09 | −0.03 | 1.5 | hurts |  |
| 1904 | Running Kick | 10 | Class | — | its companion's Running Kick (two Strides and a Strike) | −0.06 ± 0.03 | −0.05 | −0.08 | 13.1 | hurts |  |
| 1905 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.06 ± 0.07 | −0.00 | −0.12 | 4.2 | no clear effect |  |
| 1906 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | −0.06 ± 0.05 | +0.02 | −0.14 | 14.6 | no clear effect |  |
| 1907 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | −0.06 ± 0.06 | −0.17 | +0.04 | 1.0 | no clear effect |  |
| 1908 | Student of Perfection Dedication | 2 | Class | — | Qi Spells: innate spell: Inner Upheaval (rank 1), Qi Rush (rank 1) | −0.06 ± 0.04 | −0.04 | −0.09 | 1.0 | no clear effect |  |
| 1909 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.06 ± 0.02 | −0.06 | −0.06 | 1.5 | hurts |  |
| 1910 | Zombie Horde (Necromancer) | 6 | Class | — | innate spell: Zombie Horde (rank 3) | −0.06 ± 0.03 | −0.09 | −0.03 | 2.7 | hurts |  |
| 1911 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.06 ± 0.05 | −0.04 | −0.09 | 2.5 | no clear effect |  |
| 1912 | Accelerating Touch | 4 | Class | champion | +10 feet Speed until its next turn for an ally its Lay on Hands heals | −0.06 ± 0.05 | −0.09 | −0.03 | 0.4 | no clear effect |  |
| 1913 | Demoralize | 0 | Action | — | check | −0.06 ± 0.04 | −0.03 | −0.10 | 1.8 | no clear effect |  |
| 1914 | Haunting Visage | 0 | Action | — | check | −0.06 ± 0.04 | −0.03 | −0.10 | 1.8 | no clear effect |  |
| 1915 | Terrifying Croak | 1 | Ancestry | — | check | −0.06 ± 0.04 | −0.03 | −0.10 | 1.8 | no clear effect |  |
| 1916 | Sudden Terror | 1 | Ancestry | — | check | −0.06 ± 0.04 | −0.03 | −0.10 | 1.8 | no clear effect |  |
| 1917 | Jinx | 0 | Action | — | save | −0.06 ± 0.04 | −0.04 | −0.08 | 1.0 | no clear effect |  |
| 1918 | Now You See Me | 14 | Class | — | check | −0.06 ± 0.06 | −0.09 | −0.03 | 2.3 | no clear effect |  |
| 1919 | Flinging Blow | 16 | Class | monk | Strike activity | −0.06 ± 0.07 | −0.04 | −0.08 | 5.9 | no clear effect |  |
| 1920 | Distracting Feint | 2 | Class | rogue | Feint (forced): a foe off-guard to it also takes –2 to Perception and Reflex saves | −0.06 ± 0.03 | −0.02 | −0.11 | 1.7 | hurts |  |
| 1921 | Healing Hands | 1 | Class | cleric | 1 cast of Heal with d10s | −0.06 ± 0.03 | −0.08 | −0.04 | 1.7 | no clear effect |  |
| 1922 | Seasoned Command | 7 | Skill | — | 1 action: an ally's next attack at a foe beside it Aided, +1 (+2 on a critical success), each ally once a fight | −0.06 ± 0.05 | −0.12 | −0.01 | 2.5 | no clear effect |  |
| 1923 | Bolstered Recovery | 16 | Class | — | Instant Recovery: healing | −0.06 ± 0.04 | −0.01 | −0.12 | 0.9 | no clear effect |  |
| 1924 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.06 ± 0.06 | −0.19 | +0.06 | 1.0 | no clear effect |  |
| 1925 | Evangelize | 7 | Skill | — | check | −0.06 ± 0.03 | −0.02 | −0.11 | 2.4 | hurts |  |
| 1926 | Ravel of Thorns | 4 | Class | kineticist | 2 piercing to foes moving in its 10-foot kinetic aura (stance, the fight) | −0.06 ± 0.07 | −0.10 | −0.03 | 1.3 | no clear effect |  |
| 1927 | Invoke the Crimson Oath | 8 | Class | — | innate spell: Invoke the Crimson Oath (rank 2) | −0.06 ± 0.02 | −0.07 | −0.06 | 0.5 | hurts |  |
| 1928 | Worm Form | 14 | Class | — | a purple worm battle form: AC 20 + level, 40 temporary HP, jaws and stinger at +25 (2 actions, once a fight; the stinger's poison not played) | −0.06 ± 0.06 | −0.08 | −0.05 | 1.0 | no clear effect |  |
| 1929 | Reclaim Power | 6 | Class | — | regains 12 HP (two thralls destroyed, once a fight) | −0.07 ± 0.03 | −0.11 | −0.02 | 0.7 | hurts |  |
| 1930 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | −0.07 ± 0.06 | −0.16 | +0.03 | 1.0 | no clear effect |  |
| 1931 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | −0.07 ± 0.04 | +0.00 | −0.13 | 2.4 | no clear effect |  |
| 1932 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.07 ± 0.03 | −0.08 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 1933 | Kindle Inner Flames | 8 | Class | kineticist | +1 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.07 ± 0.06 | −0.10 | −0.03 | 2.6 | no clear effect |  |
| 1934 | Springsoul | 1 | Ancestry | — | innate spell: Tangle Vine (rank 1) | −0.07 ± 0.03 | −0.09 | −0.05 | 1.4 | no clear effect |  |
| 1935 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.07 ± 0.03 | −0.10 | −0.03 | 1.3 | hurts |  |
| 1936 | Kineticist Dedication | 2 | Class | — | Channel Elements: effect (requirement assumed: Your kinetic gate isn't active) | −0.07 ± 0.05 | −0.03 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 1937 | Antagonize | 2 | Class | swashbuckler | Demoralize (forced); frightened from it stays at 1 or more until the foe attacks it | −0.07 ± 0.03 | −0.05 | −0.09 | 2.1 | no clear effect |  |
| 1938 | To Me! | 18 | Class | — | Strike activity | −0.07 ± 0.03 | −0.07 | −0.07 | 2.3 | hurts |  |
| 1939 | Spirit of the Beast | 4 | Class | — | focus spell: Spirit of the Beast (rank 2) | −0.07 ± 0.03 | −0.03 | −0.11 | 8.0 | hurts |  |
| 1940 | Bloody Tendrils | 6 | Class | — | innate spell: Bloody Tendrils (rank 3) | −0.07 ± 0.04 | −0.03 | −0.11 | 1.0 | no clear effect |  |
| 1941 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.07 ± 0.07 | −0.09 | −0.05 | 8.7 | no clear effect |  |
| 1942 | Constricting Hold | 8 | Class | summoner | save | −0.07 ± 0.07 | +0.02 | −0.15 | 20.1 | no clear effect |  |
| 1943 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.07 ± 0.05 | +0.10 | −0.23 | 1.0 | no clear effect |  |
| 1944 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | −0.07 ± 0.06 | −0.05 | −0.09 | 5.6 | no clear effect |  |
| 1945 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | +0.01 | −0.15 | 0.0 | no clear effect | the AI never used it |
| 1946 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.07 ± 0.06 | −0.06 | −0.07 | 1.0 | no clear effect |  |
| 1947 | Unrelenting Terror | 5 | Ancestry | — | Demoralize the same foe again each round (immune only 1 round) | −0.07 ± 0.02 | −0.01 | −0.12 | 6.4 | hurts |  |
| 1948 | Terrifying Countenance | 18 | Class | — | innate spell: Mask of Terror (rank 7) | −0.07 ± 0.06 | +0.01 | −0.15 | 7.3 | no clear effect |  |
| 1949 | Breath of Hungry Death | 16 | Class | — | save | −0.07 ± 0.04 | −0.11 | −0.03 | 0.9 | no clear effect |  |
| 1950 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.07 ± 0.05 | +0.04 | −0.17 | 1.0 | no clear effect |  |
| 1951 | Unending Emptiness | 14 | Class | — | innate spell: Darklight (rank 7) | −0.07 ± 0.03 | −0.03 | −0.11 | 2.9 | hurts |  |
| 1952 | Steal Time | 10 | Class | — | save | −0.07 ± 0.04 | +0.06 | −0.20 | 1.0 | no clear effect |  |
| 1953 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spells: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.07 ± 0.03 | −0.10 | −0.04 | 4.1 | hurts |  |
| 1954 | Instinctual Creation | 14 | Class | — | two thralls as it rolls initiative | −0.07 ± 0.07 | −0.43 | +0.29 | 0.0 | no clear effect | the AI never used it |
| 1955 | Torrent in the Blood | 6 | Class | kineticist | check | −0.07 ± 0.05 | −0.03 | −0.11 | 0.5 | no clear effect |  |
| 1956 | Feral Mending | 8 | Class | — | check | −0.07 ± 0.03 | −0.09 | −0.05 | 0.8 | hurts |  |
| 1957 | Cutting Rebuke | 4 | Class | — | Bon Mot: check | −0.07 ± 0.05 | −0.12 | −0.03 | 5.8 | no clear effect |  |
| 1958 | Cadence Call | 6 | Class | — | check | −0.07 ± 0.04 | −0.07 | −0.07 | 1.0 | no clear effect |  |
| 1959 | Abrasive Drag | 12 | Class | — | check | −0.07 ± 0.04 | −0.01 | −0.13 | 12.7 | no clear effect |  |
| 1960 | Storm of Claws | 16 | Class | — | 3 Strikes (requirement assumed: You're in either claw stance or talon stance) (in Claw Stance) | −0.07 ± 0.08 | −0.19 | +0.05 | 5.5 | no clear effect |  |
| 1961 | Deific Font | 18 | Class | — | one more 4th-rank spell a fight, drained 1 for it | −0.07 ± 0.02 | −0.11 | −0.04 | 0.0 | hurts | the AI never used it |
| 1962 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.07 ± 0.06 | −0.10 | −0.04 | 3.0 | no clear effect |  |
| 1963 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.07 ± 0.03 | −0.06 | −0.08 | 0.7 | hurts |  |
| 1964 | Kobold Breath | 1 | Ancestry | — | save | −0.07 ± 0.03 | −0.06 | −0.08 | 0.7 | hurts |  |
| 1965 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | −0.07 ± 0.06 | +0.11 | −0.25 | 1.0 | no clear effect |  |
| 1966 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.07 ± 0.04 | −0.06 | −0.08 | 1.6 | no clear effect |  |
| 1967 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.07 ± 0.08 | −0.15 | +0.00 | 4.8 | no clear effect | with two weapons (longsword and shortsword) |
| 1968 | Staff Sweep | 6 | Class | — | check | −0.07 ± 0.04 | −0.01 | −0.14 | 2.7 | no clear effect |  |
| 1969 | Blessing of the Five | 0 | Bonus | — | casts Heal (rank 1, DC 17, 1/fight) | −0.07 ± 0.03 | −0.15 | +0.00 | 0.9 | hurts |  |
| 1970 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.07 ± 0.03 | −0.12 | −0.03 | 1.9 | hurts |  |
| 1971 | Starlit Sentinel Dedication | 2 | Class | — | Starlit Transformation: PF2e's self Effect | −0.07 ± 0.04 | +0.02 | −0.17 | 1.0 | no clear effect |  |
| 1972 | Stasian Smash | 8 | Class | — | Strike activity | −0.07 ± 0.04 | −0.11 | −0.03 | 3.6 | hurts |  |
| 1973 | Manifold Conduit | 12 | Class | — | innate spell: Entreat the Many (rank 6) | −0.07 ± 0.06 | −0.08 | −0.07 | 1.0 | no clear effect |  |
| 1974 | Speaker in Training | 5 | Ancestry | — | innate spells: Bless (rank 1), Fleet Step (rank 1) | −0.07 ± 0.03 | −0.11 | −0.03 | 1.8 | hurts |  |
| 1975 | Lifelink Surge | 4 | Class | summoner | innate spell: Lifelink Surge (rank 2) | −0.07 ± 0.06 | +0.10 | −0.25 | 11.9 | no clear effect |  |
| 1976 | Banner Twirl | 4 | Class | commander | check | −0.07 ± 0.07 | −0.05 | −0.10 | 2.6 | no clear effect |  |
| 1977 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.07 ± 0.06 | +0.02 | −0.17 | 6.5 | no clear effect |  |
| 1978 | Guiding Words | 18 | Class | — | check | −0.07 ± 0.05 | −0.16 | +0.01 | 1.0 | no clear effect |  |
| 1979 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.07 ± 0.03 | −0.09 | −0.06 | 4.2 | hurts |  |
| 1980 | The Bigger They Are | 12 | Class | swashbuckler | +6 damage on its Strikes this turn (1 action; the Tumble Through taken as succeeding) | −0.07 ± 0.05 | −0.09 | −0.06 | 3.4 | no clear effect |  |
| 1981 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.07 ± 0.03 | +0.00 | −0.15 | 3.8 | hurts |  |
| 1982 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.08 ± 0.02 | −0.03 | −0.12 | 2.4 | hurts |  |
| 1983 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.08 ± 0.04 | +0.03 | −0.18 | 1.1 | no clear effect |  |
| 1984 | Punishing Shove | 1 | Class | guardian | damage on a successful Shove (always on) | −0.08 ± 0.04 | −0.00 | −0.15 | 2.2 | no clear effect |  |
| 1985 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.08 ± 0.04 | +0.02 | −0.18 | 5.5 | no clear effect |  |
| 1986 | Sacrifice Armor | 8 | Class | champion | 14 less damage from a physical Strike, once, its armor broken after (-3 AC; reaction) | −0.08 ± 0.03 | −0.11 | −0.04 | 0.8 | hurts |  |
| 1987 | Rites of Liberation | 14 | Class | — | innate spells: Unimpeded Stride (rank 1), Word of Freedom (rank 4) | −0.08 ± 0.05 | −0.12 | −0.03 | 1.0 | no clear effect |  |
| 1988 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.08 ± 0.04 | −0.15 | −0.00 | 2.4 | no clear effect |  |
| 1989 | Divine Healing | 8 | Class | — | innate spell: Lay on Hands (rank 1) | −0.08 ± 0.05 | −0.12 | −0.03 | 1.0 | no clear effect |  |
| 1990 | Pointed Question | 0 | Action | investigator | check | −0.08 ± 0.04 | +0.00 | −0.16 | 1.7 | hurts |  |
| 1991 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.08 ± 0.04 | −0.10 | −0.06 | 0.9 | hurts |  |
| 1992 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.08 ± 0.04 | −0.11 | −0.05 | 3.0 | no clear effect |  |
| 1993 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.08 ± 0.06 | +0.11 | −0.27 | 9.9 | no clear effect |  |
| 1994 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.08 ± 0.04 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 1995 | Fiendish Brand | 6 | Class | — | Strike activity | −0.08 ± 0.04 | −0.06 | −0.10 | 3.9 | no clear effect |  |
| 1996 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.08 ± 0.05 | −0.06 | −0.10 | 1.0 | no clear effect |  |
| 1997 | Shared Assault | 12 | Class | bard | Courageous Anthem an action more, and an ally's melee Strike as a reaction; its critical hit, another ally's Strike (with Courageous Assault) | −0.08 ± 0.04 | +0.08 | −0.24 | 2.2 | no clear effect |  |
| 1998 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.08 ± 0.03 | −0.14 | −0.02 | 2.4 | hurts |  |
| 1999 | Roaring Charge | 0 | Action | commander | save | −0.08 ± 0.05 | −0.03 | −0.13 | 1.0 | no clear effect |  |
| 2000 | Fabricate Truth | 4 | Class | — | check | −0.08 ± 0.04 | −0.08 | −0.08 | 3.0 | no clear effect |  |
| 2001 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.08 ± 0.03 | −0.07 | −0.09 | 2.4 | hurts |  |
| 2002 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | −0.08 ± 0.06 | −0.03 | −0.13 | 2.0 | no clear effect |  |
| 2003 | Oni Form | 1 | Ancestry | — | PF2e's self Effect | −0.08 ± 0.05 | −0.04 | −0.12 | 1.0 | no clear effect |  |
| 2004 | Blast Tackle | 14 | Class | gunslinger | a Strike with 3d6 precision more (2 actions; its Grapple first taken as made) | −0.08 ± 0.09 | −0.25 | +0.09 | 5.6 | no clear effect |  |
| 2005 | Spiritual Strike | 6 | Class | — | a Strike with extra force damage, counting as two attacks (2 actions; its familiar beside it not checked) | −0.08 ± 0.04 | −0.09 | −0.08 | 3.1 | no clear effect |  |
| 2006 | Augment Senses | 13 | Ancestry | — | can't be flanked until its next turn (1 action) | −0.08 ± 0.04 | −0.06 | −0.10 | 3.7 | hurts |  |
| 2007 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.08 ± 0.05 | −0.18 | +0.02 | 1.0 | no clear effect |  |
| 2008 | Chain Infusion | 10 | Class | kineticist | Chain Infusion and an Elemental Blast, its hits chaining on to other foes (2 actions) | −0.08 ± 0.04 | −0.09 | −0.08 | 0.4 | hurts |  |
| 2009 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.08 ± 0.03 | −0.14 | −0.02 | 3.0 | hurts |  |
| 2010 | Sun's Fury | 6 | Class | — | innate spell: Sun's Fury (rank 3) | −0.08 ± 0.04 | −0.07 | −0.09 | 2.0 | hurts |  |
| 2011 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.08 ± 0.05 | −0.02 | −0.15 | 1.2 | no clear effect |  |
| 2012 | Cry Havoc! | 0 | Action | commander | save | −0.08 ± 0.05 | +0.09 | −0.25 | 0.9 | no clear effect |  |
| 2013 | Levering Strike | 8 | Class | — | Strike activity (requirement assumed: You are wielding your staff) | −0.08 ± 0.04 | −0.13 | −0.03 | 3.0 | hurts |  |
| 2014 | It Was Me All Along! | 14 | Class | — | check | −0.08 ± 0.06 | −0.15 | −0.02 | 1.0 | no clear effect |  |
| 2015 | Seven-Colored Cosmic Bridge | 18 | Class | exemplar | Fleeting Arc through Heaven and Earth: inline save: 60-foot cone, fortitude, 9d6 spirit (DC 38) | −0.08 ± 0.03 | +0.01 | −0.18 | 1.7 | hurts |  |
| 2016 | Threatening Pursuit | 13 | Ancestry | — | check | −0.08 ± 0.04 | +0.01 | −0.18 | 3.9 | no clear effect |  |
| 2017 | Idol Threat | 13 | Ancestry | — | check | −0.08 ± 0.04 | +0.01 | −0.18 | 3.9 | no clear effect |  |
| 2018 | Decree of War | 18 | Class | — | Strike activity | −0.08 ± 0.04 | +0.00 | −0.17 | 2.3 | no clear effect |  |
| 2019 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | −0.08 ± 0.04 | +0.04 | −0.21 | 0.9 | hurts |  |
| 2020 | Basic Martial Magic | 4 | Class | — | Spell Parry: its text's self buff (FlatModifier ac 1) | −0.09 ± 0.06 | +0.05 | −0.23 | 3.3 | no clear effect | with a one-handed weapon and a free hand |
| 2021 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.09 ± 0.06 | −0.15 | −0.02 | 9.3 | no clear effect |  |
| 2022 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.09 ± 0.04 | −0.07 | −0.10 | 2.2 | no clear effect |  |
| 2023 | Form of the Beloved Mother | 17 | Ancestry | — | innate spells: Animal Form (rank 5), Slither (rank 5) | −0.09 ± 0.06 | −0.25 | +0.07 | 4.9 | no clear effect |  |
| 2024 | Plane Step | 9 | Ancestry | — | check | −0.09 ± 0.05 | −0.10 | −0.07 | 2.2 | no clear effect |  |
| 2025 | Ulfen Guard Dedication | 2 | Class | — | Designate Ally: its Effect on an ally within 30 feet | −0.09 ± 0.05 | +0.06 | −0.23 | 7.7 | no clear effect |  |
| 2026 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.09 ± 0.07 | −0.13 | −0.05 | 1.0 | no clear effect |  |
| 2027 | Hampering Stance | 2 | Class | guardian | a stance (its difficult terrain not played) | −0.09 ± 0.03 | −0.12 | −0.06 | 1.1 | hurts |  |
| 2028 | Frightening Power | 12 | Class | — | save | −0.09 ± 0.05 | −0.25 | +0.07 | 12.1 | no clear effect |  |
| 2029 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.09 ± 0.04 | −0.07 | −0.11 | 1.7 | hurts |  |
| 2030 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.09 ± 0.04 | −0.07 | −0.11 | 1.7 | hurts |  |
| 2031 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.09 ± 0.04 | −0.07 | −0.11 | 1.7 | hurts |  |
| 2032 | Extract Element | 0 | Action | kineticist | save | −0.09 ± 0.04 | −0.10 | −0.08 | 3.9 | hurts |  |
| 2033 | Bone Spikes | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.04 | +0.01 | −0.19 | 1.0 | hurts |  |
| 2034 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | −0.09 ± 0.04 | +0.01 | −0.19 | 1.0 | hurts |  |
| 2035 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.04 | +0.01 | −0.19 | 1.0 | hurts |  |
| 2036 | Godbreaker | 20 | Class | monk | 3 Strikes | −0.09 ± 0.05 | −0.08 | −0.10 | 1.2 | no clear effect |  |
| 2037 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.09 ± 0.06 | −0.05 | −0.13 | 1.0 | no clear effect |  |
| 2038 | Analyze Weakness | 6 | Class | rogue | +2d6 precision on its next sneak attack (1 action) | −0.09 ± 0.05 | −0.05 | −0.13 | 5.1 | no clear effect |  |
| 2039 | Gift of the Hoard | 10 | Class | — | innate spell: Dragon Breath (rank 3) | −0.09 ± 0.03 | −0.03 | −0.15 | 0.9 | hurts |  |
| 2040 | Spew Tentacles | 13 | Ancestry | — | innate spell: Black Tentacles (rank 5) | −0.09 ± 0.02 | −0.09 | −0.09 | 0.5 | hurts |  |
| 2041 | Devoted Guardian | 2 | Class | champion | an Effect on an ally | −0.09 ± 0.04 | −0.10 | −0.08 | 5.0 | hurts |  |
| 2042 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.09 ± 0.07 | +0.00 | −0.18 | 6.8 | no clear effect |  |
| 2043 | Crushing Grab | 2 | Class | monk | Strength damage on a successful Grapple (always on) | −0.09 ± 0.05 | −0.01 | −0.17 | 3.7 | no clear effect |  |
| 2044 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.09 ± 0.03 | −0.09 | −0.09 | 2.6 | hurts |  |
| 2045 | Raise Slabs | 0 | Action | — | save | −0.09 ± 0.04 | −0.05 | −0.14 | 1.0 | hurts |  |
| 2046 | Stranglehold | 9 | Ancestry | — | check | −0.09 ± 0.05 | +0.10 | −0.29 | 11.9 | no clear effect |  |
| 2047 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.09 ± 0.05 | −0.05 | −0.14 | 1.0 | hurts |  |
| 2048 | Trampling Charge | 10 | Class | — | its mount through a 70-foot line, 3d8+6 piercing, basic Reflex DC 30 | −0.09 ± 0.03 | −0.14 | −0.05 | 13.7 | hurts |  |
| 2049 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.09 ± 0.04 | −0.24 | +0.05 | 2.1 | hurts |  |
| 2050 | Draconic Fury | 4 | Class | — | save | −0.09 ± 0.05 | −0.13 | −0.06 | 1.6 | no clear effect |  |
| 2051 | Advanced Elemental Spell | 6 | Class | druid | innate spells: Combustion (rank 3), Stone Lance (rank 3), Powerful Inhalation (rank 3), Pulverizing Cascade (rank 3) | −0.09 ± 0.05 | −0.05 | −0.14 | 2.5 | no clear effect |  |
| 2052 | Burn out of Time | 0 | Action | — | heals 5d8 (touch) | −0.09 ± 0.03 | −0.09 | −0.10 | 0.8 | hurts |  |
| 2053 | Subtle Shank | 8 | Class | rogue | Strike activity | −0.09 ± 0.05 | −0.10 | −0.09 | 4.4 | no clear effect |  |
| 2054 | Talon Stance | 0 | Action | — | PF2e's stance Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 1.1 | no clear effect |  |
| 2055 | Fleet Tempo | 4 | Class | — | effect | −0.09 ± 0.05 | −0.12 | −0.06 | 1.0 | no clear effect |  |
| 2056 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.09 ± 0.07 | −0.16 | −0.03 | 1.0 | no clear effect |  |
| 2057 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.09 ± 0.04 | −0.02 | −0.17 | 2.0 | hurts |  |
| 2058 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.09 ± 0.03 | −0.15 | −0.04 | 1.0 | hurts |  |
| 2059 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.10 ± 0.05 | −0.20 | +0.01 | 2.4 | no clear effect |  |
| 2060 | Unlimited Potential | 20 | Class | psychic | Unlimited Potential copies of 2 damage spells: once a fight, a spell of 5th rank or lower cast without its slot | −0.10 ± 0.06 | −0.12 | −0.08 | 1.0 | no clear effect |  |
| 2061 | Aether Beam | 8 | Class | — | save (requirement assumed: You are overflowing) | −0.10 ± 0.04 | −0.04 | −0.15 | 5.2 | hurts |  |
| 2062 | Waters of Creation | 10 | Class | oracle | check | −0.10 ± 0.05 | −0.07 | −0.13 | 2.0 | no clear effect |  |
| 2063 | Cleansing Light | 17 | Ancestry | — | check | −0.10 ± 0.05 | +0.03 | −0.23 | 1.0 | hurts |  |
| 2064 | Walk the Plank | 8 | Class | — | check | −0.10 ± 0.04 | −0.06 | −0.14 | 2.7 | hurts |  |
| 2065 | Edict of Mortality | 8 | Class | — | check | −0.10 ± 0.04 | −0.06 | −0.14 | 2.7 | hurts |  |
| 2066 | Majestic Proclamation | 8 | Class | — | check | −0.10 ± 0.04 | −0.06 | −0.14 | 2.7 | hurts |  |
| 2067 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.10 ± 0.04 | −0.09 | −0.11 | 2.4 | hurts |  |
| 2068 | Avenger of Greed | 14 | Class | — | Convocation of Greed: an Effect on an ally | −0.10 ± 0.05 | −0.08 | −0.12 | 13.2 | hurts |  |
| 2069 | Touch Focus | 16 | Class | — | Touch Focus copies of 2 damage spells: +2 to the spell attack, and the target knocked prone when it's hurt | −0.10 ± 0.07 | −0.03 | −0.17 | 7.5 | no clear effect |  |
| 2070 | Covering Stance | 2 | Class | guardian | stance: an adjacent ally gets lesser cover (+1 AC) until its next turn | −0.10 ± 0.03 | −0.13 | −0.07 | 2.7 | hurts |  |
| 2071 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.10 ± 0.04 | −0.02 | −0.18 | 2.5 | hurts |  |
| 2072 | Heroic Presence | 17 | Ancestry | — | innate spell: Zealous Conviction (rank 6) | −0.10 ± 0.06 | −0.08 | −0.12 | 1.0 | no clear effect |  |
| 2073 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.03 | −0.11 | −0.09 | 2.3 | hurts |  |
| 2074 | Penetrating Projectile | 16 | Class | barbarian | a ranged Strike at up to two foes in a line, raging | −0.10 ± 0.04 | +0.00 | −0.20 | 3.8 | hurts | with a loaded arquebus |
| 2075 | Basic Blood Potency | 4 | Class | — | Bleed Out: a spell attack for 1 persistent bleed (1 action, three a fight; its blood magic requirement not checked) | −0.10 ± 0.04 | −0.14 | −0.06 | 2.9 | hurts |  |
| 2076 | Rejuvenating Touch | 18 | Class | champion | 10 temporary Hit Points, renewed each turn for 10 rounds, for an ally its Lay on Hands heals | −0.10 ± 0.04 | −0.07 | −0.13 | 0.4 | hurts |  |
| 2077 | Claw Stance | 0 | Action | — | PF2e's stance Effect | −0.10 ± 0.05 | −0.14 | −0.06 | 1.1 | hurts |  |
| 2078 | Warning Shot | 2 | Class | gunslinger | check | −0.10 ± 0.06 | −0.12 | −0.08 | 2.6 | no clear effect |  |
| 2079 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.10 ± 0.03 | −0.10 | −0.10 | 1.5 | hurts |  |
| 2080 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.10 ± 0.05 | −0.04 | −0.16 | 4.1 | no clear effect |  |
| 2081 | Taste Blood | 5 | Ancestry | — | save | −0.10 ± 0.03 | −0.07 | −0.13 | 3.0 | hurts |  |
| 2082 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | −0.10 ± 0.06 | −0.18 | −0.03 | 1.0 | no clear effect |  |
| 2083 | Flash of Omnipresence | 14 | Class | — | save | −0.10 ± 0.05 | −0.17 | −0.03 | 1.0 | hurts |  |
| 2084 | Interrupt Charge | 8 | Class | — | check | −0.10 ± 0.04 | −0.00 | −0.21 | 8.7 | hurts |  |
| 2085 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | −0.11 ± 0.04 | −0.03 | −0.18 | 1.0 | hurts |  |
| 2086 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.11 ± 0.04 | +0.01 | −0.22 | 2.0 | hurts |  |
| 2087 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | −0.11 ± 0.07 | +0.01 | −0.22 | 1.1 | no clear effect |  |
| 2088 | Feast | 4 | Class | — | check | −0.11 ± 0.05 | −0.20 | −0.02 | 2.0 | hurts |  |
| 2089 | Greater Deathly Secrets | 10 | Class | — | innate spells: Malignant Sustenance (rank 4), Grasping Grave (rank 5) | −0.11 ± 0.05 | −0.10 | −0.11 | 1.5 | hurts |  |
| 2090 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.11 ± 0.06 | −0.07 | −0.14 | 1.0 | no clear effect |  |
| 2091 | Arcane Camouflage | 9 | Ancestry | — | innate spells: Blur (rank 2), Invisibility (rank 2) | −0.11 ± 0.05 | −0.04 | −0.18 | 2.0 | hurts |  |
| 2092 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.11 ± 0.07 | −0.10 | −0.11 | 1.2 | no clear effect |  |
| 2093 | Infuse Void | 8 | Class | — | Infuse Void copies of 2 grave spells: void damage of its rank more on each creature hurt | −0.11 ± 0.03 | −0.15 | −0.07 | 2.4 | hurts |  |
| 2094 | Spiritual Awakening | 4 | Class | — | Spiritual Expansion Spell: widened copies of 3 area spells | −0.11 ± 0.06 | −0.17 | −0.05 | 2.2 | no clear effect |  |
| 2095 | Coiling Serpents | 0 | Action | — | a ranged Strike; on a hit Reflex or immobilized (2 actions) | −0.11 ± 0.05 | −0.14 | −0.08 | 2.3 | hurts |  |
| 2096 | History of Violence | 14 | Class | — | Strike activity | −0.11 ± 0.06 | −0.08 | −0.14 | 1.0 | no clear effect |  |
| 2097 | Slam Down | 4 | Class | fighter | Strike activity | −0.11 ± 0.05 | −0.22 | −0.01 | 2.7 | hurts |  |
| 2098 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.11 ± 0.03 | −0.07 | −0.16 | 0.9 | hurts |  |
| 2099 | Ride the Tsunami | 18 | Class | kineticist | save | −0.11 ± 0.05 | −0.16 | −0.07 | 0.0 | hurts | the AI never used it |
| 2100 | Suplex | 4 | Class | — | Strike activity | −0.11 ± 0.05 | −0.12 | −0.11 | 3.0 | hurts |  |
| 2101 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.11 ± 0.04 | −0.07 | −0.15 | 1.0 | hurts |  |
| 2102 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.11 ± 0.04 | −0.14 | −0.08 | 1.0 | hurts |  |
| 2103 | Devil's Wings | 16 | Class | — | a 25-foot fly Speed (against fliers) | −0.11 ± 0.04 | +0.02 | −0.24 | 0.0 | hurts | the AI never used it |
| 2104 | Skirt the Underworld | 0 | Action | — | save | −0.11 ± 0.04 | −0.17 | −0.06 | 2.0 | hurts |  |
| 2105 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.11 ± 0.04 | −0.06 | −0.17 | 3.9 | hurts |  |
| 2106 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.12 ± 0.04 | −0.07 | −0.16 | 1.0 | hurts |  |
| 2107 | Bat Around | 16 | Class | — | a melee Strike, then a Shove (a push on a hit; 2 actions) | −0.12 ± 0.04 | −0.11 | −0.12 | 15.7 | hurts |  |
| 2108 | Boneyard Acquaintance | 17 | Ancestry | — | innate spell: Spiritual Guardian (rank 9) | −0.12 ± 0.05 | −0.02 | −0.21 | 5.4 | hurts |  |
| 2109 | Brutal Bully | 6 | Class | barbarian | Strength damage on a successful maneuver (always on; raging not checked) | −0.12 ± 0.04 | −0.17 | −0.06 | 4.1 | hurts |  |
| 2110 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | −0.12 ± 0.05 | −0.06 | −0.17 | 10.4 | hurts |  |
| 2111 | Guerrilla Assault | 0 | Action | — | Strike activity | −0.12 ± 0.03 | −0.24 | +0.00 | 1.6 | hurts |  |
| 2112 | Armor in Earth | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -10 feet Speed (1 action) | −0.12 ± 0.06 | −0.05 | −0.18 | 1.0 | hurts |  |
| 2113 | Wither Away | 16 | Class | — | save | −0.12 ± 0.05 | −0.23 | −0.00 | 1.0 | hurts |  |
| 2114 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.12 ± 0.04 | −0.16 | −0.07 | 2.8 | hurts |  |
| 2115 | Surging Smash | 6 | Class | — | save (requirement assumed: You are overflowing) | −0.12 ± 0.04 | −0.09 | −0.15 | 2.4 | hurts |  |
| 2116 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 2.5 | hurts |  |
| 2117 | Flower Street Infamy | 11 | Skill | — | check | −0.12 ± 0.04 | −0.08 | −0.16 | 3.7 | hurts |  |
| 2118 | Lead by Example | 8 | Class | — | Strike activity | −0.12 ± 0.02 | −0.15 | −0.09 | 6.2 | hurts |  |
| 2119 | Triggerbrand Blitz | 14 | Class | gunslinger | a Stride and three Strikes at three foes, one multiple attack penalty, then fatigued (3 actions, once a fight) | −0.12 ± 0.08 | +0.00 | −0.24 | 1.0 | no clear effect |  |
| 2120 | Devastating Spellstrike | 4 | Class | magus | check | −0.12 ± 0.08 | −0.07 | −0.17 | 2.6 | no clear effect |  |
| 2121 | Raise Menhir | 8 | Class | druid | effect | −0.12 ± 0.08 | −0.13 | −0.11 | 1.0 | no clear effect |  |
| 2122 | Shielding Taunt | 2 | Class | guardian | Taunt that raises its shield | −0.12 ± 0.04 | +0.09 | −0.33 | 0.0 | hurts | the AI never used it |
| 2123 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.16 | −0.08 | 1.0 | hurts |  |
| 2124 | Grudge Strike | 6 | Class | animist | Strike activity (requirement assumed: Your attuned apparition grants Heraldry Lore or Underworld Lore as an apparition skill) | −0.12 ± 0.07 | −0.13 | −0.12 | 2.5 | no clear effect |  |
| 2125 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | −0.12 ± 0.06 | −0.10 | −0.14 | 3.1 | hurts |  |
| 2126 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.12 ± 0.04 | −0.14 | −0.11 | 3.3 | hurts |  |
| 2127 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | −0.12 ± 0.04 | −0.14 | −0.11 | 1.5 | hurts |  |
| 2128 | Swing the Censer | 0 | Action | — | check | −0.12 ± 0.05 | −0.15 | −0.09 | 1.0 | hurts |  |
| 2129 | Avenger of Gluttony | 14 | Class | — | Gluttonous Feast: save | −0.13 ± 0.04 | −0.15 | −0.10 | 1.0 | hurts |  |
| 2130 | Arcane Slam | 9 | Ancestry | — | check | −0.13 ± 0.05 | −0.07 | −0.18 | 2.4 | hurts |  |
| 2131 | Giant's Lunge | 14 | Class | barbarian | reach 10 feet while raging (1 action) | −0.13 ± 0.07 | −0.15 | −0.10 | 1.0 | no clear effect |  |
| 2132 | Hardwood Armor | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -5 feet Speed (1 action) | −0.13 ± 0.06 | −0.07 | −0.18 | 1.0 | hurts |  |
| 2133 | Metal Carapace | 1 | Class | kineticist | its impulse armor for the fight: +1 AC, -5 feet Speed (1 action) | −0.13 ± 0.06 | −0.07 | −0.18 | 1.0 | hurts |  |
| 2134 | You Can't Keep Us Down | 14 | Class | — | check | −0.13 ± 0.04 | −0.13 | −0.12 | 0.9 | hurts |  |
| 2135 | Feral Toss | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | −0.13 ± 0.06 | −0.14 | −0.11 | 4.0 | no clear effect |  |
| 2136 | Megaton Strike | 4 | Class | inventor | Strike activity | −0.13 ± 0.06 | −0.25 | −0.01 | 4.8 | hurts |  |
| 2137 | Poisoner's Twist | 4 | Class | — | check | −0.13 ± 0.05 | −0.02 | −0.23 | 5.9 | hurts |  |
| 2138 | Mage Hunter | 6 | Class | barbarian | a 2-action Strike, stupefied 1 (2 on a critical hit) until its next turn (whether it saw a spell cast isn't checked) | −0.13 ± 0.05 | −0.17 | −0.08 | 5.1 | hurts |  |
| 2139 | Channeled Protection | 4 | Class | animist | effect | −0.13 ± 0.07 | −0.18 | −0.08 | 6.4 | no clear effect |  |
| 2140 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.13 ± 0.04 | −0.06 | −0.20 | 3.0 | hurts |  |
| 2141 | Summon Nephilim Kin | 13 | Ancestry | — | innate spell: Summon Celestial (rank 5), Summon Fiend (rank 5) | −0.13 ± 0.06 | −0.19 | −0.06 | 1.0 | hurts |  |
| 2142 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.13 ± 0.07 | −0.14 | −0.12 | 5.4 | no clear effect | with two weapons (longsword and shortsword) |
| 2143 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | −0.13 ± 0.05 | −0.11 | −0.15 | 5.0 | hurts |  |
| 2144 | The Harder They Fall (Kingmaker) | 8 | Class | ranger | bludgeoning damage on a successful Trip (always on) | −0.13 ± 0.04 | −0.09 | −0.16 | 3.4 | hurts |  |
| 2145 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.13 ± 0.05 | −0.24 | −0.02 | 15.9 | hurts |  |
| 2146 | Staggering Fire | 6 | Class | — | Strike activity | −0.13 ± 0.04 | −0.08 | −0.18 | 8.8 | hurts |  |
| 2147 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.13 ± 0.04 | −0.16 | −0.11 | 0.9 | hurts |  |
| 2148 | Fumigate | 14 | Class | — | Strike activity | −0.13 ± 0.05 | −0.11 | −0.16 | 5.8 | hurts |  |
| 2149 | Ringing Challenge | 0 | Action | — | save | −0.13 ± 0.04 | −0.16 | −0.10 | 2.0 | hurts |  |
| 2150 | Heavy is the Crown | 0 | Action | — | inline save: 15-foot burst, will, 1 spirit (DC 17) | −0.13 ± 0.04 | −0.11 | −0.16 | 1.5 | hurts |  |
| 2151 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.13 ± 0.05 | −0.09 | −0.18 | 4.3 | hurts |  |
| 2152 | Overextending Feint | 1 | Class | rogue | Feint (forced), each one goading (–2 to the foe's next attack on the PC, all on a critical success) instead of off-guard | −0.13 ± 0.03 | −0.15 | −0.11 | 3.0 | hurts |  |
| 2153 | Felling Strike | 8 | Class | fighter | Strike activity | −0.13 ± 0.04 | −0.19 | −0.08 | 8.0 | hurts |  |
| 2154 | Storming Gaze | 5 | Ancestry | — | inline save: 15-foot cone, reflex, 3d4 fire (DC 21) | −0.13 ± 0.03 | −0.08 | −0.19 | 2.4 | hurts |  |
| 2155 | Wildborn Adept | 5 | Ancestry | — | innate spells: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | −0.13 ± 0.03 | −0.18 | −0.09 | 1.6 | hurts |  |
| 2156 | Valkyrie's Charge | 0 | Action | commander | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.5 | hurts |  |
| 2157 | Kneecap | 5 | Ancestry | — | Strike activity | −0.13 ± 0.02 | −0.10 | −0.17 | 8.4 | hurts |  |
| 2158 | Hallowed Initiate | 4 | Class | — | innate spell: Call of the Grave (rank 1), Death's Call (rank 1) | −0.13 ± 0.04 | −0.22 | −0.05 | 0.8 | hurts |  |
| 2159 | Create a Diversion | 0 | Action | — | check | −0.13 ± 0.05 | −0.01 | −0.26 | 1.4 | hurts |  |
| 2160 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.13 ± 0.06 | −0.00 | −0.27 | 13.4 | hurts |  |
| 2161 | Towering Presence | 5 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.03 | −0.14 | −0.13 | 2.3 | hurts |  |
| 2162 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.14 ± 0.05 | −0.14 | −0.13 | 5.8 | hurts |  |
| 2163 | Buzzing Death Cicadas | 12 | Class | — | Death Drone: save | −0.14 ± 0.05 | −0.15 | −0.12 | 4.2 | hurts |  |
| 2164 | Ranger's Bramble | 6 | Class | ranger | innate spell: Ranger's Bramble (rank 3) | −0.14 ± 0.06 | −0.11 | −0.16 | 4.9 | hurts |  |
| 2165 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.14 ± 0.04 | −0.11 | −0.16 | 2.3 | hurts |  |
| 2166 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.14 ± 0.05 | +0.01 | −0.29 | 1.0 | hurts |  |
| 2167 | Aerial Flash | 12 | Class | — | a melee Strike at a foe up to 60 feet away (3 actions) | −0.14 ± 0.04 | −0.06 | −0.21 | 2.3 | hurts |  |
| 2168 | Lethal Finisher | 18 | Class | swashbuckler | a finisher Strike; on a hit Fortitude for 6 to 18d6 precision instead of its finisher dice | −0.14 ± 0.05 | −0.12 | −0.16 | 7.4 | hurts |  |
| 2169 | Companion's Cry | 4 | Class | ranger | Commanded with 2 actions every turn: the companion's third action | −0.14 ± 0.05 | −0.19 | −0.09 | 11.0 | hurts |  |
| 2170 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spells: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | −0.14 ± 0.05 | −0.08 | −0.20 | 2.1 | hurts |  |
| 2171 | Sunbird Glare | 6 | Class | — | save (requirement assumed: You're in bright light) | −0.14 ± 0.04 | −0.00 | −0.28 | 3.5 | hurts |  |
| 2172 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.14 ± 0.05 | −0.14 | −0.15 | 4.7 | hurts |  |
| 2173 | Deflecting Pulse | 6 | Class | — | Turn Aside Ambient Magic: PF2e's self Effect | −0.14 ± 0.05 | −0.17 | −0.11 | 2.9 | hurts |  |
| 2174 | Basic Arcana | 4 | Class | — | Energy Ablation: Energy Ablation copies of 6 damage spells: resistance of the spell's rank to the foes' main energy damage (fire if none) till the end of its next turn | −0.14 ± 0.05 | −0.25 | −0.04 | 2.1 | hurts |  |
| 2175 | Targeting Shot | 14 | Class | ranger | a ranged press Strike ignoring concealment and cover | −0.14 ± 0.07 | −0.15 | −0.14 | 12.6 | hurts |  |
| 2176 | Xidao Sea Mine Drop | 6 | Class | inventor | save | −0.14 ± 0.06 | −0.04 | −0.25 | 3.3 | hurts |  |
| 2177 | Call Draconic Ally | 14 | Class | — | innate spell: Summon Dragon (rank 7) | −0.14 ± 0.07 | −0.19 | −0.10 | 1.0 | no clear effect |  |
| 2178 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | −0.14 ± 0.04 | −0.15 | −0.14 | 1.0 | hurts |  |
| 2179 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | −0.15 ± 0.04 | −0.15 | −0.14 | 1.0 | hurts |  |
| 2180 | Collateral Reinforcement | 6 | Class | — | an Effect on an ally | −0.15 ± 0.04 | −0.11 | −0.18 | 4.8 | hurts |  |
| 2181 | Ley Line Conduit | 20 | Class | druid | Ley Line Conduit copies of 9 damage spells: once a fight, a spell of 5th rank or lower cast without its slot | −0.15 ± 0.08 | −0.28 | −0.01 | 2.0 | no clear effect |  |
| 2182 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.15 ± 0.05 | −0.11 | −0.19 | 1.0 | hurts |  |
| 2183 | Magical Adaptation | 10 | Class | — | innate spells: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | −0.15 ± 0.04 | −0.07 | −0.23 | 1.0 | hurts |  |
| 2184 | Hypnotic Lure | 5 | Ancestry | — | inline save: 1 creature, 30 feet, will (DC 21, 1/fight) | −0.15 ± 0.03 | −0.12 | −0.17 | 1.2 | hurts |  |
| 2185 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.15 ± 0.05 | −0.16 | −0.14 | 1.1 | hurts |  |
| 2186 | Night's Glow | 6 | Class | — | innate spells: Moonbeam (rank 1), Zenith Star (rank 1) | −0.15 ± 0.04 | −0.11 | −0.19 | 1.0 | hurts |  |
| 2187 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.15 ± 0.06 | −0.13 | −0.17 | 3.2 | hurts |  |
| 2188 | Flensing Slice | 8 | Class | — | check | −0.15 ± 0.04 | +0.09 | −0.39 | 9.5 | hurts |  |
| 2189 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | −0.15 ± 0.05 | −0.15 | −0.15 | 1.0 | hurts |  |
| 2190 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.15 ± 0.04 | −0.30 | −0.01 | 2.2 | hurts |  |
| 2191 | Spirit's Wrath | 12 | Class | barbarian | check | −0.15 ± 0.06 | −0.20 | −0.10 | 10.0 | hurts |  |
| 2192 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.15 ± 0.04 | −0.06 | −0.25 | 1.0 | hurts |  |
| 2193 | Venipuncture | 10 | Class | — | save | −0.15 ± 0.06 | −0.28 | −0.02 | 1.5 | hurts |  |
| 2194 | Tail Spin | 5 | Ancestry | — | check | −0.15 ± 0.04 | −0.15 | −0.16 | 2.5 | hurts |  |
| 2195 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | −0.15 ± 0.04 | −0.09 | −0.21 | 1.0 | hurts |  |
| 2196 | Homing Shot | 14 | Class | — | a ranged Strike ignoring concealment and cover | −0.15 ± 0.06 | −0.14 | −0.17 | 14.1 | hurts | with a loaded arquebus |
| 2197 | Multishot Stance | 16 | Class | fighter | stance: Double Shot's penalty −1 (from −2) (in Double Shot) | −0.15 ± 0.06 | −0.14 | −0.16 | 1.1 | hurts | with a bow in hand |
| 2198 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.15 ± 0.08 | −0.22 | −0.08 | 3.3 | no clear effect |  |
| 2199 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.15 ± 0.03 | −0.11 | −0.20 | 0.9 | hurts |  |
| 2200 | Split Shot | 4 | Class | sorcerer | Split Shot copies of 2 damage spells: a second foe takes half the damage when the roll beats its AC too | −0.15 ± 0.03 | −0.16 | −0.15 | 1.7 | hurts |  |
| 2201 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.16 ± 0.04 | −0.09 | −0.22 | 2.7 | hurts |  |
| 2202 | Horn and Bone Incantation | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Humanoid Form (rank 2) | −0.16 ± 0.05 | −0.29 | −0.03 | 1.0 | hurts |  |
| 2203 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.16 ± 0.05 | −0.08 | −0.23 | 1.0 | hurts |  |
| 2204 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.16 ± 0.05 | −0.08 | −0.23 | 1.0 | hurts |  |
| 2205 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.16 ± 0.05 | −0.08 | −0.23 | 1.0 | hurts |  |
| 2206 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.16 ± 0.05 | −0.22 | −0.10 | 1.5 | hurts |  |
| 2207 | Violent Vines | 13 | Ancestry | — | innate spell: Murderous Vine (rank 4) | −0.16 ± 0.05 | −0.14 | −0.18 | 1.0 | hurts |  |
| 2208 | Jotun's Grasp | 5 | Ancestry | — | check | −0.16 ± 0.04 | −0.17 | −0.15 | 2.4 | hurts |  |
| 2209 | Ascend | 14 | Class | — | a 25-foot fly Speed (against fliers) | −0.16 ± 0.04 | −0.09 | −0.23 | 0.0 | hurts | the AI never used it |
| 2210 | Mortal Ascension | 14 | Class | — | a 25-foot fly Speed (against fliers) | −0.16 ± 0.04 | −0.09 | −0.23 | 0.0 | hurts | the AI never used it |
| 2211 | Painful Spell | 4 | Class | — | Painful Spell copies of 3 damage spells: 1d4 mental a rank more, and as much to itself | −0.16 ± 0.05 | −0.26 | −0.06 | 3.5 | hurts |  |
| 2212 | Momentum Strike | 10 | Class | guardian | a melee Strike that pushes its target 5 feet (10 on a critical hit; flourish, 2 actions) | −0.16 ± 0.04 | −0.24 | −0.08 | 4.5 | hurts |  |
| 2213 | Cavalier's Charge | 4 | Class | — | its mount's two Strides and a Strike at +1 | −0.16 ± 0.04 | −0.26 | −0.06 | 10.3 | hurts |  |
| 2214 | Sleeper Hold | 10 | Class | monk | check | −0.16 ± 0.06 | −0.20 | −0.12 | 4.3 | hurts |  |
| 2215 | All Returns To Slumber | 6 | Class | — | save (requirement assumed: Your waking world is active) | −0.16 ± 0.04 | −0.04 | −0.28 | 3.3 | hurts |  |
| 2216 | Devastating Weaponry | 18 | Class | inventor | a Strike at each enemy within 30 feet (3 actions) | −0.16 ± 0.07 | +0.00 | −0.32 | 3.7 | hurts |  |
| 2217 | Aerial Piledriver | 10 | Class | — | a Strike on a grabbed foe with 1d6 more a weapon die (2 actions; the fall not played) | −0.16 ± 0.07 | −0.19 | −0.14 | 2.4 | hurts |  |
| 2218 | Rise Up! | 12 | Class | — | effect | −0.16 ± 0.05 | −0.22 | −0.11 | 1.0 | hurts |  |
| 2219 | Convocation of Greed | 0 | Action | — | an Effect on an ally | −0.16 ± 0.04 | −0.11 | −0.21 | 8.6 | hurts |  |
| 2220 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | −0.16 ± 0.03 | −0.20 | −0.12 | 1.0 | hurts |  |
| 2221 | Vexing Tumble | 6 | Class | swashbuckler | check | −0.16 ± 0.04 | −0.08 | −0.24 | 6.3 | hurts |  |
| 2222 | Electrogenesis | 6 | Class | — | save | −0.16 ± 0.05 | −0.16 | −0.17 | 1.0 | hurts |  |
| 2223 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.16 ± 0.06 | −0.23 | −0.09 | 1.0 | hurts |  |
| 2224 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | −0.16 ± 0.07 | −0.15 | −0.17 | 1.1 | hurts |  |
| 2225 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.16 ± 0.05 | −0.04 | −0.29 | 1.0 | hurts |  |
| 2226 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.17 ± 0.04 | −0.18 | −0.15 | 1.0 | hurts |  |
| 2227 | Core Cannon | 17 | Ancestry | — | PF2e's self Effect | −0.17 ± 0.05 | −0.28 | −0.06 | 1.0 | hurts |  |
| 2228 | Parting Shot | 4 | Class | fighter | Strike activity | −0.17 ± 0.05 | −0.27 | −0.06 | 4.7 | hurts | with a bow in hand |
| 2229 | Monkey Spirits | 13 | Ancestry | — | Mad Monkeys' Raucous Din: foes in a 10-foot burst a Fortitude save (DC 32) or deafened (3 actions, once a fight; Sustains not played) | −0.17 ± 0.04 | −0.09 | −0.24 | 1.0 | hurts |  |
| 2230 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.17 ± 0.04 | −0.17 | −0.16 | 4.1 | hurts |  |
| 2231 | Waking Dream | 8 | Class | — | innate spell: Waking Dream (rank 4) | −0.17 ± 0.04 | −0.16 | −0.18 | 1.0 | hurts |  |
| 2232 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.17 ± 0.05 | −0.07 | −0.26 | 1.0 | hurts |  |
| 2233 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | −0.17 ± 0.05 | −0.07 | −0.27 | 1.0 | hurts |  |
| 2234 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.17 ± 0.05 | −0.18 | −0.16 | 1.0 | hurts |  |
| 2235 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.17 ± 0.07 | −0.26 | −0.07 | 8.2 | hurts |  |
| 2236 | Clobber | 16 | Class | guardian | Strike activity | −0.17 ± 0.05 | −0.17 | −0.17 | 7.6 | hurts |  |
| 2237 | Hedge Prison | 6 | Class | druid | innate spell: Hedge Prison (rank 3) | −0.17 ± 0.05 | −0.16 | −0.18 | 1.0 | hurts |  |
| 2238 | Chronomancer's Secrets | 8 | Class | — | innate spell: Stasis (rank 4), Path of Least Resistance (rank 4) | −0.17 ± 0.04 | −0.13 | −0.21 | 1.0 | hurts |  |
| 2239 | Soaring Shape | 8 | Class | druid | Untamed Form's aerial shapes (Aerial Form, rank 4) (in Untamed Form) | −0.17 ± 0.09 | −0.26 | −0.08 | 1.0 | hurts |  |
| 2240 | Decree of Execution | 18 | Class | — | save | −0.17 ± 0.05 | −0.25 | −0.10 | 1.0 | hurts |  |
| 2241 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.17 ± 0.05 | −0.02 | −0.32 | 7.4 | hurts |  |
| 2242 | My Kingdom, My Blood | 16 | Class | — | its first turn's 3 actions: an aura where it takes half an ally's damage (reaction) | −0.17 ± 0.06 | −0.13 | −0.22 | 2.7 | hurts |  |
| 2243 | Grim Swagger | 0 | Action | gunslinger | check (requirement assumed: You have a one-handed firearm or one-handed crossbow visibly worn or wielded) | −0.17 ± 0.05 | −0.07 | −0.28 | 1.4 | hurts |  |
| 2244 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.17 ± 0.05 | −0.12 | −0.23 | 1.6 | hurts |  |
| 2245 | Captivating Charm | 0 | Action | — | save | −0.17 ± 0.05 | −0.21 | −0.14 | 2.0 | hurts |  |
| 2246 | Summon Metal Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.18 ± 0.05 | −0.24 | −0.11 | 1.0 | hurts |  |
| 2247 | Summon Wood Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.18 ± 0.05 | −0.24 | −0.11 | 1.0 | hurts |  |
| 2248 | Strangle | 8 | Class | — | Strike activity | −0.18 ± 0.05 | −0.17 | −0.18 | 8.7 | hurts |  |
| 2249 | Form of the Dragon | 17 | Ancestry | — | innate spell: Dragon Form (rank 8) | −0.18 ± 0.06 | −0.06 | −0.29 | 1.0 | hurts |  |
| 2250 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.18 ± 0.05 | −0.06 | −0.30 | 1.0 | hurts |  |
| 2251 | Confusing Commands | 16 | Class | commander | save | −0.18 ± 0.08 | −0.05 | −0.30 | 4.7 | hurts |  |
| 2252 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.18 ± 0.06 | −0.18 | −0.18 | 2.0 | hurts |  |
| 2253 | Forceful Shot | 14 | Class | — | Strike activity | −0.18 ± 0.04 | −0.22 | −0.14 | 6.6 | hurts |  |
| 2254 | Bloodline Conduit | 20 | Class | sorcerer | Bloodline Conduit copies of 10 damage spells: once a fight, a spell of 5th rank or lower cast without its slot | −0.18 ± 0.08 | −0.10 | −0.26 | 1.5 | hurts |  |
| 2255 | Aether Blast | 4 | Class | — | save (requirement assumed: You are overflowing) | −0.18 ± 0.05 | −0.22 | −0.14 | 8.4 | hurts |  |
| 2256 | Thunderclap Spell | 10 | Class | druid | Thunderclap Spell copies of 4 spells | −0.18 ± 0.07 | −0.09 | −0.27 | 3.5 | hurts |  |
| 2257 | Merciless Rend | 10 | Class | summoner | check | −0.18 ± 0.07 | −0.19 | −0.17 | 17.6 | hurts |  |
| 2258 | Soothing Ballad | 14 | Class | bard | innate spell: Soothing Ballad (rank 7) | −0.18 ± 0.04 | −0.19 | −0.17 | 1.0 | hurts |  |
| 2259 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.18 ± 0.07 | −0.24 | −0.13 | 5.0 | hurts | with a warhammer and a free hand |
| 2260 | Dazing Blow | 6 | Class | fighter | Strike activity | −0.18 ± 0.05 | −0.11 | −0.26 | 6.5 | hurts |  |
| 2261 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.19 ± 0.05 | −0.19 | −0.19 | 1.9 | hurts |  |
| 2262 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.19 ± 0.05 | −0.11 | −0.26 | 7.0 | hurts |  |
| 2263 | Light-Bending Jewel | 13 | Ancestry | — | innate spell: Invisibility (rank 2), Translocate (rank 4) | −0.19 ± 0.04 | −0.17 | −0.21 | 1.0 | hurts |  |
| 2264 | Thrall Charger | 4 | Class | — | Thrall Charge (a cantrip): a thrall Strike with 2d6 more, the thrall destroyed for +2 (rated on a necromancer; its Stride not played) | −0.19 ± 0.04 | −0.25 | −0.13 | 3.1 | hurts |  |
| 2265 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.19 ± 0.05 | −0.15 | −0.23 | 1.0 | hurts |  |
| 2266 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.19 ± 0.05 | −0.15 | −0.23 | 1.0 | hurts |  |
| 2267 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.19 ± 0.05 | −0.15 | −0.23 | 1.0 | hurts |  |
| 2268 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.19 ± 0.04 | −0.22 | −0.16 | 1.9 | hurts |  |
| 2269 | Ancestor's Rage | 13 | Ancestry | — | innate spell: Animal Form (rank 5) | −0.19 ± 0.05 | −0.25 | −0.13 | 1.0 | hurts |  |
| 2270 | Giant's Stature | 6 | Class | barbarian | PF2e's self Effect | −0.19 ± 0.05 | −0.19 | −0.20 | 1.0 | hurts |  |
| 2271 | Summon Earth Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.19 ± 0.06 | −0.22 | −0.17 | 1.0 | hurts |  |
| 2272 | Ferocious Gust | 9 | Ancestry | — | save | −0.20 ± 0.04 | −0.12 | −0.27 | 1.0 | hurts |  |
| 2273 | Improvise Strategy | 7 | Skill | — | a foe off-guard till the end of its next turn (its Warfare Lore against its Perception played as its Will save; bravado) | −0.20 ± 0.04 | −0.23 | −0.17 | 7.2 | hurts |  |
| 2274 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.20 ± 0.05 | −0.22 | −0.18 | 2.6 | hurts |  |
| 2275 | Might of the Realm | 14 | Class | — | Strike activity | −0.20 ± 0.07 | −0.23 | −0.17 | 4.1 | hurts |  |
| 2276 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.20 ± 0.03 | −0.21 | −0.19 | 2.7 | hurts |  |
| 2277 | Connect the Dots | 6 | Class | investigator | 2 actions: on a critical success, the foe off-guard for a round (an ally's Pursue a Lead bonus; a Perception check played as the foe's Will save) | −0.20 ± 0.07 | −0.29 | −0.11 | 2.8 | hurts |  |
| 2278 | Watch Your Back (Golden Legionnaire) | 14 | Class | — | can't be flanked until its next turn (1 action; on itself, not an ally) | −0.20 ± 0.07 | −0.24 | −0.16 | 4.1 | hurts |  |
| 2279 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.20 ± 0.04 | −0.12 | −0.28 | 1.0 | hurts |  |
| 2280 | Weft and Warp | 16 | Class | — | Strike activity | −0.20 ± 0.05 | −0.11 | −0.30 | 2.4 | hurts |  |
| 2281 | Disciple's Breath | 16 | Class | — | save | −0.20 ± 0.06 | −0.14 | −0.27 | 3.1 | hurts |  |
| 2282 | Sovereign's Blade | 18 | Class | — | an Effect on an ally | −0.20 ± 0.05 | −0.20 | −0.20 | 6.0 | hurts |  |
| 2283 | Song of the Fallen | 20 | Class | bard | innate spell: Song of the Fallen (rank 10) | −0.20 ± 0.03 | −0.21 | −0.20 | 1.0 | hurts |  |
| 2284 | Helpful Tinkering | 10 | Class | inventor | check | −0.20 ± 0.06 | −0.25 | −0.16 | 1.0 | hurts |  |
| 2285 | Infernal Interference | 16 | Class | — | Strike activity (requirement assumed: You're wielding your order's favored weapon) | −0.20 ± 0.05 | −0.20 | −0.21 | 4.7 | hurts |  |
| 2286 | Engraving Maneuver | 6 | Class | — | check | −0.20 ± 0.04 | −0.03 | −0.38 | 3.9 | hurts |  |
| 2287 | Vampiric Spell | 4 | Class | — | Vampiric Spell copies of 5 damage spells: temporary Hit Points of half the most damage dealt | −0.20 ± 0.04 | −0.32 | −0.09 | 3.2 | hurts |  |
| 2288 | Thaumaturge Dedication | 2 | Class | — | Glimpse Vulnerability: effect | −0.21 ± 0.05 | +0.01 | −0.42 | 3.3 | hurts |  |
| 2289 | Scattering Charge | 12 | Class | guardian | check | −0.21 ± 0.04 | +0.00 | −0.41 | 3.9 | hurts |  |
| 2290 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.21 ± 0.04 | −0.19 | −0.23 | 2.0 | hurts |  |
| 2291 | Tactical Takedown | 0 | Action | commander | save | −0.21 ± 0.05 | −0.26 | −0.16 | 2.3 | hurts |  |
| 2292 | Celestial Rebirth | 20 | Class | — | innate spell: Breath of Life (rank 5), Heal (rank 5), Raise Dead (rank 10) | −0.21 ± 0.06 | −0.28 | −0.14 | 2.0 | hurts |  |
| 2293 | Pivot Strike | 14 | Class | — | a Strike with twice its weapon dice in damage, then a Trip (its Leap and staff not checked) | −0.21 ± 0.06 | −0.18 | −0.24 | 7.1 | hurts |  |
| 2294 | Prayer Attack | 14 | Class | — | check | −0.21 ± 0.04 | −0.13 | −0.30 | 7.9 | hurts |  |
| 2295 | Guerrilla Weaponry | 4 | Class | — | Guerrilla Assault: Strike activity | −0.21 ± 0.06 | −0.45 | +0.02 | 2.5 | hurts |  |
| 2296 | Wing Shove | 8 | Class | — | check | −0.21 ± 0.03 | −0.43 | +0.00 | 2.7 | hurts |  |
| 2297 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.21 ± 0.06 | −0.12 | −0.31 | 5.5 | hurts |  |
| 2298 | Underhanded Assault | 2 | Class | rogue | a Sneak (Stealth −2 against its Perception DC), then a melee Strike it's off-guard to (2 actions) | −0.21 ± 0.05 | −0.21 | −0.22 | 2.3 | hurts |  |
| 2299 | Unbreaking Castle | 10 | Class | — | effect | −0.21 ± 0.07 | −0.29 | −0.13 | 2.9 | hurts | with a weapon and a shield |
| 2300 | Triple Shot | 6 | Class | fighter | Double Shot at one foe, or three ranged Strikes at –4 each (3 actions) (in Double Shot) | −0.21 ± 0.04 | −0.26 | −0.17 | 3.1 | hurts |  |
| 2301 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.21 ± 0.06 | −0.23 | −0.20 | 4.6 | hurts |  |
| 2302 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.22 ± 0.05 | −0.29 | −0.14 | 6.3 | hurts |  |
| 2303 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.22 ± 0.05 | −0.23 | −0.21 | 1.0 | hurts |  |
| 2304 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | −0.22 ± 0.03 | −0.15 | −0.28 | 1.0 | hurts | always on (its moment isn't checked) |
| 2305 | Bloom of Health | 14 | Class | — | an Effect on an ally | −0.22 ± 0.06 | −0.24 | −0.20 | 7.3 | hurts |  |
| 2306 | Wait For It... | 0 | Action | commander | an Effect on an ally | −0.22 ± 0.05 | −0.14 | −0.29 | 4.5 | hurts |  |
| 2307 | Headshot | 14 | Class | gunslinger | a 2-action firearm Strike; a critical hit on a foe it already hurt: a Fortitude save or it dies | −0.22 ± 0.11 | −0.29 | −0.15 | 6.7 | hurts |  |
| 2308 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.22 ± 0.06 | −0.30 | −0.14 | 4.0 | hurts |  |
| 2309 | Wheeling Grab | 6 | Class | — | check | −0.22 ± 0.04 | −0.18 | −0.26 | 3.0 | hurts |  |
| 2310 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.22 ± 0.04 | −0.31 | −0.14 | 4.3 | hurts |  |
| 2311 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.22 ± 0.04 | −0.24 | −0.21 | 1.0 | hurts |  |
| 2312 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.23 ± 0.04 | −0.17 | −0.28 | 3.1 | hurts |  |
| 2313 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.23 ± 0.05 | −0.11 | −0.34 | 5.3 | hurts | with a one-handed weapon and a free hand |
| 2314 | Brandish Authority | 18 | Class | — | check | −0.23 ± 0.07 | −0.19 | −0.27 | 2.9 | hurts |  |
| 2315 | Come and Get Me | 10 | Class | barbarian | PF2e's self Effect | −0.23 ± 0.05 | −0.27 | −0.19 | 1.0 | hurts |  |
| 2316 | Bone Investiture | 13 | Ancestry | — | innate spell: Dinosaur Form (rank 5) | −0.23 ± 0.05 | −0.27 | −0.19 | 1.0 | hurts |  |
| 2317 | The Dead Walk | 10 | Class | oracle | check | −0.23 ± 0.06 | −0.24 | −0.22 | 3.0 | hurts |  |
| 2318 | Asura Magic | 9 | Ancestry | — | innate spells: Blood Vendetta (rank 2), Death Knell (rank 2) | −0.23 ± 0.06 | −0.24 | −0.22 | 2.0 | hurts |  |
| 2319 | Eternity-Incinerating Blaze | 18 | Class | exemplar | Burn out of Time: heals 5d8 (touch) | −0.23 ± 0.04 | −0.25 | −0.22 | 4.3 | hurts |  |
| 2320 | Fast Channel | 14 | Class | cleric | Heal's 3-action version for 2 actions | −0.23 ± 0.05 | −0.13 | −0.33 | 0.0 | hurts | the AI never used it |
| 2321 | Glimpse Vulnerability | 0 | Action | — | effect | −0.23 ± 0.05 | −0.00 | −0.47 | 3.1 | hurts |  |
| 2322 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | −0.24 ± 0.06 | −0.28 | −0.19 | 1.0 | hurts |  |
| 2323 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.24 ± 0.05 | −0.28 | −0.19 | 1.0 | hurts |  |
| 2324 | Allegro | 14 | Class | bard | innate spell: Allegro (rank 7) | −0.24 ± 0.05 | −0.23 | −0.25 | 11.0 | hurts |  |
| 2325 | Animal Rage | 8 | Class | barbarian | innate spell: Animal Form (rank 3) | −0.24 ± 0.05 | −0.29 | −0.19 | 1.0 | hurts |  |
| 2326 | Launch Fireworks | 0 | Action | — | save | −0.24 ± 0.05 | −0.07 | −0.41 | 3.8 | hurts | with a one-handed weapon and a free hand |
| 2327 | Magical Scholastics | 4 | Class | — | innate spell: Detect Magic (rank 2), Guidance (rank 2), Read Aura (rank 2) | −0.24 ± 0.05 | −0.35 | −0.13 | 6.0 | hurts |  |
| 2328 | Magical Edification | 4 | Class | — | innate spell: Guidance (rank 2), Message (rank 2), Sigil (rank 2) | −0.24 ± 0.05 | −0.35 | −0.13 | 6.0 | hurts |  |
| 2329 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.24 ± 0.07 | −0.32 | −0.16 | 6.7 | hurts |  |
| 2330 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.24 ± 0.07 | −0.23 | −0.25 | 6.6 | hurts |  |
| 2331 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.24 ± 0.06 | −0.23 | −0.26 | 5.9 | hurts |  |
| 2332 | The Bigger They Are | 0 | Action | commander | +0 damage on its Strikes this turn (1 action; the Tumble Through taken as succeeding) | −0.24 ± 0.05 | −0.20 | −0.28 | 2.3 | hurts |  |
| 2333 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.24 ± 0.04 | −0.23 | −0.26 | 2.9 | hurts |  |
| 2334 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.24 ± 0.06 | −0.24 | −0.24 | 3.5 | hurts |  |
| 2335 | Detonating Spell | 6 | Class | cleric | Detonating Spell copies of 5 damage spells: splash of the spell's rank on the foes beside a target it damages (allies beside it kept out) | −0.24 ± 0.06 | −0.34 | −0.15 | 3.4 | hurts |  |
| 2336 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.25 ± 0.05 | −0.27 | −0.22 | 3.0 | hurts |  |
| 2337 | Spinebreaker | 10 | Class | — | check | −0.25 ± 0.06 | −0.35 | −0.15 | 4.3 | hurts |  |
| 2338 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.25 ± 0.05 | −0.17 | −0.34 | 1.0 | hurts |  |
| 2339 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.25 ± 0.05 | −0.17 | −0.34 | 1.0 | hurts |  |
| 2340 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.25 ± 0.05 | −0.17 | −0.34 | 1.0 | hurts |  |
| 2341 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.25 ± 0.05 | −0.17 | −0.34 | 1.0 | hurts |  |
| 2342 | Clashing Compound Invocation | 10 | Class | — | save | −0.25 ± 0.07 | −0.26 | −0.25 | 11.9 | hurts |  |
| 2343 | Rivethun Adept | 16 | Class | — | innate spell: Speak with Stones (rank 5), Spiritual Guardian (rank 5) | −0.26 ± 0.07 | −0.28 | −0.23 | 6.1 | hurts |  |
| 2344 | Steel on Steel | 4 | Class | exemplar | Ringing Challenge: save | −0.26 ± 0.05 | −0.32 | −0.19 | 3.0 | hurts |  |
| 2345 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.26 ± 0.05 | −0.23 | −0.28 | 1.0 | hurts |  |
| 2346 | Raise the Walls | 0 | Action | — | effect | −0.26 ± 0.05 | −0.12 | −0.40 | 3.6 | hurts |  |
| 2347 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | −0.26 ± 0.05 | −0.25 | −0.27 | 1.0 | hurts |  |
| 2348 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2349 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2350 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2351 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2352 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2353 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2354 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2355 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2356 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2357 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2358 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.26 | −0.25 | 2.3 | hurts |  |
| 2359 | Protect the Royal Line | 16 | Class | — | check | −0.26 ± 0.03 | −0.51 | −0.01 | 3.0 | hurts |  |
| 2360 | Boulder Roll | 5 | Ancestry | — | save | −0.26 ± 0.04 | −0.22 | −0.29 | 4.1 | hurts |  |
| 2361 | Grovel | 5 | Ancestry | — | check | −0.26 ± 0.03 | −0.08 | −0.44 | 6.9 | hurts |  |
| 2362 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | −0.26 ± 0.05 | −0.36 | −0.16 | 1.0 | hurts |  |
| 2363 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | −0.26 ± 0.05 | −0.25 | −0.27 | 1.0 | hurts |  |
| 2364 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | −0.26 ± 0.05 | −0.25 | −0.27 | 1.0 | hurts |  |
| 2365 | Drag Down | 5 | Ancestry | — | check | −0.26 ± 0.03 | −0.26 | −0.26 | 2.5 | hurts |  |
| 2366 | Steal for the Depths | 5 | Ancestry | — | check | −0.26 ± 0.03 | −0.26 | −0.26 | 2.5 | hurts |  |
| 2367 | Remember Their Names | 16 | Class | — | save | −0.26 ± 0.06 | −0.17 | −0.35 | 7.1 | hurts |  |
| 2368 | Transfusion | 8 | Class | — | an Effect on an ally | −0.26 ± 0.05 | −0.27 | −0.25 | 7.3 | hurts |  |
| 2369 | Uncanny Prediction | 8 | Class | — | save (requirement assumed: You're benefiting from the bonuses of Size Up) | −0.26 ± 0.04 | −0.12 | −0.41 | 3.1 | hurts |  |
| 2370 | Knockback Strike | 10 | Class | monk | Strike activity | −0.26 ± 0.06 | −0.30 | −0.22 | 4.7 | hurts |  |
| 2371 | Swimming Charge | 5 | Ancestry | — | check (requirement assumed: You are swimming in water) | −0.26 ± 0.04 | −0.26 | −0.26 | 4.1 | hurts |  |
| 2372 | Buckle-Cut Blitz | 0 | Action | commander | save | −0.26 ± 0.05 | −0.30 | −0.23 | 2.4 | hurts |  |
| 2373 | Archer's Aim | 8 | Class | — | Strike activity | −0.26 ± 0.05 | −0.35 | −0.17 | 6.9 | hurts |  |
| 2374 | Subjugation | 16 | Class | — | save | −0.26 ± 0.05 | −0.21 | −0.32 | 3.0 | hurts |  |
| 2375 | Declare Anathema | 16 | Class | — | check | −0.26 ± 0.06 | −0.30 | −0.23 | 1.0 | hurts |  |
| 2376 | Skeletal Transformation | 13 | Ancestry | — | innate spell: Animal Form (rank 2) | −0.27 ± 0.05 | −0.29 | −0.25 | 1.0 | hurts |  |
| 2377 | Binding Serpents Celestial Arrow | 6 | Class | exemplar | Coiling Serpents: a ranged Strike; on a hit Reflex or immobilized (2 actions) | −0.27 ± 0.05 | −0.30 | −0.24 | 5.6 | hurts |  |
| 2378 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | −0.27 ± 0.05 | −0.29 | −0.25 | 1.0 | hurts |  |
| 2379 | Fade Presence | 6 | Class | — | innate spells: Invisibility (rank 2), Silence (rank 2) | −0.27 ± 0.04 | −0.26 | −0.28 | 1.0 | hurts |  |
| 2380 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.27 ± 0.05 | −0.12 | −0.42 | 2.9 | hurts |  |
| 2381 | Fade Away | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Disguise Magic (rank 2) | −0.27 ± 0.05 | −0.25 | −0.30 | 1.0 | hurts |  |
| 2382 | Deathly Secrets | 6 | Class | — | innate spells: Eyes of the Dead (rank 3), Subjugate Undead (rank 3) | −0.27 ± 0.04 | −0.30 | −0.25 | 1.0 | hurts |  |
| 2383 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.28 ± 0.06 | −0.36 | −0.20 | 3.6 | hurts |  |
| 2384 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | −0.28 ± 0.07 | −0.30 | −0.26 | 3.7 | hurts | with a one-handed weapon and a free hand |
| 2385 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.28 ± 0.07 | −0.29 | −0.26 | 2.0 | hurts |  |
| 2386 | Mastermind's Eye | 6 | Class | — | Recall Knowledge: a foe off-guard till its next turn, a minute on a critical (its check against the foe's DC played as the foe's Will save) | −0.28 ± 0.05 | −0.13 | −0.43 | 8.2 | hurts |  |
| 2387 | Demolish Defenses | 18 | Class | guardian | save | −0.28 ± 0.06 | −0.48 | −0.07 | 5.7 | hurts |  |
| 2388 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.28 ± 0.06 | −0.24 | −0.32 | 4.7 | hurts |  |
| 2389 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.28 ± 0.06 | −0.27 | −0.29 | 2.0 | hurts |  |
| 2390 | Coerce the Current | 9 | Ancestry | — | save (requirement assumed: You are swimming in water) | −0.28 ± 0.05 | −0.22 | −0.34 | 4.9 | hurts |  |
| 2391 | Unbalancing Sweep | 12 | Class | barbarian | check | −0.28 ± 0.05 | −0.04 | −0.52 | 4.0 | hurts |  |
| 2392 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | −0.28 ± 0.04 | −0.23 | −0.33 | 1.0 | hurts |  |
| 2393 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.28 ± 0.05 | −0.26 | −0.31 | 2.4 | hurts |  |
| 2394 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.28 ± 0.05 | −0.26 | −0.31 | 2.4 | hurts |  |
| 2395 | Infiltration Assassination | 10 | Class | — | Strike activity (requirement assumed: You're wearing a loaded gauntlet bow) | −0.28 ± 0.07 | −0.34 | −0.22 | 5.6 | hurts |  |
| 2396 | Feint | 0 | Action | — | check | −0.28 ± 0.05 | −0.11 | −0.46 | 4.2 | hurts |  |
| 2397 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.28 ± 0.04 | −0.30 | −0.26 | 2.0 | hurts |  |
| 2398 | Clawdancer Dedication | 2 | Class | — | Claw Stance: PF2e's stance Effect | −0.28 ± 0.05 | −0.31 | −0.26 | 1.2 | hurts |  |
| 2399 | Hush | 14 | Class | — | save (requirement assumed: You are veiled) | −0.28 ± 0.06 | −0.13 | −0.44 | 3.7 | hurts |  |
| 2400 | Fey Life | 16 | Class | — | innate spell: Summon Fey (rank 7) | −0.28 ± 0.08 | −0.20 | −0.37 | 1.0 | hurts |  |
| 2401 | Putrefaction | 14 | Class | — | save | −0.29 ± 0.06 | −0.31 | −0.26 | 3.0 | hurts |  |
| 2402 | Velstrac Magic | 9 | Ancestry | — | innate spells: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.29 ± 0.06 | −0.23 | −0.34 | 1.7 | hurts |  |
| 2403 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.29 ± 0.04 | −0.16 | −0.42 | 3.7 | hurts |  |
| 2404 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.29 ± 0.05 | −0.12 | −0.45 | 5.2 | hurts |  |
| 2405 | Sing to the Steel | 12 | Class | — | an Effect on an ally | −0.29 ± 0.06 | −0.35 | −0.23 | 7.7 | hurts |  |
| 2406 | Cry of Rebellion | 16 | Class | — | save | −0.29 ± 0.06 | −0.25 | −0.32 | 1.0 | hurts |  |
| 2407 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.29 ± 0.05 | −0.25 | −0.33 | 19.2 | hurts |  |
| 2408 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.29 ± 0.06 | −0.27 | −0.31 | 12.7 | hurts |  |
| 2409 | First World Adept | 9 | Ancestry | — | innate spells: Invisibility (rank 2), Revealing Light (rank 2) | −0.29 ± 0.05 | −0.24 | −0.34 | 2.0 | hurts |  |
| 2410 | Stone Guardian | 4 | Class | — | innate spell: Summon Elemental (rank 2) | −0.29 ± 0.07 | −0.37 | −0.22 | 1.0 | hurts |  |
| 2411 | Calcification | 18 | Class | — | a foe slowed 1 (a round on a success; 2 on a critical failure) by its Fortitude save; its ongoing saves and bludgeoning weakness not played (its focus spell, a thrall destroyed, once a fight) | −0.29 ± 0.05 | −0.19 | −0.39 | 1.0 | hurts |  |
| 2412 | Propulsive Leap | 10 | Class | — | save | −0.29 ± 0.06 | −0.31 | −0.27 | 12.0 | hurts |  |
| 2413 | Crown of Rule | 16 | Class | exemplar | Heavy is the Crown: inline save: 15-foot burst, will, 16 spirit (DC 35) | −0.29 ± 0.06 | −0.20 | −0.39 | 3.1 | hurts |  |
| 2414 | Stupefying Raid | 0 | Action | commander | save | −0.29 ± 0.05 | −0.37 | −0.22 | 2.5 | hurts |  |
| 2415 | Divine Disharmony | 1 | Class | thaumaturge | a foe off-guard for a round (an Intimidation or Deception check against its Will, played as its Will save) | −0.29 ± 0.06 | −0.02 | −0.57 | 4.0 | hurts |  |
| 2416 | Submission Hold | 8 | Class | — | check | −0.29 ± 0.05 | −0.37 | −0.22 | 4.1 | hurts |  |
| 2417 | Meteoric Spellstrike | 10 | Class | magus | check | −0.30 ± 0.06 | −0.15 | −0.45 | 6.8 | hurts | with a loaded arquebus |
| 2418 | Wing Bounce | 4 | Class | — | check | −0.30 ± 0.07 | −0.34 | −0.26 | 2.4 | hurts |  |
| 2419 | Secondary Detonation Array | 14 | Class | wizard | Secondary Detonation Array copies of 8 damage spells: a circle that bursts at the start of its next turn: a d6 a rank (basic Reflex) on the two foes it hurt most | −0.30 ± 0.06 | −0.22 | −0.38 | 6.5 | hurts |  |
| 2420 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | −0.30 ± 0.06 | −0.10 | −0.51 | 1.0 | hurts |  |
| 2421 | Holy Light | 10 | Class | champion | save | −0.31 ± 0.06 | −0.26 | −0.35 | 6.3 | hurts |  |
| 2422 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.31 ± 0.06 | −0.33 | −0.28 | 4.9 | hurts |  |
| 2423 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.31 ± 0.04 | −0.31 | −0.30 | 2.2 | hurts |  |
| 2424 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.31 ± 0.04 | −0.31 | −0.30 | 2.2 | hurts |  |
| 2425 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.31 ± 0.04 | −0.31 | −0.30 | 2.2 | hurts |  |
| 2426 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.31 ± 0.04 | −0.31 | −0.30 | 2.2 | hurts |  |
| 2427 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.31 ± 0.04 | −0.31 | −0.30 | 2.2 | hurts |  |
| 2428 | Animal Summoner | 9 | Ancestry | — | innate spell: Summon Animal (rank 5) | −0.31 ± 0.06 | −0.39 | −0.23 | 1.0 | hurts |  |
| 2429 | Summon Air Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.31 ± 0.06 | −0.24 | −0.38 | 1.0 | hurts |  |
| 2430 | Rend Mimicry | 4 | Class | — | check | −0.31 ± 0.05 | −0.36 | −0.26 | 8.2 | hurts |  |
| 2431 | Whirling Throw | 6 | Class | monk | check | −0.32 ± 0.06 | −0.24 | −0.40 | 8.1 | hurts |  |
| 2432 | Catfolk Dance | 1 | Ancestry | — | check | −0.32 ± 0.06 | −0.19 | −0.45 | 5.7 | hurts |  |
| 2433 | Final Shot Knows the Way | 18 | Class | — | check | −0.32 ± 0.06 | −0.36 | −0.28 | 3.0 | hurts |  |
| 2434 | Forcible Energy | 12 | Class | wizard | Forcible Energy copies of 11 energy spells: weakness 5 on the creature hurt most | −0.32 ± 0.07 | −0.37 | −0.28 | 6.1 | hurts |  |
| 2435 | Mesmerizing Gaze | 6 | Class | — | save | −0.32 ± 0.05 | −0.28 | −0.37 | 3.6 | hurts |  |
| 2436 | Shining Glory | 18 | Class | — | save (requirement assumed: Your nimbus is active) | −0.33 ± 0.07 | −0.49 | −0.16 | 3.0 | hurts |  |
| 2437 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.33 ± 0.05 | −0.25 | −0.41 | 2.9 | hurts |  |
| 2438 | Fey Magic | 9 | Ancestry | — | innate spells: Faerie Fire (rank 2), Invisibility (rank 2) | −0.33 ± 0.05 | −0.28 | −0.38 | 1.9 | hurts |  |
| 2439 | Clear the Way | 6 | Class | — | check | −0.33 ± 0.04 | −0.38 | −0.29 | 2.1 | hurts |  |
| 2440 | Reincarnated Ridiculer | 5 | Ancestry | — | Demoralize the same foe again and again (no immunity) | −0.34 ± 0.04 | −0.30 | −0.37 | 10.9 | hurts |  |
| 2441 | Sea Witch | 13 | Ancestry | — | innate spells: Aqueous Orb (rank 3), Control Water (rank 5) | −0.34 ± 0.05 | −0.24 | −0.44 | 5.9 | hurts |  |
| 2442 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.34 ± 0.05 | −0.15 | −0.54 | 1.9 | hurts |  |
| 2443 | Weaver's Web | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.34 ± 0.06 | −0.21 | −0.47 | 4.5 | hurts |  |
| 2444 | Tandem Strike | 6 | Class | summoner | its Strike and its eidolon's (two of their three actions) | −0.34 ± 0.07 | −0.28 | −0.41 | 18.3 | hurts |  |
| 2445 | Stay Down! | 14 | Class | rogue | check | −0.34 ± 0.07 | −0.36 | −0.33 | 10.6 | hurts |  |
| 2446 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.35 ± 0.05 | −0.40 | −0.29 | 14.2 | hurts |  |
| 2447 | Spinning Crush | 0 | Action | gunslinger | save | −0.35 ± 0.06 | −0.34 | −0.35 | 1.7 | hurts |  |
| 2448 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.35 ± 0.06 | −0.19 | −0.52 | 4.0 | hurts |  |
| 2449 | Mixed Maneuver | 8 | Class | monk | check | −0.36 ± 0.09 | −0.45 | −0.26 | 4.3 | hurts |  |
| 2450 | Agathion Magic | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Calm (rank 2) | −0.36 ± 0.06 | −0.44 | −0.27 | 2.5 | hurts |  |
| 2451 | Wing Buffet | 9 | Ancestry | — | check | −0.36 ± 0.06 | −0.49 | −0.23 | 5.2 | hurts |  |
| 2452 | Catchy Tune | 5 | Ancestry | — | check | −0.36 ± 0.03 | −0.09 | −0.64 | 17.5 | hurts |  |
| 2453 | Dracomancer | 9 | Ancestry | — | innate spells: Fear (rank 1), Invisibility (rank 2) | −0.36 ± 0.05 | −0.31 | −0.42 | 2.0 | hurts |  |
| 2454 | Swarmkeeper Dedication | 2 | Class | — | Bite and Sting: save (requirement assumed: Your swarm is outside your body) | −0.36 ± 0.05 | −0.35 | −0.38 | 6.9 | hurts |  |
| 2455 | Oil Fire | 2 | Class | inventor | save | −0.37 ± 0.06 | −0.39 | −0.35 | 2.1 | hurts |  |
| 2456 | Hammer Quake | 14 | Class | — | check | −0.37 ± 0.06 | −0.31 | −0.44 | 4.1 | hurts |  |
| 2457 | Aphet Flash | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.38 ± 0.08 | −0.28 | −0.47 | 6.8 | hurts |  |
| 2458 | Kodama Call | 9 | Ancestry | — | Helpful Wood Spirits' Distract: foes in a 5-foot burst a Reflex save (DC 27) or off-guard for a round (twice a fight; its Sustain not played) | −0.38 ± 0.05 | −0.33 | −0.43 | 2.0 | hurts |  |
| 2459 | Amalgamate | 14 | Class | — | two thralls fused into a Large amalgamation: its thrall Strikes +14 damage while it lasts | −0.38 ± 0.07 | −0.32 | −0.44 | 2.7 | hurts |  |
| 2460 | Muckraking | 16 | Class | — | save | −0.38 ± 0.06 | −0.29 | −0.47 | 4.6 | hurts |  |
| 2461 | Unobstructed Shot | 10 | Class | — | a ranged Strike and a Trip, one attack (2 actions; the Trip after it) | −0.38 ± 0.06 | −0.53 | −0.23 | 7.4 | hurts |  |
| 2462 | Exaltation Overwhelming | 18 | Class | — | save | −0.38 ± 0.05 | −0.51 | −0.26 | 2.9 | hurts |  |
| 2463 | Goblin Song | 1 | Ancestry | — | check | −0.39 ± 0.06 | −0.11 | −0.67 | 8.2 | hurts |  |
| 2464 | Shape of the Cloud Dragon | 14 | Class | — | innate spell: Dragon Form (rank 7) | −0.39 ± 0.07 | −0.62 | −0.17 | 1.0 | hurts |  |
| 2465 | Shape of the Dragon | 14 | Class | — | innate spell: Dragon Form (rank 7) | −0.39 ± 0.07 | −0.62 | −0.17 | 1.0 | hurts |  |
| 2466 | Freeze It! | 9 | Ancestry | — | check | −0.39 ± 0.06 | −0.37 | −0.42 | 12.5 | hurts |  |
| 2467 | Trample Mimicry | 10 | Class | — | save | −0.39 ± 0.07 | −0.53 | −0.26 | 3.9 | hurts |  |
| 2468 | Fearful Symmetry | 6 | Class | — | save | −0.40 ± 0.06 | −0.37 | −0.43 | 12.1 | hurts |  |
| 2469 | Djinni Magic | 9 | Ancestry | — | innate spells: Gust of Wind (rank 1), Invisibility (rank 2) | −0.41 ± 0.05 | −0.30 | −0.52 | 3.9 | hurts |  |
| 2470 | Wild Dance | 12 | Class | — | save | −0.41 ± 0.06 | −0.27 | −0.55 | 10.6 | hurts |  |
| 2471 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | −0.42 ± 0.06 | −0.47 | −0.36 | 1.0 | hurts |  |
| 2472 | Spinning Release | 14 | Class | — | save | −0.42 ± 0.05 | −0.48 | −0.36 | 1.5 | hurts |  |
| 2473 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.43 ± 0.06 | −0.28 | −0.58 | 7.7 | hurts |  |
| 2474 | Call the Worm | 18 | Class | — | innate spell: Summon Animal (rank 9) | −0.44 ± 0.09 | −0.20 | −0.67 | 1.0 | hurts |  |
| 2475 | Perplex | 14 | Class | — | check | −0.44 ± 0.07 | −0.53 | −0.36 | 3.6 | hurts |  |
| 2476 | Flying Tackle | 4 | Class | guardian | check | −0.46 ± 0.07 | −0.69 | −0.23 | 3.4 | hurts |  |
| 2477 | Dazzling Bullet | 6 | Class | — | check | −0.46 ± 0.05 | −0.30 | −0.62 | 12.0 | hurts |  |
| 2478 | Perfect Shot | 18 | Class | ranger | a ranged Strike at maximum damage, then its turn ends (3 actions) | −0.46 ± 0.10 | −0.52 | −0.40 | 7.8 | hurts |  |
| 2479 | Shroud of Ghosts | 16 | Class | exemplar | Skirt the Underworld: save | −0.46 ± 0.07 | −0.56 | −0.37 | 5.9 | hurts |  |
| 2480 | Night Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Mist (rank 2) | −0.47 ± 0.07 | −0.46 | −0.48 | 1.0 | hurts |  |
| 2481 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.47 ± 0.07 | −0.40 | −0.54 | 7.3 | hurts |  |
| 2482 | Warped Constriction | 8 | Class | — | save | −0.47 ± 0.05 | −0.54 | −0.41 | 12.8 | hurts |  |
| 2483 | Running Tackle | 8 | Class | — | check | −0.47 ± 0.06 | −0.64 | −0.30 | 4.4 | hurts |  |
| 2484 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.48 ± 0.09 | −0.24 | −0.71 | 6.9 | hurts |  |
| 2485 | Tamper | 1 | Class | inventor | check | −0.49 ± 0.06 | −0.40 | −0.57 | 6.1 | hurts |  |
| 2486 | Twist the Knife | 6 | Class | rogue | check | −0.49 ± 0.06 | −0.45 | −0.52 | 8.8 | hurts |  |
| 2487 | Summon Water Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.49 ± 0.07 | −0.29 | −0.69 | 1.0 | hurts |  |
| 2488 | Bolera's Interrogation | 6 | Class | — | save | −0.49 ± 0.06 | −0.36 | −0.61 | 2.9 | hurts |  |
| 2489 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.49 ± 0.06 | −0.60 | −0.38 | 5.8 | hurts |  |
| 2490 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.49 ± 0.06 | −0.60 | −0.38 | 5.8 | hurts |  |
| 2491 | Brain Drain | 8 | Class | psychic | save | −0.50 ± 0.06 | −0.45 | −0.55 | 3.3 | hurts |  |
| 2492 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.53 ± 0.06 | −0.64 | −0.41 | 11.1 | hurts |  |
| 2493 | Whirling Knockdown | 14 | Class | — | check | −0.53 ± 0.06 | −0.50 | −0.55 | 8.3 | hurts |  |
| 2494 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.53 ± 0.07 | −0.65 | −0.41 | 3.3 | hurts |  |
| 2495 | Peony's Flourish | 14 | Class | — | check | −0.53 ± 0.08 | −0.44 | −0.62 | 5.0 | hurts |  |
| 2496 | Flourishing Finish | 12 | Class | — | check | −0.54 ± 0.06 | −0.65 | −0.42 | 13.2 | hurts |  |
| 2497 | Dizzying Spell | 14 | Class | wizard | Dizzying Spell copies of 6 spells | −0.57 ± 0.07 | −0.58 | −0.56 | 4.6 | hurts |  |
| 2498 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.57 ± 0.06 | −0.63 | −0.51 | 22.6 | hurts |  |
| 2499 | Expel Maelstrom | 0 | Action | — | save (requirement assumed: You're in a curse maelstrom state) | −0.57 ± 0.06 | −0.45 | −0.69 | 6.0 | hurts |  |
| 2500 | Entities From Afar | 14 | Class | — | innate spell: Summon Entity (rank 5), Read Omens (rank 4) | −0.58 ± 0.09 | −0.50 | −0.65 | 1.0 | hurts |  |
| 2501 | Frog Geyser | 5 | Ancestry | — | save (requirement assumed: Your mouth is full of water) | −0.58 ± 0.04 | −0.62 | −0.54 | 6.4 | hurts |  |
| 2502 | Tear Tendons | 8 | Class | — | save (requirement assumed: You are in claw stance and have two open hands) | −0.59 ± 0.07 | −0.67 | −0.51 | 6.8 | hurts |  |
| 2503 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.59 ± 0.08 | −0.68 | −0.50 | 13.6 | hurts |  |
| 2504 | Explosive Maneuver | 14 | Class | inventor | after a Strike that hits, a Trip at the same penalty (2 actions with the Strike) | −0.59 ± 0.09 | −0.77 | −0.41 | 10.1 | hurts |  |
| 2505 | Kijimuna Whistle | 13 | Ancestry | — | innate spell: Summon Plant or Fungus (rank 5) | −0.61 ± 0.07 | −0.26 | −0.97 | 1.0 | hurts |  |
| 2506 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.61 ± 0.05 | −0.87 | −0.36 | 13.3 | hurts |  |
| 2507 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | −0.62 ± 0.06 | −0.57 | −0.67 | 2.8 | hurts |  |
| 2508 | Call Ursine Ally | 8 | Class | — | innate spell: Summon Animal (rank 3) | −0.62 ± 0.08 | −0.68 | −0.56 | 1.0 | hurts |  |
| 2509 | Gossamer Blade | 4 | Class | — | check | −0.63 ± 0.06 | −0.67 | −0.59 | 9.8 | hurts |  |
| 2510 | Dance of Intercession | 20 | Class | cleric | a 3-action 7th-rank Heal, no slot (played as its Performance check's success; twice a fight) | −0.65 ± 0.07 | −0.96 | −0.33 | 1.6 | hurts |  |
| 2511 | Summon Fire Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | −0.65 ± 0.08 | −0.28 | −1.03 | 1.0 | hurts |  |
| 2512 | Silk Bracelet | 6 | Class | inventor | save | −0.66 ± 0.08 | −0.80 | −0.53 | 4.9 | hurts |  |
| 2513 | Dust Cloud | 8 | Class | — | save (requirement assumed: Your waking world is active) | −0.68 ± 0.06 | −0.77 | −0.58 | 16.7 | hurts |  |
| 2514 | Sacral Lord | 4 | Class | champion | innate spell: Detect Magic (rank 2), Guidance (rank 2), Sigil (rank 2) | −0.69 ± 0.08 | −0.88 | −0.50 | 10.7 | hurts |  |
| 2515 | Echoing Spell | 18 | Class | sorcerer | Echoing Spell copies of 8 damage spells: a spell of 4th rank or lower cast twice for its slot (every other cast free) | −0.69 ± 0.09 | −0.40 | −0.99 | 7.4 | hurts |  |
| 2516 | Pyre Ant Sting | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.70 ± 0.06 | −0.81 | −0.58 | 10.1 | hurts |  |
| 2517 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.70 ± 0.06 | −0.66 | −0.74 | 10.9 | hurts |  |
| 2518 | Hot Foot | 8 | Class | — | a shot at the ground: no reactions till its turn, off-guard too on a critical (played as a Reflex save against its attack + 10) | −0.72 ± 0.10 | −0.68 | −0.76 | 41.0 | hurts |  |
| 2519 | Thrash | 8 | Class | barbarian | save | −0.73 ± 0.06 | −0.62 | −0.83 | 16.0 | hurts |  |
| 2520 | Dragon Transformation | 16 | Class | barbarian | innate spell: Dragon Form (rank 6) | −0.73 ± 0.08 | −0.75 | −0.72 | 1.0 | hurts |  |
| 2521 | Dance of the Tiger | 9 | Ancestry | — | check | −0.74 ± 0.08 | −1.04 | −0.44 | 18.6 | hurts |  |
| 2522 | One Moment till Glory | 0 | Action | — | effect | −0.74 ± 0.07 | −0.69 | −0.79 | 7.0 | hurts |  |
| 2523 | Anatomical Quartering | 16 | Class | — | a Strike at each of up to four foes at one multiple attack penalty (3 actions) | −0.75 ± 0.07 | +0.00 | −1.50 | 3.0 | hurts |  |
| 2524 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.77 ± 0.07 | −0.98 | −0.56 | 8.6 | hurts | with a bow in hand |
| 2525 | Astral Compound Invocation | 12 | Class | — | save | −0.81 ± 0.10 | −1.16 | −0.45 | 12.9 | hurts |  |
| 2526 | Fear of God | 14 | Skill | — | Demoralize the same foe again and again (its frightened adding up not played) | −0.85 ± 0.09 | −1.12 | −0.58 | 20.7 | hurts |  |
| 2527 | Dalang's Ally | 13 | Ancestry | — | a foe beside it off-guard to its attacks till its next turn (1 action) | −0.88 ± 0.08 | −1.20 | −0.56 | 18.2 | hurts |  |
| 2528 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −0.88 ± 0.08 | −1.07 | −0.70 | 5.0 | hurts |  |
| 2529 | Purifying Breeze | 14 | Class | cleric | effect | −0.91 ± 0.11 | −1.16 | −0.65 | 9.2 | hurts |  |
| 2530 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −0.92 ± 0.08 | −0.72 | −1.13 | 9.9 | hurts |  |
| 2531 | Head of the Night Parade | 20 | Class | bard | three Mad Monkeys' Raucous Din: foes about a Fortitude save (DC 45) or deafened (3 actions; their other mischief and Sustains not played) | −0.94 ± 0.06 | −1.19 | −0.69 | 3.8 | hurts |  |
| 2532 | Silencing Strike | 10 | Class | barbarian | save | −0.98 ± 0.09 | −1.62 | −0.34 | 17.9 | hurts |  |
| 2533 | Fearsome Familiar | 6 | Class | kineticist | an elemental of level 2 or lower in its familiar's place (3 actions, once a fight; Summon Elemental at rank 3) | −1.00 ± 0.10 | −0.71 | −1.28 | 1.0 | hurts |  |
| 2534 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.14 ± 0.08 | −0.18 | −2.11 | 1.0 | hurts |  |
| 2535 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.14 ± 0.08 | −0.18 | −2.11 | 1.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 2330 |
| never in a benchmark fight: a change to a class option, feature or action the simulator's class PC doesn't have | 250 |
| never in a benchmark fight: a matter of 5 or 10 feet of reach, range or movement, which the simulator's distance bands (engaged, near, far) don't measure | 117 |
| never in a benchmark fight: terrain or climate, and the simulator's field is open and mild | 110 |
| never in a benchmark fight: a utility outside a fight's actions | 101 |
| never in a benchmark fight: a reaction to a kind of damage or effect the rating foes don't use | 90 |
| never in a benchmark fight: something between fights | 82 |
| never in a benchmark fight: a reaction to a misfire or gear the simulator doesn't play | 75 |
| never in a benchmark fight: a reaction to a foe's spell or magical effect | 72 |
| never in a benchmark fight: a moment a fight on the simulator's open field never has | 65 |
| never in a benchmark fight: more options for an action whose best option the simulator's PC already takes (or that cures conditions the rating foes don't inflict), so a fight plays the same | 63 |
| a spell the engine doesn't cast | 63 |
| never in a benchmark fight: a social or skill benefit outside a fight's actions | 62 |
| never in a benchmark fight: against a kind of creature the rating foes aren't | 62 |
| a teleport | 54 |
| nothing a fight uses | 54 |
| it grants Additional Lore: the feat module reads nothing for it | 52 |
| never in a benchmark fight: a benefit against hidden, undetected or concealed creatures (or for Hiding), and the rating foes and PCs fight in the open, seen | 46 |
| a Strike with nothing more the simulator reads | 42 |
| never in a benchmark fight: only knowledge about a foe (Recall Knowledge, identifying an effect), which the simulator's PCs already have | 38 |
| never in a benchmark fight: a kind of companion the simulator doesn't field | 36 |
| a plan the engine can't play | 32 |
| it grants one of 2 | 31 |
| a timer with no rules a fight counts | 29 |
| never in a benchmark fight: a change to a spell the simulator's casters don't prepare | 24 |
| never in a benchmark fight: a rescue from death itself (dying 4, a death effect) or from staying unconscious, and a benchmark fight scores a PC as down once it falls to 0 Hit Points | 24 |
| never in a benchmark fight: a choice of damage type (or of an element), and the rating foes have no weakness or resistance it would be picked for | 19 |
| never in a benchmark fight: a follower, student or spotter | 19 |
| its text has no Strike of its user's | 17 |
| an Effect with nothing a fight counts | 15 |
| its requirement | 12 |
| never in a benchmark fight: a reaction to doom or an oracle's curse, which the simulator doesn't play | 8 |
| it grants Pet: the feat module reads nothing for it | 8 |
| a companion's Strike | 7 |
| a reaction's Strike | 7 |
| never in a benchmark fight: a reaction to a skill check made outside a fight's actions | 7 |
| its requirement, which the PC doesn't meet | 7 |
| a spell the feat casts | 6 |
| its Effect has nothing a fight counts | 6 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 6 |
| a roll whose results the simulator doesn't read | 5 |
| it grants Impressive Performance: the feat module reads nothing for it | 5 |
| it grants Domain Initiate: the feat module reads nothing for it | 5 |
| it grants Specialty Crafting: the feat module reads nothing for it | 5 |
| it grants Intimidating Glare: the feat module reads nothing for it | 5 |
| it grants Verdant Core Deviant Classification: the feat module reads nothing for it | 4 |
| it grants Cast a Spell: the feat module reads nothing for it | 4 |
| it grants Terrain Stalker: the feat module reads nothing for it | 4 |
| it grants Leech Deviant Classification: the feat module reads nothing for it | 3 |
| a choice of ways the simulator doesn't play | 3 |
| never in a benchmark fight: drawing a weapon at initiative, and the simulator's PCs start with theirs drawn | 3 |
| it grants Assurance: the feat module reads nothing for it | 3 |
| a reroll | 3 |
| it grants one of 3 | 3 |
| a Focus or Mythic Point back | 3 |
| it grants Snare Crafting: the feat module reads nothing for it | 3 |
| it grants Lie to Me: the feat module reads nothing for it | 3 |
| it grants Adopted Ancestry: the feat module reads nothing for it | 3 |
| it grants Quick Squeeze: the feat module reads nothing for it | 3 |
| it grants Titan Wrestler: the feat module reads nothing for it | 3 |
| it grants Blight Soul Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Dragon Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Wraith Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Enhanced Familiar: the feat module reads nothing for it | 2 |
| it grants Quick Repair: the feat module reads nothing for it | 2 |
| it grants Multilingual: the feat module reads nothing for it | 2 |
| it grants Underwater Marauder: the feat module reads nothing for it | 2 |
| it grants Hunt Prey: nothing a fight uses | 2 |
| damage still naming the character's data | 2 |
| it grants Ride: the feat module reads nothing for it | 2 |
| it grants one of 6 | 2 |
| it grants Eye for Numbers: the feat module reads nothing for it | 2 |
| it grants Oddity Identification: the feat module reads nothing for it | 2 |
| it grants Hobnobber: the feat module reads nothing for it | 2 |
| it grants Steady Balance: the feat module reads nothing for it | 2 |
| it grants Lengthy Diversion: the feat module reads nothing for it | 2 |
| it grants Courtly Graces: the feat module reads nothing for it | 2 |
| it grants Combat Climber: the feat module reads nothing for it | 2 |
| it grants Untrained Improvisation: the feat module reads nothing for it | 2 |
| no Spit Ambient Magic of the PC's for it to change | 2 |
| a roll twice | 2 |
| it grants Conceal Spell: the feat module reads nothing for it | 2 |
| never in a benchmark fight: a weapon against incorporeal foes, and the rating foes aren't | 1 |
| effects the GM allows from the scenery | 1 |
| it grants Call Upon the Brightness: a plan the engine can't play | 1 |
| it grants Speed of Arms: a reaction's Strike | 1 |
| it grants Eidolon: the feat module reads nothing for it | 1 |
| it grants Once Bitten: the feat module reads nothing for it | 1 |
| it grants Influence Rumor: the feat module reads nothing for it | 1 |
| it grants Solitary Invocation: the feat module reads nothing for it | 1 |
| it grants Crafter's Appraisal: the feat module reads nothing for it | 1 |
| it grants Command Undead: a roll whose results the simulator doesn't read | 1 |
| it grants Psychometric Assessment: the feat module reads nothing for it | 1 |
| it grants Spread Propaganda: the feat module reads nothing for it | 1 |
| it grants Bonded Animal: the feat module reads nothing for it | 1 |
| a passive's roll with no action to use it | 1 |
| it grants Infiltrator's Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Bullet Dancer Stance: the feat module reads nothing for it | 1 |
| a lasting area | 1 |
| it grants Witch's Charge: the feat module reads nothing for it | 1 |
| it grants Deity (Champion): the feat module reads nothing for it | 1 |
| it grants Avoid Dire Fate: the feat module reads nothing for it | 1 |
| it grants Inventor: the feat module reads nothing for it | 1 |
| it grants Create Familiar Fulu: nothing a fight uses | 1 |
| it grants Assume a Role: the feat module reads nothing for it | 1 |
| it grants Experienced Tracker: the feat module reads nothing for it | 1 |
| it grants On the Case: the feat module reads nothing for it | 1 |
| it grants Bond with Spirit: nothing a fight uses | 1 |
| it grants Shift Spell: the feat module reads nothing for it | 1 |
| it grants Tactics: the feat module reads nothing for it | 1 |
| it grants one of 10 | 1 |
| it grants Set Explosives: the feat module reads nothing for it | 1 |
| it grants Rouse the World: a timer with no rules a fight counts | 1 |
| it grants Slayer's Identification: the feat module reads nothing for it | 1 |
| it grants Mark for Death: the feat module reads nothing for it | 1 |
| it grants Favored Terrain: the feat module reads nothing for it | 1 |
| it grants Quick Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Spin Tale: an Effect with nothing a fight counts | 1 |
| it grants Juggle: a timer with no rules a fight counts | 1 |
| it grants Binding Vow: the feat module reads nothing for it | 1 |
| it grants Divine Spark and Ikons: the feat module reads nothing for it | 1 |
| it grants Engineer's Efficiency: the feat module reads nothing for it | 1 |
| it grants Taunt: an Effect with nothing a fight counts | 1 |
| a passive's Effect on other creatures | 1 |
| it grants Mystic Aegis: the feat module reads nothing for it | 1 |
| it grants Slippery Secrets: the feat module reads nothing for it | 1 |
| it grants Trick Magic Item: the feat module reads nothing for it | 1 |
| it grants Lay Down Arms: the feat module reads nothing for it | 1 |
| it grants Devise a Stratagem: its text has no Strike of its user's | 1 |
| it grants Remove Head: the feat module reads nothing for it | 1 |
| it grants Coughing Dragon: nothing a fight uses | 1 |
| it grants Size Up: an Effect with nothing a fight counts | 1 |
| it grants Monastic Weaponry: the feat module reads nothing for it | 1 |
| it grants Spell-Woven Shot: a Strike with nothing more the simulator reads | 1 |
| it grants Improvised Repair: the feat module reads nothing for it | 1 |
| it grants Base Kinesis: the feat module reads nothing for it | 1 |
| it grants Flicker Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Magical Crafting: the feat module reads nothing for it | 1 |
| it grants Automatic Knowledge: the feat module reads nothing for it | 1 |
| it grants Upstage: a plan the engine can't play | 1 |
| it grants Cycle Elemental Stance: a teleport | 1 |
| it grants Rage: its requirement | 1 |
| it grants Keen Recollection: the feat module reads nothing for it | 1 |
| it grants Pirate Dedication: the feat module reads nothing for it | 1 |
| it grants Drape Ambient Magic: its text has no Strike of its user's | 1 |
| it grants Trace Rune: a timer with no rules a fight counts | 1 |
| it grants Powerful Leap: the feat module reads nothing for it | 1 |
| it grants Natural Medicine: the feat module reads nothing for it | 1 |
| it grants Salt Wound: a plan the engine can't play | 1 |
| it grants Find Fault: the feat module reads nothing for it | 1 |
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
| a reaction to "strike" | 1 |
| it grants Recognize Spell: the feat module reads nothing for it | 1 |
| it grants Inevitable Return: the feat module reads nothing for it | 1 |
| it grants Spasm of the Berserker: a timer with no rules a fight counts | 1 |
| it grants Only You and I: its text has no Strike of its user's | 1 |
| it grants Dubious Knowledge: the feat module reads nothing for it | 1 |
| it grants Arcane Bond: the feat module reads nothing for it | 1 |
| it grants Call Gun: the feat module reads nothing for it | 1 |
| it grants Jumping Jenny: a timer with no rules a fight counts | 1 |
| it grants Transform Ammunition: the feat module reads nothing for it | 1 |
| it grants Entreat Pact: its Effect has nothing a fight counts | 1 |
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
| it grants Forced Pact: a roll whose results the simulator doesn't read | 1 |
| it grants Magical Shorthand: the feat module reads nothing for it | 1 |
| it grants Battle Medicine: the feat module reads nothing for it | 1 |
| it grants Greater Field Discovery (Toxicologist): the feat module reads nothing for it | 1 |
| its reading (retributive-strike) isn't played | 1 |
| it grants Unravel the Future: the feat module reads nothing for it | 1 |
| it grants Intercession Spell: the feat module reads nothing for it | 1 |
| it grants Pacifying Infusion: the feat module reads nothing for it | 1 |
| it grants Plant Thirty Barbs: a Strike with nothing more the simulator reads | 1 |
| it grants Makes Me Stronger: the feat module reads nothing for it | 1 |
| it grants Brandish the Gorgon's Gaze: the feat module reads nothing for it | 1 |
| it grants Tangle in Riddle: the feat module reads nothing for it | 1 |
| it grants Sever Four Dragonfly Wings: a Strike with nothing more the simulator reads | 1 |
| it grants A Challenge for Heroes: an Effect with nothing a fight counts | 1 |
| it grants Shed the Mortal Skin: a timer with no rules a fight counts | 1 |
| it grants Call to Hand: nothing a fight uses | 1 |
| it grants Chassis Deflection: the feat module reads nothing for it | 1 |
| it grants Quick Alchemy: nothing a fight uses | 1 |
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
| it grants Break the Sun's Legs: a spell the feat casts | 1 |
| it grants Mark the Center: a timer with no rules a fight counts | 1 |
| it grants Call Warshard Weapon: the feat module reads nothing for it | 1 |
| it grants Incredible Investiture: the feat module reads nothing for it | 1 |
| it grants Sidestep Through Time: a plan the engine can't play | 1 |
| never in a benchmark fight: a reaction to Delaying, which the simulator's PCs don't do | 1 |
| it grants Restore the Moment: a reaction's Strike | 1 |
