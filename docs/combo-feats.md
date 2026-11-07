# Combo feats: valued from their actions

Generated 2026-11-07 by tools/combo-feats.mjs. Not simulated (Cole, 2026-11-05: a feat that is just a combination of basic actions takes the value of its actions, with the action cost).

Every PC already has the basic actions, and each rated alone is worth about 0 levels (run/basics.jsonl), so a combo feat is worth the actions it saves: **saved actions × what one is worth × how often a fight it matters**.

| Saved action | Worth each time (levels) | Times a fight | From |
|---|---|---|---|
| a general action (becomes a Strike) | 0.040 | 4 | Duelist's Form (quickened stance) +0.13 over ~3.3 extra actions |
| a reload (frees a Strike) | 0.040 | 4 | as a general action, each turn for a reload weapon |
| a draw | 0.040 | 1 | as a general action, once a fight |
| a Stride, Fly, Swim, jump | 0.012 | 1.25 | Sudden Charge +0.015 at 1.25 uses a fight |
| a Step | 0.008 | 1.25 | two thirds of a Stride |
| Raise a Shield, Take Cover, Hide, Sneak, a maneuver | 0.010 | 1–4 | forced Raise a Shield ≈ 0.045 a turn below a general action |
| Recall Knowledge, picking something up | 0 | — | nothing a fight counts |

| Feat | Cost | Folds in | Saves | Levels a fight | Note |
|---|---|---|---|---|---|
| Speed of Arms | 0 | a Strike or a Stride as its turn begins (reaction) | strike | +0.160 | its first Strike at each foe at mythic proficiency, not counted |
| Reloading Strike | 1 | one-handed melee Strike + Interact (reload) | reload | +0.160 |  |
| Infiltrator's Draw | 1 | Interact (draw or reload a hand crossbow) + Strike | reload | +0.160 | once a round |
| Guerrilla Assault | 1 | Interact (reload a sling or blowgun) + Strike | reload | +0.160 | once a round; hidden after it if it was undetected, not counted |
| Reloading Trick | 1 | Interact (reload) + Strike (hand crossbow or gauntlet bow) | reload | +0.160 |  |
| Bullet Dancer Reload | 1 | Strike + Interact (reload) (Bullet Dancer Stance) | reload | +0.160 |  |
| Running Reload | 1 | Stride, Step or Sneak + Interact (reload) | reload | +0.160 |  |
| Nightwave Springing Reload | 1 | Leap + Interact (reload) | reload | +0.160 |  |
| Quick Bomber | 1 | Interact (draw a bomb) + Strike | reload | +0.160 | a bomb each throw: a draw every turn, as a reload |
| Risky Reload | 1 | Interact (reload) + Strike; a miss misfires | reload | +0.140 | a failed Strike misfires (about half the time): less the cost of clearing it |
| Touch and Go | 1 | Step + Interact (switch mode) + Interact (reload) | step, reload | +0.048 | a combination weapon |
| Covered Reload | 1 | Take Cover or Hide + Interact (reload) | cover | +0.040 | each turn with a reload weapon, where it can take cover |
| Ten Paces | 0 | Interact (draw a firearm or crossbow) as initiative is rolled | draw | +0.040 | its +2 initiative not counted |
| Bombing Run | 2 | Fly + Interact (draw a bomb) + Strike | draw | +0.040 | with a fly Speed |
| Artist's Attendance | 2 | Stride, Stride + Trace a Rune | strike | +0.040 |  |
| Imperious Aura | 0 | a kinetic aura stance impulse as a free action as its turn begins | strike | +0.040 | the one action its stance costs, once a fight (the stance's own value is its own feat's) |
| Hurling Charge | 2 | ranged Strike + Stride + Interact (draw) | draw | +0.040 |  |
| Quick Draw | 1 | Interact (draw) + Strike | draw | +0.040 |  |
| Quick Shot | 1 | Interact (draw a bow or crossbow) + Strike | draw | +0.040 |  |
| Brandishing Draw | 1 | Interact (draw) + Strike or finisher | draw | +0.040 |  |
| Marathon Dash | 1 | Stride + allies within 10 feet Stride as a reaction | stride, stride | +0.024 |  |
| Scout's Pounce | 2 | Stride + Strike, Strike | strike | +0.020 | hidden from all foes and 10 feet from them; its off-guard target not counted |
| Peafowl Strut | 1 | Step, Step + Strike (Peafowl Stance) | step, step | +0.020 |  |
| Guarded Advance | 1 | Raise a Shield + Step, Step | step, step | +0.020 |  |
| Rippling Spin | 0 | Step + Disarm or Trip (reaction, as it's hit in melee) | step, maneuver | +0.018 | in Reflective Ripple Stance |
| Maneuvering Spell | 0 | Step, Leap or Stand (free, as it casts a 2-action spell) | step | +0.016 |  |
| Quick Positioning | 0 | Step, Step as its first action | step, step | +0.016 | once a fight, seeing its prey at initiative |
| Cycle Elemental Stance | 1 | Stride or Step + enter another elemental stance | stride | +0.015 |  |
| Tandem Movement | 1 | it and its eidolon Stride | stride | +0.015 |  |
| Flyby Attack | 2 | Fly + Strike | move | +0.015 |  |
| Rabid Sprint | 2 | Stride, Stride, Stride | stride | +0.015 | both hands free |
| Incredible Sprint | 2 | Stride, Stride, Stride | stride | +0.015 |  |
| Predator's Pounce | 1 | Stride + Strike (light or no armor) | stride | +0.015 |  |
| Mobile Magical Combat | 1 | Stride + Strike (after a spell) | stride | +0.015 |  |
| Liberating Dive | 2 | Fly + melee Elemental Blast (+ an ally's Escape) | move | +0.015 |  |
| Antler Rush | 2 | Stride, Stride + Strike, Shove or Disarm | stride | +0.015 |  |
| Falcon Swoop | 2 | Fly, Fly + Strike | move | +0.015 |  |
| Fantastic Leap | 2 | High or Long Jump (2) + Strike | move | +0.015 |  |
| Pounding Leap | 2 | Strike + High or Long Jump (2) | move | +0.015 |  |
| Winding Flow | 1 | two of Stand, Step, Stride | stride | +0.015 |  |
| Doctor's Visitation | 1 | Stride + Battle Medicine | stride | +0.015 |  |
| Zealous Rush | 0 | Stride, as a reaction to a self spell | stride | +0.015 |  |
| Elude Trouble | 0 | Stride, as a reaction to a missed melee attack | stride | +0.015 |  |
| Embrace the Pain | 0 | Grapple or Disarm (reaction, as a foe's melee attack damages it) | maneuver | +0.013 |  |
| Dastardly Dash | 1 | Stride (half) + Trip or Dirty Trick (flourish) | maneuver | +0.013 |  |
| Winged Mantle | 1 | Stand + Interact (pick up or draw a weapon), no reactions | draw | +0.012 | when wounded, after being down |
| Scurry! | 0 | Stride to cover as initiative is rolled | stride | +0.012 |  |
| Final Surge | 1 | Stride, Stride (its Drakeheart Mutagen ends) | stride | +0.012 | ends the mutagen |
| Keep Pace | 0 | Stride (reaction, as its prey moves away) | stride | +0.012 |  |
| Tangled Forest Rake | 1 | lashing branch Strike + Reposition 10 feet (no check) | maneuver | +0.010 | in Tangled Forest Stance |
| Fleeting Shadow | 2 | Hide + Sneak, Sneak | stealth | +0.010 |  |
| Knockback | 1 | a successful Shove, no check, after a hit | maneuver | +0.010 |  |
| Topple Foe | 0 | Trip (reaction, as an ally hits a foe beside them both) | maneuver | +0.010 |  |
| Disarming Block | 0 | Disarm (free, after a Shield Block on a held weapon's Strike) | maneuver | +0.010 |  |
| Illimitable Finisher | 1 | Step + a one-action finisher (bravado) | step | +0.010 |  |
| Lunge | 1 | Strike with 5 feet more reach | step | +0.010 |  |
| Positioning Assault | 2 | two-handed Strike + Reposition 5 feet (no check) | maneuver | +0.010 |  |
| Running Recharge | 1 | recharge Spellstrike + Stride half or Step | step | +0.010 |  |
| Goblin Scuttle | 0 | Step (reaction, as an ally ends a move beside it) | step | +0.010 |  |
| Skirmish Strike | 1 | Step + Strike | step | +0.010 |  |
| Spear Dancer | 1 | Step + Strike (spear or polearm) | step | +0.010 |  |
| For the Fallen! | 1 | Step + Strike (press) | step | +0.010 |  |
| Crossbow Ace | 1 | Create a Diversion or Take Cover + Interact (reload) | cover | +0.010 |  |
| Infiltrator's Reload | 1 | Interact (reload) + Hide, Sneak or Take Cover | cover | +0.010 |  |
| Silent Step | 1 | Step + Hide or Sneak | stealth | +0.010 |  |
| Guarded Advance (Knight Vigilant) | 1 | Step + Raise a Shield | step | +0.010 |  |
| Elf Step | 1 | Step, Step | step | +0.010 |  |
| Wing Step | 1 | Step, Step | step | +0.010 |  |
| Warp Path | 1 | teleport 30 feet + melee Strike | stride | +0.007 | while veiled |
| Sudden Leap | 2 | Leap, High or Long Jump + Strike | move | +0.007 | saves an action only with a High or Long Jump |
| Flying Kick | 2 | Leap, High or Long Jump + Strike | move | +0.007 | saves an action only with a High or Long Jump |
| Feral Scramble | 2 | Climb + claw Strike + Athletics | move | +0.006 | in hybrid or animal shape |
| Furious Sprint | 2 | Stride ×5 (×8 for 3 actions) | move | +0.006 | only long dashes; most fights don't need them |
| Tactical Entry | 0 | Stride, free, before anyone acts (Stealth initiative) | stride | +0.006 | only when it rolled Stealth for initiative |
| No Escape | 0 | Stride after a retreating foe (reaction) | stride | +0.006 | foes seldom retreat |
| Reactive Pursuit | 0 | Stride after a retreating foe (reaction) | stride | +0.006 | foes seldom retreat |
| Shadow Tempo | 0 | Stride following an ally (reaction) | stride | +0.006 |  |
| Toppling Transformation | 0 | Shove or Trip (reaction, as a polymorph grows it) | maneuver | +0.005 |  |
| Forest Stealth | 1 | Take Cover + Hide | stealth | +0.004 | in a forest or jungle, beside cover |
| Exploit Blunder | 0 | Step (reaction, a foe it Devised a Stratagem against misses it) | step | +0.004 |  |
| Sunless Slide | 2 | Step + a spell of 2 actions or fewer | step | +0.004 | in dim light or darkness; saves the Step only with a 2-action spell |
| Battlefield Agility | 1 | Strike + Step (while flanked) | step | +0.004 | only when flanked by two foes |
| Seize Advantage | 0 | Step or Stride (reaction, its student's critical hit) | stride | +0.004 |  |
| Clever Gambit | 0 | Step or Stride, as a reaction to a critical hit on a creature it Recalled Knowledge on | stride | +0.004 |  |
| Coursing Weave | 0 | Stride or Fly, as a reaction to a missed ranged attack | stride | +0.004 | ranged attacks on it are rare |
| Predator's Growl | 0 | Demoralize (reaction, after Seeking a hidden foe) | maneuver | +0.003 |  |
| Shark Attack | 2 | Swim, Swim + Strike | move | +0.003 | under water only |
| Swamp Stealth | 1 | Take Cover + Hide | stealth | +0.003 | in a swamp, beside cover |
| Opportunistic Grapple | 0 | Grapple (reaction, its prey critically misses it) | maneuver | +0.002 |  |
| Knight's Retaliation | 0 | Disarm, Shove or Trip (reaction, an undead critically misses it) | maneuver | +0.001 | undead only |
| Instructive Strike | 1 | Strike + Recall Knowledge | knowledge | +0.000 |  |
| Combat Assessment | 1 | melee Strike + Recall Knowledge | knowledge | +0.000 |  |
| Magus's Analysis | 1 | Recall Knowledge + recharge Spellstrike | knowledge | +0.000 |  |
| Shamble | 2 | Stride, Stride, ignoring difficult terrain | nothing | +0.000 | about even with two Strides |
| Green Dash | 1 | Stride +15 feet | nothing | +0.000 | about even with a Stride |
| Expeditious Inspection | 0 | Recall Knowledge, Seek or Sense Motive (free) | knowledge | +0.000 |  |
| Thoughtful Reload | 1 | Recall Knowledge + Interact (reload) | knowledge | +0.000 |  |
| Springboard | 1 | Leap, no reactions from the foe it struck | nothing | +0.000 | about even with a Stride |
| Wild Stride | 2 | Stride, Stride, +5 or +10 feet | nothing | +0.000 | a little faster, no action saved |
| Ghostly Stride | 1 | Stride half its Speed, no reactions, through foes | nothing | +0.000 | about even with a Stride |
| Scamper | 1 | Stride +5 feet, +2 AC against its reactions | nothing | +0.000 | about even with a Stride |
| Swift Leap | 1 | Leap, no reactions | nothing | +0.000 | about even with a Stride |
| Four Winds | 2 | up to 4 allies Stride half their Speed | nothing | +0.000 | four half-Strides bought with two of the kineticist's actions: about even |
| Practiced Opposition | 1 | Recall Knowledge + Strike (undead) | knowledge | +0.000 |  |
| Makeshift Strike | 1 | Interact (pick up) + Strike | pickup | +0.000 |  |
| Magpie Snatch | 2 | Stride, Stride + Interact (pick up) | pickup | +0.000 |  |
| Bashing Charge | 2 | Stride, Stride (Force Open on the way) | nothing | +0.000 |  |
| Hopping Stride | 1 | Stride (Speed − 10, over difficult terrain) | nothing | +0.000 |  |
| Shift the Little Ones | 1 | Stride (allies Step aside) | nothing | +0.000 |  |
| Light Paws | 2 | Stride + Step | nothing | +0.000 |  |
| Retaliating Rescue | 2 | Stride + Strike | nothing | +0.000 |  |
| Wall Run | 1 | Stride (up walls) | nothing | +0.000 |  |
| Determined Dash | 2 | Stride, Stride | nothing | +0.000 |  |
| Skyseeker | 2 | Leap + Strike (Sky and Heaven Stance) | nothing | +0.000 |  |
| Death from Above | 2 | Leap (Athletics) + Strike | nothing | +0.000 |  |
