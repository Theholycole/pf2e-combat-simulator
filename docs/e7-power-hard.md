# E7 feats in combat

Made by `node tools/e7-power.mjs <out> scale|rate|report` on 2026-11-05. Each post-cap feat of the E7 rules goes on one PC of the standard 7th-level party (fighter, rogue, wizard, cleric), which then fights the same encounters on the same dice as the plain party, in days of 8 fights (spell slots spent stay spent; Hit Points fresh each fight). The foes cast a Reflex, a Will and a Fortitude spell (2 casts of each, every foe all three) beside their Strikes, so saves count. An added slot holds the spell at that rank the caster spends most. **Levels** is how much stronger the party is, in levels of the foes (the feat ratings' scale). **At the cap**: a 9th-level boss or four 5th-level foes; **above**: an 11th-level boss or four 7th-level foes. **Share of a level** divides by a PC raised to 8th level (what 1,000 XP buys before the cap), averaged over the four PCs, so **XP** is the price that makes the feat as good per XP as a level.

| # | Feat | PC | What it does here | At the cap | Above the cap | Average | Share of a level | XP |
|---:|---|---|---|---:|---:|---:|---:|---:|
| 1 | Yardstick: a level (8th) | fighter | the same PC at 8th level | +0.22 | +0.34 | +0.28 ± 0.05 | 260% | 2600 |
| 2 | Apex Spellcasting | cleric | with Master's: 5th- to 9th-rank slots, spell DC and attack +2 | +0.17 | +0.30 | +0.24 ± 0.05 | 220% | 2200 |
| 3 | Master Spellcasting Advancement | wizard | with Expert's: 5th- to 8th-rank slots, spell DC and attack +2 | +0.09 | +0.31 | +0.20 ± 0.05 | 197% | 1950 |
| 4 | Apex Spellcasting | wizard | with Master's: 5th- to 9th-rank slots, spell DC and attack +2 | +0.10 | +0.25 | +0.17 ± 0.05 | 169% | 1700 |
| 5 | Ability Advancement (key) | fighter | Strength +1: Strikes +1 to hit and damage (melee), Athletics, class DC | +0.10 | +0.20 | +0.15 ± 0.04 | 142% | 1400 |
| 6 | Master Spellcasting Advancement | cleric | with Expert's: 5th- to 8th-rank slots, spell DC and attack +2 | +0.10 | +0.18 | +0.14 ± 0.05 | 130% | 1300 |
| 7 | Expert Spellcasting Advancement | wizard | a 5th- and a 6th-rank slot (spells assumed earned) | +0.07 | +0.18 | +0.13 ± 0.04 | 123% | 1250 |
| 8 | Yardstick: a level (8th) | wizard | the same PC at 8th level | +0.11 | +0.11 | +0.11 ± 0.05 | 95% | 950 |
| 9 | Yardstick: a level (8th) | rogue | the same PC at 8th level | +0.10 | +0.05 | +0.08 ± 0.05 | 64% | 650 |
| 10 | Something of an Expert (armor) / Armored Exercise | fighter | heavy armor trained → expert: AC +2 | +0.06 | +0.09 | +0.07 ± 0.04 | 65% | 650 |
| 11 | Expert Spellcasting Advancement | cleric | a 5th- and a 6th-rank slot (spells assumed earned) | +0.02 | +0.10 | +0.06 ± 0.05 | 60% | 600 |
| 12 | Something of an Expert (save) | wizard | Reflex trained → expert (+2) | +0.06 | +0.05 | +0.05 ± 0.04 | 47% | 450 |
| 13 | Ability Advancement (key) | rogue | Dexterity +1: Strikes +1 to hit and damage (thief), Reflex, Dexterity skills (leather's cap keeps AC) | +0.04 | +0.06 | +0.05 ± 0.04 | 44% | 450 |
| 14 | (Master proficiency alone) | wizard | spell DC and attack +2, no slots: how much of Master is the proficiency | +0.03 | +0.07 | +0.05 ± 0.04 | 45% | 450 |
| 15 | Ability Advancement (other) | fighter | Constitution +1: +7 HP, Fortitude +1 | +0.06 | +0.02 | +0.04 ± 0.03 | 31% | 300 |
| 16 | Resolute (master save) | cleric | Will expert → master (+2) | −0.01 | +0.05 | +0.02 ± 0.01 | 24% | 250 |
| 17 | Ability Advancement (key) | wizard | Intelligence +1: spell DC and spell attack | +0.02 | +0.01 | +0.01 ± 0.03 | 11% | 100 |
| 18 | Yardstick: a level (8th) | cleric | the same PC at 8th level | +0.16 | −0.13 | +0.01 ± 0.05 | -20% | -200 |
| 19 | Something of an Expert (save) | wizard | Fortitude trained → expert (+2); Canny Acumen is the same | −0.01 | +0.01 | +0.00 ± 0.01 | 5% | 50 |
| 20 | Something of an Expert (save) | rogue | Fortitude trained → expert (+2) | −0.00 | +0.01 | +0.00 ± 0.01 | 3% | 50 |
| 21 | Expanded Caster Stamina ×2 | wizard | two more 4th-rank slots | −0.00 | −0.01 | −0.00 ± 0.03 | -5% | -50 |
| 22 | Expanded Caster Stamina | wizard | one more 4th-rank slot | −0.02 | +0.01 | −0.01 ± 0.03 | -5% | -50 |
| 23 | Diverse Weapon Expert | cleric | mace trained → expert: +2 to hit | +0.02 | −0.05 | −0.01 ± 0.02 | -19% | -200 |
| 24 | Ability Advancement (other) | wizard | Constitution +1: +7 HP, Fortitude +1 | +0.03 | −0.07 | −0.02 ± 0.04 | -27% | -250 |
| 25 | Expanded Caster Stamina | cleric | one more 4th-rank slot | −0.02 | −0.03 | −0.02 ± 0.03 | -22% | -200 |
| 26 | Juggernaut's Fortitude (master save) | fighter | Fortitude expert → master (+2) | +0.00 | −0.06 | −0.03 ± 0.02 | -29% | -300 |
| 27 | Something of an Expert (armor) | wizard | unarmored trained → expert: AC +2 | −0.03 | −0.02 | −0.03 ± 0.03 | -23% | -250 |
| 28 | Ability Advancement (key) | cleric | Wisdom +1: spell DC and attack, Will, Perception, Medicine | +0.02 | −0.08 | −0.03 ± 0.04 | -35% | -350 |
| 29 | Ability Advancement (other) | wizard | Dexterity +1: AC +1, Reflex +1 | +0.03 | −0.11 | −0.04 ± 0.04 | -52% | -500 |
