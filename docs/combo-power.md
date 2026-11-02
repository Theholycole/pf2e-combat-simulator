# Feat combos in combat

Made by `node tools/combo-power.mjs <out> find|run|report` on 2026-11-02. Two feats the simulator plays, on the same PC, where one sets up what the other uses (a condition one puts on a foe and the other needs or does more against; a feat built on another), and each PC's strongest feats two by two. Each pair at the higher of the two feats' levels: the first alone, the second alone, and both, each in whole fights against the plain party on the same dice (the feat ratings' method, in levels of the foes).

**Synergy** is both together minus each alone: above 0, they're worth more together than apart; below 0, they overlap or compete for the PC's actions.

| # | Feats | PC, level | Together | First alone | Second alone | Synergy | Verdict | Why paired |
|---:|---|---|---:|---:|---:|---:|---|---|
| 1 | Goblin Jubilee + Rampaging Ferocity | fighter, 1 | +0.45 | +0.31 | +0.10 | +0.04 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 2 | Acrid Barrage + Rampaging Ferocity | fighter, 1 | +0.33 | +0.21 | +0.10 | +0.03 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 3 | Acrid Barrage + Devastating Duelist | fighter, 18 | +0.14 | −0.01 | +0.13 | +0.02 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 4 | Goblin Jubilee + Siphon Life | fighter, 10 | +0.17 | +0.05 | +0.10 | +0.02 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 5 | Avenging Runelord Dedication + Apocalyptic Visions | fighter, 18 | −0.11 | −0.19 | +0.06 | +0.02 ± 0.11 | no clear combo | Apocalyptic Visions builds on Avenging Runelord Dedication |
| 6 | Debilitating Dichotomy + Raise Symbol | cleric, 8 | +0.06 | +0.06 | −0.01 | +0.01 ± 0.07 | no clear combo | two of the cleric's strongest feats |
| 7 | Raise Symbol + Sapping Symbol | cleric, 12 | +0.03 | −0.01 | +0.03 | +0.01 ± 0.03 | no clear combo | Sapping Symbol builds on Raise Symbol; two of the cleric's strongest feats |
| 8 | Scare to Death + Goblin Jubilee | fighter, 15 | +0.35 | +0.35 | −0.01 | +0.01 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 9 | Gladiator's Roar + Fiend Worshipper | fighter, 12 | +0.09 | +0.08 | 0.00 | +0.01 ± 0.05 | no clear combo | Gladiator's Roar makes the foe frightened, which Fiend Worshipper uses |
| 10 | Pin to the Spot + Acrid Barrage | fighter, 14 | +0.69 | +0.68 | 0.00 | +0.01 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 11 | Do You Know Who I Am? + Stumbling Finisher | rogue, 12 | +0.11 | +0.12 | −0.02 | 0.00 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 12 | Scare to Death + Rampaging Ferocity | fighter, 15 | +0.36 | +0.35 | 0.00 | 0.00 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 13 | Fear No Law, Fear No One + Fiend Worshipper | fighter, 1 | +0.04 | +0.04 | 0.00 | 0.00 ± 0.02 | no clear combo | Fear No Law, Fear No One makes the foe frightened, which Fiend Worshipper uses |
| 14 | Pin to the Spot + Goblin Jubilee | fighter, 14 | +0.68 | +0.68 | −0.01 | 0.00 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 15 | Kneel Before the Rightful Heir + Stay Down! | rogue, 16 | +0.07 | +0.07 | 0.00 | 0.00 ± 0.09 | no clear combo | Kneel Before the Rightful Heir makes the foe prone, which Stay Down! uses |
| 16 | Devastating Duelist + Rampaging Ferocity | fighter, 18 | +0.14 | +0.13 | 0.00 | 0.00 ± 0.05 | no clear combo | two of the fighter's strongest feats |
| 17 | Orc Ferocity + Rampaging Ferocity | fighter, 17 | 0.00 | 0.00 | 0.00 | 0.00 ± 0.00 | no clear combo | Rampaging Ferocity builds on Orc Ferocity |
| 18 | Mesmerizing Gaze + Acknowledge Fan | fighter, 12 | +0.05 | 0.00 | +0.05 | 0.00 ± 0.04 | no clear combo | Acknowledge Fan builds on Mesmerizing Gaze |
| 19 | Stonebound Dedication + Living Stone | fighter, 12 | −0.02 | −0.02 | 0.00 | 0.00 ± 0.02 | no clear combo | Living Stone builds on Stonebound Dedication |
| 20 | Stonebound Dedication + Stone Guardian | fighter, 4 | +0.03 | +0.03 | 0.00 | 0.00 ± 0.03 | no clear combo | Stone Guardian builds on Stonebound Dedication |
| 21 | Call Worm Spirit + Stay Down! | rogue, 14 | +0.05 | +0.05 | 0.00 | 0.00 ± 0.07 | no clear combo | Call Worm Spirit makes the foe prone, which Stay Down! uses |
| 22 | Mummy Dedication + Desiccating Inhalation | fighter, 12 | +0.04 | 0.00 | +0.04 | 0.00 ± 0.05 | no clear combo | Desiccating Inhalation builds on Mummy Dedication |
| 23 | Gladiator's Roar + Savor the Hunt | fighter, 12 | +0.08 | +0.08 | 0.00 | 0.00 ± 0.05 | no clear combo | Gladiator's Roar makes the foe frightened, which Savor the Hunt uses |
| 24 | Gladiator's Roar + Think Twice | fighter, 14 | +0.03 | +0.03 | 0.00 | 0.00 ± 0.02 | no clear combo | Gladiator's Roar makes the foe frightened, which Think Twice uses |
| 25 | Death Drone + Savor the Hunt | fighter, 1 | +0.06 | +0.06 | 0.00 | 0.00 ± 0.05 | no clear combo | Death Drone makes the foe frightened, which Savor the Hunt uses |
| 26 | Death Drone + Think Twice | fighter, 14 | −0.01 | −0.01 | 0.00 | 0.00 ± 0.02 | no clear combo | Death Drone makes the foe frightened, which Think Twice uses |
| 27 | Titan Swing + Stay Down! | rogue, 14 | −0.02 | −0.02 | 0.00 | 0.00 ± 0.06 | no clear combo | Titan Swing makes the foe prone, which Stay Down! uses |
| 28 | Fear No Law, Fear No One + Think Twice | fighter, 14 | +0.13 | +0.13 | 0.00 | 0.00 ± 0.05 | no clear combo | Fear No Law, Fear No One makes the foe frightened, which Think Twice uses |
| 29 | Fear No Law, Fear No One + Savor the Hunt | fighter, 1 | +0.04 | +0.04 | 0.00 | 0.00 ± 0.02 | no clear combo | Fear No Law, Fear No One makes the foe frightened, which Savor the Hunt uses |
| 30 | Kraken's Call + Drink Blood | fighter, 17 | +0.01 | +0.01 | 0.00 | 0.00 ± 0.02 | no clear combo | Kraken's Call makes the foe grabbed, which Drink Blood uses |
| 31 | Pit of Snakes + Drink Blood | fighter, 13 | 0.00 | 0.00 | 0.00 | 0.00 ± 0.01 | no clear combo | Pit of Snakes makes the foe grabbed, which Drink Blood uses |
| 32 | Taste Blood + Drink Blood | fighter, 5 | 0.00 | 0.00 | 0.00 | 0.00 ± 0.00 | no clear combo | Taste Blood makes the foe restrained, which Drink Blood uses |
| 33 | Opportunistic Accusation + Vital Shot | fighter, 1 | 0.00 | 0.00 | 0.00 | 0.00 ± 0.04 | no clear combo | Opportunistic Accusation makes the foe off-guard, which Vital Shot uses |
| 34 | Pointed Question + Vital Shot | rogue, 1 | 0.00 | 0.00 | 0.00 | 0.00 ± 0.03 | no clear combo | Pointed Question makes the foe off-guard, which Vital Shot uses |
| 35 | Opportunistic Accusation + Weft and Warp | fighter, 16 | −0.01 | 0.00 | −0.01 | 0.00 ± 0.02 | no clear combo | Opportunistic Accusation makes the foe off-guard, which Weft and Warp uses |
| 36 | Pointed Question + Weft and Warp | rogue, 16 | −0.04 | 0.00 | −0.04 | 0.00 ± 0.03 | no clear combo | Pointed Question makes the foe off-guard, which Weft and Warp uses |
| 37 | Pin to the Spot + Rampaging Ferocity | fighter, 14 | +0.68 | +0.68 | 0.00 | 0.00 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 38 | Death Drone + Fiend Worshipper | fighter, 1 | +0.05 | +0.06 | 0.00 | 0.00 ± 0.05 | no clear combo | Death Drone makes the foe frightened, which Fiend Worshipper uses |
| 39 | Scare to Death + Siphon Life | fighter, 15 | +0.33 | +0.35 | −0.01 | 0.00 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 40 | Scare to Death + Acrid Barrage | fighter, 15 | +0.35 | +0.35 | +0.01 | 0.00 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 41 | Fatal Shot + Rampaging Ferocity | fighter, 18 | +0.24 | +0.24 | 0.00 | 0.00 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 42 | Kneel Before the Rightful Heir + Rock The Boat | fighter, 16 | +0.06 | +0.05 | +0.02 | −0.01 ± 0.07 | no clear combo | Kneel Before the Rightful Heir makes the foe prone, which Rock The Boat uses |
| 43 | Debilitating Dichotomy + Sapping Symbol | cleric, 12 | +0.02 | 0.00 | +0.03 | −0.01 ± 0.03 | no clear combo | two of the cleric's strongest feats |
| 44 | Stonebound Dedication + Stonebound Magic | fighter, 6 | −0.24 | +0.02 | −0.25 | −0.01 ± 0.08 | no clear combo | Stonebound Magic builds on Stonebound Dedication |
| 45 | Do You Know Who I Am? + Unbalancing Finisher | rogue, 12 | +0.18 | +0.12 | +0.07 | −0.01 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 46 | Acrid Barrage + Siphon Life | fighter, 10 | +0.09 | +0.01 | +0.10 | −0.01 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 47 | Demolish Defenses + Vital Shot | fighter, 18 | 0.00 | +0.01 | 0.00 | −0.01 ± 0.07 | no clear combo | Demolish Defenses makes the foe off-guard, which Vital Shot uses |
| 48 | Spring from the Shadows + Stumbling Finisher | rogue, 12 | +0.09 | +0.13 | −0.02 | −0.02 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 49 | Fatal Shot + Acrid Barrage | fighter, 18 | +0.21 | +0.24 | −0.01 | −0.02 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 50 | Mobile Finisher + Head Stomp | rogue, 12 | +0.15 | +0.12 | +0.04 | −0.02 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 51 | Reveal Machinations + Stumbling Finisher | rogue, 15 | +0.01 | +0.06 | −0.03 | −0.02 ± 0.07 | no clear combo | two of the rogue's strongest feats |
| 52 | Do You Know Who I Am? + Head Stomp | rogue, 12 | +0.15 | +0.12 | +0.04 | −0.02 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 53 | Spring from the Shadows + Head Stomp | rogue, 12 | +0.15 | +0.13 | +0.04 | −0.02 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 54 | Demolish Defenses + Weft and Warp | fighter, 18 | −0.01 | +0.01 | 0.00 | −0.03 ± 0.07 | no clear combo | Demolish Defenses makes the foe off-guard, which Weft and Warp uses |
| 55 | Titan Swing + Rock The Boat | fighter, 8 | +0.03 | +0.03 | +0.03 | −0.03 ± 0.06 | no clear combo | Titan Swing makes the foe prone, which Rock The Boat uses |
| 56 | Unbalancing Finisher + Reveal Machinations | rogue, 15 | +0.10 | +0.07 | +0.06 | −0.03 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 57 | Gang Up + Stumbling Finisher | rogue, 10 | +0.14 | +0.13 | +0.04 | −0.03 ± 0.07 | no clear combo | two of the rogue's strongest feats |
| 58 | Goblin Jubilee + Fatal Shot | fighter, 18 | +0.26 | +0.06 | +0.24 | −0.03 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 59 | Mobile Finisher + Stumbling Finisher | rogue, 12 | +0.07 | +0.12 | −0.02 | −0.04 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 60 | Devastating Duelist + Siphon Life | fighter, 18 | +0.14 | +0.13 | +0.04 | −0.04 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 61 | Pin to the Spot + Siphon Life | fighter, 14 | +0.69 | +0.68 | +0.04 | −0.04 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 62 | Mobile Finisher + Reveal Machinations | rogue, 15 | +0.12 | +0.10 | +0.06 | −0.04 ± 0.07 | no clear combo | two of the rogue's strongest feats |
| 63 | Head Stomp + Stumbling Finisher | rogue, 10 | +0.08 | +0.08 | +0.04 | −0.04 ± 0.06 | no clear combo | two of the rogue's strongest feats |
| 64 | Spring from the Shadows + Reveal Machinations | rogue, 15 | +0.12 | +0.10 | +0.06 | −0.04 ± 0.07 | no clear combo | two of the rogue's strongest feats |
| 65 | Goblin Jubilee + Devastating Duelist | fighter, 18 | +0.15 | +0.06 | +0.13 | −0.04 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 66 | Siphon Life + Rampaging Ferocity | fighter, 10 | +0.13 | +0.10 | +0.07 | −0.04 ± 0.06 | no clear combo | two of the fighter's strongest feats |
| 67 | Head Stomp + Reveal Machinations | rogue, 15 | +0.09 | +0.07 | +0.06 | −0.04 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 68 | Do You Know Who I Am? + Reveal Machinations | rogue, 15 | +0.08 | +0.06 | +0.06 | −0.04 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 69 | Unbalancing Finisher + Stumbling Finisher | rogue, 10 | +0.09 | +0.10 | +0.04 | −0.05 ± 0.06 | no clear combo | two of the rogue's strongest feats |
| 70 | Mobile Finisher + Do You Know Who I Am? | rogue, 12 | +0.19 | +0.12 | +0.12 | −0.05 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 71 | Unbalancing Finisher + Head Stomp | rogue, 4 | +0.07 | +0.06 | +0.07 | −0.05 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 72 | Gang Up + Reveal Machinations | rogue, 15 | +0.13 | +0.12 | +0.06 | −0.06 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 73 | Mobile Finisher + Unbalancing Finisher | rogue, 12 | +0.13 | +0.12 | +0.07 | −0.06 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 74 | Fatal Shot + Siphon Life | fighter, 18 | +0.22 | +0.24 | +0.04 | −0.06 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 75 | Spring from the Shadows + Unbalancing Finisher | rogue, 12 | +0.13 | +0.13 | +0.07 | −0.06 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 76 | Call Worm Spirit + Rock The Boat | fighter, 10 | +0.07 | +0.09 | +0.04 | −0.06 ± 0.06 | no clear combo | Call Worm Spirit makes the foe prone, which Rock The Boat uses |
| 77 | Spring from the Shadows + Do You Know Who I Am? | rogue, 12 | +0.18 | +0.13 | +0.12 | −0.07 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 78 | Do You Know Who I Am? + Gang Up | rogue, 12 | +0.23 | +0.12 | +0.19 | −0.08 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 79 | Unbalancing Finisher + Gang Up | rogue, 6 | +0.13 | +0.10 | +0.12 | −0.08 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 80 | Gang Up + Head Stomp | rogue, 6 | +0.14 | +0.12 | +0.11 | −0.09 ± 0.05 | no clear combo | two of the rogue's strongest feats |
| 81 | Spring from the Shadows + Gang Up | rogue, 12 | +0.22 | +0.13 | +0.19 | −0.10 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 82 | Mobile Finisher + Gang Up | rogue, 12 | +0.22 | +0.12 | +0.19 | −0.10 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 83 | Calculate Threats + Psi Burst | wizard, 2 | +0.12 | +0.13 | +0.09 | −0.10 ± 0.07 | no clear combo | two of the wizard's strongest feats |
| 84 | Pin to the Spot + Devastating Duelist | fighter, 18 | +0.83 | +0.81 | +0.13 | −0.11 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 85 | Fatal Shot + Devastating Duelist | fighter, 18 | +0.27 | +0.24 | +0.13 | −0.11 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 86 | Scare to Death + Devastating Duelist | fighter, 18 | +0.52 | +0.50 | +0.13 | −0.11 ± 0.07 | no clear combo | two of the fighter's strongest feats |
| 87 | Spring from the Shadows + Mobile Finisher | rogue, 12 | +0.12 | +0.13 | +0.12 | −0.13 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 88 | Goblin Jubilee + Acrid Barrage | fighter, 1 | +0.36 | +0.31 | +0.21 | −0.16 ± 0.07 | get in each other's way | two of the fighter's strongest feats |
| 89 | Scare to Death + Fatal Shot | fighter, 18 | +0.54 | +0.50 | +0.24 | −0.20 ± 0.08 | get in each other's way | two of the fighter's strongest feats |
| 90 | Pin to the Spot + Fatal Shot | fighter, 18 | +0.81 | +0.81 | +0.24 | −0.24 ± 0.08 | get in each other's way | two of the fighter's strongest feats |
| 91 | Pin to the Spot + Scare to Death | fighter, 15 | +0.57 | +0.54 | +0.35 | −0.32 ± 0.07 | get in each other's way | two of the fighter's strongest feats |

Not tested: 0 pairs ().
