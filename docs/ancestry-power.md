# Ancestries, heritages and backgrounds in combat

Made by `node tools/ancestry-power.mjs <out> run` and `report` on 2026-11-02, the feat ratings' method: whole fights with it and without it, on the same dice (100 fights an encounter for each PC and level), against a moderate boss and a moderate group on the square grid, the gap in **levels of the foes** (+0.25: like fighting foes a quarter of a level lower).

- **Ancestry**: on one PC of the standard party at a time (fighter, rogue, wizard, cleric), at levels 1, 5, 11, 17, against that PC as a human (8 Hit Points, 25 feet, Medium, no special senses): its Hit Points, Speed, size, vision and its features' PF2e rules. Its ability boosts aren't counted (the party's scores are a class's usual ones, which free boosts reach). The fights here are in bright light, so darkvision and low-light vision don't show.
- **Heritage**: on top of its ancestry (a versatile heritage on a human), at levels 1 and 11 on each PC, against the ancestry alone on the same dice: its PF2e rules, always on.
- **Background**: the skill feat it grants (where the simulator plays it, on the PC the feat ratings put it on; Battle Medicine on the fighter), its own rules, and the combat skills it trains (Athletics, Intimidation, Deception, Acrobatics, Medicine) on a PC without them, against the party without them. Backgrounds that come to the same thing share one set of fights.

## Ancestries with their ancestry feats

Each ancestry on each PC and level again, now with the best of its ancestry feats in its slots (1st, 5th, 9th, 13th and 17th level): the feats with the best feat ratings (docs/feat-power.md) that the PC plays, a slot at a time, ranked by the feat ratings and left out where they'd need another weapon or rate at 0 or worse. Their prerequisites (a heritage, another feat) aren't checked. Where the PC plays none of its feats, the ancestry's own rating stands. Against the same human without feats as below.

| # | Ancestry | With feats | Ancestry alone | Feats add | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Feats it plays | Verdict |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | Orc | +0.04 ± 0.01 | +0.01 | +0.03 | +0.03 | +0.01 | +0.10 | +0.01 | +0.06 | +0.02 | +0.04 | +0.01 | Orc Ferocity, Iron Fists | minor |
| 2 | Minotaur | +0.02 ± 0.01 | +0.02 | 0.00 | +0.07 | +0.04 | 0.00 | −0.01 | +0.10 | −0.01 | +0.01 | −0.01 | Goring Charge | no clear effect |
| 3 | Jotunborn | +0.02 ± 0.01 | +0.02 | 0.00 | +0.06 | +0.05 | −0.03 | 0.00 | +0.10 | −0.01 | 0.00 | −0.01 | Jotun's Heart | no clear effect |
| 4 | Automaton | +0.01 ± 0.01 | 0.00 | +0.01 | +0.01 | +0.02 | +0.03 | −0.01 | +0.01 | +0.01 | +0.05 | −0.02 | Automaton Armament, Hardened Chassis, Rain of Bolts, Enlarged Chassis | no clear effect |
| 5 | Catfolk | +0.01 ± 0.00 | 0.00 | +0.01 | +0.02 | +0.01 | +0.01 | +0.02 | 0.00 | 0.00 | 0.00 | +0.05 | Caterwaul | no clear effect |
| 6 | Hobgoblin | +0.01 ± 0.00 | 0.00 | +0.01 | +0.02 | +0.01 | 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | +0.04 | Can't Fall Here | no clear effect |
| 7 | Bugbear | +0.01 ± 0.01 | +0.01 | 0.00 | +0.02 | −0.01 | +0.01 | +0.01 | +0.04 | −0.01 | +0.01 | −0.01 | Icy Influence | no clear effect |
| 8 | Dwarf | +0.01 ± 0.01 | 0.00 | +0.01 | −0.01 | +0.03 | +0.01 | 0.00 | +0.01 | −0.02 | +0.04 | +0.01 | Blast Resistance, Mountain's Stoutness | no clear effect |
| 9 | Fleshwarp | +0.01 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | +0.03 | 0.00 | +0.01 | −0.01 | Living Weapon | no clear effect |
| 10 | Tanuki | +0.01 ± 0.01 | +0.01 | 0.00 | 0.00 | +0.01 | +0.02 | 0.00 | +0.03 | 0.00 | +0.01 | 0.00 | Ponpoko-Pon! | no clear effect |
| 11 | Athamaru | +0.01 ± 0.01 | −0.01 | +0.02 | −0.05 | +0.03 | +0.04 | 0.00 | +0.01 | −0.01 | +0.04 | −0.01 | Emit Defensive Odor | no clear effect |
| 12 | Sarangay | +0.01 ± 0.01 | 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | Convocation of Earth and Moon | no clear effect |
| 13 | Shisk | +0.01 ± 0.01 | 0.00 | +0.01 | 0.00 | +0.04 | +0.01 | −0.03 | 0.00 | 0.00 | +0.07 | −0.04 | Bristle, Quill Spray, Inured to the Heat | no clear effect |
| 14 | Conrasu | 0.00 ± 0.01 | +0.01 | 0.00 | 0.00 | 0.00 | +0.04 | −0.02 | +0.04 | 0.00 | +0.02 | −0.04 | Ceremony of Protection, Ceremony of the Evened Hand | no clear effect |
| 15 | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | +0.01 | First World Adept | no clear effect |
| 16 | Lizardfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | Scion Transformation | no clear effect |
| 17 | Nagaji | 0.00 ± 0.01 | +0.01 | 0.00 | 0.00 | 0.00 | +0.01 | −0.01 | +0.03 | 0.00 | +0.01 | −0.02 | Pit of Snakes, Breath of Calamity | no clear effect |
| 18 | Anadi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 19 | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 20 | Vishkanya | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | Viper Strike | no clear effect |
| 21 | Yaoguai | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | Morphic Strike | no clear effect |
| 22 | Android | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 23 | Fetchling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 24 | Ghoran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 25 | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | Dragon Prince | no clear effect |
| 26 | Kashrishi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 27 | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 28 | Samsaran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 29 | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 30 | Wayang | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 31 | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 32 | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | Retractable Claws, Fox Possession | no clear effect |
| 33 | Tripkee | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | 0.00 | Envenomed Edge | no clear effect |
| 34 | Halfling | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | none | no clear effect |
| 35 | Poppet | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | +0.01 | −0.01 | −0.01 | −0.01 | Made for Combat, Awaken the Obake | no clear effect |
| 36 | Ratfolk | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | none | no clear effect |
| 37 | Shoony | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | none | no clear effect |
| 38 | Vanara | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | none | no clear effect |
| 39 | Kobold | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.01 | −0.01 | 0.00 | 0.00 | −0.02 | +0.01 | −0.02 | Benefactor's Strike, Fleeing Shriek, Elite Dracomancer | no clear effect |
| 40 | Strix | −0.01 ± 0.01 | 0.00 | −0.01 | 0.00 | +0.01 | −0.02 | −0.02 | 0.00 | 0.00 | +0.03 | −0.06 | Fully Flighted | no clear effect |
| 41 | Centaur | −0.01 ± 0.01 | −0.01 | 0.00 | +0.03 | +0.02 | −0.05 | −0.04 | +0.01 | −0.01 | +0.01 | −0.04 | none | no clear effect |
| 42 | Goloma | −0.01 ± 0.00 | −0.01 | 0.00 | −0.01 | −0.01 | −0.01 | −0.02 | 0.00 | 0.00 | −0.02 | −0.03 | Constant Gaze | no clear effect |
| 43 | Tengu | −0.01 ± 0.01 | 0.00 | −0.01 | −0.02 | +0.01 | −0.02 | −0.02 | +0.01 | −0.01 | +0.02 | −0.07 | Mariner's Fire, Soaring Form | no clear effect |
| 44 | Azarketi | −0.01 ± 0.01 | −0.01 | 0.00 | −0.05 | 0.00 | +0.03 | −0.03 | −0.02 | −0.02 | +0.01 | −0.02 | Hydraulic Deflection, Underwater Volcano | no clear effect |
| 45 | Goblin | −0.01 ± 0.01 | 0.00 | −0.01 | −0.03 | −0.02 | 0.00 | 0.00 | +0.02 | −0.01 | +0.01 | −0.08 | Burn It!, Dokkaebi Fire, Flames of Vision | no clear effect |
| 46 | Elf | −0.01 ± 0.01 | −0.01 | 0.00 | −0.02 | −0.02 | −0.01 | −0.01 | 0.00 | −0.01 | −0.03 | −0.03 | Elemental Wrath, Demon Slayer | no clear effect |
| 47 | Merfolk | −0.01 ± 0.01 | −0.02 | +0.01 | −0.11 | +0.01 | +0.05 | 0.00 | +0.02 | −0.04 | −0.01 | −0.04 | Pummeling Whirlpool, Kraken's Call | no clear effect |
| 48 | Skeleton | −0.02 ± 0.01 | −0.03 | 0.00 | −0.04 | +0.01 | −0.04 | −0.01 | −0.02 | −0.02 | −0.02 | −0.04 | Necromantic Heir | no clear effect |
| 49 | Dragonet | −0.03 ± 0.01 | −0.01 | −0.02 | −0.05 | 0.00 | −0.03 | −0.04 | −0.03 | −0.02 | +0.01 | −0.07 | My Claws are Daggers, Dragonet Breath, Into the Sky | no clear effect |
| 50 | Awakened Animal | −0.03 ± 0.01 | −0.03 | 0.00 | −0.12 | −0.02 | +0.01 | 0.00 | 0.00 | −0.04 | −0.02 | −0.07 | none | slightly worse |
| 51 | Sprite | −0.03 ± 0.01 | −0.02 | −0.01 | −0.06 | 0.00 | −0.04 | −0.03 | −0.04 | −0.02 | 0.00 | −0.06 | Hero's Wings, Fey Skin | slightly worse |

## Ancestries

| # | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | Minotaur | +0.02 ± 0.01 | +0.05 | +0.04 | 0.00 | −0.01 | +0.10 | −0.01 | 0.00 | 0.00 | no clear effect |
| 2 | Jotunborn | +0.02 ± 0.01 | +0.05 | +0.04 | 0.00 | −0.01 | +0.10 | −0.01 | 0.00 | 0.00 | no clear effect |
| 3 | Bugbear | +0.01 ± 0.00 | +0.01 | 0.00 | +0.02 | 0.00 | +0.03 | 0.00 | +0.01 | 0.00 | no clear effect |
| 4 | Fleshwarp | +0.01 ± 0.00 | +0.01 | 0.00 | +0.02 | 0.00 | +0.03 | 0.00 | +0.01 | 0.00 | no clear effect |
| 5 | Orc | +0.01 ± 0.00 | +0.01 | 0.00 | +0.02 | 0.00 | +0.03 | 0.00 | +0.01 | 0.00 | no clear effect |
| 6 | Tanuki | +0.01 ± 0.00 | +0.01 | 0.00 | +0.02 | 0.00 | +0.03 | 0.00 | +0.01 | 0.00 | no clear effect |
| 7 | Conrasu | +0.01 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | +0.03 | 0.00 | +0.01 | −0.01 | no clear effect |
| 8 | Nagaji | +0.01 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | +0.03 | 0.00 | +0.01 | −0.01 | no clear effect |
| 9 | Anadi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 10 | Automaton | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 11 | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 12 | Lizardfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 13 | Sarangay | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 14 | Android | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 15 | Catfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 16 | Fetchling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 17 | Ghoran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 18 | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 19 | Hobgoblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 20 | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 21 | Kashrishi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 22 | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 23 | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 24 | Samsaran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Shisk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Strix | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Vishkanya | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Wayang | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Yaoguai | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Dwarf | 0.00 ± 0.01 | −0.02 | +0.01 | +0.01 | −0.01 | +0.01 | −0.02 | +0.01 | +0.01 | no clear effect |
| 33 | Poppet | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | 0.00 | no clear effect |
| 34 | Goblin | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 35 | Halfling | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 36 | Kobold | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 37 | Ratfolk | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 38 | Shoony | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 39 | Tengu | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | +0.01 | −0.01 | −0.01 | −0.01 | no clear effect |
| 40 | Tripkee | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 41 | Vanara | 0.00 ± 0.01 | −0.02 | 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | 0.00 | −0.01 | no clear effect |
| 42 | Goloma | −0.01 ± 0.00 | −0.01 | 0.00 | 0.00 | −0.02 | 0.00 | 0.00 | −0.02 | −0.01 | no clear effect |
| 43 | Centaur | −0.01 ± 0.01 | +0.03 | +0.02 | −0.05 | −0.04 | +0.01 | −0.01 | +0.01 | −0.04 | no clear effect |
| 44 | Dragonet | −0.01 ± 0.01 | −0.04 | +0.01 | −0.01 | −0.01 | −0.03 | −0.02 | 0.00 | 0.00 | no clear effect |
| 45 | Athamaru | −0.01 ± 0.01 | −0.04 | +0.01 | −0.01 | −0.01 | −0.03 | −0.02 | 0.00 | 0.00 | no clear effect |
| 46 | Azarketi | −0.01 ± 0.01 | −0.04 | +0.01 | −0.01 | −0.01 | −0.03 | −0.02 | 0.00 | 0.00 | no clear effect |
| 47 | Elf | −0.01 ± 0.01 | −0.02 | 0.00 | −0.01 | −0.01 | 0.00 | −0.01 | −0.02 | −0.02 | no clear effect |
| 48 | Sprite | −0.02 ± 0.01 | −0.05 | 0.00 | −0.01 | −0.01 | −0.04 | −0.02 | −0.01 | 0.00 | no clear effect |
| 49 | Merfolk | −0.02 ± 0.01 | −0.12 | −0.01 | +0.04 | 0.00 | +0.02 | −0.04 | −0.01 | −0.06 | no clear effect |
| 50 | Skeleton | −0.03 ± 0.01 | −0.04 | −0.01 | −0.05 | −0.01 | −0.02 | −0.02 | −0.02 | −0.05 | no clear effect |
| 51 | Awakened Animal | −0.03 ± 0.01 | −0.12 | −0.02 | +0.01 | 0.00 | 0.00 | −0.04 | −0.02 | −0.07 | slightly worse |

## Heritages

Rated: 104; 230 change nothing a fight here plays (situational bonuses, senses in the light, out-of-combat uses).

| # | Heritage | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Verdict |
|---:|---|---|---:|---:|---:|---:|---:|---|
| 1 | Battle-Trained Human (BB) | Human | +0.02 ± 0.01 | +0.03 | +0.03 | −0.01 | +0.02 | no clear effect |
| 2 | Breaker Surki | Human | +0.01 ± 0.01 | +0.03 | −0.01 | 0.00 | +0.01 | no clear effect |
| 3 | Cactus Leshy | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 4 | Earthly Wilds Kitsune | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 5 | Ironhoof Centaur | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 6 | Lahkgyan Vanara | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 7 | Monstrous Skeleton | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 8 | Predator Strix | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 9 | Razortooth Goblin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 10 | Sacred Nagaji | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 11 | Strongjaw Kobold | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 12 | Taloned Tengu | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 13 | Xyloshi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 14 | Clawed Catfolk | Human | 0.00 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | no clear effect |
| 15 | Quilled Athamaru | Human | 0.00 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | no clear effect |
| 16 | Vicious Goloma | Human | 0.00 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | no clear effect |
| 17 | Warrior Automaton | Human | 0.00 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | no clear effect |
| 18 | Warrior Jotunborn | Human | 0.00 ± 0.00 | +0.01 | 0.00 | +0.01 | 0.00 | no clear effect |
| 19 | Ponygait Centaur | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 20 | Abyssal Merfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 21 | Aiuvarin | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 22 | Ancient Scale Azarketi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 23 | Arctic Elf | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 24 | Ardande | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Ascetic Tanuki | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Beastkin | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Benthic Athamaru | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Benthic Azarketi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Bloodhound Shoony | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Carcharodon Merfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Cave Kholo | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Cavern Elf | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 33 | Changeling | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 34 | Charhide Goblin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 35 | Chrysanthemum Leshy | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 36 | Created Fleshwarp | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 37 | Deep Fetchling | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 38 | Deep Rat | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 39 | Deny the Firstborn Pursuit | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 40 | Deny the Traitor's Rebirth | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 41 | Desert Elf | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 42 | Dhampir | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 43 | Dokkaebi Goblin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 44 | Dromaar | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 45 | Duskwalker | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 46 | Elementheart Kobold | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 47 | Elytron Surki | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 48 | Even-Tempered Tanuki | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 49 | Farsight Goloma | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 50 | Forge Dwarf | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 51 | Frozen Wind Kitsune | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 52 | Fungus Leshy | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 53 | Ghost Poppet | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 54 | Glacier Cavern Minotaur | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 55 | Grave Orc | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 56 | Hooded Nagaji | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 57 | Hopeful Athamaru | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 58 | Hungerseed | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 59 | Hunting Catfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 60 | Inured Azarketi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 61 | Koblak Bugbear | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 62 | Lantern Surki | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 63 | Longsnout Rat | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 64 | Luminous Sprite | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 65 | Mountaineer Samsaran | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 66 | Naari | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 67 | Nephilim | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 68 | Nightglider Strix | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 69 | Oread | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 70 | Rainfall Orc | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 71 | Reef Merfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 72 | Sandstrider Lizardfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 73 | Sensate Gnome | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 74 | Sewer Rat | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 75 | Shapewrought Fleshwarp | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 76 | Shimmertongue Nagaji | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 77 | Smokeworker Hobgoblin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 78 | Snow Goblin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 79 | Snow Rat | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 80 | Spined Azarketi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 81 | Stormtossed Tengu | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 82 | Strong-Blooded Dwarf | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 83 | Suli | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 84 | Sylph | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 85 | Tactile Azarketi | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 86 | Thickcoat Shoony | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 87 | Thickskin Tripkee | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 88 | Twilight Halfling | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 89 | Umbral Gnome | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 90 | Venom-Resistant Vishkanya | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 91 | Venomshield Nagaji | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 92 | Virtuous Tanuki | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 93 | Vivacious Gnome | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 94 | Wajaghand Vanara | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 95 | Wikkawak Bugbear | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 96 | Winter Catfolk | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 97 | Winter Kholo | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 98 | Wintertouched Human | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 99 | Talos | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 100 | Fleetwind Centaur | Human | −0.01 ± 0.01 | −0.01 | 0.00 | 0.00 | −0.02 | no clear effect |
| 101 | Mistbreath Azarketi | Human | −0.01 ± 0.01 | −0.01 | 0.00 | 0.00 | −0.02 | no clear effect |
| 102 | Shadow of the Wanderer | Human | −0.01 ± 0.01 | −0.01 | 0.00 | 0.00 | −0.02 | no clear effect |
| 103 | Spindly Anadi | Human | −0.01 ± 0.01 | −0.01 | 0.00 | 0.00 | −0.02 | no clear effect |
| 104 | Seaweed Leshy | Human | −0.02 ± 0.01 | −0.05 | 0.00 | 0.00 | −0.01 | no clear effect |

## Backgrounds

Rated: 92; 448 give nothing a fight here plays (skills used outside combat, Lore, skill feats the simulator doesn't play).

| # | Background | What it adds | On | Rating | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |
|---:|---|---|---|---:|---:|---:|---:|---:|---|
| 1 | Saved by Clockwork | its rules | fighter | +0.03 ± 0.02 | +0.01 | +0.04 | +0.03 | +0.04 | no clear effect |
| 2 | Acrobat | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 3 | Aerialist | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 4 | Awful Scab | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 5 | Back-Alley Doctor | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 6 | Barber | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 7 | Bright Lion | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 8 | Charlatan | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 9 | Child of the Puddles | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 10 | Circuit Judge | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 11 | Company Agent | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 12 | Corpse Stitcher | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 13 | Curandero | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 14 | Curse-Marked | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 15 | Deckhand | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 16 | Driver | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 17 | Eldritch Anatomist | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 18 | Energy Scarred | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 19 | Feral Child | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 20 | Fey Friend | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 21 | Final Blade Survivor | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 22 | Fire Warden | Breath Control | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 23 | Fleshwarp Researcher | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 24 | Friend of a Friend | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Gambler | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Insurgent | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Issian Partisan | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Medicinal Clocksmith | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Party Scholar | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Perfection Seeker | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Plague Doctor | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Quick | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 33 | Ruin Delver | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 34 | Savior of Air | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 35 | Second Chance Champion | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 36 | Shadow Lodge Defector | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 37 | Sideshow Scion | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 38 | Sky Rider | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 39 | Snubbed Out Stoolie | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 40 | Trusted Rival | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 41 | Truth Seeker | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 42 | Undercover Contender | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 43 | Undercover Lotus Guard | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 44 | Undertaker | trained medicine | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 45 | Unremarkable | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 46 | Wandering Libertine | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 47 | Ambitious Knave | Dirty Trick | rogue | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 48 | Town Troublemaker | Dirty Trick | rogue | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 49 | War Orphan | Dirty Trick | rogue | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 50 | Anti-Tech Activist | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 51 | Aspiring Free-Captain | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 52 | Bandit | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 53 | Barker | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 54 | Belkzen Slayer | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 55 | Bully or Baiter? | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 56 | Demon Hunted | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 57 | Dragon Scholar | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 58 | Empty Hand Loyalist | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 59 | Finadar Leshy | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 60 | Former Aspis Agent | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 61 | Guard | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 62 | Hardened Criminal | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 63 | Hellknight Deserter | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 64 | Legendary Parents | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 65 | Local Brigand | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 66 | Lost and Alone | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 67 | Moot Guard | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 68 | Night Watch | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 69 | Once Possessed | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 70 | Quartermaster | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 71 | Razmiran Faithful | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 72 | Reclaimed | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 73 | Scarnetti-Connected | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 74 | Shadow Haunted | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 75 | Sheriff | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 76 | Tax Collector | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 77 | Thuvian Unifier | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 78 | Total Power | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 79 | Ulfen Raider | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 80 | Warrior | trained intimidation | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | −0.01 | no clear effect |
| 81 | Acupuncturist | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 82 | Breachill Survivor | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 83 | Cathedral Child | Battle Medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 84 | Envoy's Alliance | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 85 | Field Medic | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 86 | Lastwall Survivor | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 87 | Once Bitten | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 88 | Sarkorian Reclaimer | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 89 | School Medic | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 90 | Secular Medic | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 91 | Supportive Sponsor | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
| 92 | Tech-Reliant | Battle Medicine, trained medicine | fighter | −0.02 ± 0.01 | −0.01 | 0.00 | −0.03 | −0.05 | no clear effect |
