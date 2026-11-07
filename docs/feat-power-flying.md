# Feat and action power in combat

**Benchmark: flying foes** (FEAT_FOE_TRAIT=flying): the foes fly and shoot from the air, out of a grounded creature's reach. A permanent fly Speed is rated here (the feat's own conditions and durations not checked).

Made by `node tools/feat-power.mjs` on 2026-11-07: 17 feats and actions rated, 0 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 191 an encounter here, all fights 31, precise 3 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- strong: 14
- very strong: 3

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Devil's Wings | 16 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.77 | +0.25 | 0.0 | very strong | the AI never used it |
| 2 | Mortal Ascension | 14 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.85 | +0.16 | 0.0 | very strong | the AI never used it |
| 3 | Ascend | 14 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.85 | +0.16 | 0.0 | very strong | the AI never used it |
| 4 | Mighty Wings | 18 | Class | — | a 25-foot fly Speed (against fliers) | +0.50 ± 0.03 | +0.70 | +0.30 | 0.0 | strong | the AI never used it |
| 5 | Eternal Wings (Sylph) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 6 | Wyrmling Flight | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 7 | Soaring Poppet | 17 | Ancestry | — | a 15-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 8 | Eternal Wings (Nephilim) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 9 | Sky Master Mask | 20 | Class | druid | a 25-foot fly Speed (against fliers) | +0.45 ± 0.06 | +0.94 | −0.04 | 0.0 | strong | the AI never used it |
| 10 | Ghost Dedication | 2 | Class | — | a 25-foot fly Speed (against fliers) | +0.41 ± 0.04 | +0.60 | +0.21 | 0.0 | strong | the AI never used it |
| 11 | True Dragon's Flight | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 12 | Full Flight | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 13 | Soaring Form | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 14 | Fully Flighted | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 15 | Hero's Wings | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 16 | Fiendish Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | +0.30 ± 0.04 | +0.54 | +0.06 | 0.0 | strong | the AI never used it |
| 17 | Celestial Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | +0.30 ± 0.04 | +0.54 | +0.06 | 0.0 | strong | the AI never used it |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Devil's Wings | 16 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.77 | +0.25 | 0.0 | very strong | the AI never used it |
| 2 | Mortal Ascension | 14 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.85 | +0.16 | 0.0 | very strong | the AI never used it |
| 3 | Ascend | 14 | Class | — | a 25-foot fly Speed (against fliers) | +0.51 ± 0.04 | +0.85 | +0.16 | 0.0 | very strong | the AI never used it |
| 4 | Mighty Wings | 18 | Class | — | a 25-foot fly Speed (against fliers) | +0.50 ± 0.03 | +0.70 | +0.30 | 0.0 | strong | the AI never used it |
| 5 | Eternal Wings (Sylph) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 6 | Wyrmling Flight | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 7 | Soaring Poppet | 17 | Ancestry | — | a 15-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 8 | Eternal Wings (Nephilim) | 17 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.48 ± 0.03 | +0.69 | +0.27 | 0.0 | strong | the AI never used it |
| 9 | Sky Master Mask | 20 | Class | druid | a 25-foot fly Speed (against fliers) | +0.45 ± 0.06 | +0.94 | −0.04 | 0.0 | strong | the AI never used it |
| 10 | Ghost Dedication | 2 | Class | — | a 25-foot fly Speed (against fliers) | +0.41 ± 0.04 | +0.60 | +0.21 | 0.0 | strong | the AI never used it |
| 11 | True Dragon's Flight | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 12 | Full Flight | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 13 | Soaring Form | 9 | Ancestry | — | a 20-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 14 | Fully Flighted | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 15 | Hero's Wings | 9 | Ancestry | — | a 25-foot fly Speed (against fliers) | +0.34 ± 0.03 | +0.57 | +0.11 | 0.0 | strong | the AI never used it |
| 16 | Fiendish Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | +0.30 ± 0.04 | +0.54 | +0.06 | 0.0 | strong | the AI never used it |
| 17 | Celestial Form | 18 | Class | champion | a 25-foot fly Speed (against fliers) | +0.30 ± 0.04 | +0.54 | +0.06 | 0.0 | strong | the AI never used it |

## Not simulated, by reason

| Reason | Count |
|---|---:|
