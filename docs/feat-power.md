# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-01: 640 feats and actions rated, 6308 not simulated, 1 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice. Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 601
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
| 10 | To Me! | 18 | Class | — | Strike activity | +0.13 ± 0.04 | −0.01 | +0.27 | 0.0 | good | the AI never used it |
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
| 10 | To Me! | 18 | Class | — | Strike activity | +0.13 ± 0.04 | −0.01 | +0.27 | 0.0 | good | the AI never used it |
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
| 52 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | +0.04 ± 0.06 | +0.03 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 53 | Boarding Assault | 0 | Action | — | Strike activity | +0.04 ± 0.03 | +0.00 | +0.09 | 1.2 | no clear effect |  |
| 54 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.04 ± 0.03 | +0.00 | +0.09 | 1.2 | no clear effect |  |
| 55 | Break Free | 0 | Action | — | Strike activity | +0.04 ± 0.03 | −0.00 | +0.09 | 1.2 | no clear effect |  |
| 56 | Defensive Advance | 1 | Class | champion | Strike activity | +0.04 ± 0.03 | −0.00 | +0.09 | 1.2 | no clear effect |  |
| 57 | Do You Know Who I Am? | 12 | Class | — | check | +0.04 ± 0.06 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 58 | Calculate Threats | 0 | Action | psychic | effect | +0.04 ± 0.03 | −0.02 | +0.10 | 1.5 | no clear effect |  |
| 59 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.07 | +0.01 | +0.06 | 1.8 | no clear effect |  |
| 60 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.07 | +0.01 | 1.9 | no clear effect |  |
| 61 | Pack Attack | 6 | Class | — | strike-extra | +0.04 ± 0.02 | +0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 62 | Call Hellfire | 8 | Class | — | save | +0.03 ± 0.02 | +0.05 | +0.02 | 0.3 | no clear effect |  |
| 63 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.04 | +0.02 | 0.8 | no clear effect |  |
| 64 | Quill Spray | 9 | Ancestry | — | save | +0.03 ± 0.03 | +0.03 | +0.04 | 0.8 | no clear effect |  |
| 65 | Tectonic Stomp | 10 | Class | — | save | +0.03 ± 0.02 | +0.00 | +0.06 | 1.3 | no clear effect |  |
| 66 | Dragon Breath | 0 | Action | — | save | +0.03 ± 0.03 | −0.06 | +0.13 | 0.5 | no clear effect |  |
| 67 | Golden Body | 20 | Class | monk | fast-healing | +0.03 ± 0.02 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 68 | Demon Slayer | 17 | Ancestry | — | save | +0.03 ± 0.02 | +0.03 | +0.02 | 0.4 | no clear effect |  |
| 69 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.03 ± 0.02 | +0.04 | +0.01 | 3.8 | no clear effect |  |
| 70 | Spirit Guide Form | 14 | Class | — | effect | +0.03 ± 0.02 | −0.02 | +0.07 | 0.2 | no clear effect |  |
| 71 | Herald's Strike | 20 | Class | — | save | +0.03 ± 0.03 | +0.07 | −0.02 | 0.8 | no clear effect |  |
| 72 | Gang Up | 6 | Class | rogue | passive-rules | +0.02 ± 0.02 | −0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 73 | Irresistible Bloom | 17 | Ancestry | — | save | +0.02 ± 0.01 | +0.00 | +0.05 | 0.1 | no clear effect |  |
| 74 | Rain of Bolts | 9 | Ancestry | — | save | +0.02 ± 0.03 | −0.01 | +0.05 | 0.8 | no clear effect |  |
| 75 | Acknowledge Fan | 12 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.2 | no clear effect |  |
| 76 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.02 ± 0.01 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 77 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
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
| 96 | Freeze It! | 9 | Ancestry | — | check | +0.01 ± 0.02 | +0.03 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 97 | Peony's Flourish | 14 | Class | — | check | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 98 | Majestic Presence | 13 | Ancestry | — | save | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 99 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.04 | −0.02 | 0.3 | no clear effect |  |
| 100 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | +0.01 ± 0.06 | −0.04 | +0.06 | 1.0 | no clear effect |  |
| 101 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.01 | +0.02 | −0.00 | 0.2 | no clear effect |  |
| 102 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 2.8 | no clear effect |  |
| 103 | Unleash the Blight | 10 | Class | — | save | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 104 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | −0.01 | +0.03 | 6.5 | no clear effect | with a one-handed weapon and a free hand |
| 105 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.03 | +0.03 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 106 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.03 | −0.01 | 2.3 | no clear effect |  |
| 107 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.01 ± 0.02 | −0.07 | +0.09 | 0.0 | no clear effect | the AI never used it |
| 108 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.00 | +0.02 | +0.00 | 0.5 | no clear effect |  |
| 109 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 110 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.01 ± 0.04 | −0.06 | +0.07 | 1.7 | no clear effect |  |
| 111 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | +0.01 ± 0.06 | +0.06 | −0.05 | 0.5 | no clear effect |  |
| 112 | Dominion Aura | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 113 | Muckraking | 16 | Class | — | save | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 114 | Overwhelming Blow | 16 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 115 | No Scar but This | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.3 | no clear effect |  |
| 116 | Raise Slabs | 0 | Action | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 117 | Feral Mending | 8 | Class | — | check | +0.00 ± 0.02 | −0.01 | +0.02 | 0.3 | no clear effect |  |
| 118 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 119 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.04 | −0.02 | +0.03 | 0.7 | no clear effect |  |
| 120 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 121 | Diamond Soul | 12 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 122 | Construct Dynamo | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 123 | Siphon Life | 10 | Class | — | Strike activity | +0.00 ± 0.03 | −0.00 | +0.01 | 1.0 | no clear effect |  |
| 124 | Clobber | 16 | Class | guardian | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 125 | Wild Dance | 12 | Class | — | save | +0.00 ± 0.02 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 126 | Trample Mimicry | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 127 | Propulsive Leap | 10 | Class | — | save | +0.00 ± 0.03 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 128 | Cry of Rebellion | 16 | Class | — | save | +0.00 ± 0.02 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 129 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 130 | Form a Flock | 13 | Ancestry | — | effect | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 131 | Stasian Smash | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 132 | Grievous Blow | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 133 | I Will Return | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 134 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 135 | Impaling Finisher | 4 | Class | swashbuckler | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 136 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 137 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 138 | Tamper | 1 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 139 | Weakening Assault | 12 | Class | guardian | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.1 | no clear effect |  |
| 140 | Cantorian Rejuvenation | 9 | Ancestry | — | check | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 141 | Called Shot | 10 | Class | gunslinger | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 142 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 143 | Head Stomp | 4 | Class | rogue | Strike activity | +0.00 ± 0.04 | −0.02 | +0.03 | 5.2 | no clear effect |  |
| 144 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 145 | Trip | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 146 | Fracture Mountains | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 147 | Piston Punch | 6 | Class | — | Strike activity | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 148 | Blessed Sentinel | 6 | Class | — | Strike activity | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 149 | Frightening Indignation | 16 | Class | — | save | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 150 | Desiccating Inhalation | 12 | Class | — | save | +0.00 ± 0.03 | +0.00 | −0.00 | 0.8 | no clear effect |  |
| 151 | Radiant Burst | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 152 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 153 | Eldritch Shot | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 154 | Bone Swarm | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 155 | Swipe | 4 | Class | barbarian | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 156 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 157 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 158 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 159 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 160 | Clue In | 0 | Action | investigator | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 161 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 162 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Turn Aside Ambient Magic | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 164 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 165 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Anadi Venom | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 168 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 169 | Quick-Tempered | 0 | Action | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 170 | Banshee Cry | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 171 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Size Up | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 174 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 175 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 176 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Tail Toxin | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 179 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 180 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 182 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 183 | Palm an Object | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 184 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 186 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 188 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 189 | Reposition | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 190 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 191 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 192 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 193 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Weaponsight | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 195 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 196 | Amulet's Abeyance | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 197 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 198 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 199 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 200 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 201 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 203 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 204 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 205 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 206 | Hunt the Razer's Pawn | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 207 | Launch Fireworks | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 208 | Sibilant Whispers | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 210 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 211 | Invented Vulnerability | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 212 | Bon Mot | 1 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 213 | Tributary Circulation | 4 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 214 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 215 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 216 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 217 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 218 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 219 | Disarming Stance | 6 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 220 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 222 | In Lightning, Life | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 223 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 224 | Stretching Reach | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 226 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 228 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 229 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 230 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 231 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 232 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 233 | After You | 2 | Class | swashbuckler | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 234 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 235 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 236 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Sense Iniquity | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 238 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 239 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 240 | Whispers of Weakness | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 241 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 242 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 243 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 244 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 245 | Even the Odds | 4 | Class | swashbuckler | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 246 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 247 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 248 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 249 | Reveal True Name | 1 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 250 | Duelist's Challenge | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 251 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 252 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 253 | Shooting Stars Stance | 2 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 254 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 255 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 256 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 257 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 258 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 259 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 260 | Declare Anathema | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 261 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 262 | Fane's Fourberie | 2 | Class | rogue | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 263 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 265 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 266 | Watch Your Back (Golden Legionnaire) | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 268 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 272 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 273 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 274 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 275 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 277 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 278 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 279 | Lord of the Fiends | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 280 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 281 | Hypnotic Lure | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 282 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 283 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 284 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 285 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 286 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 287 | Dragon's Rage Wings | 12 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Push Back the Dead! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 289 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 290 | Inspiring Recitation | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 291 | Peafowl Stance | 4 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 292 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 293 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 294 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 295 | Wounded Rage | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 296 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 297 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 298 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 299 | Cheat Death | 12 | Class | swashbuckler | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Disruptive Stare | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 301 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 302 | Infused with Belkzen's Might | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 303 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 304 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 305 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 306 | Fortify Shield | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 307 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 308 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 309 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 310 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 311 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 312 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 313 | Reverberate | 12 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 314 | Jotun's Battle Stance | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 315 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 316 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 318 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 319 | Desperate Wrath | 16 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 320 | Gunpowder Gauntlet | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 321 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 322 | Fine Print | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 323 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 324 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 325 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 326 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 327 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 328 | Battlefront Sabotage | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 329 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 330 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 331 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 332 | Oracular Warning | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 333 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 334 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 335 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 337 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 341 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 343 | Weapon Infusion | 1 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 344 | Hone Claws | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 345 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Don Thy Fervor | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 351 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 352 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 353 | Paragon's Guard | 12 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 357 | Whirling Blade Stance | 14 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 361 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 362 | Elemental Bulwark | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Envenom Fangs | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 365 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 366 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 367 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 368 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 370 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Nanite Surge | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 375 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Distracting Flattery | 4 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 378 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 379 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 380 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Liberated Mind | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Watchful Gaze | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Anchoring Arrow | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 387 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Bring Into the Fold | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 390 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 393 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 394 | Giant's Lunge | 14 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Invigorating Surge | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Empathetic Plea | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 400 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 401 | Duelist's Form | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 403 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 405 | Swaggering Initiative | 4 | Class | swashbuckler | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 407 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 410 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 413 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 414 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 417 | Favorable Winds | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 418 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Swap Reflections | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 421 | Tracing Trance | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 422 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 424 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 426 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 427 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 429 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Shattershields | 12 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Air Shroud | 4 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 435 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 436 | Goblin Song | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 437 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 439 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 440 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 441 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 442 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 443 | Instigate Psychic Duel | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 444 | Ricochet Stance (Rogue) | 8 | Class | rogue | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 445 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 446 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 447 | Grief's Fury | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Inventive Offensive | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 449 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Desert Wind | 6 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Buckler Dance | 10 | Class | swashbuckler | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Storied Companion | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Ricochet Stance (Fighter) | 6 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 462 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 463 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 464 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 465 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 466 | Go with the Flow | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 467 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Interrogate | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 470 | Boaster's Challenge | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Condemn Soul | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Slowing Strike | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 475 | Share Rage | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Sabotage | 4 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Reel 'Em In | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Shield from Arrows | 8 | Class | guardian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Guided Skill | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Spell Parry | 2 | Class | magus | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Can't Fall Here | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Magnetic Field | 4 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Point Blank Stance | 1 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 509 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Geologic Attunement | 1 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 512 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Come and Get Me | 10 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 517 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Surgical Shock | 12 | Class | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Defiant Banner | 8 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Pluck from the Sky | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Barreling Charge | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Fortifying Knock | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 532 | Spore Cloud | 9 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Perfume Cloud | 9 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Brutish Shove | 2 | Class | fighter | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 537 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 538 | Wing Buffet | 9 | Ancestry | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 539 | Demoralize | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.7 | no clear effect |  |
| 540 | Whirling Knockdown | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | Tenacious Stance | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.1 | no clear effect |  |
| 543 | Pummeling Whirlpool | 13 | Ancestry | — | save | −0.00 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 544 | Healing Nexus | 8 | Class | — | healing | −0.00 ± 0.02 | −0.02 | +0.02 | 0.3 | no clear effect |  |
| 545 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.00 ± 0.01 | −0.00 | −0.00 | 1.4 | no clear effect | with two weapons (longsword and shortsword) |
| 546 | Feign Innocence | 12 | Class | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 548 | Vengeful Remnant | 14 | Class | — | effect | −0.00 ± 0.02 | −0.02 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 549 | History of Violence | 14 | Class | — | Strike activity | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Might of the Realm | 14 | Class | — | Strike activity | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Burning Demand | 12 | Class | kineticist | save | −0.00 ± 0.01 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.00 ± 0.01 | −0.00 | −0.00 | 0.1 | no clear effect |  |
| 553 | Swiping Trace | 8 | Class | — | Strike activity | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Channel Divine Spark | 14 | Class | — | check | −0.00 ± 0.02 | −0.02 | +0.01 | 0.1 | no clear effect |  |
| 555 | Confusing Commands | 16 | Class | commander | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 556 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | −0.00 | 1.1 | no clear effect |  |
| 557 | Crimson Shroud | 6 | Class | — | effect | −0.00 ± 0.02 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 558 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.00 ± 0.07 | −0.15 | +0.14 | 0.0 | no clear effect | the AI never used it |
| 560 | Sky and Heaven Stance | 6 | Class | — | stance | −0.00 ± 0.02 | +0.00 | −0.01 | 0.7 | no clear effect |  |
| 561 | Tap Vitality | 6 | Class | — | check | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 562 | Finish Their Story! | 20 | Class | — | Strike activity | −0.01 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 563 | Vessel's Form | 16 | Class | — | check | −0.01 ± 0.02 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 564 | Flower Street Infamy | 11 | Skill | — | check | −0.01 ± 0.03 | −0.04 | +0.03 | 0.8 | no clear effect |  |
| 565 | Part the Veil | 0 | Action | — | check | −0.01 ± 0.04 | −0.02 | +0.01 | 0.7 | no clear effect |  |
| 566 | Raise Symbol | 4 | Class | cleric | self effect | −0.01 ± 0.01 | −0.02 | +0.00 | 0.3 | no clear effect |  |
| 567 | Death of Hope | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 568 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.03 | −0.05 | +0.03 | 0.8 | no clear effect |  |
| 569 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.01 ± 0.03 | −0.04 | +0.02 | 0.3 | no clear effect |  |
| 570 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 571 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.02 | 2.8 | no clear effect | with two weapons (longsword and shortsword) |
| 572 | Subjugation | 16 | Class | — | save | −0.01 ± 0.04 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 573 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 574 | Decree of Execution | 18 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 575 | Psi Catastrophe | 12 | Class | psychic | save | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 576 | Asp Stance | 6 | Class | monk | stance | −0.01 ± 0.02 | −0.04 | +0.01 | 0.5 | no clear effect |  |
| 577 | Feathered Flechettes | 6 | Class | — | save | −0.01 ± 0.01 | −0.03 | +0.01 | 0.2 | no clear effect |  |
| 578 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.2 | no clear effect |  |
| 579 | Paralyzing Slash | 8 | Class | — | Strike activity | −0.01 ± 0.03 | −0.03 | −0.00 | 4.1 | no clear effect |  |
| 580 | Bristle | 5 | Ancestry | — | effect | −0.01 ± 0.02 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 581 | Titan Swing | 2 | Class | — | Strike activity | −0.01 ± 0.03 | −0.02 | −0.01 | 2.8 | no clear effect |  |
| 582 | Flinging Blow | 16 | Class | monk | Strike activity | −0.01 ± 0.02 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 583 | Swirl Crimson Shroud | 0 | Action | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.2 | no clear effect |  |
| 584 | Hydraulic Deflection | 1 | Ancestry | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 585 | Ceremony of Protection | 1 | Ancestry | — | effect | −0.01 ± 0.01 | −0.03 | +0.00 | 0.3 | no clear effect |  |
| 586 | Emotional Surge | 10 | Class | psychic | effect | −0.02 ± 0.01 | −0.03 | −0.00 | 0.3 | no clear effect |  |
| 587 | Primadonna | 12 | Class | — | check | −0.02 ± 0.01 | +0.00 | −0.03 | 0.1 | no clear effect |  |
| 588 | Elemental Assault | 1 | Ancestry | — | effect | −0.02 ± 0.02 | −0.02 | −0.01 | 1.0 | no clear effect |  |
| 589 | Twin Takedown | 1 | Class | ranger | 2 Strikes | −0.02 ± 0.04 | +0.02 | −0.05 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 590 | Promise of Pain | 10 | Class | — | save | −0.02 ± 0.05 | −0.14 | +0.10 | 1.0 | no clear effect |  |
| 591 | Cobra Stance | 4 | Class | monk | stance | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 592 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.02 ± 0.03 | −0.04 | +0.00 | 0.8 | no clear effect |  |
| 593 | Draconic Resilience | 4 | Class | — | effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.2 | no clear effect |  |
| 594 | Blood Shield | 4 | Class | — | self effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.1 | no clear effect |  |
| 595 | Twin Parry | 4 | Class | fighter | effect | −0.02 ± 0.02 | −0.04 | −0.00 | 0.1 | no clear effect |  |
| 596 | Armored Courage | 4 | Class | guardian | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 0.5 | no clear effect |  |
| 597 | Lantern Strobe | 0 | Action | — | save | −0.02 ± 0.01 | −0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Putrefaction | 14 | Class | — | save | −0.02 ± 0.01 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 599 | Hunter's Aim | 2 | Class | ranger | Strike activity | −0.02 ± 0.01 | −0.03 | −0.01 | 0.5 | no clear effect |  |
| 600 | Dragonet Breath | 1 | Ancestry | — | save | −0.02 ± 0.03 | −0.04 | −0.01 | 0.1 | no clear effect |  |
| 601 | Trial by Skyfire | 10 | Class | oracle | save | −0.03 ± 0.02 | −0.05 | −0.00 | 0.3 | no clear effect |  |
| 602 | Enter Spirit Trance | 0 | Action | — | effect | −0.03 ± 0.01 | −0.06 | +0.00 | 0.3 | no clear effect |  |
| 603 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.03 ± 0.02 | −0.04 | −0.02 | 0.3 | no clear effect |  |
| 604 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.03 ± 0.01 | −0.06 | +0.00 | 0.2 | no clear effect |  |
| 605 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.03 ± 0.03 | −0.08 | +0.03 | 1.0 | no clear effect |  |
| 606 | Stoked Flame Stance | 1 | Class | monk | stance | −0.03 ± 0.01 | −0.06 | −0.00 | 0.2 | no clear effect |  |
| 607 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | −0.03 ± 0.05 | −0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 608 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.03 ± 0.06 | −0.10 | +0.03 | 1.6 | no clear effect |  |
| 609 | Draconic Fury | 4 | Class | — | save | −0.04 ± 0.03 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 610 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.04 ± 0.02 | +0.02 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 611 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.04 ± 0.02 | +0.02 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 612 | Penetrating Shot | 10 | Class | ranger | Strike activity | −0.04 ± 0.02 | +0.02 | −0.09 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 613 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.04 ± 0.05 | −0.07 | −0.01 | 4.7 | no clear effect |  |
| 614 | Repel Ambient Magic | 0 | Action | — | effect | −0.04 ± 0.03 | −0.04 | −0.04 | 0.5 | no clear effect |  |
| 615 | Rain of Embers Stance | 1 | Class | monk | stance | −0.04 ± 0.04 | −0.04 | −0.03 | 0.7 | no clear effect |  |
| 616 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | −0.04 ± 0.06 | −0.11 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 617 | Overclock Senses | 2 | Class | — | PF2e's self Effect | −0.04 ± 0.01 | −0.08 | −0.00 | 1.3 | no clear effect |  |
| 618 | Mind Shards | 6 | Class | — | save | −0.04 ± 0.03 | −0.04 | −0.05 | 0.8 | no clear effect |  |
| 619 | Repair Module | 9 | Ancestry | — | effect | −0.05 ± 0.04 | −0.07 | −0.03 | 1.7 | no clear effect |  |
| 620 | Flash of Omnipresence | 14 | Class | — | save | −0.05 ± 0.04 | −0.11 | +0.01 | 0.4 | no clear effect |  |
| 621 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.05 ± 0.02 | −0.03 | −0.07 | 0.1 | hurts |  |
| 622 | Thunder Clap | 6 | Class | — | save | −0.05 ± 0.02 | −0.08 | −0.02 | 0.9 | hurts |  |
| 623 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.05 ± 0.03 | −0.07 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 624 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | −0.05 ± 0.02 | −0.07 | −0.04 | 0.5 | hurts |  |
| 625 | Incredible Aim | 8 | Class | fighter | Strike activity | −0.05 ± 0.03 | −0.12 | +0.02 | 1.7 | no clear effect |  |
| 626 | Duo's Aim | 8 | Class | — | Strike activity | −0.05 ± 0.03 | −0.12 | +0.02 | 1.7 | no clear effect |  |
| 627 | Archer's Aim | 8 | Class | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.12 | 2.3 | no clear effect |  |
| 628 | Enchanting Shot | 8 | Class | — | Strike activity | −0.06 ± 0.03 | −0.15 | +0.03 | 0.9 | hurts |  |
| 629 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | −0.06 ± 0.05 | −0.09 | −0.03 | 1.0 | no clear effect |  |
| 630 | Unstable Gearshift | 6 | Class | — | self effect | −0.06 ± 0.02 | −0.13 | +0.00 | 2.5 | hurts |  |
| 631 | Psi Burst | 2 | Class | psychic | save | −0.07 ± 0.03 | −0.05 | −0.08 | 1.3 | hurts |  |
| 632 | Dueling Parry | 2 | Class | fighter | effect | −0.08 ± 0.02 | −0.12 | −0.03 | 0.2 | hurts |  |
| 633 | Storming Breath | 6 | Class | — | save | −0.08 ± 0.02 | −0.07 | −0.09 | 1.3 | hurts |  |
| 634 | Tidal Shield | 17 | Ancestry | — | effect | −0.08 ± 0.06 | −0.27 | +0.11 | 2.0 | no clear effect |  |
| 635 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.06 | −0.30 | +0.09 | 1.0 | no clear effect |  |
| 636 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.11 ± 0.06 | −0.31 | +0.09 | 1.0 | no clear effect |  |
| 637 | Worm's Feast | 6 | Class | — | save | −0.15 ± 0.04 | −0.19 | −0.11 | 1.0 | hurts |  |
| 638 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.15 ± 0.05 | −0.06 | −0.25 | 0.9 | hurts |  |
| 639 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | −0.27 ± 0.06 | −0.42 | −0.12 | 0.9 | hurts |  |
| 640 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.28 ± 0.07 | −0.56 | +0.00 | 1.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 5304 |
| a timer with no rules a fight counts | 263 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 117 |
| a teleport | 66 |
| nothing a fight uses | 55 |
| its requirement, which the PC doesn't meet | 53 |
| a reaction's Strike | 52 |
| a spell the feat casts | 35 |
| its text has no Strike of its user's | 29 |
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
