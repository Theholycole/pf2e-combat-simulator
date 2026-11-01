# Deviant abilities in combat

Made by `node tools/feat-power.mjs <out> deviant` on 2026-11-01. Each deviant feat on the standard party's fighter (deviation DC: the higher of its class and spell DCs), at the feat's level, against a moderate boss and a moderate group, 200 fights each played as 50 adventuring days of 4 fights in a row, with the feat and without it on the same dice. Every use rolls the flat check (DC 5, +5 per success to 20); a failure brings the classification's backlash, mild then moderate then severe, and after severe no more deviations that day. The deviation carries from fight to fight within a day (its DC, its backlash stage, spent or not, and whatever backlash lasts beyond a fight); Hit Points are full at each fight's start, as after a rest, and frightened ticks down as usual.

**Danger score** of a fight: the share of the party's total Hit Points the foes took off, +0.25 for every PC knocked out, +1 for every PC killed, +1 more if the party is wiped out (0 is a flawless win; about 0.3 to 0.5 is a typical moderate fight). **Rating**: the average drop in danger score a fight that the feat brings, against the same party without it on the same dice, divided by how much the danger score rises when the foes are one level higher.

Ratings are in levels of the foes (+0.25: like fighting foes a quarter of a level lower). **Backlash cost** is the rating without backlash less the rating with it.

## Ranked

| # | Ability | Lvl | Played as | Rating | Boss | Group | Danger with | Danger without | Backlash cost | Uses a fight | Backlashes a fight | Severe a fight | Verdict |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | Unstable Gearshift | 6 | deviant effect | +0.02 ± 0.02 | +0.03 | +0.02 | 0.454 | 0.461 | +0.04 | 0.3 | 0.06 | 0.00 | no clear effect |
| 2 | High-Speed Regeneration | 6 | deviant regeneration | +0.01 ± 0.01 | +0.01 | +0.00 | 0.459 | 0.461 | −0.01 | 0.3 | 0.08 | 0.00 | no clear effect |
| 3 | Lightspeed Assault | 10 | deviant Strike | +0.01 ± 0.04 | −0.04 | +0.06 | 0.626 | 0.635 | +0.01 | 1.0 | 0.32 | 0.01 | no clear effect |
| 4 | Draining Touch | 2 | deviant Strike | +0.00 ± 0.00 | +0.01 | +0.00 | 0.329 | 0.330 | +0.00 | 0.0 | 0.00 | 0.00 | no clear effect |
| 5 | Unleash the Blight | 10 | deviant ability | +0.00 ± 0.00 | −0.00 | +0.00 | 0.634 | 0.635 | −0.01 | 0.0 | 0.01 | 0.00 | no clear effect |
| 6 | Irradiate | 6 | deviant ability | +0.00 ± 0.00 | +0.00 | +0.00 | 0.461 | 0.461 | +0.00 | 0.0 | 0.00 | 0.00 | no clear effect |
| 7 | Enervating Wail | 6 | deviant ability | −0.00 ± 0.00 | +0.00 | −0.00 | 0.461 | 0.461 | −0.00 | 0.0 | 0.00 | 0.00 | no clear effect |
| 8 | Rotten Slurry | 2 | deviant ability | −0.00 ± 0.01 | −0.00 | −0.00 | 0.331 | 0.330 | +0.01 | 0.2 | 0.03 | 0.00 | no clear effect |
| 9 | Kinetic Dampening | 6 | deviant effect | −0.00 ± 0.00 | −0.00 | −0.00 | 0.462 | 0.461 | −0.00 | 0.0 | 0.01 | 0.00 | no clear effect |
| 10 | Overclock Senses | 2 | deviant effect | −0.00 ± 0.00 | −0.00 | +0.00 | 0.331 | 0.330 | +0.01 | 0.0 | 0.00 | 0.00 | no clear effect |
| 11 | Tectonic Stomp | 10 | deviant ability | −0.00 ± 0.01 | −0.00 | −0.00 | 0.636 | 0.635 | −0.01 | 0.1 | 0.01 | 0.00 | no clear effect |
| 12 | Vine Lash (one-handed weapon, free hand) | 2 | deviant ability | −0.00 ± 0.00 | +0.00 | −0.01 | 0.379 | 0.378 | −0.00 | 0.0 | 0.00 | 0.00 | no clear effect |
| 13 | Defensive Growth | 6 | deviant reaction | −0.01 ± 0.03 | +0.00 | −0.01 | 0.463 | 0.461 | +0.00 | 0.6 | 0.22 | 0.02 | no clear effect |
| 14 | Blasting Beams (one-handed weapon, free hand) | 2 | deviant ability | −0.01 ± 0.00 | +0.00 | −0.01 | 0.379 | 0.378 | +0.00 | 0.0 | 0.00 | 0.00 | no clear effect |
| 15 | Feed the Void | 10 | deviant ability | −0.01 ± 0.01 | −0.00 | −0.02 | 0.641 | 0.635 | −0.00 | 0.2 | 0.04 | 0.00 | no clear effect |
| 16 | Eerie Flicker | 2 | deviant reaction | −0.02 ± 0.03 | −0.04 | +0.01 | 0.339 | 0.330 | +0.03 | 0.8 | 0.17 | 0.01 | no clear effect |
| 17 | Storming Breath | 6 | deviant ability | −0.02 ± 0.02 | −0.01 | −0.02 | 0.467 | 0.461 | −0.00 | 0.5 | 0.09 | 0.00 | no clear effect |
| 18 | Titan Swing | 2 | deviant Strike | −0.03 ± 0.02 | −0.07 | +0.00 | 0.347 | 0.330 | −0.01 | 1.1 | 0.20 | 0.02 | no clear effect |

## Awakenings

Each awakening alone, at the level Awakened Power (4th) or Greater Awakened Power (10th) gives it, against the plain feat at that level.

| # | Ability | Awakening | Lvl | Gain over plain | Uses a fight | Backlashes a fight | Verdict |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | Draining Touch | clumsy | 4 | +0.01 ± 0.01 | 0.3 | 0.06 | no clear effect |
| 2 | Titan Swing | bleed | 4 | +0.00 ± 0.02 | 0.9 | 0.17 | no clear effect |
| 3 | Eerie Flicker | terrify | 4 | +0.00 ± 0.00 | 0.6 | 0.17 | no clear effect |
| 4 | Storming Breath | prone | 10 | +0.00 ± 0.01 | 1.0 | 0.19 | no clear effect |
| 5 | Irradiate | radius-increase | 10 | +0.00 ± 0.00 | 0.0 | 0.00 | no clear effect |
| 6 | Ghostly Grasp (Deviant) | grab | 4 | +0.00 ± 0.00 | 0.0 | 0.00 | no clear effect |
| 7 | Titan Swing | prone | 4 | +0.00 ± 0.00 | 0.6 | 0.10 | no clear effect |
| 8 | Kinetic Dampening | wavelength-expansion | 10 | +0.00 ± 0.00 | 0.1 | 0.01 | no clear effect |
| 9 | Rotten Slurry | splash | 4 | −0.00 ± 0.01 | 0.2 | 0.02 | no clear effect |
| 10 | Irradiate | poison | 10 | −0.00 ± 0.00 | 0.0 | 0.00 | no clear effect |
| 11 | Blasting Beams | agile | 4 | −0.00 ± 0.00 | 0.0 | 0.00 | no clear effect |
| 12 | Rotten Slurry | persistent | 4 | −0.00 ± 0.01 | 0.2 | 0.02 | no clear effect |
| 13 | Tectonic Stomp | stun | 10 | −0.00 ± 0.00 | 0.1 | 0.01 | no clear effect |
| 14 | Sonic Dash | sonic-boom | 4 | −0.00 ± 0.01 | 0.0 | 0.01 | no clear effect |
| 15 | Unleash the Blight | infectious | 10 | −0.00 ± 0.01 | 0.1 | 0.01 | no clear effect |
| 16 | Enervating Wail | enfeebling | 10 | −0.00 ± 0.00 | 0.1 | 0.01 | no clear effect |
| 17 | Vine Lash | constrict | 4 | −0.00 ± 0.01 | 0.2 | 0.03 | no clear effect |
| 18 | Enervating Wail | silent | 10 | −0.01 ± 0.01 | 0.1 | 0.01 | no clear effect |
| 19 | Unleash the Blight | debilitating | 10 | −0.01 ± 0.01 | 0.1 | 0.01 | no clear effect |
| 20 | Blasting Beams | line | 4 | −0.03 ± 0.02 | 0.4 | 0.07 | no clear effect |
| 21 | Vine Lash | cone | 4 | −0.03 ± 0.02 | 0.3 | 0.08 | no clear effect |
| 22 | Eerie Flicker | compress | 4 | −0.04 ± 0.02 | 0.7 | 0.20 | no clear effect |

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
| Unstable Gearshift | awakening: blur | the awakening only does what a fight here doesn't play |
| Unstable Gearshift | awakening: phase-out | the awakening only does what a fight here doesn't play |
| Draining Touch | awakening: drain-spirit | the awakening only does what a fight here doesn't play |
| Defensive Growth | awakening: stronger-shield | the awakening only does what a fight here doesn't play |
| Defensive Growth | awakening: exploding-shield | the awakening only does what a fight here doesn't play |
| Propulsive Leap | plain | a fly Speed, which the fights here don't need |
| Propulsive Leap | awakening: speed | a fly Speed, which the fights here don't need |
| Propulsive Leap | awakening: weapon | a fly Speed, which the fights here don't need |
| Kinetic Dampening | awakening: safe-haven | the awakening only does what a fight here doesn't play |
| Borrowed Ability | plain | borrowing a skill |
| Borrowed Ability | awakening: borrow-defense | borrowing a skill |
| Borrowed Ability | awakening: lingering-link | borrowing a skill |
| Disperse Into Petals | plain | a form that can't attack |
| Disperse Into Petals | awakening: extended-flight | a form that can't attack |
| Disperse Into Petals | awakening: blossom-vortex | a form that can't attack |
| Overclock Senses | awakening: focus | the awakening only does what a fight here doesn't play |
| Overclock Senses | awakening: react | the awakening only does what a fight here doesn't play |
| High-Speed Regeneration | awakening: recovery | the awakening only does what a fight here doesn't play |
| High-Speed Regeneration | awakening: speed | the awakening only does what a fight here doesn't play |
