# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-01: 521 feats and actions rated, 6426 not simulated, 2 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 498
- good: 12
- minor: 6
- strong: 2
- hurts: 2
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
| 28 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 29 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 30 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 31 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 32 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 33 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 34 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 35 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 36 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 37 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 38 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 39 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 40 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |

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
| 28 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 29 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 30 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 31 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 32 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 33 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 34 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.05 ± 0.05 | +0.05 | +0.06 | 1.0 | no clear effect |  |
| 35 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 36 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 37 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 38 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 39 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 40 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |
| 41 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 42 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.04 | +0.08 | +0.01 | 2.2 | no clear effect |  |
| 43 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.04 ± 0.04 | +0.07 | +0.01 | 5.7 | no clear effect |  |
| 44 | Desiccating Inhalation | 12 | Class | — | save | +0.04 ± 0.03 | +0.06 | +0.02 | 0.3 | no clear effect |  |
| 45 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.04 ± 0.03 | +0.03 | +0.04 | 3.2 | no clear effect |  |
| 46 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.01 | 1.6 | no clear effect |  |
| 47 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.02 | +0.01 | +0.06 | 0.1 | no clear effect |  |
| 48 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.03 ± 0.03 | −0.02 | +0.09 | 0.9 | no clear effect |  |
| 49 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.2 | no clear effect |  |
| 50 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.06 | +0.00 | 1.1 | no clear effect |  |
| 51 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 52 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.02 | +0.09 | −0.03 | 0.4 | no clear effect |  |
| 53 | Rock The Boat | 8 | Class | fighter | check | +0.03 ± 0.01 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 54 | Part the Veil | 0 | Action | — | check | +0.03 ± 0.03 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 55 | Enchanting Shot | 8 | Class | — | Strike activity | +0.03 ± 0.04 | +0.08 | −0.02 | 2.2 | no clear effect |  |
| 56 | Raise Symbol | 4 | Class | cleric | self effect | +0.03 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 57 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.11 | −0.05 | 1.8 | no clear effect |  |
| 58 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 59 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.03 | +0.04 | +0.01 | 0.2 | no clear effect |  |
| 60 | Reversing Charge | 8 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 61 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 62 | Propulsive Leap | 10 | Class | — | save | +0.02 ± 0.04 | +0.05 | −0.00 | 2.1 | no clear effect |  |
| 63 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.05 | −0.01 | 11.3 | no clear effect | with a one-handed weapon and a free hand |
| 64 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.02 ± 0.02 | +0.05 | −0.01 | 1.5 | no clear effect |  |
| 65 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.02 ± 0.02 | +0.01 | +0.03 | 0.2 | no clear effect |  |
| 66 | Feathered Flechettes | 6 | Class | — | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 67 | Breath of Hungry Death | 16 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.4 | no clear effect |  |
| 68 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.2 | no clear effect |  |
| 69 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | +0.02 ± 0.02 | +0.00 | +0.04 | 0.2 | no clear effect |  |
| 70 | To Me! | 18 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.03 | 0.5 | no clear effect |  |
| 71 | Confusing Commands | 16 | Class | commander | save | +0.02 ± 0.02 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 72 | Archer's Aim | 8 | Class | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 73 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.03 | −0.00 | 1.7 | no clear effect |  |
| 74 | Flower Street Infamy | 11 | Skill | — | check | +0.02 ± 0.02 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 75 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 76 | Repel Ambient Magic | 0 | Action | — | effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 77 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect |  |
| 78 | Call Hellfire | 8 | Class | — | save | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 79 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.02 | +0.05 | −0.02 | 0.6 | no clear effect |  |
| 80 | Rain of Bolts | 9 | Ancestry | — | save | +0.01 ± 0.02 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 81 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 82 | Demolish Defenses | 18 | Class | guardian | Strike activity | +0.01 ± 0.05 | +0.01 | +0.02 | 1.8 | no clear effect |  |
| 83 | Kraken's Call | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 84 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.01 ± 0.03 | +0.05 | −0.03 | 3.2 | no clear effect |  |
| 85 | Launch Fireworks | 0 | Action | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 86 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | +0.01 ± 0.05 | +0.02 | +0.00 | 1.3 | no clear effect |  |
| 87 | Trip | 0 | Action | — | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 88 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 89 | Emotional Surge | 10 | Class | psychic | effect | +0.01 ± 0.01 | +0.02 | −0.00 | 0.2 | no clear effect |  |
| 90 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | +0.01 ± 0.07 | +0.02 | −0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 91 | Feral Mending | 8 | Class | — | check | +0.01 ± 0.03 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 92 | Tenacious Stance | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 93 | Subjugation | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 94 | Draw From the Land | 10 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 95 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 2.1 | no clear effect |  |
| 96 | Quill Spray | 9 | Ancestry | — | save | +0.01 ± 0.03 | −0.04 | +0.06 | 0.1 | no clear effect |  |
| 97 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 98 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | +0.01 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect | with two weapons (longsword and shortsword) |
| 99 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 100 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 101 | Dragonet Breath | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 102 | Engine of Destruction | 18 | Class | inventor | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 103 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 104 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 105 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 106 | Tamper | 1 | Class | inventor | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 107 | Decree of War | 18 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 108 | Armored Courage | 4 | Class | guardian | effect | +0.00 ± 0.02 | −0.01 | +0.01 | 0.7 | no clear effect |  |
| 109 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.2 | no clear effect |  |
| 110 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 111 | Draconic Fury | 4 | Class | — | save | +0.00 ± 0.01 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 112 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 113 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 114 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 115 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 116 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 117 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 118 | Pit of Snakes | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 119 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 120 | Unleash the Blight | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 121 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 122 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 123 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 124 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 125 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 126 | Thunder Clap | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 127 | Flinging Blow | 16 | Class | monk | Strike activity | +0.00 ± 0.03 | −0.02 | +0.02 | 0.8 | no clear effect |  |
| 128 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 129 | Unstable Gearshift | 6 | Class | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 130 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 131 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 132 | Raise Slabs | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 133 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect | with a bow in hand |
| 134 | Glory on High | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 135 | Draconic Resilience | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 136 | Twin Parry | 4 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 137 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect |  |
| 138 | Channel Divine Spark | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 139 | Drain Vitality | 10 | Class | — | check | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 140 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 141 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | +0.00 ± 0.04 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 142 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 143 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.8 | no clear effect |  |
| 144 | Demon Slayer | 17 | Ancestry | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 145 | Courageous Onslaught | 16 | Class | bard | Strike activity | +0.00 ± 0.02 | +0.02 | −0.02 | 0.3 | no clear effect |  |
| 146 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 147 | Cobra Stance | 4 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 148 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 149 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 150 | Roar Mimicry | 12 | Class | — | save | +0.00 ± 0.02 | +0.02 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 151 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 152 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 153 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 154 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 155 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 156 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 157 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 158 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 159 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 160 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 161 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 162 | Lantern Strobe | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 164 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 165 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 168 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 169 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 170 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 171 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 174 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 175 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 176 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 179 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 180 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 182 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 183 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 184 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 186 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 188 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 189 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 190 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 191 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 192 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 193 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 195 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 196 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 197 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 198 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 199 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 200 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 201 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 203 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 204 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 205 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 206 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 207 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 208 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 210 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 211 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 212 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 213 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 214 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 215 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 216 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 217 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 218 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 219 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 220 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 221 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 222 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 223 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 224 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 226 | Vengeful Remnant | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 228 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 229 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 230 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 231 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 232 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 233 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 234 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 235 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 236 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 238 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 239 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 240 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 241 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 242 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 243 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 244 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 245 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 246 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 247 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 248 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 249 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 250 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 251 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 252 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 253 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 254 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 255 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 256 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 257 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 258 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 259 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 260 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 261 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 262 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 263 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 264 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 265 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 266 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 267 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 268 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 269 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 270 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 272 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 273 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 274 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 275 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 277 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 278 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 279 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 280 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 281 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 282 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 283 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 284 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 285 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 286 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 287 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 289 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 290 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 291 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 292 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 293 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 294 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 295 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 296 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 297 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 298 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 299 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 301 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 302 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 303 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 304 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 305 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 306 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 307 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 308 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 309 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 310 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 311 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 312 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 313 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 314 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 315 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 316 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 318 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 319 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 320 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 321 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 322 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 323 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 324 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 325 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 326 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 327 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 328 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 329 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 330 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 331 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 332 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 333 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 334 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 335 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 336 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 337 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 338 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 339 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 340 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 341 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 343 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 344 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 345 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 348 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 351 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 352 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 353 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Primadonna | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 356 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 357 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 359 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 361 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 362 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 364 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 365 | Psi Catastrophe | 12 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 366 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 367 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 368 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 371 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 374 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 375 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 376 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 378 | Asp Stance | 6 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 379 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 380 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 381 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 383 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 387 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 388 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 390 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 392 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 393 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 394 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 398 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 400 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 401 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 403 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 404 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 405 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 407 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 408 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 410 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 413 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 414 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 417 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 418 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 421 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 422 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 423 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 424 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 425 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 426 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 427 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 429 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 431 | Dominion Aura | 17 | Ancestry | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | I Will Return | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 433 | Death of Hope | 17 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Coordinated Charge | 12 | Class | — | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 435 | Spirit Guide Form | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 436 | Vital Shot | 0 | Action | gunslinger | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 437 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 439 | Flash of Omnipresence | 14 | Class | — | save | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 440 | Golden Body | 20 | Class | monk | fast-healing | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect |  |
| 441 | Putrefaction | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 442 | Trial by Skyfire | 10 | Class | oracle | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 443 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 444 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.00 ± 0.01 | −0.01 | +0.01 | 0.2 | no clear effect |  |
| 445 | Mind Shards | 6 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 446 | Diamond Soul | 12 | Class | monk | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 447 | Construct Dynamo | 12 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 448 | Absolve Sins | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 449 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 450 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.01 | 1.3 | no clear effect |  |
| 452 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.3 | no clear effect |  |
| 453 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 454 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.00 ± 0.02 | −0.00 | −0.01 | 1.7 | no clear effect |  |
| 455 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 456 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.3 | no clear effect |  |
| 458 | Blood Shield | 4 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Muckraking | 16 | Class | — | save | −0.01 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 460 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 461 | Bone Swarm | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 462 | Trample Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 463 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 464 | Freeze It! | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 465 | Frightening Indignation | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 466 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.01 ± 0.02 | +0.00 | −0.02 | 3.5 | no clear effect |  |
| 467 | Radiant Burst | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 468 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 469 | Flurry of Blows | 0 | Action | monk | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect |  |
| 470 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.01 ± 0.04 | −0.04 | +0.03 | 1.4 | no clear effect | with a bow in hand |
| 471 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 472 | Chastise | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 473 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 474 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 475 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 476 | No Scar but This | 0 | Action | — | check | −0.01 ± 0.01 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 477 | Storming Breath | 6 | Class | — | save | −0.01 ± 0.02 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 478 | Boarding Assault | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 479 | Break Free | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 480 | Defensive Advance | 1 | Class | champion | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 481 | Sudden Charge | 1 | Class | barbarian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 482 | Clobber | 16 | Class | guardian | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 483 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.02 | 3.0 | no clear effect | with two weapons (longsword and shortsword) |
| 484 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 485 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.02 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 486 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | +0.08 | −0.10 | 0.7 | no clear effect |  |
| 487 | Form a Flock | 13 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 488 | Wing Buffet | 9 | Ancestry | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 489 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | −0.01 ± 0.02 | −0.02 | −0.00 | 0.0 | no clear effect |  |
| 490 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 491 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.02 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 492 | Impaling Thrust | 14 | Class | barbarian | Strike activity | −0.01 ± 0.06 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 493 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 494 | Brutish Shove | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Pack Attack | 6 | Class | — | strike-extra | −0.01 ± 0.04 | −0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 497 | Might of the Realm | 14 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 498 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.01 ± 0.05 | −0.13 | +0.10 | 2.0 | no clear effect |  |
| 499 | Cantorian Rejuvenation | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 500 | Tap Vitality | 6 | Class | — | check | −0.02 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 501 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.02 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 502 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.02 ± 0.02 | +0.00 | −0.04 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 503 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 504 | Scout's Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 505 | Ravenous Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 506 | Interpose | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 507 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.03 ± 0.02 | −0.03 | −0.02 | 0.7 | no clear effect |  |
| 508 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.07 | 2.0 | no clear effect |  |
| 509 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.03 ± 0.06 | +0.00 | −0.07 | 1.0 | no clear effect |  |
| 510 | Repair Module | 9 | Ancestry | — | effect | −0.03 ± 0.04 | −0.10 | +0.04 | 0.5 | no clear effect |  |
| 511 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.03 | −0.01 | −0.05 | 0.8 | no clear effect |  |
| 512 | Herald's Strike | 20 | Class | — | save | −0.04 ± 0.05 | −0.04 | −0.03 | 0.8 | no clear effect |  |
| 513 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.04 | −0.05 | −0.03 | 1.0 | no clear effect |  |
| 514 | Crimson Shroud | 6 | Class | — | effect | −0.05 ± 0.03 | −0.09 | −0.00 | 0.3 | no clear effect |  |
| 515 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.03 | +0.00 | −0.10 | 0.6 | hurts |  |
| 516 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 517 | Doom of Sailors | 17 | Ancestry | — | save | −0.08 ± 0.04 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 518 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 2.3 | no clear effect |  |
| 519 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.05 | −0.23 | 0.9 | no clear effect |  |
| 520 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 521 | Tidal Shield | 17 | Ancestry | — | effect | −0.10 ± 0.04 | −0.13 | −0.07 | 2.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 5304 |
| a timer with no rules a fight counts | 263 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 130 |
| a teleport | 66 |
| an Effect with nothing a fight counts | 66 |
| its requirement, which the PC doesn't meet | 63 |
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
