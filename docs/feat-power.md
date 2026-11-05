# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-05: 1808 feats and actions rated, 5135 not simulated, 6 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 141 an encounter here, all fights 1248, no effect 615, precise 108, about zero 45 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1236
- hurts: 455
- good: 57
- minor: 31
- strong: 24
- very strong: 5

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.72 ± 0.05 | +1.09 | +0.34 | 4.2 | very strong |  |
| 2 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.60 ± 0.10 | +1.08 | +0.12 | 0.0 | very strong | the AI never used it |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.19 | 1.2 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.55 ± 0.11 | +0.98 | +0.11 | 3.3 | very strong |  |
| 5 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.51 ± 0.06 | +0.46 | +0.56 | 5.0 | very strong |  |
| 6 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.54 | +0.39 | 5.1 | strong |  |
| 7 | Scare to Death | 15 | Skill | — | save | +0.44 ± 0.05 | +0.65 | +0.22 | 3.8 | strong |  |
| 8 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.43 ± 0.08 | +0.37 | +0.50 | 14.1 | strong |  |
| 9 | Path of Iron | 14 | Class | — | 3 Strikes | +0.43 ± 0.05 | +0.53 | +0.34 | 3.7 | strong |  |
| 10 | Drifting Pollen | 8 | Class | kineticist | save | +0.43 ± 0.10 | +0.66 | +0.19 | 10.4 | strong |  |
| 11 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.42 ± 0.09 | +0.52 | +0.32 | 4.3 | strong |  |
| 12 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.40 ± 0.05 | +0.24 | +0.56 | 0.0 | strong | the AI never used it |
| 13 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 14 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 15 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.38 ± 0.05 | +0.55 | +0.20 | 5.7 | strong |  |
| 16 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.36 ± 0.06 | +0.41 | +0.31 | 0.0 | strong | the AI never used it |
| 17 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.51 | +0.19 | 10.5 | strong |  |
| 18 | Shattering Shot | 12 | Class | gunslinger | save | +0.33 ± 0.08 | +0.28 | +0.37 | 10.6 | strong |  |
| 19 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 20 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.31 ± 0.07 | +0.45 | +0.16 | 5.4 | strong |  |
| 21 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 22 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 23 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 24 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 25 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 26 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 27 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 28 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 29 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.06 | +0.40 | +0.11 | 4.4 | strong |  |
| 30 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.25 ± 0.06 | +0.34 | +0.15 | 1.0 | good |  |
| 31 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 32 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 33 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 34 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 35 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.36 | +0.11 | 3.2 | good |  |
| 36 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 37 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 38 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 39 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.23 ± 0.06 | +0.33 | +0.12 | 3.6 | good |  |
| 40 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.22 ± 0.05 | +0.33 | +0.12 | 1.0 | good |  |

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
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.72 ± 0.05 | +1.09 | +0.34 | 4.2 | very strong |  |
| 2 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.60 ± 0.10 | +1.08 | +0.12 | 0.0 | very strong | the AI never used it |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.19 | 1.2 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.55 ± 0.11 | +0.98 | +0.11 | 3.3 | very strong |  |
| 5 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.51 ± 0.06 | +0.46 | +0.56 | 5.0 | very strong |  |
| 6 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.54 | +0.39 | 5.1 | strong |  |
| 7 | Scare to Death | 15 | Skill | — | save | +0.44 ± 0.05 | +0.65 | +0.22 | 3.8 | strong |  |
| 8 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.43 ± 0.08 | +0.37 | +0.50 | 14.1 | strong |  |
| 9 | Path of Iron | 14 | Class | — | 3 Strikes | +0.43 ± 0.05 | +0.53 | +0.34 | 3.7 | strong |  |
| 10 | Drifting Pollen | 8 | Class | kineticist | save | +0.43 ± 0.10 | +0.66 | +0.19 | 10.4 | strong |  |
| 11 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.42 ± 0.09 | +0.52 | +0.32 | 4.3 | strong |  |
| 12 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.40 ± 0.05 | +0.24 | +0.56 | 0.0 | strong | the AI never used it |
| 13 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 14 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 15 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.38 ± 0.05 | +0.55 | +0.20 | 5.7 | strong |  |
| 16 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.36 ± 0.06 | +0.41 | +0.31 | 0.0 | strong | the AI never used it |
| 17 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.51 | +0.19 | 10.5 | strong |  |
| 18 | Shattering Shot | 12 | Class | gunslinger | save | +0.33 ± 0.08 | +0.28 | +0.37 | 10.6 | strong |  |
| 19 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 20 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.31 ± 0.07 | +0.45 | +0.16 | 5.4 | strong |  |
| 21 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 22 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 23 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 24 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 25 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 26 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 27 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 28 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 29 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.06 | +0.40 | +0.11 | 4.4 | strong |  |
| 30 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.25 ± 0.06 | +0.34 | +0.15 | 1.0 | good |  |
| 31 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 32 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 33 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 34 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 35 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.36 | +0.11 | 3.2 | good |  |
| 36 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 37 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 38 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 39 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.23 ± 0.06 | +0.33 | +0.12 | 3.6 | good |  |
| 40 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.22 ± 0.05 | +0.33 | +0.12 | 1.0 | good |  |
| 41 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.22 ± 0.04 | +0.32 | +0.12 | 1.5 | good |  |
| 42 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 43 | Patron's Claim | 0 | Action | — | inline save: 1 creature, 30 feet, fortitude, 10d10 spirit (DC 17, 1/fight) | +0.21 ± 0.05 | +0.26 | +0.15 | 1.0 | good |  |
| 44 | Topple the Pillar of Heaven | 0 | Action | — | inline save: 60-foot line, reflex, 6d8 untyped (DC 17) | +0.21 ± 0.05 | +0.11 | +0.30 | 1.5 | good |  |
| 45 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 46 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 47 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 48 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 49 | Root to Life | 1 | Class | thaumaturge | check | +0.19 ± 0.07 | +0.30 | +0.08 | 2.9 | good |  |
| 50 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.18 ± 0.07 | +0.16 | +0.21 | 0.0 | good | the AI never used it |
| 51 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.18 ± 0.09 | +0.16 | +0.20 | 0.9 | good |  |
| 52 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 53 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 54 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 55 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |
| 56 | Death Roll | 6 | Class | — | Strike activity | +0.17 ± 0.03 | +0.30 | +0.05 | 5.7 | good |  |
| 57 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 58 | Basic Mysteries | 4 | Class | — | Nudge the Scales: heals 10 (30 feet) | +0.17 ± 0.06 | +0.30 | +0.04 | 0.0 | good | the AI never used it |
| 59 | Basic Maneuver | 4 | Class | — | Snagging Strike: Strike activity | +0.17 ± 0.05 | +0.25 | +0.09 | 0.0 | good | with a one-handed weapon and a free hand; the AI never used it |
| 60 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.16 ± 0.06 | +0.23 | +0.09 | 1.0 | good |  |
| 61 | Shattering Spellstrike | 4 | Class | magus | check | +0.16 ± 0.07 | +0.44 | −0.12 | 2.5 | good |  |
| 62 | Haft Beatdown | 10 | Class | fighter | four Strikes, two at its penalty and two one step worse (3 actions, once a fight) (in Haft Striker Stance) | +0.16 ± 0.05 | +0.23 | +0.08 | 1.0 | good |  |
| 63 | Infernal Anguish | 8 | Class | — | check | +0.15 ± 0.06 | +0.44 | −0.14 | 9.1 | good |  |
| 64 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.04 | +0.19 | +0.10 | 1.3 | good |  |
| 65 | Ash Strider | 6 | Class | kineticist | save | +0.15 ± 0.08 | +0.38 | −0.09 | 4.1 | no clear effect |  |
| 66 | Merciless Rend | 10 | Class | summoner | check | +0.15 ± 0.05 | +0.16 | +0.14 | 3.6 | good |  |
| 67 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.15 ± 0.03 | +0.19 | +0.10 | 0.8 | good |  |
| 68 | Devastating Duelist | 18 | Class | — | Strike activity | +0.14 ± 0.04 | +0.19 | +0.10 | 4.1 | good |  |
| 69 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.14 ± 0.07 | +0.13 | +0.16 | 5.2 | no clear effect | with two weapons (longsword and shortsword) |
| 70 | Recharging Flurry | 4 | Class | magus | 2 Strikes | +0.14 ± 0.08 | +0.22 | +0.06 | 2.5 | no clear effect | with two weapons (longsword and shortsword) |
| 71 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.14 ± 0.06 | +0.17 | +0.11 | 3.8 | good | with two weapons (longsword and shortsword) |
| 72 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.04 | +0.10 | +0.17 | 0.0 | good | the AI never used it |
| 73 | Living Epic | 20 | Class | — | passive effect (always on) | +0.13 ± 0.03 | +0.13 | +0.13 | 1.0 | good | always on (its moment isn't checked) |
| 74 | Assassinate | 12 | Class | — | Strike activity (requirement assumed: You have designated a mark using Mark for Death and are completely unnoticed by your mark) | +0.13 ± 0.06 | +0.15 | +0.12 | 3.3 | good |  |
| 75 | Siphon Life | 10 | Class | — | Strike activity | +0.13 ± 0.04 | +0.22 | +0.04 | 3.5 | good |  |
| 76 | Scour the Library | 10 | Class | psychic | self effect | +0.13 ± 0.05 | +0.17 | +0.10 | 3.2 | good |  |
| 77 | Telling Blow | 18 | Class | — | Strike activity | +0.13 ± 0.05 | +0.14 | +0.13 | 3.6 | good |  |
| 78 | Return Unto Runes | 16 | Class | — | self effect | +0.13 ± 0.07 | +0.08 | +0.18 | 6.1 | no clear effect |  |
| 79 | Marked for Rebuke | 18 | Class | — | an Effect on a foe | +0.13 ± 0.05 | +0.18 | +0.08 | 6.8 | good |  |
| 80 | Furious Grab | 12 | Class | barbarian | check | +0.13 ± 0.08 | +0.18 | +0.08 | 5.8 | no clear effect |  |
| 81 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.13 ± 0.07 | +0.17 | +0.08 | 1.0 | no clear effect |  |
| 82 | Sportlebore Choke | 8 | Class | — | save (requirement assumed: Your swarm is outside your body) | +0.13 ± 0.06 | +0.30 | −0.05 | 3.4 | good |  |
| 83 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.12 ± 0.06 | +0.29 | −0.04 | 4.0 | good |  |
| 84 | Imprison Foe | 18 | Class | — | save | +0.12 ± 0.05 | +0.15 | +0.09 | 2.6 | good |  |
| 85 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.12 ± 0.06 | +0.23 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 86 | Osteo Armaments | 4 | Class | — | effect | +0.12 ± 0.05 | +0.05 | +0.19 | 2.0 | good |  |
| 87 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.12 ± 0.03 | +0.20 | +0.04 | 0.3 | good |  |
| 88 | Forest's Heart | 16 | Class | animist | stance | +0.12 ± 0.07 | +0.28 | −0.05 | 1.0 | no clear effect |  |
| 89 | Lantern Beam | 0 | Action | — | save (requirement assumed: Your lantern light is shining) | +0.12 ± 0.05 | +0.09 | +0.14 | 1.1 | good |  |
| 90 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 91 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.11 ± 0.03 | +0.08 | +0.15 | 0.7 | good |  |
| 92 | Lava Leap | 4 | Class | kineticist | save | +0.11 ± 0.08 | +0.18 | +0.05 | 1.6 | no clear effect |  |
| 93 | Usurp the Lunar Reins | 18 | Class | kineticist | save | +0.11 ± 0.05 | −0.01 | +0.22 | 0.8 | good |  |
| 94 | Seize | 14 | Class | — | check | +0.11 ± 0.06 | +0.20 | +0.02 | 7.1 | no clear effect |  |
| 95 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.11 ± 0.06 | +0.20 | +0.02 | 3.3 | no clear effect |  |
| 96 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.11 ± 0.08 | +0.01 | +0.21 | 3.9 | no clear effect | with a loaded arquebus |
| 97 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.11 ± 0.06 | +0.15 | +0.06 | 10.3 | no clear effect |  |
| 98 | Grievous Blow | 8 | Class | — | Strike activity | +0.11 ± 0.05 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 99 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 100 | Duo's Aim | 8 | Class | — | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 4.1 | no clear effect |  |
| 101 | Pierce the Eye | 16 | Class | — | save | +0.10 ± 0.07 | +0.23 | −0.02 | 3.7 | no clear effect | with a loaded arquebus |
| 102 | Mythic Containment | 10 | Class | — | check | +0.10 ± 0.05 | +0.20 | +0.01 | 2.8 | good |  |
| 103 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.10 ± 0.06 | +0.30 | −0.10 | 1.0 | no clear effect |  |
| 104 | Spirit Sanctification | 0 | Action | — | its text's self buff (FlatModifier saving-throw 1) | +0.10 ± 0.03 | +0.06 | +0.14 | 1.0 | good |  |
| 105 | Thundering Roar | 0 | Action | — | inline save: 10-foot emanation, will, 4d8 sonic (DC 17) | +0.10 ± 0.04 | +0.00 | +0.20 | 1.1 | minor |  |
| 106 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 107 | Into the Fray | 8 | Class | — | 2 Strikes | +0.10 ± 0.05 | +0.20 | −0.00 | 3.4 | no clear effect | with a weapon and a shield |
| 108 | Do You Know Who I Am? | 12 | Class | — | check | +0.10 ± 0.06 | +0.13 | +0.06 | 1.0 | no clear effect |  |
| 109 | Reveal Machinations | 15 | Skill | — | check | +0.10 ± 0.04 | +0.09 | +0.10 | 1.0 | minor |  |
| 110 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.10 ± 0.07 | +0.70 | −0.51 | 25.8 | no clear effect |  |
| 111 | Topple The Titans | 4 | Class | exemplar | check | +0.10 ± 0.07 | +0.29 | −0.10 | 1.0 | no clear effect |  |
| 112 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 113 | Armor Break | 12 | Class | guardian | save | +0.09 ± 0.06 | +0.10 | +0.09 | 2.3 | no clear effect |  |
| 114 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.09 ± 0.05 | +0.16 | +0.02 | 1.0 | no clear effect |  |
| 115 | Borrow Time | 10 | Class | — | check | +0.09 ± 0.03 | +0.11 | +0.07 | 1.0 | minor |  |
| 116 | Raging Intimidation | 1 | Class | barbarian | Scare to Death: save | +0.09 ± 0.04 | +0.33 | −0.15 | 0.0 | minor | the AI never used it |
| 117 | Certain Strike | 10 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.14 | +0.04 | 7.4 | minor |  |
| 118 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.09 ± 0.05 | +0.04 | +0.13 | 5.2 | no clear effect |  |
| 119 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.12 | +0.05 | 3.2 | minor | with a one-handed weapon and a free hand |
| 120 | Basic Defender | 4 | Class | — | Taunting Strike: Strike activity | +0.09 ± 0.03 | +0.18 | −0.01 | 0.0 | minor | the AI never used it |
| 121 | Rallying Banner | 8 | Class | commander | check | +0.09 ± 0.07 | +0.08 | +0.09 | 1.0 | no clear effect |  |
| 122 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 123 | Dirge of Doom | 6 | Class | bard | innate spell: Dirge of Doom (rank 3) | +0.09 ± 0.03 | +0.16 | +0.01 | 5.3 | minor |  |
| 124 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.08 ± 0.05 | +0.06 | +0.11 | 1.0 | no clear effect |  |
| 125 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 126 | Olethros's Decree | 17 | Ancestry | — | save | +0.08 ± 0.04 | +0.15 | +0.02 | 1.0 | minor |  |
| 127 | Apocalyptic Visions | 18 | Class | — | save | +0.08 ± 0.06 | +0.11 | +0.05 | 1.0 | no clear effect |  |
| 128 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.08 ± 0.07 | −0.07 | +0.24 | 4.2 | no clear effect |  |
| 129 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.08 ± 0.03 | +0.14 | +0.02 | 2.1 | minor |  |
| 130 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.08 ± 0.06 | +0.10 | +0.06 | 5.5 | no clear effect |  |
| 131 | Rend Armor | 8 | Class | — | effect | +0.08 ± 0.05 | +0.37 | −0.21 | 7.2 | no clear effect |  |
| 132 | Scintillating Spell | 16 | Class | sorcerer | Scintillating Spell copies of 13 spells | +0.08 ± 0.06 | −0.01 | +0.16 | 3.8 | no clear effect |  |
| 133 | Promise of Pain | 10 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.06 | 1.0 | no clear effect |  |
| 134 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | +0.07 ± 0.05 | +0.10 | +0.05 | 0.6 | no clear effect |  |
| 135 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.07 ± 0.04 | +0.11 | +0.04 | 4.2 | no clear effect |  |
| 136 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.07 ± 0.08 | +0.15 | −0.01 | 4.4 | no clear effect |  |
| 137 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.07 ± 0.02 | +0.11 | +0.03 | 0.2 | minor |  |
| 138 | Terrain Shield | 14 | Class | — | effect | +0.07 ± 0.02 | +0.11 | +0.03 | 0.4 | minor |  |
| 139 | Cry Havoc! | 0 | Action | commander | save | +0.07 ± 0.05 | +0.10 | +0.04 | 0.8 | no clear effect |  |
| 140 | Rain of Razors | 12 | Class | kineticist | save | +0.07 ± 0.07 | −0.04 | +0.19 | 1.6 | no clear effect |  |
| 141 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.07 ± 0.04 | +0.12 | +0.02 | 4.0 | no clear effect |  |
| 142 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.07 ± 0.05 | +0.02 | +0.12 | 1.0 | no clear effect |  |
| 143 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.04 | −0.06 | +0.21 | 0.1 | no clear effect |  |
| 144 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.07 ± 0.04 | +0.05 | +0.09 | 1.9 | no clear effect |  |
| 145 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.07 ± 0.05 | +0.09 | +0.05 | 6.0 | no clear effect |  |
| 146 | Unseat | 10 | Class | — | Strike activity (requirement assumed: You are riding your mount and wielding a jousting weapon) | +0.07 ± 0.02 | +0.13 | +0.01 | 7.7 | minor |  |
| 147 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.07 | +0.09 | +0.05 | 4.9 | no clear effect | with two weapons (longsword and shortsword) |
| 148 | Acknowledge Fan | 12 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.04 | 3.0 | no clear effect |  |
| 149 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.10 | +0.02 | 2.3 | minor | with a bow in hand |
| 150 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.06 ± 0.07 | +0.05 | +0.07 | 1.0 | no clear effect |  |
| 151 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.06 ± 0.06 | +0.06 | +0.07 | 1.0 | no clear effect |  |
| 152 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 153 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 154 | Enchanting Shot | 8 | Class | — | Strike activity | +0.06 ± 0.06 | +0.13 | −0.00 | 3.2 | no clear effect |  |
| 155 | Boarding Assault | 0 | Action | — | Strike activity | +0.06 ± 0.03 | +0.03 | +0.09 | 1.6 | no clear effect |  |
| 156 | Blazing Aura | 17 | Ancestry | — | save | +0.06 ± 0.05 | +0.08 | +0.05 | 1.0 | no clear effect |  |
| 157 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 158 | Second Sting | 12 | Class | ranger | Strike activity | +0.06 ± 0.06 | +0.04 | +0.08 | 8.1 | no clear effect | with two weapons (longsword and shortsword) |
| 159 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.06 ± 0.08 | +0.20 | −0.08 | 1.0 | no clear effect |  |
| 160 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 161 | Gruesome Strike | 12 | Class | champion | Strike activity (requirement assumed: Your Strikes currently deal extra damage from your champion's reaction) | +0.06 ± 0.06 | −0.09 | +0.21 | 15.1 | no clear effect |  |
| 162 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.04 | +0.08 | +0.04 | 0.9 | no clear effect |  |
| 163 | Adamantine Body | 8 | Class | — | effect | +0.06 ± 0.02 | +0.12 | +0.00 | 1.6 | minor |  |
| 164 | Call Worm Spirit | 10 | Class | — | save | +0.06 ± 0.05 | +0.00 | +0.12 | 1.0 | no clear effect |  |
| 165 | Overflowing Blade | 0 | Action | — | Strike activity (requirement assumed: You are overflowing) | +0.06 ± 0.02 | +0.03 | +0.09 | 3.6 | minor |  |
| 166 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.06 ± 0.06 | +0.19 | −0.08 | 4.4 | no clear effect |  |
| 167 | Clear as Air | 6 | Class | kineticist | check | +0.06 ± 0.09 | +0.19 | −0.08 | 2.6 | no clear effect |  |
| 168 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 2.9 | no clear effect |  |
| 169 | Cursed Effigy | 8 | Class | thaumaturge | an Effect on a foe | +0.06 ± 0.09 | +0.04 | +0.08 | 6.3 | no clear effect |  |
| 170 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 171 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 172 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 173 | Close Contract | 10 | Class | — | effect (requirement assumed: You have completed your active course of action but haven't Dismissed it or chosen a new one) | +0.06 ± 0.04 | +0.10 | +0.01 | 2.0 | no clear effect |  |
| 174 | Ignite the Sun | 18 | Class | kineticist | save | +0.05 ± 0.07 | +0.07 | +0.04 | 5.2 | no clear effect |  |
| 175 | Reap the Field | 0 | Action | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.11 | 1.0 | minor |  |
| 176 | Lethal Edge | 10 | Class | — | check | +0.05 ± 0.02 | +0.04 | +0.07 | 6.2 | minor |  |
| 177 | Rallying Anthem | 4 | Class | bard | innate spell: Rallying Anthem (rank 2) | +0.05 ± 0.04 | +0.08 | +0.03 | 11.8 | no clear effect |  |
| 178 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.05 ± 0.07 | +0.06 | +0.05 | 1.0 | no clear effect |  |
| 179 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 180 | Glacial Prison | 12 | Class | kineticist | save | +0.05 ± 0.09 | +0.05 | +0.05 | 3.0 | no clear effect |  |
| 181 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 182 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.05 ± 0.02 | +0.03 | +0.07 | 0.5 | minor |  |
| 183 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.03 | 0.1 | minor |  |
| 184 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 185 | Goblin Jubilee Display | 10 | Class | — | Goblin Jubilee: save | +0.05 ± 0.04 | +0.05 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 186 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 187 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.05 ± 0.03 | −0.00 | +0.10 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 188 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.05 ± 0.04 | +0.11 | −0.01 | 1.0 | no clear effect |  |
| 189 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | +0.05 ± 0.08 | +0.16 | −0.06 | 3.3 | no clear effect |  |
| 190 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.03 | +0.05 | +0.04 | 1.7 | no clear effect |  |
| 191 | Advanced General Training | 13 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.05 ± 0.03 | +0.03 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 192 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 193 | Fleeting Arc through Heaven and Earth | 0 | Action | — | inline save: 60-foot cone, fortitude, 9d6 spirit (DC 17) | +0.05 ± 0.06 | −0.08 | +0.17 | 0.6 | no clear effect |  |
| 194 | Lastwall Sentry Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.05 ± 0.02 | +0.04 | +0.05 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 195 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 196 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 197 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.09 | 2.1 | no clear effect | with a loaded arquebus |
| 198 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.05 ± 0.03 | +0.02 | +0.07 | 0.2 | no clear effect |  |
| 199 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 200 | Vicious Debilitations | 10 | Class | rogue | Debilitating Strike's clumsy 1 in place of enfeebled 1 | +0.04 ± 0.03 | +0.08 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 201 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.04 ± 0.05 | +0.06 | +0.03 | 3.0 | no clear effect |  |
| 202 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.04 ± 0.03 | +0.10 | −0.01 | 1.8 | no clear effect |  |
| 203 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 204 | Titan Swing | 2 | Class | — | Strike activity | +0.04 ± 0.03 | +0.16 | −0.08 | 2.6 | no clear effect |  |
| 205 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 206 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 207 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 208 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 209 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.04 ± 0.09 | +0.12 | −0.04 | 3.6 | no clear effect |  |
| 210 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 211 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.04 ± 0.02 | +0.00 | +0.08 | 0.7 | no clear effect |  |
| 212 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 213 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 214 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 215 | Multifarious Muse | 2 | Class | bard | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | +0.04 ± 0.04 | +0.13 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 216 | Murderer's Circle | 14 | Class | — | a Strike, then the target off-guard to the next one this turn | +0.04 ± 0.02 | +0.04 | +0.04 | 9.4 | no clear effect |  |
| 217 | Social Purview | 4 | Class | — | Gladiator Dedication: passive effect (always on) | +0.04 ± 0.02 | +0.02 | +0.06 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 218 | The World Devours | 12 | Class | — | save (requirement assumed: Your waking world is active) | +0.04 ± 0.04 | −0.06 | +0.14 | 1.6 | no clear effect |  |
| 219 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.04 ± 0.05 | +0.08 | −0.00 | 1.0 | no clear effect |  |
| 220 | Set-Up Strike | 2 | Class | commander | Strike activity | +0.04 ± 0.05 | +0.11 | −0.03 | 2.6 | no clear effect |  |
| 221 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.04 ± 0.06 | +0.06 | +0.01 | 6.3 | no clear effect |  |
| 222 | Draw From the Land | 10 | Class | — | check | +0.04 ± 0.02 | +0.11 | −0.03 | 0.3 | no clear effect |  |
| 223 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 224 | Think Twice | 14 | Class | fighter | ac-reaction | +0.04 ± 0.03 | +0.06 | +0.02 | 0.4 | no clear effect |  |
| 225 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.04 ± 0.05 | +0.09 | −0.02 | 3.5 | no clear effect |  |
| 226 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.04 ± 0.06 | +0.10 | −0.03 | 3.3 | no clear effect |  |
| 227 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.04 ± 0.04 | +0.04 | +0.03 | 2.8 | no clear effect |  |
| 228 | Heat Wave | 5 | Ancestry | — | check | +0.04 ± 0.03 | +0.03 | +0.05 | 1.0 | no clear effect |  |
| 229 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.03 ± 0.08 | −0.02 | +0.09 | 4.4 | no clear effect |  |
| 230 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 231 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.03 ± 0.01 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 232 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 233 | Histrionic Injury | 5 | Ancestry | — | save | +0.03 ± 0.02 | +0.04 | +0.03 | 0.6 | no clear effect |  |
| 234 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.03 ± 0.05 | +0.04 | +0.02 | 0.4 | no clear effect |  |
| 235 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.03 ± 0.03 | +0.04 | +0.02 | 2.0 | no clear effect |  |
| 236 | Unbreaking Castle | 10 | Class | — | effect | +0.03 ± 0.05 | −0.03 | +0.09 | 6.0 | no clear effect | with a weapon and a shield |
| 237 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.3 | no clear effect |  |
| 238 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 239 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.06 | +0.01 | 1.1 | no clear effect |  |
| 240 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.03 ± 0.04 | +0.03 | +0.03 | 0.9 | no clear effect |  |
| 241 | Reversing Charge | 8 | Class | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 242 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.04 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 243 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.03 ± 0.05 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 244 | Gaping Flesh | 5 | Ancestry | — | save | +0.03 ± 0.02 | +0.03 | +0.03 | 0.6 | no clear effect |  |
| 245 | Martial Performance | 1 | Class | bard | innate spells: Courageous Anthem (rank 1), Rallying Anthem (rank 1), Song of Strength (rank 1) | +0.03 ± 0.03 | +0.06 | −0.00 | 2.7 | no clear effect |  |
| 246 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.03 ± 0.05 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 247 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.01 | +0.04 | +0.02 | 1.7 | no clear effect |  |
| 248 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 249 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 250 | Head Stomp | 4 | Class | rogue | Strike activity | +0.03 ± 0.03 | +0.07 | −0.01 | 5.1 | no clear effect |  |
| 251 | Pirate Dedication | 2 | Class | — | Boarding Assault: Strike activity | +0.03 ± 0.04 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 252 | Great Cleave | 10 | Class | barbarian | Cleave, going on while each Strike drops its creature (reaction) | +0.03 ± 0.01 | +0.00 | +0.06 | 0.6 | no clear effect |  |
| 253 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 254 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.03 ± 0.02 | +0.05 | +0.01 | 0.1 | no clear effect | with a weapon and a shield |
| 255 | Megaton Strike | 4 | Class | inventor | Strike activity | +0.03 ± 0.10 | +0.10 | −0.05 | 7.8 | no clear effect |  |
| 256 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 257 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 258 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 259 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 260 | Coordinated Distraction | 12 | Class | rogue | check | +0.03 ± 0.06 | +0.19 | −0.14 | 5.0 | no clear effect |  |
| 261 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.03 ± 0.04 | +0.13 | −0.07 | 1.0 | no clear effect |  |
| 262 | Calcifying Sand | 4 | Class | kineticist | save | +0.03 ± 0.03 | +0.06 | +0.00 | 0.2 | no clear effect |  |
| 263 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | +0.03 ± 0.03 | +0.03 | +0.02 | 0.4 | no clear effect |  |
| 264 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.03 ± 0.02 | −0.02 | +0.08 | 1.5 | no clear effect |  |
| 265 | Victorious Vigor | 5 | Ancestry | — | check | +0.03 ± 0.01 | +0.00 | +0.05 | 1.4 | no clear effect |  |
| 266 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Emotional Push | 2 | Class | bard | check | +0.03 ± 0.04 | +0.15 | −0.10 | 3.0 | no clear effect |  |
| 268 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 269 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.03 ± 0.04 | −0.05 | +0.10 | 0.8 | no clear effect |  |
| 270 | Annihilating Compound Invocation | 18 | Class | — | save | +0.03 ± 0.07 | +0.17 | −0.12 | 14.6 | no clear effect |  |
| 271 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 272 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.03 ± 0.03 | +0.01 | +0.04 | 1.0 | no clear effect | with a loaded arquebus |
| 273 | Absorb Strength | 5 | Ancestry | — | check | +0.03 ± 0.02 | +0.04 | +0.01 | 0.6 | no clear effect |  |
| 274 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 275 | Final Spite | 8 | Class | — | save | +0.02 ± 0.02 | +0.05 | +0.00 | 0.5 | no clear effect |  |
| 276 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 277 | Dazzling Dragonet Disappearance | 17 | Ancestry | — | check | +0.02 ± 0.01 | +0.04 | +0.01 | 0.1 | no clear effect |  |
| 278 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 279 | Timely Dodge | 0 | Action | — | ac-reaction | +0.02 ± 0.02 | +0.01 | +0.04 | 1.3 | no clear effect |  |
| 280 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.08 | −0.04 | 2.9 | no clear effect |  |
| 281 | Nimble Strike | 10 | Class | rogue | Nimble Dodge, then a melee Strike at the attacker (reaction) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 282 | Pack Attack | 6 | Class | — | strike-extra | +0.02 ± 0.04 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 283 | Basic Kata | 4 | Class | — | Crushing Grab: Strength damage on a successful Grapple (always on) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 284 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 285 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.02 ± 0.03 | +0.05 | −0.00 | 2.7 | no clear effect |  |
| 286 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.02 ± 0.05 | +0.01 | +0.03 | 5.8 | no clear effect |  |
| 287 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.00 | +0.04 | 0.7 | no clear effect |  |
| 288 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.02 ± 0.02 | +0.02 | +0.03 | 2.4 | no clear effect |  |
| 289 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | +0.02 ± 0.04 | +0.00 | +0.04 | 1.4 | no clear effect |  |
| 290 | General Training | 1 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.02 ± 0.03 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 291 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.02 ± 0.05 | +0.10 | −0.06 | 4.2 | no clear effect |  |
| 292 | Feral Mending | 8 | Class | — | check | +0.02 ± 0.03 | +0.03 | +0.02 | 0.2 | no clear effect |  |
| 293 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 294 | Defender's Grit | 4 | Class | — | passive effect (always on) | +0.02 ± 0.02 | +0.02 | +0.02 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 295 | Too Angry to Die | 12 | Skill | — | check | +0.02 ± 0.05 | +0.18 | −0.14 | 3.7 | no clear effect |  |
| 296 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 297 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 298 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 299 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 300 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 301 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 302 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.02 | +0.00 | +0.04 | 1.7 | no clear effect |  |
| 303 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.02 ± 0.04 | +0.02 | +0.02 | 0.2 | no clear effect |  |
| 304 | Torrent in the Blood | 6 | Class | kineticist | check | +0.02 ± 0.08 | +0.21 | −0.17 | 3.0 | no clear effect |  |
| 305 | Feral Lunge | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | +0.02 ± 0.04 | +0.06 | −0.02 | 2.2 | no clear effect |  |
| 306 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | +0.02 ± 0.06 | +0.02 | +0.02 | 2.0 | no clear effect |  |
| 307 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 308 | All Shall End in Flames | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.01 | +0.03 | 0.8 | no clear effect |  |
| 309 | Looming Gait | 5 | Ancestry | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 0.8 | no clear effect |  |
| 310 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 311 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.03 | +0.01 | 2.5 | no clear effect |  |
| 312 | Precise Debilitations | 10 | Class | rogue | Debilitating Strike's off-guard in place of enfeebled 1 | +0.02 ± 0.03 | +0.05 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 313 | Take in the Catch | 12 | Class | — | Strike activity (requirement assumed: You're holding a net) | +0.02 ± 0.06 | +0.14 | −0.10 | 3.6 | no clear effect |  |
| 314 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 315 | Force of Nature | 16 | Class | — | fast-healing | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect |  |
| 316 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 317 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 318 | Crushing Grab | 2 | Class | monk | Strength damage on a successful Grapple (always on) | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 319 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 320 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 321 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.02 | +0.08 | −0.05 | 0.2 | no clear effect |  |
| 322 | Stitching Strike | 0 | Action | — | inline save: 1 creature, 30 feet, reflex, 6d6 slashing (DC 17, 1/fight) | +0.02 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 323 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.06 | +0.09 | 7.7 | no clear effect | with two weapons (longsword and shortsword) |
| 324 | Aldori Riposte | 6 | Class | — | a riposte Strike on a critical miss (reaction) | +0.02 ± 0.02 | +0.02 | +0.01 | 0.4 | no clear effect |  |
| 325 | Jalmeri Heavenseeker Dedication | 4 | Class | — | Rain of Embers Stance: PF2e's stance Effect | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 326 | Shed Spirit | 0 | Action | — | inline save: 1 creature, 20 feet, will, 6d6 spirit (DC 17, 1/fight) | +0.01 ± 0.05 | +0.00 | +0.03 | 1.0 | no clear effect |  |
| 327 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.01 ± 0.02 | +0.00 | +0.03 | 0.7 | no clear effect |  |
| 328 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.01 ± 0.01 | +0.03 | +0.00 | 0.1 | no clear effect |  |
| 329 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 330 | Exploit Opening | 6 | Class | — | a ranged Strike (+2) when an ally critically hits (reaction) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.5 | no clear effect |  |
| 331 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | +0.01 ± 0.02 | −0.01 | +0.04 | 0.5 | no clear effect |  |
| 332 | Psi Burst | 2 | Class | psychic | save | +0.01 ± 0.04 | +0.02 | +0.00 | 5.8 | no clear effect |  |
| 333 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.01 ± 0.03 | +0.12 | −0.09 | 0.8 | no clear effect |  |
| 334 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 335 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.01 | +0.02 | 1.3 | no clear effect |  |
| 336 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.05 | −0.02 | 11.5 | no clear effect | with a one-handed weapon and a free hand |
| 337 | Inscribed Blast | 5 | Ancestry | — | check | +0.01 ± 0.02 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 338 | Basic Devotion | 4 | Class | — | Defensive Advance: Strike activity | +0.01 ± 0.03 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 339 | Devout Blessing | 6 | Class | — | Blessed Swiftness: PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 340 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 341 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.05 | +0.02 | +0.00 | 1.6 | no clear effect | with two weapons (longsword and shortsword) |
| 342 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 343 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 344 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 345 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.04 | +0.02 | −0.00 | 3.5 | no clear effect |  |
| 346 | High-Speed Regeneration | 6 | Class | — | check | +0.01 ± 0.01 | +0.03 | −0.01 | 2.5 | no clear effect |  |
| 347 | Leading Dance | 4 | Class | swashbuckler | check | +0.01 ± 0.05 | +0.25 | −0.23 | 5.8 | no clear effect |  |
| 348 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.01 ± 0.01 | −0.00 | +0.02 | 2.3 | no clear effect |  |
| 349 | Vessel's Form | 16 | Class | — | check | +0.01 ± 0.03 | +0.05 | −0.03 | 0.2 | no clear effect |  |
| 350 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.01 ± 0.02 | −0.00 | +0.02 | 0.6 | no clear effect |  |
| 351 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.01 | +0.01 | 1.7 | no clear effect |  |
| 352 | Gods' Palm | 8 | Class | — | Strike activity | +0.01 ± 0.02 | +0.04 | −0.02 | 3.2 | no clear effect |  |
| 353 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 354 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | +0.01 ± 0.03 | −0.01 | +0.03 | 2.6 | no clear effect |  |
| 355 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | +0.01 ± 0.03 | −0.02 | +0.03 | 0.6 | no clear effect |  |
| 356 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 357 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 358 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.01 ± 0.04 | −0.05 | +0.07 | 1.4 | no clear effect |  |
| 359 | Pit of Snakes | 13 | Ancestry | — | save | +0.01 ± 0.02 | +0.02 | −0.00 | 0.6 | no clear effect |  |
| 360 | It Was Me All Along! | 14 | Class | — | check | +0.01 ± 0.04 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 361 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.04 | −0.02 | 2.4 | no clear effect |  |
| 362 | Instant Recovery | 0 | Action | — | healing | +0.01 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 363 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.01 | −0.01 | +0.02 | 0.4 | no clear effect |  |
| 365 | Second Blessing | 8 | Class | champion | Blessed Swiftness: PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 366 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 367 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 368 | Mineral Deposits | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 370 | Wings of Air | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 373 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 374 | Shadow Sight | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 375 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Bolstered Recovery | 16 | Class | — | Instant Recovery: healing | +0.01 ± 0.02 | −0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 377 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 378 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | +0.01 ± 0.03 | +0.00 | +0.01 | 1.4 | no clear effect |  |
| 379 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 380 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 381 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 382 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 383 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 384 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.01 ± 0.01 | +0.00 | +0.01 | 1.2 | no clear effect |  |
| 385 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 386 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 387 | Shadow's Web | 14 | Class | monk | innate spell: Shadow's Web (rank 7) | +0.01 ± 0.03 | +0.03 | −0.01 | 0.2 | no clear effect |  |
| 388 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 389 | Perfect Ki Expert | 10 | Class | — | innate spells: Unblinking Flame Aura (rank 5), Unbreaking Wave Vapor (rank 5), Unfolding Wind Buffet (rank 5), Untwisting Iron Roots (rank 5) | +0.01 ± 0.03 | +0.07 | −0.06 | 0.7 | no clear effect |  |
| 390 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 391 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Whirlwind Stance | 10 | Class | — | effect | +0.01 ± 0.04 | +0.04 | −0.03 | 2.0 | no clear effect |  |
| 393 | Breath of Hungry Death | 16 | Class | — | save | +0.01 ± 0.04 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 394 | The Harder They Fall (Kingmaker) | 8 | Class | ranger | bludgeoning damage on a successful Trip (always on) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 395 | Agonizing Rebuke | 5 | Ancestry | — | mental damage on a successful Demoralize (always on; once, not each turn) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 396 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 397 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 398 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 399 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.04 | +0.00 | +0.01 | 1.7 | no clear effect |  |
| 400 | Stasian Smash | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.07 | −0.06 | 3.3 | no clear effect |  |
| 401 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 402 | Driving Rain | 6 | Class | kineticist | save | +0.01 ± 0.09 | +0.08 | −0.07 | 4.1 | no clear effect |  |
| 403 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 404 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 405 | Dive of the Divine | 16 | Class | — | save (requirement assumed: You are at least 20 feet above the ground) | +0.00 ± 0.03 | −0.00 | +0.01 | 0.5 | no clear effect |  |
| 406 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 407 | Basic Death Dealing | 4 | Class | — | Deathly Scream: innate spell: Deathly Scream (rank 1) | +0.00 ± 0.04 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 408 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 409 | Raise Island | 8 | Class | exemplar | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 410 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 411 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 412 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 413 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 414 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 415 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.06 | −0.06 | 1.0 | no clear effect |  |
| 416 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 417 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.01 | +0.00 | +0.01 | 0.6 | no clear effect |  |
| 418 | Start the Festival! | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 419 | Call the Swarm | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 420 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 421 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.02 | −0.01 | +0.02 | 2.1 | no clear effect |  |
| 422 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.00 ± 0.06 | −0.02 | +0.02 | 1.0 | no clear effect |  |
| 424 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 425 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 426 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 427 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 429 | World-Breaking Footfall | 14 | Class | monk | save (requirement assumed: You are in Kaiju Stance and are touching the ground) | +0.00 ± 0.03 | +0.01 | −0.01 | 0.6 | no clear effect |  |
| 430 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 432 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 435 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 436 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 437 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 439 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 440 | Nimble Dodge | 1 | Class | rogue | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 441 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 442 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 443 | Zealous Inevitability | 6 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 2.3 | no clear effect |  |
| 444 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 445 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.05 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 446 | Brutal Bully | 6 | Class | barbarian | Strength damage on a successful maneuver (always on; raging not checked) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 447 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | +0.00 ± 0.05 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 448 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 449 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 451 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 454 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 456 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 457 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.07 | −0.07 | 1.1 | no clear effect |  |
| 458 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 459 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 460 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 461 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 462 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 463 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 464 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 465 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 466 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.02 | +0.00 | +0.00 | 3.6 | no clear effect |  |
| 467 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 468 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.02 | +0.02 | −0.02 | 0.8 | no clear effect |  |
| 470 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 471 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 472 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 475 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 482 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 484 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 486 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 487 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 488 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 489 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 492 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 493 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 494 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 496 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 497 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 499 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 500 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 501 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 503 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 504 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 505 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 506 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 507 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 508 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 509 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 510 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 511 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 512 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 513 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 514 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 515 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 516 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 517 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 518 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 519 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 520 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 521 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 522 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 523 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 524 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 525 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 526 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 527 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 528 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 529 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 530 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 531 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 532 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 533 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 535 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 536 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 537 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 539 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 540 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 541 | Anthemic Performance | 8 | Class | — | innate spell: Courageous Anthem (rank 4) | +0.00 ± 0.03 | −0.02 | +0.02 | 3.3 | no clear effect |  |
| 542 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 547 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 548 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 549 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 550 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 551 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 552 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 553 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 554 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 555 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 556 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 557 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 558 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 559 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 560 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 561 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 562 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 569 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 570 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 571 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 572 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 573 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 574 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 575 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 576 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 579 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 581 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 582 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 585 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 586 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 588 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 590 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 594 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 597 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 600 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 601 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 603 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 611 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 612 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 613 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 619 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 621 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 622 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 624 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 626 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 627 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 628 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 629 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 630 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 631 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 632 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 633 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 634 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 635 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 636 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 637 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 638 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 639 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 641 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 642 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 643 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 645 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 646 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 647 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 648 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 650 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 651 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 652 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 654 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 655 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 656 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 658 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 661 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 663 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 664 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 665 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 666 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 667 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 668 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 669 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 670 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 671 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 672 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 673 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 674 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 675 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 677 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 678 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 680 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 681 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 682 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 684 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 685 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 686 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 687 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 688 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 689 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 690 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 691 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 693 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 696 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 697 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 698 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 699 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 700 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 701 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 704 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.1 | no clear effect |  |
| 705 | Dazing Blow | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 706 | Wildborn Adept | 5 | Ancestry | — | innate spell: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 707 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.3 | no clear effect |  |
| 708 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 709 | Lore Seeker | 8 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Sound Mirror | 6 | Class | — | innate spell: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 713 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 715 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 717 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 718 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 719 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 721 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 722 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 725 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 726 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 727 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 728 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 729 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 730 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 731 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 733 | Three Clear Breaths | 6 | Class | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 734 | Advanced Hallowed Spell | 8 | Class | — | innate spell: Life Siphon (rank 4), Eradicate Undeath (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Uplifting Overture | 2 | Class | bard | innate spell: Uplifting Overture (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Song of Strength | 2 | Class | bard | innate spell: Song of Strength (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Basic Dogma | 4 | Class | — | Resilient Mind: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 738 | Basic Wilding | 4 | Class | — | Untamed Form: innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Manifold Modifications | 8 | Class | inventor | Harmonic Oscillator: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 740 | Basic Martial Magic | 4 | Class | — | Arcane Fists: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Blind-Fight | 8 | Class | fighter | concealed and hidden targets easier to hit, not off-guard to hidden foes (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Wind Caller | 8 | Class | druid | innate spell: Stormwind Flight (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Hedge Prison | 6 | Class | druid | innate spell: Hedge Prison (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 745 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 746 | Uncanny Dodge | 10 | Class | — | Deny Advantage: passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Replenishment of War | 10 | Class | cleric | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 751 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 752 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Speaking Sky | 12 | Class | — | innate spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 756 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 757 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 758 | Magical Adaptation | 10 | Class | — | innate spell: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 760 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spell: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Asura Magic | 9 | Ancestry | — | innate spell: Blood Vendetta (rank 2), Death Knell (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | Wind Jump | 10 | Class | monk | innate spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Horn and Bone Incantation | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Humanoid Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Spiritual Echo | 9 | Ancestry | — | innate spell: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Basic Concoction | 4 | Class | — | Poison Resistance: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 776 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 779 | Gaze of Veracity | 10 | Class | — | innate spell: Glimpse the Truth (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Soothing Ballad | 14 | Class | bard | innate spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Determined Lore Seeker | 12 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 789 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Wings of the Dragon | 12 | Class | — | innate spell: Dragon Wings (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 797 | Keep up the Good Fight | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 799 | Never! | 16 | Class | guardian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 800 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 801 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 802 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | Special Sentinel Technique | 4 | Class | — | innate spell: Luminous Stardust Healing (rank 2), Shining Starlight Attack (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 804 | Positive Luminance | 8 | Class | — | innate spell: Vital Luminance (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | Basic Glory | 4 | Class | — | Sanctified Soul: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Deathly Secrets | 6 | Class | — | innate spell: Eyes of the Dead (rank 3), Subjugate Undead (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | Water Nagaji | 1 | Ancestry | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 808 | Rites of Liberation | 14 | Class | — | innate spell: Unimpeded Stride (rank 1), Word of Freedom (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 810 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 811 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 812 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 813 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 814 | Basic Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 815 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 816 | Confident Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 819 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 820 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 821 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 822 | Spellstriker | 4 | Class | — | Spellstrike: spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 823 | Basic Shooting | 4 | Class | — | Hit the Dirt!: +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Target of Opportunity | 14 | Class | — | a ranged Strike (–2) when an ally's ranged Strike hits (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 826 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 827 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 828 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 829 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 830 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 832 | Hallowed Necromancer Dedication | 2 | Class | — | innate spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 834 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 836 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Eidolon's Trample | 16 | Class | summoner | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 839 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 840 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 841 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 842 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 843 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | Rogue Dedication | 2 | Class | — | Surprise Attack: foes that haven't acted are off-guard to it the first round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 845 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 846 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 847 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 848 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 849 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 851 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 852 | Projectile Snatching | 8 | Class | monk | Deflect Projectile, a deflected attack thrown back (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 853 | Keep Up the Good Fight | 14 | Class | guardian | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 855 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 857 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.8 | no clear effect | with a one-handed weapon and a free hand |
| 858 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 860 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | Avenger of Lust | 14 | Class | — | Sorshen's Devotion: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 865 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 866 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | Form of the Bat | 13 | Ancestry | — | casts Pest Form (rank 4, DC 32, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Conjurer's Countermeasure | 6 | Class | magus | innate spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 873 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Banner's Inspiration | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 878 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 879 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 880 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 885 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 886 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 887 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 888 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Cultivator Dedication | 2 | Class | — | innate spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 890 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 894 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Intercepting Hand | 12 | Class | — | Disarming Interception: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.9 | no clear effect |  |
| 903 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 905 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 909 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 913 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 914 | Rat Form | 9 | Ancestry | — | casts Pest Form (rank 1, DC 25) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 917 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 918 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 921 | Disciple of Shade | 6 | Class | — | innate spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 923 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Harmonize Self | 4 | Class | monk | innate spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 925 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Untamed Form | 1 | Class | druid | innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 929 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 930 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 931 | Disengaging Twist | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | True Senses | 17 | Ancestry | — | casts Truesight (rank 6, DC 37, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 934 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 935 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 936 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Finishing Precision | 4 | Class | — | Basic Finisher: Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 939 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 940 | Basic Trickery | 4 | Class | — | Nimble Dodge: +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 941 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 942 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 943 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Advantageous Assault | 6 | Class | fighter | a press Strike at a prone foe, + its weapon dice in damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 945 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 946 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 947 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 948 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 949 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 952 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 953 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 954 | Journey of the Sky Chariot | 10 | Class | exemplar | Race the Skies: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 956 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 957 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 960 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 964 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 965 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 968 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 970 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 971 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 973 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 977 | Swing the Censer | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Mystical Flare | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 979 | Wrapped In Smoke | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 980 | Flashing Shield | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Aggressive Block | 2 | Class | fighter | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 982 | Phase Out | 6 | Class | summoner | an Effect on an ally | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 983 | Shadow Spell | 8 | Class | — | an Effect on a foe | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | Shining Glory | 18 | Class | — | save (requirement assumed: Your nimbus is active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Echoes in Stone | 9 | Ancestry | — | effect (requirement assumed: You are standing on a stone or earthen surface) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 986 | Channel Elements | 0 | Action | kineticist | effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 987 | Invoke Offense | 4 | Class | — | effect (requirement assumed: You're under the effects of Enter Spirit Trance. You manifest a physical attack of the spirits all around you, such as the claw of an animal spirit or the whipping vine of a nature spirit) (in Enter Spirit Trance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Bite and Sting | 0 | Action | — | save (requirement assumed: Your swarm is outside your body) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 989 | Kineticist Dedication | 2 | Class | — | Channel Elements: effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 990 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 991 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 992 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 993 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 994 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 995 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | innate spell: Dragon Breath (rank 3) | −0.00 ± 0.05 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 996 | Shame the Sin | 5 | Ancestry | — | check | −0.00 ± 0.03 | −0.03 | +0.03 | 1.0 | no clear effect |  |
| 997 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 998 | Tragic Lament | 18 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 999 | Tectonic Stomp | 10 | Class | — | save | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 1000 | Dashing Strike | 12 | Class | fighter | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.7 | no clear effect |  |
| 1001 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1002 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.00 ± 0.04 | −0.02 | +0.02 | 4.4 | no clear effect |  |
| 1003 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.06 | +0.09 | −0.09 | 2.8 | no clear effect | with a one-handed weapon and a free hand |
| 1004 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.00 | 1.8 | no clear effect |  |
| 1005 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1006 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1007 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1008 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.03 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) (in Crane Stance) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1010 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1011 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1013 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1014 | Walk Through the Conflagration | 14 | Class | kineticist | save | −0.00 ± 0.04 | −0.00 | −0.00 | 0.4 | no clear effect |  |
| 1015 | Furious Finish | 2 | Class | barbarian | Strike activity | −0.00 ± 0.03 | −0.05 | +0.04 | 1.3 | no clear effect |  |
| 1016 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.05 | +0.12 | −0.13 | 2.4 | no clear effect |  |
| 1017 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1018 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1019 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1020 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | +0.00 | −0.01 | 2.5 | no clear effect |  |
| 1021 | Perfect Ki Exemplar | 14 | Class | — | innate spells: Unblinking Flame Emblem (rank 7), Unbreaking Wave Barrier (rank 7), Unfolding Wind Blitz (rank 7), Untwisting Iron Augmentation (rank 7) | −0.00 ± 0.03 | +0.00 | −0.01 | 0.7 | no clear effect |  |
| 1022 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 1023 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1024 | You're an Embarrassment! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1026 | Heroic Defiance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1027 | Kaiju Defense Oath | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1028 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Such a Disgrace! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1030 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1031 | Push Back the Dead! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1033 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Ardent Armiger | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1036 | Loose Cannon | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1037 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1038 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1039 | Fiery Rebirth | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1040 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1041 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1042 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Reactive Striker | 4 | Class | — | Reactive Strike | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1044 | Ride the Tsunami | 18 | Class | kineticist | save | −0.00 ± 0.07 | −0.24 | +0.23 | 2.7 | no clear effect |  |
| 1045 | Irresistible Bloom | 17 | Ancestry | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1046 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.05 | +0.08 | −0.09 | 1.1 | no clear effect |  |
| 1047 | Mana Detonation | 18 | Class | — | innate spell: Arcane Explosion (rank 9) | −0.00 ± 0.02 | +0.03 | −0.04 | 0.2 | no clear effect |  |
| 1048 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1049 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 1050 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a weapon and a shield |
| 1051 | Chronomancer's Secrets | 8 | Class | — | innate spell: Stasis (rank 4), Path of Least Resistance (rank 4) | −0.01 ± 0.06 | +0.19 | −0.20 | 1.0 | no clear effect |  |
| 1052 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.01 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 1053 | Punishing Shove | 1 | Class | guardian | damage on a successful Shove (always on) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1054 | As a Thousand Soldiers | 8 | Class | exemplar | save | −0.01 ± 0.07 | +0.05 | −0.06 | 1.0 | no clear effect |  |
| 1055 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | −0.01 ± 0.06 | +0.07 | −0.09 | 1.0 | no clear effect |  |
| 1056 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1057 | Bend Time | 0 | Action | — | check | −0.01 ± 0.02 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 1058 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1059 | Basic Witchcraft | 4 | Class | — | Witch's Armaments: PF2e rules (always on) | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1060 | Exsanguinate | 6 | Class | — | check | −0.01 ± 0.02 | +0.01 | −0.02 | 0.5 | no clear effect |  |
| 1061 | Bony Barrage | 4 | Class | — | innate spell: Bony Barrage (rank 2) | −0.01 ± 0.02 | −0.02 | +0.01 | 0.4 | no clear effect |  |
| 1062 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 1063 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 1064 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.02 | 4.2 | no clear effect |  |
| 1065 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1066 | Torrential Backlash | 10 | Class | — | save (requirement assumed: You are in a curse maelstrom state) | −0.01 ± 0.05 | +0.13 | −0.14 | 3.7 | no clear effect |  |
| 1067 | Calaca's Showstopper | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1068 | Masked Casting | 8 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | −0.00 | 3.2 | no clear effect |  |
| 1069 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1070 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | −0.01 ± 0.06 | +0.03 | −0.04 | 1.0 | no clear effect |  |
| 1071 | Tactical Debilitations | 10 | Class | rogue | Debilitating Strike's no reactions in place of enfeebled 1 | −0.01 ± 0.02 | −0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1072 | Cautious Word | 12 | Class | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 1073 | Convocation of Earth and Moon | 17 | Ancestry | — | save | −0.01 ± 0.04 | +0.04 | −0.06 | 1.0 | no clear effect |  |
| 1074 | Exacting Strike | 1 | Class | fighter | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 1075 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.05 | −0.06 | +0.05 | 1.0 | no clear effect |  |
| 1076 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | −0.01 ± 0.06 | +0.11 | −0.13 | 1.0 | no clear effect |  |
| 1077 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1078 | Monk Dedication | 2 | Class | — | Powerful Fist: PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1079 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.09 | −0.05 | +0.03 | 4.2 | no clear effect |  |
| 1080 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.01 ± 0.04 | −0.02 | −0.00 | 0.7 | no clear effect |  |
| 1081 | For My House! | 0 | Action | — | self effect | −0.01 ± 0.02 | −0.01 | −0.02 | 1.6 | no clear effect |  |
| 1082 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.01 ± 0.04 | −0.07 | +0.05 | 0.9 | no clear effect |  |
| 1083 | Unleash the Blight | 10 | Class | — | save | −0.01 ± 0.02 | −0.02 | −0.00 | 0.5 | no clear effect |  |
| 1084 | Death Drone | 0 | Action | — | save | −0.01 ± 0.05 | +0.02 | −0.04 | 1.4 | no clear effect |  |
| 1085 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.01 ± 0.04 | −0.00 | −0.02 | 6.8 | no clear effect |  |
| 1086 | Defiant Banner | 8 | Class | commander | effect | −0.01 ± 0.07 | −0.20 | +0.18 | 10.7 | no clear effect |  |
| 1087 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1088 | Basic Muse's Whispers | 4 | Class | — | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | −0.01 ± 0.05 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1089 | Dread Mosquito Storm | 18 | Class | — | innate spell: Dread Mosquito Storm (rank 9) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.5 | no clear effect |  |
| 1090 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | −0.01 ± 0.04 | −0.03 | +0.00 | 1.0 | no clear effect |  |
| 1091 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.01 ± 0.03 | −0.00 | −0.02 | 2.0 | no clear effect |  |
| 1092 | Basic Flair | 4 | Class | — | Unbalancing Finisher: Strike activity | −0.01 ± 0.03 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1093 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | −0.01 ± 0.03 | −0.05 | +0.03 | 0.6 | no clear effect |  |
| 1094 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Deathly Scream | 2 | Class | — | innate spell: Deathly Scream (rank 1) | −0.01 ± 0.03 | +0.02 | −0.04 | 1.0 | no clear effect |  |
| 1096 | Felling Strike | 8 | Class | fighter | Strike activity | −0.01 ± 0.06 | −0.03 | +0.01 | 5.9 | no clear effect |  |
| 1097 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | −0.01 ± 0.01 | −0.03 | +0.00 | 1.9 | no clear effect |  |
| 1098 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1099 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1100 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1101 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1102 | Hellbreaker Strike | 0 | Action | — | Strike activity | −0.01 ± 0.04 | +0.02 | −0.05 | 1.8 | no clear effect |  |
| 1103 | Pennant of Victory | 20 | Class | commander | effect | −0.01 ± 0.10 | −0.46 | +0.43 | 2.0 | no clear effect |  |
| 1104 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1105 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.01 ± 0.03 | −0.01 | −0.02 | 2.8 | no clear effect |  |
| 1106 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | −0.01 ± 0.06 | +0.03 | −0.05 | 4.1 | no clear effect |  |
| 1107 | Emit Defensive Odor | 1 | Ancestry | — | save | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1108 | Guide the Timeline | 6 | Class | — | effect | −0.01 ± 0.03 | −0.01 | −0.02 | 2.0 | no clear effect |  |
| 1109 | Pouncing Transformation | 12 | Class | — | check | −0.02 ± 0.06 | +0.13 | −0.16 | 5.5 | no clear effect |  |
| 1110 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1111 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.02 ± 0.05 | +0.09 | −0.12 | 3.5 | no clear effect |  |
| 1112 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.02 ± 0.03 | +0.04 | −0.07 | 4.7 | no clear effect |  |
| 1113 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.02 ± 0.02 | −0.01 | −0.02 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1114 | Coordinated Charge | 12 | Class | — | Strike activity | −0.02 ± 0.03 | +0.01 | −0.04 | 1.7 | no clear effect |  |
| 1115 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | −0.02 ± 0.03 | +0.01 | −0.04 | 0.2 | no clear effect |  |
| 1116 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.02 ± 0.04 | +0.00 | −0.04 | 1.8 | no clear effect |  |
| 1117 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1118 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.02 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1119 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | −0.02 ± 0.04 | −0.06 | +0.02 | 1.0 | no clear effect |  |
| 1120 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.02 ± 0.05 | −0.03 | −0.00 | 1.0 | no clear effect |  |
| 1121 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.8 | no clear effect |  |
| 1122 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.02 ± 0.02 | −0.01 | −0.02 | 3.1 | no clear effect |  |
| 1123 | Fungal Exhalation | 6 | Class | druid | innate spell: Fungal Exhalation (rank 3) | −0.02 ± 0.03 | −0.05 | +0.01 | 0.5 | no clear effect |  |
| 1124 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1125 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.7 | no clear effect |  |
| 1126 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.7 | no clear effect |  |
| 1127 | Harrying Strike | 10 | Class | — | Strike activity | −0.02 ± 0.01 | −0.03 | −0.01 | 7.0 | no clear effect |  |
| 1128 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1129 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.06 | 5.2 | no clear effect |  |
| 1130 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1131 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.06 | −0.07 | +0.03 | 2.3 | no clear effect |  |
| 1132 | Extraplanar Haze | 5 | Ancestry | — | check | −0.02 ± 0.03 | +0.00 | −0.04 | 1.0 | no clear effect |  |
| 1133 | Nanite Shroud | 5 | Ancestry | — | check | −0.02 ± 0.03 | +0.00 | −0.04 | 1.0 | no clear effect |  |
| 1134 | Sawtooth Grapple | 8 | Class | rogue | 2 Strikes (requirement assumed: You're wielding two weapons, at least one of which is a sawtooth saber) | −0.02 ± 0.02 | +0.00 | −0.04 | 3.2 | no clear effect |  |
| 1135 | Follow-Up Assault | 8 | Class | barbarian | after a missed melee Strike, raging: a Strike +1 with its weapon dice in damage | −0.02 ± 0.02 | −0.02 | −0.02 | 5.2 | no clear effect |  |
| 1136 | Bristle | 5 | Ancestry | — | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 3.2 | no clear effect |  |
| 1137 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1138 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1139 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1140 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1141 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | −0.02 ± 0.02 | −0.04 | −0.01 | 0.3 | no clear effect |  |
| 1142 | Basic Thoughtform | 4 | Class | — | Psi Burst: save | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1143 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | −0.02 ± 0.03 | −0.01 | −0.03 | 0.8 | no clear effect |  |
| 1144 | Blessing of the Five | 0 | Bonus | — | casts Heal (rank 1, DC 17, 1/fight) | −0.02 ± 0.03 | −0.04 | −0.00 | 0.7 | no clear effect |  |
| 1145 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1146 | Aegis for the Innocent | 14 | Class | — | save (requirement assumed: Your nimbus is active) | −0.02 ± 0.02 | −0.02 | −0.03 | 0.5 | no clear effect |  |
| 1147 | Brandish Authority | 18 | Class | — | check | −0.02 ± 0.07 | −0.01 | −0.04 | 3.0 | no clear effect |  |
| 1148 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.02 ± 0.02 | +0.00 | −0.05 | 1.0 | no clear effect |  |
| 1149 | Broken Chain Dedication | 12 | Class | — | Ultimatum of Liberation: save | −0.02 ± 0.05 | +0.06 | −0.11 | 0.0 | no clear effect | the AI never used it |
| 1150 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.02 ± 0.05 | −0.01 | −0.03 | 3.0 | no clear effect | with a spear and a free hand |
| 1151 | History of Violence | 14 | Class | — | Strike activity | −0.02 ± 0.06 | +0.03 | −0.08 | 1.0 | no clear effect |  |
| 1152 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.02 ± 0.06 | −0.13 | +0.08 | 3.1 | no clear effect |  |
| 1153 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | −0.03 ± 0.06 | −0.01 | −0.04 | 1.0 | no clear effect |  |
| 1154 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.03 ± 0.04 | −0.02 | −0.03 | 1.0 | no clear effect |  |
| 1155 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1156 | Fling Magic | 0 | Action | thaumaturge | save | −0.03 ± 0.05 | −0.03 | −0.02 | 2.4 | no clear effect |  |
| 1157 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.03 ± 0.03 | −0.02 | −0.03 | 1.5 | no clear effect |  |
| 1158 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.03 ± 0.04 | +0.05 | −0.11 | 1.8 | no clear effect |  |
| 1159 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.03 ± 0.06 | −0.11 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1160 | Glory and Valor! | 9 | Ancestry | — | heals 4 (touch, 1/fight) | −0.03 ± 0.02 | −0.04 | −0.01 | 0.7 | no clear effect |  |
| 1161 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.03 ± 0.02 | +0.01 | −0.06 | 0.2 | no clear effect |  |
| 1162 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.03 ± 0.04 | +0.10 | −0.16 | 1.0 | no clear effect |  |
| 1163 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | −0.03 ± 0.02 | +0.02 | −0.07 | 0.6 | no clear effect |  |
| 1164 | Toppling Transformation | 6 | Class | druid | check | −0.03 ± 0.02 | −0.06 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.03 ± 0.03 | −0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1166 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | −0.03 ± 0.04 | −0.05 | −0.01 | 1.0 | no clear effect |  |
| 1167 | Frighten Undead | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1168 | Crossbow Terror | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1169 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.03 ± 0.03 | −0.03 | −0.03 | 0.8 | no clear effect |  |
| 1170 | Voice Cold as Death | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.05 | 3.2 | no clear effect |  |
| 1171 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.03 ± 0.02 | −0.01 | −0.05 | 0.3 | no clear effect |  |
| 1172 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.03 ± 0.02 | −0.01 | −0.05 | 0.3 | no clear effect |  |
| 1173 | Invoke Disaster | 18 | Class | druid | innate spell: Storm Lord (rank 9) | −0.03 ± 0.02 | −0.05 | −0.01 | 0.3 | no clear effect |  |
| 1174 | Unnerving Terror | 13 | Ancestry | — | save (requirement assumed: You're in yaoguai form) | −0.03 ± 0.04 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 1175 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | −0.03 ± 0.03 | −0.01 | −0.06 | 0.5 | no clear effect |  |
| 1176 | Essence Overflow | 6 | Class | — | save (requirement assumed: You are Channeling Draconic Essence) | −0.03 ± 0.03 | −0.07 | +0.01 | 0.9 | no clear effect |  |
| 1177 | Steal Time | 10 | Class | — | save | −0.03 ± 0.05 | +0.05 | −0.12 | 1.0 | no clear effect |  |
| 1178 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.05 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 1179 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | −0.03 ± 0.03 | −0.10 | +0.04 | 0.8 | no clear effect |  |
| 1180 | Roiling Mudslide | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.07 | 1.4 | no clear effect |  |
| 1181 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.03 ± 0.03 | −0.11 | +0.04 | 0.8 | no clear effect |  |
| 1182 | Hit and Run | 6 | Class | — | Strike activity | −0.03 ± 0.03 | +0.01 | −0.07 | 1.6 | no clear effect |  |
| 1183 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | −0.03 ± 0.02 | −0.02 | −0.05 | 0.6 | no clear effect |  |
| 1184 | Cleansing Light | 17 | Ancestry | — | check | −0.04 ± 0.05 | −0.02 | −0.05 | 1.0 | no clear effect |  |
| 1185 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.00 | −0.07 | 1.5 | no clear effect |  |
| 1186 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | −0.04 ± 0.05 | −0.15 | +0.08 | 1.0 | no clear effect |  |
| 1187 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.04 ± 0.04 | −0.08 | +0.00 | 3.0 | no clear effect |  |
| 1188 | Primadonna | 12 | Class | — | check | −0.04 ± 0.04 | −0.06 | −0.01 | 0.3 | no clear effect |  |
| 1189 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | −0.04 ± 0.03 | −0.08 | +0.01 | 0.9 | no clear effect |  |
| 1190 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.04 ± 0.02 | −0.04 | −0.04 | 1.5 | no clear effect |  |
| 1191 | Banner Twirl | 4 | Class | commander | check | −0.04 ± 0.09 | +0.12 | −0.20 | 3.1 | no clear effect |  |
| 1192 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.04 ± 0.05 | +0.09 | −0.16 | 1.0 | no clear effect |  |
| 1193 | Wither Away | 16 | Class | — | save | −0.04 ± 0.06 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 1194 | Solidarity | 9 | Ancestry | — | heals 18 (touch, 1/fight) | −0.04 ± 0.03 | −0.06 | −0.02 | 0.7 | no clear effect |  |
| 1195 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | −0.04 ± 0.04 | −0.00 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1196 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1197 | Edifying Trace | 8 | Class | — | an Effect on a foe | −0.04 ± 0.07 | +0.00 | −0.08 | 6.0 | no clear effect |  |
| 1198 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.04 ± 0.04 | −0.01 | −0.07 | 3.7 | no clear effect |  |
| 1199 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | −0.04 ± 0.02 | −0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1200 | Winter's Clutch | 1 | Class | kineticist | save | −0.04 ± 0.06 | −0.10 | +0.02 | 2.4 | no clear effect |  |
| 1201 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.03 | −0.03 | −0.05 | 2.0 | no clear effect |  |
| 1202 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.04 ± 0.02 | −0.05 | −0.03 | 0.3 | no clear effect |  |
| 1203 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | −0.04 ± 0.05 | −0.09 | +0.01 | 2.0 | no clear effect |  |
| 1204 | Channel Smite | 4 | Class | cleric | a melee Strike with a 1-action harm on the hit (2 actions) | −0.04 ± 0.03 | −0.03 | −0.05 | 0.8 | no clear effect |  |
| 1205 | Siren Song | 9 | Ancestry | — | inline save: 60-foot emanation, will (DC 25, 1/fight) | −0.04 ± 0.01 | −0.07 | −0.01 | 0.2 | no clear effect |  |
| 1206 | Slip the Grasp | 9 | Ancestry | — | Strike activity (requirement assumed: You are Grabbed, Immobilized, or Restrained) | −0.04 ± 0.04 | −0.07 | −0.02 | 2.1 | no clear effect |  |
| 1207 | Gluttonous Feast | 0 | Action | — | save | −0.04 ± 0.04 | −0.07 | −0.01 | 1.0 | no clear effect |  |
| 1208 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.04 ± 0.05 | −0.04 | −0.05 | 2.3 | no clear effect |  |
| 1209 | Basic Arcana | 4 | Class | — | Reach Spell: reach copies of 9 spells | −0.04 ± 0.04 | −0.14 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1210 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | −0.04 ± 0.03 | −0.02 | −0.07 | 1.0 | no clear effect |  |
| 1211 | Basic Breakthrough | 4 | Class | — | Searing Restoration: heals 2d10 (touch) | −0.04 ± 0.07 | +0.01 | −0.09 | 3.3 | no clear effect |  |
| 1212 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.04 ± 0.06 | −0.05 | −0.03 | 8.2 | no clear effect |  |
| 1213 | Now You See Me | 14 | Class | — | check | −0.04 ± 0.06 | −0.02 | −0.07 | 2.4 | no clear effect |  |
| 1214 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1215 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1216 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1217 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.04 ± 0.07 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1218 | Bestial Snarling | 2 | Class | bard | check | −0.05 ± 0.04 | +0.01 | −0.10 | 5.3 | no clear effect |  |
| 1219 | Explode | 0 | Action | inventor | inline save: 5-foot emanation, reflex, 2d6 fire (DC 17) | −0.05 ± 0.04 | −0.03 | −0.06 | 1.2 | no clear effect |  |
| 1220 | Irradiate | 6 | Class | — | save | −0.05 ± 0.02 | −0.06 | −0.03 | 0.1 | no clear effect |  |
| 1221 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.05 ± 0.05 | +0.02 | −0.12 | 1.0 | no clear effect |  |
| 1222 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | −0.05 ± 0.06 | −0.09 | −0.00 | 1.0 | no clear effect |  |
| 1223 | Talmandor's Shout | 12 | Class | — | check | −0.05 ± 0.06 | −0.11 | +0.02 | 1.0 | no clear effect |  |
| 1224 | To Me! | 18 | Class | — | Strike activity | −0.05 ± 0.04 | +0.00 | −0.10 | 2.4 | no clear effect |  |
| 1225 | Shadowcaster Dedication | 2 | Class | — | innate spell: Dazzling Flash (rank 1), Cloak of Shadow (rank 1) | −0.05 ± 0.04 | −0.03 | −0.07 | 0.8 | no clear effect |  |
| 1226 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.05 ± 0.02 | +0.01 | −0.11 | 0.7 | no clear effect |  |
| 1227 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | −0.05 ± 0.04 | −0.09 | −0.01 | 1.6 | no clear effect |  |
| 1228 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.05 ± 0.09 | +0.18 | −0.28 | 4.9 | no clear effect |  |
| 1229 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.08 | −0.02 | 0.8 | no clear effect |  |
| 1230 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1231 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1232 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.05 ± 0.04 | −0.10 | +0.00 | 1.0 | no clear effect |  |
| 1233 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.05 ± 0.05 | +0.03 | −0.12 | 1.0 | no clear effect |  |
| 1234 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.05 ± 0.06 | −0.08 | −0.02 | 2.0 | no clear effect |  |
| 1235 | Gift of the Hoard | 10 | Class | — | innate spell: Dragon Breath (rank 3) | −0.05 ± 0.04 | +0.01 | −0.11 | 1.0 | no clear effect |  |
| 1236 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.05 ± 0.04 | −0.02 | −0.08 | 1.0 | no clear effect |  |
| 1237 | Grudging Compliment | 7 | Skill | — | check | −0.05 ± 0.03 | −0.08 | −0.02 | 2.2 | no clear effect |  |
| 1238 | Basic Fury | 4 | Class | — | Sudden Charge: Strike activity | −0.05 ± 0.04 | −0.13 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1239 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | −0.05 ± 0.04 | +0.03 | −0.13 | 0.0 | no clear effect | the AI never used it |
| 1240 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | +0.01 | −0.12 | 1.5 | no clear effect |  |
| 1241 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | −0.05 ± 0.08 | −0.13 | +0.02 | 1.0 | no clear effect |  |
| 1242 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.6 | hurts |  |
| 1243 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.05 ± 0.06 | +0.13 | −0.23 | 7.7 | no clear effect |  |
| 1244 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1245 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.05 ± 0.03 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1246 | Form of the Beloved Mother | 17 | Ancestry | — | innate spell: Animal Form (rank 5), Slither (rank 5) | −0.05 ± 0.03 | −0.02 | −0.09 | 0.7 | no clear effect |  |
| 1247 | Moldersoul | 1 | Ancestry | — | Decompose: inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.7 | hurts |  |
| 1248 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.08 | −0.02 | 1.6 | no clear effect |  |
| 1249 | Scout's Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.1 | hurts |  |
| 1250 | Ravenous Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1251 | Interpose | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1252 | Roaring Charge | 0 | Action | commander | save | −0.05 ± 0.05 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1253 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.06 ± 0.03 | −0.03 | −0.08 | 0.8 | no clear effect |  |
| 1254 | No Scar but This | 0 | Action | — | check | −0.06 ± 0.03 | −0.02 | −0.09 | 1.3 | no clear effect |  |
| 1255 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.13 | 2.0 | no clear effect |  |
| 1256 | Instinct Ability | 6 | Class | — | Sudden Charge: Strike activity | −0.06 ± 0.04 | −0.04 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1257 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | −0.06 ± 0.06 | +0.01 | −0.12 | 3.3 | no clear effect |  |
| 1258 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.06 ± 0.02 | −0.00 | −0.11 | 0.8 | hurts |  |
| 1259 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1260 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.06 ± 0.03 | −0.10 | −0.01 | 1.0 | no clear effect |  |
| 1261 | Storm Shroud | 8 | Class | — | check | −0.06 ± 0.06 | +0.04 | −0.16 | 1.0 | no clear effect |  |
| 1262 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.06 ± 0.05 | −0.08 | −0.04 | 1.0 | no clear effect |  |
| 1263 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | −0.06 ± 0.05 | −0.08 | −0.04 | 0.9 | no clear effect |  |
| 1264 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.06 ± 0.04 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1265 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.06 ± 0.02 | −0.07 | −0.05 | 0.3 | hurts |  |
| 1266 | Lantern Strobe | 0 | Action | — | save | −0.06 ± 0.03 | −0.12 | −0.01 | 0.6 | hurts |  |
| 1267 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.06 ± 0.04 | −0.02 | −0.10 | 2.1 | no clear effect |  |
| 1268 | Mammoth Charge | 6 | Class | — | Strike activity (requirement assumed: You are riding your megafauna companion) | −0.06 ± 0.03 | +0.00 | −0.13 | 1.7 | hurts |  |
| 1269 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | −0.06 ± 0.04 | −0.15 | +0.02 | 1.0 | no clear effect |  |
| 1270 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | −0.06 ± 0.07 | +0.00 | −0.13 | 1.0 | no clear effect |  |
| 1271 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | −0.07 ± 0.07 | −0.18 | +0.05 | 1.0 | no clear effect | with a weapon and a shield |
| 1272 | Impaling Finisher | 4 | Class | swashbuckler | Strike activity | −0.07 ± 0.04 | −0.12 | −0.01 | 2.2 | no clear effect |  |
| 1273 | Radiant Burst | 13 | Ancestry | — | save | −0.07 ± 0.04 | −0.11 | −0.02 | 1.0 | no clear effect |  |
| 1274 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.07 ± 0.07 | −0.04 | −0.09 | 1.0 | no clear effect |  |
| 1275 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.07 ± 0.05 | −0.10 | −0.03 | 1.0 | no clear effect |  |
| 1276 | Taste Blood | 5 | Ancestry | — | save | −0.07 ± 0.03 | −0.05 | −0.08 | 2.6 | hurts |  |
| 1277 | Cadence Call | 6 | Class | — | check | −0.07 ± 0.04 | −0.13 | −0.01 | 1.0 | no clear effect |  |
| 1278 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.07 ± 0.05 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1279 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.07 ± 0.03 | −0.09 | −0.05 | 1.0 | hurts |  |
| 1280 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.07 ± 0.04 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1281 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.07 ± 0.06 | +0.19 | −0.32 | 5.1 | no clear effect |  |
| 1282 | Decree of Execution | 18 | Class | — | save | −0.07 ± 0.03 | +0.00 | −0.14 | 1.0 | hurts |  |
| 1283 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1284 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1285 | Flash of Omnipresence | 14 | Class | — | save | −0.07 ± 0.06 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1286 | Sapping Symbol | 12 | Class | cleric | check | −0.07 ± 0.05 | −0.00 | −0.14 | 2.9 | no clear effect |  |
| 1287 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.07 ± 0.04 | −0.09 | −0.04 | 3.3 | no clear effect |  |
| 1288 | Campfire Chronicler Dedication | 2 | Class | — | Offer Story: effect | −0.07 ± 0.05 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1289 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.07 ± 0.06 | −0.10 | −0.04 | 1.0 | no clear effect |  |
| 1290 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.07 ± 0.05 | −0.06 | −0.07 | 2.0 | no clear effect | with a one-handed weapon and a free hand |
| 1291 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.07 ± 0.04 | −0.08 | −0.06 | 1.0 | no clear effect |  |
| 1292 | Soothing Pulse | 4 | Class | — | Administer Ambient Magic: check | −0.07 ± 0.04 | −0.11 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1293 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.07 ± 0.04 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1294 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.07 ± 0.05 | −0.05 | −0.09 | 1.7 | no clear effect |  |
| 1295 | Disciple's Breath | 16 | Class | — | save | −0.07 ± 0.05 | −0.11 | −0.03 | 2.4 | no clear effect |  |
| 1296 | Puncture Flesh | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1297 | Grapple | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1298 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.07 ± 0.03 | −0.00 | −0.14 | 2.2 | hurts |  |
| 1299 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.07 ± 0.09 | −0.05 | −0.09 | 1.0 | no clear effect |  |
| 1300 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1301 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1302 | Waking Dream | 8 | Class | — | innate spell: Waking Dream (rank 4) | −0.07 ± 0.06 | +0.01 | −0.16 | 1.0 | no clear effect |  |
| 1303 | Flash Your Badge | 10 | Class | — | check | −0.07 ± 0.06 | +0.02 | −0.17 | 2.8 | no clear effect |  |
| 1304 | Greater Deathly Secrets | 10 | Class | — | innate spells: Malignant Sustenance (rank 4), Grasping Grave (rank 5) | −0.07 ± 0.05 | −0.12 | −0.03 | 1.6 | no clear effect |  |
| 1305 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.07 ± 0.04 | −0.05 | −0.09 | 2.0 | no clear effect |  |
| 1306 | Xidao Sea Mine Drop | 6 | Class | inventor | save | −0.07 ± 0.09 | −0.05 | −0.10 | 4.1 | no clear effect |  |
| 1307 | Invoke the Crimson Oath | 8 | Class | — | innate spell: Invoke the Crimson Oath (rank 2) | −0.07 ± 0.04 | −0.04 | −0.11 | 0.9 | no clear effect |  |
| 1308 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.07 ± 0.07 | −0.10 | −0.05 | 3.2 | no clear effect |  |
| 1309 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | −0.07 ± 0.03 | −0.12 | −0.03 | 1.3 | hurts |  |
| 1310 | Advanced Elemental Spell | 6 | Class | druid | innate spells: Combustion (rank 3), Stone Lance (rank 3), Powerful Inhalation (rank 3), Pulverizing Cascade (rank 3) | −0.07 ± 0.06 | −0.09 | −0.06 | 2.5 | no clear effect |  |
| 1311 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.07 ± 0.07 | −0.04 | −0.11 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 1312 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.08 ± 0.06 | −0.03 | −0.12 | 1.0 | no clear effect |  |
| 1313 | Meditate on This! | 14 | Class | barbarian | save | −0.08 ± 0.07 | −0.00 | −0.15 | 3.8 | no clear effect |  |
| 1314 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.08 ± 0.05 | −0.04 | −0.11 | 5.9 | no clear effect |  |
| 1315 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | −0.08 ± 0.04 | −0.10 | −0.06 | 0.3 | hurts |  |
| 1316 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.05 | −0.09 | −0.06 | 2.1 | no clear effect |  |
| 1317 | Tremor | 1 | Class | kineticist | save | −0.08 ± 0.04 | −0.11 | −0.05 | 2.2 | no clear effect |  |
| 1318 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | −0.08 ± 0.06 | −0.17 | +0.01 | 1.0 | no clear effect |  |
| 1319 | Unending Emptiness | 14 | Class | — | innate spell: Darklight (rank 7) | −0.08 ± 0.04 | −0.05 | −0.11 | 0.8 | hurts |  |
| 1320 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.08 ± 0.05 | −0.08 | −0.08 | 3.1 | no clear effect |  |
| 1321 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.08 ± 0.05 | −0.11 | −0.05 | 1.0 | no clear effect |  |
| 1322 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | −0.08 ± 0.05 | −0.10 | −0.06 | 1.0 | no clear effect |  |
| 1323 | Incredible Ricochet | 12 | Class | fighter | a ranged press Strike ignoring concealment and cover | −0.08 ± 0.05 | −0.12 | −0.03 | 8.3 | no clear effect | with a loaded arquebus |
| 1324 | Stonestrike Stance | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1325 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.08 ± 0.03 | −0.11 | −0.06 | 5.3 | hurts |  |
| 1326 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1327 | Fiendish Brand | 6 | Class | — | Strike activity | −0.08 ± 0.04 | −0.15 | −0.02 | 2.5 | hurts |  |
| 1328 | Warped Reflection | 1 | Ancestry | — | save | −0.08 ± 0.04 | −0.01 | −0.15 | 1.0 | hurts |  |
| 1329 | Idol Threat | 13 | Ancestry | — | check | −0.08 ± 0.04 | −0.09 | −0.08 | 3.9 | hurts |  |
| 1330 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | −0.08 ± 0.04 | −0.15 | −0.01 | 2.2 | hurts |  |
| 1331 | Multitalented | 9 | Ancestry | — | Barbarian Dedication: Rage (+2 damage with its Greatsword) | −0.08 ± 0.05 | −0.15 | −0.01 | 1.0 | no clear effect |  |
| 1332 | Devoted Guardian | 2 | Class | champion | an Effect on an ally | −0.08 ± 0.04 | −0.12 | −0.05 | 5.0 | no clear effect |  |
| 1333 | Ultimatum of Liberation | 0 | Action | — | save | −0.08 ± 0.04 | −0.03 | −0.13 | 1.0 | hurts |  |
| 1334 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.08 ± 0.05 | −0.03 | −0.13 | 2.0 | no clear effect |  |
| 1335 | Seven-Colored Cosmic Bridge | 18 | Class | exemplar | Fleeting Arc through Heaven and Earth: inline save: 60-foot cone, fortitude, 9d6 spirit (DC 38) | −0.08 ± 0.04 | −0.07 | −0.10 | 1.3 | hurts |  |
| 1336 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.09 ± 0.04 | −0.09 | −0.08 | 2.0 | no clear effect |  |
| 1337 | Feast | 4 | Class | — | check | −0.09 ± 0.03 | −0.13 | −0.04 | 1.8 | hurts |  |
| 1338 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.09 ± 0.04 | −0.12 | −0.05 | 1.0 | no clear effect |  |
| 1339 | Lead by Example | 8 | Class | — | Strike activity | −0.09 ± 0.04 | −0.04 | −0.13 | 6.8 | hurts |  |
| 1340 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.09 ± 0.07 | +0.12 | −0.29 | 1.0 | no clear effect |  |
| 1341 | Storming Gaze | 5 | Ancestry | — | inline save: 15-foot cone, reflex, 3d4 fire (DC 21) | −0.09 ± 0.03 | −0.12 | −0.05 | 1.6 | hurts |  |
| 1342 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.09 ± 0.04 | −0.07 | −0.11 | 2.7 | hurts |  |
| 1343 | Hail of Splinters | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.11 | −0.07 | 0.5 | hurts |  |
| 1344 | Enervating Wail | 6 | Class | — | save | −0.09 ± 0.03 | −0.13 | −0.04 | 1.0 | hurts |  |
| 1345 | Fade Into Daydreams | 0 | Action | psychic | check | −0.09 ± 0.04 | −0.16 | −0.01 | 1.9 | hurts |  |
| 1346 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.09 ± 0.05 | −0.06 | −0.12 | 1.0 | no clear effect |  |
| 1347 | Evangelize | 7 | Skill | — | check | −0.09 ± 0.03 | −0.06 | −0.12 | 2.1 | hurts |  |
| 1348 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.09 ± 0.04 | −0.11 | −0.06 | 1.0 | hurts |  |
| 1349 | Threatening Pursuit | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1350 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | −0.09 ± 0.10 | −0.09 | −0.09 | 1.0 | no clear effect |  |
| 1351 | Daring Act | 6 | Class | — | check | −0.09 ± 0.04 | −0.07 | −0.11 | 2.4 | hurts |  |
| 1352 | Targeting Shot | 14 | Class | ranger | a ranged press Strike ignoring concealment and cover | −0.09 ± 0.07 | +0.00 | −0.18 | 13.2 | no clear effect |  |
| 1353 | Restorative Strike | 4 | Class | cleric | Strike activity (requirement assumed: You have a Harm or Heal spell you can cast) | −0.09 ± 0.04 | −0.10 | −0.09 | 1.4 | hurts |  |
| 1354 | Starlit Sentinel Dedication | 2 | Class | — | Starlit Transformation: PF2e's self Effect | −0.09 ± 0.04 | +0.04 | −0.22 | 0.0 | hurts | the AI never used it |
| 1355 | Tidal Hands | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.13 | −0.05 | 0.8 | hurts |  |
| 1356 | Topple Foe | 10 | Class | — | check | −0.09 ± 0.04 | −0.01 | −0.18 | 4.6 | hurts |  |
| 1357 | Kneecap | 5 | Ancestry | — | Strike activity | −0.09 ± 0.02 | −0.08 | −0.11 | 5.8 | hurts |  |
| 1358 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spell: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1359 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1360 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | −0.09 ± 0.03 | −0.15 | −0.03 | 0.7 | hurts |  |
| 1361 | Rivethun Invoker Dedication | 2 | Class | — | Enter Spirit Trance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 0.0 | hurts | the AI never used it |
| 1362 | Herald's Strike | 20 | Class | — | save | −0.09 ± 0.07 | +0.08 | −0.27 | 3.3 | no clear effect |  |
| 1363 | Swimming Charge | 5 | Ancestry | — | check (requirement assumed: You are swimming in water) | −0.09 ± 0.03 | −0.13 | −0.06 | 2.3 | hurts |  |
| 1364 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1365 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1366 | Offer Story | 0 | Action | — | effect | −0.09 ± 0.05 | −0.09 | −0.10 | 4.2 | no clear effect |  |
| 1367 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1368 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1369 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1370 | Belly Flop | 10 | Class | guardian | Strike activity | −0.09 ± 0.05 | −0.17 | −0.02 | 10.4 | hurts |  |
| 1371 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.10 ± 0.06 | +0.05 | −0.24 | 1.0 | no clear effect |  |
| 1372 | Avenger of Gluttony | 14 | Class | — | Gluttonous Feast: save | −0.10 ± 0.05 | −0.15 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1373 | Uncanny Prediction | 8 | Class | — | save (requirement assumed: You're benefiting from the bonuses of Size Up. You have an eerie ability to guess the next move of creatures you've Sized Up) | −0.10 ± 0.06 | +0.19 | −0.39 | 2.8 | no clear effect |  |
| 1374 | Mind Shards | 6 | Class | — | save | −0.10 ± 0.03 | −0.11 | −0.08 | 0.9 | hurts |  |
| 1375 | Wait For It... | 0 | Action | commander | an Effect on an ally | −0.10 ± 0.06 | −0.11 | −0.09 | 5.0 | no clear effect |  |
| 1376 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.10 ± 0.04 | −0.14 | −0.05 | 1.0 | hurts |  |
| 1377 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1378 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1379 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1380 | Compliant Gold | 12 | Class | exemplar | Topple the Pillar of Heaven: inline save: 60-foot line, reflex, 6d8 untyped (DC 31) | −0.10 ± 0.06 | −0.08 | −0.12 | 3.6 | no clear effect |  |
| 1381 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.10 ± 0.06 | −0.13 | −0.07 | 1.0 | no clear effect |  |
| 1382 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.10 ± 0.04 | +0.00 | −0.20 | 3.3 | hurts |  |
| 1383 | Frightening Power | 12 | Class | — | save | −0.10 ± 0.07 | −0.34 | +0.14 | 11.7 | no clear effect |  |
| 1384 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.10 ± 0.03 | −0.11 | −0.09 | 1.0 | hurts |  |
| 1385 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.10 ± 0.04 | −0.07 | −0.13 | 2.0 | hurts |  |
| 1386 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | −0.10 ± 0.05 | −0.03 | −0.17 | 2.0 | no clear effect |  |
| 1387 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.10 ± 0.04 | −0.09 | −0.11 | 2.8 | hurts |  |
| 1388 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.10 ± 0.04 | −0.18 | −0.02 | 1.0 | hurts |  |
| 1389 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.05 | −0.16 | −0.04 | 1.0 | hurts |  |
| 1390 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.04 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1391 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.10 ± 0.06 | −0.05 | −0.16 | 4.5 | no clear effect |  |
| 1392 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | −0.10 ± 0.03 | −0.16 | −0.05 | 0.3 | hurts |  |
| 1393 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.10 ± 0.03 | −0.10 | −0.11 | 1.3 | hurts |  |
| 1394 | Jotun's Grasp | 5 | Ancestry | — | check | −0.10 ± 0.03 | −0.16 | −0.05 | 2.1 | hurts |  |
| 1395 | Manifold Conduit | 12 | Class | — | innate spell: Entreat the Many (rank 6) | −0.10 ± 0.06 | −0.22 | +0.01 | 1.0 | no clear effect |  |
| 1396 | Doom of Sailors | 17 | Ancestry | — | save | −0.11 ± 0.05 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1397 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.11 ± 0.03 | −0.02 | −0.19 | 1.0 | hurts |  |
| 1398 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.11 ± 0.03 | −0.02 | −0.19 | 1.0 | hurts |  |
| 1399 | Sovereign's Blade | 18 | Class | — | an Effect on an ally | −0.11 ± 0.06 | −0.14 | −0.07 | 6.0 | no clear effect |  |
| 1400 | Wyldsinger | 4 | Class | — | innate spell: Menacing Lament (rank 2), Valiant Anthem (rank 2) | −0.11 ± 0.04 | −0.12 | −0.09 | 1.0 | hurts |  |
| 1401 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.11 ± 0.06 | −0.08 | −0.13 | 1.0 | no clear effect |  |
| 1402 | Worm's Feast | 6 | Class | — | save | −0.11 ± 0.05 | −0.15 | −0.06 | 1.0 | hurts |  |
| 1403 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.11 ± 0.07 | −0.15 | −0.06 | 4.3 | no clear effect | with two weapons (longsword and shortsword) |
| 1404 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.11 ± 0.10 | +0.02 | −0.24 | 11.0 | no clear effect |  |
| 1405 | Boulder Roll | 5 | Ancestry | — | save | −0.11 ± 0.03 | −0.15 | −0.07 | 2.3 | hurts |  |
| 1406 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.11 ± 0.06 | −0.14 | −0.08 | 1.0 | no clear effect |  |
| 1407 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | −0.11 ± 0.04 | −0.02 | −0.20 | 2.1 | hurts |  |
| 1408 | Eternity-Incinerating Blaze | 18 | Class | exemplar | Burn out of Time: heals 5d8 (touch) | −0.11 ± 0.04 | −0.13 | −0.09 | 1.8 | hurts |  |
| 1409 | Demoralize | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1410 | Haunting Visage | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1411 | Terrifying Croak | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1412 | Sudden Terror | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1413 | Conductive Sphere | 8 | Class | kineticist | save | −0.11 ± 0.09 | −0.17 | −0.05 | 5.5 | no clear effect |  |
| 1414 | Hypnotic Lure | 5 | Ancestry | — | inline save: 1 creature, 30 feet, will (DC 21, 1/fight) | −0.11 ± 0.03 | −0.16 | −0.06 | 1.2 | hurts |  |
| 1415 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.05 | −0.07 | −0.15 | 2.2 | hurts |  |
| 1416 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | −0.11 ± 0.05 | −0.08 | −0.14 | 1.0 | hurts |  |
| 1417 | Aerial Boomerang | 1 | Class | kineticist | save | −0.11 ± 0.05 | −0.18 | −0.05 | 2.2 | hurts |  |
| 1418 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.06 | −0.13 | −0.10 | 1.0 | no clear effect |  |
| 1419 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.11 ± 0.05 | −0.11 | −0.12 | 2.1 | hurts |  |
| 1420 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1421 | Waters of Creation | 10 | Class | oracle | check | −0.11 ± 0.06 | −0.14 | −0.09 | 2.3 | no clear effect |  |
| 1422 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.11 ± 0.06 | −0.27 | +0.05 | 2.0 | no clear effect |  |
| 1423 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.11 ± 0.06 | +0.01 | −0.23 | 3.9 | no clear effect |  |
| 1424 | Hush | 14 | Class | — | save (requirement assumed: You are veiled) | −0.11 ± 0.06 | +0.04 | −0.27 | 3.5 | no clear effect |  |
| 1425 | Basic Hunter's Trick | 4 | Class | — | Hunter's Aim: Strike activity | −0.11 ± 0.08 | −0.08 | −0.14 | 0.0 | no clear effect | the AI never used it |
| 1426 | Triple Time | 4 | Class | bard | innate spell: Triple Time (rank 2) | −0.11 ± 0.05 | −0.10 | −0.12 | 12.7 | hurts |  |
| 1427 | Tail Spin | 5 | Ancestry | — | check | −0.11 ± 0.03 | −0.13 | −0.10 | 2.3 | hurts |  |
| 1428 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.12 ± 0.07 | −0.12 | −0.11 | 2.9 | no clear effect |  |
| 1429 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.5 | hurts |  |
| 1430 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.12 ± 0.05 | −0.07 | −0.16 | 1.0 | hurts |  |
| 1431 | Necrotic Bomber | 4 | Class | — | innate spell: Necrotic Bomb (rank 1) | −0.12 ± 0.04 | −0.10 | −0.13 | 1.0 | hurts |  |
| 1432 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.0 | hurts |  |
| 1433 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.12 ± 0.05 | −0.11 | −0.13 | 1.0 | hurts |  |
| 1434 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | −0.12 ± 0.07 | −0.01 | −0.23 | 7.6 | no clear effect |  |
| 1435 | Raise Symbol | 4 | Class | cleric | self effect | −0.12 ± 0.04 | −0.21 | −0.04 | 3.5 | hurts |  |
| 1436 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1437 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1438 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1439 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.12 ± 0.04 | −0.13 | −0.11 | 1.0 | hurts |  |
| 1440 | Webslinger | 13 | Ancestry | — | casts Web (rank 2, DC 32, 1/fight) | −0.12 ± 0.03 | −0.09 | −0.15 | 1.0 | hurts |  |
| 1441 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | −0.12 ± 0.05 | −0.00 | −0.24 | 3.3 | hurts |  |
| 1442 | Friendly Nudge | 1 | Ancestry | — | check | −0.12 ± 0.03 | −0.13 | −0.12 | 0.8 | hurts |  |
| 1443 | Celestial Cacophony | 12 | Class | inventor | save | −0.12 ± 0.07 | −0.09 | −0.15 | 1.4 | no clear effect |  |
| 1444 | Aether Beam | 8 | Class | — | save (requirement assumed: You are overflowing) | −0.13 ± 0.06 | −0.09 | −0.16 | 3.5 | hurts |  |
| 1445 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.13 ± 0.04 | −0.17 | −0.08 | 1.0 | hurts |  |
| 1446 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.13 ± 0.06 | −0.04 | −0.22 | 4.2 | hurts |  |
| 1447 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.13 ± 0.05 | −0.13 | −0.12 | 2.0 | hurts |  |
| 1448 | Bloom of Health | 14 | Class | — | an Effect on an ally | −0.13 ± 0.06 | −0.16 | −0.09 | 7.7 | hurts |  |
| 1449 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.04 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1450 | Alluring Performance | 9 | Ancestry | — | check | −0.13 ± 0.04 | −0.10 | −0.16 | 1.0 | hurts |  |
| 1451 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.13 ± 0.04 | −0.16 | −0.10 | 1.7 | hurts |  |
| 1452 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.13 ± 0.04 | −0.05 | −0.22 | 2.3 | hurts |  |
| 1453 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.13 ± 0.06 | −0.13 | −0.14 | 4.7 | hurts |  |
| 1454 | Tears of Pearl | 9 | Ancestry | — | save | −0.13 ± 0.05 | −0.07 | −0.19 | 1.0 | hurts |  |
| 1455 | Devastating Spellstrike | 4 | Class | magus | check | −0.13 ± 0.09 | −0.03 | −0.23 | 2.7 | no clear effect |  |
| 1456 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.13 ± 0.05 | −0.20 | −0.06 | 1.0 | hurts |  |
| 1457 | Part the Veil | 0 | Action | — | check | −0.13 ± 0.05 | −0.12 | −0.15 | 1.0 | hurts |  |
| 1458 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.13 ± 0.04 | −0.24 | −0.03 | 5.7 | hurts |  |
| 1459 | Burn out of Time | 0 | Action | — | heals 5d8 (touch) | −0.13 ± 0.03 | −0.12 | −0.15 | 0.8 | hurts |  |
| 1460 | Shove | 0 | Action | — | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.9 | hurts | with a one-handed weapon and a free hand |
| 1461 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.13 ± 0.07 | −0.03 | −0.24 | 4.2 | no clear effect |  |
| 1462 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.13 ± 0.05 | +0.02 | −0.29 | 0.0 | hurts | the AI never used it |
| 1463 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | −0.14 ± 0.04 | −0.21 | −0.06 | 1.0 | hurts |  |
| 1464 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.14 ± 0.05 | −0.07 | −0.20 | 2.8 | hurts |  |
| 1465 | Poisoner's Twist | 4 | Class | — | check | −0.14 ± 0.04 | −0.08 | −0.20 | 5.8 | hurts |  |
| 1466 | Flickering Twirl | 12 | Class | — | check | −0.14 ± 0.06 | −0.15 | −0.13 | 3.7 | hurts |  |
| 1467 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.14 ± 0.04 | −0.09 | −0.19 | 1.0 | hurts |  |
| 1468 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.14 ± 0.04 | −0.09 | −0.19 | 1.0 | hurts |  |
| 1469 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | −0.14 ± 0.06 | −0.00 | −0.27 | 1.0 | hurts |  |
| 1470 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1471 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1472 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1473 | Valkyrie's Charge | 0 | Action | commander | check | −0.14 ± 0.05 | −0.11 | −0.16 | 0.7 | hurts |  |
| 1474 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.14 ± 0.03 | −0.06 | −0.22 | 3.9 | hurts |  |
| 1475 | Dragonet Breath | 1 | Ancestry | — | save | −0.14 ± 0.03 | −0.23 | −0.05 | 0.7 | hurts |  |
| 1476 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.14 ± 0.06 | −0.14 | −0.14 | 4.0 | hurts |  |
| 1477 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.14 ± 0.04 | −0.22 | −0.07 | 1.5 | hurts |  |
| 1478 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.14 ± 0.04 | −0.19 | −0.10 | 1.0 | hurts |  |
| 1479 | Stridulating Song | 0 | Action | — | save | −0.14 ± 0.04 | −0.10 | −0.18 | 1.0 | hurts |  |
| 1480 | Perfect Ki Grandmaster | 18 | Class | — | innate spells: Unblinking Flame Ignition (rank 9), Unbreaking Wave Containment (rank 9), Unfolding Wind Crash (rank 9), Untwisting Iron Pillar (rank 9) | −0.14 ± 0.05 | −0.25 | −0.04 | 2.0 | hurts |  |
| 1481 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.14 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1482 | Edict of Mortality | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1483 | Majestic Proclamation | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1484 | Walk the Plank | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1485 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.14 ± 0.07 | −0.18 | −0.11 | 2.0 | hurts |  |
| 1486 | Pointed Question | 0 | Action | investigator | check | −0.14 ± 0.06 | −0.01 | −0.28 | 2.6 | hurts |  |
| 1487 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | −0.15 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1488 | Lightning Rod | 6 | Class | kineticist | check | −0.15 ± 0.09 | +0.02 | −0.31 | 4.3 | no clear effect |  |
| 1489 | Disturbing Knowledge | 7 | Skill | — | check | −0.15 ± 0.04 | −0.13 | −0.17 | 2.4 | hurts |  |
| 1490 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1491 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 0.8 | hurts |  |
| 1492 | Kobold Breath | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1493 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.15 ± 0.04 | −0.18 | −0.11 | 2.4 | hurts |  |
| 1494 | Fleet Tempo | 4 | Class | — | effect | −0.15 ± 0.05 | −0.14 | −0.15 | 2.0 | hurts |  |
| 1495 | Sleepwalker Dedication | 4 | Class | — | Daydream Trance: PF2e's self Effect | −0.15 ± 0.06 | −0.28 | −0.02 | 0.0 | hurts | the AI never used it |
| 1496 | Jinx | 0 | Action | — | save | −0.15 ± 0.04 | −0.09 | −0.20 | 1.0 | hurts |  |
| 1497 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.15 ± 0.04 | −0.14 | −0.16 | 0.8 | hurts |  |
| 1498 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.15 ± 0.04 | −0.07 | −0.23 | 2.7 | hurts |  |
| 1499 | Flinging Blow | 16 | Class | monk | Strike activity | −0.15 ± 0.10 | −0.00 | −0.30 | 6.3 | no clear effect |  |
| 1500 | Night's Glow | 6 | Class | — | innate spells: Moonbeam (rank 1), Zenith Star (rank 1) | −0.15 ± 0.05 | −0.17 | −0.14 | 1.0 | hurts |  |
| 1501 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1502 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1503 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1504 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1505 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.15 ± 0.05 | −0.26 | −0.04 | 1.0 | hurts |  |
| 1506 | Perfect Ki Adept | 6 | Class | — | innate spells: Unblinking Flame Revelation (rank 3), Unbreaking Wave Advance (rank 3), Unfolding Wind Rush (rank 3), Untwisting Iron Buffer (rank 3) | −0.15 ± 0.05 | −0.09 | −0.22 | 2.0 | hurts |  |
| 1507 | Chain of Words | 10 | Class | — | save | −0.15 ± 0.06 | −0.13 | −0.18 | 1.0 | hurts |  |
| 1508 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.02 | −0.29 | 1.0 | hurts |  |
| 1509 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1510 | Forceful Shot | 14 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 5.3 | hurts |  |
| 1511 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | −0.16 ± 0.05 | −0.15 | −0.16 | 2.7 | hurts |  |
| 1512 | Haft Striker Stance | 4 | Class | fighter | stance | −0.16 ± 0.06 | −0.30 | −0.02 | 1.2 | hurts |  |
| 1513 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1514 | Meteoric Spellstrike | 10 | Class | magus | check | −0.16 ± 0.07 | +0.03 | −0.35 | 3.7 | hurts | with a loaded arquebus |
| 1515 | Staggering Fire | 6 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 7.5 | hurts |  |
| 1516 | Claw Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.04 | −0.20 | −0.12 | 1.1 | hurts |  |
| 1517 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | −0.16 ± 0.04 | −0.20 | −0.12 | 1.0 | hurts |  |
| 1518 | Drag Down | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1519 | Steal for the Depths | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1520 | Pistol Twirl | 2 | Class | gunslinger | check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.8 | hurts |  |
| 1521 | Might of the Realm | 14 | Class | — | Strike activity | −0.16 ± 0.06 | −0.19 | −0.13 | 4.6 | hurts |  |
| 1522 | Pistol Phenom Dedication | 2 | Class | — | Pistol Twirl: check | −0.16 ± 0.03 | −0.14 | −0.18 | 0.0 | hurts | the AI never used it |
| 1523 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.16 ± 0.05 | −0.11 | −0.22 | 3.9 | hurts |  |
| 1524 | Talon Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.05 | −0.18 | −0.14 | 1.1 | hurts |  |
| 1525 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | −0.16 ± 0.06 | −0.14 | −0.18 | 2.1 | hurts |  |
| 1526 | Bone Swarm | 17 | Ancestry | — | save | −0.16 ± 0.05 | −0.29 | −0.04 | 1.0 | hurts |  |
| 1527 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.16 ± 0.05 | −0.17 | −0.16 | 1.0 | hurts |  |
| 1528 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.16 ± 0.07 | +0.06 | −0.39 | 2.7 | hurts |  |
| 1529 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.16 ± 0.06 | +0.03 | −0.36 | 3.3 | hurts |  |
| 1530 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.16 ± 0.04 | −0.04 | −0.29 | 0.0 | hurts | the AI never used it |
| 1531 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | −0.16 ± 0.11 | −0.21 | −0.12 | 1.0 | no clear effect |  |
| 1532 | Flower Street Infamy | 11 | Skill | — | check | −0.17 ± 0.04 | −0.05 | −0.28 | 3.7 | hurts |  |
| 1533 | Death of Hope | 17 | Ancestry | — | save | −0.17 ± 0.05 | −0.20 | −0.13 | 1.0 | hurts |  |
| 1534 | Venipuncture | 10 | Class | — | save | −0.17 ± 0.05 | −0.14 | −0.19 | 1.5 | hurts |  |
| 1535 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | −0.17 ± 0.06 | −0.09 | −0.24 | 20.5 | hurts |  |
| 1536 | Draconic Resilience | 4 | Class | — | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 6.0 | hurts |  |
| 1537 | Twin Parry | 4 | Class | fighter | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 2.8 | hurts |  |
| 1538 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1539 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.17 ± 0.04 | −0.14 | −0.20 | 1.0 | hurts |  |
| 1540 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | −0.17 ± 0.04 | −0.14 | −0.20 | 1.0 | hurts |  |
| 1541 | Ferocious Gust | 9 | Ancestry | — | save | −0.17 ± 0.04 | −0.17 | −0.17 | 1.0 | hurts |  |
| 1542 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.17 ± 0.04 | −0.27 | −0.07 | 2.9 | hurts |  |
| 1543 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.17 ± 0.06 | −0.15 | −0.19 | 1.7 | hurts |  |
| 1544 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.17 ± 0.05 | −0.28 | −0.06 | 3.6 | hurts |  |
| 1545 | Draconic Fury | 4 | Class | — | save | −0.17 ± 0.04 | −0.27 | −0.07 | 1.5 | hurts |  |
| 1546 | Surging Smash | 6 | Class | — | save (requirement assumed: You are overflowing) | −0.17 ± 0.04 | −0.14 | −0.21 | 1.9 | hurts |  |
| 1547 | You Can't Keep Us Down | 14 | Class | — | check | −0.17 ± 0.05 | −0.23 | −0.12 | 1.0 | hurts |  |
| 1548 | Ulfen Guard Dedication | 2 | Class | — | Designate Ally: its Effect on an ally within 30 feet | −0.17 ± 0.05 | +0.09 | −0.43 | 0.0 | hurts | the AI never used it |
| 1549 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.17 ± 0.04 | −0.12 | −0.22 | 1.6 | hurts |  |
| 1550 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.17 ± 0.04 | −0.18 | −0.16 | 2.9 | hurts |  |
| 1551 | Remember Their Names | 16 | Class | — | save | −0.17 ± 0.07 | −0.05 | −0.30 | 4.6 | hurts |  |
| 1552 | Shadowpiercing Charge | 12 | Class | — | Strike activity (requirement assumed: You're riding your horse and wielding a melee weapon) | −0.18 ± 0.05 | −0.06 | −0.29 | 2.6 | hurts |  |
| 1553 | Raise Slabs | 0 | Action | — | save | −0.18 ± 0.05 | −0.13 | −0.22 | 1.0 | hurts |  |
| 1554 | Flensing Slice | 8 | Class | — | check | −0.18 ± 0.06 | +0.22 | −0.57 | 8.9 | hurts |  |
| 1555 | Shield Warden | 6 | Class | champion | Shield Block for an adjacent ally (reaction) | −0.18 ± 0.06 | −0.20 | −0.16 | 0.1 | hurts |  |
| 1556 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.18 ± 0.05 | −0.17 | −0.18 | 1.0 | hurts |  |
| 1557 | Slam Down | 4 | Class | fighter | Strike activity | −0.18 ± 0.05 | −0.29 | −0.06 | 2.7 | hurts |  |
| 1558 | Share Rage | 8 | Class | barbarian | effect | −0.18 ± 0.06 | +0.03 | −0.39 | 8.0 | hurts |  |
| 1559 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.18 ± 0.03 | −0.28 | −0.08 | 2.5 | hurts |  |
| 1560 | Sun Blade | 4 | Class | champion | innate spell: Sun Blade (rank 2) | −0.18 ± 0.05 | −0.09 | −0.27 | 1.0 | hurts |  |
| 1561 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1562 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1563 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | −0.18 ± 0.09 | −0.15 | −0.21 | 5.7 | no clear effect |  |
| 1564 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | −0.18 ± 0.04 | −0.21 | −0.16 | 1.0 | hurts |  |
| 1565 | Electrogenesis | 6 | Class | — | save | −0.19 ± 0.05 | −0.22 | −0.15 | 1.0 | hurts |  |
| 1566 | Knockback Strike | 10 | Class | monk | Strike activity | −0.19 ± 0.05 | −0.20 | −0.17 | 4.2 | hurts |  |
| 1567 | Feral Toss | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | −0.19 ± 0.05 | −0.17 | −0.20 | 3.8 | hurts |  |
| 1568 | Spirit's Wrath | 12 | Class | barbarian | check | −0.19 ± 0.08 | +0.03 | −0.41 | 10.3 | hurts |  |
| 1569 | Homing Shot | 14 | Class | — | a ranged Strike ignoring concealment and cover | −0.19 ± 0.06 | −0.18 | −0.19 | 14.0 | hurts | with a loaded arquebus |
| 1570 | Decree of War | 18 | Class | — | Strike activity | −0.19 ± 0.05 | −0.09 | −0.29 | 2.3 | hurts |  |
| 1571 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.19 ± 0.05 | −0.04 | −0.34 | 3.1 | hurts |  |
| 1572 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.19 ± 0.04 | −0.21 | −0.18 | 2.5 | hurts |  |
| 1573 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.19 ± 0.07 | −0.27 | −0.12 | 1.0 | hurts |  |
| 1574 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.11 | −0.28 | 1.9 | hurts |  |
| 1575 | Infernal Interference | 16 | Class | — | Strike activity | −0.20 ± 0.06 | −0.17 | −0.22 | 4.8 | hurts |  |
| 1576 | Subjugation | 16 | Class | — | save | −0.20 ± 0.06 | −0.08 | −0.31 | 3.0 | hurts |  |
| 1577 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.20 ± 0.06 | −0.10 | −0.29 | 4.4 | hurts | with a warhammer and a free hand |
| 1578 | Trip | 0 | Action | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 2.0 | hurts | with a one-handed weapon and a free hand |
| 1579 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.20 ± 0.04 | −0.23 | −0.16 | 1.6 | hurts |  |
| 1580 | Ringing Challenge | 0 | Action | — | save | −0.20 ± 0.05 | −0.23 | −0.16 | 2.0 | hurts |  |
| 1581 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.20 ± 0.08 | −0.02 | −0.37 | 3.3 | hurts |  |
| 1582 | Opportunistic Grapple | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.1 | hurts |  |
| 1583 | Submission Hold | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.0 | hurts |  |
| 1584 | Staff Sweep | 6 | Class | — | check | −0.20 ± 0.04 | −0.23 | −0.17 | 2.6 | hurts |  |
| 1585 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1586 | Agathion Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Calm (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1587 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1588 | Archer's Aim | 8 | Class | — | Strike activity | −0.20 ± 0.06 | −0.26 | −0.14 | 7.2 | hurts |  |
| 1589 | Confusing Commands | 16 | Class | commander | save | −0.20 ± 0.10 | +0.10 | −0.51 | 4.5 | hurts |  |
| 1590 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.20 ± 0.06 | −0.24 | −0.16 | 4.9 | hurts |  |
| 1591 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.21 ± 0.05 | −0.24 | −0.17 | 2.1 | hurts |  |
| 1592 | Extract Element | 0 | Action | kineticist | save | −0.21 ± 0.05 | −0.20 | −0.21 | 6.1 | hurts |  |
| 1593 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.21 ± 0.07 | −0.10 | −0.31 | 10.2 | hurts |  |
| 1594 | Convocation of Greed | 0 | Action | — | an Effect on an ally | −0.21 ± 0.05 | −0.17 | −0.25 | 2.0 | hurts |  |
| 1595 | All Returns To Slumber | 6 | Class | — | save (requirement assumed: Your waking world is active) | −0.21 ± 0.04 | −0.11 | −0.32 | 3.0 | hurts |  |
| 1596 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.21 ± 0.05 | −0.14 | −0.28 | 1.0 | hurts |  |
| 1597 | Analyze Weakness | 6 | Class | rogue | +2d6 precision on its next sneak attack (1 action) | −0.21 ± 0.05 | −0.32 | −0.11 | 4.5 | hurts |  |
| 1598 | Skirt the Underworld | 0 | Action | — | save | −0.21 ± 0.05 | −0.23 | −0.19 | 2.1 | hurts |  |
| 1599 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.21 ± 0.04 | −0.26 | −0.17 | 2.0 | hurts |  |
| 1600 | Abrasive Drag | 12 | Class | — | check | −0.22 ± 0.06 | −0.07 | −0.36 | 3.8 | hurts |  |
| 1601 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1602 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1603 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.22 ± 0.06 | −0.37 | −0.06 | 2.7 | hurts |  |
| 1604 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1605 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1606 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1607 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1608 | Aldori Parry | 4 | Class | — | self effect | −0.22 ± 0.05 | −0.36 | −0.08 | 2.9 | hurts |  |
| 1609 | Fabricate Truth | 4 | Class | — | check | −0.22 ± 0.05 | −0.17 | −0.27 | 2.9 | hurts |  |
| 1610 | Wiles on the Wind | 12 | Class | kineticist | save | −0.22 ± 0.08 | −0.12 | −0.32 | 4.3 | hurts |  |
| 1611 | Weft and Warp | 16 | Class | — | Strike activity | −0.22 ± 0.05 | +0.02 | −0.46 | 2.8 | hurts |  |
| 1612 | Grudge Strike | 6 | Class | animist | Strike activity (requirement assumed: Your attuned apparition grants Heraldry Lore or Underworld Lore as an apparition skill) | −0.22 ± 0.06 | −0.20 | −0.25 | 2.6 | hurts |  |
| 1613 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.23 ± 0.04 | −0.31 | −0.14 | 1.0 | hurts |  |
| 1614 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.23 ± 0.05 | −0.21 | −0.24 | 1.0 | hurts |  |
| 1615 | The Dead Walk | 10 | Class | oracle | check | −0.23 ± 0.06 | −0.10 | −0.35 | 3.2 | hurts |  |
| 1616 | Heavy is the Crown | 0 | Action | — | inline save: 15-foot burst, will, 1 spirit (DC 17) | −0.23 ± 0.04 | −0.23 | −0.23 | 1.9 | hurts |  |
| 1617 | Drain Emotion | 9 | Ancestry | — | its text's self buff (TempHP 9) | −0.23 ± 0.05 | −0.22 | −0.24 | 1.0 | hurts |  |
| 1618 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.23 ± 0.05 | −0.31 | −0.15 | 5.5 | hurts |  |
| 1619 | The Tyrant Falls! | 20 | Class | — | self effect | −0.23 ± 0.06 | −0.22 | −0.24 | 1.0 | hurts |  |
| 1620 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1621 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1622 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.23 ± 0.04 | −0.33 | −0.13 | 2.7 | hurts |  |
| 1623 | Warning Shot | 2 | Class | gunslinger | check | −0.23 ± 0.06 | −0.19 | −0.28 | 2.7 | hurts |  |
| 1624 | Night's Shine | 12 | Class | — | innate spells: Asterism (rank 4), Touch of the Moon (rank 4) | −0.23 ± 0.06 | −0.20 | −0.26 | 3.5 | hurts |  |
| 1625 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.23 ± 0.05 | −0.20 | −0.27 | 2.0 | hurts |  |
| 1626 | Thunderclap Spell | 10 | Class | druid | Thunderclap Spell copies of 4 spells | −0.24 ± 0.05 | −0.12 | −0.35 | 3.5 | hurts |  |
| 1627 | Primal Roar | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1628 | Threatening Approach | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1629 | Buzzing Death Cicadas | 12 | Class | — | Death Drone: save | −0.24 ± 0.06 | −0.24 | −0.23 | 0.0 | hurts | the AI never used it |
| 1630 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.24 ± 0.05 | −0.28 | −0.20 | 2.1 | hurts |  |
| 1631 | Dirty Trick | 1 | Skill | — | check | −0.24 ± 0.04 | −0.07 | −0.41 | 1.6 | hurts |  |
| 1632 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.24 ± 0.05 | −0.26 | −0.22 | 2.1 | hurts |  |
| 1633 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.24 ± 0.05 | −0.25 | −0.23 | 2.1 | hurts |  |
| 1634 | Aether Blast | 4 | Class | — | save (requirement assumed: You are overflowing) | −0.24 ± 0.05 | −0.28 | −0.21 | 7.7 | hurts |  |
| 1635 | Thaumaturge Dedication | 2 | Class | — | Glimpse Vulnerability: effect | −0.24 ± 0.05 | +0.00 | −0.49 | 0.0 | hurts | the AI never used it |
| 1636 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | −0.24 ± 0.05 | −0.29 | −0.20 | 4.9 | hurts |  |
| 1637 | Whirling Throw | 6 | Class | monk | check | −0.25 ± 0.05 | −0.19 | −0.30 | 6.6 | hurts |  |
| 1638 | Stranglehold | 9 | Ancestry | — | check | −0.25 ± 0.05 | −0.16 | −0.33 | 9.7 | hurts |  |
| 1639 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.25 ± 0.04 | −0.33 | −0.16 | 4.3 | hurts |  |
| 1640 | Reactive Tangle | 4 | Class | — | check | −0.25 ± 0.04 | −0.31 | −0.19 | 2.6 | hurts |  |
| 1641 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.25 ± 0.05 | −0.23 | −0.27 | 2.7 | hurts |  |
| 1642 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.25 ± 0.07 | −0.45 | −0.05 | 17.5 | hurts |  |
| 1643 | Dizzying Spell | 14 | Class | wizard | Dizzying Spell copies of 6 spells | −0.25 ± 0.06 | −0.20 | −0.30 | 4.6 | hurts |  |
| 1644 | Scrap Barricade | 6 | Class | kineticist | save | −0.25 ± 0.10 | −0.18 | −0.32 | 4.7 | hurts |  |
| 1645 | Tactical Takedown | 0 | Action | commander | save | −0.25 ± 0.06 | −0.20 | −0.31 | 2.5 | hurts |  |
| 1646 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1647 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1648 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1649 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1650 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1651 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1652 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1653 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1654 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1655 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1656 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1657 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1658 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1659 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1660 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1661 | Catchy Tune | 5 | Ancestry | — | check | −0.26 ± 0.04 | −0.19 | −0.32 | 8.8 | hurts |  |
| 1662 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.26 ± 0.05 | −0.39 | −0.12 | 1.0 | hurts |  |
| 1663 | Clobber | 16 | Class | guardian | Strike activity | −0.26 ± 0.07 | −0.36 | −0.16 | 11.7 | hurts |  |
| 1664 | Tear Tendons | 8 | Class | — | save (requirement assumed: You are in claw stance and have two open hands) | −0.26 ± 0.06 | −0.16 | −0.37 | 4.1 | hurts |  |
| 1665 | Sanguivolent Roots | 8 | Class | kineticist | save | −0.27 ± 0.11 | −0.51 | −0.03 | 5.6 | hurts |  |
| 1666 | Cry of Rebellion | 16 | Class | — | save | −0.27 ± 0.07 | −0.27 | −0.27 | 1.0 | hurts |  |
| 1667 | Scorching Column | 1 | Class | kineticist | save | −0.27 ± 0.07 | −0.32 | −0.22 | 2.7 | hurts |  |
| 1668 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.27 ± 0.11 | −0.32 | −0.22 | 8.3 | hurts |  |
| 1669 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.27 ± 0.09 | −0.26 | −0.28 | 9.8 | hurts |  |
| 1670 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.27 ± 0.05 | −0.29 | −0.26 | 2.0 | hurts |  |
| 1671 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.28 ± 0.06 | −0.25 | −0.30 | 4.1 | hurts |  |
| 1672 | Grovel | 5 | Ancestry | — | check | −0.28 ± 0.04 | −0.23 | −0.32 | 6.1 | hurts |  |
| 1673 | Captivating Charm | 0 | Action | — | save | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1674 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.28 ± 0.07 | −0.29 | −0.27 | 4.5 | hurts |  |
| 1675 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1676 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.29 ± 0.06 | −0.39 | −0.18 | 3.0 | hurts |  |
| 1677 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.29 ± 0.05 | −0.27 | −0.31 | 3.5 | hurts |  |
| 1678 | Holy Light | 10 | Class | champion | save | −0.29 ± 0.06 | −0.18 | −0.40 | 4.8 | hurts |  |
| 1679 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.29 ± 0.06 | −0.25 | −0.33 | 2.1 | hurts |  |
| 1680 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.29 ± 0.06 | −0.14 | −0.44 | 7.5 | hurts |  |
| 1681 | Spinebreaker | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1682 | Ensnaring Wrappings | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1683 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.29 ± 0.05 | −0.30 | −0.29 | 7.3 | hurts |  |
| 1684 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.29 ± 0.06 | −0.33 | −0.26 | 9.5 | hurts |  |
| 1685 | Armored Rebuff | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 4.5 | hurts |  |
| 1686 | Wing Shove | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 3.9 | hurts |  |
| 1687 | Distracting Spellstrike | 4 | Class | magus | check | −0.30 ± 0.07 | −0.33 | −0.27 | 1.9 | hurts |  |
| 1688 | Sleeper Hold | 10 | Class | monk | check | −0.30 ± 0.08 | −0.45 | −0.15 | 6.8 | hurts |  |
| 1689 | Spinning Crush | 0 | Action | gunslinger | save | −0.30 ± 0.05 | −0.26 | −0.34 | 1.3 | hurts |  |
| 1690 | Mesmerizing Gaze | 6 | Class | — | save | −0.30 ± 0.05 | −0.21 | −0.39 | 3.1 | hurts |  |
| 1691 | Running Tackle | 8 | Class | — | check | −0.30 ± 0.06 | −0.29 | −0.31 | 3.8 | hurts |  |
| 1692 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | −0.30 ± 0.06 | −0.37 | −0.23 | 3.1 | hurts |  |
| 1693 | Clashing Compound Invocation | 10 | Class | — | save | −0.30 ± 0.07 | −0.40 | −0.20 | 11.4 | hurts |  |
| 1694 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.30 ± 0.09 | −0.36 | −0.24 | 5.1 | hurts |  |
| 1695 | Infiltration Assassination | 10 | Class | — | Strike activity (requirement assumed: You're wearing a loaded gauntlet bow) | −0.30 ± 0.05 | −0.35 | −0.25 | 4.1 | hurts |  |
| 1696 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.30 ± 0.09 | −0.20 | −0.40 | 4.3 | hurts |  |
| 1697 | Launch Fireworks | 0 | Action | — | save | −0.30 ± 0.05 | −0.19 | −0.42 | 3.3 | hurts | with a one-handed weapon and a free hand |
| 1698 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.30 ± 0.05 | −0.33 | −0.27 | 2.8 | hurts |  |
| 1699 | Demolish Defenses | 18 | Class | guardian | save | −0.31 ± 0.06 | −0.44 | −0.17 | 5.1 | hurts |  |
| 1700 | Clawdancer Dedication | 2 | Class | — | Claw Stance: PF2e's stance Effect | −0.31 ± 0.05 | −0.31 | −0.31 | 1.1 | hurts |  |
| 1701 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1702 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1703 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1704 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1705 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.5 | hurts |  |
| 1706 | Plane Step | 9 | Ancestry | — | check | −0.31 ± 0.05 | −0.32 | −0.30 | 2.3 | hurts |  |
| 1707 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.31 ± 0.08 | −0.32 | −0.30 | 5.0 | hurts |  |
| 1708 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | −0.31 ± 0.09 | −0.47 | −0.16 | 1.0 | hurts |  |
| 1709 | Wheeling Grab | 6 | Class | — | check | −0.32 ± 0.04 | −0.37 | −0.26 | 2.9 | hurts |  |
| 1710 | Crown of Rule | 16 | Class | exemplar | Heavy is the Crown: inline save: 15-foot burst, will, 16 spirit (DC 35) | −0.32 ± 0.07 | −0.30 | −0.33 | 0.0 | hurts | the AI never used it |
| 1711 | Putrefaction | 14 | Class | — | save | −0.32 ± 0.06 | −0.25 | −0.38 | 3.0 | hurts |  |
| 1712 | Stay Down! | 14 | Class | rogue | check | −0.32 ± 0.07 | −0.27 | −0.37 | 11.2 | hurts |  |
| 1713 | Parting Shot | 4 | Class | fighter | Strike activity | −0.32 ± 0.06 | −0.38 | −0.26 | 5.0 | hurts | with a bow in hand |
| 1714 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.32 ± 0.08 | −0.39 | −0.26 | 8.8 | hurts |  |
| 1715 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.32 ± 0.06 | −0.25 | −0.40 | 2.3 | hurts |  |
| 1716 | Exaltation Overwhelming | 18 | Class | — | save | −0.33 ± 0.06 | −0.30 | −0.35 | 2.9 | hurts |  |
| 1717 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1718 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1719 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1720 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1721 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1722 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1723 | Glimpse Vulnerability | 0 | Action | — | effect | −0.33 ± 0.05 | −0.05 | −0.60 | 6.0 | hurts |  |
| 1724 | Buckle-Cut Blitz | 0 | Action | commander | save | −0.33 ± 0.06 | −0.33 | −0.33 | 2.7 | hurts |  |
| 1725 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.33 ± 0.05 | −0.37 | −0.29 | 3.9 | hurts |  |
| 1726 | Spiritual Awakening | 4 | Class | — | Spiritual Expansion Spell: widened copies of 3 area spells | −0.33 ± 0.08 | −0.69 | +0.02 | 0.0 | hurts | the AI never used it |
| 1727 | Hallowed Initiate | 4 | Class | — | innate spell: Call of the Grave (rank 1), Death's Call (rank 1) | −0.33 ± 0.07 | −0.41 | −0.25 | 1.0 | hurts |  |
| 1728 | Rising Hurricane | 6 | Class | kineticist | save | −0.33 ± 0.10 | −0.48 | −0.19 | 4.4 | hurts |  |
| 1729 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.33 ± 0.06 | −0.27 | −0.40 | 1.0 | hurts |  |
| 1730 | Grim Swagger | 0 | Action | gunslinger | check (requirement assumed: You have a one-handed firearm or one-handed crossbow visibly worn or wielded) | −0.34 ± 0.06 | −0.12 | −0.56 | 1.4 | hurts |  |
| 1731 | Propulsive Leap | 10 | Class | — | save | −0.34 ± 0.06 | −0.37 | −0.32 | 10.4 | hurts |  |
| 1732 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.35 ± 0.05 | −0.34 | −0.35 | 4.5 | hurts |  |
| 1733 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | −0.35 ± 0.09 | −0.31 | −0.39 | 5.1 | hurts |  |
| 1734 | Weaver's Web | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.36 ± 0.05 | −0.25 | −0.47 | 4.1 | hurts |  |
| 1735 | Ostilli Host Dedication | 2 | Class | — | Spit Ambient Magic: save | −0.36 ± 0.05 | −0.25 | −0.47 | 0.0 | hurts | the AI never used it |
| 1736 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.36 ± 0.05 | −0.44 | −0.28 | 4.2 | hurts |  |
| 1737 | Channeled Protection | 4 | Class | animist | effect | −0.37 ± 0.09 | −0.58 | −0.15 | 17.3 | hurts |  |
| 1738 | Raise the Walls | 0 | Action | — | effect | −0.37 ± 0.06 | −0.26 | −0.48 | 7.3 | hurts |  |
| 1739 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.37 ± 0.07 | −0.18 | −0.56 | 11.8 | hurts |  |
| 1740 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.37 ± 0.07 | −0.35 | −0.38 | 1.6 | hurts |  |
| 1741 | Stupefying Raid | 0 | Action | commander | save | −0.38 ± 0.06 | −0.40 | −0.35 | 2.8 | hurts |  |
| 1742 | Aphet Flash | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.38 ± 0.05 | −0.28 | −0.49 | 6.4 | hurts |  |
| 1743 | Whirling Knockdown | 14 | Class | — | check | −0.39 ± 0.07 | −0.30 | −0.48 | 5.3 | hurts |  |
| 1744 | Brain Drain | 8 | Class | psychic | save | −0.39 ± 0.05 | −0.59 | −0.19 | 3.2 | hurts |  |
| 1745 | Perfect Shot | 18 | Class | ranger | a ranged Strike at maximum damage, then its turn ends (3 actions) | −0.39 ± 0.10 | −0.46 | −0.33 | 7.8 | hurts |  |
| 1746 | Rend Mimicry | 4 | Class | — | check | −0.39 ± 0.05 | −0.36 | −0.43 | 7.9 | hurts |  |
| 1747 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.40 ± 0.06 | −0.41 | −0.38 | 0.0 | hurts | with a one-handed weapon and a free hand; the AI never used it |
| 1748 | Protect the Royal Line | 16 | Class | — | check | −0.40 ± 0.06 | −0.51 | −0.29 | 5.2 | hurts |  |
| 1749 | Drive Back | 8 | Class | — | check | −0.40 ± 0.06 | −0.47 | −0.33 | 4.3 | hurts | with a weapon and a shield |
| 1750 | Wing Bounce | 4 | Class | — | check | −0.41 ± 0.07 | −0.43 | −0.38 | 2.5 | hurts |  |
| 1751 | Transfusion | 8 | Class | — | an Effect on an ally | −0.41 ± 0.06 | −0.34 | −0.47 | 7.4 | hurts |  |
| 1752 | Hammer Quake | 14 | Class | — | check | −0.43 ± 0.07 | −0.20 | −0.67 | 4.0 | hurts |  |
| 1753 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.43 ± 0.07 | −0.31 | −0.56 | 19.2 | hurts |  |
| 1754 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.44 ± 0.05 | −0.62 | −0.26 | 5.3 | hurts |  |
| 1755 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.45 ± 0.06 | −0.54 | −0.36 | 4.3 | hurts |  |
| 1756 | Coerce the Current | 9 | Ancestry | — | save (requirement assumed: You are swimming in water) | −0.45 ± 0.05 | −0.59 | −0.32 | 4.1 | hurts |  |
| 1757 | Wing Buffet | 9 | Ancestry | — | check | −0.45 ± 0.05 | −0.58 | −0.33 | 4.4 | hurts |  |
| 1758 | Fearful Symmetry | 6 | Class | — | save | −0.46 ± 0.06 | −0.56 | −0.37 | 8.3 | hurts |  |
| 1759 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.47 ± 0.05 | −0.48 | −0.46 | 3.1 | hurts |  |
| 1760 | Frog Geyser | 5 | Ancestry | — | save (requirement assumed: Your mouth is full of water) | −0.48 ± 0.04 | −0.78 | −0.18 | 3.4 | hurts |  |
| 1761 | Swarmkeeper Dedication | 2 | Class | — | Bite and Sting: save (requirement assumed: Your swarm is outside your body) | −0.48 ± 0.06 | −0.45 | −0.50 | 7.3 | hurts |  |
| 1762 | Repulse the Wicked | 6 | Class | — | check | −0.50 ± 0.05 | −0.67 | −0.32 | 3.1 | hurts |  |
| 1763 | Say That Again! | 6 | Skill | — | check | −0.50 ± 0.05 | −0.67 | −0.32 | 3.1 | hurts |  |
| 1764 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.50 ± 0.05 | −0.63 | −0.37 | 4.6 | hurts |  |
| 1765 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.52 ± 0.05 | −0.41 | −0.62 | 7.3 | hurts |  |
| 1766 | Mixed Maneuver | 8 | Class | monk | check | −0.52 ± 0.09 | −0.61 | −0.43 | 5.3 | hurts |  |
| 1767 | Warped Constriction | 8 | Class | — | save | −0.53 ± 0.06 | −0.50 | −0.56 | 11.6 | hurts |  |
| 1768 | Tamper | 1 | Class | inventor | check | −0.54 ± 0.06 | −0.51 | −0.56 | 7.4 | hurts |  |
| 1769 | Twist the Knife | 6 | Class | rogue | check | −0.56 ± 0.06 | −0.44 | −0.67 | 8.3 | hurts |  |
| 1770 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −0.56 ± 0.07 | −0.48 | −0.64 | 5.8 | hurts |  |
| 1771 | Trample Mimicry | 10 | Class | — | save | −0.56 ± 0.06 | −0.72 | −0.40 | 3.8 | hurts |  |
| 1772 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | −0.57 ± 0.06 | −0.63 | −0.50 | 1.0 | hurts |  |
| 1773 | Silk Bracelet | 6 | Class | inventor | save | −0.57 ± 0.10 | −0.42 | −0.72 | 4.5 | hurts |  |
| 1774 | Muckraking | 16 | Class | — | save | −0.58 ± 0.08 | −0.54 | −0.63 | 4.2 | hurts |  |
| 1775 | Perplex | 14 | Class | — | check | −0.58 ± 0.08 | −0.66 | −0.51 | 3.9 | hurts |  |
| 1776 | Wild Dance | 12 | Class | — | save | −0.58 ± 0.07 | −0.44 | −0.73 | 9.9 | hurts |  |
| 1777 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.59 ± 0.06 | −0.56 | −0.62 | 19.3 | hurts |  |
| 1778 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | −0.60 ± 0.10 | −0.49 | −0.70 | 2.9 | hurts |  |
| 1779 | Catfolk Dance | 1 | Ancestry | — | check | −0.60 ± 0.07 | −0.48 | −0.71 | 6.8 | hurts |  |
| 1780 | Flying Tackle | 4 | Class | guardian | check | −0.61 ± 0.08 | −0.76 | −0.46 | 3.4 | hurts |  |
| 1781 | Freeze It! | 9 | Ancestry | — | check | −0.63 ± 0.05 | −0.66 | −0.61 | 11.2 | hurts |  |
| 1782 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | −0.66 ± 0.10 | −0.75 | −0.56 | 4.3 | hurts | with a one-handed weapon and a free hand |
| 1783 | Dazzling Bullet | 6 | Class | — | check | −0.67 ± 0.06 | −0.60 | −0.73 | 9.4 | hurts |  |
| 1784 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.67 ± 0.07 | −0.64 | −0.70 | 5.8 | hurts |  |
| 1785 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.68 ± 0.08 | −0.61 | −0.76 | 15.8 | hurts |  |
| 1786 | Prayer Attack | 14 | Class | — | check | −0.70 ± 0.09 | −0.47 | −0.92 | 15.1 | hurts |  |
| 1787 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.71 ± 0.07 | −0.89 | −0.54 | 12.9 | hurts |  |
| 1788 | Gossamer Blade | 4 | Class | — | check | −0.73 ± 0.06 | −0.73 | −0.73 | 9.3 | hurts |  |
| 1789 | Dust Cloud | 8 | Class | — | save (requirement assumed: Your waking world is active) | −0.73 ± 0.08 | −0.79 | −0.67 | 14.4 | hurts |  |
| 1790 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.75 ± 0.06 | −0.88 | −0.61 | 8.8 | hurts |  |
| 1791 | Clear the Way | 6 | Class | — | check | −0.78 ± 0.07 | −1.03 | −0.52 | 3.8 | hurts |  |
| 1792 | Pyre Ant Sting | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.78 ± 0.06 | −0.88 | −0.69 | 10.0 | hurts |  |
| 1793 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.80 ± 0.07 | −0.99 | −0.61 | 28.3 | hurts |  |
| 1794 | Flourishing Finish | 12 | Class | — | check | −0.82 ± 0.09 | −0.82 | −0.82 | 14.3 | hurts |  |
| 1795 | One Moment till Glory | 0 | Action | — | effect | −0.87 ± 0.07 | −0.71 | −1.04 | 14.9 | hurts |  |
| 1796 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.89 ± 0.07 | −0.91 | −0.88 | 21.7 | hurts |  |
| 1797 | Peony's Flourish | 14 | Class | — | check | −0.90 ± 0.10 | −0.50 | −1.31 | 6.7 | hurts |  |
| 1798 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.91 ± 0.08 | −1.07 | −0.74 | 8.9 | hurts | with a bow in hand |
| 1799 | Purifying Breeze | 14 | Class | cleric | effect | −0.96 ± 0.09 | −1.16 | −0.77 | 20.6 | hurts |  |
| 1800 | Dance of the Tiger | 9 | Ancestry | — | check | −0.98 ± 0.08 | −1.32 | −0.65 | 16.4 | hurts |  |
| 1801 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.05 ± 0.06 | +0.00 | −2.09 | 1.0 | hurts |  |
| 1802 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.05 ± 0.06 | +0.00 | −2.09 | 1.0 | hurts |  |
| 1803 | Unbalancing Sweep | 12 | Class | barbarian | check | −1.14 ± 0.12 | −1.22 | −1.05 | 4.3 | hurts |  |
| 1804 | Scattering Charge | 12 | Class | guardian | check | −1.18 ± 0.11 | −1.26 | −1.11 | 4.6 | hurts |  |
| 1805 | Silencing Strike | 10 | Class | barbarian | save | −1.24 ± 0.11 | −1.73 | −0.74 | 16.8 | hurts |  |
| 1806 | Thrash | 8 | Class | barbarian | save | −1.26 ± 0.09 | −1.23 | −1.29 | 15.1 | hurts |  |
| 1807 | Astral Compound Invocation | 12 | Class | — | save | −1.31 ± 0.13 | −1.33 | −1.29 | 15.6 | hurts |  |
| 1808 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −1.39 ± 0.09 | −1.79 | −0.98 | 5.1 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 3533 |
| a spell the engine doesn't cast | 226 |
| a timer with no rules a fight counts | 139 |
| a Strike with nothing more the simulator reads | 120 |
| a plan the engine can't play | 77 |
| a teleport | 72 |
| an Effect with nothing a fight counts | 72 |
| its requirement | 72 |
| a roll whose results the simulator doesn't read | 63 |
| nothing a fight uses | 52 |
| it grants Additional Lore: the feat module reads nothing for it | 52 |
| a passive's roll with no action to use it | 47 |
| its text has no Strike of its user's | 42 |
| it grants one of 2 | 33 |
| a reaction's Strike | 26 |
| a reaction to "passive" | 25 |
| a spell the feat casts | 24 |
| a passive's Effect on other creatures | 24 |
| a passive's Effect posted by hand | 22 |
| its Effect has nothing a fight counts | 20 |
| a choice of ways the simulator doesn't play | 13 |
| a reroll | 13 |
| a companion's Strike | 11 |
| a lasting area | 11 |
| a passive's Strike | 11 |
| its requirement, which the PC doesn't meet | 11 |
| a Focus or Mythic Point back | 10 |
| it grants Pet: the feat module reads nothing for it | 8 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 6 |
| an Effect on another creature | 6 |
| it grants Cast a Spell: the feat module reads nothing for it | 5 |
| it grants Domain Initiate: the feat module reads nothing for it | 5 |
| it grants Specialty Crafting: the feat module reads nothing for it | 5 |
| it grants Impressive Performance: the feat module reads nothing for it | 5 |
| it grants Intimidating Glare: the feat module reads nothing for it | 5 |
| damage still naming the character's data | 4 |
| a roll twice | 4 |
| a reaction to "strike" | 4 |
| it grants Verdant Core Deviant Classification: the feat module reads nothing for it | 4 |
| it grants Terrain Stalker: the feat module reads nothing for it | 4 |
| it grants Leech Deviant Classification: the feat module reads nothing for it | 3 |
| it grants Assurance: the feat module reads nothing for it | 3 |
| it grants one of 3 | 3 |
| it grants Adopted Ancestry: the feat module reads nothing for it | 3 |
| it grants Quick Squeeze: the feat module reads nothing for it | 3 |
| it grants Lie to Me: the feat module reads nothing for it | 3 |
| it grants Snare Crafting: the feat module reads nothing for it | 3 |
| it grants Titan Wrestler: the feat module reads nothing for it | 3 |
| a reaction to "aura" | 2 |
| a free's Strike | 2 |
| its stance (Monastic Archer Stance): the feat module reads nothing for it | 2 |
| its stance (Hampering Stance): a lasting area | 2 |
| its stance (Wild Winds Stance), not in the packs | 2 |
| its stance (an elemental stance), not in the packs | 2 |
| effects the GM allows from the scenery | 2 |
| it grants Dragon Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Blight Soul Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Call Companion: the feat module reads nothing for it | 2 |
| it grants Quick Repair: the feat module reads nothing for it | 2 |
| it grants Enhanced Familiar: the feat module reads nothing for it | 2 |
| it grants Steady Balance: the feat module reads nothing for it | 2 |
| it grants Untrained Improvisation: the feat module reads nothing for it | 2 |
| it grants Conceal Spell: the feat module reads nothing for it | 2 |
| it grants Lengthy Diversion: the feat module reads nothing for it | 2 |
| it grants one of 6 | 2 |
| it grants Wraith Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Shield Block: the feat module reads nothing for it | 2 |
| it grants Multilingual: the feat module reads nothing for it | 2 |
| it grants Underwater Marauder: the feat module reads nothing for it | 2 |
| it grants Hunt Prey: nothing a fight uses | 2 |
| it grants Ride: the feat module reads nothing for it | 2 |
| it grants Eye for Numbers: the feat module reads nothing for it | 2 |
| it grants Oddity Identification: the feat module reads nothing for it | 2 |
| it grants Hobnobber: the feat module reads nothing for it | 2 |
| it grants Courtly Graces: the feat module reads nothing for it | 2 |
| it grants Combat Climber: the feat module reads nothing for it | 2 |
| a reaction to "damaged" | 1 |
| a reaction to "hit-by" | 1 |
| a reaction to "own-strike" | 1 |
| a target the simulator can't tell | 1 |
| its stance (Peafowl Stance): an Effect with nothing a fight counts | 1 |
| it grants Speed of Arms: a reaction's Strike | 1 |
| it grants Eidolon: the feat module reads nothing for it | 1 |
| it grants Once Bitten: the feat module reads nothing for it | 1 |
| it grants Psychometric Assessment: the feat module reads nothing for it | 1 |
| it grants Bonded Animal: the feat module reads nothing for it | 1 |
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
| it grants Find Fault: the feat module reads nothing for it | 1 |
| it grants Mirror-Trickery: nothing a fight uses | 1 |
| it grants Smoke Blending: nothing a fight uses | 1 |
| it grants Quick Identification: the feat module reads nothing for it | 1 |
| it grants Diehard: the feat module reads nothing for it | 1 |
| it grants Fast Recovery: the feat module reads nothing for it | 1 |
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
| it grants one of 15 | 1 |
| it grants Absorb into the Aegis: the feat module reads nothing for it | 1 |
| its stance (Powder Punch Stance): its text has no Strike of its user's | 1 |
| it grants Influence Rumor: the feat module reads nothing for it | 1 |
| it grants Solitary Invocation: the feat module reads nothing for it | 1 |
| it grants Crafter's Appraisal: the feat module reads nothing for it | 1 |
| its stance (Bullet Dancer Stance): the feat module reads nothing for it | 1 |
| it grants Command Undead: a roll whose results the simulator doesn't read | 1 |
| it grants Spread Propaganda: the feat module reads nothing for it | 1 |
| it grants Water Transfer: a teleport | 1 |
| it grants Witch's Charge: the feat module reads nothing for it | 1 |
| it grants Bullet Dancer Stance: the feat module reads nothing for it | 1 |
| it grants Infiltrator's Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Avoid Dire Fate: the feat module reads nothing for it | 1 |
| it grants Deity (Champion): the feat module reads nothing for it | 1 |
| it grants For My House!: a timer with no rules a fight counts | 1 |
| it grants Inventor: the feat module reads nothing for it | 1 |
| it grants Assume a Role: the feat module reads nothing for it | 1 |
| it grants On the Case: the feat module reads nothing for it | 1 |
| it grants Tactics: the feat module reads nothing for it | 1 |
| it grants Qi Spells: the feat module reads nothing for it | 1 |
| it grants one of 10 | 1 |
| it grants Juggle: a timer with no rules a fight counts | 1 |
| it grants Divine Spark and Ikons: the feat module reads nothing for it | 1 |
| it grants Binding Vow: the feat module reads nothing for it | 1 |
| it grants Taunt: an Effect with nothing a fight counts | 1 |
| it grants Crescent Spray: its text has no Strike of its user's | 1 |
| it grants Trick Magic Item: the feat module reads nothing for it | 1 |
| it grants Slippery Secrets: the feat module reads nothing for it | 1 |
| it grants Improvised Repair: the feat module reads nothing for it | 1 |
| it grants Intercept Attack: a teleport | 1 |
| it grants Natural Medicine: the feat module reads nothing for it | 1 |
| it grants Virtuosic Performer: the feat module reads nothing for it | 1 |
| it grants Forager: the feat module reads nothing for it | 1 |
| it grants Arcane Sense: a spell the engine doesn't cast | 1 |
| it grants Recognize Spell: the feat module reads nothing for it | 1 |
| it grants Only You and I: its text has no Strike of its user's | 1 |
| it grants Spasm of the Berserker: a timer with no rules a fight counts | 1 |
| it grants Guerrilla Assault: a Strike with nothing more the simulator reads | 1 |
| it grants Charming Liar: the feat module reads nothing for it | 1 |
| it grants Hefty Hauler: the feat module reads nothing for it | 1 |
| it grants Resist Magic: the feat module reads nothing for it | 1 |
| it grants Dancing Dodge: the feat module reads nothing for it | 1 |
| it grants Shameless Request: the feat module reads nothing for it | 1 |
| it grants Geomancer Dedication: the feat module reads nothing for it | 1 |
| it grants Canny Acumen: the feat module reads nothing for it | 1 |
| it grants Liberate Self: its Effect has nothing a fight counts | 1 |
| it grants Forced Pact: a roll whose results the simulator doesn't read | 1 |
| its stance (Exploit Vulnerability): a timer with no rules a fight counts | 1 |
| it grants Magical Shorthand: the feat module reads nothing for it | 1 |
| it grants Battle Medicine: the feat module reads nothing for it | 1 |
| it grants Ringing Challenge: a timer with no rules a fight counts | 1 |
| it grants Unravel the Future: the feat module reads nothing for it | 1 |
| it grants Blinding of the Needle: a Strike with nothing more the simulator reads | 1 |
| it grants Plant Thirty Barbs: a Strike with nothing more the simulator reads | 1 |
| it grants Brandish the Gorgon's Gaze: the feat module reads nothing for it | 1 |
| it grants Tangle in Riddle: the feat module reads nothing for it | 1 |
| it grants Quick Alchemy: nothing a fight uses | 1 |
| it grants Coiling Serpents: a Strike with nothing more the simulator reads | 1 |
| it grants Sever Four Dragonfly Wings: a Strike with nothing more the simulator reads | 1 |
| it grants A Challenge for Heroes: an Effect with nothing a fight counts | 1 |
| it grants Shed the Mortal Skin: a timer with no rules a fight counts | 1 |
| it grants Skirt the Underworld: a timer with no rules a fight counts | 1 |
| it grants Chassis Deflection: the feat module reads nothing for it | 1 |
| it grants Bless Ally: an Effect with nothing a fight counts | 1 |
| it grants Heaven Rains an Ending: a Strike with nothing more the simulator reads | 1 |
| it grants Set Free: its Effect has nothing a fight counts | 1 |
| it grants Break the Sun's Legs: a timer with no rules a fight counts | 1 |
| it grants Mark the Center: a timer with no rules a fight counts | 1 |
| it grants Incredible Investiture: the feat module reads nothing for it | 1 |
| it grants Restore the Moment: a reaction's Strike | 1 |
| it grants Entity's Resurgence: a plan the engine can't play | 1 |
| it grants Call Upon the Brightness: a plan the engine can't play | 1 |
| it grants Inspired Stratagem: a plan the engine can't play | 1 |
| it grants Salt Wound: a plan the engine can't play | 1 |
| it grants Upstage: a plan the engine can't play | 1 |
| it grants Overawe Crowd: a plan the engine can't play | 1 |
| it grants Unwavering Resilience: a plan the engine can't play | 1 |
| it grants Spell-Woven Shot: a Strike with nothing more the simulator reads | 1 |
| it grants Expel Maelstrom: a roll whose results the simulator doesn't read | 1 |
| it grants Rage: its requirement | 1 |
