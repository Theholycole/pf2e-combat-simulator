# Rough power score

Generated 2026-11-03 by tools/rough-power.mjs from the simulator's ratings in /tmp/claude-build/run (feat ratings: whole fights, with vs without, 2026-11-03).

Each feat, action, heritage and background is read into building blocks from its own text and rules: damage weighted by the four degrees of success and by targets, healing, conditions by kind and value, bonuses and penalties, resistances, spells it grants, action cost, uses a fight, drawbacks. The reading is the same whether the simulator played it or not. Amounts are in each level's own units (damage over a moderate creature's Strike damage at that level, healing over its Hit Points), so one value holds at every level.

Two fits give each block a value in levels (a ridge regression of the simulator's ratings on the blocks, each block counted as log(1 + amount)). **Activities** (actions, reactions, free actions): the value of one use — the rating over the times the simulator used it in a fight —, then × the uses a fight: the average the simulator gave tested activities with the same allowance (1.1 for once a minute or rarer, 1.0 for a reaction, 2.3 for no frequency). **Passives**, heritages and backgrounds: the whole-fight rating. Ancestries get a small fit of their own. A rating the simulator's AI used the activity in less than 0.5 times a fight is left out of the fit (it says little of its value per use) and scored like the untested.

Every check below is out of sample: each tested thing was scored by values fitted without it (10 folds), before its own rating was looked at.

## Does it align with what's been tested?

| Family | Tested | Correlation | Rank correlation | Mean error (levels) | Guessing the average |
|---|---|---|---|---|---|
| Activities, per use | 238 | 0.33 | 0.25 | 0.045 | 0.049 |
| Activities, whole fight (per use × the simulator's uses) | 238 | 0.29 | 0.29 | 0.073 | — |
| Passives, heritages, backgrounds | 530 | 0.13 | -0.00 | 0.012 | 0.012 |
| Ancestries | 51 | 0.72 | 0.68 | 0.004 | 0.006 |
| Spells (one cast; the same blocks, own fit, a cross-check) | 814 | 0.36 | 0.30 | 0.042 | 0.048 |

By family (whole fight, out of sample):

| Family | Tested | Correlation | Mean error |
|---|---|---|---|
| class feat | 246 | 0.14 | 0.020 |
| activity: class feat | 211 | 0.27 | 0.075 |
| ancestry feat | 172 | 0.11 | 0.006 |
| heritage | 104 | 0.15 | 0.002 |
| activity: action | 12 | 0.71 | 0.029 |
| activity: ancestry feat | 11 | -0.42 | 0.069 |
| general feat | 6 | -0.56 | 0.017 |

Bands, whole fight (rows: the simulator's; columns: the rough score's, out of sample):

| Simulator \ Rough | strong (≥ 0.15) | useful (0.05–0.15) | about nothing (±0.05) | harmful (≤ −0.05) |
|---|---|---|---|---|
| strong (≥ 0.15) | 3 | 21 | 13 | 0 |
| useful (0.05–0.15) | 3 | 25 | 45 | 0 |
| about nothing (±0.05) | 5 | 45 | 584 | 1 |
| harmful (≤ −0.05) | 1 | 7 | 15 | 0 |

Same band: 612 of 768 (80%). Two or more bands off: 26.

## The building blocks' values

### Activities, one use

Base (intercept):  0.024. λ = 30. Amounts here are for one use ("× uses" in a label is 1).

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| a reaction |  0.075 | 13 |
| area damage (× moderate damage × 2 targets × uses) |  0.050 | 18 |
| limited (once a minute or less) |  0.032 | 44 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) |  0.032 | 70 |
| movement |  0.031 | 33 |
| has a trigger |  0.014 | 16 |
| PF2e rule: extra damage dice |  0.010 | 16 |
| actions spent (× uses) |  0.009 | 219 |
| level/20 |  0.007 | 238 |
| has a requirement |  0.004 | 86 |
| Strike extra damage (× moderate Strike damage, a hit 0.45 + crit 0.1×2, × uses) |  0.004 | 21 |
| PF2e rule: attack |  0.000 | 9 |
| uses a fight |  0.000 | 238 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) | -0.001 | 36 |
| persistent damage (× 2 rounds) | -0.005 | 14 |
| press | -0.005 | 9 |
| flourish | -0.006 | 34 |
| attack bonus (per +1) | -0.006 | 9 |
| archetype | -0.007 | 53 |
| cat_class | -0.009 | 211 |
| stance | -0.010 | 18 |
| other damage (degree-weighted) | -0.013 | 19 |
| Strikes made (× uses) | -0.015 | 127 |
| cat_offensive | -0.023 | 10 |
| AC bonus (per +1) | -0.024 | 20 |
| cat_ancestry | -0.075 | 11 |

### Passives, heritages, backgrounds (whole fight)

Base (intercept):  0.003. λ = 300. 

| Block | Value (levels per log(1 + amount)) | Tested with it |
|---|---|---|
| PF2e rule: Hit Points |  0.086 | 10 |
| PF2e rule: Speed |  0.021 | 18 |
| PF2e rule: damage |  0.012 | 11 |
| level/20 |  0.010 | 530 |
| soft condition on foes (frightened 1, sickened 1, off-guard 0.7, prone 0.6 … × value × degree share × uses) |  0.005 | 44 |
| damage bonus (per +1/4 of moderate damage) |  0.005 | 9 |
| cat_class |  0.004 | 246 |
| PF2e rule: skills |  0.004 | 15 |
| grants an item |  0.003 | 63 |
| AC bonus (per +1) |  0.002 | 10 |
| PF2e rule: Perception |  0.001 | 19 |
| Perception/initiative bonus |  0.001 | 12 |
| other damage (degree-weighted) |  0.001 | 75 |
| passive |  0.000 | 530 |
| skill-check bonus | -0.001 | 10 |
| hard condition on foes (stunned 1.6, slowed 1.4, paralyzed 3 … × value × degree share × uses) | -0.001 | 21 |
| resistance (× moderate damage) | -0.001 | 94 |
| a new Strike (unarmed attack) | -0.001 | 78 |
| cat_ancestry | -0.001 | 172 |
| save bonus (per +1) | -0.002 | 115 |
| cat_heritage | -0.002 | 104 |
| senses | -0.003 | 35 |
| PF2e rule: saves | -0.003 | 123 |
| PF2e rule: AC | -0.006 | 9 |
| condition on yourself (drawback) | -0.007 | 8 |
| archetype | -0.008 | 161 |
| spell it grants (its one-cast rating) | -0.010 | 18 |
| movement | -0.014 | 22 |

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
| Pin to the Spot | activity, class | 14 |  0.71 |  0.03 | 3.9 |
| Blazing Wave | activity, class | 4 |  0.59 |  0.06 | 0.8 |
| Belly Flop | activity, class | 10 |  0.07 |  0.52 | 10.5 |
| Reinforced Skeleton | class | 12 |  0.42 |  0.01 | passive |
| Quickening Banner | activity, class | 14 |  0.50 |  0.13 | 5.1 |
| The Thousand Lashes of the Weeping Willow | activity, class | 18 |  0.19 |  0.54 | 3.3 |
| Become Thought | class | 20 |  0.35 |  0.01 | passive |
| Scare to Death | activity, skill | 15 |  0.35 |  0.04 | 1.0 |
| Disarming Twist | activity, class | 10 |  0.02 |  0.30 | 11.3 |
| Stab and Blast | activity, class | 8 |  0.29 |  0.01 | 7.7 |
| Lesson of the Splintered Aegis | activity, class | 10 | -0.14 |  0.14 | 10.3 |
| Lightning Dash | activity, class | 4 |  0.59 |  0.33 | 3.8 |
| Explosion | class | 6 |  0.25 |  0.00 | passive |
| Song of Grace and Speed | activity, class | 16 |  0.49 |  0.25 | 5.0 |
| Kneel Before the Rightful Heir | activity, class | 16 | -0.06 |  0.15 | 3.3 |
| Whirling Grindstone | activity, class | 4 |  0.28 |  0.08 | 3.6 |
| Jester's Gambol | activity, class | 16 |  0.22 |  0.02 | 1.0 |
| Fiend Slayer | activity, class | 16 |  0.23 |  0.03 | 3.3 |
| Scarred Hide | class | 14 | -0.18 |  0.01 | passive |
| Tumbling Lumber | activity, class | 4 |  0.31 |  0.13 | 4.3 |
| Rain of Rust | activity, class | 4 |  0.32 |  0.13 | 3.7 |
| Burning Demand | activity, class | 12 | -0.05 |  0.12 | 3.8 |
| Infernal Anguish | activity, class | 8 |  0.25 |  0.07 | 4.8 |
| Weakening Assault | activity, class | 12 |  0.00 |  0.18 | 4.0 |
| Rebirth in Living Stone | activity, class | 18 | -0.09 |  0.07 | 2.0 |
| Confusing Commands | activity, class | 16 | -0.09 |  0.08 | 2.0 |
| Unyielding Force | class | 20 | -0.15 |  0.01 | passive |
| Disrupt Qi | activity, class | 12 |  0.19 |  0.03 | 2.0 |
| Earth to Heavens Strike | activity, class | 14 | -0.08 |  0.08 | 2.3 |
| Cross the Final Horizon | activity, class | 20 |  0.23 |  0.08 | 3.0 |

## Not yet tested: the rough score

7055 feats, actions, heritages and backgrounds out of the fit (never rated, or rated with the simulator's AI hardly using them), scored by the values above: whole fight, activities at the uses a fight the tested ones with the same frequency got. The full list (every score and block) is in docs/rough-power.json. A score near the base means the text has none of the blocks the fit values — often nothing a fight uses.

### Class feats (3899)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Enervating Wail | 6 |  0.44 |  0.00 |
| Hell of 1,000,000 Needles | 18 |  0.32 |  0.02 |
| Storming Breath | 6 |  0.30 | -0.01 |
| The Shattered Mountain Weeps | 18 |  0.29 |  0.07 |
| All Shall End in Flames | 18 |  0.28 |  0.02 |
| Venipuncture | 10 |  0.28 |  |
| Irradiate | 6 |  0.28 |  0.00 |
| Glory on High | 18 |  0.27 |  0.00 |
| Shard Strike | 1 |  0.26 |  0.01 |
| Essence Overflow | 6 |  0.26 |  |
| Brandish Authority | 18 |  0.26 |  0.00 |
| Shining Glory | 18 |  0.25 |  |
| Dive of the Divine | 16 |  0.25 |  |
| Unleash the Blight | 10 |  0.25 |  0.00 |
| Dragon Roar | 6 |  0.25 |  0.11 |
| Coffin Bound | 12 | -0.01 |  |
| Spirit Sheath | 2 | -0.01 |  |
| Animal Fleetness | 4 | -0.01 |  |
| Greater Mercy | 8 | -0.01 |  |
| Six Pillars Stance | 12 | -0.02 |  |

### Ancestry feats (1430)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Dragonet Breath | 1 |  0.28 |  0.00 |
| Storming Gaze | 5 |  0.14 |  |
| Pandemonium Eruption | 17 |  0.14 |  0.06 |
| Rain of Bolts | 9 |  0.14 |  0.01 |
| Dominion Aura | 17 |  0.12 | -0.00 |
| Breath of the Dragon (Dragonblood) | 1 |  0.12 | -0.00 |
| Kobold Breath | 1 |  0.12 | -0.00 |
| Pummeling Whirlpool | 13 |  0.12 |  0.01 |
| Blazing Aura | 17 |  0.12 |  0.00 |
| Idol Threat | 13 |  0.11 |  0.00 |
| Thousand-Year Grudge | 5 |  0.10 |  |
| Gaping Flesh | 5 |  0.09 |  0.00 |
| Airy Step | 13 |  0.08 |  |
| Sudden Terror | 1 |  0.08 |  0.00 |
| All This Has Happened Before | 5 |  0.08 |  |
| Water to Water | 13 | -0.07 |  |
| Kneecap | 5 | -0.07 |  |
| Favorable Winds | 5 | -0.07 |  |
| Long-Nosed Form | 5 | -0.07 |  |
| Dance of the Mousedeer | 1 | -0.09 |  0.00 |

### Actions (571)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Fleeting Arc through Heaven and Earth | 1 |  0.43 |  |
| Blazing Conflagration | 1 |  0.39 |  |
| Dragon Breath (Dragon Form) | 1 |  0.33 |  |
| Mobbing Assault | 1 |  0.33 |  |
| Topple the Pillar of Heaven | 1 |  0.32 |  |
| Lantern Beam | 1 |  0.29 |  |
| Thundering Roar | 1 |  0.29 |  |
| Ringing Challenge | 1 |  0.28 |  |
| Explode | 1 |  0.25 |  |
| Swarming Assault | 1 |  0.24 |  |
| Dragon Breath (Eidolon) | 1 |  0.23 |  |
| Thermal Eruption | 1 |  0.21 |  |
| Create a Diversion | 1 |  0.18 |  |
| Goblin Jubilee | 1 |  0.15 |  0.31 |
| Tactical Retreat | 1 |  0.15 |  |
| Talon Stance | 1 | -0.00 |  |
| Treat Disease | 1 | -0.00 |  |
| Overwhelming Combination | 1 | -0.00 |  |
| Claw Stance | 1 | -0.00 |  |
| Arcane Cascade | 1 | -0.00 |  0.00 |

### Backgrounds (540)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Runelord Researcher | 1 |  0.01 |  |
| Brevic Noble | 1 |  0.01 |  |
| Tapestry Refugee | 1 |  0.01 |  |
| Willowshore Urchin | 1 |  0.01 |  |
| Southbank Traditionalist | 1 |  0.01 |  |
| Northridge Scholar | 1 |  0.01 |  |
| Folklore Enthusiast | 1 |  0.01 |  |
| Outskirt Dweller | 1 |  0.01 |  |
| Close Ties | 1 |  0.01 |  |
| Sponsored by a Village | 1 |  0.01 |  |
| Propaganda Promoter | 1 |  0.01 |  |
| Construction Occultist | 1 |  0.01 |  |
| Animal Wrangler | 1 |  0.01 |  |
| Money Counter | 1 |  0.01 |  |
| Hunted by the Night | 1 |  0.01 |  |
| Undersea Enthusiast | 1 | -0.00 |  |
| Scholar of the Ancients | 1 | -0.00 |  |
| Zodiac Bound | 1 | -0.01 |  |
| Haunted | 1 | -0.01 |  |
| Mechanical Symbiosis | 1 | -0.01 |  |

### Skill feats (335)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| No Cause for Alarm | 1 |  0.17 |  |
| Improvise Strategy | 7 |  0.15 |  |
| Skeptic's Defense | 7 |  0.13 |  |
| Go with the Flow | 7 |  0.13 |  |
| Bon Mot | 1 |  0.12 |  |
| Eye for Numbers | 1 |  0.12 |  |
| Trick Magic Item | 1 |  0.12 |  |
| Commitment to Equality | 4 |  0.12 |  |
| Voice Cold as Death | 7 |  0.12 |  0.00 |
| Disturbing Knowledge | 7 |  0.12 |  0.00 |
| Comforting Presence | 10 |  0.12 |  |
| Seasoned Command | 7 |  0.12 |  |
| Evangelize | 7 |  0.11 |  0.00 |
| Snap Out of It! (Pathfinder Agent) | 8 |  0.10 |  |
| Cushion Landing | 4 |  0.10 |  |
| Dueling Acumen | 2 | -0.00 |  |
| Canopy Predator | 4 | -0.00 |  |
| Rope Runner | 4 | -0.00 |  |
| Read Lips | 1 | -0.01 |  |
| Solo Dancer | 4 | -0.01 |  |

### Heritages (230)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Warden Human (BB) | 1 |  0.02 |  |
| House Drake | 1 |  0.01 |  |
| Hardshell Surki | 1 |  0.01 |  |
| Titan Nagaji | 1 |  0.01 |  |
| Bakuwa Lizardfolk | 1 |  0.01 |  |
| Rite of Reinforcement | 1 |  0.01 |  |
| Hunter Automaton | 1 |  0.01 |  |
| Desert Rat | 1 |  0.01 |  |
| Tailed Goblin | 1 |  0.01 |  |
| Keeper Jotunborn | 1 |  0.01 |  |
| Anvil Dwarf | 1 |  0.01 |  |
| Deep Orc | 1 |  0.01 |  |
| Coral Athamaru | 1 |  0.01 |  |
| Wisp Fetchling | 1 |  0.01 |  |
| Treedweller Goblin | 1 |  0.00 |  |
| Wetlander Lizardfolk | 1 | -0.00 |  |
| Leungli | 1 | -0.00 |  |
| Climbing Animal | 1 | -0.01 |  |
| Born of Elements | 1 | -0.01 |  |
| Cecaelia Merfolk | 1 | -0.01 |  |

### General feats (34)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Improvised Repair | 3 |  0.09 |  |
| Shield Block | 1 |  0.08 |  |
| Steel Your Resolve | 3 |  0.07 |  |
| True Perception | 19 |  0.01 |  |
| Incredible Scout | 11 |  0.01 |  |
| Supertaster | 7 |  0.01 |  |
| Robust Health | 3 |  0.01 |  |
| Incredible Investiture | 11 |  0.01 |  |
| Caravan Leader | 11 |  0.01 |  |
| Axuma's Awakening | 11 |  0.01 |  |
| A Home in Every Port | 11 |  0.01 |  |
| Axuma's Vigor | 11 |  0.01 |  |
| Ancestral Paragon | 3 |  0.01 |  |
| Different Worlds | 1 |  0.01 |  |
| Hireling Manager | 3 |  0.01 |  |
| Ride | 1 |  0.00 |  |
| Feather Step | 1 |  0.00 |  |
| Canny Acumen | 1 |  0.00 |  |
| Adopted Ancestry | 1 |  0.00 |  |
| Weapon Proficiency | 1 |  0.00 |  |

### Bonus feats (13)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| Silence Heresy | 1 |  0.11 |  |
| Blessing of the Five | 1 |  0.07 |  |
| Seek Injustice | 1 |  0.07 |  |
| Spiritual Disruption | 1 |  0.06 |  0.00 |
| Shackles of Law | 1 |  0.05 |  0.00 |
| Reveal Beasts | 1 |  0.01 |  |
| Dedication to the Five | 1 |  0.01 |  |
| Trailblazing Stride | 1 |  0.00 |  |
| Disillusionment | 1 |  0.00 |  |
| Sturdy Bindings | 1 |  0.00 |  |
| Locate Lawbreakers | 1 |  0.00 |  |
| Devil Allies | 1 |  0.00 |  |
| Righteous Resistance | 1 |  0.00 |  |
| Disillusionment | 1 |  0.00 |  |
| Sturdy Bindings | 1 |  0.00 |  |
| Locate Lawbreakers | 1 |  0.00 |  |
| Devil Allies | 1 |  0.00 |  |
| Righteous Resistance | 1 |  0.00 |  |

### Classfeature feats (3)

Highest 15 and lowest 5:

| Name | Level | Rough | Rated (AI rarely used it) |
|---|---|---|---|
| One Among the Masses | 14 |  0.01 |  |
| Mystic Life Force | 20 |  0.01 |  |
| Deathless Servant | 18 |  0.01 |  |
| One Among the Masses | 14 |  0.01 |  |
| Mystic Life Force | 20 |  0.01 |  |
| Deathless Servant | 18 |  0.01 |  |

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
