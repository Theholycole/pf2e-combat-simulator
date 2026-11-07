# Feats the feat module doesn't automate or the simulator doesn't rate

Made by `node tools/feat-gap-index.mjs` on 2026-11-07. It covers all 6366 feats in PF2e's feats pack (Teams+ and other module packs aren't in this copy, so they aren't here).

- **The feat module** automates 2641: a card it compiles, a feat named in its hand plans, rules or scripts, or a reminder at its trigger. **3725 it doesn't.**
- **The simulator** rates 2170: in whole fights, or 91 combo feats from the basic actions they fold in (docs/combo-feats.md). **4196 it doesn't.**
- **2915** are in neither.

## Summary by category

| Category | Feats | Not automated by the feat module | Not rated by the simulator | Neither |
|---|---:|---:|---:|---:|
| class | 2282 | 1088 | 1388 | 864 |
| archetype | 2074 | 1246 | 1367 | 947 |
| ancestry | 1613 | 1086 | 1071 | 805 |
| skill | 340 | 261 | 326 | 261 |
| general | 40 | 36 | 32 | 30 |
| bonus | 14 | 6 | 9 | 6 |
| class feature | 3 | 2 | 3 | 2 |
| **All** | 6366 | 3725 | 4196 | 2915 |

## Why the feat module doesn't automate them

| Reason | class | archetype | ancestry | skill | general | bonus | class feature | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| PF2e's own rule elements already do it | 376 | 406 | 711 | 59 | 20 | 4 |  | 1576 |
| roleplay or nothing to automate | 212 | 236 | 163 | 46 | 9 |  |  | 666 |
| only grants other feats, features or choices | 137 | 263 | 95 | 20 | 2 | 1 | 1 | 519 |
| out of combat (exploration, downtime, skills) | 93 | 102 | 44 | 111 | 2 |  |  | 352 |
| a combat passive no reader or hand plan covers yet | 73 | 65 | 32 | 13 | 2 |  | 1 | 186 |
| spellcasting the spell module or PF2e handles | 74 | 87 | 14 | 1 |  | 1 |  | 177 |
| companions, familiars and eidolons | 52 | 37 | 2 | 5 |  |  |  | 96 |
| a combat action no reader or hand plan covers yet | 32 | 28 | 14 | 4 | 1 |  |  | 79 |
| PF2e's own Effect, from the feat's Use button | 39 | 22 | 11 | 2 |  |  |  | 74 |

## Why the simulator doesn't rate them

The simulator's own reason, from the feat screen. "The feat module reads nothing for it" means there's no card and no PF2e rule a fight counts, so it's mostly the same feats as the feat module's list above.

| Reason | class | archetype | ancestry | skill | general | bonus | class feature | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| no card, and PF2e's rule elements on it change nothing a fight counts | 256 | 214 | 318 | 59 | 14 | 4 |  | 865 |
| no card: roleplay or nothing to automate | 157 | 201 | 151 | 46 | 9 |  |  | 564 |
| no card: the feat module's reminder, which a fight doesn't play | 174 | 128 | 93 | 21 |  | 1 |  | 417 |
| no card: out of combat (exploration, downtime, skills) | 91 | 80 | 39 | 111 | 2 |  |  | 323 |
| no card: only grants other feats, features or choices | 86 | 123 | 47 | 16 | 2 |  |  | 274 |
| no card: the feat module's hand-written handling (a script, rule batch or list), which a fight doesn't play | 51 | 50 | 44 | 21 | 1 |  |  | 167 |
| no card: a combat passive no reader or hand plan covers yet | 50 | 58 | 29 | 13 | 2 |  | 1 | 153 |
| a spell the engine doesn't cast | 25 | 32 | 63 | 1 |  |  |  | 121 |
| no card: spellcasting the spell module or PF2e handles | 56 | 44 | 2 |  |  | 1 |  | 103 |
| a timer with no rules a fight counts | 53 | 26 | 17 | 4 |  | 1 |  | 101 |
| a plan the engine can't play | 32 | 37 | 26 | 3 |  |  |  | 98 |
| no card: a combat action no reader or hand plan covers yet | 24 | 27 | 13 | 4 | 1 |  |  | 69 |
| no card: companions, familiars and eidolons | 34 | 25 | 1 | 5 |  |  |  | 65 |
| a Strike with nothing more the simulator reads | 37 | 22 | 1 |  |  | 1 |  | 61 |
| it grants Additional Lore | 1 | 11 | 39 | 1 |  |  |  | 52 |
| a roll whose results the simulator doesn't read | 25 | 14 | 5 | 7 |  |  |  | 51 |
| its requirement | 14 | 28 | 4 |  |  |  |  | 46 |
| an Effect with nothing a fight counts | 24 | 13 | 7 | 1 |  |  |  | 45 |
| no card: PF2e's own Effect, from the feat's Use button | 18 | 17 | 7 | 2 |  |  |  | 44 |
| a passive's roll with no action to use it | 13 | 14 | 9 |  |  |  | 1 | 37 |
| it grants one of 2 | 6 | 14 | 12 |  |  |  |  | 32 |
| its Effect has nothing a fight counts | 6 | 11 | 5 | 2 |  |  |  | 24 |
| a spell the feat casts | 13 | 5 | 5 |  |  |  |  | 23 |
| a passive's Effect posted by hand | 7 | 11 | 3 | 1 |  |  |  | 22 |
| a passive's Effect on other creatures | 8 | 7 | 1 | 3 | 1 |  |  | 20 |
| a teleport | 4 | 9 | 7 |  |  |  |  | 20 |
| a reaction to "passive" | 8 | 5 | 4 |  |  |  |  | 17 |
| nothing a fight uses | 2 | 1 | 12 |  |  |  |  | 15 |
| its text has no Strike of its user's | 6 | 7 | 1 |  |  |  |  | 14 |
| a reaction's Strike | 5 | 3 | 4 |  |  |  |  | 12 |
| its requirement, which the PC doesn't meet | 5 | 2 | 3 |  |  |  |  | 10 |
| a lasting area | 7 |  | 2 |  |  |  |  | 9 |
| a reroll | 3 | 2 | 4 |  |  |  |  | 9 |
| it grants Pet | 3 | 2 | 3 |  |  |  |  | 8 |
| a Focus or Mythic Point back | 4 |  | 3 |  |  |  |  | 7 |
| its stance's own gap | 3 | 4 |  |  |  |  |  | 7 |
| a passive's Strike | 2 | 3 | 1 |  |  |  |  | 6 |
| it grants Alchemical Crafting | 1 | 2 | 3 |  |  |  |  | 6 |
| a choice of ways the simulator doesn't play | 3 | 1 | 2 |  |  |  |  | 6 |
| it grants Domain Initiate |  | 4 |  |  |  | 1 |  | 5 |
| it grants Impressive Performance |  |  | 5 |  |  |  |  | 5 |
| it grants Specialty Crafting |  |  | 5 |  |  |  |  | 5 |
| it grants Cast a Spell | 2 | 3 |  |  |  |  |  | 5 |
| it grants Intimidating Glare |  |  | 5 |  |  |  |  | 5 |
| it grants Terrain Stalker |  | 2 | 2 |  |  |  |  | 4 |
| error | 2 | 2 |  |  |  |  |  | 4 |
| an Effect on another creature | 2 | 2 |  |  |  |  |  | 4 |
| it grants Verdant Core Deviant Classification | 4 |  |  |  |  |  |  | 4 |
| a reaction to "strike" |  |  | 3 |  |  |  |  | 3 |
| it grants Snare Crafting |  | 2 | 1 |  |  |  |  | 3 |
| it grants Assurance |  |  | 3 |  |  |  |  | 3 |
| it grants Titan Wrestler |  | 1 | 2 |  |  |  |  | 3 |
| it grants Lie to Me |  | 1 | 2 |  |  |  |  | 3 |
| it grants Leech Deviant Classification | 3 |  |  |  |  |  |  | 3 |
| it grants Adopted Ancestry |  |  | 3 |  |  |  |  | 3 |
| it grants Quick Squeeze |  | 1 | 2 |  |  |  |  | 3 |
| it grants one of 3 | 1 | 2 |  |  |  |  |  | 3 |
| a companion's Strike | 3 |  |  |  |  |  |  | 3 |
| it grants Combat Climber |  |  | 2 |  |  |  |  | 2 |
| it grants Eye for Numbers |  |  | 2 |  |  |  |  | 2 |
| it grants Underwater Marauder |  | 2 |  |  |  |  |  | 2 |
| damage still naming the character's data |  |  | 1 | 1 |  |  |  | 2 |
| it grants Oddity Identification |  |  | 2 |  |  |  |  | 2 |
| it grants Enhanced Familiar |  | 2 |  |  |  |  |  | 2 |
| a reaction to "aura" |  | 2 |  |  |  |  |  | 2 |
| a free's Strike | 1 |  |  | 1 |  |  |  | 2 |
| it grants one of 6 |  | 1 | 1 |  |  |  |  | 2 |
| it grants Untrained Improvisation |  |  | 2 |  |  |  |  | 2 |
| a roll twice |  | 2 |  |  |  |  |  | 2 |
| it grants Dragon Deviant Classification | 2 |  |  |  |  |  |  | 2 |
| it grants Hobnobber |  |  | 2 |  |  |  |  | 2 |
| it grants Wraith Deviant Classification | 2 |  |  |  |  |  |  | 2 |
| it grants Hunt Prey |  | 2 |  |  |  |  |  | 2 |
| it grants Conceal Spell |  | 2 |  |  |  |  |  | 2 |
| it grants Ride |  |  | 2 |  |  |  |  | 2 |
| it grants Lengthy Diversion | 1 |  | 1 |  |  |  |  | 2 |
| it grants Courtly Graces |  |  | 2 |  |  |  |  | 2 |
| it grants Blight Soul Deviant Classification | 2 |  |  |  |  |  |  | 2 |
| it grants Quick Repair |  |  | 1 | 1 |  |  |  | 2 |
| it grants Steady Balance |  |  | 2 |  |  |  |  | 2 |
| it grants Multilingual |  | 1 | 1 |  |  |  |  | 2 |
| it grants Powerful Leap |  |  | 1 |  |  |  |  | 1 |
| a reaction to "damaged" |  |  | 1 |  |  |  |  | 1 |
| it grants Deity |  | 1 |  |  |  |  |  | 1 |
| it grants Natural Medicine |  |  | 1 |  |  |  |  | 1 |
| it grants Draw From the Pages | 1 |  |  |  |  |  |  | 1 |
| it grants Magical Crafting |  | 1 |  |  |  |  |  | 1 |
| it grants Avoid Dire Fate |  | 1 |  |  |  |  |  | 1 |
| it grants Entity's Resurgence |  | 1 |  |  |  |  |  | 1 |
| it grants Dubious Knowledge |  |  | 1 |  |  |  |  | 1 |
| it grants Guerrilla Assault |  | 1 |  |  |  |  |  | 1 |
| it grants Pitch-Perfect Projection |  | 1 |  |  |  |  |  | 1 |
| it grants Assume a Role |  | 1 |  |  |  |  |  | 1 |
| it grants Influence Rumor |  | 1 |  |  |  |  |  | 1 |
| it grants Hefty Hauler |  |  | 1 |  |  |  |  | 1 |
| it grants Summon Sloth | 1 |  |  |  |  |  |  | 1 |
| it grants Makes Me Stronger | 1 |  |  |  |  |  |  | 1 |
| it grants Mark the Center | 1 |  |  |  |  |  |  | 1 |
| it grants Experienced Tracker |  | 1 |  |  |  |  |  | 1 |
| it grants Brandish the Gorgon's Gaze | 1 |  |  |  |  |  |  | 1 |
| it grants Devise a Stratagem |  | 1 |  |  |  |  |  | 1 |
| it grants Arcane Bond |  | 1 |  |  |  |  |  | 1 |
| it grants A Challenge for Heroes | 1 |  |  |  |  |  |  | 1 |
| it grants Call Upon the Brightness |  |  | 1 |  |  |  |  | 1 |
| it grants Cycle Elemental Stance |  | 1 |  |  |  |  |  | 1 |
| it grants Automatic Knowledge | 1 |  |  |  |  |  |  | 1 |
| it grants Swift Choreography |  | 1 |  |  |  |  |  | 1 |
| it grants Break the Sun's Legs | 1 |  |  |  |  |  |  | 1 |
| it grants Inspired Stratagem | 1 |  |  |  |  |  |  | 1 |
| it grants Rage |  | 1 |  |  |  |  |  | 1 |
| it grants Create Familiar Fulu |  | 1 |  |  |  |  |  | 1 |
| it grants Legendary Negotiation | 1 |  |  |  |  |  |  | 1 |
| it grants On the Case |  | 1 |  |  |  |  |  | 1 |
| it grants Cobble Together |  | 1 |  |  |  |  |  | 1 |
| it grants Find Fault |  |  | 1 |  |  |  |  | 1 |
| it grants Weaponsight | 1 |  |  |  |  |  |  | 1 |
| a target the simulator can't tell |  | 1 |  |  |  |  |  | 1 |
| it grants Lay Down Arms |  | 1 |  |  |  |  |  | 1 |
| it grants Magical Shorthand | 1 |  |  |  |  |  |  | 1 |
| it grants Mirror-Trickery |  |  | 1 |  |  |  |  | 1 |
| it grants Sorshen's Devotion | 1 |  |  |  |  |  |  | 1 |
| it grants Crescent Spray |  | 1 |  |  |  |  |  | 1 |
| it grants Forager |  |  | 1 |  |  |  |  | 1 |
| it grants Shameless Request |  |  | 1 |  |  |  |  | 1 |
| it grants Call Warshard Weapon | 1 |  |  |  |  |  |  | 1 |
| it grants Bond with Spirit |  | 1 |  |  |  |  |  | 1 |
| it grants Witch's Charge |  | 1 |  |  |  |  |  | 1 |
| it grants Water Transfer | 1 |  |  |  |  |  |  | 1 |
| it grants Greater Field Discovery |  | 1 |  |  |  |  |  | 1 |
| it grants Charming Liar |  |  | 1 |  |  |  |  | 1 |
| it grants one of 10 |  | 1 |  |  |  |  |  | 1 |
| it grants Keen Recollection |  | 1 |  |  |  |  |  | 1 |
| it grants Shed the Mortal Skin | 1 |  |  |  |  |  |  | 1 |
| it grants Inventor |  | 1 |  |  |  |  |  | 1 |
| it grants Base Kinesis |  | 1 |  |  |  |  |  | 1 |
| it grants Unravel the Future | 1 |  |  |  |  |  |  | 1 |
| it grants Expel Maelstrom |  | 1 |  |  |  |  |  | 1 |
| it grants Mystic Aegis |  | 1 |  |  |  |  |  | 1 |
| it grants Set Explosives |  | 1 |  |  |  |  |  | 1 |
| it grants Upstage |  | 1 |  |  |  |  |  | 1 |
| it grants Intercession Spell | 1 |  |  |  |  |  |  | 1 |
| it grants Liberate Self |  | 1 |  |  |  |  |  | 1 |
| it grants Quick Identification |  |  | 1 |  |  |  |  | 1 |
| it grants Infiltrator's Draw |  | 1 |  |  |  |  |  | 1 |
| it grants Geomancer Dedication |  | 1 |  |  |  |  |  | 1 |
| it grants Bonded Animal |  |  | 1 |  |  |  |  | 1 |
| it grants Only You and I | 1 |  |  |  |  |  |  | 1 |
| it grants Monastic Weaponry |  | 1 |  |  |  |  |  | 1 |
| it grants Call to Hand | 1 |  |  |  |  |  |  | 1 |
| it grants Call Gun |  | 1 |  |  |  |  |  | 1 |
| it grants Empty Vessel |  |  | 1 |  |  |  |  | 1 |
| it grants Eidolon |  | 1 |  |  |  |  |  | 1 |
| it grants Jumping Jenny |  | 1 |  |  |  |  |  | 1 |
| it grants Fortify Focus |  |  | 1 |  |  |  |  | 1 |
| it grants Mist Blending |  |  | 1 |  |  |  |  | 1 |
| it grants Unwavering Resilience |  |  | 1 |  |  |  |  | 1 |
| it grants Set Free | 1 |  |  |  |  |  |  | 1 |
| it grants Spread Propaganda |  | 1 |  |  |  |  |  | 1 |
| it grants Unimpeded Journey |  | 1 |  |  |  |  |  | 1 |
| it grants Entreat Pact |  | 1 |  |  |  |  |  | 1 |
| it grants Sever Four Dragonfly Wings | 1 |  |  |  |  |  |  | 1 |
| it grants Dancing Dodge |  | 1 |  |  |  |  |  | 1 |
| it grants Engineer's Efficiency |  | 1 |  |  |  |  |  | 1 |
| it grants Spell-Woven Shot |  | 1 |  |  |  |  |  | 1 |
| it grants Improvised Repair |  | 1 |  |  |  |  |  | 1 |
| it grants Royal Grace | 1 |  |  |  |  |  |  | 1 |
| it grants Battle Medicine | 1 |  |  |  |  |  |  | 1 |
| it grants Pacifying Infusion | 1 |  |  |  |  |  |  | 1 |
| it grants Absorb into the Aegis |  | 1 |  |  |  |  |  | 1 |
| it grants Flicker Deviant Classification | 1 |  |  |  |  |  |  | 1 |
| it grants Resist Magic |  |  | 1 |  |  |  |  | 1 |
| it grants Fey Jump |  | 1 |  |  |  |  |  | 1 |
| it grants Chassis Deflection |  |  | 1 |  |  |  |  | 1 |
| it grants Recognize Spell |  | 1 |  |  |  |  |  | 1 |
| it grants Plant Thirty Barbs | 1 |  |  |  |  |  |  | 1 |
| it grants Salt Wound |  |  | 1 |  |  |  |  | 1 |
| it grants Virtuosic Performer |  |  | 1 |  |  |  |  | 1 |
| it grants Tactics |  | 1 |  |  |  |  |  | 1 |
| it grants Qi Spells |  | 1 |  |  |  |  |  | 1 |
| it grants Once Bitten |  | 1 |  |  |  |  |  | 1 |
| it grants Canny Acumen |  |  | 1 |  |  |  |  | 1 |
| effects the GM allows from the scenery | 1 |  |  |  |  |  |  | 1 |
| it grants Enter Runewell | 1 |  |  |  |  |  |  | 1 |
| it grants Heaven Rains an Ending | 1 |  |  |  |  |  |  | 1 |
| it grants Mark for Death |  | 1 |  |  |  |  |  | 1 |
| it grants Speed of Arms | 1 |  |  |  |  |  |  | 1 |
| it grants Remove Head |  | 1 |  |  |  |  |  | 1 |
| it grants Tangle in Riddle | 1 |  |  |  |  |  |  | 1 |
| it grants Bullet Dancer Stance |  | 1 |  |  |  |  |  | 1 |
| it grants Banshee Cry |  | 1 |  |  |  |  |  | 1 |
| it grants Host of Wrath | 1 |  |  |  |  |  |  | 1 |
| it grants Coiling Serpents | 1 |  |  |  |  |  |  | 1 |
| it grants Quick Alchemy | 1 |  |  |  |  |  |  | 1 |
| it grants Accidental Shot |  | 1 |  |  |  |  |  | 1 |
| it grants Smoke Blending |  |  | 1 |  |  |  |  | 1 |
| it grants Juggle |  | 1 |  |  |  |  |  | 1 |
| it grants Crafter's Appraisal |  |  | 1 |  |  |  |  | 1 |
| it grants Forced Pact |  | 1 |  |  |  |  |  | 1 |
| it grants Objection | 1 |  |  |  |  |  |  | 1 |
| it grants Incredible Investiture | 1 |  |  |  |  |  |  | 1 |
| it grants Share Death's Promises | 1 |  |  |  |  |  |  | 1 |
| it grants Inevitable Return |  | 1 |  |  |  |  |  | 1 |
| it grants Arcane Sense |  |  | 1 |  |  |  |  | 1 |
| it grants Verdant Rest | 1 |  |  |  |  |  |  | 1 |
| it grants Overawe Crowd |  |  |  |  |  |  | 1 | 1 |
| it grants Disarming Interception |  | 1 |  |  |  |  |  | 1 |
| it grants Rouse the World |  | 1 |  |  |  |  |  | 1 |
| it grants Devour Ambient Magic |  | 1 |  |  |  |  |  | 1 |
| it grants Psychometric Assessment |  |  |  | 1 |  |  |  | 1 |
| it grants Fast Recovery |  |  | 1 |  |  |  |  | 1 |
| it grants Slayer's Identification |  | 1 |  |  |  |  |  | 1 |
| it grants Favored Terrain |  | 1 |  |  |  |  |  | 1 |
| it grants Solitary Invocation |  | 1 |  |  |  |  |  | 1 |
| it grants Coughing Dragon |  | 1 |  |  |  |  |  | 1 |
| it grants Size Up |  | 1 |  |  |  |  |  | 1 |
| it grants Blinding of the Needle | 1 |  |  |  |  |  |  | 1 |
| it grants Spasm of the Berserker | 1 |  |  |  |  |  |  | 1 |
| it grants Divine Spark and Ikons |  | 1 |  |  |  |  |  | 1 |
| it grants Quick Draw |  | 1 |  |  |  |  |  | 1 |
| it grants Spin Tale |  | 1 |  |  |  |  |  | 1 |
| it grants Quick Disguise |  |  | 1 |  |  |  |  | 1 |
| it grants Impromptu Investment |  | 1 |  |  |  |  |  | 1 |
| it grants Pirate Dedication |  | 1 |  |  |  |  |  | 1 |
| it grants Aegis of Envy | 1 |  |  |  |  |  |  | 1 |
| it grants Binding Vow |  | 1 |  |  |  |  |  | 1 |
| it grants Drape Ambient Magic |  | 1 |  |  |  |  |  | 1 |
| it grants Reactive Falsehood |  |  |  | 1 |  |  |  | 1 |
| it grants Trick Magic Item |  | 1 |  |  |  |  |  | 1 |
| a reaction to "hit-by" | 1 |  |  |  |  |  |  | 1 |
| it grants Command Undead |  | 1 |  |  |  |  |  | 1 |
| it grants Trace Rune |  | 1 |  |  |  |  |  | 1 |
| it grants Transform Ammunition |  | 1 |  |  |  |  |  | 1 |
| it grants Slippery Secrets |  | 1 |  |  |  |  |  | 1 |
| it grants Restore the Moment | 1 |  |  |  |  |  |  | 1 |
| it grants Sidestep Through Time | 1 |  |  |  |  |  |  | 1 |
| it grants Bless Ally | 1 |  |  |  |  |  |  | 1 |
| it grants Taunt |  | 1 |  |  |  |  |  | 1 |

## The feat module's gaps, feat by feat

### PF2e's own rule elements already do it (1576)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Aberration Kinship | 1 | ancestry | passive | a spell the engine doesn't cast |
| Adroit Manipulation | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ageless Spirit | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Anadi Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ancestral Longevity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ancient Memories | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Android Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Angelkin | 1 | ancestry | passive | it grants Multilingual |
| Animal Elocutionist | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Senses | 1 | ancestry | passive | rated 0 |
| Aquatic Elf Warrior | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aqueous Dragonblood | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcane Communication | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcane Dragonblood | 1 | ancestry | passive | it grants Arcane Sense |
| Arcane Eye | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcane Tattoos | 1 | ancestry | passive | rated -0.24 |
| Artisanal Crafter | 1 | ancestry | passive | it grants Specialty Crafting |
| Athamaru Lore | 1 | ancestry | passive | it grants Additional Lore |
| Athamaru Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Automaton Armament | 1 | ancestry | passive | rated 0.06 |
| Automaton Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Awakened Animal Lore | 1 | ancestry | passive | it grants Additional Lore |
| Axiomatic Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Azarketi Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Azarketi Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Battleblooded | 1 | ancestry | passive | it grants Intimidating Glare |
| Beast Trainer | 1 | ancestry | passive | it grants one of 2 |
| Beastbrood | 1 | ancestry | passive | it grants Courtly Graces |
| Benefactor's Resistance | 1 | ancestry | passive | rated 0 |
| Bestial Manifestation | 1 | ancestry | passive | rated 0 |
| Bouncy Goblin | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Brine May | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bugbear Lore | 1 | ancestry | passive | it grants Additional Lore |
| Bugbear Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Burn It! | 1 | ancestry | passive | rated 0 |
| Callow May | 1 | ancestry | passive | it grants Charming Liar |
| Caretaker's Intuition | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Catch the Details | 1 | ancestry | passive | it grants Eye for Numbers |
| Catfolk Lore | 1 | ancestry | passive | it grants Additional Lore |
| Catfolk Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Caustic Nectar | 1 | ancestry | passive | rated 0 |
| Centaur Lore | 1 | ancestry | passive | it grants Additional Lore |
| Centaur Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ceremony of the Evened Hand | 1 | ancestry | passive | rated 0 |
| Changeling Lore | 1 | ancestry | passive | it grants Additional Lore |
| Childlike Plant | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cindersoul | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| City Scavenger | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Clan Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Clan Pistol | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Climbing Tail | 1 | ancestry | passive | it grants Combat Climber |
| Community Knowledge | 1 | ancestry | reaction | no card, and PF2e's rule elements on it change nothing a fight counts |
| Community-Minded | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Conrasu Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Conrasu Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cooperative Nature | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Corgi Mount | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Covet Hoard | 1 | ancestry | passive | it grants one of 2 |
| Creative Prodigy | 1 | ancestry | passive | it grants Impressive Performance |
| Crocodile's Twin | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crown of Bone | 1 | ancestry | passive | its requirement, which the PC doesn't meet |
| Crunch | 1 | ancestry | passive | its requirement, which the PC doesn't meet |
| Demonbane Warrior | 1 | ancestry | passive | rated 0 |
| Divine Dragonblood | 1 | ancestry | passive | rated 0.01 |
| Dokkaebi Fire | 1 | ancestry | passive | rated -0.26 |
| Draconic Aspect | 1 | ancestry | passive | rated 0 |
| Draconic Resistance | 1 | ancestry | passive | rated 0 |
| Draconic Sight | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dragon Lore | 1 | ancestry | passive | it grants Additional Lore |
| Dragon Spit | 1 | ancestry | passive | rated -0.24 |
| Dragon's Presence | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dragonscaled Lore | 1 | ancestry | passive | it grants Additional Lore |
| Dualborn | 1 | ancestry | passive | rated 0 |
| Duskwalker Lore | 1 | ancestry | passive | it grants Additional Lore |
| Duskwalker Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dustsoul | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dwarven Lore | 1 | ancestry | passive | it grants Additional Lore |
| Dwarven Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Earned Glory | 1 | ancestry | passive | it grants Impressive Performance |
| Elemental Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Trade | 1 | ancestry | passive | it grants Specialty Crafting |
| Elemental Wrath | 1 | ancestry | passive | rated -0.27 |
| Elven Lore | 1 | ancestry | passive | it grants Additional Lore |
| Elven Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Embodied Legionary Subjectivity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Energy Beam | 1 | ancestry | passive | rated 0 |
| Esteemed Visitor | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Explosive Savant | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Expressive Face | 1 | ancestry | passive | it grants one of 2 |
| Eye for Masonry | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eye for Treasure | 1 | ancestry | passive | it grants Crafter's Appraisal |
| Fangs | 1 | ancestry | passive | rated 0 |
| Fascinated by Society | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ferrousoul | 1 | ancestry | passive | rated 0 |
| Fetchling Lore | 1 | ancestry | passive | it grants Additional Lore |
| Fey Cantrips | 1 | ancestry | passive | rated 0 |
| Fiend Worshipper | 1 | ancestry | passive | rated 0 |
| Fire Savvy | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flexible Form | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Folk Healer | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Foxfire | 1 | ancestry | passive | rated 0.01 |
| Fumesoul | 1 | ancestry | passive | rated 0 |
| Gemsoul | 1 | ancestry | passive | it grants Impressive Performance |
| Genie Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghoran Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghoran Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghost Hunter | 1 | ancestry | passive | rated 0 |
| Gildedsoul | 1 | ancestry | passive | it grants Courtly Graces |
| Gnome Polyglot | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gnome Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Goblin Lore | 1 | ancestry | passive | it grants Additional Lore |
| Goblin Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Goloma Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Grasping Reach | 1 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hag Claws | 1 | ancestry | passive | rated 0 |
| Halfling Lore | 1 | ancestry | passive | it grants Additional Lore |
| Halfling Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Halo | 1 | ancestry | passive | rated 0 |
| Handy with your Paws | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hard Tail | 1 | ancestry | passive | rated 0 |
| Harmless Doll | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Harmlessly Cute | 1 | ancestry | passive | it grants Shameless Request |
| Haughty Obstinacy | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hellspawn | 1 | ancestry | passive | it grants Lie to Me |
| Helpful Poppet | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hidden Thorn | 1 | ancestry | passive | rated 0 |
| Hobgoblin Lore | 1 | ancestry | passive | it grants Additional Lore |
| Hobgoblin Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hyena Familiar | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Idyllkin | 1 | ancestry | passive | it grants Natural Medicine |
| Innate Understanding | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inner Fire (Naari) | 1 | ancestry | passive | rated -0.26 |
| Innocuous | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Intuitive Cooperation | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Intuitive Crafting | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Iron Belly | 1 | ancestry | passive | rated 0 |
| Iron Fists | 1 | ancestry | passive | rated 0 |
| Iruxi Armaments | 1 | ancestry | passive | its requirement, which the PC doesn't meet |
| It Takes a Village | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Jotunborn Grappler | 1 | ancestry | passive | it grants Titan Wrestler |
| Jotunborn Lore | 1 | ancestry | passive | it grants Additional Lore |
| Jotunborn Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Jungle Strider | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Kholo Lore | 1 | ancestry | passive | it grants Additional Lore |
| Kholo Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Kitsune Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Kobold Lore | 1 | ancestry | passive | it grants Additional Lore |
| Kobold Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Land Legs | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lavasoul | 1 | ancestry | passive | rated 0 |
| Learn by Watching | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Leshy Lore | 1 | ancestry | passive | it grants Additional Lore |
| Living Weapon | 1 | ancestry | passive | rated 0 |
| Lizardfolk Lore | 1 | ancestry | passive | it grants Additional Lore |
| Made for Combat | 1 | ancestry | passive | rated 0 |
| Mariner's Fire | 1 | ancestry | passive | rated -0.26 |
| Mental Sustenance | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Merfolk Lore | 1 | ancestry | passive | it grants Additional Lore |
| Merfolk Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Messenger | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Meticulous Restorer | 1 | ancestry | passive | it grants Quick Repair |
| Mighty Dragonet | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Minotaur Lore | 1 | ancestry | passive | it grants Additional Lore |
| Minotaur Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Minuscule Mentee | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Miresoul | 1 | ancestry | passive | it grants Quick Squeeze |
| Molten Wit | 1 | ancestry | passive | it grants one of 2 |
| Monstrous Peacemaker | 1 | ancestry | passive | rated 0 |
| Moon May | 1 | ancestry | passive | rated -0.7 |
| Morphic Strike | 1 | ancestry | passive | rated 0 |
| Mountain Strategy | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Musetouched | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| My Claws are Daggers | 1 | ancestry | passive | rated 0 |
| Nagaji Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Natural Senses | 1 | ancestry | passive | rated 0 |
| Natural Skill | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Nephilim Lore | 1 | ancestry | passive | it grants Additional Lore |
| Nimble Elf | 1 | ancestry | passive | rated 0 |
| Nimble Hooves | 1 | ancestry | passive | rated 0 |
| Nocturnal Charm | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Nosoi's Mask | 1 | ancestry | passive | it grants Intimidating Glare |
| Occult Dragonblood | 1 | ancestry | passive | it grants Oddity Identification |
| Ocean Wariness | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ocean's Bite | 1 | ancestry | passive | rated 0 |
| Oni Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Orc Lore | 1 | ancestry | passive | it grants Additional Lore |
| Orc Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Overlooked Mastermind | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pack Hunter | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pelagic Aptitude | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pitborn | 1 | ancestry | passive | it grants one of 6 |
| Political Acumen | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Prairie Rider | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Primal Dragonblood | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Progenitor Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Proximity Alert | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Puncturing Horn | 1 | ancestry | passive | rated 0 |
| Quadruped | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rat Familiar | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ratfolk Lore | 1 | ancestry | passive | it grants Additional Lore |
| Razorsharp Bite | 1 | ancestry | passive | rated 0 |
| Reinforced Chassis | 1 | ancestry | passive | it grants Chassis Deflection |
| Reptile Rider | 1 | ancestry | passive | it grants Ride |
| Retractable Claws | 1 | ancestry | passive | rated 0 |
| Riftmarked | 1 | ancestry | passive | it grants Oddity Identification |
| Rimesoul | 1 | ancestry | passive | rated 0 |
| Rivethun Disciple | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rock Runner | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rough Rider | 1 | ancestry | passive | it grants Ride |
| Round Ears | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ru-shi | 1 | ancestry | passive | it grants Eye for Numbers |
| Saber Teeth | 1 | ancestry | passive | rated 0 |
| Sage of Scattered Leaves | 1 | ancestry | passive | it grants Additional Lore |
| Samsaran Lore | 1 | ancestry | passive | it grants Additional Lore |
| Samsaran Weapon Memory | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sarangay Lore | 1 | ancestry | passive | it grants Additional Lore |
| Scales of Steel | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scaly Hide | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scamper Underfoot | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scavenger's Search | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scholar's Inheritance | 1 | ancestry | passive | it grants Alchemical Crafting |
| Scorched on the Crackling Mountain | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scuttle Up | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sea Legs | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Seasong | 1 | ancestry | passive | it grants Virtuosic Performer |
| Seedpod | 1 | ancestry | passive | rated 0 |
| Sensitive Nose | 1 | ancestry | passive | rated 0 |
| Shiny Button Eyes | 1 | ancestry | passive | it grants Canny Acumen |
| Shoony Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shrouded Mien | 1 | ancestry | passive | it grants Lengthy Diversion |
| Silent Stone | 1 | ancestry | passive | it grants Terrain Stalker |
| Sinister Appearance | 1 | ancestry | passive | it grants Intimidating Glare |
| Skull Creeper | 1 | ancestry | passive | it grants Intimidating Glare |
| Slag May | 1 | ancestry | passive | rated 0 |
| Slither | 1 | ancestry | passive | it grants Quick Squeeze |
| Smashing Tail | 1 | ancestry | passive | rated 0 |
| Snare Setter | 1 | ancestry | passive | it grants Snare Crafting |
| Sociable | 1 | ancestry | passive | it grants Hobnobber |
| Social Camouflage | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Speak with Bats | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spelunker | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spine Stabber | 1 | ancestry | passive | rated 0 |
| Spirit Coffin | 1 | ancestry | passive | rated 0 |
| Springsoul | 1 | ancestry | passive | rated -0.35 |
| Sprite's Spark | 1 | ancestry | passive | rated 0.01 |
| Star Orb | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Startling Appearance (Fleshwarp) | 1 | ancestry | passive | it grants Intimidating Glare |
| Steelhoof | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stonemason's Eye | 1 | ancestry | passive | it grants Specialty Crafting |
| Storm's Lash | 1 | ancestry | passive | rated -0.23 |
| Stormsoul | 1 | ancestry | passive | rated 0 |
| Story Crooner | 1 | ancestry | passive | it grants Impressive Performance |
| Straveika | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Striking Retribution | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Strix Defender | 1 | ancestry | passive | rated 0 |
| Strix Lore | 1 | ancestry | passive | it grants Additional Lore |
| Sublime Mobility | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Suli-jann | 1 | ancestry | passive | it grants Forager |
| Summiting Dragonblood | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sure Feet | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Surface Culture | 1 | ancestry | passive | it grants Additional Lore |
| Surki Lore | 1 | ancestry | passive | it grants Additional Lore |
| Surki Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Svetocher | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Swift | 1 | ancestry | passive | rated 0 |
| Tangle of Limbs | 1 | ancestry | passive | it grants Titan Wrestler |
| Tanuki Lore | 1 | ancestry | passive | it grants Additional Lore |
| Tengu Lore | 1 | ancestry | passive | it grants Additional Lore |
| Tengu Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tinkering Fingers | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Titan Slinger | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tooth and Claw | 1 | ancestry | passive | rated 0 |
| Traveler's Counsel | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tripkee Lore | 1 | ancestry | passive | it grants Additional Lore |
| Tripkee Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tusks (Half-Orc) | 1 | ancestry | passive | rated 0 |
| Tusks (Orc) | 1 | ancestry | passive | rated 0 |
| Unassuming Dedication | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unburdened Iron | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Undead Hunter | 1 | ancestry | passive | rated -0.04 |
| Unfettered Halfling | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unwavering Guide | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vampire Lore | 1 | ancestry | passive | it grants Additional Lore |
| Vanara Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vanara Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vicious Incisors | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Viking Shieldbearer | 1 | ancestry | passive | rated -0.03 |
| Virga May | 1 | ancestry | passive | rated -0.23 |
| Vishkanya Lore | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vishkanya Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Voice of the Night | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warren Friend | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warren Navigator | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Watchful Halfling | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Water Nagaji | 1 | ancestry | passive | rated 0 |
| Waterweave Tripkee | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wayang Lore | 1 | ancestry | passive | it grants Additional Lore |
| Wayang Weapon Familiarity | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Weight of Experience | 1 | ancestry | passive | it grants Assurance |
| Well-Met Traveler | 1 | ancestry | passive | it grants Hobnobber |
| Wilderness Born | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wisdom from Another Life | 1 | ancestry | passive | it grants Additional Lore |
| Woodcraft | 1 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Woodworker | 1 | ancestry | passive | it grants Specialty Crafting |
| Yaoguai Historian | 1 | ancestry | passive | it grants Additional Lore |
| You're So Cute! | 1 | ancestry | passive | it grants Impressive Performance |
| Advanced Targeting System | 5 | ancestry | passive | rated -0.04 |
| Ageless Patience | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ambush Awareness | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Amorphous Aspect | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| And Will Do So Once More | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Soul Siblings | 5 | ancestry | passive | a spell the engine doesn't cast |
| Animal Speaker | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Apprentice Sea Witch | 5 | ancestry | passive | rated -0.1 |
| Aquatic Conversationalist | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcane Safeguards | 5 | ancestry | passive | it grants Resist Magic |
| Athletic Might | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Beast of Burden | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Blast Resistance | 5 | ancestry | passive | rated 0 |
| Blood Like Water | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bloodsoaked Dash | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Briny Beverage | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Call the First Tools | 5 | ancestry | 3 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ceremony of Sunlight | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Chemical Trail | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Climbing Claws | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Colugo's Traversal | 5 | ancestry | passive | a spell the engine doesn't cast |
| Cunning Tinker | 5 | ancestry | passive | a spell the engine doesn't cast |
| Deadly Aspect | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Defy Death | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Devilish Wiles | 5 | ancestry | passive | rated -0.15 |
| Distant Archer | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Distant Cackle | 5 | ancestry | passive | a spell the engine doesn't cast |
| Dogfang Bite | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Draconic Scent | 5 | ancestry | passive | rated 0 |
| Duck! | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Earthbond | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Spark | 5 | ancestry | passive | rated 0 |
| Elven Instincts | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Embodied Dreadnought Subjectivity | 5 | ancestry | passive | it grants Hefty Hauler |
| Empathic Calm | 5 | ancestry | passive | rated -0.15 |
| Empathy Incarnate | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Energize Wings | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Enthralling Allure | 5 | ancestry | passive | rated -0.15 |
| Extraplanar Supplication | 5 | ancestry | passive | rated -0.04 |
| Feathered Cloak | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fey Disguise | 5 | ancestry | passive | rated 0 |
| Fey Influence | 5 | ancestry | passive | rated -0.46 |
| Fierce Grasp | 5 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fighting Horn | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Finned Ridges | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fluid Contortionist | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Friend of the Family | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Friendform | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gecko's Grip | 5 | ancestry | passive | it grants Combat Climber |
| Greater Animal Senses | 5 | ancestry | passive | rated 0 |
| Hardened Chassis | 5 | ancestry | passive | rated 0.05 |
| Hybrid Shape | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Infiltration Automaton | 5 | ancestry | passive | rated 0 |
| Inhale, Exhale! | 5 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Integrated Armament | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inured to the Heat | 5 | ancestry | passive | rated 0 |
| Juvenile Flight | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Labyrinthine Echoes | 5 | ancestry | passive | a spell the engine doesn't cast |
| Leaf Transformation | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lightless Litheness | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Magical Resistance | 5 | ancestry | passive | rated 0 |
| Marine Ally | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Martial Experience | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Murderous Thorns | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Myriad Forms | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Natural Illusionist | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Natural Orienteering | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Nephilim Resistance | 5 | ancestry | passive | rated 0 |
| No Hands, No Problem | 5 | ancestry | passive | a spell the engine doesn't cast |
| Nothing but Fluff | 5 | ancestry | passive | rated 0 |
| Noxious Odor | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Offensive Analysis | 5 | ancestry | passive | rated -0.04 |
| Oni's Mask | 5 | ancestry | passive | rated 0 |
| Past Life | 5 | ancestry | passive | it grants Additional Lore |
| Planar Resilience | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Practiced Paddler | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Precious Alloys | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Prodigious Climber | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Protective Claws | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Protective Sheath | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Protective Subroutine | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Proud Mentor | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rat Magic | 5 | ancestry | passive | a spell the engine doesn't cast |
| Replicate | 5 | ancestry | passive | rated 0 |
| Right-Hand Blood | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scar-Thick Skin | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shadowplay | 5 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shadowy Disguise | 5 | ancestry | passive | rated 0 |
| Shared Luck (Halfling) | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sheltering Slab | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shoki's Argument | 5 | ancestry | passive | rated 0 |
| Signature Weapon | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skilled Climber | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skillful Climber | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skillful Tail | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sleep of the Reborn | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Speak with Kindred | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Speaker in Training | 5 | ancestry | passive | rated -0.13 |
| Spirit Soother | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stem the Tide | 5 | ancestry | passive | rated 0 |
| Strong of Wing | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Strong Tail | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Supernatural Charm | 5 | ancestry | passive | rated -0.15 |
| Swift Swimmer | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Swimming Poppet | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tengu Feather Fan | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| The Moon Weaver's Art | 5 | ancestry | passive | a spell the engine doesn't cast |
| Thrown Voice | 5 | ancestry | passive | a spell the engine doesn't cast |
| Tranquil Sanctuary | 5 | ancestry | passive | rated -0.15 |
| Transposable Compliance | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tree's Ward | 5 | ancestry | passive | rated 0 |
| Undead Slayer | 5 | ancestry | passive | rated 0 |
| Vandal | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Venom Spit | 5 | ancestry | passive | rated 0 |
| Voice of the Elements | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warding Jewel | 5 | ancestry | passive | rated 0.04 |
| Wavetouched Paragon | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wildborn Adept | 5 | ancestry | passive | rated 0 |
| Zip! Zoom! | 5 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Abjure the False Kin | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aboleth Transmutation | 9 | ancestry | passive | a spell the engine doesn't cast |
| Agathion Magic | 9 | ancestry | passive | rated -0.1 |
| Aggravating Scratch | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Analyze Information | 9 | ancestry | passive | a spell the engine doesn't cast |
| Ancestral Form | 9 | ancestry | passive | rated -0.49 |
| Ancestral Healer | 9 | ancestry | passive | a spell the engine doesn't cast |
| Ancillary Motes | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Summoner | 9 | ancestry | passive | rated -0.34 |
| Arcane Camouflage | 9 | ancestry | passive | rated -0.21 |
| Asura Magic | 9 | ancestry | passive | rated 0 |
| Azarketi Purification | 9 | ancestry | passive | a spell the engine doesn't cast |
| Bark and Tendril | 9 | ancestry | passive | rated 0 |
| Between the Scales | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Blood Must Have Blood | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bloodletting Fangs | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bone Caller | 9 | ancestry | passive | a spell the engine doesn't cast |
| Bone Missile | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Breath Like Honey | 9 | ancestry | passive | rated -0.14 |
| Brilliant Vision | 9 | ancestry | passive | rated 0 |
| Call of Elysium | 9 | ancestry | passive | rated 0 |
| Captivating Curiosity | 9 | ancestry | passive | rated -0.14 |
| Catrina's Presence | 9 | ancestry | passive | rated -0.23 |
| Cautious Curiosity | 9 | ancestry | passive | rated 0 |
| Cave Climber | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Celestial Magic | 9 | ancestry | passive | rated -0.02 |
| Ceremony of Aeon's Guidance | 9 | ancestry | passive | rated -0.1 |
| Ceremony of Aeon's Shield | 9 | ancestry | passive | rated 0 |
| Ceremony of Strengthened Hand | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Coating of Slime | 9 | ancestry | passive | rated 0 |
| Cooperative Soul | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Coral Detoxification | 9 | ancestry | 2 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Core Attunement | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cunning Climber | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Demon Hunter | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dig up Secrets | 9 | ancestry | passive | a spell the engine doesn't cast |
| Djinni Magic | 9 | ancestry | passive | rated -0.1 |
| Draconic Paragon | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dragon Grip | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dragonblood Paragon | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Duskwalker Magic | 9 | ancestry | passive | a spell the engine doesn't cast |
| Efreeti Magic | 9 | ancestry | passive | rated -0.06 |
| Emissary Assistance | 9 | ancestry | passive | a spell the engine doesn't cast |
| Endless Memories | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Envenom Strike | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Expert Longevity | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fade Away | 9 | ancestry | passive | rated -0.12 |
| Fey Magic | 9 | ancestry | passive | rated -0.13 |
| Fiendish Magic | 9 | ancestry | passive | rated -0.12 |
| First World Adept | 9 | ancestry | passive | rated -0.02 |
| Flower Magic | 9 | ancestry | passive | rated 0 |
| Formidable Breath | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fortuitous Shift | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Full Flight | 9 | ancestry | passive | rated 0 |
| Fully Flighted | 9 | ancestry | passive | rated 0 |
| Garuda Magic | 9 | ancestry | passive | rated 0 |
| Grandmother's Wisdom | 9 | ancestry | passive | a spell the engine doesn't cast |
| Green Dash | 9 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gripping Limbs | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Guiding Luck | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hardy Traveler | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hefting Shadow | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hero's Wings | 9 | ancestry | passive | rated 0 |
| Heroes' Call | 9 | ancestry | passive | rated -0.03 |
| Home in the Deep | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Horn and Bone Incantation | 9 | ancestry | passive | rated 0 |
| Hypnotic Gaze | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Improvisation | 9 | ancestry | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inner Breath | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Internal Respirator | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Into the Sky | 9 | ancestry | passive | rated 0 |
| Irrepressible (Halfling) | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Jalmeri Rakshasa Magic | 9 | ancestry | passive | rated 0 |
| Janni Hospitality | 9 | ancestry | passive | a spell the engine doesn't cast |
| Janni Magic | 9 | ancestry | passive | rated -0.06 |
| Kizidhar Magic | 9 | ancestry | passive | rated -0.12 |
| Kodama Call | 9 | ancestry | passive | a spell the engine doesn't cast |
| Legendary Size | 9 | ancestry | passive | rated -0.06 |
| Lesser Augmentation | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lingering Echoes | 9 | ancestry | passive | a spell the engine doesn't cast |
| Many Guises (Kitsune) | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Marid Magic | 9 | ancestry | passive | rated -0.14 |
| Mentor of Legends | 9 | ancestry | passive | rated -0.03 |
| Methodical Magic | 9 | ancestry | passive | rated -0.12 |
| Morrigna's Spider Affinity | 9 | ancestry | passive | rated 0 |
| Mountain's Stoutness | 9 | ancestry | passive | rated 0.02 |
| Natural Magnetism | 9 | ancestry | passive | rated -0.14 |
| Night Magic | 9 | ancestry | passive | rated -0.7 |
| Offensive Subroutine | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pack Tactics | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Persistent Odor | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pervasive Superstition | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Phantom Orchestra | 9 | ancestry | passive | rated 0 |
| Piercing Quills | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Plant Soul Siblings | 9 | ancestry | passive | a spell the engine doesn't cast |
| Political Virtuoso | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Qlippoth Magic | 9 | ancestry | passive | rated 0 |
| Quietus Strikes | 9 | ancestry | passive | rated 0 |
| Rakshasa Magic | 9 | ancestry | passive | rated 0 |
| River Adaptation | 9 | ancestry | passive | a spell the engine doesn't cast |
| Rokoan Arts | 9 | ancestry | passive | a spell the engine doesn't cast |
| Sash of the Wind | 9 | ancestry | passive | rated 0 |
| Scalding Spit | 9 | ancestry | passive | rated 0 |
| Scaling Poppet | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scarlet Strands | 9 | ancestry | passive | rated -0.11 |
| Secrets of the Past | 9 | ancestry | passive | a spell the engine doesn't cast |
| Sense Thoughts | 9 | ancestry | passive | rated 0 |
| Serpentine Swimmer | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shaitan Magic | 9 | ancestry | passive | rated -0.02 |
| Siphon Torment | 9 | ancestry | passive | a spell the engine doesn't cast |
| Skeletal Resistance | 9 | ancestry | passive | rated 0 |
| Soaring Form | 9 | ancestry | passive | rated 0 |
| Sodbuster | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Speaker's Defense | 9 | ancestry | passive | rated -0.12 |
| Spiritual Echo | 9 | ancestry | passive | rated 0 |
| Squad Tactics | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stonewalker | 9 | ancestry | passive | a spell the engine doesn't cast |
| Strand Strider | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Strong Swimmer | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Studious Adept | 9 | ancestry | passive | rated 0 |
| Towering Growth | 9 | ancestry | passive | rated -0.06 |
| Tree Climber (Elf) | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| True Dragon's Flight | 9 | ancestry | passive | rated 0 |
| Unhampered Passage | 9 | ancestry | passive | rated 0 |
| Velstrac Magic | 9 | ancestry | passive | rated -0.11 |
| Web Hunter | 9 | ancestry | passive | rated 0 |
| Wheedle and Jig | 9 | ancestry | passive | rated -0.14 |
| Whispers in the Night | 9 | ancestry | passive | a spell the engine doesn't cast |
| Wind God's Fan | 9 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| World-Protector's Hospitality | 9 | ancestry | passive | a spell the engine doesn't cast |
| Adamantine Mantra | 13 | ancestry | passive | rated -0.17 |
| Ancestor's Rage | 13 | ancestry | passive | rated -0.37 |
| Ancestor's Transformation | 13 | ancestry | passive | rated 0 |
| Arboreal Conversationalist | 13 | ancestry | passive | a spell the engine doesn't cast |
| Arcane Locomotion | 13 | ancestry | passive | rated 0 |
| Arise, Ye Worthy! | 13 | ancestry | passive | rated 0 |
| Astral Blink | 13 | ancestry | passive | a spell the engine doesn't cast |
| Awaken the Obake | 13 | ancestry | passive | rated -0.11 |
| Azarketi Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bone Investiture | 13 | ancestry | passive | rated -0.37 |
| Burrowing Tripkee | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Call of the Green Man | 13 | ancestry | passive | rated 0 |
| Celestial Mercy | 13 | ancestry | passive | rated 0 |
| Celestial Strikes | 13 | ancestry | passive | rated 0 |
| Ceremony of Growth | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Conrasu Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Consistent Surge | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Continuous Assault | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Debilitating Breath | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Delver | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Digger | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dire Form | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Draconic Veil | 13 | ancestry | passive | rated 0 |
| Eldritch Calm | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Enlarged Chassis | 13 | ancestry | passive | rated 0.03 |
| Fiendish Strikes | 13 | ancestry | passive | rated 0 |
| Flames of Vision | 13 | ancestry | passive | rated -0.31 |
| Flower Chimera | 13 | ancestry | passive | rated 0.05 |
| Generation Digger | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Genie Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghoran Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gift of the Moon | 13 | ancestry | passive | rated -0.18 |
| Glamour | 13 | ancestry | passive | a spell the engine doesn't cast |
| Hag Magic | 13 | ancestry | passive | rated -0.13 |
| Heart of Earth | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hydraulic Maneuvers | 13 | ancestry | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| I Sense Malevolence | 13 | ancestry | passive | rated 0 |
| Iivlar's Boundary Break | 13 | ancestry | passive | rated -0.02 |
| Impossible Gossip | 13 | ancestry | passive | a spell the engine doesn't cast |
| Improved Signature Weapon | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Ferocity | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Luck (Halfling) | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Invisible Trickster | 13 | ancestry | passive | rated -0.05 |
| Irriseni Ice-Witch | 13 | ancestry | passive | rated 0 |
| Iruxi Spirit Strike | 13 | ancestry | passive | rated 0 |
| Jinx Glutton | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Jotun's Restoration | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Kijimuna Whistle | 13 | ancestry | passive | rated -0.48 |
| Lifeblood's Call | 13 | ancestry | passive | rated 0 |
| Light-Bending Jewel | 13 | ancestry | passive | rated -0.11 |
| Linguistic Revival | 13 | ancestry | passive | a spell the engine doesn't cast |
| Memory of Mastery | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Metal-veined Strikes | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Miraculous Medic | 13 | ancestry | passive | rated 0 |
| Mischievous Tail | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monkey Spirits | 13 | ancestry | passive | a spell the engine doesn't cast |
| None Shall Know | 13 | ancestry | passive | rated 0 |
| One with Earth | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Phantom Charm | 13 | ancestry | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Primal Rampage | 13 | ancestry | passive | rated 0 |
| Rapid Pheromone Recovery | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reimagine | 13 | ancestry | passive | a spell the engine doesn't cast |
| Resist Ruin | 13 | ancestry | passive | rated -0.15 |
| Scrutinizing Gaze | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sea Witch | 13 | ancestry | passive | rated 0 |
| Secret Eyes | 13 | ancestry | passive | a spell the engine doesn't cast |
| Shadow Pact | 13 | ancestry | passive | a spell the engine doesn't cast |
| Shadow's Assault | 13 | ancestry | passive | rated -0.08 |
| Shaitan Skin | 13 | ancestry | passive | rated 0 |
| Sheltering Jewel | 13 | ancestry | passive | rated 0 |
| Shory Aerialist | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skeleton Commander | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skirt the Light | 13 | ancestry | passive | a spell the engine doesn't cast |
| Slip Sideways | 13 | ancestry | passive | a spell the engine doesn't cast |
| Spiritual Headhunter | 13 | ancestry | passive | a spell the engine doesn't cast |
| Splendid Illusion | 13 | ancestry | passive | a spell the engine doesn't cast |
| Stone Soul Siblings | 13 | ancestry | passive | a spell the engine doesn't cast |
| Suli Amir | 13 | ancestry | passive | rated -0.05 |
| Summon Air Elemental | 13 | ancestry | passive | rated -0.27 |
| Summon Earth Elemental | 13 | ancestry | passive | rated -0.28 |
| Summon Fire Elemental | 13 | ancestry | passive | rated -0.64 |
| Summon Metal Elemental | 13 | ancestry | passive | rated -0.23 |
| Summon Nephilim Kin | 13 | ancestry | passive | rated -0.53 |
| Summon Water Elemental | 13 | ancestry | passive | rated -0.38 |
| Summon Wood Elemental | 13 | ancestry | passive | rated -0.23 |
| Swamp Gas Form | 13 | ancestry | passive | rated -0.12 |
| Telluric Power | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thunder God's Fan | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Toppling Dance | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Truespeech | 13 | ancestry | passive | a spell the engine doesn't cast |
| Unbreakable-er Goblin | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unfettered Growth | 13 | ancestry | passive | rated -0.14 |
| Unrivaled Builder | 13 | ancestry | passive | a spell the engine doesn't cast |
| Vanara Battle Clarity | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vanara Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Violent Vines | 13 | ancestry | passive | rated -0.14 |
| Vishkanya Weapon Expertise | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| War Conditioning | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warren Digger | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wild-Haired Fury | 13 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wooden Mantle | 13 | ancestry | passive | rated 0 |
| Animal Swiftness | 17 | ancestry | passive | rated 0 |
| Ascendant Blood | 17 | ancestry | passive | a spell the engine doesn't cast |
| Axial Recall | 17 | ancestry | passive | a spell the engine doesn't cast |
| Bend Space | 17 | ancestry | passive | a spell the engine doesn't cast |
| Boneyard Acquaintance | 17 | ancestry | passive | rated 0.15 |
| Boneyard's Call | 17 | ancestry | passive | a spell the engine doesn't cast |
| Breath of Calamity | 17 | ancestry | passive | rated -0.07 |
| Ceremony of Sun's Gift | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Core Cannon | 17 | ancestry | 2 actions | rated -0.37 |
| Crone's Cruelty | 17 | ancestry | passive | rated -0.14 |
| Dissolution's Sovereignty | 17 | ancestry | passive | rated -1.03 |
| Divine Declaration | 17 | ancestry | passive | rated -0.06 |
| Dragonet Immunities | 17 | ancestry | passive | rated 0 |
| Eternal Wings (Nephilim) | 17 | ancestry | passive | rated -0.02 |
| Eternal Wings (Sylph) | 17 | ancestry | passive | rated -0.02 |
| Favor of Heaven | 17 | ancestry | passive | rated -0.08 |
| Fearsome Form | 17 | ancestry | passive | rated -0.09 |
| Flourish and Ruin | 17 | ancestry | passive | rated -0.08 |
| Forge-Blessed Shot | 17 | ancestry | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Form of the Beloved Mother | 17 | ancestry | passive | rated -0.12 |
| Fossil Rider | 17 | ancestry | passive | rated -0.09 |
| Ghoran's Wrath | 17 | ancestry | passive | a spell the engine doesn't cast |
| Greater than the Sum | 17 | ancestry | passive | rated -0.04 |
| Homeward Bound | 17 | ancestry | passive | a spell the engine doesn't cast |
| Into the Labyrinth | 17 | ancestry | passive | a spell the engine doesn't cast |
| Jotun's Heart | 17 | ancestry | passive | rated 0.04 |
| Jotun's Transposition | 17 | ancestry | passive | a spell the engine doesn't cast |
| Legendary Monster | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Merge with the Source | 17 | ancestry | passive | rated 0 |
| Mooneater | 17 | ancestry | passive | rated -0.02 |
| Necromantic Heir | 17 | ancestry | passive | rated -0.01 |
| Nodal Regeneration | 17 | ancestry | passive | rated -0.13 |
| Offensive Odor | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pierce the Light | 17 | ancestry | passive | a spell the engine doesn't cast |
| Potent Nectar | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Prismatic Scales | 17 | ancestry | passive | rated 0 |
| Reflect Foe | 17 | ancestry | passive | rated -1.03 |
| Regrowth | 17 | ancestry | passive | rated -0.13 |
| Reliable Luck | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Restitch | 17 | ancestry | passive | rated -0.13 |
| Scion Transformation | 17 | ancestry | passive | rated 0.06 |
| Soaring Poppet | 17 | ancestry | passive | rated -0.02 |
| Stone Form | 17 | ancestry | passive | rated 0 |
| Stonegate | 17 | ancestry | passive | a spell the engine doesn't cast |
| Storm Form | 17 | ancestry | passive | rated 0 |
| Stormy Heart | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Strength of Eight Legions | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Symphony of Blood | 17 | ancestry | passive | rated -0.03 |
| This Time, Bring the Body | 17 | ancestry | passive | a spell the engine doesn't cast |
| This Too Shall Pass | 17 | ancestry | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Transcend the Azimuth | 17 | ancestry | passive | rated 0 |
| Trickster Tengu | 17 | ancestry | passive | rated -0.14 |
| Underwater Volcano | 17 | ancestry | passive | rated -0.14 |
| Unfettering Prankster | 17 | ancestry | passive | a spell the engine doesn't cast |
| Wyrmling Flight | 17 | ancestry | passive | rated -0.02 |
| Agent of all Holds | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Alchemist Dedication | 2 | archetype | passive | it grants one of 2 |
| Aldori Duelist Dedication | 2 | archetype | passive | it grants Additional Lore |
| Alkenstar Agent Dedication | 2 | archetype | passive | it grants Lie to Me |
| Alter Ego Dedication | 2 | archetype | passive | it grants Assume a Role |
| Archaeologist Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Archer Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Barbarian Dedication | 2 | archetype | passive | rated 0.03 |
| Bard Dedication | 2 | archetype | passive | rated -0.31 |
| Battle Harbinger Dedication | 2 | archetype | passive | rated 0.05 |
| Bellflower Tiller Dedication | 2 | archetype | passive | rated 0 |
| Blackjacket Dedication | 2 | archetype | passive | it grants Additional Lore |
| Bloodrager Dedication | 2 | archetype | passive | rated -0.26 |
| Bounty Hunter Dedication | 2 | archetype | passive | it grants one of 2 |
| Bright Lion Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bullet Dancer Dedication | 2 | archetype | passive | it grants Bullet Dancer Stance |
| Captain Dedication | 2 | archetype | passive | it grants one of 2 |
| Captivator Dedication | 2 | archetype | passive | rated -0.31 |
| Champion Dedication | 2 | archetype | passive | it grants Deity |
| Chelaxian Scion Dedication | 2 | archetype | passive | it grants Additional Lore |
| Cleric Dedication | 2 | archetype | passive | rated -0.33 |
| Commander Dedication | 2 | archetype | passive | it grants Tactics |
| Corpse Tender Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crossbow Infiltrator Dedication | 2 | archetype | passive | it grants Infiltrator's Draw |
| Cultivator Dedication | 2 | archetype | passive | rated 0 |
| Dandy Dedication | 2 | archetype | passive | it grants Influence Rumor |
| Druid Dedication | 2 | archetype | passive | rated -0.26 |
| Eagle Knight Dedication | 2 | archetype | passive | it grants Additional Lore |
| Eldritch Researcher Dedication | 2 | archetype | passive | rated -0.26 |
| Exemplar Dedication | 2 | archetype | passive | it grants Divine Spark and Ikons |
| Familiar Master Dedication | 2 | archetype | passive | it grants Enhanced Familiar |
| Field Propagandist Dedication | 2 | archetype | passive | it grants Spread Propaganda |
| Fighter Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Firework Technician Dedication | 2 | archetype | passive | rated -0.4 |
| Geomancer Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghost Dedication | 2 | archetype | passive | rated 0.04 |
| Ghost Eater Dedication | 2 | archetype | passive | rated 0 |
| Ghoul Dedication | 2 | archetype | passive | rated 0 |
| Guardian Dedication | 2 | archetype | passive | it grants Taunt |
| Guerrilla Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gunslinger Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Harrower Dedication | 2 | archetype | passive | it grants Avoid Dire Fate |
| Hellbound Aspirant Dedication | 2 | archetype | passive | rated 0 |
| Hellknight Dedication | 2 | archetype | passive | rated 0 |
| Herbalist Dedication | 2 | archetype | passive | it grants Alchemical Crafting |
| Infernal Pactbreaker Dedication | 2 | archetype | passive | rated -0.33 |
| Inventor Dedication | 2 | archetype | passive | it grants Inventor |
| Investigator Dedication | 2 | archetype | passive | it grants On the Case |
| Juggler Dedication | 2 | archetype | passive | it grants Juggle |
| Kineticist Dedication | 2 | archetype | passive | rated 0 |
| Kitharodian Actor Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lastwall Sentry Dedication | 2 | archetype | passive | rated 0.05 |
| Lepidstadt Surgeon Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Linguist Dedication | 2 | archetype | passive | it grants Multilingual |
| Lion Blade Dedication | 2 | archetype | passive | it grants Additional Lore |
| Living Monolith Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Loremaster Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Magus Dedication | 2 | archetype | passive | rated -0.26 |
| Marine Marauder Dedication | 2 | archetype | passive | it grants Underwater Marauder |
| Marshal Dedication | 2 | archetype | passive | rated 0 |
| Martial Artist Dedication | 2 | archetype | passive | rated 0 |
| Mauler Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Medic Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monk Dedication | 2 | archetype | passive | rated 0 |
| Mummy Dedication | 2 | archetype | passive | rated 0 |
| Necromancer Dedication | 2 | archetype | passive | rated -0.31 |
| Oracle Dedication | 2 | archetype | passive | rated -0.33 |
| Overwatch Dedication | 2 | archetype | passive | rated 0 |
| Pactbinder Dedication | 2 | archetype | passive | it grants Binding Vow |
| Pactbound Dedication | 2 | archetype | passive | rated 0 |
| Pathfinder Agent Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Poisoner Dedication | 2 | archetype | passive | it grants Alchemical Crafting |
| Psychic Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ranger Dedication | 2 | archetype | passive | it grants Hunt Prey |
| Red Mantis Assassin Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rivethun Invoker Dedication | 2 | archetype | passive | rated -0.09 |
| Rivethun Involutionist Dedication | 2 | archetype | passive | rated -0.33 |
| Rogue Dedication | 2 | archetype | passive | rated 0 |
| Runescarred Dedication | 2 | archetype | passive | rated -0.26 |
| Runesmith Dedication | 2 | archetype | passive | it grants Solitary Invocation |
| Scout Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scroll Trickster Dedication | 2 | archetype | passive | it grants Trick Magic Item |
| Sentinel Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shieldmarshal Dedication | 2 | archetype | passive | it grants one of 2 |
| Sister of the Golden Erinys Dedication | 2 | archetype | passive | it grants Additional Lore |
| Snarecrafter Dedication | 2 | archetype | passive | it grants Snare Crafting |
| Soul Warden Dedication | 2 | archetype | passive | rated -0.33 |
| Spectral Dagger | 2 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spellshifter Dedication | 2 | archetype | passive | it grants one of 2 |
| Spellshot Dedication | 2 | archetype | passive | rated -0.26 |
| Spirit Warrior Dedication | 2 | archetype | passive | rated 0 |
| Staff Acrobat Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sterling Dynamo Dedication | 2 | archetype | passive | rated 0 |
| Stone Brawler Dedication | 2 | archetype | passive | rated -0.09 |
| Stonebound Dedication | 2 | archetype | passive | rated 0.05 |
| Student of Perfection Dedication | 2 | archetype | passive | it grants Qi Spells |
| Swashbuckler Dedication | 2 | archetype | passive | it grants one of 2 |
| Talisman Dabbler Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tattooed Historian Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thaumaturge Dedication | 2 | archetype | passive | rated -0.24 |
| Thlipit Contestant Dedication | 2 | archetype | passive | rated 0 |
| Twilight Speaker Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Undersea Privateer Dedication | 2 | archetype | passive | it grants Underwater Marauder |
| Vampire Dedication | 2 | archetype | passive | rated 0 |
| Verduran Shadow Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vindicator Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wandering Chef Dedication | 2 | archetype | passive | it grants one of 2 |
| Warrior of Legend Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Weapon Improviser Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Werecreature Dedication | 2 | archetype | passive | rated 0 |
| Wild Mimic Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Winged Warrior Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wizard Dedication | 2 | archetype | passive | rated -0.26 |
| Wrestler Dedication | 2 | archetype | passive | it grants Titan Wrestler |
| Wylderheart Dedication | 2 | archetype | passive | it grants Additional Lore |
| Zephyr Guard Dedication | 2 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Zombie Dedication | 2 | archetype | passive | rated -0.1 |
| Advanced Alchemy | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Always Ready | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Analyze Magic | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Actor | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Fleetness | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aristocratic Arms | 4 | archetype | passive | rated 0.05 |
| Armiger's Protection | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aura Enhancement | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Barbarian Resiliency | 4 | archetype | passive | rated 0 |
| Basic Defender | 4 | archetype | passive | rated 0.08 |
| Basic Devotion | 4 | archetype | passive | rated 0.05 |
| Basic Fury | 4 | archetype | passive | rated 0.03 |
| Basic Glory | 4 | archetype | passive | rated 0 |
| Basic Hunter's Trick | 4 | archetype | passive | rated -0.11 |
| Basic Kata | 4 | archetype | passive | rated 0 |
| Basic Maneuver | 4 | archetype | passive | rated 0.16 |
| Basic Witchcraft | 4 | archetype | passive | rated 0 |
| Battering Wings | 4 | archetype | passive | rated 0 |
| Beast Speaker | 4 | archetype | passive | a spell the engine doesn't cast |
| Brilliant Crafter | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Champion Resiliency | 4 | archetype | passive | rated 0 |
| Claws of the Dragon | 4 | archetype | passive | rated 0 |
| Clinging Climber | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crescent Cross Training | 4 | archetype | passive | it grants Crescent Spray |
| Crystal Keeper Dedication | 4 | archetype | passive | rated 0 |
| Cycle Spell | 4 | archetype | passive | rated -0.19 |
| Devout Magic | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Disturbing Defense | 4 | archetype | passive | rated 0 |
| Dousing Spell | 4 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Draconic Scent (Dragon Disciple) | 4 | archetype | passive | rated 0 |
| Elemental Existence | 4 | archetype | passive | it grants one of 10 |
| Elemental Familiar | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Substitution | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Emissary Familiar | 4 | archetype | passive | it grants one of 2 |
| Executioner Weapon Training | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Exemplar Resiliency | 4 | archetype | passive | rated 0 |
| Exorcist Dedication | 4 | archetype | passive | it grants one of 2 |
| Expert Backstabber | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eye of Ozem | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eyes of Night (Midnight Illusionist) | 4 | archetype | passive | rated 0 |
| Fast Swimmer | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Feral Senses | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fiendish Arms | 4 | archetype | passive | rated 0 |
| Fighter Resiliency | 4 | archetype | passive | rated 0 |
| Finishing Precision | 4 | archetype | passive | rated 0 |
| Folktales Lore | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ghostly Resistance | 4 | archetype | passive | rated 0 |
| Gossip Lore | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Guard's Fury | 4 | archetype | passive | it grants Rage |
| Guardian Resiliency | 4 | archetype | passive | rated 0 |
| Guerrilla Weaponry | 4 | archetype | passive | it grants Guerrilla Assault |
| Gusting Spell | 4 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Investigate Haunting | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Like a Fish in Water | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Listener's Boon | 4 | archetype | passive | it grants Domain Initiate |
| Manipulative Charm | 4 | archetype | passive | rated -0.36 |
| Marine Combat Training | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mask Familiar | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mercenary Motivation | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monk Resiliency | 4 | archetype | passive | rated 0 |
| Morning Side Dishes | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mortification | 4 | archetype | passive | rated -0.07 |
| Mountain Skin | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Petal Step | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pirate Combat Training | 4 | archetype | passive | it grants one of 2 |
| Psychic Duelist Dedication | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Psychopomp Familiar | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Raging Stories | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ranger Resiliency | 4 | archetype | passive | rated 0 |
| Reactive Striker | 4 | archetype | passive | rated 0 |
| Rising Blood Magic | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ritualist Dedication | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sacred Wilds Oath | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scales of the Dragon | 4 | archetype | passive | rated 0 |
| Seneschal Spell | 4 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Senses of the Bear | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Siege Ritualist | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Smile at Failure | 4 | archetype | passive | rated 0.02 |
| Snare Expert | 4 | archetype | passive | it grants Snare Crafting |
| Sneak Attacker | 4 | archetype | passive | rated 0 |
| Stone Guardian | 4 | archetype | passive | rated -0.62 |
| Stoney Skin | 4 | archetype | passive | rated -0.07 |
| Strange Script | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Surprise Attack | 4 | archetype | passive | rated 0.03 |
| Tactical Excellence | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| The Dead Tell Tales | 4 | archetype | passive | rated 0 |
| Tools of the Trade | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Trained Swimmer | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Triangulate | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unholy Pact | 4 | archetype | passive | rated 0 |
| Viking Weapon Familiarity | 4 | archetype | passive | rated -0.01 |
| Voice of Authority | 4 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Worm Sense | 4 | archetype | passive | rated 0 |
| Wormskin | 4 | archetype | passive | rated 0 |
| Adaptive Mask Familiar | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Additional Servings | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Defender | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Devotion | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Fury | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Glory | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Herbalism | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Hunter's Trick | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Kata | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Maneuver | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Poisoncraft | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcana of Iron | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Armor Specialist | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Artery Map | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Burning Spell | 6 | archetype | 1 action | rated -0.16 |
| Butterfly's Sting | 6 | archetype | passive | rated 0.06 |
| Cayden's Freedom | 6 | archetype | passive | it grants Liberate Self |
| Champion's Reaction | 6 | archetype | passive | rated 0.06 |
| Crown of the Saumen Kar | 6 | archetype | passive | rated 0 |
| Devil in Disguise | 6 | archetype | passive | rated 0 |
| Devout Blessing | 6 | archetype | passive | rated 0 |
| Discerning Gaze | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dismantle Spell | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Draconic Familiar | 6 | archetype | passive | it grants Pet |
| Expeditious Advance | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Expert Fireworks Crafter | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flexible Nexus | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flowing Palm Deflection | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fortune's Favor | 6 | archetype | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Grave Strength | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Guardian's Intercept | 6 | archetype | passive | rated 0.03 |
| Harbinger's Protection | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hellknight Preferment | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hellknight Signifer Preferment | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hellknight-Errant | 6 | archetype | passive | rated 0 |
| Illuminating Stories | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inscribed with Elders' Deeds | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Instinct Ability | 6 | archetype | passive | rated -0.08 |
| Intimidating Spell | 6 | archetype | 1 action | rated 0.02 |
| Knight Reclaimant Dedication | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Knight Vigilant Dedication | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Legion's Aim | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Liberate Soul | 6 | archetype | 2 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Performative Weapons Training | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Powerful Lash | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Predatory Claws | 6 | archetype | passive | rated 0 |
| Psi Development | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pure Legion Enforcer Dedication | 6 | archetype | passive | it grants Recognize Spell |
| Sacred Armaments | 6 | archetype | passive | rated 0 |
| Scholarly Defense | 6 | archetype | passive | rated 0 |
| Scout's Speed | 6 | archetype | passive | rated 0 |
| Sinbladed Spell | 6 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spellmaster Dedication | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spirit of the Blade | 6 | archetype | 1 action | rated -0.2 |
| Spiritual Secret | 6 | archetype | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stone Blood | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stone Blood (Stonebound) | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stonebound Magic | 6 | archetype | passive | rated -0.07 |
| Swordmaster Dedication | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Voluminous Vials | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Watch This! | 6 | archetype | reaction | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wild Speech | 6 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Accurate Swing | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Armored Resistance | 8 | archetype | passive | rated 0.07 |
| Deeper Dabbler | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elude the Divine | 8 | archetype | passive | it grants Slippery Secrets |
| Enhanced Psychopomp Familiar | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flickering Stories | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fortified Flesh | 8 | archetype | passive | rated 0.06 |
| Golem Grafter Dedication | 8 | archetype | passive | rated 0.02 |
| Hellknight Mobility | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Improved Elemental Blast | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Improvised Critical | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lethargy Poisoner | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lion's Fury | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monk Moves | 8 | archetype | passive | rated 0 |
| Monumental Maestro | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ooze Empathy | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Order Training | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ore Fists | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Palatine Strike | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Perfect Resistance | 8 | archetype | passive | rated 0 |
| Physical Training | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Practiced Guidance | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reflexive Grip | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Scarecrow | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shadowdancer Dedication | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skill Mastery | 8 | archetype | passive | rated 0 |
| Stalwart Chant | 8 | archetype | passive | rated 0 |
| Swallow Pain | 8 | archetype | passive | rated 0 |
| Swashbuckler's Speed | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unassailable Enforcer | 8 | archetype | passive | rated 0 |
| Unbelievable Luck | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unshaken in Iron | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Venomous Weapons | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vicious Fangs | 8 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| What Could Have Been | 8 | archetype | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| You Don't Smell Right | 8 | archetype | passive | rated 0 |
| Accursed Clay Fist | 10 | archetype | passive | rated 0 |
| Angel of Death | 10 | archetype | passive | rated 0 |
| Attunement to Stone | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Azure Fins | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Battle Scars | 10 | archetype | passive | rated 0 |
| Channel Rot | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Close Formation | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Counterclockwork Focus | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Deepening Devotion | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Exemplar Expertise | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eye for Smugglers | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Feast Planner | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gaze of Veracity | 10 | archetype | passive | rated 0 |
| Glutton for Flesh | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Growth Spell | 10 | archetype | 1 action | rated 0.01 |
| Hilt Hammer | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Horselord's Bond | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Familiar (Familiar Master) | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Into the Future | 10 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Keepsake of Power | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monk's Flurry | 10 | archetype | passive | rated 0 |
| Provocator Dedication | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rocky Flesh | 10 | archetype | passive | rated -0.01 |
| Rubbery Skin | 10 | archetype | passive | rated 0.03 |
| Shadow of Death | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shadow Sneak Attack | 10 | archetype | passive | rated 0.01 |
| Signifer's Sight | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stonebane | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Swift Sower | 10 | archetype | passive | rated -0.01 |
| Tales of the Road | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Traces of the Divine | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tunnel | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unbelievable Escape | 10 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wide Overwatch | 10 | archetype | passive | rated 0 |
| Advanced Firearm Familiarity | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Order Training | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aura of Confidence | 12 | archetype | passive | rated 0 |
| Diverse Weapon Expert | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Great Bear | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Greater Despair | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Intercepting Hand | 12 | archetype | passive | it grants Disarming Interception |
| Ironclad Fortitude | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Judgement of the Monolith | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Juggernaut's Fortitude | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Legs of Stone | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mass Delusion | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Master Spotter (Ranger) | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Order Cross-Training | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Perfection's Path | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Plentiful Snares | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reclaimant Plea | 12 | archetype | passive | rated -0.07 |
| Redirect Spell | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Second Ikon | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shake Off the Gods | 12 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Signifer Armor Expertise | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Surging Blood Magic | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tense Negotiator | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tunneling Claws | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Uncanny Suction | 12 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vexing Tempest | 12 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vigilant Benediction | 12 | archetype | passive | rated -0.13 |
| Virtuosic Dancer | 12 | archetype | passive | it grants Dancing Dodge |
| Consecrated Aura | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Defy Chains | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Immediate Rebuke | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| In the Horde's Grip | 14 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Iron Lung | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| March of Law | 14 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mortal Ascension | 14 | archetype | passive | rated -0.06 |
| Only My Doom May Claim Me | 14 | archetype | passive | rated 0 |
| Scarred Hide | 14 | archetype | passive | rated -0.18 |
| Sentinel's Orbit | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sixth Pillar Mastery | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Speak for the Gravelands | 14 | archetype | passive | it grants Geomancer Dedication |
| Stone Communion | 14 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wind-Tossed Spell | 14 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Adamantine Fists | 16 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bound in Ice | 16 | archetype | passive | rated 0 |
| Branding Spell | 16 | archetype | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Devil's Wings | 16 | archetype | passive | rated -0.03 |
| Fearsome Fangs | 16 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Heraldic Proclamation | 16 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Instrument of Death | 16 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Master Siege Engineer | 16 | archetype | passive | rated 0 |
| Touch Focus | 16 | archetype | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Exultant Blood Magic | 18 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eyes of God | 18 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mighty Wings | 18 | archetype | passive | rated -0.01 |
| Soaring Dynamo | 18 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spirit of Vigil | 18 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Icy Apotheosis | 20 | archetype | passive | rated 0 |
| Mortal Possibility | 20 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Peerless Captain | 20 | archetype | passive | rated 0 |
| Sky Master Mask | 20 | archetype | passive | rated 0.04 |
| Swordlord Exile | 20 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Synergistic Spell | 20 | archetype | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thick Hide Mask | 20 | archetype | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Disillusionment | 0 | bonus | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reveal Beasts | 0 | bonus | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Righteous Resistance | 0 | bonus | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sturdy Bindings | 0 | bonus | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Acute Vision | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Adrenaline Rush | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Agile Shield Grip | 1 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Alchemical Familiar | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ancestral Blood Magic | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Arcane Fists | 1 | class | passive | rated 0 |
| Bardic Lore | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bodyguard | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cauldron | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crossbow Crack Shot | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Deadly Simplicity | 1 | class | passive | its requirement, which the PC doesn't meet |
| Death Speaker | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Disarming Flair | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Diverse Lore | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Domain Initiate | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Familiar (Kineticist) | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eliminate Red Herrings | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Energized Spark | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Extended Kinesis | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Far Lobber | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fire Lung | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flexible Studies | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flying Blade | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Glyph Familiar | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Iron Repercussions | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Magus's Analysis | 1 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mental Buffer | 1 | class | passive | rated 0 |
| Monastic Archer Stance | 1 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monastic Weaponry | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Munitions Crafter | 1 | class | passive | it grants Alchemical Crafting |
| Nimble Reprisal | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Officer's Medical Training | 1 | class | passive | it grants Battle Medicine |
| Psychic Rapport | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Raging Intimidation | 1 | class | passive | rated 0.09 |
| Reach of the Dead | 1 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Rune-Singer | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sanctified Soul | 1 | class | passive | rated 0 |
| Scroll Thaumaturgy | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Seek the Hidden Glyphs | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shield Warfare | 1 | class | passive | rated 0 |
| Smithing Weapons | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spellbook Prodigy | 1 | class | passive | it grants Magical Shorthand |
| Sword and Pistol | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Takedown Expert | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Trap Finder | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tumble Behind (Rogue) | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Twin Stars | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Undead Familiar | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Undead Spotter | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unimpeded Step | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Untamed Form | 1 | class | passive | rated 0 |
| Variable Core | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Verdant Weapon | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Versatile Blasts | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vicious Vengeance | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vow of Mortal Defiance | 1 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Weight of Guilt | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Widen Spell | 1 | class | 1 action | rated -0.04 |
| Witch's Armaments | 1 | class | passive | rated -0.01 |
| Wortwitch | 1 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Acute Scent | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Athletic Strategist | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Brawling Focus | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Conceal Spell | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Defensive Armaments | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Energy Ablation | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Enhanced Familiar | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Enhanced Glyph Familiar | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Enhanced Undead Familiar | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Familiar's Language | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Grasping Spirits Spell | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hurl at the Horizon | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Kinetic Activation | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lightning Swap | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mental Balm | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Monster Warden | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Multifarious Muse | 2 | class | passive | rated 0.04 |
| Nonlethal Spell | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Oath of the Avenger | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Oath of the Defender | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Oath of the Slayer | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Propelling Sorcery | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Raise Haft | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reliable Squire | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reverse Engineer | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Smoke Bomb | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Spiritual Expansion Spell | 2 | class | 1 action | rated -0.03 |
| Strong Arm | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stunning Blows | 2 | class | passive | rated 0 |
| Swan Dive | 2 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Talisman Esoterica | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tumble Behind (Swashbuckler) | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vengeful Oath | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Versatile Font | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Voice of Elements | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warp Space | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warpriest's Armor | 2 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Accelerating Touch | 4 | class | passive | rated 0 |
| Alchemical Discoveries | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Area Armor | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aura of Despair | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bespell Strikes | 4 | class | free | rated -0.01 |
| Calculated Splash | 4 | class | passive | rated -0.02 |
| Courageous Advance | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cruelty | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cryptic Spell | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Directed Channel | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Divine Infusion | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Diving Armor | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Dread Striker | 4 | class | passive | rated 0 |
| Duo Dragon Kick | 4 | class | 2 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Efficient Alchemy (Alchemist) | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Energy Interceptor | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Expanded Domain Initiate | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Far Shot | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Flamboyant Athlete | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Follow the Threads of Fate | 4 | class | passive | it grants Unravel the Future |
| Form Control | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Gadget Specialist | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Greenwatch Initiate | 4 | class | passive | it grants one of 2 |
| Guarded Movement | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Homing Beacon | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| In Tune | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Invigorating Elixir | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Irezoko Tattoo | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Knowledge of Shapes | 4 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Leshy Familiar Secrets | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lie Detector | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lingering Chill | 4 | class | passive | rated -0.24 |
| Magical Trickster | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Melodious Spell | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Natural Swimmer | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Overwhelming Harm | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Poison Weapon | 4 | class | 1 action | rated -0.07 |
| Raging Athlete | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ritual Researcher | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sacral Lord | 4 | class | passive | rated -1.07 |
| Sacred Ground | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Security | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Snare Specialist | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Split Shot | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Steel on Steel | 4 | class | passive | rated -0.28 |
| Strategic Repose | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Student of the Staff | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| The Harder They Fall | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thoughtform Summoning | 4 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Through the Needle's Eye | 4 | class | passive | it grants Blinding of the Needle |
| Twirling Throw | 4 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Undying Conviction | 4 | class | passive | rated 0 |
| Advanced Monastic Weaponry | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Shooter | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Weapon Training | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Analyze Weakness | 6 | class | 1 action | rated -0.13 |
| Animal Skin | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Animal Strength | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Binding Serpents Celestial Arrow | 6 | class | passive | it grants Coiling Serpents |
| Cast Down | 6 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Combination Finisher | 6 | class | passive | rated 0 |
| Connect the Dots | 6 | class | 2 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Current Spell | 6 | class | 1 action | rated -0.02 |
| Debilitating Bomb | 6 | class | passive | rated 0.03 |
| Defensive Coordination | 6 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Directional Bombs | 6 | class | passive | rated 0.03 |
| Dragon Roar | 6 | class | 1 action | rated -0.08 |
| Elysium's Cadence | 6 | class | passive | it grants Set Free |
| Explosive Arrival | 6 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Far Throw | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fey Tracker | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Green Empathy | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Harmonize | 6 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inertial Barrier | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Insect Shape | 6 | class | passive | rated -0.04 |
| Jelly Body | 6 | class | passive | rated 0.04 |
| Medium's Awareness | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Motionless Cutter | 6 | class | passive | it grants Sever Four Dragonfly Wings |
| Munitions Machinist | 6 | class | passive | it grants Quick Alchemy |
| Nocturnal Senses | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ostentatious Arrival | 6 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Parallel Breakthrough | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reflexive Shield | 6 | class | passive | rated -0.11 |
| Riddle The Sphinx | 6 | class | passive | it grants Tangle in Riddle |
| Safeguard Spell | 6 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Selective Energy | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shield of Stone | 6 | class | passive | it grants Brandish the Gorgon's Gaze |
| Spirits' Interference | 6 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Syu Tak-nwa's Deadly Hair | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Wild Witch's Armaments | 6 | class | passive | rated 0.04 |
| Witch's Charge | 6 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Domain | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bond Conservation | 8 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bullseye | 8 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Call and Response | 8 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eclectic Skill | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elaborate Talisman Esoterica | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Explosion of Power | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Furious Bully | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Greater Security | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Familiar | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Infuse Void | 8 | class | 1 action | rated -0.05 |
| Instinctive Maneuvers | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Invulnerable Rager | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Martyr | 8 | class | 1 action | rated -0.04 |
| Mutant Physique | 8 | class | passive | its requirement, which the PC doesn't meet |
| Officer's Education | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Powerful Snares | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Remove Presence | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sly Striker | 8 | class | passive | rated 0.06 |
| Soaring Shape | 8 | class | passive | rated -0.35 |
| Sticky Bomb | 8 | class | passive | rated 0.02 |
| Surging Might | 8 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thoughtsense | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ubiquitous Gadgets | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Void Siphon | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Whispering Steps | 8 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Advanced Efficient Alchemy | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Agile Grace | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Breath of Vital Ash | 10 | class | passive | it grants Mark the Center |
| Courageous Assault | 10 | class | 1 action | rated 0.03 |
| Derring-Do | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Double, Double | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Shape | 10 | class | passive | rated -0.28 |
| Energy Fusion | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Entwined Energy Ki | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Expanded Splash | 10 | class | passive | rated 0.02 |
| Fearsome Brute | 10 | class | passive | rated 0 |
| Healing Transformation | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Heroic Recovery | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Journey of the Sky Chariot | 10 | class | passive | rated 0 |
| Master Monster Hunter | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mated Birds in Paired Flight | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Necromantic Lifesense | 10 | class | passive | rated 0 |
| Ongoing Strategy | 10 | class | passive | rated 0 |
| Overburdening Spell | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Overwhelming Energy | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Plant Shape | 10 | class | passive | rated -0.13 |
| Precise Debilitations | 10 | class | passive | rated -0.01 |
| Pristine Weapon | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Prodigal Rune-Singer | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Quickened Casting | 10 | class | free | rated 0.07 |
| Resilient Touch | 10 | class | passive | rated -0.03 |
| Shield of Faith | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Side by Side (Druid) | 10 | class | passive | rated 0.01 |
| Skeletal Extension | 10 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sneak Adept | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sure-Footed | 10 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Targeting Strike | 10 | class | passive | rated 0.05 |
| Thaumaturge's Investiture | 10 | class | passive | it grants Incredible Investiture |
| Unusual Composition | 10 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Amplifying Touch | 12 | class | passive | rated -0.02 |
| Archfiend Dedication | 12 | class | passive | rated 0 |
| Ascended Celestial Dedication | 12 | class | passive | it grants Bless Ally |
| Aura of Faith | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Avenging Runelord Dedication | 12 | class | passive | rated -0.14 |
| Become as Spirit | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Blood Sovereignty | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Boost Modulation | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Compliant Gold | 12 | class | passive | rated -0.13 |
| Defensive Recovery | 12 | class | 1 action | rated 0.01 |
| Dragon Shape | 12 | class | passive | rated 0.22 |
| Empiricist's Eye | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Familiar's Eyes | 12 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Forcible Energy | 12 | class | 1 action | rated -0.1 |
| Fortunate Blow | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Godling Dedication | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Greater Spiritual Evolution | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Heroic Scion Dedication | 12 | class | passive | it grants one of 2 |
| Intensify Investiture | 12 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Necromantic Deflection | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Overwhelming Breath | 12 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Petrified Skin | 12 | class | passive | rated 0 |
| Purifying Spell | 12 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Reinforced Skeleton | 12 | class | passive | rated 0.39 |
| Sanguine Mastery | 12 | class | passive | rated 0 |
| Side by Side (Ranger) | 12 | class | passive | rated 0.04 |
| Supreme Invigorating Elixir | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Terraforming Trickery | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| The Bigger They Are | 12 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Uncanny Bombs | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unshakable Grit | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Uplifting Winds | 12 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Warped by Rage | 12 | class | passive | it grants Spasm of the Berserker |
| Ascend | 14 | class | passive | rated -0.06 |
| Aura of Determination | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aura of Life | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aura of Righteousness | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bizarre Transformation | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Come at Me! | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Deity's Protection | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Destined Victory | 14 | class | passive | it grants Only You and I |
| Ebb and Flow | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Infinite Blades Celestial Arrow | 14 | class | passive | it grants Heaven Rains an Ending |
| Interweave Dispel | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Jousting Mount | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Lighter than Air | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Peerless Form | 14 | class | passive | rated 0 |
| Receive Prayers | 14 | class | passive | rated 0 |
| Reflect Harm | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Secondary Detonation Array | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shatter Space | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Showstopper | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sink and Swim | 14 | class | passive | it grants Water Transfer |
| Soaring Armor | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sow Spell | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vigorous Anthem | 14 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| We Are One | 14 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Cleansing Spell | 16 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Conduit of Void and Vitality | 16 | class | 2 actions | no card, and PF2e's rule elements on it change nothing a fight counts |
| Constant Levitation | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crown of Rule | 16 | class | passive | rated -0.42 |
| Enlightened Presence | 16 | class | passive | rated 0 |
| Eternal Blessing | 16 | class | passive | rated 0 |
| Exploitive Bomb | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Felicitous Riposte | 16 | class | passive | rated 0 |
| Gift of the Immortal Herb | 16 | class | passive | it grants Shed the Mortal Skin |
| Gird Champion | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Implement's Flight | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Legendary Monster Hunter | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mark of the Sage | 16 | class | passive | it grants A Challenge for Heroes |
| Monstrosity Shape | 16 | class | passive | rated 0.85 |
| Persistent Boost | 16 | class | passive | rated -0.06 |
| Portentous Spell | 16 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Remediate | 16 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Shroud of Ghosts | 16 | class | passive | rated -0.48 |
| Siphon Power | 16 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Target of Psychic Ire | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ubiquitous Snares | 16 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Branched Tree of Pain | 18 | class | passive | it grants Plant Thirty Barbs |
| Brutal Critical | 18 | class | passive | rated 0.04 |
| Celestial Form | 18 | class | passive | rated 0.01 |
| Contagious Spell | 18 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Diamond Fists | 18 | class | passive | rated 0.18 |
| Discordant Voice | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Echoing Channel | 18 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Echoing Spell | 18 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Effortless Reach | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Elemental Apotheosis | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eternal Composition | 18 | class | passive | rated 0 |
| Eyes Unclouded | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fiendish Form | 18 | class | passive | rated 0.01 |
| Perfect Protection | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Piercing Critical | 18 | class | passive | rated 0.02 |
| Power Hungry | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Primal Aegis | 18 | class | passive | rated 0 |
| Rejuvenating Touch | 18 | class | passive | rated 0.04 |
| Savage Critical | 18 | class | passive | rated 0 |
| Shield from Spells | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Split Hex | 18 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sunwrecker | 18 | class | passive | it grants Break the Sun's Legs |
| Unerring Shot | 18 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Autonomic Psychic Action | 20 | class | passive | rated 0 |
| Become Thought | 20 | class | passive | rated 0.33 |
| Bloodline Conduit | 20 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bloodline Mutation | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Deadly Strikes | 20 | class | passive | rated 0.13 |
| Enduring Quickness | 20 | class | passive | rated 0 |
| Eternal Boost | 20 | class | passive | rated 0 |
| Eternal Hero | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fiend Eternal | 20 | class | passive | rated 0 |
| Generational Rune-Singer | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Glorious Banner | 20 | class | passive | rated 0 |
| Kinetic Pinnacle | 20 | class | passive | rated 0 |
| Legendary Shot | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ley Line Conduit | 20 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Mystery Conduit | 20 | class | free | no card, and PF2e's rule elements on it change nothing a fight counts |
| Panache Paragon | 20 | class | passive | rated 0 |
| Perfect Readiness | 20 | class | passive | rated 0 |
| Sacred Defender | 20 | class | passive | rated -0.07 |
| Spellshape Mastery | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Superior Sight | 20 | class | passive | rated 0 |
| Supreme Spellstrike | 20 | class | passive | rated 0.16 |
| Timelessness | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unlimited Potential | 20 | class | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unstoppable Juggernaut | 20 | class | passive | rated -0.13 |
| Unyielding Force | 20 | class | passive | rated -0.15 |
| Weapon Supremacy | 20 | class | passive | rated 0 |
| You Can't Kill an Idea | 20 | class | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Adopted Ancestry | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Armor Proficiency | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Canny Acumen | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Diehard | 1 | general | passive | rated 0 |
| Different Worlds | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fast Recovery | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fleet | 1 | general | passive | rated 0 |
| Incredible Initiative | 1 | general | passive | rated 0.02 |
| Pet | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Toughness | 1 | general | passive | rated 0.01 |
| Weapon Proficiency | 1 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hireling Manager | 3 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Keen Follower | 3 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Robust Health | 3 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thorough Search | 3 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Untrained Improvisation | 3 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Bloodsense | 7 | general | passive | rated 0 |
| Supertaster | 7 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Incredible Investiture | 11 | general | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sanguine Tenacity | 11 | general | passive | rated 0 |
| Acrobatic Performer | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Assurance | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Contract Negotiator | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Crystal Healing | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Eye for Numbers | 1 | skill | 1 action | no card, and PF2e's rule elements on it change nothing a fight counts |
| Forager | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hefty Hauler | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Hobnobber | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Multilingual | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Natural Medicine | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Oddity Identification | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Pilgrim's Token | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ravening's Desperation | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Risky Surgery | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Seasoned | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Skill Training | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Specialty Crafting | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Steady Balance | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Stifle Flames | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Student of the Canon | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Terrain Expertise | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Underwater Marauder | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Virtuosic Performer | 1 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Armored Stealth | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Assured Identification | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Exhort the Faithful | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Familiar Oddities | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fresh Ingredients | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Godless Healing | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Intimidating Prowess | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Magical Shorthand | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Vasodilation | 2 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aurochs-Headed | 3 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Graft Technician | 3 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Inspired Memory | 3 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Know the Beat | 3 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Multilingual Cipher | 4 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Sociable Vow | 4 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Solo Dancer | 4 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Thorough Reports | 4 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Unassuming Laborer | 4 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Analyze Idiolect | 6 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Fluttering Misdirection | 6 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Forced Entry | 6 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Holistic Care | 6 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Slippery As An Eel | 6 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Aerobatics Mastery | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Entourage | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Quick Climb | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Quick Recognition | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Quick Swim | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Talent Envy | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Tumbling Theft | 7 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Boarding Party | 8 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Ilverani Purist | 8 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Insistent Command | 8 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Operatic Adventurer | 12 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Legendary Leader | 15 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |
| Legendary Tattoo Artist | 15 | skill | passive | no card, and PF2e's rule elements on it change nothing a fight counts |

### roleplay or nothing to automate (666)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Alabaster Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Aquatic Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Ash-Piercing Gaze | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Canopy Sight | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Cheek Pouches | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Consult the Stars | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Crawling Form | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Critter Shape | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Croak Talker | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Deep Vision | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Distracting Shadows | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Elemental Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Elucidating Vision | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Ember's Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Eyes of Night | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Folksy Patter | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Gloomseer | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Gravesight | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Hag's Sight | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Hoarder's Craw | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Hungry Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Jotun's Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Lightning Tongue | 1 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Nalinivati's Light | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Natural Performer | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Nephilim Eyes | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Nightvision Adaptation | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Nocturnal Tripkee | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Old Soul | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| One-Toed Hop | 1 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Orc Sight | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Pack Rat | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Pheromonal Message | 1 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Pierce the Darkness | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Ratspeak | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Razzle-Dazzle | 1 | ancestry | free | no card: roleplay or nothing to automate |
| Refined Motion in Darkness | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Serpent's Tongue | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Shadow Blending | 1 | ancestry | reaction | no card: roleplay or nothing to automate |
| Shadow of the Wilds | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Shapechanger's Intuition | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Share Thoughts | 1 | ancestry | passive | a spell the engine doesn't cast |
| Skittertalk | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Slink | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Sneaky | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Snow May | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Sunlit Vitality | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Surface Skimmer | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Swimmer's Guidance | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Throat Pocket | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Tupilaq Carver | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Twilight Dweller | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Very Sneaky | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Vibrant Display | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Winter Cat Senses | 1 | ancestry | passive | no card: roleplay or nothing to automate |
| Accommodating Mount | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Clever Shadow | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Coral Growth | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Cunning Hair | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Darkseer | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Dwarven Reinforcement | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Easily Dismissed | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Eat Fortune | 5 | ancestry | reaction | no card: roleplay or nothing to automate |
| Expert Drill Sergeant | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Fantastic Leaps | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Firesight | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Flexible Tail | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Forest Stealth | 5 | ancestry | 1 action | rated 0 |
| Growing Eel Friend | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Halfling Ingenuity | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Leshy Glide | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Lifesense | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Long Tongue | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Mist Child | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Plague Sniffer | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Ponpoko | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Prey Disguise | 5 | ancestry | passive | rated 0 |
| Pride Hunter | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Project Persona | 5 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Quick Stow (Ratfolk) | 5 | ancestry | free | no card: roleplay or nothing to automate |
| Read the Roots | 5 | ancestry | 2 actions | no card: roleplay or nothing to automate |
| Renewing Quills | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Ritual Reversion | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Sense Allies | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Speak with Flowers | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Speak with the Sleeping | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Swamp Stealth | 5 | ancestry | 1 action | rated 0 |
| Treacherous Earth | 5 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Unassuming Heroes | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Uncanny Awareness | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Venom Gulp | 5 | ancestry | passive | no card: roleplay or nothing to automate |
| Animal Magic | 9 | ancestry | passive | rated -0.1 |
| Big Mouth | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Briar Battler | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Close Quarters | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Dangle | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Dangle (Vanara) | 9 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Dragon Prince | 9 | ancestry | passive | rated -0.05 |
| Earthsense | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Eerie Compression | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Forever Among Humanity | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Four-Armed Aspect | 9 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Fox Trick | 9 | ancestry | free | no card: roleplay or nothing to automate |
| Greater Transformation | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Group Aid | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Guarded Thoughts | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Helpful Halfling | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Improvisational Warrior | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Larcenous Tail | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Life Leap | 9 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Mud Boat's Passage | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| No Evidence | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Overburn | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Overcrowd | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Ricocheting Leap | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Rouse the Dreaming Relic | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Sense for Trouble | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Shory Aeromancer | 9 | ancestry | passive | rated 0 |
| Smoke Sight | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Tongue Tether | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Two Truths | 9 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Witness of Earth | 9 | ancestry | passive | no card: roleplay or nothing to automate |
| Aquatic Adaptation | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Aquatic Camouflage | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Arcane Sight | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Camouflage Coat | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Ceaseless Shadows | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Daywalker | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Eternal Memories | 13 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Ferocious Beasts | 13 | ancestry | passive | rated -0.02 |
| Ferry Through Waves | 13 | ancestry | 2 actions | no card: roleplay or nothing to automate |
| Formation Master | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Germination of Resolve | 13 | ancestry | free | no card: roleplay or nothing to automate |
| Impose Order | 13 | ancestry | reaction | no card: roleplay or nothing to automate |
| Inspirit Hazard | 13 | ancestry | reaction | no card: roleplay or nothing to automate |
| One with the Wild | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Purge Sins | 13 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Reanimating Spark | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Redirect Attention | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Rehydration | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| See the Unseen | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Shinstabber | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Skittering Sneak | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Spew Tentacles | 13 | ancestry | passive | rated -0.06 |
| Swift Eel Mount | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Translucent Skin | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Tumbling Diversion | 13 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Unconventional Expertise | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Universal Longevity | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Venom Purge | 13 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Very, Very Sneaky | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Wandering Heart | 13 | ancestry | passive | no card: roleplay or nothing to automate |
| Winged Mantle | 13 | ancestry | 1 action | no card: roleplay or nothing to automate |
| Along the Deep River | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Form of The Sea | 17 | ancestry | passive | rated 0 |
| Fox Possession | 17 | ancestry | passive | rated -0.02 |
| Gentle Death and Rebirth | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Impaling Bone | 17 | ancestry | passive | rated -0.11 |
| Perfected Gamtu | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Ten Lives | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Twist Healing | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Unbound Leaper | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Vicious Venom | 17 | ancestry | passive | no card: roleplay or nothing to automate |
| Additional Follower | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Axe Climber | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Big Game Trapper | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Blessed Sacrifice | 4 | archetype | passive | rated -0.01 |
| Bullying Staff | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Careful Explorer | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Decry Thief | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Dimensional Pilfer | 4 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Empathic Envoy | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Environmental Explorer | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Experienced Harrower | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Harvest Moon | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Into The Storm | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Just the Tool | 4 | archetype | 1 action | no card: roleplay or nothing to automate |
| Lion's Might | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Magical Edification | 4 | archetype | passive | rated -0.72 |
| Magical Scholastics | 4 | archetype | passive | rated -0.72 |
| Observant Explorer | 4 | archetype | passive | no card: roleplay or nothing to automate |
| One with the Land | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Quick Juggler | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Repeating Hand Crossbow Training | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Shadow Spells | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Shared Attunement | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Shorthanded | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Spyglass Modification | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Stargazer's Eyes | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Subtle Shift | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Take the Wheel | 4 | archetype | 1 action | no card: roleplay or nothing to automate |
| The World Whispers | 4 | archetype | 1 action | no card: roleplay or nothing to automate |
| Wellspring Control | 4 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Arcana | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Blood Potency | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Breakthrough | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Concoction | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Death Dealing | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Deduction | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Dogma | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Element Control | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Field Training | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Flair | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Martial Magic | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Muse's Whispers | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Mysteries | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Rune Magic | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Shooting | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Synergy | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Thaumaturgy | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Thoughtform | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Trickery | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Wilding | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Advanced Witchcraft | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Animist's Power | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Arcane Sensitivity | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Cannon Corner Shot | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Cast Out | 6 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Disciple of Shade | 6 | archetype | passive | rated 0 |
| Duel Spell Advantage | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Echolocation | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Exigent Aura | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Expanded Elemental Magic | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Fade Presence | 6 | archetype | passive | rated 0 |
| Field Artillery | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Fleeting Shadow | 6 | archetype | 2 actions | rated 0.01 |
| Flexible Ritualist | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Float Free | 6 | archetype | 1 action | no card: roleplay or nothing to automate |
| Grave Sense | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Lesson of Bonded Eyes | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Living Rune | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Lotus Above the Wind | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Make Do | 6 | archetype | 1 action | no card: roleplay or nothing to automate |
| Mobile Swarm | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Nameless Anonymity | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Narrative Conduit | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Nimble Shield Hand | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Perfect Ki Adept | 6 | archetype | passive | rated -0.12 |
| Primal Proportions | 6 | archetype | passive | rated -0.14 |
| Quick Harvest | 6 | archetype | 1 action | no card: roleplay or nothing to automate |
| Rain-Scribe Sustenance | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Relentless Disarm | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Second Shield | 6 | archetype | free | no card: roleplay or nothing to automate |
| Share Burden | 6 | archetype | reaction | no card: roleplay or nothing to automate |
| Tactical Guidance | 6 | archetype | passive | no card: roleplay or nothing to automate |
| Explosive Entry | 7 | archetype | passive | no card: roleplay or nothing to automate |
| Quick Change | 7 | archetype | passive | no card: roleplay or nothing to automate |
| A Tale To Believe In | 8 | archetype | 1 action | no card: roleplay or nothing to automate |
| Accursed Magic | 8 | archetype | passive | rated 0.27 |
| Arcane Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Armed And Armored | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Attuned Stride | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Basic Modification | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Bloodline Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Bonds of Death | 8 | archetype | free | no card: roleplay or nothing to automate |
| Cantrip Supremacy | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Captivating Intensity | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Carried with the Swarm | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Cultivator's Keen Eye | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Deadly Butterfly | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Divine Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Efficient Rituals | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Frozen Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Garden Path | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Lore Seeker | 8 | archetype | passive | rated 0 |
| Lorefinder | 8 | archetype | passive | a spell the engine doesn't cast |
| Many Guises (Vigilante) | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Mysterious Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Occult Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Patron's Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Preventative Treatment | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Primal Breadth | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Prolific Prophet Spellcasting | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Quick Stow (Swordmaster) | 8 | archetype | 1 action | no card: roleplay or nothing to automate |
| Recoiling Relocation | 8 | archetype | free | no card: roleplay or nothing to automate |
| Recycled Cogwheels | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Rivethun Devotion | 8 | archetype | passive | rated 0 |
| Rupture Stomp | 8 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Salt Kissed | 8 | archetype | passive | a spell the engine doesn't cast |
| Shambling March | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Skim Scroll | 8 | archetype | 1 action | no card: roleplay or nothing to automate |
| Supreme Psychic Center | 8 | archetype | free | no card: roleplay or nothing to automate |
| Veteran Follower | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Watcher on the Wall | 8 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Wayfinder Resonance Infiltrator | 8 | archetype | passive | no card: roleplay or nothing to automate |
| Work Yourself Up | 8 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Advanced Domain Spirit | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Armored Rest | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Beastmaster Bond | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Cautious Delver | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Cloud Walk | 10 | archetype | passive | a spell the engine doesn't cast |
| Communal Tale | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Deathguard | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Deny the Songs of War | 10 | archetype | passive | rated -0.24 |
| Emerald Boughs Hideaway | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Expanded Repertoire | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Captivator Spellcasting | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Ghost-Path Epiphany | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Giant Snare | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Grave Sight | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Greater Magical Scholastics | 10 | archetype | passive | rated 0 |
| Greater Spell Runes | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Holy Flower | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Inked Cache | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Instant Armor | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Magical Adaptation | 10 | archetype | passive | rated 0 |
| Marine Jet | 10 | archetype | 2 actions | no card: roleplay or nothing to automate |
| No Gods, Only Mortals! | 10 | archetype | free | no card: roleplay or nothing to automate |
| Perfect Ki Expert | 10 | archetype | passive | rated -0.01 |
| Prophet's Lockbox | 10 | archetype | passive | a spell the engine doesn't cast |
| Rope Mastery | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Ship's Shadow | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Tiller's Aid | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Veil of Bugs | 10 | archetype | passive | no card: roleplay or nothing to automate |
| Vigil's Walls Rise Anew | 10 | archetype | 2 actions | no card: roleplay or nothing to automate |
| Archdiabolic Usurpation | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Charged Creation | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Desperate Wish | 12 | archetype | passive | rated 0 |
| Eagle Eye | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Animist Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Beast Gunner Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Kinetic Control | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Magus Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Necromancer Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Pactbreaker Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Prophet Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Red Mantis Magic | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Rivethun Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Scroll Cache | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Snowcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Expert Summoner Spellcasting | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Finessed Features | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Knight in Shining Armor | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Liberty's Devotion | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Master Spotter | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Master Spotter (Investigator) | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Oneiric Influence | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Pact of the Crossroads | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Reaper of Repose | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Rejuvenation | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Resolute | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Runic Expertise | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Shepherd of Desolation | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Shift Horde | 12 | archetype | 1 action | no card: roleplay or nothing to automate |
| Shroud of the Seas | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Speaking Sky | 12 | archetype | passive | rated 0 |
| Swap Investment | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Tandem Auras | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Venomous Touch | 12 | archetype | passive | rated -0.06 |
| Vernai Training | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Wings of the Moon | 12 | archetype | passive | no card: roleplay or nothing to automate |
| Armored Exercise | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Borrow Memories | 14 | archetype | passive | rated 0 |
| Domino Effect | 14 | archetype | reaction | no card: roleplay or nothing to automate |
| Dream Logic | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Enterprising Ritualist | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Entities From Afar | 14 | archetype | passive | rated -0.51 |
| Exceptional Follower | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Expanded Swarm | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Fit for the Role | 14 | archetype | passive | rated 0 |
| Graveshift | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Innocent Butterfly | 14 | archetype | passive | rated 0 |
| Instant Credentials | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Perfect Ki Exemplar | 14 | archetype | passive | rated -0.08 |
| Shadow Power | 14 | archetype | passive | rated -0.12 |
| Talismanic Sage | 14 | archetype | passive | no card: roleplay or nothing to automate |
| Thwart Evil | 14 | archetype | reaction | no card: roleplay or nothing to automate |
| Unending Emptiness | 14 | archetype | passive | rated -0.18 |
| Bolster Soul Cage | 16 | archetype | passive | no card: roleplay or nothing to automate |
| Hidden Hoard | 16 | archetype | passive | no card: roleplay or nothing to automate |
| Master Captivator Spellcasting | 16 | archetype | passive | no card: roleplay or nothing to automate |
| Performance Weapon Expert | 16 | archetype | passive | no card: roleplay or nothing to automate |
| Rivethun Adept | 16 | archetype | passive | rated 0.05 |
| Shared Dream | 16 | archetype | passive | a spell the engine doesn't cast |
| The Bitter Scholar's Promotion | 16 | archetype | passive | no card: roleplay or nothing to automate |
| The Immortal Attains the Summit | 16 | archetype | passive | no card: roleplay or nothing to automate |
| Call the Worm | 18 | archetype | passive | rated -0.52 |
| Greater Expanded Repertoire | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Major Deific Power | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Animist Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Beast Gunner Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Magus Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Necromancer Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Pactbreaker Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Prophet Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Red Mantis Magic | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Rivethun Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Scroll Cache | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Snowcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Master Summoner Spellcasting | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Mighty Bear | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Mighty Dragon Shape | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Miraculous Flight | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Perfect Ki Grandmaster | 18 | archetype | passive | rated -0.34 |
| Razor's Edge | 18 | archetype | passive | no card: roleplay or nothing to automate |
| Enter Divine Realm | 20 | archetype | passive | a spell the engine doesn't cast |
| Live the Creed | 20 | archetype | 1 action | no card: roleplay or nothing to automate |
| Moment of Apotheosis | 20 | archetype | passive | a spell the engine doesn't cast |
| Spark of Immortality | 20 | archetype | passive | no card: roleplay or nothing to automate |
| Alchemical Assessment | 1 | class | passive | no card: roleplay or nothing to automate |
| Ammunition Thaumaturgy | 1 | class | passive | no card: roleplay or nothing to automate |
| Ancestral Mind | 1 | class | passive | no card: roleplay or nothing to automate |
| Animal Empathy | 1 | class | passive | no card: roleplay or nothing to automate |
| Blessed Blood (Sorcerer) | 1 | class | passive | no card: roleplay or nothing to automate |
| Built-In Tools | 1 | class | passive | no card: roleplay or nothing to automate |
| Cackle | 1 | class | passive | rated 0.01 |
| Circle of Spirits | 1 | class | 1 action | no card: roleplay or nothing to automate |
| Dual-Weapon Reload | 1 | class | passive | no card: roleplay or nothing to automate |
| Explosive Leap | 1 | class | 1 action | no card: roleplay or nothing to automate |
| False Faith | 1 | class | passive | no card: roleplay or nothing to automate |
| Haphazard Repair | 1 | class | 1 action | no card: roleplay or nothing to automate |
| Haunt Ingenuity | 1 | class | passive | no card: roleplay or nothing to automate |
| Hymn of Healing | 1 | class | passive | rated 0.07 |
| Initiate Warden | 1 | class | passive | no card: roleplay or nothing to automate |
| Larger Than Life (Guardian) | 1 | class | passive | no card: roleplay or nothing to automate |
| Moment of Clarity | 1 | class | 1 action | no card: roleplay or nothing to automate |
| One for All | 1 | class | 1 action | no card: roleplay or nothing to automate |
| Plant Empathy | 1 | class | passive | no card: roleplay or nothing to automate |
| Qi Spells | 1 | class | passive | no card: roleplay or nothing to automate |
| That's Odd | 1 | class | passive | no card: roleplay or nothing to automate |
| Widespread Fascination | 1 | class | passive | no card: roleplay or nothing to automate |
| Arms That Cut the Waves | 2 | class | passive | no card: roleplay or nothing to automate |
| Blade Brake | 2 | class | reaction | no card: roleplay or nothing to automate |
| Call Implement | 2 | class | 1 action | no card: roleplay or nothing to automate |
| Call of the Wild | 2 | class | passive | no card: roleplay or nothing to automate |
| Cantrip Casting | 2 | class | passive | no card: roleplay or nothing to automate |
| Cantrip Expansion | 2 | class | passive | no card: roleplay or nothing to automate |
| Collapse Armor | 2 | class | 1 action | no card: roleplay or nothing to automate |
| Convergent Tides | 2 | class | passive | no card: roleplay or nothing to automate |
| Deathly Scream | 2 | class | passive | rated -0.03 |
| Favored Terrain | 2 | class | passive | no card: roleplay or nothing to automate |
| Feet That Stride the Sky | 2 | class | passive | no card: roleplay or nothing to automate |
| Force Fang | 2 | class | passive | rated 0.01 |
| Hands That Unweave Disaster | 2 | class | passive | no card: roleplay or nothing to automate |
| Invisible Ink | 2 | class | passive | no card: roleplay or nothing to automate |
| Leap the Falls | 2 | class | passive | no card: roleplay or nothing to automate |
| Loremaster's Etude | 2 | class | passive | rated 0 |
| Muscle Barrier | 2 | class | passive | rated 0 |
| Snare Hopping | 2 | class | passive | a spell the engine doesn't cast |
| Song of the Soul | 2 | class | passive | rated -0.01 |
| Advanced Warden | 4 | class | passive | no card: roleplay or nothing to automate |
| Anthropomorphic Shape | 4 | class | passive | no card: roleplay or nothing to automate |
| Become Shadow | 4 | class | passive | no card: roleplay or nothing to automate |
| Bony Barrage | 4 | class | passive | rated -0.03 |
| Cheaters Always Prosper | 4 | class | passive | no card: roleplay or nothing to automate |
| Devrin's Dazzling Diversion | 4 | class | passive | no card: roleplay or nothing to automate |
| Elemental Summons | 4 | class | passive | no card: roleplay or nothing to automate |
| Enduring Alchemy | 4 | class | passive | no card: roleplay or nothing to automate |
| Flurry of Maneuvers | 4 | class | passive | no card: roleplay or nothing to automate |
| Ghostly Resonance | 4 | class | passive | no card: roleplay or nothing to automate |
| Harmonize Self | 4 | class | passive | rated 0 |
| Inured to Alchemy | 4 | class | passive | no card: roleplay or nothing to automate |
| Light of Revelation | 4 | class | passive | a spell the engine doesn't cast |
| Striker's Scroll | 4 | class | passive | no card: roleplay or nothing to automate |
| Sun Blade | 4 | class | passive | rated -0.19 |
| Supernatural Senses | 4 | class | passive | no card: roleplay or nothing to automate |
| Syu Tak-nwa's Skillful Tresses | 4 | class | passive | no card: roleplay or nothing to automate |
| Tenacious Toxins | 4 | class | passive | no card: roleplay or nothing to automate |
| Transpose Etching | 4 | class | 1 action | no card: roleplay or nothing to automate |
| Zoophonic Composition | 4 | class | free | no card: roleplay or nothing to automate |
| Advanced Bloodline | 6 | class | passive | no card: roleplay or nothing to automate |
| Advanced Elemental Spell | 6 | class | passive | rated -0.05 |
| Advanced Qi Spells | 6 | class | passive | no card: roleplay or nothing to automate |
| Advanced Revelation | 6 | class | passive | no card: roleplay or nothing to automate |
| Apparition Stabilization | 6 | class | passive | no card: roleplay or nothing to automate |
| Bind Heroic Spirit | 6 | class | passive | a spell the engine doesn't cast |
| Combine Elixirs | 6 | class | passive | no card: roleplay or nothing to automate |
| Conjurer's Countermeasure | 6 | class | passive | rated 0 |
| Construct Shell | 6 | class | passive | no card: roleplay or nothing to automate |
| Deadly Casework | 6 | class | passive | no card: roleplay or nothing to automate |
| Diacritic Fluency | 6 | class | free | no card: roleplay or nothing to automate |
| Efficient Preparation | 6 | class | passive | no card: roleplay or nothing to automate |
| Fog Cloak | 6 | class | passive | no card: roleplay or nothing to automate |
| Fool's Fleeting Plan | 6 | class | passive | no card: roleplay or nothing to automate |
| Furious Focus | 6 | class | passive | no card: roleplay or nothing to automate |
| Hedge Prison | 6 | class | passive | rated 0 |
| Irresistible Magic | 6 | class | passive | no card: roleplay or nothing to automate |
| Ki Cutting Sight | 6 | class | passive | rated 0.1 |
| Masterful Warden | 6 | class | passive | no card: roleplay or nothing to automate |
| One More Activation | 6 | class | passive | no card: roleplay or nothing to automate |
| Ranger's Bramble | 6 | class | passive | rated -0.21 |
| Sixth Sense | 6 | class | passive | no card: roleplay or nothing to automate |
| Spiritual Sense | 6 | class | passive | no card: roleplay or nothing to automate |
| Steady Spellcasting | 6 | class | passive | rated 0 |
| Visual Fidelity | 6 | class | passive | no card: roleplay or nothing to automate |
| Words, Fly Free | 6 | class | 1 action | no card: roleplay or nothing to automate |
| Zombie Horde (Necromancer) | 6 | class | passive | rated 0.04 |
| Advanced Deity's Domain | 8 | class | passive | no card: roleplay or nothing to automate |
| Advanced School Spell | 8 | class | passive | no card: roleplay or nothing to automate |
| Can't You See? | 8 | class | passive | no card: roleplay or nothing to automate |
| Clinging Shadows Initiate | 8 | class | passive | rated 0.05 |
| Conglomerate of Limbs | 8 | class | passive | a spell the engine doesn't cast |
| Elemental Overlap | 8 | class | passive | no card: roleplay or nothing to automate |
| Fey Caller | 8 | class | passive | no card: roleplay or nothing to automate |
| Form Retention | 8 | class | passive | no card: roleplay or nothing to automate |
| Restorative Channel | 8 | class | passive | no card: roleplay or nothing to automate |
| Runic Impression | 8 | class | passive | rated 0 |
| Sanguine Transference | 8 | class | passive | a spell the engine doesn't cast |
| Sense Holiness | 8 | class | passive | no card: roleplay or nothing to automate |
| Sense Unholiness | 8 | class | passive | no card: roleplay or nothing to automate |
| Songbird's Call | 8 | class | passive | rated -0.03 |
| Soulsight (Bard) | 8 | class | passive | no card: roleplay or nothing to automate |
| Soulsight (Sorcerer) | 8 | class | passive | no card: roleplay or nothing to automate |
| Terrain Master | 8 | class | passive | no card: roleplay or nothing to automate |
| Unseen Passage | 8 | class | passive | a spell the engine doesn't cast |
| Warden's Boon | 8 | class | 1 action | no card: roleplay or nothing to automate |
| Wild Winds Initiate | 8 | class | passive | rated 0.1 |
| Wind Caller | 8 | class | passive | rated 0 |
| Become Destiny | 10 | class | free | no card: roleplay or nothing to automate |
| Blossoming Gore | 10 | class | passive | a spell the engine doesn't cast |
| Camouflage | 10 | class | passive | no card: roleplay or nothing to automate |
| Elemental Transformation | 10 | class | 1 action | no card: roleplay or nothing to automate |
| Expanded Necromancy | 10 | class | passive | no card: roleplay or nothing to automate |
| Greater Bloodline | 10 | class | passive | no card: roleplay or nothing to automate |
| Ode to Ouroboros | 10 | class | passive | a spell the engine doesn't cast |
| Peerless Warden | 10 | class | passive | no card: roleplay or nothing to automate |
| Precious Munitions | 10 | class | passive | no card: roleplay or nothing to automate |
| Rapid Recharge | 10 | class | free | rated -0.05 |
| Signature Spell Expansion | 10 | class | passive | no card: roleplay or nothing to automate |
| Signature Spell Expansion (Psychic) | 10 | class | passive | no card: roleplay or nothing to automate |
| Suspect of Opportunity | 10 | class | reaction | no card: roleplay or nothing to automate |
| Symphony of the Unfettered Heart | 10 | class | passive | a spell the engine doesn't cast |
| Wind Jump | 10 | class | passive | rated 0 |
| Witch's Communion | 10 | class | passive | no card: roleplay or nothing to automate |
| Wronged Monk's Wrath | 10 | class | passive | rated -0.03 |
| Affliction Mercy | 12 | class | passive | no card: roleplay or nothing to automate |
| Bridge of Graves | 12 | class | passive | a spell the engine doesn't cast |
| Champion's Sacrifice | 12 | class | passive | no card: roleplay or nothing to automate |
| Distant Invocation | 12 | class | passive | no card: roleplay or nothing to automate |
| Elaborate Scroll Esoterica | 12 | class | passive | no card: roleplay or nothing to automate |
| Extend Elixir | 12 | class | passive | no card: roleplay or nothing to automate |
| Greater Revelation | 12 | class | passive | no card: roleplay or nothing to automate |
| Magic Sense (Magus) | 12 | class | passive | no card: roleplay or nothing to automate |
| Obscured Emergence | 12 | class | passive | no card: roleplay or nothing to automate |
| Preparation | 12 | class | 1 action | no card: roleplay or nothing to automate |
| Primal Summons | 12 | class | passive | rated 0.02 |
| Right Where You Want Them | 12 | class | passive | no card: roleplay or nothing to automate |
| Sense Ki | 12 | class | passive | no card: roleplay or nothing to automate |
| Shooter's Camouflage | 12 | class | passive | no card: roleplay or nothing to automate |
| Titan's Stature | 12 | class | passive | no card: roleplay or nothing to automate |
| Anchoring Aura | 14 | class | passive | no card: roleplay or nothing to automate |
| Be Right Back | 14 | class | 3 actions | no card: roleplay or nothing to automate |
| Behold, a Pale Horse | 14 | class | passive | no card: roleplay or nothing to automate |
| Blood Ascendancy | 14 | class | passive | no card: roleplay or nothing to automate |
| Complete the Hero's Journey | 14 | class | 1 action | no card: roleplay or nothing to automate |
| Forestall Curse | 14 | class | 1 action | no card: roleplay or nothing to automate |
| Grand Talisman Esoterica | 14 | class | passive | no card: roleplay or nothing to automate |
| Hasted Assault | 14 | class | passive | rated 0.08 |
| Lasting Armament | 14 | class | passive | no card: roleplay or nothing to automate |
| Musical Summons | 14 | class | 3 actions | no card: roleplay or nothing to automate |
| Recurring Nightmare | 14 | class | passive | rated 0 |
| Reflect Spell | 14 | class | passive | no card: roleplay or nothing to automate |
| Sacral Monarch | 14 | class | passive | rated 0.1 |
| Shadow's Web | 14 | class | passive | rated -0.03 |
| Shift Spell | 14 | class | 1 action | no card: roleplay or nothing to automate |
| Skeletal Lancers | 14 | class | passive | rated 0.26 |
| Soothing Ballad | 14 | class | passive | rated 0 |
| Sunder Enchantment | 14 | class | passive | no card: roleplay or nothing to automate |
| Warden's Guidance | 14 | class | passive | no card: roleplay or nothing to automate |
| Blank Slate | 16 | class | passive | no card: roleplay or nothing to automate |
| Eternal Bane | 16 | class | passive | no card: roleplay or nothing to automate |
| Eternal Elixir | 16 | class | passive | no card: roleplay or nothing to automate |
| Flesh Tsunami | 16 | class | passive | a spell the engine doesn't cast |
| Impaling Briars | 16 | class | passive | rated 0 |
| Implausible Purchase (Investigator) | 16 | class | passive | no card: roleplay or nothing to automate |
| Just the Thing! | 16 | class | passive | no card: roleplay or nothing to automate |
| Master Qi Spells | 16 | class | passive | no card: roleplay or nothing to automate |
| Perfect Distraction | 16 | class | 1 action | no card: roleplay or nothing to automate |
| Runesight | 16 | class | passive | no card: roleplay or nothing to automate |
| Strike Rivers, Seize Winds | 16 | class | passive | no card: roleplay or nothing to automate |
| Temporary Possession | 16 | class | passive | rated 0.2 |
| Warden's Reload | 16 | class | free | no card: roleplay or nothing to automate |
| Calcification | 18 | class | passive | rated -0.06 |
| Deep Lore | 18 | class | passive | no card: roleplay or nothing to automate |
| Dread Mosquito Storm | 18 | class | passive | rated -0.13 |
| Grandmaster Qi Spells | 18 | class | passive | no card: roleplay or nothing to automate |
| Implausible Infiltration | 18 | class | 2 actions | no card: roleplay or nothing to automate |
| Implausible Purchase (Rogue) | 18 | class | passive | no card: roleplay or nothing to automate |
| Impossible Polymath | 18 | class | passive | no card: roleplay or nothing to automate |
| Invoke Disaster | 18 | class | passive | rated -0.04 |
| Miracle Worker | 18 | class | passive | no card: roleplay or nothing to automate |
| Mythic Counter | 18 | class | passive | no card: roleplay or nothing to automate |
| Reprisal of the Fallen | 18 | class | passive | rated -0.15 |
| Shadow Hunter | 18 | class | passive | no card: roleplay or nothing to automate |
| Smash from the Air | 18 | class | passive | no card: roleplay or nothing to automate |
| Twin Psyche | 18 | class | passive | no card: roleplay or nothing to automate |
| Unbounded Invocations | 18 | class | passive | no card: roleplay or nothing to automate |
| Accurate Flurry | 20 | class | passive | no card: roleplay or nothing to automate |
| Alchemical Revivification | 20 | class | passive | no card: roleplay or nothing to automate |
| Apex Companion | 20 | class | passive | a spell the engine doesn't cast |
| Break the Causal Chain | 20 | class | passive | no card: roleplay or nothing to automate |
| Contagious Rage | 20 | class | passive | no card: roleplay or nothing to automate |
| Endurance of the Rooted Tree | 20 | class | passive | no card: roleplay or nothing to automate |
| Everyone's a Suspect | 20 | class | passive | no card: roleplay or nothing to automate |
| Fatal Aria | 20 | class | passive | a spell the engine doesn't cast |
| Hex Master | 20 | class | passive | no card: roleplay or nothing to automate |
| Instant Army | 20 | class | 1 action | no card: roleplay or nothing to automate |
| Legacy of Monarchs | 20 | class | passive | no card: roleplay or nothing to automate |
| Lightning Qi | 20 | class | free | no card: roleplay or nothing to automate |
| Living Graveyard | 20 | class | passive | rated 0 |
| Omnikinesis | 20 | class | 1 action | no card: roleplay or nothing to automate |
| Perfect Mutagen | 20 | class | passive | no card: roleplay or nothing to automate |
| Perfected Thrall | 20 | class | passive | a spell the engine doesn't cast |
| Pied Piping | 20 | class | passive | rated 0.04 |
| Shades of Meaning | 20 | class | passive | no card: roleplay or nothing to automate |
| Slinger's Reflexes | 20 | class | passive | no card: roleplay or nothing to automate |
| Song of the Fallen | 20 | class | passive | rated 0 |
| Symphony of the Muse | 20 | class | passive | no card: roleplay or nothing to automate |
| Ultimate Polymath | 20 | class | passive | no card: roleplay or nothing to automate |
| Unlimited Demesne | 20 | class | passive | no card: roleplay or nothing to automate |
| Wake of Devastation | 20 | class | passive | no card: roleplay or nothing to automate |
| Additional Circus Trick | 3 | general | passive | no card: roleplay or nothing to automate |
| Prescient Planner | 3 | general | passive | no card: roleplay or nothing to automate |
| Skitter | 3 | general | passive | no card: roleplay or nothing to automate |
| Steel Your Resolve | 3 | general | 1 action | no card: roleplay or nothing to automate |
| Expeditious Search | 7 | general | passive | no card: roleplay or nothing to automate |
| Prescient Consumable | 7 | general | passive | no card: roleplay or nothing to automate |
| Axuma's Vigor | 11 | general | passive | no card: roleplay or nothing to automate |
| Caravan Leader | 11 | general | passive | no card: roleplay or nothing to automate |
| True Perception | 19 | general | passive | no card: roleplay or nothing to automate |
| Charlatan | 1 | skill | passive | no card: roleplay or nothing to automate |
| Inoculation | 1 | skill | passive | no card: roleplay or nothing to automate |
| Lengthy Diversion | 1 | skill | passive | no card: roleplay or nothing to automate |
| Pickpocket | 1 | skill | passive | no card: roleplay or nothing to automate |
| Quick Repair | 1 | skill | passive | no card: roleplay or nothing to automate |
| Quick Squeeze | 1 | skill | passive | no card: roleplay or nothing to automate |
| Titan Wrestler | 1 | skill | passive | no card: roleplay or nothing to automate |
| Distracting Performance | 2 | skill | 1 action | no card: roleplay or nothing to automate |
| Powerful Leap | 2 | skill | passive | no card: roleplay or nothing to automate |
| Quiet Allies | 2 | skill | passive | no card: roleplay or nothing to automate |
| Shadow Mark | 2 | skill | passive | no card: roleplay or nothing to automate |
| Folk Dowsing | 3 | skill | passive | no card: roleplay or nothing to automate |
| Blessed Medicine | 4 | skill | passive | no card: roleplay or nothing to automate |
| Dead Reckoning | 4 | skill | 2 actions | no card: roleplay or nothing to automate |
| Eclipsed Vitality | 4 | skill | passive | no card: roleplay or nothing to automate |
| Fancy Moves | 4 | skill | passive | no card: roleplay or nothing to automate |
| Hideous Ululation | 4 | skill | passive | no card: roleplay or nothing to automate |
| Power Slide | 4 | skill | 1 action | no card: roleplay or nothing to automate |
| Steel Skin | 4 | skill | passive | no card: roleplay or nothing to automate |
| Resourceful Ritualist | 6 | skill | passive | no card: roleplay or nothing to automate |
| Silo Crop | 6 | skill | 1 action | no card: roleplay or nothing to automate |
| Stealthy As An Octopus | 6 | skill | passive | no card: roleplay or nothing to automate |
| Ashen Veil | 7 | skill | 3 actions | no card: roleplay or nothing to automate |
| Biographical Eye | 7 | skill | passive | no card: roleplay or nothing to automate |
| Doublespeak | 7 | skill | passive | no card: roleplay or nothing to automate |
| Efficient Controls | 7 | skill | passive | no card: roleplay or nothing to automate |
| Expert Disassembly | 7 | skill | passive | no card: roleplay or nothing to automate |
| Graceful Leaper | 7 | skill | passive | no card: roleplay or nothing to automate |
| Party Crasher | 7 | skill | passive | no card: roleplay or nothing to automate |
| Petal District Socialite | 7 | skill | passive | no card: roleplay or nothing to automate |
| Propeller Attachment | 7 | skill | passive | no card: roleplay or nothing to automate |
| Push It | 7 | skill | passive | no card: roleplay or nothing to automate |
| Quick Setup | 7 | skill | passive | no card: roleplay or nothing to automate |
| Quick Unlock | 7 | skill | passive | no card: roleplay or nothing to automate |
| Rapid Affixture | 7 | skill | passive | no card: roleplay or nothing to automate |
| Scholastic Identification | 7 | skill | passive | no card: roleplay or nothing to automate |
| Slippery Secrets | 7 | skill | passive | no card: roleplay or nothing to automate |
| Subjective Truth | 7 | skill | passive | no card: roleplay or nothing to automate |
| Swift Sneak | 7 | skill | passive | no card: roleplay or nothing to automate |
| Terrified Retreat | 7 | skill | passive | no card: roleplay or nothing to automate |
| Vanish Into the Land | 7 | skill | passive | no card: roleplay or nothing to automate |
| Divine Guidance | 15 | skill | passive | no card: roleplay or nothing to automate |
| Legendary Medic | 15 | skill | passive | no card: roleplay or nothing to automate |
| Legendary Sneak | 15 | skill | passive | no card: roleplay or nothing to automate |
| Legendary Thief | 15 | skill | passive | no card: roleplay or nothing to automate |
| Terrain Ghost | 18 | skill | passive | no card: roleplay or nothing to automate |

### only grants other feats, features or choices (519)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Adapted Cantrip | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Alchemical Scholar | 1 | ancestry | passive | it grants Alchemical Crafting |
| Animal Accomplice | 1 | ancestry | passive | it grants Pet |
| Appraiser’s Eye | 1 | ancestry | passive | it grants Quick Identification |
| As in Life, So in Death | 1 | ancestry | passive | it grants Adopted Ancestry |
| Awakened Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Bone Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Brinesoul | 1 | ancestry | passive | it grants Salt Wound |
| Clone-Risen | 1 | ancestry | passive | it grants Empty Vessel |
| Eidetic Ear | 1 | ancestry | passive | it grants Assurance |
| Elf Atavism | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Elver Pet | 1 | ancestry | passive | it grants Pet |
| Faultspawn | 1 | ancestry | passive | it grants Find Fault |
| First World Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Forge-Day's Rest | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Free Heart | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Friend of the Sea | 1 | ancestry | passive | it grants Pet |
| General Training | 1 | ancestry | passive | rated 0.02 |
| Gnome Obsession | 1 | ancestry | passive | it grants one of 2 |
| Grimspawn | 1 | ancestry | passive | rated 0 |
| Inherit the Dreaming Heirloom | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Mirror-Risen | 1 | ancestry | passive | it grants Mirror-Trickery |
| Mistsoul | 1 | ancestry | passive | it grants Mist Blending |
| Moldersoul | 1 | ancestry | 2 actions | rated -0.05 |
| Natural Ambition | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Natural Mutagen | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Open Mind | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Orc Warmask | 1 | ancestry | passive | it grants Dubious Knowledge |
| Otherworldly Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Pantheon Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Quah Bond | 1 | ancestry | passive | it grants Assurance |
| Remnants of the Past | 1 | ancestry | passive | it grants one of 2 |
| Sequestered Spell | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Seven Changes Performance | 1 | ancestry | passive | it grants Quick Disguise |
| Shackleborn | 1 | ancestry | passive | it grants Fast Recovery |
| Shrouded Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Skilled Herbalist | 1 | ancestry | passive | it grants Alchemical Crafting |
| Smokesoul | 1 | ancestry | passive | it grants Smoke Blending |
| Studious Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Terra Dragonblood | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Tough Skin | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Unbowed, Unbroken | 1 | ancestry | passive | it grants Unwavering Resilience |
| Uncanny Agility | 1 | ancestry | passive | it grants Steady Balance |
| Unconventional Weaponry | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Veil May | 1 | ancestry | passive | it grants Lie to Me |
| Vestigial Wings | 1 | ancestry | passive | it grants one of 2 |
| Web Weaver | 1 | ancestry | passive | it grants Specialty Crafting |
| Whitecape | 1 | ancestry | passive | it grants Steady Balance |
| Wildborn Magic | 1 | ancestry | passive | no card: only grants other feats, features or choices |
| Wind Pillow | 1 | ancestry | passive | it grants Powerful Leap |
| Adaptive Adept | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Anchoring Roots | 5 | ancestry | passive | it grants one of 2 |
| Ascended Dragonet Heritage | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Awakened Yaoguai Heritage | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Ceremony of Knowledge | 5 | ancestry | passive | it grants Untrained Improvisation |
| Chosen of Lamashtu | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Clever Improviser | 5 | ancestry | passive | it grants Untrained Improvisation |
| Cultural Adaptability | 5 | ancestry | passive | it grants Adopted Ancestry |
| Debilitating Venom | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Late Awakener | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Ornate Tattoo | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Pack Stalker | 5 | ancestry | passive | it grants Terrain Stalker |
| Plan the Hunt | 5 | ancestry | passive | it grants one of 2 |
| Resilient Physiology | 5 | ancestry | 1 action | no card: only grants other feats, features or choices |
| Runtsage | 5 | ancestry | passive | it grants Adopted Ancestry |
| Scion of Many Planes | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Secondary Adaptation | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Slip with the Breeze | 5 | ancestry | passive | it grants one of 2 |
| Unlock Secret | 5 | ancestry | passive | no card: only grants other feats, features or choices |
| Bond Companion | 9 | ancestry | passive | it grants Fortify Focus |
| Brightness Seeker | 9 | ancestry | reaction | it grants Call Upon the Brightness |
| Dracomancer | 9 | ancestry | passive | rated -0.09 |
| Evolved Spellhorn | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Grand Metamorphosis | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Laughing Kholo | 9 | ancestry | passive | rated -0.03 |
| Lucky Keepsake | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Moray Eel Mount | 9 | ancestry | passive | it grants Bonded Animal |
| Multitalented | 9 | ancestry | passive | rated 0.01 |
| Otherworldly Acumen | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Snare Commando | 9 | ancestry | reaction | no card: only grants other feats, features or choices |
| Transcendent Realization | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Uncanny Cheeks | 9 | ancestry | passive | it grants one of 2 |
| Virtue-Forged Tattoos | 9 | ancestry | passive | no card: only grants other feats, features or choices |
| Advanced General Training | 13 | ancestry | passive | rated 0.03 |
| Awaken Others | 13 | ancestry | passive | no card: only grants other feats, features or choices |
| Coral Reserve | 13 | ancestry | 1 action | no card: only grants other feats, features or choices |
| Elite Dracomancer | 13 | ancestry | passive | rated -0.12 |
| Malleable Form | 13 | ancestry | 1 action | no card: only grants other feats, features or choices |
| Purge System | 13 | ancestry | 3 actions | no card: only grants other feats, features or choices |
| Rejuvenating Embrace | 13 | ancestry | passive | no card: only grants other feats, features or choices |
| Resplendent Spellhorn | 13 | ancestry | passive | no card: only grants other feats, features or choices |
| We March On | 13 | ancestry | passive | it grants one of 2 |
| Animal Shape | 17 | ancestry | passive | no card: only grants other feats, features or choices |
| Shadow Self | 17 | ancestry | passive | no card: only grants other feats, features or choices |
| Unlimited Pluripotency | 17 | ancestry | passive | no card: only grants other feats, features or choices |
| Animal Trainer Dedication | 2 | archetype | passive | rated 0.16 |
| Animist Dedication | 2 | archetype | passive | rated -0.33 |
| Artillerist Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Assassin Dedication | 2 | archetype | passive | it grants Mark for Death |
| Bastion Dedication | 2 | archetype | passive | rated 0.05 |
| Beastmaster Dedication | 2 | archetype | passive | rated 0.16 |
| Blessed One Dedication | 2 | archetype | passive | rated -0.06 |
| Campfire Chronicler Dedication | 2 | archetype | passive | rated -0.02 |
| Cathartic Mage Dedication | 2 | archetype | passive | rated -0.26 |
| Cavalier Dedication | 2 | archetype | passive | rated 0.17 |
| Celebrity Dedication | 2 | archetype | passive | it grants Upstage |
| Clawdancer Dedication | 2 | archetype | passive | rated -0.31 |
| Clockwork Reanimator Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Demolitionist Dedication | 2 | archetype | passive | it grants Set Explosives |
| Draconic Acolyte Dedication | 2 | archetype | passive | it grants one of 3 |
| Drake Rider Dedication | 2 | archetype | passive | rated 0.17 |
| Dual-Weapon Warrior Dedication | 2 | archetype | passive | rated -0.02 |
| Duelist Dedication | 2 | archetype | passive | it grants Quick Draw |
| Edgewatch Detective Dedication | 2 | archetype | passive | it grants Experienced Tracker |
| Flexible Spellcaster Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Folklorist Dedication | 2 | archetype | passive | it grants Spin Tale |
| Ghost Hunter Dedication | 2 | archetype | passive | rated -0.31 |
| Hallowed Necromancer Dedication | 2 | archetype | passive | rated 0 |
| Hedge Mage Dedication | 2 | archetype | passive | it grants Cast a Spell |
| Horizon Walker Dedication | 2 | archetype | passive | it grants Favored Terrain |
| Iridian Choirmaster Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Living Nexus Dedication | 2 | archetype | passive | rated 0.07 |
| Living Vessel Dedication | 2 | archetype | passive | it grants Entity's Resurgence |
| Magaambyan Attendant Dedication | 2 | archetype | passive | rated -0.26 |
| Midnight Illusionist Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Mind Smith Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Munitions Master Dedication | 2 | archetype | passive | it grants Engineer's Efficiency |
| Nantambu Chime-Ringer Dedication | 2 | archetype | passive | rated -0.26 |
| Oatia Skysage Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Ostilli Host Dedication | 2 | archetype | passive | rated -0.36 |
| Palatine Detective Dedication | 2 | archetype | passive | it grants Mystic Aegis |
| Pirate Dedication | 2 | archetype | passive | rated 0.03 |
| Prophet of Kalistrade Dedication | 2 | archetype | passive | rated -0.31 |
| Razmiran Priest Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Reanimator Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Rivethun Emissary Dedication | 2 | archetype | passive | it grants Bond with Spirit |
| Runelord Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Scrounger Dedication | 2 | archetype | passive | it grants Cobble Together |
| Shadowcaster Dedication | 2 | archetype | passive | rated -0.05 |
| Sniping Duo Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Sorcerer Dedication | 2 | archetype | passive | rated -0.26 |
| Spell Trickster Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Stalwart Defender Dedication | 2 | archetype | passive | rated -0.07 |
| Starlit Sentinel Dedication | 2 | archetype | passive | rated -0.09 |
| Summoner Dedication | 2 | archetype | passive | it grants Eidolon |
| Swarmkeeper Dedication | 2 | archetype | passive | rated -0.48 |
| Trick Driver Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Turpin Rowe Lumberjack Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Ulfen Guard Dedication | 2 | archetype | passive | rated -0.17 |
| Undead Master Dedication | 2 | archetype | passive | rated 0.16 |
| Undead Slayer Dedication | 2 | archetype | passive | it grants Slayer's Identification |
| Unexpected Sharpshooter Dedication | 2 | archetype | passive | it grants Accidental Shot |
| Vehicle Mechanic Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Veil Dancer Dedication | 2 | archetype | passive | rated -0.14 |
| Vigilante Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Viking Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Wellspring Mage Dedication | 2 | archetype | passive | no card: only grants other feats, features or choices |
| Witch Dedication | 2 | archetype | passive | rated -0.26 |
| World Rouser Dedication | 2 | archetype | passive | it grants Rouse the World |
| Worm Caller Dedication | 2 | archetype | passive | rated 0 |
| Base Kinesis | 4 | archetype | passive | it grants Base Kinesis |
| Basic Arcana | 4 | archetype | passive | rated -0.04 |
| Basic Bard Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Blood Potency | 4 | archetype | passive | rated 0 |
| Basic Breakthrough | 4 | archetype | passive | rated -0.05 |
| Basic Captivator Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Cathartic Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Cleric Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Concoction | 4 | archetype | passive | rated 0 |
| Basic Death Dealing | 4 | archetype | passive | rated 0.02 |
| Basic Deduction | 4 | archetype | passive | rated 0 |
| Basic Dogma | 4 | archetype | passive | rated 0 |
| Basic Druid Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Field Training | 4 | archetype | passive | rated 0.29 |
| Basic Flair | 4 | archetype | passive | rated 0.02 |
| Basic Martial Magic | 4 | archetype | passive | rated 0 |
| Basic Muse's Whispers | 4 | archetype | passive | rated -0.01 |
| Basic Mysteries | 4 | archetype | passive | rated 0.17 |
| Basic Oracle Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Psychic Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Rune Magic | 4 | archetype | passive | rated 0 |
| Basic Shooting | 4 | archetype | passive | rated 0 |
| Basic Skysage Divination | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Sorcerer Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Synergy | 4 | archetype | passive | rated -0.01 |
| Basic Thaumaturgy | 4 | archetype | passive | rated 0.45 |
| Basic Thoughtform | 4 | archetype | passive | rated -0.02 |
| Basic Trickery | 4 | archetype | passive | rated 0 |
| Basic Wilding | 4 | archetype | passive | rated -0.3 |
| Basic Witch Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Wizard Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Butterfly Blade Dedication | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Command Corpse | 4 | archetype | passive | it grants Command Undead |
| Contortionist | 4 | archetype | passive | it grants Quick Squeeze |
| Contract Blade | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Coughing Dragon Display | 4 | archetype | passive | it grants Coughing Dragon |
| Diabolic Usurpation | 4 | archetype | passive | it grants Domain Initiate |
| Esoteric Spellcasting | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Fake It Till You Make It | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Familiar Mascot | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Familiar Sage Dedication | 4 | archetype | passive | it grants Enhanced Familiar |
| Firebrand Braggart Dedication | 4 | archetype | 1 action | no card: only grants other feats, features or choices |
| Headless Haunt | 4 | archetype | passive | it grants Remove Head |
| Ice Crafter | 4 | archetype | passive | it grants Magical Crafting |
| Investigator's Stratagem | 4 | archetype | passive | it grants Devise a Stratagem |
| Jalmeri Heavenseeker Dedication | 4 | archetype | passive | rated -0.3 |
| Mammoth Lord Dedication | 4 | archetype | passive | rated 0.17 |
| Mental Forge | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Minor Deific Power | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Perfect Weaponry | 4 | archetype | passive | it grants Monastic Weaponry |
| Pirate's Pet | 4 | archetype | passive | it grants Pet |
| Quick Fix | 4 | archetype | passive | it grants one of 2 |
| Quick Study | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Sacred Spells | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Scion of Domora Dedication | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Seeker of Truths | 4 | archetype | passive | it grants Domain Initiate |
| Sleepwalker Dedication | 4 | archetype | passive | rated -0.14 |
| Social Purview | 4 | archetype | passive | rated 0.04 |
| Soothing Pulse | 4 | archetype | passive | rated -0.07 |
| Spell Runes | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Spell-Woven Shot | 4 | archetype | passive | it grants Spell-Woven Shot |
| Spellstriker | 4 | archetype | passive | rated 0 |
| Spirit Spells | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Spiritual Awakening | 4 | archetype | passive | rated -0.33 |
| Spot Translate | 4 | archetype | reaction | no card: only grants other feats, features or choices |
| Steel Falcon Dedication | 4 | archetype | passive | it grants Size Up |
| Terrain Scout | 4 | archetype | passive | it grants Terrain Stalker |
| Through the Gate | 4 | archetype | passive | it grants one of 6 |
| Trapsmith Dedication | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Twilight Talon Dedication | 4 | archetype | passive | it grants Additional Lore |
| Underbrush Trailblazer | 4 | archetype | passive | it grants Terrain Stalker |
| Venture-Gossip Dedication | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Wayfinder Resonance Tinkerer | 4 | archetype | passive | no card: only grants other feats, features or choices |
| Beast Gunner Dedication | 6 | archetype | passive | rated -0.56 |
| Cloaking Pulse | 6 | archetype | passive | it grants Drape Ambient Magic |
| Daywalker (Vampire) | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Deflecting Pulse | 6 | archetype | passive | error |
| Domain Spirit | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Eldritch Archer Dedication | 6 | archetype | passive | rated -0.56 |
| Explosion | 6 | archetype | passive | rated 0.23 |
| Five-Breath Vanguard Dedication | 6 | archetype | passive | it grants Cycle Elemental Stance |
| Fulu Familiar | 6 | archetype | passive | it grants Create Familiar Fulu |
| Gear Up | 6 | archetype | passive | it grants one of 2 |
| Ghostly Grasp | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Grave Mummification | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Gray Corsair Training | 6 | archetype | passive | it grants Pirate Dedication |
| Halcyon Speaker Dedication | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Hero-God's Bond | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Implement Initiate | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Inevitable Thralls | 6 | archetype | passive | it grants Inevitable Return |
| Keen Recollection | 6 | archetype | passive | it grants Keen Recollection |
| Liberty's Promise | 6 | archetype | passive | it grants Domain Initiate |
| Necrologist Dedication | 6 | archetype | passive | it grants one of 2 |
| Pact of Draconic Fury | 6 | archetype | passive | rated 0.02 |
| Poison Coat | 6 | archetype | reaction | it grants Once Bitten |
| Scrollmaster Dedication | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Slinger's Readiness | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Soul Arsenal | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Swashbuckler's Riposte | 6 | archetype | passive | rated 0.01 |
| Talon's Mark | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Three Clear Breaths | 6 | archetype | passive | rated 0 |
| Time Mage Dedication | 6 | archetype | passive | a spell the engine doesn't cast |
| Tracing Studies | 6 | archetype | passive | it grants Trace Rune |
| Vengeful Spirit Deck | 6 | archetype | 2 actions | no card: only grants other feats, features or choices |
| Westyr's Wayfinder Repository | 6 | archetype | passive | no card: only grants other feats, features or choices |
| Advanced Deific Power | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Aroden's Innovation | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Basic Eldritch Archer Spellcasting | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Call Gun | 8 | archetype | passive | it grants Call Gun |
| Call Your Shot | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Chaining Mutation | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Cruel Piercing | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Enhance Spell | 8 | archetype | 1 action | no card: only grants other feats, features or choices |
| Foolproof Instructions | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Golden League Xun Dedication | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Jumping Jenny Display | 8 | archetype | passive | it grants Jumping Jenny |
| Levered Swing | 8 | archetype | 1 action | no card: only grants other feats, features or choices |
| Magic Ammunition | 8 | archetype | passive | it grants Transform Ammunition |
| Magical Knowledge | 8 | archetype | passive | no card: only grants other feats, features or choices |
| Ouroboric Pact | 8 | archetype | passive | it grants Entreat Pact |
| Out of Hand | 8 | archetype | passive | it grants Lay Down Arms |
| Remote Detonation (Snarecrafter) | 8 | archetype | 1 action | rated -0.74 |
| Slurp Up | 8 | archetype | 1 action | no card: only grants other feats, features or choices |
| Spelldrinker | 8 | archetype | 1 action | no card: only grants other feats, features or choices |
| Spellshield | 8 | archetype | passive | it grants Arcane Bond |
| Surreptitious Spellcaster | 8 | archetype | passive | it grants Conceal Spell |
| To Battle! | 8 | archetype | 2 actions | no card: only grants other feats, features or choices |
| Add Element | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Assured Ritualist | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Beneath Notice | 10 | archetype | passive | it grants one of 3 |
| Bestiary Scholar | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Skysage Divination | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Form Up! | 10 | archetype | 2 actions | no card: only grants other feats, features or choices |
| Goblin Jubilee Display | 10 | archetype | passive | rated 0.04 |
| Hidden Intentions | 10 | archetype | passive | it grants one of 2 |
| Martial Exercise | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Practiced Reloads | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Runic Mind Smithing | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Shadow Reservoir | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Sixth Pillar Dedication | 10 | archetype | passive | no card: only grants other feats, features or choices |
| Spell Swallow | 10 | archetype | passive | it grants Devour Ambient Magic |
| Uncanny Dodge | 10 | archetype | passive | rated 0 |
| Additional Shadow Magic | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Banshee Cry Display | 12 | archetype | passive | it grants Banshee Cry |
| Buzzing Death Cicadas | 12 | archetype | passive | rated -0.25 |
| Communal Sustain | 12 | archetype | 1 action | no card: only grants other feats, features or choices |
| Consult the Spirits (Rivethun Emissary) | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Cut the Bonds | 12 | archetype | 1 action | no card: only grants other feats, features or choices |
| Determined Lore Seeker | 12 | archetype | passive | rated 0 |
| Expert Bard Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Cathartic Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Cleric Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Druid Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Eldritch Archer Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Oracle Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Psychic Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Sorcerer Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Witch Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Expert Wizard Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Greater Deific Power | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Greater Esoteric Spellcasting | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Greater Sun Blessing | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Illusory Identity | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Lich Dedication | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Mortal Herald Dedication | 12 | archetype | passive | rated -0.03 |
| Perfect Pitch | 12 | archetype | passive | it grants Pitch-Perfect Projection |
| Read the Land | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Secret Eater | 12 | archetype | passive | no card: only grants other feats, features or choices |
| Spell Acceleration | 12 | archetype | passive | rated 0.01 |
| Spiritual Aid | 12 | archetype | passive | rated 0 |
| Wild Strider | 12 | archetype | passive | it grants Unimpeded Journey |
| Words of Unraveling | 12 | archetype | passive | rated 0 |
| Costume Change | 14 | archetype | passive | it grants Impromptu Investment |
| Drain Soul Cage | 14 | archetype | passive | no card: only grants other feats, features or choices |
| Dual Onslaught | 14 | archetype | passive | no card: only grants other feats, features or choices |
| Pact of the Fey Paths | 14 | archetype | passive | it grants Fey Jump |
| Reset the Past | 14 | archetype | free | no card: only grants other feats, features or choices |
| Unstable Patronage | 14 | archetype | passive | no card: only grants other feats, features or choices |
| Faith in the Fallen | 16 | archetype | passive | rated 0.06 |
| Fulminating Synergy | 16 | archetype | passive | no card: only grants other feats, features or choices |
| Master Skysage Divination | 16 | archetype | passive | no card: only grants other feats, features or choices |
| Phoenix's Flight | 16 | archetype | passive | rated -0.51 |
| Chemical Contagion | 18 | archetype | passive | it grants Greater Field Discovery |
| Fight Choreography | 18 | archetype | passive | it grants Swift Choreography |
| Master Bard Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Cathartic Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Cleric Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Druid Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Eldritch Archer Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Oracle Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Psychic Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Sorcerer Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Witch Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Master Wizard Spellcasting | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Orichalcum Bond | 18 | archetype | passive | no card: only grants other feats, features or choices |
| Cunning Trickster Mask | 20 | archetype | passive | it grants Conceal Spell |
| Patron Reborn | 20 | archetype | passive | no card: only grants other feats, features or choices |
| Protective Spirit Mask | 20 | archetype | passive | no card: only grants other feats, features or choices |
| Dedication to the Five | 0 | bonus | passive | it grants Domain Initiate |
| Advanced Weaponry | 1 | class | passive | no card: only grants other feats, features or choices |
| Deceptive Tactics | 1 | class | passive | it grants Lengthy Diversion |
| Deity's Domain | 1 | class | passive | no card: only grants other feats, features or choices |
| Dual Studies | 1 | class | passive | no card: only grants other feats, features or choices |
| Familiar | 1 | class | passive | it grants Pet |
| Leshy Familiar | 1 | class | passive | it grants Pet |
| Plummeting Roll | 1 | class | passive | it grants one of 2 |
| Spirit Familiar (Animist) | 1 | class | passive | it grants Pet |
| Syncretism | 1 | class | passive | no card: only grants other feats, features or choices |
| Ancestral Weaponry | 2 | class | passive | no card: only grants other feats, features or choices |
| Basic Lesson | 2 | class | passive | no card: only grants other feats, features or choices |
| Blasting Beams | 2 | class | 1 action | it grants Dragon Deviant Classification |
| Consume Energy | 2 | class | reaction | it grants Dragon Deviant Classification |
| Domain Acumen | 2 | class | passive | no card: only grants other feats, features or choices |
| Draining Touch | 2 | class | 1 action | it grants Leech Deviant Classification |
| Order Explorer | 2 | class | passive | no card: only grants other feats, features or choices |
| Person of Interest | 2 | class | 1 action | no card: only grants other feats, features or choices |
| Ranged Combatant | 2 | class | passive | no card: only grants other feats, features or choices |
| Rotten Slurry | 2 | class | 1 action | it grants Blight Soul Deviant Classification |
| Runic Tattoo | 2 | class | passive | no card: only grants other feats, features or choices |
| Sanguimancer Dedication | 2 | class | passive | no card: only grants other feats, features or choices |
| Sprout Fruit | 2 | class | 1 action | it grants Verdant Core Deviant Classification |
| Student of Water | 2 | class | passive | it grants one of 2 |
| Tactical Expansion | 2 | class | passive | no card: only grants other feats, features or choices |
| Undead Creator | 2 | class | passive | no card: only grants other feats, features or choices |
| Vine Lash | 2 | class | 1 action | it grants Verdant Core Deviant Classification |
| Arcane Evolution | 4 | class | passive | no card: only grants other feats, features or choices |
| Astral Tether | 4 | class | 1 action | no card: only grants other feats, features or choices |
| Awakened Power | 4 | class | passive | no card: only grants other feats, features or choices |
| Basic Spellcasting | 4 | class | passive | no card: only grants other feats, features or choices |
| Breached Defenses | 4 | class | passive | no card: only grants other feats, features or choices |
| Cutting Rebuke | 4 | class | passive | rated -0.34 |
| Devil's Eye | 4 | class | passive | it grants Objection |
| Dual Energy Heart | 4 | class | passive | no card: only grants other feats, features or choices |
| Dual-Form Weapon | 4 | class | passive | no card: only grants other feats, features or choices |
| Echo of the Fallen | 4 | class | passive | rated 0 |
| Hydra's Bond | 4 | class | passive | no card: only grants other feats, features or choices |
| Incriminating Spell | 4 | class | 1 action | no card: only grants other feats, features or choices |
| Mercy | 4 | class | passive | no card: only grants other feats, features or choices |
| Occult Evolution | 4 | class | passive | no card: only grants other feats, features or choices |
| Order Magic | 4 | class | passive | no card: only grants other feats, features or choices |
| Rites of Convocation | 4 | class | passive | no card: only grants other feats, features or choices |
| Safe Elements | 4 | class | passive | it grants Pacifying Infusion |
| Divine Emissary | 6 | class | passive | no card: only grants other feats, features or choices |
| Greater Lesson | 6 | class | passive | no card: only grants other feats, features or choices |
| Predictive Purchase (Investigator) | 6 | class | passive | it grants one of 2 |
| Split Slot | 6 | class | passive | no card: only grants other feats, features or choices |
| Two-Element Infusion | 6 | class | free | no card: only grants other feats, features or choices |
| Additional Ikon | 8 | class | passive | no card: only grants other feats, features or choices |
| Crossblooded Evolution | 8 | class | passive | no card: only grants other feats, features or choices |
| Glitter Crystals | 8 | class | passive | no card: only grants other feats, features or choices |
| Improved Invigorating Elixir | 8 | class | passive | no card: only grants other feats, features or choices |
| Inspired Stratagem | 8 | class | passive | it grants Inspired Stratagem |
| Magical Adept | 8 | class | passive | no card: only grants other feats, features or choices |
| Manifold Modifications | 8 | class | passive | rated 0 |
| Mythic Magic | 8 | class | passive | it grants Cast a Spell |
| Perpetual Breadth | 8 | class | passive | no card: only grants other feats, features or choices |
| Predictive Purchase (Rogue) | 8 | class | passive | it grants one of 2 |
| Second Blessing | 8 | class | passive | rated 0 |
| Stages of Fate | 8 | class | 2 actions | no card: only grants other feats, features or choices |
| Standby Spell | 8 | class | passive | no card: only grants other feats, features or choices |
| Whodunnit? | 8 | class | passive | no card: only grants other feats, features or choices |
| Aura Shaping | 10 | class | passive | no card: only grants other feats, features or choices |
| Cascading Ray | 10 | class | 1 action | no card: only grants other feats, features or choices |
| Disperse Into Petals | 10 | class | passive | it grants Verdant Core Deviant Classification |
| Greater Awakened Power | 10 | class | passive | no card: only grants other feats, features or choices |
| Incredible Familiar (Animist) | 10 | class | passive | no card: only grants other feats, features or choices |
| Killshot's Report | 10 | class | reaction | no card: only grants other feats, features or choices |
| Lightspeed Assault | 10 | class | 1 action | it grants Flicker Deviant Classification |
| Major Lesson | 10 | class | passive | no card: only grants other feats, features or choices |
| Pushing Attack | 10 | class | passive | no card: only grants other feats, features or choices |
| Share Weakness | 10 | class | 1 action | no card: only grants other feats, features or choices |
| Weighty Impact | 10 | class | passive | no card: only grants other feats, features or choices |
| Apocalypse Rider Dedication | 12 | class | passive | no card: only grants other feats, features or choices |
| Beast Lord Dedication | 12 | class | passive | no card: only grants other feats, features or choices |
| Broken Chain Dedication | 12 | class | passive | rated -0.03 |
| Domain Fluency | 12 | class | passive | no card: only grants other feats, features or choices |
| Enigma's Knowledge | 12 | class | passive | it grants Automatic Knowledge |
| Eternal Legend Dedication | 12 | class | passive | no card: only grants other feats, features or choices |
| Expert Spellcasting | 12 | class | passive | no card: only grants other feats, features or choices |
| Flexible Transmogrification | 12 | class | passive | no card: only grants other feats, features or choices |
| Grasping Limbs | 12 | class | passive | no card: only grants other feats, features or choices |
| Prophesied Monarch Dedication | 12 | class | passive | it grants Royal Grace |
| Redirect Teleportation | 12 | class | reaction | no card: only grants other feats, features or choices |
| Thaumaturge's Demesne | 12 | class | passive | no card: only grants other feats, features or choices |
| Timewracked Dedication | 12 | class | passive | it grants Sidestep Through Time |
| Warshard Warrior Dedication | 12 | class | passive | it grants Call Warshard Weapon |
| Wildspell Dedication | 12 | class | passive | a spell the engine doesn't cast |
| Arcane Shroud | 14 | class | passive | no card: only grants other feats, features or choices |
| Avenger of Envy | 14 | class | passive | it grants Aegis of Envy |
| Avenger of Gluttony | 14 | class | passive | rated -0.19 |
| Avenger of Greed | 14 | class | passive | rated 0.05 |
| Avenger of Lust | 14 | class | passive | it grants Sorshen's Devotion |
| Avenger of Sloth | 14 | class | passive | it grants Summon Sloth |
| Avenger of Wrath | 14 | class | passive | it grants Host of Wrath |
| Bloc Tactics | 14 | class | passive | no card: only grants other feats, features or choices |
| Break the Cycle | 14 | class | passive | it grants Legendary Negotiation |
| Determination | 14 | class | 1 action | no card: only grants other feats, features or choices |
| Earworm | 14 | class | passive | no card: only grants other feats, features or choices |
| Heroic Weakness | 14 | class | passive | it grants Makes Me Stronger |
| I've Been Here Before | 14 | class | passive | no card: only grants other feats, features or choices |
| Lightless Sight | 14 | class | passive | it grants Weaponsight |
| Manipulate Realm | 14 | class | passive | it grants one of 3 |
| Plot the Future | 14 | class | passive | no card: only grants other feats, features or choices |
| Transmute Weapon | 14 | class | passive | no card: only grants other feats, features or choices |
| Verdant Metamorphosis | 14 | class | passive | it grants Verdant Rest |
| Warshard Rune | 14 | class | passive | no card: only grants other feats, features or choices |
| Willing Runes | 14 | class | passive | it grants Draw From the Pages |
| Autonomous Arms | 16 | class | passive | it grants Call to Hand |
| Bolstered Recovery | 16 | class | passive | rated -0.02 |
| Fuse Stance | 16 | class | passive | no card: only grants other feats, features or choices |
| Let Death be my Weapon | 16 | class | passive | it grants Share Death's Promises |
| Marshall Fiendish Forces | 16 | class | passive | no card: only grants other feats, features or choices |
| Rapid Switch | 16 | class | free | no card: only grants other feats, features or choices |
| Recharging Transference | 16 | class | 1 action | no card: only grants other feats, features or choices |
| Seat of Power | 16 | class | passive | rated 0 |
| Divine Apex | 18 | class | passive | no card: only grants other feats, features or choices |
| Fated Duel | 18 | class | 1 action | no card: only grants other feats, features or choices |
| Improbable Elixirs | 18 | class | passive | no card: only grants other feats, features or choices |
| Intense Implement | 18 | class | passive | no card: only grants other feats, features or choices |
| Legend of Combat | 18 | class | 1 action | it grants Speed of Arms |
| Magical Master | 18 | class | passive | no card: only grants other feats, features or choices |
| Master Spellcasting | 18 | class | passive | no card: only grants other feats, features or choices |
| Sanctified Relic | 18 | class | passive | no card: only grants other feats, features or choices |
| Trickster's Ace | 18 | class | reaction | no card: only grants other feats, features or choices |
| Assume Godhood | 20 | class | passive | it grants Intercession Spell |
| Craft Runewell | 20 | class | passive | it grants Enter Runewell |
| Cutting Without Blade | 20 | class | passive | no card: only grants other feats, features or choices |
| Emblazon Divinity | 20 | class | passive | no card: only grants other feats, features or choices |
| Eternal Guide | 20 | class | passive | no card: only grants other feats, features or choices |
| Final Union | 20 | class | passive | it grants Additional Lore |
| Forge New Word | 20 | class | passive | no card: only grants other feats, features or choices |
| I am the Weapon | 20 | class | passive | no card: only grants other feats, features or choices |
| Paradoxical Mystery | 20 | class | passive | no card: only grants other feats, features or choices |
| Spell Mastery | 20 | class | passive | no card: only grants other feats, features or choices |
| Swift Paragon | 20 | class | passive | rated 0 |
| Wonder Worker | 20 | class | passive | no card: only grants other feats, features or choices |
| One Among the Masses | 14 | class feature | passive | it grants Overawe Crowd |
| Ancestral Paragon | 3 | general | passive | no card: only grants other feats, features or choices |
| Axuma's Awakening | 11 | general | passive | no card: only grants other feats, features or choices |
| Additional Lore | 1 | skill | passive | no card: only grants other feats, features or choices |
| All of the Animal | 1 | skill | passive | no card: only grants other feats, features or choices |
| Charming Liar | 1 | skill | passive | no card: only grants other feats, features or choices |
| Read Psychometric Resonance | 1 | skill | passive | it grants Psychometric Assessment |
| Secret Speech | 1 | skill | passive | no card: only grants other feats, features or choices |
| Tame Animal | 1 | skill | passive | no card: only grants other feats, features or choices |
| Terrain Stalker | 1 | skill | passive | no card: only grants other feats, features or choices |
| Train Animal | 1 | skill | passive | no card: only grants other feats, features or choices |
| Automatic Knowledge | 2 | skill | passive | no card: only grants other feats, features or choices |
| Wilderness Spotter | 2 | skill | passive | no card: only grants other feats, features or choices |
| Commitment to Equality | 4 | skill | 2 actions | no card: only grants other feats, features or choices |
| Engine Bay | 4 | skill | passive | it grants Quick Repair |
| Kreighton's Cognitive Crossover | 4 | skill | reaction | no card: only grants other feats, features or choices |
| Settlement Scholastics | 4 | skill | passive | it grants Additional Lore |
| Treat Condition | 4 | skill | 2 actions | no card: only grants other feats, features or choices |
| Rally Support | 8 | skill | passive | no card: only grants other feats, features or choices |
| Snap Out of It! (Pathfinder Agent) | 8 | skill | 2 actions | no card: only grants other feats, features or choices |
| Masterful Obfuscation | 10 | skill | passive | no card: only grants other feats, features or choices |
| Play to the Crowd (Dandy) | 12 | skill | passive | it grants Reactive Falsehood |
| Recollect Studies | 12 | skill | 1 action | no card: only grants other feats, features or choices |

### out of combat (exploration, downtime, skills) (352)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Ancestral Insight | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Ancestral Linguistics | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Ask the Bones | 1 | ancestry | free | no card: out of combat (exploration, downtime, skills) |
| Cattle Speech | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Charmed Sleep | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Decisive Swimmer | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Dongun Education | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Elven Aloofness | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Junk Tinker | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Kitsune Spell Familiarity | 1 | ancestry | passive | rated -0.45 |
| Know Your Own | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Like a Roach | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Nagaji Spell Familiarity | 1 | ancestry | passive | rated -0.28 |
| Phantom Visage | 1 | ancestry | 1 action | no card: out of combat (exploration, downtime, skills) |
| Reptile Speaker | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Shisk Lore | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Small Speak | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Undead Empathy | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Wave Speaker | 1 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Focused Cat Nap | 5 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| I've Had Many Jobs | 5 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Kitsune Spell Mysteries | 5 | ancestry | passive | rated -0.15 |
| Nagaji Spell Mysteries | 5 | ancestry | passive | rated -0.27 |
| Puzzle Solver | 5 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Treespeech | 5 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Urban Jungle | 5 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Ambush Hunter | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Anarchic Arcana | 9 | ancestry | passive | rated -0.39 |
| Herbal Forager | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Predator's Growl | 9 | ancestry | reaction | no card: out of combat (exploration, downtime, skills) |
| Rapid Retraining | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Read the Stars | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Rejuvenation Token | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Shore Gift | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Wary Skulker | 9 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Cannibalize Magic | 13 | ancestry | 2 actions | no card: out of combat (exploration, downtime, skills) |
| Eclectic Sword Mastery | 13 | ancestry | 2 actions | no card: out of combat (exploration, downtime, skills) |
| Flame Jump | 13 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Imperial Dragon Potion | 13 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Palm-Leaf Silhouette | 13 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Treehealer | 13 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Vicious Snares | 13 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Fountain of Secrets | 17 | ancestry | free | no card: out of combat (exploration, downtime, skills) |
| Greater Augmentation | 17 | ancestry | passive | no card: out of combat (exploration, downtime, skills) |
| Aeon Resonance | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Arcane School Spell | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Basic Bloodline Spell | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Basic Red Mantis Magic | 4 | archetype | passive | it grants Cast a Spell |
| Blessing of the Sun Gods | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Broadside Buckos | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Cathartic Focus Spell | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| First Revelation | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Grave's Voice | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Holy Bloom | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Hunter's Sanctum | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Hybrid Study Spell | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Leader of All | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Necrotic Bomber | 4 | archetype | passive | rated -0.12 |
| Nocturnal Kindred | 4 | archetype | passive | rated -0.13 |
| Order Spell | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Pact of Fey Glamour | 4 | archetype | passive | rated 0 |
| Remember Your Training | 4 | archetype | 1 action | no card: out of combat (exploration, downtime, skills) |
| Restore Omen | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Rise, My Creature! | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Safe House | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Sense Alignment | 4 | archetype | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Special Sentinel Technique | 4 | archetype | passive | rated 0 |
| Surprise Snare | 4 | archetype | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Tactile Magic Feedback | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| The Taste of Magic | 4 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Unnerving Expansion | 4 | archetype | 1 action | no card: out of combat (exploration, downtime, skills) |
| Annul Compulsion | 6 | archetype | 2 actions | no card: out of combat (exploration, downtime, skills) |
| Barricade Snare | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Basic Scroll Cache | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Counter Perform | 6 | archetype | passive | a spell the engine doesn't cast |
| Deathly Secrets | 6 | archetype | passive | rated 0 |
| Food Preservation | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Magical Scrounger | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Perpetual Scout | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Practical Magic | 6 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Simple Crystal Magic | 6 | archetype | passive | a spell the engine doesn't cast |
| Sun's Fury | 6 | archetype | passive | rated -0.06 |
| Crude Communication | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Deceptive Deduction | 8 | archetype | reaction | no card: out of combat (exploration, downtime, skills) |
| Environmental Adaptability | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Great Boaster | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Haunting Memories | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Innate Magical Intuition | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Invoke the Crimson Oath | 8 | archetype | passive | rated -0.04 |
| Know Your Enemy | 8 | archetype | 1 action | its stance's own gap |
| Malleable Mental Forge | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Persistent Creation | 8 | archetype | passive | a spell the engine doesn't cast |
| Positive Luminance | 8 | archetype | passive | rated 0 |
| Scholar's Hunch | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Sin Reservoir | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Transcribe Moment | 8 | archetype | passive | a spell the engine doesn't cast |
| Veil of Eternity | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Waking Dream | 8 | archetype | passive | rated -0.06 |
| Worm Empathy | 8 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Armor Rune Shifter | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Bear Empathy | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Broad Snare | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Come In From the Wilderness | 10 | archetype | 2 actions | no card: out of combat (exploration, downtime, skills) |
| Cursebreaker | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Define “Report” | 10 | archetype | free | no card: out of combat (exploration, downtime, skills) |
| Eidetic Memorization | 10 | archetype | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Emissary of Peace | 10 | archetype | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Font of Knowledge | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Gather Disciples | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Patron's Whisper | 10 | archetype | passive | a spell the engine doesn't cast |
| Practiced Defender | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Repurposed Parts | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Shall not Falter, Shall not Rout | 10 | archetype | passive | a spell the engine doesn't cast |
| Shared Synergy | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Three Pecks of Dew | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Weapon-Rune Shifter | 10 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Adept Storyteller | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Advanced Seeker of Truths | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Educated Assessment | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Enticing Dwelling | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| For Love, For Lightning | 12 | archetype | passive | a spell the engine doesn't cast |
| General's Gambit | 12 | archetype | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Lightning Snares | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Master of the Dead | 12 | archetype | passive | a spell the engine doesn't cast |
| Officer's Expertise | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Return to the Pit! | 12 | archetype | passive | rated 0 |
| Student of the Dueling Arts | 12 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Bodysnatcher | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Cosmic Cocktail | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Crimson Oath Devotion | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Crusader's Masquerade | 14 | archetype | 1 action | no card: out of combat (exploration, downtime, skills) |
| Domain Embodiment | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Incredible Recollection | 14 | archetype | 1 action | no card: out of combat (exploration, downtime, skills) |
| Mask of the 15th Step | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Pact of Eldritch Eyes | 14 | archetype | passive | a spell the engine doesn't cast |
| Regional Specialty | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Resolute Defender | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Stories of Home | 14 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Advanced Runic Mind Smithing | 16 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Greater Armament | 16 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Invisible Hand | 16 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Pact of the Rune Dragon | 16 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Look Again | 18 | archetype | 1 action | no card: out of combat (exploration, downtime, skills) |
| Officer's Mastery | 18 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Living God | 20 | archetype | passive | no card: out of combat (exploration, downtime, skills) |
| Storyteller's Mask | 20 | archetype | passive | rated -0.17 |
| Apparition Sense | 1 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Armored Regiment Training | 1 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Glean Lore | 1 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| Underworld Investigator | 1 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Versatile Performance | 1 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Zoophonic Communication | 1 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Animal Empathy (Ranger) | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Bone Speaker | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Demolition Charge | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Emblazon Armament | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Esoteric Polymath | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Personalized Poisoning | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Solid Lead | 2 | class | passive | no card: out of combat (exploration, downtime, skills) |
| We've Met Before | 2 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| Acclimated Mount | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Elaborate Flourish | 4 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| Heaven-Earth Encompassing Sleeves | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Ongoing Investigation | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Paired Link | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Sheltering Cave | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Terrifying Invocation | 4 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| Unbelievably Believable | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Versatile Signature | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Wolf in Sheep's Clothing | 4 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Anticipate Ambush | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Ceremonial Knife | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Master Summoner | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Quick Snares | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Scroll Esoterica | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Swift Tracker | 6 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Alter Admixture | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Eerie Environs | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Eerie Traces | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Forgotten Presence | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Fused Staff | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Read Disaster | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Steal Magic | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Witch's Bottle | 8 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Annotate Composition | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Apparition's Quickening | 10 | class | free | no card: out of combat (exploration, downtime, skills) |
| Gift of the Hoard | 10 | class | passive | rated -0.05 |
| Merciful Elixir | 10 | class | free | no card: out of combat (exploration, downtime, skills) |
| Overloaded Ammunition | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Potent Poisoner | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Radiant Armament | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Runic Correspondence | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Scroll Adept | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Shield Salvation | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Spatial Awareness | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Speak With Days Long Dead | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Warden's Step | 10 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Contingency Gadgets | 12 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Eclectic Polymath | 12 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Expanded Glossary | 12 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Keen Magical Detection | 12 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Reason Rapidly | 12 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| Shadows Within Shadows | 12 | class | reaction | no card: out of combat (exploration, downtime, skills) |
| Witch's Broom | 12 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Claim Cardinal Domains | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Consult Celestial Advisor | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Forensic Countermeasures | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Guarded Domain | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Mutant Innervation | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| My Reputation Precedes Me | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Myth of Quick-Thinking | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Rapid Reattunement | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Reincarnated Companion | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Rites of Liberation | 14 | class | passive | rated 0 |
| Tongue of Sun and Moon | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| True Hypercognition | 14 | class | 1 action | no card: out of combat (exploration, downtime, skills) |
| United Front | 14 | class | passive | no card: out of combat (exploration, downtime, skills) |
| A Thousand Cries for Help | 16 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Monstrous Inclinations | 16 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Persistent Mutagen | 16 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Reconstruct the Scene | 16 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Telepathic Union | 16 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Conflux Wellspring | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Infinite Possibilities | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Lead Investigator | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Living Lexicon | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Miraculous Possibility | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Reprepare Spell | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| True Transmogrification | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Versatile Spellstrike | 18 | class | passive | no card: out of combat (exploration, downtime, skills) |
| All the Time in the World | 20 | class | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Bloodline Metamorphosis | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Craft Philosopher's Stone | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Efficient Alchemy (Paragon) | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Impossible Snares | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| One Life, Two Vessels | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Shield Paragon | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Ultimate Flexibility | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Wish Alchemy | 20 | class | passive | no card: out of combat (exploration, downtime, skills) |
| Pick up the Pace | 3 | general | passive | no card: out of combat (exploration, downtime, skills) |
| A Home in Every Port | 11 | general | passive | no card: out of combat (exploration, downtime, skills) |
| Alchemical Crafting | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Armor Assist | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Bargain Hunter | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Battle Medicine | 1 | skill | 1 action | no card: out of combat (exploration, downtime, skills) |
| Courtly Graces | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Crafter's Appraisal | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Deceptive Worship | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Experienced Smuggler | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Experienced Tracker | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Express Rider | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Forensic Acumen | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Glean Contents | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Group Coercion | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Group Impression | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Impressive Performance | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Improvise Tool | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Intimidating Glare | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Lie to Me | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Quick Coercion | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Quick Identification | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Read Lips | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Schooled in Secrets | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Sign Language | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Snare Crafting | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Stitch Flesh | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Streetwise | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Survey Wildlife | 1 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Trick Magic Item | 1 | skill | 1 action | no card: out of combat (exploration, downtime, skills) |
| Vicious Critique | 1 | skill | free | no card: out of combat (exploration, downtime, skills) |
| Aura Sight | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Automatic Writing | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Backup Disguise | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Battle Planner | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Bonded Animal | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Communal Crafting | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Confabulator | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Cooperative Crafting | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Criminal Connections | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Discreet Inquiry | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Dueling Acumen | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Embed Aeon Stone | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Express Driver | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Eyes of the City | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Glad-Hand | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Half-Truths | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Inventor | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Lasting Coercion | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Lead Climber | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Leverage Connections | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Magical Crafting | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Mortal Healing | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Pei Zing Adept | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Quick Contacts | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Quick Disguise | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Sow Rumor | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Spirit Speaker | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Tactical Acumen | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Tweak Appearances | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Unusual Treatment | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| What's That up Your Sleeve | 2 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| We're on the List | 3 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Ambush Tactics | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Change of Face | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Efficient Explorer | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Familiar Foe | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Hidden Magic | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| In Plain Sight | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Inner Sea Privateer | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Named Artillery | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Orthographic Mastery | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Peer Past the Hedge | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Phonetic Training | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Text Decoder | 4 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Cadre | 6 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Megafauna Veterinarian | 6 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Uzunjati Storytelling | 6 | skill | 1 action | no card: out of combat (exploration, downtime, skills) |
| Adventurous Outfitter | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| As On the Board, So On the Battlefield | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Beautiful Knifework | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Bizarre Magic | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Break Curse | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Consult the Spirits | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Fabricated Connections | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Fabricated Credentials | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Impeccable Crafting | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Inflame Crowd | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Influence Nature | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Master of Apprentice | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Monster Crafting | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Morphic Manipulation | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Planar Survival | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Prepare Papers | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Read Shibboleths | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Shameless Request | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Speech of the Mammoth Lords | 7 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Diverse Recognition | 8 | skill | free | no card: out of combat (exploration, downtime, skills) |
| Improvised Crafting | 8 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Recognize Threat | 8 | skill | free | no card: out of combat (exploration, downtime, skills) |
| Unravel Mysteries | 8 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Uzunjati Recollection | 10 | skill | 1 action | no card: out of combat (exploration, downtime, skills) |
| Rugged Survivalist | 12 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Master Merchant | 14 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Craft Anything | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Legendary Codebreaker | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Legendary Guide | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Legendary Linguist | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Legendary Negotiation | 15 | skill | 3 actions | no card: out of combat (exploration, downtime, skills) |
| Legendary Performer | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Legendary Professional | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Unified Theory | 15 | skill | passive | no card: out of combat (exploration, downtime, skills) |
| Preternatural Polish | 16 | skill | passive | no card: out of combat (exploration, downtime, skills) |

### a combat passive no reader or hand plan covers yet (186)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Aeonbound | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Cleansing Subroutine | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Fearsense | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Internal Cohesion | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Internal Compartment | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Koi Secrets | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Remorseless Lash | 1 | ancestry | passive | rated 0 |
| Wash Out | 1 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Defiance Unto Death | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Defy the Darkness | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Graceful Guidance | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Inoculation Subroutine | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Insulated Poppet | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Loud Singer | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Loyal Empath | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Mask of Power | 5 | ancestry | passive | rated -0.15 |
| Metabolic Control | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Sealed Poppet | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Smoke Through Bamboo | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Springing Leaper | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Tenacious Net | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Winglets | 5 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Battleforger | 9 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Dance Underfoot | 9 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Ragdya's Dance | 9 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Swift Application | 9 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Explosive Expert | 13 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Improved Elemental Bulwark | 13 | ancestry | passive | rated 0 |
| Steadfast Ally | 13 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Stronger Debilitating Venom | 13 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Flock as One | 17 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Return to the Seed | 17 | ancestry | passive | no card: a combat passive no reader or hand plan covers yet |
| Acclimatization | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Beastkin Resilience | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Brastlewark Snare Engineering | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Dragon Arcana | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Dual Thrower | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Entity's Strike | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Experienced Follower | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Fly Swat | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Gravelands Herbalist | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Modular Dynamo | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Perfect Strike | 4 | archetype | passive | rated 0.16 |
| Poultice Preparation | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Safety Measures | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Tandem Onslaught | 4 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Crowd Mastery | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Endemic Herbs | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| No Hard Feelings | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Poisoned Sticks and Stones | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Remote Trigger | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Superior Propulsion | 6 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Back to Back | 8 | archetype | passive | rated 0.02 |
| Controlled Blast | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Creed Magic | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Deadly Mutation | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Impervious Vehicle | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Interposing Crowd | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Live Ammunition | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Magpie Manor Recovery | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Mind Projectiles | 8 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Beast Dynamo Howl | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Crack Retort | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Hook 'Em | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Lastwall Warden | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Mask of the 12th Step | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Sin Counterspell | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Stalwart Standard | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Starlit Spells | 10 | archetype | passive | rated -0.16 |
| Steal the Sky | 10 | archetype | passive | rated -0.03 |
| Sweeping Fan Redirection | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Unobstructed Shot | 10 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Alchemical Power | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Coordinated Tactics | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Eagle Eyes | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Festering Wounds | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Frightening Appearance | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Imbue Mindlessness | 12 | archetype | passive | rated 0.03 |
| Lesson of Unified Elusion | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Metallic Envisionment | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Reverse Curse | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Secrets of Shadow | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Ward Slumber | 12 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Concentrated Assault | 14 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Enshroud Soul Cage | 14 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Pact of the Death Hunter | 14 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Shape of the Cloud Dragon | 14 | archetype | passive | rated -0.44 |
| Shape of the Dragon | 14 | archetype | passive | rated -0.44 |
| Tactical Cadence | 14 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Unseen Shot | 14 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Rallying Charge (Knight Vigilant) | 16 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Shared Mind, Shared Heart | 16 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Withstand Death | 16 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Ever Dreaming | 18 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| School Spell Redirection | 18 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Uncanny Vitae | 18 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Pack Takedown | 20 | archetype | passive | no card: a combat passive no reader or hand plan covers yet |
| Blowgun Poisoner | 1 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Martial Performance | 1 | class | passive | rated 0.03 |
| Raging Thrower | 1 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| The Hallowed Dead | 1 | class | passive | rated 0.02 |
| The Unholy Dead | 1 | class | passive | rated 0.02 |
| Antagonize | 2 | class | passive | rated -0.09 |
| Binds That Tie | 2 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Certain Stratagem | 2 | class | passive | rated 0 |
| Clotting Elixirs | 2 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Dancing Leaf | 2 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Pernicious Poison | 2 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Phalanx Formation | 2 | class | passive | rated 0 |
| Healing Bomb | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Longshanks Slam | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Mobile Thralls | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Only the Worthy | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Shielded Stride | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Unending Subsistence | 4 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Bloody Tendrils | 6 | class | passive | rated -0.12 |
| Claim the Field | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Defy Fey | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Fling Into Action | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Fortified Elixirs | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Fungal Exhalation | 6 | class | passive | rated 0.02 |
| Precise Finisher | 6 | class | passive | rated 0.02 |
| Return Fire | 6 | class | passive | its stance's own gap |
| Runic Reprisal | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Shield Warden | 6 | class | passive | rated -0.09 |
| Snap Shot | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Sticky Poison | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Sympathetic Vulnerabilities | 6 | class | passive | rated 0 |
| Water Step | 6 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Blind-Fight | 8 | class | passive | rated 0 |
| Greater Mercy | 8 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Projectile Snatching | 8 | class | passive | rated 0 |
| Syu Tak-nwa's Hexed Locks | 8 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Water Walker | 8 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Crashing Slam | 10 | class | passive | rated 0.15 |
| Spectral Advance | 10 | class | passive | rated 0 |
| Unstable Concoction | 10 | class | passive | rated 0.04 |
| Divine Wall | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Gigavolt | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Liberating Stride | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Necromancer's Visage | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Ricochet Feint | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Shared Assault | 12 | class | passive | rated -0.12 |
| Shared Replenishment | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Sprinting Spellstrike | 12 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Aura of Vengeance | 14 | class | passive | rated 0.02 |
| Avoid Fate's Gaze | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Cardinal Guardians | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Consume Spell | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Decree of Banishment | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Disruptive Blur | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Double Poison | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Steadfast Grip | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Strategic Bypass | 14 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Ricochet Master | 16 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Shattering Blows | 16 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Walk on the Wind | 16 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Grand Scroll Esoterica | 18 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Parry and Riposte | 18 | class | passive | rated 0 |
| Reanimate Foe | 18 | class | passive | a spell the engine doesn't cast |
| Rebellious Existence | 18 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Banishing Blow | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Boundless Reprisals | 20 | class | passive | rated 0.14 |
| Immortal Ruin | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Inexhaustible Countermoves | 20 | class | passive | rated 0 |
| Once and Future | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Reach for Immortality | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Remake the World | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Spell Combination | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Witch's Hut | 20 | class | passive | no card: a combat passive no reader or hand plan covers yet |
| Mystic Life Force | 20 | class feature | passive | no card: a combat passive no reader or hand plan covers yet |
| Feather Step | 1 | general | passive | no card: a combat passive no reader or hand plan covers yet |
| Numb to Death | 7 | general | passive | no card: a combat passive no reader or hand plan covers yet |
| Combat Climber | 1 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Quick Jump | 1 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Speedrun Strats | 1 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Fleeing Diversion | 2 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Nimble Crawl | 2 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Rolling Landing | 2 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Final Rest | 4 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Gear Gnash | 4 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Chronocognizance | 7 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Environmental Guide | 7 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Wall Jump | 7 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Water Sprint | 7 | skill | passive | no card: a combat passive no reader or hand plan covers yet |
| Quick Spring | 13 | skill | passive | no card: a combat passive no reader or hand plan covers yet |

### spellcasting the spell module or PF2e handles (177)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Awakened Jewel | 1 | ancestry | passive | no card: spellcasting the spell module or PF2e handles |
| Icy Influence | 1 | ancestry | passive | rated -0.24 |
| Touch of the Sea | 1 | ancestry | passive | rated -0.21 |
| Leave no Trace | 5 | ancestry | passive | a spell the engine doesn't cast |
| Steam Spell | 5 | ancestry | 1 action | no card: spellcasting the spell module or PF2e handles |
| Water Conjuration | 5 | ancestry | passive | a spell the engine doesn't cast |
| Pinch Time | 9 | ancestry | passive | rated 0.02 |
| Terrorize | 9 | ancestry | passive | rated -0.09 |
| Killing Stone | 13 | ancestry | passive | rated -0.04 |
| Kitsune Spell Expertise | 13 | ancestry | passive | rated -0.13 |
| Nagaji Spell Expertise | 13 | ancestry | passive | rated -0.02 |
| Azaersi's Roads | 17 | ancestry | passive | a spell the engine doesn't cast |
| Eyes of the Sea | 17 | ancestry | passive | rated 0 |
| This is What it's Like to Die | 17 | ancestry | passive | rated -0.06 |
| First Frost | 2 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Hedge Mage Spellcasting | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Necromancer Spellcasting | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Pactbreaker Spellcasting | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Prophet Spellcasting | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Rivethun Spellcasting | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Corpse Tender's Font | 4 | archetype | passive | rated -0.08 |
| Crystal Ward Spells | 4 | archetype | passive | a spell the engine doesn't cast |
| Hallowed Initiate | 4 | archetype | passive | rated -0.33 |
| Immortal Lightness | 4 | archetype | passive | rated -0.15 |
| Mage's Field Dressing | 4 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Magic Warrior Aspect | 4 | archetype | passive | a spell the engine doesn't cast |
| Magic Warrior Transformation | 4 | archetype | passive | a spell the engine doesn't cast |
| Pact of Huldra's Renewal | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Painful Spell | 4 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Patron's Glamour | 4 | archetype | passive | rated 0 |
| Pin the Spears in the Lamb | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Shield Spell Reinforcement | 4 | archetype | free | no card: spellcasting the spell module or PF2e handles |
| Snowcaster | 4 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Tender Ministrations | 4 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Thrall Charger | 4 | archetype | passive | rated 0.08 |
| Warding Light | 4 | archetype | passive | rated 0 |
| Wyldsinger | 4 | archetype | passive | rated -0.1 |
| Basic Magus Spellcasting | 6 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Beastmaster's Trance | 6 | archetype | passive | a spell the engine doesn't cast |
| Cascade Bearer's Flexibility | 6 | archetype | free | no card: spellcasting the spell module or PF2e handles |
| Heightened Captivation | 6 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Humble Spell | 6 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Infernal Magic | 6 | archetype | passive | rated -0.55 |
| Night's Glow | 6 | archetype | passive | rated -0.14 |
| Red Mantis School Spell | 6 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Siphon Magic | 6 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Sound Mirror | 6 | archetype | passive | rated 0 |
| Tempest-Sun Redirection | 6 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Achaekek's Grip | 8 | archetype | passive | rated 0 |
| Advanced Hallowed Spell | 8 | archetype | passive | rated 0 |
| Anthemic Performance | 8 | archetype | passive | rated 0.01 |
| Apparition Magic | 8 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Basic Beast Gunner Spellcasting | 8 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Blessed Spell | 8 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Breath of the Dragon (Dragon Disciple) | 8 | archetype | passive | rated 0.03 |
| Call Ursine Ally | 8 | archetype | passive | rated -0.62 |
| Chronomancer's Secrets | 8 | archetype | passive | rated 0.06 |
| Divine Healing | 8 | archetype | passive | rated 0.06 |
| Dream Magic | 8 | archetype | passive | rated -0.01 |
| Glimpse the Netherworld | 8 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Lion's Magic | 8 | archetype | passive | rated -0.06 |
| Mantis Form | 8 | archetype | passive | a spell the engine doesn't cast |
| Primal Guardian | 8 | archetype | passive | rated 0.19 |
| Shielding Formation | 8 | archetype | passive | rated 0.14 |
| Simple Mastery | 8 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Wall of Roses | 8 | archetype | passive | a spell the engine doesn't cast |
| Cascade Bearer's Spellcasting | 10 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Eldritch Reload | 10 | archetype | free | no card: spellcasting the spell module or PF2e handles |
| Greater Deathly Secrets | 10 | archetype | passive | rated -0.04 |
| Halcyon Spellcasting Initiate | 10 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Proscribe Devilry | 10 | archetype | passive | rated 0 |
| Recover Spell | 10 | archetype | 1 action | no card: spellcasting the spell module or PF2e handles |
| Shadow Magic | 10 | archetype | passive | a spell the engine doesn't cast |
| Spellmaster's Ward | 10 | archetype | passive | a spell the engine doesn't cast |
| Strident Command | 10 | archetype | passive | rated -0.2 |
| Vindicator's Judgment | 10 | archetype | passive | rated -0.02 |
| Battlefield Arcana | 12 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Expert Hedge Mage Spellcasting | 12 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Flexible Halcyon Spellcasting | 12 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Manifold Conduit | 12 | archetype | 1 action | rated -0.12 |
| Night's Shine | 12 | archetype | passive | rated -0.23 |
| Shadow Illusion | 12 | archetype | passive | a spell the engine doesn't cast |
| Wings of the Dragon | 12 | archetype | passive | rated 0 |
| Call Draconic Ally | 14 | archetype | passive | rated -0.34 |
| Commandeer Hellmouth | 14 | archetype | passive | a spell the engine doesn't cast |
| Community Needs | 14 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Halcyon Spellcasting Adept | 14 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Cross the Threshold | 16 | archetype | passive | a spell the engine doesn't cast |
| Dominating Gaze | 16 | archetype | passive | rated -0.13 |
| Quickened Attunement | 16 | archetype | free | no card: spellcasting the spell module or PF2e handles |
| Spell Gem | 16 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Vellumis Excision | 16 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Halcyon Spellcasting Sage | 18 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Master Hedge Mage Spellcasting | 18 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Retain Absorbed Spell | 18 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Emancipator's Mask | 20 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| May Death Itself Reconsider | 20 | archetype | passive | rated 0 |
| More Real Than Real | 20 | archetype | passive | rated 0 |
| Stalking Feline Mask | 20 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Tireless Guide's Mask | 20 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Vigilant Mask | 20 | archetype | passive | no card: spellcasting the spell module or PF2e handles |
| Locate Lawbreakers | 0 | bonus | passive | no card: spellcasting the spell module or PF2e handles |
| Backup Runic Enhancement | 1 | class | passive | rated 0.08 |
| Lingering Composition | 1 | class | passive | rated 0.01 |
| Splinter Faith | 1 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Unbound Torrent | 1 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Embodiment of the Balance | 2 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Minor Magic | 2 | class | passive | it grants Cast a Spell |
| Song of Strength | 2 | class | passive | rated 0 |
| Uplifting Overture | 2 | class | passive | rated 0 |
| Divine Evolution | 4 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Primal Evolution | 4 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Rallying Anthem | 4 | class | passive | rated 0.05 |
| Steady Spellcasting (Magus) | 4 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Triple Time | 4 | class | passive | rated -0.11 |
| Walk the Wilds | 4 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Conjurer of Corpses | 6 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Detonating Spell | 6 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Dirge of Doom | 6 | class | passive | rated 0.05 |
| Gifted Power | 6 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Shielded Tome | 6 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Song of Marching | 6 | class | passive | a spell the engine doesn't cast |
| Spell Crash | 6 | class | 2 actions | no card: spellcasting the spell module or PF2e handles |
| Fortissimo Composition | 8 | class | passive | rated 0.1 |
| Helt's Spelldance | 8 | class | 3 actions | no card: spellcasting the spell module or PF2e handles |
| Knockback Spell | 8 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Loaner Spell | 8 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Whirlpool's Pull | 8 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Wind Seeker | 8 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Ancestral Mage | 10 | class | passive | no card: spellcasting the spell module or PF2e handles |
| House of Imaginary Walls | 10 | class | passive | a spell the engine doesn't cast |
| Lunging Spellstrike | 10 | class | 2 actions | no card: spellcasting the spell module or PF2e handles |
| Mythic Casting | 10 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Through Spell | 10 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Explosive Metamorphosis | 12 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Foreseen Failure | 12 | class | free | no card: spellcasting the spell module or PF2e handles |
| Greater Physical Evolution | 12 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Silver's Refrain | 12 | class | passive | rated 0 |
| Allegro | 14 | class | passive | rated -0.11 |
| Conscious Spell Specialization | 14 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Expanded Runelord Magic | 14 | class | passive | rated 0 |
| Mysterious Repertoire | 14 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Mythic Heightening | 14 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Reliable Magic | 14 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Sepulchral Sublimation | 14 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Unholy Resurrection | 14 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Beckoning Dirge | 16 | class | free | no card: spellcasting the spell module or PF2e handles |
| Daunting Spell | 16 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Fey Life | 16 | class | passive | rated -0.37 |
| Font of Life or Death | 16 | class | passive | rated -0.14 |
| Greater Mental Evolution | 16 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Greater Vital Evolution | 16 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Imbue Spell | 16 | class | free | no card: spellcasting the spell module or PF2e handles |
| Maze of Runes | 16 | class | passive | a spell the engine doesn't cast |
| Spiritual Spellshape Stance | 16 | class | 1 action | no card: spellcasting the spell module or PF2e handles |
| Studious Capacity | 16 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Advanced Runelord Magic | 18 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Divine Effusion | 18 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Galvanize Spell | 18 | class | free | no card: spellcasting the spell module or PF2e handles |
| Greater Crossblooded Evolution | 18 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Improved Swift Banishment | 18 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Mana Detonation | 18 | class | passive | rated 0 |
| Qi Center | 18 | class | free | no card: spellcasting the spell module or PF2e handles |
| Archwizard's Might | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Bloodline Perfection | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Hierophant's Power | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Legendary Summoner | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Maker of Miracles | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Mind Over Matter | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Mortem Ultimatum | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Oracular Providence | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Patron's Truth | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Perfect Encore | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Reclaim Spell | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Spellshape Channel | 20 | class | free | no card: spellcasting the spell module or PF2e handles |
| True Channel Spell | 20 | class | passive | no card: spellcasting the spell module or PF2e handles |
| Arcane Sense | 1 | skill | passive | a spell the engine doesn't cast |

### companions, familiars and eidolons (96)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Riptide Mount | 5 | ancestry | 1 action | no card: companions, familiars and eidolons |
| Solidarity | 9 | ancestry | 1 action | rated 0.03 |
| Additional Companion | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Basic Animist Spellcasting | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Basic Summoner Spellcasting | 4 | archetype | passive | it grants Cast a Spell |
| Familiar Conduit | 4 | archetype | 1 action | no card: companions, familiars and eidolons |
| Heal Animal | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Initial Eidolon Ability | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Reckless Riding Lunge | 4 | archetype | 1 action | no card: companions, familiars and eidolons |
| Ride-By Recovery | 4 | archetype | reaction | no card: companions, familiars and eidolons |
| Spirit Companion | 4 | archetype | passive | rated 0.07 |
| Spirit of the Beast | 4 | archetype | passive | a spell the engine doesn't cast |
| Spiritual Explorer | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Winged Leap | 4 | archetype | passive | no card: companions, familiars and eidolons |
| Defend Mount | 6 | archetype | reaction | rated 0.02 |
| Improved Familiar (Familiar Master) | 6 | archetype | passive | no card: companions, familiars and eidolons |
| It's Alive! | 6 | archetype | passive | no card: companions, familiars and eidolons |
| Let My Creature Live! | 6 | archetype | passive | rated 0.1 |
| Tempest Cloud's Speed | 6 | archetype | passive | no card: companions, familiars and eidolons |
| Vaulting Gallop | 6 | archetype | 2 actions | no card: companions, familiars and eidolons |
| War Rider Stance | 6 | archetype | 1 action | no card: companions, familiars and eidolons |
| Behold My Creation! | 8 | archetype | passive | rated 0.07 |
| Familiar Form | 8 | archetype | passive | a spell the engine doesn't cast |
| Familiar Ritualist | 8 | archetype | passive | no card: companions, familiars and eidolons |
| Future Spell Learning | 8 | archetype | passive | no card: companions, familiars and eidolons |
| Lightning Rings' Intervention | 8 | archetype | passive | no card: companions, familiars and eidolons |
| Mutable Familiar | 8 | archetype | passive | no card: companions, familiars and eidolons |
| Trampling Charge | 10 | archetype | 3 actions | rated -0.08 |
| Unbreakable Bond | 10 | archetype | passive | no card: companions, familiars and eidolons |
| Lightning Rings' Overcharge | 12 | archetype | passive | no card: companions, familiars and eidolons |
| Pupil's Guard | 12 | archetype | reaction | no card: companions, familiars and eidolons |
| Strafing Breath | 12 | archetype | 3 actions | no card: companions, familiars and eidolons |
| Their Master's Call | 12 | archetype | 1 action | no card: companions, familiars and eidolons |
| A Miracle of Science! | 14 | archetype | passive | rated 0.15 |
| Signature Synergy | 14 | archetype | passive | no card: companions, familiars and eidolons |
| Specialized Mount | 14 | archetype | passive | rated 0.15 |
| Specialized Spirit Companion | 14 | archetype | passive | rated 0.15 |
| Gallop Across Shadow | 16 | archetype | passive | no card: companions, familiars and eidolons |
| Legendary Rider | 20 | archetype | passive | rated 0.1 |
| Animal Companion | 1 | class | passive | rated 0.16 |
| Commander's Companion | 1 | class | passive | rated 0.15 |
| Energy Heart | 1 | class | passive | no card: companions, familiars and eidolons |
| Extend Boost | 1 | class | passive | a spell the engine doesn't cast |
| Faithful Steed | 1 | class | passive | rated 0.34 |
| Heal Companion | 1 | class | passive | rated -0.02 |
| Meld into Eidolon | 1 | class | 3 actions | no card: companions, familiars and eidolons |
| No! No! I Created You! | 1 | class | reaction | no card: companions, familiars and eidolons |
| Prototype Companion | 1 | class | passive | rated 0.28 |
| Unfetter Eidolon | 1 | class | passive | a spell the engine doesn't cast |
| Collapse Construct | 2 | class | 1 action | no card: companions, familiars and eidolons |
| Magic Hide | 2 | class | passive | rated -0.11 |
| Magical Understudy | 2 | class | passive | no card: companions, familiars and eidolons |
| Reinforce Eidolon | 2 | class | passive | no card: companions, familiars and eidolons |
| Scatter Swarm | 2 | class | 1 action | no card: companions, familiars and eidolons |
| Steed Form | 2 | class | passive | no card: companions, familiars and eidolons |
| Call Wizardly Tools | 4 | class | 1 action | no card: companions, familiars and eidolons |
| Companion's Cry | 4 | class | passive | rated -0.13 |
| Improved Familiar (Witch) | 4 | class | passive | no card: companions, familiars and eidolons |
| Lifelink Surge | 4 | class | passive | rated -0.17 |
| Linked Focus | 4 | class | passive | no card: companions, familiars and eidolons |
| Natural Conduit | 4 | class | 1 action | no card: companions, familiars and eidolons |
| Reactive Dismissal | 4 | class | reaction | no card: companions, familiars and eidolons |
| Shrink Down | 4 | class | 1 action | no card: companions, familiars and eidolons |
| Skilled Partner | 4 | class | passive | no card: companions, familiars and eidolons |
| Tandem Movement | 4 | class | 1 action | rated 0.01 |
| Battle-Tested Companion | 6 | class | passive | rated 0.27 |
| Blood Frenzy | 6 | class | passive | no card: companions, familiars and eidolons |
| Eidolon's Wrath | 6 | class | passive | rated 0 |
| Grown of Oak | 6 | class | passive | rated 0 |
| Loyal Warhorse | 6 | class | passive | rated 0.28 |
| Nidarrmar Steed | 6 | class | passive | no card: companions, familiars and eidolons |
| Energy Resistance | 8 | class | passive | no card: companions, familiars and eidolons |
| Enlarge Companion | 8 | class | passive | rated -0.03 |
| Faithful Stride | 8 | class | 2 actions | no card: companions, familiars and eidolons |
| Miniaturize | 8 | class | passive | no card: companions, familiars and eidolons |
| Spirit Familiar (Witch) | 8 | class | passive | no card: companions, familiars and eidolons |
| Stitched Familiar | 8 | class | passive | no card: companions, familiars and eidolons |
| Imposing Destrier | 10 | class | passive | rated 0.02 |
| Protective Bond | 10 | class | reaction | no card: companions, familiars and eidolons |
| Transpose | 10 | class | 1 action | no card: companions, familiars and eidolons |
| Green Tongue | 12 | class | passive | no card: companions, familiars and eidolons |
| Patron's Presence | 14 | class | passive | no card: companions, familiars and eidolons |
| Rites of Transfiguration | 14 | class | passive | no card: companions, familiars and eidolons |
| Share Eidolon Magic | 14 | class | passive | no card: companions, familiars and eidolons |
| Stealthy Companion | 14 | class | passive | no card: companions, familiars and eidolons |
| Superior Bond | 14 | class | passive | no card: companions, familiars and eidolons |
| To War! | 16 | class | 3 actions | no card: companions, familiars and eidolons |
| Patron's Claim | 18 | class | passive | no card: companions, familiars and eidolons |
| Soul Vessel Mount | 18 | class | passive | a spell the engine doesn't cast |
| Demon's Hair | 20 | class | passive | no card: companions, familiars and eidolons |
| Twin Eidolon | 20 | class | passive | no card: companions, familiars and eidolons |
| Minion Guise | 4 | skill | passive | no card: companions, familiars and eidolons |
| Mounting Leap | 4 | skill | 1 action | no card: companions, familiars and eidolons |
| Quick Mount | 4 | skill | 1 action | no card: companions, familiars and eidolons |
| Craft Facsimile | 6 | skill | passive | no card: companions, familiars and eidolons |
| Dashing Pickup | 6 | skill | 1 action | no card: companions, familiars and eidolons |

### a combat action no reader or hand plan covers yet (79)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Caretaker's Restoration | 1 | ancestry | free | no card: a combat action no reader or hand plan covers yet |
| Dig Quickly | 1 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Perfect Dive | 1 | ancestry | 1 action | no card: a combat action no reader or hand plan covers yet |
| Gnaw | 5 | ancestry | 3 actions | no card: a combat action no reader or hand plan covers yet |
| Hopping Stride | 5 | ancestry | 1 action | rated 0 |
| Ratfolk Roll | 5 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Skin Split | 5 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Tunnel Roll | 5 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Well-Armed | 5 | ancestry | 1 action | no card: a combat action no reader or hand plan covers yet |
| Cling | 9 | ancestry | 1 action | no card: a combat action no reader or hand plan covers yet |
| Flowering Path | 9 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Friendly Fling | 9 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Jotun's Boost | 9 | ancestry | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Combined Form | 13 | ancestry | reaction | no card: a combat action no reader or hand plan covers yet |
| Focused Fire | 4 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Reach Beyond | 4 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Reflexive Catch | 4 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Ensnaring Disarm | 6 | archetype | free | no card: a combat action no reader or hand plan covers yet |
| Feeling Your Oats | 6 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Infiltrator's Reload | 6 | archetype | 1 action | rated 0.01 |
| Sundown Street Posturing | 6 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Swift Intervention | 6 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Lesson of Sympathetic Vulnerability | 8 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Rule of Three | 8 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Burrowing Shot | 10 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Clarify Hellfire | 10 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| I Meant to do That | 10 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Rain-Scribe Mobility | 10 | archetype | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Silent Sting | 10 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Stir Allies | 10 | archetype | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Beastmaster's Call | 12 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Collapse Wall | 12 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Danse Macabre | 12 | archetype | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Redirect Elements | 12 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Steal Magic's Breath | 12 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Commitment to Vigilance | 14 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Cratering Drop | 14 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Form Lock | 14 | archetype | 1 action | no card: a combat action no reader or hand plan covers yet |
| Converge | 16 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Purge of Moments | 16 | archetype | 3 actions | no card: a combat action no reader or hand plan covers yet |
| No Need to Fear | 18 | archetype | reaction | no card: a combat action no reader or hand plan covers yet |
| Timeline-Splitting Spell | 18 | archetype | 3 actions | no card: a combat action no reader or hand plan covers yet |
| Blast Lock | 1 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Crossbow Ace | 1 | class | 1 action | rated 0.01 |
| Relentless Stalker | 2 | class | reaction | no card: a combat action no reader or hand plan covers yet |
| Surface Rush | 4 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Engraving Maneuver | 6 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Surface Tension | 6 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Delay Trap | 8 | class | reaction | no card: a combat action no reader or hand plan covers yet |
| Drawn In Vital Ink | 8 | class | free | no card: a combat action no reader or hand plan covers yet |
| Friendly Toss | 8 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Grand Dance | 8 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Sidestep | 8 | class | reaction | rated 0 |
| Swipe Souvenir | 8 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Unbelievable Interception | 8 | class | reaction | no card: a combat action no reader or hand plan covers yet |
| Chain Infusion | 10 | class | 1 action | rated -0.16 |
| Desperate Surge | 10 | class | 1 action | rated -0.03 |
| Dream Guise | 10 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Impose Order (Psychic) | 10 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Shield of Reckoning | 10 | class | reaction | rated 0 |
| Orbiting Runestone | 12 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Overwhelming Spellstrike | 12 | class | 2 actions | rated 0 |
| Amalgamate | 14 | class | 1 action | rated -0.19 |
| Banish Falsehoods of Flesh | 14 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Flamboyant Leap | 14 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Trespass Teleportation | 14 | class | reaction | its stance's own gap |
| Dispelling Spellstrike | 16 | class | 3 actions | no card: a combat action no reader or hand plan covers yet |
| Indomitable Shot | 16 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Spell Tinker | 16 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Final Shot Knows the Way | 18 | class | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Whirlwind Toss | 18 | class | 1 action | no card: a combat action no reader or hand plan covers yet |
| Denier of Destruction | 20 | class | reaction | no card: a combat action no reader or hand plan covers yet |
| Everdistant Defense | 20 | class | reaction | no card: a combat action no reader or hand plan covers yet |
| Plum Deluge | 20 | class | 3 actions | no card: a combat action no reader or hand plan covers yet |
| Improvised Repair | 3 | general | 3 actions | no card: a combat action no reader or hand plan covers yet |
| Chromotherapy | 2 | skill | 2 actions | no card: a combat action no reader or hand plan covers yet |
| Encouraging Words | 2 | skill | 1 action | no card: a combat action no reader or hand plan covers yet |
| That's Not Natural! | 4 | skill | reaction | no card: a combat action no reader or hand plan covers yet |
| That Was a Close One, Huh? | 7 | skill | 1 action | no card: a combat action no reader or hand plan covers yet |

### PF2e's own Effect, from the feat's Use button (74)

| Feat | Lvl | Category | Type | Simulator |
|---|---:|---|---|---|
| Saoc Astrology | 1 | ancestry | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Mutate Weapon | 5 | ancestry | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Strix Vengeance | 5 | ancestry | reaction | no card: PF2e's own Effect, from the feat's Use button |
| Memory of Skill | 9 | ancestry | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Moisture Bath | 9 | ancestry | 1 action | rated -0.06 |
| Oni Rampage | 13 | ancestry | reaction | no card: PF2e's own Effect, from the feat's Use button |
| Benefactor's Majesty | 17 | ancestry | 1 action | rated -0.1 |
| Channel the Godmind | 17 | ancestry | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| Kishin Rage | 17 | ancestry | 1 action | rated -0.09 |
| Metallic Skin | 17 | ancestry | 2 actions | rated -0.25 |
| Reckless Abandon | 17 | ancestry | free | no card: PF2e's own Effect, from the feat's Use button |
| Anchor Stance | 4 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Golden Erinys Stance | 4 | archetype | 1 action | rated -0.16 |
| Harsh Judgement | 4 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Ghost Strike | 6 | archetype | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| Heaven's Thunder | 6 | archetype | 1 action | rated -0.01 |
| Rough Terrain Stance | 6 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| A Little Bird Told Me... | 8 | archetype | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| Invoke Defense | 8 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Soul Well | 8 | archetype | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| Unfazed Assessment | 8 | archetype | 1 action | rated 0.08 |
| Blade of the Heart | 10 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Null Field | 10 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Spear of Doom | 10 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Turn to Mist | 10 | archetype | 1 action | rated -0.07 |
| Hungry Blade | 12 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Six Pillars Stance | 12 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Shield the Faithful | 14 | archetype | 1 action | rated -0.1 |
| Worm Form | 14 | archetype | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| One with the Spirits | 16 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Ruthless Orator | 16 | archetype | 2 actions | no card: PF2e's own Effect, from the feat's Use button |
| Divine Presence | 18 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Guillotine Blade | 18 | archetype | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Channeler's Stance | 1 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Dragon Stance | 1 | class | 1 action | rated -0.04 |
| Everstand Stance | 1 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Extravagant Parry | 1 | class | 1 action | rated -0.04 |
| Flood Stance | 1 | class | 1 action | rated -0.04 |
| Gorilla Stance | 1 | class | 1 action | rated -0.04 |
| Mountain Stance | 1 | class | 1 action | rated -0.11 |
| Reflective Ripple Stance | 1 | class | 1 action | rated -0.04 |
| Rushing Goat Stance | 1 | class | 1 action | rated -0.04 |
| Twisting Petal Stance | 1 | class | 1 action | rated -0.04 |
| Bone Spikes | 2 | class | 1 action | rated -0.09 |
| Meddling Futures | 2 | class | free | no card: PF2e's own Effect, from the feat's Use button |
| Overclock Senses | 2 | class | free | rated 0 |
| Waterfowl Stance | 2 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Apparition's Enhancement | 4 | class | free | no card: PF2e's own Effect, from the feat's Use button |
| Exploding Bullet | 4 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Godspeed | 4 | class | 1 action | rated -0.01 |
| Masquerade of Seasons Stance | 4 | class | 1 action | error |
| Prayer-Touched Weapon | 4 | class | free | no card: PF2e's own Effect, from the feat's Use button |
| Psi Strikes | 4 | class | free | no card: PF2e's own Effect, from the feat's Use button |
| Diverting Vortex | 6 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Divine Weapon | 6 | class | free | rated 0 |
| Energy Ward | 6 | class | free | no card: PF2e's own Effect, from the feat's Use button |
| Smite | 6 | class | 1 action | rated 0.04 |
| Animalistic Brutality | 8 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Impassable Wall Stance | 8 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Kaiju Stance | 8 | class | 1 action | rated -0.02 |
| Mobile Shot Stance | 8 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Tangled Forest Stance | 8 | class | 1 action | rated 0.11 |
| Disruptive Stance | 10 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Fly on Shadowed Wings | 10 | class | 2 actions | rated -0.24 |
| Lunging Stance | 12 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Divine Invulnerability | 14 | class | 1 action | rated -0.14 |
| Immovable Object | 14 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Graceful Poise | 16 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Resounding Cascade | 16 | class | passive | rated 0 |
| Unified Stance | 16 | class | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Ectoplasmic Aura | 18 | class | 1 action | rated -0.02 |
| Vitality-Manipulating Stance | 20 | class | 1 action | rated 0.02 |
| Eye of the Arclords | 2 | skill | 1 action | no card: PF2e's own Effect, from the feat's Use button |
| Sacred Defense | 7 | skill | 1 action | no card: PF2e's own Effect, from the feat's Use button |

## The simulator's gaps among feats the feat module automates, feat by feat

(The feat module's gaps above are mostly the simulator's too; these are the ones the feat module plays and the simulator doesn't.)

### no card: the feat module's reminder, which a fight doesn't play (417)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Dwarven Doughtiness | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Elemental Embellish | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Everyday Form | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Leshy Superstition | 1 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Marsh Runner | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Polymorphic Escape | 1 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Pyrophilic Recovery | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Squawk! | 1 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Teakettle Form | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Vigorous Health | 1 | ancestry | passive | reminder | the feat module reads nothing for it |
| Willing Death | 1 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Ally's Shelter | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Among Humanity | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Azarketi Weapon Aptitude | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Bestial Brutality | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Bloody Blows | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Conductor's Redirection | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Conrasu Weapon Understanding | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Deflecting Jewel | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Garuda's Squall | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Genie Weapon Flourish | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Ghoran Weapon Practice | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Hunter's Fangs | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Hybrid Form | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Immobile Form | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Inspire Imitation | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Intuitive Illusions | 5 | ancestry | free | reminder | the feat module reads nothing for it |
| Noble Bloom | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Phantom Resemblance | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Powerful Guts | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Ragdya's Revelry | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Recognize Ambush | 5 | ancestry | free | reminder | the feat module reads nothing for it |
| Shed Tail | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Shifting Faces | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Snare Genius | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Statue Form | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Step Lively | 5 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Tenacious Jaws | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Tomb-Watcher's Glare | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Vanara Weapon Trickery | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Vishkanya Weapon Arts | 5 | ancestry | passive | reminder | the feat module reads nothing for it |
| Absorb Toxin | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Accursed Claws | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Breath Unleashed | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Ceremony of Fortification | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Consume Magic | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Embodied Dragoon Subjectivity | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Energy Blessed | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Evade Doom | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Extraplanar Cloud | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Fiend-Trampling Stature | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Fortified Mind | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Fox Arson | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Heir of the Saoc | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Kneel for No God | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Luck of the Clowder | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Many Faces | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Mother's Mindfulness | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Pride in Arms | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Roll with It | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Rolling White Bottle Form | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Skittering Scuttle | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Slip Into Shadow | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Telekinetic Slip | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Tetraelemental Assault | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Thorned Seedpod | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Undying Ferocity | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Unleash Yaoguai Might | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| Unyielding Disguise | 9 | ancestry | passive | reminder | the feat module reads nothing for it |
| You Seem Somewhat Familiar | 9 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Alter Resistance | 13 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Bonekeeper's Bane | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Bounce Back | 13 | ancestry | free | reminder | the feat module reads nothing for it |
| Clinging to Life | 13 | ancestry | free | reminder | the feat module reads nothing for it |
| Crafter's Instinct | 13 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Finest Trick | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Instinctive Obfuscation | 13 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Kashrishi Revivification | 13 | ancestry | free | reminder | the feat module reads nothing for it |
| Larger than Life | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Mist Strider | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Revivification Protocol | 13 | ancestry | free | reminder | the feat module reads nothing for it |
| Spell Devourer | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Stubborn Persistence | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Tempest Gaze | 13 | ancestry | passive | reminder | the feat module reads nothing for it |
| Awakened Stride | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| First to Strike, First to Fall | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| Landscape Form | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| Lingering Breath | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| Magic Rider | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| Planar Traveler | 17 | ancestry | free | reminder | the feat module reads nothing for it |
| See You in Hell | 17 | ancestry | reaction | reminder | the feat module reads nothing for it |
| Stonewall | 17 | ancestry | reaction | reminder | the feat module reads nothing for it |
| System Override | 17 | ancestry | passive | reminder | the feat module reads nothing for it |
| Acrobat Dedication | 2 | archetype | passive | reminder | the feat module reads nothing for it |
| Fan Dancer Dedication | 2 | archetype | passive | reminder | the feat module reads nothing for it |
| Agile Hand | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Aquatic Pirouette | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Barrier Shield | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Belay That! | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Contingency Leap | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Dread Blade | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Forceful Push | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Heaven's Step Offense | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Play to the Crowd | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Shining Arms | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Soul Flare | 4 | archetype | reaction | reminder | the feat module reads nothing for it |
| Summon Ensemble | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Tracing Sigil | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Tricksterbane Oath | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Versatile Mutation | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Wild Lights | 4 | archetype | passive | reminder | the feat module reads nothing for it |
| Animate Net | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Bestial Protection | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Confounding Image | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Cutting Heaven, Crushing Earth | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Disk Rider | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Drenching Mist | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Feeding Frenzy | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Multifaceted Will | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Obscured Terrain | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Palatine Enchantment | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Perfect Truths | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Propulsive Mutation | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Reactive Spellshift | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Rushing Boar | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Soul Bleed | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Sweeping Fan Block | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Symphony of Agony | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Uneasy Rest | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Urgent Upwelling | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Vacate Vision | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Volatile Grease | 6 | archetype | passive | reminder | the feat module reads nothing for it |
| Wisteria-and-Peony Reunion | 6 | archetype | free | reminder | the feat module reads nothing for it |
| Wounded Party | 6 | archetype | reaction | reminder | the feat module reads nothing for it |
| Accursed Touch | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Beacon Mark | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Challenge Insight | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Counter Curse | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Countercharm | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Guardian Ghosts | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Improved Command Corpse | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Larcenous Hand | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Lingering Flames | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Living for the Applause | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Magic Finder | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Reactive Resilience | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Scattered Fire | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Shoving Sweep | 8 | archetype | reaction | reminder | the feat module reads nothing for it |
| Siphoning Touch | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Slayer's Blessing | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Smoldering Explosion | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Steal Vitality | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Vantage Shot | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| World-Wise Vigilance | 8 | archetype | passive | reminder | the feat module reads nothing for it |
| Big Debut | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Bloom Cabaret Entrance | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Destructive Block | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Dispute Terms | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Everyone Duck! | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| Expand Spiral | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Fading | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| Ghostsong | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Know It All (Eldritch Researcher) | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Lasting Protection | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Preserve the Horde | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Reactive Charm | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| Reflexive Devotion | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Roadkill | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Secrets of Steel | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Slayer's Presence | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Slingshot Maneuver | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| Spiritual Flurry | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Spraying Mutation | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Spy's Countermeasures | 10 | archetype | free | reminder | the feat module reads nothing for it |
| Surrounding Flames | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Tempest-Sun Shielding | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| The Truth As I See It | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Toppling Tentacles | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Translocational Adept | 10 | archetype | passive | reminder | the feat module reads nothing for it |
| Ward Casting | 10 | archetype | reaction | reminder | the feat module reads nothing for it |
| Blessed Denial | 12 | archetype | reaction | reminder | the feat module reads nothing for it |
| Choking Smoke | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Directed Poison | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Infectious Emotions | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Interfering Surge | 12 | archetype | reaction | reminder | the feat module reads nothing for it |
| Janatimo's Lessons | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Know Thy Doom | 12 | archetype | reaction | reminder | the feat module reads nothing for it |
| Shoulder Catastrophe | 12 | archetype | reaction | reminder | the feat module reads nothing for it |
| Smooth Hover | 12 | archetype | free | reminder | the feat module reads nothing for it |
| Space-Time Shift | 12 | archetype | free | reminder | the feat module reads nothing for it |
| Sympathetic Portrayal | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Thorn in Hell's Side | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Undying Beast | 12 | archetype | passive | reminder | the feat module reads nothing for it |
| Wailing Dead | 12 | archetype | 2 actions | card | the feat module reads nothing for it |
| Aldori's Retort | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Death Rattle | 14 | archetype | 1 action | card | the feat module reads nothing for it |
| Effortless Captivation | 14 | archetype | free | reminder | the feat module reads nothing for it |
| Guided Hover | 14 | archetype | reaction | reminder | the feat module reads nothing for it |
| Improved Hijack Undead | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Lesson of the Hurricane's Might | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Mist Escape | 14 | archetype | free | reminder | the feat module reads nothing for it |
| Rapid Hybridization | 14 | archetype | free | reminder | the feat module reads nothing for it |
| Shattered Sacrament | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Shifting Terrain | 14 | archetype | 1 action | card | the feat module reads nothing for it |
| Submit to Shadow | 14 | archetype | free | card | the feat module reads nothing for it |
| Terrible Transformation | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Unlimited Ghost Flight | 14 | archetype | passive | reminder | the feat module reads nothing for it |
| Aura Expertise | 16 | archetype | free | reminder | the feat module reads nothing for it |
| Deflecting Cloud | 16 | archetype | reaction | reminder | the feat module reads nothing for it |
| Master's Counterspell | 16 | archetype | reaction | reminder | the feat module reads nothing for it |
| Officer's Protection | 16 | archetype | passive | reminder | the feat module reads nothing for it |
| Stunning Appearance | 16 | archetype | passive | reminder | the feat module reads nothing for it |
| Flash of Omniscience | 18 | archetype | free | reminder | the feat module reads nothing for it |
| I Knew the Heroes | 18 | archetype | passive | reminder | the feat module reads nothing for it |
| Repelling Enforcer | 18 | archetype | passive | reminder | the feat module reads nothing for it |
| Stand for the Fallen | 18 | archetype | reaction | reminder | the feat module reads nothing for it |
| Stave off Catastrophe | 18 | archetype | passive | reminder | the feat module reads nothing for it |
| Tripartite Omen | 18 | archetype | passive | reminder | the feat module reads nothing for it |
| Aldori Swordlord | 20 | archetype | passive | reminder | the feat module reads nothing for it |
| Flash of Omnipotence | 20 | archetype | free | reminder | the feat module reads nothing for it |
| Vigil's Palisades | 20 | archetype | passive | reminder | the feat module reads nothing for it |
| Trailblazing Stride | 0 | bonus | passive | reminder | the feat module reads nothing for it |
| Air Cushion | 1 | class | reaction | kineticist module | the feat module reads nothing for it |
| Bestiary Secrets | 1 | class | passive | reminder | the feat module reads nothing for it |
| Brilliant Flash | 1 | class | passive | reminder | the feat module reads nothing for it |
| Counter Thought | 1 | class | reaction | reminder | the feat module reads nothing for it |
| Counterspell (Prepared) | 1 | class | reaction | reminder | the feat module reads nothing for it |
| Counterspell (Spontaneous) | 1 | class | reaction | reminder | the feat module reads nothing for it |
| Desperate Prayer | 1 | class | free | reminder | the feat module reads nothing for it |
| Divine Castigation | 1 | class | passive | reminder | the feat module reads nothing for it |
| Elegant Buckler | 1 | class | passive | reminder | the feat module reads nothing for it |
| Eternal Torch | 1 | class | 1 action | kineticist module | the feat module reads nothing for it |
| Focused Fascination | 1 | class | passive | reminder | the feat module reads nothing for it |
| Fresh Produce | 1 | class | 1 action | kineticist module | the feat module reads nothing for it |
| Harming Hands | 1 | class | passive | reminder | the feat module reads nothing for it |
| Healing Hands | 1 | class | passive | reminder | the feat module reads nothing for it |
| Known Weaknesses | 1 | class | passive | reminder | the feat module reads nothing for it |
| Long-Distance Taunt | 1 | class | passive | reminder | the feat module reads nothing for it |
| Relinquish Control | 1 | class | free | reminder | the feat module reads nothing for it |
| Defensive Swap | 2 | class | reaction | reminder | the feat module reads nothing for it |
| Directed Audience | 2 | class | passive | reminder | the feat module reads nothing for it |
| Elemental Evolution | 2 | class | passive | reminder | the feat module reads nothing for it |
| Elemental Fist | 2 | class | passive | reminder | the feat module reads nothing for it |
| Fake Out | 2 | class | reaction | reminder | the feat module reads nothing for it |
| Invert Harm | 2 | class | passive | reminder | the feat module reads nothing for it |
| Rapid Response | 2 | class | reaction | reminder | the feat module reads nothing for it |
| Sap Life | 2 | class | passive | reminder | the feat module reads nothing for it |
| Second Wind | 2 | class | passive | reminder | the feat module reads nothing for it |
| Born to the Trees | 4 | class | 2 actions | kineticist module | the feat module reads nothing for it |
| Chemical Purification | 4 | class | free | reminder | the feat module reads nothing for it |
| Favored Prey | 4 | class | passive | reminder | the feat module reads nothing for it |
| Igneogenesis | 4 | class | 2 actions | kineticist module | the feat module reads nothing for it |
| Instant Backup | 4 | class | reaction | reminder | the feat module reads nothing for it |
| Observational Analysis | 4 | class | passive | reminder | the feat module reads nothing for it |
| Portents of the Haruspex | 4 | class | reaction | reminder | the feat module reads nothing for it |
| Prescience | 4 | class | free | reminder | the feat module reads nothing for it |
| Shielded Recovery | 4 | class | passive | reminder | the feat module reads nothing for it |
| Additional Recollection | 6 | class | free | reminder | the feat module reads nothing for it |
| Artokus's Fire | 6 | class | free | reminder | the feat module reads nothing for it |
| Assured Knowledge | 6 | class | passive | reminder | the feat module reads nothing for it |
| Counter Element | 6 | class | reaction | kineticist module | the feat module reads nothing for it |
| Divert Destiny | 6 | class | free | reminder | the feat module reads nothing for it |
| Energetic Resonance | 6 | class | reaction | reminder | the feat module reads nothing for it |
| Fearsome Familiar | 6 | class | 3 actions | kineticist module | the feat module reads nothing for it |
| Instinctive Support | 6 | class | free | reminder | the feat module reads nothing for it |
| Jagged Berms | 6 | class | 3 actions | kineticist module | the feat module reads nothing for it |
| Magic Hands | 6 | class | passive | reminder | the feat module reads nothing for it |
| Mythic Counterspell | 6 | class | reaction | reminder | the feat module reads nothing for it |
| Read the Dust | 6 | class | reaction | reminder | the feat module reads nothing for it |
| Shrink Spell | 6 | class | passive | reminder | the feat module reads nothing for it |
| Spell Relay | 6 | class | reaction | reminder | the feat module reads nothing for it |
| Strain Mind | 6 | class | free | reminder | the feat module reads nothing for it |
| Stumbling Feint | 6 | class | passive | reminder | the feat module reads nothing for it |
| Thorough Research | 6 | class | passive | reminder | the feat module reads nothing for it |
| Accompany | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Arc of Destruction | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Boost Summons | 8 | class | passive | reminder | the feat module reads nothing for it |
| Clue Them All In | 8 | class | passive | reminder | the feat module reads nothing for it |
| Crosscurrent Counter | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Cyclonic Ascent | 8 | class | 2 actions | kineticist module | the feat module reads nothing for it |
| Defensive Stratagem | 8 | class | passive | reminder | the feat module reads nothing for it |
| Emblazon Energy | 8 | class | passive | reminder | the feat module reads nothing for it |
| Greater Cruelty | 8 | class | passive | reminder | the feat module reads nothing for it |
| Greenwatch Veteran | 8 | class | free | reminder | the feat module reads nothing for it |
| Heal Mount | 8 | class | passive | reminder | the feat module reads nothing for it |
| Know-It-All | 8 | class | passive | reminder | the feat module reads nothing for it |
| Leap and Fire | 8 | class | passive | reminder | the feat module reads nothing for it |
| Pinning Fire | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Pinpoint Poisoner | 8 | class | passive | reminder | the feat module reads nothing for it |
| Poison Drinker | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Purify Element | 8 | class | 2 actions | kineticist module | the feat module reads nothing for it |
| Repositioning Block | 8 | class | free | reminder | the feat module reads nothing for it |
| Retaliatory Cleansing | 8 | class | reaction | reminder | the feat module reads nothing for it |
| Unrivaled Analysis | 8 | class | passive | reminder | the feat module reads nothing for it |
| Deny Support | 10 | class | passive | reminder | the feat module reads nothing for it |
| Devoted Focus | 10 | class | passive | reminder | the feat module reads nothing for it |
| Dimensional Disappearance | 10 | class | passive | reminder | the feat module reads nothing for it |
| Get Behind Me! | 10 | class | passive | reminder | the feat module reads nothing for it |
| Greater Debilitating Bomb | 10 | class | passive | reminder | the feat module reads nothing for it |
| Improved Command Undead | 10 | class | passive | reminder | the feat module reads nothing for it |
| Mirror Shield | 10 | class | reaction | reminder | the feat module reads nothing for it |
| Overpowering Charge | 10 | class | passive | reminder | the feat module reads nothing for it |
| Reflexive Riposte | 10 | class | passive | reminder | the feat module reads nothing for it |
| Shared Avoidance | 10 | class | passive | reminder | the feat module reads nothing for it |
| Switcheroo | 10 | class | reaction | reminder | the feat module reads nothing for it |
| Amp Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Blood Component Substitution | 12 | class | passive | reminder | the feat module reads nothing for it |
| Bloodline Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Chorus Companion | 12 | class | passive | reminder | the feat module reads nothing for it |
| Clever Counterspell | 12 | class | passive | reminder | the feat module reads nothing for it |
| Conflux Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Coven Spell | 12 | class | reaction | reminder | the feat module reads nothing for it |
| Defensive Dismissal | 12 | class | reaction | reminder | the feat module reads nothing for it |
| Domain Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Double Prey | 12 | class | passive | reminder | the feat module reads nothing for it |
| Effortless Impulse | 12 | class | free | reminder | the feat module reads nothing for it |
| Emblazon Antimagic | 12 | class | passive | reminder | the feat module reads nothing for it |
| Endless Return | 12 | class | passive | reminder | the feat module reads nothing for it |
| Flinging Shove | 12 | class | passive | reminder | the feat module reads nothing for it |
| Fortunate Relief | 12 | class | passive | reminder | the feat module reads nothing for it |
| Grave Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Hex Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Inspirational Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Lasting Doubt | 12 | class | passive | reminder | the feat module reads nothing for it |
| Link Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Magic Sense | 12 | class | passive | reminder | the feat module reads nothing for it |
| Meditative Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Perfected Evaluations | 12 | class | passive | reminder | the feat module reads nothing for it |
| Primal Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Rapid Spark | 12 | class | free | reminder | the feat module reads nothing for it |
| Reflexive Stance | 12 | class | free | reminder | the feat module reads nothing for it |
| Roll with it (Kingmaker) | 12 | class | reaction | reminder | the feat module reads nothing for it |
| Summoner's Call | 12 | class | reaction | reminder | the feat module reads nothing for it |
| Warden's Focus | 12 | class | passive | reminder | the feat module reads nothing for it |
| Bonded Focus | 14 | class | passive | reminder | the feat module reads nothing for it |
| Burning Surge | 14 | class | reaction | reminder | the feat module reads nothing for it |
| Channeling Block | 14 | class | passive | reminder | the feat module reads nothing for it |
| Cleansing Transformation | 14 | class | passive | reminder | the feat module reads nothing for it |
| Contact With the Enemy | 14 | class | passive | reminder | the feat module reads nothing for it |
| Deep Roots | 14 | class | passive | reminder | the feat module reads nothing for it |
| Esoteric Reflexes | 14 | class | passive | reminder | the feat module reads nothing for it |
| Fast Channel | 14 | class | passive | reminder | the feat module reads nothing for it |
| Greater Interpose | 14 | class | passive | reminder | the feat module reads nothing for it |
| Greater Merciful Elixir | 14 | class | passive | reminder | the feat module reads nothing for it |
| Guiding Retort | 14 | class | passive | reminder | the feat module reads nothing for it |
| Guiding Riposte | 14 | class | passive | reminder | the feat module reads nothing for it |
| Impossible Riposte | 14 | class | passive | reminder | the feat module reads nothing for it |
| Instinctual Creation | 14 | class | free | reminder | the feat module reads nothing for it |
| Revelation's Focus | 14 | class | passive | reminder | the feat module reads nothing for it |
| Shared Prey | 14 | class | passive | reminder | the feat module reads nothing for it |
| Shining Runes | 14 | class | passive | reminder | the feat module reads nothing for it |
| Spell Network | 14 | class | free | reminder | the feat module reads nothing for it |
| To Thine Own Self | 14 | class | reaction | reminder | the feat module reads nothing for it |
| Triumphant Inspiration | 14 | class | free | reminder | the feat module reads nothing for it |
| True Debilitating Bomb | 14 | class | passive | reminder | the feat module reads nothing for it |
| Unstable Redundancies | 14 | class | free | reminder | the feat module reads nothing for it |
| Abjure Harm | 16 | class | reaction | reminder | the feat module reads nothing for it |
| Cloud Step | 16 | class | passive | reminder | the feat module reads nothing for it |
| Deadly Grace | 16 | class | passive | reminder | the feat module reads nothing for it |
| Echoing Fury | 16 | class | passive | reminder | the feat module reads nothing for it |
| Effortless Concentration | 16 | class | free | reminder | the feat module reads nothing for it |
| Electric Counter | 16 | class | reaction | reminder | the feat module reads nothing for it |
| Improved Reflexive Shield | 16 | class | passive | reminder | the feat module reads nothing for it |
| Improved Twin Riposte (Ranger) | 16 | class | passive | reminder | the feat module reads nothing for it |
| Lose Your Chains | 16 | class | reaction | reminder | the feat module reads nothing for it |
| Master of Many Styles | 16 | class | free | reminder | the feat module reads nothing for it |
| Rebounding Smite | 16 | class | reaction | reminder | the feat module reads nothing for it |
| Seven-Part Link | 16 | class | passive | reminder | the feat module reads nothing for it |
| Steal Death | 16 | class | reaction | reminder | the feat module reads nothing for it |
| Steal Spell | 16 | class | passive | reminder | the feat module reads nothing for it |
| Swift Elusion | 16 | class | reaction | reminder | the feat module reads nothing for it |
| All in My Head | 18 | class | reaction | reminder | the feat module reads nothing for it |
| All in Your Head | 18 | class | reaction | reminder | the feat module reads nothing for it |
| Deduce Habits | 18 | class | passive | reminder | the feat module reads nothing for it |
| Incredible Luck (Swashbuckler) | 18 | class | passive | reminder | the feat module reads nothing for it |
| Manifold Edge | 18 | class | passive | reminder | the feat module reads nothing for it |
| Masterful Companion | 18 | class | passive | reminder | the feat module reads nothing for it |
| Perfect Debilitation | 18 | class | passive | reminder | the feat module reads nothing for it |
| Perfect Form Control | 18 | class | passive | reminder | the feat module reads nothing for it |
| Reach for the Stars | 18 | class | passive | reminder | the feat module reads nothing for it |
| Shared Clarity | 18 | class | passive | reminder | the feat module reads nothing for it |
| Stolen Spell | 18 | class | free | reminder | the feat module reads nothing for it |
| Swift River | 18 | class | free | reminder | the feat module reads nothing for it |
| Ultimate Mercy | 18 | class | passive | reminder | the feat module reads nothing for it |
| Avatar's Protection | 20 | class | reaction | reminder | the feat module reads nothing for it |
| Fight Through Oblivion | 20 | class | passive | reminder | the feat module reads nothing for it |
| Mimic Protections | 20 | class | passive | reminder | the feat module reads nothing for it |
| Reactive Distraction | 20 | class | reaction | reminder | the feat module reads nothing for it |
| Reflecting Riposte | 20 | class | reaction | reminder | the feat module reads nothing for it |
| Scapegoat Parallel Self | 20 | class | reaction | reminder | the feat module reads nothing for it |
| Surging Interference | 20 | class | reaction | reminder | the feat module reads nothing for it |
| To the Ends of the Earth | 20 | class | passive | reminder | the feat module reads nothing for it |
| Triple Threat | 20 | class | passive | reminder | the feat module reads nothing for it |
| Ubiquitous Overdrive | 20 | class | passive | reminder | the feat module reads nothing for it |
| Ubiquitous Weakness | 20 | class | passive | reminder | the feat module reads nothing for it |
| Verdant Presence | 20 | class | reaction | reminder | the feat module reads nothing for it |
| Dubious Knowledge | 1 | skill | passive | reminder | the feat module reads nothing for it |
| Experienced Professional | 1 | skill | passive | reminder | the feat module reads nothing for it |
| Recognize Spell | 1 | skill | reaction | reminder | the feat module reads nothing for it |
| Continual Recovery | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Energy Fortification | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Malleable Movement | 2 | skill | free | reminder | the feat module reads nothing for it |
| Performer's Treatment | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Robust Recovery | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Underground Network | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Unmistakable Lore | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Ward Medic | 2 | skill | passive | reminder | the feat module reads nothing for it |
| Ivy District Influencer | 3 | skill | passive | reminder | the feat module reads nothing for it |
| Canopy Predator | 4 | skill | passive | reminder | the feat module reads nothing for it |
| Cushion Landing | 4 | skill | reaction | reminder | the feat module reads nothing for it |
| Diabolic Certitude | 4 | skill | free | reminder | the feat module reads nothing for it |
| Rope Runner | 4 | skill | passive | reminder | the feat module reads nothing for it |
| Cutting Flattery | 5 | skill | passive | reminder | the feat module reads nothing for it |
| Emerald Boughs Accustomation | 6 | skill | passive | reminder | the feat module reads nothing for it |
| Advanced First Aid | 7 | skill | passive | reminder | the feat module reads nothing for it |
| Foil Senses | 7 | skill | passive | reminder | the feat module reads nothing for it |
| Temperature Adjustment | 7 | skill | passive | reminder | the feat module reads nothing for it |

### no card: the feat module's hand-written handling (a script, rule batch or list), which a fight doesn't play (167)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Ambersoul | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Avowed Insight | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Bamboo and Silt Repose | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Cynical | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Improvisational Defender | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Know Oneself | 1 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Quick Shape | 1 | ancestry | free | by hand | the feat module reads nothing for it |
| Steady on Stone | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Theoretical Acumen | 1 | ancestry | free | by hand | the feat module reads nothing for it |
| Vestigial Magicsense | 1 | ancestry | passive | by hand | the feat module reads nothing for it |
| Alarming Disappearance | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Blessed Blood (Nephilim) | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Climate Adaptation | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Cloud Gazer | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Darting Monkey | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Defensive Needles | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Elven Persistence | 5 | ancestry | free | by hand | the feat module reads nothing for it |
| Feed on Pain | 5 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Fishblooded | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Hasty Celebration | 5 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Healing Flesh | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Jungle Runner | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Natural Ambassador | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Reflective Pocket | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Reincarnated Ridiculer | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Skilled Swimmer | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Thousand-Year Grudge | 5 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Tikling Bird Twirl | 5 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Tip the Scales | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Torch Goblin | 5 | ancestry | 1 action | by hand | the feat module reads nothing for it |
| Tree Climber (Goblin) | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Undead Companion | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Unrelenting Terror | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Vulpine Scamper | 5 | ancestry | passive | by hand | the feat module reads nothing for it |
| Demolitionist | 9 | ancestry | passive | by hand | the feat module reads nothing for it |
| Fell Rider | 9 | ancestry | passive | by hand | the feat module reads nothing for it |
| Riptide | 9 | ancestry | reaction | by hand | the feat module reads nothing for it |
| Terrain Advantage | 9 | ancestry | passive | by hand | the feat module reads nothing for it |
| Water Dancer | 9 | ancestry | passive | by hand | the feat module reads nothing for it |
| Attuned Electroreceptors | 13 | ancestry | passive | by hand | the feat module reads nothing for it |
| Cobble Dancer | 13 | ancestry | passive | by hand | the feat module reads nothing for it |
| Crush Their Spirits | 13 | ancestry | passive | by hand | the feat module reads nothing for it |
| Elucidation | 13 | ancestry | free | by hand | the feat module reads nothing for it |
| Legendary Laugh | 17 | ancestry | passive | by hand | the feat module reads nothing for it |
| Chronoskimmer Dedication | 2 | archetype | passive | by hand | the feat module reads nothing for it |
| Nidalese Horselord Dedication | 2 | archetype | passive | by hand | the feat module reads nothing for it |
| Rose Warden Dedication | 2 | archetype | passive | by hand | the feat module reads nothing for it |
| Angel of Vindication | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Ankle Biter | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Eye for Weakness | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Improvised Pummel | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Nonlethal Takedown | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Posse | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Rebel's Map | 4 | archetype | free | by hand | the feat module reads nothing for it |
| Rescuer's Press | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Stage Fighting | 4 | archetype | passive | by hand | the feat module reads nothing for it |
| Tut-Tut | 4 | archetype | free | by hand | the feat module reads nothing for it |
| Watch and Learn | 4 | archetype | reaction | by hand | the feat module reads nothing for it |
| Aquatic Passage | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Axe Thrower | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Butterfly's Kiss | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Concealing Currents | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Crushing Step | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Frightful Condemnation | 6 | archetype | free | by hand | the feat module reads nothing for it |
| Leverage Anguish | 6 | archetype | reaction | by hand | the feat module reads nothing for it |
| Rapid Manifestation | 6 | archetype | free | by hand | the feat module reads nothing for it |
| Repeat Lesson | 6 | archetype | reaction | by hand | the feat module reads nothing for it |
| Snow Step | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Surprise Strike | 6 | archetype | passive | by hand | the feat module reads nothing for it |
| Swift Guardian | 6 | archetype | free | by hand | the feat module reads nothing for it |
| Unnerving Prowess | 6 | archetype | free | by hand | the feat module reads nothing for it |
| Hell's Bane | 8 | archetype | passive | by hand | the feat module reads nothing for it |
| Hot Foot | 8 | archetype | 1 action | by hand | the feat module reads nothing for it |
| Necromantic Bulwark | 8 | archetype | passive | by hand | the feat module reads nothing for it |
| Show-Off | 8 | archetype | free | by hand | the feat module reads nothing for it |
| Sickening Bite | 8 | archetype | passive | by hand | the feat module reads nothing for it |
| Emphatic Emissary | 10 | archetype | reaction | by hand | the feat module reads nothing for it |
| Menacing Prowess | 10 | archetype | passive | by hand | the feat module reads nothing for it |
| Widen the Gap | 10 | archetype | passive | by hand | the feat module reads nothing for it |
| Wing Rider | 10 | archetype | passive | by hand | the feat module reads nothing for it |
| Billowing Wings | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Combat Premonition | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Empowered Onslaught | 12 | archetype | reaction | by hand | the feat module reads nothing for it |
| Evasiveness | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Expert Combat Eidolon | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Gigantic Megafauna Companion | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Packed with Flavor | 12 | archetype | passive | by hand | the feat module reads nothing for it |
| Absorb Spell | 14 | archetype | reaction | by hand | the feat module reads nothing for it |
| Precise Hooks | 14 | archetype | passive | by hand | the feat module reads nothing for it |
| Winter's Kiss | 14 | archetype | passive | by hand | the feat module reads nothing for it |
| Focus Ally | 16 | archetype | reaction | by hand | the feat module reads nothing for it |
| Greater Snow Step | 16 | archetype | passive | by hand | the feat module reads nothing for it |
| Lead the Pack | 16 | archetype | passive | by hand | the feat module reads nothing for it |
| Tower Shield Mastery | 20 | archetype | passive | by hand | the feat module reads nothing for it |
| Expanded Senses | 1 | class | passive | by hand | the feat module reads nothing for it |
| Monster Hunter | 1 | class | passive | by hand | the feat module reads nothing for it |
| Shore Step | 1 | class | passive | by hand | the feat module reads nothing for it |
| Steadying Stone | 1 | class | passive | by hand | the feat module reads nothing for it |
| Storm Born | 1 | class | passive | by hand | the feat module reads nothing for it |
| Adaptive Stratagem | 2 | class | free | by hand | the feat module reads nothing for it |
| Amphibious Form | 2 | class | passive | by hand | the feat module reads nothing for it |
| Ears That Hear the Truth | 2 | class | passive | by hand | the feat module reads nothing for it |
| Rapid Assessment | 2 | class | free | by hand | the feat module reads nothing for it |
| Spirit Sheath | 2 | class | passive | by hand | the feat module reads nothing for it |
| Battle Assessment | 4 | class | 1 action | by hand | the feat module reads nothing for it |
| Combat Reading | 4 | class | 1 action | by hand | the feat module reads nothing for it |
| Forest Passage | 4 | class | passive | by hand | the feat module reads nothing for it |
| Giant Hunter | 4 | class | passive | by hand | the feat module reads nothing for it |
| Read the Wind | 4 | class | passive | by hand | the feat module reads nothing for it |
| Scalpel's Point | 4 | class | passive | by hand | the feat module reads nothing for it |
| Starlit Eyes | 4 | class | passive | by hand | the feat module reads nothing for it |
| Strategic Assessment | 4 | class | passive | by hand | the feat module reads nothing for it |
| Vibration Sense | 4 | class | passive | by hand | the feat module reads nothing for it |
| Agile Maneuvers | 6 | class | passive | by hand | the feat module reads nothing for it |
| Chiardmar Steed | 6 | class | passive | by hand | the feat module reads nothing for it |
| Knowledge is Power | 6 | class | passive | by hand | the feat module reads nothing for it |
| Light Step | 6 | class | passive | by hand | the feat module reads nothing for it |
| Sly Disarm | 6 | class | passive | by hand | the feat module reads nothing for it |
| Spell Retaliation | 6 | class | free | by hand | the feat module reads nothing for it |
| Ears of the Forest | 8 | class | passive | by hand | the feat module reads nothing for it |
| Instinctive Strike | 8 | class | passive | by hand | the feat module reads nothing for it |
| Knowledge is Power (Wizard) | 8 | class | passive | by hand | the feat module reads nothing for it |
| Murksight | 8 | class | passive | by hand | the feat module reads nothing for it |
| Spirit Walk | 8 | class | passive | by hand | the feat module reads nothing for it |
| Windborne Shove | 8 | class | passive | by hand | the feat module reads nothing for it |
| Burrowing Form | 10 | class | passive | by hand | the feat module reads nothing for it |
| Lingering Bomb | 10 | class | passive | by hand | the feat module reads nothing for it |
| Nimble Form | 10 | class | passive | by hand | the feat module reads nothing for it |
| Redirecting Shot | 10 | class | reaction | by hand | the feat module reads nothing for it |
| Airborne Form | 12 | class | passive | by hand | the feat module reads nothing for it |
| Balm Bomb | 12 | class | passive | by hand | the feat module reads nothing for it |
| Improved Knockback | 12 | class | passive | by hand | the feat module reads nothing for it |
| Pesh Skin | 12 | class | 1 action | by hand | the feat module reads nothing for it |
| Wandering Oasis | 12 | class | passive | by hand | the feat module reads nothing for it |
| Explosive Maneuver | 14 | class | 1 action | by hand | the feat module reads nothing for it |
| Internal Dialogue | 14 | class | reaction | by hand | the feat module reads nothing for it |
| Opening Stance | 14 | class | free | by hand | the feat module reads nothing for it |
| Sense the Unseen | 14 | class | reaction | by hand | the feat module reads nothing for it |
| Swift Banishment | 14 | class | reaction | by hand | the feat module reads nothing for it |
| Night Terror | 16 | class | passive | by hand | the feat module reads nothing for it |
| Vigorous Victor | 16 | class | passive | by hand | the feat module reads nothing for it |
| Mythic Weapon Specialization | 18 | class | passive | by hand | the feat module reads nothing for it |
| Powerful Sneak | 18 | class | passive | by hand | the feat module reads nothing for it |
| Extradimensional Stash | 20 | class | passive | by hand | the feat module reads nothing for it |
| Ultimate Skirmisher | 20 | class | passive | by hand | the feat module reads nothing for it |
| Ride | 1 | general | passive | by hand | the feat module reads nothing for it |
| Cat Fall | 1 | skill | passive | by hand | the feat module reads nothing for it |
| Concealing Legerdemain | 1 | skill | passive | by hand | the feat module reads nothing for it |
| Fascinating Performance | 1 | skill | passive | by hand | the feat module reads nothing for it |
| Medical Researcher | 1 | skill | passive | by hand | the feat module reads nothing for it |
| Subtle Theft | 1 | skill | passive | by hand | the feat module reads nothing for it |
| Predict Weather | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Rapid Mantel | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Slippery Prey | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Tattoo Artist | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Triumphant Boast | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Tumbling Teamwork | 2 | skill | passive | by hand | the feat module reads nothing for it |
| Predispose Settlement | 4 | skill | passive | by hand | the feat module reads nothing for it |
| Reverse Engineering | 4 | skill | passive | by hand | the feat module reads nothing for it |
| Twirl Through | 4 | skill | passive | by hand | the feat module reads nothing for it |
| Bless Tonic | 7 | skill | passive | by hand | the feat module reads nothing for it |
| Bless Toxin | 7 | skill | passive | by hand | the feat module reads nothing for it |
| Paragon Battle Medicine | 7 | skill | passive | by hand | the feat module reads nothing for it |
| Signature Crafting | 7 | skill | passive | by hand | the feat module reads nothing for it |
| Calm and Centered | 8 | skill | passive | by hand | the feat module reads nothing for it |
| Cloud Jump | 15 | skill | passive | by hand | the feat module reads nothing for it |
| Legendary Survivalist | 15 | skill | passive | by hand | the feat module reads nothing for it |

### a timer with no rules a fight counts (101)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Eclectic Obsession | 5 | ancestry | 1 action | card | a timer with no rules a fight counts |
| Extinguish Light | 5 | ancestry | 2 actions | card | a timer with no rules a fight counts |
| Glorious Gamtu | 5 | ancestry | 1 action | card | a timer with no rules a fight counts |
| Bodily Disintegration | 9 | ancestry | 2 actions | card | a timer with no rules a fight counts |
| Charred Remains | 9 | ancestry | free | card | a timer with no rules a fight counts |
| Goblin Club | 9 | ancestry | 1 action | card | a timer with no rules a fight counts |
| Grow Tool | 9 | ancestry | 3 actions | card | a timer with no rules a fight counts |
| Miraculous Repair | 9 | ancestry | 3 actions | card | a timer with no rules a fight counts |
| Mirror Refuge | 9 | ancestry | 2 actions | card | a timer with no rules a fight counts |
| Ride On | 9 | ancestry | reaction | card | a timer with no rules a fight counts |
| Sculpt Shadows | 9 | ancestry | 3 actions | card | a timer with no rules a fight counts |
| Cloak of Poison | 13 | ancestry | 2 actions | card | a timer with no rules a fight counts |
| Core Rejuvenation | 13 | ancestry | free | card | a timer with no rules a fight counts |
| Dalang's Ally | 13 | ancestry | 1 action | card | a timer with no rules a fight counts |
| Look but Don't Touch | 13 | ancestry | 2 actions | card | a timer with no rules a fight counts |
| Magitaxis | 13 | ancestry | reaction | card | a timer with no rules a fight counts |
| Umbra Ally | 13 | ancestry | 1 action | card | a timer with no rules a fight counts |
| Bless Shield | 4 | archetype | 1 action | card | a timer with no rules a fight counts |
| Focused Juggler | 4 | archetype | free | card | a timer with no rules a fight counts |
| Ghost Blade | 4 | archetype | 1 action | card | a timer with no rules a fight counts |
| Harrow Casting | 4 | archetype | 1 action | card | a timer with no rules a fight counts |
| Nature's Embrace | 4 | archetype | 1 action | card | a timer with no rules a fight counts |
| Never Tire | 4 | archetype | reaction | card | a timer with no rules a fight counts |
| Repel Darkness | 4 | archetype | 2 actions | card | a timer with no rules a fight counts |
| Sheltering Hand | 6 | archetype | 1 action | card | a timer with no rules a fight counts |
| Verduran Ambush | 6 | archetype | 3 actions | card | a timer with no rules a fight counts |
| Dualistic Synergy | 8 | archetype | 1 action | card | a timer with no rules a fight counts |
| Ghost Flight | 8 | archetype | 2 actions | card | a timer with no rules a fight counts |
| Superimpose Time Duplicates | 8 | archetype | 1 action | card | a timer with no rules a fight counts |
| A Hush Falls Over the World | 10 | archetype | 1 action | card | a timer with no rules a fight counts |
| Command Attention | 10 | archetype | 1 action | card | a timer with no rules a fight counts |
| Klingegeist | 10 | archetype | 2 actions | card | a timer with no rules a fight counts |
| Open the Blazing Eye | 10 | archetype | 2 actions | card | a timer with no rules a fight counts |
| Rockslide Spell | 10 | archetype | 1 action | card | a timer with no rules a fight counts |
| Seal of the Golden Dragon | 10 | archetype | reaction | card | a timer with no rules a fight counts |
| Afterimage | 12 | archetype | free | card | a timer with no rules a fight counts |
| Beguiling Aura | 12 | archetype | 1 action | card | a timer with no rules a fight counts |
| Escape Timeline | 12 | archetype | free | card | a timer with no rules a fight counts |
| Shared Tide | 12 | archetype | 2 actions | card | a timer with no rules a fight counts |
| Spellmaster's Tenacity | 14 | archetype | reaction | card | a timer with no rules a fight counts |
| Unfetter Sight | 14 | archetype | 1 action | card | a timer with no rules a fight counts |
| Infiltrator's Blitz | 16 | archetype | 3 actions | card | a timer with no rules a fight counts |
| Ward Mind | 16 | archetype | reaction | card | a timer with no rules a fight counts |
| Seek Injustice | 0 | bonus | 3 actions | card | a timer with no rules a fight counts |
| Blood Rising | 1 | class | reaction | card | a timer with no rules a fight counts |
| Burning Jet | 1 | class | 2 actions | card | a timer with no rules a fight counts |
| Flashforge | 1 | class | 2 actions | card | a timer with no rules a fight counts |
| Stepping Stones | 1 | class | 2 actions | card | a timer with no rules a fight counts |
| Anoint Ally | 2 | class | 1 action | card | a timer with no rules a fight counts |
| Elemental Defense | 2 | class | 1 action | card | a timer with no rules a fight counts |
| Ambush Bladderwort | 4 | class | 3 actions | card | a timer with no rules a fight counts |
| Distant Waterbird's Poise | 4 | class | reaction | card | a timer with no rules a fight counts |
| Living Bonfire | 4 | class | 2 actions | card | a timer with no rules a fight counts |
| Shielded Attrition | 4 | class | 1 action | card | a timer with no rules a fight counts |
| Snowdrift Spell | 4 | class | 1 action | card | a timer with no rules a fight counts |
| Thousand Visions | 4 | class | free | card | a timer with no rules a fight counts |
| Corrupted Ground | 6 | class | 1 action | card | a timer with no rules a fight counts |
| Crawling Fire | 6 | class | 2 actions | card | a timer with no rules a fight counts |
| Expand Aura | 6 | class | 1 action | card | a timer with no rules a fight counts |
| Hallowed Earth | 6 | class | 1 action | card | a timer with no rules a fight counts |
| Sand Snatcher | 6 | class | 2 actions | card | a timer with no rules a fight counts |
| Tree of Duality | 6 | class | 3 actions | card | a timer with no rules a fight counts |
| Wooden Palisade | 6 | class | 3 actions | card | a timer with no rules a fight counts |
| Apparition's Reflection | 8 | class | 1 action | card | a timer with no rules a fight counts |
| Capture Magic | 8 | class | reaction | card | a timer with no rules a fight counts |
| Elemental Revision | 8 | class | 1 action | card | a timer with no rules a fight counts |
| Swim Through Earth | 8 | class | 2 actions | card | a timer with no rules a fight counts |
| Eerie Proclamation | 10 | class | 2 actions | card | a timer with no rules a fight counts |
| Maelstrom Flow | 10 | class | 1 action | card | a timer with no rules a fight counts |
| Shared Focus | 10 | class | 1 action | card | a timer with no rules a fight counts |
| Architect of Flame | 12 | class | 3 actions | card | a timer with no rules a fight counts |
| Deadeye | 12 | class | 1 action | card | a timer with no rules a fight counts |
| Extract Vow of Nonviolence | 12 | class | 2 actions | card | a timer with no rules a fight counts |
| Hedge Maze | 12 | class | 3 actions | card | a timer with no rules a fight counts |
| No!!! | 12 | class | reaction | card | a timer with no rules a fight counts |
| Share Tincture | 12 | class | 1 action | card | a timer with no rules a fight counts |
| Shared Sight | 12 | class | 1 action | card | a timer with no rules a fight counts |
| Athlete's Ally | 14 | class | 1 action | card | a timer with no rules a fight counts |
| Body of Air | 14 | class | reaction | card | a timer with no rules a fight counts |
| Decree of Prosperity | 14 | class | 1 action | card | a timer with no rules a fight counts |
| Define the Canvas | 14 | class | 2 actions | card | a timer with no rules a fight counts |
| Desperate Finisher | 14 | class | reaction | card | a timer with no rules a fight counts |
| Extend Surge | 14 | class | 1 action | card | a timer with no rules a fight counts |
| Henge Gate | 14 | class | 2 actions | card | a timer with no rules a fight counts |
| Ocular Flesh | 14 | class | 1 action | card | a timer with no rules a fight counts |
| You Can't Hide From Us | 14 | class | 1 action | card | a timer with no rules a fight counts |
| Cognitive Loophole | 16 | class | reaction | card | a timer with no rules a fight counts |
| Divide and Conquer | 16 | class | 2 actions | card | a timer with no rules a fight counts |
| My Kingdom, My Blood | 16 | class | 3 actions | card | a timer with no rules a fight counts |
| Beasts of Slumbering Steel | 18 | class | 3 actions | card | a timer with no rules a fight counts |
| Profane Bargain | 18 | class | 3 actions | card | a timer with no rules a fight counts |
| Second Thoughts | 18 | class | reaction | card | a timer with no rules a fight counts |
| Turn the Wheel of Seasons | 18 | class | 3 actions | card | a timer with no rules a fight counts |
| Steal Essence | 20 | class | 2 actions | card | a timer with no rules a fight counts |
| Stone Forge of the First | 20 | class | 2 actions | card | a timer with no rules a fight counts |
| Tenacious Blood Magic | 20 | class | free | card | a timer with no rules a fight counts |
| Vivacious Afterimage | 20 | class | 1 action | card | a timer with no rules a fight counts |
| Juggle | 2 | skill | 1 action | card | a timer with no rules a fight counts |
| Sanctify Water | 2 | skill | 1 action | card | a timer with no rules a fight counts |
| Skeptic's Defense | 7 | skill | reaction | card | a timer with no rules a fight counts |
| Fear of God | 14 | skill | free | card | a timer with no rules a fight counts |

### a plan the engine can't play (98)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Avenge in Glory | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Bounce Boost | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Life-Giving Magic | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Maiden's Mending | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Play Dead | 1 | ancestry | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Reflective Defense | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Savor the Hunt | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Spray Ink | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Sudden Mindfulness | 1 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| All This Has Happened Before | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Bold Defiance | 5 | ancestry | free | card | a plan the engine can't play (its targeting or what it does) |
| Call to Battle | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Guided by the Stars | 5 | ancestry | free | card | a plan the engine can't play (its targeting or what it does) |
| Healer's Halo | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Heat Wave | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Quick Root | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Rekindled Light | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Spark of Independence | 5 | ancestry | 2 actions | card | a plan the engine can't play (its targeting or what it does) |
| Vomit Stomach | 5 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Ferocious Will | 9 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Mask of Pain | 9 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Pollinate | 9 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Quick Recovery | 9 | ancestry | free | card | a plan the engine can't play (its targeting or what it does) |
| Hop Up | 13 | ancestry | free | card | a plan the engine can't play (its targeting or what it does) |
| Squirm Free | 13 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Cantorian Restoration | 17 | ancestry | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Blood Calls Blood | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Devrin's Cunning Stance | 4 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Disengaging Twist | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Dread Marshal Stance | 4 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Heroic Defiance | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Inspiring Marshal Stance | 4 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Patronize the Arts | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Reactive Tangle | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Strategist Stance | 4 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Such a Disgrace! | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| You're an Embarrassment! | 4 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Archaeologist's Warning | 6 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Fear No Pain! | 6 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Repulse the Wicked | 6 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Armored Rebuff | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Commitment to Valor | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Dismal Harvest | 8 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Drive Back | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Gardener's Resolve | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Martyr's Parry | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Metabolize Element | 8 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Statue | 8 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Wake and Tremble | 8 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Defy Sorrow | 10 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Ensnaring Wrappings | 10 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Fluttering Distraction | 10 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Gathering Moss | 10 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Mockingbird's Disarm | 10 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Shattering Strike (Weapon Improviser) | 10 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Tumbling Opportunist | 10 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Propelled Leap | 12 | archetype | 2 actions | card | a plan the engine can't play (its targeting or what it does) |
| Self Destruct | 12 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Awake With a Roar | 14 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Even the Odds (Eagle Knight) | 14 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Tempo Shift | 16 | archetype | free | card | a plan the engine can't play (its targeting or what it does) |
| Body Barrier | 18 | archetype | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Deific Font | 18 | archetype | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Flying Flame | 1 | class | 2 actions | card | a plan the engine can't play (its targeting or what it does) |
| Foretell Harm | 1 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Divine Aegis | 2 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Emotional Push | 2 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Fiery Rebirth | 4 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Inspiring Resilience | 4 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Song of Glorious Invocation | 4 | class | 1 action | card | a plan the engine can't play (its targeting or what it does) |
| Align Qi | 6 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Disarming Intercept | 6 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Shield Wall | 6 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Shove Down | 6 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Volcanic Escape | 6 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Dark Persona's Presence | 8 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Mental Static | 8 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Call From Death's Door | 10 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Corpse-Killer's Defiance | 10 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Dazzling Block | 10 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Fish From the Falls' Edge | 10 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Geobukseon Retaliation | 10 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Prevailing Position | 10 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Apparition Cloud | 12 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Drowning Mist | 12 | class | 2 actions | card | a plan the engine can't play (its targeting or what it does) |
| Get Used to Disappointment | 12 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Blood Pool | 14 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Towering Transformation | 14 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Noble Sacrifice | 16 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Vindictive Thoughts | 16 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Blaze of Revelation | 18 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Spirit's Sacrifice | 18 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Astonishing Explosion | 20 | class | free | card | a plan the engine can't play (its targeting or what it does) |
| Hidden Paragon | 20 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Ringmaster's Introduction | 20 | class | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Say That Again! | 6 | skill | reaction | card | a plan the engine can't play (its targeting or what it does) |
| Kip Up | 7 | skill | free | card | a plan the engine can't play (its targeting or what it does) |
| Too Angry to Die | 12 | skill | reaction | card | a plan the engine can't play (its targeting or what it does) |

### a Strike with nothing more the simulator reads (61)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Returning Throw | 9 | ancestry | 2 actions | card | a Strike with nothing more the simulator reads |
| Elbow Breaker | 4 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Feverish Enzymes | 6 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Sword-Light Wave | 6 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Stay Here! | 8 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Tumbling Strike | 8 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Twirling Strike | 8 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Aerial Piledriver | 10 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Dizzying Spin Dance | 10 | archetype | 3 actions | card | a Strike with nothing more the simulator reads |
| Aerial Flash | 12 | archetype | 3 actions | card | a Strike with nothing more the simulator reads |
| Chain Reaction | 12 | archetype | 3 actions | card | a Strike with nothing more the simulator reads |
| Claw and Talon Flow | 12 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Drive-By Attack | 12 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Lonely Army | 14 | archetype | 3 actions | card | a Strike with nothing more the simulator reads |
| Simultaneous Strike | 14 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Controlled Bullet | 16 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Deathblow | 16 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Grave Threat | 16 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Incorporeal Shot | 16 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Whirling Clobber | 16 | archetype | 3 actions | card | a Strike with nothing more the simulator reads |
| Black Powder Embodiment | 18 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Cut them Down, Burn them Out | 18 | archetype | 1 action | card | a Strike with nothing more the simulator reads |
| Wrath of the First Ghoul | 20 | archetype | 2 actions | card | a Strike with nothing more the simulator reads |
| Silence Heresy | 0 | bonus | 2 actions | card | a Strike with nothing more the simulator reads |
| Combat Assessment | 1 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Engraving Strike | 1 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Remote Detonation | 1 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Bullet and a Broadside | 2 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Pattern Flight | 2 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Sleek Reposition | 2 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Wukong Extension | 2 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Instructive Strike | 4 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Knock Sense | 4 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Mug | 4 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Unsteadying Strike | 4 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Cauterize | 6 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Lock Down | 6 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Revealing Stab | 6 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Scatter Blast | 6 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Slice and Swipe | 6 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Distracting Toss | 8 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Smoke Curtain | 8 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Momentum Strike | 10 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Trick Shot | 10 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Ricochet Shot | 12 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Sunder Spell | 12 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Blast Tackle | 14 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Dance of Bloody Ink | 14 | class | 3 actions | card | a Strike with nothing more the simulator reads |
| Guiding Finish | 14 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Release Me! | 14 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Tangled Forest Rake | 14 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Unerring Runic Attraction | 14 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Bat Around | 16 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Dispelling Slice | 16 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Leaping Hedgehog Strike | 16 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Sever Magic | 16 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Virulent Strike | 16 | class | 1 action | card | a Strike with nothing more the simulator reads |
| Army of One | 18 | class | 3 actions | card | a Strike with nothing more the simulator reads |
| Throw and Catch | 18 | class | 3 actions | card | a Strike with nothing more the simulator reads |
| Finish Their Story! | 20 | class | 2 actions | card | a Strike with nothing more the simulator reads |
| Sever Space | 20 | class | 2 actions | card | a Strike with nothing more the simulator reads |

### a roll whose results the simulator doesn't read (51)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Empathetic Plea | 1 | ancestry | reaction | card | a roll whose results the simulator doesn't read |
| Keep up Appearances | 1 | ancestry | reaction | card | a roll whose results the simulator doesn't read |
| Anchoring Arrow | 13 | ancestry | 2 actions | card | a roll whose results the simulator doesn't read |
| Disruptive Stare | 13 | ancestry | reaction | card | a roll whose results the simulator doesn't read |
| Luring Chomp | 13 | ancestry | 1 action | card | a roll whose results the simulator doesn't read |
| Gunpowder Gauntlet | 4 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Boaster's Challenge | 6 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Denounce Tyranny | 6 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Interrogate | 6 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Pluck from the Sky | 8 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Public Execution | 8 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Statement Strut | 8 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Swap Reflections | 8 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Battlefront Sabotage | 10 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Reel 'Em In | 10 | archetype | 1 action | card | a roll whose results the simulator doesn't read |
| Curse of the Saumen Kar | 14 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Declare Anathema | 16 | archetype | 2 actions | card | a roll whose results the simulator doesn't read |
| Resuscitate | 16 | archetype | 3 actions | card | a roll whose results the simulator doesn't read |
| Unwind Death | 16 | archetype | 3 actions | card | a roll whose results the simulator doesn't read |
| Plant Evidence | 1 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Bleed Out | 2 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Improvise Admixture | 2 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Barreling Charge | 4 | class | 2 actions | card | a roll whose results the simulator doesn't read |
| Command Elemental | 4 | class | 2 actions | card | a roll whose results the simulator doesn't read |
| Command Undead | 4 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Divert Streamflow | 4 | class | reaction | card | a roll whose results the simulator doesn't read |
| Ostentatious Reload | 4 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Predictable! | 4 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Sabotage | 4 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Convincing Illusion | 6 | class | reaction | card | a roll whose results the simulator doesn't read |
| Watch Your Back | 6 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Spellbinding Speech | 8 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Roll the Bones of Fate | 10 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Standard-Bearer's Sacrifice | 10 | class | reaction | card | a roll whose results the simulator doesn't read |
| Felling Shot | 12 | class | 2 actions | card | a roll whose results the simulator doesn't read |
| Miraculous Intervention | 12 | class | reaction | card | a roll whose results the simulator doesn't read |
| Reactive Interference | 12 | class | reaction | card | a roll whose results the simulator doesn't read |
| Reverberate | 12 | class | reaction | card | a roll whose results the simulator doesn't read |
| Desperate Resuscitation | 14 | class | 3 actions | card | a roll whose results the simulator doesn't read |
| Bring Into the Fold | 16 | class | 2 actions | card | a roll whose results the simulator doesn't read |
| By Your Name | 16 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Lethal Finisher | 18 | class | 1 action | card | a roll whose results the simulator doesn't read |
| Dance of Intercession | 20 | class | 3 actions | card | a roll whose results the simulator doesn't read |
| Soul Thief | 20 | class | 3 actions | card | a roll whose results the simulator doesn't read |
| No Cause for Alarm | 1 | skill | 3 actions | card | a roll whose results the simulator doesn't read |
| Reveal True Name | 1 | skill | 2 actions | card | a roll whose results the simulator doesn't read |
| Distracting Flattery | 4 | skill | reaction | card | a roll whose results the simulator doesn't read |
| Commitment to Protection | 6 | skill | 1 action | card | a roll whose results the simulator doesn't read |
| Go with the Flow | 7 | skill | reaction | card | a roll whose results the simulator doesn't read |
| Improvise Strategy | 7 | skill | 1 action | card | a roll whose results the simulator doesn't read |
| Seasoned Command | 7 | skill | 1 action | card | a roll whose results the simulator doesn't read |

### its requirement (46)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Warp Likeness | 5 | ancestry | 1 action | card | its requirement (You hit a creature with a melee Strike on your last action) |
| Defensive Instincts | 9 | ancestry | 1 action | card | its requirement (you are adjacent to at least two enemies Your body tenses up when surrounded, putting you on  |
| Energize Bite | 9 | ancestry | free | card | its requirement (Your most recent action was to use Breath of the Dragon) |
| Release the Light | 17 | ancestry | 2 actions | card | its requirement (You're below 20 Hit Points) |
| Attunement Shift | 4 | archetype | free | card | its requirement (Your previous action was to cast a spell with the air, cold, earth, fire, plant, or water tra |
| Lassoing Lash | 4 | archetype | 1 action | card | its requirement (The target can't be more than one size larger than you) |
| Log Roll | 4 | archetype | 1 action | card | its requirement (You and an adjacent creature are both on a narrow surface or uneven ground and the other crea |
| Bear Hug (Werecreature) | 6 | archetype | 2 actions | card | its requirement (You're in bear or hybrid shape, and your last action was a successful claw Strike.) |
| Betraying Shank | 6 | archetype | 1 action | card | its requirement (You are within melee reach of a target, but it is not in combat with you.) |
| Commitment to Liberty | 6 | archetype | 2 actions | card | its requirement (A creature has an ally Grabbed or Restrained.) |
| Disarming Smile | 6 | archetype | reaction | card | its requirement (You are aware of the attacker, the attacker is an intelligent humanoid creature, and you have |
| Discerning Strike | 6 | archetype | 1 action | card | its requirement (You have successfully identified the target with @UUID[Compendium.pf2e.actionspf2e.Item.Recal |
| Hindquarter Kick | 6 | archetype | 1 action | card | its requirement (You are in claw stance and have Grabbed a creature.) |
| Opportune Trickster | 6 | archetype | reaction | card | its requirement (You're adjacent to both your ally and the creature) |
| Spiritual Strike | 6 | archetype | 2 actions | card | its requirement (You are wielding a weapon with at least one fundamental rune and your familiar is adjacent to |
| Startling Appearance (Vigilante) | 6 | archetype | 1 action | card | its requirement (You are completely unnoticed by the target creature.) |
| Unbalancing Appearance | 6 | archetype | 1 action | card | its requirement (A creature within your reach is Off-Guard to you, and you are Unnoticed by that creature.) |
| Unfettering Strike | 6 | archetype | 1 action | card | its requirement (A creature within your reach has an ally Grabbed or Restrained.) |
| Guardian's Embrace | 8 | archetype | 1 action | card | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Piercing Doom | 8 | archetype | 2 actions | card | its requirement (You are Doomed 2 or greater.) |
| Pressure Change | 8 | archetype | 1 action | card | its requirement (You have a swim Speed, are underwater, and have a creature Grabbed or Restrained) |
| Riptide (Undersea Privateer) | 8 | archetype | 1 action | card | its requirement (You're in Anchor Stance, and your target is within 5 feet of the edge of a water vehicle or a |
| Invigorating Breath | 10 | archetype | 1 action | card | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Scout's Pounce | 10 | archetype | 2 actions | card | its requirement (You are Hidden from or Undetected by all of your opponents, and you aren't within 10 feet of  |
| Slay | 12 | archetype | 2 actions | card | its requirement (Your target is Doomed 2 or greater.) |
| Thunderous Landing | 12 | archetype | 1 action | card | its requirement (You currently have a fly Speed and are airborne) |
| Devastating Manifestation | 14 | archetype | 2 actions | card | its requirement (At least one of your soulforged armaments is not manifested.) |
| Execution | 14 | archetype | 2 actions | card | its requirement (You have condemned a foe with Harsh Judgment.) |
| Stunning Surprise | 14 | archetype | 2 actions | card | its requirement (You must be undetected by the target creature) |
| Following Smite | 16 | archetype | 1 action | card | its requirement (Your last action was a Strike made with a weapon or unarmed attack empowered by @UUID[Compend |
| Sonic Strafe | 16 | archetype | 2 actions | card | its requirement (You currently have a fly Speed) |
| Five Breaths, One Death | 18 | archetype | 3 actions | card | its requirement (You're in an elemental stance, and the target is under the effects of Induce Imbalance.) |
| Brutal Crush | 4 | class | 1 action | card | its requirement (Your last action dealt bludgeoning damage using an unarmed Strike granted by a morph or polym |
| Galloping Launch | 4 | class | 1 action | card | its requirement (You're mounted, and your mount moved closer to your prey this round.) |
| Rip and Tear | 4 | class | 1 action | card | its requirement (Your last action dealt piercing or slashing damage using an unarmed Strike granted by a morph |
| Violent Unleash | 4 | class | 1 action | card | its requirement (Your previous action was to Unleash your Psyche) |
| Culvert's Collapse | 6 | class | 1 action | card | its requirement (You are in Flood Stance and were damaged by an enemy since your previous turn.) |
| Intensified Element Stance | 6 | class | 1 action | card | its requirement (You were the recipient of elemental medicine (see @UUID[Compendium.pf2e.feats-srd.Item.Prepar |
| Seize an Advantage | 6 | class | 1 action | card | its requirement (Your last action this turn was to attempt a Dirty Trick against a foe.) |
| Halyard Strike | 10 | class | 2 actions | card | its requirement (A rope is within your reach, or you have a rope or grappling weapon in your hand.) |
| Blood in the Air | 12 | class | 1 action | card | its requirement (An enemy you've damaged with a ranged weapon during the last minute is Concealed or Hidden fr |
| Explosive Death Drop | 14 | class | 1 action | card | its requirement (You are in @UUID[Compendium.pf2e.feats-srd.Item.Rain of Embers Stance] and have a target Grab |
| Death from Above (Eternal Legend) | 16 | class | 2 actions | card | its requirement (You are adjacent to a climbable surface at least 10 feet tall.) |
| Demand Surrender | 18 | class | 2 actions | card | its requirement (You and your allies currently outnumber enemies on the battlefield, and you or an ally has ei |
| Liberty or Death | 18 | class | 2 actions | card | its requirement (A creature has been the target of your Ultimatum of Liberation for at least 1 minute) |
| Mercenary Reversal | 18 | class | 2 actions | card | its requirement (You and your allies are currently outnumbered by enemies on the battlefield) |

### an Effect with nothing a fight counts (45)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Crystal Luminescence | 1 | ancestry | 1 action | card | an Effect with nothing a fight counts |
| Inventive Offensive | 1 | ancestry | 3 actions | card | an Effect with nothing a fight counts |
| Nanite Surge | 1 | ancestry | reaction | card | an Effect with nothing a fight counts |
| Watchful Gaze | 1 | ancestry | 1 action | card | an Effect with nothing a fight counts |
| Favorable Winds | 5 | ancestry | 1 action | card | an Effect with nothing a fight counts |
| Fortify Shield | 5 | ancestry | 1 action | card | an Effect with nothing a fight counts |
| Augment Senses | 13 | ancestry | 1 action | card | an Effect with nothing a fight counts |
| In Lightning, Life | 4 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Inspiring Recitation | 4 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Lesson of the Broken Wing | 4 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Tunnel Wall | 4 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Guided Skill | 6 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Infused with Belkzen's Might | 6 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Spiral Sworn | 6 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Fine Print | 8 | archetype | free | card | an Effect with nothing a fight counts |
| Nothing Personal | 8 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Sense Iniquity | 8 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Grief's Fury | 10 | archetype | reaction | card | an Effect with nothing a fight counts |
| Invoke Movement | 12 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Watch Your Back (Golden Legionnaire) | 14 | archetype | 1 action | card | an Effect with nothing a fight counts |
| Geologic Attunement | 1 | class | 1 action | card | an Effect with nothing a fight counts |
| Weapon Infusion | 1 | class | free | card | an Effect with nothing a fight counts |
| After You | 2 | class | free | card | an Effect with nothing a fight counts |
| Fane's Fourberie | 2 | class | 1 action | card | an Effect with nothing a fight counts |
| Fortifying Knock | 2 | class | 1 action | card | an Effect with nothing a fight counts |
| Shooting Stars Stance | 2 | class | 1 action | card | an Effect with nothing a fight counts |
| Storied Companion | 2 | class | reaction | card | an Effect with nothing a fight counts |
| Air Shroud | 4 | class | 1 action | card | an Effect with nothing a fight counts |
| Even the Odds | 4 | class | free | card | an Effect with nothing a fight counts |
| Magnetic Field | 4 | class | 1 action | card | an Effect with nothing a fight counts |
| Peafowl Stance | 4 | class | 1 action | card | an Effect with nothing a fight counts |
| Desert Wind | 6 | class | 1 action | card | an Effect with nothing a fight counts |
| Disarming Stance | 6 | class | 1 action | card | an Effect with nothing a fight counts |
| Educate Allies | 6 | class | reaction | card | an Effect with nothing a fight counts |
| Ricochet Stance (Fighter) | 6 | class | 1 action | card | an Effect with nothing a fight counts |
| Protective Pose | 8 | class | 2 actions | card | an Effect with nothing a fight counts |
| Ricochet Stance (Rogue) | 8 | class | 1 action | card | an Effect with nothing a fight counts |
| Dragon's Rage Wings | 12 | class | 1 action | card | an Effect with nothing a fight counts |
| Blanket Defense | 14 | class | 3 actions | card | an Effect with nothing a fight counts |
| Don Thy Fervor | 14 | class | 1 action | card | an Effect with nothing a fight counts |
| Invigorating Surge | 14 | class | 1 action | card | an Effect with nothing a fight counts |
| Lord of the Fiends | 14 | class | 2 actions | card | an Effect with nothing a fight counts |
| Whirling Blade Stance | 14 | class | 1 action | card | an Effect with nothing a fight counts |
| Resounding Finale | 16 | class | reaction | card | an Effect with nothing a fight counts |
| Emergency Medical Assistance | 12 | skill | 2 actions | card | an Effect with nothing a fight counts |

### a passive's roll with no action to use it (37)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Native Waters | 1 | ancestry | passive | card | a passive's roll with no action to use it |
| Nourishing Symbiosis | 5 | ancestry | passive | card | a passive's roll with no action to use it |
| Restoring Blood | 5 | ancestry | passive | card | a passive's roll with no action to use it |
| Nodal Healing | 9 | ancestry | passive | card | a passive's roll with no action to use it |
| Replenishing Hydration | 9 | ancestry | passive | card | a passive's roll with no action to use it |
| Solar Rejuvenation | 9 | ancestry | passive | card | a passive's roll with no action to use it |
| Vivacious Conduit | 9 | ancestry | passive | card | a passive's roll with no action to use it |
| Slay Giants Unseen | 13 | ancestry | passive | card | a passive's roll with no action to use it |
| Coral Lifeline | 17 | ancestry | passive | card | a passive's roll with no action to use it |
| Bullet Dancer Burn | 4 | archetype | passive | card | a passive's roll with no action to use it |
| Replenishing Consumption | 4 | archetype | passive | card | a passive's roll with no action to use it |
| Distracting Bites | 6 | archetype | passive | card | a passive's roll with no action to use it |
| Infiltrate Dream | 6 | archetype | passive | card | a passive's roll with no action to use it |
| Mastermind's Eye | 6 | archetype | passive | card | a passive's roll with no action to use it |
| Grasping Corpses | 8 | archetype | passive | card | a passive's roll with no action to use it |
| And Yet it Still Hurts | 10 | archetype | passive | card | a passive's roll with no action to use it |
| Daring Flourish | 10 | archetype | passive | card | a passive's roll with no action to use it |
| Sinking Jaws | 10 | archetype | passive | card | a passive's roll with no action to use it |
| Coffin Bound | 12 | archetype | passive | card | a passive's roll with no action to use it |
| Competitive Eater | 12 | archetype | passive | card | a passive's roll with no action to use it |
| Sword of Sealing | 12 | archetype | passive | card | a passive's roll with no action to use it |
| Throttle the Divine | 14 | archetype | passive | card | a passive's roll with no action to use it |
| Free from Bonds | 16 | archetype | passive | card | a passive's roll with no action to use it |
| Panic the Dead | 2 | class | passive | card | a passive's roll with no action to use it |
| Shared Stratagem | 2 | class | passive | card | a passive's roll with no action to use it |
| Powerful Shove | 4 | class | passive | card | a passive's roll with no action to use it |
| Combustible Poison | 6 | class | passive | card | a passive's roll with no action to use it |
| Nature Prowler | 6 | class | passive | card | a passive's roll with no action to use it |
| Cremate Undead | 8 | class | passive | card | a passive's roll with no action to use it |
| Make 'Em Sweat | 12 | class | passive | card | a passive's roll with no action to use it |
| Awesome Blow | 14 | class | passive | card | a passive's roll with no action to use it |
| Collateral Thrash | 16 | class | passive | card | a passive's roll with no action to use it |
| Hair Trigger | 16 | class | passive | card | a passive's roll with no action to use it |
| Momentary Respite | 16 | class | passive | card | a passive's roll with no action to use it |
| Immortal Techniques | 20 | class | passive | card | a passive's roll with no action to use it |
| Mega Bomb | 20 | class | passive | card | a passive's roll with no action to use it |
| Deathless Servant | 18 | class feature | passive | card | a passive's roll with no action to use it |

### its Effect has nothing a fight counts (24)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Cringe | 1 | ancestry | reaction | card | its Effect has nothing a fight counts |
| Hunter's Defense | 1 | ancestry | reaction | card | its Effect has nothing a fight counts |
| Mistaken Identity | 5 | ancestry | reaction | card | its Effect has nothing a fight counts |
| Fierce Competitor | 9 | ancestry | 2 actions | card | its Effect has nothing a fight counts |
| Sharpened Senses | 13 | ancestry | free | card | its Effect has nothing a fight counts |
| Starstone Aspirant Dedication | 2 | archetype | passive | card | its Effect has nothing a fight counts |
| Brains! | 6 | archetype | free | card | its Effect has nothing a fight counts |
| Familiar's Resolve | 6 | archetype | 1 action | card | its Effect has nothing a fight counts |
| Flair Rider Stance | 6 | archetype | 1 action | card | its Effect has nothing a fight counts |
| Hey! Over Here! | 6 | archetype | reaction | card | its Effect has nothing a fight counts |
| Vision of Foresight | 6 | archetype | 1 action | card | its Effect has nothing a fight counts |
| Bolster Ally | 8 | archetype | reaction | card | its Effect has nothing a fight counts |
| Harbinger's Armament | 8 | archetype | passive | card | its Effect has nothing a fight counts |
| Phenom's Verve | 10 | archetype | passive | card | its Effect has nothing a fight counts |
| Inescapable Grasp | 12 | archetype | passive | card | its Effect has nothing a fight counts |
| Night's Warning | 14 | archetype | reaction | card | its Effect has nothing a fight counts |
| Free the Bound | 1 | class | reaction | card | its Effect has nothing a fight counts |
| Turn Away Misfortune | 2 | class | reaction | card | its Effect has nothing a fight counts |
| Sacrifice Armor | 8 | class | reaction | card | its Effect has nothing a fight counts |
| Just as Planned | 12 | class | free | card | its Effect has nothing a fight counts |
| Terrifying Mien | 16 | class | passive | card | its Effect has nothing a fight counts |
| Armament Paragon | 20 | class | passive | card | its Effect has nothing a fight counts |
| Devil You Know | 4 | skill | passive | card | its Effect has nothing a fight counts |
| Muscle Mimicry | 7 | skill | reaction | card | its Effect has nothing a fight counts |

### a spell the feat casts (23)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Reveal Hidden Self | 5 | ancestry | 3 actions | card | a spell the feat casts |
| Build the First Walls | 9 | ancestry | 3 actions | card | a spell the feat casts |
| Submerged Stillness | 9 | ancestry | 2 actions | card | a spell the feat casts |
| Heroic Presence | 17 | ancestry | 1 action | card | a spell the feat casts |
| True Gaze | 17 | ancestry | 1 action | card | a spell the feat casts |
| Semblance of Life | 4 | archetype | free | card | a spell the feat casts |
| Fey's Trickery | 8 | archetype | 2 actions | card | a spell the feat casts |
| Terrain Form | 10 | archetype | 1 action | card | a spell the feat casts |
| Emergency Regeneration | 16 | archetype | reaction | card | a spell the feat casts |
| Burn Identity | 18 | archetype | 2 actions | card | a spell the feat casts |
| Whisper on the Wind | 1 | class | 1 action | card | a spell the feat casts |
| Plate in Treasure | 4 | class | 1 action | card | a spell the feat casts |
| Return to the Sea | 4 | class | 2 actions | card | a spell the feat casts |
| Animal Rage | 8 | class | 1 action | card | a spell the feat casts |
| Epiphany at the Crossroads | 12 | class | free | card | a spell the feat casts |
| Rattle the Earth | 12 | class | 2 actions | card | a spell the feat casts |
| Rock Rampart | 12 | class | 3 actions | card | a spell the feat casts |
| Barrier of Boreal Frost | 14 | class | 3 actions | card | a spell the feat casts |
| Reactive Transformation | 14 | class | reaction | card | a spell the feat casts |
| Dragon Transformation | 16 | class | 1 action | card | a spell the feat casts |
| Too Much to Swallow | 16 | class | reaction | card | a spell the feat casts |
| Head of the Night Parade | 20 | class | 3 actions | card | a spell the feat casts |
| Quaking Stomp | 20 | class | 1 action | card | a spell the feat casts |

### a passive's Effect posted by hand (22)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Spell Survivor | 5 | ancestry | passive | card | a passive's Effect posted by hand |
| Tough Tumbler | 5 | ancestry | passive | card | a passive's Effect posted by hand |
| Rivethun Spiritual Attunement | 9 | ancestry | passive | card | a passive's Effect posted by hand |
| Born in the Saddle | 4 | archetype | passive | card | a passive's Effect posted by hand |
| Deft Cooperation | 4 | archetype | passive | card | a passive's Effect posted by hand |
| Harrow Ritualist | 6 | archetype | passive | card | a passive's Effect posted by hand |
| Macabre Virtuoso | 6 | archetype | passive | card | a passive's Effect posted by hand |
| Able Ritualist | 8 | archetype | passive | card | a passive's Effect posted by hand |
| Glyph Expert | 8 | archetype | passive | card | a passive's Effect posted by hand |
| Reading the Signs | 8 | archetype | passive | card | a passive's Effect posted by hand |
| Flailtongue | 10 | archetype | passive | card | a passive's Effect posted by hand |
| Daredevil's Gambit | 12 | archetype | passive | card | a passive's Effect posted by hand |
| Emboldened with Glorious Purpose | 18 | archetype | passive | card | a passive's Effect posted by hand |
| Shadow Master | 18 | archetype | passive | card | a passive's Effect posted by hand |
| Ongoing Selfishness | 1 | class | passive | card | a passive's Effect posted by hand |
| The Harder They Fall (Hellknight) | 1 | class | passive | card | a passive's Effect posted by hand |
| Esoteric Warden | 2 | class | passive | card | a passive's Effect posted by hand |
| Thaumaturgic Ritualist | 4 | class | passive | card | a passive's Effect posted by hand |
| Blazing Mutagen | 8 | class | passive | card | a passive's Effect posted by hand |
| Castigating Weapon | 10 | class | passive | card | a passive's Effect posted by hand |
| Great Shield Mastery | 20 | class | passive | card | a passive's Effect posted by hand |
| Sure Foot | 4 | skill | passive | card | a passive's Effect posted by hand |

### a passive's Effect on other creatures (20)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Clan Protector | 5 | ancestry | passive | card | a passive's Effect on other creatures |
| Cavalier's Banner | 4 | archetype | passive | card | a passive's Effect on other creatures |
| Rod of Rule | 6 | archetype | passive | card | a passive's Effect on other creatures |
| Swift Support | 6 | archetype | passive | card | a passive's Effect on other creatures |
| Pushing Wind | 8 | archetype | passive | card | a passive's Effect on other creatures |
| Topple Giants | 8 | archetype | passive | card | a passive's Effect on other creatures |
| Control Tower | 14 | archetype | passive | card | a passive's Effect on other creatures |
| Healing Sanctuary | 16 | archetype | passive | card | a passive's Effect on other creatures |
| Soothing Vials | 1 | class | passive | card | a passive's Effect on other creatures |
| Enjoy the Show | 2 | class | passive | card | a passive's Effect on other creatures |
| Mythic Allies | 8 | class | passive | card | a passive's Effect on other creatures |
| Methodical Debilitations | 10 | class | passive | card | a passive's Effect on other creatures |
| Pale Horse | 12 | class | passive | card | a passive's Effect on other creatures |
| Shared Overdrive | 12 | class | passive | card | a passive's Effect on other creatures |
| Chosen Ward | 14 | class | passive | card | a passive's Effect on other creatures |
| Didactic Strike | 16 | class | passive | card | a passive's Effect on other creatures |
| Incredible Scout | 11 | general | passive | card | a passive's Effect on other creatures |
| Acupuncturist | 1 | skill | passive | card | a passive's Effect on other creatures |
| Prepare Elemental Medicine | 1 | skill | passive | card | a passive's Effect on other creatures |
| Root Magic | 1 | skill | passive | card | a passive's Effect on other creatures |

### a teleport (20)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Bushwhack | 1 | ancestry | 1 action | card | a teleport |
| Stone Passage | 9 | ancestry | 2 actions | card | a teleport |
| Water Strider | 9 | ancestry | 2 actions | card | a teleport |
| Plane Hop | 13 | ancestry | 2 actions | card | a teleport |
| Synchronous Slither | 13 | ancestry | reaction | card | a teleport |
| Trample (Centaur) | 13 | ancestry | 3 actions | card | a teleport |
| Trample (Sarangay) | 17 | ancestry | 3 actions | card | a teleport |
| Lesson of the Circling Gale | 4 | archetype | 1 action | card | a teleport |
| Dart Between | 8 | archetype | 2 actions | card | a teleport |
| Shamble | 8 | archetype | 2 actions | card | a teleport |
| Tight Follower | 8 | archetype | reaction | card | a teleport |
| Lead the Way | 10 | archetype | 2 actions | card | a teleport |
| Pass Through | 10 | archetype | 3 actions | card | a teleport |
| Cartwheel Dodge | 12 | archetype | reaction | card | a teleport |
| Maneuvering Spell | 12 | archetype | free | card | a teleport |
| Dragon's Journey | 14 | archetype | 1 action | card | a teleport |
| Tap into Blood | 1 | class | 1 action | card | a teleport |
| Black Powder Boost | 4 | class | 1 action | card | a teleport |
| Wandering Thoughts | 16 | class | free | card | a teleport |
| Cycle of Souls | 18 | class | free | card | a teleport |

### a reaction to "passive" (17)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Disorienting Venom | 9 | ancestry | passive | card | a reaction to "passive" |
| Hallucinogenic Ink | 9 | ancestry | passive | card | a reaction to "passive" |
| Know I Approach | 13 | ancestry | passive | card | a reaction to "passive" |
| Sever the Dreaming Shadow | 17 | ancestry | passive | card | a reaction to "passive" |
| Hijack Undead | 4 | archetype | passive | card | a reaction to "passive" |
| Cozy Campfire | 6 | archetype | passive | card | a reaction to "passive" |
| Plague Rat | 6 | archetype | passive | card | a reaction to "passive" |
| Orator's Filibuster | 8 | archetype | passive | card | a reaction to "passive" |
| Touch of Lunacy | 10 | archetype | passive | card | a reaction to "passive" |
| Red-Gold Mortality | 2 | class | passive | card | a reaction to "passive" |
| Numbing Spice Exhalation | 4 | class | passive | card | a reaction to "passive" |
| Gigaton Strike | 8 | class | passive | card | a reaction to "passive" |
| One-Millimeter Punch | 16 | class | passive | card | a reaction to "passive" |
| Not This Time | 18 | class | passive | card | a reaction to "passive" |
| Unstoppable Force | 18 | class | passive | card | a reaction to "passive" |
| Heart of the Kaiju | 20 | class | passive | card | a reaction to "passive" |
| Ricochet Legend | 20 | class | passive | card | a reaction to "passive" |

### nothing a fight uses (15)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Evanescent Wings | 1 | ancestry | 1 action | card | nothing a fight uses |
| Fledgling Flight | 1 | ancestry | 1 action | card | nothing a fight uses |
| Take Flight | 1 | ancestry | 1 action | card | nothing a fight uses |
| Take Wing | 1 | ancestry | 1 action | card | nothing a fight uses |
| Devil in Plain Sight | 5 | ancestry | 2 actions | card | nothing a fight uses |
| Dragon's Flight | 5 | ancestry | 1 action | card | nothing a fight uses |
| Iruxi Glide | 5 | ancestry | 1 action | card | nothing a fight uses |
| Long-Nosed Form | 5 | ancestry | 1 action | card | nothing a fight uses |
| Soaring Flight | 5 | ancestry | 1 action | card | nothing a fight uses |
| Tripkee Glide | 5 | ancestry | 1 action | card | nothing a fight uses |
| Winglet Flight | 9 | ancestry | 1 action | card | nothing a fight uses |
| March the Mines | 13 | ancestry | 2 actions | card | nothing a fight uses |
| Benefactor's Wings | 8 | archetype | 1 action | card | nothing a fight uses |
| Glider Form | 1 | class | 1 action | card | nothing a fight uses |
| Wings of Bone and Sinew | 8 | class | 1 action | card | nothing a fight uses |

### its text has no Strike of its user's (14)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Leech-Clip | 1 | ancestry | 2 actions | card | its text has no Strike of its user's |
| Powder Punch Stance | 2 | archetype | 1 action | card | its text has no Strike of its user's |
| Targeted Redirection | 6 | archetype | 1 action | card | its text has no Strike of its user's |
| Cornered Animal | 8 | archetype | 2 actions | card | its text has no Strike of its user's |
| Staggering Blow | 10 | archetype | 2 actions | card | its text has no Strike of its user's |
| Death Dive | 12 | archetype | 3 actions | card | its text has no Strike of its user's |
| Bombing Run | 14 | archetype | 2 actions | card | its text has no Strike of its user's |
| Zombie Horde | 20 | archetype | 3 actions | card | its text has no Strike of its user's |
| Stella's Stab and Snag | 6 | class | 2 actions | card | its text has no Strike of its user's |
| Steed's Toppling Strike | 12 | class | 1 action | card | its text has no Strike of its user's |
| Second Sight | 14 | class | 1 action | card | its text has no Strike of its user's |
| Triggerbrand Blitz | 14 | class | 3 actions | card | its text has no Strike of its user's |
| Rouse the Forest's Fury | 18 | class | 3 actions | card | its text has no Strike of its user's |
| Time Dilation Cascade | 20 | class | 3 actions | card | its text has no Strike of its user's |

### a reaction's Strike (12)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Ankle Bite | 5 | ancestry | reaction | card | a reaction's Strike |
| Demonblood Frenzy | 5 | ancestry | reaction | card | a reaction's Strike |
| Jealous Grip | 5 | ancestry | reaction | card | a reaction's Strike |
| Moray Ambush | 17 | ancestry | reaction | card | a reaction's Strike |
| Tag Team | 10 | archetype | reaction | card | a reaction's Strike |
| Sailfish Strike | 14 | archetype | reaction | card | a reaction's Strike |
| Opportune Throw | 16 | archetype | reaction | card | a reaction's Strike |
| Unrivaled Retort | 6 | class | reaction | card | a reaction's Strike |
| Defend Our Union | 16 | class | reaction | card | a reaction's Strike |
| Instant Return | 16 | class | reaction | card | a reaction's Strike |
| Prescient Parry | 16 | class | reaction | card | a reaction's Strike |
| Pack Performance | 18 | class | reaction | card | a reaction's Strike |

### a lasting area (9)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Airy Step | 13 | ancestry | reaction | card | a lasting area |
| Smoothing Stomp | 13 | ancestry | 2 actions | card | a lasting area |
| Misty Transformation | 6 | class | reaction | card | a lasting area |
| Impenetrable Fog | 8 | class | 3 actions | card | a lasting area |
| Impressive Landing | 10 | class | reaction | card | a lasting area |
| Vermillion Threads | 10 | class | reaction | card | a lasting area |
| Garland Spell | 12 | class | 1 action | card | a lasting area |
| Spell Shroud | 14 | class | 1 action | card | a lasting area |
| Worldsphere Gravity | 20 | class | 1 action | card | a lasting area |

### a reroll (9)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Chance Death | 1 | ancestry | reaction | card | a reroll |
| Courteous Comeback | 1 | ancestry | free | card | a reroll |
| Let's Try That Again | 1 | ancestry | reaction | card | a reroll |
| Mask of Rejection | 5 | ancestry | reaction | card | a reroll |
| Clean Take | 6 | archetype | reaction | card | a reroll |
| Archaeologist's Luck | 8 | archetype | free | card | a reroll |
| Spiritual Guides | 4 | class | reaction | card | a reroll |
| Just One More Thing | 10 | class | 1 action | card | a reroll |
| Lessons of Flux | 10 | class | reaction | card | a reroll |

### a Focus or Mythic Point back (7)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Dissolution's Clarity | 5 | ancestry | free | card | a Focus or Mythic Point back |
| Energized Font | 5 | ancestry | 1 action | card | a Focus or Mythic Point back |
| Well of Potential | 5 | ancestry | 1 action | card | a Focus or Mythic Point back |
| Mythic Refocus | 8 | class | 1 action | card | a Focus or Mythic Point back |
| Summon Mythic Power | 8 | class | 1 action | card | a Focus or Mythic Point back |
| Surging Focus | 8 | class | free | card | a Focus or Mythic Point back |
| Retributive Focus | 18 | class | free | card | a Focus or Mythic Point back |

### a passive's Strike (6)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Quicksoul | 1 | ancestry | passive | card | a passive's Strike |
| Soulforger Dedication | 2 | archetype | passive | card | a passive's Strike |
| Stasian Charge | 8 | archetype | passive | card | a passive's Strike |
| Sweeping Tail | 10 | archetype | passive | card | a passive's Strike |
| Ambushing Knockdown | 8 | class | passive | card | a passive's Strike |
| Creature of Myth | 18 | class | passive | card | a passive's Strike |

### a choice of ways the simulator doesn't play (6)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Withstand the Storm | 5 | ancestry | reaction | card | a choice of ways the simulator doesn't play |
| Starshot Arrow | 17 | ancestry | 1 action | card | a choice of ways the simulator doesn't play |
| Golden Dragon's Bounty | 8 | archetype | 1 action | card | a choice of ways the simulator doesn't play |
| Chaotic Spell | 8 | class | 1 action | card | a choice of ways the simulator doesn't play |
| Consecrate Spell | 10 | class | 1 action | card | a choice of ways the simulator doesn't play |
| Unsheathing the Sword-Light | 10 | class | 2 actions | card | a choice of ways the simulator doesn't play |

### its requirement, which the PC doesn't meet (5)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Lobbed Attack | 8 | archetype | 1 action | card | its requirement, which the PC doesn't meet (You are Juggling a thrown weapon.) |
| Reach for the Sky | 12 | archetype | 2 actions | card | its requirement, which the PC doesn't meet (You're wielding a loaded firearm.) |
| Rebounding Toss | 2 | class | 2 actions | card | its requirement, which the PC doesn't meet (You are wielding a thrown weapon.) |
| Paired Shots | 4 | class | 2 actions | card | its requirement, which the PC doesn't meet (You're wielding two weapons, each of which can be either a loaded  |
| Twin Shot Knockdown | 10 | class | 2 actions | card | its requirement, which the PC doesn't meet (You're wielding a loaded crossbow or loaded firearm in each hand.) |

### a spell the engine doesn't cast (5)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Water to Water | 13 | ancestry | 1 action | card | a spell the engine doesn't cast (Translocate) |
| Greater Magical Edification | 10 | archetype | passive | reminder | a spell the engine doesn't cast (Translate, Mindlink, Secret Page) |
| Writing On the Wall | 4 | class | passive | reminder | a spell the engine doesn't cast (Embed Message) |
| Realm Strider | 16 | class | passive | card | a spell the engine doesn't cast (Translocate) |
| Avatar's Audience | 20 | class | passive | reminder | a spell the engine doesn't cast (Commune, Interplanar Teleport) |

### its stance's own gap (4)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Black Powder Flash | 10 | archetype | 2 actions | card | its stance (Powder Punch Stance): its text has no Strike of its user's |
| Induce Imbalance | 14 | archetype | 2 actions | card | its stance (an elemental stance), not in the packs |
| Protective Cycle | 16 | archetype | reaction | card | its stance (an elemental stance), not in the packs |
| Focused Shot | 12 | class | 1 action | card | its stance (Monastic Archer Stance): the feat module reads nothing for it |

### an Effect on another creature (4)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Selfless Parry | 8 | archetype | passive | card | an Effect on another creature |
| Demanding Challenge | 10 | archetype | passive | card | an Effect on another creature |
| Shared Warding | 12 | class | passive | card | an Effect on another creature |
| Pack of the Beast Lord | 18 | class | 3 actions | card | an Effect on another creature (both a help and a hindrance) |

### a reaction to "strike" (3)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Lesser Enhance Venom | 1 | ancestry | passive | card | a reaction to "strike" |
| Moderate Enhance Venom | 9 | ancestry | passive | card | a reaction to "strike" |
| Greater Enhance Venom | 17 | ancestry | passive | card | a reaction to "strike" |

### it grants Additional Lore (3)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Hellbreaker Dedication | 2 | archetype | passive | reminder | it grants Additional Lore: the feat module reads nothing for it |
| War Mage Dedication | 2 | archetype | passive | reminder | it grants Additional Lore: the feat module reads nothing for it |
| Golden Legionnaire Dedication | 4 | archetype | passive | reminder | it grants Additional Lore: the feat module reads nothing for it |

### a companion's Strike (3)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Surprising Leap | 8 | class | 2 actions | card | a companion's Strike |
| Magical Onslaught | 10 | class | 2 actions | card | a companion's Strike |
| Piercing Jab | 14 | class | 2 actions | card | a companion's Strike |

### damage still naming the character's data (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Invoke the Elements | 9 | ancestry | 2 actions | card | damage still naming the character's data |
| Battle Prayer | 7 | skill | 1 action | card | damage still naming the character's data |

### a reaction to "aura" (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Corpse Stench | 12 | archetype | passive | card | a reaction to "aura" |
| Empyreal Aura | 20 | archetype | passive | card | a reaction to "aura" |

### a free's Strike (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Clockwork Celerity | 6 | class | free | card | a free's Strike |
| Myth Hunter | 1 | skill | free | card | a free's Strike |

### a roll twice (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Feline Dance | 8 | archetype | reaction | card | a roll twice |
| Hematocritical | 10 | archetype | free | card | a roll twice |

### it grants Wraith Deviant Classification (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Eerie Flicker | 2 | class | reaction | card | it grants Wraith Deviant Classification: the feat module reads nothing for it |
| Ghostly Grasp (Deviant) | 2 | class | 1 action | card | it grants Wraith Deviant Classification: the feat module reads nothing for it |

### it grants Leech Deviant Classification (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Borrowed Ability | 2 | class | 1 action | card | it grants Leech Deviant Classification: the feat module reads nothing for it |
| Feed the Void | 10 | class | 2 actions | card | it grants Leech Deviant Classification: the feat module reads nothing for it |

### error (2)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Elementalist Dedication | 2 | archetype | passive | card | task: Cannot read properties of undefined (reading 'map') |
| Pirouette | 6 | class | reaction | reminder | task: Cannot read properties of undefined (reading 'map') |

### a reaction to "damaged" (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Resilient Chassis | 5 | ancestry | reaction | card | a reaction to "damaged" |

### it grants Hunt Prey (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Game Hunter Dedication | 2 | archetype | passive | reminder | it grants Hunt Prey: nothing a fight uses |

### a target the simulator can't tell (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Wrath Against the Divine | 16 | archetype | 2 actions | card | a target the simulator can't tell (Strike a foe that can cast divine spells) |

### it grants Witch's Charge (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Seneschal Witch Dedication | 2 | archetype | passive | reminder | it grants Witch's Charge: the feat module reads nothing for it |

### it grants Expel Maelstrom (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Curse Maelstrom Dedication | 2 | archetype | passive | card | it grants Expel Maelstrom: a roll whose results the simulator doesn't read |

### it grants Improvised Repair (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Patch Job | 4 | archetype | passive | reminder | it grants Improvised Repair: the feat module reads nothing for it |

### it grants Blight Soul Deviant Classification (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Release Spores | 2 | class | 2 actions | card | it grants Blight Soul Deviant Classification: the feat module reads nothing for it |

### it grants Absorb into the Aegis (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Aegis of Arnisant | 12 | archetype | 2 actions | card | it grants Absorb into the Aegis: the feat module reads nothing for it |

### effects the GM allows from the scenery (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Divine Disharmony | 1 | class | 1 action | card | effects the GM allows from the scenery |

### it grants Forced Pact (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Pact of the Living Pact | 18 | archetype | passive | reminder | it grants Forced Pact: a roll whose results the simulator doesn't read |

### it grants Verdant Core Deviant Classification (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Defensive Growth | 6 | class | reaction | card | it grants Verdant Core Deviant Classification: the feat module reads nothing for it |

### a reaction to "hit-by" (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Scouring Spark | 18 | class | passive | card | a reaction to "hit-by" |

### it grants Restore the Moment (1)

| Feat | Lvl | Category | Type | Feat module | Detail |
|---|---:|---|---|---|---|
| Preserve the Moment | 16 | class | reaction | card | it grants Restore the Moment: a reaction's Strike |
