# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-03: 1679 feats and actions rated, 5266 not simulated, 4 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1495
- hurts: 87
- good: 49
- minor: 29
- strong: 15
- very strong: 4

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.78 ± 0.07 | +0.69 | +0.87 | 1.0 | very strong |  |
| 2 | Pin to the Spot | 14 | Class | — | Strike activity | +0.71 ± 0.05 | +1.12 | +0.29 | 3.9 | very strong |  |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.59 ± 0.09 | +1.05 | +0.13 | 0.8 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.59 ± 0.10 | +0.93 | +0.24 | 3.8 | very strong |  |
| 5 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.50 ± 0.09 | +0.43 | +0.56 | 5.1 | strong |  |
| 6 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.49 ± 0.06 | +0.49 | +0.50 | 5.0 | strong |  |
| 7 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.42 ± 0.04 | +0.26 | +0.59 | 0.0 | strong | the AI never used it |
| 8 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 9 | Scare to Death | 15 | Skill | — | save | +0.35 ± 0.04 | +0.66 | +0.04 | 1.0 | strong |  |
| 10 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.44 | +0.19 | 3.7 | strong |  |
| 11 | Tumbling Lumber | 4 | Class | kineticist | save | +0.31 ± 0.11 | +0.47 | +0.15 | 4.3 | strong |  |
| 12 | Goblin Jubilee | 0 | Action | — | save | +0.31 ± 0.04 | +0.14 | +0.48 | 0.4 | strong |  |
| 13 | Sun Blade | 4 | Class | champion | focus spell: Sun Blade (rank 2) | +0.30 ± 0.07 | +0.42 | +0.18 | 0.0 | strong | the AI never used it |
| 14 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.29 ± 0.06 | +0.33 | +0.24 | 7.7 | strong |  |
| 15 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.28 ± 0.12 | +0.54 | +0.01 | 3.6 | strong |  |
| 16 | Weight of Stone | 6 | Class | kineticist | save | +0.27 ± 0.09 | +0.39 | +0.16 | 3.6 | strong |  |
| 17 | Sacral Lord | 4 | Class | champion | innate spells: Detect Magic (rank 2), Guidance (rank 2), Sigil (rank 2) | +0.27 ± 0.07 | +0.34 | +0.19 | 0.0 | strong | the AI never used it |
| 18 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.04 | +0.02 | +0.49 | 0.4 | strong |  |
| 19 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.26 ± 0.06 | +0.23 | +0.28 | 4.7 | strong |  |
| 20 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.25 ± 0.06 | +0.34 | +0.15 | 0.0 | good | the AI never used it |
| 21 | Infernal Anguish | 8 | Class | — | check | +0.25 ± 0.05 | +0.46 | +0.03 | 4.8 | good |  |
| 22 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.25 ± 0.05 | +0.05 | +0.44 | 0.3 | good |  |
| 23 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.16 | 2.5 | good |  |
| 24 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.23 ± 0.06 | +0.35 | +0.12 | 3.0 | good |  |
| 25 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 26 | Jester's Gambol | 16 | Class | animist | stance | +0.22 ± 0.07 | +0.36 | +0.08 | 1.0 | good |  |
| 27 | Retch Rust | 8 | Class | kineticist | save | +0.21 ± 0.07 | +0.08 | +0.35 | 1.6 | good |  |
| 28 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.21 ± 0.05 | +0.06 | +0.36 | 4.1 | good |  |
| 29 | Acrid Barrage | 0 | Action | — | save | +0.21 ± 0.04 | +0.21 | +0.20 | 1.1 | good |  |
| 30 | Rend Armor | 8 | Class | — | effect | +0.20 ± 0.04 | +0.37 | +0.04 | 2.0 | good |  |
| 31 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.19 ± 0.07 | +0.05 | +0.34 | 3.3 | good |  |
| 32 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 33 | Disrupt Qi | 12 | Class | monk | Strike activity | +0.19 ± 0.06 | +0.35 | +0.02 | 2.0 | good |  |
| 34 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 35 | Frightening Power | 12 | Class | — | save | +0.19 ± 0.03 | +0.11 | +0.26 | 0.8 | good |  |
| 36 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.18 ± 0.06 | +0.32 | +0.05 | 1.5 | good |  |
| 37 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 38 | Constricting Hold | 8 | Class | summoner | save | +0.17 ± 0.06 | +0.24 | +0.11 | 3.3 | good |  |
| 39 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 40 | Pierce the Eye | 16 | Class | — | save | +0.17 ± 0.06 | +0.31 | +0.03 | 1.3 | good | with a bow in hand |

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
| 1 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.78 ± 0.07 | +0.69 | +0.87 | 1.0 | very strong |  |
| 2 | Pin to the Spot | 14 | Class | — | Strike activity | +0.71 ± 0.05 | +1.12 | +0.29 | 3.9 | very strong |  |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.59 ± 0.09 | +1.05 | +0.13 | 0.8 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.59 ± 0.10 | +0.93 | +0.24 | 3.8 | very strong |  |
| 5 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.50 ± 0.09 | +0.43 | +0.56 | 5.1 | strong |  |
| 6 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.49 ± 0.06 | +0.49 | +0.50 | 5.0 | strong |  |
| 7 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.42 ± 0.04 | +0.26 | +0.59 | 0.0 | strong | the AI never used it |
| 8 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.35 ± 0.06 | +0.43 | +0.27 | 0.0 | strong | the AI never used it |
| 9 | Scare to Death | 15 | Skill | — | save | +0.35 ± 0.04 | +0.66 | +0.04 | 1.0 | strong |  |
| 10 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.44 | +0.19 | 3.7 | strong |  |
| 11 | Tumbling Lumber | 4 | Class | kineticist | save | +0.31 ± 0.11 | +0.47 | +0.15 | 4.3 | strong |  |
| 12 | Goblin Jubilee | 0 | Action | — | save | +0.31 ± 0.04 | +0.14 | +0.48 | 0.4 | strong |  |
| 13 | Sun Blade | 4 | Class | champion | focus spell: Sun Blade (rank 2) | +0.30 ± 0.07 | +0.42 | +0.18 | 0.0 | strong | the AI never used it |
| 14 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.29 ± 0.06 | +0.33 | +0.24 | 7.7 | strong |  |
| 15 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.28 ± 0.12 | +0.54 | +0.01 | 3.6 | strong |  |
| 16 | Weight of Stone | 6 | Class | kineticist | save | +0.27 ± 0.09 | +0.39 | +0.16 | 3.6 | strong |  |
| 17 | Sacral Lord | 4 | Class | champion | innate spells: Detect Magic (rank 2), Guidance (rank 2), Sigil (rank 2) | +0.27 ± 0.07 | +0.34 | +0.19 | 0.0 | strong | the AI never used it |
| 18 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.04 | +0.02 | +0.49 | 0.4 | strong |  |
| 19 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.26 ± 0.06 | +0.23 | +0.28 | 4.7 | strong |  |
| 20 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.25 ± 0.06 | +0.34 | +0.15 | 0.0 | good | the AI never used it |
| 21 | Infernal Anguish | 8 | Class | — | check | +0.25 ± 0.05 | +0.46 | +0.03 | 4.8 | good |  |
| 22 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.25 ± 0.05 | +0.05 | +0.44 | 0.3 | good |  |
| 23 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.16 | 2.5 | good |  |
| 24 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.23 ± 0.06 | +0.35 | +0.12 | 3.0 | good |  |
| 25 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 26 | Jester's Gambol | 16 | Class | animist | stance | +0.22 ± 0.07 | +0.36 | +0.08 | 1.0 | good |  |
| 27 | Retch Rust | 8 | Class | kineticist | save | +0.21 ± 0.07 | +0.08 | +0.35 | 1.6 | good |  |
| 28 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.21 ± 0.05 | +0.06 | +0.36 | 4.1 | good |  |
| 29 | Acrid Barrage | 0 | Action | — | save | +0.21 ± 0.04 | +0.21 | +0.20 | 1.1 | good |  |
| 30 | Rend Armor | 8 | Class | — | effect | +0.20 ± 0.04 | +0.37 | +0.04 | 2.0 | good |  |
| 31 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.19 ± 0.07 | +0.05 | +0.34 | 3.3 | good |  |
| 32 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 33 | Disrupt Qi | 12 | Class | monk | Strike activity | +0.19 ± 0.06 | +0.35 | +0.02 | 2.0 | good |  |
| 34 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 35 | Frightening Power | 12 | Class | — | save | +0.19 ± 0.03 | +0.11 | +0.26 | 0.8 | good |  |
| 36 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.18 ± 0.06 | +0.32 | +0.05 | 1.5 | good |  |
| 37 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 38 | Constricting Hold | 8 | Class | summoner | save | +0.17 ± 0.06 | +0.24 | +0.11 | 3.3 | good |  |
| 39 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 40 | Pierce the Eye | 16 | Class | — | save | +0.17 ± 0.06 | +0.31 | +0.03 | 1.3 | good | with a bow in hand |
| 41 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.16 ± 0.09 | +0.13 | +0.20 | 1.0 | no clear effect |  |
| 42 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.15 ± 0.06 | +0.18 | +0.13 | 0.0 | good | the AI never used it |
| 43 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.15 ± 0.07 | +0.14 | +0.16 | 5.2 | good | with two weapons (longsword and shortsword) |
| 44 | Storm Spiral | 8 | Class | kineticist | save | +0.15 ± 0.07 | +0.09 | +0.21 | 0.5 | good |  |
| 45 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.15 ± 0.03 | +0.19 | +0.10 | 0.8 | good |  |
| 46 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.14 ± 0.07 | +0.16 | +0.11 | 4.4 | good | with two weapons (longsword and shortsword) |
| 47 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.14 ± 0.05 | +0.28 | +0.00 | 1.6 | good |  |
| 48 | Solar Detonation | 8 | Class | kineticist | save | +0.14 ± 0.06 | −0.02 | +0.30 | 0.5 | good |  |
| 49 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.14 ± 0.05 | +0.14 | +0.14 | 1.0 | good |  |
| 50 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.04 | +0.10 | +0.17 | 0.0 | good | the AI never used it |
| 51 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.14 ± 0.05 | +0.17 | +0.10 | 1.0 | good |  |
| 52 | Devastating Duelist | 18 | Class | — | Strike activity | +0.13 ± 0.04 | +0.18 | +0.08 | 4.0 | good |  |
| 53 | Living Epic | 20 | Class | — | passive effect (always on) | +0.13 ± 0.03 | +0.13 | +0.13 | 1.0 | good | always on (its moment isn't checked) |
| 54 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.13 ± 0.05 | +0.14 | +0.13 | 1.0 | good |  |
| 55 | Ignite the Sun | 18 | Class | kineticist | save | +0.13 ± 0.07 | +0.10 | +0.16 | 3.7 | no clear effect |  |
| 56 | Mythic Containment | 10 | Class | — | check | +0.13 ± 0.05 | +0.22 | +0.04 | 1.6 | good |  |
| 57 | Furious Grab | 12 | Class | barbarian | check | +0.13 ± 0.07 | +0.18 | +0.08 | 1.8 | no clear effect |  |
| 58 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.13 ± 0.06 | +0.21 | +0.05 | 2.3 | good |  |
| 59 | Lava Leap | 4 | Class | kineticist | save | +0.12 ± 0.05 | +0.25 | −0.00 | 0.4 | good |  |
| 60 | Do You Know Who I Am? | 12 | Class | — | check | +0.12 ± 0.05 | +0.15 | +0.09 | 1.0 | good |  |
| 61 | Grievous Blow | 8 | Class | — | Strike activity | +0.12 ± 0.05 | +0.18 | +0.07 | 5.3 | good |  |
| 62 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.12 ± 0.08 | +0.02 | +0.22 | 0.0 | no clear effect | the AI never used it |
| 63 | Forest's Heart | 16 | Class | animist | stance | +0.12 ± 0.07 | +0.29 | −0.05 | 1.0 | no clear effect |  |
| 64 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 65 | Ride the Tsunami | 18 | Class | kineticist | save | +0.11 ± 0.06 | −0.08 | +0.31 | 1.2 | no clear effect |  |
| 66 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.11 ± 0.03 | +0.08 | +0.15 | 0.7 | good |  |
| 67 | Into the Fray | 8 | Class | — | 2 Strikes | +0.11 ± 0.05 | +0.20 | +0.03 | 3.2 | good | with a weapon and a shield |
| 68 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | +0.11 ± 0.03 | +0.09 | +0.12 | 0.0 | good | the AI never used it |
| 69 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | +0.11 ± 0.03 | +0.22 | −0.01 | 1.3 | good |  |
| 70 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.11 ± 0.05 | +0.06 | +0.15 | 5.2 | good |  |
| 71 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.10 ± 0.04 | +0.00 | +0.21 | 0.5 | good |  |
| 72 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.10 ± 0.02 | +0.19 | +0.02 | 2.1 | good | with a bow in hand |
| 73 | Seize | 14 | Class | — | check | +0.10 ± 0.05 | +0.18 | +0.02 | 3.3 | no clear effect |  |
| 74 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.10 ± 0.03 | +0.20 | +0.00 | 0.3 | good |  |
| 75 | Siphon Life | 10 | Class | — | Strike activity | +0.10 ± 0.04 | +0.20 | +0.00 | 2.3 | good |  |
| 76 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 77 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.10 ± 0.08 | +0.16 | +0.03 | 3.2 | no clear effect |  |
| 78 | Asp Stance | 6 | Class | monk | stance | +0.10 ± 0.06 | +0.05 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 79 | Imprison Foe | 18 | Class | — | save | +0.09 ± 0.04 | +0.15 | +0.03 | 1.4 | minor |  |
| 80 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 81 | Call Worm Spirit | 10 | Class | — | save | +0.09 ± 0.04 | +0.08 | +0.10 | 1.0 | minor |  |
| 82 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.09 ± 0.04 | +0.17 | +0.01 | 0.2 | minor | with a weapon and a shield |
| 83 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.09 ± 0.03 | +0.06 | +0.11 | 0.3 | minor |  |
| 84 | Certain Strike | 10 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.13 | +0.04 | 6.0 | minor |  |
| 85 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 86 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.09 ± 0.04 | +0.11 | +0.06 | 4.2 | no clear effect |  |
| 87 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 88 | Rain of Razors | 12 | Class | kineticist | save | +0.08 ± 0.08 | −0.02 | +0.18 | 0.9 | no clear effect |  |
| 89 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.08 ± 0.06 | +0.27 | −0.11 | 0.9 | no clear effect |  |
| 90 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.08 ± 0.06 | +0.10 | +0.06 | 4.8 | no clear effect |  |
| 91 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.08 ± 0.02 | +0.12 | +0.03 | 3.2 | minor | with a one-handed weapon and a free hand |
| 92 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 5.8 | no clear effect |  |
| 93 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 94 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | +0.08 ± 0.04 | +0.16 | −0.00 | 1.5 | minor |  |
| 95 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 96 | Channeled Protection | 4 | Class | animist | effect | +0.07 ± 0.07 | +0.15 | −0.00 | 4.8 | no clear effect |  |
| 97 | Emotional Push | 2 | Class | bard | check | +0.07 ± 0.03 | +0.14 | +0.00 | 1.2 | minor |  |
| 98 | Psi Burst | 2 | Class | psychic | save | +0.07 ± 0.04 | +0.08 | +0.06 | 2.1 | no clear effect |  |
| 99 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 100 | Leading Dance | 4 | Class | swashbuckler | check | +0.07 ± 0.03 | +0.17 | −0.03 | 2.1 | minor |  |
| 101 | Belly Flop | 10 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.12 | +0.01 | 10.5 | no clear effect |  |
| 102 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.05 | −0.02 | +0.16 | 0.0 | no clear effect | the AI never used it |
| 103 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.07 ± 0.04 | +0.09 | +0.05 | 1.9 | no clear effect |  |
| 104 | Start the Festival! | 17 | Ancestry | — | check | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 105 | Call the Swarm | 17 | Ancestry | — | check | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 106 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.03 | 0.5 | no clear effect |  |
| 107 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 108 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 109 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | +0.06 ± 0.04 | +0.03 | +0.10 | 0.9 | no clear effect |  |
| 110 | Osteo Armaments | 4 | Class | — | effect | +0.06 ± 0.04 | +0.02 | +0.11 | 1.2 | no clear effect |  |
| 111 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 1.9 | minor |  |
| 112 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.06 ± 0.05 | +0.15 | −0.02 | 6.6 | no clear effect |  |
| 113 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 114 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 115 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 116 | Pandemonium Eruption | 17 | Ancestry | — | save | +0.06 ± 0.02 | +0.11 | +0.01 | 0.0 | minor | the AI never used it |
| 117 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 118 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 119 | Coordinated Distraction | 12 | Class | rogue | check | +0.06 ± 0.04 | +0.12 | −0.01 | 1.0 | no clear effect |  |
| 120 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 121 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 122 | Winter's Clutch | 1 | Class | kineticist | save | +0.06 ± 0.04 | +0.04 | +0.08 | 0.5 | no clear effect |  |
| 123 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 124 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 125 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.06 ± 0.02 | +0.11 | +0.00 | 0.3 | minor |  |
| 126 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 127 | Mana Detonation | 18 | Class | — | focus spell: Arcane Explosion (rank 9) | +0.06 ± 0.04 | +0.08 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 128 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 129 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 130 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.06 ± 0.03 | +0.11 | +0.00 | 0.4 | no clear effect |  |
| 131 | Flinging Blow | 16 | Class | monk | Strike activity | +0.05 ± 0.07 | +0.11 | +0.00 | 1.3 | no clear effect |  |
| 132 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 133 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 134 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 135 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.03 | 0.1 | minor |  |
| 136 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | +0.05 ± 0.03 | +0.01 | +0.09 | 0.5 | no clear effect | with a weapon and a shield |
| 137 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 138 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 139 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 140 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 141 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | +0.05 ± 0.05 | +0.04 | +0.05 | 0.9 | no clear effect |  |
| 142 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.05 ± 0.03 | +0.09 | +0.00 | 0.9 | no clear effect |  |
| 143 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.05 ± 0.04 | +0.02 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 144 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.05 ± 0.03 | +0.10 | −0.01 | 3.0 | no clear effect |  |
| 145 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | +0.05 ± 0.02 | +0.10 | −0.00 | 0.1 | no clear effect |  |
| 146 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 147 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.05 ± 0.03 | +0.11 | −0.02 | 3.7 | no clear effect |  |
| 148 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 149 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 150 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 151 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | +0.05 ± 0.08 | +0.01 | +0.08 | 3.2 | no clear effect |  |
| 152 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 153 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: save | +0.04 ± 0.02 | +0.01 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 154 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 155 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |
| 156 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 157 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 158 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.04 | +0.08 | +0.01 | 2.2 | no clear effect |  |
| 159 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.04 ± 0.07 | +0.05 | +0.03 | 1.0 | no clear effect |  |
| 160 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 161 | Crane Stance | 1 | Class | monk | effect | +0.04 ± 0.02 | +0.05 | +0.03 | 0.2 | no clear effect |  |
| 162 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 163 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 164 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 165 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 166 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | +0.04 ± 0.06 | +0.13 | −0.05 | 8.7 | no clear effect |  |
| 167 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 168 | Desiccating Inhalation | 12 | Class | — | save | +0.04 ± 0.03 | +0.06 | +0.02 | 0.3 | no clear effect |  |
| 169 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 170 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 171 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.04 ± 0.02 | −0.01 | +0.09 | 0.5 | no clear effect |  |
| 172 | Infernal Interference | 16 | Class | — | Strike activity | +0.04 ± 0.03 | +0.05 | +0.03 | 0.8 | no clear effect |  |
| 173 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.04 ± 0.02 | +0.00 | +0.08 | 0.8 | no clear effect | with a loaded arquebus |
| 174 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 175 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.04 ± 0.03 | +0.03 | +0.04 | 3.2 | no clear effect |  |
| 176 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | +0.04 ± 0.03 | +0.05 | +0.02 | 0.1 | no clear effect |  |
| 177 | Bear Hug | 6 | Class | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.02 | 1.9 | no clear effect |  |
| 178 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.01 | 1.6 | no clear effect |  |
| 179 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | +0.04 ± 0.03 | +0.00 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 180 | Tempo Duelist | 16 | Class | — | concealed for a round | +0.04 ± 0.04 | +0.06 | +0.01 | 1.2 | no clear effect |  |
| 181 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | focus spell: Dragon Breath (rank 4) | +0.04 ± 0.03 | +0.08 | −0.01 | 0.3 | no clear effect |  |
| 182 | Poisoner's Twist | 4 | Class | — | check | +0.04 ± 0.03 | +0.03 | +0.04 | 2.6 | no clear effect |  |
| 183 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.02 | +0.01 | +0.06 | 0.1 | no clear effect |  |
| 184 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 185 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.03 ± 0.05 | +0.09 | −0.02 | 4.2 | no clear effect |  |
| 186 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 187 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 188 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | +0.03 ± 0.02 | +0.00 | +0.07 | 0.8 | no clear effect |  |
| 189 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | +0.03 ± 0.03 | +0.04 | +0.02 | 1.1 | no clear effect |  |
| 190 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.03 | +0.00 | +0.07 | 0.3 | no clear effect |  |
| 191 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.03 ± 0.03 | −0.02 | +0.09 | 0.9 | no clear effect |  |
| 192 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.02 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 193 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.0 | no clear effect |  |
| 194 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.2 | no clear effect |  |
| 195 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.06 | +0.00 | 1.1 | no clear effect |  |
| 196 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | +0.03 ± 0.05 | +0.05 | +0.02 | 1.2 | no clear effect |  |
| 197 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.03 ± 0.03 | +0.09 | −0.02 | 2.8 | no clear effect |  |
| 198 | Stoked Flame Stance | 1 | Class | monk | stance | +0.03 ± 0.03 | +0.05 | +0.01 | 0.7 | no clear effect |  |
| 199 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.02 | +0.09 | −0.03 | 0.4 | no clear effect |  |
| 200 | Tremor | 1 | Class | kineticist | save | +0.03 ± 0.02 | +0.05 | +0.01 | 0.3 | no clear effect |  |
| 201 | Rock The Boat | 8 | Class | fighter | check | +0.03 ± 0.01 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 202 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 203 | Shadow's Web | 14 | Class | monk | focus spell: Shadow's Web (rank 7) | +0.03 ± 0.03 | −0.01 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 204 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.03 ± 0.03 | +0.08 | −0.02 | 1.5 | no clear effect |  |
| 205 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 206 | Part the Veil | 0 | Action | — | check | +0.03 ± 0.03 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 207 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.05 | +0.01 | 1.2 | no clear effect |  |
| 208 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 209 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | +0.03 ± 0.02 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 210 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 211 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 212 | Rend Mimicry | 4 | Class | — | check | +0.03 ± 0.02 | +0.03 | +0.03 | 1.5 | no clear effect |  |
| 213 | Benevolent Spirit Deck | 6 | Class | — | effect | +0.03 ± 0.01 | +0.02 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 214 | Enchanting Shot | 8 | Class | — | Strike activity | +0.03 ± 0.04 | +0.08 | −0.02 | 2.2 | no clear effect |  |
| 215 | Flensing Slice | 8 | Class | — | check | +0.03 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 216 | Psi Catastrophe | 12 | Class | psychic | save | +0.03 ± 0.04 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 217 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 218 | Megaton Strike | 4 | Class | inventor | Strike activity | +0.03 ± 0.06 | +0.07 | −0.02 | 1.7 | no clear effect |  |
| 219 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 220 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.11 | −0.05 | 1.8 | no clear effect |  |
| 221 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 222 | Subjugation | 16 | Class | — | save | +0.03 ± 0.02 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 223 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | +0.03 ± 0.01 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 224 | Tidal Hands | 1 | Class | kineticist | save | +0.03 ± 0.02 | +0.05 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.03 ± 0.03 | −0.02 | +0.07 | 1.5 | no clear effect |  |
| 226 | Lesson of Mutual Gambits | 8 | Class | — | check | +0.02 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 227 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 228 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 229 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 230 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.03 | +0.04 | +0.01 | 0.2 | no clear effect |  |
| 231 | Reversing Charge | 8 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 232 | Stranglehold | 9 | Ancestry | — | check | +0.02 ± 0.03 | +0.04 | +0.01 | 2.9 | no clear effect |  |
| 233 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.02 ± 0.03 | −0.01 | +0.06 | 0.8 | no clear effect |  |
| 234 | Second Sting | 12 | Class | ranger | Strike activity | +0.02 ± 0.03 | +0.09 | −0.05 | 7.2 | no clear effect | with two weapons (longsword and shortsword) |
| 235 | Stumbling Stance | 1 | Class | monk | stance | +0.02 ± 0.03 | +0.06 | −0.01 | 0.6 | no clear effect |  |
| 236 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.2 | no clear effect |  |
| 237 | Sanguivolent Roots | 8 | Class | kineticist | save | +0.02 ± 0.04 | +0.02 | +0.03 | 0.4 | no clear effect |  |
| 238 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 239 | Propulsive Leap | 10 | Class | — | save | +0.02 ± 0.04 | +0.05 | −0.00 | 2.1 | no clear effect |  |
| 240 | Call the Hurricane | 8 | Class | kineticist | save | +0.02 ± 0.07 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 241 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.02 ± 0.04 | +0.11 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 242 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.05 | −0.01 | 11.3 | no clear effect | with a one-handed weapon and a free hand |
| 243 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 244 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 245 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 246 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 247 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | +0.02 ± 0.03 | +0.03 | +0.01 | 2.8 | no clear effect |  |
| 248 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 249 | All Shall End in Flames | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 250 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 251 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 252 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 253 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 254 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 255 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 256 | Driving Rain | 6 | Class | kineticist | save | +0.02 ± 0.06 | −0.08 | +0.12 | 0.4 | no clear effect |  |
| 257 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.02 ± 0.02 | +0.05 | −0.01 | 1.5 | no clear effect |  |
| 258 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | +0.02 ± 0.01 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 259 | Wolf Stance | 1 | Class | monk | effect | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 260 | Tiger Stance | 1 | Class | monk | effect | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 261 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 262 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.04 | +0.08 | 4.9 | no clear effect | with two weapons (longsword and shortsword) |
| 263 | Feathered Flechettes | 6 | Class | — | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Breath of Hungry Death | 16 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.4 | no clear effect |  |
| 265 | Wind Caller | 8 | Class | druid | focus spell: Stormwind Flight (rank 4) | +0.02 ± 0.04 | +0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 266 | Silencing Strike | 10 | Class | barbarian | save | +0.02 ± 0.01 | +0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 267 | Vindictive Thoughts | 16 | Class | — | save | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 268 | Protect the Royal Line | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 271 | Tempo Shift | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 272 | Absolve Sins | 16 | Class | — | save | +0.02 ± 0.02 | +0.03 | +0.01 | 0.2 | no clear effect |  |
| 273 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 274 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.2 | no clear effect |  |
| 275 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.02 ± 0.02 | −0.00 | +0.04 | 1.4 | no clear effect |  |
| 276 | To Me! | 18 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 0.5 | no clear effect |  |
| 277 | Glimpse Vulnerability | 0 | Action | — | effect | +0.02 ± 0.01 | +0.03 | +0.00 | 0.3 | no clear effect |  |
| 278 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | +0.02 ± 0.02 | +0.04 | −0.00 | 0.3 | no clear effect |  |
| 279 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | +0.02 ± 0.06 | +0.06 | −0.03 | 1.0 | no clear effect |  |
| 280 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect |  |
| 281 | Aerial Boomerang | 1 | Class | kineticist | save | +0.02 ± 0.02 | +0.05 | −0.01 | 0.3 | no clear effect |  |
| 282 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 283 | Overwhelming Blow | 16 | Class | fighter | Strike activity | +0.02 ± 0.02 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 284 | Archer's Aim | 8 | Class | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 285 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | +0.02 ± 0.02 | +0.03 | +0.00 | 0.4 | no clear effect |  |
| 286 | Thrash | 8 | Class | barbarian | save | +0.02 ± 0.01 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 287 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 288 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | +0.02 ± 0.01 | −0.00 | +0.03 | 0.2 | no clear effect |  |
| 289 | Steal Time | 10 | Class | — | save | +0.02 ± 0.02 | +0.06 | −0.02 | 0.3 | no clear effect |  |
| 290 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.02 ± 0.03 | +0.02 | +0.01 | 2.8 | no clear effect |  |
| 291 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.03 | −0.00 | 1.7 | no clear effect |  |
| 292 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | +0.02 ± 0.01 | +0.01 | +0.02 | 0.3 | no clear effect |  |
| 293 | Flower Street Infamy | 11 | Skill | — | check | +0.02 ± 0.02 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 294 | Hail of Splinters | 1 | Class | kineticist | save | +0.02 ± 0.02 | +0.04 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 295 | Walk Through the Conflagration | 14 | Class | kineticist | save | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 296 | Repel Ambient Magic | 0 | Action | — | effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 297 | Call Hellfire | 8 | Class | — | save | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 298 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | +0.01 ± 0.01 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 299 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | +0.01 ± 0.03 | +0.05 | −0.02 | 0.3 | no clear effect |  |
| 300 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.02 | +0.05 | −0.02 | 0.6 | no clear effect |  |
| 301 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.03 | 0.7 | no clear effect |  |
| 302 | Rain of Bolts | 9 | Ancestry | — | save | +0.01 ± 0.02 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 303 | Unbreaking Castle | 10 | Class | — | effect | +0.01 ± 0.05 | −0.04 | +0.07 | 4.3 | no clear effect | with a weapon and a shield |
| 304 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 305 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.01 ± 0.01 | +0.01 | +0.02 | 0.7 | no clear effect |  |
| 306 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.03 | +0.00 | +0.03 | 0.3 | no clear effect |  |
| 307 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.01 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 308 | Abrasive Drag | 12 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 309 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 310 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 311 | Roiling Mudslide | 6 | Class | kineticist | save | +0.01 ± 0.03 | +0.06 | −0.03 | 0.4 | no clear effect |  |
| 312 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.01 ± 0.05 | −0.01 | +0.03 | 5.8 | no clear effect |  |
| 313 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 314 | Kraken's Call | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 315 | Spirit's Wrath | 12 | Class | barbarian | check | +0.01 ± 0.02 | −0.01 | +0.04 | 1.1 | no clear effect |  |
| 316 | Trial by Skyfire | 10 | Class | oracle | save | +0.01 ± 0.01 | +0.01 | +0.01 | 0.2 | no clear effect |  |
| 317 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 318 | Launch Fireworks | 0 | Action | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 319 | Disarming Assault | 8 | Class | barbarian | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 320 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 321 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 322 | Sky and Heaven Stance | 6 | Class | — | stance | +0.01 ± 0.06 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 323 | Trance of Celerity | 1 | Class | oracle | effect | +0.01 ± 0.01 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 324 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.02 | +0.04 | −0.02 | 0.5 | no clear effect |  |
| 325 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.1 | no clear effect |  |
| 326 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 327 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | +0.01 ± 0.01 | +0.02 | +0.00 | 0.1 | no clear effect |  |
| 328 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.1 | no clear effect |  |
| 329 | Trip | 0 | Action | — | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 330 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 331 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 332 | Necrotic Bomber | 4 | Class | — | focus spell: Necrotic Bomb (rank 2) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.6 | no clear effect |  |
| 333 | Sleeper Hold | 10 | Class | monk | check | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 334 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 335 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.8 | no clear effect |  |
| 336 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | +0.01 ± 0.07 | +0.02 | −0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 337 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.8 | no clear effect | with a one-handed weapon and a free hand |
| 338 | Clobber | 16 | Class | guardian | Strike activity | +0.01 ± 0.02 | +0.00 | +0.01 | 1.0 | no clear effect |  |
| 339 | Feral Mending | 8 | Class | — | check | +0.01 ± 0.03 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 340 | Tenacious Stance | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 341 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.01 ± 0.01 | −0.01 | +0.03 | 0.3 | no clear effect |  |
| 342 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 343 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.00 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 344 | Cover Fire | 1 | Class | gunslinger | Strike activity | +0.01 ± 0.01 | +0.00 | +0.01 | 0.8 | no clear effect |  |
| 345 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 346 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | +0.01 ± 0.02 | −0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 348 | Draw From the Land | 10 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 351 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 352 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 2.1 | no clear effect |  |
| 353 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 354 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 357 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 358 | Plane Step | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Ferocious Gust | 9 | Ancestry | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Crimson Shroud | 6 | Class | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 361 | Quill Spray | 9 | Ancestry | — | save | +0.01 ± 0.03 | −0.04 | +0.06 | 0.1 | no clear effect |  |
| 362 | Purifying Breeze | 14 | Class | cleric | effect | +0.01 ± 0.01 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 363 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 364 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 365 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 366 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 367 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 368 | Deathly Scream | 2 | Class | — | focus spell: Deathly Scream (rank 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.5 | no clear effect |  |
| 369 | Knockback Strike | 10 | Class | monk | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 370 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 371 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 372 | Shame the Sin | 5 | Ancestry | — | check | +0.01 ± 0.00 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 373 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect |  |
| 374 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 375 | Dashing Strike | 12 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 376 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | +0.01 ± 0.02 | +0.00 | +0.01 | 0.2 | no clear effect |  |
| 377 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.01 ± 0.03 | −0.00 | +0.01 | 1.4 | no clear effect |  |
| 378 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 379 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 380 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 381 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 382 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 383 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 384 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 385 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 386 | Cleansing Light | 17 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 387 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 388 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 389 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.01 ± 0.00 | +0.00 | +0.01 | 0.3 | no clear effect |  |
| 390 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 391 | Flying Tackle | 4 | Class | guardian | check | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 393 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 394 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.7 | no clear effect |  |
| 395 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | +0.00 ± 0.01 | −0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 396 | Invoke the Crimson Oath | 8 | Class | — | focus spell: Invoke the Crimson Oath (rank 4) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 398 | Dragonet Breath | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Alluring Performance | 9 | Ancestry | — | check | +0.00 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 400 | Weakening Assault | 12 | Class | guardian | 2 Strikes | +0.00 ± 0.02 | +0.00 | +0.01 | 4.0 | no clear effect |  |
| 401 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.00 ± 0.01 | +0.01 | −0.00 | 1.5 | no clear effect |  |
| 403 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | +0.00 ± 0.01 | +0.01 | −0.00 | 0.1 | no clear effect |  |
| 404 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.00 ± 0.01 | −0.00 | +0.01 | 2.3 | no clear effect |  |
| 405 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 406 | Gift of the Hoard | 10 | Class | — | focus spell: Dragon Breath (rank 5) | +0.00 ± 0.02 | −0.00 | +0.01 | 0.4 | no clear effect |  |
| 407 | Distracting Spellstrike | 4 | Class | magus | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 410 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 411 | Bony Barrage | 4 | Class | — | focus spell: Bony Barrage (rank 2) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 412 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 413 | Scorching Column | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 414 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 415 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 416 | Glacial Prison | 12 | Class | kineticist | save | +0.00 ± 0.07 | +0.01 | +0.00 | 0.9 | no clear effect |  |
| 417 | Parting Shot | 4 | Class | fighter | Strike activity | +0.00 ± 0.01 | −0.00 | +0.01 | 0.2 | no clear effect | with a bow in hand |
| 418 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.2 | no clear effect |  |
| 419 | Warped Constriction | 8 | Class | — | save | +0.00 ± 0.03 | +0.02 | −0.01 | 2.3 | no clear effect |  |
| 420 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 421 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 422 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 423 | Boulder Roll | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 424 | Too Angry to Die | 12 | Skill | — | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Decree of War | 18 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 426 | Draconic Fury | 4 | Class | — | save | +0.00 ± 0.01 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 427 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 428 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 429 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Diamond Soul | 12 | Class | monk | save-bonus | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect |  |
| 435 | Masked Casting | 8 | Class | — | self effect | +0.00 ± 0.01 | −0.01 | +0.01 | 2.6 | no clear effect |  |
| 436 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 437 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 438 | Siegebreaker | 0 | Action | gunslinger | Strike activity | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 439 | Impossible Volley | 18 | Class | fighter | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 440 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 441 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 442 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 443 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 444 | Fearful Symmetry | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 445 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 446 | Pit of Snakes | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 447 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.00 ± 0.02 | −0.01 | +0.02 | 1.3 | no clear effect |  |
| 448 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 449 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | +0.00 ± 0.03 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 450 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Unleash the Blight | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Emotional Surge | 10 | Class | psychic | effect | +0.00 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 453 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Frighten Undead | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Crossbow Terror | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Thunder Clap | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 462 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 463 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 464 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 465 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 466 | Spinebreaker | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 467 | Ensnaring Wrappings | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 470 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Running Tackle | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Opportunistic Grapple | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Submission Hold | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Raise Slabs | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 475 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 477 | Glory on High | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Instant Recovery | 0 | Action | — | healing | +0.00 ± 0.01 | −0.01 | +0.02 | 0.2 | no clear effect |  |
| 479 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 485 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 492 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 494 | Shackles of Law | 0 | Bonus | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Draconic Resilience | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Twin Parry | 4 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Rain of Embers Stance | 1 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 500 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Offer Story | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | +0.00 ± 0.01 | −0.01 | +0.01 | 0.1 | no clear effect |  |
| 503 | Grovel | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 505 | Channel Divine Spark | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Drain Vitality | 10 | Class | — | check | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 509 | Blessed Sentinel | 6 | Class | — | Strike activity | +0.00 ± 0.01 | +0.01 | −0.01 | 0.1 | no clear effect |  |
| 510 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 512 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Flash Your Badge | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 516 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 517 | Tumbling Opportunist | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 520 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Staff Sweep | 6 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 525 | Demon Slayer | 17 | Ancestry | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | +0.00 ± 0.01 | +0.02 | −0.02 | 0.2 | no clear effect |  |
| 527 | Mixed Maneuver | 8 | Class | monk | check | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 529 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 531 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 532 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 533 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 535 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 537 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Ironblood Stance | 8 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 542 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 543 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 544 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Roar Mimicry | 12 | Class | — | save | +0.00 ± 0.02 | +0.02 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 546 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 548 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Haunting Visage | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 553 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Primal Roar | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 556 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Threatening Approach | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Friendly Nudge | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Bounce Boost | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Plane-Stepping Dash | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Terrifying Croak | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Sudden Terror | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Play Dead | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Unstable Gearshift | 6 | Class | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.5 | no clear effect |  |
| 570 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | +0.00 ± 0.03 | −0.03 | +0.03 | 0.3 | no clear effect |  |
| 572 | Called Shot | 10 | Class | gunslinger | Strike activity | +0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 575 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 578 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 583 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 586 | Lantern Strobe | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 591 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 594 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 600 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 605 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 608 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 610 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 611 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 612 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 613 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 616 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 619 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 621 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 623 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 624 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 625 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 627 | Vengeful Remnant | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 630 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 632 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 633 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 634 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 636 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 637 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 638 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 639 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 640 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 641 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 642 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 643 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 644 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 645 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 648 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 649 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 650 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 651 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 652 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 653 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 654 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 656 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 658 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 659 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 660 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 661 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 662 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 663 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 664 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 665 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 668 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 669 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 670 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 671 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 672 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 674 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 675 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 676 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 677 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 678 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 680 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 681 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 682 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 684 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 685 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 686 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 688 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 689 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 691 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 692 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 693 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 695 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 696 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 697 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 698 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 699 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 701 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 703 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 704 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 705 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 706 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 707 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 708 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 709 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 711 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 713 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 714 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 715 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Primadonna | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 718 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 720 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 722 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 724 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 726 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 727 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 729 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 730 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 733 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 735 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 736 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 737 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 738 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 740 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 741 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 743 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 746 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 747 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 749 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 750 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 752 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 753 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 754 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 756 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 757 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 762 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 765 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 767 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 768 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 769 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 770 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 771 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 772 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 774 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 779 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 789 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 790 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 800 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 801 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 803 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 805 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 808 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 811 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 812 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 813 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 814 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 815 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 816 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 818 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 819 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 822 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 826 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 830 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 832 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 834 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 840 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 841 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 843 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 846 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 848 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 851 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | Animal Summoner | 9 | Ancestry | — | innate spell: Summon Animal (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 853 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Labyrinthine Echoes | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 855 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 857 | Animal Soul Siblings | 5 | Ancestry | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 858 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Enter Divine Realm | 20 | Class | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Ghoran's Wrath | 17 | Ancestry | — | innate spell: Nature's Reprisal (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Summon Air Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Impossible Gossip | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Bend Space | 17 | Ancestry | — | innate spell: Teleport (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Call Draconic Ally | 14 | Class | — | innate spell: Summon Dragon (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Brightness Seeker | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Rat Magic | 5 | Ancestry | — | innate spell: Animal Messenger (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 879 | Water Conjuration | 5 | Ancestry | — | innate spell: Create Water (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Pierce the Light | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Shadow Pact | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 885 | Stone Guardian | 4 | Class | — | innate spell: Summon Elemental (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 886 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Arboreal Conversationalist | 13 | Ancestry | — | innate spell: Speak with Plants (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 888 | Irriseni Ice-Witch | 13 | Ancestry | — | innate spell: Wall of Ice (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 890 | Frightful Figment | 1 | Ancestry | — | innate spell: Figment (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Stem the Tide | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Reimagine | 13 | Ancestry | — | innate spell: Dreaming Potential (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Kijimuna Whistle | 13 | Ancestry | — | innate spell: Summon Plant or Fungus (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Arcane Sense | 1 | Skill | — | innate spell: Detect Magic (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Splendid Illusion | 13 | Ancestry | — | innate spell: Illusory Scene (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Astral Blink | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Patron's Whisper | 10 | Class | — | innate spell: Message (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 905 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Lorefinder | 8 | Class | — | innate spell: Locate (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | The Moon Weaver's Art | 5 | Ancestry | — | innate spell: Illusory Object (rank 1), Invisible Item (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | Summon Fire Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Aberration Kinship | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | None Shall Know | 13 | Ancestry | — | innate spell: Veil of Privacy (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 914 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 916 | Realm Strider | 16 | Class | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 918 | Skirt the Light | 13 | Ancestry | — | innate spell: Umbral Journey (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Soul Vessel Mount | 18 | Class | — | innate spell: Seize Soul (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 923 | Prophet's Lockbox | 10 | Class | — | innate spell: Imaginary Lockbox (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 925 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Flower Chimera | 13 | Ancestry | — | innate spell: Spiritual Guardian (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 931 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Boneyard Acquaintance | 17 | Ancestry | — | innate spell: Spiritual Guardian (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 934 | Summon Water Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 935 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 936 | Share Thoughts | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 939 | Leave no Trace | 5 | Ancestry | — | innate spell: Vanishing Tracks (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 941 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 942 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Truespeech | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 945 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 946 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 947 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 949 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Axial Recall | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 952 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 953 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 954 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | Fossil Rider | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Night Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Mist (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Unfettering Prankster | 17 | Ancestry | — | innate spell: Unfettered Pack (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 960 | Summon Metal Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Beast Speaker | 4 | Class | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Kizidhar Magic | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 965 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 968 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | Fey Life | 16 | Class | — | innate spell: Summon Fey (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 970 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Tree's Ward | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Borrow Memories | 14 | Class | — | innate spell: Mind Probe (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 973 | Into the Labyrinth | 17 | Ancestry | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Stonewalker | 9 | Ancestry | — | innate spell: One with Stone (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Call Ursine Ally | 8 | Class | — | innate spell: Summon Animal (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Persistent Creation | 8 | Class | — | innate spell: Creation (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 977 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 979 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 980 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Azaersi's Roads | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 982 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 983 | Summon Earth Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 986 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 987 | Summon Wood Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 989 | Plant Soul Siblings | 9 | Ancestry | — | innate spell: Speak with Plants (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 990 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 991 | Grandmother's Wisdom | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 992 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 993 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 994 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 995 | Stone Soul Siblings | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 996 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 997 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 998 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 999 | Thrown Voice | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1000 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1001 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1002 | Avatar's Audience | 20 | Class | cleric | innate spell: Commune (rank 6), Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1003 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1004 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1005 | Distant Cackle | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1006 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1007 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1008 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Call the Worm | 18 | Class | — | innate spell: Summon Animal (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1011 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1013 | Fade Away | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Disguise Magic (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1014 | Whispers in the Night | 9 | Ancestry | — | innate spell: Darkness (rank 2), Ventriloquism (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1015 | Terrifying Countenance | 18 | Class | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1016 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1017 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1018 | Slip Sideways | 13 | Ancestry | — | innate spell: Translocate (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1021 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1022 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1023 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1024 | Analyze Information | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | River Adaptation | 9 | Ancestry | — | innate spell: Feet to Fins (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1026 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1027 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1028 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Light-Bending Jewel | 13 | Ancestry | — | innate spell: Invisibility (rank 2), Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1031 | Ascendant Blood | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1033 | Jotun's Transposition | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Skeletal Transformation | 13 | Ancestry | — | innate spell: Animal Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Azarketi Purification | 9 | Ancestry | — | innate spell: Cleanse Cuisine (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1036 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1037 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1038 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1039 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1040 | Homeward Bound | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1041 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1042 | Stonegate | 17 | Ancestry | — | innate spell: Magic Passage (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Ancestral Form | 9 | Ancestry | — | innate spell: Animal Form (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1044 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1045 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1046 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1047 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1048 | Devil Allies | 0 | Bonus | — | innate spell: Summon Fiend (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1049 | Boneyard's Call | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1050 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1051 | Unrivaled Builder | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1052 | Secrets of the Past | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1053 | Fearsome Form | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1054 | Wall of Roses | 8 | Class | — | innate spell: Wall of Thorns (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1055 | Siphon Torment | 9 | Ancestry | — | innate spell: Claim Curse (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1056 | Cloud Walk | 10 | Class | — | innate spell: Air Walk (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1057 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1058 | Moon May | 1 | Ancestry | — | innate spell: Guidance (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1059 | Linguistic Revival | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1060 | No Hands, No Problem | 5 | Ancestry | — | innate spell: Telekinetic Hand (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1061 | Bone Investiture | 13 | Ancestry | — | innate spell: Dinosaur Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1062 | Spiritual Headhunter | 13 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1063 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1064 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1065 | Soul Warden Dedication | 2 | Class | — | innate spell: Vitality Lash (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1066 | Ancestor's Rage | 13 | Ancestry | — | innate spell: Animal Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1067 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1068 | Water to Water | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1069 | Dig up Secrets | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1070 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1071 | Lingering Echoes | 9 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1072 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1073 | Shared Dream | 16 | Class | — | innate spell: Dream Council (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1074 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1075 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 2.0 | no clear effect |  |
| 1076 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1077 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1078 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1079 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1080 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1081 | Unseen Passage | 8 | Class | gunslinger | innate spell: Vanishing Tracks (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1082 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1083 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1084 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1085 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1086 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1087 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1088 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1089 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1090 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 1091 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1092 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1093 | Dazzling Block | 10 | Class | magus | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1094 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1096 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1097 | Final Spite | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1098 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1099 | Maze of Runes | 16 | Class | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1100 | Armored Courage | 4 | Class | guardian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1101 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1102 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1103 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1104 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1105 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1106 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1107 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1108 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1109 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1110 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1111 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1112 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1113 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1114 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1115 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1116 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1117 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1118 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1119 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1120 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1121 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1122 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1123 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1124 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1125 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1126 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1127 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1128 | Writing On the Wall | 4 | Class | — | innate spell: Embed Message (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1129 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1130 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1131 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1132 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1133 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1134 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1135 | Bone Burst | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1136 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1137 | Hallowed Necromancer Dedication | 2 | Class | — | focus spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1138 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1139 | Speaking Sky | 12 | Class | — | focus spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1140 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1141 | Wind Jump | 10 | Class | monk | focus spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1142 | Conjurer's Countermeasure | 6 | Class | magus | focus spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1143 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1144 | Gaze of Veracity | 10 | Class | — | focus spell: Glimpse the Truth (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1145 | Cultivator Dedication | 2 | Class | — | focus spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1146 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1147 | Disciple of Shade | 6 | Class | — | focus spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1148 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1149 | Harmonize Self | 4 | Class | monk | focus spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1150 | Wings of the Dragon | 12 | Class | — | focus spell: Dragon Wings (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1151 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1152 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1153 | Polished Distraction | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1154 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1155 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1156 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1157 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1158 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1159 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1160 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Reactive Striker | 4 | Class | — | Reactive Strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1162 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1163 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1164 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1166 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1167 | Flying Flame | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1168 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1169 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1170 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1171 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1172 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1173 | Push Back the Dead! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1174 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1175 | Defiant Banner | 8 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1176 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1177 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1178 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1179 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1180 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1181 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1182 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1183 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1184 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1185 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1186 | Witchwood Seed | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1187 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1188 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1189 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1190 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1191 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1192 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1193 | Share Rage | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1194 | Assume Earth's Mantle | 14 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1195 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1196 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1197 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1198 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1199 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 1200 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1201 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1202 | Soothing Ballad | 14 | Class | bard | focus spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1203 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1204 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1205 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1206 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1207 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1208 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1209 | Stunt Performer Stance | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1210 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1211 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1212 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1213 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1214 | Cobra Stance | 4 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1215 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1216 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1217 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1218 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1219 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1220 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1221 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1222 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1223 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1224 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1225 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1226 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 1227 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1228 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1229 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1230 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1231 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1232 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 1233 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1234 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1235 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1236 | Fade Into Daydreams | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1237 | Valkyrie's Charge | 0 | Action | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1238 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1239 | Restore the Mind | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1240 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1241 | Drag Down | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1242 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1243 | Toppling Transformation | 6 | Class | druid | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1244 | You Can't Keep Us Down | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1245 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1246 | Call to Battle | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1247 | Self Destruct | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1248 | Align Qi | 6 | Class | monk | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1249 | Hop Up | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1250 | Rallying Cry | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1251 | Banner Twirl | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1252 | Pistol Twirl | 2 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1253 | Cadence Call | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1254 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1255 | Prayer Attack | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1256 | Heat Wave | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1257 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1258 | Even the Odds (Eagle Knight) | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1259 | Calaca's Showstopper | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1260 | Daring Act | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1261 | Deific Font | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1262 | Threatening Pursuit | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1263 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1264 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1265 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1266 | Extraplanar Haze | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1267 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1268 | Spark of Independence | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1269 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1270 | The Dead Walk | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1271 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1272 | Kip Up | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1273 | Clear the Way | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1274 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1275 | Jotun's Grasp | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1276 | Say That Again! | 6 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1277 | Disarming Intercept | 6 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1278 | It Was Me All Along! | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1279 | Now You See Me | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1280 | Repulse the Wicked | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1281 | Get Used to Disappointment | 12 | Class | swashbuckler | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1282 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1283 | Quick Root | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1284 | Reclaim Power | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1285 | Flourishing Finish | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1286 | Talmandor's Shout | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1287 | Armored Rebuff | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1288 | Waters of Creation | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1289 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1290 | Steal for the Depths | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1291 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1292 | Propelled Leap | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1293 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1294 | Statue | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1295 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1296 | Storm Shroud | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1297 | Brandish Authority | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1298 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1299 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1300 | Spirit's Sacrifice | 18 | Class | animist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1301 | Idol Threat | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1302 | Shield Wall | 6 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1303 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1304 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1305 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1306 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1307 | Flickering Twirl | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1308 | Nanite Shroud | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1309 | Pouncing Transformation | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1310 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1311 | Body Barrier | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1312 | Song of Glorious Invocation | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1313 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1314 | Voice Cold as Death | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1315 | Wing Shove | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1316 | Drive Back | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1317 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1318 | Warning Shot | 2 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1319 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1320 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1321 | Shove Down | 6 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1322 | Scattering Charge | 12 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1323 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1324 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1325 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1326 | Dazing Blow | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 1327 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 1328 | Wing Bounce | 4 | Class | — | check | −0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1329 | Silk Bracelet | 6 | Class | inventor | save | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1330 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1331 | Dominion Aura | 17 | Ancestry | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1332 | One Moment till Glory | 0 | Action | — | effect | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1333 | I Will Return | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 1334 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1335 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1336 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.00 ± 0.01 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1337 | Majestic Proclamation | 8 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1338 | Walk the Plank | 8 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1339 | Death of Hope | 17 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1340 | Overclock Senses | 2 | Class | — | PF2e's self Effect | −0.00 ± 0.00 | +0.00 | −0.00 | 1.3 | no clear effect |  |
| 1341 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1342 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1343 | Coordinated Charge | 12 | Class | — | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 1344 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1345 | Bestial Snarling | 2 | Class | bard | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1346 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1347 | Tail Spin | 5 | Ancestry | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 1348 | Dread Mosquito Storm | 18 | Class | — | focus spell: Dread Mosquito Storm (rank 9) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1349 | Spirit Guide Form | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1350 | Raise the Walls | 0 | Action | — | effect | −0.00 ± 0.02 | +0.01 | −0.01 | 0.7 | no clear effect |  |
| 1351 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1352 | Gluttonous Feast | 0 | Action | — | save | −0.00 ± 0.02 | +0.01 | −0.01 | 0.8 | no clear effect |  |
| 1353 | Fungal Exhalation | 6 | Class | druid | focus spell: Fungal Exhalation (rank 3) | −0.00 ± 0.02 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1354 | Puncture Flesh | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1355 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1356 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 1357 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1358 | Tamper | 1 | Class | inventor | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1359 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 1360 | Putrefaction | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1361 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.00 ± 0.03 | −0.00 | −0.00 | 0.6 | no clear effect |  |
| 1362 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.00 ± 0.01 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1363 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.00 ± 0.02 | +0.02 | −0.02 | 0.7 | no clear effect |  |
| 1364 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.00 ± 0.03 | +0.00 | −0.01 | 1.7 | no clear effect |  |
| 1365 | Slam Down | 4 | Class | fighter | Strike activity | −0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1366 | Wheeling Grab | 6 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1367 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1368 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1369 | Topple Foe | 10 | Class | — | check | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1370 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1371 | Mind Shards | 6 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1372 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1373 | Construct Dynamo | 12 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1374 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1375 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1376 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1377 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1378 | Kobold Breath | 1 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1379 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.00 ± 0.04 | +0.03 | −0.04 | 0.9 | no clear effect |  |
| 1380 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1381 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1382 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1383 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1384 | Hammer Quake | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1385 | Jellyfish Stance | 8 | Class | monk | effect | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1386 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1387 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1388 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1389 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1390 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1391 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1392 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1393 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1394 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1395 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1396 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1397 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1398 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1399 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1400 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1401 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1402 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1403 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1404 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.02 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 1405 | Golden Body | 20 | Class | monk | fast-healing | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1406 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.01 | 1.3 | no clear effect |  |
| 1407 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.3 | no clear effect |  |
| 1408 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1409 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1410 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1411 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1412 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1413 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1414 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1415 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1416 | Haft Striker Stance | 4 | Class | fighter | stance | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1417 | Dread Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1418 | Blood Calls Blood | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1419 | Face Your Fears | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1420 | Disengaging Twist | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1421 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1422 | Slayer's Strike | 4 | Class | — | Strike activity | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1423 | Rising Hurricane | 6 | Class | kineticist | save | −0.00 ± 0.02 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1424 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1425 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.00 ± 0.01 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 1426 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect |  |
| 1427 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.00 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1428 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1429 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1430 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1431 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.00 ± 0.03 | −0.01 | +0.00 | 2.3 | no clear effect |  |
| 1432 | Reactive Tangle | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1433 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1434 | Stasian Smash | 8 | Class | — | Strike activity | −0.00 ± 0.01 | +0.01 | −0.02 | 0.3 | no clear effect |  |
| 1435 | Zealous Inevitability | 6 | Class | — | Strike activity | −0.01 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1436 | Unbalancing Sweep | 12 | Class | barbarian | check | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1437 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.01 ± 0.01 | −0.01 | −0.00 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1438 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.3 | no clear effect |  |
| 1439 | Lead by Example | 8 | Class | — | Strike activity | −0.01 ± 0.01 | +0.01 | −0.02 | 1.0 | no clear effect |  |
| 1440 | Manifold Conduit | 12 | Class | — | focus spell: Entreat the Many (rank 6) | −0.01 ± 0.05 | +0.03 | −0.05 | 1.0 | no clear effect |  |
| 1441 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.03 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 1442 | Muckraking | 16 | Class | — | save | −0.01 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1443 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1444 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1445 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 1446 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 1447 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1448 | Bone Swarm | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1449 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | +0.08 | −0.09 | 0.7 | no clear effect |  |
| 1450 | Whirling Throw | 6 | Class | monk | check | −0.01 ± 0.01 | +0.01 | −0.02 | 0.4 | no clear effect |  |
| 1451 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1452 | Trample Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1453 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.01 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1454 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.01 ± 0.05 | +0.08 | −0.09 | 1.0 | no clear effect |  |
| 1455 | Freeze It! | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 1456 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 1457 | Frightening Indignation | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1458 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1459 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.01 ± 0.02 | +0.00 | −0.02 | 3.5 | no clear effect |  |
| 1460 | Radiant Burst | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1461 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.01 ± 0.02 | +0.00 | −0.01 | 0.5 | no clear effect |  |
| 1462 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 1463 | Unending Emptiness | 14 | Class | — | focus spell: Darklight (rank 7) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1464 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1465 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.01 ± 0.02 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 1466 | Chastise | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1467 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1468 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | −0.01 | −0.01 | 0.1 | no clear effect |  |
| 1469 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1470 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1471 | Repair Module | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.00 | 0.2 | no clear effect |  |
| 1472 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1473 | No Scar but This | 0 | Action | — | check | −0.01 ± 0.01 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 1474 | Storming Breath | 6 | Class | — | save | −0.01 ± 0.02 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 1475 | Boarding Assault | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1476 | Break Free | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1477 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1478 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1479 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1480 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1481 | Hedge Prison | 6 | Class | druid | focus spell: Hedge Prison (rank 3) | −0.01 ± 0.02 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1482 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1483 | Form a Flock | 13 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1484 | Wing Buffet | 9 | Ancestry | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 1485 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.01 ± 0.02 | +0.00 | −0.02 | 0.8 | no clear effect |  |
| 1486 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1487 | Flash of Omnipresence | 14 | Class | — | save | −0.01 ± 0.01 | −0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1488 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1489 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.02 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1490 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 1491 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.01 ± 0.01 | −0.00 | −0.02 | 0.8 | no clear effect |  |
| 1492 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.01 ± 0.02 | −0.01 | −0.01 | 0.5 | no clear effect |  |
| 1493 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1494 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1495 | Pack Attack | 6 | Class | — | strike-extra | −0.01 ± 0.04 | −0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 1496 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1497 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1498 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1499 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1500 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.02 | +0.01 | −0.03 | 0.3 | no clear effect |  |
| 1501 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.01 ± 0.04 | +0.01 | −0.03 | 1.9 | no clear effect | with a spear and a free hand |
| 1502 | Might of the Realm | 14 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1503 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1504 | Untamed Form | 1 | Class | druid | focus spell: Untamed Form (rank 1) | −0.01 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1505 | Cantorian Rejuvenation | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1506 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.01 ± 0.02 | +0.00 | −0.03 | 2.4 | no clear effect |  |
| 1507 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1508 | History of Violence | 14 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.03 | 0.1 | no clear effect |  |
| 1509 | Tap Vitality | 6 | Class | — | check | −0.02 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1510 | Guide the Timeline | 6 | Class | — | effect | −0.02 ± 0.03 | −0.06 | +0.02 | 1.8 | no clear effect |  |
| 1511 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | −0.02 ± 0.07 | +0.04 | −0.07 | 2.0 | no clear effect |  |
| 1512 | Forceful Shot | 14 | Class | — | Strike activity | −0.02 ± 0.01 | −0.01 | −0.03 | 0.3 | no clear effect |  |
| 1513 | Invoke Disaster | 18 | Class | druid | focus spell: Storm Lord (rank 9) | −0.02 ± 0.04 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1514 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.02 ± 0.02 | +0.00 | −0.03 | 0.1 | no clear effect | with two weapons (longsword and shortsword) |
| 1515 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.02 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1516 | Fumigate | 14 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 1517 | Twin Takedown | 1 | Class | ranger | 2 Strikes | −0.02 ± 0.04 | +0.02 | −0.05 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1518 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.02 ± 0.03 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1519 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.05 | 5.2 | no clear effect |  |
| 1520 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.02 ± 0.04 | −0.06 | +0.02 | 2.8 | no clear effect |  |
| 1521 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.02 ± 0.02 | +0.00 | −0.04 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1522 | Fiendish Brand | 6 | Class | — | Strike activity | −0.02 ± 0.01 | −0.00 | −0.03 | 0.3 | no clear effect |  |
| 1523 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1524 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1525 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1526 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1527 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1528 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1529 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1530 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.02 ± 0.01 | −0.04 | +0.01 | 0.2 | no clear effect |  |
| 1531 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.02 ± 0.04 | +0.04 | −0.08 | 2.2 | no clear effect |  |
| 1532 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.02 ± 0.03 | +0.00 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1533 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.02 ± 0.01 | −0.01 | −0.02 | 0.6 | no clear effect |  |
| 1534 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.02 ± 0.02 | +0.02 | −0.06 | 0.3 | no clear effect |  |
| 1535 | Demolish Defenses | 18 | Class | guardian | Strike activity | −0.02 ± 0.05 | −0.09 | +0.06 | 2.2 | no clear effect |  |
| 1536 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1537 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.02 ± 0.02 | −0.03 | −0.01 | 3.3 | no clear effect |  |
| 1538 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 1539 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.02 ± 0.05 | −0.02 | −0.03 | 2.0 | no clear effect |  |
| 1540 | Blood Shield | 4 | Class | — | self effect | −0.02 ± 0.01 | −0.05 | +0.00 | 0.2 | no clear effect |  |
| 1541 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1542 | Scout's Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1543 | Ravenous Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1544 | Interpose | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1545 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.02 ± 0.03 | −0.08 | +0.03 | 0.3 | no clear effect |  |
| 1546 | Aldori Parry | 4 | Class | — | self effect | −0.03 ± 0.02 | −0.05 | +0.00 | 0.3 | no clear effect |  |
| 1547 | Raise Symbol | 4 | Class | cleric | self effect | −0.03 ± 0.01 | −0.05 | +0.00 | 0.4 | no clear effect |  |
| 1548 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1549 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.07 | 2.0 | no clear effect |  |
| 1550 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.03 ± 0.02 | −0.04 | −0.03 | 1.5 | no clear effect |  |
| 1551 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.03 ± 0.03 | +0.00 | −0.06 | 1.2 | no clear effect |  |
| 1552 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.03 ± 0.04 | −0.06 | −0.00 | 1.1 | no clear effect |  |
| 1553 | Recharging Flurry | 4 | Class | magus | 2 Strikes | −0.03 ± 0.05 | −0.07 | −0.00 | 0.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1554 | Herald's Strike | 20 | Class | — | save | −0.04 ± 0.05 | −0.04 | −0.03 | 0.8 | no clear effect |  |
| 1555 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1556 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.04 ± 0.06 | +0.08 | −0.16 | 0.6 | no clear effect |  |
| 1557 | Calculate Threats | 0 | Action | psychic | effect | −0.04 ± 0.03 | −0.09 | +0.01 | 3.5 | no clear effect |  |
| 1558 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.04 | −0.05 | −0.04 | 1.0 | no clear effect |  |
| 1559 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.04 ± 0.02 | +0.01 | −0.09 | 0.1 | no clear effect | with a warhammer and a free hand |
| 1560 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.04 ± 0.03 | +0.04 | −0.12 | 0.9 | no clear effect |  |
| 1561 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.02 | −0.11 | 0.8 | no clear effect |  |
| 1562 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1563 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1564 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1565 | Twist the Knife | 6 | Class | rogue | check | −0.05 ± 0.03 | −0.08 | −0.02 | 1.3 | no clear effect |  |
| 1566 | Waking Dream | 8 | Class | — | focus spell: Waking Dream (rank 4) | −0.05 ± 0.06 | −0.01 | −0.08 | 0.9 | no clear effect |  |
| 1567 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.03 | +0.00 | −0.10 | 0.6 | no clear effect |  |
| 1568 | Gossamer Blade | 4 | Class | — | check | −0.05 ± 0.03 | −0.12 | +0.02 | 2.6 | hurts |  |
| 1569 | Burning Demand | 12 | Class | kineticist | save | −0.05 ± 0.09 | −0.08 | −0.03 | 3.8 | no clear effect |  |
| 1570 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | −0.06 ± 0.07 | −0.21 | +0.10 | 1.0 | no clear effect |  |
| 1571 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1572 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.06 ± 0.05 | +0.07 | −0.19 | 3.3 | no clear effect |  |
| 1573 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1574 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1575 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.07 ± 0.07 | −0.16 | +0.01 | 1.0 | no clear effect |  |
| 1576 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 1577 | Doom of Sailors | 17 | Ancestry | — | save | −0.08 ± 0.04 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 1578 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 2.3 | no clear effect |  |
| 1579 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.08 ± 0.05 | −0.01 | −0.15 | 0.3 | no clear effect |  |
| 1580 | Confusing Commands | 16 | Class | commander | save | −0.09 ± 0.10 | +0.10 | −0.27 | 2.0 | no clear effect |  |
| 1581 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.4 | no clear effect |  |
| 1582 | Fey Cantrips | 1 | Ancestry | — | innate spells: Light (rank 1), Ghost Sound (rank 1), Detect Magic (rank 1), Prestidigitation (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1583 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1584 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.09 ± 0.06 | −0.11 | −0.07 | 2.0 | no clear effect |  |
| 1585 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.09 ± 0.06 | −0.01 | −0.17 | 0.1 | no clear effect |  |
| 1586 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.09 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 1587 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 1588 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.10 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 1589 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.10 ± 0.04 | +0.00 | −0.20 | 0.5 | hurts |  |
| 1590 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | −0.10 ± 0.04 | −0.05 | −0.15 | 0.6 | hurts |  |
| 1591 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.10 ± 0.06 | −0.19 | −0.01 | 0.1 | no clear effect |  |
| 1592 | Tidal Shield | 17 | Ancestry | — | effect | −0.10 ± 0.04 | −0.13 | −0.07 | 2.0 | hurts |  |
| 1593 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.11 ± 0.03 | +0.00 | −0.22 | 0.0 | hurts | the AI never used it |
| 1594 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1595 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1596 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1597 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1598 | Determined Lore Seeker | 12 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1599 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.12 ± 0.06 | −0.22 | −0.02 | 1.6 | no clear effect |  |
| 1600 | Indomitable Spirit | 17 | Ancestry | — | effect | −0.12 ± 0.05 | −0.23 | −0.02 | 2.0 | hurts |  |
| 1601 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.14 ± 0.05 | −0.02 | −0.26 | 10.3 | hurts |  |
| 1602 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 1603 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 1604 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.15 ± 0.06 | −0.14 | −0.16 | 1.0 | hurts |  |
| 1605 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1606 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1607 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.17 ± 0.04 | −0.30 | −0.04 | 1.7 | hurts |  |
| 1608 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1609 | Magical Adaptation | 10 | Class | — | innate spells: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1610 | Greater Magical Scholastics | 10 | Class | — | innate spells: Augury (rank 2), Locate (rank 3), Veil of Privacy (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1611 | Greater Magical Edification | 10 | Class | — | innate spells: Translate (rank 2), Mindlink (rank 1), Secret Page (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1612 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1613 | Magical Edification | 4 | Class | — | innate spells: Guidance (rank 2), Message (rank 2), Sigil (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 1614 | Warding Light | 4 | Class | — | innate spells: Light (rank 2), Peaceful Rest (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 1615 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1616 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1617 | Suli Amir | 13 | Ancestry | — | innate spells: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1618 | Summon Nephilim Kin | 13 | Ancestry | — | innate spells: Summon Celestial (rank 5), Summon Fiend (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1619 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1620 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.19 ± 0.06 | −0.31 | −0.06 | 0.2 | hurts |  |
| 1621 | Entities From Afar | 14 | Class | — | innate spells: Summon Entity (rank 5), Read Omens (rank 4) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1622 | Commandeer Hellmouth | 14 | Class | — | innate spells: Teleport (rank 6), Interplanar Teleport (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1623 | Expanded Runelord Magic | 14 | Class | — | innate spells: Contingency (rank 7), Spell Riposte (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1624 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.22 | −0.16 | 0.4 | hurts |  |
| 1625 | Form of the Beloved Mother | 17 | Ancestry | — | innate spells: Animal Form (rank 5), Slither (rank 5) | −0.19 ± 0.06 | −0.21 | −0.17 | 0.0 | hurts | the AI never used it |
| 1626 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1627 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spells: Repulsion (rank 6), Spellwrack (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1628 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1629 | Flourish and Ruin | 17 | Ancestry | — | innate spells: Field of Life (rank 6), Tangling Creepers (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1630 | Wildborn Adept | 5 | Ancestry | — | innate spells: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 1631 | Colugo's Traversal | 5 | Ancestry | — | innate spells: Gentle Landing (rank 1), Jump (rank 1) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 1632 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.20 ± 0.04 | −0.32 | −0.08 | 0.0 | hurts | the AI never used it |
| 1633 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1634 | Animal Magic | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1635 | Agathion Magic | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1636 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spells: Augury (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1637 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.21 ± 0.06 | −0.21 | −0.22 | 0.0 | hurts | the AI never used it |
| 1638 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spells: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.21 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1639 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1640 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.22 ± 0.05 | −0.35 | −0.08 | 0.2 | hurts |  |
| 1641 | Apprentice Sea Witch | 5 | Ancestry | — | innate spells: Create Water (rank 1), Hydraulic Push (rank 1) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1642 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 1643 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 1644 | Phantom Orchestra | 9 | Ancestry | — | innate spells: Ventriloquism (rank 2), Figment (rank 5) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1645 | World-Protector's Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Cleanse Cuisine (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1646 | Emissary Assistance | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 3) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1647 | Janni Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Create Water (rank 1) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1648 | Efreeti Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Illusory Object (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1649 | Bone Caller | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Marvelous Mount (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1650 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1651 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spells: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1652 | Asura Magic | 9 | Ancestry | — | innate spells: Blood Vendetta (rank 2), Death Knell (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1653 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1654 | Speaker's Defense | 9 | Ancestry | — | innate spells: Share Life (rank 2), Status (rank 2), Entangling Flora (rank 2), Environmental Endurance (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1655 | Horn and Bone Incantation | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Humanoid Form (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1656 | Spiritual Echo | 9 | Ancestry | — | innate spells: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1657 | Flower Magic | 9 | Ancestry | — | innate spells: Oaken Resilience (rank 2), One with Plants (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1658 | Duskwalker Magic | 9 | Ancestry | — | innate spells: Augury (rank 2), Peaceful Rest (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1659 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spells: Resist Energy (rank 2), Share Life (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1660 | Natural Magnetism | 9 | Ancestry | — | innate spells: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1661 | Aboleth Transmutation | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1662 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1663 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1664 | Janni Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Speak with Animals (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1665 | Rokoan Arts | 9 | Ancestry | — | innate spells: Speak with Animals (rank 2), Status (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1666 | Cautious Curiosity | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), Silence (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1667 | Rivethun Adept | 16 | Class | — | innate spells: Speak with Stones (rank 5), Spiritual Guardian (rank 5) | −0.23 ± 0.07 | −0.29 | −0.17 | 0.0 | hurts | the AI never used it |
| 1668 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.23 ± 0.07 | −0.46 | −0.01 | 0.0 | hurts | the AI never used it |
| 1669 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.23 ± 0.05 | −0.44 | −0.03 | 0.3 | hurts | with two weapons (longsword and shortsword) |
| 1670 | Dream Magic | 8 | Class | — | innate spells: Dream Message (rank 3), Sleep (rank 4) | −0.24 ± 0.07 | −0.46 | −0.02 | 0.0 | hurts | the AI never used it |
| 1671 | Lore Seeker | 8 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1672 | Rivethun Devotion | 8 | Class | — | innate spells: See the Unseen (rank 2), Spirit Link (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1673 | Salt Kissed | 8 | Class | — | innate spells: Air Bubble (rank 1), Water Breathing (rank 4) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1674 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.25 ± 0.05 | −0.34 | −0.16 | 0.3 | hurts |  |
| 1675 | Stonebound Magic | 6 | Class | — | innate spells: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.25 ± 0.05 | −0.46 | −0.05 | 0.2 | hurts |  |
| 1676 | Time Mage Dedication | 6 | Class | — | innate spells: Delay Consequence (rank 1), Time Sense (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1677 | Sound Mirror | 6 | Class | — | innate spells: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1678 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.27 ± 0.05 | −0.46 | −0.07 | 0.0 | hurts | the AI never used it |
| 1679 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.31 ± 0.08 | −0.35 | −0.27 | 0.9 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 4161 |
| a timer with no rules a fight counts | 205 |
| its requirement | 150 |
| a Strike with nothing more the simulator reads | 109 |
| an Effect with nothing a fight counts | 69 |
| a teleport | 68 |
| a roll whose results the simulator doesn't read | 58 |
| nothing a fight uses | 52 |
| its text has no Strike of its user's | 52 |
| a spell the engine doesn't cast | 47 |
| a reaction's Strike | 36 |
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
