# Class feats neither the feat module nor the simulator plays

Made by `node tools/class-feat-index.mjs` on 2026-11-07 from the feat screen's rows: PF2e's class-category feats (class and archetype feats). 1529 are rated; 2827 aren't. **No plan** means the feat module compiles nothing for it and PF2e's own rules give the simulator nothing a fight counts; **plan** means the feat module has a card for it the simulator doesn't play (the reason column). Teams+ and other module packs aren't in this copy, so they aren't here.

Buckets go by the feat's text: dedications first, then what a fight would use, then the rest. A feat that is only a combination of basic actions is still listed; it's discarded when it comes up.

## By bucket

| Bucket | No plan | Plan, not played | Total |
|---|---:|---:|---:|
| Archetype dedications (grant class features) | 76 | 81 | 157 |
| Combat actions and reactions | 194 | 364 | 558 |
| Passives that change a class feature | 156 | 40 | 196 |
| Other combat passives | 288 | 84 | 372 |
| Spellcasting (slots, focus, spellshapes) | 231 | 40 | 271 |
| Companions, familiars and eidolons | 125 | 47 | 172 |
| Out of combat (exploration, downtime, skills) | 282 | 55 | 337 |
| Nothing a fight would use | 626 | 138 | 764 |
| **All** | 1978 | 849 | 2827 |

## By class

| Class | dedication | combat-action | feature-upgrade | combat-passive | spellcasting | companion | out-of-combat | other | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| alchemist |  | 4 | 13 | 15 |  | 1 | 12 | 15 | 60 |
| animist |  | 4 | 4 |  | 12 | 3 | 5 | 2 | 30 |
| barbarian |  | 19 | 13 | 4 |  |  |  | 9 | 45 |
| bard |  | 10 | 7 |  | 15 | 1 | 14 | 13 | 60 |
| champion |  | 7 | 8 | 16 | 3 | 6 | 6 | 14 | 60 |
| cleric |  | 5 | 1 | 13 | 16 | 1 | 8 | 19 | 63 |
| commander |  | 7 | 1 | 3 |  |  | 5 | 7 | 23 |
| druid |  | 5 | 4 | 4 | 18 | 5 | 7 | 19 | 62 |
| exemplar |  | 2 | 21 | 2 |  |  | 3 | 4 | 32 |
| fighter |  | 19 |  | 5 |  |  | 1 | 9 | 34 |
| guardian |  | 8 | 2 | 5 |  |  | 2 | 4 | 21 |
| gunslinger |  | 18 | 3 | 11 |  | 1 | 4 | 12 | 49 |
| inventor |  | 4 | 6 | 1 |  | 3 | 4 | 10 | 28 |
| investigator |  | 4 | 4 | 11 |  | 1 | 16 | 11 | 47 |
| kineticist |  | 27 | 4 | 1 | 1 | 1 | 6 | 20 | 60 |
| magus |  | 14 | 6 | 2 | 8 | 1 | 5 | 2 | 38 |
| monk |  | 19 | 2 | 9 | 3 |  | 2 | 18 | 53 |
| necromancer |  | 6 | 4 | 3 | 7 | 1 | 6 | 14 | 41 |
| oracle |  | 6 | 6 |  | 10 |  | 4 | 4 | 30 |
| psychic |  | 5 | 1 | 1 | 21 |  | 1 | 6 | 35 |
| ranger |  | 5 | 10 | 5 |  | 4 | 13 | 16 | 53 |
| rogue |  | 20 | 3 | 9 | 3 |  | 2 | 16 | 53 |
| runesmith |  | 11 | 12 | 1 |  | 2 | 6 | 10 | 42 |
| sorcerer |  | 1 | 1 | 6 | 23 | 1 | 7 | 11 | 50 |
| summoner |  |  |  |  | 1 | 42 | 4 |  | 47 |
| swashbuckler |  | 13 | 5 | 4 |  |  |  | 7 | 29 |
| thaumaturge |  | 7 | 8 | 2 | 1 | 1 | 5 | 10 | 34 |
| witch |  | 1 | 2 | 2 | 4 | 16 | 7 | 3 | 35 |
| wizard |  | 2 |  | 1 | 14 | 4 | 10 | 6 | 37 |
| archetype | 146 | 257 | 43 | 197 | 95 | 64 | 147 | 440 | 1389 |
| other | 11 | 48 | 2 | 39 | 16 | 13 | 25 | 33 | 187 |

## Why the simulator doesn't play the ones with a plan

| Reason | Count |
|---|---:|
| a Strike with nothing more the simulator reads | 79 |
| a timer with no rules a fight counts | 79 |
| a plan the engine can't play | 72 |
| a spell the engine doesn't cast | 58 |
| its requirement | 45 |
| a roll whose results the simulator doesn't read | 40 |
| a teleport | 38 |
| an Effect with nothing a fight counts | 37 |
| a passive's roll with no action to use it | 27 |
| it grants one of 2 | 20 |
| its text has no Strike of its user's | 19 |
| a spell the feat casts | 18 |
| a passive's Effect posted by hand | 18 |
| its Effect has nothing a fight counts | 17 |
| a passive's Effect on other creatures | 15 |
| a reaction to "passive" | 13 |
| it grants Additional Lore: the feat module reads nothing for it | 12 |
| its stance | 9 |
| its requirement, which the PC doesn't meet | 8 |
| a reaction's Strike | 8 |
| a lasting area | 7 |
| it grants Cast a Spell: the feat module reads nothing for it | 5 |
| a passive's Strike | 5 |
| a reroll | 5 |
| it grants Pet: the feat module reads nothing for it | 5 |
| a choice of ways the simulator doesn't play | 4 |
| it grants Verdant Core Deviant Classification: the feat module reads nothing for it | 4 |
| an Effect on another creature | 4 |
| a Focus or Mythic Point back | 4 |
| it grants Domain Initiate: the feat module reads nothing for it | 4 |
| it grants one of 3 | 3 |
| it grants Alchemical Crafting: the feat module reads nothing for it | 3 |
| it grants Leech Deviant Classification: the feat module reads nothing for it | 3 |
| nothing a fight uses | 3 |
| a companion's Strike | 3 |
| it grants Enhanced Familiar: the feat module reads nothing for it | 2 |
| it grants Hunt Prey: nothing a fight uses | 2 |
| it grants Underwater Marauder: the feat module reads nothing for it | 2 |
| it grants Snare Crafting: the feat module reads nothing for it | 2 |
| a roll twice | 2 |
| it grants Dragon Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Wraith Deviant Classification: the feat module reads nothing for it | 2 |
| it grants Blight Soul Deviant Classification: the feat module reads nothing for it | 2 |
| a reaction to "aura" | 2 |
| it grants Terrain Stalker: the feat module reads nothing for it | 2 |
| it grants Conceal Spell: the feat module reads nothing for it | 2 |
| it grants Lie to Me: the feat module reads nothing for it | 1 |
| it grants Assume a Role: the feat module reads nothing for it | 1 |
| it grants Mark for Death: the feat module reads nothing for it | 1 |
| it grants Bullet Dancer Stance: the feat module reads nothing for it | 1 |
| it grants Upstage: a plan the engine can't play | 1 |
| it grants Deity | 1 |
| it grants Tactics: the feat module reads nothing for it | 1 |
| it grants Infiltrator's Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Expel Maelstrom: a roll whose results the simulator doesn't read | 1 |
| it grants Influence Rumor: the feat module reads nothing for it | 1 |
| it grants Set Explosives: the feat module reads nothing for it | 1 |
| it grants Quick Draw: a Strike with nothing more the simulator reads | 1 |
| it grants Experienced Tracker: the feat module reads nothing for it | 1 |
| it grants Divine Spark and Ikons: the feat module reads nothing for it | 1 |
| it grants Spread Propaganda: the feat module reads nothing for it | 1 |
| it grants Spin Tale: an Effect with nothing a fight counts | 1 |
| it grants Taunt: an Effect with nothing a fight counts | 1 |
| it grants Avoid Dire Fate: the feat module reads nothing for it | 1 |
| it grants Favored Terrain: the feat module reads nothing for it | 1 |
| it grants Inventor: the feat module reads nothing for it | 1 |
| it grants On the Case: the feat module reads nothing for it | 1 |
| it grants Juggle: a timer with no rules a fight counts | 1 |
| it grants Multilingual: the feat module reads nothing for it | 1 |
| it grants Entity's Resurgence: a plan the engine can't play | 1 |
| it grants Engineer's Efficiency: the feat module reads nothing for it | 1 |
| it grants Binding Vow: the feat module reads nothing for it | 1 |
| it grants Mystic Aegis: the feat module reads nothing for it | 1 |
| it grants Bond with Spirit: nothing a fight uses | 1 |
| it grants Solitary Invocation: the feat module reads nothing for it | 1 |
| it grants Trick Magic Item: the feat module reads nothing for it | 1 |
| it grants Cobble Together: the feat module reads nothing for it | 1 |
| it grants Witch's Charge: the feat module reads nothing for it | 1 |
| it grants Qi Spells: the feat module reads nothing for it | 1 |
| it grants Eidolon: the feat module reads nothing for it | 1 |
| it grants Slayer's Identification: the feat module reads nothing for it | 1 |
| it grants Accidental Shot: its text has no Strike of its user's | 1 |
| it grants Rouse the World: a timer with no rules a fight counts | 1 |
| it grants Titan Wrestler: the feat module reads nothing for it | 1 |
| it grants Size Up: an Effect with nothing a fight counts | 1 |
| it grants Cycle Elemental Stance: a teleport | 1 |
| it grants Recognize Spell: the feat module reads nothing for it | 1 |
| it grants Bless Ally: an Effect with nothing a fight counts | 1 |
| it grants Royal Grace: the feat module reads nothing for it | 1 |
| it grants Sidestep Through Time: a plan the engine can't play | 1 |
| it grants Call Warshard Weapon: the feat module reads nothing for it | 1 |
| it grants Once Bitten: the feat module reads nothing for it | 1 |
| it grants Absorb into the Aegis: the feat module reads nothing for it | 1 |
| a target the simulator can't tell | 1 |
| a free's Strike | 1 |
| it grants Flicker Deviant Classification: the feat module reads nothing for it | 1 |
| it grants Restore the Moment: a reaction's Strike | 1 |
| it grants Speed of Arms: a reaction's Strike | 1 |
| effects the GM allows from the scenery | 1 |
| it grants Base Kinesis: the feat module reads nothing for it | 1 |
| it grants Rage: its requirement | 1 |
| it grants Devise a Stratagem: its text has no Strike of its user's | 1 |
| it grants one of 6 | 1 |
| it grants Trace Rune: a timer with no rules a fight counts | 1 |
| it grants Unravel the Future: the feat module reads nothing for it | 1 |
| it grants Blinding of the Needle: a Strike with nothing more the simulator reads | 1 |
| it grants Coiling Serpents: a Strike with nothing more the simulator reads | 1 |
| it grants Sever Four Dragonfly Wings: a Strike with nothing more the simulator reads | 1 |
| it grants Tangle in Riddle: the feat module reads nothing for it | 1 |
| it grants Brandish the Gorgon's Gaze: the feat module reads nothing for it | 1 |
| it grants Mark the Center: a timer with no rules a fight counts | 1 |
| it grants Spasm of the Berserker: a timer with no rules a fight counts | 1 |
| it grants Only You and I: its text has no Strike of its user's | 1 |
| it grants Heaven Rains an Ending: a Strike with nothing more the simulator reads | 1 |
| it grants Shed the Mortal Skin: a timer with no rules a fight counts | 1 |
| it grants Plant Thirty Barbs: a Strike with nothing more the simulator reads | 1 |
| it grants Break the Sun's Legs: a timer with no rules a fight counts | 1 |
| it grants Pacifying Infusion: the feat module reads nothing for it | 1 |
| a reaction to "hit-by" | 1 |
| it grants Quick Squeeze: the feat module reads nothing for it | 1 |
| it grants Guerrilla Assault: a Strike with nothing more the simulator reads | 1 |
| it grants Improvised Repair: the feat module reads nothing for it | 1 |
| it grants Liberate Self: its Effect has nothing a fight counts | 1 |
| it grants Pirate Dedication: the feat module reads nothing for it | 1 |
| it grants Inevitable Return: the feat module reads nothing for it | 1 |
| it grants Jumping Jenny: a timer with no rules a fight counts | 1 |
| it grants Dancing Dodge: the feat module reads nothing for it | 1 |
| it grants Unimpeded Journey: the feat module reads nothing for it | 1 |
| it grants Swift Choreography: the feat module reads nothing for it | 1 |
| it grants Objection: the feat module reads nothing for it | 1 |
| it grants Set Free: its Effect has nothing a fight counts | 1 |
| it grants Aegis of Envy: a timer with no rules a fight counts | 1 |
| it grants Sorshen's Devotion: a plan the engine can't play | 1 |
| it grants Host of Wrath: a timer with no rules a fight counts | 1 |
| it grants Makes Me Stronger: the feat module reads nothing for it | 1 |
| it grants Share Death's Promises: a timer with no rules a fight counts | 1 |
| it grants Enter Runewell: the feat module reads nothing for it | 1 |
| it grants Draw From the Pages: the feat module reads nothing for it | 1 |
| it grants Create Familiar Fulu: nothing a fight uses | 1 |
| it grants Lay Down Arms: the feat module reads nothing for it | 1 |
| it grants Magical Crafting: the feat module reads nothing for it | 1 |
| it grants Call Gun: the feat module reads nothing for it | 1 |
| it grants Arcane Bond: the feat module reads nothing for it | 1 |
| it grants Pitch-Perfect Projection: the feat module reads nothing for it | 1 |
| it grants Automatic Knowledge: the feat module reads nothing for it | 1 |
| it grants A Challenge for Heroes: an Effect with nothing a fight counts | 1 |
| it grants Quick Alchemy: nothing a fight uses | 1 |
| it grants Summon Sloth: the feat module reads nothing for it | 1 |
| it grants Call to Hand: nothing a fight uses | 1 |
| it grants Inspired Stratagem: a plan the engine can't play | 1 |
| it grants Magical Shorthand: the feat module reads nothing for it | 1 |
| it grants Command Undead: a roll whose results the simulator doesn't read | 1 |
| it grants Coughing Dragon: nothing a fight uses | 1 |
| it grants Crescent Spray: its text has no Strike of its user's | 1 |
| it grants one of 10 | 1 |
| it grants Remove Head: the feat module reads nothing for it | 1 |
| it grants Monastic Weaponry: the feat module reads nothing for it | 1 |
| it grants Spell-Woven Shot: a Strike with nothing more the simulator reads | 1 |
| it grants Drape Ambient Magic: its text has no Strike of its user's | 1 |
| it grants Keen Recollection: the feat module reads nothing for it | 1 |
| it grants Slippery Secrets: the feat module reads nothing for it | 1 |
| it grants Transform Ammunition: the feat module reads nothing for it | 1 |
| it grants Entreat Pact: its Effect has nothing a fight counts | 1 |
| it grants Devour Ambient Magic: nothing a fight uses | 1 |
| it grants Banshee Cry: a roll whose results the simulator doesn't read | 1 |
| it grants Disarming Interception: a plan the engine can't play | 1 |
| it grants Impromptu Investment: the feat module reads nothing for it | 1 |
| it grants Fey Jump: a teleport | 1 |
| it grants Geomancer Dedication: the feat module reads nothing for it | 1 |
| it grants Greater Field Discovery | 1 |
| it grants Forced Pact: a roll whose results the simulator doesn't read | 1 |
| it grants Lengthy Diversion: the feat module reads nothing for it | 1 |
| it grants Battle Medicine: the feat module reads nothing for it | 1 |
| it grants Verdant Rest: the feat module reads nothing for it | 1 |
| it grants Legendary Negotiation: the feat module reads nothing for it | 1 |
| it grants Weaponsight: an Effect with nothing a fight counts | 1 |
| it grants Water Transfer: a teleport | 1 |
| it grants Intercession Spell: the feat module reads nothing for it | 1 |
| it grants Incredible Investiture: the feat module reads nothing for it | 1 |

## Archetype dedications (grant class features) (157)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Acrobat Dedication | 2 | archetype | passive | no plan |  |
| Alchemist Dedication | 2 | archetype | passive | plan | it grants one of 2 (Quick Alchemy: nothing a fight uses; Alchemical Crafting: the feat module reads nothing for it) |
| Aldori Duelist Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Alkenstar Agent Dedication | 2 | archetype | passive | plan | it grants Lie to Me: the feat module reads nothing for it |
| Alter Ego Dedication | 2 | archetype | passive | plan | it grants Assume a Role: the feat module reads nothing for it |
| Archaeologist Dedication | 2 | archetype | passive | no plan |  |
| Archer Dedication | 2 | archetype | passive | no plan |  |
| Artillerist Dedication | 2 | archetype | passive | no plan |  |
| Assassin Dedication | 2 | archetype | passive | plan | it grants Mark for Death: the feat module reads nothing for it |
| Blackjacket Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Bounty Hunter Dedication | 2 | archetype | passive | plan | it grants one of 2 (Hunt Prey: nothing a fight uses; Monster Hunter: the feat module reads nothing for it) |
| Bright Lion Dedication | 2 | archetype | passive | no plan |  |
| Bullet Dancer Dedication | 2 | archetype | passive | plan | it grants Bullet Dancer Stance: the feat module reads nothing for it |
| Captain Dedication | 2 | archetype | passive | plan | it grants one of 2 (Group Coercion: the feat module reads nothing for it; Group Impression: the feat module reads nothin |
| Celebrity Dedication | 2 | archetype | passive | plan | it grants Upstage: a plan the engine can't play (its targeting or what it does) |
| Champion Dedication | 2 | archetype | passive | plan | it grants Deity (Champion): the feat module reads nothing for it |
| Chelaxian Scion Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Chronoskimmer Dedication | 2 | archetype | passive | no plan |  |
| Clockwork Reanimator Dedication | 2 | archetype | passive | no plan |  |
| Commander Dedication | 2 | archetype | passive | plan | it grants Tactics: the feat module reads nothing for it |
| Corpse Tender Dedication | 2 | archetype | passive | no plan |  |
| Crossbow Infiltrator Dedication | 2 | archetype | passive | plan | it grants Infiltrator's Draw: a Strike with nothing more the simulator reads |
| Curse Maelstrom Dedication | 2 | archetype | passive | plan | it grants Expel Maelstrom: a roll whose results the simulator doesn't read |
| Dandy Dedication | 2 | archetype | passive | plan | it grants Influence Rumor: the feat module reads nothing for it |
| Demolitionist Dedication | 2 | archetype | passive | plan | it grants Set Explosives: the feat module reads nothing for it |
| Draconic Acolyte Dedication | 2 | archetype | passive | plan | it grants one of 3 (Additional Lore: the feat module reads nothing for it; Channel Draconic Essence: the feat module rea |
| Duelist Dedication | 2 | archetype | passive | plan | it grants Quick Draw: a Strike with nothing more the simulator reads |
| Eagle Knight Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Edgewatch Detective Dedication | 2 | archetype | passive | plan | it grants Experienced Tracker: the feat module reads nothing for it |
| Exemplar Dedication | 2 | archetype | passive | plan | it grants Divine Spark and Ikons: the feat module reads nothing for it |
| Familiar Master Dedication | 2 | archetype | passive | plan | it grants Enhanced Familiar: the feat module reads nothing for it |
| Fan Dancer Dedication | 2 | archetype | passive | no plan |  |
| Field Propagandist Dedication | 2 | archetype | passive | plan | it grants Spread Propaganda: the feat module reads nothing for it |
| Fighter Dedication | 2 | archetype | passive | no plan |  |
| Flexible Spellcaster Dedication | 2 | archetype | passive | no plan |  |
| Folklorist Dedication | 2 | archetype | passive | plan | it grants Spin Tale: an Effect with nothing a fight counts |
| Game Hunter Dedication | 2 | archetype | passive | plan | it grants Hunt Prey: nothing a fight uses |
| Geomancer Dedication | 2 | archetype | passive | no plan |  |
| Guardian Dedication | 2 | archetype | passive | plan | it grants Taunt: an Effect with nothing a fight counts |
| Guerrilla Dedication | 2 | archetype | passive | no plan |  |
| Gunslinger Dedication | 2 | archetype | passive | no plan |  |
| Harrower Dedication | 2 | archetype | passive | plan | it grants Avoid Dire Fate: the feat module reads nothing for it |
| Hedge Mage Dedication | 2 | archetype | passive | plan | it grants Cast a Spell: the feat module reads nothing for it |
| Hellbreaker Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Herbalist Dedication | 2 | archetype | passive | plan | it grants Alchemical Crafting: the feat module reads nothing for it |
| Horizon Walker Dedication | 2 | archetype | passive | plan | it grants Favored Terrain: the feat module reads nothing for it |
| Inventor Dedication | 2 | archetype | passive | plan | it grants Inventor: the feat module reads nothing for it |
| Investigator Dedication | 2 | archetype | passive | plan | it grants On the Case: the feat module reads nothing for it |
| Iridian Choirmaster Dedication | 2 | archetype | passive | no plan |  |
| Juggler Dedication | 2 | archetype | passive | plan | it grants Juggle: a timer with no rules a fight counts |
| Kitharodian Actor Dedication | 2 | archetype | passive | no plan |  |
| Lepidstadt Surgeon Dedication | 2 | archetype | passive | no plan |  |
| Linguist Dedication | 2 | archetype | passive | plan | it grants Multilingual: the feat module reads nothing for it |
| Lion Blade Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Living Monolith Dedication | 2 | archetype | passive | no plan |  |
| Living Vessel Dedication | 2 | archetype | passive | plan | it grants Entity's Resurgence: a plan the engine can't play (its targeting or what it does) |
| Loremaster Dedication | 2 | archetype | passive | no plan |  |
| Marine Marauder Dedication | 2 | archetype | passive | plan | it grants Underwater Marauder: the feat module reads nothing for it |
| Mauler Dedication | 2 | archetype | passive | no plan |  |
| Medic Dedication | 2 | archetype | passive | no plan |  |
| Midnight Illusionist Dedication | 2 | archetype | passive | no plan |  |
| Mind Smith Dedication | 2 | archetype | passive | no plan |  |
| Munitions Master Dedication | 2 | archetype | passive | plan | it grants Engineer's Efficiency: the feat module reads nothing for it |
| Nidalese Horselord Dedication | 2 | archetype | passive | no plan |  |
| Oatia Skysage Dedication | 2 | archetype | passive | no plan |  |
| Pactbinder Dedication | 2 | archetype | passive | plan | it grants Binding Vow: the feat module reads nothing for it |
| Palatine Detective Dedication | 2 | archetype | passive | plan | it grants Mystic Aegis: the feat module reads nothing for it |
| Pathfinder Agent Dedication | 2 | archetype | passive | no plan |  |
| Poisoner Dedication | 2 | archetype | passive | plan | it grants Alchemical Crafting: the feat module reads nothing for it |
| Psychic Dedication | 2 | archetype | passive | no plan |  |
| Ranger Dedication | 2 | archetype | passive | plan | it grants Hunt Prey: nothing a fight uses |
| Razmiran Priest Dedication | 2 | archetype | passive | no plan |  |
| Reanimator Dedication | 2 | archetype | passive | no plan |  |
| Red Mantis Assassin Dedication | 2 | archetype | passive | no plan |  |
| Rivethun Emissary Dedication | 2 | archetype | passive | plan | it grants Bond with Spirit: nothing a fight uses |
| Rose Warden Dedication | 2 | archetype | passive | no plan |  |
| Runelord Dedication | 2 | archetype | passive | no plan |  |
| Runesmith Dedication | 2 | archetype | passive | plan | it grants Solitary Invocation: the feat module reads nothing for it |
| Scout Dedication | 2 | archetype | passive | no plan |  |
| Scroll Trickster Dedication | 2 | archetype | passive | plan | it grants Trick Magic Item: the feat module reads nothing for it |
| Scrounger Dedication | 2 | archetype | passive | plan | it grants Cobble Together: the feat module reads nothing for it |
| Seneschal Witch Dedication | 2 | archetype | passive | plan | it grants Witch's Charge: the feat module reads nothing for it |
| Sentinel Dedication | 2 | archetype | passive | no plan |  |
| Shieldmarshal Dedication | 2 | archetype | passive | plan | it grants one of 2 (Courtly Graces: the feat module reads nothing for it; Streetwise: the feat module reads nothing for  |
| Sister of the Golden Erinys Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Snarecrafter Dedication | 2 | archetype | passive | plan | it grants Snare Crafting: the feat module reads nothing for it |
| Sniping Duo Dedication | 2 | archetype | passive | no plan |  |
| Soulforger Dedication | 2 | archetype | passive | plan | a passive's Strike |
| Spell Trickster Dedication | 2 | archetype | passive | no plan |  |
| Spellshifter Dedication | 2 | archetype | passive | plan | it grants one of 2 (Shift Spell: the feat module reads nothing for it; Shift Spell: the feat module reads nothing for it |
| Staff Acrobat Dedication | 2 | archetype | passive | no plan |  |
| Starstone Aspirant Dedication | 2 | archetype | passive | plan | its Effect has nothing a fight counts |
| Student of Perfection Dedication | 2 | archetype | passive | plan | it grants Qi Spells: the feat module reads nothing for it |
| Summoner Dedication | 2 | archetype | passive | plan | it grants Eidolon: the feat module reads nothing for it |
| Swashbuckler Dedication | 2 | archetype | passive | plan | it grants one of 2 (Panache: the feat module reads nothing for it; Stylish Combatant: the feat module reads nothing for  |
| Talisman Dabbler Dedication | 2 | archetype | passive | no plan |  |
| Tattooed Historian Dedication | 2 | archetype | passive | no plan |  |
| Trick Driver Dedication | 2 | archetype | passive | no plan |  |
| Turpin Rowe Lumberjack Dedication | 2 | archetype | passive | no plan |  |
| Twilight Speaker Dedication | 2 | archetype | passive | no plan |  |
| Undead Slayer Dedication | 2 | archetype | passive | plan | it grants Slayer's Identification: the feat module reads nothing for it |
| Undersea Privateer Dedication | 2 | archetype | passive | plan | it grants Underwater Marauder: the feat module reads nothing for it |
| Unexpected Sharpshooter Dedication | 2 | archetype | passive | plan | it grants Accidental Shot: its text has no Strike of its user's |
| Vehicle Mechanic Dedication | 2 | archetype | passive | no plan |  |
| Verduran Shadow Dedication | 2 | archetype | passive | no plan |  |
| Vigilante Dedication | 2 | archetype | passive | no plan |  |
| Viking Dedication | 2 | archetype | passive | no plan |  |
| Vindicator Dedication | 2 | archetype | passive | no plan |  |
| Wandering Chef Dedication | 2 | archetype | passive | plan | it grants one of 2 (Quick Alchemy: nothing a fight uses; Alchemical Crafting: the feat module reads nothing for it) |
| War Mage Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Warrior of Legend Dedication | 2 | archetype | passive | no plan |  |
| Weapon Improviser Dedication | 2 | archetype | passive | no plan |  |
| Wellspring Mage Dedication | 2 | archetype | passive | no plan |  |
| Wild Mimic Dedication | 2 | archetype | passive | no plan |  |
| Winged Warrior Dedication | 2 | archetype | passive | no plan |  |
| World Rouser Dedication | 2 | archetype | passive | plan | it grants Rouse the World: a timer with no rules a fight counts |
| Wrestler Dedication | 2 | archetype | passive | plan | it grants Titan Wrestler: the feat module reads nothing for it |
| Wylderheart Dedication | 2 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Zephyr Guard Dedication | 2 | archetype | passive | no plan |  |
| Butterfly Blade Dedication | 4 | archetype | passive | no plan |  |
| Exorcist Dedication | 4 | archetype | passive | plan | it grants one of 2 (Spirit's Mercy: a plan the engine can't play (its targeting or what it does); Collect Spirit Remnant |
| Familiar Sage Dedication | 4 | archetype | passive | plan | it grants Enhanced Familiar: the feat module reads nothing for it |
| Firebrand Braggart Dedication | 4 | archetype | 1 action | no plan |  |
| Golden Legionnaire Dedication | 4 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Psychic Duelist Dedication | 4 | archetype | passive | no plan |  |
| Ritualist Dedication | 4 | archetype | passive | no plan |  |
| Scion of Domora Dedication | 4 | archetype | passive | no plan |  |
| Steel Falcon Dedication | 4 | archetype | passive | plan | it grants Size Up: an Effect with nothing a fight counts |
| Trapsmith Dedication | 4 | archetype | passive | no plan |  |
| Twilight Talon Dedication | 4 | archetype | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Venture-Gossip Dedication | 4 | archetype | passive | no plan |  |
| Five-Breath Vanguard Dedication | 6 | archetype | passive | plan | it grants Cycle Elemental Stance: a teleport |
| Halcyon Speaker Dedication | 6 | archetype | passive | no plan |  |
| Knight Reclaimant Dedication | 6 | archetype | passive | no plan |  |
| Knight Vigilant Dedication | 6 | archetype | passive | no plan |  |
| Necrologist Dedication | 6 | archetype | passive | plan | it grants one of 2 (Mobbing Assault: the feat module reads nothing for it; Raise the Horde: a timer with no rules a figh |
| Pure Legion Enforcer Dedication | 6 | archetype | passive | plan | it grants Recognize Spell: the feat module reads nothing for it |
| Scrollmaster Dedication | 6 | archetype | passive | no plan |  |
| Spellmaster Dedication | 6 | archetype | passive | no plan |  |
| Swordmaster Dedication | 6 | archetype | passive | no plan |  |
| Time Mage Dedication | 6 | archetype | passive | plan | a spell the engine doesn't cast (Delay Consequence) |
| Golden League Xun Dedication | 8 | archetype | passive | no plan |  |
| Shadowdancer Dedication | 8 | archetype | passive | no plan |  |
| Provocator Dedication | 10 | archetype | passive | no plan |  |
| Sixth Pillar Dedication | 10 | archetype | passive | no plan |  |
| Lich Dedication | 12 | archetype | passive | no plan |  |
| Sanguimancer Dedication | 2 | other | passive | no plan |  |
| Apocalypse Rider Dedication | 12 | other | passive | no plan |  |
| Ascended Celestial Dedication | 12 | other | passive | plan | it grants Bless Ally: an Effect with nothing a fight counts |
| Beast Lord Dedication | 12 | other | passive | no plan |  |
| Eternal Legend Dedication | 12 | other | passive | no plan |  |
| Godling Dedication | 12 | other | passive | no plan |  |
| Heroic Scion Dedication | 12 | other | passive | plan | it grants one of 2 (Flash of Memory: the feat module reads nothing for it; Additional Lore: the feat module reads nothin |
| Prophesied Monarch Dedication | 12 | other | passive | plan | it grants Royal Grace: the feat module reads nothing for it |
| Timewracked Dedication | 12 | other | passive | plan | it grants Sidestep Through Time: a plan the engine can't play (its targeting or what it does) |
| Warshard Warrior Dedication | 12 | other | passive | plan | it grants Call Warshard Weapon: the feat module reads nothing for it |
| Wildspell Dedication | 12 | other | passive | plan | a spell the engine doesn't cast (Spellsurge) |

## Combat actions and reactions (558)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Quick Bomber | 1 | alchemist | 1 action | plan | a Strike with nothing more the simulator reads |
| Retaliatory Cleansing | 8 | alchemist | reaction | no plan |  |
| Astonishing Explosion | 20 | alchemist | free | plan | a plan the engine can't play (its targeting or what it does) |
| Plum Deluge | 20 | alchemist | 3 actions | no plan |  |
| Relinquish Control | 1 | animist | free | no plan |  |
| Shadows Within Shadows | 12 | animist | reaction | no plan |  |
| Banish Falsehoods of Flesh | 14 | animist | 1 action | no plan |  |
| Cycle of Souls | 18 | animist | free | plan | a teleport |
| Powder Punch Stance | 2 | archetype | 1 action | plan | its text has no Strike of its user's |
| Spectral Dagger | 2 | archetype | 1 action | no plan |  |
| Anchor Stance | 4 | archetype | 1 action | no plan |  |
| Aquatic Pirouette | 4 | archetype | reaction | no plan |  |
| Belay That! | 4 | archetype | reaction | no plan |  |
| Bless Shield | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Contingency Leap | 4 | archetype | reaction | no plan |  |
| Devrin's Cunning Stance | 4 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Disarming Block | 4 | archetype | free | no plan |  |
| Disengaging Twist | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Doctor's Visitation | 4 | archetype | 1 action | plan | a teleport |
| Dread Marshal Stance | 4 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Elbow Breaker | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Focused Fire | 4 | archetype | 1 action | no plan |  |
| For the Fallen! | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Ghost Blade | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Heaven's Step Offense | 4 | archetype | reaction | no plan |  |
| Heroic Defiance | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Hurling Charge | 4 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| In Lightning, Life | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Lassoing Lash | 4 | archetype | 1 action | plan | its requirement (The target can't be more than one size larger than you) |
| Lesson of the Broken Wing | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Lesson of the Circling Gale | 4 | archetype | 1 action | plan | a teleport |
| Log Roll | 4 | archetype | 1 action | plan | its requirement (You and an adjacent creature are both on a narrow surface or uneven ground and the other creature is of |
| Nature's Embrace | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Never Tire | 4 | archetype | reaction | plan | a timer with no rules a fight counts |
| Patronize the Arts | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Play to the Crowd | 4 | archetype | reaction | no plan |  |
| Quick Shot | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Reach Beyond | 4 | archetype | 1 action | no plan |  |
| Reflexive Catch | 4 | archetype | reaction | no plan |  |
| Semblance of Life | 4 | archetype | free | plan | a spell the feat casts |
| Soul Flare | 4 | archetype | reaction | no plan |  |
| Spot Translate | 4 | archetype | reaction | no plan |  |
| Strategist Stance | 4 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Such a Disgrace! | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Swift Leap | 4 | archetype | 1 action | plan | a teleport |
| Tut-Tut | 4 | archetype | free | no plan |  |
| You're an Embarrassment! | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Antler Rush | 6 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Battlefield Agility | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Bear Hug (Werecreature) | 6 | archetype | 2 actions | plan | its requirement (You're in bear or hybrid shape, and your last action was a successful claw Strike.) |
| Betraying Shank | 6 | archetype | 1 action | plan | its requirement (You are within melee reach of a target, but it is not in combat with you.) |
| Boaster's Challenge | 6 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Commitment to Liberty | 6 | archetype | 2 actions | plan | its requirement (A creature has an ally Grabbed or Restrained.) |
| Disarming Smile | 6 | archetype | reaction | plan | its requirement (You are aware of the attacker, the attacker is an intelligent humanoid creature, and you have not attem |
| Discerning Strike | 6 | archetype | 1 action | plan | its requirement (You have successfully identified the target with @UUID[Compendium.pf2e.actionspf2e.Item.Recall Knowledg |
| Ensnaring Disarm | 6 | archetype | free | no plan |  |
| Feeling Your Oats | 6 | archetype | 1 action | no plan |  |
| Feverish Enzymes | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Fortune's Favor | 6 | archetype | free | no plan |  |
| Frightful Condemnation | 6 | archetype | free | no plan |  |
| Ghost Strike | 6 | archetype | 2 actions | no plan |  |
| Hey! Over Here! | 6 | archetype | reaction | plan | its Effect has nothing a fight counts |
| Hindquarter Kick | 6 | archetype | 1 action | plan | its requirement (You are in claw stance and have Grabbed a creature.) |
| Infiltrator's Reload | 6 | archetype | 1 action | no plan |  |
| Infused with Belkzen's Might | 6 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Keep Pace | 6 | archetype | reaction | plan | a teleport |
| Leverage Anguish | 6 | archetype | reaction | no plan |  |
| Opportune Trickster | 6 | archetype | reaction | plan | its requirement (You're adjacent to both your ally and the creature) |
| Poison Coat | 6 | archetype | reaction | plan | it grants Once Bitten: the feat module reads nothing for it |
| Practiced Opposition | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Reloading Trick | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Repulse the Wicked | 6 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Rushing Boar | 6 | archetype | reaction | no plan |  |
| Shark Attack | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Sheltering Hand | 6 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Spiral Sworn | 6 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Startling Appearance (Vigilante) | 6 | archetype | 1 action | plan | its requirement (You are completely unnoticed by the target creature.) |
| Sundown Street Posturing | 6 | archetype | 1 action | no plan |  |
| Sweeping Fan Block | 6 | archetype | reaction | no plan |  |
| Swift Intervention | 6 | archetype | reaction | no plan |  |
| Sword-Light Wave | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Targeted Redirection | 6 | archetype | 1 action | plan | its text has no Strike of its user's |
| Unbalancing Appearance | 6 | archetype | 1 action | plan | its requirement (A creature within your reach is Off-Guard to you, and you are Unnoticed by that creature.) |
| Unfettering Strike | 6 | archetype | 1 action | plan | its requirement (A creature within your reach has an ally Grabbed or Restrained.) |
| Unnerving Prowess | 6 | archetype | free | no plan |  |
| Vacate Vision | 6 | archetype | reaction | no plan |  |
| Verduran Ambush | 6 | archetype | 3 actions | plan | a timer with no rules a fight counts |
| Vision of Foresight | 6 | archetype | 1 action | plan | its Effect has nothing a fight counts |
| Warp Path | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Watch This! | 6 | archetype | reaction | no plan |  |
| Wounded Party | 6 | archetype | reaction | no plan |  |
| A Little Bird Told Me... | 8 | archetype | 2 actions | no plan |  |
| Archaeologist's Luck | 8 | archetype | free | plan | a reroll |
| Armored Rebuff | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Bolster Ally | 8 | archetype | reaction | plan | its Effect has nothing a fight counts |
| Commitment to Valor | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Cornered Animal | 8 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Counter Curse | 8 | archetype | reaction | no plan |  |
| Death from Above | 8 | archetype | 2 actions | plan | its requirement (You are standing, climbing, or balancing on a surface at least 10 feet above your target) |
| Dismal Harvest | 8 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Drive Back | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Feline Dance | 8 | archetype | reaction | plan | a roll twice |
| Fine Print | 8 | archetype | free | plan | an Effect with nothing a fight counts |
| Gardener's Resolve | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Ghost Flight | 8 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Guardian's Embrace | 8 | archetype | 1 action | plan | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Hot Foot | 8 | archetype | 1 action | no plan |  |
| Invoke Defense | 8 | archetype | 1 action | no plan |  |
| Lesson of Sympathetic Vulnerability | 8 | archetype | 1 action | no plan |  |
| Lobbed Attack | 8 | archetype | 1 action | plan | its requirement, which the PC doesn't meet (You are Juggling a thrown weapon.) |
| Makeshift Strike | 8 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Metabolize Element | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Nothing Personal | 8 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Opportunistic Grapple | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Piercing Doom | 8 | archetype | 2 actions | plan | its requirement (You are Doomed 2 or greater.) |
| Pluck from the Sky | 8 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Pressure Change | 8 | archetype | 1 action | plan | its requirement (You have a swim Speed, are underwater, and have a creature Grabbed or Restrained) |
| Quick Positioning | 8 | archetype | free | plan | a teleport |
| Reactive Resilience | 8 | archetype | reaction | no plan |  |
| Riptide (Undersea Privateer) | 8 | archetype | 1 action | plan | its requirement (You're in Anchor Stance, and your target is within 5 feet of the edge of a water vehicle or already in  |
| Rule of Three | 8 | archetype | reaction | no plan |  |
| Shamble | 8 | archetype | 2 actions | plan | a teleport |
| Shoving Sweep | 8 | archetype | reaction | no plan |  |
| Show-Off | 8 | archetype | free | no plan |  |
| Skyseeker | 8 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Slurp Up | 8 | archetype | 1 action | no plan |  |
| Soul Well | 8 | archetype | 2 actions | no plan |  |
| Statement Strut | 8 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Statue | 8 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Stay Here! | 8 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Superimpose Time Duplicates | 8 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Swap Reflections | 8 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Tight Follower | 8 | archetype | reaction | plan | a teleport |
| To Battle! | 8 | archetype | 2 actions | no plan |  |
| Tumbling Strike | 8 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Twirling Strike | 8 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Wake and Tremble | 8 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Work Yourself Up | 8 | archetype | 2 actions | no plan |  |
| A Hush Falls Over the World | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Aerial Piledriver | 10 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Battlefront Sabotage | 10 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Big Debut | 10 | archetype | free | no plan |  |
| Black Powder Flash | 10 | archetype | 2 actions | plan | its stance (Powder Punch Stance): its text has no Strike of its user's |
| Bloom Cabaret Entrance | 10 | archetype | free | no plan |  |
| Bullet Dancer Reload | 10 | archetype | 1 action | plan | its stance (Bullet Dancer Stance): the feat module reads nothing for it |
| Burrowing Shot | 10 | archetype | 1 action | no plan |  |
| Clarify Hellfire | 10 | archetype | 1 action | no plan |  |
| Command Attention | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Defy Sorrow | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Dispute Terms | 10 | archetype | free | no plan |  |
| Dizzying Spin Dance | 10 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Ensnaring Wrappings | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Everyone Duck! | 10 | archetype | reaction | no plan |  |
| Fading | 10 | archetype | reaction | no plan |  |
| Falcon Swoop | 10 | archetype | 2 actions | plan | its requirement (You currently have a fly Speed.) |
| Feral Scramble | 10 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Fluttering Distraction | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Form Up! | 10 | archetype | 2 actions | no plan |  |
| Hematocritical | 10 | archetype | free | plan | a roll twice |
| I Meant to do That | 10 | archetype | 1 action | no plan |  |
| Interstitial Escape | 10 | archetype | reaction | no plan |  |
| Invigorating Breath | 10 | archetype | 1 action | plan | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Klingegeist | 10 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Lead the Way | 10 | archetype | 2 actions | plan | a teleport |
| Mockingbird's Disarm | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Null Field | 10 | archetype | 1 action | no plan |  |
| Open the Blazing Eye | 10 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Pass Through | 10 | archetype | 3 actions | plan | a teleport |
| Rain-Scribe Mobility | 10 | archetype | 2 actions | no plan |  |
| Reactive Charm | 10 | archetype | reaction | no plan |  |
| Reel 'Em In | 10 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Scout's Pounce | 10 | archetype | 2 actions | plan | its requirement (You are Hidden from or Undetected by all of your opponents, and you aren't within 10 feet of any enemy. |
| Seize Advantage | 10 | archetype | reaction | plan | a teleport |
| Shattering Strike (Weapon Improviser) | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Silent Sting | 10 | archetype | reaction | no plan |  |
| Spear of Doom | 10 | archetype | 1 action | no plan |  |
| Springboard | 10 | archetype | 1 action | plan | its text has no Strike of its user's |
| Staggering Blow | 10 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Stir Allies | 10 | archetype | 2 actions | no plan |  |
| Tag Team | 10 | archetype | reaction | plan | a reaction's Strike |
| Topple Foe | 10 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Tumbling Opportunist | 10 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Aegis of Arnisant | 12 | archetype | 2 actions | plan | it grants Absorb into the Aegis: the feat module reads nothing for it |
| Aerial Flash | 12 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Beastmaster's Call | 12 | archetype | 1 action | no plan |  |
| Beguiling Aura | 12 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Blessed Denial | 12 | archetype | reaction | no plan |  |
| Cartwheel Dodge | 12 | archetype | reaction | plan | a teleport |
| Chain Reaction | 12 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Claw and Talon Flow | 12 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Collapse Wall | 12 | archetype | reaction | no plan |  |
| Cut the Bonds | 12 | archetype | 1 action | no plan |  |
| Danse Macabre | 12 | archetype | 2 actions | no plan |  |
| Drive-By Attack | 12 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Escape Timeline | 12 | archetype | free | plan | a timer with no rules a fight counts |
| General's Gambit | 12 | archetype | 3 actions | no plan |  |
| Guarded Advance (Knight Vigilant) | 12 | archetype | 1 action | plan | a teleport |
| Hungry Blade | 12 | archetype | 1 action | no plan |  |
| Propelled Leap | 12 | archetype | 2 actions | plan | a plan the engine can't play (its targeting or what it does) |
| Reach for the Sky | 12 | archetype | 2 actions | plan | its requirement, which the PC doesn't meet (You're wielding a loaded firearm.) |
| Redirect Elements | 12 | archetype | reaction | no plan |  |
| Shake Off the Gods | 12 | archetype | 1 action | no plan |  |
| Shoulder Catastrophe | 12 | archetype | reaction | no plan |  |
| Slay | 12 | archetype | 2 actions | plan | its requirement (Your target is Doomed 2 or greater.) |
| Space-Time Shift | 12 | archetype | free | no plan |  |
| Steal Magic's Breath | 12 | archetype | reaction | no plan |  |
| Thunderous Landing | 12 | archetype | 1 action | plan | its requirement (You currently have a fly Speed and are airborne) |
| Wailing Dead | 12 | archetype | 2 actions | no plan |  |
| Awake With a Roar | 14 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Bombing Run | 14 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Commitment to Vigilance | 14 | archetype | 1 action | no plan |  |
| Cratering Drop | 14 | archetype | 1 action | no plan |  |
| Curse of the Saumen Kar | 14 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Death Rattle | 14 | archetype | 1 action | no plan |  |
| Devastating Manifestation | 14 | archetype | 2 actions | plan | its requirement (At least one of your soulforged armaments is not manifested.) |
| Dragon's Journey | 14 | archetype | 1 action | plan | a teleport |
| Even the Odds (Eagle Knight) | 14 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Execution | 14 | archetype | 2 actions | plan | its requirement (You have condemned a foe with Harsh Judgment.) |
| In the Horde's Grip | 14 | archetype | 1 action | no plan |  |
| Induce Imbalance | 14 | archetype | 2 actions | plan | its stance (an elemental stance), not in the packs |
| Lonely Army | 14 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| March of Law | 14 | archetype | 1 action | no plan |  |
| Mist Escape | 14 | archetype | free | no plan |  |
| Night's Warning | 14 | archetype | reaction | plan | its Effect has nothing a fight counts |
| Sailfish Strike | 14 | archetype | reaction | plan | a reaction's Strike |
| Shifting Terrain | 14 | archetype | 1 action | no plan |  |
| Simultaneous Strike | 14 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Spellmaster's Tenacity | 14 | archetype | reaction | plan | a timer with no rules a fight counts |
| Stunning Surprise | 14 | archetype | 2 actions | plan | its requirement (You must be undetected by the target creature) |
| Submit to Shadow | 14 | archetype | free | no plan |  |
| Watch Your Back (Golden Legionnaire) | 14 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Worm Form | 14 | archetype | 2 actions | no plan |  |
| Controlled Bullet | 16 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Converge | 16 | archetype | reaction | no plan |  |
| Deathblow | 16 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Declare Anathema | 16 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Deflecting Cloud | 16 | archetype | reaction | no plan |  |
| Emergency Regeneration | 16 | archetype | reaction | plan | a spell the feat casts |
| Focus Ally | 16 | archetype | reaction | no plan |  |
| Following Smite | 16 | archetype | 1 action | plan | its requirement (Your last action was a Strike made with a weapon or unarmed attack empowered by @UUID[Compendium.pf2e.f |
| Grave Threat | 16 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Incorporeal Shot | 16 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Infiltrator's Blitz | 16 | archetype | 3 actions | plan | a timer with no rules a fight counts |
| Mobile Magical Combat | 16 | archetype | 1 action | plan | its requirement (You're wielding a melee weapon and have Cast a Spell requiring at least 1 action this turn.) |
| One with the Spirits | 16 | archetype | 1 action | no plan |  |
| Opportune Throw | 16 | archetype | reaction | plan | a reaction's Strike |
| Protective Cycle | 16 | archetype | reaction | plan | its stance (an elemental stance), not in the packs |
| Purge of Moments | 16 | archetype | 3 actions | no plan |  |
| Ruthless Orator | 16 | archetype | 2 actions | no plan |  |
| Sonic Strafe | 16 | archetype | 2 actions | plan | its requirement (You currently have a fly Speed) |
| Tempo Shift | 16 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Ward Mind | 16 | archetype | reaction | plan | a timer with no rules a fight counts |
| Whirling Clobber | 16 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Wrath Against the Divine | 16 | archetype | 2 actions | plan | a target the simulator can't tell (Strike a foe that can cast divine spells) |
| Black Powder Embodiment | 18 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Body Barrier | 18 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Cut them Down, Burn them Out | 18 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Divine Presence | 18 | archetype | 1 action | no plan |  |
| Five Breaths, One Death | 18 | archetype | 3 actions | plan | its requirement (You're in an elemental stance, and the target is under the effects of Induce Imbalance.) |
| Guillotine Blade | 18 | archetype | 1 action | no plan |  |
| No Need to Fear | 18 | archetype | reaction | no plan |  |
| Stand for the Fallen | 18 | archetype | reaction | no plan |  |
| Timeline-Splitting Spell | 18 | archetype | 3 actions | no plan |  |
| Flash of Omnipotence | 20 | archetype | free | no plan |  |
| Wrath of the First Ghoul | 20 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Bashing Charge | 2 | barbarian | 2 actions | plan | a teleport |
| No Escape | 2 | barbarian | reaction | plan | a teleport |
| Barreling Charge | 4 | barbarian | 2 actions | plan | a roll whose results the simulator doesn't read |
| Brutal Crush | 4 | barbarian | 1 action | plan | its requirement (Your last action dealt bludgeoning damage using an unarmed Strike granted by a morph or polymorph effec |
| Rip and Tear | 4 | barbarian | 1 action | plan | its requirement (Your last action dealt piercing or slashing damage using an unarmed Strike granted by a morph or polymo |
| Animal Rage | 8 | barbarian | 1 action | plan | a spell the feat casts |
| Friendly Toss | 8 | barbarian | 2 actions | no plan |  |
| Sudden Leap | 8 | barbarian | 2 actions | plan | a Strike with nothing more the simulator reads |
| Corpse-Killer's Defiance | 10 | barbarian | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Determined Dash | 10 | barbarian | 2 actions | plan | a teleport |
| Furious Sprint | 10 | barbarian | 2 actions | plan | a teleport |
| Impressive Landing | 10 | barbarian | reaction | plan | a lasting area |
| Knockback | 10 | barbarian | 1 action | plan | a roll whose results the simulator doesn't read |
| Dragon's Rage Wings | 12 | barbarian | 1 action | plan | an Effect with nothing a fight counts |
| Predator's Pounce | 12 | barbarian | 1 action | plan | its requirement, which the PC doesn't meet (You are unarmored or wearing light armor) |
| Sunder Spell | 12 | barbarian | 2 actions | plan | a Strike with nothing more the simulator reads |
| Towering Transformation | 14 | barbarian | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Dragon Transformation | 16 | barbarian | 1 action | plan | a spell the feat casts |
| Whirlwind Toss | 18 | barbarian | 1 action | no plan |  |
| Emotional Push | 2 | bard | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Combat Reading | 4 | bard | 1 action | no plan |  |
| Inspiring Resilience | 4 | bard | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Grand Dance | 8 | bard | 2 actions | no plan |  |
| Reverberate | 12 | bard | reaction | plan | a roll whose results the simulator doesn't read |
| Triumphant Inspiration | 14 | bard | free | no plan |  |
| Resounding Finale | 16 | bard | reaction | plan | an Effect with nothing a fight counts |
| All in My Head | 18 | bard | reaction | no plan |  |
| Pack Performance | 18 | bard | reaction | plan | a reaction's Strike |
| Ringmaster's Introduction | 20 | bard | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Agile Shield Grip | 1 | champion | 1 action | no plan |  |
| Everstand Stance | 1 | champion | 1 action | no plan |  |
| Knock Sense | 4 | champion | 1 action | plan | a Strike with nothing more the simulator reads |
| Impassable Wall Stance | 8 | champion | 1 action | no plan |  |
| Sacrifice Armor | 8 | champion | reaction | plan | its Effect has nothing a fight counts |
| Miraculous Intervention | 12 | champion | reaction | plan | a roll whose results the simulator doesn't read |
| Everdistant Defense | 20 | champion | reaction | no plan |  |
| Rapid Response | 2 | cleric | reaction | no plan |  |
| Zealous Rush | 8 | cleric | reaction | plan | a teleport |
| Rebounding Smite | 16 | cleric | reaction | no plan |  |
| Avatar's Protection | 20 | cleric | reaction | no plan |  |
| Denier of Destruction | 20 | cleric | reaction | no plan |  |
| Combat Assessment | 1 | commander | 1 action | plan | a Strike with nothing more the simulator reads |
| Defensive Swap | 2 | commander | reaction | no plan |  |
| Unsteadying Strike | 4 | commander | 1 action | plan | a Strike with nothing more the simulator reads |
| Standard-Bearer's Sacrifice | 10 | commander | reaction | plan | a roll whose results the simulator doesn't read |
| Reactive Interference | 12 | commander | reaction | plan | a roll whose results the simulator doesn't read |
| Demand Surrender | 18 | commander | 2 actions | plan | its requirement (You and your allies currently outnumber enemies on the battlefield, and you or an ally has either Restr |
| Mercenary Reversal | 18 | commander | 2 actions | plan | its requirement (You and your allies are currently outnumbered by enemies on the battlefield) |
| Eerie Proclamation | 10 | druid | 2 actions | plan | a timer with no rules a fight counts |
| Defensive Dismissal | 12 | druid | reaction | no plan |  |
| Pesh Skin | 12 | druid | 1 action | no plan |  |
| Reactive Transformation | 14 | druid | reaction | plan | a spell the feat casts |
| Verdant Presence | 20 | druid | reaction | no plan |  |
| Vow of Mortal Defiance | 1 | exemplar | 1 action | no plan |  |
| Fish From the Falls' Edge | 10 | exemplar | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Lunge | 2 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Rebounding Toss | 2 | fighter | 2 actions | plan | its requirement, which the PC doesn't meet (You are wielding a thrown weapon.) |
| Sleek Reposition | 2 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Disarming Stance | 6 | fighter | 1 action | plan | an Effect with nothing a fight counts |
| Revealing Stab | 6 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Ricochet Stance (Fighter) | 6 | fighter | 1 action | plan | an Effect with nothing a fight counts |
| Spear Dancer | 6 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Knight's Retaliation | 8 | fighter | reaction | no plan |  |
| Mobile Shot Stance | 8 | fighter | 1 action | no plan |  |
| Positioning Assault | 8 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Disruptive Stance | 10 | fighter | 1 action | no plan |  |
| Halyard Strike | 10 | fighter | 2 actions | plan | its requirement (A rope is within your reach, or you have a rope or grappling weapon in your hand.) |
| Mirror Shield | 10 | fighter | reaction | no plan |  |
| Lunging Stance | 12 | fighter | 1 action | no plan |  |
| Determination | 14 | fighter | 1 action | no plan |  |
| Guiding Finish | 14 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Graceful Poise | 16 | fighter | 1 action | no plan |  |
| Reflecting Riposte | 20 | fighter | reaction | no plan |  |
| Sever Space | 20 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Shielded Attrition | 4 | guardian | 1 action | plan | a timer with no rules a fight counts |
| Disarming Intercept | 6 | guardian | free | plan | a plan the engine can't play (its targeting or what it does) |
| Guarded Advance | 6 | guardian | 1 action | plan | a teleport |
| Lock Down | 6 | guardian | 1 action | plan | a Strike with nothing more the simulator reads |
| Retaliating Rescue | 6 | guardian | 2 actions | plan | its text has no Strike of its user's |
| Repositioning Block | 8 | guardian | free | no plan |  |
| Momentum Strike | 10 | guardian | 2 actions | plan | a Strike with nothing more the simulator reads |
| Blanket Defense | 14 | guardian | 3 actions | plan | an Effect with nothing a fight counts |
| Blast Lock | 1 | gunslinger | 1 action | no plan |  |
| Fake Out | 2 | gunslinger | reaction | no plan |  |
| Quick Draw | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Risky Reload | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Paired Shots | 4 | gunslinger | 2 actions | plan | its requirement, which the PC doesn't meet (You're wielding two weapons, each of which can be either a loaded one-handed |
| Running Reload | 4 | gunslinger | 1 action | plan | a teleport |
| Cauterize | 6 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Nightwave Springing Reload | 6 | gunslinger | 1 action | plan | a teleport |
| Scatter Blast | 6 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Seize an Advantage | 6 | gunslinger | 1 action | plan | its requirement (Your last action this turn was to attempt a Dirty Trick against a foe.) |
| Smoke Curtain | 8 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Trick Shot | 10 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Twin Shot Knockdown | 10 | gunslinger | 2 actions | plan | its requirement, which the PC doesn't meet (You're wielding a loaded crossbow or loaded firearm in each hand.) |
| Blood in the Air | 12 | gunslinger | 1 action | plan | its requirement (An enemy you've damaged with a ranged weapon during the last minute is Concealed or Hidden from you.) |
| Ricochet Shot | 12 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Blast Tackle | 14 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Triggerbrand Blitz | 14 | gunslinger | 3 actions | plan | its text has no Strike of its user's |
| Instant Return | 16 | gunslinger | reaction | plan | a reaction's Strike |
| Wukong Extension | 2 | inventor | 1 action | plan | a Strike with nothing more the simulator reads |
| Clockwork Celerity | 6 | inventor | free | plan | a free's Strike |
| Geobukseon Retaliation | 10 | inventor | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Explosive Maneuver | 14 | inventor | 1 action | no plan |  |
| Exploit Blunder | 2 | investigator | reaction | plan | a teleport |
| Connect the Dots | 6 | investigator | 2 actions | no plan |  |
| Read the Dust | 6 | investigator | reaction | no plan |  |
| Just as Planned | 12 | investigator | free | plan | its Effect has nothing a fight counts |
| Air Cushion | 1 | kineticist | reaction | no plan |  |
| Burning Jet | 1 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Flying Flame | 1 | kineticist | 2 actions | plan | a plan the engine can't play (its targeting or what it does) |
| Four Winds | 1 | kineticist | 2 actions | no plan |  |
| Fresh Produce | 1 | kineticist | 1 action | no plan |  |
| Weapon Infusion | 1 | kineticist | free | plan | an Effect with nothing a fight counts |
| Ambush Bladderwort | 4 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Command Elemental | 4 | kineticist | 2 actions | plan | a roll whose results the simulator doesn't read |
| Living Bonfire | 4 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Return to the Sea | 4 | kineticist | 2 actions | plan | a spell the feat casts |
| Counter Element | 6 | kineticist | reaction | no plan |  |
| Crawling Fire | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Desert Wind | 6 | kineticist | 1 action | plan | an Effect with nothing a fight counts |
| Jagged Berms | 6 | kineticist | 3 actions | no plan |  |
| Sand Snatcher | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Tree of Duality | 6 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Two-Element Infusion | 6 | kineticist | free | no plan |  |
| Volcanic Escape | 6 | kineticist | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Wooden Palisade | 6 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Swim Through Earth | 8 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Architect of Flame | 12 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Drowning Mist | 12 | kineticist | 2 actions | plan | a plan the engine can't play (its targeting or what it does) |
| Rock Rampart | 12 | kineticist | 3 actions | plan | a spell the feat casts |
| Body of Air | 14 | kineticist | reaction | plan | a timer with no rules a fight counts |
| Liberating Dive | 14 | kineticist | 2 actions | no plan |  |
| Rouse the Forest's Fury | 18 | kineticist | 3 actions | plan | its text has no Strike of its user's |
| Turn the Wheel of Seasons | 18 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Magus's Analysis | 1 | magus | 1 action | no plan |  |
| Distant Waterbird's Poise | 4 | magus | reaction | plan | a timer with no rules a fight counts |
| Exploding Bullet | 4 | magus | 1 action | no plan |  |
| Running Recharge | 4 | magus | 1 action | plan | a teleport |
| Spell Retaliation | 6 | magus | free | no plan |  |
| Surface Tension | 6 | magus | 1 action | no plan |  |
| Capture Magic | 8 | magus | reaction | plan | a timer with no rules a fight counts |
| Crosscurrent Counter | 8 | magus | reaction | no plan |  |
| Cascading Ray | 10 | magus | 1 action | no plan |  |
| Dazzling Block | 10 | magus | free | plan | a plan the engine can't play (its targeting or what it does) |
| Killshot's Report | 10 | magus | reaction | no plan |  |
| Unsheathing the Sword-Light | 10 | magus | 2 actions | plan | a choice of ways the simulator doesn't play |
| Dispelling Spellstrike | 16 | magus | 3 actions | no plan |  |
| Stolen Spell | 18 | magus | free | no plan |  |
| Monastic Archer Stance | 1 | monk | 1 action | no plan |  |
| Waterfowl Stance | 2 | monk | 1 action | no plan |  |
| Divert Streamflow | 4 | monk | reaction | plan | a roll whose results the simulator doesn't read |
| Flying Kick | 4 | monk | 2 actions | plan | its text has no Strike of its user's |
| Peafowl Stance | 4 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Culvert's Collapse | 6 | monk | 1 action | plan | its requirement (You are in Flood Stance and were damaged by an enemy since your previous turn.) |
| Pinning Fire | 8 | monk | reaction | no plan |  |
| Rippling Spin | 8 | monk | reaction | no plan |  |
| Wall Run | 8 | monk | 1 action | plan | a teleport |
| Peafowl Strut | 10 | monk | 1 action | plan | its stance (Peafowl Stance): an Effect with nothing a fight counts |
| Prevailing Position | 10 | monk | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Winding Flow | 10 | monk | 1 action | plan | a teleport |
| Focused Shot | 12 | monk | 1 action | plan | its stance (Monastic Archer Stance): the feat module reads nothing for it |
| Explosive Death Drop | 14 | monk | 1 action | plan | its requirement (You are in @UUID[Compendium.pf2e.feats-srd.Item.Rain of Embers Stance] and have a target Grabbed or Res |
| Form Lock | 14 | monk | 1 action | no plan |  |
| Tangled Forest Rake | 14 | monk | 1 action | plan | a Strike with nothing more the simulator reads |
| Whirling Blade Stance | 14 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Electric Counter | 16 | monk | reaction | no plan |  |
| Swift River | 18 | monk | free | no plan |  |
| Ghostly Stride | 4 | necromancer | 1 action | plan | a teleport |
| Corrupted Ground | 6 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Hallowed Earth | 6 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Poison Drinker | 8 | necromancer | reaction | no plan |  |
| Blood Pool | 14 | necromancer | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Soul Thief | 20 | necromancer | 3 actions | plan | a roll whose results the simulator doesn't read |
| Divine Aegis | 2 | oracle | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Meddling Futures | 2 | oracle | free | no plan |  |
| Thousand Visions | 4 | oracle | free | plan | a timer with no rules a fight counts |
| Roll the Bones of Fate | 10 | oracle | 1 action | plan | a roll whose results the simulator doesn't read |
| Epiphany at the Crossroads | 12 | oracle | free | plan | a spell the feat casts |
| Blaze of Revelation | 18 | oracle | free | plan | a plan the engine can't play (its targeting or what it does) |
| Free the Bound | 1 | other | reaction | plan | its Effect has nothing a fight counts |
| Blasting Beams | 2 | other | 1 action | plan | it grants Dragon Deviant Classification: the feat module reads nothing for it |
| Borrowed Ability | 2 | other | 1 action | plan | it grants Leech Deviant Classification: the feat module reads nothing for it |
| Consume Energy | 2 | other | reaction | plan | it grants Dragon Deviant Classification: the feat module reads nothing for it |
| Draining Touch | 2 | other | 1 action | plan | it grants Leech Deviant Classification: the feat module reads nothing for it |
| Eerie Flicker | 2 | other | reaction | plan | it grants Wraith Deviant Classification: the feat module reads nothing for it |
| Ghostly Grasp (Deviant) | 2 | other | 1 action | plan | it grants Wraith Deviant Classification: the feat module reads nothing for it |
| Release Spores | 2 | other | 2 actions | plan | it grants Blight Soul Deviant Classification: the feat module reads nothing for it |
| Rotten Slurry | 2 | other | 1 action | plan | it grants Blight Soul Deviant Classification: the feat module reads nothing for it |
| Sprout Fruit | 2 | other | 1 action | plan | it grants Verdant Core Deviant Classification: the feat module reads nothing for it |
| Vine Lash | 2 | other | 1 action | plan | it grants Verdant Core Deviant Classification: the feat module reads nothing for it |
| Fiery Rebirth | 4 | other | free | plan | a plan the engine can't play (its targeting or what it does) |
| Prescience | 4 | other | free | no plan |  |
| Surface Rush | 4 | other | 2 actions | no plan |  |
| Defensive Growth | 6 | other | reaction | plan | it grants Verdant Core Deviant Classification: the feat module reads nothing for it |
| Divert Destiny | 6 | other | free | no plan |  |
| Unrivaled Retort | 6 | other | reaction | plan | a reaction's Strike |
| Arc of Destruction | 8 | other | reaction | no plan |  |
| Stages of Fate | 8 | other | 2 actions | no plan |  |
| Unbelievable Interception | 8 | other | reaction | no plan |  |
| Call From Death's Door | 10 | other | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Feed the Void | 10 | other | 2 actions | plan | it grants Leech Deviant Classification: the feat module reads nothing for it |
| Lightspeed Assault | 10 | other | 1 action | plan | it grants Flicker Deviant Classification: the feat module reads nothing for it |
| Burning Surge | 14 | other | reaction | no plan |  |
| Immovable Object | 14 | other | 1 action | no plan |  |
| Invigorating Surge | 14 | other | 1 action | plan | an Effect with nothing a fight counts |
| Release Me! | 14 | other | 1 action | plan | a Strike with nothing more the simulator reads |
| Second Sight | 14 | other | 1 action | plan | its text has no Strike of its user's |
| To Thine Own Self | 14 | other | reaction | no plan |  |
| Abjure Harm | 16 | other | reaction | no plan |  |
| Bring Into the Fold | 16 | other | 2 actions | plan | a roll whose results the simulator doesn't read |
| Death from Above (Eternal Legend) | 16 | other | 2 actions | plan | its requirement (You are adjacent to a climbable surface at least 10 feet tall.) |
| Divide and Conquer | 16 | other | 2 actions | plan | a timer with no rules a fight counts |
| Indomitable Shot | 16 | other | 2 actions | no plan |  |
| Leaping Hedgehog Strike | 16 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| Lose Your Chains | 16 | other | reaction | no plan |  |
| My Kingdom, My Blood | 16 | other | 3 actions | plan | a timer with no rules a fight counts |
| Noble Sacrifice | 16 | other | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Prescient Parry | 16 | other | reaction | plan | a reaction's Strike |
| Preserve the Moment | 16 | other | reaction | plan | it grants Restore the Moment: a reaction's Strike |
| Vindictive Thoughts | 16 | other | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Virulent Strike | 16 | other | 1 action | plan | a Strike with nothing more the simulator reads |
| Army of One | 18 | other | 3 actions | plan | a Strike with nothing more the simulator reads |
| Final Shot Knows the Way | 18 | other | 2 actions | no plan |  |
| Legend of Combat | 18 | other | 1 action | plan | it grants Speed of Arms: a reaction's Strike |
| Liberty or Death | 18 | other | 2 actions | plan | its requirement (A creature has been the target of your Ultimatum of Liberation for at least 1 minute) |
| Throw and Catch | 18 | other | 3 actions | plan | a Strike with nothing more the simulator reads |
| Finish Their Story! | 20 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| Violent Unleash | 4 | psychic | 1 action | plan | its requirement (Your previous action was to Unleash your Psyche) |
| Mental Static | 8 | psychic | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Dream Guise | 10 | psychic | 1 action | no plan |  |
| Impose Order (Psychic) | 10 | psychic | 1 action | no plan |  |
| All in Your Head | 18 | psychic | reaction | no plan |  |
| Crossbow Ace | 1 | ranger | 1 action | no plan |  |
| Relentless Stalker | 2 | ranger | reaction | no plan |  |
| Skirmish Strike | 6 | ranger | 1 action | plan | a Strike with nothing more the simulator reads |
| Roll with it (Kingmaker) | 12 | ranger | reaction | no plan |  |
| Time Dilation Cascade | 20 | ranger | 3 actions | plan | its text has no Strike of its user's |
| Clever Gambit | 2 | rogue | reaction | plan | a teleport |
| Battle Assessment | 4 | rogue | 1 action | no plan |  |
| Mug | 4 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Predictable! | 4 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Reactive Pursuit | 4 | rogue | reaction | plan | a teleport |
| Sabotage | 4 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Slice and Swipe | 6 | rogue | 1 action | plan | a Strike with nothing more the simulator reads |
| Stella's Stab and Snag | 6 | rogue | 2 actions | plan | its text has no Strike of its user's |
| Bullseye | 8 | rogue | 1 action | no plan |  |
| Delay Trap | 8 | rogue | reaction | no plan |  |
| Ricochet Stance (Rogue) | 8 | rogue | 1 action | plan | an Effect with nothing a fight counts |
| Swipe Souvenir | 8 | rogue | 2 actions | no plan |  |
| Tactical Entry | 8 | rogue | free | plan | a teleport |
| Fantastic Leap | 12 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Felling Shot | 12 | rogue | 2 actions | plan | a roll whose results the simulator doesn't read |
| Preparation | 12 | rogue | 1 action | no plan |  |
| Cognitive Loophole | 16 | rogue | reaction | plan | a timer with no rules a fight counts |
| Dispelling Slice | 16 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Swift Elusion | 16 | rogue | reaction | no plan |  |
| Reactive Distraction | 20 | rogue | reaction | no plan |  |
| Engraving Strike | 1 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| Remote Detonation | 1 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| Pattern Flight | 2 | runesmith | 2 actions | plan | a Strike with nothing more the simulator reads |
| Artist's Attendance | 4 | runesmith | 2 actions | plan | a teleport |
| Engraving Maneuver | 6 | runesmith | 1 action | no plan |  |
| Drawn In Vital Ink | 8 | runesmith | free | no plan |  |
| Orbiting Runestone | 12 | runesmith | 1 action | no plan |  |
| Dance of Bloody Ink | 14 | runesmith | 3 actions | plan | a Strike with nothing more the simulator reads |
| Henge Gate | 14 | runesmith | 2 actions | plan | a timer with no rules a fight counts |
| Unerring Runic Attraction | 14 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| By Your Name | 16 | runesmith | 1 action | plan | a roll whose results the simulator doesn't read |
| Blood Rising | 1 | sorcerer | reaction | plan | a timer with no rules a fight counts |
| One for All | 1 | swashbuckler | 1 action | no plan |  |
| Brandishing Draw | 2 | swashbuckler | 1 action | plan | its text has no Strike of its user's |
| Swan Dive | 2 | swashbuckler | 1 action | no plan |  |
| Dastardly Dash | 4 | swashbuckler | 1 action | plan | a teleport |
| Twirling Throw | 4 | swashbuckler | 1 action | no plan |  |
| Distracting Toss | 8 | swashbuckler | 2 actions | plan | a Strike with nothing more the simulator reads |
| Switcheroo | 10 | swashbuckler | reaction | no plan |  |
| Get Used to Disappointment | 12 | swashbuckler | free | plan | a plan the engine can't play (its targeting or what it does) |
| The Bigger They Are | 12 | swashbuckler | 1 action | no plan |  |
| Flamboyant Leap | 14 | swashbuckler | 2 actions | no plan |  |
| Lethal Finisher | 18 | swashbuckler | 1 action | plan | a roll whose results the simulator doesn't read |
| Illimitable Finisher | 20 | swashbuckler | 1 action | plan | its text has no Strike of its user's |
| Vivacious Afterimage | 20 | swashbuckler | 1 action | plan | a timer with no rules a fight counts |
| Divine Disharmony | 1 | thaumaturge | 1 action | plan | effects the GM allows from the scenery |
| Turn Away Misfortune | 2 | thaumaturge | reaction | plan | its Effect has nothing a fight counts |
| Instructive Strike | 4 | thaumaturge | 1 action | plan | a Strike with nothing more the simulator reads |
| Share Weakness | 10 | thaumaturge | 1 action | no plan |  |
| Intensify Investiture | 12 | thaumaturge | free | no plan |  |
| Trespass Teleportation | 14 | thaumaturge | reaction | plan | its stance (Exploit Vulnerability): a timer with no rules a fight counts |
| Sever Magic | 16 | thaumaturge | 2 actions | plan | a Strike with nothing more the simulator reads |
| Portents of the Haruspex | 4 | witch | reaction | no plan |  |
| Convincing Illusion | 6 | wizard | reaction | plan | a roll whose results the simulator doesn't read |
| Spell Tinker | 16 | wizard | 2 actions | no plan |  |

## Passives that change a class feature (196)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Far Lobber | 1 | alchemist | passive | no plan |  |
| Smoke Bomb | 2 | alchemist | passive | no plan |  |
| Healing Bomb | 4 | alchemist | passive | no plan |  |
| Longshanks Slam | 4 | alchemist | passive | no plan |  |
| Perpetual Breadth | 8 | alchemist | passive | no plan |  |
| Greater Debilitating Bomb | 10 | alchemist | passive | no plan |  |
| Lingering Bomb | 10 | alchemist | passive | no plan |  |
| Balm Bomb | 12 | alchemist | passive | no plan |  |
| Uncanny Bombs | 12 | alchemist | passive | no plan |  |
| True Debilitating Bomb | 14 | alchemist | passive | no plan |  |
| Exploitive Bomb | 16 | alchemist | passive | no plan |  |
| Perfect Debilitation | 18 | alchemist | passive | no plan |  |
| Mega Bomb | 20 | alchemist | passive | plan | a passive's roll with no action to use it |
| Apparition Stabilization | 6 | animist | passive | no plan |  |
| Instinctive Maneuvers | 8 | animist | passive | no plan |  |
| Cardinal Guardians | 14 | animist | passive | no plan |  |
| Eternal Guide | 20 | animist | passive | no plan |  |
| Aura Enhancement | 4 | archetype | passive | no plan |  |
| Base Kinesis | 4 | archetype | passive | plan | it grants Base Kinesis: the feat module reads nothing for it |
| Guard's Fury | 4 | archetype | passive | plan | it grants Rage: its requirement (You aren't Fatigued or raging) |
| Investigator's Stratagem | 4 | archetype | passive | plan | it grants Devise a Stratagem: its text has no Strike of its user's |
| Repeating Hand Crossbow Training | 4 | archetype | passive | no plan |  |
| Safety Measures | 4 | archetype | passive | no plan |  |
| Spell Runes | 4 | archetype | passive | no plan |  |
| Through the Gate | 4 | archetype | passive | plan | it grants one of 6 (Elemental Familiar (Kineticist): the feat module reads nothing for it; Extended Kinesis: the feat mo |
| Advanced Element Control | 6 | archetype | passive | no plan |  |
| Implement Initiate | 6 | archetype | passive | no plan |  |
| Living Rune | 6 | archetype | passive | no plan |  |
| Multifaceted Will | 6 | archetype | passive | no plan |  |
| Palatine Enchantment | 6 | archetype | passive | no plan |  |
| Rod of Rule | 6 | archetype | passive | plan | a passive's Effect on other creatures |
| Slinger's Readiness | 6 | archetype | passive | no plan |  |
| Soul Arsenal | 6 | archetype | passive | no plan |  |
| Tracing Studies | 6 | archetype | passive | plan | it grants Trace Rune: a timer with no rules a fight counts |
| Explosive Entry | 7 | archetype | passive | no plan |  |
| Accursed Touch | 8 | archetype | passive | no plan |  |
| Armed And Armored | 8 | archetype | passive | no plan |  |
| Improved Elemental Blast | 8 | archetype | passive | no plan |  |
| Live Ammunition | 8 | archetype | passive | no plan |  |
| Mind Projectiles | 8 | archetype | passive | no plan |  |
| Slayer's Blessing | 8 | archetype | passive | no plan |  |
| Swashbuckler's Speed | 8 | archetype | passive | no plan |  |
| Venomous Weapons | 8 | archetype | passive | no plan |  |
| Add Element | 10 | archetype | passive | no plan |  |
| Channel Rot | 10 | archetype | passive | no plan |  |
| Expanded Repertoire | 10 | archetype | passive | no plan |  |
| Greater Spell Runes | 10 | archetype | passive | no plan |  |
| Hilt Hammer | 10 | archetype | passive | no plan |  |
| Phenom's Verve | 10 | archetype | passive | plan | its Effect has nothing a fight counts |
| Practiced Reloads | 10 | archetype | passive | no plan |  |
| Stalwart Standard | 10 | archetype | passive | no plan |  |
| Touch of Lunacy | 10 | archetype | passive | plan | a reaction to "passive" |
| Expert Kinetic Control | 12 | archetype | passive | no plan |  |
| Reverse Curse | 12 | archetype | passive | no plan |  |
| Second Ikon | 12 | archetype | passive | no plan |  |
| Fulminating Synergy | 16 | archetype | passive | no plan |  |
| Instrument of Death | 16 | archetype | passive | no plan |  |
| Greater Expanded Repertoire | 18 | archetype | passive | no plan |  |
| Razor's Edge | 18 | archetype | passive | no plan |  |
| Shadow Master | 18 | archetype | passive | plan | a passive's Effect posted by hand |
| Acute Vision | 1 | barbarian | passive | no plan |  |
| Adrenaline Rush | 1 | barbarian | passive | no plan |  |
| Raging Thrower | 1 | barbarian | passive | no plan |  |
| Acute Scent | 2 | barbarian | passive | no plan |  |
| Elemental Evolution | 2 | barbarian | passive | no plan |  |
| Second Wind | 2 | barbarian | passive | no plan |  |
| Raging Athlete | 4 | barbarian | passive | no plan |  |
| Supernatural Senses | 4 | barbarian | passive | no plan |  |
| Animal Skin | 6 | barbarian | passive | no plan |  |
| Nocturnal Senses | 6 | barbarian | passive | no plan |  |
| Furious Bully | 8 | barbarian | passive | no plan |  |
| Shattering Blows | 16 | barbarian | passive | no plan |  |
| Contagious Rage | 20 | barbarian | passive | no plan |  |
| Cantrip Expansion | 2 | bard | passive | no plan |  |
| Directed Audience | 2 | bard | passive | no plan |  |
| Ode to Ouroboros | 10 | bard | passive | plan | a spell the engine doesn't cast (Ode to Ouroboros) |
| Symphony of the Unfettered Heart | 10 | bard | passive | plan | a spell the engine doesn't cast (Symphony of the Unfettered Heart) |
| Discordant Voice | 18 | bard | passive | no plan |  |
| Fatal Aria | 20 | bard | passive | plan | a spell the engine doesn't cast (Fatal Aria) |
| Symphony of the Muse | 20 | bard | passive | no plan |  |
| Nimble Reprisal | 1 | champion | passive | no plan |  |
| Oath of the Avenger | 2 | champion | passive | no plan |  |
| Vengeful Oath | 2 | champion | passive | no plan |  |
| Mercy | 4 | champion | passive | no plan |  |
| Affliction Mercy | 12 | champion | passive | no plan |  |
| Ultimate Mercy | 18 | champion | passive | no plan |  |
| Armament Paragon | 20 | champion | passive | plan | its Effect has nothing a fight counts |
| Banishing Blow | 20 | champion | passive | no plan |  |
| Castigating Weapon | 10 | cleric | passive | plan | a passive's Effect posted by hand |
| Claim the Field | 6 | commander | passive | no plan |  |
| Anthropomorphic Shape | 4 | druid | passive | no plan |  |
| Order Magic | 4 | druid | passive | no plan |  |
| Perfect Form Control | 18 | druid | passive | no plan |  |
| Apex Companion | 20 | druid | passive | plan | a spell the engine doesn't cast (Apex Companion) |
| Twin Stars | 1 | exemplar | passive | no plan |  |
| Hurl at the Horizon | 2 | exemplar | passive | no plan |  |
| Leap the Falls | 2 | exemplar | passive | no plan |  |
| Red-Gold Mortality | 2 | exemplar | passive | plan | a reaction to "passive" |
| Follow the Threads of Fate | 4 | exemplar | passive | plan | it grants Unravel the Future: the feat module reads nothing for it |
| Only the Worthy | 4 | exemplar | passive | no plan |  |
| Through the Needle's Eye | 4 | exemplar | passive | plan | it grants Blinding of the Needle: a Strike with nothing more the simulator reads |
| Binding Serpents Celestial Arrow | 6 | exemplar | passive | plan | it grants Coiling Serpents: a Strike with nothing more the simulator reads |
| Motionless Cutter | 6 | exemplar | passive | plan | it grants Sever Four Dragonfly Wings: a Strike with nothing more the simulator reads |
| Riddle The Sphinx | 6 | exemplar | passive | plan | it grants Tangle in Riddle: the feat module reads nothing for it |
| Shield of Stone | 6 | exemplar | passive | plan | it grants Brandish the Gorgon's Gaze: the feat module reads nothing for it |
| Additional Ikon | 8 | exemplar | passive | no plan |  |
| Breath of Vital Ash | 10 | exemplar | passive | plan | it grants Mark the Center: a timer with no rules a fight counts |
| Mated Birds in Paired Flight | 10 | exemplar | passive | no plan |  |
| Warped by Rage | 12 | exemplar | passive | plan | it grants Spasm of the Berserker: a timer with no rules a fight counts |
| Destined Victory | 14 | exemplar | passive | plan | it grants Only You and I: its text has no Strike of its user's |
| Infinite Blades Celestial Arrow | 14 | exemplar | passive | plan | it grants Heaven Rains an Ending: a Strike with nothing more the simulator reads |
| Gift of the Immortal Herb | 16 | exemplar | passive | plan | it grants Shed the Mortal Skin: a timer with no rules a fight counts |
| Branched Tree of Pain | 18 | exemplar | passive | plan | it grants Plant Thirty Barbs: a Strike with nothing more the simulator reads |
| Sunwrecker | 18 | exemplar | passive | plan | it grants Break the Sun's Legs: a timer with no rules a fight counts |
| Reach for Immortality | 20 | exemplar | passive | no plan |  |
| Long-Distance Taunt | 1 | guardian | passive | no plan |  |
| Perfect Protection | 18 | guardian | passive | no plan |  |
| Crossbow Crack Shot | 1 | gunslinger | passive | no plan |  |
| Dual-Weapon Reload | 1 | gunslinger | passive | no plan |  |
| Hair Trigger | 16 | gunslinger | passive | plan | a passive's roll with no action to use it |
| Variable Core | 1 | inventor | passive | no plan |  |
| Diving Armor | 4 | inventor | passive | no plan |  |
| Dual-Form Weapon | 4 | inventor | passive | no plan |  |
| Construct Shell | 6 | inventor | passive | no plan |  |
| Gigaton Strike | 8 | inventor | passive | plan | a reaction to "passive" |
| Shared Overdrive | 12 | inventor | passive | plan | a passive's Effect on other creatures |
| Known Weaknesses | 1 | investigator | passive | no plan |  |
| Athletic Strategist | 2 | investigator | passive | no plan |  |
| Defensive Stratagem | 8 | investigator | passive | no plan |  |
| Whodunnit? | 8 | investigator | passive | no plan |  |
| Extended Kinesis | 1 | kineticist | passive | no plan |  |
| Safe Elements | 4 | kineticist | passive | plan | it grants Pacifying Infusion: the feat module reads nothing for it |
| Elemental Overlap | 8 | kineticist | passive | no plan |  |
| Aura Shaping | 10 | kineticist | passive | no plan |  |
| Convergent Tides | 2 | magus | passive | no plan |  |
| Spirit Sheath | 2 | magus | passive | no plan |  |
| Starlit Eyes | 4 | magus | passive | no plan |  |
| Striker's Scroll | 4 | magus | passive | no plan |  |
| Sprinting Spellstrike | 12 | magus | passive | no plan |  |
| Arcane Shroud | 14 | magus | passive | no plan |  |
| Flurry of Maneuvers | 4 | monk | passive | no plan |  |
| Stumbling Feint | 6 | monk | passive | no plan |  |
| Mobile Thralls | 4 | necromancer | passive | no plan |  |
| Sanguine Transference | 8 | necromancer | passive | plan | a spell the engine doesn't cast (Sanguine Transference) |
| Become as Spirit | 12 | necromancer | passive | no plan |  |
| Perfected Thrall | 20 | necromancer | passive | plan | a spell the engine doesn't cast (Perfected Thrall) |
| Domain Acumen | 2 | oracle | passive | no plan |  |
| Advanced Revelation | 6 | oracle | passive | no plan |  |
| Water Walker | 8 | oracle | passive | no plan |  |
| Domain Fluency | 12 | oracle | passive | no plan |  |
| Greater Revelation | 12 | oracle | passive | no plan |  |
| Lighter than Air | 14 | oracle | passive | no plan |  |
| Fool's Fleeting Plan | 6 | other | passive | no plan |  |
| Scouring Spark | 18 | other | passive | plan | a reaction to "hit-by" |
| Twin Psyche | 18 | psychic | passive | no plan |  |
| Monster Hunter | 1 | ranger | passive | no plan |  |
| Nature Prowler | 6 | ranger | passive | plan | a passive's roll with no action to use it |
| Double Prey | 12 | ranger | passive | no plan |  |
| Shared Prey | 14 | ranger | passive | no plan |  |
| Warden's Guidance | 14 | ranger | passive | no plan |  |
| Manifold Edge | 18 | ranger | passive | no plan |  |
| Shadow Hunter | 18 | ranger | passive | no plan |  |
| Legendary Shot | 20 | ranger | passive | no plan |  |
| Mimic Protections | 20 | ranger | passive | no plan |  |
| Triple Threat | 20 | ranger | passive | no plan |  |
| Magical Trickster | 4 | rogue | passive | no plan |  |
| The Harder They Fall | 4 | rogue | passive | no plan |  |
| Powerful Sneak | 18 | rogue | passive | no plan |  |
| Rune-Singer | 1 | runesmith | passive | no plan |  |
| Seek the Hidden Glyphs | 1 | runesmith | passive | no plan |  |
| Invisible Ink | 2 | runesmith | passive | no plan |  |
| Ghostly Resonance | 4 | runesmith | passive | no plan |  |
| Runic Reprisal | 6 | runesmith | passive | no plan |  |
| Prodigal Rune-Singer | 10 | runesmith | passive | no plan |  |
| Maze of Runes | 16 | runesmith | passive | plan | a spell the engine doesn't cast (Quandary) |
| Runesight | 16 | runesmith | passive | no plan |  |
| Unbounded Invocations | 18 | runesmith | passive | no plan |  |
| Forge New Word | 20 | runesmith | passive | no plan |  |
| Generational Rune-Singer | 20 | runesmith | passive | no plan |  |
| Shades of Meaning | 20 | runesmith | passive | no plan |  |
| Greater Spiritual Evolution | 12 | sorcerer | passive | no plan |  |
| Elegant Buckler | 1 | swashbuckler | passive | no plan |  |
| Flying Blade | 1 | swashbuckler | passive | no plan |  |
| Flamboyant Athlete | 4 | swashbuckler | passive | no plan |  |
| Agile Maneuvers | 6 | swashbuckler | passive | no plan |  |
| Derring-Do | 10 | swashbuckler | passive | no plan |  |
| Ammunition Thaumaturgy | 1 | thaumaturge | passive | no plan |  |
| Scroll Thaumaturgy | 1 | thaumaturge | passive | no plan |  |
| Esoteric Warden | 2 | thaumaturge | passive | plan | a passive's Effect posted by hand |
| Breached Defenses | 4 | thaumaturge | passive | no plan |  |
| Esoteric Reflexes | 14 | thaumaturge | passive | no plan |  |
| Implement's Flight | 16 | thaumaturge | passive | no plan |  |
| Intense Implement | 18 | thaumaturge | passive | no plan |  |
| Ubiquitous Weakness | 20 | thaumaturge | passive | no plan |  |
| Syu Tak-nwa's Hexed Locks | 8 | witch | passive | no plan |  |
| Hex Master | 20 | witch | passive | no plan |  |

## Other combat passives (372)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Blowgun Poisoner | 1 | alchemist | passive | no plan |  |
| Soothing Vials | 1 | alchemist | passive | plan | a passive's Effect on other creatures |
| Clotting Elixirs | 2 | alchemist | passive | no plan |  |
| Pernicious Poison | 2 | alchemist | passive | no plan |  |
| Numbing Spice Exhalation | 4 | alchemist | passive | plan | a reaction to "passive" |
| Combustible Poison | 6 | alchemist | passive | plan | a passive's roll with no action to use it |
| Fortified Elixirs | 6 | alchemist | passive | no plan |  |
| Sticky Poison | 6 | alchemist | passive | no plan |  |
| Blazing Mutagen | 8 | alchemist | passive | plan | a passive's Effect posted by hand |
| Improved Invigorating Elixir | 8 | alchemist | passive | no plan |  |
| Mutant Physique | 8 | alchemist | passive | plan | its requirement, which the PC doesn't meet (the weapon its damage die upgrade names) |
| Pinpoint Poisoner | 8 | alchemist | passive | no plan |  |
| Supreme Invigorating Elixir | 12 | alchemist | passive | no plan |  |
| Double Poison | 14 | alchemist | passive | no plan |  |
| Greater Merciful Elixir | 14 | alchemist | passive | no plan |  |
| Acclimatization | 4 | archetype | passive | no plan |  |
| Always Ready | 4 | archetype | passive | no plan |  |
| Angel of Vindication | 4 | archetype | passive | no plan |  |
| Ankle Biter | 4 | archetype | passive | no plan |  |
| Barrier Shield | 4 | archetype | passive | no plan |  |
| Basic Skysage Divination | 4 | archetype | passive | no plan |  |
| Beastkin Resilience | 4 | archetype | passive | no plan |  |
| Brastlewark Snare Engineering | 4 | archetype | passive | no plan |  |
| Bullet Dancer Burn | 4 | archetype | passive | plan | a passive's roll with no action to use it |
| Contortionist | 4 | archetype | passive | plan | it grants Quick Squeeze: the feat module reads nothing for it |
| Contract Blade | 4 | archetype | passive | no plan |  |
| Deft Cooperation | 4 | archetype | passive | plan | a passive's Effect posted by hand |
| Dragon Arcana | 4 | archetype | passive | no plan |  |
| Dread Blade | 4 | archetype | passive | no plan |  |
| Dual Thrower | 4 | archetype | passive | no plan |  |
| Elemental Substitution | 4 | archetype | passive | no plan |  |
| Entity's Strike | 4 | archetype | passive | no plan |  |
| Experienced Follower | 4 | archetype | passive | no plan |  |
| Expert Backstabber | 4 | archetype | passive | no plan |  |
| Fly Swat | 4 | archetype | passive | no plan |  |
| Forceful Push | 4 | archetype | passive | no plan |  |
| Gravelands Herbalist | 4 | archetype | passive | no plan |  |
| Guerrilla Weaponry | 4 | archetype | passive | plan | it grants Guerrilla Assault: a Strike with nothing more the simulator reads |
| Hijack Undead | 4 | archetype | passive | plan | a reaction to "passive" |
| Improvised Pummel | 4 | archetype | passive | no plan |  |
| Leader of All | 4 | archetype | passive | no plan |  |
| Modular Dynamo | 4 | archetype | passive | no plan |  |
| Patch Job | 4 | archetype | passive | plan | it grants Improvised Repair: the feat module reads nothing for it |
| Poultice Preparation | 4 | archetype | passive | no plan |  |
| Raging Stories | 4 | archetype | passive | no plan |  |
| Replenishing Consumption | 4 | archetype | passive | plan | a passive's roll with no action to use it |
| Rescuer's Press | 4 | archetype | passive | no plan |  |
| Shining Arms | 4 | archetype | passive | no plan |  |
| Snare Expert | 4 | archetype | passive | plan | it grants Snare Crafting: the feat module reads nothing for it |
| Summon Ensemble | 4 | archetype | passive | no plan |  |
| Tandem Onslaught | 4 | archetype | passive | no plan |  |
| Tools of the Trade | 4 | archetype | passive | no plan |  |
| Tricksterbane Oath | 4 | archetype | passive | no plan |  |
| Versatile Mutation | 4 | archetype | passive | no plan |  |
| Voice of Authority | 4 | archetype | passive | no plan |  |
| Animate Net | 6 | archetype | passive | no plan |  |
| Arcana of Iron | 6 | archetype | passive | no plan |  |
| Artery Map | 6 | archetype | passive | no plan |  |
| Axe Thrower | 6 | archetype | passive | no plan |  |
| Cayden's Freedom | 6 | archetype | passive | plan | it grants Liberate Self: its Effect has nothing a fight counts |
| Concealing Currents | 6 | archetype | passive | no plan |  |
| Confounding Image | 6 | archetype | passive | no plan |  |
| Crowd Mastery | 6 | archetype | passive | no plan |  |
| Cutting Heaven, Crushing Earth | 6 | archetype | passive | no plan |  |
| Daywalker (Vampire) | 6 | archetype | passive | no plan |  |
| Distracting Bites | 6 | archetype | passive | plan | a passive's roll with no action to use it |
| Endemic Herbs | 6 | archetype | passive | no plan |  |
| Feeding Frenzy | 6 | archetype | passive | no plan |  |
| Flexible Nexus | 6 | archetype | passive | no plan |  |
| Flowing Palm Deflection | 6 | archetype | passive | no plan |  |
| Gear Up | 6 | archetype | passive | plan | it grants one of 2 (Prescient Planner: the feat module reads nothing for it; Prescient Consumable: the feat module reads |
| Grave Mummification | 6 | archetype | passive | no plan |  |
| Gray Corsair Training | 6 | archetype | passive | plan | it grants Pirate Dedication: the feat module reads nothing for it |
| Hellknight Preferment | 6 | archetype | passive | no plan |  |
| Inevitable Thralls | 6 | archetype | passive | plan | it grants Inevitable Return: the feat module reads nothing for it |
| Inexorable | 6 | archetype | passive | no plan |  |
| No Hard Feelings | 6 | archetype | passive | no plan |  |
| Plague Rat | 6 | archetype | passive | plan | a reaction to "passive" |
| Poisoned Sticks and Stones | 6 | archetype | passive | no plan |  |
| Powerful Lash | 6 | archetype | passive | no plan |  |
| Relentless Disarm | 6 | archetype | passive | no plan |  |
| Remote Trigger | 6 | archetype | passive | no plan |  |
| Soul Bleed | 6 | archetype | passive | no plan |  |
| Stone Blood | 6 | archetype | passive | no plan |  |
| Stone Blood (Stonebound) | 6 | archetype | passive | no plan |  |
| Superior Propulsion | 6 | archetype | passive | no plan |  |
| Surprise Strike | 6 | archetype | passive | no plan |  |
| Uneasy Rest | 6 | archetype | passive | no plan |  |
| Volatile Grease | 6 | archetype | passive | no plan |  |
| Accurate Swing | 8 | archetype | passive | no plan |  |
| Beacon Mark | 8 | archetype | passive | no plan |  |
| Call Your Shot | 8 | archetype | passive | no plan |  |
| Chaining Mutation | 8 | archetype | passive | no plan |  |
| Controlled Blast | 8 | archetype | passive | no plan |  |
| Creed Magic | 8 | archetype | passive | no plan |  |
| Deadly Mutation | 8 | archetype | passive | no plan |  |
| Glyph Expert | 8 | archetype | passive | plan | a passive's Effect posted by hand |
| Grasping Corpses | 8 | archetype | passive | plan | a passive's roll with no action to use it |
| Impervious Vehicle | 8 | archetype | passive | no plan |  |
| Interposing Crowd | 8 | archetype | passive | no plan |  |
| Jumping Jenny Display | 8 | archetype | passive | plan | it grants Jumping Jenny: a timer with no rules a fight counts |
| Lingering Flames | 8 | archetype | passive | no plan |  |
| Magpie Manor Recovery | 8 | archetype | passive | no plan |  |
| Necromantic Bulwark | 8 | archetype | passive | no plan |  |
| Palatine Strike | 8 | archetype | passive | no plan |  |
| Practiced Guidance | 8 | archetype | passive | no plan |  |
| Pushing Wind | 8 | archetype | passive | plan | a passive's Effect on other creatures |
| Reading the Signs | 8 | archetype | passive | plan | a passive's Effect posted by hand |
| Reflexive Grip | 8 | archetype | passive | no plan |  |
| Scarecrow | 8 | archetype | passive | no plan |  |
| Selfless Parry | 8 | archetype | passive | plan | an Effect on another creature |
| Siphoning Touch | 8 | archetype | passive | no plan |  |
| Stasian Charge | 8 | archetype | passive | plan | a passive's Strike |
| Steal Vitality | 8 | archetype | passive | no plan |  |
| Topple Giants | 8 | archetype | passive | plan | a passive's Effect on other creatures |
| Unshaken in Iron | 8 | archetype | passive | no plan |  |
| Vantage Shot | 8 | archetype | passive | no plan |  |
| Vicious Fangs | 8 | archetype | passive | no plan |  |
| Wall of Roses | 8 | archetype | passive | plan | a spell the engine doesn't cast (Wall of Thorns) |
| World-Wise Vigilance | 8 | archetype | passive | no plan |  |
| And Yet it Still Hurts | 10 | archetype | passive | plan | a passive's roll with no action to use it |
| Beast Dynamo Howl | 10 | archetype | passive | no plan |  |
| Bestiary Scholar | 10 | archetype | passive | no plan |  |
| Counterclockwork Focus | 10 | archetype | passive | no plan |  |
| Crack Retort | 10 | archetype | passive | no plan |  |
| Daring Flourish | 10 | archetype | passive | plan | a passive's roll with no action to use it |
| Deepening Devotion | 10 | archetype | passive | no plan |  |
| Demanding Challenge | 10 | archetype | passive | plan | an Effect on another creature |
| Destructive Block | 10 | archetype | passive | no plan |  |
| Flailtongue | 10 | archetype | passive | plan | a passive's Effect posted by hand |
| Ghostsong | 10 | archetype | passive | no plan |  |
| Hidden Intentions | 10 | archetype | passive | plan | it grants one of 2 (Doublespeak: the feat module reads nothing for it; Slippery Secrets: the feat module reads nothing f |
| Hook 'Em | 10 | archetype | passive | no plan |  |
| Lastwall Warden | 10 | archetype | passive | no plan |  |
| Mask of the 12th Step | 10 | archetype | passive | no plan |  |
| Secrets of Steel | 10 | archetype | passive | no plan |  |
| Shadow of Death | 10 | archetype | passive | no plan |  |
| Sin Counterspell | 10 | archetype | passive | no plan |  |
| Spiritual Flurry | 10 | archetype | passive | no plan |  |
| Stonebane | 10 | archetype | passive | no plan |  |
| Sweeping Fan Redirection | 10 | archetype | passive | no plan |  |
| Tiller's Aid | 10 | archetype | passive | no plan |  |
| Toppling Tentacles | 10 | archetype | passive | no plan |  |
| Unobstructed Shot | 10 | archetype | passive | no plan |  |
| Widen the Gap | 10 | archetype | passive | no plan |  |
| Alchemical Power | 12 | archetype | passive | no plan |  |
| Billowing Wings | 12 | archetype | passive | no plan |  |
| Choking Smoke | 12 | archetype | passive | no plan |  |
| Competitive Eater | 12 | archetype | passive | plan | a passive's roll with no action to use it |
| Coordinated Tactics | 12 | archetype | passive | no plan |  |
| Corpse Stench | 12 | archetype | passive | plan | a reaction to "aura" |
| Daredevil's Gambit | 12 | archetype | passive | plan | a passive's Effect posted by hand |
| Eagle Eyes | 12 | archetype | passive | no plan |  |
| Evasiveness | 12 | archetype | passive | no plan |  |
| Festering Wounds | 12 | archetype | passive | no plan |  |
| Frightening Appearance | 12 | archetype | passive | no plan |  |
| Greater Despair | 12 | archetype | passive | no plan |  |
| Inescapable Grasp | 12 | archetype | passive | plan | its Effect has nothing a fight counts |
| Infectious Emotions | 12 | archetype | passive | no plan |  |
| Ironclad Fortitude | 12 | archetype | passive | no plan |  |
| Janatimo's Lessons | 12 | archetype | passive | no plan |  |
| Juggernaut's Fortitude | 12 | archetype | passive | no plan |  |
| Legs of Stone | 12 | archetype | passive | no plan |  |
| Lesson of Unified Elusion | 12 | archetype | passive | no plan |  |
| Mass Delusion | 12 | archetype | passive | no plan |  |
| Metallic Envisionment | 12 | archetype | passive | no plan |  |
| Packed with Flavor | 12 | archetype | passive | no plan |  |
| Perfection's Path | 12 | archetype | passive | no plan |  |
| Redirect Spell | 12 | archetype | passive | no plan |  |
| Secrets of Shadow | 12 | archetype | passive | no plan |  |
| Sword of Sealing | 12 | archetype | passive | plan | a passive's roll with no action to use it |
| Sympathetic Portrayal | 12 | archetype | passive | no plan |  |
| Thorn in Hell's Side | 12 | archetype | passive | no plan |  |
| Uncanny Suction | 12 | archetype | passive | no plan |  |
| Undying Beast | 12 | archetype | passive | no plan |  |
| Virtuosic Dancer | 12 | archetype | passive | plan | it grants Dancing Dodge: the feat module reads nothing for it |
| Ward Slumber | 12 | archetype | passive | no plan |  |
| Wild Strider | 12 | archetype | passive | plan | it grants Unimpeded Journey: the feat module reads nothing for it |
| Aldori's Retort | 14 | archetype | passive | no plan |  |
| Concentrated Assault | 14 | archetype | passive | no plan |  |
| Consecrated Aura | 14 | archetype | passive | no plan |  |
| Defy Chains | 14 | archetype | passive | no plan |  |
| Dual Onslaught | 14 | archetype | passive | no plan |  |
| Enshroud Soul Cage | 14 | archetype | passive | no plan |  |
| Immediate Rebuke | 14 | archetype | passive | no plan |  |
| Lesson of the Hurricane's Might | 14 | archetype | passive | no plan |  |
| Pact of the Death Hunter | 14 | archetype | passive | no plan |  |
| Sixth Pillar Mastery | 14 | archetype | passive | no plan |  |
| Tactical Cadence | 14 | archetype | passive | no plan |  |
| Terrible Transformation | 14 | archetype | passive | no plan |  |
| Throttle the Divine | 14 | archetype | passive | plan | a passive's roll with no action to use it |
| Unseen Shot | 14 | archetype | passive | no plan |  |
| Winter's Kiss | 14 | archetype | passive | no plan |  |
| Fearsome Fangs | 16 | archetype | passive | no plan |  |
| Free from Bonds | 16 | archetype | passive | plan | a passive's roll with no action to use it |
| Healing Sanctuary | 16 | archetype | passive | plan | a passive's Effect on other creatures |
| Lead the Pack | 16 | archetype | passive | no plan |  |
| Rallying Charge (Knight Vigilant) | 16 | archetype | passive | no plan |  |
| Shared Mind, Shared Heart | 16 | archetype | passive | no plan |  |
| Stunning Appearance | 16 | archetype | passive | no plan |  |
| Withstand Death | 16 | archetype | passive | no plan |  |
| Emboldened with Glorious Purpose | 18 | archetype | passive | plan | a passive's Effect posted by hand |
| Ever Dreaming | 18 | archetype | passive | no plan |  |
| Fight Choreography | 18 | archetype | passive | plan | it grants Swift Choreography: the feat module reads nothing for it |
| Repelling Enforcer | 18 | archetype | passive | no plan |  |
| School Spell Redirection | 18 | archetype | passive | no plan |  |
| Stave off Catastrophe | 18 | archetype | passive | no plan |  |
| Uncanny Vitae | 18 | archetype | passive | no plan |  |
| Aldori Swordlord | 20 | archetype | passive | no plan |  |
| Empyreal Aura | 20 | archetype | passive | plan | a reaction to "aura" |
| Pack Takedown | 20 | archetype | passive | no plan |  |
| Vigil's Palisades | 20 | archetype | passive | no plan |  |
| Instinctive Strike | 8 | barbarian | passive | no plan |  |
| Overpowering Charge | 10 | barbarian | passive | no plan |  |
| Awesome Blow | 14 | barbarian | passive | plan | a passive's roll with no action to use it |
| Collateral Thrash | 16 | barbarian | passive | plan | a passive's roll with no action to use it |
| Brilliant Flash | 1 | champion | passive | no plan |  |
| Iron Repercussions | 1 | champion | passive | no plan |  |
| Ongoing Selfishness | 1 | champion | passive | plan | a passive's Effect posted by hand |
| Unimpeded Step | 1 | champion | passive | no plan |  |
| Vicious Vengeance | 1 | champion | passive | no plan |  |
| Aura of Despair | 4 | champion | passive | no plan |  |
| Cruelty | 4 | champion | passive | no plan |  |
| Greater Mercy | 8 | champion | passive | no plan |  |
| Greater Security | 8 | champion | passive | no plan |  |
| Divine Wall | 12 | champion | passive | no plan |  |
| Lasting Doubt | 12 | champion | passive | no plan |  |
| Liberating Stride | 12 | champion | passive | no plan |  |
| Necromantic Deflection | 12 | champion | passive | no plan |  |
| Aura of Life | 14 | champion | passive | no plan |  |
| Aura of Righteousness | 14 | champion | passive | no plan |  |
| Greater Interpose | 14 | champion | passive | no plan |  |
| Deadly Simplicity | 1 | cleric | passive | plan | its requirement, which the PC doesn't meet (the weapon its damage die upgrade names) |
| Divine Castigation | 1 | cleric | passive | no plan |  |
| Panic the Dead | 2 | cleric | passive | plan | a passive's roll with no action to use it |
| Sap Life | 2 | cleric | passive | no plan |  |
| Selective Energy | 6 | cleric | passive | no plan |  |
| Cremate Undead | 8 | cleric | passive | plan | a passive's roll with no action to use it |
| Emblazon Energy | 8 | cleric | passive | no plan |  |
| Shared Avoidance | 10 | cleric | passive | no plan |  |
| Emblazon Antimagic | 12 | cleric | passive | no plan |  |
| Necromancer's Visage | 12 | cleric | passive | no plan |  |
| Shared Replenishment | 12 | cleric | passive | no plan |  |
| Deity's Protection | 14 | cleric | passive | no plan |  |
| Shared Clarity | 18 | cleric | passive | no plan |  |
| Observational Analysis | 4 | commander | passive | no plan |  |
| Fortunate Blow | 12 | commander | passive | no plan |  |
| Contact With the Enemy | 14 | commander | passive | no plan |  |
| Fire Lung | 1 | druid | passive | no plan |  |
| Steadying Stone | 1 | druid | passive | no plan |  |
| Pristine Weapon | 10 | druid | passive | no plan |  |
| Heart of the Kaiju | 20 | druid | passive | plan | a reaction to "passive" |
| Energized Spark | 1 | exemplar | passive | no plan |  |
| Remake the World | 20 | exemplar | passive | no plan |  |
| Powerful Shove | 4 | fighter | passive | plan | a passive's roll with no action to use it |
| Shielded Stride | 4 | fighter | passive | no plan |  |
| Flinging Shove | 12 | fighter | passive | no plan |  |
| Guiding Riposte | 14 | fighter | passive | no plan |  |
| Improved Reflexive Shield | 16 | fighter | passive | no plan |  |
| Raise Haft | 2 | guardian | passive | no plan |  |
| Area Armor | 4 | guardian | passive | no plan |  |
| Energy Interceptor | 4 | guardian | passive | no plan |  |
| Sure-Footed | 10 | guardian | passive | no plan |  |
| Great Shield Mastery | 20 | guardian | passive | plan | a passive's Effect posted by hand |
| Sword and Pistol | 1 | gunslinger | passive | no plan |  |
| Defensive Armaments | 2 | gunslinger | passive | no plan |  |
| Defy Fey | 6 | gunslinger | passive | no plan |  |
| Leap and Fire | 8 | gunslinger | passive | no plan |  |
| Unshakable Grit | 12 | gunslinger | passive | no plan |  |
| Disruptive Blur | 14 | gunslinger | passive | no plan |  |
| Showstopper | 14 | gunslinger | passive | no plan |  |
| Ricochet Master | 16 | gunslinger | passive | no plan |  |
| Unerring Shot | 18 | gunslinger | passive | no plan |  |
| Ricochet Legend | 20 | gunslinger | passive | plan | a reaction to "passive" |
| Slinger's Reflexes | 20 | gunslinger | passive | no plan |  |
| Gigavolt | 12 | inventor | passive | no plan |  |
| Takedown Expert | 1 | investigator | passive | no plan |  |
| Trap Finder | 1 | investigator | passive | no plan |  |
| Shared Stratagem | 2 | investigator | passive | plan | a passive's roll with no action to use it |
| Scalpel's Point | 4 | investigator | passive | no plan |  |
| Strategic Assessment | 4 | investigator | passive | no plan |  |
| Strategic Repose | 4 | investigator | passive | no plan |  |
| Clue Them All In | 8 | investigator | passive | no plan |  |
| Empiricist's Eye | 12 | investigator | passive | no plan |  |
| Make 'Em Sweat | 12 | investigator | passive | plan | a passive's roll with no action to use it |
| Strategic Bypass | 14 | investigator | passive | no plan |  |
| Didactic Strike | 16 | investigator | passive | plan | a passive's Effect on other creatures |
| Versatile Blasts | 1 | kineticist | passive | no plan |  |
| Knowledge is Power | 6 | magus | passive | no plan |  |
| Dimensional Disappearance | 10 | magus | passive | no plan |  |
| Dancing Leaf | 2 | monk | passive | no plan |  |
| Elemental Fist | 2 | monk | passive | no plan |  |
| Guarded Movement | 4 | monk | passive | no plan |  |
| Return Fire | 6 | monk | passive | plan | its stance (Monastic Archer Stance): the feat module reads nothing for it |
| Water Step | 6 | monk | passive | no plan |  |
| Entwined Energy Ki | 10 | monk | passive | no plan |  |
| Improved Knockback | 12 | monk | passive | no plan |  |
| One-Millimeter Punch | 16 | monk | passive | plan | a reaction to "passive" |
| Immortal Techniques | 20 | monk | passive | plan | a passive's roll with no action to use it |
| Endless Return | 12 | necromancer | passive | no plan |  |
| Reanimate Foe | 18 | necromancer | passive | plan | a spell the engine doesn't cast (Reanimate Foe) |
| Final Union | 20 | necromancer | passive | plan | it grants Additional Lore: the feat module reads nothing for it |
| Bestiary Secrets | 1 | other | passive | no plan |  |
| The Harder They Fall (Hellknight) | 1 | other | passive | plan | a passive's Effect posted by hand |
| Binds That Tie | 2 | other | passive | no plan |  |
| Devil's Eye | 4 | other | passive | plan | it grants Objection: the feat module reads nothing for it |
| Unending Subsistence | 4 | other | passive | no plan |  |
| Elysium's Cadence | 6 | other | passive | plan | it grants Set Free: its Effect has nothing a fight counts |
| Fling Into Action | 6 | other | passive | no plan |  |
| Mythic Allies | 8 | other | passive | plan | a passive's Effect on other creatures |
| Windborne Shove | 8 | other | passive | no plan |  |
| Disperse Into Petals | 10 | other | passive | plan | it grants Verdant Core Deviant Classification: the feat module reads nothing for it |
| Avenger of Envy | 14 | other | passive | plan | it grants Aegis of Envy: a timer with no rules a fight counts |
| Avenger of Lust | 14 | other | passive | plan | it grants Sorshen's Devotion: a plan the engine can't play (its targeting or what it does) |
| Avenger of Wrath | 14 | other | passive | plan | it grants Host of Wrath: a timer with no rules a fight counts |
| Avoid Fate's Gaze | 14 | other | passive | no plan |  |
| Decree of Banishment | 14 | other | passive | no plan |  |
| Heroic Weakness | 14 | other | passive | plan | it grants Makes Me Stronger: the feat module reads nothing for it |
| Jousting Mount | 14 | other | passive | no plan |  |
| Steadfast Grip | 14 | other | passive | no plan |  |
| Echoing Fury | 16 | other | passive | no plan |  |
| Gird Champion | 16 | other | passive | no plan |  |
| Let Death be my Weapon | 16 | other | passive | plan | it grants Share Death's Promises: a timer with no rules a fight counts |
| Marshall Fiendish Forces | 16 | other | passive | no plan |  |
| Momentary Respite | 16 | other | passive | plan | a passive's roll with no action to use it |
| Realm Strider | 16 | other | passive | plan | a spell the engine doesn't cast (Translocate) |
| Terrifying Mien | 16 | other | passive | plan | its Effect has nothing a fight counts |
| Vigorous Victor | 16 | other | passive | no plan |  |
| Walk on the Wind | 16 | other | passive | no plan |  |
| Mythic Weapon Specialization | 18 | other | passive | no plan |  |
| Not This Time | 18 | other | passive | plan | a reaction to "passive" |
| Rebellious Existence | 18 | other | passive | no plan |  |
| Unstoppable Force | 18 | other | passive | plan | a reaction to "passive" |
| Craft Runewell | 20 | other | passive | plan | it grants Enter Runewell: the feat module reads nothing for it |
| Eternal Hero | 20 | other | passive | no plan |  |
| Fight Through Oblivion | 20 | other | passive | no plan |  |
| I am the Weapon | 20 | other | passive | no plan |  |
| Immortal Ruin | 20 | other | passive | no plan |  |
| Once and Future | 20 | other | passive | no plan |  |
| Timelessness | 20 | other | passive | no plan |  |
| You Can't Kill an Idea | 20 | other | passive | no plan |  |
| Thoughtform Summoning | 4 | psychic | passive | no plan |  |
| Monster Warden | 2 | ranger | passive | no plan |  |
| Animal Strength | 6 | ranger | passive | no plan |  |
| Snap Shot | 6 | ranger | passive | no plan |  |
| Powerful Snares | 8 | ranger | passive | no plan |  |
| Improved Twin Riposte (Ranger) | 16 | ranger | passive | no plan |  |
| Tumble Behind (Rogue) | 1 | rogue | passive | no plan |  |
| Strong Arm | 2 | rogue | passive | no plan |  |
| Far Throw | 6 | rogue | passive | no plan |  |
| Light Step | 6 | rogue | passive | no plan |  |
| Sly Disarm | 6 | rogue | passive | no plan |  |
| Ambushing Knockdown | 8 | rogue | passive | plan | a passive's Strike |
| Methodical Debilitations | 10 | rogue | passive | plan | a passive's Effect on other creatures |
| Ricochet Feint | 12 | rogue | passive | no plan |  |
| Cloud Step | 16 | rogue | passive | no plan |  |
| Smithing Weapons | 1 | runesmith | passive | no plan |  |
| Propelling Sorcery | 2 | sorcerer | passive | no plan |  |
| Explosion of Power | 8 | sorcerer | passive | no plan |  |
| Blood Sovereignty | 12 | sorcerer | passive | no plan |  |
| Consume Spell | 14 | sorcerer | passive | no plan |  |
| Reflect Harm | 14 | sorcerer | passive | no plan |  |
| Bloodline Mutation | 20 | sorcerer | passive | no plan |  |
| Plummeting Roll | 1 | swashbuckler | passive | plan | it grants one of 2 (Cat Fall: the feat module reads nothing for it; Plummeting Roll: the feat module reads nothing for i |
| Tumble Behind (Swashbuckler) | 2 | swashbuckler | passive | no plan |  |
| Reflexive Riposte | 10 | swashbuckler | passive | no plan |  |
| Impossible Riposte | 14 | swashbuckler | passive | no plan |  |
| Shared Warding | 12 | thaumaturge | passive | plan | an Effect on another creature |
| Grand Scroll Esoterica | 18 | thaumaturge | passive | no plan |  |
| Syu Tak-nwa's Deadly Hair | 6 | witch | passive | no plan |  |
| Witch's Hut | 20 | witch | passive | no plan |  |
| Spell Combination | 20 | wizard | passive | no plan |  |

## Spellcasting (slots, focus, spellshapes) (271)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Channeler's Stance | 1 | animist | 1 action | no plan |  |
| Conceal Spell | 2 | animist | 1 action | no plan |  |
| Embodiment of the Balance | 2 | animist | passive | no plan |  |
| Grasping Spirits Spell | 2 | animist | 1 action | no plan |  |
| Apparition's Enhancement | 4 | animist | free | no plan |  |
| Walk the Wilds | 4 | animist | passive | no plan |  |
| Apparition's Reflection | 8 | animist | 1 action | plan | a timer with no rules a fight counts |
| Wind Seeker | 8 | animist | passive | no plan |  |
| Monstrous Inclinations | 16 | animist | passive | no plan |  |
| Spiritual Spellshape Stance | 16 | animist | 1 action | no plan |  |
| Echoing Channel | 18 | animist | 1 action | no plan |  |
| True Channel Spell | 20 | animist | passive | no plan |  |
| First Frost | 2 | archetype | passive | no plan |  |
| Attunement Shift | 4 | archetype | free | plan | its requirement (Your previous action was to cast a spell with the air, cold, earth, fire, plant, or water trait) |
| Basic Bard Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Cathartic Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Hedge Mage Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Necromancer Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Oracle Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Pactbreaker Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Prophet Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Psychic Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Rivethun Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Sorcerer Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Wizard Spellcasting | 4 | archetype | passive | no plan |  |
| Blood Calls Blood | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Crystal Ward Spells | 4 | archetype | passive | plan | a spell the engine doesn't cast (Electrified Crystal Ward) |
| Dousing Spell | 4 | archetype | 1 action | no plan |  |
| Gusting Spell | 4 | archetype | 1 action | no plan |  |
| Harrow Casting | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Mage's Field Dressing | 4 | archetype | 1 action | no plan |  |
| Magic Warrior Aspect | 4 | archetype | passive | plan | a spell the engine doesn't cast (Magic Warrior Aspect) |
| Magic Warrior Transformation | 4 | archetype | passive | plan | a spell the engine doesn't cast (Magic Warrior Transformation) |
| Minor Deific Power | 4 | archetype | passive | no plan |  |
| Painful Spell | 4 | archetype | 1 action | no plan |  |
| Pin the Spears in the Lamb | 4 | archetype | passive | no plan |  |
| Rising Blood Magic | 4 | archetype | passive | no plan |  |
| Seneschal Spell | 4 | archetype | 1 action | no plan |  |
| Shield Spell Reinforcement | 4 | archetype | free | no plan |  |
| Snowcaster | 4 | archetype | passive | no plan |  |
| Tender Ministrations | 4 | archetype | 1 action | no plan |  |
| Wayfinder Resonance Tinkerer | 4 | archetype | passive | no plan |  |
| Basic Magus Spellcasting | 6 | archetype | passive | no plan |  |
| Beastmaster's Trance | 6 | archetype | passive | plan | a spell the engine doesn't cast (Beastmaster Trance) |
| Cascade Bearer's Flexibility | 6 | archetype | free | no plan |  |
| Heightened Captivation | 6 | archetype | 1 action | no plan |  |
| Humble Spell | 6 | archetype | 1 action | no plan |  |
| Red Mantis School Spell | 6 | archetype | passive | no plan |  |
| Sinbladed Spell | 6 | archetype | 1 action | no plan |  |
| Siphon Magic | 6 | archetype | 1 action | no plan |  |
| Spiritual Secret | 6 | archetype | free | no plan |  |
| Tempest-Sun Redirection | 6 | archetype | 1 action | no plan |  |
| Urgent Upwelling | 6 | archetype | reaction | no plan |  |
| Vengeful Spirit Deck | 6 | archetype | 2 actions | no plan |  |
| Wisteria-and-Peony Reunion | 6 | archetype | free | no plan |  |
| Apparition Magic | 8 | archetype | passive | no plan |  |
| Basic Beast Gunner Spellcasting | 8 | archetype | passive | no plan |  |
| Basic Eldritch Archer Spellcasting | 8 | archetype | passive | no plan |  |
| Blessed Spell | 8 | archetype | 1 action | no plan |  |
| Countercharm | 8 | archetype | reaction | no plan |  |
| Enhance Spell | 8 | archetype | 1 action | no plan |  |
| Glimpse the Netherworld | 8 | archetype | passive | no plan |  |
| Mantis Form | 8 | archetype | passive | plan | a spell the engine doesn't cast (Mantis Form) |
| Simple Mastery | 8 | archetype | 1 action | no plan |  |
| What Could Have Been | 8 | archetype | free | no plan |  |
| Cascade Bearer's Spellcasting | 10 | archetype | passive | no plan |  |
| Eldritch Reload | 10 | archetype | free | no plan |  |
| Expert Skysage Divination | 10 | archetype | passive | no plan |  |
| Halcyon Spellcasting Initiate | 10 | archetype | passive | no plan |  |
| Into the Future | 10 | archetype | 1 action | no plan |  |
| Recover Spell | 10 | archetype | 1 action | no plan |  |
| Rockslide Spell | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Shadow Magic | 10 | archetype | passive | plan | a spell the engine doesn't cast (Dance of Darkness, Shadow Jump) |
| Shadow Reservoir | 10 | archetype | passive | no plan |  |
| Spellmaster's Ward | 10 | archetype | passive | plan | a spell the engine doesn't cast (Spellmaster's Ward) |
| Tempest-Sun Shielding | 10 | archetype | reaction | no plan |  |
| Additional Shadow Magic | 12 | archetype | passive | no plan |  |
| Afterimage | 12 | archetype | free | plan | a timer with no rules a fight counts |
| Battlefield Arcana | 12 | archetype | passive | no plan |  |
| Expert Hedge Mage Spellcasting | 12 | archetype | passive | no plan |  |
| Flexible Halcyon Spellcasting | 12 | archetype | passive | no plan |  |
| Interfering Surge | 12 | archetype | reaction | no plan |  |
| Maneuvering Spell | 12 | archetype | free | plan | a teleport |
| Shadow Illusion | 12 | archetype | passive | plan | a spell the engine doesn't cast (Shadow Illusion) |
| Six Pillars Stance | 12 | archetype | 1 action | no plan |  |
| Sunless Slide | 12 | archetype | 2 actions | plan | a teleport |
| Surging Blood Magic | 12 | archetype | passive | no plan |  |
| Absorb Spell | 14 | archetype | reaction | no plan |  |
| Community Needs | 14 | archetype | passive | no plan |  |
| Halcyon Spellcasting Adept | 14 | archetype | passive | no plan |  |
| Shattered Sacrament | 14 | archetype | passive | no plan |  |
| Wind-Tossed Spell | 14 | archetype | 1 action | no plan |  |
| Branding Spell | 16 | archetype | free | no plan |  |
| Heraldic Proclamation | 16 | archetype | 1 action | no plan |  |
| Master Skysage Divination | 16 | archetype | passive | no plan |  |
| Master's Counterspell | 16 | archetype | reaction | no plan |  |
| Quickened Attunement | 16 | archetype | free | no plan |  |
| Spell Gem | 16 | archetype | passive | no plan |  |
| Touch Focus | 16 | archetype | free | no plan |  |
| Vellumis Excision | 16 | archetype | passive | no plan |  |
| Deific Font | 18 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Exultant Blood Magic | 18 | archetype | passive | no plan |  |
| Halcyon Spellcasting Sage | 18 | archetype | passive | no plan |  |
| Master Hedge Mage Spellcasting | 18 | archetype | passive | no plan |  |
| Retain Absorbed Spell | 18 | archetype | passive | no plan |  |
| Tripartite Omen | 18 | archetype | passive | no plan |  |
| Synergistic Spell | 20 | archetype | 1 action | no plan |  |
| Courageous Advance | 4 | bard | 1 action | no plan |  |
| In Tune | 4 | bard | 1 action | no plan |  |
| Defensive Coordination | 6 | bard | 1 action | no plan |  |
| Harmonize | 6 | bard | 1 action | no plan |  |
| Song of Marching | 6 | bard | passive | plan | a spell the engine doesn't cast (Song of Marching) |
| Accompany | 8 | bard | reaction | no plan |  |
| Call and Response | 8 | bard | 1 action | no plan |  |
| Chaotic Spell | 8 | bard | 1 action | plan | a choice of ways the simulator doesn't play |
| Helt's Spelldance | 8 | bard | 3 actions | no plan |  |
| House of Imaginary Walls | 10 | bard | passive | plan | a spell the engine doesn't cast (House of Imaginary Walls) |
| Unusual Composition | 10 | bard | 1 action | no plan |  |
| Shared Sight | 12 | bard | 1 action | plan | a timer with no rules a fight counts |
| Vigorous Anthem | 14 | bard | 1 action | no plan |  |
| Studious Capacity | 16 | bard | passive | no plan |  |
| Perfect Encore | 20 | bard | passive | no plan |  |
| Desperate Prayer | 1 | champion | free | no plan |  |
| Splinter Faith | 1 | champion | passive | no plan |  |
| Retributive Focus | 18 | champion | free | plan | a Focus or Mythic Point back |
| Command Undead | 4 | cleric | 1 action | plan | a roll whose results the simulator doesn't read |
| Divine Infusion | 4 | cleric | 1 action | no plan |  |
| Prayer-Touched Weapon | 4 | cleric | free | no plan |  |
| Cast Down | 6 | cleric | 1 action | no plan |  |
| Detonating Spell | 6 | cleric | 1 action | no plan |  |
| Surging Focus | 8 | cleric | free | plan | a Focus or Mythic Point back |
| Consecrate Spell | 10 | cleric | 1 action | plan | a choice of ways the simulator doesn't play |
| Heroic Recovery | 10 | cleric | 1 action | no plan |  |
| Shield of Faith | 10 | cleric | passive | no plan |  |
| Through Spell | 10 | cleric | 1 action | no plan |  |
| Ebb and Flow | 14 | cleric | 1 action | no plan |  |
| Sepulchral Sublimation | 14 | cleric | 1 action | no plan |  |
| Remediate | 16 | cleric | free | no plan |  |
| Improved Swift Banishment | 18 | cleric | passive | no plan |  |
| Maker of Miracles | 20 | cleric | passive | no plan |  |
| Spellshape Channel | 20 | cleric | free | no plan |  |
| Cryptic Spell | 4 | druid | 1 action | no plan |  |
| Form Control | 4 | druid | 1 action | no plan |  |
| Snowdrift Spell | 4 | druid | 1 action | plan | a timer with no rules a fight counts |
| Healing Transformation | 10 | druid | 1 action | no plan |  |
| Overwhelming Energy | 10 | druid | 1 action | no plan |  |
| Explosive Metamorphosis | 12 | druid | 1 action | no plan |  |
| Purifying Spell | 12 | druid | 1 action | no plan |  |
| Uplifting Winds | 12 | druid | passive | no plan |  |
| Bizarre Transformation | 14 | druid | 1 action | no plan |  |
| Sow Spell | 14 | druid | 1 action | no plan |  |
| Emancipator's Mask | 20 | druid | passive | no plan |  |
| Hierophant's Power | 20 | druid | passive | no plan |  |
| Ley Line Conduit | 20 | druid | 1 action | no plan |  |
| Protective Spirit Mask | 20 | druid | passive | no plan |  |
| Stalking Feline Mask | 20 | druid | passive | no plan |  |
| Thick Hide Mask | 20 | druid | passive | no plan |  |
| Tireless Guide's Mask | 20 | druid | passive | no plan |  |
| Vigilant Mask | 20 | druid | passive | no plan |  |
| Kinetic Activation | 2 | kineticist | passive | no plan |  |
| Steady Spellcasting (Magus) | 4 | magus | passive | no plan |  |
| Student of the Staff | 4 | magus | passive | no plan |  |
| Shielded Tome | 6 | magus | passive | no plan |  |
| Spell Crash | 6 | magus | 2 actions | no plan |  |
| Standby Spell | 8 | magus | passive | no plan |  |
| Whirlpool's Pull | 8 | magus | 1 action | no plan |  |
| Lunging Spellstrike | 10 | magus | 2 actions | no plan |  |
| Vermillion Threads | 10 | magus | reaction | plan | a lasting area |
| Align Qi | 6 | monk | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Overwhelming Breath | 12 | monk | 1 action | no plan |  |
| Qi Center | 18 | monk | free | no plan |  |
| Reach of the Dead | 1 | necromancer | free | no plan |  |
| Conjurer of Corpses | 6 | necromancer | passive | no plan |  |
| Overburdening Spell | 10 | necromancer | 1 action | no plan |  |
| Skeletal Extension | 10 | necromancer | free | no plan |  |
| Unholy Resurrection | 14 | necromancer | passive | no plan |  |
| Beckoning Dirge | 16 | necromancer | free | no plan |  |
| Mortem Ultimatum | 20 | necromancer | passive | no plan |  |
| Foretell Harm | 1 | oracle | free | plan | a plan the engine can't play (its targeting or what it does) |
| Knowledge of Shapes | 4 | oracle | free | no plan |  |
| Gifted Power | 6 | oracle | passive | no plan |  |
| Surging Might | 8 | oracle | 1 action | no plan |  |
| Mysterious Repertoire | 14 | oracle | passive | no plan |  |
| Conduit of Void and Vitality | 16 | oracle | 2 actions | no plan |  |
| Portentous Spell | 16 | oracle | 1 action | no plan |  |
| Divine Effusion | 18 | oracle | passive | no plan |  |
| Mystery Conduit | 20 | oracle | free | no plan |  |
| Oracular Providence | 20 | oracle | passive | no plan |  |
| Basic Spellcasting | 4 | other | passive | no plan |  |
| Irezoko Tattoo | 4 | other | passive | no plan |  |
| Mythic Counterspell | 6 | other | reaction | no plan |  |
| Mythic Magic | 8 | other | passive | plan | it grants Cast a Spell: the feat module reads nothing for it |
| Mythic Casting | 10 | other | 1 action | no plan |  |
| Mythic Heightening | 14 | other | 1 action | no plan |  |
| Reliable Magic | 14 | other | passive | no plan |  |
| Shining Runes | 14 | other | passive | no plan |  |
| Willing Runes | 14 | other | passive | plan | it grants Draw From the Pages: the feat module reads nothing for it |
| Cleansing Spell | 16 | other | 1 action | no plan |  |
| Daunting Spell | 16 | other | passive | no plan |  |
| Imbue Spell | 16 | other | free | no plan |  |
| Recharging Transference | 16 | other | 1 action | no plan |  |
| Contagious Spell | 18 | other | 1 action | no plan |  |
| Galvanize Spell | 18 | other | free | no plan |  |
| Surging Interference | 20 | other | reaction | no plan |  |
| Counter Thought | 1 | psychic | reaction | no plan |  |
| Psychic Rapport | 1 | psychic | passive | no plan |  |
| Mental Balm | 2 | psychic | passive | no plan |  |
| Warp Space | 2 | psychic | passive | no plan |  |
| Homing Beacon | 4 | psychic | passive | no plan |  |
| Psi Strikes | 4 | psychic | free | no plan |  |
| Inertial Barrier | 6 | psychic | passive | no plan |  |
| Parallel Breakthrough | 6 | psychic | passive | no plan |  |
| Strain Mind | 6 | psychic | free | no plan |  |
| Dark Persona's Presence | 8 | psychic | free | plan | a plan the engine can't play (its targeting or what it does) |
| Remove Presence | 8 | psychic | passive | no plan |  |
| Whispering Steps | 8 | psychic | passive | no plan |  |
| Foreseen Failure | 12 | psychic | free | no plan |  |
| No!!! | 12 | psychic | reaction | plan | a timer with no rules a fight counts |
| Conscious Spell Specialization | 14 | psychic | passive | no plan |  |
| Deep Roots | 14 | psychic | passive | no plan |  |
| Shatter Space | 14 | psychic | passive | no plan |  |
| Target of Psychic Ire | 16 | psychic | passive | no plan |  |
| Wandering Thoughts | 16 | psychic | free | plan | a teleport |
| Mind Over Matter | 20 | psychic | passive | no plan |  |
| Unlimited Potential | 20 | psychic | 1 action | no plan |  |
| Minor Magic | 2 | rogue | passive | plan | it grants Cast a Spell: the feat module reads nothing for it |
| Loaner Spell | 8 | rogue | passive | no plan |  |
| Steal Spell | 16 | rogue | passive | no plan |  |
| Ancestral Blood Magic | 1 | sorcerer | passive | no plan |  |
| Counterspell (Spontaneous) | 1 | sorcerer | reaction | no plan |  |
| Bleed Out | 2 | sorcerer | 1 action | plan | a roll whose results the simulator doesn't read |
| Divine Evolution | 4 | sorcerer | passive | no plan |  |
| Primal Evolution | 4 | sorcerer | passive | no plan |  |
| Split Shot | 4 | sorcerer | 1 action | no plan |  |
| Diverting Vortex | 6 | sorcerer | 1 action | no plan |  |
| Energetic Resonance | 6 | sorcerer | reaction | no plan |  |
| Energy Ward | 6 | sorcerer | free | no plan |  |
| Safeguard Spell | 6 | sorcerer | 1 action | no plan |  |
| Ancestral Mage | 10 | sorcerer | passive | no plan |  |
| Energy Fusion | 10 | sorcerer | 1 action | no plan |  |
| Blood Component Substitution | 12 | sorcerer | passive | no plan |  |
| Greater Physical Evolution | 12 | sorcerer | passive | no plan |  |
| Interweave Dispel | 14 | sorcerer | 1 action | no plan |  |
| Spell Shroud | 14 | sorcerer | 1 action | plan | a lasting area |
| Greater Mental Evolution | 16 | sorcerer | passive | no plan |  |
| Greater Vital Evolution | 16 | sorcerer | passive | no plan |  |
| Echoing Spell | 18 | sorcerer | 1 action | no plan |  |
| Greater Crossblooded Evolution | 18 | sorcerer | passive | no plan |  |
| Bloodline Conduit | 20 | sorcerer | 1 action | no plan |  |
| Bloodline Perfection | 20 | sorcerer | passive | no plan |  |
| Spellshape Mastery | 20 | sorcerer | passive | no plan |  |
| Legendary Summoner | 20 | summoner | passive | no plan |  |
| Wonder Worker | 20 | thaumaturge | passive | no plan |  |
| Counterspell (Prepared) | 1 | witch | reaction | no plan |  |
| Coven Spell | 12 | witch | reaction | no plan |  |
| Split Hex | 18 | witch | 1 action | no plan |  |
| Patron's Truth | 20 | witch | passive | no plan |  |
| Elemental Defense | 2 | wizard | 1 action | plan | a timer with no rules a fight counts |
| Energy Ablation | 2 | wizard | 1 action | no plan |  |
| Nonlethal Spell | 2 | wizard | 1 action | no plan |  |
| Incriminating Spell | 4 | wizard | 1 action | no plan |  |
| Explosive Arrival | 6 | wizard | free | no plan |  |
| Split Slot | 6 | wizard | passive | no plan |  |
| Knockback Spell | 8 | wizard | 1 action | no plan |  |
| Clever Counterspell | 12 | wizard | passive | no plan |  |
| Redirect Teleportation | 12 | wizard | reaction | no plan |  |
| Secondary Detonation Array | 14 | wizard | 1 action | no plan |  |
| Second Thoughts | 18 | wizard | reaction | plan | a timer with no rules a fight counts |
| Archwizard's Might | 20 | wizard | passive | no plan |  |
| Reclaim Spell | 20 | wizard | passive | no plan |  |
| Worldsphere Gravity | 20 | wizard | 1 action | plan | a lasting area |

## Companions, familiars and eidolons (172)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Alchemical Familiar | 1 | alchemist | passive | no plan |  |
| Enhanced Familiar | 2 | animist | passive | no plan |  |
| Incredible Familiar (Animist) | 10 | animist | passive | no plan |  |
| Apparition Cloud | 12 | animist | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Additional Companion | 4 | archetype | passive | no plan |  |
| Basic Animist Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Summoner Spellcasting | 4 | archetype | passive | plan | it grants Cast a Spell: the feat module reads nothing for it |
| Basic Witch Spellcasting | 4 | archetype | passive | no plan |  |
| Born in the Saddle | 4 | archetype | passive | plan | a passive's Effect posted by hand |
| Cavalier's Banner | 4 | archetype | passive | plan | a passive's Effect on other creatures |
| Elemental Familiar | 4 | archetype | passive | no plan |  |
| Familiar Conduit | 4 | archetype | 1 action | no plan |  |
| Heal Animal | 4 | archetype | passive | no plan |  |
| Initial Eidolon Ability | 4 | archetype | passive | no plan |  |
| Pirate's Pet | 4 | archetype | passive | plan | it grants Pet: the feat module reads nothing for it |
| Psychopomp Familiar | 4 | archetype | passive | no plan |  |
| Reckless Riding Lunge | 4 | archetype | 1 action | no plan |  |
| Repel Darkness | 4 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Ride-By Recovery | 4 | archetype | reaction | no plan |  |
| Spirit of the Beast | 4 | archetype | passive | plan | a spell the engine doesn't cast (Spirit of the Beast) |
| Spiritual Explorer | 4 | archetype | passive | no plan |  |
| Winged Leap | 4 | archetype | passive | no plan |  |
| Adaptive Mask Familiar | 6 | archetype | passive | no plan |  |
| Bestial Protection | 6 | archetype | passive | no plan |  |
| Draconic Familiar | 6 | archetype | passive | plan | it grants Pet: the feat module reads nothing for it |
| Familiar's Resolve | 6 | archetype | 1 action | plan | its Effect has nothing a fight counts |
| Flair Rider Stance | 6 | archetype | 1 action | plan | its Effect has nothing a fight counts |
| Fulu Familiar | 6 | archetype | passive | plan | it grants Create Familiar Fulu: nothing a fight uses |
| Improved Familiar (Familiar Master) | 6 | archetype | passive | no plan |  |
| It's Alive! | 6 | archetype | passive | no plan |  |
| Spiritual Strike | 6 | archetype | 2 actions | plan | its requirement (You are wielding a weapon with at least one fundamental rune and your familiar is adjacent to you or in |
| Swift Guardian | 6 | archetype | free | no plan |  |
| Swift Support | 6 | archetype | passive | plan | a passive's Effect on other creatures |
| Tempest Cloud's Speed | 6 | archetype | passive | no plan |  |
| Vaulting Gallop | 6 | archetype | 2 actions | no plan |  |
| War Rider Stance | 6 | archetype | 1 action | no plan |  |
| Enhanced Psychopomp Familiar | 8 | archetype | passive | no plan |  |
| Familiar Form | 8 | archetype | passive | plan | a spell the engine doesn't cast (Familiar Form) |
| Familiar Ritualist | 8 | archetype | passive | no plan |  |
| Future Spell Learning | 8 | archetype | passive | no plan |  |
| Golden Dragon's Bounty | 8 | archetype | 1 action | plan | a choice of ways the simulator doesn't play |
| Guardian Ghosts | 8 | archetype | reaction | no plan |  |
| Improved Command Corpse | 8 | archetype | passive | no plan |  |
| Lightning Rings' Intervention | 8 | archetype | passive | no plan |  |
| Martyr's Parry | 8 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Mutable Familiar | 8 | archetype | passive | no plan |  |
| Orator's Filibuster | 8 | archetype | passive | plan | a reaction to "passive" |
| Out of Hand | 8 | archetype | passive | plan | it grants Lay Down Arms: the feat module reads nothing for it |
| Grief's Fury | 10 | archetype | reaction | plan | an Effect with nothing a fight counts |
| Incredible Familiar (Familiar Master) | 10 | archetype | passive | no plan |  |
| Seal of the Golden Dragon | 10 | archetype | reaction | plan | a timer with no rules a fight counts |
| Sinking Jaws | 10 | archetype | passive | plan | a passive's roll with no action to use it |
| Sweeping Tail | 10 | archetype | passive | plan | a passive's Strike |
| Unbreakable Bond | 10 | archetype | passive | no plan |  |
| Death Dive | 12 | archetype | 3 actions | plan | its text has no Strike of its user's |
| Expert Combat Eidolon | 12 | archetype | passive | no plan |  |
| Lightning Rings' Overcharge | 12 | archetype | passive | no plan |  |
| Pupil's Guard | 12 | archetype | reaction | no plan |  |
| Self Destruct | 12 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Strafing Breath | 12 | archetype | 3 actions | no plan |  |
| Their Master's Call | 12 | archetype | 1 action | no plan |  |
| Vexing Tempest | 12 | archetype | 1 action | no plan |  |
| Drain Soul Cage | 14 | archetype | passive | no plan |  |
| Guided Hover | 14 | archetype | reaction | no plan |  |
| Improved Hijack Undead | 14 | archetype | passive | no plan |  |
| Signature Synergy | 14 | archetype | passive | no plan |  |
| Gallop Across Shadow | 16 | archetype | passive | no plan |  |
| Zombie Horde | 20 | archetype | 3 actions | plan | its text has no Strike of its user's |
| Chorus Companion | 12 | bard | passive | no plan |  |
| Chiardmar Steed | 6 | champion | passive | no plan |  |
| Nidarrmar Steed | 6 | champion | passive | no plan |  |
| Faithful Stride | 8 | champion | 2 actions | no plan |  |
| Heal Mount | 8 | champion | passive | no plan |  |
| Pale Horse | 12 | champion | passive | plan | a passive's Effect on other creatures |
| Steed's Toppling Strike | 12 | champion | 1 action | plan | its text has no Strike of its user's |
| Improved Command Undead | 10 | cleric | passive | no plan |  |
| Leshy Familiar | 1 | druid | passive | plan | it grants Pet: the feat module reads nothing for it |
| Leshy Familiar Secrets | 4 | druid | passive | no plan |  |
| Instinctive Support | 6 | druid | free | no plan |  |
| Garland Spell | 12 | druid | 1 action | plan | a lasting area |
| Green Tongue | 12 | druid | passive | no plan |  |
| Bullet and a Broadside | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| No! No! I Created You! | 1 | inventor | reaction | no plan |  |
| Collapse Construct | 2 | inventor | 1 action | no plan |  |
| Duo Dragon Kick | 4 | inventor | 2 actions | no plan |  |
| Underworld Investigator | 1 | investigator | passive | no plan |  |
| Fearsome Familiar | 6 | kineticist | 3 actions | no plan |  |
| Familiar | 1 | magus | passive | plan | it grants Pet: the feat module reads nothing for it |
| Enhanced Undead Familiar | 2 | necromancer | passive | no plan |  |
| Storied Companion | 2 | other | reaction | plan | an Effect with nothing a fight counts |
| Chosen Ward | 14 | other | passive | plan | a passive's Effect on other creatures |
| We Are One | 14 | other | passive | no plan |  |
| You Can't Hide From Us | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Bat Around | 16 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| Defend Our Union | 16 | other | reaction | plan | a reaction's Strike |
| Steal Death | 16 | other | reaction | no plan |  |
| Telepathic Union | 16 | other | passive | no plan |  |
| To War! | 16 | other | 3 actions | no plan |  |
| Unified Stance | 16 | other | 1 action | no plan |  |
| Creature of Myth | 18 | other | passive | plan | a passive's Strike |
| Pack of the Beast Lord | 18 | other | 3 actions | plan | an Effect on another creature (both a help and a hindrance) |
| Soul Vessel Mount | 18 | other | passive | plan | a spell the engine doesn't cast (Seize Soul) |
| Galloping Launch | 4 | ranger | 1 action | plan | its requirement (You're mounted, and your mount moved closer to your prey this round.) |
| Natural Conduit | 4 | ranger | 1 action | no plan |  |
| Stealthy Companion | 14 | ranger | passive | no plan |  |
| Masterful Companion | 18 | ranger | passive | no plan |  |
| Glyph Familiar | 1 | runesmith | passive | no plan |  |
| Enhanced Glyph Familiar | 2 | runesmith | passive | no plan |  |
| Divine Emissary | 6 | sorcerer | passive | no plan |  |
| Advanced Weaponry | 1 | summoner | passive | no plan |  |
| Dual Studies | 1 | summoner | passive | no plan |  |
| Energy Heart | 1 | summoner | passive | no plan |  |
| Expanded Senses | 1 | summoner | passive | no plan |  |
| Extend Boost | 1 | summoner | passive | plan | a spell the engine doesn't cast (Extend Boost) |
| Glider Form | 1 | summoner | 1 action | plan | nothing a fight uses |
| Meld into Eidolon | 1 | summoner | 3 actions | no plan |  |
| Unfetter Eidolon | 1 | summoner | passive | plan | a spell the engine doesn't cast (Unfetter Eidolon) |
| Amphibious Form | 2 | summoner | passive | no plan |  |
| Magical Understudy | 2 | summoner | passive | no plan |  |
| Ranged Combatant | 2 | summoner | passive | no plan |  |
| Reinforce Eidolon | 2 | summoner | passive | no plan |  |
| Steed Form | 2 | summoner | passive | no plan |  |
| Dual Energy Heart | 4 | summoner | passive | no plan |  |
| Reactive Dismissal | 4 | summoner | reaction | no plan |  |
| Shrink Down | 4 | summoner | 1 action | no plan |  |
| Skilled Partner | 4 | summoner | passive | no plan |  |
| Tandem Movement | 4 | summoner | 1 action | no plan |  |
| Vibration Sense | 4 | summoner | passive | no plan |  |
| Blood Frenzy | 6 | summoner | passive | no plan |  |
| Ostentatious Arrival | 6 | summoner | free | no plan |  |
| Boost Summons | 8 | summoner | passive | no plan |  |
| Energy Resistance | 8 | summoner | passive | no plan |  |
| Magical Adept | 8 | summoner | passive | no plan |  |
| Miniaturize | 8 | summoner | passive | no plan |  |
| Protective Pose | 8 | summoner | 2 actions | plan | an Effect with nothing a fight counts |
| Surprising Leap | 8 | summoner | 2 actions | plan | a companion's Strike |
| Burrowing Form | 10 | summoner | passive | no plan |  |
| Magical Onslaught | 10 | summoner | 2 actions | plan | a companion's Strike |
| Nimble Form | 10 | summoner | passive | no plan |  |
| Protective Bond | 10 | summoner | reaction | no plan |  |
| Pushing Attack | 10 | summoner | passive | no plan |  |
| Transpose | 10 | summoner | 1 action | no plan |  |
| Weighty Impact | 10 | summoner | passive | no plan |  |
| Airborne Form | 12 | summoner | passive | no plan |  |
| Grasping Limbs | 12 | summoner | passive | no plan |  |
| Summoner's Call | 12 | summoner | reaction | no plan |  |
| Guiding Retort | 14 | summoner | passive | no plan |  |
| Piercing Jab | 14 | summoner | 2 actions | plan | a companion's Strike |
| Share Eidolon Magic | 14 | summoner | passive | no plan |  |
| Magical Master | 18 | summoner | passive | no plan |  |
| Twin Eidolon | 20 | summoner | passive | no plan |  |
| Incredible Familiar | 8 | thaumaturge | passive | no plan |  |
| Wortwitch | 1 | witch | passive | no plan |  |
| Basic Lesson | 2 | witch | passive | no plan |  |
| Familiar's Language | 2 | witch | passive | no plan |  |
| Scatter Swarm | 2 | witch | 1 action | no plan |  |
| Improved Familiar (Witch) | 4 | witch | passive | no plan |  |
| Rites of Convocation | 4 | witch | passive | no plan |  |
| Greater Lesson | 6 | witch | passive | no plan |  |
| Spirit Familiar (Witch) | 8 | witch | passive | no plan |  |
| Stitched Familiar | 8 | witch | passive | no plan |  |
| Major Lesson | 10 | witch | passive | no plan |  |
| Familiar's Eyes | 12 | witch | 1 action | no plan |  |
| Patron's Presence | 14 | witch | passive | no plan |  |
| Rites of Transfiguration | 14 | witch | passive | no plan |  |
| Siphon Power | 16 | witch | free | no plan |  |
| Patron's Claim | 18 | witch | passive | no plan |  |
| Demon's Hair | 20 | witch | passive | no plan |  |
| Call Wizardly Tools | 4 | wizard | 1 action | no plan |  |
| Linked Focus | 4 | wizard | passive | no plan |  |
| Bond Conservation | 8 | wizard | 1 action | no plan |  |
| Superior Bond | 14 | wizard | passive | no plan |  |

## Out of combat (exploration, downtime, skills) (337)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Demolition Charge | 2 | alchemist | passive | no plan |  |
| Chemical Purification | 4 | alchemist | free | no plan |  |
| Efficient Alchemy (Alchemist) | 4 | alchemist | passive | no plan |  |
| Artokus's Fire | 6 | alchemist | free | no plan |  |
| Alter Admixture | 8 | alchemist | passive | no plan |  |
| Merciful Elixir | 10 | alchemist | free | no plan |  |
| Potent Poisoner | 10 | alchemist | passive | no plan |  |
| Persistent Mutagen | 16 | alchemist | passive | no plan |  |
| Improbable Elixirs | 18 | alchemist | passive | no plan |  |
| Craft Philosopher's Stone | 20 | alchemist | passive | no plan |  |
| Efficient Alchemy (Paragon) | 20 | alchemist | passive | no plan |  |
| Wish Alchemy | 20 | alchemist | passive | no plan |  |
| Apparition Sense | 1 | animist | passive | no plan |  |
| Spirit Familiar (Animist) | 1 | animist | passive | plan | it grants Pet: the feat module reads nothing for it |
| Spirit Walk | 8 | animist | passive | no plan |  |
| Apparition's Quickening | 10 | animist | free | no plan |  |
| Spirit's Sacrifice | 18 | animist | free | plan | a plan the engine can't play (its targeting or what it does) |
| Advanced Alchemy | 4 | archetype | passive | no plan |  |
| Aeon Resonance | 4 | archetype | passive | no plan |  |
| Analyze Magic | 4 | archetype | passive | no plan |  |
| Animal Actor | 4 | archetype | passive | no plan |  |
| Arcane School Spell | 4 | archetype | passive | no plan |  |
| Basic Bloodline Spell | 4 | archetype | passive | no plan |  |
| Basic Red Mantis Magic | 4 | archetype | passive | plan | it grants Cast a Spell: the feat module reads nothing for it |
| Beast Speaker | 4 | archetype | passive | plan | a spell the engine doesn't cast (Speak with Animals) |
| Blessing of the Sun Gods | 4 | archetype | passive | no plan |  |
| Broadside Buckos | 4 | archetype | passive | no plan |  |
| Cathartic Focus Spell | 4 | archetype | passive | no plan |  |
| Diabolic Usurpation | 4 | archetype | passive | plan | it grants Domain Initiate: the feat module reads nothing for it |
| Emissary Familiar | 4 | archetype | passive | plan | it grants one of 2 (Pet: the feat module reads nothing for it; Enhanced Familiar: the feat module reads nothing for it) |
| Eye for Weakness | 4 | archetype | passive | no plan |  |
| First Revelation | 4 | archetype | passive | no plan |  |
| Folktales Lore | 4 | archetype | passive | no plan |  |
| Gossip Lore | 4 | archetype | passive | no plan |  |
| Grave's Voice | 4 | archetype | passive | no plan |  |
| Harsh Judgement | 4 | archetype | 1 action | no plan |  |
| Holy Bloom | 4 | archetype | passive | no plan |  |
| Hunter's Sanctum | 4 | archetype | passive | no plan |  |
| Hybrid Study Spell | 4 | archetype | passive | no plan |  |
| Ice Crafter | 4 | archetype | passive | plan | it grants Magical Crafting: the feat module reads nothing for it |
| Investigate Haunting | 4 | archetype | passive | no plan |  |
| Listener's Boon | 4 | archetype | passive | plan | it grants Domain Initiate: the feat module reads nothing for it |
| Mask Familiar | 4 | archetype | passive | no plan |  |
| Mercenary Motivation | 4 | archetype | passive | no plan |  |
| Morning Side Dishes | 4 | archetype | passive | no plan |  |
| Order Spell | 4 | archetype | passive | no plan |  |
| Posse | 4 | archetype | passive | no plan |  |
| Quick Study | 4 | archetype | passive | no plan |  |
| Remember Your Training | 4 | archetype | 1 action | no plan |  |
| Restore Omen | 4 | archetype | passive | no plan |  |
| Rise, My Creature! | 4 | archetype | passive | no plan |  |
| Sacred Spells | 4 | archetype | passive | no plan |  |
| Sacred Wilds Oath | 4 | archetype | passive | no plan |  |
| Safe House | 4 | archetype | passive | no plan |  |
| Seeker of Truths | 4 | archetype | passive | plan | it grants Domain Initiate: the feat module reads nothing for it |
| Surprise Snare | 4 | archetype | 3 actions | no plan |  |
| Tactile Magic Feedback | 4 | archetype | passive | no plan |  |
| The Taste of Magic | 4 | archetype | passive | no plan |  |
| Tracing Sigil | 4 | archetype | passive | no plan |  |
| Barricade Snare | 6 | archetype | passive | no plan |  |
| Basic Scroll Cache | 6 | archetype | passive | no plan |  |
| Brains! | 6 | archetype | free | plan | its Effect has nothing a fight counts |
| Counter Perform | 6 | archetype | passive | plan | a spell the engine doesn't cast (Counter Performance) |
| Cozy Campfire | 6 | archetype | passive | plan | a reaction to "passive" |
| Domain Spirit | 6 | archetype | passive | no plan |  |
| Food Preservation | 6 | archetype | passive | no plan |  |
| Hellknight Signifer Preferment | 6 | archetype | passive | no plan |  |
| Hero-God's Bond | 6 | archetype | passive | no plan |  |
| Illuminating Stories | 6 | archetype | passive | no plan |  |
| Inscribed with Elders' Deeds | 6 | archetype | passive | no plan |  |
| Interrogate | 6 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Liberty's Promise | 6 | archetype | passive | plan | it grants Domain Initiate: the feat module reads nothing for it |
| Magical Scrounger | 6 | archetype | passive | no plan |  |
| Mastermind's Eye | 6 | archetype | passive | plan | a passive's roll with no action to use it |
| Perfect Truths | 6 | archetype | passive | no plan |  |
| Perpetual Scout | 6 | archetype | passive | no plan |  |
| Practical Magic | 6 | archetype | passive | no plan |  |
| Psi Development | 6 | archetype | passive | no plan |  |
| Simple Crystal Magic | 6 | archetype | passive | plan | a spell the engine doesn't cast (Read Aura, Sigil) |
| Symphony of Agony | 6 | archetype | passive | no plan |  |
| Westyr's Wayfinder Repository | 6 | archetype | passive | no plan |  |
| Wild Speech | 6 | archetype | passive | no plan |  |
| Aroden's Innovation | 8 | archetype | passive | no plan |  |
| Call Gun | 8 | archetype | passive | plan | it grants Call Gun: the feat module reads nothing for it |
| Deceptive Deduction | 8 | archetype | reaction | no plan |  |
| Deeper Dabbler | 8 | archetype | passive | no plan |  |
| Dualistic Synergy | 8 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Environmental Adaptability | 8 | archetype | passive | no plan |  |
| Foolproof Instructions | 8 | archetype | passive | no plan |  |
| Great Boaster | 8 | archetype | passive | no plan |  |
| Harbinger's Armament | 8 | archetype | passive | plan | its Effect has nothing a fight counts |
| Haunting Memories | 8 | archetype | passive | no plan |  |
| Hell's Bane | 8 | archetype | passive | no plan |  |
| Innate Magical Intuition | 8 | archetype | passive | no plan |  |
| Know Your Enemy | 8 | archetype | 1 action | plan | its stance (Strategist Stance): a plan the engine can't play (its targeting or what it does) |
| Lethargy Poisoner | 8 | archetype | passive | no plan |  |
| Living for the Applause | 8 | archetype | reaction | no plan |  |
| Malleable Mental Forge | 8 | archetype | passive | no plan |  |
| Ooze Empathy | 8 | archetype | passive | no plan |  |
| Persistent Creation | 8 | archetype | passive | plan | a spell the engine doesn't cast (Creation) |
| Sense Iniquity | 8 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Sin Reservoir | 8 | archetype | passive | no plan |  |
| Spelldrinker | 8 | archetype | 1 action | no plan |  |
| Spellshield | 8 | archetype | passive | plan | it grants Arcane Bond: the feat module reads nothing for it |
| Transcribe Moment | 8 | archetype | passive | plan | a spell the engine doesn't cast (Transcribe Moment) |
| Veil of Eternity | 8 | archetype | passive | no plan |  |
| Worm Empathy | 8 | archetype | passive | no plan |  |
| Armor Rune Shifter | 10 | archetype | passive | no plan |  |
| Beneath Notice | 10 | archetype | passive | plan | it grants one of 3 (Impersonate: the feat module reads nothing for it; Quick Disguise: the feat module reads nothing for |
| Broad Snare | 10 | archetype | passive | no plan |  |
| Come In From the Wilderness | 10 | archetype | 2 actions | no plan |  |
| Cursebreaker | 10 | archetype | passive | no plan |  |
| Define “Report” | 10 | archetype | free | no plan |  |
| Eidetic Memorization | 10 | archetype | 3 actions | no plan |  |
| Emissary of Peace | 10 | archetype | 3 actions | no plan |  |
| Font of Knowledge | 10 | archetype | passive | no plan |  |
| Gather Disciples | 10 | archetype | passive | no plan |  |
| Know It All (Eldritch Researcher) | 10 | archetype | passive | no plan |  |
| Patron's Whisper | 10 | archetype | passive | plan | a spell the engine doesn't cast (Message) |
| Practiced Defender | 10 | archetype | passive | no plan |  |
| Repurposed Parts | 10 | archetype | passive | no plan |  |
| Runic Mind Smithing | 10 | archetype | passive | no plan |  |
| Shall not Falter, Shall not Rout | 10 | archetype | passive | plan | a spell the engine doesn't cast (Shall not Falter, Shall not Rout) |
| Shared Synergy | 10 | archetype | passive | no plan |  |
| Spy's Countermeasures | 10 | archetype | free | no plan |  |
| Tales of the Road | 10 | archetype | passive | no plan |  |
| The Truth As I See It | 10 | archetype | passive | no plan |  |
| Three Pecks of Dew | 10 | archetype | passive | no plan |  |
| Traces of the Divine | 10 | archetype | passive | no plan |  |
| Weapon-Rune Shifter | 10 | archetype | passive | no plan |  |
| Adept Storyteller | 12 | archetype | passive | no plan |  |
| Coffin Bound | 12 | archetype | passive | plan | a passive's roll with no action to use it |
| Consult the Spirits (Rivethun Emissary) | 12 | archetype | passive | no plan |  |
| Educated Assessment | 12 | archetype | passive | no plan |  |
| Enticing Dwelling | 12 | archetype | passive | no plan |  |
| For Love, For Lightning | 12 | archetype | passive | plan | a spell the engine doesn't cast (For Love, For Lightning) |
| Illusory Identity | 12 | archetype | passive | no plan |  |
| Lightning Snares | 12 | archetype | passive | no plan |  |
| Master of the Dead | 12 | archetype | passive | plan | a spell the engine doesn't cast (Shambling Horror) |
| Perfect Pitch | 12 | archetype | passive | plan | it grants Pitch-Perfect Projection: the feat module reads nothing for it |
| Student of the Dueling Arts | 12 | archetype | passive | no plan |  |
| Tense Negotiator | 12 | archetype | passive | no plan |  |
| Bodysnatcher | 14 | archetype | passive | no plan |  |
| Cosmic Cocktail | 14 | archetype | passive | no plan |  |
| Crimson Oath Devotion | 14 | archetype | passive | no plan |  |
| Crusader's Masquerade | 14 | archetype | 1 action | no plan |  |
| Domain Embodiment | 14 | archetype | passive | no plan |  |
| Incredible Recollection | 14 | archetype | 1 action | no plan |  |
| Mask of the 15th Step | 14 | archetype | passive | no plan |  |
| Regional Specialty | 14 | archetype | passive | no plan |  |
| Resolute Defender | 14 | archetype | passive | no plan |  |
| Stories of Home | 14 | archetype | passive | no plan |  |
| Unstable Patronage | 14 | archetype | passive | no plan |  |
| Advanced Runic Mind Smithing | 16 | archetype | passive | no plan |  |
| Greater Armament | 16 | archetype | passive | no plan |  |
| Invisible Hand | 16 | archetype | passive | no plan |  |
| Pact of the Rune Dragon | 16 | archetype | passive | no plan |  |
| Burn Identity | 18 | archetype | 2 actions | plan | a spell the feat casts |
| I Knew the Heroes | 18 | archetype | passive | no plan |  |
| Look Again | 18 | archetype | 1 action | no plan |  |
| Orichalcum Bond | 18 | archetype | passive | no plan |  |
| Living God | 20 | archetype | passive | no plan |  |
| Patron Reborn | 20 | archetype | passive | no plan |  |
| Swordlord Exile | 20 | archetype | passive | no plan |  |
| Bardic Lore | 1 | bard | passive | no plan |  |
| Versatile Performance | 1 | bard | passive | no plan |  |
| Zoophonic Communication | 1 | bard | passive | no plan |  |
| Esoteric Polymath | 2 | bard | passive | no plan |  |
| Melodious Spell | 4 | bard | 1 action | no plan |  |
| Versatile Signature | 4 | bard | passive | no plan |  |
| Assured Knowledge | 6 | bard | passive | no plan |  |
| Know-It-All | 8 | bard | passive | no plan |  |
| Annotate Composition | 10 | bard | passive | no plan |  |
| Eclectic Polymath | 12 | bard | passive | no plan |  |
| Enigma's Knowledge | 12 | bard | passive | plan | it grants Automatic Knowledge: the feat module reads nothing for it |
| Inspirational Focus | 12 | bard | passive | no plan |  |
| Earworm | 14 | bard | passive | no plan |  |
| True Hypercognition | 14 | bard | 1 action | no plan |  |
| Oath of the Defender | 2 | champion | passive | no plan |  |
| Oath of the Slayer | 2 | champion | passive | no plan |  |
| Acclimated Mount | 4 | champion | passive | no plan |  |
| Devoted Focus | 10 | champion | passive | no plan |  |
| Radiant Armament | 10 | champion | passive | no plan |  |
| Shield Paragon | 20 | champion | passive | no plan |  |
| Domain Initiate | 1 | cleric | passive | no plan |  |
| Emblazon Armament | 2 | cleric | passive | no plan |  |
| Sacred Ground | 4 | cleric | passive | no plan |  |
| Magic Hands | 6 | cleric | passive | no plan |  |
| Domain Focus | 12 | cleric | passive | no plan |  |
| Divine Apex | 18 | cleric | passive | no plan |  |
| Miraculous Possibility | 18 | cleric | passive | no plan |  |
| Dance of Intercession | 20 | cleric | 3 actions | plan | a roll whose results the simulator doesn't read |
| Armored Regiment Training | 1 | commander | passive | no plan |  |
| Rapid Assessment | 2 | commander | free | no plan |  |
| Shielded Recovery | 4 | commander | passive | no plan |  |
| Unrivaled Analysis | 8 | commander | passive | no plan |  |
| Perfected Evaluations | 12 | commander | passive | no plan |  |
| Verdant Weapon | 1 | druid | passive | no plan |  |
| Sheltering Cave | 4 | druid | passive | no plan |  |
| Green Empathy | 6 | druid | passive | no plan |  |
| Intensified Element Stance | 6 | druid | 1 action | plan | its requirement (You were the recipient of elemental medicine (see @UUID[Compendium.pf2e.feats-srd.Item.Prepare Elementa |
| Eerie Traces | 8 | druid | passive | no plan |  |
| Forgotten Presence | 8 | druid | passive | no plan |  |
| Primal Focus | 12 | druid | passive | no plan |  |
| Extract Vow of Nonviolence | 12 | exemplar | 2 actions | plan | a timer with no rules a fight counts |
| Mark of the Sage | 16 | exemplar | passive | plan | it grants A Challenge for Heroes: an Effect with nothing a fight counts |
| Cutting Without Blade | 20 | exemplar | passive | no plan |  |
| Ultimate Flexibility | 20 | fighter | passive | no plan |  |
| Bodyguard | 1 | guardian | passive | no plan |  |
| Shield Salvation | 10 | guardian | passive | no plan |  |
| Munitions Crafter | 1 | gunslinger | passive | plan | it grants Alchemical Crafting: the feat module reads nothing for it |
| Fey Tracker | 6 | gunslinger | passive | no plan |  |
| Munitions Machinist | 6 | gunslinger | passive | plan | it grants Quick Alchemy: nothing a fight uses |
| Greenwatch Veteran | 8 | gunslinger | free | no plan |  |
| Gadget Specialist | 4 | inventor | passive | no plan |  |
| Contingency Gadgets | 12 | inventor | passive | no plan |  |
| Unstable Redundancies | 14 | inventor | free | no plan |  |
| Ubiquitous Overdrive | 20 | inventor | passive | no plan |  |
| Eliminate Red Herrings | 1 | investigator | passive | no plan |  |
| Flexible Studies | 1 | investigator | passive | no plan |  |
| Undead Spotter | 1 | investigator | passive | no plan |  |
| Personalized Poisoning | 2 | investigator | passive | no plan |  |
| Solid Lead | 2 | investigator | passive | no plan |  |
| Lie Detector | 4 | investigator | passive | no plan |  |
| Ongoing Investigation | 4 | investigator | passive | no plan |  |
| Thorough Research | 6 | investigator | passive | no plan |  |
| Just One More Thing | 10 | investigator | 1 action | plan | a reroll |
| Reason Rapidly | 12 | investigator | 1 action | no plan |  |
| Forensic Countermeasures | 14 | investigator | passive | no plan |  |
| Plot the Future | 14 | investigator | passive | no plan |  |
| Reconstruct the Scene | 16 | investigator | passive | no plan |  |
| Lead Investigator | 18 | investigator | passive | no plan |  |
| Trickster's Ace | 18 | investigator | reaction | no plan |  |
| All the Time in the World | 20 | investigator | 3 actions | no plan |  |
| Elemental Familiar (Kineticist) | 1 | kineticist | passive | no plan |  |
| Voice of Elements | 2 | kineticist | passive | no plan |  |
| Igneogenesis | 4 | kineticist | 2 actions | no plan |  |
| Hedge Maze | 12 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Rapid Reattunement | 14 | kineticist | passive | no plan |  |
| Beasts of Slumbering Steel | 18 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Heaven-Earth Encompassing Sleeves | 4 | magus | passive | no plan |  |
| Fused Staff | 8 | magus | passive | no plan |  |
| Conflux Focus | 12 | magus | passive | no plan |  |
| Conflux Wellspring | 18 | magus | passive | no plan |  |
| Versatile Spellstrike | 18 | magus | passive | no plan |  |
| Lessons of Flux | 10 | monk | reaction | plan | a reroll |
| Meditative Focus | 12 | monk | passive | no plan |  |
| Death Speaker | 1 | necromancer | passive | no plan |  |
| Undead Familiar | 1 | necromancer | passive | no plan |  |
| Bone Speaker | 2 | necromancer | passive | no plan |  |
| Wings of Bone and Sinew | 8 | necromancer | 1 action | plan | nothing a fight uses |
| Speak With Days Long Dead | 10 | necromancer | passive | no plan |  |
| Grave Focus | 12 | necromancer | passive | no plan |  |
| Glean Lore | 1 | oracle | 1 action | no plan |  |
| Read Disaster | 8 | oracle | passive | no plan |  |
| Revelation's Focus | 14 | oracle | passive | no plan |  |
| Paradoxical Mystery | 20 | oracle | passive | no plan |  |
| Ears That Hear the Truth | 2 | other | passive | no plan |  |
| We've Met Before | 2 | other | 1 action | no plan |  |
| Hydra's Bond | 4 | other | passive | no plan |  |
| Read the Wind | 4 | other | passive | no plan |  |
| Unbelievably Believable | 4 | other | passive | no plan |  |
| Steal Magic | 8 | other | passive | no plan |  |
| Avenger of Sloth | 14 | other | passive | plan | it grants Summon Sloth: the feat module reads nothing for it |
| Claim Cardinal Domains | 14 | other | passive | no plan |  |
| Consult Celestial Advisor | 14 | other | passive | no plan |  |
| Decree of Prosperity | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Guarded Domain | 14 | other | passive | no plan |  |
| I've Been Here Before | 14 | other | passive | no plan |  |
| Lord of the Fiends | 14 | other | 2 actions | plan | an Effect with nothing a fight counts |
| My Reputation Precedes Me | 14 | other | passive | no plan |  |
| Myth of Quick-Thinking | 14 | other | passive | no plan |  |
| Reincarnated Companion | 14 | other | passive | no plan |  |
| Transmute Weapon | 14 | other | passive | no plan |  |
| United Front | 14 | other | passive | no plan |  |
| Warshard Rune | 14 | other | passive | no plan |  |
| A Thousand Cries for Help | 16 | other | passive | no plan |  |
| Autonomous Arms | 16 | other | passive | plan | it grants Call to Hand: nothing a fight uses |
| Eyes Unclouded | 18 | other | passive | no plan |  |
| Profane Bargain | 18 | other | 3 actions | plan | a timer with no rules a fight counts |
| Sanctified Relic | 18 | other | passive | no plan |  |
| One Life, Two Vessels | 20 | other | passive | no plan |  |
| Amp Focus | 12 | psychic | passive | no plan |  |
| Animal Empathy (Ranger) | 2 | ranger | passive | no plan |  |
| Favored Prey | 4 | ranger | passive | no plan |  |
| Giant Hunter | 4 | ranger | passive | no plan |  |
| Snare Specialist | 4 | ranger | passive | no plan |  |
| Wolf in Sheep's Clothing | 4 | ranger | passive | no plan |  |
| Additional Recollection | 6 | ranger | free | no plan |  |
| Quick Snares | 6 | ranger | passive | no plan |  |
| Swift Tracker | 6 | ranger | passive | no plan |  |
| Master Monster Hunter | 10 | ranger | passive | no plan |  |
| Warden's Step | 10 | ranger | passive | no plan |  |
| Warden's Focus | 12 | ranger | passive | no plan |  |
| Impossible Snares | 20 | ranger | passive | no plan |  |
| To the Ends of the Earth | 20 | ranger | passive | no plan |  |
| Anticipate Ambush | 6 | rogue | passive | no plan |  |
| Inspired Stratagem | 8 | rogue | passive | plan | it grants Inspired Stratagem: a plan the engine can't play (its targeting or what it does) |
| Runic Tattoo | 2 | runesmith | passive | no plan |  |
| Overloaded Ammunition | 10 | runesmith | passive | no plan |  |
| Runic Correspondence | 10 | runesmith | passive | no plan |  |
| Expanded Glossary | 12 | runesmith | passive | no plan |  |
| Living Lexicon | 18 | runesmith | passive | no plan |  |
| Stone Forge of the First | 20 | runesmith | 2 actions | plan | a timer with no rules a fight counts |
| Tap into Blood | 1 | sorcerer | 1 action | plan | a teleport |
| Anoint Ally | 2 | sorcerer | 1 action | plan | a timer with no rules a fight counts |
| Arcane Evolution | 4 | sorcerer | passive | no plan |  |
| Elaborate Flourish | 4 | sorcerer | 1 action | no plan |  |
| Occult Evolution | 4 | sorcerer | passive | no plan |  |
| Bloodline Focus | 12 | sorcerer | passive | no plan |  |
| Bloodline Metamorphosis | 20 | sorcerer | passive | no plan |  |
| Master Summoner | 6 | summoner | passive | no plan |  |
| Flexible Transmogrification | 12 | summoner | passive | no plan |  |
| Link Focus | 12 | summoner | passive | no plan |  |
| True Transmogrification | 18 | summoner | passive | no plan |  |
| Diverse Lore | 1 | thaumaturge | passive | no plan |  |
| Talisman Esoterica | 2 | thaumaturge | passive | no plan |  |
| Paired Link | 4 | thaumaturge | passive | no plan |  |
| Scroll Esoterica | 6 | thaumaturge | passive | no plan |  |
| Seven-Part Link | 16 | thaumaturge | passive | no plan |  |
| Cauldron | 1 | witch | passive | no plan |  |
| Ceremonial Knife | 6 | witch | passive | no plan |  |
| Witch's Charge | 6 | witch | passive | no plan |  |
| Witch's Bottle | 8 | witch | passive | no plan |  |
| Double, Double | 10 | witch | passive | no plan |  |
| Hex Focus | 12 | witch | passive | no plan |  |
| Witch's Broom | 12 | witch | passive | no plan |  |
| Spellbook Prodigy | 1 | wizard | passive | plan | it grants Magical Shorthand: the feat module reads nothing for it |
| Knowledge is Power (Wizard) | 8 | wizard | passive | no plan |  |
| Scroll Adept | 10 | wizard | passive | no plan |  |
| Shared Focus | 10 | wizard | 1 action | plan | a timer with no rules a fight counts |
| Spatial Awareness | 10 | wizard | passive | no plan |  |
| Keen Magical Detection | 12 | wizard | passive | no plan |  |
| Bonded Focus | 14 | wizard | passive | no plan |  |
| Infinite Possibilities | 18 | wizard | passive | no plan |  |
| Reprepare Spell | 18 | wizard | passive | no plan |  |
| Spell Mastery | 20 | wizard | passive | no plan |  |

## Nothing a fight would use (764)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Alchemical Assessment | 1 | alchemist | passive | no plan |  |
| Improvise Admixture | 2 | alchemist | 1 action | plan | a roll whose results the simulator doesn't read |
| Enduring Alchemy | 4 | alchemist | passive | no plan |  |
| Inured to Alchemy | 4 | alchemist | passive | no plan |  |
| Invigorating Elixir | 4 | alchemist | passive | no plan |  |
| Tenacious Toxins | 4 | alchemist | passive | no plan |  |
| Combine Elixirs | 6 | alchemist | passive | no plan |  |
| Glitter Crystals | 8 | alchemist | passive | no plan |  |
| Advanced Efficient Alchemy | 10 | alchemist | passive | no plan |  |
| Extend Elixir | 12 | alchemist | passive | no plan |  |
| Mutant Innervation | 14 | alchemist | passive | no plan |  |
| Eternal Elixir | 16 | alchemist | passive | no plan |  |
| Miracle Worker | 18 | alchemist | passive | no plan |  |
| Alchemical Revivification | 20 | alchemist | passive | no plan |  |
| Perfect Mutagen | 20 | alchemist | passive | no plan |  |
| Circle of Spirits | 1 | animist | 1 action | no plan |  |
| Medium's Awareness | 6 | animist | passive | no plan |  |
| Agent of all Holds | 2 | archetype | passive | no plan |  |
| Additional Follower | 4 | archetype | passive | no plan |  |
| Agile Hand | 4 | archetype | passive | no plan |  |
| Animal Fleetness | 4 | archetype | passive | no plan |  |
| Armiger's Protection | 4 | archetype | passive | no plan |  |
| Axe Climber | 4 | archetype | passive | no plan |  |
| Basic Captivator Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Cleric Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Druid Spellcasting | 4 | archetype | passive | no plan |  |
| Big Game Trapper | 4 | archetype | passive | no plan |  |
| Brilliant Crafter | 4 | archetype | passive | no plan |  |
| Bullying Staff | 4 | archetype | passive | no plan |  |
| Careful Explorer | 4 | archetype | passive | no plan |  |
| Clinging Climber | 4 | archetype | passive | no plan |  |
| Command Corpse | 4 | archetype | passive | plan | it grants Command Undead: a roll whose results the simulator doesn't read |
| Coughing Dragon Display | 4 | archetype | passive | plan | it grants Coughing Dragon: nothing a fight uses |
| Crescent Cross Training | 4 | archetype | passive | plan | it grants Crescent Spray: its text has no Strike of its user's |
| Decry Thief | 4 | archetype | passive | no plan |  |
| Devout Magic | 4 | archetype | passive | no plan |  |
| Dimensional Pilfer | 4 | archetype | 2 actions | no plan |  |
| Elemental Existence | 4 | archetype | passive | plan | it grants one of 10 (Adopted Ancestry: the feat module reads nothing for it; Dustsoul: the feat module reads nothing for |
| Empathic Envoy | 4 | archetype | passive | no plan |  |
| Environmental Explorer | 4 | archetype | passive | no plan |  |
| Esoteric Spellcasting | 4 | archetype | passive | no plan |  |
| Executioner Weapon Training | 4 | archetype | passive | no plan |  |
| Experienced Harrower | 4 | archetype | passive | no plan |  |
| Eye of Ozem | 4 | archetype | passive | no plan |  |
| Fake It Till You Make It | 4 | archetype | passive | no plan |  |
| Familiar Mascot | 4 | archetype | passive | no plan |  |
| Fast Swimmer | 4 | archetype | passive | no plan |  |
| Feral Senses | 4 | archetype | passive | no plan |  |
| Focused Juggler | 4 | archetype | free | plan | a timer with no rules a fight counts |
| Gunpowder Gauntlet | 4 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Harvest Moon | 4 | archetype | passive | no plan |  |
| Headless Haunt | 4 | archetype | passive | plan | it grants Remove Head: the feat module reads nothing for it |
| Inspiring Marshal Stance | 4 | archetype | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Inspiring Recitation | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Into The Storm | 4 | archetype | passive | no plan |  |
| Just the Tool | 4 | archetype | 1 action | no plan |  |
| Like a Fish in Water | 4 | archetype | passive | no plan |  |
| Lion's Might | 4 | archetype | passive | no plan |  |
| Marine Combat Training | 4 | archetype | passive | no plan |  |
| Mental Forge | 4 | archetype | passive | no plan |  |
| Mountain Skin | 4 | archetype | passive | no plan |  |
| Nonlethal Takedown | 4 | archetype | passive | no plan |  |
| Observant Explorer | 4 | archetype | passive | no plan |  |
| One with the Land | 4 | archetype | passive | no plan |  |
| Pact of Huldra's Renewal | 4 | archetype | passive | no plan |  |
| Perfect Weaponry | 4 | archetype | passive | plan | it grants Monastic Weaponry: the feat module reads nothing for it |
| Petal Step | 4 | archetype | passive | no plan |  |
| Pirate Combat Training | 4 | archetype | passive | plan | it grants one of 2 (Combat Climber: the feat module reads nothing for it; Underwater Marauder: the feat module reads not |
| Quick Fix | 4 | archetype | passive | plan | it grants one of 2 (Rapid Affixture: the feat module reads nothing for it; Affix a Talisman: the feat module reads nothi |
| Quick Juggler | 4 | archetype | passive | no plan |  |
| Reactive Tangle | 4 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Rebel's Map | 4 | archetype | free | no plan |  |
| Sense Alignment | 4 | archetype | 3 actions | no plan |  |
| Senses of the Bear | 4 | archetype | passive | no plan |  |
| Shadow Spells | 4 | archetype | passive | no plan |  |
| Shared Attunement | 4 | archetype | passive | no plan |  |
| Shorthanded | 4 | archetype | passive | no plan |  |
| Siege Ritualist | 4 | archetype | passive | no plan |  |
| Spell-Woven Shot | 4 | archetype | passive | plan | it grants Spell-Woven Shot: a Strike with nothing more the simulator reads |
| Spirit Spells | 4 | archetype | passive | no plan |  |
| Spyglass Modification | 4 | archetype | passive | no plan |  |
| Stage Fighting | 4 | archetype | passive | no plan |  |
| Stargazer's Eyes | 4 | archetype | passive | no plan |  |
| Strange Script | 4 | archetype | passive | no plan |  |
| Subtle Shift | 4 | archetype | passive | no plan |  |
| Tactical Excellence | 4 | archetype | passive | no plan |  |
| Take the Wheel | 4 | archetype | 1 action | no plan |  |
| Terrain Scout | 4 | archetype | passive | plan | it grants Terrain Stalker: the feat module reads nothing for it |
| The World Whispers | 4 | archetype | 1 action | no plan |  |
| Trained Swimmer | 4 | archetype | passive | no plan |  |
| Triangulate | 4 | archetype | passive | no plan |  |
| Tunnel Wall | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Underbrush Trailblazer | 4 | archetype | passive | plan | it grants Terrain Stalker: the feat module reads nothing for it |
| Unnerving Expansion | 4 | archetype | 1 action | no plan |  |
| Watch and Learn | 4 | archetype | reaction | no plan |  |
| Wellspring Control | 4 | archetype | passive | no plan |  |
| Wild Lights | 4 | archetype | passive | no plan |  |
| Additional Servings | 6 | archetype | passive | no plan |  |
| Advanced Arcana | 6 | archetype | passive | no plan |  |
| Advanced Blood Potency | 6 | archetype | passive | no plan |  |
| Advanced Breakthrough | 6 | archetype | passive | no plan |  |
| Advanced Concoction | 6 | archetype | passive | no plan |  |
| Advanced Death Dealing | 6 | archetype | passive | no plan |  |
| Advanced Deduction | 6 | archetype | passive | no plan |  |
| Advanced Defender | 6 | archetype | passive | no plan |  |
| Advanced Devotion | 6 | archetype | passive | no plan |  |
| Advanced Dogma | 6 | archetype | passive | no plan |  |
| Advanced Field Training | 6 | archetype | passive | no plan |  |
| Advanced Flair | 6 | archetype | passive | no plan |  |
| Advanced Fury | 6 | archetype | passive | no plan |  |
| Advanced Glory | 6 | archetype | passive | no plan |  |
| Advanced Herbalism | 6 | archetype | passive | no plan |  |
| Advanced Hunter's Trick | 6 | archetype | passive | no plan |  |
| Advanced Kata | 6 | archetype | passive | no plan |  |
| Advanced Maneuver | 6 | archetype | passive | no plan |  |
| Advanced Martial Magic | 6 | archetype | passive | no plan |  |
| Advanced Muse's Whispers | 6 | archetype | passive | no plan |  |
| Advanced Mysteries | 6 | archetype | passive | no plan |  |
| Advanced Poisoncraft | 6 | archetype | passive | no plan |  |
| Advanced Rune Magic | 6 | archetype | passive | no plan |  |
| Advanced Shooting | 6 | archetype | passive | no plan |  |
| Advanced Synergy | 6 | archetype | passive | no plan |  |
| Advanced Thaumaturgy | 6 | archetype | passive | no plan |  |
| Advanced Thoughtform | 6 | archetype | passive | no plan |  |
| Advanced Trickery | 6 | archetype | passive | no plan |  |
| Advanced Wilding | 6 | archetype | passive | no plan |  |
| Advanced Witchcraft | 6 | archetype | passive | no plan |  |
| Animist's Power | 6 | archetype | passive | no plan |  |
| Annul Compulsion | 6 | archetype | 2 actions | no plan |  |
| Aquatic Passage | 6 | archetype | passive | no plan |  |
| Arcane Sensitivity | 6 | archetype | passive | no plan |  |
| Archaeologist's Warning | 6 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Armor Specialist | 6 | archetype | passive | no plan |  |
| Butterfly's Kiss | 6 | archetype | passive | no plan |  |
| Cannon Corner Shot | 6 | archetype | passive | no plan |  |
| Cast Out | 6 | archetype | 2 actions | no plan |  |
| Clean Take | 6 | archetype | reaction | plan | a reroll |
| Cloaking Pulse | 6 | archetype | passive | plan | it grants Drape Ambient Magic: its text has no Strike of its user's |
| Crushing Step | 6 | archetype | passive | no plan |  |
| Denounce Tyranny | 6 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Discerning Gaze | 6 | archetype | passive | no plan |  |
| Disk Rider | 6 | archetype | passive | no plan |  |
| Dismantle Spell | 6 | archetype | passive | no plan |  |
| Drenching Mist | 6 | archetype | passive | no plan |  |
| Duel Spell Advantage | 6 | archetype | passive | no plan |  |
| Echolocation | 6 | archetype | passive | no plan |  |
| Exigent Aura | 6 | archetype | passive | no plan |  |
| Expanded Elemental Magic | 6 | archetype | passive | no plan |  |
| Expeditious Advance | 6 | archetype | passive | no plan |  |
| Expert Fireworks Crafter | 6 | archetype | passive | no plan |  |
| Fear No Pain! | 6 | archetype | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Field Artillery | 6 | archetype | passive | no plan |  |
| Fleeting Shadow | 6 | archetype | 2 actions | no plan |  |
| Flexible Ritualist | 6 | archetype | passive | no plan |  |
| Float Free | 6 | archetype | 1 action | no plan |  |
| Ghostly Grasp | 6 | archetype | passive | no plan |  |
| Grave Sense | 6 | archetype | passive | no plan |  |
| Grave Strength | 6 | archetype | passive | no plan |  |
| Guided Skill | 6 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Harbinger's Protection | 6 | archetype | passive | no plan |  |
| Harrow Ritualist | 6 | archetype | passive | plan | a passive's Effect posted by hand |
| Infiltrate Dream | 6 | archetype | passive | plan | a passive's roll with no action to use it |
| Keen Recollection | 6 | archetype | passive | plan | it grants Keen Recollection: the feat module reads nothing for it |
| Legion's Aim | 6 | archetype | passive | no plan |  |
| Lesson of Bonded Eyes | 6 | archetype | passive | no plan |  |
| Liberate Soul | 6 | archetype | 2 actions | no plan |  |
| Lotus Above the Wind | 6 | archetype | passive | no plan |  |
| Macabre Virtuoso | 6 | archetype | passive | plan | a passive's Effect posted by hand |
| Make Do | 6 | archetype | 1 action | no plan |  |
| Mobile Swarm | 6 | archetype | passive | no plan |  |
| Nameless Anonymity | 6 | archetype | passive | no plan |  |
| Narrative Conduit | 6 | archetype | passive | no plan |  |
| Nimble Shield Hand | 6 | archetype | passive | no plan |  |
| Obscured Terrain | 6 | archetype | passive | no plan |  |
| Performative Weapons Training | 6 | archetype | passive | no plan |  |
| Propulsive Mutation | 6 | archetype | passive | no plan |  |
| Quick Harvest | 6 | archetype | 1 action | no plan |  |
| Rain-Scribe Sustenance | 6 | archetype | passive | no plan |  |
| Rapid Manifestation | 6 | archetype | free | no plan |  |
| Reactive Spellshift | 6 | archetype | reaction | no plan |  |
| Repeat Lesson | 6 | archetype | reaction | no plan |  |
| Rough Terrain Stance | 6 | archetype | 1 action | no plan |  |
| Second Shield | 6 | archetype | free | no plan |  |
| Share Burden | 6 | archetype | reaction | no plan |  |
| Snow Step | 6 | archetype | passive | no plan |  |
| Tactical Guidance | 6 | archetype | passive | no plan |  |
| Talon's Mark | 6 | archetype | passive | no plan |  |
| Voluminous Vials | 6 | archetype | passive | no plan |  |
| Quick Change | 7 | archetype | passive | no plan |  |
| A Tale To Believe In | 8 | archetype | 1 action | no plan |  |
| Able Ritualist | 8 | archetype | passive | plan | a passive's Effect posted by hand |
| Advanced Deific Power | 8 | archetype | passive | no plan |  |
| Arcane Breadth | 8 | archetype | passive | no plan |  |
| Attuned Stride | 8 | archetype | passive | no plan |  |
| Basic Modification | 8 | archetype | passive | no plan |  |
| Benefactor's Wings | 8 | archetype | 1 action | plan | nothing a fight uses |
| Bloodline Breadth | 8 | archetype | passive | no plan |  |
| Bonds of Death | 8 | archetype | free | no plan |  |
| Cantrip Supremacy | 8 | archetype | passive | no plan |  |
| Captivating Intensity | 8 | archetype | passive | no plan |  |
| Carried with the Swarm | 8 | archetype | passive | no plan |  |
| Challenge Insight | 8 | archetype | reaction | no plan |  |
| Crude Communication | 8 | archetype | passive | no plan |  |
| Cruel Piercing | 8 | archetype | passive | no plan |  |
| Cultivator's Keen Eye | 8 | archetype | passive | no plan |  |
| Dart Between | 8 | archetype | 2 actions | plan | a teleport |
| Deadly Butterfly | 8 | archetype | passive | no plan |  |
| Divine Breadth | 8 | archetype | passive | no plan |  |
| Efficient Rituals | 8 | archetype | passive | no plan |  |
| Elude the Divine | 8 | archetype | passive | plan | it grants Slippery Secrets: the feat module reads nothing for it |
| Fey's Trickery | 8 | archetype | 2 actions | plan | a spell the feat casts |
| Flickering Stories | 8 | archetype | passive | no plan |  |
| Frozen Breadth | 8 | archetype | passive | no plan |  |
| Garden Path | 8 | archetype | passive | no plan |  |
| Hellknight Mobility | 8 | archetype | passive | no plan |  |
| Improvised Critical | 8 | archetype | passive | no plan |  |
| Larcenous Hand | 8 | archetype | passive | no plan |  |
| Levered Swing | 8 | archetype | 1 action | no plan |  |
| Lion's Fury | 8 | archetype | passive | no plan |  |
| Lorefinder | 8 | archetype | passive | plan | a spell the engine doesn't cast (Locate) |
| Magic Ammunition | 8 | archetype | passive | plan | it grants Transform Ammunition: the feat module reads nothing for it |
| Magic Finder | 8 | archetype | passive | no plan |  |
| Magical Knowledge | 8 | archetype | passive | no plan |  |
| Many Guises (Vigilante) | 8 | archetype | passive | no plan |  |
| Monumental Maestro | 8 | archetype | passive | no plan |  |
| Mysterious Breadth | 8 | archetype | passive | no plan |  |
| Occult Breadth | 8 | archetype | passive | no plan |  |
| Order Training | 8 | archetype | passive | no plan |  |
| Ore Fists | 8 | archetype | passive | no plan |  |
| Ouroboric Pact | 8 | archetype | passive | plan | it grants Entreat Pact: its Effect has nothing a fight counts |
| Patron's Breadth | 8 | archetype | passive | no plan |  |
| Physical Training | 8 | archetype | passive | no plan |  |
| Preventative Treatment | 8 | archetype | passive | no plan |  |
| Primal Breadth | 8 | archetype | passive | no plan |  |
| Prolific Prophet Spellcasting | 8 | archetype | passive | no plan |  |
| Public Execution | 8 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Quick Stow (Swordmaster) | 8 | archetype | 1 action | no plan |  |
| Recoiling Relocation | 8 | archetype | free | no plan |  |
| Recycled Cogwheels | 8 | archetype | passive | no plan |  |
| Rupture Stomp | 8 | archetype | 2 actions | no plan |  |
| Salt Kissed | 8 | archetype | passive | plan | a spell the engine doesn't cast (Air Bubble, Water Breathing) |
| Scattered Fire | 8 | archetype | passive | no plan |  |
| Scholar's Hunch | 8 | archetype | passive | no plan |  |
| Shambling March | 8 | archetype | passive | no plan |  |
| Sickening Bite | 8 | archetype | passive | no plan |  |
| Skim Scroll | 8 | archetype | 1 action | no plan |  |
| Smoldering Explosion | 8 | archetype | passive | no plan |  |
| Supreme Psychic Center | 8 | archetype | free | no plan |  |
| Surreptitious Spellcaster | 8 | archetype | passive | plan | it grants Conceal Spell: the feat module reads nothing for it |
| Unbelievable Luck | 8 | archetype | passive | no plan |  |
| Veteran Follower | 8 | archetype | passive | no plan |  |
| Watcher on the Wall | 8 | archetype | 2 actions | no plan |  |
| Wayfinder Resonance Infiltrator | 8 | archetype | passive | no plan |  |
| Advanced Domain Spirit | 10 | archetype | passive | no plan |  |
| Armored Rest | 10 | archetype | passive | no plan |  |
| Assured Ritualist | 10 | archetype | passive | no plan |  |
| Attunement to Stone | 10 | archetype | passive | no plan |  |
| Azure Fins | 10 | archetype | passive | no plan |  |
| Bear Empathy | 10 | archetype | passive | no plan |  |
| Beastmaster Bond | 10 | archetype | passive | no plan |  |
| Blade of the Heart | 10 | archetype | 1 action | no plan |  |
| Cautious Delver | 10 | archetype | passive | no plan |  |
| Close Formation | 10 | archetype | passive | no plan |  |
| Cloud Walk | 10 | archetype | passive | plan | a spell the engine doesn't cast (Air Walk) |
| Communal Tale | 10 | archetype | passive | no plan |  |
| Deathguard | 10 | archetype | passive | no plan |  |
| Emerald Boughs Hideaway | 10 | archetype | passive | no plan |  |
| Emphatic Emissary | 10 | archetype | reaction | no plan |  |
| Exemplar Expertise | 10 | archetype | passive | no plan |  |
| Expand Spiral | 10 | archetype | passive | no plan |  |
| Expert Captivator Spellcasting | 10 | archetype | passive | no plan |  |
| Eye for Smugglers | 10 | archetype | passive | no plan |  |
| Feast Planner | 10 | archetype | passive | no plan |  |
| Gathering Moss | 10 | archetype | free | plan | a plan the engine can't play (its targeting or what it does) |
| Ghost-Path Epiphany | 10 | archetype | passive | no plan |  |
| Giant Snare | 10 | archetype | passive | no plan |  |
| Glutton for Flesh | 10 | archetype | passive | no plan |  |
| Grave Sight | 10 | archetype | passive | no plan |  |
| Greater Magical Edification | 10 | archetype | passive | plan | a spell the engine doesn't cast (Translate, Mindlink, Secret Page) |
| Holy Flower | 10 | archetype | passive | no plan |  |
| Horselord's Bond | 10 | archetype | passive | no plan |  |
| Inked Cache | 10 | archetype | passive | no plan |  |
| Instant Armor | 10 | archetype | passive | no plan |  |
| Keepsake of Power | 10 | archetype | passive | no plan |  |
| Lasting Protection | 10 | archetype | passive | no plan |  |
| Marine Jet | 10 | archetype | 2 actions | no plan |  |
| Martial Exercise | 10 | archetype | passive | no plan |  |
| Menacing Prowess | 10 | archetype | passive | no plan |  |
| No Gods, Only Mortals! | 10 | archetype | free | no plan |  |
| Preserve the Horde | 10 | archetype | free | no plan |  |
| Prophet's Lockbox | 10 | archetype | passive | plan | a spell the engine doesn't cast (Imaginary Lockbox) |
| Reflexive Devotion | 10 | archetype | free | no plan |  |
| Roadkill | 10 | archetype | passive | no plan |  |
| Rope Mastery | 10 | archetype | passive | no plan |  |
| Ship's Shadow | 10 | archetype | passive | no plan |  |
| Signifer's Sight | 10 | archetype | passive | no plan |  |
| Slayer's Presence | 10 | archetype | passive | no plan |  |
| Slingshot Maneuver | 10 | archetype | reaction | no plan |  |
| Spell Swallow | 10 | archetype | passive | plan | it grants Devour Ambient Magic: nothing a fight uses |
| Spraying Mutation | 10 | archetype | passive | no plan |  |
| Surrounding Flames | 10 | archetype | passive | no plan |  |
| Terrain Form | 10 | archetype | 1 action | plan | a spell the feat casts |
| Translocational Adept | 10 | archetype | passive | no plan |  |
| Tunnel | 10 | archetype | passive | no plan |  |
| Unbelievable Escape | 10 | archetype | passive | no plan |  |
| Veil of Bugs | 10 | archetype | passive | no plan |  |
| Vigil's Walls Rise Anew | 10 | archetype | 2 actions | no plan |  |
| Ward Casting | 10 | archetype | reaction | no plan |  |
| Wing Rider | 10 | archetype | passive | no plan |  |
| Advanced Firearm Familiarity | 12 | archetype | passive | no plan |  |
| Advanced Order Training | 12 | archetype | passive | no plan |  |
| Advanced Seeker of Truths | 12 | archetype | passive | no plan |  |
| Archdiabolic Usurpation | 12 | archetype | passive | no plan |  |
| Banshee Cry Display | 12 | archetype | passive | plan | it grants Banshee Cry: a roll whose results the simulator doesn't read |
| Charged Creation | 12 | archetype | passive | no plan |  |
| Combat Premonition | 12 | archetype | passive | no plan |  |
| Communal Sustain | 12 | archetype | 1 action | no plan |  |
| Directed Poison | 12 | archetype | passive | no plan |  |
| Diverse Weapon Expert | 12 | archetype | passive | no plan |  |
| Eagle Eye | 12 | archetype | passive | no plan |  |
| Empowered Onslaught | 12 | archetype | reaction | no plan |  |
| Expert Animist Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Bard Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Beast Gunner Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Cathartic Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Cleric Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Druid Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Eldritch Archer Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Magus Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Necromancer Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Oracle Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Pactbreaker Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Prophet Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Psychic Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Red Mantis Magic | 12 | archetype | passive | no plan |  |
| Expert Rivethun Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Scroll Cache | 12 | archetype | passive | no plan |  |
| Expert Snowcasting | 12 | archetype | passive | no plan |  |
| Expert Sorcerer Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Summoner Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Witch Spellcasting | 12 | archetype | passive | no plan |  |
| Expert Wizard Spellcasting | 12 | archetype | passive | no plan |  |
| Finessed Features | 12 | archetype | passive | no plan |  |
| Gigantic Megafauna Companion | 12 | archetype | passive | no plan |  |
| Great Bear | 12 | archetype | passive | no plan |  |
| Greater Deific Power | 12 | archetype | passive | no plan |  |
| Greater Esoteric Spellcasting | 12 | archetype | passive | no plan |  |
| Greater Sun Blessing | 12 | archetype | passive | no plan |  |
| Intercepting Hand | 12 | archetype | passive | plan | it grants Disarming Interception: a plan the engine can't play (its targeting or what it does) |
| Invoke Movement | 12 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Judgement of the Monolith | 12 | archetype | passive | no plan |  |
| Knight in Shining Armor | 12 | archetype | passive | no plan |  |
| Know Thy Doom | 12 | archetype | reaction | no plan |  |
| Liberty's Devotion | 12 | archetype | passive | no plan |  |
| Master Spotter | 12 | archetype | passive | no plan |  |
| Master Spotter (Investigator) | 12 | archetype | passive | no plan |  |
| Master Spotter (Ranger) | 12 | archetype | passive | no plan |  |
| Officer's Expertise | 12 | archetype | passive | no plan |  |
| Oneiric Influence | 12 | archetype | passive | no plan |  |
| Order Cross-Training | 12 | archetype | passive | no plan |  |
| Pact of the Crossroads | 12 | archetype | passive | no plan |  |
| Plentiful Snares | 12 | archetype | passive | no plan |  |
| Read the Land | 12 | archetype | passive | no plan |  |
| Reaper of Repose | 12 | archetype | passive | no plan |  |
| Rejuvenation | 12 | archetype | passive | no plan |  |
| Resolute | 12 | archetype | passive | no plan |  |
| Runic Expertise | 12 | archetype | passive | no plan |  |
| Secret Eater | 12 | archetype | passive | no plan |  |
| Shared Tide | 12 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Shepherd of Desolation | 12 | archetype | passive | no plan |  |
| Shift Horde | 12 | archetype | 1 action | no plan |  |
| Shroud of the Seas | 12 | archetype | passive | no plan |  |
| Signifer Armor Expertise | 12 | archetype | passive | no plan |  |
| Smooth Hover | 12 | archetype | free | no plan |  |
| Swap Investment | 12 | archetype | passive | no plan |  |
| Tandem Auras | 12 | archetype | passive | no plan |  |
| Tunneling Claws | 12 | archetype | passive | no plan |  |
| Vernai Training | 12 | archetype | passive | no plan |  |
| Wings of the Moon | 12 | archetype | passive | no plan |  |
| Armored Exercise | 14 | archetype | passive | no plan |  |
| Commandeer Hellmouth | 14 | archetype | passive | plan | a spell the engine doesn't cast (Teleport, Interplanar Teleport) |
| Control Tower | 14 | archetype | passive | plan | a passive's Effect on other creatures |
| Costume Change | 14 | archetype | passive | plan | it grants Impromptu Investment: the feat module reads nothing for it |
| Domino Effect | 14 | archetype | reaction | no plan |  |
| Dream Logic | 14 | archetype | passive | no plan |  |
| Effortless Captivation | 14 | archetype | free | no plan |  |
| Enterprising Ritualist | 14 | archetype | passive | no plan |  |
| Exceptional Follower | 14 | archetype | passive | no plan |  |
| Expanded Swarm | 14 | archetype | passive | no plan |  |
| Graveshift | 14 | archetype | passive | no plan |  |
| Instant Credentials | 14 | archetype | passive | no plan |  |
| Iron Lung | 14 | archetype | passive | no plan |  |
| Pact of Eldritch Eyes | 14 | archetype | passive | plan | a spell the engine doesn't cast (Scouting Eye) |
| Pact of the Fey Paths | 14 | archetype | passive | plan | it grants Fey Jump: a teleport |
| Precise Hooks | 14 | archetype | passive | no plan |  |
| Rapid Hybridization | 14 | archetype | free | no plan |  |
| Reset the Past | 14 | archetype | free | no plan |  |
| Sentinel's Orbit | 14 | archetype | passive | no plan |  |
| Speak for the Gravelands | 14 | archetype | passive | plan | it grants Geomancer Dedication: the feat module reads nothing for it |
| Stone Communion | 14 | archetype | passive | no plan |  |
| Talismanic Sage | 14 | archetype | passive | no plan |  |
| Thwart Evil | 14 | archetype | reaction | no plan |  |
| Unfetter Sight | 14 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Unlimited Ghost Flight | 14 | archetype | passive | no plan |  |
| Adamantine Fists | 16 | archetype | passive | no plan |  |
| Aura Expertise | 16 | archetype | free | no plan |  |
| Bolster Soul Cage | 16 | archetype | passive | no plan |  |
| Cross the Threshold | 16 | archetype | passive | plan | a spell the engine doesn't cast (Ethereal Jaunt) |
| Greater Snow Step | 16 | archetype | passive | no plan |  |
| Hidden Hoard | 16 | archetype | passive | no plan |  |
| Master Captivator Spellcasting | 16 | archetype | passive | no plan |  |
| Officer's Protection | 16 | archetype | passive | no plan |  |
| Performance Weapon Expert | 16 | archetype | passive | no plan |  |
| Resuscitate | 16 | archetype | 3 actions | plan | a roll whose results the simulator doesn't read |
| Rivethun Adept | 16 | archetype | passive | plan | a spell the engine doesn't cast (Speak with Stones, Spiritual Guardian) |
| Shared Dream | 16 | archetype | passive | plan | a spell the engine doesn't cast (Dream Council) |
| The Bitter Scholar's Promotion | 16 | archetype | passive | no plan |  |
| The Immortal Attains the Summit | 16 | archetype | passive | no plan |  |
| Unwind Death | 16 | archetype | 3 actions | plan | a roll whose results the simulator doesn't read |
| Chemical Contagion | 18 | archetype | passive | plan | it grants Greater Field Discovery (Toxicologist): the feat module reads nothing for it |
| Eyes of God | 18 | archetype | passive | no plan |  |
| Flash of Omniscience | 18 | archetype | free | no plan |  |
| Major Deific Power | 18 | archetype | passive | no plan |  |
| Master Animist Spellcasting | 18 | archetype | passive | no plan |  |
| Master Bard Spellcasting | 18 | archetype | passive | no plan |  |
| Master Beast Gunner Spellcasting | 18 | archetype | passive | no plan |  |
| Master Cathartic Spellcasting | 18 | archetype | passive | no plan |  |
| Master Cleric Spellcasting | 18 | archetype | passive | no plan |  |
| Master Druid Spellcasting | 18 | archetype | passive | no plan |  |
| Master Eldritch Archer Spellcasting | 18 | archetype | passive | no plan |  |
| Master Magus Spellcasting | 18 | archetype | passive | no plan |  |
| Master Necromancer Spellcasting | 18 | archetype | passive | no plan |  |
| Master Oracle Spellcasting | 18 | archetype | passive | no plan |  |
| Master Pactbreaker Spellcasting | 18 | archetype | passive | no plan |  |
| Master Prophet Spellcasting | 18 | archetype | passive | no plan |  |
| Master Psychic Spellcasting | 18 | archetype | passive | no plan |  |
| Master Red Mantis Magic | 18 | archetype | passive | no plan |  |
| Master Rivethun Spellcasting | 18 | archetype | passive | no plan |  |
| Master Scroll Cache | 18 | archetype | passive | no plan |  |
| Master Snowcasting | 18 | archetype | passive | no plan |  |
| Master Sorcerer Spellcasting | 18 | archetype | passive | no plan |  |
| Master Summoner Spellcasting | 18 | archetype | passive | no plan |  |
| Master Witch Spellcasting | 18 | archetype | passive | no plan |  |
| Master Wizard Spellcasting | 18 | archetype | passive | no plan |  |
| Mighty Bear | 18 | archetype | passive | no plan |  |
| Mighty Dragon Shape | 18 | archetype | passive | no plan |  |
| Miraculous Flight | 18 | archetype | passive | no plan |  |
| Officer's Mastery | 18 | archetype | passive | no plan |  |
| Pact of the Living Pact | 18 | archetype | passive | plan | it grants Forced Pact: a roll whose results the simulator doesn't read |
| Soaring Dynamo | 18 | archetype | passive | no plan |  |
| Spirit of Vigil | 18 | archetype | passive | no plan |  |
| Enter Divine Realm | 20 | archetype | passive | plan | a spell the engine doesn't cast (Interplanar Teleport) |
| Live the Creed | 20 | archetype | 1 action | no plan |  |
| Moment of Apotheosis | 20 | archetype | passive | plan | a spell the engine doesn't cast (Avatar) |
| Mortal Possibility | 20 | archetype | passive | no plan |  |
| Spark of Immortality | 20 | archetype | passive | no plan |  |
| Tower Shield Mastery | 20 | archetype | passive | no plan |  |
| Moment of Clarity | 1 | barbarian | 1 action | no plan |  |
| Spiritual Guides | 4 | barbarian | reaction | plan | a reroll |
| Spirits' Interference | 6 | barbarian | 1 action | no plan |  |
| Animalistic Brutality | 8 | barbarian | 1 action | no plan |  |
| Invulnerable Rager | 8 | barbarian | passive | no plan |  |
| Embrace the Pain | 12 | barbarian | reaction | no plan |  |
| Titan's Stature | 12 | barbarian | passive | no plan |  |
| Sunder Enchantment | 14 | barbarian | passive | no plan |  |
| Quaking Stomp | 20 | barbarian | 1 action | plan | a spell the feat casts |
| Reliable Squire | 2 | bard | passive | no plan |  |
| Ritual Researcher | 4 | bard | passive | no plan |  |
| Zoophonic Composition | 4 | bard | free | no plan |  |
| Educate Allies | 6 | bard | reaction | plan | an Effect with nothing a fight counts |
| Ears of the Forest | 8 | bard | passive | no plan |  |
| Eclectic Skill | 8 | bard | passive | no plan |  |
| Soulsight (Bard) | 8 | bard | passive | no plan |  |
| Musical Summons | 14 | bard | 3 actions | no plan |  |
| Effortless Concentration | 16 | bard | free | no plan |  |
| Deep Lore | 18 | bard | passive | no plan |  |
| Impossible Polymath | 18 | bard | passive | no plan |  |
| Head of the Night Parade | 20 | bard | 3 actions | plan | a spell the feat casts |
| Ultimate Polymath | 20 | bard | passive | no plan |  |
| Deity's Domain | 1 | champion | passive | no plan |  |
| Weight of Guilt | 1 | champion | passive | no plan |  |
| Light of Revelation | 4 | champion | passive | plan | a spell the engine doesn't cast (Light of Revelation) |
| Security | 4 | champion | passive | no plan |  |
| Expand Aura | 6 | champion | 1 action | plan | a timer with no rules a fight counts |
| Shield Wall | 6 | champion | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Advanced Deity's Domain | 8 | champion | passive | no plan |  |
| Greater Cruelty | 8 | champion | passive | no plan |  |
| Sense Holiness | 8 | champion | passive | no plan |  |
| Sense Unholiness | 8 | champion | passive | no plan |  |
| Aura of Faith | 12 | champion | passive | no plan |  |
| Champion's Sacrifice | 12 | champion | passive | no plan |  |
| Anchoring Aura | 14 | champion | passive | no plan |  |
| Aura of Determination | 14 | champion | passive | no plan |  |
| False Faith | 1 | cleric | passive | no plan |  |
| Harming Hands | 1 | cleric | passive | no plan |  |
| Healing Hands | 1 | cleric | passive | no plan |  |
| Syncretism | 1 | cleric | passive | no plan |  |
| Versatile Font | 2 | cleric | passive | no plan |  |
| Warpriest's Armor | 2 | cleric | passive | no plan |  |
| Directed Channel | 4 | cleric | passive | no plan |  |
| Expanded Domain Initiate | 4 | cleric | passive | no plan |  |
| Advanced Domain | 8 | cleric | passive | no plan |  |
| Restorative Channel | 8 | cleric | passive | no plan |  |
| Void Siphon | 8 | cleric | passive | no plan |  |
| Fortunate Relief | 12 | cleric | passive | no plan |  |
| Channeling Block | 14 | cleric | passive | no plan |  |
| Fast Channel | 14 | cleric | passive | no plan |  |
| Lasting Armament | 14 | cleric | passive | no plan |  |
| Swift Banishment | 14 | cleric | reaction | no plan |  |
| Eternal Bane | 16 | cleric | passive | no plan |  |
| Avatar's Audience | 20 | cleric | passive | plan | a spell the engine doesn't cast (Commune, Interplanar Teleport) |
| Emblazon Divinity | 20 | cleric | passive | no plan |  |
| Deceptive Tactics | 1 | commander | passive | plan | it grants Lengthy Diversion: the feat module reads nothing for it |
| Officer's Medical Training | 1 | commander | passive | plan | it grants Battle Medicine: the feat module reads nothing for it |
| Adaptive Stratagem | 2 | commander | free | no plan |  |
| Tactical Expansion | 2 | commander | passive | no plan |  |
| Efficient Preparation | 6 | commander | passive | no plan |  |
| Officer's Education | 8 | commander | passive | no plan |  |
| Desperate Resuscitation | 14 | commander | 3 actions | plan | a roll whose results the simulator doesn't read |
| Animal Empathy | 1 | druid | passive | no plan |  |
| Plant Empathy | 1 | druid | passive | no plan |  |
| Shore Step | 1 | druid | passive | no plan |  |
| Storm Born | 1 | druid | passive | no plan |  |
| Call of the Wild | 2 | druid | passive | no plan |  |
| Order Explorer | 2 | druid | passive | no plan |  |
| Elemental Summons | 4 | druid | passive | no plan |  |
| Forest Passage | 4 | druid | passive | no plan |  |
| Natural Swimmer | 4 | druid | passive | no plan |  |
| Misty Transformation | 6 | druid | reaction | plan | a lasting area |
| Toppling Transformation | 6 | druid | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Can't You See? | 8 | druid | passive | no plan |  |
| Eerie Environs | 8 | druid | passive | no plan |  |
| Fey Caller | 8 | druid | passive | no plan |  |
| Wandering Oasis | 12 | druid | passive | no plan |  |
| Cleansing Transformation | 14 | druid | passive | no plan |  |
| Verdant Metamorphosis | 14 | druid | passive | plan | it grants Verdant Rest: the feat module reads nothing for it |
| Too Much to Swallow | 16 | druid | reaction | plan | a spell the feat casts |
| Cunning Trickster Mask | 20 | druid | passive | plan | it grants Conceal Spell: the feat module reads nothing for it |
| Lightning Swap | 2 | exemplar | 1 action | no plan |  |
| Rapid Spark | 12 | exemplar | free | no plan |  |
| Complete the Hero's Journey | 14 | exemplar | 1 action | no plan |  |
| Strike Rivers, Seize Winds | 16 | exemplar | passive | no plan |  |
| Blade Brake | 2 | fighter | reaction | no plan |  |
| Cheaters Always Prosper | 4 | fighter | passive | no plan |  |
| Advanced Weapon Training | 6 | fighter | passive | no plan |  |
| Furious Focus | 6 | fighter | passive | no plan |  |
| Agile Grace | 10 | fighter | passive | no plan |  |
| Desperate Finisher | 14 | fighter | reaction | plan | a timer with no rules a fight counts |
| Opening Stance | 14 | fighter | free | no plan |  |
| Master of Many Styles | 16 | fighter | free | no plan |  |
| Smash from the Air | 18 | fighter | passive | no plan |  |
| Larger Than Life (Guardian) | 1 | guardian | passive | no plan |  |
| Get Behind Me! | 10 | guardian | passive | no plan |  |
| Right Where You Want Them | 12 | guardian | passive | no plan |  |
| Shield from Spells | 18 | guardian | passive | no plan |  |
| Black Powder Boost | 4 | gunslinger | 1 action | plan | a teleport |
| Greenwatch Initiate | 4 | gunslinger | passive | plan | it grants one of 2 (Experienced Tracker: the feat module reads nothing for it; Survey Wildlife: the feat module reads no |
| Instant Backup | 4 | gunslinger | reaction | no plan |  |
| Ostentatious Reload | 4 | gunslinger | 1 action | plan | a roll whose results the simulator doesn't read |
| Advanced Shooter | 6 | gunslinger | passive | no plan |  |
| Unseen Passage | 8 | gunslinger | passive | plan | a spell the engine doesn't cast (Vanishing Tracks) |
| Precious Munitions | 10 | gunslinger | passive | no plan |  |
| Redirecting Shot | 10 | gunslinger | reaction | no plan |  |
| Deadeye | 12 | gunslinger | 1 action | plan | a timer with no rules a fight counts |
| Shooter's Camouflage | 12 | gunslinger | passive | no plan |  |
| Come at Me! | 14 | gunslinger | passive | no plan |  |
| Reach for the Stars | 18 | gunslinger | passive | no plan |  |
| Built-In Tools | 1 | inventor | passive | no plan |  |
| Explosive Leap | 1 | inventor | 1 action | no plan |  |
| Haphazard Repair | 1 | inventor | 1 action | no plan |  |
| Collapse Armor | 2 | inventor | 1 action | no plan |  |
| Reverse Engineer | 2 | inventor | passive | no plan |  |
| Visual Fidelity | 6 | inventor | passive | no plan |  |
| Ubiquitous Gadgets | 8 | inventor | passive | no plan |  |
| Boost Modulation | 12 | inventor | passive | no plan |  |
| Soaring Armor | 14 | inventor | passive | no plan |  |
| Just the Thing! | 16 | inventor | passive | no plan |  |
| That's Odd | 1 | investigator | passive | no plan |  |
| Person of Interest | 2 | investigator | 1 action | no plan |  |
| Alchemical Discoveries | 4 | investigator | passive | no plan |  |
| Deadly Casework | 6 | investigator | passive | no plan |  |
| Predictive Purchase (Investigator) | 6 | investigator | passive | plan | it grants one of 2 (Prescient Planner: the feat module reads nothing for it; Prescient Consumable: the feat module reads |
| Suspect of Opportunity | 10 | investigator | reaction | no plan |  |
| Share Tincture | 12 | investigator | 1 action | plan | a timer with no rules a fight counts |
| Sense the Unseen | 14 | investigator | reaction | no plan |  |
| Implausible Purchase (Investigator) | 16 | investigator | passive | no plan |  |
| Deduce Habits | 18 | investigator | passive | no plan |  |
| Everyone's a Suspect | 20 | investigator | passive | no plan |  |
| Eternal Torch | 1 | kineticist | 1 action | no plan |  |
| Flashforge | 1 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Geologic Attunement | 1 | kineticist | 1 action | plan | an Effect with nothing a fight counts |
| Stepping Stones | 1 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Timber Sentinel | 1 | kineticist | 2 actions | no plan |  |
| Whisper on the Wind | 1 | kineticist | 1 action | plan | a spell the feat casts |
| Air Shroud | 4 | kineticist | 1 action | plan | an Effect with nothing a fight counts |
| Born to the Trees | 4 | kineticist | 2 actions | no plan |  |
| Magnetic Field | 4 | kineticist | 1 action | plan | an Effect with nothing a fight counts |
| Plate in Treasure | 4 | kineticist | 1 action | plan | a spell the feat casts |
| Cyclonic Ascent | 8 | kineticist | 2 actions | no plan |  |
| Impenetrable Fog | 8 | kineticist | 3 actions | plan | a lasting area |
| Purify Element | 8 | kineticist | 2 actions | no plan |  |
| Elemental Transformation | 10 | kineticist | 1 action | no plan |  |
| Effortless Impulse | 12 | kineticist | free | no plan |  |
| Rattle the Earth | 12 | kineticist | 2 actions | plan | a spell the feat casts |
| Barrier of Boreal Frost | 14 | kineticist | 3 actions | plan | a spell the feat casts |
| Imperious Aura | 16 | kineticist | free | no plan |  |
| Elemental Apotheosis | 18 | kineticist | passive | no plan |  |
| Omnikinesis | 20 | kineticist | 1 action | no plan |  |
| Maelstrom Flow | 10 | magus | 1 action | plan | a timer with no rules a fight counts |
| Magic Sense (Magus) | 12 | magus | passive | no plan |  |
| Monastic Weaponry | 1 | monk | passive | no plan |  |
| Qi Spells | 1 | monk | passive | no plan |  |
| Ancestral Weaponry | 2 | monk | passive | no plan |  |
| Brawling Focus | 2 | monk | passive | no plan |  |
| Shooting Stars Stance | 2 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Student of Water | 2 | monk | passive | plan | it grants one of 2 (Underwater Marauder: the feat module reads nothing for it; Water Sprint: the feat module reads nothi |
| Advanced Monastic Weaponry | 6 | monk | passive | no plan |  |
| Advanced Qi Spells | 6 | monk | passive | no plan |  |
| Reflexive Stance | 12 | monk | free | no plan |  |
| Sense Ki | 12 | monk | passive | no plan |  |
| Tongue of Sun and Moon | 14 | monk | passive | no plan |  |
| Fuse Stance | 16 | monk | passive | no plan |  |
| Master Qi Spells | 16 | monk | passive | no plan |  |
| Effortless Reach | 18 | monk | passive | no plan |  |
| Grandmaster Qi Spells | 18 | monk | passive | no plan |  |
| Endurance of the Rooted Tree | 20 | monk | passive | no plan |  |
| Lightning Qi | 20 | monk | free | no plan |  |
| Wake of Devastation | 20 | monk | passive | no plan |  |
| Widespread Fascination | 1 | necromancer | passive | no plan |  |
| Invert Harm | 2 | necromancer | passive | no plan |  |
| Undead Creator | 2 | necromancer | passive | no plan |  |
| Overwhelming Harm | 4 | necromancer | passive | no plan |  |
| Bind Heroic Spirit | 6 | necromancer | passive | plan | a spell the engine doesn't cast (Bind Heroic Spirit) |
| Conglomerate of Limbs | 8 | necromancer | passive | plan | a spell the engine doesn't cast (Conglomerate of Limbs) |
| Blossoming Gore | 10 | necromancer | passive | plan | a spell the engine doesn't cast (Blossoming Gore) |
| Expanded Necromancy | 10 | necromancer | passive | no plan |  |
| Bridge of Graves | 12 | necromancer | passive | plan | a spell the engine doesn't cast (Bridge of Graves) |
| Instinctual Creation | 14 | necromancer | free | no plan |  |
| Ocular Flesh | 14 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Flesh Tsunami | 16 | necromancer | passive | plan | a spell the engine doesn't cast (Flesh Tsunami) |
| Power Hungry | 18 | necromancer | passive | no plan |  |
| Instant Army | 20 | necromancer | 1 action | no plan |  |
| Spiritual Sense | 6 | oracle | passive | no plan |  |
| Magic Sense | 12 | oracle | passive | no plan |  |
| Forestall Curse | 14 | oracle | 1 action | no plan |  |
| Scapegoat Parallel Self | 20 | oracle | reaction | no plan |  |
| Unbound Torrent | 1 | other | passive | no plan |  |
| Arms That Cut the Waves | 2 | other | passive | no plan |  |
| Cantrip Casting | 2 | other | passive | no plan |  |
| Feet That Stride the Sky | 2 | other | passive | no plan |  |
| Hands That Unweave Disaster | 2 | other | passive | no plan |  |
| Awakened Power | 4 | other | passive | no plan |  |
| Become Shadow | 4 | other | passive | no plan |  |
| Mythic Refocus | 8 | other | 1 action | plan | a Focus or Mythic Point back |
| Summon Mythic Power | 8 | other | 1 action | plan | a Focus or Mythic Point back |
| Become Destiny | 10 | other | free | no plan |  |
| Greater Awakened Power | 10 | other | passive | no plan |  |
| Expert Spellcasting | 12 | other | passive | no plan |  |
| Athlete's Ally | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Be Right Back | 14 | other | 3 actions | no plan |  |
| Behold, a Pale Horse | 14 | other | passive | no plan |  |
| Bloc Tactics | 14 | other | passive | no plan |  |
| Break the Cycle | 14 | other | passive | plan | it grants Legendary Negotiation: the feat module reads nothing for it |
| Don Thy Fervor | 14 | other | 1 action | plan | an Effect with nothing a fight counts |
| Extend Surge | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Internal Dialogue | 14 | other | reaction | no plan |  |
| Lightless Sight | 14 | other | passive | plan | it grants Weaponsight: an Effect with nothing a fight counts |
| Manipulate Realm | 14 | other | passive | plan | it grants one of 3 (Drain Realm: a plan the engine can't play (its targeting or what it does); Spread Realm: the feat mo |
| Sink and Swim | 14 | other | passive | plan | it grants Water Transfer: a teleport |
| Spell Network | 14 | other | free | no plan |  |
| Night Terror | 16 | other | passive | no plan |  |
| Rapid Switch | 16 | other | free | no plan |  |
| Advanced Runelord Magic | 18 | other | passive | no plan |  |
| Fated Duel | 18 | other | 1 action | no plan |  |
| Master Spellcasting | 18 | other | passive | no plan |  |
| Mythic Counter | 18 | other | passive | no plan |  |
| Assume Godhood | 20 | other | passive | plan | it grants Intercession Spell: the feat module reads nothing for it |
| Break the Causal Chain | 20 | other | passive | no plan |  |
| Legacy of Monarchs | 20 | other | passive | no plan |  |
| Ancestral Mind | 1 | psychic | passive | no plan |  |
| Astral Tether | 4 | psychic | 1 action | no plan |  |
| Sixth Sense | 6 | psychic | passive | no plan |  |
| Thoughtsense | 8 | psychic | passive | no plan |  |
| Signature Spell Expansion (Psychic) | 10 | psychic | passive | no plan |  |
| Constant Levitation | 16 | psychic | passive | no plan |  |
| Initiate Warden | 1 | ranger | passive | no plan |  |
| Favored Terrain | 2 | ranger | passive | no plan |  |
| Snare Hopping | 2 | ranger | passive | plan | a spell the engine doesn't cast (Snare Hopping) |
| Advanced Warden | 4 | ranger | passive | no plan |  |
| Far Shot | 4 | ranger | passive | no plan |  |
| Masterful Warden | 6 | ranger | passive | no plan |  |
| Terrain Master | 8 | ranger | passive | no plan |  |
| Warden's Boon | 8 | ranger | 1 action | no plan |  |
| Camouflage | 10 | ranger | passive | no plan |  |
| Peerless Warden | 10 | ranger | passive | no plan |  |
| Obscured Emergence | 12 | ranger | passive | no plan |  |
| Legendary Monster Hunter | 16 | ranger | passive | no plan |  |
| Ubiquitous Snares | 16 | ranger | passive | no plan |  |
| Warden's Reload | 16 | ranger | free | no plan |  |
| Accurate Flurry | 20 | ranger | passive | no plan |  |
| Ultimate Skirmisher | 20 | ranger | passive | no plan |  |
| Plant Evidence | 1 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Fane's Fourberie | 2 | rogue | 1 action | plan | an Effect with nothing a fight counts |
| Devrin's Dazzling Diversion | 4 | rogue | passive | no plan |  |
| Fog Cloak | 6 | rogue | passive | no plan |  |
| Shove Down | 6 | rogue | free | plan | a plan the engine can't play (its targeting or what it does) |
| Watch Your Back | 6 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Predictive Purchase (Rogue) | 8 | rogue | passive | plan | it grants one of 2 (Prescient Planner: the feat module reads nothing for it; Prescient Consumable: the feat module reads |
| Deny Support | 10 | rogue | passive | no plan |  |
| Sneak Adept | 10 | rogue | passive | no plan |  |
| Blank Slate | 16 | rogue | passive | no plan |  |
| Perfect Distraction | 16 | rogue | 1 action | no plan |  |
| Implausible Infiltration | 18 | rogue | 2 actions | no plan |  |
| Implausible Purchase (Rogue) | 18 | rogue | passive | no plan |  |
| Extradimensional Stash | 20 | rogue | passive | no plan |  |
| Hidden Paragon | 20 | rogue | reaction | plan | a plan the engine can't play (its targeting or what it does) |
| Steal Essence | 20 | rogue | 2 actions | plan | a timer with no rules a fight counts |
| Fortifying Knock | 2 | runesmith | 1 action | plan | an Effect with nothing a fight counts |
| Song of Glorious Invocation | 4 | runesmith | 1 action | plan | a plan the engine can't play (its targeting or what it does) |
| Terrifying Invocation | 4 | runesmith | 1 action | no plan |  |
| Transpose Etching | 4 | runesmith | 1 action | no plan |  |
| Writing On the Wall | 4 | runesmith | passive | plan | a spell the engine doesn't cast (Embed Message) |
| Diacritic Fluency | 6 | runesmith | free | no plan |  |
| Words, Fly Free | 6 | runesmith | 1 action | no plan |  |
| Elemental Revision | 8 | runesmith | 1 action | plan | a timer with no rules a fight counts |
| Distant Invocation | 12 | runesmith | passive | no plan |  |
| Define the Canvas | 14 | runesmith | 2 actions | plan | a timer with no rules a fight counts |
| Blessed Blood (Sorcerer) | 1 | sorcerer | passive | no plan |  |
| Advanced Bloodline | 6 | sorcerer | passive | no plan |  |
| Spell Relay | 6 | sorcerer | reaction | no plan |  |
| Crossblooded Evolution | 8 | sorcerer | passive | no plan |  |
| Soulsight (Sorcerer) | 8 | sorcerer | passive | no plan |  |
| Greater Bloodline | 10 | sorcerer | passive | no plan |  |
| Signature Spell Expansion | 10 | sorcerer | passive | no plan |  |
| Terraforming Trickery | 12 | sorcerer | passive | no plan |  |
| Blood Ascendancy | 14 | sorcerer | passive | no plan |  |
| Reflect Spell | 14 | sorcerer | passive | no plan |  |
| Tenacious Blood Magic | 20 | sorcerer | free | plan | a timer with no rules a fight counts |
| Disarming Flair | 1 | swashbuckler | passive | no plan |  |
| Focused Fascination | 1 | swashbuckler | passive | no plan |  |
| After You | 2 | swashbuckler | free | plan | an Effect with nothing a fight counts |
| Enjoy the Show | 2 | swashbuckler | passive | plan | a passive's Effect on other creatures |
| Even the Odds | 4 | swashbuckler | free | plan | an Effect with nothing a fight counts |
| Deadly Grace | 16 | swashbuckler | passive | no plan |  |
| Incredible Luck (Swashbuckler) | 18 | swashbuckler | passive | no plan |  |
| Haunt Ingenuity | 1 | thaumaturge | passive | no plan |  |
| Call Implement | 2 | thaumaturge | 1 action | no plan |  |
| Thaumaturgic Ritualist | 4 | thaumaturge | passive | plan | a passive's Effect posted by hand |
| One More Activation | 6 | thaumaturge | passive | no plan |  |
| Elaborate Talisman Esoterica | 8 | thaumaturge | passive | no plan |  |
| Thaumaturge's Investiture | 10 | thaumaturge | passive | plan | it grants Incredible Investiture: the feat module reads nothing for it |
| Elaborate Scroll Esoterica | 12 | thaumaturge | passive | no plan |  |
| Thaumaturge's Demesne | 12 | thaumaturge | passive | no plan |  |
| Grand Talisman Esoterica | 14 | thaumaturge | passive | no plan |  |
| Unlimited Demesne | 20 | thaumaturge | passive | no plan |  |
| Syu Tak-nwa's Skillful Tresses | 4 | witch | passive | no plan |  |
| Murksight | 8 | witch | passive | no plan |  |
| Witch's Communion | 10 | witch | passive | no plan |  |
| Irresistible Magic | 6 | wizard | passive | no plan |  |
| Shrink Spell | 6 | wizard | passive | no plan |  |
| Advanced School Spell | 8 | wizard | passive | no plan |  |
| Form Retention | 8 | wizard | passive | no plan |  |
| Spellbinding Speech | 8 | wizard | 1 action | plan | a roll whose results the simulator doesn't read |
| Shift Spell | 14 | wizard | 1 action | no plan |  |
