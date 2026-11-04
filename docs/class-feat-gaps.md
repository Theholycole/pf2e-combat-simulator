# Class feats neither the feat module nor the simulator plays

Made by `node tools/class-feat-index.mjs` on 2026-11-03 from the feat screen's rows: PF2e's class-category feats (class and archetype feats). 1047 are rated; 3309 aren't. **No plan** means the feat module compiles nothing for it and PF2e's own rules give the simulator nothing a fight counts; **plan** means the feat module has a card for it the simulator doesn't play (the reason column). Teams+ and other module packs aren't in this copy, so they aren't here.

Buckets go by the feat's text: dedications first, then what a fight would use, then the rest. A feat that is only a combination of basic actions is still listed; it's discarded when it comes up.

## By bucket

| Bucket | No plan | Plan, not played | Total |
|---|---:|---:|---:|
| Archetype dedications (grant class features) | 177 | 4 | 181 |
| Combat actions and reactions | 278 | 431 | 709 |
| Passives that change a class feature | 228 | 21 | 249 |
| Other combat passives | 390 | 49 | 439 |
| Spellcasting (slots, focus, spellshapes) | 269 | 39 | 308 |
| Companions, familiars and eidolons | 195 | 51 | 246 |
| Out of combat (exploration, downtime, skills) | 313 | 33 | 346 |
| Nothing a fight would use | 739 | 92 | 831 |
| **All** | 2589 | 720 | 3309 |

## By class

| Class | dedication | combat-action | feature-upgrade | combat-passive | spellcasting | companion | out-of-combat | other | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| alchemist |  | 5 | 17 | 16 |  | 1 | 12 | 15 | 66 |
| animist |  | 6 | 4 |  | 12 | 3 | 4 | 2 | 31 |
| barbarian |  | 26 | 15 | 5 |  |  |  | 10 | 56 |
| bard |  | 7 | 12 |  | 26 | 1 | 14 | 14 | 74 |
| champion |  | 11 | 16 | 19 | 3 | 11 | 6 | 15 | 81 |
| cleric |  | 9 | 1 | 16 | 18 | 1 | 8 | 18 | 71 |
| commander |  | 11 | 1 | 6 |  | 4 | 5 | 7 | 34 |
| druid |  | 5 | 13 | 4 | 21 | 11 | 7 | 18 | 79 |
| exemplar |  | 6 | 28 | 2 |  |  | 3 | 4 | 43 |
| fighter |  | 28 |  | 11 |  |  | 1 | 11 | 51 |
| guardian |  | 16 | 3 | 9 |  |  | 2 | 5 | 35 |
| gunslinger |  | 27 | 4 | 13 |  | 1 | 4 | 11 | 60 |
| inventor |  | 9 | 8 | 1 |  | 7 | 5 | 11 | 41 |
| investigator |  | 5 | 4 | 13 |  | 1 | 17 | 11 | 51 |
| kineticist |  | 42 | 5 | 1 | 1 | 1 | 6 | 22 | 78 |
| magus |  | 16 | 10 | 2 | 11 | 1 | 6 | 6 | 52 |
| monk |  | 25 | 2 | 13 | 2 |  | 2 | 23 | 67 |
| necromancer |  | 12 | 5 | 6 | 9 | 1 | 6 | 20 | 59 |
| oracle |  | 6 | 6 |  | 10 |  | 4 | 4 | 30 |
| psychic |  | 5 | 1 | 1 | 20 |  | 1 | 7 | 35 |
| ranger |  | 7 | 12 | 7 |  | 11 | 14 | 17 | 68 |
| rogue |  | 27 | 3 | 23 | 3 |  | 2 | 16 | 74 |
| runesmith |  | 17 | 11 | 1 |  | 2 | 6 | 9 | 46 |
| sorcerer |  | 1 | 1 | 6 | 24 | 1 | 7 | 11 | 51 |
| summoner |  |  |  |  | 1 | 55 | 5 |  | 61 |
| swashbuckler |  | 15 | 8 | 8 |  |  |  | 9 | 40 |
| thaumaturge |  | 10 | 9 | 2 | 1 | 1 | 5 | 10 | 38 |
| witch |  | 2 | 3 | 2 | 4 | 16 | 7 | 3 | 37 |
| wizard |  | 2 |  | 1 | 16 | 4 | 10 | 6 | 39 |
| archetype | 169 | 299 | 45 | 210 | 108 | 100 | 148 | 481 | 1560 |
| other | 12 | 52 | 2 | 41 | 18 | 12 | 29 | 35 | 201 |

## Why the simulator doesn't play the ones with a plan

| Reason | Count |
|---|---:|
| a timer with no rules a fight counts | 126 |
| its requirement | 119 |
| a Strike with nothing more the simulator reads | 88 |
| a spell the engine doesn't cast | 46 |
| an Effect with nothing a fight counts | 42 |
| a roll whose results the simulator doesn't read | 38 |
| a teleport | 37 |
| its text has no Strike of its user's | 36 |
| a reaction's Strike | 24 |
| a spell the feat casts | 18 |
| a passive's Effect on other creatures | 17 |
| a passive's Effect posted by hand | 15 |
| a reaction to "passive" | 14 |
| its requirement, which the PC doesn't meet | 13 |
| a passive's roll with no action to use it | 12 |
| a lasting area | 11 |
| its Effect has nothing a fight counts | 10 |
| a passive's Strike | 10 |
| an Effect on another creature | 8 |
| a choice of ways the simulator doesn't play | 7 |
| a reroll | 6 |
| its stance | 4 |
| a Focus or Mythic Point back | 4 |
| a companion's Strike | 4 |
| nothing a fight uses | 3 |
| a roll twice | 2 |
| a reaction to "aura" | 2 |
| a target the simulator can't tell | 1 |
| a free's Strike | 1 |
| a reaction to "hit-by" | 1 |
| a reaction to "own-strike" | 1 |

## Archetype dedications (grant class features) (181)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Acrobat Dedication | 2 | archetype | passive | no plan |  |
| Alchemist Dedication | 2 | archetype | passive | no plan |  |
| Aldori Duelist Dedication | 2 | archetype | passive | no plan |  |
| Alkenstar Agent Dedication | 2 | archetype | passive | no plan |  |
| Alter Ego Dedication | 2 | archetype | passive | no plan |  |
| Animal Trainer Dedication | 2 | archetype | passive | no plan |  |
| Archaeologist Dedication | 2 | archetype | passive | no plan |  |
| Archer Dedication | 2 | archetype | passive | no plan |  |
| Artillerist Dedication | 2 | archetype | passive | no plan |  |
| Assassin Dedication | 2 | archetype | passive | no plan |  |
| Beastmaster Dedication | 2 | archetype | passive | no plan |  |
| Blackjacket Dedication | 2 | archetype | passive | no plan |  |
| Bounty Hunter Dedication | 2 | archetype | passive | no plan |  |
| Bright Lion Dedication | 2 | archetype | passive | no plan |  |
| Bullet Dancer Dedication | 2 | archetype | passive | no plan |  |
| Campfire Chronicler Dedication | 2 | archetype | passive | no plan |  |
| Captain Dedication | 2 | archetype | passive | no plan |  |
| Cavalier Dedication | 2 | archetype | passive | no plan |  |
| Celebrity Dedication | 2 | archetype | passive | no plan |  |
| Champion Dedication | 2 | archetype | passive | no plan |  |
| Chelaxian Scion Dedication | 2 | archetype | passive | no plan |  |
| Chronoskimmer Dedication | 2 | archetype | passive | no plan |  |
| Clawdancer Dedication | 2 | archetype | passive | no plan |  |
| Clockwork Reanimator Dedication | 2 | archetype | passive | no plan |  |
| Commander Dedication | 2 | archetype | passive | no plan |  |
| Corpse Tender Dedication | 2 | archetype | passive | no plan |  |
| Crossbow Infiltrator Dedication | 2 | archetype | passive | no plan |  |
| Curse Maelstrom Dedication | 2 | archetype | passive | plan | its Effect has nothing a fight counts |
| Dandy Dedication | 2 | archetype | passive | no plan |  |
| Demolitionist Dedication | 2 | archetype | passive | no plan |  |
| Draconic Acolyte Dedication | 2 | archetype | passive | no plan |  |
| Drake Rider Dedication | 2 | archetype | passive | no plan |  |
| Duelist Dedication | 2 | archetype | passive | no plan |  |
| Eagle Knight Dedication | 2 | archetype | passive | no plan |  |
| Edgewatch Detective Dedication | 2 | archetype | passive | no plan |  |
| Exemplar Dedication | 2 | archetype | passive | no plan |  |
| Familiar Master Dedication | 2 | archetype | passive | no plan |  |
| Fan Dancer Dedication | 2 | archetype | passive | no plan |  |
| Field Propagandist Dedication | 2 | archetype | passive | no plan |  |
| Fighter Dedication | 2 | archetype | passive | no plan |  |
| Flexible Spellcaster Dedication | 2 | archetype | passive | no plan |  |
| Folklorist Dedication | 2 | archetype | passive | no plan |  |
| Game Hunter Dedication | 2 | archetype | passive | no plan |  |
| Geomancer Dedication | 2 | archetype | passive | no plan |  |
| Guardian Dedication | 2 | archetype | passive | no plan |  |
| Guerrilla Dedication | 2 | archetype | passive | no plan |  |
| Gunslinger Dedication | 2 | archetype | passive | no plan |  |
| Harrower Dedication | 2 | archetype | passive | no plan |  |
| Hedge Mage Dedication | 2 | archetype | passive | no plan |  |
| Hellbreaker Dedication | 2 | archetype | passive | no plan |  |
| Herbalist Dedication | 2 | archetype | passive | no plan |  |
| Horizon Walker Dedication | 2 | archetype | passive | no plan |  |
| Inventor Dedication | 2 | archetype | passive | no plan |  |
| Investigator Dedication | 2 | archetype | passive | no plan |  |
| Iridian Choirmaster Dedication | 2 | archetype | passive | no plan |  |
| Juggler Dedication | 2 | archetype | passive | no plan |  |
| Kineticist Dedication | 2 | archetype | passive | no plan |  |
| Kitharodian Actor Dedication | 2 | archetype | passive | no plan |  |
| Lastwall Sentry Dedication | 2 | archetype | passive | no plan |  |
| Lepidstadt Surgeon Dedication | 2 | archetype | passive | no plan |  |
| Linguist Dedication | 2 | archetype | passive | no plan |  |
| Lion Blade Dedication | 2 | archetype | passive | no plan |  |
| Living Monolith Dedication | 2 | archetype | passive | no plan |  |
| Living Vessel Dedication | 2 | archetype | passive | no plan |  |
| Loremaster Dedication | 2 | archetype | passive | no plan |  |
| Marine Marauder Dedication | 2 | archetype | passive | no plan |  |
| Mauler Dedication | 2 | archetype | passive | no plan |  |
| Medic Dedication | 2 | archetype | passive | no plan |  |
| Midnight Illusionist Dedication | 2 | archetype | passive | no plan |  |
| Mind Smith Dedication | 2 | archetype | passive | no plan |  |
| Monk Dedication | 2 | archetype | passive | no plan |  |
| Munitions Master Dedication | 2 | archetype | passive | no plan |  |
| Nidalese Horselord Dedication | 2 | archetype | passive | no plan |  |
| Oatia Skysage Dedication | 2 | archetype | passive | no plan |  |
| Ostilli Host Dedication | 2 | archetype | passive | no plan |  |
| Pactbinder Dedication | 2 | archetype | passive | no plan |  |
| Palatine Detective Dedication | 2 | archetype | passive | no plan |  |
| Pathfinder Agent Dedication | 2 | archetype | passive | no plan |  |
| Pirate Dedication | 2 | archetype | passive | no plan |  |
| Pistol Phenom Dedication | 2 | archetype | passive | no plan |  |
| Poisoner Dedication | 2 | archetype | passive | no plan |  |
| Psychic Dedication | 2 | archetype | passive | no plan |  |
| Ranger Dedication | 2 | archetype | passive | no plan |  |
| Razmiran Priest Dedication | 2 | archetype | passive | no plan |  |
| Reanimator Dedication | 2 | archetype | passive | no plan |  |
| Red Mantis Assassin Dedication | 2 | archetype | passive | no plan |  |
| Rivethun Emissary Dedication | 2 | archetype | passive | no plan |  |
| Rivethun Invoker Dedication | 2 | archetype | passive | no plan |  |
| Rogue Dedication | 2 | archetype | passive | no plan |  |
| Rose Warden Dedication | 2 | archetype | passive | no plan |  |
| Runelord Dedication | 2 | archetype | passive | no plan |  |
| Runesmith Dedication | 2 | archetype | passive | no plan |  |
| Scout Dedication | 2 | archetype | passive | no plan |  |
| Scroll Trickster Dedication | 2 | archetype | passive | no plan |  |
| Scrounger Dedication | 2 | archetype | passive | no plan |  |
| Seneschal Witch Dedication | 2 | archetype | passive | no plan |  |
| Sentinel Dedication | 2 | archetype | passive | no plan |  |
| Shadowcaster Dedication | 2 | archetype | passive | no plan |  |
| Shieldmarshal Dedication | 2 | archetype | passive | no plan |  |
| Sister of the Golden Erinys Dedication | 2 | archetype | passive | no plan |  |
| Snarecrafter Dedication | 2 | archetype | passive | no plan |  |
| Sniping Duo Dedication | 2 | archetype | passive | no plan |  |
| Soulforger Dedication | 2 | archetype | passive | plan | a passive's Strike |
| Spell Trickster Dedication | 2 | archetype | passive | no plan |  |
| Spellshifter Dedication | 2 | archetype | passive | no plan |  |
| Staff Acrobat Dedication | 2 | archetype | passive | no plan |  |
| Starlit Sentinel Dedication | 2 | archetype | passive | no plan |  |
| Starstone Aspirant Dedication | 2 | archetype | passive | plan | its Effect has nothing a fight counts |
| Student of Perfection Dedication | 2 | archetype | passive | no plan |  |
| Summoner Dedication | 2 | archetype | passive | no plan |  |
| Swarmkeeper Dedication | 2 | archetype | passive | no plan |  |
| Swashbuckler Dedication | 2 | archetype | passive | no plan |  |
| Talisman Dabbler Dedication | 2 | archetype | passive | no plan |  |
| Tattooed Historian Dedication | 2 | archetype | passive | no plan |  |
| Thaumaturge Dedication | 2 | archetype | passive | no plan |  |
| Trick Driver Dedication | 2 | archetype | passive | no plan |  |
| Turpin Rowe Lumberjack Dedication | 2 | archetype | passive | no plan |  |
| Twilight Speaker Dedication | 2 | archetype | passive | no plan |  |
| Ulfen Guard Dedication | 2 | archetype | passive | no plan |  |
| Undead Master Dedication | 2 | archetype | passive | no plan |  |
| Undead Slayer Dedication | 2 | archetype | passive | no plan |  |
| Undersea Privateer Dedication | 2 | archetype | passive | no plan |  |
| Unexpected Sharpshooter Dedication | 2 | archetype | passive | no plan |  |
| Vehicle Mechanic Dedication | 2 | archetype | passive | no plan |  |
| Verduran Shadow Dedication | 2 | archetype | passive | no plan |  |
| Vigilante Dedication | 2 | archetype | passive | no plan |  |
| Viking Dedication | 2 | archetype | passive | no plan |  |
| Vindicator Dedication | 2 | archetype | passive | no plan |  |
| Wandering Chef Dedication | 2 | archetype | passive | no plan |  |
| War Mage Dedication | 2 | archetype | passive | no plan |  |
| Warrior of Legend Dedication | 2 | archetype | passive | no plan |  |
| Weapon Improviser Dedication | 2 | archetype | passive | no plan |  |
| Wellspring Mage Dedication | 2 | archetype | passive | no plan |  |
| Wild Mimic Dedication | 2 | archetype | passive | no plan |  |
| Winged Warrior Dedication | 2 | archetype | passive | no plan |  |
| World Rouser Dedication | 2 | archetype | passive | no plan |  |
| Worm Caller Dedication | 2 | archetype | passive | no plan |  |
| Wrestler Dedication | 2 | archetype | passive | no plan |  |
| Wylderheart Dedication | 2 | archetype | passive | no plan |  |
| Zephyr Guard Dedication | 2 | archetype | passive | no plan |  |
| Butterfly Blade Dedication | 4 | archetype | passive | no plan |  |
| Exorcist Dedication | 4 | archetype | passive | no plan |  |
| Familiar Sage Dedication | 4 | archetype | passive | no plan |  |
| Firebrand Braggart Dedication | 4 | archetype | 1 action | no plan |  |
| Golden Legionnaire Dedication | 4 | archetype | passive | no plan |  |
| Jalmeri Heavenseeker Dedication | 4 | archetype | passive | no plan |  |
| Mammoth Lord Dedication | 4 | archetype | passive | no plan |  |
| Psychic Duelist Dedication | 4 | archetype | passive | no plan |  |
| Ritualist Dedication | 4 | archetype | passive | no plan |  |
| Scion of Domora Dedication | 4 | archetype | passive | no plan |  |
| Sleepwalker Dedication | 4 | archetype | passive | no plan |  |
| Steel Falcon Dedication | 4 | archetype | passive | no plan |  |
| Trapsmith Dedication | 4 | archetype | passive | no plan |  |
| Twilight Talon Dedication | 4 | archetype | passive | no plan |  |
| Venture-Gossip Dedication | 4 | archetype | passive | no plan |  |
| Five-Breath Vanguard Dedication | 6 | archetype | passive | no plan |  |
| Halcyon Speaker Dedication | 6 | archetype | passive | no plan |  |
| Knight Reclaimant Dedication | 6 | archetype | passive | no plan |  |
| Knight Vigilant Dedication | 6 | archetype | passive | no plan |  |
| Necrologist Dedication | 6 | archetype | passive | no plan |  |
| Pure Legion Enforcer Dedication | 6 | archetype | passive | no plan |  |
| Scrollmaster Dedication | 6 | archetype | passive | no plan |  |
| Spellmaster Dedication | 6 | archetype | passive | no plan |  |
| Swordmaster Dedication | 6 | archetype | passive | no plan |  |
| Golden League Xun Dedication | 8 | archetype | passive | no plan |  |
| Shadowdancer Dedication | 8 | archetype | passive | no plan |  |
| Provocator Dedication | 10 | archetype | passive | no plan |  |
| Sixth Pillar Dedication | 10 | archetype | passive | no plan |  |
| Lich Dedication | 12 | archetype | passive | no plan |  |
| Sanguimancer Dedication | 2 | other | passive | no plan |  |
| Apocalypse Rider Dedication | 12 | other | passive | no plan |  |
| Ascended Celestial Dedication | 12 | other | passive | no plan |  |
| Beast Lord Dedication | 12 | other | passive | no plan |  |
| Broken Chain Dedication | 12 | other | passive | no plan |  |
| Eternal Legend Dedication | 12 | other | passive | no plan |  |
| Godling Dedication | 12 | other | passive | no plan |  |
| Heroic Scion Dedication | 12 | other | passive | no plan |  |
| Prophesied Monarch Dedication | 12 | other | passive | no plan |  |
| Timewracked Dedication | 12 | other | passive | no plan |  |
| Warshard Warrior Dedication | 12 | other | passive | no plan |  |
| Wildspell Dedication | 12 | other | passive | plan | a spell the engine doesn't cast (Spellsurge) |

## Combat actions and reactions (709)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Quick Bomber | 1 | alchemist | 1 action | plan | a Strike with nothing more the simulator reads |
| Regurgitate Mutagen | 4 | alchemist | 1 action | no plan |  |
| Retaliatory Cleansing | 8 | alchemist | reaction | no plan |  |
| Astonishing Explosion | 20 | alchemist | free | plan | a timer with no rules a fight counts |
| Plum Deluge | 20 | alchemist | 3 actions | no plan |  |
| Relinquish Control | 1 | animist | free | no plan |  |
| Blazing Spirit | 6 | animist | reaction | no plan |  |
| Grudge Strike | 6 | animist | 2 actions | plan | its requirement (Your attuned apparition grants Heraldry Lore or Underworld Lore as an apparition skill.) |
| Shadows Within Shadows | 12 | animist | reaction | no plan |  |
| Banish Falsehoods of Flesh | 14 | animist | 1 action | no plan |  |
| Cycle of Souls | 18 | animist | free | plan | a teleport |
| Powder Punch Stance | 2 | archetype | 1 action | plan | its text has no Strike of its user's |
| Spectral Dagger | 2 | archetype | 1 action | no plan |  |
| Aether Blast | 4 | archetype | 1 action | plan | its requirement (You are overflowing) |
| Anchor Stance | 4 | archetype | 1 action | no plan |  |
| Aphet Flash | 4 | archetype | 1 action | plan | its requirement (Your swarm is outside your body) |
| Aquatic Pirouette | 4 | archetype | reaction | no plan |  |
| Belay That! | 4 | archetype | reaction | no plan |  |
| Bless Shield | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Blessed Thorn Strike | 4 | archetype | 1 action | plan | its requirement (You witnessed an enemy harm an ally with a Strike or spell last round.) |
| Claw Snag | 4 | archetype | reaction | plan | a reaction's Strike |
| Contingency Leap | 4 | archetype | reaction | no plan |  |
| Crop Protection | 4 | archetype | reaction | plan | a reaction's Strike |
| Disarming Block | 4 | archetype | free | no plan |  |
| Doctor's Visitation | 4 | archetype | 1 action | plan | a teleport |
| Elbow Breaker | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Feast | 4 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Focused Fire | 4 | archetype | 1 action | no plan |  |
| For the Fallen! | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Ghost Blade | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Heaven's Step Offense | 4 | archetype | reaction | no plan |  |
| Hurling Charge | 4 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| In Lightning, Life | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Invoke Offense | 4 | archetype | 1 action | plan | its requirement (You're under the effects of @UUID[Compendium.pf2e.actionspf2e.Item.Enter Spirit Trance]. You manifest a |
| Lassoing Lash | 4 | archetype | 1 action | plan | its requirement (The target can't be more than one size larger than you) |
| Lesson of the Broken Wing | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Lesson of the Circling Gale | 4 | archetype | 1 action | plan | a teleport |
| Log Roll | 4 | archetype | 1 action | plan | its requirement (You and an adjacent creature are both on a narrow surface or uneven ground and the other creature is of |
| Lucky Escape | 4 | archetype | reaction | no plan |  |
| Nature's Embrace | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Never Tire | 4 | archetype | reaction | plan | a timer with no rules a fight counts |
| Patronize the Arts | 4 | archetype | reaction | plan | a timer with no rules a fight counts |
| Play to the Crowd | 4 | archetype | reaction | no plan |  |
| Pyre Ant Sting | 4 | archetype | 1 action | plan | its requirement (Your swarm is outside your body) |
| Quick Shot | 4 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Reach Beyond | 4 | archetype | 1 action | no plan |  |
| Reflexive Catch | 4 | archetype | reaction | no plan |  |
| Semblance of Life | 4 | archetype | free | plan | a spell the feat casts |
| Soul Flare | 4 | archetype | reaction | no plan |  |
| Spot Translate | 4 | archetype | reaction | no plan |  |
| Swift Leap | 4 | archetype | 1 action | plan | a teleport |
| Talon Sweep | 4 | archetype | reaction | plan | a reaction's Strike |
| Tut-Tut | 4 | archetype | free | no plan |  |
| Weaver's Web | 4 | archetype | 1 action | plan | its requirement (Your swarm is outside your body) |
| Aldori Riposte | 6 | archetype | reaction | plan | a reaction's Strike |
| All Returns To Slumber | 6 | archetype | 1 action | plan | its requirement (Your waking world is active) |
| Antler Rush | 6 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Battlefield Agility | 6 | archetype | 1 action | plan | its requirement (You're flanked by at least two enemies.) |
| Bear Hug (Werecreature) | 6 | archetype | 2 actions | plan | its requirement (You're in bear or hybrid shape, and your last action was a successful claw Strike.) |
| Betraying Shank | 6 | archetype | 1 action | plan | its requirement (You are within melee reach of a target, but it is not in combat with you.) |
| Boaster's Challenge | 6 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Commitment to Justice | 6 | archetype | 1 action | plan | its requirement (You witnessed a creature kill or reduce an ally to 0 Hit Points since your last turn.) |
| Commitment to Liberty | 6 | archetype | 2 actions | plan | its requirement (A creature has an ally Grabbed or Restrained.) |
| Death Roll | 6 | archetype | 1 action | plan | its text has no Strike of its user's |
| Disarming Smile | 6 | archetype | reaction | plan | its requirement (You are aware of the attacker, the attacker is an intelligent humanoid creature, and you have not attem |
| Discerning Strike | 6 | archetype | 1 action | plan | its requirement (You have successfully identified the target with @UUID[Compendium.pf2e.actionspf2e.Item.Recall Knowledg |
| Ensnaring Disarm | 6 | archetype | free | no plan |  |
| Essence Overflow | 6 | archetype | 2 actions | plan | its requirement (You are Channeling Draconic Essence) |
| Exploit Opening | 6 | archetype | reaction | plan | a reaction's Strike |
| Exsanguinate | 6 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Feeling Your Oats | 6 | archetype | 1 action | no plan |  |
| Feverish Enzymes | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Follow-Up Strike | 6 | archetype | 1 action | plan | its requirement (Your last action was a missed Strike with a melee unarmed attack.) |
| Fortune's Favor | 6 | archetype | free | no plan |  |
| Frightful Condemnation | 6 | archetype | free | no plan |  |
| Ghost Strike | 6 | archetype | 2 actions | no plan |  |
| Hey! Over Here! | 6 | archetype | reaction | no plan |  |
| Hindquarter Kick | 6 | archetype | 1 action | plan | its requirement (You are in claw stance and have Grabbed a creature.) |
| Hit and Run | 6 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Infiltrator's Reload | 6 | archetype | 1 action | no plan |  |
| Infused with Belkzen's Might | 6 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Invented Vulnerability | 6 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Keep Pace | 6 | archetype | reaction | plan | a teleport |
| Leverage Anguish | 6 | archetype | reaction | no plan |  |
| Mammoth Charge | 6 | archetype | 2 actions | plan | its requirement (You are riding your megafauna companion.) |
| Opportune Trickster | 6 | archetype | reaction | plan | its requirement (You're adjacent to both your ally and the creature) |
| Poison Coat | 6 | archetype | reaction | no plan |  |
| Practiced Opposition | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Reloading Trick | 6 | archetype | 1 action | plan | its text has no Strike of its user's |
| Rushing Boar | 6 | archetype | reaction | no plan |  |
| Shark Attack | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Sheltering Hand | 6 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Spiral Sworn | 6 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Staggering Fire | 6 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Startling Appearance (Vigilante) | 6 | archetype | 1 action | plan | its requirement (You are completely unnoticed by the target creature.) |
| Sundown Street Posturing | 6 | archetype | 1 action | no plan |  |
| Surging Smash | 6 | archetype | 2 actions | plan | its requirement (You are overflowing) |
| Sweeping Fan Block | 6 | archetype | reaction | no plan |  |
| Swift Intervention | 6 | archetype | reaction | no plan |  |
| Sword-Light Wave | 6 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Targeted Redirection | 6 | archetype | 1 action | plan | its text has no Strike of its user's |
| Unbalancing Appearance | 6 | archetype | 1 action | plan | its requirement (A creature within your reach is Off-Guard to you, and you are Unnoticed by that creature.) |
| Unfettering Strike | 6 | archetype | 1 action | plan | its requirement (A creature within your reach has an ally Grabbed or Restrained.) |
| Unnerving Prowess | 6 | archetype | free | no plan |  |
| Vacate Vision | 6 | archetype | reaction | no plan |  |
| Verduran Ambush | 6 | archetype | 3 actions | plan | a timer with no rules a fight counts |
| Vision of Foresight | 6 | archetype | 1 action | no plan |  |
| Warp Path | 6 | archetype | 1 action | plan | its requirement (You are veiled.) |
| Watch This! | 6 | archetype | reaction | no plan |  |
| Wounded Party | 6 | archetype | reaction | no plan |  |
| A Little Bird Told Me... | 8 | archetype | 2 actions | no plan |  |
| Aether Beam | 8 | archetype | 2 actions | plan | its requirement (You are overflowing) |
| Archaeologist's Luck | 8 | archetype | free | plan | a reroll |
| Bolster Ally | 8 | archetype | reaction | no plan |  |
| Commitment to Valor | 8 | archetype | reaction | no plan |  |
| Cornered Animal | 8 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Counter Curse | 8 | archetype | reaction | no plan |  |
| Death from Above | 8 | archetype | 2 actions | plan | its requirement (You are standing, climbing, or balancing on a surface at least 10 feet above your target) |
| Dust Cloud | 8 | archetype | 1 action | plan | its requirement (Your waking world is active) |
| Feline Dance | 8 | archetype | reaction | plan | a roll twice |
| Fine Print | 8 | archetype | free | plan | an Effect with nothing a fight counts |
| Flashing Shield | 8 | archetype | free | plan | a timer with no rules a fight counts |
| Gardener's Resolve | 8 | archetype | reaction | no plan |  |
| Ghost Flight | 8 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Gods' Palm | 8 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Guardian's Embrace | 8 | archetype | 1 action | plan | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Hot Foot | 8 | archetype | 1 action | no plan |  |
| Interrupt Charge | 8 | archetype | reaction | plan | a roll whose results the simulator doesn't read |
| Invoke Defense | 8 | archetype | 1 action | no plan |  |
| Lesson of Sympathetic Vulnerability | 8 | archetype | 1 action | no plan |  |
| Lobbed Attack | 8 | archetype | 1 action | plan | its requirement, which the PC doesn't meet (You are Juggling a thrown weapon.) |
| Makeshift Strike | 8 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Metabolize Element | 8 | archetype | reaction | plan | a timer with no rules a fight counts |
| Minor Omen | 8 | archetype | reaction | plan | a reroll |
| Nothing Personal | 8 | archetype | 1 action | plan | its requirement (You have an active course of action planned) |
| Piercing Doom | 8 | archetype | 2 actions | plan | its requirement (You are Doomed 2 or greater.) |
| Pluck from the Sky | 8 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Pressure Change | 8 | archetype | 1 action | plan | its requirement (You have a swim Speed, are underwater, and have a creature Grabbed or Restrained) |
| Quick Positioning | 8 | archetype | free | plan | a teleport |
| Reactive Resilience | 8 | archetype | reaction | no plan |  |
| Reminder of the Greater Fear | 8 | archetype | reaction | no plan |  |
| Riptide (Undersea Privateer) | 8 | archetype | 1 action | plan | its requirement (You're in Anchor Stance, and your target is within 5 feet of the edge of a water vehicle or already in  |
| Rule of Three | 8 | archetype | reaction | no plan |  |
| Shamble | 8 | archetype | 2 actions | plan | a teleport |
| Shoving Sweep | 8 | archetype | reaction | no plan |  |
| Show-Off | 8 | archetype | free | no plan |  |
| Skyseeker | 8 | archetype | 2 actions | plan | its requirement (You're in Sky and Heaven Stance.) |
| Slurp Up | 8 | archetype | 1 action | no plan |  |
| Soul Well | 8 | archetype | 2 actions | no plan |  |
| Sportlebore Choke | 8 | archetype | 1 action | plan | its requirement (Your swarm is outside your body) |
| Statement Strut | 8 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Stay Here! | 8 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Superimpose Time Duplicates | 8 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Swap Reflections | 8 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Tail Guard | 8 | archetype | reaction | plan | a reaction's Strike |
| Tear Tendons | 8 | archetype | 2 actions | plan | its requirement (You are in claw stance and have two open hands) |
| Tight Follower | 8 | archetype | reaction | plan | a teleport |
| To Battle! | 8 | archetype | 2 actions | no plan |  |
| Transfusion | 8 | archetype | 2 actions | plan | an Effect on another creature |
| Tumbling Strike | 8 | archetype | 1 action | plan | its requirement (You are adjacent to an enemy.) |
| Twirling Strike | 8 | archetype | 2 actions | plan | its requirement (You're wielding a fan.) |
| Uncanny Prediction | 8 | archetype | 2 actions | plan | its requirement (You're benefiting from the bonuses of @UUID[Compendium.pf2e.actionspf2e.Item.Size Up]. You have an eeri |
| Work Yourself Up | 8 | archetype | 2 actions | no plan |  |
| A Hush Falls Over the World | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Aerial Piledriver | 10 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Battlefront Sabotage | 10 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Big Debut | 10 | archetype | free | no plan |  |
| Black Powder Flash | 10 | archetype | 2 actions | plan | its requirement (You're in Powder Punch Stance) |
| Bloom Cabaret Entrance | 10 | archetype | free | no plan |  |
| Bullet Dancer Reload | 10 | archetype | 1 action | plan | its requirement (You're in Bullet Dancer Stance.) |
| Burrowing Shot | 10 | archetype | 1 action | no plan |  |
| Clarify Hellfire | 10 | archetype | 1 action | no plan |  |
| Close Contract | 10 | archetype | 1 action | plan | its requirement (You have completed your active course of action but haven't Dismissed it or chosen a new one) |
| Command Attention | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Defy Sorrow | 10 | archetype | reaction | plan | a timer with no rules a fight counts |
| Dispute Terms | 10 | archetype | free | no plan |  |
| Dizzying Spin Dance | 10 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Everyone Duck! | 10 | archetype | reaction | no plan |  |
| Fading | 10 | archetype | reaction | no plan |  |
| Falcon Swoop | 10 | archetype | 2 actions | plan | its requirement (You currently have a fly Speed.) |
| Feral Lunge | 10 | archetype | 1 action | plan | its requirement (You're in hybrid or animal shape.) |
| Feral Scramble | 10 | archetype | 2 actions | plan | its requirement (You're in hybrid or animal shape.) |
| Feral Toss | 10 | archetype | 2 actions | plan | its requirement (You're in hybrid or animal shape.) |
| Form Up! | 10 | archetype | 2 actions | no plan |  |
| Harrying Strike | 10 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Hematocritical | 10 | archetype | free | plan | a roll twice |
| I Meant to do That | 10 | archetype | 1 action | no plan |  |
| Infiltration Assassination | 10 | archetype | 2 actions | plan | its requirement (You're wearing a loaded gauntlet bow.) |
| Interstitial Escape | 10 | archetype | reaction | no plan |  |
| Invigorating Breath | 10 | archetype | 1 action | plan | its requirement (You are adjacent to your spirit guide or it is sharing your space) |
| Klingegeist | 10 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Lead the Way | 10 | archetype | 2 actions | plan | a teleport |
| Lethal Edge | 10 | archetype | free | plan | a timer with no rules a fight counts |
| Null Field | 10 | archetype | 1 action | no plan |  |
| Open the Blazing Eye | 10 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Pass Through | 10 | archetype | 3 actions | plan | a teleport |
| Protective Strike | 10 | archetype | reaction | plan | a reaction's Strike |
| Rain-Scribe Mobility | 10 | archetype | 2 actions | no plan |  |
| Reactive Charm | 10 | archetype | reaction | no plan |  |
| Reel 'Em In | 10 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Scout's Pounce | 10 | archetype | 2 actions | plan | its requirement (You are Hidden from or Undetected by all of your opponents, and you aren't within 10 feet of any enemy. |
| Seize Advantage | 10 | archetype | reaction | plan | a teleport |
| Sense the Strike | 10 | archetype | reaction | no plan |  |
| Silent Sting | 10 | archetype | reaction | no plan |  |
| Spear of Doom | 10 | archetype | 1 action | no plan |  |
| Springboard | 10 | archetype | 1 action | plan | its text has no Strike of its user's |
| Staggering Blow | 10 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Stir Allies | 10 | archetype | 2 actions | no plan |  |
| Tag Team | 10 | archetype | reaction | plan | a reaction's Strike |
| Torrential Backlash | 10 | archetype | 2 actions | plan | its requirement (You are in a curse maelstrom state) |
| Venipuncture | 10 | archetype | 2 actions | no plan |  |
| Aegis of Arnisant | 12 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Aerial Flash | 12 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Assassinate | 12 | archetype | 2 actions | plan | its requirement (You have designated a mark using Mark for Death and are completely unnoticed by your mark.) |
| Beastmaster's Call | 12 | archetype | 1 action | no plan |  |
| Beguiling Aura | 12 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Blade of Law | 12 | archetype | 2 actions | plan | its requirement (The target has attempted a hostile action against you since your previous turn.) |
| Blessed Denial | 12 | archetype | reaction | no plan |  |
| Call the Hunt | 12 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Cartwheel Dodge | 12 | archetype | reaction | plan | a teleport |
| Cautious Word | 12 | archetype | free | plan | a timer with no rules a fight counts |
| Chain Reaction | 12 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Claw and Talon Flow | 12 | archetype | 1 action | plan | its requirement (You're in either claw stance or talon stance.) |
| Collapse Wall | 12 | archetype | reaction | no plan |  |
| Cut the Bonds | 12 | archetype | 1 action | no plan |  |
| Danse Macabre | 12 | archetype | 2 actions | no plan |  |
| Drive-By Attack | 12 | archetype | 1 action | plan | its requirement (You are piloting a vehicle.) |
| Escape Timeline | 12 | archetype | free | plan | a timer with no rules a fight counts |
| Forewarn | 12 | archetype | reaction | no plan |  |
| General's Gambit | 12 | archetype | 3 actions | no plan |  |
| Guarded Advance (Knight Vigilant) | 12 | archetype | 1 action | plan | a teleport |
| Hungry Blade | 12 | archetype | 1 action | no plan |  |
| One-On-One | 12 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Reach for the Sky | 12 | archetype | 2 actions | plan | its requirement, which the PC doesn't meet (You're wielding a loaded firearm.) |
| Redirect Elements | 12 | archetype | reaction | no plan |  |
| Shake Off the Gods | 12 | archetype | 1 action | no plan |  |
| Shoulder Catastrophe | 12 | archetype | reaction | no plan |  |
| Sing to the Steel | 12 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Slay | 12 | archetype | 2 actions | plan | its requirement (Your target is Doomed 2 or greater.) |
| Slowing Strike | 12 | archetype | free | plan | a roll whose results the simulator doesn't read |
| Space-Time Shift | 12 | archetype | free | no plan |  |
| Steal Magic's Breath | 12 | archetype | reaction | no plan |  |
| Take in the Catch | 12 | archetype | 2 actions | plan | its requirement (You're holding a net.) |
| The World Devours | 12 | archetype | 2 actions | plan | its requirement (Your waking world is active) |
| Thunderous Landing | 12 | archetype | 1 action | plan | its requirement (You currently have a fly Speed and are airborne) |
| Wailing Dead | 12 | archetype | 2 actions | no plan |  |
| Bombing Run | 14 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Commitment to Vigilance | 14 | archetype | 1 action | no plan |  |
| Cratering Drop | 14 | archetype | 1 action | no plan |  |
| Curse of the Saumen Kar | 14 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Death Rattle | 14 | archetype | 1 action | no plan |  |
| Devastating Manifestation | 14 | archetype | 2 actions | plan | its requirement (At least one of your soulforged armaments is not manifested.) |
| Dragon's Journey | 14 | archetype | 1 action | plan | a teleport |
| Execution | 14 | archetype | 2 actions | plan | its requirement (You have condemned a foe with Harsh Judgment.) |
| Homing Shot | 14 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Hush | 14 | archetype | 2 actions | plan | its requirement (You are veiled) |
| In the Horde's Grip | 14 | archetype | 1 action | no plan |  |
| Induce Imbalance | 14 | archetype | 2 actions | plan | its requirement (You're in an elemental stance.) |
| Lonely Army | 14 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| March of Law | 14 | archetype | 1 action | no plan |  |
| Mist Escape | 14 | archetype | free | no plan |  |
| Murderer's Circle | 14 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Night's Warning | 14 | archetype | reaction | no plan |  |
| Path of Iron | 14 | archetype | 3 actions | plan | its text has no Strike of its user's |
| Phase Bullet | 14 | archetype | 1 action | plan | its text has no Strike of its user's |
| Pivot Strike | 14 | archetype | 2 actions | plan | its requirement (You are wielding your staff.) |
| Sailfish Strike | 14 | archetype | reaction | plan | a reaction's Strike |
| Shifting Terrain | 14 | archetype | 1 action | no plan |  |
| Simultaneous Strike | 14 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Spellmaster's Tenacity | 14 | archetype | reaction | plan | a timer with no rules a fight counts |
| Spinning Release | 14 | archetype | 3 actions | plan | its requirement (You have a creature Grabbed or Restrained with your lash) |
| Stunning Surprise | 14 | archetype | 2 actions | plan | its requirement (You must be undetected by the target creature) |
| Submit to Shadow | 14 | archetype | free | no plan |  |
| Target of Opportunity | 14 | archetype | reaction | plan | a reaction's Strike |
| Watch Your Back (Golden Legionnaire) | 14 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Worm Form | 14 | archetype | 2 actions | no plan |  |
| Controlled Bullet | 16 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Converge | 16 | archetype | reaction | no plan |  |
| Deathblow | 16 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Declare Anathema | 16 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Deflecting Cloud | 16 | archetype | reaction | no plan |  |
| Dive of the Divine | 16 | archetype | 2 actions | plan | its requirement (You are at least 20 feet above the ground) |
| Duelist's Form | 16 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Emergency Regeneration | 16 | archetype | reaction | plan | a spell the feat casts |
| Focus Ally | 16 | archetype | reaction | no plan |  |
| Following Smite | 16 | archetype | 1 action | plan | its requirement (Your last action was a Strike made with a weapon or unarmed attack empowered by @UUID[Compendium.pf2e.f |
| Grave Threat | 16 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Incorporeal Shot | 16 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Infiltrator's Blitz | 16 | archetype | 3 actions | plan | a timer with no rules a fight counts |
| Mobile Magical Combat | 16 | archetype | 1 action | plan | its requirement (You're wielding a melee weapon and have Cast a Spell requiring at least 1 action this turn.) |
| One with the Spirits | 16 | archetype | 1 action | no plan |  |
| Opportune Throw | 16 | archetype | reaction | plan | a reaction's Strike |
| Purge of Moments | 16 | archetype | 3 actions | no plan |  |
| Ruthless Orator | 16 | archetype | 2 actions | no plan |  |
| Sonic Strafe | 16 | archetype | 2 actions | plan | its requirement (You currently have a fly Speed) |
| Ward Mind | 16 | archetype | reaction | plan | a timer with no rules a fight counts |
| Whirling Clobber | 16 | archetype | 3 actions | plan | a Strike with nothing more the simulator reads |
| Wrath Against the Divine | 16 | archetype | 2 actions | plan | a target the simulator can't tell (Strike a foe that can cast divine spells) |
| Black Powder Embodiment | 18 | archetype | 2 actions | plan | its requirement (You're wielding a loaded magical firearm or crossbow.) |
| Cut them Down, Burn them Out | 18 | archetype | 1 action | plan | a Strike with nothing more the simulator reads |
| Divine Presence | 18 | archetype | 1 action | no plan |  |
| Five Breaths, One Death | 18 | archetype | 3 actions | plan | its requirement (You're in an elemental stance, and the target is under the effects of Induce Imbalance.) |
| Guillotine Blade | 18 | archetype | 1 action | no plan |  |
| No Need to Fear | 18 | archetype | reaction | no plan |  |
| Stand for the Fallen | 18 | archetype | reaction | no plan |  |
| Timeline-Splitting Spell | 18 | archetype | 3 actions | no plan |  |
| Tragic Lament | 18 | archetype | reaction | plan | a timer with no rules a fight counts |
| Flash of Omnipotence | 20 | archetype | free | no plan |  |
| The Tyrant Falls! | 20 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Wrath of the First Ghoul | 20 | archetype | 2 actions | plan | a Strike with nothing more the simulator reads |
| Bashing Charge | 2 | barbarian | 2 actions | plan | a teleport |
| Furious Finish | 2 | barbarian | 1 action | plan | a Strike with nothing more the simulator reads |
| No Escape | 2 | barbarian | reaction | plan | a teleport |
| Shake it Off | 2 | barbarian | 1 action | no plan |  |
| Barreling Charge | 4 | barbarian | 2 actions | plan | a roll whose results the simulator doesn't read |
| Brutal Crush | 4 | barbarian | 1 action | plan | its requirement (Your last action dealt bludgeoning damage using an unarmed Strike granted by a morph or polymorph effec |
| Creature Comforts | 4 | barbarian | reaction | no plan |  |
| Rip and Tear | 4 | barbarian | 1 action | plan | its requirement (Your last action dealt piercing or slashing damage using an unarmed Strike granted by a morph or polymo |
| Mage Hunter | 6 | barbarian | 2 actions | plan | its requirement (You've seen the target Cast a Spell) |
| Animal Rage | 8 | barbarian | 1 action | plan | a spell the feat casts |
| Follow-Up Assault | 8 | barbarian | 1 action | plan | a Strike with nothing more the simulator reads |
| Friendly Toss | 8 | barbarian | 2 actions | no plan |  |
| Sudden Leap | 8 | barbarian | 2 actions | plan | its text has no Strike of its user's |
| Corpse-Killer's Defiance | 10 | barbarian | reaction | plan | an Effect with nothing a fight counts |
| Determined Dash | 10 | barbarian | 2 actions | plan | a teleport |
| Furious Sprint | 10 | barbarian | 2 actions | no plan |  |
| Impressive Landing | 10 | barbarian | reaction | plan | a lasting area |
| Knockback | 10 | barbarian | 1 action | plan | its requirement (Your last action was a successful Strike The weight of your swing drives your enemy back) |
| Tangle of Battle | 10 | barbarian | reaction | no plan |  |
| Dragon's Rage Wings | 12 | barbarian | 1 action | plan | an Effect with nothing a fight counts |
| Predator's Pounce | 12 | barbarian | 1 action | plan | its requirement, which the PC doesn't meet (You are unarmored or wearing light armor) |
| Sunder Spell | 12 | barbarian | 2 actions | plan | a Strike with nothing more the simulator reads |
| Meditate on This! | 14 | barbarian | 1 action | plan | a timer with no rules a fight counts |
| Dragon Transformation | 16 | barbarian | 1 action | no plan |  |
| Penetrating Projectile | 16 | barbarian | 2 actions | plan | its requirement, which the PC doesn't meet (You are wielding a ranged or thrown weapon that deals piercing damage.) |
| Whirlwind Toss | 18 | barbarian | 1 action | no plan |  |
| Combat Reading | 4 | bard | 1 action | no plan |  |
| Grand Dance | 8 | bard | 2 actions | no plan |  |
| Reverberate | 12 | bard | reaction | plan | a roll whose results the simulator doesn't read |
| Triumphant Inspiration | 14 | bard | free | no plan |  |
| Resounding Finale | 16 | bard | reaction | plan | an Effect with nothing a fight counts |
| All in My Head | 18 | bard | reaction | no plan |  |
| Pack Performance | 18 | bard | reaction | plan | a reaction's Strike |
| Agile Shield Grip | 1 | champion | 1 action | no plan |  |
| Everstand Stance | 1 | champion | 1 action | no plan |  |
| Devoted Guardian | 2 | champion | 1 action | plan | an Effect on another creature |
| Everstand Strike | 4 | champion | 1 action | plan | a Strike with nothing more the simulator reads |
| Knock Sense | 4 | champion | 1 action | plan | a Strike with nothing more the simulator reads |
| Impassable Wall Stance | 8 | champion | 1 action | no plan |  |
| Sacrifice Armor | 8 | champion | reaction | no plan |  |
| Shield of Reckoning | 10 | champion | reaction | no plan |  |
| Gruesome Strike | 12 | champion | 1 action | plan | its requirement (Your Strikes currently deal extra damage from your champion's reaction.) |
| Miraculous Intervention | 12 | champion | reaction | plan | a roll whose results the simulator doesn't read |
| Everdistant Defense | 20 | champion | reaction | no plan |  |
| Premonition of Avoidance | 1 | cleric | reaction | no plan |  |
| Rapid Response | 2 | cleric | reaction | no plan |  |
| Channel Smite | 4 | cleric | 2 actions | plan | a Strike with nothing more the simulator reads |
| Restorative Strike | 4 | cleric | 2 actions | plan | its requirement (You have a Harm or Heal spell you can cast.) |
| Divine Rebuttal | 6 | cleric | reaction | plan | a reaction's Strike |
| Zealous Rush | 8 | cleric | reaction | plan | a teleport |
| Rebounding Smite | 16 | cleric | reaction | no plan |  |
| Avatar's Protection | 20 | cleric | reaction | no plan |  |
| Denier of Destruction | 20 | cleric | reaction | no plan |  |
| Combat Assessment | 1 | commander | 1 action | plan | a Strike with nothing more the simulator reads |
| Defensive Swap | 2 | commander | reaction | no plan |  |
| Guiding Shot | 2 | commander | 1 action | plan | its text has no Strike of its user's |
| Set-Up Strike | 2 | commander | 1 action | no plan |  |
| Banner's Inspiration | 4 | commander | 1 action | no plan |  |
| Unsteadying Strike | 4 | commander | 1 action | plan | a Strike with nothing more the simulator reads |
| Rallying Banner | 8 | commander | 1 action | no plan |  |
| Standard-Bearer's Sacrifice | 10 | commander | reaction | no plan |  |
| Reactive Interference | 12 | commander | reaction | plan | a roll whose results the simulator doesn't read |
| Demand Surrender | 18 | commander | 2 actions | no plan |  |
| Mercenary Reversal | 18 | commander | 2 actions | no plan |  |
| Eerie Proclamation | 10 | druid | 2 actions | plan | a timer with no rules a fight counts |
| Defensive Dismissal | 12 | druid | reaction | no plan |  |
| Pesh Skin | 12 | druid | 1 action | no plan |  |
| Reactive Transformation | 14 | druid | reaction | plan | a spell the feat casts |
| Verdant Presence | 20 | druid | reaction | no plan |  |
| Vow of Mortal Defiance | 1 | exemplar | 1 action | no plan |  |
| Topple The Titans | 4 | exemplar | 1 action | no plan |  |
| Flow of War | 6 | exemplar | free | no plan |  |
| As a Thousand Soldiers | 8 | exemplar | 2 actions | no plan |  |
| Raise Island | 8 | exemplar | 3 actions | plan | a timer with no rules a fight counts |
| Exult in Violence | 10 | exemplar | 1 action | no plan |  |
| Aggressive Block | 2 | fighter | free | plan | a timer with no rules a fight counts |
| Assisting Shot | 2 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Combat Grab | 2 | fighter | 1 action | plan | its requirement, which the PC doesn't meet (You have one hand free, and your target is within reach of that hand.) |
| Lunge | 2 | fighter | 1 action | plan | its requirement (You are wielding a melee weapon.) |
| Rebounding Toss | 2 | fighter | 2 actions | plan | its requirement, which the PC doesn't meet (You are wielding a thrown weapon.) |
| Sleek Reposition | 2 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| United Assault | 2 | fighter | 1 action | plan | a choice of ways the simulator doesn't play |
| Dual-Handed Assault | 4 | fighter | 1 action | plan | its requirement, which the PC doesn't meet (You are wielding a one-handed melee weapon and have a free hand.) |
| Advantageous Assault | 6 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Disarming Stance | 6 | fighter | 1 action | plan | its requirement, which the PC doesn't meet (You are wielding a single one-handed melee weapon and hold nothing else in y |
| Revealing Stab | 6 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Ricochet Stance (Fighter) | 6 | fighter | 1 action | plan | an Effect with nothing a fight counts |
| Spear Dancer | 6 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Felling Strike | 8 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Knight's Retaliation | 8 | fighter | reaction | no plan |  |
| Mobile Shot Stance | 8 | fighter | 1 action | no plan |  |
| Positioning Assault | 8 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Disruptive Stance | 10 | fighter | 1 action | no plan |  |
| Haft Beatdown | 10 | fighter | 3 actions | plan | its requirement (You are in Haft Striker Stance.) |
| Halyard Strike | 10 | fighter | 2 actions | plan | its requirement (A rope is within your reach, or you have a rope or grappling weapon in your hand.) |
| Mirror Shield | 10 | fighter | reaction | no plan |  |
| Incredible Ricochet | 12 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Lunging Stance | 12 | fighter | 1 action | no plan |  |
| Determination | 14 | fighter | 1 action | no plan |  |
| Guiding Finish | 14 | fighter | 1 action | plan | a Strike with nothing more the simulator reads |
| Graceful Poise | 16 | fighter | 1 action | no plan |  |
| Reflecting Riposte | 20 | fighter | reaction | no plan |  |
| Sever Space | 20 | fighter | 2 actions | plan | a Strike with nothing more the simulator reads |
| Covering Stance | 2 | guardian | 1 action | plan | a timer with no rules a fight counts |
| Hampering Stance | 2 | guardian | 1 action | plan | a lasting area |
| Taunting Strike | 2 | guardian | 1 action | plan | a Strike with nothing more the simulator reads |
| Not So Fast! | 4 | guardian | reaction | plan | a reaction's Strike |
| Proud Nail | 4 | guardian | 1 action | plan | its requirement (Your taunted enemy is Off-Guard because it didn't target you or include you in an area effect.) |
| Shielded Attrition | 4 | guardian | 1 action | plan | a timer with no rules a fight counts |
| Guarded Advance | 6 | guardian | 1 action | plan | a teleport |
| Lock Down | 6 | guardian | 1 action | plan | its stance (Hampering Stance): a lasting area |
| Retaliating Rescue | 6 | guardian | 2 actions | plan | its text has no Strike of its user's |
| Repositioning Block | 8 | guardian | free | no plan |  |
| Shield from Arrows | 8 | guardian | reaction | plan | an Effect with nothing a fight counts |
| Shield Wallop | 8 | guardian | 1 action | plan | its text has no Strike of its user's |
| Momentum Strike | 10 | guardian | 2 actions | plan | a Strike with nothing more the simulator reads |
| Armor Break | 12 | guardian | 2 actions | no plan |  |
| Armored Counterattack | 12 | guardian | free | no plan |  |
| Blanket Defense | 14 | guardian | 3 actions | plan | an Effect with nothing a fight counts |
| Blast Lock | 1 | gunslinger | 1 action | no plan |  |
| Fake Out | 2 | gunslinger | reaction | no plan |  |
| Quick Draw | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Risky Reload | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Alchemical Shot | 4 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Paired Shots | 4 | gunslinger | 2 actions | plan | its requirement (You're wielding two weapons, each of which can be either a loaded one-handed firearm or loaded one-hand |
| Running Reload | 4 | gunslinger | 1 action | plan | a teleport |
| Cauterize | 6 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Fight or Flight | 6 | gunslinger | reaction | plan | a reaction's Strike |
| Nightwave Springing Reload | 6 | gunslinger | 1 action | plan | a teleport |
| Scatter Blast | 6 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Seize an Advantage | 6 | gunslinger | 1 action | plan | its requirement (Your last action this turn was to attempt a Dirty Trick against a foe.) |
| Triggerbrand Salvo | 6 | gunslinger | 1 action | plan | its requirement (You're wielding a combination weapon.) |
| Smoke Curtain | 8 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Deflecting Shot | 10 | gunslinger | reaction | no plan |  |
| Rebounding Assault | 10 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Trick Shot | 10 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Twin Shot Knockdown | 10 | gunslinger | 2 actions | plan | its requirement (You're wielding a loaded crossbow or loaded firearm in each hand.) |
| Blood in the Air | 12 | gunslinger | 1 action | plan | its requirement (An enemy you've damaged with a ranged weapon during the last minute is Concealed or Hidden from you.) |
| Flesh Wound | 12 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| Ricochet Shot | 12 | gunslinger | 1 action | plan | its text has no Strike of its user's |
| Shattering Shot | 12 | gunslinger | 1 action | no plan |  |
| Blast Tackle | 14 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Headshot | 14 | gunslinger | 2 actions | plan | a Strike with nothing more the simulator reads |
| Triggerbrand Blitz | 14 | gunslinger | 3 actions | plan | its text has no Strike of its user's |
| Instant Return | 16 | gunslinger | reaction | plan | a reaction's Strike |
| Final Shot | 18 | gunslinger | 3 actions | plan | its requirement (You're wielding an unloaded firearm.) |
| Oil Fire | 2 | inventor | 1 action | no plan |  |
| Wukong Extension | 2 | inventor | 1 action | plan | a Strike with nothing more the simulator reads |
| Clockwork Celerity | 6 | inventor | free | plan | a free's Strike |
| Overdrive Ally | 8 | inventor | 1 action | plan | an Effect with nothing a fight counts |
| Geobukseon Retaliation | 10 | inventor | reaction | no plan |  |
| Celestial Cacophony | 12 | inventor | 3 actions | plan | a timer with no rules a fight counts |
| Explosive Maneuver | 14 | inventor | 1 action | no plan |  |
| You Failed to Account For... This! | 16 | inventor | reaction | no plan |  |
| Devastating Weaponry | 18 | inventor | 3 actions | plan | a Strike with nothing more the simulator reads |
| Exploit Blunder | 2 | investigator | reaction | plan | a teleport |
| Connect the Dots | 6 | investigator | 2 actions | no plan |  |
| Read the Dust | 6 | investigator | reaction | no plan |  |
| Foresee Danger | 12 | investigator | reaction | no plan |  |
| Just as Planned | 12 | investigator | free | no plan |  |
| Air Cushion | 1 | kineticist | reaction | no plan |  |
| Armor in Earth | 1 | kineticist | 1 action | plan | a timer with no rules a fight counts |
| Burning Jet | 1 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Four Winds | 1 | kineticist | 2 actions | no plan |  |
| Fresh Produce | 1 | kineticist | 1 action | no plan |  |
| Hardwood Armor | 1 | kineticist | 1 action | plan | a timer with no rules a fight counts |
| Metal Carapace | 1 | kineticist | 1 action | plan | a timer with no rules a fight counts |
| Weapon Infusion | 1 | kineticist | free | plan | an Effect with nothing a fight counts |
| Ambush Bladderwort | 4 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Command Elemental | 4 | kineticist | 2 actions | no plan |  |
| Living Bonfire | 4 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Ravel of Thorns | 4 | kineticist | 1 action | no plan |  |
| Return to the Sea | 4 | kineticist | 2 actions | plan | a spell the feat casts |
| Thermal Nimbus | 4 | kineticist | 1 action | no plan |  |
| Winter Sleet | 4 | kineticist | 1 action | no plan |  |
| Ash Strider | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Counter Element | 6 | kineticist | reaction | no plan |  |
| Crawling Fire | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Desert Wind | 6 | kineticist | 1 action | plan | an Effect with nothing a fight counts |
| Jagged Berms | 6 | kineticist | 3 actions | no plan |  |
| Lightning Rod | 6 | kineticist | 3 actions | no plan |  |
| Sand Snatcher | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Scrap Barricade | 6 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Torrent in the Blood | 6 | kineticist | 2 actions | no plan |  |
| Tree of Duality | 6 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Two-Element Infusion | 6 | kineticist | free | no plan |  |
| Volcanic Escape | 6 | kineticist | reaction | no plan |  |
| Wooden Palisade | 6 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Conductive Sphere | 8 | kineticist | 2 actions | no plan |  |
| Drifting Pollen | 8 | kineticist | 1 action | no plan |  |
| Kindle Inner Flames | 8 | kineticist | 1 action | no plan |  |
| Swim Through Earth | 8 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Chain Infusion | 10 | kineticist | 1 action | no plan |  |
| Architect of Flame | 12 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Ghosts in the Storm | 12 | kineticist | 1 action | no plan |  |
| Rock Rampart | 12 | kineticist | 3 actions | plan | a spell the feat casts |
| Sea Glass Guardians | 12 | kineticist | 1 action | no plan |  |
| Body of Air | 14 | kineticist | reaction | plan | a timer with no rules a fight counts |
| Liberating Dive | 14 | kineticist | 2 actions | no plan |  |
| Rouse the Forest's Fury | 18 | kineticist | 3 actions | plan | its text has no Strike of its user's |
| Turn the Wheel of Seasons | 18 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Usurp the Lunar Reins | 18 | kineticist | 3 actions | plan | a lasting area |
| Magus's Analysis | 1 | magus | 1 action | no plan |  |
| Devastating Spellstrike | 4 | magus | 2 actions | no plan |  |
| Distant Waterbird's Poise | 4 | magus | reaction | plan | a timer with no rules a fight counts |
| Exploding Bullet | 4 | magus | 1 action | no plan |  |
| Running Recharge | 4 | magus | 1 action | plan | a teleport |
| Spell Retaliation | 6 | magus | free | no plan |  |
| Surface Tension | 6 | magus | 1 action | no plan |  |
| Capture Magic | 8 | magus | reaction | plan | a timer with no rules a fight counts |
| Crosscurrent Counter | 8 | magus | reaction | no plan |  |
| Cascading Ray | 10 | magus | 1 action | no plan |  |
| Killshot's Report | 10 | magus | reaction | no plan |  |
| Unsheathing the Sword-Light | 10 | magus | 2 actions | plan | a choice of ways the simulator doesn't play |
| Overwhelming Spellstrike | 12 | magus | 2 actions | no plan |  |
| Dispelling Spellstrike | 16 | magus | 3 actions | no plan |  |
| Stolen Spell | 18 | magus | free | no plan |  |
| Whirlwind Spell | 20 | magus | 3 actions | plan | its text has no Strike of its user's |
| Monastic Archer Stance | 1 | monk | 1 action | no plan |  |
| Waterfowl Stance | 2 | monk | 1 action | no plan |  |
| Divert Streamflow | 4 | monk | reaction | plan | a roll whose results the simulator doesn't read |
| Flying Kick | 4 | monk | 2 actions | plan | its text has no Strike of its user's |
| Peafowl Stance | 4 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Crane Flutter | 6 | monk | reaction | plan | a reaction's Strike |
| Culvert's Collapse | 6 | monk | 1 action | plan | its requirement (You are in Flood Stance and were damaged by an enemy since your previous turn.) |
| Gorilla Pound | 6 | monk | 1 action | plan | a Strike with nothing more the simulator reads |
| Pinning Fire | 8 | monk | reaction | no plan |  |
| Rippling Spin | 8 | monk | reaction | no plan |  |
| Snakebird's Shadow | 8 | monk | 2 actions | plan | its requirement (You are in Waterfowl Stance and are wielding a monk weapon from the sword group.) |
| Wall Run | 8 | monk | 1 action | plan | a teleport |
| Blazing Streak | 10 | monk | 3 actions | plan | its text has no Strike of its user's |
| Peafowl Strut | 10 | monk | 1 action | plan | its stance (Peafowl Stance): an Effect with nothing a fight counts |
| Winding Flow | 10 | monk | 1 action | plan | a teleport |
| Dodging Roll | 12 | monk | reaction | plan | a choice of ways the simulator doesn't play |
| Focused Shot | 12 | monk | 1 action | plan | its stance (Monastic Archer Stance): the feat module reads nothing for it |
| Explosive Death Drop | 14 | monk | 1 action | plan | its requirement (You are in @UUID[Compendium.pf2e.feats-srd.Item.Rain of Embers Stance] and have a target Grabbed or Res |
| Form Lock | 14 | monk | 1 action | no plan |  |
| Tangled Forest Rake | 14 | monk | 1 action | plan | a Strike with nothing more the simulator reads |
| Whirling Blade Stance | 14 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Wild Winds Gust | 14 | monk | 2 actions | plan | its stance (Wild Winds Stance), not in the packs |
| World-Breaking Footfall | 14 | monk | 2 actions | no plan |  |
| Electric Counter | 16 | monk | reaction | no plan |  |
| Swift River | 18 | monk | free | no plan |  |
| Draining Strike | 2 | necromancer | 1 action | plan | a choice of ways the simulator doesn't play |
| Body Shield | 4 | necromancer | reaction | no plan |  |
| Ghostly Stride | 4 | necromancer | 1 action | plan | a teleport |
| Collateral Reinforcement | 6 | necromancer | 1 action | no plan |  |
| Corrupted Ground | 6 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Hallowed Earth | 6 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Poison Drinker | 8 | necromancer | reaction | no plan |  |
| Desperate Surge | 10 | necromancer | 1 action | no plan |  |
| Amalgamate | 14 | necromancer | 1 action | no plan |  |
| Blood Pool | 14 | necromancer | reaction | plan | a timer with no rules a fight counts |
| Anatomical Quartering | 16 | necromancer | 3 actions | plan | its text has no Strike of its user's |
| Soul Thief | 20 | necromancer | 3 actions | plan | a roll whose results the simulator doesn't read |
| Whispers of Weakness | 1 | oracle | 1 action | plan | an Effect with nothing a fight counts |
| Meddling Futures | 2 | oracle | free | no plan |  |
| Thousand Visions | 4 | oracle | free | plan | a timer with no rules a fight counts |
| Roll the Bones of Fate | 10 | oracle | 1 action | no plan |  |
| Epiphany at the Crossroads | 12 | oracle | free | plan | a spell the feat casts |
| Blaze of Revelation | 18 | oracle | free | plan | its requirement (You are Cursebound 4) |
| Free the Bound | 1 | other | reaction | plan | an Effect on another creature |
| Blasting Beams | 2 | other | 1 action | no plan |  |
| Borrowed Ability | 2 | other | 1 action | plan | a timer with no rules a fight counts |
| Consume Energy | 2 | other | reaction | no plan |  |
| Draining Touch | 2 | other | 1 action | no plan |  |
| Ghostly Grasp (Deviant) | 2 | other | 1 action | plan | a timer with no rules a fight counts |
| Release Spores | 2 | other | 2 actions | plan | a lasting area |
| Rotten Slurry | 2 | other | 1 action | no plan |  |
| Sprout Fruit | 2 | other | 1 action | no plan |  |
| Vine Lash | 2 | other | 1 action | no plan |  |
| Prescience | 4 | other | free | no plan |  |
| Surface Rush | 4 | other | 2 actions | no plan |  |
| Correct the Story | 6 | other | reaction | no plan |  |
| Divert Destiny | 6 | other | free | no plan |  |
| Repel Assault | 6 | other | reaction | plan | a reaction's Strike |
| Unrivaled Retort | 6 | other | reaction | plan | a reaction's Strike |
| Arc of Destruction | 8 | other | reaction | no plan |  |
| Stages of Fate | 8 | other | 2 actions | no plan |  |
| Unbelievable Interception | 8 | other | reaction | no plan |  |
| Feed the Void | 10 | other | 2 actions | plan | a lasting area |
| Lightspeed Assault | 10 | other | 1 action | no plan |  |
| Mythic Strike | 10 | other | 1 action | plan | a Strike with nothing more the simulator reads |
| Aegis for the Innocent | 14 | other | 1 action | plan | its requirement (Your nimbus is active) |
| Burning Surge | 14 | other | reaction | no plan |  |
| Faultless Defense | 14 | other | reaction | no plan |  |
| Immovable Object | 14 | other | 1 action | no plan |  |
| Invigorating Surge | 14 | other | 1 action | plan | an Effect with nothing a fight counts |
| Release Me! | 14 | other | 1 action | plan | its requirement (An enemy has you Grabbed or Restrained.) |
| Second Sight | 14 | other | 1 action | plan | its text has no Strike of its user's |
| Temporal Fury | 14 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| To Thine Own Self | 14 | other | reaction | no plan |  |
| Abjure Harm | 16 | other | reaction | no plan |  |
| Bring Into the Fold | 16 | other | 2 actions | plan | a roll whose results the simulator doesn't read |
| Death from Above (Eternal Legend) | 16 | other | 2 actions | plan | its requirement (You are adjacent to a climbable surface at least 10 feet tall.) |
| Divide and Conquer | 16 | other | 2 actions | plan | a timer with no rules a fight counts |
| Indomitable Shot | 16 | other | 2 actions | no plan |  |
| Leaping Hedgehog Strike | 16 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| Lose Your Chains | 16 | other | reaction | no plan |  |
| My Kingdom, My Blood | 16 | other | 3 actions | plan | a timer with no rules a fight counts |
| Noble Sacrifice | 16 | other | reaction | plan | a timer with no rules a fight counts |
| Prescient Parry | 16 | other | reaction | plan | a reaction's Strike |
| Preserve the Moment | 16 | other | reaction | plan | a reaction's Strike |
| Virulent Strike | 16 | other | 1 action | plan | a Strike with nothing more the simulator reads |
| Army of One | 18 | other | 3 actions | plan | its requirement (Your nimbus is active.) |
| Final Shot Knows the Way | 18 | other | 2 actions | no plan |  |
| Legend of Combat | 18 | other | 1 action | no plan |  |
| Liberty or Death | 18 | other | 2 actions | plan | its requirement (A creature has been the target of your Ultimatum of Liberation for at least 1 minute) |
| Pass Vengeful Judgment | 18 | other | 1 action | plan | its requirement (Your hierophant invoked your judgment on their previous turn To prevent yourself from frivolously calli |
| Shining Glory | 18 | other | 2 actions | plan | its requirement (Your nimbus is active) |
| Sovereign's Blade | 18 | other | 2 actions | plan | a timer with no rules a fight counts |
| Throw and Catch | 18 | other | 3 actions | plan | its requirement (You are wielding a melee warshard weapon.) |
| Finish Their Story! | 20 | other | 2 actions | plan | a Strike with nothing more the simulator reads |
| Violent Unleash | 4 | psychic | 1 action | plan | its requirement (Your previous action was to Unleash your Psyche) |
| Dream Guise | 10 | psychic | 1 action | no plan |  |
| Impose Order (Psychic) | 10 | psychic | 1 action | no plan |  |
| Scour the Library | 10 | psychic | 1 action | no plan |  |
| All in Your Head | 18 | psychic | reaction | no plan |  |
| Crossbow Ace | 1 | ranger | 1 action | no plan |  |
| Relentless Stalker | 2 | ranger | reaction | no plan |  |
| Skirmish Strike | 6 | ranger | 1 action | plan | a Strike with nothing more the simulator reads |
| Roll with it (Kingmaker) | 12 | ranger | reaction | no plan |  |
| Targeting Shot | 14 | ranger | 1 action | plan | a Strike with nothing more the simulator reads |
| Perfect Shot | 18 | ranger | 3 actions | plan | a Strike with nothing more the simulator reads |
| Time Dilation Cascade | 20 | ranger | 3 actions | plan | its text has no Strike of its user's |
| Twin Feint | 1 | rogue | 2 actions | plan | its requirement, which the PC doesn't meet (You are wielding two melee weapons, each in a different hand.) |
| You're Next | 1 | rogue | reaction | no plan |  |
| Clever Gambit | 2 | rogue | reaction | plan | a teleport |
| Underhanded Assault | 2 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Battle Assessment | 4 | rogue | 1 action | no plan |  |
| Mug | 4 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Poison Weapon | 4 | rogue | 1 action | no plan |  |
| Predictable! | 4 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Reactive Pursuit | 4 | rogue | reaction | plan | a teleport |
| Sabotage | 4 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Analyze Weakness | 6 | rogue | 1 action | no plan |  |
| Slice and Swipe | 6 | rogue | 1 action | plan | its text has no Strike of its user's |
| Stella's Stab and Snag | 6 | rogue | 2 actions | plan | its text has no Strike of its user's |
| Bullseye | 8 | rogue | 1 action | no plan |  |
| Delay Trap | 8 | rogue | reaction | no plan |  |
| Ricochet Stance (Rogue) | 8 | rogue | 1 action | plan | an Effect with nothing a fight counts |
| Sawtooth Grapple | 8 | rogue | 2 actions | plan | its requirement (You're wielding two weapons, at least one of which is a sawtooth saber.) |
| Swipe Souvenir | 8 | rogue | 2 actions | no plan |  |
| Tactical Entry | 8 | rogue | free | plan | a teleport |
| Fantastic Leap | 12 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Felling Shot | 12 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Preparation | 12 | rogue | 1 action | no plan |  |
| Cognitive Loophole | 16 | rogue | reaction | plan | a timer with no rules a fight counts |
| Cutthroat Grapple | 16 | rogue | reaction | plan | a reaction's Strike |
| Dispelling Slice | 16 | rogue | 2 actions | plan | a Strike with nothing more the simulator reads |
| Swift Elusion | 16 | rogue | reaction | no plan |  |
| Reactive Distraction | 20 | rogue | reaction | no plan |  |
| Engraving Strike | 1 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| Remote Detonation | 1 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| Pattern Flight | 2 | runesmith | 2 actions | plan | a Strike with nothing more the simulator reads |
| Artist's Attendance | 4 | runesmith | 2 actions | plan | a teleport |
| Engraving Maneuver | 6 | runesmith | 1 action | no plan |  |
| Drawn In Vital Ink | 8 | runesmith | free | no plan |  |
| Edifying Trace | 8 | runesmith | 1 action | no plan |  |
| Chain of Words | 10 | runesmith | 2 actions | plan | a timer with no rules a fight counts |
| Clashing Compound Invocation | 10 | runesmith | 1 action | no plan |  |
| Astral Compound Invocation | 12 | runesmith | 1 action | no plan |  |
| Orbiting Runestone | 12 | runesmith | 1 action | no plan |  |
| Dance of Bloody Ink | 14 | runesmith | 3 actions | plan | its requirement (You're wielding a melee weapon that bears a rune.) |
| Henge Gate | 14 | runesmith | 2 actions | plan | a timer with no rules a fight counts |
| Unerring Runic Attraction | 14 | runesmith | 1 action | plan | a Strike with nothing more the simulator reads |
| By Your Name | 16 | runesmith | 1 action | plan | a roll whose results the simulator doesn't read |
| Return Unto Runes | 16 | runesmith | reaction | plan | a timer with no rules a fight counts |
| Annihilating Compound Invocation | 18 | runesmith | 1 action | no plan |  |
| Blood Rising | 1 | sorcerer | reaction | plan | a timer with no rules a fight counts |
| One for All | 1 | swashbuckler | 1 action | no plan |  |
| Brandishing Draw | 2 | swashbuckler | 1 action | plan | its text has no Strike of its user's |
| Retreating Finisher | 2 | swashbuckler | 1 action | plan | a Strike with nothing more the simulator reads |
| Swan Dive | 2 | swashbuckler | 1 action | no plan |  |
| Dastardly Dash | 4 | swashbuckler | 1 action | plan | a teleport |
| Impaling Finisher | 4 | swashbuckler | 1 action | plan | a Strike with nothing more the simulator reads |
| Twirling Throw | 4 | swashbuckler | 1 action | no plan |  |
| Distracting Toss | 8 | swashbuckler | 2 actions | plan | a Strike with nothing more the simulator reads |
| Vivacious Bravado | 8 | swashbuckler | 1 action | plan | its requirement (You gained @UUID[Compendium.pf2e.classfeatures.Item.Panache] this turn) |
| Switcheroo | 10 | swashbuckler | reaction | no plan |  |
| The Bigger They Are | 12 | swashbuckler | 1 action | no plan |  |
| Flamboyant Leap | 14 | swashbuckler | 2 actions | no plan |  |
| Lethal Finisher | 18 | swashbuckler | 1 action | plan | a roll whose results the simulator doesn't read |
| Illimitable Finisher | 20 | swashbuckler | 1 action | plan | its text has no Strike of its user's |
| Vivacious Afterimage | 20 | swashbuckler | 1 action | plan | a timer with no rules a fight counts |
| Root to Life | 1 | thaumaturge | 1 action | no plan |  |
| Turn Away Misfortune | 2 | thaumaturge | reaction | no plan |  |
| Instructive Strike | 4 | thaumaturge | 1 action | plan | a Strike with nothing more the simulator reads |
| Cursed Effigy | 8 | thaumaturge | 1 action | no plan |  |
| Share Weakness | 10 | thaumaturge | 1 action | no plan |  |
| Twin Weakness | 10 | thaumaturge | 2 actions | plan | its requirement (You're holding an implement and a weapon, you are using Exploit Vulnerability with mortal weakness or p |
| Intensify Investiture | 12 | thaumaturge | free | no plan |  |
| Trespass Teleportation | 14 | thaumaturge | reaction | no plan |  |
| Sever Magic | 16 | thaumaturge | 2 actions | plan | its requirement (You're holding an implement.) |
| Implement's Assault | 18 | thaumaturge | 3 actions | plan | its requirement (You're holding an implement.) |
| Portents of the Haruspex | 4 | witch | reaction | no plan |  |
| Sympathetic Strike | 4 | witch | 1 action | plan | a Strike with nothing more the simulator reads |
| Convincing Illusion | 6 | wizard | reaction | plan | a roll whose results the simulator doesn't read |
| Spell Tinker | 16 | wizard | 2 actions | no plan |  |

## Passives that change a class feature (249)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Far Lobber | 1 | alchemist | passive | no plan |  |
| Smoke Bomb | 2 | alchemist | passive | no plan |  |
| Calculated Splash | 4 | alchemist | passive | no plan |  |
| Healing Bomb | 4 | alchemist | passive | no plan |  |
| Longshanks Slam | 4 | alchemist | passive | no plan |  |
| Directional Bombs | 6 | alchemist | passive | no plan |  |
| Perpetual Breadth | 8 | alchemist | passive | no plan |  |
| Expanded Splash | 10 | alchemist | passive | no plan |  |
| Greater Debilitating Bomb | 10 | alchemist | passive | no plan |  |
| Lingering Bomb | 10 | alchemist | passive | no plan |  |
| Sour Bomb | 10 | alchemist | passive | plan | a reaction to "passive" |
| Balm Bomb | 12 | alchemist | passive | no plan |  |
| Uncanny Bombs | 12 | alchemist | passive | no plan |  |
| True Debilitating Bomb | 14 | alchemist | passive | no plan |  |
| Exploitive Bomb | 16 | alchemist | passive | no plan |  |
| Perfect Debilitation | 18 | alchemist | passive | no plan |  |
| Mega Bomb | 20 | alchemist | passive | no plan |  |
| Apparition Stabilization | 6 | animist | passive | no plan |  |
| Instinctive Maneuvers | 8 | animist | passive | no plan |  |
| Cardinal Guardians | 14 | animist | passive | no plan |  |
| Eternal Guide | 20 | animist | passive | no plan |  |
| Aura Enhancement | 4 | archetype | passive | no plan |  |
| Base Kinesis | 4 | archetype | passive | no plan |  |
| Finishing Precision | 4 | archetype | passive | no plan |  |
| Guard's Fury | 4 | archetype | passive | no plan |  |
| Investigator's Stratagem | 4 | archetype | passive | no plan |  |
| Repeating Hand Crossbow Training | 4 | archetype | passive | no plan |  |
| Safety Measures | 4 | archetype | passive | no plan |  |
| Spell Runes | 4 | archetype | passive | no plan |  |
| Spellstriker | 4 | archetype | passive | no plan |  |
| Through the Gate | 4 | archetype | passive | no plan |  |
| Advanced Element Control | 6 | archetype | passive | no plan |  |
| Implement Initiate | 6 | archetype | passive | no plan |  |
| Living Rune | 6 | archetype | passive | no plan |  |
| Multifaceted Will | 6 | archetype | passive | no plan |  |
| Palatine Enchantment | 6 | archetype | passive | no plan |  |
| Rod of Rule | 6 | archetype | passive | plan | a passive's Effect on other creatures |
| Slinger's Readiness | 6 | archetype | passive | no plan |  |
| Soul Arsenal | 6 | archetype | passive | no plan |  |
| Tracing Studies | 6 | archetype | passive | no plan |  |
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
| Raging Intimidation | 1 | barbarian | passive | no plan |  |
| Raging Thrower | 1 | barbarian | passive | no plan |  |
| Acute Scent | 2 | barbarian | passive | no plan |  |
| Elemental Evolution | 2 | barbarian | passive | no plan |  |
| Second Wind | 2 | barbarian | passive | no plan |  |
| Raging Athlete | 4 | barbarian | passive | no plan |  |
| Supernatural Senses | 4 | barbarian | passive | no plan |  |
| Animal Skin | 6 | barbarian | passive | no plan |  |
| Brutal Bully | 6 | barbarian | passive | no plan |  |
| Nocturnal Senses | 6 | barbarian | passive | no plan |  |
| Furious Bully | 8 | barbarian | passive | no plan |  |
| Shattering Blows | 16 | barbarian | passive | no plan |  |
| Contagious Rage | 20 | barbarian | passive | no plan |  |
| Martial Performance | 1 | bard | passive | no plan |  |
| Cantrip Expansion | 2 | bard | passive | no plan |  |
| Directed Audience | 2 | bard | passive | no plan |  |
| Loremaster's Etude | 2 | bard | passive | plan | a spell the engine doesn't cast (Loremaster's Etude) |
| Ode to Ouroboros | 10 | bard | passive | plan | a spell the engine doesn't cast (Ode to Ouroboros) |
| Symphony of the Unfettered Heart | 10 | bard | passive | no plan |  |
| Shared Assault | 12 | bard | passive | no plan |  |
| Discordant Voice | 18 | bard | passive | no plan |  |
| Fatal Aria | 20 | bard | passive | plan | a spell the engine doesn't cast (Fatal Aria) |
| Pied Piping | 20 | bard | passive | plan | a spell the engine doesn't cast (Pied Piping) |
| Song of the Fallen | 20 | bard | passive | plan | a spell the engine doesn't cast (Song of the Fallen) |
| Symphony of the Muse | 20 | bard | passive | no plan |  |
| Nimble Reprisal | 1 | champion | passive | no plan |  |
| Oath of the Avenger | 2 | champion | passive | no plan |  |
| Vengeful Oath | 2 | champion | passive | no plan |  |
| Accelerating Touch | 4 | champion | passive | no plan |  |
| Mercy | 4 | champion | passive | no plan |  |
| Resilient Touch | 10 | champion | passive | no plan |  |
| Affliction Mercy | 12 | champion | passive | no plan |  |
| Amplifying Touch | 12 | champion | passive | no plan |  |
| Aura of Vengeance | 14 | champion | passive | no plan |  |
| Instrument of Slaughter | 16 | champion | passive | no plan |  |
| Instrument of Zeal | 16 | champion | passive | no plan |  |
| Rejuvenating Touch | 18 | champion | passive | no plan |  |
| Swift Retribution | 18 | champion | passive | no plan |  |
| Ultimate Mercy | 18 | champion | passive | no plan |  |
| Armament Paragon | 20 | champion | passive | plan | its Effect has nothing a fight counts |
| Banishing Blow | 20 | champion | passive | no plan |  |
| Castigating Weapon | 10 | cleric | passive | no plan |  |
| Claim the Field | 6 | commander | passive | no plan |  |
| Anthropomorphic Shape | 4 | druid | passive | no plan |  |
| Order Magic | 4 | druid | passive | no plan |  |
| Advanced Elemental Spell | 6 | druid | passive | no plan |  |
| Insect Shape | 6 | druid | passive | no plan |  |
| Ferocious Shape | 8 | druid | passive | no plan |  |
| Soaring Shape | 8 | druid | passive | no plan |  |
| Elemental Shape | 10 | druid | passive | no plan |  |
| Dragon Shape | 12 | druid | passive | no plan |  |
| Primal Summons | 12 | druid | passive | no plan |  |
| Impaling Briars | 16 | druid | passive | no plan |  |
| Monstrosity Shape | 16 | druid | passive | no plan |  |
| Perfect Form Control | 18 | druid | passive | no plan |  |
| Apex Companion | 20 | druid | passive | plan | a spell the engine doesn't cast (Apex Companion) |
| Twin Stars | 1 | exemplar | passive | no plan |  |
| Hurl at the Horizon | 2 | exemplar | passive | no plan |  |
| Leap the Falls | 2 | exemplar | passive | no plan |  |
| Red-Gold Mortality | 2 | exemplar | passive | no plan |  |
| Follow the Threads of Fate | 4 | exemplar | passive | no plan |  |
| Only the Worthy | 4 | exemplar | passive | no plan |  |
| Steel on Steel | 4 | exemplar | passive | no plan |  |
| Through the Needle's Eye | 4 | exemplar | passive | no plan |  |
| Binding Serpents Celestial Arrow | 6 | exemplar | passive | no plan |  |
| Motionless Cutter | 6 | exemplar | passive | no plan |  |
| Riddle The Sphinx | 6 | exemplar | passive | no plan |  |
| Shield of Stone | 6 | exemplar | passive | no plan |  |
| Additional Ikon | 8 | exemplar | passive | no plan |  |
| Breath of Vital Ash | 10 | exemplar | passive | no plan |  |
| Journey of the Sky Chariot | 10 | exemplar | passive | no plan |  |
| Mated Birds in Paired Flight | 10 | exemplar | passive | no plan |  |
| Compliant Gold | 12 | exemplar | passive | no plan |  |
| Warped by Rage | 12 | exemplar | passive | no plan |  |
| Destined Victory | 14 | exemplar | passive | no plan |  |
| Infinite Blades Celestial Arrow | 14 | exemplar | passive | no plan |  |
| Crown of Rule | 16 | exemplar | passive | no plan |  |
| Gift of the Immortal Herb | 16 | exemplar | passive | no plan |  |
| Shroud of Ghosts | 16 | exemplar | passive | no plan |  |
| Branched Tree of Pain | 18 | exemplar | passive | no plan |  |
| Eternity-Incinerating Blaze | 18 | exemplar | passive | no plan |  |
| Seven-Colored Cosmic Bridge | 18 | exemplar | passive | no plan |  |
| Sunwrecker | 18 | exemplar | passive | no plan |  |
| Reach for Immortality | 20 | exemplar | passive | no plan |  |
| Long-Distance Taunt | 1 | guardian | passive | no plan |  |
| Group Taunt | 8 | guardian | passive | no plan |  |
| Perfect Protection | 18 | guardian | passive | no plan |  |
| Crossbow Crack Shot | 1 | gunslinger | passive | no plan |  |
| Dual-Weapon Reload | 1 | gunslinger | passive | no plan |  |
| Hair Trigger | 16 | gunslinger | passive | no plan |  |
| Perfect Readiness | 20 | gunslinger | passive | no plan |  |
| Variable Core | 1 | inventor | passive | no plan |  |
| Diving Armor | 4 | inventor | passive | no plan |  |
| Dual-Form Weapon | 4 | inventor | passive | no plan |  |
| Construct Shell | 6 | inventor | passive | no plan |  |
| Gigaton Strike | 8 | inventor | passive | no plan |  |
| Shared Overdrive | 12 | inventor | passive | plan | a passive's Effect on other creatures |
| Persistent Boost | 16 | inventor | passive | no plan |  |
| Full Automation | 20 | inventor | passive | plan | a passive's Strike |
| Known Weaknesses | 1 | investigator | passive | no plan |  |
| Athletic Strategist | 2 | investigator | passive | no plan |  |
| Defensive Stratagem | 8 | investigator | passive | no plan |  |
| Whodunnit? | 8 | investigator | passive | no plan |  |
| Extended Kinesis | 1 | kineticist | passive | no plan |  |
| Safe Elements | 4 | kineticist | passive | no plan |  |
| Elemental Overlap | 8 | kineticist | passive | no plan |  |
| Aura Shaping | 10 | kineticist | passive | no plan |  |
| Kinetic Pinnacle | 20 | kineticist | passive | no plan |  |
| Convergent Tides | 2 | magus | passive | no plan |  |
| Expansive Spellstrike | 2 | magus | passive | no plan |  |
| Spirit Sheath | 2 | magus | passive | no plan |  |
| Burning Cascade | 4 | magus | passive | no plan |  |
| Starlit Eyes | 4 | magus | passive | no plan |  |
| Striker's Scroll | 4 | magus | passive | no plan |  |
| Runic Impression | 8 | magus | passive | plan | a spell the engine doesn't cast (Runic Impression) |
| Sprinting Spellstrike | 12 | magus | passive | no plan |  |
| Arcane Shroud | 14 | magus | passive | no plan |  |
| Resounding Cascade | 16 | magus | passive | no plan |  |
| Flurry of Maneuvers | 4 | monk | passive | no plan |  |
| Stumbling Feint | 6 | monk | passive | no plan |  |
| Song of the Soul | 2 | necromancer | passive | plan | a spell the engine doesn't cast (Song of the Soul) |
| Mobile Thralls | 4 | necromancer | passive | no plan |  |
| Sanguine Transference | 8 | necromancer | passive | plan | a spell the engine doesn't cast (Sanguine Transference) |
| Become as Spirit | 12 | necromancer | passive | no plan |  |
| Perfected Thrall | 20 | necromancer | passive | no plan |  |
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
| Nature Prowler | 6 | ranger | passive | no plan |  |
| Distracting Shot | 12 | ranger | passive | no plan |  |
| Double Prey | 12 | ranger | passive | no plan |  |
| Shared Prey | 14 | ranger | passive | no plan |  |
| Warden's Guidance | 14 | ranger | passive | no plan |  |
| Greater Distracting Shot | 16 | ranger | passive | no plan |  |
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
| Runesight | 16 | runesmith | passive | no plan |  |
| Unbounded Invocations | 18 | runesmith | passive | no plan |  |
| Forge New Word | 20 | runesmith | passive | no plan |  |
| Generational Rune-Singer | 20 | runesmith | passive | no plan |  |
| Shades of Meaning | 20 | runesmith | passive | no plan |  |
| Greater Spiritual Evolution | 12 | sorcerer | passive | no plan |  |
| Elegant Buckler | 1 | swashbuckler | passive | no plan |  |
| Flying Blade | 1 | swashbuckler | passive | no plan |  |
| Finishing Follow-Through | 2 | swashbuckler | passive | plan | its Effect has nothing a fight counts |
| Flamboyant Athlete | 4 | swashbuckler | passive | no plan |  |
| Agile Maneuvers | 6 | swashbuckler | passive | no plan |  |
| Flamboyant Cruelty | 8 | swashbuckler | passive | no plan |  |
| Derring-Do | 10 | swashbuckler | passive | no plan |  |
| Parry and Riposte | 18 | swashbuckler | passive | no plan |  |
| Ammunition Thaumaturgy | 1 | thaumaturge | passive | no plan |  |
| Scroll Thaumaturgy | 1 | thaumaturge | passive | no plan |  |
| Esoteric Warden | 2 | thaumaturge | passive | plan | a passive's Effect posted by hand |
| Breached Defenses | 4 | thaumaturge | passive | no plan |  |
| Sympathetic Vulnerabilities | 6 | thaumaturge | passive | no plan |  |
| Esoteric Reflexes | 14 | thaumaturge | passive | no plan |  |
| Implement's Flight | 16 | thaumaturge | passive | no plan |  |
| Intense Implement | 18 | thaumaturge | passive | no plan |  |
| Ubiquitous Weakness | 20 | thaumaturge | passive | no plan |  |
| Cackle | 1 | witch | passive | plan | a spell the engine doesn't cast (Cackle) |
| Syu Tak-nwa's Hexed Locks | 8 | witch | passive | no plan |  |
| Hex Master | 20 | witch | passive | no plan |  |

## Other combat passives (439)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Blowgun Poisoner | 1 | alchemist | passive | no plan |  |
| Soothing Vials | 1 | alchemist | passive | plan | a passive's Effect on other creatures |
| Clotting Elixirs | 2 | alchemist | passive | no plan |  |
| Pernicious Poison | 2 | alchemist | passive | no plan |  |
| Numbing Spice Exhalation | 4 | alchemist | passive | plan | a reaction to "passive" |
| Combustible Poison | 6 | alchemist | passive | no plan |  |
| Fortified Elixirs | 6 | alchemist | passive | no plan |  |
| Sticky Poison | 6 | alchemist | passive | no plan |  |
| Blazing Mutagen | 8 | alchemist | passive | plan | a passive's Effect posted by hand |
| Improved Invigorating Elixir | 8 | alchemist | passive | no plan |  |
| Mutant Physique | 8 | alchemist | passive | plan | its requirement, which the PC doesn't meet (the weapon its damage die upgrade names) |
| Pinpoint Poisoner | 8 | alchemist | passive | no plan |  |
| Unstable Concoction | 10 | alchemist | passive | no plan |  |
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
| Bullet Dancer Burn | 4 | archetype | passive | no plan |  |
| Contortionist | 4 | archetype | passive | no plan |  |
| Contract Blade | 4 | archetype | passive | no plan |  |
| Defender's Grit | 4 | archetype | passive | no plan |  |
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
| Guerrilla Weaponry | 4 | archetype | passive | no plan |  |
| Hijack Undead | 4 | archetype | passive | plan | a reaction to "passive" |
| Improvised Pummel | 4 | archetype | passive | no plan |  |
| Leader of All | 4 | archetype | passive | no plan |  |
| Modular Dynamo | 4 | archetype | passive | no plan |  |
| Patch Job | 4 | archetype | passive | no plan |  |
| Perfect Strike | 4 | archetype | passive | plan | a spell the engine doesn't cast (Perfect Strike) |
| Poultice Preparation | 4 | archetype | passive | no plan |  |
| Raging Stories | 4 | archetype | passive | no plan |  |
| Replenishing Consumption | 4 | archetype | passive | no plan |  |
| Rescuer's Press | 4 | archetype | passive | no plan |  |
| Shining Arms | 4 | archetype | passive | no plan |  |
| Snare Expert | 4 | archetype | passive | no plan |  |
| Summon Ensemble | 4 | archetype | passive | no plan |  |
| Tandem Onslaught | 4 | archetype | passive | no plan |  |
| Tools of the Trade | 4 | archetype | passive | no plan |  |
| Tricksterbane Oath | 4 | archetype | passive | no plan |  |
| Versatile Mutation | 4 | archetype | passive | no plan |  |
| Viking Weapon Familiarity | 4 | archetype | passive | no plan |  |
| Voice of Authority | 4 | archetype | passive | no plan |  |
| Animate Net | 6 | archetype | passive | no plan |  |
| Arcana of Iron | 6 | archetype | passive | no plan |  |
| Artery Map | 6 | archetype | passive | no plan |  |
| Axe Thrower | 6 | archetype | passive | no plan |  |
| Cayden's Freedom | 6 | archetype | passive | no plan |  |
| Concealing Currents | 6 | archetype | passive | no plan |  |
| Confounding Image | 6 | archetype | passive | no plan |  |
| Crowd Mastery | 6 | archetype | passive | no plan |  |
| Cutting Heaven, Crushing Earth | 6 | archetype | passive | no plan |  |
| Daywalker (Vampire) | 6 | archetype | passive | no plan |  |
| Distracting Bites | 6 | archetype | passive | no plan |  |
| Endemic Herbs | 6 | archetype | passive | no plan |  |
| Feeding Frenzy | 6 | archetype | passive | no plan |  |
| Flexible Nexus | 6 | archetype | passive | no plan |  |
| Flowing Palm Deflection | 6 | archetype | passive | no plan |  |
| Gear Up | 6 | archetype | passive | no plan |  |
| Grave Mummification | 6 | archetype | passive | no plan |  |
| Gray Corsair Training | 6 | archetype | passive | no plan |  |
| Guardian's Intercept | 6 | archetype | passive | no plan |  |
| Hellknight Preferment | 6 | archetype | passive | no plan |  |
| Inevitable Thralls | 6 | archetype | passive | no plan |  |
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
| Back to Back | 8 | archetype | passive | no plan |  |
| Beacon Mark | 8 | archetype | passive | no plan |  |
| Call Your Shot | 8 | archetype | passive | no plan |  |
| Chaining Mutation | 8 | archetype | passive | no plan |  |
| Controlled Blast | 8 | archetype | passive | no plan |  |
| Creed Magic | 8 | archetype | passive | no plan |  |
| Deadly Mutation | 8 | archetype | passive | no plan |  |
| Glyph Expert | 8 | archetype | passive | plan | a passive's Effect posted by hand |
| Grasping Corpses | 8 | archetype | passive | no plan |  |
| Impervious Vehicle | 8 | archetype | passive | no plan |  |
| Interposing Crowd | 8 | archetype | passive | no plan |  |
| Jumping Jenny Display | 8 | archetype | passive | no plan |  |
| Lingering Flames | 8 | archetype | passive | no plan |  |
| Magpie Manor Recovery | 8 | archetype | passive | no plan |  |
| Necromantic Bulwark | 8 | archetype | passive | no plan |  |
| Pact of Infernal Prowess | 8 | archetype | passive | no plan |  |
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
| World-Wise Vigilance | 8 | archetype | passive | no plan |  |
| And Yet it Still Hurts | 10 | archetype | passive | no plan |  |
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
| Hidden Intentions | 10 | archetype | passive | no plan |  |
| Hook 'Em | 10 | archetype | passive | no plan |  |
| Lastwall Warden | 10 | archetype | passive | no plan |  |
| Mask of the 12th Step | 10 | archetype | passive | no plan |  |
| Secrets of Steel | 10 | archetype | passive | no plan |  |
| Shadow of Death | 10 | archetype | passive | no plan |  |
| Sin Counterspell | 10 | archetype | passive | no plan |  |
| Spiritual Flurry | 10 | archetype | passive | no plan |  |
| Steal the Sky | 10 | archetype | passive | plan | a spell the engine doesn't cast (Steal the Sky) |
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
| Frightful Attrition | 12 | archetype | passive | plan | a reaction to "passive" |
| Greater Despair | 12 | archetype | passive | no plan |  |
| Hell's Armaments | 12 | archetype | passive | plan | a reaction to "passive" |
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
| Spiritual Aid | 12 | archetype | passive | no plan |  |
| Sword of Sealing | 12 | archetype | passive | plan | a passive's roll with no action to use it |
| Sympathetic Portrayal | 12 | archetype | passive | no plan |  |
| Thorn in Hell's Side | 12 | archetype | passive | no plan |  |
| Uncanny Suction | 12 | archetype | passive | no plan |  |
| Undying Beast | 12 | archetype | passive | no plan |  |
| Virtuosic Dancer | 12 | archetype | passive | no plan |  |
| Ward Slumber | 12 | archetype | passive | no plan |  |
| Wild Strider | 12 | archetype | passive | no plan |  |
| Aldori's Retort | 14 | archetype | passive | no plan |  |
| Concentrated Assault | 14 | archetype | passive | no plan |  |
| Consecrated Aura | 14 | archetype | passive | no plan |  |
| Defy Chains | 14 | archetype | passive | no plan |  |
| Dual Onslaught | 14 | archetype | passive | no plan |  |
| Enshroud Soul Cage | 14 | archetype | passive | no plan |  |
| Immediate Rebuke | 14 | archetype | passive | no plan |  |
| Keep up the Good Fight | 14 | archetype | passive | plan | a passive's roll with no action to use it |
| Lesson of the Hurricane's Might | 14 | archetype | passive | no plan |  |
| Pact of the Death Hunter | 14 | archetype | passive | no plan |  |
| Shape of the Cloud Dragon | 14 | archetype | passive | no plan |  |
| Shape of the Dragon | 14 | archetype | passive | no plan |  |
| Sixth Pillar Mastery | 14 | archetype | passive | no plan |  |
| Tactical Cadence | 14 | archetype | passive | no plan |  |
| Terrible Transformation | 14 | archetype | passive | no plan |  |
| Throttle the Divine | 14 | archetype | passive | no plan |  |
| Unseen Shot | 14 | archetype | passive | no plan |  |
| Winter's Kiss | 14 | archetype | passive | no plan |  |
| Fearsome Fangs | 16 | archetype | passive | no plan |  |
| Free from Bonds | 16 | archetype | passive | no plan |  |
| Healing Sanctuary | 16 | archetype | passive | plan | a passive's Effect on other creatures |
| Lead the Pack | 16 | archetype | passive | no plan |  |
| Rallying Charge (Knight Vigilant) | 16 | archetype | passive | no plan |  |
| Shared Mind, Shared Heart | 16 | archetype | passive | no plan |  |
| Stunning Appearance | 16 | archetype | passive | no plan |  |
| Withstand Death | 16 | archetype | passive | no plan |  |
| Emboldened with Glorious Purpose | 18 | archetype | passive | plan | a passive's Effect posted by hand |
| Ever Dreaming | 18 | archetype | passive | no plan |  |
| Fight Choreography | 18 | archetype | passive | no plan |  |
| Heightened Instincts | 18 | archetype | passive | no plan |  |
| Repelling Enforcer | 18 | archetype | passive | no plan |  |
| School Spell Redirection | 18 | archetype | passive | no plan |  |
| Stave off Catastrophe | 18 | archetype | passive | no plan |  |
| Uncanny Vitae | 18 | archetype | passive | no plan |  |
| Aldori Swordlord | 20 | archetype | passive | no plan |  |
| Empyreal Aura | 20 | archetype | passive | plan | a reaction to "aura" |
| Pack Takedown | 20 | archetype | passive | no plan |  |
| Vigil's Palisades | 20 | archetype | passive | no plan |  |
| Instinctive Strike | 8 | barbarian | passive | no plan |  |
| Great Cleave | 10 | barbarian | passive | no plan |  |
| Overpowering Charge | 10 | barbarian | passive | no plan |  |
| Awesome Blow | 14 | barbarian | passive | plan | a passive's roll with no action to use it |
| Collateral Thrash | 16 | barbarian | passive | no plan |  |
| Brilliant Flash | 1 | champion | passive | no plan |  |
| Iron Repercussions | 1 | champion | passive | no plan |  |
| Ongoing Selfishness | 1 | champion | passive | no plan |  |
| Unimpeded Step | 1 | champion | passive | no plan |  |
| Vicious Vengeance | 1 | champion | passive | no plan |  |
| Aura of Despair | 4 | champion | passive | no plan |  |
| Cruelty | 4 | champion | passive | no plan |  |
| Shield Warden | 6 | champion | passive | no plan |  |
| Greater Mercy | 8 | champion | passive | no plan |  |
| Greater Security | 8 | champion | passive | no plan |  |
| Spectral Advance | 10 | champion | passive | plan | a spell the engine doesn't cast (Spectral Advance) |
| Divine Wall | 12 | champion | passive | no plan |  |
| Lasting Doubt | 12 | champion | passive | no plan |  |
| Liberating Stride | 12 | champion | passive | no plan |  |
| Necromantic Deflection | 12 | champion | passive | no plan |  |
| Aura of Life | 14 | champion | passive | no plan |  |
| Aura of Righteousness | 14 | champion | passive | no plan |  |
| Greater Interpose | 14 | champion | passive | no plan |  |
| Shield of Grace | 16 | champion | passive | no plan |  |
| Deadly Simplicity | 1 | cleric | passive | plan | its requirement, which the PC doesn't meet (the weapon its damage die upgrade names) |
| Divine Castigation | 1 | cleric | passive | no plan |  |
| Communal Healing | 2 | cleric | passive | no plan |  |
| Panic the Dead | 2 | cleric | passive | no plan |  |
| Sap Life | 2 | cleric | passive | no plan |  |
| Selective Energy | 6 | cleric | passive | no plan |  |
| Cremate Undead | 8 | cleric | passive | no plan |  |
| Emblazon Energy | 8 | cleric | passive | no plan |  |
| Replenishment of War | 10 | cleric | passive | no plan |  |
| Shared Avoidance | 10 | cleric | passive | no plan |  |
| Emblazon Antimagic | 12 | cleric | passive | no plan |  |
| Necromancer's Visage | 12 | cleric | passive | no plan |  |
| Shared Replenishment | 12 | cleric | passive | no plan |  |
| Deity's Protection | 14 | cleric | passive | no plan |  |
| Resurrectionist | 16 | cleric | passive | plan | a passive's Effect on other creatures |
| Shared Clarity | 18 | cleric | passive | no plan |  |
| Observational Analysis | 4 | commander | passive | no plan |  |
| Drilled Reflexes | 10 | commander | passive | no plan |  |
| Targeting Strike | 10 | commander | passive | no plan |  |
| Fortunate Blow | 12 | commander | passive | no plan |  |
| Contact With the Enemy | 14 | commander | passive | no plan |  |
| Practiced Reflexes | 18 | commander | passive | no plan |  |
| Fire Lung | 1 | druid | passive | no plan |  |
| Steadying Stone | 1 | druid | passive | no plan |  |
| Pristine Weapon | 10 | druid | passive | no plan |  |
| Heart of the Kaiju | 20 | druid | passive | plan | a reaction to "passive" |
| Energized Spark | 1 | exemplar | passive | no plan |  |
| Remake the World | 20 | exemplar | passive | no plan |  |
| Powerful Shove | 4 | fighter | passive | no plan |  |
| Shielded Stride | 4 | fighter | passive | no plan |  |
| Reflexive Shield | 6 | fighter | passive | no plan |  |
| Blind-Fight | 8 | fighter | passive | no plan |  |
| Resounding Bravery | 8 | fighter | passive | no plan |  |
| Crashing Slam | 10 | fighter | passive | no plan |  |
| Flinging Shove | 12 | fighter | passive | no plan |  |
| Guiding Riposte | 14 | fighter | passive | no plan |  |
| Improved Reflexive Shield | 16 | fighter | passive | no plan |  |
| Savage Critical | 18 | fighter | passive | no plan |  |
| Boundless Reprisals | 20 | fighter | passive | no plan |  |
| Punishing Shove | 1 | guardian | passive | no plan |  |
| Phalanx Formation | 2 | guardian | passive | no plan |  |
| Raise Haft | 2 | guardian | passive | no plan |  |
| Area Armor | 4 | guardian | passive | no plan |  |
| Energy Interceptor | 4 | guardian | passive | no plan |  |
| Sure-Footed | 10 | guardian | passive | no plan |  |
| Devastating Shield Wallop | 12 | guardian | passive | no plan |  |
| Quick Vengeance | 18 | guardian | passive | no plan |  |
| Great Shield Mastery | 20 | guardian | passive | no plan |  |
| Sword and Pistol | 1 | gunslinger | passive | no plan |  |
| Defensive Armaments | 2 | gunslinger | passive | no plan |  |
| Defy Fey | 6 | gunslinger | passive | no plan |  |
| Leap and Fire | 8 | gunslinger | passive | no plan |  |
| Greenwatcher | 10 | gunslinger | passive | no plan |  |
| Unshakable Grit | 12 | gunslinger | passive | no plan |  |
| Disruptive Blur | 14 | gunslinger | passive | no plan |  |
| Showstopper | 14 | gunslinger | passive | no plan |  |
| Ricochet Master | 16 | gunslinger | passive | no plan |  |
| Piercing Critical | 18 | gunslinger | passive | no plan |  |
| Unerring Shot | 18 | gunslinger | passive | no plan |  |
| Ricochet Legend | 20 | gunslinger | passive | no plan |  |
| Slinger's Reflexes | 20 | gunslinger | passive | no plan |  |
| Gigavolt | 12 | inventor | passive | no plan |  |
| Takedown Expert | 1 | investigator | passive | no plan |  |
| Trap Finder | 1 | investigator | passive | no plan |  |
| Certain Stratagem | 2 | investigator | passive | no plan |  |
| Shared Stratagem | 2 | investigator | passive | no plan |  |
| Scalpel's Point | 4 | investigator | passive | no plan |  |
| Strategic Assessment | 4 | investigator | passive | no plan |  |
| Strategic Repose | 4 | investigator | passive | no plan |  |
| Clue Them All In | 8 | investigator | passive | no plan |  |
| Ongoing Strategy | 10 | investigator | passive | no plan |  |
| Empiricist's Eye | 12 | investigator | passive | no plan |  |
| Make 'Em Sweat | 12 | investigator | passive | no plan |  |
| Strategic Bypass | 14 | investigator | passive | no plan |  |
| Didactic Strike | 16 | investigator | passive | plan | a passive's Effect on other creatures |
| Versatile Blasts | 1 | kineticist | passive | no plan |  |
| Knowledge is Power | 6 | magus | passive | no plan |  |
| Dimensional Disappearance | 10 | magus | passive | no plan |  |
| Crushing Grab | 2 | monk | passive | no plan |  |
| Dancing Leaf | 2 | monk | passive | no plan |  |
| Elemental Fist | 2 | monk | passive | no plan |  |
| Guarded Movement | 4 | monk | passive | no plan |  |
| Return Fire | 6 | monk | passive | no plan |  |
| Water Step | 6 | monk | passive | no plan |  |
| Projectile Snatching | 8 | monk | passive | no plan |  |
| Entwined Energy Ki | 10 | monk | passive | no plan |  |
| Improved Knockback | 12 | monk | passive | no plan |  |
| One-Millimeter Punch | 16 | monk | passive | no plan |  |
| Diamond Fists | 18 | monk | passive | no plan |  |
| Enduring Quickness | 20 | monk | passive | no plan |  |
| Immortal Techniques | 20 | monk | passive | plan | a passive's roll with no action to use it |
| The Hallowed Dead | 1 | necromancer | passive | no plan |  |
| The Unholy Dead | 1 | necromancer | passive | no plan |  |
| Bloody Tendrils | 6 | necromancer | passive | plan | a spell the engine doesn't cast (Bloody Tendrils) |
| Endless Return | 12 | necromancer | passive | no plan |  |
| Reanimate Foe | 18 | necromancer | passive | plan | a spell the engine doesn't cast (Reanimate Foe) |
| Final Union | 20 | necromancer | passive | no plan |  |
| Bestiary Secrets | 1 | other | passive | no plan |  |
| The Harder They Fall (Hellknight) | 1 | other | passive | plan | a passive's Effect posted by hand |
| Binds That Tie | 2 | other | passive | no plan |  |
| Cutting Rebuke | 4 | other | passive | no plan |  |
| Devil's Eye | 4 | other | passive | no plan |  |
| Unending Subsistence | 4 | other | passive | no plan |  |
| Elysium's Cadence | 6 | other | passive | no plan |  |
| Fling Into Action | 6 | other | passive | no plan |  |
| Mythic Allies | 8 | other | passive | plan | a passive's Effect on other creatures |
| Windborne Shove | 8 | other | passive | no plan |  |
| Disperse Into Petals | 10 | other | passive | no plan |  |
| Avenger of Envy | 14 | other | passive | no plan |  |
| Avenger of Gluttony | 14 | other | passive | no plan |  |
| Avenger of Lust | 14 | other | passive | no plan |  |
| Avenger of Wrath | 14 | other | passive | no plan |  |
| Avoid Fate's Gaze | 14 | other | passive | no plan |  |
| Decree of Banishment | 14 | other | passive | no plan |  |
| Heroic Weakness | 14 | other | passive | no plan |  |
| Jousting Mount | 14 | other | passive | no plan |  |
| Steadfast Grip | 14 | other | passive | no plan |  |
| Bolstered Recovery | 16 | other | passive | no plan |  |
| Echoing Fury | 16 | other | passive | no plan |  |
| Gird Champion | 16 | other | passive | no plan |  |
| Let Death be my Weapon | 16 | other | passive | no plan |  |
| Marshall Fiendish Forces | 16 | other | passive | no plan |  |
| Momentary Respite | 16 | other | passive | plan | a passive's roll with no action to use it |
| Terrifying Mien | 16 | other | passive | plan | its Effect has nothing a fight counts |
| Vigorous Victor | 16 | other | passive | no plan |  |
| Walk on the Wind | 16 | other | passive | no plan |  |
| Mythic Weapon Specialization | 18 | other | passive | no plan |  |
| Not This Time | 18 | other | passive | plan | a reaction to "passive" |
| Rebellious Existence | 18 | other | passive | no plan |  |
| Unstoppable Force | 18 | other | passive | plan | a reaction to "passive" |
| Craft Runewell | 20 | other | passive | no plan |  |
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
| The Harder They Fall (Kingmaker) | 8 | ranger | passive | no plan |  |
| Giant Slayer | 16 | ranger | passive | plan | a reaction to "passive" |
| Improved Twin Riposte (Ranger) | 16 | ranger | passive | no plan |  |
| Overextending Feint | 1 | rogue | passive | no plan |  |
| Tumble Behind (Rogue) | 1 | rogue | passive | no plan |  |
| Distracting Feint | 2 | rogue | passive | no plan |  |
| Strong Arm | 2 | rogue | passive | no plan |  |
| Twin Distraction | 4 | rogue | passive | no plan |  |
| Far Throw | 6 | rogue | passive | no plan |  |
| Light Step | 6 | rogue | passive | no plan |  |
| Sly Disarm | 6 | rogue | passive | no plan |  |
| Ambushing Knockdown | 8 | rogue | passive | plan | a passive's Strike |
| Improved Poison Weapon | 8 | rogue | passive | no plan |  |
| Eldritch Debilitations | 10 | rogue | passive | no plan |  |
| Heartless Debilitations | 10 | rogue | passive | no plan |  |
| Methodical Debilitations | 10 | rogue | passive | no plan |  |
| Nimble Strike | 10 | rogue | passive | no plan |  |
| Precise Debilitations | 10 | rogue | passive | no plan |  |
| Tactical Debilitations | 10 | rogue | passive | plan | a passive's Effect on other creatures |
| Vicious Debilitations | 10 | rogue | passive | plan | a passive's Effect on other creatures |
| Bloody Debilitation | 12 | rogue | passive | no plan |  |
| Critical Debilitation | 12 | rogue | passive | no plan |  |
| Deadly Poison Weapon | 12 | rogue | passive | no plan |  |
| Ricochet Feint | 12 | rogue | passive | no plan |  |
| Leave an Opening | 14 | rogue | passive | no plan |  |
| Cloud Step | 16 | rogue | passive | no plan |  |
| Smithing Weapons | 1 | runesmith | passive | no plan |  |
| Propelling Sorcery | 2 | sorcerer | passive | no plan |  |
| Explosion of Power | 8 | sorcerer | passive | no plan |  |
| Blood Sovereignty | 12 | sorcerer | passive | no plan |  |
| Consume Spell | 14 | sorcerer | passive | no plan |  |
| Reflect Harm | 14 | sorcerer | passive | no plan |  |
| Bloodline Mutation | 20 | sorcerer | passive | no plan |  |
| Goading Feint | 1 | swashbuckler | passive | no plan |  |
| Plummeting Roll | 1 | swashbuckler | passive | no plan |  |
| Antagonize | 2 | swashbuckler | passive | no plan |  |
| Tumble Behind (Swashbuckler) | 2 | swashbuckler | passive | no plan |  |
| Reflexive Riposte | 10 | swashbuckler | passive | no plan |  |
| Impossible Riposte | 14 | swashbuckler | passive | no plan |  |
| Felicitous Riposte | 16 | swashbuckler | passive | no plan |  |
| Inexhaustible Countermoves | 20 | swashbuckler | passive | no plan |  |
| Shared Warding | 12 | thaumaturge | passive | plan | an Effect on another creature |
| Grand Scroll Esoterica | 18 | thaumaturge | passive | no plan |  |
| Syu Tak-nwa's Deadly Hair | 6 | witch | passive | no plan |  |
| Witch's Hut | 20 | witch | passive | no plan |  |
| Spell Combination | 20 | wizard | passive | no plan |  |

## Spellcasting (slots, focus, spellshapes) (308)

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
| Crystal Ward Spells | 4 | archetype | passive | no plan |  |
| Dousing Spell | 4 | archetype | 1 action | no plan |  |
| Gusting Spell | 4 | archetype | 1 action | no plan |  |
| Hallowed Initiate | 4 | archetype | passive | no plan |  |
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
| Thrall Charger | 4 | archetype | passive | no plan |  |
| Wayfinder Resonance Tinkerer | 4 | archetype | passive | no plan |  |
| Wyldsinger | 4 | archetype | passive | no plan |  |
| Basic Magus Spellcasting | 6 | archetype | passive | no plan |  |
| Beastmaster's Trance | 6 | archetype | passive | no plan |  |
| Cascade Bearer's Flexibility | 6 | archetype | free | no plan |  |
| Heightened Captivation | 6 | archetype | 1 action | no plan |  |
| Humble Spell | 6 | archetype | 1 action | no plan |  |
| Night's Glow | 6 | archetype | passive | no plan |  |
| Red Mantis School Spell | 6 | archetype | passive | no plan |  |
| Sinbladed Spell | 6 | archetype | 1 action | no plan |  |
| Siphon Magic | 6 | archetype | 1 action | no plan |  |
| Spiritual Secret | 6 | archetype | free | no plan |  |
| Tempest-Sun Redirection | 6 | archetype | 1 action | no plan |  |
| Urgent Upwelling | 6 | archetype | reaction | no plan |  |
| Vengeful Spirit Deck | 6 | archetype | 2 actions | no plan |  |
| Wisteria-and-Peony Reunion | 6 | archetype | free | no plan |  |
| Advanced Hallowed Spell | 8 | archetype | passive | no plan |  |
| Anthemic Performance | 8 | archetype | passive | no plan |  |
| Apparition Magic | 8 | archetype | passive | no plan |  |
| Basic Beast Gunner Spellcasting | 8 | archetype | passive | no plan |  |
| Basic Eldritch Archer Spellcasting | 8 | archetype | passive | no plan |  |
| Blessed Spell | 8 | archetype | 1 action | no plan |  |
| Chronomancer's Secrets | 8 | archetype | passive | no plan |  |
| Countercharm | 8 | archetype | reaction | no plan |  |
| Enhance Spell | 8 | archetype | 1 action | no plan |  |
| Glimpse the Netherworld | 8 | archetype | passive | no plan |  |
| Mantis Form | 8 | archetype | passive | plan | a spell the engine doesn't cast (Mantis Form) |
| Primal Guardian | 8 | archetype | passive | no plan |  |
| Shadow Spell | 8 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Shielding Formation | 8 | archetype | passive | plan | a spell the engine doesn't cast (Shielding Formation) |
| Simple Mastery | 8 | archetype | 1 action | no plan |  |
| What Could Have Been | 8 | archetype | free | no plan |  |
| Cascade Bearer's Spellcasting | 10 | archetype | passive | no plan |  |
| Eldritch Reload | 10 | archetype | free | no plan |  |
| Expert Skysage Divination | 10 | archetype | passive | no plan |  |
| Greater Deathly Secrets | 10 | archetype | passive | no plan |  |
| Halcyon Spellcasting Initiate | 10 | archetype | passive | no plan |  |
| Into the Future | 10 | archetype | 1 action | no plan |  |
| Recover Spell | 10 | archetype | 1 action | no plan |  |
| Rockslide Spell | 10 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Shadow Magic | 10 | archetype | passive | no plan |  |
| Shadow Reservoir | 10 | archetype | passive | no plan |  |
| Spellmaster's Ward | 10 | archetype | passive | plan | a spell the engine doesn't cast (Spellmaster's Ward) |
| Tempest-Sun Shielding | 10 | archetype | reaction | no plan |  |
| Vindicator's Judgment | 10 | archetype | passive | plan | a spell the engine doesn't cast (Vindicator's Judgment) |
| Additional Shadow Magic | 12 | archetype | passive | no plan |  |
| Afterimage | 12 | archetype | free | plan | a timer with no rules a fight counts |
| Battlefield Arcana | 12 | archetype | passive | no plan |  |
| Expert Hedge Mage Spellcasting | 12 | archetype | passive | no plan |  |
| Flexible Halcyon Spellcasting | 12 | archetype | passive | no plan |  |
| Interfering Surge | 12 | archetype | reaction | no plan |  |
| Maneuvering Spell | 12 | archetype | free | plan | a teleport |
| Night's Shine | 12 | archetype | passive | no plan |  |
| Shadow Illusion | 12 | archetype | passive | no plan |  |
| Six Pillars Stance | 12 | archetype | 1 action | plan | its requirement, which the PC doesn't meet (You are unarmored.) |
| Sunless Slide | 12 | archetype | 2 actions | plan | a teleport |
| Surging Blood Magic | 12 | archetype | passive | no plan |  |
| Absorb Spell | 14 | archetype | reaction | no plan |  |
| Community Needs | 14 | archetype | passive | no plan |  |
| Halcyon Spellcasting Adept | 14 | archetype | passive | no plan |  |
| Shattered Sacrament | 14 | archetype | passive | no plan |  |
| Wind-Tossed Spell | 14 | archetype | 1 action | no plan |  |
| Branding Spell | 16 | archetype | free | no plan |  |
| Disciple's Breath | 16 | archetype | 2 actions | no plan |  |
| Heraldic Proclamation | 16 | archetype | 1 action | no plan |  |
| Master Skysage Divination | 16 | archetype | passive | no plan |  |
| Master's Counterspell | 16 | archetype | reaction | no plan |  |
| Quickened Attunement | 16 | archetype | free | no plan |  |
| Spell Gem | 16 | archetype | passive | no plan |  |
| Touch Focus | 16 | archetype | free | no plan |  |
| Vellumis Excision | 16 | archetype | passive | no plan |  |
| Exultant Blood Magic | 18 | archetype | passive | no plan |  |
| Halcyon Spellcasting Sage | 18 | archetype | passive | no plan |  |
| Marked for Rebuke | 18 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Master Hedge Mage Spellcasting | 18 | archetype | passive | no plan |  |
| Retain Absorbed Spell | 18 | archetype | passive | no plan |  |
| Tripartite Omen | 18 | archetype | passive | no plan |  |
| Synergistic Spell | 20 | archetype | 1 action | no plan |  |
| Lingering Composition | 1 | bard | passive | plan | a spell the engine doesn't cast (Lingering Composition) |
| Song of Strength | 2 | bard | passive | no plan |  |
| Uplifting Overture | 2 | bard | passive | no plan |  |
| Courageous Advance | 4 | bard | 1 action | no plan |  |
| In Tune | 4 | bard | 1 action | no plan |  |
| Rallying Anthem | 4 | bard | passive | no plan |  |
| Triple Time | 4 | bard | passive | no plan |  |
| Defensive Coordination | 6 | bard | 1 action | no plan |  |
| Dirge of Doom | 6 | bard | passive | no plan |  |
| Harmonize | 6 | bard | 1 action | no plan |  |
| Song of Marching | 6 | bard | passive | no plan |  |
| Accompany | 8 | bard | reaction | no plan |  |
| Call and Response | 8 | bard | 1 action | no plan |  |
| Chaotic Spell | 8 | bard | 1 action | plan | a choice of ways the simulator doesn't play |
| Fortissimo Composition | 8 | bard | passive | plan | a spell the engine doesn't cast (Fortissimo Composition) |
| Helt's Spelldance | 8 | bard | 3 actions | no plan |  |
| Courageous Assault | 10 | bard | 1 action | no plan |  |
| House of Imaginary Walls | 10 | bard | passive | no plan |  |
| Unusual Composition | 10 | bard | 1 action | no plan |  |
| Shared Sight | 12 | bard | 1 action | plan | a timer with no rules a fight counts |
| Silver's Refrain | 12 | bard | passive | no plan |  |
| Allegro | 14 | bard | passive | no plan |  |
| Vigorous Anthem | 14 | bard | 1 action | no plan |  |
| Studious Capacity | 16 | bard | passive | no plan |  |
| Eternal Composition | 18 | bard | passive | no plan |  |
| Perfect Encore | 20 | bard | passive | no plan |  |
| Desperate Prayer | 1 | champion | free | no plan |  |
| Splinter Faith | 1 | champion | passive | no plan |  |
| Retributive Focus | 18 | champion | free | plan | a Focus or Mythic Point back |
| Command Undead | 4 | cleric | 1 action | no plan |  |
| Divine Infusion | 4 | cleric | 1 action | no plan |  |
| Prayer-Touched Weapon | 4 | cleric | free | no plan |  |
| Cast Down | 6 | cleric | 1 action | no plan |  |
| Detonating Spell | 6 | cleric | 1 action | no plan |  |
| Martyr | 8 | cleric | 1 action | no plan |  |
| Surging Focus | 8 | cleric | free | plan | a Focus or Mythic Point back |
| Consecrate Spell | 10 | cleric | 1 action | plan | a choice of ways the simulator doesn't play |
| Heroic Recovery | 10 | cleric | 1 action | no plan |  |
| Shield of Faith | 10 | cleric | passive | no plan |  |
| Through Spell | 10 | cleric | 1 action | no plan |  |
| Defensive Recovery | 12 | cleric | 1 action | no plan |  |
| Ebb and Flow | 14 | cleric | 1 action | no plan |  |
| Sepulchral Sublimation | 14 | cleric | 1 action | no plan |  |
| Remediate | 16 | cleric | free | no plan |  |
| Improved Swift Banishment | 18 | cleric | passive | no plan |  |
| Maker of Miracles | 20 | cleric | passive | no plan |  |
| Spellshape Channel | 20 | cleric | free | no plan |  |
| Cryptic Spell | 4 | druid | 1 action | no plan |  |
| Form Control | 4 | druid | 1 action | no plan |  |
| Snowdrift Spell | 4 | druid | 1 action | plan | a timer with no rules a fight counts |
| Storm Retribution | 6 | druid | reaction | plan | a spell the feat casts |
| Healing Transformation | 10 | druid | 1 action | no plan |  |
| Overwhelming Energy | 10 | druid | 1 action | no plan |  |
| Plant Shape | 10 | druid | passive | no plan |  |
| Thunderclap Spell | 10 | druid | 1 action | plan | a timer with no rules a fight counts |
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
| Shattering Spellstrike | 4 | magus | 2 actions | no plan |  |
| Steady Spellcasting (Magus) | 4 | magus | passive | no plan |  |
| Student of the Staff | 4 | magus | passive | no plan |  |
| Shielded Tome | 6 | magus | passive | no plan |  |
| Spell Crash | 6 | magus | 2 actions | no plan |  |
| Standby Spell | 8 | magus | passive | no plan |  |
| Whirlpool's Pull | 8 | magus | 1 action | no plan |  |
| Lunging Spellstrike | 10 | magus | 2 actions | no plan |  |
| Meteoric Spellstrike | 10 | magus | 2 actions | no plan |  |
| Sustaining Steel | 10 | magus | free | no plan |  |
| Vermillion Threads | 10 | magus | reaction | plan | a lasting area |
| Overwhelming Breath | 12 | monk | 1 action | no plan |  |
| Qi Center | 18 | monk | free | no plan |  |
| Reach of the Dead | 1 | necromancer | free | no plan |  |
| Vampiric Spell | 4 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Conjurer of Corpses | 6 | necromancer | passive | no plan |  |
| Infuse Void | 8 | necromancer | 1 action | no plan |  |
| Overburdening Spell | 10 | necromancer | 1 action | no plan |  |
| Skeletal Extension | 10 | necromancer | free | no plan |  |
| Unholy Resurrection | 14 | necromancer | passive | no plan |  |
| Beckoning Dirge | 16 | necromancer | free | no plan |  |
| Mortem Ultimatum | 20 | necromancer | passive | no plan |  |
| Foretell Harm | 1 | oracle | free | no plan |  |
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
| Mythic Magic | 8 | other | passive | no plan |  |
| Mythic Casting | 10 | other | 1 action | no plan |  |
| Mythic Heightening | 14 | other | 1 action | no plan |  |
| Reliable Magic | 14 | other | passive | no plan |  |
| Shining Runes | 14 | other | passive | no plan |  |
| Willing Runes | 14 | other | passive | no plan |  |
| Cleansing Spell | 16 | other | 1 action | no plan |  |
| Daunting Spell | 16 | other | passive | no plan |  |
| Imbue Spell | 16 | other | free | no plan |  |
| Mystical Flare | 16 | other | 1 action | plan | a timer with no rules a fight counts |
| Recharging Transference | 16 | other | 1 action | no plan |  |
| Thundering Surge | 16 | other | 1 action | plan | its requirement (Your @UUID[Compendium.pf2e.spells-srd.Item.Spellsurge] aura is active) |
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
| Minor Magic | 2 | rogue | passive | no plan |  |
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
| Scintillating Spell | 16 | sorcerer | 1 action | plan | a timer with no rules a fight counts |
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
| Forcible Energy | 12 | wizard | 1 action | no plan |  |
| Redirect Teleportation | 12 | wizard | reaction | no plan |  |
| Dizzying Spell | 14 | wizard | 1 action | plan | a timer with no rules a fight counts |
| Secondary Detonation Array | 14 | wizard | 1 action | no plan |  |
| Second Thoughts | 18 | wizard | reaction | plan | a timer with no rules a fight counts |
| Archwizard's Might | 20 | wizard | passive | no plan |  |
| Reclaim Spell | 20 | wizard | passive | no plan |  |
| Worldsphere Gravity | 20 | wizard | 1 action | plan | a lasting area |

## Companions, familiars and eidolons (246)

| Feat | Lvl | Class | Type | Feat module | Simulator's reason |
|---|---:|---|---|---|---|
| Alchemical Familiar | 1 | alchemist | passive | no plan |  |
| Enhanced Familiar | 2 | animist | passive | no plan |  |
| Incredible Familiar (Animist) | 10 | animist | passive | no plan |  |
| Apparition Cloud | 12 | animist | reaction | plan | a timer with no rules a fight counts |
| Additional Companion | 4 | archetype | passive | no plan |  |
| Advanced Reanimated Companion | 4 | archetype | passive | no plan |  |
| Basic Animist Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Summoner Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Witch Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Witchcraft | 4 | archetype | passive | no plan |  |
| Born in the Saddle | 4 | archetype | passive | plan | a passive's Effect posted by hand |
| Cavalier's Banner | 4 | archetype | passive | plan | a passive's Effect on other creatures |
| Cavalier's Charge | 4 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Demon-Hunting Companion | 4 | archetype | passive | no plan |  |
| Elemental Familiar | 4 | archetype | passive | no plan |  |
| Familiar Conduit | 4 | archetype | 1 action | no plan |  |
| Heal Animal | 4 | archetype | passive | no plan |  |
| Impressive Mount | 4 | archetype | passive | no plan |  |
| Initial Eidolon Ability | 4 | archetype | passive | no plan |  |
| Mature Beastmaster Companion | 4 | archetype | passive | no plan |  |
| Mature Dragon Companion | 4 | archetype | passive | no plan |  |
| Pirate's Pet | 4 | archetype | passive | no plan |  |
| Psychopomp Familiar | 4 | archetype | passive | no plan |  |
| Reckless Riding Lunge | 4 | archetype | 1 action | no plan |  |
| Repel Darkness | 4 | archetype | 2 actions | plan | a timer with no rules a fight counts |
| Ride-By Recovery | 4 | archetype | reaction | no plan |  |
| Spirit Companion | 4 | archetype | passive | no plan |  |
| Spirit of the Beast | 4 | archetype | passive | plan | a spell the engine doesn't cast (Spirit of the Beast) |
| Spiritual Explorer | 4 | archetype | passive | no plan |  |
| Winged Leap | 4 | archetype | passive | no plan |  |
| Adaptive Mask Familiar | 6 | archetype | passive | no plan |  |
| Bestial Protection | 6 | archetype | passive | no plan |  |
| Defend Mount | 6 | archetype | reaction | no plan |  |
| Draconic Familiar | 6 | archetype | passive | no plan |  |
| Familiar's Resolve | 6 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Flair Rider Stance | 6 | archetype | 1 action | plan | its Effect has nothing a fight counts |
| Fulu Familiar | 6 | archetype | passive | no plan |  |
| Improved Familiar (Familiar Master) | 6 | archetype | passive | no plan |  |
| It's Alive! | 6 | archetype | passive | no plan |  |
| Let My Creature Live! | 6 | archetype | passive | no plan |  |
| Mature Megafauna Companion | 6 | archetype | passive | no plan |  |
| Mature Trained Companion | 6 | archetype | passive | no plan |  |
| Mounted Shield | 6 | archetype | passive | no plan |  |
| Nature's Precision | 6 | archetype | passive | no plan |  |
| Spiritual Strike | 6 | archetype | 2 actions | plan | its requirement (You are wielding a weapon with at least one fundamental rune and your familiar is adjacent to you or in |
| Swift Guardian | 6 | archetype | free | no plan |  |
| Swift Support | 6 | archetype | passive | plan | a passive's Effect on other creatures |
| Tempest Cloud's Speed | 6 | archetype | passive | no plan |  |
| Tenacious Endurance | 6 | archetype | passive | plan | a passive's roll with no action to use it |
| Vaulting Gallop | 6 | archetype | 2 actions | no plan |  |
| War Rider Stance | 6 | archetype | 1 action | no plan |  |
| Behold My Creation! | 8 | archetype | passive | no plan |  |
| Dismounting Strike | 8 | archetype | 1 action | plan | its requirement (You are mounted on your horse, and your last action was to Command an Animal to order your horse to Str |
| Enhanced Psychopomp Familiar | 8 | archetype | passive | no plan |  |
| Familiar Form | 8 | archetype | passive | plan | a spell the engine doesn't cast (Familiar Form) |
| Familiar Ritualist | 8 | archetype | passive | no plan |  |
| Future Spell Learning | 8 | archetype | passive | no plan |  |
| Golden Dragon's Bounty | 8 | archetype | 1 action | plan | a choice of ways the simulator doesn't play |
| Guardian Ghosts | 8 | archetype | reaction | no plan |  |
| Improved Command Corpse | 8 | archetype | passive | no plan |  |
| Incredible Beastmaster Companion | 8 | archetype | passive | no plan |  |
| Incredible Dragon Companion | 8 | archetype | passive | no plan |  |
| Incredible Megafauna Companion | 8 | archetype | passive | no plan |  |
| Incredible Mount | 8 | archetype | passive | no plan |  |
| Incredible Reanimated Companion | 8 | archetype | passive | no plan |  |
| Lightning Rings' Intervention | 8 | archetype | passive | no plan |  |
| Mutable Familiar | 8 | archetype | passive | no plan |  |
| Orator's Filibuster | 8 | archetype | passive | plan | a reaction to "passive" |
| Out of Hand | 8 | archetype | passive | no plan |  |
| Pack Movement | 8 | archetype | 2 actions | plan | its text has no Strike of its user's |
| Ferocious Charge | 10 | archetype | passive | plan | a passive's Strike |
| Grief's Fury | 10 | archetype | reaction | plan | an Effect with nothing a fight counts |
| Incredible Familiar (Familiar Master) | 10 | archetype | passive | no plan |  |
| Running Kick | 10 | archetype | passive | plan | a passive's Strike |
| Seal of the Golden Dragon | 10 | archetype | reaction | plan | a timer with no rules a fight counts |
| Sinking Jaws | 10 | archetype | passive | plan | a passive's roll with no action to use it |
| Sweeping Tail | 10 | archetype | passive | plan | a passive's Strike |
| Trampling Charge | 10 | archetype | 3 actions | no plan |  |
| Unbreakable Bond | 10 | archetype | passive | no plan |  |
| Unseat | 10 | archetype | 1 action | plan | its requirement (You are riding your mount and wielding a jousting weapon.) |
| Vicious Rend | 10 | archetype | passive | plan | a passive's Strike |
| Death Dive | 12 | archetype | 3 actions | plan | its text has no Strike of its user's |
| Expert Combat Eidolon | 12 | archetype | passive | no plan |  |
| Lightning Rings' Overcharge | 12 | archetype | passive | no plan |  |
| Pupil's Guard | 12 | archetype | reaction | no plan |  |
| Rearing Display | 12 | archetype | 1 action | plan | its requirement (You are riding your mount) |
| Shadowpiercing Charge | 12 | archetype | 3 actions | plan | its requirement (You're riding your horse and wielding a melee weapon.) |
| Splendid Companion | 12 | archetype | passive | no plan |  |
| Strafing Breath | 12 | archetype | 3 actions | no plan |  |
| Their Master's Call | 12 | archetype | 1 action | no plan |  |
| Vexing Tempest | 12 | archetype | 1 action | no plan |  |
| A Miracle of Science! | 14 | archetype | passive | no plan |  |
| Drain Soul Cage | 14 | archetype | passive | no plan |  |
| Guided Hover | 14 | archetype | reaction | no plan |  |
| Improved Hijack Undead | 14 | archetype | passive | no plan |  |
| Paragon Reanimated Companion | 14 | archetype | passive | no plan |  |
| Signature Synergy | 14 | archetype | passive | no plan |  |
| Specialized Mount | 14 | archetype | passive | no plan |  |
| Specialized Spirit Companion | 14 | archetype | passive | no plan |  |
| Gallop Across Shadow | 16 | archetype | passive | no plan |  |
| Phoenix's Flight | 16 | archetype | passive | no plan |  |
| Specialized Companion (Animal Trainer) | 18 | archetype | passive | no plan |  |
| Legendary Rider | 20 | archetype | passive | no plan |  |
| Zombie Horde | 20 | archetype | 3 actions | plan | its text has no Strike of its user's |
| Chorus Companion | 12 | bard | passive | no plan |  |
| Faithful Steed | 1 | champion | passive | no plan |  |
| Chiardmar Steed | 6 | champion | passive | no plan |  |
| Loyal Warhorse | 6 | champion | passive | no plan |  |
| Nidarrmar Steed | 6 | champion | passive | no plan |  |
| Faithful Stride | 8 | champion | 2 actions | no plan |  |
| Heal Mount | 8 | champion | passive | no plan |  |
| Imposing Destrier | 10 | champion | passive | no plan |  |
| Pale Horse | 12 | champion | passive | plan | a passive's Effect on other creatures |
| Steed's Toppling Strike | 12 | champion | 1 action | plan | its text has no Strike of its user's |
| Auspicious Mount | 16 | champion | passive | no plan |  |
| Swift Paragon | 20 | champion | passive | no plan |  |
| Improved Command Undead | 10 | cleric | passive | no plan |  |
| Commander's Companion | 1 | commander | passive | no plan |  |
| Battle-Tested Companion | 6 | commander | passive | no plan |  |
| Battle-Hardened Companion | 10 | commander | passive | no plan |  |
| Peerless Mascot Companion | 16 | commander | passive | no plan |  |
| Animal Companion | 1 | druid | passive | no plan |  |
| Leshy Familiar | 1 | druid | passive | no plan |  |
| Leshy Familiar Secrets | 4 | druid | passive | no plan |  |
| Mature Animal Companion (Druid) | 4 | druid | passive | no plan |  |
| Instinctive Support | 6 | druid | free | no plan |  |
| Incredible Companion (Druid) | 8 | druid | passive | no plan |  |
| Primal Howl | 10 | druid | passive | no plan |  |
| Side by Side (Druid) | 10 | druid | passive | no plan |  |
| Garland Spell | 12 | druid | 1 action | plan | a lasting area |
| Green Tongue | 12 | druid | passive | no plan |  |
| Specialized Companion (Druid) | 14 | druid | passive | no plan |  |
| Bullet and a Broadside | 2 | gunslinger | 1 action | plan | a Strike with nothing more the simulator reads |
| No! No! I Created You! | 1 | inventor | reaction | no plan |  |
| Prototype Companion | 1 | inventor | passive | no plan |  |
| Collapse Construct | 2 | inventor | 1 action | no plan |  |
| Advanced Construct Companion | 4 | inventor | passive | no plan |  |
| Duo Dragon Kick | 4 | inventor | 2 actions | no plan |  |
| Incredible Construct Companion | 8 | inventor | passive | no plan |  |
| Paragon Companion | 14 | inventor | passive | no plan |  |
| Underworld Investigator | 1 | investigator | passive | no plan |  |
| Fearsome Familiar | 6 | kineticist | 3 actions | no plan |  |
| Familiar | 1 | magus | passive | no plan |  |
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
| Pack of the Beast Lord | 18 | other | 3 actions | plan | a timer with no rules a fight counts |
| Animal Companion (Ranger) | 1 | ranger | passive | no plan |  |
| Heal Companion | 1 | ranger | passive | no plan |  |
| Companion's Cry | 4 | ranger | passive | no plan |  |
| Galloping Launch | 4 | ranger | 1 action | plan | its requirement (You're mounted, and your mount moved closer to your prey this round.) |
| Natural Conduit | 4 | ranger | 1 action | no plan |  |
| Mature Animal Companion (Ranger) | 6 | ranger | passive | no plan |  |
| Incredible Companion (Ranger) | 10 | ranger | passive | no plan |  |
| Side by Side (Ranger) | 12 | ranger | passive | no plan |  |
| Stealthy Companion | 14 | ranger | passive | no plan |  |
| Specialized Companion (Ranger) | 16 | ranger | passive | no plan |  |
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
| Unfetter Eidolon | 1 | summoner | passive | no plan |  |
| Alacritous Action | 2 | summoner | passive | no plan |  |
| Amphibious Form | 2 | summoner | passive | no plan |  |
| Magical Understudy | 2 | summoner | passive | no plan |  |
| Ranged Combatant | 2 | summoner | passive | no plan |  |
| Reinforce Eidolon | 2 | summoner | passive | no plan |  |
| Steed Form | 2 | summoner | passive | no plan |  |
| Bloodletting Claws | 4 | summoner | passive | no plan |  |
| Dual Energy Heart | 4 | summoner | passive | no plan |  |
| Lifelink Surge | 4 | summoner | passive | plan | a spell the engine doesn't cast (Lifelink Surge) |
| Reactive Dismissal | 4 | summoner | reaction | no plan |  |
| Shrink Down | 4 | summoner | 1 action | no plan |  |
| Skilled Partner | 4 | summoner | passive | no plan |  |
| Tandem Movement | 4 | summoner | 1 action | no plan |  |
| Vibration Sense | 4 | summoner | passive | no plan |  |
| Blood Frenzy | 6 | summoner | passive | no plan |  |
| Eidolon's Retort | 6 | summoner | reaction | plan | a reaction's Strike |
| Ostentatious Arrival | 6 | summoner | free | no plan |  |
| Phase Out | 6 | summoner | 3 actions | plan | an Effect on another creature |
| Tandem Strike | 6 | summoner | 2 actions | plan | a companion's Strike |
| Boost Summons | 8 | summoner | passive | no plan |  |
| Energy Resistance | 8 | summoner | passive | no plan |  |
| Hulking Size | 8 | summoner | passive | no plan |  |
| Magical Adept | 8 | summoner | passive | no plan |  |
| Miniaturize | 8 | summoner | passive | no plan |  |
| Protective Pose | 8 | summoner | 2 actions | plan | an Effect with nothing a fight counts |
| Surprising Leap | 8 | summoner | 2 actions | plan | a companion's Strike |
| Burrowing Form | 10 | summoner | passive | no plan |  |
| Magical Onslaught | 10 | summoner | 2 actions | plan | a companion's Strike |
| Merciless Rend | 10 | summoner | 1 action | no plan |  |
| Nimble Form | 10 | summoner | passive | no plan |  |
| Protective Bond | 10 | summoner | reaction | no plan |  |
| Pushing Attack | 10 | summoner | passive | no plan |  |
| Transpose | 10 | summoner | 1 action | no plan |  |
| Weighty Impact | 10 | summoner | passive | no plan |  |
| Airborne Form | 12 | summoner | passive | no plan |  |
| Grasping Limbs | 12 | summoner | passive | no plan |  |
| Summoner's Call | 12 | summoner | reaction | no plan |  |
| Towering Size | 12 | summoner | passive | no plan |  |
| Guiding Retort | 14 | summoner | passive | no plan |  |
| Piercing Jab | 14 | summoner | 2 actions | plan | a companion's Strike |
| Resilient Shell | 14 | summoner | passive | no plan |  |
| Share Eidolon Magic | 14 | summoner | passive | no plan |  |
| Eidolon's Trample | 16 | summoner | 3 actions | no plan |  |
| Ever-Vigilant Senses | 16 | summoner | passive | no plan |  |
| Hobbling Criticals | 18 | summoner | passive | plan | a reaction to "own-strike" |
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

## Out of combat (exploration, downtime, skills) (346)

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
| Spirit Familiar (Animist) | 1 | animist | passive | no plan |  |
| Spirit Walk | 8 | animist | passive | no plan |  |
| Apparition's Quickening | 10 | animist | free | no plan |  |
| Advanced Alchemy | 4 | archetype | passive | no plan |  |
| Aeon Resonance | 4 | archetype | passive | no plan |  |
| Analyze Magic | 4 | archetype | passive | no plan |  |
| Animal Actor | 4 | archetype | passive | no plan |  |
| Arcane School Spell | 4 | archetype | passive | no plan |  |
| Basic Bloodline Spell | 4 | archetype | passive | no plan |  |
| Basic Red Mantis Magic | 4 | archetype | passive | no plan |  |
| Blessing of the Sun Gods | 4 | archetype | passive | no plan |  |
| Broadside Buckos | 4 | archetype | passive | no plan |  |
| Cathartic Focus Spell | 4 | archetype | passive | no plan |  |
| Diabolic Usurpation | 4 | archetype | passive | no plan |  |
| Emissary Familiar | 4 | archetype | passive | no plan |  |
| Eye for Weakness | 4 | archetype | passive | no plan |  |
| First Revelation | 4 | archetype | passive | no plan |  |
| Folktales Lore | 4 | archetype | passive | no plan |  |
| Gossip Lore | 4 | archetype | passive | no plan |  |
| Grave's Voice | 4 | archetype | passive | no plan |  |
| Harsh Judgement | 4 | archetype | 1 action | no plan |  |
| Holy Bloom | 4 | archetype | passive | no plan |  |
| Hunter's Sanctum | 4 | archetype | passive | no plan |  |
| Hybrid Study Spell | 4 | archetype | passive | no plan |  |
| Ice Crafter | 4 | archetype | passive | no plan |  |
| Investigate Haunting | 4 | archetype | passive | no plan |  |
| Listener's Boon | 4 | archetype | passive | no plan |  |
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
| Seeker of Truths | 4 | archetype | passive | no plan |  |
| Special Sentinel Technique | 4 | archetype | passive | no plan |  |
| Surprise Snare | 4 | archetype | 3 actions | no plan |  |
| Tactile Magic Feedback | 4 | archetype | passive | no plan |  |
| The Taste of Magic | 4 | archetype | passive | no plan |  |
| Tracing Sigil | 4 | archetype | passive | no plan |  |
| Barricade Snare | 6 | archetype | passive | no plan |  |
| Basic Scroll Cache | 6 | archetype | passive | no plan |  |
| Brains! | 6 | archetype | free | plan | its Effect has nothing a fight counts |
| Counter Perform | 6 | archetype | passive | plan | a spell the engine doesn't cast (Counter Performance) |
| Cozy Campfire | 6 | archetype | passive | plan | a reaction to "passive" |
| Deathly Secrets | 6 | archetype | passive | no plan |  |
| Domain Spirit | 6 | archetype | passive | no plan |  |
| Food Preservation | 6 | archetype | passive | no plan |  |
| Hellknight Signifer Preferment | 6 | archetype | passive | no plan |  |
| Hero-God's Bond | 6 | archetype | passive | no plan |  |
| Illuminating Stories | 6 | archetype | passive | no plan |  |
| Inscribed with Elders' Deeds | 6 | archetype | passive | no plan |  |
| Interrogate | 6 | archetype | 1 action | plan | a roll whose results the simulator doesn't read |
| Liberty's Promise | 6 | archetype | passive | no plan |  |
| Magical Scrounger | 6 | archetype | passive | no plan |  |
| Mastermind's Eye | 6 | archetype | passive | plan | a passive's roll with no action to use it |
| Perfect Truths | 6 | archetype | passive | no plan |  |
| Perpetual Scout | 6 | archetype | passive | no plan |  |
| Practical Magic | 6 | archetype | passive | no plan |  |
| Psi Development | 6 | archetype | passive | no plan |  |
| Simple Crystal Magic | 6 | archetype | passive | plan | a spell the engine doesn't cast (Read Aura, Sigil) |
| Sun's Fury | 6 | archetype | passive | plan | a spell the engine doesn't cast (Sun's Fury) |
| Symphony of Agony | 6 | archetype | passive | no plan |  |
| Westyr's Wayfinder Repository | 6 | archetype | passive | no plan |  |
| Wild Speech | 6 | archetype | passive | no plan |  |
| Aroden's Innovation | 8 | archetype | passive | no plan |  |
| Call Gun | 8 | archetype | passive | no plan |  |
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
| Know Your Enemy | 8 | archetype | 1 action | no plan |  |
| Lethargy Poisoner | 8 | archetype | passive | no plan |  |
| Living for the Applause | 8 | archetype | reaction | no plan |  |
| Malleable Mental Forge | 8 | archetype | passive | no plan |  |
| Ooze Empathy | 8 | archetype | passive | no plan |  |
| Positive Luminance | 8 | archetype | passive | no plan |  |
| Sense Iniquity | 8 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Sin Reservoir | 8 | archetype | passive | no plan |  |
| Spelldrinker | 8 | archetype | 1 action | no plan |  |
| Spellshield | 8 | archetype | passive | no plan |  |
| Transcribe Moment | 8 | archetype | passive | plan | a spell the engine doesn't cast (Transcribe Moment) |
| Veil of Eternity | 8 | archetype | passive | no plan |  |
| Worm Empathy | 8 | archetype | passive | no plan |  |
| Armor Rune Shifter | 10 | archetype | passive | no plan |  |
| Beneath Notice | 10 | archetype | passive | no plan |  |
| Broad Snare | 10 | archetype | passive | no plan |  |
| Come In From the Wilderness | 10 | archetype | 2 actions | no plan |  |
| Cursebreaker | 10 | archetype | passive | no plan |  |
| Define “Report” | 10 | archetype | free | no plan |  |
| Eidetic Memorization | 10 | archetype | 3 actions | no plan |  |
| Emissary of Peace | 10 | archetype | 3 actions | no plan |  |
| Font of Knowledge | 10 | archetype | passive | no plan |  |
| Gather Disciples | 10 | archetype | passive | no plan |  |
| Know It All (Eldritch Researcher) | 10 | archetype | passive | no plan |  |
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
| Perfect Pitch | 12 | archetype | passive | no plan |  |
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
| Enigma's Knowledge | 12 | bard | passive | no plan |  |
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
| Mark of the Sage | 16 | exemplar | passive | no plan |  |
| Cutting Without Blade | 20 | exemplar | passive | no plan |  |
| Ultimate Flexibility | 20 | fighter | passive | no plan |  |
| Bodyguard | 1 | guardian | passive | no plan |  |
| Shield Salvation | 10 | guardian | passive | no plan |  |
| Munitions Crafter | 1 | gunslinger | passive | no plan |  |
| Fey Tracker | 6 | gunslinger | passive | no plan |  |
| Munitions Machinist | 6 | gunslinger | passive | no plan |  |
| Greenwatch Veteran | 8 | gunslinger | free | no plan |  |
| Gadget Specialist | 4 | inventor | passive | no plan |  |
| Xidao Sea Mine Drop | 6 | inventor | 2 actions | no plan |  |
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
| Just the Facts | 20 | investigator | passive | no plan |  |
| Elemental Familiar (Kineticist) | 1 | kineticist | passive | no plan |  |
| Voice of Elements | 2 | kineticist | passive | no plan |  |
| Igneogenesis | 4 | kineticist | 2 actions | no plan |  |
| Hedge Maze | 12 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Rapid Reattunement | 14 | kineticist | passive | no plan |  |
| Beasts of Slumbering Steel | 18 | kineticist | 3 actions | plan | a timer with no rules a fight counts |
| Raise a Tome | 1 | magus | passive | no plan |  |
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
| Distant Wandering | 10 | other | 1 action | plan | an Effect with nothing a fight counts |
| Avenger of Sloth | 14 | other | passive | no plan |  |
| Claim Cardinal Domains | 14 | other | passive | no plan |  |
| Consult Celestial Advisor | 14 | other | passive | no plan |  |
| Decree of Prosperity | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Guarded Domain | 14 | other | passive | no plan |  |
| I've Been Here Before | 14 | other | passive | no plan |  |
| Lord of the Fiends | 14 | other | 2 actions | plan | an Effect with nothing a fight counts |
| My Reputation Precedes Me | 14 | other | passive | no plan |  |
| Myth of Quick-Thinking | 14 | other | passive | no plan |  |
| Receive Prayers | 14 | other | passive | no plan |  |
| Reincarnated Companion | 14 | other | passive | no plan |  |
| Rites of Liberation | 14 | other | passive | no plan |  |
| Transmute Weapon | 14 | other | passive | no plan |  |
| United Front | 14 | other | passive | no plan |  |
| Warshard Rune | 14 | other | passive | no plan |  |
| A Thousand Cries for Help | 16 | other | passive | no plan |  |
| Autonomous Arms | 16 | other | passive | no plan |  |
| Celestial Armaments | 16 | other | passive | plan | a reaction to "passive" |
| Eyes Unclouded | 18 | other | passive | no plan |  |
| Profane Bargain | 18 | other | 3 actions | plan | a timer with no rules a fight counts |
| Sanctified Relic | 18 | other | passive | no plan |  |
| One Life, Two Vessels | 20 | other | passive | no plan |  |
| Amp Focus | 12 | psychic | passive | no plan |  |
| Animal Empathy (Ranger) | 2 | ranger | passive | no plan |  |
| Favored Prey | 4 | ranger | passive | no plan |  |
| Giant Hunter | 4 | ranger | passive | no plan |  |
| Scout's Warning | 4 | ranger | free | no plan |  |
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
| Inspired Stratagem | 8 | rogue | passive | no plan |  |
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
| Eternal Boost | 20 | summoner | passive | no plan |  |
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
| Spellbook Prodigy | 1 | wizard | passive | no plan |  |
| Knowledge is Power (Wizard) | 8 | wizard | passive | no plan |  |
| Scroll Adept | 10 | wizard | passive | no plan |  |
| Shared Focus | 10 | wizard | 1 action | plan | a timer with no rules a fight counts |
| Spatial Awareness | 10 | wizard | passive | no plan |  |
| Keen Magical Detection | 12 | wizard | passive | no plan |  |
| Bonded Focus | 14 | wizard | passive | no plan |  |
| Infinite Possibilities | 18 | wizard | passive | no plan |  |
| Reprepare Spell | 18 | wizard | passive | no plan |  |
| Spell Mastery | 20 | wizard | passive | no plan |  |

## Nothing a fight would use (831)

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
| Aristocratic Arms | 4 | archetype | passive | no plan |  |
| Armiger's Protection | 4 | archetype | passive | no plan |  |
| Axe Climber | 4 | archetype | passive | no plan |  |
| Basic Arcana | 4 | archetype | passive | no plan |  |
| Basic Blood Potency | 4 | archetype | passive | no plan |  |
| Basic Breakthrough | 4 | archetype | passive | no plan |  |
| Basic Captivator Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Cleric Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Concoction | 4 | archetype | passive | no plan |  |
| Basic Death Dealing | 4 | archetype | passive | no plan |  |
| Basic Deduction | 4 | archetype | passive | no plan |  |
| Basic Defender | 4 | archetype | passive | no plan |  |
| Basic Devotion | 4 | archetype | passive | no plan |  |
| Basic Dogma | 4 | archetype | passive | no plan |  |
| Basic Druid Spellcasting | 4 | archetype | passive | no plan |  |
| Basic Field Training | 4 | archetype | passive | no plan |  |
| Basic Flair | 4 | archetype | passive | no plan |  |
| Basic Fury | 4 | archetype | passive | no plan |  |
| Basic Glory | 4 | archetype | passive | no plan |  |
| Basic Hunter's Trick | 4 | archetype | passive | no plan |  |
| Basic Kata | 4 | archetype | passive | no plan |  |
| Basic Maneuver | 4 | archetype | passive | no plan |  |
| Basic Martial Magic | 4 | archetype | passive | no plan |  |
| Basic Muse's Whispers | 4 | archetype | passive | no plan |  |
| Basic Mysteries | 4 | archetype | passive | no plan |  |
| Basic Rune Magic | 4 | archetype | passive | no plan |  |
| Basic Shooting | 4 | archetype | passive | no plan |  |
| Basic Synergy | 4 | archetype | passive | no plan |  |
| Basic Thaumaturgy | 4 | archetype | passive | no plan |  |
| Basic Thoughtform | 4 | archetype | passive | no plan |  |
| Basic Trickery | 4 | archetype | passive | no plan |  |
| Basic Wilding | 4 | archetype | passive | no plan |  |
| Big Game Trapper | 4 | archetype | passive | no plan |  |
| Blessed Sacrifice | 4 | archetype | passive | plan | a spell the engine doesn't cast (Protector's Sacrifice) |
| Brilliant Crafter | 4 | archetype | passive | no plan |  |
| Bullying Staff | 4 | archetype | passive | no plan |  |
| Careful Explorer | 4 | archetype | passive | no plan |  |
| Clinging Climber | 4 | archetype | passive | no plan |  |
| Command Corpse | 4 | archetype | passive | no plan |  |
| Coughing Dragon Display | 4 | archetype | passive | no plan |  |
| Crescent Cross Training | 4 | archetype | passive | no plan |  |
| Decry Thief | 4 | archetype | passive | no plan |  |
| Devout Magic | 4 | archetype | passive | no plan |  |
| Dimensional Pilfer | 4 | archetype | 2 actions | no plan |  |
| Elemental Existence | 4 | archetype | passive | no plan |  |
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
| Headless Haunt | 4 | archetype | passive | no plan |  |
| Inspiring Recitation | 4 | archetype | 1 action | plan | an Effect with nothing a fight counts |
| Into The Storm | 4 | archetype | passive | no plan |  |
| Just the Tool | 4 | archetype | 1 action | no plan |  |
| Like a Fish in Water | 4 | archetype | passive | no plan |  |
| Lion's Might | 4 | archetype | passive | no plan |  |
| Magical Scholastics | 4 | archetype | passive | plan | a spell the engine doesn't cast (Detect Magic, Guidance, Read Aura) |
| Marine Combat Training | 4 | archetype | passive | no plan |  |
| Mental Forge | 4 | archetype | passive | no plan |  |
| Mountain Skin | 4 | archetype | passive | no plan |  |
| Nonlethal Takedown | 4 | archetype | passive | no plan |  |
| Observant Explorer | 4 | archetype | passive | no plan |  |
| One with the Land | 4 | archetype | passive | no plan |  |
| Pact of Huldra's Renewal | 4 | archetype | passive | no plan |  |
| Perfect Weaponry | 4 | archetype | passive | no plan |  |
| Petal Step | 4 | archetype | passive | no plan |  |
| Pirate Combat Training | 4 | archetype | passive | no plan |  |
| Quick Fix | 4 | archetype | passive | no plan |  |
| Quick Juggler | 4 | archetype | passive | no plan |  |
| Rebel's Map | 4 | archetype | free | no plan |  |
| Sense Alignment | 4 | archetype | 3 actions | no plan |  |
| Senses of the Bear | 4 | archetype | passive | no plan |  |
| Shadow Spells | 4 | archetype | passive | no plan |  |
| Shared Attunement | 4 | archetype | passive | no plan |  |
| Shorthanded | 4 | archetype | passive | no plan |  |
| Siege Ritualist | 4 | archetype | passive | no plan |  |
| Social Purview | 4 | archetype | passive | no plan |  |
| Soothing Pulse | 4 | archetype | passive | no plan |  |
| Spell-Woven Shot | 4 | archetype | passive | no plan |  |
| Spirit Spells | 4 | archetype | passive | no plan |  |
| Spiritual Awakening | 4 | archetype | passive | no plan |  |
| Spyglass Modification | 4 | archetype | passive | no plan |  |
| Stage Fighting | 4 | archetype | passive | no plan |  |
| Stargazer's Eyes | 4 | archetype | passive | no plan |  |
| Strange Script | 4 | archetype | passive | no plan |  |
| Subtle Shift | 4 | archetype | passive | no plan |  |
| Tactical Excellence | 4 | archetype | passive | no plan |  |
| Take the Wheel | 4 | archetype | 1 action | no plan |  |
| Terrain Scout | 4 | archetype | passive | no plan |  |
| The World Whispers | 4 | archetype | 1 action | no plan |  |
| Trained Swimmer | 4 | archetype | passive | no plan |  |
| Triangulate | 4 | archetype | passive | no plan |  |
| Tunnel Wall | 4 | archetype | 1 action | plan | its requirement (You are in Tenacious Stance) |
| Underbrush Trailblazer | 4 | archetype | passive | no plan |  |
| Unnerving Expansion | 4 | archetype | 1 action | no plan |  |
| Watch and Learn | 4 | archetype | reaction | no plan |  |
| Wellspring Control | 4 | archetype | passive | no plan |  |
| Wild Lights | 4 | archetype | passive | no plan |  |
| Wrapped In Smoke | 4 | archetype | 1 action | plan | a timer with no rules a fight counts |
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
| Archaeologist's Warning | 6 | archetype | free | no plan |  |
| Armor Specialist | 6 | archetype | passive | no plan |  |
| Bolera's Interrogation | 6 | archetype | 3 actions | plan | a roll whose results the simulator doesn't read |
| Butterfly's Kiss | 6 | archetype | passive | no plan |  |
| Cannon Corner Shot | 6 | archetype | passive | no plan |  |
| Cast Out | 6 | archetype | 2 actions | no plan |  |
| Clean Take | 6 | archetype | reaction | plan | a reroll |
| Cloaking Pulse | 6 | archetype | passive | no plan |  |
| Crushing Step | 6 | archetype | passive | no plan |  |
| Deflecting Pulse | 6 | archetype | passive | no plan |  |
| Denounce Tyranny | 6 | archetype | 2 actions | plan | a roll whose results the simulator doesn't read |
| Devout Blessing | 6 | archetype | passive | no plan |  |
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
| Instinct Ability | 6 | archetype | passive | no plan |  |
| Keen Recollection | 6 | archetype | passive | no plan |  |
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
| Perfect Ki Adept | 6 | archetype | passive | no plan |  |
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
| Siege Celerity | 6 | archetype | free | no plan |  |
| Snow Step | 6 | archetype | passive | no plan |  |
| Tactical Guidance | 6 | archetype | passive | no plan |  |
| Talon's Mark | 6 | archetype | passive | no plan |  |
| Three Clear Breaths | 6 | archetype | passive | no plan |  |
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
| Elude the Divine | 8 | archetype | passive | no plan |  |
| Fey's Trickery | 8 | archetype | 2 actions | plan | a spell the feat casts |
| Flickering Stories | 8 | archetype | passive | no plan |  |
| Frozen Breadth | 8 | archetype | passive | no plan |  |
| Garden Path | 8 | archetype | passive | no plan |  |
| Hellknight Mobility | 8 | archetype | passive | no plan |  |
| Improvised Critical | 8 | archetype | passive | no plan |  |
| Larcenous Hand | 8 | archetype | passive | no plan |  |
| Levered Swing | 8 | archetype | 1 action | no plan |  |
| Lion's Fury | 8 | archetype | passive | no plan |  |
| Magic Ammunition | 8 | archetype | passive | no plan |  |
| Magic Finder | 8 | archetype | passive | no plan |  |
| Magical Knowledge | 8 | archetype | passive | no plan |  |
| Many Guises (Vigilante) | 8 | archetype | passive | no plan |  |
| Monumental Maestro | 8 | archetype | passive | no plan |  |
| Mysterious Breadth | 8 | archetype | passive | no plan |  |
| Occult Breadth | 8 | archetype | passive | no plan |  |
| Order Training | 8 | archetype | passive | no plan |  |
| Ore Fists | 8 | archetype | passive | no plan |  |
| Ouroboric Pact | 8 | archetype | passive | no plan |  |
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
| Scattered Fire | 8 | archetype | passive | no plan |  |
| Scholar's Hunch | 8 | archetype | passive | no plan |  |
| Shambling March | 8 | archetype | passive | no plan |  |
| Sickening Bite | 8 | archetype | passive | no plan |  |
| Skill Mastery | 8 | archetype | passive | no plan |  |
| Skim Scroll | 8 | archetype | 1 action | no plan |  |
| Smoldering Explosion | 8 | archetype | passive | no plan |  |
| Supreme Psychic Center | 8 | archetype | free | no plan |  |
| Surreptitious Spellcaster | 8 | archetype | passive | no plan |  |
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
| Communal Tale | 10 | archetype | passive | no plan |  |
| Deathguard | 10 | archetype | passive | no plan |  |
| Emerald Boughs Hideaway | 10 | archetype | passive | no plan |  |
| Emphatic Emissary | 10 | archetype | reaction | no plan |  |
| Exemplar Expertise | 10 | archetype | passive | no plan |  |
| Expand Spiral | 10 | archetype | passive | no plan |  |
| Expert Captivator Spellcasting | 10 | archetype | passive | no plan |  |
| Eye for Smugglers | 10 | archetype | passive | no plan |  |
| Feast Planner | 10 | archetype | passive | no plan |  |
| Ghost-Path Epiphany | 10 | archetype | passive | no plan |  |
| Giant Snare | 10 | archetype | passive | no plan |  |
| Glutton for Flesh | 10 | archetype | passive | no plan |  |
| Goblin Jubilee Display | 10 | archetype | passive | no plan |  |
| Grave Sight | 10 | archetype | passive | no plan |  |
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
| Perfect Ki Expert | 10 | archetype | passive | no plan |  |
| Preserve the Horde | 10 | archetype | free | no plan |  |
| Reflexive Devotion | 10 | archetype | free | no plan |  |
| Roadkill | 10 | archetype | passive | no plan |  |
| Rope Mastery | 10 | archetype | passive | no plan |  |
| Ship's Shadow | 10 | archetype | passive | no plan |  |
| Signifer's Sight | 10 | archetype | passive | no plan |  |
| Slayer's Presence | 10 | archetype | passive | no plan |  |
| Slingshot Maneuver | 10 | archetype | reaction | no plan |  |
| Spell Swallow | 10 | archetype | passive | no plan |  |
| Spraying Mutation | 10 | archetype | passive | no plan |  |
| Surrounding Flames | 10 | archetype | passive | no plan |  |
| Terrain Form | 10 | archetype | 1 action | plan | a spell the feat casts |
| Translocational Adept | 10 | archetype | passive | no plan |  |
| Tunnel | 10 | archetype | passive | no plan |  |
| Unbelievable Escape | 10 | archetype | passive | no plan |  |
| Uncanny Dodge | 10 | archetype | passive | no plan |  |
| Veil of Bugs | 10 | archetype | passive | no plan |  |
| Vigil's Walls Rise Anew | 10 | archetype | 2 actions | no plan |  |
| Ward Casting | 10 | archetype | reaction | no plan |  |
| Wing Rider | 10 | archetype | passive | no plan |  |
| Advanced Firearm Familiarity | 12 | archetype | passive | no plan |  |
| Advanced Order Training | 12 | archetype | passive | no plan |  |
| Advanced Seeker of Truths | 12 | archetype | passive | no plan |  |
| Archdiabolic Usurpation | 12 | archetype | passive | no plan |  |
| Banshee Cry Display | 12 | archetype | passive | no plan |  |
| Buzzing Death Cicadas | 12 | archetype | passive | no plan |  |
| Charged Creation | 12 | archetype | passive | no plan |  |
| Combat Premonition | 12 | archetype | passive | no plan |  |
| Communal Sustain | 12 | archetype | 1 action | no plan |  |
| Desperate Wish | 12 | archetype | passive | no plan |  |
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
| Intercepting Hand | 12 | archetype | passive | no plan |  |
| Invoke Movement | 12 | archetype | 1 action | plan | its requirement (You're under the effects of Enter Spirit Trance) |
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
| Control Tower | 14 | archetype | passive | plan | a passive's Effect on other creatures |
| Costume Change | 14 | archetype | passive | no plan |  |
| Domino Effect | 14 | archetype | reaction | no plan |  |
| Dream Logic | 14 | archetype | passive | no plan |  |
| Effortless Captivation | 14 | archetype | free | no plan |  |
| Enterprising Ritualist | 14 | archetype | passive | no plan |  |
| Exceptional Follower | 14 | archetype | passive | no plan |  |
| Expanded Swarm | 14 | archetype | passive | no plan |  |
| Graveshift | 14 | archetype | passive | no plan |  |
| Innocent Butterfly | 14 | archetype | passive | plan | a spell the engine doesn't cast (Aura of the Unremarkable) |
| Instant Credentials | 14 | archetype | passive | no plan |  |
| Iron Lung | 14 | archetype | passive | no plan |  |
| Pact of Eldritch Eyes | 14 | archetype | passive | no plan |  |
| Pact of the Fey Paths | 14 | archetype | passive | no plan |  |
| Perfect Ki Exemplar | 14 | archetype | passive | no plan |  |
| Precise Hooks | 14 | archetype | passive | no plan |  |
| Rapid Hybridization | 14 | archetype | free | no plan |  |
| Reset the Past | 14 | archetype | free | no plan |  |
| Sentinel's Orbit | 14 | archetype | passive | no plan |  |
| Speak for the Gravelands | 14 | archetype | passive | no plan |  |
| Specialized Beastmaster Companion | 14 | archetype | passive | no plan |  |
| Specialized Megafauna Companion | 14 | archetype | passive | no plan |  |
| Stone Communion | 14 | archetype | passive | no plan |  |
| Talismanic Sage | 14 | archetype | passive | no plan |  |
| Thwart Evil | 14 | archetype | reaction | no plan |  |
| Unfetter Sight | 14 | archetype | 1 action | plan | a timer with no rules a fight counts |
| Unlimited Ghost Flight | 14 | archetype | passive | no plan |  |
| Adamantine Fists | 16 | archetype | passive | no plan |  |
| Aura Expertise | 16 | archetype | free | no plan |  |
| Bolster Soul Cage | 16 | archetype | passive | no plan |  |
| Cross the Threshold | 16 | archetype | passive | no plan |  |
| Greater Snow Step | 16 | archetype | passive | no plan |  |
| Hidden Hoard | 16 | archetype | passive | no plan |  |
| Master Captivator Spellcasting | 16 | archetype | passive | no plan |  |
| Master Siege Engineer | 16 | archetype | passive | no plan |  |
| Officer's Protection | 16 | archetype | passive | no plan |  |
| Performance Weapon Expert | 16 | archetype | passive | no plan |  |
| Resuscitate | 16 | archetype | 3 actions | plan | a roll whose results the simulator doesn't read |
| The Bitter Scholar's Promotion | 16 | archetype | passive | no plan |  |
| The Immortal Attains the Summit | 16 | archetype | passive | no plan |  |
| Unwind Death | 16 | archetype | 3 actions | plan | a roll whose results the simulator doesn't read |
| Chemical Contagion | 18 | archetype | passive | no plan |  |
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
| Pact of the Living Pact | 18 | archetype | passive | no plan |  |
| Perfect Ki Grandmaster | 18 | archetype | passive | no plan |  |
| Soaring Dynamo | 18 | archetype | passive | no plan |  |
| Spirit of Vigil | 18 | archetype | passive | no plan |  |
| Live the Creed | 20 | archetype | 1 action | no plan |  |
| May Death Itself Reconsider | 20 | archetype | passive | no plan |  |
| Moment of Apotheosis | 20 | archetype | passive | no plan |  |
| Mortal Possibility | 20 | archetype | passive | no plan |  |
| Peerless Captain | 20 | archetype | passive | no plan |  |
| Spark of Immortality | 20 | archetype | passive | no plan |  |
| Tower Shield Mastery | 20 | archetype | passive | no plan |  |
| Moment of Clarity | 1 | barbarian | 1 action | no plan |  |
| Spiritual Guides | 4 | barbarian | reaction | plan | a reroll |
| Spirits' Interference | 6 | barbarian | 1 action | no plan |  |
| Animalistic Brutality | 8 | barbarian | 1 action | no plan |  |
| Invulnerable Rager | 8 | barbarian | passive | no plan |  |
| Embrace the Pain | 12 | barbarian | reaction | no plan |  |
| Titan's Stature | 12 | barbarian | passive | no plan |  |
| Giant's Lunge | 14 | barbarian | 1 action | plan | an Effect with nothing a fight counts |
| Sunder Enchantment | 14 | barbarian | passive | no plan |  |
| Quaking Stomp | 20 | barbarian | 1 action | plan | a spell the feat casts |
| Multifarious Muse | 2 | bard | passive | no plan |  |
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
| Light of Revelation | 4 | champion | passive | no plan |  |
| Security | 4 | champion | passive | no plan |  |
| Expand Aura | 6 | champion | 1 action | plan | a timer with no rules a fight counts |
| Advanced Deity's Domain | 8 | champion | passive | no plan |  |
| Greater Cruelty | 8 | champion | passive | no plan |  |
| Second Blessing | 8 | champion | passive | no plan |  |
| Sense Holiness | 8 | champion | passive | no plan |  |
| Sense Unholiness | 8 | champion | passive | no plan |  |
| Holy Light | 10 | champion | 2 actions | plan | a timer with no rules a fight counts |
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
| Emblazon Divinity | 20 | cleric | passive | no plan |  |
| Deceptive Tactics | 1 | commander | passive | no plan |  |
| Officer's Medical Training | 1 | commander | passive | no plan |  |
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
| Can't You See? | 8 | druid | passive | no plan |  |
| Eerie Environs | 8 | druid | passive | no plan |  |
| Fey Caller | 8 | druid | passive | no plan |  |
| Wandering Oasis | 12 | druid | passive | no plan |  |
| Cleansing Transformation | 14 | druid | passive | no plan |  |
| Verdant Metamorphosis | 14 | druid | passive | no plan |  |
| Too Much to Swallow | 16 | druid | reaction | plan | a spell the feat casts |
| Cunning Trickster Mask | 20 | druid | passive | no plan |  |
| Lightning Swap | 2 | exemplar | 1 action | no plan |  |
| Rapid Spark | 12 | exemplar | free | no plan |  |
| Complete the Hero's Journey | 14 | exemplar | 1 action | no plan |  |
| Strike Rivers, Seize Winds | 16 | exemplar | passive | no plan |  |
| Blade Brake | 2 | fighter | reaction | no plan |  |
| Cheaters Always Prosper | 4 | fighter | passive | no plan |  |
| Advanced Weapon Training | 6 | fighter | passive | no plan |  |
| Furious Focus | 6 | fighter | passive | no plan |  |
| Triple Shot | 6 | fighter | passive | plan | a passive's Strike |
| Agile Grace | 10 | fighter | passive | no plan |  |
| Desperate Finisher | 14 | fighter | reaction | plan | a timer with no rules a fight counts |
| Opening Stance | 14 | fighter | free | no plan |  |
| Master of Many Styles | 16 | fighter | free | no plan |  |
| Multishot Stance | 16 | fighter | 1 action | plan | its requirement, which the PC doesn't meet (You are wielding a ranged weapon with reload 0.) |
| Smash from the Air | 18 | fighter | passive | no plan |  |
| Larger Than Life (Guardian) | 1 | guardian | passive | no plan |  |
| Shielding Taunt | 2 | guardian | 1 action | plan | an Effect with nothing a fight counts |
| Get Behind Me! | 10 | guardian | passive | no plan |  |
| Right Where You Want Them | 12 | guardian | passive | no plan |  |
| Shield from Spells | 18 | guardian | passive | no plan |  |
| Black Powder Boost | 4 | gunslinger | 1 action | plan | a teleport |
| Greenwatch Initiate | 4 | gunslinger | passive | no plan |  |
| Instant Backup | 4 | gunslinger | reaction | no plan |  |
| Ostentatious Reload | 4 | gunslinger | 1 action | plan | a roll whose results the simulator doesn't read |
| Advanced Shooter | 6 | gunslinger | passive | no plan |  |
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
| Manifold Modifications | 8 | inventor | passive | no plan |  |
| Ubiquitous Gadgets | 8 | inventor | passive | no plan |  |
| Boost Modulation | 12 | inventor | passive | no plan |  |
| Soaring Armor | 14 | inventor | passive | no plan |  |
| Just the Thing! | 16 | inventor | passive | no plan |  |
| That's Odd | 1 | investigator | passive | no plan |  |
| Person of Interest | 2 | investigator | 1 action | no plan |  |
| Alchemical Discoveries | 4 | investigator | passive | no plan |  |
| Deadly Casework | 6 | investigator | passive | no plan |  |
| Predictive Purchase (Investigator) | 6 | investigator | passive | no plan |  |
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
| Clear as Air | 6 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Cyclonic Ascent | 8 | kineticist | 2 actions | no plan |  |
| Impenetrable Fog | 8 | kineticist | 3 actions | plan | a lasting area |
| Purify Element | 8 | kineticist | 2 actions | no plan |  |
| Elemental Transformation | 10 | kineticist | 1 action | no plan |  |
| Effortless Impulse | 12 | kineticist | free | no plan |  |
| Rattle the Earth | 12 | kineticist | 2 actions | plan | a spell the feat casts |
| Wiles on the Wind | 12 | kineticist | 2 actions | plan | a timer with no rules a fight counts |
| Barrier of Boreal Frost | 14 | kineticist | 3 actions | plan | a spell the feat casts |
| Imperious Aura | 16 | kineticist | free | no plan |  |
| Elemental Apotheosis | 18 | kineticist | passive | no plan |  |
| Omnikinesis | 20 | kineticist | 1 action | no plan |  |
| Force Fang | 2 | magus | passive | no plan |  |
| Spell Swipe | 8 | magus | 3 actions | plan | its text has no Strike of its user's |
| Maelstrom Flow | 10 | magus | 1 action | plan | a timer with no rules a fight counts |
| Rapid Recharge | 10 | magus | free | no plan |  |
| Magic Sense (Magus) | 12 | magus | passive | no plan |  |
| Hasted Assault | 14 | magus | passive | no plan |  |
| Monastic Weaponry | 1 | monk | passive | no plan |  |
| Qi Spells | 1 | monk | passive | no plan |  |
| Ancestral Weaponry | 2 | monk | passive | no plan |  |
| Brawling Focus | 2 | monk | passive | no plan |  |
| Shooting Stars Stance | 2 | monk | 1 action | plan | an Effect with nothing a fight counts |
| Student of Water | 2 | monk | passive | no plan |  |
| Advanced Monastic Weaponry | 6 | monk | passive | no plan |  |
| Advanced Qi Spells | 6 | monk | passive | no plan |  |
| Ki Cutting Sight | 6 | monk | passive | no plan |  |
| Clinging Shadows Initiate | 8 | monk | passive | no plan |  |
| Wild Winds Initiate | 8 | monk | passive | no plan |  |
| Wronged Monk's Wrath | 10 | monk | passive | plan | a spell the engine doesn't cast (Wronged Monk's Wrath) |
| Reflexive Stance | 12 | monk | free | no plan |  |
| Sense Ki | 12 | monk | passive | no plan |  |
| Tongue of Sun and Moon | 14 | monk | passive | no plan |  |
| Fuse Stance | 16 | monk | passive | no plan |  |
| Master Qi Spells | 16 | monk | passive | no plan |  |
| Effortless Reach | 18 | monk | passive | no plan |  |
| Grandmaster Qi Spells | 18 | monk | passive | no plan |  |
| Deadly Strikes | 20 | monk | passive | no plan |  |
| Endurance of the Rooted Tree | 20 | monk | passive | no plan |  |
| Lightning Qi | 20 | monk | free | no plan |  |
| Wake of Devastation | 20 | monk | passive | no plan |  |
| Widespread Fascination | 1 | necromancer | passive | no plan |  |
| Invert Harm | 2 | necromancer | passive | no plan |  |
| Muscle Barrier | 2 | necromancer | passive | plan | a spell the engine doesn't cast (Muscle Barrier) |
| Undead Creator | 2 | necromancer | passive | no plan |  |
| Overwhelming Harm | 4 | necromancer | passive | no plan |  |
| Bind Heroic Spirit | 6 | necromancer | passive | plan | a spell the engine doesn't cast (Bind Heroic Spirit) |
| Conglomerate of Limbs | 8 | necromancer | passive | no plan |  |
| Blossoming Gore | 10 | necromancer | passive | plan | a spell the engine doesn't cast (Blossoming Gore) |
| Expanded Necromancy | 10 | necromancer | passive | no plan |  |
| Bridge of Graves | 12 | necromancer | passive | plan | a spell the engine doesn't cast (Bridge of Graves) |
| Instinctual Creation | 14 | necromancer | free | no plan |  |
| Ocular Flesh | 14 | necromancer | 1 action | plan | a timer with no rules a fight counts |
| Recurring Nightmare | 14 | necromancer | passive | no plan |  |
| Skeletal Lancers | 14 | necromancer | passive | no plan |  |
| Flesh Tsunami | 16 | necromancer | passive | no plan |  |
| Temporary Possession | 16 | necromancer | passive | plan | a spell the engine doesn't cast (Temporary Possession) |
| Calcification | 18 | necromancer | passive | plan | a spell the engine doesn't cast (Calcification) |
| Power Hungry | 18 | necromancer | passive | no plan |  |
| Instant Army | 20 | necromancer | 1 action | no plan |  |
| Living Graveyard | 20 | necromancer | passive | no plan |  |
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
| Avenger of Greed | 14 | other | passive | no plan |  |
| Be Right Back | 14 | other | 3 actions | no plan |  |
| Behold, a Pale Horse | 14 | other | passive | no plan |  |
| Bloc Tactics | 14 | other | passive | no plan |  |
| Bloom of Health | 14 | other | 1 action | plan | an Effect on another creature |
| Break the Cycle | 14 | other | passive | no plan |  |
| Don Thy Fervor | 14 | other | 1 action | plan | an Effect with nothing a fight counts |
| Extend Surge | 14 | other | 1 action | plan | a timer with no rules a fight counts |
| Internal Dialogue | 14 | other | reaction | no plan |  |
| Lightless Sight | 14 | other | passive | no plan |  |
| Manipulate Realm | 14 | other | passive | no plan |  |
| Sink and Swim | 14 | other | passive | no plan |  |
| Spell Network | 14 | other | free | no plan |  |
| Night Terror | 16 | other | passive | no plan |  |
| Rapid Switch | 16 | other | free | no plan |  |
| Advanced Runelord Magic | 18 | other | passive | no plan |  |
| Fated Duel | 18 | other | 1 action | no plan |  |
| Master Spellcasting | 18 | other | passive | no plan |  |
| Mythic Counter | 18 | other | passive | no plan |  |
| Assume Godhood | 20 | other | passive | no plan |  |
| Break the Causal Chain | 20 | other | passive | no plan |  |
| Legacy of Monarchs | 20 | other | passive | no plan |  |
| Ancestral Mind | 1 | psychic | passive | no plan |  |
| Astral Tether | 4 | psychic | 1 action | no plan |  |
| Sixth Sense | 6 | psychic | passive | no plan |  |
| Thoughtsense | 8 | psychic | passive | no plan |  |
| Signature Spell Expansion (Psychic) | 10 | psychic | passive | no plan |  |
| Constant Levitation | 16 | psychic | passive | no plan |  |
| Autonomic Psychic Action | 20 | psychic | passive | no plan |  |
| Initiate Warden | 1 | ranger | passive | no plan |  |
| Favored Terrain | 2 | ranger | passive | no plan |  |
| Snare Hopping | 2 | ranger | passive | plan | a spell the engine doesn't cast (Snare Hopping) |
| Advanced Warden | 4 | ranger | passive | no plan |  |
| Far Shot | 4 | ranger | passive | no plan |  |
| Masterful Warden | 6 | ranger | passive | no plan |  |
| Ranger's Bramble | 6 | ranger | passive | no plan |  |
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
| Watch Your Back | 6 | rogue | 1 action | plan | a roll whose results the simulator doesn't read |
| Predictive Purchase (Rogue) | 8 | rogue | passive | no plan |  |
| Deny Support | 10 | rogue | passive | no plan |  |
| Sneak Adept | 10 | rogue | passive | no plan |  |
| Blank Slate | 16 | rogue | passive | no plan |  |
| Perfect Distraction | 16 | rogue | 1 action | no plan |  |
| Implausible Infiltration | 18 | rogue | 2 actions | no plan |  |
| Implausible Purchase (Rogue) | 18 | rogue | passive | no plan |  |
| Enduring Debilitation | 20 | rogue | free | plan | a timer with no rules a fight counts |
| Extradimensional Stash | 20 | rogue | passive | no plan |  |
| Hidden Paragon | 20 | rogue | reaction | plan | a timer with no rules a fight counts |
| Steal Essence | 20 | rogue | 2 actions | plan | a timer with no rules a fight counts |
| Fortifying Knock | 2 | runesmith | 1 action | plan | an Effect with nothing a fight counts |
| Terrifying Invocation | 4 | runesmith | 1 action | no plan |  |
| Transpose Etching | 4 | runesmith | 1 action | no plan |  |
| Diacritic Fluency | 6 | runesmith | free | no plan |  |
| Tracing Trance | 6 | runesmith | free | plan | an Effect with nothing a fight counts |
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
| Combination Finisher | 6 | swashbuckler | passive | no plan |  |
| Deadly Grace | 16 | swashbuckler | passive | no plan |  |
| Incredible Luck (Swashbuckler) | 18 | swashbuckler | passive | no plan |  |
| Panache Paragon | 20 | swashbuckler | passive | no plan |  |
| Haunt Ingenuity | 1 | thaumaturge | passive | no plan |  |
| Call Implement | 2 | thaumaturge | 1 action | no plan |  |
| Thaumaturgic Ritualist | 4 | thaumaturge | passive | plan | a passive's Effect posted by hand |
| One More Activation | 6 | thaumaturge | passive | no plan |  |
| Elaborate Talisman Esoterica | 8 | thaumaturge | passive | no plan |  |
| Thaumaturge's Investiture | 10 | thaumaturge | passive | no plan |  |
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
