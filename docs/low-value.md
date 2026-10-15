# Low-value options

The user asked on 2026-10-15: "Make a note of that and any other item, spell or ability that is low value in the simulator for testing later". These are the options the planner almost never picks when it has them (under 0.05 uses a fight). Low value in the simulator can mean the option is weak in PF2e too (Fear Gem), that the simulation lacks its situation (darkness, poison, travel, a creature it names), or that it's only partly simulated (the gaps column). Each one is worth a look when testing.

Measured 2026-10-15 with `node tools/low-value.mjs` (12 fights for each item and spell, 2 for each creature), and written by `node tools/low-value.mjs doc <results.json> docs/low-value.md`.
- **Items:** two of the item for each PC of the standard party (Fighter, Rogue, Wizard, Cleric) at its level (at most 14, the benchmark's tables), against a severe benchmark encounter. Uses a fight at the consumable margin (1.5) and with none (1).
- **Spells:** two casts for the Wizard (the Cleric for a divine-only spell) at the level that casts its rank (at most 14); cantrips at level 5.
- **Monster abilities:** two of each bestiary creature against the standard party of its level; only the options the planner picks on its turn (actions, Strike activities, multi-Strikes). Battlezoo creatures are measured but not listed here.

## Noted by hand

- **Fear Gem** (U7): 2 actions for a Strike and frightened 1 (2 on a critical hit). At level 5 it's worth 4.05 at no margin, less than a Strike and a second one at the attack penalty (about 6.7), so at the consumable margin of 1.5 the benchmark party never uses it; with no margin, about 0.7 a fight (1.0 with Intimidating Strike). Weak in PF2e's action economy too.

## Items never used, even with no margin (301 of 465)

| Item | Category | Level | Uses a fight (1.5 / none) | Not simulated |
|---|---|---|---|---|
| Aged Arbor Wine | elixir | 12 | 0.00 / 0.00 |  |
| Antidote (Greater) | elixir | 10 | 0.00 / 0.00 |  |
| Antidote (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| Antidote (Major) | elixir | 14 | 0.00 / 0.00 |  |
| Antidote (Moderate) | elixir | 6 | 0.00 / 0.00 |  |
| Antiplague (Greater) | elixir | 10 | 0.00 / 0.00 |  |
| Antiplague (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| Antiplague (Major) | elixir | 14 | 0.00 / 0.00 |  |
| Antiplague (Moderate) | elixir | 6 | 0.00 / 0.00 |  |
| Arbor Wine | elixir | 9 | 0.00 / 0.00 |  |
| Bitterblood Elixir | elixir | 6 | 0.00 / 0.00 |  |
| Blood Booster (Greater) | elixir | 14 | 0.00 / 0.00 | Effect: Blood Booster: Resistance (conditional) |
| Blood Booster (Lesser) | elixir | 3 | 0.00 / 0.00 | Effect: Blood Booster: Resistance (conditional) |
| Blood Booster (Moderate) | elixir | 11 | 0.00 / 0.00 | Effect: Blood Booster: Resistance (conditional) |
| Bomber's Eye Elixir (Greater) | elixir | 14 | 0.00 / 0.00 |  |
| Bomber's Eye Elixir (Lesser) | elixir | 4 | 0.00 / 0.00 |  |
| Boulderhead Bock | elixir | 2 | 0.00 / 0.00 | Effect: Boulderhead Bock: FlatModifier (conditional) |
| Bravo's Brew (Lesser) | elixir | 2 | 0.00 / 0.00 |  |
| Cheetah's Elixir (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| Chromatic Jellyfish Oil (Greater) | elixir | 14 | 0.00 / 0.00 | Effect: Chromatic Jellyfish Oil: Resistance (conditional) |
| Chromatic Jellyfish Oil (Lesser) | elixir | 9 | 0.00 / 0.00 | Effect: Chromatic Jellyfish Oil: Resistance (conditional) |
| Chromatic Jellyfish Oil (Moderate) | elixir | 14 | 0.00 / 0.00 | Effect: Chromatic Jellyfish Oil: Resistance (conditional) |
| Darkvision Elixir (Greater) | elixir | 8 | 0.00 / 0.00 |  |
| Darkvision Elixir (Lesser) | elixir | 2 | 0.00 / 0.00 |  |
| Darkvision Elixir (Moderate) | elixir | 4 | 0.00 / 0.00 |  |
| Eagle Eye Elixir (Greater) | elixir | 10 | 0.00 / 0.00 |  |
| Eagle Eye Elixir (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| Eagle Eye Elixir (Major) | elixir | 14 | 0.00 / 0.00 |  |
| Eagle Eye Elixir (Moderate) | elixir | 5 | 0.00 / 0.00 |  |
| Insight Coffee (Lesser) | elixir | 6 | 0.00 / 0.00 |  |
| Insight Coffee (Moderate) | elixir | 12 | 0.00 / 0.00 |  |
| Malleable Mixture (Greater) | elixir | 14 | 0.00 / 0.00 | Effect: Malleable Mixture (Greater): FlatModifier (conditional) |
| Malleable Mixture (Lesser) | elixir | 8 | 0.00 / 0.00 | Effect: Malleable Mixture (Lesser): FlatModifier (conditional) |
| Mana-Rattler Liniment | elixir | 9 | 0.00 / 0.00 | Effect: Mana-Rattler Liniment: Strike |
| Numbing Tonic (Greater) | elixir | 13 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Numbing Tonic (Lesser) | elixir | 5 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Numbing Tonic (Major) | elixir | 14 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Numbing Tonic (Minor) | elixir | 1 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Numbing Tonic (Moderate) | elixir | 9 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Numbing Tonic (True) | elixir | 14 | 0.00 / 0.00 | Effect: Numbing Tonic: TempHP (conditional) |
| Sea Touch Elixir (Greater) | elixir | 14 | 0.00 / 0.00 |  |
| Sea Touch Elixir (Lesser) | elixir | 5 | 0.00 / 0.00 |  |
| Sea Touch Elixir (Moderate) | elixir | 12 | 0.00 / 0.00 |  |
| Sixfingers Elixir (Greater) | elixir | 14 | 0.00 / 0.00 |  |
| Sixfingers Elixir (Lesser) | elixir | 5 | 0.00 / 0.00 |  |
| Sixfingers Elixir (Moderate) | elixir | 11 | 0.00 / 0.00 |  |
| Skeptic's Elixir (Lesser) | elixir | 1 | 0.00 / 0.00 | Effect: Skeptic's Elixir (Lesser): FlatModifier (conditional) |
| Soothing Toddy | elixir | 6 | 0.00 / 0.00 | Effect: Soothing Toddy: FlatModifier (conditional) |
| Soothing Tonic (Greater) | elixir | 10 | 0.00 / 0.00 | Effect: Soothing Tonic: FastHealing (conditional) |
| Soothing Tonic (Lesser) | elixir | 2 | 0.00 / 0.00 | Effect: Soothing Tonic: FastHealing (conditional) |
| Soothing Tonic (Major) | elixir | 14 | 0.00 / 0.00 | Effect: Soothing Tonic: FastHealing (conditional) |
| Soothing Tonic (Moderate) | elixir | 5 | 0.00 / 0.00 | Effect: Soothing Tonic: FastHealing (conditional) |
| Spiderfoot Brew (Greater) | elixir | 14 | 0.00 / 0.00 |  |
| Spiderfoot Brew (Lesser) | elixir | 3 | 0.00 / 0.00 |  |
| Spiderfoot Brew (Moderate) | elixir | 9 | 0.00 / 0.00 |  |
| Stone Fist Elixir | elixir | 4 | 0.00 / 0.00 | Effect: Stone Fist Elixir: Strike |
| Theatrical Mutagen (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| Theatrical Mutagen (Moderate) | elixir | 3 | 0.00 / 0.00 |  |
| War Blood Mutagen (Greater) | elixir | 11 | 0.00 / 0.00 |  |
| War Blood Mutagen (Lesser) | elixir | 1 | 0.00 / 0.00 |  |
| War Blood Mutagen (Major) | elixir | 14 | 0.00 / 0.00 |  |
| War Blood Mutagen (Moderate) | elixir | 3 | 0.00 / 0.00 |  |
| Blast Boots (Major) | gadget | 14 | 0.00 / 0.00 |  |
| Clockwork Goggles | gadget | 1 | 0.00 / 0.00 |  |
| Clockwork Goggles (Greater) | gadget | 4 | 0.00 / 0.00 |  |
| Clockwork Goggles (Major) | gadget | 8 | 0.00 / 0.00 |  |
| Flare Beacon (Lesser) | gadget | 1 | 0.00 / 0.00 |  |
| Flare Beacon (Moderate) | gadget | 6 | 0.00 / 0.00 |  |
| Moritype | gadget | 10 | 0.00 / 0.00 | manual step |
| Portable Seal (Lesser) | gadget | 6 | 0.00 / 0.00 | manual step |
| Portable Seal (Major) | gadget | 14 | 0.00 / 0.00 | manual step |
| Portable Seal (Moderate) | gadget | 12 | 0.00 / 0.00 | manual step |
| Tangibility Resonator (Lesser) | gadget | 5 | 0.00 / 0.00 |  |
| Tangibility Resonator (Moderate) | gadget | 11 | 0.00 / 0.00 |  |
| Vanishing Shocker (Greater) | gadget | 14 | 0.00 / 0.00 |  |
| Vanishing Shocker (Lesser) | gadget | 7 | 0.00 / 0.00 |  |
| Vanishing Shocker (Major) | gadget | 14 | 0.00 / 0.00 |  |
| Vanishing Shocker (Moderate) | gadget | 11 | 0.00 / 0.00 |  |
| Applereed Mutagen (Greater) | mutagen | 14 | 0.00 / 0.00 | Effect: Applereed Mutagen (Greater): CreatureSize |
| Applereed Mutagen (Lesser) | mutagen | 4 | 0.00 / 0.00 | Effect: Applereed Mutagen (Lesser): CreatureSize |
| Applereed Mutagen (Moderate) | mutagen | 12 | 0.00 / 0.00 | Effect: Applereed Mutagen (Moderate): CreatureSize |
| Bendy-Arm Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 | Effect: Bendy-Arm Mutagen (Greater): ActiveEffectLike |
| Bendy-Arm Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Bendy-Arm Mutagen (Lesser): ActiveEffectLike |
| Bendy-Arm Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 | Effect: Bendy-Arm Mutagen (Major): ActiveEffectLike |
| Bendy-Arm Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | Effect: Bendy-Arm Mutagen (Moderate): ActiveEffectLike |
| Bestial Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 | Effect: Bestial Mutagen (Greater): Strike |
| Bestial Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Bestial Mutagen (Lesser): Strike |
| Bestial Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 | Effect: Bestial Mutagen (Major): Strike |
| Bestial Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | Effect: Bestial Mutagen (Moderate): Strike |
| Cognitive Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 | Effect: Cognitive Mutagen (Greater): ActiveEffectLike |
| Cognitive Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Cognitive Mutagen (Lesser): ActiveEffectLike |
| Cognitive Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 | Effect: Cognitive Mutagen (Major): ActiveEffectLike |
| Cognitive Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | Effect: Cognitive Mutagen (Moderate): ActiveEffectLike |
| Deadweight Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 |  |
| Deadweight Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 |  |
| Deadweight Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 |  |
| Deadweight Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 |  |
| Fury Cocktail (Greater) | mutagen | 14 | 0.00 / 0.00 | Effect: Fury Cocktail (Greater): Resistance (conditional), FlatModifier (conditional) |
| Fury Cocktail (Lesser) | mutagen | 4 | 0.00 / 0.00 | Effect: Fury Cocktail (Lesser): Resistance (conditional), FlatModifier (conditional) |
| Fury Cocktail (Moderate) | mutagen | 12 | 0.00 / 0.00 | Effect: Fury Cocktail (Moderate): Resistance (conditional), FlatModifier (conditional) |
| Hydra Mutagen | mutagen | 13 | 0.00 / 0.00 | Effect: Hydra Mutagen: ActiveEffectLike |
| Megaphone Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 | modifier to deception; modifier to diplomacy; modifier to stealth; note: effect |
| Megaphone Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | modifier to deception; modifier to diplomacy; modifier to stealth; note: effect |
| Megaphone Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 | modifier to deception; modifier to diplomacy; modifier to stealth; note: effect |
| Megaphone Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | modifier to deception; modifier to diplomacy; modifier to stealth; note: effect |
| Prey Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Prey Mutagen (Lesser): GrantItem |
| Quicksilver Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Quicksilver Mutagen (Lesser): LoseHitPoints |
| Sanguine Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Sanguine Mutagen (Lesser): FlatModifier (conditional) |
| Serene Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Serene Mutagen (Lesser): FlatModifier (conditional) |
| Serene Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | Effect: Serene Mutagen (Moderate): FlatModifier (conditional) |
| Silvertongue Mutagen (Greater) | mutagen | 11 | 0.00 / 0.00 | Effect: Silvertongue Mutagen (Greater): AdjustDegreeOfSuccess |
| Silvertongue Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.00 | Effect: Silvertongue Mutagen (Lesser): AdjustDegreeOfSuccess |
| Silvertongue Mutagen (Major) | mutagen | 14 | 0.00 / 0.00 | Effect: Silvertongue Mutagen (Major): AdjustDegreeOfSuccess |
| Silvertongue Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.00 | Effect: Silvertongue Mutagen (Moderate): AdjustDegreeOfSuccess |
| Demortification Oil | oil | 5 | 0.00 / 0.00 |  |
| Flame Layer Balm | oil | 14 | 0.00 / 0.00 |  |
| Ghost Oil | oil | 4 | 0.00 / 0.00 | Effect: Ghost Oil: AdjustStrike |
| Life-Boosting Oil (Greater) | oil | 11 | 0.00 / 0.00 | Effect: Life-Boosting Oil: FastHealing (conditional) |
| Life-Boosting Oil (Lesser) | oil | 3 | 0.00 / 0.00 | Effect: Life-Boosting Oil: FastHealing (conditional) |
| Life-Boosting Oil (Major) | oil | 14 | 0.00 / 0.00 | Effect: Life-Boosting Oil: FastHealing (conditional) |
| Life-Boosting Oil (Moderate) | oil | 7 | 0.00 / 0.00 | Effect: Life-Boosting Oil: FastHealing (conditional) |
| Merciful Balm | oil | 1 | 0.00 / 0.00 |  |
| Oil of Keen Edges | oil | 11 | 0.00 / 0.00 | Effect: Oil of Keen Edges: AdjustStrike |
| Oil of Potency | oil | 2 | 0.00 / 0.00 |  |
| Oil of Potency (Greater) | oil | 12 | 0.00 / 0.00 |  |
| Oil of Potency (Major) | oil | 14 | 0.00 / 0.00 |  |
| Oil of Repulsion | oil | 11 | 0.00 / 0.00 |  |
| Shielding Salve | oil | 1 | 0.00 / 0.00 |  |
| Topology Protoplasm | oil | 7 | 0.00 / 0.00 |  |
| Tricky Liniment | oil | 5 | 0.00 / 0.00 |  |
| Wounding Oil | oil | 5 | 0.00 / 0.00 | Effect: Wounding Oil: AdjustStrike |
| Alloy Orb (Exquisite High-Grade) | other | 14 | 0.00 / 0.00 | Effect: Alloy Orb (Exquisite High-Grade): AdjustStrike |
| Alloy Orb (Exquisite Standard-Grade) | other | 12 | 0.00 / 0.00 | Effect: Alloy Orb (Exquisite Standard-Grade): AdjustStrike |
| Alloy Orb (High-Grade) | other | 14 | 0.00 / 0.00 | Effect: Alloy Orb (High-Grade): AdjustStrike |
| Alloy Orb (Low-Grade) | other | 3 | 0.00 / 0.00 | Effect: Alloy Orb (Low-Grade): AdjustStrike |
| Alloy Orb (Standard-Grade) | other | 8 | 0.00 / 0.00 | Effect: Alloy Orb (Standard-Grade): AdjustStrike |
| Animal Nip (Lesser) | other | 4 | 0.00 / 0.00 |  |
| Animal Nip (Major) | other | 12 | 0.00 / 0.00 |  |
| Animal Nip (Moderate) | other | 8 | 0.00 / 0.00 |  |
| Animal Repellent (Greater) | other | 12 | 0.00 / 0.00 |  |
| Animal Repellent (Lesser) | other | 4 | 0.00 / 0.00 |  |
| Animal Repellent (Major) | other | 14 | 0.00 / 0.00 |  |
| Animal Repellent (Minor) | other | 1 | 0.00 / 0.00 |  |
| Animal Repellent (Moderate) | other | 8 | 0.00 / 0.00 |  |
| Antifungal Salve (Greater) | other | 10 | 0.00 / 0.00 |  |
| Antifungal Salve (Lesser) | other | 1 | 0.00 / 0.00 |  |
| Antifungal Salve (Major) | other | 14 | 0.00 / 0.00 |  |
| Antifungal Salve (Moderate) | other | 6 | 0.00 / 0.00 |  |
| Blast-Off Bottle (Lesser) | other | 5 | 0.00 / 0.00 |  |
| Blast-Off Bottle (Moderate) | other | 9 | 0.00 / 0.00 |  |
| Blood Pack Squib | other | 2 | 0.00 / 0.00 |  |
| Brewer's Regret | other | 9 | 0.00 / 0.00 |  |
| Brewer's Regret (Greater) | other | 14 | 0.00 / 0.00 |  |
| Burglar's Rosebud | other | 3 | 0.00 / 0.00 |  |
| Burglar's Rosebud (Greater) | other | 8 | 0.00 / 0.00 |  |
| Captivating Rosebud | other | 3 | 0.00 / 0.00 | manual step |
| Celestial Peach (Rejuvenation) | other | 14 | 0.00 / 0.00 |  |
| Chivalric Emblem | other | 5 | 0.00 / 0.00 | Effect: Chivalric Emblem: TokenMark, FlatModifier (conditional) |
| Cinnamon Seers | other | 4 | 0.00 / 0.00 |  |
| Cloud Buns | other | 4 | 0.00 / 0.00 |  |
| Cloud Buns (Greater) | other | 9 | 0.00 / 0.00 |  |
| Colorful Coating (Violet) | other | 4 | 0.00 / 0.00 |  |
| Delve Scale | other | 10 | 0.00 / 0.00 |  |
| Devil's Breath Incense | other | 7 | 0.00 / 0.00 |  |
| Energizing Pill | other | 10 | 0.00 / 0.00 | Effect: Energizing Pill: FlatModifier (conditional) |
| Energy Toxin Bottle | other | 7 | 0.00 / 0.00 |  |
| Ethereal Crescent | other | 3 | 0.00 / 0.00 |  |
| Ethereal Crescent (Greater) | other | 7 | 0.00 / 0.00 |  |
| Featherlight Fletching | other | 4 | 0.00 / 0.00 |  |
| Feyfoul (Greater) | other | 14 | 0.00 / 0.00 |  |
| Feyfoul (Lesser) | other | 1 | 0.00 / 0.00 |  |
| Feyfoul (Moderate) | other | 8 | 0.00 / 0.00 |  |
| Ghost Ampoule | other | 4 | 0.00 / 0.00 |  |
| Glow Rod | other | 1 | 0.00 / 0.00 |  |
| Glowing Lantern Fruit | other | 1 | 0.00 / 0.00 |  |
| Hand of Mercy | other | 2 | 0.00 / 0.00 |  |
| Implosion Dust (Greater) | other | 14 | 0.00 / 0.00 | manual step |
| Implosion Dust (Lesser) | other | 6 | 0.00 / 0.00 | manual step |
| Implosion Dust (Moderate) | other | 12 | 0.00 / 0.00 | manual step |
| Impossible Cake | other | 3 | 0.00 / 0.00 |  |
| Impossible Cake (Greater) | other | 9 | 0.00 / 0.00 |  |
| Impossible Cake (Major) | other | 14 | 0.00 / 0.00 |  |
| Insight Coffee (Greater) | other | 14 | 0.00 / 0.00 |  |
| Journeybread (Power) | other | 4 | 0.00 / 0.00 | Effect: Journeybread (Power): FlatModifier (conditional) |
| Mighty Counterweight | other | 4 | 0.00 / 0.00 |  |
| Moritype (Greater) | other | 14 | 0.00 / 0.00 | manual step |
| Morph Jewel | other | 3 | 0.00 / 0.00 |  |
| Ommatophoric Mutagen | other | 7 | 0.00 / 0.00 | Effect: Ommatophoric Mutagen: ActiveEffectLike, FlatModifier (conditional) |
| Owl Screech Egg | other | 7 | 0.00 / 0.00 |  |
| Pallesthetic Mutagen | other | 9 | 0.00 / 0.00 | Effect: Pallesthetic Mutagen: FlatModifier (conditional) |
| Panaceatic Salve | other | 10 | 0.00 / 0.00 |  |
| Perfection's First Step | other | 5 | 0.00 / 0.00 | collisionDamage; forcedMovementNotes |
| Phasing Trine | other | 14 | 0.00 / 0.00 | Effect: Phasing Trine: EphemeralEffect |
| Pheromone Flare (Greater) | other | 14 | 0.00 / 0.00 | manual step |
| Pheromone Flare (Lesser) | other | 5 | 0.00 / 0.00 | manual step |
| Pheromone Flare (Moderate) | other | 11 | 0.00 / 0.00 | manual step |
| Preserved Moonflower | other | 7 | 0.00 / 0.00 |  |
| Pucker Pickle | other | 5 | 0.00 / 0.00 | Effect: Pucker Pickle: FlatModifier (conditional) |
| Putrid Sack of Rotting Fruit | other | 3 | 0.00 / 0.00 |  |
| Red-Rib Gill Mask (Greater) | other | 14 | 0.00 / 0.00 | Effect: Red-Rib Gill Mask (Greater): FlatModifier (conditional) |
| Red-Rib Gill Mask (Lesser) | other | 2 | 0.00 / 0.00 | Effect: Red-Rib Gill Mask (Lesser): FlatModifier (conditional) |
| Red-Rib Gill Mask (Moderate) | other | 7 | 0.00 / 0.00 | Effect: Red-Rib Gill Mask (Moderate): FlatModifier (conditional) |
| Sense-Dulling Hood (Greater) | other | 12 | 0.00 / 0.00 |  |
| Sense-Dulling Hood (Lesser) | other | 6 | 0.00 / 0.00 |  |
| Server's Stew | other | 7 | 0.00 / 0.00 |  |
| Silver Crescent (Greater) | other | 14 | 0.00 / 0.00 |  |
| Silver Crescent (Lesser) | other | 6 | 0.00 / 0.00 |  |
| Silver Crescent (Moderate) | other | 11 | 0.00 / 0.00 |  |
| Silver Salve | other | 2 | 0.00 / 0.00 | Effect: Silver Salve: AdjustStrike |
| Slayer's Stone | other | 6 | 0.00 / 0.00 |  |
| Spark Wafer | other | 1 | 0.00 / 0.00 |  |
| Sparking Pepper String | other | 3 | 0.00 / 0.00 |  |
| Sparkler | other | 1 | 0.00 / 0.00 | Effect: Sparkler: Strike |
| Spun Cloud (White) | other | 2 | 0.00 / 0.00 |  |
| Taper of Sanctification | other | 13 | 0.00 / 0.00 |  |
| Toothy Knife | other | 5 | 0.00 / 0.00 |  |
| Toothy Knife (Greater) | other | 14 | 0.00 / 0.00 |  |
| Transmuting Ingot (Adamantine) | other | 10 | 0.00 / 0.00 |  |
| Transmuting Ingot (Cold Iron) | other | 1 | 0.00 / 0.00 |  |
| Transmuting Ingot (Silver) | other | 1 | 0.00 / 0.00 |  |
| Tteokguk of Time Advancement | other | 5 | 0.00 / 0.00 |  |
| Unassuming Face Paint | other | 3 | 0.00 / 0.00 |  |
| Valorous Coin | other | 8 | 0.00 / 0.00 |  |
| Vermin Repellent Agent (Greater) | other | 12 | 0.00 / 0.00 | manual step |
| Vermin Repellent Agent (Lesser) | other | 3 | 0.00 / 0.00 | manual step |
| Vermin Repellent Agent (Major) | other | 14 | 0.00 / 0.00 | manual step |
| Vermin Repellent Agent (Moderate) | other | 8 | 0.00 / 0.00 | manual step |
| Viperous Elixir (Greater) | other | 11 | 0.00 / 0.00 | Effect: Viperous Elixir (Greater): Strike |
| Viperous Elixir (Lesser) | other | 5 | 0.00 / 0.00 | Effect: Viperous Elixir (Lesser): Strike |
| Viperous Elixir (Moderate) | other | 8 | 0.00 / 0.00 | Effect: Viperous Elixir (Moderate): Strike |
| Warding Paste | other | 6 | 0.00 / 0.00 |  |
| Whirlwind Vial | other | 11 | 0.00 / 0.00 | manual step |
| Worm Vial | other | 13 | 0.00 / 0.00 |  |
| Greengut | poison | 14 | 0.00 / 0.00 |  |
| Ascendant Dragon Spirit | potion | 11 | 0.00 / 0.00 |  |
| Bottled Omen | potion | 4 | 0.00 / 0.00 |  |
| Cold Iron Blanch (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Cold Iron Blanch (Greater): AdjustStrike |
| Cold Iron Blanch (Lesser) | potion | 3 | 0.00 / 0.00 | Effect: Cold Iron Blanch (Lesser): AdjustStrike |
| Cold Iron Blanch (Moderate) | potion | 9 | 0.00 / 0.00 | Effect: Cold Iron Blanch (Moderate): AdjustStrike |
| Covenant Tea | potion | 3 | 0.00 / 0.00 |  |
| Crimson Godsblood Serum (Greater) | potion | 14 | 0.00 / 0.00 |  |
| Crimson Godsblood Serum (Lesser) | potion | 6 | 0.00 / 0.00 |  |
| Crimson Godsblood Serum (Moderate) | potion | 12 | 0.00 / 0.00 |  |
| Draft of Stellar Radiance | potion | 3 | 0.00 / 0.00 |  |
| Dragonfly Potion | potion | 12 | 0.00 / 0.00 | Effect: Dragonfly Potion: FlatModifier (conditional), ActiveEffectLike |
| Elysian Dew | potion | 12 | 0.00 / 0.00 |  |
| Energizing Tea | potion | 4 | 0.00 / 0.00 |  |
| Enigma-Sight Potion | potion | 11 | 0.00 / 0.00 |  |
| Gecko Potion | potion | 1 | 0.00 / 0.00 | Effect: Gecko Potion: FlatModifier (conditional) |
| Immovable Potion | potion | 10 | 0.00 / 0.00 | note: effect |
| Longnight Tea | potion | 3 | 0.00 / 0.00 |  |
| Moon Blossom Tea | potion | 9 | 0.00 / 0.00 |  |
| Oak Potion | potion | 4 | 0.00 / 0.00 |  |
| Peace in Dreams Tea | potion | 6 | 0.00 / 0.00 |  |
| Potion of Acid Resistance (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Potion of Acid Resistance: Resistance (conditional) |
| Potion of Acid Resistance (Lesser) | potion | 6 | 0.00 / 0.00 | Effect: Potion of Acid Resistance: Resistance (conditional) |
| Potion of Acid Resistance (Moderate) | potion | 10 | 0.00 / 0.00 | Effect: Potion of Acid Resistance: Resistance (conditional) |
| Potion of Cold Resistance (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Potion of Cold Resistance: Resistance (conditional) |
| Potion of Cold Resistance (Lesser) | potion | 6 | 0.00 / 0.00 | Effect: Potion of Cold Resistance: Resistance (conditional) |
| Potion of Cold Resistance (Moderate) | potion | 10 | 0.00 / 0.00 | Effect: Potion of Cold Resistance: Resistance (conditional) |
| Potion of Electricity Resistance (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Potion of Electricity Resistance: Resistance (conditional) |
| Potion of Electricity Resistance (Lesser) | potion | 6 | 0.00 / 0.00 | Effect: Potion of Electricity Resistance: Resistance (conditional) |
| Potion of Electricity Resistance (Moderate) | potion | 10 | 0.00 / 0.00 | Effect: Potion of Electricity Resistance: Resistance (conditional) |
| Potion of Emergency Escape | potion | 1 | 0.00 / 0.00 |  |
| Potion of Fire Resistance (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Potion of Fire Resistance: Resistance (conditional) |
| Potion of Fire Resistance (Lesser) | potion | 6 | 0.00 / 0.00 | Effect: Potion of Fire Resistance: Resistance (conditional) |
| Potion of Fire Resistance (Moderate) | potion | 10 | 0.00 / 0.00 | Effect: Potion of Fire Resistance: Resistance (conditional) |
| Potion of Flying (Greater) | potion | 14 | 0.00 / 0.00 |  |
| Potion of Flying (Standard) | potion | 8 | 0.00 / 0.00 |  |
| Potion of Minute Echoes | potion | 9 | 0.00 / 0.00 | Effect: Potion of Minute Echoes: FlatModifier (conditional) |
| Potion of Sonic Resistance (Greater) | potion | 14 | 0.00 / 0.00 | Effect: Potion of Sonic Resistance: Resistance (conditional) |
| Potion of Sonic Resistance (Lesser) | potion | 6 | 0.00 / 0.00 | Effect: Potion of Sonic Resistance: Resistance (conditional) |
| Potion of Sonic Resistance (Moderate) | potion | 10 | 0.00 / 0.00 | Effect: Potion of Sonic Resistance: Resistance (conditional) |
| Potion of Stable Form | potion | 10 | 0.00 / 0.00 |  |
| Potion of Stable Form (Greater) | potion | 14 | 0.00 / 0.00 |  |
| Potion of Swimming | potion | 6 | 0.00 / 0.00 |  |
| Potion of Swimming (Greater) | potion | 11 | 0.00 / 0.00 |  |
| Psyche Salts (Lesser) | potion | 5 | 0.00 / 0.00 |  |
| Psyche Salts (Moderate) | potion | 9 | 0.00 / 0.00 |  |
| Resurrection Tea | potion | 5 | 0.00 / 0.00 | Effect: Resurrection Tea: ActiveEffectLike |
| Shrinking Potion | potion | 4 | 0.00 / 0.00 | Effect: Shrinking Potion: CreatureSize |
| Shrinking Potion (Greater) | potion | 8 | 0.00 / 0.00 | Effect: Shrinking Potion (Greater): CreatureSize |
| Skinstitch Salve | potion | 7 | 0.00 / 0.00 |  |
| Spiritsight Tea | potion | 7 | 0.00 / 0.00 | Effect: Spiritsight Tea: FlatModifier (conditional) |
| Sure-Step Potion | potion | 4 | 0.00 / 0.00 | modifier to acrobatics; note: effect |
| Truesight Potion | potion | 14 | 0.00 / 0.00 |  |
| Truth Potion | potion | 6 | 0.00 / 0.00 | manual step |
| Vengeful Demon's Tears | potion | 10 | 0.00 / 0.00 |  |
| Bronze Bull Pendant | talisman | 2 | 0.00 / 0.00 |  |
| Captivating Bauble | talisman | 12 | 0.00 / 0.00 |  |
| Dragon Turtle Scale | talisman | 4 | 0.00 / 0.00 |  |
| Dragon Turtle Scale (Greater) | talisman | 8 | 0.00 / 0.00 |  |
| Greased Axle | talisman | 2 | 0.00 / 0.00 | Effect: Greased Axle: FlatModifier (conditional) |
| Mummified Bat | talisman | 10 | 0.00 / 0.00 |  |
| Peacemaker | talisman | 6 | 0.08 / 0.00 |  |
| Shark Tooth Charm | talisman | 5 | 0.00 / 0.00 |  |
| Sneaky Key | talisman | 5 | 0.00 / 0.00 |  |
| Stormfeather | talisman | 8 | 0.00 / 0.00 |  |
| Bloodhound Mask (Greater) | toolkit | 11 | 0.00 / 0.00 |  |
| Bloodhound Mask (Lesser) | toolkit | 2 | 0.00 / 0.00 |  |
| Bloodhound Mask (Moderate) | toolkit | 6 | 0.00 / 0.00 |  |

## Items used only with no margin (8)

Used at least 0.2 times a fight with no margin, but (almost) never at 1.5: what the consumable rule holds back.

| Item | Category | Level | Uses a fight (1.5 / none) |
|---|---|---|---|
| Barricade Stone (Sphere) | other | 6 | 0.00 / 0.25 |
| Energy Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.33 |
| Fear Gem | talisman | 4 | 0.00 / 0.92 |
| Fey Dragonet Liqueur (Lesser) | potion | 7 | 0.00 / 0.25 |
| Juggernaut Mutagen (Lesser) | mutagen | 1 | 0.00 / 0.25 |
| Quicksilver Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.25 |
| Sanctified Beans | other | 11 | 0.00 / 0.25 |
| Sanguine Mutagen (Moderate) | mutagen | 3 | 0.00 / 0.33 |

## Items used the most (18): possibly over-valued

Not low value, the other end: used 4 or more times a fight of the 8 the party carries, even at the 1.5 margin (healing potions and Elixirs of Life aside). Worth checking that the planner isn't over-rating them: an Invisibility Potion's invisibility ends with the drinker's first hostile action, which its value doesn't count.

| Item | Category | Level | Uses a fight (1.5 / none) |
|---|---|---|---|
| Fulu of Concealment | fulu | 6 | 7.50 / 7.50 |
| Frozen Lava of Barrowsiege | other | 14 | 6.83 / 7.25 |
| Frozen Lava of Ka | other | 14 | 6.25 / 6.58 |
| Frozen Lava of Pale Mountain | other | 9 | 6.00 / 7.00 |
| Frozen Lava of Sakalayo | other | 14 | 5.92 / 7.08 |
| Invisibility Potion | potion | 4 | 5.42 / 6.58 |
| Frozen Lava of Blackpeak | other | 7 | 5.33 / 6.67 |
| Frozen Lava of Mhar Massif | other | 11 | 5.17 / 6.67 |
| Frozen Lava of Droskar's Crag | other | 13 | 5.00 / 6.17 |
| Therapeutic Snap Peas | other | 8 | 4.75 / 5.25 |
| Panacea Fruit | other | 14 | 4.67 / 4.83 |
| Blight Breath | other | 12 | 4.33 / 4.50 |
| Dragon's Blood Pudding (Major) | other | 14 | 4.33 / 5.58 |
| Fire and Iceberg (Major) | other | 14 | 4.25 / 4.25 |
| Fire and Iceberg (Greater) | other | 12 | 4.08 / 4.08 |
| Dust of Disappearance | other | 9 | 4.00 / 4.00 |
| Drakeheart Mutagen (Major) | mutagen | 14 | 4.00 / 4.08 |
| Ghost Dust | talisman | 14 | 4.00 / 4.00 |

## Spells never cast (324 of 997)

Each spell measured alone: the caster's other spells taken out, so it's weighed against its Strikes and basic actions.

| Spell | Rank | Caster | Casts a fight | Not simulated |
|---|---|---|---|---|
| Bullhorn | cantrip | Wizard | 0.00 |  |
| Discern Secrets | cantrip | Wizard | 0.00 | Discern Secrets: FlatModifier (conditional) |
| Forbidding Ward | cantrip | Cleric | 0.00 | Forbidding Ward: TokenMark, FlatModifier (conditional) |
| Guidance | cantrip | Cleric | 0.00 | Guidance: FlatModifier (conditional) |
| Infectious Enthusiasm | cantrip | Wizard | 0.00 |  |
| Inside Ropes | cantrip | Cleric | 0.00 |  |
| Manifest Will | cantrip | Wizard | 0.00 | Aura: Manifest Will: ActiveEffectLike; Manifest Will: Weakness (conditional), TempHP (conditional), FlatModifier (conditional) |
| Musical Accompaniment | cantrip | Wizard | 0.00 |  |
| Read the Air | cantrip | Cleric | 0.00 |  |
| Rousing Splash | cantrip | Cleric | 0.00 |  |
| Share Vision | cantrip | Wizard | 0.00 |  |
| Shroud of Night | cantrip | Wizard | 0.00 | note: What it can see |
| Silver's Refrain | cantrip | Wizard | 0.00 |  |
| Song of Strength | cantrip | Wizard | 0.00 |  |
| Summon Instrument | cantrip | Wizard | 0.00 | Summon Instrument: GrantItem |
| Take Root | cantrip | Wizard | 0.00 | Take Root: FlatModifier (conditional) |
| Tame | cantrip | Wizard | 0.00 |  |
| Vitality Lash | cantrip | Cleric | 0.00 |  |
| Warp Step | cantrip | Wizard | 0.00 |  |
| Wash Your Luck | cantrip | Cleric | 0.00 |  |
| Wilding Word | cantrip | Wizard | 0.00 | note: Penalty against the caster; note: Sickened when it damages you |
| Adapt Self | 1 (focus) | Wizard | 0.00 |  |
| Agitate | 1 | Wizard | 0.00 | note: Spell's effect |
| Airburst | 1 | Wizard | 0.00 | note: Reactions |
| Ancestral Memories | 1 (focus) | Wizard | 0.00 | Ancestral Memories: FlatModifier (conditional) |
| Angelic Halo | 1 (focus) | Wizard | 0.00 |  |
| Animate Rope | 1 | Wizard | 0.00 |  |
| Ant Haul | 1 | Wizard | 0.00 | Ant Haul: ActiveEffectLike |
| Anticipate Peril | 1 | Wizard | 0.00 |  |
| Appeal to Authority | 1 (focus) | Wizard | 0.00 | Appeal to Authority: FlatModifier (conditional) |
| Augmented Body | 1 (focus) | Wizard | 0.00 | Augmented Body: Resistance (conditional), FlatModifier (conditional) |
| Bane | 1 | Cleric | 0.00 |  |
| Beseech the Sphinx | 1 | Cleric | 0.00 |  |
| Bit of Luck | 1 (focus) | Wizard | 0.00 |  |
| Blood Ward | 1 (focus) | Wizard | 0.00 | Blood Ward: FlatModifier (conditional) |
| Celestial Accord | 1 | Cleric | 0.00 | note: Penalty against the other target |
| Circle of Weakness | 1 (focus) | Wizard | 0.00 | Circle of Weakness: Weakness (conditional) |
| Clouded Focus | 1 (focus) | Wizard | 0.00 | note: Spell's effect |
| Control Currents | 1 (focus) | Wizard | 0.00 | nothing native |
| Curse of Slippery Steps | 1 | Wizard | 0.00 | manual step |
| Cycle of Retribution | 1 | Cleric | 0.00 | note: Hostile actions |
| Déjà Vu | 1 | Wizard | 0.00 | note: Spell's effect |
| Devouring Dark Form | 1 (focus) | Wizard | 0.00 |  |
| Diabolic Edict | 1 (focus) | Wizard | 0.00 | Diabolic Edict: FlatModifier (conditional) |
| Divine Plagues | 1 (focus) | Wizard | 0.00 |  |
| Elysian Whimsy | 1 | Wizard | 0.00 | conditionRoll; conditionRollClaims; choiceGroup:condition-roll; note: 1d4 2; note: 1d4 3; note: 1d4 4 |
| Embodiment of Battle | 1 (focus) | Wizard | 0.00 | Embodiment of Battle: ActiveEffectLike, GrantItem |
| Empty Inside | 1 (focus) | Wizard | 0.00 |  |
| Entreat Spirit | 1 (focus) | Wizard | 0.00 | Entreat Spirit: FlatModifier (conditional) |
| Equal Footing | 1 | Wizard | 0.00 |  |
| Exchange Image | 1 | Wizard | 0.00 | effect: Spell Effect: Illusory Disguise |
| Face in the Crowd | 1 (focus) | Wizard | 0.00 |  |
| Forced Mercy | 1 | Cleric | 0.00 | note: Spell's effect |
| Forced Quiet | 1 (focus) | Wizard | 0.00 |  |
| Fortify Summoning | 1 (focus) | Wizard | 0.00 |  |
| Frenzied Revelry | 1 (focus) | Wizard | 0.00 |  |
| Goblin Pox | 1 | Wizard | 0.00 |  |
| Gravitational Pull | 1 | Wizard | 0.00 | nothing native |
| Gravity Weapon | 1 (focus) | Wizard | 0.00 | Gravity Weapon: FlatModifier (conditional) |
| Guided Introspection | 1 (focus) | Wizard | 0.00 |  |
| Hallowed Ground | 1 (focus) | Wizard | 0.00 |  |
| Hand of the Apprentice | 1 (focus) | Wizard | 0.00 |  |
| Harm | 1 | Cleric | 0.00 |  |
| Heal Animal | 1 (focus) | Wizard | 0.00 |  |
| Healer's Blessing | 1 (focus) | Wizard | 0.00 |  |
| Hollow Heart | 1 (focus) | Wizard | 0.00 | note: No allies |
| Ill Omen | 1 | Wizard | 0.00 |  |
| Illusory Disguise | 1 | Wizard | 0.00 |  |
| Incendiary Aura | 1 (focus) | Wizard | 0.00 |  |
| Keen Smell | 1 (focus) | Wizard | 0.00 |  |
| Kinetic Ram | 1 | Wizard | 0.00 | nothing native |
| Leaden Steps | 1 | Wizard | 0.00 | condition: encumbered; Leaden Steps: Weakness (conditional) |
| Lift Nature's Caul | 1 (focus) | Wizard | 0.00 |  |
| Malediction | 1 | Cleric | 0.00 |  |
| Necromancer's Generosity | 1 | Wizard | 0.00 |  |
| Nudge the Odds | 1 | Wizard | 0.00 |  |
| Parch | 1 (focus) | Wizard | 0.00 | note: Checks and DCs penalty |
| Penumbral Shroud | 1 | Wizard | 0.00 | note: Spell's effect |
| Personal Rain Cloud | 1 | Wizard | 0.00 |  |
| Pest Form | 1 | Wizard | 0.00 | Pest Form: BattleForm |
| Pocket Library | 1 | Wizard | 0.00 |  |
| Precious Gleam | 1 (focus) | Wizard | 0.00 | Precious Gleam: AdjustStrike |
| Protective Wards | 1 (focus) | Wizard | 0.00 |  |
| Pushing Gust | 1 (focus) | Wizard | 0.00 |  |
| Runic Body | 1 | Wizard | 0.00 |  |
| Runic Weapon | 1 | Wizard | 0.00 |  |
| Shields of the Spirit | 1 (focus) | Wizard | 0.00 | Shields of the Spirit: FlatModifier (conditional) |
| Signal Skyrocket | 1 | Wizard | 0.00 | castGate |
| Spirit Ward | 1 | Cleric | 0.00 |  |
| Stumbling Curse | 1 (focus) | Wizard | 0.00 | manual step |
| Sweet Dream | 1 (focus) | Wizard | 0.00 | Sweet Dream: FlatModifier (conditional) |
| Tenebrous Freedom | 1 (focus) | Wizard | 0.00 | manual step |
| Thicket of Knives | 1 | Wizard | 0.00 |  |
| Tidal Surge | 1 (focus) | Wizard | 0.00 |  |
| Traveling Workshop | 1 (focus) | Wizard | 0.00 | Traveling Workshop: ActiveEffectLike |
| Turbulent Tide | 1 (focus) | Wizard | 0.00 | strikePrelude; castGate |
| Undeath's Blessing | 1 (focus) | Wizard | 0.00 | note: Treated as undead; note: Heal and harm halved |
| Unexpected Windfall | 1 (focus) | Wizard | 0.00 | condition: encumbered |
| Untamed Form | 1 (focus) | Wizard | 0.00 | Untamed Form: FlatModifier (conditional), Resistance (conditional) |
| Veil of Confidence | 1 (focus) | Wizard | 0.00 |  |
| Weaken Earth | 1 | Wizard | 0.00 |  |
| Weapon Trance | 1 (focus) | Wizard | 0.00 | Weapon Trance: ActiveEffectLike |
| Wooden Fists | 1 | Wizard | 0.00 | Wooden Fists: Strike |
| Word of Truth | 1 (focus) | Wizard | 0.00 |  |
| Advanced Scurvy | 2 | Cleric | 0.00 |  |
| Animal Feature | 2 (focus) | Wizard | 0.00 |  |
| Animal Form | 2 | Wizard | 0.00 | Animal Form (Ape): BattleForm; Animal Form (Bear): BattleForm; Animal Form (Bull): BattleForm; Animal Form (Canine): BattleForm; Animal Form (Cat): BattleForm; Animal Form (Crab): BattleForm; Animal Form (Crocodile): BattleForm; Animal Form (Deer): BattleForm; Animal Form (Frog): BattleForm; Animal Form (Orca): BattleForm; Animal Form (Seal): BattleForm; Animal Form (Shark): BattleForm; Animal Form (Snake): BattleForm |
| Binding Muzzle | 2 | Wizard | 0.00 | note: GM note |
| Brand the Impenitent | 2 | Cleric | 0.00 | note: Spell's effect |
| Burrow Ward | 2 | Wizard | 0.00 | nothing native |
| Canopy Crawler | 2 (focus) | Wizard | 0.00 |  |
| Carrion Mire | 2 | Wizard | 0.00 |  |
| Cauterize Wounds | 2 | Wizard | 0.00 |  |
| Claws of the Otter | 2 | Cleric | 0.00 | Claws of the Otter: Strike |
| Clawsong | 2 | Cleric | 0.00 | Clawsong: AdjustStrike |
| Cleanse Affliction | 2 | Cleric | 0.00 | chooseAffliction; oncePerExposure; heightened |
| Clear Mind | 2 | Cleric | 0.00 |  |
| Coiling Dance | 2 | Cleric | 0.00 |  |
| Dancing Shield | 2 | Wizard | 0.00 |  |
| Darkvision | 2 | Wizard | 0.00 |  |
| Death Knell | 2 | Cleric | 0.00 | conditionIncreases |
| Dispel Magic | 2 | Wizard | 0.00 |  |
| Enlarge | 2 | Wizard | 0.00 | Enlarge: CreatureSize |
| Extract Poison | 2 | Wizard | 0.00 |  |
| Feast of Ashes | 2 | Wizard | 0.00 | note: Daily damage (can't be healed) |
| Gecko Grip | 2 | Wizard | 0.00 |  |
| Harmonize Self | 2 (focus) | Wizard | 0.00 | modeChoice; modes |
| Horrifying Blood Loss | 2 | Wizard | 0.00 | secondaryTargets |
| Humanoid Form | 2 | Wizard | 0.00 | Humanoid Form: ActorTraits |
| Illusory Shroud | 2 | Wizard | 0.00 |  |
| Imitate Fauna | 2 (focus) | Wizard | 0.00 |  |
| Impeccable Flow | 2 | Wizard | 0.00 | Impeccable Flow: FlatModifier (conditional) |
| Infernal Supervision | 2 | Wizard | 0.00 |  |
| Iron Gut | 2 | Wizard | 0.00 |  |
| Lock Item | 2 | Wizard | 0.00 | note: Spell's effect |
| Luminous Stardust Healing | 2 (focus) | Wizard | 0.00 | counteractOutcome; operation:heal |
| Mental Map | 2 | Wizard | 0.00 | manual step |
| Mimic Undead | 2 | Cleric | 0.00 |  |
| Mirror Image | 2 | Wizard | 0.00 |  |
| Oaken Resilience | 2 | Wizard | 0.00 |  |
| Paranoia | 2 | Wizard | 0.00 | note: GM note |
| Quench | 2 | Wizard | 0.00 |  |
| Retrieving Hook | 2 | Wizard | 0.00 |  |
| Revealing Light | 2 | Wizard | 0.00 | note: Spell's effect |
| See the Unseen | 2 | Wizard | 0.00 | See the Unseen: FlatModifier (conditional) |
| Shrink | 2 | Wizard | 0.00 | Shrink: CreatureSize |
| Silence | 2 | Cleric | 0.00 | Silence: ActiveEffectLike |
| Sound Body | 2 | Cleric | 0.00 |  |
| Spirit of the Beast | 2 (focus) | Wizard | 0.00 | Spirit of the Beast: FlatModifier (conditional) |
| Spirit Sense | 2 | Cleric | 0.00 | Spirit Sense: FlatModifier (conditional) |
| Sure Footing | 2 | Cleric | 0.00 |  |
| The Parrot's Whisper | 2 | Cleric | 0.00 | note: One question (answered at caster's next turn); note: Chatter; note: Highest weakness (start of caster's next turn) |
| Tremorsense | 2 | Wizard | 0.00 |  |
| Vicious Jealousy | 2 | Wizard | 0.00 | note: No allies |
| Vision of Weakness | 2 (focus) | Wizard | 0.00 | Vision of Weakness: TokenMark, FlatModifier (conditional) |
| Warrior's Regret | 2 | Wizard | 0.00 | note: Creatures damaged this turn |
| Angelic Wings | 3 (focus) | Wizard | 0.00 |  |
| Annunciation of the Outer Gate | 3 | Cleric | 0.00 | note: Frightened floor |
| Aqueous Orb | 3 | Wizard | 0.00 | note: Engulfed; note: Orb |
| Beastmaster Trance | 3 (focus) | Wizard | 0.00 |  |
| Begone | 3 | Cleric | 0.00 | forcedMovementNotes |
| Behold the Weave | 3 | Cleric | 0.00 | note: Locked timeline |
| Bind Undead | 3 | Wizard | 0.00 |  |
| Caster's Imposition | 3 | Wizard | 0.00 |  |
| Consecrate Flesh | 3 | Cleric | 0.00 |  |
| Cordyceps Command | 3 | Wizard | 0.00 | castChoice |
| Croak Voice | 3 | Wizard | 0.00 | note: Hoarse voice |
| Cup of Dust | 3 | Wizard | 0.00 | note: Hourly damage (can't be healed) |
| Deep Sight | 3 | Wizard | 0.00 |  |
| Delay Affliction | 3 (focus) | Wizard | 0.00 | immunity; awareness; counteractPickStep; operation:heal; counteract:affliction |
| Earthbind | 3 | Wizard | 0.00 | note: GM note |
| Elemental Motion | 3 (focus) | Wizard | 0.00 |  |
| Excise Lexicon | 3 | Wizard | 0.00 | note: Excise Lexicon |
| Eyes of the Dead | 3 (focus) | Wizard | 0.00 |  |
| Gravity Well | 3 | Wizard | 0.00 |  |
| Hedge Prison | 3 (focus) | Wizard | 0.00 | note: Trapped in the hedge; note: GM note |
| Inscrutable Mask | 3 (focus) | Wizard | 0.00 |  |
| Insect Form | 3 | Wizard | 0.00 |  |
| Invoke the Harrow | 3 (focus) | Wizard | 0.00 |  |
| Levitate | 3 | Wizard | 0.00 | Levitate: FlatModifier (conditional) |
| Mind Reading | 3 | Wizard | 0.00 |  |
| Ooze Form | 3 | Wizard | 0.00 | Ooze Form: DamageDice (conditional) |
| Phantom Prison | 3 | Wizard | 0.00 | note: Phantom prison |
| Purging Toxins | 3 (focus) | Wizard | 0.00 | immunity; negatedByImmunity; operation:damage; counteract:affliction |
| Reblooded | 3 | Cleric | 0.00 |  |
| Ring of Truth | 3 | Cleric | 0.00 |  |
| Sculpt Sound | 3 | Wizard | 0.00 |  |
| Shifting Sand | 3 | Wizard | 0.00 | note: Shifting sand |
| Soothing Blossoms | 3 | Cleric | 0.00 |  |
| Sparkleskin | 3 | Wizard | 0.00 | nothing native |
| Strength of Mind | 3 | Cleric | 0.00 | Strength of Mind: FlatModifier (conditional) |
| Subjugate Undead | 3 (focus) | Wizard | 0.00 | note: Subjugated minion |
| Sudden Recollection | 3 | Wizard | 0.00 |  |
| Tempest Cloak | 3 | Wizard | 0.00 |  |
| The Four Hunters | 3 | Wizard | 0.00 | The Four Hunters: TempHP (conditional), FlatModifier (conditional) |
| Thief of Fortune | 3 | Wizard | 0.00 | castingCondition |
| Unblinking Flame Revelation | 3 (focus) | Wizard | 0.00 | castingCondition |
| Unbreaking Wave Advance | 3 (focus) | Wizard | 0.00 | collisionDamage; forcedMovementNotes |
| Unravel Knowledge | 3 (focus) | Wizard | 0.00 |  |
| Wall of Wind | 3 | Wizard | 0.00 | note: Wall of wind |
| Achaekek's Clutch | 4 (focus) | Wizard | 0.00 | note: Mark of the mantis |
| Aerial Form | 4 | Wizard | 0.00 |  |
| Bloodspray Curse | 4 | Cleric | 0.00 | note: Bloodspray curse |
| Clownish Curse | 4 | Wizard | 0.00 | note: Curse |
| Compel True Name | 4 | Wizard | 0.00 | note: Compelled |
| Containment | 4 | Wizard | 0.00 | note: Force field; note: GM note |
| Countless Eyes | 4 | Wizard | 0.00 |  |
| Darkened Sight | 4 (focus) | Wizard | 0.00 |  |
| Daydreamer's Curse | 4 | Wizard | 0.00 | note: Curse |
| Delusional Pride | 4 (focus) | Wizard | 0.00 | note: Overconfidence |
| Dinosaur Form | 4 | Wizard | 0.00 | Dinosaur Form (Ankylosaurus): BattleForm; Dinosaur Form (Brontosaurus): BattleForm; Dinosaur Form (Deinonychus): BattleForm; Dinosaur Form (Stegosaurus): BattleForm; Dinosaur Form (Triceratops): BattleForm; Dinosaur Form (Tyrannosaurus): BattleForm |
| Dirge of Remembrance | 4 | Cleric | 0.00 | resistanceBypass; note: Semi-corporeal |
| Dispelling Globe | 4 | Wizard | 0.00 | castingCondition; operation:ward |
| Door to Beyond | 4 (focus) | Wizard | 0.00 |  |
| Dull Ambition | 4 | Wizard | 0.00 | note: Misfortune on initiative |
| Dutiful Challenge | 4 (focus) | Wizard | 0.00 | Dutiful Challenge: TokenMark, FlatModifier (conditional) |
| Elemental Gift | 4 | Wizard | 0.00 | Elemental Gift: FlatModifier (conditional), DamageDice (conditional), Resistance (conditional), TempHP (conditional) |
| Elephant Form | 4 | Wizard | 0.00 | Elephant Form: BattleForm |
| Eradicate Undeath | 4 (focus) | Wizard | 0.00 |  |
| Fallow Field | 4 (focus) | Wizard | 0.00 |  |
| Favorable Review | 4 | Wizard | 0.00 | note: Favorable review |
| Fey Form | 4 | Wizard | 0.00 |  |
| Fly | 4 | Wizard | 0.00 |  |
| Font of Serenity | 4 (focus) | Wizard | 0.00 |  |
| Foul Miasma | 4 (focus) | Wizard | 0.00 | note: GM note |
| Girzanje's March | 4 | Cleric | 0.00 |  |
| Glimpse the Truth | 4 (focus) | Wizard | 0.00 | heightened |
| Honeyed Words | 4 | Wizard | 0.00 |  |
| Implement of Destruction | 4 | Cleric | 0.00 | note: Implement of destruction |
| Inevitable Destination | 4 (focus) | Wizard | 0.00 | note: Tethered |
| Infectious Melody | 4 | Wizard | 0.00 | condition: undetected |
| Isolation | 4 (focus) | Wizard | 0.00 | note: Invisible to its allies |
| Outcast's Curse | 4 | Wizard | 0.00 | Outcast's Curse (Failure): RollTwice; Outcast's Curse (Success): RollTwice; manual step |
| Overflowing Sorrow | 4 (focus) | Wizard | 0.00 | note: Overflowing sorrow |
| Planar Tether | 4 | Wizard | 0.00 | note: Planar tether |
| Protector's Sphere | 4 (focus) | Wizard | 0.00 |  |
| Rewrite Memory | 4 | Wizard | 0.00 |  |
| Rigid Form | 4 | Wizard | 0.00 | heightened; operation:ward |
| Sage's Curse | 4 | Wizard | 0.00 | Sage's Curse (Failure): RollTwice; Sage's Curse (Success): RollTwice; manual step |
| Seal Fate | 4 | Wizard | 0.00 | manual step |
| Shielding Formation | 4 (focus) | Wizard | 0.00 | Shielding Formation: FlatModifier (conditional), Resistance (conditional) |
| Shifting Form | 4 (focus) | Wizard | 0.00 | Shifting Form: FlatModifier (conditional) |
| Snake Fangs | 4 | Wizard | 0.00 | Snake Fangs: Strike |
| Spell Immunity | 4 | Wizard | 0.00 | operation:ward |
| Spiral of Horrors | 4 (focus) | Wizard | 0.00 |  |
| Steal Voice | 4 | Wizard | 0.00 | note: Voiceless |
| Stormwind Flight | 4 (focus) | Wizard | 0.00 |  |
| Swarm Form | 4 (focus) | Wizard | 0.00 | Swarm Form: ActorTraits |
| Take its Course | 4 (focus) | Wizard | 0.00 | progressTargets; pickOne; unwillingSave; heightened; modes |
| Tireless Worker | 4 (focus) | Wizard | 0.00 | operation:suppress-condition |
| Touch of the Moon | 4 (focus) | Wizard | 0.00 | Touch of the Moon: FlatModifier (conditional) |
| Traveler's Transit | 4 (focus) | Wizard | 0.00 |  |
| Trickster's Twin | 4 (focus) | Wizard | 0.00 | note: Trickster's double |
| Unbounded Sphere | 4 (focus) | Wizard | 0.00 | note: GM note |
| Unfettered Movement | 4 | Wizard | 0.00 |  |
| Word of Freedom | 4 (focus) | Wizard | 0.00 | suppressNote; operation:suppress-condition |
| Aberrant Form | 5 | Wizard | 0.00 | Aberrant Form: FlatModifier (conditional) |
| Banishment | 5 | Wizard | 0.00 | casterConditions |
| Blister | 5 | Wizard | 0.00 | popSave |
| Cleansing Flames | 5 (focus) | Wizard | 0.00 | empower |
| Control Water | 5 | Wizard | 0.00 |  |
| Curse of Death | 5 (focus) | Wizard | 0.00 | afflictionImmunity |
| Dragon Wings | 5 (focus) | Wizard | 0.00 |  |
| Ectoplasmic Expulsion | 5 | Wizard | 0.00 | counteractFailure; counteract:undefined |
| Elemental Form | 5 | Wizard | 0.00 |  |
| Glossolalia | 5 | Cleric | 0.00 | note: GM note |
| Hallucination | 5 | Wizard | 0.00 | note: Hallucination |
| Lashunta's Life Bubble | 5 | Wizard | 0.00 | Lashunta's Life Bubble: FlatModifier (conditional) |
| Mantle of the Frozen Heart | 5 | Wizard | 0.00 | Mantle of the Frozen Heart: Resistance (conditional), FlatModifier (conditional) |
| Mantle of the Melting Heart | 5 | Wizard | 0.00 | Mantle of the Melting Heart: Resistance (conditional), Immunity (conditional), FlatModifier (conditional) |
| Over the Coals | 5 (focus) | Wizard | 0.00 | note: Over the coals |
| Plant Form | 5 | Wizard | 0.00 |  |
| Psychic Outburst | 5 | Wizard | 0.00 |  |
| Restorative Moment | 5 (focus) | Wizard | 0.00 | immunity; operation:decrease-conditions; operation:affliction-saves |
| Scouring Pulse | 5 | Wizard | 0.00 | note: Halo of light |
| Searing Rain | 5 | Wizard | 0.00 | nothing native |
| Strange Geometry | 5 | Wizard | 0.00 | note: Strange geometry |
| Subconscious Suggestion | 5 | Wizard | 0.00 | note: Subconscious suggestion |
| Wind Jump | 5 (focus) | Wizard | 0.00 |  |
| Claim Undead | 6 (focus) | Wizard | 0.00 | note: Claimed |
| Collective Transposition | 6 | Wizard | 0.00 | controls |
| Daemon Form | 6 | Wizard | 0.00 | Daemon Form: DamageDice (conditional), FlatModifier (conditional) |
| Demon Form | 6 | Wizard | 0.00 | Demon Form: DamageDice (conditional), Resistance (conditional) |
| Devil Form | 6 | Wizard | 0.00 | Devil Form: FlatModifier (conditional) |
| Dragon Form | 6 | Wizard | 0.00 | Dragon Form: BattleForm, Resistance (conditional), GrantItem, DamageAlteration |
| Flaming Fusillade | 6 (focus) | Wizard | 0.00 |  |
| Life-Giving Form | 6 (focus) | Wizard | 0.00 |  |
| Revel in Retribution | 6 (focus) | Wizard | 0.00 | Revel in Retribution: GrantItem, ActiveEffectLike |
| Sacred Form | 6 | Cleric | 0.00 | Sacred Form: BattleForm |
| Speaking Sky | 6 (focus) | Wizard | 0.00 |  |
| Spellwrack | 6 | Wizard | 0.00 | note: Spellwrack |
| Truesight | 6 | Wizard | 0.00 |  |
| Angel Form | 7 | Cleric | 0.00 | Angel Form: FlatModifier (conditional) |
| Cosmic Form | 7 | Cleric | 0.00 | Cosmic Form: BattleForm, DamageDice (conditional) |
| Curse of the Spirit Orchestra | 7 | Wizard | 0.00 | note: Curse |
| Duplicate Foe | 7 | Wizard | 0.00 | duplicate |
| Fiery Body | 7 | Wizard | 0.00 |  |
| Inexhaustible Cynicism | 7 | Wizard | 0.00 | note: Cynicism |
| Maze of Locked Doors | 7 | Wizard | 0.00 | note: GM note |
| Momentary Recovery | 7 | Wizard | 0.00 |  |
| Orb of Twisting Fate | 7 | Wizard | 0.00 | note: GM note |
| Planar Seal | 7 | Wizard | 0.00 | operation:ward |
| Regenerate | 7 | Cleric | 0.00 |  |
| Spell Turning | 7 | Wizard | 0.00 | operation:ward |
| Unbreaking Wave Barrier | 7 (focus) | Wizard | 0.00 |  |
| Untwisting Iron Augmentation | 7 (focus) | Wizard | 0.00 | Untwisting Iron Augmentation: AdjustStrike |
| Vacuum | 7 | Wizard | 0.00 | suffocate; note: Suffocation; note: Holding its breath |
| Deluge | 8 | Wizard | 0.00 | controls |
| Hidden Mind | 8 | Wizard | 0.00 |  |
| Monstrosity Form | 8 | Wizard | 0.00 | formRiders; gmNotes; controls |
| Temporary Possession | 8 (focus) | Wizard | 0.00 | controls; note: Possessed (3 actions); note: Possessed (2 actions); note: Possessed (1 action) |
| Undermine Reality | 8 | Wizard | 0.00 | note: Quasi-real |
| Detonate Magic | 9 | Wizard | 0.00 | explosion; counteractOutcome; explosionNote; explosionPlan |
| Dread Mosquito Storm | 9 (focus) | Wizard | 0.00 | note: Recovering |
| Embrace Nothingness | 9 (focus) | Wizard | 0.00 |  |
| Foresight | 9 | Wizard | 0.00 | Foresight: ActiveEffectLike, GrantItem |
| Magnetic Dominion | 9 | Wizard | 0.00 | controls |
| One with the Land | 9 | Wizard | 0.00 | formRiders; gmNotes; controls |
| Overwhelming Presence | 9 | Cleric | 0.00 | note: Owes tribute |
| Prismatic Shield | 9 | Wizard | 0.00 | Prismatic Shield: FlatModifier (conditional) |
| Element Embodied | 10 | Wizard | 0.00 | Element Embodied (Air): BattleForm; Element Embodied (Earth): BattleForm; Element Embodied (Fire): BattleForm; Element Embodied (Metal): BattleForm; Element Embodied (Water): BattleForm; Element Embodied (Wood): BattleForm |
| Fabricated Truth | 10 | Wizard | 0.00 |  |
| Nature Incarnate | 10 | Wizard | 0.00 | formRiders; gmNotes; controls |
| Primal Herd | 10 | Wizard | 0.00 | Primal Herd: BattleForm, AdjustModifier |

## Monster abilities never used (240 PF2e ability names; 273 Battlezoo ones not listed)

| Ability | Creatures with it | Fights | Uses a fight | For example |
|---|---|---|---|---|
| Drink Blood | 40 | 80 | 0.00 | Raudltz Arudora (12), Hyrune Loxenna (15), Harmony In Agony (13) |
| Raise a Shield | 12 | 24 | 0.00 | Seldeg Bhedlis (20), Knight Reclaimant (8), Garrholdion (20) |
| Wicked Bite (Drain Blood) | 12 | 24 | 0.04 | Khurfel (10), Urdefhan Blood Mage (8), Urdefhan Lasher (7) |
| Wicked Bite (Drain Vitality) | 12 | 24 | 0.00 | Khurfel (10), Urdefhan Blood Mage (8), Urdefhan Lasher (7) |
| Burrowing Pounce | 9 | 18 | 0.00 | Adamantine Archdragon (Spellcaster) (20), Adamantine Archdragon (20), Zikritrax (13) |
| Drink Essence | 9 | 18 | 0.00 | Rukh (9), Strigoi Servant (10), Okoa (9) |
| Eager Rend | 9 | 18 | 0.00 | Soulbound Mauler (Neutral Good) (4), Soulbound Mauler (Chaotic Neutral) (4), Soulbound Mauler (Lawful Evil) (4) |
| Feed on Fear | 9 | 18 | 0.00 | Will-o'-the-Deep (6), Groetan Candle (6), Voidglutton (8) |
| Bonded Strike | 8 | 16 | 0.00 | Stone-Breasted Owl (5), Aspect of Ruun (5), Green Monkey (3) |
| Breath Weapon (Weakening Gas) | 8 | 16 | 0.00 | Mengkare (20), Dragonshard Guardian (20), Gold Dragon (Young, Spellcaster) (11) |
| Bully | 8 | 16 | 0.00 | Gargarthezul Captain (6), Greater Gargarthezul (3), Damned Gargarthezul Captain (Demon Pirate) (7) |
| Halo Pulse (Repulsion) | 8 | 16 | 0.00 | Empyreal Archdragon (20), Empyreal Archdragon (Spellcaster) (20), Empyreal Dragon (Young, Spellcaster) (10) |
| Halyard Swing | 8 | 16 | 0.00 | Gargarthezul Captain (6), Greater Gargarthezul (3), Damned Gargarthezul Captain (Demon Pirate) (7) |
| Mark of Avarice | 8 | 16 | 0.00 | Gargarthezul Captain (6), Greater Gargarthezul (3), Damned Gargarthezul Captain (Demon Pirate) (7) |
| Powerful Utterance (Chastising Word) | 8 | 16 | 0.00 | Vizier Dragon (Young) (11), Vizier Dragon (Adult) (15), Vizier Dragon (Adult, Spellcaster) (15) |
| Pressurized Pool | 8 | 16 | 0.00 | Brine Dragon (Adult, Spellcaster) (12), Brine Dragon (Young, Spellcaster) (8), Brine Archdragon (20) |
| Rage | 8 | 16 | 0.00 | Bolar Of Stonemoor (1), Zashathal Head-Taker (15), Kharostan (16) |
| Steal Knowledge | 8 | 16 | 0.00 | Whisper Archdragon (Spellcaster) (20), Whisper Archdragon (20), Whisper Dragon (Adult) (11) |
| Wish Come True | 8 | 16 | 0.00 | Wish Dragon (Adult) (14), Wish Dragon (Adult, Spellcaster) (14), Wish Archdragon (Spellcaster) (20) |
| Dero Medicine | 7 | 14 | 0.00 | Dero Stalker (2), Dero Magister (5), Dero Strangler (3) |
| Flaming Gallop | 7 | 14 | 0.00 | Greater Nightmare (11), Nightmare (6), Smoldering Nightmare (4) |
| Shape Ice | 7 | 14 | 0.00 | White Dragon (Adult) (10), White Dragon (Young) (6), White Dragon (Adult, Spellcaster) (10) |
| Bathygenic Barrage | 6 | 12 | 0.00 | Brine Dragon (Adult, Spellcaster) (12), Brine Archdragon (20), Brine Dragon (Adult) (12) |
| Boarding Action | 6 | 12 | 0.00 | Pirate (2), Iron Ring Pirate (1), Pirate Goblin (1) |
| Breath Weapon (Repulsion Gas) | 6 | 12 | 0.00 | Bronze Dragon (Ancient) (18), Bronze Dragon (Adult) (13), Bronze Dragon (Ancient, Spellcaster) (18) |
| Breath Weapon (Slowing Gas) | 6 | 12 | 0.00 | Copper Dragon (Young) (8), Copper Dragon (Ancient) (17), Copper Dragon (Adult) (12) |
| Embrace | 6 | 12 | 0.00 | Amyleda Blackwell (9), Succubus (7), Accursed Succubus (5) |
| Exhale Miasma | 6 | 12 | 0.00 | Tulvak (11), Green Hag (4), Ahksiva (1-2) (3) |
| Lustrous Lunge | 6 | 12 | 0.00 | Crystal Dragon (Ancient) (16), Crystal Dragon (Adult, Spellcaster) (11), Crystal Archdragon (19) |
| Portal Strike | 6 | 12 | 0.00 | Phase Archdragon (Spellcaster) (20), Phase Archdragon (20), Phase Dragon (Adult) (13) |
| Pushing Pulse | 6 | 12 | 0.00 | Barrage Archdragon (20), Barrage Dragon (Adult) (12), Barrage Dragon (Adult, Spellcaster) (12) |
| Sandstorm | 6 | 12 | 0.00 | Mummy Prophet Of Set (13), Aghash (4), Sezruth (3-4) (5) |
| Shapes in the Fog | 6 | 12 | 0.00 | Cloud Dragon (Ancient, Spellcaster) (19), Cloud Archdragon (20), Cloud Dragon (Adult) (14) |
| Tail Thrash | 6 | 12 | 0.00 | Soulrider (Monitor) (1), Spawning Soulrider (Fiend) (1), Soulrider (Celestial) (1) |
| Tenebrous Breath (Shadows) | 6 | 12 | 0.00 | Umbral Dragon (Adult, Spellcaster) (15), Umbral Archdragon (Spellcaster) (20), Umbral Dragon (Ancient, Spellcaster) (20) |
| Unveil Secret | 6 | 12 | 0.00 | Whisper Archdragon (Spellcaster) (20), Whisper Archdragon (20), Whisper Dragon (Adult) (11) |
| All Becomes Flame | 5 | 10 | 0.00 | Cinder Archdragon (20), Cinder Archdragon (Spellcaster) (20), Cinder Dragon (Ancient, Spellcaster) (19) |
| First-class Charge | 5 | 10 | 0.00 | First-Class Infantry (13), Pure Legion Squad (13), First-Class Cavalry (13) |
| Gnaw | 5 | 10 | 0.00 | The Beast (9), Winged Owlbear (18), Irriseni Owlbear (5) |
| Hungry Flurry | 5 | 10 | 0.00 | Giant Flytrap (10), Snapping Flytrap (3), Blood-Soaked Flytrap (3) |
| Killing Shake | 5 | 10 | 0.00 | Juvenile Cave Worm (Crimson) (8), Juvenile Cave Worm (Rock) (8), Juvenile Cave Worm (Gray) (8) |
| Passionate Kiss | 5 | 10 | 0.00 | Amyleda Blackwell (9), Succubus (7), Accursed Succubus (5) |
| Right This Way | 5 | 10 | 0.00 | Bitter Butler (3), Whimsical Butler (3), Cruel Automatic Butler (3) |
| Aslynn's Gaze | 4 | 8 | 0.00 | Aslynn (9), Shard of Aslynn (3-4) (4), Shard of Aslynn (1-2) (2) |
| Awful Approach | 4 | 8 | 0.00 | The Mistake (12), The Disciples (7), Unrisen (11) |
| Blinking Barrage | 4 | 8 | 0.00 | Phase Archdragon (Spellcaster) (20), Phase Archdragon (20), Phase Dragon (Ancient) (18) |
| Cloud of Giggles | 4 | 8 | 0.00 | Delight Archdragon (Spellcaster) (20), Delight Archdragon (20), Delight Dragon (Ancient, Spellcaster) (19) |
| Corrupt Speech | 4 | 8 | 0.00 | Reaper of Reputation (20), Palace Skelm (8), Elite Palace Skelm (PFS 4-11) (9) |
| Dragonspeech (Word of Caution) | 4 | 8 | 0.00 | Vizier Dragon (Ancient) (20), Vizier Archdragon (Spellcaster) (20), Vizier Archdragon (20) |
| Dragonspeech (Word of Heroism) | 4 | 8 | 0.00 | Vizier Dragon (Ancient) (20), Vizier Archdragon (Spellcaster) (20), Vizier Archdragon (20) |
| Drain Blood | 4 | 8 | 0.00 | Alisendra Arudora (10), Sabosan (5), Blood Hag (8) |
| Drain Qi | 4 | 8 | 0.00 | Minister Of Tumult (14), Provincial Jiang-shi (11), Hong Meigui (10) |
| Drain Thoughts | 4 | 8 | 0.00 | Vampire Taviah (12), Kemnebi (20), Vetalarana Emergent (8) |
| Frightening Display | 4 | 8 | 0.00 | Gigantopithecus (4), Gorilla (3), Pirate Gorilla (2) |
| Frightening Rant | 4 | 8 | 0.00 | Street Skelm (3), Fasiel Ibn Sazadin (3-4) (5), Fasiel Ibn Sazadin (1-2) (3) |
| Guiding Words | 4 | 8 | 0.00 | Guide (4), Tewakam Nekotek (3-4) (2), Tewakam Nekotek (5-6) (4) |
| Halo Pulse (Restriction) | 4 | 8 | 0.00 | Empyreal Archdragon (20), Empyreal Archdragon (Spellcaster) (20), Empyreal Dragon (Ancient) (19) |
| Heart Ripper | 4 | 8 | 0.00 | Peryton (4), Peryton (Rifle Mutation) (4), Peryton (Heretical) (4) |
| Implant Eggs | 4 | 8 | 0.00 | Giant Wasp (3), Hatched Wasp (1), Vespiria Queen (6) |
| Inspiration | 4 | 8 | 0.00 | Pholebis (7), Lampad Queen (15), Hesperid Queen (19) |
| Rapid Strikes | 4 | 8 | 0.00 | Hollow Hush (18), Quelaunt (15), Quelaunt (15) |
| Reap | 4 | 8 | 0.00 | Velicarn (Dullahan) (7), Jinnivere Arudora (8), Child of Urgathoa (8) |
| Redirect River | 4 | 8 | 0.00 | Requiem Archdragon (Spellcaster) (20), Requiem Archdragon (20), Requiem Dragon (Ancient) (20) |
| Reverberating Rush | 4 | 8 | 0.00 | Wailing Archdragon (Spellcaster) (18), Wailing Archdragon (18), Wailing Dragon (Ancient) (15) |
| Spine Rake | 4 | 8 | 0.00 | Stygian Serpent (12), Sea Serpent (12), Adolescent Sea Serpent (3) |
| Swig | 4 | 8 | 0.00 | Dockhand (1), Dockhand Cultist (1), Iron Ring Deckhand (1) |
| Transpose | 4 | 8 | 0.00 | Fenton's Faithful (13), Amalgamite (13), Amalgamite (13) |
| Vex | 4 | 8 | 0.00 | Mocking Dragon (Adult) (12), Mocking Dragon (Young) (8), Mocking Dragon (Adult, Spellcaster) (12) |
| Whirlwind of Hooks | 4 | 8 | 0.00 | Drakauthix (9), Drakauthix (PFS 3-15) (9), Old Drakauthix (PFS 3-15) (11) |
| Word of Heroism | 4 | 8 | 0.00 | Vizier Dragon (Ancient) (20), Vizier Archdragon (Spellcaster) (20), Vizier Archdragon (20) |
| Advancing Flourish | 3 | 6 | 0.00 | Charming Scoundrel (4), Tascio Raetullus (3-4) (4), Tascio Raetullus (5-6) (6) |
| Attach | 3 | 6 | 0.00 | Gluttonous Geode (Quest 22) (1), Weak Gluttonous Geode (1), Gluttonous Geode (1) |
| Bosun's Command | 3 | 6 | 0.00 | Bosun (3), Iron Ring Bosun (3), Vaggas the Bosun (3) |
| Captive Rake | 3 | 6 | 0.00 | Lie-Master (14), Kimilekki (17), Glabrezu (13) |
| Chastising Enforcement | 3 | 6 | 0.00 | Drill Sergeant (8), Chelaxian Fighter (6), Chelaxian Weaponmaster (8) |
| Consume Death | 3 | 6 | 0.00 | Nabasu (8), Vrolikai (20), Ziberae (20) |
| Consume Knowledge | 3 | 6 | 0.00 | Kirosthrek (20), Shanchek (15), Xulgath Thoughtmaw (15) |
| Death Grip | 3 | 6 | 0.00 | The Mistake (12), Unrisen (11), Unrisen Slithermaw (18) |
| Decompose | 3 | 6 | 0.00 | Ghostknife Gardener (1), Tough Ghostknife Gardener (3), Ardande Gardener (1) |
| Disorienting Shot | 3 | 6 | 0.00 | Revinus (3-4) (3), Revinus (1-2) (1), Gurlunk (4) |
| Drowning Touch | 3 | 6 | 0.00 | Evindra (13), Nereid (10), Drenchdead (12) |
| Fastening Leap | 3 | 6 | 0.00 | Grinder-Widget (5), Dig-Widget (5), Dig-Widget (PFS 4-07) (4) |
| Fume | 3 | 6 | 0.00 | Brimorak (5), Firestorm Brimorak (7), Ashen Brimorak (6) |
| Funereal Dirge | 3 | 6 | 0.00 | Cairn Wight (4), Cairn Wight (PFS 3-09) (4), Cairn Wight (G4) (4) |
| Goblin Breath | 3 | 6 | 0.00 | Goblin Snake (1), Gobmob Snake (4), King Stankus (3) |
| Hungry Winds | 3 | 6 | 0.00 | Harpy (BB) (5), Harpy (5), Gruddunk (15) |
| Hurricane Blast | 3 | 6 | 0.00 | Djinni (5), Jaathoom (5), Jaathoom Shuyookh (10) |
| Incite Violence | 3 | 6 | 0.00 | Palace Skelm (8), Elite Palace Skelm (PFS 4-11) (9), Transformed Bremix (7-8) (8) |
| Maul | 3 | 6 | 0.00 | Leopard (2), Leopard (1-14) (2), Leopard (PFS 3-13) (2) |
| Mesmerizing Melody | 3 | 6 | 0.00 | Melodic Squall (16), Melody On The Wind (10), Melody on the Wind (10) |
| Pressure Point Attack | 3 | 6 | 0.00 | Shino Hakusa (Level 16) (16), Shino Hakusa (Level 20) (20), Shino Hakusa (Level 14) (14) |
| Pull Apart | 3 | 6 | 0.00 | Mukradi (15), Pyroclastic Mukradi (15), Aspect of Insects (20) |
| Putrid Vomit | 3 | 6 | 0.00 | Grimple (1), Grimple (PFS 3-18) (1), Binji (1) |
| Ravage | 3 | 6 | 0.00 | Intellect Devourer (8), Xoarian (8), Tiluatchek (12) |
| Reel In | 3 | 6 | 0.00 | Arth Wiltur (9), Culdewen (7), Tidewater Guard (4) |
| Sapping Squeeze | 3 | 6 | 0.00 | Shanrigol Behemoth (9), Shanrigol Heap (4), Shanrigol Mound (6) |
| Shielded Advance | 3 | 6 | 0.00 | Jordis Serelli (6), Captain Of The Guard (6), Hryngar Officer (6) |
| Skittering Assault | 3 | 6 | 0.00 | Gogiteth (Bastion of Blasphemies) (12), Gogiteth (12), Mythic Gogiteth (12) |
| Spore Domination | 3 | 6 | 0.00 | Myceloid (4), Sporeborn Myceloid (4), Umbo (3) |
| Spray Pollen | 3 | 6 | 0.00 | Yellow Musk Creeper (2), Elite Mutant Cryptid Snapdrake (10), Snapdrake (8) |
| Tail Drag | 3 | 6 | 0.00 | Irahkatu (13), Ahuizotl (6), Young Ahuizotl (4) |
| Tentacle Transfer | 3 | 6 | 0.00 | Voidbracken Chuul (9), Zombie Chuul (7), Chuul (7) |
| Thatchling's Curse | 3 | 6 | 0.00 | Thatchling (1), Red-Hooded Thatchling (2), Fan Hongrui (2) |
| Toss | 3 | 6 | 0.00 | Hodag (6), Cruncher (6), Hateful Hodag (6) |
| Untamed Shift | 3 | 6 | 0.00 | Oaksteward Enforcer (Gatehouse) (1), Delphon (1), Oaksteward Enforcer (1) |
| Vital Transfusion | 3 | 6 | 0.00 | Excorion Paragon (18), Excorion (7), Excorion (7) |
| Whirlwind Toss | 3 | 6 | 0.00 | Ran-to (Level 16) (16), Ran-to (Level 14) (14), Ran-to (Level 20) (20) |
| Wide Cleave | 3 | 6 | 0.00 | Thanatotic Titan (20), Danava Titan (20), Elysian Titan (20) |
| Abduct | 2 | 4 | 0.00 | Dazerien Arudora (11), Sky Fisher (11) |
| Assume Fiery Form | 2 | 4 | 0.00 | Alisendra Arudora (10), Blood Hag (8) |
| Bay | 2 | 4 | 0.00 | Yeth Hound (3), Yeth Warbeast (7) |
| Behead | 2 | 4 | 0.00 | Executioner (6), Hryngar Skull Collector (6) |
| Big Thwunk | 2 | 4 | 0.00 | Revinus's Guards (3-4) (1), Revinus's Guards (1-2) (1) |
| Blood Possession | 2 | 4 | 0.00 | Omertius, The Gorger (8), Omertius, The Engorged (9) |
| Bloody Handprint | 2 | 4 | 0.00 | Excorion (7), Excorion (7) |
| Bloody Shave | 2 | 4 | 0.00 | Bloody Barber Leader (1), Bloody Barber Ambusher (1) |
| Bob | 2 | 4 | 0.00 | Sicklefang Longlegs (6), Giant Longlegs (3) |
| Body Bash | 2 | 4 | 0.00 | Wood Beetle (1), Weak Wood Beetle (1) |
| Boiling Darkness | 2 | 4 | 0.00 | Shadow Lesolethe (6), Empowered Shadow Lesolethe (8) |
| Captivating Dance | 2 | 4 | 0.00 | The Dancing Lady (8), Baobhan Sith (6) |
| Capture | 2 | 4 | 0.00 | Krampus (The Horned Miser) (20), Krampus (20) |
| Challenge Foe (Demoralize) | 2 | 4 | 0.00 | Einherji (10), Svaryr Soldier (16) |
| Channel Smite | 2 | 4 | 0.00 | Lawbringer Warpriest (5), Zealot of Asmodeus (4) |
| Clutch | 2 | 4 | 0.00 | Enormous Dragonfly (9), Giant Dragonfly (4) |
| Compel Condemned | 2 | 4 | 0.00 | Yianyin (7), Catrina (5) |
| Crimson Shroud | 2 | 4 | 0.00 | Talaro (15), Saviya (19) |
| Crowd Control | 2 | 4 | 0.00 | Palace Guard (4), Living Guard (4) |
| Crush Chitin | 2 | 4 | 0.00 | Khravgodon (9), Tangle Khravgodon (14) |
| Curse of Darkness | 2 | 4 | 0.00 | Owb Prophet (13), Owb (6) |
| Davai! | 2 | 4 | 0.00 | Semyon (7-8) (6), Semyon (5-6) (4) |
| Deadly Aim | 2 | 4 | 0.00 | Urdefhan Hunter (12), Gaetane (14) |
| Deadly Display | 2 | 4 | 0.00 | Ordulf Bladecaller (16), Berserker Ordulf (16) |
| Demand Pact | 2 | 4 | 0.00 | Wanikkawi (7-8) (9), Wanikkawi (7) |
| Destructive Frenzy | 2 | 4 | 0.00 | Tarrasque, The Armageddon Engine (20), Oliphaunt of Jandelay (20) |
| Devour All | 2 | 4 | 0.00 | Vescavor Swarm (5), Damned Vescavor Swarm (6) |
| Digest | 2 | 4 | 0.00 | Mammoth Land Star (8), Grizzer (10) |
| Dimensional Pit | 2 | 4 | 0.00 | Slithering Rift (18), Slithering Pit (7) |
| Dooming Bark | 2 | 4 | 0.00 | Cu Sith (7), Umbral Cu Sith (9) |
| Drag Below | 2 | 4 | 0.00 | River Elasmosaurus (11), Elasmosaurus (7) |
| Dread Promise | 2 | 4 | 0.00 | Oath Archdragon (20), Oath Archdragon (Spellcaster) (20) |
| Elongate Tongue | 2 | 4 | 0.00 | Sovina Vosslund (7), Penanggalan (5) |
| Enraging Whistle | 2 | 4 | 0.00 | Beastmaster Cultist (6), Trained Beastmaster Cultist (8) |
| Every Dagger | 2 | 4 | 0.00 | Uniila Occultist (10), Uniila (10) |
| Fan of Daggers | 2 | 4 | 0.00 | Twisted Jack (17), Sad Liza (17) |
| Feed on Sorrow (1) | 2 | 4 | 0.00 | Popobawa (15), Ndede (15) |
| Feed on Sorrow (2) | 2 | 4 | 0.00 | Popobawa (15), Ndede (15) |
| Feed on Sorrow (3) | 2 | 4 | 0.00 | Popobawa (15), Ndede (15) |
| Felling Shot | 2 | 4 | 0.00 | Reynard Hawk (13), Hero Hunter (13) |
| Flay | 2 | 4 | 0.00 | Skitterstitch (6), Skinstitch (5) |
| Flowing Hair | 2 | 4 | 0.00 | Rusalka (12), Rusalka (12) |
| Frenzy Pheromone | 2 | 4 | 0.00 | Ankhrav Hive Mother (8), Ankhrav Hive Mother (8) |
| Furious Fusillade | 2 | 4 | 0.00 | Barcumbuk (8), Summoning Chamber Erinys (8) |
| Furious Wings | 2 | 4 | 0.00 | The Ascendant (5-6) (8), The Ascendant (3-4) (6) |
| Gem Gaze | 2 | 4 | 0.00 | Stygira (7), Calcifda (10) |
| Gnaw Flesh | 2 | 4 | 0.00 | Giant Maggot (1), Web Grub (1) |
| Grim Curse of Azathoth | 2 | 4 | 0.00 | Iazmilor (8), Ziradini (8) |
| Grinding Bite | 2 | 4 | 0.00 | Giant Tapir (Snared) (2), Giant Tapir (2) |
| Hamstring | 2 | 4 | 0.00 | Scorched Earth Orc (Clipper) (5-6) (5), Scorched Earth Orc (Clipper) (7-8) (7) |
| Handspring Kick | 2 | 4 | 0.00 | Ganzi Martial Artist (3), Little Brother Zibini (3-4) (3) |
| Hateful Tide | 2 | 4 | 0.00 | Sea Devil Baron (6), Baron Utomo (5-6) (6) |
| Howl | 2 | 4 | 0.00 | Weathered Wail (17), Wendigo (17) |
| Hunter's Aim | 2 | 4 | 0.00 | Dmiri Yoltosha (4), Shaldar Falls-Far (6) |
| Hunter's Wound | 2 | 4 | 0.00 | Drow Hunter (7), Nyzuros (7) |
| Hunting Cry | 2 | 4 | 0.00 | Thylacine (1), Brush Thylacine (2) |
| Hypnotic Thrum | 2 | 4 | 0.00 | Thorned Cocoon (3-4) (2), Thorned Cocoon (5-6) (4) |
| Illusory Ambush | 2 | 4 | 0.00 | Desert's Howl (19), Howling Spawn (11) |
| Improvised Wishcraft | 2 | 4 | 0.00 | Perizia (5-6) (6), Perizia (7-8) (8) |
| Incessant Goading | 2 | 4 | 0.00 | Taunting Skull (5), Cackling Skull (6) |
| Intimidating Display | 2 | 4 | 0.00 | Giant Frilled Lizard (5), Awakened Giant Frilled Lizard (5) |
| Isolating Lash | 2 | 4 | 0.00 | Soul Skelm (10), Transformed Bremix (9-10) (10) |
| Knockback | 2 | 4 | 0.00 | Villamor Koth (15), Tiger Lord Hill Giant (TL2) (12) |
| Lashing Tongues | 2 | 4 | 0.00 | Niodrhast (19), Neothelid (15) |
| Leader's Command | 2 | 4 | 0.00 | Bandit Leader (3), Experienced Bandit Leader (5) |
| Manipulate Luck (Bad luck) | 2 | 4 | 0.00 | Huldra (4), Speaker Of Svaryr (20) |
| Manipulate Luck (Good luck) | 2 | 4 | 0.00 | Huldra (4), Speaker Of Svaryr (20) |
| Matriarch's Caress | 2 | 4 | 0.00 | Ishti (18), Lamia Matriarch (8) |
| Mauling Rush | 2 | 4 | 0.00 | Kokogiak (12), Frostripper (13) |
| Menacing Growl | 2 | 4 | 0.00 | Greater Hellcat (16), Hellcat (7) |
| Mind Crush | 2 | 4 | 0.00 | Nilith (10), Soaring Nilith (10) |
| Mortal Fears | 2 | 4 | 0.00 | Resurrection Archdragon (Spellcaster) (20), Resurrection Archdragon (20) |
| Nihilistic Truthsayer | 2 | 4 | 0.00 | Lyari Zinfeld (1), Lyari Zinfeld (3-4) (3) |
| Noxious Burst (Shrapnel Blast) | 2 | 4 | 0.00 | Filth Fire (4), Filth Fire (PFS 3-01) (4) |
| Noxious Burst (Toxic Fumes) | 2 | 4 | 0.00 | Filth Fire (4), Filth Fire (PFS 3-01) (4) |
| Noxious Spray | 2 | 4 | 0.00 | Sicklefang Longlegs (6), Giant Longlegs (3) |
| One-Millimeter Punch | 2 | 4 | 0.00 | Golden Fiend Sister (17), Grandmaster (17) |
| Pharyngeal Jaws | 2 | 4 | 0.00 | Giant Moray Eel (5), Whippoorwill Giant Moray Eel (4) |
| Pirate's Feint | 2 | 4 | 0.00 | Glass Buccaneer (9), Clockwork Buccaneer (9) |
| Plunderer's Command | 2 | 4 | 0.00 | Angry Mordant Spire Plunderer (5), Mordant Spire Plunderer (3) |
| Punishing Momentum | 2 | 4 | 0.00 | Bloom Wyvern (8), Wyvern (6) |
| Quicken Pestilence | 2 | 4 | 0.00 | Leukodaemon Plague (14), Leukodaemon (9) |
| Raise Defenses | 2 | 4 | 0.00 | Clockwork Infantry (11), Splinter Officer (19) |
| Rampant Growth | 2 | 4 | 0.00 | Tendriculos (7), Praskith (7) |
| Ransack | 2 | 4 | 0.00 | Tern Flock (2), Monkey Swarm (2) |
| Rattling Spear | 2 | 4 | 0.00 | Aapoph Granitescale (6), Serpentfolk Granitescale (6) |
| Repel Boarders! | 2 | 4 | 0.00 | Black Powder Crew (8), Naval Crew (8) |
| Residual Force | 2 | 4 | 0.00 | Zizminarial (6), Venedaemon (5) |
| Rip Flesh | 2 | 4 | 0.00 | Vilm (1), Jinkin Ripclaw (1) |
| Robes of Welcome | 2 | 4 | 0.00 | Wraith (6), War Wraith (9) |
| Sap Mind | 2 | 4 | 0.00 | Nikaramsa (14), Agent of Taraksun (14) |
| Sentry's Aim | 2 | 4 | 0.00 | Archer Sentry (2), Blue Streak Sentry (2) |
| Shadow Chain | 2 | 4 | 0.00 | Shadow Giant (13), Gruasha (11) |
| Shard Spray | 2 | 4 | 0.00 | Crystal Archdragon (19), Crystal Archdragon (Spellcaster) (19) |
| Shoving Blow | 2 | 4 | 0.00 | Murta Kronniksdottir (5-6) (7), Murta Kronniksdottir (3-4) (5) |
| Slurp Blood | 2 | 4 | 0.00 | Puddles Ghoul (1), Tough Puddles Ghoul (2) |
| Soul Scream | 2 | 4 | 0.00 | Afflicted Irnakurse (8), Irnakurse (9) |
| Spare the Dying, Free the Tormented | 2 | 4 | 0.00 | Requiem Archdragon (Spellcaster) (20), Requiem Archdragon (20) |
| Spike Storm | 2 | 4 | 0.00 | Mithral Golem (16), Mithral Golem (16) |
| Splintered Ground | 2 | 4 | 0.00 | Onturat (19), Skulltaker (18) |
| Sporewarp | 2 | 4 | 0.00 | Fungus Tyrant (9), Spore Queen Quilindra (20) |
| Squirt Blood | 2 | 4 | 0.00 | Ancient Rivener (14), Ikeshti Brood-Minder (2) |
| Steal Memories | 2 | 4 | 0.00 | Ixusoth (15), Hyakume (15) |
| Stick a Fork in It | 2 | 4 | 0.00 | Animated Silverware Swarm (1), Animated Cookware Swarm (1) |
| Storm of Tentacles | 2 | 4 | 0.00 | Afflicted Irnakurse (8), Irnakurse (9) |
| Strike of Terror | 2 | 4 | 0.00 | Chelaxian Rogue (6), Chelaxian Assassin (8) |
| Swift Blow | 2 | 4 | 0.00 | Weapon Master (Under the Pale Sun Dervishes) (13), Weapon Master (13) |
| Swift Staff Strike | 2 | 4 | 0.00 | Toshigami (15), Sakugami (15) |
| Tainted Rage | 2 | 4 | 0.00 | Horba (2), Corrupted Retainer (2) |
| Terrifying Display | 2 | 4 | 0.00 | Ghost Ape (4), Megaprimatus (8) |
| Terrifying Laugh | 2 | 4 | 0.00 | Geist (9), Geist (9) |
| Tethered Shot | 2 | 4 | 0.00 | Scorched Earth Orc (Sharpshooter) (7-8) (7), Scorched Earth Orc (Sharpshooter) (5-6) (5) |
| Thrashing Retreat | 2 | 4 | 0.00 | River Elasmosaurus (11), Elasmosaurus (7) |
| Throw Drink | 2 | 4 | 0.00 | Offended High Roller (2), Offended Gambler (1) |
| Thunderous Roar | 2 | 4 | 0.00 | Storm Bear (3-4) (4), Storm Bear (1-2) (2) |
| Tongue Reposition | 2 | 4 | 0.00 | Mobogo (10), Vamollaroth (20) |
| Twisted Whispers | 2 | 4 | 0.00 | Zizminarial (6), Venedaemon (5) |
| Unnerving Shriek | 2 | 4 | 0.00 | Vault Bats (8), Shimmerthief (7) |
| Unstoppable Charge | 2 | 4 | 0.00 | The Misbegotten Troll (18), Troll King (10) |
| Vanth's Curse | 2 | 4 | 0.00 | Vanth Warrior (14), Vanth (7) |
| Voltaic Blow | 2 | 4 | 0.00 | Ulgrem-Lurann (3), Ulgrem-Axaan (7) |
| Wailing Dive | 2 | 4 | 0.00 | Tamikan (16), Kongamato (11) |
| Warding Shift | 2 | 4 | 0.00 | Hellknight Field-Maralictor (8), Knight (7) |
| We're Helping! | 2 | 4 | 0.00 | Anxious Baby Scamp Swarm (3), Baby Scamp Swarm (1) |
| Whip Drain | 2 | 4 | 0.00 | Sumbreiva (16), Shianshi Waymaker (18) |
| Whip Tail | 2 | 4 | 0.00 | Jaiban (15), Mokele-Mbembe (9) |
| Whirling Death | 2 | 4 | 0.00 | Broken Centurion (10), Spiral Centurion (11) |
| Whirlwind Throw | 2 | 4 | 0.00 | Doprillu (14), Sickened Doprillu (14) |
| Wings of Shadow | 2 | 4 | 0.00 | Wyrmwraith (17), Elder Wyrmwraith (20) |
| Word of Vigor | 2 | 4 | 0.00 | Vizier Archdragon (Spellcaster) (20), Vizier Archdragon (20) |
| Worm Trill | 2 | 4 | 0.00 | Frost Worm (12), Pakano (Level 12) (12) |
| Wreck | 2 | 4 | 0.00 | Abrikandilu (4), Half-Formed Abrikandilu (2) |

## Monster abilities of one creature never used (768; less certain)

On one creature only, so 2 fights (two of it each). Not used in either.

| Ability | Creature |
|---|---|
| (Vampire, Strigoi Progenitor) Domain of Dusk | Strigoi Progenitor (13) |
| A Fairer Face | Mirror Seer (9) |
| A Kanabo to an Oni | Tino (Oni Form) (18) |
| Accelerating Inquest | Raw Nerve (8) |
| Activate Attractor | Hundun Chaos Mage (18) |
| Aerial Feint | Strix Aerialist (9) |
| Aggressive Rush | Blood Wolf (3) |
| Aging Strikes | Bythos (16) |
| Agonized Wail | Defaced Naiad Queen (15) |
| Agonizing Wail | Binumir (3) |
| Aimed Shot | Hegremon (13) |
| Aldori Parry | Jamandi Aldori (14) |
| All Are One | Warden of Oceans and Rivers (20) |
| Amber Strikes (Splash) | Sorvuth-Ka (20) |
| Ancestral Fury | Diskah Night Watcher (9) |
| Anchor (Object) | Giant Seahorse (3) |
| Anchor (Rider) | Giant Seahorse (3) |
| Anchor the Unliving | Heldin Ulgincamp (1) |
| Angry Rant | Halfling Head Chef (2) |
| Animal Tandem | Orc Gamekeeper (4) |
| Arcane Harmony | Virtuosic Lyrebird (6) |
| Arctic Embrace | Warden of Oceans and Rivers (20) |
| Armored Charge | Armored Cave Bears (9) |
| Ashen Curse | The Final Herald (12) |
| Astral Thread Control | K. H. W.'s Echo (14) |
| Attach Line | Animated Kite (1) |
| Attack from Above | Asanbosam (6) |
| Avenge the Fallen | Elven Court Guard (13) |
| Awesome Blow | Armag Twice-Born (14) |
| Bad Deal | Halfling Lucky Draw (8) |
| Baleful Gaze | Daqqanoenyent (9) |
| Barbed Cirri | Aqudel (7) |
| Barrage of Force | Apprentice Magician Clique (5) |
| Base Kinesis | Mountain Guardian (6) |
| Battering Blow | Firebrand Bastion (17) |
| Beguiling Gaze | Zuipnyrn (3) |
| Behold the Promises of Kugaptee! | Taunting Monk's Skull (6) |
| Belch Smoke | Firehoof Minotaur (7) |
| Bellow Soot | Animated Fireplace (5) |
| Beseech the Spirits | God Caller (10) |
| Bide | Shae (4) |
| Bind Destinies | Unshadowed Mariama (18) |
| Bite of the Asp Stance | Sister Endreah (4) |
| Bitter Invective | Bitter Butler (3) |
| Blackaxe - Owner's Authority | Treerazer (20) |
| Blackaxe - Rejuvenating Deforestation (Healing) | Treerazer (20) |
| Blade of Justice | Planetar (16) |
| Blade Storm | Animated Treasure Swarm (7) |
| Blazing Rush | Munsahir Gatecrasher (4) |
| Bleed for Lamashtu | Darivan (10) |
| Blessed Armaments | Angelic Host (20) |
| Blinding Flash | Agyra (20) |
| Blinding Mane | Grisantian Lion (12) |
| Blood and Fear | Interrogator (6) |
| Blood Tide | Tide Giant (13) |
| Bloody Dance | Seraptis (15) |
| Bloody Obsession | Idebilor (7) |
| Bloody Reaping | Redcap Brigade (10) |
| Bloody Wail | Warshard Wight (5) |
| Boiling Breath | Tidepool Dragonet (3) |
| Bomb Barrage | Xotani, The Firebleeder (20) |
| Bond in Light | Gliminal (9) |
| Bond with Mortals | Immortal Trickster (11) |
| Bone-Chilling Screech | Skaveling (5) |
| Bore into Brain | Yellow Musk Creeper (2) |
| Borrow Time (Regains) | Deific Vessel of Urgathoa (15) |
| Bounce Cruuk | Tripkee Fiend-Keeper (7) |
| Bouncing Crush | Gibtanius (8) |
| Bound in Death | Tomb Jelly (5) |
| Braincloud | Shoggti (7) |
| Branch Whip | Ta'apundo (19) |
| Brand of the Impenitent | Balisse (8) |
| Break Through | Orc Raiding Party (5) |
| Breath of Smoke | Mythic Phoenix Flame (4) |
| Breath of the Sea | Baomal (20) |
| Breath Weapon (Shock Maw) | Aspect of Insects (20) |
| Bright-Horned Flare | Iblydan Hind (4) |
| Brutal Blow | Xulgath Spinesnapper (5) |
| Brutal Sweep | Ice Troll (4) |
| Budding Siphon | Blooming Guardian (15) |
| Bullet Smog | Dwarf Longshot Squad (Guns) (10) |
| Burning Cold Fusillade | Owb Prophet (13) |
| Burning Rush | Striding Fire (6) |
| Burrowed Ambush | Aigamuxa (8) |
| Bury Beneath Stone | Warden of Caverns and Burrows (20) |
| Calamitous Roar | Lythazossa (20) |
| Calculated Strike | Wealthy Vigilante (8) |
| Call Down the Storm | Druid Circle (12) |
| Call of the Mire | Swamp Blight (17) |
| Call to Blood | Caligni Slayer (3) |
| Call Upon the Dead | Amnerion (20) |
| Cannonade | Bone Ship (18) |
| Captain's Command | Captain Conziva (3) |
| Captivating Lure | Kelpie (4) |
| Carve Projectile | Terra Carver (13) |
| Caustic Trench | Somnalu (15) |
| Chain Choke | Uro Adom (12) |
| Challenging Shriek | Sedacthy Marauder (4) |
| Channel Elements | Mountain Guardian (6) |
| Channel Hellfire | Sephone Haugini (9) |
| Chant of Dominance | Orc Skullcrushers (7) |
| Chaotic Spawning | Vescavor Queen (9) |
| Charge the Fallen | Dromaar Company (6) |
| Chittering Terror | Swarm Voice (3) |
| Choke | Screaming Sulfur (10) |
| Choking Swoop | Smoke Creeper (6) |
| Chop 'em Down! | Bandit Gang (7) |
| Chug | Crooked Coffin Brewer (1) |
| Circle of Horns | Aurochs Herd (7) |
| Circling the Kingdom | Taljjae (The Wanderer) (18) |
| Cite Precedent | Barrister (1) |
| Claw Storm | Behir (8) |
| Cleanse the Forest | Aso Berang (12) |
| Cleansing Earth | Humanitarian Hermit (9) |
| Clear Cut | Twigjack Bramble (6) |
| Close Ranks | Oprak Firestorm Battalion (7) |
| Cloud Cover | Peng (12) |
| Cloven Charge | House Thrune Elite Infantry (16) |
| Collect Prayer | Anguished Flame (13) |
| Collect Unholy Prayer | Anguished Hellfire (19) |
| Collective Attack | Living Mural (19) |
| Color-Draining Plumage Display | The Peacock (17) |
| Command an Animal | Daring Danika (2) |
| Compelled Performance | Zridi (8) |
| Concentrated Fire | Deg (9) |
| Concussive Blow | Harmona (11) |
| Concussive Shot | Sniper (5) |
| Conduct (Blue) | Concert Frog (8) |
| Conduct (Red) | Concert Frog (8) |
| Conduct the Experiment | Fleshwarper (7) |
| Cone of Chalk | Living Graffiti (Chalk) (3) |
| Conflagration of Jaws | Hellfire Hydra (19) |
| Constrict (Grabbed by Claws only) | Voidbracken Chuul (9) |
| Consume Emotion | Kilia Mwibo (15) |
| Consume Fear | Phasmadaemon (17) |
| Consume Memories | Vordakai (12) |
| Consume Soul (Empower Spell) | Obcisidaemon (19) |
| Consume Soul (Empower Weapon) | Obcisidaemon (19) |
| Consume Soul (Healing) | Obcisidaemon (19) |
| Consume Souls | Elder Wyrmwraith (20) |
| Consume Thoughts | Caulborn (7) |
| Coruscating Charge | Talmandor (20) |
| Crack Bones | Majungasaurus (6) |
| Crack the Shell | Dwarf Smith (1) |
| Create Gadget | Gadgeteer (6) |
| Crimson Vengeance | Veteran Reclaimer (11) |
| Crooning Cry | Rompo (5) |
| Crumbling Earth | Plated Python (12) |
| Crumbling Ground | Tallusian (5) |
| Cry of Ages | Forlorn Artist (2) |
| Crystallize Blood | Ulressia The Blessed (19) |
| Curse of Futility | Sahni Bride-Of-The-Sea (7) |
| Curse of the Saumen Kar | Ainamuuren (14) |
| Cut Across Space | Father Skinsaw (20) |
| Cutting Remarks | Courtesan (2) |
| Dance of Burning War | Caldera Oni (14) |
| Dance of Death | Necrophidius (3) |
| Dance of Destruction | Hārakasura (7) |
| Dance of Ruin | Vrock (9) |
| Dance with Death | Fiddling Bones (3) |
| Dancer's Curse | Caligni Dancer (1) |
| Daring Gambit | Ruby (17) |
| Darting Feint | Exiled Revolutionary (10) |
| Dazzling Assault | Crownbound Constellation (8) |
| Dazzling Burst | D'ziriak (3) |
| Dazzling Display | Emperor Bird (2) |
| Dead Gaze | Nosferotter (2) |
| Dead Shot | Pale Stranger (10) |
| Deafening Shriek | Deianire (7) |
| Deceptive Reposition | Coil Spy (4) |
| Deep Cut | Geff (6) |
| Defensive Posture | Protoceratops (2) |
| Demolishing Swing | Construction Worker (2) |
| Demon Hunter | Thulgant (18) |
| Despairing Cry | Chandriu Invisar (6) |
| Devil's Howl | Sandpoint Devil (8) |
| Devour | Gau Cho Rong (4) |
| Devour Curse | Imprecasia (11) |
| Devour Flesh | Ghul (5) |
| Devour Life | Baykok (9) |
| Devour Wealth | Pixiu (8) |
| Diabolic Healing | Ygracix (1) |
| Diplomatic Immunity | Envoy (1) |
| Dirty Tricks | Ratfolk Shank Squad (7) |
| Disarming Shot | Peerless Duelist (12) |
| Discharge | Shocker Lizard (2) |
| Disembowel | Ascendant Griffon (11) |
| Disfigure | Irahkatu (13) |
| Disorienting Dance | Baby Brine Shark (1) |
| Disorienting Shriek | Harpy Forager (7) |
| Disperse | Root Rotter (9) |
| Disquieting Change Shape | Ji-yook (Gumiho Form) (18) |
| Disrupt Qi | Grandmaster (17) |
| Distracting Arrow | Qarna (4) |
| Distracting Dance | Suli Dune Dancer (1) |
| Distracting Diatribe | Court Historian (1) |
| Distracting Escape | Halfling Smuggler (6) |
| Distracting Shot | Drow Shootist (8) |
| Distracting Trick | Gambling Companion (3) |
| Distracting Whistle | Tunch (5) |
| Distracting Yipping | Jewel (9) |
| Distressing Joke | The Joke (17) |
| Divergent Potential | Destiny Tempest (13) |
| Do a Jig! | Gnome Bard (1) |
| Do You Know Who I Am?! | Chelaxian Adjutant (1) |
| Dooming Proclamation | Orc Doomsayer (5) |
| Double Bite | Tarn Linnorm (20) |
| Down to Our Level | Bill-Band (5) |
| Downcast | Despairing Pall (1) |
| Dragonhide | Speiroikos (3) |
| Drain Nutrients | Somnalu (15) |
| Draining Gaze | Sykever (15) |
| Draw Blood | Camazotz Cultist (1) |
| Draw In | Doldrums Heap (9) |
| Draw the Line | Terrorguard (14) |
| Dreadful Screech | Dread Roc (15) |
| Dreadsong | Dreadsong Dancer (8) |
| Dreams of the Blackfrost Whale | Ainamuuren (12) |
| Drifting Petals | Orchid Mantis Swarm (6) |
| Droning Flyby | Derakni (8) |
| Droning Waste | Sarcovalt Swarm (9) |
| Droning Wings | Coloxus (12) |
| Dual Assault | Binumir (3) |
| Dying Breath | Engerra (9) |
| Eat a Pickle | Goblin Chef (1) |
| Ectoplasmic Lash | Bhuta Servant (12) |
| Electrical Burst | Arbiter (1) |
| Elemental Field | Aiuvarin Elementalist (2) |
| Emit Musk | Giant Pangolin (4) |
| Empowered Blast | Mountain Guardian (6) |
| Empty Yawn | Weary (1) |
| Encase | Tallow Guardian (7) |
| Energy Projector (Cold) | Juggernaut (13) |
| Energy Projector (Electricity) | Juggernaut (13) |
| Energy Projector (Fire) | Juggernaut (13) |
| Enormous Inhalation | Mu Spore (20) |
| Enslave Soul | Kalavakus (10) |
| Enticing Invitation | Alapolo (17) |
| Entropic Cry | Rumindrol (15) |
| Euphoric Breath | Fey Dragonet (2) |
| Evaporate Poison | Mask of Blackfingers (16) |
| Evil Musk | Fetid Familiar (1) |
| Exalt the Little Ones | Arboreal Shepherd (5) |
| Exhale | Shadern Immolator (1) |
| Exile | Camarach (17) |
| Exsanguinate Subject | Shulgurk (3) |
| Extend Arms | Dynamo (8) |
| Extend Legs | Dynamo (8) |
| Extend Mandibles | Giant Dragonfly Nymph (3) |
| Falchion Swipe | Vesinra (11) |
| Falling Frozen Lightning | Snow Oni (13) |
| False Blessing (Critical failure) | Blasphemer of Zon-Kuthon (2) |
| False Blessing (Failure) | Blasphemer of Zon-Kuthon (2) |
| False Foe | Japalisura (12) |
| Fang and Claw | Xulgath Ravening (4) |
| Fascinating Dance | Dancer (1) |
| Fascinating Display | Shoggti (7) |
| Fearless Switch | Archon Bastion (16) |
| Feed | Ghonhatine (10) |
| Feed on Blood | Void Zombie (1) |
| Feign Harmlessness | Paga Nikohian (9) |
| Fell Shriek | Sabosan (5) |
| Fence's Feint | Fence (5) |
| Fencing Brawl | Crime Kingpin (12) |
| Fervent Frenzy | Deep One (1) |
| Fetters of Debt | Aurosrath (5) |
| Fickle Prophecy | False Priest (4) |
| Fiery Leap | Zaiho (16) |
| Fiery Transformation | Sanzuwu (15) |
| Final Shake | Almiraj (4) |
| Flaming Strafe | Phoenix (15) |
| Flap Wings | Peng (12) |
| Flash Storm | Chaos Falcon (10) |
| Flash Web | Shriezyx (4) |
| Flicker | Flickerwisp (2) |
| Flight Commander of Dis | Munagola (11) |
| Fling Wax | Yaganty (10) |
| Flurry of Strands | Roper (10) |
| Flurry of Vengeance | Golden Erinys Novitiate Circle (5) |
| Flurry of Vines | Stelemora (7) |
| Flutter | Origami Mite (1) |
| Focused Slam | Angazhani (8) |
| Fog of Chance (Fortune) | Pearl Dragonet (1) |
| Fog of Chance (Misfortune) | Pearl Dragonet (1) |
| Forbidding Stare | Godclaw Hellcrown (7) |
| Force Communication | Convergent Soldier (16) |
| Force Dart (2 darts) | Witchwyrd (6) |
| Force Dart (3 darts) | Witchwyrd (6) |
| Forceful Winds | Living Whirlwind (5) |
| Forge Warshard Weapon | Shard-Empowered Levaloch (8) |
| Forlorn Howl | Desert's Howl (19) |
| Form a Phalanx | Skeleton Infantry (11) |
| Four-Fanged Assault | Maharaja (20) |
| Fox's Wager | Warden of Forests and Meadows (20) |
| Frenzy of Coils | Erinys (8) |
| Frightening Rattle | Akuzhail (10) |
| Frightening Shush | Velavi (2) |
| Furious Harangue | Obsessive Researcher (1) |
| Gale Breath | Elemental Hurricane (11) |
| Gather Converts | Cult Leader (7) |
| Gauge Potential | Kuworsys (12) |
| Gearsong | Clockwork Whale (17) |
| Giant Rat Trap | Vermin Catcher (2) |
| Gift of Dust | Aznithakantus (13) |
| Gift of Hospitality | Faydhaan (9) |
| Gnawing Arms | Seraptis (15) |
| Goad | Unfeeling Empath (2) |
| Goblin Song | Goblin War Chanter (1) |
| Gogunta's Croak | Boggard Cultist (8) |
| Gold? | Marp (4) |
| Gory Rend | Piscodaemon (10) |
| Gouging Lunge | Iguanodon (6) |
| Grab Attention | Fate's Prophet (14) |
| Graffiti Egg | Halfling Troublemaker (1) |
| Gravechoke | Urglid (13) |
| Great Swipe | Bolti Sorrinson (20) |
| Great Wave | The Great Flood (20) |
| Grievous Cut | Father Skinsaw (20) |
| Grim Glimmering | Nhimbaloth's Cutter (8) |
| Grind Bones | Grinder-Widget (5) |
| Grisly Display | Ghoulrilla (8) |
| Ground Pound | Argorth (11) |
| Guard Charge | Viking Guard (11) |
| Guardian Shield | Infantry Soldier (2) |
| Guardians' Curse | Vanth Guardian Flock (13) |
| Guerrilla Tactics | Sklar-Quah Warrior (8) |
| Gut Tug | Gegnir (20) |
| Hair Snare | Korred (4) |
| Hajeck's Caress | All-Seeing Hajeck (12) |
| Hallucinatory Home | Silsyche (6) |
| Hallucinogenic Cloud | Basidirond (5) |
| Hammer the Chained | Ilssrah Embermead (15) |
| Hampering Fusillade | Dwarf Longshot Squad (10) |
| Harden Chitin | Zecui Horde (11) |
| Hark! The Goblins Chanters Sing! | Stumpfield War Chanter Choir (7) |
| Harvesting Limbs | Five-Color Orchid Mantis (9) |
| Hasty Traps | Kobold Trap Squad (4) |
| Hat Toss (Befuddling Bowler) | Millindemalion (13) |
| Hat Toss (Bewitching Beret) | Millindemalion (13) |
| Hat Toss (Dazzling Deerstalker) | Millindemalion (13) |
| Hat Toss (Fettering Fedora) | Millindemalion (13) |
| Hat Toss (Tiring Tricorne) | Millindemalion (13) |
| Hazy Fear | Firehoof Minotaur (7) |
| Healing Pulse | Lightning Turtle (12) |
| Heart-Seeking Strike | Shraen Graveknight (15) |
| Heavy Stride | Clay Effigy (10) |
| Hell's Glare | Captain Lamperia Bane (3) |
| Hellish Gaze | Cerberus (6) |
| Hidden Avalanche | Living Effigy (11) |
| Hobble | Interrogator (6) |
| Hobble Pursuit | Goblin Rabble (4) |
| Hobgoblin Phalanx | Hobgoblin Veteran Regiment (9) |
| Hogtie | Drover (1) |
| Hooking Hurl | Ogre Bully (7) |
| Horrifying Screech | Zombie Owlbear (3) |
| Hundred-Handed Whirlwind | Hekatonkheires Titan (20) |
| Hunt Will | Moldering Steed (16) |
| Hunted Fear | Minotaur Hunter (4) |
| Hunting Throw | Ogre Hunter (9) |
| Hurl Corpse | Plague Giant (14) |
| Hurling Toss | Golarion's Finest (Brartork) (13) |
| Hurtful Critique | Aphorite Sharpshooter (4) |
| Hydraulic Asphyxiation | Merfolk Wavecaller (2) |
| Hypnosis | Lunar Naga (6) |
| I'll Make You Regret This! | Angry Chelaxian Adjutant (3) |
| Igniting Assault | Marrmora (15) |
| Imperious Retreat | King Merlokrep (8) |
| Implant | Xill (6) |
| Imprison Mind | Blackfrost Prophet (9) |
| Infectious Spores | Kuworsys (12) |
| Inflating Rush | Pufferfish (1) |
| Infrasonic Moan (Fear) | Cloaker (5) |
| Infrasonic Moan (Stupor) | Cloaker (5) |
| Ingest Magic | Silt Frog (6) |
| Inscribe Propaganda | Prince of Propaganda (20) |
| Insidious Query | Pyrkaion (8) |
| Insightful Swing | Khurfel (10) |
| Inspired Recitation | Mechanical Assistant (5) |
| Intimidating Charge | Pitborn Fire Giant Cavalry (11) |
| Intimidating Dive | Strix Hunter (6) |
| Into the Earth | Almiraj (4) |
| Into the Fray | Veteran War Horse (5) |
| Intuit Object (Tool) | Munavri Spellblade (2) |
| Intuit Object (Weapon) | Munavri Spellblade (2) |
| Invigorating Passion | Gancanagh (4) |
| Isolate Foes | Ximtal (17) |
| Isolating Words | Seraptis (15) |
| Item Treachery | Bolan Nogasso (2) |
| Jinxed Call | Jinx Eater (4) |
| Join the Fray | Heavy Cavalry (7) |
| Jury-Rig | Capstan Swabbie (7) |
| Keelhaul | Bone Ship (18) |
| Keep Up With Me! | Drill Sergeant (8) |
| Kharnas's Blessing | Graveknight Of Kharnas (17) |
| Kind Word | Trumpet Archon (14) |
| Knockdown | Kelorbeyan Guard (4) |
| Kob's Ruinous Strike | Kob Moleg (16) |
| Label Memories | Rhu-Chalik (6) |
| Lamia's Caress | Lamia (6) |
| Lasso | Drover (1) |
| Launch | Animated Trebuchet (13) |
| Launch Marbles | Prank Workshop Mitflit (1) |
| Lawbringer | Gunmarshal (2) |
| Leaping Slam | Bloody Hands (16) |
| Life-Siphoning Screech | Umbraex (20) |
| Lifespring Burst | Twins of Rowan (13) |
| Light Flash | Flash Beetle (1) |
| Light in the Dark | Gravedigger (1) |
| Light of Truth (Light of Truth) | Zoaem (1) |
| Light Pulse | Moonflower (8) |
| Light Up | Luminous Ooze (4) |
| Lightning Blade | Storm Giant (13) |
| Lightning Punch | Melomach (13) |
| Living Shields | Archon Bastion (16) |
| Lonely Dirge | The Lonely Warrior (6) |
| Lumbering Swings | Bhanyada Behemoth (12) |
| Lunging Strike | Giant Mantis (3) |
| Lure Whip | Lophiithu (20) |
| Luring Retreat | Kobold Egg Guardian (3) |
| Lurker Stance | Thresholder Disciple (14) |
| Magnetic Reposition | Zuhra Shuyookh (13) |
| Magnificent…! | Globetrotting Scholar (13) |
| Malevolent Possession | Ioseff Xarwin (9) |
| Mangle | Zetogeki (7) |
| March to War | Skeletal Drummer (3) |
| Mark Target | Venator (13) |
| Mask of Fate | Divine Warden of Pharasma (6) |
| Massacre | Thrune Champion Army (11) |
| Massive Strike | The Behemoth (3) |
| Masterful Engagement | Taljjae (The General) (18) |
| Mechanized Animus | Durtik (3) |
| Medical Malpractice | Surgeon (2) |
| Memory Drain | Hollow Husk (5) |
| Mend Soul | Eseneth (17) |
| Mesmerizing Tale | Halfling Yarnspinner (7) |
| Mid-air Collision (Shove) | Rocketeer (6) |
| Mid-air Collision (Trip) | Rocketeer (6) |
| Mind if I Borrow That? | Gnome Philomath (1) |
| Mindwarping Tide | Vaspercham (17) |
| Mischief | Larabay (11) |
| Missile Volley | Nightmarchers (14) |
| Misty Mauling | Mist Bear (7) |
| Mocking Cry | Karina (5) |
| Moment of Truth | Cyclops Seeker (10) |
| Mortal Reflection | Imperfect Automaton (6) |
| Mosh | Gulzash (4) |
| Mountain of Iron | Yollen Frivetti (8) |
| Mounted Charge | Iriatykian Outrider Band (7) |
| Mumbletongue | Bodach (6) |
| Muscular Leap | Ecorche (16) |
| Musketeer's Advance | Musketeer (3) |
| Nauseating Croak | Tormonwird (5) |
| Neck Snap | The Carcass Man (13) |
| Nightmare Assault | Black Whale Guard (F3) (12) |
| No Hard Feelings | Propagandist (3) |
| No Retreat | Dark Talon Kobold (2) |
| Nova Burst | Sunburst Corpse (14) |
| Noxious Breath | Grauladon (2) |
| One for All | Musketeer (3) |
| Opportune Snack | Vescavor Queen (9) |
| Orogenesis Dive | Warden of Peaks and Skies (20) |
| Otherworldly Laugh | Korred (4) |
| Otherworldly Roar | Idovik (7) |
| Overacted Strike | Traveling Actor (3) |
| Overambitious Spell (Critical failure) | Exuberant Apprentice (4) |
| Overflow | Dewdrop Jelly (1) |
| Overrun | Hobgoblin Veteran Regiment (9) |
| Overwhelm | Giant Ant Army (7) |
| Oviposit | Ironclad Annihilator Beetle (20) |
| Pain-Fueled Roar | Durnolith (9) |
| Painful Harmonics | Destrachan (8) |
| Paint the Masses | Living Mural (19) |
| Pantomime (Rope) | Mime (3) |
| Paralytic Fear | Nosferatu Overlord (15) |
| Pay For Every Inch | Einherji Host (15) |
| Pent-Up Taunt | Zini (1) |
| Perfect Formation | Hobgoblin Battalion (6) |
| Petrify Body Part | Stony Bat (3) |
| Piercing Fangs | Warcat of Rull (13) |
| Pilgrim's Ward | Algriever (9) |
| Pinpoint Weakness | Tsimaan (1) |
| Pitch Bale | Farmer (1) |
| Plant Spores | Spitting Sawfly (10) |
| Pluck | Cliffhunter Pteranodon (2) |
| Poisonous Flurry | Wereant Poisoner (17) |
| Pose a Riddle | Elder Sphinx (16) |
| Powerful Sweep | Golarion's Finest (Jun) (13) |
| Powerful Swipe | Shikwashim Mercenary (9) |
| Powerful Uppercut | Golarion's Finest (Han) (13) |
| Pox the Land | Kothogaz, Dance Of Disharmony (20) |
| Pragmatic Aid | Kholo Pragmatist (1) |
| Pre-Programmed Greeting | Clockwork Brewer (3) |
| Primal Roar | Beast Eidolon (10) |
| Pry | Tooth Fairy Swarm (3) |
| Psychic Daze | Ulat-Kini Mindreaver (7) |
| Psychic Howl | Qurashith (17) |
| Pull | Clockwork Fabricator (4) |
| Pull Filament | Cave Fisher (2) |
| Pull String | Clockwork Puppeteer (12) |
| Pull the Strands | Roper (10) |
| Pummeling Barrage | Ectoplasmic Amalgam (15) |
| Pummeling Charge | Angazhani (8) |
| Pummeling Winds | Blustering Gale (11) |
| Punish Soul | Amnerion (20) |
| Punish the Wayward | Adiutor (5) |
| Purifying Flames | Exorcist (8) |
| Radiant Wings | Quetz Coatl (10) |
| Raise Shields | Einherji Host (15) |
| Raking Sand (Disarm) | Zaramuun (16) |
| Rampage | Golem (8) |
| Rapid Rake | Aurumvorax (9) |
| Rapid Stinging | Black Scorpion (15) |
| Raptor Leap | Velociraptor Pack (5) |
| Rattling Bones | Skeleton Mob (6) |
| Ravenous Breath Weapon (Shadows) | Urbulinex (18) |
| Ravenous Repast | Ravener Husk (14) |
| Ravenous Void | Nasurgeth (20) |
| Razor-Edged Flight | Ascendant Griffon (11) |
| Reach Beyond | Golarion's Finest (Rajna) (13) |
| Rear Back | Kuworsys (12) |
| Recount Epic | Raelis (11) |
| Reduce Options | Weredigo (15) |
| Reel Thread | Hala The Rod (20) |
| Release Claw (Tidal Gourd) | Tehialai-Thief-of-Ships (13) |
| Remember, You're Under Oath | Judge (1) |
| Renewed Vigor | Zashathal Head-Taker (15) |
| Repentant Defiance | Penitent of Calistria (1) |
| Reposition | Otyugh (4) |
| Resanguinate | Immortal Ichor (15) |
| Rescue | Caterpillar Carriage (18) |
| Reshape the Battle | Orc Veteran Master (10) |
| Resonant Wail | Talamira (13) |
| Resonating Kick | Atrixyl (11) |
| Respect Your Elders! | Matsuki Shou (5) |
| Retract Tongue | Froghemoth (13) |
| Revenant Reload | Pale Stranger (10) |
| Reverse Polarity | Living Lodestone (6) |
| Ricochet | Vewslog (9) |
| Rip Out | Fogfisher (4) |
| Ripping Maul | Zombie Brown Bear (3) |
| Riptide Silt | Coral Juggernaut (9) |
| Rocketing Strafe | Rocketeer (6) |
| Rolling Assault | Avarek (8) |
| Root in Place | Root Leshy Groundskeeper (1) |
| Run Them Over! | Hana's Hundreds (15) |
| Rupturing Shriek | Velicarn's Head (9) |
| Rush and Steal | Goblin Rabble (4) |
| Rusting Grasp | Vexgit (1) |
| Sacrificial Takedown | Hhrulkaz (3) |
| Sage's Analysis | Sage (6) |
| Sanguine Mauling | Vrykolakas Ancient (13) |
| Scampering Theft | Marp (4) |
| Scatter Blocks | Toymaker (3) |
| Scimitar Assault | Qadiran Camel Corps (6) |
| Scimitar Storm | Lamia Matriarch (8) |
| Scorching Maul | Smoldering Leopard (3) |
| Scorpion Sting | Desert Manticore (12) |
| Scouring Surge | Unaasi (11) |
| Scrabbling Swarm | Squirrel Swarm (1) |
| Scraping Clamor | Washboard Dog Tough (7) |
| Scratch | Goblin Dog (1) |
| Scratch and Bite | Clockwork Runner Pack (5) |
| Seize | Graul (4) |
| Seize Soul | Eseneth (17) |
| Separate Astral Body | The Weaver in Dreams (15) |
| Serrated Takedown | Druulbach (12) |
| Serve | Brochmaw (13) |
| Shade Breath | Lesser Shadow Scamp (1) |
| Shadow Rapier | Cadaverous Rake (8) |
| Shadowed Blade | Caligni Vanguard (5) |
| Shambler's Lament | Dirge Piper (3) |
| Shard Volley | Pelegox Cube (11) |
| Share Burden (Drained) | Curse Monger (14) |
| Share Burden (Enfeebled) | Curse Monger (14) |
| Share Burden (Stupefied) | Curse Monger (14) |
| Share Devotion | Deep One (1) |
| Share the Skin | Skinskitter (1) |
| Shatter Spell | Hobgoblin Spellbreaker (3) |
| Shattering Scrape | Morthak (4) |
| Shields Up! | Dwarf Battalion (6) |
| Shoot Down | Gendarme (8) |
| Shove | Mullun (4) |
| Shove and Run | Stony Goat (2) |
| Shred Soul | Eseneth (17) |
| Shrieking Slam | Mjolgat (4) |
| Silver Breath | House Drake (1) |
| Silver Sustenance | Ailuran (5) |
| Siphon Blood | Turkek (7) |
| Siphon Voice | Niallana (15) |
| Skewering Strikes | Iriatykian Outrider Band (7) |
| Skin Net | Skinslough (4) |
| Slagblade Storm | Temperbrand (18) |
| Slam Doors | Doorwarden (5) |
| Slashing Claws | Tor Linnorm (20) |
| Slashing Snare | Four-Tooth (7) |
| Slashing Surge | Vault Keeper (14) |
| Sliding Earth | Living Landslide (5) |
| Slippery Fighter | Graelar the Whisper (18) |
| Sly Disarm | Gimmerling (12) |
| Smog Cloud | Daelum (4) |
| Smoky Retreat | Jekkajak (4) |
| Smother | Omox (12) |
| Snare Master | Castaway (5) |
| Sniping Shot | Shobhad Sniper (17) |
| Soaking Strike | Ssumzili (12) |
| Sob | Crying Cicada (3) |
| Somersault Attack | Tournament Combatant (5) |
| Sommelier's Trick | Brensen Firecask (7) |
| Song of Freedom | Einherji Host (15) |
| Song of the Lost | Benthic Reaver (20) |
| Song of the Skies | Warden of Peaks and Skies (20) |
| Songstrike | Castruccio Irovetti (16) |
| Soporific Stench | The Count of Petals (6) |
| Soul Dance Stance | Zhang Yong (14) |
| Soul Feeding | Shroudwing (4) |
| Soul Lock | Cacodaemon (1) |
| Sound Mimicry | Graul (4) |
| Sparking Bite | Ulgrem-Lurann (3) |
| Spear Dance | Iobane Magus (13) |
| Spear Parry | Kholo Pragmatist (1) |
| Spears, Teeth, and Horns | Xulgath Dinosaur Cavalry (13) |
| Spectral Charge | Last Guard (20) |
| Spinning Toss | Champion Automaton (10) |
| Spirit Shot | Duskwalker Ghost Hunter (4) |
| Spiritual Anguish | Amyleda Blackwell (9) |
| Spiritual Edge | Spirit Priest (5) |
| Spit Up | Draconic Fumecrux (9) |
| Spray Musk | Skunk (1) |
| Spray Perfume | Flumph (1) |
| Spray Pus | Nucol (4) |
| Spread Decay | Shisagishin (12) |
| Spring Forward | Animated Bamboo Figurine (2) |
| Spring Up | Vanara Disciple (1) |
| Sprinkle Pixie Dust (Memory Loss) | Pixie (4) |
| Squeak of Doom | Nosferotter (2) |
| Stab and Twist | Ocean Nomad (6) |
| Stabbing Fit | Pavetta Stroon-Drelev (9) |
| Starry Presence | Iruxi Masked Mummer (9) |
| Stay in the Fight! | Standard Bearer (4) |
| Steal Breath | Vrykolakas Ancient (13) |
| Steal Face | Vulot (20) |
| Sting of the Lash | Daring Danika (2) |
| Stir Doubts | Creeping Evil (8) |
| Storm of Branches | Phytohydra (12) |
| Storm of Claws | Izfiitar (20) |
| String Astral Body | The Weaver in Dreams (15) |
| Stumblefoot | Bodach (6) |
| Stunning Display | Thulgant (18) |
| Stunning Pulse | Nymolus (10) |
| Subsonic Pulse | Harmona (11) |
| Suck Innards | Rakkatak (5) |
| Summon Pack | Wild Hunt Hound (14) |
| Sun's Heat | Sunscale Serpent (14) |
| Suppurating Passage | Kothogaz, Dance Of Disharmony (20) |
| Suspend Soul | Quintessivore (10) |
| Swarm Steal | Ether Sprite Swarm (3) |
| Swarming Infestation | Derghodaemon (12) |
| Swarming Needles | Ether Sprite Swarm (3) |
| Sweeping Axes | Troll Warleader (10) |
| Sweeping Hammer | Marguk Cleftneck (7) |
| Swinging Strike | Acrobat (2) |
| Swirling Blade | Tengu Bladesmith (6) |
| Tactical Gnaw | Jiidon (3) |
| Tail Lash | Emperor Bird (2) |
| Tangle Prey | Dromaar Mountaineer (2) |
| Targeted Sting | Gigantic Bee Royal Guardian (6) |
| Teach You a Lesson | Necromancer Troop (19) |
| Team Attack | Fortune Eater (7) |
| Tear Fate | The Prince of Wolves (19) |
| Teasing Taunt | Velour (2) |
| Telekinetic Crystalline Assault | Talamira (13) |
| Telepathic Ballad (Courageous Anthem) | Love Siktempora (16) |
| Telepathic Ballad (Rallying Anthem) | Love Siktempora (16) |
| Telepathic Feedback | Formian Queen (17) |
| Telepathic Pounce | Shotalashu (2) |
| Teleporting Clothesline | Grappling Spirit (9) |
| Tempest Tether | Flying Mountain Kaminari (18) |
| Temporal Strike | Bythos (16) |
| Tendril Feeding | Creeping Clot (5) |
| Tentacle Eruption | Vintalax, The Rotting God (14) |
| Tentacular Burst | Iffdahsil (20) |
| Terminal Tug | Skull Fairy (3) |
| Terrifying Gaze | Tenome (4) |
| Terrifying Howl | Metuak (13) |
| Terrifying Roar | Biloko Reaver (10) |
| Terrifying Squeal | Blood Boar (6) |
| Terrifying Stare | Hellcrown (1) |
| There, There | Demom (3) |
| This Is My Reality! | Failed Prophet (10) |
| Thorn Volley | Sard (19) |
| Throw Shadow Blade | Scathka (12) |
| Thunder of Hooves (Demoralize) | Heavy Cavalry (7) |
| Thunder of Hooves (Trip) | Heavy Cavalry (7) |
| Thunderous Croak | Silt Frog (6) |
| Thunderous Slam | Grootslang (16) |
| Tide of Creation | Eunemvro (5) |
| To Shreds | The Scourge of Woodsedge (15) |
| Tormenting Touch | Precentor (16) |
| Tortured Screech | Scylla (16) |
| Toss Dynamite | Demolitionist (4) |
| Toss Kobold | Ogre Hurler (4) |
| Totems of the Past | Iruxi Ossature (5) |
| Toxic Bite | Blue-Ringed Octopus (1) |
| Trail of Flame | Eberark (10) |
| Trample (Ooze Form Only) | Temperbrand (18) |
| Trample into the Earth | Avalanche Legion (11) |
| Trampling Charge | Raised Cavalry (19) |
| Tricky Throw | Tanuki Village Hero (1) |
| Trio's Torment | Ghostlight Sister (6) |
| Tripping Tide | Island Oni (17) |
| Tug | Bregdi (9) |
| Twang | Shrine Maiden (9) |
| Twin Chop | Troll Guard (15) |
| Twist Time | Xae (11) |
| Twisting Thrash | Werecrocodile (2) |
| Two-Headed Strike | Baomal (20) |
| Unavoidable Question (Demoralize) | Inspector (3) |
| Unbelievable Connection | Enigmatic Conspirant (4) |
| Unfair Aim | The Stag Lord (6) |
| Unnatural Shriek | Argorth (11) |
| Unnerving Hiss | Hiss Beetle (1) |
| Unseating Sweep | Whipping Willow (4) |
| Unsteadying Magnetism | Magnetic Skink (1) |
| Vengeful Frenzy | Path Maiden (12) |
| Vengeful Suffocation | Onryo (12) |
| Venomous Gaze | Virulak Necromancer (7) |
| Vent Fumes | Somnalu (15) |
| Vesinra's Caress | Vesinra (11) |
| Vicious Blow | Oread Guard (1) |
| Vicious Mauling | Omorphos (8) |
| Vie for Victory (Demoralize) | Triumph Siktempora (14) |
| Vie for Victory (Disarm) | Triumph Siktempora (14) |
| Vie for Victory (Shove) | Triumph Siktempora (14) |
| Vie for Victory (Trip) | Triumph Siktempora (14) |
| Viscous Choke | Fuath (1) |
| Vitality Drain | Wraithvine Offshoot (4) |
| Void Ray | Devasance (16) |
| Vomit Alchemy | Alchemical Drudge (2) |
| Wail of the Betrayed | Avsheros the Betrayer (20) |
| Want to Try Me? | Hu Ban-Niang (5) |
| Warp Reality | Seugathi Reality Warper (9) |
| Water Sprint | Bog Strider (2) |
| Wavecrash | Elven Waverider Troop (11) |
| Weaseling Words | K'zaard The Drover (6) |
| Weeping Moan | Wailing Ghost (2) |
| Whimsical Twirl | Whimsical Butler (3) |
| Whipping Wing | Roxy (2) |
| Whirling Attack | Weapon Master (Under the Pale Sun Dervishes) (13) |
| Whirling Blades | The First Blade (15) |
| Whirling Frenzy | Thrasfyr (17) |
| Whirlwind Form (Form) | Uthul (14) |
| Whisper Earworm | Deimavigga (17) |
| Whispering Retreat | Kerrdremak (1) |
| Whispers of Despair | Vinculatti (11) |
| Whispers of Weakness | Caydserris Arudora (15) |
| Whistling Threat | Gurlunk (4) |
| Wild Leadership | Gnome Conservationist (6) |
| Wind Strike | Cloud Giant (11) |
| Wind-Up Soldier | Toymaker (3) |
| Wings of Flame | Ifrit (9) |
| Words of Encouragement | Courtesan (2) |
| Wound Thief (Holy) | Hārakasura (7) |
| Wound Thief (Unholy) | Hārakasura (7) |
| Wrath of Asmodeus | Thrune Champion Army (11) |
| Wrathful Strike | Fiendish Viro Ahala (7) |
| Wrench Spirit | Esobok (3) |
| Zinba Restoration | Zinba (10) |
| Zura's Gift | Miranette (7) |
