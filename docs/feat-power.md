# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-01: 689 feats and actions rated, 6258 not simulated, 2 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 662
- good: 12
- minor: 7
- hurts: 5
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
| 16 | Call Worm Spirit | 10 | Class | — | save | +0.09 ± 0.04 | +0.08 | +0.10 | 1.0 | minor |  |
| 17 | Psi Burst | 2 | Class | psychic | save | +0.09 ± 0.04 | +0.16 | +0.01 | 1.9 | minor |  |
| 18 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 7.3 | no clear effect |  |
| 19 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 20 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 21 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 22 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.17 | −0.02 | 1.9 | no clear effect |  |
| 23 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 24 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.07 ± 0.03 | +0.10 | +0.04 | 1.3 | minor | with two weapons (longsword and shortsword) |
| 25 | Debilitating Dichotomy | 8 | Class | oracle | save | +0.06 ± 0.05 | +0.11 | +0.02 | 0.9 | no clear effect |  |
| 26 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 27 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.02 | 0.5 | no clear effect |  |
| 28 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 29 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 30 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 31 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 32 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 33 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 34 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 35 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 36 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 37 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 38 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 39 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 40 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |

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
| 16 | Call Worm Spirit | 10 | Class | — | save | +0.09 ± 0.04 | +0.08 | +0.10 | 1.0 | minor |  |
| 17 | Psi Burst | 2 | Class | psychic | save | +0.09 ± 0.04 | +0.16 | +0.01 | 1.9 | minor |  |
| 18 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 7.3 | no clear effect |  |
| 19 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 20 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 21 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 22 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.17 | −0.02 | 1.9 | no clear effect |  |
| 23 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 24 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.07 ± 0.03 | +0.10 | +0.04 | 1.3 | minor | with two weapons (longsword and shortsword) |
| 25 | Debilitating Dichotomy | 8 | Class | oracle | save | +0.06 ± 0.05 | +0.11 | +0.02 | 0.9 | no clear effect |  |
| 26 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 27 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.02 | 0.5 | no clear effect |  |
| 28 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 29 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 30 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 31 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 32 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 33 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 34 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 35 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 36 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 37 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 38 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 39 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 40 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 41 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |
| 42 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 43 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.04 | +0.08 | +0.01 | 2.2 | no clear effect |  |
| 44 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.04 ± 0.04 | +0.07 | +0.01 | 5.7 | no clear effect |  |
| 45 | Desiccating Inhalation | 12 | Class | — | save | +0.04 ± 0.03 | +0.06 | +0.02 | 0.3 | no clear effect |  |
| 46 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 47 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.04 ± 0.03 | +0.03 | +0.04 | 3.2 | no clear effect |  |
| 48 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.01 | 1.6 | no clear effect |  |
| 49 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.02 | +0.01 | +0.06 | 0.1 | no clear effect |  |
| 50 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 51 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.03 ± 0.03 | −0.02 | +0.09 | 0.9 | no clear effect |  |
| 52 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.2 | no clear effect |  |
| 53 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.06 | +0.00 | 1.1 | no clear effect |  |
| 54 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 55 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.02 | +0.09 | −0.03 | 0.4 | no clear effect |  |
| 56 | Rock The Boat | 8 | Class | fighter | check | +0.03 ± 0.01 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 57 | Part the Veil | 0 | Action | — | check | +0.03 ± 0.03 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 58 | Enchanting Shot | 8 | Class | — | Strike activity | +0.03 ± 0.04 | +0.08 | −0.02 | 2.2 | no clear effect |  |
| 59 | Raise Symbol | 4 | Class | cleric | self effect | +0.03 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 60 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.11 | −0.05 | 1.8 | no clear effect |  |
| 61 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 62 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 63 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.03 | +0.04 | +0.01 | 0.2 | no clear effect |  |
| 64 | Reversing Charge | 8 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 65 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 66 | Propulsive Leap | 10 | Class | — | save | +0.02 ± 0.04 | +0.05 | −0.00 | 2.1 | no clear effect |  |
| 67 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.05 | −0.01 | 11.3 | no clear effect | with a one-handed weapon and a free hand |
| 68 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 69 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 70 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 71 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 72 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 73 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 74 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.02 ± 0.02 | +0.05 | −0.01 | 1.5 | no clear effect |  |
| 75 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 76 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | +0.02 ± 0.04 | +0.14 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 77 | Feathered Flechettes | 6 | Class | — | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 78 | Breath of Hungry Death | 16 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.4 | no clear effect |  |
| 79 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.2 | no clear effect |  |
| 80 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | +0.02 ± 0.02 | +0.00 | +0.04 | 0.2 | no clear effect |  |
| 81 | To Me! | 18 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.03 | 0.5 | no clear effect |  |
| 82 | Confusing Commands | 16 | Class | commander | save | +0.02 ± 0.02 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 83 | Archer's Aim | 8 | Class | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 84 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | +0.02 ± 0.01 | +0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 85 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.03 | −0.00 | 1.7 | no clear effect |  |
| 86 | Flower Street Infamy | 11 | Skill | — | check | +0.02 ± 0.02 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 87 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 88 | Repel Ambient Magic | 0 | Action | — | effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 89 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 90 | Call Hellfire | 8 | Class | — | save | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 91 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.02 | +0.05 | −0.02 | 0.6 | no clear effect |  |
| 92 | Rain of Bolts | 9 | Ancestry | — | save | +0.01 ± 0.02 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 93 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 94 | Demolish Defenses | 18 | Class | guardian | Strike activity | +0.01 ± 0.05 | +0.01 | +0.02 | 1.8 | no clear effect |  |
| 95 | Kraken's Call | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 96 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.01 ± 0.03 | +0.05 | −0.03 | 3.2 | no clear effect |  |
| 97 | Launch Fireworks | 0 | Action | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 98 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | +0.01 ± 0.05 | +0.02 | +0.00 | 1.3 | no clear effect |  |
| 99 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 100 | Trip | 0 | Action | — | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 101 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 102 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 103 | Emotional Surge | 10 | Class | psychic | effect | +0.01 ± 0.01 | +0.02 | −0.00 | 0.2 | no clear effect |  |
| 104 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | +0.01 ± 0.07 | +0.02 | −0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 105 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 106 | Feral Mending | 8 | Class | — | check | +0.01 ± 0.03 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 107 | Tenacious Stance | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 108 | Subjugation | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 109 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 110 | Draw From the Land | 10 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 111 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 2.1 | no clear effect |  |
| 112 | Quill Spray | 9 | Ancestry | — | save | +0.01 ± 0.03 | −0.04 | +0.06 | 0.1 | no clear effect |  |
| 113 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 114 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 115 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 116 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 117 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 118 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 119 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | +0.01 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect | with two weapons (longsword and shortsword) |
| 120 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 121 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 122 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 123 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 124 | Dragonet Breath | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 125 | Engine of Destruction | 18 | Class | inventor | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 126 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 127 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 128 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 129 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 130 | Tamper | 1 | Class | inventor | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 131 | Decree of War | 18 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 132 | Armored Courage | 4 | Class | guardian | effect | +0.00 ± 0.02 | −0.01 | +0.01 | 0.7 | no clear effect |  |
| 133 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.2 | no clear effect |  |
| 134 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 135 | Draconic Fury | 4 | Class | — | save | +0.00 ± 0.01 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 136 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 137 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 138 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 139 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 140 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 141 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 142 | Pit of Snakes | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 143 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 144 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 145 | Unleash the Blight | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 146 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 147 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 148 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 149 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 150 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 151 | Thunder Clap | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 152 | Flinging Blow | 16 | Class | monk | Strike activity | +0.00 ± 0.03 | −0.02 | +0.02 | 0.8 | no clear effect |  |
| 153 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 154 | Unstable Gearshift | 6 | Class | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 155 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 156 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 157 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 158 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 159 | Raise Slabs | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 160 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect | with a bow in hand |
| 161 | Glory on High | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 162 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 164 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 165 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 168 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 169 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 170 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 171 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Draconic Resilience | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Twin Parry | 4 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 174 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 175 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect |  |
| 176 | Channel Divine Spark | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Drain Vitality | 10 | Class | — | check | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 179 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | +0.00 ± 0.04 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 180 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 182 | Demon Slayer | 17 | Ancestry | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 183 | Courageous Onslaught | 16 | Class | bard | Strike activity | +0.00 ± 0.02 | +0.02 | −0.02 | 0.3 | no clear effect |  |
| 184 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Cobra Stance | 4 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 186 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 188 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 189 | Roar Mimicry | 12 | Class | — | save | +0.00 ± 0.02 | +0.02 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 190 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 191 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 192 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 193 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 195 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 196 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 197 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 198 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 199 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 200 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 201 | Lantern Strobe | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 203 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 204 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 205 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 206 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 207 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 208 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 210 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 211 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 212 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 213 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 214 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 215 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 216 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 217 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 218 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 219 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 220 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 222 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 223 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 224 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 226 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 228 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 229 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 230 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 231 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 232 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 233 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 234 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 235 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 236 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 238 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 239 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 240 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 241 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 242 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 243 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 244 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 245 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 246 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 247 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 248 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 249 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 250 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 251 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 252 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 253 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 254 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 255 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 256 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 257 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 258 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 259 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 260 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 261 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 262 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 263 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 265 | Vengeful Remnant | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 266 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 268 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 272 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 273 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 274 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 275 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 277 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 278 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 279 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 280 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 281 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 282 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 283 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 284 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 285 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 286 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 287 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 289 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 290 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 291 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 292 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 293 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 294 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 295 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 296 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 297 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 298 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 299 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 301 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 302 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 303 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 304 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 305 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 306 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 307 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 308 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 309 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 310 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 311 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 312 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 313 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 314 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 315 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 316 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 318 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 319 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 320 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 321 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 322 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 323 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 324 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 325 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 326 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 327 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 328 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 329 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 330 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 331 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 332 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 333 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 334 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 335 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 336 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 337 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 341 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 342 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 343 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 344 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 345 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 347 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 348 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 350 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 351 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 352 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 353 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 354 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 357 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 358 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 360 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 361 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 362 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 364 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 365 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 366 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 367 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 368 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 372 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 373 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 375 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 377 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 378 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 379 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 380 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 382 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 384 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 387 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 390 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 392 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 393 | Primadonna | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 394 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 395 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 398 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 400 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 401 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 403 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Psi Catastrophe | 12 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 405 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 406 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 407 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 409 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 410 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 413 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 414 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 415 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 417 | Asp Stance | 6 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 418 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 419 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 420 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 421 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 422 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 424 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 426 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 427 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 429 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
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
| 453 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 456 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 460 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 462 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 463 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 464 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 465 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 466 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 467 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 468 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 470 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 475 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 492 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 494 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 495 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Lingering Chill | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 509 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 510 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 512 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Fey Skin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 517 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 521 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 523 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 530 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 532 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 534 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 537 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 548 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 553 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 556 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 558 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 561 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 572 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 575 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 576 | Dominion Aura | 17 | Ancestry | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | I Will Return | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 578 | Death of Hope | 17 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Coordinated Charge | 12 | Class | — | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 581 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 582 | Spirit Guide Form | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Vital Shot | 0 | Action | gunslinger | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 584 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 586 | Flash of Omnipresence | 14 | Class | — | save | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 587 | Golden Body | 20 | Class | monk | fast-healing | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect |  |
| 588 | Putrefaction | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 590 | Trial by Skyfire | 10 | Class | oracle | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 591 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.00 ± 0.01 | −0.01 | +0.01 | 0.2 | no clear effect |  |
| 593 | Mind Shards | 6 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 594 | Diamond Soul | 12 | Class | monk | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 595 | Construct Dynamo | 12 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 596 | Absolve Sins | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 597 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 598 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.01 | 1.3 | no clear effect |  |
| 600 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.3 | no clear effect |  |
| 601 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 602 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.00 ± 0.02 | −0.00 | −0.01 | 1.7 | no clear effect |  |
| 603 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 604 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.3 | no clear effect |  |
| 606 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.01 ± 0.02 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 607 | Blood Shield | 4 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Muckraking | 16 | Class | — | save | −0.01 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 609 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 610 | Bone Swarm | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 611 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 612 | Trample Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 613 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 614 | Freeze It! | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 615 | Frightening Indignation | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 616 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.01 ± 0.02 | +0.00 | −0.02 | 3.5 | no clear effect |  |
| 617 | Radiant Burst | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 618 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 619 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 620 | Flurry of Blows | 0 | Action | monk | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect |  |
| 621 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect | with a bow in hand |
| 622 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 623 | Chastise | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 624 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 625 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 626 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 627 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 628 | No Scar but This | 0 | Action | — | check | −0.01 ± 0.01 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 629 | Storming Breath | 6 | Class | — | save | −0.01 ± 0.02 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 630 | Boarding Assault | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 631 | Break Free | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 632 | Defensive Advance | 1 | Class | champion | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 633 | Sudden Charge | 1 | Class | barbarian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 634 | Clobber | 16 | Class | guardian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 635 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.02 | 3.0 | no clear effect | with two weapons (longsword and shortsword) |
| 636 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 637 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.02 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 638 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | +0.08 | −0.10 | 0.7 | no clear effect |  |
| 639 | Form a Flock | 13 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 640 | Wing Buffet | 9 | Ancestry | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 641 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 642 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | −0.01 ± 0.02 | −0.02 | −0.00 | 0.0 | no clear effect |  |
| 643 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 644 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.02 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 645 | Impaling Thrust | 14 | Class | barbarian | Strike activity | −0.01 ± 0.06 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 646 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 647 | Brutish Shove | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 648 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Pack Attack | 6 | Class | — | strike-extra | −0.01 ± 0.04 | −0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 650 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 651 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 652 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 653 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 654 | Might of the Realm | 14 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 655 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.01 ± 0.05 | −0.13 | +0.10 | 2.0 | no clear effect |  |
| 656 | Cantorian Rejuvenation | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 657 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 658 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 659 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 660 | Tap Vitality | 6 | Class | — | check | −0.02 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 661 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.02 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 662 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.02 ± 0.02 | +0.00 | −0.04 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 663 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 664 | Scout's Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 665 | Ravenous Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 666 | Interpose | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 667 | Jelly Body | 6 | Class | — | PF2e rules (always on) | −0.02 ± 0.02 | −0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.03 ± 0.02 | −0.03 | −0.02 | 0.7 | no clear effect |  |
| 669 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.07 | 2.0 | no clear effect |  |
| 670 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.03 ± 0.06 | +0.00 | −0.07 | 1.0 | no clear effect |  |
| 671 | Repair Module | 9 | Ancestry | — | effect | −0.03 ± 0.04 | −0.10 | +0.04 | 0.5 | no clear effect |  |
| 672 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.03 | −0.01 | −0.05 | 0.8 | no clear effect |  |
| 673 | Herald's Strike | 20 | Class | — | save | −0.04 ± 0.05 | −0.04 | −0.03 | 0.8 | no clear effect |  |
| 674 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 675 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.04 | −0.05 | −0.03 | 1.0 | no clear effect |  |
| 676 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 677 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 678 | Crimson Shroud | 6 | Class | — | effect | −0.05 ± 0.03 | −0.09 | −0.00 | 0.3 | no clear effect |  |
| 679 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.03 | +0.00 | −0.10 | 0.6 | hurts |  |
| 680 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.07 ± 0.03 | −0.03 | −0.11 | 0.0 | hurts | the AI never used it |
| 681 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | −0.07 ± 0.05 | −0.41 | +0.27 | 0.0 | no clear effect | the AI never used it |
| 682 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 683 | Doom of Sailors | 17 | Ancestry | — | save | −0.08 ± 0.04 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 684 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 2.3 | no clear effect |  |
| 685 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.05 | −0.23 | 0.9 | no clear effect |  |
| 686 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 687 | Tidal Shield | 17 | Ancestry | — | effect | −0.10 ± 0.04 | −0.13 | −0.07 | 2.0 | hurts |  |
| 688 | Halo | 1 | Ancestry | — | PF2e rules (always on) | −0.11 ± 0.05 | −0.01 | −0.21 | 0.0 | hurts | the AI never used it |
| 689 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 5131 |
| a timer with no rules a fight counts | 263 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 130 |
| its requirement, which the PC doesn't meet | 68 |
| a teleport | 66 |
| an Effect with nothing a fight counts | 66 |
| nothing a fight uses | 55 |
| a reaction's Strike | 52 |
| a spell the feat casts | 35 |
| its text has no Strike of its user's | 29 |
| a roll whose results the simulator doesn't read | 29 |
| a reroll | 28 |
| a reaction to "passive" | 22 |
| a lasting area | 17 |
| a choice of ways the simulator doesn't play | 15 |
| a Focus or Mythic Point back | 8 |
| a passive's Strike | 8 |
| a companion's Strike | 5 |
| damage still naming the character's data | 5 |
| a roll twice | 5 |
| a free's Strike | 4 |
| a reaction to "strike" | 4 |
| a passive's roll with no action to use it | 3 |
| a reaction to "aura" | 2 |
| a reaction to "hit-by" | 2 |
| a reaction to "damaged" | 1 |
| its Effect has nothing a fight counts | 1 |
| a reaction to "own-strike" | 1 |
