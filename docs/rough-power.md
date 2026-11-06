# Rough power score

Generated 2026-11-04 by tools/rough-power.mjs from the simulator's ratings in /tmp/claude-build/run (feat ratings: whole fights, with vs without, 2026-11-04).

Each feat, action, heritage and background is read into building blocks from its own text and rules: damage weighted by the four degrees of success and by targets, healing, conditions by kind and value, bonuses and penalties, resistances, spells it grants, action cost, uses a fight, drawbacks. The reading is the same whether the simulator played it or not. Amounts are in each level's own units (damage over a moderate creature's Strike damage at that level, healing over its Hit Points), so one value holds at every level.

Two fits give each block a value in levels (a ridge regression of the simulator's ratings on the blocks, each block counted as log(1 + amount)). **Activities** (actions, reactions, free actions): the value of one use — the rating over the times the simulator used it in a fight —, then × the uses a fight: the average the simulator gave tested activities with the same allowance (1.2 for once a minute or rarer, 3.1 for a reaction, 4.1 for no frequency). **Passives**, heritages and backgrounds: the whole-fight rating. Ancestries get a small fit of their own. A rating the simulator's AI used the activity in less than 0.5 times a fight is left out of the fit (it says little of its value per use) and scored like the untested.

Every check below is out of sample: each tested thing was scored by values fitted without it (10 folds), before its own rating was looked at.

## Does it align with what's been tested?

| Family | Tested | Correlation | Rank correlation | Mean error (levels) | Guessing the average |
|---|---|---|---|---|---|
| Activities, per use | 576 | 0.20 | 0.31 | 0.050 | 0.054 |
| Activities, whole fight (per use × the simulator's uses) | 576 | 0.41 | 0.39 | 0.134 | — |
| Passives, heritages, backgrounds | 741 | 0.40 | 0.46 | 0.051 | 0.062 |
| Ancestries | 51 | 0.72 | 0.68 | 0.004 | 0.006 |
| Spells (one cast; the same blocks, own fit, a cross-check) | 814 | 0.36 | 0.30 | 0.042 | 0.048 |

By family (whole fight, out of sample):

| Family | Tested | Correlation | Mean error |
|---|---|---|---|
| activity: class feat | 443 | 0.36 | 0.149 |
| class feat | 328 | 0.36 | 0.063 |
| ancestry feat | 301 | 0.39 | 0.053 |
| heritage | 104 | 0.28 | 0.010 |
| activity: ancestry feat | 71 | 0.82 | 0.068 |
| activity: action | 49 | 0.78 | 0.091 |
| activity: skill feat | 10 | -0.53 | 0.160 |
| general feat | 6 | -0.15 | 0.022 |

Bands, whole fight (rows: the simulator's; columns: the rough score's, out of sample):

| Simulator \ Rough | strong (≥ 0.15) | useful (0.05–0.15) | about nothing (±0.05) | harmful (≤ −0.05) |
|---|---|---|---|---|
| strong (≥ 0.15) | 0 | 0 | 21 | 20 |
| useful (0.05–0.15) | 0 | 2 | 56 | 24 |
| about nothing (±0.05) | 0 | 7 | 594 | 154 |
| harmful (≤ −0.05) | 0 | 5 | 128 | 306 |

Same band: 902 of 1317 (68%). Two or more bands off: 70.

## The building blocks' values

### Activities, one use

Base (intercept): -0.028. λ = 300. Amounts here are for one use ("× uses" in a label is 1).

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| spell it grants (its one-cast rating) |  0.046 | 15 |
| PF2e rule: extra damage dice |  0.035 | 22 |
| skill-check bonus |  0.028 | 14 |
| Strikes made (× uses) |  0.026 | 229 |
| level/20 |  0.021 | 576 |
| cat_class |  0.019 | 443 |
| press |  0.015 | 13 |
| stance |  0.014 | 30 |
| area damage (× moderate damage × 2 targets × uses) |  0.013 | 75 |
| persistent damage (× 2 rounds) |  0.012 | 30 |
| AC bonus (per +1) |  0.011 | 46 |
| companion/summon |  0.010 | 10 |
| other damage (degree-weighted) |  0.010 | 36 |
| single-target save damage (× moderate damage, basic save 0.8) |  0.010 | 10 |
| PF2e rule: attack |  0.010 | 17 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) |  0.009 | 77 |
| has a trigger |  0.008 | 35 |
| cat_skill |  0.007 | 10 |
| incapacitation |  0.003 | 15 |
| save bonus (per +1) |  0.001 | 16 |
| Speed bonus (per 10 ft) |  0.001 | 9 |
| a reaction |  0.001 | 31 |
| uses a fight |  0.000 | 576 |
| flourish | -0.002 | 66 |
| cat_offensive | -0.003 | 36 |
| limited (once a minute or less) | -0.003 | 139 |
| reroll/fortune | -0.004 | 8 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) | -0.004 | 183 |
| Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses) | -0.005 | 34 |
| foe Speed penalty | -0.006 | 10 |
| has a requirement | -0.007 | 164 |
| movement | -0.011 | 86 |
| archetype | -0.017 | 160 |
| grants an item | -0.022 | 12 |
| cat_ancestry | -0.022 | 71 |
| actions spent (× uses) | -0.022 | 539 |
| attack bonus (per +1) | -0.029 | 15 |
| condition on yourself (drawback) | -0.035 | 16 |
| resistance (× moderate damage) | -0.089 | 19 |
| temporary HP (× moderate HP × 3) | -0.103 | 13 |

### Passives, heritages, backgrounds (whole fight)

Base (intercept): -0.028. λ = 30. 

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| PF2e rule: Hit Points |  0.246 | 10 |
| PF2e rule: Speed |  0.072 | 18 |
| resistance (× moderate damage) |  0.061 | 97 |
| level/20 |  0.058 | 741 |
| damage bonus (per +1/4 of moderate damage) |  0.044 | 9 |
| AC bonus (per +1) |  0.043 | 10 |
| senses |  0.038 | 35 |
| PF2e rule: saves |  0.026 | 123 |
| PF2e rule: damage |  0.022 | 12 |
| other damage (degree-weighted) |  0.021 | 76 |
| movement |  0.021 | 23 |
| skill-check bonus |  0.019 | 12 |
| Perception/initiative bonus |  0.017 | 13 |
| cat_class |  0.016 | 328 |
| cat_heritage |  0.016 | 104 |
| PF2e rule: Perception |  0.011 | 19 |
| a new Strike (unarmed attack) |  0.010 | 78 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) |  0.006 | 48 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) |  0.003 | 22 |
| save bonus (per +1) |  0.001 | 115 |
| passive |  0.000 | 741 |
| condition on yourself (drawback) | -0.004 | 9 |
| PF2e rule: AC | -0.012 | 9 |
| grants an item | -0.012 | 66 |
| companion/summon | -0.015 | 16 |
| PF2e rule: skills | -0.016 | 17 |
| cat_ancestry | -0.020 | 301 |
| archetype | -0.055 | 213 |
| exploration/downtime/knowledge | -0.073 | 9 |
| spell it grants (its one-cast rating) | -0.181 | 202 |

### Ancestries

| Block | Value |
|---|---|
| base | -0.064 |
| ancestry Hit Points (per 2) |  0.039 |
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
| Scattering Shout | activity, class | 14 | -1.45 | -0.10 | 5.1 |
| Silencing Strike | activity, class | 10 | -1.20 |  0.08 | 17.0 |
| Thrash | activity, class | 8 | -1.26 | -0.23 | 15.1 |
| Spike Skin | activity, class | 8 |  0.38 | -0.60 | 12.3 |
| Dissolution's Sovereignty | ancestry | 17 | -1.00 | -0.03 | passive |
| Reflect Foe | ancestry | 17 | -1.00 | -0.04 | passive |
| Feign Innocence | activity, class | 12 |  0.10 | -0.85 | 25.8 |
| Scattering Charge | activity, class | 12 | -1.12 | -0.18 | 4.6 |
| Upset Balance | activity, class | 6 | -0.75 |  0.11 | 8.8 |
| Unbalancing Sweep | activity, class | 12 | -1.00 | -0.15 | 4.4 |
| Pin to the Spot | activity, class | 14 |  0.71 | -0.09 | 4.2 |
| Peony's Flourish | activity, class | 14 | -0.98 | -0.20 | 6.3 |
| Sheltering Pulse | activity, class | 8 | -0.17 | -0.83 | 20.5 |
| Song of Grace and Speed | activity, class | 16 |  0.49 | -0.15 | 5.0 |
| Lightning Dash | activity, class | 4 |  0.54 | -0.10 | 3.5 |
| Scare to Death | activity, skill | 15 |  0.45 | -0.17 | 3.6 |
| Clear the Way | activity, class | 6 | -0.78 | -0.16 | 3.7 |
| Blazing Wave | activity, class | 4 |  0.57 | -0.04 | 1.1 |
| Impossible Volley | activity, class | 18 | -0.86 | -0.25 | 10.5 |
| Purifying Breeze | activity, class | 14 | -1.00 | -0.39 | 16.7 |
| Gossamer Blade | activity, class | 4 | -0.73 | -0.16 | 7.8 |
| Flourishing Finish | activity, class | 12 | -0.92 | -0.34 | 14.8 |
| Fey Ascension | ancestry | 9 | -0.62 | -0.07 | passive |
| Perplex | activity, class | 14 | -0.67 | -0.13 | 3.9 |
| Muckraking | activity, class | 16 | -0.61 | -0.07 | 4.2 |
| Infernal Anguish | activity, class | 8 |  0.15 | -0.38 | 9.1 |
| Silk Bracelet | activity, class | 6 | -0.57 | -0.04 | 4.3 |
| Prayer Attack | activity, class | 14 | -0.68 | -0.16 | 16.6 |
| Say That Again! | activity, skill | 6 | -0.49 |  0.03 | 3.0 |
| Quickening Banner | activity, class | 14 |  0.48 | -0.04 | 5.1 |

## Not yet tested: the rough score

6506 feats, actions, heritages and backgrounds out of the fit (never rated, or rated with the simulator's AI hardly using them), scored by the values above: whole fight, activities at the uses a fight the tested ones with the same frequency got. The full list (every score and block) is in docs/rough-power.json. A score near the base means the text has none of the blocks the fit values — often nothing a fight uses.

### Class feats (3585)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Relinquish Control | 1 |  0.15 |  |
| Reactive Transformation | 14 |  0.12 |  |
| Rebounding Smite | 16 |  0.11 |  |
| All in My Head | 18 |  0.11 |  |
| Release Me! | 14 |  0.10 |  |
| Lethal Finisher | 18 |  0.10 |  |
| Soulforger Dedication | 2 |  0.10 |  |
| Multishot Stance | 16 |  0.09 |  |
| Not This Time | 18 |  0.09 |  |
| Graceful Poise | 16 |  0.08 |  |
| Triumphant Inspiration | 14 |  0.08 |  |
| Arc of Destruction | 8 |  0.08 |  |
| Shield from Arrows | 8 |  0.08 |  |
| Cutthroat Grapple | 16 |  0.08 |  0.00 |
| Armored Counterattack | 12 |  0.08 |  |
| Swipe Souvenir | 8 | -0.31 |  |
| Astral Tether | 4 | -0.31 |  |
| Klingegeist | 10 | -0.32 |  |
| Shining Glory | 18 | -0.34 |  |
| Feast | 4 | -0.56 |  |

### Ancestry feats (1241)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Home in the Deep | 9 |  0.05 |  |
| Greater Enhance Venom | 17 |  0.04 |  |
| Striking Retribution | 1 |  0.04 |  |
| Hardy Traveler | 9 |  0.03 |  |
| Shory Aerialist | 13 |  0.03 |  |
| Scrutinizing Gaze | 13 |  0.02 |  |
| Moderate Enhance Venom | 9 |  0.02 |  |
| Iruxi Armaments | 1 |  0.01 |  |
| Heart of Earth | 13 |  0.01 |  |
| Battleforger | 9 |  0.01 |  |
| Tough Skin | 1 |  0.01 |  |
| Stronger Debilitating Venom | 13 |  0.01 |  |
| Lesser Enhance Venom | 1 |  0.00 |  |
| Persistent Odor | 9 |  0.00 |  |
| Wild-Haired Fury | 13 |  0.00 |  |
| Mask of Fear | 13 | -0.39 |  |
| Ratfolk Roll | 5 | -0.40 |  |
| Tunnel Roll | 5 | -0.40 |  |
| Radiant Circuitry | 1 | -0.43 |  0.00 |
| Crystal Luminescence | 1 | -0.43 |  |

### Backgrounds (540)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Magical Experiment | 1 |  0.02 |  |
| Saved by Clockwork | 1 |  0.01 |  |
| Trusted Rival | 1 |  0.00 |  |
| Feral Child | 1 |  0.00 |  |
| Escaped from Time | 1 | -0.00 |  |
| Friend of a Friend | 1 | -0.01 |  |
| Runelord Researcher | 1 | -0.01 |  |
| Once Possessed | 1 | -0.01 |  |
| Energy Scarred | 1 | -0.01 |  |
| Reborn Soul | 1 | -0.01 |  |
| Demon Hunted | 1 | -0.01 |  |
| Fleshwarp Researcher | 1 | -0.02 |  |
| Guest of Sedeq Lodge | 1 | -0.02 |  |
| Curse-Marked | 1 | -0.02 |  |
| Brevic Outcast | 1 | -0.02 |  |
| Folklore Enthusiast | 1 | -0.09 |  |
| Sign Bound | 1 | -0.15 |  |
| Elementally Infused | 1 | -0.15 |  |
| Local Savior | 1 | -0.16 |  |
| Zodiac Bound | 1 | -0.20 |  |

### Actions (534)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Energy Shot | 1 |  0.05 |  |
| Disarming Interception | 1 |  0.05 |  0.00 |
| One Shot, One Kill | 1 |  0.02 |  |
| Master Strike | 1 |  0.02 |  |
| Erupting Spurs | 1 |  0.02 |  |
| Surprising Anatomy | 1 |  0.01 |  |
| Salt Wound | 1 |  0.01 |  0.00 |
| Aid | 1 |  0.01 |  |
| Dancing Dodge | 1 |  0.01 |  |
| Redistribute | 1 |  0.01 |  |
| Runelord's Response | 1 |  0.00 |  0.00 |
| Wicked Thorns | 1 |  0.00 |  0.00 |
| Final Spite | 1 |  0.00 |  |
| Barbed Quills | 1 | -0.01 |  0.00 |
| Mirror-Trickery | 1 | -0.01 |  |
| Crawl | 1 | -0.26 |  |
| Run Over | 1 | -0.26 |  |
| Balance | 1 | -0.27 |  |
| Climb | 1 | -0.29 |  |
| Blazing Conflagration | 1 | -0.90 |  |

### Skill feats (328)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Legendary Medic | 15 |  0.01 |  |
| Legendary Performer | 15 |  0.00 |  |
| Legendary Professional | 15 |  0.00 |  |
| Legendary Thief | 15 |  0.00 |  |
| Cloud Jump | 15 |  0.00 |  |
| Legendary Survivalist | 15 |  0.00 |  |
| Legendary Tattoo Artist | 15 |  0.00 |  |
| Legendary Guide | 15 |  0.00 |  |
| Legendary Codebreaker | 15 |  0.00 |  |
| Divine Guidance | 15 |  0.00 |  |
| Unified Theory | 15 |  0.00 |  |
| Legendary Linguist | 15 |  0.00 |  |
| Craft Anything | 15 |  0.00 |  |
| Risky Surgery | 1 |  0.00 |  |
| Calm and Centered | 8 |  0.00 |  |
| Dead Reckoning | 4 | -0.23 |  |
| No Cause for Alarm | 1 | -0.23 |  |
| Ashen Veil | 7 | -0.24 |  |
| Treat Condition | 4 | -0.25 |  |
| Commitment to Equality | 4 | -0.44 |  |

### Heritages (230)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Coral Athamaru | 1 |  0.06 |  |
| Warden Human (BB) | 1 |  0.05 |  |
| Titan Nagaji | 1 |  0.05 |  |
| Bakuwa Lizardfolk | 1 |  0.05 |  |
| Rite of Reinforcement | 1 |  0.05 |  |
| Oathkeeper Dwarf | 1 |  0.04 |  |
| Rock Dwarf | 1 |  0.02 |  |
| Strong Oak | 1 |  0.02 |  |
| House Drake | 1 |  0.02 |  |
| Littlehorn Minotaur | 1 |  0.02 |  |
| Hardshell Surki | 1 |  0.02 |  |
| Root Leshy | 1 |  0.01 |  |
| Courageous Tanuki | 1 |  0.01 |  |
| Observant Halfling | 1 |  0.01 |  |
| Insightful Goloma | 1 |  0.01 |  |
| Liminal Catfolk | 1 | -0.06 |  |
| Scalekeeper Vishkanya | 1 | -0.07 |  |
| Makari Lizardfolk | 1 | -0.08 |  |
| Bright Fetchling | 1 | -0.08 |  |
| Born of Elements | 1 | -0.19 |  |

### General feats (34)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Axuma's Vigor | 11 |  0.02 |  |
| True Perception | 19 |  0.01 |  |
| Thorough Search | 3 |  0.00 |  |
| Incredible Investiture | 11 | -0.00 |  |
| Caravan Leader | 11 | -0.00 |  |
| Axuma's Awakening | 11 | -0.00 |  |
| Expeditious Search | 7 | -0.01 |  |
| Numb to Death | 7 | -0.01 |  |
| Prescient Consumable | 7 | -0.01 |  |
| Hireling Manager | 3 | -0.01 |  |
| Different Worlds | 1 | -0.01 |  |
| Untrained Improvisation | 3 | -0.02 |  |
| Additional Circus Trick | 3 | -0.02 |  |
| Prescient Planner | 3 | -0.02 |  |
| Skitter | 3 | -0.02 |  |
| Shield Block | 1 | -0.06 |  |
| Pick up the Pace | 3 | -0.07 |  |
| Keen Follower | 3 | -0.07 |  |
| Steel Your Resolve | 3 | -0.17 |  |
| Improvised Repair | 3 | -0.23 |  |

### Bonus feats (11)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Disillusionment | 1 | -0.03 |  |
| Sturdy Bindings | 1 | -0.03 |  |
| Locate Lawbreakers | 1 | -0.03 |  |
| Dedication to the Five | 1 | -0.03 |  |
| Blessing of the Five | 1 | -0.06 |  |
| Devil Allies | 1 | -0.07 |  |
| Reveal Beasts | 1 | -0.07 |  |
| Seek Injustice | 1 | -0.07 |  |
| Righteous Resistance | 1 | -0.07 |  |
| Trailblazing Stride | 1 | -0.08 |  |
| Silence Heresy | 1 | -0.14 |  |
| Reveal Beasts | 1 | -0.07 |  |
| Seek Injustice | 1 | -0.07 |  |
| Righteous Resistance | 1 | -0.07 |  |
| Trailblazing Stride | 1 | -0.08 |  |
| Silence Heresy | 1 | -0.14 |  |

### Classfeature feats (3)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Mystic Life Force | 20 |  0.01 |  |
| Deathless Servant | 18 |  0.01 |  |
| One Among the Masses | 14 | -0.01 |  |
| Mystic Life Force | 20 |  0.01 |  |
| Deathless Servant | 18 |  0.01 |  |
| One Among the Masses | 14 | -0.01 |  |

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
| Lizardfolk |  0.00 | -0.00 |
| Sarangay |  0.00 | -0.00 |
| Anadi |  0.00 | -0.00 |
| Kholo |  0.00 | -0.00 |
| Automaton |  0.00 | -0.00 |
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
| Ratfolk | -0.00 | -0.01 |
| Kobold | -0.01 | -0.01 |
| Halfling | -0.01 | -0.01 |
| Vanara | -0.01 | -0.01 |
| Tripkee | -0.01 | -0.01 |
| Shoony | -0.01 | -0.01 |
| Goblin | -0.01 | -0.01 |
| Tengu | -0.01 | -0.01 |
| Goloma | -0.01 |  0.00 |
| Centaur | -0.01 |  0.02 |
| Dragonet | -0.01 | -0.00 |
| Athamaru | -0.01 | -0.01 |
| Azarketi | -0.01 | -0.01 |
| Elf | -0.01 | -0.00 |
| Sprite | -0.02 | -0.01 |
| Merfolk | -0.02 | -0.01 |
| Skeleton | -0.03 | -0.01 |
| Awakened Animal | -0.03 | -0.02 |
