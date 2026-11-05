# E7 feats in combat

Made by `node tools/e7-power.mjs <out> scale|rate|report` on 2026-11-05. Each post-cap feat of the E7 rules goes on one PC of the standard 7th-level party (fighter, rogue, wizard, cleric), which then fights the same encounters on the same dice as the plain party, in days of four fights (spell slots spent stay spent; Hit Points fresh each fight). The foes cast a Reflex, a Will and a Fortitude spell beside their Strikes, so saves count. **Levels** is how much stronger the party is, in levels of the foes (the feat ratings' scale). **At the cap**: a 9th-level boss or four 5th-level foes; **above**: an 11th-level boss or four 7th-level foes. **Share of a level** divides by a PC raised to 8th level (what 1,000 XP buys before the cap), averaged over the four PCs, so **XP** is the price that makes the feat as good per XP as a level.

| # | Feat | PC | What it does here | At the cap | Above the cap | Average | Share of a level | XP |
|---:|---|---|---|---:|---:|---:|---:|---:|
| 1 | Apex Spellcasting | cleric | with Master's: 5th- to 9th-rank slots, spell DC and attack +2 | +0.23 | +0.49 | +0.36 ± 0.04 | 225% | 2250 |
| 2 | Apex Spellcasting | wizard | with Master's: 5th- to 9th-rank slots, spell DC and attack +2 | +0.17 | +0.44 | +0.30 ± 0.04 | 185% | 1850 |
| 3 | Master Spellcasting Advancement | cleric | with Expert's: 5th- to 8th-rank slots, spell DC and attack +2 | +0.11 | +0.50 | +0.30 ± 0.04 | 168% | 1700 |
| 4 | Yardstick: a level (8th) | fighter | the same PC at 8th level | +0.13 | +0.46 | +0.29 ± 0.04 | 169% | 1700 |
| 5 | Master Spellcasting Advancement | wizard | with Expert's: 5th- to 8th-rank slots, spell DC and attack +2 | +0.14 | +0.29 | +0.22 ± 0.04 | 137% | 1350 |
| 6 | Yardstick: a level (8th) | rogue | the same PC at 8th level | +0.07 | +0.19 | +0.13 ± 0.03 | 81% | 800 |
| 7 | Yardstick: a level (8th) | wizard | the same PC at 8th level | +0.12 | +0.14 | +0.13 ± 0.04 | 91% | 900 |
| 8 | Ability Advancement (key) | fighter | Strength +1: Strikes +1 to hit and damage (melee), Athletics, class DC | +0.10 | +0.12 | +0.11 ± 0.03 | 79% | 800 |
| 9 | Yardstick: a level (8th) | cleric | the same PC at 8th level | +0.08 | +0.09 | +0.08 ± 0.03 | 59% | 600 |
| 10 | Something of an Expert (armor) / Armored Exercise | fighter | heavy armor trained → expert: AC +2 | +0.02 | +0.14 | +0.08 ± 0.03 | 42% | 400 |
| 11 | Expert Spellcasting Advancement | cleric | a 5th- and a 6th-rank slot (spells assumed earned) | −0.00 | +0.15 | +0.07 ± 0.04 | 32% | 300 |
| 12 | Expert Spellcasting Advancement | wizard | a 5th- and a 6th-rank slot (spells assumed earned) | +0.08 | +0.06 | +0.07 ± 0.04 | 54% | 550 |
| 13 | Ability Advancement (key) | rogue | Dexterity +1: Strikes +1 to hit and damage (thief), Reflex, Dexterity skills (leather's cap keeps AC) | +0.06 | +0.03 | +0.04 ± 0.03 | 37% | 350 |
| 14 | Ability Advancement (other) | fighter | Constitution +1: +7 HP, Fortitude +1 | −0.00 | +0.09 | +0.04 ± 0.03 | 20% | 200 |
| 15 | Something of an Expert (save) | wizard | Reflex trained → expert (+2) | +0.04 | +0.05 | +0.04 ± 0.02 | 29% | 300 |
| 16 | Diverse Weapon Expert | cleric | mace trained → expert: +2 to hit | +0.02 | +0.06 | +0.04 ± 0.02 | 25% | 250 |
| 17 | Ability Advancement (key) | cleric | Wisdom +1: spell DC and attack, Will, Perception, Medicine | +0.03 | +0.05 | +0.04 ± 0.03 | 26% | 250 |
| 18 | (Master proficiency alone) | wizard | spell DC and attack +2, no slots: how much of Master is the proficiency | +0.00 | +0.07 | +0.04 ± 0.03 | 17% | 150 |
| 19 | Expanded Caster Stamina | cleric | one more 4th-rank slot | +0.02 | +0.04 | +0.03 ± 0.03 | 19% | 200 |
| 20 | Ability Advancement (other) | wizard | Dexterity +1: AC +1, Reflex +1 | +0.04 | +0.02 | +0.03 ± 0.03 | 22% | 200 |
| 21 | Something of an Expert (armor) | wizard | unarmored trained → expert: AC +2 | +0.07 | −0.03 | +0.02 ± 0.03 | 28% | 300 |
| 22 | Ability Advancement (other) | wizard | Constitution +1: +7 HP, Fortitude +1 | +0.06 | −0.03 | +0.02 ± 0.03 | 24% | 250 |
| 23 | Something of an Expert (save) | wizard | Fortitude trained → expert (+2); Canny Acumen is the same | +0.00 | +0.01 | +0.01 ± 0.01 | 5% | 50 |
| 24 | Something of an Expert (save) | rogue | Fortitude trained → expert (+2) | −0.00 | +0.00 | +0.00 ± 0.01 | 1% | 0 |
| 25 | Juggernaut's Fortitude (master save) | fighter | Fortitude expert → master (+2) | −0.01 | +0.00 | −0.01 ± 0.01 | -6% | -50 |
| 26 | Resolute (master save) | cleric | Will expert → master (+2) | −0.00 | −0.02 | −0.01 ± 0.01 | -4% | -50 |
| 27 | Ability Advancement (key) | wizard | Intelligence +1: spell DC and spell attack | −0.01 | −0.03 | −0.02 ± 0.03 | -12% | -100 |
| 28 | Expanded Caster Stamina ×2 | wizard | two more 4th-rank slots | −0.01 | −0.03 | −0.02 ± 0.03 | -14% | -150 |
| 29 | Expanded Caster Stamina | wizard | one more 4th-rank slot | −0.01 | −0.04 | −0.02 ± 0.02 | -14% | -150 |

## Class feats above the cap

Each fighter, rogue, wizard and cleric class feat above 7th level on its class's PC of the 7th-level party, played as the feat ratings play it (its use forced), in the same days against the same foes. 59 were played; 163 are feats the simulator doesn't play yet. **Share** divides by a PC's level (the yardstick above).

| Class | Access feat | Feats played | Average | Best | Best feat |
|---|---|---:|---:|---:|---|
| cleric | Exceptional Hero (12th–15th) | 2 | −0.20 (-125%) | −0.00 (-2%) | Sapping Symbol (12) |
| cleric | Legendary Hero (16th+) | 2 | +0.04 (23%) | +0.07 (45%) | Inviolable (18) |
| cleric | Veteran Hero (8th–10th) | 2 | −0.00 (-2%) | +0.00 (0%) | Sanctify Armament (8) |
| fighter | Exceptional Hero (12th–15th) | 10 | +0.02 (11%) | +0.09 (58%) | Two-Weapon Flurry (14) |
| fighter | Legendary Hero (16th+) | 5 | −0.11 (-71%) | +0.07 (44%) | Weapon Supremacy (20) |
| fighter | Veteran Hero (8th–10th) | 18 | −0.02 (-10%) | +0.16 (101%) | Haft Beatdown (10) |
| rogue | Exceptional Hero (12th–15th) | 5 | −0.10 (-65%) | +0.17 (105%) | Coordinated Distraction (12) |
| rogue | Legendary Hero (16th+) | 3 | +0.04 (24%) | +0.07 (46%) | Impossible Striker (20) |
| rogue | Veteran Hero (8th–10th) | 9 | +0.02 (14%) | +0.14 (90%) | Nimble Strike (10) |
| wizard | Legendary Hero (16th+) | 2 | +0.11 (69%) | +0.18 (115%) | Sky Master Mask (20) |
| wizard | Veteran Hero (8th–10th) | 1 | +0.08 (52%) | +0.08 (52%) | Quickened Casting (10) |

| # | Feat | Level | Class | At the cap | Above the cap | Average | Share of a level |
|---:|---|---:|---|---:|---:|---:|---:|
| 1 | Sky Master Mask | 20 | wizard | +0.01 | +0.36 | +0.18 | 115% |
| 2 | Coordinated Distraction | 12 | rogue | +0.06 | +0.28 | +0.17 | 105% |
| 3 | Haft Beatdown | 10 | fighter | +0.16 | +0.16 | +0.16 | 101% |
| 4 | Certain Strike | 10 | fighter | +0.07 | +0.23 | +0.15 | 95% |
| 5 | Nimble Strike | 10 | rogue | +0.09 | +0.19 | +0.14 | 90% |
| 6 | Rock The Boat | 8 | fighter | +0.02 | +0.21 | +0.11 | 72% |
| 7 | Two-Weapon Flurry | 14 | fighter | +0.07 | +0.12 | +0.09 | 58% |
| 8 | Brutal Finish | 12 | fighter | +0.07 | +0.10 | +0.08 | 53% |
| 9 | Quickened Casting | 10 | wizard | +0.02 | +0.14 | +0.08 | 52% |
| 10 | Twin Riposte | 10 | fighter | +0.04 | +0.12 | +0.08 | 50% |
| 11 | Impossible Striker | 20 | rogue | +0.02 | +0.12 | +0.07 | 46% |
| 12 | Inviolable | 18 | cleric | −0.00 | +0.15 | +0.07 | 45% |
| 13 | Weapon Supremacy | 20 | fighter | +0.09 | +0.05 | +0.07 | 44% |
| 14 | Think Twice | 14 | fighter | +0.00 | +0.13 | +0.07 | 43% |
| 15 | Opportune Backstab | 8 | rogue | +0.07 | +0.06 | +0.06 | 41% |
| 16 | Sly Striker | 8 | rogue | +0.01 | +0.09 | +0.05 | 30% |
| 17 | Defensive Roll | 14 | rogue | +0.02 | +0.06 | +0.04 | 27% |
| 18 | Whirlwind Strike | 14 | fighter | +0.01 | +0.08 | +0.04 | 26% |
| 19 | Sanguine Evasion | 18 | rogue | +0.01 | +0.07 | +0.04 | 25% |
| 20 | Tactical Reflexes | 10 | fighter | +0.02 | +0.06 | +0.04 | 24% |
| 21 | Grand Medic's Mask | 20 | wizard | +0.05 | +0.02 | +0.04 | 23% |
| 22 | Disarming Twist | 10 | fighter | +0.03 | +0.04 | +0.03 | 21% |
| 23 | Overwhelming Blow | 16 | fighter | −0.01 | +0.06 | +0.03 | 17% |
| 24 | Spring from the Shadows | 12 | rogue | +0.07 | −0.03 | +0.02 | 13% |
| 25 | Dueling Riposte | 8 | fighter | +0.01 | +0.03 | +0.02 | 12% |
| 26 | Blind-Fight | 8 | fighter | −0.00 | +0.04 | +0.02 | 11% |
| 27 | Twinned Defense (Fighter) | 16 | fighter | −0.04 | +0.07 | +0.01 | 8% |
| 28 | Quick Shield Block | 8 | fighter | +0.00 | +0.01 | +0.00 | 3% |
| 29 | Eternal Blessing | 16 | cleric | +0.00 | +0.00 | +0.00 | 0% |
| 30 | Sanctify Armament | 8 | cleric | +0.00 | +0.00 | +0.00 | 0% |
| 31 | Cut From the Air | 10 | fighter | +0.00 | +0.00 | +0.00 | 0% |
| 32 | Improved Dueling Riposte | 12 | fighter | +0.00 | +0.00 | +0.00 | 0% |
| 33 | Improved Twin Riposte (Fighter) | 14 | fighter | +0.00 | +0.00 | +0.00 | 0% |
| 34 | Precise Debilitations | 10 | rogue | +0.00 | +0.00 | +0.00 | 0% |
| 35 | Tactical Debilitations | 10 | rogue | +0.00 | +0.00 | +0.00 | 0% |
| 36 | Vicious Debilitations | 10 | rogue | +0.00 | +0.00 | +0.00 | 0% |
| 37 | Cutthroat Grapple | 16 | rogue | +0.00 | +0.00 | +0.00 | 0% |
| 38 | Nimble Roll | 8 | rogue | +0.00 | +0.00 | +0.00 | 0% |
| 39 | Disorienting Opening | 8 | fighter | +0.00 | −0.00 | −0.00 | -1% |
| 40 | Sapping Symbol | 12 | cleric | +0.02 | −0.03 | −0.00 | -2% |
| 41 | Sidestep | 8 | rogue | −0.01 | +0.00 | −0.00 | -3% |
| 42 | Replenishment of War | 10 | cleric | −0.01 | −0.00 | −0.01 | -3% |
| 43 | Paragon's Guard | 12 | fighter | −0.07 | +0.05 | −0.01 | -6% |
| 44 | Fearsome Brute | 10 | fighter | +0.00 | −0.02 | −0.01 | -7% |
| 45 | Dazzling Display | 10 | fighter | −0.00 | −0.02 | −0.01 | -7% |
| 46 | Dueling Dance (Fighter) | 12 | fighter | −0.06 | +0.02 | −0.02 | -12% |
| 47 | Needle in the Gods' Eyes | 16 | fighter | +0.00 | −0.06 | −0.03 | -16% |
| 48 | Incredible Ricochet | 12 | fighter | −0.04 | −0.03 | −0.03 | -21% |
| 49 | Dashing Strike | 12 | fighter | −0.02 | −0.08 | −0.05 | -33% |
| 50 | Subtle Shank | 8 | rogue | −0.07 | −0.04 | −0.05 | -34% |
| 51 | Incredible Aim | 8 | fighter | −0.02 | −0.14 | −0.08 | -49% |
| 52 | Debilitating Shot | 10 | fighter | −0.04 | −0.15 | −0.09 | -60% |
| 53 | Felling Strike | 8 | fighter | −0.13 | −0.21 | −0.17 | -106% |
| 54 | Stay Down! | 14 | rogue | −0.22 | −0.15 | −0.18 | -115% |
| 55 | Flinging Charge | 10 | fighter | −0.19 | −0.28 | −0.23 | -147% |
| 56 | Cannonball Fall | 8 | fighter | −0.26 | −0.33 | −0.29 | -184% |
| 57 | Purifying Breeze | 14 | cleric | −0.36 | −0.43 | −0.40 | -249% |
| 58 | Instant Opening | 14 | rogue | −0.56 | −0.58 | −0.57 | -357% |
| 59 | Impossible Volley | 18 | fighter | −0.70 | −0.60 | −0.65 | -408% |
