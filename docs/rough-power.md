# Rough power score

Generated 2026-11-13 by tools/rough-power.mjs from the simulator's ratings in src/data/feat-ratings.json and docs/ancestry-ratings.json (feat ratings: whole fights, with vs without, 2026-11-11).

Each feat, action, heritage and background is read into building blocks from its own text and rules: damage weighted by the four degrees of success and by targets, healing, conditions by kind and value, bonuses and penalties, resistances, spells it grants, action cost, uses a fight, drawbacks. The reading is the same whether the simulator played it or not. Amounts are in each level's own units (damage over a moderate creature's Strike damage at that level, healing over its Hit Points), so one value holds at every level.

Two fits give each block a value in levels (a ridge regression of the simulator's ratings on the blocks, each block counted as log(1 + amount)). **Activities** (actions, reactions, free actions): the value of one use — the rating over the times the simulator used it in a fight —, then × the uses a fight: the average the simulator gave tested activities with the same allowance (1.6 for once a minute or rarer, 2.3 for a reaction, 4.0 for no frequency). **Passives**, heritages and backgrounds: the whole-fight rating. Ancestries get a small fit of their own. A rating the simulator's AI used the activity in less than 0.5 times a fight is left out of the fit (it says little of its value per use) and scored like the untested.

Every check below is out of sample: each tested thing was scored by values fitted without it (10 folds), before its own rating was looked at.

## Does it align with what's been tested?

| Family | Tested | Correlation | Rank correlation | Mean error (levels) | Guessing the average |
|---|---|---|---|---|---|
| Activities, per use | 1066 | 0.20 | 0.34 | 0.048 | 0.051 |
| Activities, whole fight (per use × the simulator's uses) | 1066 | 0.39 | 0.45 | 0.112 | — |
| Passives, heritages, backgrounds | 1329 | 0.31 | 0.29 | 0.063 | 0.070 |
| Ancestries | 51 | 0.71 | 0.68 | 0.004 | 0.006 |
| Spells (one cast; the same blocks, own fit, a cross-check) | 814 | 0.36 | 0.30 | 0.042 | 0.048 |

By family (whole fight, out of sample):

| Family | Tested | Correlation | Mean error |
|---|---|---|---|
| activity: class feat | 801 | 0.37 | 0.121 |
| class feat | 722 | 0.57 | 0.067 |
| ancestry feat | 397 | 0.58 | 0.066 |
| activity: ancestry feat | 144 | 0.67 | 0.071 |
| heritage | 104 | 0.20 | 0.013 |
| activity: action | 102 | 0.53 | 0.084 |
| background | 92 | 0.05 | 0.010 |
| activity: skill feat | 15 | -0.61 | 0.188 |
| general feat | 7 | 0.59 | 0.032 |
| skill feat | 5 | 0.00 | 0.029 |

Bands, whole fight (rows: the simulator's; columns: the rough score's, out of sample):

| Simulator \ Rough | strong (≥ 0.15) | useful (0.05–0.15) | about nothing (±0.05) | harmful (≤ −0.05) |
|---|---|---|---|---|
| strong (≥ 0.15) | 6 | 37 | 54 | 28 |
| useful (0.05–0.15) | 7 | 72 | 128 | 62 |
| about nothing (±0.05) | 11 | 91 | 968 | 228 |
| harmful (≤ −0.05) | 8 | 19 | 214 | 462 |

Same band: 1508 of 2395 (63%). Two or more bands off: 182.

## The building blocks' values

### Activities, one use

Base (intercept): -0.005. λ = 300. Amounts here are for one use ("× uses" in a label is 1).

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| temporary HP (× moderate HP × 3) |  0.104 | 27 |
| spell it grants (its one-cast rating) |  0.074 | 41 |
| Speed bonus (per 10 ft) |  0.063 | 13 |
| quickened on you or allies |  0.036 | 17 |
| PF2e rule: extra damage dice |  0.036 | 35 |
| single-target save damage (× moderate damage, basic save 0.8) |  0.035 | 24 |
| AC bonus (per +1) |  0.029 | 66 |
| a reaction |  0.029 | 117 |
| area damage (× moderate damage × 2 targets × uses) |  0.028 | 80 |
| skill-check bonus |  0.025 | 23 |
| cat_skill |  0.023 | 15 |
| cat_interaction |  0.019 | 13 |
| has a trigger |  0.019 | 154 |
| stance |  0.019 | 62 |
| Strikes made (× uses) |  0.016 | 428 |
| grants an item |  0.016 | 14 |
| PF2e rule: attack |  0.013 | 23 |
| flourish |  0.013 | 108 |
| condition on yourself (drawback) |  0.011 | 31 |
| has a requirement |  0.011 | 345 |
| level/20 |  0.010 | 1066 |
| cat_offensive |  0.008 | 77 |
| exploration/downtime/knowledge |  0.008 | 8 |
| companion/summon |  0.005 | 35 |
| cat_defensive |  0.004 | 9 |
| archetype |  0.003 | 298 |
| foe Speed penalty |  0.003 | 15 |
| reroll/fortune |  0.002 | 25 |
| press |  0.002 | 22 |
| uses a fight |  0.000 | 1066 |
| other damage (degree-weighted) | -0.000 | 66 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) | -0.000 | 125 |
| persistent damage (× 2 rounds) | -0.001 | 38 |
| cat_ancestry | -0.002 | 144 |
| cat_class | -0.002 | 801 |
| limited (once a minute or less) | -0.003 | 254 |
| incapacitation | -0.003 | 23 |
| a free action | -0.004 | 51 |
| PF2e rule: skills | -0.008 | 10 |
| PF2e rule: AC | -0.008 | 11 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) | -0.012 | 280 |
| foe save penalty | -0.015 | 11 |
| save bonus (per +1) | -0.016 | 25 |
| movement | -0.018 | 150 |
| attack bonus (per +1) | -0.018 | 26 |
| Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses) | -0.026 | 79 |
| actions spent (× uses) | -0.031 | 898 |
| resistance (× moderate damage) | -0.038 | 30 |
| damage bonus (per +1/4 of moderate damage) | -0.056 | 13 |
| damage you take | -0.089 | 9 |

### Passives, heritages, backgrounds (whole fight)

Base (intercept):  0.001. λ = 100. 

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| PF2e rule: Hit Points |  0.179 | 10 |
| resistance (× moderate damage) |  0.070 | 104 |
| quickened on you or allies |  0.051 | 19 |
| companion/summon |  0.042 | 118 |
| PF2e rule: damage |  0.041 | 15 |
| PF2e rule: Speed |  0.036 | 22 |
| temporary HP (× moderate HP × 3) |  0.032 | 10 |
| AC bonus (per +1) |  0.027 | 14 |
| Perception/initiative bonus |  0.021 | 16 |
| cat_class |  0.020 | 722 |
| senses |  0.015 | 39 |
| movement |  0.015 | 39 |
| Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses) |  0.015 | 12 |
| persistent damage (× 2 rounds) |  0.013 | 17 |
| PF2e rule: saves |  0.011 | 131 |
| skill-check bonus |  0.010 | 20 |
| condition on yourself (drawback) |  0.005 | 15 |
| a new Strike (unarmed attack) |  0.005 | 79 |
| other damage (degree-weighted) |  0.005 | 90 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) |  0.004 | 86 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) |  0.002 | 37 |
| PF2e rule: Perception |  0.001 | 22 |
| passive |  0.000 | 1329 |
| damage bonus (per +1/4 of moderate damage) | -0.002 | 10 |
| save bonus (per +1) | -0.004 | 126 |
| cat_background | -0.004 | 92 |
| cat_heritage | -0.008 | 104 |
| cat_ancestry | -0.019 | 397 |
| archetype | -0.019 | 393 |
| grants an item | -0.020 | 181 |
| reroll/fortune | -0.024 | 8 |
| PF2e rule: skills | -0.026 | 23 |
| PF2e rule: AC | -0.026 | 9 |
| level/20 | -0.028 | 1329 |
| exploration/downtime/knowledge | -0.029 | 19 |
| PF2e rule: extra damage dice | -0.051 | 19 |
| spell it grants (its one-cast rating) | -0.200 | 326 |

### Ancestries

| Block | Value |
|---|---|
| base | -0.064 |
| ancestry Hit Points (per 2) |  0.038 |
| Speed (per 5 ft over 25) |  0.008 |
| Small or Tiny |  0.003 |
| Large |  0.007 |
| darkvision |  0.002 |
| low-light vision |  0.002 |
| boosts minus flaws |  0.000 |

### Spells (one cast; the same blocks fitted on their own, to compare)

Base (intercept):  0.186. λ = 100. 

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| level/20 |  0.099 | 814 |
| actions spent (× uses) |  0.031 | 814 |
| spell it grants (its one-cast rating) |  0.027 | 28 |
| attack bonus (per +1) |  0.017 | 13 |
| foe save penalty |  0.015 | 13 |
| limited (once a minute or less) |  0.010 | 117 |
| skill-check bonus |  0.008 | 9 |
| other damage (degree-weighted) |  0.006 | 131 |
| Strikes made (× uses) |  0.006 | 46 |
| save bonus (per +1) |  0.006 | 23 |
| persistent damage (× 2 rounds) |  0.004 | 67 |
| single-target save damage (× moderate damage, basic save 0.8) |  0.002 | 51 |
| cat_spell |  0.000 | 814 |
| uses a fight |  0.000 | 814 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) | -0.002 | 310 |
| Speed bonus (per 10 ft) | -0.004 | 11 |
| incapacitation | -0.005 | 60 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) | -0.005 | 185 |
| AC bonus (per +1) | -0.005 | 18 |
| area damage (× moderate damage × 2 targets × uses) | -0.007 | 210 |
| movement | -0.010 | 56 |
| resistance (× moderate damage) | -0.011 | 31 |
| companion/summon | -0.018 | 36 |
| foe check penalty | -0.024 | 8 |
| Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses) | -0.027 | 55 |
| foe Speed penalty | -0.034 | 29 |
| healing (× moderate HP × 3) | -0.037 | 8 |

## Where it misses most (tested, out of sample)

| Name | Family | Level | Simulator | Rough | Simulator's uses |
|---|---|---|---|---|---|
| Upset Balance | activity, class | 6 | -0.53 |  0.59 | 11.2 |
| Fear of God | activity, skill | 14 | -0.85 |  0.26 | 20.7 |
| Dissolution's Sovereignty | ancestry | 17 | -1.14 | -0.20 | passive |
| Reflect Foe | ancestry | 17 | -1.14 | -0.23 | passive |
| Feign Innocence | activity, class | 12 |  0.22 | -0.58 | 23.8 |
| Dragon Transformation | activity, class | 16 | -0.73 |  0.06 | 1.0 |
| Purifying Breeze | activity, class | 14 | -0.91 | -0.14 | 9.2 |
| Scattering Shout | activity, class | 14 | -0.88 | -0.11 | 5.0 |
| Pin to the Spot | activity, class | 14 |  0.59 | -0.15 | 5.8 |
| Head of the Night Parade | activity, class | 20 | -0.94 | -0.20 | 3.9 |
| Fearsome Familiar | activity, class | 6 | -1.00 | -0.27 | 1.0 |
| Pennant of Victory | activity, class | 20 |  0.73 |  0.00 | 1.0 |
| Paralyzing Slash | activity, class | 8 |  0.51 | -0.19 | 7.9 |
| Anatomical Quartering | activity, class | 16 | -0.75 | -0.08 | 3.0 |
| Magical Onslaught | activity, class | 10 |  0.00 | -0.66 | 15.5 |
| Silencing Strike | activity, class | 10 | -0.98 | -0.33 | 17.9 |
| Eidolon's Trample | activity, class | 16 |  0.00 | -0.64 | 15.0 |
| Impossible Volley | activity, class | 18 | -0.77 | -0.13 | 8.6 |
| One Moment till Glory | activity, action | 1 | -0.74 | -0.10 | 7.0 |
| Sacral Lord | class | 4 | -0.69 | -0.05 | passive |
| Dance of Intercession | activity, class | 20 | -0.65 | -0.04 | 1.6 |
| Whirlwind Toss | activity, class | 18 |  0.24 | -0.37 | 8.3 |
| Monstrosity Shape | class | 16 |  0.59 | -0.01 | passive |
| Thrash | activity, class | 8 | -0.73 | -0.14 | 16.0 |
| Gossamer Blade | activity, class | 4 | -0.63 | -0.05 | 9.8 |
| Silk Bracelet | activity, class | 6 | -0.66 | -0.08 | 4.9 |
| Chastise | activity, class | 16 | -0.92 | -0.35 | 9.9 |
| Stay Down! | activity, class | 14 | -0.34 |  0.22 | 10.6 |
| Storied Companion | activity, class | 2 |  0.00 |  0.56 | 6.6 |
| Words of Unraveling | class | 12 | -0.62 | -0.08 | passive |

## Not yet tested: the rough score

5428 feats, actions, heritages and backgrounds out of the fit (never rated, or rated with the simulator's AI hardly using them), scored by the values above: whole fight, activities at the uses a fight the tested ones with the same frequency got. The full list (every score and block) is in docs/rough-power.json. A score near the base means the text has none of the blocks the fit values — often nothing a fight uses.

### Class feats (2833)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Self Destruct | 12 |  0.32 |  |
| Instant Return | 16 |  0.24 |  0.00 |
| Guardian's Deflection (Fighter) | 6 |  0.22 |  0.02 |
| Advanced Breakthrough | 6 |  0.22 |  |
| Reactive Transformation | 14 |  0.22 |  |
| Pin the Spears in the Lamb | 4 |  0.22 |  |
| Advanced Field Training | 6 |  0.20 |  |
| Rebounding Smite | 16 |  0.20 |  |
| Arc of Destruction | 8 |  0.20 |  0.00 |
| Advanced Hunter's Trick | 6 |  0.20 |  |
| Shield from Arrows | 8 |  0.19 |  0.00 |
| Additional Companion | 4 |  0.19 |  |
| Guardian's Deflection (Swashbuckler) | 4 |  0.19 |  0.03 |
| Advanced Thaumaturgy | 6 |  0.18 |  |
| Standard-Bearer's Sacrifice | 10 |  0.18 |  |
| Induce Imbalance | 14 | -0.32 |  |
| Wake to Strife | 8 | -0.32 |  0.00 |
| Primal Evolution | 4 | -0.33 |  |
| Ostentatious Arrival | 6 | -0.35 |  |
| Dragon Arcana | 4 | -0.42 |  |

### Ancestry feats (1072)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Hop Up | 13 |  0.13 |  0.00 |
| Empathetic Plea | 1 |  0.12 |  0.00 |
| Undead Companion | 5 |  0.11 |  |
| Cantorian Restoration | 17 |  0.11 |  |
| Call to Battle | 5 |  0.11 |  0.00 |
| Collapse | 1 |  0.10 |  0.08 |
| Bold Defiance | 5 |  0.10 |  |
| Rampaging Ferocity | 17 |  0.10 |  0.00 |
| Crafter's Instinct | 13 |  0.10 |  |
| Deflecting Jewel | 5 |  0.10 |  0.00 |
| Brightness Seeker | 9 |  0.10 |  |
| Fell Rider | 9 |  0.09 |  |
| Quick Root | 5 |  0.09 |  |
| Healer's Halo | 5 |  0.09 |  |
| Shed Tail | 5 |  0.09 |  0.00 |
| Pounding Leap | 5 | -0.21 |  |
| Adapted Cantrip | 1 | -0.24 |  |
| Arboreal Conversationalist | 13 | -0.25 |  |
| Dance of the Jester | 13 | -0.28 |  0.00 |
| Dissolution's Sight | 9 | -0.30 |  0.00 |

### Actions (481)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Blazing Conflagration | 1 |  1.13 |  |
| Unleash Realm | 1 |  0.24 |  |
| Pistolero's Retort | 1 |  0.21 |  |
| Mobbing Assault | 1 |  0.20 |  |
| Runelord's Response | 1 |  0.20 |  |
| Energy Shot | 1 |  0.18 |  |
| Fight with Fear | 1 |  0.17 |  |
| Defend Life | 1 |  0.16 |  |
| Foresight | 1 |  0.16 |  |
| One Shot, One Kill | 1 |  0.16 |  |
| Life Block | 1 |  0.15 |  |
| Recall Ammunition | 1 |  0.15 |  |
| Spring the Trap | 1 |  0.14 |  |
| Once Bitten | 1 |  0.14 |  |
| Overload Vision | 1 |  0.14 |  |
| Coughing Dragon | 1 | -0.26 |  |
| Swarm Forth | 1 | -0.26 |  |
| Mirror-Trickery | 1 | -0.27 |  |
| Activate Resonant Reflection | 1 | -0.27 |  |
| Destructive Vengeance | 1 | -0.54 |  |

### Backgrounds (448)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Lost Loved One | 1 |  0.05 |  |
| Haunted | 1 |  0.05 |  |
| Blooded by the Dead | 1 |  0.04 |  |
| Mammoth Herder | 1 |  0.04 |  |
| Horizon Hunters | 1 |  0.04 |  |
| Vigilant Seal | 1 |  0.03 |  |
| Eagle Hunter | 1 |  0.03 |  |
| Osprey Scion | 1 |  0.03 |  |
| Megafauna Hunter | 1 |  0.03 |  |
| Guest of Sedeq Lodge | 1 |  0.03 |  |
| Scholar of the Sky Key | 1 |  0.03 |  |
| Mammoth Speaker | 1 |  0.03 |  |
| Borderlands Pioneer | 1 |  0.03 |  |
| Printer | 1 |  0.03 |  |
| Defiant Noble | 1 |  0.03 |  |
| Silk Farmer | 1 | -0.13 |  |
| Discarded Duplicate | 1 | -0.14 |  |
| Sign Bound | 1 | -0.22 |  |
| Elementally Infused | 1 | -0.22 |  |
| Zodiac Bound | 1 | -0.29 |  |

### Skill feats (320)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Diverse Recognition | 8 |  0.16 |  |
| Recognize Threat | 8 |  0.15 |  |
| Cushion Landing | 4 |  0.14 |  |
| Diabolic Certitude | 4 |  0.13 |  |
| Kreighton's Cognitive Crossover | 4 |  0.13 |  |
| Distracting Flattery | 4 |  0.12 |  |
| Malleable Movement | 2 |  0.12 |  |
| Vicious Critique | 1 |  0.09 |  |
| Bonded Animal | 2 |  0.09 |  |
| Recognize Spell | 1 |  0.09 |  |
| Skill Training | 1 |  0.09 |  |
| Kip Up | 7 |  0.08 |  0.00 |
| That's Not Natural! | 4 |  0.07 |  |
| Mounting Leap | 4 |  0.06 |  |
| Train Animal | 1 |  0.06 |  |
| Ashen Veil | 7 | -0.11 |  |
| Legendary Negotiation | 15 | -0.12 |  |
| Snap Out of It! (Pathfinder Agent) | 8 | -0.17 |  |
| Battle Prayer | 7 | -0.19 |  |
| No Cause for Alarm | 1 | -0.20 |  |

### Heritages (230)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Oathkeeper Dwarf | 1 |  0.06 |  |
| Towering Bugbear | 1 |  0.05 |  |
| Unseen Lizardfolk | 1 |  0.05 |  |
| Ancient Ash | 1 |  0.04 |  |
| Observant Halfling | 1 |  0.04 |  |
| Hunter Automaton | 1 |  0.04 |  |
| Warden Human (BB) | 1 |  0.04 |  |
| Versatile Human | 1 |  0.04 |  |
| Born of Celestial | 1 |  0.03 |  |
| New Moon Sarangay | 1 |  0.03 |  |
| Budding Speaker Centaur | 1 |  0.03 |  |
| Respite of Loam and Leaf | 1 |  0.03 |  |
| Witch Kholo | 1 |  0.03 |  |
| Empty Sky Kitsune | 1 |  0.03 |  |
| Full Moon Sarangay | 1 |  0.02 |  |
| Shadow of the Smith | 1 | -0.12 |  |
| Reflection | 1 | -0.15 |  |
| Born of Elements | 1 | -0.15 |  |
| Shadow of the Courtier | 1 | -0.17 |  |
| Kijimuna Gnome | 1 | -0.18 |  |

### General feats (33)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Shield Block | 1 |  0.08 |  0.10 |
| Pet | 1 |  0.08 |  |
| Ride | 1 |  0.08 |  |
| Additional Circus Trick | 3 |  0.08 |  |
| Ancestral Paragon | 3 |  0.03 |  |
| Prescient Planner | 3 |  0.02 |  |
| Prescient Consumable | 7 |  0.02 |  |
| Incredible Investiture | 11 |  0.02 |  |
| Numb to Death | 7 |  0.01 |  |
| Weapon Proficiency | 1 |  0.01 |  |
| Incredible Scout | 11 |  0.01 |  |
| Keen Follower | 3 |  0.01 |  |
| Thorough Search | 3 |  0.01 |  |
| Different Worlds | 1 |  0.00 |  |
| Fast Recovery | 1 |  0.00 |  |
| A Home in Every Port | 11 | -0.03 |  |
| Supertaster | 7 | -0.05 |  |
| Steel Your Resolve | 3 | -0.09 |  |
| Axuma's Awakening | 11 | -0.14 |  |
| Improvised Repair | 3 | -0.15 |  |

### Bonus feats (9)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Trailblazing Stride | 1 |  0.01 |  |
| Disillusionment | 1 |  0.01 |  |
| Locate Lawbreakers | 1 |  0.01 |  |
| Dedication to the Five | 1 | -0.01 |  |
| Reveal Beasts | 1 | -0.01 |  |
| Sturdy Bindings | 1 | -0.02 |  |
| Righteous Resistance | 1 | -0.03 |  |
| Seek Injustice | 1 | -0.04 |  |
| Silence Heresy | 1 | -0.14 |  |
| Reveal Beasts | 1 | -0.01 |  |
| Sturdy Bindings | 1 | -0.02 |  |
| Righteous Resistance | 1 | -0.03 |  |
| Seek Injustice | 1 | -0.04 |  |
| Silence Heresy | 1 | -0.14 |  |

### Classfeature feats (2)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Mystic Life Force | 20 |  0.00 |  |
| One Among the Masses | 14 | -0.06 |  |
| Mystic Life Force | 20 |  0.00 |  |
| One Among the Masses | 14 | -0.06 |  |

## Ancestries

| Ancestry | Simulator | Rough (out of sample) |
|---|---|---|
| Minotaur |  0.02 |  0.02 |
| Jotunborn |  0.02 |  0.01 |
| Fleshwarp |  0.01 |  0.01 |
| Bugbear |  0.01 |  0.01 |
| Orc |  0.01 |  0.01 |
| Tanuki |  0.01 |  0.01 |
| Conrasu |  0.01 |  0.00 |
| Nagaji |  0.01 |  0.00 |
| Sarangay |  0.00 | -0.00 |
| Lizardfolk |  0.00 | -0.00 |
| Anadi |  0.00 | -0.00 |
| Automaton |  0.00 | -0.00 |
| Kholo |  0.00 | -0.00 |
| Kitsune |  0.00 | -0.00 |
| Wayang |  0.00 |  0.00 |
| Catfolk |  0.00 | -0.00 |
| Surki |  0.00 | -0.00 |
| Gnome |  0.00 |  0.00 |
| Strix |  0.00 | -0.00 |
| Android |  0.00 | -0.00 |
| Human |  0.00 | -0.00 |
| Leshy |  0.00 |  0.00 |
| Yaoguai |  0.00 | -0.00 |
| Kashrishi |  0.00 | -0.00 |
| Fetchling |  0.00 | -0.00 |
| Yaksha |  0.00 | -0.00 |
| Samsaran |  0.00 | -0.00 |
| Hobgoblin |  0.00 | -0.00 |
| Ghoran |  0.00 | -0.00 |
| Vishkanya |  0.00 | -0.00 |
| Shisk |  0.00 | -0.00 |
| Dwarf | -0.00 | -0.00 |
| Poppet | -0.00 | -0.01 |
| Tengu | -0.01 | -0.01 |
| Kobold | -0.01 | -0.01 |
| Halfling | -0.01 | -0.01 |
| Ratfolk | -0.01 | -0.01 |
| Vanara | -0.01 | -0.01 |
| Tripkee | -0.01 | -0.01 |
| Shoony | -0.01 | -0.01 |
| Goblin | -0.01 | -0.01 |
| Goloma | -0.01 |  0.00 |
| Centaur | -0.01 |  0.02 |
| Dragonet | -0.01 | -0.00 |
| Athamaru | -0.01 | -0.01 |
| Elf | -0.01 | -0.00 |
| Azarketi | -0.01 | -0.01 |
| Sprite | -0.02 | -0.01 |
| Merfolk | -0.02 | -0.01 |
| Skeleton | -0.03 | -0.01 |
| Awakened Animal | -0.03 | -0.02 |
