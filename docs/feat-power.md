# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-04: 1567 feats and actions rated, 5377 not simulated, 5 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 132 an encounter here, all fights 655, no effect 408, precise 43, about zero 20 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1133
- hurts: 359
- good: 37
- minor: 20
- strong: 15
- very strong: 3

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.71 ± 0.05 | +1.12 | +0.31 | 4.2 | very strong |  |
| 2 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.19 | 1.1 | very strong |  |
| 3 | Lightning Dash | 4 | Class | kineticist | save | +0.54 ± 0.11 | +0.98 | +0.11 | 3.5 | very strong |  |
| 4 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.49 ± 0.06 | +0.49 | +0.50 | 5.0 | strong |  |
| 5 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.48 ± 0.09 | +0.43 | +0.52 | 5.1 | strong |  |
| 6 | Scare to Death | 15 | Skill | — | save | +0.45 ± 0.05 | +0.68 | +0.22 | 3.6 | strong |  |
| 7 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.42 ± 0.04 | +0.26 | +0.59 | 0.0 | strong | the AI never used it |
| 8 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 12.3 | strong |  |
| 9 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 10 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 11 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 12 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 13 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 14 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 15 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 16 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 17 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 18 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 19 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.05 | +0.45 | +0.05 | 4.3 | good |  |
| 20 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 21 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 22 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 23 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 24 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.24 ± 0.06 | +0.35 | +0.12 | 3.7 | good |  |
| 25 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 26 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.35 | +0.11 | 0.0 | good | the AI never used it |
| 27 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 28 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 29 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 30 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 31 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 32 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 33 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.19 ± 0.04 | +0.31 | +0.07 | 1.5 | good |  |
| 34 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 35 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 36 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 37 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 38 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |
| 39 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 40 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.16 ± 0.09 | +0.13 | +0.20 | 1.0 | no clear effect |  |

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
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.71 ± 0.05 | +1.12 | +0.31 | 4.2 | very strong |  |
| 2 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.19 | 1.1 | very strong |  |
| 3 | Lightning Dash | 4 | Class | kineticist | save | +0.54 ± 0.11 | +0.98 | +0.11 | 3.5 | very strong |  |
| 4 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.49 ± 0.06 | +0.49 | +0.50 | 5.0 | strong |  |
| 5 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.48 ± 0.09 | +0.43 | +0.52 | 5.1 | strong |  |
| 6 | Scare to Death | 15 | Skill | — | save | +0.45 ± 0.05 | +0.68 | +0.22 | 3.6 | strong |  |
| 7 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.42 ± 0.04 | +0.26 | +0.59 | 0.0 | strong | the AI never used it |
| 8 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 12.3 | strong |  |
| 9 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 10 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 11 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 12 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 13 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 14 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 15 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 16 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 17 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 18 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 19 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.05 | +0.45 | +0.05 | 4.3 | good |  |
| 20 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 21 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 22 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 23 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 24 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.24 ± 0.06 | +0.35 | +0.12 | 3.7 | good |  |
| 25 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 26 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.35 | +0.11 | 0.0 | good | the AI never used it |
| 27 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 28 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 29 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 30 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 31 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 32 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 33 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.19 ± 0.04 | +0.31 | +0.07 | 1.5 | good |  |
| 34 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 35 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 36 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 37 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 38 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |
| 39 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 40 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.16 ± 0.09 | +0.13 | +0.20 | 1.0 | no clear effect |  |
| 41 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.16 ± 0.07 | +0.23 | +0.09 | 0.0 | good | the AI never used it |
| 42 | Infernal Anguish | 8 | Class | — | check | +0.15 ± 0.06 | +0.44 | −0.14 | 9.1 | good |  |
| 43 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.04 | +0.19 | +0.10 | 1.3 | good |  |
| 44 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.15 ± 0.03 | +0.19 | +0.10 | 0.8 | good |  |
| 45 | Devastating Duelist | 18 | Class | — | Strike activity | +0.14 ± 0.04 | +0.19 | +0.10 | 4.1 | good |  |
| 46 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.14 ± 0.07 | +0.19 | +0.09 | 1.0 | good |  |
| 47 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.14 ± 0.07 | +0.13 | +0.16 | 5.2 | no clear effect | with two weapons (longsword and shortsword) |
| 48 | Recharging Flurry | 4 | Class | magus | 2 Strikes | +0.14 ± 0.08 | +0.22 | +0.06 | 2.5 | no clear effect | with two weapons (longsword and shortsword) |
| 49 | Ignite the Sun | 18 | Class | kineticist | save | +0.14 ± 0.07 | +0.19 | +0.09 | 5.2 | no clear effect |  |
| 50 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.14 ± 0.06 | +0.17 | +0.11 | 3.8 | good | with two weapons (longsword and shortsword) |
| 51 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.14 ± 0.07 | +0.01 | +0.26 | 4.2 | no clear effect |  |
| 52 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.04 | +0.10 | +0.17 | 0.0 | good | the AI never used it |
| 53 | Living Epic | 20 | Class | — | passive effect (always on) | +0.13 ± 0.03 | +0.13 | +0.13 | 1.0 | good | always on (its moment isn't checked) |
| 54 | Furious Grab | 12 | Class | barbarian | check | +0.13 ± 0.08 | +0.18 | +0.08 | 5.8 | no clear effect |  |
| 55 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.12 ± 0.07 | +0.20 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 56 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.12 ± 0.06 | +0.29 | −0.04 | 4.0 | good |  |
| 57 | Imprison Foe | 18 | Class | — | save | +0.12 ± 0.05 | +0.15 | +0.09 | 2.6 | good |  |
| 58 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.12 ± 0.07 | +0.16 | +0.08 | 4.8 | no clear effect | with two weapons (longsword and shortsword) |
| 59 | Osteo Armaments | 4 | Class | — | effect | +0.12 ± 0.05 | +0.05 | +0.19 | 2.0 | good |  |
| 60 | Forest's Heart | 16 | Class | animist | stance | +0.12 ± 0.07 | +0.28 | −0.05 | 1.0 | no clear effect |  |
| 61 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 62 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.11 ± 0.03 | +0.08 | +0.15 | 0.7 | good |  |
| 63 | Lava Leap | 4 | Class | kineticist | save | +0.11 ± 0.08 | +0.18 | +0.05 | 1.6 | no clear effect |  |
| 64 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.11 ± 0.03 | +0.20 | +0.02 | 0.3 | good |  |
| 65 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.11 ± 0.06 | +0.15 | +0.07 | 1.0 | no clear effect |  |
| 66 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.11 ± 0.06 | +0.20 | +0.02 | 3.3 | no clear effect |  |
| 67 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.11 ± 0.08 | +0.01 | +0.21 | 3.9 | no clear effect | with a loaded arquebus |
| 68 | Grievous Blow | 8 | Class | — | Strike activity | +0.11 ± 0.05 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 69 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 70 | Duo's Aim | 8 | Class | — | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 4.1 | no clear effect |  |
| 71 | Pierce the Eye | 16 | Class | — | save | +0.10 ± 0.07 | +0.23 | −0.02 | 3.7 | no clear effect | with a loaded arquebus |
| 72 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.04 | +0.21 | −0.01 | 3.5 | good |  |
| 73 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.10 ± 0.06 | +0.30 | −0.10 | 1.0 | no clear effect |  |
| 74 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 75 | Into the Fray | 8 | Class | — | 2 Strikes | +0.10 ± 0.05 | +0.20 | −0.00 | 3.4 | no clear effect | with a weapon and a shield |
| 76 | Do You Know Who I Am? | 12 | Class | — | check | +0.10 ± 0.06 | +0.13 | +0.06 | 1.0 | no clear effect |  |
| 77 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.10 ± 0.07 | +0.70 | −0.51 | 25.8 | no clear effect |  |
| 78 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 79 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.09 ± 0.05 | +0.16 | +0.02 | 1.0 | no clear effect |  |
| 80 | Reveal Machinations | 15 | Skill | — | check | +0.09 ± 0.04 | +0.10 | +0.08 | 1.0 | minor |  |
| 81 | Certain Strike | 10 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.14 | +0.04 | 7.4 | minor |  |
| 82 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.09 ± 0.05 | +0.04 | +0.13 | 5.2 | no clear effect |  |
| 83 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.12 | +0.05 | 3.2 | minor | with a one-handed weapon and a free hand |
| 84 | Seize | 14 | Class | — | check | +0.09 ± 0.06 | +0.17 | +0.01 | 7.2 | no clear effect |  |
| 85 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 86 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.08 ± 0.05 | +0.06 | +0.11 | 1.0 | no clear effect |  |
| 87 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 88 | Olethros's Decree | 17 | Ancestry | — | save | +0.08 ± 0.04 | +0.15 | +0.02 | 1.0 | minor |  |
| 89 | Apocalyptic Visions | 18 | Class | — | save | +0.08 ± 0.06 | +0.11 | +0.05 | 1.0 | no clear effect |  |
| 90 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.12 | 3.6 | no clear effect |  |
| 91 | Mythic Containment | 10 | Class | — | check | +0.08 ± 0.05 | +0.17 | −0.01 | 2.8 | no clear effect |  |
| 92 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.08 ± 0.03 | +0.14 | +0.02 | 2.1 | minor |  |
| 93 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.08 ± 0.06 | +0.10 | +0.06 | 5.5 | no clear effect |  |
| 94 | Rend Armor | 8 | Class | — | effect | +0.08 ± 0.05 | +0.37 | −0.21 | 7.2 | no clear effect |  |
| 95 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.07 ± 0.05 | +0.15 | +0.00 | 1.0 | no clear effect |  |
| 96 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.07 ± 0.04 | +0.11 | +0.04 | 4.2 | no clear effect |  |
| 97 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.07 ± 0.08 | +0.15 | −0.01 | 4.4 | no clear effect |  |
| 98 | Mana Detonation | 18 | Class | — | focus spell: Arcane Explosion (rank 9) | +0.07 ± 0.04 | +0.10 | +0.05 | 0.3 | no clear effect |  |
| 99 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.07 ± 0.02 | +0.11 | +0.03 | 0.2 | minor |  |
| 100 | Rain of Razors | 12 | Class | kineticist | save | +0.07 ± 0.07 | −0.04 | +0.19 | 1.6 | no clear effect |  |
| 101 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.07 ± 0.04 | +0.12 | +0.02 | 4.0 | no clear effect |  |
| 102 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.07 ± 0.05 | +0.02 | +0.12 | 1.0 | no clear effect |  |
| 103 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.04 | −0.06 | +0.21 | 0.1 | no clear effect |  |
| 104 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.07 ± 0.04 | +0.05 | +0.09 | 1.9 | no clear effect |  |
| 105 | Acknowledge Fan | 12 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.04 | 3.0 | no clear effect |  |
| 106 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.10 | +0.02 | 2.3 | minor | with a bow in hand |
| 107 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.06 ± 0.06 | +0.09 | +0.04 | 6.1 | no clear effect |  |
| 108 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.06 ± 0.07 | +0.05 | +0.07 | 1.0 | no clear effect |  |
| 109 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.06 ± 0.06 | +0.06 | +0.07 | 1.0 | no clear effect |  |
| 110 | Shadow's Web | 14 | Class | monk | focus spell: Shadow's Web (rank 7) | +0.06 ± 0.04 | +0.02 | +0.11 | 0.4 | no clear effect |  |
| 111 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 112 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 113 | Enchanting Shot | 8 | Class | — | Strike activity | +0.06 ± 0.06 | +0.13 | −0.00 | 3.2 | no clear effect |  |
| 114 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 2.9 | no clear effect |  |
| 115 | Boarding Assault | 0 | Action | — | Strike activity | +0.06 ± 0.03 | +0.03 | +0.09 | 1.6 | no clear effect |  |
| 116 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 117 | Second Sting | 12 | Class | ranger | Strike activity | +0.06 ± 0.06 | +0.04 | +0.08 | 8.1 | no clear effect | with two weapons (longsword and shortsword) |
| 118 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.06 ± 0.08 | +0.20 | −0.08 | 1.0 | no clear effect |  |
| 119 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 120 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.04 | +0.08 | +0.04 | 0.9 | no clear effect |  |
| 121 | Call Worm Spirit | 10 | Class | — | save | +0.06 ± 0.05 | +0.00 | +0.12 | 1.0 | no clear effect |  |
| 122 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.06 ± 0.06 | +0.19 | −0.08 | 4.4 | no clear effect |  |
| 123 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 124 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 125 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 126 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.05 ± 0.04 | +0.00 | +0.11 | 0.8 | no clear effect |  |
| 127 | Promise of Pain | 10 | Class | — | save | +0.05 ± 0.05 | +0.10 | +0.01 | 1.0 | no clear effect |  |
| 128 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.05 ± 0.07 | +0.06 | +0.05 | 1.0 | no clear effect |  |
| 129 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 130 | Ride the Tsunami | 18 | Class | kineticist | save | +0.05 ± 0.07 | −0.15 | +0.26 | 2.7 | no clear effect |  |
| 131 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | +0.05 ± 0.03 | +0.08 | +0.02 | 0.4 | no clear effect |  |
| 132 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 133 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.05 ± 0.02 | +0.03 | +0.07 | 0.5 | minor |  |
| 134 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.03 | 0.1 | minor |  |
| 135 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 136 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 137 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.05 ± 0.03 | −0.00 | +0.10 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 138 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.05 ± 0.04 | +0.02 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 139 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | +0.05 ± 0.08 | +0.16 | −0.06 | 2.8 | no clear effect |  |
| 140 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | +0.05 ± 0.06 | +0.09 | +0.00 | 0.6 | no clear effect |  |
| 141 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.03 | +0.05 | +0.04 | 1.7 | no clear effect |  |
| 142 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 143 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 144 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 145 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.09 | 2.1 | no clear effect | with a loaded arquebus |
| 146 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.05 ± 0.03 | +0.02 | +0.07 | 0.2 | no clear effect |  |
| 147 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 148 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.04 ± 0.03 | +0.10 | −0.01 | 1.8 | no clear effect |  |
| 149 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 150 | Titan Swing | 2 | Class | — | Strike activity | +0.04 ± 0.03 | +0.16 | −0.08 | 2.6 | no clear effect |  |
| 151 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 152 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 153 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 154 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 155 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.04 ± 0.09 | +0.12 | −0.04 | 3.6 | no clear effect |  |
| 156 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 157 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 158 | All Shall End in Flames | 18 | Class | kineticist | save | +0.04 ± 0.05 | +0.06 | +0.02 | 0.8 | no clear effect |  |
| 159 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 160 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 161 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.04 ± 0.05 | +0.08 | −0.00 | 1.0 | no clear effect |  |
| 162 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.04 ± 0.06 | +0.06 | +0.01 | 6.3 | no clear effect |  |
| 163 | Draw From the Land | 10 | Class | — | check | +0.04 ± 0.02 | +0.11 | −0.03 | 0.3 | no clear effect |  |
| 164 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 165 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.04 ± 0.05 | +0.09 | −0.02 | 3.5 | no clear effect |  |
| 166 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.04 ± 0.06 | +0.10 | −0.03 | 3.3 | no clear effect |  |
| 167 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.04 ± 0.04 | +0.04 | +0.03 | 2.8 | no clear effect |  |
| 168 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.03 ± 0.08 | −0.02 | +0.09 | 4.4 | no clear effect |  |
| 169 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 170 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.03 ± 0.01 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 171 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 172 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.03 ± 0.05 | +0.04 | +0.02 | 0.4 | no clear effect |  |
| 173 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.03 ± 0.03 | +0.04 | +0.02 | 2.0 | no clear effect |  |
| 174 | Unbreaking Castle | 10 | Class | — | effect | +0.03 ± 0.05 | −0.03 | +0.09 | 6.0 | no clear effect | with a weapon and a shield |
| 175 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.3 | no clear effect |  |
| 176 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 177 | Reversing Charge | 8 | Class | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 178 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.04 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 179 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.03 ± 0.05 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 180 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.01 | +0.04 | +0.02 | 1.7 | no clear effect |  |
| 181 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 182 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 183 | Head Stomp | 4 | Class | rogue | Strike activity | +0.03 ± 0.03 | +0.07 | −0.01 | 5.1 | no clear effect |  |
| 184 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.05 | +0.01 | 1.2 | no clear effect |  |
| 185 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 186 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.03 ± 0.04 | +0.13 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 187 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.03 ± 0.02 | +0.05 | +0.01 | 0.1 | no clear effect | with a weapon and a shield |
| 188 | Megaton Strike | 4 | Class | inventor | Strike activity | +0.03 ± 0.10 | +0.10 | −0.05 | 7.8 | no clear effect |  |
| 189 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 190 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 191 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 192 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 193 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Emotional Push | 2 | Class | bard | check | +0.03 ± 0.04 | +0.15 | −0.10 | 3.0 | no clear effect |  |
| 195 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 196 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 197 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 198 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 199 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 200 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.08 | −0.04 | 2.9 | no clear effect |  |
| 201 | Pack Attack | 6 | Class | — | strike-extra | +0.02 ± 0.04 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 202 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 203 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.02 ± 0.03 | +0.05 | −0.00 | 2.7 | no clear effect |  |
| 204 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.02 ± 0.05 | +0.01 | +0.03 | 5.8 | no clear effect |  |
| 205 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.00 | +0.04 | 0.7 | no clear effect |  |
| 206 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | +0.02 ± 0.04 | +0.00 | +0.04 | 1.4 | no clear effect |  |
| 207 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.02 ± 0.05 | +0.10 | −0.06 | 4.2 | no clear effect |  |
| 208 | Feral Mending | 8 | Class | — | check | +0.02 ± 0.03 | +0.03 | +0.02 | 0.2 | no clear effect |  |
| 209 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 210 | Too Angry to Die | 12 | Skill | — | check | +0.02 ± 0.05 | +0.18 | −0.14 | 3.7 | no clear effect |  |
| 211 | Wind Caller | 8 | Class | druid | focus spell: Stormwind Flight (rank 4) | +0.02 ± 0.04 | +0.02 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 212 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 213 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 214 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 215 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 216 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 217 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 218 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.02 | +0.00 | +0.04 | 1.7 | no clear effect |  |
| 219 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | +0.02 ± 0.06 | +0.02 | +0.02 | 2.0 | no clear effect |  |
| 220 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 221 | Looming Gait | 5 | Ancestry | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 0.8 | no clear effect |  |
| 222 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 223 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.03 | +0.01 | 2.5 | no clear effect |  |
| 224 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Force of Nature | 16 | Class | — | fast-healing | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect |  |
| 226 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 227 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 228 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect |  |
| 229 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 230 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 231 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.02 | +0.08 | −0.05 | 0.2 | no clear effect |  |
| 232 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.06 | +0.09 | 7.7 | no clear effect | with two weapons (longsword and shortsword) |
| 233 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | focus spell: Dragon Breath (rank 4) | +0.01 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 234 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.01 ± 0.02 | +0.00 | +0.03 | 0.7 | no clear effect |  |
| 235 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.01 ± 0.01 | +0.00 | +0.03 | 0.9 | no clear effect | with a one-handed weapon and a free hand |
| 236 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 237 | Psi Burst | 2 | Class | psychic | save | +0.01 ± 0.04 | +0.02 | +0.00 | 5.8 | no clear effect |  |
| 238 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.01 ± 0.03 | +0.12 | −0.09 | 0.8 | no clear effect |  |
| 239 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 240 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.01 | +0.02 | 1.3 | no clear effect |  |
| 241 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.05 | −0.02 | 11.5 | no clear effect | with a one-handed weapon and a free hand |
| 242 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 243 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.05 | +0.02 | +0.00 | 1.6 | no clear effect | with two weapons (longsword and shortsword) |
| 244 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 245 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 246 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 247 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.04 | +0.02 | −0.00 | 3.5 | no clear effect |  |
| 248 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.01 ± 0.05 | +0.03 | −0.01 | 0.9 | no clear effect |  |
| 249 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | +0.01 ± 0.01 | +0.02 | −0.00 | 1.8 | no clear effect |  |
| 250 | Leading Dance | 4 | Class | swashbuckler | check | +0.01 ± 0.05 | +0.25 | −0.23 | 5.8 | no clear effect |  |
| 251 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.01 ± 0.01 | −0.00 | +0.02 | 2.3 | no clear effect |  |
| 252 | Vessel's Form | 16 | Class | — | check | +0.01 ± 0.03 | +0.05 | −0.03 | 0.2 | no clear effect |  |
| 253 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 254 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.01 | +0.01 | 1.7 | no clear effect |  |
| 255 | Gods' Palm | 8 | Class | — | Strike activity | +0.01 ± 0.02 | +0.04 | −0.02 | 3.2 | no clear effect |  |
| 256 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 257 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | +0.01 ± 0.03 | −0.01 | +0.03 | 2.6 | no clear effect |  |
| 258 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.01 ± 0.03 | +0.02 | +0.00 | 0.2 | no clear effect |  |
| 259 | Pit of Snakes | 13 | Ancestry | — | save | +0.01 ± 0.02 | +0.02 | −0.00 | 0.6 | no clear effect |  |
| 260 | It Was Me All Along! | 14 | Class | — | check | +0.01 ± 0.04 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 261 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.04 | −0.02 | 2.4 | no clear effect |  |
| 262 | Instant Recovery | 0 | Action | — | healing | +0.01 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 263 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.01 | −0.01 | +0.02 | 0.4 | no clear effect |  |
| 265 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 266 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Mineral Deposits | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 268 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Wings of Air | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 272 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 273 | Shadow Sight | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 274 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 275 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 276 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 277 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 278 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 279 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 280 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 281 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.01 ± 0.01 | +0.00 | +0.01 | 1.2 | no clear effect |  |
| 282 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 283 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 284 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 285 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 286 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 287 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Breath of Hungry Death | 16 | Class | — | save | +0.01 ± 0.04 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 289 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 290 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 291 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 292 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.01 ± 0.05 | +0.02 | −0.01 | 3.0 | no clear effect |  |
| 293 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.04 | +0.00 | +0.01 | 1.7 | no clear effect |  |
| 294 | Stasian Smash | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.07 | −0.06 | 3.3 | no clear effect |  |
| 295 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 296 | Driving Rain | 6 | Class | kineticist | save | +0.01 ± 0.09 | +0.08 | −0.07 | 4.1 | no clear effect |  |
| 297 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 298 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 299 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 301 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 302 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 303 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 304 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 305 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.06 | −0.06 | 1.0 | no clear effect |  |
| 306 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 307 | Start the Festival! | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 308 | Call the Swarm | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 309 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 310 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 311 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.00 ± 0.06 | −0.02 | +0.02 | 1.0 | no clear effect |  |
| 312 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 313 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 314 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 315 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 316 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 318 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 319 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 320 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 321 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 322 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 323 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 324 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 325 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 326 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 327 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 328 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 329 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 330 | Zealous Inevitability | 6 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 2.3 | no clear effect |  |
| 331 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 332 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.05 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 333 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 334 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 335 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 337 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 341 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 343 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 344 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.07 | −0.07 | 1.1 | no clear effect |  |
| 345 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 346 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 347 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 349 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 351 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 352 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 353 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.02 | +0.00 | +0.00 | 3.6 | no clear effect |  |
| 354 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 357 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 361 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 362 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 365 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 366 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 367 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 368 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 370 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 375 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 378 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 379 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 380 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 387 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 390 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 393 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 394 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 395 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 397 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 398 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 399 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 400 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 401 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 402 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 403 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 404 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 405 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 406 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 407 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 408 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 409 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 410 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 412 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 413 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 414 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 417 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 418 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 419 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 421 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 422 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 423 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 424 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 425 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 426 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 427 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 429 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 433 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 434 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 435 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 436 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 437 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 438 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 439 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 440 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 441 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 442 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 443 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 444 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 445 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 446 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 447 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 449 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 461 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 462 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 463 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 464 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 465 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 466 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 467 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 470 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 472 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 475 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 477 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 484 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 488 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 490 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 498 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 509 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 512 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 517 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 524 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 529 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 530 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 532 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 537 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 548 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 551 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 553 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 556 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 562 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 572 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 575 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 586 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 589 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 594 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Fade Into Daydreams | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Valkyrie's Charge | 0 | Action | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 600 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 604 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 609 | Flying Flame | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 612 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 613 | You Can't Keep Us Down | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 615 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 617 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 619 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 621 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 624 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Call to Battle | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 627 | Align Qi | 6 | Class | monk | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Self Destruct | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 630 | Hop Up | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 632 | Banner Twirl | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 633 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 634 | Cadence Call | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 636 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 637 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 638 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 639 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 641 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 642 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 643 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Heat Wave | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 645 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 648 | Even the Odds (Eagle Knight) | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 650 | Deific Font | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 651 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 652 | Daring Act | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 654 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 657 | Final Spite | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 658 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 661 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 663 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 664 | Extraplanar Haze | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 665 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 667 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 669 | Spark of Independence | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 670 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 671 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 672 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 674 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 675 | Kip Up | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 677 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 678 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 680 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 681 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 682 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 684 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 685 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 686 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Disarming Intercept | 6 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 688 | Now You See Me | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Get Used to Disappointment | 12 | Class | swashbuckler | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 691 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 693 | Reclaim Power | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Quick Root | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 696 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 697 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 698 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 699 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Waters of Creation | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 704 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 705 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 706 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 707 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 708 | Propelled Leap | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 709 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 713 | Statue | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 715 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 716 | Storm Shroud | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 718 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 722 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Spirit's Sacrifice | 18 | Class | animist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 726 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 727 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 729 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 730 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Tempo Shift | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Untamed Form | 1 | Class | druid | focus spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 738 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spell: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Asura Magic | 9 | Ancestry | — | innate spell: Blood Vendetta (rank 2), Death Knell (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 746 | Horn and Bone Incantation | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Humanoid Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Spiritual Echo | 9 | Ancestry | — | innate spell: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Plane Step | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Haft Striker Stance | 4 | Class | fighter | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Dread Marshal Stance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 756 | Blood Calls Blood | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 757 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Disengaging Twist | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Magical Adaptation | 10 | Class | — | innate spell: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Gaze of Veracity | 10 | Class | — | focus spell: Glimpse the Truth (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Hallowed Necromancer Dedication | 2 | Class | — | focus spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | Tumbling Opportunist | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Cultivator Dedication | 2 | Class | — | focus spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.1 | no clear effect |  |
| 773 | Bounce Boost | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Play Dead | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Dazing Blow | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 777 | Wildborn Adept | 5 | Ancestry | — | innate spell: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.3 | no clear effect |  |
| 779 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Dazzling Block | 10 | Class | magus | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Lore Seeker | 8 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 789 | Speaking Sky | 12 | Class | — | focus spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Sound Mirror | 6 | Class | — | innate spell: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Wind Jump | 10 | Class | monk | focus spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 801 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 808 | Conjurer's Countermeasure | 6 | Class | magus | focus spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 811 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 812 | Determined Lore Seeker | 12 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 813 | Soothing Ballad | 14 | Class | bard | focus spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 814 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 815 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 816 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 819 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 822 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Shield Wall | 6 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 830 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 832 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 834 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 840 | Witchwood Seed | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 841 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 843 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 844 | Flickering Twirl | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 846 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 848 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Nanite Shroud | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 851 | Pouncing Transformation | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 853 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 855 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 857 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 858 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Disciple of Shade | 6 | Class | — | focus spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 863 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 864 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Harmonize Self | 4 | Class | monk | focus spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Wings of the Dragon | 12 | Class | — | focus spell: Dragon Wings (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 879 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 881 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Body Barrier | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Song of Glorious Invocation | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 885 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 886 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 888 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 890 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Never! | 16 | Class | guardian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 900 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 902 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 905 | Shove Down | 6 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 907 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Bone Burst | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 910 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 911 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 914 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 918 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.1 | no clear effect |  |
| 923 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 924 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 925 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 927 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 928 | Shame the Sin | 5 | Ancestry | — | check | −0.00 ± 0.03 | −0.03 | +0.03 | 1.0 | no clear effect |  |
| 929 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 930 | Gift of the Hoard | 10 | Class | — | focus spell: Dragon Breath (rank 5) | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 931 | Tectonic Stomp | 10 | Class | — | save | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 932 | Dashing Strike | 12 | Class | fighter | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.7 | no clear effect |  |
| 933 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 934 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.00 ± 0.04 | −0.02 | +0.02 | 4.4 | no clear effect |  |
| 935 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.06 | +0.09 | −0.09 | 2.8 | no clear effect | with a one-handed weapon and a free hand |
| 936 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 937 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 938 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 939 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.03 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) (in Crane Stance) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 941 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 942 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 944 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 945 | Walk Through the Conflagration | 14 | Class | kineticist | save | −0.00 ± 0.04 | −0.00 | −0.00 | 0.4 | no clear effect |  |
| 946 | Furious Finish | 2 | Class | barbarian | Strike activity | −0.00 ± 0.03 | −0.05 | +0.04 | 1.3 | no clear effect |  |
| 947 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.05 | +0.12 | −0.13 | 2.4 | no clear effect |  |
| 948 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 949 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 950 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 951 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | +0.00 | −0.01 | 2.5 | no clear effect |  |
| 952 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 953 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 954 | You're an Embarrassment! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Heroic Defiance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Kaiju Defense Oath | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 960 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Such a Disgrace! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Push Back the Dead! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 965 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Ardent Armiger | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 968 | Loose Cannon | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 970 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 971 | Fiery Rebirth | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 973 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 974 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Reactive Striker | 4 | Class | — | Reactive Strike | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Irresistible Bloom | 17 | Ancestry | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 977 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.05 | +0.08 | −0.09 | 1.1 | no clear effect |  |
| 978 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 979 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 980 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a weapon and a shield |
| 981 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | −0.01 ± 0.06 | +0.07 | −0.09 | 1.0 | no clear effect |  |
| 982 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 983 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 984 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.05 | −0.04 | +0.03 | 1.0 | no clear effect |  |
| 985 | Bony Barrage | 4 | Class | — | focus spell: Bony Barrage (rank 2) | −0.01 ± 0.02 | −0.02 | +0.01 | 0.5 | no clear effect |  |
| 986 | Glacial Prison | 12 | Class | kineticist | save | −0.01 ± 0.08 | +0.01 | −0.02 | 3.1 | no clear effect |  |
| 987 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 988 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | −0.01 ± 0.02 | −0.00 | −0.01 | 0.5 | no clear effect |  |
| 989 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | −0.01 ± 0.02 | −0.03 | +0.02 | 0.3 | no clear effect |  |
| 990 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 991 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.02 | 4.2 | no clear effect |  |
| 992 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 993 | Calaca's Showstopper | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 994 | Masked Casting | 8 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | −0.00 | 3.2 | no clear effect |  |
| 995 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 996 | Convocation of Earth and Moon | 17 | Ancestry | — | save | −0.01 ± 0.04 | +0.04 | −0.06 | 1.0 | no clear effect |  |
| 997 | Exacting Strike | 1 | Class | fighter | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 998 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | −0.01 ± 0.06 | +0.11 | −0.13 | 1.0 | no clear effect |  |
| 999 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1000 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.09 | −0.05 | +0.03 | 4.2 | no clear effect |  |
| 1001 | Fungal Exhalation | 6 | Class | druid | focus spell: Fungal Exhalation (rank 3) | −0.01 ± 0.03 | −0.04 | +0.02 | 0.5 | no clear effect |  |
| 1002 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.01 ± 0.04 | −0.02 | −0.00 | 0.7 | no clear effect |  |
| 1003 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.01 ± 0.04 | −0.07 | +0.05 | 0.9 | no clear effect |  |
| 1004 | Death Drone | 0 | Action | — | save | −0.01 ± 0.05 | +0.02 | −0.04 | 1.4 | no clear effect |  |
| 1005 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.01 ± 0.04 | −0.00 | −0.02 | 6.8 | no clear effect |  |
| 1006 | Defiant Banner | 8 | Class | commander | effect | −0.01 ± 0.07 | −0.20 | +0.18 | 10.7 | no clear effect |  |
| 1007 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1008 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.01 ± 0.03 | −0.00 | −0.02 | 2.0 | no clear effect |  |
| 1009 | Hedge Prison | 6 | Class | druid | focus spell: Hedge Prison (rank 3) | −0.01 ± 0.02 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1011 | Felling Strike | 8 | Class | fighter | Strike activity | −0.01 ± 0.06 | −0.03 | +0.01 | 5.9 | no clear effect |  |
| 1012 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1013 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1014 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1015 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1016 | Hellbreaker Strike | 0 | Action | — | Strike activity | −0.01 ± 0.04 | +0.02 | −0.05 | 1.8 | no clear effect |  |
| 1017 | Pennant of Victory | 20 | Class | commander | effect | −0.01 ± 0.10 | −0.46 | +0.43 | 2.0 | no clear effect |  |
| 1018 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1019 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.01 ± 0.03 | −0.01 | −0.02 | 2.8 | no clear effect |  |
| 1020 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | −0.01 ± 0.06 | +0.03 | −0.05 | 4.1 | no clear effect |  |
| 1021 | Emit Defensive Odor | 1 | Ancestry | — | save | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1022 | Guide the Timeline | 6 | Class | — | effect | −0.01 ± 0.03 | −0.01 | −0.02 | 2.0 | no clear effect |  |
| 1023 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1024 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.02 ± 0.05 | +0.09 | −0.12 | 3.5 | no clear effect |  |
| 1025 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.02 ± 0.03 | +0.04 | −0.07 | 4.7 | no clear effect |  |
| 1026 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.02 ± 0.02 | −0.01 | −0.02 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1027 | Coordinated Charge | 12 | Class | — | Strike activity | −0.02 ± 0.03 | +0.01 | −0.04 | 1.7 | no clear effect |  |
| 1028 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.02 ± 0.09 | +0.23 | −0.27 | 4.9 | no clear effect |  |
| 1029 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.02 ± 0.04 | +0.00 | −0.04 | 1.8 | no clear effect |  |
| 1030 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1031 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.02 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Harrying Strike | 10 | Class | — | Strike activity | −0.02 ± 0.01 | −0.01 | −0.02 | 7.0 | no clear effect |  |
| 1033 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | −0.02 ± 0.04 | −0.06 | +0.02 | 1.0 | no clear effect |  |
| 1034 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.02 ± 0.02 | −0.01 | −0.02 | 3.1 | no clear effect |  |
| 1035 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1036 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1037 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.02 ± 0.02 | +0.02 | −0.06 | 0.3 | no clear effect |  |
| 1038 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.06 | 5.2 | no clear effect |  |
| 1039 | Invoke Disaster | 18 | Class | druid | focus spell: Storm Lord (rank 9) | −0.02 ± 0.04 | −0.04 | +0.00 | 0.2 | no clear effect |  |
| 1040 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1041 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.06 | −0.07 | +0.03 | 2.3 | no clear effect |  |
| 1042 | Bristle | 5 | Ancestry | — | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 3.2 | no clear effect |  |
| 1043 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1044 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1045 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1046 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1047 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.02 ± 0.04 | −0.06 | +0.01 | 3.0 | no clear effect |  |
| 1048 | Unleash the Blight | 10 | Class | — | save | −0.02 ± 0.02 | −0.03 | −0.02 | 0.6 | no clear effect |  |
| 1049 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1050 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | −0.02 ± 0.04 | +0.01 | −0.06 | 0.6 | no clear effect |  |
| 1051 | Brandish Authority | 18 | Class | — | check | −0.02 ± 0.07 | −0.01 | −0.04 | 3.0 | no clear effect |  |
| 1052 | To Me! | 18 | Class | — | Strike activity | −0.02 ± 0.03 | +0.00 | −0.05 | 2.4 | no clear effect |  |
| 1053 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.02 ± 0.05 | −0.01 | −0.03 | 3.0 | no clear effect | with a spear and a free hand |
| 1054 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | −0.02 ± 0.05 | −0.05 | +0.00 | 1.0 | no clear effect |  |
| 1055 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.02 ± 0.06 | −0.13 | +0.08 | 3.1 | no clear effect |  |
| 1056 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.06 | 2.0 | no clear effect |  |
| 1057 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1058 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.03 ± 0.03 | −0.02 | −0.03 | 1.5 | no clear effect |  |
| 1059 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.03 ± 0.04 | +0.05 | −0.11 | 1.8 | no clear effect |  |
| 1060 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.03 ± 0.06 | −0.02 | −0.04 | 2.0 | no clear effect |  |
| 1061 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.03 ± 0.06 | −0.11 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1062 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | −0.03 ± 0.02 | +0.02 | −0.07 | 0.6 | no clear effect |  |
| 1063 | Toppling Transformation | 6 | Class | druid | check | −0.03 ± 0.02 | −0.06 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1064 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.03 ± 0.04 | −0.04 | −0.02 | 1.0 | no clear effect |  |
| 1065 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.03 ± 0.06 | −0.03 | −0.03 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 1066 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.03 ± 0.03 | −0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1067 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | −0.03 ± 0.04 | −0.05 | −0.01 | 1.0 | no clear effect |  |
| 1068 | Frighten Undead | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1069 | Crossbow Terror | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1070 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.03 ± 0.03 | −0.03 | −0.03 | 0.8 | no clear effect |  |
| 1071 | Voice Cold as Death | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.05 | 3.2 | no clear effect |  |
| 1072 | Invoke the Crimson Oath | 8 | Class | — | focus spell: Invoke the Crimson Oath (rank 4) | −0.03 ± 0.05 | +0.02 | −0.08 | 0.9 | no clear effect |  |
| 1073 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | −0.03 ± 0.03 | +0.00 | −0.06 | 1.5 | no clear effect |  |
| 1074 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | −0.03 ± 0.03 | −0.01 | −0.06 | 0.5 | no clear effect |  |
| 1075 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | −0.03 ± 0.03 | −0.10 | +0.04 | 0.8 | no clear effect |  |
| 1076 | Roiling Mudslide | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.07 | 1.4 | no clear effect |  |
| 1077 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.03 ± 0.02 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 1078 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | −0.03 ± 0.02 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 1079 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.03 ± 0.03 | −0.11 | +0.04 | 0.8 | no clear effect |  |
| 1080 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.03 ± 0.02 | +0.05 | −0.11 | 0.7 | no clear effect |  |
| 1081 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.03 ± 0.03 | +0.02 | −0.09 | 2.2 | no clear effect |  |
| 1082 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | −0.03 ± 0.03 | −0.07 | +0.00 | 0.6 | no clear effect |  |
| 1083 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | −0.03 ± 0.02 | −0.02 | −0.05 | 0.6 | no clear effect |  |
| 1084 | Cleansing Light | 17 | Ancestry | — | check | −0.04 ± 0.05 | −0.02 | −0.05 | 1.0 | no clear effect |  |
| 1085 | Manifold Conduit | 12 | Class | — | focus spell: Entreat the Many (rank 6) | −0.04 ± 0.06 | −0.00 | −0.07 | 1.0 | no clear effect |  |
| 1086 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.00 | −0.07 | 1.5 | no clear effect |  |
| 1087 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | −0.04 ± 0.05 | −0.15 | +0.08 | 1.0 | no clear effect |  |
| 1088 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.04 ± 0.02 | −0.02 | −0.05 | 0.3 | no clear effect |  |
| 1089 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.04 ± 0.02 | −0.02 | −0.05 | 0.3 | no clear effect |  |
| 1090 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | −0.04 ± 0.03 | −0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1091 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.04 ± 0.02 | −0.04 | −0.04 | 1.5 | no clear effect |  |
| 1092 | Dread Mosquito Storm | 18 | Class | — | focus spell: Dread Mosquito Storm (rank 9) | −0.04 ± 0.01 | −0.07 | +0.00 | 0.5 | no clear effect |  |
| 1093 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.04 ± 0.05 | +0.09 | −0.16 | 1.0 | no clear effect |  |
| 1094 | Wither Away | 16 | Class | — | save | −0.04 ± 0.06 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 1095 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | −0.04 ± 0.04 | −0.00 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1096 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1097 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.04 ± 0.04 | −0.01 | −0.07 | 3.7 | no clear effect |  |
| 1098 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | −0.04 ± 0.02 | −0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1099 | Winter's Clutch | 1 | Class | kineticist | save | −0.04 ± 0.06 | −0.10 | +0.02 | 2.4 | no clear effect |  |
| 1100 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.04 ± 0.02 | −0.05 | −0.03 | 0.3 | no clear effect |  |
| 1101 | Gluttonous Feast | 0 | Action | — | save | −0.04 ± 0.04 | −0.07 | −0.01 | 1.0 | no clear effect |  |
| 1102 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.04 ± 0.05 | −0.04 | −0.05 | 2.3 | no clear effect |  |
| 1103 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | −0.04 ± 0.03 | −0.02 | −0.07 | 1.0 | no clear effect |  |
| 1104 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.04 ± 0.06 | −0.05 | −0.03 | 8.2 | no clear effect |  |
| 1105 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | −0.04 ± 0.06 | −0.06 | −0.02 | 1.0 | no clear effect |  |
| 1106 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1107 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1108 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1109 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.04 ± 0.07 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1110 | Bestial Snarling | 2 | Class | bard | check | −0.05 ± 0.04 | +0.01 | −0.10 | 5.3 | no clear effect |  |
| 1111 | Primadonna | 12 | Class | — | check | −0.05 ± 0.04 | −0.05 | −0.04 | 0.3 | no clear effect |  |
| 1112 | Irradiate | 6 | Class | — | save | −0.05 ± 0.02 | −0.06 | −0.03 | 0.1 | no clear effect |  |
| 1113 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.05 ± 0.05 | +0.02 | −0.12 | 1.0 | no clear effect |  |
| 1114 | Talmandor's Shout | 12 | Class | — | check | −0.05 ± 0.06 | −0.11 | +0.02 | 1.0 | no clear effect |  |
| 1115 | History of Violence | 14 | Class | — | Strike activity | −0.05 ± 0.06 | +0.01 | −0.11 | 1.0 | no clear effect |  |
| 1116 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.05 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1117 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | −0.05 ± 0.04 | −0.09 | −0.01 | 1.6 | no clear effect |  |
| 1118 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.08 | −0.02 | 0.8 | no clear effect |  |
| 1119 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1120 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1121 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.05 ± 0.04 | −0.10 | +0.00 | 1.0 | no clear effect |  |
| 1122 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.05 ± 0.05 | +0.03 | −0.12 | 1.0 | no clear effect |  |
| 1123 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.05 ± 0.04 | −0.02 | −0.08 | 1.0 | no clear effect |  |
| 1124 | Grudging Compliment | 7 | Skill | — | check | −0.05 ± 0.03 | −0.08 | −0.02 | 2.2 | no clear effect |  |
| 1125 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.05 | −0.07 | −0.03 | 1.0 | no clear effect |  |
| 1126 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | −0.05 ± 0.04 | +0.03 | −0.13 | 0.0 | no clear effect | the AI never used it |
| 1127 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | +0.01 | −0.12 | 1.5 | no clear effect |  |
| 1128 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.05 ± 0.03 | +0.00 | −0.10 | 1.0 | no clear effect |  |
| 1129 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.6 | hurts |  |
| 1130 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.11 | +0.00 | 1.0 | no clear effect |  |
| 1131 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.05 ± 0.06 | +0.13 | −0.23 | 7.7 | no clear effect |  |
| 1132 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1133 | Sapping Symbol | 12 | Class | cleric | check | −0.05 ± 0.05 | +0.04 | −0.14 | 3.0 | no clear effect |  |
| 1134 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.05 ± 0.03 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1135 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.08 | −0.02 | 1.6 | no clear effect |  |
| 1136 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | −0.05 ± 0.06 | −0.02 | −0.09 | 1.0 | no clear effect |  |
| 1137 | Scout's Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.1 | hurts |  |
| 1138 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | −0.05 ± 0.05 | −0.07 | −0.04 | 1.0 | no clear effect |  |
| 1139 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.05 ± 0.04 | +0.00 | −0.11 | 3.3 | no clear effect |  |
| 1140 | Ravenous Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1141 | Interpose | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1142 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.06 ± 0.03 | −0.03 | −0.08 | 0.8 | no clear effect |  |
| 1143 | Steal Time | 10 | Class | — | save | −0.06 ± 0.05 | +0.05 | −0.16 | 1.0 | no clear effect |  |
| 1144 | No Scar but This | 0 | Action | — | check | −0.06 ± 0.03 | −0.02 | −0.09 | 1.3 | no clear effect |  |
| 1145 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.13 | 2.0 | no clear effect |  |
| 1146 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1147 | Coordinated Distraction | 12 | Class | rogue | check | −0.06 ± 0.06 | +0.08 | −0.20 | 5.0 | no clear effect |  |
| 1148 | Deathly Scream | 2 | Class | — | focus spell: Deathly Scream (rank 1) | −0.06 ± 0.03 | −0.04 | −0.08 | 2.7 | no clear effect |  |
| 1149 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.06 ± 0.05 | −0.08 | −0.04 | 1.0 | no clear effect |  |
| 1150 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | −0.06 ± 0.05 | −0.08 | −0.04 | 0.9 | no clear effect |  |
| 1151 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.06 ± 0.04 | −0.07 | −0.05 | 1.0 | no clear effect |  |
| 1152 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | −0.06 ± 0.03 | −0.06 | −0.06 | 0.8 | hurts |  |
| 1153 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.06 ± 0.02 | −0.07 | −0.05 | 0.3 | hurts |  |
| 1154 | Lantern Strobe | 0 | Action | — | save | −0.06 ± 0.03 | −0.12 | −0.01 | 0.6 | hurts |  |
| 1155 | Form of the Beloved Mother | 17 | Ancestry | — | innate spell: Animal Form (rank 5), Slither (rank 5) | −0.06 ± 0.03 | −0.05 | −0.08 | 0.7 | no clear effect |  |
| 1156 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | −0.06 ± 0.04 | −0.15 | +0.02 | 1.0 | no clear effect |  |
| 1157 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | −0.06 ± 0.07 | +0.00 | −0.13 | 1.0 | no clear effect |  |
| 1158 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | −0.07 ± 0.07 | −0.18 | +0.05 | 1.0 | no clear effect | with a weapon and a shield |
| 1159 | Radiant Burst | 13 | Ancestry | — | save | −0.07 ± 0.04 | −0.11 | −0.02 | 1.0 | no clear effect |  |
| 1160 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.07 ± 0.07 | −0.04 | −0.09 | 1.0 | no clear effect |  |
| 1161 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.07 ± 0.04 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1162 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.07 ± 0.05 | −0.10 | −0.03 | 1.0 | no clear effect |  |
| 1163 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | −0.07 ± 0.03 | −0.11 | −0.03 | 1.2 | hurts |  |
| 1164 | Taste Blood | 5 | Ancestry | — | save | −0.07 ± 0.03 | −0.05 | −0.08 | 2.6 | hurts |  |
| 1165 | Necrotic Bomber | 4 | Class | — | focus spell: Necrotic Bomb (rank 2) | −0.07 ± 0.05 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1166 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.07 ± 0.03 | −0.09 | −0.05 | 1.0 | hurts |  |
| 1167 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.07 ± 0.04 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1168 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.07 ± 0.06 | +0.19 | −0.32 | 5.1 | no clear effect |  |
| 1169 | Decree of Execution | 18 | Class | — | save | −0.07 ± 0.03 | +0.00 | −0.14 | 1.0 | hurts |  |
| 1170 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1171 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1172 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.07 ± 0.05 | −0.10 | −0.04 | 1.0 | no clear effect |  |
| 1173 | Flash of Omnipresence | 14 | Class | — | save | −0.07 ± 0.06 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1174 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.07 ± 0.04 | −0.09 | −0.04 | 3.3 | no clear effect |  |
| 1175 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.07 ± 0.02 | −0.01 | −0.13 | 0.8 | hurts |  |
| 1176 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.07 ± 0.05 | −0.06 | −0.07 | 2.0 | no clear effect | with a one-handed weapon and a free hand |
| 1177 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.07 ± 0.04 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1178 | Puncture Flesh | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1179 | Grapple | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1180 | Herald's Strike | 20 | Class | — | save | −0.07 ± 0.07 | +0.05 | −0.19 | 3.3 | no clear effect |  |
| 1181 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1182 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1183 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.07 ± 0.04 | −0.05 | −0.09 | 2.0 | no clear effect |  |
| 1184 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.07 ± 0.07 | −0.10 | −0.05 | 3.2 | no clear effect |  |
| 1185 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.08 ± 0.06 | −0.07 | −0.08 | 1.0 | no clear effect |  |
| 1186 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.08 ± 0.06 | −0.24 | +0.09 | 2.0 | no clear effect |  |
| 1187 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.08 ± 0.05 | −0.04 | −0.11 | 5.9 | no clear effect |  |
| 1188 | Unending Emptiness | 14 | Class | — | focus spell: Darklight (rank 7) | −0.08 ± 0.04 | −0.05 | −0.10 | 0.8 | hurts |  |
| 1189 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | −0.08 ± 0.04 | −0.10 | −0.06 | 0.3 | hurts |  |
| 1190 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.05 | −0.09 | −0.06 | 2.1 | no clear effect |  |
| 1191 | Tremor | 1 | Class | kineticist | save | −0.08 ± 0.04 | −0.11 | −0.05 | 2.2 | no clear effect |  |
| 1192 | Belly Flop | 10 | Class | guardian | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 10.5 | no clear effect |  |
| 1193 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.08 ± 0.06 | −0.06 | −0.10 | 1.8 | no clear effect |  |
| 1194 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.08 ± 0.03 | −0.11 | −0.06 | 5.3 | hurts |  |
| 1195 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.08 ± 0.03 | +0.01 | −0.17 | 1.0 | hurts |  |
| 1196 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.08 ± 0.03 | +0.01 | −0.17 | 1.0 | hurts |  |
| 1197 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.08 ± 0.05 | −0.03 | −0.13 | 1.0 | no clear effect |  |
| 1198 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.08 ± 0.05 | −0.03 | −0.13 | 1.0 | no clear effect |  |
| 1199 | Fiendish Brand | 6 | Class | — | Strike activity | −0.08 ± 0.04 | −0.15 | −0.02 | 2.5 | hurts |  |
| 1200 | Warped Reflection | 1 | Ancestry | — | save | −0.08 ± 0.04 | −0.01 | −0.15 | 1.0 | hurts |  |
| 1201 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | −0.08 ± 0.04 | −0.15 | −0.01 | 2.2 | hurts |  |
| 1202 | Ultimatum of Liberation | 0 | Action | — | save | −0.08 ± 0.04 | −0.03 | −0.13 | 1.0 | hurts |  |
| 1203 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.08 ± 0.05 | −0.03 | −0.13 | 2.0 | no clear effect |  |
| 1204 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.08 ± 0.04 | −0.15 | −0.02 | 1.0 | hurts |  |
| 1205 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.09 ± 0.04 | −0.09 | −0.08 | 2.0 | no clear effect |  |
| 1206 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.09 ± 0.04 | −0.12 | −0.05 | 1.0 | no clear effect |  |
| 1207 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | −0.09 ± 0.05 | −0.14 | −0.03 | 2.0 | no clear effect |  |
| 1208 | Lead by Example | 8 | Class | — | Strike activity | −0.09 ± 0.04 | −0.04 | −0.13 | 6.8 | hurts |  |
| 1209 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.09 ± 0.07 | +0.12 | −0.29 | 1.0 | no clear effect |  |
| 1210 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.06 | −0.09 | −0.08 | 1.0 | no clear effect |  |
| 1211 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.09 ± 0.04 | −0.07 | −0.11 | 2.3 | hurts |  |
| 1212 | Hail of Splinters | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.11 | −0.07 | 0.5 | hurts |  |
| 1213 | Enervating Wail | 6 | Class | — | save | −0.09 ± 0.03 | −0.13 | −0.04 | 1.0 | hurts |  |
| 1214 | Alluring Performance | 9 | Ancestry | — | check | −0.09 ± 0.05 | −0.08 | −0.10 | 1.0 | no clear effect |  |
| 1215 | Waking Dream | 8 | Class | — | focus spell: Waking Dream (rank 4) | −0.09 ± 0.06 | −0.01 | −0.17 | 1.0 | no clear effect |  |
| 1216 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.09 ± 0.05 | −0.06 | −0.12 | 1.0 | no clear effect |  |
| 1217 | Evangelize | 7 | Skill | — | check | −0.09 ± 0.03 | −0.06 | −0.12 | 2.1 | hurts |  |
| 1218 | Threatening Pursuit | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1219 | Idol Threat | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1220 | Tidal Hands | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.13 | −0.05 | 0.8 | hurts |  |
| 1221 | Topple Foe | 10 | Class | — | check | −0.09 ± 0.04 | −0.01 | −0.18 | 4.6 | hurts |  |
| 1222 | Kneecap | 5 | Ancestry | — | Strike activity | −0.09 ± 0.02 | −0.08 | −0.11 | 5.8 | hurts |  |
| 1223 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spell: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1224 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1225 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.09 ± 0.05 | −0.10 | −0.09 | 3.1 | no clear effect |  |
| 1226 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | −0.09 ± 0.03 | −0.15 | −0.03 | 0.7 | hurts |  |
| 1227 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.09 ± 0.04 | −0.16 | −0.03 | 1.0 | hurts |  |
| 1228 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.09 ± 0.06 | −0.04 | −0.15 | 1.0 | no clear effect |  |
| 1229 | Flash Your Badge | 10 | Class | — | check | −0.09 ± 0.05 | −0.01 | −0.18 | 2.8 | no clear effect |  |
| 1230 | Offer Story | 0 | Action | — | effect | −0.09 ± 0.05 | −0.09 | −0.10 | 4.2 | no clear effect |  |
| 1231 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1232 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1233 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1234 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.10 ± 0.06 | +0.05 | −0.24 | 1.0 | no clear effect |  |
| 1235 | Mind Shards | 6 | Class | — | save | −0.10 ± 0.03 | −0.11 | −0.08 | 0.9 | hurts |  |
| 1236 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.10 ± 0.04 | −0.15 | −0.05 | 1.0 | hurts |  |
| 1237 | Frightening Power | 12 | Class | — | save | −0.10 ± 0.07 | −0.34 | +0.14 | 11.7 | no clear effect |  |
| 1238 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.10 ± 0.04 | −0.09 | −0.11 | 2.8 | hurts |  |
| 1239 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.10 ± 0.04 | −0.18 | −0.02 | 1.0 | hurts |  |
| 1240 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.04 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1241 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.10 ± 0.06 | −0.05 | −0.16 | 4.5 | no clear effect |  |
| 1242 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | −0.10 ± 0.03 | −0.16 | −0.05 | 0.3 | hurts |  |
| 1243 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.10 ± 0.03 | −0.10 | −0.11 | 1.3 | hurts |  |
| 1244 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.10 ± 0.05 | −0.09 | −0.12 | 1.0 | hurts |  |
| 1245 | Jotun's Grasp | 5 | Ancestry | — | check | −0.10 ± 0.03 | −0.16 | −0.05 | 2.1 | hurts |  |
| 1246 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1247 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1248 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1249 | Doom of Sailors | 17 | Ancestry | — | save | −0.11 ± 0.05 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1250 | Worm's Feast | 6 | Class | — | save | −0.11 ± 0.05 | −0.15 | −0.06 | 1.0 | hurts |  |
| 1251 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.11 ± 0.07 | −0.15 | −0.06 | 4.3 | no clear effect | with two weapons (longsword and shortsword) |
| 1252 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.11 ± 0.04 | −0.12 | −0.10 | 1.0 | hurts |  |
| 1253 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.11 ± 0.10 | +0.02 | −0.24 | 11.0 | no clear effect |  |
| 1254 | Boulder Roll | 5 | Ancestry | — | save | −0.11 ± 0.03 | −0.15 | −0.07 | 2.3 | hurts |  |
| 1255 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | −0.11 ± 0.04 | −0.02 | −0.20 | 2.1 | hurts |  |
| 1256 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1257 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1258 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1259 | Demoralize | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1260 | Haunting Visage | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1261 | Terrifying Croak | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1262 | Sudden Terror | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1263 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.11 ± 0.09 | −0.03 | −0.19 | 1.0 | no clear effect |  |
| 1264 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.05 | −0.07 | −0.15 | 2.2 | hurts |  |
| 1265 | Aerial Boomerang | 1 | Class | kineticist | save | −0.11 ± 0.05 | −0.18 | −0.05 | 2.2 | hurts |  |
| 1266 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.11 ± 0.05 | −0.11 | −0.12 | 2.1 | hurts |  |
| 1267 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1268 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.11 ± 0.06 | +0.01 | −0.23 | 3.9 | no clear effect |  |
| 1269 | Tears of Pearl | 9 | Ancestry | — | save | −0.11 ± 0.05 | −0.05 | −0.17 | 1.0 | hurts |  |
| 1270 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.11 ± 0.04 | −0.06 | −0.17 | 2.0 | hurts |  |
| 1271 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.11 ± 0.06 | −0.05 | −0.17 | 1.0 | no clear effect |  |
| 1272 | Tail Spin | 5 | Ancestry | — | check | −0.11 ± 0.03 | −0.13 | −0.10 | 2.3 | hurts |  |
| 1273 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.12 ± 0.07 | −0.12 | −0.11 | 2.9 | no clear effect |  |
| 1274 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.12 ± 0.05 | −0.07 | −0.16 | 1.0 | hurts |  |
| 1275 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.0 | hurts |  |
| 1276 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1277 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1278 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1279 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1280 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.12 ± 0.06 | −0.09 | −0.15 | 1.0 | no clear effect |  |
| 1281 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | −0.12 ± 0.07 | −0.01 | −0.23 | 7.6 | no clear effect |  |
| 1282 | Raise Symbol | 4 | Class | cleric | self effect | −0.12 ± 0.04 | −0.21 | −0.04 | 3.5 | hurts |  |
| 1283 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1284 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1285 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1286 | Friendly Nudge | 1 | Ancestry | — | check | −0.12 ± 0.03 | −0.13 | −0.12 | 0.8 | hurts |  |
| 1287 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | −0.12 ± 0.05 | −0.00 | −0.24 | 3.3 | hurts |  |
| 1288 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | −0.12 ± 0.06 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1289 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | −0.12 ± 0.05 | −0.11 | −0.13 | 1.0 | hurts |  |
| 1290 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.13 ± 0.06 | −0.04 | −0.22 | 4.2 | hurts |  |
| 1291 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.04 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1292 | Ferocious Gust | 9 | Ancestry | — | save | −0.13 ± 0.04 | −0.14 | −0.12 | 1.0 | hurts |  |
| 1293 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.13 ± 0.05 | −0.11 | −0.15 | 1.0 | hurts |  |
| 1294 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | −0.13 ± 0.05 | −0.11 | −0.15 | 1.0 | hurts |  |
| 1295 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.13 ± 0.04 | −0.16 | −0.10 | 1.7 | hurts |  |
| 1296 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.13 ± 0.04 | −0.05 | −0.22 | 2.3 | hurts |  |
| 1297 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.13 ± 0.06 | −0.13 | −0.14 | 4.7 | hurts |  |
| 1298 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.13 ± 0.04 | −0.11 | −0.15 | 2.0 | hurts |  |
| 1299 | Part the Veil | 0 | Action | — | check | −0.13 ± 0.05 | −0.12 | −0.15 | 1.0 | hurts |  |
| 1300 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.13 ± 0.04 | −0.24 | −0.03 | 5.7 | hurts |  |
| 1301 | Shove | 0 | Action | — | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.9 | hurts | with a one-handed weapon and a free hand |
| 1302 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.13 ± 0.04 | −0.18 | −0.09 | 1.0 | hurts |  |
| 1303 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.13 ± 0.05 | +0.02 | −0.29 | 0.0 | hurts | the AI never used it |
| 1304 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | −0.14 ± 0.04 | −0.21 | −0.06 | 1.0 | hurts |  |
| 1305 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.14 ± 0.05 | −0.07 | −0.20 | 2.8 | hurts |  |
| 1306 | Poisoner's Twist | 4 | Class | — | check | −0.14 ± 0.04 | −0.08 | −0.20 | 5.8 | hurts |  |
| 1307 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | −0.14 ± 0.06 | −0.00 | −0.27 | 1.0 | hurts |  |
| 1308 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.14 ± 0.05 | −0.12 | −0.16 | 1.5 | hurts |  |
| 1309 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | −0.14 ± 0.04 | −0.17 | −0.11 | 1.0 | hurts |  |
| 1310 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.14 ± 0.03 | −0.06 | −0.22 | 3.9 | hurts |  |
| 1311 | Dragonet Breath | 1 | Ancestry | — | save | −0.14 ± 0.03 | −0.23 | −0.05 | 0.7 | hurts |  |
| 1312 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.14 ± 0.07 | +0.07 | −0.35 | 2.7 | hurts |  |
| 1313 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.14 ± 0.06 | −0.14 | −0.14 | 4.0 | hurts |  |
| 1314 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | −0.14 ± 0.04 | −0.15 | −0.13 | 1.0 | hurts |  |
| 1315 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.14 ± 0.04 | −0.22 | −0.07 | 1.5 | hurts |  |
| 1316 | Flower Street Infamy | 11 | Skill | — | check | −0.14 ± 0.04 | −0.03 | −0.26 | 3.7 | hurts |  |
| 1317 | Stridulating Song | 0 | Action | — | save | −0.14 ± 0.04 | −0.10 | −0.18 | 1.0 | hurts |  |
| 1318 | Edict of Mortality | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1319 | Majestic Proclamation | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1320 | Walk the Plank | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1321 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.14 ± 0.03 | −0.15 | −0.14 | 1.0 | hurts |  |
| 1322 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | −0.15 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1323 | Disturbing Knowledge | 7 | Skill | — | check | −0.15 ± 0.04 | −0.13 | −0.17 | 2.4 | hurts |  |
| 1324 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1325 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 0.8 | hurts |  |
| 1326 | Kobold Breath | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1327 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.15 ± 0.04 | −0.18 | −0.11 | 2.4 | hurts |  |
| 1328 | Fleet Tempo | 4 | Class | — | effect | −0.15 ± 0.05 | −0.14 | −0.15 | 2.0 | hurts |  |
| 1329 | Jinx | 0 | Action | — | save | −0.15 ± 0.04 | −0.09 | −0.20 | 1.0 | hurts |  |
| 1330 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.15 ± 0.04 | −0.14 | −0.16 | 0.8 | hurts |  |
| 1331 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.15 ± 0.07 | −0.15 | −0.15 | 2.0 | hurts |  |
| 1332 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.15 ± 0.04 | −0.19 | −0.11 | 1.0 | hurts |  |
| 1333 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.15 ± 0.04 | −0.07 | −0.23 | 2.7 | hurts |  |
| 1334 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.15 ± 0.05 | −0.17 | −0.14 | 1.0 | hurts |  |
| 1335 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.16 ± 0.06 | −0.19 | −0.13 | 4.9 | hurts |  |
| 1336 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.02 | −0.29 | 1.0 | hurts |  |
| 1337 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1338 | Forceful Shot | 14 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 5.3 | hurts |  |
| 1339 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | −0.16 ± 0.05 | −0.15 | −0.16 | 2.7 | hurts |  |
| 1340 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1341 | Staggering Fire | 6 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 7.5 | hurts |  |
| 1342 | Drag Down | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1343 | Steal for the Depths | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1344 | Pistol Twirl | 2 | Class | gunslinger | check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.8 | hurts |  |
| 1345 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.16 ± 0.05 | −0.11 | −0.22 | 3.9 | hurts |  |
| 1346 | Bone Swarm | 17 | Ancestry | — | save | −0.16 ± 0.05 | −0.29 | −0.04 | 1.0 | hurts |  |
| 1347 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.16 ± 0.06 | +0.03 | −0.36 | 3.3 | hurts |  |
| 1348 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.16 ± 0.04 | −0.04 | −0.29 | 0.0 | hurts | the AI never used it |
| 1349 | Death of Hope | 17 | Ancestry | — | save | −0.17 ± 0.05 | −0.20 | −0.13 | 1.0 | hurts |  |
| 1350 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.17 ± 0.07 | −0.19 | −0.14 | 1.0 | hurts |  |
| 1351 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | −0.17 ± 0.06 | −0.09 | −0.24 | 20.5 | hurts |  |
| 1352 | Draconic Resilience | 4 | Class | — | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 6.0 | hurts |  |
| 1353 | Twin Parry | 4 | Class | fighter | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 2.8 | hurts |  |
| 1354 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1355 | Might of the Realm | 14 | Class | — | Strike activity | −0.17 ± 0.06 | −0.15 | −0.19 | 4.6 | hurts |  |
| 1356 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.17 ± 0.04 | −0.27 | −0.07 | 2.9 | hurts |  |
| 1357 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.17 ± 0.05 | −0.28 | −0.06 | 3.6 | hurts |  |
| 1358 | Draconic Fury | 4 | Class | — | save | −0.17 ± 0.04 | −0.27 | −0.07 | 1.5 | hurts |  |
| 1359 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.17 ± 0.05 | −0.17 | −0.17 | 1.0 | hurts |  |
| 1360 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.17 ± 0.05 | −0.19 | −0.16 | 2.0 | hurts |  |
| 1361 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.17 ± 0.07 | −0.09 | −0.25 | 4.2 | hurts |  |
| 1362 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.17 ± 0.04 | −0.12 | −0.22 | 1.6 | hurts |  |
| 1363 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.17 ± 0.04 | −0.18 | −0.16 | 2.9 | hurts |  |
| 1364 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.17 ± 0.05 | −0.22 | −0.13 | 1.6 | hurts |  |
| 1365 | Remember Their Names | 16 | Class | — | save | −0.17 ± 0.07 | −0.05 | −0.30 | 4.6 | hurts |  |
| 1366 | Raise Slabs | 0 | Action | — | save | −0.18 ± 0.05 | −0.13 | −0.22 | 1.0 | hurts |  |
| 1367 | Flensing Slice | 8 | Class | — | check | −0.18 ± 0.06 | +0.22 | −0.57 | 8.9 | hurts |  |
| 1368 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.18 ± 0.05 | −0.17 | −0.18 | 1.0 | hurts |  |
| 1369 | Slam Down | 4 | Class | fighter | Strike activity | −0.18 ± 0.05 | −0.29 | −0.06 | 2.7 | hurts |  |
| 1370 | Share Rage | 8 | Class | barbarian | effect | −0.18 ± 0.06 | +0.03 | −0.39 | 8.0 | hurts |  |
| 1371 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1372 | Agathion Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Calm (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1373 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1374 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.18 ± 0.03 | −0.28 | −0.08 | 2.5 | hurts |  |
| 1375 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1376 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1377 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1378 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1379 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1380 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1381 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1382 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | −0.18 ± 0.09 | −0.18 | −0.18 | 5.8 | no clear effect |  |
| 1383 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.19 ± 0.06 | −0.10 | −0.27 | 1.7 | hurts |  |
| 1384 | Electrogenesis | 6 | Class | — | save | −0.19 ± 0.05 | −0.22 | −0.15 | 1.0 | hurts |  |
| 1385 | Knockback Strike | 10 | Class | monk | Strike activity | −0.19 ± 0.05 | −0.20 | −0.17 | 4.2 | hurts |  |
| 1386 | Spirit's Wrath | 12 | Class | barbarian | check | −0.19 ± 0.08 | +0.03 | −0.41 | 10.3 | hurts |  |
| 1387 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.19 ± 0.05 | −0.28 | −0.09 | 1.0 | hurts |  |
| 1388 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.19 ± 0.05 | −0.27 | −0.11 | 1.0 | hurts |  |
| 1389 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.19 ± 0.04 | −0.24 | −0.13 | 1.0 | hurts |  |
| 1390 | Decree of War | 18 | Class | — | Strike activity | −0.19 ± 0.05 | −0.09 | −0.29 | 2.3 | hurts |  |
| 1391 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.19 ± 0.05 | −0.04 | −0.34 | 3.1 | hurts |  |
| 1392 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.19 ± 0.04 | −0.21 | −0.18 | 2.5 | hurts |  |
| 1393 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.11 | −0.28 | 1.9 | hurts |  |
| 1394 | Infernal Interference | 16 | Class | — | Strike activity | −0.20 ± 0.06 | −0.17 | −0.22 | 4.8 | hurts |  |
| 1395 | Subjugation | 16 | Class | — | save | −0.20 ± 0.06 | −0.08 | −0.31 | 3.0 | hurts |  |
| 1396 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.20 ± 0.06 | −0.10 | −0.29 | 4.4 | hurts | with a warhammer and a free hand |
| 1397 | Trip | 0 | Action | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 2.0 | hurts | with a one-handed weapon and a free hand |
| 1398 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.20 ± 0.08 | −0.02 | −0.37 | 3.3 | hurts |  |
| 1399 | Opportunistic Grapple | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.1 | hurts |  |
| 1400 | Submission Hold | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.0 | hurts |  |
| 1401 | Staff Sweep | 6 | Class | — | check | −0.20 ± 0.04 | −0.23 | −0.17 | 2.6 | hurts |  |
| 1402 | Archer's Aim | 8 | Class | — | Strike activity | −0.20 ± 0.06 | −0.26 | −0.14 | 7.2 | hurts |  |
| 1403 | Confusing Commands | 16 | Class | commander | save | −0.20 ± 0.10 | +0.10 | −0.51 | 4.5 | hurts |  |
| 1404 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.21 ± 0.05 | −0.24 | −0.17 | 2.1 | hurts |  |
| 1405 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.21 ± 0.07 | −0.10 | −0.31 | 10.2 | hurts |  |
| 1406 | Flinging Blow | 16 | Class | monk | Strike activity | −0.21 ± 0.10 | −0.00 | −0.42 | 6.3 | hurts |  |
| 1407 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.21 ± 0.05 | −0.32 | −0.10 | 1.0 | hurts |  |
| 1408 | Abrasive Drag | 12 | Class | — | check | −0.22 ± 0.06 | −0.07 | −0.36 | 3.8 | hurts |  |
| 1409 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1410 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1411 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.22 ± 0.06 | −0.37 | −0.06 | 2.7 | hurts |  |
| 1412 | Aldori Parry | 4 | Class | — | self effect | −0.22 ± 0.05 | −0.36 | −0.08 | 2.9 | hurts |  |
| 1413 | Fabricate Truth | 4 | Class | — | check | −0.22 ± 0.05 | −0.17 | −0.27 | 2.9 | hurts |  |
| 1414 | Weft and Warp | 16 | Class | — | Strike activity | −0.22 ± 0.05 | +0.02 | −0.46 | 2.8 | hurts |  |
| 1415 | The Dead Walk | 10 | Class | oracle | check | −0.23 ± 0.06 | −0.10 | −0.35 | 3.2 | hurts |  |
| 1416 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.23 ± 0.05 | −0.31 | −0.15 | 5.5 | hurts |  |
| 1417 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1418 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1419 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.23 ± 0.04 | −0.33 | −0.13 | 2.7 | hurts |  |
| 1420 | Warning Shot | 2 | Class | gunslinger | check | −0.23 ± 0.06 | −0.19 | −0.28 | 2.7 | hurts |  |
| 1421 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.23 ± 0.05 | −0.20 | −0.27 | 2.0 | hurts |  |
| 1422 | Primal Roar | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1423 | Threatening Approach | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1424 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.24 ± 0.05 | −0.28 | −0.20 | 2.1 | hurts |  |
| 1425 | Dirty Trick | 1 | Skill | — | check | −0.24 ± 0.04 | −0.07 | −0.41 | 1.6 | hurts |  |
| 1426 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.24 ± 0.05 | −0.26 | −0.22 | 2.1 | hurts |  |
| 1427 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.24 ± 0.05 | −0.25 | −0.23 | 2.1 | hurts |  |
| 1428 | Whirling Throw | 6 | Class | monk | check | −0.25 ± 0.05 | −0.19 | −0.30 | 6.6 | hurts |  |
| 1429 | Stranglehold | 9 | Ancestry | — | check | −0.25 ± 0.05 | −0.16 | −0.33 | 9.7 | hurts |  |
| 1430 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.25 ± 0.04 | −0.33 | −0.16 | 4.3 | hurts |  |
| 1431 | Reactive Tangle | 4 | Class | — | check | −0.25 ± 0.04 | −0.31 | −0.19 | 2.6 | hurts |  |
| 1432 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.25 ± 0.05 | −0.23 | −0.27 | 2.7 | hurts |  |
| 1433 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.25 ± 0.07 | −0.45 | −0.05 | 17.5 | hurts |  |
| 1434 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.25 ± 0.04 | −0.33 | −0.17 | 2.0 | hurts |  |
| 1435 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.25 ± 0.05 | −0.31 | −0.20 | 2.8 | hurts |  |
| 1436 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1437 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1438 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1439 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1440 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1441 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1442 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1443 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1444 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1445 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1446 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1447 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1448 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1449 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1450 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1451 | Catchy Tune | 5 | Ancestry | — | check | −0.26 ± 0.04 | −0.19 | −0.32 | 8.8 | hurts |  |
| 1452 | Clobber | 16 | Class | guardian | Strike activity | −0.26 ± 0.07 | −0.36 | −0.16 | 11.7 | hurts |  |
| 1453 | Sanguivolent Roots | 8 | Class | kineticist | save | −0.27 ± 0.11 | −0.51 | −0.03 | 5.6 | hurts |  |
| 1454 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.27 ± 0.05 | −0.41 | −0.13 | 1.0 | hurts |  |
| 1455 | Scorching Column | 1 | Class | kineticist | save | −0.27 ± 0.07 | −0.32 | −0.22 | 2.7 | hurts |  |
| 1456 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.27 ± 0.11 | −0.32 | −0.22 | 8.3 | hurts |  |
| 1457 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.27 ± 0.09 | −0.26 | −0.28 | 9.8 | hurts |  |
| 1458 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.27 ± 0.05 | −0.29 | −0.26 | 2.0 | hurts |  |
| 1459 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.28 ± 0.06 | −0.25 | −0.30 | 4.1 | hurts |  |
| 1460 | Grovel | 5 | Ancestry | — | check | −0.28 ± 0.04 | −0.23 | −0.32 | 6.1 | hurts |  |
| 1461 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.28 ± 0.07 | −0.29 | −0.27 | 4.5 | hurts |  |
| 1462 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1463 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.29 ± 0.06 | −0.39 | −0.18 | 3.0 | hurts |  |
| 1464 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.29 ± 0.05 | −0.27 | −0.31 | 3.5 | hurts |  |
| 1465 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.29 ± 0.06 | −0.25 | −0.33 | 2.1 | hurts |  |
| 1466 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.29 ± 0.06 | −0.14 | −0.44 | 7.5 | hurts |  |
| 1467 | Cry of Rebellion | 16 | Class | — | save | −0.29 ± 0.08 | −0.22 | −0.36 | 1.0 | hurts |  |
| 1468 | Spinebreaker | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1469 | Ensnaring Wrappings | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1470 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.29 ± 0.05 | −0.30 | −0.29 | 7.3 | hurts |  |
| 1471 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.29 ± 0.06 | −0.33 | −0.26 | 9.5 | hurts |  |
| 1472 | Armored Rebuff | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 4.5 | hurts |  |
| 1473 | Wing Shove | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 3.9 | hurts |  |
| 1474 | Distracting Spellstrike | 4 | Class | magus | check | −0.30 ± 0.07 | −0.33 | −0.27 | 1.9 | hurts |  |
| 1475 | Mesmerizing Gaze | 6 | Class | — | save | −0.30 ± 0.05 | −0.21 | −0.39 | 3.1 | hurts |  |
| 1476 | Running Tackle | 8 | Class | — | check | −0.30 ± 0.06 | −0.29 | −0.31 | 3.8 | hurts |  |
| 1477 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.30 ± 0.09 | −0.36 | −0.24 | 5.1 | hurts |  |
| 1478 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.30 ± 0.09 | −0.20 | −0.40 | 4.3 | hurts |  |
| 1479 | Launch Fireworks | 0 | Action | — | save | −0.30 ± 0.05 | −0.19 | −0.42 | 3.3 | hurts | with a one-handed weapon and a free hand |
| 1480 | Demolish Defenses | 18 | Class | guardian | save | −0.31 ± 0.06 | −0.44 | −0.17 | 5.1 | hurts |  |
| 1481 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1482 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1483 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1484 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1485 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.5 | hurts |  |
| 1486 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.31 ± 0.08 | −0.32 | −0.30 | 5.0 | hurts |  |
| 1487 | Wheeling Grab | 6 | Class | — | check | −0.32 ± 0.04 | −0.37 | −0.26 | 2.9 | hurts |  |
| 1488 | Putrefaction | 14 | Class | — | save | −0.32 ± 0.06 | −0.25 | −0.38 | 3.0 | hurts |  |
| 1489 | Stay Down! | 14 | Class | rogue | check | −0.32 ± 0.07 | −0.27 | −0.37 | 11.2 | hurts |  |
| 1490 | Parting Shot | 4 | Class | fighter | Strike activity | −0.32 ± 0.06 | −0.38 | −0.26 | 5.0 | hurts | with a bow in hand |
| 1491 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.32 ± 0.08 | −0.39 | −0.26 | 8.8 | hurts |  |
| 1492 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.32 ± 0.06 | −0.25 | −0.40 | 2.3 | hurts |  |
| 1493 | Exaltation Overwhelming | 18 | Class | — | save | −0.33 ± 0.06 | −0.30 | −0.35 | 2.9 | hurts |  |
| 1494 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1495 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1496 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1497 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1498 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1499 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1500 | Glimpse Vulnerability | 0 | Action | — | effect | −0.33 ± 0.05 | −0.05 | −0.60 | 6.0 | hurts |  |
| 1501 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.33 ± 0.05 | −0.37 | −0.29 | 3.9 | hurts |  |
| 1502 | Rising Hurricane | 6 | Class | kineticist | save | −0.33 ± 0.10 | −0.48 | −0.19 | 4.4 | hurts |  |
| 1503 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.33 ± 0.06 | −0.27 | −0.40 | 1.0 | hurts |  |
| 1504 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.34 ± 0.05 | −0.38 | −0.30 | 4.7 | hurts |  |
| 1505 | Sleeper Hold | 10 | Class | monk | check | −0.34 ± 0.08 | −0.49 | −0.20 | 6.0 | hurts |  |
| 1506 | Channeled Protection | 4 | Class | animist | effect | −0.37 ± 0.09 | −0.58 | −0.15 | 17.3 | hurts |  |
| 1507 | Raise the Walls | 0 | Action | — | effect | −0.37 ± 0.06 | −0.26 | −0.48 | 6.8 | hurts |  |
| 1508 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.37 ± 0.07 | −0.18 | −0.56 | 11.8 | hurts |  |
| 1509 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.37 ± 0.07 | −0.35 | −0.38 | 1.6 | hurts |  |
| 1510 | Protect the Royal Line | 16 | Class | — | check | −0.37 ± 0.06 | −0.44 | −0.31 | 5.4 | hurts |  |
| 1511 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.37 ± 0.05 | −0.47 | −0.28 | 4.1 | hurts |  |
| 1512 | Brain Drain | 8 | Class | psychic | save | −0.39 ± 0.05 | −0.59 | −0.19 | 3.2 | hurts |  |
| 1513 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.39 ± 0.06 | −0.58 | −0.20 | 5.2 | hurts |  |
| 1514 | Propulsive Leap | 10 | Class | — | save | −0.39 ± 0.06 | −0.37 | −0.42 | 10.3 | hurts |  |
| 1515 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.40 ± 0.06 | −0.41 | −0.38 | 0.0 | hurts | with a one-handed weapon and a free hand; the AI never used it |
| 1516 | Rend Mimicry | 4 | Class | — | check | −0.40 ± 0.05 | −0.36 | −0.43 | 5.9 | hurts |  |
| 1517 | Drive Back | 8 | Class | — | check | −0.40 ± 0.06 | −0.47 | −0.33 | 4.3 | hurts | with a weapon and a shield |
| 1518 | Whirling Knockdown | 14 | Class | — | check | −0.41 ± 0.06 | −0.29 | −0.52 | 5.6 | hurts |  |
| 1519 | Wing Bounce | 4 | Class | — | check | −0.41 ± 0.07 | −0.44 | −0.38 | 2.7 | hurts |  |
| 1520 | Sun Blade | 4 | Class | champion | focus spell: Sun Blade (rank 2) | −0.42 ± 0.07 | −0.44 | −0.40 | 2.0 | hurts |  |
| 1521 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.43 ± 0.07 | −0.31 | −0.55 | 22.0 | hurts |  |
| 1522 | Wing Buffet | 9 | Ancestry | — | check | −0.43 ± 0.05 | −0.58 | −0.28 | 4.4 | hurts |  |
| 1523 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.45 ± 0.06 | −0.54 | −0.36 | 4.3 | hurts |  |
| 1524 | Fearful Symmetry | 6 | Class | — | save | −0.46 ± 0.06 | −0.56 | −0.37 | 8.5 | hurts |  |
| 1525 | Hammer Quake | 14 | Class | — | check | −0.47 ± 0.07 | −0.24 | −0.69 | 4.2 | hurts |  |
| 1526 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.47 ± 0.05 | −0.48 | −0.46 | 3.1 | hurts |  |
| 1527 | Say That Again! | 6 | Skill | — | check | −0.49 ± 0.05 | −0.67 | −0.32 | 3.0 | hurts |  |
| 1528 | Repulse the Wicked | 6 | Class | — | check | −0.49 ± 0.05 | −0.67 | −0.32 | 3.0 | hurts |  |
| 1529 | Mixed Maneuver | 8 | Class | monk | check | −0.51 ± 0.08 | −0.61 | −0.42 | 5.4 | hurts |  |
| 1530 | Warped Constriction | 8 | Class | — | save | −0.52 ± 0.06 | −0.49 | −0.54 | 10.6 | hurts |  |
| 1531 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.52 ± 0.05 | −0.64 | −0.40 | 4.2 | hurts |  |
| 1532 | Tamper | 1 | Class | inventor | check | −0.54 ± 0.06 | −0.51 | −0.56 | 7.4 | hurts |  |
| 1533 | Twist the Knife | 6 | Class | rogue | check | −0.55 ± 0.06 | −0.44 | −0.67 | 8.9 | hurts |  |
| 1534 | Silk Bracelet | 6 | Class | inventor | save | −0.57 ± 0.10 | −0.42 | −0.72 | 4.3 | hurts |  |
| 1535 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −0.59 ± 0.07 | −0.41 | −0.77 | 5.8 | hurts |  |
| 1536 | Trample Mimicry | 10 | Class | — | save | −0.59 ± 0.06 | −0.72 | −0.46 | 3.8 | hurts |  |
| 1537 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.60 ± 0.06 | −0.57 | −0.62 | 18.3 | hurts |  |
| 1538 | Freeze It! | 9 | Ancestry | — | check | −0.60 ± 0.06 | −0.60 | −0.60 | 10.5 | hurts |  |
| 1539 | Catfolk Dance | 1 | Ancestry | — | check | −0.60 ± 0.07 | −0.49 | −0.71 | 8.4 | hurts |  |
| 1540 | Muckraking | 16 | Class | — | save | −0.61 ± 0.08 | −0.53 | −0.68 | 4.2 | hurts |  |
| 1541 | Flying Tackle | 4 | Class | guardian | check | −0.61 ± 0.08 | −0.76 | −0.46 | 3.4 | hurts |  |
| 1542 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.62 ± 0.06 | −0.59 | −0.64 | 6.7 | hurts |  |
| 1543 | Dazzling Bullet | 6 | Class | — | check | −0.67 ± 0.06 | −0.60 | −0.73 | 9.8 | hurts |  |
| 1544 | Wild Dance | 12 | Class | — | save | −0.67 ± 0.08 | −0.40 | −0.94 | 12.0 | hurts |  |
| 1545 | Perplex | 14 | Class | — | check | −0.67 ± 0.08 | −0.66 | −0.68 | 3.9 | hurts |  |
| 1546 | Prayer Attack | 14 | Class | — | check | −0.68 ± 0.09 | −0.46 | −0.91 | 16.6 | hurts |  |
| 1547 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.70 ± 0.07 | −0.88 | −0.52 | 13.2 | hurts |  |
| 1548 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.71 ± 0.08 | −0.61 | −0.80 | 14.4 | hurts |  |
| 1549 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.72 ± 0.07 | −0.64 | −0.79 | 5.7 | hurts |  |
| 1550 | Gossamer Blade | 4 | Class | — | check | −0.73 ± 0.06 | −0.74 | −0.73 | 7.8 | hurts |  |
| 1551 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.75 ± 0.06 | −0.88 | −0.61 | 8.8 | hurts |  |
| 1552 | Clear the Way | 6 | Class | — | check | −0.78 ± 0.07 | −1.03 | −0.52 | 3.7 | hurts |  |
| 1553 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.81 ± 0.07 | −0.96 | −0.66 | 28.7 | hurts |  |
| 1554 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.86 ± 0.08 | −0.97 | −0.75 | 10.5 | hurts | with a bow in hand |
| 1555 | One Moment till Glory | 0 | Action | — | effect | −0.87 ± 0.07 | −0.71 | −1.04 | 12.5 | hurts |  |
| 1556 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.89 ± 0.07 | −0.91 | −0.88 | 21.7 | hurts |  |
| 1557 | Dance of the Tiger | 9 | Ancestry | — | check | −0.90 ± 0.08 | −1.24 | −0.56 | 15.8 | hurts |  |
| 1558 | Flourishing Finish | 12 | Class | — | check | −0.92 ± 0.10 | −0.83 | −1.00 | 14.8 | hurts |  |
| 1559 | Peony's Flourish | 14 | Class | — | check | −0.98 ± 0.10 | −0.54 | −1.42 | 6.3 | hurts |  |
| 1560 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.00 ± 0.06 | +0.00 | −1.99 | 1.0 | hurts |  |
| 1561 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.00 ± 0.06 | +0.00 | −1.99 | 1.0 | hurts |  |
| 1562 | Purifying Breeze | 14 | Class | cleric | effect | −1.00 ± 0.09 | −1.15 | −0.85 | 16.7 | hurts |  |
| 1563 | Unbalancing Sweep | 12 | Class | barbarian | check | −1.00 ± 0.12 | −1.16 | −0.85 | 4.4 | hurts |  |
| 1564 | Scattering Charge | 12 | Class | guardian | check | −1.12 ± 0.11 | −1.26 | −0.99 | 4.6 | hurts |  |
| 1565 | Silencing Strike | 10 | Class | barbarian | save | −1.20 ± 0.10 | −1.73 | −0.67 | 17.0 | hurts |  |
| 1566 | Thrash | 8 | Class | barbarian | save | −1.26 ± 0.09 | −1.23 | −1.29 | 15.1 | hurts |  |
| 1567 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −1.45 ± 0.10 | −1.81 | −1.09 | 5.1 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 4161 |
| a timer with no rules a fight counts | 205 |
| a spell the engine doesn't cast | 170 |
| its requirement | 150 |
| a Strike with nothing more the simulator reads | 100 |
| an Effect with nothing a fight counts | 69 |
| a teleport | 68 |
| a roll whose results the simulator doesn't read | 58 |
| nothing a fight uses | 52 |
| its text has no Strike of its user's | 52 |
| a reaction's Strike | 31 |
| a spell the feat casts | 28 |
| a reroll | 23 |
| a passive's Effect on other creatures | 23 |
| a passive's roll with no action to use it | 21 |
| its requirement, which the PC doesn't meet | 19 |
| a reaction to "passive" | 18 |
| its Effect has nothing a fight counts | 18 |
| a passive's Effect posted by hand | 18 |
| a lasting area | 14 |
| a choice of ways the simulator doesn't play | 12 |
| a companion's Strike | 11 |
| a passive's Strike | 11 |
| a Focus or Mythic Point back | 10 |
| an Effect on another creature | 8 |
| damage still naming the character's data | 5 |
| a roll twice | 4 |
| a reaction to "strike" | 4 |
| a reaction to "aura" | 2 |
| a free's Strike | 2 |
| a reaction to "damaged" | 1 |
| a reaction to "hit-by" | 1 |
| a reaction to "own-strike" | 1 |
| its stance (Monastic Archer Stance): the feat module reads nothing for it | 1 |
| a target the simulator can't tell | 1 |
| its stance (Hampering Stance): a lasting area | 1 |
| its stance (Peafowl Stance): an Effect with nothing a fight counts | 1 |
| its stance (Wild Winds Stance), not in the packs | 1 |
| its stance (an elemental stance), not in the packs | 1 |
| effects the GM allows from the scenery | 1 |
