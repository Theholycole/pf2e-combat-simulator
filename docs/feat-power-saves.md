# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-05: 98 feats and actions rated, 1 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 61 an encounter here, no effect 147, all fights 31, precise 15, about zero 3 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 93
- minor: 3
- good: 1
- hurts: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.11 ± 0.04 | +0.13 | +0.08 | 2.0 | good |  |
| 2 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.07 ± 0.02 | +0.07 | +0.07 | 0.0 | minor | the AI never used it |
| 3 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.01 | +0.06 | +0.05 | 1.3 | minor |  |
| 4 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 5 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.8 | no clear effect |  |
| 6 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.04 ± 0.02 | +0.02 | +0.06 | 1.7 | no clear effect |  |
| 7 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 8 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 9 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.03 ± 0.02 | +0.01 | +0.05 | 1.7 | no clear effect |  |
| 10 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.02 ± 0.04 | +0.02 | +0.03 | 0.7 | no clear effect |  |
| 11 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.02 | +0.02 | +0.02 | 1.0 | no clear effect |  |
| 12 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 13 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 14 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 15 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 16 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 17 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 18 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.01 ± 0.02 | +0.05 | −0.02 | 0.7 | no clear effect |  |
| 19 | Living Stone | 12 | Class | — | save-bonus | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect |  |
| 20 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.3 | no clear effect |  |
| 21 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 22 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 23 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 24 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 25 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 26 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 27 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 28 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 29 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 30 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 32 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 33 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 34 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 35 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 38 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 39 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 40 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.11 ± 0.04 | +0.13 | +0.08 | 2.0 | good |  |
| 2 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.07 ± 0.02 | +0.07 | +0.07 | 0.0 | minor | the AI never used it |
| 3 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.05 ± 0.01 | +0.06 | +0.05 | 1.3 | minor |  |
| 4 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.05 ± 0.02 | +0.09 | +0.01 | 1.4 | minor |  |
| 5 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.8 | no clear effect |  |
| 6 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.04 ± 0.02 | +0.02 | +0.06 | 1.7 | no clear effect |  |
| 7 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.03 ± 0.02 | +0.06 | −0.00 | 1.4 | no clear effect |  |
| 8 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.03 ± 0.03 | +0.01 | +0.05 | 0.8 | no clear effect |  |
| 9 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.03 ± 0.02 | +0.01 | +0.05 | 1.7 | no clear effect |  |
| 10 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.02 ± 0.04 | +0.02 | +0.03 | 0.7 | no clear effect |  |
| 11 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | +0.02 ± 0.02 | +0.02 | +0.02 | 1.0 | no clear effect |  |
| 12 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 13 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 14 | Lucky Break | 0 | Action | — | a failed save rerolled, the better kept (free, once a fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 15 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 16 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.01 ± 0.04 | +0.02 | +0.01 | 0.7 | no clear effect |  |
| 17 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 18 | Lucky Break | 5 | Ancestry | — | a failed save rerolled, the better kept (free, once a fight) | +0.01 ± 0.02 | +0.05 | −0.02 | 0.7 | no clear effect |  |
| 19 | Living Stone | 12 | Class | — | save-bonus | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect |  |
| 20 | Pact of Infernal Prowess | 8 | Class | — | a critically failed save rerolled (free, once a fight) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.3 | no clear effect |  |
| 21 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.01 ± 0.04 | +0.01 | +0.01 | 0.7 | no clear effect |  |
| 22 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 23 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 24 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 25 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 26 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 27 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 28 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 29 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 30 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 31 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 32 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 33 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 34 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 35 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 36 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 38 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 39 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 40 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 41 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 42 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 43 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 44 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 45 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 46 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 47 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 48 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 49 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 50 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 51 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 52 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 53 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 54 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 55 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 56 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 57 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 58 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 59 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 60 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 61 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 62 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 63 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 64 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 65 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 66 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 67 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 68 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 69 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 70 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 71 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 72 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 73 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 74 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 75 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 76 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 77 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 78 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 79 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 80 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 81 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 82 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 83 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 84 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 85 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 86 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 87 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 88 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 89 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 90 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 91 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 92 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 93 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 94 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 95 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | −0.00 ± 0.02 | −0.01 | +0.01 | 0.2 | no clear effect |  |
| 96 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | −0.03 ± 0.03 | −0.05 | −0.00 | 0.5 | no clear effect |  |
| 97 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | −0.06 ± 0.05 | −0.09 | −0.02 | 1.0 | no clear effect |  |
| 98 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.14 ± 0.05 | −0.19 | −0.09 | 0.0 | hurts | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| a reaction's Strike | 1 |
