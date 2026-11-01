# Deviant abilities in combat

Made by `node tools/feat-power.mjs <out> deviant` on 2026-11-01. Each deviant feat on the standard party's fighter (deviation DC: the higher of its class and spell DCs), at the feat's level, against a moderate boss and a moderate group, 200 fights each, with the feat and without it on the same dice. Every use rolls the flat check (DC 5, +5 per success to 20); a failure brings the classification's backlash, mild then moderate then severe, and after severe no more deviations that fight.

Ratings are in levels of the foes (+0.25: like fighting foes a quarter of a level lower). **Backlash cost** is the rating without backlash less the rating with it.

## Ranked

| # | Ability | Lvl | Played as | Rating | Boss | Group | Backlash cost | Uses a fight | Backlashes a fight | Verdict |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Feed the Void | 10 | deviant ability | +0.08 ± 0.03 | +0.02 | +0.15 | −0.01 | 0.8 | 0.04 | minor |
| 2 | Tectonic Stomp | 10 | deviant ability | +0.05 ± 0.02 | +0.00 | +0.11 | +0.01 | 0.8 | 0.00 | minor |
| 3 | Lightspeed Assault | 10 | deviant Strike | +0.05 ± 0.05 | −0.16 | +0.26 | +0.05 | 2.8 | 0.33 | no clear effect |
| 4 | Defensive Growth | 6 | deviant reaction | +0.04 ± 0.02 | +0.09 | −0.01 | +0.01 | 1.1 | 0.25 | no clear effect |
| 5 | Unleash the Blight | 10 | deviant ability | +0.02 ± 0.01 | +0.00 | +0.03 | −0.00 | 0.6 | 0.04 | no clear effect |
| 6 | Eerie Flicker | 2 | deviant reaction | +0.01 ± 0.03 | −0.01 | +0.02 | +0.00 | 0.8 | 0.13 | no clear effect |
| 7 | Draining Touch | 2 | deviant Strike | +0.00 ± 0.00 | +0.00 | +0.00 | +0.00 | 0.0 | 0.00 | no clear effect |
| 8 | Enervating Wail | 6 | deviant ability | +0.00 ± 0.00 | −0.00 | +0.00 | +0.00 | 0.1 | 0.00 | no clear effect |
| 9 | Irradiate | 6 | deviant ability | +0.00 ± 0.00 | +0.00 | +0.00 | +0.00 | 0.0 | 0.00 | no clear effect |
| 10 | High-Speed Regeneration | 6 | deviant regeneration | −0.00 ± 0.02 | +0.01 | −0.01 | +0.00 | 0.7 | 0.25 | no clear effect |
| 11 | Rotten Slurry | 2 | deviant ability | −0.01 ± 0.01 | +0.01 | −0.02 | −0.01 | 0.2 | 0.00 | no clear effect |
| 12 | Unstable Gearshift | 6 | deviant effect | −0.02 ± 0.04 | −0.04 | −0.01 | +0.04 | 1.0 | 0.13 | no clear effect |
| 13 | Vine Lash (one-handed weapon, free hand) | 2 | deviant ability | −0.03 ± 0.02 | +0.01 | −0.06 | −0.02 | 0.0 | 0.00 | no clear effect |
| 14 | Blasting Beams (one-handed weapon, free hand) | 2 | deviant ability | −0.04 ± 0.02 | +0.01 | −0.09 | −0.00 | 0.0 | 0.00 | no clear effect |
| 15 | Overclock Senses | 2 | deviant effect | −0.05 ± 0.01 | −0.09 | −0.00 | −0.06 | 0.0 | 0.00 | no clear effect |
| 16 | Storming Breath | 6 | deviant ability | −0.05 ± 0.03 | −0.01 | −0.10 | +0.02 | 1.0 | 0.13 | no clear effect |
| 17 | Titan Swing | 2 | deviant Strike | −0.06 ± 0.03 | −0.11 | +0.00 | +0.02 | 1.5 | 0.25 | hurts |
| 18 | Kinetic Dampening | 6 | deviant effect | −0.06 ± 0.02 | −0.12 | +0.00 | −0.01 | 0.1 | 0.00 | hurts |

## Awakenings

Each awakening alone, at the level Awakened Power (4th) or Greater Awakened Power (10th) gives it, against the plain feat at that level.

| # | Ability | Awakening | Lvl | Gain over plain | Uses a fight | Backlashes a fight | Verdict |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | Draining Touch | clumsy | 4 | +0.01 ± 0.01 | 0.4 | 0.00 | no clear effect |
| 2 | Blasting Beams | agile | 4 | +0.01 ± 0.01 | 0.0 | 0.00 | no clear effect |
| 3 | Vine Lash | cone | 4 | +0.01 ± 0.03 | 0.6 | 0.17 | no clear effect |
| 4 | Irradiate | poison | 10 | +0.01 ± 0.01 | 0.2 | 0.00 | no clear effect |
| 5 | Sonic Dash | sonic-boom | 4 | +0.00 ± 0.00 | 0.1 | 0.04 | no clear effect |
| 6 | Eerie Flicker | terrify | 4 | +0.00 ± 0.01 | 0.8 | 0.08 | no clear effect |
| 7 | Tectonic Stomp | stun | 10 | +0.00 ± 0.01 | 0.8 | 0.00 | no clear effect |
| 8 | Ghostly Grasp (Deviant) | grab | 4 | +0.00 ± 0.00 | 0.0 | 0.00 | no clear effect |
| 9 | Kinetic Dampening | wavelength-expansion | 10 | +0.00 ± 0.00 | 0.4 | 0.04 | no clear effect |
| 10 | Titan Swing | prone | 4 | −0.00 ± 0.00 | 1.0 | 0.08 | no clear effect |
| 11 | Enervating Wail | silent | 10 | −0.00 ± 0.00 | 0.3 | 0.00 | no clear effect |
| 12 | Enervating Wail | enfeebling | 10 | −0.00 ± 0.00 | 0.3 | 0.00 | no clear effect |
| 13 | Rotten Slurry | splash | 4 | −0.00 ± 0.01 | 0.3 | 0.00 | no clear effect |
| 14 | Storming Breath | prone | 10 | −0.00 ± 0.01 | 1.8 | 0.38 | no clear effect |
| 15 | Irradiate | radius-increase | 10 | −0.01 ± 0.01 | 0.0 | 0.00 | no clear effect |
| 16 | Unleash the Blight | debilitating | 10 | −0.01 ± 0.01 | 0.8 | 0.04 | no clear effect |
| 17 | Rotten Slurry | persistent | 4 | −0.02 ± 0.01 | 0.5 | 0.13 | no clear effect |
| 18 | Unleash the Blight | infectious | 10 | −0.02 ± 0.01 | 0.8 | 0.00 | no clear effect |
| 19 | Eerie Flicker | compress | 4 | −0.02 ± 0.02 | 1.0 | 0.25 | no clear effect |
| 20 | Vine Lash | constrict | 4 | −0.02 ± 0.01 | 0.2 | 0.04 | no clear effect |
| 21 | Blasting Beams | line | 4 | −0.04 ± 0.03 | 0.8 | 0.13 | no clear effect |
| 22 | Titan Swing | bleed | 4 | −0.11 ± 0.04 | 2.1 | 0.46 | hurts |

## Not played

| Ability | Variant | Why |
|---|---|---|
| Consume Energy | plain | a reaction that counteracts a foe's energy ability |
| Consume Energy | awakening: range | a reaction that counteracts a foe's energy ability |
| Consume Energy | awakening: strikes | a reaction that counteracts a foe's energy ability |
| Tectonic Stomp | awakening: stone | the awakening only does what a fight here doesn't play |
| Ghostly Grasp (Deviant) | plain | fetching an object (its grab awakening is played) |
| Ghostly Grasp (Deviant) | awakening: push | fetching an object (its grab awakening is played) |
| Storming Breath | awakening: escape | the awakening only does what a fight here doesn't play |
| Feed the Void | awakening: feed-on-spirit | the awakening only does what a fight here doesn't play |
| Feed the Void | awakening: feed-on-heat | the awakening only does what a fight here doesn't play |
| Sonic Dash | plain | two Strides for one action (its sonic boom awakening is played) |
| Sonic Dash | awakening: slipstream | two Strides for one action (its sonic boom awakening is played) |
| Sprout Fruit | plain | a fruit an ally spends 3 actions to eat |
| Sprout Fruit | awakening: plentiful | a fruit an ally spends 3 actions to eat |
| Sprout Fruit | awakening: potent | a fruit an ally spends 3 actions to eat |
| Distant Wandering | plain | scouting in spirit form |
| Distant Wandering | awakening: fly | scouting in spirit form |
| Distant Wandering | awakening: quick | scouting in spirit form |
| Release Spores | plain | a lasting cloud of spores |
| Release Spores | awakening: sickening | a lasting cloud of spores |
| Release Spores | awakening: toxic | a lasting cloud of spores |
| Lightspeed Assault | awakening: teleport | the awakening only does what a fight here doesn't play |
| Lightspeed Assault | awakening: flanking-assault | the awakening only does what a fight here doesn't play |
| Bone Spikes | plain | a 1d6 unarmed Strike, below the PCs' own weapons |
| Bone Spikes | awakening: reach | a 1d6 unarmed Strike, below the PCs' own weapons |
| Bone Spikes | awakening: poison | a 1d6 unarmed Strike, below the PCs' own weapons |
| Draining Touch | awakening: drain-spirit | the awakening only does what a fight here doesn't play |
| Defensive Growth | awakening: stronger-shield | the awakening only does what a fight here doesn't play |
| Defensive Growth | awakening: exploding-shield | the awakening only does what a fight here doesn't play |
| Propulsive Leap | plain | a fly Speed, which the fights here don't need |
| Propulsive Leap | awakening: speed | a fly Speed, which the fights here don't need |
| Propulsive Leap | awakening: weapon | a fly Speed, which the fights here don't need |
| Borrowed Ability | plain | borrowing a skill |
| Borrowed Ability | awakening: borrow-defense | borrowing a skill |
| Borrowed Ability | awakening: lingering-link | borrowing a skill |
| Disperse Into Petals | plain | a form that can't attack |
| Disperse Into Petals | awakening: extended-flight | a form that can't attack |
| Disperse Into Petals | awakening: blossom-vortex | a form that can't attack |
| High-Speed Regeneration | awakening: recovery | the awakening only does what a fight here doesn't play |
| High-Speed Regeneration | awakening: speed | the awakening only does what a fight here doesn't play |
| Unstable Gearshift | awakening: blur | the awakening only does what a fight here doesn't play |
| Kinetic Dampening | awakening: safe-haven | the awakening only does what a fight here doesn't play |
| Overclock Senses | awakening: focus | the awakening only does what a fight here doesn't play |
| Unstable Gearshift | awakening: phase-out | the awakening only does what a fight here doesn't play |
| Overclock Senses | awakening: react | the awakening only does what a fight here doesn't play |
