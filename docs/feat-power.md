# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-01: 526 feats and actions rated, 6422 not simulated, 1 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice. Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 487
- good: 16
- hurts: 12
- minor: 8
- very strong: 2
- strong: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.64 ± 0.05 | +1.18 | +0.10 | 2.7 | very strong |  |
| 2 | Goblin Jubilee | 0 | Action | — | save | +0.56 ± 0.05 | +0.20 | +0.93 | 0.3 | very strong |  |
| 3 | Scare to Death | 15 | Skill | — | save | +0.38 ± 0.05 | +0.62 | +0.13 | 1.8 | strong |  |
| 4 | Breath of Hungry Death | 16 | Class | — | save | +0.17 ± 0.04 | −0.00 | +0.34 | 0.9 | good |  |
| 5 | Wither Away | 16 | Class | — | save | +0.16 ± 0.05 | +0.09 | +0.22 | 0.9 | good |  |
| 6 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.15 ± 0.04 | +0.07 | +0.24 | 0.9 | good |  |
| 7 | Pierce the Eye | 16 | Class | — | save | +0.15 ± 0.06 | +0.26 | +0.04 | 0.9 | good |  |
| 8 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.05 | +0.23 | +0.06 | 0.8 | good |  |
| 9 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.13 ± 0.07 | +0.10 | +0.17 | 1.0 | good |  |
| 10 | To Me! | 18 | Class | — | Strike activity | +0.13 ± 0.04 | −0.01 | +0.27 | 2.8 | good |  |
| 11 | Rebirth in Living Stone | 18 | Class | kineticist | effect | +0.13 ± 0.07 | +0.13 | +0.12 | 2.0 | no clear effect |  |
| 12 | Glory on High | 18 | Class | — | save | +0.13 ± 0.05 | +0.02 | +0.24 | 0.3 | good |  |
| 13 | Fatal Shot | 18 | Class | — | Strike activity | +0.12 ± 0.04 | +0.23 | +0.01 | 0.6 | good |  |
| 14 | Olethros's Decree | 17 | Ancestry | — | save | +0.12 ± 0.05 | +0.19 | +0.04 | 1.0 | good |  |
| 15 | Kraken's Call | 17 | Ancestry | — | save | +0.11 ± 0.03 | +0.00 | +0.23 | 0.5 | good |  |
| 16 | Call Worm Spirit | 10 | Class | — | save | +0.11 ± 0.04 | −0.04 | +0.27 | 1.0 | good |  |
| 17 | Telling Blow | 18 | Class | — | Strike activity | +0.11 ± 0.06 | +0.22 | +0.00 | 6.5 | no clear effect |  |
| 18 | Sapping Symbol | 12 | Class | cleric | check | +0.10 ± 0.05 | +0.19 | +0.02 | 1.0 | good |  |
| 19 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.10 ± 0.05 | −0.06 | +0.26 | 1.3 | good |  |
| 20 | Reversing Charge | 8 | Class | — | Strike activity | +0.10 ± 0.02 | −0.00 | +0.20 | 2.3 | good |  |
| 21 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.10 ± 0.02 | −0.00 | +0.20 | 2.3 | good |  |
| 22 | Pit of Snakes | 13 | Ancestry | — | save | +0.10 ± 0.02 | +0.00 | +0.20 | 0.3 | minor |  |
| 23 | Doom of Sailors | 17 | Ancestry | — | save | +0.09 ± 0.05 | +0.05 | +0.14 | 1.0 | no clear effect |  |
| 24 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.09 ± 0.07 | +0.13 | +0.05 | 2.9 | no clear effect |  |
| 25 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.09 ± 0.07 | +0.22 | −0.05 | 2.7 | no clear effect | with two weapons (longsword and shortsword) |
| 26 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.09 ± 0.07 | +0.22 | −0.05 | 2.7 | no clear effect | with two weapons (longsword and shortsword) |
| 27 | Devastating Duelist | 18 | Class | — | Strike activity | +0.09 ± 0.04 | +0.14 | +0.03 | 3.4 | minor |  |
| 28 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.08 ± 0.06 | +0.13 | +0.03 | 2.8 | no clear effect |  |
| 29 | Decree of War | 18 | Class | — | Strike activity | +0.08 ± 0.04 | +0.00 | +0.16 | 0.3 | no clear effect |  |
| 30 | Weft and Warp | 16 | Class | — | Strike activity | +0.08 ± 0.04 | +0.00 | +0.15 | 0.5 | minor |  |
| 31 | Begin Stampede | 17 | Ancestry | — | Strike activity | +0.07 ± 0.03 | +0.00 | +0.14 | 0.7 | minor |  |
| 32 | Apocalyptic Visions | 18 | Class | — | save | +0.07 ± 0.07 | −0.01 | +0.15 | 1.0 | no clear effect |  |
| 33 | Turn to Mist | 10 | Class | — | PF2e's self Effect | +0.07 ± 0.05 | −0.05 | +0.18 | 1.0 | no clear effect |  |
| 34 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.06 ± 0.03 | +0.01 | +0.11 | 2.8 | minor |  |
| 35 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.03 | +0.12 | +0.00 | 0.6 | no clear effect |  |
| 36 | Whirlwind Stance | 10 | Class | — | effect | +0.06 ± 0.05 | −0.06 | +0.18 | 2.0 | no clear effect |  |
| 37 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.08 | +0.03 | 1.9 | minor | with a bow in hand |
| 38 | Gladiator's Roar | 12 | Class | — | save | +0.06 ± 0.05 | −0.02 | +0.13 | 0.9 | no clear effect |  |
| 39 | Crimson Breath | 12 | Class | — | save | +0.05 ± 0.05 | −0.01 | +0.12 | 0.9 | no clear effect |  |
| 40 | Absolve Sins | 16 | Class | — | save | +0.05 ± 0.04 | −0.08 | +0.19 | 1.1 | no clear effect |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|
| Demoralize | +0.01 ± 0.01 | 0.0 |
| Feint | +0.00 ± 0.00 | 0.0 |
| Trip | +0.00 ± 0.00 | 0.0 |
| Shove | +0.00 ± 0.00 | 0.0 |
| Disarm | +0.00 ± 0.00 | 0.0 |
| Escape | +0.00 ± 0.00 | 0.0 |
| Reposition | +0.00 ± 0.00 | 0.0 |
| Grapple | −0.00 ± 0.00 | 0.0 |

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.64 ± 0.05 | +1.18 | +0.10 | 2.7 | very strong |  |
| 2 | Goblin Jubilee | 0 | Action | — | save | +0.56 ± 0.05 | +0.20 | +0.93 | 0.3 | very strong |  |
| 3 | Scare to Death | 15 | Skill | — | save | +0.38 ± 0.05 | +0.62 | +0.13 | 1.8 | strong |  |
| 4 | Breath of Hungry Death | 16 | Class | — | save | +0.17 ± 0.04 | −0.00 | +0.34 | 0.9 | good |  |
| 5 | Wither Away | 16 | Class | — | save | +0.16 ± 0.05 | +0.09 | +0.22 | 0.9 | good |  |
| 6 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.15 ± 0.04 | +0.07 | +0.24 | 0.9 | good |  |
| 7 | Pierce the Eye | 16 | Class | — | save | +0.15 ± 0.06 | +0.26 | +0.04 | 0.9 | good |  |
| 8 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.05 | +0.23 | +0.06 | 0.8 | good |  |
| 9 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.13 ± 0.07 | +0.10 | +0.17 | 1.0 | good |  |
| 10 | To Me! | 18 | Class | — | Strike activity | +0.13 ± 0.04 | −0.01 | +0.27 | 2.8 | good |  |
| 11 | Rebirth in Living Stone | 18 | Class | kineticist | effect | +0.13 ± 0.07 | +0.13 | +0.12 | 2.0 | no clear effect |  |
| 12 | Glory on High | 18 | Class | — | save | +0.13 ± 0.05 | +0.02 | +0.24 | 0.3 | good |  |
| 13 | Fatal Shot | 18 | Class | — | Strike activity | +0.12 ± 0.04 | +0.23 | +0.01 | 0.6 | good |  |
| 14 | Olethros's Decree | 17 | Ancestry | — | save | +0.12 ± 0.05 | +0.19 | +0.04 | 1.0 | good |  |
| 15 | Kraken's Call | 17 | Ancestry | — | save | +0.11 ± 0.03 | +0.00 | +0.23 | 0.5 | good |  |
| 16 | Call Worm Spirit | 10 | Class | — | save | +0.11 ± 0.04 | −0.04 | +0.27 | 1.0 | good |  |
| 17 | Telling Blow | 18 | Class | — | Strike activity | +0.11 ± 0.06 | +0.22 | +0.00 | 6.5 | no clear effect |  |
| 18 | Sapping Symbol | 12 | Class | cleric | check | +0.10 ± 0.05 | +0.19 | +0.02 | 1.0 | good |  |
| 19 | Kneel Before the Rightful Heir | 16 | Class | — | save | +0.10 ± 0.05 | −0.06 | +0.26 | 1.3 | good |  |
| 20 | Reversing Charge | 8 | Class | — | Strike activity | +0.10 ± 0.02 | −0.00 | +0.20 | 2.3 | good |  |
| 21 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.10 ± 0.02 | −0.00 | +0.20 | 2.3 | good |  |
| 22 | Pit of Snakes | 13 | Ancestry | — | save | +0.10 ± 0.02 | +0.00 | +0.20 | 0.3 | minor |  |
| 23 | Doom of Sailors | 17 | Ancestry | — | save | +0.09 ± 0.05 | +0.05 | +0.14 | 1.0 | no clear effect |  |
| 24 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.09 ± 0.07 | +0.13 | +0.05 | 2.9 | no clear effect |  |
| 25 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.09 ± 0.07 | +0.22 | −0.05 | 2.7 | no clear effect | with two weapons (longsword and shortsword) |
| 26 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.09 ± 0.07 | +0.22 | −0.05 | 2.7 | no clear effect | with two weapons (longsword and shortsword) |
| 27 | Devastating Duelist | 18 | Class | — | Strike activity | +0.09 ± 0.04 | +0.14 | +0.03 | 3.4 | minor |  |
| 28 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.08 ± 0.06 | +0.13 | +0.03 | 2.8 | no clear effect |  |
| 29 | Decree of War | 18 | Class | — | Strike activity | +0.08 ± 0.04 | +0.00 | +0.16 | 0.3 | no clear effect |  |
| 30 | Weft and Warp | 16 | Class | — | Strike activity | +0.08 ± 0.04 | +0.00 | +0.15 | 0.5 | minor |  |
| 31 | Begin Stampede | 17 | Ancestry | — | Strike activity | +0.07 ± 0.03 | +0.00 | +0.14 | 0.7 | minor |  |
| 32 | Apocalyptic Visions | 18 | Class | — | save | +0.07 ± 0.07 | −0.01 | +0.15 | 1.0 | no clear effect |  |
| 33 | Turn to Mist | 10 | Class | — | PF2e's self Effect | +0.07 ± 0.05 | −0.05 | +0.18 | 1.0 | no clear effect |  |
| 34 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.06 ± 0.03 | +0.01 | +0.11 | 2.8 | minor |  |
| 35 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.03 | +0.12 | +0.00 | 0.6 | no clear effect |  |
| 36 | Whirlwind Stance | 10 | Class | — | effect | +0.06 ± 0.05 | −0.06 | +0.18 | 2.0 | no clear effect |  |
| 37 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.08 | +0.03 | 1.9 | minor | with a bow in hand |
| 38 | Gladiator's Roar | 12 | Class | — | save | +0.06 ± 0.05 | −0.02 | +0.13 | 0.9 | no clear effect |  |
| 39 | Crimson Breath | 12 | Class | — | save | +0.05 ± 0.05 | −0.01 | +0.12 | 0.9 | no clear effect |  |
| 40 | Absolve Sins | 16 | Class | — | save | +0.05 ± 0.04 | −0.08 | +0.19 | 1.1 | no clear effect |  |
| 41 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.01 | +0.10 | −0.00 | 1.2 | minor |  |
| 42 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.05 ± 0.02 | +0.10 | −0.00 | 1.1 | minor |  |
| 43 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.05 ± 0.02 | +0.00 | +0.10 | 2.8 | no clear effect |  |
| 44 | Scout's Charge | 4 | Class | — | Strike activity | +0.05 ± 0.01 | +0.00 | +0.09 | 1.3 | no clear effect |  |
| 45 | Ravenous Charge | 4 | Class | — | Strike activity | +0.05 ± 0.01 | +0.00 | +0.09 | 1.3 | no clear effect |  |
| 46 | Interpose | 4 | Class | — | Strike activity | +0.05 ± 0.01 | +0.00 | +0.09 | 1.3 | no clear effect |  |
| 47 | Roar Mimicry | 12 | Class | — | save | +0.05 ± 0.02 | +0.06 | +0.03 | 0.2 | no clear effect |  |
| 48 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.05 ± 0.02 | +0.05 | +0.05 | 0.6 | no clear effect |  |
| 49 | Coordinated Charge | 12 | Class | — | Strike activity | +0.04 ± 0.02 | +0.00 | +0.09 | 2.6 | no clear effect |  |
| 50 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | +0.04 ± 0.07 | −0.11 | +0.20 | 1.0 | no clear effect |  |
| 51 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | +0.04 ± 0.04 | +0.05 | +0.03 | 0.9 | no clear effect |  |
| 52 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | +0.04 ± 0.06 | +0.03 | +0.06 | 1.0 | no clear effect |  |
| 53 | Boarding Assault | 0 | Action | — | Strike activity | +0.04 ± 0.03 | +0.00 | +0.09 | 1.2 | no clear effect |  |
| 54 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.04 ± 0.03 | +0.00 | +0.09 | 1.2 | no clear effect |  |
| 55 | Break Free | 0 | Action | — | Strike activity | +0.04 ± 0.03 | −0.00 | +0.09 | 1.2 | no clear effect |  |
| 56 | Defensive Advance | 1 | Class | champion | Strike activity | +0.04 ± 0.03 | −0.00 | +0.09 | 1.2 | no clear effect |  |
| 57 | Do You Know Who I Am? | 12 | Class | — | check | +0.04 ± 0.06 | +0.04 | +0.04 | 1.0 | no clear effect |  |
| 58 | Calculate Threats | 0 | Action | psychic | effect | +0.04 ± 0.03 | −0.02 | +0.10 | 1.5 | no clear effect |  |
| 59 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.07 | +0.01 | +0.06 | 1.8 | no clear effect |  |
| 60 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.07 | +0.01 | 1.9 | no clear effect |  |
| 61 | Pack Attack | 6 | Class | — | strike-extra | +0.04 ± 0.02 | +0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 62 | Call Hellfire | 8 | Class | — | save | +0.03 ± 0.02 | +0.05 | +0.02 | 0.3 | no clear effect |  |
| 63 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.04 | +0.02 | 0.8 | no clear effect |  |
| 64 | Quill Spray | 9 | Ancestry | — | save | +0.03 ± 0.03 | +0.03 | +0.04 | 0.8 | no clear effect |  |
| 65 | Tectonic Stomp | 10 | Class | — | save | +0.03 ± 0.02 | +0.00 | +0.06 | 1.3 | no clear effect |  |
| 66 | Dragon Breath | 0 | Action | — | save | +0.03 ± 0.03 | −0.06 | +0.13 | 0.5 | no clear effect |  |
| 67 | Golden Body | 20 | Class | monk | fast-healing | +0.03 ± 0.02 | +0.00 | +0.06 | 0.0 | no clear effect |  |
| 68 | Demon Slayer | 17 | Ancestry | — | save | +0.03 ± 0.02 | +0.03 | +0.02 | 0.4 | no clear effect |  |
| 69 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.03 ± 0.02 | +0.04 | +0.01 | 3.8 | no clear effect |  |
| 70 | Spirit Guide Form | 14 | Class | — | effect | +0.03 ± 0.02 | −0.02 | +0.07 | 0.2 | no clear effect |  |
| 71 | Herald's Strike | 20 | Class | — | save | +0.03 ± 0.03 | +0.07 | −0.02 | 0.8 | no clear effect |  |
| 72 | Gang Up | 6 | Class | rogue | passive-rules | +0.02 ± 0.02 | −0.00 | +0.05 | 0.0 | no clear effect |  |
| 73 | Irresistible Bloom | 17 | Ancestry | — | save | +0.02 ± 0.01 | +0.00 | +0.05 | 0.1 | no clear effect |  |
| 74 | Rain of Bolts | 9 | Ancestry | — | save | +0.02 ± 0.03 | −0.01 | +0.05 | 0.8 | no clear effect |  |
| 75 | Acknowledge Fan | 12 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.2 | no clear effect |  |
| 76 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.02 ± 0.01 | +0.01 | +0.04 | 0.0 | no clear effect |  |
| 77 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 1.8 | no clear effect |  |
| 78 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.03 | +0.03 | +0.01 | 1.6 | no clear effect |  |
| 79 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.02 ± 0.03 | +0.03 | +0.01 | 1.6 | no clear effect | with a bow in hand |
| 80 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.04 | −0.00 | 0.3 | no clear effect |  |
| 81 | Conjure Hell | 12 | Class | — | save | +0.02 ± 0.05 | −0.02 | +0.05 | 0.8 | no clear effect |  |
| 82 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.02 ± 0.06 | +0.04 | +0.00 | 2.6 | no clear effect |  |
| 83 | Death Drone | 0 | Action | — | save | +0.02 ± 0.02 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 84 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.01 | +0.02 | 0.6 | no clear effect |  |
| 85 | Petrifying Gaze Mimicry | 10 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.03 | 0.3 | no clear effect |  |
| 86 | Looming Gait | 5 | Ancestry | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.03 | 1.4 | no clear effect |  |
| 87 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | +0.02 ± 0.04 | +0.03 | −0.00 | 0.8 | no clear effect |  |
| 88 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 1.5 | no clear effect |  |
| 89 | Draw From the Land | 10 | Class | — | check | +0.02 ± 0.01 | +0.02 | +0.01 | 0.3 | no clear effect |  |
| 90 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.8 | no clear effect |  |
| 91 | Intimidating Strike | 2 | Class | barbarian | Strike activity | +0.02 ± 0.01 | +0.02 | +0.01 | 0.3 | no clear effect |  |
| 92 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.01 ± 0.05 | +0.04 | −0.01 | 2.6 | no clear effect | with a bow in hand |
| 93 | Chastise | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 94 | Demolish Defenses | 18 | Class | guardian | Strike activity | +0.01 ± 0.07 | +0.03 | −0.00 | 2.2 | no clear effect |  |
| 95 | Rock The Boat | 8 | Class | fighter | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.1 | no clear effect |  |
| 96 | Freeze It! | 9 | Ancestry | — | check | +0.01 ± 0.02 | +0.03 | −0.01 | 0.2 | no clear effect |  |
| 97 | Peony's Flourish | 14 | Class | — | check | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 98 | Majestic Presence | 13 | Ancestry | — | save | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 99 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.04 | −0.02 | 0.3 | no clear effect |  |
| 100 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | +0.01 ± 0.06 | −0.04 | +0.06 | 1.0 | no clear effect |  |
| 101 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.01 | +0.02 | −0.00 | 0.2 | no clear effect |  |
| 102 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 2.8 | no clear effect |  |
| 103 | Unleash the Blight | 10 | Class | — | save | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 104 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | −0.01 | +0.03 | 6.5 | no clear effect | with a one-handed weapon and a free hand |
| 105 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.03 | +0.03 | −0.01 | 0.1 | no clear effect |  |
| 106 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.03 | −0.01 | 2.3 | no clear effect |  |
| 107 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.01 ± 0.02 | −0.07 | +0.09 | 0.7 | no clear effect |  |
| 108 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.00 | +0.02 | +0.00 | 0.5 | no clear effect |  |
| 109 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 110 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.01 ± 0.04 | −0.06 | +0.07 | 1.7 | no clear effect |  |
| 111 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.06 | +0.06 | −0.05 | 0.5 | no clear effect |  |
| 112 | Dominion Aura | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 113 | Muckraking | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 114 | No Scar but This | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.3 | no clear effect |  |
| 115 | Raise Slabs | 0 | Action | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 116 | Feral Mending | 8 | Class | — | check | +0.00 ± 0.02 | −0.01 | +0.02 | 0.3 | no clear effect |  |
| 117 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 118 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.04 | −0.02 | +0.03 | 0.7 | no clear effect |  |
| 119 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 120 | Diamond Soul | 12 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect |  |
| 121 | Construct Dynamo | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect |  |
| 122 | Siphon Life | 10 | Class | — | Strike activity | +0.00 ± 0.03 | −0.00 | +0.01 | 1.0 | no clear effect |  |
| 123 | Clobber | 16 | Class | guardian | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 124 | Wild Dance | 12 | Class | — | save | +0.00 ± 0.02 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 125 | Trample Mimicry | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 126 | Propulsive Leap | 10 | Class | — | save | +0.00 ± 0.03 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 127 | Cry of Rebellion | 16 | Class | — | save | +0.00 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 128 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 129 | Form a Flock | 13 | Ancestry | — | effect | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 130 | I Will Return | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 131 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 132 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 133 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 134 | Tamper | 1 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 135 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.1 | no clear effect |  |
| 136 | Cantorian Rejuvenation | 9 | Ancestry | — | check | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 137 | Called Shot | 10 | Class | gunslinger | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 138 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 139 | Head Stomp | 4 | Class | rogue | Strike activity | +0.00 ± 0.04 | −0.02 | +0.03 | 5.2 | no clear effect |  |
| 140 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 141 | Trip | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 142 | Frightening Indignation | 16 | Class | — | save | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 143 | Desiccating Inhalation | 12 | Class | — | save | +0.00 ± 0.03 | +0.00 | −0.00 | 0.8 | no clear effect |  |
| 144 | Radiant Burst | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 145 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 146 | Bone Swarm | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 147 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 148 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 149 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 150 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 151 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 152 | Turn Aside Ambient Magic | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 153 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 154 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 155 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 156 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 157 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 158 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 159 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 160 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 161 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 162 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 164 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 165 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 168 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 169 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 170 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 171 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 174 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 175 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 176 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 179 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 180 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 182 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 183 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 184 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 186 | Launch Fireworks | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 188 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 189 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 190 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 191 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 192 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 193 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 195 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 196 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 197 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 198 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 199 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 200 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 201 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 203 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 204 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 205 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 206 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 207 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 208 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 210 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 211 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 212 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 213 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 214 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 215 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 216 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 217 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 218 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 219 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 220 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 222 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 223 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 224 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 226 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 228 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 229 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 230 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 231 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 232 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 233 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 234 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 235 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 236 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 238 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 239 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 240 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 241 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 242 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 243 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 244 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 245 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 246 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 247 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 248 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 249 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 250 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 251 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 252 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 253 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 254 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 255 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 256 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 257 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 258 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 259 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 260 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 261 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 262 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 263 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 264 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 265 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 266 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 267 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 268 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 269 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 271 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 272 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 273 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 274 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 275 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 277 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 278 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 279 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 280 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 281 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 282 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 283 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 284 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 285 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 286 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 287 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 289 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 290 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 291 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 292 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 293 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 294 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 295 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 296 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 297 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 298 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 299 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 301 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 302 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 303 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 304 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 305 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 306 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 307 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 308 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 309 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 310 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 311 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 312 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 313 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 314 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 315 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 316 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 318 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 319 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 320 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 321 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 322 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 323 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 324 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 325 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 326 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 327 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 328 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 329 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 330 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 331 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 332 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 333 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 334 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 335 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 337 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 338 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 341 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 343 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 344 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 345 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 348 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 349 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 351 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 352 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 353 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 355 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 356 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 357 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 360 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 361 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 362 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 363 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 365 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 366 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 367 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 368 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 371 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 372 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 375 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 378 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 379 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 380 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 382 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 387 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 389 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 390 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 392 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 393 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 394 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 396 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 397 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 399 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 400 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 401 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 403 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 405 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 407 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 410 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 411 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 413 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 414 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 415 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 416 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 417 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 418 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 419 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 421 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect |  |
| 422 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Spore Cloud | 9 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 424 | Perfume Cloud | 9 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 426 | Brutish Shove | 2 | Class | fighter | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 427 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 429 | Wing Buffet | 9 | Ancestry | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 430 | Demoralize | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.7 | no clear effect |  |
| 431 | Whirling Knockdown | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Tenacious Stance | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.1 | no clear effect |  |
| 434 | Pummeling Whirlpool | 13 | Ancestry | — | save | −0.00 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 435 | Healing Nexus | 8 | Class | — | healing | −0.00 ± 0.02 | −0.02 | +0.02 | 0.3 | no clear effect |  |
| 436 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.00 ± 0.01 | −0.00 | −0.00 | 1.4 | no clear effect | with two weapons (longsword and shortsword) |
| 437 | Feign Innocence | 12 | Class | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 439 | Vengeful Remnant | 14 | Class | — | effect | −0.00 ± 0.02 | −0.02 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 440 | Might of the Realm | 14 | Class | — | Strike activity | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 441 | Burning Demand | 12 | Class | kineticist | save | −0.00 ± 0.01 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 442 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.00 ± 0.01 | −0.00 | −0.00 | 0.1 | no clear effect |  |
| 443 | Channel Divine Spark | 14 | Class | — | check | −0.00 ± 0.02 | −0.02 | +0.01 | 0.1 | no clear effect |  |
| 444 | Confusing Commands | 16 | Class | commander | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 445 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | −0.00 | 1.1 | no clear effect |  |
| 446 | Crimson Shroud | 6 | Class | — | effect | −0.00 ± 0.02 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 447 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.00 ± 0.07 | −0.15 | +0.14 | 1.0 | no clear effect |  |
| 449 | Sky and Heaven Stance | 6 | Class | — | stance | −0.00 ± 0.02 | +0.00 | −0.01 | 0.7 | no clear effect |  |
| 450 | Tap Vitality | 6 | Class | — | check | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 451 | Vessel's Form | 16 | Class | — | check | −0.01 ± 0.02 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 452 | Flower Street Infamy | 11 | Skill | — | check | −0.01 ± 0.03 | −0.04 | +0.03 | 0.8 | no clear effect |  |
| 453 | Part the Veil | 0 | Action | — | check | −0.01 ± 0.04 | −0.02 | +0.01 | 0.7 | no clear effect |  |
| 454 | Raise Symbol | 4 | Class | cleric | self effect | −0.01 ± 0.01 | −0.02 | +0.00 | 0.3 | no clear effect |  |
| 455 | Death of Hope | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 456 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.03 | −0.05 | +0.03 | 0.8 | no clear effect |  |
| 457 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.01 ± 0.03 | −0.04 | +0.02 | 0.3 | no clear effect |  |
| 458 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 459 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.02 | 2.8 | no clear effect | with two weapons (longsword and shortsword) |
| 460 | Subjugation | 16 | Class | — | save | −0.01 ± 0.04 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 461 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 462 | Decree of Execution | 18 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 463 | Psi Catastrophe | 12 | Class | psychic | save | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 464 | Asp Stance | 6 | Class | monk | stance | −0.01 ± 0.02 | −0.04 | +0.01 | 0.5 | no clear effect |  |
| 465 | Feathered Flechettes | 6 | Class | — | save | −0.01 ± 0.01 | −0.03 | +0.01 | 0.2 | no clear effect |  |
| 466 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.2 | no clear effect |  |
| 467 | Paralyzing Slash | 8 | Class | — | Strike activity | −0.01 ± 0.03 | −0.03 | −0.00 | 4.1 | no clear effect |  |
| 468 | Bristle | 5 | Ancestry | — | effect | −0.01 ± 0.02 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 469 | Titan Swing | 2 | Class | — | Strike activity | −0.01 ± 0.03 | −0.02 | −0.01 | 2.8 | no clear effect |  |
| 470 | Flinging Blow | 16 | Class | monk | Strike activity | −0.01 ± 0.02 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 471 | Swirl Crimson Shroud | 0 | Action | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.2 | no clear effect |  |
| 472 | Hydraulic Deflection | 1 | Ancestry | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 473 | Ceremony of Protection | 1 | Ancestry | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 474 | Emotional Surge | 10 | Class | psychic | effect | −0.02 ± 0.01 | −0.03 | −0.00 | 0.3 | no clear effect |  |
| 475 | Primadonna | 12 | Class | — | check | −0.02 ± 0.01 | +0.00 | −0.03 | 0.1 | no clear effect |  |
| 476 | Elemental Assault | 1 | Ancestry | — | effect | −0.02 ± 0.02 | −0.02 | −0.01 | 1.0 | no clear effect |  |
| 477 | Twin Takedown | 1 | Class | ranger | 2 Strikes | −0.02 ± 0.04 | +0.02 | −0.05 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 478 | Promise of Pain | 10 | Class | — | save | −0.02 ± 0.05 | −0.14 | +0.10 | 1.0 | no clear effect |  |
| 479 | Cobra Stance | 4 | Class | monk | stance | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 480 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.02 ± 0.03 | −0.04 | +0.00 | 0.8 | no clear effect |  |
| 481 | Draconic Resilience | 4 | Class | — | effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.2 | no clear effect |  |
| 482 | Blood Shield | 4 | Class | — | self effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.1 | no clear effect |  |
| 483 | Twin Parry | 4 | Class | fighter | effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.1 | no clear effect |  |
| 484 | Armored Courage | 4 | Class | guardian | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 0.5 | no clear effect |  |
| 485 | Lantern Strobe | 0 | Action | — | save | −0.02 ± 0.01 | −0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Putrefaction | 14 | Class | — | save | −0.02 ± 0.01 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 487 | Hunter's Aim | 2 | Class | ranger | Strike activity | −0.02 ± 0.01 | −0.03 | −0.01 | 0.5 | no clear effect |  |
| 488 | Dragonet Breath | 1 | Ancestry | — | save | −0.02 ± 0.03 | −0.04 | −0.01 | 0.1 | no clear effect |  |
| 489 | Trial by Skyfire | 10 | Class | oracle | save | −0.03 ± 0.02 | −0.05 | −0.00 | 0.3 | no clear effect |  |
| 490 | Enter Spirit Trance | 0 | Action | — | effect | −0.03 ± 0.01 | −0.06 | +0.00 | 0.3 | no clear effect |  |
| 491 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.03 ± 0.02 | −0.04 | −0.02 | 0.3 | no clear effect |  |
| 492 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.03 ± 0.01 | −0.06 | +0.00 | 0.2 | no clear effect |  |
| 493 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.03 ± 0.03 | −0.08 | +0.03 | 1.0 | no clear effect |  |
| 494 | Stoked Flame Stance | 1 | Class | monk | stance | −0.03 ± 0.01 | −0.06 | −0.00 | 0.2 | no clear effect |  |
| 495 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | −0.03 ± 0.05 | −0.07 | +0.01 | 1.0 | no clear effect |  |
| 496 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.03 ± 0.06 | −0.10 | +0.03 | 1.6 | no clear effect |  |
| 497 | Draconic Fury | 4 | Class | — | save | −0.04 ± 0.03 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 498 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.04 ± 0.02 | +0.02 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 499 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.04 ± 0.05 | −0.07 | −0.01 | 4.7 | no clear effect |  |
| 500 | Repel Ambient Magic | 0 | Action | — | effect | −0.04 ± 0.03 | −0.04 | −0.04 | 0.5 | no clear effect |  |
| 501 | Rain of Embers Stance | 1 | Class | monk | stance | −0.04 ± 0.04 | −0.04 | −0.03 | 0.7 | no clear effect |  |
| 502 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | −0.04 ± 0.06 | −0.11 | +0.03 | 1.0 | no clear effect |  |
| 503 | Overclock Senses | 2 | Class | — | PF2e's self Effect | −0.04 ± 0.01 | −0.08 | −0.00 | 1.3 | no clear effect |  |
| 504 | Mind Shards | 6 | Class | — | save | −0.04 ± 0.03 | −0.04 | −0.05 | 0.8 | no clear effect |  |
| 505 | Repair Module | 9 | Ancestry | — | effect | −0.05 ± 0.04 | −0.07 | −0.03 | 1.7 | no clear effect |  |
| 506 | Flash of Omnipresence | 14 | Class | — | save | −0.05 ± 0.04 | −0.11 | +0.01 | 0.4 | no clear effect |  |
| 507 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.05 ± 0.02 | −0.03 | −0.07 | 0.1 | hurts |  |
| 508 | Thunder Clap | 6 | Class | — | save | −0.05 ± 0.02 | −0.08 | −0.02 | 0.9 | hurts |  |
| 509 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.05 ± 0.03 | −0.07 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 510 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | −0.05 ± 0.02 | −0.07 | −0.04 | 0.5 | hurts |  |
| 511 | Incredible Aim | 8 | Class | fighter | Strike activity | −0.05 ± 0.03 | −0.12 | +0.02 | 1.7 | no clear effect |  |
| 512 | Duo's Aim | 8 | Class | — | Strike activity | −0.05 ± 0.03 | −0.12 | +0.02 | 1.7 | no clear effect |  |
| 513 | Archer's Aim | 8 | Class | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.12 | 2.3 | no clear effect |  |
| 514 | Enchanting Shot | 8 | Class | — | Strike activity | −0.06 ± 0.03 | −0.15 | +0.03 | 0.9 | hurts |  |
| 515 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | −0.06 ± 0.05 | −0.09 | −0.03 | 1.0 | no clear effect |  |
| 516 | Unstable Gearshift | 6 | Class | — | self effect | −0.06 ± 0.02 | −0.13 | +0.00 | 2.5 | hurts |  |
| 517 | Psi Burst | 2 | Class | psychic | save | −0.07 ± 0.03 | −0.05 | −0.08 | 1.3 | hurts |  |
| 518 | Dueling Parry | 2 | Class | fighter | effect | −0.08 ± 0.02 | −0.12 | −0.03 | 0.2 | hurts |  |
| 519 | Storming Breath | 6 | Class | — | save | −0.08 ± 0.02 | −0.07 | −0.09 | 1.3 | hurts |  |
| 520 | Tidal Shield | 17 | Ancestry | — | effect | −0.08 ± 0.06 | −0.27 | +0.11 | 2.0 | no clear effect |  |
| 521 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.06 | −0.30 | +0.09 | 1.0 | no clear effect |  |
| 522 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.11 ± 0.06 | −0.31 | +0.09 | 1.0 | no clear effect |  |
| 523 | Worm's Feast | 6 | Class | — | save | −0.15 ± 0.04 | −0.19 | −0.11 | 1.0 | hurts |  |
| 524 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.15 ± 0.05 | −0.06 | −0.25 | 0.9 | hurts |  |
| 525 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | −0.27 ± 0.06 | −0.42 | −0.12 | 0.9 | hurts |  |
| 526 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.28 ± 0.07 | −0.56 | +0.00 | 1.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 5304 |
| a timer with no rules a fight counts | 263 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 130 |
| a teleport | 66 |
| an Effect with nothing a fight counts | 66 |
| its requirement, which the PC doesn't meet | 59 |
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
