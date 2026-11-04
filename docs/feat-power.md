# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-04: 1650 feats and actions rated, 5293 not simulated, 6 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 131 an encounter here, all fights 745, no effect 472, precise 53, about zero 28 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1198
- hurts: 372
- good: 40
- minor: 21
- strong: 16
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
| 8 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 9 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 10 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 11 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 12 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 13 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 14 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 15 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 16 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 17 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 18 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 19 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 20 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.05 | +0.45 | +0.05 | 4.3 | good |  |
| 21 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 22 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 23 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 24 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 25 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.24 ± 0.06 | +0.35 | +0.12 | 3.7 | good |  |
| 26 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 27 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.35 | +0.11 | 0.0 | good | the AI never used it |
| 28 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 29 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 30 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.22 ± 0.05 | +0.33 | +0.12 | 1.0 | good |  |
| 31 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 32 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 33 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 34 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 35 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.19 ± 0.04 | +0.31 | +0.07 | 1.5 | good |  |
| 36 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 37 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 38 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 39 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 40 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |

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
| 8 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 9 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 10 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 11 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 12 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 13 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 14 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 15 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 16 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 17 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 18 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 19 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 20 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.05 | +0.45 | +0.05 | 4.3 | good |  |
| 21 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 22 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 23 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 24 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 25 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.24 ± 0.06 | +0.35 | +0.12 | 3.7 | good |  |
| 26 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 27 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.35 | +0.11 | 0.0 | good | the AI never used it |
| 28 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 29 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 30 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.22 ± 0.05 | +0.33 | +0.12 | 1.0 | good |  |
| 31 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 32 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 33 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 34 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 35 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.19 ± 0.04 | +0.31 | +0.07 | 1.5 | good |  |
| 36 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 37 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 38 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 39 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 40 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |
| 41 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 42 | Basic Mysteries | 4 | Class | — | Nudge the Scales: heals 10 (30 feet) | +0.17 ± 0.06 | +0.30 | +0.04 | 0.0 | good | the AI never used it |
| 43 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.16 ± 0.09 | +0.13 | +0.20 | 1.0 | no clear effect |  |
| 44 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.16 ± 0.07 | +0.23 | +0.09 | 0.0 | good | the AI never used it |
| 45 | Infernal Anguish | 8 | Class | — | check | +0.15 ± 0.06 | +0.44 | −0.14 | 9.1 | good |  |
| 46 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.04 | +0.19 | +0.10 | 1.3 | good |  |
| 47 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.15 ± 0.03 | +0.19 | +0.10 | 0.8 | good |  |
| 48 | Devastating Duelist | 18 | Class | — | Strike activity | +0.14 ± 0.04 | +0.19 | +0.10 | 4.1 | good |  |
| 49 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.14 ± 0.07 | +0.19 | +0.09 | 1.0 | good |  |
| 50 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.14 ± 0.07 | +0.13 | +0.16 | 5.2 | no clear effect | with two weapons (longsword and shortsword) |
| 51 | Recharging Flurry | 4 | Class | magus | 2 Strikes | +0.14 ± 0.08 | +0.22 | +0.06 | 2.5 | no clear effect | with two weapons (longsword and shortsword) |
| 52 | Ignite the Sun | 18 | Class | kineticist | save | +0.14 ± 0.07 | +0.19 | +0.09 | 5.2 | no clear effect |  |
| 53 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.14 ± 0.06 | +0.17 | +0.11 | 3.8 | good | with two weapons (longsword and shortsword) |
| 54 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.14 ± 0.07 | +0.01 | +0.26 | 4.2 | no clear effect |  |
| 55 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.04 | +0.10 | +0.17 | 0.0 | good | the AI never used it |
| 56 | Living Epic | 20 | Class | — | passive effect (always on) | +0.13 ± 0.03 | +0.13 | +0.13 | 1.0 | good | always on (its moment isn't checked) |
| 57 | Furious Grab | 12 | Class | barbarian | check | +0.13 ± 0.08 | +0.18 | +0.08 | 5.8 | no clear effect |  |
| 58 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.12 ± 0.07 | +0.20 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 59 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.12 ± 0.06 | +0.29 | −0.04 | 4.0 | good |  |
| 60 | Imprison Foe | 18 | Class | — | save | +0.12 ± 0.05 | +0.15 | +0.09 | 2.6 | good |  |
| 61 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.12 ± 0.07 | +0.16 | +0.08 | 4.8 | no clear effect | with two weapons (longsword and shortsword) |
| 62 | Osteo Armaments | 4 | Class | — | effect | +0.12 ± 0.05 | +0.05 | +0.19 | 2.0 | good |  |
| 63 | Forest's Heart | 16 | Class | animist | stance | +0.12 ± 0.07 | +0.28 | −0.05 | 1.0 | no clear effect |  |
| 64 | Merciless Rend | 10 | Class | summoner | check | +0.12 ± 0.05 | +0.16 | +0.07 | 3.6 | good |  |
| 65 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 66 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.11 ± 0.03 | +0.08 | +0.15 | 0.7 | good |  |
| 67 | Lava Leap | 4 | Class | kineticist | save | +0.11 ± 0.08 | +0.18 | +0.05 | 1.6 | no clear effect |  |
| 68 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.11 ± 0.03 | +0.20 | +0.02 | 0.3 | good |  |
| 69 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.11 ± 0.06 | +0.15 | +0.07 | 1.0 | no clear effect |  |
| 70 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.11 ± 0.06 | +0.20 | +0.02 | 3.3 | no clear effect |  |
| 71 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.11 ± 0.08 | +0.01 | +0.21 | 3.9 | no clear effect | with a loaded arquebus |
| 72 | Grievous Blow | 8 | Class | — | Strike activity | +0.11 ± 0.05 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 73 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 74 | Duo's Aim | 8 | Class | — | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 4.1 | no clear effect |  |
| 75 | Pierce the Eye | 16 | Class | — | save | +0.10 ± 0.07 | +0.23 | −0.02 | 3.7 | no clear effect | with a loaded arquebus |
| 76 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.04 | +0.21 | −0.01 | 3.5 | good |  |
| 77 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.10 ± 0.06 | +0.30 | −0.10 | 1.0 | no clear effect |  |
| 78 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 79 | Into the Fray | 8 | Class | — | 2 Strikes | +0.10 ± 0.05 | +0.20 | −0.00 | 3.4 | no clear effect | with a weapon and a shield |
| 80 | Do You Know Who I Am? | 12 | Class | — | check | +0.10 ± 0.06 | +0.13 | +0.06 | 1.0 | no clear effect |  |
| 81 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.10 ± 0.07 | +0.70 | −0.51 | 25.8 | no clear effect |  |
| 82 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 83 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.09 ± 0.05 | +0.16 | +0.02 | 1.0 | no clear effect |  |
| 84 | Reveal Machinations | 15 | Skill | — | check | +0.09 ± 0.04 | +0.10 | +0.08 | 1.0 | minor |  |
| 85 | Certain Strike | 10 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.14 | +0.04 | 7.4 | minor |  |
| 86 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.09 ± 0.05 | +0.04 | +0.13 | 5.2 | no clear effect |  |
| 87 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.12 | +0.05 | 3.2 | minor | with a one-handed weapon and a free hand |
| 88 | Seize | 14 | Class | — | check | +0.09 ± 0.06 | +0.17 | +0.01 | 7.2 | no clear effect |  |
| 89 | Rallying Banner | 8 | Class | commander | check | +0.09 ± 0.07 | +0.08 | +0.09 | 1.0 | no clear effect |  |
| 90 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 91 | Dirge of Doom | 6 | Class | bard | innate spell: Dirge of Doom (rank 3) | +0.09 ± 0.03 | +0.16 | +0.01 | 5.3 | minor |  |
| 92 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.08 ± 0.05 | +0.06 | +0.11 | 1.0 | no clear effect |  |
| 93 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 94 | Olethros's Decree | 17 | Ancestry | — | save | +0.08 ± 0.04 | +0.15 | +0.02 | 1.0 | minor |  |
| 95 | Apocalyptic Visions | 18 | Class | — | save | +0.08 ± 0.06 | +0.11 | +0.05 | 1.0 | no clear effect |  |
| 96 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.12 | 3.6 | no clear effect |  |
| 97 | Mythic Containment | 10 | Class | — | check | +0.08 ± 0.05 | +0.17 | −0.01 | 2.8 | no clear effect |  |
| 98 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.08 ± 0.03 | +0.14 | +0.02 | 2.1 | minor |  |
| 99 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.08 ± 0.06 | +0.10 | +0.06 | 5.5 | no clear effect |  |
| 100 | Rend Armor | 8 | Class | — | effect | +0.08 ± 0.05 | +0.37 | −0.21 | 7.2 | no clear effect |  |
| 101 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.07 ± 0.05 | +0.15 | +0.00 | 1.0 | no clear effect |  |
| 102 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.07 ± 0.04 | +0.11 | +0.04 | 4.2 | no clear effect |  |
| 103 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.07 ± 0.08 | +0.15 | −0.01 | 4.4 | no clear effect |  |
| 104 | Mana Detonation | 18 | Class | — | focus spell: Arcane Explosion (rank 9) | +0.07 ± 0.04 | +0.10 | +0.05 | 0.3 | no clear effect |  |
| 105 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.07 ± 0.02 | +0.11 | +0.03 | 0.2 | minor |  |
| 106 | Rain of Razors | 12 | Class | kineticist | save | +0.07 ± 0.07 | −0.04 | +0.19 | 1.6 | no clear effect |  |
| 107 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.07 ± 0.04 | +0.12 | +0.02 | 4.0 | no clear effect |  |
| 108 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.07 ± 0.05 | +0.02 | +0.12 | 1.0 | no clear effect |  |
| 109 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.04 | −0.06 | +0.21 | 0.1 | no clear effect |  |
| 110 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.07 ± 0.04 | +0.05 | +0.09 | 1.9 | no clear effect |  |
| 111 | Acknowledge Fan | 12 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.04 | 3.0 | no clear effect |  |
| 112 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.10 | +0.02 | 2.3 | minor | with a bow in hand |
| 113 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.06 ± 0.06 | +0.09 | +0.04 | 6.1 | no clear effect |  |
| 114 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.06 ± 0.07 | +0.05 | +0.07 | 1.0 | no clear effect |  |
| 115 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.06 ± 0.06 | +0.06 | +0.07 | 1.0 | no clear effect |  |
| 116 | Shadow's Web | 14 | Class | monk | focus spell: Shadow's Web (rank 7) | +0.06 ± 0.04 | +0.02 | +0.11 | 0.4 | no clear effect |  |
| 117 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 118 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 119 | Enchanting Shot | 8 | Class | — | Strike activity | +0.06 ± 0.06 | +0.13 | −0.00 | 3.2 | no clear effect |  |
| 120 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 2.9 | no clear effect |  |
| 121 | Boarding Assault | 0 | Action | — | Strike activity | +0.06 ± 0.03 | +0.03 | +0.09 | 1.6 | no clear effect |  |
| 122 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 123 | Second Sting | 12 | Class | ranger | Strike activity | +0.06 ± 0.06 | +0.04 | +0.08 | 8.1 | no clear effect | with two weapons (longsword and shortsword) |
| 124 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.06 ± 0.08 | +0.20 | −0.08 | 1.0 | no clear effect |  |
| 125 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 126 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.04 | +0.08 | +0.04 | 0.9 | no clear effect |  |
| 127 | Call Worm Spirit | 10 | Class | — | save | +0.06 ± 0.05 | +0.00 | +0.12 | 1.0 | no clear effect |  |
| 128 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.06 ± 0.06 | +0.19 | −0.08 | 4.4 | no clear effect |  |
| 129 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 130 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 131 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 132 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.05 ± 0.04 | +0.00 | +0.11 | 0.8 | no clear effect |  |
| 133 | Rallying Anthem | 4 | Class | bard | innate spell: Rallying Anthem (rank 2) | +0.05 ± 0.04 | +0.08 | +0.03 | 11.8 | no clear effect |  |
| 134 | Promise of Pain | 10 | Class | — | save | +0.05 ± 0.05 | +0.10 | +0.01 | 1.0 | no clear effect |  |
| 135 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.05 ± 0.07 | +0.06 | +0.05 | 1.0 | no clear effect |  |
| 136 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 137 | Ride the Tsunami | 18 | Class | kineticist | save | +0.05 ± 0.07 | −0.15 | +0.26 | 2.7 | no clear effect |  |
| 138 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | +0.05 ± 0.03 | +0.08 | +0.02 | 0.4 | no clear effect |  |
| 139 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 140 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.05 ± 0.02 | +0.03 | +0.07 | 0.5 | minor |  |
| 141 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.03 | 0.1 | minor |  |
| 142 | Advanced General Training | 13 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.05 ± 0.03 | +0.03 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 143 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 144 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 145 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.05 ± 0.03 | −0.00 | +0.10 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 146 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.05 ± 0.04 | +0.02 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 147 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | +0.05 ± 0.08 | +0.16 | −0.06 | 3.3 | no clear effect |  |
| 148 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | +0.05 ± 0.06 | +0.09 | +0.00 | 0.6 | no clear effect |  |
| 149 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.03 | +0.05 | +0.04 | 1.7 | no clear effect |  |
| 150 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 151 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 152 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 153 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.09 | 2.1 | no clear effect | with a loaded arquebus |
| 154 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.05 ± 0.03 | +0.02 | +0.07 | 0.2 | no clear effect |  |
| 155 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 156 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.04 ± 0.03 | +0.10 | −0.01 | 1.8 | no clear effect |  |
| 157 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 158 | Titan Swing | 2 | Class | — | Strike activity | +0.04 ± 0.03 | +0.16 | −0.08 | 2.6 | no clear effect |  |
| 159 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 160 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 161 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 162 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 163 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.04 ± 0.09 | +0.12 | −0.04 | 3.6 | no clear effect |  |
| 164 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 165 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 166 | All Shall End in Flames | 18 | Class | kineticist | save | +0.04 ± 0.05 | +0.06 | +0.02 | 0.8 | no clear effect |  |
| 167 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 168 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 169 | Social Purview | 4 | Class | — | Gladiator Dedication: passive effect (always on) | +0.04 ± 0.02 | +0.02 | +0.06 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 170 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.04 ± 0.05 | +0.08 | −0.00 | 1.0 | no clear effect |  |
| 171 | Goblin Jubilee Display | 10 | Class | — | Goblin Jubilee: save | +0.04 ± 0.04 | +0.03 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 172 | Set-Up Strike | 2 | Class | commander | Strike activity | +0.04 ± 0.05 | +0.11 | −0.03 | 2.6 | no clear effect |  |
| 173 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.04 ± 0.06 | +0.06 | +0.01 | 6.3 | no clear effect |  |
| 174 | Draw From the Land | 10 | Class | — | check | +0.04 ± 0.02 | +0.11 | −0.03 | 0.3 | no clear effect |  |
| 175 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 176 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.04 ± 0.05 | +0.09 | −0.02 | 3.5 | no clear effect |  |
| 177 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.04 ± 0.06 | +0.10 | −0.03 | 3.3 | no clear effect |  |
| 178 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.04 ± 0.04 | +0.04 | +0.03 | 2.8 | no clear effect |  |
| 179 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.03 ± 0.08 | −0.02 | +0.09 | 4.4 | no clear effect |  |
| 180 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 181 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.03 ± 0.01 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 182 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 183 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.03 ± 0.05 | +0.04 | +0.02 | 0.4 | no clear effect |  |
| 184 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.03 ± 0.03 | +0.04 | +0.02 | 2.0 | no clear effect |  |
| 185 | Unbreaking Castle | 10 | Class | — | effect | +0.03 ± 0.05 | −0.03 | +0.09 | 6.0 | no clear effect | with a weapon and a shield |
| 186 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.3 | no clear effect |  |
| 187 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 188 | Reversing Charge | 8 | Class | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 189 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.04 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 190 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.03 ± 0.05 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 191 | Martial Performance | 1 | Class | bard | innate spells: Courageous Anthem (rank 1), Rallying Anthem (rank 1), Song of Strength (rank 1) | +0.03 ± 0.03 | +0.06 | −0.00 | 2.7 | no clear effect |  |
| 192 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.01 | +0.04 | +0.02 | 1.7 | no clear effect |  |
| 193 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 194 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 195 | Head Stomp | 4 | Class | rogue | Strike activity | +0.03 ± 0.03 | +0.07 | −0.01 | 5.1 | no clear effect |  |
| 196 | Pirate Dedication | 2 | Class | — | Boarding Assault: Strike activity | +0.03 ± 0.04 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 197 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.05 | +0.01 | 1.2 | no clear effect |  |
| 198 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 199 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.03 ± 0.04 | +0.13 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 200 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.03 ± 0.02 | +0.05 | +0.01 | 0.1 | no clear effect | with a weapon and a shield |
| 201 | Megaton Strike | 4 | Class | inventor | Strike activity | +0.03 ± 0.10 | +0.10 | −0.05 | 7.8 | no clear effect |  |
| 202 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 203 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 204 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 205 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 206 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 207 | Emotional Push | 2 | Class | bard | check | +0.03 ± 0.04 | +0.15 | −0.10 | 3.0 | no clear effect |  |
| 208 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 209 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 210 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 211 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 212 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 213 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.08 | −0.04 | 2.9 | no clear effect |  |
| 214 | Pack Attack | 6 | Class | — | strike-extra | +0.02 ± 0.04 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 215 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 216 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.02 ± 0.03 | +0.05 | −0.00 | 2.7 | no clear effect |  |
| 217 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.02 ± 0.05 | +0.01 | +0.03 | 5.8 | no clear effect |  |
| 218 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.00 | +0.04 | 0.7 | no clear effect |  |
| 219 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | +0.02 ± 0.04 | +0.00 | +0.04 | 1.4 | no clear effect |  |
| 220 | General Training | 1 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.02 ± 0.03 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 221 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.02 ± 0.05 | +0.10 | −0.06 | 4.2 | no clear effect |  |
| 222 | Feral Mending | 8 | Class | — | check | +0.02 ± 0.03 | +0.03 | +0.02 | 0.2 | no clear effect |  |
| 223 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 224 | Too Angry to Die | 12 | Skill | — | check | +0.02 ± 0.05 | +0.18 | −0.14 | 3.7 | no clear effect |  |
| 225 | Wind Caller | 8 | Class | druid | focus spell: Stormwind Flight (rank 4) | +0.02 ± 0.04 | +0.02 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 226 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 227 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 228 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 229 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 230 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 231 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 232 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.02 | +0.00 | +0.04 | 1.7 | no clear effect |  |
| 233 | Torrent in the Blood | 6 | Class | kineticist | check | +0.02 ± 0.08 | +0.21 | −0.17 | 3.0 | no clear effect |  |
| 234 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | +0.02 ± 0.06 | +0.02 | +0.02 | 2.0 | no clear effect |  |
| 235 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 236 | Looming Gait | 5 | Ancestry | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 0.8 | no clear effect |  |
| 237 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 238 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.03 | +0.01 | 2.5 | no clear effect |  |
| 239 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 240 | Force of Nature | 16 | Class | — | fast-healing | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect |  |
| 241 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 242 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 243 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect |  |
| 244 | Crushing Grab | 2 | Class | monk | Strength damage on a successful Grapple (always on) | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 245 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 246 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 247 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.02 | +0.08 | −0.05 | 0.2 | no clear effect |  |
| 248 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.06 | +0.09 | 7.7 | no clear effect | with two weapons (longsword and shortsword) |
| 249 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | focus spell: Dragon Breath (rank 4) | +0.01 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 250 | Jalmeri Heavenseeker Dedication | 4 | Class | — | Rain of Embers Stance: PF2e's stance Effect | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 251 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.01 ± 0.02 | +0.00 | +0.03 | 0.7 | no clear effect |  |
| 252 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.01 ± 0.01 | +0.00 | +0.03 | 0.9 | no clear effect | with a one-handed weapon and a free hand |
| 253 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 254 | Psi Burst | 2 | Class | psychic | save | +0.01 ± 0.04 | +0.02 | +0.00 | 5.8 | no clear effect |  |
| 255 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.01 ± 0.03 | +0.12 | −0.09 | 0.8 | no clear effect |  |
| 256 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 257 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.01 | +0.02 | 1.3 | no clear effect |  |
| 258 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.05 | −0.02 | 11.5 | no clear effect | with a one-handed weapon and a free hand |
| 259 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 260 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.05 | +0.02 | +0.00 | 1.6 | no clear effect | with two weapons (longsword and shortsword) |
| 261 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 262 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 263 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 264 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.04 | +0.02 | −0.00 | 3.5 | no clear effect |  |
| 265 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.01 ± 0.05 | +0.03 | −0.01 | 0.9 | no clear effect |  |
| 266 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | +0.01 ± 0.01 | +0.02 | −0.00 | 1.8 | no clear effect |  |
| 267 | Leading Dance | 4 | Class | swashbuckler | check | +0.01 ± 0.05 | +0.25 | −0.23 | 5.8 | no clear effect |  |
| 268 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.01 ± 0.01 | −0.00 | +0.02 | 2.3 | no clear effect |  |
| 269 | Vessel's Form | 16 | Class | — | check | +0.01 ± 0.03 | +0.05 | −0.03 | 0.2 | no clear effect |  |
| 270 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 271 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.01 | +0.01 | 1.7 | no clear effect |  |
| 272 | Gods' Palm | 8 | Class | — | Strike activity | +0.01 ± 0.02 | +0.04 | −0.02 | 3.2 | no clear effect |  |
| 273 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 274 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | +0.01 ± 0.03 | −0.01 | +0.03 | 2.6 | no clear effect |  |
| 275 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.01 ± 0.03 | +0.02 | +0.00 | 0.2 | no clear effect |  |
| 276 | Pit of Snakes | 13 | Ancestry | — | save | +0.01 ± 0.02 | +0.02 | −0.00 | 0.6 | no clear effect |  |
| 277 | It Was Me All Along! | 14 | Class | — | check | +0.01 ± 0.04 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 278 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.04 | −0.02 | 2.4 | no clear effect |  |
| 279 | Instant Recovery | 0 | Action | — | healing | +0.01 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 280 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 281 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.01 | −0.01 | +0.02 | 0.4 | no clear effect |  |
| 282 | Second Blessing | 8 | Class | champion | Blessed Swiftness: PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 283 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 284 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 285 | Mineral Deposits | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 286 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 287 | Wings of Air | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 289 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 290 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 291 | Shadow Sight | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 292 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 293 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 294 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 295 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 296 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 297 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 298 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 299 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.01 ± 0.01 | +0.00 | +0.01 | 1.2 | no clear effect |  |
| 300 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 301 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 302 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 303 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 304 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 305 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 306 | Breath of Hungry Death | 16 | Class | — | save | +0.01 ± 0.04 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 307 | The Harder They Fall (Kingmaker) | 8 | Class | ranger | bludgeoning damage on a successful Trip (always on) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 308 | Agonizing Rebuke | 5 | Ancestry | — | mental damage on a successful Demoralize (always on; once, not each turn) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 309 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 310 | Bolstered Recovery | 16 | Class | — | Instant Recovery: healing | +0.01 ± 0.03 | +0.05 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 311 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 312 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 313 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.01 ± 0.05 | +0.02 | −0.01 | 3.0 | no clear effect |  |
| 314 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.04 | +0.00 | +0.01 | 1.7 | no clear effect |  |
| 315 | Stasian Smash | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.07 | −0.06 | 3.3 | no clear effect |  |
| 316 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 317 | Driving Rain | 6 | Class | kineticist | save | +0.01 ± 0.09 | +0.08 | −0.07 | 4.1 | no clear effect |  |
| 318 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 319 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 320 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 321 | Basic Death Dealing | 4 | Class | — | Deathly Scream: innate spell: Deathly Scream (rank 1) | +0.00 ± 0.04 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 322 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 323 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 324 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 325 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 326 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 327 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.06 | −0.06 | 1.0 | no clear effect |  |
| 328 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 329 | Start the Festival! | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 330 | Call the Swarm | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 331 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 332 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 333 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.00 ± 0.06 | −0.02 | +0.02 | 1.0 | no clear effect |  |
| 334 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 335 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 337 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 340 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 341 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 343 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 344 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 345 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 346 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 351 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 352 | Zealous Inevitability | 6 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 2.3 | no clear effect |  |
| 353 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.05 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 355 | Brutal Bully | 6 | Class | barbarian | Strength damage on a successful maneuver (always on; raging not checked) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 357 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 361 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 362 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 363 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 365 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 366 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 367 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.07 | −0.07 | 1.1 | no clear effect |  |
| 368 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 369 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 372 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 375 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 376 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.02 | +0.00 | +0.00 | 3.6 | no clear effect |  |
| 377 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 378 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 379 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 380 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 386 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 387 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 390 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 391 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 393 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 394 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 400 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 401 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 403 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 405 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 407 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 410 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 411 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 413 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 414 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 416 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 417 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 418 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 420 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 421 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 422 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 423 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 424 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 425 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 426 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 427 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 428 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 429 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 430 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 431 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 432 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 433 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 435 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 436 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 437 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 439 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 440 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 441 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 442 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 443 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 444 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 445 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 446 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 447 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 448 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 449 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 450 | Anthemic Performance | 8 | Class | — | innate spell: Courageous Anthem (rank 4) | +0.00 ± 0.03 | −0.02 | +0.02 | 3.3 | no clear effect |  |
| 451 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 457 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 458 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 459 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 460 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 462 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 463 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 464 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 465 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 466 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 467 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 468 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 469 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 470 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 475 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 485 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 486 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 496 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 499 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 501 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 508 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 509 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 512 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 514 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 517 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 522 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 532 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 537 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 541 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 548 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 553 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 554 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 556 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 572 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 575 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 580 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 586 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 594 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 600 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 612 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 613 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 618 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 619 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Fade Into Daydreams | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 621 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | Valkyrie's Charge | 0 | Action | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 624 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 627 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 628 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 630 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 632 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 633 | Flying Flame | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 634 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 636 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 637 | You Can't Keep Us Down | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 638 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 639 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 641 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 642 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 643 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 645 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 648 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Call to Battle | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 650 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 651 | Align Qi | 6 | Class | monk | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 652 | Self Destruct | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 654 | Hop Up | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Banner Twirl | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 658 | Cadence Call | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 661 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 663 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 664 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 665 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Heat Wave | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 669 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 670 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 671 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 672 | Even the Odds (Eagle Knight) | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 674 | Deific Font | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 675 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Daring Act | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 677 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 678 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 680 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 681 | Final Spite | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 682 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 684 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 685 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 686 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 688 | Extraplanar Haze | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 691 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 693 | Spark of Independence | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 696 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 697 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 698 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 699 | Kip Up | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 702 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 704 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 705 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 706 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 707 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 708 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 709 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Disarming Intercept | 6 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Now You See Me | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 713 | Get Used to Disappointment | 12 | Class | swashbuckler | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 715 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Reclaim Power | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 718 | Quick Root | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 722 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 726 | Waters of Creation | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 727 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 729 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 730 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 731 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Propelled Leap | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Statue | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 738 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 739 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 740 | Storm Shroud | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 742 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 746 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Spirit's Sacrifice | 18 | Class | animist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 756 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 757 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Tempo Shift | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Untamed Form | 1 | Class | druid | focus spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spell: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Asura Magic | 9 | Ancestry | — | innate spell: Blood Vendetta (rank 2), Death Knell (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Horn and Bone Incantation | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Humanoid Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Spiritual Echo | 9 | Ancestry | — | innate spell: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Plane Step | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Haft Striker Stance | 4 | Class | fighter | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 779 | Dread Marshal Stance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Blood Calls Blood | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Disengaging Twist | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Magical Adaptation | 10 | Class | — | innate spell: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Gaze of Veracity | 10 | Class | — | focus spell: Glimpse the Truth (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 789 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Hallowed Necromancer Dedication | 2 | Class | — | focus spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Tumbling Opportunist | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Cultivator Dedication | 2 | Class | — | focus spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.1 | no clear effect |  |
| 797 | Bounce Boost | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Play Dead | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Dazing Blow | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 801 | Wildborn Adept | 5 | Ancestry | — | innate spell: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.3 | no clear effect |  |
| 803 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Dazzling Block | 10 | Class | magus | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 808 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 811 | Lore Seeker | 8 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 812 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 813 | Speaking Sky | 12 | Class | — | focus spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 814 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 815 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 816 | Sound Mirror | 6 | Class | — | innate spell: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 819 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 822 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Wind Jump | 10 | Class | monk | focus spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 830 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 832 | Conjurer's Countermeasure | 6 | Class | magus | focus spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 834 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Determined Lore Seeker | 12 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Soothing Ballad | 14 | Class | bard | focus spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 840 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 841 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 843 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 846 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 848 | Shield Wall | 6 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 851 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 853 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 855 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 857 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 858 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 864 | Witchwood Seed | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 868 | Flickering Twirl | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 870 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 872 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Nanite Shroud | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 875 | Pouncing Transformation | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 877 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 879 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Disciple of Shade | 6 | Class | — | focus spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 885 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 886 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 887 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 888 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 890 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Harmonize Self | 4 | Class | monk | focus spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Wings of the Dragon | 12 | Class | — | focus spell: Dragon Wings (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 903 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 905 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Body Barrier | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | Song of Glorious Invocation | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 910 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 914 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Never! | 16 | Class | guardian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 918 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 923 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 924 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 925 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 926 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Shove Down | 6 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 931 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Bone Burst | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 934 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 935 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 936 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 939 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 941 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 942 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 945 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 946 | Brightness Seeker | 9 | Ancestry | — | Call Upon the Brightness: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 947 | Clawdancer Dedication | 2 | Class | — | Claw Stance: PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Three Clear Breaths | 6 | Class | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 949 | Living Vessel Dedication | 2 | Class | — | Entity's Resurgence: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Spellstriker | 4 | Class | — | Spellstrike: spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Celebrity Dedication | 2 | Class | — | Upstage: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 952 | Brinesoul | 1 | Ancestry | — | Salt Wound: save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 953 | Unbowed, Unbroken | 1 | Ancestry | — | Unwavering Resilience: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 954 | Uncanny Dodge | 10 | Class | — | Deny Advantage: passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Inspired Stratagem | 8 | Class | rogue | Inspired Stratagem: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | One Among the Masses | 14 | Class feature | — | Overawe Crowd: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Avenger of Lust | 14 | Class | — | Sorshen's Devotion: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Manipulate Realm | 14 | Class | — | Drain Realm: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Advanced Hallowed Spell | 8 | Class | — | innate spell: Life Siphon (rank 4), Eradicate Undeath (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 960 | Shake it Off | 2 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Banner's Inspiration | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Eidolon's Trample | 16 | Class | summoner | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Foretell Harm | 1 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Uplifting Overture | 2 | Class | bard | innate spell: Uplifting Overture (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 965 | Song of Strength | 2 | Class | bard | innate spell: Song of Strength (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Replenishment of War | 10 | Class | cleric | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 967 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 968 | Basic Dogma | 4 | Class | — | Resilient Mind: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 969 | Basic Wilding | 4 | Class | — | Untamed Form: innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 970 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Basic Shooting | 4 | Class | — | Hit the Dirt!: +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Manifold Modifications | 8 | Class | inventor | Harmonic Oscillator: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 973 | Basic Concoction | 4 | Class | — | Poison Resistance: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Basic Martial Magic | 4 | Class | — | Arcane Fists: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Basic Trickery | 4 | Class | — | Nimble Dodge: +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.1 | no clear effect |  |
| 977 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 978 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 979 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 980 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 981 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 982 | Shame the Sin | 5 | Ancestry | — | check | −0.00 ± 0.03 | −0.03 | +0.03 | 1.0 | no clear effect |  |
| 983 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 984 | Gift of the Hoard | 10 | Class | — | focus spell: Dragon Breath (rank 5) | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 985 | Tectonic Stomp | 10 | Class | — | save | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 986 | Dashing Strike | 12 | Class | fighter | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.7 | no clear effect |  |
| 987 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 988 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.00 ± 0.04 | −0.02 | +0.02 | 4.4 | no clear effect |  |
| 989 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.06 | +0.09 | −0.09 | 2.8 | no clear effect | with a one-handed weapon and a free hand |
| 990 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 991 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 992 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 993 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.03 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 994 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) (in Crane Stance) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 995 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 996 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 997 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 998 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 999 | Walk Through the Conflagration | 14 | Class | kineticist | save | −0.00 ± 0.04 | −0.00 | −0.00 | 0.4 | no clear effect |  |
| 1000 | Furious Finish | 2 | Class | barbarian | Strike activity | −0.00 ± 0.03 | −0.05 | +0.04 | 1.3 | no clear effect |  |
| 1001 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.05 | +0.12 | −0.13 | 2.4 | no clear effect |  |
| 1002 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1003 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1004 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1005 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | +0.00 | −0.01 | 2.5 | no clear effect |  |
| 1006 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 1007 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1008 | You're an Embarrassment! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1011 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Heroic Defiance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1013 | Kaiju Defense Oath | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1014 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1015 | Such a Disgrace! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1016 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1017 | Push Back the Dead! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1018 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1021 | Ardent Armiger | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1022 | Loose Cannon | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1023 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1024 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1025 | Fiery Rebirth | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1026 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1027 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1028 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Reactive Striker | 4 | Class | — | Reactive Strike | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Irresistible Bloom | 17 | Ancestry | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1031 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.05 | +0.08 | −0.09 | 1.1 | no clear effect |  |
| 1032 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1033 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 1034 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a weapon and a shield |
| 1035 | Chronomancer's Secrets | 8 | Class | — | innate spell: Stasis (rank 4), Path of Least Resistance (rank 4) | −0.01 ± 0.06 | +0.19 | −0.20 | 1.0 | no clear effect |  |
| 1036 | Punishing Shove | 1 | Class | guardian | damage on a successful Shove (always on) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1037 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | −0.01 ± 0.06 | +0.07 | −0.09 | 1.0 | no clear effect |  |
| 1038 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1039 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1040 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.05 | −0.04 | +0.03 | 1.0 | no clear effect |  |
| 1041 | Bony Barrage | 4 | Class | — | focus spell: Bony Barrage (rank 2) | −0.01 ± 0.02 | −0.02 | +0.01 | 0.5 | no clear effect |  |
| 1042 | Glacial Prison | 12 | Class | kineticist | save | −0.01 ± 0.08 | +0.01 | −0.02 | 3.1 | no clear effect |  |
| 1043 | Broken Chain Dedication | 12 | Class | — | Ultimatum of Liberation: save | −0.01 ± 0.05 | +0.09 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 1044 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 1045 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | −0.01 ± 0.02 | −0.00 | −0.01 | 0.5 | no clear effect |  |
| 1046 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | −0.01 ± 0.02 | −0.03 | +0.02 | 0.3 | no clear effect |  |
| 1047 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 1048 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.02 | 4.2 | no clear effect |  |
| 1049 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1050 | Calaca's Showstopper | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1051 | Masked Casting | 8 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | −0.00 | 3.2 | no clear effect |  |
| 1052 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1053 | Convocation of Earth and Moon | 17 | Ancestry | — | save | −0.01 ± 0.04 | +0.04 | −0.06 | 1.0 | no clear effect |  |
| 1054 | Exacting Strike | 1 | Class | fighter | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 1055 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | −0.01 ± 0.06 | +0.11 | −0.13 | 1.0 | no clear effect |  |
| 1056 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1057 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.09 | −0.05 | +0.03 | 4.2 | no clear effect |  |
| 1058 | Fungal Exhalation | 6 | Class | druid | focus spell: Fungal Exhalation (rank 3) | −0.01 ± 0.03 | −0.04 | +0.02 | 0.5 | no clear effect |  |
| 1059 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.01 ± 0.04 | −0.02 | −0.00 | 0.7 | no clear effect |  |
| 1060 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.01 ± 0.04 | −0.07 | +0.05 | 0.9 | no clear effect |  |
| 1061 | Death Drone | 0 | Action | — | save | −0.01 ± 0.05 | +0.02 | −0.04 | 1.4 | no clear effect |  |
| 1062 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.01 ± 0.04 | −0.00 | −0.02 | 6.8 | no clear effect |  |
| 1063 | Defiant Banner | 8 | Class | commander | effect | −0.01 ± 0.07 | −0.20 | +0.18 | 10.7 | no clear effect |  |
| 1064 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1065 | Basic Muse's Whispers | 4 | Class | — | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | −0.01 ± 0.05 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1066 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.01 ± 0.03 | −0.00 | −0.02 | 2.0 | no clear effect |  |
| 1067 | Basic Flair | 4 | Class | — | Unbalancing Finisher: Strike activity | −0.01 ± 0.03 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1068 | Hedge Prison | 6 | Class | druid | focus spell: Hedge Prison (rank 3) | −0.01 ± 0.02 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1069 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1070 | Felling Strike | 8 | Class | fighter | Strike activity | −0.01 ± 0.06 | −0.03 | +0.01 | 5.9 | no clear effect |  |
| 1071 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1072 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1073 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1074 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1075 | Hellbreaker Strike | 0 | Action | — | Strike activity | −0.01 ± 0.04 | +0.02 | −0.05 | 1.8 | no clear effect |  |
| 1076 | Pennant of Victory | 20 | Class | commander | effect | −0.01 ± 0.10 | −0.46 | +0.43 | 2.0 | no clear effect |  |
| 1077 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1078 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.01 ± 0.03 | −0.01 | −0.02 | 2.8 | no clear effect |  |
| 1079 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | −0.01 ± 0.06 | +0.03 | −0.05 | 4.1 | no clear effect |  |
| 1080 | Emit Defensive Odor | 1 | Ancestry | — | save | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1081 | Guide the Timeline | 6 | Class | — | effect | −0.01 ± 0.03 | −0.01 | −0.02 | 2.0 | no clear effect |  |
| 1082 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1083 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.02 ± 0.05 | +0.09 | −0.12 | 3.5 | no clear effect |  |
| 1084 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.02 ± 0.03 | +0.04 | −0.07 | 4.7 | no clear effect |  |
| 1085 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.02 ± 0.02 | −0.01 | −0.02 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1086 | Coordinated Charge | 12 | Class | — | Strike activity | −0.02 ± 0.03 | +0.01 | −0.04 | 1.7 | no clear effect |  |
| 1087 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.02 ± 0.09 | +0.23 | −0.27 | 4.9 | no clear effect |  |
| 1088 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.02 ± 0.04 | +0.00 | −0.04 | 1.8 | no clear effect |  |
| 1089 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1090 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.02 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1091 | Harrying Strike | 10 | Class | — | Strike activity | −0.02 ± 0.01 | −0.01 | −0.02 | 7.0 | no clear effect |  |
| 1092 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | −0.02 ± 0.04 | −0.06 | +0.02 | 1.0 | no clear effect |  |
| 1093 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.02 ± 0.02 | −0.01 | −0.02 | 3.1 | no clear effect |  |
| 1094 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1095 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1096 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.02 ± 0.02 | +0.02 | −0.06 | 0.3 | no clear effect |  |
| 1097 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.06 | 5.2 | no clear effect |  |
| 1098 | Invoke Disaster | 18 | Class | druid | focus spell: Storm Lord (rank 9) | −0.02 ± 0.04 | −0.04 | +0.00 | 0.2 | no clear effect |  |
| 1099 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1100 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.06 | −0.07 | +0.03 | 2.3 | no clear effect |  |
| 1101 | Bristle | 5 | Ancestry | — | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 3.2 | no clear effect |  |
| 1102 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1103 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1104 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1105 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1106 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.02 ± 0.04 | −0.06 | +0.01 | 3.0 | no clear effect |  |
| 1107 | Basic Thoughtform | 4 | Class | — | Psi Burst: save | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1108 | Unleash the Blight | 10 | Class | — | save | −0.02 ± 0.02 | −0.03 | −0.02 | 0.6 | no clear effect |  |
| 1109 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1110 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | −0.02 ± 0.04 | +0.01 | −0.06 | 0.6 | no clear effect |  |
| 1111 | Brandish Authority | 18 | Class | — | check | −0.02 ± 0.07 | −0.01 | −0.04 | 3.0 | no clear effect |  |
| 1112 | To Me! | 18 | Class | — | Strike activity | −0.02 ± 0.03 | +0.00 | −0.05 | 2.4 | no clear effect |  |
| 1113 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.02 ± 0.05 | −0.01 | −0.03 | 3.0 | no clear effect | with a spear and a free hand |
| 1114 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | −0.02 ± 0.05 | −0.05 | +0.00 | 1.0 | no clear effect |  |
| 1115 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.02 ± 0.06 | −0.13 | +0.08 | 3.1 | no clear effect |  |
| 1116 | Multitalented | 9 | Ancestry | — | Barbarian Dedication: Rage (+2 damage with its Greatsword) | −0.03 ± 0.05 | −0.10 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 1117 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.06 | 2.0 | no clear effect |  |
| 1118 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1119 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.03 ± 0.03 | −0.02 | −0.03 | 1.5 | no clear effect |  |
| 1120 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.03 ± 0.04 | +0.05 | −0.11 | 1.8 | no clear effect |  |
| 1121 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.03 ± 0.06 | −0.02 | −0.04 | 2.0 | no clear effect |  |
| 1122 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.03 ± 0.06 | −0.11 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1123 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | −0.03 ± 0.02 | +0.02 | −0.07 | 0.6 | no clear effect |  |
| 1124 | Toppling Transformation | 6 | Class | druid | check | −0.03 ± 0.02 | −0.06 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1125 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.03 ± 0.04 | −0.04 | −0.02 | 1.0 | no clear effect |  |
| 1126 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.03 ± 0.06 | −0.03 | −0.03 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 1127 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.03 ± 0.03 | −0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1128 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | −0.03 ± 0.04 | −0.05 | −0.01 | 1.0 | no clear effect |  |
| 1129 | Frighten Undead | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1130 | Crossbow Terror | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1131 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.03 ± 0.03 | −0.03 | −0.03 | 0.8 | no clear effect |  |
| 1132 | Voice Cold as Death | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.05 | 3.2 | no clear effect |  |
| 1133 | Invoke the Crimson Oath | 8 | Class | — | focus spell: Invoke the Crimson Oath (rank 4) | −0.03 ± 0.05 | +0.02 | −0.08 | 0.9 | no clear effect |  |
| 1134 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | −0.03 ± 0.03 | +0.00 | −0.06 | 1.5 | no clear effect |  |
| 1135 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | −0.03 ± 0.03 | −0.01 | −0.06 | 0.5 | no clear effect |  |
| 1136 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | −0.03 ± 0.03 | −0.10 | +0.04 | 0.8 | no clear effect |  |
| 1137 | Roiling Mudslide | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.07 | 1.4 | no clear effect |  |
| 1138 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.03 ± 0.02 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 1139 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | −0.03 ± 0.02 | −0.03 | −0.04 | 0.7 | no clear effect |  |
| 1140 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.03 ± 0.03 | −0.11 | +0.04 | 0.8 | no clear effect |  |
| 1141 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.03 ± 0.02 | +0.05 | −0.11 | 0.7 | no clear effect |  |
| 1142 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.03 ± 0.03 | +0.02 | −0.09 | 2.2 | no clear effect |  |
| 1143 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | −0.03 ± 0.03 | −0.07 | +0.00 | 0.6 | no clear effect |  |
| 1144 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | −0.03 ± 0.02 | −0.02 | −0.05 | 0.6 | no clear effect |  |
| 1145 | Cleansing Light | 17 | Ancestry | — | check | −0.04 ± 0.05 | −0.02 | −0.05 | 1.0 | no clear effect |  |
| 1146 | Manifold Conduit | 12 | Class | — | focus spell: Entreat the Many (rank 6) | −0.04 ± 0.06 | −0.00 | −0.07 | 1.0 | no clear effect |  |
| 1147 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.00 | −0.07 | 1.5 | no clear effect |  |
| 1148 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | −0.04 ± 0.05 | −0.15 | +0.08 | 1.0 | no clear effect |  |
| 1149 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.04 ± 0.02 | −0.02 | −0.05 | 0.3 | no clear effect |  |
| 1150 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.04 ± 0.02 | −0.02 | −0.05 | 0.3 | no clear effect |  |
| 1151 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | −0.04 ± 0.03 | −0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1152 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.04 ± 0.02 | −0.04 | −0.04 | 1.5 | no clear effect |  |
| 1153 | Dread Mosquito Storm | 18 | Class | — | focus spell: Dread Mosquito Storm (rank 9) | −0.04 ± 0.01 | −0.07 | +0.00 | 0.5 | no clear effect |  |
| 1154 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.04 ± 0.05 | +0.09 | −0.16 | 1.0 | no clear effect |  |
| 1155 | Wither Away | 16 | Class | — | save | −0.04 ± 0.06 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 1156 | Siren Song | 9 | Ancestry | — | inline save: 60-foot emanation, will (DC 25, 1/fight) | −0.04 ± 0.02 | −0.06 | −0.01 | 0.2 | no clear effect |  |
| 1157 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | −0.04 ± 0.04 | −0.00 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1158 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1159 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.04 ± 0.04 | −0.01 | −0.07 | 3.7 | no clear effect |  |
| 1160 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | −0.04 ± 0.02 | −0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Winter's Clutch | 1 | Class | kineticist | save | −0.04 ± 0.06 | −0.10 | +0.02 | 2.4 | no clear effect |  |
| 1162 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.04 ± 0.02 | −0.05 | −0.03 | 0.3 | no clear effect |  |
| 1163 | Gluttonous Feast | 0 | Action | — | save | −0.04 ± 0.04 | −0.07 | −0.01 | 1.0 | no clear effect |  |
| 1164 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.04 ± 0.05 | −0.04 | −0.05 | 2.3 | no clear effect |  |
| 1165 | Basic Arcana | 4 | Class | — | Reach Spell: reach copies of 9 spells | −0.04 ± 0.04 | −0.14 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1166 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | −0.04 ± 0.03 | −0.02 | −0.07 | 1.0 | no clear effect |  |
| 1167 | Basic Breakthrough | 4 | Class | — | Searing Restoration: heals 2d10 (touch) | −0.04 ± 0.07 | +0.01 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1168 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.04 ± 0.06 | −0.05 | −0.03 | 8.2 | no clear effect |  |
| 1169 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | −0.04 ± 0.06 | −0.06 | −0.02 | 1.0 | no clear effect |  |
| 1170 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1171 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1172 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1173 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.04 ± 0.07 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1174 | Bestial Snarling | 2 | Class | bard | check | −0.05 ± 0.04 | +0.01 | −0.10 | 5.3 | no clear effect |  |
| 1175 | Primadonna | 12 | Class | — | check | −0.05 ± 0.04 | −0.05 | −0.04 | 0.3 | no clear effect |  |
| 1176 | Irradiate | 6 | Class | — | save | −0.05 ± 0.02 | −0.06 | −0.03 | 0.1 | no clear effect |  |
| 1177 | Solidarity | 9 | Ancestry | — | heals 18 (touch, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.6 | no clear effect |  |
| 1178 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.05 ± 0.05 | +0.02 | −0.12 | 1.0 | no clear effect |  |
| 1179 | Talmandor's Shout | 12 | Class | — | check | −0.05 ± 0.06 | −0.11 | +0.02 | 1.0 | no clear effect |  |
| 1180 | History of Violence | 14 | Class | — | Strike activity | −0.05 ± 0.06 | +0.01 | −0.11 | 1.0 | no clear effect |  |
| 1181 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.05 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1182 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | −0.05 ± 0.04 | −0.09 | −0.01 | 1.6 | no clear effect |  |
| 1183 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.08 | −0.02 | 0.8 | no clear effect |  |
| 1184 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1185 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1186 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.05 ± 0.04 | −0.10 | +0.00 | 1.0 | no clear effect |  |
| 1187 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.05 ± 0.05 | +0.03 | −0.12 | 1.0 | no clear effect |  |
| 1188 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.05 ± 0.04 | −0.02 | −0.08 | 1.0 | no clear effect |  |
| 1189 | Grudging Compliment | 7 | Skill | — | check | −0.05 ± 0.03 | −0.08 | −0.02 | 2.2 | no clear effect |  |
| 1190 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.05 | −0.07 | −0.03 | 1.0 | no clear effect |  |
| 1191 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | −0.05 ± 0.04 | +0.03 | −0.13 | 0.0 | no clear effect | the AI never used it |
| 1192 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | +0.01 | −0.12 | 1.5 | no clear effect |  |
| 1193 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.05 ± 0.03 | +0.00 | −0.10 | 1.0 | no clear effect |  |
| 1194 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.6 | hurts |  |
| 1195 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.11 | +0.00 | 1.0 | no clear effect |  |
| 1196 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.05 ± 0.06 | +0.13 | −0.23 | 7.7 | no clear effect |  |
| 1197 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1198 | Sapping Symbol | 12 | Class | cleric | check | −0.05 ± 0.05 | +0.04 | −0.14 | 3.0 | no clear effect |  |
| 1199 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.05 ± 0.03 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1200 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.08 | −0.02 | 1.6 | no clear effect |  |
| 1201 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | −0.05 ± 0.06 | −0.02 | −0.09 | 1.0 | no clear effect |  |
| 1202 | Scout's Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.1 | hurts |  |
| 1203 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | −0.05 ± 0.05 | −0.07 | −0.04 | 1.0 | no clear effect |  |
| 1204 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.05 ± 0.04 | +0.00 | −0.11 | 3.3 | no clear effect |  |
| 1205 | Ravenous Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1206 | Interpose | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1207 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.06 ± 0.03 | −0.03 | −0.08 | 0.8 | no clear effect |  |
| 1208 | Steal Time | 10 | Class | — | save | −0.06 ± 0.05 | +0.05 | −0.16 | 1.0 | no clear effect |  |
| 1209 | No Scar but This | 0 | Action | — | check | −0.06 ± 0.03 | −0.02 | −0.09 | 1.3 | no clear effect |  |
| 1210 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.13 | 2.0 | no clear effect |  |
| 1211 | Moldersoul | 1 | Ancestry | — | Decompose: inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.06 ± 0.02 | −0.13 | +0.02 | 0.0 | hurts | the AI never used it |
| 1212 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1213 | Coordinated Distraction | 12 | Class | rogue | check | −0.06 ± 0.06 | +0.08 | −0.20 | 5.0 | no clear effect |  |
| 1214 | Deathly Scream | 2 | Class | — | focus spell: Deathly Scream (rank 1) | −0.06 ± 0.03 | −0.04 | −0.08 | 2.7 | no clear effect |  |
| 1215 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.06 ± 0.05 | −0.08 | −0.04 | 1.0 | no clear effect |  |
| 1216 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | −0.06 ± 0.05 | −0.08 | −0.04 | 0.9 | no clear effect |  |
| 1217 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.06 ± 0.04 | −0.07 | −0.05 | 1.0 | no clear effect |  |
| 1218 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | −0.06 ± 0.03 | −0.06 | −0.06 | 0.8 | hurts |  |
| 1219 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.06 ± 0.02 | −0.07 | −0.05 | 0.3 | hurts |  |
| 1220 | Lantern Strobe | 0 | Action | — | save | −0.06 ± 0.03 | −0.12 | −0.01 | 0.6 | hurts |  |
| 1221 | Form of the Beloved Mother | 17 | Ancestry | — | innate spell: Animal Form (rank 5), Slither (rank 5) | −0.06 ± 0.03 | −0.05 | −0.08 | 0.7 | no clear effect |  |
| 1222 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | −0.06 ± 0.04 | −0.15 | +0.02 | 1.0 | no clear effect |  |
| 1223 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | −0.06 ± 0.07 | +0.00 | −0.13 | 1.0 | no clear effect |  |
| 1224 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | −0.07 ± 0.07 | −0.18 | +0.05 | 1.0 | no clear effect | with a weapon and a shield |
| 1225 | Radiant Burst | 13 | Ancestry | — | save | −0.07 ± 0.04 | −0.11 | −0.02 | 1.0 | no clear effect |  |
| 1226 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.07 ± 0.07 | −0.04 | −0.09 | 1.0 | no clear effect |  |
| 1227 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.07 ± 0.04 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1228 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.07 ± 0.05 | −0.10 | −0.03 | 1.0 | no clear effect |  |
| 1229 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | −0.07 ± 0.03 | −0.11 | −0.03 | 1.2 | hurts |  |
| 1230 | Taste Blood | 5 | Ancestry | — | save | −0.07 ± 0.03 | −0.05 | −0.08 | 2.6 | hurts |  |
| 1231 | Necrotic Bomber | 4 | Class | — | focus spell: Necrotic Bomb (rank 2) | −0.07 ± 0.05 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1232 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.07 ± 0.03 | −0.09 | −0.05 | 1.0 | hurts |  |
| 1233 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.07 ± 0.04 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1234 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.07 ± 0.06 | +0.19 | −0.32 | 5.1 | no clear effect |  |
| 1235 | Decree of Execution | 18 | Class | — | save | −0.07 ± 0.03 | +0.00 | −0.14 | 1.0 | hurts |  |
| 1236 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1237 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1238 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.07 ± 0.05 | −0.10 | −0.04 | 1.0 | no clear effect |  |
| 1239 | Flash of Omnipresence | 14 | Class | — | save | −0.07 ± 0.06 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1240 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.07 ± 0.04 | −0.09 | −0.04 | 3.3 | no clear effect |  |
| 1241 | Campfire Chronicler Dedication | 2 | Class | — | Offer Story: effect | −0.07 ± 0.05 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1242 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.07 ± 0.02 | −0.01 | −0.13 | 0.8 | hurts |  |
| 1243 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.07 ± 0.05 | −0.06 | −0.07 | 2.0 | no clear effect | with a one-handed weapon and a free hand |
| 1244 | Soothing Pulse | 4 | Class | — | Administer Ambient Magic: check | −0.07 ± 0.04 | −0.11 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1245 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.07 ± 0.04 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1246 | Puncture Flesh | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1247 | Grapple | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1248 | Ostilli Host Dedication | 2 | Class | — | Repel Ambient Magic: PF2e's self Effect | −0.07 ± 0.05 | +0.01 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1249 | Herald's Strike | 20 | Class | — | save | −0.07 ± 0.07 | +0.05 | −0.19 | 3.3 | no clear effect |  |
| 1250 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1251 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1252 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.07 ± 0.04 | −0.05 | −0.09 | 2.0 | no clear effect |  |
| 1253 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.07 ± 0.07 | −0.10 | −0.05 | 3.2 | no clear effect |  |
| 1254 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.08 ± 0.06 | −0.07 | −0.08 | 1.0 | no clear effect |  |
| 1255 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.08 ± 0.06 | −0.24 | +0.09 | 2.0 | no clear effect |  |
| 1256 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.08 ± 0.05 | −0.04 | −0.11 | 5.9 | no clear effect |  |
| 1257 | Unending Emptiness | 14 | Class | — | focus spell: Darklight (rank 7) | −0.08 ± 0.04 | −0.05 | −0.10 | 0.8 | hurts |  |
| 1258 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | −0.08 ± 0.04 | −0.10 | −0.06 | 0.3 | hurts |  |
| 1259 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.05 | −0.09 | −0.06 | 2.1 | no clear effect |  |
| 1260 | Tremor | 1 | Class | kineticist | save | −0.08 ± 0.04 | −0.11 | −0.05 | 2.2 | no clear effect |  |
| 1261 | Belly Flop | 10 | Class | guardian | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 10.5 | no clear effect |  |
| 1262 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.08 ± 0.06 | −0.06 | −0.10 | 1.8 | no clear effect |  |
| 1263 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.08 ± 0.03 | −0.11 | −0.06 | 5.3 | hurts |  |
| 1264 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.08 ± 0.03 | +0.01 | −0.17 | 1.0 | hurts |  |
| 1265 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.08 ± 0.03 | +0.01 | −0.17 | 1.0 | hurts |  |
| 1266 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.08 ± 0.05 | −0.03 | −0.13 | 1.0 | no clear effect |  |
| 1267 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.08 ± 0.05 | −0.03 | −0.13 | 1.0 | no clear effect |  |
| 1268 | Fiendish Brand | 6 | Class | — | Strike activity | −0.08 ± 0.04 | −0.15 | −0.02 | 2.5 | hurts |  |
| 1269 | Warped Reflection | 1 | Ancestry | — | save | −0.08 ± 0.04 | −0.01 | −0.15 | 1.0 | hurts |  |
| 1270 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | −0.08 ± 0.04 | −0.15 | −0.01 | 2.2 | hurts |  |
| 1271 | Ultimatum of Liberation | 0 | Action | — | save | −0.08 ± 0.04 | −0.03 | −0.13 | 1.0 | hurts |  |
| 1272 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.08 ± 0.05 | −0.03 | −0.13 | 2.0 | no clear effect |  |
| 1273 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.08 ± 0.04 | −0.15 | −0.02 | 1.0 | hurts |  |
| 1274 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.09 ± 0.04 | −0.09 | −0.08 | 2.0 | no clear effect |  |
| 1275 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.09 ± 0.04 | −0.12 | −0.05 | 1.0 | no clear effect |  |
| 1276 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | −0.09 ± 0.05 | −0.14 | −0.03 | 2.0 | no clear effect |  |
| 1277 | Lead by Example | 8 | Class | — | Strike activity | −0.09 ± 0.04 | −0.04 | −0.13 | 6.8 | hurts |  |
| 1278 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.09 ± 0.07 | +0.12 | −0.29 | 1.0 | no clear effect |  |
| 1279 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.06 | −0.09 | −0.08 | 1.0 | no clear effect |  |
| 1280 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.09 ± 0.04 | −0.07 | −0.11 | 2.7 | hurts |  |
| 1281 | Greater Deathly Secrets | 10 | Class | — | innate spells: Malignant Sustenance (rank 4), Grasping Grave (rank 5) | −0.09 ± 0.05 | −0.09 | −0.08 | 1.5 | no clear effect |  |
| 1282 | Hail of Splinters | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.11 | −0.07 | 0.5 | hurts |  |
| 1283 | Enervating Wail | 6 | Class | — | save | −0.09 ± 0.03 | −0.13 | −0.04 | 1.0 | hurts |  |
| 1284 | Alluring Performance | 9 | Ancestry | — | check | −0.09 ± 0.05 | −0.08 | −0.10 | 1.0 | no clear effect |  |
| 1285 | Waking Dream | 8 | Class | — | focus spell: Waking Dream (rank 4) | −0.09 ± 0.06 | −0.01 | −0.17 | 1.0 | no clear effect |  |
| 1286 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.09 ± 0.05 | −0.06 | −0.12 | 1.0 | no clear effect |  |
| 1287 | Evangelize | 7 | Skill | — | check | −0.09 ± 0.03 | −0.06 | −0.12 | 2.1 | hurts |  |
| 1288 | Threatening Pursuit | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1289 | Idol Threat | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1290 | Starlit Sentinel Dedication | 2 | Class | — | Starlit Transformation: PF2e's self Effect | −0.09 ± 0.04 | +0.04 | −0.22 | 0.0 | hurts | the AI never used it |
| 1291 | Tidal Hands | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.13 | −0.05 | 0.8 | hurts |  |
| 1292 | Topple Foe | 10 | Class | — | check | −0.09 ± 0.04 | −0.01 | −0.18 | 4.6 | hurts |  |
| 1293 | Kneecap | 5 | Ancestry | — | Strike activity | −0.09 ± 0.02 | −0.08 | −0.11 | 5.8 | hurts |  |
| 1294 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spell: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1295 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1296 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.09 ± 0.05 | −0.10 | −0.09 | 3.1 | no clear effect |  |
| 1297 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | −0.09 ± 0.03 | −0.15 | −0.03 | 0.7 | hurts |  |
| 1298 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.09 ± 0.04 | −0.16 | −0.03 | 1.0 | hurts |  |
| 1299 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.09 ± 0.06 | −0.04 | −0.15 | 1.0 | no clear effect |  |
| 1300 | Flash Your Badge | 10 | Class | — | check | −0.09 ± 0.05 | −0.01 | −0.18 | 2.8 | no clear effect |  |
| 1301 | Offer Story | 0 | Action | — | effect | −0.09 ± 0.05 | −0.09 | −0.10 | 4.2 | no clear effect |  |
| 1302 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1303 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1304 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1305 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.10 ± 0.06 | +0.05 | −0.24 | 1.0 | no clear effect |  |
| 1306 | Mind Shards | 6 | Class | — | save | −0.10 ± 0.03 | −0.11 | −0.08 | 0.9 | hurts |  |
| 1307 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.10 ± 0.04 | −0.15 | −0.05 | 1.0 | hurts |  |
| 1308 | Disciple's Breath | 16 | Class | — | save | −0.10 ± 0.06 | −0.09 | −0.11 | 2.4 | no clear effect |  |
| 1309 | Frightening Power | 12 | Class | — | save | −0.10 ± 0.07 | −0.34 | +0.14 | 11.7 | no clear effect |  |
| 1310 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.10 ± 0.04 | −0.09 | −0.11 | 2.8 | hurts |  |
| 1311 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.10 ± 0.04 | −0.18 | −0.02 | 1.0 | hurts |  |
| 1312 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.04 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1313 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.10 ± 0.06 | −0.05 | −0.16 | 4.5 | no clear effect |  |
| 1314 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | −0.10 ± 0.03 | −0.16 | −0.05 | 0.3 | hurts |  |
| 1315 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.10 ± 0.03 | −0.10 | −0.11 | 1.3 | hurts |  |
| 1316 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.10 ± 0.05 | −0.09 | −0.12 | 1.0 | hurts |  |
| 1317 | Jotun's Grasp | 5 | Ancestry | — | check | −0.10 ± 0.03 | −0.16 | −0.05 | 2.1 | hurts |  |
| 1318 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1319 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1320 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | −0.10 ± 0.04 | −0.19 | −0.02 | 1.0 | hurts |  |
| 1321 | Doom of Sailors | 17 | Ancestry | — | save | −0.11 ± 0.05 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1322 | Wyldsinger | 4 | Class | — | innate spell: Menacing Lament (rank 2), Valiant Anthem (rank 2) | −0.11 ± 0.04 | −0.12 | −0.09 | 1.0 | hurts |  |
| 1323 | Worm's Feast | 6 | Class | — | save | −0.11 ± 0.05 | −0.15 | −0.06 | 1.0 | hurts |  |
| 1324 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.11 ± 0.07 | −0.15 | −0.06 | 4.3 | no clear effect | with two weapons (longsword and shortsword) |
| 1325 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.11 ± 0.04 | −0.12 | −0.10 | 1.0 | hurts |  |
| 1326 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.11 ± 0.10 | +0.02 | −0.24 | 11.0 | no clear effect |  |
| 1327 | Boulder Roll | 5 | Ancestry | — | save | −0.11 ± 0.03 | −0.15 | −0.07 | 2.3 | hurts |  |
| 1328 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | −0.11 ± 0.04 | −0.02 | −0.20 | 2.1 | hurts |  |
| 1329 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1330 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1331 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.11 ± 0.05 | −0.17 | −0.05 | 1.0 | hurts |  |
| 1332 | Demoralize | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1333 | Haunting Visage | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1334 | Terrifying Croak | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1335 | Sudden Terror | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1336 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.11 ± 0.09 | −0.03 | −0.19 | 1.0 | no clear effect |  |
| 1337 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.05 | −0.07 | −0.15 | 2.2 | hurts |  |
| 1338 | Aerial Boomerang | 1 | Class | kineticist | save | −0.11 ± 0.05 | −0.18 | −0.05 | 2.2 | hurts |  |
| 1339 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.11 ± 0.05 | −0.11 | −0.12 | 2.1 | hurts |  |
| 1340 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1341 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.11 ± 0.06 | +0.01 | −0.23 | 3.9 | no clear effect |  |
| 1342 | Tears of Pearl | 9 | Ancestry | — | save | −0.11 ± 0.05 | −0.05 | −0.17 | 1.0 | hurts |  |
| 1343 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.11 ± 0.04 | −0.06 | −0.17 | 2.0 | hurts |  |
| 1344 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.11 ± 0.06 | −0.05 | −0.17 | 1.0 | no clear effect |  |
| 1345 | Triple Time | 4 | Class | bard | innate spell: Triple Time (rank 2) | −0.11 ± 0.05 | −0.10 | −0.12 | 12.7 | hurts |  |
| 1346 | Tail Spin | 5 | Ancestry | — | check | −0.11 ± 0.03 | −0.13 | −0.10 | 2.3 | hurts |  |
| 1347 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.12 ± 0.07 | −0.12 | −0.11 | 2.9 | no clear effect |  |
| 1348 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.12 ± 0.05 | −0.07 | −0.16 | 1.0 | hurts |  |
| 1349 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.0 | hurts |  |
| 1350 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1351 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1352 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1353 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.12 ± 0.05 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1354 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.12 ± 0.06 | −0.09 | −0.15 | 1.0 | no clear effect |  |
| 1355 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | −0.12 ± 0.07 | −0.01 | −0.23 | 7.6 | no clear effect |  |
| 1356 | Raise Symbol | 4 | Class | cleric | self effect | −0.12 ± 0.04 | −0.21 | −0.04 | 3.5 | hurts |  |
| 1357 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1358 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1359 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1360 | Friendly Nudge | 1 | Ancestry | — | check | −0.12 ± 0.03 | −0.13 | −0.12 | 0.8 | hurts |  |
| 1361 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | −0.12 ± 0.05 | −0.00 | −0.24 | 3.3 | hurts |  |
| 1362 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | −0.12 ± 0.06 | −0.08 | −0.16 | 1.0 | hurts |  |
| 1363 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | −0.12 ± 0.05 | −0.11 | −0.13 | 1.0 | hurts |  |
| 1364 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.13 ± 0.06 | −0.04 | −0.22 | 4.2 | hurts |  |
| 1365 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.04 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1366 | Ferocious Gust | 9 | Ancestry | — | save | −0.13 ± 0.04 | −0.14 | −0.12 | 1.0 | hurts |  |
| 1367 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.13 ± 0.05 | −0.11 | −0.15 | 1.0 | hurts |  |
| 1368 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | −0.13 ± 0.05 | −0.11 | −0.15 | 1.0 | hurts |  |
| 1369 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.13 ± 0.04 | −0.16 | −0.10 | 1.7 | hurts |  |
| 1370 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.13 ± 0.04 | −0.05 | −0.22 | 2.3 | hurts |  |
| 1371 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.13 ± 0.06 | −0.13 | −0.14 | 4.7 | hurts |  |
| 1372 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.13 ± 0.04 | −0.11 | −0.15 | 2.0 | hurts |  |
| 1373 | Part the Veil | 0 | Action | — | check | −0.13 ± 0.05 | −0.12 | −0.15 | 1.0 | hurts |  |
| 1374 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.13 ± 0.04 | −0.24 | −0.03 | 5.7 | hurts |  |
| 1375 | Shove | 0 | Action | — | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.9 | hurts | with a one-handed weapon and a free hand |
| 1376 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.13 ± 0.04 | −0.18 | −0.09 | 1.0 | hurts |  |
| 1377 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.13 ± 0.05 | +0.02 | −0.29 | 0.0 | hurts | the AI never used it |
| 1378 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | −0.14 ± 0.04 | −0.21 | −0.06 | 1.0 | hurts |  |
| 1379 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.14 ± 0.05 | −0.07 | −0.20 | 2.8 | hurts |  |
| 1380 | Poisoner's Twist | 4 | Class | — | check | −0.14 ± 0.04 | −0.08 | −0.20 | 5.8 | hurts |  |
| 1381 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | −0.14 ± 0.06 | −0.00 | −0.27 | 1.0 | hurts |  |
| 1382 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.14 ± 0.05 | −0.12 | −0.16 | 1.5 | hurts |  |
| 1383 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | −0.14 ± 0.04 | −0.17 | −0.11 | 1.0 | hurts |  |
| 1384 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.14 ± 0.03 | −0.06 | −0.22 | 3.9 | hurts |  |
| 1385 | Dragonet Breath | 1 | Ancestry | — | save | −0.14 ± 0.03 | −0.23 | −0.05 | 0.7 | hurts |  |
| 1386 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.14 ± 0.07 | +0.07 | −0.35 | 2.7 | hurts |  |
| 1387 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.14 ± 0.06 | −0.14 | −0.14 | 4.0 | hurts |  |
| 1388 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | −0.14 ± 0.04 | −0.15 | −0.13 | 1.0 | hurts |  |
| 1389 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.14 ± 0.04 | −0.22 | −0.07 | 1.5 | hurts |  |
| 1390 | Flower Street Infamy | 11 | Skill | — | check | −0.14 ± 0.04 | −0.03 | −0.26 | 3.7 | hurts |  |
| 1391 | Stridulating Song | 0 | Action | — | save | −0.14 ± 0.04 | −0.10 | −0.18 | 1.0 | hurts |  |
| 1392 | Edict of Mortality | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1393 | Majestic Proclamation | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1394 | Walk the Plank | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1395 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.14 ± 0.03 | −0.15 | −0.14 | 1.0 | hurts |  |
| 1396 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | −0.15 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1397 | Disturbing Knowledge | 7 | Skill | — | check | −0.15 ± 0.04 | −0.13 | −0.17 | 2.4 | hurts |  |
| 1398 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1399 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 0.8 | hurts |  |
| 1400 | Kobold Breath | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1401 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.15 ± 0.04 | −0.18 | −0.11 | 2.4 | hurts |  |
| 1402 | Fleet Tempo | 4 | Class | — | effect | −0.15 ± 0.05 | −0.14 | −0.15 | 2.0 | hurts |  |
| 1403 | Sleepwalker Dedication | 4 | Class | — | Daydream Trance: PF2e's self Effect | −0.15 ± 0.06 | −0.28 | −0.02 | 0.0 | hurts | the AI never used it |
| 1404 | Jinx | 0 | Action | — | save | −0.15 ± 0.04 | −0.09 | −0.20 | 1.0 | hurts |  |
| 1405 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.15 ± 0.04 | −0.14 | −0.16 | 0.8 | hurts |  |
| 1406 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.15 ± 0.07 | −0.15 | −0.15 | 2.0 | hurts |  |
| 1407 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.15 ± 0.04 | −0.19 | −0.11 | 1.0 | hurts |  |
| 1408 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.15 ± 0.04 | −0.07 | −0.23 | 2.7 | hurts |  |
| 1409 | Avenger of Gluttony | 14 | Class | — | Gluttonous Feast: save | −0.15 ± 0.05 | −0.19 | −0.11 | 0.0 | hurts | the AI never used it |
| 1410 | Night's Glow | 6 | Class | — | innate spells: Moonbeam (rank 1), Zenith Star (rank 1) | −0.15 ± 0.05 | −0.17 | −0.14 | 1.0 | hurts |  |
| 1411 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.15 ± 0.05 | −0.17 | −0.14 | 1.0 | hurts |  |
| 1412 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.16 ± 0.06 | −0.19 | −0.13 | 4.9 | hurts |  |
| 1413 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.02 | −0.29 | 1.0 | hurts |  |
| 1414 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1415 | Forceful Shot | 14 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 5.3 | hurts |  |
| 1416 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | −0.16 ± 0.05 | −0.15 | −0.16 | 2.7 | hurts |  |
| 1417 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1418 | Staggering Fire | 6 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 7.5 | hurts |  |
| 1419 | Drag Down | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1420 | Steal for the Depths | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1421 | Pistol Twirl | 2 | Class | gunslinger | check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.8 | hurts |  |
| 1422 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.16 ± 0.05 | −0.11 | −0.22 | 3.9 | hurts |  |
| 1423 | Bone Swarm | 17 | Ancestry | — | save | −0.16 ± 0.05 | −0.29 | −0.04 | 1.0 | hurts |  |
| 1424 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.16 ± 0.06 | +0.03 | −0.36 | 3.3 | hurts |  |
| 1425 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.16 ± 0.04 | −0.04 | −0.29 | 0.0 | hurts | the AI never used it |
| 1426 | Death of Hope | 17 | Ancestry | — | save | −0.17 ± 0.05 | −0.20 | −0.13 | 1.0 | hurts |  |
| 1427 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.17 ± 0.07 | −0.19 | −0.14 | 1.0 | hurts |  |
| 1428 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | −0.17 ± 0.06 | −0.09 | −0.24 | 20.5 | hurts |  |
| 1429 | Draconic Resilience | 4 | Class | — | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 6.0 | hurts |  |
| 1430 | Twin Parry | 4 | Class | fighter | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 2.8 | hurts |  |
| 1431 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1432 | Might of the Realm | 14 | Class | — | Strike activity | −0.17 ± 0.06 | −0.15 | −0.19 | 4.6 | hurts |  |
| 1433 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.17 ± 0.04 | −0.27 | −0.07 | 2.9 | hurts |  |
| 1434 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.17 ± 0.05 | −0.28 | −0.06 | 3.6 | hurts |  |
| 1435 | Draconic Fury | 4 | Class | — | save | −0.17 ± 0.04 | −0.27 | −0.07 | 1.5 | hurts |  |
| 1436 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.17 ± 0.05 | −0.17 | −0.17 | 1.0 | hurts |  |
| 1437 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.17 ± 0.05 | −0.19 | −0.16 | 2.0 | hurts |  |
| 1438 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.17 ± 0.07 | −0.09 | −0.25 | 4.2 | hurts |  |
| 1439 | Ulfen Guard Dedication | 2 | Class | — | Designate Ally: its Effect on an ally within 30 feet | −0.17 ± 0.05 | +0.09 | −0.43 | 0.0 | hurts | the AI never used it |
| 1440 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.17 ± 0.04 | −0.12 | −0.22 | 1.6 | hurts |  |
| 1441 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.17 ± 0.04 | −0.18 | −0.16 | 2.9 | hurts |  |
| 1442 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.17 ± 0.05 | −0.22 | −0.13 | 1.6 | hurts |  |
| 1443 | Remember Their Names | 16 | Class | — | save | −0.17 ± 0.07 | −0.05 | −0.30 | 4.6 | hurts |  |
| 1444 | Drain Emotion | 9 | Ancestry | — | its text's self buff (TempHP 9) | −0.18 ± 0.05 | −0.18 | −0.17 | 1.0 | hurts |  |
| 1445 | Raise Slabs | 0 | Action | — | save | −0.18 ± 0.05 | −0.13 | −0.22 | 1.0 | hurts |  |
| 1446 | Flensing Slice | 8 | Class | — | check | −0.18 ± 0.06 | +0.22 | −0.57 | 8.9 | hurts |  |
| 1447 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.18 ± 0.05 | −0.17 | −0.18 | 1.0 | hurts |  |
| 1448 | Slam Down | 4 | Class | fighter | Strike activity | −0.18 ± 0.05 | −0.29 | −0.06 | 2.7 | hurts |  |
| 1449 | Share Rage | 8 | Class | barbarian | effect | −0.18 ± 0.06 | +0.03 | −0.39 | 8.0 | hurts |  |
| 1450 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1451 | Agathion Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Calm (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1452 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.18 ± 0.05 | −0.24 | −0.12 | 1.5 | hurts |  |
| 1453 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.18 ± 0.03 | −0.28 | −0.08 | 2.5 | hurts |  |
| 1454 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1455 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1456 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1457 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1458 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.18 ± 0.05 | −0.18 | −0.18 | 1.0 | hurts |  |
| 1459 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1460 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1461 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | −0.18 ± 0.09 | −0.18 | −0.18 | 5.8 | no clear effect |  |
| 1462 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.19 ± 0.06 | −0.10 | −0.27 | 1.7 | hurts |  |
| 1463 | Electrogenesis | 6 | Class | — | save | −0.19 ± 0.05 | −0.22 | −0.15 | 1.0 | hurts |  |
| 1464 | Knockback Strike | 10 | Class | monk | Strike activity | −0.19 ± 0.05 | −0.20 | −0.17 | 4.2 | hurts |  |
| 1465 | Spirit's Wrath | 12 | Class | barbarian | check | −0.19 ± 0.08 | +0.03 | −0.41 | 10.3 | hurts |  |
| 1466 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.19 ± 0.05 | −0.28 | −0.09 | 1.0 | hurts |  |
| 1467 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.19 ± 0.05 | −0.27 | −0.11 | 1.0 | hurts |  |
| 1468 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.19 ± 0.04 | −0.24 | −0.13 | 1.0 | hurts |  |
| 1469 | Decree of War | 18 | Class | — | Strike activity | −0.19 ± 0.05 | −0.09 | −0.29 | 2.3 | hurts |  |
| 1470 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.19 ± 0.05 | −0.04 | −0.34 | 3.1 | hurts |  |
| 1471 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.19 ± 0.04 | −0.21 | −0.18 | 2.5 | hurts |  |
| 1472 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.11 | −0.28 | 1.9 | hurts |  |
| 1473 | Infernal Interference | 16 | Class | — | Strike activity | −0.20 ± 0.06 | −0.17 | −0.22 | 4.8 | hurts |  |
| 1474 | Subjugation | 16 | Class | — | save | −0.20 ± 0.06 | −0.08 | −0.31 | 3.0 | hurts |  |
| 1475 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.20 ± 0.06 | −0.10 | −0.29 | 4.4 | hurts | with a warhammer and a free hand |
| 1476 | Trip | 0 | Action | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 2.0 | hurts | with a one-handed weapon and a free hand |
| 1477 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.20 ± 0.08 | −0.02 | −0.37 | 3.3 | hurts |  |
| 1478 | Opportunistic Grapple | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.1 | hurts |  |
| 1479 | Submission Hold | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.0 | hurts |  |
| 1480 | Staff Sweep | 6 | Class | — | check | −0.20 ± 0.04 | −0.23 | −0.17 | 2.6 | hurts |  |
| 1481 | Archer's Aim | 8 | Class | — | Strike activity | −0.20 ± 0.06 | −0.26 | −0.14 | 7.2 | hurts |  |
| 1482 | Confusing Commands | 16 | Class | commander | save | −0.20 ± 0.10 | +0.10 | −0.51 | 4.5 | hurts |  |
| 1483 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.21 ± 0.05 | −0.24 | −0.17 | 2.1 | hurts |  |
| 1484 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.21 ± 0.07 | −0.10 | −0.31 | 10.2 | hurts |  |
| 1485 | Flinging Blow | 16 | Class | monk | Strike activity | −0.21 ± 0.10 | −0.00 | −0.42 | 6.3 | hurts |  |
| 1486 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.21 ± 0.05 | −0.32 | −0.10 | 1.0 | hurts |  |
| 1487 | Abrasive Drag | 12 | Class | — | check | −0.22 ± 0.06 | −0.07 | −0.36 | 3.8 | hurts |  |
| 1488 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1489 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1490 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.22 ± 0.06 | −0.37 | −0.06 | 2.7 | hurts |  |
| 1491 | Aldori Parry | 4 | Class | — | self effect | −0.22 ± 0.05 | −0.36 | −0.08 | 2.9 | hurts |  |
| 1492 | Fabricate Truth | 4 | Class | — | check | −0.22 ± 0.05 | −0.17 | −0.27 | 2.9 | hurts |  |
| 1493 | Weft and Warp | 16 | Class | — | Strike activity | −0.22 ± 0.05 | +0.02 | −0.46 | 2.8 | hurts |  |
| 1494 | The Dead Walk | 10 | Class | oracle | check | −0.23 ± 0.06 | −0.10 | −0.35 | 3.2 | hurts |  |
| 1495 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.23 ± 0.05 | −0.31 | −0.15 | 5.5 | hurts |  |
| 1496 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1497 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1498 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.23 ± 0.04 | −0.33 | −0.13 | 2.7 | hurts |  |
| 1499 | Warning Shot | 2 | Class | gunslinger | check | −0.23 ± 0.06 | −0.19 | −0.28 | 2.7 | hurts |  |
| 1500 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.23 ± 0.05 | −0.20 | −0.27 | 2.0 | hurts |  |
| 1501 | Primal Roar | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1502 | Threatening Approach | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1503 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.24 ± 0.05 | −0.28 | −0.20 | 2.1 | hurts |  |
| 1504 | Dirty Trick | 1 | Skill | — | check | −0.24 ± 0.04 | −0.07 | −0.41 | 1.6 | hurts |  |
| 1505 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.24 ± 0.05 | −0.26 | −0.22 | 2.1 | hurts |  |
| 1506 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.24 ± 0.05 | −0.25 | −0.23 | 2.1 | hurts |  |
| 1507 | Night's Shine | 12 | Class | — | innate spells: Asterism (rank 4), Touch of the Moon (rank 4) | −0.24 ± 0.06 | −0.13 | −0.36 | 3.5 | hurts |  |
| 1508 | Whirling Throw | 6 | Class | monk | check | −0.25 ± 0.05 | −0.19 | −0.30 | 6.6 | hurts |  |
| 1509 | Stranglehold | 9 | Ancestry | — | check | −0.25 ± 0.05 | −0.16 | −0.33 | 9.7 | hurts |  |
| 1510 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.25 ± 0.04 | −0.33 | −0.16 | 4.3 | hurts |  |
| 1511 | Buzzing Death Cicadas | 12 | Class | — | Death Drone: save | −0.25 ± 0.06 | −0.22 | −0.27 | 0.0 | hurts | the AI never used it |
| 1512 | Reactive Tangle | 4 | Class | — | check | −0.25 ± 0.04 | −0.31 | −0.19 | 2.6 | hurts |  |
| 1513 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.25 ± 0.05 | −0.23 | −0.27 | 2.7 | hurts |  |
| 1514 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.25 ± 0.07 | −0.45 | −0.05 | 17.5 | hurts |  |
| 1515 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.25 ± 0.04 | −0.33 | −0.17 | 2.0 | hurts |  |
| 1516 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.25 ± 0.05 | −0.31 | −0.20 | 2.8 | hurts |  |
| 1517 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1518 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1519 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1520 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1521 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1522 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1523 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1524 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1525 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1526 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1527 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1528 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1529 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1530 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1531 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1532 | Catchy Tune | 5 | Ancestry | — | check | −0.26 ± 0.04 | −0.19 | −0.32 | 8.8 | hurts |  |
| 1533 | Clobber | 16 | Class | guardian | Strike activity | −0.26 ± 0.07 | −0.36 | −0.16 | 11.7 | hurts |  |
| 1534 | Sanguivolent Roots | 8 | Class | kineticist | save | −0.27 ± 0.11 | −0.51 | −0.03 | 5.6 | hurts |  |
| 1535 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.27 ± 0.05 | −0.41 | −0.13 | 1.0 | hurts |  |
| 1536 | Scorching Column | 1 | Class | kineticist | save | −0.27 ± 0.07 | −0.32 | −0.22 | 2.7 | hurts |  |
| 1537 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.27 ± 0.11 | −0.32 | −0.22 | 8.3 | hurts |  |
| 1538 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.27 ± 0.09 | −0.26 | −0.28 | 9.8 | hurts |  |
| 1539 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.27 ± 0.05 | −0.29 | −0.26 | 2.0 | hurts |  |
| 1540 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.28 ± 0.06 | −0.25 | −0.30 | 4.1 | hurts |  |
| 1541 | Grovel | 5 | Ancestry | — | check | −0.28 ± 0.04 | −0.23 | −0.32 | 6.1 | hurts |  |
| 1542 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.28 ± 0.07 | −0.29 | −0.27 | 4.5 | hurts |  |
| 1543 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1544 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.29 ± 0.06 | −0.39 | −0.18 | 3.0 | hurts |  |
| 1545 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.29 ± 0.05 | −0.27 | −0.31 | 3.5 | hurts |  |
| 1546 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.29 ± 0.06 | −0.25 | −0.33 | 2.1 | hurts |  |
| 1547 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.29 ± 0.06 | −0.14 | −0.44 | 7.5 | hurts |  |
| 1548 | Cry of Rebellion | 16 | Class | — | save | −0.29 ± 0.08 | −0.22 | −0.36 | 1.0 | hurts |  |
| 1549 | Spinebreaker | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1550 | Ensnaring Wrappings | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1551 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.29 ± 0.05 | −0.30 | −0.29 | 7.3 | hurts |  |
| 1552 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.29 ± 0.06 | −0.33 | −0.26 | 9.5 | hurts |  |
| 1553 | Armored Rebuff | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 4.5 | hurts |  |
| 1554 | Wing Shove | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 3.9 | hurts |  |
| 1555 | Distracting Spellstrike | 4 | Class | magus | check | −0.30 ± 0.07 | −0.33 | −0.27 | 1.9 | hurts |  |
| 1556 | Mesmerizing Gaze | 6 | Class | — | save | −0.30 ± 0.05 | −0.21 | −0.39 | 3.1 | hurts |  |
| 1557 | Running Tackle | 8 | Class | — | check | −0.30 ± 0.06 | −0.29 | −0.31 | 3.8 | hurts |  |
| 1558 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.30 ± 0.09 | −0.36 | −0.24 | 5.1 | hurts |  |
| 1559 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.30 ± 0.09 | −0.20 | −0.40 | 4.3 | hurts |  |
| 1560 | Launch Fireworks | 0 | Action | — | save | −0.30 ± 0.05 | −0.19 | −0.42 | 3.3 | hurts | with a one-handed weapon and a free hand |
| 1561 | Demolish Defenses | 18 | Class | guardian | save | −0.31 ± 0.06 | −0.44 | −0.17 | 5.1 | hurts |  |
| 1562 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1563 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1564 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1565 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1566 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.5 | hurts |  |
| 1567 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.31 ± 0.08 | −0.32 | −0.30 | 5.0 | hurts |  |
| 1568 | Wheeling Grab | 6 | Class | — | check | −0.32 ± 0.04 | −0.37 | −0.26 | 2.9 | hurts |  |
| 1569 | Putrefaction | 14 | Class | — | save | −0.32 ± 0.06 | −0.25 | −0.38 | 3.0 | hurts |  |
| 1570 | Stay Down! | 14 | Class | rogue | check | −0.32 ± 0.07 | −0.27 | −0.37 | 11.2 | hurts |  |
| 1571 | Parting Shot | 4 | Class | fighter | Strike activity | −0.32 ± 0.06 | −0.38 | −0.26 | 5.0 | hurts | with a bow in hand |
| 1572 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.32 ± 0.08 | −0.39 | −0.26 | 8.8 | hurts |  |
| 1573 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.32 ± 0.06 | −0.25 | −0.40 | 2.3 | hurts |  |
| 1574 | Exaltation Overwhelming | 18 | Class | — | save | −0.33 ± 0.06 | −0.30 | −0.35 | 2.9 | hurts |  |
| 1575 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1576 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1577 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1578 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1579 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1580 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1581 | Glimpse Vulnerability | 0 | Action | — | effect | −0.33 ± 0.05 | −0.05 | −0.60 | 6.0 | hurts |  |
| 1582 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.33 ± 0.05 | −0.37 | −0.29 | 3.9 | hurts |  |
| 1583 | Spiritual Awakening | 4 | Class | — | Spiritual Expansion Spell: widened copies of 3 area spells | −0.33 ± 0.08 | −0.69 | +0.02 | 0.0 | hurts | the AI never used it |
| 1584 | Hallowed Initiate | 4 | Class | — | innate spell: Call of the Grave (rank 1), Death's Call (rank 1) | −0.33 ± 0.07 | −0.41 | −0.25 | 1.0 | hurts |  |
| 1585 | Rising Hurricane | 6 | Class | kineticist | save | −0.33 ± 0.10 | −0.48 | −0.19 | 4.4 | hurts |  |
| 1586 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.33 ± 0.06 | −0.27 | −0.40 | 1.0 | hurts |  |
| 1587 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.34 ± 0.05 | −0.38 | −0.30 | 4.7 | hurts |  |
| 1588 | Sleeper Hold | 10 | Class | monk | check | −0.34 ± 0.08 | −0.49 | −0.20 | 6.0 | hurts |  |
| 1589 | Channeled Protection | 4 | Class | animist | effect | −0.37 ± 0.09 | −0.58 | −0.15 | 17.3 | hurts |  |
| 1590 | Raise the Walls | 0 | Action | — | effect | −0.37 ± 0.06 | −0.26 | −0.48 | 6.8 | hurts |  |
| 1591 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.37 ± 0.07 | −0.18 | −0.56 | 11.8 | hurts |  |
| 1592 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.37 ± 0.07 | −0.35 | −0.38 | 1.6 | hurts |  |
| 1593 | Protect the Royal Line | 16 | Class | — | check | −0.37 ± 0.06 | −0.44 | −0.31 | 5.4 | hurts |  |
| 1594 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.37 ± 0.05 | −0.47 | −0.28 | 4.1 | hurts |  |
| 1595 | Brain Drain | 8 | Class | psychic | save | −0.39 ± 0.05 | −0.59 | −0.19 | 3.2 | hurts |  |
| 1596 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.39 ± 0.06 | −0.58 | −0.20 | 5.2 | hurts |  |
| 1597 | Propulsive Leap | 10 | Class | — | save | −0.39 ± 0.06 | −0.37 | −0.42 | 10.3 | hurts |  |
| 1598 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.40 ± 0.06 | −0.41 | −0.38 | 0.0 | hurts | with a one-handed weapon and a free hand; the AI never used it |
| 1599 | Rend Mimicry | 4 | Class | — | check | −0.40 ± 0.05 | −0.36 | −0.43 | 5.9 | hurts |  |
| 1600 | Drive Back | 8 | Class | — | check | −0.40 ± 0.06 | −0.47 | −0.33 | 4.3 | hurts | with a weapon and a shield |
| 1601 | Whirling Knockdown | 14 | Class | — | check | −0.41 ± 0.06 | −0.29 | −0.52 | 5.6 | hurts |  |
| 1602 | Wing Bounce | 4 | Class | — | check | −0.41 ± 0.07 | −0.44 | −0.38 | 2.7 | hurts |  |
| 1603 | Sun Blade | 4 | Class | champion | focus spell: Sun Blade (rank 2) | −0.42 ± 0.07 | −0.44 | −0.40 | 2.0 | hurts |  |
| 1604 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.43 ± 0.07 | −0.31 | −0.55 | 22.0 | hurts |  |
| 1605 | Wing Buffet | 9 | Ancestry | — | check | −0.43 ± 0.05 | −0.58 | −0.28 | 4.4 | hurts |  |
| 1606 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.45 ± 0.06 | −0.54 | −0.36 | 4.3 | hurts |  |
| 1607 | Fearful Symmetry | 6 | Class | — | save | −0.46 ± 0.06 | −0.56 | −0.37 | 8.5 | hurts |  |
| 1608 | Hammer Quake | 14 | Class | — | check | −0.47 ± 0.07 | −0.24 | −0.69 | 4.2 | hurts |  |
| 1609 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.47 ± 0.05 | −0.48 | −0.46 | 3.1 | hurts |  |
| 1610 | Say That Again! | 6 | Skill | — | check | −0.49 ± 0.05 | −0.67 | −0.32 | 3.0 | hurts |  |
| 1611 | Repulse the Wicked | 6 | Class | — | check | −0.49 ± 0.05 | −0.67 | −0.32 | 3.0 | hurts |  |
| 1612 | Mixed Maneuver | 8 | Class | monk | check | −0.51 ± 0.08 | −0.61 | −0.42 | 5.4 | hurts |  |
| 1613 | Warped Constriction | 8 | Class | — | save | −0.52 ± 0.06 | −0.49 | −0.54 | 10.6 | hurts |  |
| 1614 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.52 ± 0.05 | −0.64 | −0.40 | 4.2 | hurts |  |
| 1615 | Tamper | 1 | Class | inventor | check | −0.54 ± 0.06 | −0.51 | −0.56 | 7.4 | hurts |  |
| 1616 | Twist the Knife | 6 | Class | rogue | check | −0.55 ± 0.06 | −0.44 | −0.67 | 8.9 | hurts |  |
| 1617 | Silk Bracelet | 6 | Class | inventor | save | −0.57 ± 0.10 | −0.42 | −0.72 | 4.3 | hurts |  |
| 1618 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −0.59 ± 0.07 | −0.41 | −0.77 | 5.8 | hurts |  |
| 1619 | Trample Mimicry | 10 | Class | — | save | −0.59 ± 0.06 | −0.72 | −0.46 | 3.8 | hurts |  |
| 1620 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.60 ± 0.06 | −0.57 | −0.62 | 18.3 | hurts |  |
| 1621 | Freeze It! | 9 | Ancestry | — | check | −0.60 ± 0.06 | −0.60 | −0.60 | 10.5 | hurts |  |
| 1622 | Catfolk Dance | 1 | Ancestry | — | check | −0.60 ± 0.07 | −0.49 | −0.71 | 8.4 | hurts |  |
| 1623 | Muckraking | 16 | Class | — | save | −0.61 ± 0.08 | −0.53 | −0.68 | 4.2 | hurts |  |
| 1624 | Flying Tackle | 4 | Class | guardian | check | −0.61 ± 0.08 | −0.76 | −0.46 | 3.4 | hurts |  |
| 1625 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.62 ± 0.06 | −0.59 | −0.64 | 6.7 | hurts |  |
| 1626 | Dazzling Bullet | 6 | Class | — | check | −0.67 ± 0.06 | −0.60 | −0.73 | 9.8 | hurts |  |
| 1627 | Wild Dance | 12 | Class | — | save | −0.67 ± 0.08 | −0.40 | −0.94 | 12.0 | hurts |  |
| 1628 | Perplex | 14 | Class | — | check | −0.67 ± 0.08 | −0.66 | −0.68 | 3.9 | hurts |  |
| 1629 | Prayer Attack | 14 | Class | — | check | −0.68 ± 0.09 | −0.46 | −0.91 | 16.6 | hurts |  |
| 1630 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.70 ± 0.07 | −0.88 | −0.52 | 13.2 | hurts |  |
| 1631 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.71 ± 0.08 | −0.61 | −0.80 | 14.4 | hurts |  |
| 1632 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.72 ± 0.07 | −0.64 | −0.79 | 5.7 | hurts |  |
| 1633 | Gossamer Blade | 4 | Class | — | check | −0.73 ± 0.06 | −0.74 | −0.73 | 7.8 | hurts |  |
| 1634 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.75 ± 0.06 | −0.88 | −0.61 | 8.8 | hurts |  |
| 1635 | Clear the Way | 6 | Class | — | check | −0.78 ± 0.07 | −1.03 | −0.52 | 3.7 | hurts |  |
| 1636 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.81 ± 0.07 | −0.96 | −0.66 | 28.7 | hurts |  |
| 1637 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.86 ± 0.08 | −0.97 | −0.75 | 10.5 | hurts | with a bow in hand |
| 1638 | One Moment till Glory | 0 | Action | — | effect | −0.87 ± 0.07 | −0.71 | −1.04 | 12.5 | hurts |  |
| 1639 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.89 ± 0.07 | −0.91 | −0.88 | 21.7 | hurts |  |
| 1640 | Dance of the Tiger | 9 | Ancestry | — | check | −0.90 ± 0.08 | −1.24 | −0.56 | 15.8 | hurts |  |
| 1641 | Flourishing Finish | 12 | Class | — | check | −0.92 ± 0.10 | −0.83 | −1.00 | 14.8 | hurts |  |
| 1642 | Peony's Flourish | 14 | Class | — | check | −0.98 ± 0.10 | −0.54 | −1.42 | 6.3 | hurts |  |
| 1643 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.00 ± 0.06 | +0.00 | −1.99 | 1.0 | hurts |  |
| 1644 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.00 ± 0.06 | +0.00 | −1.99 | 1.0 | hurts |  |
| 1645 | Purifying Breeze | 14 | Class | cleric | effect | −1.00 ± 0.09 | −1.15 | −0.85 | 16.7 | hurts |  |
| 1646 | Unbalancing Sweep | 12 | Class | barbarian | check | −1.00 ± 0.12 | −1.16 | −0.85 | 4.4 | hurts |  |
| 1647 | Scattering Charge | 12 | Class | guardian | check | −1.12 ± 0.11 | −1.26 | −0.99 | 4.6 | hurts |  |
| 1648 | Silencing Strike | 10 | Class | barbarian | save | −1.20 ± 0.10 | −1.73 | −0.67 | 17.0 | hurts |  |
| 1649 | Thrash | 8 | Class | barbarian | save | −1.26 ± 0.09 | −1.23 | −1.29 | 15.1 | hurts |  |
| 1650 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −1.45 ± 0.10 | −1.81 | −1.09 | 5.1 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 3921 |
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
| it grants one of 2 | 18 |
| a lasting area | 14 |
| a choice of ways the simulator doesn't play | 12 |
| a companion's Strike | 11 |
| a passive's Strike | 11 |
| a Focus or Mythic Point back | 10 |
| an Effect on another creature | 8 |
| it grants Pet: the feat module reads nothing for it | 7 |
| damage still naming the character's data | 5 |
| a roll twice | 4 |
| a reaction to "strike" | 4 |
| it grants Domain Initiate: the feat module reads nothing for it | 4 |
| it grants Verdant Core Deviant Classification: the feat module reads nothing for it | 3 |
| it grants Additional Lore: the feat module reads nothing for it | 3 |
| it grants Terrain Stalker: the feat module reads nothing for it | 3 |
| it grants Adopted Ancestry: the feat module reads nothing for it | 3 |
| a reaction to "aura" | 2 |
| a free's Strike | 2 |
| it grants Dragon Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Call Companion: the feat module reads nothing for it | 2 |
| it grants Cast a Spell: the feat module reads nothing for it | 2 |
| it grants Assurance: the feat module reads nothing for it | 2 |
| it grants one of 3 | 2 |
| it grants Diehard: the feat module reads nothing for it | 2 |
| it grants Steady Balance: the feat module reads nothing for it | 2 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 2 |
| it grants Untrained Improvisation: the feat module reads nothing for it | 2 |
| it grants Conceal Spell: the feat module reads nothing for it | 2 |
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
| it grants Blight Soul Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Speed of Arms: a reaction's Strike | 1 |
| it grants Leech Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Eidolon: the feat module reads nothing for it | 1 |
| it grants Once Bitten: the feat module reads nothing for it | 1 |
| it grants Command Undead: the feat module reads nothing for it | 1 |
| it grants Psychometric Assessment: the feat module reads nothing for it | 1 |
| it grants Bonded Animal: the feat module reads nothing for it | 1 |
| it grants Quick Repair: the feat module reads nothing for it | 1 |
| it grants Enhanced Familiar: the feat module reads nothing for it | 1 |
| it grants Create Familiar Fulu: nothing a fight uses | 1 |
| it grants Experienced Tracker: the feat module reads nothing for it | 1 |
| it grants Bond with Spirit: nothing a fight uses | 1 |
| it grants Mark for Death: the feat module reads nothing for it | 1 |
| it grants Accidental Shot: its text has no Strike of its user's | 1 |
| it grants Set Explosives: the feat module reads nothing for it | 1 |
| it grants Rouse the World: a timer with no rules a fight counts | 1 |
| it grants Slayer's Identification: the feat module reads nothing for it | 1 |
| it grants Favored Terrain: the feat module reads nothing for it | 1 |
| it grants Quick Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Spin Tale: an Effect with nothing a fight counts | 1 |
| it grants Engineer's Efficiency: the feat module reads nothing for it | 1 |
| it grants Mystic Aegis: the feat module reads nothing for it | 1 |
| it grants Lay Down Arms: the feat module reads nothing for it | 1 |
| it grants Devise a Stratagem: its text has no Strike of its user's | 1 |
| it grants Remove Head: the feat module reads nothing for it | 1 |
| it grants Base Kinesis: the feat module reads nothing for it | 1 |
| it grants Coughing Dragon: nothing a fight uses | 1 |
| it grants Size Up: an Effect with nothing a fight counts | 1 |
| it grants Monastic Weaponry: the feat module reads nothing for it | 1 |
| it grants Spell-Woven Shot: its requirement | 1 |
| it grants Flicker Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Cobble Together: the feat module reads nothing for it | 1 |
| it grants Magical Crafting: the feat module reads nothing for it | 1 |
| it grants Automatic Knowledge: the feat module reads nothing for it | 1 |
| it grants Cycle Elemental Stance: a teleport | 1 |
| it grants Keen Recollection: the feat module reads nothing for it | 1 |
| it grants Inevitable Return: the feat module reads nothing for it | 1 |
| it grants Pirate Dedication: the feat module reads nothing for it | 1 |
| it grants Drape Ambient Magic: its text has no Strike of its user's | 1 |
| it grants Trace Rune: a timer with no rules a fight counts | 1 |
| it grants Powerful Leap: the feat module reads nothing for it | 1 |
| it grants Specialty Crafting: the feat module reads nothing for it | 1 |
| it grants Find Fault: the feat module reads nothing for it | 1 |
| it grants Mirror-Trickery: nothing a fight uses | 1 |
| it grants Quick Squeeze: the feat module reads nothing for it | 1 |
| it grants Smoke Blending: nothing a fight uses | 1 |
| it grants Quick Identification: the feat module reads nothing for it | 1 |
| it grants Fast Recovery: the feat module reads nothing for it | 1 |
| it grants Lie to Me: the feat module reads nothing for it | 1 |
| it grants Quick Disguise: the feat module reads nothing for it | 1 |
| it grants Empty Vessel: the feat module reads nothing for it | 1 |
| it grants Mist Blending: nothing a fight uses | 1 |
| it grants Reactive Falsehood: the feat module reads nothing for it | 1 |
| it grants Dubious Knowledge: the feat module reads nothing for it | 1 |
| it grants Arcane Bond: the feat module reads nothing for it | 1 |
| it grants Call Gun: the feat module reads nothing for it | 1 |
| it grants Jumping Jenny: a timer with no rules a fight counts | 1 |
| it grants Entreat Pact: its Effect has nothing a fight counts | 1 |
| it grants Transform Ammunition: the feat module reads nothing for it | 1 |
| it grants Devour Ambient Magic: nothing a fight uses | 1 |
| it grants Fortify Focus: the feat module reads nothing for it | 1 |
| it grants Swift Choreography: the feat module reads nothing for it | 1 |
| it grants Pitch-Perfect Projection: the feat module reads nothing for it | 1 |
| it grants Spiritual Aid: a reroll | 1 |
| it grants Banshee Cry: a roll whose results the simulator doesn't read | 1 |
| it grants Unimpeded Journey: the feat module reads nothing for it | 1 |
| it grants Fey Jump: a teleport | 1 |
| it grants Impromptu Investment: the feat module reads nothing for it | 1 |
| it grants Battle Cry: the feat module reads nothing for it | 1 |
| it grants Enter Runewell: the feat module reads nothing for it | 1 |
| it grants Greater Field Discovery (Toxicologist): the feat module reads nothing for it | 1 |
| it grants Lengthy Diversion: the feat module reads nothing for it | 1 |
| it grants Intercession Spell: the feat module reads nothing for it | 1 |
| it grants Pacifying Infusion: the feat module reads nothing for it | 1 |
| it grants Makes Me Stronger: the feat module reads nothing for it | 1 |
| it grants Call to Hand: nothing a fight uses | 1 |
| it grants Share Death's Promises: a timer with no rules a fight counts | 1 |
| it grants Convocation of Greed: a timer with no rules a fight counts | 1 |
| it grants Legendary Negotiation: the feat module reads nothing for it | 1 |
| it grants Weaponsight: an Effect with nothing a fight counts | 1 |
| it grants Host of Wrath: a timer with no rules a fight counts | 1 |
| it grants Verdant Rest: the feat module reads nothing for it | 1 |
| it grants Aegis of Envy: a timer with no rules a fight counts | 1 |
| it grants Royal Grace: the feat module reads nothing for it | 1 |
| it grants Summon Sloth: the feat module reads nothing for it | 1 |
| it grants Draw From the Pages: the feat module reads nothing for it | 1 |
| it grants Call Warshard Weapon: the feat module reads nothing for it | 1 |
| it grants Bon Mot: a roll whose results the simulator doesn't read | 1 |
| it grants Objection: the feat module reads nothing for it | 1 |
| it grants Sidestep Through Time: a timer with no rules a fight counts | 1 |
| it grants one of 14 | 1 |
| it grants one of 6 | 1 |
| it grants one of 15 | 1 |
| it grants one of 12 | 1 |
