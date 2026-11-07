# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-07: 116 feats and actions rated, 0 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 69 an encounter here, no effect 162, all fights 48, precise 17, about zero 5 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 110
- minor: 4
- good: 2

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.23 ± 0.07 | +0.39 | +0.07 | 2.0 | good |  |
| 2 | Fling Into Action | 6 | Class | — | a Reflex save at mythic proficiency (a Mythic Point each) | +0.10 ± 0.02 | +0.11 | +0.09 | 2.2 | good |  |
| 3 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.10 ± 0.04 | +0.11 | +0.09 | 2.0 | minor |  |
| 4 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.09 ± 0.04 | +0.10 | +0.07 | 0.8 | minor |  |
| 5 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.06 ± 0.06 | +0.08 | +0.04 | 2.0 | no clear effect |  |
| 6 | Wish for Luck | 0 | Action | — | an attack rolled twice, the higher kept (free, once a fight) | +0.06 ± 0.04 | +0.04 | +0.07 | 1.0 | no clear effect |  |
| 7 | Accidental Shot | 0 | Action | — | a ranged Strike rolled twice, ignoring circumstance penalties (once a fight) | +0.05 ± 0.04 | +0.09 | +0.02 | 1.0 | no clear effect | with a loaded arquebus |
| 8 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.02 | +0.10 | +0.01 | 1.4 | minor |  |
| 9 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 10 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.05 ± 0.02 | +0.04 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 11 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | +0.04 ± 0.03 | +0.06 | +0.03 | 1.0 | no clear effect |  |
| 12 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 13 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 14 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 15 | Guided by the Stars | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 16 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.02 ± 0.03 | −0.00 | +0.05 | 0.4 | no clear effect |  |
| 17 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 18 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 19 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 20 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 21 | Feline Dance | 8 | Class | — | a failed Reflex save rerolled, the better kept (reaction, once a fight) (in Claw Stance) | +0.02 ± 0.05 | +0.01 | +0.02 | 0.8 | no clear effect |  |
| 22 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.03 | +0.03 | −0.00 | 0.9 | no clear effect |  |
| 23 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 24 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 25 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 26 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 27 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.02 | +0.02 | −0.01 | 0.7 | no clear effect |  |
| 28 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 29 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 30 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 32 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 33 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 34 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 35 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 38 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 39 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 40 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.23 ± 0.07 | +0.39 | +0.07 | 2.0 | good |  |
| 2 | Fling Into Action | 6 | Class | — | a Reflex save at mythic proficiency (a Mythic Point each) | +0.10 ± 0.02 | +0.11 | +0.09 | 2.2 | good |  |
| 3 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.10 ± 0.04 | +0.11 | +0.09 | 2.0 | minor |  |
| 4 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.09 ± 0.04 | +0.10 | +0.07 | 0.8 | minor |  |
| 5 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.06 ± 0.06 | +0.08 | +0.04 | 2.0 | no clear effect |  |
| 6 | Wish for Luck | 0 | Action | — | an attack rolled twice, the higher kept (free, once a fight) | +0.06 ± 0.04 | +0.04 | +0.07 | 1.0 | no clear effect |  |
| 7 | Accidental Shot | 0 | Action | — | a ranged Strike rolled twice, ignoring circumstance penalties (once a fight) | +0.05 ± 0.04 | +0.09 | +0.02 | 1.0 | no clear effect | with a loaded arquebus |
| 8 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.02 | +0.10 | +0.01 | 1.4 | minor |  |
| 9 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 10 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.05 ± 0.02 | +0.04 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 11 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | +0.04 ± 0.03 | +0.06 | +0.03 | 1.0 | no clear effect |  |
| 12 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 13 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 14 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 15 | Guided by the Stars | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 16 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.02 ± 0.03 | −0.00 | +0.05 | 0.4 | no clear effect |  |
| 17 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 18 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 19 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 20 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 21 | Feline Dance | 8 | Class | — | a failed Reflex save rerolled, the better kept (reaction, once a fight) (in Claw Stance) | +0.02 ± 0.05 | +0.01 | +0.02 | 0.8 | no clear effect |  |
| 22 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.03 | +0.03 | −0.00 | 0.9 | no clear effect |  |
| 23 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 24 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 25 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 26 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 27 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.02 | +0.02 | −0.01 | 0.7 | no clear effect |  |
| 28 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 29 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 30 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 32 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 33 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 34 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 35 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 38 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 39 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 40 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 41 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 42 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 43 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 44 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 45 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 46 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 47 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 48 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 49 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 50 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 51 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 52 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 53 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 54 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 55 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 56 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 57 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 58 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 59 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 60 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 61 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 62 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 63 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 64 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 65 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 66 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 67 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 68 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 69 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 70 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 71 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 72 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 73 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 74 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 75 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 76 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 77 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 78 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 79 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 80 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 81 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 82 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 83 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 84 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 85 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 86 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 87 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 88 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 89 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 90 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 91 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 92 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 93 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 94 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 95 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 96 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 97 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 98 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 99 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 100 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 101 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 102 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 103 | Mistaken Identity | 5 | Ancestry | — | a failed save against a mental effect rerolled, the better kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 104 | You're an Embarrassment! | 4 | Class | — | an ally's failed Will save against an incapacitation effect rerolled at +1, each ally once (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 105 | Such a Disgrace! | 4 | Class | — | an ally's failed Will save against a mental effect rerolled at +1, each ally once (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 106 | Mask of Rejection | 5 | Ancestry | — | a failed save against a spell rerolled at +2, the new result kept (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 107 | Focus Ally | 16 | Class | — | an adjacent ally's failed save against an incapacitation effect rerolled, the new result kept (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 108 | Fear No Pain! | 6 | Class | — | an ally's failed save against a mental effect rerolled at +2 (reaction, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 109 | Vindictive Thoughts | 16 | Class | — | a save against a spell at mythic proficiency (reaction, a Mythic Point each) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 110 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | −0.00 ± 0.01 | +0.00 | −0.01 | 1.6 | no clear effect |  |
| 111 | Living Stone | 12 | Class | — | save-bonus | −0.01 ± 0.00 | +0.00 | −0.02 | 0.0 | no clear effect |  |
| 112 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | −0.02 ± 0.03 | −0.04 | −0.00 | 0.7 | no clear effect |  |
| 113 | Resilient Touch | 10 | Class | champion | +1 to saves until its next turn for an ally its Lay on Hands heals | −0.04 ± 0.03 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 114 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | −0.05 ± 0.04 | −0.06 | −0.05 | 0.8 | no clear effect |  |
| 115 | Kindle Inner Flames | 8 | Class | kineticist | +1 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.06 ± 0.07 | −0.18 | +0.06 | 2.1 | no clear effect |  |
| 116 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.09 ± 0.05 | −0.09 | −0.10 | 0.0 | no clear effect | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
