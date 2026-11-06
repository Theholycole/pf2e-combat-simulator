# Combo feats: valued from their actions

Generated 2026-11-05 by tools/combo-feats.mjs. Not simulated (Cole, 2026-11-05: a feat that is just a combination of basic actions takes the value of its actions, with the action cost).

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
| Reloading Trick | 1 | Interact (reload) + Strike (hand crossbow or gauntlet bow) | reload | +0.160 |  |
| Bullet Dancer Reload | 1 | Strike + Interact (reload) (Bullet Dancer Stance) | reload | +0.160 |  |
| Running Reload | 1 | Stride, Step or Sneak + Interact (reload) | reload | +0.160 |  |
| Nightwave Springing Reload | 1 | Leap + Interact (reload) | reload | +0.160 |  |
| Quick Bomber | 1 | Interact (draw a bomb) + Strike | reload | +0.160 | a bomb each throw: a draw every turn, as a reload |
| Risky Reload | 1 | Interact (reload) + Strike; a miss misfires | reload | +0.140 | a failed Strike misfires (about half the time): less the cost of clearing it |
| Imperious Aura | 0 | a kinetic aura stance impulse as a free action as its turn begins | strike | +0.040 | the one action its stance costs, once a fight (the stance's own value is its own feat's) |
| Hurling Charge | 2 | ranged Strike + Stride + Interact (draw) | draw | +0.040 |  |
| Quick Draw | 1 | Interact (draw) + Strike | draw | +0.040 |  |
| Quick Shot | 1 | Interact (draw a bow or crossbow) + Strike | draw | +0.040 |  |
| Brandishing Draw | 1 | Interact (draw) + Strike or finisher | draw | +0.040 |  |
| Peafowl Strut | 1 | Step, Step + Strike (Peafowl Stance) | step, step | +0.020 |  |
| Guarded Advance | 1 | Raise a Shield + Step, Step | step, step | +0.020 |  |
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
| Dastardly Dash | 1 | Stride (half) + Trip or Dirty Trick (flourish) | maneuver | +0.013 |  |
| Skirmish Strike | 1 | Step + Strike | step | +0.010 |  |
| Spear Dancer | 1 | Step + Strike (spear or polearm) | step | +0.010 |  |
| For the Fallen! | 1 | Step + Strike (press) | step | +0.010 |  |
| Crossbow Ace | 1 | Create a Diversion or Take Cover + Interact (reload) | cover | +0.010 |  |
| Infiltrator's Reload | 1 | Interact (reload) + Hide, Sneak or Take Cover | cover | +0.010 |  |
| Silent Step | 1 | Step + Hide or Sneak | stealth | +0.010 |  |
| Guarded Advance (Knight Vigilant) | 1 | Step + Raise a Shield | step | +0.010 |  |
| Elf Step | 1 | Step, Step | step | +0.010 |  |
| Wing Step | 1 | Step, Step | step | +0.010 |  |
| Sudden Leap | 2 | Leap, High or Long Jump + Strike | move | +0.007 | saves an action only with a High or Long Jump |
| Flying Kick | 2 | Leap, High or Long Jump + Strike | move | +0.007 | saves an action only with a High or Long Jump |
| Furious Sprint | 2 | Stride ×5 (×8 for 3 actions) | move | +0.006 | only long dashes; most fights don't need them |
| Tactical Entry | 0 | Stride, free, before anyone acts (Stealth initiative) | stride | +0.006 | only when it rolled Stealth for initiative |
| No Escape | 0 | Stride after a retreating foe (reaction) | stride | +0.006 | foes seldom retreat |
| Reactive Pursuit | 0 | Stride after a retreating foe (reaction) | stride | +0.006 | foes seldom retreat |
| Shadow Tempo | 0 | Stride following an ally (reaction) | stride | +0.006 |  |
| Battlefield Agility | 1 | Strike + Step (while flanked) | step | +0.004 | only when flanked by two foes |
| Clever Gambit | 0 | Step or Stride, as a reaction to a critical hit on a creature it Recalled Knowledge on | stride | +0.004 |  |
| Coursing Weave | 0 | Stride or Fly, as a reaction to a missed ranged attack | stride | +0.004 | ranged attacks on it are rare |
| Shark Attack | 2 | Swim, Swim + Strike | move | +0.003 | under water only |
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
