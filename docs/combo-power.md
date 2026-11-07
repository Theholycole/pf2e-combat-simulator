# Feat combos in combat

Made by `node tools/combo-power.mjs <out> find|run|report` on 2026-11-07. Two feats the simulator plays, on the same PC, where one sets up what the other uses (a condition one puts on a foe and the other needs or does more against; a feat built on another), and each PC's strongest feats two by two. Each pair at the higher of the two feats' levels: the first alone, the second alone, and both, each in whole fights against the plain party on the same dice (the feat ratings' method, in levels of the foes).

**Synergy** is both together minus each alone: above 0, they're worth more together than apart; below 0, they overlap or compete for the PC's actions.

| # | Feats | PC, level | Together | First alone | Second alone | Synergy | Verdict | Why paired |
|---:|---|---|---:|---:|---:|---:|---|---|
| 1 | Thundering Surge + Spinning Stand | wizard, 16 | +0.29 | +0.35 | −0.28 | +0.22 ± 0.10 | combo | Thundering Surge makes the foe prone, which Spinning Stand uses |
| 2 | Pin to the Spot + Accursed Magic | fighter, 14 | +0.63 | +0.64 | −0.14 | +0.12 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 3 | Thundering Surge + Reverberating Spell | wizard, 16 | +0.32 | +0.35 | −0.14 | +0.11 ± 0.11 | no clear combo | two of the wizard's strongest feats |
| 4 | Scare to Death + Elemental Burst | fighter, 15 | +0.52 | +0.47 | +0.02 | +0.03 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 5 | Pin to the Spot + Goblin Jubilee | fighter, 14 | +0.64 | +0.64 | −0.02 | +0.02 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 6 | Tumbling Lumber + Rock The Boat | fighter, 8 | −0.10 | −0.35 | +0.24 | +0.02 ± 0.10 | no clear combo | Tumbling Lumber makes the foe prone, which Rock The Boat uses |
| 7 | Pin to the Spot + Elemental Burst | fighter, 14 | +0.65 | +0.64 | −0.01 | +0.01 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 8 | Spirit Sanctification + Reverberating Spell | wizard, 10 | +0.06 | −0.03 | +0.07 | +0.01 ± 0.08 | no clear combo | two of the wizard's strongest feats |
| 9 | Infinite Expanse of Bluest Heaven + Vital Shot | kineticist, 18 | +0.15 | +0.24 | −0.09 | 0.00 ± 0.15 | no clear combo | Infinite Expanse of Bluest Heaven makes the foe off-guard, which Vital Shot uses |
| 10 | Devastating Duelist + Think Twice | fighter, 18 | +0.14 | +0.13 | +0.01 | 0.00 ± 0.05 | no clear combo | Devastating Duelist makes the foe frightened, which Think Twice uses |
| 11 | Devastating Duelist + Lethal Edge | fighter, 18 | +0.20 | +0.13 | +0.07 | 0.00 ± 0.06 | no clear combo | Devastating Duelist makes the foe frightened, which Lethal Edge uses |
| 12 | Opportune Backstab + Gang Up | rogue, 8 | +0.38 | +0.23 | +0.16 | −0.01 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 13 | Opportune Backstab + Mythic Containment | rogue, 10 | +0.26 | +0.21 | +0.07 | −0.02 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 14 | Opportune Backstab + Master Strike | rogue, 8 | +0.47 | +0.23 | +0.26 | −0.02 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 15 | Furious Grab + Fumigate | barbarian, 14 | +0.20 | +0.15 | +0.08 | −0.03 ± 0.15 | no clear combo | Furious Grab makes the foe grabbed, which Fumigate uses |
| 16 | Gang Up + Improved Poison Weapon | rogue, 8 | +0.20 | +0.16 | +0.07 | −0.03 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 17 | Song of Grace and Speed + Goblin Jubilee | fighter, 16 | +0.45 | +0.46 | +0.03 | −0.04 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 18 | Gang Up + Do You Know Who I Am? | rogue, 12 | +0.27 | +0.22 | +0.09 | −0.05 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 19 | Ring Their Bell + Vital Shot | guardian, 6 | −0.17 | +0.13 | −0.25 | −0.05 ± 0.12 | no clear combo | Ring Their Bell makes the foe off-guard, which Vital Shot uses; Vital Shot makes the foe off-guard, which Ring Their Bell uses |
| 20 | Accursed Magic + Elemental Burst | fighter, 8 | +0.26 | +0.27 | +0.05 | −0.05 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 21 | Gang Up + Bloody Debilitation | rogue, 12 | +0.26 | +0.22 | +0.09 | −0.05 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 22 | Improved Poison Weapon + Mythic Containment | rogue, 10 | +0.02 | +0.01 | +0.07 | −0.06 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 23 | Scare to Death + Goblin Jubilee | fighter, 15 | +0.42 | +0.47 | 0.00 | −0.06 ± 0.08 | no clear combo | two of the fighter's strongest feats |
| 24 | Spirit Sanctification + Faith in the Fallen | wizard, 16 | +0.06 | +0.06 | +0.06 | −0.06 ± 0.11 | no clear combo | two of the wizard's strongest feats |
| 25 | Celestial Armaments + Goblin Jubilee | fighter, 16 | +0.24 | +0.27 | +0.03 | −0.06 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 26 | Master Strike + Improved Poison Weapon | rogue, 8 | +0.27 | +0.26 | +0.07 | −0.07 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 27 | Tumbling Lumber + Spinning Stand | kineticist, 6 | +0.18 | +0.13 | +0.12 | −0.07 ± 0.15 | no clear combo | Tumbling Lumber makes the foe prone, which Spinning Stand uses |
| 28 | Blazing Wave + Spinning Stand | kineticist, 6 | +0.19 | +0.14 | +0.12 | −0.07 ± 0.15 | no clear combo | Blazing Wave makes the foe prone, which Spinning Stand uses |
| 29 | Thundering Surge + Marked for Rebuke | wizard, 18 | +0.50 | +0.34 | +0.23 | −0.07 ± 0.09 | no clear combo | two of the wizard's strongest feats |
| 30 | Gang Up + Master Strike | rogue, 6 | +0.19 | +0.11 | +0.15 | −0.07 ± 0.06 | no clear combo | two of the rogue's strongest feats |
| 31 | Opportune Backstab + Improved Poison Weapon | rogue, 8 | +0.23 | +0.23 | +0.07 | −0.07 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 32 | Master Strike + Mythic Containment | rogue, 10 | +0.15 | +0.15 | +0.07 | −0.07 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 33 | Do You Know Who I Am? + Mythic Containment | rogue, 12 | +0.24 | +0.09 | +0.22 | −0.07 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 34 | Accursed Magic + Goblin Jubilee | fighter, 8 | +0.24 | +0.27 | +0.05 | −0.07 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 35 | Witchwood Seed + Slip the Grasp | kineticist, 12 | +0.37 | +0.41 | +0.04 | −0.08 ± 0.18 | no clear combo | Witchwood Seed makes the foe immobilized, which Slip the Grasp uses |
| 36 | Master Strike + Bloody Debilitation | rogue, 12 | +0.30 | +0.29 | +0.09 | −0.08 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 37 | Celestial Armaments + Accursed Magic | fighter, 16 | +0.08 | +0.27 | −0.10 | −0.08 ± 0.11 | no clear combo | two of the fighter's strongest feats |
| 38 | Scare to Death + Celestial Armaments | fighter, 16 | +0.72 | +0.54 | +0.27 | −0.08 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 39 | Do You Know Who I Am? + Bloody Debilitation | rogue, 12 | +0.10 | +0.09 | +0.09 | −0.08 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 40 | Hell of 1,000,000 Needles + Vital Shot | kineticist, 18 | −0.10 | +0.07 | −0.09 | −0.09 ± 0.15 | no clear combo | Hell of 1,000,000 Needles makes the foe off-guard, which Vital Shot uses |
| 41 | Do You Know Who I Am? + Improved Poison Weapon | rogue, 12 | 0.00 | +0.09 | 0.00 | −0.09 ± 0.11 | no clear combo | two of the rogue's strongest feats |
| 42 | Song of Grace and Speed + Fiend Slayer | fighter, 16 | +0.64 | +0.46 | +0.28 | −0.09 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 43 | Fiend Slayer + Celestial Armaments | fighter, 16 | +0.45 | +0.28 | +0.27 | −0.09 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 44 | Spring from the Shadows + Master Strike | rogue, 12 | +0.36 | +0.17 | +0.29 | −0.10 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 45 | Bloody Debilitation + Improved Poison Weapon | rogue, 12 | −0.02 | +0.09 | 0.00 | −0.10 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 46 | Spring from the Shadows + Improved Poison Weapon | rogue, 12 | +0.06 | +0.17 | 0.00 | −0.11 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 47 | Fiend Slayer + Goblin Jubilee | fighter, 16 | +0.20 | +0.28 | +0.03 | −0.11 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 48 | Song of Grace and Speed + Celestial Armaments | fighter, 16 | +0.62 | +0.46 | +0.27 | −0.11 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 49 | Celestial Armaments + Elemental Burst | fighter, 16 | +0.26 | +0.27 | +0.11 | −0.11 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 50 | Marked for Rebuke + Reverberating Spell | wizard, 18 | +0.18 | +0.23 | +0.05 | −0.11 ± 0.10 | no clear combo | two of the wizard's strongest feats |
| 51 | Gang Up + Mythic Containment | rogue, 10 | +0.12 | +0.16 | +0.07 | −0.11 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 52 | Furious Grab + Death Roll | barbarian, 12 | +0.47 | +0.26 | +0.32 | −0.12 ± 0.14 | no clear combo | Furious Grab makes the foe grabbed, which Death Roll uses |
| 53 | Death Roll + Topple The Titans | fighter, 6 | +0.20 | +0.19 | +0.13 | −0.12 ± 0.06 | no clear combo | Death Roll makes the foe prone, which Topple The Titans uses |
| 54 | Master Strike + Do You Know Who I Am? | rogue, 12 | +0.27 | +0.29 | +0.09 | −0.12 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 55 | Thundering Surge + Spirit Sanctification | wizard, 16 | +0.30 | +0.35 | +0.06 | −0.12 ± 0.10 | no clear combo | two of the wizard's strongest feats |
| 56 | Thundering Surge + Faith in the Fallen | wizard, 16 | +0.30 | +0.35 | +0.06 | −0.12 ± 0.10 | no clear combo | two of the wizard's strongest feats |
| 57 | Opportune Backstab + Spring from the Shadows | rogue, 12 | +0.29 | +0.25 | +0.17 | −0.13 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 58 | Scare to Death + Accursed Magic | fighter, 15 | +0.27 | +0.47 | −0.06 | −0.14 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 59 | Infinite Expanse of Bluest Heaven + Master Strike | rogue, 18 | +0.36 | +0.16 | +0.34 | −0.14 ± 0.10 | no clear combo | Infinite Expanse of Bluest Heaven makes the foe off-guard, which Master Strike uses |
| 60 | Song of Grace and Speed + Accursed Magic | fighter, 16 | +0.21 | +0.46 | −0.10 | −0.14 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 61 | Bloody Debilitation + Mythic Containment | rogue, 12 | +0.17 | +0.09 | +0.22 | −0.14 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 62 | Fiend Slayer + Elemental Burst | fighter, 16 | +0.23 | +0.28 | +0.11 | −0.15 ± 0.09 | no clear combo | two of the fighter's strongest feats |
| 63 | Blazing Wave + Rock The Boat | fighter, 8 | +0.10 | +0.02 | +0.24 | −0.15 ± 0.09 | no clear combo | Blazing Wave makes the foe prone, which Rock The Boat uses |
| 64 | Fumigate + Death Roll | fighter, 14 | +0.30 | +0.15 | +0.30 | −0.15 ± 0.08 | no clear combo | Fumigate makes the foe grabbed, which Death Roll uses |
| 65 | Spring from the Shadows + Gang Up | rogue, 12 | +0.24 | +0.17 | +0.22 | −0.16 ± 0.09 | no clear combo | two of the rogue's strongest feats |
| 66 | Scare to Death + Song of Grace and Speed | fighter, 16 | +0.84 | +0.54 | +0.46 | −0.16 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 67 | Spring from the Shadows + Do You Know Who I Am? | rogue, 12 | +0.10 | +0.17 | +0.09 | −0.16 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 68 | Opportune Backstab + Bloody Debilitation | rogue, 12 | +0.18 | +0.25 | +0.09 | −0.16 ± 0.08 | no clear combo | two of the rogue's strongest feats |
| 69 | Pin to the Spot + Celestial Armaments | fighter, 16 | +0.85 | +0.75 | +0.27 | −0.17 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 70 | Spring from the Shadows + Bloody Debilitation | rogue, 12 | +0.09 | +0.17 | +0.09 | −0.17 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 71 | Tumbling Lumber + Topple The Titans | kineticist, 4 | +0.54 | +0.27 | +0.44 | −0.17 ± 0.19 | no clear combo | Tumbling Lumber makes the foe prone, which Topple The Titans uses |
| 72 | Opportune Backstab + Do You Know Who I Am? | rogue, 12 | +0.17 | +0.25 | +0.09 | −0.17 ± 0.10 | no clear combo | two of the rogue's strongest feats |
| 73 | Fiend Slayer + Accursed Magic | fighter, 16 | −0.01 | +0.28 | −0.10 | −0.18 ± 0.11 | no clear combo | two of the fighter's strongest feats |
| 74 | Thundering Surge + Rock The Boat | fighter, 16 | +0.10 | +0.14 | +0.15 | −0.19 ± 0.10 | no clear combo | Thundering Surge makes the foe prone, which Rock The Boat uses |
| 75 | Scare to Death + Fiend Slayer | fighter, 16 | +0.62 | +0.54 | +0.28 | −0.20 ± 0.10 | no clear combo | two of the fighter's strongest feats |
| 76 | Pin to the Spot + Fiend Slayer | fighter, 16 | +0.81 | +0.75 | +0.28 | −0.22 ± 0.09 | get in each other's way | two of the fighter's strongest feats |
| 77 | Song of Grace and Speed + Elemental Burst | fighter, 16 | +0.34 | +0.46 | +0.11 | −0.23 ± 0.10 | get in each other's way | two of the fighter's strongest feats |
| 78 | Marked for Rebuke + Spirit Sanctification | wizard, 18 | +0.03 | +0.23 | +0.05 | −0.25 ± 0.10 | get in each other's way | two of the wizard's strongest feats |
| 79 | Marked for Rebuke + Faith in the Fallen | wizard, 18 | +0.03 | +0.23 | +0.05 | −0.25 ± 0.10 | get in each other's way | two of the wizard's strongest feats |
| 80 | Elemental Burst + Goblin Jubilee | fighter, 1 | +0.25 | +0.26 | +0.24 | −0.25 ± 0.08 | get in each other's way | two of the fighter's strongest feats |
| 81 | Pin to the Spot + Song of Grace and Speed | fighter, 16 | +0.93 | +0.75 | +0.46 | −0.28 ± 0.10 | get in each other's way | two of the fighter's strongest feats |
| 82 | Spring from the Shadows + Mythic Containment | rogue, 12 | +0.06 | +0.17 | +0.22 | −0.34 ± 0.10 | get in each other's way | two of the rogue's strongest feats |
| 83 | Blazing Wave + Topple The Titans | kineticist, 4 | +0.65 | +0.57 | +0.44 | −0.36 ± 0.18 | no clear combo | Blazing Wave makes the foe prone, which Topple The Titans uses |
| 84 | Pin to the Spot + Scare to Death | fighter, 15 | +0.68 | +0.61 | +0.47 | −0.40 ± 0.08 | get in each other's way | two of the fighter's strongest feats |

## Feat chains

The second feat builds on the first (its prerequisite, or a form or stance it's used in), so the second is never played without the first: what the chain is worth, and what the second adds on top of the first.

| # | First, then second | PC, level | First alone | Both | Second adds |
|---:|---|---|---:|---:|---:|
| 1 | Eldritch Archer Dedication → Fatal Shot | fighter, 18 | −0.83 | +0.05 | +0.88 ± 0.10 |
| 2 | Untamed Form → Monstrosity Shape | druid, 16 | −1.22 | −0.37 | +0.85 ± 0.15 |
| 3 | Thaumaturge Dedication → Basic Thaumaturgy | fighter, 4 | −0.40 | +0.10 | +0.50 ± 0.08 |
| 4 | Advanced Construct Companion → Incredible Construct Companion | inventor, 8 | +0.60 | +1.08 | +0.48 ± 0.10 |
| 5 | Battle-Tested Companion → Battle-Hardened Companion | commander, 10 | +0.36 | +0.72 | +0.36 ± 0.09 |
| 6 | Mammoth Lord Dedication → Specialized Megafauna Companion | fighter, 14 | +0.12 | +0.43 | +0.31 ± 0.09 |
| 7 | Spirit Companion → Specialized Spirit Companion | fighter, 14 | +0.13 | +0.45 | +0.31 ± 0.09 |
| 8 | Cavalier Dedication → Legendary Rider | fighter, 20 | +0.35 | +0.65 | +0.31 ± 0.09 |
| 9 | Sky and Heaven Stance → Cross the Final Horizon | monk, 20 | +0.19 | +0.50 | +0.30 ± 0.10 |
| 10 | Slam Down → Crashing Slam | fighter, 10 | −0.12 | +0.15 | +0.27 ± 0.06 |
| 11 | Cavalier Dedication → Unseat | fighter, 10 | +0.15 | +0.39 | +0.24 ± 0.07 |
| 12 | Battle-Hardened Companion → Peerless Mascot Companion | commander, 16 | +0.81 | +1.05 | +0.24 ± 0.11 |
| 13 | Hellbound Aspirant Dedication → Infernal Anguish | fighter, 8 | 0.00 | +0.24 | +0.24 ± 0.05 |
| 14 | Ulfen Guard Dedication → Protective Strike | fighter, 10 | +0.15 | +0.38 | +0.23 ± 0.07 |
| 15 | Animal Companion → Side by Side (Druid) | druid, 10 | +0.02 | +0.25 | +0.23 ± 0.07 |
| 16 | Mortal Herald Dedication → Glory on High | fighter, 18 | −0.09 | +0.13 | +0.22 ± 0.08 |
| 17 | Mature Trained Companion → Splendid Companion | fighter, 12 | +0.30 | +0.52 | +0.21 ± 0.09 |
| 18 | Haft Striker Stance → Haft Beatdown | fighter, 10 | −0.05 | +0.15 | +0.20 ± 0.06 |
| 19 | Incredible Mount → Specialized Mount | fighter, 14 | +0.23 | +0.43 | +0.20 ± 0.09 |
| 20 | Spellstrike → Shattering Spellstrike | magus, 4 | 0.00 | +0.20 | +0.20 ± 0.09 |
| 21 | Spellstrike → Supreme Spellstrike | magus, 20 | 0.00 | +0.16 | +0.16 ± 0.10 |
| 22 | Arcane Cascade → Burning Cascade | magus, 4 | +0.07 | +0.23 | +0.15 ± 0.10 |
| 23 | Incredible Beastmaster Companion → Specialized Beastmaster Companion | fighter, 14 | +0.30 | +0.45 | +0.15 ± 0.09 |
| 24 | Behold My Creation! → A Miracle of Science! | fighter, 14 | +0.30 | +0.45 | +0.15 ± 0.09 |
| 25 | Incredible Reanimated Companion → Paragon Reanimated Companion | fighter, 14 | +0.30 | +0.45 | +0.15 ± 0.09 |
| 26 | Wild Winds Initiate → Wild Winds Gust | monk, 14 | −0.19 | −0.04 | +0.15 ± 0.11 |
| 27 | Archfiend Dedication → Imprison Foe | fighter, 18 | 0.00 | +0.14 | +0.14 ± 0.05 |
| 28 | Swarmkeeper Dedication → Sportlebore Choke | fighter, 8 | −0.39 | −0.26 | +0.14 ± 0.09 |
| 29 | Wolf Stance → Wolf Drag | monk, 6 | +0.01 | +0.13 | +0.13 ± 0.09 |
| 30 | Martial Artist Dedication → Grievous Blow | fighter, 8 | 0.00 | +0.13 | +0.13 ± 0.05 |
| 31 | Animal Trainer Dedication → Mature Trained Companion | fighter, 6 | +0.16 | +0.27 | +0.10 ± 0.07 |
| 32 | Beastmaster Dedication → Nature's Precision | fighter, 6 | +0.16 | +0.27 | +0.10 ± 0.07 |
| 33 | Spirit Warrior Dedication → Sheltering Pulse | fighter, 8 | 0.00 | +0.10 | +0.10 ± 0.05 |
| 34 | Guardian's Intercept → Armored Resistance | fighter, 8 | +0.01 | +0.10 | +0.09 ± 0.04 |
| 35 | Distracting Shot → Greater Distracting Shot | ranger, 16 | +0.12 | +0.20 | +0.09 ± 0.10 |
| 36 | Beastmaster Dedication → Mature Beastmaster Companion | fighter, 4 | +0.07 | +0.16 | +0.09 ± 0.07 |
| 37 | Soaring Shape → Dragon Shape | druid, 12 | −0.42 | −0.35 | +0.07 ± 0.10 |
| 38 | Animal Companion → Mature Animal Companion (Ranger) | druid, 6 | +0.17 | +0.24 | +0.07 ± 0.07 |
| 39 | Faithful Steed → Loyal Warhorse | champion, 6 | +0.50 | +0.56 | +0.07 ± 0.08 |
| 40 | Let My Creature Live! → Behold My Creation! | fighter, 8 | +0.41 | +0.47 | +0.07 ± 0.08 |
| 41 | Mature Beastmaster Companion → Incredible Beastmaster Companion | fighter, 8 | +0.41 | +0.47 | +0.07 ± 0.08 |
| 42 | Advanced Reanimated Companion → Incredible Reanimated Companion | fighter, 8 | +0.41 | +0.47 | +0.07 ± 0.08 |
| 43 | Improved Poison Weapon → Deadly Poison Weapon | rogue, 12 | 0.00 | +0.05 | +0.06 ± 0.08 |
| 44 | Wyldsinger → Primal Guardian | fighter, 8 | +0.09 | +0.15 | +0.05 ± 0.07 |
| 45 | Orc Ferocity → Ferocious Beasts | fighter, 13 | +0.01 | +0.06 | +0.05 ± 0.04 |
| 46 | Animal Companion → Mature Animal Companion (Druid) | druid, 4 | +0.38 | +0.42 | +0.04 ± 0.08 |
| 47 | Drake Rider Dedication → Mature Dragon Companion | fighter, 4 | +0.17 | +0.20 | +0.03 ± 0.07 |
| 48 | Cavalier Dedication → Impressive Mount | fighter, 4 | +0.17 | +0.20 | +0.03 ± 0.07 |
| 49 | Mammoth Lord Dedication → Mature Megafauna Companion | fighter, 6 | +0.21 | +0.23 | +0.03 ± 0.07 |
| 50 | Living Nexus Dedication → Healing Nexus | fighter, 8 | +0.16 | +0.18 | +0.03 ± 0.07 |
| 51 | Gladiator Dedication → Gladiator's Roar | fighter, 12 | 0.00 | +0.02 | +0.02 ± 0.05 |
| 52 | Beastmaster Dedication → Pack Movement | fighter, 8 | +0.30 | +0.32 | +0.02 ± 0.08 |
| 53 | Dragon Shape → True Shapeshifter | druid, 20 | −0.59 | −0.59 | 0.00 ± 0.10 |
| 54 | Orc Ferocity → Rampaging Ferocity | fighter, 17 | 0.00 | 0.00 | 0.00 ± 0.00 |
| 55 | Commander's Companion → Battle-Tested Companion | commander, 6 | +0.57 | +0.53 | −0.04 ± 0.08 |
| 56 | Splendid Companion → Specialized Companion (Animal Trainer) | fighter, 18 | +0.41 | +0.35 | −0.06 ± 0.09 |
| 57 | Mammoth Lord Dedication → Mammoth Charge | fighter, 6 | +0.21 | +0.14 | −0.07 ± 0.07 |
| 58 | Loyal Warhorse → Imposing Destrier | champion, 10 | +0.60 | +0.53 | −0.08 ± 0.08 |
| 59 | Hulking Size → Towering Size | summoner, 12 | +0.18 | +0.10 | −0.08 ± 0.11 |
| 60 | Oracle Dedication → Basic Mysteries | fighter, 4 | −0.24 | −0.43 | −0.19 ± 0.07 |

Not tested: 6 pairs (the feat module reads nothing for it; its stance (Wolf Stance): its requirement, which the PC doesn't meet (You are unarmored); its requirement, which the PC doesn't meet (You are wearing medium or heavy armor, and your taunted enemy is Off-Guard because it didn't target you or include you in an area effect.)).
