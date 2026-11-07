# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-07: 104 feats and actions rated, 0 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 66 an encounter here, no effect 148, all fights 39, precise 16, about zero 5 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 99
- minor: 4
- good: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.23 ± 0.07 | +0.39 | +0.07 | 2.0 | good |  |
| 2 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.10 ± 0.04 | +0.11 | +0.09 | 2.0 | minor |  |
| 3 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.09 ± 0.04 | +0.10 | +0.07 | 0.8 | minor |  |
| 4 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.06 ± 0.06 | +0.08 | +0.04 | 2.0 | no clear effect |  |
| 5 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.02 | +0.10 | +0.01 | 1.4 | minor |  |
| 6 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 7 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.05 ± 0.02 | +0.04 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 8 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | +0.04 ± 0.03 | +0.06 | +0.03 | 1.0 | no clear effect |  |
| 9 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 10 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 11 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 12 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.02 ± 0.03 | −0.00 | +0.05 | 0.4 | no clear effect |  |
| 13 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 14 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 15 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 16 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 17 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.03 | +0.03 | −0.00 | 0.9 | no clear effect |  |
| 18 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 19 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 20 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 21 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 22 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.02 | +0.02 | −0.01 | 0.7 | no clear effect |  |
| 23 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 24 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 25 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 26 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 27 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 28 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 29 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 30 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 32 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 33 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 34 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 35 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 38 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 39 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 40 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sea Glass Guardians | 12 | Class | kineticist | +1 AC and saves for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.23 ± 0.07 | +0.39 | +0.07 | 2.0 | good |  |
| 2 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.10 ± 0.04 | +0.11 | +0.09 | 2.0 | minor |  |
| 3 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.09 ± 0.04 | +0.10 | +0.07 | 0.8 | minor |  |
| 4 | Ghosts in the Storm | 12 | Class | kineticist | +2 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | +0.06 ± 0.06 | +0.08 | +0.04 | 2.0 | no clear effect |  |
| 5 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.02 | +0.10 | +0.01 | 1.4 | minor |  |
| 6 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 7 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.05 ± 0.02 | +0.04 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 8 | Thermal Nimbus | 4 | Class | kineticist | fire resistance 4 for the PC and its allies, 2 fire to foes starting their turn or moving in its 10-foot kinetic aura (stance, the fight) | +0.04 ± 0.03 | +0.06 | +0.03 | 1.0 | no clear effect |  |
| 9 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 10 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 11 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.03 ± 0.03 | +0.07 | −0.02 | 0.7 | no clear effect |  |
| 12 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.02 ± 0.03 | −0.00 | +0.05 | 0.4 | no clear effect |  |
| 13 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 14 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 15 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 16 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 17 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.03 | +0.03 | −0.00 | 0.9 | no clear effect |  |
| 18 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 19 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 20 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 21 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 22 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.02 | +0.02 | −0.01 | 0.7 | no clear effect |  |
| 23 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 24 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 25 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 26 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 27 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 28 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 29 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 30 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 32 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 33 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 34 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 35 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 38 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 39 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 40 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 41 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 42 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 43 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 44 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 45 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 46 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 47 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 48 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 49 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 50 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 51 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 52 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 53 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 54 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 55 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 56 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 57 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 58 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 59 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 60 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 61 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 62 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 63 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 64 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 65 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 66 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 67 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 68 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 69 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 70 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 71 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 72 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 73 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 74 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 75 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 76 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 77 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 78 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 79 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 80 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 81 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 82 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 83 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 84 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 85 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 86 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 87 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 88 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 89 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 90 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 91 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 92 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 93 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 94 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 95 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 96 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 97 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 98 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | −0.00 ± 0.01 | +0.00 | −0.01 | 1.6 | no clear effect |  |
| 99 | Living Stone | 12 | Class | — | save-bonus | −0.01 ± 0.00 | +0.00 | −0.02 | 0.0 | no clear effect |  |
| 100 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | −0.02 ± 0.03 | −0.04 | −0.00 | 0.7 | no clear effect |  |
| 101 | Resilient Touch | 10 | Class | champion | +1 to saves until its next turn for an ally its Lay on Hands heals | −0.04 ± 0.03 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 102 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | −0.05 ± 0.04 | −0.06 | −0.05 | 0.8 | no clear effect |  |
| 103 | Kindle Inner Flames | 8 | Class | kineticist | +1 Reflex for the PC and its allies in its 10-foot kinetic aura (stance, the fight) | −0.06 ± 0.07 | −0.18 | +0.06 | 2.1 | no clear effect |  |
| 104 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.09 ± 0.05 | −0.09 | −0.10 | 0.0 | no clear effect | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
