# Abilities: decisions

Milestone 3, first slice: creatures use the basic actions and their monster abilities in the simulation. The ability module (`pf2e-automatic-ability-resolution`) compiles them from PF2e's data, the core resolves them (the `check` family for skill actions, `save` for breath weapons and the like), and `src/engine/spells.js` plays them alongside spells. **The user confirmed every default (B1–B6) on 2026-10-08.**

| # | Question | Default chosen | Why |
|---|---|---|---|
| B1 | Who uses the basic actions (Demoralize, Trip, Grapple, Shove, Escape)? | Every PC. A monster uses one only if its stat block lists the skill (Athletics for Trip, Grapple and Shove; Intimidation for Demoralize). Anyone can Escape. Monsters also use the riders their Strikes list. | A stat block's skills show what the creature is built to do. |
| B2 | Frightful Presence and other auras that make creatures save. | Each enemy in range saves once when the fight starts, then is immune. From 60 feet, that's everyone; nearer, not those in the far band. | "A creature that first enters the area". Bands can't track entering an aura later. |
| B3 | Recharge ("can't use it again for 1d4 rounds"). | Roll it when the ability is used; it's available again at the start of the creature's turn that many rounds later. | PF2e's usual reading. |
| B4 | Riders (Grab, Knockdown, Push). | The Grapple, Trip or Shove the Strike allows, with no multiple attack penalty. It can only be the action straight after the hit; Improved ones happen at once, for free. A creature grabbed or restrained is held until the end of the grabber's next turn, unless the grabber moves or the creature Escapes. | PF2e's glossary and Grapple's own text. |
| B5 | Rend and Ferocity. | Rend: the listed Strike's damage again, after two hits with it on the same enemy this round. Ferocity: once per round, a monster reduced to 0 HP stays at 1 with wounded +1, until wounded 3; massive damage still kills. | PF2e's glossary. |
| B6 | How conditions and buffs compare to damage in planning. | **Tuned on 2026-10-08:** conditions and spell effects (measured in rounds of a creature's threat) count for a third, next to damage (measured as a share of HP, where a kill counts once). A fight has about three rounds left, so a round of threat is about a third of a kill. Without this, the martial party Grappled about 5½ times a fight instead of Striking. | Keeps the S7 weights, which the user confirmed as estimates "to tune as results come in". |

**Not yet:** Swallow Whole, Trample, Reposition, Disarm and Feint; class features; consumables; and live-play confirmation cards.

**Measured** (`tools/bestiary-abilities.mjs`, 2026-10-08):
- Setup: 1,106 creatures from Monster Core 1–2 and NPC Core, built from their real stat blocks with their abilities; 548 of them have abilities the simulation plays.
- 3,318 fights in 7 seconds, with no errors.
- Per 3,318 fights: Trip 1,152, Demoralize 717, Escape 283, Frightful Presence 123, Grab 99, Constrict 99, Ferocity 64, plus dozens of breath weapons and other one-off abilities.
