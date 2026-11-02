# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-02: 1022 feats and actions rated, 5925 not simulated, 2 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 912
- hurts: 84
- good: 12
- minor: 11
- strong: 2
- very strong: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.68 ± 0.05 | +1.08 | +0.29 | 3.9 | very strong |  |
| 2 | Scare to Death | 15 | Skill | — | save | +0.35 ± 0.04 | +0.66 | +0.04 | 1.0 | strong |  |
| 3 | Goblin Jubilee | 0 | Action | — | save | +0.31 ± 0.04 | +0.14 | +0.48 | 0.4 | strong |  |
| 4 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.15 | 2.5 | good |  |
| 5 | Acrid Barrage | 0 | Action | — | save | +0.21 ± 0.04 | +0.21 | +0.20 | 1.1 | good |  |
| 6 | Pierce the Eye | 16 | Class | — | save | +0.17 ± 0.06 | +0.31 | +0.03 | 1.3 | good | with a bow in hand |
| 7 | Calculate Threats | 0 | Action | psychic | effect | +0.15 ± 0.03 | +0.13 | +0.16 | 2.8 | good |  |
| 8 | Devastating Duelist | 18 | Class | — | Strike activity | +0.13 ± 0.04 | +0.18 | +0.08 | 4.0 | good |  |
| 9 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.13 ± 0.06 | +0.21 | +0.05 | 2.3 | good |  |
| 10 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.12 ± 0.06 | +0.18 | +0.07 | 2.8 | good |  |
| 11 | Do You Know Who I Am? | 12 | Class | — | check | +0.12 ± 0.05 | +0.15 | +0.09 | 1.0 | good |  |
| 12 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.12 ± 0.03 | +0.17 | +0.07 | 4.9 | good |  |
| 13 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 14 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.10 ± 0.02 | +0.19 | +0.02 | 2.1 | good | with a bow in hand |
| 15 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.04 | +0.20 | +0.00 | 2.3 | good |  |
| 16 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 17 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 18 | Call Worm Spirit | 10 | Class | — | save | +0.09 ± 0.04 | +0.08 | +0.10 | 1.0 | minor |  |
| 19 | Psi Burst | 2 | Class | psychic | save | +0.09 ± 0.04 | +0.16 | +0.01 | 1.9 | minor |  |
| 20 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 7.3 | no clear effect |  |
| 21 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 22 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 23 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 24 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.17 | −0.02 | 1.9 | no clear effect |  |
| 25 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 26 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.07 ± 0.03 | +0.10 | +0.04 | 1.3 | minor | with two weapons (longsword and shortsword) |
| 27 | Debilitating Dichotomy | 8 | Class | oracle | save | +0.06 ± 0.05 | +0.11 | +0.02 | 0.9 | no clear effect |  |
| 28 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 29 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.02 | 0.5 | no clear effect |  |
| 30 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 31 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 32 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 33 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 34 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 35 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 36 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 37 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 38 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.08 | +0.02 | 0.2 | minor |  |
| 39 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.08 | +0.02 | 0.2 | minor |  |
| 40 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|
| Demoralize | +0.02 ± 0.01 | 0.5 |
| Feint | +0.00 ± 0.00 | 0.0 |
| Trip | +0.00 ± 0.00 | 0.0 |
| Shove | +0.00 ± 0.00 | 0.0 |
| Disarm | +0.00 ± 0.00 | 0.0 |
| Escape | +0.00 ± 0.00 | 0.0 |
| Reposition | +0.00 ± 0.00 | 0.0 |
| Grapple | −0.00 ± 0.00 | 0.3 |

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.68 ± 0.05 | +1.08 | +0.29 | 3.9 | very strong |  |
| 2 | Scare to Death | 15 | Skill | — | save | +0.35 ± 0.04 | +0.66 | +0.04 | 1.0 | strong |  |
| 3 | Goblin Jubilee | 0 | Action | — | save | +0.31 ± 0.04 | +0.14 | +0.48 | 0.4 | strong |  |
| 4 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.15 | 2.5 | good |  |
| 5 | Acrid Barrage | 0 | Action | — | save | +0.21 ± 0.04 | +0.21 | +0.20 | 1.1 | good |  |
| 6 | Pierce the Eye | 16 | Class | — | save | +0.17 ± 0.06 | +0.31 | +0.03 | 1.3 | good | with a bow in hand |
| 7 | Calculate Threats | 0 | Action | psychic | effect | +0.15 ± 0.03 | +0.13 | +0.16 | 2.8 | good |  |
| 8 | Devastating Duelist | 18 | Class | — | Strike activity | +0.13 ± 0.04 | +0.18 | +0.08 | 4.0 | good |  |
| 9 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.13 ± 0.06 | +0.21 | +0.05 | 2.3 | good |  |
| 10 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.12 ± 0.06 | +0.18 | +0.07 | 2.8 | good |  |
| 11 | Do You Know Who I Am? | 12 | Class | — | check | +0.12 ± 0.05 | +0.15 | +0.09 | 1.0 | good |  |
| 12 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.12 ± 0.03 | +0.17 | +0.07 | 4.9 | good |  |
| 13 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 14 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.10 ± 0.02 | +0.19 | +0.02 | 2.1 | good | with a bow in hand |
| 15 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.04 | +0.20 | +0.00 | 2.3 | good |  |
| 16 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 17 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 18 | Call Worm Spirit | 10 | Class | — | save | +0.09 ± 0.04 | +0.08 | +0.10 | 1.0 | minor |  |
| 19 | Psi Burst | 2 | Class | psychic | save | +0.09 ± 0.04 | +0.16 | +0.01 | 1.9 | minor |  |
| 20 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 7.3 | no clear effect |  |
| 21 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 22 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 23 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 24 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.17 | −0.02 | 1.9 | no clear effect |  |
| 25 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 26 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.07 ± 0.03 | +0.10 | +0.04 | 1.3 | minor | with two weapons (longsword and shortsword) |
| 27 | Debilitating Dichotomy | 8 | Class | oracle | save | +0.06 ± 0.05 | +0.11 | +0.02 | 0.9 | no clear effect |  |
| 28 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 29 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.02 | 0.5 | no clear effect |  |
| 30 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 31 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 32 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 33 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 34 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 35 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 36 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 37 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 38 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.08 | +0.02 | 0.2 | minor |  |
| 39 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.08 | +0.02 | 0.2 | minor |  |
| 40 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 41 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 42 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 43 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 44 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 45 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 46 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |
| 47 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 48 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.04 | +0.08 | +0.01 | 2.2 | no clear effect |  |
| 49 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.04 ± 0.04 | +0.07 | +0.01 | 5.7 | no clear effect |  |
| 50 | Desiccating Inhalation | 12 | Class | — | save | +0.04 ± 0.03 | +0.06 | +0.02 | 0.3 | no clear effect |  |
| 51 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 52 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.04 ± 0.03 | +0.03 | +0.04 | 3.2 | no clear effect |  |
| 53 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.01 | 1.6 | no clear effect |  |
| 54 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.02 | +0.01 | +0.06 | 0.1 | no clear effect |  |
| 55 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 56 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.03 ± 0.03 | −0.02 | +0.09 | 0.9 | no clear effect |  |
| 57 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.2 | no clear effect |  |
| 58 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.06 | +0.00 | 1.1 | no clear effect |  |
| 59 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 60 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 61 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.02 | +0.09 | −0.03 | 0.4 | no clear effect |  |
| 62 | Rock The Boat | 8 | Class | fighter | check | +0.03 ± 0.01 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 63 | Part the Veil | 0 | Action | — | check | +0.03 ± 0.03 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 64 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 65 | Enchanting Shot | 8 | Class | — | Strike activity | +0.03 ± 0.04 | +0.08 | −0.02 | 2.2 | no clear effect |  |
| 66 | Raise Symbol | 4 | Class | cleric | self effect | +0.03 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 67 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.11 | −0.05 | 1.8 | no clear effect |  |
| 68 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | +0.03 ± 0.01 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 69 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 70 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 71 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.03 | +0.04 | +0.01 | 0.2 | no clear effect |  |
| 72 | Reversing Charge | 8 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 73 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 74 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.2 | no clear effect |  |
| 75 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 76 | Propulsive Leap | 10 | Class | — | save | +0.02 ± 0.04 | +0.05 | −0.00 | 2.1 | no clear effect |  |
| 77 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.05 | −0.01 | 11.3 | no clear effect | with a one-handed weapon and a free hand |
| 78 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 79 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 80 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 81 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 82 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 83 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 84 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.02 ± 0.02 | +0.05 | −0.01 | 1.5 | no clear effect |  |
| 85 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 86 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 87 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | +0.02 ± 0.04 | +0.14 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 88 | Feathered Flechettes | 6 | Class | — | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 89 | Breath of Hungry Death | 16 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.4 | no clear effect |  |
| 90 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.2 | no clear effect |  |
| 91 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | +0.02 ± 0.02 | +0.00 | +0.04 | 0.2 | no clear effect |  |
| 92 | To Me! | 18 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.03 | 0.5 | no clear effect |  |
| 93 | Confusing Commands | 16 | Class | commander | save | +0.02 ± 0.02 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 94 | Archer's Aim | 8 | Class | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 95 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | +0.02 ± 0.02 | +0.03 | +0.00 | 0.4 | no clear effect |  |
| 96 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | +0.02 ± 0.01 | +0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 97 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | +0.02 ± 0.01 | −0.00 | +0.03 | 0.2 | no clear effect |  |
| 98 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.03 | −0.00 | 1.7 | no clear effect |  |
| 99 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | +0.02 ± 0.01 | +0.01 | +0.02 | 0.3 | no clear effect |  |
| 100 | Flower Street Infamy | 11 | Skill | — | check | +0.02 ± 0.02 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 101 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 102 | Repel Ambient Magic | 0 | Action | — | effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 103 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 104 | Call Hellfire | 8 | Class | — | save | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 105 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.02 | +0.05 | −0.02 | 0.6 | no clear effect |  |
| 106 | Rain of Bolts | 9 | Ancestry | — | save | +0.01 ± 0.02 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 107 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 108 | Demolish Defenses | 18 | Class | guardian | Strike activity | +0.01 ± 0.05 | +0.01 | +0.02 | 1.8 | no clear effect |  |
| 109 | Kraken's Call | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 110 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.01 ± 0.03 | +0.05 | −0.03 | 3.2 | no clear effect |  |
| 111 | Launch Fireworks | 0 | Action | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 112 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | +0.01 ± 0.05 | +0.02 | +0.00 | 1.3 | no clear effect |  |
| 113 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 114 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.1 | no clear effect |  |
| 115 | Trip | 0 | Action | — | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 116 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 117 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 118 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.8 | no clear effect |  |
| 119 | Emotional Surge | 10 | Class | psychic | effect | +0.01 ± 0.01 | +0.02 | −0.00 | 0.2 | no clear effect |  |
| 120 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | +0.01 ± 0.07 | +0.02 | −0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 121 | Feral Mending | 8 | Class | — | check | +0.01 ± 0.03 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 122 | Tenacious Stance | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 123 | Subjugation | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 124 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 125 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 126 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | +0.01 ± 0.02 | −0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 127 | Draw From the Land | 10 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 128 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 2.1 | no clear effect |  |
| 129 | Crimson Shroud | 6 | Class | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 130 | Quill Spray | 9 | Ancestry | — | save | +0.01 ± 0.03 | −0.04 | +0.06 | 0.1 | no clear effect |  |
| 131 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 132 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 133 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 134 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 135 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 136 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 137 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | +0.01 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect | with two weapons (longsword and shortsword) |
| 138 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 139 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 140 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | +0.01 ± 0.02 | +0.00 | +0.01 | 0.2 | no clear effect |  |
| 141 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 142 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 143 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 144 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.7 | no clear effect |  |
| 145 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 146 | Dragonet Breath | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 147 | Engine of Destruction | 18 | Class | inventor | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 148 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 149 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 150 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 151 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 152 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 153 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 154 | Tamper | 1 | Class | inventor | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 155 | Decree of War | 18 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 156 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.2 | no clear effect |  |
| 157 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 158 | Draconic Fury | 4 | Class | — | save | +0.00 ± 0.01 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 159 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 160 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 161 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 162 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 164 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 165 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 168 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 169 | Pit of Snakes | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 170 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 171 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Unleash the Blight | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 174 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 175 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 176 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Thunder Clap | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 179 | Flinging Blow | 16 | Class | monk | Strike activity | +0.00 ± 0.03 | −0.02 | +0.02 | 0.8 | no clear effect |  |
| 180 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 182 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 183 | Unstable Gearshift | 6 | Class | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 184 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 186 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Raise Slabs | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 188 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect | with a bow in hand |
| 189 | Glory on High | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 190 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 191 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 192 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 193 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 195 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 196 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 197 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 198 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 199 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 200 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 201 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Draconic Resilience | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 203 | Twin Parry | 4 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 204 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 205 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 206 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect |  |
| 207 | Channel Divine Spark | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 208 | Drain Vitality | 10 | Class | — | check | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Armored Courage | 4 | Class | guardian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 210 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 211 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | +0.00 ± 0.04 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 212 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 213 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 214 | Demon Slayer | 17 | Ancestry | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 215 | Courageous Onslaught | 16 | Class | bard | Strike activity | +0.00 ± 0.02 | +0.02 | −0.02 | 0.3 | no clear effect |  |
| 216 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | +0.00 ± 0.01 | +0.02 | −0.02 | 0.2 | no clear effect |  |
| 217 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 218 | Cobra Stance | 4 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 219 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 220 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 222 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 223 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 224 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 225 | Roar Mimicry | 12 | Class | — | save | +0.00 ± 0.02 | +0.02 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 226 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 228 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 229 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 230 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 231 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 232 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 233 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 234 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 235 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 236 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 238 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 239 | Lantern Strobe | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 240 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 241 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 242 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 243 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 244 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 245 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 246 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 247 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 248 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 249 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 250 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 251 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 252 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 253 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 254 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 255 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 256 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 257 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 258 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 259 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 260 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 261 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 262 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 263 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 265 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 266 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 268 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 269 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 270 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 272 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 273 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 274 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 275 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 277 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 278 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 279 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 280 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 281 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 282 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 283 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 284 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 285 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 286 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 287 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 288 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 289 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 290 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 291 | Vengeful Remnant | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 292 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 293 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 294 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 295 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 296 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 297 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 298 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 299 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 300 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 301 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 302 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 303 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 304 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 305 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 306 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 307 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 308 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 309 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 310 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 311 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 312 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 313 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 314 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 315 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 316 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 318 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 319 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 320 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 321 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 322 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 323 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 324 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 325 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 326 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 327 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 328 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 329 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 330 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 331 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 332 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 333 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 334 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 335 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 337 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 341 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 343 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 344 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 345 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 346 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 348 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 350 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 351 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 352 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 353 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 355 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 356 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 357 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 360 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 361 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 362 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 365 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 366 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 367 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 368 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 371 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 374 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 375 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 376 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 377 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 378 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 379 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 380 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 382 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 385 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 386 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 387 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 388 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 390 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 392 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 393 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 394 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 396 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Primadonna | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 400 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 401 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 403 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 405 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 407 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Psi Catastrophe | 12 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 410 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 413 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 414 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 417 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 418 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 419 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 421 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 422 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 423 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 424 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 426 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 427 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 428 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 429 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 431 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 435 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 436 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 437 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 439 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 440 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 441 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 442 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 443 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 444 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 445 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 446 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 447 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 449 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 455 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 459 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 461 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 462 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 463 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 464 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 465 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 466 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 467 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 469 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 470 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 475 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 486 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 487 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 497 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 501 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 503 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 504 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 509 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 511 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 512 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 515 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 517 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 526 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 532 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 537 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 548 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 553 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 554 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 556 | Animal Summoner | 9 | Ancestry | — | innate spell: Summon Animal (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Labyrinthine Echoes | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 560 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Unseen Passage | 8 | Class | gunslinger | innate spell: Vanishing Tracks (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 563 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Animal Soul Siblings | 5 | Ancestry | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Enter Divine Realm | 20 | Class | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Ghoran's Wrath | 17 | Ancestry | — | innate spell: Nature's Reprisal (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Summon Air Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 572 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Impossible Gossip | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 575 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Bend Space | 17 | Ancestry | — | innate spell: Teleport (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Call Draconic Ally | 14 | Class | — | innate spell: Summon Dragon (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Brightness Seeker | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Rat Magic | 5 | Ancestry | — | innate spell: Animal Messenger (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 586 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Water Conjuration | 5 | Ancestry | — | innate spell: Create Water (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Pierce the Light | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Shadow Pact | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 594 | Stone Guardian | 4 | Class | — | innate spell: Summon Elemental (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Arboreal Conversationalist | 13 | Ancestry | — | innate spell: Speak with Plants (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Irriseni Ice-Witch | 13 | Ancestry | — | innate spell: Wall of Ice (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Innocent Butterfly | 14 | Class | — | innate spell: Aura of the Unremarkable (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 600 | Frightful Figment | 1 | Ancestry | — | innate spell: Figment (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Stem the Tide | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Reimagine | 13 | Ancestry | — | innate spell: Dreaming Potential (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Kijimuna Whistle | 13 | Ancestry | — | innate spell: Summon Plant or Fungus (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Arcane Sense | 1 | Skill | — | innate spell: Detect Magic (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Splendid Illusion | 13 | Ancestry | — | innate spell: Illusory Scene (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Astral Blink | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 612 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 613 | Patron's Whisper | 10 | Class | — | innate spell: Message (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Lorefinder | 8 | Class | — | innate spell: Locate (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | The Moon Weaver's Art | 5 | Ancestry | — | innate spell: Illusory Object (rank 1), Invisible Item (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 619 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Summon Fire Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 621 | Aberration Kinship | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | None Shall Know | 13 | Ancestry | — | innate spell: Veil of Privacy (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 624 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 626 | Realm Strider | 16 | Class | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 627 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Skirt the Light | 13 | Ancestry | — | innate spell: Umbral Journey (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 630 | Soul Vessel Mount | 18 | Class | — | innate spell: Seize Soul (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 632 | Maze of Runes | 16 | Class | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 633 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 634 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 636 | Prophet's Lockbox | 10 | Class | — | innate spell: Imaginary Lockbox (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 637 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 638 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 639 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 641 | Flower Chimera | 13 | Ancestry | — | innate spell: Spiritual Guardian (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 642 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 643 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 645 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Boneyard Acquaintance | 17 | Ancestry | — | innate spell: Spiritual Guardian (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 648 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 649 | Summon Water Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 650 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 651 | Share Thoughts | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 652 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 654 | Leave no Trace | 5 | Ancestry | — | innate spell: Vanishing Tracks (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 658 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Truespeech | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 661 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 662 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 663 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 664 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 665 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | Axial Recall | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 668 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 669 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 670 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 671 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 672 | Fossil Rider | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 674 | Night Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Mist (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 675 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 677 | Unfettering Prankster | 17 | Ancestry | — | innate spell: Unfettered Pack (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 678 | Summon Metal Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Beast Speaker | 4 | Class | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 680 | Kizidhar Magic | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 681 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 682 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 684 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 685 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 686 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Fey Life | 16 | Class | — | innate spell: Summon Fey (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 688 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Tree's Ward | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Borrow Memories | 14 | Class | — | innate spell: Mind Probe (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 691 | Into the Labyrinth | 17 | Ancestry | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | Stonewalker | 9 | Ancestry | — | innate spell: One with Stone (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 693 | Call Ursine Ally | 8 | Class | — | innate spell: Summon Animal (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Persistent Creation | 8 | Class | — | innate spell: Creation (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 696 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 697 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 698 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 699 | Azaersi's Roads | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Summon Earth Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 704 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 705 | Summon Wood Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 706 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 707 | Plant Soul Siblings | 9 | Ancestry | — | innate spell: Speak with Plants (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 708 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 709 | Grandmother's Wisdom | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Appraiser’s Eye | 1 | Ancestry | — | innate spell: Read Aura (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 713 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Stone Soul Siblings | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 715 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 718 | Thrown Voice | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 720 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | Avatar's Audience | 20 | Class | cleric | innate spell: Commune (rank 6), Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 722 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Distant Cackle | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 726 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 727 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 729 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 730 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Call the Worm | 18 | Class | — | innate spell: Summon Animal (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Fade Away | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Disguise Magic (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Whispers in the Night | 9 | Ancestry | — | innate spell: Darkness (rank 2), Ventriloquism (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Terrifying Countenance | 18 | Class | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 738 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | Slip Sideways | 13 | Ancestry | — | innate spell: Translocate (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 746 | Analyze Information | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | River Adaptation | 9 | Ancestry | — | innate spell: Feet to Fins (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Light-Bending Jewel | 13 | Ancestry | — | innate spell: Invisibility (rank 2), Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Asp Stance | 6 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Ascendant Blood | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 756 | Jotun's Transposition | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 757 | Skeletal Transformation | 13 | Ancestry | — | innate spell: Animal Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Azarketi Purification | 9 | Ancestry | — | innate spell: Cleanse Cuisine (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 764 | Homeward Bound | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Stonegate | 17 | Ancestry | — | innate spell: Magic Passage (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 768 | Ancestral Form | 9 | Ancestry | — | innate spell: Animal Form (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Writing On the Wall | 4 | Class | — | innate spell: Embed Message (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Devil Allies | 0 | Bonus | — | innate spell: Summon Fiend (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Boneyard's Call | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Unrivaled Builder | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Secrets of the Past | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 779 | Fearsome Form | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Wall of Roses | 8 | Class | — | innate spell: Wall of Thorns (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Siphon Torment | 9 | Ancestry | — | innate spell: Claim Curse (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Cloud Walk | 10 | Class | — | innate spell: Air Walk (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 784 | Moon May | 1 | Ancestry | — | innate spell: Guidance (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Linguistic Revival | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | No Hands, No Problem | 5 | Ancestry | — | innate spell: Telekinetic Hand (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Bone Investiture | 13 | Ancestry | — | innate spell: Dinosaur Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Spiritual Headhunter | 13 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 789 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Soul Warden Dedication | 2 | Class | — | innate spell: Vitality Lash (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Ancestor's Rage | 13 | Ancestry | — | innate spell: Animal Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Water to Water | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Dig up Secrets | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Lingering Echoes | 9 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Shared Dream | 16 | Class | — | innate spell: Dream Council (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 801 | Dominion Aura | 17 | Ancestry | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | I Will Return | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 804 | Death of Hope | 17 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Coordinated Charge | 12 | Class | — | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 807 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 808 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 809 | Spirit Guide Form | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Vital Shot | 0 | Action | gunslinger | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 811 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 812 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 813 | Flash of Omnipresence | 14 | Class | — | save | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 814 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 815 | Golden Body | 20 | Class | monk | fast-healing | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect |  |
| 816 | Putrefaction | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 818 | Trial by Skyfire | 10 | Class | oracle | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 819 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.00 ± 0.01 | −0.01 | +0.01 | 0.2 | no clear effect |  |
| 821 | Mind Shards | 6 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 822 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 823 | Diamond Soul | 12 | Class | monk | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 824 | Construct Dynamo | 12 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 825 | Absolve Sins | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 826 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 827 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 828 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.01 | 1.3 | no clear effect |  |
| 830 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.3 | no clear effect |  |
| 831 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 832 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.00 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.00 ± 0.02 | −0.00 | −0.01 | 1.7 | no clear effect |  |
| 834 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 835 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 836 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 837 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.3 | no clear effect |  |
| 839 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.01 ± 0.02 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 840 | Blood Shield | 4 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 841 | Muckraking | 16 | Class | — | save | −0.01 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 842 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 843 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 844 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 845 | Bone Swarm | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 846 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 847 | Trample Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 848 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 849 | Freeze It! | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 850 | Frightening Indignation | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 851 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.01 ± 0.02 | +0.00 | −0.02 | 3.5 | no clear effect |  |
| 852 | Radiant Burst | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 853 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 854 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 855 | Flurry of Blows | 0 | Action | monk | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect |  |
| 856 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect | with a bow in hand |
| 857 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 858 | Chastise | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 859 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 860 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 861 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 862 | Repair Module | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.00 | 0.2 | no clear effect |  |
| 863 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 864 | No Scar but This | 0 | Action | — | check | −0.01 ± 0.01 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 865 | Storming Breath | 6 | Class | — | save | −0.01 ± 0.02 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 866 | Boarding Assault | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 867 | Break Free | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 868 | Defensive Advance | 1 | Class | champion | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 869 | Sudden Charge | 1 | Class | barbarian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 870 | Clobber | 16 | Class | guardian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 871 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.02 | 3.0 | no clear effect | with two weapons (longsword and shortsword) |
| 872 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 873 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | −0.01 | −0.01 | 0.1 | no clear effect |  |
| 874 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 875 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.02 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 876 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | +0.08 | −0.10 | 0.7 | no clear effect |  |
| 877 | Form a Flock | 13 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 878 | Wing Buffet | 9 | Ancestry | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 879 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.01 ± 0.02 | +0.00 | −0.02 | 0.8 | no clear effect |  |
| 880 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 881 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | −0.01 ± 0.02 | −0.02 | −0.00 | 0.0 | no clear effect |  |
| 882 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 883 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.02 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 884 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 885 | Impaling Thrust | 14 | Class | barbarian | Strike activity | −0.01 ± 0.06 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 886 | Brutish Shove | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 888 | Pack Attack | 6 | Class | — | strike-extra | −0.01 ± 0.04 | −0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 889 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 890 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 891 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 892 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 893 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.02 | +0.01 | −0.03 | 0.3 | no clear effect |  |
| 894 | Might of the Realm | 14 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 895 | Cantorian Rejuvenation | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 896 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 897 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 898 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 899 | Tap Vitality | 6 | Class | — | check | −0.02 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 900 | Thick Skin | 12 | Class | — | more maximum Hit Points | −0.02 ± 0.02 | +0.03 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 901 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.02 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 902 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.02 ± 0.02 | +0.00 | −0.04 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 903 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.02 ± 0.05 | −0.15 | +0.11 | 2.0 | no clear effect |  |
| 904 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 905 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 906 | Scout's Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 907 | Ravenous Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 908 | Interpose | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 909 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.03 ± 0.02 | −0.03 | −0.02 | 0.7 | no clear effect |  |
| 910 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 911 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.07 | 2.0 | no clear effect |  |
| 912 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.03 ± 0.06 | +0.00 | −0.07 | 1.0 | no clear effect |  |
| 913 | Herald's Strike | 20 | Class | — | save | −0.04 ± 0.05 | −0.04 | −0.03 | 0.8 | no clear effect |  |
| 914 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 915 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.04 | −0.05 | −0.03 | 1.0 | no clear effect |  |
| 916 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 917 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 918 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.05 ± 0.03 | −0.05 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 919 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.03 | +0.00 | −0.10 | 0.6 | hurts |  |
| 920 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | −0.06 ± 0.07 | −0.21 | +0.10 | 1.0 | no clear effect |  |
| 921 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | −0.07 ± 0.05 | −0.41 | +0.27 | 0.0 | no clear effect | the AI never used it |
| 922 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 923 | Doom of Sailors | 17 | Ancestry | — | save | −0.08 ± 0.04 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 924 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 2.3 | no clear effect |  |
| 925 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | −0.08 ± 0.03 | −0.03 | −0.13 | 0.0 | hurts | the AI never used it |
| 926 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.08 ± 0.05 | −0.01 | −0.15 | 0.3 | no clear effect |  |
| 927 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.4 | no clear effect |  |
| 928 | Fey Cantrips | 1 | Ancestry | — | innate spells: Light (rank 1), Ghost Sound (rank 1), Detect Magic (rank 1), Prestidigitation (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 929 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 930 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 931 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.09 ± 0.06 | −0.01 | −0.17 | 0.1 | no clear effect |  |
| 932 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.09 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 933 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 934 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.10 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 935 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.10 ± 0.06 | −0.19 | −0.01 | 0.1 | no clear effect |  |
| 936 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.10 ± 0.04 | −0.01 | −0.20 | 0.5 | hurts |  |
| 937 | Tidal Shield | 17 | Ancestry | — | effect | −0.10 ± 0.04 | −0.13 | −0.07 | 2.0 | hurts |  |
| 938 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 939 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 940 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 941 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 942 | Determined Lore Seeker | 12 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 943 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.12 ± 0.06 | −0.22 | −0.02 | 1.6 | no clear effect |  |
| 944 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 945 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 946 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.14 ± 0.07 | −0.21 | −0.07 | 0.2 | hurts |  |
| 947 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.15 ± 0.06 | −0.14 | −0.16 | 1.0 | hurts |  |
| 948 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.17 ± 0.04 | −0.30 | −0.04 | 1.7 | hurts |  |
| 949 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 950 | Magical Adaptation | 10 | Class | — | innate spells: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 951 | Greater Magical Scholastics | 10 | Class | — | innate spells: Augury (rank 2), Locate (rank 3), Veil of Privacy (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 952 | Greater Magical Edification | 10 | Class | — | innate spells: Translate (rank 2), Mindlink (rank 1), Secret Page (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 953 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 954 | Magical Scholastics | 4 | Class | — | innate spells: Detect Magic (rank 2), Guidance (rank 2), Read Aura (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 955 | Magical Edification | 4 | Class | — | innate spells: Guidance (rank 2), Message (rank 2), Sigil (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 956 | Warding Light | 4 | Class | — | innate spells: Light (rank 2), Peaceful Rest (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 957 | Sacral Lord | 4 | Class | champion | innate spells: Detect Magic (rank 2), Guidance (rank 2), Sigil (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 958 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 959 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 960 | Suli Amir | 13 | Ancestry | — | innate spells: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 961 | Summon Nephilim Kin | 13 | Ancestry | — | innate spells: Summon Celestial (rank 5), Summon Fiend (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 962 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 963 | Entities From Afar | 14 | Class | — | innate spells: Summon Entity (rank 5), Read Omens (rank 4) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 964 | Commandeer Hellmouth | 14 | Class | — | innate spells: Teleport (rank 6), Interplanar Teleport (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 965 | Expanded Runelord Magic | 14 | Class | — | innate spells: Contingency (rank 7), Spell Riposte (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 966 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.22 | −0.16 | 0.4 | hurts |  |
| 967 | Form of the Beloved Mother | 17 | Ancestry | — | innate spells: Animal Form (rank 5), Slither (rank 5) | −0.19 ± 0.06 | −0.21 | −0.17 | 0.0 | hurts | the AI never used it |
| 968 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | −0.19 ± 0.06 | −0.33 | −0.05 | 0.3 | hurts |  |
| 969 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 970 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spells: Repulsion (rank 6), Spellwrack (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 971 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 972 | Flourish and Ruin | 17 | Ancestry | — | innate spells: Field of Life (rank 6), Tangling Creepers (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 973 | Wildborn Adept | 5 | Ancestry | — | innate spells: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 974 | Colugo's Traversal | 5 | Ancestry | — | innate spells: Gentle Landing (rank 1), Jump (rank 1) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 975 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.20 ± 0.04 | −0.32 | −0.08 | 0.0 | hurts | the AI never used it |
| 976 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 977 | Animal Magic | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 978 | Agathion Magic | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 979 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spells: Augury (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 980 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.21 ± 0.06 | −0.21 | −0.22 | 0.0 | hurts | the AI never used it |
| 981 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spells: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.21 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 982 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 983 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.22 ± 0.05 | −0.35 | −0.08 | 0.2 | hurts |  |
| 984 | Apprentice Sea Witch | 5 | Ancestry | — | innate spells: Create Water (rank 1), Hydraulic Push (rank 1) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 985 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 986 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 987 | Phantom Orchestra | 9 | Ancestry | — | innate spells: Ventriloquism (rank 2), Figment (rank 5) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 988 | World-Protector's Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Cleanse Cuisine (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 989 | Emissary Assistance | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 3) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 990 | Janni Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Create Water (rank 1) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 991 | Efreeti Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Illusory Object (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 992 | Bone Caller | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Marvelous Mount (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 993 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 994 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spells: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 995 | Asura Magic | 9 | Ancestry | — | innate spells: Blood Vendetta (rank 2), Death Knell (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 996 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 997 | Speaker's Defense | 9 | Ancestry | — | innate spells: Share Life (rank 2), Status (rank 2), Entangling Flora (rank 2), Environmental Endurance (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 998 | Horn and Bone Incantation | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Humanoid Form (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 999 | Spiritual Echo | 9 | Ancestry | — | innate spells: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1000 | Flower Magic | 9 | Ancestry | — | innate spells: Oaken Resilience (rank 2), One with Plants (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1001 | Duskwalker Magic | 9 | Ancestry | — | innate spells: Augury (rank 2), Peaceful Rest (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1002 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spells: Resist Energy (rank 2), Share Life (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1003 | Natural Magnetism | 9 | Ancestry | — | innate spells: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1004 | Aboleth Transmutation | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1005 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1006 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1007 | Janni Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Speak with Animals (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1008 | Rokoan Arts | 9 | Ancestry | — | innate spells: Speak with Animals (rank 2), Status (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1009 | Cautious Curiosity | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), Silence (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1010 | Rivethun Adept | 16 | Class | — | innate spells: Speak with Stones (rank 5), Spiritual Guardian (rank 5) | −0.23 ± 0.07 | −0.29 | −0.17 | 0.0 | hurts | the AI never used it |
| 1011 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.23 ± 0.07 | −0.46 | −0.01 | 0.0 | hurts | the AI never used it |
| 1012 | Dream Magic | 8 | Class | — | innate spells: Dream Message (rank 3), Sleep (rank 4) | −0.24 ± 0.07 | −0.46 | −0.02 | 0.0 | hurts | the AI never used it |
| 1013 | Lore Seeker | 8 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1014 | Rivethun Devotion | 8 | Class | — | innate spells: See the Unseen (rank 2), Spirit Link (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1015 | Salt Kissed | 8 | Class | — | innate spells: Air Bubble (rank 1), Water Breathing (rank 4) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1016 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.25 ± 0.05 | −0.34 | −0.16 | 0.3 | hurts |  |
| 1017 | Stonebound Magic | 6 | Class | — | innate spells: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.25 ± 0.05 | −0.46 | −0.05 | 0.2 | hurts |  |
| 1018 | Time Mage Dedication | 6 | Class | — | innate spells: Delay Consequence (rank 1), Time Sense (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1019 | Sound Mirror | 6 | Class | — | innate spells: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1020 | Simple Crystal Magic | 6 | Class | — | innate spells: Read Aura (rank 3), Sigil (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1021 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.27 ± 0.05 | −0.46 | −0.07 | 0.0 | hurts | the AI never used it |
| 1022 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.31 ± 0.08 | −0.35 | −0.27 | 0.9 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 4811 |
| a timer with no rules a fight counts | 262 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 130 |
| its requirement, which the PC doesn't meet | 67 |
| a teleport | 66 |
| an Effect with nothing a fight counts | 65 |
| nothing a fight uses | 55 |
| a reaction's Strike | 52 |
| a spell the feat casts | 31 |
| its text has no Strike of its user's | 29 |
| a roll whose results the simulator doesn't read | 29 |
| a reroll | 28 |
| a reaction to "passive" | 20 |
| a lasting area | 17 |
| a choice of ways the simulator doesn't play | 15 |
| a Focus or Mythic Point back | 8 |
| a passive's Strike | 7 |
| a companion's Strike | 5 |
| damage still naming the character's data | 5 |
| a roll twice | 5 |
| a reaction to "strike" | 4 |
| a passive's roll with no action to use it | 3 |
| a reaction to "aura" | 2 |
| a free's Strike | 2 |
| a reaction to "damaged" | 1 |
| its Effect has nothing a fight counts | 1 |
| a reaction to "own-strike" | 1 |
| a reaction to "hit-by" | 1 |
