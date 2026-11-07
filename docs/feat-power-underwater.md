# Feat and action power in combat

**Benchmark: under water** (FEAT_FOE_TRAIT=underwater): the fight is under clear water (PF2e aquatic rules, void.js — off-guard without a swim Speed, −2 to bludgeoning and slashing melee, no fire, held breath) against aquatic foes with a 30-foot swim Speed. A swim Speed or water breathing is rated here; on land it changes nothing.

Made by `node tools/feat-power.mjs` on 2026-11-07: 17 feats and actions rated, 1 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 187 an encounter here, all fights 29, precise 4, no effect 1 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- good: 12
- strong: 3
- no clear effect: 2

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sink and Swim | 14 | Class | — | a 35-foot swim Speed (under water) | +0.35 ± 0.06 | +0.39 | +0.31 | 0.0 | strong | the AI never used it |
| 2 | Serpentine Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.35 ± 0.06 | +0.47 | +0.23 | 0.0 | strong | the AI never used it |
| 3 | Strong Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.35 ± 0.06 | +0.47 | +0.23 | 0.0 | strong | the AI never used it |
| 4 | Trained Swimmer | 4 | Class | — | a 15-foot swim Speed (under water) | +0.24 ± 0.04 | +0.39 | +0.09 | 0.0 | good | the AI never used it |
| 5 | Like a Fish in Water | 4 | Class | — | a 20-foot swim Speed (under water) | +0.23 ± 0.04 | +0.39 | +0.07 | 0.0 | good | the AI never used it |
| 6 | Azure Fins | 10 | Class | — | a 25-foot swim Speed (under water) | +0.23 ± 0.06 | +0.34 | +0.12 | 0.0 | good | the AI never used it |
| 7 | Wavetouched Paragon | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 8 | Practiced Paddler | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 9 | Finned Ridges | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 10 | Swimming Poppet | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 11 | Swift Swimmer | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 12 | Home in the Deep | 9 | Ancestry | — | breathes water (under water) | +0.22 ± 0.03 | +0.02 | +0.42 | 0.0 | good | the AI never used it |
| 13 | Water Nagaji | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.15 ± 0.03 | +0.29 | +0.01 | 0.0 | good | the AI never used it |
| 14 | Sea Legs | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.15 ± 0.03 | +0.29 | +0.01 | 0.0 | good | the AI never used it |
| 15 | Aqueous Dragonblood | 1 | Ancestry | — | a 15-foot swim Speed (under water) | +0.11 ± 0.03 | +0.24 | −0.03 | 0.0 | good | the AI never used it |
| 16 | Natural Swimmer | 4 | Class | druid | a 15-foot swim Speed (under water) | +0.06 ± 0.05 | +0.08 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 17 | Waterweave Tripkee | 1 | Ancestry | — | breathes water (under water) | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Sink and Swim | 14 | Class | — | a 35-foot swim Speed (under water) | +0.35 ± 0.06 | +0.39 | +0.31 | 0.0 | strong | the AI never used it |
| 2 | Serpentine Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.35 ± 0.06 | +0.47 | +0.23 | 0.0 | strong | the AI never used it |
| 3 | Strong Swimmer | 9 | Ancestry | — | a 25-foot swim Speed (under water) | +0.35 ± 0.06 | +0.47 | +0.23 | 0.0 | strong | the AI never used it |
| 4 | Trained Swimmer | 4 | Class | — | a 15-foot swim Speed (under water) | +0.24 ± 0.04 | +0.39 | +0.09 | 0.0 | good | the AI never used it |
| 5 | Like a Fish in Water | 4 | Class | — | a 20-foot swim Speed (under water) | +0.23 ± 0.04 | +0.39 | +0.07 | 0.0 | good | the AI never used it |
| 6 | Azure Fins | 10 | Class | — | a 25-foot swim Speed (under water) | +0.23 ± 0.06 | +0.34 | +0.12 | 0.0 | good | the AI never used it |
| 7 | Wavetouched Paragon | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 8 | Practiced Paddler | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 9 | Finned Ridges | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 10 | Swimming Poppet | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 11 | Swift Swimmer | 5 | Ancestry | — | a 15-foot swim Speed (under water) | +0.22 ± 0.04 | +0.38 | +0.06 | 0.0 | good | the AI never used it |
| 12 | Home in the Deep | 9 | Ancestry | — | breathes water (under water) | +0.22 ± 0.03 | +0.02 | +0.42 | 0.0 | good | the AI never used it |
| 13 | Water Nagaji | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.15 ± 0.03 | +0.29 | +0.01 | 0.0 | good | the AI never used it |
| 14 | Sea Legs | 1 | Ancestry | — | a 10-foot swim Speed (under water) | +0.15 ± 0.03 | +0.29 | +0.01 | 0.0 | good | the AI never used it |
| 15 | Aqueous Dragonblood | 1 | Ancestry | — | a 15-foot swim Speed (under water) | +0.11 ± 0.03 | +0.24 | −0.03 | 0.0 | good | the AI never used it |
| 16 | Natural Swimmer | 4 | Class | druid | a 15-foot swim Speed (under water) | +0.06 ± 0.05 | +0.08 | +0.05 | 0.0 | no clear effect | the AI never used it |
| 17 | Waterweave Tripkee | 1 | Ancestry | — | breathes water (under water) | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 1 |
