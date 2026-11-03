# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-03: 1657 feats and actions rated, 5288 not simulated, 4 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1475
- hurts: 87
- good: 49
- minor: 27
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
| 23 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.15 | 2.5 | good |  |
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
| 23 | Fatal Shot | 18 | Class | — | Strike activity | +0.24 ± 0.05 | +0.33 | +0.15 | 2.5 | good |  |
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
| 84 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 85 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.09 ± 0.04 | +0.11 | +0.06 | 4.2 | no clear effect |  |
| 86 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 87 | Rain of Razors | 12 | Class | kineticist | save | +0.08 ± 0.08 | −0.02 | +0.18 | 0.9 | no clear effect |  |
| 88 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.08 ± 0.06 | +0.27 | −0.11 | 0.9 | no clear effect |  |
| 89 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.08 ± 0.02 | +0.12 | +0.03 | 3.2 | minor | with a one-handed weapon and a free hand |
| 90 | Telling Blow | 18 | Class | — | Strike activity | +0.08 ± 0.05 | +0.05 | +0.11 | 5.8 | no clear effect |  |
| 91 | Gladiator's Roar | 12 | Class | — | save | +0.08 ± 0.03 | +0.03 | +0.12 | 0.3 | minor |  |
| 92 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | +0.08 ± 0.04 | +0.16 | −0.00 | 1.5 | minor |  |
| 93 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.07 ± 0.06 | +0.06 | +0.09 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 94 | Channeled Protection | 4 | Class | animist | effect | +0.07 ± 0.07 | +0.15 | −0.00 | 4.8 | no clear effect |  |
| 95 | Emotional Push | 2 | Class | bard | check | +0.07 ± 0.03 | +0.14 | +0.00 | 1.2 | minor |  |
| 96 | Psi Burst | 2 | Class | psychic | save | +0.07 ± 0.04 | +0.08 | +0.06 | 2.1 | no clear effect |  |
| 97 | Head Stomp | 4 | Class | rogue | Strike activity | +0.07 ± 0.03 | +0.11 | +0.03 | 5.1 | minor |  |
| 98 | Leading Dance | 4 | Class | swashbuckler | check | +0.07 ± 0.03 | +0.17 | −0.03 | 2.1 | minor |  |
| 99 | Belly Flop | 10 | Class | guardian | Strike activity | +0.07 ± 0.04 | +0.12 | +0.01 | 10.5 | no clear effect |  |
| 100 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.05 | −0.02 | +0.16 | 0.0 | no clear effect | the AI never used it |
| 101 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.07 ± 0.04 | +0.09 | +0.05 | 1.9 | no clear effect |  |
| 102 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.06 ± 0.04 | +0.10 | +0.03 | 5.8 | no clear effect |  |
| 103 | Start the Festival! | 17 | Ancestry | — | check | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 104 | Call the Swarm | 17 | Ancestry | — | check | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 105 | Apocalyptic Visions | 18 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.03 | 0.5 | no clear effect |  |
| 106 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 107 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 108 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | +0.06 ± 0.04 | +0.03 | +0.10 | 0.9 | no clear effect |  |
| 109 | Osteo Armaments | 4 | Class | — | effect | +0.06 ± 0.04 | +0.02 | +0.11 | 1.2 | no clear effect |  |
| 110 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.06 ± 0.05 | +0.15 | −0.02 | 6.6 | no clear effect |  |
| 111 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 112 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.03 | +0.09 | +0.03 | 0.4 | no clear effect |  |
| 113 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 114 | Pandemonium Eruption | 17 | Ancestry | — | save | +0.06 ± 0.02 | +0.11 | +0.01 | 0.0 | minor | the AI never used it |
| 115 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 116 | Duo's Aim | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.15 | −0.03 | 4.2 | no clear effect |  |
| 117 | Coordinated Distraction | 12 | Class | rogue | check | +0.06 ± 0.04 | +0.12 | −0.01 | 1.0 | no clear effect |  |
| 118 | Crimson Breath | 12 | Class | — | save | +0.06 ± 0.04 | +0.10 | +0.01 | 0.5 | no clear effect |  |
| 119 | Reveal Machinations | 15 | Skill | — | check | +0.06 ± 0.02 | +0.10 | +0.02 | 0.5 | minor |  |
| 120 | Winter's Clutch | 1 | Class | kineticist | save | +0.06 ± 0.04 | +0.04 | +0.08 | 0.5 | no clear effect |  |
| 121 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.06 ± 0.04 | +0.04 | +0.07 | 5.9 | no clear effect |  |
| 122 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 123 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.06 ± 0.02 | +0.11 | +0.00 | 0.3 | minor |  |
| 124 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 125 | Mana Detonation | 18 | Class | — | focus spell: Arcane Explosion (rank 9) | +0.06 ± 0.04 | +0.08 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 126 | Death Drone | 0 | Action | — | save | +0.06 ± 0.03 | +0.04 | +0.07 | 1.3 | no clear effect |  |
| 127 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 128 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.06 ± 0.03 | +0.11 | +0.00 | 0.4 | no clear effect |  |
| 129 | Flinging Blow | 16 | Class | monk | Strike activity | +0.05 ± 0.07 | +0.11 | +0.00 | 1.3 | no clear effect |  |
| 130 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 131 | Acknowledge Fan | 12 | Class | — | save | +0.05 ± 0.03 | +0.02 | +0.08 | 1.2 | no clear effect |  |
| 132 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 133 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.03 | 0.1 | minor |  |
| 134 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | +0.05 ± 0.03 | +0.01 | +0.09 | 0.5 | no clear effect | with a weapon and a shield |
| 135 | Olethros's Decree | 17 | Ancestry | — | save | +0.05 ± 0.04 | +0.10 | −0.00 | 1.0 | no clear effect |  |
| 136 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 137 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 138 | Elemental Assault | 1 | Ancestry | — | effect | +0.05 ± 0.02 | +0.03 | +0.07 | 0.2 | no clear effect |  |
| 139 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | +0.05 ± 0.05 | +0.04 | +0.05 | 0.9 | no clear effect |  |
| 140 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.05 ± 0.03 | +0.09 | +0.00 | 0.9 | no clear effect |  |
| 141 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.05 ± 0.04 | +0.02 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 142 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.05 ± 0.03 | +0.10 | −0.01 | 3.0 | no clear effect |  |
| 143 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | +0.05 ± 0.02 | +0.10 | −0.00 | 0.1 | no clear effect |  |
| 144 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 145 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.05 ± 0.03 | +0.11 | −0.02 | 3.7 | no clear effect |  |
| 146 | Titan Swing | 2 | Class | — | Strike activity | +0.05 ± 0.04 | +0.10 | −0.01 | 4.0 | no clear effect |  |
| 147 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 148 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 149 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | +0.05 ± 0.08 | +0.01 | +0.08 | 3.2 | no clear effect |  |
| 150 | Conjure Hell | 12 | Class | — | save | +0.05 ± 0.04 | +0.05 | +0.04 | 0.7 | no clear effect |  |
| 151 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: save | +0.04 ± 0.02 | +0.01 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 152 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 153 | Wither Away | 16 | Class | — | save | +0.04 ± 0.04 | +0.10 | −0.01 | 0.5 | no clear effect |  |
| 154 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 155 | Promise of Pain | 10 | Class | — | save | +0.04 ± 0.05 | +0.09 | −0.01 | 1.0 | no clear effect |  |
| 156 | Memory of Nothing | 18 | Class | — | save | +0.04 ± 0.04 | +0.08 | +0.01 | 2.2 | no clear effect |  |
| 157 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.04 ± 0.07 | +0.05 | +0.03 | 1.0 | no clear effect |  |
| 158 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 159 | Crane Stance | 1 | Class | monk | effect | +0.04 ± 0.02 | +0.05 | +0.03 | 0.2 | no clear effect |  |
| 160 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 161 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 162 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 163 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 164 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | +0.04 ± 0.06 | +0.13 | −0.05 | 8.7 | no clear effect |  |
| 165 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 166 | Desiccating Inhalation | 12 | Class | — | save | +0.04 ± 0.03 | +0.06 | +0.02 | 0.3 | no clear effect |  |
| 167 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 168 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 169 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.04 ± 0.02 | −0.01 | +0.09 | 0.5 | no clear effect |  |
| 170 | Infernal Interference | 16 | Class | — | Strike activity | +0.04 ± 0.03 | +0.05 | +0.03 | 0.8 | no clear effect |  |
| 171 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.04 ± 0.02 | +0.00 | +0.08 | 0.8 | no clear effect | with a loaded arquebus |
| 172 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 173 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.04 ± 0.03 | +0.03 | +0.04 | 3.2 | no clear effect |  |
| 174 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | +0.04 ± 0.03 | +0.05 | +0.02 | 0.1 | no clear effect |  |
| 175 | Bear Hug | 6 | Class | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.02 | 1.9 | no clear effect |  |
| 176 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.04 ± 0.02 | +0.06 | +0.01 | 1.6 | no clear effect |  |
| 177 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | +0.04 ± 0.03 | +0.00 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 178 | Tempo Duelist | 16 | Class | — | concealed for a round | +0.04 ± 0.04 | +0.06 | +0.01 | 1.2 | no clear effect |  |
| 179 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | focus spell: Dragon Breath (rank 4) | +0.04 ± 0.03 | +0.08 | −0.01 | 0.3 | no clear effect |  |
| 180 | Poisoner's Twist | 4 | Class | — | check | +0.04 ± 0.03 | +0.03 | +0.04 | 2.6 | no clear effect |  |
| 181 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.02 | +0.01 | +0.06 | 0.1 | no clear effect |  |
| 182 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 183 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.03 ± 0.05 | +0.09 | −0.02 | 4.2 | no clear effect |  |
| 184 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 185 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 186 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | +0.03 ± 0.02 | +0.00 | +0.07 | 0.8 | no clear effect |  |
| 187 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | +0.03 ± 0.03 | +0.04 | +0.02 | 1.1 | no clear effect |  |
| 188 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.03 ± 0.03 | −0.02 | +0.09 | 0.9 | no clear effect |  |
| 189 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.02 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 190 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.0 | no clear effect |  |
| 191 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.2 | no clear effect |  |
| 192 | Remember Their Names | 16 | Class | — | save | +0.03 ± 0.03 | +0.06 | +0.00 | 1.1 | no clear effect |  |
| 193 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | +0.03 ± 0.05 | +0.05 | +0.02 | 1.2 | no clear effect |  |
| 194 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.03 ± 0.03 | +0.09 | −0.02 | 2.8 | no clear effect |  |
| 195 | Stoked Flame Stance | 1 | Class | monk | stance | +0.03 ± 0.03 | +0.05 | +0.01 | 0.7 | no clear effect |  |
| 196 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.02 | +0.09 | −0.03 | 0.4 | no clear effect |  |
| 197 | Tremor | 1 | Class | kineticist | save | +0.03 ± 0.02 | +0.05 | +0.01 | 0.3 | no clear effect |  |
| 198 | Rock The Boat | 8 | Class | fighter | check | +0.03 ± 0.01 | +0.06 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 199 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 200 | Shadow's Web | 14 | Class | monk | focus spell: Shadow's Web (rank 7) | +0.03 ± 0.03 | −0.01 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 201 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.03 ± 0.03 | +0.08 | −0.02 | 1.5 | no clear effect |  |
| 202 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 203 | Part the Veil | 0 | Action | — | check | +0.03 ± 0.03 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 204 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.05 | +0.01 | 1.2 | no clear effect |  |
| 205 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 206 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | +0.03 ± 0.02 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 207 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 208 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 209 | Rend Mimicry | 4 | Class | — | check | +0.03 ± 0.02 | +0.03 | +0.03 | 1.5 | no clear effect |  |
| 210 | Benevolent Spirit Deck | 6 | Class | — | effect | +0.03 ± 0.01 | +0.02 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 211 | Enchanting Shot | 8 | Class | — | Strike activity | +0.03 ± 0.04 | +0.08 | −0.02 | 2.2 | no clear effect |  |
| 212 | Flensing Slice | 8 | Class | — | check | +0.03 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 213 | Psi Catastrophe | 12 | Class | psychic | save | +0.03 ± 0.04 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 214 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 215 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 216 | Debilitating Shot | 10 | Class | fighter | Strike activity | +0.03 ± 0.04 | +0.11 | −0.05 | 1.8 | no clear effect |  |
| 217 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 218 | Subjugation | 16 | Class | — | save | +0.03 ± 0.02 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 219 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | +0.03 ± 0.01 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 220 | Tidal Hands | 1 | Class | kineticist | save | +0.03 ± 0.02 | +0.05 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.03 ± 0.03 | −0.02 | +0.07 | 1.5 | no clear effect |  |
| 222 | Lesson of Mutual Gambits | 8 | Class | — | check | +0.02 ± 0.03 | +0.05 | +0.00 | 0.3 | no clear effect |  |
| 223 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 224 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.02 ± 0.02 | +0.03 | +0.02 | 0.1 | no clear effect |  |
| 225 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 226 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.03 | +0.04 | +0.01 | 0.2 | no clear effect |  |
| 227 | Reversing Charge | 8 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.05 | 1.1 | no clear effect |  |
| 228 | Stranglehold | 9 | Ancestry | — | check | +0.02 ± 0.03 | +0.04 | +0.01 | 2.9 | no clear effect |  |
| 229 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.02 ± 0.03 | −0.01 | +0.06 | 0.8 | no clear effect |  |
| 230 | Stumbling Stance | 1 | Class | monk | stance | +0.02 ± 0.03 | +0.06 | −0.01 | 0.6 | no clear effect |  |
| 231 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.2 | no clear effect |  |
| 232 | Sanguivolent Roots | 8 | Class | kineticist | save | +0.02 ± 0.04 | +0.02 | +0.03 | 0.4 | no clear effect |  |
| 233 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 234 | Propulsive Leap | 10 | Class | — | save | +0.02 ± 0.04 | +0.05 | −0.00 | 2.1 | no clear effect |  |
| 235 | Call the Hurricane | 8 | Class | kineticist | save | +0.02 ± 0.07 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 236 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.02 ± 0.04 | +0.11 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 237 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.02 ± 0.01 | +0.05 | −0.01 | 11.3 | no clear effect | with a one-handed weapon and a free hand |
| 238 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 239 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 240 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 241 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | +0.02 ± 0.03 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 242 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | +0.02 ± 0.03 | +0.03 | +0.01 | 2.8 | no clear effect |  |
| 243 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 244 | All Shall End in Flames | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 245 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 246 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 247 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 248 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 249 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 250 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 251 | Driving Rain | 6 | Class | kineticist | save | +0.02 ± 0.06 | −0.08 | +0.12 | 0.4 | no clear effect |  |
| 252 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.02 ± 0.02 | +0.05 | −0.01 | 1.5 | no clear effect |  |
| 253 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | +0.02 ± 0.01 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 254 | Wolf Stance | 1 | Class | monk | effect | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 255 | Tiger Stance | 1 | Class | monk | effect | +0.02 ± 0.01 | +0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 256 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 257 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.04 | +0.08 | 4.9 | no clear effect | with two weapons (longsword and shortsword) |
| 258 | Feathered Flechettes | 6 | Class | — | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 259 | Breath of Hungry Death | 16 | Class | — | save | +0.02 ± 0.03 | +0.00 | +0.04 | 0.4 | no clear effect |  |
| 260 | Wind Caller | 8 | Class | druid | focus spell: Stormwind Flight (rank 4) | +0.02 ± 0.04 | +0.02 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 261 | Silencing Strike | 10 | Class | barbarian | save | +0.02 ± 0.01 | +0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 262 | Vindictive Thoughts | 16 | Class | — | save | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 263 | Protect the Royal Line | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 265 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 266 | Tempo Shift | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Absolve Sins | 16 | Class | — | save | +0.02 ± 0.02 | +0.03 | +0.01 | 0.2 | no clear effect |  |
| 268 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 1.2 | no clear effect |  |
| 270 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.02 ± 0.02 | −0.00 | +0.04 | 1.4 | no clear effect |  |
| 271 | To Me! | 18 | Class | — | Strike activity | +0.02 ± 0.02 | +0.00 | +0.04 | 0.5 | no clear effect |  |
| 272 | Glimpse Vulnerability | 0 | Action | — | effect | +0.02 ± 0.01 | +0.03 | +0.00 | 0.3 | no clear effect |  |
| 273 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | +0.02 ± 0.06 | +0.06 | −0.03 | 1.0 | no clear effect |  |
| 274 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect |  |
| 275 | Aerial Boomerang | 1 | Class | kineticist | save | +0.02 ± 0.02 | +0.05 | −0.01 | 0.3 | no clear effect |  |
| 276 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 277 | Archer's Aim | 8 | Class | — | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 278 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | +0.02 ± 0.02 | +0.03 | +0.00 | 0.4 | no clear effect |  |
| 279 | Thrash | 8 | Class | barbarian | save | +0.02 ± 0.01 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 280 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 281 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | +0.02 ± 0.01 | −0.00 | +0.03 | 0.2 | no clear effect |  |
| 282 | Steal Time | 10 | Class | — | save | +0.02 ± 0.02 | +0.06 | −0.02 | 0.3 | no clear effect |  |
| 283 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.02 ± 0.03 | +0.02 | +0.01 | 2.8 | no clear effect |  |
| 284 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.03 | −0.00 | 1.7 | no clear effect |  |
| 285 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | +0.02 ± 0.01 | +0.01 | +0.02 | 0.3 | no clear effect |  |
| 286 | Flower Street Infamy | 11 | Skill | — | check | +0.02 ± 0.02 | +0.02 | +0.01 | 0.8 | no clear effect |  |
| 287 | Hail of Splinters | 1 | Class | kineticist | save | +0.02 ± 0.02 | +0.04 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 288 | Walk Through the Conflagration | 14 | Class | kineticist | save | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 289 | Repel Ambient Magic | 0 | Action | — | effect | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 290 | Call Hellfire | 8 | Class | — | save | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 291 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | +0.01 ± 0.01 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 292 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | +0.01 ± 0.03 | +0.05 | −0.02 | 0.3 | no clear effect |  |
| 293 | Stand Back, I'm A Doctor! | 12 | Class | — | save | +0.01 ± 0.02 | +0.05 | −0.02 | 0.6 | no clear effect |  |
| 294 | Rain of Bolts | 9 | Ancestry | — | save | +0.01 ± 0.02 | +0.01 | +0.02 | 0.1 | no clear effect |  |
| 295 | Unbreaking Castle | 10 | Class | — | effect | +0.01 ± 0.05 | −0.04 | +0.07 | 4.3 | no clear effect | with a weapon and a shield |
| 296 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 297 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.01 ± 0.01 | +0.01 | +0.02 | 0.7 | no clear effect |  |
| 298 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.01 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 299 | Abrasive Drag | 12 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 300 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 301 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.01 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 302 | Roiling Mudslide | 6 | Class | kineticist | save | +0.01 ± 0.03 | +0.06 | −0.03 | 0.4 | no clear effect |  |
| 303 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 304 | Kraken's Call | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 305 | Spirit's Wrath | 12 | Class | barbarian | check | +0.01 ± 0.02 | −0.01 | +0.04 | 1.1 | no clear effect |  |
| 306 | Trial by Skyfire | 10 | Class | oracle | save | +0.01 ± 0.01 | +0.01 | +0.01 | 0.2 | no clear effect |  |
| 307 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 308 | Launch Fireworks | 0 | Action | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 309 | Disarming Assault | 8 | Class | barbarian | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 310 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 311 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 312 | Sky and Heaven Stance | 6 | Class | — | stance | +0.01 ± 0.06 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 313 | Trance of Celerity | 1 | Class | oracle | effect | +0.01 ± 0.01 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 314 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.02 | +0.04 | −0.02 | 0.5 | no clear effect |  |
| 315 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.1 | no clear effect |  |
| 316 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 317 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | +0.01 ± 0.01 | +0.02 | +0.00 | 0.1 | no clear effect |  |
| 318 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.1 | no clear effect |  |
| 319 | Trip | 0 | Action | — | check | +0.01 ± 0.01 | +0.02 | +0.00 | 0.2 | no clear effect | with a one-handed weapon and a free hand |
| 320 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 321 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.01 | +0.00 | +0.02 | 0.3 | no clear effect |  |
| 322 | Necrotic Bomber | 4 | Class | — | focus spell: Necrotic Bomb (rank 2) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.6 | no clear effect |  |
| 323 | Sleeper Hold | 10 | Class | monk | check | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 324 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 325 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | +0.01 ± 0.02 | +0.01 | +0.00 | 0.8 | no clear effect |  |
| 326 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | +0.01 ± 0.07 | +0.02 | −0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 327 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.8 | no clear effect | with a one-handed weapon and a free hand |
| 328 | Clobber | 16 | Class | guardian | Strike activity | +0.01 ± 0.02 | +0.00 | +0.01 | 1.0 | no clear effect |  |
| 329 | Feral Mending | 8 | Class | — | check | +0.01 ± 0.03 | −0.00 | +0.02 | 0.1 | no clear effect |  |
| 330 | Tenacious Stance | 0 | Action | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 331 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.01 ± 0.01 | −0.01 | +0.03 | 0.3 | no clear effect |  |
| 332 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 333 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.00 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 334 | Cover Fire | 1 | Class | gunslinger | Strike activity | +0.01 ± 0.01 | +0.00 | +0.01 | 0.8 | no clear effect |  |
| 335 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 336 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 337 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | +0.01 ± 0.02 | −0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 338 | Draw From the Land | 10 | Class | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 340 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 341 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 342 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 2.1 | no clear effect |  |
| 343 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 344 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 345 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Plane Step | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 349 | Ferocious Gust | 9 | Ancestry | — | save | +0.01 ± 0.01 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 350 | Crimson Shroud | 6 | Class | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 351 | Quill Spray | 9 | Ancestry | — | save | +0.01 ± 0.03 | −0.04 | +0.06 | 0.1 | no clear effect |  |
| 352 | Purifying Breeze | 14 | Class | cleric | effect | +0.01 ± 0.01 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 353 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 354 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 355 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 356 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 357 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 358 | Deathly Scream | 2 | Class | — | focus spell: Deathly Scream (rank 1) | +0.01 ± 0.02 | +0.01 | +0.01 | 0.5 | no clear effect |  |
| 359 | Knockback Strike | 10 | Class | monk | Strike activity | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 361 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 362 | Shame the Sin | 5 | Ancestry | — | check | +0.01 ± 0.00 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 363 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect |  |
| 364 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 365 | Dashing Strike | 12 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.00 | +0.01 | 0.5 | no clear effect |  |
| 366 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | +0.01 ± 0.02 | +0.00 | +0.01 | 0.2 | no clear effect |  |
| 367 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.01 ± 0.03 | −0.00 | +0.01 | 1.4 | no clear effect |  |
| 368 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 369 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 370 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 371 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 372 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 373 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 375 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 376 | Cleansing Light | 17 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 378 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 379 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.01 ± 0.00 | +0.00 | +0.01 | 0.3 | no clear effect |  |
| 380 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 381 | Flying Tackle | 4 | Class | guardian | check | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | +0.01 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 383 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 384 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.7 | no clear effect |  |
| 385 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | +0.00 ± 0.01 | −0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 386 | Invoke the Crimson Oath | 8 | Class | — | focus spell: Invoke the Crimson Oath (rank 4) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 387 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 388 | Dragonet Breath | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 389 | Alluring Performance | 9 | Ancestry | — | check | +0.00 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 390 | Weakening Assault | 12 | Class | guardian | 2 Strikes | +0.00 ± 0.02 | +0.00 | +0.01 | 4.0 | no clear effect |  |
| 391 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.00 ± 0.01 | +0.01 | −0.00 | 1.5 | no clear effect |  |
| 393 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | +0.00 ± 0.01 | +0.01 | −0.00 | 0.1 | no clear effect |  |
| 394 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.00 ± 0.01 | −0.00 | +0.01 | 2.3 | no clear effect |  |
| 395 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 396 | Gift of the Hoard | 10 | Class | — | focus spell: Dragon Breath (rank 5) | +0.00 ± 0.02 | −0.00 | +0.01 | 0.4 | no clear effect |  |
| 397 | Distracting Spellstrike | 4 | Class | magus | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 399 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 400 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 401 | Bony Barrage | 4 | Class | — | focus spell: Bony Barrage (rank 2) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 403 | Scorching Column | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 404 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 405 | Decompose | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Glacial Prison | 12 | Class | kineticist | save | +0.00 ± 0.07 | +0.01 | +0.00 | 0.9 | no clear effect |  |
| 407 | Parting Shot | 4 | Class | fighter | Strike activity | +0.00 ± 0.01 | −0.00 | +0.01 | 0.2 | no clear effect | with a bow in hand |
| 408 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.00 ± 0.02 | −0.02 | +0.02 | 0.2 | no clear effect |  |
| 409 | Warped Constriction | 8 | Class | — | save | +0.00 ± 0.03 | +0.02 | −0.01 | 2.3 | no clear effect |  |
| 410 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 411 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 412 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 413 | Boulder Roll | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 414 | Too Angry to Die | 12 | Skill | — | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 415 | Decree of War | 18 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 416 | Draconic Fury | 4 | Class | — | save | +0.00 ± 0.01 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 417 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 418 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 420 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 421 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 422 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 424 | Diamond Soul | 12 | Class | monk | save-bonus | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect |  |
| 425 | Masked Casting | 8 | Class | — | self effect | +0.00 ± 0.01 | −0.01 | +0.01 | 2.6 | no clear effect |  |
| 426 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 427 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 428 | Siegebreaker | 0 | Action | gunslinger | Strike activity | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 429 | Impossible Volley | 18 | Class | fighter | Strike activity | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 430 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 434 | Fearful Symmetry | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 435 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 436 | Pit of Snakes | 13 | Ancestry | — | save | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 437 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.00 ± 0.02 | −0.01 | +0.02 | 1.3 | no clear effect |  |
| 438 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 439 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | +0.00 ± 0.03 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 440 | Tectonic Stomp | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 441 | Unleash the Blight | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 442 | Emotional Surge | 10 | Class | psychic | effect | +0.00 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 443 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 444 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 445 | Frighten Undead | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 446 | Crossbow Terror | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 447 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 448 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 449 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Thunder Clap | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 452 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.00 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 455 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 456 | Spinebreaker | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 457 | Ensnaring Wrappings | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 458 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 459 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Running Tackle | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 462 | Opportunistic Grapple | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 463 | Submission Hold | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 464 | Raise Slabs | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | −0.00 | 0.2 | no clear effect |  |
| 465 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 466 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 467 | Glory on High | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Instant Recovery | 0 | Action | — | healing | +0.00 ± 0.01 | −0.01 | +0.02 | 0.2 | no clear effect |  |
| 469 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 470 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 475 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | +0.00 ± 0.02 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 482 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 484 | Shackles of Law | 0 | Bonus | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Draconic Resilience | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Twin Parry | 4 | Class | fighter | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Rain of Embers Stance | 1 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 490 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Offer Story | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | +0.00 ± 0.01 | −0.01 | +0.01 | 0.1 | no clear effect |  |
| 493 | Grovel | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 495 | Channel Divine Spark | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Drain Vitality | 10 | Class | — | check | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 499 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 504 | Flash Your Badge | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Tumbling Opportunist | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 507 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 509 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 511 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 512 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 513 | Staff Sweep | 6 | Class | — | check | +0.00 ± 0.00 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 514 | Demon Slayer | 17 | Ancestry | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 515 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | +0.00 ± 0.01 | +0.02 | −0.02 | 0.2 | no clear effect |  |
| 516 | Mixed Maneuver | 8 | Class | monk | check | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 517 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 518 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 519 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 520 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 521 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 522 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 523 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 524 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 526 | Fleeing Shriek | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 527 | Ironblood Stance | 8 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 528 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 531 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 532 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 533 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Roar Mimicry | 12 | Class | — | save | +0.00 ± 0.02 | +0.02 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 535 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 536 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 537 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Haunting Visage | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 541 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 542 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Primal Roar | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 548 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Threatening Approach | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Friendly Nudge | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 553 | Bounce Boost | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 554 | Plane-Stepping Dash | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 555 | Terrifying Croak | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 556 | Sudden Terror | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Play Dead | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 558 | Unstable Gearshift | 6 | Class | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.5 | no clear effect |  |
| 559 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | +0.00 ± 0.03 | −0.03 | +0.03 | 0.3 | no clear effect |  |
| 561 | Called Shot | 10 | Class | gunslinger | Strike activity | +0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 567 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 572 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 574 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 575 | Lantern Strobe | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 580 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 585 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 586 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 594 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 597 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 599 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 600 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 601 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Stay Down! | 14 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 605 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 608 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 610 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 612 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 613 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 614 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Vengeful Remnant | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 619 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 621 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 622 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 623 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 624 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 627 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 629 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 630 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 631 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 632 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 633 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 634 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 636 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 637 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 638 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 639 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 640 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 641 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 642 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 643 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 645 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 648 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 649 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 650 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 651 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 652 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 654 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 657 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 658 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 659 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 660 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 661 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 663 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 664 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 665 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 666 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 669 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 670 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 671 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 672 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 674 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 675 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 677 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 678 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 680 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 681 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 682 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 684 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 685 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 686 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 687 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 688 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 690 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 691 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 692 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 693 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 695 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 696 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 697 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 698 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 699 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 700 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 702 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 703 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 704 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 705 | Primadonna | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 706 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 707 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 708 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 709 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 711 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 713 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 715 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 718 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 719 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 722 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 724 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 725 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 726 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 727 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 729 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 730 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 732 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 736 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 738 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 739 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 741 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 742 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 743 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 745 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 746 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 751 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 754 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 756 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 757 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 758 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 759 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 760 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 761 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 763 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 778 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 779 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 789 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 792 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 794 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 801 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 805 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 807 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 808 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 811 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 812 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 813 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 814 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 815 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 816 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 819 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 822 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 830 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 832 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 834 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 840 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 841 | Animal Summoner | 9 | Ancestry | — | innate spell: Summon Animal (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 843 | Labyrinthine Echoes | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 846 | Animal Soul Siblings | 5 | Ancestry | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 848 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Enter Divine Realm | 20 | Class | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 851 | Ghoran's Wrath | 17 | Ancestry | — | innate spell: Nature's Reprisal (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | Summon Air Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 853 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Impossible Gossip | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 855 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Bend Space | 17 | Ancestry | — | innate spell: Teleport (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 857 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 858 | Call Draconic Ally | 14 | Class | — | innate spell: Summon Dragon (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Brightness Seeker | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Rat Magic | 5 | Ancestry | — | innate spell: Animal Messenger (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Water Conjuration | 5 | Ancestry | — | innate spell: Create Water (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Pierce the Light | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Shadow Pact | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 874 | Stone Guardian | 4 | Class | — | innate spell: Summon Elemental (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Arboreal Conversationalist | 13 | Ancestry | — | innate spell: Speak with Plants (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Irriseni Ice-Witch | 13 | Ancestry | — | innate spell: Wall of Ice (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 879 | Frightful Figment | 1 | Ancestry | — | innate spell: Figment (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Stem the Tide | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Reimagine | 13 | Ancestry | — | innate spell: Dreaming Potential (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Kijimuna Whistle | 13 | Ancestry | — | innate spell: Summon Plant or Fungus (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 885 | Arcane Sense | 1 | Skill | — | innate spell: Detect Magic (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 886 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Splendid Illusion | 13 | Ancestry | — | innate spell: Illusory Scene (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 888 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 890 | Astral Blink | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Patron's Whisper | 10 | Class | — | innate spell: Message (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Lorefinder | 8 | Class | — | innate spell: Locate (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | The Moon Weaver's Art | 5 | Ancestry | — | innate spell: Illusory Object (rank 1), Invisible Item (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Summon Fire Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Aberration Kinship | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | None Shall Know | 13 | Ancestry | — | innate spell: Veil of Privacy (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 905 | Realm Strider | 16 | Class | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | Skirt the Light | 13 | Ancestry | — | innate spell: Umbral Journey (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Soul Vessel Mount | 18 | Class | — | innate spell: Seize Soul (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 912 | Prophet's Lockbox | 10 | Class | — | innate spell: Imaginary Lockbox (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 914 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Flower Chimera | 13 | Ancestry | — | innate spell: Spiritual Guardian (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 918 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Boneyard Acquaintance | 17 | Ancestry | — | innate spell: Spiritual Guardian (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 923 | Summon Water Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 925 | Share Thoughts | 1 | Ancestry | — | innate spell: Mindlink (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Leave no Trace | 5 | Ancestry | — | innate spell: Vanishing Tracks (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 931 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Truespeech | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 934 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 935 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 936 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 939 | Axial Recall | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 940 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 941 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 942 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 945 | Fossil Rider | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 946 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 947 | Night Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Mist (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Unfettering Prankster | 17 | Ancestry | — | innate spell: Unfettered Pack (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 949 | Summon Metal Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Beast Speaker | 4 | Class | — | innate spell: Speak with Animals (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Kizidhar Magic | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 952 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 953 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 954 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 957 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Fey Life | 16 | Class | — | innate spell: Summon Fey (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 960 | Tree's Ward | 5 | Ancestry | — | innate spell: Protector Tree (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Borrow Memories | 14 | Class | — | innate spell: Mind Probe (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Into the Labyrinth | 17 | Ancestry | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Stonewalker | 9 | Ancestry | — | innate spell: One with Stone (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Call Ursine Ally | 8 | Class | — | innate spell: Summon Animal (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 965 | Persistent Creation | 8 | Class | — | innate spell: Creation (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 968 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 970 | Azaersi's Roads | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Summon Earth Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 973 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 976 | Summon Wood Elemental | 13 | Ancestry | — | innate spell: Summon Elemental (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 977 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Plant Soul Siblings | 9 | Ancestry | — | innate spell: Speak with Plants (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 979 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 980 | Grandmother's Wisdom | 9 | Ancestry | — | innate spell: Augury (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 982 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 983 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | Stone Soul Siblings | 13 | Ancestry | — | innate spell: Speak with Stones (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 986 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 987 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Thrown Voice | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 989 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 990 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 991 | Avatar's Audience | 20 | Class | cleric | innate spell: Commune (rank 6), Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 992 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 993 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 994 | Distant Cackle | 5 | Ancestry | — | innate spell: Ventriloquism (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 995 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 996 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 997 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 998 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 999 | Call the Worm | 18 | Class | — | innate spell: Summon Animal (rank 9) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1000 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1001 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1002 | Fade Away | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Disguise Magic (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1003 | Whispers in the Night | 9 | Ancestry | — | innate spell: Darkness (rank 2), Ventriloquism (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1004 | Terrifying Countenance | 18 | Class | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1005 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1006 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1007 | Slip Sideways | 13 | Ancestry | — | innate spell: Translocate (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1008 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1011 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1013 | Analyze Information | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1014 | River Adaptation | 9 | Ancestry | — | innate spell: Feet to Fins (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1015 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1016 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1017 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1018 | Light-Bending Jewel | 13 | Ancestry | — | innate spell: Invisibility (rank 2), Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Ascendant Blood | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1021 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1022 | Jotun's Transposition | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1023 | Skeletal Transformation | 13 | Ancestry | — | innate spell: Animal Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1024 | Azarketi Purification | 9 | Ancestry | — | innate spell: Cleanse Cuisine (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1026 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1027 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1028 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1029 | Homeward Bound | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1031 | Stonegate | 17 | Ancestry | — | innate spell: Magic Passage (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Ancestral Form | 9 | Ancestry | — | innate spell: Animal Form (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1033 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1036 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1037 | Devil Allies | 0 | Bonus | — | innate spell: Summon Fiend (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1038 | Boneyard's Call | 17 | Ancestry | — | innate spell: Interplanar Teleport (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1039 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1040 | Unrivaled Builder | 13 | Ancestry | — | innate spell: Creation (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1041 | Secrets of the Past | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1042 | Fearsome Form | 17 | Ancestry | — | innate spell: Mask of Terror (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Wall of Roses | 8 | Class | — | innate spell: Wall of Thorns (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1044 | Siphon Torment | 9 | Ancestry | — | innate spell: Claim Curse (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1045 | Cloud Walk | 10 | Class | — | innate spell: Air Walk (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1046 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1047 | Moon May | 1 | Ancestry | — | innate spell: Guidance (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1048 | Linguistic Revival | 13 | Ancestry | — | innate spell: Truespeech (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1049 | No Hands, No Problem | 5 | Ancestry | — | innate spell: Telekinetic Hand (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1050 | Bone Investiture | 13 | Ancestry | — | innate spell: Dinosaur Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1051 | Spiritual Headhunter | 13 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1052 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1053 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1054 | Soul Warden Dedication | 2 | Class | — | innate spell: Vitality Lash (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1055 | Ancestor's Rage | 13 | Ancestry | — | innate spell: Animal Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1056 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1057 | Water to Water | 13 | Ancestry | — | innate spell: Translocate (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1058 | Dig up Secrets | 9 | Ancestry | — | innate spell: Hypercognition (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1059 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1060 | Lingering Echoes | 9 | Ancestry | — | innate spell: Talking Corpse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1061 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1062 | Shared Dream | 16 | Class | — | innate spell: Dream Council (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1063 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1064 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 2.0 | no clear effect |  |
| 1065 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1066 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1067 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1068 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1069 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1070 | Unseen Passage | 8 | Class | gunslinger | innate spell: Vanishing Tracks (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1071 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1072 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1073 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1074 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1075 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1076 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1077 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1078 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1079 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a bow in hand; the AI never used it |
| 1080 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1081 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1082 | Dazzling Block | 10 | Class | magus | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1083 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1084 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1085 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1086 | Final Spite | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1087 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1088 | Maze of Runes | 16 | Class | — | innate spell: Quandary (rank 8) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1089 | Armored Courage | 4 | Class | guardian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1090 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1091 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1092 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1093 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1094 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1096 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1097 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1098 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1099 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1100 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1101 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1102 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1103 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1104 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1105 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1106 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1107 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1108 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1109 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1110 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1111 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1112 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1113 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1114 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1115 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1116 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1117 | Writing On the Wall | 4 | Class | — | innate spell: Embed Message (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1118 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1119 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1120 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1121 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1122 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1123 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1124 | Bone Burst | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1125 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1126 | Hallowed Necromancer Dedication | 2 | Class | — | focus spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1127 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1128 | Speaking Sky | 12 | Class | — | focus spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1129 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1130 | Wind Jump | 10 | Class | monk | focus spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1131 | Conjurer's Countermeasure | 6 | Class | magus | focus spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1132 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1133 | Gaze of Veracity | 10 | Class | — | focus spell: Glimpse the Truth (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1134 | Cultivator Dedication | 2 | Class | — | focus spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1135 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1136 | Disciple of Shade | 6 | Class | — | focus spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1137 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1138 | Harmonize Self | 4 | Class | monk | focus spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1139 | Wings of the Dragon | 12 | Class | — | focus spell: Dragon Wings (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1140 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1141 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1142 | Polished Distraction | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1143 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1144 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1145 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1146 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1147 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1148 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1149 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1150 | Reactive Striker | 4 | Class | — | Reactive Strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1151 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1152 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1153 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1154 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1155 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1156 | Flying Flame | 1 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1157 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1158 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1159 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1160 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1162 | Push Back the Dead! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1163 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1164 | Defiant Banner | 8 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1166 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1167 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1168 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1169 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1170 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1171 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1172 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1173 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1174 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1175 | Witchwood Seed | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1176 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1177 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1178 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1179 | Drowning Mist | 12 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1180 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1181 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1182 | Share Rage | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1183 | Assume Earth's Mantle | 14 | Class | kineticist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1184 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1185 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1186 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1187 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1188 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 1189 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1190 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1191 | Soothing Ballad | 14 | Class | bard | focus spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1192 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1193 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1194 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1195 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1196 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1197 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1198 | Stunt Performer Stance | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1199 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1200 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1201 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1202 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1203 | Cobra Stance | 4 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1204 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1205 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1206 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1207 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1208 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1209 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1210 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1211 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1212 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1213 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1214 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1215 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 1216 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1217 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1218 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1219 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1220 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1221 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 1222 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1223 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1224 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1225 | Fade Into Daydreams | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1226 | Valkyrie's Charge | 0 | Action | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1227 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1228 | Restore the Mind | 0 | Action | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1229 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1230 | Drag Down | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1231 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1232 | Toppling Transformation | 6 | Class | druid | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1233 | You Can't Keep Us Down | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1234 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1235 | Call to Battle | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1236 | Self Destruct | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1237 | Align Qi | 6 | Class | monk | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1238 | Hop Up | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1239 | Rallying Cry | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1240 | Banner Twirl | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1241 | Pistol Twirl | 2 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1242 | Cadence Call | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1243 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1244 | Prayer Attack | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1245 | Heat Wave | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1246 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1247 | Even the Odds (Eagle Knight) | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1248 | Calaca's Showstopper | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1249 | Daring Act | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1250 | Deific Font | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1251 | Threatening Pursuit | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1252 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1253 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1254 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1255 | Extraplanar Haze | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1256 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1257 | Spark of Independence | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1258 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1259 | The Dead Walk | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1260 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1261 | Kip Up | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1262 | Clear the Way | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1263 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1264 | Jotun's Grasp | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1265 | Say That Again! | 6 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1266 | Disarming Intercept | 6 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1267 | It Was Me All Along! | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1268 | Now You See Me | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1269 | Repulse the Wicked | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1270 | Get Used to Disappointment | 12 | Class | swashbuckler | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1271 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1272 | Quick Root | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1273 | Reclaim Power | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1274 | Flourishing Finish | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1275 | Talmandor's Shout | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1276 | Armored Rebuff | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1277 | Waters of Creation | 10 | Class | oracle | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1278 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1279 | Steal for the Depths | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1280 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1281 | Propelled Leap | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1282 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1283 | Statue | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1284 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1285 | Storm Shroud | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1286 | Brandish Authority | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1287 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1288 | Inner Strength | 6 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1289 | Spirit's Sacrifice | 18 | Class | animist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1290 | Idol Threat | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1291 | Shield Wall | 6 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1292 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1293 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1294 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1295 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1296 | Flickering Twirl | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1297 | Nanite Shroud | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1298 | Pouncing Transformation | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1299 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1300 | Body Barrier | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1301 | Song of Glorious Invocation | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1302 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1303 | Voice Cold as Death | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1304 | Wing Shove | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1305 | Drive Back | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 1306 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1307 | Warning Shot | 2 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1308 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1309 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1310 | Shove Down | 6 | Class | rogue | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1311 | Scattering Charge | 12 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1312 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1313 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1314 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1315 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 1316 | Wing Bounce | 4 | Class | — | check | −0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1317 | Silk Bracelet | 6 | Class | inventor | save | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1318 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1319 | Dominion Aura | 17 | Ancestry | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1320 | One Moment till Glory | 0 | Action | — | effect | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1321 | I Will Return | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect |  |
| 1322 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1323 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1324 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.00 ± 0.01 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1325 | Majestic Proclamation | 8 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1326 | Walk the Plank | 8 | Class | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1327 | Death of Hope | 17 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1328 | Overclock Senses | 2 | Class | — | PF2e's self Effect | −0.00 ± 0.00 | +0.00 | −0.00 | 1.3 | no clear effect |  |
| 1329 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1330 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1331 | Coordinated Charge | 12 | Class | — | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 1332 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1333 | Bestial Snarling | 2 | Class | bard | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1334 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1335 | Tail Spin | 5 | Ancestry | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 1336 | Dread Mosquito Storm | 18 | Class | — | focus spell: Dread Mosquito Storm (rank 9) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1337 | Spirit Guide Form | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1338 | Raise the Walls | 0 | Action | — | effect | −0.00 ± 0.02 | +0.01 | −0.01 | 0.7 | no clear effect |  |
| 1339 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1340 | Gluttonous Feast | 0 | Action | — | save | −0.00 ± 0.02 | +0.01 | −0.01 | 0.8 | no clear effect |  |
| 1341 | Fungal Exhalation | 6 | Class | druid | focus spell: Fungal Exhalation (rank 3) | −0.00 ± 0.02 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1342 | Puncture Flesh | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1343 | Dirty Trick | 1 | Skill | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1344 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 1345 | Tamper | 1 | Class | inventor | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1346 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.2 | no clear effect |  |
| 1347 | Putrefaction | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1348 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.00 ± 0.03 | −0.00 | −0.00 | 0.6 | no clear effect |  |
| 1349 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.00 ± 0.01 | −0.00 | +0.00 | 0.2 | no clear effect |  |
| 1350 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.00 ± 0.02 | +0.02 | −0.02 | 0.7 | no clear effect |  |
| 1351 | Hunted Shot | 1 | Class | ranger | 2 Strikes | −0.00 ± 0.03 | +0.00 | −0.01 | 1.7 | no clear effect |  |
| 1352 | Slam Down | 4 | Class | fighter | Strike activity | −0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1353 | Wheeling Grab | 6 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1354 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1355 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1356 | Topple Foe | 10 | Class | — | check | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1357 | Scattering Shout | 14 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1358 | Mind Shards | 6 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1359 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1360 | Construct Dynamo | 12 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1361 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1362 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1363 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1364 | Kobold Breath | 1 | Ancestry | — | save | −0.00 ± 0.00 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1365 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.00 ± 0.04 | +0.03 | −0.04 | 0.9 | no clear effect |  |
| 1366 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1367 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1368 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1369 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1370 | Hammer Quake | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1371 | Jellyfish Stance | 8 | Class | monk | effect | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1372 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1373 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1374 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1375 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1376 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1377 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1378 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1379 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1380 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1381 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1382 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1383 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1384 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1385 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1386 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1387 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1388 | Tears of Pearl | 9 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1389 | Kaleidoscopic Entreaty | 8 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1390 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.02 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 1391 | Golden Body | 20 | Class | monk | fast-healing | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1392 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | −0.00 ± 0.01 | +0.00 | −0.01 | 1.3 | no clear effect |  |
| 1393 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 0.3 | no clear effect |  |
| 1394 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1395 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1396 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1397 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1398 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1399 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1400 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1401 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1402 | Haft Striker Stance | 4 | Class | fighter | stance | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1403 | Dread Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1404 | Blood Calls Blood | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1405 | Face Your Fears | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1406 | Disengaging Twist | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1407 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1408 | Rising Hurricane | 6 | Class | kineticist | save | −0.00 ± 0.02 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1409 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1410 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.00 ± 0.01 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 1411 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect |  |
| 1412 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.00 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1413 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1414 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1415 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1416 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.00 ± 0.03 | −0.01 | +0.00 | 2.3 | no clear effect |  |
| 1417 | Reactive Tangle | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1418 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1419 | Zealous Inevitability | 6 | Class | — | Strike activity | −0.01 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1420 | Unbalancing Sweep | 12 | Class | barbarian | check | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1421 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.01 ± 0.01 | −0.01 | −0.00 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1422 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.01 | +0.00 | 0.3 | no clear effect |  |
| 1423 | Manifold Conduit | 12 | Class | — | focus spell: Entreat the Many (rank 6) | −0.01 ± 0.05 | +0.03 | −0.05 | 1.0 | no clear effect |  |
| 1424 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.03 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 1425 | Muckraking | 16 | Class | — | save | −0.01 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1426 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1427 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1428 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 1429 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.01 ± 0.03 | +0.01 | −0.02 | 0.1 | no clear effect |  |
| 1430 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1431 | Bone Swarm | 17 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1432 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.01 ± 0.03 | +0.08 | −0.09 | 0.7 | no clear effect |  |
| 1433 | Whirling Throw | 6 | Class | monk | check | −0.01 ± 0.01 | +0.01 | −0.02 | 0.4 | no clear effect |  |
| 1434 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1435 | Trample Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1436 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.01 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1437 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.01 ± 0.05 | +0.08 | −0.09 | 1.0 | no clear effect |  |
| 1438 | Freeze It! | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 1439 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 1440 | Frightening Indignation | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1441 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1442 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.01 ± 0.02 | +0.00 | −0.02 | 3.5 | no clear effect |  |
| 1443 | Radiant Burst | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1444 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 1445 | Unending Emptiness | 14 | Class | — | focus spell: Darklight (rank 7) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1446 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1447 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.01 ± 0.02 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 1448 | Chastise | 16 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1449 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1450 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.01 ± 0.01 | −0.01 | −0.01 | 0.1 | no clear effect |  |
| 1451 | Sheltering Wing | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1452 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1453 | Repair Module | 9 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.00 | 0.2 | no clear effect |  |
| 1454 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1455 | No Scar but This | 0 | Action | — | check | −0.01 ± 0.01 | −0.03 | +0.02 | 0.4 | no clear effect |  |
| 1456 | Storming Breath | 6 | Class | — | save | −0.01 ± 0.02 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 1457 | Boarding Assault | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1458 | Break Free | 0 | Action | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1459 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1460 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1461 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1462 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1463 | Hedge Prison | 6 | Class | druid | focus spell: Hedge Prison (rank 3) | −0.01 ± 0.02 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1464 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.01 ± 0.01 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1465 | Form a Flock | 13 | Ancestry | — | effect | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1466 | Wing Buffet | 9 | Ancestry | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.1 | no clear effect |  |
| 1467 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.01 ± 0.02 | +0.00 | −0.02 | 0.8 | no clear effect |  |
| 1468 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1469 | Flash of Omnipresence | 14 | Class | — | save | −0.01 ± 0.01 | −0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1470 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 0.3 | no clear effect |  |
| 1471 | Hellbreaker's Resolve | 4 | Class | — | check | −0.01 ± 0.02 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1472 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 1473 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.01 ± 0.01 | −0.00 | −0.02 | 0.8 | no clear effect |  |
| 1474 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.01 ± 0.02 | −0.01 | −0.01 | 0.5 | no clear effect |  |
| 1475 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1476 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.01 ± 0.01 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1477 | Pack Attack | 6 | Class | — | strike-extra | −0.01 ± 0.04 | −0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 1478 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1479 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1480 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1481 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1482 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.01 ± 0.02 | +0.01 | −0.03 | 0.3 | no clear effect |  |
| 1483 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.01 ± 0.04 | +0.01 | −0.03 | 1.9 | no clear effect | with a spear and a free hand |
| 1484 | Might of the Realm | 14 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1485 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1486 | Untamed Form | 1 | Class | druid | focus spell: Untamed Form (rank 1) | −0.01 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1487 | Cantorian Rejuvenation | 9 | Ancestry | — | check | −0.01 ± 0.01 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1488 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.01 ± 0.02 | +0.00 | −0.03 | 2.4 | no clear effect |  |
| 1489 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1490 | Tap Vitality | 6 | Class | — | check | −0.02 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1491 | Guide the Timeline | 6 | Class | — | effect | −0.02 ± 0.03 | −0.06 | +0.02 | 1.8 | no clear effect |  |
| 1492 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | −0.02 ± 0.07 | +0.04 | −0.07 | 2.0 | no clear effect |  |
| 1493 | Forceful Shot | 14 | Class | — | Strike activity | −0.02 ± 0.01 | −0.01 | −0.03 | 0.3 | no clear effect |  |
| 1494 | Invoke Disaster | 18 | Class | druid | focus spell: Storm Lord (rank 9) | −0.02 ± 0.04 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1495 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.02 ± 0.02 | +0.00 | −0.03 | 0.1 | no clear effect | with two weapons (longsword and shortsword) |
| 1496 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.02 ± 0.02 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1497 | Fumigate | 14 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 1498 | Twin Takedown | 1 | Class | ranger | 2 Strikes | −0.02 ± 0.04 | +0.02 | −0.05 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1499 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.05 | 5.2 | no clear effect |  |
| 1500 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.02 ± 0.04 | −0.06 | +0.02 | 2.8 | no clear effect |  |
| 1501 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.02 ± 0.02 | +0.00 | −0.04 | 1.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1502 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1503 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1504 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1505 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1506 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1507 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1508 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1509 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.02 ± 0.01 | −0.04 | +0.01 | 0.2 | no clear effect |  |
| 1510 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.02 ± 0.04 | +0.04 | −0.08 | 2.2 | no clear effect |  |
| 1511 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.02 ± 0.03 | +0.00 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1512 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.02 ± 0.01 | −0.01 | −0.02 | 0.6 | no clear effect |  |
| 1513 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.02 ± 0.02 | +0.02 | −0.06 | 0.3 | no clear effect |  |
| 1514 | Demolish Defenses | 18 | Class | guardian | Strike activity | −0.02 ± 0.05 | −0.09 | +0.06 | 2.2 | no clear effect |  |
| 1515 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1516 | Vessel's Form | 16 | Class | — | check | −0.02 ± 0.02 | +0.00 | −0.04 | 0.1 | no clear effect |  |
| 1517 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.02 ± 0.05 | −0.02 | −0.03 | 2.0 | no clear effect |  |
| 1518 | Blood Shield | 4 | Class | — | self effect | −0.02 ± 0.01 | −0.05 | +0.00 | 0.2 | no clear effect |  |
| 1519 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1520 | Scout's Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1521 | Ravenous Charge | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1522 | Interpose | 4 | Class | — | Strike activity | −0.02 ± 0.02 | +0.00 | −0.05 | 0.3 | no clear effect |  |
| 1523 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.02 ± 0.03 | −0.08 | +0.03 | 0.3 | no clear effect |  |
| 1524 | Aldori Parry | 4 | Class | — | self effect | −0.03 ± 0.02 | −0.05 | +0.00 | 0.3 | no clear effect |  |
| 1525 | Raise Symbol | 4 | Class | cleric | self effect | −0.03 ± 0.01 | −0.05 | +0.00 | 0.4 | no clear effect |  |
| 1526 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1527 | Whirlwind Stance | 10 | Class | — | effect | −0.03 ± 0.05 | +0.01 | −0.07 | 2.0 | no clear effect |  |
| 1528 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.03 ± 0.02 | −0.04 | −0.03 | 1.5 | no clear effect |  |
| 1529 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.03 ± 0.03 | +0.00 | −0.06 | 1.2 | no clear effect |  |
| 1530 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.03 ± 0.04 | −0.06 | −0.00 | 1.1 | no clear effect |  |
| 1531 | Recharging Flurry | 4 | Class | magus | 2 Strikes | −0.03 ± 0.05 | −0.07 | −0.00 | 0.5 | no clear effect | with two weapons (longsword and shortsword) |
| 1532 | Herald's Strike | 20 | Class | — | save | −0.04 ± 0.05 | −0.04 | −0.03 | 0.8 | no clear effect |  |
| 1533 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1534 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.04 ± 0.06 | +0.08 | −0.16 | 0.6 | no clear effect |  |
| 1535 | Calculate Threats | 0 | Action | psychic | effect | −0.04 ± 0.03 | −0.09 | +0.01 | 3.5 | no clear effect |  |
| 1536 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.04 | −0.05 | −0.04 | 1.0 | no clear effect |  |
| 1537 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.04 ± 0.02 | +0.01 | −0.09 | 0.1 | no clear effect | with a warhammer and a free hand |
| 1538 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.04 ± 0.03 | +0.04 | −0.12 | 0.9 | no clear effect |  |
| 1539 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.04 ± 0.05 | +0.02 | −0.11 | 0.8 | no clear effect |  |
| 1540 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1541 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1542 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1543 | Twist the Knife | 6 | Class | rogue | check | −0.05 ± 0.03 | −0.08 | −0.02 | 1.3 | no clear effect |  |
| 1544 | Waking Dream | 8 | Class | — | focus spell: Waking Dream (rank 4) | −0.05 ± 0.06 | −0.01 | −0.08 | 0.9 | no clear effect |  |
| 1545 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.03 | +0.00 | −0.10 | 0.6 | no clear effect |  |
| 1546 | Gossamer Blade | 4 | Class | — | check | −0.05 ± 0.03 | −0.12 | +0.02 | 2.6 | hurts |  |
| 1547 | Burning Demand | 12 | Class | kineticist | save | −0.05 ± 0.09 | −0.08 | −0.03 | 3.8 | no clear effect |  |
| 1548 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | −0.06 ± 0.07 | −0.21 | +0.10 | 1.0 | no clear effect |  |
| 1549 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1550 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.06 ± 0.05 | +0.07 | −0.19 | 3.3 | no clear effect |  |
| 1551 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1552 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1553 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.07 ± 0.07 | −0.16 | +0.01 | 1.0 | no clear effect |  |
| 1554 | Worm's Feast | 6 | Class | — | save | −0.08 ± 0.05 | −0.09 | −0.07 | 1.0 | no clear effect |  |
| 1555 | Doom of Sailors | 17 | Ancestry | — | save | −0.08 ± 0.04 | −0.16 | −0.00 | 1.0 | no clear effect |  |
| 1556 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.05 | −0.15 | −0.01 | 2.3 | no clear effect |  |
| 1557 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.08 ± 0.05 | −0.01 | −0.15 | 0.3 | no clear effect |  |
| 1558 | Confusing Commands | 16 | Class | commander | save | −0.09 ± 0.10 | +0.10 | −0.27 | 2.0 | no clear effect |  |
| 1559 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.4 | no clear effect |  |
| 1560 | Fey Cantrips | 1 | Ancestry | — | innate spells: Light (rank 1), Ghost Sound (rank 1), Detect Magic (rank 1), Prestidigitation (rank 1) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1561 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.09 ± 0.05 | −0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1562 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.09 ± 0.06 | −0.11 | −0.07 | 2.0 | no clear effect |  |
| 1563 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.09 ± 0.06 | −0.01 | −0.17 | 0.1 | no clear effect |  |
| 1564 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.09 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 1565 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.09 ± 0.05 | −0.12 | −0.07 | 1.0 | no clear effect |  |
| 1566 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.10 ± 0.05 | −0.02 | −0.17 | 0.1 | no clear effect |  |
| 1567 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.10 ± 0.04 | +0.00 | −0.20 | 0.5 | hurts |  |
| 1568 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | −0.10 ± 0.04 | −0.05 | −0.15 | 0.6 | hurts |  |
| 1569 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.10 ± 0.06 | −0.19 | −0.01 | 0.1 | no clear effect |  |
| 1570 | Tidal Shield | 17 | Ancestry | — | effect | −0.10 ± 0.04 | −0.13 | −0.07 | 2.0 | hurts |  |
| 1571 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.11 ± 0.03 | +0.00 | −0.22 | 0.0 | hurts | the AI never used it |
| 1572 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1573 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1574 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1575 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1576 | Determined Lore Seeker | 12 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.12 ± 0.07 | −0.25 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1577 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.12 ± 0.06 | −0.22 | −0.02 | 1.6 | no clear effect |  |
| 1578 | Indomitable Spirit | 17 | Ancestry | — | effect | −0.12 ± 0.05 | −0.23 | −0.02 | 2.0 | hurts |  |
| 1579 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.14 ± 0.05 | −0.02 | −0.26 | 10.3 | hurts |  |
| 1580 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 1581 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.14 ± 0.05 | −0.23 | −0.06 | 0.3 | hurts |  |
| 1582 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.15 ± 0.06 | −0.14 | −0.16 | 1.0 | hurts |  |
| 1583 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1584 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1585 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.17 ± 0.04 | −0.30 | −0.04 | 1.7 | hurts |  |
| 1586 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1587 | Magical Adaptation | 10 | Class | — | innate spells: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1588 | Greater Magical Scholastics | 10 | Class | — | innate spells: Augury (rank 2), Locate (rank 3), Veil of Privacy (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1589 | Greater Magical Edification | 10 | Class | — | innate spells: Translate (rank 2), Mindlink (rank 1), Secret Page (rank 3) | −0.18 ± 0.06 | −0.32 | −0.03 | 0.0 | hurts | the AI never used it |
| 1590 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1591 | Magical Edification | 4 | Class | — | innate spells: Guidance (rank 2), Message (rank 2), Sigil (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 1592 | Warding Light | 4 | Class | — | innate spells: Light (rank 2), Peaceful Rest (rank 2) | −0.18 ± 0.05 | −0.23 | −0.14 | 0.0 | hurts | the AI never used it |
| 1593 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1594 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1595 | Suli Amir | 13 | Ancestry | — | innate spells: Read Omens (rank 4), Invisibility (rank 4), Detect Magic (rank 7) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1596 | Summon Nephilim Kin | 13 | Ancestry | — | innate spells: Summon Celestial (rank 5), Summon Fiend (rank 5) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1597 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.19 ± 0.04 | −0.22 | −0.15 | 0.0 | hurts | the AI never used it |
| 1598 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.19 ± 0.06 | −0.31 | −0.06 | 0.2 | hurts |  |
| 1599 | Entities From Afar | 14 | Class | — | innate spells: Summon Entity (rank 5), Read Omens (rank 4) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1600 | Commandeer Hellmouth | 14 | Class | — | innate spells: Teleport (rank 6), Interplanar Teleport (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1601 | Expanded Runelord Magic | 14 | Class | — | innate spells: Contingency (rank 7), Spell Riposte (rank 7) | −0.19 ± 0.06 | −0.31 | −0.07 | 0.0 | hurts | the AI never used it |
| 1602 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.22 | −0.16 | 0.4 | hurts |  |
| 1603 | Form of the Beloved Mother | 17 | Ancestry | — | innate spells: Animal Form (rank 5), Slither (rank 5) | −0.19 ± 0.06 | −0.21 | −0.17 | 0.0 | hurts | the AI never used it |
| 1604 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1605 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spells: Repulsion (rank 6), Spellwrack (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1606 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1607 | Flourish and Ruin | 17 | Ancestry | — | innate spells: Field of Life (rank 6), Tangling Creepers (rank 6) | −0.19 ± 0.06 | −0.21 | −0.18 | 0.0 | hurts | the AI never used it |
| 1608 | Wildborn Adept | 5 | Ancestry | — | innate spells: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 1609 | Colugo's Traversal | 5 | Ancestry | — | innate spells: Gentle Landing (rank 1), Jump (rank 1) | −0.20 ± 0.04 | −0.32 | −0.07 | 0.0 | hurts | the AI never used it |
| 1610 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.20 ± 0.04 | −0.32 | −0.08 | 0.0 | hurts | the AI never used it |
| 1611 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1612 | Animal Magic | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1613 | Agathion Magic | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1614 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spells: Augury (rank 2), Calm (rank 2) | −0.21 ± 0.05 | −0.35 | −0.06 | 0.0 | hurts | the AI never used it |
| 1615 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.21 ± 0.06 | −0.21 | −0.22 | 0.0 | hurts | the AI never used it |
| 1616 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spells: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.21 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1617 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1618 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.22 ± 0.05 | −0.35 | −0.08 | 0.2 | hurts |  |
| 1619 | Apprentice Sea Witch | 5 | Ancestry | — | innate spells: Create Water (rank 1), Hydraulic Push (rank 1) | −0.22 ± 0.04 | −0.32 | −0.11 | 0.0 | hurts | the AI never used it |
| 1620 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 1621 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.22 ± 0.04 | −0.34 | −0.10 | 0.3 | hurts |  |
| 1622 | Phantom Orchestra | 9 | Ancestry | — | innate spells: Ventriloquism (rank 2), Figment (rank 5) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1623 | World-Protector's Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Cleanse Cuisine (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1624 | Emissary Assistance | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 3) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1625 | Janni Hospitality | 9 | Ancestry | — | innate spells: Create Food (rank 2), Create Water (rank 1) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1626 | Efreeti Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Illusory Object (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1627 | Bone Caller | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Marvelous Mount (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1628 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1629 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spells: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1630 | Asura Magic | 9 | Ancestry | — | innate spells: Blood Vendetta (rank 2), Death Knell (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1631 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1632 | Speaker's Defense | 9 | Ancestry | — | innate spells: Share Life (rank 2), Status (rank 2), Entangling Flora (rank 2), Environmental Endurance (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1633 | Horn and Bone Incantation | 9 | Ancestry | — | innate spells: Animal Form (rank 2), Humanoid Form (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1634 | Spiritual Echo | 9 | Ancestry | — | innate spells: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1635 | Flower Magic | 9 | Ancestry | — | innate spells: Oaken Resilience (rank 2), One with Plants (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1636 | Duskwalker Magic | 9 | Ancestry | — | innate spells: Augury (rank 2), Peaceful Rest (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1637 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spells: Resist Energy (rank 2), Share Life (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1638 | Natural Magnetism | 9 | Ancestry | — | innate spells: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1639 | Aboleth Transmutation | 9 | Ancestry | — | innate spells: Feet to Fins (rank 3), Water Breathing (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1640 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spells: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1641 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1642 | Janni Magic | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Speak with Animals (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1643 | Rokoan Arts | 9 | Ancestry | — | innate spells: Speak with Animals (rank 2), Status (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1644 | Cautious Curiosity | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), Silence (rank 2) | −0.23 ± 0.05 | −0.35 | −0.10 | 0.0 | hurts | the AI never used it |
| 1645 | Rivethun Adept | 16 | Class | — | innate spells: Speak with Stones (rank 5), Spiritual Guardian (rank 5) | −0.23 ± 0.07 | −0.29 | −0.17 | 0.0 | hurts | the AI never used it |
| 1646 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.23 ± 0.07 | −0.46 | −0.01 | 0.0 | hurts | the AI never used it |
| 1647 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.23 ± 0.05 | −0.44 | −0.03 | 0.3 | hurts | with two weapons (longsword and shortsword) |
| 1648 | Dream Magic | 8 | Class | — | innate spells: Dream Message (rank 3), Sleep (rank 4) | −0.24 ± 0.07 | −0.46 | −0.02 | 0.0 | hurts | the AI never used it |
| 1649 | Lore Seeker | 8 | Class | — | innate spells: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1650 | Rivethun Devotion | 8 | Class | — | innate spells: See the Unseen (rank 2), Spirit Link (rank 2) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1651 | Salt Kissed | 8 | Class | — | innate spells: Air Bubble (rank 1), Water Breathing (rank 4) | −0.24 ± 0.07 | −0.46 | −0.03 | 0.0 | hurts | the AI never used it |
| 1652 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.25 ± 0.05 | −0.34 | −0.16 | 0.3 | hurts |  |
| 1653 | Stonebound Magic | 6 | Class | — | innate spells: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.25 ± 0.05 | −0.46 | −0.05 | 0.2 | hurts |  |
| 1654 | Time Mage Dedication | 6 | Class | — | innate spells: Delay Consequence (rank 1), Time Sense (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1655 | Sound Mirror | 6 | Class | — | innate spells: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | −0.26 ± 0.05 | −0.46 | −0.05 | 0.0 | hurts | the AI never used it |
| 1656 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.27 ± 0.05 | −0.46 | −0.07 | 0.0 | hurts | the AI never used it |
| 1657 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.31 ± 0.08 | −0.35 | −0.27 | 0.9 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 4161 |
| a timer with no rules a fight counts | 205 |
| its requirement | 150 |
| a Strike with nothing more the simulator reads | 131 |
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
