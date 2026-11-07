# Ancestries, heritages and backgrounds in combat

Made by `node tools/ancestry-power.mjs <out> run` and `report` on 2026-11-07, the feat ratings' method: whole fights with it and without it, on the same dice (100 fights an encounter for each PC and level), against a moderate boss and a moderate group on the square grid, the gap in **levels of the foes** (+0.25: like fighting foes a quarter of a level lower).

- **Ancestry**: on one PC of the standard party at a time (fighter, rogue, wizard, cleric), at levels 1, 5, 11, 17, against that PC as a human (8 Hit Points, 25 feet, Medium, no special senses): its Hit Points, Speed, size, vision and its features' PF2e rules. Its ability boosts aren't counted (the party's scores are a class's usual ones, which free boosts reach). The fights here are in bright light, so darkvision and low-light vision don't show.
- **Heritage**: on top of its ancestry (a versatile heritage on a human), at levels 1 and 11 on each PC, against the ancestry alone on the same dice: its PF2e rules, always on.
- **Background**: the skill feat it grants (where the simulator plays it, on the PC the feat ratings put it on; Battle Medicine on the fighter), its own rules, and the combat skills it trains (Athletics, Intimidation, Deception, Acrobatics, Medicine) on a PC without them, against the party without them. Backgrounds that come to the same thing share one set of fights.

## Ancestries with their ancestry feats

Each ancestry on each PC and level again, now with the best of its ancestry feats in its slots (1st, 5th, 9th, 13th and 17th level): the feats with the best feat ratings (docs/feat-power.md) that the PC plays, a slot at a time, ranked by the feat ratings and left out where they'd need another weapon or rate at 0 or worse. Their prerequisites (a heritage, another feat) aren't checked. Where the PC plays none of its feats, the ancestry's own rating stands. Against the same human without feats as below.

| # | Ancestry | With feats | Ancestry alone | Feats add | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Feats it plays | Verdict |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | Catfolk | +0.10 ± 0.01 | 0.00 | +0.10 | +0.10 | +0.10 | +0.12 | +0.07 | +0.01 | +0.02 | +0.04 | +0.32 | Cat Nap, Caterwaul | minor |
| 2 | Jotunborn | +0.08 ± 0.01 | +0.07 | +0.01 | +0.13 | +0.08 | +0.07 | +0.05 | +0.13 | +0.03 | +0.07 | +0.11 | Jotun's Heart | minor |
| 3 | Minotaur | +0.07 ± 0.01 | +0.07 | 0.00 | +0.12 | +0.08 | +0.04 | +0.04 | +0.13 | +0.03 | +0.07 | +0.06 | none | minor |
| 4 | Automaton | +0.05 ± 0.01 | 0.00 | +0.04 | +0.03 | +0.03 | +0.09 | +0.04 | +0.02 | +0.03 | +0.07 | +0.06 | Automaton Armament, Hardened Chassis, Inscribed Blast, Enlarged Chassis, Arcane Locomotion | minor |
| 5 | Orc | +0.04 ± 0.01 | +0.02 | +0.03 | +0.05 | +0.01 | +0.10 | +0.02 | +0.07 | +0.03 | +0.05 | +0.02 | Orc Ferocity | minor |
| 6 | Centaur | +0.04 ± 0.01 | +0.04 | 0.00 | +0.09 | +0.06 | −0.01 | +0.02 | +0.05 | +0.02 | +0.07 | +0.03 | none | minor |
| 7 | Hobgoblin | +0.04 ± 0.01 | 0.00 | +0.04 | +0.03 | +0.03 | +0.07 | +0.03 | 0.00 | +0.02 | +0.05 | +0.08 | Formation Training, Can't Fall Here | minor |
| 8 | Nagaji | +0.03 ± 0.01 | +0.02 | +0.01 | +0.02 | +0.03 | +0.05 | +0.03 | +0.03 | +0.02 | +0.01 | +0.07 | Pit of Snakes | minor |
| 9 | Fleshwarp | +0.03 ± 0.01 | +0.02 | +0.01 | +0.03 | 0.00 | +0.06 | +0.03 | +0.03 | +0.01 | +0.05 | +0.03 | Gaping Flesh | minor |
| 10 | Sarangay | +0.03 ± 0.01 | 0.00 | +0.03 | +0.01 | +0.01 | +0.07 | +0.03 | 0.00 | +0.02 | +0.05 | +0.05 | Warding Jewel | minor |
| 11 | Bugbear | +0.02 ± 0.00 | +0.02 | 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | none | no clear effect |
| 12 | Conrasu | +0.02 ± 0.00 | +0.02 | 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.04 | +0.02 | +0.01 | 0.00 | none | no clear effect |
| 13 | Tanuki | +0.02 ± 0.00 | +0.02 | 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | none | no clear effect |
| 14 | Merfolk | +0.01 ± 0.01 | −0.01 | +0.02 | −0.11 | +0.05 | +0.08 | +0.04 | −0.03 | +0.03 | 0.00 | +0.05 | Ill Tide | no clear effect |
| 15 | Athamaru | +0.01 ± 0.01 | 0.00 | +0.01 | −0.03 | +0.05 | +0.01 | +0.01 | +0.01 | +0.01 | +0.01 | +0.01 | Sea Swarmer | no clear effect |
| 16 | Tripkee | +0.01 ± 0.01 | 0.00 | +0.01 | 0.00 | +0.01 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | +0.02 | Envenomed Edge | no clear effect |
| 17 | Dwarf | +0.01 ± 0.01 | +0.01 | 0.00 | −0.05 | +0.04 | +0.03 | +0.02 | +0.01 | +0.02 | 0.00 | +0.01 | none | no clear effect |
| 18 | Human | +0.01 ± 0.01 | 0.00 | +0.01 | +0.01 | +0.01 | +0.01 | 0.00 | 0.00 | 0.00 | 0.00 | +0.03 | Advanced General Training | no clear effect |
| 19 | Lizardfolk | +0.01 ± 0.00 | 0.00 | +0.01 | +0.01 | +0.01 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | +0.02 | Scion Transformation | no clear effect |
| 20 | Dragonet | 0.00 ± 0.01 | 0.00 | 0.00 | −0.03 | +0.03 | +0.01 | +0.01 | +0.01 | +0.01 | −0.01 | 0.00 | none | no clear effect |
| 21 | Goblin | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 22 | Halfling | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 23 | Kobold | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 24 | Ratfolk | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 25 | Shoony | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 26 | Tengu | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 27 | Vanara | 0.00 ± 0.01 | 0.00 | 0.00 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | none | no clear effect |
| 28 | Azarketi | 0.00 ± 0.01 | 0.00 | 0.00 | −0.04 | +0.03 | +0.01 | +0.01 | +0.01 | +0.01 | −0.01 | 0.00 | none | no clear effect |
| 29 | Anadi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 30 | Android | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 31 | Fetchling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 32 | Ghoran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 33 | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 34 | Kashrishi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 35 | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 36 | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 37 | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 38 | Samsaran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 39 | Shisk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 40 | Strix | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 41 | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 42 | Vishkanya | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 43 | Wayang | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 44 | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 45 | Yaoguai | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | none | no clear effect |
| 46 | Sprite | 0.00 ± 0.01 | 0.00 | 0.00 | −0.05 | +0.02 | +0.03 | 0.00 | −0.01 | +0.01 | +0.01 | −0.01 | none | no clear effect |
| 47 | Poppet | 0.00 ± 0.01 | 0.00 | −0.01 | −0.03 | −0.02 | +0.06 | −0.02 | −0.01 | +0.01 | +0.01 | −0.02 | Solidarity | no clear effect |
| 48 | Elf | 0.00 ± 0.01 | 0.00 | 0.00 | −0.03 | +0.01 | +0.01 | −0.01 | −0.01 | +0.01 | −0.01 | −0.01 | none | no clear effect |
| 49 | Goloma | −0.01 ± 0.00 | −0.01 | 0.00 | 0.00 | 0.00 | −0.01 | −0.01 | 0.00 | 0.00 | −0.03 | 0.00 | none | no clear effect |
| 50 | Awakened Animal | −0.01 ± 0.01 | −0.01 | 0.00 | −0.12 | +0.02 | +0.05 | +0.02 | −0.01 | +0.01 | −0.03 | +0.01 | none | no clear effect |
| 51 | Skeleton | −0.02 ± 0.01 | −0.02 | 0.00 | −0.03 | 0.00 | −0.04 | −0.01 | −0.03 | +0.01 | −0.03 | −0.03 | none | no clear effect |

## Ancestries

| # | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | Jotunborn | +0.07 ± 0.01 | +0.12 | +0.08 | +0.04 | +0.04 | +0.13 | +0.03 | +0.07 | +0.06 | minor |
| 2 | Minotaur | +0.07 ± 0.01 | +0.12 | +0.08 | +0.04 | +0.04 | +0.13 | +0.03 | +0.07 | +0.06 | minor |
| 3 | Centaur | +0.04 ± 0.01 | +0.09 | +0.06 | −0.01 | +0.02 | +0.05 | +0.02 | +0.07 | +0.03 | minor |
| 4 | Bugbear | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | no clear effect |
| 5 | Conrasu | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.04 | +0.02 | +0.01 | 0.00 | no clear effect |
| 6 | Fleshwarp | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | no clear effect |
| 7 | Nagaji | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | no clear effect |
| 8 | Orc | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | no clear effect |
| 9 | Tanuki | +0.02 ± 0.00 | +0.03 | +0.01 | +0.03 | +0.01 | +0.03 | +0.02 | +0.01 | +0.01 | no clear effect |
| 10 | Dwarf | +0.01 ± 0.01 | −0.05 | +0.04 | +0.03 | +0.02 | +0.01 | +0.02 | 0.00 | +0.01 | no clear effect |
| 11 | Poppet | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | +0.01 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 12 | Dragonet | 0.00 ± 0.01 | −0.03 | +0.03 | +0.01 | +0.01 | +0.01 | +0.01 | −0.01 | 0.00 | no clear effect |
| 13 | Goblin | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 14 | Halfling | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 15 | Kobold | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 16 | Ratfolk | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 17 | Shoony | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 18 | Tengu | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 19 | Tripkee | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 20 | Vanara | 0.00 ± 0.01 | −0.02 | 0.00 | +0.03 | 0.00 | −0.01 | +0.01 | +0.02 | 0.00 | no clear effect |
| 21 | Athamaru | 0.00 ± 0.01 | −0.04 | +0.03 | +0.01 | +0.01 | +0.01 | +0.01 | −0.01 | 0.00 | no clear effect |
| 22 | Automaton | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | +0.01 | no clear effect |
| 23 | Azarketi | 0.00 ± 0.01 | −0.04 | +0.03 | +0.01 | +0.01 | +0.01 | +0.01 | −0.01 | 0.00 | no clear effect |
| 24 | Anadi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Android | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Catfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Fetchling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Ghoran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Hobgoblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Kashrishi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 33 | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 34 | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 35 | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 36 | Lizardfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 37 | Samsaran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 38 | Sarangay | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 39 | Shisk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 40 | Strix | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 41 | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 42 | Vishkanya | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 43 | Wayang | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 44 | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 45 | Yaoguai | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 46 | Sprite | 0.00 ± 0.01 | −0.05 | +0.02 | +0.03 | 0.00 | −0.01 | +0.01 | +0.01 | −0.01 | no clear effect |
| 47 | Elf | 0.00 ± 0.01 | −0.03 | +0.01 | +0.01 | −0.01 | −0.01 | +0.01 | −0.01 | −0.01 | no clear effect |
| 48 | Goloma | −0.01 ± 0.00 | 0.00 | 0.00 | −0.01 | −0.01 | 0.00 | 0.00 | −0.03 | 0.00 | no clear effect |
| 49 | Merfolk | −0.01 ± 0.01 | −0.12 | +0.03 | +0.05 | +0.01 | −0.03 | +0.03 | −0.03 | +0.01 | no clear effect |
| 50 | Awakened Animal | −0.01 ± 0.01 | −0.12 | +0.02 | +0.05 | +0.02 | −0.01 | +0.01 | −0.03 | +0.01 | no clear effect |
| 51 | Skeleton | −0.02 ± 0.01 | −0.03 | 0.00 | −0.04 | −0.01 | −0.03 | +0.01 | −0.03 | −0.03 | no clear effect |

## Heritages

Rated: 104; 230 change nothing a fight here plays (situational bonuses, senses in the light, out-of-combat uses).

| # | Heritage | Ancestry | Rating | Fighter | Rogue | Wizard | Cleric | Verdict |
|---:|---|---|---:|---:|---:|---:|---:|---|
| 1 | Breaker Surki | Surki | +0.01 ± 0.01 | +0.05 | −0.01 | +0.01 | 0.00 | no clear effect |
| 2 | Battle-Trained Human (BB) | Human | +0.01 ± 0.01 | +0.01 | +0.01 | 0.00 | +0.02 | no clear effect |
| 3 | Fleetwind Centaur | Centaur | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | +0.01 | no clear effect |
| 4 | Mistbreath Azarketi | Azarketi | 0.00 ± 0.01 | +0.07 | −0.02 | −0.01 | −0.03 | no clear effect |
| 5 | Beastkin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 6 | Monstrous Skeleton | Skeleton | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 7 | Predator Strix | Strix | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 8 | Vicious Goloma | Goloma | 0.00 ± 0.00 | 0.00 | 0.00 | +0.01 | 0.00 | no clear effect |
| 9 | Taloned Tengu | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 10 | Abyssal Merfolk | Merfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 11 | Aiuvarin | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 12 | Ancient Scale Azarketi | Azarketi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 13 | Arctic Elf | Elf | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 14 | Ardande | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 15 | Ascetic Tanuki | Tanuki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 16 | Benthic Athamaru | Athamaru | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 17 | Benthic Azarketi | Azarketi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 18 | Bloodhound Shoony | Shoony | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 19 | Cactus Leshy | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 20 | Carcharodon Merfolk | Merfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 21 | Cave Kholo | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 22 | Cavern Elf | Elf | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 23 | Changeling | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 24 | Charhide Goblin | Goblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Chrysanthemum Leshy | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Clawed Catfolk | Catfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Created Fleshwarp | Fleshwarp | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Deep Fetchling | Fetchling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Deep Rat | Ratfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Deny the Firstborn Pursuit | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Deny the Traitor's Rebirth | Yaksha | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Desert Elf | Elf | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 33 | Dhampir | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 34 | Dokkaebi Goblin | Goblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 35 | Dromaar | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 36 | Duskwalker | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 37 | Earthly Wilds Kitsune | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 38 | Elementheart Kobold | Kobold | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 39 | Elytron Surki | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 40 | Even-Tempered Tanuki | Tanuki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 41 | Farsight Goloma | Goloma | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 42 | Forge Dwarf | Dwarf | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 43 | Frozen Wind Kitsune | Kitsune | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 44 | Fungus Leshy | Leshy | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 45 | Ghost Poppet | Poppet | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 46 | Glacier Cavern Minotaur | Minotaur | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 47 | Grave Orc | Orc | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 48 | Hooded Nagaji | Nagaji | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 49 | Hopeful Athamaru | Athamaru | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 50 | Hungerseed | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 51 | Hunting Catfolk | Catfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 52 | Inured Azarketi | Azarketi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 53 | Ironhoof Centaur | Centaur | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 54 | Koblak Bugbear | Bugbear | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 55 | Lahkgyan Vanara | Vanara | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 56 | Lantern Surki | Surki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 57 | Longsnout Rat | Ratfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 58 | Luminous Sprite | Sprite | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 59 | Mountaineer Samsaran | Samsaran | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 60 | Naari | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 61 | Nephilim | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 62 | Nightglider Strix | Strix | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 63 | Oread | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 64 | Ponygait Centaur | Centaur | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 65 | Rainfall Orc | Orc | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 66 | Razortooth Goblin | Goblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 67 | Reef Merfolk | Merfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 68 | Sacred Nagaji | Nagaji | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 69 | Sandstrider Lizardfolk | Lizardfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 70 | Sensate Gnome | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 71 | Sewer Rat | Ratfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 72 | Shapewrought Fleshwarp | Fleshwarp | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 73 | Shimmertongue Nagaji | Nagaji | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 74 | Smokeworker Hobgoblin | Hobgoblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 75 | Snow Goblin | Goblin | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 76 | Snow Rat | Ratfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 77 | Spined Azarketi | Azarketi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 78 | Stormtossed Tengu | Tengu | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 79 | Strong-Blooded Dwarf | Dwarf | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 80 | Strongjaw Kobold | Kobold | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 81 | Suli | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 82 | Sylph | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 83 | Tactile Azarketi | Azarketi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 84 | Talos | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 85 | Thickcoat Shoony | Shoony | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 86 | Thickskin Tripkee | Tripkee | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 87 | Twilight Halfling | Halfling | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 88 | Umbral Gnome | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 89 | Venom-Resistant Vishkanya | Vishkanya | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 90 | Venomshield Nagaji | Nagaji | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 91 | Virtuous Tanuki | Tanuki | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 92 | Vivacious Gnome | Gnome | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 93 | Wajaghand Vanara | Vanara | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 94 | Warrior Automaton | Automaton | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 95 | Warrior Jotunborn | Jotunborn | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 96 | Wikkawak Bugbear | Bugbear | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 97 | Winter Catfolk | Catfolk | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 98 | Winter Kholo | Kholo | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 99 | Wintertouched Human | Human | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 100 | Xyloshi | Kashrishi | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 101 | Quilled Athamaru | Athamaru | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 102 | Seaweed Leshy | Leshy | 0.00 ± 0.01 | −0.07 | +0.02 | +0.01 | +0.03 | no clear effect |
| 103 | Shadow of the Wanderer | Wayang | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.03 | no clear effect |
| 104 | Spindly Anadi | Anadi | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.03 | no clear effect |

## Backgrounds

Rated: 87; 453 give nothing a fight here plays (skills used outside combat, Lore, skill feats the simulator doesn't play).

| # | Background | What it adds | On | Rating | Lvl 1 | Lvl 5 | Lvl 11 | Lvl 17 | Verdict |
|---:|---|---|---|---:|---:|---:|---:|---:|---|
| 1 | Saved by Clockwork | its rules | fighter | +0.04 ± 0.02 | +0.02 | +0.07 | +0.02 | +0.03 | no clear effect |
| 2 | Acupuncturist | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 3 | Awful Scab | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 4 | Back-Alley Doctor | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 5 | Barber | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 6 | Breachill Survivor | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 7 | Corpse Stitcher | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 8 | Curandero | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 9 | Eldritch Anatomist | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 10 | Envoy's Alliance | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 11 | Field Medic | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 12 | Fleshwarp Researcher | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 13 | Lastwall Survivor | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 14 | Medicinal Clocksmith | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 15 | Once Bitten | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 16 | Plague Doctor | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 17 | Sarkorian Reclaimer | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 18 | School Medic | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 19 | Secular Medic | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 20 | Supportive Sponsor | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 21 | Tech-Reliant | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 22 | Undertaker | trained medicine | fighter | 0.00 ± 0.00 | +0.01 | 0.00 | 0.00 | 0.00 | no clear effect |
| 23 | Acrobat | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 24 | Aerialist | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 25 | Child of the Puddles | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 26 | Curse-Marked | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 27 | Deckhand | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 28 | Driver | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 29 | Energy Scarred | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 30 | Feral Child | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 31 | Friend of a Friend | its rules | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 32 | Perfection Seeker | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 33 | Ruin Delver | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 34 | Savior of Air | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 35 | Second Chance Champion | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 36 | Sideshow Scion | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 37 | Sky Rider | trained acrobatics | wizard | 0.00 ± 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | no clear effect |
| 38 | Bright Lion | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 39 | Charlatan | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 40 | Circuit Judge | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 41 | Company Agent | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 42 | Fey Friend | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 43 | Final Blade Survivor | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 44 | Gambler | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 45 | Insurgent | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 46 | Issian Partisan | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 47 | Party Scholar | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 48 | Quick | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 49 | Shadow Lodge Defector | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 50 | Snubbed Out Stoolie | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 51 | Trusted Rival | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 52 | Truth Seeker | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 53 | Undercover Contender | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 54 | Undercover Lotus Guard | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 55 | Unremarkable | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 56 | Wandering Libertine | trained deception | fighter | 0.00 ± 0.00 | 0.00 | 0.00 | −0.02 | 0.00 | no clear effect |
| 57 | Anti-Tech Activist | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 58 | Aspiring Free-Captain | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 59 | Bandit | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 60 | Barker | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 61 | Belkzen Slayer | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 62 | Bully or Baiter? | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 63 | Demon Hunted | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 64 | Dragon Scholar | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 65 | Empty Hand Loyalist | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 66 | Finadar Leshy | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 67 | Former Aspis Agent | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 68 | Guard | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 69 | Hardened Criminal | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 70 | Hellknight Deserter | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 71 | Legendary Parents | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 72 | Local Brigand | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 73 | Lost and Alone | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 74 | Moot Guard | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 75 | Night Watch | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 76 | Once Possessed | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 77 | Quartermaster | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 78 | Razmiran Faithful | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 79 | Reclaimed | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 80 | Scarnetti-Connected | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 81 | Shadow Haunted | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 82 | Sheriff | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 83 | Tax Collector | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 84 | Thuvian Unifier | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 85 | Total Power | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 86 | Ulfen Raider | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
| 87 | Warrior | trained intimidation | wizard | −0.01 ± 0.01 | 0.00 | 0.00 | −0.01 | −0.02 | no clear effect |
