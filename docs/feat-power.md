# Feat and action power in combat

Made by `node tools/feat-power.mjs` on 2026-11-01: 525 feats and actions rated, 6422 not simulated, 2 errors.

## How it's measured

- The feat module compiles each feat with the numbers of the standard party's PC who'd take it (fighter, rogue, wizard or cleric; a class outside the party goes to the one who fights most like it), at the feat's level.
- The party fights a moderate boss (one creature 2 levels up) and a moderate group (four creatures 2 levels down), 200 fights each, with the feat and without it, on the same dice. Fights go to the end (no morale, no retreat).
- A fight's score is the danger scale's: the party's Hit Points lost as a share, +0.25 a PC down, +1 a PC killed, +1 a wipe.
- **Rating** is the change in levels of the foes: the score the feat saves, divided by how much the score moves when the foes are a level stronger. +0.25 means having the feat is like fighting foes a quarter of a level lower. The ± is one standard error.
- **Uses a fight** is how often the PC used it in a dozen logged fights. A feat the AI never picks rates near zero even if it's good at the table.
- Verdicts: very strong ≥ 0.5, strong ≥ 0.25, good ≥ 0.1, minor > 0; "no clear effect" when within two standard errors of zero.

## Summary

- no clear effect: 509
- hurts: 7
- good: 5
- very strong: 2
- strong: 1
- minor: 1

## Top 40

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.72 ± 0.05 | +1.25 | +0.19 | 4.2 | very strong |  |
| 2 | Goblin Jubilee | 0 | Action | — | save | +0.55 ± 0.04 | +0.24 | +0.86 | 0.3 | very strong |  |
| 3 | Scare to Death | 15 | Skill | — | save | +0.27 ± 0.04 | +0.50 | +0.04 | 1.0 | strong |  |
| 4 | Pierce the Eye | 16 | Class | — | save | +0.21 ± 0.05 | +0.38 | +0.03 | 1.2 | good |  |
| 5 | Acrid Barrage | 0 | Action | — | save | +0.20 ± 0.04 | +0.25 | +0.15 | 0.9 | good |  |
| 6 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.19 ± 0.07 | +0.18 | +0.20 | 4.0 | good | with two weapons (longsword and shortsword) |
| 7 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.19 ± 0.07 | +0.18 | +0.20 | 4.0 | good | with two weapons (longsword and shortsword) |
| 8 | Pack Attack | 6 | Class | — | strike-extra | +0.11 ± 0.03 | +0.17 | +0.05 | 0.0 | good | the AI never used it |
| 9 | Devastating Duelist | 18 | Class | — | Strike activity | +0.09 ± 0.03 | +0.17 | +0.00 | 3.5 | minor |  |
| 10 | Telling Blow | 18 | Class | — | Strike activity | +0.07 ± 0.05 | +0.10 | +0.04 | 6.2 | no clear effect |  |
| 11 | Fatal Shot | 18 | Class | — | Strike activity | +0.06 ± 0.04 | +0.10 | +0.01 | 1.8 | no clear effect |  |
| 12 | Head Stomp | 4 | Class | rogue | Strike activity | +0.05 ± 0.03 | +0.07 | +0.04 | 5.5 | no clear effect |  |
| 13 | Wither Away | 16 | Class | — | save | +0.05 ± 0.04 | +0.12 | −0.02 | 0.8 | no clear effect |  |
| 14 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.05 ± 0.02 | +0.07 | +0.03 | 11.8 | no clear effect | with a one-handed weapon and a free hand |
| 15 | Gang Up | 6 | Class | rogue | passive-rules | +0.05 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect |  |
| 16 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.04 ± 0.02 | +0.09 | −0.01 | 2.2 | no clear effect | with a bow in hand |
| 17 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.04 ± 0.06 | +0.10 | −0.02 | 2.2 | no clear effect |  |
| 18 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.04 ± 0.06 | +0.10 | −0.02 | 2.8 | no clear effect |  |
| 19 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.03 | +0.01 | +0.07 | 0.3 | no clear effect |  |
| 20 | Remember Their Names | 16 | Class | — | save | +0.04 ± 0.04 | +0.07 | +0.00 | 1.7 | no clear effect |  |
| 21 | Do You Know Who I Am? | 12 | Class | — | check | +0.04 ± 0.05 | +0.11 | −0.04 | 0.8 | no clear effect |  |
| 22 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.03 ± 0.04 | +0.13 | −0.06 | 6.2 | no clear effect |  |
| 23 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.02 | +0.08 | −0.01 | 1.6 | no clear effect |  |
| 24 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.03 ± 0.03 | +0.01 | +0.06 | 1.5 | no clear effect |  |
| 25 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.03 ± 0.03 | +0.01 | +0.06 | 1.5 | no clear effect | with a bow in hand |
| 26 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.04 | +0.08 | −0.02 | 0.8 | no clear effect |  |
| 27 | Quill Spray | 9 | Ancestry | — | save | +0.03 ± 0.02 | −0.00 | +0.06 | 0.5 | no clear effect |  |
| 28 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.03 ± 0.01 | +0.03 | +0.03 | 0.0 | no clear effect |  |
| 29 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.03 ± 0.02 | +0.04 | +0.01 | 1.3 | no clear effect |  |
| 30 | Doom of Sailors | 17 | Ancestry | — | save | +0.03 ± 0.03 | +0.08 | −0.03 | 1.0 | no clear effect |  |
| 31 | Boarding Assault | 0 | Action | — | Strike activity | +0.03 ± 0.02 | +0.03 | +0.02 | 1.1 | no clear effect |  |
| 32 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.03 ± 0.02 | +0.03 | +0.02 | 1.1 | no clear effect |  |
| 33 | Gladiator's Roar | 12 | Class | — | save | +0.03 ± 0.04 | +0.00 | +0.05 | 0.9 | no clear effect |  |
| 34 | Herald's Strike | 20 | Class | — | save | +0.03 ± 0.03 | +0.06 | −0.01 | 0.8 | no clear effect |  |
| 35 | Feral Mending | 8 | Class | — | check | +0.03 ± 0.01 | +0.02 | +0.03 | 0.1 | no clear effect |  |
| 36 | Confusing Commands | 16 | Class | commander | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Calculate Threats | 0 | Action | psychic | effect | +0.02 ± 0.02 | −0.02 | +0.07 | 1.0 | no clear effect |  |
| 38 | Rain of Bolts | 9 | Ancestry | — | save | +0.02 ± 0.03 | −0.00 | +0.05 | 0.5 | no clear effect |  |
| 39 | Call Hellfire | 8 | Class | — | save | +0.02 ± 0.02 | +0.01 | +0.04 | 0.2 | no clear effect |  |
| 40 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.02 ± 0.02 | +0.06 | −0.01 | 3.7 | no clear effect |  |

## Basic actions

Each basic action left out of every PC, at levels 1, 5, 10, 15 and 20: what the party loses without it.

| Action | Rating (levels) | Uses a fight (level 10 boss) |
|---|---:|---:|
| Demoralize | +0.01 ± 0.01 | 0.7 |
| Feint | +0.00 ± 0.00 | 0.0 |
| Trip | +0.00 ± 0.00 | 0.0 |
| Shove | +0.00 ± 0.00 | 0.0 |
| Disarm | +0.00 ± 0.00 | 0.0 |
| Escape | +0.00 ± 0.00 | 0.0 |
| Reposition | +0.00 ± 0.00 | 0.0 |
| Grapple | −0.01 ± 0.00 | 0.1 |

## Every rated feat and action

| # | Feat or action | Lvl | Kind | Class | Played as | Rating (levels) | Boss | Group | Uses a fight | Verdict | Notes |
|---:|---|---:|---|---|---|---:|---:|---:|---:|---|---|
| 1 | Pin to the Spot | 14 | Class | — | Strike activity | +0.72 ± 0.05 | +1.25 | +0.19 | 4.2 | very strong |  |
| 2 | Goblin Jubilee | 0 | Action | — | save | +0.55 ± 0.04 | +0.24 | +0.86 | 0.3 | very strong |  |
| 3 | Scare to Death | 15 | Skill | — | save | +0.27 ± 0.04 | +0.50 | +0.04 | 1.0 | strong |  |
| 4 | Pierce the Eye | 16 | Class | — | save | +0.21 ± 0.05 | +0.38 | +0.03 | 1.2 | good |  |
| 5 | Acrid Barrage | 0 | Action | — | save | +0.20 ± 0.04 | +0.25 | +0.15 | 0.9 | good |  |
| 6 | Two-Weapon Flurry | 14 | Class | fighter | 2 Strikes | +0.19 ± 0.07 | +0.18 | +0.20 | 4.0 | good | with two weapons (longsword and shortsword) |
| 7 | Two-Weapon Fusillade | 14 | Class | gunslinger | 2 Strikes | +0.19 ± 0.07 | +0.18 | +0.20 | 4.0 | good | with two weapons (longsword and shortsword) |
| 8 | Pack Attack | 6 | Class | — | strike-extra | +0.11 ± 0.03 | +0.17 | +0.05 | 0.0 | good | the AI never used it |
| 9 | Devastating Duelist | 18 | Class | — | Strike activity | +0.09 ± 0.03 | +0.17 | +0.00 | 3.5 | minor |  |
| 10 | Telling Blow | 18 | Class | — | Strike activity | +0.07 ± 0.05 | +0.10 | +0.04 | 6.2 | no clear effect |  |
| 11 | Fatal Shot | 18 | Class | — | Strike activity | +0.06 ± 0.04 | +0.10 | +0.01 | 1.8 | no clear effect |  |
| 12 | Head Stomp | 4 | Class | rogue | Strike activity | +0.05 ± 0.03 | +0.07 | +0.04 | 5.5 | no clear effect |  |
| 13 | Wither Away | 16 | Class | — | save | +0.05 ± 0.04 | +0.12 | −0.02 | 0.8 | no clear effect |  |
| 14 | Disarming Twist | 10 | Class | fighter | Strike activity | +0.05 ± 0.02 | +0.07 | +0.03 | 11.8 | no clear effect | with a one-handed weapon and a free hand |
| 15 | Gang Up | 6 | Class | rogue | passive-rules | +0.05 ± 0.02 | +0.07 | +0.02 | 0.0 | no clear effect |  |
| 16 | Double Shot | 4 | Class | fighter | 2 Strikes | +0.04 ± 0.02 | +0.09 | −0.01 | 2.2 | no clear effect | with a bow in hand |
| 17 | Spring from the Shadows | 12 | Class | rogue | Strike activity | +0.04 ± 0.06 | +0.10 | −0.02 | 2.2 | no clear effect |  |
| 18 | Mobile Finisher | 12 | Class | swashbuckler | Strike activity | +0.04 ± 0.06 | +0.10 | −0.02 | 2.8 | no clear effect |  |
| 19 | Dragon Breath | 0 | Action | — | save | +0.04 ± 0.03 | +0.01 | +0.07 | 0.3 | no clear effect |  |
| 20 | Remember Their Names | 16 | Class | — | save | +0.04 ± 0.04 | +0.07 | +0.00 | 1.7 | no clear effect |  |
| 21 | Do You Know Who I Am? | 12 | Class | — | check | +0.04 ± 0.05 | +0.11 | −0.04 | 0.8 | no clear effect |  |
| 22 | Stumbling Finisher | 10 | Class | swashbuckler | Strike activity | +0.03 ± 0.04 | +0.13 | −0.06 | 6.2 | no clear effect |  |
| 23 | Fear No Law, Fear No One | 0 | Bonus | — | Strike activity | +0.03 ± 0.02 | +0.08 | −0.01 | 1.6 | no clear effect |  |
| 24 | Flurry of Blows | 0 | Action | monk | 2 Strikes | +0.03 ± 0.03 | +0.01 | +0.06 | 1.5 | no clear effect |  |
| 25 | Hunted Shot | 1 | Class | ranger | 2 Strikes | +0.03 ± 0.03 | +0.01 | +0.06 | 1.5 | no clear effect | with a bow in hand |
| 26 | Sapping Symbol | 12 | Class | cleric | check | +0.03 ± 0.04 | +0.08 | −0.02 | 0.8 | no clear effect |  |
| 27 | Quill Spray | 9 | Ancestry | — | save | +0.03 ± 0.02 | −0.00 | +0.06 | 0.5 | no clear effect |  |
| 28 | Grand Medic's Mask | 20 | Class | druid | fast-healing | +0.03 ± 0.01 | +0.03 | +0.03 | 0.0 | no clear effect |  |
| 29 | Rejoin in Flight | 0 | Action | — | 2 Strikes | +0.03 ± 0.02 | +0.04 | +0.01 | 1.3 | no clear effect |  |
| 30 | Doom of Sailors | 17 | Ancestry | — | save | +0.03 ± 0.03 | +0.08 | −0.03 | 1.0 | no clear effect |  |
| 31 | Boarding Assault | 0 | Action | — | Strike activity | +0.03 ± 0.02 | +0.03 | +0.02 | 1.1 | no clear effect |  |
| 32 | Sudden Charge | 1 | Class | barbarian | Strike activity | +0.03 ± 0.02 | +0.03 | +0.02 | 1.1 | no clear effect |  |
| 33 | Gladiator's Roar | 12 | Class | — | save | +0.03 ± 0.04 | +0.00 | +0.05 | 0.9 | no clear effect |  |
| 34 | Herald's Strike | 20 | Class | — | save | +0.03 ± 0.03 | +0.06 | −0.01 | 0.8 | no clear effect |  |
| 35 | Feral Mending | 8 | Class | — | check | +0.03 ± 0.01 | +0.02 | +0.03 | 0.1 | no clear effect |  |
| 36 | Confusing Commands | 16 | Class | commander | save | +0.02 ± 0.01 | +0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 37 | Calculate Threats | 0 | Action | psychic | effect | +0.02 ± 0.02 | −0.02 | +0.07 | 1.0 | no clear effect |  |
| 38 | Rain of Bolts | 9 | Ancestry | — | save | +0.02 ± 0.03 | −0.00 | +0.05 | 0.5 | no clear effect |  |
| 39 | Call Hellfire | 8 | Class | — | save | +0.02 ± 0.02 | +0.01 | +0.04 | 0.2 | no clear effect |  |
| 40 | Unbalancing Finisher | 2 | Class | swashbuckler | Strike activity | +0.02 ± 0.02 | +0.06 | −0.01 | 3.7 | no clear effect |  |
| 41 | Emit Defensive Odor | 1 | Ancestry | — | save | +0.02 ± 0.02 | +0.01 | +0.03 | 0.6 | no clear effect |  |
| 42 | Glory on High | 18 | Class | — | save | +0.02 ± 0.02 | −0.00 | +0.04 | 0.2 | no clear effect |  |
| 43 | Hellbreaker Strike | 0 | Action | — | Strike activity | +0.02 ± 0.02 | +0.04 | +0.01 | 1.3 | no clear effect |  |
| 44 | Scout's Charge | 4 | Class | — | Strike activity | +0.02 ± 0.01 | +0.02 | +0.02 | 1.3 | no clear effect |  |
| 45 | Ravenous Charge | 4 | Class | — | Strike activity | +0.02 ± 0.01 | +0.02 | +0.02 | 1.3 | no clear effect |  |
| 46 | Interpose | 4 | Class | — | Strike activity | +0.02 ± 0.01 | +0.02 | +0.02 | 1.3 | no clear effect |  |
| 47 | Call Worm Spirit | 10 | Class | — | save | +0.02 ± 0.02 | −0.00 | +0.04 | 0.9 | no clear effect |  |
| 48 | Healing Nexus | 8 | Class | — | healing | +0.02 ± 0.02 | +0.01 | +0.02 | 0.2 | no clear effect |  |
| 49 | Break Free | 0 | Action | — | Strike activity | +0.02 ± 0.02 | +0.01 | +0.02 | 1.1 | no clear effect |  |
| 50 | Defensive Advance | 1 | Class | champion | Strike activity | +0.02 ± 0.02 | +0.01 | +0.02 | 1.1 | no clear effect |  |
| 51 | Subjugation | 16 | Class | — | save | +0.02 ± 0.01 | +0.01 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 52 | Kaleidoscopic Entreaty | 8 | Class | — | save | +0.02 ± 0.02 | +0.03 | +0.00 | 0.2 | no clear effect |  |
| 53 | Clobber | 16 | Class | guardian | Strike activity | +0.02 ± 0.01 | +0.01 | +0.02 | 0.3 | no clear effect |  |
| 54 | Demon Slayer | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.02 | +0.01 | 0.1 | no clear effect |  |
| 55 | Impossible Flurry | 18 | Class | ranger | 3 Strikes | +0.01 ± 0.01 | −0.00 | +0.03 | 0.3 | no clear effect | with two weapons (longsword and shortsword) |
| 56 | Yamaraj's Grandeur | 17 | Ancestry | — | save | +0.01 ± 0.02 | −0.00 | +0.03 | 0.5 | no clear effect |  |
| 57 | Sniper's Aim | 6 | Class | gunslinger | Strike activity | +0.01 ± 0.01 | +0.02 | +0.01 | 0.3 | no clear effect |  |
| 58 | Spiritual Disruption | 0 | Bonus | — | Strike activity | +0.01 ± 0.01 | +0.02 | +0.01 | 0.1 | no clear effect |  |
| 59 | Cantorian Rejuvenation | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 60 | Bloodline Resistance | 8 | Class | sorcerer | save-bonus | +0.01 ± 0.01 | +0.01 | +0.01 | 0.0 | no clear effect |  |
| 61 | Trial by Skyfire | 10 | Class | oracle | save | +0.01 ± 0.02 | −0.02 | +0.04 | 0.2 | no clear effect |  |
| 62 | Reversing Charge | 8 | Class | — | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 2.0 | no clear effect |  |
| 63 | Juggernaut Charge | 8 | Class | guardian | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 2.0 | no clear effect |  |
| 64 | Fleeing Shriek | 9 | Ancestry | — | save | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 65 | No Scar but This | 0 | Action | — | check | +0.01 ± 0.00 | +0.01 | +0.01 | 0.1 | no clear effect |  |
| 66 | Viper Strike | 9 | Ancestry | — | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 2.1 | no clear effect |  |
| 67 | Drain Vitality | 10 | Class | — | check | +0.01 ± 0.01 | +0.00 | +0.02 | 0.0 | no clear effect | the AI never used it |
| 68 | Decree of War | 18 | Class | — | Strike activity | +0.01 ± 0.01 | +0.00 | +0.02 | 0.1 | no clear effect |  |
| 69 | Goring Charge | 9 | Ancestry | — | Strike activity | +0.01 ± 0.01 | −0.00 | +0.02 | 2.1 | no clear effect |  |
| 70 | Wing Buffet | 9 | Ancestry | — | check | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 71 | Frightening Indignation | 16 | Class | — | save | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 72 | Break Them Down | 0 | Action | gunslinger | Strike activity | +0.01 ± 0.03 | +0.01 | +0.00 | 0.7 | no clear effect |  |
| 73 | Tidal Wave | 16 | Class | — | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 74 | Bone Swarm | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 75 | Vital Shot | 0 | Action | gunslinger | Strike activity | +0.01 ± 0.03 | −0.02 | +0.03 | 0.8 | no clear effect |  |
| 76 | Become as Shadow | 17 | Ancestry | — | PF2e's self Effect | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 77 | Clan's Edge | 1 | Ancestry | — | 2 Strikes | +0.01 ± 0.01 | +0.00 | +0.01 | 1.3 | no clear effect |  |
| 78 | Elemental Assault | 1 | Ancestry | — | effect | +0.01 ± 0.03 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 79 | Needle in the Gods' Eyes | 16 | Class | fighter | 2 Strikes | +0.01 ± 0.01 | +0.01 | +0.00 | 3.4 | no clear effect |  |
| 80 | Nimble Dodge | 1 | Class | rogue | ac-reaction | +0.01 ± 0.00 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 81 | Desiccating Inhalation | 12 | Class | — | save | +0.01 ± 0.03 | +0.01 | +0.00 | 0.8 | no clear effect |  |
| 82 | Convocation of Earth and Moon | 17 | Ancestry | — | save | +0.01 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 83 | Chastise | 16 | Class | — | save | +0.01 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 84 | Trip | 0 | Action | — | check | +0.01 ± 0.00 | +0.01 | +0.00 | 0.3 | no clear effect |  |
| 85 | Tamper | 1 | Class | inventor | check | +0.01 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 86 | Taste Blood | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 87 | Death of Hope | 17 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 88 | Incredible Aim | 8 | Class | fighter | Strike activity | +0.00 ± 0.03 | −0.01 | +0.02 | 2.5 | no clear effect |  |
| 89 | Duo's Aim | 8 | Class | — | Strike activity | +0.00 ± 0.03 | −0.01 | +0.02 | 2.5 | no clear effect |  |
| 90 | Rock The Boat | 8 | Class | fighter | check | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 91 | Draw From the Land | 10 | Class | — | check | +0.00 ± 0.01 | +0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 92 | Dominion Aura | 17 | Ancestry | — | save | +0.00 ± 0.01 | +0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 93 | Psi Burst | 2 | Class | psychic | save | +0.00 ± 0.02 | +0.04 | −0.03 | 1.2 | no clear effect |  |
| 94 | Tap Vitality | 6 | Class | — | check | +0.00 ± 0.01 | +0.01 | +0.00 | 0.1 | no clear effect |  |
| 95 | Bristle | 5 | Ancestry | — | effect | +0.00 ± 0.01 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 96 | Fabricate Truth | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 97 | Paralyzing Jewel | 9 | Ancestry | — | save | +0.00 ± 0.01 | +0.00 | +0.01 | 0.1 | no clear effect |  |
| 98 | Overclock Senses | 2 | Class | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 1.4 | no clear effect |  |
| 99 | Ultimatum of Liberation | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 100 | Jinx | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 101 | Stridulating Song | 0 | Action | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 102 | Warped Reflection | 1 | Ancestry | — | save | +0.00 ± 0.00 | +0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 103 | Sheltering Wing | 9 | Ancestry | — | effect | +0.00 ± 0.01 | −0.01 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 104 | Dirty Trick | 1 | Skill | — | check | +0.00 ± 0.00 | +0.01 | +0.00 | 0.2 | no clear effect |  |
| 105 | Tears of Pearl | 9 | Ancestry | — | save | +0.00 ± 0.01 | −0.00 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 106 | Spirit Guide Form | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 107 | Edict of Mortality | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 108 | Divine Countermeasures | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 109 | Electrogenesis | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 110 | Daydream Trance | 0 | Action | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 111 | Enter Spirit Trance | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 112 | Swirl Crimson Shroud | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 113 | Stoked Flame Stance | 1 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 114 | Hydraulic Deflection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 115 | Ceremony of Protection | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 116 | Brutish Shove | 2 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 117 | Dragging Strike | 2 | Class | fighter | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 118 | Golden Body | 20 | Class | monk | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 119 | Repel Ambient Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 120 | Trample Mimicry | 10 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 121 | Exacting Strike | 1 | Class | fighter | Strike activity | +0.00 ± 0.01 | +0.00 | −0.00 | 1.7 | no clear effect |  |
| 122 | Might of the Realm | 14 | Class | — | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 123 | Radiant Burst | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 124 | Targeting Finisher | 10 | Class | swashbuckler | Strike activity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 125 | Hellbreaker's Resolve | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 126 | Feign Innocence | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 127 | Petrifying Gaze Mimicry | 10 | Class | — | save | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 128 | Ponpoko-Pon! | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 129 | I Will Return | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 130 | Rain of Embers Stance | 1 | Class | monk | stance | +0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 131 | Pummeling Whirlpool | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 132 | Psi Catastrophe | 12 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 133 | Muckraking | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 134 | Cenotaph Stance | 20 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 135 | Enervating Wail | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | −0.00 | 0.1 | no clear effect |  |
| 136 | Spell-Repelling Form | 14 | Class | summoner | save-bonus | +0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect |  |
| 137 | Drink Blood | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 138 | Bend Time | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 139 | Demoralize | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 140 | Entity's Resurgence | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 141 | Living Fortification | 0 | Action | gunslinger | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 142 | Shove | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 143 | Blizzard Evasion | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 144 | Salt Wound | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 145 | Opportunistic Accusation | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 146 | Crash Against Me | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 147 | Disarm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 148 | Spit Ambient Magic | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 149 | Spiritual Scar | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 150 | Timely Dodge | 0 | Action | — | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 151 | Arcane Cascade | 0 | Action | magus | PF2e's stance Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 152 | Absorb Magic | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 153 | Designate Ally | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 154 | Drain Realm | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 155 | Reactive Strike | 0 | Action | — | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 156 | Toxic Skin | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 157 | Unwavering Resilience | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 158 | Call Upon the Brightness | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 159 | Race the Skies | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 160 | Wish for Luck | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 161 | Wicked Thorns | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 162 | Barbed Quills | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 163 | Grapple | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.5 | no clear effect |  |
| 164 | Administer Ambient Magic | 0 | Action | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 165 | Spellstrike | 0 | Action | magus | spellstrike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 166 | Runelord's Response | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 167 | Spirit's Mercy | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 168 | Avert Gaze | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 169 | Accept Echo | 0 | Action | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 170 | Pointed Question | 0 | Action | investigator | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 171 | Launch Fireworks | 0 | Action | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 172 | Ghost Wrangler | 4 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 173 | Resilient Mind | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 174 | Cantorian Reinforcement | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 175 | Poison Resistance | 2 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 176 | You're an Embarrassment! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 177 | Cellular Reconstruction | 12 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 178 | Hazard Finder | 8 | Class | ranger | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 179 | Undaunted | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 180 | Dance of the Mousedeer | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 181 | Coral Symbiotes | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 182 | Oozemorph Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 183 | Extra Squishy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 184 | Premonition of Clarity | 14 | Class | cleric | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 185 | Diverse Mystery | 16 | Class | oracle | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 186 | Revivifying Mutagen | 2 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 187 | Inscribed Blast | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 188 | Called | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 189 | Radiant Circuitry | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 190 | Decree of Execution | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 191 | Renewed Vigor | 8 | Class | barbarian | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 192 | Shield Your Eyes | 2 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 193 | Osteo Armaments | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 194 | Dance of the Tiger | 9 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 195 | Towering Transformation | 14 | Class | barbarian | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 196 | Numb | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 197 | Detective's Readiness | 4 | Class | investigator | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 198 | Timeless Body | 14 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 199 | Magic Warrior Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 200 | Herald's Weapon | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 201 | Bleak Humorist | 12 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 202 | Affliction Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 203 | Of Lions and Wyrms | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 204 | Mighty Bulwark | 8 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 205 | Fisheye | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 206 | Borrow Time | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 207 | Spray Ink | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 208 | Furnace Form | 12 | Class | kineticist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 209 | Irradiate | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 210 | Hard to Fool | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 211 | Protective Cycle | 16 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 212 | Mental Static | 8 | Class | psychic | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 213 | Heroic Defiance | 4 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 214 | Devil's Advocate | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 215 | Endure Death's Touch | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 216 | Dazzling Bullet | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 217 | Kaiju Defense Oath | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 218 | Shaped Contaminant | 12 | Class | alchemist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 219 | Spore Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 220 | Inspiring Resilience | 4 | Class | bard | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 221 | Such a Disgrace! | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 222 | Catchy Tune | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 223 | Breath Control | 1 | General | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 224 | Grudging Compliment | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 225 | Peer Beyond | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 226 | Forlorn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 227 | Kin Hunter | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 228 | Hold Mark | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 229 | Wind Tempered | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 230 | Peculiar Anatomy | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 231 | Shattering Strike (Weapon Improviser) | 10 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 232 | Twitchy | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 233 | Spark Fist | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 234 | Ease the Burden | 20 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 235 | Waxed Feathers | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 236 | Mineral Deposits | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 237 | Immortal Bear | 20 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 238 | Alghollthu Bound | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 239 | Animalistic Resistance | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 240 | Grove-Harbored | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 241 | Perplex | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 242 | No Stranger to Death | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 243 | Impose Order (Infernal Pactbreaker) | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 244 | Flashy Roll | 8 | Class | swashbuckler | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 245 | Echoing Violence | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 246 | Whirling Knockdown | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 247 | Spellmaster's Resilience | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 248 | Keep Up the Good Fight | 14 | Class | guardian | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 249 | Noble Resolve | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 250 | Entreat with Forebears | 2 | Class | sorcerer | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 251 | Elven Verve | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 252 | Emotionless | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 253 | Fey Transcendence | 17 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 254 | Draconic Arrogance | 1 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 255 | Fly on Shadowed Wings | 10 | Class | animist | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 256 | Nimble Roll | 8 | Class | rogue | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 257 | Dark Persona's Presence | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 258 | Divine Reflexes | 14 | Class | champion | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 259 | Friend of Fear | 5 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 260 | Martyr's Parry | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 261 | Radiate Glory | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 262 | Pain Tolerance | 6 | Class | barbarian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 263 | Divine Disharmony | 1 | Class | thaumaturge | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 264 | Wings of Air | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 265 | Fey Fellowship | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 266 | Lawbringer | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 267 | Enforce Oath | 12 | Class | champion | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 268 | Necromantic Physiology | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 269 | Harness Natural Magic | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 270 | Adhyabhau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 271 | Frostbite Runes | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 272 | Avenge in Glory | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 273 | Adamantine Body | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 274 | Proteankin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 275 | Divine Health | 2 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 276 | Diamond Soul | 12 | Class | monk | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 277 | Irresistible Bloom | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 278 | Mesmerizing Gaze | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 279 | Gaping Flesh | 5 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 280 | Well-Groomed | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 281 | Draconic Sycophant | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 282 | Goloma Courage | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 283 | Death Warden | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 284 | Maiden's Mending | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 285 | Disturbing Knowledge | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 286 | Blazing Aura | 17 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 287 | Life-Giving Magic | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 288 | Brightsoul | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 289 | Terrifying Resistance | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 290 | Ardent Armiger | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 291 | Catfolk Dance | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 292 | Dragonet Resistances | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 293 | High Alert | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 294 | Well-Versed | 1 | Class | bard | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 295 | Moisture Bath | 9 | Ancestry | — | PF2e's self Effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 296 | Fey Ascension | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 297 | Wake and Tremble | 8 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 298 | Exaltation Overwhelming | 18 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 299 | Pennant of Victory | 20 | Class | commander | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 300 | Practiced Brawn | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 301 | Pain is Temporary | 13 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 302 | Loose Cannon | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 303 | Force of Nature | 16 | Class | — | fast-healing | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 304 | Savor the Hunt | 1 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 305 | Norgorber's Secret | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 306 | Bitter Taste of Betrayal | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 307 | Trance of Celerity | 1 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 308 | Rakshasa Ravaged | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 309 | Cel Rau | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 310 | Calcifying Sand | 4 | Class | kineticist | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 311 | Raise Symbol | 4 | Class | cleric | self effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.1 | no clear effect |  |
| 312 | Live Off Borrowed Time | 14 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 313 | Dream May | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 314 | Web Walker | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 315 | Quick Absorption | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 316 | Emberkin | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 317 | Living Stone | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 318 | Fiery Rebirth | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 319 | Traditional Resistances | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 320 | Perfume Cloud | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 321 | Necromantic Resistance (Undead Slayer) | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 322 | Improved Dueling Riposte | 12 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 323 | Precious Ammunition | 8 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 324 | Necromantic Resistance | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 325 | Think Twice | 14 | Class | fighter | ac-reaction | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 326 | Survivor of Desolation | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 327 | Myth of Realm-Walking | 14 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 328 | Keen Nose | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 329 | Ward Against Corruption | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 330 | Shadow Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 331 | Disrupting Strikes | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 332 | Reactive Strike | 6 | Class | barbarian | reactive-strike | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 333 | Stone Face | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 334 | Winter's Embrace | 10 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 335 | Fulminating Shot | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 336 | Cold Iron Stomach | 13 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 337 | Searing Restoration | 2 | Class | inventor | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 338 | Bold Defiance | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 339 | Emotional Partitions | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 340 | Dragon Disciple Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 341 | Ringmaster's Introduction | 20 | Class | bard | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 342 | Cannonball Fall | 8 | Class | fighter | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 343 | Necromantic Tenacity | 8 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 344 | Aegis of the Dissolution | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 345 | Defensive Growth | 6 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 346 | Vindictive Thoughts | 16 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 347 | Kobold Momentum | 5 | Ancestry | — | momentum | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 348 | Fire Resistance | 4 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 349 | Lab Rat | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 350 | Avenger Dedication | 2 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 351 | Cantorian Restoration | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 352 | Consolidated Overlay Panopticon | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 353 | Mobility | 2 | Class | rogue | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 354 | Howling Aspect | 1 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 355 | Ferocious Will | 9 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 356 | Wary Disarmament | 2 | Skill | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 357 | Instinctual Interception | 14 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 358 | Iomedae's Valor | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 359 | Guided by the Stars | 5 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 360 | Ancestral Suspicion | 5 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 361 | Exalted Greatness | 14 | Class | champion | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 362 | Nourishing Gate | 14 | Class | kineticist | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 363 | Fleet Tempo | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 364 | Tide-hardened | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 365 | Illusion Sense | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 366 | Asp Stance | 6 | Class | monk | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 367 | Safeguard Soul | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 368 | Terrain Shield | 14 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 369 | Timeless Nature | 14 | Class | druid | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 370 | Fear No Pain! | 6 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 371 | Fish From the Falls' Edge | 10 | Class | exemplar | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 372 | Parthenogenic Hatchling | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 373 | Witch Warden | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 374 | Majestic Presence | 13 | Ancestry | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 375 | Dismal Harvest | 8 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 376 | Void Siphon (Necromancer) | 4 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 377 | Sky and Heaven Stance | 6 | Class | — | stance | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 378 | Unwavering Mien | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 379 | Unfaltering Ranks | 17 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 380 | Fermenting Liquors | 4 | Class | alchemist | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 381 | Cranial Detonation | 18 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 382 | Awake With a Roar | 14 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 383 | Unshakable Idealism | 8 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 384 | Divine Wings | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 385 | Cold Minded | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 386 | Improved Twin Riposte (Fighter) | 14 | Class | fighter | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 387 | Dissolution's Sight | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 388 | Irrepressible (Nephilim) | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 389 | Plumekith | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 390 | Pact of the Nightblossom | 10 | Class | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 391 | High-Speed Regeneration | 6 | Class | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 392 | Traditional Ways | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 393 | Stubborn Defiance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 394 | Divine Aegis | 2 | Class | oracle | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 395 | Never! | 16 | Class | guardian | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 396 | Frightful Moan | 4 | Class | — | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 397 | Prevailing Position | 10 | Class | monk | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 398 | Construct Dynamo | 12 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 399 | Victorious Vigor | 5 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 400 | Evangelize | 7 | Skill | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 401 | Gathering Moss | 10 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 402 | Dance of the Jester | 13 | Ancestry | — | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 403 | Arcane Propulsion | 9 | Ancestry | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 404 | Sharkskin Grip | 4 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 405 | Wrathful Presence | 12 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 406 | Pistolero's Challenge | 6 | Class | gunslinger | check | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 407 | Adaptive Vision | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 408 | Bravo's Determination | 8 | Class | — | ferocity | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 409 | Death's Drums | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 410 | Gravel Guts | 6 | Class | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 411 | Morph-Risen | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 412 | Grim Insight | 1 | Ancestry | — | passive-rules | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 413 | Brain Drain | 8 | Class | psychic | save | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 414 | Occult Resistance | 9 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 415 | Tangle-Tongue's Wit | 1 | Ancestry | — | save-bonus | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect |  |
| 416 | Ursine Avenger Form | 2 | Class | — | effect | +0.00 ± 0.00 | +0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 417 | Vengeful Remnant | 14 | Class | — | effect | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 418 | Cry of Rebellion | 16 | Class | — | save | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 419 | Double Slice | 1 | Class | fighter | 2 Strikes | −0.00 ± 0.00 | −0.00 | +0.00 | 1.1 | no clear effect | with two weapons (longsword and shortsword) |
| 420 | Metallic Skin | 17 | Ancestry | — | PF2e's self Effect | −0.00 ± 0.02 | +0.01 | −0.01 | 0.3 | no clear effect |  |
| 421 | Freeze It! | 9 | Ancestry | — | check | −0.00 ± 0.02 | −0.00 | −0.00 | 0.2 | no clear effect |  |
| 422 | Triangle Shot | 18 | Class | monk | 3 Strikes | −0.00 ± 0.01 | +0.00 | −0.00 | 0.1 | no clear effect | with a bow in hand |
| 423 | Conjure Hell | 12 | Class | — | save | −0.00 ± 0.04 | +0.02 | −0.02 | 0.9 | no clear effect |  |
| 424 | Called Shot | 10 | Class | gunslinger | Strike activity | −0.00 ± 0.00 | −0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 425 | Lantern Strobe | 0 | Action | — | save | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 426 | Engine of Destruction | 18 | Class | inventor | Strike activity | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 427 | Draconic Resilience | 4 | Class | — | effect | −0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 428 | Godspeed | 4 | Class | — | PF2e's self Effect | −0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 429 | Twin Parry | 4 | Class | fighter | effect | −0.00 ± 0.01 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 430 | Vessel's Form | 16 | Class | — | check | −0.00 ± 0.01 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 431 | Rallying Charge (Marshal) | 6 | Class | — | Strike activity | −0.00 ± 0.01 | +0.00 | −0.01 | 1.7 | no clear effect |  |
| 432 | Tenacious Stance | 0 | Action | — | check | −0.00 ± 0.00 | −0.00 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 433 | Primadonna | 12 | Class | — | check | −0.00 ± 0.00 | +0.00 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 434 | Flower Street Infamy | 11 | Skill | — | check | −0.00 ± 0.02 | −0.00 | +0.00 | 0.7 | no clear effect |  |
| 435 | Part the Veil | 0 | Action | — | check | −0.00 ± 0.03 | +0.02 | −0.03 | 0.5 | no clear effect |  |
| 436 | Titan Swing | 2 | Class | — | Strike activity | −0.00 ± 0.03 | +0.04 | −0.05 | 3.2 | no clear effect |  |
| 437 | Steam Knight | 6 | Class | kineticist | PF2e's stance Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 438 | Unstable Gearshift | 6 | Class | — | self effect | −0.00 ± 0.00 | −0.01 | +0.00 | 2.5 | no clear effect |  |
| 439 | Starlit Transformation | 0 | Action | — | PF2e's self Effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 440 | Blood Shield | 4 | Class | — | self effect | −0.00 ± 0.00 | −0.01 | −0.00 | 0.1 | no clear effect |  |
| 441 | Emotional Surge | 10 | Class | psychic | effect | −0.00 ± 0.01 | −0.01 | −0.00 | 0.8 | no clear effect |  |
| 442 | Dueling Parry | 2 | Class | fighter | effect | −0.00 ± 0.01 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 443 | Ectoplasmic Aura | 18 | Class | — | PF2e's self Effect | −0.00 ± 0.00 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 444 | Vicious Swing | 1 | Class | fighter | Strike activity | −0.00 ± 0.02 | −0.01 | +0.00 | 2.3 | no clear effect |  |
| 445 | Memory of Nothing | 18 | Class | — | save | −0.00 ± 0.03 | −0.03 | +0.02 | 1.8 | no clear effect |  |
| 446 | Propulsive Leap | 10 | Class | — | save | −0.00 ± 0.02 | −0.01 | +0.00 | 2.1 | no clear effect |  |
| 447 | Kraken's Call | 17 | Ancestry | — | save | −0.00 ± 0.01 | −0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 448 | Decompose | 0 | Action | — | save | −0.00 ± 0.01 | +0.01 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 449 | Form a Flock | 13 | Ancestry | — | effect | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 450 | Siphon Life | 10 | Class | — | Strike activity | −0.00 ± 0.03 | −0.02 | +0.01 | 1.8 | no clear effect |  |
| 451 | Peony's Flourish | 14 | Class | — | check | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 452 | Pit of Snakes | 13 | Ancestry | — | save | −0.00 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 453 | Constant Gaze | 9 | Ancestry | — | passive-rules | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect |  |
| 454 | Drowning Mist | 12 | Class | kineticist | save | −0.01 ± 0.00 | −0.01 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 455 | Crowned in Tempest's Fury | 18 | Class | kineticist | PF2e's stance Effect | −0.01 ± 0.01 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 456 | Feathered Flechettes | 6 | Class | — | save | −0.01 ± 0.01 | −0.01 | −0.00 | 0.1 | no clear effect |  |
| 457 | Begin Stampede | 17 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 458 | Split Spellstrike | 10 | Class | magus | 2 Strikes | −0.01 ± 0.01 | +0.00 | −0.01 | 3.3 | no clear effect | with two weapons (longsword and shortsword) |
| 459 | Scattering Shout | 14 | Class | — | save | −0.01 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 460 | Lava Leap | 4 | Class | kineticist | PF2e's self Effect | −0.01 ± 0.01 | −0.01 | +0.00 | 0.1 | no clear effect |  |
| 461 | Cobra Stance | 4 | Class | monk | stance | −0.01 ± 0.00 | −0.01 | −0.00 | 0.0 | no clear effect | the AI never used it |
| 462 | Channel Divine Spark | 14 | Class | — | check | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 463 | Stay Down! | 14 | Class | rogue | check | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 464 | Absolve Sins | 16 | Class | — | save | −0.01 ± 0.01 | +0.01 | −0.02 | 0.2 | no clear effect |  |
| 465 | Weft and Warp | 16 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.01 | 0.0 | no clear effect | the AI never used it |
| 466 | Coordinated Charge | 12 | Class | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 2.0 | no clear effect |  |
| 467 | Looming Gait | 5 | Ancestry | — | Strike activity | −0.01 ± 0.01 | +0.00 | −0.02 | 1.2 | no clear effect |  |
| 468 | Raise Slabs | 0 | Action | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 469 | Courageous Onslaught | 16 | Class | bard | Strike activity | −0.01 ± 0.02 | −0.01 | −0.01 | 0.3 | no clear effect |  |
| 470 | Dragonet Breath | 1 | Ancestry | — | save | −0.01 ± 0.01 | +0.01 | −0.03 | 0.1 | no clear effect |  |
| 471 | Starlight Armor | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.01 | +0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 472 | Tectonic Stomp | 10 | Class | — | save | −0.01 ± 0.01 | −0.00 | −0.02 | 0.3 | no clear effect |  |
| 473 | Crimson Shroud | 6 | Class | — | effect | −0.01 ± 0.02 | −0.01 | −0.01 | 0.5 | no clear effect |  |
| 474 | Hunter's Aim | 2 | Class | ranger | Strike activity | −0.01 ± 0.01 | +0.02 | −0.04 | 0.3 | no clear effect |  |
| 475 | Unleash the Blight | 10 | Class | — | save | −0.01 ± 0.01 | −0.00 | −0.02 | 0.0 | no clear effect | the AI never used it |
| 476 | Flash of Omnipresence | 14 | Class | — | save | −0.01 ± 0.02 | −0.02 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 477 | Shield the Faithful | 14 | Class | — | PF2e's self Effect | −0.01 ± 0.02 | −0.04 | +0.01 | 0.0 | no clear effect | the AI never used it |
| 478 | Enchanting Shot | 8 | Class | — | Strike activity | −0.01 ± 0.03 | −0.06 | +0.04 | 1.7 | no clear effect |  |
| 479 | Reveal Machinations | 15 | Skill | — | check | −0.01 ± 0.01 | −0.03 | +0.00 | 0.1 | no clear effect |  |
| 480 | Draconic Fury | 4 | Class | — | save | −0.01 ± 0.02 | −0.04 | +0.01 | 0.3 | no clear effect |  |
| 481 | Archer's Aim | 8 | Class | — | Strike activity | −0.01 ± 0.02 | −0.02 | −0.01 | 0.7 | no clear effect |  |
| 482 | Acknowledge Fan | 12 | Class | — | save | −0.01 ± 0.04 | −0.06 | +0.03 | 0.8 | no clear effect |  |
| 483 | Debilitating Shot | 10 | Class | fighter | Strike activity | −0.01 ± 0.04 | +0.00 | −0.03 | 1.0 | no clear effect |  |
| 484 | Armored Courage | 4 | Class | guardian | effect | −0.01 ± 0.02 | −0.03 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 485 | Mind Shards | 6 | Class | — | save | −0.01 ± 0.02 | −0.01 | −0.02 | 0.3 | no clear effect |  |
| 486 | Wild Dance | 12 | Class | — | save | −0.01 ± 0.01 | −0.03 | +0.00 | 0.1 | no clear effect |  |
| 487 | To Me! | 18 | Class | — | Strike activity | −0.02 ± 0.01 | +0.00 | −0.03 | 1.9 | no clear effect |  |
| 488 | Flinging Charge | 10 | Class | fighter | Strike activity | −0.02 ± 0.01 | −0.00 | −0.03 | 0.0 | no clear effect | the AI never used it |
| 489 | Assume Earth's Mantle | 14 | Class | kineticist | effect | −0.02 ± 0.02 | −0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 490 | Putrefaction | 14 | Class | — | save | −0.02 ± 0.02 | −0.04 | +0.00 | 0.0 | no clear effect | the AI never used it |
| 491 | Apocalyptic Visions | 18 | Class | — | save | −0.02 ± 0.02 | −0.07 | +0.04 | 0.0 | no clear effect | the AI never used it |
| 492 | Stand Back, I'm A Doctor! | 12 | Class | — | save | −0.02 ± 0.01 | −0.00 | −0.04 | 0.2 | no clear effect |  |
| 493 | Kneel Before the Rightful Heir | 16 | Class | — | save | −0.02 ± 0.03 | −0.02 | −0.03 | 1.0 | no clear effect |  |
| 494 | Burning Demand | 12 | Class | kineticist | save | −0.02 ± 0.01 | −0.01 | −0.04 | 0.2 | no clear effect |  |
| 495 | Olethros's Decree | 17 | Ancestry | — | save | −0.02 ± 0.05 | +0.05 | −0.10 | 1.0 | no clear effect |  |
| 496 | Breath of Hungry Death | 16 | Class | — | save | −0.02 ± 0.03 | +0.00 | −0.05 | 0.5 | no clear effect |  |
| 497 | Flinging Blow | 16 | Class | monk | Strike activity | −0.02 ± 0.02 | −0.01 | −0.04 | 0.7 | no clear effect |  |
| 498 | Roar Mimicry | 12 | Class | — | save | −0.02 ± 0.02 | −0.03 | −0.02 | 0.3 | no clear effect |  |
| 499 | Intimidating Strike | 2 | Class | barbarian | Strike activity | −0.02 ± 0.01 | +0.01 | −0.06 | 0.4 | no clear effect |  |
| 500 | Death Drone | 0 | Action | — | save | −0.02 ± 0.02 | +0.03 | −0.08 | 0.8 | no clear effect |  |
| 501 | Kishin Rage | 17 | Ancestry | — | PF2e's self Effect | −0.03 ± 0.03 | +0.01 | −0.07 | 0.8 | no clear effect |  |
| 502 | Dueling Dance (Swashbuckler) | 10 | Class | swashbuckler | effect | −0.03 ± 0.04 | −0.03 | −0.03 | 0.9 | no clear effect |  |
| 503 | Rebirth in Living Stone | 18 | Class | kineticist | effect | −0.03 ± 0.06 | −0.02 | −0.04 | 2.0 | no clear effect |  |
| 504 | Storming Breath | 6 | Class | — | save | −0.03 ± 0.02 | −0.04 | −0.02 | 0.3 | no clear effect |  |
| 505 | Promise of Pain | 10 | Class | — | save | −0.03 ± 0.05 | −0.06 | −0.00 | 1.0 | no clear effect |  |
| 506 | Thunder Clap | 6 | Class | — | save | −0.04 ± 0.02 | −0.07 | −0.01 | 0.3 | no clear effect |  |
| 507 | Turn to Mist | 10 | Class | — | PF2e's self Effect | −0.04 ± 0.02 | −0.00 | −0.08 | 0.7 | no clear effect |  |
| 508 | Crimson Breath | 12 | Class | — | save | −0.04 ± 0.04 | −0.04 | −0.04 | 1.0 | no clear effect |  |
| 509 | Vicious Evisceration | 18 | Class | barbarian | Strike activity | −0.05 ± 0.03 | −0.06 | −0.04 | 1.0 | no clear effect |  |
| 510 | Benefactor's Majesty | 17 | Ancestry | — | PF2e's self Effect | −0.05 ± 0.02 | +0.02 | −0.12 | 0.6 | hurts |  |
| 511 | Worm's Feast | 6 | Class | — | save | −0.05 ± 0.04 | +0.03 | −0.14 | 1.0 | no clear effect |  |
| 512 | Twinned Defense (Swashbuckler) | 14 | Class | swashbuckler | effect | −0.06 ± 0.06 | −0.03 | −0.08 | 1.0 | no clear effect |  |
| 513 | Demolish Defenses | 18 | Class | guardian | Strike activity | −0.06 ± 0.05 | −0.12 | +0.01 | 2.3 | no clear effect |  |
| 514 | Divine Invulnerability | 14 | Class | — | PF2e's self Effect | −0.07 ± 0.04 | −0.03 | −0.10 | 0.9 | no clear effect |  |
| 515 | Repair Module | 9 | Ancestry | — | effect | −0.07 ± 0.03 | −0.04 | −0.10 | 1.0 | hurts |  |
| 516 | Twin Takedown | 1 | Class | ranger | 2 Strikes | −0.07 ± 0.03 | −0.06 | −0.09 | 1.6 | hurts | with two weapons (longsword and shortsword) |
| 517 | Tidal Shield | 17 | Ancestry | — | effect | −0.07 ± 0.05 | −0.16 | +0.01 | 2.0 | no clear effect |  |
| 518 | Weakening Assault | 12 | Class | guardian | Strike activity | −0.08 ± 0.04 | −0.02 | −0.13 | 0.6 | no clear effect |  |
| 519 | Paralyzing Slash | 8 | Class | — | Strike activity | −0.08 ± 0.04 | −0.06 | −0.10 | 6.7 | no clear effect |  |
| 520 | Earth to Heavens Strike | 14 | Class | — | Strike activity | −0.08 ± 0.06 | −0.14 | −0.02 | 2.3 | no clear effect |  |
| 521 | Impaling Thrust | 14 | Class | barbarian | Strike activity | −0.09 ± 0.06 | −0.03 | −0.16 | 3.8 | no clear effect |  |
| 522 | Whirlwind Stance | 10 | Class | — | effect | −0.11 ± 0.05 | −0.08 | −0.14 | 2.0 | hurts |  |
| 523 | Twinned Defense (Fighter) | 16 | Class | fighter | effect | −0.12 ± 0.06 | −0.12 | −0.12 | 1.0 | hurts |  |
| 524 | Debilitating Dichotomy | 8 | Class | oracle | save | −0.12 ± 0.04 | −0.25 | +0.00 | 1.2 | hurts |  |
| 525 | Dueling Dance (Fighter) | 12 | Class | fighter | effect | −0.12 ± 0.06 | −0.10 | −0.15 | 1.0 | hurts |  |

## Not simulated, by reason

| Reason | Count |
|---|---:|
| the feat module reads nothing for it | 5304 |
| a timer with no rules a fight counts | 263 |
| its requirement | 203 |
| a Strike with nothing more the simulator reads | 130 |
| a teleport | 66 |
| an Effect with nothing a fight counts | 66 |
| its requirement, which the PC doesn't meet | 59 |
| nothing a fight uses | 55 |
| a reaction's Strike | 52 |
| a spell the feat casts | 35 |
| its text has no Strike of its user's | 29 |
| a roll whose results the simulator doesn't read | 29 |
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
