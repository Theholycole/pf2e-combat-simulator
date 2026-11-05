# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-05: 1994 feats and actions rated, 4949 not simulated, 6 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 144 an encounter here, all fights 1514, no effect 667, precise 145, about zero 68 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 1354
- hurts: 472
- good: 95
- minor: 37
- strong: 31
- very strong: 5

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.72 ± 0.05 | +1.09 | +0.34 | 4.2 | very strong |  |
| 2 | Basic Thaumaturgy | 4 | Class | — | Root to Life: check | +0.60 ± 0.10 | +1.08 | +0.12 | 0.0 | very strong | the AI never used it |
| 3 | Blazing Wave | 4 | Class | kineticist | save | +0.57 ± 0.10 | +0.95 | +0.19 | 1.2 | very strong |  |
| 4 | Lightning Dash | 4 | Class | kineticist | save | +0.55 ± 0.11 | +0.98 | +0.11 | 3.3 | very strong |  |
| 5 | Song of Grace and Speed | 16 | Class | — | quickened for a minute, the PC and its allies within 30 feet (once a fight) | +0.51 ± 0.06 | +0.46 | +0.56 | 5.0 | very strong |  |
| 6 | Advanced Construct Companion | 4 | Class | inventor | its companion mature, the bear's numbers (against one young) | +0.49 ± 0.07 | +0.76 | +0.22 | 0.0 | strong | the AI never used it |
| 7 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.54 | +0.39 | 5.1 | strong |  |
| 8 | Scare to Death | 15 | Skill | — | save | +0.44 ± 0.05 | +0.65 | +0.22 | 3.8 | strong |  |
| 9 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.43 ± 0.08 | +0.37 | +0.50 | 14.1 | strong |  |
| 10 | Path of Iron | 14 | Class | — | 3 Strikes | +0.43 ± 0.05 | +0.53 | +0.34 | 3.7 | strong |  |
| 11 | Incredible Construct Companion | 8 | Class | inventor | its companion incredible, the bear's numbers (against one mature) | +0.43 ± 0.06 | +0.56 | +0.30 | 0.0 | strong | the AI never used it |
| 12 | Drifting Pollen | 8 | Class | kineticist | save | +0.43 ± 0.10 | +0.66 | +0.19 | 10.4 | strong |  |
| 13 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.42 ± 0.09 | +0.52 | +0.32 | 4.3 | strong |  |
| 14 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.40 ± 0.05 | +0.24 | +0.56 | 0.0 | strong | the AI never used it |
| 15 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 16 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 17 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.38 ± 0.07 | +0.69 | +0.07 | 0.0 | strong | the AI never used it |
| 18 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.38 ± 0.05 | +0.55 | +0.20 | 5.7 | strong |  |
| 19 | Battle-Tested Companion | 6 | Class | commander | its animal companion mature (against one young) | +0.37 ± 0.06 | +0.52 | +0.22 | 0.0 | strong | the AI never used it |
| 20 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.36 ± 0.04 | +0.37 | +0.35 | 2.0 | strong |  |
| 21 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.36 ± 0.06 | +0.41 | +0.31 | 0.0 | strong | the AI never used it |
| 22 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.51 | +0.19 | 10.5 | strong |  |
| 23 | Faithful Steed | 1 | Class | champion | its animal companion young (a bear, Commanded each turn) | +0.35 ± 0.06 | +0.26 | +0.44 | 0.0 | strong | the AI never used it |
| 24 | Shattering Shot | 12 | Class | gunslinger | save | +0.33 ± 0.08 | +0.28 | +0.37 | 10.6 | strong |  |
| 25 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 26 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.31 ± 0.07 | +0.45 | +0.16 | 5.4 | strong |  |
| 27 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 28 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 29 | Peerless Mascot Companion | 16 | Class | commander | its animal companion specialized (against one incredible) | +0.27 ± 0.08 | +0.43 | +0.12 | 0.0 | strong | the AI never used it |
| 30 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 31 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 32 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 33 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 34 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 35 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 36 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.06 | +0.40 | +0.11 | 4.4 | strong |  |
| 37 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.25 ± 0.06 | +0.34 | +0.15 | 1.0 | good |  |
| 38 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 39 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 40 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |

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
| 6 | Advanced Construct Companion | 4 | Class | inventor | its companion mature, the bear's numbers (against one young) | +0.49 ± 0.07 | +0.76 | +0.22 | 0.0 | strong | the AI never used it |
| 7 | Quickening Banner | 14 | Class | commander | quickened for a round, the PC and its allies within 30 feet (once a fight) | +0.47 ± 0.09 | +0.54 | +0.39 | 5.1 | strong |  |
| 8 | Scare to Death | 15 | Skill | — | save | +0.44 ± 0.05 | +0.65 | +0.22 | 3.8 | strong |  |
| 9 | Flesh Wound | 12 | Class | gunslinger | a ranged Strike whose failure deals a weapon die | +0.43 ± 0.08 | +0.37 | +0.50 | 14.1 | strong |  |
| 10 | Path of Iron | 14 | Class | — | 3 Strikes | +0.43 ± 0.05 | +0.53 | +0.34 | 3.7 | strong |  |
| 11 | Incredible Construct Companion | 8 | Class | inventor | its companion incredible, the bear's numbers (against one mature) | +0.43 ± 0.06 | +0.56 | +0.30 | 0.0 | strong | the AI never used it |
| 12 | Drifting Pollen | 8 | Class | kineticist | save | +0.43 ± 0.10 | +0.66 | +0.19 | 10.4 | strong |  |
| 13 | Witchwood Seed | 12 | Class | kineticist | inline save: 1 creature, touch, fortitude, 5d10 piercing (DC 31) | +0.42 ± 0.09 | +0.52 | +0.32 | 4.3 | strong |  |
| 14 | Reinforced Skeleton | 12 | Class | — | PF2e rules (always on) | +0.40 ± 0.05 | +0.24 | +0.56 | 0.0 | strong | the AI never used it |
| 15 | Basic Field Training | 4 | Class | — | Plant Banner: 8 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.39 ± 0.08 | +0.54 | +0.24 | 0.0 | strong | the AI never used it |
| 16 | Spike Skin | 8 | Class | kineticist | resistance to physical damage and spikes on an ally it touches | +0.38 ± 0.08 | +0.33 | +0.44 | 10.7 | strong |  |
| 17 | Battle-Hardened Companion | 10 | Class | commander | its animal companion incredible (against one mature) | +0.38 ± 0.07 | +0.69 | +0.07 | 0.0 | strong | the AI never used it |
| 18 | Regurgitate Mutagen | 4 | Class | alchemist | save (requirement assumed: You are under the effects of a mutagen) | +0.38 ± 0.05 | +0.55 | +0.20 | 5.7 | strong |  |
| 19 | Battle-Tested Companion | 6 | Class | commander | its animal companion mature (against one young) | +0.37 ± 0.06 | +0.52 | +0.22 | 0.0 | strong | the AI never used it |
| 20 | Deflecting Shot | 10 | Class | gunslinger | +2 AC to an ally within 60 feet as it's hit (reaction) | +0.36 ± 0.04 | +0.37 | +0.35 | 2.0 | strong |  |
| 21 | Become Thought | 20 | Class | psychic | PF2e rules (always on) | +0.36 ± 0.06 | +0.41 | +0.31 | 0.0 | strong | the AI never used it |
| 22 | Thundering Surge | 16 | Class | — | save (requirement assumed: Your Spellsurge aura is active) | +0.35 ± 0.06 | +0.51 | +0.19 | 10.5 | strong |  |
| 23 | Faithful Steed | 1 | Class | champion | its animal companion young (a bear, Commanded each turn) | +0.35 ± 0.06 | +0.26 | +0.44 | 0.0 | strong | the AI never used it |
| 24 | Shattering Shot | 12 | Class | gunslinger | save | +0.33 ± 0.08 | +0.28 | +0.37 | 10.6 | strong |  |
| 25 | Rain of Rust | 4 | Class | kineticist | inline save: 10-foot burst, fortitude, 3d6 untyped (DC 20) | +0.32 ± 0.11 | +0.52 | +0.13 | 3.9 | strong |  |
| 26 | Triggerbrand Salvo | 6 | Class | gunslinger | Strike activity (requirement assumed: You're wielding a combination weapon) | +0.31 ± 0.07 | +0.45 | +0.16 | 5.4 | strong |  |
| 27 | Retch Rust | 8 | Class | kineticist | save | +0.30 ± 0.07 | +0.20 | +0.40 | 2.2 | strong |  |
| 28 | Dance of Thunder | 14 | Class | gunslinger | 3 Strikes | +0.29 ± 0.09 | +0.24 | +0.33 | 5.0 | strong |  |
| 29 | Peerless Mascot Companion | 16 | Class | commander | its animal companion specialized (against one incredible) | +0.27 ± 0.08 | +0.43 | +0.12 | 0.0 | strong | the AI never used it |
| 30 | Tumbling Lumber | 4 | Class | kineticist | save | +0.27 ± 0.12 | +0.55 | −0.01 | 4.0 | strong |  |
| 31 | Whirling Grindstone | 4 | Class | kineticist | impulse attack: 2d6 + 1d6 slashing and fire (30 feet, attack +10) | +0.27 ± 0.12 | +0.53 | +0.01 | 3.8 | strong |  |
| 32 | Infinite Expanse of Bluest Heaven | 18 | Class | kineticist | inline save: 20-foot burst, will (DC 40) | +0.27 ± 0.05 | +0.10 | +0.43 | 0.8 | strong |  |
| 33 | Stab and Blast | 8 | Class | gunslinger | Strike activity | +0.26 ± 0.06 | +0.33 | +0.19 | 6.5 | strong |  |
| 34 | Accursed Magic | 8 | Class | — | innate spells: Claim Curse (rank 3), Seal Fate (rank 10), Inevitable Disaster (rank 12) | +0.26 ± 0.06 | +0.36 | +0.16 | 2.0 | strong |  |
| 35 | Elemental Burst | 0 | Action | — | inline save: 20-foot burst, reflex, 6d6 fire (DC 17, 1/fight) | +0.26 ± 0.05 | +0.00 | +0.51 | 0.5 | strong |  |
| 36 | Fumigate | 14 | Class | — | Strike activity | +0.25 ± 0.06 | +0.40 | +0.11 | 4.4 | strong |  |
| 37 | Pass Vengeful Judgment | 18 | Class | — | save (requirement assumed: Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calling down the terrible power of divine wrath, you have vowed to do so only with the assent of your mortal hierophant) | +0.25 ± 0.06 | +0.34 | +0.15 | 1.0 | good |  |
| 38 | Drifter's Juke | 6 | Class | gunslinger | 2 Strikes | +0.24 ± 0.07 | +0.35 | +0.14 | 3.5 | good |  |
| 39 | Goblin Jubilee | 0 | Action | — | save | +0.24 ± 0.05 | +0.04 | +0.45 | 0.5 | good |  |
| 40 | Plant Banner | 1 | Class | commander | 4 temporary Hit Points, the PC and its allies within 30 feet (once a fight) | +0.24 ± 0.05 | +0.08 | +0.41 | 5.0 | good |  |
| 41 | Weight of Stone | 6 | Class | kineticist | save | +0.24 ± 0.09 | +0.47 | +0.02 | 4.0 | good |  |
| 42 | Prototype Companion | 1 | Class | inventor | its companion young, the bear's numbers (Commanded each turn) | +0.24 ± 0.07 | +0.29 | +0.18 | 0.0 | good | the AI never used it |
| 43 | Explosion | 6 | Class | — | Explode: inline save: 5-foot emanation, reflex, 6d6 fire (DC 22) | +0.23 ± 0.08 | +0.36 | +0.11 | 3.2 | good |  |
| 44 | Fatal Shot | 18 | Class | — | Strike activity | +0.23 ± 0.05 | +0.33 | +0.13 | 3.3 | good |  |
| 45 | Fiend Slayer | 16 | Class | — | save | +0.23 ± 0.05 | +0.17 | +0.29 | 3.3 | good |  |
| 46 | Jester's Gambol | 16 | Class | animist | stance | +0.23 ± 0.07 | +0.36 | +0.09 | 1.0 | good |  |
| 47 | Cross the Final Horizon | 20 | Class | — | 3 Strikes (in Sky and Heaven Stance) | +0.23 ± 0.06 | +0.33 | +0.12 | 3.6 | good |  |
| 48 | Eidolon's Retort | 6 | Class | summoner | its eidolon's Retort (a Reactive Strike) | +0.22 ± 0.08 | +0.03 | +0.42 | 0.0 | good | the AI never used it |
| 49 | Primal Guardian | 8 | Class | — | innate spells: Elemental Sheath (rank 4), Vicious Howl (rank 4) | +0.22 ± 0.05 | +0.33 | +0.12 | 1.0 | good |  |
| 50 | Protective Strike | 10 | Class | — | reaction Strike (ally-attacked) | +0.22 ± 0.04 | +0.32 | +0.12 | 1.5 | good |  |
| 51 | Incredible Companion (Druid) | 8 | Class | druid | its animal companion incredible (against one mature) | +0.22 ± 0.04 | +0.22 | +0.21 | 0.0 | good | the AI never used it |
| 52 | Glory on High | 18 | Class | — | inline save: 60-foot emanation, will, 10d6 mental (DC 38) | +0.22 ± 0.06 | +0.11 | +0.33 | 4.0 | good |  |
| 53 | Patron's Claim | 0 | Action | — | inline save: 1 creature, 30 feet, fortitude, 10d10 spirit (DC 17, 1/fight) | +0.21 ± 0.05 | +0.26 | +0.15 | 1.0 | good |  |
| 54 | Splendid Companion | 12 | Class | — | its animal companion incredible (against one mature) | +0.21 ± 0.05 | +0.36 | +0.05 | 0.0 | good | the AI never used it |
| 55 | Topple the Pillar of Heaven | 0 | Action | — | inline save: 60-foot line, reflex, 6d8 untyped (DC 17) | +0.21 ± 0.05 | +0.11 | +0.30 | 1.5 | good |  |
| 56 | Specialized Beastmaster Companion | 14 | Class | — | its animal companion specialized (against one incredible) | +0.20 ± 0.05 | +0.34 | +0.06 | 0.0 | good | the AI never used it |
| 57 | Specialized Spirit Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.20 ± 0.05 | +0.34 | +0.06 | 0.0 | good | the AI never used it |
| 58 | A Miracle of Science! | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.20 ± 0.05 | +0.34 | +0.06 | 0.0 | good | the AI never used it |
| 59 | Paragon Reanimated Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.20 ± 0.05 | +0.34 | +0.06 | 0.0 | good | the AI never used it |
| 60 | Commander's Companion | 1 | Class | commander | its animal companion young (a bear, Commanded each turn) | +0.19 ± 0.07 | +0.35 | +0.04 | 0.0 | good | the AI never used it |
| 61 | Implement's Assault | 18 | Class | thaumaturge | a Strike at each enemy within 30 feet (3 actions) | +0.19 ± 0.07 | +0.00 | +0.39 | 3.8 | good |  |
| 62 | Storm Spiral | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.08 | +0.30 | 0.9 | good |  |
| 63 | Mature Animal Companion (Ranger) | 6 | Class | ranger | its animal companion mature (against one young) | +0.19 ± 0.06 | +0.21 | +0.17 | 0.0 | good | the AI never used it |
| 64 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.19 ± 0.05 | +0.04 | +0.34 | 0.0 | good | the AI never used it |
| 65 | Whispers of Warning | 12 | Class | animist | an attack that hits it rolled twice, the lower kept (reaction) | +0.19 ± 0.05 | +0.19 | +0.18 | 1.8 | good |  |
| 66 | Call the Hurricane | 8 | Class | kineticist | save | +0.19 ± 0.07 | +0.22 | +0.15 | 1.3 | good |  |
| 67 | Crashing Slam | 10 | Class | fighter | Slam Down (with it) whose hit trips as a critical success: prone and 1d6 bludgeoning | +0.19 ± 0.04 | +0.38 | −0.01 | 3.5 | good |  |
| 68 | Root to Life | 1 | Class | thaumaturge | check | +0.19 ± 0.07 | +0.30 | +0.08 | 2.9 | good |  |
| 69 | Supreme Spellstrike | 20 | Class | magus | permanently quickened (always on) | +0.18 ± 0.07 | +0.16 | +0.21 | 0.0 | good | the AI never used it |
| 70 | Incredible Companion (Ranger) | 10 | Class | ranger | its animal companion incredible (against one mature) | +0.18 ± 0.05 | +0.23 | +0.13 | 0.0 | good | the AI never used it |
| 71 | Specialized Companion (Ranger) | 16 | Class | ranger | its animal companion specialized (against one incredible) | +0.18 ± 0.06 | +0.03 | +0.33 | 0.0 | good | the AI never used it |
| 72 | Final Shot | 18 | Class | gunslinger | a ranged Strike whose hit is a critical hit, then off-guard and stunned 1 (3 actions) | +0.18 ± 0.09 | +0.34 | +0.02 | 5.6 | no clear effect |  |
| 73 | Stand Still | 4 | Class | monk | reaction Strike (move, leave) | +0.18 ± 0.09 | +0.16 | +0.20 | 0.9 | good |  |
| 74 | Rock The Boat | 8 | Class | fighter | check | +0.18 ± 0.05 | +0.46 | −0.11 | 7.0 | good |  |
| 75 | Ruby Resurrection | 20 | Class | sorcerer | staying up at 0 Hit Points | +0.18 ± 0.04 | +0.13 | +0.22 | 0.7 | good |  |
| 76 | Constricting Hold | 8 | Class | summoner | save | +0.18 ± 0.06 | +0.24 | +0.11 | 3.4 | good |  |
| 77 | Cavalier Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.17 ± 0.06 | +0.20 | +0.15 | 0.0 | good | the AI never used it |
| 78 | Drake Rider Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.17 ± 0.06 | +0.20 | +0.15 | 0.0 | good | the AI never used it |
| 79 | Solar Detonation | 8 | Class | kineticist | save | +0.17 ± 0.06 | −0.05 | +0.39 | 0.8 | good |  |
| 80 | Death Roll | 6 | Class | — | Strike activity | +0.17 ± 0.03 | +0.30 | +0.05 | 5.7 | good |  |
| 81 | Opportune Backstab | 8 | Class | rogue | reaction Strike (ally-hit) | +0.17 ± 0.04 | +0.19 | +0.15 | 1.9 | good |  |
| 82 | Basic Mysteries | 4 | Class | — | Nudge the Scales: heals 10 (30 feet) | +0.17 ± 0.06 | +0.30 | +0.04 | 0.0 | good | the AI never used it |
| 83 | Mammoth Lord Dedication | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.17 ± 0.05 | +0.12 | +0.21 | 0.0 | good | the AI never used it |
| 84 | Basic Maneuver | 4 | Class | — | Snagging Strike: Strike activity | +0.17 ± 0.05 | +0.25 | +0.09 | 0.0 | good | with a one-handed weapon and a free hand; the AI never used it |
| 85 | Animal Companion | 1 | Class | druid | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.21 | +0.12 | 0.0 | good | the AI never used it |
| 86 | Beastmaster Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 0.0 | good | the AI never used it |
| 87 | Animal Trainer Dedication | 2 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 0.0 | good | the AI never used it |
| 88 | Undead Master Dedication | 2 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.16 ± 0.05 | +0.33 | +0.00 | 0.0 | good | the AI never used it |
| 89 | Shadowpiercing Charge | 12 | Class | — | its mount's double Stride and two Strikes at one multiple attack penalty (its extra damage in darkness not played) | +0.16 ± 0.04 | +0.25 | +0.07 | 3.0 | good |  |
| 90 | Rebounding Assault | 10 | Class | gunslinger | two ranged Strikes at one penalty, +1d6 precision if both hit | +0.16 ± 0.06 | +0.14 | +0.18 | 3.9 | good |  |
| 91 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | +0.16 ± 0.06 | +0.23 | +0.09 | 1.0 | good |  |
| 92 | Specialized Companion (Animal Trainer) | 18 | Class | — | its animal companion specialized (against one incredible) | +0.16 ± 0.04 | +0.08 | +0.24 | 0.0 | good | the AI never used it |
| 93 | Shattering Spellstrike | 4 | Class | magus | check | +0.16 ± 0.07 | +0.44 | −0.12 | 2.5 | good |  |
| 94 | Haft Beatdown | 10 | Class | fighter | four Strikes, two at its penalty and two one step worse (3 actions, once a fight) (in Haft Striker Stance) | +0.16 ± 0.05 | +0.23 | +0.08 | 1.0 | good |  |
| 95 | Fortissimo Composition | 8 | Class | bard | Courageous Anthem at +2 for a round, the PC and its allies within 60 feet (once a fight) | +0.15 ± 0.03 | +0.23 | +0.07 | 5.0 | good |  |
| 96 | Loyal Warhorse | 6 | Class | champion | its animal companion mature (against one young) | +0.15 ± 0.05 | +0.26 | +0.05 | 0.0 | good | the AI never used it |
| 97 | Infernal Anguish | 8 | Class | — | check | +0.15 ± 0.06 | +0.44 | −0.14 | 9.1 | good |  |
| 98 | Correct the Story | 6 | Class | — | a foe's critical hit or critically successful save rerolled (reaction, a Mythic Point) | +0.15 ± 0.03 | +0.14 | +0.16 | 0.9 | good |  |
| 99 | Acrid Barrage | 0 | Action | — | save | +0.15 ± 0.04 | +0.19 | +0.10 | 1.3 | good |  |
| 100 | Ash Strider | 6 | Class | kineticist | save | +0.15 ± 0.08 | +0.38 | −0.09 | 4.1 | no clear effect |  |
| 101 | Merciless Rend | 10 | Class | summoner | check | +0.15 ± 0.05 | +0.16 | +0.14 | 3.6 | good |  |
| 102 | Mythic Strike | 10 | Class | — | a Strike at mythic proficiency, about +4 (a Mythic Point) | +0.15 ± 0.04 | +0.22 | +0.08 | 4.0 | good |  |
| 103 | Specialized Mount | 14 | Class | — | its animal companion specialized (against one incredible) | +0.15 ± 0.04 | +0.16 | +0.13 | 0.0 | good | the AI never used it |
| 104 | Specialized Megafauna Companion | 14 | Class | — | its companion specialized, the bear's numbers (against one incredible) | +0.15 ± 0.04 | +0.16 | +0.13 | 0.0 | good | the AI never used it |
| 105 | Guardian's Deflection (Swashbuckler) | 4 | Class | swashbuckler | +2 AC to an ally in reach as it's hit (reaction) | +0.15 ± 0.03 | +0.19 | +0.10 | 0.8 | good |  |
| 106 | Devastating Duelist | 18 | Class | — | Strike activity | +0.14 ± 0.04 | +0.19 | +0.10 | 4.1 | good |  |
| 107 | Legendary Rider | 20 | Class | — | quickened for its Command: its own three actions and its mount's two | +0.14 ± 0.05 | +0.18 | +0.11 | 0.0 | good | the AI never used it |
| 108 | Impaling Thrust | 14 | Class | barbarian | Strike activity | +0.14 ± 0.07 | +0.13 | +0.16 | 5.2 | no clear effect | with two weapons (longsword and shortsword) |
| 109 | Recharging Flurry | 4 | Class | magus | 2 Strikes | +0.14 ± 0.08 | +0.22 | +0.06 | 2.5 | no clear effect | with two weapons (longsword and shortsword) |
| 110 | Specialized Companion (Druid) | 14 | Class | druid | its animal companion specialized (against one incredible) | +0.14 ± 0.05 | +0.22 | +0.06 | 0.0 | good | the AI never used it |
| 111 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.14 ± 0.06 | +0.17 | +0.11 | 3.8 | good | with two weapons (longsword and shortsword) |
| 112 | Paragon Companion | 14 | Class | inventor | its companion specialized, the bear's numbers (against one incredible) | +0.14 ± 0.05 | +0.17 | +0.10 | 0.0 | good | the AI never used it |
| 113 | Thick Skin | 12 | Class | — | more maximum Hit Points | +0.14 ± 0.04 | +0.10 | +0.17 | 0.0 | good | the AI never used it |
| 114 | Diamond Fists | 18 | Class | monk | its unarmed attacks forceful and deadly d10 | +0.14 ± 0.05 | +0.11 | +0.16 | 0.0 | good | the AI never used it |
| 115 | Living Epic | 20 | Class | — | passive effect (always on) | +0.13 ± 0.03 | +0.13 | +0.13 | 1.0 | good | always on (its moment isn't checked) |
| 116 | Assassinate | 12 | Class | — | Strike activity (requirement assumed: You have designated a mark using Mark for Death and are completely unnoticed by your mark) | +0.13 ± 0.06 | +0.15 | +0.12 | 3.3 | good |  |
| 117 | Siphon Life | 10 | Class | — | Strike activity | +0.13 ± 0.04 | +0.22 | +0.04 | 3.5 | good |  |
| 118 | Scour the Library | 10 | Class | psychic | self effect | +0.13 ± 0.05 | +0.17 | +0.10 | 3.2 | good |  |
| 119 | Telling Blow | 18 | Class | — | Strike activity | +0.13 ± 0.05 | +0.14 | +0.13 | 3.6 | good |  |
| 120 | Return Unto Runes | 16 | Class | — | self effect | +0.13 ± 0.07 | +0.08 | +0.18 | 6.1 | no clear effect |  |
| 121 | Duelist's Form | 16 | Class | — | a stance: quickened | +0.13 ± 0.05 | +0.08 | +0.18 | 1.0 | good |  |
| 122 | Marked for Rebuke | 18 | Class | — | an Effect on a foe | +0.13 ± 0.05 | +0.18 | +0.08 | 6.8 | good |  |
| 123 | One-On-One | 12 | Class | — | a Feint and a Strike, taken as off-guard, once a round (the dueling sword not checked) | +0.13 ± 0.03 | +0.17 | +0.08 | 3.7 | good |  |
| 124 | Furious Grab | 12 | Class | barbarian | check | +0.13 ± 0.08 | +0.18 | +0.08 | 5.8 | no clear effect |  |
| 125 | Sacral Monarch | 14 | Class | champion | innate spells: Banishment (rank 5), Inevitable Disaster (rank 5) | +0.13 ± 0.07 | +0.17 | +0.08 | 1.0 | no clear effect |  |
| 126 | Sportlebore Choke | 8 | Class | — | save (requirement assumed: Your swarm is outside your body) | +0.13 ± 0.06 | +0.30 | −0.05 | 3.4 | good |  |
| 127 | Wolf Drag | 6 | Class | monk | Strike activity (in Wolf Stance) | +0.12 ± 0.06 | +0.29 | −0.04 | 4.0 | good |  |
| 128 | Imprison Foe | 18 | Class | — | save | +0.12 ± 0.05 | +0.15 | +0.09 | 2.6 | good |  |
| 129 | Spell Acceleration | 12 | Class | — | Quickened Casting: Quickened Casting (once a fight) | +0.12 ± 0.06 | +0.23 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 130 | Osteo Armaments | 4 | Class | — | effect | +0.12 ± 0.05 | +0.05 | +0.19 | 2.0 | good |  |
| 131 | Transcendent Deflection | 10 | Class | — | an attack that would drop it negated (once a fight) | +0.12 ± 0.03 | +0.20 | +0.04 | 0.3 | good |  |
| 132 | Forest's Heart | 16 | Class | animist | stance | +0.12 ± 0.07 | +0.28 | −0.05 | 1.0 | no clear effect |  |
| 133 | Lantern Beam | 0 | Action | — | save (requirement assumed: Your lantern light is shining) | +0.12 ± 0.05 | +0.09 | +0.14 | 1.1 | good |  |
| 134 | Gang Up | 6 | Class | rogue | passive-rules | +0.12 ± 0.03 | +0.15 | +0.08 | 0.0 | good |  |
| 135 | Desperate Revival | 16 | Class | — | staying up at 0 Hit Points | +0.11 ± 0.03 | +0.08 | +0.15 | 0.7 | good |  |
| 136 | Lava Leap | 4 | Class | kineticist | save | +0.11 ± 0.08 | +0.18 | +0.05 | 1.6 | no clear effect |  |
| 137 | Mature Trained Companion | 6 | Class | — | its animal companion mature (against one young) | +0.11 ± 0.04 | +0.24 | −0.01 | 0.0 | good | the AI never used it |
| 138 | Let My Creature Live! | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.11 ± 0.04 | +0.24 | −0.01 | 0.0 | good | the AI never used it |
| 139 | Usurp the Lunar Reins | 18 | Class | kineticist | save | +0.11 ± 0.05 | −0.01 | +0.22 | 0.8 | good |  |
| 140 | Seize | 14 | Class | — | check | +0.11 ± 0.06 | +0.20 | +0.02 | 7.1 | no clear effect |  |
| 141 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.11 ± 0.06 | +0.20 | +0.02 | 3.3 | no clear effect |  |
| 142 | Triangle Shot | 18 | Class | monk | 3 Strikes | +0.11 ± 0.08 | +0.01 | +0.21 | 3.9 | no clear effect | with a loaded arquebus |
| 143 | Cobra Envenom | 10 | Class | monk | Strike activity (in Cobra Stance) | +0.11 ± 0.06 | +0.15 | +0.06 | 10.3 | no clear effect |  |
| 144 | Grievous Blow | 8 | Class | — | Strike activity | +0.11 ± 0.05 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 145 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 6.5 | no clear effect |  |
| 146 | Duo's Aim | 8 | Class | — | Strike activity | +0.11 ± 0.06 | +0.18 | +0.03 | 4.1 | no clear effect |  |
| 147 | Pierce the Eye | 16 | Class | — | save | +0.10 ± 0.07 | +0.23 | −0.02 | 3.7 | no clear effect | with a loaded arquebus |
| 148 | Mythic Containment | 10 | Class | — | check | +0.10 ± 0.05 | +0.20 | +0.01 | 2.8 | good |  |
| 149 | Ghostly Condemnation | 12 | Class | — | casts Vision of Death (rank 5, DC 31, 1/fight) | +0.10 ± 0.06 | +0.30 | −0.10 | 1.0 | no clear effect |  |
| 150 | Spirit Sanctification | 0 | Action | — | its text's self buff (FlatModifier saving-throw 1) | +0.10 ± 0.03 | +0.06 | +0.14 | 1.0 | good |  |
| 151 | Thundering Roar | 0 | Action | — | inline save: 10-foot emanation, will, 4d8 sonic (DC 17) | +0.10 ± 0.04 | +0.00 | +0.20 | 1.1 | minor |  |
| 152 | Rampaging Ferocity | 0 | Action | — | staying up at 0 Hit Points | +0.10 ± 0.02 | +0.17 | +0.02 | 0.3 | minor |  |
| 153 | Into the Fray | 8 | Class | — | 2 Strikes | +0.10 ± 0.05 | +0.20 | −0.00 | 3.4 | no clear effect | with a weapon and a shield |
| 154 | Do You Know Who I Am? | 12 | Class | — | check | +0.10 ± 0.06 | +0.13 | +0.06 | 1.0 | no clear effect |  |
| 155 | Reveal Machinations | 15 | Skill | — | check | +0.10 ± 0.04 | +0.09 | +0.10 | 1.0 | minor |  |
| 156 | Feign Innocence | 12 | Class | — | inline save: 1 creature, 60 feet, will (DC 31) | +0.10 ± 0.07 | +0.70 | −0.51 | 25.8 | no clear effect |  |
| 157 | Topple The Titans | 4 | Class | exemplar | check | +0.10 ± 0.07 | +0.29 | −0.10 | 1.0 | no clear effect |  |
| 158 | Orc Ferocity | 1 | Ancestry | — | staying up at 0 Hit Points | +0.09 ± 0.02 | +0.14 | +0.05 | 0.3 | minor |  |
| 159 | Armor Break | 12 | Class | guardian | save | +0.09 ± 0.06 | +0.10 | +0.09 | 2.3 | no clear effect |  |
| 160 | Unfazed Assessment | 8 | Class | — | its text's self buff (FlatModifier ac 1) | +0.09 ± 0.05 | +0.16 | +0.02 | 1.0 | no clear effect |  |
| 161 | Borrow Time | 10 | Class | — | check | +0.09 ± 0.03 | +0.11 | +0.07 | 1.0 | minor |  |
| 162 | Raging Intimidation | 1 | Class | barbarian | Scare to Death: save | +0.09 ± 0.04 | +0.33 | −0.15 | 0.0 | minor | the AI never used it |
| 163 | Certain Strike | 10 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.14 | +0.04 | 7.4 | minor |  |
| 164 | Ring Their Bell | 6 | Class | guardian | Strike activity | +0.09 ± 0.05 | +0.04 | +0.13 | 5.2 | no clear effect |  |
| 165 | Snagging Strike | 1 | Class | fighter | Strike activity | +0.09 ± 0.02 | +0.12 | +0.05 | 3.2 | minor | with a one-handed weapon and a free hand |
| 166 | Basic Defender | 4 | Class | — | Taunting Strike: Strike activity | +0.09 ± 0.03 | +0.18 | −0.01 | 0.0 | minor | the AI never used it |
| 167 | Mature Beastmaster Companion | 4 | Class | — | its animal companion mature (against one young) | +0.09 ± 0.04 | +0.11 | +0.06 | 0.0 | minor | the AI never used it |
| 168 | Advanced Reanimated Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.09 ± 0.04 | +0.11 | +0.06 | 0.0 | minor | the AI never used it |
| 169 | Rallying Banner | 8 | Class | commander | check | +0.09 ± 0.07 | +0.08 | +0.09 | 1.0 | no clear effect |  |
| 170 | Fracture Timeflow | 18 | Class | — | a Will save at DC 38 after each critical Strike | +0.09 ± 0.04 | +0.10 | +0.08 | 5.2 | minor |  |
| 171 | Dirge of Doom | 6 | Class | bard | innate spell: Dirge of Doom (rank 3) | +0.09 ± 0.03 | +0.16 | +0.01 | 5.3 | minor |  |
| 172 | Body Shield | 4 | Class | — | +2 AC against an attack (reaction) | +0.09 ± 0.02 | +0.12 | +0.05 | 1.7 | minor |  |
| 173 | Floral Restoration | 8 | Class | druid | heals 4d8 (touch, 1/fight) | +0.08 ± 0.05 | +0.06 | +0.11 | 1.0 | no clear effect |  |
| 174 | Weapon Supremacy | 20 | Class | fighter | permanently quickened (always on) | +0.08 ± 0.06 | +0.01 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 175 | Olethros's Decree | 17 | Ancestry | — | save | +0.08 ± 0.04 | +0.15 | +0.02 | 1.0 | minor |  |
| 176 | Apocalyptic Visions | 18 | Class | — | save | +0.08 ± 0.06 | +0.11 | +0.05 | 1.0 | no clear effect |  |
| 177 | The Thousand Lashes of the Weeping Willow | 18 | Class | kineticist | inline save: 30-foot emanation, reflex, 10d8 slashing (DC 40) | +0.08 ± 0.07 | −0.07 | +0.24 | 4.2 | no clear effect |  |
| 178 | Taunting Strike | 2 | Class | guardian | Strike activity | +0.08 ± 0.03 | +0.14 | +0.02 | 2.1 | minor |  |
| 179 | Towering Size | 12 | Class | summoner | its eidolon Huge, reach 15 feet | +0.08 ± 0.09 | −0.10 | +0.25 | 0.0 | no clear effect | the AI never used it |
| 180 | Incredible Beastmaster Companion | 8 | Class | — | its animal companion incredible (against one mature) | +0.08 ± 0.04 | +0.13 | +0.02 | 0.0 | minor | the AI never used it |
| 181 | Incredible Reanimated Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.08 ± 0.04 | +0.13 | +0.02 | 0.0 | minor | the AI never used it |
| 182 | Behold My Creation! | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.08 ± 0.04 | +0.13 | +0.02 | 0.0 | minor | the AI never used it |
| 183 | Perfect Finisher | 14 | Class | swashbuckler | Strike activity | +0.08 ± 0.06 | +0.10 | +0.06 | 5.5 | no clear effect |  |
| 184 | Rend Armor | 8 | Class | — | effect | +0.08 ± 0.05 | +0.37 | −0.21 | 7.2 | no clear effect |  |
| 185 | Scintillating Spell | 16 | Class | sorcerer | Scintillating Spell copies of 13 spells | +0.08 ± 0.06 | −0.01 | +0.16 | 3.8 | no clear effect |  |
| 186 | Boundless Reprisals | 20 | Class | fighter | two more reactions each round, for reactive strike | +0.07 ± 0.03 | +0.00 | +0.15 | 0.0 | minor | the AI never used it |
| 187 | Promise of Pain | 10 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.06 | 1.0 | no clear effect |  |
| 188 | Twin Distraction | 4 | Class | rogue | Twin Feint (forced); both Strikes hit: a Will save or stupefied 1 | +0.07 ± 0.03 | +0.08 | +0.07 | 2.5 | minor | with two weapons (longsword and shortsword) |
| 189 | Psi Catastrophe | 12 | Class | psychic | inline save: 20-foot emanation, reflex, 12d6 bludgeoning (DC 31) | +0.07 ± 0.05 | +0.10 | +0.05 | 0.6 | no clear effect |  |
| 190 | Bleeding Finisher | 8 | Class | swashbuckler | Strike activity | +0.07 ± 0.04 | +0.11 | +0.04 | 4.2 | no clear effect |  |
| 191 | Phalanx Breaker | 6 | Class | gunslinger | Strike activity | +0.07 ± 0.08 | +0.15 | −0.01 | 4.4 | no clear effect |  |
| 192 | Spirit Companion | 4 | Class | — | its animal companion young (a bear, Commanded each turn) | +0.07 ± 0.05 | +0.03 | +0.12 | 0.0 | no clear effect | the AI never used it |
| 193 | Demon-Hunting Companion | 4 | Class | — | its companion young, the bear's numbers (Commanded each turn) | +0.07 ± 0.05 | +0.03 | +0.12 | 0.0 | no clear effect | the AI never used it |
| 194 | Death's Door | 14 | Class | — | 28 less of the damage that would drop it (once a fight) | +0.07 ± 0.02 | +0.11 | +0.03 | 0.2 | minor |  |
| 195 | Terrain Shield | 14 | Class | — | effect | +0.07 ± 0.02 | +0.11 | +0.03 | 0.4 | minor |  |
| 196 | Cry Havoc! | 0 | Action | commander | save | +0.07 ± 0.05 | +0.10 | +0.04 | 0.8 | no clear effect |  |
| 197 | Rain of Razors | 12 | Class | kineticist | save | +0.07 ± 0.07 | −0.04 | +0.19 | 1.6 | no clear effect |  |
| 198 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.07 ± 0.04 | +0.12 | +0.02 | 4.0 | no clear effect |  |
| 199 | Surgical Shock | 12 | Class | investigator | clumsy 2 on a foe that fails a fortitude save against its medicine DC 24 (once a fight) | +0.07 ± 0.05 | +0.02 | +0.12 | 1.0 | no clear effect |  |
| 200 | The Shattered Mountain Weeps | 18 | Class | kineticist | save | +0.07 ± 0.04 | −0.06 | +0.21 | 0.1 | no clear effect |  |
| 201 | Hymn of Healing | 1 | Class | bard | focus spell: Hymn of Healing (rank 1) | +0.07 ± 0.04 | +0.05 | +0.09 | 1.9 | no clear effect |  |
| 202 | Brutal Finish | 12 | Class | fighter | Strike activity | +0.07 ± 0.05 | +0.09 | +0.05 | 6.0 | no clear effect |  |
| 203 | Harbinger's Caw | 13 | Ancestry | — | an Effect on a foe | +0.07 ± 0.03 | +0.10 | +0.03 | 1.9 | no clear effect |  |
| 204 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.07 ± 0.07 | +0.09 | +0.05 | 4.9 | no clear effect | with two weapons (longsword and shortsword) |
| 205 | Acknowledge Fan | 12 | Class | — | save | +0.07 ± 0.05 | +0.09 | +0.04 | 3.0 | no clear effect |  |
| 206 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.06 ± 0.02 | +0.10 | +0.02 | 2.3 | minor | with a bow in hand |
| 207 | Ironblood Stance | 8 | Class | monk | PF2e's stance Effect | +0.06 ± 0.07 | +0.05 | +0.07 | 1.0 | no clear effect |  |
| 208 | Deimatic Display | 8 | Class | druid | Demoralize each enemy within 30 feet (Intimidation DC 20, once a fight) | +0.06 ± 0.06 | +0.06 | +0.07 | 1.0 | no clear effect |  |
| 209 | Precise Finisher | 6 | Class | swashbuckler | Confident Finisher's miss deals its full dice (always on) | +0.06 ± 0.02 | +0.11 | +0.02 | 0.0 | minor | the AI never used it |
| 210 | Blood and Spirit | 5 | Ancestry | — | passive effect (always on) | +0.06 ± 0.02 | +0.09 | +0.04 | 1.0 | minor | always on (its moment isn't checked) |
| 211 | Enchanting Shot | 8 | Class | — | Strike activity | +0.06 ± 0.06 | +0.13 | −0.00 | 3.2 | no clear effect |  |
| 212 | Boarding Assault | 0 | Action | — | Strike activity | +0.06 ± 0.03 | +0.03 | +0.09 | 1.6 | no clear effect |  |
| 213 | Blazing Aura | 17 | Ancestry | — | save | +0.06 ± 0.05 | +0.08 | +0.05 | 1.0 | no clear effect |  |
| 214 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.06 ± 0.02 | +0.06 | +0.07 | 0.0 | minor |  |
| 215 | Second Sting | 12 | Class | ranger | Strike activity | +0.06 ± 0.06 | +0.04 | +0.08 | 8.1 | no clear effect | with two weapons (longsword and shortsword) |
| 216 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | +0.06 ± 0.08 | +0.20 | −0.08 | 1.0 | no clear effect |  |
| 217 | Burn It! | 1 | Ancestry | — | PF2e rules (always on) | +0.06 ± 0.02 | +0.03 | +0.09 | 0.0 | minor | always on (its moment isn't checked) |
| 218 | Incredible Megafauna Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.06 ± 0.04 | +0.19 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 219 | Incredible Mount | 8 | Class | — | its animal companion incredible (against one mature) | +0.06 ± 0.04 | +0.19 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 220 | Incredible Dragon Companion | 8 | Class | — | its companion incredible, the bear's numbers (against one mature) | +0.06 ± 0.04 | +0.19 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 221 | Gruesome Strike | 12 | Class | champion | Strike activity (requirement assumed: Your Strikes currently deal extra damage from your champion's reaction) | +0.06 ± 0.06 | −0.09 | +0.21 | 15.1 | no clear effect |  |
| 222 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.06 ± 0.04 | +0.08 | +0.04 | 0.9 | no clear effect |  |
| 223 | Adamantine Body | 8 | Class | — | effect | +0.06 ± 0.02 | +0.12 | +0.00 | 1.6 | minor |  |
| 224 | Call Worm Spirit | 10 | Class | — | save | +0.06 ± 0.05 | +0.00 | +0.12 | 1.0 | no clear effect |  |
| 225 | Overflowing Blade | 0 | Action | — | Strike activity (requirement assumed: You are overflowing) | +0.06 ± 0.02 | +0.03 | +0.09 | 3.6 | minor |  |
| 226 | Subtle Shank | 8 | Class | rogue | Strike activity | +0.06 ± 0.06 | +0.19 | −0.08 | 4.4 | no clear effect |  |
| 227 | Clear as Air | 6 | Class | kineticist | check | +0.06 ± 0.09 | +0.19 | −0.08 | 2.6 | no clear effect |  |
| 228 | Penetrating Fire | 10 | Class | gunslinger | a Strike at up to 2 foes | +0.06 ± 0.03 | +0.00 | +0.12 | 2.9 | no clear effect |  |
| 229 | Cursed Effigy | 8 | Class | thaumaturge | an Effect on a foe | +0.06 ± 0.09 | +0.04 | +0.08 | 6.3 | no clear effect |  |
| 230 | Inviolable | 18 | Class | cleric | 3d6 spirit on each creature that hits it (always on) | +0.06 ± 0.03 | +0.08 | +0.04 | 2.2 | no clear effect |  |
| 231 | Guardian's Deflection (Fighter) | 6 | Class | fighter | +2 AC to an ally in reach as it's hit (reaction) | +0.06 ± 0.02 | +0.03 | +0.08 | 0.3 | minor | with a one-handed weapon and a free hand |
| 232 | Unkillable | 8 | Class | — | staying up at 0 Hit Points | +0.06 ± 0.03 | +0.10 | +0.01 | 0.0 | minor | the AI never used it |
| 233 | Close Contract | 10 | Class | — | effect (requirement assumed: You have completed your active course of action but haven't Dismissed it or chosen a new one) | +0.06 ± 0.04 | +0.10 | +0.01 | 2.0 | no clear effect |  |
| 234 | Ignite the Sun | 18 | Class | kineticist | save | +0.05 ± 0.07 | +0.07 | +0.04 | 5.2 | no clear effect |  |
| 235 | Reap the Field | 0 | Action | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.11 | 1.0 | minor |  |
| 236 | Bloody Debilitation | 12 | Class | rogue | Debilitating Strike's 3d6 persistent bleed in place of enfeebled 1 | +0.05 ± 0.05 | +0.01 | +0.10 | 0.0 | no clear effect | the AI never used it |
| 237 | Deadly Poison Weapon | 12 | Class | rogue | Poison Weapon with 4d4 poison (Poison Weapon with it) | +0.05 ± 0.06 | −0.01 | +0.12 | 0.0 | no clear effect | the AI never used it |
| 238 | Lethal Edge | 10 | Class | — | check | +0.05 ± 0.02 | +0.04 | +0.07 | 6.2 | minor |  |
| 239 | Rallying Anthem | 4 | Class | bard | innate spell: Rallying Anthem (rank 2) | +0.05 ± 0.04 | +0.08 | +0.03 | 11.8 | no clear effect |  |
| 240 | Tangled Forest Stance | 8 | Class | monk | PF2e's stance Effect | +0.05 ± 0.07 | +0.06 | +0.05 | 1.0 | no clear effect |  |
| 241 | Fortified Flesh | 8 | Class | — | resistance to physical damage (always on) | +0.05 ± 0.03 | +0.12 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 242 | Dual-Handed Assault | 4 | Class | fighter | a Strike with its weapon die a step bigger | +0.05 ± 0.04 | +0.05 | +0.05 | 3.4 | no clear effect | with a one-handed weapon and a free hand |
| 243 | Glacial Prison | 12 | Class | kineticist | save | +0.05 ± 0.09 | +0.05 | +0.05 | 3.0 | no clear effect |  |
| 244 | Can't Fall Here | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.01 | +0.07 | +0.04 | 0.1 | minor |  |
| 245 | Crop Protection | 4 | Class | — | reaction Strike (ally-attacked) | +0.05 ± 0.02 | +0.03 | +0.07 | 0.5 | minor |  |
| 246 | Opportune Opening | 10 | Class | — | reaction Strike on an ally's critical hit | +0.05 ± 0.02 | +0.07 | +0.03 | 0.6 | minor |  |
| 247 | Goblin Jubilee Display | 10 | Class | — | Goblin Jubilee: save | +0.05 ± 0.04 | +0.05 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 248 | Devastating Weaponry | 18 | Class | inventor | a Strike at each enemy within 30 feet (3 actions) | +0.05 ± 0.07 | +0.00 | +0.10 | 3.9 | no clear effect |  |
| 249 | Battle Harbinger Dedication | 2 | Class | — | Toughness: more maximum Hit Points | +0.05 ± 0.02 | +0.08 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 250 | Double Slice | 1 | Class | fighter | 2 Strikes | +0.05 ± 0.03 | −0.00 | +0.10 | 1.8 | no clear effect | with two weapons (longsword and shortsword) |
| 251 | Follow-Up Strike | 6 | Class | — | after a missed melee Strike, another at the same penalty | +0.05 ± 0.02 | +0.08 | +0.02 | 1.3 | no clear effect |  |
| 252 | Quickened Casting | 10 | Class | bard | Quickened Casting (once a fight) | +0.05 ± 0.04 | +0.11 | −0.01 | 1.0 | no clear effect |  |
| 253 | Dash of Herbs | 6 | Class | kineticist | impulse heal: 2d8+4 (30 feet) | +0.05 ± 0.08 | +0.16 | −0.06 | 3.3 | no clear effect |  |
| 254 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.05 ± 0.03 | +0.05 | +0.04 | 1.7 | no clear effect |  |
| 255 | Advanced General Training | 13 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.05 ± 0.03 | +0.03 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 256 | Gladiator Dedication | 2 | Class | — | passive effect (always on) | +0.05 ± 0.02 | +0.06 | +0.04 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 257 | Fleeting Arc through Heaven and Earth | 0 | Action | — | inline save: 60-foot cone, fortitude, 9d6 spirit (DC 17) | +0.05 ± 0.06 | −0.08 | +0.17 | 0.6 | no clear effect |  |
| 258 | Lastwall Sentry Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.05 ± 0.02 | +0.04 | +0.05 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 259 | Ferocity Mimicry | 4 | Class | — | staying up at 0 Hit Points | +0.05 ± 0.02 | +0.08 | +0.01 | 0.4 | no clear effect |  |
| 260 | Sly Striker | 8 | Class | rogue | precision damage on a hit (always on) | +0.05 ± 0.05 | +0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 261 | Black Powder Blaze | 8 | Class | — | Strike activity | +0.05 ± 0.03 | +0.00 | +0.09 | 2.1 | no clear effect | with a loaded arquebus |
| 262 | Frightening Indignation | 16 | Class | — | inline save: 15-foot emanation, will (DC 35, 1/fight) | +0.05 ± 0.03 | +0.02 | +0.07 | 0.2 | no clear effect |  |
| 263 | Improved Poison Weapon | 8 | Class | rogue | Poison Weapon with 2d4 poison (Poison Weapon with it) | +0.05 ± 0.05 | +0.13 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 264 | Caterwaul | 13 | Ancestry | — | keeping an ally up at 0 Hit Points | +0.05 ± 0.02 | +0.10 | −0.01 | 0.3 | no clear effect |  |
| 265 | Stonebound Dedication | 2 | Class | — | more maximum Hit Points | +0.04 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 266 | Mature Dragon Companion | 4 | Class | — | its companion mature, the bear's numbers (against one young) | +0.04 ± 0.03 | +0.09 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 267 | Impressive Mount | 4 | Class | — | its animal companion mature (against one young) | +0.04 ± 0.03 | +0.09 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 268 | Vicious Debilitations | 10 | Class | rogue | Debilitating Strike's clumsy 1 in place of enfeebled 1 | +0.04 ± 0.03 | +0.08 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 269 | Reverberating Spell | 10 | Class | — | Reverberating Spell copies of 6 spells | +0.04 ± 0.05 | +0.06 | +0.03 | 3.0 | no clear effect |  |
| 270 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.04 ± 0.03 | +0.10 | −0.01 | 1.8 | no clear effect |  |
| 271 | Auspicious Mount | 16 | Class | champion | its animal companion specialized (against one incredible) | +0.04 ± 0.05 | +0.10 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 272 | Impossible Technique | 20 | Class | monk | an enemy's hit rerolled lower, or a failed save rerolled (reaction) | +0.04 ± 0.02 | +0.04 | +0.05 | 0.3 | no clear effect |  |
| 273 | Titan Swing | 2 | Class | — | Strike activity | +0.04 ± 0.03 | +0.16 | −0.08 | 2.6 | no clear effect |  |
| 274 | Vengeance Strike | 6 | Class | — | reaction Strike (damaged-adjacent) | +0.04 ± 0.02 | +0.06 | +0.03 | 0.3 | no clear effect |  |
| 275 | Mature Animal Companion (Druid) | 4 | Class | druid | its animal companion mature (against one young) | +0.04 ± 0.05 | +0.10 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 276 | Fatal Bullet | 16 | Class | gunslinger | one more d12 on a firearm's critical hit (always on) | +0.04 ± 0.07 | +0.07 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 277 | Formation Training | 5 | Ancestry | — | passive effect (always on) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.9 | no clear effect | always on (its moment isn't checked) |
| 278 | Bastion Dedication | 2 | Class | — | Reactive Shield: Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.05 | +0.04 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 279 | Elemental Artillery | 6 | Class | kineticist | impulse attack: 3d12 piercing (120 feet, attack +12) | +0.04 ± 0.09 | +0.12 | −0.04 | 3.6 | no clear effect |  |
| 280 | Butterfly's Sting | 6 | Class | — | Sneak Attack 1d6 (always on) | +0.04 ± 0.03 | +0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 281 | Cleave | 6 | Class | barbarian | reaction Strike (downs) | +0.04 ± 0.02 | +0.00 | +0.08 | 0.7 | no clear effect |  |
| 282 | Brutal Critical | 18 | Class | barbarian | more on a critical hit (always on) | +0.04 ± 0.04 | +0.06 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 283 | Call the Hunt | 12 | Class | — | a foe in its reach off-guard to all until its next turn (1 action) | +0.04 ± 0.06 | +0.31 | −0.23 | 5.5 | no clear effect |  |
| 284 | Reactive Shield | 1 | Class | fighter | Raise a Shield against a melee hit (reaction) | +0.04 ± 0.02 | +0.04 | +0.04 | 0.2 | no clear effect | with a weapon and a shield |
| 285 | Automaton Armament | 1 | Ancestry | — | PF2e rules (always on) | +0.04 ± 0.04 | +0.00 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 286 | Multifarious Muse | 2 | Class | bard | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | +0.04 ± 0.04 | +0.13 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 287 | Murderer's Circle | 14 | Class | — | a Strike, then the target off-guard to the next one this turn | +0.04 ± 0.02 | +0.04 | +0.04 | 9.4 | no clear effect |  |
| 288 | Social Purview | 4 | Class | — | Gladiator Dedication: passive effect (always on) | +0.04 ± 0.02 | +0.02 | +0.06 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 289 | The World Devours | 12 | Class | — | save (requirement assumed: Your waking world is active) | +0.04 ± 0.04 | −0.06 | +0.14 | 1.6 | no clear effect |  |
| 290 | Terrifying Transformation | 8 | Class | — | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | +0.04 ± 0.05 | +0.08 | −0.00 | 1.0 | no clear effect |  |
| 291 | Set-Up Strike | 2 | Class | commander | Strike activity | +0.04 ± 0.05 | +0.11 | −0.03 | 2.6 | no clear effect |  |
| 292 | Paralyzing Slash | 8 | Class | — | Strike activity | +0.04 ± 0.06 | +0.06 | +0.01 | 6.3 | no clear effect |  |
| 293 | Draw From the Land | 10 | Class | — | check | +0.04 ± 0.02 | +0.11 | −0.03 | 0.3 | no clear effect |  |
| 294 | Champion's Reaction | 6 | Class | — | Retributive Strike (reaction) | +0.04 ± 0.01 | +0.04 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 295 | Think Twice | 14 | Class | fighter | ac-reaction | +0.04 ± 0.03 | +0.06 | +0.02 | 0.4 | no clear effect |  |
| 296 | Emotional Surge | 10 | Class | psychic | PF2e's self Effect | +0.04 ± 0.05 | +0.09 | −0.02 | 3.5 | no clear effect |  |
| 297 | Exude Demonic Corruption | 8 | Class | — | 1d6 poison on its melee Strikes and on who hits it, for a round | +0.04 ± 0.06 | +0.10 | −0.03 | 3.3 | no clear effect |  |
| 298 | Nudge the Scales | 1 | Class | oracle | heals 4 (30 feet) | +0.04 ± 0.04 | +0.04 | +0.03 | 2.8 | no clear effect |  |
| 299 | Heat Wave | 5 | Ancestry | — | check | +0.04 ± 0.03 | +0.03 | +0.05 | 1.0 | no clear effect |  |
| 300 | Resilient Shell | 14 | Class | summoner | its eidolon's resistance to physical damage | +0.04 ± 0.02 | +0.04 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 301 | Bullet Split | 8 | Class | gunslinger | 2 Strikes | +0.03 ± 0.08 | −0.02 | +0.09 | 4.4 | no clear effect |  |
| 302 | Fey Skin | 13 | Ancestry | — | more maximum Hit Points | +0.03 ± 0.01 | +0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 303 | Monk's Flurry | 10 | Class | — | Flurry of Blows: 2 Strikes | +0.03 ± 0.01 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 304 | Scion Transformation | 17 | Ancestry | — | PF2e rules (always on) | +0.03 ± 0.02 | +0.01 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 305 | Histrionic Injury | 5 | Ancestry | — | save | +0.03 ± 0.02 | +0.04 | +0.03 | 0.6 | no clear effect |  |
| 306 | Hell of 1,000,000 Needles | 18 | Class | kineticist | save | +0.03 ± 0.05 | +0.04 | +0.02 | 0.4 | no clear effect |  |
| 307 | Left-Hand Blood | 5 | Ancestry | — | effect | +0.03 ± 0.03 | +0.04 | +0.02 | 2.0 | no clear effect |  |
| 308 | Unbreaking Castle | 10 | Class | — | effect | +0.03 ± 0.05 | −0.03 | +0.09 | 6.0 | no clear effect | with a weapon and a shield |
| 309 | Dual-Weapon Blitz | 10 | Class | — | 2 Strikes | +0.03 ± 0.03 | +0.06 | +0.00 | 3.3 | no clear effect |  |
| 310 | Forewarn | 12 | Class | — | an ally's AC as its Perception DC against a hit, when higher (reaction) | +0.03 ± 0.02 | +0.00 | +0.07 | 0.6 | no clear effect |  |
| 311 | Battle Cry | 7 | Skill | — | a free Demoralize as the fight begins | +0.03 ± 0.04 | −0.00 | +0.07 | 1.0 | no clear effect |  |
| 312 | Savage Critical | 18 | Class | fighter | a natural 19 that hits is a critical hit | +0.03 ± 0.02 | +0.05 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 313 | Surprise Attack | 4 | Class | — | foes that haven't acted are off-guard to it the first round | +0.03 ± 0.01 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 314 | Farabellus Flip | 4 | Class | barbarian | +2 AC as a reaction when targeted (melee) | +0.03 ± 0.01 | +0.06 | +0.01 | 1.1 | no clear effect |  |
| 315 | Mature Megafauna Companion | 6 | Class | — | its companion mature, the bear's numbers (against one young) | +0.03 ± 0.04 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 316 | Crimson Breath | 12 | Class | — | inline save: 30-foot cone, reflex, 12d6 fire (DC 31, 1/fight) | +0.03 ± 0.04 | +0.03 | +0.03 | 0.9 | no clear effect |  |
| 317 | Reversing Charge | 8 | Class | — | Strike activity | +0.03 ± 0.02 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 318 | Whirlwind Strike | 14 | Class | barbarian | a Strike at each enemy in reach | +0.03 ± 0.04 | +0.00 | +0.06 | 1.5 | no clear effect |  |
| 319 | Dragon's Rage Breath | 6 | Class | barbarian | inline save: 30-foot cone, reflex, 6d6 fire (DC 22, 1/fight) | +0.03 ± 0.05 | +0.03 | +0.03 | 1.0 | no clear effect |  |
| 320 | Alchemical Shot | 4 | Class | gunslinger | a ranged Strike with a bomb's persistent damage (the bomb and the misfire not played) | +0.03 ± 0.08 | −0.03 | +0.09 | 3.1 | no clear effect |  |
| 321 | Gaping Flesh | 5 | Ancestry | — | save | +0.03 ± 0.02 | +0.03 | +0.03 | 0.6 | no clear effect |  |
| 322 | Martial Performance | 1 | Class | bard | innate spells: Courageous Anthem (rank 1), Rallying Anthem (rank 1), Song of Strength (rank 1) | +0.03 ± 0.03 | +0.06 | −0.00 | 2.7 | no clear effect |  |
| 323 | Impossible Striker | 20 | Class | rogue | full sneak attack at a creature that isn't off-guard (always on) | +0.03 ± 0.05 | +0.00 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 324 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.01 | +0.04 | +0.02 | 1.7 | no clear effect |  |
| 325 | Armored Counterattack | 12 | Class | guardian | a Strike back after its Intercept Attack, a Taunt on a hit (free) | +0.03 ± 0.02 | +0.05 | +0.01 | 0.5 | no clear effect |  |
| 326 | Negate Damage | 18 | Class | inventor | 15 less damage (reaction) | +0.03 ± 0.01 | +0.02 | +0.04 | 0.6 | no clear effect |  |
| 327 | Fiery Retort | 8 | Class | druid | 8 fire back at a melee attacker (reaction, once a fight) | +0.03 ± 0.02 | +0.05 | +0.01 | 1.3 | no clear effect |  |
| 328 | Head Stomp | 4 | Class | rogue | Strike activity | +0.03 ± 0.03 | +0.07 | −0.01 | 5.1 | no clear effect |  |
| 329 | Side by Side (Ranger) | 12 | Class | ranger | it and its companion flank a foe both are beside | +0.03 ± 0.03 | +0.04 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 330 | Pirate Dedication | 2 | Class | — | Boarding Assault: Strike activity | +0.03 ± 0.04 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 331 | Great Cleave | 10 | Class | barbarian | Cleave, going on while each Strike drops its creature (reaction) | +0.03 ± 0.01 | +0.00 | +0.06 | 0.6 | no clear effect |  |
| 332 | Armored Resistance | 8 | Class | — | PF2e rules (always on) | +0.03 ± 0.03 | +0.10 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 333 | Emergency Targe | 4 | Class | magus | +2 AC as a Strike hits (reaction) | +0.03 ± 0.02 | +0.05 | +0.01 | 0.1 | no clear effect | with a weapon and a shield |
| 334 | Megaton Strike | 4 | Class | inventor | Strike activity | +0.03 ± 0.10 | +0.10 | −0.05 | 7.8 | no clear effect |  |
| 335 | Sanguine Evasion | 18 | Class | rogue | staying up at 0 Hit Points | +0.03 ± 0.02 | +0.01 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 336 | Offensive Analysis | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 337 | Advanced Targeting System | 5 | Ancestry | — | innate spell: Sure Strike (rank 1) | +0.03 ± 0.02 | +0.01 | +0.05 | 1.0 | no clear effect |  |
| 338 | Debilitating Bomb | 6 | Class | alchemist | its bombs leave a hit foe off-guard until its next turn (always on) | +0.03 ± 0.02 | +0.01 | +0.05 | 0.7 | no clear effect |  |
| 339 | Coordinated Distraction | 12 | Class | rogue | check | +0.03 ± 0.06 | +0.19 | −0.14 | 5.0 | no clear effect |  |
| 340 | Barbarian Dedication | 2 | Class | — | Rage (+2 damage with its Greatsword) | +0.03 ± 0.04 | +0.13 | −0.07 | 1.0 | no clear effect |  |
| 341 | Calcifying Sand | 4 | Class | kineticist | save | +0.03 ± 0.03 | +0.06 | +0.00 | 0.2 | no clear effect |  |
| 342 | Pandemonium Eruption | 17 | Ancestry | — | inline save: 15-foot emanation, reflex, 14d6 acid (DC 37, 1/fight) | +0.03 ± 0.03 | +0.03 | +0.02 | 0.4 | no clear effect |  |
| 343 | Animal Companion (Ranger) | 1 | Class | ranger | its animal companion young (a bear, Commanded each turn) | +0.03 ± 0.06 | +0.21 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 344 | Hunting Snag | 10 | Class | — | reaction Strike (move, leave) | +0.03 ± 0.02 | −0.02 | +0.08 | 1.5 | no clear effect |  |
| 345 | Victorious Vigor | 5 | Ancestry | — | check | +0.03 ± 0.01 | +0.00 | +0.05 | 1.4 | no clear effect |  |
| 346 | Deliberate Death | 1 | Ancestry | — | a melee Strike at the foe that drops it (reaction, once) | +0.03 ± 0.01 | +0.06 | −0.00 | 0.2 | no clear effect |  |
| 347 | Shadow Sneak Attack | 10 | Class | — | Sneak Attack 1d6 (always on) | +0.03 ± 0.04 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Emotional Push | 2 | Class | bard | check | +0.03 ± 0.04 | +0.15 | −0.10 | 3.0 | no clear effect |  |
| 349 | Saving Slash | 10 | Class | — | a critical hit on it a hit on a DC 15 flat check (reaction) | +0.03 ± 0.02 | +0.06 | −0.01 | 0.1 | no clear effect |  |
| 350 | Gladiator's Roar | 12 | Class | — | inline save: 15-foot cone, fortitude, 6d10 sonic (DC 31, 1/fight) | +0.03 ± 0.04 | −0.05 | +0.10 | 0.8 | no clear effect |  |
| 351 | Annihilating Compound Invocation | 18 | Class | — | save | +0.03 ± 0.07 | +0.17 | −0.12 | 14.6 | no clear effect |  |
| 352 | Tactical Reflexes | 10 | Class | fighter | a second reaction each round, for Reactive Strike | +0.03 ± 0.02 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 353 | Point Blank Stance | 1 | Class | fighter | stance: +2 damage on its Strikes | +0.03 ± 0.03 | +0.01 | +0.04 | 1.0 | no clear effect | with a loaded arquebus |
| 354 | Absorb Strength | 5 | Ancestry | — | check | +0.03 ± 0.02 | +0.04 | +0.01 | 0.6 | no clear effect |  |
| 355 | Jotun's Battle Stance | 5 | Ancestry | — | a stance: reach 10 feet | +0.03 ± 0.03 | +0.02 | +0.03 | 1.0 | no clear effect |  |
| 356 | Stretching Reach | 5 | Ancestry | — | a stance: reach 10 feet | +0.03 ± 0.03 | +0.02 | +0.03 | 1.0 | no clear effect |  |
| 357 | Faith in the Fallen | 16 | Class | — | Spirit Sanctification: its text's self buff (FlatModifier saving-throw 1) | +0.03 ± 0.07 | +0.11 | −0.06 | 0.0 | no clear effect | the AI never used it |
| 358 | Final Spite | 8 | Class | — | save | +0.02 ± 0.02 | +0.05 | +0.00 | 0.5 | no clear effect |  |
| 359 | Incredible Initiative | 1 | General | — | PF2e rules (always on) | +0.02 ± 0.03 | +0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 360 | Heartless Debilitations | 10 | Class | rogue | Debilitating Strike's frightened 1 in place of enfeebled 1 | +0.02 ± 0.02 | +0.02 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 361 | Dazzling Dragonet Disappearance | 17 | Ancestry | — | check | +0.02 ± 0.01 | +0.04 | +0.01 | 0.1 | no clear effect |  |
| 362 | Swashbuckler's Riposte | 6 | Class | — | Opportune Riposte (reaction Strike on a critical miss) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.3 | no clear effect |  |
| 363 | Timely Dodge | 0 | Action | — | ac-reaction | +0.02 ± 0.02 | +0.01 | +0.04 | 1.3 | no clear effect |  |
| 364 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.02 ± 0.03 | +0.08 | −0.04 | 2.9 | no clear effect |  |
| 365 | Iomedae's Valor | 6 | Class | — | staying up at 0 Hit Points | +0.02 ± 0.01 | +0.05 | +0.00 | 0.1 | no clear effect |  |
| 366 | Nimble Strike | 10 | Class | rogue | Nimble Dodge, then a melee Strike at the attacker (reaction) | +0.02 ± 0.02 | +0.03 | +0.01 | 0.4 | no clear effect |  |
| 367 | Piercing Critical | 18 | Class | gunslinger | a natural 19 that hits with its gun is a critical hit | +0.02 ± 0.01 | +0.05 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 368 | Pack Attack | 6 | Class | — | strike-extra | +0.02 ± 0.04 | +0.00 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 369 | Basic Kata | 4 | Class | — | Crushing Grab: Strength damage on a successful Grapple (always on) | +0.02 ± 0.01 | +0.02 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 370 | Jotun's Heart | 17 | Ancestry | — | more maximum Hit Points | +0.02 ± 0.00 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 371 | Vexing Tumble | 6 | Class | swashbuckler | check | +0.02 ± 0.03 | +0.05 | −0.00 | 2.7 | no clear effect |  |
| 372 | Stunning Finisher | 8 | Class | swashbuckler | Strike activity | +0.02 ± 0.05 | +0.01 | +0.03 | 5.8 | no clear effect |  |
| 373 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.03 | +0.00 | +0.04 | 0.7 | no clear effect |  |
| 374 | Inked Panoply | 4 | Class | — | +1 AC as a reaction when targeted | +0.02 ± 0.02 | +0.02 | +0.03 | 2.4 | no clear effect |  |
| 375 | United Assault | 2 | Class | fighter | a flourish Strike, +1 damage for each other creature that hurt the target since its last turn (up to +4) | +0.02 ± 0.01 | +0.02 | +0.02 | 2.4 | no clear effect |  |
| 376 | Swiping Trace | 8 | Class | — | a Strike at up to 2 foes | +0.02 ± 0.04 | +0.00 | +0.04 | 1.4 | no clear effect |  |
| 377 | General Training | 1 | Ancestry | — | Incredible Initiative: PF2e rules (always on) | +0.02 ± 0.03 | +0.01 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 378 | Hunter's Aim | 2 | Class | ranger | Strike activity | +0.02 ± 0.05 | +0.10 | −0.06 | 4.2 | no clear effect |  |
| 379 | Feral Mending | 8 | Class | — | check | +0.02 ± 0.03 | +0.03 | +0.02 | 0.2 | no clear effect |  |
| 380 | Disorienting Opening | 8 | Class | fighter | off-guard after its Reactive Strike hits (always on) | +0.02 ± 0.03 | +0.02 | +0.02 | 1.4 | no clear effect |  |
| 381 | Defender's Grit | 4 | Class | — | passive effect (always on) | +0.02 ± 0.02 | +0.02 | +0.02 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 382 | Shield Wallop | 8 | Class | guardian | a flourish Strike, stupefied 1 (2 on a critical hit) until its next turn | +0.02 ± 0.02 | +0.06 | −0.01 | 4.2 | no clear effect |  |
| 383 | Too Angry to Die | 12 | Skill | — | check | +0.02 ± 0.05 | +0.18 | −0.14 | 3.7 | no clear effect |  |
| 384 | Primal Howl | 10 | Class | druid | its companion's Primal Howl (30-foot cone, fortitude, 5d6 sonic (DC 29, 1/fight)) | +0.02 ± 0.03 | +0.04 | −0.00 | 0.8 | no clear effect |  |
| 385 | Into the Sky | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 386 | Fully Flighted | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 387 | True Dragon's Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 388 | Full Flight | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 389 | Soaring Form | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 390 | Hero's Wings | 9 | Ancestry | — | PF2e rules (always on) | +0.02 ± 0.02 | −0.00 | +0.04 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 391 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.02 ± 0.02 | +0.00 | +0.04 | 1.7 | no clear effect |  |
| 392 | Mountain Quake | 14 | Class | monk | save (in Mountain Stance) | +0.02 ± 0.04 | +0.02 | +0.02 | 0.2 | no clear effect |  |
| 393 | Torrent in the Blood | 6 | Class | kineticist | check | +0.02 ± 0.08 | +0.21 | −0.17 | 3.0 | no clear effect |  |
| 394 | Feral Lunge | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | +0.02 ± 0.04 | +0.06 | −0.02 | 2.2 | no clear effect |  |
| 395 | Call Hellfire | 8 | Class | — | inline save: 10-foot emanation, reflex, 6d6 fire (DC 24, 1/fight) | +0.02 ± 0.04 | +0.03 | +0.01 | 0.7 | no clear effect |  |
| 396 | All Shall End in Flames | 18 | Class | kineticist | save | +0.02 ± 0.05 | +0.01 | +0.03 | 0.8 | no clear effect |  |
| 397 | Looming Gait | 5 | Ancestry | — | Strike activity | +0.02 ± 0.01 | +0.00 | +0.04 | 0.8 | no clear effect |  |
| 398 | Golem Grafter Dedication | 8 | Class | — | more maximum Hit Points | +0.02 ± 0.01 | +0.03 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 399 | Bear Hug | 6 | Class | — | Strike activity | +0.02 ± 0.02 | +0.03 | +0.01 | 2.5 | no clear effect |  |
| 400 | Precise Debilitations | 10 | Class | rogue | Debilitating Strike's off-guard in place of enfeebled 1 | +0.02 ± 0.03 | +0.05 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 401 | Take in the Catch | 12 | Class | — | Strike activity (requirement assumed: You're holding a net) | +0.02 ± 0.06 | +0.14 | −0.10 | 3.6 | no clear effect |  |
| 402 | Scout's Warning | 4 | Class | ranger | +1 initiative to its allies (free action) | +0.02 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 403 | Wave the Flag | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Force of Nature | 16 | Class | — | fast-healing | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect |  |
| 405 | Stand Firm | 16 | Class | — | check | +0.02 ± 0.02 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Flow of War | 6 | Class | exemplar | check | +0.02 ± 0.04 | +0.04 | −0.01 | 1.0 | no clear effect |  |
| 407 | Sticky Bomb | 8 | Class | alchemist | its bombs' splash as persistent damage on a hit (always on) | +0.02 ± 0.04 | +0.04 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 408 | Rearing Display | 12 | Class | — | its mount's Strike, a hit followed by a Demoralize | +0.02 ± 0.04 | +0.03 | +0.01 | 14.3 | no clear effect |  |
| 409 | Lucky Escape | 4 | Class | — | an Effect on a foe | +0.02 ± 0.05 | −0.03 | +0.07 | 2.0 | no clear effect |  |
| 410 | Crushing Grab | 2 | Class | monk | Strength damage on a successful Grapple (always on) | +0.02 ± 0.01 | +0.00 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 411 | Furious Vengeance | 16 | Class | barbarian | reaction Strike (critical-hit) | +0.02 ± 0.02 | +0.02 | +0.02 | 0.3 | no clear effect |  |
| 412 | Nature's Precision | 6 | Class | — | its companion's agile Strikes +1d4 precision against an off-guard foe | +0.02 ± 0.02 | +0.05 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 413 | Slowing Strike | 12 | Class | — | save | +0.02 ± 0.06 | −0.02 | +0.05 | 11.3 | no clear effect |  |
| 414 | Communal Healing | 2 | Class | cleric | each single-target heal heals the most hurt other ally by its rank | +0.02 ± 0.01 | +0.03 | +0.00 | 0.3 | no clear effect |  |
| 415 | Cat Nap | 1 | Ancestry | — | passive effect (always on) | +0.02 ± 0.01 | +0.02 | +0.02 | 0.8 | no clear effect | always on (its moment isn't checked) |
| 416 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.02 | +0.08 | −0.05 | 0.2 | no clear effect |  |
| 417 | Repel Assault | 6 | Class | — | resistance equal to its level against a big hit, 3 a fight | +0.02 ± 0.02 | +0.05 | −0.01 | 0.6 | no clear effect |  |
| 418 | Stitching Strike | 0 | Action | — | inline save: 1 creature, 30 feet, reflex, 6d6 slashing (DC 17, 1/fight) | +0.02 ± 0.05 | +0.01 | +0.02 | 1.0 | no clear effect |  |
| 419 | Dual Finisher | 8 | Class | swashbuckler | 2 Strikes | +0.02 ± 0.04 | −0.06 | +0.09 | 7.7 | no clear effect | with two weapons (longsword and shortsword) |
| 420 | Envenom Fangs | 5 | Ancestry | — | 1d6 persistent poison on its next hit (1 action, once a fight) | +0.02 ± 0.02 | −0.00 | +0.04 | 1.0 | no clear effect |  |
| 421 | Aldori Riposte | 6 | Class | — | a riposte Strike on a critical miss (reaction) | +0.02 ± 0.02 | +0.02 | +0.01 | 0.4 | no clear effect |  |
| 422 | Jalmeri Heavenseeker Dedication | 4 | Class | — | Rain of Embers Stance: PF2e's stance Effect | +0.01 ± 0.01 | +0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 423 | Shed Spirit | 0 | Action | — | inline save: 1 creature, 20 feet, will, 6d6 spirit (DC 17, 1/fight) | +0.01 ± 0.05 | +0.00 | +0.03 | 1.0 | no clear effect |  |
| 424 | Quick Reversal | 4 | Class | fighter | 2 Strikes | +0.01 ± 0.02 | +0.00 | +0.03 | 0.7 | no clear effect |  |
| 425 | Dueling Riposte | 8 | Class | fighter | reaction Strike (critical-miss) (in Dueling Parry) | +0.01 ± 0.01 | +0.03 | +0.00 | 0.1 | no clear effect |  |
| 426 | Lingering Composition | 1 | Class | bard | Courageous Anthem for 3 rounds, the PC and its allies within 60 feet (once a fight) | +0.01 ± 0.01 | +0.02 | +0.00 | 4.8 | no clear effect |  |
| 427 | Renewing Cycle | 10 | Class | — | passive effect (always on) | +0.01 ± 0.01 | +0.03 | −0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 428 | Exploit Opening | 6 | Class | — | a ranged Strike (+2) when an ally critically hits (reaction) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.5 | no clear effect |  |
| 429 | Stone Body | 16 | Class | — | effect (in Tenacious Stance) | +0.01 ± 0.02 | −0.01 | +0.04 | 0.5 | no clear effect |  |
| 430 | Psi Burst | 2 | Class | psychic | save | +0.01 ± 0.04 | +0.02 | +0.00 | 5.8 | no clear effect |  |
| 431 | Divine Healing | 8 | Class | — | focus spell: Lay on Hands (rank 4) | +0.01 ± 0.03 | +0.12 | −0.09 | 0.8 | no clear effect |  |
| 432 | Defensive Advance | 1 | Class | champion | Strike activity | +0.01 ± 0.02 | +0.00 | +0.03 | 0.9 | no clear effect |  |
| 433 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.01 ± 0.04 | +0.01 | +0.02 | 1.3 | no clear effect |  |
| 434 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.01 ± 0.02 | +0.05 | −0.02 | 11.5 | no clear effect | with a one-handed weapon and a free hand |
| 435 | Side by Side (Druid) | 10 | Class | druid | it and its companion flank a foe both are beside | +0.01 ± 0.02 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 436 | Inscribed Blast | 5 | Ancestry | — | check | +0.01 ± 0.02 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 437 | Basic Devotion | 4 | Class | — | Defensive Advance: Strike activity | +0.01 ± 0.03 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 438 | You're Next | 1 | Class | rogue | downing a foe: a Demoralize at another, +2 (reaction) | +0.01 ± 0.02 | +0.00 | +0.02 | 1.8 | no clear effect |  |
| 439 | Devout Blessing | 6 | Class | — | Blessed Swiftness: PF2e rules (always on) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 440 | Defend Mount | 6 | Class | — | a Strike at its mount taken on its own AC instead (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 7.9 | no clear effect |  |
| 441 | Oracular Warning | 1 | Class | oracle | +2 initiative to allies within 20 feet | +0.01 ± 0.05 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 442 | Twin Takedown | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.05 | +0.02 | +0.00 | 1.6 | no clear effect | with two weapons (longsword and shortsword) |
| 443 | Benefactor's Strike | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.03 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 444 | Piston Punch | 6 | Class | — | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 1.0 | no clear effect |  |
| 445 | Swipe | 4 | Class | barbarian | a Strike at up to 2 foes | +0.01 ± 0.02 | +0.00 | +0.02 | 0.8 | no clear effect |  |
| 446 | Vicious Swing | 1 | Class | fighter | Strike activity | +0.01 ± 0.04 | +0.02 | −0.00 | 3.5 | no clear effect |  |
| 447 | High-Speed Regeneration | 6 | Class | — | check | +0.01 ± 0.01 | +0.03 | −0.01 | 2.5 | no clear effect |  |
| 448 | Sea Swarmer | 9 | Ancestry | — | a foe in its reach and two allies' reach is off-guard to it | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 449 | Black Cat Curse | 13 | Ancestry | — | a foe's successful save rerolled, the worse kept (reaction, once a fight) | +0.01 ± 0.03 | +0.02 | +0.00 | 0.9 | no clear effect |  |
| 450 | Leading Dance | 4 | Class | swashbuckler | check | +0.01 ± 0.05 | +0.25 | −0.23 | 5.8 | no clear effect |  |
| 451 | Dashing Pounce | 4 | Class | — | 2 Strikes | +0.01 ± 0.01 | −0.00 | +0.02 | 2.3 | no clear effect |  |
| 452 | Vessel's Form | 16 | Class | — | check | +0.01 ± 0.03 | +0.05 | −0.03 | 0.2 | no clear effect |  |
| 453 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.01 ± 0.02 | −0.00 | +0.02 | 0.6 | no clear effect |  |
| 454 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.02 | +0.01 | +0.01 | 1.7 | no clear effect |  |
| 455 | Gods' Palm | 8 | Class | — | Strike activity | +0.01 ± 0.02 | +0.04 | −0.02 | 3.2 | no clear effect |  |
| 456 | Enlarged Chassis | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.07 | −0.05 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 457 | Restore the Mind | 0 | Action | psychic | heals 4 (30 feet) | +0.01 ± 0.03 | −0.01 | +0.03 | 2.6 | no clear effect |  |
| 458 | Absolve Sins | 16 | Class | — | inline save: 30-foot emanation, will, 14d6 mental (DC 35) | +0.01 ± 0.03 | −0.02 | +0.03 | 0.6 | no clear effect |  |
| 459 | Reflective Ripple Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 460 | Twisting Petal Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.05 | −0.03 | 1.0 | no clear effect |  |
| 461 | Heaven's Thunder | 6 | Class | — | +2 electricity and +2 sonic on its melee Strikes (1 action) | +0.01 ± 0.04 | −0.05 | +0.07 | 1.4 | no clear effect |  |
| 462 | Pit of Snakes | 13 | Ancestry | — | save | +0.01 ± 0.02 | +0.02 | −0.00 | 0.6 | no clear effect |  |
| 463 | It Was Me All Along! | 14 | Class | — | check | +0.01 ± 0.04 | +0.11 | −0.09 | 1.0 | no clear effect |  |
| 464 | Premonition of Avoidance | 1 | Class | cleric | self effect | +0.01 ± 0.01 | +0.02 | +0.00 | 1.7 | no clear effect |  |
| 465 | Levering Strike | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.04 | −0.02 | 2.4 | no clear effect |  |
| 466 | Unseat | 10 | Class | — | Strike activity (requirement assumed: You are riding your mount and wielding a jousting weapon) | +0.01 ± 0.02 | +0.03 | −0.01 | 5.3 | no clear effect |  |
| 467 | Instant Recovery | 0 | Action | — | healing | +0.01 ± 0.03 | +0.02 | −0.01 | 0.8 | no clear effect |  |
| 468 | Divine Dragonblood | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 469 | Demon Slayer | 17 | Ancestry | — | inline save: 30-foot emanation, fortitude, 10d6 spirit (DC 37, 1/fight) | +0.01 ± 0.01 | −0.01 | +0.02 | 0.4 | no clear effect |  |
| 470 | Second Blessing | 8 | Class | champion | Blessed Swiftness: PF2e rules (always on) | +0.01 ± 0.02 | −0.01 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 471 | Sidestep | 8 | Class | rogue | a missed Strike redirected (reaction) | +0.01 ± 0.01 | +0.00 | +0.02 | 0.2 | no clear effect |  |
| 472 | Life's Blood | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 473 | Mineral Deposits | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 474 | Mask of Pain | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 475 | Wings of Air | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 476 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Pollinate | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 478 | Rakshasa Ravaged | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 479 | Shadow Sight | 9 | Ancestry | — | effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 480 | Scorching Disarm | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 481 | Bolstered Recovery | 16 | Class | — | Instant Recovery: healing | +0.01 ± 0.02 | −0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 482 | I Will Return | 9 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 483 | Avalanche Strike | 16 | Class | — | a Strike at each enemy in reach | +0.01 ± 0.03 | +0.00 | +0.01 | 1.4 | no clear effect |  |
| 484 | Morphic Strike | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 485 | My Claws are Daggers | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 486 | Ferrousoul | 1 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 487 | Equitable Defense | 8 | Class | — | resistance against a critical hit (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 488 | Hardened Chassis | 5 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 489 | Inner Fire (Monk) | 6 | Class | monk | cold and fire resistance and fire on who hits it (in Stoked Flame Stance) | +0.01 ± 0.01 | +0.00 | +0.01 | 1.2 | no clear effect |  |
| 490 | Wolf Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 491 | Tiger Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.04 | +0.06 | −0.05 | 1.1 | no clear effect |  |
| 492 | Shadow's Web | 14 | Class | monk | innate spell: Shadow's Web (rank 7) | +0.01 ± 0.03 | +0.03 | −0.01 | 0.2 | no clear effect |  |
| 493 | Grand Medic's Mask | 20 | Class | druid | PF2e rules (always on) | +0.01 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 494 | Guardian's Intercept | 6 | Class | — | Intercept Attack, once a fight (reaction) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 495 | Perfect Ki Expert | 10 | Class | — | innate spells: Unblinking Flame Aura (rank 5), Unbreaking Wave Vapor (rank 5), Unfolding Wind Buffet (rank 5), Untwisting Iron Roots (rank 5) | +0.01 ± 0.03 | +0.07 | −0.06 | 0.7 | no clear effect |  |
| 496 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.03 | +0.03 | −0.02 | 0.3 | no clear effect |  |
| 497 | Rain of Embers Stance | 1 | Class | monk | PF2e's stance Effect | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 498 | Whirlwind Stance | 10 | Class | — | effect | +0.01 ± 0.04 | +0.04 | −0.03 | 2.0 | no clear effect |  |
| 499 | Breath of Hungry Death | 16 | Class | — | save | +0.01 ± 0.04 | −0.01 | +0.03 | 0.9 | no clear effect |  |
| 500 | The Harder They Fall (Kingmaker) | 8 | Class | ranger | bludgeoning damage on a successful Trip (always on) | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 501 | Agonizing Rebuke | 5 | Ancestry | — | mental damage on a successful Demoralize (always on; once, not each turn) | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 502 | Scars of Steel | 4 | Class | barbarian | resistance against a critical hit (reaction) | +0.01 ± 0.00 | +0.01 | +0.01 | 0.3 | no clear effect |  |
| 503 | Envenomed Edge | 13 | Ancestry | — | PF2e rules (always on) | +0.01 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 504 | Jelly Body | 6 | Class | — | PF2e rules (always on) | +0.01 ± 0.01 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 505 | Tandem Strike | 6 | Class | summoner | its Strike and its eidolon's (two of their three actions) | +0.01 ± 0.08 | +0.05 | −0.04 | 4.2 | no clear effect |  |
| 506 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.01 ± 0.04 | +0.00 | +0.01 | 1.7 | no clear effect |  |
| 507 | Stasian Smash | 8 | Class | — | Strike activity | +0.01 ± 0.05 | +0.07 | −0.06 | 3.3 | no clear effect |  |
| 508 | Frightful Aura | 18 | Class | — | an aura: each enemy within 15 feet saves (will, DC 38) or is frightened as the fight starts | +0.01 ± 0.07 | −0.04 | +0.05 | 1.0 | no clear effect |  |
| 509 | Driving Rain | 6 | Class | kineticist | save | +0.01 ± 0.09 | +0.08 | −0.07 | 4.1 | no clear effect |  |
| 510 | Pact of the Final Breath | 12 | Class | — | passive effect (always on) | +0.01 ± 0.00 | +0.00 | +0.01 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 511 | Icy Apotheosis | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 512 | Dive of the Divine | 16 | Class | — | save (requirement assumed: You are at least 20 feet above the ground) | +0.00 ± 0.03 | −0.00 | +0.01 | 0.5 | no clear effect |  |
| 513 | Arcane Fists | 1 | Class | magus | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 514 | Combat Grab | 2 | Class | fighter | a press Strike that grabs on a hit | +0.00 ± 0.02 | +0.01 | −0.00 | 3.3 | no clear effect | with a one-handed weapon and a free hand |
| 515 | Basic Death Dealing | 4 | Class | — | Deathly Scream: innate spell: Deathly Scream (rank 1) | +0.00 ± 0.04 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 516 | Kaleidoscopic Entreaty | 8 | Class | — | inline save: 10-foot emanation, fortitude (DC 26) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 517 | Raise Island | 8 | Class | exemplar | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 518 | Rubbery Skin | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 519 | Scout's Speed | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 520 | Scattering in Spring | 8 | Class | monk | +2 AC as a reaction when targeted (melee) (in Twisting Petal Stance) | +0.00 ± 0.01 | +0.02 | −0.01 | 0.3 | no clear effect |  |
| 521 | Mountain's Stoutness | 9 | Ancestry | — | more maximum Hit Points | +0.00 ± 0.03 | +0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 522 | Imposing Destrier | 10 | Class | champion | its animal companion incredible (against one mature) | +0.00 ± 0.04 | −0.07 | +0.08 | 0.0 | no clear effect | the AI never used it |
| 523 | Rocky Flesh | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.02 | +0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 524 | Siege Celerity | 6 | Class | — | check | +0.00 ± 0.03 | −0.05 | +0.06 | 2.4 | no clear effect |  |
| 525 | Crane Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.06 | −0.06 | 1.0 | no clear effect |  |
| 526 | Diamond Soul | 12 | Class | monk | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 527 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.01 | +0.00 | +0.01 | 0.6 | no clear effect |  |
| 528 | Everstand Strike | 4 | Class | champion | a press Strike, its shield raised if it hits | +0.00 ± 0.04 | −0.04 | +0.05 | 4.8 | no clear effect |  |
| 529 | Start the Festival! | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 530 | Call the Swarm | 17 | Ancestry | — | check | +0.00 ± 0.03 | +0.04 | −0.04 | 0.5 | no clear effect |  |
| 531 | Stumbling Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.09 | −0.09 | 1.1 | no clear effect |  |
| 532 | Divine Weapon | 6 | Class | cleric | +1d4 spirit on its Strikes after a slot spell (free) | +0.00 ± 0.02 | −0.01 | +0.02 | 2.1 | no clear effect |  |
| 533 | Divine Countermeasures | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 534 | Jellyfish Stance | 8 | Class | monk | PF2e's stance Effect | +0.00 ± 0.06 | −0.02 | +0.02 | 1.0 | no clear effect |  |
| 535 | Cornered Fury | 5 | Ancestry | — | a larger foe that critically hits it (a Small ratfolk: a Medium foe) is off-guard to it for a round | +0.00 ± 0.00 | +0.00 | +0.01 | 0.3 | no clear effect |  |
| 536 | Blast Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 537 | It's Not Over | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 538 | Fearsome Brute | 10 | Class | fighter | damage of twice a foe's frightened (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 539 | Inured to the Heat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 540 | Clang! | 16 | Class | guardian | a reaction Strike on a critical miss | +0.00 ± 0.01 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 541 | World-Breaking Footfall | 14 | Class | monk | save (requirement assumed: You are in Kaiju Stance and are touching the ground) | +0.00 ± 0.03 | +0.01 | −0.01 | 0.6 | no clear effect |  |
| 542 | Ceremony of the Evened Hand | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 543 | Bestial Manifestation | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 544 | Tooth and Claw | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 545 | Retractable Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 546 | Made for Combat | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 547 | Lavasoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 548 | Iron Fists | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 549 | Hag Claws | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 550 | Draconic Aspect | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 551 | Living Weapon | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 552 | Nimble Dodge | 1 | Class | rogue | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 553 | Wave Dashes Rocks | 10 | Class | monk | Strike activity | +0.00 ± 0.00 | +0.00 | −0.00 | 0.2 | no clear effect |  |
| 554 | Wounded Rage | 4 | Class | barbarian | Rage as a reaction when it takes damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 555 | Zealous Inevitability | 6 | Class | — | Strike activity | +0.00 ± 0.01 | +0.00 | +0.00 | 2.3 | no clear effect |  |
| 556 | Call of Elysium | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 557 | Rebirth in Living Stone | 18 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.05 | +0.02 | −0.02 | 1.0 | no clear effect |  |
| 558 | Brutal Bully | 6 | Class | barbarian | Strength damage on a successful maneuver (always on; raging not checked) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 559 | Necromantic Heir | 17 | Ancestry | — | innate spell: Harm (rank 6) | +0.00 ± 0.05 | −0.01 | +0.01 | 1.0 | no clear effect |  |
| 560 | Hungry Goblin | 9 | Ancestry | — | passive effect (always on) | +0.00 ± 0.03 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 561 | Aura of Vengeance | 14 | Class | champion | allies' reaction Strikes at −2 with its Retributive Strike (its Exalt with it) | +0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 562 | Spell-Repelling Form | 14 | Class | summoner | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 563 | Call From Death's Door | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 564 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 565 | Bat Form | 10 | Class | — | casts Pest Form (rank 4, DC 27, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 566 | Fluttering Distraction | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 567 | Quicken Heartbeat | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 568 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 569 | You Failed to Account For... This! | 16 | Class | inventor | its Crafting DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.01 | +0.01 | −0.00 | 0.5 | no clear effect |  |
| 570 | Constant Gaze | 9 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 571 | Stoked Flame Stance | 1 | Class | monk | PF2e's stance Effect | +0.00 ± 0.04 | +0.07 | −0.07 | 1.1 | no clear effect |  |
| 572 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 573 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 574 | Bone Spikes | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 575 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 576 | Eerie Flicker | 2 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 577 | Living Nexus Dedication | 2 | Class | — | Absorb Magic: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 578 | Dragon Disciple Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 579 | Foresee Danger | 12 | Class | investigator | its Perception DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 580 | Consume Power | 6 | Class | kineticist | resistance its level to acid, electricity, fire or sonic damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.3 | no clear effect |  |
| 581 | Shoulder Check | 1 | Class | guardian | Strike activity | +0.00 ± 0.02 | +0.00 | +0.00 | 3.6 | no clear effect |  |
| 582 | Minor Omen | 8 | Class | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 583 | Nephilim Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 584 | Verbose Distraction | 6 | Class | — | +2 AC as a reaction when targeted (melee) | +0.00 ± 0.02 | +0.02 | −0.02 | 0.8 | no clear effect |  |
| 585 | Deflecting Wave | 1 | Class | kineticist | resistance 1 to an enemy's acid, bludgeoning, fire or slashing damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 586 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 587 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 588 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 589 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 590 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 591 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 592 | Upstage | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 593 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 594 | Fated Not to Die | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 595 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 596 | Restorative Teleportation | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 597 | Disarming Interception | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 598 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 599 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 600 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 601 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 602 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 603 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 604 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 605 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 606 | Seething Frenzy | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 607 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 608 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 609 | Overawe Crowd | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 610 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 611 | Inflict Punishment | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 612 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 613 | My Legend Must Be Told | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 614 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 615 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 616 | Sorshen's Devotion | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 617 | Inspired Stratagem | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 618 | Undaunted | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 619 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 620 | Coral Symbiotes | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 621 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 622 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 623 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 624 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 625 | Hard to Fool | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 626 | Devil's Advocate | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 627 | Breath Control | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 628 | Forlorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 629 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 630 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 631 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 632 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 633 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 634 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 635 | Emotionless | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 636 | Fey Fellowship | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 637 | Lawbringer | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 638 | Adhyabhau | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 639 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 640 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 641 | Draconic Sycophant | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 642 | Goloma Courage | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 643 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 644 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 645 | Brightsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 646 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 647 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 648 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 649 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 650 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 651 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 652 | Emberkin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 653 | Keen Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 654 | Stone Face | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 655 | Emotional Partitions | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 656 | Never! | 16 | Class | guardian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 657 | Anthemic Performance | 8 | Class | — | innate spell: Courageous Anthem (rank 4) | +0.00 ± 0.03 | −0.02 | +0.02 | 3.3 | no clear effect |  |
| 658 | Sneak Attacker | 4 | Class | — | Sneak Attack (always on) | +0.00 ± 0.01 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 659 | Reflexive Courage | 8 | Class | bard | a Reactive Strike while Courageous Anthem is on it | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 660 | Dormant Eruption | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 661 | Bound in Ice | 16 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 662 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 663 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 664 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 665 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 666 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 667 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 668 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 669 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 670 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 671 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 672 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 673 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 674 | Crown of the Saumen Kar | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 675 | Sprite's Spark | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 676 | Hard Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 677 | Powerful Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 678 | Draconic Scent | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 679 | Fiend Worshipper | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 680 | Angel of Death | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 681 | Caustic Nectar | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 682 | Celestial Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 683 | Venom Spit | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 684 | Fiendish Arms | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 685 | Smashing Tail | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 686 | Fiend Eternal | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 687 | Celestial Rebirth | 20 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 688 | Saber Teeth | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 689 | Energy Beam | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 690 | Puncturing Horn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 691 | Hidden Thorn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 692 | Spine Stabber | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 693 | Battering Wings | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 694 | Ghost Hunter | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 695 | Seedpod | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 696 | Ghoul Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 697 | Fiendish Strikes | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 698 | Nimble Hooves | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 699 | Sterling Dynamo Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 700 | Fang Sharpener | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 701 | Resist Ruin | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 702 | Vampire Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 703 | Lifeblood's Call | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 704 | Web Hunter | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 705 | Petrified Skin | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 706 | Sensitive Nose | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 707 | Nimble Elf | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 708 | Eternal Blessing | 16 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 709 | Wide Overwatch | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 710 | Spirit Coffin | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 711 | Swift | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 712 | Strix Defender | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 713 | Thlipit Contestant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 714 | Spirit Warrior Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 715 | Tusks (Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 716 | Hand of the Lich | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 717 | Sacred Armaments | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 718 | Marshal Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 719 | Razorsharp Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 720 | Iruxi Spirit Strike | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 721 | You Don't Smell Right | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 722 | Coating of Slime | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 723 | Foxfire | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 724 | Bloodsense | 7 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 725 | Ghost Eater Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 726 | Quietus Strikes | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 727 | Iron Belly | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 728 | Overwatch Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 729 | Accursed Clay Fist | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 730 | Scalding Spit | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 731 | Fleet | 1 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 732 | Draconic Scent (Dragon Disciple) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 733 | Ocean's Bite | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 734 | Favor of Heaven | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 735 | Tusks (Half-Orc) | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 736 | Dragonet Immunities | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 737 | Undying Conviction | 4 | Class | cleric | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 738 | Slag May | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 739 | Fangs | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 740 | Predatory Claws | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 741 | Martial Artist Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 742 | Monstrous Peacemaker | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 743 | Eyes of Night (Midnight Illusionist) | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 744 | Sanguine Tenacity | 11 | General | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 745 | Sacred Weapon | 18 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 746 | The Dead Tell Tales | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 747 | Wormskin | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 748 | Battle Scars | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 749 | Rampaging Ferocity | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 750 | Nothing but Fluff | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 751 | Werecreature Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 752 | Animal Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 753 | Pactbound Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 754 | Worm Sense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 755 | Hellbound Aspirant Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 756 | Benefactor's Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 757 | Crystal Keeper Dedication | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 758 | Greater Animal Senses | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 759 | Scales of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 760 | Stalwart Chant | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 761 | Archfiend Dedication | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 762 | Only My Doom May Claim Me | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 763 | Mummy Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 764 | Elemental Spark | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 765 | Draconic Resistance | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 766 | Dualborn | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 767 | The Cycle Continues | 17 | Ancestry | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 768 | Halo | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 769 | Stormsoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 770 | Perfect Resistance | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 771 | Unholy Pact | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 772 | Scholarly Defense | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 773 | Rimesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 774 | Aura of Confidence | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 775 | Claws of the Dragon | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 776 | Fumesoul | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 777 | Unassailable Enforcer | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 778 | Magical Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 779 | Natural Senses | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 780 | Necromantic Lifesense | 10 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 781 | Primal Aegis | 18 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 782 | Peerless Form | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 783 | Sanguine Mastery | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 784 | Wild Witch's Armaments | 6 | Class | witch | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 785 | Sanctified Soul | 1 | Class | exemplar | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 786 | Enlightened Presence | 16 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 787 | Glorious Banner | 20 | Class | commander | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 788 | Mental Buffer | 1 | Class | psychic | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 789 | Superior Sight | 20 | Class | ranger | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 790 | Dread Striker | 4 | Class | rogue | frightened foes are off-guard to it (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 791 | Hellknight-Errant | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 792 | Hellknight Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 793 | Aura of Courage | 4 | Class | champion | frightened it gains 1 lower (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 794 | Disturbing Defense | 4 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 795 | Cracked Mountain | 12 | Class | — | staying up at 0 Hit Points (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 796 | Great Tengu Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 797 | Cheat Death | 12 | Class | swashbuckler | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 798 | Rampaging Form | 17 | Ancestry | — | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 799 | Resilient Mind | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 800 | Poison Resistance | 2 | Class | alchemist | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 801 | Called | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 802 | Timeless Body | 14 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 803 | Affliction Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 804 | Of Lions and Wyrms | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 805 | Peculiar Anatomy | 14 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 806 | Animalistic Resistance | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 807 | No Stranger to Death | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 808 | Noble Resolve | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 809 | Fey Transcendence | 17 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 810 | Desperate Wrath | 16 | Class | barbarian | +2 attack, -1 AC and saves while raging at half Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 811 | Pain Tolerance | 6 | Class | barbarian | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 812 | Necromantic Physiology | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 813 | Divine Health | 2 | Class | champion | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 814 | Well-Groomed | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 815 | Death Warden | 6 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 816 | Well-Versed | 1 | Class | bard | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 817 | Pact of Fey Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 818 | Patron's Glamour | 4 | Class | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 819 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 2.1 | no clear effect |  |
| 820 | Dazing Blow | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 821 | Wildborn Adept | 5 | Ancestry | — | innate spell: Light (rank 3), Vitality Lash (rank 3), Tangle Vine (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 822 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 1.3 | no clear effect |  |
| 823 | Shoki's Argument | 5 | Ancestry | — | innate spell: Vitality Lash (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 824 | Lore Seeker | 8 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 825 | Replicate | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 826 | Sound Mirror | 6 | Class | — | innate spell: Silence (rank 2), Ventriloquism (rank 2), Figment (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 827 | Rivethun Devotion | 8 | Class | — | innate spell: See the Unseen (rank 2), Spirit Link (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 828 | Grown of Oak | 6 | Class | druid | innate spell: Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 829 | Fey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 830 | Prey Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 831 | Infiltration Automaton | 5 | Ancestry | — | innate spell: Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 832 | Shadowy Disguise | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 833 | Devil in Disguise | 6 | Class | — | innate spell: Illusory Disguise (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 834 | Aegis of the Dissolution | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 835 | Lab Rat | 5 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 836 | Fire Resistance | 4 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 837 | Avenger Dedication | 2 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 838 | Fade Presence | 6 | Class | — | innate spell: Invisibility (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 839 | Illusion Sense | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 840 | Parthenogenic Hatchling | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 841 | Witch Warden | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 842 | Cold Minded | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 843 | Oni's Mask | 5 | Ancestry | — | innate spell: Illusory Disguise (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 844 | Adaptive Vision | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 845 | Morph-Risen | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 846 | Tangle-Tongue's Wit | 1 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 847 | Strangle | 8 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.2 | no clear effect |  |
| 848 | Three Clear Breaths | 6 | Class | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 849 | Advanced Hallowed Spell | 8 | Class | — | innate spell: Life Siphon (rank 4), Eradicate Undeath (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 850 | Uplifting Overture | 2 | Class | bard | innate spell: Uplifting Overture (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 851 | Song of Strength | 2 | Class | bard | innate spell: Song of Strength (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 852 | Basic Dogma | 4 | Class | — | Resilient Mind: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 853 | Basic Wilding | 4 | Class | — | Untamed Form: innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 854 | Manifold Modifications | 8 | Class | inventor | Harmonic Oscillator: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 855 | Basic Martial Magic | 4 | Class | — | Arcane Fists: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 856 | Blind-Fight | 8 | Class | fighter | concealed and hidden targets easier to hit, not off-guard to hidden foes (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 857 | Wind Caller | 8 | Class | druid | innate spell: Stormwind Flight (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 858 | Hedge Prison | 6 | Class | druid | innate spell: Hedge Prison (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 859 | Bark and Tendril | 9 | Ancestry | — | innate spell: Entangling Flora (rank 2), Oaken Resilience (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 860 | Ancestor's Transformation | 13 | Ancestry | — | innate spell: Aerial Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 861 | Uncanny Dodge | 10 | Class | — | Deny Advantage: passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 862 | Pinch Time | 9 | Ancestry | — | innate spell: Haste (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 863 | I Sense Malevolence | 13 | Ancestry | — | innate spell: Spirit Sense (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 864 | Replenishment of War | 10 | Class | cleric | passive effect (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 865 | Irriseni Ice-Witch | 13 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 866 | Brilliant Vision | 9 | Ancestry | — | innate spell: See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 867 | More Real Than Real | 20 | Class | — | innate spell: Fabricated Truth (rank 10) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 868 | Speaking Sky | 12 | Class | — | innate spell: Speaking Sky (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 869 | Studious Adept | 9 | Ancestry | — | innate spells: Humanoid Form (rank 2), Mirror Image (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 870 | Eyes of the Sea | 17 | Ancestry | — | innate spell: Truesight (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 871 | Transcend the Azimuth | 17 | Ancestry | — | innate spell: Cosmic Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 872 | Magical Adaptation | 10 | Class | — | innate spell: Darkvision (rank 2), Gecko Grip (rank 4), Water Breathing (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 873 | Sash of the Wind | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 874 | Merge with the Source | 17 | Ancestry | — | innate spells: Angel Form (rank 7), Daemon Form (rank 6), Demon Form (rank 6), Devil Form (rank 6), Elemental Form (rank 5), Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 875 | The Devil Inside | 12 | Class | — | innate spell: Devil Form (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 876 | Shory Aeromancer | 9 | Ancestry | — | innate spell: Fly (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 877 | Seat of Power | 16 | Class | — | innate spell: Cleanse Affliction (rank 4), Sound Body (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 878 | Storm Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 879 | Jalmeri Rakshasa Magic | 9 | Ancestry | — | innate spell: Dispel Magic (rank 2), Reaper's Lantern (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 880 | Asura Magic | 9 | Ancestry | — | innate spell: Blood Vendetta (rank 2), Death Knell (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 881 | Wind Jump | 10 | Class | monk | innate spell: Wind Jump (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 882 | Form of The Sea | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 883 | Stone Form | 17 | Ancestry | — | innate spell: Elemental Form (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 884 | Words of Unraveling | 12 | Class | — | innate spells: Daydreamer's Curse (rank 4), Outcast's Curse (rank 4), Sage's Curse (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 885 | Qlippoth Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 886 | Horn and Bone Incantation | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Humanoid Form (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 887 | Spiritual Echo | 9 | Ancestry | — | innate spell: Spirit Sense (rank 2), Status (rank 2), Darkness (rank 2), Creation (rank 4), Blood Vendetta (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 888 | Basic Concoction | 4 | Class | — | Poison Resistance: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 889 | Songs of the Sea's Wrath | 17 | Ancestry | — | innate spell: Repulsion (rank 6), Spellwrack (rank 6) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 890 | Rakshasa Magic | 9 | Ancestry | — | innate spell: Humanoid Form (rank 2), Illusory Creature (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 891 | Proscribe Devilry | 10 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 892 | Sense Thoughts | 9 | Ancestry | — | innate spell: Mind Reading (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 893 | Gaze of Veracity | 10 | Class | — | innate spell: Glimpse the Truth (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 894 | Flower Magic | 9 | Ancestry | — | innate spell: Oaken Resilience (rank 2), One with Plants (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 895 | Soothing Ballad | 14 | Class | bard | innate spell: Soothing Ballad (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 896 | Return to the Pit! | 12 | Class | — | innate spell: Banishment (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 897 | Determined Lore Seeker | 12 | Class | — | innate spell: Translate (rank 2), Sound Body (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 898 | Ceremony of Aeon's Shield | 9 | Ancestry | — | innate spell: Resist Energy (rank 2), Share Life (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 899 | Sea Witch | 13 | Ancestry | — | innate spell: Aqueous Orb (rank 3), Control Water (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 900 | Unhampered Passage | 9 | Ancestry | — | innate spell: Unfettered Movement (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 901 | Prismatic Scales | 17 | Ancestry | — | innate spell: Prismatic Armor (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 902 | Garuda Magic | 9 | Ancestry | — | innate spell: Blur (rank 2), See the Unseen (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 903 | Morrigna's Spider Affinity | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Speak with Animals (rank 2), Gecko Grip (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 904 | Timeless Nature | 14 | Class | druid | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 905 | Call of the Green Man | 13 | Ancestry | — | innate spell: Plant Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 906 | Wings of the Dragon | 12 | Class | — | innate spell: Dragon Wings (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 907 | Celestial Mercy | 13 | Ancestry | — | innate spell: Cleanse Affliction (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 908 | Draconic Veil | 13 | Ancestry | — | innate spell: Humanoid Form (rank 5) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 909 | Golden Body | 20 | Class | monk | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 910 | Stubborn Defiance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 911 | Keep up the Good Fight | 14 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 912 | Construct Dynamo | 12 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 913 | Death's Drums | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 914 | Occult Resistance | 9 | Ancestry | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 915 | Cautious Curiosity | 9 | Ancestry | — | innate spell: Disguise Magic (rank 1), Silence (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 916 | Special Sentinel Technique | 4 | Class | — | innate spell: Luminous Stardust Healing (rank 2), Shining Starlight Attack (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 917 | Positive Luminance | 8 | Class | — | innate spell: Vital Luminance (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 918 | Basic Glory | 4 | Class | — | Sanctified Soul: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 919 | Deathly Secrets | 6 | Class | — | innate spell: Eyes of the Dead (rank 3), Subjugate Undead (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 920 | Water Nagaji | 1 | Ancestry | — | Breath Control: PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 921 | Rites of Liberation | 14 | Class | — | innate spell: Unimpeded Stride (rank 1), Word of Freedom (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 922 | Flashy Dodge | 1 | Class | swashbuckler | +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 923 | Redirecting Draft | 10 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 924 | Warding Sign | 0 | Action | — | +2 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 925 | Invoke Celestial Privilege | 0 | Action | — | +1 to a save as a reaction (against divine) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 926 | Drink from the Chalice | 0 | Action | thaumaturge | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 927 | Basic Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 928 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a one-handed weapon and a free hand; the AI never used it |
| 929 | Confident Finisher | 0 | Action | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 930 | Resist Elf Magic | 0 | Action | — | +1 to a save as a reaction (against magical) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 931 | Spirit's Absolution | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 932 | Godbreaker | 20 | Class | monk | 3 Strikes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 933 | Abscission Shards | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 934 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 935 | Spellstriker | 4 | Class | — | Spellstrike: spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 936 | Basic Shooting | 4 | Class | — | Hit the Dirt!: +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 937 | Invincible Army | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 938 | Target of Opportunity | 14 | Class | — | a ranged Strike (–2) when an ally's ranged Strike hits (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a loaded arquebus; the AI never used it |
| 939 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 940 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 941 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 942 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 943 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 944 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 945 | Hallowed Necromancer Dedication | 2 | Class | — | innate spell: Hallowed Ground (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 946 | Hit the Dirt! | 1 | Class | gunslinger | +2 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 947 | Cut From the Air | 10 | Class | fighter | +4 AC as a reaction when targeted (ranged) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 948 | Clinch Strike | 6 | Class | — | a reaction Strike on a creature that escapes its grab | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 949 | Stoic as Hell | 6 | Class | — | +2 to a save against an emotion effect (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 950 | Eidolon's Trample | 16 | Class | summoner | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 951 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 952 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 953 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 954 | Defensive Roll | 14 | Class | rogue | half the damage of an attack that would drop it (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 955 | March of the Dead | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 956 | Achaekek's Grip | 8 | Class | — | focus spell: Achaekek's Clutch (rank 4) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 957 | Rogue Dedication | 2 | Class | — | Surprise Attack: foes that haven't acted are off-guard to it the first round | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 958 | Raise Menhir | 8 | Class | druid | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 959 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 960 | Silence the Profane | 8 | Class | — | reaction Strike (cast) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 961 | Skill Mastery | 8 | Class | — | Terrifying Resistance: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 962 | Orchard's Endurance | 14 | Class | kineticist | resistance to bludgeoning and piercing, the PC and its allies within 10 feet (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 963 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 964 | Charmed Life | 2 | Class | swashbuckler | +2 to a save as a reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 965 | Projectile Snatching | 8 | Class | monk | Deflect Projectile, a deflected attack thrown back (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 966 | Keep Up the Good Fight | 14 | Class | guardian | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 967 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 968 | Eidolon's Wrath | 6 | Class | summoner | focus spell: Eidolon's Wrath (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 969 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 970 | Preternatural Parry | 14 | Class | magus | +2 AC as it's targeted (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.8 | no clear effect | with a one-handed weapon and a free hand |
| 971 | Rekindled Light | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 972 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 973 | Roaring Heart | 6 | Class | animist | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 974 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 975 | Rise Up! | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 976 | Avenger of Lust | 14 | Class | — | Sorshen's Devotion: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 977 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 978 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 979 | Claw Snag | 4 | Class | — | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 980 | Form of the Bat | 13 | Ancestry | — | casts Pest Form (rank 4, DC 32, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 981 | Conjurer's Countermeasure | 6 | Class | magus | innate spell: Conjurer's Countermeasure (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 982 | Wake to Strife | 8 | Class | monk | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 983 | Vital Compound Invocation | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 984 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 985 | Shield Warfare | 1 | Class | guardian | PF2e rules: a bigger damage die | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | with a weapon and a shield; the AI never used it |
| 986 | Forward Gaze Into Life | 8 | Class | exemplar | inline save: 15-foot cone, reflex, 5d10 vitality (DC 24, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 987 | Slayer's Strike | 4 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 988 | Basic Rune Magic | 4 | Class | — | Rune Ward: +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 989 | Banner's Inspiration | 4 | Class | commander | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 990 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 991 | Guiding Words | 18 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 992 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 993 | Lock On | 10 | Class | inventor | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 994 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 995 | True Shapeshifter | 20 | Class | druid | casts Nature Incarnate (rank 10, DC 45) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 996 | Cutthroat Grapple | 16 | Class | rogue | reaction Strike (escape) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 997 | Ranged Disarm | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 998 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 999 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1000 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1001 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1002 | Cultivator Dedication | 2 | Class | — | innate spell: Adapt Self (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1003 | Basic Blood Potency | 4 | Class | — | Entreat with Forebears: save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1004 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1005 | Healer's Halo | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1006 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1007 | Rune Ward | 1 | Class | — | +1 AC or save against a spell (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1008 | Intercepting Hand | 12 | Class | — | Disarming Interception: check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1009 | Echo of the Fallen | 4 | Class | — | Accept Echo: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1010 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1011 | Quick Shield Block | 8 | Class | champion | a second reaction each round, for Shield Block | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1012 | Sunbird Glare | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1013 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1014 | Helpful Tinkering | 10 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1015 | Catch and Kill | 12 | Class | — | reaction Strike (move, leave) | +0.00 ± 0.00 | +0.00 | +0.00 | 1.9 | no clear effect |  |
| 1016 | Flinging Updraft | 6 | Class | kineticist | inline save: 1 creature, 60 feet, reflex (DC 22) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1017 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1018 | Defy Hell | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1019 | Instigate Psychic Duel | 12 | Class | — | inline save: 1 creature, 100 feet, will (DC 31, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1020 | Stymie the Gods | 18 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1021 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1022 | Tough Cookie | 10 | Class | guardian | its text's self buff (TempHP 79) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1023 | Deflect Projectile | 4 | Class | monk | +4 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1024 | Tail Snatch | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1025 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1026 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1027 | Rat Form | 9 | Ancestry | — | casts Pest Form (rank 1, DC 25) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1028 | Squirm Free | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1029 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1030 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1031 | Face Your Fears | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1032 | Divine Grace | 2 | Class | champion | +2 to a save as a reaction (against spell) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1033 | Disciple of Shade | 6 | Class | — | innate spell: Inscrutable Mask (rank 3) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1034 | Steady Spellcasting | 6 | Class | bard | a DC 15 flat check against disruption | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1035 | Stalwart Song | 4 | Class | — | +2 to a save as a reaction (against fear) (in Tenacious Stance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1036 | Harmonize Self | 4 | Class | monk | innate spell: Harmonize Self (rank 2) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1037 | Condemn Soul | 8 | Class | — | inline save: 1 creature, 30 feet, will (DC 24) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1038 | Untamed Form | 1 | Class | druid | innate spell: Untamed Form (rank 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1039 | Eyes That See Eternity | 10 | Class | — | casts Truesight (rank 6, DC 27) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1040 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1041 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1042 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1043 | Disengaging Twist | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1044 | Giant's Stature | 6 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1045 | True Senses | 17 | Ancestry | — | casts Truesight (rank 6, DC 37, 1/fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1046 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1047 | Mockingbird's Disarm | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1048 | Blade of the Crimson Oath | 12 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1049 | Finishing Precision | 4 | Class | — | Basic Finisher: Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1050 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1051 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1052 | Basic Trickery | 4 | Class | — | Nimble Dodge: +2 AC as a reaction when targeted | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1053 | Distracting Explosion | 10 | Class | inventor | reaction Strike (concentrate) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1054 | Sanctify Armament | 8 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1055 | Tongue Disarm | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1056 | Advantageous Assault | 6 | Class | fighter | a press Strike at a prone foe, + its weapon dice in damage | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1057 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1058 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1059 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1060 | Snap Falling Fruit | 6 | Class | — | +2 AC against a ranged attack (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1061 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1062 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1063 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1064 | Shatter Defenses | 6 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1065 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 1066 | Journey of the Sky Chariot | 10 | Class | exemplar | Race the Skies: effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1067 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 1068 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.0 | no clear effect |  |
| 1069 | Turn Back the Clock | 4 | Class | — | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1070 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1071 | Grit and Tenacity | 8 | Class | gunslinger | a failed save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1072 | Guarded Mind | 6 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1073 | Liberated Mind | 8 | Class | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1074 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1075 | Stalwart Mind | 8 | Class | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1076 | Acquired Tolerance | 8 | Class | — | a failed save against poison rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1077 | Spiritual Aid | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1078 | Perfect Clarity | 18 | Class | barbarian | a failed Will save rerolled (once a fight) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1079 | Cat's Luck | 1 | Ancestry | — | a failed Reflex save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1080 | Halfling Luck | 1 | Ancestry | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1081 | All This Will Happen Again | 1 | Ancestry | — | a failed Will save against a emotion effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1082 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1083 | Bestial Clarity | 0 | Action | — | a failed save against a enchantment effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1084 | Chaotic Destiny | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1085 | Unbreakable Resolve | 13 | Ancestry | — | a failed Will save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1086 | I Defy You! | 0 | Action | — | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1087 | Shake It Off | 0 | Action | — | a failed save rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1088 | Premonition of Clarity | 14 | Class | cleric | a failed save against a mental effect rerolled | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1089 | Swing the Censer | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1090 | Mystical Flare | 16 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1091 | Wrapped In Smoke | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1092 | Flashing Shield | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1093 | Aggressive Block | 2 | Class | fighter | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1094 | Phase Out | 6 | Class | summoner | an Effect on an ally | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1095 | Shadow Spell | 8 | Class | — | an Effect on a foe | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1096 | Shining Glory | 18 | Class | — | save (requirement assumed: Your nimbus is active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1097 | Echoes in Stone | 9 | Ancestry | — | effect (requirement assumed: You are standing on a stone or earthen surface) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1098 | Channel Elements | 0 | Action | kineticist | effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1099 | Invoke Offense | 4 | Class | — | effect (requirement assumed: You're under the effects of Enter Spirit Trance. You manifest a physical attack of the spirits all around you, such as the claw of an animal spirit or the whipping vine of a nature spirit) (in Enter Spirit Trance) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1100 | Bite and Sting | 0 | Action | — | save (requirement assumed: Your swarm is outside your body) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1101 | Kineticist Dedication | 2 | Class | — | Channel Elements: effect (requirement assumed: Your kinetic gate isn't active) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1102 | Orc Superstition | 1 | Ancestry | — | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.7 | no clear effect |  |
| 1103 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1104 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1105 | Creature Comforts | 4 | Class | barbarian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1106 | Comforting Presence | 10 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1107 | Tactical Retreat | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1108 | Reminder of the Greater Fear | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1109 | Sense the Strike | 10 | Class | — | its Survival DC in place of its AC as it's targeted (reaction, when higher) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1110 | Fit for the Role | 14 | Class | — | innate spell: Illusory Disguise (rank 7) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1111 | Tenacious Endurance | 6 | Class | — | its companion stays up at 1 HP once (wounded 1) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1112 | Heightened Instincts | 18 | Class | — | its companion's successful saves critical successes | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1113 | Swallow Pain | 8 | Class | — | PF2e rules (always on) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1114 | Cellular Reconstruction | 12 | Class | — | staying up at 0 Hit Points | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1115 | Bolera's Interrogation | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1116 | Diehard | 1 | General | — | dies at dying 5 | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1117 | Fight or Flight | 6 | Class | gunslinger | frightened by a foe in its reach: a melee Strike at it (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1118 | Dodging Roll | 12 | Class | monk | resistance equal to its level against an area Reflex effect's damage (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 1119 | Remorseless Lash | 1 | Ancestry | — | a melee weapon hit keeps a frightened foe at frightened 1 until its next turn | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1120 | Elemental Bulwark | 5 | Ancestry | — | resistance 5 against a foe's cold, electricity or fire (reaction) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1121 | Improved Elemental Bulwark | 13 | Ancestry | — | Elemental Bulwark's resistance 10 (with it) | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1122 | Spellmaster's Resilience | 12 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1123 | Soul Oubliette | 20 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.00 | +0.00 | 1.0 | no clear effect | always on (its moment isn't checked) |
| 1124 | Arcane Locomotion | 13 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1125 | Smile at Failure | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.02 | +0.03 | −0.03 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1126 | Warding Jewel | 5 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1127 | Breath of the Dragon (Dragon Disciple) | 8 | Class | — | innate spell: Dragon Breath (rank 3) | −0.00 ± 0.05 | +0.01 | −0.01 | 1.0 | no clear effect |  |
| 1128 | Enlarge Companion | 8 | Class | ranger | focus spell: Enlarge Companion (rank 4) | −0.00 ± 0.06 | +0.04 | −0.04 | 2.0 | no clear effect |  |
| 1129 | Shame the Sin | 5 | Ancestry | — | check | −0.00 ± 0.03 | −0.03 | +0.03 | 1.0 | no clear effect |  |
| 1130 | Unbalancing Blow | 2 | Class | rogue | off-guard to the PC after a critical hit (always on) | −0.00 ± 0.01 | −0.01 | +0.00 | 0.6 | no clear effect |  |
| 1131 | Tragic Lament | 18 | Class | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1132 | Tectonic Stomp | 10 | Class | — | save | −0.00 ± 0.04 | +0.02 | −0.03 | 1.0 | no clear effect |  |
| 1133 | Dashing Strike | 12 | Class | fighter | Strike activity | −0.00 ± 0.03 | +0.01 | −0.01 | 1.7 | no clear effect |  |
| 1134 | Monk Moves | 8 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1135 | Weakening Assault | 12 | Class | guardian | 2 Strikes | −0.00 ± 0.04 | −0.02 | +0.02 | 4.4 | no clear effect |  |
| 1136 | Instrument of Slaughter | 16 | Class | champion | its champion's reaction Strike: a critical hit's persistent bleed | −0.00 ± 0.01 | −0.00 | −0.00 | 0.3 | no clear effect |  |
| 1137 | Spell Parry | 2 | Class | magus | its text's self buff (FlatModifier ac 1) | −0.00 ± 0.06 | +0.09 | −0.09 | 2.8 | no clear effect | with a one-handed weapon and a free hand |
| 1138 | Serpentcoil Slam | 9 | Ancestry | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.00 | 1.8 | no clear effect |  |
| 1139 | Fighter Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1140 | Champion Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1141 | Exemplar Resiliency | 4 | Class | — | 6 more Hit Points | −0.00 ± 0.04 | −0.08 | +0.07 | 0.0 | no clear effect | the AI never used it |
| 1142 | Twitchy | 1 | Ancestry | — | PF2e rules (always on) | −0.00 ± 0.03 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1143 | Crane Flutter | 6 | Class | monk | reaction Strike (missed) (in Crane Stance) | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1144 | Ghostly Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.05 | −0.03 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1145 | Spinning Stand | 6 | Class | — | 2 Strikes | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1146 | Fiendish Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1147 | Celestial Form | 18 | Class | champion | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1148 | Walk Through the Conflagration | 14 | Class | kineticist | save | −0.00 ± 0.04 | −0.00 | −0.00 | 0.4 | no clear effect |  |
| 1149 | Furious Finish | 2 | Class | barbarian | Strike activity | −0.00 ± 0.03 | −0.05 | +0.04 | 1.3 | no clear effect |  |
| 1150 | Spirit's Anguish | 8 | Class | — | save | −0.00 ± 0.05 | +0.12 | −0.13 | 2.4 | no clear effect |  |
| 1151 | Instrument of Zeal | 16 | Class | champion | its champion's reaction Strike: a critical hit's extra die and slowed 1 | −0.00 ± 0.01 | +0.00 | −0.01 | 0.6 | no clear effect |  |
| 1152 | Certain Stratagem | 2 | Class | investigator | half its strategic strike dice on a stratagem Strike's miss (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1153 | Rushing Goat Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1154 | Gorilla Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1155 | Flood Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.04 | +0.06 | −0.07 | 1.1 | no clear effect |  |
| 1156 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | +0.00 | −0.01 | 2.5 | no clear effect |  |
| 1157 | Perfect Ki Exemplar | 14 | Class | — | innate spells: Unblinking Flame Emblem (rank 7), Unbreaking Wave Barrier (rank 7), Unfolding Wind Blitz (rank 7), Untwisting Iron Augmentation (rank 7) | −0.00 ± 0.03 | +0.00 | −0.01 | 0.7 | no clear effect |  |
| 1158 | Suplex | 4 | Class | — | Strike activity | −0.00 ± 0.01 | −0.01 | +0.00 | 0.2 | no clear effect |  |
| 1159 | Lost in the Crowd | 4 | Class | — | passive effect (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1160 | You're an Embarrassment! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1161 | Spell Protection Array | 4 | Class | wizard | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1162 | Heroic Defiance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1163 | Kaiju Defense Oath | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1164 | Fane's Escape | 4 | Skill | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1165 | Such a Disgrace! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1166 | Golden Erinys Stance | 4 | Class | — | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1167 | Push Back the Dead! | 4 | Class | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1168 | Inspiring Marshal Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1169 | Scoundrel's Surprise | 4 | Class | rogue | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1170 | Strategist Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1171 | Ardent Armiger | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1172 | Loose Cannon | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1173 | Norgorber's Secret | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1174 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect |  |
| 1175 | Fiery Rebirth | 4 | Class | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1176 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1177 | Necromantic Resistance | 4 | Class | — | PF2e rules (always on) | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1178 | Devrin's Cunning Stance | 4 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1179 | Reactive Striker | 4 | Class | — | Reactive Strike | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1180 | Critical Debilitation | 12 | Class | rogue | on a critical hit, Debilitating Strike's Fortitude save: slowed 1, slowed 2 or paralyzed | −0.00 ± 0.03 | −0.04 | +0.03 | 0.9 | no clear effect |  |
| 1181 | Ride the Tsunami | 18 | Class | kineticist | save | −0.00 ± 0.07 | −0.24 | +0.23 | 2.7 | no clear effect |  |
| 1182 | Irresistible Bloom | 17 | Ancestry | — | save | −0.00 ± 0.01 | +0.00 | −0.01 | 0.1 | no clear effect |  |
| 1183 | Dragon Stance | 1 | Class | monk | PF2e's stance Effect | −0.00 ± 0.05 | +0.08 | −0.09 | 1.1 | no clear effect |  |
| 1184 | Mana Detonation | 18 | Class | — | innate spell: Arcane Explosion (rank 9) | −0.00 ± 0.02 | +0.03 | −0.04 | 0.2 | no clear effect |  |
| 1185 | Bloodline Resistance | 8 | Class | sorcerer | PF2e rules (always on) | −0.00 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1186 | Dueling Dance (Fighter) | 12 | Class | fighter | PF2e's stance Effect | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a one-handed weapon and a free hand |
| 1187 | Paragon's Guard | 12 | Class | fighter | stance: its shield always raised | −0.01 ± 0.07 | −0.01 | +0.00 | 1.0 | no clear effect | with a weapon and a shield |
| 1188 | Chronomancer's Secrets | 8 | Class | — | innate spell: Stasis (rank 4), Path of Least Resistance (rank 4) | −0.01 ± 0.06 | +0.19 | −0.20 | 1.0 | no clear effect |  |
| 1189 | Mooneater | 17 | Ancestry | — | innate spell: Eclipse Burst (rank 7) | −0.01 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 1190 | Dismounting Strike | 8 | Class | — | its mount's Stride, a leap off and a Strike with an extra weapon die (counts as two attacks) | −0.01 ± 0.04 | +0.01 | −0.02 | 3.3 | no clear effect |  |
| 1191 | Punishing Shove | 1 | Class | guardian | damage on a successful Shove (always on) | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1192 | As a Thousand Soldiers | 8 | Class | exemplar | save | −0.01 ± 0.07 | +0.05 | −0.06 | 1.0 | no clear effect |  |
| 1193 | Conjure Hell | 12 | Class | — | inline save: 15-foot burst, fortitude, 9d6 fire (DC 31, 1/fight) | −0.01 ± 0.06 | +0.07 | −0.09 | 1.0 | no clear effect |  |
| 1194 | Witch's Armaments | 1 | Class | witch | PF2e rules (always on) | −0.01 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1195 | Bend Time | 0 | Action | — | check | −0.01 ± 0.02 | −0.03 | +0.02 | 1.0 | no clear effect |  |
| 1196 | Animal Swiftness | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.00 | −0.00 | −0.01 | 0.0 | no clear effect | always on (its moment isn't checked) |
| 1197 | Basic Witchcraft | 4 | Class | — | Witch's Armaments: PF2e rules (always on) | −0.01 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1198 | Exsanguinate | 6 | Class | — | check | −0.01 ± 0.02 | +0.01 | −0.02 | 0.5 | no clear effect |  |
| 1199 | Assisting Shot | 2 | Class | fighter | a ranged press Strike, +1 to the next ally's attack at its target | −0.01 ± 0.05 | +0.04 | −0.05 | 3.3 | no clear effect | with a loaded arquebus |
| 1200 | Bony Barrage | 4 | Class | — | innate spell: Bony Barrage (rank 2) | −0.01 ± 0.02 | −0.02 | +0.01 | 0.4 | no clear effect |  |
| 1201 | Stunning Blows | 2 | Class | monk | a Fortitude save or stunned when a Flurry of Blows hits | −0.01 ± 0.04 | +0.02 | −0.03 | 1.1 | no clear effect |  |
| 1202 | Brutal Beating | 2 | Class | rogue | frightened 1 on a critical hit (always on) | −0.01 ± 0.01 | −0.01 | −0.00 | 0.6 | no clear effect |  |
| 1203 | Ivy Playhouse Strike | 4 | Class | — | Strike activity | −0.01 ± 0.02 | −0.04 | +0.02 | 4.2 | no clear effect |  |
| 1204 | Bellflower Tiller Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1205 | Torrential Backlash | 10 | Class | — | save (requirement assumed: You are in a curse maelstrom state) | −0.01 ± 0.05 | +0.13 | −0.14 | 3.7 | no clear effect |  |
| 1206 | Calaca's Showstopper | 13 | Ancestry | — | save | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1207 | Masked Casting | 8 | Class | — | self effect | −0.01 ± 0.01 | −0.01 | −0.00 | 3.2 | no clear effect |  |
| 1208 | Ghost Dedication | 2 | Class | — | PF2e rules (always on) | −0.01 ± 0.03 | +0.01 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1209 | Asp Stance | 6 | Class | monk | PF2e's stance Effect | −0.01 ± 0.06 | +0.03 | −0.04 | 1.0 | no clear effect |  |
| 1210 | Tactical Debilitations | 10 | Class | rogue | Debilitating Strike's no reactions in place of enfeebled 1 | −0.01 ± 0.02 | −0.05 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1211 | Cautious Word | 12 | Class | — | check | −0.01 ± 0.01 | +0.00 | −0.02 | 0.2 | no clear effect |  |
| 1212 | Convocation of Earth and Moon | 17 | Ancestry | — | save | −0.01 ± 0.04 | +0.04 | −0.06 | 1.0 | no clear effect |  |
| 1213 | Exacting Strike | 1 | Class | fighter | Strike activity | −0.01 ± 0.02 | +0.01 | −0.03 | 2.7 | no clear effect |  |
| 1214 | Ferocious Beasts | 13 | Ancestry | — | its companion's Orc Ferocity | −0.01 ± 0.01 | −0.01 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1215 | Assume Earth's Mantle | 14 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.05 | −0.06 | +0.05 | 1.0 | no clear effect |  |
| 1216 | Sky and Heaven Stance | 6 | Class | — | PF2e's stance Effect | −0.01 ± 0.06 | +0.11 | −0.13 | 1.0 | no clear effect |  |
| 1217 | Opportune Riposte | 0 | Action | swashbuckler | reaction Strike (critical-miss) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.1 | no clear effect |  |
| 1218 | Monk Dedication | 2 | Class | — | Powerful Fist: PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1219 | Burning Demand | 12 | Class | kineticist | save | −0.01 ± 0.09 | −0.05 | +0.03 | 4.2 | no clear effect |  |
| 1220 | Vicious Rend | 10 | Class | — | its companion's Vicious Rend (two claws, bleed if both hit) | −0.01 ± 0.02 | −0.01 | −0.01 | 2.4 | no clear effect |  |
| 1221 | Quick Vengeance | 18 | Class | guardian | an extra action after its Intercept Attack or Shield Block | −0.01 ± 0.01 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 1222 | Elemental Explosion | 6 | Class | barbarian | inline save: 15-foot emanation, reflex, 6d8 fire (DC 22, 1/fight) | −0.01 ± 0.04 | −0.02 | −0.00 | 0.7 | no clear effect |  |
| 1223 | For My House! | 0 | Action | — | self effect | −0.01 ± 0.02 | −0.01 | −0.02 | 1.6 | no clear effect |  |
| 1224 | Rejoice in Solstice Storm | 8 | Class | exemplar | inline save: 30-foot emanation, reflex, 5d8 electricity (DC 24, 1/fight) | −0.01 ± 0.04 | −0.07 | +0.05 | 0.9 | no clear effect |  |
| 1225 | Unleash the Blight | 10 | Class | — | save | −0.01 ± 0.02 | −0.02 | −0.00 | 0.5 | no clear effect |  |
| 1226 | Death Drone | 0 | Action | — | save | −0.01 ± 0.05 | +0.02 | −0.04 | 1.4 | no clear effect |  |
| 1227 | Cover Fire | 1 | Class | gunslinger | Strike activity | −0.01 ± 0.04 | −0.00 | −0.02 | 6.8 | no clear effect |  |
| 1228 | Defiant Banner | 8 | Class | commander | effect | −0.01 ± 0.07 | −0.20 | +0.18 | 10.7 | no clear effect |  |
| 1229 | Swift Sower | 10 | Class | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1230 | Basic Muse's Whispers | 4 | Class | — | Hymn of Healing: innate spell: Hymn of Healing (rank 1) | −0.01 ± 0.05 | −0.02 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1231 | Dread Mosquito Storm | 18 | Class | — | innate spell: Dread Mosquito Storm (rank 9) | −0.01 ± 0.01 | −0.02 | +0.00 | 0.5 | no clear effect |  |
| 1232 | Indomitable Spirit | 17 | Ancestry | — | its text's self buff (FlatModifier ac 4) | −0.01 ± 0.04 | −0.03 | +0.00 | 1.0 | no clear effect |  |
| 1233 | Retreating Finisher | 2 | Class | swashbuckler | Strike activity | −0.01 ± 0.03 | −0.00 | −0.02 | 2.0 | no clear effect |  |
| 1234 | Basic Flair | 4 | Class | — | Unbalancing Finisher: Strike activity | −0.01 ± 0.03 | −0.02 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 1235 | Guiding Shot | 2 | Class | commander | a ranged Strike, +1 to the next ally's attack at its target | −0.01 ± 0.05 | −0.02 | −0.00 | 3.2 | no clear effect | with a loaded arquebus |
| 1236 | Roar Mimicry | 12 | Class | — | inline save: 15-foot emanation, fortitude, 8d6 sonic (DC 31, 1/fight) | −0.01 ± 0.03 | −0.05 | +0.03 | 0.6 | no clear effect |  |
| 1237 | Duelist's Edge | 4 | Class | — | +2 to its initiative | −0.01 ± 0.03 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1238 | Deathly Scream | 2 | Class | — | innate spell: Deathly Scream (rank 1) | −0.01 ± 0.03 | +0.02 | −0.04 | 1.0 | no clear effect |  |
| 1239 | Felling Strike | 8 | Class | fighter | Strike activity | −0.01 ± 0.06 | −0.03 | +0.01 | 5.9 | no clear effect |  |
| 1240 | Bespell Strikes | 4 | Class | oracle | +1d6 force on its Strikes after a slot spell (free) | −0.01 ± 0.01 | −0.03 | +0.00 | 1.9 | no clear effect |  |
| 1241 | Eternal Wings (Sylph) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1242 | Wyrmling Flight | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1243 | Soaring Poppet | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1244 | Eternal Wings (Nephilim) | 17 | Ancestry | — | PF2e rules (always on) | −0.01 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1245 | Hellbreaker Strike | 0 | Action | — | Strike activity | −0.01 ± 0.04 | +0.02 | −0.05 | 1.8 | no clear effect |  |
| 1246 | Pennant of Victory | 20 | Class | commander | effect | −0.01 ± 0.10 | −0.46 | +0.43 | 2.0 | no clear effect |  |
| 1247 | Swaggering Initiative | 4 | Class | swashbuckler | +2 to its initiative | −0.01 ± 0.03 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1248 | Juggernaut Charge | 8 | Class | guardian | Strike activity | −0.01 ± 0.03 | −0.01 | −0.02 | 2.8 | no clear effect |  |
| 1249 | Tiger Slash | 6 | Class | monk | Strike activity (in Tiger Stance) | −0.01 ± 0.06 | +0.03 | −0.05 | 4.1 | no clear effect |  |
| 1250 | Eldritch Debilitations | 10 | Class | rogue | Debilitating Strike's stupefied 1 in place of enfeebled 1 | −0.01 ± 0.02 | −0.05 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 1251 | Emit Defensive Odor | 1 | Ancestry | — | save | −0.01 ± 0.04 | −0.05 | +0.02 | 1.0 | no clear effect |  |
| 1252 | Guide the Timeline | 6 | Class | — | effect | −0.01 ± 0.03 | −0.01 | −0.02 | 2.0 | no clear effect |  |
| 1253 | Alacritous Action | 2 | Class | summoner | its eidolon's Speed +10 feet | −0.01 ± 0.01 | −0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1254 | Pouncing Transformation | 12 | Class | — | check | −0.02 ± 0.06 | +0.13 | −0.16 | 5.5 | no clear effect |  |
| 1255 | Mighty Wings | 18 | Class | — | PF2e rules (always on) | −0.02 ± 0.01 | +0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1256 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.02 ± 0.05 | +0.09 | −0.12 | 3.5 | no clear effect |  |
| 1257 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | −0.02 ± 0.03 | +0.04 | −0.07 | 4.7 | no clear effect |  |
| 1258 | Dual-Weapon Warrior Dedication | 2 | Class | — | Double Slice: 2 Strikes | −0.02 ± 0.02 | −0.01 | −0.02 | 0.0 | no clear effect | with two weapons (longsword and shortsword); the AI never used it |
| 1259 | Coordinated Charge | 12 | Class | — | Strike activity | −0.02 ± 0.03 | +0.01 | −0.04 | 1.7 | no clear effect |  |
| 1260 | Twin Riposte | 10 | Class | fighter | reaction Strike (critical-miss) (in Twin Parry) | −0.02 ± 0.03 | +0.01 | −0.04 | 0.2 | no clear effect |  |
| 1261 | Spiritual Disruption | 0 | Bonus | — | Strike activity | −0.02 ± 0.04 | +0.00 | −0.04 | 1.8 | no clear effect |  |
| 1262 | Dazzling Display | 10 | Class | fighter | Demoralize each enemy within 30 feet (Intimidation DC 24, once a fight) | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1263 | Heal Companion | 1 | Class | ranger | focus spell: Heal Companion (rank 1) | −0.02 ± 0.02 | −0.02 | −0.01 | 0.4 | no clear effect |  |
| 1264 | Ill Tide | 9 | Ancestry | — | an Effect on a foe | −0.02 ± 0.02 | +0.01 | −0.04 | 1.5 | no clear effect |  |
| 1265 | Revivifying Mutagen | 2 | Class | alchemist | check | −0.02 ± 0.01 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 1266 | Trance of Celerity | 1 | Class | oracle | PF2e's self Effect | −0.02 ± 0.04 | −0.06 | +0.02 | 1.0 | no clear effect |  |
| 1267 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.02 ± 0.05 | −0.03 | −0.00 | 1.0 | no clear effect |  |
| 1268 | Dodge Away | 6 | Class | — | +1 AC as a reaction when targeted (melee) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.8 | no clear effect |  |
| 1269 | Dragging Strike | 2 | Class | fighter | Strike activity | −0.02 ± 0.02 | −0.01 | −0.02 | 3.1 | no clear effect |  |
| 1270 | Pivot Strike | 14 | Class | — | a Strike with twice its weapon dice in damage, then a Trip (its Leap and staff not checked) | −0.02 ± 0.05 | −0.05 | +0.01 | 4.8 | no clear effect |  |
| 1271 | Fungal Exhalation | 6 | Class | druid | innate spell: Fungal Exhalation (rank 3) | −0.02 ± 0.03 | −0.05 | +0.01 | 0.5 | no clear effect |  |
| 1272 | Polished Distraction | 6 | Class | — | inline save: 5-foot emanation, fortitude (DC 22) | −0.02 ± 0.03 | −0.02 | −0.02 | 0.3 | no clear effect |  |
| 1273 | Shaitan Skin | 13 | Ancestry | — | innate spell: Mountain Resilience (rank 4) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.7 | no clear effect |  |
| 1274 | Primal Rampage | 13 | Ancestry | — | innate spells: Unfettered Movement (rank 4), Mountain Resilience (rank 4) | −0.02 ± 0.02 | −0.02 | −0.02 | 0.7 | no clear effect |  |
| 1275 | Harrying Strike | 10 | Class | — | Strike activity | −0.02 ± 0.01 | −0.03 | −0.01 | 7.0 | no clear effect |  |
| 1276 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.02 ± 0.04 | −0.02 | −0.02 | 1.0 | no clear effect |  |
| 1277 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | −0.02 ± 0.04 | +0.02 | −0.06 | 5.2 | no clear effect |  |
| 1278 | Toughness | 1 | General | — | more maximum Hit Points | −0.02 ± 0.02 | +0.00 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1279 | Current Spell | 6 | Class | druid | its text's self buff (FlatModifier ac 1) | −0.02 ± 0.06 | −0.07 | +0.03 | 2.3 | no clear effect |  |
| 1280 | Extraplanar Haze | 5 | Ancestry | — | check | −0.02 ± 0.03 | +0.00 | −0.04 | 1.0 | no clear effect |  |
| 1281 | Nanite Shroud | 5 | Ancestry | — | check | −0.02 ± 0.03 | +0.00 | −0.04 | 1.0 | no clear effect |  |
| 1282 | Sawtooth Grapple | 8 | Class | rogue | 2 Strikes (requirement assumed: You're wielding two weapons, at least one of which is a sawtooth saber) | −0.02 ± 0.02 | +0.00 | −0.04 | 3.2 | no clear effect |  |
| 1283 | Ferocious Charge | 10 | Class | — | its companion's Ferocious Charge (two Strides and a Strike, +1d8) | −0.02 ± 0.03 | −0.04 | −0.00 | 3.0 | no clear effect |  |
| 1284 | Follow-Up Assault | 8 | Class | barbarian | after a missed melee Strike, raging: a Strike +1 with its weapon dice in damage | −0.02 ± 0.02 | −0.02 | −0.02 | 5.2 | no clear effect |  |
| 1285 | Bristle | 5 | Ancestry | — | effect | −0.02 ± 0.03 | −0.02 | −0.02 | 3.2 | no clear effect |  |
| 1286 | Guardian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1287 | Barbarian Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1288 | Ranger Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1289 | Monk Resiliency | 4 | Class | — | 6 more Hit Points | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1290 | Paralyzing Jewel | 9 | Ancestry | — | inline save: 15-foot emanation, will (DC 25, 1/fight) | −0.02 ± 0.02 | −0.04 | −0.01 | 0.3 | no clear effect |  |
| 1291 | Basic Thoughtform | 4 | Class | — | Psi Burst: save | −0.02 ± 0.04 | −0.08 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1292 | Swift Retribution | 18 | Class | champion | an extra action after its champion's reaction | −0.02 ± 0.02 | −0.03 | −0.01 | 0.8 | no clear effect |  |
| 1293 | Symphony of Blood | 17 | Ancestry | — | innate spell: Vampiric Exsanguination (rank 7) | −0.02 ± 0.03 | −0.01 | −0.03 | 0.8 | no clear effect |  |
| 1294 | Blessing of the Five | 0 | Bonus | — | casts Heal (rank 1, DC 17, 1/fight) | −0.02 ± 0.03 | −0.04 | −0.00 | 0.7 | no clear effect |  |
| 1295 | Sky Master Mask | 20 | Class | druid | PF2e rules (always on) | −0.02 ± 0.03 | −0.01 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1296 | Aegis for the Innocent | 14 | Class | — | save (requirement assumed: Your nimbus is active) | −0.02 ± 0.02 | −0.02 | −0.03 | 0.5 | no clear effect |  |
| 1297 | Brandish Authority | 18 | Class | — | check | −0.02 ± 0.07 | −0.01 | −0.04 | 3.0 | no clear effect |  |
| 1298 | Fox Possession | 17 | Ancestry | — | innate spell: Possession (rank 7) | −0.02 ± 0.02 | +0.00 | −0.05 | 1.0 | no clear effect |  |
| 1299 | Broken Chain Dedication | 12 | Class | — | Ultimatum of Liberation: save | −0.02 ± 0.05 | +0.06 | −0.11 | 0.0 | no clear effect | the AI never used it |
| 1300 | Writhing Runelord Weapon | 14 | Class | — | 2 Strikes | −0.02 ± 0.05 | −0.01 | −0.03 | 3.0 | no clear effect | with a spear and a free hand |
| 1301 | History of Violence | 14 | Class | — | Strike activity | −0.02 ± 0.06 | +0.03 | −0.08 | 1.0 | no clear effect |  |
| 1302 | Scouring Rage | 6 | Class | barbarian | as it Rages, each enemy within 20 feet saves (Fortitude, basic, DC 22) or takes 6 slashing | −0.02 ± 0.06 | −0.13 | +0.08 | 3.1 | no clear effect |  |
| 1303 | Imbue Mindlessness | 12 | Class | — | innate spell: Harm (rank 1) | −0.03 ± 0.06 | −0.01 | −0.04 | 1.0 | no clear effect |  |
| 1304 | Invented Vulnerability | 6 | Class | — | Deception against Will: weakness 5 to piercing for a round (1 action, once a fight) | −0.03 ± 0.04 | −0.02 | −0.03 | 1.6 | no clear effect |  |
| 1305 | Greater than the Sum | 17 | Ancestry | — | innate spell: Enlarge (rank 6) | −0.03 ± 0.04 | −0.02 | −0.03 | 1.0 | no clear effect |  |
| 1306 | Skeletal Resistance | 9 | Ancestry | — | PF2e rules (always on) | −0.03 ± 0.03 | −0.03 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 1307 | Fling Magic | 0 | Action | thaumaturge | save | −0.03 ± 0.05 | −0.03 | −0.02 | 2.4 | no clear effect |  |
| 1308 | Lion's Magic | 8 | Class | — | innate spells: Suggestion (rank 4), Subconscious Suggestion (rank 12) | −0.03 ± 0.03 | −0.02 | −0.03 | 1.5 | no clear effect |  |
| 1309 | Hulking Size | 8 | Class | summoner | its eidolon Large, reach 10 feet | −0.03 ± 0.08 | −0.20 | +0.15 | 0.0 | no clear effect | the AI never used it |
| 1310 | Drifter's Wake | 0 | Action | gunslinger | 3 Strikes | −0.03 ± 0.04 | +0.05 | −0.11 | 1.8 | no clear effect |  |
| 1311 | Bloodletting Claws | 4 | Class | summoner | its eidolon's critical hits 1d6 persistent bleed | −0.03 ± 0.03 | +0.05 | −0.10 | 0.0 | no clear effect | the AI never used it |
| 1312 | Spiritual Expansion Spell | 2 | Class | animist | widened copies of 1 area spell | −0.03 ± 0.06 | −0.11 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1313 | Glory and Valor! | 9 | Ancestry | — | heals 4 (touch, 1/fight) | −0.03 ± 0.02 | −0.04 | −0.01 | 0.7 | no clear effect |  |
| 1314 | Disrupt Prey | 4 | Class | ranger | reaction Strike (move, leave, manipulate) | −0.03 ± 0.02 | +0.01 | −0.06 | 0.2 | no clear effect |  |
| 1315 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | −0.03 ± 0.04 | +0.10 | −0.16 | 1.0 | no clear effect |  |
| 1316 | Tap Vitality | 6 | Class | — | heals 24 (touch, 1/fight) | −0.03 ± 0.02 | +0.02 | −0.07 | 0.6 | no clear effect |  |
| 1317 | Goading Feint | 1 | Class | swashbuckler | every Feint goads (–2 to the foe's next attack on the PC, all of them on a critical success) instead of off-guard | −0.03 ± 0.03 | −0.05 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1318 | Toppling Transformation | 6 | Class | druid | check | −0.03 ± 0.02 | −0.06 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1319 | Bon Mot | 1 | Skill | — | check | −0.03 ± 0.04 | −0.04 | −0.02 | 4.8 | no clear effect |  |
| 1320 | Reach Spell | 1 | Class | bard | reach copies of 5 spells | −0.03 ± 0.03 | −0.10 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 1321 | Fling Head | 6 | Class | — | inline save: 1 creature, 30 feet, will (DC 22, 1/fight) | −0.03 ± 0.04 | −0.05 | −0.01 | 1.0 | no clear effect |  |
| 1322 | Frighten Undead | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1323 | Crossbow Terror | 6 | Class | — | check | −0.03 ± 0.04 | +0.01 | −0.07 | 3.3 | no clear effect |  |
| 1324 | Ease the Burden | 20 | Class | — | heals 100 (touch, 1/fight) | −0.03 ± 0.03 | −0.03 | −0.03 | 0.8 | no clear effect |  |
| 1325 | Voice Cold as Death | 7 | Skill | — | check | −0.03 ± 0.03 | −0.01 | −0.05 | 3.2 | no clear effect |  |
| 1326 | Nagaji Spell Expertise | 13 | Ancestry | — | innate spells: Flicker (rank 4), Control Water (rank 5), Subconscious Suggestion (rank 5) | −0.03 ± 0.02 | −0.01 | −0.05 | 0.3 | no clear effect |  |
| 1327 | Iivlar's Boundary Break | 13 | Ancestry | — | innate spell: Flicker (rank 4) | −0.03 ± 0.02 | −0.01 | −0.05 | 0.3 | no clear effect |  |
| 1328 | Invoke Disaster | 18 | Class | druid | innate spell: Storm Lord (rank 9) | −0.03 ± 0.02 | −0.05 | −0.01 | 0.3 | no clear effect |  |
| 1329 | Unnerving Terror | 13 | Ancestry | — | save (requirement assumed: You're in yaoguai form) | −0.03 ± 0.04 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 1330 | Kraken's Call | 17 | Ancestry | — | inline save: 30-foot burst, fortitude, 8d6 untyped (DC 37, 1/fight) | −0.03 ± 0.03 | −0.01 | −0.06 | 0.5 | no clear effect |  |
| 1331 | Essence Overflow | 6 | Class | — | save (requirement assumed: You are Channeling Draconic Essence) | −0.03 ± 0.03 | −0.07 | +0.01 | 0.9 | no clear effect |  |
| 1332 | Steal Time | 10 | Class | — | save | −0.03 ± 0.05 | +0.05 | −0.12 | 1.0 | no clear effect |  |
| 1333 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.05 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 1334 | Feathered Flechettes | 6 | Class | — | inline save: 15-foot emanation, reflex, 6d6 slashing (DC 22, 1/fight) | −0.03 ± 0.03 | −0.10 | +0.04 | 0.8 | no clear effect |  |
| 1335 | Roiling Mudslide | 6 | Class | kineticist | save | −0.03 ± 0.05 | +0.01 | −0.07 | 1.4 | no clear effect |  |
| 1336 | Fleeing Shriek | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude, 5d6 sonic (DC 25, 1/fight) | −0.03 ± 0.03 | −0.11 | +0.04 | 0.8 | no clear effect |  |
| 1337 | Shield Block | 1 | General | — | Shield Block (reaction), a shield with it | −0.03 ± 0.02 | −0.08 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 1338 | Hit and Run | 6 | Class | — | Strike activity | −0.03 ± 0.03 | +0.01 | −0.07 | 1.6 | no clear effect |  |
| 1339 | Songbird's Call | 8 | Class | bard | focus spell: Songbird's Call (rank 4) | −0.03 ± 0.02 | −0.02 | −0.05 | 0.6 | no clear effect |  |
| 1340 | Cleansing Light | 17 | Ancestry | — | check | −0.04 ± 0.05 | −0.02 | −0.05 | 1.0 | no clear effect |  |
| 1341 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.04 ± 0.03 | +0.00 | −0.07 | 1.5 | no clear effect |  |
| 1342 | On My Best Day | 18 | Class | — | its text's self buff (FlatModifier ac 3) | −0.04 ± 0.05 | −0.15 | +0.08 | 1.0 | no clear effect |  |
| 1343 | Demolishing Knockback | 14 | Class | — | Strike activity | −0.04 ± 0.04 | −0.08 | +0.00 | 3.0 | no clear effect |  |
| 1344 | Primadonna | 12 | Class | — | check | −0.04 ± 0.04 | −0.06 | −0.01 | 0.3 | no clear effect |  |
| 1345 | Pact of Draconic Fury | 6 | Class | — | Dragon Breath: inline save: 30-foot cone, reflex, 6d6 untyped (DC 22, 1/fight) | −0.04 ± 0.03 | −0.08 | +0.01 | 0.9 | no clear effect |  |
| 1346 | Blessed Counterstrike | 12 | Class | champion | Strike activity | −0.04 ± 0.02 | −0.04 | −0.04 | 1.5 | no clear effect |  |
| 1347 | Banner Twirl | 4 | Class | commander | check | −0.04 ± 0.09 | +0.12 | −0.20 | 3.1 | no clear effect |  |
| 1348 | Undead Hunter | 1 | Ancestry | — | innate spells: Vitality Lash (rank 1), Infuse Vitality (rank 3) | −0.04 ± 0.05 | +0.09 | −0.16 | 1.0 | no clear effect |  |
| 1349 | Wither Away | 16 | Class | — | save | −0.04 ± 0.06 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 1350 | Preemptive Reconfiguration | 9 | Ancestry | — | self effect | −0.04 ± 0.03 | +0.01 | −0.09 | 3.6 | no clear effect |  |
| 1351 | Solidarity | 9 | Ancestry | — | heals 18 (touch, 1/fight) | −0.04 ± 0.03 | −0.06 | −0.02 | 0.7 | no clear effect |  |
| 1352 | Growth Spell | 10 | Class | — | widened copies of 6 area spells | −0.04 ± 0.04 | −0.00 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1353 | Devil's Wings | 16 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | +0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1354 | Edifying Trace | 8 | Class | — | an Effect on a foe | −0.04 ± 0.07 | +0.00 | −0.08 | 6.0 | no clear effect |  |
| 1355 | Break Them Down | 0 | Action | gunslinger | Strike activity | −0.04 ± 0.04 | −0.01 | −0.07 | 3.7 | no clear effect |  |
| 1356 | Widen Spell | 1 | Class | druid | widened copies of 1 area spell | −0.04 ± 0.02 | −0.07 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 1357 | Winter's Clutch | 1 | Class | kineticist | save | −0.04 ± 0.06 | −0.10 | +0.02 | 2.4 | no clear effect |  |
| 1358 | Spark Fist | 5 | Ancestry | — | PF2e's self Effect | −0.04 ± 0.03 | −0.03 | −0.05 | 2.0 | no clear effect |  |
| 1359 | Dominion Aura | 17 | Ancestry | — | inline save: 10-foot emanation, fortitude, 8d6 force (DC 37, 1/fight) | −0.04 ± 0.02 | −0.05 | −0.03 | 0.3 | no clear effect |  |
| 1360 | This is What it's Like to Die | 17 | Ancestry | — | innate spell: Phantasmagoria (rank 9) | −0.04 ± 0.05 | −0.09 | +0.01 | 2.0 | no clear effect |  |
| 1361 | Channel Smite | 4 | Class | cleric | a melee Strike with a 1-action harm on the hit (2 actions) | −0.04 ± 0.03 | −0.03 | −0.05 | 0.8 | no clear effect |  |
| 1362 | Siren Song | 9 | Ancestry | — | inline save: 60-foot emanation, will (DC 25, 1/fight) | −0.04 ± 0.01 | −0.07 | −0.01 | 0.2 | no clear effect |  |
| 1363 | Slip the Grasp | 9 | Ancestry | — | Strike activity (requirement assumed: You are Grabbed, Immobilized, or Restrained) | −0.04 ± 0.04 | −0.07 | −0.02 | 2.1 | no clear effect |  |
| 1364 | Gluttonous Feast | 0 | Action | — | save | −0.04 ± 0.04 | −0.07 | −0.01 | 1.0 | no clear effect |  |
| 1365 | Momentous Charge | 6 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.04 ± 0.05 | −0.04 | −0.05 | 2.3 | no clear effect |  |
| 1366 | Basic Arcana | 4 | Class | — | Reach Spell: reach copies of 9 spells | −0.04 ± 0.04 | −0.14 | +0.06 | 0.0 | no clear effect | the AI never used it |
| 1367 | Speaker in Training | 5 | Ancestry | — | innate spell: Bless (rank 1), Fleet Step (rank 1) | −0.04 ± 0.03 | −0.02 | −0.07 | 1.0 | no clear effect |  |
| 1368 | Basic Breakthrough | 4 | Class | — | Searing Restoration: heals 2d10 (touch) | −0.04 ± 0.07 | +0.01 | −0.09 | 3.3 | no clear effect |  |
| 1369 | Reflexive Grapple | 12 | Class | — | Strike activity | −0.04 ± 0.06 | −0.05 | −0.03 | 8.2 | no clear effect |  |
| 1370 | Now You See Me | 14 | Class | — | check | −0.04 ± 0.06 | −0.02 | −0.07 | 2.4 | no clear effect |  |
| 1371 | Sacred Defender | 20 | Class | champion | PF2e rules (always on) | −0.04 ± 0.05 | −0.02 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1372 | Mortal Ascension | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1373 | Ascend | 14 | Class | — | PF2e rules (always on) | −0.04 ± 0.02 | −0.00 | −0.08 | 0.0 | no clear effect | the AI never used it |
| 1374 | Kaiju Stance | 8 | Class | monk | PF2e's stance Effect | −0.04 ± 0.07 | −0.12 | +0.03 | 1.0 | no clear effect |  |
| 1375 | Bestial Snarling | 2 | Class | bard | check | −0.05 ± 0.04 | +0.01 | −0.10 | 5.3 | no clear effect |  |
| 1376 | Explode | 0 | Action | inventor | inline save: 5-foot emanation, reflex, 2d6 fire (DC 17) | −0.05 ± 0.04 | −0.03 | −0.06 | 1.2 | no clear effect |  |
| 1377 | Whispers of Weakness | 1 | Class | oracle | +2 to its next attack (1 action) | −0.05 ± 0.05 | −0.11 | +0.02 | 1.7 | no clear effect |  |
| 1378 | Irradiate | 6 | Class | — | save | −0.05 ± 0.02 | −0.06 | −0.03 | 0.1 | no clear effect |  |
| 1379 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.05 ± 0.05 | +0.02 | −0.12 | 1.0 | no clear effect |  |
| 1380 | Stunt Performer Stance | 10 | Class | — | PF2e's stance Effect | −0.05 ± 0.06 | −0.09 | −0.00 | 1.0 | no clear effect |  |
| 1381 | Talmandor's Shout | 12 | Class | — | check | −0.05 ± 0.06 | −0.11 | +0.02 | 1.0 | no clear effect |  |
| 1382 | Faultless Defense | 14 | Class | — | self effect | −0.05 ± 0.03 | −0.08 | −0.02 | 3.0 | no clear effect |  |
| 1383 | To Me! | 18 | Class | — | Strike activity | −0.05 ± 0.04 | +0.00 | −0.10 | 2.4 | no clear effect |  |
| 1384 | Shadowcaster Dedication | 2 | Class | — | innate spell: Dazzling Flash (rank 1), Cloak of Shadow (rank 1) | −0.05 ± 0.04 | −0.03 | −0.07 | 0.8 | no clear effect |  |
| 1385 | Glass Skin | 10 | Class | — | innate spell: Mountain Resilience (rank 4) | −0.05 ± 0.02 | +0.01 | −0.11 | 0.7 | no clear effect |  |
| 1386 | Intimidating Spell | 6 | Class | — | Intimidating Spell copies of 3 spells | −0.05 ± 0.04 | −0.09 | −0.01 | 1.6 | no clear effect |  |
| 1387 | Disrupt Qi | 12 | Class | monk | Strike activity | −0.05 ± 0.09 | +0.18 | −0.28 | 4.9 | no clear effect |  |
| 1388 | Rain of Bolts | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 6d6 piercing (DC 25, 1/fight) | −0.05 ± 0.04 | −0.08 | −0.02 | 0.8 | no clear effect |  |
| 1389 | Ever-Vigilant Senses | 16 | Class | summoner | its eidolon's +2 Perception | −0.05 ± 0.06 | −0.05 | −0.05 | 0.0 | no clear effect | the AI never used it |
| 1390 | Spore Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1391 | Perfume Cloud | 9 | Ancestry | — | inline save: 10-foot emanation, fortitude (DC 25, 1/fight) | −0.05 ± 0.03 | −0.07 | −0.03 | 0.2 | no clear effect |  |
| 1392 | Terrifying Howl | 10 | Class | barbarian | Demoralize each enemy within 30 feet (Intimidation DC 22, once a fight) | −0.05 ± 0.04 | −0.10 | +0.00 | 1.0 | no clear effect |  |
| 1393 | Mountain Stance | 1 | Class | monk | PF2e's stance Effect | −0.05 ± 0.05 | +0.03 | −0.12 | 1.0 | no clear effect |  |
| 1394 | Mortal Herald Dedication | 12 | Class | — | innate spells: Atone (rank 4), Heal (rank 6), Harm (rank 6) | −0.05 ± 0.06 | −0.08 | −0.02 | 2.0 | no clear effect |  |
| 1395 | Gift of the Hoard | 10 | Class | — | innate spell: Dragon Breath (rank 3) | −0.05 ± 0.04 | +0.01 | −0.11 | 1.0 | no clear effect |  |
| 1396 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.05 ± 0.04 | −0.02 | −0.08 | 1.0 | no clear effect |  |
| 1397 | Grudging Compliment | 7 | Skill | — | check | −0.05 ± 0.03 | −0.08 | −0.02 | 2.2 | no clear effect |  |
| 1398 | Raise a Tome | 1 | Class | magus | a book raised for +2 AC | −0.05 ± 0.04 | +0.07 | −0.17 | 0.0 | no clear effect | the AI never used it |
| 1399 | Basic Fury | 4 | Class | — | Sudden Charge: Strike activity | −0.05 ± 0.04 | −0.13 | +0.03 | 0.0 | no clear effect | the AI never used it |
| 1400 | Endure Death's Touch | 10 | Class | — | PF2e rules (always on) | −0.05 ± 0.04 | +0.03 | −0.13 | 0.0 | no clear effect | the AI never used it |
| 1401 | Elemental Assault | 1 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.04 | +0.01 | −0.12 | 1.5 | no clear effect |  |
| 1402 | Vitality-Manipulating Stance | 20 | Class | monk | PF2e's stance Effect | −0.05 ± 0.08 | −0.13 | +0.02 | 1.0 | no clear effect |  |
| 1403 | Decompose | 0 | Action | — | inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.6 | hurts |  |
| 1404 | One-Inch Punch | 6 | Class | monk | a 2-action Strike with more weapon dice | −0.05 ± 0.06 | +0.13 | −0.23 | 7.7 | no clear effect |  |
| 1405 | Inscribe Shadow Pamor | 0 | Action | — | check | −0.05 ± 0.04 | −0.11 | +0.01 | 1.0 | no clear effect |  |
| 1406 | Dream Magic | 8 | Class | — | innate spell: Dream Message (rank 3), Sleep (rank 4) | −0.05 ± 0.03 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1407 | Form of the Beloved Mother | 17 | Ancestry | — | innate spell: Animal Form (rank 5), Slither (rank 5) | −0.05 ± 0.03 | −0.02 | −0.09 | 0.7 | no clear effect |  |
| 1408 | Moldersoul | 1 | Ancestry | — | Decompose: inline save: 5-foot emanation, fortitude, 1d6 void (DC 17, 1/fight) | −0.05 ± 0.02 | −0.13 | +0.02 | 0.7 | hurts |  |
| 1409 | Trial by Skyfire | 10 | Class | oracle | inline save: 10-foot emanation, reflex, 2d6 fire (DC 29) | −0.05 ± 0.03 | −0.08 | −0.02 | 1.6 | no clear effect |  |
| 1410 | Snakebird's Shadow | 8 | Class | monk | a Strike at up to two foes in a 15-foot line (its stance not checked) | −0.05 ± 0.04 | +0.00 | −0.11 | 1.9 | no clear effect |  |
| 1411 | Scout's Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.1 | hurts |  |
| 1412 | Ravenous Charge | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1413 | Interpose | 4 | Class | — | Strike activity | −0.05 ± 0.02 | −0.01 | −0.10 | 1.2 | hurts |  |
| 1414 | Roaring Charge | 0 | Action | commander | save | −0.05 ± 0.05 | +0.00 | −0.11 | 1.0 | no clear effect |  |
| 1415 | Blessed One Dedication | 2 | Class | — | focus spell: Lay on Hands (rank 1) | −0.06 ± 0.03 | −0.03 | −0.08 | 0.8 | no clear effect |  |
| 1416 | No Scar but This | 0 | Action | — | check | −0.06 ± 0.03 | −0.02 | −0.09 | 1.3 | no clear effect |  |
| 1417 | Goring Charge | 9 | Ancestry | — | Strike activity | −0.06 ± 0.03 | +0.01 | −0.13 | 2.0 | no clear effect |  |
| 1418 | Instinct Ability | 6 | Class | — | Sudden Charge: Strike activity | −0.06 ± 0.04 | −0.04 | −0.07 | 0.0 | no clear effect | the AI never used it |
| 1419 | Running Kick | 10 | Class | — | its companion's Running Kick (two Strides and a Strike) | −0.06 ± 0.03 | −0.08 | −0.04 | 3.2 | no clear effect |  |
| 1420 | Smite | 6 | Class | champion | +3 damage on its Strikes for a round (1 action) | −0.06 ± 0.06 | +0.01 | −0.12 | 3.3 | no clear effect |  |
| 1421 | Killing Stone | 13 | Ancestry | — | innate spell: Toxic Cloud (rank 5) | −0.06 ± 0.02 | −0.00 | −0.11 | 0.8 | hurts |  |
| 1422 | Group Taunt | 8 | Class | guardian | Taunt at up to three foes | −0.06 ± 0.04 | +0.03 | −0.15 | 0.0 | no clear effect | the AI never used it |
| 1423 | Unstoppable Juggernaut | 20 | Class | barbarian | PF2e rules (always on) | −0.06 ± 0.03 | −0.03 | −0.09 | 0.0 | hurts | the AI never used it |
| 1424 | Quill Spray | 9 | Ancestry | — | inline save: 30-foot cone, reflex, 5d8 piercing (DC 25, 1/fight) | −0.06 ± 0.03 | −0.10 | −0.01 | 1.0 | no clear effect |  |
| 1425 | Storm Shroud | 8 | Class | — | check | −0.06 ± 0.06 | +0.04 | −0.16 | 1.0 | no clear effect |  |
| 1426 | Tenacious Stance | 0 | Action | — | PF2e's stance Effect | −0.06 ± 0.05 | −0.08 | −0.04 | 1.0 | no clear effect |  |
| 1427 | Desiccating Inhalation | 12 | Class | — | inline save: 30-foot cone, reflex, 6d8 void (DC 31, 1/fight) | −0.06 ± 0.05 | −0.08 | −0.04 | 0.9 | no clear effect |  |
| 1428 | Planar Sidestep | 13 | Ancestry | — | self effect | −0.06 ± 0.03 | −0.03 | −0.09 | 3.7 | hurts |  |
| 1429 | Awaken the Obake | 13 | Ancestry | — | innate spell: Fear (rank 5) | −0.06 ± 0.04 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1430 | Pummeling Whirlpool | 13 | Ancestry | — | inline save: 10-foot emanation, reflex, 8d6 bludgeoning (DC 32, 1/fight) | −0.06 ± 0.02 | −0.07 | −0.05 | 0.3 | hurts |  |
| 1431 | Lantern Strobe | 0 | Action | — | save | −0.06 ± 0.03 | −0.12 | −0.01 | 0.6 | hurts |  |
| 1432 | Hag Magic | 13 | Ancestry | — | innate spells: Augury (rank 4), Charm (rank 1), Clairaudience (rank 3), Clairvoyance (rank 4), Dream Message (rank 3), Illusory Disguise (rank 1), Nightmare (rank 4), Spellwrack (rank 6), Earthbind (rank 3), Humanoid Form (rank 2), Mariner's Curse (rank 5), Water Walk (rank 2), Honeyed Words (rank 4), Outcast's Curse (rank 4) | −0.06 ± 0.04 | −0.02 | −0.10 | 2.1 | no clear effect |  |
| 1433 | Mammoth Charge | 6 | Class | — | Strike activity (requirement assumed: You are riding your megafauna companion) | −0.06 ± 0.03 | +0.00 | −0.13 | 1.7 | hurts |  |
| 1434 | Hellbreaker's Resolve | 4 | Class | — | its text's self buff (TempHP 4) | −0.06 ± 0.04 | −0.15 | +0.02 | 1.0 | no clear effect |  |
| 1435 | Revitalizing Finisher | 16 | Class | swashbuckler | its text's self buff (TempHP 8) | −0.06 ± 0.07 | +0.00 | −0.13 | 1.0 | no clear effect |  |
| 1436 | Cenotaph Stance | 20 | Class | — | PF2e's stance Effect | −0.07 ± 0.07 | −0.18 | +0.05 | 1.0 | no clear effect | with a weapon and a shield |
| 1437 | Impaling Finisher | 4 | Class | swashbuckler | Strike activity | −0.07 ± 0.04 | −0.12 | −0.01 | 2.2 | no clear effect |  |
| 1438 | Radiant Burst | 13 | Ancestry | — | save | −0.07 ± 0.04 | −0.11 | −0.02 | 1.0 | no clear effect |  |
| 1439 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.07 ± 0.07 | −0.04 | −0.09 | 1.0 | no clear effect |  |
| 1440 | Poison Weapon | 4 | Class | rogue | Poison Weapon: an Interact, then 1d4 poison on its next weapon hit | −0.07 ± 0.04 | −0.08 | −0.05 | 2.2 | no clear effect |  |
| 1441 | Battle Hymn to the Lost | 8 | Class | exemplar | inline save: 30-foot cone, reflex, 2d10 untyped (DC 24, 1/fight) | −0.07 ± 0.05 | −0.10 | −0.03 | 1.0 | no clear effect |  |
| 1442 | Taste Blood | 5 | Ancestry | — | save | −0.07 ± 0.03 | −0.05 | −0.08 | 2.6 | hurts |  |
| 1443 | Cadence Call | 6 | Class | — | check | −0.07 ± 0.04 | −0.13 | −0.01 | 1.0 | no clear effect |  |
| 1444 | Shadow Power | 14 | Class | — | innate spell: Shadow Blast (rank 5) | −0.07 ± 0.05 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1445 | Apprentice Sea Witch | 5 | Ancestry | — | innate spell: Create Water (rank 1), Hydraulic Push (rank 1) | −0.07 ± 0.03 | −0.09 | −0.05 | 1.0 | hurts |  |
| 1446 | Stalwart Defender Dedication | 2 | Class | — | Tenacious Stance: PF2e's stance Effect | −0.07 ± 0.04 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1447 | Lesson of Mutual Gambits | 8 | Class | — | check | −0.07 ± 0.06 | +0.19 | −0.32 | 5.1 | no clear effect |  |
| 1448 | Decree of Execution | 18 | Class | — | save | −0.07 ± 0.03 | +0.00 | −0.14 | 1.0 | hurts |  |
| 1449 | Daydream Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1450 | Enter Spirit Trance | 0 | Action | — | PF2e's self Effect | −0.07 ± 0.04 | −0.05 | −0.08 | 1.0 | no clear effect |  |
| 1451 | Flash of Omnipresence | 14 | Class | — | save | −0.07 ± 0.06 | −0.07 | −0.06 | 1.0 | no clear effect |  |
| 1452 | Sapping Symbol | 12 | Class | cleric | check | −0.07 ± 0.05 | −0.00 | −0.14 | 2.9 | no clear effect |  |
| 1453 | Zombie Horde (Necromancer) | 6 | Class | — | focus spell: Zombie Horde (rank 3) | −0.07 ± 0.04 | −0.09 | −0.04 | 3.3 | no clear effect |  |
| 1454 | Campfire Chronicler Dedication | 2 | Class | — | Offer Story: effect | −0.07 ± 0.05 | +0.02 | −0.16 | 0.0 | no clear effect | the AI never used it |
| 1455 | Reclaimant Plea | 12 | Class | — | innate spells: Air Walk (rank 4), Planar Tether (rank 4), Unfettered Movement (rank 4), Invisibility (rank 2), Cleanse Affliction (rank 2), Holy Light (rank 3), Death Ward (rank 14), Flame Strike (rank 5), Sunburst (rank 18) | −0.07 ± 0.06 | −0.10 | −0.04 | 1.0 | no clear effect |  |
| 1456 | Dueling Parry | 2 | Class | fighter | PF2e's self Effect | −0.07 ± 0.05 | −0.06 | −0.07 | 2.0 | no clear effect | with a one-handed weapon and a free hand |
| 1457 | Underwater Volcano | 17 | Ancestry | — | innate spell: Volcanic Eruption (rank 7) | −0.07 ± 0.04 | −0.08 | −0.06 | 1.0 | no clear effect |  |
| 1458 | Soothing Pulse | 4 | Class | — | Administer Ambient Magic: check | −0.07 ± 0.04 | −0.11 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 1459 | Crimson Shroud | 6 | Class | — | PF2e's self Effect | −0.07 ± 0.04 | −0.12 | −0.02 | 1.0 | no clear effect |  |
| 1460 | Come and Get Me | 10 | Class | barbarian | off-guard and +2 damage taken while raging; foes that hit it off-guard to it, temporary Hit Points as it hits them back | −0.07 ± 0.05 | −0.05 | −0.09 | 1.7 | no clear effect |  |
| 1461 | Antagonize | 2 | Class | swashbuckler | Demoralize (forced); frightened from it stays at 1 or more until the foe attacks it | −0.07 ± 0.04 | +0.03 | −0.18 | 3.2 | no clear effect |  |
| 1462 | Disciple's Breath | 16 | Class | — | save | −0.07 ± 0.05 | −0.11 | −0.03 | 2.4 | no clear effect |  |
| 1463 | Puncture Flesh | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1464 | Grapple | 0 | Action | — | check | −0.07 ± 0.04 | −0.10 | −0.04 | 1.8 | no clear effect |  |
| 1465 | Viper Strike | 9 | Ancestry | — | Strike activity | −0.07 ± 0.03 | −0.00 | −0.14 | 2.2 | hurts |  |
| 1466 | Wave Spiral | 12 | Class | monk | check (in Reflective Ripple Stance) | −0.07 ± 0.09 | −0.05 | −0.09 | 1.0 | no clear effect |  |
| 1467 | Stoney Skin | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1468 | Mortification | 4 | Class | — | PF2e rules (always on) | −0.07 ± 0.04 | −0.05 | −0.09 | 0.0 | no clear effect | the AI never used it |
| 1469 | Waking Dream | 8 | Class | — | innate spell: Waking Dream (rank 4) | −0.07 ± 0.06 | +0.01 | −0.16 | 1.0 | no clear effect |  |
| 1470 | Flash Your Badge | 10 | Class | — | check | −0.07 ± 0.06 | +0.02 | −0.17 | 2.8 | no clear effect |  |
| 1471 | Greater Deathly Secrets | 10 | Class | — | innate spells: Malignant Sustenance (rank 4), Grasping Grave (rank 5) | −0.07 ± 0.05 | −0.12 | −0.03 | 1.6 | no clear effect |  |
| 1472 | Plane-Stepping Dash | 1 | Ancestry | — | effect | −0.07 ± 0.04 | −0.05 | −0.09 | 2.0 | no clear effect |  |
| 1473 | Xidao Sea Mine Drop | 6 | Class | inventor | save | −0.07 ± 0.09 | −0.05 | −0.10 | 4.1 | no clear effect |  |
| 1474 | Invoke the Crimson Oath | 8 | Class | — | innate spell: Invoke the Crimson Oath (rank 2) | −0.07 ± 0.04 | −0.04 | −0.11 | 0.9 | no clear effect |  |
| 1475 | Tributary Circulation | 4 | Class | monk | +2 to Will saves for a round | −0.07 ± 0.07 | −0.10 | −0.05 | 3.2 | no clear effect |  |
| 1476 | Majestic Presence | 13 | Ancestry | — | inline save: 20-foot emanation, will (DC 32) | −0.07 ± 0.03 | −0.12 | −0.03 | 1.3 | hurts |  |
| 1477 | Advanced Elemental Spell | 6 | Class | druid | innate spells: Combustion (rank 3), Stone Lance (rank 3), Powerful Inhalation (rank 3), Pulverizing Cascade (rank 3) | −0.07 ± 0.06 | −0.09 | −0.06 | 2.5 | no clear effect |  |
| 1478 | Hone Claws | 9 | Ancestry | — | 1d6 bleed on its next hit (1 action, once a fight) | −0.07 ± 0.04 | −0.08 | −0.07 | 1.0 | no clear effect |  |
| 1479 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.07 ± 0.07 | −0.04 | −0.11 | 3.7 | no clear effect | with two weapons (longsword and shortsword) |
| 1480 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.08 ± 0.06 | −0.03 | −0.12 | 1.0 | no clear effect |  |
| 1481 | Meditate on This! | 14 | Class | barbarian | save | −0.08 ± 0.07 | −0.00 | −0.15 | 3.8 | no clear effect |  |
| 1482 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | −0.08 ± 0.05 | −0.04 | −0.11 | 5.9 | no clear effect |  |
| 1483 | Dragon Roar | 6 | Class | monk | save (in Dragon Stance) | −0.08 ± 0.04 | −0.10 | −0.06 | 0.3 | hurts |  |
| 1484 | Repel Ambient Magic | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.05 | −0.09 | −0.06 | 2.1 | no clear effect |  |
| 1485 | Tremor | 1 | Class | kineticist | save | −0.08 ± 0.04 | −0.11 | −0.05 | 2.2 | no clear effect |  |
| 1486 | Duelist's Challenge | 4 | Class | — | +its weapon dice damage on its Strikes (1 action, the fight) | −0.08 ± 0.06 | −0.17 | +0.01 | 1.0 | no clear effect |  |
| 1487 | Unending Emptiness | 14 | Class | — | innate spell: Darklight (rank 7) | −0.08 ± 0.04 | −0.05 | −0.11 | 0.8 | hurts |  |
| 1488 | Unfaltering Ranks | 17 | Ancestry | — | check | −0.08 ± 0.05 | −0.08 | −0.08 | 3.1 | no clear effect |  |
| 1489 | Divine Declaration | 17 | Ancestry | — | innate spell: Divine Decree (rank 7) | −0.08 ± 0.05 | −0.11 | −0.05 | 1.0 | no clear effect |  |
| 1490 | Wood Ward | 17 | Ancestry | — | self effect | −0.08 ± 0.04 | +0.02 | −0.18 | 4.4 | hurts |  |
| 1491 | Breath of Calamity | 17 | Ancestry | — | innate spell: Chain Lightning (rank 7) | −0.08 ± 0.05 | −0.10 | −0.06 | 1.0 | no clear effect |  |
| 1492 | Incredible Ricochet | 12 | Class | fighter | a ranged press Strike ignoring concealment and cover | −0.08 ± 0.05 | −0.12 | −0.03 | 8.3 | no clear effect | with a loaded arquebus |
| 1493 | Stonestrike Stance | 0 | Action | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1494 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | −0.08 ± 0.03 | −0.11 | −0.06 | 5.3 | hurts |  |
| 1495 | Howling Aspect | 1 | Ancestry | — | PF2e's self Effect | −0.08 ± 0.04 | −0.05 | −0.11 | 1.0 | no clear effect |  |
| 1496 | Fiendish Brand | 6 | Class | — | Strike activity | −0.08 ± 0.04 | −0.15 | −0.02 | 2.5 | hurts |  |
| 1497 | Abrasive Drag | 12 | Class | — | check | −0.08 ± 0.05 | +0.17 | −0.34 | 3.0 | no clear effect |  |
| 1498 | Warped Reflection | 1 | Ancestry | — | save | −0.08 ± 0.04 | −0.01 | −0.15 | 1.0 | hurts |  |
| 1499 | Idol Threat | 13 | Ancestry | — | check | −0.08 ± 0.04 | −0.09 | −0.08 | 3.9 | hurts |  |
| 1500 | Calculate Threats | 0 | Action | psychic | PF2e's self Effect | −0.08 ± 0.04 | −0.15 | −0.01 | 2.2 | hurts |  |
| 1501 | Multitalented | 9 | Ancestry | — | Barbarian Dedication: Rage (+2 damage with its Greatsword) | −0.08 ± 0.05 | −0.15 | −0.01 | 1.0 | no clear effect |  |
| 1502 | Devoted Guardian | 2 | Class | champion | an Effect on an ally | −0.08 ± 0.04 | −0.12 | −0.05 | 5.0 | no clear effect |  |
| 1503 | Ultimatum of Liberation | 0 | Action | — | save | −0.08 ± 0.04 | −0.03 | −0.13 | 1.0 | hurts |  |
| 1504 | Wrath of the Hold | 8 | Class | — | inline save: 30-foot cone, will, 4d6 spirit (DC 24) | −0.08 ± 0.05 | −0.03 | −0.13 | 2.0 | no clear effect |  |
| 1505 | Seven-Colored Cosmic Bridge | 18 | Class | exemplar | Fleeting Arc through Heaven and Earth: inline save: 60-foot cone, fortitude, 9d6 spirit (DC 38) | −0.08 ± 0.04 | −0.07 | −0.10 | 1.3 | hurts |  |
| 1506 | Stonebound Magic | 6 | Class | — | innate spell: Scatter Scree (rank 3), One with Stone (rank 8), Shape Stone (rank 10), Wall of Stone (rank 12) | −0.09 ± 0.04 | −0.09 | −0.08 | 2.0 | no clear effect |  |
| 1507 | Feast | 4 | Class | — | check | −0.09 ± 0.03 | −0.13 | −0.04 | 1.8 | hurts |  |
| 1508 | Rallying Cry | 17 | Ancestry | — | its text's self buff (TempHP 17) | −0.09 ± 0.04 | −0.12 | −0.05 | 1.0 | no clear effect |  |
| 1509 | Lead by Example | 8 | Class | — | Strike activity | −0.09 ± 0.04 | −0.04 | −0.13 | 6.8 | hurts |  |
| 1510 | Backup Runic Enhancement | 1 | Class | — | innate spells: Sigil (rank 1), Runic Body (rank 1), Runic Weapon (rank 1) | −0.09 ± 0.07 | +0.12 | −0.29 | 1.0 | no clear effect |  |
| 1511 | Storming Gaze | 5 | Ancestry | — | inline save: 15-foot cone, reflex, 3d4 fire (DC 21) | −0.09 ± 0.03 | −0.12 | −0.05 | 1.6 | hurts |  |
| 1512 | Ocean's Balm | 1 | Class | kineticist | impulse heal: 1d8 (30 feet) | −0.09 ± 0.04 | −0.07 | −0.11 | 2.7 | hurts |  |
| 1513 | Hail of Splinters | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.11 | −0.07 | 0.5 | hurts |  |
| 1514 | Enervating Wail | 6 | Class | — | save | −0.09 ± 0.03 | −0.13 | −0.04 | 1.0 | hurts |  |
| 1515 | Fade Into Daydreams | 0 | Action | psychic | check | −0.09 ± 0.04 | −0.16 | −0.01 | 1.9 | hurts |  |
| 1516 | Corpse Tender's Font | 4 | Class | — | innate spell: Harm (rank 1) | −0.09 ± 0.05 | −0.06 | −0.12 | 1.0 | no clear effect |  |
| 1517 | Evangelize | 7 | Skill | — | check | −0.09 ± 0.03 | −0.06 | −0.12 | 2.1 | hurts |  |
| 1518 | Kitsune Spell Expertise | 13 | Ancestry | — | innate spells: Confusion (rank 4), Death Ward (rank 5), Illusory Scene (rank 5) | −0.09 ± 0.04 | −0.11 | −0.06 | 1.0 | hurts |  |
| 1519 | Threatening Pursuit | 13 | Ancestry | — | check | −0.09 ± 0.04 | −0.11 | −0.07 | 3.9 | hurts |  |
| 1520 | Alloy Flesh and Steel | 14 | Class | kineticist | PF2e's self Effect | −0.09 ± 0.10 | −0.09 | −0.09 | 1.0 | no clear effect |  |
| 1521 | Daring Act | 6 | Class | — | check | −0.09 ± 0.04 | −0.07 | −0.11 | 2.4 | hurts |  |
| 1522 | Targeting Shot | 14 | Class | ranger | a ranged press Strike ignoring concealment and cover | −0.09 ± 0.07 | +0.00 | −0.18 | 13.2 | no clear effect |  |
| 1523 | Restorative Strike | 4 | Class | cleric | Strike activity (requirement assumed: You have a Harm or Heal spell you can cast) | −0.09 ± 0.04 | −0.10 | −0.09 | 1.4 | hurts |  |
| 1524 | Starlit Sentinel Dedication | 2 | Class | — | Starlit Transformation: PF2e's self Effect | −0.09 ± 0.04 | +0.04 | −0.22 | 0.0 | hurts | the AI never used it |
| 1525 | Tidal Hands | 1 | Class | kineticist | save | −0.09 ± 0.03 | −0.13 | −0.05 | 0.8 | hurts |  |
| 1526 | Twin Feint | 1 | Class | rogue | two Strikes at one foe, off-guard to the second | −0.09 ± 0.04 | +0.04 | −0.22 | 1.7 | hurts | with two weapons (longsword and shortsword) |
| 1527 | Topple Foe | 10 | Class | — | check | −0.09 ± 0.04 | −0.01 | −0.18 | 4.6 | hurts |  |
| 1528 | Kneecap | 5 | Ancestry | — | Strike activity | −0.09 ± 0.02 | −0.08 | −0.11 | 5.8 | hurts |  |
| 1529 | Kitsune Spell Mysteries | 5 | Ancestry | — | innate spell: Bane (rank 1), Illusory Object (rank 1), Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1530 | Tranquil Sanctuary | 5 | Ancestry | — | innate spell: Sanctuary (rank 1) | −0.09 ± 0.03 | −0.09 | −0.09 | 3.3 | hurts |  |
| 1531 | Shard Strike | 1 | Class | kineticist | inline save: 15-foot cone, reflex, 1d6 slashing (DC 17) | −0.09 ± 0.03 | −0.15 | −0.03 | 0.7 | hurts |  |
| 1532 | Rivethun Invoker Dedication | 2 | Class | — | Enter Spirit Trance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 0.0 | hurts | the AI never used it |
| 1533 | Herald's Strike | 20 | Class | — | save | −0.09 ± 0.07 | +0.08 | −0.27 | 3.3 | no clear effect |  |
| 1534 | Swimming Charge | 5 | Ancestry | — | check (requirement assumed: You are swimming in water) | −0.09 ± 0.03 | −0.13 | −0.06 | 2.3 | hurts |  |
| 1535 | Stone Brawler Dedication | 2 | Class | — | Stonestrike Stance: PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1536 | Ursine Avenger Form | 2 | Class | — | PF2e's self Effect | −0.09 ± 0.05 | +0.00 | −0.19 | 1.0 | hurts |  |
| 1537 | Offer Story | 0 | Action | — | effect | −0.09 ± 0.05 | −0.09 | −0.10 | 4.2 | no clear effect |  |
| 1538 | Swirl Crimson Shroud | 0 | Action | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1539 | Hydraulic Deflection | 1 | Ancestry | — | PF2e's self Effect | −0.09 ± 0.05 | −0.09 | −0.10 | 2.1 | no clear effect |  |
| 1540 | Ceremony of Protection | 1 | Ancestry | — | its text's self buff (FlatModifier ac 1) | −0.09 ± 0.05 | −0.09 | −0.10 | 1.9 | no clear effect |  |
| 1541 | Belly Flop | 10 | Class | guardian | Strike activity | −0.09 ± 0.05 | −0.17 | −0.02 | 10.4 | hurts |  |
| 1542 | Renewed Vigor | 8 | Class | barbarian | its text's self buff (TempHP 4) | −0.10 ± 0.06 | +0.05 | −0.24 | 1.0 | no clear effect |  |
| 1543 | Pack Movement | 8 | Class | — | a Stride and a Strike, its companion's Strike beside it | −0.10 ± 0.04 | −0.12 | −0.07 | 6.3 | hurts |  |
| 1544 | Avenger of Gluttony | 14 | Class | — | Gluttonous Feast: save | −0.10 ± 0.05 | −0.15 | −0.04 | 0.0 | no clear effect | the AI never used it |
| 1545 | Uncanny Prediction | 8 | Class | — | save (requirement assumed: You're benefiting from the bonuses of Size Up. You have an eerie ability to guess the next move of creatures you've Sized Up) | −0.10 ± 0.06 | +0.19 | −0.39 | 2.8 | no clear effect |  |
| 1546 | Mind Shards | 6 | Class | — | save | −0.10 ± 0.03 | −0.11 | −0.08 | 0.9 | hurts |  |
| 1547 | Wait For It... | 0 | Action | commander | an Effect on an ally | −0.10 ± 0.06 | −0.11 | −0.09 | 5.0 | no clear effect |  |
| 1548 | Elite Dracomancer | 13 | Ancestry | — | innate spell: Clairvoyance (rank 3), Paralyze (rank 3) | −0.10 ± 0.04 | −0.14 | −0.05 | 1.0 | hurts |  |
| 1549 | Restitch | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1550 | Regrowth | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1551 | Nodal Regeneration | 17 | Ancestry | — | innate spell: Regenerate (rank 7) | −0.10 ± 0.05 | −0.12 | −0.08 | 1.0 | hurts |  |
| 1552 | Compliant Gold | 12 | Class | exemplar | Topple the Pillar of Heaven: inline save: 60-foot line, reflex, 6d8 untyped (DC 31) | −0.10 ± 0.06 | −0.08 | −0.12 | 3.6 | no clear effect |  |
| 1553 | Venomous Touch | 12 | Class | — | innate spell: Purple Worm Sting (rank 6) | −0.10 ± 0.06 | −0.13 | −0.07 | 1.0 | no clear effect |  |
| 1554 | Penetrating Shot | 10 | Class | ranger | a Strike at up to 2 foes | −0.10 ± 0.04 | +0.00 | −0.20 | 3.3 | hurts |  |
| 1555 | Frightening Power | 12 | Class | — | save | −0.10 ± 0.07 | −0.34 | +0.14 | 11.7 | no clear effect |  |
| 1556 | Shadow's Assault | 13 | Ancestry | — | innate spell: Shadow Blast (rank 5) | −0.10 ± 0.03 | −0.11 | −0.09 | 1.0 | hurts |  |
| 1557 | Hurricane Swing | 17 | Ancestry | — | innate spells: Lightning Bolt (rank 3), Gust of Wind (rank 1) | −0.10 ± 0.04 | −0.07 | −0.13 | 2.0 | hurts |  |
| 1558 | Stoney Deflection | 6 | Class | — | effect (in Stonestrike Stance) | −0.10 ± 0.05 | −0.03 | −0.17 | 2.0 | no clear effect |  |
| 1559 | Searing Restoration | 2 | Class | inventor | heals 1d10 (touch) | −0.10 ± 0.04 | −0.09 | −0.11 | 2.8 | hurts |  |
| 1560 | Mummy's Despair | 6 | Class | — | each enemy within 30 feet saves (will, DC 22) or is frightened (2 actions, once a fight) | −0.10 ± 0.04 | −0.18 | −0.02 | 1.0 | hurts |  |
| 1561 | Repair Module | 9 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.05 | −0.16 | −0.04 | 1.0 | hurts |  |
| 1562 | Tidal Shield | 17 | Ancestry | — | PF2e's self Effect | −0.10 ± 0.04 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1563 | Overwhelming Blow | 16 | Class | fighter | Strike activity | −0.10 ± 0.06 | −0.05 | −0.16 | 4.5 | no clear effect |  |
| 1564 | Frightful Moan | 4 | Class | — | inline save: 30-foot emanation, will (DC 20, 1/fight) | −0.10 ± 0.03 | −0.16 | −0.05 | 0.3 | hurts |  |
| 1565 | Ponpoko-Pon! | 13 | Ancestry | — | inline save: 30-foot cone, fortitude, 7d4 sonic (DC 32) | −0.10 ± 0.03 | −0.10 | −0.11 | 1.3 | hurts |  |
| 1566 | Jotun's Grasp | 5 | Ancestry | — | check | −0.10 ± 0.03 | −0.16 | −0.05 | 2.1 | hurts |  |
| 1567 | Manifold Conduit | 12 | Class | — | innate spell: Entreat the Many (rank 6) | −0.10 ± 0.06 | −0.22 | +0.01 | 1.0 | no clear effect |  |
| 1568 | Doom of Sailors | 17 | Ancestry | — | save | −0.11 ± 0.05 | −0.14 | −0.07 | 1.0 | hurts |  |
| 1569 | Velstrac Magic | 9 | Ancestry | — | innate spell: Telekinetic Maneuver (rank 2), Web (rank 2) | −0.11 ± 0.03 | −0.02 | −0.19 | 1.0 | hurts |  |
| 1570 | Scarlet Strands | 9 | Ancestry | — | innate spell: Web (rank 4) | −0.11 ± 0.03 | −0.02 | −0.19 | 1.0 | hurts |  |
| 1571 | Sovereign's Blade | 18 | Class | — | an Effect on an ally | −0.11 ± 0.06 | −0.14 | −0.07 | 6.0 | no clear effect |  |
| 1572 | Wyldsinger | 4 | Class | — | innate spell: Menacing Lament (rank 2), Valiant Anthem (rank 2) | −0.11 ± 0.04 | −0.12 | −0.09 | 1.0 | hurts |  |
| 1573 | Avenging Runelord Dedication | 12 | Class | — | innate spells: Darkvision (rank 2), Mystic Armor (rank 1), Runic Body (rank 1), Runic Weapon (rank 1), See the Unseen (rank 2), Sending (rank 5), Truesight (rank 6) | −0.11 ± 0.06 | −0.08 | −0.13 | 1.0 | no clear effect |  |
| 1574 | Worm's Feast | 6 | Class | — | save | −0.11 ± 0.05 | −0.15 | −0.06 | 1.0 | hurts |  |
| 1575 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | −0.11 ± 0.07 | −0.15 | −0.06 | 4.3 | no clear effect | with two weapons (longsword and shortsword) |
| 1576 | Shattering Strike (Monk) | 16 | Class | monk | Strike activity | −0.11 ± 0.10 | +0.02 | −0.24 | 11.0 | no clear effect |  |
| 1577 | Boulder Roll | 5 | Ancestry | — | save | −0.11 ± 0.03 | −0.15 | −0.07 | 2.3 | hurts |  |
| 1578 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.11 ± 0.06 | −0.14 | −0.08 | 1.0 | no clear effect |  |
| 1579 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | −0.11 ± 0.04 | −0.02 | −0.20 | 2.1 | hurts |  |
| 1580 | Magic Hide | 2 | Class | ranger | focus spell: Magic Hide (rank 1) | −0.11 ± 0.06 | −0.08 | −0.14 | 1.9 | no clear effect |  |
| 1581 | Eternity-Incinerating Blaze | 18 | Class | exemplar | Burn out of Time: heals 5d8 (touch) | −0.11 ± 0.04 | −0.13 | −0.09 | 1.8 | hurts |  |
| 1582 | Vivacious Bravado | 8 | Class | swashbuckler | with panache, temporary Hit Points of its level plus Charisma until its next turn | −0.11 ± 0.05 | −0.23 | +0.01 | 2.5 | hurts |  |
| 1583 | Demoralize | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1584 | Haunting Visage | 0 | Action | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.7 | hurts |  |
| 1585 | Terrifying Croak | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1586 | Sudden Terror | 1 | Ancestry | — | check | −0.11 ± 0.04 | −0.01 | −0.21 | 1.8 | hurts |  |
| 1587 | Conductive Sphere | 8 | Class | kineticist | save | −0.11 ± 0.09 | −0.17 | −0.05 | 5.5 | no clear effect |  |
| 1588 | Hypnotic Lure | 5 | Ancestry | — | inline save: 1 creature, 30 feet, will (DC 21, 1/fight) | −0.11 ± 0.03 | −0.16 | −0.06 | 1.2 | hurts |  |
| 1589 | Extravagant Parry | 1 | Class | swashbuckler | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.05 | −0.07 | −0.15 | 2.2 | hurts |  |
| 1590 | Buckler Dance | 10 | Class | swashbuckler | stance: its buckler always raised | −0.11 ± 0.05 | −0.08 | −0.14 | 1.0 | hurts |  |
| 1591 | Aerial Boomerang | 1 | Class | kineticist | save | −0.11 ± 0.05 | −0.18 | −0.05 | 2.2 | hurts |  |
| 1592 | Shattershields | 12 | Class | kineticist | its text's self buff (FlatModifier ac 1) | −0.11 ± 0.06 | −0.13 | −0.10 | 1.0 | no clear effect |  |
| 1593 | Shackles of Law | 0 | Bonus | — | Strike activity | −0.11 ± 0.05 | −0.11 | −0.12 | 2.1 | hurts |  |
| 1594 | Zombie Dedication | 2 | Class | — | PF2e rules (always on) | −0.11 ± 0.04 | −0.11 | −0.11 | 0.0 | hurts | the AI never used it |
| 1595 | Waters of Creation | 10 | Class | oracle | check | −0.11 ± 0.06 | −0.14 | −0.09 | 2.3 | no clear effect |  |
| 1596 | Reprisal of the Fallen | 18 | Class | — | innate spells: Invoke Spirits (rank 9), Wails of the Damned (rank 9) | −0.11 ± 0.06 | −0.27 | +0.05 | 2.0 | no clear effect |  |
| 1597 | Tidal Wave | 16 | Class | — | 2 Strikes | −0.11 ± 0.06 | +0.01 | −0.23 | 3.9 | no clear effect |  |
| 1598 | Hush | 14 | Class | — | save (requirement assumed: You are veiled) | −0.11 ± 0.06 | +0.04 | −0.27 | 3.5 | no clear effect |  |
| 1599 | Basic Hunter's Trick | 4 | Class | — | Hunter's Aim: Strike activity | −0.11 ± 0.08 | −0.08 | −0.14 | 0.0 | no clear effect | the AI never used it |
| 1600 | Triple Time | 4 | Class | bard | innate spell: Triple Time (rank 2) | −0.11 ± 0.05 | −0.10 | −0.12 | 12.7 | hurts |  |
| 1601 | Tail Spin | 5 | Ancestry | — | check | −0.11 ± 0.03 | −0.13 | −0.10 | 2.3 | hurts |  |
| 1602 | Defend Summoner | 4 | Class | summoner | its text's self buff (FlatModifier ac 2) | −0.12 ± 0.07 | −0.12 | −0.11 | 2.9 | no clear effect |  |
| 1603 | Strident Command | 10 | Class | — | innate spell: Command (rank 1) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.5 | hurts |  |
| 1604 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | PF2e's stance Effect | −0.12 ± 0.05 | −0.07 | −0.16 | 1.0 | hurts |  |
| 1605 | Mounted Shield | 6 | Class | — | its raised shield's bonus to its mount's AC too | −0.12 ± 0.05 | −0.26 | +0.03 | 0.0 | hurts | with a weapon and a shield; the AI never used it |
| 1606 | Necrotic Bomber | 4 | Class | — | innate spell: Necrotic Bomb (rank 1) | −0.12 ± 0.04 | −0.10 | −0.13 | 1.0 | hurts |  |
| 1607 | Ka Stone Ritual | 4 | Class | — | casts Enlarge (rank 2, DC 20, 1/fight) | −0.12 ± 0.05 | −0.11 | −0.12 | 1.0 | hurts |  |
| 1608 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.12 ± 0.05 | −0.11 | −0.13 | 1.0 | hurts |  |
| 1609 | Mountain Stronghold | 6 | Class | monk | effect (in Mountain Stance) | −0.12 ± 0.07 | −0.01 | −0.23 | 7.6 | no clear effect |  |
| 1610 | Raise Symbol | 4 | Class | cleric | self effect | −0.12 ± 0.04 | −0.21 | −0.04 | 3.5 | hurts |  |
| 1611 | Supernatural Charm | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1612 | Devilish Wiles | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1613 | Enthralling Allure | 5 | Ancestry | — | innate spell: Charm (rank 1) | −0.12 ± 0.03 | −0.19 | −0.05 | 1.1 | hurts |  |
| 1614 | Dragon Prince | 9 | Ancestry | — | innate spell: Dragon Breath (rank 3) | −0.12 ± 0.04 | −0.13 | −0.11 | 1.0 | hurts |  |
| 1615 | Webslinger | 13 | Ancestry | — | casts Web (rank 2, DC 32, 1/fight) | −0.12 ± 0.03 | −0.09 | −0.15 | 1.0 | hurts |  |
| 1616 | Harden Flesh | 10 | Class | druid | resistance to physical damage until its next turn | −0.12 ± 0.05 | −0.00 | −0.24 | 3.3 | hurts |  |
| 1617 | Friendly Nudge | 1 | Ancestry | — | check | −0.12 ± 0.03 | −0.13 | −0.12 | 0.8 | hurts |  |
| 1618 | Celestial Cacophony | 12 | Class | inventor | save | −0.12 ± 0.07 | −0.09 | −0.15 | 1.4 | no clear effect |  |
| 1619 | Aether Beam | 8 | Class | — | save (requirement assumed: You are overflowing) | −0.13 ± 0.06 | −0.09 | −0.16 | 3.5 | hurts |  |
| 1620 | Swamp Gas Form | 13 | Ancestry | — | innate spell: Vapor Form (rank 4) | −0.13 ± 0.04 | −0.17 | −0.08 | 1.0 | hurts |  |
| 1621 | Pounce Mimicry | 14 | Class | — | Strike activity | −0.13 ± 0.06 | −0.04 | −0.22 | 4.2 | hurts |  |
| 1622 | Starlit Spells | 10 | Class | — | innate spells: Revealing Light (rank 3), Holy Light (rank 3) | −0.13 ± 0.05 | −0.13 | −0.12 | 2.0 | hurts |  |
| 1623 | Bloom of Health | 14 | Class | — | an Effect on an ally | −0.13 ± 0.06 | −0.16 | −0.09 | 7.7 | hurts |  |
| 1624 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | −0.13 ± 0.04 | −0.16 | −0.10 | 1.0 | hurts |  |
| 1625 | Alluring Performance | 9 | Ancestry | — | check | −0.13 ± 0.04 | −0.10 | −0.16 | 1.0 | hurts |  |
| 1626 | Thunder Clap | 6 | Class | — | inline save: 15-foot cone, fortitude, 3d6 sonic (DC 22) | −0.13 ± 0.04 | −0.16 | −0.10 | 1.7 | hurts |  |
| 1627 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.13 ± 0.04 | −0.05 | −0.22 | 2.3 | hurts |  |
| 1628 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.13 ± 0.06 | −0.13 | −0.14 | 4.7 | hurts |  |
| 1629 | Tears of Pearl | 9 | Ancestry | — | save | −0.13 ± 0.05 | −0.07 | −0.19 | 1.0 | hurts |  |
| 1630 | Devastating Spellstrike | 4 | Class | magus | check | −0.13 ± 0.09 | −0.03 | −0.23 | 2.7 | no clear effect |  |
| 1631 | Trickster Tengu | 17 | Ancestry | — | innate spells: Aerial Form (rank 4), Cursed Metamorphosis (rank 7) | −0.13 ± 0.05 | −0.20 | −0.06 | 1.0 | hurts |  |
| 1632 | Part the Veil | 0 | Action | — | check | −0.13 ± 0.05 | −0.12 | −0.15 | 1.0 | hurts |  |
| 1633 | Empathic Calm | 5 | Ancestry | — | innate spells: Calm (rank 2), Sanctuary (rank 3) | −0.13 ± 0.04 | −0.24 | −0.03 | 5.7 | hurts |  |
| 1634 | Burn out of Time | 0 | Action | — | heals 5d8 (touch) | −0.13 ± 0.03 | −0.12 | −0.15 | 0.8 | hurts |  |
| 1635 | Companion's Cry | 4 | Class | ranger | Commanded with 2 actions every turn: the companion's third action | −0.13 ± 0.06 | −0.18 | −0.09 | 0.0 | hurts | the AI never used it |
| 1636 | Shove | 0 | Action | — | check | −0.13 ± 0.04 | −0.11 | −0.16 | 0.9 | hurts | with a one-handed weapon and a free hand |
| 1637 | Storyteller's Mask | 20 | Class | druid | innate spell: Foresight (rank 9) | −0.13 ± 0.07 | −0.03 | −0.24 | 4.2 | no clear effect |  |
| 1638 | Veil Dancer Dedication | 2 | Class | — | Part the Veil: check | −0.13 ± 0.05 | +0.02 | −0.29 | 0.0 | hurts | the AI never used it |
| 1639 | Nocturnal Kindred | 4 | Class | — | innate spell: Animal Allies (rank 1) | −0.14 ± 0.04 | −0.21 | −0.06 | 1.0 | hurts |  |
| 1640 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.14 ± 0.05 | −0.07 | −0.20 | 2.8 | hurts |  |
| 1641 | Poisoner's Twist | 4 | Class | — | check | −0.14 ± 0.04 | −0.08 | −0.20 | 5.8 | hurts |  |
| 1642 | Flickering Twirl | 12 | Class | — | check | −0.14 ± 0.06 | −0.15 | −0.13 | 3.7 | hurts |  |
| 1643 | Heroes' Call | 9 | Ancestry | — | innate spell: Heroism (rank 3) | −0.14 ± 0.04 | −0.09 | −0.19 | 1.0 | hurts |  |
| 1644 | Mentor of Legends | 9 | Ancestry | — | innate spell: Heroism (rank 5) | −0.14 ± 0.04 | −0.09 | −0.19 | 1.0 | hurts |  |
| 1645 | Channel Divine Spark | 14 | Class | — | PF2e's self Effect | −0.14 ± 0.06 | −0.00 | −0.27 | 1.0 | hurts |  |
| 1646 | Shaitan Magic | 9 | Ancestry | — | innate spells: Revealing Light (rank 2), Resist Energy (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1647 | Celestial Magic | 9 | Ancestry | — | innate spells: Clear Mind (rank 2), Everlight (rank 2), Humanoid Form (rank 2), Revealing Light (rank 2), Share Life (rank 2), Sure Footing (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1648 | First World Adept | 9 | Ancestry | — | innate spell: Invisibility (rank 2), Revealing Light (rank 2) | −0.14 ± 0.04 | −0.22 | −0.06 | 1.0 | hurts |  |
| 1649 | Valkyrie's Charge | 0 | Action | commander | check | −0.14 ± 0.05 | −0.11 | −0.16 | 0.7 | hurts |  |
| 1650 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.14 ± 0.03 | −0.06 | −0.22 | 3.9 | hurts |  |
| 1651 | Dragonet Breath | 1 | Ancestry | — | save | −0.14 ± 0.03 | −0.23 | −0.05 | 0.7 | hurts |  |
| 1652 | Cavalier's Charge | 4 | Class | — | its mount's two Strides and a Strike at +1 | −0.14 ± 0.04 | −0.23 | −0.05 | 2.6 | hurts |  |
| 1653 | Penetrating Projectile | 16 | Class | barbarian | a ranged Strike at up to two foes in a line, raging | −0.14 ± 0.05 | +0.00 | −0.28 | 4.1 | hurts | with a loaded arquebus |
| 1654 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.14 ± 0.06 | −0.14 | −0.14 | 4.0 | hurts |  |
| 1655 | Storming Breath | 6 | Class | — | inline save: 30-foot cone, reflex, 4d6 untyped (DC 22) | −0.14 ± 0.04 | −0.22 | −0.07 | 1.5 | hurts |  |
| 1656 | Unfettered Growth | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.14 ± 0.04 | −0.19 | −0.10 | 1.0 | hurts |  |
| 1657 | Stridulating Song | 0 | Action | — | save | −0.14 ± 0.04 | −0.10 | −0.18 | 1.0 | hurts |  |
| 1658 | Perfect Ki Grandmaster | 18 | Class | — | innate spells: Unblinking Flame Ignition (rank 9), Unbreaking Wave Containment (rank 9), Unfolding Wind Crash (rank 9), Untwisting Iron Pillar (rank 9) | −0.14 ± 0.05 | −0.25 | −0.04 | 2.0 | hurts |  |
| 1659 | Impaling Bone | 17 | Ancestry | — | innate spell: Impaling Spike (rank 7) | −0.14 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1660 | Edict of Mortality | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1661 | Majestic Proclamation | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1662 | Walk the Plank | 8 | Class | — | check | −0.14 ± 0.06 | −0.02 | −0.27 | 2.8 | hurts |  |
| 1663 | Font of Life or Death | 16 | Class | — | innate spells: Heal (rank 1), Harm (rank 8) | −0.14 ± 0.07 | −0.18 | −0.11 | 2.0 | hurts |  |
| 1664 | Pointed Question | 0 | Action | investigator | check | −0.14 ± 0.06 | −0.01 | −0.28 | 2.6 | hurts |  |
| 1665 | Armored Courage | 4 | Class | guardian | PF2e's self Effect | −0.15 ± 0.05 | −0.22 | −0.07 | 1.0 | hurts |  |
| 1666 | Lightning Rod | 6 | Class | kineticist | check | −0.15 ± 0.09 | +0.02 | −0.31 | 4.3 | no clear effect |  |
| 1667 | Disturbing Knowledge | 7 | Skill | — | check | −0.15 ± 0.04 | −0.13 | −0.17 | 2.4 | hurts |  |
| 1668 | Unyielding Force | 20 | Class | guardian | PF2e rules (always on) | −0.15 ± 0.05 | +0.02 | −0.31 | 0.0 | hurts | the AI never used it |
| 1669 | Breath of the Dragon (Dragonblood) | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 0.8 | hurts |  |
| 1670 | Kobold Breath | 1 | Ancestry | — | save | −0.15 ± 0.03 | −0.18 | −0.12 | 1.2 | hurts |  |
| 1671 | Blessed Sentinel | 6 | Class | — | Strike activity | −0.15 ± 0.04 | −0.18 | −0.11 | 2.4 | hurts |  |
| 1672 | Fleet Tempo | 4 | Class | — | effect | −0.15 ± 0.05 | −0.14 | −0.15 | 2.0 | hurts |  |
| 1673 | Sleepwalker Dedication | 4 | Class | — | Daydream Trance: PF2e's self Effect | −0.15 ± 0.06 | −0.28 | −0.02 | 0.0 | hurts | the AI never used it |
| 1674 | Jinx | 0 | Action | — | save | −0.15 ± 0.04 | −0.09 | −0.20 | 1.0 | hurts |  |
| 1675 | Dragon Breath | 0 | Action | — | inline save: 30-foot cone, reflex, 1d6 untyped (DC 17, 1/fight) | −0.15 ± 0.04 | −0.14 | −0.16 | 0.8 | hurts |  |
| 1676 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.15 ± 0.04 | −0.07 | −0.23 | 2.7 | hurts |  |
| 1677 | Flinging Blow | 16 | Class | monk | Strike activity | −0.15 ± 0.10 | −0.00 | −0.30 | 6.3 | no clear effect |  |
| 1678 | Night's Glow | 6 | Class | — | innate spells: Moonbeam (rank 1), Zenith Star (rank 1) | −0.15 ± 0.05 | −0.17 | −0.14 | 1.0 | hurts |  |
| 1679 | Efreeti Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Illusory Object (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1680 | Towering Growth | 9 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1681 | Legendary Size | 9 | Ancestry | — | innate spells: Enlarge (rank 2), Shrink (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1682 | Janni Magic | 9 | Ancestry | — | innate spell: Enlarge (rank 2), Speak with Animals (rank 2) | −0.15 ± 0.04 | −0.12 | −0.18 | 1.0 | hurts |  |
| 1683 | Crone's Cruelty | 17 | Ancestry | — | innate spell: Warp Mind (rank 7) | −0.15 ± 0.05 | −0.26 | −0.04 | 1.0 | hurts |  |
| 1684 | Perfect Ki Adept | 6 | Class | — | innate spells: Unblinking Flame Revelation (rank 3), Unbreaking Wave Advance (rank 3), Unfolding Wind Rush (rank 3), Untwisting Iron Buffer (rank 3) | −0.15 ± 0.05 | −0.09 | −0.22 | 2.0 | hurts |  |
| 1685 | Chain of Words | 10 | Class | — | save | −0.15 ± 0.06 | −0.13 | −0.18 | 1.0 | hurts |  |
| 1686 | Interrupt Charge | 8 | Class | — | check | −0.15 ± 0.05 | +0.03 | −0.34 | 8.2 | hurts |  |
| 1687 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.02 | −0.29 | 1.0 | hurts |  |
| 1688 | Immortal Lightness | 4 | Class | — | focus spell: Athletic Rush (rank 2) | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1689 | Forceful Shot | 14 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 5.3 | hurts |  |
| 1690 | Kinetic Dampening | 6 | Class | — | its text's self buff (Resistance physical 5) | −0.16 ± 0.05 | −0.15 | −0.16 | 2.7 | hurts |  |
| 1691 | Haft Striker Stance | 4 | Class | fighter | stance | −0.16 ± 0.06 | −0.30 | −0.02 | 1.2 | hurts |  |
| 1692 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.16 ± 0.06 | −0.28 | −0.03 | 1.0 | hurts |  |
| 1693 | Giant's Lunge | 14 | Class | barbarian | reach 10 feet while raging (1 action) | −0.16 ± 0.07 | −0.23 | −0.09 | 1.0 | hurts |  |
| 1694 | Meteoric Spellstrike | 10 | Class | magus | check | −0.16 ± 0.07 | +0.03 | −0.35 | 3.7 | hurts | with a loaded arquebus |
| 1695 | Staggering Fire | 6 | Class | — | Strike activity | −0.16 ± 0.04 | −0.18 | −0.13 | 7.5 | hurts |  |
| 1696 | Claw Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.04 | −0.20 | −0.12 | 1.1 | hurts |  |
| 1697 | Adamantine Mantra | 13 | Ancestry | — | innate spell: Blessing of Defiance (rank 5) | −0.16 ± 0.04 | −0.20 | −0.12 | 1.0 | hurts |  |
| 1698 | Drag Down | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1699 | Steal for the Depths | 5 | Ancestry | — | check | −0.16 ± 0.03 | −0.19 | −0.13 | 1.8 | hurts |  |
| 1700 | Pistol Twirl | 2 | Class | gunslinger | check | −0.16 ± 0.03 | −0.14 | −0.18 | 1.8 | hurts |  |
| 1701 | Might of the Realm | 14 | Class | — | Strike activity | −0.16 ± 0.06 | −0.19 | −0.13 | 4.6 | hurts |  |
| 1702 | Pistol Phenom Dedication | 2 | Class | — | Pistol Twirl: check | −0.16 ± 0.03 | −0.14 | −0.18 | 0.0 | hurts | the AI never used it |
| 1703 | Disarming Assault | 8 | Class | barbarian | Strike activity | −0.16 ± 0.05 | −0.11 | −0.22 | 3.9 | hurts |  |
| 1704 | Talon Stance | 0 | Action | — | PF2e's stance Effect | −0.16 ± 0.05 | −0.18 | −0.14 | 1.1 | hurts |  |
| 1705 | Blazing Talon Surge | 6 | Class | monk | Strike activity (in Rain of Embers Stance) | −0.16 ± 0.06 | −0.14 | −0.18 | 2.1 | hurts |  |
| 1706 | Bone Swarm | 17 | Ancestry | — | save | −0.16 ± 0.05 | −0.29 | −0.04 | 1.0 | hurts |  |
| 1707 | Deny the Songs of War | 10 | Class | — | innate spells: Deafness (rank 4), Silence (rank 4) | −0.16 ± 0.05 | −0.17 | −0.16 | 1.0 | hurts |  |
| 1708 | Five-Gods Ram | 12 | Class | monk | Strike activity (in Rushing Goat Stance) | −0.16 ± 0.07 | +0.06 | −0.39 | 2.7 | hurts |  |
| 1709 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.16 ± 0.06 | +0.03 | −0.36 | 3.3 | hurts |  |
| 1710 | Viking Vindicator | 8 | Class | — | Sudden Charge: Strike activity | −0.16 ± 0.04 | −0.04 | −0.29 | 0.0 | hurts | the AI never used it |
| 1711 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | −0.16 ± 0.11 | −0.21 | −0.12 | 1.0 | no clear effect |  |
| 1712 | Flower Street Infamy | 11 | Skill | — | check | −0.17 ± 0.04 | −0.05 | −0.28 | 3.7 | hurts |  |
| 1713 | Death of Hope | 17 | Ancestry | — | save | −0.17 ± 0.05 | −0.20 | −0.13 | 1.0 | hurts |  |
| 1714 | Venipuncture | 10 | Class | — | save | −0.17 ± 0.05 | −0.14 | −0.19 | 1.5 | hurts |  |
| 1715 | Sheltering Pulse | 8 | Class | — | +1 AC to allies near it for 3 rounds, the PC and its allies within 15 feet | −0.17 ± 0.06 | −0.09 | −0.24 | 20.5 | hurts |  |
| 1716 | Draconic Resilience | 4 | Class | — | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 6.0 | hurts |  |
| 1717 | Twin Parry | 4 | Class | fighter | effect | −0.17 ± 0.04 | −0.27 | −0.06 | 2.8 | hurts |  |
| 1718 | Vengeful Strike | 14 | Class | barbarian | reaction Strike (hit) (in Come and Get Me) | −0.17 ± 0.07 | −0.16 | −0.17 | 0.2 | hurts |  |
| 1719 | Terrorize | 9 | Ancestry | — | innate spell: Fear (rank 3) | −0.17 ± 0.04 | −0.14 | −0.20 | 1.0 | hurts |  |
| 1720 | Dracomancer | 9 | Ancestry | — | innate spell: Fear (rank 1), Invisibility (rank 2) | −0.17 ± 0.04 | −0.14 | −0.20 | 1.0 | hurts |  |
| 1721 | Ferocious Gust | 9 | Ancestry | — | save | −0.17 ± 0.04 | −0.17 | −0.17 | 1.0 | hurts |  |
| 1722 | Blood Shield | 4 | Class | — | its text's self buff (FlatModifier ac 1) | −0.17 ± 0.04 | −0.27 | −0.07 | 2.9 | hurts |  |
| 1723 | Vigilant Benediction | 12 | Class | — | innate spells: Unfettered Movement (rank 4), Cleanse Affliction (rank 2), Resist Energy (rank 2), Spell Immunity (rank 4), Status (rank 2), Oaken Resilience (rank 2), Fire Shield (rank 4), Mountain Resilience (rank 4), Mystic Armor (rank 1), Wall of Fire (rank 14) | −0.17 ± 0.06 | −0.15 | −0.19 | 1.7 | hurts |  |
| 1724 | Sheltering Wing | 9 | Ancestry | — | PF2e's self Effect | −0.17 ± 0.05 | −0.28 | −0.06 | 3.6 | hurts |  |
| 1725 | Draconic Fury | 4 | Class | — | save | −0.17 ± 0.04 | −0.27 | −0.07 | 1.5 | hurts |  |
| 1726 | Surging Smash | 6 | Class | — | save (requirement assumed: You are overflowing) | −0.17 ± 0.04 | −0.14 | −0.21 | 1.9 | hurts |  |
| 1727 | You Can't Keep Us Down | 14 | Class | — | check | −0.17 ± 0.05 | −0.23 | −0.12 | 1.0 | hurts |  |
| 1728 | Ulfen Guard Dedication | 2 | Class | — | Designate Ally: its Effect on an ally within 30 feet | −0.17 ± 0.05 | +0.09 | −0.43 | 0.0 | hurts | the AI never used it |
| 1729 | Hellish Impression | 0 | Action | — | innate spell: Charm (rank 1) | −0.17 ± 0.04 | −0.12 | −0.22 | 1.6 | hurts |  |
| 1730 | Mask of Power | 5 | Ancestry | — | innate spells: Fear (rank 1), Phantom Pain (rank 1), Sure Strike (rank 1) | −0.17 ± 0.04 | −0.18 | −0.16 | 2.9 | hurts |  |
| 1731 | Remember Their Names | 16 | Class | — | save | −0.17 ± 0.07 | −0.05 | −0.30 | 4.6 | hurts |  |
| 1732 | Trampling Charge | 10 | Class | — | its mount through a 70-foot line, 3d8+6 piercing, basic Reflex DC 30 | −0.17 ± 0.04 | −0.25 | −0.10 | 14.3 | hurts |  |
| 1733 | Raise Slabs | 0 | Action | — | save | −0.18 ± 0.05 | −0.13 | −0.22 | 1.0 | hurts |  |
| 1734 | Flensing Slice | 8 | Class | — | check | −0.18 ± 0.06 | +0.22 | −0.57 | 8.9 | hurts |  |
| 1735 | Shield Warden | 6 | Class | champion | Shield Block for an adjacent ally (reaction) | −0.18 ± 0.06 | −0.20 | −0.16 | 0.1 | hurts |  |
| 1736 | Primal Proportions | 6 | Class | — | innate spell: Enlarge (rank 2) | −0.18 ± 0.05 | −0.17 | −0.18 | 1.0 | hurts |  |
| 1737 | Slam Down | 4 | Class | fighter | Strike activity | −0.18 ± 0.05 | −0.29 | −0.06 | 2.7 | hurts |  |
| 1738 | Share Rage | 8 | Class | barbarian | effect | −0.18 ± 0.06 | +0.03 | −0.39 | 8.0 | hurts |  |
| 1739 | False Priest Form | 5 | Ancestry | — | innate spells: Divine Lance (rank 3), Haunting Hymn (rank 3) | −0.18 ± 0.03 | −0.28 | −0.08 | 2.5 | hurts |  |
| 1740 | Sun Blade | 4 | Class | champion | innate spell: Sun Blade (rank 2) | −0.18 ± 0.05 | −0.09 | −0.27 | 1.0 | hurts |  |
| 1741 | Scarred Hide | 14 | Class | — | PF2e rules (always on) | −0.18 ± 0.04 | −0.24 | −0.12 | 0.0 | hurts | the AI never used it |
| 1742 | Cantorian Rejuvenation | 9 | Ancestry | — | PF2e's self Effect | −0.18 ± 0.05 | −0.19 | −0.17 | 1.0 | hurts |  |
| 1743 | Ironblood Surge | 14 | Class | monk | +1 AC and its Strength as resistance for a round (in Ironblood Stance) | −0.18 ± 0.09 | −0.15 | −0.21 | 5.7 | no clear effect |  |
| 1744 | Djinni Magic | 9 | Ancestry | — | innate spell: Gust of Wind (rank 1), Invisibility (rank 2) | −0.18 ± 0.04 | −0.21 | −0.16 | 1.0 | hurts |  |
| 1745 | Electrogenesis | 6 | Class | — | save | −0.19 ± 0.05 | −0.22 | −0.15 | 1.0 | hurts |  |
| 1746 | Knockback Strike | 10 | Class | monk | Strike activity | −0.19 ± 0.05 | −0.20 | −0.17 | 4.2 | hurts |  |
| 1747 | Feral Toss | 10 | Class | — | Strike activity (requirement assumed: You're in hybrid or animal shape) | −0.19 ± 0.05 | −0.17 | −0.20 | 3.8 | hurts |  |
| 1748 | Spirit's Wrath | 12 | Class | barbarian | check | −0.19 ± 0.08 | +0.03 | −0.41 | 10.3 | hurts |  |
| 1749 | Homing Shot | 14 | Class | — | a ranged Strike ignoring concealment and cover | −0.19 ± 0.06 | −0.18 | −0.19 | 14.0 | hurts | with a loaded arquebus |
| 1750 | Decree of War | 18 | Class | — | Strike activity | −0.19 ± 0.05 | −0.09 | −0.29 | 2.3 | hurts |  |
| 1751 | On Borrowed Time | 10 | Class | oracle | inline save: 1 creature, 30 feet, will, 3d6 mental (DC 29) | −0.19 ± 0.05 | −0.04 | −0.34 | 3.1 | hurts |  |
| 1752 | Reflexive Shield | 6 | Class | fighter | its raised shield's bonus to Reflex saves (Raise a Shield forced, on the guardian) | −0.19 ± 0.06 | −0.33 | −0.06 | 0.0 | hurts | the AI never used it |
| 1753 | Nagaji Spell Mysteries | 5 | Ancestry | — | innate spells: Charm (rank 1), Fleet Step (rank 1), Heal (rank 1) | −0.19 ± 0.04 | −0.21 | −0.18 | 2.5 | hurts |  |
| 1754 | Dominating Gaze | 16 | Class | — | innate spell: Dominate (rank 7) | −0.19 ± 0.07 | −0.27 | −0.12 | 1.0 | hurts |  |
| 1755 | Cycle Spell | 4 | Class | — | innate spells: Bless (rank 1), Infuse Vitality (rank 1), Heal (rank 1) | −0.19 ± 0.05 | −0.11 | −0.28 | 1.9 | hurts |  |
| 1756 | Infernal Interference | 16 | Class | — | Strike activity | −0.20 ± 0.06 | −0.17 | −0.22 | 4.8 | hurts |  |
| 1757 | Subjugation | 16 | Class | — | save | −0.20 ± 0.06 | −0.08 | −0.31 | 3.0 | hurts |  |
| 1758 | Resounding Blow | 10 | Class | barbarian | Strike activity | −0.20 ± 0.06 | −0.10 | −0.29 | 4.4 | hurts | with a warhammer and a free hand |
| 1759 | Trip | 0 | Action | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 2.0 | hurts | with a one-handed weapon and a free hand |
| 1760 | Methodical Magic | 9 | Ancestry | — | innate spells: Calm (rank 2), Dispel Magic (rank 2), Lock (rank 1), Mending (rank 1), Shape Wood (rank 2), Translate (rank 2) | −0.20 ± 0.04 | −0.23 | −0.16 | 1.6 | hurts |  |
| 1761 | Ringing Challenge | 0 | Action | — | save | −0.20 ± 0.05 | −0.23 | −0.16 | 2.0 | hurts |  |
| 1762 | Megavolt | 6 | Class | inventor | inline save: 20-foot line, reflex, 3d4 electricity (DC 22) | −0.20 ± 0.08 | −0.02 | −0.37 | 3.3 | hurts |  |
| 1763 | Opportunistic Grapple | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.1 | hurts |  |
| 1764 | Submission Hold | 8 | Class | — | check | −0.20 ± 0.05 | −0.20 | −0.19 | 4.0 | hurts |  |
| 1765 | Staff Sweep | 6 | Class | — | check | −0.20 ± 0.04 | −0.23 | −0.17 | 2.6 | hurts |  |
| 1766 | Animal Magic | 9 | Ancestry | — | innate spell: Animal Messenger (rank 2), Calm (rank 2), Speak with Animals (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1767 | Agathion Magic | 9 | Ancestry | — | innate spell: Animal Form (rank 2), Calm (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1768 | Ceremony of Aeon's Guidance | 9 | Ancestry | — | innate spell: Augury (rank 2), Calm (rank 2) | −0.20 ± 0.04 | −0.24 | −0.16 | 1.5 | hurts |  |
| 1769 | Archer's Aim | 8 | Class | — | Strike activity | −0.20 ± 0.06 | −0.26 | −0.14 | 7.2 | hurts |  |
| 1770 | Confusing Commands | 16 | Class | commander | save | −0.20 ± 0.10 | +0.10 | −0.51 | 4.5 | hurts |  |
| 1771 | Tempo Duelist | 16 | Class | — | concealed for a round | −0.20 ± 0.06 | −0.24 | −0.16 | 4.9 | hurts |  |
| 1772 | Touch of the Sea | 1 | Ancestry | — | innate spells: Gale Blast (rank 1), Spout (rank 1) | −0.21 ± 0.05 | −0.24 | −0.17 | 2.1 | hurts |  |
| 1773 | Extract Element | 0 | Action | kineticist | save | −0.21 ± 0.05 | −0.20 | −0.21 | 6.1 | hurts |  |
| 1774 | Annihilating Swing | 20 | Class | barbarian | Strike activity | −0.21 ± 0.07 | −0.10 | −0.31 | 10.2 | hurts |  |
| 1775 | Convocation of Greed | 0 | Action | — | an Effect on an ally | −0.21 ± 0.05 | −0.17 | −0.25 | 2.0 | hurts |  |
| 1776 | All Returns To Slumber | 6 | Class | — | save (requirement assumed: Your waking world is active) | −0.21 ± 0.04 | −0.11 | −0.32 | 3.0 | hurts |  |
| 1777 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | −0.21 ± 0.05 | −0.14 | −0.28 | 1.0 | hurts |  |
| 1778 | Analyze Weakness | 6 | Class | rogue | +2d6 precision on its next sneak attack (1 action) | −0.21 ± 0.05 | −0.32 | −0.11 | 4.5 | hurts |  |
| 1779 | Skirt the Underworld | 0 | Action | — | save | −0.21 ± 0.05 | −0.23 | −0.19 | 2.1 | hurts |  |
| 1780 | Kaiju's Footfalls | 13 | Ancestry | — | innate spell: Enlarge (rank 2) | −0.21 ± 0.04 | −0.26 | −0.17 | 2.0 | hurts |  |
| 1781 | Beast Gunner Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1782 | Eldritch Archer Dedication | 6 | Class | — | cantrip: Electric Arc (rank 3, DC 18) | −0.22 ± 0.05 | −0.27 | −0.17 | 2.6 | hurts |  |
| 1783 | Stomp Ground | 6 | Class | guardian | inline save: 5-foot emanation, reflex, 1d6 bludgeoning (DC 22) | −0.22 ± 0.06 | −0.37 | −0.06 | 2.7 | hurts |  |
| 1784 | Wheedle and Jig | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1785 | Breath Like Honey | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1786 | Natural Magnetism | 9 | Ancestry | — | innate spell: Magnetic Attraction (rank 2), Magnetic Repulsion (rank 2), Enthrall (rank 2) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1787 | Captivating Curiosity | 9 | Ancestry | — | innate spell: Enthrall (rank 3) | −0.22 ± 0.04 | −0.21 | −0.22 | 1.0 | hurts |  |
| 1788 | Aldori Parry | 4 | Class | — | self effect | −0.22 ± 0.05 | −0.36 | −0.08 | 2.9 | hurts |  |
| 1789 | Fabricate Truth | 4 | Class | — | check | −0.22 ± 0.05 | −0.17 | −0.27 | 2.9 | hurts |  |
| 1790 | Wiles on the Wind | 12 | Class | kineticist | save | −0.22 ± 0.08 | −0.12 | −0.32 | 4.3 | hurts |  |
| 1791 | Weft and Warp | 16 | Class | — | Strike activity | −0.22 ± 0.05 | +0.02 | −0.46 | 2.8 | hurts |  |
| 1792 | Grudge Strike | 6 | Class | animist | Strike activity (requirement assumed: Your attuned apparition grants Heraldry Lore or Underworld Lore as an apparition skill) | −0.22 ± 0.06 | −0.20 | −0.25 | 2.6 | hurts |  |
| 1793 | Marid Magic | 9 | Ancestry | — | innate spell: Hydraulic Push (rank 1), Mist (rank 2) | −0.23 ± 0.04 | −0.31 | −0.14 | 1.0 | hurts |  |
| 1794 | Fiendish Magic | 9 | Ancestry | — | innate spells: Disguise Magic (rank 1), False Vitality (rank 2), Invisibility (rank 2), See the Unseen (rank 2), Shatter (rank 2), Paranoia (rank 2) | −0.23 ± 0.05 | −0.21 | −0.24 | 1.0 | hurts |  |
| 1795 | The Dead Walk | 10 | Class | oracle | check | −0.23 ± 0.06 | −0.10 | −0.35 | 3.2 | hurts |  |
| 1796 | Heavy is the Crown | 0 | Action | — | inline save: 15-foot burst, will, 1 spirit (DC 17) | −0.23 ± 0.04 | −0.23 | −0.23 | 1.9 | hurts |  |
| 1797 | Drain Emotion | 9 | Ancestry | — | its text's self buff (TempHP 9) | −0.23 ± 0.05 | −0.22 | −0.24 | 1.0 | hurts |  |
| 1798 | Benevolent Spirit Deck | 6 | Class | — | effect | −0.23 ± 0.05 | −0.31 | −0.15 | 5.5 | hurts |  |
| 1799 | The Tyrant Falls! | 20 | Class | — | self effect | −0.23 ± 0.06 | −0.22 | −0.24 | 1.0 | hurts |  |
| 1800 | Storm's Lash | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1801 | Virga May | 1 | Ancestry | — | innate spell: Electric Arc (rank 1) | −0.23 ± 0.05 | −0.25 | −0.21 | 2.1 | hurts |  |
| 1802 | Fey Influence | 5 | Ancestry | — | innate spells: Grim Tendrils (rank 1), Pest Form (rank 1), Ill Omen (rank 1), Summon Plant or Fungus (rank 1), Fleet Step (rank 1), Bane (rank 1), Spider Sting (rank 1), Heal (rank 1) | −0.23 ± 0.04 | −0.33 | −0.13 | 2.7 | hurts |  |
| 1803 | Warning Shot | 2 | Class | gunslinger | check | −0.23 ± 0.06 | −0.19 | −0.28 | 2.7 | hurts |  |
| 1804 | Night's Shine | 12 | Class | — | innate spells: Asterism (rank 4), Touch of the Moon (rank 4) | −0.23 ± 0.06 | −0.20 | −0.26 | 3.5 | hurts |  |
| 1805 | Burning Spell | 6 | Class | — | Burning Spell copies of 2 spells | −0.23 ± 0.05 | −0.20 | −0.27 | 2.0 | hurts |  |
| 1806 | Shielding Taunt | 2 | Class | guardian | Taunt that raises its shield | −0.24 ± 0.05 | +0.05 | −0.52 | 0.0 | hurts | the AI never used it |
| 1807 | Thunderclap Spell | 10 | Class | druid | Thunderclap Spell copies of 4 spells | −0.24 ± 0.05 | −0.12 | −0.35 | 3.5 | hurts |  |
| 1808 | Primal Roar | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1809 | Threatening Approach | 0 | Action | — | check | −0.24 ± 0.05 | −0.11 | −0.36 | 1.3 | hurts |  |
| 1810 | Buzzing Death Cicadas | 12 | Class | — | Death Drone: save | −0.24 ± 0.06 | −0.24 | −0.23 | 0.0 | hurts | the AI never used it |
| 1811 | Dragon Spit | 1 | Ancestry | — | innate spells: Acid Splash (rank 1), Electric Arc (rank 1), Ignition (rank 1), Ray of Frost (rank 1) | −0.24 ± 0.05 | −0.28 | −0.20 | 2.1 | hurts |  |
| 1812 | Dirty Trick | 1 | Skill | — | check | −0.24 ± 0.04 | −0.07 | −0.41 | 1.6 | hurts |  |
| 1813 | Icy Influence | 1 | Ancestry | — | innate spell: Frostbite (rank 1) | −0.24 ± 0.05 | −0.26 | −0.22 | 2.1 | hurts |  |
| 1814 | Arcane Tattoos | 1 | Ancestry | — | innate spells: Shield (rank 1), Tangle Vine (rank 1), Daze (rank 1), Electric Arc (rank 1), Ghost Sound (rank 1), Void Warp (rank 1), Sigil (rank 1) | −0.24 ± 0.05 | −0.25 | −0.23 | 2.1 | hurts |  |
| 1815 | Aether Blast | 4 | Class | — | save (requirement assumed: You are overflowing) | −0.24 ± 0.05 | −0.28 | −0.21 | 7.7 | hurts |  |
| 1816 | Thaumaturge Dedication | 2 | Class | — | Glimpse Vulnerability: effect | −0.24 ± 0.05 | +0.00 | −0.49 | 0.0 | hurts | the AI never used it |
| 1817 | Spirit of the Blade | 6 | Class | — | +1d6 spirit on its next melee Strike (1 action) | −0.24 ± 0.05 | −0.29 | −0.20 | 4.9 | hurts |  |
| 1818 | Whirling Throw | 6 | Class | monk | check | −0.25 ± 0.05 | −0.19 | −0.30 | 6.6 | hurts |  |
| 1819 | Stranglehold | 9 | Ancestry | — | check | −0.25 ± 0.05 | −0.16 | −0.33 | 9.7 | hurts |  |
| 1820 | Sonic Dash | 2 | Class | — | inline save: 5-foot emanation, fortitude, 1d4 sonic (DC 18) | −0.25 ± 0.04 | −0.33 | −0.16 | 4.3 | hurts |  |
| 1821 | Reactive Tangle | 4 | Class | — | check | −0.25 ± 0.04 | −0.31 | −0.19 | 2.6 | hurts |  |
| 1822 | Lingering Chill | 4 | Class | — | innate spell: Frostbite (rank 2) | −0.25 ± 0.05 | −0.23 | −0.27 | 2.7 | hurts |  |
| 1823 | Hamstringing Strike | 8 | Class | ranger | Strike activity | −0.25 ± 0.07 | −0.45 | −0.05 | 17.5 | hurts |  |
| 1824 | Dizzying Spell | 14 | Class | wizard | Dizzying Spell copies of 6 spells | −0.25 ± 0.06 | −0.20 | −0.30 | 4.6 | hurts |  |
| 1825 | Scrap Barricade | 6 | Class | kineticist | save | −0.25 ± 0.10 | −0.18 | −0.32 | 4.7 | hurts |  |
| 1826 | Tactical Takedown | 0 | Action | commander | save | −0.25 ± 0.06 | −0.20 | −0.31 | 2.5 | hurts |  |
| 1827 | Dokkaebi Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1828 | Inner Fire (Naari) | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1829 | Mariner's Fire | 1 | Ancestry | — | innate spell: Ignition (rank 1) | −0.26 ± 0.05 | −0.25 | −0.26 | 1.9 | hurts |  |
| 1830 | Nantambu Chime-Ringer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1831 | Sorcerer Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1832 | Spellshot Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1833 | Cathartic Mage Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1834 | Bloodrager Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1835 | Eldritch Researcher Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1836 | Runescarred Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1837 | Wizard Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.2 | hurts |  |
| 1838 | Magus Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1839 | Witch Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1840 | Druid Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1841 | Magaambyan Attendant Dedication | 2 | Class | — | cantrip: Electric Arc (rank 1, DC 14) | −0.26 ± 0.05 | −0.28 | −0.23 | 2.5 | hurts |  |
| 1842 | Catchy Tune | 5 | Ancestry | — | check | −0.26 ± 0.04 | −0.19 | −0.32 | 8.8 | hurts |  |
| 1843 | Form a Flock | 13 | Ancestry | — | PF2e's self Effect | −0.26 ± 0.05 | −0.39 | −0.12 | 1.0 | hurts |  |
| 1844 | Clobber | 16 | Class | guardian | Strike activity | −0.26 ± 0.07 | −0.36 | −0.16 | 11.7 | hurts |  |
| 1845 | Tear Tendons | 8 | Class | — | save (requirement assumed: You are in claw stance and have two open hands) | −0.26 ± 0.06 | −0.16 | −0.37 | 4.1 | hurts |  |
| 1846 | Sanguivolent Roots | 8 | Class | kineticist | save | −0.27 ± 0.11 | −0.51 | −0.03 | 5.6 | hurts |  |
| 1847 | Cry of Rebellion | 16 | Class | — | save | −0.27 ± 0.07 | −0.27 | −0.27 | 1.0 | hurts |  |
| 1848 | Scorching Column | 1 | Class | kineticist | save | −0.27 ± 0.07 | −0.32 | −0.22 | 2.7 | hurts |  |
| 1849 | Deep Freeze | 12 | Class | inventor | inline save: 1 creature, 60 feet, reflex, 12 cold (DC 31) | −0.27 ± 0.11 | −0.32 | −0.22 | 8.3 | hurts |  |
| 1850 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.27 ± 0.09 | −0.26 | −0.28 | 9.8 | hurts |  |
| 1851 | Elemental Wrath | 1 | Ancestry | — | innate spell: Acid Splash (rank 1) | −0.27 ± 0.05 | −0.29 | −0.26 | 2.0 | hurts |  |
| 1852 | Petrifying Gaze Mimicry | 10 | Class | — | save | −0.28 ± 0.06 | −0.25 | −0.30 | 4.1 | hurts |  |
| 1853 | Grovel | 5 | Ancestry | — | check | −0.28 ± 0.04 | −0.23 | −0.32 | 6.1 | hurts |  |
| 1854 | Captivating Charm | 0 | Action | — | save | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1855 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.28 ± 0.07 | −0.29 | −0.27 | 4.5 | hurts |  |
| 1856 | Nagaji Spell Familiarity | 1 | Ancestry | — | innate spell: Daze (rank 1), Detect Magic (rank 1), Telekinetic Hand (rank 1) | −0.28 ± 0.05 | −0.27 | −0.29 | 2.1 | hurts |  |
| 1857 | Memory of Nothing | 18 | Class | — | inline save: 1 creature, 30 feet, will, 12d8 mental (DC 38) | −0.29 ± 0.06 | −0.39 | −0.18 | 3.0 | hurts |  |
| 1858 | Dire Growth | 10 | Class | — | casts Enlarge (rank 5, DC 27) | −0.29 ± 0.05 | −0.27 | −0.31 | 3.5 | hurts |  |
| 1859 | Holy Light | 10 | Class | champion | save | −0.29 ± 0.06 | −0.18 | −0.40 | 4.8 | hurts |  |
| 1860 | Magnetic Pinions | 1 | Class | kineticist | impulse attack: 1d4 + 1d4 bludgeoning and piercing (60 feet, attack +7) | −0.29 ± 0.06 | −0.25 | −0.33 | 2.1 | hurts |  |
| 1861 | Designate Ally | 0 | Action | — | its Effect on an ally within 30 feet | −0.29 ± 0.06 | −0.14 | −0.44 | 7.5 | hurts |  |
| 1862 | Spinebreaker | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1863 | Ensnaring Wrappings | 10 | Class | — | check | −0.29 ± 0.05 | −0.33 | −0.25 | 4.2 | hurts |  |
| 1864 | Hell-Lancer Shot | 10 | Class | — | Strike activity | −0.29 ± 0.05 | −0.30 | −0.29 | 7.3 | hurts |  |
| 1865 | Mage Hunter | 6 | Class | barbarian | a 2-action Strike, stupefied 1 (2 on a critical hit) until its next turn (whether it saw a spell cast isn't checked) | −0.29 ± 0.06 | −0.30 | −0.29 | 3.5 | hurts |  |
| 1866 | Bloody Denial | 14 | Class | guardian | Strike activity | −0.29 ± 0.06 | −0.33 | −0.26 | 9.5 | hurts |  |
| 1867 | Armored Rebuff | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 4.5 | hurts |  |
| 1868 | Wing Shove | 8 | Class | — | check | −0.30 ± 0.05 | −0.36 | −0.24 | 3.9 | hurts |  |
| 1869 | Distracting Spellstrike | 4 | Class | magus | check | −0.30 ± 0.07 | −0.33 | −0.27 | 1.9 | hurts |  |
| 1870 | Sleeper Hold | 10 | Class | monk | check | −0.30 ± 0.08 | −0.45 | −0.15 | 6.8 | hurts |  |
| 1871 | Spinning Crush | 0 | Action | gunslinger | save | −0.30 ± 0.05 | −0.26 | −0.34 | 1.3 | hurts |  |
| 1872 | Mesmerizing Gaze | 6 | Class | — | save | −0.30 ± 0.05 | −0.21 | −0.39 | 3.1 | hurts |  |
| 1873 | Running Tackle | 8 | Class | — | check | −0.30 ± 0.06 | −0.29 | −0.31 | 3.8 | hurts |  |
| 1874 | Ghost Wrangler | 4 | Class | barbarian | PF2e's self Effect | −0.30 ± 0.06 | −0.37 | −0.23 | 3.1 | hurts |  |
| 1875 | Clashing Compound Invocation | 10 | Class | — | save | −0.30 ± 0.07 | −0.40 | −0.20 | 11.4 | hurts |  |
| 1876 | Molten Wire | 6 | Class | kineticist | impulse attack: 2d6 slashing (15 feet, attack +12) | −0.30 ± 0.09 | −0.36 | −0.24 | 5.1 | hurts |  |
| 1877 | Infiltration Assassination | 10 | Class | — | Strike activity (requirement assumed: You're wearing a loaded gauntlet bow) | −0.30 ± 0.05 | −0.35 | −0.25 | 4.1 | hurts |  |
| 1878 | Guardian Lion Roar | 8 | Class | inventor | inline save: 20-foot line, fortitude, 2d8 sonic (DC 24) | −0.30 ± 0.09 | −0.20 | −0.40 | 4.3 | hurts |  |
| 1879 | Launch Fireworks | 0 | Action | — | save | −0.30 ± 0.05 | −0.19 | −0.42 | 3.3 | hurts | with a one-handed weapon and a free hand |
| 1880 | Catrina's Presence | 9 | Ancestry | — | innate spell: Calm (rank 2) | −0.30 ± 0.05 | −0.33 | −0.27 | 2.8 | hurts |  |
| 1881 | Demolish Defenses | 18 | Class | guardian | save | −0.31 ± 0.06 | −0.44 | −0.17 | 5.1 | hurts |  |
| 1882 | Clawdancer Dedication | 2 | Class | — | Claw Stance: PF2e's stance Effect | −0.31 ± 0.05 | −0.31 | −0.31 | 1.1 | hurts |  |
| 1883 | Bard Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1884 | Captivator Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1885 | Ghost Hunter Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1886 | Prophet of Kalistrade Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.3 | hurts |  |
| 1887 | Necromancer Dedication | 2 | Class | — | cantrip: Void Warp (rank 1, DC 14) | −0.31 ± 0.05 | −0.26 | −0.35 | 2.5 | hurts |  |
| 1888 | Plane Step | 9 | Ancestry | — | check | −0.31 ± 0.05 | −0.32 | −0.30 | 2.3 | hurts |  |
| 1889 | Electrify Armor | 10 | Class | inventor | electricity on who hits it in melee, for a round | −0.31 ± 0.08 | −0.32 | −0.30 | 5.0 | hurts |  |
| 1890 | Cobra Stance | 4 | Class | monk | PF2e's stance Effect | −0.31 ± 0.09 | −0.47 | −0.16 | 1.0 | hurts |  |
| 1891 | Wheeling Grab | 6 | Class | — | check | −0.32 ± 0.04 | −0.37 | −0.26 | 2.9 | hurts |  |
| 1892 | Crown of Rule | 16 | Class | exemplar | Heavy is the Crown: inline save: 15-foot burst, will, 16 spirit (DC 35) | −0.32 ± 0.07 | −0.30 | −0.33 | 0.0 | hurts | the AI never used it |
| 1893 | Putrefaction | 14 | Class | — | save | −0.32 ± 0.06 | −0.25 | −0.38 | 3.0 | hurts |  |
| 1894 | Stay Down! | 14 | Class | rogue | check | −0.32 ± 0.07 | −0.27 | −0.37 | 11.2 | hurts |  |
| 1895 | Parting Shot | 4 | Class | fighter | Strike activity | −0.32 ± 0.06 | −0.38 | −0.26 | 5.0 | hurts | with a bow in hand |
| 1896 | Deadly Aim | 8 | Class | ranger | Strike activity | −0.32 ± 0.08 | −0.39 | −0.26 | 8.8 | hurts |  |
| 1897 | Siegebreaker | 0 | Action | gunslinger | its text's self buff (FlatModifier ac 1) | −0.32 ± 0.06 | −0.25 | −0.40 | 2.3 | hurts |  |
| 1898 | Exaltation Overwhelming | 18 | Class | — | save | −0.33 ± 0.06 | −0.30 | −0.35 | 2.9 | hurts |  |
| 1899 | Animist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1900 | Infernal Pactbreaker Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1901 | Oracle Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.1 | hurts |  |
| 1902 | Cleric Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1903 | Rivethun Involutionist Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1904 | Soul Warden Dedication | 2 | Class | — | cantrip: Divine Lance (rank 1, DC 14) | −0.33 ± 0.04 | −0.29 | −0.36 | 2.4 | hurts |  |
| 1905 | Glimpse Vulnerability | 0 | Action | — | effect | −0.33 ± 0.05 | −0.05 | −0.60 | 6.0 | hurts |  |
| 1906 | Shield of Grace | 16 | Class | champion | Shield Warden's block for an ally, the rest split with it | −0.33 ± 0.09 | −0.22 | −0.44 | 0.2 | hurts |  |
| 1907 | Buckle-Cut Blitz | 0 | Action | commander | save | −0.33 ± 0.06 | −0.33 | −0.33 | 2.7 | hurts |  |
| 1908 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.33 ± 0.05 | −0.37 | −0.29 | 3.9 | hurts |  |
| 1909 | Spiritual Awakening | 4 | Class | — | Spiritual Expansion Spell: widened copies of 3 area spells | −0.33 ± 0.08 | −0.69 | +0.02 | 0.0 | hurts | the AI never used it |
| 1910 | Hallowed Initiate | 4 | Class | — | innate spell: Call of the Grave (rank 1), Death's Call (rank 1) | −0.33 ± 0.07 | −0.41 | −0.25 | 1.0 | hurts |  |
| 1911 | Rising Hurricane | 6 | Class | kineticist | save | −0.33 ± 0.10 | −0.48 | −0.19 | 4.4 | hurts |  |
| 1912 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.33 ± 0.06 | −0.27 | −0.40 | 1.0 | hurts |  |
| 1913 | Grim Swagger | 0 | Action | gunslinger | check (requirement assumed: You have a one-handed firearm or one-handed crossbow visibly worn or wielded) | −0.34 ± 0.06 | −0.12 | −0.56 | 1.4 | hurts |  |
| 1914 | Cutting Rebuke | 4 | Class | — | Bon Mot: check | −0.34 ± 0.06 | −0.62 | −0.06 | 7.4 | hurts |  |
| 1915 | Propulsive Leap | 10 | Class | — | save | −0.34 ± 0.06 | −0.37 | −0.32 | 10.4 | hurts |  |
| 1916 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.35 ± 0.05 | −0.34 | −0.35 | 4.5 | hurts |  |
| 1917 | Storm of Claws | 16 | Class | — | 3 Strikes (in Claw Stance) | −0.35 ± 0.09 | −0.31 | −0.39 | 5.1 | hurts |  |
| 1918 | Weaver's Web | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.36 ± 0.05 | −0.25 | −0.47 | 4.1 | hurts |  |
| 1919 | Ostilli Host Dedication | 2 | Class | — | Spit Ambient Magic: save | −0.36 ± 0.05 | −0.25 | −0.47 | 0.0 | hurts | the AI never used it |
| 1920 | Flames of Vision | 13 | Ancestry | — | innate spell: Clairvoyance (rank 4), Ignition (rank 7) | −0.36 ± 0.05 | −0.44 | −0.28 | 4.2 | hurts |  |
| 1921 | Channeled Protection | 4 | Class | animist | effect | −0.37 ± 0.09 | −0.58 | −0.15 | 17.3 | hurts |  |
| 1922 | Raise the Walls | 0 | Action | — | effect | −0.37 ± 0.06 | −0.26 | −0.48 | 7.3 | hurts |  |
| 1923 | Cannonball Fall | 8 | Class | fighter | inline save: 1 creature, 10 feet, reflex (DC 24) | −0.37 ± 0.07 | −0.18 | −0.56 | 11.8 | hurts |  |
| 1924 | Manipulative Charm | 4 | Class | — | innate spell: Charm (rank 1) | −0.37 ± 0.07 | −0.35 | −0.38 | 1.6 | hurts |  |
| 1925 | Stupefying Raid | 0 | Action | commander | save | −0.38 ± 0.06 | −0.40 | −0.35 | 2.8 | hurts |  |
| 1926 | Aphet Flash | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.38 ± 0.05 | −0.28 | −0.49 | 6.4 | hurts |  |
| 1927 | Whirling Knockdown | 14 | Class | — | check | −0.39 ± 0.07 | −0.30 | −0.48 | 5.3 | hurts |  |
| 1928 | Brain Drain | 8 | Class | psychic | save | −0.39 ± 0.05 | −0.59 | −0.19 | 3.2 | hurts |  |
| 1929 | Perfect Shot | 18 | Class | ranger | a ranged Strike at maximum damage, then its turn ends (3 actions) | −0.39 ± 0.10 | −0.46 | −0.33 | 7.8 | hurts |  |
| 1930 | Rend Mimicry | 4 | Class | — | check | −0.39 ± 0.05 | −0.36 | −0.43 | 7.9 | hurts |  |
| 1931 | Firework Technician Dedication | 2 | Class | — | Launch Fireworks: save | −0.40 ± 0.06 | −0.41 | −0.38 | 0.0 | hurts | with a one-handed weapon and a free hand; the AI never used it |
| 1932 | Protect the Royal Line | 16 | Class | — | check | −0.40 ± 0.06 | −0.51 | −0.29 | 5.2 | hurts |  |
| 1933 | Drive Back | 8 | Class | — | check | −0.40 ± 0.06 | −0.47 | −0.33 | 4.3 | hurts | with a weapon and a shield |
| 1934 | Wing Bounce | 4 | Class | — | check | −0.41 ± 0.07 | −0.43 | −0.38 | 2.5 | hurts |  |
| 1935 | Transfusion | 8 | Class | — | an Effect on an ally | −0.41 ± 0.06 | −0.34 | −0.47 | 7.4 | hurts |  |
| 1936 | Hammer Quake | 14 | Class | — | check | −0.43 ± 0.07 | −0.20 | −0.67 | 4.0 | hurts |  |
| 1937 | Protect Ally | 8 | Class | — | +1 AC to an adjacent ally for a round | −0.43 ± 0.07 | −0.31 | −0.56 | 19.2 | hurts |  |
| 1938 | Anarchic Arcana | 9 | Ancestry | — | innate spells: Acid Grip (rank 2), Blur (rank 2), Gecko Grip (rank 2), Humanoid Form (rank 2), Illusory Object (rank 1), Laughing Fit (rank 2), Noise Blast (rank 2), Resist Energy (rank 2), See the Unseen (rank 2), Shatter (rank 2), Shrink (rank 2), Telekinetic Maneuver (rank 2) | −0.44 ± 0.05 | −0.62 | −0.26 | 5.3 | hurts |  |
| 1939 | Kitsune Spell Familiarity | 1 | Ancestry | — | innate spells: Daze (rank 1), Forbidding Ward (rank 1), Ghost Sound (rank 1) | −0.45 ± 0.06 | −0.54 | −0.36 | 4.3 | hurts |  |
| 1940 | Coerce the Current | 9 | Ancestry | — | save (requirement assumed: You are swimming in water) | −0.45 ± 0.05 | −0.59 | −0.32 | 4.1 | hurts |  |
| 1941 | Wing Buffet | 9 | Ancestry | — | check | −0.45 ± 0.05 | −0.58 | −0.33 | 4.4 | hurts |  |
| 1942 | Fearful Symmetry | 6 | Class | — | save | −0.46 ± 0.06 | −0.56 | −0.37 | 8.3 | hurts |  |
| 1943 | Infernal Magic | 6 | Class | — | innate spells: Divine Lance (rank 3), Fear (rank 1), Spiritual Armament (rank 2) | −0.47 ± 0.05 | −0.48 | −0.46 | 3.1 | hurts |  |
| 1944 | Frog Geyser | 5 | Ancestry | — | save (requirement assumed: Your mouth is full of water) | −0.48 ± 0.04 | −0.78 | −0.18 | 3.4 | hurts |  |
| 1945 | Swarmkeeper Dedication | 2 | Class | — | Bite and Sting: save (requirement assumed: Your swarm is outside your body) | −0.48 ± 0.06 | −0.45 | −0.50 | 7.3 | hurts |  |
| 1946 | Repulse the Wicked | 6 | Class | — | check | −0.50 ± 0.05 | −0.67 | −0.32 | 3.1 | hurts |  |
| 1947 | Say That Again! | 6 | Skill | — | check | −0.50 ± 0.05 | −0.67 | −0.32 | 3.1 | hurts |  |
| 1948 | Pain is Temporary | 13 | Ancestry | — | PF2e's self Effect | −0.50 ± 0.05 | −0.63 | −0.37 | 4.6 | hurts |  |
| 1949 | Fey Ascension | 9 | Ancestry | — | innate spells: Slow (rank 3), Pest Form (rank 4), Charm (rank 1), Sleep (rank 1), Triple Time (rank 5), Mad Monkeys (rank 3) | −0.52 ± 0.05 | −0.41 | −0.62 | 7.3 | hurts |  |
| 1950 | Mixed Maneuver | 8 | Class | monk | check | −0.52 ± 0.09 | −0.61 | −0.43 | 5.3 | hurts |  |
| 1951 | Warped Constriction | 8 | Class | — | save | −0.53 ± 0.06 | −0.50 | −0.56 | 11.6 | hurts |  |
| 1952 | Goblin Song | 1 | Ancestry | — | check | −0.53 ± 0.06 | −0.18 | −0.88 | 8.2 | hurts |  |
| 1953 | Tamper | 1 | Class | inventor | check | −0.54 ± 0.06 | −0.51 | −0.56 | 7.4 | hurts |  |
| 1954 | Twist the Knife | 6 | Class | rogue | check | −0.56 ± 0.06 | −0.44 | −0.67 | 8.3 | hurts |  |
| 1955 | Chastise | 16 | Class | — | inline save: 1 creature, 30 feet, will, 2 spirit (DC 35) | −0.56 ± 0.07 | −0.48 | −0.64 | 5.8 | hurts |  |
| 1956 | Trample Mimicry | 10 | Class | — | save | −0.56 ± 0.06 | −0.72 | −0.40 | 3.8 | hurts |  |
| 1957 | Spirit Guide Form | 14 | Class | — | PF2e's self Effect | −0.57 ± 0.06 | −0.63 | −0.50 | 1.0 | hurts |  |
| 1958 | Silk Bracelet | 6 | Class | inventor | save | −0.57 ± 0.10 | −0.42 | −0.72 | 4.5 | hurts |  |
| 1959 | Muckraking | 16 | Class | — | save | −0.58 ± 0.08 | −0.54 | −0.63 | 4.2 | hurts |  |
| 1960 | Perplex | 14 | Class | — | check | −0.58 ± 0.08 | −0.66 | −0.51 | 3.9 | hurts |  |
| 1961 | Wild Dance | 12 | Class | — | save | −0.58 ± 0.07 | −0.44 | −0.73 | 9.9 | hurts |  |
| 1962 | Steel Yourself! | 4 | Class | — | its Effect on an ally within 10 feet | −0.59 ± 0.06 | −0.56 | −0.62 | 19.3 | hurts |  |
| 1963 | Overextending Feint | 1 | Class | rogue | Feint (forced), each one goading (–2 to the foe's next attack on the PC, all on a critical success) instead of off-guard | −0.59 ± 0.07 | −0.42 | −0.77 | 5.2 | hurts |  |
| 1964 | Whirling in the Summer Storm | 12 | Class | monk | save (in Twisting Petal Stance) | −0.60 ± 0.10 | −0.49 | −0.70 | 2.9 | hurts |  |
| 1965 | Catfolk Dance | 1 | Ancestry | — | check | −0.60 ± 0.07 | −0.48 | −0.71 | 6.8 | hurts |  |
| 1966 | Flying Tackle | 4 | Class | guardian | check | −0.61 ± 0.08 | −0.76 | −0.46 | 3.4 | hurts |  |
| 1967 | Freeze It! | 9 | Ancestry | — | check | −0.63 ± 0.05 | −0.66 | −0.61 | 11.2 | hurts |  |
| 1968 | Oversized Throw | 4 | Class | barbarian | PF2e's self Effect | −0.66 ± 0.10 | −0.75 | −0.56 | 4.3 | hurts | with a one-handed weapon and a free hand |
| 1969 | Dazzling Bullet | 6 | Class | — | check | −0.67 ± 0.06 | −0.60 | −0.73 | 9.4 | hurts |  |
| 1970 | Vengeful Remnant | 14 | Class | — | PF2e's self Effect | −0.67 ± 0.07 | −0.64 | −0.70 | 5.8 | hurts |  |
| 1971 | Instant Opening | 14 | Class | rogue | a foe within 30 feet off-guard to its attacks to the end of its next turn (1 action) | −0.68 ± 0.08 | −0.61 | −0.76 | 15.8 | hurts |  |
| 1972 | Prayer Attack | 14 | Class | — | check | −0.70 ± 0.09 | −0.47 | −0.92 | 15.1 | hurts |  |
| 1973 | Remote Detonation (Snarecrafter) | 8 | Class | — | inline save: 5-foot emanation, reflex, 1d6 force (DC 24) | −0.71 ± 0.07 | −0.89 | −0.54 | 12.9 | hurts |  |
| 1974 | Gossamer Blade | 4 | Class | — | check | −0.73 ± 0.06 | −0.73 | −0.73 | 9.3 | hurts |  |
| 1975 | Dust Cloud | 8 | Class | — | save (requirement assumed: Your waking world is active) | −0.73 ± 0.08 | −0.79 | −0.67 | 14.4 | hurts |  |
| 1976 | Upset Balance | 6 | Class | — | check (in Tenacious Stance) | −0.75 ± 0.06 | −0.88 | −0.61 | 8.8 | hurts |  |
| 1977 | Clear the Way | 6 | Class | — | check | −0.78 ± 0.07 | −1.03 | −0.52 | 3.8 | hurts |  |
| 1978 | Pyre Ant Sting | 4 | Class | — | save (requirement assumed: Your swarm is outside your body) | −0.78 ± 0.06 | −0.88 | −0.69 | 10.0 | hurts |  |
| 1979 | Lesson of the Splintered Aegis | 10 | Class | — | effect | −0.80 ± 0.07 | −0.99 | −0.61 | 28.3 | hurts |  |
| 1980 | Flourishing Finish | 12 | Class | — | check | −0.82 ± 0.09 | −0.82 | −0.82 | 14.3 | hurts |  |
| 1981 | One Moment till Glory | 0 | Action | — | effect | −0.87 ± 0.07 | −0.71 | −1.04 | 14.9 | hurts |  |
| 1982 | Snap Out of It! (Marshal) | 4 | Class | — | effect | −0.89 ± 0.07 | −0.91 | −0.88 | 21.7 | hurts |  |
| 1983 | Peony's Flourish | 14 | Class | — | check | −0.90 ± 0.10 | −0.50 | −1.31 | 6.7 | hurts |  |
| 1984 | Impossible Volley | 18 | Class | fighter | Strike activity | −0.91 ± 0.08 | −1.07 | −0.74 | 8.9 | hurts | with a bow in hand |
| 1985 | Purifying Breeze | 14 | Class | cleric | effect | −0.96 ± 0.09 | −1.16 | −0.77 | 20.6 | hurts |  |
| 1986 | Dance of the Tiger | 9 | Ancestry | — | check | −0.98 ± 0.08 | −1.32 | −0.65 | 16.4 | hurts |  |
| 1987 | Dissolution's Sovereignty | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.05 ± 0.06 | +0.00 | −2.09 | 1.0 | hurts |  |
| 1988 | Reflect Foe | 17 | Ancestry | — | innate spell: Duplicate Foe (rank 7) | −1.05 ± 0.06 | +0.00 | −2.09 | 1.0 | hurts |  |
| 1989 | Unbalancing Sweep | 12 | Class | barbarian | check | −1.14 ± 0.12 | −1.22 | −1.05 | 4.3 | hurts |  |
| 1990 | Scattering Charge | 12 | Class | guardian | check | −1.18 ± 0.11 | −1.26 | −1.11 | 4.6 | hurts |  |
| 1991 | Silencing Strike | 10 | Class | barbarian | save | −1.24 ± 0.11 | −1.73 | −0.74 | 16.8 | hurts |  |
| 1992 | Thrash | 8 | Class | barbarian | save | −1.26 ± 0.09 | −1.23 | −1.29 | 15.1 | hurts |  |
| 1993 | Astral Compound Invocation | 12 | Class | — | save | −1.31 ± 0.13 | −1.33 | −1.29 | 15.6 | hurts |  |
| 1994 | Scattering Shout | 14 | Class | — | inline save: 10-foot emanation, fortitude, 8d6 sonic (DC 33) | −1.39 ± 0.09 | −1.79 | −0.98 | 5.1 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 3415 |
| a spell the engine doesn't cast | 223 |
| a timer with no rules a fight counts | 139 |
| a Strike with nothing more the simulator reads | 103 |
| a plan the engine can't play | 75 |
| a teleport | 72 |
| its requirement | 69 |
| an Effect with nothing a fight counts | 63 |
| a roll whose results the simulator doesn't read | 57 |
| nothing a fight uses | 52 |
| it grants Additional Lore: the feat module reads nothing for it | 52 |
| its text has no Strike of its user's | 39 |
| a passive's roll with no action to use it | 38 |
| it grants one of 2 | 33 |
| a spell the feat casts | 24 |
| its Effect has nothing a fight counts | 24 |
| a reaction to "passive" | 23 |
| a passive's Effect on other creatures | 23 |
| a reaction's Strike | 22 |
| a passive's Effect posted by hand | 22 |
| a reroll | 13 |
| a lasting area | 11 |
| its requirement, which the PC doesn't meet | 11 |
| a companion's Strike | 10 |
| a choice of ways the simulator doesn't play | 10 |
| a Focus or Mythic Point back | 10 |
| a passive's Strike | 8 |
| it grants Pet: the feat module reads nothing for it | 8 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 6 |
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
| an Effect on another creature | 4 |
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
| it grants Rage: its requirement | 1 |
| it grants Command Undead: a roll whose results the simulator doesn't read | 1 |
| it grants Expel Maelstrom: a roll whose results the simulator doesn't read | 1 |
| it grants Banshee Cry: a roll whose results the simulator doesn't read | 1 |
| it grants Forced Pact: a roll whose results the simulator doesn't read | 1 |
