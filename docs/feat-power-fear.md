# Feat power against fear (foes that use Dread Gaze whenever it recharges, FEAT_FOE_TRAIT=fear)

Made by `node tools/feat-power.mjs` on 2026-11-05: 6 feats and actions rated, 0 not simulated.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each (at most; a feat's fights stop once its answer is clear: on average 154 an encounter here, all fights 8, no effect 3, precise 1 encounters), with the feat and without it, on the same dice, on a 5-foot square grid (an open field, the sides 30 feet apart, each side's melee fighters in front and its casters two squares behind; moving out of a foe's reach provokes its Reactive Strike). Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in the fights that rated it. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 4
- minor: 1
- hurts: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Reminder of the Greater Fear | 8 | Class | — | check | +0.10 ± 0.03 | +0.11 | +0.09 | 1.0 | minor |  |
| 2 | Creature Comforts | 4 | Class | barbarian | check | +0.03 ± 0.03 | +0.02 | +0.05 | 1.5 | no clear effect |  |
| 3 | Comforting Presence | 10 | Skill | — | check | +0.01 ± 0.03 | −0.00 | +0.03 | 0.7 | no clear effect |  |
| 4 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.02 | +0.00 | +0.01 | 0.6 | no clear effect |  |
| 5 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 6 | Tactical Retreat | 0 | Action | — | check | −0.36 ± 0.06 | −0.23 | −0.49 | 1.0 | hurts |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Reminder of the Greater Fear | 8 | Class | — | check | +0.10 ± 0.03 | +0.11 | +0.09 | 1.0 | minor |  |
| 2 | Creature Comforts | 4 | Class | barbarian | check | +0.03 ± 0.03 | +0.02 | +0.05 | 1.5 | no clear effect |  |
| 3 | Comforting Presence | 10 | Skill | — | check | +0.01 ± 0.03 | −0.00 | +0.03 | 0.7 | no clear effect |  |
| 4 | Reassuring Presence | 1 | Ancestry | — | check | +0.00 ± 0.02 | +0.00 | +0.01 | 0.6 | no clear effect |  |
| 5 | Mask of Fear | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 6 | Tactical Retreat | 0 | Action | — | check | −0.36 ± 0.06 | −0.23 | −0.49 | 1.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
